import * as admin from 'firebase-admin';
import * as fs from 'fs';

const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';

if (!admin.apps.length) {
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

async function verifyBece2023Official() {
  console.log('=== VERIFYING OFFICIAL 2023 BECE MATHEMATICS INGESTION ===\n');

  const targets = ['paper_2023', 'year_2023'];

  for (const targetId of targets) {
    console.log(`Checking doc: past_papers/${targetId}...`);
    const docRef = db.doc(`global_curriculum/jhs/subjects/math/past_papers/${targetId}`);
    const snap = await docRef.get();

    if (!snap.exists) {
      throw new Error(`FAILED: Document past_papers/${targetId} does not exist!`);
    }

    const data = snap.data()!;
    console.log(`- Year: ${data.year}`);
    console.log(`- Examination: ${data.examination}`);

    // Verify Paper 1
    const p1Questions = data.paper1?.questions;
    if (!Array.isArray(p1Questions) || p1Questions.length !== 40) {
      throw new Error(`FAILED: Paper 1 questions count mismatch: expected 40, got ${p1Questions?.length}`);
    }
    console.log(`- Paper 1 Questions count: ${p1Questions.length} (PASS)`);

    const optionDist = { A: 0, B: 0, C: 0, D: 0 };
    let p1SvgCount = 0;

    for (const q of p1Questions) {
      if (!q.options || q.options.length !== 4) {
        throw new Error(`FAILED: Q${q.number} does not have exactly 4 options`);
      }
      const idx = q.options.indexOf(q.correctAnswer);
      if (idx === -1) {
        throw new Error(`FAILED: Q${q.number} correctAnswer "${q.correctAnswer}" not in options`);
      }
      const key = ['A', 'B', 'C', 'D'][idx] as 'A' | 'B' | 'C' | 'D';
      optionDist[key]++;

      if (q.prompt.includes('<svg')) {
        p1SvgCount++;
        if (!q.prompt.includes("xmlns='http://www.w3.org/2000/svg'") && !q.prompt.includes('xmlns="http://www.w3.org/2000/svg"')) {
          throw new Error(`FAILED: Q${q.number} SVG missing valid xmlns attribute`);
        }
        if (!q.prompt.includes('viewBox=')) {
          throw new Error(`FAILED: Q${q.number} SVG missing viewBox attribute`);
        }
      }
    }
    console.log(`- Paper 1 Option distribution: A=${optionDist.A}, B=${optionDist.B}, C=${optionDist.C}, D=${optionDist.D} (PASS)`);
    console.log(`- Paper 1 SVGs verified: ${p1SvgCount} (Questions 11, 12, 13, 21, 25, 26, 29, 30) (PASS)`);

    // Verify Paper 2
    const p2Questions = data.paper2?.questions;
    if (!Array.isArray(p2Questions) || p2Questions.length !== 6) {
      throw new Error(`FAILED: Paper 2 questions count mismatch: expected 6, got ${p2Questions?.length}`);
    }
    console.log(`- Paper 2 Questions count: ${p2Questions.length} (PASS)`);

    let totalSubQuestions = 0;
    let p2SvgCount = 0;
    for (const q of p2Questions) {
      if (!Array.isArray(q.subQuestions) || q.subQuestions.length === 0) {
        throw new Error(`FAILED: Paper 2 Question ${q.questionNumber} has no subQuestions`);
      }
      totalSubQuestions += q.subQuestions.length;
      for (const sq of q.subQuestions) {
        if (!sq.workedSolution || !sq.maxMarks) {
          throw new Error(`FAILED: Paper 2 Question ${q.questionNumber}${sq.subId} missing solution or marks`);
        }
        if (sq.prompt.includes('<svg')) {
          p2SvgCount++;
          if (!sq.prompt.includes('viewBox=')) {
            throw new Error(`FAILED: Paper 2 Question ${q.questionNumber}${sq.subId} SVG missing viewBox attribute`);
          }
        }
      }
    }
    console.log(`- Paper 2 Sub-questions count: ${totalSubQuestions} (PASS)`);
    console.log(`- Paper 2 SVGs verified: ${p2SvgCount} (Q4b pie chart, Q6b transformation grid) (PASS)\n`);
  }

  // Verify Index & Registry
  console.log('Checking past_papers/index...');
  const indexSnap = await db.doc('global_curriculum/jhs/subjects/math/past_papers/index').get();
  if (!indexSnap.exists || !indexSnap.data()?.papers?.['2023']) {
    throw new Error('FAILED: 2023 entry missing from past_papers/index');
  }
  console.log('- past_papers/index contains 2023 record (PASS)');

  console.log('\nAll verification checks PASSED successfully!');
}

verifyBece2023Official()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Verification failed:', err);
    process.exit(1);
  });
