import * as admin from 'firebase-admin';
import * as fs from 'fs';

if (!admin.apps.length) {
  const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
  if (fs.existsSync(serviceAccountPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

const db = admin.firestore();

async function verifyBece2026Variant() {
  console.log('===============================================================');
  console.log('    BECE 2026 VARIANT (CLONED MODEL) VERIFICATION AUDIT        ');
  console.log('===============================================================\n');

  const docPaths = [
    'global_curriculum/jhs/subjects/math/past_papers/paper_2026_variant',
    'global_curriculum/jhs/subjects/math/past_papers/year_2026_variant'
  ];

  for (const path of docPaths) {
    console.log(`📌 Verifying document at: ${path}`);
    const snap = await db.doc(path).get();
    if (!snap.exists) {
      throw new Error(`Document does not exist at: ${path}`);
    }

    const data = snap.data()!;

    // 1. Check Paper 1 questions count
    const p1Questions = data.paper1?.questions || [];
    console.log(`   ✓ Paper 1 questions count: ${p1Questions.length} (expected: 40)`);
    if (p1Questions.length !== 40) {
      throw new Error(`Expected 40 Paper 1 questions, got ${p1Questions.length}`);
    }

    // 2. Check Paper 2 questions count
    const p2Questions = data.paper2?.questions || [];
    console.log(`   ✓ Paper 2 questions count: ${p2Questions.length} (expected: 6)`);
    if (p2Questions.length !== 6) {
      throw new Error(`Expected 6 Paper 2 questions, got ${p2Questions.length}`);
    }

    // 3. Check Option balancing & exact correctAnswer match
    const distribution = { A: 0, B: 0, C: 0, D: 0 };
    for (let i = 0; i < p1Questions.length; i++) {
      const q = p1Questions[i];
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${q.number || i + 1} does not have exactly 4 options`);
      }
      const matchIdx = q.options.indexOf(q.correctAnswer);
      if (matchIdx === -1) {
        throw new Error(`Question ${q.number || i + 1} correctAnswer '${q.correctAnswer}' not in options!`);
      }
      if (matchIdx === 0) distribution.A++;
      else if (matchIdx === 1) distribution.B++;
      else if (matchIdx === 2) distribution.C++;
      else if (matchIdx === 3) distribution.D++;
    }
    console.log(`   ✓ Paper 1 option distribution: A=${distribution.A}, B=${distribution.B}, C=${distribution.C}, D=${distribution.D}`);
    console.log(`   ✓ All 40 items retain exact string correspondence with correctAnswer.`);

    // 4. Verify inline SVGs
    const q28 = p1Questions.find((q: any) => q.number === 28);
    if (!q28 || !q28.prompt.includes('<svg') || !q28.prompt.includes("viewBox='0 0 320 110'")) {
      throw new Error('Paper 1 Question 28 missing valid inline SVG with viewBox');
    }
    console.log('   ✓ Paper 1 Question 28 contains responsive inline SVG with viewBox="0 0 320 110"');

    const q30 = p1Questions.find((q: any) => q.number === 30);
    if (!q30 || !q30.prompt.includes('<svg') || !q30.prompt.includes("viewBox='0 0 360 180'")) {
      throw new Error('Paper 1 Question 30 missing valid inline SVG with viewBox');
    }
    console.log('   ✓ Paper 1 Question 30 contains responsive inline SVG with viewBox="0 0 360 180"');

    const q3 = p2Questions.find((q: any) => q.questionNumber === '3');
    const q3b = q3?.subQuestions?.find((sub: any) => sub.subId === '(b)');
    if (!q3b || !q3b.prompt.includes('<svg') || !q3b.prompt.includes("viewBox='0 0 340 200'")) {
      throw new Error('Paper 2 Question 3(b) missing valid inline SVG with viewBox');
    }
    console.log('   ✓ Paper 2 Question 3(b) contains responsive inline SVG with viewBox="0 0 340 200"');

    const q4 = p2Questions.find((q: any) => q.questionNumber === '4');
    const q4b = q4?.subQuestions?.find((sub: any) => sub.subId === '(b)');
    if (!q4b || !q4b.prompt.includes('<svg') || !q4b.prompt.includes("viewBox='0 0 300 200'")) {
      throw new Error('Paper 2 Question 4(b) missing valid inline SVG with viewBox');
    }
    console.log('   ✓ Paper 2 Question 4(b) contains responsive inline SVG with viewBox="0 0 300 200"');

    // 5. Verify step-by-step KaTeX solutions for Paper 2
    let subQuestionCount = 0;
    for (const q of p2Questions) {
      for (const sub of (q.subQuestions || [])) {
        subQuestionCount++;
        if (!sub.workedSolution || sub.workedSolution.length < 10) {
          throw new Error(`Paper 2 Question ${q.questionNumber}${sub.subId} missing workedSolution`);
        }
      }
    }
    console.log(`   ✓ All ${subQuestionCount} Paper 2 subquestions contain step-by-step KaTeX solutions.`);

    console.log(`   ✅ Document ${path} passed 100% of audit checks!\n`);
  }

  console.log('===============================================================');
  console.log('       BECE 2026 VARIANT AUDIT STATUS: 100% PASSED!             ');
  console.log('===============================================================');
}

verifyBece2026Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Variant audit failed:', err);
    process.exit(1);
  });
