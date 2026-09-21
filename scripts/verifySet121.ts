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

  // 3. Vector SVG presence and placement verification
  console.log('\nChecking Reconstructed Vector SVGs:');
  
  // Q1(a): in prompt, unlabelled
  const q1a = q1.subQuestions[0];
  if (!q1a.prompt.includes('Female System') || q1a.prompt.includes('I (Uterus)')) {
    throw new Error('Q1(a) prompt must include unlabelled reproductive systems diagram without spoiler text');
  }
  console.log('✅ Q1(a) Reproductive Systems diagram verified unlabelled in prompt.');

  // Q1(b): in prompt, unlabelled
  const q1b = q1.subQuestions[1];
  if (!q1b.prompt.includes('HORTICULTURAL FARM TOOLS') || q1b.prompt.includes('A (Pickaxe / Mattock)')) {
    throw new Error('Q1(b) prompt must include unlabelled farm tools diagram without spoiler text');
  }
  console.log('✅ Q1(b) Horticultural Farm Tools diagram verified unlabelled in prompt.');

  // Q1(c): NOT in prompt, IS in workedSolution
  const q1c = q1.subQuestions[2];
  if (q1c.prompt.includes('FORWARD BIASING') || q1c.prompt.includes('<svg')) {
    throw new Error('Q1(c) prompt must NOT show the drawn circuit diagram! The student must draw it.');
  }
  if (!q1c.workedSolution.includes('FORWARD BIASING') || !q1c.workedSolution.includes('<svg')) {
    throw new Error('Q1(c) workedSolution must contain the forward-biased circuit diagram schematic rubric.');
  }
  console.log('✅ Q1(c) Forward-biased circuit diagram verified absent from prompt and present in workedSolution!');

  console.log('\n🎉 All Set 121 criteria successfully validated!');
}

verifySet121Local();
