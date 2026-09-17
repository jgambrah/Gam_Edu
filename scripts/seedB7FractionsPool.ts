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

// -----------------------------------------------------------------------------
// 1. LOW TIER (DOK 1) - 50 ITEMS
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b7_frac_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert $\\frac{3}{4}$ to a percentage.",
    options: ["75%", "25%", "50%", "80%"],
    correctAnswer: "75%",
    hint: "Multiply the fraction by 100%.",
    workedSolution: "$$\\frac{3}{4} \\times 100\\% = 3 \\times 25\\% = 75\\%$$.",
    points: 1
  },
  {
    id: "q_b7_frac_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Express $0.4$ as a simple fraction in its lowest terms.",
    options: ["2/5", "4/10", "1/4", "4/5"],
    correctAnswer: "2/5",
    hint: "Write $0.4 = \\frac{4}{10}$ and divide numerator and denominator by 2.",
    workedSolution: "$$\\frac{4 \\div 2}{10 \\div 2} = \\frac{2}{5}$$.",
    points: 1
  },
  {
    id: "q_b7_frac_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $\\frac{2}{7} + \\frac{3}{7}$.",
    options: ["5/7", "5/14", "6/7", "1/7"],
    correctAnswer: "5/7",
    hint: "The denominators are identical; add the numerators directly.",
    workedSolution: "$$\\frac{2 + 3}{7} = \\frac{5}{7}$$.",
    points: 1
  },
  {
    id: "q_b7_frac_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is $\\frac{1}{5}$ of $\\text{GH¢ } 60.00$?",
    options: ["GH¢ 12.00", "GH¢ 10.00", "GH¢ 15.00", "GH¢ 20.00"],
    correctAnswer: "GH¢ 12.00",
    hint: "Divide 60 by 5.",
    workedSolution: "$$\\frac{1}{5} \\times 60 = \\text{GH¢ } 12.00$$.",
    points: 1
  },
  {
    id: "q_b7_frac_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which of the following is equivalent to $20\\%$?",
    options: ["1/5", "1/4", "1/2", "2/5"],
    correctAnswer: "1/5",
    hint: "$$20\\% = \\frac{20}{100}$$. Reduce by dividing by 20.",
    workedSolution: "$$\\frac{20 \\div 20}{100 \\div 20} = \\frac{1}{5}$$.",
    points: 1
  },
  {
    id: "q_b7_frac_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert $2\\frac{1}{3}$ to an improper fraction.",
    options: ["7/3", "5/3", "6/3", "8/3"],
    correctAnswer: "7/3",
    hint: "Multiply whole number by denominator and add numerator: $2 \\times 3 + 1$.",
    workedSolution: "$$\\frac{(2 \\times 3) + 1}{3} = \\frac{7}{3}$$.",
    points: 1
  },
  {
    id: "q_b7_frac_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is $0.125$ expressed as a common fraction?",
    options: ["1/8", "1/4", "1/5", "3/8"],
    correctAnswer: "1/8",
    hint: "$$\\frac{125}{1000}$$. Divide both terms by 125.",
    workedSolution: "$$\\frac{125 \\div 125}{1000 \\div 125} = \\frac{1}{8}$$.",
    points: 1
  },
  {
    id: "q_b7_frac_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Subtract: $\\frac{7}{9} - \\frac{4}{9}$.",
    options: ["1/3", "3/9", "11/9", "3/18"],
    correctAnswer: "1/3",
    hint: "$$\\frac{7 - 4}{9} = \\frac{3}{9}$$, then simplify.",
    workedSolution: "$$\\frac{7 - 4}{9} = \\frac{3}{9} = \\frac{1}{3}$$.",
    points: 1
  },
  {
    id: "q_b7_frac_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which fraction is larger: $\\frac{3}{5}$ or $\\frac{2}{5}$?",
    options: ["3/5", "2/5", "They are equal", "Cannot be determined"],
    correctAnswer: "3/5",
    hint: "With identical denominators, compare numerators directly.",
    workedSolution: "Since 3 > 2, $\\frac{3}{5} > \\frac{2}{5}$.",
    points: 1
  },
  {
    id: "q_b7_frac_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert $35\\%$ to a decimal.",
    options: ["0.35", "3.5", "0.035", "35.0"],
    correctAnswer: "0.35",
    hint: "Divide 35 by 100.",
    workedSolution: "$$\\frac{35}{100} = 0.35$$.",
    points: 1
  }
];

