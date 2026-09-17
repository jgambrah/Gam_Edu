import * as admin from 'firebase-admin';
import * as fs from 'fs';

const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
admin.initializeApp({ credential: admin.credential.cert(serviceAccountPath) });
const db = admin.firestore();

async function listSets() {
  const col = await db.collection('global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets').get();
  console.log(`Found ${col.size} question sets in core_curriculum_mastery:`);
  const ids = col.docs.map(d => ({
    id: d.id,
    title: d.data().title,
    qCount: d.data().questions?.length,
    format: d.data().format
  }));
  
  // Sort numerically by set number
  ids.sort((a, b) => {
    const na = parseInt(a.id.replace(/\D/g, '') || '0', 10);
    const nb = parseInt(b.id.replace(/\D/g, '') || '0', 10);
    return na - nb;
  });

  ids.forEach(item => {
    console.log(`${item.id} | ${item.title} | ${item.qCount} Qs | ${item.format}`);
  });

  process.exit(0);
}

listSets().catch(err => {
  console.error(err);
  process.exit(1);
});
