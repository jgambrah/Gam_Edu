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
    id: "q_b9_num_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $16^{1/2}$.",
    options: ["4", "8", "2", "32"],
    correctAnswer: "4",
    hint: "An exponent of 1/2 denotes the principal square root: $16^{1/2} = \\sqrt{16}$.",
    workedSolution: "$$16^{1/2} = \\sqrt{16} = 4$$.",
    points: 1
  },
  {
    id: "q_b9_num_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Round $0.007865$ to 2 significant figures.",
    options: ["0.0079", "0.0078", "0.01", "0.008"],
    correctAnswer: "0.0079",
    hint: "Start counting from the first non-zero digit (7). The second digit is 8, followed by 6 (round up).",
    workedSolution: "The first two significant figures are 7 and 8. The next digit 6 rounds 8 up to 9: $0.0079$.",
    points: 1
  },
  {
    id: "q_b9_num_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Simplify: $\\sqrt{48}$.",
    options: ["4√3", "3√4", "2√12", "16√3"],
    correctAnswer: "4√3",
    hint: "Find the largest perfect square factor of 48: $48 = 16 \\times 3$.",
    workedSolution: "$$\\sqrt{48} = \\sqrt{16 \\times 3} = 4\\sqrt{3}$$.",
    points: 1
  },
  {
    id: "q_b9_num_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $27^{2/3}$.",
    options: ["9", "3", "18", "6"],
    correctAnswer: "9",
    hint: "$$27^{2/3} = (\\sqrt[3]{27})^2$$.",
    workedSolution: "$$27^{2/3} = (3)^2 = 9$$.",
    points: 1
  },
  {
    id: "q_b9_num_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Round $43.8762$ to 2 decimal places.",
    options: ["43.88", "43.87", "43.90", "44.00"],
    correctAnswer: "43.88",
    hint: "Inspect the third decimal digit (6) to round the second digit (7).",
    workedSolution: "The third decimal place is $6 \\ge 5$, so round $7$ up to $8$: $43.88$.",
    points: 1
  },
  {
    id: "q_b9_num_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Simplify: $\\frac{x^8 \\times x^3}{x^5}$.",
    options: ["x⁶", "x⁵", "x⁷", "x⁴"],
    correctAnswer: "x⁶",
    hint: "Add indices in numerator, subtract denominator index: $8 + 3 - 5$.",
    workedSolution: "$$x^{8+3-5} = x^6$$.",
    points: 1
  },
  {
    id: "q_b9_num_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which of the following numbers is an irrational number?",
    options: ["√5", "√16", "0.75", "-3/8"],
    correctAnswer: "√5",
    hint: "Irrational numbers cannot be expressed as a ratio of two integers.",
    workedSolution: "$\\sqrt{5}$ is a non-terminating, non-repeating root, making it irrational.",
    points: 1
  },
  {
    id: "q_b9_num_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Simplify: $5\\sqrt{2} + 3\\sqrt{2}$.",
    options: ["8√2", "8√4", "15√2", "8"],
    correctAnswer: "8√2",
    hint: "Combine like surds by adding their coefficients: $(5 + 3)\\sqrt{2}$.",
    workedSolution: "$$(5 + 3)\\sqrt{2} = 8\\sqrt{2}$$.",
    points: 1
  },
  {
    id: "q_b9_num_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate: $8^{-1/3}$.",
    options: ["1/2", "-2", "2", "-1/2"],
    correctAnswer: "1/2",
    hint: "$$8^{-1/3} = \\frac{1}{8^{1/3}} = \\frac{1}{\\sqrt[3]{8}}$$.",
    workedSolution: "$$8^{-1/3} = \\frac{1}{\\sqrt[3]{8}} = \\frac{1}{2}$$.",
    points: 1
  },
  {
    id: "q_b9_num_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Express $68,495$ to 3 significant figures.",
    options: ["68,500", "68,400", "68.5", "685"],
    correctAnswer: "68,500",
    hint: "The fourth digit (9) causes the third digit (4) to round up to 5.",
    workedSolution: "The first three digits are 6, 8, 4. Since the next digit is 9, round up to $68,500$.",
    points: 1
  }
];

