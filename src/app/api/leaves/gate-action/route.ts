import { NextRequest, NextResponse } from 'next/server';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { NotificationService } from '@/lib/notification-service';

const formatPrivateKey = (key: string) => {
  return key.replace(/\\n/g, '\n').replace(/"/g, ''); 
};

function getAdminApp() {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKeyRaw) {
    throw new Error("Missing Firebase Admin credentials in environment variables.");
  }
  
  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: formatPrivateKey(privateKeyRaw),
    }),
  }, 'admin');
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];

    const adminApp = getAdminApp();
    const auth = getAuth(adminApp);
    const db = getFirestore(adminApp);

    // Verify token
    const decoded = await auth.verifyIdToken(token);
    const userId = decoded.uid;
    const userName = decoded.name || decoded.email || 'Security Officer';

    const body = await request.json();
    const { gatePassToken, action } = body; // action is 'checkout' or 'checkin'

    if (!gatePassToken || !action) {
      return NextResponse.json({ error: 'Missing gatePassToken or action' }, { status: 400 });
    }

    if (!['checkout', 'checkin'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be checkout or checkin' }, { status: 400 });
    }

    // 1. Verify gate execution permissions (Security Officer / Staff / Admin)
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    let hasGatePermissions = isSuperAdmin;

    if (!hasGatePermissions) {
      const staffDoc = await db.collection('staff').doc(userId).get();
      const staffData = staffDoc.data();
      if (staffData && ['Director', 'Administrator', 'Admin', 'Security Officer', 'Warden', 'Boarding Staff'].includes(staffData.role)) {
        hasGatePermissions = true;
      } else {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (userData && ['Director', 'Administrator', 'Admin', 'Security Officer', 'Warden', 'Boarding Staff'].includes(userData.role)) {
          hasGatePermissions = true;
        }
      }
    }

    if (!hasGatePermissions) {
      return NextResponse.json({ error: 'Forbidden: You do not have security gate logging permissions' }, { status: 403 });
    }

    // 2. Fetch the corresponding leave record by token
    const querySnap = await db.collection('student_leaves')
      .where('gatePassToken', '==', gatePassToken)
      .limit(1)
      .get();

    if (querySnap.empty) {
      return NextResponse.json({ error: 'Invalid Digital Gate Pass token' }, { status: 404 });
    }

    const leaveDocRef = querySnap.docs[0].ref;

    // 3. Process checkout/checkin atomically in a transaction
    const result = await db.runTransaction(async (t) => {
      const leaveSnap = await t.get(leaveDocRef);
      const leaveData = leaveSnap.data()!;

      if (action === 'checkout') {
        if (leaveData.status !== 'Approved') {
          throw new Error(`Cannot checkout student: Current leave status is '${leaveData.status}', but must be 'Approved'`);
        }

        t.update(leaveDocRef, {
          status: 'CheckedOut',
          actualDepartureTime: new Date(),
          securityCheckOutById: userId,
          securityCheckOutByName: userName,
        });

        return { status: 'CheckedOut', leaveData };
      } else {
        // action === 'checkin'
        if (leaveData.status !== 'CheckedOut') {
          throw new Error(`Cannot checkin student: Current leave status is '${leaveData.status}', but must be 'CheckedOut'`);
        }

        t.update(leaveDocRef, {
          status: 'Completed',
          actualReturnTime: new Date(),
          securityCheckInById: userId,
          securityCheckInByName: userName,
        });

        return { status: 'Completed', leaveData };
      }
    });

    // 4. Trigger parents gate alert notification asynchronously
    try {
      await NotificationService.triggerGatePassEvent(
        db,
        result.leaveData.studentId,
        result.leaveData.studentName,
        action,
        {
          leaveType: result.leaveData.leaveType,
          destination: result.leaveData.destination,
          reason: result.leaveData.reason,
          schoolId: result.leaveData.schoolId,
        }
      );
    } catch (err) {
      console.error('Failed to trigger gate pass notifications:', err);
    }

    return NextResponse.json({ success: true, status: result.status }, { status: 200 });

  } catch (error: any) {
    console.error('POST /api/leaves/gate-action error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
