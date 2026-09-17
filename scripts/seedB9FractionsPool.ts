import * as dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gamedu-69888475-f5783';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const fallbackKeyPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';

if (!getApps().length) {
  if (clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } else if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    initializeApp({
      credential: cert(serviceAccountPath),
    });
  } else if (fs.existsSync(fallbackKeyPath)) {
    initializeApp({
      credential: cert(fallbackKeyPath),
    });
  } else {
    initializeApp({ projectId });
  }
}

const db = getFirestore();

// Helper: Greatest common divisor
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// -----------------------------------------------------------------------------
// 1. LOW TIER (DOK 1) - 50 ITEMS
// Focus: Direct conversion of single/double recurring decimals to vulgar fractions,
// direct simple discounts, marked vs selling price, single percentage deductions.
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b9_frac_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert the recurring decimal $0.\\dot{7}$ into a common fraction.",
    options: ["7/9", "7/10", "7/99", "77/100"],
    correctAnswer: "7/9",
    hint: "A single repeating digit $0.\\dot{a} = \\frac{a}{9}$.",
    workedSolution: "$$x = 0.777\\dots \\implies 10x - x = 7 \\implies 9x = 7 \\implies x = \\frac{7}{9}$$.",
    points: 1
  },
  {
    id: "q_b9_frac_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert $0.\\dot{5}\\dot{4}$ into a common fraction in its lowest terms.",
    options: ["6/11", "54/99", "27/50", "54/100"],
    correctAnswer: "6/11",
    hint: "Two repeating digits: $0.\\dot{a}\\dot{b} = \\frac{ab}{99}$. Reduce by 9.",
    workedSolution: "$$\\frac{54}{99} = \\frac{54 \\div 9}{99 \\div 9} = \\frac{6}{11}$$.",
    points: 1
  },
  {
    id: "q_b9_frac_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "An item marked $\\text{GH¢ } 500.00$ is sold at a $10\\%$ discount. What is the selling price?",
    options: ["GH¢ 450.00", "GH¢ 400.00", "GH¢ 490.00", "GH¢ 475.00"],
    correctAnswer: "GH¢ 450.00",
    hint: "Discount = $10\\% \\times 500 = 50$. Subtract discount from marked price.",
    workedSolution: "$$\\text{Selling Price} = 500 - 50 = \\text{GH¢ } 450.00$$.",
    points: 1
  },
  {
    id: "q_b9_frac_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert the recurring decimal $0.\\dot{1}\\dot{8}$ into a common fraction in simplest form.",
    options: ["2/11", "18/99", "9/50", "1/5"],
    correctAnswer: "2/11",
    hint: "$$\\frac{18}{99}$$. Divide numerator and denominator by 9.",
    workedSolution: "$$\\frac{18 \\div 9}{99 \\div 9} = \\frac{2}{11}$$.",
    points: 1
  },
  {
    id: "q_b9_frac_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the single discount percentage equivalent to a marked price of $\\text{GH¢ } 200.00$ sold for $\\text{GH¢ } 160.00$?",
    options: ["20%", "25%", "15%", "40%"],
    correctAnswer: "20%",
    hint: "Discount $= 200 - 160 = 40$. Percentage $= \\frac{40}{200} \\times 100\\%$.",
    workedSolution: "$$\\frac{40}{200} \\times 100\\% = 20\\%$$.",
    points: 1
  },
  {
    id: "q_b9_frac_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Express $0.\\dot{3}$ as a fraction in simplest terms.",
    options: ["1/3", "3/10", "3/99", "33/100"],
    correctAnswer: "1/3",
    hint: "$$\\frac{3}{9} = \\frac{1}{3}$$.",
    workedSolution: "$$\\frac{3}{9} = \\frac{1}{3}$$.",
    points: 1
  },
  {
    id: "q_b9_frac_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A shop gives a $5\\%$ cash discount on a bag costing $\\text{GH¢ } 80.00$. How much did the customer pay?",
    options: ["GH¢ 76.00", "GH¢ 75.00", "GH¢ 74.00", "GH¢ 78.00"],
    correctAnswer: "GH¢ 76.00",
    hint: "Discount $= 0.05 \\times 80 = 4$.",
    workedSolution: "$$80 - 4 = \\text{GH¢ } 76.00$$.",
    points: 1
  },
  {
    id: "q_b9_frac_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert $0.\\dot{9}$ to a whole number using algebraic recurring decimal rules.",
    options: ["1", "0.9", "9/10", "0.99"],
    correctAnswer: "1",
    hint: "$$x = 0.999\\dots \\implies 10x - x = 9 \\implies 9x = 9 \\implies x = 1$$.",
    workedSolution: "$$10x - x = 9.999\\dots - 0.999\\dots \\implies 9x = 9 \\implies x = 1$$.",
    points: 1
  },
  {
    id: "q_b9_frac_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A radio is discounted by $15\\%$. What fraction of the original marked price does the customer pay?",
    options: ["17/20", "3/20", "4/5", "85/10"],
    correctAnswer: "17/20",
    hint: "Customer pays $100\\% - 15\\% = 85\\% = \\frac{85}{100}$.",
    workedSolution: "$$\\frac{85 \\div 5}{100 \\div 5} = \\frac{17}{20}$$.",
    points: 1
  },
  {
    id: "q_b9_frac_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert $0.\\dot{6}$ into a common fraction.",
    options: ["2/3", "6/10", "3/5", "6/99"],
    correctAnswer: "2/3",
    hint: "$$\\frac{6}{9} = \\frac{2}{3}$$.",
    workedSolution: "$$\\frac{6}{9} = \\frac{2}{3}$$.",
    points: 1
  }
];

