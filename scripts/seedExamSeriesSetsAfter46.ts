import * as admin from 'firebase-admin';
import * as fs from 'fs';

const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}
const db = admin.firestore();

const PAPERS_TO_MAP = [
  {
    docId: 'paper_2022_variant',
    name: '2022 BECE Variant',
    p1SetNum: 47,
    p2SetNum: 48,
    variantType: 'past_paper_variant'
  },
  {
    docId: 'paper_2023',
    name: '2023 Official BECE',
    p1SetNum: 49,
    p2SetNum: 50,
    variantType: 'official'
  },
  {
    docId: 'paper_2023_variant',
    name: '2023 BECE Variant',
    p1SetNum: 51,
    p2SetNum: 52,
    variantType: 'past_paper_variant'
  },
  {
    docId: 'paper_2026',
    name: '2026 Official BECE',
    p1SetNum: 53,
    p2SetNum: 54,
    variantType: 'official'
  },
  {
    docId: 'paper_2026_variant',
    name: '2026 BECE Variant',
    p1SetNum: 55,
    p2SetNum: 56,
    variantType: 'past_paper_variant'
  },
  {
    docId: 'paper_2024_variant',
    name: '2024 BECE Variant',
    p1SetNum: 58,
    p2SetNum: 59,
    variantType: 'past_paper_variant'
  },
  {
    docId: 'paper_2020_variant',
    name: '2020 BECE Variant',
    p1SetNum: 60,
    p2SetNum: 61,
    variantType: 'past_paper_variant'
  },
  {
    docId: 'paper_2021_variant',
    name: '2021 BECE Variant',
    p1SetNum: 62,
    p2SetNum: 63,
    variantType: 'past_paper_variant'
  },
  {
    docId: 'paper_2025_variant',
    name: '2025 BECE Variant',
    p1SetNum: 64,
    p2SetNum: 65,
    variantType: 'past_paper_variant'
  }
];

const BASE_DEST_PATH = 'global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets';

