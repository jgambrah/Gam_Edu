import { NextRequest, NextResponse } from 'next/server';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';

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

function getGradeTier(className: string): string {
  const name = className.toLowerCase();
  if (name.includes('creche') || name.includes('nursery') || name.includes('kg') || name.includes('kindergarten')) {
    return 'Nursery';
  }
  if (name.includes('jhs') || name.includes('junior high') || name.includes('grade 7') || name.includes('grade 8') || name.includes('grade 9')) {
    return 'JHS';
  }
  if (name.includes('shs') || name.includes('senior high') || name.includes('grade 10') || name.includes('grade 11') || name.includes('grade 12')) {
    return 'SHS';
  }
  return 'Primary';
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
    const allocatedByName = decoded.name || decoded.email || 'Staff member';

    const body = await request.json();
    const { studentId, newBedId } = body;

    if (!studentId || !newBedId) {
      return NextResponse.json({ error: 'Missing studentId or newBedId' }, { status: 400 });
    }

    // Fetch target newBed outside transaction to get roomId
    const newBedRef = db.collection('hostel_beds').doc(newBedId);
    const newBedQuerySnap = await newBedRef.get();
    if (!newBedQuerySnap.exists) {
      return NextResponse.json({ error: 'New Bed not found' }, { status: 404 });
    }
    const newBedData = newBedQuerySnap.data()!;
    const newRoomId = newBedData.roomId;

    // Fetch beds in the new room to evaluate compatibility rules
    const newRoomBedsQuerySnap = await db.collection('hostel_beds').where('roomId', '==', newRoomId).get();
    const newRoomBedRefs = newRoomBedsQuerySnap.docs.map(doc => doc.ref);

    // Fetch student's current active allocation
    const activeAllocQuerySnap = await db.collection('hostel_allocations')
      .where('studentId', '==', studentId)
      .where('status', '==', 'Active')
      .limit(1)
      .get();

    // If active allocation exists, fetch old room's beds to compute remaining occupants later
    let oldRoomBedsRefs: FirebaseFirestore.DocumentReference[] = [];
    if (!activeAllocQuerySnap.empty) {
      const oldAlloc = activeAllocQuerySnap.docs[0].data();
      if (oldAlloc.roomId) {
        const oldRoomBedsQuerySnap = await db.collection('hostel_beds').where('roomId', '==', oldAlloc.roomId).get();
        oldRoomBedsRefs = oldRoomBedsQuerySnap.docs.map(doc => doc.ref);
      }
    }

    const result = await db.runTransaction(async (t) => {
      // 1. Fetch New Bed
      const newBedSnap = await t.get(newBedRef);
      if (!newBedSnap.exists) throw new Error('New Bed not found');
      
      const newBed = newBedSnap.data()!;
      if (newBed.status === 'Occupied' || newBed.currentOccupantId) {
        throw new Error('New Bed is already occupied');
      }

      const schoolId = newBed.schoolId;

      // 2. Fetch New Room
      const newRoomRef = db.collection('hostel_rooms').doc(newBed.roomId);
      const newRoomSnap = await t.get(newRoomRef);
      if (!newRoomSnap.exists) throw new Error('New Room not found');
      
      const newRoom = newRoomSnap.data()!;
      if (newRoom.status === 'Inactive' || newRoom.status === 'Maintenance') {
        throw new Error('New Room is currently inactive or under maintenance');
      }

      // 3. Fetch New Block
      const newBlockRef = db.collection('hostel_blocks').doc(newRoom.blockId);
      const newBlockSnap = await t.get(newBlockRef);
      if (!newBlockSnap.exists) throw new Error('New Hostel block not found');
      const newBlock = newBlockSnap.data()!;

      // 4. Fetch Student
      const studentRef = db.collection('students').doc(studentId);
      const studentSnap = await t.get(studentRef);
      if (!studentSnap.exists) throw new Error('Student not found');
      
      const student = studentSnap.data()!;
      if (student.enrollmentStatus !== 'Active') {
        throw new Error('Student profile is inactive or graduated');
      }

      // Fetch Old Allocation Info (Pre-fetch all snaps before any writes!)
      let oldAllocSnap: any = null;
      let oldRoomSnap: any = null;
      let oldRoomBedsSnaps: any[] = [];
      let oldAllocDocRef: any = null;
      let oldBedRef: any = null;
      let oldRoomRef: any = null;

      if (!activeAllocQuerySnap.empty) {
        oldAllocDocRef = activeAllocQuerySnap.docs[0].ref;
        oldAllocSnap = await t.get(oldAllocDocRef);
        if (oldAllocSnap.exists) {
          const oldAlloc = oldAllocSnap.data()!;
          oldBedRef = db.collection('hostel_beds').doc(oldAlloc.bedId);
          oldRoomRef = db.collection('hostel_rooms').doc(oldAlloc.roomId);
          oldRoomSnap = await t.get(oldRoomRef);
          oldRoomBedsSnaps = await Promise.all(oldRoomBedsRefs.map(ref => t.get(ref)));
        }
      }

      // 5. Gender Match Validation for the new block
      const restriction = newBlock.genderRestriction?.toLowerCase();
      const gender = student.gender?.toLowerCase();
      if (restriction === 'male' && gender !== 'male' && gender !== 'm') {
        throw new Error('Gender mismatch: This block is reserved for Male students.');
      }
      if (restriction === 'female' && gender !== 'female' && gender !== 'f') {
        throw new Error('Gender mismatch: This block is reserved for Female students.');
      }

      // 6. Compatibility Rules (Fetch other occupants in the new room using pre-fetched refs)
      const newRoomBedsSnaps = await Promise.all(newRoomBedRefs.map(ref => t.get(ref)));
      const occupantIds = newRoomBedsSnaps
        .map(d => d.data()?.currentOccupantId)
        .filter(Boolean) as string[];

      const occupantDocs = [];
      for (const occId of occupantIds) {
        const occDoc = await t.get(db.collection('students').doc(occId));
        if (occDoc.exists) occupantDocs.push(occDoc.data()!);
      }

      // Age compatibility check
      if (student.dateOfBirth) {
        const studentDob = new Date(student.dateOfBirth);
        for (const occ of occupantDocs) {
          if (occ.dateOfBirth) {
            const occDob = new Date(occ.dateOfBirth);
            const diffYears = Math.abs(studentDob.getFullYear() - occDob.getFullYear());
            if (diffYears > 4) {
              throw new Error(`Age compatibility violation: Student age difference exceeds 4 years with occupant ${occ.firstName} ${occ.lastName}.`);
            }
          }
        }
      }

      // Grade compatibility check
      const classIds = Array.from(new Set([student.classId, ...occupantDocs.map(o => o.classId)].filter(Boolean))) as string[];
      const classesMap: Record<string, any> = {};
      for (const cid of classIds) {
        const cdoc = await t.get(db.collection('classes').doc(cid));
        if (cdoc.exists) classesMap[cid] = cdoc.data()!;
      }

      const studentClass = classesMap[student.classId];
      if (studentClass) {
        const studentTier = getGradeTier(studentClass.name);
        for (const occ of occupantDocs) {
          const occClass = classesMap[occ.classId];
          if (occClass) {
            const occTier = getGradeTier(occClass.name);
            if (studentTier !== occTier) {
              throw new Error(`Grade compatibility violation: Cannot mix ${studentTier} students with ${occTier} students in the same room.`);
            }
          }
        }
      }

      // ── NOW PERFORM ALL WRITES ──

      // 7. Find and close the current active allocation for this student
      if (oldAllocDocRef && oldAllocSnap && oldAllocSnap.exists) {
        const oldAlloc = oldAllocSnap.data()!;

        // Close the old allocation
        t.update(oldAllocDocRef, {
          checkOutDate: new Date(),
          status: 'Completed',
        });

        // Set old bed to Available
        if (oldBedRef) {
          t.update(oldBedRef, {
            status: 'Available',
            currentOccupantId: null,
          });
        }

        // Update old room status if needed
        if (oldRoomRef && oldRoomSnap && oldRoomSnap.exists) {
          const oldRoom = oldRoomSnap.data()!;
          const remainingOccupants = oldRoomBedsSnaps
            .map(d => d.data()?.currentOccupantId)
            .filter(id => id && id !== studentId).length;

          const isOldRoomFull = remainingOccupants >= (oldRoom.totalCapacity || 1);
          t.update(oldRoomRef, {
            status: isOldRoomFull ? 'Full' : 'Available',
          });
        }
      }

      // 8. Allocate to New Bed
      t.update(newBedRef, {
        status: 'Occupied',
        currentOccupantId: studentId,
      });

      const newOccupiedCount = occupantIds.length + 1;
      const isNewRoomFull = newOccupiedCount >= (newRoom.totalCapacity || 1);
      t.update(newRoomRef, {
        status: isNewRoomFull ? 'Full' : 'Available',
      });

      const allocationRef = db.collection('hostel_allocations').doc();
      t.set(allocationRef, {
        id: allocationRef.id,
        schoolId: schoolId,
        studentId: studentId,
        studentName: `${student.firstName} ${student.lastName}`.trim(),
        blockId: newBlock.id,
        blockName: newBlock.name,
        roomId: newRoom.id,
        roomNumber: newRoom.roomNumber,
        bedId: newBed.id,
        bedIdentifier: newBed.bedIdentifier,
        checkInDate: new Date(),
        checkOutDate: null,
        status: 'Active',
        allocatedById: userId,
        allocatedByName: allocatedByName,
        createdAt: new Date(),
      });

      return { success: true, allocationId: allocationRef.id };
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('PUT /api/boarding/transfer error:', error);
    try {
      const logPath = 'c:/Users/LENOVO/OneDrive - Kwame Nkrumah Uni. of Sci. and Tech/Desktop/GAM Med (2)/error_log.txt';
      fs.appendFileSync(logPath, `\n\n--- ${new Date().toISOString()} /api/boarding/transfer error ---\n${error.stack || error.message || error}`);
    } catch (e) {}
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
