/**
 * Administrative Seeding Script for Global Shared Curriculum
 * Path: scripts/seedCurriculum.ts
 *
 * Uses Firebase Admin SDK with service credentials to bypass client security rules.
 * Writes exactly 1 document per question set to:
 * global_curriculum/${levelId}/subjects/${subjectId}/topics/${topicId}/question_sets/${setData.id}
 *
 * Run with:
 *   npx tsx scripts/seedCurriculum.ts
 */

import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, FieldValue, Firestore } from 'firebase-admin/firestore';
import type { CurriculumQuestionSet } from '../src/lib/global-curriculum-types';
import { SET_JHS_MASTERY_SERIES_03 } from '../src/lib/data/jhs-curriculum-sets';

dotenv.config();

import * as fs from 'fs';

// Check if credentials exist
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gamedu-69888475-f5783';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const fallbackKeyPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';

let adminApp: App | null = null;
let db: Firestore | null = null;

try {
  if (!getApps().length) {
    if (clientEmail && privateKey) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
      adminApp = initializeApp({
        credential: cert(serviceAccountPath)
      });
    } else if (fs.existsSync(fallbackKeyPath)) {
      adminApp = initializeApp({
        credential: cert(fallbackKeyPath)
      });
    } else {
      adminApp = initializeApp({ projectId });
    }
  } else {
    adminApp = getApps()[0];
  }
  db = getFirestore(adminApp);
} catch (e) {
  console.warn('⚠️  Could not initialize Firebase Admin credentials automatically:', e);
}

// ============================================================================
// 1. PRE-PACKAGED QUESTION SET 1: Lower Primary Math -> Visual Blocks & Addition
// ============================================================================
export const SET_LOWER_PRIMARY_MATH: CurriculumQuestionSet = {
  id: 'lp-math-vb-01',
  title: 'Visual Blocks & Foundational Addition',
  tier: 'Lower Primary (BS 1 - 3)',
  subject: 'Mathematics',
  topic: 'Visual Blocks & Addition',
  variantType: 'standard',
  totalQuestions: 10,
  version: 1,
  questions: [
    {
      id: 'lp-q1',
      prompt: 'You have 3 blue blocks and your friend gives you 4 green blocks. How many blocks do you have in total?',
      options: ['5 blocks', '6 blocks', '7 blocks', '8 blocks'],
      correctAnswer: '7 blocks',
      hint: 'Count forward starting from 3: 4, 5, 6, 7.',
      workedSolution: 'Start with 3 blue blocks. Add 4 green blocks: 3 + 4 = 7 blocks in total.',
      points: 10
    },
    {
      id: 'lp-q2',
      prompt: 'A building tower has 5 red blocks. Kofi adds 5 yellow blocks on top. What is the total height of the tower in blocks?',
      options: ['9 blocks', '10 blocks', '11 blocks', '12 blocks'],
      correctAnswer: '10 blocks',
      hint: 'Think of doubling 5: 5 + 5.',
      workedSolution: 'Add the two sets of blocks: 5 + 5 = 10 blocks.',
      points: 10
    },
    {
      id: 'lp-q3',
      prompt: 'Look at a Base-10 model (1 tens-rod = 10 unit cubes). If you have 1 tens-rod and 3 unit cubes, what number is represented?',
      options: ['11', '12', '13', '14'],
      correctAnswer: '13',
      hint: 'Count the rod as 10, then add the 3 single unit cubes: 10 + 3.',
      workedSolution: '1 tens-rod = 10. 3 unit cubes = 3. Total = 10 + 3 = 13.',
      points: 10
    },
    {
      id: 'lp-q4',
      prompt: 'Ama arranges 6 wooden cubes in a row. Kwame places 8 cubes next to hers. How many wooden cubes are there together?',
      options: ['12 cubes', '13 cubes', '14 cubes', '15 cubes'],
      correctAnswer: '14 cubes',
      hint: 'Make a ten first: 6 + 4 = 10, then add the remaining 4.',
      workedSolution: 'Combine the groups: 6 + 8 = (6 + 4) + 4 = 10 + 4 = 14 cubes.',
      points: 10
    },
    {
      id: 'lp-q5',
      prompt: 'Which addition sentence matches two rows of blocks: one row of 7 blocks and another row of 9 blocks?',
      options: ['7 + 9 = 15', '7 + 9 = 16', '7 + 8 = 16', '6 + 9 = 16'],
      correctAnswer: '7 + 9 = 16',
      hint: 'Take 1 block from 7 and give it to 9 to make 10: 6 + 10 = 16.',
      workedSolution: '7 + 9 = 6 + (1 + 9) = 6 + 10 = 16.',
      points: 10
    },
    {
      id: 'lp-q6',
      prompt: 'You have 2 tens-rods (each worth 10) and 4 unit cubes. What is the total number of blocks?',
      options: ['20', '22', '24', '26'],
      correctAnswer: '24',
      hint: 'Count by tens: 10, 20. Then count up 4 more.',
      workedSolution: '2 tens = 2 × 10 = 20. 4 units = 4. Total = 20 + 4 = 24.',
      points: 10
    },
    {
      id: 'lp-q7',
      prompt: 'A student built a castle using 8 blue blocks, 4 yellow blocks, and 2 orange blocks. How many blocks were used in all?',
      options: ['12 blocks', '13 blocks', '14 blocks', '16 blocks'],
      correctAnswer: '14 blocks',
      hint: 'Group compatible numbers first: 8 + 2 makes 10, then add 4.',
      workedSolution: '(8 + 2) + 4 = 10 + 4 = 14 blocks in total.',
      points: 10
    },
    {
      id: 'lp-q8',
      prompt: 'Find the missing number in the block puzzle: 9 + [ ? ] = 15 blocks.',
      options: ['4', '5', '6', '7'],
      correctAnswer: '6',
      hint: 'Subtract 9 from 15, or count up from 9 to 15.',
      workedSolution: '15 - 9 = 6. Verification: 9 + 6 = 15.',
      points: 10
    },
    {
      id: 'lp-q9',
      prompt: 'There are 12 blocks inside a basket. 5 more blocks are added to the basket. How many blocks are in the basket now?',
      options: ['15 blocks', '16 blocks', '17 blocks', '18 blocks'],
      correctAnswer: '17 blocks',
      hint: 'Add the units digits: 2 + 5 = 7, so 10 + 7 = 17.',
      workedSolution: '12 + 5 = 10 + (2 + 5) = 10 + 7 = 17 blocks.',
      points: 10
    },
    {
      id: 'lp-q10',
      prompt: 'If 3 tens-rods (each worth 10) are placed side by side with 0 unit cubes, what number is formed?',
      options: ['13', '30', '33', '300'],
      correctAnswer: '30',
      hint: 'Count three tens: 10, 20, 30.',
      workedSolution: '3 tens = 3 × 10 = 30.',
      points: 10
    }
  ]
};

