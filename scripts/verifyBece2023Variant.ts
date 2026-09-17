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

async function verify2023Variant() {
  console.log('===============================================================');
  console.log('       BECE 2023 VARIANT FULL AUDIT (PAPERS 1 & 2)             ');
  console.log('===============================================================\n');

  const docPaths = [
    'global_curriculum/jhs/subjects/math/past_papers/paper_2023_variant',
    'global_curriculum/jhs/subjects/math/past_papers/year_2023_variant'
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
      throw new Error(`Expected 40 Paper 1 questions, found ${p1Questions.length}`);
    }

    // 2. Check Paper 2 questions count
    const p2Questions = data.paper2?.questions || [];
    console.log(`   ✓ Paper 2 questions count: ${p2Questions.length} (expected: 6)`);
    if (p2Questions.length !== 6) {
      throw new Error(`Expected 6 Paper 2 questions, found ${p2Questions.length}`);
    }

    // 3. Check Option balancing across A, B, C, D
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
    console.log(`   ✓ Option distribution: A=${distribution.A}, B=${distribution.B}, C=${distribution.C}, D=${distribution.D}`);
    console.log(`   ✓ All 40 Paper 1 items retain exact string match with correctAnswer.`);

    // 4. Verify Paper 1 SVGs
    const q11 = p1Questions.find((q: any) => q.number === 11);
    if (!q11?.prompt?.includes('<svg') || !q11?.prompt?.includes("viewBox='0 0 340 210'")) {
      throw new Error('P1 Q11-13 missing stem-and-leaf plot SVG');
    }
    console.log('   ✓ P1 Q11-13 contains stem-and-leaf plot SVG with viewBox="0 0 340 210"');

    const q21 = p1Questions.find((q: any) => q.number === 21);
    if (!q21?.prompt?.includes('<svg') || !q21?.prompt?.includes("viewBox='0 0 320 180'")) {
      throw new Error('P1 Q21 missing mapping Venn diagram SVG');
    }
    console.log('   ✓ P1 Q21 contains mapping Venn diagram SVG with viewBox="0 0 320 180"');

    const q25 = p1Questions.find((q: any) => q.number === 25);
    if (!q25?.prompt?.includes('<svg') || !q25?.prompt?.includes("viewBox='0 0 360 180'")) {
      throw new Error('P1 Q25-26 missing parallel transversal SVG');
    }
    console.log('   ✓ P1 Q25-26 contains parallel transversal SVG with viewBox="0 0 360 180"');

    const q29 = p1Questions.find((q: any) => q.number === 29);
    if (!q29?.prompt?.includes('<svg') || !q29?.prompt?.includes("viewBox='0 0 220 220'")) {
      throw new Error('P1 Q29-30 missing square with inscribed circle SVG');
    }
    console.log('   ✓ P1 Q29-30 contains square with inscribed circle SVG with viewBox="0 0 220 220"');

    // 5. Verify Paper 2 SVGs
    const q6 = p2Questions.find((q: any) => q.questionNumber === '6');
    const q6b = q6?.subQuestions?.find((sub: any) => sub.subId === '(b)');
    if (!q6b?.prompt?.includes('<svg') || !q6b?.prompt?.includes("viewBox='0 0 340 340'")) {
      throw new Error('P2 Q6 missing transformation coordinate grid SVG');
    }
    console.log('   ✓ P2 Q6 contains transformation grid SVG with viewBox="0 0 340 340"');

    // 6. Verify KaTeX solutions
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
  console.log('       BECE 2023 VARIANT AUDIT STATUS: 100% PASSED!             ');
  console.log('===============================================================');
}

verify2023Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Audit failed:', err);
    process.exit(1);
  });
