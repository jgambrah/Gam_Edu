import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
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

async function seed() {
  const filePath = path.join(__dirname, 'payloads', 'topic_fractions_decimals_percentages.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const payload = JSON.parse(raw);

  // Maintain dual-key compatibility for frontends querying either standard (B7/B8/B9 or JHS1/JHS2/JHS3)
  if (payload.levels) {
    payload.levels.jhs1 = payload.levels.b7;
    payload.levels.jhs2 = payload.levels.b8;
    payload.levels.jhs3 = payload.levels.b9;
  }

  const jsonString = JSON.stringify(payload);
  const sizeBytes = Buffer.byteLength(jsonString, 'utf8');
  const sizeKb = (sizeBytes / 1024).toFixed(2);
  const MAX_LIMIT = 1048576; // 1 MiB

  console.log(`\n================================================================`);
  console.log(`🚀 SEEDING TOPIC 03: "${payload.title}" [ID: ${payload.id}]`);
  console.log(`================================================================`);
  console.log(`📦 Document Size: ${sizeBytes} bytes (~${sizeKb} KB)`);
  console.log(`📊 1 MiB Utilization: ${((sizeBytes / MAX_LIMIT) * 100).toFixed(2)}% of 1,048,576 byte cap`);

  if (sizeBytes >= MAX_LIMIT) {
    throw new Error(`Document exceeds Firestore 1 MiB limit! Size: ${sizeBytes} bytes`);
  }

  const docPath = `global_curriculum/jhs/subjects/math/topics/${payload.id}`;
  const docRef = db.doc(docPath);

  await docRef.set(
    {
      ...payload,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const snap = await docRef.get();
  console.log(`✅ Successfully seeded ${payload.id} in Firestore.`);
  console.log(`📍 Document Exists at "${docPath}": ${snap.exists}`);
}

seed()
  .then(() => {
    console.log('🎉 Seeding completed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  });
