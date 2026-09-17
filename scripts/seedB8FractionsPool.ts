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
    id: "q_b8_frac_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $$\\frac{3}{4} \\div \\frac{3}{8}$$.",
    options: ["2", "1/2", "9/32", "1 1/2"],
    correctAnswer: "2",
    hint: "Invert the divisor and multiply: $\\frac{3}{4} \\times \\frac{8}{3}$.",
    workedSolution: "$$\\frac{3}{4} \\times \\frac{8}{3} = \\frac{24}{12} = 2$$.",
    points: 1
  },
  {
    id: "q_b8_frac_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $$\\frac{1}{2} + \\frac{1}{3} \\times \\frac{3}{4}$$.",
    options: ["3/4", "5/8", "5/12", "1"],
    correctAnswer: "3/4",
    hint: "Multiplication precedes addition in BODMAS: evaluate $\\frac{1}{3} \\times \\frac{3}{4}$ first.",
    workedSolution: "$$\\frac{1}{3} \\times \\frac{3}{4} = \\frac{1}{4}$$\n$$\\frac{1}{2} + \\frac{1}{4} = \\frac{2 + 1}{4} = \\frac{3}{4}$$.",
    points: 1
  },
  {
    id: "q_b8_frac_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $$\\left(\\frac{5}{6} - \\frac{1}{2}\\right) \\times 3$$.",
    options: ["1", "1/3", "2/3", "1 1/2"],
    correctAnswer: "1",
    hint: "Compute operations inside the bracket first.",
    workedSolution: "$$\\frac{5}{6} - \\frac{3}{6} = \\frac{2}{6} = \\frac{1}{3}$$\n$$\\frac{1}{3} \\times 3 = 1$$.",
    points: 1
  },
  {
    id: "q_b8_frac_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is $25\\%$ of $\\text{GH¢ } 360.00$?",
    options: ["GH¢ 90.00", "GH¢ 120.00", "GH¢ 80.00", "GH¢ 180.00"],
    correctAnswer: "GH¢ 90.00",
    hint: "$$25\\% = \\frac{1}{4}$$. Find $\\frac{1}{4} \\times 360$.",
    workedSolution: "$$\\frac{1}{4} \\times 360 = \\text{GH¢ } 90.00$$.",
    points: 1
  },
  {
    id: "q_b8_frac_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $$\\frac{2}{5} \\times \\frac{15}{16}$$.",
    options: ["3/8", "5/8", "3/16", "1/4"],
    correctAnswer: "3/8",
    hint: "Cross-cancel common factors between numerators and denominators.",
    workedSolution: "$$\\frac{2 \\times 15}{5 \\times 16} = \\frac{1 \\times 3}{1 \\times 8} = \\frac{3}{8}$$.",
    points: 1
  },
  {
    id: "q_b8_frac_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $$4 - 1\\frac{2}{5}$$.",
    options: ["2 3/5", "3 2/5", "2 2/5", "3 3/5"],
    correctAnswer: "2 3/5",
    hint: "Rewrite 4 as $3\\frac{5}{5}$.",
    workedSolution: "$$3\\frac{5}{5} - 1\\frac{2}{5} = (3 - 1) + \\left(\\frac{5 - 2}{5}\\right) = 2\\frac{3}{5}$$.",
    points: 1
  },
  {
    id: "q_b8_frac_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $$\\frac{5}{8} \\div 5$$.",
    options: ["1/8", "25/8", "1", "5/40"],
    correctAnswer: "1/8",
    hint: "Dividing by 5 is equivalent to multiplying by $\\frac{1}{5}$.",
    workedSolution: "$$\\frac{5}{8} \\times \\frac{1}{5} = \\frac{1}{8}$$.",
    points: 1
  },
  {
    id: "q_b8_frac_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What fraction of $1\\text{ hour}$ is $20\\text{ minutes}$?",
    options: ["1/3", "1/4", "1/5", "2/5"],
    correctAnswer: "1/3",
    hint: "$1\\text{ hour} = 60\\text{ minutes}$. Reduce $\\frac{20}{60}$.",
    workedSolution: "$$\\frac{20}{60} = \\frac{1}{3}$$.",
    points: 1
  },
  {
    id: "q_b8_frac_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $$\\frac{7}{10} - \\frac{2}{5}$$.",
    options: ["3/10", "1/2", "5/10", "1/5"],
    correctAnswer: "3/10",
    hint: "Express with common denominator 10: $\\frac{2}{5} = \\frac{4}{10}$.",
    workedSolution: "$$\\frac{7}{10} - \\frac{4}{10} = \\frac{3}{10}$$.",
    points: 1
  },
  {
    id: "q_b8_frac_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Find $10\\%$ of $\\text{GH¢ } 1,500.00$.",
    options: ["GH¢ 150.00", "GH¢ 15.00", "GH¢ 100.00", "GH¢ 300.00"],
    correctAnswer: "GH¢ 150.00",
    hint: "Divide $1,500$ by 10.",
    workedSolution: "$$\\frac{10}{100} \\times 1500 = \\text{GH¢ } 150.00$$.",
    points: 1
  }
];

