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
    const userEmail = decoded.email || '';
    const userName = decoded.name || userEmail || 'User';

    const body = await request.json();
    const { 
      studentId, 
      studentName, 
      leaveType, 
      departureDate, 
      expectedReturnDate, 
      destination, 
      reason, 
      parentContact 
    } = body;

    if (!studentId || !studentName || !leaveType || !departureDate || !expectedReturnDate || !destination || !reason || !parentContact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['Day Outing', 'Weekend Leave', 'Vacation'].includes(leaveType)) {
      return NextResponse.json({ error: 'Invalid leave type' }, { status: 400 });
    }

    // 1. Fetch Student profile to verify schoolId
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    const studentData = studentDoc.data()!;
    const schoolId = studentData.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'Student is not assigned to a school' }, { status: 400 });
    }

    // 2. Fetch User Profile to determine role and verify relationship
    let userRole: 'Parent' | 'Student' | 'Staff' = 'Student';
    
    // Check if user is parent
    const parentDoc = await db.collection('parents').doc(userId).get();
    const staffDoc = await db.collection('staff').doc(userId).get();
    
    if (parentDoc.exists) {
      userRole = 'Parent';
      // Verify parent is linked to this student
      const studentIds = parentDoc.data()?.studentIds || [];
      if (!studentIds.includes(studentId)) {
        return NextResponse.json({ error: 'Unauthorized: You are not linked to this student' }, { status: 403 });
      }
    } else if (staffDoc.exists) {
      userRole = 'Staff';
    } else {
      // If student is applying for themselves
      if (userId !== studentId) {
        // Also check users collection just in case
        const userProfileDoc = await db.collection('users').doc(userId).get();
        const userProfile = userProfileDoc.data();
        if (userProfile && userProfile.role === 'Parent') {
          userRole = 'Parent';
        } else if (userProfile && ['Director', 'Administrator', 'Admin'].includes(userProfile.role)) {
          userRole = 'Staff';
        } else {
          // If they are a student but not this student
          return NextResponse.json({ error: 'Unauthorized: You can only apply for your own leaves' }, { status: 403 });
        }
      }
    }

    // 3. Create the student leave request doc
    const leaveRef = db.collection('student_leaves').doc();
    const leaveDocData = {
      id: leaveRef.id,
      schoolId,
      studentId,
      studentName,
      leaveType,
      departureDate: new Date(departureDate),
      expectedReturnDate: new Date(expectedReturnDate),
      destination,
      reason,
      parentContact,
      status: 'Pending',
      gatePassToken: null,
      approvedById: null,
      approvedByName: null,
      approvedAt: null,
      actualDepartureTime: null,
      actualReturnTime: null,
      securityCheckOutById: null,
      securityCheckOutByName: null,
      securityCheckInById: null,
      securityCheckInByName: null,
      createdAt: new Date(),
      createdBy: userId,
      createdByName: userName,
      createdByRole: userRole === 'Staff' ? 'Parent' : userRole // Default to Parent if staff applied on behalf
    };

    await leaveRef.set(leaveDocData);

    return NextResponse.json({ success: true, leaveId: leaveRef.id }, { status: 200 });

  } catch (error: any) {
    console.error('POST /api/leaves/apply error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
