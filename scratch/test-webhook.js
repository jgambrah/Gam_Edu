require('dotenv').config();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const crypto = require('crypto');

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
  }, 'admin-test-webhook-self-setup');
  return getFirestore(app);
}

async function run() {
  const db = init();
  
  try {
    // 1. Fetch any schoolSettings document
    const settingsSnap = await db.collection('schoolSettings').limit(1).get();
    if (settingsSnap.empty) {
      console.log('No schoolSettings documents found in DB to test.');
      return;
    }
    const targetSchoolDoc = settingsSnap.docs[0];
    const schoolId = targetSchoolDoc.id;
    let settings = targetSchoolDoc.data();
    
    let secret = settings.paystackSecKey;
    let needsCleanup = false;

    if (!secret) {
      console.log(`School: ${schoolId} does not have paystackSecKey. Setting a temporary one for testing...`);
      secret = 'sk_test_dummy_key_for_refill_simulation';
      await db.collection('schoolSettings').doc(schoolId).update({
        paystackSecKey: secret,
        paystackPubKey: 'pk_test_dummy_key'
      });
      needsCleanup = true;
    }

    // 2. Fetch a student assigned to this school
    const studentsSnap = await db.collection('students')
      .where('schoolId', '==', schoolId)
      .limit(1)
      .get();

    if (studentsSnap.empty) {
      console.log(`No students found for school: ${schoolId}.`);
      return;
    }

    const student = studentsSnap.docs[0].data();
    const studentId = studentsSnap.docs[0].id;

    console.log(`Testing with Student: ${student.firstName} ${student.lastName} (${studentId}) in School: ${schoolId}`);
    console.log(`Refilling wallet by 75 GHS via simulated Paystack webhook...`);

    // 3. Build the webhook payload
    const reference = 'PAYSTACK_SIM_' + Math.random().toString(36).substring(2, 11).toUpperCase();
    const payload = {
      event: 'charge.success',
      data: {
        id: 123456789,
        domain: 'test',
        status: 'success',
        reference: reference,
        amount: 7500, // 75.00 GHS in pesewas
        gateway_response: 'Successful',
        paid_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        channel: 'mobile_money',
        currency: 'GHS',
        metadata: {
          type: 'wallet_topup',
          schoolId: schoolId,
          studentId: studentId,
          parentId: 'mock-parent-id',
          parentName: 'Paystack Simulation Parent',
          amount: 75
        }
      }
    };

    const bodyText = JSON.stringify(payload);
    
    // 4. Generate signature
    const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');

    console.log(`Signature generated: ${hash}`);
    console.log(`Sending POST request to local Next.js dev server...`);

    // 5. Send POST request
    const response = await fetch('http://localhost:3000/api/webhooks/school-fees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-paystack-signature': hash
      },
      body: bodyText
    });

    const resJson = await response.json();
    console.log('Webhook Response Status:', response.status);
    console.log('Webhook Response Body:', resJson);

    if (response.status === 200) {
      console.log('Verifying credit directly in student wallet doc...');
      const walletSnap = await db.collection('student_wallets').doc(studentId).get();
      if (walletSnap.exists) {
        console.log(`Updated wallet state:`, walletSnap.data());
      } else {
        console.log(`Wallet doc not found.`);
      }
    }

    // 6. Clean up temporary key if set
    if (needsCleanup) {
      console.log('Cleaning up temporary paystack keys...');
      await db.collection('schoolSettings').doc(schoolId).update({
        paystackSecKey: FieldValue.delete(),
        paystackPubKey: FieldValue.delete()
      });
      console.log('Cleanup complete.');
    }

  } catch (error) {
    console.error('Error running simulation:', error);
  }
}

run();
