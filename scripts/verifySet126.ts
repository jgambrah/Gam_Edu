import {
  SET_BECE_1994_SCIENCE_P1,
  SET_BECE_1994_SCIENCE_P2,
  SET_BECE_1994_SCIENCE_COMPLETE,
  svgQ3aLeverStone,
  svgQ4cDCSeriesParallel
} from '../src/lib/data/jhs-curriculum-set-126';

console.log('--- Verifying Set 126 (1994 BECE Science) Locally ---');

// 1. Paper 1 Verification
const p1Questions = SET_BECE_1994_SCIENCE_P1.questions;
console.log('Paper 1 total questions:', p1Questions.length);
if (p1Questions.length !== 40) {
  throw new Error(`Expected 40 questions in Paper 1, got ${p1Questions.length}`);
}

const keyDist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
p1Questions.forEach((q, idx) => {
  const optIdx = q.options.indexOf(q.correctAnswer);
  if (optIdx === -1) {
    throw new Error(`Q${q.number}: correctAnswer not found in options!`);
  }
  const letter = ['A', 'B', 'C', 'D'][optIdx];
  keyDist[letter]++;
});

console.log('Paper 1 Key Distribution:', keyDist);
if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
  throw new Error(`Key distribution is NOT exactly 10 A, 10 B, 10 C, 10 D!`);
}

// 2. Paper 2 Verification
const p2Questions = SET_BECE_1994_SCIENCE_P2.questions;
console.log('Paper 2 total questions:', p2Questions.length);
if (p2Questions.length !== 4) {
  throw new Error(`Expected 4 questions in Paper 2, got ${p2Questions.length}`);
}

let totalP2Marks = 0;
p2Questions.forEach(q => {
  const qMarks = q.subQuestions.reduce((sum, sq) => sum + sq.maxMarks, 0);
  console.log(`Question ${q.questionNumber}: ${q.subQuestions.length} sub-questions, ${qMarks} marks`);
  if (qMarks !== 20) {
    throw new Error(`Question ${q.questionNumber} total marks is ${qMarks}, expected 20`);
  }
  totalP2Marks += qMarks;
});
console.log('Paper 2 Total Marks:', totalP2Marks);
if (totalP2Marks !== 80) {
  throw new Error(`Paper 2 total marks is ${totalP2Marks}, expected 80`);
}

// 3. SVG Checks
if (!svgQ3aLeverStone.includes('<svg') || !svgQ3aLeverStone.includes('LOAD DISTANCE')) {
  throw new Error('svgQ3aLeverStone is invalid or missing expected content');
}
console.log('✅ svgQ3aLeverStone verified.');

if (!svgQ4cDCSeriesParallel.includes('<svg') || !svgQ4cDCSeriesParallel.includes('Two Cells in Series')) {
  throw new Error('svgQ4cDCSeriesParallel is invalid or missing expected content');
}
console.log('✅ svgQ4cDCSeriesParallel verified.');

console.log('🎉 ALL LOCAL VERIFICATION CHECKS PASSED FOR SET 126!');
