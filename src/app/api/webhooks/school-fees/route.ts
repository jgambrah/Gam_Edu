import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { NotificationService } from '@/lib/notification-service';
import { termStampOfRecord } from '@/lib/term';
import { getSchoolSecrets } from '@/lib/school-secrets';
import { applyHeldCreditAfterBillingServer } from '@/lib/credit-allocation-server';

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

    // 1. Filter for supported payment types
    if (event === 'charge.success') {
      const paymentType = data.metadata?.type;

      if (paymentType === 'school_fee_payment') {
        const { schoolId, studentId, recordId } = data.metadata;
        
        if (!schoolId || !studentId || !recordId) {
            console.error(`Webhook error: Missing metadata for fee payment.`);
            return NextResponse.json({ error: 'Incomplete metadata' }, { status: 400 });
        }

        const adminApp = getAdminApp();
        const db = getFirestore(adminApp);

        // 2. Fetch the specific School's Secret Key from Firestore (Tenant isolation)
        const secret = (await getSchoolSecrets(db, schoolId)).paystackSecKey;

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
        const originalRef = db.collection('financialRecords').doc(recordId);
        const onlineTillRef = db.collection('tills').doc(`online-${schoolId}`); 
        // Paystack retries webhooks: one event per payment reference, recorded once.
        const eventRef = db.collection('paystackEvents').doc(String(data.reference));

        const alreadyProcessed = await db.runTransaction(async (t) => {
          const eventSnap = await t.get(eventRef);
          if (eventSnap.exists) return true;

          const originalDoc = await t.get(originalRef);
          if (!originalDoc.exists) throw new Error("Financial record not found");

          // A bill archived by a term rollover no longer carries the balance: pay its Arrears (or Credit)
          // Brought Forward record in the new term instead, so the payment reduces what is actually owed.
          let recordRef = originalRef;
          let recordDoc = originalDoc;
          const orig: any = originalDoc.data();
          if (orig?.schoolId && orig.schoolId !== schoolId) throw new Error("Bill does not belong to this school");
          if (orig?.isArchived === true && orig?.carriedForwardToTermId && orig?.studentId) {
            const abfRef = db.collection('financialRecords').doc(`abf_${orig.studentId}_${orig.carriedForwardToTermId}`);
            const cbfRef = db.collection('financialRecords').doc(`cbf_${orig.studentId}_${orig.carriedForwardToTermId}`);
            const [abfSnap, cbfSnap] = await Promise.all([t.get(abfRef), t.get(cbfRef)]);
            if (abfSnap.exists) { recordRef = abfRef; recordDoc = abfSnap; }
            else if (cbfSnap.exists) { recordRef = cbfRef; recordDoc = cbfSnap; }
          }
          const paymentRef = recordRef.collection('payments').doc(`ONLINE-${String(data.reference).replace(/[^A-Za-z0-9_-]/g, '')}`);
          
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
              notes: 'Processed via secure Paystack gateway.',
              ...(() => { const st = termStampOfRecord(recordData); return st ? { termId: st.termId, academicYear: st.academicYear } : {}; })(),
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

          t.set(eventRef, {
              reference: data.reference, type: 'school_fee_payment', schoolId, studentId,
              requestedRecordId: recordId, appliedToRecordId: recordRef.id, amount: amountFromPaystack,
              processedAt: new Date(),
          });
          return false;
        });

        if (alreadyProcessed) {
          console.log(`Webhook: payment ${data.reference} was already recorded; ignoring repeat delivery.`);
          return NextResponse.json({ status: 'already_processed' }, { status: 200 });
        }

        // D2. A parent who paid MORE than the bill: spread the extra onto the pupil's other unpaid bills
        // (same rule as payments at the cash desk). What cannot be placed stays as the pupil's credit.
        try {
          const evSnap = await eventRef.get();
          const appliedId = String(evSnap.data()?.appliedToRecordId || recordId);
          const billSnap = await db.collection('financialRecords').doc(appliedId).get();
          const b: any = billSnap.data() || {};
          const bal = (Number(b.billedAmount) || 0) - (Number(b.amountPaid) || 0) - (Number(b.waiverAmount) || 0);
          if (bal < -0.009) {
            const st = await db.collection('students').doc(String(studentId)).get();
            const sd: any = st.exists ? st.data() : {};
            await applyHeldCreditAfterBillingServer(db, schoolId, { ...sd, id: st.id, uid: sd.uid || studentId, hasAccountCredit: true });
          }
        } catch (spreadErr) {
          console.warn('Webhook: could not spread extra payment:', spreadErr);
        }

        // E. Send DM notification to parents asynchronously
        try {
          const studentIdVal = studentId;
          const recordSnap = await db.collection('financialRecords').doc(recordId).get();
          const recordData = recordSnap.data();
          const studentName = recordData?.studentName || "Student";
          const feeType = recordData?.description || "School Fees";
          const paymentAmount = data.amount / 100;
          const receiptId = `ONLINE-${data.reference.slice(0, 8).toUpperCase()}`;

          // 1. Fetch school name
          const schoolDoc = await db.collection('schools').doc(schoolId).get();
          const schoolName = schoolDoc.data()?.name || 'our school';

          // 2. Query parents linked to student
          const parentsSnap = await db.collection('parents')
            .where('schoolId', '==', schoolId)
            .where('studentIds', 'array-contains', studentIdVal)
            .get();

          const senderUid = 'SYSTEM';
          const senderName = 'System Automated Online Payment';
          const senderRole = 'System';

          for (const parentDoc of parentsSnap.docs) {
            const parentData = parentDoc.data();
            const parentId = parentDoc.id;
            const parentName = `${parentData.firstName || ''} ${parentData.lastName || ''}`.trim() || 'Parent';

            // 3. Find existing 1-on-1 chat
            const chatsSnap = await db.collection('direct_messages')
              .where('schoolId', '==', schoolId)
              .where('participants', 'array-contains', parentId)
              .get();

            let chatId = '';
            const existingChat = chatsSnap.docs.find(d => {
              const chatData = d.data();
              return !chatData.isGroup && chatData.participants.includes(senderUid);
            });

            if (existingChat) {
              chatId = existingChat.id;
            } else {
              // Create new direct chat
              const newChatRef = await db.collection('direct_messages').add({
                participants: [senderUid, parentId],
                participantDetails: {
                  [senderUid]: { name: senderName, role: senderRole, photoURL: null },
                  [parentId]: { name: parentName, role: 'Parent', photoURL: parentData.photoURL || null }
                },
                lastMessage: 'Receipt acknowledged',
                lastMessageTime: FieldValue.serverTimestamp(),
                unreadCount: { [parentId]: 1, [senderUid]: 0 },
                schoolId,
                isGroup: false
              });
              chatId = newChatRef.id;
            }

            // 4. Construct direct message content
            const msgText = `Dear ${parentName},\n\n` +
              `This is to acknowledge the receipt of your payment of GH₵${paymentAmount.toFixed(2)} ` +
              `towards ${feeType} for your ward, ${studentName}.\n\n` +
              `Receipt Reference: ${receiptId}\n` +
              `Payment Method: Paystack Online\n\n` +
              `Thank you for your payment. Please contact the accountant, administrator, or the director in case of any discrepancy.\n\n` +
              `Best regards,\n` +
              `${senderName}\n` +
              `${schoolName}`;

            // 5. Send message
            await db.collection(`direct_messages/${chatId}/messages`).add({
              text: msgText,
              senderId: senderUid,
              createdAt: FieldValue.serverTimestamp(),
              type: 'text',
              status: 'sent'
            });

            // 6. Update direct_messages metadata
            const chatRef = db.collection('direct_messages').doc(chatId);
            const chatUpdate: any = {
              lastMessage: `Payment acknowledged: GH₵${paymentAmount.toFixed(2)}`,
              lastMessageTime: FieldValue.serverTimestamp()
            };
            chatUpdate[`unreadCount.${parentId}`] = FieldValue.increment(1);
            await chatRef.update(chatUpdate);
          }
        } catch (err) {
          console.error("Failed to send parent notification DM from webhook:", err);
        }

        console.log(`✅ Successfully processed online payment for Student ${studentId} in School ${schoolId}`);
      } else if (paymentType === 'wallet_topup') {
        const { schoolId, studentId, parentId, parentName } = data.metadata || {};
        
        if (!schoolId || !studentId) {
            console.error(`Webhook error: Missing metadata for wallet top-up.`);
            return NextResponse.json({ error: 'Incomplete metadata' }, { status: 400 });
        }

        const adminApp = getAdminApp();
        const db = getFirestore(adminApp);

        // Fetch School's Secret Key
        const secret = (await getSchoolSecrets(db, schoolId)).paystackSecKey;

        if (!secret) {
          console.error(`Webhook failed: No secret key found for school ${schoolId}`);
          return NextResponse.json({ error: 'Tenant configuration error' }, { status: 400 });
        }

        // Verify Signature
        const hash = crypto.createHmac('sha512', secret).update(text).digest('hex');
        const signature = req.headers.get('x-paystack-signature');

        if (hash !== signature) {
          console.error(`Webhook failed: Invalid signature for school ${schoolId}`);
          return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Fetch student profile to get name
        const studentDoc = await db.collection('students').doc(studentId).get();
        if (!studentDoc.exists) {
          console.error(`Webhook failed: Student ${studentId} not found.`);
          return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }
        const studentData = studentDoc.data()!;
        const studentName = `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim() || 'Student';
        const amountFromPaystack = data.amount / 100;

        // Perform Wallet Topup in a transaction
        const walletEventRef = db.collection('paystackEvents').doc(String(data.reference));
        const transactionResult = await db.runTransaction(async (t) => {
          const walletRef = db.collection('student_wallets').doc(studentId);
          const [walletEventSnap, walletSnap] = await Promise.all([t.get(walletEventRef), t.get(walletRef)]);
          if (walletEventSnap.exists) return { balance: walletSnap.data()?.balance || 0, duplicate: true };

          let currentBalance = 0;
          if (walletSnap.exists) {
            currentBalance = walletSnap.data()?.balance || 0;
          }

          const newBalance = currentBalance + amountFromPaystack;

          t.set(walletRef, {
            id: studentId,
            studentId,
            studentName,
            schoolId,
            balance: newBalance,
            updatedAt: new Date(),
          }, { merge: true });

          const transactionRef = db.collection('wallet_transactions').doc();
          t.set(transactionRef, {
            id: transactionRef.id,
            studentId,
            schoolId,
            amount: amountFromPaystack,
            type: 'Credit',
            description: `Momo Pocket Money Refill (Ref: ${data.reference})`,
            reference: data.reference,
            recordedById: parentId || 'SYSTEM',
            recordedByName: parentName || 'Parent Online',
            timestamp: new Date(),
          });
          t.set(walletEventRef, { reference: data.reference, type: 'wallet_topup', schoolId, studentId, amount: amountFromPaystack, processedAt: new Date() });

          return { balance: newBalance, duplicate: false };
        });
        if ((transactionResult as any).duplicate) {
          console.log(`Webhook: wallet top-up ${data.reference} was already recorded; ignoring repeat delivery.`);
          return NextResponse.json({ status: 'already_processed' }, { status: 200 });
        }

        // Trigger Wallet Event Notification
        try {
          await NotificationService.triggerWalletTransactionEvent(
            db,
            studentId,
            studentName,
            schoolId,
            {
              amount: amountFromPaystack,
              type: 'Credit',
              description: `Momo Pocket Money Refill (Ref: ${data.reference})`,
              reference: data.reference,
              balance: transactionResult.balance,
              recordedByName: parentName || 'Parent Online',
            }
          );
        } catch (err) {
          console.error('Failed to trigger wallet top-up notification:', err);
        }

        console.log(`✅ Successfully processed wallet top-up payment for Student ${studentId} in School ${schoolId}`);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