// ============================================================================
// 2. PRE-PACKAGED QUESTION SET 2: Upper Primary Math -> Fractions & Decimals
// (10 original variations of standard past examination problems)
// ============================================================================
export const SET_UPPER_PRIMARY_MATH: CurriculumQuestionSet = {
  id: 'up-math-fd-01',
  title: 'Fractions & Decimals Mastery (Past Paper Variations)',
  tier: 'Upper Primary (BS 4 - 6)',
  subject: 'Mathematics',
  topic: 'Fractions & Decimals',
  variantType: 'past_paper_variant',
  totalQuestions: 10,
  version: 1,
  questions: [
    {
      id: 'up-q1',
      prompt: '[Past Exam Variant] Convert the common fraction 3/4 into its decimal equivalent.',
      options: ['0.34', '0.65', '0.75', '0.80'],
      correctAnswer: '0.75',
      hint: 'Divide the numerator 3 by the denominator 4, or think of three quarters of 1.00.',
      workedSolution: '3 ÷ 4 = 0.75. Alternatively, 3/4 = (3 × 25) / (4 × 25) = 75/100 = 0.75.',
      points: 10
    },
    {
      id: 'up-q2',
      prompt: '[Past Exam Variant] Simplify and calculate the sum: 2/5 + 1/3.',
      options: ['3/8', '7/15', '11/15', '13/15'],
      correctAnswer: '11/15',
      hint: 'Find the lowest common multiple (LCM) of 5 and 3, which is 15.',
      workedSolution: 'Convert to common denominator 15:\n2/5 = (2 × 3)/15 = 6/15\n1/3 = (1 × 5)/15 = 5/15\nSum = 6/15 + 5/15 = (6 + 5)/15 = 11/15.',
      points: 10
    },
    {
      id: 'up-q3',
      prompt: '[Past Exam Variant] Kofi has GH₵ 48.00. He spends 3/8 of this money on exercise books. How much did he spend on books?',
      options: ['GH₵ 12.00', 'GH₵ 16.00', 'GH₵ 18.00', 'GH₵ 24.00'],
      correctAnswer: 'GH₵ 18.00',
      hint: 'Find 1/8 of 48 first by dividing 48 by 8, then multiply by 3.',
      workedSolution: '1/8 of 48 = 48 ÷ 8 = 6. 3/8 of 48 = 3 × 6 = GH₵ 18.00.',
      points: 10
    },
    {
      id: 'up-q4',
      prompt: '[Past Exam Variant] Evaluate the following decimal expression: 4.65 + 7.8 - 3.25.',
      options: ['8.20', '9.10', '9.20', '10.20'],
      correctAnswer: '9.20',
      hint: 'Add 4.65 and 7.80 first (12.45), then subtract 3.25.',
      workedSolution: 'Step 1: 4.65 + 7.80 = 12.45.\nStep 2: 12.45 - 3.25 = 9.20.',
      points: 10
    },
    {
      id: 'up-q5',
      prompt: '[Past Exam Variant] Which of the following fractions has the greatest value: 2/3, 5/6, 3/4, or 7/12?',
      options: ['2/3', '5/6', '3/4', '7/12'],
      correctAnswer: '5/6',
      hint: 'Express all four fractions with the common denominator 12.',
      workedSolution: 'Express with denominator 12:\n2/3 = 8/12\n5/6 = 10/12\n3/4 = 9/12\n7/12 = 7/12\nComparing numerators: 10 is greatest, so 5/6 is the largest fraction.',
      points: 10
    },
    {
      id: 'up-q6',
      prompt: '[Past Exam Variant] Convert 2 3/5 into an improper fraction, then write it as a decimal.',
      options: ['11/5 and 2.3', '13/5 and 2.6', '13/5 and 2.5', '15/5 and 3.0'],
      correctAnswer: '13/5 and 2.6',
      hint: 'Improper fraction = (whole × denominator + numerator) / denominator. 3/5 = 0.6.',
      workedSolution: 'Improper fraction: (2 × 5 + 3)/5 = 13/5.\nDecimal: 2 + (3 ÷ 5) = 2 + 0.6 = 2.6.',
      points: 10
    },
    {
      id: 'up-q7',
      prompt: '[Past Exam Variant] Evaluate: 3/4 ÷ 2/5.',
      options: ['6/20', '3/10', '15/8', '8/15'],
      correctAnswer: '15/8',
      hint: 'Invert the divisor and multiply: 3/4 × 5/2.',
      workedSolution: '3/4 ÷ 2/5 = 3/4 × 5/2 = (3 × 5) / (4 × 2) = 15/8 (or 1 7/8).',
      points: 10
    },
    {
      id: 'up-q8',
      prompt: '[Past Exam Variant] A carpenter cuts a piece of timber of length 3.75 metres from a plank that is 10.5 metres long. What is the length of the remaining plank?',
      options: ['6.25 m', '6.75 m', '7.25 m', '7.75 m'],
      correctAnswer: '6.75 m',
      hint: 'Line up decimal points: 10.50 - 3.75.',
      workedSolution: '10.50 - 3.75 = 6.75 metres.',
      points: 10
    },
    {
      id: 'up-q9',
      prompt: '[Past Exam Variant] Express 45% as a common fraction in its lowest terms.',
      options: ['9/20', '45/100', '4/9', '9/25'],
      correctAnswer: '9/20',
      hint: 'Write 45/100 and divide both terms by their greatest common divisor, 5.',
      workedSolution: '45% = 45/100. Divide numerator and denominator by 5: (45 ÷ 5) / (100 ÷ 5) = 9/20.',
      points: 10
    },
    {
      id: 'up-q10',
      prompt: '[Past Exam Variant] In a primary school class of 40 pupils, 0.6 walk to school, 1/4 commute by bus, and the rest ride bicycles. How many pupils ride bicycles?',
      options: ['4 pupils', '6 pupils', '8 pupils', '10 pupils'],
      correctAnswer: '6 pupils',
      hint: 'Calculate pupils walking (0.6 × 40) and bus commuters (1/4 × 40), then subtract the total from 40.',
      workedSolution: 'Pupils walking: 0.6 × 40 = 24 pupils.\nPupils by bus: 1/4 × 40 = 10 pupils.\nSubtotal = 24 + 10 = 34 pupils.\nPupils riding bicycles = 40 - 34 = 6 pupils.',
      points: 10
    }
  ]
};

