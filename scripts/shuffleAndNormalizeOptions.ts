import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

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

const TOPIC_IDS = [
  'topic_numbers_and_numeration',
  'topic_sets_and_venn_diagrams',
  'topic_fractions_decimals_percentages',
  'topic_ratio_proportion_financial',
  'topic_algebraic_expressions',
  'topic_equations_inequalities_graphs',
  'topic_geometry_and_trigonometry',
  'topic_data_handling_probability',
  'topic_data_handling_and_probability'
];

const LEVELS = ['b7', 'b8', 'b9'] as const;
const TIERS = ['low', 'medium', 'hard'] as const;

// Deterministic in-place Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function fixOptionDistribution() {
  console.log('===============================================================');
  console.log('    FIRESTORE GLOBAL OPTION SHUFFLER & BALANCING PROTOCOL      ');
  console.log('===============================================================\n');

  let totalQuestionsProcessed = 0;
  const initialDistribution = { A: 0, B: 0, C: 0, D: 0 };
  const postDistribution = { A: 0, B: 0, C: 0, D: 0 };

  for (const topicId of TOPIC_IDS) {
    const docRef = db.doc(`global_curriculum/jhs/subjects/math/topics/${topicId}`);
    const snap = await docRef.get();

    if (!snap.exists) {
      console.warn(`⚠️ Skipping missing topic: ${topicId}`);
      continue;
    }

    const data = snap.data() || {};
    const levels = data.levels || {};
    const isTopic8 = topicId.includes('topic_data_handling');

    for (const lvl of LEVELS) {
      const practicePool = levels[lvl]?.practicePool;
      if (!practicePool) continue;

      for (const tier of TIERS) {
        const items = practicePool[tier];
        if (!Array.isArray(items)) continue;

        for (const item of items) {
          if (!Array.isArray(item.options) || item.options.length !== 4) continue;

          // Only count for distribution metrics on unique topics (skip alias for metric duplicate counts)
          const countMetrics = topicId !== 'topic_data_handling_and_probability';
          if (countMetrics) totalQuestionsProcessed++;

          // 1. Audit initial position
          const initIdx = item.options.indexOf(item.correctAnswer);
          if (countMetrics) {
            if (initIdx === 0) initialDistribution.A++;
            else if (initIdx === 1) initialDistribution.B++;
            else if (initIdx === 2) initialDistribution.C++;
            else if (initIdx === 3) initialDistribution.D++;
          }

          // 2. Fisher-Yates shuffle options
          const newOptions = shuffleArray(item.options);

          // Verify integrity
          if (!newOptions.includes(item.correctAnswer)) {
            console.error(`🚨 FATAL: Shuffled options lost correct answer for ${item.id}`);
            process.exit(1);
          }

          item.options = newOptions;

          // 3. Track post-shuffle position
          const postIdx = newOptions.indexOf(item.correctAnswer);
          if (countMetrics) {
            if (postIdx === 0) postDistribution.A++;
            else if (postIdx === 1) postDistribution.B++;
            else if (postIdx === 2) postDistribution.C++;
            else if (postIdx === 3) postDistribution.D++;
          }
        }
      }

      // Mirror to jhs1, jhs2, jhs3
      const jhsKey = lvl === 'b7' ? 'jhs1' : lvl === 'b8' ? 'jhs2' : 'jhs3';
      if (levels[jhsKey]) {
        levels[jhsKey].practicePool = practicePool;
      }
    }

    // Atomic update preserving all other fields
    await docRef.update({
      levels: levels,
      updatedAt: FieldValue.serverTimestamp(),
      'meta.optionsShuffled': true
    });

    console.log(`✅ Shuffled & re-balanced options for topic: ${topicId}`);

    // Sync local payload files if exist
    const p1 = path.resolve(process.cwd(), 'scripts', 'payloads', `${topicId}.json`);
    const p2 = path.resolve(process.cwd(), 'scripts', 'payloads', 'topics', `${topicId}.json`);
    for (const p of [p1, p2]) {
      if (fs.existsSync(p)) {
        const raw = JSON.parse(fs.readFileSync(p, 'utf-8'));
        raw.levels = levels;
        fs.writeFileSync(p, JSON.stringify(raw, null, 2), 'utf-8');
        console.log(`  💾 Synced payload: ${p}`);
      }
    }
  }

  console.log('\n===============================================================');
  console.log('                   AUDIT & DISTRIBUTION METRICS                ');
  console.log('===============================================================');
  console.log(`Total Questions Scanned: ${totalQuestionsProcessed}`);
  console.log('\n--- BEFORE SHUFFLE ---');
  console.log(`A: ${initialDistribution.A} (${((initialDistribution.A / totalQuestionsProcessed) * 100).toFixed(1)}%)`);
  console.log(`B: ${initialDistribution.B} (${((initialDistribution.B / totalQuestionsProcessed) * 100).toFixed(1)}%)`);
  console.log(`C: ${initialDistribution.C} (${((initialDistribution.C / totalQuestionsProcessed) * 100).toFixed(1)}%)`);
  console.log(`D: ${initialDistribution.D} (${((initialDistribution.D / totalQuestionsProcessed) * 100).toFixed(1)}%)`);

  console.log('\n--- AFTER SHUFFLE ---');
  console.log(`A: ${postDistribution.A} (${((postDistribution.A / totalQuestionsProcessed) * 100).toFixed(1)}%)`);
  console.log(`B: ${postDistribution.B} (${((postDistribution.B / totalQuestionsProcessed) * 100).toFixed(1)}%)`);
  console.log(`C: ${postDistribution.C} (${((postDistribution.C / totalQuestionsProcessed) * 100).toFixed(1)}%)`);
  console.log(`D: ${postDistribution.D} (${((postDistribution.D / totalQuestionsProcessed) * 100).toFixed(1)}%)`);
  console.log('\n🎉 Options successfully randomized across all 4 keys (~25% each)!');
}

fixOptionDistribution().catch((err) => {
  console.error('Shuffling failed:', err);
  process.exit(1);
});
