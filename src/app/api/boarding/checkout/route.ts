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
    const { studentId } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });
    }

    // Fetch active allocation for this student outside transaction
    const activeAllocQuerySnap = await db.collection('hostel_allocations')
      .where('studentId', '==', studentId)
      .where('status', '==', 'Active')
      .limit(1)
      .get();

    if (activeAllocQuerySnap.empty) {
      return NextResponse.json({ error: 'No active boarding allocation found for this student' }, { status: 400 });
    }

    const allocDocRef = activeAllocQuerySnap.docs[0].ref;
    const allocData = activeAllocQuerySnap.docs[0].data();

    // Fetch beds in the room outside transaction to evaluate occupancy count later
    const roomId = allocData.roomId;
    const roomBedsQuerySnap = await db.collection('hostel_beds').where('roomId', '==', roomId).get();
    const roomBedRefs = roomBedsQuerySnap.docs.map(doc => doc.ref);

    const result = await db.runTransaction(async (t) => {
      // 1. Fetch Student
      const studentRef = db.collection('students').doc(studentId);
      const studentSnap = await t.get(studentRef);
      if (!studentSnap.exists) throw new Error('Student not found');

      // 2. Fetch active allocation within transaction
      const allocSnap = await t.get(allocDocRef);
      if (!allocSnap.exists || allocSnap.data()?.status !== 'Active') {
        throw new Error('Allocation is no longer active');
      }

      // Verify school access
      const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
      if (!isSuperAdmin) {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (!userData || userData.schoolId !== allocData.schoolId) {
          throw new Error('Forbidden: School access mismatch');
        }
      }

      // 3. Close the allocation record
      t.update(allocDocRef, {
        checkOutDate: new Date(),
        status: 'Completed',
      });

      // 4. Update the bed record to Available
      const bedRef = db.collection('hostel_beds').doc(allocData.bedId);
      t.update(bedRef, {
        status: 'Available',
        currentOccupantId: null,
      });

      // 5. Update the room record status to Available if it was Full
      const roomRef = db.collection('hostel_rooms').doc(allocData.roomId);
      const roomSnap = await t.get(roomRef);
      if (roomSnap.exists) {
        const room = roomSnap.data()!;
        const roomBedsSnaps = await Promise.all(roomBedRefs.map(ref => t.get(ref)));
        
        // Count how many beds are still occupied (excluding the current student checking out)
        const remainingOccupants = roomBedsSnaps
          .map(d => d.data()?.currentOccupantId)
          .filter(id => id && id !== studentId).length;

        const isRoomFull = remainingOccupants >= (room.totalCapacity || 1);
        t.update(roomRef, {
          status: isRoomFull ? 'Full' : 'Available',
        });
      }

      return { success: true, allocationId: allocSnap.id };
    });

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('POST /api/boarding/checkout error:', error);
    try {
      const logPath = 'c:/Users/LENOVO/OneDrive - Kwame Nkrumah Uni. of Sci. and Tech/Desktop/GAM Med (2)/error_log.txt';
      fs.appendFileSync(logPath, `\n\n--- ${new Date().toISOString()} /api/boarding/checkout error ---\n${error.stack || error.message || error}`);
    } catch (e) {}
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
