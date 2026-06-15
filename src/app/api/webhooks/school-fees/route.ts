import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

/**
 * Initializes and returns the Firebase Admin App instance.
 */
function getAdminApp() {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;
  
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase Admin credentials in environment variables.");
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  }, 'admin');
}

/**
 * Webhook handler for institutional school fee payments via Paystack.
 * Dynamically retrieves school-specific secret keys for signature verification.
 */
export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    if (!text) {
        return NextResponse.json({ error: 'Empty body' }, { status: 400 });
    }

    let body;
    try {
        body = JSON.parse(text);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const event = body.event;
    const data = body.data;

    // 1. Filter for school fee payments only
    if (event === 'charge.success' && data.metadata?.type === 'school_fee_payment') {
      const { schoolId, studentId, recordId } = data.metadata;
      
      if (!schoolId || !studentId || !recordId) {
          console.error(`Webhook error: Missing metadata for fee payment.`);
          return NextResponse.json({ error: 'Incomplete metadata' }, { status: 400 });
      }

      const adminApp = getAdminApp();
      const db = getFirestore(adminApp);

      // 2. Fetch the specific School's Secret Key from Firestore (Tenant isolation)
      const schoolSettingsSnap = await db.collection('schoolSettings').doc(schoolId).get();
      const schoolSettings = schoolSettingsSnap.data();
      const secret = schoolSettings?.paystackSecKey;

      if (!secret) {
        console.error(`Webhook failed: No secret key found for school ${schoolId}`);
        return NextResponse.json({ error: 'Tenant configuration error' }, { status: 400 });
      }

      // 3. Verify Signature using the SCHOOL'S secret key
      const hash = crypto.createHmac('sha512', secret).update(text).digest('hex');
      const signature = req.headers.get('x-paystack-signature');

      if (hash !== signature) {
        console.error(`Webhook failed: Invalid signature for school ${schoolId}`);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }

      // 4. Securely process the payment in a database Transaction
      const recordRef = db.collection('financialRecords').doc(recordId);
      const paymentRef = db.collection(`financialRecords/${recordId}/payments`).doc();
      const onlineTillRef = db.collection('tills').doc(`online-${schoolId}`); 
      
      await db.runTransaction(async (t) => {
        const recordDoc = await t.get(recordRef);
        if (!recordDoc.exists) throw new Error("Financial record not found");
        
        const recordData = recordDoc.data();
        const currentPaid = recordData?.amountPaid || 0;
        const billed = recordData?.billedAmount || 0;
        const waiver = recordData?.waiverAmount || 0;
        const amountFromPaystack = data.amount / 100;
        
        const newTotalPaid = currentPaid + amountFromPaystack;
        const isFullySettled = (billed - newTotalPaid - waiver) <= 0.01;
        
        // A. Update student's bill
        t.update(recordRef, {
            amountPaid: newTotalPaid,
            status: isFullySettled ? 'Paid' : 'Unpaid',
            lastPaymentDate: new Date()
        });

        // B. Log detailed receipt for the parent
        t.set(paymentRef, {
            id: `ONLINE-${data.reference.slice(0, 8).toUpperCase()}`,
            amount: amountFromPaystack,
            method: 'Paystack Online',
            paidAt: new Date(),
            processedById: 'SYSTEM',
            processedByName: 'Automated Online Payment',
            schoolId: schoolId,
            studentId: studentId,
            reference: data.reference,
            notes: 'Processed via secure Paystack gateway.'
        });

        // C. Ensure institutional "Online Till" exists and increment balance
        t.set(onlineTillRef, {
            schoolId: schoolId,
            status: 'Open',
            accountantId: 'SYSTEM',
            accountantName: 'System (Online)',
            currentBalance: FieldValue.increment(amountFromPaystack),
            updatedAt: new Date(),
            dateOpened: FieldValue.serverTimestamp()
        }, { merge: true });

        // D. Log transaction to the online till for accounting audits
        t.set(db.collection(`tills/online-${schoolId}/transactions`).doc(), {
            amount: amountFromPaystack,
            studentName: recordData?.studentName || "Unknown Student",
            timestamp: new Date(),
            type: 'Payment',
            description: `Online Payment: ${recordData?.description} (Ref: ${data.reference})`,
            status: 'Completed',
            schoolId: schoolId
        });
      });

      console.log(`✅ Successfully processed online payment for Student ${studentId} in School ${schoolId}`);
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
