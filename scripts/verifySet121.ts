import * as dotenv from 'dotenv';
import * as path from 'path';
import {
  SET_BECE_2023_SCIENCE_P1,
  SET_BECE_2023_SCIENCE_P2,
  SET_BECE_2023_SCIENCE_COMPLETE
} from '../src/lib/data/jhs-curriculum-set-121';

const repoRoot = process.cwd();
dotenv.config({ path: path.join(repoRoot, '.env') });
dotenv.config();

function verifySet121Local() {
  console.log('=== VERIFYING SET 121 (2023 BECE INTEGRATED SCIENCE VARIANT) ===');

  // 1. Paper 1 checks
  console.log('\nChecking Paper 1:');
  const p1Questions = SET_BECE_2023_SCIENCE_P1.questions;
  console.log(`Total questions: ${p1Questions.length} (Expected: 40)`);
  if (p1Questions.length !== 40) {
    throw new Error(`Expected 40 questions in Paper 1, found ${p1Questions.length}`);
  }

  const keyDist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  p1Questions.forEach((q, idx) => {
    if (!q.options || q.options.length !== 4) {
      throw new Error(`Question ${q.number} does not have exactly 4 options!`);
    }
    const optIdx = q.options.indexOf(q.correctAnswer);
    if (optIdx === -1) {
      throw new Error(`Question ${q.number} correctAnswer is not among options!`);
    }
    const letter = ['A', 'B', 'C', 'D'][optIdx];
    keyDist[letter]++;

    if (!q.hint || q.hint.trim().length < 5) {
      throw new Error(`Question ${q.number} is missing a valid hint!`);
    }
    if (!q.workedSolution || q.workedSolution.trim().length < 10) {
      throw new Error(`Question ${q.number} is missing a worked solution!`);
    }
  });

  console.log('Answer Key Distribution:', keyDist);
  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error(`Key distribution is not strictly 10 A, 10 B, 10 C, 10 D: ${JSON.stringify(keyDist)}`);
  }
  console.log('✅ Paper 1 Key distribution is perfectly balanced (10 A, 10 B, 10 C, 10 D)');

  // 2. Paper 2 checks
  console.log('\nChecking Paper 2:');
  const p2Questions = SET_BECE_2023_SCIENCE_P2.questions;
  console.log(`Total questions: ${p2Questions.length} (Expected: 6)`);
  if (p2Questions.length !== 6) {
    throw new Error(`Expected 6 questions in Paper 2, found ${p2Questions.length}`);
  }

  // Check Q1 (Practical Section A)
  const q1 = p2Questions[0];
  if (q1.questionNumber !== "1" || !q1.isPracticalSectionA) {
    throw new Error('Question 1 must be marked as isPracticalSectionA: true');
  }
  const q1Marks = q1.subQuestions.reduce((acc, sub) => acc + sub.maxMarks, 0);
  console.log(`Question 1 (Section A Practical) sub-questions: ${q1.subQuestions.length}, total marks: ${q1Marks} (Expected: 40)`);
  if (q1Marks !== 40) {
    throw new Error(`Question 1 must total 40 marks, got ${q1Marks}`);
  }

  // Check Q2-Q6 (Theory Section B)
  for (let i = 1; i < p2Questions.length; i++) {
    const q = p2Questions[i];
    const marks = q.subQuestions.reduce((acc, sub) => acc + sub.maxMarks, 0);
    console.log(`Question ${q.questionNumber} (Section B Theory) sub-questions: ${q.subQuestions.length}, total marks: ${marks} (Expected: 20)`);
    if (marks !== 20) {
      throw new Error(`Question ${q.questionNumber} must total 20 marks, got ${marks}`);
    }
  }

  // 3. Vector SVG presence checks
  console.log('\nChecking Reconstructed Vector SVGs:');
  const svgs = [
    { name: 'Human Reproductive Systems (IMG_2614.jpg)', match: 'I (Uterus)' },
    { name: 'Horticultural Farm Tools (IMG_2613.jpg)', match: 'A (Pickaxe / Mattock)' },
    { name: 'Forward-Biased Circuit with LED, Diode, Resistor', match: 'FORWARD BIASING: ANODES CONNECTED TOWARDS POSITIVE TERMINAL' }
  ];

  svgs.forEach(svg => {
    const foundInP2 = p2Questions.some(q => q.subQuestions.some(sub => sub.prompt.includes(svg.match)));
    if (!foundInP2) {
      throw new Error(`Missing SVG setup for: ${svg.name}`);
    }
    console.log(`✅ Reconstructed SVG verified: ${svg.name}`);
  });

  console.log('\n🎉 All Set 121 criteria successfully validated!');
}

verifySet121Local();
