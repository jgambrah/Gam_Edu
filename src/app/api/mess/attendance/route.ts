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
    const userName = decoded.name || decoded.email || 'Mess Attendant';

    // Verify permission (Cook, Security Officer, Warden, Admin, Director, generic staff)
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    let hasDiningPermissions = isSuperAdmin;
    let schoolId = '';

    if (!isSuperAdmin) {
      const staffDoc = await db.collection('staff').doc(userId).get();
      const staffData = staffDoc.data();
      if (staffDoc.exists) {
        // Any staff can help log or verify dining attendance
        hasDiningPermissions = true;
        schoolId = staffData?.schoolId;
      } else {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (userDoc.exists) {
          hasDiningPermissions = true;
          schoolId = userData?.schoolId;
        }
      }
    } else {
      const { searchParams } = new URL(request.url);
      schoolId = searchParams.get('schoolId') || '';
    }

    if (!hasDiningPermissions) {
      return NextResponse.json({ error: 'Forbidden: You do not have permissions to log dining attendance' }, { status: 403 });
    }

    const body = await request.json();
    const { date, mealType, studentId, status } = body;

    // Set schoolId from body if super admin
    if (!schoolId && body.schoolId) {
      schoolId = body.schoolId;
    }

    if (!schoolId) {
      return NextResponse.json({ error: 'Missing schoolId context' }, { status: 400 });
    }

    if (!date || !mealType || !studentId || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Invalid date format. Expected YYYY-MM-DD' }, { status: 400 });
    }

    if (!['Breakfast', 'Lunch', 'Dinner'].includes(mealType)) {
      return NextResponse.json({ error: 'Invalid mealType. Must be Breakfast, Lunch, or Dinner' }, { status: 400 });
    }

    if (!['Attended', 'Missed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be Attended or Missed' }, { status: 400 });
    }

    // Resolve student profile and name
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    const studentData = studentDoc.data()!;
    if (studentData.schoolId !== schoolId) {
      return NextResponse.json({ error: 'Forbidden: Student is from a different school' }, { status: 403 });
    }
    const studentName = `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim() || 'Unknown Student';

    const docId = `${schoolId}_${date}_${mealType}_${studentId}`;
    const attendanceRef = db.collection('mess_attendance').doc(docId);

    const attendanceData = {
      id: docId,
      schoolId,
      date,
      mealType,
      studentId,
      studentName,
      status,
      recordedById: userId,
      recordedByName: userName,
      timestamp: new Date(),
    };

    await attendanceRef.set(attendanceData);

    return NextResponse.json({ success: true, message: 'Dining attendance logged successfully', attendanceId: docId }, { status: 200 });

  } catch (error: any) {
    console.error('POST /api/mess/attendance error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