// Varied WAEC DOK 1 generator for items 11 through 50
const lowGenerators = [
  // Type A: Percentage to decimal
  (idx: number) => {
    const percent = 10 + (idx * 2);
    const decStr = (percent / 100).toFixed(2);
    return {
      id: `q_b7_frac_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Convert $${percent}\\%$ to a decimal numeral.`,
      options: [decStr, (percent / 10).toFixed(2), (percent / 1000).toFixed(3), `${percent}.0`],
      correctAnswer: decStr,
      hint: `Divide ${percent} by 100.`,
      workedSolution: `$$\\frac{${percent}}{100} = ${decStr}$$.`,
      points: 1
    };
  },
  // Type B: Decimal to fraction in lowest terms
  (idx: number) => {
    const decs = [
      { d: "0.6", frac: "3/5", opts: ["3/5", "6/10", "2/3", "1/6"] },
      { d: "0.8", frac: "4/5", opts: ["4/5", "8/10", "3/4", "1/8"] },
      { d: "0.25", frac: "1/4", opts: ["1/4", "25/100", "1/5", "2/5"] },
      { d: "0.75", frac: "3/4", opts: ["3/4", "75/100", "7/10", "4/5"] },
      { d: "0.5", frac: "1/2", opts: ["1/2", "5/10", "1/5", "2/3"] }
    ];
    const item = decs[idx % decs.length];
    return {
      id: `q_b7_frac_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Express $${item.d}$ as a fraction in its lowest terms.`,
      options: item.opts,
      correctAnswer: item.frac,
      hint: `Convert to a fraction over powers of 10 and reduce.`,
      workedSolution: `$${item.d} = ${item.frac}$.`,
      points: 1
    };
  },
  // Type C: Equivalent fractions (find unknown numerator)
  (idx: number) => {
    const numerators = [1, 2, 3, 4];
    const denom = 5;
    const num = numerators[idx % numerators.length];
    const scale = (idx % 4) + 2;
    const scaledNum = num * scale;
    const scaledDenom = denom * scale;
    return {
      id: `q_b7_frac_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Find the missing value: $\\frac{${num}}{${denom}} = \\frac{x}{${scaledDenom}}$.`,
      options: [String(scaledNum), String(scaledNum + 2), String(scaledNum - 1), String(scale)],
      correctAnswer: String(scaledNum),
      hint: `Multiply numerator by the same scaling factor ${scale}.`,
      workedSolution: `$$x = ${num} \\times ${scale} = ${scaledNum}$$.`,
      points: 1
    };
  },
  // Type D: Simple unit fraction of an integer quantity
  (idx: number) => {
    const fractions = [
      { num: 1, den: 3, total: 36, ans: 12 },
      { num: 1, den: 4, total: 48, ans: 12 },
      { num: 1, den: 6, total: 42, ans: 7 },
      { num: 1, den: 8, total: 64, ans: 8 },
      { num: 1, den: 5, total: 75, ans: 15 }
    ];
    const f = fractions[idx % fractions.length];
    return {
      id: `q_b7_frac_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `What is $\\frac{1}{${f.den}}$ of $${f.total}$?`,
      options: [String(f.ans), String(f.ans + 2), String(f.ans - 3), String(f.den)],
      correctAnswer: String(f.ans),
      hint: `Divide $${f.total}$ by $${f.den}$.`,
      workedSolution: `$$\\frac{1}{${f.den}} \\times ${f.total} = ${f.ans}$$.`,
      points: 1
    };
  }
];

for (let i = 11; i <= 50; i++) {
  const genFn = lowGenerators[(i - 11) % lowGenerators.length];
  lowQuestions.push(genFn(i));
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER (DOK 2) - 50 ITEMS
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b7_frac_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Evaluate: $2\\frac{1}{3} + 1\\frac{1}{2}$.",
    options: ["3 5/6", "3 2/5", "3 1/6", "4 1/6"],
    correctAnswer: "3 5/6",
    hint: "LCM of denominators 3 and 2 is 6.",
    workedSolution: "$$(2 + 1) + \\left(\\frac{2}{6} + \\frac{3}{6}\\right) = 3 + \\frac{5}{6} = 3\\frac{5}{6}$$.",
    points: 1
  },
  {
    id: "q_b7_frac_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Arrange the following in ascending order: $0.45, \\, \\frac{2}{5}, \\, 42\\%$.",
    options: [
      "2/5 < 42% < 0.45",
      "42% < 2/5 < 0.45",
      "0.45 < 42% < 2/5",
      "2/5 < 0.45 < 42%"
    ],
    correctAnswer: "2/5 < 42% < 0.45",
    hint: "Convert all to percentages: $0.45 = 45\\%$, $\\frac{2}{5} = 40\\%$, and $42\\%$.",
    workedSolution: "$$40\\% < 42\\% < 45\\% \\implies \\frac{2}{5} < 42\\% < 0.45$$.",
    points: 1
  },
  {
    id: "q_b7_frac_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "There are 120 pupils in a school hall. If $\\frac{3}{5}$ of them are girls, how many boys are in the hall?",
    options: ["48", "72", "50", "40"],
    correctAnswer: "48",
    hint: "Fraction of boys $= 1 - \\frac{3}{5} = \\frac{2}{5}$. Multiply $\\frac{2}{5} \\times 120$.",
    workedSolution: "$$\\text{Boys} = \\frac{2}{5} \\times 120 = 2 \\times 24 = 48$$.",
    points: 1
  },
  {
    id: "q_b7_frac_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Evaluate: $3\\frac{1}{4} - 1\\frac{2}{3}$.",
    options: ["1 7/12", "1 5/12", "2 1/12", "1 1/4"],
    correctAnswer: "1 7/12",
    hint: "Convert to improper fractions: $\\frac{13}{4} - \\frac{5}{3} = \\frac{39 - 20}{12}$.",
    workedSolution: "$$\\frac{13}{4} - \\frac{5}{3} = \\frac{39 - 20}{12} = \\frac{19}{12} = 1\\frac{7}{12}$$.",
    points: 1
  },
  {
    id: "q_b7_frac_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Find the value of $x$ if $\\frac{3}{8} = \\frac{x}{40}$.",
    options: ["15", "12", "20", "18"],
    correctAnswer: "15",
    hint: "Cross-multiply: $8x = 3 \\times 40 = 120$.",
    workedSolution: "$$8x = 120 \\implies x = \\frac{120}{8} = 15$$.",
    points: 1
  }
];

// Rich generator for Medium items 6 through 50
const mediumGenerators = [
  // Type A: Mixed fraction addition with unlike denominators
  (idx: number) => {
    const w1 = 1 + (idx % 2);
    const w2 = 2 + (idx % 2);
    // w1 1/2 + w2 1/4 = (w1+w2) 3/4
    const sumW = w1 + w2;
    const ans = `${sumW} 3/4`;
    return {
      id: `q_b7_frac_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Evaluate: $${w1}\\frac{1}{2} + ${w2}\\frac{1}{4}$.`,
      options: [ans, `${sumW} 1/2`, `${sumW + 1} 1/4`, `${sumW} 2/6`],
      correctAnswer: ans,
      hint: `Use common denominator 4: $\\frac{2}{4} + \\frac{1}{4} = \\frac{3}{4}$.`,
      workedSolution: `$$(${w1} + ${w2}) + \\left(\\frac{2}{4} + \\frac{1}{4}\\right) = ${sumW}\\frac{3}{4}$$.`,
      points: 1
    };
  },
  // Type B: Fractional part of discrete quantity (money, students, items)
  (idx: number) => {
    const total = 60 + (idx * 6);
    // fraction 3/4
    const ans = (total * 3) / 4;
    return {
      id: `q_b7_frac_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `What is $\\frac{3}{4}$ of $\\text{GH¢ } ${total}.00$?`,
      options: [
        `GH¢ ${ans}.00`,
        `GH¢ ${ans + 10}.00`,
        `GH¢ ${ans - 10}.00`,
        `GH¢ ${(total / 4).toFixed(0)}.00`
      ],
      correctAnswer: `GH¢ ${ans}.00`,
      hint: `Divide $${total}$ by 4 and multiply by 3.`,
      workedSolution: `$$\\frac{3}{4} \\times ${total} = 3 \\times ${total / 4} = \\text{GH¢ } ${ans}.00$$.`,
      points: 1
    };
  },
  // Type C: Ordering fractions, decimals, percentages
  (idx: number) => {
    const triplets = [
      { f: "3/5", dec: "0.65", pct: "58%", order: "58% < 3/5 < 0.65", hint: "3/5 = 60%" },
      { f: "1/4", dec: "0.30", pct: "22%", order: "22% < 1/4 < 0.30", hint: "1/4 = 25%" },
      { f: "7/10", dec: "0.72", pct: "68%", order: "68% < 7/10 < 0.72", hint: "7/10 = 70%" },
      { f: "4/5", dec: "0.85", pct: "78%", order: "78% < 4/5 < 0.85", hint: "4/5 = 80%" }
    ];
    const t = triplets[idx % triplets.length];
    return {
      id: `q_b7_frac_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Arrange in ascending order: $${t.dec}, \\, ${t.f}, \\, ${t.pct}$.`,
      options: [
        t.order,
        `${t.dec} < ${t.pct} < ${t.f}`,
        `${t.f} < ${t.pct} < ${t.dec}`,
        `${t.pct} < ${t.dec} < ${t.f}`
      ],
      correctAnswer: t.order,
      hint: `Convert all numbers to percentage values first (${t.hint}).`,
      workedSolution: `Converting all to percentages yields: $${t.order}$.`,
      points: 1
    };
  },
  // Type D: Mixed number subtraction with regrouping
  (idx: number) => {
    const w = 3 + (idx % 3);
    // w 1/3 - 1 2/3 = (w - 1) - 1/3 = (w - 2) 2/3
    const ans = `${w - 2} 2/3`;
    return {
      id: `q_b7_frac_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Evaluate: $${w}\\frac{1}{3} - 1\\frac{2}{3}$.`,
      options: [ans, `${w - 1} 1/3`, `${w - 2} 1/3`, `${w - 1} 2/3`],
      correctAnswer: ans,
      hint: `Borrow 1 from the whole number: $${w}\\frac{1}{3} = ${w - 1}\\frac{4}{3}$.`,
      workedSolution: `$$${w}\\frac{1}{3} - 1\\frac{2}{3} = (${w - 1}\\frac{4}{3}) - 1\\frac{2}{3} = ${w - 2}\\frac{2}{3}$$.`,
      points: 1
    };
  }
];

