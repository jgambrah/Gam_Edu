import { NextRequest, NextResponse } from 'next/server';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

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

export async function PUT(request: NextRequest) {
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
    const userName = decoded.name || decoded.email || 'Warden';

    const body = await request.json();
    const { leaveId, action } = body; // action is 'Approve' or 'Reject'

    if (!leaveId || !action) {
      return NextResponse.json({ error: 'Missing leaveId or action' }, { status: 400 });
    }

    if (!['Approve', 'Reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be Approve or Reject' }, { status: 400 });
    }

    // 1. Verify approval permissions (Warden / Admin)
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    let hasApprovalPower = isSuperAdmin;

    if (!hasApprovalPower) {
      const staffDoc = await db.collection('staff').doc(userId).get();
      const staffData = staffDoc.data();
      if (staffData && ['Director', 'Administrator', 'Admin', 'Warden', 'Boarding Staff'].includes(staffData.role)) {
        hasApprovalPower = true;
      } else {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (userData && ['Director', 'Administrator', 'Admin', 'Warden', 'Boarding Staff'].includes(userData.role)) {
          hasApprovalPower = true;
        }
      }
    }

    if (!hasApprovalPower) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to approve/reject leaves' }, { status: 403 });
    }

    // 2. Perform Warden transaction
    const result = await db.runTransaction(async (t) => {
      const leaveRef = db.collection('student_leaves').doc(leaveId);
      const leaveSnap = await t.get(leaveRef);

      if (!leaveSnap.exists) {
        throw new Error('Leave request not found');
      }

      const leaveData = leaveSnap.data()!;
      if (leaveData.status !== 'Pending') {
        throw new Error(`Leave request is already resolved (Current status: ${leaveData.status})`);
      }

      // Generate a unique Gate Pass Token if approved
      let gatePassToken = null;
      if (action === 'Approve') {
        const code = Math.random().toString(36).substring(2, 11).toUpperCase();
        gatePassToken = `GP-${code}`;
      }

      const status = action === 'Approve' ? 'Approved' : 'Rejected';

      t.update(leaveRef, {
        status,
        gatePassToken,
        approvedById: userId,
        approvedByName: userName,
        approvedAt: new Date(),
      });

      return { status, gatePassToken };
    });

    return NextResponse.json({ success: true, ...result }, { status: 200 });

  } catch (error: any) {
    console.error('PUT /api/leaves/approve error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
