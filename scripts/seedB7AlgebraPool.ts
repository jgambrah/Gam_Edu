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

// Matchstick Pattern SVG Helper (Horizontal connected squares)
const createMatchstickSquaresSvg = () => `
<svg viewBox='0 0 360 110' width='100%' height='100' xmlns='http://www.w3.org/2000/svg'>
  <rect x='10' y='10' width='340' height='90' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <g transform='translate(20, 25)'>
    <line x1='5' y1='5' x2='45' y2='5' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <circle cx='5' cy='5' r='3.5' fill='#dc2626'/>
    <line x1='5' y1='5' x2='5' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <circle cx='5' cy='45' r='3.5' fill='#dc2626'/>
    <line x1='45' y1='5' x2='45' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <circle cx='45' cy='5' r='3.5' fill='#dc2626'/>
    <line x1='5' y1='45' x2='45' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <circle cx='45' cy='45' r='3.5' fill='#dc2626'/>
    <text x='25' y='62' font-size='11' font-weight='bold' fill='#475569' text-anchor='middle'>n = 1 (4)</text>
  </g>
  <g transform='translate(105, 25)'>
    <line x1='5' y1='5' x2='45' y2='5' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='5' x2='85' y2='5' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='5' y1='5' x2='5' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='5' x2='45' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='85' y1='5' x2='85' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='5' y1='45' x2='45' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='45' x2='85' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <circle cx='5' cy='5' r='3.5' fill='#dc2626'/><circle cx='45' cy='5' r='3.5' fill='#dc2626'/><circle cx='85' cy='5' r='3.5' fill='#dc2626'/>
    <circle cx='5' cy='45' r='3.5' fill='#dc2626'/><circle cx='45' cy='45' r='3.5' fill='#dc2626'/><circle cx='85' cy='45' r='3.5' fill='#dc2626'/>
    <text x='45' y='62' font-size='11' font-weight='bold' fill='#475569' text-anchor='middle'>n = 2 (7)</text>
  </g>
  <g transform='translate(215, 25)'>
    <line x1='5' y1='5' x2='45' y2='5' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='5' x2='85' y2='5' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='85' y1='5' x2='125' y2='5' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='5' y1='5' x2='5' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='5' x2='45' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='85' y1='5' x2='85' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='125' y1='5' x2='125' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='5' y1='45' x2='45' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='45' x2='85' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='85' y1='45' x2='125' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <circle cx='5' cy='5' r='3.5' fill='#dc2626'/><circle cx='45' cy='5' r='3.5' fill='#dc2626'/><circle cx='85' cy='5' r='3.5' fill='#dc2626'/><circle cx='125' cy='5' r='3.5' fill='#dc2626'/>
    <circle cx='5' cy='45' r='3.5' fill='#dc2626'/><circle cx='45' cy='45' r='3.5' fill='#dc2626'/><circle cx='85' cy='45' r='3.5' fill='#dc2626'/><circle cx='125' cy='45' r='3.5' fill='#dc2626'/>
    <text x='65' y='62' font-size='11' font-weight='bold' fill='#475569' text-anchor='middle'>n = 3 (10)</text>
  </g>
</svg>
`.trim().replace(/\n\s*/g, '');

