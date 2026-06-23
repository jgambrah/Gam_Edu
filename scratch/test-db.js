require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const formatPrivateKey = (key) => {
  return key.replace(/\\n/g, '\n').replace(/"/g, ''); 
};

function init() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  const app = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: formatPrivateKey(privateKeyRaw),
    }),
  }, 'admin-test');
  return getFirestore(app);
}

async function run() {
  const db = init();
  
  // Let's find any student and any occupied bed, or an active allocation to simulate transfer
  try {
    const allocationsSnap = await db.collection('hostel_allocations')
      .where('status', '==', 'Active')
      .limit(1)
      .get();
      
    if (allocationsSnap.empty) {
      console.log('No active allocations found in DB. Let\'s fetch any student.');
      const studentsSnap = await db.collection('students').limit(1).get();
      if (studentsSnap.empty) {
        console.log('No students found in DB.');
        return;
      }
      const studentId = studentsSnap.docs[0].id;
      console.log('Student ID:', studentId);
      
      const bedsSnap = await db.collection('hostel_beds').where('status', '==', 'Available').limit(1).get();
      if (bedsSnap.empty) {
        console.log('No available beds found.');
        return;
      }
      const bedId = bedsSnap.docs[0].id;
      console.log('Available Bed ID:', bedId);
      return;
    }

    const allocation = allocationsSnap.docs[0].data();
    const studentId = allocation.studentId;
    const currentBedId = allocation.bedId;
    console.log(`Simulating transfer for Student: ${studentId} (Current Bed: ${currentBedId})`);

    // Let's find another available bed for transfer
    const bedsSnap = await db.collection('hostel_beds')
      .where('status', '==', 'Available')
      .limit(5)
      .get();

    let newBedId = null;
    for (const doc of bedsSnap.docs) {
      if (doc.id !== currentBedId) {
        newBedId = doc.id;
        break;
      }
    }

    if (!newBedId) {
      console.log('No other available bed found for transfer simulation.');
      return;
    }

    console.log(`New target bed for transfer: ${newBedId}`);

    // Now execute the transfer logic inside a simulated API handler call
    await simulateTransfer(db, studentId, newBedId);

  } catch (err) {
    console.error('Error during execution:', err);
  }
}

