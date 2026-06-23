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
    const userName = decoded.name || decoded.email || 'Mess Manager';

    // Verify permission (Cook, Mess Manager, Director, Administrator, Admin)
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    let hasMessPermissions = isSuperAdmin;
    let schoolId = '';

    if (!isSuperAdmin) {
      const staffDoc = await db.collection('staff').doc(userId).get();
      const staffData = staffDoc.data();
      if (staffData && ['Director', 'Administrator', 'Admin', 'Cook', 'Mess Manager'].includes(staffData.role)) {
        hasMessPermissions = true;
        schoolId = staffData.schoolId;
      } else {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (userData && ['Director', 'Administrator', 'Admin', 'Cook', 'Mess Manager'].includes(userData.role)) {
          hasMessPermissions = true;
          schoolId = userData.schoolId;
        }
      }
    } else {
      const { searchParams } = new URL(request.url);
      schoolId = searchParams.get('schoolId') || '';
    }

    if (!hasMessPermissions) {
      return NextResponse.json({ error: 'Forbidden: You do not have permissions to manage the Mess menu' }, { status: 403 });
    }

    const body = await request.json();
    const { weekStartDate, menu } = body;

    // Set schoolId from body if super admin
    if (!schoolId && body.schoolId) {
      schoolId = body.schoolId;
    }

    if (!schoolId) {
      return NextResponse.json({ error: 'Missing schoolId context' }, { status: 400 });
    }

    if (!weekStartDate || !menu || typeof menu !== 'object') {
      return NextResponse.json({ error: 'Missing weekStartDate or invalid menu object' }, { status: 400 });
    }

    // Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStartDate)) {
      return NextResponse.json({ error: 'Invalid weekStartDate format. Expected YYYY-MM-DD' }, { status: 400 });
    }

    const docId = `${schoolId}_${weekStartDate}`;
    const menuRef = db.collection('mess_weekly_menus').doc(docId);
    
    // Check if doc exists to set original createdAt timestamp
    const menuSnap = await menuRef.get();
    const createdAt = menuSnap.exists ? (menuSnap.data()?.createdAt || new Date()) : new Date();

    const menuData = {
      id: docId,
      schoolId,
      weekStartDate,
      menu,
      publishedById: userId,
      publishedByName: userName,
      createdAt,
      updatedAt: new Date(),
    };

    await menuRef.set(menuData);

    return NextResponse.json({ success: true, message: 'Mess menu published successfully', menuId: docId }, { status: 200 });

  } catch (error: any) {
    console.error('POST /api/mess/menu error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