for (let i = 6; i <= 50; i++) {
  const gFn = mediumGenerators[(i - 6) % mediumGenerators.length];
  mediumQuestions.push(gFn(i));
}

// -----------------------------------------------------------------------------
// 3. HARD TIER (DOK 3) - 50 ITEMS
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b7_frac_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A water tank was $\\frac{2}{3}$ full. After $150\\text{ litres}$ of water were drawn out, the tank became $\\frac{1}{4}$ full. Find the total capacity of the tank in litres.",
    options: ["360 litres", "300 litres", "450 litres", "240 litres"],
    correctAnswer: "360 litres",
    hint: "Fraction drained $= \\frac{2}{3} - \\frac{1}{4} = \\frac{5}{12}$. Set $\\frac{5}{12}C = 150$.",
    workedSolution: "$$\\frac{2}{3} - \\frac{1}{4} = \\frac{8 - 3}{12} = \\frac{5}{12}$$\n$$\\frac{5}{12}C = 150 \\implies C = 150 \\times \\frac{12}{5} = 30 \\times 12 = 360\\text{ litres}$$.",
    points: 2
  },
  {
    id: "q_b7_frac_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A trader spent $\\frac{2}{5}$ of her money on yams and $\\frac{1}{3}$ of the remainder on plantain. If she had $\\text{GH¢ } 800.00$ left, how much did she have originally?",
    options: ["GH¢ 2,000.00", "GH¢ 1,800.00", "GH¢ 2,400.00", "GH¢ 1,600.00"],
    correctAnswer: "GH¢ 2,000.00",
    hint: "Remainder after yams $= \\frac{3}{5}$. Plantain $= \\frac{1}{3} \\times \\frac{3}{5} = \\frac{1}{5}$. Leftover fraction $= \\frac{3}{5} - \\frac{1}{5} = \\frac{2}{5}$.",
    workedSolution: "$$\\text{Remaining after yams} = 1 - \\frac{2}{5} = \\frac{3}{5}$$\n$$\\text{Spent on plantain} = \\frac{1}{3} \\times \\frac{3}{5} = \\frac{1}{5}$$\n$$\\text{Total spent} = \\frac{2}{5} + \\frac{1}{5} = \\frac{3}{5} \\implies \\text{Fraction left} = \\frac{2}{5}$$\n$$\\frac{2}{5}M = 800 \\implies M = 800 \\times \\frac{5}{2} = \\text{GH¢ } 2,000.00$$.",
    points: 2
  },
  {
    id: "q_b7_frac_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Evaluate: $$\\left(3\\frac{1}{2} \\div 1\\frac{3}{4}\\right) + \\left(2\\frac{2}{3} \\times \\frac{3}{8}\\right)$$.",
    options: ["3", "2", "4", "2 1/2"],
    correctAnswer: "3",
    hint: "Evaluate each bracket independently: $\\frac{7}{2} \\div \\frac{7}{4} = 2$ and $\\frac{8}{3} \\times \\frac{3}{8} = 1$.",
    workedSolution: "$$\\left(\\frac{7}{2} \\times \\frac{4}{7}\\right) + \\left(\\frac{8}{3} \\times \\frac{3}{8}\\right) = 2 + 1 = 3$$.",
    points: 2
  },
  {
    id: "q_b7_frac_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "In a voting constituency, candidate A received $\\frac{4}{9}$ of the valid votes, candidate B received $\\frac{1}{3}$, and candidate C received the remaining $4,000$ votes. Find the total number of valid votes cast.",
    options: ["18,000", "24,000", "15,000", "36,000"],
    correctAnswer: "18,000",
    hint: "Fraction for C $= 1 - (\\frac{4}{9} + \\frac{3}{9}) = 1 - \\frac{7}{9} = \\frac{2}{9}$. Set $\\frac{2}{9}V = 4,000$.",
    workedSolution: "$$\\frac{4}{9} + \\frac{1}{3} = \\frac{4 + 3}{9} = \\frac{7}{9}$$\n$$\\text{Fraction for C} = 1 - \\frac{7}{9} = \\frac{2}{9}$$\n$$\\frac{2}{9}V = 4,000 \\implies V = 4,000 \\times \\frac{9}{2} = 2,000 \\times 9 = 18,000\\text{ votes}$$.",
    points: 2
  },
  {
    id: "q_b7_frac_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "If $\\frac{2}{3}$ of a number exceeds $\\frac{1}{2}$ of the same number by $12$, find the number.",
    options: ["72", "60", "48", "36"],
    correctAnswer: "72",
    hint: "Set up equation: $\\frac{2}{3}x - \\frac{1}{2}x = 12$.",
    workedSolution: "$$\\left(\\frac{4 - 3}{6}\\right)x = 12 \\implies \\frac{1}{6}x = 12 \\implies x = 12 \\times 6 = 72$$.",
    points: 2
  }
];