// Varied WAEC DOK 1 generator for items 11 through 50
const lowGenerators = [
  // Type A: Fraction multiplication with integers
  (idx: number) => {
    const mult = (idx % 10 + 3) * 4;
    const ans = (3 * mult) / 4;
    return {
      id: `q_b8_frac_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Evaluate: $$\\frac{3}{4} \\times ${mult}$$.`,
      options: [String(ans), String(ans + 3), String(ans - 3), String(mult / 2)],
      correctAnswer: String(ans),
      hint: `Divide ${mult} by 4 and multiply by 3.`,
      workedSolution: `$$\\frac{3}{4} \\times ${mult} = 3 \\times ${mult / 4} = ${ans}$$.`,
      points: 1
    };
  },
  // Type B: Fraction division: a/b div c/d
  (idx: number) => {
    const pairs = [
      { a: 2, b: 3, c: 4, d: 9, ans: "3/2" }, // (2/3) * (9/4) = 18/12 = 3/2
      { a: 3, b: 5, c: 6, d: 25, ans: "5/2" }, // (3/5) * (25/6) = 75/30 = 5/2
      { a: 5, b: 6, c: 5, d: 12, ans: "2" }, // (5/6) * (12/5) = 2
      { a: 4, b: 7, c: 8, d: 21, ans: "3/2" } // (4/7) * (21/8) = 84/56 = 3/2
    ];
    const p = pairs[idx % pairs.length];
    return {
      id: `q_b8_frac_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Evaluate: $$\\frac{${p.a}}{${p.b}} \\div \\frac{${p.c}}{${p.d}}$$.`,
      options: [p.ans, "1", "2/3", "4/5"],
      correctAnswer: p.ans,
      hint: `Multiply by the reciprocal: $\\frac{${p.a}}{${p.b}} \\times \\frac{${p.d}}{${p.c}}$.`,
      workedSolution: `$$\\frac{${p.a}}{${p.b}} \\times \\frac{${p.d}}{${p.c}} = ${p.ans}$$.`,
      points: 1
    };
  },
  // Type C: Simple percentage of amount
  (idx: number) => {
    const pcts = [
      { p: 15, amt: 200, ans: 30 },
      { p: 20, amt: 450, ans: 90 },
      { p: 30, amt: 300, ans: 90 },
      { p: 5, amt: 800, ans: 40 }
    ];
    const item = pcts[idx % pcts.length];
    return {
      id: `q_b8_frac_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Find $${item.p}\\%$ of $\\text{GH¢ } ${item.amt}.00$.`,
      options: [`GH¢ ${item.ans}.00`, `GH¢ ${item.ans + 10}.00`, `GH¢ ${item.ans - 10}.00`, `GH¢ ${item.p}.00`],
      correctAnswer: `GH¢ ${item.ans}.00`,
      hint: `$$\\frac{${item.p}}{100} \\times ${item.amt}$$.`,
      workedSolution: `$$\\frac{${item.p}}{100} \\times ${item.amt} = \\text{GH¢ } ${item.ans}.00$$.`,
      points: 1
    };
  },
  // Type D: Two-operation basic BODMAS
  (idx: number) => {
    return {
      id: `q_b8_frac_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Evaluate: $$\\frac{2}{3} \\times \\frac{3}{4} + \\frac{1}{2}$$.`,
      options: ["1", "3/4", "1 1/2", "1/2"],
      correctAnswer: "1",
      hint: `Multiply first: $\\frac{2}{3} \\times \\frac{3}{4} = \\frac{1}{2}$. Then add $\\frac{1}{2}$.`,
      workedSolution: `$$\\frac{1}{2} + \\frac{1}{2} = 1$$.`,
      points: 1
    };
  }
];

