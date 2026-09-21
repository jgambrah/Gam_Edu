import {
  SET_BECE_1992_SCIENCE_P1,
  SET_BECE_1992_SCIENCE_P2,
  SET_BECE_1992_SCIENCE_COMPLETE,
  svgQ2bLever,
  svgQ3aSoilCylinder,
  svgQ4cTeleostFish
} from '../src/lib/data/jhs-curriculum-set-124';

console.log('=== VERIFYING SET 124 (1992 BECE INTEGRATED SCIENCE VARIANT) ===\n');

// 1. Verify Paper 1
const p1Questions = SET_BECE_1992_SCIENCE_P1.questions;
console.log('Checking Paper 1:');
console.log(`Total questions: ${p1Questions.length} (Expected: 40)`);
if (p1Questions.length !== 40) {
  throw new Error(`Paper 1 count mismatch: expected 40, got ${p1Questions.length}`);
}

const keyDistribution: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
p1Questions.forEach((q, idx) => {
  if (q.options.length !== 4) {
    throw new Error(`Q${q.number} does not have exactly 4 options!`);
  }
  const correctIdx = q.options.indexOf(q.correctAnswer);
  if (correctIdx === -1) {
    throw new Error(`Q${q.number} correct answer not found in options!`);
  }
  const optionLetter = ['A', 'B', 'C', 'D'][correctIdx];
  keyDistribution[optionLetter]++;
});

console.log('Answer Key Distribution:', keyDistribution);
if (
  keyDistribution.A !== 10 ||
  keyDistribution.B !== 10 ||
  keyDistribution.C !== 10 ||
  keyDistribution.D !== 10
) {
  throw new Error('Paper 1 answer keys are not balanced to 10 A, 10 B, 10 C, 10 D!');
}
console.log('✅ Paper 1 Key distribution is perfectly balanced (10 A, 10 B, 10 C, 10 D)\n');

// 2. Verify Paper 2
const p2Questions = SET_BECE_1992_SCIENCE_P2.questions;
console.log('Checking Paper 2:');
console.log(`Total questions: ${p2Questions.length} (Expected: 4)`);
if (p2Questions.length !== 4) {
  throw new Error(`Paper 2 count mismatch: expected 4, got ${p2Questions.length}`);
}

p2Questions.forEach((q, idx) => {
  const qNum = q.questionNumber;
  const totalMarks = q.subQuestions.reduce((acc, sub) => acc + sub.maxMarks, 0);
  console.log(`Question ${qNum} sub-questions: ${q.subQuestions.length}, total marks: ${totalMarks} (Expected: 20)`);
  if (totalMarks !== 20) {
    throw new Error(`Question ${qNum} marks do not sum to 20: got ${totalMarks}`);
  }
});

// 3. Verify Reconstructed SVGs
console.log('\nChecking Reconstructed Vector SVGs:');
if (!svgQ2bLever || !svgQ2bLever.includes('<svg')) {
  throw new Error('svgQ2bLever is missing or invalid SVG!');
}
console.log('✅ Reconstructed SVG verified: Class 1 Lever (svgQ2bLever)');

if (!svgQ3aSoilCylinder || !svgQ3aSoilCylinder.includes('<svg')) {
  throw new Error('svgQ3aSoilCylinder is missing or invalid SVG!');
}
console.log('✅ Reconstructed SVG verified: Soil Stratification Cylinder (svgQ3aSoilCylinder)');

if (!svgQ4cTeleostFish || !svgQ4cTeleostFish.includes('<svg')) {
  throw new Error('svgQ4cTeleostFish is missing or invalid SVG!');
}
console.log('✅ Reconstructed SVG verified: Bony Fish External Morphology (svgQ4cTeleostFish)');

console.log('\n🎉 All Set 124 criteria successfully validated!\n');
