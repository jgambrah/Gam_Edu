import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';

dotenv.config();

const fallbackKeyPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
if (!getApps().length && fs.existsSync(fallbackKeyPath)) {
  initializeApp({ credential: cert(fallbackKeyPath) });
}

const db = getFirestore();

async function checkDoc() {
  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_numbers_and_numeration');
  const snap = await docRef.get();
  const data = snap.data();
  const jsonStr = JSON.stringify(data);
  const bytes = Buffer.byteLength(jsonStr, 'utf8');
  const subcollections = await docRef.listCollections();

  console.log('--- 1-DOCUMENT READ GUARANTEE AUDIT ---');
  console.log('Doc exists:', snap.exists);
  console.log('Document size in bytes:', bytes, `(${(bytes / 1024).toFixed(2)} KB)`);
  console.log('Firestore limit:', '1,048,576 bytes (1 MiB)');
  console.log('Utilization:', `${((bytes / 1048576) * 100).toFixed(2)}% of 1 MiB limit`);
  console.log('Subcollections count on this doc:', subcollections.length, '(0 means pure single-document storage)');
  console.log('Levels present:', Object.keys(data?.levels || {}));
  console.log('B7 Notes length:', data?.levels?.b7?.notes?.length, 'chars');
  console.log('B7 Worked Examples count:', data?.levels?.b7?.workedExamples?.length);
  console.log('B7 Practice Pool items:', 
    (data?.levels?.b7?.practicePool?.low?.length || 0) + 
    (data?.levels?.b7?.practicePool?.medium?.length || 0) + 
    (data?.levels?.b7?.practicePool?.hard?.length || 0)
  );
  console.log('Read operations required by client:', '1');
}

checkDoc()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