for (let i = 11; i <= 50; i++) {
  const gFn = lowGenerators[(i - 11) % lowGenerators.length];
  lowQuestions.push(gFn(i));
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER (DOK 2) - 50 ITEMS
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b8_frac_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Evaluate: $$\\frac{3}{4} + \\frac{5}{8} \\times \\frac{4}{5} - \\frac{1}{6}$$.",
    options: ["1 1/12", "1 1/6", "5/6", "1"],
    correctAnswer: "1 1/12",
    hint: "Multiply first: $\\frac{5}{8} \\times \\frac{4}{5} = \\frac{1}{2}$, then find common denominator 12.",
    workedSolution: "$$\\frac{5}{8} \\times \\frac{4}{5} = \\frac{1}{2}$$\n$$\\frac{3}{4} + \\frac{1}{2} - \\frac{1}{6} = \\frac{9 + 6 - 2}{12} = \\frac{13}{12} = 1\\frac{1}{12}$$.",
    points: 1
  },
  {
    id: "q_b8_frac_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "In a school of 480 pupils, $\\frac{5}{8}$ walk to school, $\\frac{1}{4}$ take public transport, and the rest ride bicycles. How many pupils ride bicycles?",
    options: ["60", "80", "120", "40"],
    correctAnswer: "60",
    hint: "Sum fractions for walking and transport: $\\frac{5}{8} + \\frac{2}{8} = \\frac{7}{8}$. Bicycles $= 1 - \\frac{7}{8} = \\frac{1}{8}$.",
    workedSolution: "$$\\frac{5}{8} + \\frac{1}{4} = \\frac{5 + 2}{8} = \\frac{7}{8}$$\n$$\\text{Bicycle Fraction} = 1 - \\frac{7}{8} = \\frac{1}{8}$$\n$$\\text{Number of pupils} = \\frac{1}{8} \\times 480 = 60$$.",
    points: 1
  },
  {
    id: "q_b8_frac_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Evaluate: $$\\left(2\\frac{1}{2} + 1\\frac{3}{4}\\right) \\div 1\\frac{1}{8}$$.",
    options: ["3 7/9", "4", "3 1/2", "4 1/4"],
    correctAnswer: "3 7/9",
    hint: "Numerator: $\\frac{5}{2} + \\frac{7}{4} = \\frac{17}{4}$. Divisor: $\\frac{9}{8}$. Multiply $\\frac{17}{4} \\times \\frac{8}{9}$.",
    workedSolution: "$$\\frac{5}{2} + \\frac{7}{4} = \\frac{10 + 7}{4} = \\frac{17}{4}$$\n$$\\frac{17}{4} \\div \\frac{9}{8} = \\frac{17}{4} \\times \\frac{8}{9} = \\frac{34}{9} = 3\\frac{7}{9}$$.",
    points: 1
  },
  {
    id: "q_b8_frac_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A man earns $\\text{GH¢ } 3,600.00$ a month. He spends $40\\%$ on food and $\\frac{1}{4}$ on rent. How much money does he have left?",
    options: ["GH¢ 1,260.00", "GH¢ 1,440.00", "GH¢ 1,080.00", "GH¢ 1,620.00"],
    correctAnswer: "GH¢ 1,260.00",
    hint: "Total spent fraction $= 40\\% + 25\\% = 65\\%$. Remaining $= 35\\%$.",
    workedSolution: "$$\\text{Food} = 0.40 \\times 3,600 = \\text{GH¢ } 1,440.00$$\n$$\\text{Rent} = \\frac{1}{4} \\times 3,600 = \\text{GH¢ } 900.00$$\n$$\\text{Total Spent} = 1,440 + 900 = \\text{GH¢ } 2,340.00$$\n$$\\text{Balance Left} = 3,600 - 2,340 = \\text{GH¢ } 1,260.00$$.",
    points: 1
  },
  {
    id: "q_b8_frac_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Simplify: $$\\frac{4}{9} \\div \\left(\\frac{2}{3} - \\frac{1}{6}\\right)$$.",
    options: ["8/9", "2/3", "4/3", "1/2"],
    correctAnswer: "8/9",
    hint: "Evaluate bracket first: $\\frac{2}{3} - \\frac{1}{6} = \\frac{4 - 1}{6} = \\frac{3}{6} = \\frac{1}{2}$.",
    workedSolution: "$$\\frac{2}{3} - \\frac{1}{6} = \\frac{3}{6} = \\frac{1}{2}$$\n$$\\frac{4}{9} \\div \\frac{1}{2} = \\frac{4}{9} \\times 2 = \\frac{8}{9}$$.",
    points: 1
  }
];

