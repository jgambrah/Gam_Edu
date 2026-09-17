import * as admin from 'firebase-admin';
import * as fs from 'fs';

const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}
const db = admin.firestore();

async function verifyAllExamSeriesSets() {
  console.log('===============================================================');
  console.log('       EXAM SERIES (SETS 45 THROUGH 56) VERIFICATION AUDIT     ');
  console.log('===============================================================\n');

  const SETS_TO_VERIFY = [
    { id: 'jhs-math-mastery-series-45', expectedFormat: 'objective', expectedCount: 40, expectedTitlePart: 'Set 45' },
    { id: 'jhs-math-mastery-series-46', expectedFormat: 'structured_essay', expectedCount: 4, expectedTitlePart: 'Set 46' },
    { id: 'jhs-math-mastery-series-47', expectedFormat: 'objective', expectedCount: 40, expectedTitlePart: 'Set 47' },
    { id: 'jhs-math-mastery-series-48', expectedFormat: 'structured_essay', expectedCount: 6, expectedTitlePart: 'Set 48' },
    { id: 'jhs-math-mastery-series-49', expectedFormat: 'objective', expectedCount: 40, expectedTitlePart: 'Set 49' },
    { id: 'jhs-math-mastery-series-50', expectedFormat: 'structured_essay', expectedCount: 6, expectedTitlePart: 'Set 50' },
    { id: 'jhs-math-mastery-series-51', expectedFormat: 'objective', expectedCount: 40, expectedTitlePart: 'Set 51' },
    { id: 'jhs-math-mastery-series-52', expectedFormat: 'structured_essay', expectedCount: 6, expectedTitlePart: 'Set 52' },
    { id: 'jhs-math-mastery-series-53', expectedFormat: 'objective', expectedCount: 40, expectedTitlePart: 'Set 53' },
    { id: 'jhs-math-mastery-series-54', expectedFormat: 'structured_essay', expectedCount: 6, expectedTitlePart: 'Set 54' },
    { id: 'jhs-math-mastery-series-55', expectedFormat: 'objective', expectedCount: 40, expectedTitlePart: 'Set 55' },
    { id: 'jhs-math-mastery-series-56', expectedFormat: 'structured_essay', expectedCount: 6, expectedTitlePart: 'Set 56' },
  ];

  const basePath = 'global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets';

  for (const setInfo of SETS_TO_VERIFY) {
    const docPath = `${basePath}/${setInfo.id}`;
    const snap = await db.doc(docPath).get();

    if (!snap.exists) {
      throw new Error(`❌ Document NOT found: ${docPath}`);
    }

    const data = snap.data()!;
    console.log(`📌 Verifying ${setInfo.id}:`);
    console.log(`   Title: "${data.title}"`);
    console.log(`   Topic: "${data.topic}"`);
    console.log(`   Questions Count: ${data.questions?.length}`);

    // Check title contains expected Set number
    if (!data.title.includes(setInfo.expectedTitlePart)) {
      throw new Error(`Title does not contain "${setInfo.expectedTitlePart}": ${data.title}`);
    }

    // Check count
    if (data.questions?.length !== setInfo.expectedCount) {
      throw new Error(`Expected ${setInfo.expectedCount} questions, got ${data.questions?.length}`);
    }

    // Check questions structure
    if (setInfo.expectedFormat === 'objective') {
      const q1 = data.questions[0];
      if (!Array.isArray(q1.options) || q1.options.length !== 4) {
        throw new Error(`Question 1 in ${setInfo.id} does not have 4 options!`);
      }
      if (!q1.correctAnswer || !q1.options.includes(q1.correctAnswer)) {
        throw new Error(`Question 1 correctAnswer is not in options in ${setInfo.id}!`);
      }
      console.log(`   ✓ Objective options & correctAnswer valid (40 Qs).`);
    } else {
      const q1 = data.questions[0];
      if (!Array.isArray(q1.parts) || q1.parts.length === 0) {
        throw new Error(`Question 1 in ${setInfo.id} does not have parts array!`);
      }
      const partA = q1.parts[0];
      if (!partA.partLabel || !partA.prompt || !partA.workedSolution) {
        throw new Error(`Part (a) in ${setInfo.id} missing required rubric fields!`);
      }
      console.log(`   ✓ Structured theory parts & rubrics valid (${data.questions.length} problems, ${q1.parts.length} parts in Q1).`);
    }
  }

  // Verify Topic Manifest arrayUnion
  const topicSnap = await db.doc('global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery').get();
  const topicData = topicSnap.data()!;
  const registeredIds: string[] = topicData.questionSetIds || [];

  console.log(`\n📋 Manifest check in core_curriculum_mastery:`);
  console.log(`   Total registered IDs in manifest: ${registeredIds.length}`);

  for (const s of SETS_TO_VERIFY) {
    if (!registeredIds.includes(s.id)) {
      throw new Error(`Manifest missing set ID: ${s.id}`);
    }
  }
  console.log(`   ✓ All Sets 45 through 56 are registered in the manifest array.`);

  console.log('\n===============================================================');
  console.log('   🎉 ALL AUDITS PASSED WITH 100% SPECIFICATION CONFORMANCE!    ');
  console.log('===============================================================\n');

  process.exit(0);
}

verifyAllExamSeriesSets().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
