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
    const userName = decoded.name || decoded.email || 'Parent/Staff';

    // Verify permission (Parents, Admins, Directors, Wardens, Boarding Staff)
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    let hasTopUpPermissions = isSuperAdmin;

    if (!hasTopUpPermissions) {
      // Check parent doc
      const parentDoc = await db.collection('parents').doc(userId).get();
      if (parentDoc.exists) {
        hasTopUpPermissions = true;
      } else {
        // Check staff doc
        const staffDoc = await db.collection('staff').doc(userId).get();
        const staffData = staffDoc.data();
        if (staffDoc.exists && ['Director', 'Administrator', 'Admin', 'Warden', 'Boarding Staff'].includes(staffData?.role)) {
          hasTopUpPermissions = true;
        } else {
          // Check generic user doc
          const userDoc = await db.collection('users').doc(userId).get();
          const userData = userDoc.data();
          if (userDoc.exists && ['Director', 'Administrator', 'Admin', 'Warden', 'Boarding Staff', 'Parent'].includes(userData?.role)) {
            hasTopUpPermissions = true;
          }
        }
      }
    }

    if (!hasTopUpPermissions) {
      return NextResponse.json({ error: 'Forbidden: You do not have permissions to top-up pocket money' }, { status: 403 });
    }

    const body = await request.json();
    const { studentId, amount, description } = body;

    if (!studentId || amount === undefined || amount === null) {
      return NextResponse.json({ error: 'Missing studentId or amount' }, { status: 400 });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 });
    }

    // Resolve Student details
    const studentDoc = await db.collection('students').doc(studentId).get();
    if (!studentDoc.exists) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }
    const studentData = studentDoc.data()!;
    const schoolId = studentData.schoolId;
    const studentName = `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim() || 'Student';

    if (!schoolId) {
      return NextResponse.json({ error: 'Student is not assigned to a school' }, { status: 400 });
    }

    // Run transaction
    const transactionResult = await db.runTransaction(async (t) => {
      const walletRef = db.collection('student_wallets').doc(studentId);
      const walletSnap = await t.get(walletRef);

      let currentBalance = 0;
      if (walletSnap.exists) {
        currentBalance = walletSnap.data()?.balance || 0;
      }

      const newBalance = currentBalance + numericAmount;

      t.set(walletRef, {
        id: studentId,
        studentId,
        studentName,
        schoolId,
        balance: newBalance,
        updatedAt: new Date(),
      }, { merge: true });

      const transactionRef = db.collection('wallet_transactions').doc();
      const code = Math.random().toString(36).substring(2, 11).toUpperCase();
      const reference = `TXN-${code}`;

      t.set(transactionRef, {
        id: transactionRef.id,
        studentId,
        schoolId,
        amount: numericAmount,
        type: 'Credit',
        description: description || 'Parent Top-Up',
        reference,
        recordedById: userId,
        recordedByName: userName,
        timestamp: new Date(),
      });

      return { balance: newBalance, reference };
    });

    const finalBalance = transactionResult.balance;
    const reference = transactionResult.reference;

    // Trigger parent balance notification asynchronously
    try {
      await NotificationService.triggerWalletTransactionEvent(
        db,
        studentId,
        studentName,
        schoolId,
        {
          amount: numericAmount,
          type: 'Credit',
          description: description || 'Parent Top-Up',
          reference,
          balance: finalBalance,
          recordedByName: userName,
        }
      );
    } catch (err) {
      console.error('Failed to trigger wallet top-up notification:', err);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Wallet topped up successfully', 
      balance: finalBalance 
    }, { status: 200 });

  } catch (error: any) {
    console.error('POST /api/wallet/top-up error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
