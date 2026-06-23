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

    const body = await request.json();
    const { studentId, newStatus } = body;

    if (!studentId || !newStatus) {
      return NextResponse.json({ error: 'Missing studentId or newStatus' }, { status: 400 });
    }

    const validStatuses = ['Active', 'Inactive', 'Suspended', 'Withdrawn', 'Graduated'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: `Invalid status: ${newStatus}` }, { status: 400 });
    }

    const result = await db.runTransaction(async (t) => {
      // 1. Fetch Student
      const studentRef = db.collection('students').doc(studentId);
      const studentSnap = await t.get(studentRef);
      if (!studentSnap.exists) throw new Error('Student not found');
      
      const student = studentSnap.data()!;
      const schoolId = student.schoolId;
      const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';

      // 2. Fetch User performing the action to check access
      const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
      if (!isSuperAdmin) {
        const staffDoc = await t.get(db.collection('staff').doc(userId));
        const staffData = staffDoc.data();
        if (!staffData || staffData.schoolId !== schoolId) {
          throw new Error('Forbidden: School access mismatch');
        }
        // Verify user role
        const role = staffData.role;
        const isAuthorized = ['Director', 'Administrator', 'Admin'].includes(role);
        if (!isAuthorized) {
          throw new Error('Unauthorized to manage student status');
        }
      }

      // 3. Update student status
      t.update(studentRef, {
        enrollmentStatus: newStatus,
        updatedAt: new Date()
      });

      // 4. Handle Boarding Room Clearance if status changes to Suspended or Withdrawn
      let clearedAllocation = null;
      if (newStatus === 'Suspended' || newStatus === 'Withdrawn') {
        const activeAllocQuery = db.collection('hostel_allocations')
          .where('studentId', '==', studentId)
          .where('status', '==', 'Active')
          .limit(1);
        
        const activeAllocSnap = await t.get(activeAllocQuery);
        
        if (!activeAllocSnap.empty) {
          const allocDoc = activeAllocSnap.docs[0];
          const allocData = allocDoc.data();
          clearedAllocation = allocData;

          // Close active allocation
          t.update(allocDoc.ref, {
            checkOutDate: new Date(),
            status: 'Completed'
          });

          // Free Bed
          const bedRef = db.collection('hostel_beds').doc(allocData.bedId);
          t.update(bedRef, {
            status: 'Available',
            currentOccupantId: null
          });

          // Recalculate Room status
          const roomRef = db.collection('hostel_rooms').doc(allocData.roomId);
          const roomSnap = await t.get(roomRef);
          if (roomSnap.exists) {
            const room = roomSnap.data()!;
            
            // Query beds in this room
            const bedsSnap = await t.get(db.collection('hostel_beds').where('roomId', '==', allocData.roomId));
            const remainingOccupants = bedsSnap.docs
              .map(d => d.data().currentOccupantId)
              .filter(id => id && id !== studentId).length;

            const isRoomFull = remainingOccupants >= (room.totalCapacity || 1);
            t.update(roomRef, {
              status: isRoomFull ? 'Full' : 'Available'
            });
          }
        }
      }

      return { success: true, schoolId, studentName, clearedAllocation };
    });

    // 5. Trigger Notifications outside of the transaction if an allocation was cleared
    if (result.clearedAllocation && (newStatus === 'Suspended' || newStatus === 'Withdrawn')) {
      await NotificationService.triggerRoomClearanceEvent(
        db,
        studentId,
        result.studentName,
        result.schoolId,
        newStatus,
        {
          blockName: result.clearedAllocation.blockName,
          roomNumber: result.clearedAllocation.roomNumber,
          bedIdentifier: result.clearedAllocation.bedIdentifier,
        }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('POST /api/students/status-change error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
