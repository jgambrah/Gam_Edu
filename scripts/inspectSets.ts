import * as admin from 'firebase-admin';
import * as fs from 'fs';

const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
admin.initializeApp({ credential: admin.credential.cert(serviceAccountPath) });
const db = admin.firestore();

async function inspect() {
  const p45 = await db.doc('global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-45').get();
  const p46 = await db.doc('global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-46').get();
  console.log('--- SET 45 ---');
  if (p45.exists) {
    const d = p45.data()!;
    console.log(JSON.stringify({ 
      id: d.id, 
      title: d.title, 
      topic: d.topic, 
      format: d.format, 
      tier: d.tier, 
      subject: d.subject, 
      totalQuestions: d.totalQuestions, 
      qCount: d.questions?.length, 
      sampleQ: d.questions?.[0] 
    }, null, 2));
  } else {
    console.log('p45 does not exist!');
  }
  console.log('--- SET 46 ---');
  if (p46.exists) {
    const d = p46.data()!;
    console.log(JSON.stringify({ 
      id: d.id, 
      title: d.title, 
      topic: d.topic, 
      format: d.format, 
      tier: d.tier, 
      subject: d.subject, 
      totalQuestions: d.totalQuestions, 
      qCount: d.questions?.length, 
      sampleQ: d.questions?.[0] 
    }, null, 2));
  } else {
    console.log('p46 does not exist!');
  }
  process.exit(0);
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
