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

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId');
    if (!schoolId) {
      return NextResponse.json({ error: 'Missing schoolId parameter' }, { status: 400 });
    }

    // Verify school access
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    if (!isSuperAdmin) {
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      if (!userData || userData.schoolId !== schoolId) {
        return NextResponse.json({ error: 'Forbidden: School access mismatch' }, { status: 403 });
      }
    }

    // Fetch all Blocks, Rooms, and Beds for the school
    const blocksSnap = await db.collection('hostel_blocks').where('schoolId', '==', schoolId).get();
    const roomsSnap = await db.collection('hostel_rooms').where('schoolId', '==', schoolId).get();
    const bedsSnap = await db.collection('hostel_beds').where('schoolId', '==', schoolId).get();

    const blocks = blocksSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const rooms = roomsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const beds = bedsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Extract all current occupant IDs to fetch student details efficiently
    const occupantIds = Array.from(new Set(beds.map(b => (b as any).currentOccupantId).filter(Boolean))) as string[];
    const studentsMap: Record<string, any> = {};

    if (occupantIds.length > 0) {
      // Chunk array by 30 to comply with Firestore 'in' limit
      for (let i = 0; i < occupantIds.length; i += 30) {
        const chunk = occupantIds.slice(i, i + 30);
        const studentsSnap = await db.collection('students').where('__name__', 'in', chunk).get();
        studentsSnap.docs.forEach(doc => {
          const s = doc.data();
          studentsMap[doc.id] = {
            id: doc.id,
            firstName: s.firstName,
            lastName: s.lastName,
            email: s.email,
            gender: s.gender,
            photoURL: s.photoURL || null,
            classId: s.classId || null,
          };
        });
      }
    }

    // Build tree
    const tree = blocks.map(block => {
      const blockRooms = rooms.filter(r => (r as any).blockId === block.id);
      
      // Group by floor
      const floorsMap: Record<number, any[]> = {};
      blockRooms.forEach(room => {
        const floor = (room as any).floorLevel ?? 0;
        if (!floorsMap[floor]) floorsMap[floor] = [];
        
        // Find beds for this room
        const roomBeds = beds
          .filter(b => (b as any).roomId === room.id)
          .map(bed => {
            const occupantId = (bed as any).currentOccupantId;
            return {
              ...bed,
              occupant: occupantId ? (studentsMap[occupantId] || { id: occupantId, name: 'Unknown Student' }) : null,
            };
          });

        floorsMap[floor].push({
          ...room,
          beds: roomBeds,
        });
      });

      // Convert floors map to sorted array
      const floors = Object.keys(floorsMap)
        .map(Number)
        .sort((a, b) => a - b)
        .map(floorLevel => ({
          floorLevel,
          rooms: floorsMap[floorLevel],
        }));

      return {
        ...block,
        floors,
      };
    });

    return NextResponse.json({ blocks: tree }, { status: 200 });

  } catch (error: any) {
    console.error('GET /api/boarding/layout error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