async function seedExamSeriesSetsAfter46() {
  console.log('🚀 Starting Seeding of Exam Series Sets After 46 (Sets 47 through 56)...\n');

  const newSetIds: string[] = [];

  for (const paperConfig of PAPERS_TO_MAP) {
    console.log(`\n📄 Reading past paper doc: ${paperConfig.docId} (${paperConfig.name})...`);
    const docSnap = await db.doc(`global_curriculum/jhs/subjects/math/past_papers/${paperConfig.docId}`).get();
    
    if (!docSnap.exists) {
      throw new Error(`Source past paper document not found: ${paperConfig.docId}`);
    }

    const data = docSnap.data()!;
    const p1Raw = data.paper1?.questions || [];
    const p2Raw = data.paper2?.questions || [];

    console.log(`   Found ${p1Raw.length} Paper 1 questions and ${p2Raw.length} Paper 2 questions.`);

    // --- 1. BUILD PAPER 1 OBJECTIVE SET ---
    const p1SetId = `jhs-math-mastery-series-${paperConfig.p1SetNum}`;
    newSetIds.push(p1SetId);

    const formattedP1Questions = p1Raw.map((q: any, idx: number) => {
      const qNum = q.number || idx + 1;
      return {
        id: `q${String(qNum).padStart(2, '0')}`,
        prompt: q.prompt || '',
        options: Array.isArray(q.options) ? q.options : [],
        correctAnswer: q.correctAnswer || '',
        hint: q.hint || 'Identify the core mathematical principles and evaluate each option step by step.',
        workedSolution: q.workedSolution || '',
        points: q.points || 1,
        ...(q.diagramSvg ? { diagramSvg: q.diagramSvg } : {})
      };
    });

    const p1Payload = {
      id: p1SetId,
      title: `Junior Core Mathematics • Objective Mastery Series (Set ${paperConfig.p1SetNum})`,
      topic: 'Comprehensive Objective Exam Series',
      tier: 'Junior Secondary (JHS)',
      subject: 'Mathematics',
      format: 'objective',
      variantType: paperConfig.variantType,
      totalQuestions: formattedP1Questions.length,
      questions: formattedP1Questions,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    console.log(`   Writing Paper 1 -> ${BASE_DEST_PATH}/${p1SetId} (Title: "${p1Payload.title}")...`);
    await db.collection(BASE_DEST_PATH).doc(p1SetId).set(p1Payload, { merge: true });

    // --- 2. BUILD PAPER 2 STRUCTURED THEORY SET ---
    const p2SetId = `jhs-math-mastery-series-${paperConfig.p2SetNum}`;
    newSetIds.push(p2SetId);

    const formattedP2Questions = p2Raw.map((q: any, idx: number) => {
      const qNum = q.questionNumber || idx + 1;
      const subQuestions = q.subQuestions || [];

      const parts = subQuestions.map((sq: any) => {
        let modelAnswer = sq.modelAnswer;
        if (!modelAnswer && typeof sq.workedSolution === 'string') {
          const firstLine = sq.workedSolution.split('\n')[0].replace(/[*#]/g, '').trim();
          modelAnswer = firstLine || 'See complete worked derivation.';
        }

        return {
          partLabel: sq.subId || `(${String.fromCharCode(97 + idx)})`,
          marks: sq.maxMarks || sq.marks || 5,
          prompt: sq.prompt || '',
          hint: sq.hint || 'Show all mathematical derivations, state formulas clearly, and simplify your final result.',
          modelAnswer: modelAnswer || 'See worked proof',
          workedSolution: sq.workedSolution || '',
          ...(sq.diagramSvg ? { diagramSvg: sq.diagramSvg } : {})
        };
      });

      const totalMarks = parts.reduce((sum: number, p: any) => sum + (p.marks || 0), 0) || 15;

      return {
        id: `q${String(qNum).padStart(2, '0')}`,
        title: q.title || `Question ${qNum}: Structured Theory & Problem Solving`,
        totalMarks,
        format: 'structured_essay',
        prompt: q.prompt || '',
        ...(q.diagramSvg ? { diagramSvg: q.diagramSvg } : {}),
        parts
      };
    });

    const p2Payload = {
      id: p2SetId,
      title: `Junior Core Mathematics • Structured Problem-Solving Series (Set ${paperConfig.p2SetNum})`,
      topic: 'Structured Theory, Geometry & Data Modeling',
      tier: 'Junior Secondary (JHS)',
      subject: 'Mathematics',
      format: 'structured_essay',
      variantType: paperConfig.variantType,
      totalQuestions: formattedP2Questions.length,
      questions: formattedP2Questions,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    console.log(`   Writing Paper 2 -> ${BASE_DEST_PATH}/${p2SetId} (Title: "${p2Payload.title}")...`);
    await db.collection(BASE_DEST_PATH).doc(p2SetId).set(p2Payload, { merge: true });
  }

  // --- 3. SYNCHRONIZE TOPIC MANIFEST ---
  console.log('\n🔄 Updating topic manifest at global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery...');
  const topicRef = db.doc('global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery');
  await topicRef.set({
    id: 'core_curriculum_mastery',
    title: 'Core Curriculum Mastery',
    subjectId: 'math',
    levelId: 'jhs',
    questionSetIds: admin.firestore.FieldValue.arrayUnion(...newSetIds),
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log(`✅ Topic manifest updated with ${newSetIds.length} new set IDs: ${newSetIds.join(', ')}`);

  // --- 4. VERIFY ALL 10 SETS IN FIRESTORE ---
  console.log('\n🔍 Verifying all newly seeded sets in Firestore...');
  for (const setId of newSetIds) {
    const snap = await db.collection(BASE_DEST_PATH).doc(setId).get();
    if (!snap.exists) {
      throw new Error(`Verification FAILED: ${setId} does not exist!`);
    }
    const d = snap.data()!;
    console.log(`   ✓ ${setId}: "${d.title}" | Format: ${d.format} | Questions: ${d.questions?.length}`);
  }

  console.log('\n🎉 ALL EXAM SERIES SETS (47 THROUGH 56) SEEDED AND VERIFIED SUCCESSFULLY!');
  process.exit(0);
}

seedExamSeriesSetsAfter46().catch(err => {
  console.error('❌ Error during seeding:', err);
  process.exit(1);
});
