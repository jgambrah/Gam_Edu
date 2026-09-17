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
// 1. LOW TIER QUESTIONS (DOK 1) - 50 Items
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b8_alg_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Expand: $(x + 3)(x + 4)$.",
    options: ["x² + 7x + 12", "x² + 12x + 7", "x² + 7x + 7", "x² + 12"],
    correctAnswer: "x² + 7x + 12",
    hint: "Use FOIL: $x(x + 4) + 3(x + 4) = x^2 + 4x + 3x + 12$.",
    workedSolution: "$$x^2 + 4x + 3x + 12 = x^2 + 7x + 12$$.",
    points: 1
  },
  {
    id: "q_b8_alg_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Factorize completely: $5ax + 5ay$.",
    options: ["5a(x + y)", "5(ax + ay)", "a(5x + 5y)", "5x(a + y)"],
    correctAnswer: "5a(x + y)",
    hint: "Identify the Highest Common Factor (HCF) shared by both terms.",
    workedSolution: "The common factor is $5a$: $$5a(x + y)$$.",
    points: 1
  },
  {
    id: "q_b8_alg_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Simplify: $$\\frac{3x}{5} + \\frac{x}{5}$$.",
    options: ["4x/5", "4x/10", "3x²/5", "2x/5"],
    correctAnswer: "4x/5",
    hint: "Denominators are identical; add numerators directly.",
    workedSolution: "$$\\frac{3x + x}{5} = \\frac{4x}{5}$$.",
    points: 1
  },
  {
    id: "q_b8_alg_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Expand: $(y + 5)^2$.",
    options: ["y² + 10y + 25", "y² + 25", "y² + 5y + 25", "2y + 10"],
    correctAnswer: "y² + 10y + 25",
    hint: "Apply the identity: $(A + B)^2 = A^2 + 2AB + B^2$.",
    workedSolution: "$$y^2 + 2(y)(5) + 5^2 = y^2 + 10y + 25$$.",
    points: 1
  },
  {
    id: "q_b8_alg_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Expand the difference of two squares: $(x + 4)(x - 4)$.",
    options: ["x² - 16", "x² + 16", "x² - 8x - 16", "x² - 8"],
    correctAnswer: "x² - 16",
    hint: "$(A + B)(A - B) = A^2 - B^2$.",
    workedSolution: "$$x^2 - 4^2 = x^2 - 16$$.",
    points: 1
  },
  {
    id: "q_b8_alg_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Factorize: $x^2 + 7x$.",
    options: ["x(x + 7)", "7(x + 1)", "x(x + 7x)", "x²(1 + 7)"],
    correctAnswer: "x(x + 7)",
    hint: "Factor out the common variable $x$.",
    workedSolution: "$$x(x + 7)$$.",
    points: 1
  },
  {
    id: "q_b8_alg_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Simplify: $$\\frac{5a}{7} - \\frac{2a}{7}$$.",
    options: ["3a/7", "3/7", "7a/7", "3a/14"],
    correctAnswer: "3a/7",
    hint: "Subtract numerators: $5a - 2a$.",
    workedSolution: "$$\\frac{5a - 2a}{7} = \\frac{3a}{7}$$.",
    points: 1
  },
  {
    id: "q_b8_alg_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Expand: $(m + 2)(m + 6)$.",
    options: ["m² + 8m + 12", "m² + 12m + 8", "m² + 8m + 8", "m² + 12"],
    correctAnswer: "m² + 8m + 12",
    hint: "$$m(m + 6) + 2(m + 6) = m^2 + 6m + 2m + 12$$.",
    workedSolution: "$$m^2 + 8m + 12$$.",
    points: 1
  },
  {
    id: "q_b8_alg_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Factorize completely: $6p - 18q$.",
    options: ["6(p - 3q)", "3(2p - 6q)", "6(p - 18q)", "6p(1 - 3q)"],
    correctAnswer: "6(p - 3q)",
    hint: "The HCF of 6 and 18 is 6.",
    workedSolution: "$$6(p - 3q)$$.",
    points: 1
  },
  {
    id: "q_b8_alg_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Simplify: $$\\frac{x}{2} + \\frac{x}{3}$$.",
    options: ["5x/6", "2x/5", "x/5", "5x/5"],
    correctAnswer: "5x/6",
    hint: "LCM of 2 and 3 is 6: $\\frac{3x + 2x}{6}$.",
    workedSolution: "$$\\frac{3x + 2x}{6} = \\frac{5x}{6}$$.",
    points: 1
  }
];

