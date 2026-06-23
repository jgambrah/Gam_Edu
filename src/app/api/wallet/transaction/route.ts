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
    const userName = decoded.name || decoded.email || 'Shopkeeper';

    // Verify permission (Staff, Admins, Directors, Wardens, Shopkeepers, Cooks/Mess staff)
    const isSuperAdmin = userId === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || userId === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
    let hasTransactionPermissions = isSuperAdmin;

    if (!hasTransactionPermissions) {
      const staffDoc = await db.collection('staff').doc(userId).get();
      const staffData = staffDoc.data();
      if (staffDoc.exists) {
        hasTransactionPermissions = true; // Any staff role (Warden, Cook, Shopkeeper, Admin) is authorized
      } else {
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (userDoc.exists && userData?.role !== 'Student' && userData?.role !== 'Parent') {
          hasTransactionPermissions = true;
        }
      }
    }

    if (!hasTransactionPermissions) {
      return NextResponse.json({ error: 'Forbidden: You do not have permissions to process on-campus purchases' }, { status: 403 });
    }

    const body = await request.json();
    const { studentId, amount, description } = body;

    if (!studentId || amount === undefined || amount === null || !description) {
      return NextResponse.json({ error: 'Missing studentId, amount, or description' }, { status: 400 });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive purchase price' }, { status: 400 });
    }

    // Resolve Student details to check existence and schoolId
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

      if (!walletSnap.exists) {
        throw new Error('Student wallet is not initialized. Balance is 0.');
      }

      const currentBalance = walletSnap.data()?.balance || 0;
      if (currentBalance < numericAmount) {
        throw new Error(`Insufficient wallet balance. Available: GHS ${currentBalance.toFixed(2)}, Required: GHS ${numericAmount.toFixed(2)}.`);
      }

      const newBalance = currentBalance - numericAmount;

      t.update(walletRef, {
        balance: newBalance,
        updatedAt: new Date(),
      });

      const transactionRef = db.collection('wallet_transactions').doc();
      const code = Math.random().toString(36).substring(2, 11).toUpperCase();
      const reference = `TXN-${code}`;

      t.set(transactionRef, {
        id: transactionRef.id,
        studentId,
        schoolId,
        amount: -numericAmount, // Negative amount denotes debit
        type: 'Debit',
        description,
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
          amount: -numericAmount,
          type: 'Debit',
          description,
          reference,
          balance: finalBalance,
          recordedByName: userName,
        }
      );
    } catch (err) {
      console.error('Failed to trigger wallet debit notification:', err);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Transaction processed successfully', 
      balance: finalBalance 
    }, { status: 200 });

  } catch (error: any) {
    console.error('POST /api/wallet/transaction error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
