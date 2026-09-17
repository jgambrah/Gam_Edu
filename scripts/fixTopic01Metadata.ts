import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gamedu-69888475-f5783';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const fallbackKeyPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';

if (!getApps().length) {
  if (clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    initializeApp({
      credential: cert(serviceAccountPath),
    });
  } else if (fs.existsSync(fallbackKeyPath)) {
    initializeApp({
      credential: cert(fallbackKeyPath),
    });
  } else {
    initializeApp({ projectId });
  }
}

const db = getFirestore();

async function fix() {
  const filePath = path.join(__dirname, 'payloads', 'topics', 'topic_numbers_and_numeration.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const payload = JSON.parse(raw);

  payload.strand = {
    code: 'S1',
    name: 'STRAND 1: NUMBER',
  };
  payload.subStrand = {
    code: 'SS1',
    name: 'Number Operations & Computation',
  };

  // Also write to scripts/payloads/topic_numbers_and_numeration.json
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
  fs.writeFileSync(
    path.join(__dirname, 'payloads', 'topic_numbers_and_numeration.json'),
    JSON.stringify(payload, null, 2),
    'utf-8'
  );

  // Update in Firestore
  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_numbers_and_numeration');
  await docRef.set(
    {
      strand: payload.strand,
      subStrand: payload.subStrand,
    },
    { merge: true }
  );

  console.log('✅ Successfully patched topic_numbers_and_numeration with strand and subStrand in Firestore and local files.');
}

fix().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
