import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

dotenv.config();

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else {
    initializeApp();
  }
}

const db = getFirestore();

async function inspect() {
  const schoolId = 'FAjBaejpOcGssqJOnJC6';
  
  // Test write
  console.log('Writing test field to summary doc...');
  await db.collection('dashboard_summaries').doc(schoolId).set({
    testField: 'hello-' + Date.now(),
    testTimestamp: FieldValue.serverTimestamp()
  }, { merge: true });

  const doc = await db.collection('dashboard_summaries').doc(schoolId).get();
  console.log('Document data:', JSON.stringify(doc.data(), null, 2));
}

inspect().catch(console.error);
