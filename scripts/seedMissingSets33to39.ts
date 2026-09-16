// scripts/seedMissingSets33to39.ts
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Ensure Google Application Credentials point to service account if not already in env
const fallbackKeyPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(fallbackKeyPath)) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = fallbackKeyPath;
}

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const db = admin.firestore();

const TARGET_SETS = [
  'jhs-math-mastery-series-33',
  'jhs-math-mastery-series-34',
  'jhs-math-mastery-series-35',
  'jhs-math-mastery-series-36',
  'jhs-math-mastery-series-37',
  'jhs-math-mastery-series-38',
  'jhs-math-mastery-series-39',
];

const BASE_PATH = 'global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets';

async function seedAndVerify() {
  console.log('🚀 Starting Seeding Process for Missing Sets 33 through 39...\n');

  const batch = db.batch();
  const payloadsDir = path.join(__dirname, 'payloads');

  for (const setId of TARGET_SETS) {
    const filePath = path.join(payloadsDir, `${setId}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing payload file: ${filePath}`);
      continue;
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    const payload = JSON.parse(rawData);

    // Sanity Checks
    if (!payload.questions || !Array.isArray(payload.questions) || payload.questions.length === 0) {
      throw new Error(`Invalid schema in ${setId}: 'questions' array is missing or empty.`);
    }

    const docRef = db.collection(BASE_PATH).doc(setId);
    
    // Write full document (ensures 1 single document read on the frontend)
    batch.set(docRef, {
      ...payload,
      id: setId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    console.log(`📦 Queued ${setId} (${payload.questions.length} questions) -> ${BASE_PATH}/${setId}`);
  }

  console.log('\n⏳ Committing Firestore batch write...');
  await batch.commit();
  console.log('✅ Batch successfully committed!\n');

  // Verification Step
  console.log('🔍 Verifying live document states in Firestore...');
  for (const setId of TARGET_SETS) {
    const docRef = db.collection(BASE_PATH).doc(setId);
    const snap = await docRef.get();

    if (!snap.exists) {
      console.error(`❌ VERIFICATION FAILED: Document ${setId} does not exist in Firestore!`);
    } else {
      const data = snap.data();
      console.log(`✅ VERIFIED: ${setId} | Title: "${data?.title}" | Questions: ${data?.questions?.length}`);
    }
  }

  // Update Topic Manifest to ensure UI indexing is synchronized
  const topicRef = db.doc('global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery');
  console.log('\n🔄 Synchronizing topic questionSetIds manifest...');
  await topicRef.set({
    id: 'core_curriculum_mastery',
    title: 'Core Curriculum Mastery',
    subjectId: 'math',
    levelId: 'jhs',
    questionSetIds: admin.firestore.FieldValue.arrayUnion(...TARGET_SETS),
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });
  console.log('✅ Topic manifest successfully updated.');
}

seedAndVerify()
  .then(() => {
    console.log('\n🎉 All missing question sets (33-39) are now live and fully accessible in QuestionRunner.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('💥 Fatal error during seeding:', err);
    process.exit(1);
  });
