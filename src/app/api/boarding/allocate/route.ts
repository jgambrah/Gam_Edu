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
    const allocatedByName = decoded.name || decoded.email || 'Staff member';

    const body = await request.json();
    const { studentId, bedId } = body;

    if (!studentId || !bedId) {
      return NextResponse.json({ error: 'Missing studentId or bedId' }, { status: 400 });
    }

    // Fetch target bed outside transaction to get roomId
    const bedRef = db.collection('hostel_beds').doc(bedId);
    const bedQuerySnap = await bedRef.get();
    if (!bedQuerySnap.exists) {
      return NextResponse.json({ error: 'Bed not found' }, { status: 404 });
    }
    const bedData = bedQuerySnap.data()!;
    const roomId = bedData.roomId;

    // Fetch beds in the room to evaluate compatibility rules
    const roomBedsQuerySnap = await db.collection('hostel_beds').where('roomId', '==', roomId).get();
    const roomBedRefs = roomBedsQuerySnap.docs.map(doc => doc.ref);

    const result = await db.runTransaction(async (t) => {
      // 1. Fetch Bed
      const bedSnap = await t.get(bedRef);
      if (!bedSnap.exists) throw new Error('Bed not found');
      
      const bed = bedSnap.data()!;
      if (bed.status === 'Occupied' || bed.currentOccupantId) {
        throw new Error('Bed is already occupied');
      }

      const schoolId = bed.schoolId;

      // 2. Fetch Room
      const roomRef = db.collection('hostel_rooms').doc(bed.roomId);
      const roomSnap = await t.get(roomRef);
      if (!roomSnap.exists) throw new Error('Room not found');
      
      const room = roomSnap.data()!;
      if (room.status === 'Inactive' || room.status === 'Maintenance') {
        throw new Error('Room is currently inactive or under maintenance');
      }

      // 3. Fetch Block
      const blockRef = db.collection('hostel_blocks').doc(room.blockId);
      const blockSnap = await t.get(blockRef);
      if (!blockSnap.exists) throw new Error('Hostel block not found');
      const block = blockSnap.data()!;

      // 4. Fetch Student
      const studentRef = db.collection('students').doc(studentId);
      const studentSnap = await t.get(studentRef);
      if (!studentSnap.exists) throw new Error('Student not found');
      
      const student = studentSnap.data()!;
      if (student.enrollmentStatus !== 'Active') {
        throw new Error('Student profile is inactive or graduated');
      }

      // 5. Gender Match Validation
      const restriction = block.genderRestriction?.toLowerCase();
      const gender = student.gender?.toLowerCase();
      if (restriction === 'male' && gender !== 'male' && gender !== 'm') {
        throw new Error('Gender mismatch: This block is reserved for Male students.');
      }
      if (restriction === 'female' && gender !== 'female' && gender !== 'f') {
        throw new Error('Gender mismatch: This block is reserved for Female students.');
      }

      // 6. Compatibility Rules (Fetch other occupants in this room using pre-fetched refs)
      const roomBedsSnaps = await Promise.all(roomBedRefs.map(ref => t.get(ref)));
      const occupantIds = roomBedsSnaps
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

      // 7. Atomically Allocate
      t.update(bedRef, {
        status: 'Occupied',
        currentOccupantId: studentId,
      });

      const newOccupiedCount = occupantIds.length + 1;
      const isFull = newOccupiedCount >= (room.totalCapacity || 1);
      t.update(roomRef, {
        status: isFull ? 'Full' : 'Available',
      });

      const allocationRef = db.collection('hostel_allocations').doc();
      t.set(allocationRef, {
        id: allocationRef.id,
        schoolId: schoolId,
        studentId: studentId,
        studentName: `${student.firstName} ${student.lastName}`.trim(),
        blockId: block.id,
        blockName: block.name,
        roomId: room.id,
        roomNumber: room.roomNumber,
        bedId: bed.id,
        bedIdentifier: bed.bedIdentifier,
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
    console.error('POST /api/boarding/allocate error:', error);
    try {
      const logPath = 'c:/Users/LENOVO/OneDrive - Kwame Nkrumah Uni. of Sci. and Tech/Desktop/GAM Med (2)/error_log.txt';
      fs.appendFileSync(logPath, `\n\n--- ${new Date().toISOString()} /api/boarding/allocate error ---\n${error.stack || error.message || error}`);
    } catch (e) {}
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
