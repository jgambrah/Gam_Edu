import {
  SET_BECE_1998_SCIENCE_P1,
  SET_BECE_1998_SCIENCE_P2,
  SET_BECE_1998_SCIENCE_COMPLETE
} from '../src/lib/data/jhs-curriculum-set-130';

console.log('--- Verifying Set 130 (1998 BECE Integrated Science Variant) ---');

// 1. Verify Paper 1
console.log('\n[1] Verifying Paper 1:');
const p1Questions = SET_BECE_1998_SCIENCE_P1.questions;
console.log(`Total questions in Paper 1: ${p1Questions.length}`);
if (p1Questions.length !== 40) {
  throw new Error(`Expected 40 questions in Paper 1, got ${p1Questions.length}`);
}

const keyDistribution = { A: 0, B: 0, C: 0, D: 0 };
p1Questions.forEach((q) => {
  if (!q.options || q.options.length !== 4) {
    throw new Error(`Q${q.number} does not have 4 options!`);
  }
  const correctIdx = q.options.indexOf(q.correctAnswer);
  if (correctIdx === -1) {
    throw new Error(`Q${q.number} correctAnswer not found in options!`);
  }
  const keyLetter = ['A', 'B', 'C', 'D'][correctIdx] as 'A' | 'B' | 'C' | 'D';
  keyDistribution[keyLetter]++;
});

console.log('Answer key distribution:', keyDistribution);
if (
  keyDistribution.A !== 10 ||
  keyDistribution.B !== 10 ||
  keyDistribution.C !== 10 ||
  keyDistribution.D !== 10
) {
  throw new Error(`Unbalanced key distribution! Expected 10 each, got: ${JSON.stringify(keyDistribution)}`);
}
console.log('✅ Paper 1 key distribution is perfectly balanced (10 A, 10 B, 10 C, 10 D).');

// 2. Verify Paper 2
console.log('\n[2] Verifying Paper 2:');
const p2Questions = SET_BECE_1998_SCIENCE_P2.questions;
console.log(`Total questions in Paper 2: ${p2Questions.length}`);
if (p2Questions.length !== 4) {
  throw new Error(`Expected 4 questions in Paper 2, got ${p2Questions.length}`);
}

let totalMarks = 0;
p2Questions.forEach((q) => {
  const qMarks = q.subQuestions.reduce((sum, sq) => sum + sq.maxMarks, 0);
  console.log(`Question ${q.questionNumber}: ${q.subQuestions.length} sub-questions, Total Marks = ${qMarks}`);
  if (qMarks !== 20) {
    throw new Error(`Question ${q.questionNumber} total marks is ${qMarks}, expected 20!`);
  }
  totalMarks += qMarks;
});

console.log(`Total Paper 2 Marks: ${totalMarks}`);
if (totalMarks !== 80) {
  throw new Error(`Total Paper 2 marks is ${totalMarks}, expected 80!`);
}
console.log('✅ Paper 2 marks structure verified: 4 questions × 20 marks = 80 marks.');

// 3. Verify Vector SVGs
console.log('\n[3] Verifying Reconstructed Vector SVGs:');
const q4c = p2Questions[3].subQuestions.find(sq => sq.subId === '(c)');
if (!q4c || !q4c.prompt.includes('<svg') || !q4c.prompt.includes('LITHIUM ATOM') || !q4c.prompt.includes('K-shell')) {
  throw new Error('Q4(c) missing or invalid Lithium Bohr atom vector SVG!');
}
console.log('✅ Q4(c) Lithium Bohr shell structure SVG verified.');

const q39 = p1Questions.find(q => q.number === 39);
if (!q39 || !q39.prompt.includes('<svg') || !q39.prompt.includes('Alveolus') || !q39.prompt.includes('Capillary')) {
  throw new Error('Q39 missing or invalid alveolar capillary gas exchange vector SVG!');
}
console.log('✅ Q39 Alveolar-capillary gas exchange SVG verified.');

// 4. Complete model verification
console.log('\n[4] Verifying Complete Document Model:');
if (SET_BECE_1998_SCIENCE_COMPLETE.setNumber !== 130 || SET_BECE_1998_SCIENCE_COMPLETE.year !== 1998) {
  throw new Error('SET_BECE_1998_SCIENCE_COMPLETE metadata mismatch!');
}
console.log('✅ Complete model metadata verified.');

console.log('\n🎉 ALL LOCAL VERIFICATION CHECKS PASSED FOR SET 130 (1998 BECE INTEGRATED SCIENCE)!');