// ============================================================================
// 3. PRE-PACKAGED QUESTION SET 3: JHS Math -> Mock 2012 Paper 1 (40 Questions)
// ============================================================================
export const SET_JHS_MOCK_2012_MATH: CurriculumQuestionSet = {
  id: "jhs-math-2012-paper1",
  title: "BECE 2012 Mathematics Paper 1 (Exam Variant Mastery)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2012 Paper 1",
  variantType: "past_paper_variant",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
      id: "q01",
      prompt: "If set A = {3, 5, 7, 11} and set B = {3, 6, 9, 12}, find A ∩ B.",
      options: ["{3}", "{5}", "{7}", "{9}"],
      correctAnswer: "{3}",
      hint: "Find the element common to both sets.",
      workedSolution: "A ∩ B represents elements present in both set A and set B. The only common number is 3. Hence, A ∩ B = {3}.",
      points: 1
    },
    {
      id: "q02",
      prompt: "Which of the following numbers is an integer?",
      options: ["-7/3", "-0.45", "-8", "3/4"],
      correctAnswer: "-8",
      hint: "Integers are positive and negative whole numbers including zero, without fractional parts.",
      workedSolution: "-7/3 and 3/4 are fractions, and -0.45 is a decimal. -8 is a negative whole number, which is an integer.",
      points: 1
    },
    {
      id: "q03",
      prompt: "Find the Lowest Common Multiple (LCM) of 2³ × 3 × 5 and 2² × 3² × 5².",
      options: ["2² × 3 × 5", "2³ × 3² × 5²", "2³ × 3 × 5", "2⁵ × 3³ × 5³"],
      correctAnswer: "2³ × 3² × 5²",
      hint: "Take the highest power of each unique prime factor present.",
      workedSolution: "For 2, the highest power is 2³. For 3, the highest power is 3². For 5, the highest power is 5². The LCM is 2³ × 3² × 5².",
      points: 1
    },
    {
      id: "q04",
      prompt: "How many diagonals can be drawn inside a regular quadrilateral (such as a square or rectangle)?",
      options: ["1", "2", "3", "4"],
      correctAnswer: "2",
      hint: "Count the lines connecting non-adjacent opposite vertices.",
      workedSolution: "A quadrilateral has 4 vertices. A diagonal connects opposite corners. There are exactly 2 diagonals in any quadrilateral.",
      points: 1
    },
    {
      id: "q05",
      prompt: "Simplify: -3(4 - 7) + 12 - 2(5 + 3) + 25.",
      options: ["10", "20", "30", "40"],
      correctAnswer: "30",
      hint: "Evaluate the terms inside parentheses first, then apply multiplication before adding/subtracting.",
      workedSolution: "-3(-3) + 12 - 2(8) + 25 = 9 + 12 - 16 + 25 = 21 - 16 + 25 = 5 + 25 = 30.",
      points: 1
    },
    {
      id: "q06",
      prompt: "A timber plank 18 m long is sawed into 15 equal lengths. What is the length of each piece?",
      options: ["1.15 m", "1.20 m", "1.25 m", "1.50 m"],
      correctAnswer: "1.20 m",
      hint: "Divide the total length by the number of parts.",
      workedSolution: "18 ÷ 15 = 6/5 = 1.20 m.",
      points: 1
    },
    {
      id: "q07",
      prompt: "Convert 53 to a base two (binary) numeral.",
      options: ["110101_two", "110111_two", "101101_two", "111001_two"],
      correctAnswer: "110101_two",
      hint: "Divide repeatedly by 2 and record the remainders from bottom to top.",
      workedSolution: "53 ÷ 2 = 26 R1; 26 ÷ 2 = 13 R0; 13 ÷ 2 = 6 R1; 6 ÷ 2 = 3 R0; 3 ÷ 2 = 1 R1; 1 ÷ 2 = 0 R1. Reading remainders bottom-up gives 110101_two.",
      points: 1
    },
    {
      id: "q08",
      prompt: "Simplify: (7⁸ × 7⁵) / 7³.",
      options: ["7⁸", "7⁹", "7¹⁰", "7¹³"],
      correctAnswer: "7¹⁰",
      hint: "Apply indices product and quotient laws: aᵐ × aⁿ = aᵐ⁺ⁿ and aᵐ / aⁿ = aᵐ⁻ⁿ.",
      workedSolution: "7⁸ × 7⁵ = 7⁸⁺⁵ = 7¹³. Then 7¹³ / 7³ = 7¹³⁻³ = 7¹⁰.",
      points: 1
    },
    {
      id: "q09",
      prompt: "A water reservoir contains 600 litres of water. If 150 litres is pumped out for irrigation, what percentage remains in the reservoir?",
      options: ["25%", "50%", "70%", "75%"],
      correctAnswer: "75%",
      hint: "Find the remaining volume first, then express it over the total.",
      workedSolution: "Water remaining = 600 - 150 = 450 litres. Percentage remaining = (450 / 600) × 100% = 3/4 × 100% = 75%.",
      points: 1
    },
    {
      id: "q10",
      prompt: "In a right-angled triangle XYZ with right angle at Y, XY = 6 cm and YZ = 8 cm. What is the length of hypotenuse XZ?",
      options: ["9 cm", "10 cm", "12 cm", "14 cm"],
      correctAnswer: "10 cm",
      hint: "Apply Pythagoras' theorem: XZ² = XY² + YZ².",
      workedSolution: "XZ² = 6² + 8² = 36 + 64 = 100. XZ = √100 = 10 cm.",
      points: 1
    },
    {
      id: "q11",
      prompt: "Arrange the following fractions in descending order of magnitude: 3/4, 4/5, 1/2, 2/3.",
      options: ["4/5, 3/4, 2/3, 1/2", "3/4, 4/5, 2/3, 1/2", "1/2, 2/3, 3/4, 4/5", "4/5, 2/3, 3/4, 1/2"],
      correctAnswer: "4/5, 3/4, 2/3, 1/2",
      hint: "Convert to decimals or use common denominator 60: 4/5=0.80, 3/4=0.75, 2/3≈0.67, 1/2=0.50.",
      workedSolution: "In decimal form: 4/5 = 0.80, 3/4 = 0.75, 2/3 ≈ 0.667, 1/2 = 0.50. Arranging from greatest to least: 4/5, 3/4, 2/3, 1/2.",
      points: 1
    },
    {
      id: "q12",
      prompt: "Find the image of 4 under the mapping x → 15 - 3x.",
      options: ["1", "3", "7", "12"],
      correctAnswer: "3",
      hint: "Substitute x = 4 into the expression 15 - 3x.",
      workedSolution: "Image = 15 - 3(4) = 15 - 12 = 3.",
      points: 1
    },
    {
      id: "q13",
      prompt: "Simplify: 1/2 + 1/4 + 1/8.",
      options: ["3/8", "5/8", "7/8", "9/8"],
      correctAnswer: "7/8",
      hint: "Use the common denominator 8.",
      workedSolution: "1/2 = 4/8, 1/4 = 2/8. Adding gives: 4/8 + 2/8 + 1/8 = 7/8.",
      points: 1
    },
    {
      id: "q14",
      prompt: "If 3x = 4(x - 3) + 17, find the value of x.",
      options: ["-5", "-1", "1", "5"],
      correctAnswer: "-5",
      hint: "Expand the right side and group like terms: 3x = 4x - 12 + 17.",
      workedSolution: "3x = 4x - 12 + 17 => 3x = 4x + 5 => 3x - 4x = 5 => -x = 5 => x = -5.",
      points: 1
    },
    {
      id: "q15",
      prompt: "The daytime temperatures (°C) of a town from Monday to Friday are 31, 33, 29, 35, and 32. Find the average daytime temperature for the 5 days.",
      options: ["31.0°C", "32.0°C", "32.4°C", "33.0°C"],
      correctAnswer: "32.0°C",
      hint: "Sum all temperatures and divide by 5.",
      workedSolution: "Sum = 31 + 33 + 29 + 35 + 32 = 160. Mean = 160 ÷ 5 = 32.0°C.",
      points: 1
    },
    {
      id: "q16",
      prompt: "A bowl contains 40 markers: 25 are black and the rest are red. If a marker is picked at random, what is the probability of selecting a red marker?",
      options: ["3/8", "5/8", "1/4", "3/5"],
      correctAnswer: "3/8",
      hint: "Find the number of red markers, then divide by 40.",
      workedSolution: "Number of red markers = 40 - 25 = 15. Probability = 15/40 = 3/8.",
      points: 1
    },
    {
      id: "q17",
      prompt: "Find the truth set of: 1/3(x + 4) ≤ x - 2.",
      options: ["{x : x ≤ 2}", "{x : x ≥ 3}", "{x : x ≥ 5}", "{x : x ≤ 5}"],
      correctAnswer: "{x : x ≥ 5}",
      hint: "Multiply both sides by 3 to clear the fraction.",
      workedSolution: "x + 4 ≤ 3(x - 2) => x + 4 ≤ 3x - 6 => 4 + 6 ≤ 3x - x => 10 ≤ 2x => 5 ≤ x (or x ≥ 5).",
      points: 1
    },
    {
      id: "q18",
      prompt: "The perimeter of a shape consisting of a 3-sided rectangle base and a semicircular top is 54 cm. The base width is 14 cm and each vertical side is 13 cm. What is the diameter of the semicircular arc?",
      options: ["7 cm", "14 cm", "21 cm", "28 cm"],
      correctAnswer: "14 cm",
      hint: "The diameter of the semicircular portion matches the width of the rectangle base.",
      workedSolution: "The semi-circular top rests directly across the width of 14 cm, making the diameter equal to 14 cm.",
      points: 1
    },
    {
      id: "q19",
      prompt: "Simplify: (2x / 3) - ((x - 2y) / 4).",
      options: ["(5x + 6y) / 12", "(5x - 6y) / 12", "(7x + 6y) / 12", "(x + 2y) / 12"],
      correctAnswer: "(5x + 6y) / 12",
      hint: "Find the LCM of 3 and 4, which is 12, and distribute the negative sign carefully.",
      workedSolution: "LCM = 12. [4(2x) - 3(x - 2y)] / 12 = [8x - 3x + 6y] / 12 = (5x + 6y) / 12.",
      points: 1
    },
    {
      id: "q20",
      prompt: "Kwabena is 25% heavier than Akosua. If Kwabena weighs 75 kg, what is Akosua's weight?",
      options: ["50 kg", "55 kg", "60 kg", "65 kg"],
      correctAnswer: "60 kg",
      hint: "Kwabena's weight = 125% of Akosua's weight.",
      workedSolution: "Let Akosua's weight be W. 1.25 × W = 75 => W = 75 / 1.25 = 60 kg.",
      points: 1
    },
    {
      id: "q21",
      prompt: "Calculate the volume of a solid cylinder of radius 3 cm and height 7 cm. (Take π = 22/7).",
      options: ["66 cm³", "132 cm³", "198 cm³", "264 cm³"],
      correctAnswer: "198 cm³",
      hint: "Volume = πr²h.",
      workedSolution: "Volume = (22/7) × 3² × 7 = (22/7) × 9 × 7 = 22 × 9 = 198 cm³.",
      points: 1
    },
    {
      id: "q22",
      prompt: "Given the points P(2, -3) and Q(6, 5), calculate the gradient (slope) of the line PQ.",
      options: ["1/2", "1", "2", "4"],
      correctAnswer: "2",
      hint: "Gradient m = (y₂ - y₁) / (x₂ - x₁).",
      workedSolution: "m = (5 - (-3)) / (6 - 2) = (5 + 3) / 4 = 8 / 4 = 2.",
      points: 1
    },
    {
      id: "q23",
      prompt: "A trader invested GH¢ 80,000 at 5% simple interest per annum. How many years will it take to earn an interest of GH¢ 16,000?",
      options: ["2 years", "3 years", "4 years", "5 years"],
      correctAnswer: "4 years",
      hint: "Time T = (100 × I) / (P × R).",
      workedSolution: "T = (100 × 16000) / (80000 × 5) = 1600000 / 400000 = 4 years.",
      points: 1
    },
    {
      id: "q24",
      prompt: "Express 4.625 as a mixed fraction in its lowest terms.",
      options: ["4 1/8", "4 3/8", "4 5/8", "4 7/8"],
      correctAnswer: "4 5/8",
      hint: "Convert 0.625 into 625/1000 and divide numerator and denominator by 125.",
      workedSolution: "0.625 = 625/1000 = 5/8. So 4.625 = 4 5/8.",
      points: 1
    },
    {
      id: "q25",
      prompt: "A town map has a scale of 1:50,000. What actual ground distance in kilometres is represented by 8 cm on the map?",
      options: ["2 km", "4 km", "8 km", "40 km"],
      correctAnswer: "4 km",
      hint: "1 km = 100,000 cm. Multiply map distance by scale, then convert cm to km.",
      workedSolution: "Actual distance = 8 cm × 50,000 = 400,000 cm. 400,000 ÷ 100,000 = 4 km.",
      points: 1
    },
    {
      id: "q26",
      prompt: "Given vectors u = (-2, 5)ᵀ and v = (3, -2)ᵀ, calculate u - 2v.",
      options: ["(-8, 9)ᵀ", "(-8, 1)ᵀ", "(4, 9)ᵀ", "(-5, 7)ᵀ"],
      correctAnswer: "(-8, 9)ᵀ",
      hint: "Subtract 2 times each component of v from u.",
      workedSolution: "x-component: -2 - 2(3) = -2 - 6 = -8. y-component: 5 - 2(-2) = 5 + 4 = 9. Vector = (-8, 9)ᵀ.",
      points: 1
    },
    {
      id: "q27",
      prompt: "A baker bought 600 g of butter, 750 g of flour, and 1,150 g of sugar. What is the total mass of the items in kilograms?",
      options: ["2.40 kg", "2.50 kg", "2.60 kg", "25.0 kg"],
      correctAnswer: "2.50 kg",
      hint: "Add the masses in grams and divide by 1,000.",
      workedSolution: "600 + 750 + 1150 = 2,500 g. 2,500 g ÷ 1000 = 2.50 kg.",
      points: 1
    },
    {
      id: "q28",
      prompt: "A wall clock gains 2 minutes every hour. How many total minutes will it gain from 6:00 AM to 6:00 PM on the same day?",
      options: ["12 minutes", "18 minutes", "24 minutes", "36 minutes"],
      correctAnswer: "24 minutes",
      hint: "Find the total elapsed hours between 6 AM and 6 PM.",
      workedSolution: "From 6:00 AM to 6:00 PM is 12 hours. 12 hours × 2 min/hour = 24 minutes.",
      points: 1
    },
    {
      id: "q29",
      prompt: "A digital printing press prints 450 booklets in 3 hours. How many booklets will it produce in 7 hours working at the same speed?",
      options: ["900 booklets", "1,050 booklets", "1,200 booklets", "1,350 booklets"],
      correctAnswer: "1,050 booklets",
      hint: "Find the rate per hour first.",
      workedSolution: "Rate = 450 ÷ 3 = 150 booklets/hour. In 7 hours = 150 × 7 = 1,050 booklets.",
      points: 1
    },
    {
      id: "q30",
      prompt: "The three-figure bearing of Town A from Town B is 250°. What is the back bearing of Town B from Town A?",
      options: ["050°", "070°", "110°", "160°"],
      correctAnswer: "070°",
      hint: "Since the bearing is greater than 180°, subtract 180°.",
      workedSolution: "Back bearing = 250° - 180° = 070°.",
      points: 1
    },
    {
      id: "q31",
      prompt: "In a class of 35 students, 18 study Computing only and 10 study French only. If every student studies at least one of the two subjects, how many students study French altogether?",
      options: ["7", "10", "17", "25"],
      correctAnswer: "17",
      hint: "Find the intersection first: total - (Computing only + French only).",
      workedSolution: "Both subjects = 35 - (18 + 10) = 35 - 28 = 7. Total French students = French only + Both = 10 + 7 = 17.",
      points: 1
    },
    {
      id: "q32",
      prompt: "Convert 94 to a base five numeral.",
      options: ["324_five", "334_five", "414_five", "424_five"],
      correctAnswer: "334_five",
      hint: "Divide repeatedly by 5 and write remainders bottom-up.",
      workedSolution: "94 ÷ 5 = 18 R4; 18 ÷ 5 = 3 R3; 3 ÷ 5 = 0 R3. Reading remainders bottom-up: 334_five.",
      points: 1
    },
    {
      id: "q33",
      prompt: "Triangle P₁Q₁R₁ is an enlargement of triangle PQR. If corresponding side PQ = 5 cm and P₁Q₁ = 15 cm, determine the scale factor of enlargement.",
      options: ["0.33", "2.00", "3.00", "5.00"],
      correctAnswer: "3.00",
      hint: "Scale factor = length of image side ÷ length of object side.",
      workedSolution: "Scale factor = 15 cm ÷ 5 cm = 3.00.",
      points: 1
    },
    {
      id: "q34",
      prompt: "Find the smallest whole number that must be added to 412 to make it exactly divisible by 17.",
      options: ["4", "9", "13", "15"],
      correctAnswer: "13",
      hint: "Find the remainder when 412 is divided by 17, then subtract from 17.",
      workedSolution: "412 ÷ 17 = 24 with remainder 4 (since 24 × 17 = 408). The next multiple is 25 × 17 = 425. Number to add = 425 - 412 = 13.",
      points: 1
    },
    {
      id: "q35",
      prompt: "In an academy of 780 students, the number of boys exceeds the number of girls by 120. How many boys are in the academy?",
      options: ["330", "420", "450", "480"],
      correctAnswer: "450",
      hint: "Let girls be g, then boys = g + 120. Their sum is 780.",
      workedSolution: "g + (g + 120) = 780 => 2g + 120 = 780 => 2g = 660 => g = 330 girls. Boys = 330 + 120 = 450.",
      points: 1
    },
    {
      id: "q36",
      prompt: "Which of the following fractions is equivalent to 4/7?",
      options: ["12/28", "16/28", "20/32", "24/49"],
      correctAnswer: "16/28",
      hint: "Multiply both numerator and denominator by 4.",
      workedSolution: "(4 × 4) / (7 × 4) = 16/28.",
      points: 1
    },
    {
      id: "q37",
      prompt: "Two parallel lines are crossed by a transversal line. If an interior angle on one side is 48°, find the size of the adjacent obtuse angle on the straight line.",
      options: ["42°", "132°", "138°", "148°"],
      correctAnswer: "132°",
      hint: "Angles on a straight line add up to 180°.",
      workedSolution: "180° - 48° = 132°.",
      points: 1
    },
    {
      id: "q38",
      prompt: "When a transversal intersects two parallel lines, alternate interior angles are:",
      options: ["Supplementary", "Complementary", "Equal", "Add up to 360°"],
      correctAnswer: "Equal",
      hint: "Remember the 'Z' angle rule in geometry.",
      workedSolution: "Alternate interior angles formed by a transversal intersecting parallel lines are always equal in magnitude.",
      points: 1
    },
    {
      id: "q39",
      prompt: "Expand and simplify: -2y(4 - 3y).",
      options: ["-8y - 6y²", "6y² - 8y", "-6y² + 8y", "6y² + 8y"],
      correctAnswer: "6y² - 8y",
      hint: "Multiply each term inside brackets by -2y. Note that (-2y) × (-3y) = +6y².",
      workedSolution: "-2y(4) + (-2y)(-3y) = -8y + 6y² = 6y² - 8y.",
      points: 1
    },
    {
      id: "q40",
      prompt: "Express 48 as a product of its prime factors in index notation.",
      options: ["2³ × 6", "2⁴ × 3", "2² × 3²", "3 × 16"],
      correctAnswer: "2⁴ × 3",
      hint: "Divide 48 by prime numbers: 48 = 16 × 3 = 2⁴ × 3.",
      workedSolution: "48 ÷ 2 = 24; 24 ÷ 2 = 12; 12 ÷ 2 = 6; 6 ÷ 2 = 3; 3 ÷ 3 = 1. Prime factors = 2 × 2 × 2 × 2 × 3 = 2⁴ × 3.",
      points: 1
    }
  ]
};

