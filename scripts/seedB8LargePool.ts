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
    id: "q_b8_num_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Express $0.000452$ in standard form (scientific notation).",
    options: ["4.52 × 10⁻⁴", "4.52 × 10⁴", "45.2 × 10⁻⁵", "4.52 × 10⁻³"],
    correctAnswer: "4.52 × 10⁻⁴",
    hint: "Move the decimal point until there is one non-zero digit before it.",
    workedSolution: "Shifting the decimal point 4 places to the right gives $4.52 \\times 10^{-4}$.",
    points: 1
  },
  {
    id: "q_b8_num_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "How many significant figures are in the number $0.05040$?",
    options: ["4", "3", "5", "2"],
    correctAnswer: "4",
    hint: "Leading zeros are not significant; captive and trailing decimal zeros are significant.",
    workedSolution: "The digits 5, 0, 4, 0 are significant. The two leading zeros are place-holders. Total = 4 significant figures.",
    points: 1
  },
  {
    id: "q_b8_num_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $2^3 \\times 2^4$.",
    options: ["2⁷", "2¹²", "4⁷", "4¹²"],
    correctAnswer: "2⁷",
    hint: "Product Law of indices: $a^m \\times a^n = a^{m+n}$.",
    workedSolution: "$$2^3 \\times 2^4 = 2^{3+4} = 2^7$$.",
    points: 1
  },
  {
    id: "q_b8_num_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the value of $7^0$?",
    options: ["1", "0", "7", "undefined"],
    correctAnswer: "1",
    hint: "Any non-zero real number raised to the zero power equals 1.",
    workedSolution: "$$a^0 = 1 \\implies 7^0 = 1$$.",
    points: 1
  },
  {
    id: "q_b8_num_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Express $3^{-2}$ as a common fraction.",
    options: ["1/9", "1/6", "-9", "-6"],
    correctAnswer: "1/9",
    hint: "Negative index law: $a^{-n} = \\frac{1}{a^n}$.",
    workedSolution: "$$3^{-2} = \\frac{1}{3^2} = \\frac{1}{9}$$.",
    points: 1
  },
  {
    id: "q_b8_num_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert the recurring decimal $0.\\dot{4}$ into a common fraction.",
    options: ["4/9", "4/10", "2/5", "4/99"],
    correctAnswer: "4/9",
    hint: "A single repeating digit $0.\\dot{d} = \\frac{d}{9}$.",
    workedSolution: "$$x = 0.444... \\implies 10x - x = 4 \\implies 9x = 4 \\implies x = \\frac{4}{9}$$.",
    points: 1
  },
  {
    id: "q_b8_num_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $10^5 \\div 10^2$.",
    options: ["10³", "10⁷", "10¹⁰", "10²·⁵"],
    correctAnswer: "10³",
    hint: "Quotient Law: $a^m \\div a^n = a^{m-n}$.",
    workedSolution: "$$10^5 \\div 10^2 = 10^{5-2} = 10^3$$.",
    points: 1
  },
  {
    id: "q_b8_num_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Write $5,600,000$ in standard form.",
    options: ["5.6 × 10⁶", "5.6 × 10⁵", "56 × 10⁵", "5.6 × 10⁷"],
    correctAnswer: "5.6 × 10⁶",
    hint: "Shift the decimal 6 places to the left.",
    workedSolution: "$$5,600,000 = 5.6 \\times 10^6$$.",
    points: 1
  },
  {
    id: "q_b8_num_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Simplify: $(3^2)^3$.",
    options: ["3⁶", "3⁵", "3⁸", "9³"],
    correctAnswer: "3⁶",
    hint: "Power of a power law: $(a^m)^n = a^{m \\times n}$.",
    workedSolution: "$$(3^2)^3 = 3^{2 \\times 3} = 3^6$$.",
    points: 1
  },
  {
    id: "q_b8_num_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $\\frac{2}{3} + \\frac{1}{4}$.",
    options: ["11/12", "3/7", "3/12", "1/2"],
    correctAnswer: "11/12",
    hint: "Find the LCM of 3 and 4, which is 12.",
    workedSolution: "$$\\frac{8 + 3}{12} = \\frac{11}{12}$$.",
    points: 1
  }
];

