import * as admin from 'firebase-admin';
import * as fs from 'fs';

const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}
const db = admin.firestore();

async function check57() {
  const snap = await db.doc('global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-57').get();
  if (!snap.exists) throw new Error('Set 57 missing in Firestore!');
  const d = snap.data()!;
  console.log('Set 57 Verified:');
  console.log({ id: d.id, title: d.title, format: d.format, totalQuestions: d.totalQuestions, qLen: d.questions.length });
  d.questions.forEach((q: any, idx: number) => {
    console.log(`Q${idx+1}: ${q.title} | parts: ${q.parts?.length} | hasSvg: ${!!q.diagramSvg}`);
  });

  const topicSnap = await db.doc('global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery').get();
  const manifest = topicSnap.data()?.questionSetIds || [];
  console.log('Manifest includes jhs-math-mastery-series-57:', manifest.includes('jhs-math-mastery-series-57'));

  process.exit(0);
}

check57().catch(err => {
  console.error(err);
  process.exit(1);
});
