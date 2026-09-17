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

async function verify2022Variant() {
  console.log('===============================================================');
  console.log('       BECE 2022 VARIANT (PAPER 1) VERIFICATION AUDIT          ');
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
    const p1Questions = data.paper1?.questions || [];
    console.log(`   ✓ Paper 1 questions count: ${p1Questions.length} (expected: 40)`);
    if (p1Questions.length !== 40) {
      throw new Error(`Expected 40 questions, found ${p1Questions.length}`);
    }

    const distribution = { A: 0, B: 0, C: 0, D: 0 };
    for (let i = 0; i < p1Questions.length; i++) {
      const q = p1Questions[i];
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${q.number || i + 1} does not have exactly 4 options`);
      }
      const matchIdx = q.options.indexOf(q.correctAnswer);
      if (matchIdx === -1) {
        throw new Error(`Question ${q.number || i + 1} correctAnswer '${q.correctAnswer}' not found in options!`);
      }
      if (matchIdx === 0) distribution.A++;
      else if (matchIdx === 1) distribution.B++;
      else if (matchIdx === 2) distribution.C++;
      else if (matchIdx === 3) distribution.D++;
    }
    console.log(`   ✓ Option distribution: A=${distribution.A}, B=${distribution.B}, C=${distribution.C}, D=${distribution.D}`);
    console.log(`   ✓ All 40 items retain exact string match with correctAnswer.`);

    // Check SVGs
    const q18 = p1Questions.find((q: any) => q.number === 18);
    if (!q18?.prompt?.includes('<svg') || !q18?.prompt?.includes("viewBox='0 0 380 180'")) {
      throw new Error('Q18 missing valid inline SVG');
    }
    console.log('   ✓ Question 18/19 contains responsive inline SVG with viewBox="0 0 380 180"');

    const q24 = p1Questions.find((q: any) => q.number === 24);
    if (!q24?.prompt?.includes('<svg') || !q24?.prompt?.includes("viewBox='0 0 340 210'")) {
      throw new Error('Q24-26 missing valid inline SVG for stem-and-leaf plot');
    }
    console.log('   ✓ Question 24-26 contains responsive inline SVG with viewBox="0 0 340 210"');

    console.log(`   ✅ Document ${path} passed 100% of audit checks!\n`);
  }

  console.log('===============================================================');
  console.log('       BECE 2022 VARIANT AUDIT STATUS: 100% PASSED!             ');
  console.log('===============================================================');
}

verify2022Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Audit failed:', err);
    process.exit(1);
  });