// ============================================================================
// 3b. ALIGNED CORE CURRICULUM SERIES: JHS Math Paper 1 (Objective)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-01
// ============================================================================
export const SET_JHS_MASTERY_SERIES_01: CurriculumQuestionSet = {
  ...SET_JHS_MOCK_2012_MATH,
  id: "jhs-math-mastery-series-01",
  title: "Junior Core Mathematics • Objective Mastery Series (Paper 1)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Objective Examination & Foundational Mastery",
  variantType: "past_paper_variant"
};

// ============================================================================
// 3c. ALIGNED CORE CURRICULUM SERIES: JHS Math Paper 2 (Structured & Essay)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-02
// ============================================================================
export const SET_JHS_MASTERY_SERIES_02: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-02",
  title: "Junior Core Mathematics • Mastery & Problem-Solving Series (Paper 2)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Problem Solving & Mathematical Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
      id: "q01",
      title: "Question 1: Computation, Proportional Sharing & Angle Geometry",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts of this question:\n(a) Evaluate $\\frac{0.048 \\times 1.05}{0.00012}$, leaving your final answer in standard form.\n(b) An amount of GH¢ 5,400.00 was shared between Esi and Kwesi. If Esi received $\\frac{4}{9}$ of the total amount, find Kwesi's share and what percentage of Esi's share Kwesi received.\n(c) Three angles meet at a common vertex point $O$ on a plane: $(3x - 10)^\\circ$, $(2x + 40)^\\circ$, and $(x + 30)^\\circ$. Calculate the value of $x$.",
      hint: "Review decimal simplification using powers of 10, fractional sharing of quantities, and the sum of angles meeting at a point.",
      workedSolution: "See the detailed step-by-step worked marking scheme and derivations for each sub-question below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "Evaluate $$\\frac{0.048 \\times 1.05}{0.00012}$$, leaving your final answer in standard form.",
          hint: "Convert decimals to whole numbers by multiplying numerator and denominator by $10^5$, or convert each decimal into a common fraction before simplifying.",
          modelAnswer: "$4.2 \\times 10^2$",
          workedSolution: "**Method 1: Whole Number Conversion**\n$$\\frac{0.048 \\times 1.05}{0.00012} = \\frac{0.0504}{0.00012}$$\nMultiply both numerator and denominator by $100,000$ to clear the decimals:\n$$= \\frac{0.0504 \\times 100,000}{0.00012 \\times 100,000} = \\frac{5,040}{12}$$\n$$= 420$$\nExpressing in standard form ($A \\times 10^n$ where $1 \\le A < 10$):\n$$420 = 4.2 \\times 10^2$$\n\n*(Award full marks for showing whole number conversion, intermediate simplification of 420, and the correct standard form exponent).*"
        },
        {
          partLabel: "(b)(i)",
          marks: 4,
          prompt: "An amount of GH¢ 5,400.00 was shared between Esi and Kwesi. If Esi received $\\frac{4}{9}$ of the total amount, how much did Kwesi receive?",
          hint: "Kwesi's fraction of the total is $1 - \\frac{4}{9} = \\frac{5}{9}$, or compute Esi's share in cedis first and subtract it from GH¢ 5,400.00.",
          modelAnswer: "GH¢ 3,000.00",
          workedSolution: "**Step 1: Compute Esi's share**\n$$\\text{Esi's share} = \\frac{4}{9} \\times \\text{GH¢ } 5,400.00 = 4 \\times \\text{GH¢ } 600.00 = \\text{GH¢ } 2,400.00$$\n\n**Step 2: Calculate Kwesi's share**\n$$\\text{Kwesi's share} = \\text{GH¢ } 5,400.00 - \\text{GH¢ } 2,400.00 = \\text{GH¢ } 3,000.00$$\n\n*(Alternatively: Kwesi's fraction = $1 - \\frac{4}{9} = \\frac{5}{9}$. Then $\\frac{5}{9} \\times 5,400 = 5 \\times 600 = \\text{GH¢ } 3,000.00$)*."
        },
        {
          partLabel: "(b)(ii)",
          marks: 3,
          prompt: "What percentage of Esi's share did Kwesi receive?",
          hint: "Express Kwesi's share as a fraction of Esi's share, then multiply by $100\\%$.",
          modelAnswer: "125%",
          workedSolution: "$$\\text{Percentage} = \\left(\\frac{\\text{Kwesi's share}}{\\text{Esi's share}}\\right) \\times 100\\%$$\n$$= \\left(\\frac{3,000}{2,400}\\right) \\times 100\\% = \\left(\\frac{5}{4}\\right) \\times 100\\% = 125\\%$$\nKwesi received $125\\%$ of Esi's share."
        },
        {
          partLabel: "(c)",
          marks: 3,
          prompt: "Three angles meet at a common vertex point $O$ on a plane: $(3x - 10)^\\circ$, $(2x + 40)^\\circ$, and $(x + 30)^\\circ$. Calculate the value of $x$.",
          hint: "The sum of all adjacent angles meeting at a point in a complete revolution is equal to $360^\\circ$.",
          modelAnswer: "x = 50°",
          workedSolution: "Sum of angles at a point = $360^\\circ$:\n$$(3x - 10)^\\circ + (2x + 40)^\\circ + (x + 30)^\\circ = 360^\\circ$$\nCombine like terms:\n$$(3x + 2x + x) + (-10 + 40 + 30) = 360$$\n$$6x + 60 = 360$$\n$$6x = 360 - 60$$\n$$6x = 300$$\n$$x = \\frac{300}{6} = 50^\\circ$$\nTherefore, $x = 50$."
        }
      ]
    },
    {
      id: "q02",
      prompt: "Answer all parts of this question:\n(a) A commercial delivery van uses 1 litre of diesel for every 25 km travelled. A courier begins a 450 km journey with 11 litres of fuel already in the tank.\n   (i) How many additional litres of fuel are needed to complete the trip?\n   (ii) If diesel costs GH¢ 12.00 per litre, calculate the total cost of fuel used for the 450 km journey.\n(b) The average daily attendance at a regional conference for the first four days was 1,250 delegates. On the fifth day, 1,650 delegates attended. Calculate:\n   (i) The total attendance for the first 4 days.\n   (ii) The mean daily attendance across the 5 days.\n(c) The area of a square playground is 169 m². Determine the total perimeter (distance around) the playground.",
      options: [
        "(a)(i) 7 litres, (ii) GH¢ 216.00 | (b)(i) 5,000, (ii) 1,330 | (c) 52 m",
        "(a)(i) 8 litres, (ii) GH¢ 220.00 | (b)(i) 5,000, (ii) 1,350 | (c) 48 m",
        "(a)(i) 7 litres, (ii) GH¢ 216.00 | (b)(i) 4,800, (ii) 1,290 | (c) 56 m",
        "(a)(i) 6 litres, (ii) GH¢ 204.00 | (b)(i) 5,000, (ii) 1,330 | (c) 52 m"
      ],
      correctAnswer: "(a)(i) 7 litres, (ii) GH¢ 216.00 | (b)(i) 5,000, (ii) 1,330 | (c) 52 m",
      hint: "Divide total distance by fuel efficiency to find total litres needed. For attendance, total = average × number of days. For the square, find the side length as the square root of 169 m².",
      workedSolution: "(a)(i) Total fuel required = 450 km ÷ 25 km/litre = 18 litres. Additional fuel needed = 18 - 11 = 7 litres.\n(a)(ii) Cost of fuel = 18 litres × GH¢ 12.00 = GH¢ 216.00.\n(b)(i) Total attendance for 4 days = 4 × 1,250 = 5,000 delegates.\n(b)(ii) Total attendance for 5 days = 5,000 + 1,650 = 6,650. Mean = 6,650 ÷ 5 = 1,330 delegates.\n(c) Side length s = √169 = 13 m. Perimeter = 4s = 4 × 13 m = 52 m.",
      points: 15
    },
    {
      id: "q03",
      prompt: "Answer all parts of this question:\n(a) A survey of 120 senior high school students shows their preferred elective subjects: General Arts (36), Visual Arts (24), Business (30), and Science (30).\n   (i) Calculate the sector angle for General Arts and Visual Arts in a pie chart.\n   (ii) If a student is picked at random, what is the probability that they prefer Visual Arts?\n(b) A market vendor purchased 180 grapefruits for GH¢ 30.00. She packed and sold them in groups of 3 for 80 Pesewas (GH¢ 0.80).\n   (i) Calculate the total selling price of all the grapefruits.\n   (ii) Determine the percentage profit made by the vendor.",
      options: [
        "(a)(i) 108° & 72°, (ii) 1/5 | (b)(i) GH¢ 48.00, (ii) 60%",
        "(a)(i) 90° & 60°, (ii) 1/4 | (b)(i) GH¢ 45.00, (ii) 50%",
        "(a)(i) 108° & 72°, (ii) 1/6 | (b)(i) GH¢ 42.00, (ii) 40%",
        "(a)(i) 120° & 80°, (ii) 1/5 | (b)(i) GH¢ 48.00, (ii) 60%"
      ],
      correctAnswer: "(a)(i) 108° & 72°, (ii) 1/5 | (b)(i) GH¢ 48.00, (ii) 60%",
      hint: "Angle = (frequency / total) × 360°. For the fruit, find how many groups of 3 are in 180, then multiply by GH¢ 0.80.",
      workedSolution: "(a)(i) General Arts angle = (36/120) × 360° = 108°. Visual Arts angle = (24/120) × 360° = 72°.\n(a)(ii) Probability = 24 / 120 = 1/5.\n(b)(i) Number of groups of 3 = 180 ÷ 3 = 60 groups. Total Selling Price = 60 × GH¢ 0.80 = GH¢ 48.00.\n(b)(ii) Profit = Total SP - Total CP = 48.00 - 30.00 = GH¢ 18.00. Percentage profit = (18 / 30) × 100% = 60%.",
      points: 15
    },
    {
      id: "q04",
      prompt: "The test scores of 25 students in an ICT quiz are recorded as follows:\n5, 7, 4, 6, 5, 8, 7, 5, 6, 5, 7, 4, 8, 5, 6, 7, 5, 6, 4, 7, 5, 8, 6, 7, 5.\n(a) Construct a frequency table and determine the modal score.\n(b) Calculate the mean mark for the distribution.\n(c) Find the median score of the class.",
      options: [
        "(a) Mode = 5 (Frequency 8) | (b) Mean = 5.92 | (c) Median = 6",
        "(a) Mode = 6 (Frequency 8) | (b) Mean = 5.80 | (c) Median = 5",
        "(a) Mode = 5 (Frequency 8) | (b) Mean = 6.10 | (c) Median = 6",
        "(a) Mode = 7 (Frequency 6) | (b) Mean = 5.92 | (c) Median = 7"
      ],
      correctAnswer: "(a) Mode = 5 (Frequency 8) | (b) Mean = 5.92 | (c) Median = 6",
      hint: "Tally frequencies for each score: 4 (3), 5 (8), 6 (5), 7 (6), 8 (3). Mean = Σfx / N. Find the 13th score for the median.",
      workedSolution: "Frequency distribution: Score 4 occurs 3 times; Score 5 occurs 8 times; Score 6 occurs 5 times; Score 7 occurs 6 times; Score 8 occurs 3 times. Total students N = 25.\n(a) The modal score is 5 with the highest frequency of 8.\n(b) Sum Σfx = (4×3) + (5×8) + (6×5) + (7×6) + (8×3) = 12 + 40 + 30 + 42 + 24 = 148. Mean = 148 ÷ 25 = 5.92.\n(c) Median position = (25 + 1) / 2 = 13th term. Cumulative frequencies: Score 4 (3), Score 5 (11), Score 6 (16). Since the 13th term lies in the Score 6 category, Median = 6.",
      points: 15
    },
    {
      id: "q05",
      prompt: "Answer all parts of this question:\n(a) (i) Find the Least Common Multiple (LCM) of 8, 12, and 20.\n   (ii) Arrange the fractions 5/8, 7/12, and 11/20 in ascending order of magnitude.\n(b) In a geometric construction of triangle ABC, |AB| = 9 cm, angle CAB = 60°, and angle CBA = 45°. Perpendicular bisectors of AC and BC intersect at point O. If O is the circumcentre, state the geometric relationship between OA, OB, and OC.",
      options: [
        "(a)(i) 120, (ii) 11/20, 7/12, 5/8 | (b) OA = OB = OC (Equidistant circumradius)",
        "(a)(i) 240, (ii) 7/12, 11/20, 5/8 | (b) OA + OB = OC",
        "(a)(i) 120, (ii) 7/12, 11/20, 5/8 | (b) OA = OB = OC (Equidistant circumradius)",
        "(a)(i) 60, (ii) 5/8, 7/12, 11/20 | (b) OA = OB > OC"
      ],
      correctAnswer: "(a)(i) 120, (ii) 11/20, 7/12, 5/8 | (b) OA = OB = OC (Equidistant circumradius)",
      hint: "Find the prime factors: 8 = 2³, 12 = 2² × 3, 20 = 2² × 5. LCM = 2³ × 3 × 5. Use the common denominator 120 to order the fractions.",
      workedSolution: "(a)(i) Prime factorization: 8 = 2³, 12 = 2² × 3, 20 = 2² × 5. LCM = 2³ × 3 × 5 = 8 × 15 = 120.\n(a)(ii) Converting to common denominator 120: 5/8 = 75/120; 7/12 = 70/120; 11/20 = 66/120. Ascending order (smallest to largest): 66/120 < 70/120 < 75/120, which is 11/20, 7/12, 5/8.\n(b) The intersection of the perpendicular bisectors of the sides of a triangle is its circumcentre. The circumcentre is equidistant from all three vertices: OA = OB = OC = circumradius R.",
      points: 15
    },
    {
      id: "q06",
      prompt: "Answer all parts of this question:\n(a) Triangle PQR has vertices P(3, 1), Q(1, 4), and R(1, 1).\n   (i) Write down the coordinates of image P₁Q₁R₁ after a reflection in the x-axis.\n   (ii) Write down the coordinates of image P₂Q₂R₂ after translating triangle PQR by vector v = (-2, 3)ᵀ.\n(b) Factorize completely the algebraic expression: 4x² - 6xy + 8xz - 12yz.",
      options: [
        "(a)(i) P₁(3,-1), Q₁(1,-4), R₁(1,-1) | (ii) P₂(1,4), Q₂(-1,7), R₂(-1,4) | (b) 2(2x - 3y)(x + 2z)",
        "(a)(i) P₁(-3,1), Q₁(-1,4), R₁(-1,1) | (ii) P₂(1,4), Q₂(-1,7), R₂(-1,4) | (b) (2x - 3y)(2x + 4z)",
        "(a)(i) P₁(3,-1), Q₁(1,-4), R₁(1,-1) | (ii) P₂(5,-2), Q₂(3,1), R₂(3,-2) | (b) 2(2x + 3y)(x - 2z)",
        "(a)(i) P₁(-3,-1), Q₁(-1,-4), R₁(-1,-1) | (ii) P₂(1,4), Q₂(-1,7), R₂(-1,4) | (b) (4x - 6y)(x + 2z)"
      ],
      correctAnswer: "(a)(i) P₁(3,-1), Q₁(1,-4), R₁(1,-1) | (ii) P₂(1,4), Q₂(-1,7), R₂(-1,4) | (b) 2(2x - 3y)(x + 2z)",
      hint: "Under reflection in the x-axis, (x, y) → (x, -y). Under translation by (-2, 3)ᵀ, (x, y) → (x - 2, y + 3). Group terms with common factors to factorize.",
      workedSolution: "(a)(i) Reflection in x-axis: (x, y) → (x, -y). P(3, 1) → P₁(3, -1); Q(1, 4) → Q₁(1, -4); R(1, 1) → R₁(1, -1).\n(a)(ii) Translation by (-2, 3)ᵀ: (x, y) → (x - 2, y + 3). P(3, 1) → P₂(3-2, 1+3) = P₂(1, 4); Q(1, 4) → Q₂(1-2, 4+3) = Q₂(-1, 7); R(1, 1) → R₂(1-2, 1+3) = R₂(-1, 4).\n(b) 4x² - 6xy + 8xz - 12yz = 2x(2x - 3y) + 4z(2x - 3y) = (2x - 3y)(2x + 4z) = 2(2x - 3y)(x + 2z).",
      points: 15
    }
  ]
};