// Rich generator for Medium items 6 through 50
const mediumGenerators = [
  // Type A: Profit / loss percentage application
  (idx: number) => {
    const baseVal = 100 + (idx * 15);
    const pct = (idx % 3 === 0) ? 25 : (idx % 3 === 1) ? 20 : 15;
    const profit = (baseVal * pct) / 100;
    const sp = baseVal + profit;
    return {
      id: `q_b8_frac_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `A merchant purchased goods for $\\text{GH¢ } ${baseVal}.00$ and sold them at a profit of $${pct}\\%$. Find the selling price.`,
      options: [
        `GH¢ ${sp.toFixed(2)}`,
        `GH¢ ${(baseVal + profit * 1.5).toFixed(2)}`,
        `GH¢ ${(baseVal - profit).toFixed(2)}`,
        `GH¢ ${(sp + 20).toFixed(2)}`
      ],
      correctAnswer: `GH¢ ${sp.toFixed(2)}`,
      hint: `Selling price $= \\text{Cost Price} \\times (1 + \\frac{${pct}}{100})$.`,
      workedSolution: `$$\\text{Selling Price} = ${baseVal} \\times ${(1 + pct / 100).toFixed(2)} = \\text{GH¢ } ${sp.toFixed(2)}$$.`,
      points: 1
    };
  },
  // Type B: Multi-step mixed fraction with BODMAS
  (idx: number) => {
    const w = 1 + (idx % 2);
    // (w 1/2) * (2/3) + 1/4 = (2w + 1)/2 * 2/3 + 1/4 = (2w+1)/3 + 1/4
    // for w = 1: 3/2 * 2/3 = 1. 1 + 1/4 = 1 1/4.
    // for w = 2: 5/2 * 2/3 = 5/3. 5/3 + 1/4 = 23/12 = 1 11/12.
    const ans = w === 1 ? "1 1/4" : "1 11/12";
    return {
      id: `q_b8_frac_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Evaluate: $$${w}\\frac{1}{2} \\times \\frac{2}{3} + \\frac{1}{4}$$.`,
      options: [ans, "1", "1 1/2", "2"],
      correctAnswer: ans,
      hint: `Multiply $${w}\\frac{1}{2} \\times \\frac{2}{3}$ first, then add $\\frac{1}{4}$.`,
      workedSolution: `$$${w}\\frac{1}{2} \\times \\frac{2}{3} = \\frac{${2 * w + 1}}{2} \\times \\frac{2}{3} = \\frac{${2 * w + 1}}{3}$$\n$$\\frac{${2 * w + 1}}{3} + \\frac{1}{4} = ${ans}$$.`,
      points: 1
    };
  },
  // Type C: Fractional parts in practical context (school pupils / books)
  (idx: number) => {
    const total = 240 + (idx * 20);
    // 3/8 pass grade A, 1/2 pass grade B, rest grade C
    // Fraction for C = 1 - (3/8 + 4/8) = 1/8
    const cCount = total / 8;
    return {
      id: `q_b8_frac_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `In an examination of $${total}$ candidates, $\\frac{3}{8}$ scored Grade A and $\\frac{1}{2}$ scored Grade B. The remainder scored Grade C. How many candidates scored Grade C?`,
      options: [String(cCount), String(cCount * 2), String(cCount + 15), String(total / 4)],
      correctAnswer: String(cCount),
      hint: `Sum the fractions for A and B: $\\frac{3}{8} + \\frac{4}{8} = \\frac{7}{8}$. Grade C is $\\frac{1}{8}$.`,
      workedSolution: `$$\\text{Grade C Fraction} = 1 - \\frac{7}{8} = \\frac{1}{8}$$\n$$\\text{Candidates} = \\frac{1}{8} \\times ${total} = ${cCount}$$.`,
      points: 1
    };
  },
  // Type D: Percentage decrease / discount
  (idx: number) => {
    const marked = 150 + (idx * 10);
    const discPct = 10;
    const sale = marked * 0.9;
    return {
      id: `q_b8_frac_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `An item marked at $\\text{GH¢ } ${marked}.00$ is discounted by $10\\%$. What is the cash price?`,
      options: [
        `GH¢ ${sale.toFixed(2)}`,
        `GH¢ ${(marked - 10).toFixed(2)}`,
        `GH¢ ${(marked * 0.85).toFixed(2)}`,
        `GH¢ ${(marked * 1.1).toFixed(2)}`
      ],
      correctAnswer: `GH¢ ${sale.toFixed(2)}`,
      hint: `Discount is $10\\%$. Cash price $= 90\\%$ of original marked price.`,
      workedSolution: `$$\\text{Discount} = 0.10 \\times ${marked} = \\text{GH¢ } ${(marked * 0.1).toFixed(2)}$$\n$$\\text{Cash Price} = ${marked} - ${(marked * 0.1).toFixed(2)} = \\text{GH¢ } ${sale.toFixed(2)}$$.`,
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
    id: "q_b8_frac_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Simplify completely: $$\\frac{1\\frac{1}{2} + 2\\frac{2}{3}}{3\\frac{1}{4} - 1\\frac{1}{6}}$$.",
    options: ["2", "1 1/2", "2 1/3", "1 3/4"],
    correctAnswer: "2",
    hint: "Evaluate numerator and denominator separately before dividing.",
    workedSolution: "$$\\text{Numerator} = \\frac{3}{2} + \\frac{8}{3} = \\frac{9 + 16}{6} = \\frac{25}{6}$$\n$$\\text{Denominator} = \\frac{13}{4} - \\frac{7}{6} = \\frac{39 - 14}{12} = \\frac{25}{12}$$\n$$\\frac{25}{6} \\div \\frac{25}{12} = \\frac{25}{6} \\times \\frac{12}{25} = 2$$.",
    points: 2
  },
  {
    id: "q_b8_frac_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Dufie spent $\\frac{1}{3}$ of her pocket money on breakfast and $\\frac{1}{6}$ of what was left on biscuits. If she still had $\\text{GH¢ } 55.00$ remaining, how much was her original pocket money?",
    options: ["GH¢ 99.00", "GH¢ 110.00", "GH¢ 90.00", "GH¢ 85.00"],
    correctAnswer: "GH¢ 99.00",
    hint: "Remainder after breakfast is $2/3$. Biscuits take $1/6 \\times 2/3 = 1/9$. Final remainder fraction is $2/3 - 1/9 = 5/9$.",
    workedSolution: "$$\\text{Remainder after breakfast} = 1 - \\frac{1}{3} = \\frac{2}{3}$$\n$$\\text{Biscuits} = \\frac{1}{6} \\times \\frac{2}{3} = \\frac{1}{9}$$\n$$\\text{Remaining Fraction} = \\frac{2}{3} - \\frac{1}{9} = \\frac{6 - 1}{9} = \\frac{5}{9}$$\n$$\\frac{5}{9}M = 55 \\implies M = 55 \\times \\frac{9}{5} = 11 \\times 9 = \\text{GH¢ } 99.00$$.",
    points: 2
  },
  {
    id: "q_b8_frac_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Evaluate: $$\\frac{\\left(\\frac{2}{3} + \\frac{1}{4}\\right) \\times 2\\frac{2}{5}}{\\frac{5}{6} - \\frac{1}{3}}$$.",
    options: ["4.4", "3.2", "4.0", "5.1"],
    correctAnswer: "4.4",
    hint: "Numerator: $\\frac{11}{12} \\times \\frac{12}{5} = \\frac{11}{5}$. Denominator: $\\frac{5}{6} - \\frac{2}{6} = \\frac{3}{6} = \\frac{1}{2}$.",
    workedSolution: "$$\\text{Numerator} = \\left(\\frac{8 + 3}{12}\\right) \\times \\frac{12}{5} = \\frac{11}{12} \\times \\frac{12}{5} = \\frac{11}{5}$$\n$$\\text{Denominator} = \\frac{1}{2}$$\n$$\\frac{11}{5} \\div \\frac{1}{2} = \\frac{11}{5} \\times 2 = \\frac{22}{5} = 4.4$$.",
    points: 2
  },
  {
    id: "q_b8_frac_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A farmer sold $\\frac{2}{5}$ of his harvest of yams to a wholesaler and $25\\%$ of the remainder to a retailer. If he still has $360$ tubers left, how many yams did he harvest altogether?",
    options: ["800", "720", "900", "1,000"],
    correctAnswer: "800",
    hint: "Remainder after wholesaler is $3/5$. Retailer gets $1/4 \\times 3/5 = 3/20$. Final fraction is $3/5 - 3/20 = 9/20$.",
    workedSolution: "$$\\text{Left after wholesaler} = 1 - \\frac{2}{5} = \\frac{3}{5}$$\n$$\\text{Sold to retailer} = \\frac{1}{4} \\times \\frac{3}{5} = \\frac{3}{20}$$\n$$\\text{Final leftover fraction} = \\frac{3}{5} - \\frac{3}{20} = \\frac{12 - 3}{20} = \\frac{9}{20}$$\n$$\\frac{9}{20}Y = 360 \\implies Y = 360 \\times \\frac{20}{9} = 40 \\times 20 = 800\\text{ tubers}$$.",
    points: 2
  },
  {
    id: "q_b8_frac_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Simplify without using a calculator: $$\\frac{3\\frac{1}{2} - 1\\frac{1}{4}}{2\\frac{1}{3} + 1\\frac{1}{6}} \\times 1\\frac{5}{9}$$.",
    options: ["1", "1 1/3", "3/4", "2"],
    correctAnswer: "1",
    hint: "Numerator: $\\frac{7}{2} - \\frac{5}{4} = \\frac{9}{4}$. Denominator: $\\frac{7}{3} + \\frac{7}{6} = \\frac{21}{6} = \\frac{7}{2}$.",
    workedSolution: "$$\\text{Numerator} = \\frac{14 - 5}{4} = \\frac{9}{4}$$\n$$\\text{Denominator} = \\frac{14 + 7}{6} = \\frac{21}{6} = \\frac{7}{2}$$\n$$\\frac{9}{4} \\div \\frac{7}{2} = \\frac{9}{4} \\times \\frac{2}{7} = \\frac{9}{14}$$\n$$\\frac{9}{14} \\times 1\\frac{5}{9} = \\frac{9}{14} \\times \\frac{14}{9} = 1$$.",
    points: 2
  }
];

// Rich generator for Hard items 6 through 50
const hardGenerators = [
  // Type A: Multi-stage remainder allocation
  (idx: number) => {
    const baseSalary = 1200 + (idx * 60);
    // Mother gets 1/3, utilities get 1/4 of remainder, savings = rest = (2/3) * (3/4) = 1/2
    const ans = baseSalary / 2;
    return {
      id: `q_b8_frac_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `An artisan receives $\\text{GH¢ } ${baseSalary}.00$. He gives $\\frac{1}{3}$ to his mother, spends $\\frac{1}{4}$ of the remainder on utilities, and saves the rest. How much does he save?`,
      options: [
        `GH¢ ${ans.toFixed(2)}`,
        `GH¢ ${(ans + 100).toFixed(2)}`,
        `GH¢ ${(ans - 100).toFixed(2)}`,
        `GH¢ ${(baseSalary / 3).toFixed(2)}`
      ],
      correctAnswer: `GH¢ ${ans.toFixed(2)}`,
      hint: `Remainder after mother is $\\frac{2}{3}$. Utilities take $\\frac{1}{4} \\times \\frac{2}{3} = \\frac{1}{6}$. Total spent is $\\frac{1}{2}$, so savings is $\\frac{1}{2}$.`,
      workedSolution: `$$\\text{Savings Fraction} = \\frac{2}{3} \\times \\left(1 - \\frac{1}{4}\\right) = \\frac{2}{3} \\times \\frac{3}{4} = \\frac{1}{2}$$\n$$\\text{Savings} = \\frac{1}{2} \\times ${baseSalary} = \\text{GH¢ } ${ans.toFixed(2)}$$.`,
      points: 2
    };
  },
  // Type B: Multi-tier complex fraction evaluation: (a/b - c/d) / (e/f + g/h)
  (idx: number) => {
    // ((5/2 - 1/3) / (13/6)) = (13/6) / (13/6) = 1
    return {
      id: `q_b8_frac_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Simplify: $$\\frac{2\\frac{1}{2} - \\frac{1}{3}}{1\\frac{1}{2} + \\frac{2}{3}}$$.`,
      options: ["1", "1 1/6", "5/6", "2"],
      correctAnswer: "1",
      hint: `Evaluate numerator and denominator separately using common denominator 6.`,
      workedSolution: `$$\\text{Numerator: } \\frac{5}{2} - \\frac{1}{3} = \\frac{15 - 2}{6} = \\frac{13}{6}$$\n$$\\text{Denominator: } \\frac{3}{2} + \\frac{2}{3} = \\frac{9 + 4}{6} = \\frac{13}{6}$$\n$$\\frac{13/6}{13/6} = 1$$.`,
      points: 2
    };
  },
  // Type C: Capacity & water tank problems
  (idx: number) => {
    const k = (idx % 6) + 3;
    const drawn = 30 * k;
    // was 5/6 full, now 1/2 full => drained 5/6 - 3/6 = 2/6 = 1/3.
    // 1/3 C = drawn => C = 3 * drawn
    const cap = 3 * drawn;
    return {
      id: `q_b8_frac_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `A community storage tank was $\\frac{5}{6}$ full of water. After $${drawn}\\text{ litres}$ were used for irrigation, the tank was $\\frac{1}{2}$ full. What is the full capacity of the tank?`,
      options: [
        `${cap} litres`,
        `${cap + 60} litres`,
        `${cap - 60} litres`,
        `${cap * 2} litres`
      ],
      correctAnswer: `${cap} litres`,
      hint: `Fraction used $= \\frac{5}{6} - \\frac{1}{2} = \\frac{5 - 3}{6} = \\frac{2}{6} = \\frac{1}{3}$. Set $\\frac{1}{3}C = ${drawn}$.`,
      workedSolution: `$$\\frac{1}{3}C = ${drawn} \\implies C = ${drawn} \\times 3 = ${cap}\\text{ litres}$$.`,
      points: 2
    };
  },
  // Type D: Inheritance / land sharing problem
  (idx: number) => {
    const totalAcres = 120 + (idx * 12);
    // Eldest gets 2/5, second gets 1/3 of remainder, youngest gets rest
    // remainder = 3/5. second = 1/3 * 3/5 = 1/5.
    // youngest = 3/5 - 1/5 = 2/5.
    const youngestShare = (totalAcres * 2) / 5;
    return {
      id: `q_b8_frac_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `A piece of land measuring $${totalAcres}\\text{ acres}$ was shared among three siblings. The eldest received $\\frac{2}{5}$ of the land, the second received $\\frac{1}{3}$ of the remainder, and the youngest received the rest. How many acres did the youngest receive?`,
      options: [
        `${youngestShare} acres`,
        `${youngestShare + 10} acres`,
        `${youngestShare - 10} acres`,
        `${totalAcres / 3} acres`
      ],
      correctAnswer: `${youngestShare} acres`,
      hint: `Calculate remainder after eldest: $\\frac{3}{5}$. Second gets $\\frac{1}{3} \\times \\frac{3}{5} = \\frac{1}{5}$. Youngest gets $\\frac{2}{5}$.`,
      workedSolution: `$$\\text{Youngest Fraction} = \\frac{3}{5} - \\left(\\frac{1}{3} \\times \\frac{3}{5}\\right) = \\frac{3}{5} - \\frac{1}{5} = \\frac{2}{5}$$\n$$\\text{Youngest Share} = \\frac{2}{5} \\times ${totalAcres} = ${youngestShare}\\text{ acres}$$.`,
      points: 2
    };
  }
];