// Items 11 to 25: Pure recurring decimal conversions (single and double digits)
const recurringPairs = [
  { num: 1, den: 9, rep: "0.\\dot{1}", redNum: 1, redDen: 9 },
  { num: 2, den: 9, rep: "0.\\dot{2}", redNum: 2, redDen: 9 },
  { num: 4, den: 9, rep: "0.\\dot{4}", redNum: 4, redDen: 9 },
  { num: 5, den: 9, rep: "0.\\dot{5}", redNum: 5, redDen: 9 },
  { num: 8, den: 9, rep: "0.\\dot{8}", redNum: 8, redDen: 9 },
  { num: 27, den: 99, rep: "0.\\dot{2}\\dot{7}", redNum: 3, redDen: 11 },
  { num: 36, den: 99, rep: "0.\\dot{3}\\dot{6}", redNum: 4, redDen: 11 },
  { num: 45, den: 99, rep: "0.\\dot{4}\\dot{5}", redNum: 5, redDen: 11 },
  { num: 63, den: 99, rep: "0.\\dot{6}\\dot{3}", redNum: 7, redDen: 11 },
  { num: 72, den: 99, rep: "0.\\dot{7}\\dot{2}", redNum: 8, redDen: 11 },
  { num: 81, den: 99, rep: "0.\\dot{8}\\dot{1}", redNum: 9, redDen: 11 },
  { num: 12, den: 99, rep: "0.\\dot{1}\\dot{2}", redNum: 4, redDen: 33 },
  { num: 15, den: 99, rep: "0.\\dot{1}\\dot{5}", redNum: 5, redDen: 33 },
  { num: 21, den: 99, rep: "0.\\dot{2}\\dot{1}", redNum: 7, redDen: 33 },
  { num: 24, den: 99, rep: "0.\\dot{2}\\dot{4}", redNum: 8, redDen: 33 }
];

