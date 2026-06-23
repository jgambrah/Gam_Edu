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

    // 1. Fetch Student profile to verify schoolId
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = studentDoc.data()!;
    const schoolId = student.schoolId;

    if (!schoolId) {
      return NextResponse.json({ error: 'Student is not assigned to a school' }, { status: 400 });
    }

    // 2. Verify school access permissions
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    if (!isSuperAdmin) {
      const staffDoc = await db.collection('staff').doc(userId).get();
      const staffData = staffDoc.data();
      if (staffDoc.exists) {
        if (staffData?.schoolId !== schoolId) {
          return NextResponse.json({ error: 'Forbidden: School access mismatch' }, { status: 403 });
        }
      } else {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (userDoc.exists && userData?.schoolId === schoolId) {
          // If the requester is student themselves or their parent, let them pass
          const parentDoc = await db.collection('parents').doc(userId).get();
          const parentData = parentDoc.data();
          const isLinkedParent = parentData && parentData.studentIds && parentData.studentIds.includes(studentId);
          const isStudentSelf = userId === studentId;
          
          if (!isLinkedParent && !isStudentSelf) {
            return NextResponse.json({ error: 'Forbidden: Unauthorized access to student statement' }, { status: 403 });
          }
        } else {
          return NextResponse.json({ error: 'Forbidden: Unauthorized access to statement' }, { status: 403 });
        }
      }
    }

    // 3. Retrieve wallet balance
    const walletDoc = await db.collection('student_wallets').doc(studentId).get();
    const balance = walletDoc.exists ? (walletDoc.data()?.balance || 0) : 0;

    // 4. Retrieve transaction list
    const transactionsSnap = await db.collection('wallet_transactions')
      .where('studentId', '==', studentId)
      .get();

    const transactions = transactionsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort in-memory reverse-chronologically by timestamp
    transactions.sort((a: any, b: any) => {
      const aTime = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp || 0).getTime();
      const bTime = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp || 0).getTime();
      return bTime - aTime;
    });

    return NextResponse.json({
      success: true,
      balance,
      transactions,
    }, { status: 200 });

  } catch (error: any) {
    console.error('GET /api/wallet/statement error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