// ============================================================================
// 4. INGESTION FUNCTION: Writes exactly 1 document to the question set path
// ============================================================================
export interface SeedResult {
  path: string;
  sizeBytes: number;
  sizeKb: string;
  success: boolean;
}

const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('--validate-only');

/**
 * Ingests a single question set document into the global curriculum repository.
 * Path: global_curriculum/${levelId}/subjects/${subjectId}/topics/${topicId}/question_sets/${setData.id}
 */
export async function seedTopicSet(
  levelId: string,
  subjectId: string,
  topicId: string,
  setData: CurriculumQuestionSet,
  options: { dryRun?: boolean } = {}
): Promise<SeedResult> {
  const payload = {
    ...setData,
    seededAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };

  // Validate payload size against Firestore 1 MiB (1,048,576 bytes) limit
  const jsonString = JSON.stringify(payload);
  const sizeBytes = Buffer.byteLength(jsonString, 'utf8');
  const sizeKb = (sizeBytes / 1024).toFixed(2);
  const MAX_FIRESTORE_DOC_BYTES = 1048576; // 1 MiB

  if (sizeBytes >= MAX_FIRESTORE_DOC_BYTES) {
    throw new Error(
      `Document payload size ${sizeBytes} bytes (${sizeKb} KB) exceeds Firestore 1 MiB limit for ${setData.id}`
    );
  }

  const docPath = `global_curriculum/${levelId}/subjects/${subjectId}/topics/${topicId}/question_sets/${setData.id}`;

  const shouldDryRun = options.dryRun || isDryRun || !db;

  if (shouldDryRun) {
    console.log(`🔍 [VALIDATED] Target Path: ${docPath}`);
    console.log(`   📊 Title: "${setData.title}" (${setData.questions.length} questions)`);
    console.log(`   📦 Payload Size: ${sizeBytes} bytes (~${sizeKb} KB) [Limit: 1,048,576 bytes - PASS]`);
    if (!db) {
      console.log(`   ℹ️  Note: Service account credentials not present in local environment. Validated schema & payload size in dry-run mode.`);
    }
  } else {
    // Target document path (exactly 1 document write per set)
    const targetDocRef = db!
      .collection('global_curriculum')
      .doc(levelId)
      .collection('subjects')
      .doc(subjectId)
      .collection('topics')
      .doc(topicId)
      .collection('question_sets')
      .doc(setData.id);

    await targetDocRef.set({
      ...payload,
      seededAt: FieldValue.serverTimestamp(),
      lastUpdated: FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`✅ [SUCCESS] Document written: ${docPath}`);
    console.log(`   📊 Title: "${setData.title}" (${setData.questions.length} questions)`);
    console.log(`   📦 Payload Size: ${sizeBytes} bytes (~${sizeKb} KB) [Limit: 1,048,576 bytes]`);
  }

  return {
    path: docPath,
    sizeBytes,
    sizeKb,
    success: true
  };
}

// ============================================================================
// 4. SCRIPT EXECUTION
// ============================================================================
export async function runCurriculumSeeding() {
  console.log('================================================================');
  console.log('🏛️  GLOBAL CURRICULUM ADMINISTRATIVE SEEDING SCRIPT');
  console.log('    Firebase Admin SDK (Bypassing Client Security Rules)');
  if (isDryRun || !db) {
    console.log('    Mode: VALIDATION / DRY-RUN (Payload & Schema Verification)');
  } else {
    console.log('    Mode: LIVE INGESTION');
  }
  console.log('================================================================\n');

  const results: SeedResult[] = [];

  // Seed Set 1: Lower Primary Math -> Visual Blocks & Addition
  console.log('▶ Ingesting Set 1: Lower Primary Math...');
  const result1 = await seedTopicSet(
    'lower_primary',
    'math',
    'visual_blocks_addition',
    SET_LOWER_PRIMARY_MATH
  );
  results.push(result1);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 2: Upper Primary Math -> Fractions & Decimals
  console.log('▶ Ingesting Set 2: Upper Primary Math...');
  const result2 = await seedTopicSet(
    'upper_primary',
    'math',
    'fractions_decimals',
    SET_UPPER_PRIMARY_MATH
  );
  results.push(result2);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 3: JHS Math -> BECE 2012 Paper 1 (40 Questions in bece_past_papers)
  console.log('▶ Ingesting Set 3: JHS Math (BECE 2012 Paper 1 - 40 Questions)...');
  const result3 = await seedTopicSet(
    'jhs',
    'math',
    'bece_past_papers',
    SET_JHS_MOCK_2012_MATH
  );
  results.push(result3);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 4: JHS Math -> Core Curriculum Series (Paper 1 Objective in core_curriculum_mastery)
  console.log('▶ Ingesting Set 4: Junior Core Math Paper 1 (Objective Mastery Series)...');
  const result4 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_01
  );
  results.push(result4);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 5: JHS Math -> Core Curriculum Series (Paper 2 Structured in core_curriculum_mastery)
  console.log('▶ Ingesting Set 5: Junior Core Math Paper 2 (Mastery & Problem-Solving Series)...');
  const result5 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_02
  );
  results.push(result5);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 6: JHS Math -> Core Curriculum Series (Set 3 Objective in core_curriculum_mastery)
  console.log('▶ Ingesting Set 6: Junior Core Math Objective Mastery Series (Set 3)...');
  const result6 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_03
  );
  results.push(result6);

  console.log('\n================================================================');
  console.log('✨ SEEDING SUMMARY & PAYLOAD VERIFICATION');
  console.log('================================================================');
  for (const r of results) {
    console.log(`• Document Path: ${r.path}`);
    console.log(`  Payload Size:  ${r.sizeBytes} bytes (~${r.sizeKb} KB)`);
    console.log(`  Firestore Cap: 1,048,576 bytes (Usage: ${((r.sizeBytes / 1048576) * 100).toFixed(2)}%)`);
    console.log(`  Status:        PASS (Well under 1 MiB limit)\n`);
  }
  console.log('🎉 All question sets successfully processed for global_curriculum!');
  return results;
}

// Execute if run directly from CLI
if (require.main === module || process.argv[1]?.endsWith('seedCurriculum.ts')) {
  runCurriculumSeeding()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('\n❌ Fatal Error during curriculum seeding:', err);
      process.exit(1);
    });
}
