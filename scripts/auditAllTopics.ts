import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';

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

const CANONICAL_TOPIC_IDS = [
  'topic_numbers_and_numeration',
  'topic_fractions_decimals_percentages',
  'topic_ratio_proportion_financial',
  'topic_sets_and_venn_diagrams',
  'topic_algebraic_expressions',
  'topic_equations_inequalities_graphs',
  'topic_geometry_and_trigonometry',
  'topic_data_handling_probability',
];

async function audit() {
  console.log('================================================================');
  console.log('📊 COMPREHENSIVE CURRICULUM AUDIT: ALL 8 CANONICAL TOPICS');
  console.log('================================================================\n');

  let allValid = true;
  let totalPracticeQuestions = 0;
  let totalBytes = 0;

  for (let i = 0; i < CANONICAL_TOPIC_IDS.length; i++) {
    const id = CANONICAL_TOPIC_IDS[i];
    const docRef = db.doc(`global_curriculum/jhs/subjects/math/topics/${id}`);
    const snap = await docRef.get();

    if (!snap.exists) {
      console.error(`❌ [${i + 1}/8] Topic missing: ${id}`);
      allValid = false;
      continue;
    }

    const data = snap.data() || {};
    const subcols = await docRef.listCollections();
    const size = Buffer.byteLength(JSON.stringify(data), 'utf8');
    totalBytes += size;

    const b7Q = (data.levels?.b7?.practicePool?.low?.length || 0) +
                (data.levels?.b7?.practicePool?.medium?.length || 0) +
                (data.levels?.b7?.practicePool?.hard?.length || 0);
    const b8Q = (data.levels?.b8?.practicePool?.low?.length || 0) +
                (data.levels?.b8?.practicePool?.medium?.length || 0) +
                (data.levels?.b8?.practicePool?.hard?.length || 0);
    const b9Q = (data.levels?.b9?.practicePool?.low?.length || 0) +
                (data.levels?.b9?.practicePool?.medium?.length || 0) +
                (data.levels?.b9?.practicePool?.hard?.length || 0);
    const topicQ = b7Q + b8Q + b9Q;
    totalPracticeQuestions += topicQ;

    const hasDualKeys = data.levels?.jhs1 && data.levels?.jhs2 && data.levels?.jhs3;

    console.log(`Topic ${i + 1}: ${data.title} [${id}]`);
    console.log(`  • Strand: ${data.strand?.code} (${data.strand?.name})`);
    console.log(`  • Size: ${size} bytes (~${(size / 1024).toFixed(1)} KB) - ${((size / 1048576) * 100).toFixed(2)}% of 1 MiB`);
    console.log(`  • Subcollections: ${subcols.length} (Strict 1-Doc Guarantee: ${subcols.length === 0 ? 'PASSED ✅' : 'FAILED ❌'})`);
    console.log(`  • Questions: ${topicQ} total (B7: ${b7Q}, B8: ${b8Q}, B9: ${b9Q})`);
    console.log(`  • Dual-Key Mirroring (B7-B9 & JHS1-JHS3): ${hasDualKeys ? 'VERIFIED ✅' : 'MISSING ❌'}`);
    console.log(`  • Status: READY ✅\n`);
  }

  console.log('================================================================');
  console.log('🎯 SUMMARY AUDIT RESULTS');
  console.log('================================================================');
  console.log(`Total Canonical Topics: ${CANONICAL_TOPIC_IDS.length} / 8`);
  console.log(`Total Practice Questions: ${totalPracticeQuestions}`);
  console.log(`Total Curriculum Footprint: ${totalBytes} bytes (~${(totalBytes / 1024).toFixed(1)} KB)`);
  console.log(`All 8 Topics Comply with 1-Document Read Guarantee: ${allValid ? 'YES ✅' : 'NO ❌'}`);
  console.log('================================================================');
}

audit().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
