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

const CANONICAL_TOPICS = [
  'topic_numbers_and_numeration',
  'topic_fractions_decimals_percentages',
  'topic_ratio_proportion_financial',
  'topic_sets_and_venn_diagrams',
  'topic_algebraic_expressions',
  'topic_equations_inequalities_graphs',
  'topic_geometry_and_trigonometry',
  'topic_data_handling_probability',
];

const REQUIRED_LEVELS = ['b7', 'b8', 'b9'];
const REQUIRED_DIFFICULTIES = ['low', 'medium', 'hard'];

async function audit() {
  console.log('🚀 Starting Full-Curriculum Topical Labs Audit...\n');
  let passCount = 0;
  let totalErrors = 0;

  for (const topicId of CANONICAL_TOPICS) {
    const docRef = db.doc(`global_curriculum/jhs/subjects/math/topics/${topicId}`);
    const snap = await docRef.get();

    if (!snap.exists) {
      console.error(`❌ [MISSING DOC] ${topicId} does not exist in Firestore!`);
      totalErrors++;
      continue;
    }

    const data = snap.data();
    let topicErrors = 0;

    // 1. Verify Manifest Identity
    if (!data?.title || !data?.strand?.name) {
      console.error(`  ⚠️ [METADATA] ${topicId} is missing title or strand definition.`);
      topicErrors++;
    }

    // 2. Verify Grade Levels
    for (const lvl of REQUIRED_LEVELS) {
      const levelBlock = data?.levels?.[lvl];
      if (!levelBlock) {
        console.error(`  ⚠️ [LEVEL MISSING] ${topicId} is missing level '${lvl}'.`);
        topicErrors++;
        continue;
      }

      // Check Notes & Interactivity
      if (!levelBlock.notes || levelBlock.notes.length < 150) {
        console.error(`  ⚠️ [NOTES SCANTY] ${topicId} (${lvl}) notes are missing or too short.`);
        topicErrors++;
      }
      if (!levelBlock.notes.includes('<details>') || !levelBlock.notes.includes('</details>')) {
        console.warn(`  ℹ️ [NO INTERACTION] ${topicId} (${lvl}) lacks interactive <details> tags.`);
      }

      // Check Worked Examples
      if (!Array.isArray(levelBlock.workedExamples) || levelBlock.workedExamples.length < 2) {
        console.error(`  ⚠️ [WORKED EXAMPLES] ${topicId} (${lvl}) has fewer than 2 worked examples.`);
        topicErrors++;
      } else {
        const hasWhyStep = levelBlock.workedExamples.some((we: any) =>
          we.steps?.some((s: string) => s.includes('Why we do this'))
        );
        if (!hasWhyStep) {
          console.warn(`  ℹ️ [SCAFFOLDING] ${topicId} (${lvl}) worked examples lack 'Why we do this' annotations.`);
        }
      }

      // Check Practice Pool
      const pool = levelBlock.practicePool;
      if (!pool) {
        console.error(`  ⚠️ [POOL MISSING] ${topicId} (${lvl}) practicePool is missing.`);
        topicErrors++;
      } else {
        for (const diff of REQUIRED_DIFFICULTIES) {
          if (!Array.isArray(pool[diff]) || pool[diff].length === 0) {
            console.error(`  ⚠️ [POOL EMPTY] ${topicId} (${lvl}) practicePool.${diff} is empty.`);
            topicErrors++;
          }
        }
      }
    }

    if (topicErrors === 0) {
      console.log(`✅ [PASS] ${topicId} (${data?.title}) is 100% compliant.`);
      passCount++;
    } else {
      totalErrors += topicErrors;
    }
  }

  console.log('\n----------------------------------------');
  console.log(`Audit Summary: ${passCount} / ${CANONICAL_TOPICS.length} Topics Compliant`);
  console.log(`Total Validation Errors Encountered: ${totalErrors}`);
  console.log('----------------------------------------\n');

  if (totalErrors > 0) {
    process.exit(1);
  }
}

audit().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });
