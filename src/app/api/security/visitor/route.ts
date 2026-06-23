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

    // Verify roles (Security Officer, Warden, Admin, Staff)
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    let hasSecurityPermissions = isSuperAdmin;

    if (!hasSecurityPermissions) {
      const staffDoc = await db.collection('staff').doc(userId).get();
      const staffData = staffDoc.data();
      if (staffData && ['Director', 'Administrator', 'Admin', 'Security Officer', 'Warden', 'Boarding Staff'].includes(staffData.role)) {
        hasSecurityPermissions = true;
      } else {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (userData && ['Director', 'Administrator', 'Admin', 'Security Officer', 'Warden', 'Boarding Staff'].includes(userData.role)) {
          hasSecurityPermissions = true;
        }
      }
    }

    if (!hasSecurityPermissions) {
      return NextResponse.json({ error: 'Forbidden: You do not have security logging permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { visitorId } = body;

    // A. CHECK-OUT FLOW
    if (visitorId) {
      const result = await db.runTransaction(async (t) => {
        const visitorRef = db.collection('boarding_visitors').doc(visitorId);
        const visitorSnap = await t.get(visitorRef);

        if (!visitorSnap.exists) {
          throw new Error('Visitor log record not found');
        }

        const visitorData = visitorSnap.data()!;
        if (visitorData.checkOutTime) {
          throw new Error('Visitor has already checked out');
        }

        t.update(visitorRef, {
          checkOutTime: new Date(),
        });

        return { visitorId, checkOutTime: new Date() };
      });

      return NextResponse.json({ success: true, message: 'Visitor checked out successfully', ...result }, { status: 200 });
    }

    // B. CHECK-IN FLOW
    const { visitorName, contactNumber, relationshipToStudent, photoIdUrl, studentId } = body;

    if (!visitorName || !contactNumber || !relationshipToStudent || !photoIdUrl || !studentId) {
      return NextResponse.json({ error: 'Missing required fields for visitor check-in' }, { status: 400 });
    }

    // Fetch student data to resolve name and schoolId
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    const studentData = studentDoc.data()!;
    const schoolId = studentData.schoolId;
    const studentName = `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim() || 'Unknown Student';

    if (!schoolId) {
      return NextResponse.json({ error: 'Student is not assigned to a school' }, { status: 400 });
    }

    const visitorRef = db.collection('boarding_visitors').doc();
    const visitorData = {
      id: visitorRef.id,
      schoolId,
      visitorName,
      contactNumber,
      relationshipToStudent,
      photoIdUrl,
      studentId,
      studentName,
      checkInTime: new Date(),
      checkOutTime: null,
      recordedById: userId,
      recordedByName: userName,
      createdAt: new Date(),
    };

    await visitorRef.set(visitorData);

    return NextResponse.json({ success: true, message: 'Visitor checked in successfully', visitorId: visitorRef.id, checkInTime: visitorData.checkInTime }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/security/visitor error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
