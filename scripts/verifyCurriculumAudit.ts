import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import * as fs from 'fs';

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gamedu-69888475-f5783';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const fallbackKeyPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';

if (!admin.apps.length) {
  if (clientEmail && privateKey) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
  } else if (fs.existsSync(fallbackKeyPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(fallbackKeyPath),
    });
  } else {
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } catch {
      admin.initializeApp({ projectId });
    }
  }
}

const db = admin.firestore();

interface PracticeItem {
  id: string;
  difficulty: 'low' | 'medium' | 'hard';
  dokLevel: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

interface LevelPool {
  practicePool?: {
    low?: PracticeItem[];
    medium?: PracticeItem[];
    hard?: PracticeItem[];
  };
}

interface TopicDoc {
  title?: string;
  levels?: {
    b7?: LevelPool;
    b8?: LevelPool;
    b9?: LevelPool;
  };
}

const TOPIC_IDS = [
  'topic_numbers_and_numeration',
  'topic_sets_and_venn_diagrams',
  'topic_fractions_decimals_percentages',
  'topic_ratio_proportion_financial',
  'topic_algebraic_expressions',
  'topic_equations_inequalities_graphs',
  'topic_geometry_and_trigonometry',
  'topic_data_handling_and_probability'
];

const LEVELS: Array<'b7' | 'b8' | 'b9'> = ['b7', 'b8', 'b9'];
const TIERS: Array<'low' | 'medium' | 'hard'> = ['low', 'medium', 'hard'];

async function runCurriculumAudit() {
  console.log('===============================================================');
  console.log('   WAEC BECE JHS MATHEMATICS CURRICULUM AUDIT (3,600 ITEMS)    ');
  console.log('===============================================================\n');

  let totalQuestionsCounted = 0;
  let totalErrors = 0;
  let totalSvgVisualsCounted = 0;
  const globalIdSet = new Set<string>();

  for (const topicId of TOPIC_IDS) {
    let docRef = db.doc(`global_curriculum/jhs/subjects/math/topics/${topicId}`);
    let snap = await docRef.get();

    if (!snap.exists && topicId === 'topic_data_handling_and_probability') {
      docRef = db.doc(`global_curriculum/jhs/subjects/math/topics/topic_data_handling_probability`);
      snap = await docRef.get();
    }

    if (!snap.exists) {
      console.error(`❌ [MISSING DOC] ${topicId} does not exist in Firestore!`);
      totalErrors++;
      continue;
    }

    const data = snap.data() as TopicDoc;
    let topicTotal = 0;
    console.log(`\n📌 Checking Topic: ${topicId}`);

    for (const level of LEVELS) {
      const levelData = data.levels?.[level];
      if (!levelData || !levelData.practicePool) {
        console.error(`   ❌ [MISSING LEVEL] Level ${level} or practicePool missing in ${topicId}`);
        totalErrors++;
        continue;
      }

      let levelTotal = 0;

      for (const tier of TIERS) {
        const items = levelData.practicePool[tier] || [];
        const count = items.length;
        levelTotal += count;
        totalQuestionsCounted += count;

        if (count !== 50) {
          console.error(`   ⚠️ [ITEM COUNT MISMATCH] ${level}.${tier}: Expected 50, found ${count}`);
          totalErrors++;
        }

        // Validate item schema integrity
        items.forEach((item, idx) => {
          const itemRef = `${topicId} > ${level}.${tier}[${idx}] (${item.id || 'NO_ID'})`;

          if (!item.id) {
            console.error(`      ❌ Missing ID at ${itemRef}`);
            totalErrors++;
          } else if (globalIdSet.has(item.id)) {
            console.error(`      ❌ Duplicate Global ID found: ${item.id}`);
            totalErrors++;
          } else {
            globalIdSet.add(item.id);
          }

          if (![1, 2, 3].includes(item.dokLevel)) {
            console.error(`      ❌ Invalid dokLevel (${item.dokLevel}) at ${itemRef}`);
            totalErrors++;
          }

          if (!item.prompt || item.prompt.trim() === '') {
            console.error(`      ❌ Empty prompt at ${itemRef}`);
            totalErrors++;
          }

          if (item.prompt && item.prompt.includes('<svg')) {
            totalSvgVisualsCounted++;
          }

          if (!Array.isArray(item.options) || item.options.length !== 4) {
            console.error(`      ❌ Options count is not 4 (${item.options?.length}) at ${itemRef}`);
            totalErrors++;
          } else {
            const uniqueOptions = new Set(item.options);
            if (uniqueOptions.size !== 4) {
              console.error(`      ❌ Duplicate option values detected at ${itemRef}`);
              totalErrors++;
            }
          }

          if (!item.options?.includes(item.correctAnswer)) {
            console.error(`      ❌ Correct answer "${item.correctAnswer}" not in options list at ${itemRef}`);
            totalErrors++;
          }

          if (!item.workedSolution || item.workedSolution.trim() === '') {
            console.error(`      ❌ Missing workedSolution at ${itemRef}`);
            totalErrors++;
          }

          if (typeof item.points !== 'number' || item.points < 1) {
            console.error(`      ❌ Invalid points value (${item.points}) at ${itemRef}`);
            totalErrors++;
          }
        });
      }

      console.log(`   ✓ ${level.toUpperCase()}: ${levelTotal}/150 standard items verified.`);
      topicTotal += levelTotal;
    }

    console.log(`   📊 Topic Total: ${topicTotal}/450 items verified.`);
  }

  console.log('\n===============================================================');
  console.log('                     FINAL AUDIT SUMMARY                       ');
  console.log('===============================================================');
  console.log(`  Total Firestore Documents Audited : ${TOPIC_IDS.length}`);
  console.log(`  Total Question Bank Items Counted : ${totalQuestionsCounted} / 3,600`);
  console.log(`  Unique Question IDs Verified      : ${globalIdSet.size}`);
  console.log(`  Inline Responsive SVGs Verified   : ${totalSvgVisualsCounted}`);
  console.log(`  Integrity & Validation Errors     : ${totalErrors}`);

  if (totalQuestionsCounted === 3600 && totalErrors === 0) {
    console.log('\n🎉 AUDIT STATUS: PASSED (100% Curriculum Ingestion Integrity)');
    process.exit(0);
  } else {
    console.error(`\n🚨 AUDIT STATUS: FAILED with ${totalErrors} issue(s). Review logs above.`);
    process.exit(1);
  }
}

runCurriculumAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
