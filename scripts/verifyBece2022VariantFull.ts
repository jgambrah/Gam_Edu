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

async function verifyFull2022Variant() {
  console.log('===============================================================');
  console.log('   BECE 2022 VARIANT FULL CONSOLIDATED AUDIT (PAPERS 1 & 2)    ');
  console.log('===============================================================\n');

  const docPaths = [
    'global_curriculum/jhs/subjects/math/past_papers/paper_2022_variant',
    'global_curriculum/jhs/subjects/math/past_papers/year_2022_variant'
  ];

  for (const path of docPaths) {
    console.log(`📌 Verifying document at: ${path}`);
    const snap = await db.doc(path).get();
    if (!snap.exists) {
      throw new Error(`Document does not exist at: ${path}`);
    }

    const data = snap.data()!;

    // 1. Check Paper 1
    const p1Questions = data.paper1?.questions || [];
    console.log(`   ✓ Paper 1 questions count: ${p1Questions.length} (expected: 40)`);
    if (p1Questions.length !== 40) {
      throw new Error(`Expected 40 Paper 1 questions, found ${p1Questions.length}`);
    }

    // 2. Check Paper 2
    const p2Questions = data.paper2?.questions || [];
    console.log(`   ✓ Paper 2 questions count: ${p2Questions.length} (expected: 6)`);
    if (p2Questions.length !== 6) {
      throw new Error(`Expected 6 Paper 2 questions, found ${p2Questions.length}`);
    }

    // 3. Check Option balancing
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

    // 4. Verify Paper 1 SVGs
    const q18 = p1Questions.find((q: any) => q.number === 18);
    if (!q18?.prompt?.includes('<svg') || !q18?.prompt?.includes("viewBox='0 0 380 180'")) {
      throw new Error('P1 Q18 missing valid inline SVG');
    }
    console.log('   ✓ P1 Q18 contains responsive inline SVG with viewBox="0 0 380 180"');

    const q24 = p1Questions.find((q: any) => q.number === 24);
    if (!q24?.prompt?.includes('<svg') || !q24?.prompt?.includes("viewBox='0 0 340 210'")) {
      throw new Error('P1 Q24 missing valid inline SVG');
    }
    console.log('   ✓ P1 Q24 contains responsive inline SVG with viewBox="0 0 340 210"');

    // 5. Verify Paper 2 SVGs
    const q2 = p2Questions.find((q: any) => q.questionNumber === '2');
    const q2c = q2?.subQuestions?.find((sub: any) => sub.subId === '(c)');
    if (!q2c?.prompt?.includes('<svg') || !q2c?.prompt?.includes("viewBox='0 0 320 220'")) {
      throw new Error('P2 Q2(c) missing equilateral triangle SVG');
    }
    console.log('   ✓ P2 Q2(c) contains equilateral triangle SVG with viewBox="0 0 320 220"');

    const q5 = p2Questions.find((q: any) => q.questionNumber === '5');
    const q5c = q5?.subQuestions?.find((sub: any) => sub.subId === '(c)');
    if (!q5c?.prompt?.includes('<svg') || !q5c?.prompt?.includes("viewBox='0 0 360 90'")) {
      throw new Error('P2 Q5(c) missing number line SVG');
    }
    console.log('   ✓ P2 Q5(c) contains number line SVG with viewBox="0 0 360 90"');

    const q6 = p2Questions.find((q: any) => q.questionNumber === '6');
    const q6d = q6?.subQuestions?.find((sub: any) => sub.subId === '(d)');
    if (!q6d?.prompt?.includes('<svg') || !q6d?.prompt?.includes("viewBox='0 0 340 280'")) {
      throw new Error('P2 Q6(d) missing Cartesian graph SVG');
    }
    console.log('   ✓ P2 Q6(d) contains Cartesian linear graph SVG with viewBox="0 0 340 280"');

    // 6. Verify KaTeX solutions across all Paper 2 subquestions
    let subQuestionCount = 0;
    for (const q of p2Questions) {
      for (const sub of (q.subQuestions || [])) {
        subQuestionCount++;
        if (!sub.workedSolution || sub.workedSolution.length < 10) {
          throw new Error(`Paper 2 Q${q.questionNumber}${sub.subId} missing workedSolution`);
        }
      }
    }
    console.log(`   ✓ All ${subQuestionCount} Paper 2 subquestions contain step-by-step KaTeX solutions.`);

    console.log(`   ✅ Document ${path} passed 100% of audit checks!\n`);
  }

  console.log('===============================================================');
  console.log('       BECE 2022 VARIANT FULL AUDIT: 100% PASSED!              ');
  console.log('===============================================================');
}

verifyFull2022Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Audit failed:', err);
    process.exit(1);
  });
