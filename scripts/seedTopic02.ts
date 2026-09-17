import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue, Firestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gamedu-69888475-f5783';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const fallbackKeyPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';

let adminApp: App | null = null;
let db: Firestore | null = null;

try {
  if (!getApps().length) {
    if (clientEmail && privateKey) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
      adminApp = initializeApp({
        credential: cert(serviceAccountPath),
      });
    } else if (fs.existsSync(fallbackKeyPath)) {
      adminApp = initializeApp({
        credential: cert(fallbackKeyPath),
      });
    } else {
      adminApp = initializeApp({ projectId });
    }
  }
  db = getFirestore();
} catch (error) {
  console.warn('[seedTopic02] Firebase Admin initialization error:', error);
}

async function seed() {
  if (!db) {
    throw new Error('Firestore database instance could not be initialized.');
  }

  const filePath = path.join(__dirname, 'payloads', 'topic_sets_and_venn_diagrams.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const payload = JSON.parse(raw);

  // Maintain dual compatibility for level keys (b7/jhs1, b8/jhs2, b9/jhs3)
  if (payload.levels) {
    if (payload.levels.b7 && !payload.levels.jhs1) {
      payload.levels.jhs1 = payload.levels.b7;
    }
    if (payload.levels.b8 && !payload.levels.jhs2) {
      payload.levels.jhs2 = payload.levels.b8;
    }
    if (payload.levels.b9 && !payload.levels.jhs3) {
      payload.levels.jhs3 = payload.levels.b9;
    }
  }

  const jsonString = JSON.stringify(payload);
  const sizeBytes = Buffer.byteLength(jsonString, 'utf8');
  const MAX_LIMIT = 1048576; // 1 MiB

  console.log(`📦 Preparing Topic Lab: "${payload.title}" [ID: ${payload.id}]`);
  console.log(`   Document Size: ${sizeBytes} bytes (~${(sizeBytes / 1024).toFixed(2)} KB) [${((sizeBytes / MAX_LIMIT) * 100).toFixed(2)}% of 1 MiB limit]`);

  if (sizeBytes >= MAX_LIMIT) {
    throw new Error(`Document exceeds Firestore 1 MiB cap! Size: ${sizeBytes} bytes`);
  }

  const docRef = db.doc(`global_curriculum/jhs/subjects/math/topics/${payload.id}`);
  await docRef.set({
    ...payload,
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });

  const snap = await docRef.get();
  console.log(`✅ Successfully seeded ${payload.id}. Exists: ${snap.exists}`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  });
