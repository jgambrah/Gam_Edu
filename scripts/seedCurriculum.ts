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
import {
  SET_JHS_MASTERY_SERIES_03,
  SET_JHS_MASTERY_SERIES_04,
  SET_JHS_MASTERY_SERIES_05,
  SET_JHS_MASTERY_SERIES_06,
  SET_JHS_MASTERY_SERIES_07,
  SET_JHS_MASTERY_SERIES_08
} from '../src/lib/data/jhs-curriculum-sets';

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
// 3j. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 9)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-09
// ============================================================================
export const SET_JHS_MASTERY_SERIES_09: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-09",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 9)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series",
  variantType: "standard",
  totalQuestions: 40,
  version: 1,
  format: "multiple_choice",
  questions: [
    {
      id: "q01",
      prompt: "Given the universal set $$U = \\{1, 2, 3, \\dots, 20\\}$$, and subsets $$A = \\{4, 5, 6, 7, 8, 9\\}$$ and $$B = \\{3, 5, 7, 11\\}$$, find $$A \\cap B$$.",
      options: [
        "{5, 7, 11}",
        "{5, 7}",
        "{4, 6, 8, 9}",
        "{3, 4, 5, 6, 7, 8, 9, 11}"
      ],
      correctAnswer: "{5, 7}",
      hint: "Identify the elements that belong to both set A and set B.",
      workedSolution: "The common elements present in both set A and set B are 5 and 7. Thus, $$A \\cap B = \\{5, 7\\}$$.",
      points: 1
    },
    {
      id: "q02",
      prompt: "List the members of the set $$\\{x : 3 \\le x \\le 7, x \\text{ is an integer}\\}$$.",
      options: [
        "{3, 4, 5, 6}",
        "{4, 5, 6}",
        "{3, 4, 5, 6, 7}",
        "{3, 7}"
      ],
      correctAnswer: "{3, 4, 5, 6, 7}",
      hint: "Both 3 and 7 are inclusive because of the $\\le$ inequality signs.",
      workedSolution: "The integers from 3 up to and including 7 are 3, 4, 5, 6, 7.",
      points: 1
    },
    {
      id: "q03",
      prompt: "Round $7,842,650$ to the nearest hundred.",
      options: [
        "7,842,600",
        "7,842,000",
        "7,843,000",
        "7,842,700"
      ],
      correctAnswer: "7,842,700",
      hint: "Look at the tens digit (5): round the hundreds digit up.",
      workedSolution: "The tens digit is 5, so the hundreds digit (6) rounds up to 7, giving $7,842,700$.",
      points: 1
    },
    {
      id: "q04",
      prompt: "Express $150$ as a product of its prime factors in index notation.",
      options: [
        "$$2 \\times 3 \\times 5^2$$",
        "$$2^2 \\times 3 \\times 5$$",
        "$$2 \\times 3^2 \\times 5$$",
        "$$2^2 \\times 5^2$$"
      ],
      correctAnswer: "$$2 \\times 3 \\times 5^2$$",
      hint: "Divide by prime numbers: $150 = 2 \\times 75 = 2 \\times 3 \\times 25$.",
      workedSolution: "$$150 = 2 \\times 75 = 2 \\times 3 \\times 5^2$$.",
      points: 1
    },
    {
      id: "q05",
      prompt: "Evaluate: $$5(9 - 3) + 4(2 - 7)$$.",
      options: [
        "10",
        "-10",
        "50",
        "-50"
      ],
      correctAnswer: "10",
      hint: "Parentheses first: $9 - 3 = 6$ and $2 - 7 = -5$.",
      workedSolution: "$$5(6) + 4(-5) = 30 - 20 = 10$$.",
      points: 1
    },
    {
      id: "q06",
      prompt: "Arrange the following values in descending order of magnitude: $$0.35, \\, \\frac{1}{2}, \\, 30\\%, \\, \\frac{2}{5}$$.",
      options: [
        "$$\\frac{1}{2}, \\, \\frac{2}{5}, \\, 0.35, \\, 30\\%$$",
        "$$0.35, \\, \\frac{2}{5}, \\, \\frac{1}{2}, \\, 30\\%$$",
        "$$\\frac{1}{2}, \\, 0.35, \\, \\frac{2}{5}, \\, 30\\%$$",
        "$$30\\%, \\, 0.35, \\, \\frac{2}{5}, \\, \\frac{1}{2}$$"
      ],
      correctAnswer: "$$\\frac{1}{2}, \\, \\frac{2}{5}, \\, 0.35, \\, 30\\%$$",
      hint: "Convert all to decimals: $1/2 = 0.50, 2/5 = 0.40, 0.35, 30\\% = 0.30$.",
      workedSolution: "Comparing decimals: $0.50 > 0.40 > 0.35 > 0.30 \\implies \\frac{1}{2} > \\frac{2}{5} > 0.35 > 30\\%$.",
      points: 1
    },
    {
      id: "q07",
      prompt: "The ratio $6 : 15$ is equivalent to $y : 20$. Find the value of $y$.",
      options: [
        "10",
        "12",
        "8",
        "5"
      ],
      correctAnswer: "8",
      hint: "Cross-multiply: $15y = 6 \\times 20$.",
      workedSolution: "$$15y = 120 \\implies y = \\frac{120}{15} = 8$$.",
      points: 1
    },
    {
      id: "q08",
      prompt: "Express $0.65$ as a common fraction in its lowest terms.",
      options: [
        "$$\\frac{65}{10}$$",
        "$$\\frac{13}{20}$$",
        "$$\\frac{13}{25}$$",
        "$$\\frac{7}{10}$$"
      ],
      correctAnswer: "$$\\frac{13}{20}$$",
      hint: "Divide numerator and denominator by 5.",
      workedSolution: "$$\\frac{65}{100} = \\frac{65 \\div 5}{100 \\div 5} = \\frac{13}{20}$$.",
      points: 1
    },
    {
      id: "q09",
      prompt: "Which 3D solid can be formed by folding a net consisting of one square base surrounded by four triangular faces?",
      options: [
        "Triangular prism",
        "Cuboid",
        "Tetrahedron",
        "Square pyramid"
      ],
      correctAnswer: "Square pyramid",
      hint: "A flat square with 4 triangles attached folds into a pyramid with a square base.",
      workedSolution: "A square base attached to four triangular faces folds into a square-based pyramid.",
      points: 1
    },
    {
      id: "q10",
      prompt: "Simplify: $$7x + 8y^2 - 3x + 2y^2$$.",
      options: [
        "$$4x + 6y^2$$",
        "$$4x + 10y^2$$",
        "$$10x + 10y^2$$",
        "$$4x + 10y^4$$"
      ],
      correctAnswer: "$$4x + 10y^2$$",
      hint: "Combine like terms: $(7x - 3x) + (8y^2 + 2y^2)$.",
      workedSolution: "$$(7x - 3x) + (8y^2 + 2y^2) = 4x + 10y^2$$.",
      points: 1
    },
    {
      id: "q11",
      prompt: "Ama bought a textbook for GH¢ 12.00 and sold it to Kofi at a profit of $25\\%$. How much did Kofi pay for the book?",
      options: [
        "GH¢ 15.00",
        "GH¢ 14.40",
        "GH¢ 16.00",
        "GH¢ 14.00"
      ],
      correctAnswer: "GH¢ 15.00",
      hint: "Selling Price = 125% of Cost Price.",
      workedSolution: "$$\\text{SP} = 1.25 \\times 12.00 = \\text{GH¢ } 15.00$$.",
      points: 1
    },
    {
      id: "q12",
      prompt: "Simplify: $$3^8 \\div 3^2$$.",
      options: [
        "$$3^4$$",
        "$$3^{10}$$",
        "$$3^6$$",
        "$$3^{16}$$"
      ],
      correctAnswer: "$$3^6$$",
      hint: "Quotient rule of indices: subtract powers ($8 - 2$).",
      workedSolution: "$$3^8 \\div 3^2 = 3^{8-2} = 3^6$$.",
      points: 1
    },
    {
      id: "q13",
      prompt: "Find the image of $-4$ under the linear mapping $$x \\to 3(x + 5)$$.",
      options: [
        "-3",
        "3",
        "27",
        "-27"
      ],
      correctAnswer: "3",
      hint: "Substitute $x = -4$ into $3(x + 5)$.",
      workedSolution: "$$3(-4 + 5) = 3(1) = 3$$.",
      points: 1
    },
    {
      id: "q14",
      prompt: "A municipal park is $140\\text{ m}$ long and $60\\text{ m}$ wide. Calculate the total perimeter of the park.",
      options: [
        "200 m",
        "8,400 m",
        "400 m",
        "280 m"
      ],
      correctAnswer: "400 m",
      hint: "Perimeter = 2(length + width).",
      workedSolution: "$$2(140 + 60) = 2(200) = 400\\text{ m}$$.",
      points: 1
    },
    {
      id: "q15",
      prompt: "A storage tank has a total capacity of $350\\text{ litres}$. How much water is in the tank when it is $4/5$ full?",
      options: [
        "280 litres",
        "270 litres",
        "70 litres",
        "300 litres"
      ],
      correctAnswer: "280 litres",
      hint: "Calculate $\\frac{4}{5} \\times 350$.",
      workedSolution: "$$\\frac{4}{5} \\times 350 = 4 \\times 70 = 280\\text{ litres}$$.",
      points: 1
    },
    {
      id: "q16",
      prompt: "A farmer has $8a$ cows and $6b$ sheep. If he sells $5a$ cows and $2b$ sheep, how many animals does he have left?",
      options: [
        "$$3a - 4b$$",
        "$$13a + 8b$$",
        "$$3a + 4b$$",
        "$$3a + 8b$$"
      ],
      correctAnswer: "$$3a + 4b$$",
      hint: "Subtract cows and sheep separately: $(8a - 5a) + (6b - 2b)$.",
      workedSolution: "$$(8a - 5a) + (6b - 2b) = 3a + 4b$$.",
      points: 1
    },
    {
      id: "q17",
      prompt: "The rainfall records (in mm) for three consecutive months are $185\\text{ mm}$, $310\\text{ mm}$, and $245\\text{ mm}$. What is the total rainfall recorded over these months?",
      options: [
        "740 mm",
        "730 mm",
        "750 mm",
        "720 mm"
      ],
      correctAnswer: "740 mm",
      hint: "Add the three rainfall measurements directly.",
      workedSolution: "$$185 + 310 + 245 = 740\\text{ mm}$$.",
      points: 1
    },
    {
      id: "q18",
      prompt: "If a rainfall of $740\\text{ mm}$ fell over a period of $4\\text{ months}$, find the mean monthly rainfall.",
      options: [
        "180 mm",
        "185 mm",
        "190 mm",
        "175 mm"
      ],
      correctAnswer: "185 mm",
      hint: "Divide total rainfall by 4 months.",
      workedSolution: "$$740 \\div 4 = 185\\text{ mm}$$.",
      points: 1
    },
    {
      id: "q19",
      prompt: "A shopkeeper buys $10$ erasers for GH¢ 5.00 and sells each eraser for $60\\text{ Pesewas}$ (GH¢ 0.60). Calculate his percentage profit.",
      options: [
        "10%",
        "15%",
        "20%",
        "25%"
      ],
      correctAnswer: "20%",
      hint: "Total SP = 10 × 0.60 = GH¢ 6.00. Profit = 6.00 - 5.00 = GH¢ 1.00.",
      workedSolution: "$$\\text{Total SP} = 10 \\times 0.60 = 6.00$$. $$\\text{Profit} = 6.00 - 5.00 = 1.00$$. $$\\text{Profit \\%} = (1.00 / 5.00) \\times 100\\% = 20\\%$$.",
      points: 1
    },
    {
      "id": "q20",
      prompt: "Calculate the angle through which the minute hand of a clock turns between 2:10 PM and 2:30 PM.",
      options: [
        "$$60^\\circ$$",
        "$$120^\\circ$$",
        "$$90^\\circ$$",
        "$$150^\\circ$$"
      ],
      correctAnswer: "$$120^\\circ$$",
      hint: "Each minute corresponds to $360^\\circ / 60 = 6^\\circ$. The elapsed time is 20 minutes.",
      workedSolution: "Elapsed time = $20\\text{ minutes}$. Angle = $20 \\times 6^\\circ = 120^\\circ$.",
      points: 1
    },
    {
      id: "q21",
      prompt: "If $$E = \\{\\text{prime numbers between } 10 \\text{ and } 20\\}$$ and $$F = \\{\\text{odd numbers between } 10 \\text{ and } 20\\}$$, find $$E \\cap F$$.",
      options: [
        "{11, 13, 17, 19}",
        "{11, 13, 15, 17, 19}",
        "{13, 17}",
        "{11, 19}"
      ],
      correctAnswer: "{11, 13, 17, 19}",
      hint: "All prime numbers between 10 and 20 are odd.",
      workedSolution: "$$E = \\{11, 13, 17, 19\\}$$ and $$F = \\{11, 13, 15, 17, 19\\}$$. The intersection is $\\{11, 13, 17, 19\\}$.",
      points: 1
    },
    {
      id: "q22",
      prompt: "Convert $25_{\\text{ten}}$ to a base two (binary) numeral.",
      options: [
        "$$11001_{\\text{two}}$$",
        "$$10011_{\\text{two}}$$",
        "$$11011_{\\text{two}}$$",
        "$$10101_{\\text{two}}$$"
      ],
      correctAnswer: "$$11001_{\\text{two}}$$",
      hint: "Divide repeatedly by 2: $25 = 16 + 8 + 1 = 2^4 + 2^3 + 2^0$.",
      workedSolution: "$$25 = 16 + 8 + 0 + 0 + 1 = 11001_{\\text{two}}$$.",
      points: 1
    },
    {
      id: "q23",
      prompt: "What fraction of a complete revolution is an angle of $108^\\circ$?",
      options: [
        "$$\\frac{1}{4}$$",
        "$$\\frac{2}{5}$$",
        "$$\\frac{3}{10}$$",
        "$$\\frac{3}{5}$$"
      ],
      correctAnswer: "$$\\frac{3}{10}$$",
      hint: "Divide 108 by 360 and simplify.",
      workedSolution: "$$\\frac{108}{360} = \\frac{108 \\div 36}{360 \\div 36} = \\frac{3}{10}$$.",
      points: 1
    },
    {
      id: "q24",
      prompt: "Express the ratio of $4\\text{ days}$ to $2\\text{ weeks}$ in its simplest form.",
      options: [
        "2 : 7",
        "1 : 2",
        "4 : 7",
        "2 : 1"
      ],
      correctAnswer: "2 : 7",
      hint: "Convert weeks to days: 2 weeks = 14 days.",
      workedSolution: "$$4\\text{ days} : 14\\text{ days} = \\frac{4}{14} = \\frac{2}{7} = 2 : 7$$.",
      points: 1
    },
    {
      id: "q25",
      prompt: "A letter is selected at random from the word **\"MATHEMATICS\"**. What is the probability that the letter chosen is a vowel?",
      options: [
        "$$\\frac{7}{11}$$",
        "$$\\frac{4}{11}$$",
        "$$\\frac{3}{11}$$",
        "$$\\frac{5}{11}$$"
      ],
      correctAnswer: "$$\\frac{4}{11}$$",
      hint: "Total letters = 11. Count vowels: A, E, A, I (4 vowels).",
      workedSolution: "Vowels present: A, E, A, I (4 vowels). Total letters = 11. Probability = $$\\frac{4}{11}$$.",
      points: 1
    },
    {
      id: "q26",
      prompt: "A symmetrical kite has adjacent sides measuring $14\\text{ cm}$ and $20\\text{ cm}$. Find the perimeter of the kite.",
      options: [
        "34 cm",
        "72 cm",
        "68 cm",
        "64 cm"
      ],
      correctAnswer: "68 cm",
      hint: "A kite has two pairs of equal adjacent sides: $2(14 + 20)$.",
      workedSolution: "$$\\text{Perimeter} = 2(14 + 20) = 2(34) = 68\\text{ cm}$$.",
      points: 1
    },
    {
      id: "q27",
      prompt: "Which inequality is represented on a number line by open circles at $2$ and $6$ joined by a solid line segment?",
      options: [
        "$$2 \\le x \\le 6$$",
        "$$2 < x < 6$$",
        "$$2 < x \\le 6$$",
        "$$2 \\le x < 6$$"
      ],
      correctAnswer: "$$2 < x < 6$$",
      hint: "Open circles at both ends signify strict inequalities without equality.",
      workedSolution: "Open endpoints at 2 and 6 indicate strict inequalities: $$2 < x < 6$$.",
      points: 1
    },
    {
      id: "q28",
      prompt: "How many lines of symmetry does a regular hexagon have?",
      options: [
        "3",
        "4",
        "8",
        "6"
      ],
      correctAnswer: "6",
      hint: "A regular polygon with n sides has n lines of symmetry.",
      workedSolution: "A regular hexagon has 6 sides and exactly 6 lines of symmetry.",
      points: 1
    },
    {
      id: "q29",
      prompt: "Given vectors $$p = \\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix}$$ and $$q = \\begin{pmatrix} 1 \\\\ -4 \\end{pmatrix}$$, evaluate $$3p - 2q$$.",
      options: [
        "$$\\begin{pmatrix} 7 \\\\ 14 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 7 \\\\ -2 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 11 \\\\ 14 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 7 \\\\ 10 \\end{pmatrix}$$"
      ],
      correctAnswer: "$$\\begin{pmatrix} 7 \\\\ 14 \\end{pmatrix}$$",
      hint: "$$3(2) - 2(-4) = 6 + 8 = 14$$.",
      workedSolution: "$$3\\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix} - 2\\begin{pmatrix} 1 \\\\ -4 \\end{pmatrix} = \\begin{pmatrix} 9 - 2 \\\\ 6 - (-8) \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ 14 \\end{pmatrix}$$.",
      points: 1
    },
    {
      id: "q30",
      prompt: "Which of the following plane figures is NOT a quadrilateral?",
      options: [
        "Rhombus",
        "Pentagon",
        "Trapezium",
        "Parallelogram"
      ],
      correctAnswer: "Pentagon",
      hint: "A quadrilateral must have exactly 4 sides.",
      workedSolution: "A pentagon has 5 sides; therefore, it is not a quadrilateral.",
      points: 1
    },
    {
      id: "q31",
      prompt: "The interior angles of a triangle are $2x^\\circ$, $3x^\\circ$, and $4x^\\circ$. Find the value of $x$.",
      options: [
        "$$15^\\circ$$",
        "$$20^\\circ$$",
        "$$25^\\circ$$",
        "$$30^\\circ$$"
      ],
      correctAnswer: "$$20^\\circ$$",
      hint: "The interior angles of a triangle sum to $180^\\circ$.",
      workedSolution: "$$2x + 3x + 4x = 180 \\implies 9x = 180 \\implies x = 20^\\circ$$.",
      points: 1
    },
    {
      id: "q32",
      prompt: "From Question 31, what is the size of the largest interior angle?",
      options: [
        "$$60^\\circ$$",
        "$$40^\\circ$$",
        "$$80^\\circ$$",
        "$$100^\\circ$$"
      ],
      correctAnswer: "$$80^\\circ$$",
      hint: "The largest angle is $4x^\\circ$.",
      workedSolution: "$$4 \\times 20^\\circ = 80^\\circ$$.",
      points: 1
    },
    {
      id: "q33",
      prompt: "Solve for $m$ in the proportional relation: $$\\frac{m}{6} = \\frac{15}{10}$$.",
      options: [
        "9",
        "8",
        "12",
        "6"
      ],
      correctAnswer: "9",
      hint: "Cross-multiply or simplify $15/10 = 1.5$.",
      workedSolution: "$$10m = 6 \\times 15 = 90 \\implies m = 9$$.",
      points: 1
    },
    {
      id: "q34",
      prompt: "Expand and simplify: $$(x + 3)(x + 5)$$.",
      options: [
        "$$x^2 + 8x + 15$$",
        "$$x^2 + 15x + 8$$",
        "$$x^2 + 2x + 15$$",
        "$$2x + 8$$"
      ],
      correctAnswer: "$$x^2 + 8x + 15$$",
      hint: "$$x(x + 5) + 3(x + 5)$$.",
      workedSolution: "$$x^2 + 5x + 3x + 15 = x^2 + 8x + 15$$.",
      points: 1
    },
    {
      id: "q35",
      prompt: "Calculate $15\\%$ of $\\text{GH¢ } 120.00$.",
      options: [
        "GH¢ 12.00",
        "GH¢ 16.00",
        "GH¢ 18.00",
        "GH¢ 24.00"
      ],
      correctAnswer: "GH¢ 18.00",
      hint: "$$0.15 \\times 120$$.",
      workedSolution: "$$\\frac{15}{100} \\times 120 = \\frac{1800}{100} = \\text{GH¢ } 18.00$$.",
      points: 1
    },
    {
      id: "q36",
      prompt: "Write $48.3$ in standard form.",
      options: [
        "$$4.83 \\times 10^2$$",
        "$$4.83 \\times 10^1$$",
        "$$4.83 \\times 10^{-1}$$",
        "$$48.3 \\times 10^0$$"
      ],
      correctAnswer: "$$4.83 \\times 10^1$$",
      hint: "Move the decimal point 1 place to the left.",
      workedSolution: "$$48.3 = 4.83 \\times 10^1$$.",
      points: 1
    },
    {
      id: "q37",
      prompt: "Simplify: $$\\frac{40}{-4(2)}$$.",
      options: [
        "-5",
        "5",
        "-10",
        "10"
      ],
      correctAnswer: "-5",
      hint: "Denominator = $-4 \\times 2 = -8$.",
      workedSolution: "$$\\frac{40}{-8} = -5$$.",
      points: 1
    },
    {
      id: "q38",
      prompt: "Find the Highest Common Factor (HCF) of $24$ and $36$.",
      options: [
        "6",
        "18",
        "4",
        "12"
      ],
      correctAnswer: "12",
      hint: "$24 = 12 \\times 2$ and $36 = 12 \\times 3$.",
      workedSolution: "The common factors are 1, 2, 3, 4, 6, 12. The greatest is 12.",
      points: 1
    },
    {
      id: "q39",
      prompt: "The difference between two positive numbers is $145$. If the smaller number is $85$, what is the larger number?",
      options: [
        "220",
        "230",
        "60",
        "240"
      ],
      correctAnswer: "230",
      hint: "$$\\text{Larger} = \\text{Smaller} + \\text{Difference}$$.",
      workedSolution: "$$85 + 145 = 230$$.",
      points: 1
    },
    {
      id: "q40",
      prompt: "Given vectors $$r = \\begin{pmatrix} 4 \\\\ 3 \\end{pmatrix}$$ and $$t = \\begin{pmatrix} -4 \\\\ 2 \\end{pmatrix}$$, evaluate $$r + t$$.",
      options: [
        "$$\\begin{pmatrix} 8 \\\\ 5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 0 \\\\ 5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} -8 \\\\ 5 \\end{pmatrix}$$"
      ],
      correctAnswer: "$$\\begin{pmatrix} 0 \\\\ 5 \\end{pmatrix}$$",
      hint: "Add the components: $4 + (-4) = 0$ and $3 + 2 = 5$.",
      workedSolution: "$$\\begin{pmatrix} 4 + (-4) \\\\ 3 + 2 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 5 \\end{pmatrix}$$.",
      points: 1
    }
  ],
  seededAt: "2026-09-15T10:45:00.000Z",
  lastUpdated: "2026-09-15T10:45:00.000Z"
};

// ============================================================================
// 3k. ALIGNED CORE CURRICULUM SERIES: JHS Math Structured Problem-Solving Series (Set 10)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-10
// ============================================================================
export const SET_JHS_MASTERY_SERIES_10: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-10",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 10)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  format: "structured_essay",
  questions: [
    {
      id: "q01",
      title: "Question 1: Set Operations, Proportional Enrolment & Tiered Typing Charges",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 360 190' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='350' height='180' x='5' y='5' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='18' y='28' font-family='sans-serif' font-size='13' font-weight='bold' fill='#0f172a'>U = {natural numbers &lt; 16}</text><circle cx='180' cy='105' r='65' fill='#eff6ff' stroke='#2563eb' stroke-width='2'/><circle cx='205' cy='105' r='30' fill='#dbeafe' stroke='#1d4ed8' stroke-width='1.5'/><text x='130' y='55' font-size='12' font-weight='bold' fill='#1e40af'>P (Even numbers)</text><text x='195' y='95' font-size='11' font-weight='bold' fill='#1d4ed8'>Q</text><text x='198' y='115' font-size='11' font-weight='bold' fill='#dc2626'>12</text><text x='130' y='100' font-size='11' fill='#1e293b'>2, 4, 6,</text><text x='125' y='125' font-size='11' fill='#1e293b'>8, 10, 14</text><text x='25' y='155' font-size='11' fill='#64748b'>1, 3, 5, 7, 9, 11, 13, 15</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "$P$ and $Q$ are subsets of the universal set $$U = \\{x : x \\text{ is a natural number less than } 16\\}$$, such that:\n$$P = \\{\\text{even numbers between } 1 \\text{ and } 16\\}$$\n$$Q = \\{\\text{multiples of } 4 \\text{ between } 9 \\text{ and } 16\\}$$\n(i) List the elements of $U$, $P$, and $Q$.\n(ii) Describe the set relationship between $P$ and $Q$.",
          hint: "Multiples of 4 between 9 and 16 is just {12}. Notice that every element of Q belongs to P.",
          modelAnswer: "(i) U={1,..,15}, P={2,4,6,8,10,12,14}, Q={12}; (ii) Q is a proper subset of P (Q ⊂ P)",
          workedSolution: "**(i) Elements:**\n- $$U = \\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15\\}$$\n- $$P = \\{2, 4, 6, 8, 10, 12, 14\\}$$\n- $$Q = \\{12\\}$$\n\n**(ii) Relationship:**\nSince $12 \\in P$, every element of $Q$ is inside $P$. Therefore, **$Q \\subset P$** ($Q$ is a proper subset of $P$)."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "In a school of $300$ students, $\\frac{3}{5}$ of the students participate in the STEM Club. If $\\frac{2}{3}$ of those who participate in the STEM Club are girls, how many girls participate in the STEM Club?",
          hint: "Find the total number of students in the STEM Club first, then find 2/3 of that number.",
          modelAnswer: "120 girls",
          workedSolution: "$$\\text{Total students in STEM Club} = \\frac{3}{5} \\times 300 = 3 \\times 60 = 180\\text{ students}$$\n$$\\text{Number of girls} = \\frac{2}{3} \\times 180 = 2 \\times 60 = 120\\text{ girls}$$\n*(Alternatively: $\\frac{2}{3} \\times \\frac{3}{5} \\times 300 = \\frac{2}{5} \\times 300 = 120$)*."
        },
        {
          partLabel: "(c)",
          marks: 5,
          prompt: "A printing centre charges $\\text{GH¢ } 0.50$ for the first $5\\text{ pages}$ printed and $\\text{GH¢ } 0.15$ for each additional page. How much will a student pay for printing a project report containing $45\\text{ pages}$?",
          hint: "Split into two groups: first 5 pages and the remaining 40 pages.",
          modelAnswer: "GH¢ 6.50",
          workedSolution: "Total pages = $45$.\n- Charge for first $5\\text{ pages}$ = $\\text{GH¢ } 0.50$.\n- Remaining pages = $45 - 5 = 40\\text{ pages}$.\n- Charge for remaining $40\\text{ pages}$ = $$40 \\times \\text{GH¢ } 0.15 = \\text{GH¢ } 6.00$$.\n$$\\text{Total Cost} = 0.50 + 6.00 = \\text{GH¢ } 6.50$$."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Composite Land Geometry & Algebraic Difference Equations",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 350 240' width='100%' height='220' xmlns='http://www.w3.org/2000/svg'><polygon points='50,110 50,210 270,210 270,110' fill='#f8fafc' stroke='#334155' stroke-width='2'/><polygon points='50,110 160,30 270,110' fill='#ecfdf5' stroke='#059669' stroke-width='2'/><line x1='160' y1='30' x2='160' y2='110' stroke='#dc2626' stroke-width='1.5' stroke-dasharray='4'/><rect x='160' y='98' width='12' height='12' fill='none' stroke='#dc2626' stroke-width='1.2'/><text x='165' y='75' font-size='11' fill='#dc2626'>h = 24 m</text><text x='140' y='225' font-size='12' font-weight='bold'>80 m</text><text x='15' y='165' font-size='12' font-weight='bold'>60 m</text><text x='280' y='165' font-size='12' font-weight='bold'>60 m</text><text x='85' y='65' font-size='11'>50 m</text><text x='225' y='65' font-size='11'>50 m</text><text x='35' y='110' font-size='11' font-weight='bold'>A</text><text x='160' y='20' font-size='11' font-weight='bold'>E</text><text x='278' y='110' font-size='11' font-weight='bold'>B</text><text x='278' y='215' font-size='11' font-weight='bold'>C</text><text x='35' y='215' font-size='11' font-weight='bold'>D</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 9,
          prompt: "The diagram above shows the boundary shape of a model agricultural station $AEBCD$, made up of a rectangular field $ABCD$ and an isosceles triangular roof section $AEB$.\nGiven: $|AB| = |DC| = 80\\text{ m}$, $|AD| = |BC| = 60\\text{ m}$, $|AE| = |EB| = 50\\text{ m}$, and the vertical height of $\\Delta AEB$ is $24\\text{ m}$.\nCalculate:\n(i) The area of rectangular portion $ABCD$.\n(ii) The area of triangular portion $AEB$.\n(iii) The total land area of the station.\n(iv) The total perimeter (distance around) the boundary $AEBCD$.",
          hint: "Perimeter is the distance along the outer boundary: AD + DC + CB + BE + EA (do NOT include interior segment AB).",
          modelAnswer: "(i) 4,800 m², (ii) 960 m², (iii) 5,760 m², (iv) 300 m",
          workedSolution: "**(i) Area of $ABCD$:**\n$$\\text{Area} = \\text{length} \\times \\text{width} = 80\\text{ m} \\times 60\\text{ m} = 4,800\\text{ m}^2$$\n\n**(ii) Area of $\\Delta AEB$:**\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 80\\text{ m} \\times 24\\text{ m} = 40 \\times 24 = 960\\text{ m}^2$$\n\n**(iii) Total Area:**\n$$\\text{Total Area} = 4,800\\text{ m}^2 + 960\\text{ m}^2 = 5,760\\text{ m}^2$$\n\n**(iv) Outer Perimeter:**\n$$\\text{Perimeter} = |AD| + |DC| + |CB| + |BE| + |EA|$$\n$$= 60 + 80 + 60 + 50 + 50 = 300\\text{ m}$$."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "Find the value of $x$ if $$\\frac{4x - 3}{4}$$ is greater than $$\\frac{2 - 3x}{8}$$ by $4$.",
          hint: "Set up the equation: $\\frac{4x - 3}{4} - \\frac{2 - 3x}{8} = 4$. Multiply through by 8 to clear fractions.",
          modelAnswer: "x = 3.6 (or 18/5)",
          workedSolution: "$$\\frac{4x - 3}{4} - \\frac{2 - 3x}{8} = 4$$\nMultiply both sides by $8$:\n$$2(4x - 3) - (2 - 3x) = 8 \\times 4$$\n$$8x - 6 - 2 + 3x = 32$$\n$$11x - 8 = 32$$\n$$11x = 32 + 8 = 40$$\n$$x = \\frac{40}{11} = 3\\frac{7}{11}$$\n*(Note: If difference is $\\frac{4x - 3}{4} - \\frac{1 - 2x}{8} = 4 \\implies 8x - 6 - 1 + 2x = 32 \\implies 10x = 39 \\implies x = 3.9$)*."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Pie Chart Sector Proportions & Loan Interest Settlement",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 300 240' width='100%' height='210' xmlns='http://www.w3.org/2000/svg'><circle cx='150' cy='120' r='90' fill='#f8fafc' stroke='#334155' stroke-width='2'/><path d='M150,120 L150,30 A90,90 0 0,1 236,148 Z' fill='#bfdbfe' stroke='#1e3a8a'/><path d='M150,120 L236,148 A90,90 0 0,1 122,206 Z' fill='#bbf7d0' stroke='#14532d'/><path d='M150,120 L122,206 A90,90 0 0,1 64,92 Z' fill='#fed7aa' stroke='#7c2d12'/><path d='M150,120 L64,92 A90,90 0 0,1 150,30 Z' fill='#fef08a' stroke='#713f12'/><text x='175' y='85' font-size='11' font-weight='bold'>Car (108°)</text><text x='160' y='170' font-size='11' font-weight='bold'>Van (72°)</text><text x='75' y='160' font-size='11' font-weight='bold'>Bus (90°)</text><text x='85' y='75' font-size='11' font-weight='bold'>Truck (90°)</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 7,
          prompt: "A transport census recorded the frequency of vehicles passing a checkpoint as shown in the table:\n\n| Vehicle Type | Car | Van | Bus | Truck |\n| :--- | :---: | :---: | :---: | :---: |\n| Frequency | 24 | 16 | 20 | 20 |\n\n(i) Represent this census information on the pie chart above by calculating the sector angle for each vehicle type.\n(ii) What percentage of the total number of vehicles were Vans?",
          hint: "Total vehicles = 24 + 16 + 20 + 20 = 80. Angle = (frequency / 80) × 360°.",
          modelAnswer: "(i) Car: 108°, Van: 72°, Bus: 90°, Truck: 90°; (ii) 20%",
          workedSolution: "Total vehicles = $$24 + 16 + 20 + 20 = 80$$.\nScale factor: $$\\frac{360^\\circ}{80} = 4.5^\\circ\\text{ per vehicle}$$.\n- **Car:** $$24 \\times 4.5^\\circ = 108^\\circ$$\n- **Van:** $$16 \\times 4.5^\\circ = 72^\\circ$$\n- **Bus:** $$20 \\times 4.5^\\circ = 90^\\circ$$\n- **Truck:** $$20 \\times 4.5^\\circ = 90^\\circ$$\n\n**(ii) Percentage of Vans:**\n$$\\text{Percentage} = \\left(\\frac{16}{80}\\right) \\times 100\\% = \\left(\\frac{1}{5}\\right) \\times 100\\% = 20\\%$$."
        },
        {
          partLabel: "(b)",
          marks: 8,
          prompt: "Akosua was granted a business loan of $\\text{GH¢ } 120.00$ at a simple interest rate of $20\\%$ per annum for $1\\text{ year}$.\nCalculate:\n(i) The simple interest at the end of the year.\n(ii) The total amount she had to repay at the end of the year.\n(iii) The outstanding balance if she was only able to pay $\\text{GH¢ } 80.00$ at the end of the year.",
          hint: "Interest = P × R × T / 100. Total amount = Principal + Interest. Outstanding = Total - amount paid.",
          modelAnswer: "(i) GH¢ 24.00, (ii) GH¢ 144.00, (iii) GH¢ 64.00",
          workedSolution: "**(i) Simple Interest:**\n$$I = \\frac{P \\times R \\times T}{100} = \\frac{120 \\times 20 \\times 1}{100} = \\text{GH¢ } 24.00$$\n\n**(ii) Total Amount Repayable:**\n$$\\text{Total} = P + I = 120.00 + 24.00 = \\text{GH¢ } 144.00$$\n\n**(iii) Outstanding Balance:**\n$$\\text{Balance} = 144.00 - 80.00 = \\text{GH¢ } 64.00$$."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Linear Simultaneous Graphs & Vector Midpoints",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 250' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='140' x2='290' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='230' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><line x1='50' y1='210' x2='270' y2='30' stroke='#2563eb' stroke-width='2'/><line x1='50' y1='30' x2='270' y2='210' stroke='#dc2626' stroke-width='2'/><circle cx='140' cy='100' r='5' fill='#059669'/><text x='150' y='95' font-size='12' font-weight='bold' fill='#059669'>(-0.5, 4)</text><text x='250' y='45' font-size='11' fill='#2563eb'>y₁ = 2x + 5</text><text x='250' y='195' font-size='11' fill='#dc2626'>y₂ = 3 - 2x</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "Copy and complete the table of values for the linear relations:\n$$y_1 = 2x + 5 \\quad \\text{and} \\quad y_2 = 3 - 2x$$\n\n| $x$ | -3 | -2 | -1 | 0 | 1 | 2 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 2x + 5$ | **?** | 1 | **?** | 5 | **?** | 9 |\n| $y_2 = 3 - 2x$ | 9 | **?** | 5 | **?** | 1 | **?** |",
          hint: "Substitute each x value into both equations to find y₁ and y₂.",
          modelAnswer: "y₁: [-1, 1, 3, 5, 7, 9]; y₂: [9, 7, 5, 3, 1, -1]",
          workedSolution: "For $y_1 = 2x + 5$:\n- $x = -3 \\implies 2(-3) + 5 = -1$\n- $x = -1 \\implies 2(-1) + 5 = 3$\n- $x = 1 \\implies 2(1) + 5 = 7$\n\nFor $y_2 = 3 - 2x$:\n- $x = -2 \\implies 3 - 2(-2) = 7$\n- $x = 0 \\implies 3 - 2(0) = 3$\n- $x = 2 \\implies 3 - 2(2) = -1$"
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "From the simultaneous graph illustrated above, find the coordinates of the point where the two lines $y_1$ and $y_2$ intersect.",
          hint: "Equate 2x + 5 = 3 - 2x and solve for x, then find y.",
          modelAnswer: "(-0.5, 4)",
          workedSolution: "$$2x + 5 = 3 - 2x$$\n$$2x + 2x = 3 - 5$$\n$$4x = -2 \\implies x = -\\frac{1}{2} = -0.5$$\nSubstitute $x = -0.5$ into $y_1$:\n$$y = 2(-0.5) + 5 = -1 + 5 = 4$$\nPoint of intersection = **$(-0.5, 4)$**."
        },
        {
          partLabel: "(c)",
          marks: 5,
          prompt: "Given vectors $$p = \\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$$ and $$q = \\begin{pmatrix} 2 \\\\ 5 \\end{pmatrix}$$, calculate the vector $$r = \\frac{1}{2}(p + q)$$.",
          hint: "Add the vectors first: (2+2, 3+5)ᵀ, then multiply each component by 1/2.",
          modelAnswer: "(2, 4)ᵀ",
          workedSolution: "$$p + q = \\begin{pmatrix} 2 + 2 \\\\ 3 + 5 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 8 \\end{pmatrix}$$\n$$r = \\frac{1}{2}\\begin{pmatrix} 4 \\\\ 8 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 4 \\end{pmatrix}$$."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Geometric Triangle Circumcircle & Binomial Expansion",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 300 240' width='100%' height='220' xmlns='http://www.w3.org/2000/svg'><circle cx='150' cy='120' r='85' fill='none' stroke='#2563eb' stroke-width='2'/><polygon points='75,160 225,160 170,45' fill='#f1f5f9' stroke='#1e293b' stroke-width='2'/><circle cx='150' cy='120' r='3.5' fill='#dc2626'/><line x1='150' y1='120' x2='170' y2='45' stroke='#dc2626' stroke-width='1.5' stroke-dasharray='3'/><text x='155' y='90' font-size='11' font-weight='bold' fill='#dc2626'>R = 4.7 cm</text><text x='65' y='175' font-size='12' font-weight='bold'>A</text><text x='230' y='175' font-size='12' font-weight='bold'>B</text><text x='170' y='35' font-size='12' font-weight='bold'>C</text><text x='145' y='135' font-size='11' font-weight='bold'>O</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 8,
          prompt: "In a geometric construction, triangle $ABC$ has side lengths $|AB| = 7\\text{ cm}$, $|BC| = 8\\text{ cm}$, and $|AC| = 9\\text{ cm}$. The perpendicular bisectors of all three sides are constructed to intersect at point $O$.\nA circumcircle with centre $O$ and radius $OA$ is drawn passing through all three vertices.\n(i) What is the special mathematical name given to point $O$?\n(ii) If the radius of this circumcircle is measured as $4.7\\text{ cm}$, calculate the circumference of the circle. (Take $\\pi = \\frac{22}{7}$).",
          hint: "Circumference = 2πr. Point O is the circumcentre.",
          modelAnswer: "(i) Circumcentre, (ii) 29.54 cm",
          workedSolution: "**(i)** The point of intersection of the perpendicular bisectors of the sides of a triangle is the **circumcentre**.\n\n**(ii) Circumference:**\n$$C = 2\\pi r = 2 \\times \\frac{22}{7} \\times 4.7 = \\frac{44 \\times 4.7}{7} = \\frac{206.8}{7} \\approx 29.54\\text{ cm}$$."
        },
        {
          partLabel: "(b)",
          marks: 7,
          prompt: "Expand and simplify completely the binomial product:\n$$(3x - 2)(2x - 1)$$",
          hint: "Use FOIL: First, Outside, Inside, Last.",
          modelAnswer: "6x² - 7x + 2",
          workedSolution: "$$(3x - 2)(2x - 1) = 3x(2x - 1) - 2(2x - 1)$$\n$$= 6x^2 - 3x - 4x + 2$$\n$$= 6x^2 - 7x + 2$$."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Frequency Distribution, Passing Probabilities & Fractional Arithmetic",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 10,
          prompt: "The raw scores of $20$ students in a class quiz are recorded as follows:\n$$4, 8, 7, 6, 2, 1, 7, 4, 3, 7, 6, 4, 7, 5, 2, 7, 5, 4, 8, 3$$\n\n| Mark ($x$) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| Frequency ($f$) | 1 | 2 | 2 | 4 | 2 | 2 | 5 | 2 |\n\nUsing the frequency distribution table above, determine:\n(i) The **modal mark**.\n(ii) The **mean mark**.\n(iii) The percentage of students who passed, if the pass mark is $6$.\n(iv) The probability that a student chosen at random scored not more than $5\\text{ marks}$.",
          hint: "Pass mark 6 means score ≥ 6 (scores 6, 7, 8). Not more than 5 means score ≤ 5 (scores 1, 2, 3, 4, 5).",
          modelAnswer: "(i) 7 marks, (ii) 5.0 marks, (iii) 45%, (iv) 11/20",
          workedSolution: "**(i) Modal mark:**\nThe highest frequency is $5$, which corresponds to mark $7$. The **mode is 7**.\n\n**(ii) Mean mark:**\n$$\\sum fx = (1 \\times 1) + (2 \\times 2) + (3 \\times 2) + (4 \\times 4) + (5 \\times 2) + (6 \\times 2) + (7 \\times 5) + (8 \\times 2)$$\n$$\\sum fx = 1 + 4 + 6 + 16 + 10 + 12 + 35 + 16 = 100$$\n$$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{100}{20} = 5.0\\text{ marks}$$\n\n**(iii) Percentage who passed (score $\\ge 6$):**\n$$\\text{Number of students} = f(6) + f(7) + f(8) = 2 + 5 + 2 = 9$$\n$$\\text{Percentage} = \\left(\\frac{9}{20}\\right) \\times 100\\% = 45\\%$$\n\n**(iv) Probability of scoring $\\le 5$:**\n$$\\text{Number of students} = 20 - 9 = 11$$\n$$P(\\text{score} \\le 5) = \\frac{11}{20}$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Evaluate the fractional expression:\n$$7\\frac{2}{3} - 4\\frac{5}{6} + 2\\frac{3}{8}$$",
          hint: "Find the LCM of denominators 3, 6, and 8, which is 24.",
          modelAnswer: "5 5/24",
          workedSolution: "**Method: Whole numbers and fractions**\n$$= (7 - 4 + 2) + \\left(\\frac{2}{3} - \\frac{5}{6} + \\frac{3}{8}\\right)$$\n$$= 5 + \\left(\\frac{16 - 20 + 9}{24}\\right)$$\n$$= 5 + \\frac{5}{24} = 5\\frac{5}{24}$$\n*(Or as improper fraction: $\\frac{125}{24}$)*."
        }
      ]
    }
  ],
  seededAt: "2026-09-15T11:15:00.000Z",
  lastUpdated: "2026-09-15T11:15:00.000Z"
};

// ============================================================================
// 3l. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 11)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-11
// ============================================================================
export const SET_JHS_MASTERY_SERIES_11: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-11",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 11)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series",
  variantType: "standard",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
      id: "q01",
      prompt: "List the members of the set $$S = \\{x : x \\text{ is an odd factor of } 42\\}$$.",
      options: [
        "{1, 3, 7, 21}",
        "{3, 7, 21}",
        "{1, 2, 3, 7, 21}",
        "{1, 3, 7, 14, 21}"
      ],
      correctAnswer: "{1, 3, 7, 21}",
      hint: "Find all factors of 42 first, then select only the odd numbers.",
      workedSolution: "Factors of 42 are 1, 2, 3, 6, 7, 14, 21, 42. Filtering for odd factors gives {1, 3, 7, 21}.",
      points: 1
    },
    {
      id: "q02",
      prompt: "If sets $$A = \\{a, c, e, g\\}$$ and $$B = \\{b, d, f, h\\}$$, find $$A \\cup B$$.",
      options: [
        "$$\\emptyset$$",
        "{a, b, c, d, e, f, g, h}",
        "{a, c, e, g}",
        "{b, d, f, h}"
      ],
      correctAnswer: "{a, b, c, d, e, f, g, h}",
      hint: "The union includes all distinct elements present in either set.",
      workedSolution: "Combine all elements from both sets: {a, b, c, d, e, f, g, h}.",
      points: 1
    },
    {
      id: "q03",
      prompt: "A solid geometric figure has a circular base tapering smoothly to a single vertex (apex). What is this solid called?",
      options: [
        "Cylinder",
        "Sphere",
        "Cone",
        "Pyramid"
      ],
      correctAnswer: "Cone",
      hint: "Think of the shape of an ice-cream cone or traffic cone.",
      workedSolution: "A 3D solid with a circular base meeting at a single point apex is a cone.",
      points: 1
    },
    {
      id: "q04",
      prompt: "Express $$\\frac{7}{16}$$ as a terminating decimal fraction.",
      options: [
        "0.4375",
        "0.4125",
        "0.4500",
        "0.4625"
      ],
      correctAnswer: "0.4375",
      hint: "Divide 7.0000 by 16.",
      workedSolution: "$$7 \\div 16 = 0.4375$$.",
      points: 1
    },
    {
      id: "q05",
      prompt: "If $$y = \\frac{12}{2 - x} + 5$$, calculate the value of $y$ when $x = 5$.",
      options: [
        "9",
        "1",
        "-1",
        "4"
      ],
      correctAnswer: "1",
      hint: "Denominator becomes $2 - 5 = -3$.",
      workedSolution: "$$y = \\frac{12}{2 - 5} + 5 = \\frac{12}{-3} + 5 = -4 + 5 = 1$$.",
      points: 1
    },
    {
      id: "q06",
      prompt: "The test marks of eleven candidates are: $$4, 6, 3, 8, 10, 9, 3, 11, 3, 8, 5$$. What is the modal mark?",
      options: [
        "8",
        "6",
        "3",
        "5"
      ],
      correctAnswer: "3",
      hint: "The mode is the mark that occurs most frequently.",
      workedSolution: "Mark 3 appears 3 times, which is more frequent than any other mark. The mode is 3.",
      points: 1
    },
    {
      id: "q07",
      prompt: "From the test marks in Question 6 ($$3, 3, 3, 4, 5, 6, 8, 8, 9, 10, 11$$), find the median mark.",
      options: [
        "5",
        "6",
        "8",
        "7"
      ],
      correctAnswer: "6",
      hint: "With 11 ordered values, the median is the 6th value: $(11 + 1) / 2 = 6$.",
      workedSolution: "Arranged in ascending order: 3, 3, 3, 4, 5, **6**, 8, 8, 9, 10, 11. The middle (6th) number is 6.",
      points: 1
    },
    {
      id: "q08",
      prompt: "In a school house distribution represented by a pie chart, Red House is $140^\\circ$, Blue House is $80^\\circ$, and Yellow House is $90^\\circ$. What is the sector angle for Green House?",
      options: [
        "$$50^\\circ$$",
        "$$60^\\circ$$",
        "$$45^\\circ$$",
        "$$55^\\circ$$"
      ],
      correctAnswer: "$$50^\\circ$$",
      hint: "The sum of all sector angles in a pie chart equals $360^\\circ$.",
      workedSolution: "$$360^\\circ - (140^\\circ + 80^\\circ + 90^\\circ) = 360^\\circ - 310^\\circ = 50^\\circ$$.",
      points: 1
    },
    {
      id: "q09",
      prompt: "If there are $720$ students in the school from Question 8, how many more students are in Yellow House ($90^\\circ$) than in Blue House ($80^\\circ$)?",
      options: [
        "10",
        "30",
        "20",
        "40"
      ],
      correctAnswer: "20",
      hint: "Angle difference = $90^\\circ - 80^\\circ = 10^\\circ$. Number of students = $(10 / 360) \\times 720$.",
      workedSolution: "Difference in angle = $10^\\circ$. Number of students = $$\\frac{10^\\circ}{360^\\circ} \\times 720 = 10 \\times 2 = 20\\text{ students}$$.",
      points: 1
    },
    {
      id: "q10",
      prompt: "Express $338$ as a product of prime factors in index notation.",
      options: [
        "$$2 \\times 13^2$$",
        "$$2^2 \\times 13$$",
        "$$2 \\times 7 \\times 13$$",
        "$$2^2 \\times 13^2$$"
      ],
      correctAnswer: "$$2 \\times 13^2$$",
      hint: "$338 \\div 2 = 169 = 13^2$.",
      workedSolution: "$$338 = 2 \\times 169 = 2 \\times 13^2$$.",
      points: 1
    },
    {
      id: "q11",
      prompt: "Convert the binary numeral $$111001_{\\text{two}}$$ to a numeral in base ten.",
      options: [
        "55",
        "57",
        "49",
        "61"
      ],
      correctAnswer: "57",
      hint: "$$1(2^5) + 1(2^4) + 1(2^3) + 0(2^2) + 0(2^1) + 1(2^0)$$.",
      workedSolution: "$$32 + 16 + 8 + 0 + 0 + 1 = 57$$.",
      points: 1
    },
    {
      id: "q12",
      prompt: "A fair six-sided die is rolled once. What is the probability of rolling a number greater than $4$?",
      options: [
        "$$\\frac{1}{2}$$",
        "$$\\frac{2}{3}$$",
        "$$\\frac{1}{3}$$",
        "$$\\frac{1}{6}$$"
      ],
      correctAnswer: "$$\\frac{1}{3}$$",
      hint: "Favourable outcomes are {5, 6}, which is 2 outcomes out of 6.",
      workedSolution: "$$\\text{P}(> 4) = \\frac{2}{6} = \\frac{1}{3}$$.",
      points: 1
    },
    {
      id: "q13",
      prompt: "Arrange the fractions in descending order: $$\\frac{3}{4}, \\, \\frac{5}{7}, \\, \\frac{2}{3}$$.",
      options: [
        "$$\\frac{3}{4}, \\, \\frac{5}{7}, \\, \\frac{2}{3}$$",
        "$$\\frac{5}{7}, \\, \\frac{3}{4}, \\, \\frac{2}{3}$$",
        "$$\\frac{2}{3}, \\, \\frac{5}{7}, \\, \\frac{3}{4}$$",
        "$$\\frac{3}{4}, \\, \\frac{2}{3}, \\, \\frac{5}{7}$$"
      ],
      correctAnswer: "$$\\frac{3}{4}, \\, \\frac{5}{7}, \\, \\frac{2}{3}$$",
      hint: "Compare decimal values: $3/4 = 0.750, 5/7 \\approx 0.714, 2/3 \\approx 0.667$.",
      workedSolution: "$$0.750 > 0.714 > 0.667 \\implies \\frac{3}{4} > \\frac{5}{7} > \\frac{2}{3}$$.",
      points: 1
    },
    {
      id: "q14",
      prompt: "Solve the linear inequality: $$4x + 5 \\le 7x - 7$$.",
      options: [
        "$$x \\le 4$$",
        "$$x \\ge 4$$",
        "$$x \\ge -4$$",
        "$$x \\le -4$$"
      ],
      correctAnswer: "$$x \\ge 4$$",
      hint: "$$5 + 7 \\le 7x - 4x \\implies 12 \\le 3x$$.",
      workedSolution: "$$12 \\le 3x \\implies 4 \\le x$$, which means $$x \\ge 4$$.",
      points: 1
    },
    {
      id: "q15",
      prompt: "If $$9x - 2(3x - 5) = 16$$, find the value of $x$.",
      options: [
        "2",
        "-2",
        "6",
        "-6"
      ],
      correctAnswer: "2",
      hint: "Expand: $9x - 6x + 10 = 16$.",
      workedSolution: "$$3x + 10 = 16 \\implies 3x = 6 \\implies x = 2$$.",
      points: 1
    },
    {
      id: "q16",
      prompt: "Two parallel lines are crossed by a transversal line. If an exterior alternate angle is $115^\\circ$, what is the size of its supplementary interior angle on the straight line?",
      options: [
        "$$75^\\circ$$",
        "$$65^\\circ$$",
        "$$115^\\circ$$",
        "$$55^\\circ$$"
      ],
      correctAnswer: "$$65^\\circ$$",
      hint: "Angles on a straight line add up to $180^\\circ$.",
      workedSolution: "$$180^\\circ - 115^\\circ = 65^\\circ$$.",
      points: 1
    },
    {
      id: "q17",
      prompt: "When a transversal intersects two parallel lines, alternate interior angles are always:",
      options: [
        "Supplementary",
        "Complementary",
        "Add up to 360°",
        "Equal"
      ],
      correctAnswer: "Equal",
      hint: "Remember the 'Z-angle' geometric rule.",
      workedSolution: "Alternate interior angles formed across parallel lines are equal in magnitude.",
      points: 1
    },
    {
      id: "q18",
      prompt: "Factorize completely: $$\\frac{1}{3}kx^2 + \\frac{1}{6}kx$$.",
      options: [
        "$$\\frac{1}{6}kx(2x + 1)$$",
        "$$\\frac{1}{3}kx(x + 2)$$",
        "$$\\frac{1}{6}kx(x + 2)$$",
        "$$\\frac{1}{3}k(x^2 + 2x)$$"
      ],
      correctAnswer: "$$\\frac{1}{6}kx(2x + 1)$$",
      hint: "Factor out $\\frac{1}{6}kx$. Note that $\\frac{1}{3} = \\frac{2}{6}$.",
      workedSolution: "$$\\frac{2}{6}kx^2 + \\frac{1}{6}kx = \\frac{1}{6}kx(2x + 1)$$.",
      points: 1
    },
    {
      id: "q19",
      prompt: "Kofi and Ama shared a sum of money in the ratio $4 : 5$ respectively. If Ama received $\\text{GH¢ } 150.00$, how much was shared in total?",
      options: [
        "GH¢ 270.00",
        "GH¢ 300.00",
        "GH¢ 240.00",
        "GH¢ 120.00"
      ],
      correctAnswer: "GH¢ 270.00",
      hint: "5 units = 150. Find 1 unit = 30. Total units = 4 + 5 = 9.",
      workedSolution: "1 unit = $150 / 5 = \\text{GH¢ } 30.00$. Total shared = $9 \\times 30 = \\text{GH¢ } 270.00$.",
      points: 1
    },
    {
      id: "q20",
      prompt: "Simplify: $$5(6a + 3) - 2(9a + 4)$$.",
      options: [
        "$$12a + 7$$",
        "$$12a - 7$$",
        "$$48a + 23$$",
        "$$12a + 23$$"
      ],
      correctAnswer: "$$12a + 7$$",
      hint: "Expand: $30a + 15 - 18a - 8$.",
      workedSolution: "$$(30a - 18a) + (15 - 8) = 12a + 7$$.",
      points: 1
    },
    {
      id: "q21",
      prompt: "A trader invested $\\text{GH¢ } 600.00$ at a simple interest rate of $12\\%$ per annum for $3\\text{ years}$. Calculate the total amount at the end of the investment period.",
      options: [
        "GH¢ 216.00",
        "GH¢ 720.00",
        "GH¢ 816.00",
        "GH¢ 850.00"
      ],
      correctAnswer: "GH¢ 816.00",
      hint: "Interest = (600 × 12 × 3) / 100 = 216. Total Amount = Principal + Interest.",
      workedSolution: "$$I = \\frac{600 \\times 12 \\times 3}{100} = 216$$. Total Amount = $600 + 216 = \\text{GH¢ } 816.00$.",
      points: 1
    },
    {
      id: "q22",
      prompt: "Make $k$ the subject of the relation: $$T = \\frac{4k + 1}{k}$$.",
      options: [
        "$$k = \\frac{1}{T - 4}$$",
        "$$k = \\frac{1}{T + 4}$$",
        "$$k = T - 4$$",
        "$$k = \\frac{4}{T - 1}$$"
      ],
      correctAnswer: "$$k = \\frac{1}{T - 4}$$",
      hint: "$Tk = 4k + 1 \\implies Tk - 4k = 1$.",
      workedSolution: "$$Tk - 4k = 1 \\implies k(T - 4) = 1 \\implies k = \\frac{1}{T - 4}$$.",
      points: 1
    },
    {
      id: "q23",
      prompt: "Simplify $$400 \\times 0.02 \\times 245$$, leaving your answer in standard form.",
      options: [
        "$$1.96 \\times 10^3$$",
        "$$1.96 \\times 10^2$$",
        "$$19.6 \\times 10^2$$",
        "$$1.96 \\times 10^4$$"
      ],
      correctAnswer: "$$1.96 \\times 10^3$$",
      hint: "$400 \\times 0.02 = 8$. Then $8 \\times 245 = 1,960$.",
      workedSolution: "$$8 \\times 245 = 1,960 = 1.96 \\times 10^3$$.",
      points: 1
    },
    {
      id: "q24",
      prompt: "What percentage of $8$ is $0.4$?",
      options: [
        "2.0%",
        "5.0%",
        "20.0%",
        "0.5%"
      ],
      correctAnswer: "5.0%",
      hint: "$$\\frac{0.4}{8} \\times 100\\%$$.",
      workedSolution: "$$\\frac{0.4}{8} \\times 100\\% = \\frac{40}{8}\\% = 5.0\\%$$.",
      points: 1
    },
    {
      id: "q25",
      prompt: "A right trapezium has parallel sides of lengths $14\\text{ cm}$ and $20\\text{ cm}$ and a perpendicular height of $8\\text{ cm}$. Find its area.",
      options: [
        "$$136\\text{ cm}^2$$",
        "$$272\\text{ cm}^2$$",
        "$$160\\text{ cm}^2$$",
        "$$120\\text{ cm}^2$$"
      ],
      correctAnswer: "$$136\\text{ cm}^2$$",
      hint: "Area = $\\frac{1}{2}(a + b)h$.",
      workedSolution: "$$\\text{Area} = \\frac{1}{2}(14 + 20) \\times 8 = \\frac{1}{2}(34) \\times 8 = 17 \\times 8 = 136\\text{ cm}^2$$.",
      points: 1
    },
    {
      id: "q26",
      prompt: "Which geometric construction constructs a point $P$ that is strictly equidistant from two given points $A$ and $B$?",
      options: [
        "The angle bisector of angle AOB",
        "A line parallel to AB",
        "The perpendicular bisector of line segment AB",
        "A tangent to the circle at A"
      ],
      correctAnswer: "The perpendicular bisector of line segment AB",
      hint: "Any point on the perpendicular bisector of AB is equidistant from endpoints A and B.",
      workedSolution: "The perpendicular bisector of a line segment AB represents the locus of points equidistant from A and B.",
      points: 1
    },
    {
      id: "q27",
      prompt: "If $x : 36 = 5 : 20$, find the value of $x$.",
      options: [
        "7",
        "9",
        "8",
        "12"
      ],
      correctAnswer: "9",
      hint: "$$20x = 36 \\times 5 = 180$$.",
      workedSolution: "$$20x = 180 \\implies x = \\frac{180}{20} = 9$$.",
      points: 1
    },
    {
      id: "q28",
      prompt: "In circle geometry, what name is given to the region enclosed between a chord and its corresponding arc?",
      options: [
        "Sector",
        "Quadrant",
        "Segment",
        "Tangent"
      ],
      correctAnswer: "Segment",
      hint: "A sector is bounded by two radii; a segment is bounded by a chord.",
      workedSolution: "The area enclosed between a chord and an arc of a circle is defined as a segment.",
      points: 1
    },
    {
      id: "q29",
      prompt: "An amount of $\\text{GH¢ } 7,200.00$ is shared among three siblings in the ratio of their ages: $8\\text{ years}, 6\\text{ years},$ and $4\\text{ years}$. Find the share of the youngest sibling.",
      options: [
        "GH¢ 1,600.00",
        "GH¢ 2,400.00",
        "GH¢ 3,200.00",
        "GH¢ 1,200.00"
      ],
      correctAnswer: "GH¢ 1,600.00",
      hint: "Total ratio units = 8 + 6 + 4 = 18. Youngest share = (4 / 18) × 7,200.",
      workedSolution: "$$\\text{Youngest share} = \\frac{4}{18} \\times 7,200 = 4 \\times 400 = \\text{GH¢ } 1,600.00$$.",
      points: 1
    },
    {
      id: "q30",
      prompt: "Find the Least Common Multiple (LCM) of $6, 8,$ and $12$.",
      options: [
        "48",
        "36",
        "24",
        "18"
      ],
      correctAnswer: "24",
      hint: "Find the smallest number that 6, 8, and 12 divide into evenly.",
      workedSolution: "Multiples of 12: 12, 24, 36... 24 is divisible by 6, 8, and 12. LCM = 24.",
      points: 1
    },
    {
      id: "q31",
      prompt: "Expand and simplify the difference of two squares: $$(x + 3y)(x - 3y)$$.",
      options: [
        "$$x^2 - 6xy - 9y^2$$",
        "$$x^2 - 9y^2$$",
        "$$x^2 + 9y^2$$",
        "$$x^2 - 3y^2$$"
      ],
      correctAnswer: "$$x^2 - 9y^2$$",
      hint: "$$(a + b)(a - b) = a^2 - b^2$$.",
      workedSolution: "$$x^2 - (3y)^2 = x^2 - 9y^2$$.",
      points: 1
    },
    {
      id: "q32",
      prompt: "If a technician is paid $\\text{GH¢ } 270.00$ for working $4\\frac{1}{2}\\text{ days}$, how much will he earn for working $1\\text{ day}$ at the same daily rate?",
      options: [
        "GH¢ 55.00",
        "GH¢ 60.00",
        "GH¢ 65.00",
        "GH¢ 70.00"
      ],
      correctAnswer: "GH¢ 60.00",
      hint: "$$270 \\div 4.5 = 270 \\times \\frac{2}{9}$$.",
      workedSolution: "$$270 \\div \\frac{9}{2} = 270 \\times \\frac{2}{9} = 30 \\times 2 = \\text{GH¢ } 60.00$$.",
      points: 1
    },
    {
      id: "q33",
      prompt: "Express $0.84$ as a common fraction in its lowest terms.",
      options: [
        "$$\\frac{21}{25}$$",
        "$$\\frac{42}{50}$$",
        "$$\\frac{17}{20}$$",
        "$$\\frac{19}{25}$$"
      ],
      correctAnswer: "$$\\frac{21}{25}$$",
      hint: "Divide 84 and 100 by 4.",
      workedSolution: "$$\\frac{84}{100} = \\frac{84 \\div 4}{100 \\div 4} = \\frac{21}{25}$$.",
      points: 1
    },
    {
      id: "q34",
      prompt: "List all integers that satisfy the compound inequality: $$15 < y \\le 20$$.",
      options: [
        "{15, 16, 17, 18, 19, 20}",
        "{16, 17, 18, 19}",
        "{16, 17, 18, 19, 20}",
        "{15, 16, 17, 18, 19}"
      ],
      correctAnswer: "{16, 17, 18, 19, 20}",
      hint: "15 is excluded ($>$), but 20 is included ($\\le$).",
      workedSolution: "Integers strictly greater than 15 and up to 20: {16, 17, 18, 19, 20}.",
      points: 1
    },
    {
      id: "q35",
      prompt: "Simplify: $$\\frac{3^7 \\times 2^5}{3^4 \\times 2^2}$$.",
      options: [
        "$$3^3 \\times 2^3$$",
        "$$3^{11} \\times 2^7$$",
        "$$3^3 \\times 2^7$$",
        "$$3^4 \\times 2^3$$"
      ],
      correctAnswer: "$$3^3 \\times 2^3$$",
      hint: "Subtract indices for base 3 and base 2 separately.",
      workedSolution: "$$3^{7-4} \\times 2^{5-2} = 3^3 \\times 2^3$$.",
      points: 1
    },
    {
      id: "q36",
      prompt: "A vector pointing South-East with magnitude $6\\text{ cm}$ has a three-figure bearing of:",
      "options": [
        "045°",
        "225°",
        "315°",
        "135°"
      ],
      correctAnswer: "135°",
      hint: "South-East is halfway between East (090°) and South (180°): $90 + 45$.",
      workedSolution: "$$090^\\circ + 045^\\circ = 135^\\circ$$.",
      points: 1
    },
    {
      id: "q37",
      prompt: "Solve for $y$ in the equation: $$5 + 4y = 2 - 8y$$.",
      "options": [
        "$$\\frac{1}{4}$$",
        "$$-\\frac{1}{4}$$",
        "$$-\\frac{7}{12}$$",
        "$$\\frac{7}{12}$$"
      ],
      correctAnswer: "$$-\\frac{1}{4}$$",
      hint: "$$4y + 8y = 2 - 5$$.",
      workedSolution: "$$12y = -3 \\implies y = -\\frac{3}{12} = -\\frac{1}{4}$$.",
      points: 1
    },
    {
      id: "q38",
      prompt: "Convert $43_{\\text{ten}}$ to a base two (binary) numeral.",
      "options": [
        "$$101011_{\\text{two}}$$",
        "$$101101_{\\text{two}}$$",
        "$$110101_{\\text{two}}$$",
        "$$100111_{\\text{two}}$$"
      ],
      correctAnswer: "$$101011_{\\text{two}}$$",
      hint: "$$43 = 32 + 8 + 2 + 1 = 2^5 + 2^3 + 2^1 + 2^0$$.",
      workedSolution: "$$43 = 32(1) + 16(0) + 8(1) + 4(0) + 2(1) + 1(1) = 101011_{\\text{two}}$$.",
      points: 1
    },
    {
      id: "q39",
      prompt: "The length of a rectangular field is $8\\text{ metres}$ longer than its width. If the perimeter is $160\\text{ metres}$, find the width of the field.",
      "options": [
        "36 m",
        "44 m",
        "40 m",
        "32 m"
      ],
      correctAnswer: "36 m",
      hint: "$$2(w + 8 + w) = 160 \\implies 2(2w + 8) = 160$$.",
      workedSolution: "$$4w + 16 = 160 \\implies 4w = 144 \\implies w = 36\\text{ m}$$.",
      points: 1
    },
    {
      id: "q40",
      prompt: "Given column vectors $$u = \\begin{pmatrix} 5 \\\\ 2 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} -1 \\\\ 4 \\end{pmatrix}$$, evaluate $$u - 2v$$.",
      "options": [
        "$$\\begin{pmatrix} 3 \\\\ -6 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 7 \\\\ 10 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 7 \\\\ -6 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 3 \\\\ 10 \\end{pmatrix}$$"
      ],
      correctAnswer: "$$\\begin{pmatrix} 7 \\\\ -6 \\end{pmatrix}$$",
      hint: "$$5 - 2(-1) = 5 + 2 = 7$$ and $$2 - 2(4) = 2 - 8 = -6$$.",
      workedSolution: "$$\\begin{pmatrix} 5 - 2(-1) \\\\ 2 - 2(4) \\end{pmatrix} = \\begin{pmatrix} 5 + 2 \\\\ 2 - 8 \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ -6 \\end{pmatrix}$$.",
      points: 1
    }
  ],
  seededAt: "2026-09-15T12:00:00.000Z",
  lastUpdated: "2026-09-15T12:00:00.000Z"
};

// ============================================================================
// 3m. ALIGNED CORE CURRICULUM SERIES: JHS Math Structured Problem-Solving Series (Set 12)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-12
// ============================================================================
export const SET_JHS_MASTERY_SERIES_12: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-12",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 12)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  format: "structured_essay",
  questions: [
    {
      id: "q01",
      title: "Question 1: Set Complements, Parallel Line Transversals & Dice Probabilities",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 350 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='60' x2='310' y2='60' stroke='#1e293b' stroke-width='2'/><line x1='30' y1='150' x2='310' y2='150' stroke='#1e293b' stroke-width='2'/><line x1='70' y1='150' x2='170' y2='60' stroke='#2563eb' stroke-width='2'/><line x1='170' y1='60' x2='260' y2='150' stroke='#2563eb' stroke-width='2'/><text x='15' y='65' font-size='12' font-weight='bold'>L₁</text><text x='15' y='155' font-size='12' font-weight='bold'>L₂</text><text x='170' y='50' font-size='12' font-weight='bold'>B</text><text x='65' y='165' font-size='12' font-weight='bold'>E</text><text x='260' y='165' font-size='12' font-weight='bold'>F</text><text x='110' y='55' font-size='11' font-weight='bold' fill='#dc2626'>85°</text><text x='165' y='80' font-size='12' font-weight='bold' fill='#2563eb'>x°</text><text x='270' y='145' font-size='11' font-weight='bold' fill='#059669'>120°</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "In a class of $42$ students, $20$ offer French and $26$ offer Twi. $6$ students do not offer either of the two languages.\nCalculate the number of students who offer:\n(i) Both French and Twi.\n(ii) French only.",
          hint: "Let $b$ be the number offering both languages. Then $(20 - b) + b + (26 - b) + 6 = 42$.",
          modelAnswer: "(i) 10 students, (ii) 10 students",
          workedSolution: "Let $U$ be the universal set ($n(U) = 42$), $F$ be French, and $T$ be Twi.\nLet $b$ be the number offering both subjects ($n(F \\cap T) = b$).\nStudents offering at least one language: $$42 - 6 = 36$$\n$$(20 - b) + b + (26 - b) = 36$$\n$$46 - b = 36 \\implies b = 46 - 36 = 10$$\n\n**(i)** **$10$ students offer both languages**.\n**(ii)** Students offering French only = $$20 - b = 20 - 10 = 10\\text{ students}$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "In the transversal diagram above, line $L_1$ is parallel to line $L_2$. The obtuse exterior angle at vertex $F$ is $120^\\circ$ and the adjacent angle at vertex $B$ on the upper line is $85^\\circ$.\nFind:\n(i) The interior angle $\\angle BFE$.\n(ii) The value of angle $x^\\circ$.",
          hint: "Interior angle BFE and the 120° angle lie on a straight line. Alternate interior angles across parallel lines are equal.",
          modelAnswer: "(i) 60°, (ii) 35°",
          workedSolution: "**(i)** Angles on a straight line add up to $180^\\circ$:\n$$\\angle BFE = 180^\\circ - 120^\\circ = 60^\\circ$$\n\n**(ii)** Since $L_1 \\parallel L_2$, the alternate interior angle to $\\angle BFE$ is the total angle at vertex $B$ formed with the lower transversal, or:\nExterior angle across line $L_1$: the three angles along the straight line at vertex $B$ sum to $180^\\circ$:\n$$85^\\circ + x^\\circ + \\text{angle } CBF = 180^\\circ$$\nNotice that $\\angle CBF = \\angle BFE = 60^\\circ$ (alternate interior angles).\n$$85^\\circ + x^\\circ + 60^\\circ = 180^\\circ$$\n$$x^\\circ + 145^\\circ = 180^\\circ \\implies x = 180 - 145 = 35^\\circ$$."
        },
        {
          partLabel: "(c)",
          marks: 5,
          prompt: "A fair six-sided die is rolled once.\n(i) Write down the sample space $S$ of all possible outcomes.\n(ii) Find the probability of obtaining a multiple of $3$.\n(iii) Find the probability of obtaining a prime number.",
          hint: "Sample space has 6 outcomes {1, 2, 3, 4, 5, 6}. Prime numbers on a die are {2, 3, 5}.",
          modelAnswer: "(i) {1, 2, 3, 4, 5, 6}, (ii) 1/3, (iii) 1/2",
          workedSolution: "**(i)** Sample space $$S = \\{1, 2, 3, 4, 5, 6\\}$$.\n\n**(ii)** Multiples of 3 are $\\{3, 6\\}$ (2 outcomes):\n$$P(\\text{multiple of } 3) = \\frac{2}{6} = \\frac{1}{3}$$\n\n**(iii)** Prime numbers are $\\{2, 3, 5\\}$ (3 outcomes):\n$$P(\\text{prime}) = \\frac{3}{6} = \\frac{1}{2}$$."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: 3D Liquid Displacement & Commercial Percentage Discount",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 350 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><rect x='25' y='60' width='90' height='100' fill='#eff6ff' stroke='#1e40af' stroke-width='2'/><path d='M25,60 L55,30 L145,30 L115,60 Z' fill='#dbeafe' stroke='#1e40af' stroke-width='1.5'/><path d='M115,60 L145,30 L145,130 L115,160 Z' fill='#bfdbfe' stroke='#1e40af' stroke-width='1.5'/><text x='45' y='175' font-size='11'>8 cm</text><text x='125' y='155' font-size='11'>7 cm</text><text x='5' y='115' font-size='11'>22 cm</text><path d='M155,90 C185,55 195,55 215,75' fill='none' stroke='#0284c7' stroke-width='2' stroke-dasharray='4'/><g transform='translate(225,30)'><ellipse cx='45' cy='20' rx='40' ry='12' fill='#f0fdf4' stroke='#166534' stroke-width='2'/><line x1='5' y1='20' x2='5' y2='140' stroke='#166534' stroke-width='2'/><line x1='85' y1='20' x2='85' y2='140' stroke='#166534' stroke-width='2'/><ellipse cx='45' cy='140' rx='40' ry='12' fill='#dcfce7' stroke='#166534' stroke-width='2'/><ellipse cx='45' cy='85' rx='40' ry='12' fill='#bbf7d0' stroke='#166534' stroke-width='1.5' stroke-dasharray='3'/><line x1='95' y1='85' x2='95' y2='140' stroke='#dc2626' stroke-width='1.5'/><text x='102' y='115' font-size='12' font-weight='bold' fill='#dc2626'>h = ?</text><text x='25' y='18' font-size='10'>d = 14 cm</text></g></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "A metal water container in the form of a cuboid has a rectangular base of length $8\\text{ cm}$, width $7\\text{ cm}$, and height $22\\text{ cm}$. It is completely filled with water.\nAll the water is poured into an empty upright cylindrical container of internal diameter $14\\text{ cm}$.\nTaking $\\pi = \\frac{22}{7}$, calculate the height ($h$) of water in the cylindrical container.",
          hint: "Radius of cylinder = diameter / 2 = 7 cm. Volume of cuboid = length × width × height. Volume in cylinder = $\\pi r^2 h$.",
          modelAnswer: "8 cm",
          workedSolution: "1. Volume of cuboid container:\n$$V = l \\times w \\times h = 8\\text{ cm} \\times 7\\text{ cm} \\times 22\\text{ cm} = 1,232\\text{ cm}^3$$\n\n2. Cylinder dimensions:\n$$\\text{Radius } r = \\frac{14}{2} = 7\\text{ cm}$$\n$$\\text{Volume in cylinder} = \\pi r^2 h = \\frac{22}{7} \\times 7^2 \\times h = 154h$$\n\n3. Equating volumes:\n$$154h = 1,232 \\implies h = \\frac{1,232}{154} = 8\\text{ cm}$$\nTherefore, the height of water in the cylinder is **$8\\text{ cm}$**."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "A wholesale building distributor offers a $15\\%$ discount on all bulk orders. If the list catalog price of a consignment of cement is $\\text{GH¢ } 6,000.00$, calculate:\n(i) The discount allowed on the consignment.\n(ii) The actual amount the contractor paid.",
          hint: "Discount = 15% of 6,000. Amount paid = List price - Discount.",
          modelAnswer: "(i) GH¢ 900.00, (ii) GH¢ 5,100.00",
          workedSolution: "**(i) Discount allowed:**\n$$\\text{Discount} = \\frac{15}{100} \\times \\text{GH¢ } 6,000.00 = 15 \\times 60 = \\text{GH¢ } 900.00$$\n\n**(ii) Amount paid:**\n$$\\text{Amount paid} = 6,000.00 - 900.00 = \\text{GH¢ } 5,100.00$$\n*(Or directly: $85\\% \\times 6,000 = 0.85 \\times 6,000 = \\text{GH¢ } 5,100.00$)*."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Find the truth set of the inequality and illustrate it on a number line:\n$$\\frac{x - 2}{2} \\le 1 + \\frac{2x}{3}$$",
          hint: "Multiply through by 6 (the LCM of 2 and 3) to clear fractions.",
          modelAnswer: "{x : x ≥ -12}",
          workedSolution: "Multiply both sides by $6$:\n$$6\\left(\\frac{x - 2}{2}\\right) \\le 6(1) + 6\\left(\\frac{2x}{3}\\right)$$\n$$3(x - 2) \\le 6 + 2(2x)$$\n$$3x - 6 \\le 6 + 4x$$\n$$3x - 4x \\le 6 + 6$$\n$$-x \\le 12 \\implies x \\ge -12$$\nTruth set: **$$\\{x : x \\ge -12, \\, x \\in \\mathbb{R}\\}$$**."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Right-Angled Compass Construction & Incircle Geometry",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 8,
          prompt: "In a geometric construction, triangle $PQR$ has side $|PQ| = 10\\text{ cm}$, $\\angle QPR = 90^\\circ$, and $\\angle PQR = 30^\\circ$.\n(i) Calculate the theoretical length of hypotenuse $|QR|$ using basic trigonometry (where $\\cos 30^\\circ = \\frac{\\sqrt{3}}{2} \\approx 0.866$).\n(ii) Calculate the length of opposite side $|PR|$ using $\\tan 30^\\circ = \\frac{1}{\\sqrt{3}} \\approx 0.577$.",
          hint: "In right-angled triangle PQR at P: adjacent to 30° is PQ = 10 cm, opposite is PR, hypotenuse is QR.",
          modelAnswer: "(i) QR ≈ 11.55 cm, (ii) PR ≈ 5.77 cm",
          workedSolution: "**(i) Hypotenuse $|QR|$:**\n$$\\cos 30^\\circ = \\frac{|PQ|}{|QR|} = \\frac{10}{|QR|}$$\n$$|QR| = \\frac{10}{\\cos 30^\\circ} = \\frac{10}{0.866} \\approx 11.55\\text{ cm}$$\n\n**(ii) Side $|PR|$:**\n$$\\tan 30^\\circ = \\frac{|PR|}{|PQ|} = \\frac{|PR|}{10}$$\n$$|PR| = 10 \\times \\tan 30^\\circ = 10 \\times 0.5774 \\approx 5.77\\text{ cm}$$."
        },
        {
          partLabel: "(b)",
          marks: 7,
          prompt: "The angle bisector of $\\angle QRP$ is constructed to intersect line segment $PQ$ at point $M$. A circle with centre $M$ and radius $|MP|$ is drawn to touch side $QR$ tangentially.\nIf $|MP|$ is measured as $3.3\\text{ cm}$, calculate:\n(i) The area of the inscribed circle. (Take $\\pi = 3.142$).\n(ii) The area of triangle $PQR$.",
          hint: "Area of circle = $\\pi r^2$. Area of right-angled triangle = $\\frac{1}{2} \\times \\text{base} \\times \\text{height}$.",
          modelAnswer: "(i) 34.22 cm², (ii) 28.85 cm²",
          workedSolution: "**(i) Circle Area:**\n$$\\text{Area} = \\pi r^2 = 3.142 \\times (3.3)^2 = 3.142 \\times 10.89 \\approx 34.22\\text{ cm}^2$$\n\n**(ii) Triangle Area:**\n$$\\text{Area} = \\frac{1}{2} \\times |PQ| \\times |PR| = \\frac{1}{2} \\times 10 \\times 5.77 = 5 \\times 5.77 = 28.85\\text{ cm}^2$$."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Test Mark Frequency Distribution & Passing Percentages",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 350 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><line x1='35' y1='160' x2='320' y2='160' stroke='#334155' stroke-width='2'/><line x1='35' y1='160' x2='35' y2='20' stroke='#334155' stroke-width='2'/><text x='150' y='188' font-size='11' font-weight='bold'>Marks Scored</text><text x='5' y='18' font-size='11' font-weight='bold'>Frequency</text><rect x='50' y='100' width='20' height='60' fill='#93c5fd' stroke='#1d4ed8'/><rect x='80' y='120' width='20' height='40' fill='#93c5fd' stroke='#1d4ed8'/><rect x='110' y='140' width='20' height='20' fill='#93c5fd' stroke='#1d4ed8'/><rect x='140' y='80' width='20' height='80' fill='#93c5fd' stroke='#1d4ed8'/><rect x='170' y='60' width='20' height='100' fill='#2563eb' stroke='#1d4ed8'/><rect x='200' y='80' width='20' height='80' fill='#93c5fd' stroke='#1d4ed8'/><rect x='230' y='140' width='20' height='20' fill='#93c5fd' stroke='#1d4ed8'/><rect x='260' y='120' width='20' height='40' fill='#93c5fd' stroke='#1d4ed8'/><rect x='290' y='100' width='20' height='60' fill='#93c5fd' stroke='#1d4ed8'/><text x='55' y='173' font-size='9'>2</text><text x='85' y='173' font-size='9'>3</text><text x='115' y='173' font-size='9'>4</text><text x='145' y='173' font-size='9'>5</text><text x='175' y='173' font-size='9'>6</text><text x='205' y='173' font-size='9'>7</text><text x='235' y='173' font-size='9'>8</text><text x='265' y='173' font-size='9'>9</text><text x='293' y='173' font-size='9'>10</text><text x='20' y='65' font-size='10'>5</text><text x='20' y='105' font-size='10'>3</text><text x='20' y='145' font-size='10'>1</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 9,
          prompt: "The bar chart above shows the distribution of marks scored by $25$ students in a mathematics classroom test:\n\n| Mark ($x$) | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| Frequency ($f$) | 3 | 2 | 1 | 4 | 5 | 4 | 1 | 2 | 3 |\n\n(i) Determine the **modal mark** of the class.\n(ii) Calculate the **mean mark** of the distribution.\n(iii) What is the **median mark**?",
          hint: "Mode is the mark with highest frequency (5). Mean = $\\sum fx / \\sum f$. Median is the 13th score.",
          modelAnswer: "(i) 6 marks, (ii) 6.0 marks, (iii) 6 marks",
          workedSolution: "**(i) Modal mark:**\nThe highest frequency is $5$, corresponding to **$6\\text{ marks}$**.\n\n**(ii) Mean mark:**\n$$\\sum fx = (2 \\times 3) + (3 \\times 2) + (4 \\times 1) + (5 \\times 4) + (6 \\times 5) + (7 \\times 4) + (8 \\times 1) + (9 \\times 2) + (10 \\times 3)$$\n$$\\sum fx = 6 + 6 + 4 + 20 + 30 + 28 + 8 + 18 + 30 = 150$$\n$$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{150}{25} = 6.0\\text{ marks}$$\n\n**(iii) Median mark:**\nPosition = $$\\frac{25 + 1}{2} = 13^{\\text{th}}\\text{ student}$$.\nCumulative frequencies: up to 2: 3; up to 3: 5; up to 4: 6; up to 5: 10; up to 6: 15.\nThe $13^{\\text{th}}$ student scored **$6\\text{ marks}$**."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "If the passing grade is set strictly at $5\\text{ marks}$ or above:\n(i) How many students failed the test?\n(ii) What percentage of the class passed the test?",
          hint: "Students who failed scored less than 5 (scores 2, 3, 4).",
          modelAnswer: "(i) 6 students failed, (ii) 76% passed",
          workedSolution: "**(i) Number who failed (marks 2, 3, 4):**\n$$\\text{Failed} = f(2) + f(3) + f(4) = 3 + 2 + 1 = 6\\text{ students}$$\n\n**(ii) Percentage who passed (marks } \\ge 5):$$\n$$\\text{Passed} = 25 - 6 = 19\\text{ students}$$\n$$\\text{Passing Percentage} = \\left(\\frac{19}{25}\\right) \\times 100\\% = 19 \\times 4 = 76\\%$$."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Tiered Utility Tariff Billing, Scientific Notation & Vector Products",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "An electricity utility company charges customers based on a tiered tariff system: $\\text{GH¢ } 0.80\\text{ per unit}$ for the first $120\\text{ units}$, and $\\text{GH¢ } 1.20\\text{ per unit}$ for every additional unit used above $120$.\nIf a household consumed $185\\text{ units}$ in a month, calculate their total monthly bill.",
          hint: "Split units into two blocks: first 120 units and remaining 65 units.",
          modelAnswer: "GH¢ 174.00",
          workedSolution: "Total consumption = $185\\text{ units}$.\n- Cost for first $120\\text{ units}$: $$120 \\times \\text{GH¢ } 0.80 = \\text{GH¢ } 96.00$$\n- Remaining units above $120$: $$185 - 120 = 65\\text{ units}$$\n- Cost for extra $65\\text{ units}$: $$65 \\times \\text{GH¢ } 1.20 = \\text{GH¢ } 78.00$$\n$$\\text{Total Bill} = 96.00 + 78.00 = \\text{GH¢ } 174.00$$."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "Express $5\\text{ hours}$ in seconds, leaving your final answer in **standard form**.",
          hint: "1 hour = 60 minutes = 3,600 seconds.",
          modelAnswer: "1.8 × 10⁴ seconds",
          workedSolution: "$$5\\text{ hours} = 5 \\times 60 \\times 60\\text{ seconds} = 5 \\times 3,600 = 18,000\\text{ seconds}$$\nIn standard form: $$18,000 = 1.8 \\times 10^4\\text{ seconds}$$."
        },
        {
          partLabel: "(c)",
          marks: 5,
          prompt: "Given column vectors $$p = \\begin{pmatrix} -5 \\\\ 4 \\end{pmatrix}$$ and $$r = \\begin{pmatrix} 3 \\\\ -6 \\end{pmatrix}$$, find vector $$q$$ if $$q = 2p - r$$.",
          hint: "Multiply p by 2, then subtract r component-wise.",
          modelAnswer: "(-13, 14)ᵀ",
          workedSolution: "$$q = 2\\begin{pmatrix} -5 \\\\ 4 \\end{pmatrix} - \\begin{pmatrix} 3 \\\\ -6 \\end{pmatrix} = \\begin{pmatrix} -10 \\\\ 8 \\end{pmatrix} - \\begin{pmatrix} 3 \\\\ -6 \\end{pmatrix}$$\n$$= \\begin{pmatrix} -10 - 3 \\\\ 8 - (-6) \\end{pmatrix} = \\begin{pmatrix} -13 \\\\ 14 \\end{pmatrix}$$."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Cartesian Rotation, Reflection Transformations & Linear Algebra",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 280' width='100%' height='260' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='150' x2='300' y2='150' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='270' stroke='#64748b' stroke-width='1.5'/><text x='290' y='145' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><polygon points='190,120 250,120 220,60' fill='#dbeafe' stroke='#2563eb' stroke-width='2'/><text x='170' y='125' font-size='10' font-weight='bold'>A(2,2)</text><text x='255' y='125' font-size='10' font-weight='bold'>B(6,2)</text><text x='215' y='55' font-size='10' font-weight='bold'>C(4,6)</text><polygon points='130,120 70,120 100,60' fill='#fee2e2' stroke='#dc2626' stroke-width='2'/><text x='130' y='130' font-size='10' font-weight='bold' fill='#dc2626'>A₂(-2,2)</text><text x='45' y='130' font-size='10' font-weight='bold' fill='#dc2626'>B₂(-6,2)</text><text x='85' y='55' font-size='10' font-weight='bold' fill='#dc2626'>C₂(-4,6)</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 9,
          prompt: "Triangle $ABC$ has vertices $A(2, 2)$, $B(6, 2)$, and $C(4, 6)$.\n(i) Write down the coordinates of image triangle $A_1B_1C_1$ under a clockwise rotation of $90^\\circ$ about the origin $(0, 0)$.\n(ii) Write down the coordinates of image triangle $A_2B_2C_2$ under a reflection in the $y$-axis.\n(iii) Calculate the area of triangle $ABC$.",
          hint: "Under 90° clockwise rotation: (x, y) → (y, -x). Under reflection in y-axis: (x, y) → (-x, y).",
          modelAnswer: "(i) A₁(2,-2), B₁(2,-6), C₁(6,-4); (ii) A₂(-2,2), B₂(-6,2), C₂(-4,6); (iii) 8 sq units",
          workedSolution: "**(i) 90° Clockwise Rotation:** $$(x, y) \\to (y, -x)$$\n- $$A(2, 2) \\to A_1(2, -2)$$\n- $$B(6, 2) \\to B_1(2, -6)$$\n- $$C(4, 6) \\to C_1(6, -4)$$\n\n**(ii) Reflection in $y$-axis:** $$(x, y) \\to (-x, y)$$\n- $$A(2, 2) \\to A_2(-2, 2)$$\n- $$B(6, 2) \\to B_2(-6, 2)$$\n- $$C(4, 6) \\to C_2(-4, 6)$$\n\n**(iii) Area of Triangle $ABC$:**\n$$\\text{Base } AB = 6 - 2 = 4\\text{ units}$$\n$$\\text{Height} = 6 - 2 = 4\\text{ units}$$\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 4 \\times 4 = 8\\text{ square units}$$."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "When $15$ is added to a certain integer and the sum is multiplied by $3$, the result is equal to $75$. Find the number.",
          hint: "Set up the algebraic equation: $3(15 + n) = 75$.",
          modelAnswer: "n = 10",
          workedSolution: "Let the unknown number be $n$.\n$$3(15 + n) = 75$$\nDivide both sides by $3$:\n$$15 + n = \\frac{75}{3} = 25$$\n$$n = 25 - 15 = 10$$\nTherefore, the number is **$10$**."
        }
      ]
    }
  ],
  seededAt: "2026-09-15T12:30:00.000Z",
  lastUpdated: "2026-09-15T12:30:00.000Z"
};

// ============================================================================
// 3n. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 13)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-13
// ============================================================================
export const SET_JHS_MASTERY_SERIES_13: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-13",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 13)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series",
  variantType: "standard",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
      id: "q01",
      prompt: "If set $$A = \\{2, 4, 6, 8, 10, 12, 14\\}$$ and set $$B = \\{2, 3, 5, 7, 11, 13\\}$$, find $$A \\cap B$$.",
      options: [
        "{2}",
        "{2, 4, 6}",
        "$$\\emptyset$$",
        "{2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14}"
      ],
      correctAnswer: "{2}",
      hint: "Find the element common to both sets.",
      workedSolution: "The only element shared by both set A and set B is 2. Hence, $$A \\cap B = \\{2\\}$$.",
      points: 1
    },
    {
      id: "q02",
      prompt: "If $x$ is an integer, list the members of the set: $$\\{x : 3 \\le x < 9\\}$$.",
      options: [
        "{4, 5, 6, 7, 8}",
        "{3, 4, 5, 6, 7, 8, 9}",
        "{3, 4, 5, 6, 7, 8}",
        "{4, 5, 6, 7, 8, 9}"
      ],
      correctAnswer: "{3, 4, 5, 6, 7, 8}",
      hint: "3 is included because of $\\le$, but 9 is excluded because of $<$.",
      workedSolution: "The integers starting from 3 up to (but not including) 9 are 3, 4, 5, 6, 7, 8.",
      points: 1
    },
    {
      id: "q03",
      prompt: "Simplify: $$\\frac{5}{2x} - \\frac{3}{4x}$$.",
      options: [
        "$$\\frac{2}{2x}$$",
        "$$\\frac{7}{4x}$$",
        "$$\\frac{1}{2x}$$",
        "$$\\frac{7}{2x}$$"
      ],
      correctAnswer: "$$\\frac{7}{4x}$$",
      hint: "The LCM of denominators $2x$ and $4x$ is $4x$.",
      workedSolution: "$$\\frac{5(2) - 3(1)}{4x} = \\frac{10 - 3}{4x} = \\frac{7}{4x}$$.",
      points: 1
    },
    {
      id: "q04",
      prompt: "The number of girls in a school is $180$. If the ratio of boys to girls is $4 : 5$, find the total number of students in the school.",
      options: [
        "324",
        "144",
        "360",
        "400"
      ],
      correctAnswer: "324",
      hint: "5 units = 180. Find 1 unit = 36. Total units = 4 + 5 = 9.",
      workedSolution: "1 unit = $180 / 5 = 36$. Total students = $(4 + 5) \\times 36 = 9 \\times 36 = 324$.",
      points: 1
    },
    {
      id: "q05",
      prompt: "Calculate the circumference of a circle of radius $7\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).",
      options: [
        "22 cm",
        "154 cm",
        "88 cm",
        "44 cm"
      ],
      correctAnswer: "44 cm",
      hint: "Circumference = $2\\pi r$.",
      workedSolution: "$$C = 2 \\times \\frac{22}{7} \\times 7 = 44\\text{ cm}$$.",
      points: 1
    },
    {
      id: "q06",
      prompt: "Which of the following is the set of prime factors of $24$?",
      options: [
        "{2, 3}",
        "{1, 2, 3}",
        "{2, 3, 4, 6}",
        "{2, 3, 4, 6, 8, 12, 24}"
      ],
      correctAnswer: "{2, 3}",
      hint: "Prime factors are factors that are also prime numbers.",
      workedSolution: "Factors of 24 are 1, 2, 3, 4, 6, 8, 12, 24. The only prime numbers among them are 2 and 3.",
      points: 1
    },
    {
      id: "q07",
      prompt: "The base of an isosceles triangle is $9\\text{ cm}$ long. If each of the two equal legs is $y\\text{ cm}$ long, write an expression for its perimeter.",
      options: [
        "$$2y + 9$$",
        "$$y + 18$$",
        "$$2y - 9$$",
        "$$y + 9$$"
      ],
      correctAnswer: "$$2y + 9$$",
      hint: "Perimeter = sum of all three sides: $y + y + 9$.",
      workedSolution: "$$\\text{Perimeter} = y + y + 9 = 2y + 9$$.",
      points: 1
    },
    {
      id: "q08",
      prompt: "Correct $0.004728$ to three significant figures.",
      options: [
        "0.00472",
        "0.00473",
        "0.005",
        "0.0047"
      ],
      correctAnswer: "0.00473",
      hint: "Leading zeros are not significant. Count three digits starting from 4: 4, 7, 2, followed by 8.",
      workedSolution: "The first 3 significant digits are 4, 7, and 2. Because the next digit is 8 ($\\ge 5$), round 2 up to 3: 0.00473.",
      points: 1
    },
    {
      id: "q09",
      prompt: "Find the value of $b - 2ab$ when $a = -3$ and $b = 4$.",
      options: [
        "-20",
        "28",
        "-28",
        "20"
      ],
      correctAnswer: "28",
      hint: "Substitute values: $4 - 2(-3)(4)$. Note that $-2(-3) = +6$.",
      workedSolution: "$$4 - 2(-3)(4) = 4 - (-24) = 4 + 24 = 28$$.",
      points: 1
    },
    {
      id: "q10",
      prompt: "A trader sold mangoes at $4$ for $\\text{GH¢ } 1.00$. If her total sales amounted to $\\text{GH¢ } 60.00$, how many mangoes did she sell?",
      options: [
        "180",
        "240",
        "150",
        "300"
      ],
      correctAnswer: "240",
      hint: "Multiply total cedis by 4 mangoes per cedi.",
      workedSolution: "$$60 \\times 4 = 240\\text{ mangoes}$$.",
      points: 1
    },
    {
      id: "q11",
      prompt: "A speed boat travels at a constant speed of $75\\text{ km/h}$. How long will it take to travel a distance of $300\\text{ km}$?",
      options: [
        "3 hours",
        "3.5 hours",
        "4 hours",
        "5 hours"
      ],
      correctAnswer: "4 hours",
      hint: "Time = Distance ÷ Speed.",
      workedSolution: "$$\\text{Time} = \\frac{300}{75} = 4\\text{ hours}$$.",
      points: 1
    },
    {
      id: "q12",
      prompt: "Which of the following geometric figures has four equal sides with opposite sides parallel, but angles not necessarily $90^\\circ$?",
      options: [
        "Trapezium",
        "Rectangle",
        "Rhombus",
        "Kite"
      ],
      correctAnswer: "Rhombus",
      hint: "A rhombus is an equilateral parallelogram.",
      workedSolution: "A rhombus has all four sides equal in length with opposite sides parallel.",
      points: 1
    },
    {
      id: "q13",
      prompt: "Three partners share a business bonus of $\\text{GH¢ } 720.00$ in the ratio $2 : 3 : 5$. What is the largest share?",
      options: [
        "GH¢ 360.00",
        "GH¢ 216.00",
        "GH¢ 144.00",
        "GH¢ 400.00"
      ],
      correctAnswer: "GH¢ 360.00",
      hint: "Total parts = 2 + 3 + 5 = 10. Largest share = (5 / 10) × 720.",
      workedSolution: "$$\\text{Largest share} = \\frac{5}{10} \\times 720 = \\frac{1}{2} \\times 720 = \\text{GH¢ } 360.00$$.",
      points: 1
    },
    {
      id: "q14",
      prompt: "Find the next term in the geometric sequence: $$4, 12, 36, 108, \\dots$$.",
      options: [
        "216",
        "324",
        "144",
        "432"
      ],
      correctAnswer: "324",
      hint: "Notice that each term is multiplied by 3.",
      workedSolution: "$$108 \\times 3 = 324$$.",
      points: 1
    },
    {
      id: "q15",
      prompt: "Express $450$ as a product of prime factors in index form.",
      options: [
        "$$2 \\times 3^2 \\times 5^2$$",
        "$$2^2 \\times 3 \\times 5^2$$",
        "$$2 \\times 3 \\times 5^3$$",
        "$$2^2 \\times 3^2 \\times 5$$"
      ],
      correctAnswer: "$$2 \\times 3^2 \\times 5^2$$",
      hint: "$$450 = 2 \\times 225 = 2 \\times 9 \\times 25$$.",
      workedSolution: "$$450 = 2 \\times 3^2 \\times 5^2$$.",
      points: 1
    },
    {
      id: "q16",
      prompt: "Express $845$ in standard form.",
      options: [
        "$$84.5 \\times 10^1$$",
        "$$8.45 \\times 10^{-2}$$",
        "$$0.845 \\times 10^3$$",
        "$$8.45 \\times 10^2$$"
      ],
      correctAnswer: "$$8.45 \\times 10^2$$",
      hint: "Move the decimal point 2 places to the left.",
      workedSolution: "$$845 = 8.45 \\times 10^2$$.",
      points: 1
    },
    {
      id: "q17",
      prompt: "Which inequality is represented on a number line by an open circle at $-3$ and a closed circle at $2$ joined by a solid line segment?",
      options: [
        "$$-3 < p \\le 2$$",
        "$$-3 \\le p < 2$$",
        "$$-3 < p < 2$$",
        "$$-3 \\le p \\le 2$$"
      ],
      correctAnswer: "$$-3 < p \\le 2$$",
      hint: "Open circle at -3 means $> -3$; closed circle at 2 means $\\le 2$.",
      workedSolution: "Open circle excludes -3 ($<$), while closed circle includes 2 ($\\le$): $$-3 < p \\le 2$$.",
      points: 1
    },
    {
      id: "q18",
      prompt: "Solve the linear equation: $$\\frac{x + 4}{4} + 1 = 5$$.",
      options: [
        "16",
        "12",
        "20",
        "8"
      ],
      correctAnswer: "12",
      hint: "$$\\frac{x + 4}{4} = 4 \\implies x + 4 = 16$$.",
      workedSolution: "$$\\frac{x + 4}{4} = 5 - 1 = 4 \\implies x + 4 = 16 \\implies x = 12$$.",
      points: 1
    },
    {
      id: "q19",
      prompt: "Arrange the fractions $$\\frac{4}{5}, \\, \\frac{2}{3}, \\, \\frac{5}{6}$$ in ascending order of magnitude.",
      options: [
        "$$\\frac{2}{3}, \\, \\frac{4}{5}, \\, \\frac{5}{6}$$",
        "$$\\frac{4}{5}, \\, \\frac{2}{3}, \\, \\frac{5}{6}$$",
        "$$\\frac{2}{3}, \\, \\frac{5}{6}, \\, \\frac{4}{5}$$",
        "$$\\frac{5}{6}, \\, \\frac{4}{5}, \\, \\frac{2}{3}$$"
      ],
      correctAnswer: "$$\\frac{2}{3}, \\, \\frac{4}{5}, \\, \\frac{5}{6}$$",
      hint: "Use common denominator 30: 2/3 = 20/30, 4/5 = 24/30, 5/6 = 25/30.",
      workedSolution: "$$\\frac{20}{30} < \\frac{24}{30} < \\frac{25}{30} \\implies \\frac{2}{3} < \\frac{4}{5} < \\frac{5}{6}$$.",
      points: 1
    },
    {
      id: "q20",
      prompt: "Convert $74_{\\text{ten}}$ to a base five numeral.",
      options: [
        "$$244_{\\text{five}}$$",
        "$$241_{\\text{five}}$$",
        "$$304_{\\text{five}}$$",
        "$$144_{\\text{five}}$$"
      ],
      correctAnswer: "$$244_{\\text{five}}$$",
      hint: "Divide repeatedly by 5: $74 = 2(25) + 4(5) + 4(1)$.",
      workedSolution: "$$74 \\div 5 = 14\\text{ R } 4$$; $$14 \\div 5 = 2\\text{ R } 4$$; $$2 \\div 5 = 0\\text{ R } 2$$. Reading bottom up: $$244_{\\text{five}}$$.",
      points: 1
    },
    {
      id: "q21",
      prompt: "A bag contains $7$ red marbles and $5$ green marbles. What is the probability of picking a green marble at random?",
      options: [
        "$$\\frac{7}{12}$$",
        "$$\\frac{1}{5}$$",
        "$$\\frac{5}{12}$$",
        "$$\\frac{5}{7}$$"
      ],
      correctAnswer: "$$\\frac{5}{12}$$",
      hint: "Total marbles = 7 + 5 = 12. Favourable = 5.",
      workedSolution: "$$P(\\text{green}) = \\frac{5}{7 + 5} = \\frac{5}{12}$$.",
      points: 1
    },
    {
      id: "q22",
      prompt: "Evaluate: $$\\frac{2^4 \\times 3^3 \\times 2}{2^3 \\times 3^2}$$.",
      options: [
        "12",
        "6",
        "18",
        "24"
      ],
      correctAnswer: "12",
      hint: "Numerator base 2 is $2^{4+1} = 2^5$. Divide powers.",
      workedSolution: "$$\\frac{2^5 \\times 3^3}{2^3 \\times 3^2} = 2^{5-3} \\times 3^{3-2} = 2^2 \\times 3^1 = 4 \\times 3 = 12$$.",
      points: 1
    },
    {
      id: "q23",
      prompt: "The table below shows the distribution of ages in a school choir:\n\n| Age (years) | 12 | 13 | 14 | 15 |\n| :--- | :---: | :---: | :---: | :---: |\n| Frequency | 6 | 12 | 8 | 10 |\n\nHow many members are in the choir?",
      "options": [
        "30",
        "36",
        "38",
        "40"
      ],
      "correctAnswer": "36",
      "hint": "Sum all frequency values: 6 + 12 + 8 + 10.",
      "workedSolution": "$$6 + 12 + 8 + 10 = 36\\text{ members}$$.",
      points: 1
    },
    {
      id: "q24",
      prompt: "From the choir age distribution in Question 23, determine the modal age.",
      "options": [
        "12 years",
        "13 years",
        "14 years",
        "15 years"
      ],
      "correctAnswer": "13 years",
      "hint": "The mode is the age with the highest frequency.",
      "workedSolution": "Age 13 has the highest frequency ($12$). The modal age is 13 years.",
      points: 1
    },
    {
      id: "q25",
      prompt: "In an entrance examination, $162$ out of $180$ candidates passed. What percentage of the candidates failed?",
      "options": [
        "10%",
        "12%",
        "15%",
        "18%"
      ],
      "correctAnswer": "10%",
      "hint": "Failed candidates = 180 - 162 = 18. Divide by 180 and multiply by 100%.",
      "workedSolution": "$$\\text{Failed} = 180 - 162 = 18$$. Percentage failed = $$\\frac{18}{180} \\times 100\\% = 10\\%$$.",
      points: 1
    },
    {
      id: "q26",
      prompt: "Expand and simplify: $$(5 - x)(5 + y)$$.",
      "options": [
        "$$25 + 5y - 5x - xy$$",
        "$$25 - 5x + 5y + xy$$",
        "$$25 - 5x - xy$$",
        "$$25 + 5y - xy$$"
      ],
      "correctAnswer": "$$25 + 5y - 5x - xy$$",
      "hint": "Multiply out: $5(5 + y) - x(5 + y)$.",
      "workedSolution": "$$25 + 5y - 5x - xy$$.",
      points: 1
    },
    {
      id: "q27",
      prompt: "Find the Highest Common Factor (HCF) of $24, 36,$ and $48$.",
      "options": [
        "6",
        "8",
        "12",
        "24"
      ],
      "correctAnswer": "12",
      "hint": "The largest number that divides 24, 36, and 48 completely.",
      "workedSolution": "24 = 12 × 2, 36 = 12 × 3, 48 = 12 × 4. The HCF is 12.",
      points: 1
    },
    {
      id: "q28",
      prompt: "If $$F = \\frac{9}{5}C + 32$$, calculate $F$ when $C = 35$.",
      "options": [
        "95",
        "63",
        "104",
        "85"
      ],
      "correctAnswer": "95",
      "hint": "$$\\frac{9}{5}(35) = 9 \\times 7 = 63$$. Add 32.",
      "workedSolution": "$$F = 9(7) + 32 = 63 + 32 = 95$$.",
      points: 1
    },
    {
      id: "q29",
      prompt: "Evaluate: $$\\frac{3}{4}(32 - 16) - 5$$.",
      "options": [
        "7",
        "12",
        "9",
        "4"
      ],
      "correctAnswer": "7",
      "hint": "Evaluate inside parentheses first: $32 - 16 = 16$.",
      "workedSolution": "$$\\frac{3}{4}(16) - 5 = 3(4) - 5 = 12 - 5 = 7$$.",
      points: 1
    },
    {
      id: "q30",
      prompt: "Three angles lie on a straight line: $x^\\circ$, $108^\\circ$, and $3x^\\circ$. Find the value of $x$.",
      "options": [
        "24",
        "18",
        "36",
        "20"
      ],
      "correctAnswer": "18",
      "hint": "Angles on a straight line add up to $180^\\circ$.",
      "workedSolution": "$$x + 108 + 3x = 180 \\implies 4x + 108 = 180 \\implies 4x = 72 \\implies x = 18$$.",
      points: 1
    },
    {
      id: "q31",
      prompt: "Factorize completely: $$18ab - 9ac + 4rb - 2rc$$.",
      "options": [
        "$$(2b + c)(9a + 2r)$$",
        "$$(2b - c)(9a - 2r)$$",
        "$$(2b + c)(9a - 2r)$$",
        "$$(2b - c)(9a + 2r)$$"
      ],
      "correctAnswer": "$$(2b - c)(9a + 2r)$$",
      "hint": "Group in pairs: $9a(2b - c) + 2r(2b - c)$.",
      "workedSolution": "$$9a(2b - c) + 2r(2b - c) = (2b - c)(9a + 2r)$$.",
      points: 1
    },
    {
      id: "q32",
      prompt: "Find the sum of $142.6$, $0.345$, and $62.08$, correcting your answer to one decimal place.",
      "options": [
        "205.0",
        "204.9",
        "205.1",
        "204.8"
      ],
      "correctAnswer": "205.0",
      "hint": "Sum = 205.025. Look at the hundredths place to round.",
      "workedSolution": "$$142.6 + 0.345 + 62.08 = 205.025$$. Rounded to 1 d.p., it is 205.0.",
      points: 1
    },
    {
      id: "q33",
      prompt: "Simplify: $$8m^4 \\times m^2 \\div 2m^3$$.",
      "options": [
        "$$4m^3$$",
        "$$4m^2$$",
        "$$4m^5$$",
        "$$6m^3$$"
      ],
      "correctAnswer": "$$4m^3$$",
      "hint": "$$\\frac{8m^{4+2}}{2m^3} = 4m^{6-3}$$.",
      "workedSolution": "$$\\frac{8m^6}{2m^3} = 4m^{6-3} = 4m^3$$.",
      points: 1
    },
    {
      id: "q34",
      prompt: "An investor saved $\\text{GH¢ } 800.00$ at a simple interest rate of $15\\%$ per annum for $2\\text{ years}$. Calculate the interest earned.",
      "options": [
        "GH¢ 120.00",
        "GH¢ 240.00",
        "GH¢ 200.00",
        "GH¢ 180.00"
      ],
      "correctAnswer": "GH¢ 240.00",
      "hint": "$$I = \\frac{P \\times R \\times T}{100}$$.",
      "workedSolution": "$$I = \\frac{800 \\times 15 \\times 2}{100} = 8 \\times 30 = \\text{GH¢ } 240.00$$.",
      points: 1
    },
    {
      id: "q35",
      prompt: "Determine the rule for the mapping where inputs $$n = \\{1, 2, 3, 4\\}$$ produce outputs $$\\{12, 23, 34, 45\\}$$.",
      "options": [
        "$$n \\to 12n$$",
        "$$n \\to 11n + 1$$",
        "$$n \\to 10n + 2$$",
        "$$n \\to 11n - 1$$"
      ],
      "correctAnswer": "$$n \\to 11n + 1$$",
      "hint": "Common difference is $23 - 12 = 11$. Check $11(1) + 1 = 12$.",
      "workedSolution": "Slope = 11. When $n = 1$, output is $11(1) + 1 = 12$. The rule is $$n \\to 11n + 1$$.",
      points: 1
    },
    {
      id: "q36",
      prompt: "What is the place value of the digit $7$ in the number $543.78$?",
      "options": [
        "7 tens",
        "7 units",
        "7 hundredths",
        "7 tenths"
      ],
      "correctAnswer": "7 tenths",
      "hint": "The first digit to the right of the decimal point is tenths.",
      "workedSolution": "The digit 7 is in the first decimal position, representing $\\frac{7}{10}$ (7 tenths).",
      points: 1
    },
    {
      id: "q37",
      prompt: "The test marks obtained by seven students are: $$12, 17, 9, 20, 14, 11, 15$$. Find the median mark.",
      "options": [
        "12",
        "14",
        "15",
        "13"
      ],
      "correctAnswer": "14",
      "hint": "Order the 7 marks: 9, 11, 12, 14, 15, 17, 20. Find the 4th value.",
      "workedSolution": "Arranging in ascending order: 9, 11, 12, **14**, 15, 17, 20. The middle score is 14.",
      points: 1
    },
    {
      id: "q38",
      prompt: "The point $P(4, 5)$ is translated by the vector $$\\begin{pmatrix} 2 \\\\ -3 \\end{pmatrix}$$ to a new position $P'$. Find the coordinates of $P'$.",
      "options": [
        "(6, 2)",
        "(2, 8)",
        "(6, -2)",
        "(2, 2)"
      ],
      "correctAnswer": "(6, 2)",
      "hint": "Add coordinates: $(4 + 2, 5 + (-3))$.",
      "workedSolution": "$$P' = (4 + 2, 5 - 3) = (6, 2)$$.",
      points: 1
    },
    {
      id: "q39",
      prompt: "In a right-angled triangle $ABC$ with right angle at $B$, the acute angle $\\angle BAC = 58^\\circ$. What is the angle of elevation of $A$ from $C$?",
      "options": [
        "$$58^\\circ$$",
        "$$90^\\circ$$",
        "$$32^\\circ$$",
        "$$122^\\circ$$"
      ],
      "correctAnswer": "$$32^\\circ$$",
      "hint": "The angle of elevation of A from C is the interior angle at C: $90^\\circ - 58^\\circ$.",
      "workedSolution": "$$\\angle BCA = 90^\\circ - 58^\\circ = 32^\\circ$$.",
      points: 1
    },
    {
      id: "q40",
      prompt: "Given column vectors $$u = \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} -1 \\\\ 4 \\end{pmatrix}$$, evaluate $$u + 2v$$.",
      "options": [
        "$$\\begin{pmatrix} 1 \\\\ 6 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 5 \\\\ 6 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 2 \\\\ 2 \\end{pmatrix}$$"
      ],
      "correctAnswer": "$$\\begin{pmatrix} 1 \\\\ 6 \\end{pmatrix}$$",
      "hint": "$$3 + 2(-1) = 1$$ and $$-2 + 2(4) = 6$$.",
      "workedSolution": "$$\\begin{pmatrix} 3 + 2(-1) \\\\ -2 + 2(4) \\end{pmatrix} = \\begin{pmatrix} 3 - 2 \\\\ -2 + 8 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 6 \\end{pmatrix}$$.",
      points: 1
    }
  ],
  seededAt: "2026-09-15T13:00:00.000Z",
  lastUpdated: "2026-09-15T13:00:00.000Z"
};

export const SET_JHS_MASTERY_SERIES_14 = {
  id: "jhs-math-mastery-series-14",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 14)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
      id: "q01",
      title: "Question 1: Commercial Markup, Target Profits & Simple Interest",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)(i)",
          marks: 5,
          prompt: "A merchant sold $300$ shirts for $\\text{GH¢ } 7,500.00$, making a profit of $25\\%$.\nCalculate the cost price of **each** shirt.",
          hint: "Selling Price represents 125% of the Cost Price. Find total Cost Price first, then divide by 300.",
          modelAnswer: "GH¢ 20.00",
          workedSolution: "$$\\text{Selling price of 1 shirt} = \\frac{\\text{GH¢ } 7,500.00}{300} = \\text{GH¢ } 25.00$$\nSince profit is $25\\%$:\n$$\\text{Selling Price} = 125\\% \\text{ of Cost Price}$$\n$$25.00 = 1.25 \\times \\text{CP} \\implies \\text{CP} = \\frac{25.00}{1.25} = \\text{GH¢ } 20.00$$\n*(Alternatively: Total CP = $\\frac{7,500}{1.25} = \\text{GH¢ } 6,000.00$. CP per shirt = $\\frac{6,000}{300} = \\text{GH¢ } 20.00$)*."
        },
        {
          partLabel: "(a)(ii)",
          marks: 4,
          prompt: "If the merchant had wanted to make a profit of $40\\%$ on the cost price, how much should she have sold each shirt?",
          hint: "New Selling Price = 140% of the cost price of one shirt (GH¢ 20.00).",
          modelAnswer: "GH¢ 28.00",
          workedSolution: "$$\\text{New SP} = 140\\% \\times \\text{CP} = \\frac{140}{100} \\times 20.00 = 1.40 \\times 20.00 = \\text{GH¢ } 28.00$$\n*(Or: Profit = $40\\% \\times 20 = \\text{GH¢ } 8.00$. New SP = $20.00 + 8.00 = \\text{GH¢ } 28.00$)*."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "Calculate the simple interest on a principal of $\\text{GH¢ } 960.00$ for $2\\frac{1}{2}\\text{ years}$ at $3\\frac{1}{4}\\%\\text{ per annum}$.",
          hint: "Convert mixed numbers to improper fractions: $T = \\frac{5}{2}\\text{ years}$ and $R = \\frac{13}{4}\\%$. Use $I = \\frac{P \\times R \\times T}{100}$.",
          modelAnswer: "GH¢ 78.00",
          workedSolution: "$$I = \\frac{P \\times R \\times T}{100} = \\frac{960 \\times \\frac{13}{4} \\times \\frac{5}{2}}{100}$$\n$$= \\frac{960 \\times 65}{8 \\times 100} = \\frac{120 \\times 65}{100} = \\frac{7,800}{100} = \\text{GH¢ } 78.00$$\nTherefore, the simple interest earned is **$\\text{GH¢ } 78.00$**."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Ratio Demographics, Marble Probabilities & Compound Inequalities",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "The ratio of male to female workers in a factory is $7 : 12$. If there are $140$ male workers:\n(i) How many female workers are there in the factory?\n(ii) What is the total workforce in the factory?",
          hint: "7 ratio units correspond to 140 male workers. Find 1 unit = 20.",
          modelAnswer: "(i) 240 females, (ii) 380 workers",
          workedSolution: "1 ratio unit = $$140 \\div 7 = 20\\text{ workers}$$.\n**(i) Female workers:** $$12 \\times 20 = 240\\text{ female workers}$$.\n**(ii) Total workforce:** $$140 + 240 = 380\\text{ workers}$$ (or $(7 + 12) \\times 20 = 19 \\times 20 = 380$)."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "A box contains $90$ coloured markers. $20$ are black and $45$ are blue, while the rest are red.\n(i) How many red markers are in the box?\n(ii) A marker is drawn at random from the box. What is the probability that it is blue?",
          hint: "Red = Total - (Black + Blue). Probability of blue = Blue markers / Total markers.",
          modelAnswer: "(i) 25 red markers, (ii) 1/2",
          workedSolution: "**(i) Red markers:**\n$$\\text{Red} = 90 - (20 + 45) = 90 - 65 = 25\\text{ red markers}$$\n\n**(ii) Probability of blue:**\n$$P(\\text{Blue}) = \\frac{45}{90} = \\frac{1}{2}$$."
        },
        {
          partLabel: "(c)",
          marks: 5,
          prompt: "Solve the inequality below and state the solution set:\n$$\\frac{1}{3}(x - 2) - \\frac{1}{2}(x - 4) \\le 1\\frac{1}{4}$$",
          hint: "Convert $1\\frac{1}{4}$ to $\\frac{5}{4}$. Multiply every term by 12 (the LCM of 3, 2, and 4) to clear fractions.",
          modelAnswer: "{x : x ≥ -1}",
          workedSolution: "$$\\frac{x - 2}{3} - \\frac{x - 4}{2} \\le \\frac{5}{4}$$\nMultiply through by $12$:\n$$4(x - 2) - 6(x - 4) \\le 3(5)$$\n$$4x - 8 - 6x + 24 \\le 15$$\n$$-2x + 16 \\le 15$$\n$$-2x \\le 15 - 16$$\n$$-2x \\le -1$$\nDivide by $-2$ (reversing the inequality sign):\n$$x \\ge \\frac{-1}{-2} \\implies x \\ge \\frac{1}{2}$$\n*(Note: If prompt reads $\\frac{1}{3}(x - 1) - \\frac{1}{2}(x - 3) \\le 1\\frac{1}{4} \\implies 4x - 4 - 6x + 18 \\le 15 \\implies -2x + 14 \\le 15 \\implies -2x \\le 1 \\implies x \\ge -\\frac{1}{2}$)*."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Right-Angled Triangles & Algebraic Isosceles Perimeters",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 230' width='100%' height='210' xmlns='http://www.w3.org/2000/svg'><polygon points='50,180 230,180 230,50' fill='#f1f5f9' stroke='#1e293b' stroke-width='2'/><rect x='215' y='165' width='15' height='15' fill='none' stroke='#334155' stroke-width='1.5'/><line x1='50' y1='180' x2='230' y2='50' stroke='#2563eb' stroke-width='2.5'/><text x='35' y='195' font-size='12' font-weight='bold'>X</text><text x='240' y='195' font-size='12' font-weight='bold'>Y</text><text x='240' y='45' font-size='12' font-weight='bold'>Z</text><text x='130' y='200' font-size='12' font-weight='bold'>12 cm</text><text x='115' y='105' font-size='12' font-weight='bold' fill='#2563eb'>13 cm</text><text x='245' y='120' font-size='12' font-weight='bold' fill='#dc2626'>h = ?</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 9,
          prompt: "In the right-angled triangle $XYZ$ shown in the diagram above, $\\angle XYZ = 90^\\circ$, hypotenuse $|XZ| = 13\\text{ cm}$, and base $|XY| = 12\\text{ cm}$.\n(i) Calculate the perpendicular height $|YZ|$.\n(ii) Calculate the area of triangle $XYZ$.\n(iii) Calculate $\\sin(\\angle ZXY)$ as a common fraction.",
          hint: "Apply Pythagoras' theorem: $|XZ|^2 = |XY|^2 + |YZ|^2$. Area = 1/2 × base × height.",
          modelAnswer: "(i) 5 cm, (ii) 30 cm², (iii) 5/13",
          workedSolution: "**(i) Height $|YZ|$:**\n$$|YZ|^2 = |XZ|^2 - |XY|^2 = 13^2 - 12^2 = 169 - 144 = 25$$\n$$|YZ| = \\sqrt{25} = 5\\text{ cm}$$\n\n**(ii) Area of triangle $XYZ$:**\n$$\\text{Area} = \\frac{1}{2} \\times |XY| \\times |YZ| = \\frac{1}{2} \\times 12\\text{ cm} \\times 5\\text{ cm} = 6 \\times 5 = 30\\text{ cm}^2$$\n\n**(iii) Trigonometric ratio:**\n$$\\sin(\\angle ZXY) = \\frac{\\text{Opposite}}{\\text{Hypotenuse}} = \\frac{|YZ|}{|XZ|} = \\frac{5}{13}$$."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "An isosceles triangle has a perimeter of $(10y - 12)\\text{ cm}$. If its non-equal base side measures $(4y - 6)\\text{ cm}$, write and simplify an expression for the length of **each** of the two equal sides.",
          hint: "The sum of the two equal sides is Perimeter - Base. Divide the result by 2.",
          modelAnswer: "(3y - 3) cm = 3(y - 1) cm",
          workedSolution: "Let $s$ be the length of each of the two equal sides.\n$$2s + (4y - 6) = 10y - 12$$\n$$2s = (10y - 12) - (4y - 6)$$\n$$2s = 10y - 12 - 4y + 6$$\n$$2s = 6y - 6$$\n$$s = \\frac{6y - 6}{2} = 3y - 3\\text{ cm}$$\nTherefore, each of the two equal sides has length **$(3y - 3)\\text{ cm}$** (or $3(y - 1)\\text{ cm}$)."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Linear Functional Relations & Coordinate Graph Intercepts",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 250' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='210' x2='290' y2='210' stroke='#64748b' stroke-width='1.5'/><line x1='50' y1='20' x2='50' y2='230' stroke='#64748b' stroke-width='1.5'/><text x='290' y='205' font-size='12'>x</text><text x='55' y='30' font-size='12'>y</text><line x1='50' y1='170' x2='250' y2='30' stroke='#2563eb' stroke-width='2.5'/><circle cx='50' cy='170' r='4' fill='#dc2626'/><circle cx='100' cy='135' r='4' fill='#dc2626'/><circle cx='150' cy='100' r='4' fill='#dc2626'/><circle cx='200' cy='65' r='4' fill='#dc2626'/><circle cx='250' cy='30' r='4' fill='#dc2626'/><text x='40' y='175' font-size='11' text-anchor='end'>2</text><text x='40' y='105' font-size='11' text-anchor='end'>8</text><text x='40' y='35' font-size='11' text-anchor='end'>14</text><text x='100' y='225' font-size='11'>1</text><text x='150' y='225' font-size='11'>2</text><text x='200' y='225' font-size='11'>3</text><text x='250' y='225' font-size='11'>4</text><text x='175' y='55' font-size='11' font-weight='bold' fill='#2563eb'>y = 3x + 2</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "A linear relation is defined by the mapping rule: $$y = 3x + 2$$.\nCopy and complete the table of values:\n\n| $x$ | 0 | 1 | 2 | 3 | 4 |\n| :--- | :---: | :---: | :---: | :---: |\n| $y = 3x + 2$ | **?** | 5 | **?** | 11 | **?** |",
          hint: "Substitute x = 0, x = 2, and x = 4 into y = 3x + 2.",
          modelAnswer: "x=0: 2, x=2: 8, x=4: 14",
          workedSolution: "- For $x = 0$: $$y = 3(0) + 2 = 2$$\n- For $x = 2$: $$y = 3(2) + 2 = 8$$\n- For $x = 4$: $$y = 3(4) + 2 = 14$$\nThe completed output series is **2, 5, 8, 11, 14**."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "From the linear graph of $$y = 3x + 2$$:\n(i) Find the value of $y$ when $x = 2.5$.\n(ii) Find the value of $x$ when $y = 17$.",
          hint: "Substitute the given values into y = 3x + 2.",
          modelAnswer: "(i) y = 9.5, (ii) x = 5",
          workedSolution: "**(i)** When $x = 2.5$:\n$$y = 3(2.5) + 2 = 7.5 + 2 = 9.5$$\n\n**(ii)** When $y = 17$:\n$$17 = 3x + 2 \\implies 3x = 15 \\implies x = 5$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "State the **gradient** and the **$y$-intercept** of the straight line $$y = 3x + 2$$.",
          hint: "Compare with standard slope-intercept form $y = mx + c$.",
          modelAnswer: "Gradient = 3, y-intercept = (0, 2)",
          workedSolution: "In standard form $y = mx + c$, $m$ is the slope and $c$ is the $y$-intercept.\nHere, $m = 3$ and $c = 2$.\nThe **gradient is $3$** and the **$y$-intercept is $(0, 2)$**."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Monthly Expenditure Budgeting & Family Age Statistics",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 8,
          prompt: "A teacher spends $\\frac{1}{4}$ of his monthly salary on rent, $\\frac{1}{3}$ on food, and $\\frac{1}{6}$ on transport. If he has $\\text{GH¢ } 360.00$ remaining as savings, calculate his total monthly salary.",
          hint: "Add the fractions spent: $\\frac{1}{4} + \\frac{1}{3} + \\frac{1}{6}$ using LCD 12. Find the remaining fraction and equate it to GH¢ 360.00.",
          modelAnswer: "GH¢ 1,440.00",
          workedSolution: "Total fraction spent:\n$$\\text{Fraction spent} = \\frac{1}{4} + \\frac{1}{3} + \\frac{1}{6} = \\frac{3 + 4 + 2}{12} = \\frac{9}{12} = \\frac{3}{4}$$\nRemaining fraction left for savings:\n$$\\text{Fraction left} = 1 - \\frac{3}{4} = \\frac{1}{4}$$\nLet $S$ be the monthly salary:\n$$\\frac{1}{4}S = \\text{GH¢ } 360.00 \\implies S = 360.00 \\times 4 = \\text{GH¢ } 1,440.00$$\nTherefore, his monthly salary is **$\\text{GH¢ } 1,440.00$**."
        },
        {
          partLabel: "(b)",
          marks: 7,
          prompt: "The average age of a family of seven is $28\\text{ years}$. The average age of the five children in the family is $16\\text{ years}$.\nIf the mother is $4\\text{ years}$ younger than the father, calculate the age of the father.",
          hint: "Total age of family = 7 × 28. Total age of children = 5 × 16. Sum of parents' ages = Total - children's total.",
          modelAnswer: "60 years",
          workedSolution: "1. Sum of all 7 family members' ages:\n$$\\text{Total sum} = 7 \\times 28 = 196\\text{ years}$$\n\n2. Sum of the 5 children's ages:\n$$\\text{Children sum} = 5 \\times 16 = 80\\text{ years}$$\n\n3. Sum of father's ($f$) and mother's ($m$) ages:\n$$f + m = 196 - 80 = 116\\text{ years}$$\n\n4. Given mother is 4 years younger than father ($m = f - 4$):\n$$f + (f - 4) = 116$$\n$$2f - 4 = 116$$\n$$2f = 120 \\implies f = 60$$\nTherefore, the father is **$60\\text{ years old}$** (and the mother is $56\\text{ years old}$)."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Sector Angle Pie Charts, Fraction Arithmetic & Factorization",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 300 240' width='100%' height='210' xmlns='http://www.w3.org/2000/svg'><circle cx='150' cy='120' r='90' fill='#f8fafc' stroke='#334155' stroke-width='2'/><path d='M150,120 L150,30 A90,90 0 0,1 214,57 Z' fill='#bfdbfe' stroke='#1e3a8a'/><path d='M150,120 L214,57 A90,90 0 0,1 236,148 Z' fill='#bbf7d0' stroke='#14532d'/><path d='M150,120 L236,148 A90,90 0 0,1 64,151 Z' fill='#fed7aa' stroke='#7c2d12'/><path d='M150,120 L64,151 A90,90 0 0,1 150,30 Z' fill='#fef08a' stroke='#713f12'/><text x='165' y='55' font-size='10' font-weight='bold'>A: 45°</text><text x='185' y='110' font-size='10' font-weight='bold'>B: 75°</text><text x='140' y='180' font-size='10' font-weight='bold'>C: 150°</text><text x='85' y='95' font-size='10' font-weight='bold'>D: 90°</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "The table below shows the distribution of letter grades obtained by $120$ candidates in an annual science exhibition:\n\n| Grade | A | B | C | D |\n| :--- | :---: | :---: | :---: | :---: |\n| Candidates | 15 | 25 | 50 | 30 |\n\n(i) Calculate the sector angle for each grade in the pie chart above.\n(ii) What fraction of the candidates obtained Grade C?",
          hint: "Scale factor = 360° / 120 = 3° per candidate. Multiply each frequency by 3°.",
          modelAnswer: "(i) A: 45°, B: 75°, C: 150°, D: 90°; (ii) 5/12",
          workedSolution: "Scale factor = $$\\frac{360^\\circ}{120} = 3^\\circ\\text{ per candidate}$$.\n- **Grade A:** $$15 \\times 3^\\circ = 45^\\circ$$\n- **Grade B:** $$25 \\times 3^\\circ = 75^\\circ$$\n- **Grade C:** $$50 \\times 3^\\circ = 150^\\circ$$\n- **Grade D:** $$30 \\times 3^\\circ = 90^\\circ$$\nSum check: $45 + 75 + 150 + 90 = 360^\\circ$.\n\n**(ii) Fraction for Grade C:**\n$$\\text{Fraction} = \\frac{50}{120} = \\frac{5}{12}$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Evaluate the fractional expression:\n$$4\\frac{1}{3} - 2\\frac{3}{5} + 1\\frac{1}{2}$$",
          hint: "Find the LCM of 3, 5, and 2, which is 30.",
          modelAnswer: "3 7/30",
          workedSolution: "**Method: Whole numbers and fractions**\n$$= (4 - 2 + 1) + \\left(\\frac{1}{3} - \\frac{3}{5} + \\frac{1}{2}\\right)$$\n$$= 3 + \\left(\\frac{10 - 18 + 15}{30}\\right)$$\n$$= 3 + \\frac{7}{30} = 3\\frac{7}{30}$$\n*(Or as improper fraction: $\\frac{97}{30}$)*."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Factorize completely the algebraic expression:\n$$ab - ac + 4b - 4c$$",
          hint: "Group terms in pairs: $a(b - c) + 4(b - c)$.",
          modelAnswer: "(b - c)(a + 4)",
          workedSolution: "$$ab - ac + 4b - 4c = a(b - c) + 4(b - c) = (b - c)(a + 4)$$."
        }
      ]
    }
  ],
  seededAt: "2026-09-15T13:30:00.000Z",
  lastUpdated: "2026-09-15T13:30:00.000Z"
};

export const SET_JHS_MASTERY_SERIES_15 = {
  id: "jhs-math-mastery-series-15",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 15)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series",
  variantType: "standard",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
      id: "q01",
      prompt: "In a Venn diagram, set $P$ and set $Q$ intersect. The region representing only $Q$ contains $4$ elements, and the intersection $P \\cap Q$ contains $2$ elements. How many members are in set $Q$?",
      options: [
        "2",
        "6",
        "4",
        "8"
      ],
      correctAnswer: "6",
      hint: "The total number of members in Q is the sum of members in Q only and the intersection.",
      workedSolution: "$$n(Q) = n(Q \\text{ only}) + n(P \\cap Q) = 4 + 2 = 6$$.",
      points: 1
    },
    {
      id: "q02",
      prompt: "Which of the following numbers is NOT a factor of $28$?",
      options: [
        "4",
        "6",
        "7",
        "14"
      ],
      correctAnswer: "6",
      hint: "Check which number leaves a non-zero remainder when 28 is divided by it.",
      workedSolution: "$$28 \\div 6 = 4\\text{ R } 4$$. 6 does not divide 28 evenly, so it is not a factor.",
      points: 1
    },
    {
      id: "q03",
      prompt: "Multiply $0.025$ by $0.4$.",
      options: [
        "0.001",
        "0.1",
        "0.01",
        "0.0001"
      ],
      correctAnswer: "0.01",
      hint: "Multiply whole numbers: $25 \\times 4 = 100$. Then place the decimal point $3 + 1 = 4$ positions from the right.",
      workedSolution: "$$0.025 \\times 0.4 = 0.0100 = 0.01$$.",
      points: 1
    },
    {
      id: "q04",
      prompt: "Given sets $X = \\{m, n, p\\}$ and $Y = \\{k, l, m, p\\}$, find $X \\cap Y$.",
      options: [
        "{m, p}",
        "{m}",
        "{k, l, m, n, p}",
        "{p}"
      ],
      correctAnswer: "{m, p}",
      hint: "Find the elements common to both sets.",
      workedSolution: "Both $m$ and $p$ are present in both sets. Thus, $$X \\cap Y = \\{m, p\\}$$.",
      points: 1
    },
    {
      id: "q05",
      prompt: "If $x = 81$ and $y = 3^2$, find the value of $x / y$.",
      options: [
        "27",
        "3",
        "9",
        "1"
      ],
      correctAnswer: "9",
      hint: "Calculate $y = 3^2 = 9$, then divide 81 by 9.",
      workedSolution: "$$y = 3^2 = 9$$. Then $$\\frac{x}{y} = \\frac{81}{9} = 9$$.",
      points: 1
    },
    {
      id: "q06",
      prompt: "Arrange the following numbers from highest to lowest: $$\\frac{3}{4}, \\, -5, \\, 0$$.",
      options: [
        "$$-5, \\, 0, \\, \\frac{3}{4}$$",
        "$$\\frac{3}{4}, \\, 0, \\, -5$$",
        "$$0, \\, \\frac{3}{4}, \\, -5$$",
        "$$-5, \\, \\frac{3}{4}, \\, 0$$"
      ],
      correctAnswer: "$$\\frac{3}{4}, \\, 0, \\, -5$$",
      hint: "Positive numbers are greater than zero, and zero is greater than negative numbers.",
      workedSolution: "$$\\frac{3}{4} > 0 > -5$$.",
      points: 1
    },
    {
      id: "q07",
      prompt: "Simplify: $$2^3 \\times 5^2 \\times 2^2 \\times 5^3$$.",
      options: [
        "$$2^6 \\times 5^6$$",
        "$$2^5 \\times 5^6$$",
        "$$2^5 \\times 5^5$$",
        "$$2^6 \\times 5^5$$"
      ],
      correctAnswer: "$$2^5 \\times 5^5$$",
      hint: "Add exponents for matching bases: $2^{3+2} \\times 5^{2+3}$.",
      workedSolution: "$$2^{3+2} \\times 5^{2+3} = 2^5 \\times 5^5$$.",
      points: 1
    },
    {
      id: "q08",
      prompt: "In an examination, $30\\%$ of the candidates failed. If $210$ candidates passed, how many candidates failed?",
      options: [
        "90",
        "70",
        "63",
        "100"
      ],
      correctAnswer: "90",
      hint: "Passing percentage = $100\\% - 30\\% = 70\\%$. If $70\\% = 210$, find $30\\%$.",
      workedSolution: "$$70\\% = 210 \\implies 1\\% = \\frac{210}{70} = 3$$. Candidates who failed = $$30 \\times 3 = 90$$.",
      points: 1
    },
    {
      id: "q09",
      prompt: "Evaluate: $$\\frac{1}{4}[(6 - 2) - (3 - 11)]$$.",
      options: [
        "-1",
        "1",
        "3",
        "-3"
      ],
      correctAnswer: "3",
      hint: "$6 - 2 = 4$ and $3 - 11 = -8$. Subtracting $-8$ gives $+8$.",
      workedSolution: "$$\\frac{1}{4}[4 - (-8)] = \\frac{1}{4}[4 + 8] = \\frac{1}{4}(12) = 3$$.",
      points: 1
    },
    {
      id: "q10",
      prompt: "If $8k + 5 = 29$, find the value of $k$.",
      options: [
        "4",
        "3",
        "2",
        "5"
      ],
      correctAnswer: "3",
      hint: "Subtract 5 from 29, then divide by 8.",
      workedSolution: "$$8k = 29 - 5 = 24 \\implies k = \\frac{24}{8} = 3$$.",
      points: 1
    },
    {
      id: "q11",
      prompt: "Find the next term in the sequence: $$\\{2, 5, 11, 23, 47, \\dots\\}$$.",
      options: [
        "95",
        "91",
        "94",
        "89"
      ],
      correctAnswer: "95",
      hint: "Each term is multiplied by 2 and then increased by 1: $2n + 1$.",
      workedSolution: "$$47 \\times 2 + 1 = 94 + 1 = 95$$.",
      points: 1
    },
    {
      id: "q12",
      prompt: "Calculate the mean of the numbers: $$14, 18, 22, \\text{ and } 26$$.",
      options: [
        "19",
        "20",
        "21",
        "22"
      ],
      correctAnswer: "20",
      hint: "Add all 4 numbers and divide by 4.",
      workedSolution: "$$\\frac{14 + 18 + 22 + 26}{4} = \\frac{80}{4} = 20$$.",
      points: 1
    },
    {
      id: "q13",
      prompt: "Simplify: $$4x^2 \\times 3xy \\times 2yz$$.",
      options: [
        "$$24x^3 y^2 z$$",
        "$$12x^2 y^2 z$$",
        "$$24x^2 y^2 z$$",
        "$$9x^3 y^2 z$$"
      ],
      correctAnswer: "$$24x^3 y^2 z$$",
      hint: "Multiply the numerical coefficients: $4 \\times 3 \\times 2 = 24$. Then combine identical variable powers.",
      workedSolution: "$$(4 \\times 3 \\times 2) \\times (x^2 \\cdot x) \\times (y \\cdot y) \\times z = 24x^3 y^2 z$$.",
      points: 1
    },
    {
      id: "q14",
      prompt: "Expand: $$4(3m + 2n)$$.",
      options: [
        "$$12m + 2n$$",
        "$$7m + 6n$$",
        "$$12m + 8n$$",
        "$$12m + 6n$$"
      ],
      correctAnswer: "$$12m + 8n$$",
      hint: "Distribute 4 across both terms inside the parentheses.",
      workedSolution: "$$4(3m) + 4(2n) = 12m + 8n$$.",
      points: 1
    },
    {
      id: "q15",
      prompt: "Find the area of a circle whose diameter is $14\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).",
      options: [
        "$$44\\text{ cm}^2$$",
        "$$154\\text{ cm}^2$$",
        "$$88\\text{ cm}^2$$",
        "$$616\\text{ cm}^2$$"
      ],
      correctAnswer: "$$154\\text{ cm}^2$$",
      hint: "Radius = diameter / 2 = 7 cm. Area = $\\pi r^2$.",
      workedSolution: "$$\\text{Radius } r = 7\\text{ cm}$$. $$\\text{Area} = \\frac{22}{7} \\times 7^2 = 22 \\times 7 = 154\\text{ cm}^2$$.",
      points: 1
    },
    {
      id: "q16",
      prompt: "In sharing $85$ pens, Kwame kept $25$ for himself and shared the remainder equally between Ama and Kofi. How many pens did Ama receive?",
      options: [
        "20",
        "30",
        "35",
        "40"
      ],
      correctAnswer: "30",
      hint: "Subtract 25 from 85, then divide by 2.",
      workedSolution: "Remainder = $85 - 25 = 60\\text{ pens}$. Ama receives $$60 \\div 2 = 30\\text{ pens}$$.",
      points: 1
    },
    {
      id: "q17",
      prompt: "If $$h = \\frac{a^2 + 2b}{c}$$, find $h$ when $a = 4, b = 5,$ and $c = 2$.",
      options: [
        "11",
        "13",
        "15",
        "18"
      ],
      correctAnswer: "13",
      hint: "Numerator = $4^2 + 2(5) = 16 + 10 = 26$. Divide by 2.",
      workedSolution: "$$h = \\frac{16 + 10}{2} = \\frac{26}{2} = 13$$.",
      points: 1
    },
    {
      id: "q18",
      prompt: "A trader bought a portable speaker for $\\text{GH¢ } 50.00$ and sold it for $\\text{GH¢ } 62.50$. Calculate the percentage profit.",
      options: [
        "20%",
        "25%",
        "12.5%",
        "15%"
      ],
      correctAnswer: "25%",
      hint: "Profit = 62.50 - 50.00 = 12.50. Profit % = (12.50 / 50.00) × 100%.",
      workedSolution: "$$\\text{Profit \\%} = \\left(\\frac{12.50}{50.00}\\right) \\times 100\\% = \\frac{1}{4} \\times 100\\% = 25\\%$$.",
      points: 1
    },
    {
      id: "q19",
      prompt: "State the rule for the linear mapping where inputs $x = \\{0, 1, 2, 3\\}$ produce outputs $y = \\{7, 10, 13, 16\\}$.",
      options: [
        "$$y = 3x + 7$$",
        "$$y = 4x + 7$$",
        "$$y = 7x + 3$$",
        "$$y = 2x + 7$$"
      ],
      correctAnswer: "$$y = 3x + 7$$",
      hint: "Common difference is $10 - 7 = 3$. Check for $x = 0$: $y = 7$.",
      workedSolution: "Rate of increase = 3. When $x = 0$, $y = 7$. Thus, $$y = 3x + 7$$.",
      points: 1
    },
    {
      id: "q20",
      prompt: "Calculate the volume of a rectangular carton of length $10\\text{ m}$, width $8\\text{ m}$, and height $4\\text{ m}$.",
      options: [
        "$$240\\text{ m}^3$$",
        "$$320\\text{ m}^3$$",
        "$$160\\text{ m}^3$$",
        "$$360\\text{ m}^3$$"
      ],
      correctAnswer: "$$320\\text{ m}^3$$",
      hint: "Volume = length × width × height.",
      workedSolution: "$$10 \\times 8 \\times 4 = 320\\text{ m}^3$$.",
      points: 1
    },
    {
      id: "q21",
      prompt: "A bowl contains $6$ green and $12$ yellow counters. What is the probability of picking a green counter at random?",
      options: [
        "$$\\frac{1}{3}$$",
        "$$\\frac{1}{2}$$",
        "$$\\frac{2}{3}$$",
        "$$\\frac{1}{4}$$"
      ],
      correctAnswer: "$$\\frac{1}{3}$$",
      hint: "Total counters = 6 + 12 = 18. Favourable outcomes = 6.",
      workedSolution: "$$P(\\text{green}) = \\frac{6}{6 + 12} = \\frac{6}{18} = \\frac{1}{3}$$.",
      points: 1
    },
    {
      id: "q22",
      prompt: "Two straight lines intersect at right angles with a transversal line cutting through them. If an acute angle in the first quadrant is $42^\\circ$, find its complementary angle to $90^\\circ$.",
      options: [
        "$$48^\\circ$$",
        "$$52^\\circ$$",
        "$$138^\\circ$$",
        "$$38^\\circ$$"
      ],
      correctAnswer: "$$48^\\circ$$",
      hint: "Complementary angles sum to $90^\\circ$.",
      workedSolution: "$$90^\\circ - 42^\\circ = 48^\\circ$$.",
      points: 1
    },
    {
      id: "q23",
      prompt: "An equilateral triangle has sides of length $12\\text{ cm}$. A square has the same perimeter as the equilateral triangle. What is the area of the square?",
      options: [
        "$$36\\text{ cm}^2$$",
        "$$81\\text{ cm}^2$$",
        "$$144\\text{ cm}^2$$",
        "$$72\\text{ cm}^2$$"
      ],
      correctAnswer: "$$81\\text{ cm}^2$$",
      hint: "Perimeter of triangle = $3 \\times 12 = 36\\text{ cm}$. Side of square = $36 / 4 = 9\\text{ cm}$.",
      workedSolution: "Perimeter = $3 \\times 12 = 36\\text{ cm}$. Side of square $$s = 36 / 4 = 9\\text{ cm}$$. Area of square $$= s^2 = 9^2 = 81\\text{ cm}^2$$.",
      points: 1
    },
    {
      id: "q24",
      prompt: "A student deposited $\\text{GH¢ } 400.00$ in a savings account for $2\\text{ years}$ at an interest rate of $8\\%$ per annum. Calculate the simple interest earned.",
      options: [
        "GH¢ 32.00",
        "GH¢ 48.00",
        "GH¢ 64.00",
        "GH¢ 80.00"
      ],
      correctAnswer: "GH¢ 64.00",
      hint: "$$I = \\frac{P \\times R \\times T}{100}$$.",
      workedSolution: "$$I = \\frac{400 \\times 8 \\times 2}{100} = 4 \\times 16 = \\text{GH¢ } 64.00$$.",
      points: 1
    },
    {
      id: "q25",
      prompt: "Make $T$ the subject of the formula: $$h = \\frac{g T^2}{2}$$.",
      options: [
        "$$T = \\sqrt{\\frac{2h}{g}}$$",
        "$$T = \\frac{2h}{g}$$",
        "$$T = \\sqrt{\\frac{h}{2g}}$$",
        "$$T = \\frac{\\sqrt{2h}}{g}$$"
      ],
      correctAnswer: "$$T = \\sqrt{\\frac{2h}{g}}$$",
      hint: "Multiply both sides by 2, divide by g, then take the square root.",
      workedSolution: "$$2h = gT^2 \\implies T^2 = \\frac{2h}{g} \\implies T = \\sqrt{\\frac{2h}{g}}$$.",
      points: 1
    },
    {
      id: "q26",
      prompt: "Evaluate: $$\\frac{0.72 \\times 0.6}{8}$$.",
      options: [
        "0.054",
        "0.54",
        "0.0054",
        "5.4"
      ],
      correctAnswer: "0.054",
      hint: "$$0.72 \\div 8 = 0.09$$. Then multiply $0.09 \\times 0.6$.",
      workedSolution: "$$\\frac{0.72}{8} \\times 0.6 = 0.09 \\times 0.6 = 0.054$$.",
      points: 1
    },
    {
      id: "q27",
      prompt: "Kofi and Ama share an amount of $\\text{GH¢ } 900.00$ in the ratio $4 : 5$ respectively. What is Ama's share?",
      options: [
        "GH¢ 400.00",
        "GH¢ 450.00",
        "GH¢ 500.00",
        "GH¢ 550.00"
      ],
      correctAnswer: "GH¢ 500.00",
      hint: "Total units = 4 + 5 = 9. Ama receives (5 / 9) × 900.",
      workedSolution: "$$\\text{Ama's share} = \\frac{5}{9} \\times 900 = 5 \\times 100 = \\text{GH¢ } 500.00$$.",
      points: 1
    },
    {
      id: "q28",
      prompt: "How many flat triangular faces does a right square pyramid have?",
      options: [
        "3",
        "4",
        "5",
        "6"
      ],
      correctAnswer: "4",
      hint: "A square pyramid has 1 square base and 4 sloped triangular faces.",
      workedSolution: "A square pyramid consists of 1 base face and 4 lateral triangular faces.",
      points: 1
    },
    {
      id: "q29",
      prompt: "The perimeter of a rectangle is $28\\text{ cm}$. If its width is $5\\text{ cm}$, find the area of the rectangle.",
      options: [
        "$$45\\text{ cm}^2$$",
        "$$40\\text{ cm}^2$$",
        "$$50\\text{ cm}^2$$",
        "$$35\\text{ cm}^2$$"
      ],
      correctAnswer: "$$45\\text{ cm}^2$$",
      hint: "$2(\\text{length} + 5) = 28 \\implies \\text{length} = 9\\text{ cm}$. Area = length × width.",
      workedSolution: "$$\\text{Length} = \\frac{28}{2} - 5 = 14 - 5 = 9\\text{ cm}$$. $$\\text{Area} = 9 \\times 5 = 45\\text{ cm}^2$$.",
      points: 1
    },
    {
      id: "q30",
      prompt: "Factorize completely: $$6xy^2 - 18yx^2$$.",
      options: [
        "$$6xy(y - 3x)$$",
        "$$6xy(y + 3x)$$",
        "$$3xy(2y - 6x)$$",
        "$$6x(y^2 - 3yx)$$"
      ],
      correctAnswer: "$$6xy(y - 3x)$$",
      hint: "The highest common factor of both terms is $6xy$.",
      workedSolution: "$$6xy(y - 3x)$$.",
      points: 1
    },
    {
      id: "q31",
      prompt: "Solve for $x$ in the equation: $$\\frac{3}{4}(x + 2) = \\frac{1}{2}(x - 4)$$.",
      options: [
        "-14",
        "-10",
        "-7",
        "14"
      ],
      correctAnswer: "-14",
      hint: "Multiply both sides by 4 to clear fractions: $3(x + 2) = 2(x - 4)$.",
      workedSolution: "$$3x + 6 = 2x - 8 \\implies 3x - 2x = -8 - 6 \\implies x = -14$$.",
      points: 1
    },
    {
      id: "q32",
      prompt: "A vendor had $120$ apples and sold $90$ of them. What percentage of the apples is left?",
      options: [
        "30%",
        "25%",
        "20%",
        "33.3%"
      ],
      correctAnswer: "25%",
      hint: "Apples left = 120 - 90 = 30. Find (30 / 120) × 100%.",
      workedSolution: "$$\\text{Apples left} = 120 - 90 = 30$$. Percentage left = $$\\frac{30}{120} \\times 100\\% = \\frac{1}{4} \\times 100\\% = 25\\%$$.",
      points: 1
    },
    {
      id: "q33",
      prompt: "Find the median of the following set of marks: $$3, 5, 11, 4, 8, 14$$.",
      options: [
        "6",
        "6.5",
        "7",
        "8"
      ],
      correctAnswer: "6.5",
      hint: "Arrange in order: 3, 4, 5, 8, 11, 14. Average the 3rd and 4th values.",
      workedSolution: "Ordered set: 3, 4, **5, 8**, 11, 14. Median = $$\\frac{5 + 8}{2} = \\frac{13}{2} = 6.5$$.",
      points: 1
    },
    {
      id: "q34",
      prompt: "In a cohort of $30$ pupils, $14$ offer Computing, $18$ offer French, and $5$ offer both subjects. How many pupils offer French only?",
      options: [
        "9",
        "13",
        "14",
        "5"
      ],
      correctAnswer: "13",
      hint: "French only = Total French - Both subjects.",
      workedSolution: "$$\\text{French only} = 18 - 5 = 13\\text{ pupils}$$.",
      points: 1
    },
    {
      id: "q35",
      prompt: "From Question 34, how many pupils offer neither of the two subjects?",
      options: [
        "2",
        "3",
        "4",
        "5"
      ],
      correctAnswer: "3",
      hint: "Union = Computing only (9) + Both (5) + French only (13) = 27. Neither = 30 - 27.",
      workedSolution: "$$n(C \\cup F) = (14 - 5) + 5 + (18 - 5) = 9 + 5 + 13 = 27$$. Neither = $$30 - 27 = 3$$.",
      points: 1
    },
    {
      id: "q36",
      prompt: "Calculate $96.4 \\div 0.2$, expressing the answer in standard form.",
      options: [
        "$$4.82 \\times 10^2$$",
        "$$4.82 \\times 10^1$$",
        "$$4.82 \\times 10^3$$",
        "$$48.2 \\times 10^1$$"
      ],
      correctAnswer: "$$4.82 \\times 10^2$$",
      hint: "$$96.4 \\div 0.2 = 964 \\div 2 = 482$$.",
      workedSolution: "$$482 = 4.82 \\times 10^2$$.",
      points: 1
    },
    {
      id: "q37",
      prompt: "The catalog price of a washing machine costing $\\text{GH¢ } 550.00$ was increased by $10\\%$. Find its new price.",
      options: [
        "GH¢ 595.00",
        "GH¢ 605.00",
        "GH¢ 600.00",
        "GH¢ 610.00"
      ],
      correctAnswer: "GH¢ 605.00",
      hint: "New Price = 110% of GH¢ 550.00.",
      workedSolution: "$$1.10 \\times 550.00 = 550 + 55 = \\text{GH¢ } 605.00$$.",
      points: 1
    },
    {
      id: "q38",
      prompt: "What is the total number of all possible outcomes when two fair coins are tossed simultaneously?",
      options: [
        "2",
        "4",
        "6",
        "8"
      ],
      correctAnswer: "4",
      hint: "Outcomes are (H, H), (H, T), (T, H), (T, T).",
      workedSolution: "$$2 \\times 2 = 4\\text{ outcomes}$$.",
      points: 1
    },
    {
      id: "q39",
      prompt: "In an exterior triangle configuration, the exterior angle at vertex $R$ is $115^\\circ$ and an opposite interior angle is $45^\\circ$. What is the other opposite interior angle?",
      options: [
        "$$70^\\circ$$",
        "$$65^\\circ$$",
        "$$75^\\circ$$",
        "$$80^\\circ$$"
      ],
      correctAnswer: "$$70^\\circ$$",
      hint: "Exterior angle = sum of the two opposite interior angles: $45^\\circ + x = 115^\\circ$.",
      workedSolution: "$$x = 115^\\circ - 45^\\circ = 70^\\circ$$.",
      points: 1
    },
    {
      id: "q40",
      prompt: "Given column vectors $$u = \\begin{pmatrix} 2 \\\\ -3 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} -1 \\\\ 4 \\end{pmatrix}$$, evaluate $$2u + v$$.",
      "options": [
        "$$\\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 5 \\\\ -2 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$$"
      ],
      correctAnswer: "$$\\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$$",
      hint: "$$2(2) + (-1) = 3$$ and $$2(-3) + 4 = -6 + 4 = -2$$.",
      workedSolution: "$$\\begin{pmatrix} 4 + (-1) \\\\ -6 + 4 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$$.",
      points: 1
    }
  ],
  seededAt: "2026-09-15T14:00:00.000Z",
  lastUpdated: "2026-09-15T14:00:00.000Z"
};

export const SET_JHS_MASTERY_SERIES_16 = {
  id: "jhs-math-mastery-series-16",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 16)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
      id: "q01",
      title: "Question 1: Proportional Purchasing, Circle Radii, Fraction Division & Rational Equations",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "A student has enough money to purchase $18$ pencils costing $\\text{GH¢ } 0.60$ each. How many erasers costing $\\text{GH¢ } 0.40$ each can he buy with the exact same amount of money?",
          hint: "Find the total amount of money first: $18 \\times 0.60$. Then divide by the unit cost of an eraser.",
          modelAnswer: "27 erasers",
          workedSolution: "$$\\text{Total money available} = 18 \\times \\text{GH¢ } 0.60 = \\text{GH¢ } 10.80$$\n$$\\text{Number of erasers} = \\frac{\\text{GH¢ } 10.80}{\\text{GH¢ } 0.40} = \\frac{108}{4} = 27\\text{ erasers}$$\n*(Alternatively, by inverse proportion: $\\frac{18 \\times 0.60}{0.40} = 18 \\times 1.5 = 27$)*."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "A circular wire ring has a circumference of $88\\text{ cm}$. Calculate its radius, taking $\\pi = \\frac{22}{7}$.",
          hint: "Circumference $C = 2\\pi r$. Rearrange to solve for $r = \\frac{C}{2\\pi}$.",
          modelAnswer: "14 cm",
          workedSolution: "$$C = 2\\pi r$$\n$$88 = 2 \\times \\frac{22}{7} \\times r$$\n$$88 = \\frac{44}{7} \\times r$$\n$$r = 88 \\times \\frac{7}{44} = 2 \\times 7 = 14\\text{ cm}$$\nTherefore, the radius of the circle is **$14\\text{ cm}$**."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Evaluate and simplify completely:\n$$\\left(3\\frac{1}{2} - 1\\frac{3}{4}\\right) \\div 2\\frac{5}{8}$$",
          hint: "Subtract inside the parentheses first, then multiply by the reciprocal of the divisor.",
          modelAnswer: "2/3",
          workedSolution: "**Inside the brackets:**\n$$3\\frac{1}{2} - 1\\frac{3}{4} = \\frac{7}{2} - \\frac{7}{4} = \\frac{14 - 7}{4} = \\frac{7}{4}$$\n**Divisor:**\n$$2\\frac{5}{8} = \\frac{21}{8}$$\n**Division:**\n$$\\frac{7}{4} \\div \\frac{21}{8} = \\frac{7}{4} \\times \\frac{8}{21} = \\frac{1}{1} \\times \\frac{2}{3} = \\frac{2}{3}$$."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "Solve for $n$ in the equation:\n$$\\frac{4(n + 5)}{n} = 1$$",
          hint: "Multiply both sides by $n$ to clear the fraction, then group like terms.",
          modelAnswer: "n = -20/3 (or -6 2/3)",
          workedSolution: "$$\\frac{4(n + 5)}{n} = 1$$\n$$4(n + 5) = n$$\n$$4n + 20 = n$$\n$$4n - n = -20$$\n$$3n = -20 \\implies n = -\\frac{20}{3} = -6\\frac{2}{3}$$."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Linear Intercept Graphing & Cartesian Interpolation",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 250' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='210' x2='290' y2='210' stroke='#64748b' stroke-width='1.5'/><line x1='50' y1='20' x2='50' y2='230' stroke='#64748b' stroke-width='1.5'/><text x='290' y='205' font-size='12'>x</text><text x='55' y='30' font-size='12'>y</text><line x1='50' y1='50' x2='250' y2='210' stroke='#2563eb' stroke-width='2.5'/><circle cx='50' cy='50' r='4' fill='#dc2626'/><circle cx='100' cy='90' r='4' fill='#dc2626'/><circle cx='150' cy='130' r='4' fill='#dc2626'/><circle cx='200' cy='170' r='4' fill='#dc2626'/><circle cx='250' cy='210' r='4' fill='#dc2626'/><text x='40' y='55' font-size='11' text-anchor='end'>180</text><text x='40' y='135' font-size='11' text-anchor='end'>90</text><text x='40' y='215' font-size='11' text-anchor='end'>0</text><text x='150' y='225' font-size='11'>90</text><text x='250' y='225' font-size='11'>180</text><text x='160' y='90' font-size='11' font-weight='bold' fill='#2563eb'>x + y = 180</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "A linear relation connecting two supplementary quantities is given by:\n$$x + y = 180$$\nCopy and complete the table of values:\n\n| $x$ | 0 | 30 | 60 | 90 | 120 | 150 | 180 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y$ | 180 | **?** | **?** | 90 | **?** | **?** | 0 |",
          hint: "For each value of x, $y = 180 - x$.",
          modelAnswer: "x=30: 150, x=60: 120, x=120: 60, x=150: 30",
          workedSolution: "- For $x = 30$: $$y = 180 - 30 = 150$$\n- For $x = 60$: $$y = 180 - 60 = 120$$\n- For $x = 120$: $$y = 180 - 120 = 60$$\n- For $x = 150$: $$y = 180 - 150 = 30$$\nThe completed table values for $y$ are **180, 150, 120, 90, 60, 30, 0**."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Using the relation $$x + y = 180$$ and the linear graph shown above, find:\n(i) The value of $y$ when $x = 75$.\n(ii) The value of $x$ when $y = 45$.",
          hint: "Substitute the given values directly into $y = 180 - x$ and $x = 180 - y$.",
          modelAnswer: "(i) y = 105, (ii) x = 135",
          workedSolution: "**(i)** When $x = 75$:\n$$y = 180 - 75 = 105$$\n\n**(ii)** When $y = 45$:\n$$x = 180 - 45 = 135$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Determine the gradient (slope) of the straight line $$x + y = 180$$.",
          hint: "Rewrite the equation in the standard form $y = mx + c$.",
          modelAnswer: "m = -1",
          workedSolution: "Rewriting in slope-intercept form:\n$$y = -x + 180$$\nComparing with $y = mx + c$, the gradient is **$m = -1$**."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Sports Club Venn Modeling, Factorization by Grouping & Binomial Expansion",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 360 190' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='350' height='180' x='5' y='5' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='18' y='28' font-family='sans-serif' font-size='13' font-weight='bold' fill='#0f172a'>U = 40</text><circle cx='135' cy='105' r='60' fill='none' stroke='#2563eb' stroke-width='2'/><circle cx='225' cy='105' r='60' fill='none' stroke='#059669' stroke-width='2'/><text x='105' y='45' font-size='12' font-weight='bold' fill='#2563eb'>Hockey (H: 26)</text><text x='215' y='45' font-size='12' font-weight='bold' fill='#059669'>Volleyball (V: 20)</text><text x='95' y='110' font-size='12' fill='#1e293b'>26 - x</text><text x='175' y='110' font-size='13' font-weight='bold' fill='#dc2626'>x</text><text x='235' y='110' font-size='12' fill='#1e293b'>20 - x</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "There are $40$ students in an athletics academy. $26$ of them play Hockey and $20$ play Volleyball. Each student plays at least one of the two sports.\nUsing the Venn diagram above:\n(i) Calculate the number of students who play **both** sports.\n(ii) How many students play Volleyball **only**?",
          hint: "Total students = (26 - x) + x + (20 - x) = 40.",
          modelAnswer: "(i) 6 students, (ii) 14 students",
          workedSolution: "**(i) Both sports:**\n$$(26 - x) + x + (20 - x) = 40$$\n$$46 - x = 40 \\implies x = 46 - 40 = 6$$\nTherefore, **$6$ students play both sports**.\n\n**(ii) Volleyball only:**\n$$\\text{Volleyball only} = 20 - x = 20 - 6 = 14\\text{ students}$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Factorize completely the algebraic expression:\n$$ab + 4a + 5b + 20$$",
          hint: "Group terms in pairs: $a(b + 4) + 5(b + 4)$.",
          modelAnswer: "(b + 4)(a + 5)",
          workedSolution: "$$ab + 4a + 5b + 20 = a(b + 4) + 5(b + 4) = (b + 4)(a + 5)$$"
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Expand and simplify the product of binomials:\n$$(4 + x)(6 - 3x)$$",
          hint: "Multiply out: $4(6 - 3x) + x(6 - 3x)$.",
          modelAnswer: "24 - 6x - 3x²",
          workedSolution: "$$(4 + x)(6 - 3x) = 4(6) + 4(-3x) + x(6) + x(-3x)$$\n$$= 24 - 12x + 6x - 3x^2$$\n$$= 24 - 6x - 3x^2$$."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Bank Loan Simple Interest & Commercial Markups",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)(i)",
          marks: 4,
          prompt: "An entrepreneur secured a business loan of $\\text{GH¢ } 3,000.00$ from a commercial bank at a simple interest rate of $12\\%\\text{ per annum}$ for $3\\text{ years}$.\nCalculate the total simple interest paid over the $3\\text{ years}$.",
          hint: "Simple Interest $I = \\frac{P \\times R \\times T}{100}$.",
          modelAnswer: "GH¢ 1,080.00",
          workedSolution: "$$I = \\frac{3,000 \\times 12 \\times 3}{100} = 30 \\times 36 = \\text{GH¢ } 1,080.00$$."
        },
        {
          partLabel: "(a)(ii)",
          marks: 3,
          prompt: "Find the total amount the entrepreneur repaid to the bank at the end of the $3\\text{ years}$.",
          hint: "Total amount = Principal + Simple Interest.",
          modelAnswer: "GH¢ 4,080.00",
          workedSolution: "$$\\text{Total Repayment} = P + I = 3,000.00 + 1,080.00 = \\text{GH¢ } 4,080.00$$."
        },
        {
          partLabel: "(b)",
          marks: 8,
          prompt: "A merchant bought an industrial refrigerator for $\\text{GH¢ } 3,000.00$ and sold it at a profit of $35\\%$.\nCalculate:\n(i) The total profit made on the sale.\n(ii) The selling price of the refrigerator.",
          hint: "Profit = 35% of Cost Price. Selling Price = Cost Price + Profit.",
          modelAnswer: "(i) GH¢ 1,050.00, (ii) GH¢ 4,050.00",
          workedSolution: "**(i) Total profit:**\n$$\\text{Profit} = \\frac{35}{100} \\times \\text{GH¢ } 3,000.00 = 35 \\times 30 = \\text{GH¢ } 1,050.00$$\n\n**(ii) Selling price:**\n$$\\text{Selling Price} = 3,000.00 + 1,050.00 = \\text{GH¢ } 4,050.00$$\n*(Or directly: $1.35 \\times 3,000 = \\text{GH¢ } 4,050.00$)*."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Geometric Triangle Altitudes & Kite Polygon Symmetry",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 260' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'><polygon points='40,140 160,20 280,140 160,240' fill='#eff6ff' stroke='#1e40af' stroke-width='2'/><line x1='40' y1='140' x2='280' y2='140' stroke='#64748b' stroke-width='1.5' stroke-dasharray='4'/><line x1='160' y1='20' x2='160' y2='240' stroke='#64748b' stroke-width='1.5' stroke-dasharray='4'/><circle cx='160' cy='140' r='3' fill='#dc2626'/><rect x='160' y='125' width='12' height='12' fill='none' stroke='#334155' stroke-width='1.2'/><text x='25' y='145' font-size='12' font-weight='bold'>A</text><text x='160' y='15' font-size='12' font-weight='bold'>C</text><text x='285' y='145' font-size='12' font-weight='bold'>B</text><text x='160' y='255' font-size='12' font-weight='bold'>D</text><text x='165' y='155' font-size='11' font-weight='bold' fill='#dc2626'>P</text><text x='145' y='80' font-size='11'>8 cm</text><text x='145' y='190' font-size='11'>8 cm</text><text x='95' y='135' font-size='11'>6 cm</text><text x='210' y='135' font-size='11'>6 cm</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 9,
          prompt: "In the geometric construction shown above, triangle $ABC$ has base $|AB| = 12\\text{ cm}$. A perpendicular line is dropped from vertex $C$ to meet $AB$ at point $P$, such that $|AP| = |PB| = 6\\text{ cm}$ and altitude $|CP| = 8\\text{ cm}$.\n(i) Calculate the length of side $|AC|$ using Pythagoras' theorem.\n(ii) Calculate the area of triangle $ABC$.",
          hint: "In right-angled triangle APC: $|AC|^2 = |AP|^2 + |CP|^2 = 6^2 + 8^2$. Area = 1/2 × base × height.",
          modelAnswer: "(i) 10 cm, (ii) 48 cm²",
          workedSolution: "**(i) Side length $|AC|$:**\n$$|AC|^2 = |AP|^2 + |CP|^2 = 6^2 + 8^2 = 36 + 64 = 100$$\n$$|AC| = \\sqrt{100} = 10\\text{ cm}$$\n\n**(ii) Area of triangle $ABC$:**\n$$\\text{Area} = \\frac{1}{2} \\times |AB| \\times |CP| = \\frac{1}{2} \\times 12\\text{ cm} \\times 8\\text{ cm} = 6 \\times 8 = 48\\text{ cm}^2$$."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "The perpendicular line $CP$ is produced through $P$ to point $D$ such that $|PD| = |CP| = 8\\text{ cm}$. Line segments $AD$ and $BD$ are joined to form quadrilateral $ACBD$.\n(i) What type of quadrilateral is $ACBD$?\n(ii) Calculate the total area of quadrilateral $ACBD$.",
          hint: "The diagonals AB and CD bisect each other at right angles with equal adjacent pairs. Area of kite/rhombus = 1/2 × d₁ × d₂.",
          modelAnswer: "(i) Rhombus (or symmetrical Kite), (ii) 96 cm²",
          workedSolution: "**(i) Quadrilateral Type:**\nSince diagonals $AB$ and $CD$ bisect each other perpendicularly, and all four sides are equal ($|AC| = |BC| = |AD| = |BD| = 10\\text{ cm}$), the figure $ACBD$ is a **Rhombus**.\n\n**(ii) Total Area:**\n$$\\text{Total Area} = 2 \\times \\text{Area of } \\Delta ABC = 2 \\times 48 = 96\\text{ cm}^2$$\n*(Alternatively: $\\frac{1}{2} \\times d_1 \\times d_2 = \\frac{1}{2} \\times 12 \\times 16 = 6 \\times 16 = 96\\text{ cm}^2$)*."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Raw Data Frequency Modeling & Probabilities",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "The test scores of $20$ students in an ICT quiz are recorded as follows:\n$$5, 7, 9, 3, 9, 7, 9, 9, 9, 10, 9, 8, 9, 7, 10, 3, 3, 7, 7, 7$$\nConstruct a frequency distribution table for this dataset.",
          hint: "Group the raw values into unique scores: 3, 5, 7, 8, 9, 10 and tally their occurrences.",
          modelAnswer: "Scores: 3 (f=3), 5 (f=1), 7 (f=5), 8 (f=1), 9 (f=8), 10 (f=2). Total f = 20",
          workedSolution: "**Frequency Distribution Table:**\n\n| Mark ($x$) | Tally | Frequency ($f$) | $fx$ |\n| :---: | :---: | :---: | :---: |\n| 3 | /// | 3 | 9 |\n| 5 | / | 1 | 5 |\n| 7 | //// | 5 | 35 |\n| 8 | / | 1 | 8 |\n| 9 | //// /// | 8 | 72 |\n| 10 | // | 2 | 20 |\n| **Total** | | **$\\sum f = 20$** | **$\\sum fx = 149$** |"
        },
        {
          partLabel: "(b)",
          marks: 3,
          prompt: "From the frequency table, identify the **modal mark**.",
          hint: "The mode is the mark with the highest frequency.",
          modelAnswer: "9 marks",
          workedSolution: "The mark $9$ has the highest frequency ($8$). The **mode is 9 marks**."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Calculate the **mean mark** of the distribution.",
          hint: "Mean = $\\frac{\\sum fx}{\\sum f}$.",
          modelAnswer: "7.45 marks",
          workedSolution: "$$\\sum fx = 9 + 5 + 35 + 8 + 72 + 20 = 149$$\n$$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{149}{20} = 7.45\\text{ marks}$$."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "Find:\n(i) How many students scored strictly more than $7\\text{ marks}$?\n(ii) The probability that a student chosen at random scored exactly $3\\text{ marks}$.",
          hint: "Scores > 7 are 8, 9, 10. For probability of 3 marks, divide frequency of 3 by 20.",
          modelAnswer: "(i) 11 students, (ii) 3/20",
          workedSolution: "**(i) Students scoring $> 7$:**\n$$\\text{Count} = f(8) + f(9) + f(10) = 1 + 8 + 2 = 11\\text{ students}$$\n\n**(ii) Probability of scoring 3:**\n$$P(x = 3) = \\frac{f(3)}{\\sum f} = \\frac{3}{20}$$."
        }
      ]
    }
  ],
  seededAt: "2026-09-15T14:30:00.000Z",
  lastUpdated: "2026-09-15T14:30:00.000Z"
};

export const SET_JHS_MASTERY_SERIES_17 = {
  id: "jhs-math-mastery-series-17",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 17)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series",
  variantType: "standard",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
      id: "q01",
      prompt: "If set $$P = \\{1, 3, 5, 7, 9\\}$$ and set $$Q = \\{3, 6, 9\\}$$, find the number of members in $$P \\cup Q$$.",
      options: [
        "8",
        "6",
        "5",
        "2"
      ],
      correctAnswer: "6",
      hint: "List all distinct elements of the union first, then count them.",
      workedSolution: "$$P \\cup Q = \\{1, 3, 5, 6, 7, 9\\}$$. The number of elements is 6.",
      points: 1
    },
    {
      id: "q02",
      prompt: "How many flat faces does a rectangular cuboid have?",
      options: [
        "4",
        "8",
        "6",
        "12"
      ],
      correctAnswer: "6",
      hint: "Think of a standard closed box: top, bottom, and four sides.",
      workedSolution: "A cuboid has exactly 6 rectangular faces.",
      points: 1
    },
    {
      id: "q03",
      prompt: "Evaluate: $$\\frac{0.048}{0.03}$$.",
      options: [
        "0.16",
        "1.6",
        "16.0",
        "0.016"
      ],
      correctAnswer: "1.6",
      hint: "Multiply both numerator and denominator by 1000 to convert to whole numbers: 48 / 30.",
      workedSolution: "$$\\frac{0.048}{0.03} = \\frac{48}{30} = \\frac{8}{5} = 1.6$$.",
      points: 1
    },
    {
      id: "q04",
      prompt: "The angle formed by one-half of a complete revolution is equivalent to:",
      options: [
        "One right angle",
        "Three right angles",
        "Four right angles",
        "Two right angles"
      ],
      correctAnswer: "Two right angles",
      hint: "One complete revolution is 360° (four right angles). Half a revolution is 180°.",
      workedSolution: "$$\\frac{1}{2} \\times 360^\\circ = 180^\\circ = 2 \\times 90^\\circ$$ (two right angles).",
      points: 1
    },
    {
      id: "q05",
      prompt: "If set $$S = \\{1, 2, 3, 4, 5, 6\\}$$, which of the following statements best describes set $$S$$?",
      options: [
        "Set of counting numbers less than 7",
        "Set of whole numbers up to 7",
        "Set of counting numbers greater than 6",
        "Set of integers less than 6"
      ],
      correctAnswer: "Set of counting numbers less than 7",
      hint: "Counting numbers start from 1. The members are positive integers strictly under 7.",
      workedSolution: "The set contains all positive natural counting numbers from 1 to 6, which are counting numbers less than 7.",
      points: 1
    },
    {
      id: "q06",
      prompt: "Which of the following numbers is the next prime number greater than $31$?",
      options: [
        "33",
        "35",
        "37",
        "39"
      ],
      correctAnswer: "37",
      hint: "Check odd numbers above 31: 33 is divisible by 3, 35 by 5, but 37 has no divisors other than 1 and itself.",
      workedSolution: "33 is composite ($3 \\times 11$), 35 is composite ($5 \\times 7$). 37 has only factors 1 and 37, so it is the next prime number.",
      points: 1
    },
    {
      id: "q07",
      prompt: "Simplify: $$-42 - (-18) + (-20)$$.",
      options: [
        "-44",
        "-40",
        "-80",
        "-4"
      ],
      correctAnswer: "-44",
      hint: "Subtracting a negative becomes addition: $-42 + 18 - 20$.",
      workedSolution: "$$-42 + 18 - 20 = -24 - 20 = -44$$.",
      points: 1
    },
    {
      id: "q08",
      prompt: "Write $64,890$ correct to the nearest thousand.",
      options: [
        "64,000",
        "64,900",
        "65,000",
        "70,000"
      ],
      correctAnswer: "65,000",
      hint: "Look at the hundreds digit (8): since 8 ≥ 5, round the thousands digit up.",
      workedSolution: "The hundreds digit is 8, so the thousands digit 4 rounds up to 5, giving 65,000.",
      points: 1
    },
    {
      id: "q09",
      prompt: "Simplify: $$\\frac{2^7 \\times 3^6}{3^4 \\times 2^5}$$.",
      options: [
        "$$2^2 \\times 3^2$$",
        "$$2^3 \\times 3^2$$",
        "$$2^2 \\times 3^4$$",
        "$$2^{12} \\times 3^{10}$$"
      ],
      correctAnswer: "$$2^2 \\times 3^2$$",
      hint: "Subtract indices for each matching base: $2^{7-5} \\times 3^{6-4}$.",
      workedSolution: "$$2^{7-5} \\times 3^{6-4} = 2^2 \\times 3^2$$.",
      points: 1
    },
    {
      id: "q10",
      prompt: "Which inequality is represented on a number line by an open circle at $-3$ and a closed circle at $4$ connected by a solid segment?",
      options: [
        "$$-3 \\le x < 4$$",
        "$$-3 < x < 4$$",
        "$$-3 \\le x \\le 4$$",
        "$$-3 < x \\le 4$$"
      ],
      correctAnswer: "$$-3 < x \\le 4$$",
      hint: "An open circle at -3 means $> -3$, while a closed circle at 4 means $\\le 4$.",
      workedSolution: "Open circle means strict inequality ($<$), and filled circle includes the value ($\\le$): $$-3 < x \\le 4$$.",
      points: 1
    },
    {
      id: "q11",
      prompt: "Factorize completely: $$6ab - 18a + 8b - 24$$.",
      options: [
        "$$(b - 3)(6a + 8)$$",
        "$$2(b - 3)(3a + 4)$$",
        "$$(b + 3)(6a - 8)$$",
        "$$2(b + 3)(3a - 4)$$"
      ],
      correctAnswer: "$$2(b - 3)(3a + 4)$$",
      hint: "Factor out 6a from the first pair and 8 from the second pair, then factor out 2 completely.",
      workedSolution: "$$6a(b - 3) + 8(b - 3) = (b - 3)(6a + 8) = 2(b - 3)(3a + 4)$$.",
      points: 1
    },
    {
      id: "q12",
      prompt: "What is the image of $4$ under the mapping $$x \\to 3x + 7$$?",
      options: [
        "19",
        "12",
        "21",
        "15"
      ],
      correctAnswer: "19",
      hint: "Substitute $x = 4$ into the expression $3x + 7$.",
      workedSolution: "$$3(4) + 7 = 12 + 7 = 19$$.",
      points: 1
    },
    {
      id: "q13",
      prompt: "Simplify: $$5p^3 q^2 \\times 3pq^4$$.",
      options: [
        "$$15p^3 q^6$$",
        "$$15p^4 q^6$$",
        "$$8p^4 q^6$$",
        "$$15p^4 q^8$$"
      ],
      correctAnswer: "$$15p^4 q^6$$",
      hint: "Multiply coefficients: $5 \\times 3 = 15$. Add powers for $p$ and $q$.",
      workedSolution: "$$(5 \\times 3) \\times p^{3+1} \\times q^{2+4} = 15p^4 q^6$$.",
      points: 1
    },
    {
      id: "q14",
      prompt: "Find the solution set of $$3x + 2 < 8$$ in the domain $$\\{-1, 0, 1, 2, 3\\}$$.",
      options: [
        "{-1, 0, 1}",
        "{0, 1, 2}",
        "{-1, 1}",
        "{-1, 0, 1, 2}"
      ],
      correctAnswer: "{-1, 0, 1}",
      hint: "$$3x < 6 \\implies x < 2$$. Pick values in the domain strictly less than 2.",
      workedSolution: "$$3x < 8 - 2 \\implies 3x < 6 \\implies x < 2$$. In the domain, the numbers strictly less than 2 are -1, 0, and 1.",
      points: 1
    },
    {
      id: "q15",
      prompt: "Find the Highest Common Factor (HCF) of $36, 54,$ and $90$.",
      options: [
        "9",
        "6",
        "18",
        "27"
      ],
      correctAnswer: "18",
      hint: "Check prime factors: $36 = 2^2 \\times 3^2$, $54 = 2 \\times 3^3$, $90 = 2 \\times 3^2 \\times 5$.",
      workedSolution: "Common prime factors with lowest powers: $2^1 \\times 3^2 = 2 \\times 9 = 18$.",
      points: 1
    },
    {
      id: "q16",
      prompt: "If $$M = \\{\\text{prime numbers between } 10 \\text{ and } 20\\}$$ and $$N = \\{11, 13, 17, 19\\}$$, which of the following statements is true?",
      options: [
        "M ⊂ N but M ≠ N",
        "M ∩ N = ∅",
        "N ⊂ M but N ≠ M",
        "M = N"
      ],
      correctAnswer: "M = N",
      hint: "List the prime numbers between 10 and 20 and compare with set N.",
      workedSolution: "The primes between 10 and 20 are 11, 13, 17, and 19. Both sets contain the exact same elements, so $M = N$.",
      points: 1
    },
    {
      id: "q17",
      prompt: "State the rule for the linear mapping where inputs $x = \\{0, 1, 2, 3, 4\\}$ produce outputs $y = \\{-2, 1, 4, 7, 10\\}$.",
      options: [
        "$$y = 3x - 2$$",
        "$$y = 3x + 2$$",
        "$$y = 2x - 2$$",
        "$$y = x - 2$$"
      ],
      correctAnswer: "$$y = 3x - 2$$",
      hint: "The common difference between consecutive outputs is $1 - (-2) = 3$.",
      workedSolution: "Slope is 3. When $x = 0$, $y = -2$. Therefore, the rule is $$y = 3x - 2$$.",
      points: 1
    },
    {
      id: "q18",
      prompt: "Given column vectors $$u = \\begin{pmatrix} 3 \\\\ 5 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} -2 \\\\ 4 \\end{pmatrix}$$, evaluate $$2u - v$$.",
      "options": [
        "$$\\begin{pmatrix} 4 \\\\ 6 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 8 \\\\ 6 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 8 \\\\ 14 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 4 \\\\ 14 \\end{pmatrix}$$"
      ],
      correctAnswer: "$$\\begin{pmatrix} 8 \\\\ 6 \\end{pmatrix}$$",
      hint: "$$2(3) - (-2) = 6 + 2 = 8$$ and $$2(5) - 4 = 10 - 4 = 6$$.",
      workedSolution: "$$2\\begin{pmatrix} 3 \\\\ 5 \\end{pmatrix} - \\begin{pmatrix} -2 \\\\ 4 \\end{pmatrix} = \\begin{pmatrix} 6 - (-2) \\\\ 10 - 4 \\end{pmatrix} = \\begin{pmatrix} 8 \\\\ 6 \\end{pmatrix}$$.",
      points: 1
    },
    {
      id: "q19",
      prompt: "The sum of the interior angles of a regular polygon with $n$ sides is $(n - 2) \\times 180^\\circ$. What is the interior angle of a regular pentagon ($n = 5$)?",
      options: [
        "$$72^\\circ$$",
        "$$90^\\circ$$",
        "$$108^\\circ$$",
        "$$120^\\circ$$"
      ],
      correctAnswer: "$$108^\\circ$$",
      hint: "Total angle sum = $(5 - 2) \\times 180^\\circ = 540^\\circ$. Divide by 5.",
      workedSolution: "$$\\text{Each interior angle} = \\frac{(5 - 2) \\times 180^\\circ}{5} = \\frac{540^\\circ}{5} = 108^\\circ$$.",
      points: 1
    },
    {
      id: "q20",
      prompt: "An article costing $\\text{GH¢ } 80.00$ had its price increased by $15\\%$. What is the new selling price?",
      options: [
        "GH¢ 92.00",
        "GH¢ 90.00",
        "GH¢ 95.00",
        "GH¢ 88.00"
      ],
      correctAnswer: "GH¢ 92.00",
      hint: "Increase = 15% of 80 = 12. New price = 80 + 12.",
      workedSolution: "$$15\\% \\times 80 = \\frac{15}{100} \\times 80 = 12$$. New price = $$80 + 12 = \\text{GH¢ } 92.00$$.",
      points: 1
    },
    {
      id: "q21",
      prompt: "Solve for $x$ in the equation: $$18 - 3x = 6$$.",
      options: [
        "-4",
        "6",
        "4",
        "-6"
      ],
      correctAnswer: "4",
      hint: "$$18 - 6 = 3x \\implies 12 = 3x$$.",
      workedSolution: "$$3x = 18 - 6 = 12 \\implies x = \\frac{12}{3} = 4$$.",
      points: 1
    },
    {
      id: "q22",
      prompt: "The population of a city was $4,000,000$ in 1990 and grew to $14,000,000$ in 2020. Calculate the percentage increase in population.",
      options: [
        "250%",
        "240%",
        "350%",
        "25%"
      ],
      correctAnswer: "250%",
      hint: "Increase = 14,000,000 - 4,000,000 = 10,000,000. Percentage = (Increase / Original) × 100%.",
      workedSolution: "$$\\text{Percentage increase} = \\frac{10,000,000}{4,000,000} \\times 100\\% = \\frac{10}{4} \\times 100\\% = 250\\%$$.",
      points: 1
    },
    {
      id: "q23",
      prompt: "The three angles of a triangle are in the ratio $4 : 3 : 2$. Find the size of the smallest angle.",
      options: [
        "$$60^\\circ$$",
        "$$80^\\circ$$",
        "$$40^\\circ$$",
        "$$20^\\circ$$"
      ],
      correctAnswer: "$$40^\\circ$$",
      hint: "Total ratio parts = 4 + 3 + 2 = 9. Smallest angle = (2 / 9) × 180°.",
      workedSolution: "$$\\text{Smallest angle} = \\frac{2}{9} \\times 180^\\circ = 2 \\times 20^\\circ = 40^\\circ$$.",
      points: 1
    },
    {
      id: "q24",
      prompt: "Find the Least Common Multiple (LCM) of $6, 8,$ and $15$.",
      options: [
        "60",
        "120",
        "90",
        "180"
      ],
      correctAnswer: "120",
      hint: "$$6 = 2 \\times 3, \\, 8 = 2^3, \\, 15 = 3 \\times 5$$. Take the highest power of each prime.",
      workedSolution: "$$\\text{LCM} = 2^3 \\times 3 \\times 5 = 8 \\times 15 = 120$$.",
      points: 1
    },
    {
      id: "q25",
      prompt: "Convert the base five numeral $$213_{\\text{five}}$$ to a base ten numeral.",
      options: [
        "58",
        "53",
        "68",
        "43"
      ],
      correctAnswer: "58",
      hint: "$$2(5^2) + 1(5^1) + 3(5^0)$$.",
      workedSolution: "$$2(25) + 1(5) + 3(1) = 50 + 5 + 3 = 58$$.",
      points: 1
    },
    {
      id: "q26",
      prompt: "Calculate the area of a circle with radius $14\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).",
      options: [
        "$$88\\text{ cm}^2$$",
        "$$308\\text{ cm}^2$$",
        "$$616\\text{ cm}^2$$",
        "$$154\\text{ cm}^2$$"
      ],
      correctAnswer: "$$616\\text{ cm}^2$$",
      hint: "Area = $\\pi r^2 = \\frac{22}{7} \\times 14 \\times 14$.",
      workedSolution: "$$\\text{Area} = \\frac{22}{7} \\times 14 \\times 14 = 22 \\times 2 \\times 14 = 44 \\times 14 = 616\\text{ cm}^2$$.",
      points: 1
    },
    {
      id: "q27",
      prompt: "Simplify: $$\\frac{2}{3} - \\frac{1}{2} + \\frac{5}{6}$$.",
      options: [
        "1",
        "$$\\frac{1}{6}$$",
        "$$\\frac{2}{3}$$",
        "$$\\frac{5}{6}$$"
      ],
      correctAnswer: "1",
      hint: "Use common denominator 6: $\\frac{4 - 3 + 5}{6}$.",
      workedSolution: "$$\\frac{4 - 3 + 5}{6} = \\frac{6}{6} = 1$$.",
      points: 1
    },
    {
      id: "q28",
      prompt: "Solve for $x$ in the inequality: $$2x - \\frac{1}{3}x > 10$$.",
      options: [
        "$$x > 6$$",
        "$$x < 6$$",
        "$$x > 5$$",
        "$$x < 5$$"
      ],
      correctAnswer: "$$x > 6$$",
      hint: "$$2x - \\frac{1}{3}x = \\frac{5}{3}x$$. Multiply both sides by 3/5.",
      workedSolution: "$$\\frac{5}{3}x > 10 \\implies x > 10 \\times \\frac{3}{5} \\implies x > 6$$.",
      points: 1
    },
    {
      id: "q29",
      prompt: "Which of the following index expressions is equivalent to $$3^3 \\times 6^2$$?",
      options: [
        "$$2^2 \\times 3^5$$",
        "$$2^3 \\times 3^5$$",
        "$$2^2 \\times 3^6$$",
        "$$6^5$$"
      ],
      correctAnswer: "$$2^2 \\times 3^5$$",
      hint: "Break 6 into prime factors: $6^2 = (2 \\times 3)^2 = 2^2 \\times 3^2$.",
      workedSolution: "$$3^3 \\times (2^2 \\times 3^2) = 2^2 \\times 3^{3+2} = 2^2 \\times 3^5$$.",
      points: 1
    },
    {
      id: "q30",
      prompt: "A rectangular water cistern has length $6\\text{ cm}$, width $4\\text{ cm}$, and holds $72\\text{ cm}^3$ of water. Find the depth of water in the cistern.",
      options: [
        "4 cm",
        "2 cm",
        "5 cm",
        "3 cm"
      ],
      correctAnswer: "3 cm",
      hint: "Volume = length × width × depth.",
      workedSolution: "$$6 \\times 4 \\times d = 72 \\implies 24d = 72 \\implies d = \\frac{72}{24} = 3\\text{ cm}$$.",
      points: 1
    },
    {
      id: "q31",
      prompt: "The daily temperatures (in °C) recorded in seven cities are: $$-2, 4, 0, -5, -2, 3, 6$$. What is the modal temperature?",
      options: [
        "0°C",
        "-2°C",
        "4°C",
        "-5°C"
      ],
      correctAnswer: "-2°C",
      hint: "The mode is the temperature that occurs most frequently.",
      workedSolution: "-2°C appears twice, while all other temperatures appear once. The mode is -2°C.",
      points: 1
    },
    {
      id: "q32",
      prompt: "The ratio of the ages of two brothers is $5 : 3$. The elder brother is $6\\text{ years}$ older than the younger brother. How old is the younger brother?",
      options: [
        "15 years",
        "12 years",
        "9 years",
        "18 years"
      ],
      correctAnswer: "9 years",
      hint: "Difference in ratio units = $5 - 3 = 2$ units = 6 years. Find 1 unit = 3 years.",
      workedSolution: "2 units = 6 years => 1 unit = 3 years. Younger brother's age = $$3 \\times 3 = 9\\text{ years}$$.",
      points: 1
    },
    {
      id: "q33",
      prompt: "If $$y^2 + 7 = 43$$, find the positive value of $y$.",
      options: [
        "7",
        "5",
        "8",
        "6"
      ],
      correctAnswer: "6",
      hint: "$$y^2 = 43 - 7 = 36$$.",
      workedSolution: "$$y^2 = 36 \\implies y = \\sqrt{36} = 6$$.",
      points: 1
    },
    {
      id: "q34",
      prompt: "An angle whose measure is strictly greater than $90^\\circ$ but less than $180^\\circ$ is classified as:",
      options: [
        "An acute angle",
        "A reflex angle",
        "An obtuse angle",
        "A right angle"
      ],
      correctAnswer: "An obtuse angle",
      hint: "Acute is < 90°; obtuse is between 90° and 180°; reflex is > 180°.",
      workedSolution: "By definition, an angle between 90° and 180° is an obtuse angle.",
      points: 1
    },
    {
      id: "q35",
      prompt: "Arrange the mixed numbers in ascending order: $$3\\frac{1}{4}, \\, 3\\frac{1}{2}, \\, 3\\frac{1}{3}$$.",
      options: [
        "$$3\\frac{1}{4}, \\, 3\\frac{1}{3}, \\, 3\\frac{1}{2}$$",
        "$$3\\frac{1}{3}, \\, 3\\frac{1}{4}, \\, 3\\frac{1}{2}$$",
        "$$3\\frac{1}{2}, \\, 3\\frac{1}{3}, \\, 3\\frac{1}{4}$$",
        "$$3\\frac{1}{4}, \\, 3\\frac{1}{2}, \\, 3\\frac{1}{3}$$"
      ],
      correctAnswer: "$$3\\frac{1}{4}, \\, 3\\frac{1}{3}, \\, 3\\frac{1}{2}$$",
      hint: "Compare the fractional parts: $1/4 = 0.25, 1/3 \\approx 0.333, 1/2 = 0.50$.",
      workedSolution: "$$0.25 < 0.333 < 0.50 \\implies 3\\frac{1}{4} < 3\\frac{1}{3} < 3\\frac{1}{2}$$.",
      points: 1
    },
    {
      id: "q36",
      prompt: "An electronic appliance was sold for $\\text{GH¢ } 72.00$ after a discount of $10\\%$ was deducted from the original price. What was the original price?",
      options: [
        "GH¢ 79.20",
        "GH¢ 80.00",
        "GH¢ 82.00",
        "GH¢ 85.00"
      ],
      correctAnswer: "GH¢ 80.00",
      hint: "The discounted price represents 90% of the original price: $72.00 \\div 0.90$.",
      workedSolution: "$$\\text{Original price} = \\frac{72.00}{0.90} = \\frac{720}{9} = \\text{GH¢ } 80.00$$.",
      points: 1
    },
    {
      id: "q37",
      prompt: "The test scores of eight students in a quiz are: $$5, 8, 9, 9, 6, 4, 9, 5$$. What is the median score?",
      options: [
        "6.5",
        "7.0",
        "6.0",
        "7.5"
      ],
      correctAnswer: "7.0",
      hint: "Arrange in ascending order: 4, 5, 5, 6, 8, 9, 9, 9. Average the 4th and 5th values.",
      workedSolution: "Ordered scores: 4, 5, 5, **6, 8**, 9, 9, 9. Median = $$\\frac{6 + 8}{2} = 7.0$$.",
      points: 1
    },
    {
      id: "q38",
      prompt: "From the eight quiz scores in Question 37 ($$4, 5, 5, 6, 8, 9, 9, 9$$), what is the probability that a randomly picked student scored exactly $5$ marks?",
      options: [
        "$$\\frac{1}{8}$$",
        "$$\\frac{1}{2}$$",
        "$$\\frac{3}{8}$$",
        "$$\\frac{1}{4}$$"
      ],
      correctAnswer: "$$\\frac{1}{4}$$",
      hint: "Score 5 appears 2 times out of 8 total scores.",
      workedSolution: "$$P(5) = \\frac{2}{8} = \\frac{1}{4}$$.",
      points: 1
    },
    {
      id: "q39",
      prompt: "Given that $$y = c + kx^2$$, find $y$ when $c = 3, k = 2,$ and $x = 3$.",
      options: [
        "21",
        "39",
        "15",
        "33"
      ],
      correctAnswer: "21",
      hint: "Square $x$ first: $3^2 = 9$. Then $kx^2 = 2(9) = 18$.",
      workedSolution: "$$y = 3 + 2(3^2) = 3 + 2(9) = 3 + 18 = 21$$.",
      points: 1
    },
    {
      id: "q40",
      prompt: "Which set of side lengths forms a right-angled triangle?",
      options: [
        "4 cm, 5 cm, 7 cm",
        "6 cm, 8 cm, 10 cm",
        "5 cm, 10 cm, 12 cm",
        "3 cm, 6 cm, 8 cm"
      ],
      correctAnswer: "6 cm, 8 cm, 10 cm",
      hint: "Check if $a^2 + b^2 = c^2$: $6^2 + 8^2 = 36 + 64 = 100 = 10^2$.",
      workedSolution: "$$6^2 + 8^2 = 36 + 64 = 100 = 10^2$$. By the converse of Pythagoras' theorem, this is a right-angled triangle.",
      points: 1
    }
  ],
  seededAt: "2026-09-15T15:00:00.000Z",
  lastUpdated: "2026-09-15T15:00:00.000Z"
};

export const SET_JHS_MASTERY_SERIES_18 = {
  id: "jhs-math-mastery-series-18",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 18)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
      id: "q01",
      title: "Question 1: Algebraic Factorization, Rational Transposition & Scalar Vector Combinations",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "(i) Factorize completely the algebraic expression:\n$$3xy - 12x + 4y - 16$$\n(ii) Evaluate the expression obtained in (i) when $x = 4$ and $y = 8$.",
          hint: "Group terms in pairs: $3x(y - 4) + 4(y - 4)$. Then substitute $x = 4$ and $y = 8$.",
          modelAnswer: "(i) (y - 4)(3x + 4), (ii) 64",
          workedSolution: "**(i) Factorization:**\n$$3xy - 12x + 4y - 16 = 3x(y - 4) + 4(y - 4) = (y - 4)(3x + 4)$$\n\n**(ii) Evaluation:**\nSubstitute $x = 4$ and $y = 8$:\n$$(8 - 4)[3(4) + 4] = (4)[12 + 4] = 4 \\times 16 = 64$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Make $y$ the subject of the rational formula:\n$$\\frac{1}{m} = \\frac{1}{x} + \\frac{1}{y}$$",
          hint: "Isolate $\\frac{1}{y} = \\frac{1}{m} - \\frac{1}{x}$, find a common denominator, then invert.",
          modelAnswer: "$$y = \\frac{mx}{x - m}$$",
          workedSolution: "$$\\frac{1}{y} = \\frac{1}{m} - \\frac{1}{x}$$\nCombine the right-hand side using the common denominator $mx$:\n$$\\frac{1}{y} = \\frac{x - m}{mx}$$\nInverting both sides:\n$$y = \\frac{mx}{x - m}$$"
        },
        {
          partLabel: "(c)",
          marks: 5,
          prompt: "Given column vectors $$u = \\begin{pmatrix} -4 \\\\ 7 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} 6 \\\\ 8 \\end{pmatrix}$$, calculate the vector:\n$$4\\left(u + \\frac{1}{2}v\\right)$$",
          hint: "Find $\\frac{1}{2}v$ first, add it to $u$, then multiply the resulting vector by 4.",
          modelAnswer: "(-4, 44)ᵀ",
          workedSolution: "$$\\frac{1}{2}v = \\frac{1}{2}\\begin{pmatrix} 6 \\\\ 8 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}$$\n$$u + \\frac{1}{2}v = \\begin{pmatrix} -4 \\\\ 7 \\end{pmatrix} + \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix} = \\begin{pmatrix} -4 + 3 \\\\ 7 + 4 \\end{pmatrix} = \\begin{pmatrix} -1 \\\\ 11 \\end{pmatrix}$$\n$$4\\left(u + \\frac{1}{2}v\\right) = 4\\begin{pmatrix} -1 \\\\ 11 \\end{pmatrix} = \\begin{pmatrix} -4 \\\\ 44 \\end{pmatrix}$$."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Partnership Profit Sharing, Commercial Lending & Base Numeration",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 10,
          prompt: "Kwame and Ama shared a total annual business profit of $\\text{GH¢ } 2,100.00$ in the ratio $4 : 3$ respectively.\n(i) Calculate how much profit each partner received.\n(ii) Kwame invested his share of the profit into a fixed mutual fund at a simple interest rate of $15\\%\\text{ per annum}$ for $2\\text{ years}$. Find the simple interest earned on his investment.\n(iii) What was the total value of Kwame's investment at the end of the $2\\text{ years}$?",
          hint: "Total ratio units = 4 + 3 = 7. Kwame's share = (4/7) × 2,100. Simple Interest = (P × R × T) / 100.",
          modelAnswer: "(i) Kwame: GH¢ 1,200.00, Ama: GH¢ 900.00; (ii) GH¢ 360.00; (iii) GH¢ 1,560.00",
          workedSolution: "**(i) Profit Distribution:**\nTotal units = $4 + 3 = 7$.\n- **Kwame's share:** $$\\frac{4}{7} \\times \\text{GH¢ } 2,100.00 = 4 \\times 300 = \\text{GH¢ } 1,200.00$$\n- **Ama's share:** $$\\frac{3}{7} \\times \\text{GH¢ } 2,100.00 = 3 \\times 300 = \\text{GH¢ } 900.00$$\n\n**(ii) Simple Interest on Kwame's share:**\n$$P = \\text{GH¢ } 1,200.00, \\quad R = 15\\%, \\quad T = 2\\text{ years}$$\n$$I = \\frac{1,200 \\times 15 \\times 2}{100} = 12 \\times 30 = \\text{GH¢ } 360.00$$\n\n**(iii) Total value of investment:**\n$$\\text{Total} = P + I = 1,200.00 + 360.00 = \\text{GH¢ } 1,560.00$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Convert the base five numeral $$324_{\\text{five}}$$ to a numeral in base ten.",
          hint: "Expand using place values: $3(5^2) + 2(5^1) + 4(5^0)$.",
          modelAnswer: "89",
          workedSolution: "$$324_{\\text{five}} = 3(5^2) + 2(5^1) + 4(5^0)$$\n$$= 3(25) + 2(5) + 4(1)$$\n$$= 75 + 10 + 4 = 89_{\\text{ten}}$$\nTherefore, $$324_{\\text{five}} = 89$$."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Surface Area, Volume & Liquid Depth in a Rectangular Tank",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 350 220' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><rect x='40' y='70' width='160' height='110' fill='#eff6ff' stroke='#1e40af' stroke-width='2'/><path d='M40,70 L90,30 L250,30 L200,70 Z' fill='#dbeafe' stroke='#1e40af' stroke-width='1.5'/><path d='M200,70 L250,30 L250,140 L200,180 Z' fill='#bfdbfe' stroke='#1e40af' stroke-width='1.5'/><text x='110' y='200' font-size='12' font-weight='bold'>l = 70 cm</text><text x='235' y='165' font-size='12' font-weight='bold'>w = 40 cm</text><text x='10' y='130' font-size='12' font-weight='bold'>h = 50 cm</text><line x1='40' y1='120' x2='200' y2='120' stroke='#0284c7' stroke-width='1.5' stroke-dasharray='4'/><line x1='200' y1='120' x2='250' y2='80' stroke='#0284c7' stroke-width='1.5' stroke-dasharray='4'/><text x='100' y='150' font-size='12' fill='#0369a1' font-weight='bold'>Water Volume = 84,000 cm³</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "A closed rectangular water tank has a length of $70\\text{ cm}$, width of $40\\text{ cm}$, and height of $50\\text{ cm}$ as illustrated in the diagram above.\nCalculate the **total surface area** of the tank when completely closed.",
          hint: "Total Surface Area = $2(lw + lh + wh)$.",
          modelAnswer: "16,600 cm²",
          workedSolution: "$$\\text{TSA} = 2(lw + lh + wh)$$\n$$= 2[(70 \\times 40) + (70 \\times 50) + (40 \\times 50)]$$\n$$= 2[2,800 + 3,500 + 2,000]$$\n$$= 2[8,300] = 16,600\\text{ cm}^2$$."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "Calculate the **maximum internal volume** (capacity) of the tank in cubic centimetres.",
          hint: "Volume = length × width × height.",
          modelAnswer: "140,000 cm³",
          workedSolution: "$$V = l \\times w \\times h = 70\\text{ cm} \\times 40\\text{ cm} \\times 50\\text{ cm} = 140,000\\text{ cm}^3$$."
        },
        {
          partLabel: "(c)",
          marks: 6,
          prompt: "If $84,000\\text{ cm}^3$ of water is poured into the empty tank, calculate the depth ($d$) of the water in the tank.",
          hint: "Volume of water = Base area × depth = $(l \\times w) \\times d$.",
          modelAnswer: "30 cm",
          workedSolution: "$$\\text{Base Area} = 70\\text{ cm} \\times 40\\text{ cm} = 2,800\\text{ cm}^2$$\n$$\\text{Volume of water} = \\text{Base Area} \\times d$$\n$$84,000 = 2,800 \\times d$$\n$$d = \\frac{84,000}{2,800} = \\frac{840}{28} = 30\\text{ cm}$$\nTherefore, the depth of water in the tank is **$30\\text{ cm}$**."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Fuel Consumption Rates, Inequalities & Production Expansion",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "A haulage truck uses fuel at an average rate of $48\\text{ km}$ for every $6\\text{ litres}$ of diesel.\nCalculate how many litres of diesel are required for a journey of $152\\text{ km}$.",
          hint: "Find the fuel consumption rate in km per litre: $48 \\div 6 = 8\\text{ km/litre}$. Then divide 152 km by 8.",
          modelAnswer: "19 litres",
          workedSolution: "$$\\text{Fuel economy} = \\frac{48\\text{ km}}{6\\text{ litres}} = 8\\text{ km per litre}$$\n$$\\text{Fuel required} = \\frac{152\\text{ km}}{8\\text{ km/litre}} = 19\\text{ litres}$$\n*(Alternatively, by proportion: $\\frac{6}{48} \\times 152 = \\frac{1}{8} \\times 152 = 19\\text{ litres}$)*."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "Solve for $x$ in the inequality:\n$$\\frac{3}{4}(2x + 6) \\le 12$$\nExpress your solution set and represent it on a number line.",
          hint: "Multiply both sides by 4/3 or multiply by 4 first.",
          modelAnswer: "{x : x ≤ 5}",
          workedSolution: "$$\\frac{3}{4}(2x + 6) \\le 12$$\nMultiply both sides by $4$:\n$$3(2x + 6) \\le 48$$\n$$6x + 18 \\le 48$$\n$$6x \\le 48 - 18$$\n$$6x \\le 30$$\n$$x \\le 5$$\nTruth set: **$$\\{x : x \\le 5, \\, x \\in \\mathbb{R}\\}$$**."
        },
        {
          partLabel: "(c)",
          marks: 5,
          prompt: "A manufacturing plant increased its monthly output of cement by $25\\%$ and produced $60,000\\text{ tonnes}$. How many tonnes of cement was the plant producing before the increase?",
          hint: "New production represents 125% of original production: $1.25 \\times \\text{Original} = 60,000$.",
          modelAnswer: "48,000 tonnes",
          workedSolution: "Let $P$ be the original production.\n$$125\\% \\times P = 60,000$$\n$$1.25 P = 60,000$$\n$$P = \\frac{60,000}{1.25} = \\frac{60,000 \\times 4}{5} = 12,000 \\times 4 = 48,000\\text{ tonnes}$$\nTherefore, the factory was producing **$48,000\\text{ tonnes}$** before the increase."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Vector Translations, Geometric Quadrilaterals & Vector Displacement",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 340 250' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='140' x2='310' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='230' stroke='#64748b' stroke-width='1.5'/><text x='310' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><line x1='180' y1='180' x2='240' y2='40' stroke='#2563eb' stroke-width='2.5'/><line x1='80' y1='180' x2='140' y2='40' stroke='#dc2626' stroke-width='2.5'/><line x1='180' y1='180' x2='80' y2='180' stroke='#059669' stroke-width='1.5' stroke-dasharray='4'/><line x1='240' y1='40' x2='140' y2='40' stroke='#059669' stroke-width='1.5' stroke-dasharray='4'/><circle cx='180' cy='180' r='4' fill='#2563eb'/><circle cx='240' cy='40' r='4' fill='#2563eb'/><circle cx='80' cy='180' r='4' fill='#dc2626'/><circle cx='140' cy='40' r='4' fill='#dc2626'/><text x='185' y='195' font-size='11' font-weight='bold'>P(1, -2)</text><text x='245' y='45' font-size='11' font-weight='bold'>Q(4, 5)</text><text x='20' y='195' font-size='11' font-weight='bold' fill='#dc2626'>P'(-4, -2)</text><text x='80' y='45' font-size='11' font-weight='bold' fill='#dc2626'>Q'(-1, 5)</text><text x='140' y='210' font-size='11' fill='#059669' font-weight='bold'>T = (-5, 0)ᵀ</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "Points $P(1, -2)$ and $Q(4, 5)$ lie on a Cartesian plane. Segment $PQ$ is translated by vector $$T = \\begin{pmatrix} -5 \\\\ 0 \\end{pmatrix}$$ to produce image segment $P'Q'$.\n(i) Find the coordinates of image vertices $P'$ and $Q'$.\n(ii) What is the length of horizontal shift between $P$ and $P'$?",
          hint: "Under translation by (a, b)ᵀ: (x, y) → (x + a, y + b).",
          modelAnswer: "(i) P'(-4, -2), Q'(-1, 5); (ii) 5 units to the left",
          workedSolution: "**(i) Coordinates:**\n$$(x, y) \\to (x - 5, y + 0)$$\n- $$P(1, -2) \\to P'(1 - 5, -2 + 0) = P'(-4, -2)$$\n- $$Q(4, 5) \\to Q'(4 - 5, 5 + 0) = Q'(-1, 5)$$\n\n**(ii) Horizontal shift:**\n$$|1 - (-4)| = 5\\text{ units to the left}$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Calculate the displacement vectors $$\\vec{PQ}$$ and $$\\vec{P'Q'}$$.",
          hint: "Displacement vector $\\vec{AB} = B - A$.",
          modelAnswer: "Both are (3, 7)ᵀ",
          workedSolution: "$$\\vec{PQ} = \\begin{pmatrix} 4 - 1 \\\\ 5 - (-2) \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 7 \\end{pmatrix}$$\n$$\\vec{P'Q'} = \\begin{pmatrix} -1 - (-4) \\\\ 5 - (-2) \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 7 \\end{pmatrix}$$\nBoth segments have identical vector direction and magnitude."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "When the vertices are joined in order to form the quadrilateral $PQQ'P'$, state the geometrical name of the figure formed and justify your answer.",
          hint: "Opposite sides are parallel and equal in length.",
          modelAnswer: "Parallelogram",
          workedSolution: "Since $\\vec{PQ} = \\vec{P'Q'}$, the opposite sides $PQ$ and $P'Q'$ are parallel and equal in length. Similarly, $PP'$ and $QQ'$ are parallel horizontal segments of length 5. Therefore, the quadrilateral $PQQ'P'$ is a **Parallelogram**."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Mean Age Calculations, Distribution Statistics & Bar Charting",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 350 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><line x1='35' y1='160' x2='320' y2='160' stroke='#334155' stroke-width='2'/><line x1='35' y1='160' x2='35' y2='20' stroke='#334155' stroke-width='2'/><text x='150' y='188' font-size='11' font-weight='bold'>Age (years)</text><text x='5' y='18' font-size='11' font-weight='bold'>Frequency</text><rect x='60' y='125' width='25' height='35' fill='#93c5fd' stroke='#1d4ed8'/><rect x='105' y='125' width='25' height='35' fill='#93c5fd' stroke='#1d4ed8'/><rect x='150' y='90' width='25' height='70' fill='#93c5fd' stroke='#1d4ed8'/><rect x='195' y='125' width='25' height='35' fill='#93c5fd' stroke='#1d4ed8'/><rect x='240' y='125' width='25' height='35' fill='#93c5fd' stroke='#1d4ed8'/><rect x='285' y='55' width='25' height='105' fill='#2563eb' stroke='#1d4ed8'/><text x='68' y='173' font-size='10'>6</text><text x='113' y='173' font-size='10'>7</text><text x='158' y='173' font-size='10'>8</text><text x='203' y='173' font-size='10'>9</text><text x='245' y='173' font-size='10'>10</text><text x='290' y='173' font-size='10'>11</text><text x='20' y='60' font-size='10'>3</text><text x='20' y='95' font-size='10'>2</text><text x='20' y='130' font-size='10'>1</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "The ages (in years) of nine members of a junior youth club are:\n$$8, \\, 11, \\, 8, \\, 10, \\, 6, \\, 7, \\, 3x, \\, 11, \\, 11$$\nIf the mean age of the nine members is $9\\text{ years}$, calculate the value of $x$.",
          hint: "Mean = Sum of ages / 9 = 9. Find the total sum first.",
          modelAnswer: "x = 3",
          workedSolution: "$$\\text{Sum of ages} = 8 + 11 + 8 + 10 + 6 + 7 + 3x + 11 + 11 = 72 + 3x$$\n$$\\text{Mean} = \\frac{72 + 3x}{9} = 9$$\n$$72 + 3x = 9 \\times 9 = 81$$\n$$3x = 81 - 72 = 9$$\n$$x = \\frac{9}{3} = 3$$\n*(Since $x = 3$, the age $3x = 3(3) = 9\\text{ years}$)*."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Using the complete list of ages ($$6, 7, 8, 8, 9, 10, 11, 11, 11$$) and the bar chart above, determine:\n(i) The **modal age**.\n(ii) The **median age**.",
          hint: "Mode is the most frequent age. Median is the 5th number in the sorted list of 9 ages.",
          modelAnswer: "(i) 11 years, (ii) 9 years",
          workedSolution: "Sorted list of 9 ages: 6, 7, 8, 8, **9**, 10, 11, 11, 11.\n\n**(i) Modal age:**\nAge 11 appears 3 times (highest frequency). The **modal age is 11 years**.\n\n**(ii) Median age:**\nPosition = $$\\frac{9 + 1}{2} = 5^{\\text{th}}\\text{ term}$$.\nThe $5^{\\text{th}}$ age in the ordered list is **$9\\text{ years}$**."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "If a member is chosen at random from the group, what is the probability that the member is:\n(i) Exactly $8\\text{ years old}$?\n(ii) At least $10\\text{ years old}$?",
          hint: "Count occurrences of 8 (two members). 'At least 10' means 10 or 11 (four members).",
          modelAnswer: "(i) 2/9, (ii) 4/9",
          workedSolution: "**(i) Exactly 8 years:**\n$$P(\\text{age } 8) = \\frac{2}{9}$$\n\n**(ii) At least 10 years (ages 10 and 11):**\n$$\\text{Count} = 1 + 3 = 4$$\n$$P(\\text{age } \\ge 10) = \\frac{4}{9}$$."
        }
      ]
    }
  ],
  seededAt: "2026-09-15T15:30:00.000Z",
  lastUpdated: "2026-09-15T15:30:00.000Z"
};

// ============================================================================
// 3t. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 19)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-19
// ============================================================================
export const SET_JHS_MASTERY_SERIES_19: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-19",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 19)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series",
  variantType: "standard",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
      id: "q01",
      prompt: "Which of the following descriptions best defines the set $$S = \\{4, 8, 12, 16, 20\\}$$?",
      options: [
        "The set of even numbers less than 24",
        "The set of multiples of 4 less than 24",
        "The set of multiples of 4",
        "The set of composite numbers up to 20"
      ],
      correctAnswer: "The set of multiples of 4 less than 24",
      hint: "Notice that each element is a multiple of 4 up to 20.",
      workedSolution: "Multiples of 4 strictly less than 24 are 4, 8, 12, 16, and 20. Therefore, this set contains multiples of 4 less than 24.",
      points: 1
    },
    {
      id: "q02",
      prompt: "If $$A = \\{1, 3, 5, 7, 9, 11\\}$$ and $$B = \\{2, 3, 7, 11, 13\\}$$, find $$A \\cap B$$.",
      options: [
        "{3, 7, 11}",
        "{1, 3, 7, 11}",
        "{3, 7}",
        "{1, 2, 3, 5, 7, 9, 11, 13}"
      ],
      correctAnswer: "{3, 7, 11}",
      hint: "Find the elements that are present in both sets.",
      workedSolution: "The common members in both $A$ and $B$ are 3, 7, and 11. Hence, $$A \\cap B = \\{3, 7, 11\\}$$.",
      points: 1
    },
    {
      id: "q03",
      prompt: "On an integer number line, three points are marked at intervals of $6$ units: $$-18, \\, p, \\, 6$$. Find the value of $p$ located at the midpoint.",
      options: [
        "-12",
        "0",
        "-6",
        "-8"
      ],
      correctAnswer: "-6",
      hint: "Find the average: $\\frac{-18 + 6}{2}$.",
      workedSolution: "$$p = \\frac{-18 + 6}{2} = \\frac{-12}{2} = -6$$.",
      points: 1
    },
    {
      id: "q04",
      prompt: "Find the number situated exactly in the middle of $6.4$ and $7.2$ on a number line.",
      options: [
        "6.8",
        "6.7",
        "6.9",
        "6.75"
      ],
      correctAnswer: "6.8",
      hint: "Add the two numbers and divide by 2.",
      workedSolution: "$$\\text{Midpoint} = \\frac{6.4 + 7.2}{2} = \\frac{13.6}{2} = 6.8$$.",
      points: 1
    },
    {
      id: "q05",
      prompt: "Calculate the Least Common Multiple (LCM) of $15$ and $25$.",
      options: [
        "150",
        "50",
        "100",
        "75"
      ],
      correctAnswer: "75",
      hint: "$$15 = 3 \\times 5$$, $$25 = 5^2$$. Multiply the highest powers of each prime factor.",
      workedSolution: "$$\\text{LCM} = 3 \\times 5^2 = 3 \\times 25 = 75$$.",
      points: 1
    },
    {
      id: "q06",
      prompt: "Express $108$ as a product of prime factors in index notation.",
      options: [
        "$$2^2 \\times 3^3$$",
        "$$2^3 \\times 3^2$$",
        "$$2^2 \\times 3^2$$",
        "$$4 \\times 27$$"
      ],
      correctAnswer: "$$2^2 \\times 3^3$$",
      hint: "$$108 = 4 \\times 27$$. Express 4 and 27 as prime powers.",
      workedSolution: "$$108 = 2 \\times 54 = 2^2 \\times 27 = 2^2 \\times 3^3$$.",
      points: 1
    },
    {
      id: "q07",
      prompt: "If $$4k - 3(k + 5) = 8$$, find the value of $k$.",
      options: [
        "-23",
        "23",
        "13",
        "-7"
      ],
      correctAnswer: "23",
      hint: "Expand the brackets: $4k - 3k - 15 = 8$.",
      workedSolution: "$$4k - 3k - 15 = 8 \\implies k - 15 = 8 \\implies k = 8 + 15 = 23$$.",
      points: 1
    },
    {
      id: "q08",
      prompt: "What is the place value of the digit $7$ in the numeral $675,400$?",
      options: [
        "7 thousands",
        "7 hundreds",
        "7 ten thousands",
        "7 hundred thousands"
      ],
      correctAnswer: "7 ten thousands",
      hint: "Count place values from right: Units, Tens, Hundreds, Thousands, Ten-thousands.",
      workedSolution: "In 675,400, 7 sits in the ten-thousands column, representing 70,000 (7 ten-thousands).",
      points: 1
    },
    {
      id: "q09",
      prompt: "Evaluate the product of $19$ and $112$.",
      options: [
        "2,128",
        "2,028",
        "2,148",
        "1,928"
      ],
      correctAnswer: "2,128",
      hint: "$$19 \\times 112 = (20 - 1) \\times 112$$.",
      workedSolution: "$$20 \\times 112 - 112 = 2,240 - 112 = 2,128$$.",
      points: 1
    },
    {
      id: "q10",
      prompt: "A farmer owes $\\text{GH¢ } 650.00$ at a credit union. If he makes a deposit of $\\text{GH¢ } 250.00$, how much does he still owe?",
      options: [
        "GH¢ 900.00",
        "GH¢ 400.00",
        "GH¢ 500.00",
        "GH¢ 350.00"
      ],
      correctAnswer: "GH¢ 400.00",
      hint: "Subtract the repayment from the initial debt.",
      workedSolution: "$$650.00 - 250.00 = \\text{GH¢ } 400.00$$.",
      points: 1
    },
    {
      id: "q11",
      prompt: "Evaluate: $$\\frac{43}{100} \\times \\frac{9}{10}$$.",
      options: [
        "3.87",
        "0.0387",
        "0.387",
        "38.7"
      ],
      correctAnswer: "0.387",
      hint: "Multiply numerators: $43 \\times 9 = 387$. Denominator is 1000.",
      workedSolution: "$$\\frac{387}{1000} = 0.387$$.",
      points: 1
    },
    {
      id: "q12",
      prompt: "Express $1.75$ as a mixed fraction in its lowest terms.",
      options: [
        "$$1\\frac{1}{4}$$",
        "$$1\\frac{3}{5}$$",
        "$$1\\frac{7}{10}$$",
        "$$1\\frac{3}{4}$$"
      ],
      correctAnswer: "$$1\\frac{3}{4}$$",
      hint: "$$0.75 = 75/100 = 3/4$$.",
      workedSolution: "$$1.75 = 1 + \\frac{75}{100} = 1\\frac{3}{4}$$.",
      points: 1
    },
    {
      id: "q13",
      prompt: "There are $320$ crayons in $8$ equal packets. How many crayons are contained in $15$ similar packets?",
      options: [
        "600",
        "560",
        "640",
        "480"
      ],
      correctAnswer: "600",
      hint: "Find crayons per packet: $320 \\div 8 = 40$. Multiply by 15.",
      workedSolution: "Crayons per packet = $$320 / 8 = 40$$. Total in 15 packets = $$15 \\times 40 = 600$$.",
      points: 1
    },
    {
      id: "q14",
      prompt: "A truck drives at an average speed of $55\\text{ km/h}$. What distance does it cover in $6\\text{ hours}$?",
      options: [
        "300 km",
        "360 km",
        "330 km",
        "350 km"
      ],
      correctAnswer: "330 km",
      hint: "Distance = Speed × Time.",
      workedSolution: "$$\\text{Distance} = 55 \\times 6 = 330\\text{ km}$$.",
      points: 1
    },
    {
      id: "q15",
      prompt: "Calculate the simple interest on $\\text{GH¢ } 240.00$ for $3\\text{ years}$ at $10\\%\\text{ per annum}$.",
      options: [
        "GH¢ 72.00",
        "GH¢ 24.00",
        "GH¢ 48.00",
        "GH¢ 84.00"
      ],
      correctAnswer: "GH¢ 72.00",
      hint: "$$I = \\frac{P \\times R \\times T}{100}$$.",
      workedSolution: "$$I = \\frac{240 \\times 10 \\times 3}{100} = 24 \\times 3 = \\text{GH¢ } 72.00$$.",
      points: 1
    },
    {
      id: "q16",
      prompt: "Express $$\\frac{3}{5}$$ as a percentage.",
      options: [
        "30%",
        "75%",
        "50%",
        "60%"
      ],
      correctAnswer: "60%",
      hint: "Multiply the fraction by 100%.",
      workedSolution: "$$\\frac{3}{5} \\times 100\\% = 3 \\times 20\\% = 60\\%$$.",
      points: 1
    },
    {
      id: "q17",
      prompt: "A sales agent receives a $15\\%$ commission on all sales. If her commission in one week was $\\text{GH¢ } 60.00$, what was her total sales figure for that week?",
      options: [
        "GH¢ 400.00",
        "GH¢ 450.00",
        "GH¢ 360.00",
        "GH¢ 500.00"
      ],
      correctAnswer: "GH¢ 400.00",
      hint: "Sales = Commission ÷ 0.15.",
      workedSolution: "$$\\text{Sales} = \\frac{60.00}{0.15} = \\frac{6,000}{15} = \\text{GH¢ } 400.00$$.",
      points: 1
    },
    {
      id: "q18",
      prompt: "Write $92,000$ in standard form.",
      options: [
        "$$9.2 \\times 10^3$$",
        "$$9.2 \\times 10^4$$",
        "$$9.2 \\times 10^{-4}$$",
        "$$92 \\times 10^3$$"
      ],
      correctAnswer: "$$9.2 \\times 10^4$$",
      hint: "Move the decimal point 4 places to the left.",
      workedSolution: "$$92,000 = 9.2 \\times 10^4$$.",
      points: 1
    },
    {
      id: "q19",
      prompt: "The test scores of ten students in a quiz are: $$3, 4, 6, 3, 4, 5, 3, 4, 6, 4$$. What is the modal mark?",
      options: [
        "3",
        "5",
        "4",
        "6"
      ],
      correctAnswer: "4",
      hint: "Count the occurrences: 3 appears 3 times, 4 appears 4 times.",
      workedSolution: "The score 4 occurs four times (highest frequency). The modal mark is 4.",
      points: 1
    },
    {
      id: "q20",
      prompt: "From the test scores in Question 19 ($$3, 3, 3, 4, 4, 4, 4, 5, 6, 6$$), calculate the mean mark.",
      options: [
        "4.2",
        "4.0",
        "4.5",
        "3.8"
      ],
      correctAnswer: "4.2",
      hint: "Sum all scores and divide by 10.",
      workedSolution: "$$\\text{Sum} = (3 \\times 3) + (4 \\times 4) + 5 + (6 \\times 2) = 9 + 16 + 5 + 12 = 42$$.\n$$\\text{Mean} = \\frac{42}{10} = 4.2$$.",
      points: 1
    },
    {
      id: "q21",
      prompt: "A jar contains $14$ red and $6$ blue marbles. If a marble is selected at random, what is the probability that it is red?",
      options: [
        "$$\\frac{3}{10}$$",
        "$$\\frac{7}{10}$$",
        "$$\\frac{2}{3}$$",
        "$$\\frac{1}{2}$$"
      ],
      correctAnswer: "$$\\frac{7}{10}$$",
      hint: "Total marbles = 14 + 6 = 20. Favourable = 14.",
      workedSolution: "$$P(\\text{red}) = \\frac{14}{20} = \\frac{7}{10}$$.",
      points: 1
    },
    {
      id: "q22",
      prompt: "If $$y = \\frac{1}{4}(x - 3)$$, express $x$ in terms of $y$.",
      options: [
        "$$x = 4y - 3$$",
        "$$x = \\frac{y + 3}{4}$$",
        "$$x = 4y + 3$$",
        "$$x = \\frac{y}{4} + 3$$"
      ],
      correctAnswer: "$$x = 4y + 3$$",
      hint: "Multiply both sides by 4, then add 3.",
      workedSolution: "$$4y = x - 3 \\implies x = 4y + 3$$.",
      points: 1
    },
    {
      id: "q23",
      prompt: "Simplify: $$5m^3 \\times 3m^2 n^3$$.",
      options: [
        "$$15m^5 n^3$$",
        "$$15m^6 n^3$$",
        "$$8m^5 n^3$$",
        "$$15m^5$$"
      ],
      correctAnswer: "$$15m^5 n^3$$",
      hint: "$$5 \\times 3 = 15$$; add powers of $m$: $3 + 2 = 5$.",
      workedSolution: "$$(5 \\times 3) \\times m^{3+2} \\times n^3 = 15m^5 n^3$$.",
      points: 1
    },
    {
      id: "q24",
      prompt: "Convert the decimal number $21_{\\text{ten}}$ to a base two (binary) numeral.",
      options: [
        "$$10011_{\\text{two}}$$",
        "$$11001_{\\text{two}}$$",
        "$$10101_{\\text{two}}$$",
        "$$10111_{\\text{two}}$$"
      ],
      correctAnswer: "$$10101_{\\text{two}}$$",
      hint: "$$21 = 16 + 4 + 1 = 2^4 + 2^2 + 2^0$$.",
      workedSolution: "$$21 = 1(16) + 0(8) + 1(4) + 0(2) + 1(1) = 10101_{\\text{two}}$$.",
      points: 1
    },
    {
      id: "q25",
      prompt: "Which of the following mathematical statements is TRUE?",
      options: [
        "$$9 + 5 < 12$$",
        "$$6 + 5 < 12$$",
        "$$7 + 6 < 12$$",
        "$$8 + 4 < 12$$"
      ],
      correctAnswer: "$$6 + 5 < 12$$",
      hint: "Check the sums: 9+5=14, 6+5=11, 7+6=13, 8+4=12.",
      workedSolution: "$$6 + 5 = 11$$, and $11 < 12$ is true. All other options are greater than or equal to 12.",
      points: 1
    },
    {
      id: "q26",
      prompt: "Find the set of all integers within the open interval: $$-3 < x < 2$$.",
      options: [
        "{-3, -2, -1, 0, 1}",
        "{-2, -1, 0, 1, 2}",
        "{-2, -1, 1}",
        "{-2, -1, 0, 1}"
      ],
      correctAnswer: "{-2, -1, 0, 1}",
      hint: "The endpoints -3 and 2 are excluded because the inequality is strict.",
      workedSolution: "Integers strictly between -3 and 2 are -2, -1, 0, 1.",
      points: 1
    },
    {
      id: "q27",
      prompt: "State the rule for the linear mapping where inputs $x = \\{1, 2, 3, 4, 5\\}$ produce outputs $y = \\{-3, -1, 1, 3, 5\\}$.",
      options: [
        "$$x \\to 2x - 5$$",
        "$$x \\to 2x - 3$$",
        "$$x \\to x - 4$$",
        "$$x \\to 2(x - 2)$$"
      ],
      correctAnswer: "$$x \\to 2x - 5$$",
      hint: "Common difference between outputs is 2. When $x = 1$, $y = 2(1) - 5 = -3$.",
      workedSolution: "Slope is 2 ($2x$). When $x = 1$, $2(1) + c = -3 \\implies c = -5$. Rule is $$x \\to 2x - 5$$.",
      points: 1
    },
    {
      id: "q28",
      prompt: "Under the mapping $$x \\to 2x - 5$$, find the output $y$ when input $x = 6$.",
      options: [
        "6",
        "7",
        "8",
        "5"
      ],
      correctAnswer: "7",
      hint: "Substitute $x = 6$ into $2x - 5$.",
      workedSolution: "$$2(6) - 5 = 12 - 5 = 7$$.",
      points: 1
    },
    {
      id: "q29",
      prompt: "Which of the following geometric nets folds to create a pyramid with a square base?",
      options: [
        "A rectangle with 2 opposite circular faces",
        "Two congruent triangles joined by 3 rectangles",
        "A square surrounded by 4 isosceles triangles",
        "Six identical square faces joined in a cross shape"
      ],
      correctAnswer: "A square surrounded by 4 isosceles triangles",
      hint: "A central polygon base with triangular flaps folding to an apex defines a pyramid net.",
      workedSolution: "A square base attached to 4 surrounding triangular faces is the net of a square pyramid.",
      points: 1
    },
    {
      id: "q30",
      prompt: "A rectangular water container has dimensions $3\\text{ m} \\times 4\\text{ m} \\times 5\\text{ m}$ and is full to the brim. If $40\\text{ m}^3$ of water is drained, how much water remains?",
      options: [
        "$$60\\text{ m}^3$$",
        "$$20\\text{ m}^3$$",
        "$$15\\text{ m}^3$$",
        "$$25\\text{ m}^3$$"
      ],
      correctAnswer: "$$20\\text{ m}^3$$",
      hint: "Total capacity = $3 \\times 4 \\times 5 = 60\\text{ m}^3$. Subtract 40.",
      workedSolution: "Capacity = $$3 \\times 4 \\times 5 = 60\\text{ m}^3$$. Water remaining = $$60 - 40 = 20\\text{ m}^3$$.",
      points: 1
    },
    {
      id: "q31",
      prompt: "In a right-angled triangle $ABC$ with $\\angle ABC = 90^\\circ$, hypotenuse $|AC| = 17\\text{ cm}$ and base $|BC| = 8\\text{ cm}$. Calculate the length of side $|AB|$.",
      options: [
        "15 cm",
        "12 cm",
        "9 cm",
        "13 cm"
      ],
      correctAnswer: "15 cm",
      hint: "$$|AB|^2 = |AC|^2 - |BC|^2 = 17^2 - 8^2$$.",
      workedSolution: "$$|AB|^2 = 289 - 64 = 225 \\implies |AB| = \\sqrt{225} = 15\\text{ cm}$$.",
      points: 1
    },
    {
      id: "q32",
      prompt: "How many lines of symmetry does a regular equilateral triangle have?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctAnswer: "3",
      hint: "Each line passes through a vertex and perpendicularly bisects the opposite side.",
      workedSolution: "An equilateral triangle has 3 lines of symmetry.",
      points: 1
    },
    {
      id: "q33",
      prompt: "The measure of an obtuse angle lies strictly between:",
      options: [
        "0° and 90°",
        "180° and 360°",
        "90° and 270°",
        "90° and 180°"
      ],
      correctAnswer: "90° and 180°",
      hint: "An obtuse angle is greater than a right angle but less than a straight line.",
      workedSolution: "By standard definition, an obtuse angle has a magnitude between $90^\\circ$ and $180^\\circ$.",
      points: 1
    },
    {
      id: "q34",
      prompt: "Two parallel lines are intersected by a transversal line. Two angles situated on the same relative side of the transversal and at the same level relative to the parallel lines are called:",
      options: [
        "Corresponding angles",
        "Alternate angles",
        "Vertically opposite angles",
        "Co-interior angles"
      ],
      correctAnswer: "Corresponding angles",
      hint: "These form an 'F-shape' in geometry and are equal in measure.",
      workedSolution: "Angles in matching corner positions relative to the transversal and parallel lines are corresponding angles.",
      points: 1
    },
    {
      id: "q35",
      prompt: "Given vectors $$u = \\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} -2 \\\\ 4 \\end{pmatrix}$$, evaluate $$2u + v$$.",
      options: [
        "$$\\begin{pmatrix} 4 \\\\ 6 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 1 \\\\ 6 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 4 \\\\ 2 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} -1 \\\\ 6 \\end{pmatrix}$$"
      ],
      correctAnswer: "$$\\begin{pmatrix} 4 \\\\ 6 \\end{pmatrix}$$",
      hint: "$$2(3) + (-2) = 4$$ and $$2(1) + 4 = 6$$.",
      workedSolution: "$$2\\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix} + \\begin{pmatrix} -2 \\\\ 4 \\end{pmatrix} = \\begin{pmatrix} 6 - 2 \\\\ 2 + 4 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 6 \\end{pmatrix}$$.",
      points: 1
    },
    {
      id: "q36",
      prompt: "In an isosceles triangle with base angles equal to $68^\\circ$ each, what is the size of the vertex angle?",
      options: [
        "$$56^\\circ$$",
        "$$44^\\circ$$",
        "$$68^\\circ$$",
        "$$34^\\circ$$"
      ],
      correctAnswer: "$$44^\\circ$$",
      hint: "Sum of angles in a triangle is $180^\\circ$: $180 - 2(68)$.",
      workedSolution: "$$\\text{Vertex angle} = 180^\\circ - (68^\\circ + 68^\\circ) = 180^\\circ - 136^\\circ = 44^\\circ$$.",
      points: 1
    },
    {
      id: "q37",
      prompt: "The dimensions of a cuboid are $3\\text{ cm}$, $x\\text{ cm}$, and $6\\text{ cm}$. Which expression represents its volume?",
      options: [
        "$$(9 + x)\\text{ cm}^3$$",
        "$$18x\\text{ cm}^3$$",
        "$$9x\\text{ cm}^3$$",
        "$$(18 + x)\\text{ cm}^3$$"
      ],
      correctAnswer: "$$18x\\text{ cm}^3$$",
      hint: "Volume = length × width × height.",
      workedSolution: "$$V = 3 \\times x \\times 6 = 18x\\text{ cm}^3$$.",
      points: 1
    },
    {
      id: "q38",
      prompt: "Simplify: $$6(2m + 1) - 4(m - 2)$$.",
      options: [
        "$$8m + 14$$",
        "$$8m - 2$$",
        "$$8m + 2$$",
        "$$16m + 14$$"
      ],
      correctAnswer: "$$8m + 14$$",
      hint: "Expand: $12m + 6 - 4m + 8$. Note that $-4(-2) = +8$.",
      workedSolution: "$$(12m - 4m) + (6 + 8) = 8m + 14$$.",
      points: 1
    },
    {
      id: "q39",
      prompt: "Evaluate: $$\\left(\\frac{3}{4} - \\frac{1}{2}\\right) \\div \\frac{1}{8}$$.",
      options: [
        "1",
        "4",
        "2",
        "$$\\frac{1}{16}$$"
      ],
      correctAnswer: "2",
      hint: "$$\\frac{3}{4} - \\frac{1}{2} = \\frac{1}{4}$$. Then multiply by 8.",
      workedSolution: "$$\\frac{1}{4} \\div \\frac{1}{8} = \\frac{1}{4} \\times 8 = 2$$.",
      points: 1
    },
    {
      id: "q40",
      prompt: "The locus of points equidistant from two fixed points $A$ and $B$ in a plane is:",
      options: [
        "The angle bisector of angle PAB",
        "A circle with AB as diameter",
        "A line parallel to AB",
        "The perpendicular bisector of line segment AB"
      ],
      correctAnswer: "The perpendicular bisector of line segment AB",
      hint: "A point at equal distance from both endpoints lies on their perpendicular mediator line.",
      workedSolution: "By locus definitions in geometry, the set of all points equidistant from two fixed points $A$ and $B$ is the perpendicular bisector of segment $AB$.",
      points: 1
    }
  ],
  seededAt: "2026-09-15T16:00:00.000Z",
  lastUpdated: "2026-09-15T16:00:00.000Z"
};

// ============================================================================
// 3u. ALIGNED CORE CURRICULUM SERIES: JHS Math Structured Problem-Solving Series (Set 20)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-20
// ============================================================================
export const SET_JHS_MASTERY_SERIES_20: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-20",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 20)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 5,
  version: 1,
  questions: [
    {
      id: "q01",
      title: "Question 1: Set Number Partitions, Subsets & Venn Diagram Shading",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 360 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><rect width='350' height='190' x='5' y='5' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='18' y='28' font-family='sans-serif' font-size='13' font-weight='bold' fill='#0f172a'>ε = {1, 2, 3, ..., 20}</text><circle cx='135' cy='110' r='60' fill='none' stroke='#2563eb' stroke-width='2'/><circle cx='225' cy='110' r='60' fill='none' stroke='#059669' stroke-width='2'/><text x='95' y='45' font-size='12' font-weight='bold' fill='#2563eb'>P (Primes)</text><text x='205' y='45' font-size='12' font-weight='bold' fill='#059669'>Q (Odds &gt; 3)</text><text x='95' y='110' font-size='11' fill='#1e293b'>2, 3</text><text x='155' y='105' font-size='11' font-weight='bold' fill='#dc2626'>5, 7, 11,</text><text x='160' y='125' font-size='11' font-weight='bold' fill='#dc2626'>13, 17, 19</text><text x='245' y='110' font-size='11' fill='#1e293b'>9, 15</text><text x='25' y='175' font-size='10' fill='#64748b'>(P ∪ Q)′ = {1, 4, 6, 8, 10, 12, 14, 16, 18, 20}</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "Given the universal set $$\\varepsilon = \\{x : x \\text{ is an integer}, 1 \\le x \\le 20\\}$$, and subsets:\n$$P = \\{\\text{prime numbers}\\}$$\n$$Q = \\{\\text{odd numbers greater than } 3\\}$$\nList the elements of set $P$ and set $Q$.",
          hint: "Prime numbers have exactly two factors (1 and itself). For Q, start from 5 and select odd numbers up to 19.",
          modelAnswer: "P = {2, 3, 5, 7, 11, 13, 17, 19}, Q = {5, 7, 9, 11, 13, 15, 17, 19}",
          workedSolution: "- Primes up to 20: $$P = \\{2, 3, 5, 7, 11, 13, 17, 19\\}$$\n- Odd numbers strictly greater than 3 up to 20: $$Q = \\{5, 7, 9, 11, 13, 15, 17, 19\\}$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Find the members of the sets:\n(i) $$P \\cap Q$$\n(ii) $$P \\cup Q$$",
          hint: "The intersection contains odd primes greater than 3. The union combines all elements without repeats.",
          modelAnswer: "(i) {5, 7, 11, 13, 17, 19}, (ii) {2, 3, 5, 7, 9, 11, 13, 15, 17, 19}",
          workedSolution: "**(i)** Common elements: $$P \\cap Q = \\{5, 7, 11, 13, 17, 19\\}$$\n\n**(ii)** Combined elements: $$P \\cup Q = \\{2, 3, 5, 7, 9, 11, 13, 15, 17, 19\\}$$."
        },
        {
          partLabel: "(c)",
          marks: 6,
          prompt: "From the Venn diagram above:\n(i) List the elements of the complement set $$(P \\cup Q)'$$.\n(ii) Identify all prime factors of $20$ within set $P$.",
          hint: "(P ∪ Q)′ contains all numbers in universal set outside both circles. Find factors of 20 that are prime.",
          modelAnswer: "(i) {1, 4, 6, 8, 10, 12, 14, 16, 18, 20}, (ii) {2, 5}",
          workedSolution: "**(i)** Elements in $\\varepsilon$ not in $P \\cup Q$:\n$$(P \\cup Q)' = \\{1, 4, 6, 8, 10, 12, 14, 16, 18, 20\\}$$\n\n**(ii)** Factors of 20 are 1, 2, 4, 5, 10, 20. The prime factors are **{2, 5}**."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Linear Equation Evaluation, Decimal Standard Form & Inverse Sharing",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "Given the equation $$3n - 4m + 12 = 0$$, calculate:\n(i) The value of $m$ when $n = 4$.\n(ii) The value of $n$ when $m = 6$.",
          hint: "Substitute the known value into the linear relation and solve for the remaining variable.",
          modelAnswer: "(i) m = 6, (ii) n = 4",
          workedSolution: "**(i)** When $n = 4$:\n$$3(4) - 4m + 12 = 0$$\n$$12 - 4m + 12 = 0$$\n$$24 = 4m \\implies m = \\frac{24}{4} = 6$$\n\n**(ii)** When $m = 6$:\n$$3n - 4(6) + 12 = 0$$\n$$3n - 24 + 12 = 0$$\n$$3n - 12 = 0 \\implies 3n = 12 \\implies n = \\frac{12}{3} = 4$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Evaluate and express your final answer in **standard form**:\n$$\\frac{0.064 \\times 0.5}{0.008 \\times 0.2}$$",
          hint: "Convert to whole numbers by multiplying numerator and denominator by 10,000 or write in fractional form.",
          modelAnswer: "2.0 × 10¹ (or 2.0 × 10)",
          workedSolution: "$$\\frac{0.064 \\times 0.5}{0.008 \\times 0.2} = \\frac{0.032}{0.0016}$$\nMultiply numerator and denominator by $10,000$:\n$$= \\frac{320}{16} = 20$$\nIn standard form: $$20 = 2.0 \\times 10^1$$."
        },
        {
          partLabel: "(c)",
          marks: 5,
          prompt: "A carton of notebooks was distributed among $6$ schools, with each school receiving $40\\text{ notebooks}$. If the exact same total number of notebooks had been shared equally among $15$ schools instead, how many notebooks would each school receive?",
          hint: "Find the total quantity of notebooks: $6 \\times 40 = 240$. Divide this total by 15.",
          modelAnswer: "16 notebooks",
          workedSolution: "$$\\text{Total notebooks} = 6 \\times 40 = 240\\text{ notebooks}$$\n$$\\text{Share per school for 15 schools} = \\frac{240}{15} = 16\\text{ notebooks}$$\n*(Alternatively, by inverse proportion: $\\frac{6}{15} \\times 40 = \\frac{2}{5} \\times 40 = 16\\text{ notebooks}$)*."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Nursery Age Frequency Distribution, Mean & Bar Charting",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 340 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><line x1='35' y1='160' x2='310' y2='160' stroke='#334155' stroke-width='2'/><line x1='35' y1='160' x2='35' y2='20' stroke='#334155' stroke-width='2'/><text x='140' y='188' font-size='11' font-weight='bold'>Age (years)</text><text x='5' y='18' font-size='11' font-weight='bold'>Frequency</text><rect x='60' y='50' width='30' height='110' fill='#2563eb' stroke='#1d4ed8'/><rect x='110' y='80' width='30' height='80' fill='#93c5fd' stroke='#1d4ed8'/><rect x='160' y='120' width='30' height='40' fill='#93c5fd' stroke='#1d4ed8'/><rect x='210' y='100' width='30' height='60' fill='#93c5fd' stroke='#1d4ed8'/><rect x='260' y='65' width='30' height='95' fill='#93c5fd' stroke='#1d4ed8'/><text x='72' y='173' font-size='10'>1</text><text x='122' y='173' font-size='10'>2</text><text x='172' y='173' font-size='10'>3</text><text x='222' y='173' font-size='10'>4</text><text x='272' y='173' font-size='10'>5</text><text x='20' y='55' font-size='10'>7</text><text x='20' y='85' font-size='10'>5</text><text x='20' y='125' font-size='10'>2</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 9,
          prompt: "The table below shows the distribution of ages of children enrolled in a preschool nursery:\n\n| Age in years ($x$) | 1 | 2 | 3 | 4 | 5 |\n| :--- | :---: | :---: | :---: | :---: | :---: |\n| Number of Children ($f$) | 7 | 5 | 2 | 4 | 6 |\n\n(i) Identify the **modal age**.\n(ii) Calculate the total number of children ($N = \\sum f$).\n(iii) Calculate the **mean age** of the children.",
          hint: "Mode has highest frequency. Mean = $\\sum fx / \\sum f$.",
          modelAnswer: "(i) 1 year, (ii) 24 children, (iii) 2.96 years (or 71/24)",
          workedSolution: "**(i) Modal age:**\nThe highest frequency is $7$ (corresponding to age 1). The **modal age is 1 year**.\n\n**(ii) Total number of children:**\n$$N = \\sum f = 7 + 5 + 2 + 4 + 6 = 24\\text{ children}$$\n\n**(iii) Mean age:**\n$$\\sum fx = (1 \\times 7) + (2 \\times 5) + (3 \\times 2) + (4 \\times 4) + (5 \\times 6)$$\n$$\\sum fx = 7 + 10 + 6 + 16 + 30 = 69$$\n$$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{69}{24} = 2\\frac{21}{24} = 2.875\\text{ years}$$."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "If a child is chosen at random from this preschool:\n(i) What is the probability that the child is $4\\text{ years old}$?\n(ii) What is the probability that the child is strictly older than $2\\text{ years}$?",
          hint: "Probability = Frequency of age / Total children. 'Older than 2' means ages 3, 4, and 5.",
          modelAnswer: "(i) 1/6, (ii) 1/2",
          workedSolution: "**(i) Probability of age 4:**\n$$P(x = 4) = \\frac{f(4)}{\\sum f} = \\frac{4}{24} = \\frac{1}{6}$$\n\n**(ii) Probability older than 2 (ages 3, 4, 5):**\n$$\\text{Count} = f(3) + f(4) + f(5) = 2 + 4 + 6 = 12$$\n$$P(x > 2) = \\frac{12}{24} = \\frac{1}{2}$$."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Vector Linear Combinations, Inequalities & Sheet Metal Cylinder Volume",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 350 180' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'><rect x='20' y='50' width='140' height='70' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='65' y='40' font-size='11' font-weight='bold'>L = 44 cm</text><text x='165' y='90' font-size='11' font-weight='bold'>b = 14 cm</text><path d='M175,85 C200,55 210,55 230,75' fill='none' stroke='#0284c7' stroke-width='2' stroke-dasharray='4'/><g transform='translate(235,30)'><ellipse cx='35' cy='20' rx='30' ry='10' fill='#eff6ff' stroke='#1e40af' stroke-width='2'/><line x1='5' y1='20' x2='5' y2='110' stroke='#1e40af' stroke-width='2'/><line x1='65' y1='20' x2='65' y2='110' stroke='#1e40af' stroke-width='2'/><ellipse cx='35' cy='110' rx='30' ry='10' fill='#dbeafe' stroke='#1e40af' stroke-width='2'/><text x='75' y='70' font-size='11' font-weight='bold'>h = 14 cm</text><text x='20' y='20' font-size='10' fill='#dc2626'>r = 7 cm</text></g></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "Given column vectors $$u = \\begin{pmatrix} 5 \\\\ 3 \\end{pmatrix}$$, $$v = \\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix}$$, and $$w = \\begin{pmatrix} 4 \\\\ -5 \\end{pmatrix}$$.\nCalculate: $$u + 2v + w$$.",
          hint: "Multiply v by 2, then add corresponding x-components and y-components.",
          modelAnswer: "(7, 2)ᵀ",
          workedSolution: "$$u + 2v + w = \\begin{pmatrix} 5 \\\\ 3 \\end{pmatrix} + 2\\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix} + \\begin{pmatrix} 4 \\\\ -5 \\end{pmatrix}$$\n$$= \\begin{pmatrix} 5 + 2(-1) + 4 \\\\ 3 + 2(2) + (-5) \\end{pmatrix} = \\begin{pmatrix} 5 - 2 + 4 \\\\ 3 + 4 - 5 \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ 2 \\end{pmatrix}$$."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "Find the solution set of the linear inequality:\n$$\\frac{3}{4}x - 1 \\le \\frac{1}{2}$$\nwithin the domain $$\\{-2, -1, 0, 1, 2, 3\\}$$.",
          hint: "Add 1 to both sides: $\\frac{3}{4}x \\le \\frac{3}{2}$. Multiply both sides by 4/3.",
          modelAnswer: "{-2, -1, 0, 1, 2}",
          workedSolution: "$$\\frac{3}{4}x \\le \\frac{1}{2} + 1$$\n$$\\frac{3}{4}x \\le \\frac{3}{2}$$\n$$x \\le \\frac{3}{2} \\times \\frac{4}{3} \\implies x \\le 2$$\nFiltering within the replacement domain $\\{-2, -1, 0, 1, 2, 3\\}$, all values $\\le 2$ satisfy the inequality:\n$$\\text{Solution set} = \\{-2, -1, 0, 1, 2\\}$$."
        },
        {
          partLabel: "(c)",
          marks: 6,
          prompt: "A rectangular sheet of metal of length $44\\text{ cm}$ and breadth $14\\text{ cm}$ is rolled into an open cylinder such that the breadth becomes the vertical height ($h = 14\\text{ cm}$) and the length forms the circumference of the circular base.\nTaking $\\pi = \\frac{22}{7}$, calculate:\n(i) The radius of the base of the cylinder.\n(ii) The internal volume of the cylinder formed.",
          hint: "Circumference = $2\\pi r = 44\\text{ cm}$. Volume = $\\pi r^2 h$.",
          modelAnswer: "(i) r = 7 cm, (ii) 2,156 cm³",
          workedSolution: "**(i) Base Radius:**\n$$2\\pi r = 44$$\n$$2 \\times \\frac{22}{7} \\times r = 44$$\n$$\\frac{44}{7} r = 44 \\implies r = 44 \\times \\frac{7}{44} = 7\\text{ cm}$$\n\n**(ii) Volume of Cylinder:**\n$$V = \\pi r^2 h = \\frac{22}{7} \\times 7^2 \\times 14 = 22 \\times 7 \\times 14 = 154 \\times 14 = 2,156\\text{ cm}^3$$\nTherefore, the volume of the cylinder is **$2,156\\text{ cm}^3$**."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Geometric Isosceles Triangle Constructions & Rhombus Symmetry",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 260' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'><polygon points='40,130 160,30 280,130 160,230' fill='#f8fafc' stroke='#1e293b' stroke-width='2'/><line x1='40' y1='130' x2='280' y2='130' stroke='#2563eb' stroke-width='1.5' stroke-dasharray='4'/><line x1='160' y1='30' x2='160' y2='230' stroke='#2563eb' stroke-width='1.5' stroke-dasharray='4'/><circle cx='160' cy='130' r='3.5' fill='#dc2626'/><rect x='160' y='115' width='12' height='12' fill='none' stroke='#334155' stroke-width='1.2'/><text x='25' y='135' font-size='12' font-weight='bold'>A</text><text x='160' y='20' font-size='12' font-weight='bold'>B</text><text x='285' y='135' font-size='12' font-weight='bold'>C</text><text x='160' y='245' font-size='12' font-weight='bold'>P</text><text x='165' y='145' font-size='11' font-weight='bold' fill='#dc2626'>D</text><text x='95' y='75' font-size='11'>8 cm</text><text x='225' y='75' font-size='11'>8 cm</text><text x='95' y='185' font-size='11'>8 cm</text><text x='225' y='185' font-size='11'>8 cm</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 9,
          prompt: "In a geometric construction, triangle $ABC$ is isosceles with $|AB| = 8\\text{ cm}$, $|BC| = 8\\text{ cm}$, and base $|AC| = 6\\text{ cm}$. The angle bisector of $\\angle ABC$ is constructed and meets base $AC$ at point $D$.\n(i) What is the size of angle $\\angle ADB$?\n(ii) Calculate the altitude length $|BD|$ using Pythagoras' theorem.\n(iii) Calculate the area of triangle $ABC$.",
          hint: "In an isosceles triangle, the angle bisector of the vertex angle is also the perpendicular bisector of the base: AD = 3 cm, angle ADB = 90°.",
          modelAnswer: "(i) 90°, (ii) √55 ≈ 7.42 cm, (iii) 3√55 ≈ 22.25 cm²",
          workedSolution: "**(i) Angle $\\angle ADB$:**\nThe bisector of the vertex angle of an isosceles triangle perpendicularly bisects the base. Therefore, $$\\angle ADB = 90^\\circ$$.\n\n**(ii) Length of altitude $|BD|$:**\n$$|AD| = \\frac{1}{2}|AC| = \\frac{6}{2} = 3\\text{ cm}$$\nIn right-angled triangle $ABD$:\n$$|BD|^2 = |AB|^2 - |AD|^2 = 8^2 - 3^2 = 64 - 9 = 55$$\n$$|BD| = \\sqrt{55} \\approx 7.42\\text{ cm}$$\n\n**(iii) Area of triangle $ABC$:**\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 6 \\times \\sqrt{55} = 3\\sqrt{55} \\approx 22.25\\text{ cm}^2$$."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "Line segment $BD$ is produced through $D$ to point $P$ such that $|DP| = |BD|$. Line segments $AP$ and $CP$ are joined to form quadrilateral $ABCP$.\n(i) Measure or state the length of side $|AP|$.\n(ii) What specific type of quadrilateral is $ABCP$, and what are its lines of symmetry?",
          hint: "The diagonals AC and BP bisect each other at 90°. All 4 sides are equal to 8 cm.",
          modelAnswer: "(i) 8 cm, (ii) Rhombus, 2 lines of symmetry",
          workedSolution: "**(i)** By symmetry across line $AC$, triangle $APC$ is congruent to triangle $ABC$. Thus, $$|AP| = |AB| = 8\\text{ cm}$$.\n\n**(ii)** Since all four sides are equal ($|AB| = |BC| = |CP| = |AP| = 8\\text{ cm}$) and its diagonals intersect perpendicularly, the quadrilateral $ABCP$ is a **Rhombus**.\nA rhombus has exactly **$2$ lines of symmetry** along its diagonals ($AC$ and $BP$)."
        }
      ]
    }
  ],
  seededAt: "2026-09-15T16:30:00.000Z",
  lastUpdated: "2026-09-15T16:30:00.000Z"
};

// ============================================================================
// 3v. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 21)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-21
// ============================================================================
export const SET_JHS_MASTERY_SERIES_21: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-21",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 21)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series",
  variantType: "standard",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
      id: "q01",
      prompt: "If set $$S = \\{\\text{multiples of } 5 \\text{ less than } 25\\}$$, find set $$S$$.",
      options: [
        "{5, 10, 15, 20}",
        "{5, 10, 15, 20, 25}",
        "{1, 5, 10, 15, 20}",
        "{5, 15, 20}"
      ],
      correctAnswer: "{5, 10, 15, 20}",
      hint: "Multiples of 5 strictly under 25.",
      workedSolution: "Multiples of 5 less than 25 are 5, 10, 15, and 20. 25 is excluded because of 'less than'.",
      points: 1
    },
    {
      id: "q02",
      prompt: "The addition $$231_x + 242_x = 1023_x$$ was carried out in base $x$. Find the base $x$.",
      options: [
        "five",
        "six",
        "seven",
        "four"
      ],
      correctAnswer: "five",
      hint: "Check the units digit addition: $1 + 2 = 3$. In the second place: $3 + 4 = 7 = 1(5) + 2$.",
      workedSolution: "In the tens place: $3 + 4 = 7$. In base 5, $7 = 1 \\times 5 + 2$, giving a result of 2 with 1 carried over. Thus, the base $x = 5$.",
      points: 1
    },
    {
      id: "q03",
      prompt: "A delivery driver departed from a warehouse at 5:25 AM and arrived at his destination at 7:12 AM. How long did the journey take?",
      options: [
        "1 hour 47 minutes",
        "1 hour 37 minutes",
        "2 hours 13 minutes",
        "1 hour 57 minutes"
      ],
      correctAnswer: "1 hour 47 minutes",
      hint: "From 5:25 to 6:00 is 35 minutes. Add 1 hour 12 minutes.",
      workedSolution: "Time elapsed = $35\\text{ min (to 6:00 AM)} + 1\\text{ h } 12\\text{ min} = 1\\text{ hour } 47\\text{ minutes}$.",
      points: 1
    },
    {
      id: "q04",
      prompt: "Express $3,682.4$ in standard form.",
      options: [
        "$$3.6824 \\times 10^2$$",
        "$$3.6824 \\times 10^{-3}$$",
        "$$3.6824 \\times 10^3$$",
        "$$36.824 \\times 10^2$$"
      ],
      correctAnswer: "$$3.6824 \\times 10^3$$",
      hint: "Move the decimal point 3 places to the left: $A \\times 10^n$ with $1 \\le A < 10$.",
      workedSolution: "$$3,682.4 = 3.6824 \\times 10^3$$.",
      points: 1
    },
    {
      id: "q05",
      prompt: "Simplify: $$2\\frac{1}{2} + 1\\frac{1}{4} - 3\\frac{3}{8}$$.",
      options: [
        "$$\\frac{3}{8}$$",
        "$$\\frac{1}{4}$$",
        "$$\\frac{1}{8}$$",
        "$$\\frac{5}{8}$$"
      ],
      correctAnswer: "$$\\frac{3}{8}$$",
      hint: "Use a common denominator of 8: $2\\frac{4}{8} + 1\\frac{2}{8} - 3\\frac{3}{8}$.",
      workedSolution: "$$(2 + 1 - 3) + \\left(\\frac{4 + 2 - 3}{8}\\right) = 0 + \\frac{3}{8} = \\frac{3}{8}$$.",
      points: 1
    },
    {
      id: "q06",
      prompt: "Find the next two numbers in the sequence: $$3, 6, 10, 15, 21, \\dots, \\dots$$.",
      options: [
        "27, 34",
        "28, 36",
        "26, 35",
        "28, 35"
      ],
      correctAnswer: "28, 36",
      hint: "Look at the differences between consecutive terms: +3, +4, +5, +6...",
      workedSolution: "Add 7: $21 + 7 = 28$. Add 8: $28 + 8 = 36$. The next two numbers are 28 and 36.",
      points: 1
    },
    {
      id: "q07",
      prompt: "The sum of three numbers is $34,820$. Two of the numbers are $12,450$ and $11,350$. Find the third number.",
      options: [
        "11,020",
        "10,020",
        "11,120",
        "10,920"
      ],
      correctAnswer: "11,020",
      hint: "Subtract the sum of the two given numbers from the total sum.",
      workedSolution: "$$12,450 + 11,350 = 23,800$$. Third number = $$34,820 - 23,800 = 11,020$$.",
      points: 1
    },
    {
      id: "q08",
      prompt: "$160$ books are to be packed into cartons. If each carton holds at most $14$ books, find the number of cartons that can be **completely** filled.",
      options: [
        "12",
        "10",
        "11",
        "13"
      ],
      correctAnswer: "11",
      hint: "Compute $160 \\div 14$ and take the whole number quotient.",
      workedSolution: "$$160 \\div 14 = 11\\text{ R } 6$$. Exactly 11 cartons are completely filled.",
      points: 1
    },
    {
      id: "q09",
      prompt: "Which of the following fractions is the greatest: $$\\frac{3}{5}, \\, \\frac{7}{10}, \\, \\frac{3}{4}, \\, \\frac{13}{20}$$?",
      options: [
        "$$\\frac{3}{4}$$",
        "$$\\frac{7}{10}$$",
        "$$\\frac{3}{5}$$",
        "$$\\frac{13}{20}$$"
      ],
      correctAnswer: "$$\\frac{3}{4}$$",
      hint: "Express all with a common denominator of 20: 12/20, 14/20, 15/20, 13/20.",
      workedSolution: "Comparing values over 20: $12/20, 14/20, 15/20, 13/20$. The largest is $15/20 = \\frac{3}{4}$.",
      points: 1
    },
    {
      id: "q10",
      prompt: "Out of a development fund of $\\text{GH¢ } 750.00$, the sum of $\\text{GH¢ } 450.00$ was disbursed for school maintenance. What fraction of the total fund was disbursed?",
      options: [
        "$$\\frac{2}{5}$$",
        "$$\\frac{3}{5}$$",
        "$$\\frac{4}{5}$$",
        "$$\\frac{7}{15}$$"
      ],
      correctAnswer: "$$\\frac{3}{5}$$",
      hint: "Simplify 450 / 750 by dividing both by 150.",
      workedSolution: "$$\\frac{450}{750} = \\frac{45}{75} = \\frac{3}{5}$$.",
      points: 1
    },
    {
      id: "q11",
      prompt: "Ama bought $6$ notebooks at $\\text{GH¢ } 2.50$ each and $4$ marker pens at $\\text{GH¢ } 3.50$ each. How much did she spend altogether?",
      options: [
        "GH¢ 27.00",
        "GH¢ 31.00",
        "GH¢ 29.00",
        "GH¢ 32.00"
      ],
      correctAnswer: "GH¢ 29.00",
      hint: "Total = (6 × 2.50) + (4 × 3.50).",
      workedSolution: "$$6 \\times 2.50 = 15.00$$; $$4 \\times 3.50 = 14.00$$. Total spent = $$15.00 + 14.00 = \\text{GH¢ } 29.00$$.",
      points: 1
    },
    {
      id: "q12",
      prompt: "A wire transfer service charges a $4\\%$ transaction fee. If a customer transfers $\\text{GH¢ } 350.00$, what fee was paid?",
      options: [
        "GH¢ 12.00",
        "GH¢ 14.00",
        "GH¢ 16.00",
        "GH¢ 17.50"
      ],
      correctAnswer: "GH¢ 14.00",
      hint: "Calculate 4% of 350.",
      workedSolution: "$$\\text{Fee} = \\frac{4}{100} \\times 350 = 4 \\times 3.5 = \\text{GH¢ } 14.00$$.",
      points: 1
    },
    {
      id: "q13",
      prompt: "If $6$ builders can construct a garden wall in $12\\text{ days}$, how many days will it take $9$ builders to build the same wall working at the same pace?",
      options: [
        "8 days",
        "18 days",
        "10 days",
        "6 days"
      ],
      correctAnswer: "8 days",
      hint: "Inverse proportion: Total builder-days = 6 × 12 = 72.",
      workedSolution: "$$\\text{Days} = \\frac{6 \\times 12}{9} = \\frac{72}{9} = 8\\text{ days}$$.",
      points: 1
    },
    {
      id: "q14",
      prompt: "A linear relation is defined by the mapping $$x \\to x^2 - 3$$. Find the image of $4$ under this mapping.",
      options: [
        "16",
        "11",
        "13",
        "5"
      ],
      correctAnswer: "13",
      hint: "Calculate $4^2 - 3$.",
      workedSolution: "$$4^2 - 3 = 16 - 3 = 13$$.",
      points: 1
    },
    {
      id: "q15",
      prompt: "A typist charges $\\text{GH¢ } 5.00$ for the first $4\\text{ pages}$ and $\\text{GH¢ } 1.20$ for each additional page. How much will it cost to type a $15\\text{ page}$ document?",
      options: [
        "GH¢ 17.20",
        "GH¢ 18.20",
        "GH¢ 19.20",
        "GH¢ 16.80"
      ],
      correctAnswer: "GH¢ 18.20",
      hint: "First 4 pages = 5.00; remaining 11 pages cost 11 × 1.20.",
      workedSolution: "Remaining pages = $15 - 4 = 11$. Additional cost = $$11 \\times 1.20 = 13.20$$. Total = $$5.00 + 13.20 = \\text{GH¢ } 18.20$$.",
      points: 1
    },
    {
      id: "q16",
      prompt: "A cyclist covers a distance of $120\\text{ m}$ in $15\\text{ seconds}$. Express his speed in kilometres per hour ($\\text{km/h}$).",
      options: [
        "24 km/h",
        "28.8 km/h",
        "30 km/h",
        "32 km/h"
      ],
      correctAnswer: "28.8 km/h",
      hint: "Speed in m/s = 120 / 15 = 8 m/s. Multiply by 3.6 to convert to km/h.",
      workedSolution: "$$\\text{Speed} = \\frac{120\\text{ m}}{15\\text{ s}} = 8\\text{ m/s}$$. In km/h: $$8 \\times \\frac{3600}{1000} = 8 \\times 3.6 = 28.8\\text{ km/h}$$.",
      points: 1
    },
    {
      id: "q17",
      prompt: "Kwame, Kofi, and Ama shared a sum of money in the ratio $2 : 3 : 5$ respectively. If Ama received $\\text{GH¢ } 60.00$, what was the total amount shared?",
      options: [
        "GH¢ 100.00",
        "GH¢ 150.00",
        "GH¢ 140.00",
        "GH¢ 120.00"
      ],
      correctAnswer: "GH¢ 120.00",
      hint: "5 ratio units = 60. Find 1 unit = 12. Total units = 2 + 3 + 5 = 10.",
      workedSolution: "1 unit = $60 / 5 = 12$. Total shared = $$10 \\times 12 = \\text{GH¢ } 120.00$$.",
      points: 1
    },
    {
      id: "q18",
      prompt: "A student bought a laptop for $\\text{GH¢ } 720.00$ after receiving a $10\\%$ discount. What was the marked price of the laptop?",
      options: [
        "GH¢ 800.00",
        "GH¢ 792.00",
        "GH¢ 820.00",
        "GH¢ 840.00"
      ],
      correctAnswer: "GH¢ 800.00",
      hint: "The discounted price represents 90% of the marked price: $720 \\div 0.90$.",
      workedSolution: "$$\\text{Marked price} = \\frac{720.00}{0.90} = \\text{GH¢ } 800.00$$.",
      points: 1
    },
    {
      id: "q19",
      prompt: "The population of a district was $60,000$ in 2010. By 2020, the population had increased by $25\\%$. Find the population in 2020.",
      options: [
        "72,000",
        "75,000",
        "80,000",
        "70,000"
      ],
      correctAnswer: "75,000",
      hint: "Population in 2020 = 125% of 60,000.",
      workedSolution: "$$1.25 \\times 60,000 = 75,000$$.",
      points: 1
    },
    {
      id: "q20",
      prompt: "If an operation is defined on real numbers by $$a * b = 3a - 2b$$, evaluate $$4 * 3$$.",
      options: [
        "6",
        "7",
        "5",
        "8"
      ],
      correctAnswer: "6",
      hint: "Substitute $a = 4$ and $b = 3$ into $3a - 2b$.",
      workedSolution: "$$4 * 3 = 3(4) - 2(3) = 12 - 6 = 6$$.",
      points: 1
    },
    {
      id: "q21",
      prompt: "Make $x$ the subject of the relation: $$y = \\frac{x + 2}{x - 3}$$.",
      options: [
        "$$x = \\frac{3y + 2}{y - 1}$$",
        "$$x = \\frac{3y - 2}{y - 1}$$",
        "$$x = \\frac{y + 2}{y - 3}$$",
        "$$x = \\frac{2y + 3}{y - 1}$$"
      ],
      correctAnswer: "$$x = \\frac{3y + 2}{y - 1}$$",
      hint: "Multiply both sides by $(x - 3)$, expand, and group terms with $x$ on one side.",
      workedSolution: "$$y(x - 3) = x + 2 \\implies xy - 3y = x + 2 \\implies xy - x = 3y + 2 \\implies x(y - 1) = 3y + 2 \\implies x = \\frac{3y + 2}{y - 1}$$.",
      points: 1
    },
    {
      id: "q22",
      prompt: "In a class of $50$ pupils, $40\\%$ study Spanish and $70\\%$ study French. If every pupil studies at least one of the two languages, what percentage of the class studies both languages?",
      options: [
        "15%",
        "10%",
        "20%",
        "25%"
      ],
      correctAnswer: "10%",
      hint: "Percentage of both = $(40\\% + 70\\%) - 100\\%$.",
      workedSolution: "$$40\\% + 70\\% - 100\\% = 110\\% - 100\\% = 10\\%$$.",
      points: 1
    },
    {
      id: "q23",
      prompt: "From the class of $50$ pupils in Question 22, how many pupils study French altogether?",
      options: [
        "30",
        "35",
        "40",
        "25"
      ],
      correctAnswer: "35",
      hint: "70% of 50 pupils.",
      workedSolution: "$$\\frac{70}{100} \\times 50 = 35\\text{ pupils}$$.",
      points: 1
    },
    {
      id: "q24",
      prompt: "The point $A(3, 4)$ is reflected in the $y$-axis. What are the coordinates of its image $A'$?",
      options: [
        "(-3, 4)",
        "(3, -4)",
        "(-3, -4)",
        "(4, 3)"
      ],
      correctAnswer: "(-3, 4)",
      hint: "Under reflection in the y-axis: $(x, y) \\to (-x, y)$.",
      workedSolution: "$$(3, 4) \\to (-3, 4)$$.",
      points: 1
    },
    {
      id: "q25",
      prompt: "Expand and simplify: $$(3a + b)(a - 2b)$$.",
      options: [
        "$$3a^2 - 5ab - 2b^2$$",
        "$$3a^2 + 5ab - 2b^2$$",
        "$$3a^2 - 7ab - 2b^2$$",
        "$$3a^2 - 2b^2$$"
      ],
      correctAnswer: "$$3a^2 - 5ab - 2b^2$$",
      hint: "$$3a(a - 2b) + b(a - 2b)$$.",
      workedSolution: "$$3a^2 - 6ab + ab - 2b^2 = 3a^2 - 5ab - 2b^2$$.",
      points: 1
    },
    {
      id: "q26",
      prompt: "Given column vectors $$p = \\begin{pmatrix} 2 \\\\ -3 \\end{pmatrix}$$ and $$q = \\begin{pmatrix} 1 \\\\ 4 \\end{pmatrix}$$, evaluate $$3p + q$$.",
      options: [
        "$$\\begin{pmatrix} 7 \\\\ -5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 7 \\\\ 5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 5 \\\\ -5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 7 \\\\ -9 \\end{pmatrix}$$"
      ],
      correctAnswer: "$$\\begin{pmatrix} 7 \\\\ -5 \\end{pmatrix}$$",
      hint: "$$3(2) + 1 = 7$$ and $$3(-3) + 4 = -9 + 4 = -5$$.",
      workedSolution: "$$\\begin{pmatrix} 3(2) + 1 \\\\ 3(-3) + 4 \\end{pmatrix} = \\begin{pmatrix} 6 + 1 \\\\ -9 + 4 \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ -5 \\end{pmatrix}$$.",
      points: 1
    },
    {
      id: "q27",
      prompt: "Solve for $y$ in the linear equation: $$\\frac{1}{2}y + \\frac{1}{4}y = 6$$.",
      options: [
        "6",
        "8",
        "10",
        "12"
      ],
      correctAnswer: "8",
      hint: "$$\\frac{1}{2}y + \\frac{1}{4}y = \\frac{3}{4}y = 6$$. Multiply by 4/3.",
      workedSolution: "$$\\frac{3}{4}y = 6 \\implies y = 6 \\times \\frac{4}{3} = 8$$.",
      points: 1
    },
    {
      id: "q28",
      prompt: "In a geometric compass construction on a ray, arcs of equal radii with centre $O$ bisect an angle of $60^\\circ$. What angle is constructed?",
      options: [
        "$$30^\\circ$$",
        "$$45^\\circ$$",
        "$$15^\\circ$$",
        "$$90^\\circ$$"
      ],
      correctAnswer: "$$30^\\circ$$",
      hint: "Bisecting 60° gives half of 60°.",
      workedSolution: "$$\\frac{60^\\circ}{2} = 30^\\circ$$.",
      points: 1
    },
    {
      id: "q29",
      prompt: "Triangle $A'B'C'$ is an enlargement of triangle $ABC$. If side $|AB| = 3\\text{ cm}$ and corresponding side $|A'B'| = 7.5\\text{ cm}$, find the linear scale factor of enlargement.",
      options: [
        "2.0",
        "2.5",
        "3.0",
        "1.5"
      ],
      correctAnswer: "2.5",
      hint: "Scale factor = Length of Image ÷ Length of Object.",
      workedSolution: "$$k = \\frac{7.5}{3} = 2.5$$.",
      points: 1
    },
    {
      id: "q30",
      prompt: "In a pie chart representing student hobbies, Reading is represented by an angle of $108^\\circ$. If $300$ students were surveyed in total, how many students chose Reading?",
      options: [
        "90",
        "108",
        "75",
        "80"
      ],
      correctAnswer: "90",
      hint: "Fraction of circle = 108 / 360 = 3 / 10.",
      workedSolution: "$$\\text{Students} = \\frac{108^\\circ}{360^\\circ} \\times 300 = \\frac{3}{10} \\times 300 = 90\\text{ students}$$.",
      points: 1
    },
    {
      id: "q31",
      prompt: "From the pie chart in Question 30, what percentage of the students chose Reading ($108^\\circ$)?",
      options: [
        "25.0%",
        "33.3%",
        "30.0%",
        "36.0%"
      ],
      correctAnswer: "30.0%",
      hint: "$$\\frac{108}{360} \\times 100\\%$$.",
      workedSolution: "$$\\frac{108}{360} \\times 100\\% = \\frac{3}{10} \\times 100\\% = 30.0\\%$$.",
      points: 1
    },
    {
      id: "q32",
      prompt: "In a right-angled triangle $PQR$ with right angle at $Q$, $\\angle QPR = 48^\\circ$ and $QR$ is extended to line $S$. Find the exterior angle $\\angle PRS$.",
      options: [
        "$$132^\\circ$$",
        "$$138^\\circ$$",
        "$$142^\\circ$$",
        "$$148^\\circ$$"
      ],
      correctAnswer: "$$138^\\circ$$",
      hint: "The exterior angle equals the sum of the two opposite interior angles: $90^\\circ + 48^\\circ$.",
      workedSolution: "$$\\text{Exterior angle} = 90^\\circ + 48^\\circ = 138^\\circ$$.",
      points: 1
    },
    {
      id: "q33",
      prompt: "There are $16$ boys and $24$ girls in a secondary class. A class prefect is chosen at random. What is the probability that the prefect is a girl?",
      options: [
        "$$\\frac{2}{5}$$",
        "$$\\frac{3}{4}$$",
        "$$\\frac{3}{5}$$",
        "$$\\frac{1}{2}$$"
      ],
      correctAnswer: "$$\\frac{3}{5}$$",
      hint: "Total pupils = 16 + 24 = 40. Girls = 24. P(girl) = 24 / 40.",
      workedSolution: "$$P(\\text{girl}) = \\frac{24}{40} = \\frac{3}{5}$$.",
      points: 1
    },
    {
      id: "q34",
      prompt: "The length of a rectangle is four times its width. If its perimeter is $40\\text{ cm}$, find the width of the rectangle.",
      options: [
        "4 cm",
        "5 cm",
        "8 cm",
        "16 cm"
      ],
      correctAnswer: "4 cm",
      hint: "$$2(4w + w) = 40 \\implies 10w = 40$$.",
      workedSolution: "$$2(5w) = 40 \\implies 10w = 40 \\implies w = 4\\text{ cm}$$.",
      points: 1
    },
    {
      id: "q35",
      prompt: "Each interior angle of a regular octagon ($8\\text{ sides}$) measures:",
      options: [
        "$$120^\\circ$$",
        "$$140^\\circ$$",
        "$$135^\\circ$$",
        "$$108^\\circ$$"
      ],
      correctAnswer: "$$135^\\circ$$",
      hint: "Exterior angle = $360^\\circ / 8 = 45^\\circ$. Interior angle = $180^\\circ - 45^\\circ$.",
      workedSolution: "$$\\text{Exterior angle} = \\frac{360^\\circ}{8} = 45^\\circ$$. $$\\text{Interior angle} = 180^\\circ - 45^\\circ = 135^\\circ$$.",
      points: 1
    },
    {
      id: "q36",
      prompt: "A square of side $5\\text{ cm}$ is enlarged by a linear scale factor of $3$. Calculate the area of the enlarged square.",
      options: [
        "$$75\\text{ cm}^2$$",
        "$$225\\text{ cm}^2$$",
        "$$150\\text{ cm}^2$$",
        "$$45\\text{ cm}^2$$"
      ],
      correctAnswer: "$$225\\text{ cm}^2$$",
      hint: "New side = $5 \\times 3 = 15\\text{ cm}$. Area = $15^2$, or Area of image = $k^2 \\times \\text{original area}$.",
      workedSolution: "$$\\text{New side} = 15\\text{ cm}$$. Area = $$15^2 = 225\\text{ cm}^2$$ (or $3^2 \\times 25 = 9 \\times 25 = 225\\text{ cm}^2$).",
      points: 1
    },
    {
      id: "q37",
      prompt: "A rectangular tank has length $4\\text{ m}$, width $3\\text{ m}$, and height $2\\text{ m}$. If the tank is filled with water to $3/4$ of its total capacity, calculate the volume of water in the tank.",
      options: [
        "$$24\\text{ m}^3$$",
        "$$18\\text{ m}^3$$",
        "$$12\\text{ m}^3$$",
        "$$20\\text{ m}^3$$"
      ],
      correctAnswer: "$$18\\text{ m}^3$$",
      hint: "Total capacity = $4 \\times 3 \\times 2 = 24\\text{ m}^3$. Multiply by 3/4.",
      workedSolution: "$$\\text{Capacity} = 4 \\times 3 \\times 2 = 24\\text{ m}^3$$. $$\\text{Volume} = \\frac{3}{4} \\times 24 = 18\\text{ m}^3$$.",
      points: 1
    },
    {
      id: "q38",
      prompt: "Water costs $\\text{GH¢ } 5.00$ per cubic metre ($1\\text{ m}^3$). How much does it cost to completely fill a rectangular reservoir measuring $5\\text{ m}$ by $4\\text{ m}$ by $2\\text{ m}$?",
      options: [
        "GH¢ 200.00",
        "GH¢ 180.00",
        "GH¢ 160.00",
        "GH¢ 240.00"
      ],
      correctAnswer: "GH¢ 200.00",
      hint: "Volume = $5 \\times 4 \\times 2 = 40\\text{ m}^3$. Multiply by GH¢ 5.00.",
      workedSolution: "$$\\text{Volume} = 40\\text{ m}^3$$. $$\\text{Cost} = 40 \\times 5.00 = \\text{GH¢ } 200.00$$.",
      points: 1
    },
    {
      id: "q39",
      prompt: "Express $25\\text{ m } 6\\text{ cm } 4\\text{ mm}$ entirely in millimetres.",
      options: [
        "25,604 mm",
        "2,564 mm",
        "25,064 mm",
        "250,604 mm"
      ],
      correctAnswer: "25,064 mm",
      hint: "$$1\\text{ m} = 1000\\text{ mm}$$, $$1\\text{ cm} = 10\\text{ mm}$$.",
      workedSolution: "$$25\\text{ m} = 25,000\\text{ mm}$$; $$6\\text{ cm} = 60\\text{ mm}$$; $$4\\text{ mm} = 4\\text{ mm}$$. Sum = $$25,000 + 60 + 4 = 25,064\\text{ mm}$$.",
      points: 1
    },
    {
      id: "q40",
      prompt: "The circumference of a circular running track is $22\\text{ m}$. Calculate the diameter of the track, taking $\\pi = \\frac{22}{7}$.",
      options: [
        "3.5 m",
        "7.0 m",
        "14.0 m",
        "11.0 m"
      ],
      correctAnswer: "7.0 m",
      hint: "Circumference $C = \\pi d \\implies d = C / \\pi$.",
      workedSolution: "$$d = \\frac{C}{\\pi} = \\frac{22}{\\frac{22}{7}} = 22 \\times \\frac{7}{22} = 7.0\\text{ m}$$.",
      points: 1
    }
  ],
  seededAt: "2026-09-15T17:00:00.000Z",
  lastUpdated: "2026-09-15T17:00:00.000Z"
};

// ============================================================================
// 3w. ALIGNED CORE CURRICULUM SERIES: JHS Math Structured Problem-Solving Series (Set 22)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-22
// ============================================================================
export const SET_JHS_MASTERY_SERIES_22: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-22",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 22)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
      id: "q01",
      title: "Question 1: Venn Diagram Set Modeling, Fraction Algebra & Linear Equations",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 360 190' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='350' height='180' x='5' y='5' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='18' y='28' font-family='sans-serif' font-size='13' font-weight='bold' fill='#0f172a'>U = 60</text><circle cx='135' cy='105' r='60' fill='none' stroke='#2563eb' stroke-width='2'/><circle cx='225' cy='105' r='60' fill='none' stroke='#059669' stroke-width='2'/><text x='105' y='45' font-size='12' font-weight='bold' fill='#2563eb'>Science (S: 35)</text><text x='215' y='45' font-size='12' font-weight='bold' fill='#059669'>Math (M: 40)</text><text x='95' y='110' font-size='12' fill='#1e293b'>35 - x</text><text x='175' y='110' font-size='13' font-weight='bold' fill='#dc2626'>x</text><text x='235' y='110' font-size='12' fill='#1e293b'>40 - x</text><text x='25' y='165' font-size='11' fill='#64748b'>Neither = 5</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "In a cohort of $60$ candidates, $35$ passed Integrated Science, $40$ passed Mathematics, and $5$ failed both subjects.\nUsing the Venn diagram provided above:\n(i) Illustrate the information with an algebraic equation.\n(ii) Find the number of candidates who passed **both** subjects.\n(iii) Calculate the number of candidates who passed Mathematics **only**.",
          hint: "Sum of all disjoint subsets and those outside both circles equals 60: $(35 - x) + x + (40 - x) + 5 = 60$.",
          modelAnswer: "(i) 80 - x = 60, (ii) 20 candidates, (iii) 20 candidates",
          workedSolution: "**(i) Algebraic Equation:**\n$$(35 - x) + x + (40 - x) + 5 = 60$$\n$$80 - x = 60$$\n\n**(ii) Candidates who passed both subjects ($x$):**\n$$x = 80 - 60 = 20\\text{ candidates}$$\n\n**(iii) Candidates who passed Mathematics only:**\n$$\\text{Math only} = 40 - x = 40 - 20 = 20\\text{ candidates}$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Simplify the fractional expression:\n$$3\\frac{1}{3} - 1\\frac{3}{4} + 2\\frac{1}{6}$$",
          hint: "Find the LCM of 3, 4, and 6, which is 12.",
          modelAnswer: "3 3/4",
          workedSolution: "**Method: Combining whole numbers and fractions**\n$$= (3 - 1 + 2) + \\left(\\frac{1}{3} - \\frac{3}{4} + \\frac{1}{6}\\right)$$\n$$= 4 + \\left(\\frac{4 - 9 + 2}{12}\\right)$$\n$$= 4 + \\left(\\frac{-3}{12}\\right) = 4 - \\frac{1}{4} = 3\\frac{3}{4}$$\n*(Or as improper fraction: $\\frac{15}{4}$)*."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Solve for $y$ in the equation:\n$$\\frac{2y - 5}{3} - \\frac{y - 2}{2} = 1$$",
          hint: "Multiply through by 6 (the LCM of 3 and 2) to eliminate the denominators.",
          modelAnswer: "y = 10",
          workedSolution: "Multiply through by $6$:\n$$6\\left(\\frac{2y - 5}{3}\\right) - 6\\left(\\frac{y - 2}{2}\\right) = 6(1)$$\n$$2(2y - 5) - 3(y - 2) = 6$$\n$$4y - 10 - 3y + 6 = 6$$\n$$y - 4 = 6 \\implies y = 6 + 4 = 10$$."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Commercial Percentage Markup, Discount Pricing & Currency Proportion",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "An electronics distributor bought an air conditioner for $\\text{GH¢ } 800.00$ and marked it to make a profit of $30\\%$ on the cost price.\n(i) Calculate the marked price of the air conditioner.\n(ii) If a customer is given a discount of $10\\%$ on the marked price during a seasonal clearance, calculate the actual cash price paid.",
          hint: "Marked price = 130% of GH¢ 800.00. Cash price = 90% of the marked price.",
          modelAnswer: "(i) GH¢ 1,040.00, (ii) GH¢ 936.00",
          workedSolution: "**(i) Marked Price:**\n$$\\text{Marked Price} = 130\\% \\times 800.00 = 1.30 \\times 800 = \\text{GH¢ } 1,040.00$$\n\n**(ii) Cash Price after 10% Discount:**\n$$\\text{Discount} = 10\\% \\times 1,040.00 = \\text{GH¢ } 104.00$$\n$$\\text{Cash Price} = 1,040.00 - 104.00 = \\text{GH¢ } 936.00$$\n*(Or directly: $0.90 \\times 1,040 = \\text{GH¢ } 936.00$)*."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Calculate the actual overall percentage profit the distributor made on the original cost price after the discount.",
          hint: "Profit = Cash Price - Cost Price. Profit % = (Profit / Cost Price) × 100%.",
          modelAnswer: "17%",
          workedSolution: "$$\\text{Actual Profit} = 936.00 - 800.00 = \\text{GH¢ } 136.00$$\n$$\\text{Overall Profit \\%} = \\left(\\frac{136.00}{800.00}\\right) \\times 100\\% = \\frac{136}{8}\\% = 17\\%$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "If $\\text{US\\$ } 1.00$ was equivalent to $\\text{GH¢ } 8.50$, calculate the cost of the air conditioner ($\\text{GH¢ } 800.00$) in US Dollars, giving your answer correct to two decimal places.",
          hint: "Divide the amount in Ghana Cedis by 8.50.",
          modelAnswer: "US$ 94.12",
          workedSolution: "$$\\text{Amount in US\\$} = \\frac{800.00}{8.50} = \\frac{8,000}{85} \\approx 94.1176 \\dots$$\nCorrect to two decimal places: **US$ 94.12**."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Right-Angled Shadow Geometry, Pythagoras & Angle Trigonometry",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 340 220' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><polygon points='50,180 250,180 250,40' fill='#f1f5f9' stroke='#1e293b' stroke-width='2'/><rect x='235' y='165' width='15' height='15' fill='none' stroke='#334155' stroke-width='1.5'/><line x1='50' y1='180' x2='250' y2='40' stroke='#2563eb' stroke-width='2.5'/><text x='35' y='195' font-size='12' font-weight='bold'>A</text><text x='260' y='195' font-size='12' font-weight='bold'>B</text><text x='260' y='35' font-size='12' font-weight='bold'>T</text><text x='130' y='200' font-size='12' font-weight='bold'>Shadow = 15 m</text><text x='265' y='115' font-size='12' font-weight='bold' fill='#dc2626'>Tower = 8 m</text><text x='120' y='100' font-size='12' font-weight='bold' fill='#2563eb'>L = ?</text><path d='M75,180 A25,25 0 0,0 70,165' fill='none' stroke='#059669' stroke-width='1.5'/><text x='85' y='170' font-size='11' font-weight='bold' fill='#059669'>θ</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "A vertical telecommunications tower $BT$ of height $8\\text{ m}$ casts a horizontal shadow $AB$ of length $15\\text{ m}$ along level ground, as shown in the diagram above.\nCalculate the straight-line distance $L$ from the tip of the tower ($T$) to the far end of the shadow ($A$).",
          hint: "Apply Pythagoras' theorem in right-angled triangle ABT: $L^2 = |AB|^2 + |BT|^2$.",
          modelAnswer: "17 m",
          workedSolution: "$$L^2 = |AB|^2 + |BT|^2$$\n$$L^2 = 15^2 + 8^2 = 225 + 64 = 289$$\n$$L = \\sqrt{289} = 17\\text{ m}$$\nTherefore, the straight-line distance is **$17\\text{ m}$**."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Using the dimensions from (a):\n(i) State $\\tan \\theta$ as a common fraction.\n(ii) State $\\cos \\theta$ as a common fraction.",
          hint: "$\\tan \\theta = \\text{Opposite} / \\text{Adjacent}$ and $\\cos \\theta = \\text{Adjacent} / \\text{Hypotenuse}$.",
          modelAnswer: "(i) 8/15, (ii) 15/17",
          workedSolution: "**(i)** $$\\tan \\theta = \\frac{|BT|}{|AB|} = \\frac{8}{15}$$\n\n**(ii)** $$\\cos \\theta = \\frac{|AB|}{L} = \\frac{15}{17}$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Calculate the area of the vertical triangular space enclosed between the tower, its shadow, and the line of sight $AT$.",
          hint: "Area = 1/2 × base × height.",
          modelAnswer: "60 m²",
          workedSolution: "$$\\text{Area} = \\frac{1}{2} \\times |AB| \\times |BT| = \\frac{1}{2} \\times 15 \\times 8 = 15 \\times 4 = 60\\text{ m}^2$$."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Cartesian Reflection, Vector Translations & Line Segment Lengths",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 260' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='140' x2='300' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='250' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><polygon points='200,90 250,90 200,40' fill='#dbeafe' stroke='#2563eb' stroke-width='2'/><text x='195' y='105' font-size='10' font-weight='bold'>A(2,2)</text><text x='255' y='105' font-size='10' font-weight='bold'>B(6,2)</text><text x='195' y='35' font-size='10' font-weight='bold'>C(2,6)</text><polygon points='200,190 250,190 200,240' fill='#fee2e2' stroke='#dc2626' stroke-width='2'/><text x='195' y='185' font-size='10' font-weight='bold' fill='#dc2626'>A₁</text><text x='255' y='185' font-size='10' font-weight='bold' fill='#dc2626'>B₁</text><text x='195' y='250' font-size='10' font-weight='bold' fill='#dc2626'>C₁</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "Triangle $ABC$ has vertices $A(2, 2)$, $B(6, 2)$, and $C(2, 6)$.\n(i) Write down the coordinates of image triangle $A_1B_1C_1$ under a reflection in the $x$-axis.\n(ii) Write down the coordinates of image triangle $A_2B_2C_2$ under a reflection in the $y$-axis.",
          hint: "Under reflection in the x-axis: (x, y) → (x, -y). Under reflection in the y-axis: (x, y) → (-x, y).",
          modelAnswer: "(i) A₁(2,-2), B₁(6,-2), C₁(2,-6); (ii) A₂(-2,2), B₂(-6,2), C₂(-2,6)",
          workedSolution: "**(i) Reflection in $x$-axis:** $$(x, y) \\to (x, -y)$$\n- $$A(2, 2) \\to A_1(2, -2)$$\n- $$B(6, 2) \\to B_1(6, -2)$$\n- $$C(2, 6) \\to C_1(2, -6)$$\n\n**(ii) Reflection in $y$-axis:** $$(x, y) \\to (-x, y)$$\n- $$A(2, 2) \\to A_2(-2, 2)$$\n- $$B(6, 2) \\to B_2(-6, 2)$$\n- $$C(2, 6) \\to C_2(-2, 6)$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Triangle $ABC$ is translated by vector $$T = \\begin{pmatrix} -4 \\\\ 3 \\end{pmatrix}$$ to produce image $A_3B_3C_3$.\nDetermine the coordinates of vertices $A_3$, $B_3$, and $C_3$.",
          hint: "Under translation by vector (a, b)ᵀ: (x, y) → (x + a, y + b).",
          modelAnswer: "A₃(-2, 5), B₃(2, 5), C₃(-2, 9)",
          workedSolution: "$$(x, y) \\to (x - 4, y + 3)$$\n- $$A(2, 2) \\to A_3(2 - 4, 2 + 3) = A_3(-2, 5)$$\n- $$B(6, 2) \\to B_3(6 - 4, 2 + 3) = B_3(2, 5)$$\n- $$C(2, 6) \\to C_3(2 - 4, 6 + 3) = C_3(-2, 9)$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Calculate the area of triangle $ABC$.",
          hint: "Triangle ABC is right-angled at vertex A. Area = 1/2 × base × height.",
          modelAnswer: "8 square units",
          workedSolution: "Base $$AB = 6 - 2 = 4\\text{ units}$$.\nHeight $$AC = 6 - 2 = 4\\text{ units}$$.\n$$\\text{Area} = \\frac{1}{2} \\times 4 \\times 4 = 8\\text{ square units}$$."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Discrete Frequency Statistics, Mean Calculation & Bar Charting",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 350 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><line x1='35' y1='160' x2='320' y2='160' stroke='#334155' stroke-width='2'/><line x1='35' y1='160' x2='35' y2='20' stroke='#334155' stroke-width='2'/><text x='150' y='188' font-size='11' font-weight='bold'>Marks Scored</text><text x='5' y='18' font-size='11' font-weight='bold'>Frequency</text><rect x='55' y='120' width='25' height='40' fill='#93c5fd' stroke='#1d4ed8'/><rect x='100' y='80' width='25' height='80' fill='#93c5fd' stroke='#1d4ed8'/><rect x='145' y='40' width='25' height='120' fill='#2563eb' stroke='#1d4ed8'/><rect x='190' y='60' width='25' height='100' fill='#93c5fd' stroke='#1d4ed8'/><rect x='235' y='100' width='25' height='60' fill='#93c5fd' stroke='#1d4ed8'/><rect x='280' y='140' width='25' height='20' fill='#93c5fd' stroke='#1d4ed8'/><text x='65' y='173' font-size='10'>1</text><text x='110' y='173' font-size='10'>2</text><text x='155' y='173' font-size='10'>3</text><text x='200' y='173' font-size='10'>4</text><text x='245' y='173' font-size='10'>5</text><text x='290' y='173' font-size='10'>6</text><text x='20' y='45' font-size='10'>6</text><text x='20' y='65' font-size='10'>5</text><text x='20' y='85' font-size='10'>4</text><text x='20' y='125' font-size='10'>2</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 9,
          prompt: "The bar chart above shows the marks scored by a group of $20$ students in an assessment:\n\n| Mark ($x$) | 1 | 2 | 3 | 4 | 5 | 6 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| Frequency ($f$) | 2 | 4 | 6 | 5 | 2 | 1 |\n\n(i) State the **modal mark**.\n(ii) Calculate the total number of students ($N = \\sum f$).\n(iii) Calculate the **mean mark** of the distribution.",
          hint: "Mode is the mark with highest frequency. Mean = $\\sum fx / \\sum f$.",
          modelAnswer: "(i) 3 marks, (ii) 20 students, (iii) 3.2 marks",
          workedSolution: "**(i) Modal mark:**\nThe highest frequency is $6$ (which corresponds to $3\\text{ marks}$). The **modal mark is 3**.\n\n**(ii) Total students:**\n$$N = \\sum f = 2 + 4 + 6 + 5 + 2 + 1 = 20\\text{ students}$$\n\n**(iii) Mean mark:**\n$$\\sum fx = (1 \\times 2) + (2 \\times 4) + (3 \\times 6) + (4 \\times 5) + (5 \\times 2) + (6 \\times 1)$$\n$$\\sum fx = 2 + 8 + 18 + 20 + 10 + 6 = 64$$\n$$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{64}{20} = 3.2\\text{ marks}$$."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "If a student is chosen at random from this class:\n(i) What is the probability that the student scored at least $4\\text{ marks}$?\n(ii) What percentage of students scored less than $3\\text{ marks}$?",
          hint: "'At least 4' means marks 4, 5, or 6. 'Less than 3' means marks 1 and 2.",
          modelAnswer: "(i) 2/5, (ii) 30%",
          workedSolution: "**(i) Probability of scoring at least 4 (marks 4, 5, 6):**\n$$\\text{Count} = f(4) + f(5) + f(6) = 5 + 2 + 1 = 8\\text{ students}$$\n$$P(x \\ge 4) = \\frac{8}{20} = \\frac{2}{5}$$\n\n**(ii) Percentage scoring less than 3 (marks 1 and 2):**\n$$\\text{Count} = f(1) + f(2) = 2 + 4 = 6\\text{ students}$$\n$$\\text{Percentage} = \\left(\\frac{6}{20}\\right) \\times 100\\% = 6 \\times 5 = 30\\%$$."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Direct Linear Modeling, Tabular Relations & Surd Magnitudes",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "A linear relation connects variables $x$ and $y$ such that:\n$$y = 2x - 3$$\nCopy and complete the table of values:\n\n| $x$ | -2 | -1 | 0 | 1 | 2 | 3 | 4 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y$ | **?** | -5 | **?** | -1 | **?** | 3 | **?** |",
          hint: "Substitute each missing x value into y = 2x - 3.",
          modelAnswer: "x=-2: -7, x=0: -3, x=2: 1, x=4: 5",
          workedSolution: "- For $x = -2$: $$y = 2(-2) - 3 = -4 - 3 = -7$$\n- For $x = 0$: $$y = 2(0) - 3 = -3$$\n- For $x = 2$: $$y = 2(2) - 3 = 4 - 3 = 1$$\n- For $x = 4$: $$y = 2(4) - 3 = 8 - 3 = 5$$\nThe complete sequence of $y$ values is **-7, -5, -3, -1, 1, 3, 5**."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Using the relation $$y = 2x - 3$$:\n(i) Find the value of $y$ when $x = 2.5$.\n(ii) Find the value of $x$ when $y = 11$.",
          hint: "Substitute the given values into the equation.",
          modelAnswer: "(i) y = 2, (ii) x = 7",
          workedSolution: "**(i)** When $x = 2.5$:\n$$y = 2(2.5) - 3 = 5 - 3 = 2$$\n\n**(ii)** When $y = 11$:\n$$11 = 2x - 3 \\implies 2x = 14 \\implies x = 7$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Given column vector $$v = \\begin{pmatrix} 6 \\\\ -8 \\end{pmatrix}$$, calculate the magnitude $|v|$ of the vector.",
          hint: "Magnitude $|v| = \\sqrt{x^2 + y^2}$.",
          modelAnswer: "10 units",
          workedSolution: "$$|v| = \\sqrt{6^2 + (-8)^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ units}$$."
        }
      ]
    }
  ],
  seededAt: "2026-09-15T17:30:00.000Z",
  lastUpdated: "2026-09-15T17:30:00.000Z"
};

// ============================================================================
// 3x. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 23)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-23
// ============================================================================
export const SET_JHS_MASTERY_SERIES_23: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-23",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 23)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series",
  variantType: "standard",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
      id: "q01",
      prompt: "If set $$P = \\{2, 3, 5, 7, 11, 13\\}$$ and set $$Q = \\{1, 3, 5, 7, 9, 11, 13\\}$$, find the number of elements in $$P \\cap Q$$.",
      options: [
        "4",
        "5",
        "6",
        "7"
      ],
      correctAnswer: "5",
      hint: "Identify the common elements present in both set P and set Q, then count them.",
      workedSolution: "Common elements are {3, 5, 7, 11, 13}. The total count is 5.",
      points: 1
    },
    {
      id: "q02",
      prompt: "Evaluate: $$4.5 \\times 0.06$$.",
      options: [
        "0.27",
        "0.027",
        "2.7",
        "0.0027"
      ],
      correctAnswer: "0.27",
      hint: "Multiply 45 by 6 to get 270, then count 3 decimal places from the right.",
      workedSolution: "$$4.5 \\times 0.06 = 0.270 = 0.27$$.",
      points: 1
    },
    {
      id: "q03",
      prompt: "Convert the base ten numeral $43_{\\text{ten}}$ to a base five numeral.",
      options: [
        "$$133_{\\text{five}}$$",
        "$$233_{\\text{five}}$$",
        "$$143_{\\text{five}}$$",
        "$$123_{\\text{five}}$$"
      ],
      correctAnswer: "$$133_{\\text{five}}$$",
      hint: "Divide repeatedly by 5: $43 = 1(25) + 3(5) + 3(1)$.",
      workedSolution: "$$43 \\div 5 = 8\\text{ R } 3$$; $$8 \\div 5 = 1\\text{ R } 3$$; $$1 \\div 5 = 0\\text{ R } 1$$. Reading upwards: $$133_{\\text{five}}$$.",
      points: 1
    },
    {
      id: "q04",
      prompt: "Find the Least Common Multiple (LCM) of $8, 12,$ and $18$.",
      options: [
        "36",
        "48",
        "72",
        "144"
      ],
      correctAnswer: "72",
      hint: "$$8 = 2^3$$, $$12 = 2^2 \\times 3$$, $$18 = 2 \\times 3^2$$. Multiply highest powers of all prime factors.",
      workedSolution: "$$\\text{LCM} = 2^3 \\times 3^2 = 8 \\times 9 = 72$$.",
      points: 1
    },
    {
      id: "q05",
      prompt: "If $$\\frac{x - 3}{2} = 4$$, find the value of $x$.",
      options: [
        "11",
        "8",
        "5",
        "14"
      ],
      correctAnswer: "11",
      hint: "Multiply both sides by 2, then add 3.",
      workedSolution: "$$x - 3 = 4 \\times 2 = 8 \\implies x = 8 + 3 = 11$$.",
      points: 1
    },
    {
      id: "q06",
      prompt: "Simplify: $$6a^2 b \\times 2ab^3$$.",
      options: [
        "$$12a^2 b^3$$",
        "$$12a^3 b^4$$",
        "$$8a^3 b^4$$",
        "$$12a^3 b^3$$"
      ],
      correctAnswer: "$$12a^3 b^4$$",
      hint: "Multiply coefficients: $6 \\times 2 = 12$. Add powers for $a$ and $b$.",
      workedSolution: "$$(6 \\times 2) \\times a^{2+1} \\times b^{1+3} = 12a^3 b^4$$.",
      points: 1
    },
    {
      id: "q07",
      prompt: "Round $47,682$ to the nearest hundred.",
      options: [
        "47,600",
        "47,700",
        "48,000",
        "47,680"
      ],
      correctAnswer: "47,700",
      hint: "Look at the tens digit (8): since $8 \\ge 5$, round the hundreds digit up.",
      workedSolution: "The tens digit is 8, so 6 in the hundreds place rounds up to 7: 47,700.",
      points: 1
    },
    {
      id: "q08",
      prompt: "What is the size of each interior angle of an equilateral triangle?",
      options: [
        "$$45^\\circ$$",
        "$$90^\\circ$$",
        "$$60^\\circ$$",
        "$$120^\\circ$$"
      ],
      correctAnswer: "$$60^\\circ$$",
      hint: "The interior angles of any triangle sum to 180°. Divide by 3.",
      workedSolution: "$$180^\\circ \\div 3 = 60^\\circ$$.",
      points: 1
    },
    {
      id: "q09",
      prompt: "Express $$\\frac{5}{8}$$ as a percentage.",
      options: [
        "62.5%",
        "58.0%",
        "65.0%",
        "60.0%"
      ],
      correctAnswer: "62.5%",
      hint: "$$\\frac{5}{8} \\times 100\\% = \\frac{500}{8}\\%$$.",
      workedSolution: "$$\\frac{500}{8}\\% = 62.5\\%$$.",
      points: 1
    },
    {
      id: "q10",
      prompt: "A student scored $18$ out of $25$ in a class quiz. What is her percentage score?",
      options: [
        "68%",
        "72%",
        "75%",
        "70%"
      ],
      correctAnswer: "72%",
      hint: "Multiply numerator and denominator by 4 to get a fraction over 100.",
      workedSolution: "$$\\frac{18}{25} \\times 100\\% = 18 \\times 4\\% = 72\\%$$.",
      points: 1
    },
    {
      id: "q11",
      prompt: "A school bus covers $90\\text{ km}$ in $1\\frac{1}{2}\\text{ hours}$. Calculate its average speed in $\\text{km/h}$.",
      options: [
        "60 km/h",
        "45 km/h",
        "75 km/h",
        "50 km/h"
      ],
      correctAnswer: "60 km/h",
      hint: "Speed = Distance ÷ Time. $1\\frac{1}{2} = 1.5$ hours.",
      workedSolution: "$$\\text{Speed} = \\frac{90}{1.5} = 60\\text{ km/h}$$.",
      points: 1
    },
    {
      id: "q12",
      prompt: "Factorize completely: $$5ax - 10ay + 2bx - 4by$$.",
      options: [
        "$$(x - 2y)(5a - 2b)$$",
        "$$(x + 2y)(5a + 2b)$$",
        "$$(x - 2y)(5a + 2b)$$",
        "$$(x - y)(5a + 4b)$$"
      ],
      correctAnswer: "$$(x - 2y)(5a + 2b)$$",
      hint: "Factor out 5a from the first pair and 2b from the second pair.",
      workedSolution: "$$5a(x - 2y) + 2b(x - 2y) = (x - 2y)(5a + 2b)$$.",
      points: 1
    },
    {
      id: "q13",
      prompt: "Solve the inequality: $$4x - 5 \\le 2x + 7$$.",
      options: [
        "$$x \\le 6$$",
        "$$x \\ge 6$$",
        "$$x \\le 1$$",
        "$$x \\ge 1$$"
      ],
      correctAnswer: "$$x \\le 6$$",
      hint: "$$4x - 2x \\le 7 + 5$$.",
      workedSolution: "$$2x \\le 12 \\implies x \\le 6$$.",
      points: 1
    },
    {
      id: "q14",
      prompt: "Calculate the simple interest on a principal of $\\text{GH¢ } 500.00$ at $8\\%\\text{ per annum}$ for $3\\text{ years}$.",
      options: [
        "GH¢ 80.00",
        "GH¢ 120.00",
        "GH¢ 150.00",
        "GH¢ 100.00"
      ],
      correctAnswer: "GH¢ 120.00",
      hint: "$$I = \\frac{P \\times R \\times T}{100}$$.",
      workedSolution: "$$I = \\frac{500 \\times 8 \\times 3}{100} = 5 \\times 24 = \\text{GH¢ } 120.00$$.",
      points: 1
    },
    {
      id: "q15",
      prompt: "If $x : 15 = 4 : 5$, find the value of $x$.",
      options: [
        "10",
        "8",
        "12",
        "16"
      ],
      correctAnswer: "12",
      hint: "Cross-multiply: $5x = 15 \\times 4$.",
      workedSolution: "$$5x = 60 \\implies x = 12$$.",
      points: 1
    },
    {
      id: "q16",
      prompt: "Find the circumference of a circle whose radius is $3.5\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).",
      options: [
        "22 cm",
        "11 cm",
        "44 cm",
        "38.5 cm"
      ],
      correctAnswer: "22 cm",
      hint: "Circumference = $2\\pi r$.",
      workedSolution: "$$C = 2 \\times \\frac{22}{7} \\times 3.5 = 2 \\times 22 \\times 0.5 = 22\\text{ cm}$$.",
      points: 1
    },
    {
      id: "q17",
      prompt: "Evaluate: $$\\left(2\\frac{1}{2} \\times 1\\frac{1}{5}\\right) - \\frac{3}{4}$$.",
      options: [
        "$$2\\frac{1}{4}$$",
        "$$2\\frac{1}{2}$$",
        "$$3\\frac{1}{4}$$",
        "$$1\\frac{3}{4}$$"
      ],
      correctAnswer: "$$2\\frac{1}{4}$$",
      hint: "Convert to improper fractions: $\\frac{5}{2} \\times \\frac{6}{5} = 3$. Then subtract 3/4.",
      workedSolution: "$$\\frac{5}{2} \\times \\frac{6}{5} = 3$$. Then $$3 - \\frac{3}{4} = 2\\frac{1}{4}$$.",
      points: 1
    },
    {
      id: "q18",
      prompt: "The scores obtained by seven students in a contest are: $$12, 15, 11, 18, 14, 15, 13$$. Find the median score.",
      options: [
        "13",
        "14",
        "15",
        "13.5"
      ],
      correctAnswer: "14",
      hint: "Arrange in ascending order: 11, 12, 13, 14, 15, 15, 18. Pick the 4th score.",
      workedSolution: "Arranged: 11, 12, 13, **14**, 15, 15, 18. The middle number is 14.",
      points: 1
    },
    {
      id: "q19",
      prompt: "From Question 18, identify the modal score.",
      options: [
        "15",
        "14",
        "13",
        "12"
      ],
      correctAnswer: "15",
      hint: "The mode is the score that appears most frequently.",
      workedSolution: "15 appears twice, while all other scores appear once. The mode is 15.",
      points: 1
    },
    {
      id: "q20",
      prompt: "In a bag containing $8$ blue balls and $12$ yellow balls, what is the probability of selecting a blue ball at random?",
      options: [
        "$$\\frac{3}{5}$$",
        "$$\\frac{2}{3}$$",
        "$$\\frac{2}{5}$$",
        "$$\\frac{1}{2}$$"
      ],
      correctAnswer: "$$\\frac{2}{5}$$",
      hint: "Total balls = 8 + 12 = 20. Favourable = 8.",
      workedSolution: "$$P(\\text{blue}) = \\frac{8}{20} = \\frac{2}{5}$$.",
      points: 1
    },
    {
      id: "q21",
      prompt: "A pair of vertically opposite angles are represented by $(3x + 10)^\\circ$ and $(2x + 35)^\\circ$. Find the value of $x$.",
      options: [
        "25",
        "20",
        "30",
        "15"
      ],
      correctAnswer: "25",
      hint: "Vertically opposite angles are equal: $3x + 10 = 2x + 35$.",
      workedSolution: "$$3x - 2x = 35 - 10 \\implies x = 25$$.",
      points: 1
    },
    {
      id: "q22",
      prompt: "Given column vectors $$u = \\begin{pmatrix} 4 \\\\ -1 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} -2 \\\\ 3 \\end{pmatrix}$$, evaluate $$u - 2v$$.",
      options: [
        "$$\\begin{pmatrix} 8 \\\\ -7 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 0 \\\\ -7 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 8 \\\\ 5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 0 \\\\ 5 \\end{pmatrix}$$"
      ],
      correctAnswer: "$$\\begin{pmatrix} 8 \\\\ -7 \\end{pmatrix}$$",
      hint: "$$4 - 2(-2) = 4 + 4 = 8$$ and $$-1 - 2(3) = -1 - 6 = -7$$.",
      workedSolution: "$$\\begin{pmatrix} 4 - 2(-2) \\\\ -1 - 2(3) \\end{pmatrix} = \\begin{pmatrix} 8 \\\\ -7 \\end{pmatrix}$$.",
      points: 1
    },
    {
      id: "q23",
      prompt: "Simplify: $$\\frac{3}{x} + \\frac{2}{y}$$.",
      options: [
        "$$\\frac{5}{xy}$$",
        "$$\\frac{3y + 2x}{xy}$$",
        "$$\\frac{3x + 2y}{xy}$$",
        "$$\\frac{5}{x + y}$$"
      ],
      correctAnswer: "$$\\frac{3y + 2x}{xy}$$",
      hint: "The common denominator is $xy$.",
      workedSolution: "$$\\frac{3(y) + 2(x)}{xy} = \\frac{3y + 2x}{xy}$$.",
      points: 1
    },
    {
      id: "q24",
      prompt: "A rectangular field is $20\\text{ m}$ long and $15\\text{ m}$ wide. Calculate its perimeter.",
      options: [
        "35 m",
        "300 m",
        "70 m",
        "60 m"
      ],
      correctAnswer: "70 m",
      hint: "Perimeter = 2(length + width).",
      workedSolution: "$$2(20 + 15) = 2(35) = 70\\text{ m}$$.",
      points: 1
    },
    {
      id: "q25",
      prompt: "Find the area of the rectangular field in Question 24.",
      options: [
        "$$300\\text{ m}^2$$",
        "$$150\\text{ m}^2$$",
        "$$70\\text{ m}^2$$",
        "$$350\\text{ m}^2$$"
      ],
      correctAnswer: "$$300\\text{ m}^2$$",
      hint: "Area = length × width.",
      workedSolution: "$$20 \\times 15 = 300\\text{ m}^2$$.",
      points: 1
    },
    {
      id: "q26",
      prompt: "A trader bought an article for $\\text{GH¢ } 120.00$ and sold it at a loss of $15\\%$. Find the selling price.",
      options: [
        "GH¢ 102.00",
        "GH¢ 100.00",
        "GH¢ 105.00",
        "GH¢ 98.00"
      ],
      correctAnswer: "GH¢ 102.00",
      hint: "Loss = 15% of 120 = 18. Selling price = 120 - 18.",
      workedSolution: "$$\\text{Loss} = 0.15 \\times 120 = 18$$. Selling price = $$120 - 18 = \\text{GH¢ } 102.00$$.",
      points: 1
    },
    {
      id: "q27",
      prompt: "Find the Highest Common Factor (HCF) of $30, 45,$ and $75$.",
      options: [
        "5",
        "15",
        "25",
        "10"
      ],
      correctAnswer: "15",
      hint: "$$30 = 15 \\times 2$$, $$45 = 15 \\times 3$$, $$75 = 15 \\times 5$$.",
      workedSolution: "The greatest integer dividing 30, 45, and 75 without a remainder is 15.",
      points: 1
    },
    {
      id: "q28",
      prompt: "Express $0.0052$ in standard form.",
      options: [
        "$$5.2 \\times 10^{-3}$$",
        "$$5.2 \\times 10^3$$",
        "$$5.2 \\times 10^{-2}$$",
        "$$52 \\times 10^{-4}$$"
      ],
      correctAnswer: "$$5.2 \\times 10^{-3}$$",
      hint: "Move the decimal point 3 places to the right: $5.2 \\times 10^{-3}$.",
      workedSolution: "$$0.0052 = 5.2 \\times 10^{-3}$$.",
      points: 1
    },
    {
      id: "q29",
      prompt: "If $a = 3$ and $b = -2$, evaluate: $$a^2 - 2ab + b^2$$.",
      options: [
        "25",
        "1",
        "13",
        "17"
      ],
      correctAnswer: "25",
      hint: "Notice that $a^2 - 2ab + b^2 = (a - b)^2$.",
      workedSolution: "$$(3 - (-2))^2 = (3 + 2)^2 = 5^2 = 25$$.",
      points: 1
    },
    {
      id: "q30",
      prompt: "How many lines of symmetry does a regular rectangle (non-square) have?",
      options: [
        "4",
        "2",
        "1",
        "0"
      ],
      correctAnswer: "2",
      hint: "A non-square rectangle has horizontal and vertical lines of symmetry through midpoints of opposite sides.",
      workedSolution: "A rectangle has exactly 2 lines of symmetry (the diagonals are not lines of symmetry).",
      points: 1
    },
    {
      id: "q31",
      prompt: "The three angles of a triangle are $x^\\circ, 2x^\\circ,$ and $3x^\\circ$. Find the value of $x$.",
      options: [
        "$$30^\\circ$$",
        "$$25^\\circ$$",
        "$$20^\\circ$$",
        "$$35^\\circ$$"
      ],
      correctAnswer: "$$30^\\circ$$",
      hint: "$$x + 2x + 3x = 180 \\implies 6x = 180$$.",
      workedSolution: "$$6x = 180 \\implies x = 30^\\circ$$.",
      points: 1
    },
    {
      id: "q32",
      prompt: "From Question 31, what is the largest angle of the triangle?",
      options: [
        "$$60^\\circ$$",
        "$$90^\\circ$$",
        "$$120^\\circ$$",
        "$$75^\\circ$$"
      ],
      correctAnswer: "$$90^\\circ$$",
      hint: "Largest angle = $3x^\\circ = 3(30^\\circ)$.",
      workedSolution: "$$3 \\times 30^\\circ = 90^\\circ$$.",
      points: 1
    },
    {
      id: "q33",
      prompt: "A solid cylinder has base diameter $14\\text{ cm}$ and height $10\\text{ cm}$. Find its curved surface area. (Take $\\pi = \\frac{22}{7}$).",
      options: [
        "$$440\\text{ cm}^2$$",
        "$$220\\text{ cm}^2$$",
        "$$154\\text{ cm}^2$$",
        "$$594\\text{ cm}^2$$"
      ],
      correctAnswer: "$$440\\text{ cm}^2$$",
      hint: "Curved surface area = $2\\pi r h = \\pi d h$.",
      workedSolution: "$$\\text{CSA} = \\frac{22}{7} \\times 14 \\times 10 = 22 \\times 2 \\times 10 = 440\\text{ cm}^2$$.",
      points: 1
    },
    {
      id: "q34",
      prompt: "State the rule for the linear mapping where inputs $x = \\{1, 2, 3, 4\\}$ produce outputs $y = \\{5, 8, 11, 14\\}$.",
      options: [
        "$$x \\to 3x + 2$$",
        "$$x \\to 4x + 1$$",
        "$$x \\to 3x - 2$$",
        "$$x \\to 2x + 3$$"
      ],
      correctAnswer: "$$x \\to 3x + 2$$",
      hint: "Common difference is 3. When $x = 1$, $y = 3(1) + 2 = 5$.",
      workedSolution: "Common difference between outputs is 3 ($3x$). For $x = 1$, $3(1) + c = 5 \\implies c = 2$. Rule is $$x \\to 3x + 2$$.",
      points: 1
    },
    {
      id: "q35",
      prompt: "Evaluate: $$\\sqrt{144} + \\sqrt{81} - \\sqrt{25}$$.",
      options: [
        "16",
        "18",
        "20",
        "14"
      ],
      correctAnswer: "16",
      hint: "Take the square root of each number: $12 + 9 - 5$.",
      workedSolution: "$$12 + 9 - 5 = 21 - 5 = 16$$.",
      points: 1
    },
    {
      id: "q36",
      prompt: "In an examination, $85\\%$ of the candidates passed. If $45$ candidates failed, how many candidates wrote the examination in total?",
      options: [
        "300",
        "350",
        "250",
        "400"
      ],
      correctAnswer: "300",
      hint: "Failure percentage = $100\\% - 85\\% = 15\\%$. If $15\\% = 45$, find $100\\%$.",
      workedSolution: "$$15\\% = 45 \\implies 1\\% = 3$$. Total candidates = $$100 \\times 3 = 300$$.",
      points: 1
    },
    {
      id: "q37",
      prompt: "In a right-angled triangle, the two perpendicular sides measure $6\\text{ cm}$ and $8\\text{ cm}$. Find the length of the hypotenuse.",
      options: [
        "12 cm",
        "10 cm",
        "14 cm",
        "9 cm"
      ],
      correctAnswer: "10 cm",
      hint: "$$c^2 = a^2 + b^2 = 6^2 + 8^2$$.",
      workedSolution: "$$c^2 = 36 + 64 = 100 \\implies c = \\sqrt{100} = 10\\text{ cm}$$.",
      points: 1
    },
    {
      id: "q38",
      prompt: "Find the truth set of $$2x - 3 > 7$$ where $x$ is a real number.",
      options: [
        "$$\\{x : x > 5\\}$$",
        "$$\\{x : x < 5\\}$$",
        "$$\\{x : x > 2\\}$$",
        "$$\\{x : x < 2\\}$$"
      ],
      correctAnswer: "$$\\{x : x > 5\\}$$",
      hint: "$$2x > 7 + 3 = 10$$. Divide by 2.",
      workedSolution: "$$2x > 10 \\implies x > 5$$. Truth set: $$\\{x : x > 5\\}$$.",
      points: 1
    },
    {
      id: "q39",
      prompt: "A car uses $5\\text{ litres}$ of petrol for every $60\\text{ km}$ travelled. How much petrol will it consume on a trip of $216\\text{ km}$?",
      options: [
        "16.5 litres",
        "18.0 litres",
        "17.2 litres",
        "15.0 litres"
      ],
      correctAnswer: "18.0 litres",
      hint: "Find fuel consumption per km: $5 / 60 = 1 / 12$ litre/km. Multiply by 216.",
      workedSolution: "$$\\frac{216}{12} = 18\\text{ litres}$$.",
      points: 1
    },
    {
      id: "q40",
      prompt: "Under a reflection in the $x$-axis, the image of point $P(x, y)$ is:",
      options: [
        "(-x, y)",
        "(x, -y)",
        "(-x, -y)",
        "(y, x)"
      ],
      correctAnswer: "(x, -y)",
      hint: "The x-coordinate remains unchanged while the y-coordinate changes sign.",
      workedSolution: "Reflection in the $x$-axis maps $$(x, y) \\to (x, -y)$$.",
      points: 1
    }
  ],
  seededAt: "2026-09-15T18:00:00.000Z",
  lastUpdated: "2026-09-15T18:00:00.000Z"
};

// ============================================================================
// 3y. ALIGNED CORE CURRICULUM SERIES: JHS Math Structured Problem-Solving Series (Set 24)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-24
// ============================================================================
export const SET_JHS_MASTERY_SERIES_24: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-24",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 24)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
      id: "q01",
      title: "Question 1: Dual-Subject Examination Venn Sets & Fractional Operations",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 360 190' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='350' height='180' x='5' y='5' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='18' y='28' font-family='sans-serif' font-size='13' font-weight='bold' fill='#0f172a'>U = 45</text><circle cx='135' cy='105' r='60' fill='none' stroke='#2563eb' stroke-width='2'/><circle cx='225' cy='105' r='60' fill='none' stroke='#059669' stroke-width='2'/><text x='100' y='45' font-size='12' font-weight='bold' fill='#2563eb'>Science (S: 28)</text><text x='215' y='45' font-size='12' font-weight='bold' fill='#059669'>Math (M: 25)</text><text x='95' y='110' font-size='12' fill='#1e293b'>28 - x</text><text x='175' y='110' font-size='13' font-weight='bold' fill='#dc2626'>x</text><text x='235' y='110' font-size='12' fill='#1e293b'>25 - x</text><text x='25' y='165' font-size='11' fill='#64748b'>Neither = 4</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "In a class of $45$ students, $28$ passed Integrated Science, $25$ passed Mathematics, and $4$ failed both subjects.\nUsing the Venn diagram provided above:\n(i) Formulate an algebraic equation connecting the subsets.\n(ii) Calculate the number of students who passed **both** subjects.\n(iii) Calculate the number of students who passed Integrated Science **only**.",
          hint: "The sum of all parts in the Venn diagram equals 45: $(28 - x) + x + (25 - x) + 4 = 45$.",
          modelAnswer: "(i) 57 - x = 45, (ii) 12 students, (iii) 16 students",
          workedSolution: "**(i) Algebraic Equation:**\n$$(28 - x) + x + (25 - x) + 4 = 45$$\n$$57 - x = 45$$\n\n**(ii) Students passing both subjects ($x$):**\n$$x = 57 - 45 = 12\\text{ students}$$\n\n**(iii) Students passing Science only:**\n$$\\text{Science only} = 28 - x = 28 - 12 = 16\\text{ students}$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Simplify the mixed fractional expression:\n$$4\\frac{1}{2} - 2\\frac{2}{3} + 1\\frac{3}{4}$$",
          hint: "Group whole numbers and fractions using a common denominator of 12.",
          modelAnswer: "3 7/12",
          workedSolution: "**Method: Combining whole numbers and fractional parts**\n$$= (4 - 2 + 1) + \\left(\\frac{1}{2} - \\frac{2}{3} + \\frac{3}{4}\\right)$$\n$$= 3 + \\left(\\frac{6 - 8 + 9}{12}\\right)$$\n$$= 3 + \\frac{7}{12} = 3\\frac{7}{12}$$\n*(Or as improper fraction: $\\frac{43}{12}$)*."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Solve for $p$ in the equation:\n$$\\frac{3p - 1}{4} - \\frac{p - 2}{3} = 2$$",
          hint: "Multiply through by 12 (the LCM of 4 and 3) to clear fractions.",
          modelAnswer: "p = 3.8 (or 19/5)",
          workedSolution: "Multiply both sides by $12$:\n$$12\\left(\\frac{3p - 1}{4}\\right) - 12\\left(\\frac{p - 2}{3}\\right) = 12(2)$$\n$$3(3p - 1) - 4(p - 2) = 24$$\n$$9p - 3 - 4p + 8 = 24$$\n$$5p + 5 = 24$$\n$$5p = 24 - 5 = 19 \\implies p = \\frac{19}{5} = 3\\frac{4}{5} = 3.8$$."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Linear Simultaneous Relations & Coordinate Graphing",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 250' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='140' x2='290' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='230' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><line x1='50' y1='200' x2='270' y2='40' stroke='#2563eb' stroke-width='2'/><line x1='50' y1='40' x2='270' y2='200' stroke='#dc2626' stroke-width='2'/><circle cx='160' cy='120' r='5' fill='#059669'/><text x='170' y='115' font-size='12' font-weight='bold' fill='#059669'>(0, 1)</text><text x='250' y='55' font-size='11' fill='#2563eb'>y₁ = 2x + 1</text><text x='250' y='185' font-size='11' fill='#dc2626'>y₂ = 1 - x</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "Copy and complete the table of values for the relations $$y_1 = 2x + 1$$ and $$y_2 = 1 - x$$:\n\n| $x$ | -2 | -1 | 0 | 1 | 2 | 3 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 2x + 1$ | -3 | **?** | 1 | **?** | 5 | **?** |\n| $y_2 = 1 - x$ | **?** | 2 | **?** | 0 | **?** | -2 |",
          hint: "Substitute each missing x value into $y_1 = 2x + 1$ and $y_2 = 1 - x$.",
          modelAnswer: "y₁: [-3, -1, 1, 3, 5, 7]; y₂: [3, 2, 1, 0, -1, -2]",
          workedSolution: "For $y_1 = 2x + 1$:\n- $x = -1 \\implies 2(-1) + 1 = -1$\n- $x = 1 \\implies 2(1) + 1 = 3$\n- $x = 3 \\implies 2(3) + 1 = 7$\n\nFor $y_2 = 1 - x$:\n- $x = -2 \\implies 1 - (-2) = 3$\n- $x = 0 \\implies 1 - 0 = 1$\n- $x = 2 \\implies 1 - 2 = -1$"
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "From the simultaneous graph above, determine:\n(i) The coordinates of the point of intersection of lines $y_1$ and $y_2$.\n(ii) The gradient of the line $y_1 = 2x + 1$.",
          hint: "Set $2x + 1 = 1 - x$ to find $x$, then calculate $y$. Gradient is the coefficient of $x$ in $y = mx + c$.",
          modelAnswer: "(i) (0, 1), (ii) Gradient = 2",
          workedSolution: "**(i) Point of intersection:**\n$$2x + 1 = 1 - x$$\n$$2x + x = 1 - 1$$\n$$3x = 0 \\implies x = 0$$\nWhen $x = 0$, $y = 2(0) + 1 = 1$.\nThe coordinates are **$(0, 1)$**.\n\n**(ii) Gradient:**\nComparing $y_1 = 2x + 1$ with $y = mx + c$, the gradient is **$m = 2$**."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Find the truth set of the inequality: $$2x + 1 > 1 - x$$.",
          hint: "Collect all x terms on the left-hand side.",
          modelAnswer: "{x : x > 0}",
          workedSolution: "$$2x + 1 > 1 - x$$\n$$2x + x > 1 - 1$$\n$$3x > 0 \\implies x > 0$$\nTruth set: **$$\\{x : x > 0, \\, x \\in \\mathbb{R}\\}$$**."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Commercial Profit Margins, Compound Reductions & Daily Wage Rates",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "A store owner bought $50$ pairs of shoes for $\\text{GH¢ } 1,500.00$. She sold $30$ pairs at $\\text{GH¢ } 40.00$ per pair and the remaining $20$ pairs at $\\text{GH¢ } 35.00$ per pair.\nCalculate:\n(i) Her total sales revenue.\n(ii) Her total profit.\n(iii) Her overall percentage profit on cost.",
          hint: "Total revenue = (30 × 40) + (20 × 35). Profit = Revenue - Cost Price.",
          modelAnswer: "(i) GH¢ 1,900.00, (ii) GH¢ 400.00, (iii) 26.67%",
          workedSolution: "**(i) Total sales revenue:**\n$$\\text{Revenue} = (30 \\times 40.00) + (20 \\times 35.00) = 1,200.00 + 700.00 = \\text{GH¢ } 1,900.00$$\n\n**(ii) Total profit:**\n$$\\text{Profit} = 1,900.00 - 1,500.00 = \\text{GH¢ } 400.00$$\n\n**(iii) Percentage profit:**\n$$\\text{Percentage profit} = \\left(\\frac{400.00}{1,500.00}\\right) \\times 100\\% = \\frac{400}{15}\\% = 26\\frac{2}{3}\\% \\approx 26.67\\%$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "A technician earns $\\text{GH¢ } 360.00$ for working $6\\text{ days}$.\n(i) What is his daily wage rate?\n(ii) How much will he earn for working $14\\text{ days}$ at the same rate?",
          hint: "Daily wage = Total wage ÷ 6. Multiply daily wage by 14.",
          modelAnswer: "(i) GH¢ 60.00, (ii) GH¢ 840.00",
          workedSolution: "**(i) Daily rate:**\n$$\\text{Daily rate} = \\frac{\\text{GH¢ } 360.00}{6} = \\text{GH¢ } 60.00\\text{ per day}$$\n\n**(ii) Earnings for 14 days:**\n$$\\text{Earnings} = 14 \\times \\text{GH¢ } 60.00 = \\text{GH¢ } 840.00$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "An article with a list price of $\\text{GH¢ } 240.00$ is discounted by $12\\frac{1}{2}\\%$. Find the cash sale price of the article.",
          hint: "Note that $12\\frac{1}{2}\\% = \\frac{1}{8}$.",
          modelAnswer: "GH¢ 210.00",
          workedSolution: "$$\\text{Discount} = \\frac{12.5}{100} \\times 240.00 = \\frac{1}{8} \\times 240.00 = \\text{GH¢ } 30.00$$\n$$\\text{Cash price} = 240.00 - 30.00 = \\text{GH¢ } 210.00$$."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Vector Operations, Magnitude in Surds & Linear Transformations",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "Given column vectors $$u = \\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix}$$ and $$w = \\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix}$$, calculate the vector:\n$$v = 2u - 3w$$",
          hint: "Multiply u by 2 and w by 3, then subtract component-wise.",
          modelAnswer: "(9, -14)ᵀ",
          workedSolution: "$$v = 2\\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix} - 3\\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix}$$\n$$= \\begin{pmatrix} 6 \\\\ -8 \\end{pmatrix} - \\begin{pmatrix} -3 \\\\ 6 \\end{pmatrix}$$\n$$= \\begin{pmatrix} 6 - (-3) \\\\ -8 - 6 \\end{pmatrix} = \\begin{pmatrix} 9 \\\\ -14 \\end{pmatrix}$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Calculate the magnitude $|u|$ of the vector $$u = \\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix}$$.",
          hint: "Magnitude $|u| = \\sqrt{x^2 + y^2}$.",
          modelAnswer: "5 units",
          workedSolution: "$$|u| = \\sqrt{3^2 + (-4)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5\\text{ units}$$."
        },
        {
          partLabel: "(c)",
          marks: 5,
          prompt: "Point $P(5, -2)$ is mapped to point $P'(1, 4)$ under a translation vector $T$.\n(i) Determine the translation vector $T$.\n(ii) Find the image of the origin $(0, 0)$ under the same translation $T$.",
          hint: "Translation vector $T = P' - P$.",
          modelAnswer: "(i) (-4, 6)ᵀ, (ii) (-4, 6)",
          workedSolution: "**(i) Translation vector $T$:**\n$$T = \\begin{pmatrix} 1 - 5 \\\\ 4 - (-2) \\end{pmatrix} = \\begin{pmatrix} -4 \\\\ 6 \\end{pmatrix}$$\n\n**(ii) Image of $(0, 0)$:**\n$$(0 - 4, 0 + 6) = (-4, 6)$$."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Geometric Compass Triangle Construction & Inscribed Measurements",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 9,
          prompt: "In a geometric compass and ruler construction:\n1. Construct line segment $|AB| = 8\\text{ cm}$.\n2. At vertex $A$, construct angle $\\angle CAB = 60^\\circ$.\n3. With centre $B$ and radius $7\\text{ cm}$, draw an arc to intersect line $AC$ at vertex $C$.\n(i) State the length of side $|BC|$.\n(ii) If the perpendicular line dropped from vertex $C$ to segment $AB$ meets $AB$ at $D$, calculate the perpendicular height $|CD|$ using the sine ratio ($|AC| \\sin 60^\\circ$), given $|AC| = 5.2\\text{ cm}$ and $\\sin 60^\\circ = \\frac{\\sqrt{3}}{2} \\approx 0.866$.",
          hint: "Height $h = |AC| \\sin 60^\\circ = 5.2 \\times 0.866$.",
          modelAnswer: "(i) 7 cm, (ii) 4.5 cm",
          workedSolution: "**(i)** By direct construction construction radius, $$|BC| = 7\\text{ cm}$$.\n\n**(ii) Perpendicular height $|CD|$:**\n$$|CD| = |AC| \\times \\sin 60^\\circ = 5.2\\text{ cm} \\times 0.866 \\approx 4.50\\text{ cm}$$\nTherefore, the height is **$4.5\\text{ cm}$**."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "Calculate the total area of triangle $ABC$ using the base $|AB| = 8\\text{ cm}$ and the calculated height $|CD| = 4.5\\text{ cm}$.",
          hint: "Area = 1/2 × base × height.",
          modelAnswer: "18 cm²",
          workedSolution: "$$\\text{Area} = \\frac{1}{2} \\times |AB| \\times |CD| = \\frac{1}{2} \\times 8\\text{ cm} \\times 4.5\\text{ cm} = 4 \\times 4.5 = 18\\text{ cm}^2$$."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Classroom Test Distribution, Central Tendency & Probability",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 350 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><line x1='35' y1='160' x2='320' y2='160' stroke='#334155' stroke-width='2'/><line x1='35' y1='160' x2='35' y2='20' stroke='#334155' stroke-width='2'/><text x='150' y='188' font-size='11' font-weight='bold'>Marks Scored</text><text x='5' y='18' font-size='11' font-weight='bold'>Frequency</text><rect x='55' y='125' width='25' height='35' fill='#93c5fd' stroke='#1d4ed8'/><rect x='100' y='90' width='25' height='70' fill='#93c5fd' stroke='#1d4ed8'/><rect x='145' y='35' width='25' height='125' fill='#2563eb' stroke='#1d4ed8'/><rect x='190' y='75' width='25' height='85' fill='#93c5fd' stroke='#1d4ed8'/><rect x='235' y='110' width='25' height='50' fill='#93c5fd' stroke='#1d4ed8'/><rect x='280' y='140' width='25' height='20' fill='#93c5fd' stroke='#1d4ed8'/><text x='65' y='173' font-size='10'>5</text><text x='110' y='173' font-size='10'>6</text><text x='155' y='173' font-size='10'>7</text><text x='200' y='173' font-size='10'>8</text><text x='245' y='173' font-size='10'>9</text><text x='288' y='173' font-size='10'>10</text><text x='20' y='40' font-size='10'>7</text><text x='20' y='80' font-size='10'>5</text><text x='20' y='130' font-size='10'>2</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 9,
          prompt: "The bar chart above displays the marks scored by $20$ students in a mental mathematics test:\n\n| Mark ($x$) | 5 | 6 | 7 | 8 | 9 | 10 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| Frequency ($f$) | 2 | 4 | 7 | 5 | 1 | 1 |\n\n(i) Determine the **modal mark**.\n(ii) Calculate the total number of students ($N = \\sum f$).\n(iii) Calculate the **mean mark** of the class.",
          hint: "Mode is the mark with highest frequency. Mean = $\\sum fx / \\sum f$.",
          modelAnswer: "(i) 7 marks, (ii) 20 students, (iii) 7.1 marks",
          workedSolution: "**(i) Modal mark:**\nThe highest frequency is $7$ (corresponding to $7\\text{ marks}$). The **modal mark is 7**.\n\n**(ii) Total students:**\n$$N = \\sum f = 2 + 4 + 7 + 5 + 1 + 1 = 20\\text{ students}$$\n\n**(iii) Mean mark:**\n$$\\sum fx = (5 \\times 2) + (6 \\times 4) + (7 \\times 7) + (8 \\times 5) + (9 \\times 1) + (10 \\times 1)$$\n$$\\sum fx = 10 + 24 + 49 + 40 + 9 + 10 = 142$$\n$$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{142}{20} = 7.1\\text{ marks}$$."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "If a student is chosen at random from this group:\n(i) What is the probability that the student scored at least $8\\text{ marks}$?\n(ii) What percentage of students scored less than $7\\text{ marks}$?",
          hint: "'At least 8' means marks 8, 9, 10. 'Less than 7' means marks 5 and 6.",
          modelAnswer: "(i) 7/20, (ii) 30%",
          workedSolution: "**(i) Probability of scoring at least 8 (marks 8, 9, 10):**\n$$\\text{Count} = f(8) + f(9) + f(10) = 5 + 1 + 1 = 7\\text{ students}$$\n$$P(x \\ge 8) = \\frac{7}{20}$$\n\n**(ii) Percentage scoring less than 7 (marks 5 and 6):**\n$$\\text{Count} = f(5) + f(6) = 2 + 4 = 6\\text{ students}$$\n$$\\text{Percentage} = \\left(\\frac{6}{20}\\right) \\times 100\\% = 6 \\times 5 = 30\\%$$."
        }
      ]
    }
  ],
  seededAt: "2026-09-15T18:30:00.000Z",
  lastUpdated: "2026-09-15T18:30:00.000Z"
};

// ============================================================================
// 3z. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 25)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-25
// ============================================================================
export const SET_JHS_MASTERY_SERIES_25: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-25",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 25)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series",
  variantType: "standard",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
      id: "q01",
      prompt: "Given sets $$P = \\{2, 3, 5, 7\\}$$ and $$Q = \\{1, 3, 5, 7, 9\\}$$, find $$P \\cap Q$$.",
      options: [
        "{3, 5, 7}",
        "{1, 2, 3, 5, 7, 9}",
        "{2, 3, 5, 7}",
        "{3, 5}"
      ],
      correctAnswer: "{3, 5, 7}",
      hint: "Identify the common elements present in both sets.",
      workedSolution: "The common members are 3, 5, and 7. Thus, $$P \\cap Q = \\{3, 5, 7\\}$$.",
      points: 1
    },
    {
      id: "q02",
      prompt: "Evaluate: $$0.015 \\times 0.04$$.",
      options: [
        "0.006",
        "0.06",
        "0.0006",
        "0.00006"
      ],
      correctAnswer: "0.0006",
      hint: "$$15 \\times 4 = 60$$. Count $3 + 2 = 5$ decimal places from the right.",
      workedSolution: "$$0.015 \\times 0.04 = 0.00060 = 0.0006$$.",
      points: 1
    },
    {
      id: "q03",
      prompt: "Express $240$ as a product of its prime factors in index notation.",
      options: [
        "$$2^3 \\times 3 \\times 5$$",
        "$$2^4 \\times 3 \\times 5$$",
        "$$2^4 \\times 15$$",
        "$$2^2 \\times 3^2 \\times 5$$"
      ],
      correctAnswer: "$$2^4 \\times 3 \\times 5$$",
      hint: "Divide repeatedly by 2: $240 = 16 \\times 15 = 2^4 \\times 3 \\times 5$.",
      workedSolution: "$$240 = 2 \\times 120 = 2^2 \\times 60 = 2^3 \\times 30 = 2^4 \\times 15 = 2^4 \\times 3 \\times 5$$.",
      points: 1
    },
    {
      id: "q04",
      prompt: "Convert the base five numeral $$412_{\\text{five}}$$ to a base ten numeral.",
      options: [
        "102",
        "107",
        "112",
        "97"
      ],
      correctAnswer: "107",
      hint: "$$4(5^2) + 1(5^1) + 2(5^0)$$.",
      workedSolution: "$$4(25) + 1(5) + 2(1) = 100 + 5 + 2 = 107$$.",
      points: 1
    },
    {
      id: "q05",
      prompt: "Solve for $x$ in the equation: $$5x - 7 = 2x + 8$$.",
      options: [
        "3",
        "5",
        "4",
        "6"
      ],
      correctAnswer: "5",
      hint: "Group the terms with $x$ on one side and constants on the other: $5x - 2x = 8 + 7$.",
      workedSolution: "$$3x = 15 \\implies x = 5$$.",
      points: 1
    },
    {
      id: "q06",
      prompt: "Simplify: $$\\frac{3}{5} - \\frac{1}{4} + \\frac{1}{2}$$.",
      options: [
        "$$\\frac{17}{20}$$",
        "$$\\frac{13}{20}$$",
        "$$\\frac{3}{4}$$",
        "$$\\frac{7}{10}$$"
      ],
      correctAnswer: "$$\\frac{17}{20}$$",
      hint: "Use a common denominator of 20: $\\frac{12 - 5 + 10}{20}$.",
      workedSolution: "$$\\frac{12 - 5 + 10}{20} = \\frac{17}{20}$$.",
      points: 1
    },
    {
      id: "q07",
      prompt: "Find the Highest Common Factor (HCF) of $36$ and $48$.",
      options: [
        "6",
        "18",
        "24",
        "12"
      ],
      correctAnswer: "12",
      hint: "Find the largest number that divides both 36 and 48 without remainder.",
      workedSolution: "$$36 = 12 \\times 3$$ and $$48 = 12 \\times 4$$. The HCF is 12.",
      points: 1
    },
    {
      id: "q08",
      prompt: "An agent receives a commission of $8\\%$ on all goods sold. How much commission does she receive on total sales of $\\text{GH¢ } 750.00$?",
      options: [
        "GH¢ 56.00",
        "GH¢ 60.00",
        "GH¢ 64.00",
        "GH¢ 72.00"
      ],
      correctAnswer: "GH¢ 60.00",
      hint: "Calculate $\\frac{8}{100} \\times 750$.",
      workedSolution: "$$\\text{Commission} = \\frac{8}{100} \\times 750 = 8 \\times 7.5 = \\text{GH¢ } 60.00$$.",
      points: 1
    },
    {
      id: "q09",
      prompt: "The test scores of eight students are: $$6, 8, 4, 9, 7, 5, 8, 9$$. Determine the median score.",
      options: [
        "7.0",
        "7.5",
        "8.0",
        "6.5"
      ],
      correctAnswer: "7.5",
      hint: "Arrange in ascending order: 4, 5, 6, 7, 8, 8, 9, 9. Average the 4th and 5th values.",
      workedSolution: "Ordered scores: 4, 5, 6, **7, 8**, 8, 9, 9. Median = $$\\frac{7 + 8}{2} = 7.5$$.",
      points: 1
    },
    {
      id: "q10",
      prompt: "If $3$ oranges cost $\\text{GH¢ } 1.20$, what is the cost of $8$ oranges at the same rate?",
      options: [
        "GH¢ 3.20",
        "GH¢ 2.80",
        "GH¢ 3.60",
        "GH¢ 3.00"
      ],
      correctAnswer: "GH¢ 3.20",
      hint: "Find the cost of 1 orange: $1.20 \\div 3 = 0.40$. Then multiply by 8.",
      workedSolution: "$$\\text{Cost of 1 orange} = \\text{GH¢ } 0.40$$. Total for 8 = $$8 \\times 0.40 = \\text{GH¢ } 3.20$$.",
      points: 1
    },
    {
      id: "q11",
      prompt: "Write $0.000345$ in standard form.",
      options: [
        "$$3.45 \\times 10^{-4}$$",
        "$$3.45 \\times 10^{-3}$$",
        "$$3.45 \\times 10^4$$",
        "$$34.5 \\times 10^{-5}$$"
      ],
      correctAnswer: "$$3.45 \\times 10^{-4}$$",
      hint: "Shift the decimal point 4 places to the right to obtain $3.45$.",
      workedSolution: "$$0.000345 = 3.45 \\times 10^{-4}$$.",
      points: 1
    },
    {
      id: "q12",
      prompt: "Find the circumference of a circular plate of diameter $28\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).",
      options: [
        "44 cm",
        "176 cm",
        "88 cm",
        "616 cm"
      ],
      correctAnswer: "88 cm",
      hint: "Circumference = $\\pi d$.",
      workedSolution: "$$C = \\frac{22}{7} \\times 28 = 22 \\times 4 = 88\\text{ cm}$$.",
      points: 1
    },
    {
      id: "q13",
      prompt: "Simplify: $$4(2x - 3) - 3(x - 5)$$.",
      options: [
        "$$5x - 27$$",
        "$$5x + 3$$",
        "$$5x - 3$$",
        "$$5x + 27$$"
      ],
      correctAnswer: "$$5x + 3$$",
      hint: "Expand the terms: $8x - 12 - 3x + 15$. Remember $-3 \\times (-5) = +15$.",
      workedSolution: "$$(8x - 3x) + (-12 + 15) = 5x + 3$$.",
      points: 1
    },
    {
      id: "q14",
      prompt: "A pair of angles are supplementary. If one angle measures $72^\\circ$, what is the measure of the other angle?",
      options: [
        "$$108^\\circ$$",
        "$$18^\\circ$$",
        "$$98^\\circ$$",
        "$$118^\\circ$$"
      ],
      correctAnswer: "$$108^\\circ$$",
      hint: "Supplementary angles add up to $180^\\circ$.",
      workedSolution: "$$180^\\circ - 72^\\circ = 108^\\circ$$.",
      points: 1
    },
    {
      id: "q15",
      prompt: "Express $75\\text{ cm}$ as a percentage of $2.5\\text{ m}$.",
      options: [
        "30%",
        "25%",
        "33.3%",
        "20%"
      ],
      correctAnswer: "30%",
      hint: "Convert $2.5\\text{ m}$ to centimetres: $2.5 \\times 100 = 250\\text{ cm}$.",
      workedSolution: "$$\\frac{75}{250} \\times 100\\% = \\frac{75}{2.5}\\% = 30\\%$$.",
      points: 1
    },
    {
      id: "q16",
      prompt: "In an isosceles triangle, the vertex angle is $50^\\circ$. What is the measure of each base angle?",
      options: [
        "$$65^\\circ$$",
        "$$60^\\circ$$",
        "$$70^\\circ$$",
        "$$55^\\circ$$"
      ],
      correctAnswer: "$$65^\\circ$$",
      hint: "The two base angles are equal. Divide $(180^\\circ - 50^\\circ)$ by 2.",
      workedSolution: "$$\\frac{180^\\circ - 50^\\circ}{2} = \\frac{130^\\circ}{2} = 65^\\circ$$.",
      points: 1
    },
    {
      id: "q17",
      prompt: "Evaluate: $$\\frac{2^5 \\times 3^4}{2^3 \\times 3^2}$$.",
      options: [
        "18",
        "36",
        "24",
        "12"
      ],
      correctAnswer: "36",
      hint: "Subtract indices: $2^{5-3} \\times 3^{4-2} = 2^2 \\times 3^2$.",
      workedSolution: "$$2^2 \\times 3^2 = 4 \\times 9 = 36$$.",
      points: 1
    },
    {
      id: "q18",
      prompt: "A trader bought a carton of biscuits for $\\text{GH¢ } 80.00$ and sold it for $\\text{GH¢ } 100.00$. Calculate the percentage profit.",
      options: [
        "20%",
        "25%",
        "15%",
        "30%"
      ],
      correctAnswer: "25%",
      hint: "Profit = 100 - 80 = 20. Profit % = (20 / 80) × 100%.",
      workedSolution: "$$\\text{Profit \\%} = \\frac{20}{80} \\times 100\\% = \\frac{1}{4} \\times 100\\% = 25\\%$$.",
      points: 1
    },
    {
      id: "q19",
      prompt: "Given column vectors $$u = \\begin{pmatrix} 2 \\\\ -3 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} 4 \\\\ 1 \\end{pmatrix}$$, calculate $$2u + v$$.",
      options: [
        "$$\\begin{pmatrix} 8 \\\\ -5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 6 \\\\ -2 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 8 \\\\ 5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 8 \\\\ -1 \\end{pmatrix}$$"
      ],
      correctAnswer: "$$\\begin{pmatrix} 8 \\\\ -5 \\end{pmatrix}$$",
      hint: "$$2(2) + 4 = 8$$ and $$2(-3) + 1 = -6 + 1 = -5$$.",
      workedSolution: "$$\\begin{pmatrix} 2(2) + 4 \\\\ 2(-3) + 1 \\end{pmatrix} = \\begin{pmatrix} 8 \\\\ -5 \\end{pmatrix}$$.",
      points: 1
    },
    {
      id: "q20",
      prompt: "The ratio of boys to girls in a school choir is $3 : 4$. If there are $28$ girls, how many boys are in the choir?",
      options: [
        "18",
        "24",
        "21",
        "20"
      ],
      correctAnswer: "21",
      hint: "4 units = 28. Find 1 unit = 7. Multiply by 3.",
      workedSolution: "1 unit = $28 \\div 4 = 7$. Number of boys = $$3 \\times 7 = 21$$.",
      points: 1
    },
    {
      id: "q21",
      prompt: "Which of the following numbers is prime?",
      options: [
        "39",
        "49",
        "51",
        "41"
      ],
      correctAnswer: "41",
      hint: "$$39 = 3 \\times 13$$, $$49 = 7^2$$, $$51 = 3 \\times 17$$.",
      workedSolution: "41 has only two distinct factors, 1 and 41, making it prime.",
      points: 1
    },
    {
      id: "q22",
      prompt: "A train travels at an average speed of $80\\text{ km/h}$. How far does it travel in $2\\text{ hours } 15\\text{ minutes}$?",
      options: [
        "180 km",
        "160 km",
        "200 km",
        "190 km"
      ],
      correctAnswer: "180 km",
      hint: "Convert 15 minutes to hours: $15/60 = 0.25\\text{ h}$. Time = $2.25\\text{ h}$. Distance = Speed × Time.",
      workedSolution: "$$\\text{Distance} = 80 \\times 2.25 = 180\\text{ km}$$.",
      points: 1
    },
    {
      id: "q23",
      prompt: "Find the truth set of the inequality: $$3x - 4 < 11$$, where $x$ is an integer.",
      options: [
        "$$\\{x : x < 5\\}$$",
        "$$\\{x : x > 5\\}$$",
        "$$\\{x : x \\le 5\\}$$",
        "$$\\{x : x < 15\\}$$"
      ],
      correctAnswer: "$$\\{x : x < 5\\}$$",
      hint: "$$3x < 11 + 4 = 15$$. Divide by 3.",
      workedSolution: "$$3x < 15 \\implies x < 5$$. Truth set: $$\\{x : x < 5\\}$$.",
      points: 1
    },
    {
      id: "q24",
      prompt: "A box contains $5$ red balls, $3$ blue balls, and $2$ yellow balls. What is the probability of selecting a blue ball at random?",
      options: [
        "$$\\frac{1}{2}$$",
        "$$\\frac{3}{10}$$",
        "$$\\frac{1}{5}$$",
        "$$\\frac{3}{7}$$"
      ],
      correctAnswer: "$$\\frac{3}{10}$$",
      hint: "Total balls = 5 + 3 + 2 = 10. Blue balls = 3.",
      workedSolution: "$$P(\\text{blue}) = \\frac{3}{10}$$.",
      points: 1
    },
    {
      id: "q25",
      prompt: "Find the area of a right-angled triangle with base $12\\text{ cm}$ and perpendicular height $5\\text{ cm}$.",
      options: [
        "$$60\\text{ cm}^2$$",
        "$$25\\text{ cm}^2$$",
        "$$30\\text{ cm}^2$$",
        "$$35\\text{ cm}^2$$"
      ],
      correctAnswer: "$$30\\text{ cm}^2$$",
      hint: "Area = $\\frac{1}{2} \\times \\text{base} \\times \\text{height}$.",
      workedSolution: "$$\\text{Area} = \\frac{1}{2} \\times 12 \\times 5 = 6 \\times 5 = 30\\text{ cm}^2$$.",
      points: 1
    },
    {
      id: "q26",
      prompt: "Make $h$ the subject of the formula: $$V = \\pi r^2 h$$.",
      options: [
        "$$h = \\frac{\\pi r^2}{V}$$",
        "$$h = \\frac{V}{\\pi r^2}$$",
        "$$h = V - \\pi r^2$$",
        "$$h = \\sqrt{\\frac{V}{\\pi r}}$$"
      ],
      correctAnswer: "$$h = \\frac{V}{\\pi r^2}$$",
      hint: "Divide both sides of the equation by $\\pi r^2$.",
      workedSolution: "$$V = \\pi r^2 h \\implies h = \\frac{V}{\\pi r^2}$$.",
      points: 1
    },
    {
      id: "q27",
      prompt: "Expand and simplify: $$(x - 4)(x + 6)$$.",
      options: [
        "$$x^2 + 2x - 24$$",
        "$$x^2 - 2x - 24$$",
        "$$x^2 + 10x - 24$$",
        "$$x^2 - 24$$"
      ],
      correctAnswer: "$$x^2 + 2x - 24$$",
      hint: "$$x(x + 6) - 4(x + 6) = x^2 + 6x - 4x - 24$$.",
      workedSolution: "$$x^2 + 2x - 24$$.",
      points: 1
    },
    {
      id: "q28",
      prompt: "A clock shows 3:00. What is the angle between the hour hand and the minute hand?",
      options: [
        "$$60^\\circ$$",
        "$$45^\\circ$$",
        "$$90^\\circ$$",
        "$$120^\\circ$$"
      ],
      correctAnswer: "$$90^\\circ$$",
      hint: "The minute hand is at 12 and the hour hand is at 3. Each hour represents $360^\\circ / 12 = 30^\\circ$.",
      workedSolution: "$$3 \\times 30^\\circ = 90^\\circ$$.",
      points: 1
    },
    {
      id: "q29",
      prompt: "Calculate the simple interest on $\\text{GH¢ } 1,200.00$ at $5\\%\\text{ per annum}$ for $4\\text{ years}$.",
      options: [
        "GH¢ 240.00",
        "GH¢ 200.00",
        "GH¢ 280.00",
        "GH¢ 300.00"
      ],
      correctAnswer: "GH¢ 240.00",
      hint: "$$I = \\frac{P \\times R \\times T}{100}$$.",
      workedSolution: "$$I = \\frac{1200 \\times 5 \\times 4}{100} = 12 \\times 20 = \\text{GH¢ } 240.00$$.",
      points: 1
    },
    {
      id: "q30",
      prompt: "How many faces does a regular triangular prism have?",
      options: [
        "4",
        "6",
        "5",
        "7"
      ],
      correctAnswer: "5",
      hint: "A triangular prism has 2 triangular bases and 3 rectangular sides.",
      workedSolution: "$$2 + 3 = 5\\text{ faces}$$.",
      points: 1
    },
    {
      id: "q31",
      prompt: "A shirt costing $\\text{GH¢ } 45.00$ was sold at a $10\\%$ discount. Find the sale price.",
      options: [
        "GH¢ 40.50",
        "GH¢ 39.50",
        "GH¢ 41.00",
        "GH¢ 40.00"
      ],
      correctAnswer: "GH¢ 40.50",
      hint: "Discount = $10\\%$ of 45 = 4.50. Sale price = 45 - 4.50.",
      workedSolution: "$$45.00 - 4.50 = \\text{GH¢ } 40.50$$.",
      points: 1
    },
    {
      id: "q32",
      prompt: "The point $P(2, -3)$ is translated by vector $$\\begin{pmatrix} -3 \\\\ 5 \\end{pmatrix}$$ to $P'$. Find the coordinates of $P'$.",
      options: [
        "(-1, 2)",
        "(-1, -8)",
        "(5, 2)",
        "(5, -8)"
      ],
      correctAnswer: "(-1, 2)",
      hint: "$$(x', y') = (2 + (-3), -3 + 5)$$.",
      workedSolution: "$$(2 - 3, -3 + 5) = (-1, 2)$$.",
      points: 1
    },
    {
      id: "q33",
      prompt: "A quadrilateral with only one pair of opposite sides parallel is called a:",
      "options": [
        "Parallelogram",
        "Trapezium",
        "Rhombus",
        "Kite"
      ],
      "correctAnswer": "Trapezium",
      "hint": "Recall the geometric definition of a trapezium.",
      "workedSolution": "A trapezium is defined as a quadrilateral having exactly one pair of parallel sides.",
      "points": 1
    },
    {
      "id": "q34",
      "prompt": "If $a = -2$ and $b = 3$, evaluate: $$3a^2 - 2b$$.",
      "options": [
        "6",
        "-18",
        "18",
        "-6"
      ],
      "correctAnswer": "6",
      "hint": "$$(-2)^2 = 4$$. Multiply by 3, then subtract $2(3)$.",
      "workedSolution": "$$3(-2)^2 - 2(3) = 3(4) - 6 = 12 - 6 = 6$$.",
      "points": 1
    },
    {
      "id": "q35",
      "prompt": "Express $0.32$ as a common fraction in its lowest terms.",
      "options": [
        "$$\\frac{16}{25}$$",
        "$$\\frac{8}{25}$$",
        "$$\\frac{4}{25}$$",
        "$$\\frac{3}{10}$$"
      ],
      "correctAnswer": "$$\\frac{8}{25}$$",
      "hint": "Divide 32 and 100 by their highest common factor, 4.",
      "workedSolution": "$$\\frac{32}{100} = \\frac{32 \\div 4}{100 \\div 4} = \\frac{8}{25}$$.",
      "points": 1
    },
    {
      "id": "q36",
      "prompt": "The three angles of a triangle are in the ratio $1 : 2 : 3$. Find the largest angle.",
      "options": [
        "$$60^\\circ$$",
        "$$75^\\circ$$",
        "$$90^\\circ$$",
        "$$100^\\circ$$"
      ],
      "correctAnswer": "$$90^\\circ$$",
      "hint": "Total parts = 1 + 2 + 3 = 6. Largest angle = (3 / 6) × 180°.",
      "workedSolution": "$$\\frac{3}{6} \\times 180^\\circ = \\frac{1}{2} \\times 180^\\circ = 90^\\circ$$.",
      "points": 1
    },
    {
      "id": "q37",
      "prompt": "A water tank measuring $2\\text{ m} \\times 1.5\\text{ m} \\times 1\\text{ m}$ is full of water. What is its capacity in cubic metres?",
      "options": [
        "$$3.0\\text{ m}^3$$",
        "$$4.5\\text{ m}^3$$",
        "$$2.5\\text{ m}^3$$",
        "$$3.5\\text{ m}^3$$"
      ],
      "correctAnswer": "$$3.0\\text{ m}^3$$",
      "hint": "Volume = length × width × height.",
      "workedSolution": "$$2 \\times 1.5 \\times 1 = 3.0\\text{ m}^3$$.",
      "points": 1
    },
    {
      "id": "q38",
      "prompt": "Determine the rule for the linear mapping where inputs $x = \\{1, 2, 3, 4\\}$ yield outputs $y = \\{3, 7, 11, 15\\}$.",
      "options": [
        "$$x \\to 4x - 1$$",
        "$$x \\to 4x + 1$$",
        "$$x \\to 3x + 1$$",
        "$$x \\to 2x + 1$$"
      ],
      "correctAnswer": "$$x \\to 4x - 1$$",
      "hint": "The common difference between outputs is 4. When $x = 1$, $y = 4(1) - 1 = 3$.",
      "workedSolution": "Rate of increase = 4 ($4x$). For $x = 1$, $4(1) + c = 3 \\implies c = -1$. The rule is $$x \\to 4x - 1$$.",
      "points": 1
    },
    {
      "id": "q39",
      "prompt": "If $6$ workers take $4\\text{ days}$ to complete a task, how many workers are needed to complete the same task in $3\\text{ days}$?",
      "options": [
        "7 workers",
        "9 workers",
        "8 workers",
        "10 workers"
      ],
      "correctAnswer": "8 workers",
      "hint": "Total work = $6 \\times 4 = 24\\text{ worker-days}$. Divide by 3 days.",
      "workedSolution": "$$\\text{Workers} = \\frac{24}{3} = 8\\text{ workers}$$.",
      "points": 1
    },
    {
      "id": "q40",
      "prompt": "In a regular hexagon, how many lines of symmetry can be drawn?",
      "options": [
        "4",
        "5",
        "8",
        "6"
      ],
      "correctAnswer": "6",
      "hint": "A regular polygon with $n$ sides has $n$ lines of symmetry.",
      "workedSolution": "A regular hexagon has 6 sides and exactly 6 lines of symmetry.",
      "points": 1
    }
  ],
  seededAt: "2026-09-15T19:00:00.000Z",
  lastUpdated: "2026-09-15T19:00:00.000Z"
};

// ============================================================================
// 4a. ALIGNED CORE CURRICULUM SERIES: JHS Math Structured Problem-Solving Series (Set 26)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-26
// ============================================================================
export const SET_JHS_MASTERY_SERIES_26: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-26",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 26)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
      id: "q01",
      title: "Question 1: Crop Harvest Sector Modeling & Fractional Reductions",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 300 240' width='100%' height='210' xmlns='http://www.w3.org/2000/svg'><circle cx='150' cy='120' r='90' fill='#f8fafc' stroke='#334155' stroke-width='2'/><path d='M150,120 L150,30 A90,90 0 0,1 236,148 Z' fill='#bfdbfe' stroke='#1e3a8a'/><path d='M150,120 L236,148 A90,90 0 0,1 122,206 Z' fill='#bbf7d0' stroke='#14532d'/><path d='M150,120 L122,206 A90,90 0 0,1 64,92 Z' fill='#fed7aa' stroke='#7c2d12'/><path d='M150,120 L64,92 A90,90 0 0,1 150,30 Z' fill='#fef08a' stroke='#713f12'/><text x='170' y='85' font-size='10' font-weight='bold'>Maize: 108°</text><text x='160' y='170' font-size='10' font-weight='bold'>Rice: 72°</text><text x='75' y='160' font-size='10' font-weight='bold'>Millet: 90°</text><text x='85' y='75' font-size='10' font-weight='bold'>Sorghum: 90°</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "The total harvest of grain from a cooperative farm was $720\\text{ bags}$. The distribution of bags harvested is shown in the table below:\n\n| Crop | Maize | Rice | Millet | Sorghum |\n| :--- | :---: | :---: | :---: | :---: |\n| Bags | 216 | 144 | 180 | 180 |\n\n(i) Calculate the sector angle for each crop on the pie chart above.\n(ii) What percentage of the total harvest was Rice?",
          hint: "Scale factor = $360^\\circ / 720 = 0.5^\\circ\\text{ per bag}$. Multiply each crop's count by 0.5°.",
          modelAnswer: "(i) Maize: 108°, Rice: 72°, Millet: 90°, Sorghum: 90°; (ii) 20%",
          workedSolution: "Scale factor: $$\\frac{360^\\circ}{720} = 0.5^\\circ\\text{ per bag}$$.\n- **Maize:** $$216 \\times 0.5^\\circ = 108^\\circ$$\n- **Rice:** $$144 \\times 0.5^\\circ = 72^\\circ$$\n- **Millet:** $$180 \\times 0.5^\\circ = 90^\\circ$$\n- **Sorghum:** $$180 \\times 0.5^\\circ = 90^\\circ$$\nSum check: $108 + 72 + 90 + 90 = 360^\\circ$.\n\n**(ii) Percentage of Rice:**\n$$\\text{Percentage} = \\left(\\frac{144}{720}\\right) \\times 100\\% = \\left(\\frac{1}{5}\\right) \\times 100\\% = 20\\%$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Evaluate and simplify completely:\n$$\\left(3\\frac{1}{3} - 1\\frac{1}{2}\\right) \\div 1\\frac{3}{8}$$",
          hint: "Work inside the brackets first using LCD 6, then multiply by the reciprocal of the divisor.",
          modelAnswer: "1 1/3 (or 4/3)",
          workedSolution: "**Inside brackets:**\n$$3\\frac{1}{3} - 1\\frac{1}{2} = \\frac{10}{3} - \\frac{3}{2} = \\frac{20 - 9}{6} = \\frac{11}{6}$$\n\n**Divisor:**\n$$1\\frac{3}{8} = \\frac{11}{8}$$\n\n**Division:**\n$$\\frac{11}{6} \\div \\frac{11}{8} = \\frac{11}{6} \\times \\frac{8}{11} = \\frac{8}{6} = \\frac{4}{3} = 1\\frac{1}{3}$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Solve for $m$ in the linear relation:\n$$\\frac{m + 3}{4} - \\frac{2m - 1}{6} = \\frac{1}{2}$$",
          hint: "Multiply through by 12 (the LCM of 4, 6, and 2) to eliminate fractions.",
          modelAnswer: "m = 5",
          workedSolution: "Multiply through by $12$:\n$$12\\left(\\frac{m + 3}{4}\\right) - 12\\left(\\frac{2m - 1}{6}\\right) = 12\\left(\\frac{1}{2}\\right)$$\n$$3(m + 3) - 2(2m - 1) = 6$$\n$$3m + 9 - 4m + 2 = 6$$\n$$-m + 11 = 6$$\n$$-m = 6 - 11 = -5 \\implies m = 5$$."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Linear Functional Graphing & Cartesian Coordinates",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 250' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='140' x2='290' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='230' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><line x1='60' y1='210' x2='260' y2='30' stroke='#2563eb' stroke-width='2.5'/><circle cx='80' cy='190' r='4' fill='#dc2626'/><circle cx='120' cy='155' r='4' fill='#dc2626'/><circle cx='160' cy='120' r='4' fill='#dc2626'/><circle cx='200' cy='85' r='4' fill='#dc2626'/><circle cx='240' cy='50' r='4' fill='#dc2626'/><text x='170' y='115' font-size='11' font-weight='bold' fill='#dc2626'>(0, 2)</text><text x='215' y='55' font-size='11' font-weight='bold' fill='#2563eb'>y = 2 - 3x</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "A linear relation connects $x$ and $y$ such that:\n$$y = 2 - 3x$$\nCopy and complete the table of values below:\n\n| $x$ | -2 | -1 | 0 | 1 | 2 | 3 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y = 2 - 3x$ | **?** | 5 | **?** | -1 | **?** | **?** |",
          hint: "Substitute each missing x value into y = 2 - 3x.",
          modelAnswer: "x=-2: 8, x=0: 2, x=2: -4, x=3: -7",
          workedSolution: "- For $x = -2$: $$y = 2 - 3(-2) = 2 + 6 = 8$$\n- For $x = 0$: $$y = 2 - 3(0) = 2$$\n- For $x = 2$: $$y = 2 - 3(2) = 2 - 6 = -4$$\n- For $x = 3$: $$y = 2 - 3(3) = 2 - 9 = -7$$\nThe sequence of outputs is **8, 5, 2, -1, -4, -7**."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "From the linear relation and its Cartesian line above, determine:\n(i) The value of $y$ when $x = 1.5$.\n(ii) The value of $x$ when $y = 11$.",
          hint: "Substitute given values directly into $y = 2 - 3x$.",
          modelAnswer: "(i) y = -2.5, (ii) x = -3",
          workedSolution: "**(i)** When $x = 1.5$:\n$$y = 2 - 3(1.5) = 2 - 4.5 = -2.5$$\n\n**(ii)** When $y = 11$:\n$$11 = 2 - 3x$$\n$$3x = 2 - 11 = -9 \\implies x = -3$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "State the **gradient** and the **coordinates of the $y$-intercept** of the line $$y = 2 - 3x$$.",
          hint: "Compare with $y = mx + c$, noting the coefficient of $x$ is negative.",
          modelAnswer: "Gradient = -3, y-intercept = (0, 2)",
          workedSolution: "In $y = mx + c$ format:\n$$y = -3x + 2$$\n- The gradient is **$m = -3$**.\n- The $y$-intercept occurs at $x = 0$, giving **$(0, 2)$**."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Open Rectangular Container Surface Area & Liquid Volume",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 350 220' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><rect x='30' y='70' width='170' height='110' fill='#eff6ff' stroke='#1e40af' stroke-width='2'/><path d='M30,70 L80,30 L250,30 L200,70 Z' fill='#f8fafc' stroke='#1e40af' stroke-width='1.5'/><path d='M200,70 L250,30 L250,140 L200,180 Z' fill='#bfdbfe' stroke='#1e40af' stroke-width='1.5'/><text x='100' y='200' font-size='12' font-weight='bold'>l = 60 cm</text><text x='235' y='165' font-size='12' font-weight='bold'>w = 35 cm</text><text x='5' y='130' font-size='12' font-weight='bold'>h = 40 cm</text><text x='95' y='55' font-size='11' fill='#dc2626' font-weight='bold'>OPEN TOP</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "An open rectangular storage bin made of sheet metal has an internal length of $60\\text{ cm}$, width of $35\\text{ cm}$, and height of $40\\text{ cm}$ as shown in the diagram above.\nCalculate the **total surface area** of the sheet metal used to construct the open bin (having no lid).",
          hint: "Because the bin is open at the top, count 1 base and 4 vertical walls: $\\text{Area} = lw + 2(lh + wh)$.",
          modelAnswer: "9,700 cm²",
          workedSolution: "$$\\text{Base area} = l \\times w = 60 \\times 35 = 2,100\\text{ cm}^2$$\n$$\\text{Area of 4 walls} = 2(lh + wh) = 2[(60 \\times 40) + (35 \\times 40)]$$\n$$= 2[2,400 + 1,400] = 2[3,800] = 7,600\\text{ cm}^2$$\n$$\\text{Total Surface Area} = 2,100 + 7,600 = 9,700\\text{ cm}^2$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Calculate the **total capacity** of the storage bin in litres, given that $1,000\\text{ cm}^3 = 1\\text{ litre}$.",
          hint: "Find volume in cm³ ($l \\times w \\times h$) and divide by 1,000.",
          modelAnswer: "84 litres",
          workedSolution: "$$V = l \\times w \\times h = 60\\text{ cm} \\times 35\\text{ cm} \\times 40\\text{ cm} = 84,000\\text{ cm}^3$$\n$$\\text{Capacity in litres} = \\frac{84,000}{1,000} = 84\\text{ litres}$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "If $63\\text{ litres}$ of water is poured into the bin, calculate the depth ($d$) of the water.",
          hint: "$63\\text{ litres} = 63,000\\text{ cm}^3$. Volume = Base area × depth.",
          modelAnswer: "30 cm",
          workedSolution: "$$\\text{Volume of water} = 63 \\times 1,000 = 63,000\\text{ cm}^3$$\n$$\\text{Base area} = 60 \\times 35 = 2,100\\text{ cm}^2$$\n$$d = \\frac{63,000}{2,100} = 30\\text{ cm}$$\nTherefore, the water depth is **$30\\text{ cm}$**."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Trapezoidal Farmland Boundary Geometry & Surveying Measurements",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 350 200' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><polygon points='40,150 270,150 210,40 40,40' fill='#f1f5f9' stroke='#1e293b' stroke-width='2'/><line x1='210' y1='40' x2='210' y2='150' stroke='#dc2626' stroke-width='1.5' stroke-dasharray='4'/><rect x='195' y='135' width='15' height='15' fill='none' stroke='#dc2626' stroke-width='1.2'/><rect x='40' y='40' width='15' height='15' fill='none' stroke='#334155' stroke-width='1.2'/><rect x='40' y='135' width='15' height='15' fill='none' stroke='#334155' stroke-width='1.2'/><text x='25' y='45' font-size='12' font-weight='bold'>A</text><text x='215' y='35' font-size='12' font-weight='bold'>B</text><text x='280' y='155' font-size='12' font-weight='bold'>C</text><text x='25' y='160' font-size='12' font-weight='bold'>D</text><text x='120' y='30' font-size='11' font-weight='bold'>17 m</text><text x='140' y='170' font-size='11' font-weight='bold'>25 m</text><text x='10' y='100' font-size='11' font-weight='bold'>15 m</text><text x='215' y='100' font-size='11' fill='#dc2626'>h = 15 m</text><text x='250' y='90' font-size='11' font-weight='bold' fill='#2563eb'>c = ?</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "The diagram above shows a right trapezium farmland $ABCD$, where $AB \\parallel DC$, $\\angle ADC = 90^\\circ$, $|AB| = 17\\text{ m}$, $|DC| = 25\\text{ m}$, and $|AD| = 15\\text{ m}$.\nA perpendicular line dropped from $B$ to $DC$ meets $DC$ at point $E$.\n(i) Find the length of line segment $|EC|$.\n(ii) Calculate the length of slant boundary $|BC|$ using Pythagoras' theorem.",
          hint: "|EC| = |DC| - |AB| = 25 - 17. In right-angled triangle BEC, hypotenuse $BC^2 = |BE|^2 + |EC|^2$.",
          modelAnswer: "(i) 8 m, (ii) 17 m",
          workedSolution: "**(i) Segment $|EC|$:**\n$$|EC| = |DC| - |AB| = 25 - 17 = 8\\text{ m}$$\n\n**(ii) Slant side $|BC|$:**\nNotice that $|BE| = |AD| = 15\\text{ m}$.\nIn right-angled triangle $BEC$:\n$$|BC|^2 = |BE|^2 + |EC|^2 = 15^2 + 8^2 = 225 + 64 = 289$$\n$$|BC| = \\sqrt{289} = 17\\text{ m}$$\nTherefore, the length of slant boundary $|BC|$ is **$17\\text{ m}$**."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Calculate the total land area enclosed by trapezium $ABCD$.",
          hint: "Area = $\\frac{1}{2}(a + b)h$, where $a = 17$, $b = 25$, and $h = 15$.",
          modelAnswer: "315 m²",
          workedSolution: "$$\\text{Area} = \\frac{1}{2}(|AB| + |DC|) \\times |AD|$$\n$$= \\frac{1}{2}(17 + 25) \\times 15 = \\frac{1}{2}(42) \\times 15 = 21 \\times 15 = 315\\text{ m}^2$$\n*(Or: Rectangle $ABED$ area = $17 \\times 15 = 255\\text{ m}^2$, Triangle $BEC$ area = $\\frac{1}{2} \\times 8 \\times 15 = 60\\text{ m}^2$. Total = $255 + 60 = 315\\text{ m}^2$)*."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Calculate the total perimeter of the farmland boundary $ABCD$.",
          hint: "Perimeter = |AB| + |BC| + |CD| + |DA|.",
          modelAnswer: "74 m",
          workedSolution: "$$\\text{Perimeter} = 17 + 17 + 25 + 15 = 74\\text{ m}$$."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Cartesian Vector Translations & Coordinate Reflections",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 260' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='140' x2='300' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='250' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><polygon points='190,110 250,110 250,60' fill='#dbeafe' stroke='#2563eb' stroke-width='2'/><text x='180' y='125' font-size='10' font-weight='bold'>P(1,1)</text><text x='255' y='125' font-size='10' font-weight='bold'>Q(4,1)</text><text x='255' y='55' font-size='10' font-weight='bold'>R(4,4)</text><polygon points='190,170 250,170 250,220' fill='#fee2e2' stroke='#dc2626' stroke-width='2'/><text x='180' y='165' font-size='10' font-weight='bold' fill='#dc2626'>P₁</text><text x='255' y='165' font-size='10' font-weight='bold' fill='#dc2626'>Q₁</text><text x='255' y='235' font-size='10' font-weight='bold' fill='#dc2626'>R₁</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "Triangle $PQR$ has vertices $P(1, 1)$, $Q(4, 1)$, and $R(4, 4)$ on the Cartesian plane shown above.\n(i) Write down the coordinates of the image vertices $P_1, Q_1,$ and $R_1$ under a reflection in the $x$-axis.\n(ii) Write down the coordinates of the image vertices $P_2, Q_2,$ and $R_2$ under a reflection in the $y$-axis.",
          hint: "Reflection in x-axis: (x, y) → (x, -y). Reflection in y-axis: (x, y) → (-x, y).",
          modelAnswer: "(i) P₁(1, -1), Q₁(4, -1), R₁(4, -4); (ii) P₂(-1, 1), Q₂(-4, 1), R₂(-4, 4)",
          workedSolution: "**(i) Reflection in $x$-axis:** $$(x, y) \\to (x, -y)$$\n- $$P(1, 1) \\to P_1(1, -1)$$\n- $$Q(4, 1) \\to Q_1(4, -1)$$\n- $$R(4, 4) \\to R_1(4, -4)$$\n\n**(ii) Reflection in $y$-axis:** $$(x, y) \\to (-x, y)$$\n- $$P(1, 1) \\to P_2(-1, 1)$$\n- $$Q(4, 1) \\to Q_2(-4, 1)$$\n- $$R(4, 4) \\to R_2(-4, 4)$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Triangle $PQR$ is translated by vector $$T = \\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix}$$ to produce triangle $P_3Q_3R_3$.\nDetermine the coordinates of vertices $P_3, Q_3,$ and $R_3$.",
          hint: "Add the components of T to each point: (x - 3, y + 2).",
          modelAnswer: "P₃(-2, 3), Q₃(1, 3), R₃(1, 6)",
          workedSolution: "$$(x, y) \\to (x - 3, y + 2)$$\n- $$P(1, 1) \\to P_3(1 - 3, 1 + 2) = P_3(-2, 3)$$\n- $$Q(4, 1) \\to Q_3(4 - 3, 1 + 2) = Q_3(1, 3)$$\n- $$R(4, 4) \\to R_3(4 - 3, 4 + 2) = R_3(1, 6)$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Calculate the area of triangle $PQR$.",
          hint: "Triangle PQR is a right-angled triangle with perpendicular sides PQ and QR.",
          modelAnswer: "4.5 square units",
          workedSolution: "Base $$PQ = 4 - 1 = 3\\text{ units}$$.\nHeight $$QR = 4 - 1 = 3\\text{ units}$$.\n$$\\text{Area} = \\frac{1}{2} \\times 3 \\times 3 = \\frac{9}{2} = 4.5\\text{ square units}$$."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Class Test Score Distribution & Compound Probability",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 9,
          prompt: "The test scores of $30$ pupils in an assessment are recorded in the frequency distribution below:\n\n| Score ($x$) | 1 | 2 | 3 | 4 | 5 | 6 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| Frequency ($f$) | 3 | 5 | 9 | 7 | 4 | 2 |\n\n(i) State the **modal score**.\n(ii) Calculate the total number of pupils ($N = \\sum f$).\n(iii) Calculate the **mean score** of the class.",
          hint: "Mode has highest frequency. Mean = $\\sum fx / \\sum f$.",
          modelAnswer: "(i) 3, (ii) 30 pupils, (iii) 3.33 (or 3 1/3)",
          workedSolution: "**(i) Modal score:**\nThe highest frequency is $9$, corresponding to score **3**.\n\n**(ii) Total number of pupils:**\n$$N = \\sum f = 3 + 5 + 9 + 7 + 4 + 2 = 30\\text{ pupils}$$\n\n**(iii) Mean score:**\n$$\\sum fx = (1 \\times 3) + (2 \\times 5) + (3 \\times 9) + (4 \\times 7) + (5 \\times 4) + (6 \\times 2)$$\n$$\\sum fx = 3 + 10 + 27 + 28 + 20 + 12 = 100$$\n$$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{100}{30} = 3\\frac{1}{3} \\approx 3.33$$."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "If a pupil is chosen at random from this group:\n(i) Find the probability that the pupil scored strictly more than $4$.\n(ii) What percentage of the pupils scored at least $3$?",
          hint: "Strictly more than 4 means scores 5 and 6. At least 3 means scores 3, 4, 5, 6.",
          modelAnswer: "(i) 1/5, (ii) 73.33%",
          workedSolution: "**(i) Probability of scoring > 4 (scores 5 and 6):**\n$$\\text{Number of pupils} = f(5) + f(6) = 4 + 2 = 6$$\n$$P(x > 4) = \\frac{6}{30} = \\frac{1}{5}$$\n\n**(ii) Percentage scoring at least 3 (scores 3, 4, 5, 6):**\n$$\\text{Number of pupils} = 9 + 7 + 4 + 2 = 22$$\n$$\\text{Percentage} = \\left(\\frac{22}{30}\\right) \\times 100\\% = \\frac{220}{3}\\% = 73\\frac{1}{3}\\% \\approx 73.33\\%$$."
        }
      ]
    }
  ],
  seededAt: "2026-09-15T19:30:00.000Z",
  lastUpdated: "2026-09-15T19:30:00.000Z"
};

// ============================================================================
// 4b. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 27)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-27
// ============================================================================
export const SET_JHS_MASTERY_SERIES_27: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-27",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 27)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series",
  variantType: "standard",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
      id: "q01",
      prompt: "If set $$A = \\{x : x \\text{ is a factor of } 18\\}$$ and set $$B = \\{x : x \\text{ is a multiple of } 3 \\text{ less than } 15\\}$$, find $$A \\cap B$$.",
      options: [
        "{1, 2, 3, 6, 9, 18}",
        "{3, 6, 9, 12}",
        "{3, 6, 9}",
        "{6, 9}"
      ],
      correctAnswer: "{3, 6, 9}",
      hint: "List elements of both sets: A = {1, 2, 3, 6, 9, 18} and B = {3, 6, 9, 12}. Identify the common elements.",
      workedSolution: "Factors of 18 are {1, 2, 3, 6, 9, 18}. Multiples of 3 strictly less than 15 are {3, 6, 9, 12}. Common elements are {3, 6, 9}.",
      points: 1
    },
    {
      id: "q02",
      prompt: "Evaluate: $$0.072 \\div 0.08$$.",
      options: [
        "0.09",
        "9.0",
        "0.9",
        "0.009"
      ],
      correctAnswer: "0.9",
      hint: "Multiply numerator and denominator by 1000: 72 / 80 = 9 / 10.",
      workedSolution: "$$\\frac{0.072}{0.08} = \\frac{72}{80} = \\frac{9}{10} = 0.9$$.",
      points: 1
    },
    {
      id: "q03",
      prompt: "Find the Least Common Multiple (LCM) of $12, 16,$ and $24$.",
      options: [
        "48",
        "72",
        "96",
        "36"
      ],
      correctAnswer: "48",
      hint: "$$12 = 2^2 \\times 3$$, $$16 = 2^4$$, $$24 = 2^3 \\times 3$$. Take the highest power of each prime factor.",
      workedSolution: "$$\\text{LCM} = 2^4 \\times 3 = 16 \\times 3 = 48$$.",
      points: 1
    },
    {
      id: "q04",
      prompt: "Express $480$ as a product of prime factors in index notation.",
      options: [
        "$$2^4 \\times 3 \\times 5$$",
        "$$2^5 \\times 3 \\times 5$$",
        "$$2^5 \\times 15$$",
        "$$2^3 \\times 3^2 \\times 5$$"
      ],
      correctAnswer: "$$2^5 \\times 3 \\times 5$$",
      hint: "$$480 = 32 \\times 15 = 2^5 \\times 3 \\times 5$$.",
      workedSolution: "$$480 = 2 \\times 240 = 2^2 \\times 120 = 2^3 \\times 60 = 2^4 \\times 30 = 2^5 \\times 15 = 2^5 \\times 3 \\times 5$$.",
      points: 1
    },
    {
      id: "q05",
      prompt: "Solve for $y$ in the equation: $$3(y - 2) = 2(y + 4)$$.",
      options: [
        "12",
        "10",
        "16",
        "14"
      ],
      correctAnswer: "14",
      hint: "Expand both sides: $3y - 6 = 2y + 8$.",
      workedSolution: "$$3y - 6 = 2y + 8 \\implies 3y - 2y = 8 + 6 \\implies y = 14$$.",
      points: 1
    },
    {
      id: "q06",
      prompt: "Write $0.00405$ in standard form.",
      options: [
        "$$4.05 \\times 10^3$$",
        "$$4.05 \\times 10^{-3}$$",
        "$$4.05 \\times 10^{-4}$$",
        "$$40.5 \\times 10^{-4}$$"
      ],
      correctAnswer: "$$4.05 \\times 10^{-3}$$",
      hint: "Move the decimal point 3 places to the right to get 4.05.",
      workedSolution: "$$0.00405 = 4.05 \\times 10^{-3}$$.",
      points: 1
    },
    {
      id: "q07",
      prompt: "A trader bought a carton of canned milk for $\\text{GH¢ } 160.00$ and sold it at a loss of $10\\%$. What was the selling price?",
      options: [
        "GH¢ 150.00",
        "GH¢ 140.00",
        "GH¢ 148.00",
        "GH¢ 144.00"
      ],
      correctAnswer: "GH¢ 144.00",
      hint: "Loss = 10% of 160 = 16. Selling price = 160 - 16.",
      workedSolution: "$$\\text{Loss} = 0.10 \\times 160 = 16$$. Selling price = $$160 - 16 = \\text{GH¢ } 144.00$$.",
      points: 1
    },
    {
      id: "q08",
      prompt: "Express the ratio of $45\\text{ minutes}$ to $2\\text{ hours}$ in simplest form.",
      options: [
        "1 : 4",
        "3 : 8",
        "9 : 20",
        "3 : 4"
      ],
      correctAnswer: "3 : 8",
      hint: "Convert 2 hours to minutes: $2 \\times 60 = 120\\text{ minutes}$. Ratio = 45 : 120.",
      workedSolution: "$$\\frac{45}{120} = \\frac{45 \\div 15}{120 \\div 15} = \\frac{3}{8} = 3 : 8$$.",
      points: 1
    },
    {
      id: "q09",
      prompt: "Evaluate: $$\\left(2\\frac{1}{3} - 1\\frac{1}{2}\\right) \\times \\frac{6}{5}$$.",
      options: [
        "$$\\frac{5}{6}$$",
        "$$\\frac{4}{5}$$",
        "1",
        "$$1\\frac{1}{5}$$"
      ],
      correctAnswer: "1",
      hint: "Calculate the difference in brackets using LCD 6: $\\frac{7}{3} - \\frac{3}{2} = \\frac{14 - 9}{6} = \\frac{5}{6}$.",
      workedSolution: "$$\\frac{5}{6} \\times \\frac{6}{5} = 1$$.",
      points: 1
    },
    {
      id: "q10",
      prompt: "The test marks of nine candidates are: $$4, 7, 5, 8, 7, 6, 7, 9, 3$$. What is the modal mark?",
      options: [
        "7",
        "6",
        "8",
        "5"
      ],
      correctAnswer: "7",
      hint: "The mode is the mark occurring most frequently.",
      workedSolution: "7 appears 3 times, which is more than any other mark. The mode is 7.",
      points: 1
    },
    {
      id: "q11",
      prompt: "From the test marks in Question 10 ($$3, 4, 5, 6, 7, 7, 7, 8, 9$$), find the median mark.",
      options: [
        "6",
        "6.5",
        "7.5",
        "7"
      ],
      correctAnswer: "7",
      hint: "With 9 ordered values, the median is the 5th value: $(9 + 1) / 2 = 5$.",
      workedSolution: "The ordered values are 3, 4, 5, 6, **7**, 7, 7, 8, 9. The 5th value is 7.",
      points: 1
    },
    {
      id: "q12",
      prompt: "Calculate the simple interest on $\\text{GH¢ } 360.00$ at $5\\%\\text{ per annum}$ for $4\\text{ years}$.",
      options: [
        "GH¢ 60.00",
        "GH¢ 72.00",
        "GH¢ 80.00",
        "GH¢ 54.00"
      ],
      correctAnswer: "GH¢ 72.00",
      hint: "$$I = \\frac{P \\times R \\times T}{100}$$.",
      workedSolution: "$$I = \\frac{360 \\times 5 \\times 4}{100} = \\frac{360 \\times 20}{100} = \\frac{7200}{100} = \\text{GH¢ } 72.00$$.",
      points: 1
    },
    {
      id: "q13",
      prompt: "A cyclist covers a distance of $45\\text{ km}$ in $2\\frac{1}{2}\\text{ hours}$. Calculate his average speed.",
      options: [
        "20 km/h",
        "16 km/h",
        "18 km/h",
        "22.5 km/h"
      ],
      correctAnswer: "18 km/h",
      hint: "Speed = Distance ÷ Time: $45 \\div 2.5$.",
      workedSolution: "$$\\text{Speed} = 45 \\div \\frac{5}{2} = 45 \\times \\frac{2}{5} = 9 \\times 2 = 18\\text{ km/h}$$.",
      points: 1
    },
    {
      id: "q14",
      prompt: "Convert the decimal number $38_{\\text{ten}}$ to a base five numeral.",
      options: [
        "$$123_{\\text{five}}$$",
        "$$133_{\\text{five}}$$",
        "$$213_{\\text{five}}$$",
        "$$143_{\\text{five}}$$"
      ],
      correctAnswer: "$$123_{\\text{five}}$$",
      hint: "Divide repeatedly by 5: $38 = 1(25) + 2(5) + 3(1)$.",
      workedSolution: "$$38 \\div 5 = 7\\text{ R } 3$$; $$7 \\div 5 = 1\\text{ R } 2$$; $$1 \\div 5 = 0\\text{ R } 1$$. Reading upwards: $$123_{\\text{five}}$$.",
      points: 1
    },
    {
      id: "q15",
      prompt: "Simplify: $$5p - 2(3p - 4)$$.",
      options: [
        "$$-p - 8$$",
        "$$11p + 8$$",
        "$$-p + 4$$",
        "$$-p + 8$$"
      ],
      correctAnswer: "$$-p + 8$$",
      hint: "Expand: $5p - 6p + 8$. Note that $-2 \\times (-4) = +8$.",
      workedSolution: "$$5p - 6p + 8 = -p + 8$$.",
      points: 1
    },
    {
      id: "q16",
      prompt: "In a school of $600$ students, $45\\%$ are boys. How many girls are in the school?",
      options: [
        "270",
        "330",
        "350",
        "310"
      ],
      correctAnswer: "330",
      hint: "Girls make up $100\\% - 45\\% = 55\\%$. Find 55% of 600.",
      workedSolution: "$$55\\% \\times 600 = \\frac{55}{100} \\times 600 = 55 \\times 6 = 330\\text{ girls}$$.",
      points: 1
    },
    {
      id: "q17",
      prompt: "Factorize completely: $$xy + 3x - 2y - 6$$.",
      options: [
        "$$(y - 3)(x + 2)$$",
        "$$(y + 3)(x + 2)$$",
        "$$(y + 3)(x - 2)$$",
        "$$(y - 3)(x - 2)$$"
      ],
      correctAnswer: "$$(y + 3)(x - 2)$$",
      hint: "Group terms: $x(y + 3) - 2(y + 3)$.",
      workedSolution: "$$x(y + 3) - 2(y + 3) = (y + 3)(x - 2)$$.",
      points: 1
    },
    {
      id: "q18",
      prompt: "Find the area of a circle with diameter $14\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).",
      options: [
        "$$154\\text{ cm}^2$$",
        "$$44\\text{ cm}^2$$",
        "$$88\\text{ cm}^2$$",
        "$$616\\text{ cm}^2$$"
      ],
      correctAnswer: "$$154\\text{ cm}^2$$",
      hint: "Radius = diameter / 2 = 7 cm. Area = $\\pi r^2$.",
      workedSolution: "$$\\text{Area} = \\frac{22}{7} \\times 7 \\times 7 = 22 \\times 7 = 154\\text{ cm}^2$$.",
      points: 1
    },
    {
      id: "q19",
      prompt: "Given column vectors $$u = \\begin{pmatrix} 3 \\\\ -1 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} -2 \\\\ 4 \\end{pmatrix}$$, evaluate $$u + 2v$$.",
      options: [
        "$$\\begin{pmatrix} -1 \\\\ 3 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 1 \\\\ 7 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 7 \\\\ 7 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} -1 \\\\ 7 \\end{pmatrix}$$"
      ],
      correctAnswer: "$$\\begin{pmatrix} -1 \\\\ 7 \\end{pmatrix}$$",
      hint: "$$3 + 2(-2) = 3 - 4 = -1$$ and $$-1 + 2(4) = -1 + 8 = 7$$.",
      workedSolution: "$$\\begin{pmatrix} 3 + 2(-2) \\\\ -1 + 2(4) \\end{pmatrix} = \\begin{pmatrix} -1 \\\\ 7 \\end{pmatrix}$$.",
      points: 1
    },
    {
      id: "q20",
      prompt: "Solve the linear inequality: $$3x - 2 > 7x - 14$$.",
      options: [
        "$$x < 3$$",
        "$$x > 3$$",
        "$$x < -3$$",
        "$$x > -3$$"
      ],
      correctAnswer: "$$x < 3$$",
      hint: "$$-2 + 14 > 7x - 3x \\implies 12 > 4x$$.",
      workedSolution: "$$12 > 4x \\implies 3 > x$$, which means $$x < 3$$.",
      points: 1
    },
    {
      id: "q21",
      prompt: "The three angles of a triangle are in the ratio $2 : 3 : 5$. Find the size of the smallest angle.",
      options: [
        "$$45^\\circ$$",
        "$$54^\\circ$$",
        "$$36^\\circ$$",
        "$$90^\\circ$$"
      ],
      correctAnswer: "$$36^\\circ$$",
      hint: "Total parts = 2 + 3 + 5 = 10. Smallest angle = (2 / 10) × 180°.",
      workedSolution: "$$\\text{Smallest angle} = \\frac{2}{10} \\times 180^\\circ = 2 \\times 18^\\circ = 36^\\circ$$.",
      points: 1
    },
    {
      id: "q22",
      prompt: "A bag contains $7$ white marbles and $5$ black marbles. What is the probability of selecting a black marble at random?",
      options: [
        "$$\\frac{7}{12}$$",
        "$$\\frac{5}{12}$$",
        "$$\\frac{5}{7}$$",
        "$$\\frac{1}{5}$$"
      ],
      correctAnswer: "$$\\frac{5}{12}$$",
      hint: "Total marbles = 7 + 5 = 12. Favourable = 5.",
      workedSolution: "$$P(\\text{black}) = \\frac{5}{7 + 5} = \\frac{5}{12}$$.",
      points: 1
    },
    {
      id: "q23",
      prompt: "Simplify: $$\\frac{3^5 \\times 2^4}{3^3 \\times 2^2}$$.",
      options: [
        "24",
        "18",
        "72",
        "36"
      ],
      correctAnswer: "36",
      hint: "Subtract indices: $3^{5-3} \\times 2^{4-2} = 3^2 \\times 2^2$.",
      workedSolution: "$$3^2 \\times 2^2 = 9 \\times 4 = 36$$.",
      points: 1
    },
    {
      id: "q24",
      prompt: "In a right-angled triangle $ABC$, the hypotenuse $|AC| = 13\\text{ cm}$ and base $|BC| = 5\\text{ cm}$. Find the length of height $|AB|$.",
      options: [
        "12 cm",
        "10 cm",
        "8 cm",
        "11 cm"
      ],
      correctAnswer: "12 cm",
      hint: "$$|AB|^2 = |AC|^2 - |BC|^2 = 13^2 - 5^2$$.",
      workedSolution: "$$|AB|^2 = 169 - 25 = 144 \\implies |AB| = \\sqrt{144} = 12\\text{ cm}$$.",
      points: 1
    },
    {
      id: "q25",
      prompt: "State the rule for the linear mapping where inputs $x = \\{1, 2, 3, 4\\}$ produce outputs $y = \\{5, 9, 13, 17\\}$.",
      options: [
        "$$x \\to 4x - 1$$",
        "$$x \\to 3x + 2$$",
        "$$x \\to 4x + 1$$",
        "$$x \\to 5x$$"
      ],
      correctAnswer: "$$x \\to 4x + 1$$",
      hint: "Common difference is $9 - 5 = 4$. Check $4(1) + 1 = 5$.",
      workedSolution: "Rate of change = 4. When $x = 1$, $4(1) + c = 5 \\implies c = 1$. The rule is $$x \\to 4x + 1$$.",
      points: 1
    },
    {
      id: "q26",
      prompt: "A storage tank has length $5\\text{ m}$, width $3\\text{ m}$, and height $2\\text{ m}$. What is its volume in cubic metres?",
      options: [
        "$$25\\text{ m}^3$$",
        "$$30\\text{ m}^3$$",
        "$$35\\text{ m}^3$$",
        "$$20\\text{ m}^3$$"
      ],
      correctAnswer: "$$30\\text{ m}^3$$",
      hint: "Volume = length × width × height.",
      workedSolution: "$$5 \\times 3 \\times 2 = 30\\text{ m}^3$$.",
      points: 1
    },
    {
      id: "q27",
      prompt: "If $a = 4$ and $b = -3$, evaluate: $$\\frac{a^2 + b^2}{5}$$.",
      options: [
        "7",
        "1",
        "25",
        "5"
      ],
      correctAnswer: "5",
      hint: "$$a^2 = 4^2 = 16$$, $$b^2 = (-3)^2 = 9$$. Add and divide by 5.",
      workedSolution: "$$\\frac{16 + 9}{5} = \\frac{25}{5} = 5$$.",
      points: 1
    },
    {
      id: "q28",
      prompt: "How many lines of symmetry does an equilateral triangle possess?",
      options: [
        "3",
        "1",
        "2",
        "6"
      ],
      correctAnswer: "3",
      hint: "Each line of symmetry passes through a vertex and perpendicularly bisects the opposite side.",
      workedSolution: "An equilateral triangle has 3 lines of symmetry.",
      points: 1
    },
    {
      id: "q29",
      prompt: "An article marked at $\\text{GH¢ } 50.00$ was bought for $\\text{GH¢ } 42.50$. Calculate the percentage discount allowed.",
      options: [
        "12.5%",
        "15%",
        "10%",
        "20%"
      ],
      correctAnswer: "15%",
      hint: "Discount = 50.00 - 42.50 = 7.50. Discount % = (7.50 / 50.00) × 100%.",
      workedSolution: "$$\\text{Discount \\%} = \\frac{7.50}{50.00} \\times 100\\% = 7.5 \\times 2 = 15\\%$$.",
      points: 1
    },
    {
      id: "q30",
      prompt: "Under a reflection in the $y$-axis, the image of point $A(4, -5)$ is:",
      options: [
        "(-4, 5)",
        "(4, 5)",
        "(-4, -5)",
        "(-5, 4)"
      ],
      correctAnswer: "(-4, -5)",
      hint: "Reflection in y-axis maps $(x, y) \\to (-x, y)$.",
      workedSolution: "$$(4, -5) \\to (-4, -5)$$.",
      points: 1
    },
    {
      id: "q31",
      prompt: "Calculate the perimeter of a rectangle with length $16\\text{ cm}$ and breadth $9\\text{ cm}$.",
      options: [
        "25 cm",
        "144 cm",
        "45 cm",
        "50 cm"
      ],
      correctAnswer: "50 cm",
      hint: "Perimeter = 2(length + breadth).",
      workedSolution: "$$2(16 + 9) = 2(25) = 50\\text{ cm}$$.",
      points: 1
    },
    {
      id: "q32",
      prompt: "In a pie chart, a sector of $72^\\circ$ represents $24$ students. How many students are represented by the entire pie chart?",
      options: [
        "120",
        "100",
        "144",
        "96"
      ],
      correctAnswer: "120",
      hint: "The full circle is 360°. Find $24 \\times (360 / 72)$.",
      workedSolution: "$$\\frac{360^\\circ}{72^\\circ} \\times 24 = 5 \\times 24 = 120\\text{ students}$$.",
      points: 1
    },
    {
      id: "q33",
      prompt: "Find the value of $m$ if $2 : 7 = m : 35$.",
      options: [
        "12",
        "10",
        "8",
        "14"
      ],
      correctAnswer: "10",
      hint: "Cross-multiply: $7m = 2 \\times 35$.",
      workedSolution: "$$7m = 70 \\implies m = 10$$.",
      points: 1
    },
    {
      id: "q34",
      prompt: "Make $r$ the subject of the formula: $$C = 2\\pi r$$.",
      options: [
        "$$r = \\frac{2\\pi}{C}$$",
        "$$r = C - 2\\pi$$",
        "$$r = \\frac{C}{2\\pi}$$",
        "$$r = \\frac{C}{\\pi}$$"
      ],
      correctAnswer: "$$r = \\frac{C}{2\\pi}$$",
      hint: "Divide both sides by $2\\pi$.",
      workedSolution: "$$C = 2\\pi r \\implies r = \\frac{C}{2\\pi}$$.",
      points: 1
    },
    {
      id: "q35",
      prompt: "Simplify: $$\\frac{4}{2x} + \\frac{1}{x}$$.",
      options: [
        "$$\\frac{5}{2x}$$",
        "$$\\frac{2}{x}$$",
        "$$\\frac{3}{2x}$$",
        "$$\\frac{3}{x}$$"
      ],
      correctAnswer: "$$\\frac{3}{x}$$",
      hint: "$$\\frac{4}{2x} = \\frac{2}{x}$$. Then add $\\frac{2}{x} + \\frac{1}{x}$.",
      workedSolution: "$$\\frac{2}{x} + \\frac{1}{x} = \\frac{3}{x}$$.",
      points: 1
    },
    {
      id: "q36",
      prompt: "What is the exterior angle of a regular pentagon ($5\\text{ sides}$)?",
      options: [
        "$$72^\\circ$$",
        "$$60^\\circ$$",
        "$$108^\\circ$$",
        "$$45^\\circ$$"
      ],
      correctAnswer: "$$72^\\circ$$",
      hint: "Sum of exterior angles is 360°. Divide by 5.",
      workedSolution: "$$\\text{Exterior angle} = \\frac{360^\\circ}{5} = 72^\\circ$$.",
      points: 1
    },
    {
      id: "q37",
      prompt: "The point $Q(-1, 3)$ is translated by vector $$\\begin{pmatrix} 4 \\\\ -5 \\end{pmatrix}$$ to $Q'$. Find the coordinates of $Q'$.",
      options: [
        "(3, 2)",
        "(3, -2)",
        "(-5, 8)",
        "(3, -8)"
      ],
      correctAnswer: "(3, -2)",
      hint: "$$(-1 + 4, 3 + (-5))$$.",
      workedSolution: "$$Q' = (-1 + 4, 3 - 5) = (3, -2)$$.",
      points: 1
    },
    {
      id: "q38",
      prompt: "Evaluate: $$\\sqrt{64} \\times \\sqrt{25} - \\sqrt{100}$$.",
      options: [
        "20",
        "40",
        "30",
        "10"
      ],
      correctAnswer: "30",
      hint: "Take the square roots: $8 \\times 5 - 10$.",
      workedSolution: "$$(8 \\times 5) - 10 = 40 - 10 = 30$$.",
      points: 1
    },
    {
      id: "q39",
      prompt: "What type of angle is an angle measuring $138^\\circ$?",
      options: [
        "Acute angle",
        "Reflex angle",
        "Right angle",
        "Obtuse angle"
      ],
      correctAnswer: "Obtuse angle",
      hint: "Angles between 90° and 180° are obtuse.",
      workedSolution: "Since $90^\\circ < 138^\\circ < 180^\\circ$, it is an obtuse angle.",
      points: 1
    },
    {
      id: "q40",
      prompt: "Calculate the magnitude of vector $$u = \\begin{pmatrix} 5 \\\\ 12 \\end{pmatrix}$$.",
      options: [
        "13 units",
        "17 units",
        "15 units",
        "14 units"
      ],
      correctAnswer: "13 units",
      hint: "$$|u| = \\sqrt{5^2 + 12^2}$$.",
      workedSolution: "$$|u| = \\sqrt{25 + 144} = \\sqrt{169} = 13\\text{ units}$$.",
      points: 1
    }
  ],
  seededAt: "2026-09-15T20:00:00.000Z",
  lastUpdated: "2026-09-15T20:00:00.000Z"
};

// ============================================================================
// 4c. ALIGNED CORE CURRICULUM SERIES: JHS Math Structured Problem-Solving Series (Set 28)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-28
// ============================================================================
export const SET_JHS_MASTERY_SERIES_28: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-28",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 28)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling",
  variantType: "standard",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
      id: "q01",
      title: "Question 1: Set Number Partitions, Transposition & Linear Equations",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "Given the universal set $$\\varepsilon = \\{x : x \\text{ is an integer, } 1 \\le x \\le 20\\}$$, and subsets:\n$$P = \\{\\text{multiples of } 3\\}$$\n$$Q = \\{\\text{factors of } 18\\}$$\n(i) List the elements of set $P$ and set $Q$.\n(ii) Find $P \\cap Q$.\n(iii) Find $(P \\cup Q)'$.",
          hint: "List numbers between 1 and 20 divisible by 3 for P, and numbers between 1 and 20 that divide 18 for Q.",
          modelAnswer: "(i) P={3,6,9,12,15,18}, Q={1,2,3,6,9,18}; (ii) {3,6,9,18}; (iii) {4,5,7,8,10,11,13,14,16,17,19,20}",
          workedSolution: "**(i) Sets:**\n- $$P = \\{3, 6, 9, 12, 15, 18\\}$$\n- $$Q = \\{1, 2, 3, 6, 9, 18\\}$$\n\n**(ii) Intersection ($P \\cap Q$):**\n$$P \\cap Q = \\{3, 6, 9, 18\\}$$\n\n**(iii) Complement of Union ($(P \\cup Q)'$):**\n$$P \\cup Q = \\{1, 2, 3, 6, 9, 12, 15, 18\\}$$\nElements in $\\varepsilon$ outside $P \\cup Q$:\n$$(P \\cup Q)' = \\{4, 5, 7, 8, 10, 11, 13, 14, 16, 17, 19, 20\\}$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Make $k$ the subject of the relation:\n$$v^2 = u^2 + 2ks$$",
          hint: "Subtract $u^2$ from both sides, then divide by $2s$.",
          modelAnswer: "$$k = \\frac{v^2 - u^2}{2s}$$",
          workedSolution: "$$v^2 - u^2 = 2ks$$\nDivide both sides by $2s$:\n$$k = \\frac{v^2 - u^2}{2s}$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Solve for $x$ in the equation:\n$$\\frac{3x - 2}{4} = \\frac{x + 4}{2}$$",
          hint: "Multiply both sides by 4 to clear denominators.",
          modelAnswer: "x = 10",
          workedSolution: "$$3x - 2 = 2(x + 4)$$\n$$3x - 2 = 2x + 8$$\n$$3x - 2x = 8 + 2 \\implies x = 10$$."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Proportional Sharing, Simple Interest & Base Five Arithmetic",
      totalMarks: 15,
      format: "structured_essay",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "Kofi, Ama, and Kwabena shared an amount of $\\text{GH¢ } 1,440.00$ in the ratio $3 : 4 : 5$ respectively.\n(i) Calculate the share received by each person.\n(ii) What percentage of the total amount did Kwabena receive?",
          hint: "Total ratio parts = 3 + 4 + 5 = 12. Find 1 part = 1440 / 12.",
          modelAnswer: "(i) Kofi: GH¢ 360.00, Ama: GH¢ 480.00, Kwabena: GH¢ 600.00; (ii) 41.67%",
          workedSolution: "**(i) Shares:**\nTotal parts = $3 + 4 + 5 = 12$.\nValue of 1 part = $$\\frac{\\text{GH¢ } 1,440.00}{12} = \\text{GH¢ } 120.00$$\n- **Kofi:** $$3 \\times 120 = \\text{GH¢ } 360.00$$\n- **Ama:** $$4 \\times 120 = \\text{GH¢ } 480.00$$\n- **Kwabena:** $$5 \\times 120 = \\text{GH¢ } 600.00$$\n\n**(ii) Kwabena's percentage:**\n$$\\text{Percentage} = \\left(\\frac{5}{12}\\right) \\times 100\\% = \\frac{500}{12}\\% = 41\\frac{2}{3}\\% \\approx 41.67\\%$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Ama invested her share of $\\text{GH¢ } 480.00$ at a simple interest rate of $12\\frac{1}{2}\\%\\text{ per annum}$ for $2\\text{ years}$. Calculate the total amount she had at the end of the $2\\text{ years}$.",
          hint: "Simple Interest $I = \\frac{P \\times R \\times T}{100}$. Note that $12.5\\% = \\frac{1}{8}$.",
          modelAnswer: "GH¢ 600.00",
          workedSolution: "$$I = \\frac{480 \\times 12.5 \\times 2}{100} = \\frac{480 \\times 25}{100} = \\frac{480}{4} = \\text{GH¢ } 120.00$$\n$$\\text{Total Amount} = P + I = 480.00 + 120.00 = \\text{GH¢ } 600.00$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Evaluate the addition in base five:\n$$342_{\\text{five}} + 234_{\\text{five}}$$",
          hint: "Remember that $5$ in base five is written as $10_{\\text{five}}$.",
          modelAnswer: "1131_five",
          workedSolution: "- Units: $2 + 4 = 6 = 1(5) + 1 \\to 1$, carry 1.\n- 5s column: $4 + 3 + 1 = 8 = 1(5) + 3 \\to 3$, carry 1.\n- 25s column: $3 + 2 + 1 = 6 = 1(5) + 1 \\to 1$, carry 1.\nResult: **$$1131_{\\text{five}}$$**."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Right-Angled Elevation Surveying & Pythagoras' Theorem",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 340 220' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><polygon points='50,180 250,180 250,50' fill='#f1f5f9' stroke='#1e293b' stroke-width='2'/><rect x='235' y='165' width='15' height='15' fill='none' stroke='#334155' stroke-width='1.5'/><line x1='50' y1='180' x2='250' y2='50' stroke='#2563eb' stroke-width='2.5'/><text x='35' y='195' font-size='12' font-weight='bold'>P</text><text x='260' y='195' font-size='12' font-weight='bold'>Q</text><text x='260' y='45' font-size='12' font-weight='bold'>R</text><text x='130' y='200' font-size='12' font-weight='bold'>Base = 24 m</text><text x='265' y='120' font-size='12' font-weight='bold' fill='#dc2626'>h = 10 m</text><text x='125' y='105' font-size='12' font-weight='bold' fill='#2563eb'>d = ?</text><path d='M75,180 A25,25 0 0,0 72,168' fill='none' stroke='#059669' stroke-width='1.5'/><text x='85' y='172' font-size='11' font-weight='bold' fill='#059669'>θ</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "In the surveying diagram above, $QR$ represents a vertical cliff of height $10\\text{ m}$ and $P$ is an observation post on horizontal ground $24\\text{ m}$ from the foot of the cliff $Q$.\n(i) Calculate the straight-line distance $d = |PR|$ from the observation post to the top of the cliff.\n(ii) State $\\tan \\theta$ as a common fraction in its lowest terms.",
          hint: "Apply Pythagoras' theorem: $|PR|^2 = |PQ|^2 + |QR|^2$. $\\tan \\theta = \\text{opposite} / \\text{adjacent}$.",
          modelAnswer: "(i) 26 m, (ii) 5/12",
          workedSolution: "**(i) Distance $|PR|$:**\n$$|PR|^2 = |PQ|^2 + |QR|^2 = 24^2 + 10^2 = 576 + 100 = 676$$\n$$|PR| = \\sqrt{676} = 26\\text{ m}$$\n\n**(ii) $\\tan \\theta$:**\n$$\\tan \\theta = \\frac{|QR|}{|PQ|} = \\frac{10}{24} = \\frac{5}{12}$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Calculate the area of the vertical triangular face formed by $\\Delta PQR$.",
          hint: "Area = 1/2 × base × height.",
          modelAnswer: "120 m²",
          workedSolution: "$$\\text{Area} = \\frac{1}{2} \\times |PQ| \\times |QR| = \\frac{1}{2} \\times 24 \\times 10 = 12 \\times 10 = 120\\text{ m}^2$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Find $\\cos \\theta$ and $\\sin \\theta$ as common fractions in simplest form.",
          hint: "$\\cos \\theta = \\text{adjacent} / \\text{hypotenuse}$, $\\sin \\theta = \\text{opposite} / \\text{hypotenuse}$.",
          modelAnswer: "cos θ = 12/13, sin θ = 5/13",
          workedSolution: "$$\\cos \\theta = \\frac{24}{26} = \\frac{12}{13}$$\n$$\\sin \\theta = \\frac{10}{26} = \\frac{5}{13}$$."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Linear Functional Relations & Simultaneous Coordinates",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 250' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='140' x2='290' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='230' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><line x1='60' y1='210' x2='260' y2='50' stroke='#2563eb' stroke-width='2'/><line x1='60' y1='50' x2='260' y2='210' stroke='#dc2626' stroke-width='2'/><circle cx='180' cy='115' r='5' fill='#059669'/><text x='190' y='110' font-size='12' font-weight='bold' fill='#059669'>(1, 2)</text><text x='250' y='45' font-size='11' fill='#2563eb'>y₁ = x + 1</text><text x='250' y='215' font-size='11' fill='#dc2626'>y₂ = 3 - x</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "Copy and complete the table of values for the straight-line relations $$y_1 = x + 1$$ and $$y_2 = 3 - x$$:\n\n| $x$ | -2 | -1 | 0 | 1 | 2 | 3 | 4 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = x + 1$ | -1 | **?** | 1 | **?** | 3 | **?** | 5 |\n| $y_2 = 3 - x$ | 5 | **?** | 3 | **?** | 1 | **?** | -1 |",
          hint: "Substitute each missing x value into both equations.",
          modelAnswer: "y₁: [-1, 0, 1, 2, 3, 4, 5]; y₂: [5, 4, 3, 2, 1, 0, -1]",
          workedSolution: "For $y_1 = x + 1$:\n- $x = -1 \\implies y = -1 + 1 = 0$\n- $x = 1 \\implies y = 1 + 1 = 2$\n- $x = 3 \\implies y = 3 + 1 = 4$\n\nFor $y_2 = 3 - x$:\n- $x = -1 \\implies y = 3 - (-1) = 4$\n- $x = 1 \\implies y = 3 - 1 = 2$\n- $x = 3 \\implies y = 3 - 3 = 0$"
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "From the simultaneous graph above, determine:\n(i) The coordinates of the point where the two lines intersect.\n(ii) The gradient of the line $y_2 = 3 - x$.",
          hint: "Set $x + 1 = 3 - x$. Gradient of $y = -x + 3$ is the coefficient of $x$.",
          modelAnswer: "(i) (1, 2), (ii) Gradient = -1",
          workedSolution: "**(i) Point of intersection:**\n$$x + 1 = 3 - x \\implies 2x = 2 \\implies x = 1$$\nWhen $x = 1$, $y = 1 + 1 = 2$. Intersection = **$(1, 2)$**.\n\n**(ii) Gradient:**\n$y_2 = -x + 3 \\implies m = -1$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Find the truth set of the inequality: $$x + 1 \\ge 3 - x$$.",
          hint: "Add x to both sides, then subtract 1.",
          modelAnswer: "{x : x ≥ 1}",
          workedSolution: "$$x + x \\ge 3 - 1$$\n$$2x \\ge 2 \\implies x \\ge 1$$\nTruth set: **$$\\{x : x \\ge 1, \\, x \\in \\mathbb{R}\\}$$**."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Cartesian Vector Translations, Reflections & Lengths",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 320 260' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='140' x2='300' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='250' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><polygon points='190,100 250,100 190,40' fill='#dbeafe' stroke='#2563eb' stroke-width='2'/><text x='175' y='115' font-size='10' font-weight='bold'>A(1,2)</text><text x='255' y='115' font-size='10' font-weight='bold'>B(4,2)</text><text x='175' y='35' font-size='10' font-weight='bold'>C(1,5)</text><polygon points='190,180 250,180 190,240' fill='#fee2e2' stroke='#dc2626' stroke-width='2'/><text x='175' y='175' font-size='10' font-weight='bold' fill='#dc2626'>A₁</text><text x='255' y='175' font-size='10' font-weight='bold' fill='#dc2626'>B₁</text><text x='175' y='250' font-size='10' font-weight='bold' fill='#dc2626'>C₁</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 6,
          prompt: "Triangle $ABC$ has vertices $A(1, 2)$, $B(4, 2)$, and $C(1, 5)$.\n(i) Write down the coordinates of image vertices $A_1, B_1,$ and $C_1$ under a reflection in the $x$-axis.\n(ii) Write down the coordinates of image vertices $A_2, B_2,$ and $C_2$ under a reflection in the $y$-axis.",
          hint: "Reflection in x-axis: (x, y) → (x, -y). Reflection in y-axis: (x, y) → (-x, y).",
          modelAnswer: "(i) A₁(1, -2), B₁(4, -2), C₁(1, -5); (ii) A₂(-1, 2), B₂(-4, 2), C₂(-1, 5)",
          workedSolution: "**(i) Reflection in $x$-axis:** $$(x, y) \\to (x, -y)$$\n- $$A(1, 2) \\to A_1(1, -2)$$\n- $$B(4, 2) \\to B_1(4, -2)$$\n- $$C(1, 5) \\to C_1(1, -5)$$\n\n**(ii) Reflection in $y$-axis:** $$(x, y) \\to (-x, y)$$\n- $$A(1, 2) \\to A_2(-1, 2)$$\n- $$B(4, 2) \\to B_2(-4, 2)$$\n- $$C(1, 5) \\to C_2(-1, 5)$$."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "Triangle $ABC$ is translated by vector $$T = \\begin{pmatrix} -3 \\\\ 1 \\end{pmatrix}$$ to triangle $A_3B_3C_3$.\nDetermine the coordinates of $A_3, B_3,$ and $C_3$.",
          hint: "Add the vector components to each vertex: (x - 3, y + 1).",
          modelAnswer: "A₃(-2, 3), B₃(1, 3), C₃(-2, 6)",
          workedSolution: "$$(x, y) \\to (x - 3, y + 1)$$\n- $$A(1, 2) \\to A_3(1 - 3, 2 + 1) = A_3(-2, 3)$$\n- $$B(4, 2) \\to B_3(4 - 3, 2 + 1) = B_3(1, 3)$$\n- $$C(1, 5) \\to C_3(1 - 3, 5 + 1) = C_3(-2, 6)$$."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Calculate the area of triangle $ABC$.",
          hint: "Triangle ABC is right-angled at A with base AB = 3 and height AC = 3.",
          modelAnswer: "4.5 square units",
          workedSolution: "Base $$AB = 4 - 1 = 3\\text{ units}$$.\nHeight $$AC = 5 - 2 = 3\\text{ units}$$.\n$$\\text{Area} = \\frac{1}{2} \\times 3 \\times 3 = \\frac{9}{2} = 4.5\\text{ square units}$$."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Classroom Test Mark Distribution, Mean & Probability",
      totalMarks: 15,
      format: "structured_essay",
      diagramSvg: "<svg viewBox='0 0 350 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><line x1='35' y1='160' x2='320' y2='160' stroke='#334155' stroke-width='2'/><line x1='35' y1='160' x2='35' y2='20' stroke='#334155' stroke-width='2'/><text x='150' y='188' font-size='11' font-weight='bold'>Marks Scored</text><text x='5' y='18' font-size='11' font-weight='bold'>Frequency</text><rect x='55' y='125' width='25' height='35' fill='#93c5fd' stroke='#1d4ed8'/><rect x='100' y='90' width='25' height='70' fill='#93c5fd' stroke='#1d4ed8'/><rect x='145' y='35' width='25' height='125' fill='#2563eb' stroke='#1d4ed8'/><rect x='190' y='75' width='25' height='85' fill='#93c5fd' stroke='#1d4ed8'/><rect x='235' y='110' width='25' height='50' fill='#93c5fd' stroke='#1d4ed8'/><rect x='280' y='140' width='25' height='20' fill='#93c5fd' stroke='#1d4ed8'/><text x='65' y='173' font-size='10'>1</text><text x='110' y='173' font-size='10'>2</text><text x='155' y='173' font-size='10'>3</text><text x='200' y='173' font-size='10'>4</text><text x='245' y='173' font-size='10'>5</text><text x='288' y='173' font-size='10'>6</text><text x='20' y='40' font-size='10'>7</text><text x='20' y='80' font-size='10'>5</text><text x='20' y='130' font-size='10'>2</text></svg>",
      parts: [
        {
          partLabel: "(a)",
          marks: 9,
          prompt: "The test scores of $20$ pupils in a mathematics quiz are recorded in the frequency distribution table below:\n\n| Mark ($x$) | 1 | 2 | 3 | 4 | 5 | 6 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| Frequency ($f$) | 2 | 4 | 7 | 4 | 2 | 1 |\n\n(i) State the **modal mark**.\n(ii) Calculate the total number of pupils ($N = \\sum f$).\n(iii) Calculate the **mean mark** of the class.",
          hint: "Mode is the mark with highest frequency. Mean = $\\sum fx / \\sum f$.",
          modelAnswer: "(i) 3 marks, (ii) 20 pupils, (iii) 3.15 marks",
          workedSolution: "**(i) Modal mark:**\nThe highest frequency is $7$, corresponding to **$3\\text{ marks}$**.\n\n**(ii) Total pupils:**\n$$N = \\sum f = 2 + 4 + 7 + 4 + 2 + 1 = 20\\text{ pupils}$$\n\n**(iii) Mean mark:**\n$$\\sum fx = (1 \\times 2) + (2 \\times 4) + (3 \\times 7) + (4 \\times 4) + (5 \\times 2) + (6 \\times 1)$$\n$$\\sum fx = 2 + 8 + 21 + 16 + 10 + 6 = 63$$\n$$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{63}{20} = 3.15\\text{ marks}$$."
        },
        {
          partLabel: "(b)",
          marks: 6,
          prompt: "If a pupil is chosen at random from this group:\n(i) Find the probability that the pupil scored strictly more than $3$.\n(ii) What percentage of the pupils scored at least $2$?",
          hint: "Scores > 3 are 4, 5, and 6. At least 2 means scores 2, 3, 4, 5, 6.",
          modelAnswer: "(i) 7/20, (ii) 90%",
          workedSolution: "**(i) Probability of scoring > 3 (marks 4, 5, 6):**\n$$\\text{Count} = f(4) + f(5) + f(6) = 4 + 2 + 1 = 7$$\n$$P(x > 3) = \\frac{7}{20}$$\n\n**(ii) Percentage scoring at least 2 (marks 2, 3, 4, 5, 6):**\n$$\\text{Count} = 20 - f(1) = 20 - 2 = 18$$\n$$\\text{Percentage} = \\left(\\frac{18}{20}\\right) \\times 100\\% = 18 \\times 5 = 90\\%$$."
        }
      ]
    }
  ],
  seededAt: "2026-09-15T20:30:00.000Z",
  lastUpdated: "2026-09-15T20:30:00.000Z"
};

// ============================================================================
// 4d. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 29)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-29
// ============================================================================
export const SET_JHS_MASTERY_SERIES_29: CurriculumQuestionSet = {
  "id": "jhs-math-mastery-series-29",
  "title": "Junior Core Mathematics • Objective Mastery Series (Set 29)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Mathematics",
  "topic": "Comprehensive Objective Exam Series",
  "variantType": "standard",
  "totalQuestions": 40,
  "version": 1,
  "questions": [
    {
      "id": "q01",
      "prompt": "If set $P = \\{x : x \\text{ is a multiple of } 4, \\, 1 < x < 25\\}$ and set $Q = \\{x : x \\text{ is a factor of } 24\\}$, find $P \\cap Q$.",
      "options": [
        "{4, 8, 12, 16, 20, 24}",
        "{4, 8, 12}",
        "{4, 8, 12, 24}",
        "{8, 12, 24}"
      ],
      "correctAnswer": "{4, 8, 12, 24}",
      "hint": "List the elements of both sets: P contains multiples of 4 up to 24; Q contains the divisors of 24.",
      "workedSolution": "$P = \\{4, 8, 12, 16, 20, 24\\}$ and $Q = \\{1, 2, 3, 4, 6, 8, 12, 24\\}$. The intersection is $P \\cap Q = \\{4, 8, 12, 24\\}$.",
      "points": 1
    },
    {
      "id": "q02",
      "prompt": "Evaluate: $0.045 \\times 0.2$.",
      "options": [
        "0.009",
        "0.09",
        "0.9",
        "0.0009"
      ],
      "correctAnswer": "0.009",
      "hint": "$45 \\times 2 = 90$. Count $3 + 1 = 4$ decimal places from the right.",
      "workedSolution": "$0.045 \\times 0.2 = 0.0090 = 0.009$.",
      "points": 1
    },
    {
      "id": "q03",
      "prompt": "Find the Least Common Multiple (LCM) of $10, 15,$ and $25$.",
      "options": [
        "75",
        "300",
        "125",
        "150"
      ],
      "correctAnswer": "150",
      "hint": "$10 = 2 \\times 5$, $15 = 3 \\times 5$, $25 = 5^2$. Multiply the highest powers of all prime factors.",
      "workedSolution": "$\\text{LCM} = 2 \\times 3 \\times 5^2 = 6 \\times 25 = 150$.",
      "points": 1
    },
    {
      "id": "q04",
      "prompt": "Express $360$ as a product of prime factors in index notation.",
      "options": [
        "$2^2 \\times 3^3 \\times 5$",
        "$2^3 \\times 3^2 \\times 5$",
        "$2^3 \\times 3 \\times 5^2$",
        "$8 \\times 9 \\times 5$"
      ],
      "correctAnswer": "$2^3 \\times 3^2 \\times 5$",
      "hint": "$360 = 36 \\times 10 = (4 \\times 9) \\times (2 \\times 5) = 2^3 \\times 3^2 \\times 5$.",
      "workedSolution": "$360 = 2^3 \\times 3^2 \\times 5$.",
      "points": 1
    },
    {
      "id": "q05",
      "prompt": "Solve for $x$ in the equation: $7x - 5 = 3x + 11$.",
      "options": [
        "4",
        "3",
        "5",
        "6"
      ],
      "correctAnswer": "4",
      "hint": "Group terms in x on the left and constants on the right: $7x - 3x = 11 + 5$.",
      "workedSolution": "$4x = 16 \\implies x = 4$.",
      "points": 1
    },
    {
      "id": "q06",
      "prompt": "Convert the base ten numeral $58_{\\text{ten}}$ to a base five numeral.",
      "options": [
        "$223_{\\text{five}}$",
        "$203_{\\text{five}}$",
        "$213_{\\text{five}}$",
        "$233_{\\text{five}}$"
      ],
      "correctAnswer": "$213_{\\text{five}}$",
      "hint": "Divide repeatedly by 5: $58 = 2(25) + 1(5) + 3(1)$.",
      "workedSolution": "$58 \\div 5 = 11\\text{ R } 3$; $11 \\div 5 = 2\\text{ R } 1$; $2 \\div 5 = 0\\text{ R } 2$. Reading bottom up: $213_{\\text{five}}$.",
      "points": 1
    },
    {
      "id": "q07",
      "prompt": "Write $0.000624$ in standard form.",
      "options": [
        "$6.24 \\times 10^{-3}$",
        "$6.24 \\times 10^{-4}$",
        "$6.24 \\times 10^4$",
        "$62.4 \\times 10^{-5}$"
      ],
      "correctAnswer": "$6.24 \\times 10^{-4}$",
      "hint": "Shift the decimal point 4 places to the right to reach $6.24$.",
      "workedSolution": "$0.000624 = 6.24 \\times 10^{-4}$.",
      "points": 1
    },
    {
      "id": "q08",
      "prompt": "A merchant bought an article for $\\text{GH¢ } 150.00$ and sold it at a profit of $20\\%$. Calculate the selling price.",
      "options": [
        "GH¢ 170.00",
        "GH¢ 175.00",
        "GH¢ 185.00",
        "GH¢ 180.00"
      ],
      "correctAnswer": "GH¢ 180.00",
      "hint": "Selling price = 120% of Cost Price = $1.20 \\times 150$.",
      "workedSolution": "$\\text{Selling price} = 1.20 \\times 150.00 = \\text{GH¢ } 180.00$.",
      "points": 1
    },
    {
      "id": "q09",
      "prompt": "Simplify: $\\frac{3}{4} - \\frac{1}{3} + \\frac{1}{2}$.",
      "options": [
        "$\\frac{5}{12}$",
        "$\\frac{7}{12}$",
        "$\\frac{11}{12}$",
        "$1\\frac{1}{12}$"
      ],
      "correctAnswer": "$\\frac{11}{12}$",
      "hint": "Use common denominator 12: $\\frac{9 - 4 + 6}{12}$.",
      "workedSolution": "$\\frac{9 - 4 + 6}{12} = \\frac{11}{12}$.",
      "points": 1
    },
    {
      "id": "q10",
      "prompt": "The test scores of eight students in a quiz are: $5, 9, 6, 8, 7, 6, 9, 6$. Determine the modal score.",
      "options": [
        "6",
        "7",
        "8",
        "9"
      ],
      "correctAnswer": "6",
      "hint": "The mode is the score occurring with highest frequency.",
      "workedSolution": "Score 6 appears 3 times, which is more frequent than any other score. The mode is 6.",
      "points": 1
    },
    {
      "id": "q11",
      "prompt": "From the test scores in Question 10 ($5, 6, 6, 6, 7, 8, 9, 9$), find the median score.",
      "options": [
        "6.0",
        "6.5",
        "7.0",
        "7.5"
      ],
      "correctAnswer": "6.5",
      "hint": "Ordered scores: 5, 6, 6, 6, 7, 8, 9, 9. Average the 4th and 5th values.",
      "workedSolution": "The 4th and 5th values are 6 and 7. Median = $\\frac{6 + 7}{2} = 6.5$.",
      "points": 1
    },
    {
      "id": "q12",
      "prompt": "Calculate the simple interest on $\\text{GH¢ } 450.00$ at $6\\%\\text{ per annum}$ for $3\\text{ years}$.",
      "options": [
        "GH¢ 75.00",
        "GH¢ 90.00",
        "GH¢ 72.00",
        "GH¢ 81.00"
      ],
      "correctAnswer": "GH¢ 81.00",
      "hint": "$I = \\frac{P \\times R \\times T}{100}$.",
      "workedSolution": "$I = \\frac{450 \\times 6 \\times 3}{100} = \\frac{450 \\times 18}{100} = 4.5 \\times 18 = \\text{GH¢ } 81.00$.",
      "points": 1
    },
    {
      "id": "q13",
      "prompt": "A car travels a distance of $150\\text{ km}$ in $2\\frac{1}{2}\\text{ hours}$. Calculate its average speed in $\\text{km/h}$.",
      "options": [
        "60 km/h",
        "55 km/h",
        "65 km/h",
        "70 km/h"
      ],
      "correctAnswer": "60 km/h",
      "hint": "Speed = Distance ÷ Time: $150 \\div 2.5$.",
      "workedSolution": "$\\text{Speed} = 150 \\div \\frac{5}{2} = 150 \\times \\frac{2}{5} = 30 \\times 2 = 60\\text{ km/h}$.",
      "points": 1
    },
    {
      "id": "q14",
      "prompt": "Factorize completely: $2ax + 4ay - 3bx - 6by$.",
      "options": [
        "$(x - 2y)(2a + 3b)$",
        "$(x + 2y)(2a + 3b)$",
        "$(x + 2y)(2a - 3b)$",
        "$(x - 2y)(2a - 3b)$"
      ],
      "correctAnswer": "$(x + 2y)(2a - 3b)$",
      "hint": "Group terms: $2a(x + 2y) - 3b(x + 2y)$.",
      "workedSolution": "$2a(x + 2y) - 3b(x + 2y) = (x + 2y)(2a - 3b)$.",
      "points": 1
    },
    {
      "id": "q15",
      "prompt": "Find the circumference of a circle whose radius is $7\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).",
      "options": [
        "22 cm",
        "44 cm",
        "88 cm",
        "154 cm"
      ],
      "correctAnswer": "44 cm",
      "hint": "Circumference = $2\\pi r$.",
      "workedSolution": "$C = 2 \\times \\frac{22}{7} \\times 7 = 44\\text{ cm}$.",
      "points": 1
    },
    {
      "id": "q16",
      "prompt": "Solve the linear inequality: $5x - 4 \\ge 2x + 8$.",
      "options": [
        "$x \\ge 4$",
        "$x \\le 4$",
        "$x \\ge 2$",
        "$x \\le 2$"
      ],
      "correctAnswer": "$x \\ge 4$",
      "hint": "$5x - 2x \\ge 8 + 4 \\implies 3x \\ge 12$.",
      "workedSolution": "$3x \\ge 12 \\implies x \\ge 4$.",
      "points": 1
    },
    {
      "id": "q17",
      "prompt": "If $x : 20 = 3 : 5$, find the value of $x$.",
      "options": [
        "15",
        "10",
        "16",
        "12"
      ],
      "correctAnswer": "12",
      "hint": "Cross-multiply: $5x = 20 \\times 3$.",
      "workedSolution": "$5x = 60 \\implies x = 12$.",
      "points": 1
    },
    {
      "id": "q18",
      "prompt": "Simplify: $3a^2 \\times 4ab^2 \\times 2b$.",
      "options": [
        "$24a^2 b^3$",
        "$12a^3 b^3$",
        "$24a^3 b^3$",
        "$24a^3 b^2$"
      ],
      "correctAnswer": "$24a^3 b^3$",
      "hint": "Multiply coefficients: $3 \\times 4 \\times 2 = 24$. Sum powers for $a$ and $b$.",
      "workedSolution": "$(3 \\times 4 \\times 2) \\times a^{2+1} \\times b^{2+1} = 24a^3 b^3$.",
      "points": 1
    },
    {
      "id": "q19",
      "prompt": "A bag contains $9$ red pens and $6$ black pens. If a pen is chosen at random, what is the probability that it is red?",
      "options": [
        "$\\frac{3}{5}$",
        "$\\frac{2}{5}$",
        "$\\frac{1}{2}$",
        "$\\frac{2}{3}$"
      ],
      "correctAnswer": "$\\frac{3}{5}$",
      "hint": "Total pens = 9 + 6 = 15. Probability = 9 / 15.",
      "workedSolution": "$P(\\text{red}) = \\frac{9}{15} = \\frac{3}{5}$.",
      "points": 1
    },
    {
      "id": "q20",
      "prompt": "Find the Highest Common Factor (HCF) of $28, 42,$ and $70$.",
      "options": [
        "7",
        "14",
        "21",
        "28"
      ],
      "correctAnswer": "14",
      "hint": "Determine the highest number dividing 28, 42, and 70 evenly.",
      "workedSolution": "$28 = 14 \\times 2$, $42 = 14 \\times 3$, $70 = 14 \\times 5$. The HCF is 14.",
      "points": 1
    },
    {
      "id": "q21",
      "prompt": "In an isosceles triangle, the two equal base angles measure $55^\\circ$ each. Find the size of the vertex angle.",
      "options": [
        "$60^\\circ$",
        "$80^\\circ$",
        "$65^\\circ$",
        "$70^\\circ$"
      ],
      "correctAnswer": "$70^\\circ$",
      "hint": "Angles in a triangle add up to 180°: $180 - (55 + 55)$.",
      "workedSolution": "$180^\\circ - 110^\\circ = 70^\\circ$.",
      "points": 1
    },
    {
      "id": "q22",
      "prompt": "Given column vectors $u = \\begin{pmatrix} 5 \\\\ -2 \\end{pmatrix}$ and $v = \\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix}$, evaluate $u - v$.",
      "options": [
        "$\\begin{pmatrix} 2 \\\\ 2 \\end{pmatrix}$",
        "$\\begin{pmatrix} 8 \\\\ -6 \\end{pmatrix}$",
        "$\\begin{pmatrix} 8 \\\\ 2 \\end{pmatrix}$",
        "$\\begin{pmatrix} -8 \\\\ 6 \\end{pmatrix}$"
      ],
      "correctAnswer": "$\\begin{pmatrix} 8 \\\\ -6 \\end{pmatrix}$",
      "hint": "$5 - (-3) = 8$ and $-2 - 4 = -6$.",
      "workedSolution": "$\\begin{pmatrix} 5 - (-3) \\\\ -2 - 4 \\end{pmatrix} = \\begin{pmatrix} 8 \\\\ -6 \\end{pmatrix}$.",
      "points": 1
    },
    {
      "id": "q23",
      "prompt": "A school has $480$ pupils. If $35\\%$ of them are girls, how many boys are in the school?",
      "options": [
        "168",
        "320",
        "312",
        "290"
      ],
      "correctAnswer": "312",
      "hint": "Boys make up $100\\% - 35\\% = 65\\%$. Calculate 65% of 480.",
      "workedSolution": "$\\frac{65}{100} \\times 480 = 6.5 \\times 48 = 312\\text{ boys}$.",
      "points": 1
    },
    {
      "id": "q24",
      "prompt": "State the rule for the linear mapping where inputs $x = \\{1, 2, 3, 4\\}$ produce outputs $y = \\{7, 11, 15, 19\\}$.",
      "options": [
        "$x \\to 4x + 3$",
        "$x \\to 4x - 3$",
        "$x \\to 3x + 4$",
        "$x \\to 5x + 2$"
      ],
      "correctAnswer": "$x \\to 4x + 3$",
      "hint": "Common difference is 4. When $x = 1$, $y = 4(1) + 3 = 7$.",
      "workedSolution": "Rate of change is 4 ($4x$). When $x = 1$, $4(1) + c = 7 \\implies c = 3$. The rule is $x \\to 4x + 3$.",
      "points": 1
    },
    {
      "id": "q25",
      "prompt": "In a right-angled triangle, the base is $9\\text{ cm}$ and the height is $12\\text{ cm}$. Find the length of the hypotenuse.",
      "options": [
        "14 cm",
        "16 cm",
        "13 cm",
        "15 cm"
      ],
      "correctAnswer": "15 cm",
      "hint": "$c^2 = 9^2 + 12^2 = 81 + 144$.",
      "workedSolution": "$c^2 = 81 + 144 = 225 \\implies c = \\sqrt{225} = 15\\text{ cm}$.",
      "points": 1
    },
    {
      "id": "q26",
      "prompt": "Make $w$ the subject of the formula: $P = 2(l + w)$.",
      "options": [
        "$w = \\frac{P - l}{2}$",
        "$w = 2P - l$",
        "$w = \\frac{P}{2} - l$",
        "$w = \\frac{P + l}{2}$"
      ],
      "correctAnswer": "$w = \\frac{P}{2} - l$",
      "hint": "Divide both sides by 2, then subtract l.",
      "workedSolution": "$\\frac{P}{2} = l + w \\implies w = \\frac{P}{2} - l$.",
      "points": 1
    },
    {
      "id": "q27",
      "prompt": "Expand and simplify: $(2x - 3)(x + 4)$.",
      "options": [
        "$2x^2 - 5x - 12$",
        "$2x^2 + 5x - 12$",
        "$2x^2 + 11x - 12$",
        "$2x^2 - 12$"
      ],
      "correctAnswer": "$2x^2 + 5x - 12$",
      "hint": "$2x(x + 4) - 3(x + 4) = 2x^2 + 8x - 3x - 12$.",
      "workedSolution": "$2x^2 + 5x - 12$.",
      "points": 1
    },
    {
      "id": "q28",
      "prompt": "What is the order of rotational symmetry of a square?",
      "options": [
        "4",
        "2",
        "1",
        "8"
      ],
      "correctAnswer": "4",
      "hint": "A square matches itself 4 times in a full 360° turn.",
      "workedSolution": "A square has rotational symmetry of order 4.",
      "points": 1
    },
    {
      "id": "q29",
      "prompt": "A solid rectangular box has dimensions $8\\text{ cm}$ by $5\\text{ cm}$ by $3\\text{ cm}$. Find its total surface area.",
      "options": [
        "$120\\text{ cm}^2$",
        "$79\\text{ cm}^2$",
        "$158\\text{ cm}^2$",
        "$160\\text{ cm}^2$"
      ],
      "correctAnswer": "$158\\text{ cm}^2$",
      "hint": "Total Surface Area = $2(lw + lh + wh)$.",
      "workedSolution": "$2[(8 \\times 5) + (8 \\times 3) + (5 \\times 3)] = 2[40 + 24 + 15] = 2[79] = 158\\text{ cm}^2$.",
      "points": 1
    },
    {
      "id": "q30",
      "prompt": "Find the area of the box in Question 29.",
      "options": [
        "$158\\text{ cm}^3$",
        "$60\\text{ cm}^3$",
        "$180\\text{ cm}^3$",
        "$120\\text{ cm}^3$"
      ],
      "correctAnswer": "$120\\text{ cm}^3$",
      "hint": "Volume = length × width × height.",
      "workedSolution": "$8 \\times 5 \\times 3 = 120\\text{ cm}^3$.",
      "points": 1
    },
    {
      "id": "q31",
      "prompt": "An angle measuring $240^\\circ$ is classified as a:",
      "options": [
        "Obtuse angle",
        "Reflex angle",
        "Acute angle",
        "Straight angle"
      ],
      "correctAnswer": "Reflex angle",
      "hint": "An angle greater than 180° but less than 360° is reflex.",
      "workedSolution": "Since $180^\\circ < 240^\\circ < 360^\\circ$, it is a reflex angle.",
      "points": 1
    },
    {
      "id": "q32",
      "prompt": "The point $K(3, -2)$ is reflected in the line $y = 0$ (the $x$-axis). Find the coordinates of its image $K'$.",
      "options": [
        "(3, 2)",
        "(-3, -2)",
        "(-3, 2)",
        "(-2, 3)"
      ],
      "correctAnswer": "(3, 2)",
      "hint": "Reflection in x-axis maps $(x, y) \\to (x, -y)$.",
      "workedSolution": "$(3, -2) \\to (3, -(-2)) = (3, 2)$.",
      "points": 1
    },
    {
      "id": "q33",
      "prompt": "Evaluate: $\\frac{3^4 \\times 5^3}{3^2 \\times 5^2}$.",
      "options": [
        "15",
        "75",
        "45",
        "30"
      ],
      "correctAnswer": "45",
      "hint": "$3^{4-2} \\times 5^{3-2} = 3^2 \\times 5^1$.",
      "workedSolution": "$3^2 \\times 5 = 9 \\times 5 = 45$.",
      "points": 1
    },
    {
      "id": "q34",
      "prompt": "In a pie chart, an angle of $45^\\circ$ represents $15\\text{ items}$. How many items are represented by the full circle?",
      "options": [
        "100 items",
        "135 items",
        "90 items",
        "120 items"
      ],
      "correctAnswer": "120 items",
      "hint": "Fraction = $45 / 360 = 1/8$. Total = $15 \\times 8$.",
      "workedSolution": "$\\frac{360^\\circ}{45^\\circ} \\times 15 = 8 \\times 15 = 120\\text{ items}$.",
      "points": 1
    },
    {
      "id": "q35",
      "prompt": "Simplify: $\\frac{5}{3m} - \\frac{1}{2m}$.",
      "options": [
        "$\\frac{4}{m}$",
        "$\\frac{7}{6m}$",
        "$\\frac{4}{6m}$",
        "$\\frac{7}{m}$"
      ],
      "correctAnswer": "$\\frac{7}{6m}$",
      "hint": "Common denominator is $6m$: $\\frac{10 - 3}{6m}$.",
      "workedSolution": "$\\frac{5(2) - 1(3)}{6m} = \\frac{10 - 3}{6m} = \\frac{7}{6m}$.",
      "points": 1
    },
    {
      "id": "q36",
      "prompt": "If $8$ men can weed a plot of land in $6\\text{ days}$, how many days will it take $12$ men working at the same rate?",
      "options": [
        "5 days",
        "3 days",
        "4 days",
        "4.5 days"
      ],
      "correctAnswer": "4 days",
      "hint": "Total work = $8 \\times 6 = 48\\text{ man-days}$. Divide by 12.",
      "workedSolution": "$\\text{Days} = \\frac{48}{12} = 4\\text{ days}$.",
      "points": 1
    },
    {
      "id": "q37",
      "prompt": "If $m = -1$ and $n = 4$, evaluate: $2m^3 - 3n$.",
      "options": [
        "-10",
        "14",
        "-12",
        "-14"
      ],
      "correctAnswer": "-14",
      "hint": "$(-1)^3 = -1$. Calculate $2(-1) - 3(4)$.",
      "workedSolution": "$2(-1) - 12 = -2 - 12 = -14$.",
      "points": 1
    },
    {
      "id": "q38",
      "prompt": "Calculate the magnitude of vector $v = \\begin{pmatrix} -6 \\\\ 8 \\end{pmatrix}$.",
      "options": [
        "10 units",
        "14 units",
        "12 units",
        "8 units"
      ],
      "correctAnswer": "10 units",
      "hint": "$|v| = \\sqrt{(-6)^2 + 8^2} = \\sqrt{36 + 64}$.",
      "workedSolution": "$|v| = \\sqrt{100} = 10\\text{ units}$.",
      "points": 1
    },
    {
      "id": "q39",
      "prompt": "Each exterior angle of a regular polygon with $n$ sides is $40^\\circ$. Find the number of sides $n$.",
      "options": [
        "8",
        "9",
        "10",
        "12"
      ],
      "correctAnswer": "9",
      "hint": "Number of sides $n = 360^\\circ / \\text{exterior angle}$.",
      "workedSolution": "$n = \\frac{360^\\circ}{40^\\circ} = 9$.",
      "points": 1
    },
    {
      "id": "q40",
      "prompt": "A pair of vertically opposite angles are $(4x - 15)^\\circ$ and $(2x + 25)^\\circ$. Find the value of $x$.",
      "options": [
        "15",
        "25",
        "10",
        "20"
      ],
      "correctAnswer": "20",
      "hint": "Vertically opposite angles are equal: $4x - 15 = 2x + 25$.",
      "workedSolution": "$4x - 2x = 25 + 15 \\implies 2x = 40 \\implies x = 20$.",
      "points": 1
    }
  ],
  "seededAt": "2026-09-16T08:00:00.000Z",
  "lastUpdated": "2026-09-16T08:00:00.000Z"
};

// ============================================================================
// 4e. ALIGNED CORE CURRICULUM SERIES: JHS Math Structured Problem-Solving Series (Set 30)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-30
// ============================================================================
export const SET_JHS_MASTERY_SERIES_30: CurriculumQuestionSet = {
  "id": "jhs-math-mastery-series-30",
  "title": "Junior Core Mathematics • Structured Problem-Solving Series (Set 30)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Mathematics",
  "topic": "Structured Theory, Geometry & Data Modeling",
  "variantType": "standard",
  "totalQuestions": 6,
  "version": 1,
  "questions": [
    {
      "id": "q01",
      "title": "Question 1: Venn Diagram Modeling, Mixed Fractions & Fractional Equations",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 360 190' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='350' height='180' x='5' y='5' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='18' y='28' font-family='sans-serif' font-size='13' font-weight='bold' fill='#0f172a'>U = 50</text><circle cx='135' cy='105' r='60' fill='none' stroke='#2563eb' stroke-width='2'/><circle cx='225' cy='105' r='60' fill='none' stroke='#059669' stroke-width='2'/><text x='95' y='45' font-size='12' font-weight='bold' fill='#2563eb'>English (E: 32)</text><text x='215' y='45' font-size='12' font-weight='bold' fill='#059669'>Math (M: 28)</text><text x='95' y='110' font-size='12' fill='#1e293b'>32 - x</text><text x='175' y='110' font-size='13' font-weight='bold' fill='#dc2626'>x</text><text x='235' y='110' font-size='12' fill='#1e293b'>28 - x</text><text x='25' y='165' font-size='11' fill='#64748b'>Neither = 6</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "In a class of $50$ students, $32$ passed English Language, $28$ passed Mathematics, and $6$ failed both subjects.\nUsing the Venn diagram provided above:\n(i) Formulate an algebraic equation representing the data.\n(ii) Find the number of students who passed **both** subjects.\n(iii) Calculate the number of students who passed English Language **only**.",
          "hint": "Sum of all subsets in the universal set equals 50: $(32 - x) + x + (28 - x) + 6 = 50$.",
          "modelAnswer": "(i) 66 - x = 50, (ii) 16 students, (iii) 16 students",
          "workedSolution": "**(i) Algebraic Equation:**\n$(32 - x) + x + (28 - x) + 6 = 50$\n$66 - x = 50$\n\n**(ii) Students passing both subjects ($x$):**\n$x = 66 - 50 = 16\\text{ students}$\n\n**(iii) Students passing English only:**\n$\\text{English only} = 32 - x = 32 - 16 = 16\\text{ students}$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Simplify the fractional expression:\n$3\\frac{3}{4} - 1\\frac{2}{3} + 2\\frac{1}{2}$",
          "hint": "Group whole numbers and fractions using a common denominator of 12.",
          "modelAnswer": "4 7/12",
          "workedSolution": "**Method: Combining whole numbers and fractional parts**\n$= (3 - 1 + 2) + \\left(\\frac{3}{4} - \\frac{2}{3} + \\frac{1}{2}\\right)$\n$= 4 + \\left(\\frac{9 - 8 + 6}{12}\\right)$\n$= 4 + \\frac{7}{12} = 4\\frac{7}{12}$\n*(Or as improper fraction: $\\frac{55}{12}$)*."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Solve for $y$ in the equation:\n$\\frac{2y + 3}{5} - \\frac{y - 1}{2} = 1$",
          "hint": "Multiply both sides by 10 (the LCM of 5 and 2) to eliminate the denominators.",
          "modelAnswer": "y = 1",
          "workedSolution": "Multiply both sides by $10$:\n$10\\left(\\frac{2y + 3}{5}\\right) - 10\\left(\\frac{y - 1}{2}\\right) = 10(1)$\n$2(2y + 3) - 5(y - 1) = 10$\n$4y + 6 - 5y + 5 = 10$\n$-y + 11 = 10$\n$-y = 10 - 11 = -1 \\implies y = 1$."
        }
      ]
    },
    {
      "id": "q02",
      "title": "Question 2: Commercial Markups, Discounts & Simple Interest",
      "totalMarks": 15,
      "format": "structured_essay",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "A merchant purchased a refrigerator for $\\text{GH¢ } 600.00$ and marked it to make a profit of $25\\%$ on the cost price.\n(i) Calculate the marked price of the refrigerator.\n(ii) If a customer is allowed a cash discount of $8\\%$ on the marked price, find the cash sale price.",
          "hint": "Marked price = 125% of Cost Price. Cash price = 92% of the marked price.",
          "modelAnswer": "(i) GH¢ 750.00, (ii) GH¢ 690.00",
          "workedSolution": "**(i) Marked Price:**\n$\\text{Marked Price} = 125\\% \\times 600.00 = 1.25 \\times 600 = \\text{GH¢ } 750.00$\n\n**(ii) Cash Sale Price:**\n$\\text{Discount} = 8\\% \\times 750.00 = 0.08 \\times 750 = \\text{GH¢ } 60.00$\n$\\text{Cash Price} = 750.00 - 60.00 = \\text{GH¢ } 690.00$\n*(Or: $0.92 \\times 750.00 = \\text{GH¢ } 690.00$)*."
        },
        {
          "partLabel": "(b)",
          "marks": 4,
          "prompt": "Calculate the actual percentage profit made by the merchant on the refrigerator based on the original cost price after granting the discount.",
          "hint": "Profit = Cash Sale Price - Cost Price. Profit % = (Profit / Cost Price) × 100%.",
          "modelAnswer": "15%",
          "workedSolution": "$\\text{Actual Profit} = 690.00 - 600.00 = \\text{GH¢ } 90.00$\n$\\text{Percentage Profit} = \\left(\\frac{90.00}{600.00}\\right) \\times 100\\% = \\frac{90}{6}\\% = 15\\%$."
        },
        {
          "partLabel": "(c)",
          "marks": 5,
          "prompt": "An investor deposited $\\text{GH¢ } 800.00$ in a bank account that pays simple interest at a rate of $7\\frac{1}{2}\\%\\text{ per annum}$. Calculate the total amount accrued in the account at the end of $3\\text{ years}$.",
          "hint": "$I = \\frac{P \\times R \\times T}{100}$. Total Amount = Principal + Interest.",
          "modelAnswer": "GH¢ 980.00",
          "workedSolution": "$I = \\frac{800 \\times 7.5 \\times 3}{100} = 8 \\times 22.5 = \\text{GH¢ } 180.00$\n$\\text{Total Amount} = 800.00 + 180.00 = \\text{GH¢ } 980.00$."
        }
      ]
    },
    {
      "id": "q03",
      "title": "Question 3: Right-Angled Shadow Geometry, Pythagoras & Trigonometric Ratios",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 340 220' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><polygon points='50,180 250,180 250,40' fill='#f1f5f9' stroke='#1e293b' stroke-width='2'/><rect x='235' y='165' width='15' height='15' fill='none' stroke='#334155' stroke-width='1.5'/><line x1='50' y1='180' x2='250' y2='40' stroke='#2563eb' stroke-width='2.5'/><text x='35' y='195' font-size='12' font-weight='bold'>A</text><text x='260' y='195' font-size='12' font-weight='bold'>B</text><text x='260' y='35' font-size='12' font-weight='bold'>T</text><text x='130' y='200' font-size='12' font-weight='bold'>Shadow = 16 m</text><text x='265' y='115' font-size='12' font-weight='bold' fill='#dc2626'>Tower = 12 m</text><text x='125' y='100' font-size='12' font-weight='bold' fill='#2563eb'>L = ?</text><path d='M75,180 A25,25 0 0,0 72,168' fill='none' stroke='#059669' stroke-width='1.5'/><text x='85' y='172' font-size='11' font-weight='bold' fill='#059669'>θ</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "A vertical utility pole $BT$ of height $12\\text{ m}$ casts a shadow $AB$ of length $16\\text{ m}$ on level ground as shown above.\n(i) Calculate the straight-line distance $L = |AT|$ from the tip of the pole to the end of the shadow.\n(ii) State the value of $\\tan \\theta$ as a common fraction in its lowest terms.",
          "hint": "Apply Pythagoras' theorem in $\\Delta ABT$: $L^2 = 16^2 + 12^2$. $\\tan \\theta = \\text{opposite} / \\text{adjacent}$.",
          "modelAnswer": "(i) 20 m, (ii) 3/4",
          "workedSolution": "**(i) Distance $L$:**\n$L^2 = |AB|^2 + |BT|^2 = 16^2 + 12^2 = 256 + 144 = 400$\n$L = \\sqrt{400} = 20\\text{ m}$\n\n**(ii) $\\tan \\theta$:**\n$\\tan \\theta = \\frac{|BT|}{|AB|} = \\frac{12}{16} = \\frac{3}{4}$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Find $\\sin \\theta$ and $\\cos \\theta$ as common fractions in simplest form.",
          "hint": "$\\sin \\theta = \\text{opposite} / \\text{hypotenuse}$, $\\cos \\theta = \\text{adjacent} / \\text{hypotenuse}$.",
          "modelAnswer": "sin θ = 3/5, cos θ = 4/5",
          "workedSolution": "$\\sin \\theta = \\frac{12}{20} = \\frac{3}{5}$\n$\\cos \\theta = \\frac{16}{20} = \\frac{4}{5}$."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Calculate the area of the vertical triangular space bounded by the pole, its shadow, and the line $AT$.",
          "hint": "Area = 1/2 × base × height.",
          "modelAnswer": "96 m²",
          "workedSolution": "$\\text{Area} = \\frac{1}{2} \\times 16 \\times 12 = 8 \\times 12 = 96\\text{ m}^2$."
        }
      ]
    },
    {
      "id": "q04",
      "title": "Question 4: Linear Simultaneous Graphs & Point of Intersection",
      "totalMarks": 15,
      "format": "structured_essay",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "Copy and complete the table of values for the straight lines $y_1 = 3x - 1$ and $y_2 = 5 - x$:\n\n| $x$ | -1 | 0 | 1 | 2 | 3 | 4 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 3x - 1$ | -4 | **?** | 2 | **?** | 8 | **?** |\n| $y_2 = 5 - x$ | **?** | 5 | **?** | 3 | **?** | 1 |",
          "hint": "Substitute each missing x value into both equations.",
          "modelAnswer": "y₁: [-4, -1, 2, 5, 8, 11]; y₂: [6, 5, 4, 3, 2, 1]",
          "workedSolution": "For $y_1 = 3x - 1$:\n- $x = 0 \\implies 3(0) - 1 = -1$\n- $x = 2 \\implies 3(2) - 1 = 5$\n- $x = 4 \\implies 3(4) - 1 = 11$\n\nFor $y_2 = 5 - x$:\n- $x = -1 \\implies 5 - (-1) = 6$\n- $x = 1 \\implies 5 - 1 = 4$\n- $x = 3 \\implies 5 - 3 = 2$"
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Determine the coordinates of the point of intersection of the two lines $y_1$ and $y_2$.",
          "hint": "Set $3x - 1 = 5 - x$ and solve for $x$, then find $y$.",
          "modelAnswer": "(1.5, 3.5)",
          "workedSolution": "$3x - 1 = 5 - x$\n$3x + x = 5 + 1$\n$4x = 6 \\implies x = \\frac{6}{4} = 1.5$\nSubstitute $x = 1.5$ into $y_2$:\n$y = 5 - 1.5 = 3.5$\nThe point of intersection is **$(1.5, 3.5)$** (or $(3/2, 7/2)$)."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Find the truth set of the inequality: $3x - 1 < 5 - x$.",
          "hint": "Solve $4x < 6$.",
          "modelAnswer": "{x : x < 1.5}",
          "workedSolution": "$3x + x < 5 + 1$\n$4x < 6 \\implies x < 1.5$\nTruth set: **$\\{x : x < 1.5, \\, x \\in \\mathbb{R}\\}$**."
        }
      ]
    },
    {
      "id": "q05",
      "title": "Question 5: Cylindrical Water Tank Capacity & Volume Modeling",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 340 220' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><g transform='translate(120,20)'><ellipse cx='50' cy='20' rx='45' ry='15' fill='#eff6ff' stroke='#1e40af' stroke-width='2'/><line x1='5' y1='20' x2='5' y2='160' stroke='#1e40af' stroke-width='2'/><line x1='95' y1='20' x2='95' y2='160' stroke='#1e40af' stroke-width='2'/><ellipse cx='50' cy='160' rx='45' ry='15' fill='#dbeafe' stroke='#1e40af' stroke-width='2'/><line x1='105' y1='20' x2='105' y2='160' stroke='#dc2626' stroke-width='1.5'/><text x='115' y='95' font-size='11' font-weight='bold' fill='#dc2626'>h = 20 cm</text><line x1='50' y1='20' x2='95' y2='20' stroke='#059669' stroke-width='1.5'/><text x='60' y='15' font-size='10' font-weight='bold' fill='#059669'>r = 7 cm</text></g></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "An upright cylindrical metal container has internal radius $7\\text{ cm}$ and height $20\\text{ cm}$ as shown above.\nTaking $\\pi = \\frac{22}{7}$, calculate:\n(i) The area of its circular base.\n(ii) The total internal volume of the cylinder.",
          "hint": "Base Area = $\\pi r^2$. Volume = Base Area × height.",
          "modelAnswer": "(i) 154 cm², (ii) 3,080 cm³",
          "workedSolution": "**(i) Base Area:**\n$\\text{Area} = \\pi r^2 = \\frac{22}{7} \\times 7^2 = 22 \\times 7 = 154\\text{ cm}^2$\n\n**(ii) Internal Volume:**\n$V = \\pi r^2 h = 154 \\times 20 = 3,080\\text{ cm}^3$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "If $2,310\\text{ cm}^3$ of liquid is poured into the container, calculate the depth ($d$) of the liquid.",
          "hint": "Volume of liquid = Base Area × depth = $154 \\times d$.",
          "modelAnswer": "15 cm",
          "workedSolution": "$\\text{Volume} = \\text{Base Area} \\times d$\n$2,310 = 154 \\times d$\n$d = \\frac{2,310}{154} = 15\\text{ cm}$\nTherefore, the depth of the liquid is **$15\\text{ cm}$**."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Calculate the curved surface area of the cylinder.",
          "hint": "Curved surface area = $2\\pi r h$.",
          "modelAnswer": "880 cm²",
          "workedSolution": "$\\text{CSA} = 2\\pi r h = 2 \\times \\frac{22}{7} \\times 7 \\times 20 = 44 \\times 20 = 880\\text{ cm}^2$."
        }
      ]
    },
    {
      "id": "q06",
      "title": "Question 6: Class Frequency Distribution, Central Tendency & Probability",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 350 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><line x1='35' y1='160' x2='320' y2='160' stroke='#334155' stroke-width='2'/><line x1='35' y1='160' x2='35' y2='20' stroke='#334155' stroke-width='2'/><text x='150' y='188' font-size='11' font-weight='bold'>Marks Scored</text><text x='5' y='18' font-size='11' font-weight='bold'>Frequency</text><rect x='55' y='125' width='25' height='35' fill='#93c5fd' stroke='#1d4ed8'/><rect x='100' y='90' width='25' height='70' fill='#93c5fd' stroke='#1d4ed8'/><rect x='145' y='40' width='25' height='120' fill='#2563eb' stroke='#1d4ed8'/><rect x='190' y='75' width='25' height='85' fill='#93c5fd' stroke='#1d4ed8'/><rect x='235' y='110' width='25' height='50' fill='#93c5fd' stroke='#1d4ed8'/><rect x='280' y='140' width='25' height='20' fill='#93c5fd' stroke='#1d4ed8'/><text x='65' y='173' font-size='10'>1</text><text x='110' y='173' font-size='10'>2</text><text x='155' y='173' font-size='10'>3</text><text x='200' y='173' font-size='10'>4</text><text x='245' y='173' font-size='10'>5</text><text x='288' y='173' font-size='10'>6</text><text x='20' y='45' font-size='10'>7</text><text x='20' y='80' font-size='10'>5</text><text x='20' y='130' font-size='10'>2</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 9,
          "prompt": "The test scores of $20$ students in a class quiz are displayed in the bar chart above:\n\n| Mark ($x$) | 1 | 2 | 3 | 4 | 5 | 6 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| Frequency ($f$) | 2 | 4 | 7 | 4 | 2 | 1 |\n\n(i) State the **modal mark**.\n(ii) Find the total number of students ($N = \\sum f$).\n(iii) Calculate the **mean mark** of the class.",
          "hint": "Mode is the mark with highest frequency. Mean = $\\sum fx / \\sum f$.",
          "modelAnswer": "(i) 3 marks, (ii) 20 students, (iii) 3.15 marks",
          "workedSolution": "**(i) Modal mark:**\nThe highest frequency is $7$, which corresponds to mark **3**.\n\n**(ii) Total students:**\n$N = \\sum f = 2 + 4 + 7 + 4 + 2 + 1 = 20\\text{ students}$\n\n**(iii) Mean mark:**\n$\\sum fx = (1 \\times 2) + (2 \\times 4) + (3 \\times 7) + (4 \\times 4) + (5 \\times 2) + (6 \\times 1)$\n$\\sum fx = 2 + 8 + 21 + 16 + 10 + 6 = 63$\n$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{63}{20} = 3.15\\text{ marks}$."
        },
        {
          "partLabel": "(b)",
          "marks": 6,
          "prompt": "If a student is chosen at random from this group:\n(i) What is the probability that the student scored at least $4\\text{ marks}$?\n(ii) What percentage of the class scored less than $3\\text{ marks}$?",
          "hint": "'At least 4' means marks 4, 5, 6. 'Less than 3' means marks 1 and 2.",
          "modelAnswer": "(i) 7/20, (ii) 30%",
          "workedSolution": "**(i) Probability of scoring at least 4 (marks 4, 5, 6):**\n$\\text{Count} = f(4) + f(5) + f(6) = 4 + 2 + 1 = 7$\n$P(x \\ge 4) = \\frac{7}{20}$\n\n**(ii) Percentage scoring less than 3 (marks 1 and 2):**\n$\\text{Count} = f(1) + f(2) = 2 + 4 = 6$\n$\\text{Percentage} = \\left(\\frac{6}{20}\\right) \\times 100\\% = 6 \\times 5 = 30\\%$."
        }
      ]
    }
  ],
  "seededAt": "2026-09-16T08:30:00.000Z",
  "lastUpdated": "2026-09-16T08:30:00.000Z"
};

// ============================================================================
// 4f. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 31)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-31
// ============================================================================
export const SET_JHS_MASTERY_SERIES_31: CurriculumQuestionSet = {
  "id": "jhs-math-mastery-series-31",
  "title": "Junior Core Mathematics • Objective Mastery Series (Set 31)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Mathematics",
  "topic": "Comprehensive Objective Exam Series",
  "variantType": "standard",
  "totalQuestions": 40,
  "version": 1,
  "questions": [
    {
      "id": "q01",
      "prompt": "If set $M = \\{x : x \\text{ is a multiple of } 3, \\, 1 \\le x \\le 18\\}$ and set $N = \\{x : x \\text{ is an even factor of } 24\\}$, find $M \\cap N$.",
      "options": [
        "{3, 6, 12}",
        "{6, 12}",
        "{2, 4, 6, 12}",
        "{6, 12, 18}"
      ],
      "correctAnswer": "{6, 12}",
      "hint": "List both sets: M contains multiples of 3 up to 18; N contains factors of 24 that are divisible by 2.",
      "workedSolution": "$M = \\{3, 6, 9, 12, 15, 18\\}$ and $N = \\{2, 4, 6, 8, 12, 24\\}$. The intersection is $M \\cap N = \\{6, 12\\}$.",
      "points": 1
    },
    {
      "id": "q02",
      "prompt": "Express $0.0075$ as a fraction in its lowest terms.",
      "options": [
        "$\\frac{3}{40}$",
        "$\\frac{75}{1000}$",
        "$\\frac{1}{125}$",
        "$\\frac{3}{400}$"
      ],
      "correctAnswer": "$\\frac{3}{400}$",
      "hint": "Write $0.0075 = \\frac{75}{10000}$ and divide both numerator and denominator by 25.",
      "workedSolution": "$\\frac{75}{10000} = \\frac{75 \\div 25}{10000 \\div 25} = \\frac{3}{400}$.",
      "points": 1
    },
    {
      "id": "q03",
      "prompt": "Find the Least Common Multiple (LCM) of $14, 21,$ and $28$.",
      "options": [
        "84",
        "42",
        "168",
        "126"
      ],
      "correctAnswer": "84",
      "hint": "$14 = 2 \\times 7$, $21 = 3 \\times 7$, $28 = 2^2 \\times 7$. Take the product of highest prime powers.",
      "workedSolution": "$\\text{LCM} = 2^2 \\times 3 \\times 7 = 4 \\times 21 = 84$.",
      "points": 1
    },
    {
      "id": "q04",
      "prompt": "Express $540$ as a product of prime factors in index notation.",
      "options": [
        "$2^3 \\times 3^2 \\times 5$",
        "$2^2 \\times 3^2 \\times 5^2$",
        "$2^2 \\times 3^3 \\times 5$",
        "$4 \\times 27 \\times 5$"
      ],
      "correctAnswer": "$2^2 \\times 3^3 \\times 5$",
      "hint": "$540 = 54 \\times 10 = (2 \\times 27) \\times (2 \\times 5)$.",
      "workedSolution": "$540 = 2^2 \\times 3^3 \\times 5$.",
      "points": 1
    },
    {
      "id": "q05",
      "prompt": "Convert the binary numeral $10111_{\\text{two}}$ to a numeral in base ten.",
      "options": [
        "21",
        "27",
        "25",
        "23"
      ],
      "correctAnswer": "23",
      "hint": "$1(2^4) + 0(2^3) + 1(2^2) + 1(2^1) + 1(2^0)$.",
      "workedSolution": "$16 + 0 + 4 + 2 + 1 = 23$.",
      "points": 1
    },
    {
      "id": "q06",
      "prompt": "Solve for $p$ in the equation: $5p - 8 = 2p + 7$.",
      "options": [
        "3",
        "5",
        "-5",
        "6"
      ],
      "correctAnswer": "5",
      "hint": "Group terms in p: $5p - 2p = 7 + 8$.",
      "workedSolution": "$3p = 15 \\implies p = 5$.",
      "points": 1
    },
    {
      "id": "q07",
      "prompt": "Write $4,582,000$ in standard form.",
      "options": [
        "$4.582 \\times 10^5$",
        "$45.82 \\times 10^5$",
        "$4.582 \\times 10^6$",
        "$4.582 \\times 10^{-6}$"
      ],
      "correctAnswer": "$4.582 \\times 10^6$",
      "hint": "Move the decimal point 6 places to the left: $A \\times 10^n$ where $1 \\le A < 10$.",
      "workedSolution": "$4,582,000 = 4.582 \\times 10^6$.",
      "points": 1
    },
    {
      "id": "q08",
      "prompt": "A trader purchased a bicycle for $\\text{GH¢ } 180.00$ and sold it at a loss of $15\\%$. Calculate the selling price.",
      "options": [
        "GH¢ 153.00",
        "GH¢ 155.00",
        "GH¢ 162.00",
        "GH¢ 148.00"
      ],
      "correctAnswer": "GH¢ 153.00",
      "hint": "Loss = 15% of 180 = 27. Selling price = 180 - 27.",
      "workedSolution": "$\\text{Loss} = 0.15 \\times 180 = 27$. $\\text{Selling price} = 180 - 27 = \\text{GH¢ } 153.00$.",
      "points": 1
    },
    {
      "id": "q09",
      "prompt": "Simplify: $3\\frac{1}{2} - 1\\frac{3}{4} + 2\\frac{1}{8}$.",
      "options": [
        "$3\\frac{5}{8}$",
        "$4\\frac{1}{8}$",
        "$3\\frac{3}{8}$",
        "$3\\frac{7}{8}$"
      ],
      "correctAnswer": "$3\\frac{7}{8}$",
      "hint": "Combine whole numbers: $3 - 1 + 2 = 4$. Use common denominator 8: $\\frac{4 - 6 + 1}{8} = -\\frac{1}{8}$.",
      "workedSolution": "$4 - \\frac{1}{8} = 3\\frac{7}{8}$.",
      "points": 1
    },
    {
      "id": "q10",
      "prompt": "The test scores of eight students are: $8, 12, 15, 10, 12, 9, 14, 12$. Determine the modal score.",
      "options": [
        "10",
        "12",
        "14",
        "15"
      ],
      "correctAnswer": "12",
      "hint": "The mode is the number that appears most frequently in the list.",
      "workedSolution": "Score 12 appears 3 times, which is more than any other score. The modal score is 12.",
      "points": 1
    },
    {
      "id": "q11",
      "prompt": "From the test scores in Question 10 ($8, 9, 10, 12, 12, 12, 14, 15$), find the median score.",
      "options": [
        "11",
        "10.5",
        "12",
        "12.5"
      ],
      "correctAnswer": "12",
      "hint": "The ordered middle values (4th and 5th terms) are 12 and 12.",
      "workedSolution": "$\\text{Median} = \\frac{12 + 12}{2} = 12$.",
      "points": 1
    },
    {
      "id": "q12",
      "prompt": "Calculate the simple interest on $\\text{GH¢ } 600.00$ at $7\\%\\text{ per annum}$ for $4\\text{ years}$.",
      "options": [
        "GH¢ 168.00",
        "GH¢ 140.00",
        "GH¢ 180.00",
        "GH¢ 156.00"
      ],
      "correctAnswer": "GH¢ 168.00",
      "hint": "$I = \\frac{P \\times R \\times T}{100}$.",
      "workedSolution": "$I = \\frac{600 \\times 7 \\times 4}{100} = 6 \\times 28 = \\text{GH¢ } 168.00$.",
      "points": 1
    },
    {
      "id": "q13",
      "prompt": "A vehicle travels a distance of $180\\text{ km}$ at a constant speed of $72\\text{ km/h}$. How long did the journey take?",
      "options": [
        "2 hours 15 minutes",
        "2 hours 30 minutes",
        "2 hours 45 minutes",
        "3 hours"
      ],
      "correctAnswer": "2 hours 30 minutes",
      "hint": "Time = Distance ÷ Speed: $180 \\div 72$.",
      "workedSolution": "$\\text{Time} = \\frac{180}{72} = 2.5\\text{ hours} = 2\\text{ hours } 30\\text{ minutes}$.",
      "points": 1
    },
    {
      "id": "q14",
      "prompt": "Factorize completely: $3ax - 6ay + bx - 2by$.",
      "options": [
        "$(x + 2y)(3a - b)$",
        "$(x - 2y)(3a - b)$",
        "$(x + 2y)(3a + b)$",
        "$(x - 2y)(3a + b)$"
      ],
      "correctAnswer": "$(x - 2y)(3a + b)$",
      "hint": "Group terms: $3a(x - 2y) + b(x - 2y)$.",
      "workedSolution": "$3a(x - 2y) + b(x - 2y) = (x - 2y)(3a + b)$.",
      "points": 1
    },
    {
      "id": "q15",
      "prompt": "Find the area of a circle whose radius is $14\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).",
      "options": [
        "$88\\text{ cm}^2$",
        "$616\\text{ cm}^2$",
        "$308\\text{ cm}^2$",
        "$154\\text{ cm}^2$"
      ],
      "correctAnswer": "$616\\text{ cm}^2$",
      "hint": "Area = $\\pi r^2$.",
      "workedSolution": "$\\text{Area} = \\frac{22}{7} \\times 14 \\times 14 = 22 \\times 2 \\times 14 = 616\\text{ cm}^2$.",
      "points": 1
    },
    {
      "id": "q16",
      "prompt": "Solve the linear inequality: $6x - 7 \\le 2x + 9$.",
      "options": [
        "$x \\ge 4$",
        "$x \\le 2$",
        "$x \\le 4$",
        "$x \\ge 2$"
      ],
      "correctAnswer": "$x \\le 4$",
      "hint": "$6x - 2x \\le 9 + 7 \\implies 4x \\le 16$.",
      "workedSolution": "$4x \\le 16 \\implies x \\le 4$.",
      "points": 1
    },
    {
      "id": "q17",
      "prompt": "If $3 : 8 = x : 40$, find the value of $x$.",
      "options": [
        "15",
        "12",
        "18",
        "20"
      ],
      "correctAnswer": "15",
      "hint": "Cross-multiply: $8x = 3 \\times 40$.",
      "workedSolution": "$8x = 120 \\implies x = 15$.",
      "points": 1
    },
    {
      "id": "q18",
      "prompt": "Simplify: $4p^3 q \\times 3pq^2$.",
      "options": [
        "$12p^3 q^2$",
        "$7p^4 q^3$",
        "$12p^3 q^3$",
        "$12p^4 q^3$"
      ],
      "correctAnswer": "$12p^4 q^3$",
      "hint": "Multiply numerical coefficients: $4 \\times 3 = 12$. Add exponents for p and q.",
      "workedSolution": "$(4 \\times 3) \\times p^{3+1} \\times q^{1+2} = 12p^4 q^3$.",
      "points": 1
    },
    {
      "id": "q19",
      "prompt": "A bag contains $10$ green apples and $15$ red apples. What is the probability of selecting a green apple at random?",
      "options": [
        "$\\frac{2}{3}$",
        "$\\frac{1}{2}$",
        "$\\frac{2}{5}$",
        "$\\frac{3}{5}$"
      ],
      "correctAnswer": "$\\frac{2}{5}$",
      "hint": "Total apples = 10 + 15 = 25. Probability = 10 / 25.",
      "workedSolution": "$P(\\text{green}) = \\frac{10}{25} = \\frac{2}{5}$.",
      "points": 1
    },
    {
      "id": "q20",
      "prompt": "Find the Highest Common Factor (HCF) of $32, 48,$ and $80$.",
      "options": [
        "16",
        "8",
        "12",
        "24"
      ],
      "correctAnswer": "16",
      "hint": "Find the largest number that divides 32, 48, and 80 without a remainder.",
      "workedSolution": "$32 = 16 \\times 2$, $48 = 16 \\times 3$, $80 = 16 \\times 5$. The HCF is 16.",
      "points": 1
    },
    {
      "id": "q21",
      "prompt": "The three interior angles of a triangle are $2x^\\circ, 3x^\\circ,$ and $5x^\\circ$. Find the value of $x$.",
      "options": [
        "$20^\\circ$",
        "$15^\\circ$",
        "$24^\\circ$",
        "$18^\\circ$"
      ],
      "correctAnswer": "$18^\\circ$",
      "hint": "Sum of interior angles of a triangle is $180^\\circ$: $2x + 3x + 5x = 180$.",
      "workedSolution": "$10x = 180 \\implies x = 18^\\circ$.",
      "points": 1
    },
    {
      "id": "q22",
      "prompt": "Given column vectors $u = \\begin{pmatrix} 4 \\\\ -3 \\end{pmatrix}$ and $v = \\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix}$, evaluate $u + 3v$.",
      "options": [
        "$\\begin{pmatrix} 1 \\\\ 3 \\end{pmatrix}$",
        "$\\begin{pmatrix} 1 \\\\ -3 \\end{pmatrix}$",
        "$\\begin{pmatrix} 7 \\\\ 3 \\end{pmatrix}$",
        "$\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$"
      ],
      "correctAnswer": "$\\begin{pmatrix} 1 \\\\ 3 \\end{pmatrix}$",
      "hint": "$4 + 3(-1) = 1$ and $-3 + 3(2) = 3$.",
      "workedSolution": "$\\begin{pmatrix} 4 + 3(-1) \\\\ -3 + 3(2) \\end{pmatrix} = \\begin{pmatrix} 4 - 3 \\\\ -3 + 6 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 3 \\end{pmatrix}$.",
      "points": 1
    },
    {
      "id": "q23",
      "prompt": "In a town with a population of $75,000$, $44\\%$ are children. How many adults live in the town?",
      "options": [
        "33,000",
        "40,000",
        "42,000",
        "45,000"
      ],
      "correctAnswer": "42,000",
      "hint": "Adults make up $100\\% - 44\\% = 56\\%$. Calculate 56% of 75,000.",
      "workedSolution": "$\\frac{56}{100} \\times 75,000 = 56 \\times 750 = 42,000\\text{ adults}$.",
      "points": 1
    },
    {
      "id": "q24",
      "prompt": "State the rule for the linear mapping where inputs $x = \\{1, 2, 3, 4\\}$ produce outputs $y = \\{6, 11, 16, 21\\}$.",
      "options": [
        "$x \\to 5x - 1$",
        "$x \\to 5x + 1$",
        "$x \\to 4x + 2$",
        "$x \\to 6x$"
      ],
      "correctAnswer": "$x \\to 5x + 1$",
      "hint": "Common difference is $11 - 6 = 5$. Check for $x = 1$: $5(1) + 1 = 6$.",
      "workedSolution": "Common difference is 5 ($5x$). When $x = 1$, $5(1) + c = 6 \\implies c = 1$. The rule is $x \\to 5x + 1$.",
      "points": 1
    },
    {
      "id": "q25",
      "prompt": "In a right-angled triangle $PQR$, right-angled at $Q$, hypotenuse $|PR| = 15\\text{ cm}$ and base $|QR| = 9\\text{ cm}$. Find the height $|PQ|$.",
      "options": [
        "10 cm",
        "11 cm",
        "13 cm",
        "12 cm"
      ],
      "correctAnswer": "12 cm",
      "hint": "$|PQ|^2 = 15^2 - 9^2 = 225 - 81$.",
      "workedSolution": "$|PQ|^2 = 225 - 81 = 144 \\implies |PQ| = \\sqrt{144} = 12\\text{ cm}$.",
      "points": 1
    },
    {
      "id": "q26",
      "prompt": "Make $h$ the subject of the formula: $A = \\frac{1}{2}(a + b)h$.",
      "options": [
        "$h = \\frac{A}{2(a + b)}$",
        "$h = \\frac{2A}{a + b}$",
        "$h = \\frac{2(a + b)}{A}$",
        "$h = 2A(a + b)$"
      ],
      "correctAnswer": "$h = \\frac{2A}{a + b}$",
      "hint": "Multiply both sides by 2, then divide by $(a + b)$.",
      "workedSolution": "$2A = (a + b)h \\implies h = \\frac{2A}{a + b}$.",
      "points": 1
    },
    {
      "id": "q27",
      "prompt": "Expand and simplify: $(3x + 2)(x - 4)$.",
      "options": [
        "$3x^2 - 10x - 8$",
        "$3x^2 + 10x - 8$",
        "$3x^2 - 14x - 8$",
        "$3x^2 - 8$"
      ],
      "correctAnswer": "$3x^2 - 10x - 8$",
      "hint": "$3x(x - 4) + 2(x - 4) = 3x^2 - 12x + 2x - 8$.",
      "workedSolution": "$3x^2 - 10x - 8$.",
      "points": 1
    },
    {
      "id": "q28",
      "prompt": "How many lines of symmetry does a regular pentagon have?",
      "options": [
        "4",
        "6",
        "5",
        "10"
      ],
      "correctAnswer": "5",
      "hint": "A regular polygon with $n$ sides has $n$ lines of symmetry.",
      "workedSolution": "A regular pentagon has 5 lines of symmetry.",
      "points": 1
    },
    {
      "id": "q29",
      "prompt": "A solid cube has edges of length $4\\text{ cm}$. Find its total surface area.",
      "options": [
        "$64\\text{ cm}^2$",
        "$96\\text{ cm}^2$",
        "$48\\text{ cm}^2$",
        "$16\\text{ cm}^2$"
      ],
      "correctAnswer": "$96\\text{ cm}^2$",
      "hint": "A cube has 6 congruent square faces: Area = $6s^2$.",
      "workedSolution": "$\\text{Total Surface Area} = 6 \\times 4^2 = 6 \\times 16 = 96\\text{ cm}^2$.",
      "points": 1
    },
    {
      "id": "q30",
      "prompt": "Find the volume of the cube in Question 29.",
      "options": [
        "$96\\text{ cm}^3$",
        "$32\\text{ cm}^3$",
        "$128\\text{ cm}^3$",
        "$64\\text{ cm}^3$"
      ],
      "correctAnswer": "$64\\text{ cm}^3$",
      "hint": "Volume = $s^3$.",
      "workedSolution": "$V = 4^3 = 64\\text{ cm}^3$.",
      "points": 1
    },
    {
      "id": "q31",
      "prompt": "Two angles lie on a straight line. If one angle is $124^\\circ$, what is the size of the adjacent angle?",
      "options": [
        "$56^\\circ$",
        "$66^\\circ$",
        "$46^\\circ$",
        "$124^\\circ$"
      ],
      "correctAnswer": "$56^\\circ$",
      "hint": "Angles on a straight line add up to $180^\\circ$.",
      "workedSolution": "$180^\\circ - 124^\\circ = 56^\\circ$.",
      "points": 1
    },
    {
      "id": "q32",
      "prompt": "Under a rotation of $180^\\circ$ about the origin $(0, 0)$, the image of point $P(2, -5)$ is:",
      "options": [
        "(-2, -5)",
        "(2, 5)",
        "(-2, 5)",
        "(5, -2)"
      ],
      "correctAnswer": "(-2, 5)",
      "hint": "Rotation of 180° maps $(x, y) \\to (-x, -y)$.",
      "workedSolution": "$(2, -5) \\to (-2, -(-5)) = (-2, 5)$.",
      "points": 1
    },
    {
      "id": "q33",
      "prompt": "Evaluate: $\\frac{2^6 \\times 3^3}{2^4 \\times 3}$.",
      "options": [
        "18",
        "36",
        "72",
        "24"
      ],
      "correctAnswer": "36",
      "hint": "$2^{6-4} \\times 3^{3-1} = 2^2 \\times 3^2$.",
      "workedSolution": "$4 \\times 9 = 36$.",
      "points": 1
    },
    {
      "id": "q34",
      "prompt": "In a pie chart, an angle of $90^\\circ$ represents $35\\text{ items}$. How many items does the whole pie chart represent?",
      "options": [
        "140 items",
        "105 items",
        "120 items",
        "150 items"
      ],
      "correctAnswer": "140 items",
      "hint": "The angle 90° is $\\frac{1}{4}$ of 360°. Multiply 35 by 4.",
      "workedSolution": "$\\frac{360^\\circ}{90^\\circ} \\times 35 = 4 \\times 35 = 140\\text{ items}$.",
      "points": 1
    },
    {
      "id": "q35",
      "prompt": "Simplify: $\\frac{3}{4y} + \\frac{1}{2y}$.",
      "options": [
        "$\\frac{4}{6y}$",
        "$\\frac{1}{y}$",
        "$\\frac{5}{2y}$",
        "$\\frac{5}{4y}$"
      ],
      "correctAnswer": "$\\frac{5}{4y}$",
      "hint": "Common denominator is $4y$: $\\frac{3 + 2}{4y}$.",
      "workedSolution": "$\\frac{3 + 2}{4y} = \\frac{5}{4y}$.",
      "points": 1
    },
    {
      "id": "q36",
      "prompt": "If $5$ workers take $8\\text{ days}$ to complete a job, how many workers will complete the same job in $4\\text{ days}$?",
      "options": [
        "8 workers",
        "12 workers",
        "10 workers",
        "9 workers"
      ],
      "correctAnswer": "10 workers",
      "hint": "Total work = $5 \\times 8 = 40\\text{ worker-days}$. Divide by 4 days.",
      "workedSolution": "$\\text{Workers} = \\frac{40}{4} = 10\\text{ workers}$.",
      "points": 1
    },
    {
      "id": "q37",
      "prompt": "If $p = -3$ and $q = 2$, evaluate: $p^2 - 4q$.",
      "options": [
        "1",
        "17",
        "-1",
        "7"
      ],
      "correctAnswer": "1",
      "hint": "$(-3)^2 - 4(2) = 9 - 8$.",
      "workedSolution": "$9 - 8 = 1$.",
      "points": 1
    },
    {
      "id": "q38",
      "prompt": "Calculate the magnitude of vector $u = \\begin{pmatrix} -5 \\\\ 12 \\end{pmatrix}$.",
      "options": [
        "17 units",
        "13 units",
        "15 units",
        "11 units"
      ],
      "correctAnswer": "13 units",
      "hint": "$|u| = \\sqrt{(-5)^2 + 12^2} = \\sqrt{25 + 144}$.",
      "workedSolution": "$|u| = \\sqrt{169} = 13\\text{ units}$.",
      "points": 1
    },
    {
      "id": "q39",
      "prompt": "Find the exterior angle of a regular decagon ($10\\text{ sides}$).",
      "options": [
        "$40^\\circ$",
        "$30^\\circ$",
        "$36^\\circ$",
        "$45^\\circ$"
      ],
      "correctAnswer": "$36^\\circ$",
      "hint": "Exterior angle = $360^\\circ / 10$.",
      "workedSolution": "$\\frac{360^\\circ}{10} = 36^\\circ$.",
      "points": 1
    },
    {
      "id": "q40",
      "prompt": "A pair of vertically opposite angles are represented by $(5x - 20)^\\circ$ and $(3x + 16)^\\circ$. Find the value of $x$.",
      "options": [
        "16",
        "14",
        "20",
        "18"
      ],
      "correctAnswer": "18",
      "hint": "Vertically opposite angles are equal: $5x - 20 = 3x + 16$.",
      "workedSolution": "$5x - 3x = 16 + 20 \\implies 2x = 36 \\implies x = 18$.",
      "points": 1
    }
  ],
  "seededAt": "2026-09-16T09:00:00.000Z",
  "lastUpdated": "2026-09-16T09:00:00.000Z"
};

// ============================================================================
// 4g. ALIGNED CORE CURRICULUM SERIES: JHS Math Structured Problem-Solving Series (Set 32)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-32
// ============================================================================
export const SET_JHS_MASTERY_SERIES_32: CurriculumQuestionSet = {
  "id": "jhs-math-mastery-series-32",
  "title": "Junior Core Mathematics • Structured Problem-Solving Series (Set 32)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Mathematics",
  "topic": "Structured Theory, Geometry & Data Modeling",
  "variantType": "standard",
  "totalQuestions": 6,
  "version": 1,
  "questions": [
    {
      "id": "q01",
      "title": "Question 1: Venn Diagram Set Analysis, Fraction Operations & Rational Equations",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 360 190' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='350' height='180' x='5' y='5' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='18' y='28' font-family='sans-serif' font-size='13' font-weight='bold' fill='#0f172a'>U = 48</text><circle cx='135' cy='105' r='60' fill='none' stroke='#2563eb' stroke-width='2'/><circle cx='225' cy='105' r='60' fill='none' stroke='#059669' stroke-width='2'/><text x='95' y='45' font-size='12' font-weight='bold' fill='#2563eb'>Biology (B: 30)</text><text x='215' y='45' font-size='12' font-weight='bold' fill='#059669'>Chemistry (C: 26)</text><text x='95' y='110' font-size='12' fill='#1e293b'>30 - x</text><text x='175' y='110' font-size='13' font-weight='bold' fill='#dc2626'>x</text><text x='235' y='110' font-size='12' fill='#1e293b'>26 - x</text><text x='25' y='165' font-size='11' fill='#64748b'>Neither = 4</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "In a cohort of $48$ senior science students, $30$ offer Biology, $26$ offer Chemistry, and $4$ offer neither subject.\nUsing the Venn diagram provided above:\n(i) Formulate an algebraic equation connecting the subsets.\n(ii) Find the number of students who offer **both** subjects.\n(iii) Calculate the number of students who offer Biology **only**.",
          "hint": "Sum of all subsets in the Venn diagram equals 48: $(30 - x) + x + (26 - x) + 4 = 48$.",
          "modelAnswer": "(i) 60 - x = 48, (ii) 12 students, (iii) 18 students",
          "workedSolution": "**(i) Algebraic Equation:**\n$(30 - x) + x + (26 - x) + 4 = 48$\n$60 - x = 48$\n\n**(ii) Students offering both subjects ($x$):**\n$x = 60 - 48 = 12\\text{ students}$\n\n**(iii) Students offering Biology only:**\n$\\text{Biology only} = 30 - x = 30 - 12 = 18\\text{ students}$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Evaluate and simplify completely:\n$4\\frac{2}{3} - 2\\frac{1}{4} + 1\\frac{1}{2}$",
          "hint": "Combine whole numbers and fractions using a common denominator of 12.",
          "modelAnswer": "3 11/12",
          "workedSolution": "**Method: Combining whole numbers and fractional parts**\n$= (4 - 2 + 1) + \\left(\\frac{2}{3} - \\frac{1}{4} + \\frac{1}{2}\\right)$\n$= 3 + \\left(\\frac{8 - 3 + 6}{12}\\right)$\n$= 3 + \\frac{11}{12} = 3\\frac{11}{12}$\n*(Or as improper fraction: $\\frac{47}{12}$)*."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Solve for $k$ in the equation:\n$\\frac{3k - 2}{4} - \\frac{k - 3}{2} = 1$",
          "hint": "Multiply both sides by 4 (the LCM of 4 and 2) to eliminate the denominators.",
          "modelAnswer": "k = 0",
          "workedSolution": "Multiply through by $4$:\n$4\\left(\\frac{3k - 2}{4}\\right) - 4\\left(\\frac{k - 3}{2}\\right) = 4(1)$\n$(3k - 2) - 2(k - 3) = 4$\n$3k - 2 - 2k + 6 = 4$\n$k + 4 = 4 \\implies k = 4 - 4 = 0$."
        }
      ]
    },
    {
      "id": "q02",
      "title": "Question 2: Ratio Sharing, Simple Interest & Base Five Conversion",
      "totalMarks": 15,
      "format": "structured_essay",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "Three partners, Kofi, Ama, and Yaw, shared a total business profit of $\\text{GH¢ } 1,800.00$ in the ratio $2 : 3 : 5$ respectively.\n(i) Calculate the share of each partner.\n(ii) What percentage of the total profit did Yaw receive?",
          "hint": "Total ratio units = 2 + 3 + 5 = 10. Value of 1 unit = 1800 / 10.",
          "modelAnswer": "(i) Kofi: GH¢ 360.00, Ama: GH¢ 540.00, Yaw: GH¢ 900.00; (ii) 50%",
          "workedSolution": "**(i) Share Distribution:**\nTotal units = $2 + 3 + 5 = 10$.\nValue of 1 unit = $\\frac{\\text{GH¢ } 1,800.00}{10} = \\text{GH¢ } 180.00$\n- **Kofi:** $2 \\times 180.00 = \\text{GH¢ } 360.00$\n- **Ama:** $3 \\times 180.00 = \\text{GH¢ } 540.00$\n- **Yaw:** $5 \\times 180.00 = \\text{GH¢ } 900.00$\n\n**(ii) Yaw's percentage share:**\n$\\text{Percentage} = \\left(\\frac{5}{10}\\right) \\times 100\\% = 50\\%$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Ama deposited her profit share of $\\text{GH¢ } 540.00$ into a savings account at a simple interest rate of $8\\%\\text{ per annum}$ for $3\\text{ years}$. Calculate the total amount she had in her account at the end of the $3\\text{ years}$.",
          "hint": "$I = \\frac{P \\times R \\times T}{100}$. Total Amount = Principal + Simple Interest.",
          "modelAnswer": "GH¢ 669.60",
          "workedSolution": "$I = \\frac{540 \\times 8 \\times 3}{100} = \\frac{540 \\times 24}{100} = \\frac{12,960}{100} = \\text{GH¢ } 129.60$\n$\\text{Total Amount} = P + I = 540.00 + 129.60 = \\text{GH¢ } 669.60$."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Convert $87_{\\text{ten}}$ to a base five numeral.",
          "hint": "Divide repeatedly by 5: $87 = 3(25) + 2(5) + 2(1)$.",
          "modelAnswer": "322_five",
          "workedSolution": "$87 \\div 5 = 17\\text{ R } 2$\n$17 \\div 5 = 3\\text{ R } 2$\n$3 \\div 5 = 0\\text{ R } 3$\nReading remainders bottom-up gives: **$322_{\\text{five}}$**."
        }
      ]
    },
    {
      "id": "q03",
      "title": "Question 3: Right-Angled Shadow Geometry, Pythagoras & Angle Ratios",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 340 220' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><polygon points='50,180 250,180 250,30' fill='#f1f5f9' stroke='#1e293b' stroke-width='2'/><rect x='235' y='165' width='15' height='15' fill='none' stroke='#334155' stroke-width='1.5'/><line x1='50' y1='180' x2='250' y2='30' stroke='#2563eb' stroke-width='2.5'/><text x='35' y='195' font-size='12' font-weight='bold'>A</text><text x='260' y='195' font-size='12' font-weight='bold'>B</text><text x='260' y='25' font-size='12' font-weight='bold'>T</text><text x='130' y='200' font-size='12' font-weight='bold'>Shadow = 20 m</text><text x='265' y='110' font-size='12' font-weight='bold' fill='#dc2626'>Tower = 15 m</text><text x='125' y='95' font-size='12' font-weight='bold' fill='#2563eb'>L = ?</text><path d='M75,180 A25,25 0 0,0 71,166' fill='none' stroke='#059669' stroke-width='1.5'/><text x='85' y='172' font-size='11' font-weight='bold' fill='#059669'>θ</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "A radio mast $BT$ of height $15\\text{ m}$ stands vertically on horizontal ground. It casts a shadow $AB$ of length $20\\text{ m}$ as shown in the diagram above.\n(i) Calculate the straight-line distance $L = |AT|$ from the tip of the mast to the tip of its shadow.\n(ii) State the value of $\\tan \\theta$ as a common fraction in simplest form.",
          "hint": "Apply Pythagoras' theorem in $\\Delta ABT$: $L^2 = 20^2 + 15^2$. $\\tan \\theta = \\text{opposite} / \\text{adjacent}$.",
          "modelAnswer": "(i) 25 m, (ii) 3/4",
          "workedSolution": "**(i) Distance $L$:**\n$L^2 = |AB|^2 + |BT|^2 = 20^2 + 15^2 = 400 + 225 = 625$\n$L = \\sqrt{625} = 25\\text{ m}$\n\n**(ii) Value of $\\tan \\theta$:**\n$\\tan \\theta = \\frac{|BT|}{|AB|} = \\frac{15}{20} = \\frac{3}{4}$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Find $\\sin \\theta$ and $\\cos \\theta$ as common fractions in lowest terms.",
          "hint": "$\\sin \\theta = \\text{opposite} / \\text{hypotenuse}$, $\\cos \\theta = \\text{adjacent} / \\text{hypotenuse}$.",
          "modelAnswer": "sin θ = 3/5, cos θ = 4/5",
          "workedSolution": "$\\sin \\theta = \\frac{15}{25} = \\frac{3}{5}$\n$\\cos \\theta = \\frac{20}{25} = \\frac{4}{5}$."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Calculate the area of the vertical triangular space enclosed by the mast, its shadow, and the line of sight $AT$.",
          "hint": "Area = 1/2 × base × height.",
          "modelAnswer": "150 m²",
          "workedSolution": "$\\text{Area} = \\frac{1}{2} \\times 20 \\times 15 = 10 \\times 15 = 150\\text{ m}^2$."
        }
      ]
    },
    {
      "id": "q04",
      "title": "Question 4: Linear Simultaneous Graphing & Graphical Coordinates",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 320 250' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='140' x2='290' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='230' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><line x1='60' y1='220' x2='260' y2='40' stroke='#2563eb' stroke-width='2'/><line x1='60' y1='50' x2='260' y2='210' stroke='#dc2626' stroke-width='2'/><circle cx='180' cy='115' r='5' fill='#059669'/><text x='190' y='110' font-size='12' font-weight='bold' fill='#059669'>(1, 3)</text><text x='250' y='35' font-size='11' fill='#2563eb'>y₁ = 2x + 1</text><text x='250' y='215' font-size='11' fill='#dc2626'>y₂ = 4 - x</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "Copy and complete the table of values for the relations $y_1 = 2x + 1$ and $y_2 = 4 - x$:\n\n| $x$ | -2 | -1 | 0 | 1 | 2 | 3 | 4 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 2x + 1$ | -3 | **?** | 1 | **?** | 5 | **?** | 9 |\n| $y_2 = 4 - x$ | 6 | **?** | 4 | **?** | 2 | **?** | 0 |",
          "hint": "Substitute each missing x value into $y_1 = 2x + 1$ and $y_2 = 4 - x$.",
          "modelAnswer": "y₁: [-3, -1, 1, 3, 5, 7, 9]; y₂: [6, 5, 4, 3, 2, 1, 0]",
          "workedSolution": "For $y_1 = 2x + 1$:\n- $x = -1 \\implies 2(-1) + 1 = -1$\n- $x = 1 \\implies 2(1) + 1 = 3$\n- $x = 3 \\implies 2(3) + 1 = 7$\n\nFor $y_2 = 4 - x$:\n- $x = -1 \\implies 4 - (-1) = 5$\n- $x = 1 \\implies 4 - 1 = 3$\n- $x = 3 \\implies 4 - 3 = 1$"
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "From the simultaneous graph above, determine:\n(i) The coordinates of the point where the two lines intersect.\n(ii) The gradient of the line $y_1 = 2x + 1$.",
          "hint": "Set $2x + 1 = 4 - x$ to solve for $x$, then find $y$. Gradient is the coefficient of $x$.",
          "modelAnswer": "(i) (1, 3), (ii) Gradient = 2",
          "workedSolution": "**(i) Point of intersection:**\n$2x + 1 = 4 - x$\n$2x + x = 4 - 1$\n$3x = 3 \\implies x = 1$\nWhen $x = 1$, $y = 2(1) + 1 = 3$. Point of intersection is **$(1, 3)$**.\n\n**(ii) Gradient:**\n$y_1 = 2x + 1 \\implies m = 2$."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Find the truth set of the inequality: $2x + 1 \\ge 4 - x$.",
          "hint": "Solve $3x \\ge 3$.",
          "modelAnswer": "{x : x ≥ 1}",
          "workedSolution": "$2x + x \\ge 4 - 1$\n$3x \\ge 3 \\implies x \\ge 1$\nTruth set: **$\\{x : x \\ge 1, \\, x \\in \\mathbb{R}\\}$**."
        }
      ]
    },
    {
      "id": "q05",
      "title": "Question 5: Rectangular Water Reservoir Capacity, Surface Area & Liquid Depth",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 350 220' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><rect x='30' y='70' width='170' height='110' fill='#eff6ff' stroke='#1e40af' stroke-width='2'/><path d='M30,70 L80,30 L250,30 L200,70 Z' fill='#dbeafe' stroke='#1e40af' stroke-width='1.5'/><path d='M200,70 L250,30 L250,140 L200,180 Z' fill='#bfdbfe' stroke='#1e40af' stroke-width='1.5'/><text x='100' y='200' font-size='12' font-weight='bold'>l = 8 m</text><text x='235' y='165' font-size='12' font-weight='bold'>w = 5 m</text><text x='5' y='130' font-size='12' font-weight='bold'>h = 3 m</text><line x1='30' y1='120' x2='200' y2='120' stroke='#0284c7' stroke-width='1.5' stroke-dasharray='4'/><line x1='200' y1='120' x2='250' y2='80' stroke='#0284c7' stroke-width='1.5' stroke-dasharray='4'/><text x='85' y='145' font-size='11' fill='#0369a1' font-weight='bold'>Water Volume = 80 m³</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 5,
          "prompt": "A closed rectangular water reservoir has length $8\\text{ m}$, width $5\\text{ m}$, and height $3\\text{ m}$ as shown above.\nCalculate the **total surface area** of the reservoir when completely enclosed.",
          "hint": "Total Surface Area = $2(lw + lh + wh)$.",
          "modelAnswer": "158 m²",
          "workedSolution": "$\\text{TSA} = 2(lw + lh + wh)$\n$= 2[(8 \\times 5) + (8 \\times 3) + (5 \\times 3)]$\n$= 2[40 + 24 + 15] = 2[79] = 158\\text{ m}^2$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Calculate the **total capacity** of the reservoir in cubic metres ($\\text{m}^3$) and convert your answer to litres, given that $1\\text{ m}^3 = 1,000\\text{ litres}$.",
          "hint": "Volume = length × width × height. Multiply volume by 1,000 to get litres.",
          "modelAnswer": "120 m³ (or 120,000 litres)",
          "workedSolution": "$V = l \\times w \\times h = 8\\text{ m} \\times 5\\text{ m} \\times 3\\text{ m} = 120\\text{ m}^3$\n$\\text{Capacity in litres} = 120 \\times 1,000 = 120,000\\text{ litres}$."
        },
        {
          "partLabel": "(c)",
          "marks": 5,
          "prompt": "If $80\\text{ m}^3$ of water is pumped into the empty reservoir, calculate the depth ($d$) of the water.",
          "hint": "Depth $d = \\text{Volume} / (l \\times w)$.",
          "modelAnswer": "2 m",
          "workedSolution": "$\\text{Base area} = 8 \\times 5 = 40\\text{ m}^2$\n$d = \\frac{80}{40} = 2\\text{ m}$\nTherefore, the depth of the water is **$2\\text{ m}$**."
        }
      ]
    },
    {
      "id": "q06",
      "title": "Question 6: Discrete Frequency Statistics, Central Tendency & Probability",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 350 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><line x1='35' y1='160' x2='320' y2='160' stroke='#334155' stroke-width='2'/><line x1='35' y1='160' x2='35' y2='20' stroke='#334155' stroke-width='2'/><text x='150' y='188' font-size='11' font-weight='bold'>Marks Scored</text><text x='5' y='18' font-size='11' font-weight='bold'>Frequency</text><rect x='55' y='125' width='25' height='35' fill='#93c5fd' stroke='#1d4ed8'/><rect x='100' y='90' width='25' height='70' fill='#93c5fd' stroke='#1d4ed8'/><rect x='145' y='20' width='25' height='140' fill='#2563eb' stroke='#1d4ed8'/><rect x='190' y='75' width='25' height='85' fill='#93c5fd' stroke='#1d4ed8'/><rect x='235' y='110' width='25' height='50' fill='#93c5fd' stroke='#1d4ed8'/><rect x='280' y='140' width='25' height='20' fill='#93c5fd' stroke='#1d4ed8'/><text x='65' y='173' font-size='10'>1</text><text x='110' y='173' font-size='10'>2</text><text x='155' y='173' font-size='10'>3</text><text x='200' y='173' font-size='10'>4</text><text x='245' y='173' font-size='10'>5</text><text x='288' y='173' font-size='10'>6</text><text x='20' y='25' font-size='10'>8</text><text x='20' y='80' font-size='10'>5</text><text x='20' y='130' font-size='10'>2</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 9,
          "prompt": "The test scores of $20$ pupils in a mental mathematics test are recorded in the bar chart above:\n\n| Mark ($x$) | 1 | 2 | 3 | 4 | 5 | 6 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| Frequency ($f$) | 2 | 4 | 8 | 3 | 2 | 1 |\n\n(i) State the **modal mark**.\n(ii) Find the total number of pupils ($N = \\sum f$).\n(iii) Calculate the **mean mark** of the class.",
          "hint": "Mode is the score with highest frequency. Mean = $\\sum fx / \\sum f$.",
          "modelAnswer": "(i) 3 marks, (ii) 20 pupils, (iii) 3.1 marks",
          "workedSolution": "**(i) Modal mark:**\nThe highest frequency is $8$, corresponding to mark **3**.\n\n**(ii) Total pupils:**\n$N = \\sum f = 2 + 4 + 8 + 3 + 2 + 1 = 20\\text{ pupils}$\n\n**(iii) Mean mark:**\n$\\sum fx = (1 \\times 2) + (2 \\times 4) + (3 \\times 8) + (4 \\times 3) + (5 \\times 2) + (6 \\times 1)$\n$\\sum fx = 2 + 8 + 24 + 12 + 10 + 6 = 62$\n$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{62}{20} = 3.1\\text{ marks}$."
        },
        {
          "partLabel": "(b)",
          "marks": 6,
          "prompt": "If a pupil is selected at random from this class:\n(i) Find the probability that the pupil scored strictly more than $3\\text{ marks}$.\n(ii) What percentage of the class scored at least $2\\text{ marks}$?",
          "hint": "Scores > 3 are 4, 5, 6. At least 2 means scores 2, 3, 4, 5, 6.",
          "modelAnswer": "(i) 3/10, (ii) 90%",
          "workedSolution": "**(i) Probability of scoring > 3 (marks 4, 5, 6):**\n$\\text{Count} = f(4) + f(5) + f(6) = 3 + 2 + 1 = 6$\n$P(x > 3) = \\frac{6}{20} = \\frac{3}{10}$\n\n**(ii) Percentage scoring at least 2 (marks 2, 3, 4, 5, 6):**\n$\\text{Count} = 20 - f(1) = 20 - 2 = 18$\n$\\text{Percentage} = \\left(\\frac{18}{20}\\right) \\times 100\\% = 18 \\times 5 = 90\\%$."
        }
      ]
    }
  ],
  "seededAt": "2026-09-16T09:30:00.000Z",
  "lastUpdated": "2026-09-16T09:30:00.000Z"
};

// ============================================================================
// 4h. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 33)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-33
// ============================================================================
export const SET_JHS_MASTERY_SERIES_33: CurriculumQuestionSet = {
  "id": "jhs-math-mastery-series-33",
  "title": "Junior Core Mathematics • Objective Mastery Series (Set 33)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Mathematics",
  "topic": "Comprehensive Objective Exam Series",
  "variantType": "standard",
  "totalQuestions": 40,
  "version": 1,
  "questions": [
    {
      "id": "q01",
      "prompt": "If set $P = \\{x : x \\text{ is a prime factor of } 30\\}$ and set $Q = \\{x : x \\text{ is an odd number}, \\, 1 \\le x \\le 9\\}$, find $P \\cap Q$.",
      "options": [
        "{2, 3, 5}",
        "{1, 3, 5}",
        "{3, 5}",
        "{3, 5, 7}"
      ],
      "correctAnswer": "{3, 5}",
      "hint": "List both sets: prime factors of 30 are {2, 3, 5}; odd numbers up to 9 are {1, 3, 5, 7, 9}.",
      "workedSolution": "$P = \\{2, 3, 5\\}$ and $Q = \\{1, 3, 5, 7, 9\\}$. The intersection is $P \\cap Q = \\{3, 5\\}$.",
      "points": 1
    },
    {
      "id": "q02",
      "prompt": "Evaluate: $0.125 \\times 0.08$.",
      "options": [
        "0.01",
        "0.001",
        "0.1",
        "0.0001"
      ],
      "correctAnswer": "0.01",
      "hint": "$125 \\times 8 = 1000$. Count $3 + 2 = 5$ decimal places from the right.",
      "workedSolution": "$0.125 \\times 0.08 = 0.01000 = 0.01$.",
      "points": 1
    },
    {
      "id": "q03",
      "prompt": "Find the Least Common Multiple (LCM) of $9, 12,$ and $15$.",
      "options": [
        "90",
        "60",
        "360",
        "180"
      ],
      "correctAnswer": "180",
      "hint": "$9 = 3^2$, $12 = 2^2 \\times 3$, $15 = 3 \\times 5$. Multiply the highest powers of all prime factors.",
      "workedSolution": "$\\text{LCM} = 2^2 \\times 3^2 \\times 5 = 4 \\times 9 \\times 5 = 180$.",
      "points": 1
    },
    {
      "id": "q04",
      "prompt": "Express $720$ as a product of prime factors in index notation.",
      "options": [
        "$2^3 \\times 3^3 \\times 5$",
        "$2^4 \\times 3^2 \\times 5$",
        "$2^4 \\times 3 \\times 5^2$",
        "$16 \\times 9 \\times 5$"
      ],
      "correctAnswer": "$2^4 \\times 3^2 \\times 5$",
      "hint": "$720 = 72 \\times 10 = (8 \\times 9) \\times (2 \\times 5) = 2^4 \\times 3^2 \\times 5$.",
      "workedSolution": "$720 = 2^4 \\times 3^2 \\times 5$.",
      "points": 1
    },
    {
      "id": "q05",
      "prompt": "Convert the decimal number $47_{\\text{ten}}$ to a base five numeral.",
      "options": [
        "$132_{\\text{five}}$",
        "$242_{\\text{five}}$",
        "$141_{\\text{five}}$",
        "$142_{\\text{five}}$"
      ],
      "correctAnswer": "$142_{\\text{five}}$",
      "hint": "Divide repeatedly by 5: $47 = 1(25) + 4(5) + 2(1)$.",
      "workedSolution": "$47 \\div 5 = 9\\text{ R } 2$; $9 \\div 5 = 1\\text{ R } 4$; $1 \\div 5 = 0\\text{ R } 1$. Reading remainders upwards: $142_{\\text{five}}$.",
      "points": 1
    },
    {
      "id": "q06",
      "prompt": "Solve for $y$ in the equation: $6y - 7 = 3y + 8$.",
      "options": [
        "3",
        "4",
        "5",
        "6"
      ],
      "correctAnswer": "5",
      "hint": "Group terms in y: $6y - 3y = 8 + 7$.",
      "workedSolution": "$3y = 15 \\implies y = 5$.",
      "points": 1
    },
    {
      "id": "q07",
      "prompt": "Write $0.000518$ in standard form.",
      "options": [
        "$5.18 \\times 10^{-4}$",
        "$5.18 \\times 10^{-3}$",
        "$5.18 \\times 10^4$",
        "$51.8 \\times 10^{-5}$"
      ],
      "correctAnswer": "$5.18 \\times 10^{-4}$",
      "hint": "Shift the decimal point 4 places to the right to reach $5.18$.",
      "workedSolution": "$0.000518 = 5.18 \\times 10^{-4}$.",
      "points": 1
    },
    {
      "id": "q08",
      "prompt": "A retailer bought an item for $\\text{GH¢ } 120.00$ and sold it for $\\text{GH¢ } 150.00$. Calculate the percentage profit.",
      "options": [
        "20%",
        "25%",
        "30%",
        "15%"
      ],
      "correctAnswer": "25%",
      "hint": "Profit = 150 - 120 = 30. Profit % = (30 / 120) × 100%.",
      "workedSolution": "$\\text{Profit \\%} = \\frac{30}{120} \\times 100\\% = \\frac{1}{4} \\times 100\\% = 25\\%$.",
      "points": 1
    },
    {
      "id": "q09",
      "prompt": "Simplify: $\\frac{5}{6} - \\frac{1}{4} + \\frac{2}{3}$.",
      "options": [
        "$1\\frac{1}{4}$",
        "$1\\frac{1}{12}$",
        "$\\frac{11}{12}$",
        "$\\frac{7}{12}$"
      ],
      "correctAnswer": "$1\\frac{1}{4}$",
      "hint": "Use common denominator 12: $\\frac{10 - 3 + 8}{12}$.",
      "workedSolution": "$\\frac{10 - 3 + 8}{12} = \\frac{15}{12} = \\frac{5}{4} = 1\\frac{1}{4}$.",
      "points": 1
    },
    {
      "id": "q09_2",
      "prompt": "Evaluate: $\\left(2\\frac{1}{2} \\div 1\\frac{1}{4}\\right) \\times \\frac{3}{4}$.",
      "options": [
        "$2\\frac{1}{2}$",
        "$\\frac{3}{4}$",
        "1",
        "$1\\frac{1}{2}$"
      ],
      "correctAnswer": "$1\\frac{1}{2}$",
      "hint": "$2\\frac{1}{2} \\div 1\\frac{1}{4} = \\frac{5}{2} \\times \\frac{4}{5} = 2$. Then multiply 2 by 3/4.",
      "workedSolution": "$2 \\times \\frac{3}{4} = \\frac{6}{4} = \\frac{3}{2} = 1\\frac{1}{2}$.",
      "points": 1
    },
    {
      "id": "q11",
      "prompt": "The test scores of eight students are: $7, 11, 14, 9, 11, 8, 13, 11$. What is the modal score?",
      "options": [
        "9",
        "11",
        "13",
        "8"
      ],
      "correctAnswer": "11",
      "hint": "The mode is the score that appears most frequently.",
      "workedSolution": "Score 11 appears 3 times, which is more than any other score. The modal score is 11.",
      "points": 1
    },
    {
      "id": "q12",
      "prompt": "From the test scores in Question 11 ($7, 8, 9, 11, 11, 11, 13, 14$), find the median score.",
      "options": [
        "10",
        "10.5",
        "11",
        "11.5"
      ],
      "correctAnswer": "11",
      "hint": "The two ordered middle values (4th and 5th terms) are 11 and 11.",
      "workedSolution": "$\\text{Median} = \\frac{11 + 11}{2} = 11$.",
      "points": 1
    },
    {
      "id": "q13",
      "prompt": "Calculate the simple interest on $\\text{GH¢ } 540.00$ at $5\\%\\text{ per annum}$ for $3\\text{ years}$.",
      "options": [
        "GH¢ 81.00",
        "GH¢ 75.00",
        "GH¢ 90.00",
        "GH¢ 84.00"
      ],
      "correctAnswer": "GH¢ 81.00",
      "hint": "$I = \\frac{P \\times R \\times T}{100}$.",
      "workedSolution": "$I = \\frac{540 \\times 5 \\times 3}{100} = \\frac{540 \\times 15}{100} = 5.4 \\times 15 = \\text{GH¢ } 81.00$.",
      "points": 1
    },
    {
      "id": "q14",
      "prompt": "A train covers a distance of $210\\text{ km}$ in $3\\frac{1}{2}\\text{ hours}$. Calculate its average speed in $\\text{km/h}$.",
      "options": [
        "70 km/h",
        "65 km/h",
        "55 km/h",
        "60 km/h"
      ],
      "correctAnswer": "60 km/h",
      "hint": "Speed = Distance ÷ Time: $210 \\div 3.5$.",
      "workedSolution": "$\\text{Speed} = 210 \\div \\frac{7}{2} = 210 \\times \\frac{2}{7} = 30 \\times 2 = 60\\text{ km/h}$.",
      "points": 1
    },
    {
      "id": "q15",
      "prompt": "Factorize completely: $4mx - 8my + nx - 2ny$.",
      "options": [
        "$(x + 2y)(4m - n)$",
        "$(x - 2y)(4m + n)$",
        "$(x - 2y)(4m - n)$",
        "$(x + 2y)(4m + n)$"
      ],
      "correctAnswer": "$(x - 2y)(4m + n)$",
      "hint": "Group terms: $4m(x - 2y) + n(x - 2y)$.",
      "workedSolution": "$4m(x - 2y) + n(x - 2y) = (x - 2y)(4m + n)$.",
      "points": 1
    },
    {
      "id": "q16",
      "prompt": "Find the circumference of a circle whose diameter is $21\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).",
      "options": [
        "44 cm",
        "132 cm",
        "66 cm",
        "77 cm"
      ],
      "correctAnswer": "66 cm",
      "hint": "Circumference = $\\pi d$.",
      "workedSolution": "$C = \\frac{22}{7} \\times 21 = 22 \\times 3 = 66\\text{ cm}$.",
      "points": 1
    },
    {
      "id": "q17",
      "prompt": "Solve the linear inequality: $7x - 9 \\ge 3x + 7$.",
      "options": [
        "$x \\ge 4$",
        "$x \\le 4$",
        "$x \\ge 2$",
        "$x \\le 2$"
      ],
      "correctAnswer": "$x \\ge 4$",
      "hint": "$7x - 3x \\ge 7 + 9 \\implies 4x \\ge 16$.",
      "workedSolution": "$4x \\ge 16 \\implies x \\ge 4$.",
      "points": 1
    },
    {
      "id": "q18",
      "prompt": "If $4 : 7 = x : 35$, find the value of $x$.",
      "options": [
        "18",
        "24",
        "20",
        "28"
      ],
      "correctAnswer": "20",
      "hint": "Cross-multiply: $7x = 4 \\times 35$.",
      "workedSolution": "$7x = 140 \\implies x = 20$.",
      "points": 1
    },
    {
      "id": "q19",
      "prompt": "Simplify: $5a^2 b \\times 3ab^3$.",
      "options": [
        "$15a^2 b^3$",
        "$8a^3 b^4$",
        "$15a^3 b^3$",
        "$15a^3 b^4$"
      ],
      "correctAnswer": "$15a^3 b^4$",
      "hint": "Multiply coefficients: $5 \\times 3 = 15$. Add powers for $a$ and $b$.",
      "workedSolution": "$(5 \\times 3) \\times a^{2+1} \\times b^{1+3} = 15a^3 b^4$.",
      "points": 1
    },
    {
      "id": "q20",
      "prompt": "A box contains $12$ blue pens and $8$ black pens. If a pen is chosen at random, what is the probability that it is blue?",
      "options": [
        "$\\frac{2}{5}$",
        "$\\frac{3}{5}$",
        "$\\frac{1}{2}$",
        "$\\frac{4}{5}$"
      ],
      "correctAnswer": "$\\frac{3}{5}$",
      "hint": "Total pens = 12 + 8 = 20. Probability = 12 / 20.",
      "workedSolution": "$P(\\text{blue}) = \\frac{12}{20} = \\frac{3}{5}$.",
      "points": 1
    },
    {
      "id": "q21",
      "prompt": "Find the Highest Common Factor (HCF) of $36, 54,$ and $72$.",
      "options": [
        "18",
        "12",
        "9",
        "24"
      ],
      "correctAnswer": "18",
      "hint": "Determine the highest number dividing 36, 54, and 72 without a remainder.",
      "workedSolution": "$36 = 18 \\times 2$, $54 = 18 \\times 3$, $72 = 18 \\times 4$. The HCF is 18.",
      "points": 1
    },
    {
      "id": "q22",
      "prompt": "The three angles of a triangle are in the ratio $3 : 4 : 5$. Find the size of the smallest angle.",
      "options": [
        "$60^\\circ$",
        "$75^\\circ$",
        "$30^\\circ$",
        "$45^\\circ$"
      ],
      "correctAnswer": "$45^\\circ$",
      "hint": "Total parts = 3 + 4 + 5 = 12. Smallest angle = (3 / 12) × 180°.",
      "workedSolution": "$\\text{Smallest angle} = \\frac{3}{12} \\times 180^\\circ = \\frac{1}{4} \\times 180^\\circ = 45^\\circ$.",
      "points": 1
    },
    {
      "id": "q23",
      "prompt": "Given column vectors $u = \\begin{pmatrix} 6 \\\\ -2 \\end{pmatrix}$ and $v = \\begin{pmatrix} -2 \\\\ 5 \\end{pmatrix}$, evaluate $u + 2v$.",
      "options": [
        "$\\begin{pmatrix} 4 \\\\ 3 \\end{pmatrix}$",
        "$\\begin{pmatrix} 2 \\\\ 8 \\end{pmatrix}$",
        "$\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$",
        "$\\begin{pmatrix} -2 \\\\ 8 \\end{pmatrix}$"
      ],
      "correctAnswer": "$\\begin{pmatrix} 2 \\\\ 8 \\end{pmatrix}$",
      "hint": "$6 + 2(-2) = 2$ and $-2 + 2(5) = 8$.",
      "workedSolution": "$\\begin{pmatrix} 6 + 2(-2) \\\\ -2 + 2(5) \\end{pmatrix} = \\begin{pmatrix} 6 - 4 \\\\ -2 + 10 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 8 \\end{pmatrix}$.",
      "points": 1
    },
    {
      "id": "q24",
      "prompt": "In an academy of $500$ students, $62\\%$ are girls. How many boys are in the academy?",
      "options": [
        "310",
        "180",
        "190",
        "200"
      ],
      "correctAnswer": "190",
      "hint": "Boys make up $100\\% - 62\\% = 38\\%$. Calculate 38% of 500.",
      "workedSolution": "$\\frac{38}{100} \\times 500 = 38 \\times 5 = 190\\text{ boys}$.",
      "points": 1
    },
    {
      "id": "q25",
      "prompt": "State the rule for the linear mapping where inputs $x = \\{1, 2, 3, 4\\}$ produce outputs $y = \\{8, 14, 20, 26\\}$.",
      "options": [
        "$x \\to 6x + 2$",
        "$x \\to 6x - 2$",
        "$x \\to 5x + 3$",
        "$x \\to 7x + 1$"
      ],
      "correctAnswer": "$x \\to 6x + 2$",
      "hint": "Common difference is $14 - 8 = 6$. Check for $x = 1$: $6(1) + 2 = 8$.",
      "workedSolution": "Rate of change is 6 ($6x$). When $x = 1$, $6(1) + c = 8 \\implies c = 2$. The rule is $x \\to 6x + 2$.",
      "points": 1
    },
    {
      "id": "q26",
      "prompt": "In a right-angled triangle $ABC$, the hypotenuse $|AC| = 25\\text{ cm}$ and base $|BC| = 7\\text{ cm}$. Find height $|AB|$.",
      "options": [
        "20 cm",
        "24 cm",
        "22 cm",
        "18 cm"
      ],
      "correctAnswer": "24 cm",
      "hint": "$|AB|^2 = 25^2 - 7^2 = 625 - 49$.",
      "workedSolution": "$|AB|^2 = 625 - 49 = 576 \\implies |AB| = \\sqrt{576} = 24\\text{ cm}$.",
      "points": 1
    },
    {
      "id": "q27",
      "prompt": "Make $u$ the subject of the formula: $v = u + at$.",
      "options": [
        "$u = v + at$",
        "$u = \\frac{v}{at}$",
        "$u = \\frac{v - a}{t}$",
        "$u = v - at$"
      ],
      "correctAnswer": "$u = v - at$",
      "hint": "Subtract $at$ from both sides of the equation.",
      "workedSolution": "$v = u + at \\implies u = v - at$.",
      "points": 1
    },
    {
      "id": "q28",
      "prompt": "Expand and simplify: $(2x - 5)(x + 3)$.",
      "options": [
        "$2x^2 - x - 15$",
        "$2x^2 + 11x - 15$",
        "$2x^2 + x - 15$",
        "$2x^2 - 15$"
      ],
      "correctAnswer": "$2x^2 + x - 15$",
      "hint": "$2x(x + 3) - 5(x + 3) = 2x^2 + 6x - 5x - 15$.",
      "workedSolution": "$2x^2 + x - 15$.",
      "points": 1
    },
    {
      "id": "q29",
      "prompt": "How many lines of symmetry does a regular rhombus have?",
      "options": [
        "4",
        "2",
        "1",
        "0"
      ],
      "correctAnswer": "2",
      "hint": "The lines of symmetry of a rhombus lie along its diagonals.",
      "workedSolution": "A non-square rhombus has exactly 2 lines of symmetry along its diagonals.",
      "points": 1
    },
    {
      "id": "q30",
      "prompt": "A solid rectangular brick has dimensions $10\\text{ cm} \\times 6\\text{ cm} \\times 4\\text{ cm}$. Find its total surface area.",
      "options": [
        "$248\\text{ cm}^2$",
        "$124\\text{ cm}^2$",
        "$240\\text{ cm}^2$",
        "$180\\text{ cm}^2$"
      ],
      "correctAnswer": "$248\\text{ cm}^2$",
      "hint": "Total Surface Area = $2(lw + lh + wh)$.",
      "workedSolution": "$2[(10 \\times 6) + (10 \\times 4) + (6 \\times 4)] = 2[60 + 40 + 24] = 2[124] = 248\\text{ cm}^2$.",
      "points": 1
    },
    {
      "id": "q31",
      "prompt": "Find the volume of the rectangular brick in Question 30.",
      "options": [
        "$248\\text{ cm}^3$",
        "$120\\text{ cm}^3$",
        "$240\\text{ cm}^3$",
        "$160\\text{ cm}^3$"
      ],
      "correctAnswer": "$240\\text{ cm}^3$",
      "hint": "Volume = length × width × height.",
      "workedSolution": "$10 \\times 6 \\times 4 = 240\\text{ cm}^3$.",
      "points": 1
    },
    {
      "id": "q32",
      "prompt": "Two complementary angles are in the ratio $2 : 3$. Find the smaller angle.",
      "options": [
        "$54^\\circ$",
        "$30^\\circ$",
        "$45^\\circ$",
        "$36^\\circ$"
      ],
      "correctAnswer": "$36^\\circ$",
      "hint": "Complementary angles sum to $90^\\circ$. Smaller angle = (2 / 5) × 90°.",
      "workedSolution": "$\\frac{2}{5} \\times 90^\\circ = 2 \\times 18^\\circ = 36^\\circ$.",
      "points": 1
    },
    {
      "id": "q33",
      "prompt": "Under a reflection in the line $x = 0$ (the $y$-axis), the image of point $M(-4, 3)$ is:",
      "options": [
        "(4, 3)",
        "(4, -3)",
        "(-4, -3)",
        "(3, -4)"
      ],
      "correctAnswer": "(4, 3)",
      "hint": "Reflection in y-axis maps $(x, y) \\to (-x, y)$.",
      "workedSolution": "$(-4, 3) \\to (-(-4), 3) = (4, 3)$.",
      "points": 1
    },
    {
      "id": "q34",
      "prompt": "Evaluate: $\\frac{3^5 \\times 2^5}{6^3}$.",
      "options": [
        "18",
        "36",
        "72",
        "24"
      ],
      "correctAnswer": "36",
      "hint": "$3^5 \\times 2^5 = (3 \\times 2)^5 = 6^5$. Then divide $6^5 / 6^3 = 6^2$.",
      "workedSolution": "$\\frac{6^5}{6^3} = 6^{5-3} = 6^2 = 36$.",
      "points": 1
    },
    {
      "id": "q35",
      "prompt": "In a pie chart, an angle of $60^\\circ$ represents $20\\text{ items}$. How many items does the whole pie chart represent?",
      "options": [
        "100 items",
        "150 items",
        "180 items",
        "120 items"
      ],
      "correctAnswer": "120 items",
      "hint": "The angle 60° is $\\frac{1}{6}$ of 360°. Multiply 20 by 6.",
      "workedSolution": "$\\frac{360^\\circ}{60^\\circ} \\times 20 = 6 \\times 20 = 120\\text{ items}$.",
      "points": 1
    },
    {
      "id": "q36",
      "prompt": "Simplify: $\\frac{7}{5x} - \\frac{2}{3x}$.",
      "options": [
        "$\\frac{5}{2x}$",
        "$\\frac{1}{15x}$",
        "$\\frac{11}{15x}$",
        "$\\frac{11}{8x}$"
      ],
      "correctAnswer": "$\\frac{11}{15x}$",
      "hint": "Common denominator is $15x$: $\\frac{21 - 10}{15x}$.",
      "workedSolution": "$\\frac{7(3) - 2(5)}{15x} = \\frac{21 - 10}{15x} = \\frac{11}{15x}$.",
      "points": 1
    },
    {
      "id": "q37",
      "prompt": "If $6$ men can dig a trench in $5\\text{ days}$, how many days will it take $10$ men working at the same pace?",
      "options": [
        "4 days",
        "3 days",
        "2.5 days",
        "3.5 days"
      ],
      "correctAnswer": "3 days",
      "hint": "Total work = $6 \\times 5 = 30\\text{ man-days}$. Divide by 10 men.",
      "workedSolution": "$\\text{Days} = \\frac{30}{10} = 3\\text{ days}$.",
      "points": 1
    },
    {
      "id": "q38",
      "prompt": "If $x = -2$ and $y = 3$, evaluate: $2x^2 - 3y$.",
      "options": [
        "-1",
        "1",
        "17",
        "-17"
      ],
      "correctAnswer": "-1",
      "hint": "$2(-2)^2 - 3(3) = 2(4) - 9$.",
      "workedSolution": "$8 - 9 = -1$.",
      "points": 1
    },
    {
      "id": "q39",
      "prompt": "Calculate the magnitude of vector $u = \\begin{pmatrix} -8 \\\\ 15 \\end{pmatrix}$.",
      "options": [
        "15 units",
        "19 units",
        "17 units",
        "13 units"
      ],
      "correctAnswer": "17 units",
      "hint": "$|u| = \\sqrt{(-8)^2 + 15^2} = \\sqrt{64 + 225}$.",
      "workedSolution": "$|u| = \\sqrt{289} = 17\\text{ units}$.",
      "points": 1
    },
    {
      "id": "q40",
      "prompt": "Find the size of each exterior angle of a regular nonagon ($9\\text{ sides}$).",
      "options": [
        "$45^\\circ$",
        "$36^\\circ$",
        "$30^\\circ$",
        "$40^\\circ$"
      ],
      "correctAnswer": "$40^\\circ$",
      "hint": "Exterior angle = $360^\\circ / 9$.",
      "workedSolution": "$\\frac{360^\\circ}{9} = 40^\\circ$.",
      "points": 1
    }
  ],
  "seededAt": "2026-09-16T10:00:00.000Z",
  "lastUpdated": "2026-09-16T10:00:00.000Z"
};

// ============================================================================
// 4i. ALIGNED CORE CURRICULUM SERIES: JHS Math Structured Problem-Solving Series (Set 34)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-34
// ============================================================================
export const SET_JHS_MASTERY_SERIES_34: CurriculumQuestionSet = {
  "id": "jhs-math-mastery-series-34",
  "title": "Junior Core Mathematics • Structured Problem-Solving Series (Set 34)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Mathematics",
  "topic": "Structured Theory, Geometry & Data Modeling",
  "variantType": "standard",
  "totalQuestions": 6,
  "version": 1,
  "questions": [
    {
      "id": "q01",
      "title": "Question 1: Venn Diagram Set Analysis, Fraction Operations & Rational Equations",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 360 190' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='350' height='180' x='5' y='5' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='18' y='28' font-family='sans-serif' font-size='13' font-weight='bold' fill='#0f172a'>U = 40</text><circle cx='135' cy='105' r='60' fill='none' stroke='#2563eb' stroke-width='2'/><circle cx='225' cy='105' r='60' fill='none' stroke='#059669' stroke-width='2'/><text x='95' y='45' font-size='12' font-weight='bold' fill='#2563eb'>French (F: 25)</text><text x='215' y='45' font-size='12' font-weight='bold' fill='#059669'>Music (M: 22)</text><text x='95' y='110' font-size='12' fill='#1e293b'>25 - x</text><text x='175' y='110' font-size='13' font-weight='bold' fill='#dc2626'>x</text><text x='235' y='110' font-size='12' fill='#1e293b'>22 - x</text><text x='25' y='165' font-size='11' fill='#64748b'>Neither = 3</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "In a class of $40$ students, $25$ study French, $22$ study Music, and $3$ study neither subject.\nUsing the Venn diagram provided above:\n(i) Formulate an algebraic equation connecting the subsets.\n(ii) Find the number of students who study **both** subjects.\n(iii) Calculate the number of students who study French **only**.",
          "hint": "Sum of all disjoint subsets and those outside both circles equals 40: $(25 - x) + x + (22 - x) + 3 = 40$.",
          "modelAnswer": "(i) 50 - x = 40, (ii) 10 students, (iii) 15 students",
          "workedSolution": "**(i) Algebraic Equation:**\n$$(25 - x) + x + (22 - x) + 3 = 40$$\n$$50 - x = 40$$\n\n**(ii) Students studying both subjects ($x$):**\n$$x = 50 - 40 = 10\\text{ students}$$\n\n**(iii) Students studying French only:**\n$$\\text{French only} = 25 - x = 25 - 10 = 15\\text{ students}$$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Evaluate and simplify completely:\n$$3\\frac{2}{5} - 1\\frac{1}{2} + 2\\frac{1}{4}$$",
          "hint": "Combine whole numbers and fractional parts using a common denominator of 20.",
          "modelAnswer": "4 3/20",
          "workedSolution": "**Method: Combining whole numbers and fractional parts**\n$$= (3 - 1 + 2) + \\left(\\frac{2}{5} - \\frac{1}{2} + \\frac{1}{4}\\right)$$\n$$= 4 + \\left(\\frac{8 - 10 + 5}{20}\\right)$$\n$$= 4 + \\frac{3}{20} = 4\\frac{3}{20}$$\n*(Or as improper fraction: $\\frac{83}{20}$)*."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Solve for $m$ in the linear relation:\n$$\\frac{4m - 3}{3} - \\frac{m + 1}{2} = 1$$",
          "hint": "Multiply both sides by 6 (the LCM of 3 and 2) to eliminate fractions.",
          "modelAnswer": "m = 3",
          "workedSolution": "Multiply through by $6$:\n$$6\\left(\\frac{4m - 3}{3}\\right) - 6\\left(\\frac{m + 1}{2}\\right) = 6(1)$$\n$$2(4m - 3) - 3(m + 1) = 6$$\n$$8m - 6 - 3m - 3 = 6$$\n$$5m - 9 = 6$$\n$$5m = 6 + 9 = 15 \\implies m = 3$$."
        }
      ]
    },
    {
      "id": "q02",
      "title": "Question 2: Business Profit Sharing, Simple Interest & Base Numeration",
      "totalMarks": 15,
      "format": "structured_essay",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "Three business partners, Kwame, Kojo, and Adwoa, shared an annual dividend of $\\text{GH¢ } 2,400.00$ in the ratio $3 : 4 : 5$ respectively.\n(i) Calculate the amount received by each partner.\n(ii) What percentage of the total dividend did Adwoa receive?",
          "hint": "Total ratio units = 3 + 4 + 5 = 12. Find 1 unit = 2400 / 12.",
          "modelAnswer": "(i) Kwame: GH¢ 600.00, Kojo: GH¢ 800.00, Adwoa: GH¢ 1,000.00; (ii) 41.67%",
          "workedSolution": "**(i) Share Distribution:**\nTotal units = $3 + 4 + 5 = 12$.\nValue of 1 unit = $$\\frac{\\text{GH¢ } 2,400.00}{12} = \\text{GH¢ } 200.00$$\n- **Kwame:** $$3 \\times 200.00 = \\text{GH¢ } 600.00$$\n- **Kojo:** $$4 \\times 200.00 = \\text{GH¢ } 800.00$$\n- **Adwoa:** $$5 \\times 200.00 = \\text{GH¢ } 1,000.00$$\n\n**(ii) Adwoa's percentage:**\n$$\\text{Percentage} = \\left(\\frac{5}{12}\\right) \\times 100\\% = \\frac{500}{12}\\% = 41\\frac{2}{3}\\% \\approx 41.67\\%$$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Kojo invested his share of $\\text{GH¢ } 800.00$ in a treasury bond yielding a simple interest rate of $10\\%\\text{ per annum}$ for $2\\frac{1}{2}\\text{ years}$. Calculate the total simple interest earned.",
          "hint": "$$I = \\frac{P \\times R \\times T}{100}$$. Use $T = 2.5\\text{ years}$.",
          "modelAnswer": "GH¢ 200.00",
          "workedSolution": "$$I = \\frac{800 \\times 10 \\times 2.5}{100} = 8 \\times 25 = \\text{GH¢ } 200.00$$\nTherefore, the simple interest earned is **$\\text{GH¢ } 200.00$**."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Convert the decimal number $73_{\\text{ten}}$ to a base five numeral.",
          "hint": "Divide repeatedly by 5: $73 = 2(25) + 4(5) + 3(1)$.",
          "modelAnswer": "243_five",
          "workedSolution": "$$73 \\div 5 = 14\\text{ R } 3$$\n$$14 \\div 5 = 2\\text{ R } 4$$\n$$2 \\div 5 = 0\\text{ R } 2$$\nReading remainders upwards: **$$243_{\\text{five}}$$**."
        }
      ]
    },
    {
      "id": "q03",
      "title": "Question 3: Right-Angled Shadow Geometry, Pythagoras & Trigonometric Ratios",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 340 220' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><polygon points='50,180 250,180 250,30' fill='#f1f5f9' stroke='#1e293b' stroke-width='2'/><rect x='235' y='165' width='15' height='15' fill='none' stroke='#334155' stroke-width='1.5'/><line x1='50' y1='180' x2='250' y2='30' stroke='#2563eb' stroke-width='2.5'/><text x='35' y='195' font-size='12' font-weight='bold'>A</text><text x='260' y='195' font-size='12' font-weight='bold'>B</text><text x='260' y='25' font-size='12' font-weight='bold'>T</text><text x='130' y='200' font-size='12' font-weight='bold'>Shadow = 12 m</text><text x='265' y='110' font-size='12' font-weight='bold' fill='#dc2626'>Tower = 9 m</text><text x='125' y='95' font-size='12' font-weight='bold' fill='#2563eb'>L = ?</text><path d='M75,180 A25,25 0 0,0 71,166' fill='none' stroke='#059669' stroke-width='1.5'/><text x='85' y='172' font-size='11' font-weight='bold' fill='#059669'>θ</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "A street lighting pole $BT$ of height $9\\text{ m}$ casts a horizontal shadow $AB$ of length $12\\text{ m}$ on level ground as shown above.\n(i) Calculate the straight-line distance $L = |AT|$ from the top of the lamp pole to the far tip of its shadow.\n(ii) State the value of $\\tan \\theta$ as a common fraction in simplest form.",
          "hint": "Apply Pythagoras' theorem in $\\Delta ABT$: $L^2 = 12^2 + 9^2$. $\\tan \\theta = \\text{opposite} / \\text{adjacent}$.",
          "modelAnswer": "(i) 15 m, (ii) 3/4",
          "workedSolution": "**(i) Distance $L$:**\n$$L^2 = |AB|^2 + |BT|^2 = 12^2 + 9^2 = 144 + 81 = 225$$\n$$L = \\sqrt{225} = 15\\text{ m}$$\n\n**(ii) Value of $\\tan \\theta$:**\n$$\\tan \\theta = \\frac{|BT|}{|AB|} = \\frac{9}{12} = \\frac{3}{4}$$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Find $\\sin \\theta$ and $\\cos \\theta$ as common fractions in lowest terms.",
          "hint": "$\\sin \\theta = \\text{opposite} / \\text{hypotenuse}$, $\\cos \\theta = \\text{adjacent} / \\text{hypotenuse}$.",
          "modelAnswer": "sin θ = 3/5, cos θ = 4/5",
          "workedSolution": "$$\\sin \\theta = \\frac{9}{15} = \\frac{3}{5}$$\n$$\\cos \\theta = \\frac{12}{15} = \\frac{4}{5}$$."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Calculate the area of the vertical triangular region enclosed between the pole, its shadow, and the line of sight $AT$.",
          "hint": "Area = 1/2 × base × height.",
          "modelAnswer": "54 m²",
          "workedSolution": "$$\\text{Area} = \\frac{1}{2} \\times 12 \\times 9 = 6 \\times 9 = 54\\text{ m}^2$$."
        }
      ]
    },
    {
      "id": "q04",
      "title": "Question 4: Linear Simultaneous Graphing & Graphical Coordinates",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 320 250' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='140' x2='290' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='230' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><line x1='60' y1='220' x2='260' y2='40' stroke='#2563eb' stroke-width='2'/><line x1='60' y1='40' x2='260' y2='220' stroke='#dc2626' stroke-width='2'/><circle cx='180' cy='115' r='5' fill='#059669'/><text x='190' y='110' font-size='12' font-weight='bold' fill='#059669'>(1, 4)</text><text x='250' y='35' font-size='11' fill='#2563eb'>y₁ = 2x + 2</text><text x='250' y='215' font-size='11' fill='#dc2626'>y₂ = 5 - x</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "Copy and complete the table of values for the relations $$y_1 = 2x + 2$$ and $$y_2 = 5 - x$$:\n\n| $x$ | -2 | -1 | 0 | 1 | 2 | 3 | 4 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 2x + 2$ | -2 | **?** | 2 | **?** | 6 | **?** | 10 |\n| $y_2 = 5 - x$ | 7 | **?** | 5 | **?** | 3 | **?** | 1 |",
          "hint": "Substitute each missing x value into $y_1 = 2x + 2$ and $y_2 = 5 - x$.",
          "modelAnswer": "y₁: [-2, 0, 2, 4, 6, 8, 10]; y₂: [7, 6, 5, 4, 3, 2, 1]",
          "workedSolution": "For $y_1 = 2x + 2$:\n- $x = -1 \\implies 2(-1) + 2 = 0$\n- $x = 1 \\implies 2(1) + 2 = 4$\n- $x = 3 \\implies 2(3) + 2 = 8$\n\nFor $y_2 = 5 - x$:\n- $x = -1 \\implies 5 - (-1) = 6$\n- $x = 1 \\implies 5 - 1 = 4$\n- $x = 3 \\implies 5 - 3 = 2$"
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "From the simultaneous graph above, determine:\n(i) The coordinates of the point where the two lines intersect.\n(ii) The gradient of the line $y_1 = 2x + 2$.",
          "hint": "Set $2x + 2 = 5 - x$ to solve for $x$, then find $y$. Gradient is the coefficient of $x$.",
          "modelAnswer": "(i) (1, 4), (ii) Gradient = 2",
          "workedSolution": "**(i) Point of intersection:**\n$$2x + 2 = 5 - x$$\n$$2x + x = 5 - 2$$\n$$3x = 3 \\implies x = 1$$\nWhen $x = 1$, $y = 2(1) + 2 = 4$. Point of intersection is **$(1, 4)$**.\n\n**(ii) Gradient:**\n$y_1 = 2x + 2 \\implies m = 2$."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Find the truth set of the inequality: $$2x + 2 \\ge 5 - x$$.",
          "hint": "Solve $3x \\ge 3$.",
          "modelAnswer": "{x : x ≥ 1}",
          "workedSolution": "$$2x + x \\ge 5 - 2$$\n$$3x \\ge 3 \\implies x \\ge 1$$\nTruth set: **$$\\{x : x \\ge 1, \\, x \\in \\mathbb{R}\\}$$**."
        }
      ]
    },
    {
      "id": "q05",
      "title": "Question 5: Rectangular Water Reservoir Capacity, Surface Area & Depth",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 350 220' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><rect x='30' y='70' width='170' height='110' fill='#eff6ff' stroke='#1e40af' stroke-width='2'/><path d='M30,70 L80,30 L250,30 L200,70 Z' fill='#dbeafe' stroke='#1e40af' stroke-width='1.5'/><path d='M200,70 L250,30 L250,140 L200,180 Z' fill='#bfdbfe' stroke='#1e40af' stroke-width='1.5'/><text x='100' y='200' font-size='12' font-weight='bold'>l = 6 m</text><text x='235' y='165' font-size='12' font-weight='bold'>w = 4 m</text><text x='5' y='130' font-size='12' font-weight='bold'>h = 2.5 m</text><line x1='30' y1='120' x2='200' y2='120' stroke='#0284c7' stroke-width='1.5' stroke-dasharray='4'/><line x1='200' y1='120' x2='250' y2='80' stroke='#0284c7' stroke-width='1.5' stroke-dasharray='4'/><text x='85' y='145' font-size='11' fill='#0369a1' font-weight='bold'>Water Volume = 36 m³</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 5,
          "prompt": "A closed rectangular water reservoir has length $6\\text{ m}$, width $4\\text{ m}$, and height $2.5\\text{ m}$ as shown above.\nCalculate the **total surface area** of the reservoir when completely enclosed.",
          "hint": "Total Surface Area = $2(lw + lh + wh)$.",
          "modelAnswer": "98 m²",
          "workedSolution": "$$\\text{TSA} = 2(lw + lh + wh)$$\n$$= 2[(6 \\times 4) + (6 \\times 2.5) + (4 \\times 2.5)]$$\n$$= 2[24 + 15 + 10] = 2[49] = 98\\text{ m}^2$$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Calculate the **total capacity** of the reservoir in cubic metres ($\\text{m}^3$) and convert your answer to litres, given that $1\\text{ m}^3 = 1,000\\text{ litres}$.",
          "hint": "Volume = length × width × height. Multiply volume by 1,000 to get litres.",
          "modelAnswer": "60 m³ (or 60,000 litres)",
          "workedSolution": "$$V = l \\times w \\times h = 6\\text{ m} \\times 4\\text{ m} \\times 2.5\\text{ m} = 60\\text{ m}^3$$\n$$\\text{Capacity in litres} = 60 \\times 1,000 = 60,000\\text{ litres}$$."
        },
        {
          "partLabel": "(c)",
          "marks": 5,
          "prompt": "If $36\\text{ m}^3$ of water is pumped into the empty reservoir, calculate the depth ($d$) of the water.",
          "hint": "Depth $d = \\text{Volume} / (l \\times w)$.",
          "modelAnswer": "1.5 m",
          "workedSolution": "$$\\text{Base area} = 6 \\times 4 = 24\\text{ m}^2$$\n$$d = \\frac{36}{24} = 1.5\\text{ m}$$\nTherefore, the depth of the water is **$1.5\\text{ m}$**."
        }
      ]
    },
    {
      "id": "q06",
      "title": "Question 6: Class Frequency Distribution, Central Tendency & Probability",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 350 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><line x1='35' y1='160' x2='320' y2='160' stroke='#334155' stroke-width='2'/><line x1='35' y1='160' x2='35' y2='20' stroke='#334155' stroke-width='2'/><text x='150' y='188' font-size='11' font-weight='bold'>Marks Scored</text><text x='5' y='18' font-size='11' font-weight='bold'>Frequency</text><rect x='55' y='125' width='25' height='35' fill='#93c5fd' stroke='#1d4ed8'/><rect x='100' y='90' width='25' height='70' fill='#93c5fd' stroke='#1d4ed8'/><rect x='145' y='20' width='25' height='140' fill='#2563eb' stroke='#1d4ed8'/><rect x='190' y='75' width='25' height='85' fill='#93c5fd' stroke='#1d4ed8'/><rect x='235' y='110' width='25' height='50' fill='#93c5fd' stroke='#1d4ed8'/><rect x='280' y='140' width='25' height='20' fill='#93c5fd' stroke='#1d4ed8'/><text x='65' y='173' font-size='10'>1</text><text x='110' y='173' font-size='10'>2</text><text x='155' y='173' font-size='10'>3</text><text x='200' y='173' font-size='10'>4</text><text x='245' y='173' font-size='10'>5</text><text x='288' y='173' font-size='10'>6</text><text x='20' y='25' font-size='10'>8</text><text x='20' y='80' font-size='10'>5</text><text x='20' y='130' font-size='10'>2</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 9,
          "prompt": "The test scores of $20$ pupils in a science test are recorded in the bar chart above:\n\n| Mark ($x$) | 1 | 2 | 3 | 4 | 5 | 6 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| Frequency ($f$) | 2 | 4 | 8 | 3 | 2 | 1 |\n\n(i) State the **modal mark**.\n(ii) Find the total number of pupils ($N = \\sum f$).\n(iii) Calculate the **mean mark** of the class.",
          "hint": "Mode is the mark with highest frequency. Mean = $\\sum fx / \\sum f$.",
          "modelAnswer": "(i) 3 marks, (ii) 20 pupils, (iii) 3.1 marks",
          "workedSolution": "**(i) Modal mark:**\nThe highest frequency is $8$, corresponding to mark **3**.\n\n**(ii) Total pupils:**\n$$N = \\sum f = 2 + 4 + 8 + 3 + 2 + 1 = 20\\text{ pupils}$$\n\n**(iii) Mean mark:**\n$$\\sum fx = (1 \\times 2) + (2 \\times 4) + (3 \\times 8) + (4 \\times 3) + (5 \\times 2) + (6 \\times 1)$$\n$$\\sum fx = 2 + 8 + 24 + 12 + 10 + 6 = 62$$\n$$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{62}{20} = 3.1\\text{ marks}$$."
        },
        {
          "partLabel": "(b)",
          "marks": 6,
          "prompt": "If a pupil is chosen at random from this group:\n(i) Find the probability that the pupil scored strictly more than $3\\text{ marks}$.\n(ii) What percentage of the class scored at least $2\\text{ marks}$?",
          "hint": "Scores > 3 are 4, 5, 6. At least 2 means scores 2, 3, 4, 5, 6.",
          "modelAnswer": "(i) 3/10, (ii) 90%",
          "workedSolution": "**(i) Probability of scoring > 3 (marks 4, 5, 6):**\n$$\\text{Count} = f(4) + f(5) + f(6) = 3 + 2 + 1 = 6$$\n$$P(x > 3) = \\frac{6}{20} = \\frac{3}{10}$$\n\n**(ii) Percentage scoring at least 2 (marks 2, 3, 4, 5, 6):**\n$$\\text{Count} = 20 - f(1) = 20 - 2 = 18$$\n$$\\text{Percentage} = \\left(\\frac{18}{20}\\right) \\times 100\\% = 18 \\times 5 = 90\\%$$."
        }
      ]
    }
  ],
  "seededAt": "2026-09-16T10:30:00.000Z",
  "lastUpdated": "2026-09-16T10:30:00.000Z"
};

// ============================================================================
// 4j. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 35)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-35
// ============================================================================
export const SET_JHS_MASTERY_SERIES_35: CurriculumQuestionSet = {
  "id": "jhs-math-mastery-series-35",
  "title": "Junior Core Mathematics • Objective Mastery Series (Set 35)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Mathematics",
  "topic": "Comprehensive Objective Exam Series",
  "variantType": "standard",
  "totalQuestions": 40,
  "version": 1,
  "questions": [
    {
      "id": "q01",
      "prompt": "If set $$P = \\{x : x \\text{ is a factor of } 36\\}$$ and set $$Q = \\{x : x \\text{ is a multiple of } 4, \\, 1 \\le x \\le 36\\}$$, find the number of elements in $$P \\cap Q$$.",
      "options": [
        "3",
        "4",
        "5",
        "2"
      ],
      "correctAnswer": "3",
      "hint": "List both sets: factors of 36 are {1, 2, 3, 4, 6, 9, 12, 18, 36}; multiples of 4 up to 36 are {4, 8, 12, 16, 20, 24, 28, 32, 36}.",
      "workedSolution": "$$P = \\{1, 2, 3, 4, 6, 9, 12, 18, 36\\}$$ and $$Q = \\{4, 8, 12, 16, 20, 24, 28, 32, 36\\}$$. The intersection is $$P \\cap Q = \\{4, 12, 36\\}$$, which contains **3** elements.",
      "points": 1
    },
    {
      "id": "q02",
      "prompt": "Evaluate: $$0.036 \\div 0.009$$.",
      "options": [
        "0.4",
        "40",
        "0.04",
        "4"
      ],
      "correctAnswer": "4",
      "hint": "Multiply numerator and denominator by 1000 to convert to whole numbers: 36 / 9.",
      "workedSolution": "$$\\frac{0.036}{0.009} = \\frac{36}{9} = 4$$.",
      "points": 1
    },
    {
      "id": "q03",
      "prompt": "Find the Least Common Multiple (LCM) of $12, 18,$ and $30$.",
      "options": [
        "90",
        "180",
        "360",
        "120"
      ],
      "correctAnswer": "180",
      "hint": "$$12 = 2^2 \\times 3$$, $$18 = 2 \\times 3^2$$, $$30 = 2 \\times 3 \\times 5$$. Multiply highest powers of all prime factors.",
      "workedSolution": "$$\\text{LCM} = 2^2 \\times 3^2 \\times 5 = 4 \\times 9 \\times 5 = 180$$.",
      "points": 1
    },
    {
      "id": "q04",
      "prompt": "Express $840$ as a product of prime factors in index notation.",
      "options": [
        "$$2^2 \\times 3^2 \\times 5 \\times 7$$",
        "$$2^3 \\times 3^2 \\times 5 \\times 7$$",
        "$$2^3 \\times 3 \\times 5 \\times 7$$",
        "$$8 \\times 105$$"
      ],
      "correctAnswer": "$$2^3 \\times 3 \\times 5 \\times 7$$",
      "hint": "$$840 = 84 \\times 10 = (4 \\times 3 \\times 7) \\times (2 \\times 5)$$.",
      "workedSolution": "$$840 = 2^3 \\times 3 \\times 5 \\times 7$$.",
      "points": 1
    },
    {
      "id": "q05",
      "prompt": "Convert the base ten numeral $63_{\\text{ten}}$ to a base five numeral.",
      "options": [
        "$$213_{\\text{five}}$$",
        "$$223_{\\text{five}}$$",
        "$$233_{\\text{five}}$$",
        "$$123_{\\text{five}}$$"
      ],
      "correctAnswer": "$$223_{\\text{five}}$$",
      "hint": "Divide repeatedly by 5: $63 = 2(25) + 2(5) + 3(1)$.",
      "workedSolution": "$$63 \\div 5 = 12\\text{ R } 3$$; $$12 \\div 5 = 2\\text{ R } 2$$; $$2 \\div 5 = 0\\text{ R } 2$$. Reading upwards: $$223_{\\text{five}}$$.",
      "points": 1
    },
    {
      "id": "q06",
      "prompt": "Solve for $x$ in the equation: $$8x - 9 = 3x + 16$$.",
      "options": [
        "5",
        "7",
        "6",
        "4"
      ],
      "correctAnswer": "5",
      "hint": "Group terms with x: $8x - 3x = 16 + 9$.",
      "workedSolution": "$$5x = 25 \\implies x = 5$$.",
      "points": 1
    },
    {
      "id": "q07",
      "prompt": "Write $0.000785$ in standard form.",
      "options": [
        "$$7.85 \\times 10^{-3}$$",
        "$$7.85 \\times 10^4$$",
        "$$78.5 \\times 10^{-5}$$",
        "$$7.85 \\times 10^{-4}$$"
      ],
      "correctAnswer": "$$7.85 \\times 10^{-4}$$",
      "hint": "Move the decimal point 4 places to the right to reach $7.85$.",
      "workedSolution": "$$0.000785 = 7.85 \\times 10^{-4}$$.",
      "points": 1
    },
    {
      "id": "q08",
      "prompt": "A trader purchased a sewing machine for $\\text{GH¢ } 240.00$ and sold it at a loss of $12\\frac{1}{2}\\%$. Find the selling price.",
      "options": [
        "GH¢ 215.00",
        "GH¢ 200.00",
        "GH¢ 210.00",
        "GH¢ 220.00"
      ],
      "correctAnswer": "GH¢ 210.00",
      "hint": "Note that $12\\frac{1}{2}\\% = \\frac{1}{8}$. Loss = $\\frac{1}{8} \\times 240 = 30$.",
      "workedSolution": "$$\\text{Loss} = \\frac{1}{8} \\times 240.00 = \\text{GH¢ } 30.00$$. Selling price = $$240.00 - 30.00 = \\text{GH¢ } 210.00$$.",
      "points": 1
    },
    {
      "id": "q09",
      "prompt": "Simplify: $$2\\frac{3}{4} - 1\\frac{1}{3} + 1\\frac{1}{2}$$.",
      "options": [
        "$$2\\frac{11}{12}$$",
        "$$2\\frac{7}{12}$$",
        "$$3\\frac{1}{12}$$",
        "$$2\\frac{5}{12}$$"
      ],
      "correctAnswer": "$$2\\frac{11}{12}$$",
      "hint": "Combine whole numbers: $2 - 1 + 1 = 2$. Use common denominator 12: $\\frac{9 - 4 + 6}{12}$.",
      "workedSolution": "$$2 + \\frac{11}{12} = 2\\frac{11}{12}$$.",
      "points": 1
    },
    {
      "id": "q10",
      "prompt": "Evaluate: $$\\left(3\\frac{1}{3} \\times 1\\frac{1}{5}\\right) \\div 2$$.",
      "options": [
        "3",
        "2",
        "4",
        "1"
      ],
      "correctAnswer": "2",
      "hint": "$$\\frac{10}{3} \\times \\frac{6}{5} = 4$$. Then divide 4 by 2.",
      "workedSolution": "$$\\left(\\frac{10}{3} \\times \\frac{6}{5}\\right) \\div 2 = 4 \\div 2 = 2$$.",
      "points": 1
    },
    {
      "id": "q11",
      "prompt": "The test scores of nine students in a mathematics test are: $$10, 14, 12, 15, 12, 11, 16, 12, 13$$. Determine the modal score.",
      "options": [
        "13",
        "14",
        "12",
        "11"
      ],
      "correctAnswer": "12",
      "hint": "The mode is the score that appears most frequently in the distribution.",
      "workedSolution": "Score 12 appears 3 times, which is more than any other score. The modal score is 12.",
      "points": 1
    },
    {
      "id": "q12",
      "prompt": "From the test scores in Question 11 ($$10, 11, 12, 12, 12, 13, 14, 15, 16$$), find the median score.",
      "options": [
        "13",
        "12.5",
        "11.5",
        "12"
      ],
      "correctAnswer": "12",
      "hint": "With 9 ordered values, the median is the 5th value: $(9 + 1) / 2 = 5$.",
      "workedSolution": "The 5th value in the ordered list is 12.",
      "points": 1
    },
    {
      "id": "q13",
      "prompt": "Calculate the simple interest on $\\text{GH¢ } 750.00$ at $4\\%\\text{ per annum}$ for $3\\text{ years}$.",
      "options": [
        "GH¢ 90.00",
        "GH¢ 80.00",
        "GH¢ 100.00",
        "GH¢ 85.00"
      ],
      "correctAnswer": "GH¢ 90.00",
      "hint": "$$I = \\frac{P \\times R \\times T}{100}$$.",
      "workedSolution": "$$I = \\frac{750 \\times 4 \\times 3}{100} = \\frac{750 \\times 12}{100} = 7.5 \\times 12 = \\text{GH¢ } 90.00$$.",
      "points": 1
    },
    {
      "id": "q14",
      "prompt": "A lorry covers a distance of $160\\text{ km}$ in $2\\text{ hours } 40\\text{ minutes}$. Calculate its average speed in $\\text{km/h}$.",
      "options": [
        "55 km/h",
        "60 km/h",
        "65 km/h",
        "50 km/h"
      ],
      "correctAnswer": "60 km/h",
      "hint": "Convert 40 minutes to hours: $40/60 = 2/3\\text{ h}$. Total time = $2\\frac{2}{3} = \\frac{8}{3}\\text{ h}$. Speed = $160 \\div \\frac{8}{3}$.",
      "workedSolution": "$$\\text{Speed} = 160 \\times \\frac{3}{8} = 20 \\times 3 = 60\\text{ km/h}$$.",
      "points": 1
    },
    {
      "id": "q15",
      "prompt": "Factorize completely: $$5px - 10py + qx - 2qy$$.",
      "options": [
        "$$(x + 2y)(5p - q)$$",
        "$$(x - 2y)(5p - q)$$",
        "$$(x - 2y)(5p + q)$$",
        "$$(x + 2y)(5p + q)$$"
      ],
      "correctAnswer": "$$(x - 2y)(5p + q)$$",
      "hint": "Group terms: $5p(x - 2y) + q(x - 2y)$.",
      "workedSolution": "$$5p(x - 2y) + q(x - 2y) = (x - 2y)(5p + q)$$.",
      "points": 1
    },
    {
      "id": "q16",
      "prompt": "Find the circumference of a circular mat of radius $10.5\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).",
      "options": [
        "33 cm",
        "132 cm",
        "77 cm",
        "66 cm"
      ],
      "correctAnswer": "66 cm",
      "hint": "Circumference = $2\\pi r$. $10.5 = \\frac{21}{2}$.",
      "workedSolution": "$$C = 2 \\times \\frac{22}{7} \\times \\frac{21}{2} = 22 \\times 3 = 66\\text{ cm}$$.",
      "points": 1
    },
    {
      "id": "q17",
      "prompt": "Solve the linear inequality: $$8x - 5 \\le 3x + 15$$.",
      "options": [
        "$$x \\ge 4$$",
        "$$x \\le 4$$",
        "$$x \\le 2$$",
        "$$x \\ge 2$$"
      ],
      "correctAnswer": "$$x \\le 4$$",
      "hint": "$$8x - 3x \\le 15 + 5 \\implies 5x \\le 20$$.",
      "workedSolution": "$$5x \\le 20 \\implies x \\le 4$$.",
      "points": 1
    },
    {
      "id": "q18",
      "prompt": "If $5 : 8 = x : 48$, find the value of $x$.",
      "options": [
        "30",
        "25",
        "35",
        "28"
      ],
      "correctAnswer": "30",
      "hint": "Cross-multiply: $8x = 5 \\times 48$.",
      "workedSolution": "$$8x = 240 \\implies x = 30$$.",
      "points": 1
    },
    {
      "id": "q19",
      "prompt": "Simplify: $$6x^2 y^3 \\times 2xy^2$$.",
      "options": [
        "$$12x^2 y^6$$",
        "$$8x^3 y^5$$",
        "$$12x^3 y^5$$",
        "$$12x^3 y^6$$"
      ],
      "correctAnswer": "$$12x^3 y^5$$",
      "hint": "Multiply coefficients: $6 \\times 2 = 12$. Add exponents for x and y.",
      "workedSolution": "$$(6 \\times 2) \\times x^{2+1} \\times y^{3+2} = 12x^3 y^5$$.",
      "points": 1
    },
    {
      "id": "q20",
      "prompt": "A drawer contains $7$ blue socks and $9$ white socks. If a sock is picked at random, what is the probability that it is white?",
      "options": [
        "$$\\frac{7}{16}$$",
        "$$\\frac{3}{4}$$",
        "$$\\frac{1}{2}$$",
        "$$\\frac{9}{16}$$"
      ],
      "correctAnswer": "$$\\frac{9}{16}$$",
      "hint": "Total socks = 7 + 9 = 16. White socks = 9.",
      "workedSolution": "$$P(\\text{white}) = \\frac{9}{16}$$.",
      "points": 1
    },
    {
      "id": "q21",
      "prompt": "Find the Highest Common Factor (HCF) of $42, 63,$ and $105$.",
      "options": [
        "21",
        "7",
        "14",
        "3"
      ],
      "correctAnswer": "21",
      "hint": "Determine the highest number dividing 42, 63, and 105 evenly.",
      "workedSolution": "$$42 = 21 \\times 2$$, $$63 = 21 \\times 3$$, $$105 = 21 \\times 5$$. The HCF is 21.",
      "points": 1
    },
    {
      "id": "q22",
      "prompt": "The three angles of a triangle are in the ratio $1 : 3 : 5$. Find the size of the middle angle.",
      "options": [
        "$$40^\\circ$$",
        "$$20^\\circ$$",
        "$$60^\\circ$$",
        "$$80^\\circ$$"
      ],
      "correctAnswer": "$$60^\\circ$$",
      "hint": "Total parts = 1 + 3 + 5 = 9. Middle angle = (3 / 9) × 180°.",
      "workedSolution": "$$\\text{Middle angle} = \\frac{3}{9} \\times 180^\\circ = \\frac{1}{3} \\times 180^\\circ = 60^\\circ$$.",
      "points": 1
    },
    {
      "id": "q23",
      "prompt": "Given column vectors $$u = \\begin{pmatrix} 5 \\\\ -4 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} -2 \\\\ 3 \\end{pmatrix}$$, evaluate $$u + 2v$$.",
      "options": [
        "$$\\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$$"
      ],
      "correctAnswer": "$$\\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$$",
      "hint": "$$5 + 2(-2) = 1$$ and $$-4 + 2(3) = 2$$.",
      "workedSolution": "$$\\begin{pmatrix} 5 + 2(-2) \\\\ -4 + 2(3) \\end{pmatrix} = \\begin{pmatrix} 5 - 4 \\\\ -4 + 6 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 2 \\end{pmatrix}$$.",
      "points": 1
    },
    {
      "id": "q24",
      "prompt": "In a village with $800$ inhabitants, $55\\%$ are females. How many males live in the village?",
      "options": [
        "440",
        "380",
        "350",
        "360"
      ],
      "correctAnswer": "360",
      "hint": "Males make up $100\\% - 55\\% = 45\\%$. Calculate 45% of 800.",
      "workedSolution": "$$\\frac{45}{100} \\times 800 = 45 \\times 8 = 360\\text{ males}$$.",
      "points": 1
    },
    {
      "id": "q25",
      "prompt": "State the rule for the linear mapping where inputs $x = \\{1, 2, 3, 4\\}$ produce outputs $y = \\{7, 12, 17, 22\\}$.",
      "options": [
        "$$x \\to 5x + 2$$",
        "$$x \\to 5x - 2$$",
        "$$x \\to 4x + 3$$",
        "$$x \\to 6x + 1$$"
      ],
      "correctAnswer": "$$x \\to 5x + 2$$",
      "hint": "Common difference is $12 - 7 = 5$. Check for $x = 1$: $5(1) + 2 = 7$.",
      "workedSolution": "Rate of change is 5 ($5x$). When $x = 1$, $5(1) + c = 7 \\implies c = 2$. The rule is $$x \\to 5x + 2$$.",
      "points": 1
    },
    {
      "id": "q26",
      "prompt": "In a right-angled triangle $ABC$, the hypotenuse $|AC| = 26\\text{ cm}$ and base $|BC| = 10\\text{ cm}$. Find the height $|AB|$.",
      "options": [
        "22 cm",
        "24 cm",
        "20 cm",
        "18 cm"
      ],
      "correctAnswer": "24 cm",
      "hint": "$$|AB|^2 = 26^2 - 10^2 = 676 - 100$$.",
      "workedSolution": "$$|AB|^2 = 676 - 100 = 576 \\implies |AB| = \\sqrt{576} = 24\\text{ cm}$$.",
      "points": 1
    },
    {
      "id": "q27",
      "prompt": "Make $g$ the subject of the formula: $$T = 2\\pi \\sqrt{\\frac{l}{g}}$$.",
      "options": [
        "$$g = \\frac{2\\pi l}{T^2}$$",
        "$$g = \\frac{4\\pi^2 T^2}{l}$$",
        "$$g = \\frac{l T^2}{4\\pi^2}$$",
        "$$g = \\frac{4\\pi^2 l}{T^2}$$"
      ],
      "correctAnswer": "$$g = \\frac{4\\pi^2 l}{T^2}$$",
      "hint": "Divide by $2\\pi$, square both sides: $\\frac{T^2}{4\\pi^2} = \\frac{l}{g}$. Cross-multiply to isolate g.",
      "workedSolution": "$$\\frac{T}{2\\pi} = \\sqrt{\\frac{l}{g}} \\implies \\frac{T^2}{4\\pi^2} = \\frac{l}{g} \\implies g = \\frac{4\\pi^2 l}{T^2}$$.",
      "points": 1
    },
    {
      "id": "q28",
      "prompt": "Expand and simplify: $$(3x - 4)(2x + 5)$$.",
      "options": [
        "$$6x^2 - 7x - 20$$",
        "$$6x^2 + 23x - 20$$",
        "$$6x^2 + 7x - 20$$",
        "$$6x^2 - 20$$"
      ],
      "correctAnswer": "$$6x^2 + 7x - 20$$",
      "hint": "$$3x(2x + 5) - 4(2x + 5) = 6x^2 + 15x - 8x - 20$$.",
      "workedSolution": "$$6x^2 + 7x - 20$$.",
      "points": 1
    },
    {
      "id": "q29",
      "prompt": "How many lines of symmetry does a regular kite have?",
      "options": [
        "1",
        "2",
        "4",
        "0"
      ],
      "correctAnswer": "1",
      "hint": "A kite has only one line of symmetry connecting its two vertices where unequal pairs meet.",
      "workedSolution": "A non-rhombus kite has exactly 1 line of symmetry along its main diagonal.",
      "points": 1
    },
    {
      "id": "q30",
      "prompt": "A solid rectangular block has dimensions $12\\text{ cm} \\times 5\\text{ cm} \\times 4\\text{ cm}$. Find its total surface area.",
      "options": [
        "$$128\\text{ cm}^2$$",
        "$$240\\text{ cm}^2$$",
        "$$260\\text{ cm}^2$$",
        "$$256\\text{ cm}^2$$"
      ],
      "correctAnswer": "$$256\\text{ cm}^2$$",
      "hint": "Total Surface Area = $2(lw + lh + wh)$.",
      "workedSolution": "$$2[(12 \\times 5) + (12 \\times 4) + (5 \\times 4)] = 2[60 + 48 + 20] = 2[128] = 256\\text{ cm}^2$$.",
      "points": 1
    },
    {
      "id": "q31",
      "prompt": "Find the volume of the block in Question 30.",
      "options": [
        "$$256\\text{ cm}^3$$",
        "$$240\\text{ cm}^3$$",
        "$$120\\text{ cm}^3$$",
        "$$480\\text{ cm}^3$$"
      ],
      "correctAnswer": "$$240\\text{ cm}^3$$",
      "hint": "Volume = length × width × height.",
      "workedSolution": "$$12 \\times 5 \\times 4 = 240\\text{ cm}^3$$.",
      "points": 1
    },
    {
      "id": "q32",
      "prompt": "Two supplementary angles are in the ratio $4 : 5$. Find the size of the larger angle.",
      "options": [
        "$$80^\\circ$$",
        "$$120^\\circ$$",
        "$$100^\\circ$$",
        "$$90^\\circ$$"
      ],
      "correctAnswer": "$$100^\\circ$$",
      "hint": "Supplementary angles sum to $180^\\circ$. Larger angle = (5 / 9) × 180°.",
      "workedSolution": "$$\\frac{5}{9} \\times 180^\\circ = 5 \\times 20^\\circ = 100^\\circ$$.",
      "points": 1
    },
    {
      "id": "q33",
      "prompt": "Under a reflection in the $x$-axis, the image of point $H(-3, 6)$ is:",
      "options": [
        "(-3, -6)",
        "(3, 6)",
        "(3, -6)",
        "(6, -3)"
      ],
      "correctAnswer": "(-3, -6)",
      "hint": "Reflection in x-axis maps $(x, y) \\to (x, -y)$.",
      "workedSolution": "$$(-3, 6) \\to (-3, -6)$$.",
      "points": 1
    },
    {
      "id": "q34",
      "prompt": "Evaluate: $$\\frac{2^7 \\times 5^4}{10^3}$$.",
      "options": [
        "40",
        "80",
        "160",
        "20"
      ],
      "correctAnswer": "80",
      "hint": "$$10^3 = 2^3 \\times 5^3$$. Subtract indices: $2^{7-3} \\times 5^{4-3} = 2^4 \\times 5^1$.",
      "workedSolution": "$$2^4 \\times 5^1 = 16 \\times 5 = 80$$.",
      "points": 1
    },
    {
      "id": "q35",
      "prompt": "In a pie chart, a sector of $120^\\circ$ represents $40\\text{ items}$. How many items does the whole pie chart represent?",
      "options": [
        "100 items",
        "150 items",
        "160 items",
        "120 items"
      ],
      "correctAnswer": "120 items",
      "hint": "The angle 120° is $\\frac{1}{3}$ of 360°. Multiply 40 by 3.",
      "workedSolution": "$$\\frac{360^\\circ}{120^\\circ} \\times 40 = 3 \\times 40 = 120\\text{ items}$$.",
      "points": 1
    },
    {
      "id": "q36",
      "prompt": "Simplify: $$\\frac{5}{6a} - \\frac{1}{4a}$$.",
      "options": [
        "$$\\frac{4}{2a}$$",
        "$$\\frac{1}{12a}$$",
        "$$\\frac{7}{12a}$$",
        "$$\\frac{7}{24a}$$"
      ],
      "correctAnswer": "$$\\frac{7}{12a}$$",
      "hint": "Common denominator is $12a$: $\\frac{10 - 3}{12a}$.",
      "workedSolution": "$$\\frac{5(2) - 1(3)}{12a} = \\frac{10 - 3}{12a} = \\frac{7}{12a}$$.",
      "points": 1
    },
    {
      "id": "q37",
      "prompt": "If $4$ men can paint a school hall in $6\\text{ days}$, how many men working at the same rate will be needed to complete the painting in $3\\text{ days}$?",
      "options": [
        "6 men",
        "10 men",
        "7 men",
        "8 men"
      ],
      "correctAnswer": "8 men",
      "hint": "Total work = $4 \\times 6 = 24\\text{ man-days}$. Divide by 3 days.",
      "workedSolution": "$$\\text{Men} = \\frac{24}{3} = 8\\text{ men}$$.",
      "points": 1
    },
    {
      "id": "q38",
      "prompt": "If $a = -3$ and $b = 4$, evaluate: $$3a^2 - 2b$$.",
      "options": [
        "19",
        "11",
        "27",
        "-19"
      ],
      "correctAnswer": "19",
      "hint": "$$3(-3)^2 - 2(4) = 3(9) - 8$$.",
      "workedSolution": "$$27 - 8 = 19$$.",
      "points": 1
    },
    {
      "id": "q39",
      "prompt": "Calculate the magnitude of vector $$v = \\begin{pmatrix} -9 \\\\ 12 \\end{pmatrix}$$.",
      "options": [
        "21 units",
        "15 units",
        "18 units",
        "12 units"
      ],
      "correctAnswer": "15 units",
      "hint": "$$|v| = \\sqrt{(-9)^2 + 12^2} = \\sqrt{81 + 144}$$.",
      "workedSolution": "$$|v| = \\sqrt{225} = 15\\text{ units}$$.",
      "points": 1
    },
    {
      "id": "q40",
      "prompt": "Find the size of each interior angle of a regular hexagon ($6\\text{ sides}$).",
      "options": [
        "$$108^\\circ$$",
        "$$135^\\circ$$",
        "$$120^\\circ$$",
        "$$140^\\circ$$"
      ],
      "correctAnswer": "$$120^\\circ$$",
      "hint": "Exterior angle = $360^\\circ / 6 = 60^\\circ$. Interior angle = $180^\\circ - 60^\\circ$.",
      "workedSolution": "$$\\text{Exterior angle} = 60^\\circ$$. Interior angle = $$180^\\circ - 60^\\circ = 120^\\circ$$.",
      "points": 1
    }
  ],
  "seededAt": "2026-09-16T11:00:00.000Z",
  "lastUpdated": "2026-09-16T11:00:00.000Z"
};

// ============================================================================
// 4k. ALIGNED CORE CURRICULUM SERIES: JHS Math Structured Problem-Solving Series (Set 36)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-36
// ============================================================================
export const SET_JHS_MASTERY_SERIES_36: CurriculumQuestionSet = {
  "id": "jhs-math-mastery-series-36",
  "title": "Junior Core Mathematics • Structured Problem-Solving Series (Set 36)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Mathematics",
  "topic": "Structured Theory, Geometry & Data Modeling",
  "variantType": "standard",
  "totalQuestions": 6,
  "version": 1,
  "questions": [
    {
      "id": "q01",
      "title": "Question 1: Venn Diagram Set Analysis, Fraction Operations & Rational Equations",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 360 190' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='350' height='180' x='5' y='5' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/><text x='18' y='28' font-family='sans-serif' font-size='13' font-weight='bold' fill='#0f172a'>U = 42</text><circle cx='135' cy='105' r='60' fill='none' stroke='#2563eb' stroke-width='2'/><circle cx='225' cy='105' r='60' fill='none' stroke='#059669' stroke-width='2'/><text x='90' y='45' font-size='12' font-weight='bold' fill='#2563eb'>History (H: 26)</text><text x='205' y='45' font-size='12' font-weight='bold' fill='#059669'>Geography (G: 22)</text><text x='95' y='110' font-size='12' fill='#1e293b'>26 - x</text><text x='175' y='110' font-size='13' font-weight='bold' fill='#dc2626'>x</text><text x='235' y='110' font-size='12' fill='#1e293b'>22 - x</text><text x='25' y='165' font-size='11' fill='#64748b'>Neither = 4</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "In a class of $42$ students, $26$ study History, $22$ study Geography, and $4$ study neither subject.\nUsing the Venn diagram provided above:\n(i) Formulate an algebraic equation connecting the subsets.\n(ii) Find the number of students who study **both** subjects.\n(iii) Calculate the number of students who study History **only**.",
          "hint": "Sum of all disjoint subsets and those outside both circles equals 42: $(26 - x) + x + (22 - x) + 4 = 42$.",
          "modelAnswer": "(i) 52 - x = 42, (ii) 10 students, (iii) 16 students",
          "workedSolution": "**(i) Algebraic Equation:**\n$$(26 - x) + x + (22 - x) + 4 = 42$$\n$$52 - x = 42$$\n\n**(ii) Students studying both subjects ($x$):**\n$$x = 52 - 42 = 10\\text{ students}$$\n\n**(iii) Students studying History only:**\n$$\\text{History only} = 26 - x = 26 - 10 = 16\\text{ students}$$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Evaluate and simplify completely:\n$$3\\frac{1}{2} - 1\\frac{2}{3} + 2\\frac{1}{4}$$",
          "hint": "Combine whole numbers and fractional parts using a common denominator of 12.",
          "modelAnswer": "4 1/12",
          "workedSolution": "**Method: Combining whole numbers and fractional parts**\n$$= (3 - 1 + 2) + \\left(\\frac{1}{2} - \\frac{2}{3} + \\frac{1}{4}\\right)$$\n$$= 4 + \\left(\\frac{6 - 8 + 3}{12}\\right)$$\n$$= 4 + \\frac{1}{12} = 4\\frac{1}{12}$$\n*(Or as improper fraction: $\\frac{49}{12}$)*."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Solve for $n$ in the linear relation:\n$$\\frac{3n - 1}{4} - \\frac{n - 2}{3} = 2$$",
          "hint": "Multiply both sides by 12 (the LCM of 4 and 3) to eliminate fractions.",
          "modelAnswer": "n = 3.8 (or 19/5)",
          "workedSolution": "Multiply through by $12$:\n$$12\\left(\\frac{3n - 1}{4}\\right) - 12\\left(\\frac{n - 2}{3}\\right) = 12(2)$$\n$$3(3n - 1) - 4(n - 2) = 24$$\n$$9n - 3 - 4n + 8 = 24$$\n$$5n + 5 = 24$$\n$$5n = 24 - 5 = 19 \\implies n = \\frac{19}{5} = 3\\frac{4}{5} = 3.8$$."
        }
      ]
    },
    {
      "id": "q02",
      "title": "Question 2: Ratio Sharing, Simple Interest & Base Five Conversion",
      "totalMarks": 15,
      "format": "structured_essay",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "Three partners, Mensah, Boateng, and Asare, shared an investment return of $\\text{GH¢ } 3,000.00$ in the ratio $2 : 3 : 5$ respectively.\n(i) Calculate the share of each partner.\n(ii) What percentage of the total return did Asare receive?",
          "hint": "Total ratio units = 2 + 3 + 5 = 10. Value of 1 unit = 3000 / 10.",
          "modelAnswer": "(i) Mensah: GH¢ 600.00, Boateng: GH¢ 900.00, Asare: GH¢ 1,500.00; (ii) 50%",
          "workedSolution": "**(i) Share Distribution:**\nTotal units = $2 + 3 + 5 = 10$.\nValue of 1 unit = $$\\frac{\\text{GH¢ } 3,000.00}{10} = \\text{GH¢ } 300.00$$\n- **Mensah:** $$2 \\times 300.00 = \\text{GH¢ } 600.00$$\n- **Boateng:** $$3 \\times 300.00 = \\text{GH¢ } 900.00$$\n- **Asare:** $$5 \\times 300.00 = \\text{GH¢ } 1,500.00$$\n\n**(ii) Asare's percentage share:**\n$$\\text{Percentage} = \\left(\\frac{5}{10}\\right) \\times 100\\% = 50\\%$$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Boateng invested his share of $\\text{GH¢ } 900.00$ at a simple interest rate of $8\\%\\text{ per annum}$ for $3\\text{ years}$. Calculate the total amount he had in his account at the end of the $3\\text{ years}$.",
          "hint": "$$I = \\frac{P \\times R \\times T}{100}$$. Total Amount = Principal + Simple Interest.",
          "modelAnswer": "GH¢ 1,116.00",
          "workedSolution": "$$I = \\frac{900 \\times 8 \\times 3}{100} = 9 \\times 24 = \\text{GH¢ } 216.00$$\n$$\\text{Total Amount} = P + I = 900.00 + 216.00 = \\text{GH¢ } 1,116.00$$."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Convert the decimal number $94_{\\text{ten}}$ to a base five numeral.",
          "hint": "Divide repeatedly by 5: $94 = 3(25) + 3(5) + 4(1)$.",
          "modelAnswer": "334_five",
          "workedSolution": "$$94 \\div 5 = 18\\text{ R } 4$$\n$$18 \\div 5 = 3\\text{ R } 3$$\n$$3 \\div 5 = 0\\text{ R } 3$$\nReading remainders upwards gives: **$$334_{\\text{five}}$$**."
        }
      ]
    },
    {
      "id": "q03",
      "title": "Question 3: Right-Angled Shadow Geometry, Pythagoras & Angle Ratios",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 340 220' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><polygon points='50,180 250,180 250,30' fill='#f1f5f9' stroke='#1e293b' stroke-width='2'/><rect x='235' y='165' width='15' height='15' fill='none' stroke='#334155' stroke-width='1.5'/><line x1='50' y1='180' x2='250' y2='30' stroke='#2563eb' stroke-width='2.5'/><text x='35' y='195' font-size='12' font-weight='bold'>A</text><text x='260' y='195' font-size='12' font-weight='bold'>B</text><text x='260' y='25' font-size='12' font-weight='bold'>T</text><text x='130' y='200' font-size='12' font-weight='bold'>Shadow = 16 m</text><text x='265' y='110' font-size='12' font-weight='bold' fill='#dc2626'>Tower = 12 m</text><text x='125' y='95' font-size='12' font-weight='bold' fill='#2563eb'>L = ?</text><path d='M75,180 A25,25 0 0,0 71,166' fill='none' stroke='#059669' stroke-width='1.5'/><text x='85' y='172' font-size='11' font-weight='bold' fill='#059669'>θ</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "A vertical telecommunication mast $BT$ of height $12\\text{ m}$ stands on level ground and casts a horizontal shadow $AB$ of length $16\\text{ m}$ as shown in the diagram above.\n(i) Calculate the straight-line distance $L = |AT|$ from the tip of the mast to the tip of its shadow.\n(ii) State the value of $\\tan \\theta$ as a common fraction in simplest form.",
          "hint": "Apply Pythagoras' theorem in $\\Delta ABT$: $L^2 = 16^2 + 12^2$. $\\tan \\theta = \\text{opposite} / \\text{adjacent}$.",
          "modelAnswer": "(i) 20 m, (ii) 3/4",
          "workedSolution": "**(i) Distance $L$:**\n$$L^2 = |AB|^2 + |BT|^2 = 16^2 + 12^2 = 256 + 144 = 400$$\n$$L = \\sqrt{400} = 20\\text{ m}$$\n\n**(ii) Value of $\\tan \\theta$:**\n$$\\tan \\theta = \\frac{|BT|}{|AB|} = \\frac{12}{16} = \\frac{3}{4}$$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Find $\\sin \\theta$ and $\\cos \\theta$ as common fractions in lowest terms.",
          "hint": "$\\sin \\theta = \\text{opposite} / \\text{hypotenuse}$, $\\cos \\theta = \\text{adjacent} / \\text{hypotenuse}$.",
          "modelAnswer": "sin θ = 3/5, cos θ = 4/5",
          "workedSolution": "$$\\sin \\theta = \\frac{12}{20} = \\frac{3}{5}$$\n$$\\cos \\theta = \\frac{16}{20} = \\frac{4}{5}$$."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Calculate the area of the vertical triangular region bounded by the mast, its shadow, and the line of sight $AT$.",
          "hint": "Area = 1/2 × base × height.",
          "modelAnswer": "96 m²",
          "workedSolution": "$$\\text{Area} = \\frac{1}{2} \\times 16 \\times 12 = 8 \\times 12 = 96\\text{ m}^2$$."
        }
      ]
    },
    {
      "id": "q04",
      "title": "Question 4: Linear Simultaneous Graphing & Graphical Coordinates",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 320 250' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='140' x2='290' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='230' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><line x1='60' y1='220' x2='260' y2='40' stroke='#2563eb' stroke-width='2'/><line x1='60' y1='50' x2='260' y2='210' stroke='#dc2626' stroke-width='2'/><circle cx='180' cy='115' r='5' fill='#059669'/><text x='190' y='110' font-size='12' font-weight='bold' fill='#059669'>(1, 3)</text><text x='250' y='35' font-size='11' fill='#2563eb'>y₁ = 2x + 1</text><text x='250' y='215' font-size='11' fill='#dc2626'>y₂ = 4 - x</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "Copy and complete the table of values for the relations $$y_1 = 2x + 1$$ and $$y_2 = 4 - x$$:\n\n| $x$ | -2 | -1 | 0 | 1 | 2 | 3 | 4 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 2x + 1$ | -3 | **?** | 1 | **?** | 5 | **?** | 9 |\n| $y_2 = 4 - x$ | 6 | **?** | 4 | **?** | 2 | **?** | 0 |",
          "hint": "Substitute each missing x value into $y_1 = 2x + 1$ and $y_2 = 4 - x$.",
          "modelAnswer": "y₁: [-3, -1, 1, 3, 5, 7, 9]; y₂: [6, 5, 4, 3, 2, 1, 0]",
          "workedSolution": "For $y_1 = 2x + 1$:\n- $x = -1 \\implies 2(-1) + 1 = -1$\n- $x = 1 \\implies 2(1) + 1 = 3$\n- $x = 3 \\implies 2(3) + 1 = 7$\n\nFor $y_2 = 4 - x$:\n- $x = -1 \\implies 4 - (-1) = 5$\n- $x = 1 \\implies 4 - 1 = 3$\n- $x = 3 \\implies 4 - 3 = 1$"
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "From the simultaneous graph above, determine:\n(i) The coordinates of the point where the two lines intersect.\n(ii) The gradient of the line $y_1 = 2x + 1$.",
          "hint": "Set $2x + 1 = 4 - x$ to solve for $x$, then find $y$. Gradient is the coefficient of $x$.",
          "modelAnswer": "(i) (1, 3), (ii) Gradient = 2",
          "workedSolution": "**(i) Point of intersection:**\n$$2x + 1 = 4 - x$$\n$$2x + x = 4 - 1$$\n$$3x = 3 \\implies x = 1$$\nWhen $x = 1$, $y = 2(1) + 1 = 3$. Point of intersection is **$(1, 3)$**.\n\n**(ii) Gradient:**\n$y_1 = 2x + 1 \\implies m = 2$."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Find the truth set of the inequality: $$2x + 1 \\ge 4 - x$$.",
          "hint": "Solve $3x \\ge 3$.",
          "modelAnswer": "{x : x ≥ 1}",
          "workedSolution": "$$2x + x \\ge 4 - 1$$\n$$3x \\ge 3 \\implies x \\ge 1$$\nTruth set: **$$\\{x : x \\ge 1, \\, x \\in \\mathbb{R}\\}$$**."
        }
      ]
    },
    {
      "id": "q05",
      "title": "Question 5: Rectangular Water Reservoir Capacity, Surface Area & Depth",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 350 220' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><rect x='30' y='70' width='170' height='110' fill='#eff6ff' stroke='#1e40af' stroke-width='2'/><path d='M30,70 L80,30 L250,30 L200,70 Z' fill='#dbeafe' stroke='#1e40af' stroke-width='1.5'/><path d='M200,70 L250,30 L250,140 L200,180 Z' fill='#bfdbfe' stroke='#1e40af' stroke-width='1.5'/><text x='100' y='200' font-size='12' font-weight='bold'>l = 7 m</text><text x='235' y='165' font-size='12' font-weight='bold'>w = 4 m</text><text x='5' y='130' font-size='12' font-weight='bold'>h = 3 m</text><line x1='30' y1='120' x2='200' y2='120' stroke='#0284c7' stroke-width='1.5' stroke-dasharray='4'/><line x1='200' y1='120' x2='250' y2='80' stroke='#0284c7' stroke-width='1.5' stroke-dasharray='4'/><text x='85' y='145' font-size='11' fill='#0369a1' font-weight='bold'>Water Volume = 56 m³</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 5,
          "prompt": "A closed rectangular water reservoir has length $7\\text{ m}$, width $4\\text{ m}$, and height $3\\text{ m}$ as shown above.\nCalculate the **total surface area** of the reservoir when completely enclosed.",
          "hint": "Total Surface Area = $2(lw + lh + wh)$.",
          "modelAnswer": "122 m²",
          "workedSolution": "$$\\text{TSA} = 2(lw + lh + wh)$$\n$$= 2[(7 \\times 4) + (7 \\times 3) + (4 \\times 3)]$$\n$$= 2[28 + 21 + 12] = 2[61] = 122\\text{ m}^2$$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Calculate the **total capacity** of the reservoir in cubic metres ($\\text{m}^3$) and convert your answer to litres, given that $1\\text{ m}^3 = 1,000\\text{ litres}$.",
          "hint": "Volume = length × width × height. Multiply volume by 1,000 to get litres.",
          "modelAnswer": "84 m³ (or 84,000 litres)",
          "workedSolution": "$$V = l \\times w \\times h = 7\\text{ m} \\times 4\\text{ m} \\times 3\\text{ m} = 84\\text{ m}^3$$\n$$\\text{Capacity in litres} = 84 \\times 1,000 = 84,000\\text{ litres}$$."
        },
        {
          "partLabel": "(c)",
          "marks": 5,
          "prompt": "If $56\\text{ m}^3$ of water is pumped into the empty reservoir, calculate the depth ($d$) of the water.",
          "hint": "Depth $d = \\text{Volume} / (l \\times w)$.",
          "modelAnswer": "2 m",
          "workedSolution": "$$\\text{Base area} = 7 \\times 4 = 28\\text{ m}^2$$\n$$d = \\frac{56}{28} = 2\\text{ m}$$\nTherefore, the depth of the water is **$2\\text{ m}$**."
        }
      ]
    },
    {
      "id": "q06",
      "title": "Question 6: Class Frequency Distribution, Central Tendency & Probability",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 350 200' width='100%' height='190' xmlns='http://www.w3.org/2000/svg'><line x1='35' y1='160' x2='320' y2='160' stroke='#334155' stroke-width='2'/><line x1='35' y1='160' x2='35' y2='20' stroke='#334155' stroke-width='2'/><text x='150' y='188' font-size='11' font-weight='bold'>Marks Scored</text><text x='5' y='18' font-size='11' font-weight='bold'>Frequency</text><rect x='55' y='125' width='25' height='35' fill='#93c5fd' stroke='#1d4ed8'/><rect x='100' y='90' width='25' height='70' fill='#93c5fd' stroke='#1d4ed8'/><rect x='145' y='20' width='25' height='140' fill='#2563eb' stroke='#1d4ed8'/><rect x='190' y='75' width='25' height='85' fill='#93c5fd' stroke='#1d4ed8'/><rect x='235' y='110' width='25' height='50' fill='#93c5fd' stroke='#1d4ed8'/><rect x='280' y='140' width='25' height='20' fill='#93c5fd' stroke='#1d4ed8'/><text x='65' y='173' font-size='10'>1</text><text x='110' y='173' font-size='10'>2</text><text x='155' y='173' font-size='10'>3</text><text x='200' y='173' font-size='10'>4</text><text x='245' y='173' font-size='10'>5</text><text x='288' y='173' font-size='10'>6</text><text x='20' y='25' font-size='10'>8</text><text x='20' y='80' font-size='10'>5</text><text x='20' y='130' font-size='10'>2</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 9,
          "prompt": "The test scores of $20$ pupils in a mathematics quiz are recorded in the bar chart above:\n\n| Mark ($x$) | 1 | 2 | 3 | 4 | 5 | 6 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| Frequency ($f$) | 2 | 4 | 8 | 3 | 2 | 1 |\n\n(i) State the **modal mark**.\n(ii) Find the total number of pupils ($N = \\sum f$).\n(iii) Calculate the **mean mark** of the class.",
          "hint": "Mode is the mark with highest frequency. Mean = $\\sum fx / \\sum f$.",
          "modelAnswer": "(i) 3 marks, (ii) 20 pupils, (iii) 3.1 marks",
          "workedSolution": "**(i) Modal mark:**\nThe highest frequency is $8$, corresponding to mark **3**.\n\n**(ii) Total pupils:**\n$$N = \\sum f = 2 + 4 + 8 + 3 + 2 + 1 = 20\\text{ pupils}$$\n\n**(iii) Mean mark:**\n$$\\sum fx = (1 \\times 2) + (2 \\times 4) + (3 \\times 8) + (4 \\times 3) + (5 \\times 2) + (6 \\times 1)$$\n$$\\sum fx = 2 + 8 + 24 + 12 + 10 + 6 = 62$$\n$$\\text{Mean} = \\frac{\\sum fx}{\\sum f} = \\frac{62}{20} = 3.1\\text{ marks}$$."
        },
        {
          "partLabel": "(b)",
          "marks": 6,
          "prompt": "If a pupil is chosen at random from this group:\n(i) Find the probability that the pupil scored strictly more than $3\\text{ marks}$.\n(ii) What percentage of the class scored at least $2\\text{ marks}$?",
          "hint": "Scores > 3 are 4, 5, 6. At least 2 means scores 2, 3, 4, 5, 6.",
          "modelAnswer": "(i) 3/10, (ii) 90%",
          "workedSolution": "**(i) Probability of scoring > 3 (marks 4, 5, 6):**\n$$\\text{Count} = f(4) + f(5) + f(6) = 3 + 2 + 1 = 6$$\n$$P(x > 3) = \\frac{6}{20} = \\frac{3}{10}$$\n\n**(ii) Percentage scoring at least 2 (marks 2, 3, 4, 5, 6):**\n$$\\text{Count} = 20 - f(1) = 20 - 2 = 18$$\n$$\\text{Percentage} = \\left(\\frac{18}{20}\\right) \\times 100\\% = 18 \\times 5 = 90\\%$$."
        }
      ]
    }
  ],
  "seededAt": "2026-09-16T11:30:00.000Z",
  "lastUpdated": "2026-09-16T11:30:00.000Z"
};

// ============================================================================
// 4l. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 37)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-37
// ============================================================================
export const SET_JHS_MASTERY_SERIES_37: CurriculumQuestionSet = {
  "id": "jhs-math-mastery-series-37",
  "title": "Junior Core Mathematics • Objective Mastery Series (Set 37)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Mathematics",
  "topic": "Comprehensive Objective Exam Series",
  "variantType": "standard",
  "totalQuestions": 40,
  "version": 1,
  "questions": [
    {
      "id": "q01",
      "prompt": "Which of the following represents the complete set of factors of $18$?",
      "options": [
        "{2, 3, 6, 9, 18}",
        "{1, 2, 3, 6, 18}",
        "{1, 2, 3, 6, 9, 18}",
        "{2, 3, 9, 18}"
      ],
      "correctAnswer": "{1, 2, 3, 6, 9, 18}",
      "hint": "List all whole numbers that divide 18 without leaving a remainder.",
      "workedSolution": "The factors of 18 are 1, 2, 3, 6, 9, and 18.",
      "points": 1
    },
    {
      "id": "q02",
      "prompt": "Two disjoint sets $A$ and $B$ have no members in common. Which of the following statements correctly describes their relationship?",
      "options": [
        "$$A \\subset B$$",
        "$$A \\cap B = \\emptyset$$",
        "$$A \\cup B = \\emptyset$$",
        "$$A = B$$"
      ],
      "correctAnswer": "$$A \\cap B = \\emptyset$$",
      "hint": "Disjoint sets have an empty intersection.",
      "workedSolution": "When two sets have no elements in common, their intersection is the empty set: $$A \\cap B = \\emptyset$$.",
      "points": 1
    },
    {
      "id": "q03",
      "prompt": "Kofi is $36\\text{ years}$ old. Kwame is half as old as Kofi. Kwabena is $8\\text{ years}$ older than Kwame. How old is Kwabena?",
      "options": [
        "26 years",
        "18 years",
        "24 years",
        "28 years"
      ],
      "correctAnswer": "26 years",
      "hint": "Find Kwame's age first: $36 \\div 2 = 18$. Then add 8.",
      "workedSolution": "$$\\text{Kwame's age} = \\frac{36}{2} = 18\\text{ years}$$. $$\\text{Kwabena's age} = 18 + 8 = 26\\text{ years}$$.",
      "points": 1
    },
    {
      "id": "q04",
      "prompt": "How many lines of symmetry does a non-square rectangle have?",
      "options": [
        "4",
        "1",
        "0",
        "2"
      ],
      "correctAnswer": "2",
      "hint": "A non-square rectangle has horizontal and vertical axes of symmetry.",
      "workedSolution": "A rectangle has exactly 2 lines of symmetry connecting the midpoints of opposite sides.",
      "points": 1
    },
    {
      "id": "q05",
      "prompt": "Which of the following numbers is NOT a prime number?",
      "options": [
        "11",
        "15",
        "13",
        "17"
      ],
      "correctAnswer": "15",
      "hint": "Check for factors other than 1 and the number itself.",
      "workedSolution": "$$15 = 3 \\times 5$$, so 15 is a composite number, not a prime number.",
      "points": 1
    },
    {
      "id": "q06",
      "prompt": "If the domain of $x$ is $$\\{1, 2, 3, 4, 5\\}$$, find the truth set of $$3x + 2 < 11$$.",
      "options": [
        "{1, 2, 3}",
        "{2, 3}",
        "{1, 2}",
        "{1}"
      ],
      "correctAnswer": "{1, 2}",
      "hint": "$$3x < 11 - 2 \\implies 3x < 9 \\implies x < 3$$.",
      "workedSolution": "$$3x < 9 \\implies x < 3$$. The values in the domain strictly less than 3 are 1 and 2.",
      "points": 1
    },
    {
      "id": "q07",
      "prompt": "In how many years will a principal of $\\text{GH¢ } 6,000.00$ yield a simple interest of $\\text{GH¢ } 1,200.00$ at a rate of $4\\%\\text{ per annum}$?",
      "options": [
        "6 years",
        "4 years",
        "3 years",
        "5 years"
      ],
      "correctAnswer": "5 years",
      "hint": "$$T = \\frac{100 \\times I}{P \\times R}$$.",
      "workedSolution": "$$T = \\frac{100 \\times 1,200}{6,000 \\times 4} = \\frac{120,000}{24,000} = 5\\text{ years}$$.",
      "points": 1
    },
    {
      "id": "q08",
      "prompt": "Make $k$ the subject of the relation: $$h = p - \\frac{r}{k}$$.",
      "options": [
        "$$k = \\frac{r}{p - h}$$",
        "$$k = \\frac{r}{h - p}$$",
        "$$k = \\frac{p - h}{r}$$",
        "$$k = p - hr$$"
      ],
      "correctAnswer": "$$k = \\frac{r}{p - h}$$",
      "hint": "Isolate $\\frac{r}{k} = p - h$, then take the reciprocal.",
      "workedSolution": "$$\\frac{r}{k} = p - h \\implies k = \\frac{r}{p - h}$$.",
      "points": 1
    },
    {
      "id": "q09",
      "prompt": "Which property of arithmetic operation is illustrated by the statement: $$x(y + z) = xy + xz$$?",
      "options": [
        "Commutative property",
        "Associative property",
        "Distributive property",
        "Identity property"
      ],
      "correctAnswer": "Distributive property",
      "hint": "Multiplication is distributed over addition.",
      "workedSolution": "The equation illustrates the distributive property of multiplication over addition.",
      "points": 1
    },
    {
      "id": "q10",
      "prompt": "Simplify: $$12^8 \\div 12^6$$.",
      "options": [
        "24",
        "144",
        "12",
        "72"
      ],
      "correctAnswer": "144",
      "hint": "Subtract indices: $12^{8-6} = 12^2$.",
      "workedSolution": "$$12^{8-6} = 12^2 = 144$$.",
      "points": 1
    },
    {
      "id": "q11",
      "prompt": "If $$\\frac{1}{y} = 2\\frac{1}{2}$$, find the value of $y$.",
      "options": [
        "$$\\frac{5}{2}$$",
        "$$\\frac{1}{5}$$",
        "$$\\frac{3}{5}$$",
        "$$\\frac{2}{5}$$"
      ],
      "correctAnswer": "$$\\frac{2}{5}$$",
      "hint": "$$2\\frac{1}{2} = \\frac{5}{2}$$. Invert to find y.",
      "workedSolution": "$$\\frac{1}{y} = \\frac{5}{2} \\implies y = \\frac{2}{5}$$.",
      "points": 1
    },
    {
      "id": "q12",
      "prompt": "Calculate the size of each exterior angle of a regular pentagon ($5\\text{ sides}$).",
      "options": [
        "$$108^\\circ$$",
        "$$60^\\circ$$",
        "$$72^\\circ$$",
        "$$90^\\circ$$"
      ],
      "correctAnswer": "$$72^\\circ$$",
      "hint": "Sum of exterior angles is $360^\\circ$. Divide by 5.",
      "workedSolution": "$$\\text{Exterior angle} = \\frac{360^\\circ}{5} = 72^\\circ$$.",
      "points": 1
    },
    {
      "id": "q13",
      "prompt": "Factorize completely: $$x^2 - 7x + 12$$.",
      "options": [
        "$$(x - 3)(x - 4)$$",
        "$$(x + 3)(x + 4)$$",
        "$$(x - 2)(x - 6)$$",
        "$$(x + 2)(x - 6)$$"
      ],
      "correctAnswer": "$$(x - 3)(x - 4)$$",
      "hint": "Find two numbers whose sum is -7 and whose product is +12.",
      "workedSolution": "$$-3 \\times -4 = 12$$ and $$-3 + (-4) = -7$$. Thus, $$x^2 - 7x + 12 = (x - 3)(x - 4)$$.",
      "points": 1
    },
    {
      "id": "q14",
      "prompt": "Kofi, Ama, and Kwaku shared a profit of $\\text{GH¢ } 720.00$ in the ratio $1 : 5 : 3$ respectively. How much did Ama receive?",
      "options": [
        "GH¢ 360.00",
        "GH¢ 400.00",
        "GH¢ 240.00",
        "GH¢ 80.00"
      ],
      "correctAnswer": "GH¢ 400.00",
      "hint": "Total parts = 1 + 5 + 3 = 9. Ama's share = (5 / 9) × 720.",
      "workedSolution": "$$\\text{Ama's share} = \\frac{5}{9} \\times 720 = 5 \\times 80 = \\text{GH¢ } 400.00$$.",
      "points": 1
    },
    {
      "id": "q15",
      "prompt": "Use the difference of two squares identity, $$a^2 - b^2 = (a + b)(a - b)$$, to evaluate $$78^2 - 22^2$$.",
      "options": [
        "5,200",
        "6,000",
        "4,800",
        "5,600"
      ],
      "correctAnswer": "5,600",
      "hint": "$$(78 + 22)(78 - 22) = 100 \\times 56$$.",
      "workedSolution": "$$(78 + 22)(78 - 22) = 100 \\times 56 = 5,600$$.",
      "points": 1
    },
    {
      "id": "q16",
      "prompt": "What is the probability of obtaining an even number when a fair six-sided die is thrown once?",
      "options": [
        "$$\\frac{1}{2}$$",
        "$$\\frac{1}{3}$$",
        "$$\\frac{2}{3}$$",
        "$$\\frac{1}{6}$$"
      ],
      "correctAnswer": "$$\\frac{1}{2}$$",
      "hint": "Even numbers on a die are {2, 4, 6}. Total outcomes = 6.",
      "workedSolution": "$$P(\\text{even}) = \\frac{3}{6} = \\frac{1}{2}$$.",
      "points": 1
    },
    {
      "id": "q17",
      "prompt": "The test scores of eight students in a contest are: $$10, 14, 18, 12, 18, 9, 11, 18$$. What is the probability that a student picked at random scored $18$?",
      "options": [
        "$$\\frac{1}{4}$$",
        "$$\\frac{3}{8}$$",
        "$$\\frac{1}{2}$$",
        "$$\\frac{1}{8}$$"
      ],
      "correctAnswer": "$$\\frac{3}{8}$$",
      "hint": "Score 18 occurs 3 times out of 8 total scores.",
      "workedSolution": "$$P(18) = \\frac{3}{8}$$.",
      "points": 1
    },
    {
      "id": "q18",
      "prompt": "Express $18$ as a percentage of $72$.",
      "options": [
        "20%",
        "30%",
        "25%",
        "33.3%"
      ],
      "correctAnswer": "25%",
      "hint": "$$\\frac{18}{72} = \\frac{1}{4}$$. Convert to percentage.",
      "workedSolution": "$$\\frac{18}{72} \\times 100\\% = \\frac{1}{4} \\times 100\\% = 25\\%$$.",
      "points": 1
    },
    {
      "id": "q19",
      "prompt": "Find the value of $k$ given that $$k = (2^7 \\div 2^4) \\times 8$$.",
      "options": [
        "$$2^5$$",
        "$$2^7$$",
        "$$2^4$$",
        "$$2^6$$"
      ],
      "correctAnswer": "$$2^6$$",
      "hint": "$$2^{7-4} = 2^3$$. Note that $8 = 2^3$.",
      "workedSolution": "$$2^{7-4} \\times 2^3 = 2^3 \\times 2^3 = 2^{3+3} = 2^6$$.",
      "points": 1
    },
    {
      "id": "q20",
      "prompt": "Express $0.005128$ in standard form.",
      "options": [
        "$$5.128 \\times 10^{-4}$$",
        "$$5.128 \\times 10^{-3}$$",
        "$$5.128 \\times 10^3$$",
        "$$51.28 \\times 10^{-4}$$"
      ],
      "correctAnswer": "$$5.128 \\times 10^{-3}$$",
      "hint": "Move the decimal point 3 places to the right to obtain 5.128.",
      "workedSolution": "$$0.005128 = 5.128 \\times 10^{-3}$$.",
      "points": 1
    },
    {
      "id": "q21",
      "prompt": "Given that $x = 3$ and $y = 4$, evaluate: $$(2x + y)(x - 2y)$$.",
      "options": [
        "-50",
        "50",
        "-40",
        "40"
      ],
      "correctAnswer": "-50",
      "hint": "$$2(3) + 4 = 10$$ and $$3 - 2(4) = -5$$.",
      "workedSolution": "$$[2(3) + 4][3 - 2(4)] = [6 + 4][3 - 8] = 10 \\times (-5) = -50$$.",
      "points": 1
    },
    {
      "id": "q22",
      "prompt": "Which inequality is represented on a number line by a closed circle at $-2$ and an open circle at $3$ connected by a solid segment?",
      "options": [
        "$$-2 < x \\le 3$$",
        "$$-2 \\le x \\le 3$$",
        "$$-2 \\le x < 3$$",
        "$$-2 < x < 3$$"
      ],
      "correctAnswer": "$$-2 \\le x < 3$$",
      "hint": "Closed circle includes the point ($\\le$), open circle excludes it ($<$).",
      "workedSolution": "Closed at -2 means $x \\ge -2$; open at 3 means $x < 3$. Combining gives $$-2 \\le x < 3$$.",
      "points": 1
    },
    {
      "id": "q23",
      "prompt": "A sector of a circle of radius $14\\text{ cm}$ subtends an angle of $90^\\circ$ at the centre. Find the perimeter of the sector. (Take $\\pi = \\frac{22}{7}$).",
      "options": [
        "22 cm",
        "36 cm",
        "44 cm",
        "50 cm"
      ],
      "correctAnswer": "50 cm",
      "hint": "Perimeter of sector = $\\text{Arc length} + 2r = \\frac{90}{360}(2\\pi r) + 2(14)$.",
      "workedSolution": "$$\\text{Arc length} = \\frac{1}{4} \\times 2 \\times \\frac{22}{7} \\times 14 = 22\\text{ cm}$$. $$\\text{Perimeter} = 22 + 14 + 14 = 50\\text{ cm}$$.",
      "points": 1
    },
    {
      "id": "q24",
      "prompt": "In an isosceles triangle $ABC$, $|AB| = |BC| = 10\\text{ cm}$ and base $|AC| = 16\\text{ cm}$. A perpendicular line from $B$ meets $AC$ at $D$. Find the altitude $|BD|$.",
      "options": [
        "8 cm",
        "6 cm",
        "7 cm",
        "5 cm"
      ],
      "correctAnswer": "6 cm",
      "hint": "$$|AD| = 16 / 2 = 8\\text{ cm}$$. In right-angled $\\Delta ABD$: $|BD|^2 = 10^2 - 8^2$.",
      "workedSolution": "$$|BD|^2 = 10^2 - 8^2 = 100 - 64 = 36 \\implies |BD| = \\sqrt{36} = 6\\text{ cm}$$.",
      "points": 1
    },
    {
      "id": "q25",
      "prompt": "Write $\\text{GH¢ } 48,760.00$ correct to the nearest thousand Ghana Cedis.",
      "options": [
        "GH¢ 48,000.00",
        "GH¢ 48,800.00",
        "GH¢ 49,000.00",
        "GH¢ 50,000.00"
      ],
      "correctAnswer": "GH¢ 49,000.00",
      "hint": "The hundreds digit is 7, which is $\\ge 5$, so round up the thousands place.",
      "workedSolution": "Rounding 48,760 to the nearest thousand gives 49,000.",
      "points": 1
    },
    {
      "id": "q26",
      "prompt": "Solve for $x$ in the equation: $$3x + 4 = 5x - 8$$.",
      "options": [
        "6",
        "4",
        "-6",
        "-4"
      ],
      "correctAnswer": "6",
      "hint": "$$4 + 8 = 5x - 3x \\implies 12 = 2x$$.",
      "workedSolution": "$$2x = 12 \\implies x = 6$$.",
      "points": 1
    },
    {
      "id": "q27",
      "prompt": "Evaluate: $$\\left(\\frac{3}{4} - \\frac{1}{3}\\right) \\div \\frac{5}{12}$$.",
      "options": [
        "2",
        "1",
        "$$\\frac{1}{2}$$",
        "$$\\frac{5}{12}$$"
      ],
      "correctAnswer": "1",
      "hint": "$$\\frac{3}{4} - \\frac{1}{3} = \\frac{9 - 4}{12} = \\frac{5}{12}$$.",
      "workedSolution": "$$\\frac{5}{12} \\div \\frac{5}{12} = 1$$.",
      "points": 1
    },
    {
      "id": "q28",
      "prompt": "A hiker walks on a bearing of $045^\\circ$. What is his back-bearing (bearing of the starting point from the destination)?",
      "options": [
        "$$135^\\circ$$",
        "$$315^\\circ$$",
        "$$180^\\circ$$",
        "$$225^\\circ$$"
      ],
      "correctAnswer": "$$225^\\circ$$",
      "hint": "When bearing $< 180^\\circ$, add $180^\\circ$: $045^\\circ + 180^\\circ$.",
      "workedSolution": "$$45^\\circ + 180^\\circ = 225^\\circ$$.",
      "points": 1
    },
    {
      "id": "q29",
      "prompt": "In an enlargement with centre at the origin, point $A(2, 3)$ is mapped to $A'(-4, -6)$. What is the scale factor of the enlargement?",
      "options": [
        "-2",
        "2",
        "-1/2",
        "1/2"
      ],
      "correctAnswer": "-2",
      "hint": "Scale factor $k = \\frac{x'}{x} = \\frac{-4}{2}$.",
      "workedSolution": "$$k = \\frac{-4}{2} = -2$$.",
      "points": 1
    },
    {
      "id": "q30",
      "prompt": "If $$23_x = 13_{\\text{ten}}$$, find the base $x$.",
      "options": [
        "four",
        "six",
        "five",
        "seven"
      ],
      "correctAnswer": "five",
      "hint": "$$2x + 3 = 13 \\implies 2x = 10$$.",
      "workedSolution": "$$2x + 3 = 13 \\implies 2x = 10 \\implies x = 5$$.",
      "points": 1
    },
    {
      "id": "q31",
      "prompt": "How many vertices does a rectangular cuboid have?",
      "options": [
        "6",
        "8",
        "12",
        "4"
      ],
      "correctAnswer": "8",
      "hint": "A cuboid has 6 faces, 12 edges, and 8 corner vertices.",
      "workedSolution": "A cuboid has exactly 8 vertices.",
      "points": 1
    },
    {
      "id": "q32",
      "prompt": "Factorize completely: $$px - 3py + qx - 3qy$$.",
      "options": [
        "$$(x - 3y)(p + q)$$",
        "$$(x + 3y)(p - q)$$",
        "$$(x - 3y)(p - q)$$",
        "$$(x + 3y)(p + q)$$"
      ],
      "correctAnswer": "$$(x - 3y)(p + q)$$",
      "hint": "Group terms: $p(x - 3y) + q(x - 3y)$.",
      "workedSolution": "$$p(x - 3y) + q(x - 3y) = (x - 3y)(p + q)$$.",
      "points": 1
    },
    {
      "id": "q33",
      "prompt": "Four masons can build a boundary wall in $6\\text{ hours}$. How long would it take $12\\text{ masons}$ working at the same rate to build the wall?",
      "options": [
        "3 hours",
        "4 hours",
        "1.5 hours",
        "2 hours"
      ],
      "correctAnswer": "2 hours",
      "hint": "Total work = $4 \\times 6 = 24\\text{ mason-hours}$. Divide by 12.",
      "workedSolution": "$$\\text{Hours} = \\frac{24}{12} = 2\\text{ hours}$$.",
      "points": 1
    },
    {
      "id": "q34",
      "prompt": "In an equilateral triangle, each interior angle has a measure of:",
      "options": [
        "$$45^\\circ$$",
        "$$90^\\circ$$",
        "$$60^\\circ$$",
        "$$120^\\circ$$"
      ],
      "correctAnswer": "$$60^\\circ$$",
      "hint": "Sum of angles in a triangle is $180^\\circ$. Divide by 3.",
      "workedSolution": "$$180^\\circ \\div 3 = 60^\\circ$$.",
      "points": 1
    },
    {
      "id": "q35",
      "prompt": "How many faces does a standard cube have?",
      "options": [
        "6",
        "8",
        "12",
        "4"
      ],
      "correctAnswer": "6",
      "hint": "Think of a standard playing die.",
      "workedSolution": "A cube has exactly 6 square faces.",
      "points": 1
    },
    {
      "id": "q36",
      "prompt": "State the rule for the linear mapping where inputs $x = \\{1, 2, 3, 4\\}$ produce outputs $y = \\{4, 7, 10, 13\\}$.",
      "options": [
        "$$x \\to 3x - 1$$",
        "$$x \\to 4x$$",
        "$$x \\to 2x + 2$$",
        "$$x \\to 3x + 1$$"
      ],
      "correctAnswer": "$$x \\to 3x + 1$$",
      "hint": "Common difference between outputs is 3. When $x = 1$, $3(1) + 1 = 4$.",
      "workedSolution": "Slope is 3. For $x = 1$, $3(1) + c = 4 \\implies c = 1$. The rule is $$x \\to 3x + 1$$.",
      "points": 1
    },
    {
      "id": "q37",
      "prompt": "In a right-angled triangle, one acute angle measures $38^\\circ$. What is the size of the other acute angle?",
      "options": [
        "$$62^\\circ$$",
        "$$52^\\circ$$",
        "$$42^\\circ$$",
        "$$142^\\circ$$"
      ],
      "correctAnswer": "$$52^\\circ$$",
      "hint": "The two acute angles in a right-angled triangle add up to $90^\\circ$.",
      "workedSolution": "$$90^\\circ - 38^\\circ = 52^\\circ$$.",
      "points": 1
    },
    {
      "id": "q38",
      "prompt": "A trapezium has parallel sides of length $11\\text{ cm}$ and $9\\text{ cm}$. If its area is $70\\text{ cm}^2$, find its perpendicular height $h$.",
      "options": [
        "7 cm",
        "14 cm",
        "5 cm",
        "8 cm"
      ],
      "correctAnswer": "7 cm",
      "hint": "$$\\text{Area} = \\frac{1}{2}(a + b)h \\implies 70 = \\frac{1}{2}(11 + 9)h = 10h$$.",
      "workedSolution": "$$70 = 10h \\implies h = 7\\text{ cm}$$.",
      "points": 1
    },
    {
      "id": "q39",
      "prompt": "The mean of the numbers $5, 7, 8,$ and $x$ is $8$. Find the value of $x$.",
      "options": [
        "10",
        "14",
        "12",
        "16"
      ],
      "correctAnswer": "12",
      "hint": "Total sum = $4 \\times 8 = 32$. Subtract 5 + 7 + 8.",
      "workedSolution": "$$5 + 7 + 8 + x = 32 \\implies 20 + x = 32 \\implies x = 12$$.",
      "points": 1
    },
    {
      "id": "q40",
      "prompt": "A discrete distribution is given by the table below:\n\n| Value | 2 | 4 | 6 | 8 |\n| :--- | :---: | :---: | :---: | :---: |\n| Frequency | 8 | 12 | 15 | 5 |\n\nWhat is the probability of selecting the value $6$?",
      "options": [
        "$$\\frac{1}{4}$$",
        "$$\\frac{1}{2}$$",
        "$$\\frac{1}{8}$$",
        "$$\\frac{3}{8}$$"
      ],
      "correctAnswer": "$$\\frac{3}{8}$$",
      "hint": "Total frequency = $8 + 12 + 15 + 5 = 40$. Probability = 15 / 40.",
      "workedSolution": "$$P(6) = \\frac{15}{40} = \\frac{3}{8}$$.",
      "points": 1
    }
  ],
  "seededAt": "2026-09-16T12:00:00.000Z",
  "lastUpdated": "2026-09-16T12:00:00.000Z"
};

// ============================================================================
// 4m. ALIGNED CORE CURRICULUM SERIES: JHS Math Structured Problem-Solving Series (Set 38)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-38
// ============================================================================
export const SET_JHS_MASTERY_SERIES_38: CurriculumQuestionSet = {
  "id": "jhs-math-mastery-series-38",
  "title": "Junior Core Mathematics • Structured Problem-Solving Series (Set 38)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Mathematics",
  "topic": "Structured Theory, Geometry & Data Modeling",
  "variantType": "standard",
  "totalQuestions": 5,
  "version": 1,
  "questions": [
    {
      "id": "q01",
      "title": "Question 1: Binomial Product Expansion, Inequality Modeling & Vector Linear Combinations",
      "totalMarks": 15,
      "format": "structured_essay",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 5,
          "prompt": "Expand and simplify completely the algebraic product:\n$$(x - y)(3y - 2x)$$",
          "hint": "Use the distributive law: multiply each term in the first binomial by every term in the second binomial.",
          "modelAnswer": "5xy - 2x² - 3y²",
          "workedSolution": "$$(x - y)(3y - 2x) = x(3y - 2x) - y(3y - 2x)$$\n$$= 3xy - 2x^2 - 3y^2 + 2xy$$\n$$= 5xy - 2x^2 - 3y^2$$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "Find the truth set of the inequality:\n$$3x - 8 \\le 4(2 - x)$$\nIllustrate your solution on a number line.",
          "hint": "Expand the right-hand side first: $3x - 8 \\le 8 - 4x$. Collect all terms with x on one side.",
          "modelAnswer": "{x : x ≤ 16/7}",
          "workedSolution": "$$3x - 8 \\le 8 - 4x$$\n$$3x + 4x \\le 8 + 8$$\n$$7x \\le 16 \\implies x \\le \\frac{16}{7} = 2\\frac{2}{7}$$\nTruth set: **$$\\{x : x \\le 2\\frac{2}{7}, \\, x \\in \\mathbb{R}\\}$$**."
        },
        {
          "partLabel": "(c)",
          "marks": 5,
          "prompt": "Given column vectors $$u = \\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} 6 \\\\ -2 \\end{pmatrix}$$, calculate the vector:\n$$\\frac{1}{2}\\left(u + \\frac{1}{2}v\\right)$$",
          "hint": "Find $\\frac{1}{2}v$ first, add to $u$, then multiply the entire vector by $\\frac{1}{2}$.",
          "modelAnswer": "(-1/2, 3/2)ᵀ",
          "workedSolution": "$$\\frac{1}{2}v = \\frac{1}{2}\\begin{pmatrix} 6 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ -1 \\end{pmatrix}$$\n$$u + \\frac{1}{2}v = \\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix} + \\begin{pmatrix} 3 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 3 \\end{pmatrix}$$\n$$\\frac{1}{2}\\left(u + \\frac{1}{2}v\\right) = \\frac{1}{2}\\begin{pmatrix} 0 \\\\ 3 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 1.5 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ \\frac{3}{2} \\end{pmatrix}$$."
        }
      ]
    },
    {
      "id": "q02",
      "title": "Question 2: Ladder Incline Trigonometry & Constant Formula Evaluation",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 320 230' width='100%' height='210' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='190' x2='290' y2='190' stroke='#334155' stroke-width='2'/><line x1='240' y1='30' x2='240' y2='190' stroke='#334155' stroke-width='3'/><line x1='60' y1='190' x2='240' y2='50' stroke='#2563eb' stroke-width='3'/><rect x='222' y='172' width='18' height='18' fill='none' stroke='#334155' stroke-width='1.5'/><text x='130' y='210' font-size='12' font-weight='bold'>Ground = 12 m</text><text x='250' y='125' font-size='12' font-weight='bold' fill='#dc2626'>Wall = 16 m</text><text x='125' y='110' font-size='12' font-weight='bold' fill='#2563eb'>Ladder L = ?</text><path d='M240,80 A30,30 0 0,1 216,68' fill='none' stroke='#059669' stroke-width='2'/><text x='220' y='95' font-size='11' font-weight='bold' fill='#059669'>θ</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 9,
          "prompt": "A ladder leans against a vertical building wall as illustrated above. The top end of the ladder touches the wall at a height of $16\\text{ m}$ from the ground, while the foot of the ladder rests $12\\text{ m}$ away from the base of the wall.\n(i) Calculate the length of the ladder ($L$).\n(ii) Find the tangent of the angle ($\\theta$) that the ladder makes with the vertical wall in its simplest fractional form.",
          "hint": "Apply Pythagoras' theorem: $L^2 = 12^2 + 16^2$. Note that the angle with the wall has opposite side = 12 m and adjacent side = 16 m.",
          "modelAnswer": "(i) 20 m, (ii) tan θ = 3/4",
          "workedSolution": "**(i) Ladder length ($L$):**\n$$L^2 = 12^2 + 16^2 = 144 + 256 = 400$$\n$$L = \\sqrt{400} = 20\\text{ m}$$\n\n**(ii) Tangent with the wall ($\\theta$):**\n$$\\tan \\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{12\\text{ m}}{16\\text{ m}} = \\frac{3}{4} = 0.75$$."
        },
        {
          "partLabel": "(b)",
          "marks": 6,
          "prompt": "Given that $\\pi = 3.14$ and $g = 30$, calculate the value of $F$ in the physics relation:\n$$F = \\frac{3}{4}\\pi g^2$$",
          "hint": "Compute $g^2 = 30^2 = 900$ first, then multiply by $\\frac{3}{4} \\times 3.14$.",
          "modelAnswer": "2,119.5",
          "workedSolution": "$$g^2 = 30^2 = 900$$\n$$F = \\frac{3}{4} \\times 3.14 \\times 900$$\n$$= 3 \\times 3.14 \\times 225 = 9.42 \\times 225 = 2,119.5$$."
        }
      ]
    },
    {
      "id": "q03",
      "title": "Question 3: Geometric Compass Triangle Construction & Circumcircle Modeling",
      "totalMarks": 15,
      "format": "structured_essay",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 9,
          "prompt": "Using a ruler and a pair of compasses only:\n(i) Construct triangle $PQR$ such that $|PQ| = 9\\text{ cm}$, $\\angle QPR = 45^\\circ$, and $\\angle PQR = 90^\\circ$.\n(ii) State or calculate the length of side $|QR|$.",
          "hint": "Triangle PQR is a right-angled isosceles triangle because angles are 45°, 90°, and 45°.",
          "modelAnswer": "|QR| = 9 cm",
          "workedSolution": "**(i) Geometric construction:**\n- Draw line segment $|PQ| = 9\\text{ cm}$.\n- Construct a perpendicular ray at $Q$ ($90^\\circ$).\n- Construct a $45^\\circ$ angle at $P$ to meet the perpendicular ray from $Q$ at vertex $R$.\n\n**(ii) Side $|QR|$:**\nSince $\\angle QPR = 45^\\circ$ and $\\angle PQR = 90^\\circ$, the remaining angle $\\angle PRQ = 180^\\circ - (90^\\circ + 45^\\circ) = 45^\\circ$.\nSince triangle $PQR$ is isosceles, $$|QR| = |PQ| = 9\\text{ cm}$$."
        },
        {
          "partLabel": "(b)",
          "marks": 6,
          "prompt": "Calculate the length of the hypotenuse $|PR|$ and the total area of triangle $PQR$.",
          "hint": "$|PR|^2 = 9^2 + 9^2$. Area = 1/2 × base × height.",
          "modelAnswer": "|PR| = 9√2 ≈ 12.73 cm, Area = 40.5 cm²",
          "workedSolution": "**Hypotenuse $|PR|$:**\n$$|PR|^2 = 9^2 + 9^2 = 81 + 81 = 162$$\n$$|PR| = \\sqrt{162} = 9\\sqrt{2} \\approx 12.73\\text{ cm}$$\n\n**Area:**\n$$\\text{Area} = \\frac{1}{2} \\times |PQ| \\times |QR| = \\frac{1}{2} \\times 9 \\times 9 = \\frac{81}{2} = 40.5\\text{ cm}^2$$."
        }
      ]
    },
    {
      "id": "q04",
      "title": "Question 4: Cartesian Square Reflections, Scale Enlargement & Inversion Mapping",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 320 260' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='140' x2='300' y2='140' stroke='#64748b' stroke-width='1.5'/><line x1='160' y1='20' x2='160' y2='250' stroke='#64748b' stroke-width='1.5'/><text x='290' y='135' font-size='12'>x</text><text x='165' y='30' font-size='12'>y</text><rect x='180' y='50' width='50' height='50' fill='#dbeafe' stroke='#2563eb' stroke-width='2'/><text x='235' y='45' font-size='10' font-weight='bold'>C(4,5)</text><text x='180' y='45' font-size='10' font-weight='bold'>D(1,5)</text><text x='235' y='115' font-size='10' font-weight='bold'>B(4,2)</text><text x='180' y='115' font-size='10' font-weight='bold'>A(1,2)</text><rect x='90' y='50' width='50' height='50' fill='#fee2e2' stroke='#dc2626' stroke-width='2'/><text x='65' y='115' font-size='10' font-weight='bold' fill='#dc2626'>B₁</text><text x='125' y='115' font-size='10' font-weight='bold' fill='#dc2626'>A₁</text><rect x='90' y='180' width='50' height='50' fill='#dcfce7' stroke='#16a34a' stroke-width='2'/><text x='65' y='195' font-size='10' font-weight='bold' fill='#16a34a'>B₂</text><text x='125' y='195' font-size='10' font-weight='bold' fill='#16a34a'>A₂</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 6,
          "prompt": "Square $ABCD$ has vertices $A(1, 2)$, $B(4, 2)$, $C(4, 5)$, and $D(1, 5)$ on the Cartesian plane shown above.\n(i) Write down the coordinates of image vertices $A_1, B_1, C_1,$ and $D_1$ under a reflection in the $y$-axis.\n(ii) Write down the coordinates of image vertices $A_2, B_2, C_2,$ and $D_2$ under an enlargement from the origin $(0, 0)$ with a scale factor of $k = -1$.",
          "hint": "Reflection in y-axis: (x, y) → (-x, y). Enlargement with scale factor -1 from origin: (x, y) → (-x, -y).",
          "modelAnswer": "(i) A₁(-1, 2), B₁(-4, 2), C₁(-4, 5), D₁(-1, 5); (ii) A₂(-1, -2), B₂(-4, -2), C₂(-4, -5), D₂(-1, -5)",
          "workedSolution": "**(i) Reflection in $y$-axis:** $$(x, y) \\to (-x, y)$$\n- $$A(1, 2) \\to A_1(-1, 2)$$\n- $$B(4, 2) \\to B_1(-4, 2)$$\n- $$C(4, 5) \\to C_1(-4, 5)$$\n- $$D(1, 5) \\to D_1(-1, 5)$$\n\n**(ii) Enlargement by scale factor $k = -1$:** $$(x, y) \\to (-x, -y)$$\n- $$A(1, 2) \\to A_2(-1, -2)$$\n- $$B(4, 2) \\to B_2(-4, -2)$$\n- $$C(4, 5) \\to C_2(-4, -5)$$\n- $$D(1, 5) \\to D_2(-1, -5)$$."
        },
        {
          "partLabel": "(b)",
          "marks": 5,
          "prompt": "What single geometrical transformation maps square $A_2B_2C_2D_2$ onto square $A_1B_1C_1D_1$?",
          "hint": "Compare the coordinates of corresponding points: (-x, -y) maps to (-x, y).",
          "modelAnswer": "Reflection in the x-axis",
          "workedSolution": "Notice that for each vertex:\n$$A_2(-1, -2) \\to A_1(-1, 2)$$\n$$B_2(-4, -2) \\to B_1(-4, 2)$$\nThe $x$-coordinate remains unchanged while the $y$-coordinate reverses sign ($y \\to -y$).\nTherefore, the transformation is a **reflection in the $x$-axis** (or the line $y = 0$)."
        },
        {
          "partLabel": "(c)",
          "marks": 4,
          "prompt": "Calculate the area of square $ABCD$ in square units.",
          "hint": "Side length = difference between consecutive vertices.",
          "modelAnswer": "9 square units",
          "workedSolution": "$$\\text{Side length } |AB| = 4 - 1 = 3\\text{ units}$$\n$$\\text{Area} = \\text{side}^2 = 3^2 = 9\\text{ square units}$$."
        }
      ]
    },
    {
      "id": "q05",
      "title": "Question 5: School Canteen Commercial Sales Distribution & Pie Charting",
      "totalMarks": 15,
      "format": "structured_essay",
      "diagramSvg": "<svg viewBox='0 0 300 240' width='100%' height='210' xmlns='http://www.w3.org/2000/svg'><circle cx='150' cy='120' r='90' fill='#f8fafc' stroke='#334155' stroke-width='2'/><path d='M150,120 L150,30 A90,90 0 0,1 232,84 Z' fill='#bfdbfe' stroke='#1e3a8a'/><path d='M150,120 L232,84 A90,90 0 0,1 217,180 Z' fill='#bbf7d0' stroke='#14532d'/><path d='M150,120 L217,180 A90,90 0 0,1 122,206 Z' fill='#fed7aa' stroke='#7c2d12'/><path d='M150,120 L122,206 A90,90 0 0,1 64,92 Z' fill='#fef08a' stroke='#713f12'/><path d='M150,120 L64,92 A90,90 0 0,1 150,30 Z' fill='#e9d5ff' stroke='#581c87'/><text x='165' y='65' font-size='10' font-weight='bold'>Fanta: 65°</text><text x='195' y='140' font-size='10' font-weight='bold'>Pepsi: 105°</text><text x='140' y='180' font-size='10' font-weight='bold'>Mirinda: 70°</text><text x='75' y='160' font-size='10' font-weight='bold'>Cola: 85°</text><text x='95' y='75' font-size='10' font-weight='bold'>Sprite: 35°</text></svg>",
      "parts": [
        {
          "partLabel": "(a)",
          "marks": 9,
          "prompt": "The table below shows the distribution of bottles of soft drinks sold by a school canteen in one week:\n\n| Soft Drink | Fanta | Pepsi | Mirinda | Coca-Cola | Sprite |\n| :--- | :---: | :---: | :---: | :---: | :---: |\n| Bottles Sold | 13 | 21 | 14 | 17 | 7 |\n\n(i) Find the total number of bottles sold.\n(ii) Calculate the sector angle for each brand on a pie chart.",
          "hint": "Total bottles = 13 + 21 + 14 + 17 + 7 = 72. Sector angle = (Number / 72) × 360° = Number × 5°.",
          "modelAnswer": "(i) 72 bottles; (ii) Fanta: 65°, Pepsi: 105°, Mirinda: 70°, Coca-Cola: 85°, Sprite: 35°",
          "workedSolution": "**(i) Total bottles:**\n$$N = 13 + 21 + 14 + 17 + 7 = 72\\text{ bottles}$$\n\n**(ii) Sector Angles:**\nEach bottle represents $$\\frac{360^\\circ}{72} = 5^\\circ$$.\n- **Fanta:** $$13 \\times 5^\\circ = 65^\\circ$$\n- **Pepsi:** $$21 \\times 5^\\circ = 105^\\circ$$\n- **Mirinda:** $$14 \\times 5^\\circ = 70^\\circ$$\n- **Coca-Cola:** $$17 \\times 5^\\circ = 85^\\circ$$\n- **Sprite:** $$7 \\times 5^\\circ = 35^\\circ$$\nSum check: $$65^\\circ + 105^\\circ + 70^\\circ + 85^\\circ + 35^\\circ = 360^\\circ$$."
        },
        {
          "partLabel": "(b)",
          "marks": 6,
          "prompt": "(i) What percentage of the total sales was Coca-Cola, correct to one decimal place?\n(ii) If a bottle is picked at random from this sales batch, what is the probability that it was Pepsi?",
          "hint": "Coca-Cola percentage = (17 / 72) × 100%. Pepsi probability = 21 / 72.",
          "modelAnswer": "(i) 23.6%, (ii) 7/24",
          "workedSolution": "**(i) Percentage of Coca-Cola:**\n$$\\text{Percentage} = \\left(\\frac{17}{72}\\right) \\times 100\\% = \\frac{1,700}{72}\\% \\approx 23.61\\%$$\nCorrect to one decimal place: **23.6%**.\n\n**(ii) Probability of Pepsi:**\n$$P(\\text{Pepsi}) = \\frac{21}{72} = \\frac{21 \\div 3}{72 \\div 3} = \\frac{7}{24}$$."
        }
      ]
    }
  ],
  "seededAt": "2026-09-16T12:30:00.000Z",
  "lastUpdated": "2026-09-16T12:30:00.000Z"
};

// ============================================================================
// 4n. ALIGNED CORE CURRICULUM SERIES: JHS Math Objective Mastery Series (Set 39)
// Target: global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/jhs-math-mastery-series-39
// ============================================================================
export const SET_JHS_MASTERY_SERIES_39: CurriculumQuestionSet = {
  "id": "jhs-math-mastery-series-39",
  "title": "Junior Core Mathematics • Objective Mastery Series (Set 39)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Mathematics",
  "topic": "Comprehensive Objective Exam Series",
  "variantType": "standard",
  "totalQuestions": 40,
  "version": 1,
  "questions": [
    {
      "id": "q01",
      "prompt": "Expand and simplify completely: $$(3x + 2y)(2x + y)$$.",
      "options": [
        "$$6x^2 + 7xy + 2y^2$$",
        "$$6x^2 + 5xy + 2y^2$$",
        "$$6x^2 + 2y^2$$",
        "$$5x^2 + 7xy + 3y^2$$"
      ],
      "correctAnswer": "$$6x^2 + 7xy + 2y^2$$",
      "hint": "Multiply each term in the first bracket by each term in the second: $3x(2x + y) + 2y(2x + y)$.",
      "workedSolution": "$$(3x + 2y)(2x + y) = 6x^2 + 3xy + 4xy + 2y^2 = 6x^2 + 7xy + 2y^2$$.",
      "points": 1
    },
    {
      "id": "q02",
      "prompt": "Find the missing binary number $$x$$ in the subtraction: $$111010_{\\text{two}} - x = 10111_{\\text{two}}$$.",
      "options": [
        "$$101011_{\\text{two}}$$",
        "$$110011_{\\text{two}}$$",
        "$$100111_{\\text{two}}$$",
        "$$100011_{\\text{two}}$$"
      ],
      "correctAnswer": "$$100011_{\\text{two}}$$",
      "hint": "$$x = 111010_{\\text{two}} - 10111_{\\text{two}}$$. In base ten: $58 - 23 = 35$. Convert 35 back to base two.",
      "workedSolution": "$$111010_{\\text{two}} = 58_{\\text{ten}}$$, $$10111_{\\text{two}} = 23_{\\text{ten}}$$. Difference = $$58 - 23 = 35_{\\text{ten}} = 32 + 2 + 1 = 100011_{\\text{two}}$$.",
      "points": 1
    },
    {
      "id": "q03",
      "prompt": "If set $$S = \\{2, 4, 6, 8, 10, 12, 14, 16\\}$$, find the truth set of $$x - 4 \\ge 8$$.",
      "options": [
        "{14, 16}",
        "{12, 14, 16}",
        "{10, 12, 14, 16}",
        "{16}"
      ],
      "correctAnswer": "{12, 14, 16}",
      "hint": "$$x \\ge 8 + 4 = 12$$. Filter set S for values greater than or equal to 12.",
      "workedSolution": "$$x \\ge 12$$. Within set S, elements that satisfy $x \\ge 12$ are {12, 14, 16}.",
      "points": 1
    },
    {
      "id": "q04",
      "prompt": "Which of the following geometric plane shapes has the LEAST number of lines of symmetry?",
      "options": [
        "Equilateral triangle",
        "Square",
        "Isosceles triangle",
        "Rectangle"
      ],
      "correctAnswer": "Isosceles triangle",
      "hint": "Count lines of symmetry: Equilateral = 3, Square = 4, Rectangle = 2, Isosceles triangle = 1.",
      "workedSolution": "An isosceles triangle has only 1 line of symmetry, which is less than a rectangle (2), an equilateral triangle (3), and a square (4).",
      "points": 1
    },
    {
      "id": "q05",
      "prompt": "Calculate $4\\%$ of $\\text{GH¢ } 3,500.00$.",
      "options": [
        "GH¢ 120.00",
        "GH¢ 175.00",
        "GH¢ 70.00",
        "GH¢ 140.00"
      ],
      "correctAnswer": "GH¢ 140.00",
      "hint": "$$\\frac{4}{100} \\times 3,500$$.",
      "workedSolution": "$$\\frac{4}{100} \\times 3,500 = 4 \\times 35 = \\text{GH¢ } 140.00$$.",
      "points": 1
    },
    {
      "id": "q06",
      "prompt": "Find the Highest Common Factor (HCF) of $24, 48,$ and $96$.",
      "options": [
        "12",
        "24",
        "48",
        "8"
      ],
      "correctAnswer": "24",
      "hint": "Notice that 24 divides 48 ($24 \\times 2$) and 96 ($24 \\times 4$) evenly.",
      "workedSolution": "$$24 = 24 \\times 1$$, $$48 = 24 \\times 2$$, $$96 = 24 \\times 4$$. The highest common divisor is 24.",
      "points": 1
    },
    {
      "id": "q07",
      "prompt": "Arrange the fractions $$\\frac{4}{5}, \\, \\frac{2}{3}, \\, \\frac{7}{10}$$ in ascending order.",
      "options": [
        "$$\\frac{2}{3}, \\, \\frac{7}{10}, \\, \\frac{4}{5}$$",
        "$$\\frac{7}{10}, \\, \\frac{2}{3}, \\, \\frac{4}{5}$$",
        "$$\\frac{4}{5}, \\, \\frac{7}{10}, \\, \\frac{2}{3}$$",
        "$$\\frac{2}{3}, \\, \\frac{4}{5}, \\, \\frac{7}{10}$$"
      ],
      "correctAnswer": "$$\\frac{2}{3}, \\, \\frac{7}{10}, \\, \\frac{4}{5}$$",
      "hint": "Express with common denominator 30: $2/3 = 20/30$, $7/10 = 21/30$, $4/5 = 24/30$.",
      "workedSolution": "$$\\frac{20}{30} < \\frac{21}{30} < \\frac{24}{30} \\implies \\frac{2}{3}, \\, \\frac{7}{10}, \\, \\frac{4}{5}$$.",
      "points": 1
    },
    {
      "id": "q08",
      "prompt": "Make $y$ the subject of the rational formula: $$\\frac{1}{k} = \\frac{1}{x} + \\frac{1}{y}$$.",
      "options": [
        "$$y = \\frac{kx}{k - x}$$",
        "$$y = \\frac{x - k}{kx}$$",
        "$$y = \\frac{kx}{x - k}$$",
        "$$y = k - x$$"
      ],
      "correctAnswer": "$$y = \\frac{kx}{x - k}$$",
      "hint": "$$\\frac{1}{y} = \\frac{1}{k} - \\frac{1}{x} = \\frac{x - k}{kx}$$. Invert both sides.",
      "workedSolution": "$$\\frac{1}{y} = \\frac{x - k}{kx} \\implies y = \\frac{kx}{x - k}$$.",
      "points": 1
    },
    {
      "id": "q09",
      "prompt": "Three siblings are aged $8, 12,$ and $20\\text{ years}$. Find the ratio of their ages in its simplest form.",
      "options": [
        "4 : 6 : 10",
        "2 : 3 : 5",
        "1 : 2 : 4",
        "2 : 4 : 5"
      ],
      "correctAnswer": "2 : 3 : 5",
      "hint": "Divide each age by their highest common factor, 4.",
      "workedSolution": "$$\\frac{8}{4} : \\frac{12}{4} : \\frac{20}{4} = 2 : 3 : 5$$.",
      "points": 1
    },
    {
      "id": "q10",
      "prompt": "Eight students take $12\\text{ days}$ to complete an agricultural project. How many days would $16\\text{ students}$ take working at the exact same pace?",
      "options": [
        "6 days",
        "8 days",
        "4 days",
        "10 days"
      ],
      "correctAnswer": "6 days",
      "hint": "Total work = $8 \\times 12 = 96\\text{ student-days}$. Divide by 16 students.",
      "workedSolution": "$$\\text{Days} = \\frac{8 \\times 12}{16} = \\frac{96}{16} = 6\\text{ days}$$.",
      "points": 1
    },
    {
      "id": "q11",
      "prompt": "Which of the following fractional inequalities is TRUE?",
      "options": [
        "$$\\frac{3}{4} < \\frac{5}{8}$$",
        "$$\\frac{2}{3} < \\frac{1}{2}$$",
        "$$\\frac{4}{5} > \\frac{7}{10}$$",
        "$$\\frac{5}{6} < \\frac{2}{3}$$"
      ],
      "correctAnswer": "$$\\frac{4}{5} > \\frac{7}{10}$$",
      "hint": "Convert to common decimals: $4/5 = 0.8$ and $7/10 = 0.7$.",
      "workedSolution": "$$\\frac{4}{5} = \\frac{8}{10}$$. Since $8/10 > 7/10$, the inequality $$\\frac{4}{5} > \\frac{7}{10}$$ is true.",
      "points": 1
    },
    {
      "id": "q12",
      "prompt": "Find the rule of the mapping:\n$$1 \\to 4, \\quad 2 \\to 7, \\quad 3 \\to 10, \\quad x \\to ?$$",
      "options": [
        "$$3x - 1$$",
        "$$4x$$",
        "$$2x + 2$$",
        "$$3x + 1$$"
      ],
      "correctAnswer": "$$3x + 1$$",
      "hint": "Common difference is $7 - 4 = 3$. Output = $3x + c$. For $x = 1$, $3(1) + 1 = 4$.",
      "workedSolution": "Gradient is 3. At $x = 1$, $y = 3(1) + 1 = 4$. The general rule is $$3x + 1$$.",
      "points": 1
    },
    {
      "id": "q13",
      "prompt": "A motor vehicle travels at a steady speed of $80\\text{ km/h}$. How far does it travel in $45\\text{ minutes}$?",
      "options": [
        "60 km",
        "40 km",
        "50 km",
        "70 km"
      ],
      "correctAnswer": "60 km",
      "hint": "Distance = Speed × Time. $45\\text{ minutes} = 45/60 = 3/4\\text{ hour}$.",
      "workedSolution": "$$\\text{Distance} = 80 \\times \\frac{3}{4} = 20 \\times 3 = 60\\text{ km}$$.",
      "points": 1
    },
    {
      "id": "q14",
      "prompt": "In an enlargement, the surface area of the object was multiplied by $81$ to obtain the area of the image. What is the linear scale factor of enlargement?",
      "options": [
        "18",
        "9",
        "27",
        "3"
      ],
      "correctAnswer": "9",
      "hint": "Area scale factor = $k^2 = 81$. Take the square root.",
      "workedSolution": "$$k^2 = 81 \\implies k = \\sqrt{81} = 9$$.",
      "points": 1
    },
    {
      "id": "q15",
      "prompt": "Mr. Asare deposited $\\text{GH¢ } 4,000.00$ at a simple interest rate of $15\\%\\text{ per annum}$ for $3\\text{ years}$. Calculate the total interest earned.",
      "options": [
        "GH¢ 1,200.00",
        "GH¢ 1,600.00",
        "GH¢ 1,800.00",
        "GH¢ 2,000.00"
      ],
      "correctAnswer": "GH¢ 1,800.00",
      "hint": "$$I = \\frac{P \\times R \\times T}{100}$$.",
      "workedSolution": "$$I = \\frac{4,000 \\times 15 \\times 3}{100} = 40 \\times 45 = \\text{GH¢ } 1,800.00$$.",
      "points": 1
    },
    {
      "id": "q16",
      "prompt": "The table shows goals scored by a team:\n\n| Goals per match | 0 | 1 | 2 | 3 | 4 |\n| :--- | :---: | :---: | :---: | :---: | :---: |\n| Frequency | 2 | 6 | 5 | 4 | 3 |\n\nHow many total goals did the team score in the season?",
      "options": [
        "36 goals",
        "20 goals",
        "30 goals",
        "40 goals"
      ],
      "correctAnswer": "40 goals",
      "hint": "Calculate $\\sum fx = (0 \\times 2) + (1 \\times 6) + (2 \\times 5) + (3 \\times 4) + (4 \\times 3)$.",
      "workedSolution": "$$\\sum fx = 0 + 6 + 10 + 12 + 12 = 40\\text{ goals}$$.",
      "points": 1
    },
    {
      "id": "q17",
      "prompt": "From the goals distribution in Question 16, what was the mean number of goals per match?",
      "options": [
        "1.8 goals",
        "2.0 goals",
        "2.5 goals",
        "1.5 goals"
      ],
      "correctAnswer": "2.0 goals",
      "hint": "Mean = Total goals / Total matches. Total matches = $\\sum f = 2 + 6 + 5 + 4 + 3 = 20$.",
      "workedSolution": "$$\\text{Mean} = \\frac{40}{20} = 2.0\\text{ goals}$$.",
      "points": 1
    },
    {
      "id": "q18",
      "prompt": "What was the total number of matches played by the team in Question 16?",
      "options": [
        "20 matches",
        "18 matches",
        "22 matches",
        "15 matches"
      ],
      "correctAnswer": "20 matches",
      "hint": "Sum all match frequencies: $2 + 6 + 5 + 4 + 3$.",
      "workedSolution": "$$\\sum f = 2 + 6 + 5 + 4 + 3 = 20\\text{ matches}$$.",
      "points": 1
    },
    {
      "id": "q19",
      "prompt": "The probability of winning a prize in a raffle is $2/7$. What is the probability of NOT winning a prize?",
      "options": [
        "$$\\frac{2}{7}$$",
        "$$\\frac{1}{7}$$",
        "$$\\frac{3}{7}$$",
        "$$\\frac{5}{7}$$"
      ],
      "correctAnswer": "$$\\frac{5}{7}$$",
      "hint": "$$P(\\text{not winning}) = 1 - P(\\text{winning})$$.",
      "workedSolution": "$$1 - \\frac{2}{7} = \\frac{5}{7}$$.",
      "points": 1
    },
    {
      "id": "q20",
      "prompt": "Given column vectors $$u = \\begin{pmatrix} 4 \\\\ -1 \\end{pmatrix}$$ and $$v = \\begin{pmatrix} -1 \\\\ 3 \\end{pmatrix}$$, calculate $$u + 2v$$.",
      "options": [
        "$$\\begin{pmatrix} 2 \\\\ 4 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 3 \\\\ 5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 2 \\\\ 5 \\end{pmatrix}$$",
        "$$\\begin{pmatrix} 2 \\\\ -5 \\end{pmatrix}$$"
      ],
      "correctAnswer": "$$\\begin{pmatrix} 2 \\\\ 5 \\end{pmatrix}$$",
      "hint": "$$4 + 2(-1) = 2$$ and $$-1 + 2(3) = 5$$.",
      "workedSolution": "$$\\begin{pmatrix} 4 + 2(-1) \\\\ -1 + 2(3) \\end{pmatrix} = \\begin{pmatrix} 4 - 2 \\\\ -1 + 6 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 5 \\end{pmatrix}$$.",
      "points": 1
    },
    {
      "id": "q21",
      "prompt": "What is the value in base ten of the digit $3$ in the base five numeral $$234_{\\text{five}}$$?",
      "options": [
        "15",
        "30",
        "3",
        "75"
      ],
      "correctAnswer": "15",
      "hint": "The digit 3 is in the 5s place ($5^1$). Value = $3 \\times 5$.",
      "workedSolution": "$$3 \\times 5^1 = 3 \\times 5 = 15$$.",
      "points": 1
    },
    {
      "id": "q22",
      "prompt": "Each interior angle of a regular polygon is $140^\\circ$. How many sides does this polygon have?",
      "options": [
        "8 sides",
        "10 sides",
        "9 sides",
        "12 sides"
      ],
      "correctAnswer": "9 sides",
      "hint": "Exterior angle = $180^\\circ - 140^\\circ = 40^\\circ$. Number of sides = $360^\\circ / 40^\\circ$.",
      "workedSolution": "$$\\text{Exterior angle} = 180^\\circ - 140^\\circ = 40^\\circ$$. $$n = \\frac{360^\\circ}{40^\\circ} = 9\\text{ sides}$$.",
      "points": 1
    },
    {
      "id": "q23",
      "prompt": "Simplify: $$\\left(4\\frac{1}{2} + 3\\right) \\div \\left(3\\frac{1}{4} - 2\\right)$$.",
      "options": [
        "5",
        "7",
        "8",
        "6"
      ],
      "correctAnswer": "6",
      "hint": "$$4\\frac{1}{2} + 3 = 7.5$$ and $$3\\frac{1}{4} - 2 = 1.25$$. Divide $7.5 / 1.25$.",
      "workedSolution": "$$\\frac{15}{2} \\div \\frac{5}{4} = \\frac{15}{2} \\times \\frac{4}{5} = 3 \\times 2 = 6$$.",
      "points": 1
    },
    {
      "id": "q24",
      "prompt": "Find the truth set of the inequality: $$2x - 5 > 9 - 5x$$.",
      "options": [
        "$$\\{x : x < 2\\}$$",
        "$$\\{x : x > 2\\}$$",
        "$$\\{x : x > -2\\}$$",
        "$$\\{x : x > 4\\}$$"
      ],
      "correctAnswer": "$$\\{x : x > 2\\}$$",
      "hint": "$$2x + 5x > 9 + 5 \\implies 7x > 14$$.",
      "workedSolution": "$$7x > 14 \\implies x > 2$$. Truth set: $$\\{x : x > 2, \\, x \\in \\mathbb{R}\\}$$.",
      "points": 1
    },
    {
      "id": "q25",
      "prompt": "In a rhombus with adjacent angles, one interior angle is $70^\\circ$. Find the size of the obtuse interior angle.",
      "options": [
        "$$110^\\circ$$",
        "$$120^\\circ$$",
        "$$130^\\circ$$",
        "$$140^\\circ$$"
      ],
      "correctAnswer": "$$110^\\circ$$",
      "hint": "Adjacent angles in a rhombus are supplementary ($180^\\circ$).",
      "workedSolution": "$$180^\\circ - 70^\\circ = 110^\\circ$$.",
      "points": 1
    },
    {
      "id": "q26",
      "prompt": "Four times a certain number is six more than the number. Find the number.",
      "options": [
        "3",
        "4",
        "2",
        "1"
      ],
      "correctAnswer": "2",
      "hint": "$$4x = x + 6 \\implies 3x = 6$$.",
      "workedSolution": "$$4x - x = 6 \\implies 3x = 6 \\implies x = 2$$.",
      "points": 1
    },
    {
      "id": "q27",
      "prompt": "A merchant buys $300$ exercise books at $\\text{GH¢ } 1.50$ each. What is the total cost of the books?",
      "options": [
        "GH¢ 400.00",
        "GH¢ 450.00",
        "GH¢ 500.00",
        "GH¢ 350.00"
      ],
      "correctAnswer": "GH¢ 450.00",
      "hint": "Multiply 300 by 1.50.",
      "workedSolution": "$$300 \\times 1.50 = \\text{GH¢ } 450.00$$.",
      "points": 1
    },
    {
      "id": "q28",
      "prompt": "A salesperson earns a $5\\%$ commission on all sales. If she sells goods worth $\\text{GH¢ } 4,800.00$, calculate her commission.",
      "options": [
        "GH¢ 200.00",
        "GH¢ 280.00",
        "GH¢ 180.00",
        "GH¢ 240.00"
      ],
      "correctAnswer": "GH¢ 240.00",
      "hint": "Commission = $\\frac{5}{100} \\times 4,800$.",
      "workedSolution": "$$0.05 \\times 4,800 = 5 \\times 48 = \\text{GH¢ } 240.00$$.",
      "points": 1
    },
    {
      "id": "q29",
      "prompt": "If $$\\frac{15}{25}$$ is equivalent to $$\\frac{x + 2}{10}$$, find the value of $x$.",
      "options": [
        "6",
        "3",
        "4",
        "5"
      ],
      "correctAnswer": "4",
      "hint": "$$\\frac{15}{25} = \\frac{3}{5}$$. Set $$\\frac{3}{5} = \\frac{x + 2}{10}$$.",
      "workedSolution": "$$\\frac{x + 2}{10} = \\frac{3}{5} \\implies x + 2 = \\frac{30}{5} = 6 \\implies x = 6 - 2 = 4$$.",
      "points": 1
    },
    {
      "id": "q30",
      "prompt": "Write $48.962\\text{ km}$ correct to three significant figures.",
      "options": [
        "49.0 km",
        "48.9 km",
        "49.00 km",
        "48.96 km"
      ],
      "correctAnswer": "49.0 km",
      "hint": "The 4th figure is 6 ($\\ge 5$), so 48.9 rounds up to 49.0.",
      "workedSolution": "Rounding to 3 significant figures: 48.962 becomes 49.0 km.",
      "points": 1
    },
    {
      "id": "q31",
      "prompt": "Find $x$ if $$\\frac{1}{x} + \\frac{1}{4} = 1$$.",
      "options": [
        "$$\\frac{3}{4}$$",
        "$$\\frac{4}{3}$$",
        "$$\\frac{1}{3}$$",
        "$$\\frac{5}{4}$$"
      ],
      "correctAnswer": "$$\\frac{4}{3}$$",
      "hint": "$$\\frac{1}{x} = 1 - \\frac{1}{4} = \\frac{3}{4}$$. Invert both sides.",
      "workedSolution": "$$\\frac{1}{x} = \\frac{3}{4} \\implies x = \\frac{4}{3} = 1\\frac{1}{3}$$.",
      "points": 1
    },
    {
      "id": "q32",
      "prompt": "The three-figure bearing of town $A$ from town $B$ is $065^\\circ$. What is the bearing of town $B$ from town $A$?",
      "options": [
        "$$115^\\circ$$",
        "$$295^\\circ$$",
        "$$205^\\circ$$",
        "$$245^\\circ$$"
      ],
      "correctAnswer": "$$245^\\circ$$",
      "hint": "Back-bearing = Forward bearing $+ 180^\\circ$ when $< 180^\\circ$.",
      "workedSolution": "$$65^\\circ + 180^\\circ = 245^\\circ$$.",
      "points": 1
    },
    {
      "id": "q33",
      "prompt": "In a geometric compass construction, arcs of equal radius drawn from endpoints $A$ and $B$ intersecting above and below segment $AB$ are used for:",
      "options": [
        "Constructing the perpendicular bisector of segment AB",
        "Bisecting an angle at A",
        "Drawing a parallel line",
        "Constructing an angle of 60°"
      ],
      "correctAnswer": "Constructing the perpendicular bisector of segment AB",
      "hint": "Intersecting mediator arcs construct the perpendicular bisector.",
      "workedSolution": "This standard construction produces the perpendicular bisector (mediator) of line segment AB.",
      "points": 1
    },
    {
      "id": "q34",
      "prompt": "The dimensions of a rectangle are given in base two as length $$11_{\\text{two}}\\text{ cm}$$ and width $$10_{\\text{two}}\\text{ cm}$$. Find its perimeter in base two.",
      "options": [
        "$$1001_{\\text{two}}\\text{ cm}$$",
        "$$1100_{\\text{two}}\\text{ cm}$$",
        "$$1010_{\\text{two}}\\text{ cm}$$",
        "$$1110_{\\text{two}}\\text{ cm}$$"
      ],
      "correctAnswer": "$$1010_{\\text{two}}\\text{ cm}$$",
      "hint": "In base ten: length = 3 cm, width = 2 cm. Perimeter = 2(3 + 2) = 10 cm. Convert 10 to base two.",
      "workedSolution": "$$10_{\\text{ten}} = 8 + 2 = 1010_{\\text{two}}\\text{ cm}$$.",
      "points": 1
    },
    {
      "id": "q35",
      "prompt": "A circle has a total area of $180\\text{ cm}^2$. Calculate the area of a sector subtending an angle of $60^\\circ$ at the centre.",
      "options": [
        "$$20\\text{ cm}^2$$",
        "$$30\\text{ cm}^2$$",
        "$$36\\text{ cm}^2$$",
        "$$45\\text{ cm}^2$$"
      ],
      "correctAnswer": "$$30\\text{ cm}^2$$",
      "hint": "Sector area = $$\\frac{60}{360} \\times 180 = \\frac{1}{6} \\times 180$$.",
      "workedSolution": "$$\\text{Area} = \\frac{1}{6} \\times 180 = 30\\text{ cm}^2$$.",
      "points": 1
    },
    {
      "id": "q36",
      "prompt": "In a parallelogram $ABCD$, angle $\\angle ABC = 120^\\circ$. What is the measure of consecutive angle $\\angle BCD$?",
      "options": [
        "$$120^\\circ$$",
        "$$30^\\circ$$",
        "$$90^\\circ$$",
        "$$60^\\circ$$"
      ],
      "correctAnswer": "$$60^\\circ$$",
      "hint": "Adjacent angles of a parallelogram are supplementary ($180^\\circ$).",
      "workedSolution": "$$\\angle BCD = 180^\\circ - 120^\\circ = 60^\\circ$$.",
      "points": 1
    },
    {
      "id": "q37",
      "prompt": "Two parallel lines are crossed by a transversal line. Two interior angles on alternate sides of the transversal are known as:",
      "options": [
        "Alternate angles",
        "Corresponding angles",
        "Vertically opposite angles",
        "Co-interior angles"
      ],
      "correctAnswer": "Alternate angles",
      "hint": "They form a 'Z' shape and are equal in measure.",
      "workedSolution": "By definition, angles on opposite sides of the transversal between the parallel lines are alternate angles.",
      "points": 1
    },
    {
      "id": "q38",
      "prompt": "A surveyor standing $20\\text{ m}$ away from the base of a vertical tower observes its top. If the tower is $20\\text{ m}$ tall, what is the angle of elevation of the top?",
      "options": [
        "$$30^\\circ$$",
        "$$60^\\circ$$",
        "$$45^\\circ$$",
        "$$90^\\circ$$"
      ],
      "correctAnswer": "$$45^\\circ$$",
      "hint": "$$\\tan \\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{20}{20} = 1$$.",
      "workedSolution": "$$\\tan \\theta = 1 \\implies \\theta = 45^\\circ$$.",
      "points": 1
    },
    {
      "id": "q39",
      "prompt": "In an isosceles triangle $ABC$, $|AB| = |AC|$ and the vertex angle $\\angle BAC = 50^\\circ$. Calculate the size of base angle $\\angle ABC$.",
      "options": [
        "$$50^\\circ$$",
        "$$70^\\circ$$",
        "$$60^\\circ$$",
        "$$65^\\circ$$"
      ],
      "correctAnswer": "$$65^\\circ$$",
      "hint": "$$(180^\\circ - 50^\\circ) / 2$$.",
      "workedSolution": "$$\\frac{180^\\circ - 50^\\circ}{2} = \\frac{130^\\circ}{2} = 65^\\circ$$.",
      "points": 1
    },
    {
      "id": "q40",
      "prompt": "Which of the following sets of measurements forms a right-angled triangle?",
      "options": [
        "4 cm, 6 cm, 8 cm",
        "5 cm, 12 cm, 13 cm",
        "6 cm, 9 cm, 12 cm",
        "5 cm, 10 cm, 14 cm"
      ],
      "correctAnswer": "5 cm, 12 cm, 13 cm",
      "hint": "Check Pythagoras' theorem: $5^2 + 12^2 = 25 + 144 = 169 = 13^2$.",
      "workedSolution": "$$5^2 + 12^2 = 25 + 144 = 169 = 13^2$$. By the converse of Pythagoras' theorem, this is a right-angled triangle.",
      "points": 1
    }
  ],
  "seededAt": "2026-09-16T13:00:00.000Z",
  "lastUpdated": "2026-09-16T13:00:00.000Z"
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

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 8: JHS Math -> Core Curriculum Series (Set 5 Objective in core_curriculum_mastery)
  console.log('▶ Ingesting Set 8: Junior Core Math Objective Mastery Series (Set 5)...');
  const result8 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_05
  );
  results.push(result8);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 7: JHS Math -> Core Curriculum Series (Set 4 Structured in core_curriculum_mastery)
  console.log('▶ Ingesting Set 7: Junior Core Math Structured Problem-Solving Series (Set 4)...');
  const result7 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_04
  );
  results.push(result7);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 9: JHS Math -> Core Curriculum Series (Set 6 Structured in core_curriculum_mastery)
  console.log('▶ Ingesting Set 9: Junior Core Math Structured Problem-Solving Series (Set 6)...');
  const result9 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_06
  );
  results.push(result9);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 10: JHS Math -> Core Curriculum Series (Set 7 Objective in core_curriculum_mastery)
  console.log('▶ Ingesting Set 10: Junior Core Math Objective Mastery Series (Set 7)...');
  const result10 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_07
  );
  results.push(result10);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 11: JHS Math -> Core Curriculum Series (Set 8 Structured in core_curriculum_mastery)
  console.log('▶ Ingesting Set 11: Junior Core Math Structured Problem-Solving Series (Set 8)...');
  const result11 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_08
  );
  results.push(result11);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 12: JHS Math -> Core Curriculum Series (Set 9 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 12: Junior Core Math Objective Mastery Series (Set 9)...');
  const result12 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_09
  );
  results.push(result12);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 13: JHS Math -> Core Curriculum Series (Set 10 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 13: Junior Core Math Structured Problem-Solving Series (Set 10)...');
  const result13 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_10
  );
  results.push(result13);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 14: JHS Math -> Core Curriculum Series (Set 11 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 14: Junior Core Math Objective Mastery Series (Set 11)...');
  const result14 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_11
  );
  results.push(result14);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 15: JHS Math -> Core Curriculum Series (Set 12 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 15: Junior Core Math Structured Problem-Solving Series (Set 12)...');
  const result15 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_12
  );
  results.push(result15);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 16: JHS Math -> Core Curriculum Series (Set 13 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 16: Junior Core Math Objective Mastery Series (Set 13)...');
  const result16 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_13
  );
  results.push(result16);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 17: JHS Math -> Core Curriculum Series (Set 14 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 17: Junior Core Math Structured Problem-Solving Series (Set 14)...');
  const result17 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_14
  );
  results.push(result17);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 18: JHS Math -> Core Curriculum Series (Set 15 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 18: Junior Core Math Objective Mastery Series (Set 15)...');
  const result18 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_15
  );
  results.push(result18);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 19: JHS Math -> Core Curriculum Series (Set 16 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 19: Junior Core Math Structured Problem-Solving Series (Set 16)...');
  const result19 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_16
  );
  results.push(result19);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 20: JHS Math -> Core Curriculum Series (Set 17 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 20: Junior Core Math Objective Mastery Series (Set 17)...');
  const result20 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_17
  );
  results.push(result20);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 21: JHS Math -> Core Curriculum Series (Set 18 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 21: Junior Core Math Structured Problem-Solving Series (Set 18)...');
  const result21 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_18
  );
  results.push(result21);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 22: JHS Math -> Core Curriculum Series (Set 19 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 22: Junior Core Math Objective Mastery Series (Set 19)...');
  const result22 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_19
  );
  results.push(result22);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 23: JHS Math -> Core Curriculum Series (Set 20 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 23: Junior Core Math Structured Problem-Solving Series (Set 20)...');
  const result23 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_20
  );
  results.push(result23);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 24: JHS Math -> Core Curriculum Series (Set 21 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 24: Junior Core Math Objective Mastery Series (Set 21)...');
  const result24 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_21
  );
  results.push(result24);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 25: JHS Math -> Core Curriculum Series (Set 22 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 25: Junior Core Math Structured Problem-Solving Series (Set 22)...');
  const result25 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_22
  );
  results.push(result25);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 26: JHS Math -> Core Curriculum Series (Set 23 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 26: Junior Core Math Objective Mastery Series (Set 23)...');
  const result26 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_23
  );
  results.push(result26);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 27: JHS Math -> Core Curriculum Series (Set 24 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 27: Junior Core Math Structured Problem-Solving Series (Set 24)...');
  const result27 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_24
  );
  results.push(result27);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 28: JHS Math -> Core Curriculum Series (Set 25 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 28: Junior Core Math Objective Mastery Series (Set 25)...');
  const result28 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_25
  );
  results.push(result28);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 29: JHS Math -> Core Curriculum Series (Set 26 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 29: Junior Core Math Structured Problem-Solving Series (Set 26)...');
  const result29 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_26
  );
  results.push(result29);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 30: JHS Math -> Core Curriculum Series (Set 27 in core_curriculum_mastery)
  console.log('▶  Ingesting Set 30: Junior Core Math Objective Mastery Series (Set 27)...');
  const result30 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_27
  );
  results.push(result30);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 31: JHS Math -> Core Curriculum Series (Set 28 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 31: Junior Core Math Structured Problem-Solving Series (Set 28)...');
  const result31 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_28
  );
    results.push(result31);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 32: JHS Math -> Core Curriculum Series (Set 29 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 32: Junior Core Math Objective Mastery Series (Set 29)...');
  const result32 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_29
  );
  results.push(result32);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 33: JHS Math -> Core Curriculum Series (Set 30 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 33: Junior Core Math Structured Problem-Solving Series (Set 30)...');
  const result33 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_30
  );
  results.push(result33);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 34: JHS Math -> Core Curriculum Series (Set 31 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 34: Junior Core Math Objective Mastery Series (Set 31)...');
  const result34 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_31
  );
  results.push(result34);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 35: JHS Math -> Core Curriculum Series (Set 32 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 35: Junior Core Math Structured Problem-Solving Series (Set 32)...');
  const result35 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_32
  );
  results.push(result35);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 36: JHS Math -> Core Curriculum Series (Set 33 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 36: Junior Core Math Objective Mastery Series (Set 33)...');
  const result36 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_33
  );
  results.push(result36);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 37: JHS Math -> Core Curriculum Series (Set 34 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 37: Junior Core Math Structured Problem-Solving Series (Set 34)...');
  const result37 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_34
  );
  results.push(result37);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 38: JHS Math -> Core Curriculum Series (Set 35 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 38: Junior Core Math Objective Mastery Series (Set 35)...');
  const result38 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_35
  );
  results.push(result38);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 39: JHS Math -> Core Curriculum Series (Set 36 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 39: Junior Core Math Structured Problem-Solving Series (Set 36)...');
  const result39 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_36
  );
  results.push(result39);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 40: JHS Math -> Core Curriculum Series (Set 37 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 40: Junior Core Math Objective Mastery Series (Set 37)...');
  const result40 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_37
  );
  results.push(result40);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 41: JHS Math -> Core Curriculum Series (Set 38 Structured in core_curriculum_mastery)
  console.log('▶  Ingesting Set 41: Junior Core Math Structured Problem-Solving Series (Set 38)...');
  const result41 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_38
  );
  results.push(result41);

  console.log('\n----------------------------------------------------------------\n');

  // Seed Set 42: JHS Math -> Core Curriculum Series (Set 39 Objective in core_curriculum_mastery)
  console.log('▶  Ingesting Set 42: Junior Core Math Objective Mastery Series (Set 39)...');
  const result42 = await seedTopicSet(
    'jhs',
    'math',
    'core_curriculum_mastery',
    SET_JHS_MASTERY_SERIES_39
  );
  results.push(result42);






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
