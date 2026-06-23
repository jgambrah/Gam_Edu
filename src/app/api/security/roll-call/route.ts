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
    const userName = decoded.name || decoded.email || 'Warden';

    // Verify permission (Warden, Director, Administrator, Admin, Boarding Staff)
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    let hasWardenPermissions = isSuperAdmin;

    let schoolId = '';

    if (!isSuperAdmin) {
      const staffDoc = await db.collection('staff').doc(userId).get();
      const staffData = staffDoc.data();
      if (staffData && ['Director', 'Administrator', 'Admin', 'Warden', 'Boarding Staff'].includes(staffData.role)) {
        hasWardenPermissions = true;
        schoolId = staffData.schoolId;
      } else {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (userData && ['Director', 'Administrator', 'Admin', 'Warden', 'Boarding Staff'].includes(userData.role)) {
          hasWardenPermissions = true;
          schoolId = userData.schoolId;
        }
      }
    } else {
      // Super admin can specify schoolId in searchParams or default to request body
      const { searchParams } = new URL(request.url);
      schoolId = searchParams.get('schoolId') || '';
    }

    if (!hasWardenPermissions) {
      return NextResponse.json({ error: 'Forbidden: You do not have roll-call logging permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { date, presentStudentIds } = body; // date is ISO string, presentStudentIds is array of studentIds

    if (!date || !presentStudentIds || !Array.isArray(presentStudentIds)) {
      return NextResponse.json({ error: 'Missing date or presentStudentIds list' }, { status: 400 });
    }

    // Resolve schoolId if missing (must be super admin context)
    if (!schoolId && body.schoolId) {
      schoolId = body.schoolId;
    }

    if (!schoolId) {
      return NextResponse.json({ error: 'Missing schoolId context' }, { status: 400 });
    }

    // 1. Run roll-call calculation in a transaction or process atomically
    // Fetch all active hostel allocations for the school
    const activeAllocSnap = await db.collection('hostel_allocations')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'Active')
      .get();

    const activeAllocations = activeAllocSnap.docs.map(doc => doc.data());
    const allocatedStudentIds = Array.from(new Set(activeAllocations.map(a => a.studentId)));

    // Fetch all checked out leave requests for this school
    const checkedOutLeavesSnap = await db.collection('student_leaves')
      .where('schoolId', '==', schoolId)
      .where('status', '==', 'CheckedOut')
      .get();

    const checkedOutStudentIds = new Set(checkedOutLeavesSnap.docs.map(doc => doc.data().studentId));

    const presentSet = new Set(presentStudentIds);
    const unaccountedList: string[] = [];
    const legallyAbsentList: string[] = [];
    const presentList: string[] = [];

    // Analyze roll-call status for each student allocated to boarding
    for (const studentId of allocatedStudentIds) {
      if (presentSet.has(studentId)) {
        presentList.push(studentId);
      } else {
        // Student is absent from roll call. Are they legally checked out on outing/leave?
        if (checkedOutStudentIds.has(studentId)) {
          legallyAbsentList.push(studentId);
        } else {
          // Absent and not checked out legally -> Flagged as missing/unaccounted!
          unaccountedList.push(studentId);
        }
      }
    }

    // 2. Save Roll Call report
    const rollCallRef = db.collection('roll_calls').doc();
    const reportData = {
      id: rollCallRef.id,
      schoolId,
      date,
      presentCount: presentList.length,
      absentCount: unaccountedList.length + legallyAbsentList.length,
      unaccountedCount: unaccountedList.length,
      legallyAbsentCount: legallyAbsentList.length,
      presentStudentIds: presentList,
      unaccountedStudentIds: unaccountedList,
      legallyAbsentStudentIds: legallyAbsentList,
      recordedById: userId,
      recordedByName: userName,
      createdAt: new Date()
    };

    await rollCallRef.set(reportData);

    // 3. Trigger immediate warnings for all unaccounted students asynchronously
    if (unaccountedList.length > 0) {
      for (const studentId of unaccountedList) {
        try {
          await NotificationService.triggerUnaccountedRollCallEvent(
            db,
            studentId,
            date,
            userName
          );
        } catch (err) {
          console.error(`Failed to send unaccounted notification for student ${studentId}:`, err);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Roll-call logged. ${unaccountedList.length} students flagged as Unaccounted.`,
      reportId: rollCallRef.id,
      unaccountedCount: unaccountedList.length,
      unaccountedStudentIds: unaccountedList,
      legallyAbsentCount: legallyAbsentList.length,
      legallyAbsentStudentIds: legallyAbsentList
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/security/roll-call error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