for (let i = 6; i <= 50; i++) {
  const gFn = hardGenerators[(i - 6) % hardGenerators.length];
  hardQuestions.push(gFn(i));
}

async function seedB8FractionsPool() {
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

  const b7Total = (existingData.levels?.b7?.practicePool?.low?.length || 0) +
                  (existingData.levels?.b7?.practicePool?.medium?.length || 0) +
                  (existingData.levels?.b7?.practicePool?.hard?.length || 0);
  const b8Total = lowQuestions.length + mediumQuestions.length + hardQuestions.length;
  const b9Total = (existingData.levels?.b9?.practicePool?.low?.length || 0) +
                  (existingData.levels?.b9?.practicePool?.medium?.length || 0) +
                  (existingData.levels?.b9?.practicePool?.hard?.length || 0);

  const totalQuestions = b7Total + b8Total + b9Total;

  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 8 PRACTICE POOL: topic_fractions_decimals_percentages');
  console.log('================================================================');
  console.log(`📦 Ingesting B8 Question Bank:`);
  console.log(`  • Low (DOK 1): ${lowQuestions.length} items`);
  console.log(`  • Medium (DOK 2): ${mediumQuestions.length} items`);
  console.log(`  • Hard (DOK 3): ${hardQuestions.length} items`);
  console.log(`  • Total B8 Items: ${b8Total}`);
  console.log(`  • Total Topic Practice Items (B7 + B8 + B9): ${totalQuestions}`);

  // Atomic update merging practicePool for both b8 and mirrored jhs2
  await docRef.update({
    'levels.b8.practicePool': updatedPracticePool,
    'levels.jhs2.practicePool': updatedPracticePool,
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
    if (raw.levels?.b8) raw.levels.b8.practicePool = updatedPracticePool;
    if (raw.levels?.jhs2) raw.levels.jhs2.practicePool = updatedPracticePool;
    raw.totalPracticeQuestions = totalQuestions;
    fs.writeFileSync(p1, JSON.stringify(raw, null, 2), 'utf-8');
    console.log(`💾 Synced local payload: ${p1}`);
  }

  if (fs.existsSync(p2)) {
    const raw = JSON.parse(fs.readFileSync(p2, 'utf-8'));
    if (raw.levels?.b8) raw.levels.b8.practicePool = updatedPracticePool;
    if (raw.levels?.jhs2) raw.levels.jhs2.practicePool = updatedPracticePool;
    raw.totalPracticeQuestions = totalQuestions;
    fs.writeFileSync(p2, JSON.stringify(raw, null, 2), 'utf-8');
    console.log(`💾 Synced local payload: ${p2}`);
  }

  console.log('🎉 B8 Fractions Question Bank expansion completed successfully.');
}

seedB8FractionsPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B8 fractions pool:', err);
    process.exit(1);
  });