// Fill items 11 to 50
for (let i = 11; i <= 50; i++) {
  const type = i % 4;
  if (type === 0) {
    const k = (i % 7) + 2;
    lowQuestions.push({
      id: `q_b8_alg_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Expand: $(x + ${k})(x + 2)$.`,
      options: [
        `x² + ${k + 2}x + ${k * 2}`,
        `x² + ${k * 2}x + ${k + 2}`,
        `x² + ${k + 2}x + ${k + 2}`,
        `x² + ${k * 2}`
      ],
      correctAnswer: `x² + ${k + 2}x + ${k * 2}`,
      hint: `Multiply $(x + ${k})(x + 2) = x^2 + 2x + ${k}x + ${k * 2}$.`,
      workedSolution: `$$x^2 + 2x + ${k}x + ${k * 2} = x^2 + ${k + 2}x + ${k * 2}$$.`,
      points: 1
    });
  } else if (type === 1) {
    const c = (i % 6) + 3;
    lowQuestions.push({
      id: `q_b8_alg_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Factorize completely: $${c}mx + ${c}my$.`,
      options: [
        `${c}m(x + y)`,
        `${c}(mx + my)`,
        `m(${c}x + ${c}y)`,
        `${c}mx(1 + y)`
      ],
      correctAnswer: `${c}m(x + y)`,
      hint: `Find the common factor between $${c}mx$ and $${c}my$.`,
      workedSolution: `The highest common factor is $${c}m$: $$${c}m(x + y)$$.`,
      points: 1
    });
  } else if (type === 2) {
    const a = (i % 5) + 3;
    lowQuestions.push({
      id: `q_b8_alg_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Expand the perfect square: $(y + ${a})^2$.`,
      options: [
        `y² + ${2 * a}y + ${a * a}`,
        `y² + ${a * a}`,
        `y² + ${a}y + ${a * a}`,
        `2y + ${2 * a}`
      ],
      correctAnswer: `y² + ${2 * a}y + ${a * a}`,
      hint: `Use the formula $(A + B)^2 = A^2 + 2AB + B^2$.`,
      workedSolution: `$$y^2 + 2(y)(${a}) + ${a}^2 = y^2 + ${2 * a}y + ${a * a}$$.`,
      points: 1
    });
  } else {
    const d = (i % 4) + 3;
    const num1 = d - 1;
    lowQuestions.push({
      id: `q_b8_alg_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Simplify: $$\\frac{${num1}p}{${d * 2}} + \\frac{p}{${d * 2}}$$.`,
      options: [
        `${num1 + 1}p/${d * 2}`,
        `${num1 + 1}p/${d * 4}`,
        `${num1}p²/${d * 2}`,
        `p/${d * 2}`
      ],
      correctAnswer: `${num1 + 1}p/${d * 2}`,
      hint: `Add the numerators over the common denominator ${d * 2}.`,
      workedSolution: `$$\\frac{${num1}p + p}{${d * 2}} = \\frac{${num1 + 1}p}{${d * 2}}$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER QUESTIONS (DOK 2) - 50 Items
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b8_alg_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Factorize by pairwise grouping: $ax + ay + bx + by$.",
    options: ["(x + y)(a + b)", "(x - y)(a + b)", "(x + y)(a - b)", "(a + y)(x + b)"],
    correctAnswer: "(x + y)(a + b)",
    hint: "Group into pairs: $a(x + y) + b(x + y)$.",
    workedSolution: "$$a(x + y) + b(x + y) = (x + y)(a + b)$$.",
    points: 1
  },
  {
    id: "q_b8_alg_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Expand and simplify: $(2x - 3)(x + 4)$.",
    options: ["2x² + 5x - 12", "2x² - 5x - 12", "2x² + 11x - 12", "2x² - 12"],
    correctAnswer: "2x² + 5x - 12",
    hint: "$$2x(x + 4) - 3(x + 4) = 2x^2 + 8x - 3x - 12$$.",
    workedSolution: "$$2x^2 + 8x - 3x - 12 = 2x^2 + 5x - 12$$.",
    points: 1
  },
  {
    id: "q_b8_alg_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Simplify the algebraic fraction: $$\\frac{2x - 1}{3} - \\frac{x + 2}{4}$$.",
    options: ["(5x - 10)/12", "(5x - 2)/12", "(5x + 2)/12", "(x - 3)/12"],
    correctAnswer: "(5x - 10)/12",
    hint: "LCM of 3 and 4 is 12: $\\frac{4(2x - 1) - 3(x + 2)}{12}$.",
    workedSolution: "$$\\frac{4(2x - 1) - 3(x + 2)}{12} = \\frac{8x - 4 - 3x - 6}{12} = \\frac{5x - 10}{12}$$.",
    points: 1
  },
  {
    id: "q_b8_alg_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Factorize completely: $2mx - 2my + nx - ny$.",
    options: ["(x - y)(2m + n)", "(x + y)(2m - n)", "(x - y)(2m - n)", "(x + y)(2m + n)"],
    correctAnswer: "(x - y)(2m + n)",
    hint: "Factor $2m$ from the first pair and $n$ from the second pair.",
    workedSolution: "$$2m(x - y) + n(x - y) = (x - y)(2m + n)$$.",
    points: 1
  },
  {
    id: "q_b8_alg_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Expand and simplify: $(3x - 2y)^2$.",
    options: ["9x² - 12xy + 4y²", "9x² - 6xy + 4y²", "9x² + 4y²", "9x² - 12xy - 4y²"],
    correctAnswer: "9x² - 12xy + 4y²",
    hint: "$$(A - B)^2 = A^2 - 2AB + B^2$$.",
    workedSolution: "$$(3x)^2 - 2(3x)(2y) + (2y)^2 = 9x^2 - 12xy + 4y^2$$.",
    points: 1
  }
];

// Fill items 6 to 50 for Medium
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const c = (i % 7) + 2;
    mediumQuestions.push({
      id: `q_b8_alg_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Factorize by grouping: $px + py + ${c}x + ${c}y$.`,
      options: [
        `(x + y)(p + ${c})`,
        `(x - y)(p + ${c})`,
        `(x + y)(p - ${c})`,
        `(x + p)(y + ${c})`
      ],
      correctAnswer: `(x + y)(p + ${c})`,
      hint: `Group as $p(x + y) + ${c}(x + y)$.`,
      workedSolution: `$$p(x + y) + ${c}(x + y) = (x + y)(p + ${c})$$.`,
      points: 1
    });
  } else if (mod === 1) {
    const a = (i % 3) + 2;
    const b = (i % 4) + 1;
    const d = (i % 3) + 2;
    // (ax - b)(x + d) = ax^2 + (ad - b)x - bd
    const midCoeff = a * d - b;
    const midStr = midCoeff >= 0 ? `+ ${midCoeff}x` : `- ${Math.abs(midCoeff)}x`;
    const ans = `${a}x² ${midStr} - ${b * d}`;
    mediumQuestions.push({
      id: `q_b8_alg_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Expand and simplify: $(${a}x - ${b})(x + ${d})$.`,
      options: [
        ans,
        `${a}x² - ${midCoeff}x - ${b * d}`,
        `${a}x² ${midStr} + ${b * d}`,
        `${a}x² - ${b * d}`
      ],
      correctAnswer: ans,
      hint: `Expand: $${a}x(x + ${d}) - ${b}(x + ${d})$.`,
      workedSolution: `$$${a}x^2 + ${a * d}x - ${b}x - ${b * d} = ${ans}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    const k = (i % 5) + 2;
    // k^2 x^2 - 16 = (kx - 4)(kx + 4)
    mediumQuestions.push({
      id: `q_b8_alg_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Factorize using difference of two squares: $${k * k}x^2 - 16$.`,
      options: [
        `(${k}x - 4)(${k}x + 4)`,
        `(${k}x - 4)²`,
        `(${k}x + 4)²`,
        `(${k * k}x - 4)(x + 4)`
      ],
      correctAnswer: `(${k}x - 4)(${k}x + 4)`,
      hint: `Recognize $A^2 - B^2 = (A - B)(A + B)$ where $A = ${k}x$ and $B = 4$.`,
      workedSolution: `$$(${k}x)^2 - 4^2 = (${k}x - 4)(${k}x + 4)$$.`,
      points: 1
    });
  } else {
    // Simplify algebraic fraction: (3x + 2)/2 - (x - 1)/3 = (3(3x + 2) - 2(x - 1)) / 6 = (9x + 6 - 2x + 2) / 6 = (7x + 8)/6
    const k = (i % 3) + 1;
    const numX = 9 - 2; // 7
    const constTerm = 3 * k + 2;
    mediumQuestions.push({
      id: `q_b8_alg_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Simplify as a single fraction: $$\\frac{3x + ${k}}{2} - \\frac{x - 1}{3}$$.`,
      options: [
        `(7x + ${constTerm})/6`,
        `(7x + ${constTerm - 2})/6`,
        `(7x - ${constTerm})/6`,
        `(8x + ${constTerm})/6`
      ],
      correctAnswer: `(7x + ${constTerm})/6`,
      hint: `The LCM of 2 and 3 is 6. Multiply numerators: $3(3x + ${k}) - 2(x - 1)$.`,
      workedSolution: `$$\\frac{3(3x + ${k}) - 2(x - 1)}{6} = \\frac{9x + ${3 * k} - 2x + 2}{6} = \\frac{7x + ${constTerm}}{6}$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 3. HARD TIER QUESTIONS (DOK 3) - 50 Items
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b8_alg_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Factorize completely: $3x^2 - 2xy - 12x + 8y$.",
    options: ["(3x - 2y)(x - 4)", "(3x + 2y)(x - 4)", "(3x - 2y)(x + 4)", "(x - 2y)(3x - 4)"],
    correctAnswer: "(3x - 2y)(x - 4)",
    hint: "Factor $x$ from the first pair and $-4$ from the second pair to invert signs inside the bracket.",
    workedSolution: "$$x(3x - 2y) - 4(3x - 2y) = (3x - 2y)(x - 4)$$.",
    points: 2
  },
  {
    id: "q_b8_alg_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Simplify completely: $$\\frac{x^2 - 9}{x^2 + 3x}$$.",
    options: ["(x - 3)/x", "(x + 3)/x", "x - 3", "-3/x"],
    correctAnswer: "(x - 3)/x",
    hint: "Factor numerator as difference of two squares and denominator by common factor $x$.",
    workedSolution: "$$\\frac{(x - 3)(x + 3)}{x(x + 3)} = \\frac{x - 3}{x}$$.",
    points: 2
  },
  {
    id: "q_b8_alg_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Simplify as a single fraction: $$\\frac{3}{x - 2} - \\frac{2}{x + 3}$$.",
    options: ["(x + 13)/((x - 2)(x + 3))", "(x - 5)/((x - 2)(x + 3))", "(x + 5)/((x - 2)(x + 3))", "1/((x - 2)(x + 3))"],
    correctAnswer: "(x + 13)/((x - 2)(x + 3))",
    hint: "Common denominator is $(x - 2)(x + 3)$. Cross multiply numerators: $3(x + 3) - 2(x - 2)$.",
    workedSolution: "$$\\frac{3(x + 3) - 2(x - 2)}{(x - 2)(x + 3)} = \\frac{3x + 9 - 2x + 4}{(x - 2)(x + 3)} = \\frac{x + 13}{(x - 2)(x + 3)}$$.",
    points: 2
  },
  {
    id: "q_b8_alg_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Expand and simplify: $(2x + 3y)(3x - y) - (x - 2y)^2$.",
    options: ["5x² + 11xy - 7y²", "5x² + 7xy - 7y²", "5x² + 11xy - y²", "7x² + 11xy - 7y²"],
    correctAnswer: "5x² + 11xy - 7y²",
    hint: "Expand both expressions separately before subtracting: $(6x^2 + 7xy - 3y^2) - (x^2 - 4xy + 4y^2)$.",
    workedSolution: "$$(6x^2 - 2xy + 9xy - 3y^2) - (x^2 - 4xy + 4y^2)$$\n$$= (6x^2 + 7xy - 3y^2) - (x^2 - 4xy + 4y^2)$$\n$$= 6x^2 - x^2 + 7xy + 4xy - 3y^2 - 4y^2 = 5x^2 + 11xy - 7y^2$$.",
    points: 2
  },
  {
    id: "q_b8_alg_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Factorize completely: $2ab - 6a - b + 3$.",
    options: ["(b - 3)(2a - 1)", "(b + 3)(2a - 1)", "(b - 3)(2a + 1)", "(2a - 3)(b - 1)"],
    correctAnswer: "(b - 3)(2a - 1)",
    hint: "Factor $2a$ from first pair and $-1$ from second pair: $2a(b - 3) - 1(b - 3)$.",
    workedSolution: "$$2a(b - 3) - 1(b - 3) = (b - 3)(2a - 1)$$.",
    points: 2
  }
];

// Fill items 6 to 50 for Hard
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const m = (i % 6) + 2;
    hardQuestions.push({
      id: `q_b8_alg_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Factorize completely: $${m}ax - ${m}ay - x + y$.`,
      options: [
        `(x - y)(${m}a - 1)`,
        `(x + y)(${m}a - 1)`,
        `(x - y)(${m}a + 1)`,
        `(x + y)(${m}a + 1)`
      ],
      correctAnswer: `(x - y)(${m}a - 1)`,
      hint: `Factor ${m}a from the first pair and -1 from the second pair: ${m}a(x - y) - 1(x - y).`,
      workedSolution: `$$${m}a(x - y) - 1(x - y) = (x - y)(${m}a - 1)$$.`,
      points: 2
    });
  } else if (mod === 1) {
    const k = (i % 5) + 2;
    const kSq = k * k;
    // (x^2 - kSq) / (x^2 + kx) = (x-k)(x+k) / x(x+k) = (x-k)/x
    hardQuestions.push({
      id: `q_b8_alg_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Simplify completely: $$\\frac{x^2 - ${kSq}}{x^2 + ${k}x}$$.`,
      options: [
        `(x - ${k})/x`,
        `(x + ${k})/x`,
        `x - ${k}`,
        `-${k}/x`
      ],
      correctAnswer: `(x - ${k})/x`,
      hint: `Factor the numerator as difference of squares $(x - ${k})(x + ${k})$ and denominator as $x(x + ${k})$.`,
      workedSolution: `$$\\frac{(x - ${k})(x + ${k})}{x(x + ${k})} = \\frac{x - ${k}}{x}$$.`,
      points: 2
    });
  } else if (mod === 2) {
    const p = (i % 4) + 2;
    const q = (i % 3) + 1;
    // 2/(x - p) + 1/(x + q) = [2(x + q) + 1(x - p)] / ((x - p)(x + q)) = (3x + 2q - p) / ((x - p)(x + q))
    const constNumerator = 2 * q - p;
    const numStr = constNumerator >= 0 ? `3x + ${constNumerator}` : `3x - ${Math.abs(constNumerator)}`;
    hardQuestions.push({
      id: `q_b8_alg_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Simplify as a single fraction: $$\\frac{2}{x - ${p}} + \\frac{1}{x + ${q}}$$.`,
      options: [
        `(${numStr})/((x - ${p})(x + ${q}))`,
        `(3x - ${Math.abs(constNumerator) + 2})/((x - ${p})(x + ${q}))`,
        `(x + ${constNumerator})/((x - ${p})(x + ${q}))`,
        `3/((x - ${p})(x + ${q}))`
      ],
      correctAnswer: `(${numStr})/((x - ${p})(x + ${q}))`,
      hint: `Find the common denominator $(x - ${p})(x + ${q})$ and expand numerators: $2(x + ${q}) + 1(x - ${p})$.`,
      workedSolution: `$$\\frac{2(x + ${q}) + 1(x - ${p})}{(x - ${p})(x + ${q})} = \\frac{2x + ${2 * q} + x - ${p}}{(x - ${p})(x + ${q})} = \\frac{${numStr}}{(x - ${p})(x + ${q})}$$.`,
      points: 2
    });
  } else {
    const c = (i % 5) + 2;
    // 3ab - 3ac - b + c = 3a(b - c) - 1(b - c) = (b - c)(3a - 1)
    hardQuestions.push({
      id: `q_b8_alg_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Factorize completely: $${c}ab - ${c}ac - b + c$.`,
      options: [
        `(b - c)(${c}a - 1)`,
        `(b + c)(${c}a - 1)`,
        `(b - c)(${c}a + 1)`,
        `(b + c)(${c}a + 1)`
      ],
      correctAnswer: `(b - c)(${c}a - 1)`,
      hint: `Factor $${c}a$ from the first pair and $-1$ from the second pair.`,
      workedSolution: `$$${c}a(b - c) - 1(b - c) = (b - c)(${c}a - 1)$$.`,
      points: 2
    });
  }
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB8AlgebraPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 8 PRACTICE POOL: topic_algebraic_expressions');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_algebraic_expressions');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_algebraic_expressions not found in Firestore.');
  }

  const existingData = snap.data() || {};
  const levels = existingData.levels || {};

  const b7Count = levels.b7?.practicePool?.low?.length + levels.b7?.practicePool?.medium?.length + levels.b7?.practicePool?.hard?.length || 150;
  const b8Count = lowQuestions.length + mediumQuestions.length + hardQuestions.length;
  const b9Count = levels.b9?.practicePool?.low?.length + levels.b9?.practicePool?.medium?.length + levels.b9?.practicePool?.hard?.length || 9;
  const totalQuestions = b7Count + b8Count + b9Count;

  console.log(`📦 Ingesting B8 Question Bank:`);
  console.log(`  • Low (DOK 1): ${lowQuestions.length} items`);
  console.log(`  • Medium (DOK 2): ${mediumQuestions.length} items`);
  console.log(`  • Hard (DOK 3): ${hardQuestions.length} items`);
  console.log(`  • Total B8 Items: ${b8Count}`);
  console.log(`  • Total Topic Practice Items (B7 + B8 + B9): ${totalQuestions}`);

  const updatedPracticePool = {
    low: lowQuestions,
    medium: mediumQuestions,
    hard: hardQuestions
  };

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
  const p1 = path.join(__dirname, 'payloads', 'topic_algebraic_expressions.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_algebraic_expressions.json');

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

  console.log('🎉 B8 Algebraic Expressions Question Bank expansion completed successfully.');
}

seedB8AlgebraPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B8 algebra pool:', err);
    process.exit(1);
  });