// Matchstick Triangle Pattern SVG Helper (Triangles in a row: 3, 5, 7, ...)
const createMatchstickTrianglesSvg = () => `
<svg viewBox='0 0 320 100' width='100%' height='90' xmlns='http://www.w3.org/2000/svg'>
  <rect x='10' y='10' width='300' height='80' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <g transform='translate(25, 20)'>
    <line x1='5' y1='45' x2='45' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='5' y1='45' x2='25' y2='10' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='45' x2='25' y2='10' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <circle cx='5' cy='45' r='3.5' fill='#dc2626'/><circle cx='45' cy='45' r='3.5' fill='#dc2626'/><circle cx='25' cy='10' r='3.5' fill='#dc2626'/>
    <text x='25' y='60' font-size='11' font-weight='bold' fill='#475569' text-anchor='middle'>n = 1 (3)</text>
  </g>
  <g transform='translate(105, 20)'>
    <line x1='5' y1='45' x2='45' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='45' x2='85' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='5' y1='45' x2='25' y2='10' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='45' x2='25' y2='10' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='45' x2='65' y2='10' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='85' y1='45' x2='65' y2='10' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <circle cx='5' cy='45' r='3.5' fill='#dc2626'/><circle cx='45' cy='45' r='3.5' fill='#dc2626'/><circle cx='85' cy='45' r='3.5' fill='#dc2626'/>
    <circle cx='25' cy='10' r='3.5' fill='#dc2626'/><circle cx='65' cy='10' r='3.5' fill='#dc2626'/>
    <text x='45' y='60' font-size='11' font-weight='bold' fill='#475569' text-anchor='middle'>n = 2 (5)</text>
  </g>
  <g transform='translate(205, 20)'>
    <line x1='5' y1='45' x2='45' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='45' x2='85' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='85' y1='45' x2='125' y2='45' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='5' y1='45' x2='25' y2='10' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='45' x2='25' y2='10' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='45' y1='45' x2='65' y2='10' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='85' y1='45' x2='65' y2='10' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='85' y1='45' x2='105' y2='10' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <line x1='125' y1='45' x2='105' y2='10' stroke='#b45309' stroke-width='4' stroke-linecap='round'/>
    <circle cx='5' cy='45' r='3.5' fill='#dc2626'/><circle cx='45' cy='45' r='3.5' fill='#dc2626'/><circle cx='85' cy='45' r='3.5' fill='#dc2626'/><circle cx='125' cy='45' r='3.5' fill='#dc2626'/>
    <circle cx='25' cy='10' r='3.5' fill='#dc2626'/><circle cx='65' cy='10' r='3.5' fill='#dc2626'/><circle cx='105' cy='10' r='3.5' fill='#dc2626'/>
    <text x='65' y='60' font-size='11' font-weight='bold' fill='#475569' text-anchor='middle'>n = 3 (7)</text>
  </g>
</svg>
`.trim().replace(/\n\s*/g, '');

// -----------------------------------------------------------------------------
// 1. LOW TIER (DOK 1) - 50 ITEMS
// Direct verbal-to-algebraic translation, identifying like terms, single-variable
// numerical substitution, simple linear sequences.
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b7_alg_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Simplify the algebraic expression: $5x + 3x + 2x$.",
    options: ["10x", "10x³", "10", "30x"],
    correctAnswer: "10x",
    hint: "Combine the numerical coefficients: $5 + 3 + 2$.",
    workedSolution: "$$(5 + 3 + 2)x = 10x$$.",
    points: 1
  },
  {
    id: "q_b7_alg_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which of the following expressions translates the phrase '7 less than a number $y$'?",
    options: ["y - 7", "7 - y", "7y", "y / 7"],
    correctAnswer: "y - 7",
    hint: "'Less than' means you subtract 7 from the variable $y$.",
    workedSolution: "Subtracting 7 from $y$ gives $y - 7$.",
    points: 1
  },
  {
    id: "q_b7_alg_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Find the value of $3a + 5$ when $a = 4$.",
    options: ["17", "12", "19", "23"],
    correctAnswer: "17",
    hint: "Substitute 4 into the expression: $3(4) + 5$.",
    workedSolution: "$$3(4) + 5 = 12 + 5 = 17$$.",
    points: 1
  },
  {
    id: "q_b7_alg_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the next term in the linear sequence: $4, 7, 10, 13, \\dots$?",
    options: ["16", "15", "17", "19"],
    correctAnswer: "16",
    hint: "Find the common difference: $7 - 4 = 3$. Add 3 to 13.",
    workedSolution: "$$13 + 3 = 16$$.",
    points: 1
  },
  {
    id: "q_b7_alg_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which pair represents like terms?",
    options: ["4x and -7x", "3x and 3y", "2a and 2a²", "5xy and 5x"],
    correctAnswer: "4x and -7x",
    hint: "Like terms have the exact same variable raised to the same power.",
    workedSolution: "$4x$ and $-7x$ both have variable $x^1$, so they are like terms.",
    points: 1
  },
  {
    id: "q_b7_alg_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Simplify: $8p - 3p$.",
    options: ["5p", "5", "11p", "5p²"],
    correctAnswer: "5p",
    hint: "Subtract the coefficients: $8 - 3$.",
    workedSolution: "$$(8 - 3)p = 5p$$.",
    points: 1
  },
  {
    id: "q_b7_alg_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Translate into an algebraic expression: 'Double a number $k$ and add 9'.",
    options: ["2k + 9", "k + 18", "2(k + 9)", "k² + 9"],
    correctAnswer: "2k + 9",
    hint: "Double a number means multiply by 2 ($2k$).",
    workedSolution: "$$2k + 9$$.",
    points: 1
  },
  {
    id: "q_b7_alg_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Evaluate $2x - y$ if $x = 5$ and $y = 3$.",
    options: ["7", "13", "4", "10"],
    correctAnswer: "7",
    hint: "Substitute $x = 5$ and $y = 3$: $2(5) - 3$.",
    workedSolution: "$$2(5) - 3 = 10 - 3 = 7$$.",
    points: 1
  },
  {
    id: "q_b7_alg_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the common difference ($d$) of the arithmetic sequence: $12, 19, 26, 33, \\dots$?",
    options: ["7", "6", "8", "9"],
    correctAnswer: "7",
    hint: "Subtract the first term from the second term: $19 - 12$.",
    workedSolution: "$$d = 19 - 12 = 7$$.",
    points: 1
  },
  {
    id: "q_b7_alg_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Simplify: $3m + 4n + 2m - n$.",
    options: ["5m + 3n", "5m + 5n", "6m + 3n", "5m - 3n"],
    correctAnswer: "5m + 3n",
    hint: "Group like terms: $(3m + 2m) + (4n - n)$.",
    workedSolution: "$$(3m + 2m) + (4n - n) = 5m + 3n$$.",
    points: 1
  }
];

