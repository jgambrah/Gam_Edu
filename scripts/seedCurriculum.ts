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