// Rich, varied WAEC DOK 1 generator for items 11 through 50
const lowTemplates = [
  // Type A: Standard form conversion for small decimals
  (idx: number) => {
    const shift = (idx % 4) + 2;
    const num = (idx * 3 + 12);
    const mantissa = (num / 10).toFixed(1);
    const decVal = (Number(mantissa) * Math.pow(10, -shift)).toFixed(shift + 1);
    const standardStr = `${mantissa} × 10⁻${shift}`;
    return {
      id: `q_b8_num_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Express $${decVal}$ in standard form (scientific notation).`,
      options: [
        standardStr,
        `${mantissa} × 10⁻${shift - 1}`,
        `${mantissa} × 10⁻${shift + 1}`,
        `${(Number(mantissa) * 10).toFixed(0)} × 10⁻${shift + 1}`
      ],
      correctAnswer: standardStr,
      hint: `Move decimal point until $1 \\le A < 10$, counting places shifted to the right.`,
      workedSolution: `Moving ${shift} decimal places to the right gives $${standardStr}$.`,
      points: 1
    };
  },
  // Type B: Significant figures count
  (idx: number) => {
    const cases = [
      { val: "305.0", sig: 4, opts: ["4", "3", "5", "2"], reason: "Captive and trailing decimal zeros are significant" },
      { val: "0.0072", sig: 2, opts: ["2", "4", "3", "1"], reason: "Leading zeros are not significant" },
      { val: "4,008", sig: 4, opts: ["4", "2", "3", "5"], reason: "Zeros between non-zero digits are significant" },
      { val: "8.00", sig: 3, opts: ["3", "1", "2", "4"], reason: "Trailing zeros after a decimal point are significant" }
    ];
    const c = cases[idx % cases.length];
    return {
      id: `q_b8_num_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `How many significant figures are in the number $${c.val}$?`,
      options: c.opts,
      correctAnswer: String(c.sig),
      hint: `Recall significant figure rules for leading, captive, and trailing zeros.`,
      workedSolution: `$${c.val}$ has ${c.sig} significant figures because ${c.reason}.`,
      points: 1
    };
  },
  // Type C: Index law calculation
  (idx: number) => {
    const bases = [2, 3, 5];
    const b = bases[idx % bases.length];
    const p1 = (idx % 3) + 2;
    const p2 = (idx % 2) + 1;
    const isMult = idx % 2 === 0;
    if (isMult) {
      const ansPow = p1 + p2;
      return {
        id: `q_b8_num_l${idx < 10 ? '0' + idx : idx}`,
        difficulty: "low",
        dokLevel: 1,
        prompt: `Simplify: $${b}^${p1} \\times ${b}^${p2}$.`,
        options: [`${b}^${ansPow}`, `${b}^${p1 * p2}`, `${b * 2}^${ansPow}`, `${b}^${ansPow + 1}`],
        correctAnswer: `${b}^${ansPow}`,
        hint: `Product Law: Add exponents when bases are identical.`,
        workedSolution: `$$${b}^${p1} \\times ${b}^${p2} = ${b}^{${p1} + ${p2}} = ${b}^${ansPow}$$.`,
        points: 1
      };
    } else {
      const pTop = p1 + p2;
      return {
        id: `q_b8_num_l${idx < 10 ? '0' + idx : idx}`,
        difficulty: "low",
        dokLevel: 1,
        prompt: `Simplify: $${b}^${pTop} \\div ${b}^${p2}$.`,
        options: [`${b}^${p1}`, `${b}^${pTop / p2}`, `${b}^${pTop + p2}`, `1`],
        correctAnswer: `${b}^${p1}`,
        hint: `Quotient Law: Subtract exponents when dividing same bases.`,
        workedSolution: `$$${b}^${pTop} \\div ${b}^${p2} = ${b}^{${pTop} - ${p2}} = ${b}^${p1}$$.`,
        points: 1
      };
    }
  },
  // Type D: Recurring decimal simple conversion
  (idx: number) => {
    const recs = [
      { d: "1", frac: "1/9", opts: ["1/9", "1/10", "1/99", "1/3"] },
      { d: "2", frac: "2/9", opts: ["2/9", "2/10", "1/5", "2/99"] },
      { d: "5", frac: "5/9", opts: ["5/9", "5/10", "1/2", "5/99"] },
      { d: "7", frac: "7/9", opts: ["7/9", "7/10", "7/99", "3/4"] },
      { d: "8", frac: "8/9", opts: ["8/9", "8/10", "4/5", "8/99"] }
    ];
    const r = recs[idx % recs.length];
    return {
      id: `q_b8_num_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Convert the recurring decimal $0.\\dot{${r.d}}$ into a common fraction.`,
      options: r.opts,
      correctAnswer: r.frac,
      hint: `For a single repeating digit $d$, $0.\\dot{d} = \\frac{d}{9}$.`,
      workedSolution: `Let $x = 0.${r.d}${r.d}...$. Then $10x = ${r.d}.${r.d}${r.d}... \\implies 9x = ${r.d} \\implies x = \\frac{${r.d}}{9}$.`,
      points: 1
    };
  }
];

for (let i = 11; i <= 50; i++) {
  const tFn = lowTemplates[(i - 11) % lowTemplates.length];
  lowQuestions.push(tFn(i));
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER (DOK 2) - 50 ITEMS
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b8_num_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Solve for $x$ in the equation: $3^{x+1} = 81$.",
    options: ["3", "4", "2", "5"],
    correctAnswer: "3",
    hint: "Express 81 in base 3: $81 = 3^4$.",
    workedSolution: "$$3^{x+1} = 3^4 \\implies x + 1 = 4 \\implies x = 3$$.",
    points: 1
  },
  {
    id: "q_b8_num_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Convert the recurring decimal $0.\\dot{2}\\dot{7}$ to a common fraction in its lowest terms.",
    options: ["3/11", "27/100", "9/33", "27/90"],
    correctAnswer: "3/11",
    hint: "Two repeating digits: $0.\\dot{a}\\dot{b} = \\frac{ab}{99}$. Reduce by 9.",
    workedSolution: "$$\\frac{27}{99} = \\frac{27 \\div 9}{99 \\div 9} = \\frac{3}{11}$$.",
    points: 1
  },
  {
    id: "q_b8_num_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Evaluate: $$\\left(2\\frac{1}{2} - 1\\frac{1}{3}\\right) \\div \\frac{7}{6}$$.",
    options: ["1", "7/6", "1/2", "2"],
    correctAnswer: "1",
    hint: "Subtract fractions in parentheses first, then multiply by the reciprocal.",
    workedSolution: "$$2\\frac{1}{2} - 1\\frac{1}{3} = \\frac{5}{2} - \\frac{4}{3} = \\frac{15 - 8}{6} = \\frac{7}{6}$$\n$$\\frac{7}{6} \\div \\frac{7}{6} = 1$$.",
    points: 1
  },
  {
    id: "q_b8_num_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Simplify and express in standard form: $(3.0 \\times 10^4) \\times (4.0 \\times 10^3)$.",
    options: ["1.2 × 10⁸", "12 × 10⁷", "1.2 × 10⁷", "7.0 × 10⁷"],
    correctAnswer: "1.2 × 10⁸",
    hint: "Multiply mantissas: $3.0 \\times 4.0 = 12.0$, then adjust to $1 \\le A < 10$.",
    workedSolution: "$$(3.0 \\times 4.0) \\times 10^{4+3} = 12.0 \\times 10^7 = 1.2 \\times 10^8$$.",
    points: 1
  },
  {
    id: "q_b8_num_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Solve for $y$: $2^{2y-1} = \\frac{1}{8}$.",
    options: ["-1", "-2", "1", "2"],
    correctAnswer: "-1",
    hint: "Express $\\frac{1}{8} = 2^{-3}$.",
    workedSolution: "$$2^{2y-1} = 2^{-3} \\implies 2y - 1 = -3 \\implies 2y = -2 \\implies y = -1$$.",
    points: 1
  }
];

// Rich generator for Medium items 6 through 50
const mediumGenerators = [
  // Type A: Solving elementary indicial equations: a^(x+b) = a^c
  (idx: number) => {
    const bases = [2, 3, 5];
    const b = bases[idx % bases.length];
    const c = 3 + (idx % 3);
    const offset = 1 + (idx % 2);
    const ans = c - offset;
    const rhs = Math.pow(b, c);
    return {
      id: `q_b8_num_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Solve for $x$ in the indicial equation: $${b}^{x + ${offset}} = ${rhs}$.`,
      options: [String(ans), String(ans + 1), String(ans - 1), String(ans + 2)],
      correctAnswer: String(ans),
      hint: `Express $${rhs}$ as a power of $${b}$: $${rhs} = ${b}^${c}$.`,
      workedSolution: `$$${b}^{x + ${offset}} = ${b}^${c} \\implies x + ${offset} = ${c} \\implies x = ${ans}$$.`,
      points: 1
    };
  },
  // Type B: Two-digit recurring decimal conversion
  (idx: number) => {
    const pairs = [
      { ab: 18, reduced: "2/11", g: 9 },
      { ab: 36, reduced: "4/11", g: 9 },
      { ab: 45, reduced: "5/11", g: 9 },
      { ab: 54, reduced: "6/11", g: 9 },
      { ab: 63, reduced: "7/11", g: 9 },
      { ab: 72, reduced: "8/11", g: 9 }
    ];
    const p = pairs[idx % pairs.length];
    return {
      id: `q_b8_num_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Convert the recurring decimal $0.\\dot{${Math.floor(p.ab / 10)}}\\dot{${p.ab % 10}}$ to a common fraction in its lowest terms.`,
      options: [p.reduced, `${p.ab}/100`, `${p.ab}/90`, `${p.ab}/999`],
      correctAnswer: p.reduced,
      hint: `Two repeating digits: $\\frac{${p.ab}}{99}$, then simplify by dividing by ${p.g}.`,
      workedSolution: `$$x = 0.\\dot{${Math.floor(p.ab / 10)}}\\dot{${p.ab % 10}} \\implies 99x = ${p.ab} \\implies x = \\frac{${p.ab}}{99} = ${p.reduced}$$.`,
      points: 1
    };
  },
  // Type C: Standard form multiplication & division
  (idx: number) => {
    const a = 2 + (idx % 3);
    const b = 3 + (idx % 2);
    const p1 = 4 + (idx % 3);
    const p2 = 3 + (idx % 2);
    const prod = a * b;
    const isOver10 = prod >= 10;
    const mantissa = isOver10 ? (prod / 10).toFixed(1) : prod.toFixed(1);
    const exp = isOver10 ? p1 + p2 + 1 : p1 + p2;
    const ansStr = `${mantissa} × 10^${exp}`;
    return {
      id: `q_b8_num_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Evaluate and express in standard form: $(${a}.0 \\times 10^${p1}) \\times (${b}.0 \\times 10^${p2})$.`,
      options: [
        ansStr,
        `${mantissa} × 10^${exp - 1}`,
        `${mantissa} × 10^${exp + 1}`,
        `${prod} × 10^${p1 + p2}`
      ],
      correctAnswer: ansStr,
      hint: `Multiply numbers ($${a} \\times ${b} = ${prod}$), add exponents of 10, then format to $1 \\le A < 10$.`,
      workedSolution: `$$(${a} \\times ${b}) \\times 10^{${p1} + ${p2}} = ${prod} \\times 10^{${p1 + p2}} = ${ansStr}$$.`,
      points: 1
    };
  },
  // Type D: Mixed fraction arithmetic with order of operations
  (idx: number) => {
    const w = 1 + (idx % 2);
    return {
      id: `q_b8_num_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Evaluate: $$\\left(${w}\\frac{1}{2} + \\frac{3}{4}\\right) \\times \\frac{4}{9}$$.`,
      options: ["1", "5/4", "3/4", "1 1/2"],
      correctAnswer: "1",
      hint: `Add fractions inside parentheses first, then multiply.`,
      workedSolution: `$$\\frac{${2 * w + 1}}{2} + \\frac{3}{4} = \\frac{${4 * w + 2} + 3}{4} = \\frac{9}{4}$$\n$$\\frac{9}{4} \\times \\frac{4}{9} = 1$$.`,
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
    id: "q_b8_num_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Convert the delayed recurring decimal $0.1\\dot{6}$ ($0.1666...$) into a simple fraction in its lowest terms.",
    options: ["1/6", "16/99", "1/60", "2/15"],
    correctAnswer: "1/6",
    hint: "Multiply by 10 and 100: $100x - 10x = 16.666... - 1.666... = 15$.",
    workedSolution: "$$10x = 1.666...$$\n$$100x = 16.666...$$\n$$90x = 15 \\implies x = \\frac{15}{90} = \\frac{1}{6}$$.",
    points: 2
  },
  {
    id: "q_b8_num_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Evaluate and express your answer in standard form: $$\\frac{0.00036 \\times 40,000}{0.0012}$$.",
    options: ["1.2 × 10⁴", "1.2 × 10³", "1.2 × 10⁵", "12 × 10³"],
    correctAnswer: "1.2 × 10⁴",
    hint: "Convert all numbers into standard form before multiplying and dividing.",
    workedSolution: "$$\\frac{(3.6 \\times 10^{-4}) \\times (4.0 \\times 10^4)}{1.2 \\times 10^{-3}} = \\frac{14.4 \\times 10^0}{1.2 \\times 10^{-3}} = 12 \\times 10^3 = 1.2 \\times 10^4$$.",
    points: 2
  },
  {
    id: "q_b8_num_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Solve for $x$: $$\\left(\\frac{1}{4}\\right)^{x-1} = 32$$.",
    options: ["-3/2", "-1/2", "3/2", "-5/2"],
    correctAnswer: "-3/2",
    hint: "Express both sides in base 2: $\\frac{1}{4} = 2^{-2}$ and $32 = 2^5$.",
    workedSolution: "$$(2^{-2})^{x-1} = 2^5 \\implies -2(x - 1) = 5 \\implies -2x + 2 = 5 \\implies -2x = 3 \\implies x = -\\frac{3}{2}$$.",
    points: 2
  },
  {
    id: "q_b8_num_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Simplify without using tables or calculators: $$\\frac{3\\frac{1}{3} \\times 1\\frac{1}{2} - 1\\frac{1}{4}}{2\\frac{1}{2} + 1\\frac{1}{4}}$$.",
    options: ["1", "1 1/2", "3/4", "2"],
    correctAnswer: "1",
    hint: "Apply BODMAS: compute product in numerator first, then divide by the denominator sum.",
    workedSolution: "$$\\text{Numerator: } \\frac{10}{3} \\times \\frac{3}{2} - \\frac{5}{4} = 5 - \\frac{5}{4} = \\frac{15}{4}$$\n$$\\text{Denominator: } \\frac{5}{2} + \\frac{5}{4} = \\frac{10 + 5}{4} = \\frac{15}{4}$$\n$$\\frac{15/4}{15/4} = 1$$.",
    points: 2
  },
  {
    id: "q_b8_num_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Express the recurring decimal $1.\\dot{2}\\dot{3}$ as an improper fraction in its lowest terms.",
    options: ["122/99", "123/99", "41/33", "123/100"],
    correctAnswer: "122/99",
    hint: "Separate the whole number 1: $1 + \\frac{23}{99}$.",
    workedSolution: "$$1.\\dot{2}\\dot{3} = 1 + \\frac{23}{99} = \\frac{99 + 23}{99} = \\frac{122}{99}$$.",
    points: 2
  }
];

// Rich, WAEC-calibrated DOK 3 generator for items 6 through 50
const hardGenerators = [
  // Type A: Delayed recurring decimals: 0.a\dot{b}
  (idx: number) => {
    const delayed = [
      { d: 0.1333, label: "0.1\\dot{3}", frac: "2/15", diff: 12, opts: ["2/15", "13/99", "13/90", "1/15"] },
      { d: 0.2333, label: "0.2\\dot{3}", frac: "7/30", diff: 21, opts: ["7/30", "23/99", "23/90", "1/3"] },
      { d: 0.4666, label: "0.4\\dot{6}", frac: "7/15", diff: 42, opts: ["7/15", "46/99", "46/90", "2/15"] },
      { d: 0.8333, label: "0.8\\dot{3}", frac: "5/6", diff: 75, opts: ["5/6", "83/99", "83/90", "7/8"] }
    ];
    const c = delayed[idx % delayed.length];
    return {
      id: `q_b8_num_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Convert the delayed recurring decimal $${c.label}$ to a fraction in its lowest terms.`,
      options: c.opts,
      correctAnswer: c.frac,
      hint: `Multiply by 10 and 100 to eliminate the repeating part, then simplify.`,
      workedSolution: `$$100x - 10x = 90x = ${c.diff} \\implies x = \\frac{${c.diff}}{90} = ${c.frac}$$.`,
      points: 2
    };
  },
  // Type B: Fractional & negative indicial equations
  (idx: number) => {
    const k = (idx % 5) + 2;
    // 2^(2x - 1) = 2^(3k)
    // 2x - 1 = 3k => 2x = 3k + 1 => x = (3k + 1) / 2
    const ans = (3 * k + 1) / 2;
    const rhsVal = Math.pow(8, k);
    return {
      id: `q_b8_num_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Solve for $x$ in the equation: $2^{2x - 1} = 8^{${k}}$.`,
      options: [
        String(ans),
        String(ans + 1),
        String(ans - 1),
        String(3 * k)
      ],
      correctAnswer: String(ans),
      hint: `Express $8$ in base 2: $8^{${k}} = (2^3)^{${k}} = 2^{${3 * k}}$.`,
      workedSolution: `$$2^{2x-1} = 2^{${3 * k}} \\implies 2x - 1 = ${3 * k} \\implies 2x = ${3 * k + 1} \\implies x = ${ans}$$.`,
      points: 2
    };
  },
  // Type C: Standard form quotient with negative powers
  (idx: number) => {
    const a = 2 + (idx % 3);
    const b = 4;
    const topExp = -2 - (idx % 3);
    const botExp = -5;
    // (a * 10^topExp) / (b * 10^botExp) = (a/b) * 10^(topExp - botExp)
    const ratio = a / b; // e.g. 0.5, 0.75, 1.0
    const mantissa = ratio < 1 ? ratio * 10 : ratio;
    const finalExp = ratio < 1 ? (topExp - botExp) - 1 : topExp - botExp;
    const ansStr = `${mantissa} × 10^${finalExp}`;
    return {
      id: `q_b8_num_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Evaluate: $$\\frac{${a}.0 \\times 10^{${topExp}}}{${b}.0 \\times 10^{${botExp}}}$$, expressing your answer in standard form.`,
      options: [
        ansStr,
        `${mantissa} × 10^${finalExp - 1}`,
        `${mantissa} × 10^${finalExp + 1}`,
        `${ratio} × 10^${topExp - botExp}`
      ],
      correctAnswer: ansStr,
      hint: `Divide numbers and subtract exponents: $10^{${topExp} - (${botExp})} = 10^{${topExp - botExp}}$.`,
      workedSolution: `$$\\frac{${a}}{${b}} \\times 10^{${topExp} - (${botExp})} = ${ratio} \\times 10^{${topExp - botExp}} = ${ansStr}$$.`,
      points: 2
    };
  },
  // Type D: Compound fraction with mixed numbers
  (idx: number) => {
    return {
      id: `q_b8_num_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Simplify: $$\\frac{2\\frac{1}{3} - 1\\frac{1}{2}}{\\frac{1}{2} + \\frac{1}{3}}$$.`,
      options: ["1", "5/6", "1 1/6", "2"],
      correctAnswer: "1",
      hint: `Simplify the numerator and denominator separately using LCM 6.`,
      workedSolution: `$$\\text{Numerator: } \\frac{7}{3} - \\frac{3}{2} = \\frac{14 - 9}{6} = \\frac{5}{6}$$\n$$\\text{Denominator: } \\frac{3 + 2}{6} = \\frac{5}{6}$$\n$$\\frac{5/6}{5/6} = 1$$.`,
      points: 2
    };
  }
];

for (let i = 6; i <= 50; i++) {
  const gFn = hardGenerators[(i - 6) % hardGenerators.length];
  hardQuestions.push(gFn(i));
}

async function seedB8Pool() {
  const docPath = 'global_curriculum/jhs/subjects/math/topics/topic_numbers_and_numeration';
  const docRef = db.doc(docPath);
  
  const snap = await docRef.get();
  if (!snap.exists) {
    throw new Error(`Document topic_numbers_and_numeration does not exist at ${docPath}.`);
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
  console.log('🚀 EXPANDING BASIC 8 PRACTICE POOL: topic_numbers_and_numeration');
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
  const p1 = path.join(__dirname, 'payloads', 'topic_numbers_and_numeration.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_numbers_and_numeration.json');

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

  console.log('🎉 B8 Question Bank expansion completed successfully.');
}

seedB8Pool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B8 pool:', err);
    process.exit(1);
  });