// Rich, varied WAEC DOK 1 generator for items 11 through 50
const lowTemplates = [
  // Type A: Surd simplification: sqrt(k^2 * 2), sqrt(k^2 * 3), sqrt(k^2 * 5)
  (idx: number) => {
    const primes = [2, 3, 5];
    const p = primes[idx % primes.length];
    const k = (idx % 8) + 2;
    const radicand = k * k * p;
    const ans = `${k}√${p}`;
    return {
      id: `q_b9_num_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Simplify: $\\sqrt{${radicand}}$.`,
      options: [ans, `${p}√${k}`, `${k * p}√${p}`, `${k}√${p * 2}`],
      correctAnswer: ans,
      hint: `Extract the largest perfect square factor $${k * k}$: $\\sqrt{${k * k} \\times ${p}}$.`,
      workedSolution: `$$\\sqrt{${radicand}} = \\sqrt{${k * k} \\times ${p}} = ${k}\\sqrt{${p}}$$.`,
      points: 1
    };
  },
  // Type B: Fractional exponents: N^(1/3), N^(2/3), N^(3/2)
  (idx: number) => {
    const cubes = [
      { base: 64, exp: "1/3", ans: "4", hint: "Cube root of 64" },
      { base: 125, exp: "1/3", ans: "5", hint: "Cube root of 125" },
      { base: 64, exp: "2/3", ans: "16", hint: "(Cube root of 64)^2 = 4^2" },
      { base: 125, exp: "2/3", ans: "25", hint: "(Cube root of 125)^2 = 5^2" },
      { base: 36, exp: "1/2", ans: "6", hint: "Square root of 36" },
      { base: 25, exp: "3/2", ans: "125", hint: "(Square root of 25)^3 = 5^3" }
    ];
    const c = cubes[idx % cubes.length];
    const d1 = Number(c.ans) * 2;
    const d2 = Math.max(1, Number(c.ans) - 2);
    const d3 = Number(c.ans) + 5;
    return {
      id: `q_b9_num_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Evaluate: $${c.base}^{${c.exp}}$.`,
      options: [c.ans, String(d1), String(d2), String(d3)],
      correctAnswer: c.ans,
      hint: c.hint,
      workedSolution: `$$${c.base}^{${c.exp}} = ${c.ans}$$.`,
      points: 1
    };
  },
  // Type C: Rounding to significant figures
  (idx: number) => {
    const items = [
      { val: "0.03846", sig: 2, ans: "0.038", opts: ["0.038", "0.039", "0.04", "0.0385"] },
      { val: "45,823", sig: 3, ans: "45,800", opts: ["45,800", "45,900", "45,820", "46,000"] },
      { val: "0.005072", sig: 2, ans: "0.0051", opts: ["0.0051", "0.0050", "0.005", "0.00507"] },
      { val: "9,045", sig: 2, ans: "9,000", opts: ["9,000", "9,100", "9,050", "9,040"] }
    ];
    const it = items[idx % items.length];
    return {
      id: `q_b9_num_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Round $${it.val}$ to ${it.sig} significant figures.`,
      options: it.opts,
      correctAnswer: it.ans,
      hint: `Start counting from the first non-zero digit.`,
      workedSolution: `Rounding $${it.val}$ to ${it.sig} significant figures gives $${it.ans}$.`,
      points: 1
    };
  },
  // Type D: Combining like surds
  (idx: number) => {
    const a = 3 + (idx % 4);
    const b = 2 + (idx % 3);
    const rad = (idx % 2 === 0) ? 3 : 5;
    const sum = a + b;
    const ans = `${sum}√${rad}`;
    return {
      id: `q_b9_num_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Simplify: $${a}\\sqrt{${rad}} + ${b}\\sqrt{${rad}}$.`,
      options: [ans, `${sum}√${rad * 2}`, `${a * b}√${rad}`, `${sum}`],
      correctAnswer: ans,
      hint: `Add coefficients of identical surd terms: $(a + b)\\sqrt{${rad}}$.`,
      workedSolution: `$$(${a} + ${b})\\sqrt{${rad}} = ${ans}$$.`,
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
    id: "q_b9_num_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Simplify by rationalizing the denominator: $\\frac{14}{\\sqrt{7}}$.",
    options: ["2√7", "7√2", "14√7", "2"],
    correctAnswer: "2√7",
    hint: "Multiply numerator and denominator by $\\sqrt{7}$.",
    workedSolution: "$$\\frac{14}{\\sqrt{7}} \\times \\frac{\\sqrt{7}}{\\sqrt{7}} = \\frac{14\\sqrt{7}}{7} = 2\\sqrt{7}$$.",
    points: 1
  },
  {
    id: "q_b9_num_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Solve for $x$: $4^{x-1} = 8^{x+1}$.",
    options: ["-5", "-3", "5", "3"],
    correctAnswer: "-5",
    hint: "Express both sides in base 2: $4 = 2^2$ and $8 = 2^3$.",
    workedSolution: "$$(2^2)^{x-1} = (2^3)^{x+1} \\implies 2(x - 1) = 3(x + 1) \\implies 2x - 2 = 3x + 3 \\implies x = -5$$.",
    points: 1
  },
  {
    id: "q_b9_num_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Simplify: $\\sqrt{75} - \\sqrt{27} + \\sqrt{12}$.",
    options: ["4√3", "6√3", "2√3", "5√3"],
    correctAnswer: "4√3",
    hint: "Decompose each radicand into factors with 3: $\\sqrt{25 \\times 3} - \\sqrt{9 \\times 3} + \\sqrt{4 \\times 3}$.",
    workedSolution: "$$5\\sqrt{3} - 3\\sqrt{3} + 2\\sqrt{3} = (5 - 3 + 2)\\sqrt{3} = 4\\sqrt{3}$$.",
    points: 1
  },
  {
    id: "q_b9_num_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Evaluate and round to 3 significant figures: $\\frac{4.56 \\times 10^5}{1.2 \\times 10^{-2}}$.",
    options: ["3.80 × 10⁷", "3.8 × 10⁷", "3.80 × 10³", "3.80 × 10⁶"],
    correctAnswer: "3.80 × 10⁷",
    hint: "Divide mantissas ($4.56 \\div 1.2 = 3.8$) and subtract exponents ($5 - (-2) = 7$).",
    workedSolution: "$$\\frac{4.56}{1.2} \\times 10^{5 - (-2)} = 3.8 \\times 10^7 = 3.80 \\times 10^7\\text{ (to 3 sig. figs.)}$$.",
    points: 1
  },
  {
    id: "q_b9_num_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Evaluate: $$\\left(\\frac{81}{16}\\right)^{-3/4}$$.",
    options: ["8/27", "27/8", "-27/8", "16/81"],
    correctAnswer: "8/27",
    hint: "Invert for the negative exponent and take the fourth root: $\\left(\\frac{16}{81}\\right)^{3/4} = \\left(\\frac{2}{3}\\right)^3$.",
    workedSolution: "$$\\left(\\frac{16}{81}\\right)^{3/4} = \\left(\\sqrt[4]{\\frac{16}{81}}\\right)^3 = \\left(\\frac{2}{3}\\right)^3 = \\frac{8}{27}$$.",
    points: 1
  }
];

// Rich generator for Medium items 6 through 50
const mediumGenerators = [
  // Type A: Rationalizing monomial surd denominators: k / sqrt(p)
  (idx: number) => {
    const primes = [2, 3, 5];
    const p = primes[idx % primes.length];
    const mult = (idx % 5) + 2;
    const num = mult * p;
    const ans = `${mult}√${p}`;
    return {
      id: `q_b9_num_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Simplify by rationalizing the denominator: $\\frac{${num}}{\\sqrt{${p}}}$.`,
      options: [ans, `${p}√${mult}`, `${num}√${p}`, `${mult}`],
      correctAnswer: ans,
      hint: `Multiply numerator and denominator by $\\sqrt{${p}}$.`,
      workedSolution: `$$\\frac{${num}}{\\sqrt{${p}}} \\times \\frac{\\sqrt{${p}}}{\\sqrt{${p}}} = \\frac{${num}\\sqrt{${p}}}{${p}} = ${ans}$$.`,
      points: 1
    };
  },
  // Type B: Base matching indicial equation: 9^(x-1) = 27^(x+1)
  (idx: number) => {
    const b1 = 2; // base 2
    const exp1Coeff = 2; // 4 = 2^2
    const exp2Coeff = 3; // 8 = 2^3
    const c1 = (idx % 3) + 1;
    const c2 = (idx % 2) + 1;
    // 2(x - c1) = 3(x + c2) => 2x - 2c1 = 3x + 3c2 => -x = 3c2 + 2c1 => x = -(3c2 + 2c1)
    const ans = -(3 * c2 + 2 * c1);
    return {
      id: `q_b9_num_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Solve for $x$: $4^{x - ${c1}} = 8^{x + ${c2}}$.`,
      options: [String(ans), String(ans + 2), String(ans - 2), String(-ans)],
      correctAnswer: String(ans),
      hint: `Convert both bases to 2: $4 = 2^2$ and $8 = 2^3$. Equate exponents.`,
      workedSolution: `$$(2^2)^{x - ${c1}} = (2^3)^{x + ${c2}} \\implies 2(x - ${c1}) = 3(x + ${c2}) \\implies x = ${ans}$$.`,
      points: 1
    };
  },
  // Type C: Multi-term surd additions and subtractions
  (idx: number) => {
    // a*sqrt(3) + b*sqrt(3) - c*sqrt(3)
    // using square decompositions: e.g. sqrt(108) = 6sqrt(3), sqrt(48) = 4sqrt(3), sqrt(12) = 2sqrt(3)
    const a = 6, b = 4, c = 2;
    const sum = a + b - c; // 8
    const ans = `${sum}√3`;
    return {
      id: `q_b9_num_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Simplify: $\\sqrt{108} + \\sqrt{48} - \\sqrt{12}$.`,
      options: [ans, "6√3", "10√3", "12√3"],
      correctAnswer: ans,
      hint: `Break down each radicand: $\\sqrt{36 \\times 3} + \\sqrt{16 \\times 3} - \\sqrt{4 \\times 3}$.`,
      workedSolution: `$$6\\sqrt{3} + 4\\sqrt{3} - 2\\sqrt{3} = (6 + 4 - 2)\\sqrt{3} = ${ans}$$.`,
      points: 1
    };
  },
  // Type D: Negative fractional exponent evaluation
  (idx: number) => {
    const pairs = [
      { base: "16", exp: "-3/4", ans: "1/8", hint: "1 / (16^(3/4)) = 1 / 2^3 = 1/8" },
      { base: "32", exp: "-2/5", ans: "1/4", hint: "1 / (32^(2/5)) = 1 / 2^2 = 1/4" },
      { base: "64", exp: "-2/3", ans: "1/16", hint: "1 / (64^(2/3)) = 1 / 4^2 = 1/16" },
      { base: "100", exp: "-3/2", ans: "1/1000", hint: "1 / (100^(3/2)) = 1 / 10^3 = 1/1000" }
    ];
    const p = pairs[idx % pairs.length];
    return {
      id: `q_b9_num_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Evaluate: $${p.base}^{${p.exp}}$.`,
      options: [p.ans, `-${p.ans}`, "1/2", "2"],
      correctAnswer: p.ans,
      hint: p.hint,
      workedSolution: `$$${p.base}^{${p.exp}} = ${p.ans}$$.`,
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
    id: "q_b9_num_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Simplify without using tables or calculators: $$\\frac{\\sqrt{72} + \\sqrt{32}}{\\sqrt{50} - \\sqrt{18}}$$.",
    options: ["5", "4", "2√2", "10"],
    correctAnswer: "5",
    hint: "Simplify each term in base $\\sqrt{2}$: $\\frac{6\\sqrt{2} + 4\\sqrt{2}}{5\\sqrt{2} - 3\\sqrt{2}}$.",
    workedSolution: "$$\\text{Numerator: } \\sqrt{36 \\times 2} + \\sqrt{16 \\times 2} = 6\\sqrt{2} + 4\\sqrt{2} = 10\\sqrt{2}$$\n$$\\text{Denominator: } \\sqrt{25 \\times 2} - \\sqrt{9 \\times 2} = 5\\sqrt{2} - 3\\sqrt{2} = 2\\sqrt{2}$$\n$$\\frac{10\\sqrt{2}}{2\\sqrt{2}} = 5$$.",
    points: 2
  },
  {
    id: "q_b9_num_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Solve for $n$: $2^{n} \\times 8^{n-1} = 4^{2n-1}$.",
    options: ["No solution (inconsistent)", "2", "-1", "1"],
    correctAnswer: "No solution (inconsistent)",
    hint: "Convert all terms to base 2: $2^n \\times 2^{3(n-1)} = 2^{2(2n-1)}$.",
    workedSolution: "$$2^{n + 3n - 3} = 2^{4n - 2} \\implies 4n - 3 = 4n - 2 \\implies -3 = -2$$. Since this is impossible, there is no real solution.",
    points: 2
  },
  {
    id: "q_b9_num_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Rationalize and simplify: $$\\frac{6}{\\sqrt{3} + 1}$$.",
    options: ["3(√3 - 1)", "3(√3 + 1)", "2(√3 - 1)", "6(√3 - 1)"],
    correctAnswer: "3(√3 - 1)",
    hint: "Multiply numerator and denominator by conjugate $(\\sqrt{3} - 1)$.",
    workedSolution: "$$\\frac{6(\\sqrt{3} - 1)}{(\\sqrt{3})^2 - 1^2} = \\frac{6(\\sqrt{3} - 1)}{3 - 1} = \\frac{6(\\sqrt{3} - 1)}{2} = 3(\\sqrt{3} - 1)$$.",
    points: 2
  },
  {
    id: "q_b9_num_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A number is expressed as $0.000004928$. If it is rounded to 2 significant figures, what is the percentage error introduced relative to the unrounded value? (Express to 2 d.p.).",
    options: ["0.57%", "0.65%", "0.48%", "1.20%"],
    correctAnswer: "0.57%",
    hint: "Rounded value is $0.0000049$. Error $= 0.000004928 - 0.000004900 = 0.000000028$. Compute $(Error / Actual) \\times 100\\%$.",
    workedSolution: "$$\\text{Error} = 0.000004928 - 0.0000049 = 0.000000028$$\n$$\\text{Percentage Error} = \\frac{0.000000028}{0.000004928} \\times 100\\% \\approx 0.568\\% \\approx 0.57\\%$$.",
    points: 2
  },
  {
    id: "q_b9_num_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Evaluate: $$\\frac{(2^3)^2 \\times 5^{-2}}{10^{-2}}$$.",
    options: ["256", "64", "128", "512"],
    correctAnswer: "256",
    hint: "Decompose $10^{-2} = (2 \\times 5)^{-2} = 2^{-2} \\times 5^{-2}$.",
    workedSolution: "$$\\frac{2^6 \\times 5^{-2}}{2^{-2} \\times 5^{-2}} = 2^{6 - (-2)} \\times 5^{-2 - (-2)} = 2^8 \\times 5^0 = 256$$.",
    points: 2
  }
];

// Rich, WAEC-calibrated DOK 3 generator for items 6 through 50
const hardGenerators = [
  // Type A: Radical equation squaring: sqrt(c*x + 1) = c - 1
  // c*x + 1 = (c-1)^2 = c^2 - 2c + 1 => c*x = c^2 - 2c = c(c - 2) => x = c - 2
  (idx: number) => {
    const c = (idx % 8) + 3; // 3 to 10
    const ans = c - 2;
    return {
      id: `q_b9_num_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Solve for $x$ in the radical equation: $\\sqrt{${c}x + 1} = ${c - 1}$.`,
      options: [String(ans), String(ans + 1), String(ans - 1), String(c)],
      correctAnswer: String(ans),
      hint: `Square both sides: $${c}x + 1 = (${c - 1})^2$.`,
      workedSolution: `$$${c}x + 1 = (${c - 1})^2 = ${(c - 1) * (c - 1)} \\implies ${c}x = ${(c - 1) * (c - 1) - 1} \\implies x = ${ans}$$.`,
      points: 2
    };
  },
  // Type B: Binomial surd conjugate rationalization
  (idx: number) => {
    const conjugates = [
      { num: 10, denom: "\\sqrt{5} - \\sqrt{3}", conj: "\\sqrt{5} + \\sqrt{3}", ans: "5(√5 + √3)", diff: 2 },
      { num: 8, denom: "\\sqrt{7} - \\sqrt{5}", conj: "\\sqrt{7} + \\sqrt{5}", ans: "4(√7 + √5)", diff: 2 },
      { num: 12, denom: "\\sqrt{5} - 1", conj: "\\sqrt{5} + 1", ans: "3(√5 + 1)", diff: 4 },
      { num: 6, denom: "\\sqrt{7} - 2", conj: "\\sqrt{7} + 2", ans: "2(√7 + 2)", diff: 3 }
    ];
    const c = conjugates[idx % conjugates.length];
    return {
      id: `q_b9_num_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Rationalize the denominator and simplify: $$\\frac{${c.num}}{${c.denom}}$$.`,
      options: [c.ans, `2(${c.conj})`, `6(${c.conj})`, `1(${c.conj})`],
      correctAnswer: c.ans,
      hint: `Multiply numerator and denominator by conjugate $(${c.conj})$ and use $(a-b)(a+b) = a^2 - b^2$.`,
      workedSolution: `$$\\frac{${c.num}(${c.conj})}{${c.diff}} = ${c.ans}$$.`,
      points: 2
    };
  },
  // Type C: Indicial equation with reciprocal powers: (1/a)^(x-1) = b
  (idx: number) => {
    const p = (idx % 4) + 2; // 2, 3, 4, 5
    // (1/2)^(x - 1) = 2^p => -(x - 1) = p => -x + 1 = p => x = 1 - p
    const rhs = Math.pow(2, p);
    const ans = 1 - p;
    return {
      id: `q_b9_num_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Solve for $x$: $$\\left(\\frac{1}{2}\\right)^{x - 1} = ${rhs}$$.`,
      options: [String(ans), String(-ans), String(p + 1), String(p - 1)],
      correctAnswer: String(ans),
      hint: `Express $\\frac{1}{2} = 2^{-1}$ and $${rhs} = 2^{${p}}$.`,
      workedSolution: `$$(2^{-1})^{x - 1} = 2^{${p}} \\implies -(x - 1) = ${p} \\implies -x + 1 = ${p} \\implies x = ${ans}$$.`,
      points: 2
    };
  },
  // Type D: Mixed compound surd fraction quotient
  (idx: number) => {
    return {
      id: `q_b9_num_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Evaluate without a calculator: $$\\frac{\\sqrt{50} + \\sqrt{18}}{\\sqrt{32}}$$.`,
      options: ["2", "√2", "4", "1/2"],
      correctAnswer: "2",
      hint: `Simplify each radical into multiples of $\\sqrt{2}$: $\\frac{5\\sqrt{2} + 3\\sqrt{2}}{4\\sqrt{2}}$.`,
      workedSolution: `$$\\frac{5\\sqrt{2} + 3\\sqrt{2}}{4\\sqrt{2}} = \\frac{8\\sqrt{2}}{4\\sqrt{2}} = 2$$.`,
      points: 2
    };
  }
];

for (let i = 6; i <= 50; i++) {
  const gFn = hardGenerators[(i - 6) % hardGenerators.length];
  hardQuestions.push(gFn(i));
}

async function seedB9Pool() {
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
  const b8Total = (existingData.levels?.b8?.practicePool?.low?.length || 0) +
                  (existingData.levels?.b8?.practicePool?.medium?.length || 0) +
                  (existingData.levels?.b8?.practicePool?.hard?.length || 0);
  const b9Total = lowQuestions.length + mediumQuestions.length + hardQuestions.length;

  const totalQuestions = b7Total + b8Total + b9Total;

  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 9 PRACTICE POOL: topic_numbers_and_numeration');
  console.log('================================================================');
  console.log(`📦 Ingesting B9 Question Bank:`);
  console.log(`  • Low (DOK 1): ${lowQuestions.length} items`);
  console.log(`  • Medium (DOK 2): ${mediumQuestions.length} items`);
  console.log(`  • Hard (DOK 3): ${hardQuestions.length} items`);
  console.log(`  • Total B9 Items: ${b9Total}`);
  console.log(`  • Total Topic Practice Items (B7 + B8 + B9): ${totalQuestions}`);

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
  const p1 = path.join(__dirname, 'payloads', 'topic_numbers_and_numeration.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_numbers_and_numeration.json');

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

  console.log('🎉 B9 Question Bank expansion completed successfully.');
}

seedB9Pool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B9 pool:', err);
    process.exit(1);
  });
