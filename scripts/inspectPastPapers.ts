import * as admin from 'firebase-admin';
import * as fs from 'fs';

const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
admin.initializeApp({ credential: admin.credential.cert(serviceAccountPath) });
const db = admin.firestore();

async function inspectSample() {
  const doc = await db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2022_variant').get();
  const d = doc.data()!;
  console.log('=== P1 Question 1 ===');
  console.log(JSON.stringify(d.paper1.questions[0], null, 2));
  console.log('=== P2 Question 1 ===');
  console.log(JSON.stringify(d.paper2.questions[0], null, 2));
  process.exit(0);
}

inspectSample().catch(err => {
  console.error(err);
  process.exit(1);
});