async function simulateTransfer(db, studentId, newBedId) {
  try {
    const newBedRef = db.collection('hostel_beds').doc(newBedId);
    const newBedQuerySnap = await newBedRef.get();
    if (!newBedQuerySnap.exists) {
      throw new Error('New Bed not found');
    }
    const newBedData = newBedQuerySnap.data();
    const newRoomId = newBedData.roomId;

    // Fetch beds in the new room
    const newRoomBedsQuerySnap = await db.collection('hostel_beds').where('roomId', '==', newRoomId).get();
    const newRoomBedRefs = newRoomBedsQuerySnap.docs.map(doc => doc.ref);

    // Fetch student's current active allocation
    const activeAllocQuerySnap = await db.collection('hostel_allocations')
      .where('studentId', '==', studentId)
      .where('status', '==', 'Active')
      .limit(1)
      .get();

    let oldRoomBedsRefs = [];
    if (!activeAllocQuerySnap.empty) {
      const oldAlloc = activeAllocQuerySnap.docs[0].data();
      if (oldAlloc.roomId) {
        const oldRoomBedsQuerySnap = await db.collection('hostel_beds').where('roomId', '==', oldAlloc.roomId).get();
        oldRoomBedsRefs = oldRoomBedsQuerySnap.docs.map(doc => doc.ref);
      }
    }

    console.log('All pre-fetched query results loaded. Running transaction...');

    const result = await db.runTransaction(async (t) => {
      // 1. Fetch New Bed
      const newBedSnap = await t.get(newBedRef);
      if (!newBedSnap.exists) throw new Error('New Bed not found');
      
      const newBed = newBedSnap.data();
      if (newBed.status === 'Occupied' || newBed.currentOccupantId) {
        throw new Error('New Bed is already occupied');
      }

      const schoolId = newBed.schoolId;

      // 2. Fetch New Room
      const newRoomRef = db.collection('hostel_rooms').doc(newBed.roomId);
      const newRoomSnap = await t.get(newRoomRef);
      if (!newRoomSnap.exists) throw new Error('New Room not found');
      
      const newRoom = newRoomSnap.data();
      if (newRoom.status === 'Inactive' || newRoom.status === 'Maintenance') {
        throw new Error('New Room is currently inactive or under maintenance');
      }

      // 3. Fetch New Block
      const newBlockRef = db.collection('hostel_blocks').doc(newRoom.blockId);
      const newBlockSnap = await t.get(newBlockRef);
      if (!newBlockSnap.exists) throw new Error('New Hostel block not found');
      const newBlock = newBlockSnap.data();

      // 4. Fetch Student
      const studentRef = db.collection('students').doc(studentId);
      const studentSnap = await t.get(studentRef);
      if (!studentSnap.exists) throw new Error('Student not found');
      
      const student = studentSnap.data();
      if (student.enrollmentStatus !== 'Active') {
        throw new Error('Student profile is inactive or graduated');
      }

      // 5. Gender Match Validation
      const restriction = newBlock.genderRestriction?.toLowerCase();
      const gender = student.gender?.toLowerCase();
      if (restriction === 'male' && gender !== 'male' && gender !== 'm') {
        throw new Error('Gender mismatch: This block is reserved for Male students.');
      }
      if (restriction === 'female' && gender !== 'female' && gender !== 'f') {
        throw new Error('Gender mismatch: This block is reserved for Female students.');
      }

      // 6. Compatibility Rules
      const newRoomBedsSnaps = await Promise.all(newRoomBedRefs.map(ref => t.get(ref)));
      const occupantIds = newRoomBedsSnaps
        .map(d => d.data()?.currentOccupantId)
        .filter(Boolean);

      const occupantDocs = [];
      for (const occId of occupantIds) {
        const occDoc = await t.get(db.collection('students').doc(occId));
        if (occDoc.exists) occupantDocs.push(occDoc.data());
      }

      console.log(`Occ Docs count: ${occupantDocs.length}`);

      // 7. Find and close the current active allocation for this student
      if (!activeAllocQuerySnap.empty) {
        const oldAllocDocRef = activeAllocQuerySnap.docs[0].ref;
        const oldAllocSnap = await t.get(oldAllocDocRef);
        if (oldAllocSnap.exists) {
          const oldAlloc = oldAllocSnap.data();

          t.update(oldAllocDocRef, {
            checkOutDate: new Date(),
            status: 'Completed',
          });

          const oldBedRef = db.collection('hostel_beds').doc(oldAlloc.bedId);
          t.update(oldBedRef, {
            status: 'Available',
            currentOccupantId: null,
          });

          const oldRoomRef = db.collection('hostel_rooms').doc(oldAlloc.roomId);
          const oldRoomSnap = await t.get(oldRoomRef);
          if (oldRoomSnap.exists) {
            const oldRoom = oldRoomSnap.data();
            const oldRoomBedsSnaps = await Promise.all(oldRoomBedsRefs.map(ref => t.get(ref)));
            const remainingOccupants = oldRoomBedsSnaps
              .map(d => d.data()?.currentOccupantId)
              .filter(id => id && id !== studentId).length;

            const isOldRoomFull = remainingOccupants >= (oldRoom.totalCapacity || 1);
            t.update(oldRoomRef, {
              status: isOldRoomFull ? 'Full' : 'Available',
            });
          }
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
        allocatedById: 'test-user-id',
        allocatedByName: 'Test User',
        createdAt: new Date(),
      });

      return { success: true, allocationId: allocationRef.id };
    });

    console.log('Transaction success:', result);
  } catch (err) {
    console.error('Transaction failed inside simulateTransfer:', err);
  }
}

run();