// Rich generator for Hard items 6 through 50
const hardGenerators = [
  // Type A: Multi-tier remainder word problems
  (idx: number) => {
    const initial = 1200 + (idx * 100);
    // fraction on food: 1/3, fraction of remainder on rent: 1/4
    // Remainder after food = 2/3
    // Rent = 1/4 * 2/3 = 1/6
    // Total spent = 1/3 + 1/6 = 1/2. Leftover = 1/2.
    const left = initial / 2;
    return {
      id: `q_b7_frac_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `A worker earns $\\text{GH¢ } ${initial}.00$. He spends $\\frac{1}{3}$ on food and $\\frac{1}{4}$ of the remainder on rent. How much money does he have left?`,
      options: [
        `GH¢ ${left.toFixed(2)}`,
        `GH¢ ${(left + 150).toFixed(2)}`,
        `GH¢ ${(left - 150).toFixed(2)}`,
        `GH¢ ${(initial / 3).toFixed(2)}`
      ],
      correctAnswer: `GH¢ ${left.toFixed(2)}`,
      hint: `Remainder after food is $\\frac{2}{3}$. Fraction for rent is $\\frac{1}{4} \\times \\frac{2}{3} = \\frac{1}{6}$. Total spent is $\\frac{1}{2}$.`,
      workedSolution: `$$\\text{Spent on food} = \\frac{1}{3} \\times ${initial} = ${initial / 3}$$\n$$\\text{Remainder} = ${initial - initial / 3}$$\n$$\\text{Spent on rent} = \\frac{1}{4} \\times ${initial - initial / 3} = ${(initial - initial / 3) / 4}$$\n$$\\text{Leftover} = \\text{GH¢ } ${left.toFixed(2)}$$.`,
      points: 2
    };
  },
  // Type B: Tank capacity fraction difference
  (idx: number) => {
    // Tank is 3/4 full, drained V litres, becomes 1/3 full.
    // 3/4 - 1/3 = 5/12.
    const k = (idx % 5) + 2; // 2, 3, 4, 5, 6
    const drained = 50 * k; // drained = 5/12 * Capacity => Capacity = drained * 12 / 5 = 120 * k
    const cap = 120 * k;
    return {
      id: `q_b7_frac_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `A fuel reservoir was $\\frac{3}{4}$ full. When $${drained}\\text{ litres}$ were consumed, it became $\\frac{1}{3}$ full. Find the total capacity of the reservoir.`,
      options: [
        `${cap} litres`,
        `${cap + 60} litres`,
        `${cap - 60} litres`,
        `${cap * 2} litres`
      ],
      correctAnswer: `${cap} litres`,
      hint: `Fraction drained $= \\frac{3}{4} - \\frac{1}{3} = \\frac{5}{12}$. Solve $\\frac{5}{12}C = ${drained}$.`,
      workedSolution: `$$\\frac{3}{4} - \\frac{1}{3} = \\frac{9 - 4}{12} = \\frac{5}{12}$$\n$$\\frac{5}{12}C = ${drained} \\implies C = ${drained} \\times \\frac{12}{5} = ${cap}\\text{ litres}$$.`,
      points: 2
    };
  },
  // Type C: Compound mixed fraction evaluation
  (idx: number) => {
    // (1 1/2 + 2 1/3) / (3 5/6) = 1
    return {
      id: `q_b7_frac_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Evaluate: $$\\frac{1\\frac{1}{2} + 2\\frac{1}{3}}{3\\frac{5}{6}}$$.`,
      options: ["1", "5/6", "2", "1 1/6"],
      correctAnswer: "1",
      hint: `Convert mixed numbers to improper fractions with common denominator 6.`,
      workedSolution: `$$\\text{Numerator: } \\frac{3}{2} + \\frac{7}{3} = \\frac{9 + 14}{6} = \\frac{23}{6}$$\n$$\\text{Denominator: } 3\\frac{5}{6} = \\frac{23}{6}$$\n$$\\frac{23/6}{23/6} = 1$$.`,
      points: 2
    };
  },
  // Type D: Algebraic fraction difference equals constant
  (idx: number) => {
    const diff = 10 + (idx % 10);
    // 3/4 x - 1/2 x = 1/4 x = diff => x = 4 * diff
    const xVal = 4 * diff;
    return {
      id: `q_b7_frac_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `If $\\frac{3}{4}$ of an unknown number exceeds $\\frac{1}{2}$ of the number by $${diff}$, what is the number?`,
      options: [String(xVal), String(xVal + 4), String(xVal - 4), String(2 * diff)],
      correctAnswer: String(xVal),
      hint: `$$\\left(\\frac{3}{4} - \\frac{1}{2}\\right)x = ${diff} \\implies \\frac{1}{4}x = ${diff}$$.`,
      workedSolution: `$$\\frac{1}{4}x = ${diff} \\implies x = ${diff} \\times 4 = ${xVal}$$.`,
      points: 2
    };
  }
];

for (let i = 6; i <= 50; i++) {
  const gFn = hardGenerators[(i - 6) % hardGenerators.length];
  hardQuestions.push(gFn(i));
}

async function seedB7FractionsPool() {
  const docPath = 'global_curriculum/jhs/subjects/math/topics/topic_fractions_decimals_percentages';
  const docRef = db.doc(docPath);
  
  const snap = await docRef.get();
  if (!snap.exists) {
    throw new Error(`Document topic_fractions_decimals_percentages does not exist at ${docPath}.`);
  }

  const existingData = snap.data() || {};

  const updatedPracticePool = {
    low: lowQuestions,
    medium: mediumQuestions,
    hard: hardQuestions
  };

  const b7Total = lowQuestions.length + mediumQuestions.length + hardQuestions.length;
  const b8Total = (existingData.levels?.b8?.practicePool?.low?.length || 0) +
                  (existingData.levels?.b8?.practicePool?.medium?.length || 0) +
                  (existingData.levels?.b8?.practicePool?.hard?.length || 0);
  const b9Total = (existingData.levels?.b9?.practicePool?.low?.length || 0) +
                  (existingData.levels?.b9?.practicePool?.medium?.length || 0) +
                  (existingData.levels?.b9?.practicePool?.hard?.length || 0);

  const totalQuestions = b7Total + b8Total + b9Total;

  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 7 PRACTICE POOL: topic_fractions_decimals_percentages');
  console.log('================================================================');
  console.log(`📦 Ingesting B7 Question Bank:`);
  console.log(`  • Low (DOK 1): ${lowQuestions.length} items`);
  console.log(`  • Medium (DOK 2): ${mediumQuestions.length} items`);
  console.log(`  • Hard (DOK 3): ${hardQuestions.length} items`);
  console.log(`  • Total B7 Items: ${b7Total}`);
  console.log(`  • Total Topic Practice Items (B7 + B8 + B9): ${totalQuestions}`);

  // Atomic update merging practicePool for both b7 and mirrored jhs1
  await docRef.update({
    'levels.b7.practicePool': updatedPracticePool,
    'levels.jhs1.practicePool': updatedPracticePool,
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
    if (raw.levels?.b7) raw.levels.b7.practicePool = updatedPracticePool;
    if (raw.levels?.jhs1) raw.levels.jhs1.practicePool = updatedPracticePool;
    raw.totalPracticeQuestions = totalQuestions;
    fs.writeFileSync(p1, JSON.stringify(raw, null, 2), 'utf-8');
    console.log(`💾 Synced local payload: ${p1}`);
  }

  if (fs.existsSync(p2)) {
    const raw = JSON.parse(fs.readFileSync(p2, 'utf-8'));
    if (raw.levels?.b7) raw.levels.b7.practicePool = updatedPracticePool;
    if (raw.levels?.jhs1) raw.levels.jhs1.practicePool = updatedPracticePool;
    raw.totalPracticeQuestions = totalQuestions;
    fs.writeFileSync(p2, JSON.stringify(raw, null, 2), 'utf-8');
    console.log(`💾 Synced local payload: ${p2}`);
  }

  console.log('🎉 B7 Fractions Question Bank expansion completed successfully.');
}

seedB7FractionsPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B7 fractions pool:', err);
    process.exit(1);
  });
