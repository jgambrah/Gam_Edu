import {
  SET_BECE_MOCK_1_SCIENCE_P1,
  SET_BECE_MOCK_1_SCIENCE_P2,
  SET_BECE_MOCK_1_SCIENCE_COMPLETE
} from '../src/lib/data/jhs-curriculum-set-132';

console.log('--- Verifying Set 132 (BECE Integrated Science Mock 1) ---');

// 1. Verify Paper 1
console.log('\n[1] Verifying Paper 1:');
const p1Questions = SET_BECE_MOCK_1_SCIENCE_P1.questions;
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
const p2Questions = SET_BECE_MOCK_1_SCIENCE_P2.questions;
console.log(`Total questions in Paper 2: ${p2Questions.length}`);
if (p2Questions.length !== 5) {
  throw new Error(`Expected 5 questions in Paper 2, got ${p2Questions.length}`);
}

// Check Q1 (Section A Practical)
const q1 = p2Questions[0];
const q1Marks = q1.subQuestions.reduce((sum, sq) => sum + sq.maxMarks, 0);
console.log(`Question 1 (Section A Practical): ${q1.subQuestions.length} sub-questions, Total Marks = ${q1Marks}`);
if (q1Marks !== 40) {
  throw new Error(`Question 1 total marks expected 40, got ${q1Marks}`);
}

// Check Q2-Q5 (Section B Theory)
for (let i = 1; i <= 4; i++) {
  const q = p2Questions[i];
  const qMarks = q.subQuestions.reduce((sum, sq) => sum + sq.maxMarks, 0);
  console.log(`Question ${q.questionNumber} (Section B Theory): ${q.subQuestions.length} sub-questions, Total Marks = ${qMarks}`);
  if (qMarks !== 20) {
    throw new Error(`Question ${q.questionNumber} total marks is ${qMarks}, expected 20!`);
  }
}
console.log('✅ Paper 2 marks structure verified: Section A (40 marks) + Section B (4 × 20 marks).');

// 3. Verify Vector SVGs
console.log('\n[3] Verifying Reconstructed Vector SVGs:');
const q1b = q1.subQuestions.find(sq => sq.subId === '(b)');
if (!q1b || !q1b.prompt.includes('<svg') || !q1b.prompt.includes('Eureka Can') || !q1b.prompt.includes('DISPLACEMENT PRINCIPLE')) {
  throw new Error('Q1(b) missing or invalid Eureka displacement vector SVG!');
}
console.log('✅ Q1(b) Eureka can displacement vector SVG verified.');

const q1c = q1.subQuestions.find(sq => sq.subId === '(c)');
if (!q1c || !q1c.prompt.includes('<svg') || !q1c.prompt.includes('PAPER CHROMATOGRAPHY') || !q1c.prompt.includes('Solvent Front')) {
  throw new Error('Q1(c) missing or invalid Paper chromatography vector SVG!');
}
console.log('✅ Q1(c) Paper chromatography vector SVG verified.');

// 4. Complete model verification
console.log('\n[4] Verifying Complete Document Model:');
if (SET_BECE_MOCK_1_SCIENCE_COMPLETE.setNumber !== 132 || SET_BECE_MOCK_1_SCIENCE_COMPLETE.year !== 'Mock 1') {
  throw new Error('SET_BECE_MOCK_1_SCIENCE_COMPLETE metadata mismatch!');
}
console.log('✅ Complete model metadata verified.');

console.log('\n🎉 ALL LOCAL VERIFICATION CHECKS PASSED FOR SET 132 (BECE INTEGRATED SCIENCE MOCK 1)!');
