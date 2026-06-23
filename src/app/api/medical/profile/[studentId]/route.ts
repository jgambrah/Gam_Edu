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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
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

    const { studentId } = await params;

    if (!studentId) {
      return NextResponse.json({ error: 'Missing studentId path parameter' }, { status: 400 });
    }

    // 1. Fetch Student profile
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = studentDoc.data()!;
    const schoolId = student.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'Student is not assigned to a school' }, { status: 400 });
    }

    // 2. Verify school access
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    if (!isSuperAdmin) {
      const staffDoc = await db.collection('staff').doc(userId).get();
      const staffData = staffDoc.data();
      if (staffData && staffData.schoolId !== schoolId) {
        return NextResponse.json({ error: 'Forbidden: School access mismatch' }, { status: 403 });
      } else if (!staffDoc.exists) {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (!userData || userData.schoolId !== schoolId) {
          // If the requester is the student or parent of the student, let them pass
          const parentDoc = await db.collection('parents').doc(userId).get();
          const parentData = parentDoc.data();
          const isLinkedParent = parentData && parentData.studentIds && parentData.studentIds.includes(studentId);
          const isStudentSelf = userId === studentId;
          
          if (!isLinkedParent && !isStudentSelf) {
            return NextResponse.json({ error: 'Forbidden: School access mismatch' }, { status: 403 });
          }
        }
      }
    }

    // Resolve bloodGroup, chronicIllnesses, allergies, and healthNotes
    const bloodGroup = student.bloodGroup || student.medical?.bloodGroup || 'Unknown';
    const chronicIllnesses = student.chronicIllnesses || student.medical?.conditions || 'None';
    const allergies = student.allergies || student.medical?.allergies || 'None';
    const healthNotes = student.healthNotes || 'None';

    // 3. Fetch historic medical logs for this student
    const logsSnap = await db.collection('infirmary_logs')
      .where('studentId', '==', studentId)
      .get();

    const medicalLogs = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort in memory to avoid composite index requirements
    medicalLogs.sort((a: any, b: any) => {
      const timeA = a.visitDate && a.visitDate.toDate ? a.visitDate.toDate().getTime() : new Date(a.visitDate || 0).getTime();
      const timeB = b.visitDate && b.visitDate.toDate ? b.visitDate.toDate().getTime() : new Date(b.visitDate || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({
      success: true,
      studentInfo: {
        id: studentDoc.id,
        firstName: student.firstName,
        lastName: student.lastName,
        classId: student.classId || 'Unassigned',
        gender: student.gender || 'Unknown',
        dateOfBirth: student.dateOfBirth || null,
      },
      bloodGroup,
      chronicIllnesses,
      allergies,
      healthNotes,
      medicalLogs,
    }, { status: 200 });

  } catch (error: any) {
    console.error('GET /api/medical/profile error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
