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
    const userName = decoded.name || decoded.email || 'Medical Staff';

    // Verify permission (Nurse, Doctor, Warden, Staff, Admin)
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    let hasMedicalPermissions = isSuperAdmin;
    let schoolId = '';

    if (!isSuperAdmin) {
      const staffDoc = await db.collection('staff').doc(userId).get();
      const staffData = staffDoc.data();
      if (staffDoc.exists) {
        hasMedicalPermissions = true;
        schoolId = staffData?.schoolId;
      } else {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (userDoc.exists) {
          hasMedicalPermissions = true;
          schoolId = userData?.schoolId;
        }
      }
    } else {
      const { searchParams } = new URL(request.url);
      schoolId = searchParams.get('schoolId') || '';
    }

    if (!hasMedicalPermissions) {
      return NextResponse.json({ error: 'Forbidden: You do not have permissions to write infirmary logs' }, { status: 403 });
    }

    const body = await request.json();
    const { studentId, reportedSymptoms, treatmentAdministered, disposition, isSevereTriage } = body;

    // Set schoolId from body if super admin
    if (!schoolId && body.schoolId) {
      schoolId = body.schoolId;
    }

    if (!schoolId) {
      return NextResponse.json({ error: 'Missing schoolId context' }, { status: 400 });
    }

    if (!studentId || !reportedSymptoms || !treatmentAdministered || !disposition) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!['Returned to Dorm', 'Kept for Observation', 'Transferred to Hospital'].includes(disposition)) {
      return NextResponse.json({ error: 'Invalid disposition value' }, { status: 400 });
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

    // Save medical log
    const logRef = db.collection('infirmary_logs').doc();
    const visitDate = new Date();
    
    const medicalLogData = {
      id: logRef.id,
      schoolId,
      studentId,
      studentName,
      visitDate,
      reportedSymptoms,
      treatmentAdministered,
      disposition,
      isSevereTriage: !!isSevereTriage,
      treatingStaffId: userId,
      treatingStaffName: userName,
      createdAt: visitDate,
    };

    await logRef.set(medicalLogData);

    // Save to student timeline as health category milestone
    try {
      let academicYear = '';
      let term = '';
      const settingsDoc = await db.collection('schoolSettings').doc(schoolId).get();
      if (settingsDoc.exists) {
        const settingsData = settingsDoc.data();
        academicYear = settingsData?.academicYear || '';
        term = settingsData?.term || '';
      }

      const timelineRef = db.collection('students').doc(studentId).collection('timeline').doc();
      await timelineRef.set({
        id: timelineRef.id,
        studentId,
        title: `Infirmary Visit: ${isSevereTriage ? 'Severe Alert' : 'Log'}`,
        description: `Seen at Sick Bay for reported symptoms: "${reportedSymptoms}". Treatment Administered: "${treatmentAdministered}". Disposition: ${disposition}.`,
        category: 'health',
        academicYear,
        term,
        classId: studentData.classId || null,
        className: null,
        recordedBy: userName,
        recordedById: userId,
        attachments: [],
        metadata: {
          reportedSymptoms,
          treatmentAdministered,
          disposition,
          isSevereTriage: !!isSevereTriage,
          treatingStaffName: userName
        },
        date: visitDate,
        createdAt: visitDate,
        schoolId
      });
    } catch (timelineErr) {
      console.error('Failed to write medical timeline event:', timelineErr);
    }

    // Trigger parent and staff/warden/admin notifications asynchronously
    try {
      await NotificationService.triggerMedicalVisitEvent(db, studentId, studentName, {
        schoolId,
        reportedSymptoms,
        treatmentAdministered,
        disposition,
        isSevereTriage: !!isSevereTriage,
        treatingStaffName: userName,
      });
    } catch (err) {
      console.error('Failed to trigger medical notifications:', err);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Infirmary log saved successfully', 
      logId: logRef.id, 
      isSevereTriage: !!isSevereTriage,
      escalationAlertSent: !!isSevereTriage
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/medical/visit error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