for (let i = 0; i < recurringPairs.length; i++) {
  const item = recurringPairs[i];
  const idx = 11 + i;
  const correct = `${item.redNum}/${item.redDen}`;
  const d1 = `${item.num}/100`;
  const d2 = `${item.num}/${item.den === 9 ? 10 : 90}`;
  const d3 = `${item.redNum + 1}/${item.redDen}`;
  const options = Array.from(new Set([correct, d1, d2, d3]));
  while (options.length < 4) {
    options.push(`${item.redNum}/${item.redDen + options.length}`);
  }

  lowQuestions.push({
    id: `q_b9_frac_l${idx < 10 ? '0' + idx : idx}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: `Convert the recurring decimal $${item.rep}$ into a fraction in its lowest terms.`,
    options: options.slice(0, 4),
    correctAnswer: correct,
    hint: `Express over ${item.den} and simplify by dividing by ${gcd(item.num, item.den)}.`,
    workedSolution: `$$x = ${item.rep} \\implies ${item.den === 9 ? '9x' : '99x'} = ${item.num} \\implies x = \\frac{${item.num}}{${item.den}} = \\frac{${item.redNum}}{${item.redDen}}$$.`,
    points: 1
  });
}

// Items 26 to 50: Direct discount and percentage of marked price computations
const discountScenarios = [
  { mp: 120, rate: 10 },
  { mp: 150, rate: 20 },
  { mp: 240, rate: 25 },
  { mp: 300, rate: 15 },
  { mp: 400, rate: 30 },
  { mp: 600, rate: 5 },
  { mp: 250, rate: 10 },
  { mp: 180, rate: 20 },
  { mp: 320, rate: 25 },
  { mp: 450, rate: 10 },
  { mp: 550, rate: 20 },
  { mp: 700, rate: 15 },
  { mp: 800, rate: 25 },
  { mp: 900, rate: 10 },
  { mp: 1200, rate: 5 },
  { mp: 1500, rate: 20 },
  { mp: 350, rate: 20 },
  { mp: 280, rate: 25 },
  { mp: 480, rate: 10 },
  { mp: 640, rate: 25 },
  { mp: 750, rate: 20 },
  { mp: 850, rate: 10 },
  { mp: 950, rate: 20 },
  { mp: 1100, rate: 15 },
  { mp: 1600, rate: 25 }
];

for (let i = 0; i < discountScenarios.length; i++) {
  const sc = discountScenarios[i];
  const idx = 26 + i;
  const discountVal = (sc.mp * sc.rate) / 100;
  const sp = sc.mp - discountVal;
  const correct = `GH¢ ${sp.toFixed(2)}`;
  const opt1 = `GH¢ ${(sc.mp - discountVal * 0.5).toFixed(2)}`;
  const opt2 = `GH¢ ${(sc.mp + discountVal).toFixed(2)}`;
  const opt3 = `GH¢ ${(sc.mp - discountVal * 1.5).toFixed(2)}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  lowQuestions.push({
    id: `q_b9_frac_l${idx < 10 ? '0' + idx : idx}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: `A textbook marked $\\text{GH¢ } ${sc.mp}.00$ is sold at a discount of $${sc.rate}\\%$. Calculate its selling price.`,
    options: options,
    correctAnswer: correct,
    hint: `Discount $= \\frac{${sc.rate}}{100} \\times ${sc.mp} = \\text{GH¢ } ${discountVal.toFixed(2)}$. Subtract from marked price.`,
    workedSolution: `$$\\text{Discount} = \\frac{${sc.rate}}{100} \\times ${sc.mp} = \\text{GH¢ } ${discountVal.toFixed(2)}$$\n$$\\text{Selling Price} = ${sc.mp} - ${discountVal} = \\text{GH¢ } ${sp.toFixed(2)}$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER (DOK 2) - 50 ITEMS
// Focus: Delayed mixed recurring decimals ($0.a\dot{b}$, $0.ab\dot{c}$),
// successive compound discounts, single-tier remainder allocations, markup/discount.
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b9_frac_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Convert the delayed recurring decimal $0.2\\dot{3}$ into a fraction in its simplest form.",
    options: ["7/30", "23/99", "23/90", "1/4"],
    correctAnswer: "7/30",
    hint: "$100x - 10x = 23.333\\dots - 2.333\\dots = 21$. Solve $90x = 21$.",
    workedSolution: "$$90x = 21 \\implies x = \\frac{21}{90} = \\frac{7}{30}$$.",
    points: 1
  },
  {
    id: "q_b9_frac_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Successive discounts of $10\\%$ and $10\\%$ on an item are equivalent to a single discount of:",
    options: ["19%", "20%", "21%", "18%"],
    correctAnswer: "19%",
    hint: "Let marked price be $100$. After first discount: $90$. After second discount: $90 - 9 = 81$. Total discount $= 100 - 81$.",
    workedSolution: "$$1 - (0.90 \\times 0.90) = 1 - 0.81 = 0.19 = 19\\%$$.",
    points: 1
  },
  {
    id: "q_b9_frac_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Convert $0.1\\dot{2}\\dot{7}$ to a common fraction in its lowest terms.",
    options: ["7/55", "127/990", "14/110", "63/495"],
    correctAnswer: "7/55",
    hint: "$1000x - 10x = 127.2727\\dots - 1.2727\\dots = 126$. $990x = 126$.",
    workedSolution: "$$990x = 126 \\implies x = \\frac{126}{990} = \\frac{63}{495} = \\frac{7}{55}$$.",
    points: 1
  },
  {
    id: "q_b9_frac_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A worker spends $\\frac{1}{4}$ of his basic salary on rent and $\\frac{2}{5}$ of the remainder on provisions. If he has $\\text{GH¢ } 900.00$ left, what was his basic salary?",
    options: ["GH¢ 2,000.00", "GH¢ 1,800.00", "GH¢ 2,400.00", "GH¢ 1,600.00"],
    correctAnswer: "GH¢ 2,000.00",
    hint: "Remainder after rent $= 3/4$. Provisions $= 2/5 \\times 3/4 = 3/10$. Leftover fraction $= 3/4 - 3/10 = 9/20$.",
    workedSolution: "$$\\text{Leftover fraction} = \\frac{3}{4} \\times \\left(1 - \\frac{2}{5}\\right) = \\frac{3}{4} \\times \\frac{3}{5} = \\frac{9}{20}$$\n$$\\frac{9}{20}S = 900 \\implies S = 900 \\times \\frac{20}{9} = \\text{GH¢ } 2,000.00$$.",
    points: 1
  },
  {
    id: "q_b9_frac_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A dealer offers successive trade discounts of $20\\%$ and $5\\%$. Find the net price of goods marked $\\text{GH¢ } 1,000.00$.",
    options: ["GH¢ 760.00", "GH¢ 750.00", "GH¢ 800.00", "GH¢ 740.00"],
    correctAnswer: "GH¢ 760.00",
    hint: "Net price $= 1000 \\times (1 - 0.20) \\times (1 - 0.05) = 1000 \\times 0.80 \\times 0.95$.",
    workedSolution: "$$1,000 \\times 0.80 \\times 0.95 = 800 \\times 0.95 = \\text{GH¢ } 760.00$$.",
    points: 1
  }
];

// Items 6 to 25: Delayed mixed recurring decimals ($0.a\dot{b}$ and similar)
const mixedRecurData = [
  { a: 1, b: 6, rep: "0.1\\dot{6}", num: 15, den: 90, rNum: 1, rDen: 6 },
  { a: 8, b: 3, rep: "0.8\\dot{3}", num: 75, den: 90, rNum: 5, rDen: 6 },
  { a: 1, b: 3, rep: "0.1\\dot{3}", num: 12, den: 90, rNum: 2, rDen: 15 },
  { a: 2, b: 6, rep: "0.2\\dot{6}", num: 24, den: 90, rNum: 4, rDen: 15 },
  { a: 4, b: 6, rep: "0.4\\dot{6}", num: 42, den: 90, rNum: 7, rDen: 15 },
  { a: 5, b: 3, rep: "0.5\\dot{3}", num: 48, den: 90, rNum: 8, rDen: 15 },
  { a: 7, b: 3, rep: "0.7\\dot{3}", num: 66, den: 90, rNum: 11, rDen: 15 },
  { a: 3, b: 5, rep: "0.3\\dot{5}", num: 32, den: 90, rNum: 16, rDen: 45 },
  { a: 1, b: 5, rep: "0.1\\dot{5}", num: 14, den: 90, rNum: 7, rDen: 45 },
  { a: 2, b: 5, rep: "0.2\\dot{5}", num: 23, den: 90, rNum: 23, rDen: 90 },
  { a: 3, b: 1, rep: "0.3\\dot{1}", num: 28, den: 90, rNum: 14, rDen: 45 },
  { a: 6, b: 1, rep: "0.6\\dot{1}", num: 55, den: 90, rNum: 11, rDen: 18 },
  { a: 7, b: 1, rep: "0.7\\dot{1}", num: 64, den: 90, rNum: 32, rDen: 45 },
  { a: 8, b: 1, rep: "0.8\\dot{1}", num: 73, den: 90, rNum: 73, rDen: 90 },
  { a: 9, b: 1, rep: "0.9\\dot{1}", num: 82, den: 90, rNum: 41, rDen: 45 },
  { a: 1, b: 7, rep: "0.1\\dot{7}", num: 16, den: 90, rNum: 8, rDen: 45 },
  { a: 2, b: 7, rep: "0.2\\dot{7}", num: 25, den: 90, rNum: 5, rDen: 18 },
  { a: 4, b: 7, rep: "0.4\\dot{7}", num: 43, den: 90, rNum: 43, rDen: 90 },
  { a: 5, b: 7, rep: "0.5\\dot{7}", num: 52, den: 90, rNum: 26, rDen: 45 },
  { a: 6, b: 7, rep: "0.6\\dot{7}", num: 61, den: 90, rNum: 61, rDen: 90 }
];

for (let i = 0; i < mixedRecurData.length; i++) {
  const item = mixedRecurData[i];
  const idx = 6 + i;
  const correct = `${item.rNum}/${item.rDen}`;
  const d1 = `${item.a * 10 + item.b}/99`;
  const d2 = `${item.a * 10 + item.b}/90`;
  const d3 = `${item.rNum + 1}/${item.rDen}`;
  const options = Array.from(new Set([correct, d1, d2, d3]));
  while (options.length < 4) {
    options.push(`${item.rNum}/${item.rDen + options.length}`);
  }

  mediumQuestions.push({
    id: `q_b9_frac_m${idx < 10 ? '0' + idx : idx}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Convert the recurring decimal $${item.rep}$ into a common fraction in its lowest terms.`,
    options: options.slice(0, 4),
    correctAnswer: correct,
    hint: `Let $x = ${item.rep}$. Multiply by 100 and 10, then subtract: $90x = ${item.a * 10 + item.b} - ${item.a} = ${item.num}$.`,
    workedSolution: `$$100x - 10x = 90x = ${item.num} \\implies x = \\frac{${item.num}}{90} = \\frac{${item.rNum}}{${item.rDen}}$$.`,
    points: 1
  });
}

// Items 26 to 50: Successive discounts & single-tier remainder problems
const successiveData = [
  { d1: 20, d2: 10, mp: 500 },
  { d1: 15, d2: 10, mp: 400 },
  { d1: 25, d2: 10, mp: 800 },
  { d1: 30, d2: 10, mp: 600 },
  { d1: 20, d2: 20, mp: 1000 },
  { d1: 10, d2: 5, mp: 200 },
  { d1: 25, d2: 20, mp: 1200 },
  { d1: 30, d2: 5, mp: 500 },
  { d1: 15, d2: 5, mp: 600 },
  { d1: 20, d2: 15, mp: 1500 },
  { d1: 10, d2: 10, mp: 800 },
  { d1: 25, d2: 5, mp: 400 },
  { d1: 15, d2: 15, mp: 1000 },
  { d1: 30, d2: 20, mp: 2000 },
  { d1: 20, d2: 5, mp: 750 },
  { d1: 10, d2: 20, mp: 900 },
  { d1: 25, d2: 10, mp: 1600 },
  { d1: 40, d2: 10, mp: 1000 },
  { d1: 50, d2: 10, mp: 1200 },
  { d1: 20, d2: 10, mp: 2500 },
  { d1: 15, d2: 10, mp: 1800 },
  { d1: 30, d2: 10, mp: 3000 },
  { d1: 25, d2: 20, mp: 2400 },
  { d1: 20, d2: 15, mp: 2000 },
  { d1: 10, d2: 10, mp: 3500 }
];

for (let i = 0; i < successiveData.length; i++) {
  const item = successiveData[i];
  const idx = 26 + i;
  const f1 = (100 - item.d1) / 100;
  const f2 = (100 - item.d2) / 100;
  const singleEqRate = (1 - (f1 * f2)) * 100;
  const netPrice = item.mp * f1 * f2;

  if (i % 2 === 0) {
    // Question asks for single equivalent discount percentage
    const correct = `${singleEqRate.toFixed(1).replace(/\.0$/, '')}%`;
    const simpleSum = `${item.d1 + item.d2}%`;
    const wrong1 = `${(singleEqRate - 2).toFixed(1).replace(/\.0$/, '')}%`;
    const wrong2 = `${(singleEqRate + 2).toFixed(1).replace(/\.0$/, '')}%`;
    const options = Array.from(new Set([correct, simpleSum, wrong1, wrong2])).slice(0, 4);

    mediumQuestions.push({
      id: `q_b9_frac_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Successive trade discounts of $${item.d1}\\%$ and $${item.d2}\\%$ are equivalent to a single discount of:`,
      options: options,
      correctAnswer: correct,
      hint: `Single equivalent discount $= 1 - (1 - d_1)(1 - d_2) = 1 - (${f1} \\times ${f2})$.`,
      workedSolution: `$$\\text{Effective Multiplier} = (1 - ${item.d1 / 100}) \\times (1 - ${item.d2 / 100}) = ${f1} \\times ${f2} = ${(f1 * f2).toFixed(4)}$$\n$$\\text{Equivalent Discount} = 1 - ${(f1 * f2).toFixed(4)} = ${(1 - f1 * f2).toFixed(4)} = ${correct}$$.`,
      points: 1
    });
  } else {
    // Question asks for net price after successive discounts
    const correct = `GH¢ ${netPrice.toFixed(2)}`;
    const wrong1 = `GH¢ ${(item.mp * (1 - (item.d1 + item.d2) / 100)).toFixed(2)}`;
    const wrong2 = `GH¢ ${(netPrice * 1.05).toFixed(2)}`;
    const wrong3 = `GH¢ ${(netPrice * 0.95).toFixed(2)}`;
    const options = Array.from(new Set([correct, wrong1, wrong2, wrong3])).slice(0, 4);

    mediumQuestions.push({
      id: `q_b9_frac_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `An article marked $\\text{GH¢ } ${item.mp}.00$ is subjected to successive discounts of $${item.d1}\\%$ and $${item.d2}\\%$. Calculate the net selling price.`,
      options: options,
      correctAnswer: correct,
      hint: `Apply each discount sequentially: $${item.mp} \\times ${f1} \\times ${f2}$.`,
      workedSolution: `$$\\text{Price after } ${item.d1}\\% = ${item.mp} \\times ${f1} = \\text{GH¢ } ${(item.mp * f1).toFixed(2)}$$\n$$\\text{Net Price after } ${item.d2}\\% = ${(item.mp * f1).toFixed(2)} \\times ${f2} = \\text{GH¢ } ${netPrice.toFixed(2)}$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 3. HARD TIER (DOK 3) - 50 ITEMS
// Focus: Multi-tier cascading salary and estate distributions,
// chained commercial discounts vs single equivalents, complex recurring conversions.
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b9_frac_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A cocoa farmer willed his estate among his wife and three children. The wife received $\\frac{1}{3}$ of the entire estate. The eldest son received $\\frac{1}{4}$ of the remainder. The remaining balance was shared equally between the two youngest daughters. If each daughter received $\\text{GH¢ } 15,000.00$, calculate the total value of the farmer's estate.",
    options: ["GH¢ 60,000.00", "GH¢ 45,000.00", "GH¢ 80,000.00", "GH¢ 75,000.00"],
    correctAnswer: "GH¢ 60,000.00",
    hint: "Wife leaves $2/3$. Eldest son takes $1/4 \\times 2/3 = 1/6$. Balance for daughters is $2/3 - 1/6 = 1/2$. Each daughter gets $1/4$.",
    workedSolution: "$$\\text{Wife} = \\frac{1}{3}, \\quad \\text{Remainder } R_1 = \\frac{2}{3}$$\n$$\\text{Eldest Son} = \\frac{1}{4} \\times \\frac{2}{3} = \\frac{1}{6}$$\n$$\\text{Balance for daughters} = \\frac{2}{3} - \\frac{1}{6} = \\frac{1}{2}$$\n$$\\text{Each daughter} = \\frac{1}{2} \\div 2 = \\frac{1}{4}$$\n$$\\frac{1}{4}E = 15,000 \\implies E = 15,000 \\times 4 = \\text{GH¢ } 60,000.00$$.",
    points: 2
  },
  {
    id: "q_b9_frac_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "An executive's monthly remuneration was allocated as follows: $\\frac{1}{5}$ on tax, $\\frac{1}{3}$ of the remainder on mortgage, and $\\frac{3}{8}$ of the subsequent remainder on family upkeep. If she deposited the final leftover of $\\text{GH¢ } 5,000.00$ into savings, calculate her total gross monthly salary.",
    options: ["GH¢ 15,000.00", "GH¢ 12,000.00", "GH¢ 18,000.00", "GH¢ 20,000.00"],
    correctAnswer: "GH¢ 15,000.00",
    hint: "Cascading fractions: After tax: $4/5$. After mortgage: $2/3 \\times 4/5 = 8/15$. After upkeep: $5/8 \\times 8/15 = 1/3$. Set $1/3 S = 5,000$.",
    workedSolution: "$$\\text{After Tax} = 1 - \\frac{1}{5} = \\frac{4}{5}$$\n$$\\text{After Mortgage} = \\frac{4}{5} \\times \\left(1 - \\frac{1}{3}\\right) = \\frac{4}{5} \\times \\frac{2}{3} = \\frac{8}{15}$$\n$$\\text{After Upkeep} = \\frac{8}{15} \\times \\left(1 - \\frac{3}{8}\\right) = \\frac{8}{15} \\times \\frac{5}{8} = \\frac{1}{3}$$\n$$\\frac{1}{3}S = 5,000 \\implies S = 5,000 \\times 3 = \\text{GH¢ } 15,000.00$$.",
    points: 2
  },
  {
    id: "q_b9_frac_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A merchant is offered two options by different suppliers for identical goods marked $\\text{GH¢ } 10,000.00$: Option A offers a single flat discount of $25\\%$; Option B offers successive discounts of $20\\%$ and $6\\%$. Which option is cheaper for the merchant, and by how much?",
    options: [
      "Option A is cheaper by GH¢ 20.00",
      "Option B is cheaper by GH¢ 20.00",
      "Both options are identical",
      "Option A is cheaper by GH¢ 100.00"
    ],
    correctAnswer: "Option A is cheaper by GH¢ 20.00",
    hint: "Option A price $= 10000 \\times 0.75 = 7,500$. Option B price $= 10000 \\times 0.80 \\times 0.94 = 7,520$.",
    workedSolution: "$$\\text{Option A: } 10,000 \\times 0.75 = \\text{GH¢ } 7,500.00$$\n$$\\text{Option B: } 10,000 \\times 0.80 \\times 0.94 = \\text{GH¢ } 7,520.00$$\nOption A is cheaper by $7,520 - 7,500 = \\text{GH¢ } 20.00$.",
    points: 2
  },
  {
    id: "q_b9_frac_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Convert the recurring decimal $2.1\\dot{4}\\dot{5}$ into a mixed number in its simplest form.",
    options: ["2 8/55", "2 145/990", "2 7/50", "2 16/110"],
    correctAnswer: "2 8/55",
    hint: "Fractional part: $x = 0.14545\\dots$. $1000x - 10x = 145.45\\dots - 1.45\\dots = 144$. Solve $990x = 144$.",
    workedSolution: "$$990x = 144 \\implies x = \\frac{144}{990} = \\frac{72}{495} = \\frac{8}{55}$$\n$$\\text{Mixed number} = 2\\frac{8}{55}$$.",
    points: 2
  },
  {
    id: "q_b9_frac_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "In a co-operative society, $\\frac{3}{10}$ of members are traders, $\\frac{1}{4}$ of the remainder are teachers, and $\\frac{2}{7}$ of the new remainder are civil servants. If the remaining $150$ members are farmers, find the total membership of the society.",
    options: ["400", "500", "350", "450"],
    correctAnswer: "400",
    hint: "Chain of remainders: $7/10 \\times 3/4 \\times 5/7 = 3/8$. Set $3/8 M = 150$.",
    workedSolution: "$$\\text{After Traders} = 1 - \\frac{3}{10} = \\frac{7}{10}$$\n$$\\text{After Teachers} = \\frac{7}{10} \\times \\left(1 - \\frac{1}{4}\\right) = \\frac{7}{10} \\times \\frac{3}{4} = \\frac{21}{40}$$\n$$\\text{After Civil Servants} = \\frac{21}{40} \\times \\left(1 - \\frac{2}{7}\\right) = \\frac{21}{40} \\times \\frac{5}{7} = \\frac{3}{8}$$\n$$\\frac{3}{8}M = 150 \\implies M = 150 \\times \\frac{8}{3} = 50 \\times 8 = 400\\text{ members}$$.",
    points: 2
  }
];

// Items 6 to 25: 3-tier salary and budgeting remainder word problems
const cascadingRemData = [
  { f1Num: 1, f1Den: 4, f2Num: 1, f2Den: 3, f3Num: 1, f3Den: 2, totalSalary: 12000 },
  { f1Num: 1, f1Den: 5, f2Num: 1, f2Den: 4, f3Num: 1, f3Den: 3, totalSalary: 15000 },
  { f1Num: 1, f1Den: 3, f2Num: 1, f2Den: 4, f3Num: 2, f3Den: 5, totalSalary: 20000 },
  { f1Num: 1, f1Den: 6, f2Num: 2, f2Den: 5, f3Num: 1, f3Den: 2, totalSalary: 18000 },
  { f1Num: 2, f1Den: 5, f2Num: 1, f2Den: 3, f3Num: 1, f3Den: 4, totalSalary: 25000 },
  { f1Num: 1, f1Den: 4, f2Num: 2, f2Den: 5, f3Num: 1, f3Den: 3, totalSalary: 16000 },
  { f1Num: 1, f1Den: 3, f2Num: 1, f2Den: 2, f3Num: 1, f3Den: 4, totalSalary: 24000 },
  { f1Num: 1, f1Den: 5, f2Num: 1, f2Den: 2, f3Num: 1, f3Den: 4, totalSalary: 30000 },
  { f1Num: 3, f1Den: 10, f2Num: 1, f2Den: 7, f3Num: 1, f3Den: 3, totalSalary: 28000 },
  { f1Num: 1, f1Den: 4, f2Num: 1, f2Den: 5, f3Num: 1, f3Den: 2, totalSalary: 10000 },
  { f1Num: 1, f1Den: 2, f2Num: 1, f2Den: 3, f3Num: 1, f3Den: 4, totalSalary: 36000 },
  { f1Num: 1, f1Den: 3, f2Num: 3, f2Den: 4, f3Num: 1, f3Den: 5, totalSalary: 30000 },
  { f1Num: 2, f1Den: 7, f2Num: 1, f2Den: 5, f3Num: 1, f3Den: 2, totalSalary: 14000 },
  { f1Num: 1, f1Den: 5, f2Num: 3, f2Den: 8, f3Num: 1, f3Den: 5, totalSalary: 40000 },
  { f1Num: 1, f1Den: 6, f2Num: 1, f2Den: 5, f3Num: 1, f3Den: 4, totalSalary: 12000 },
  { f1Num: 3, f1Den: 8, f2Num: 1, f2Den: 5, f3Num: 1, f3Den: 2, totalSalary: 32000 },
  { f1Num: 1, f1Den: 4, f2Num: 1, f2Den: 6, f3Num: 2, f3Den: 5, totalSalary: 24000 },
  { f1Num: 1, f1Den: 5, f2Num: 2, f2Den: 4, f3Num: 1, f3Den: 3, totalSalary: 20000 },
  { f1Num: 2, f1Den: 9, f2Num: 1, f2Den: 7, f3Num: 1, f3Den: 3, totalSalary: 27000 },
  { f1Num: 1, f1Den: 8, f2Num: 2, f2Den: 7, f3Num: 1, f3Den: 5, totalSalary: 40000 }
];

for (let i = 0; i < cascadingRemData.length; i++) {
  const item = cascadingRemData[i];
  const idx = 6 + i;
  // Step 1 remainder fraction
  const rem1 = 1 - (item.f1Num / item.f1Den);
  // Step 2 remainder fraction
  const rem2 = rem1 * (1 - (item.f2Num / item.f2Den));
  // Step 3 remainder fraction (final leftover fraction)
  const rem3 = rem2 * (1 - (item.f3Num / item.f3Den));
  const leftoverCash = Math.round(item.totalSalary * rem3);

  const correct = `GH¢ ${item.totalSalary.toLocaleString()}.00`;
  const opt1 = `GH¢ ${(item.totalSalary * 0.8).toLocaleString()}.00`;
  const opt2 = `GH¢ ${(item.totalSalary * 1.25).toLocaleString()}.00`;
  const opt3 = `GH¢ ${(item.totalSalary * 1.5).toLocaleString()}.00`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  hardQuestions.push({
    id: `q_b9_frac_h${idx < 10 ? '0' + idx : idx}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `A professional allocates monthly income as follows: $\\frac{${item.f1Num}}{${item.f1Den}}$ on housing, $\\frac{${item.f2Num}}{${item.f2Den}}$ of the remainder on children's education, and $\\frac{${item.f3Num}}{${item.f3Den}}$ of the subsequent balance on investment. If the remaining sum of $\\text{GH¢ } ${leftoverCash.toLocaleString()}.00$ is banked, calculate the total monthly income.`,
    options: options,
    correctAnswer: correct,
    hint: `Multiply cascading remainder fractions: $\\left(1 - \\frac{${item.f1Num}}{${item.f1Den}}\\right) \\times \\left(1 - \\frac{${item.f2Num}}{${item.f2Den}}\\right) \\times \\left(1 - \\frac{${item.f3Num}}{${item.f3Den}}\\right)$.`,
    workedSolution: `$$\\text{After Housing} = 1 - \\frac{${item.f1Num}}{${item.f1Den}} = \\frac{${item.f1Den - item.f1Num}}{${item.f1Den}}$$\n$$\\text{After Education} = \\frac{${item.f1Den - item.f1Num}}{${item.f1Den}} \\times \\left(1 - \\frac{${item.f2Num}}{${item.f2Den}}\\right)$$\n$$\\text{Final Leftover Fraction} = ${rem3.toFixed(4)}$$\n$$\\text{Total Income} = \\frac{${leftoverCash}}{${rem3.toFixed(4)}} = \\text{GH¢ } ${item.totalSalary.toLocaleString()}.00$$.`,
    points: 2
  });
}

// Items 26 to 50: Complex recurring decimals with whole numbers & chained discount comparisons
const complexMixedData = [
  { whole: 1, dec: "2\\dot{3}", n: 7, d: 30, str: "1 7/30" },
  { whole: 3, dec: "1\\dot{6}", n: 1, d: 6, str: "3 1/6" },
  { whole: 2, dec: "8\\dot{3}", n: 5, d: 6, str: "2 5/6" },
  { whole: 1, dec: "4\\dot{6}", n: 7, d: 15, str: "1 7/15" },
  { whole: 4, dec: "1\\dot{2}", n: 4, d: 33, str: "4 4/33" },
  { whole: 2, dec: "2\\dot{7}", n: 5, d: 18, str: "2 5/18" },
  { whole: 1, dec: "0\\dot{4}\\dot{5}", n: 1, d: 22, str: "1 1/22" },
  { whole: 3, dec: "3\\dot{6}", n: 4, d: 11, str: "3 4/11" },
  { whole: 2, dec: "5\\dot{4}", n: 6, d: 11, str: "2 6/11" },
  { whole: 5, dec: "1\\dot{8}", n: 2, d: 11, str: "5 2/11" },
  { whole: 1, dec: "7\\dot{2}", n: 8, d: 11, str: "1 8/11" },
  { whole: 2, dec: "6\\dot{3}", n: 7, d: 11, str: "2 7/11" },
  { whole: 3, dec: "4\\dot{5}", n: 5, d: 11, str: "3 5/11" },
  { whole: 1, dec: "2\\dot{6}", n: 4, d: 15, str: "1 4/15" },
  { whole: 4, dec: "5\\dot{3}", n: 8, d: 15, str: "4 8/15" },
  { whole: 2, dec: "7\\dot{3}", n: 11, d: 15, str: "2 11/15" },
  { whole: 1, dec: "3\\dot{5}", n: 16, d: 45, str: "1 16/45" },
  { whole: 3, dec: "1\\dot{5}", n: 7, d: 45, str: "3 7/45" },
  { whole: 2, dec: "6\\dot{1}", n: 11, d: 18, str: "2 11/18" },
  { whole: 1, dec: "1\\dot{7}", n: 8, d: 45, str: "1 8/45" },
  { whole: 4, dec: "2\\dot{5}", n: 23, d: 90, str: "4 23/90" },
  { whole: 2, dec: "3\\dot{1}", n: 14, d: 45, str: "2 14/45" },
  { whole: 3, dec: "7\\dot{1}", n: 32, d: 45, str: "3 32/45" },
  { whole: 1, dec: "5\\dot{7}", n: 26, d: 45, str: "1 26/45" },
  { whole: 2, dec: "9\\dot{1}", n: 41, d: 45, str: "2 41/45" }
];

for (let i = 0; i < complexMixedData.length; i++) {
  const item = complexMixedData[i];
  const idx = 26 + i;
  const correct = item.str;
  const opt1 = `${item.whole} ${item.n + 1}/${item.d}`;
  const opt2 = `${item.whole} ${item.n}/${item.d + 2}`;
  const opt3 = `${item.whole + 1} ${item.n}/${item.d}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  hardQuestions.push({
    id: `q_b9_frac_h${idx < 10 ? '0' + idx : idx}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `Convert the recurring decimal $${item.whole}.${item.dec}$ into a mixed number in its lowest terms.`,
    options: options,
    correctAnswer: correct,
    hint: `Separate the integer part $${item.whole}$ and convert the fractional recurring part $0.${item.dec}$.`,
    workedSolution: `$$\\text{Fractional Part: } x = 0.${item.dec} = \\frac{${item.n}}{${item.d}}$$\n$$\\text{Mixed Number} = ${item.whole}\\frac{${item.n}}{${item.d}}$$.`,
    points: 2
  });
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB9FractionsPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 9 PRACTICE POOL: topic_fractions_decimals_percentages');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_fractions_decimals_percentages');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_fractions_decimals_percentages not found in Firestore.');
  }

  const existingData = snap.data() || {};
  const levels = existingData.levels || {};

  const b7Count = levels.b7?.practicePool?.low?.length + levels.b7?.practicePool?.medium?.length + levels.b7?.practicePool?.hard?.length || 150;
  const b8Count = levels.b8?.practicePool?.low?.length + levels.b8?.practicePool?.medium?.length + levels.b8?.practicePool?.hard?.length || 150;
  const b9Count = lowQuestions.length + mediumQuestions.length + hardQuestions.length;
  const totalQuestions = b7Count + b8Count + b9Count;

  console.log(`📦 Ingesting B9 Question Bank:`);
  console.log(`  • Low (DOK 1): ${lowQuestions.length} items`);
  console.log(`  • Medium (DOK 2): ${mediumQuestions.length} items`);
  console.log(`  • Hard (DOK 3): ${hardQuestions.length} items`);
  console.log(`  • Total B9 Items: ${b9Count}`);
  console.log(`  • Total Topic Practice Items (B7 + B8 + B9): ${totalQuestions}`);

  const updatedPracticePool = {
    low: lowQuestions,
    medium: mediumQuestions,
    hard: hardQuestions
  };

  // Atomic update merging practicePool for both b9 and mirrored jhs3
  await docRef.update({
    'levels.b9.practicePool': updatedPracticePool,
    'levels.jhs3.practicePool': updatedPracticePool,
    'totalPracticeQuestions': totalQuestions,
    updatedAt: FieldValue.serverTimestamp()
  });

  // Verify document size after update
  const updatedSnap = await docRef.get();
  const updatedData = updatedSnap.data() || {};
  const jsonStr = JSON.stringify(updatedData);
  const sizeBytes = Buffer.byteLength(jsonStr, 'utf8');
  const sizeKb = (sizeBytes / 1024).toFixed(2);
  const MAX_LIMIT = 1048576; // 1 MiB

  console.log(`\n📊 Post-Update Telemetry:`);
  console.log(`  • Document Size: ${sizeBytes} bytes (~${sizeKb} KB)`);
  console.log(`  • 1 MiB Limit Utilization: ${((sizeBytes / MAX_LIMIT) * 100).toFixed(2)}%`);
  console.log(`  • 1-Document Read Guarantee: ${sizeBytes < MAX_LIMIT ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Also sync local payload files
  const p1 = path.join(__dirname, 'payloads', 'topic_fractions_decimals_percentages.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_fractions_decimals_percentages.json');

  if (fs.existsSync(p1)) {
    const raw = JSON.parse(fs.readFileSync(p1, 'utf-8'));
    if (raw.levels?.b9) raw.levels.b9.practicePool = updatedPracticePool;
    if (raw.levels?.jhs3) raw.levels.jhs3.practicePool = updatedPracticePool;
    raw.totalPracticeQuestions = totalQuestions;
    fs.writeFileSync(p1, JSON.stringify(raw, null, 2), 'utf-8');
    console.log(`💾 Synced local payload: ${p1}`);
  }

  if (fs.existsSync(p2)) {
    const raw = JSON.parse(fs.readFileSync(p2, 'utf-8'));
    if (raw.levels?.b9) raw.levels.b9.practicePool = updatedPracticePool;
    if (raw.levels?.jhs3) raw.levels.jhs3.practicePool = updatedPracticePool;
    raw.totalPracticeQuestions = totalQuestions;
    fs.writeFileSync(p2, JSON.stringify(raw, null, 2), 'utf-8');
    console.log(`💾 Synced local payload: ${p2}`);
  }

  console.log('🎉 B9 Fractions Question Bank expansion completed successfully.');
}

seedB9FractionsPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B9 fractions pool:', err);
    process.exit(1);
  });