// Fill items 11 through 50: Direct substitutions & verbal translations
for (let i = 11; i <= 50; i++) {
  const coeff = (i % 5) + 2; // 2 to 6
  const c = i;
  const x = 3;
  const ans = coeff * x + c;

  lowQuestions.push({
    id: `q_b7_alg_l${i < 10 ? '0' + i : i}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: `Evaluate the algebraic expression $${coeff}x + ${c}$ when $x = ${x}$.`,
    options: [
      `${ans}`,
      `${ans + 3}`,
      `${ans - 2 > 0 ? ans - 2 : ans + 5}`,
      `${coeff * x}`
    ],
    correctAnswer: `${ans}`,
    hint: `Substitute $x = ${x}$ into the expression: $${coeff}(${x}) + ${c}$.`,
    workedSolution: `$$${coeff}(${x}) + ${c} = ${coeff * x} + ${c} = ${ans}$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER (DOK 2) - 50 ITEMS
// Sequence rule formulation ($T_n = dn + c$), matchstick patterns, multi-variable
// substitutions with negatives, expanding single brackets.
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b7_alg_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Look at the matchstick pattern below:<br/>${createMatchstickSquaresSvg()}<br/>Find the general formula for the number of matchsticks $S$ needed to form $n$ connected squares.`,
    options: ["S = 3n + 1", "S = 4n", "S = 4n - 1", "S = 2n + 2"],
    correctAnswer: "S = 3n + 1",
    hint: "The sequence of sticks is 4, 7, 10, ... The common difference is 3.",
    workedSolution: "$$d = 7 - 4 = 3$$\nWhen $n = 1$: $3(1) + c = 4 \\implies c = 1$\n$$S = 3n + 1$$.",
    points: 1
  },
  {
    id: "q_b7_alg_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Simplify the expression: $4(2x - 3) + 3(x + 5)$.",
    options: ["11x + 3", "11x - 3", "8x + 3", "11x + 7"],
    correctAnswer: "11x + 3",
    hint: "Expand both brackets first: $(8x - 12) + (3x + 15)$.",
    workedSolution: "$$8x - 12 + 3x + 15 = (8x + 3x) + (-12 + 15) = 11x + 3$$.",
    points: 1
  },
  {
    id: "q_b7_alg_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Find the $20^{\\text{th}}$ term of the linear sequence: $5, 9, 13, 17, \\dots$",
    options: ["81", "85", "77", "80"],
    correctAnswer: "81",
    hint: "The rule is $T_n = 4n + 1$. Substitute $n = 20$.",
    workedSolution: "$$d = 4, \\quad T_1 = 5 \\implies T_n = 4n + 1$$\n$$T_{20} = 4(20) + 1 = 80 + 1 = 81$$.",
    points: 1
  },
  {
    id: "q_b7_alg_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "If $p = 4$ and $q = -3$, evaluate $2p^2 - 3q$.",
    options: ["41", "23", "35", "29"],
    correctAnswer: "41",
    hint: "Square $p$ first ($4^2 = 16$). Note that $-3(-3) = +9$.",
    workedSolution: "$$2(4^2) - 3(-3) = 2(16) + 9 = 32 + 9 = 41$$.",
    points: 1
  },
  {
    id: "q_b7_alg_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Kofi is $x$ years old. His father is 4 times as old as Kofi. His mother is 5 years younger than his father. Write an expression for the mother's age.",
    options: ["4x - 5", "4x + 5", "4(x - 5)", "x + 20"],
    correctAnswer: "4x - 5",
    hint: "Father's age $= 4x$. Mother is 5 years younger than father.",
    workedSolution: "$$\\text{Father} = 4x$$\n$$\\text{Mother} = 4x - 5$$.",
    points: 1
  },
  {
    id: "q_b7_alg_m06",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Look at the matchstick triangle progression below:<br/>${createMatchstickTrianglesSvg()}<br/>Find the general formula for the number of matchsticks $M$ needed to construct $n$ connected triangles.`,
    options: ["M = 2n + 1", "M = 3n", "M = 3n - 1", "M = 2n + 2"],
    correctAnswer: "M = 2n + 1",
    hint: "The number of sticks follows the pattern: 3, 5, 7, ... Notice the common difference is 2.",
    workedSolution: "$$d = 5 - 3 = 2$$\nFor $n = 1$: $2(1) + c = 3 \\implies c = 1$\n$$M = 2n + 1$$.",
    points: 1
  }
];

// Fill remaining Medium items up to 50: Linear sequence nth term formulas
for (let i = 7; i <= 50; i++) {
  const d = (i % 6) + 3; // 3 to 8
  const start = 2 + (i % 5); // 2 to 6
  const c = start - d;
  const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
  const correct = `${d}n ${cStr}`;

  mediumQuestions.push({
    id: `q_b7_alg_m${i < 10 ? '0' + i : i}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Find the $n^{\\text{th}}$ term formula for the linear sequence: $${start}, ${start + d}, ${start + 2 * d}, ${start + 3 * d}, \\dots$`,
    options: [
      correct,
      `${d}n + ${start}`,
      `${d + 1}n - 1`,
      `${d}n + ${d}`
    ],
    correctAnswer: correct,
    hint: `Find the common difference $d = ${d}$, then solve $T_1 = d(1) + c = ${start}$.`,
    workedSolution: `$$d = ${d}$$\n$$c = ${start} - ${d} = ${c}$$\n$$T_n = ${correct}$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 3. HARD TIER (DOK 3) - 50 ITEMS
// Inverse matchstick pattern equations, perimeter/cost algebraic modeling with brackets,
// algebraic fractions with LCM, multi-variable fractional substitutions.
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b7_alg_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In the matchstick square pattern rule $S = 3n + 1$:<br/>${createMatchstickSquaresSvg()}<br/>Which pattern number $n$ requires exactly $151$ matchsticks to construct?`,
    options: ["50", "48", "52", "49"],
    correctAnswer: "50",
    hint: "Set up the equation $3n + 1 = 151$ and solve for $n$.",
    workedSolution: "$$3n + 1 = 151 \\implies 3n = 150 \\implies n = 50$$.",
    points: 2
  },
  {
    id: "q_b7_alg_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "The length of a rectangle is $(3x + 2)\\text{ cm}$ and its width is $(2x - 1)\\text{ cm}$. If the perimeter of the rectangle is $52\\text{ cm}$, find the value of $x$.",
    options: ["5", "6", "4", "7"],
    correctAnswer: "5",
    hint: "Perimeter formula: $P = 2(\\text{length} + \\text{width})$.",
    workedSolution: "$$2[(3x + 2) + (2x - 1)] = 52$$\n$$2(5x + 1) = 52 \\implies 10x + 2 = 52 \\implies 10x = 50 \\implies x = 5$$.",
    points: 2
  },
  {
    id: "q_b7_alg_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Simplify completely: $$\\frac{2(3x - 1)}{3} - \\frac{x + 4}{2}$$.",
    options: ["(9x - 16)/6", "(9x - 14)/6", "(3x - 16)/6", "(9x - 8)/6"],
    correctAnswer: "(9x - 16)/6",
    hint: "The LCM of denominators 3 and 2 is 6. Multiply numerators accordingly.",
    workedSolution: "$$\\frac{2(6x - 2) - 3(x + 4)}{6} = \\frac{12x - 4 - 3x - 12}{6} = \\frac{9x - 16}{6}$$.",
    points: 2
  },
  {
    id: "q_b7_alg_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A vendor bought $x$ packets of biscuits at $\\text{GH¢ } 12.00$ each and $(x + 5)$ packets of sweets at $\\text{GH¢ } 8.00$ each. If she spent $\\text{GH¢ } 240.00$ in total, how many packets of biscuits did she buy?",
    options: ["10", "15", "8", "12"],
    correctAnswer: "10",
    hint: "Form the equation: $12x + 8(x + 5) = 240$.",
    workedSolution: "$$12x + 8x + 40 = 240 \\implies 20x = 200 \\implies x = 10$$.",
    points: 2
  },
  {
    id: "q_b7_alg_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "If $a = 2, \\, b = -3, \\, c = 4$, evaluate the expression: $$\\frac{3a^2 - 2b}{c - b}$$.",
    options: ["18/7", "6/7", "18", "12/7"],
    correctAnswer: "18/7",
    hint: "Numerator: $3(2^2) - 2(-3) = 12 + 6 = 18$. Denominator: $4 - (-3) = 7$.",
    workedSolution: "$$\\text{Numerator: } 3(4) - (-6) = 12 + 6 = 18$$\n$$\\text{Denominator: } 4 - (-3) = 4 + 3 = 7$$\n$$\\frac{18}{7}$$.",
    points: 2
  }
];

// Fill items 6 through 50: Inverse pattern solving and perimeter modeling
for (let i = 6; i <= 50; i++) {
  const sticks = 151 + ((i - 5) * 3);
  const nExpected = (sticks - 1) / 3;

  hardQuestions.push({
    id: `q_b7_alg_h${i < 10 ? '0' + i : i}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a matchstick square progression following the rule $S = 3n + 1$, how many connected squares are formed using exactly ${sticks} matchsticks?`,
    options: [
      `${nExpected}`,
      `${nExpected - 1}`,
      `${nExpected + 1}`,
      `${nExpected + 2}`
    ],
    correctAnswer: `${nExpected}`,
    hint: `Set $3n + 1 = ${sticks}$ and solve for $n$.`,
    workedSolution: `$$3n + 1 = ${sticks} \\implies 3n = ${sticks - 1} \\implies n = ${nExpected}$$.`,
    points: 2
  });
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB7AlgebraPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 7 PRACTICE POOL: topic_algebraic_expressions');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_algebraic_expressions');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_algebraic_expressions not found in Firestore.');
  }

  const existingData = snap.data() || {};
  const levels = existingData.levels || {};

  const b7Count = lowQuestions.length + mediumQuestions.length + hardQuestions.length;
  const b8Count = levels.b8?.practicePool?.low?.length + levels.b8?.practicePool?.medium?.length + levels.b8?.practicePool?.hard?.length || 9;
  const b9Count = levels.b9?.practicePool?.low?.length + levels.b9?.practicePool?.medium?.length + levels.b9?.practicePool?.hard?.length || 9;
  const totalQuestions = b7Count + b8Count + b9Count;

  console.log(`📦 Ingesting B7 Question Bank:`);
  console.log(`  • Low (DOK 1): ${lowQuestions.length} items`);
  console.log(`  • Medium (DOK 2): ${mediumQuestions.length} items`);
  console.log(`  • Hard (DOK 3): ${hardQuestions.length} items`);
  console.log(`  • Total B7 Items: ${b7Count}`);
  console.log(`  • Total Topic Practice Items (B7 + B8 + B9): ${totalQuestions}`);

  const updatedPracticePool = {
    low: lowQuestions,
    medium: mediumQuestions,
    hard: hardQuestions
  };

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
  const p1 = path.join(__dirname, 'payloads', 'topic_algebraic_expressions.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_algebraic_expressions.json');

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

  console.log('🎉 B7 Algebraic Expressions Question Bank expansion completed successfully.');
}

seedB7AlgebraPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B7 algebra pool:', err);
    process.exit(1);
  });
