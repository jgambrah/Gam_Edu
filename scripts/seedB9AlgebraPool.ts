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
// SVG GENERATION HELPERS
// -----------------------------------------------------------------------------

// 1. Framed Border Geometric SVG Helper
const createFramedRectSvg = (innerL: string, innerW: string, borderW: string) => `
<svg viewBox='0 0 350 190' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'>
  <rect x='15' y='15' width='320' height='160' rx='6' fill='#f1f5f9' stroke='#334155' stroke-width='2.5'/>
  <rect x='55' y='45' width='240' height='100' rx='4' fill='#bfdbfe' stroke='#2563eb' stroke-width='2'/>
  <text x='175' y='98' font-size='13' font-weight='bold' fill='#1e3a8a' text-anchor='middle'>Photo: ${innerL} × ${innerW}</text>
  <line x1='15' y1='30' x2='55' y2='30' stroke='#dc2626' stroke-width='1.5'/>
  <text x='35' y='26' font-size='11' font-weight='bold' fill='#dc2626' text-anchor='middle'>${borderW}</text>
  <line x1='295' y1='30' x2='335' y2='30' stroke='#dc2626' stroke-width='1.5'/>
  <text x='315' y='26' font-size='11' font-weight='bold' fill='#dc2626' text-anchor='middle'>${borderW}</text>
  <text x='175' y='170' font-size='11' font-weight='bold' fill='#475569' text-anchor='middle'>Outer Dimensions: (${innerL} + 2${borderW}) × (${innerW} + 2${borderW})</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Algebraic Rectangle SVG Helper
const createAlgebraicRectSvg = (lengthExpr: string, widthExpr: string) => `
<svg viewBox='0 0 320 150' width='100%' height='130' xmlns='http://www.w3.org/2000/svg'>
  <rect x='30' y='25' width='260' height='90' rx='5' fill='#f8fafc' stroke='#0f172a' stroke-width='2'/>
  <text x='160' y='18' font-size='12' font-weight='bold' fill='#2563eb' text-anchor='middle'>Length = ${lengthExpr}</text>
  <text x='20' y='75' font-size='12' font-weight='bold' fill='#16a34a' text-anchor='middle' transform='rotate(-90 20 75)'>${widthExpr}</text>
  <text x='160' y='75' font-size='12' font-style='italic' fill='#64748b' text-anchor='middle'>Area = Length × Width</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 3. Right-Angled Triangle SVG Helper
const createRightTriangleSvg = (baseExpr: string, heightExpr: string, hypExpr: string = '') => `
<svg viewBox='0 0 300 160' width='100%' height='140' xmlns='http://www.w3.org/2000/svg'>
  <polygon points='40,130 250,130 40,25' fill='#f8fafc' stroke='#0f172a' stroke-width='2'/>
  <rect x='40' y='115' width='15' height='15' fill='none' stroke='#0f172a' stroke-width='1.5'/>
  <text x='145' y='148' font-size='12' font-weight='bold' fill='#2563eb' text-anchor='middle'>Base = ${baseExpr}</text>
  <text x='28' y='80' font-size='12' font-weight='bold' fill='#16a34a' text-anchor='middle' transform='rotate(-90 28 80)'>Height = ${heightExpr}</text>
  ${hypExpr ? `<text x='155' y='70' font-size='12' font-weight='bold' fill='#b45309' text-anchor='middle' transform='rotate(26 155 70)'>Hyp = ${hypExpr}</text>` : ''}
</svg>
`.trim().replace(/\n\s*/g, '');

// -----------------------------------------------------------------------------
// 1. LOW TIER QUESTIONS (DOK 1) - 50 Items
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b9_alg_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Make $t$ the subject of the formula: $v = u + at$.",
    options: ["t = (v - u)/a", "t = (v + u)/a", "t = a(v - u)", "t = (u - v)/a"],
    correctAnswer: "t = (v - u)/a",
    hint: "Subtract $u$ from both sides, then divide by $a$.",
    workedSolution: "$$v - u = at \\implies t = \\frac{v - u}{a}$$.",
    points: 1
  },
  {
    id: "q_b9_alg_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Factorize completely: $x^2 + 7x + 10$.",
    options: ["(x + 2)(x + 5)", "(x + 1)(x + 10)", "(x - 2)(x - 5)", "(x + 7)(x + 10)"],
    correctAnswer: "(x + 2)(x + 5)",
    hint: "Find two numbers that multiply to 10 and add to 7.",
    workedSolution: "The numbers are 2 and 5: $$(x + 2)(x + 5)$$.",
    points: 1
  },
  {
    id: "q_b9_alg_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Make $r$ the subject of the circumference formula: $C = 2\\pi r$.",
    options: ["r = C/(2π)", "r = 2π/C", "r = C - 2π", "r = 2C/π"],
    correctAnswer: "r = C/(2π)",
    hint: "Divide both sides by $2\\pi$.",
    workedSolution: "$$r = \\frac{C}{2\\pi}$$.",
    points: 1
  },
  {
    id: "q_b9_alg_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Factorize: $x^2 - 25$.",
    options: ["(x - 5)(x + 5)", "(x - 5)²", "(x + 5)²", "(x - 25)(x + 1)"],
    correctAnswer: "(x - 5)(x + 5)",
    hint: "Difference of two squares identity: $a^2 - b^2 = (a - b)(a + b)$.",
    workedSolution: "$$x^2 - 5^2 = (x - 5)(x + 5)$$.",
    points: 1
  },
  {
    id: "q_b9_alg_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Make $w$ the subject of the perimeter formula: $P = 2(l + w)$.",
    options: ["w = P/2 - l", "w = (P - l)/2", "w = 2P - l", "w = P - 2l"],
    correctAnswer: "w = P/2 - l",
    hint: "Divide by 2 first: $\\frac{P}{2} = l + w$, then subtract $l$.",
    workedSolution: "$$\\frac{P}{2} = l + w \\implies w = \\frac{P}{2} - l$$.",
    points: 1
  },
  {
    id: "q_b9_alg_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Factorize: $x^2 - 8x + 15$.",
    options: ["(x - 3)(x - 5)", "(x + 3)(x + 5)", "(x - 1)(x - 15)", "(x - 3)(x + 5)"],
    correctAnswer: "(x - 3)(x - 5)",
    hint: "Two numbers that multiply to $+15$ and add to $-8$ are $-3$ and $-5$.",
    workedSolution: "$$(x - 3)(x - 5)$$.",
    points: 1
  },
  {
    id: "q_b9_alg_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $y = 3x - 4$, what is $x$ in terms of $y$?",
    options: ["x = (y + 4)/3", "x = (y - 4)/3", "x = 3y + 4", "x = y/3 + 4"],
    correctAnswer: "x = (y + 4)/3",
    hint: "Add 4 to both sides, then divide by 3.",
    workedSolution: "$$y + 4 = 3x \\implies x = \\frac{y + 4}{3}$$.",
    points: 1
  },
  {
    id: "q_b9_alg_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Factorize: $a^2 - 4b^2$.",
    options: ["(a - 2b)(a + 2b)", "(a - 4b)(a + 4b)", "(a - 2b)²", "(a + 2b)²"],
    correctAnswer: "(a - 2b)(a + 2b)",
    hint: "$a^2 - (2b)^2$.",
    workedSolution: "$$(a - 2b)(a + 2b)$$.",
    points: 1
  },
  {
    id: "q_b9_alg_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Make $h$ the subject of the triangle area formula: $A = \\frac{1}{2}bh$.",
    options: ["h = 2A/b", "h = A/(2b)", "h = 2Ab", "h = A - 2b"],
    correctAnswer: "h = 2A/b",
    hint: "Multiply by 2 to clear fraction ($2A = bh$), then divide by $b$.",
    workedSolution: "$$2A = bh \\implies h = \\frac{2A}{b}$$.",
    points: 1
  },
  {
    id: "q_b9_alg_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Factorize: $x^2 + 3x - 18$.",
    options: ["(x + 6)(x - 3)", "(x - 6)(x + 3)", "(x + 9)(x - 2)", "(x - 9)(x + 2)"],
    correctAnswer: "(x + 6)(x - 3)",
    hint: "Find two numbers multiplying to $-18$ and adding to $+3$: $+6$ and $-3$.",
    workedSolution: "$$(x + 6)(x - 3)$$.",
    points: 1
  }
];

// Fill items 11 through 50 to complete 50 Low items
for (let i = 11; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const c = (i % 7) + 2;
    lowQuestions.push({
      id: `q_b9_alg_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Factorize the quadratic expression: $x^2 + ${c + 1}x + ${c}$.`,
      options: [
        `(x + ${c})(x + 1)`,
        `(x - ${c})(x - 1)`,
        `(x + ${c})(x - 1)`,
        `(x + ${c + 1})(x + 1)`
      ],
      correctAnswer: `(x + ${c})(x + 1)`,
      hint: `Find two numbers that multiply to ${c} and add to ${c + 1}: ${c} and 1.`,
      workedSolution: `The factors are ${c} and 1: $$(x + ${c})(x + 1)$$.`,
      points: 1
    });
  } else if (mod === 1) {
    const m = (i % 5) + 2;
    const k = (i % 4) + 3;
    lowQuestions.push({
      id: `q_b9_alg_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Make $m$ the subject of the equation: $y = ${m}m + ${k}$.`,
      options: [
        `m = (y - ${k})/${m}`,
        `m = (y + ${k})/${m}`,
        `m = ${m}y - ${k}`,
        `m = y/${m} - ${k}`
      ],
      correctAnswer: `m = (y - ${k})/${m}`,
      hint: `Subtract ${k} from both sides, then divide by ${m}.`,
      workedSolution: `$$y - ${k} = ${m}m \\implies m = \\frac{y - ${k}}{${m}}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    const sq = ((i % 6) + 3) ** 2;
    const root = Math.round(Math.sqrt(sq));
    lowQuestions.push({
      id: `q_b9_alg_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Factorize using difference of two squares: $x^2 - ${sq}$.`,
      options: [
        `(x - ${root})(x + ${root})`,
        `(x - ${root})²`,
        `(x + ${root})²`,
        `(x - ${sq})(x + 1)`
      ],
      correctAnswer: `(x - ${root})(x + ${root})`,
      hint: `Recall $a^2 - b^2 = (a - b)(a + b)$ where $b = ${root}$.`,
      workedSolution: `$$x^2 - ${root}^2 = (x - ${root})(x + ${root})$$.`,
      points: 1
    });
  } else {
    const a = (i % 4) + 2;
    const b = (i % 3) + 1;
    // (x - a)(x + b) = x^2 + (b - a)x - ab
    const sum = b - a;
    const prod = a * b;
    const sumStr = sum >= 0 ? `+ ${sum}x` : `- ${Math.abs(sum)}x`;
    lowQuestions.push({
      id: `q_b9_alg_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Factorize: $x^2 ${sum === 0 ? '' : sumStr} - ${prod}$.`,
      options: [
        `(x - ${a})(x + ${b})`,
        `(x + ${a})(x - ${b})`,
        `(x - ${a})(x - ${b})`,
        `(x + ${prod})(x - 1)`
      ],
      correctAnswer: `(x - ${a})(x + ${b})`,
      hint: `Find two numbers that multiply to $-${prod}$ and add to $${sum}$: $-${a}$ and $+${b}$.`,
      workedSolution: `$$x^2 ${sum === 0 ? '' : sumStr} - ${prod} = (x - ${a})(x + ${b})$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER QUESTIONS (DOK 2) - 50 Items
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b9_alg_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Make $L$ the subject of the pendulum formula: $$T = 2\\pi \\sqrt{\\frac{L}{g}}$$.",
    options: ["L = gT²/(4π²)", "L = 4π²T²/g", "L = gT/(2π)", "L = √(gT/2π)"],
    correctAnswer: "L = gT²/(4π²)",
    hint: "Divide by $2\\pi$, square both sides, then multiply by $g$.",
    workedSolution: "$$\\frac{T}{2\\pi} = \\sqrt{\\frac{L}{g}} \\implies \\frac{T^2}{4\\pi^2} = \\frac{L}{g} \\implies L = \\frac{gT^2}{4\\pi^2}$$.",
    points: 1
  },
  {
    id: "q_b9_alg_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `A plot of land has dimensions shown below:<br/>${createAlgebraicRectSvg('x + 5', 'x')}<br/>If the area of the rectangle is $36\\text{ m}^2$, find the value of $x$.`,
    options: ["4 m", "9 m", "6 m", "3 m"],
    correctAnswer: "4 m",
    hint: "Set up the equation $x(x + 5) = 36 \\implies x^2 + 5x - 36 = 0$.",
    workedSolution: "$$x^2 + 5x - 36 = 0 \\implies (x + 9)(x - 4) = 0$$\nSince a dimension cannot be negative, $x = 4\\text{ m}$.",
    points: 1
  },
  {
    id: "q_b9_alg_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Factorize completely: $2x^2 + 7x + 3$.",
    options: ["(2x + 1)(x + 3)", "(2x + 3)(x + 1)", "(x + 1)(2x + 3)", "(2x - 1)(x - 3)"],
    correctAnswer: "(2x + 1)(x + 3)",
    hint: "Product $= 2 \\times 3 = 6$, sum $= 7$. Split $7x$ into $6x + x$.",
    workedSolution: "$$2x^2 + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3)$$.",
    points: 1
  },
  {
    id: "q_b9_alg_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Make $u$ the subject of the equation of motion: $v^2 = u^2 + 2as$.",
    options: ["u = √(v² - 2as)", "u = v - √(2as)", "u = √(v² + 2as)", "u = (v² - 2as)/2"],
    correctAnswer: "u = √(v² - 2as)",
    hint: "Subtract $2as$ from both sides, then take the square root.",
    workedSolution: "$$u^2 = v^2 - 2as \\implies u = \\sqrt{v^2 - 2as}$$.",
    points: 1
  },
  {
    id: "q_b9_alg_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Factorize: $3x^2 - 10x + 8$.",
    options: ["(3x - 4)(x - 2)", "(3x - 2)(x - 4)", "(3x + 4)(x - 2)", "(x - 2)(3x + 4)"],
    correctAnswer: "(3x - 4)(x - 2)",
    hint: "Product $= 3 \\times 8 = 24$, sum $= -10$. Numbers are $-6$ and $-4$.",
    workedSolution: "$$3x^2 - 6x - 4x + 8 = 3x(x - 2) - 4(x - 2) = (3x - 4)(x - 2)$$.",
    points: 1
  }
];

// Fill items 6 to 50 for Medium
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const k = (i % 5) + 2;
    mediumQuestions.push({
      id: `q_b9_alg_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Make $x$ the subject of the relation: $y = \\sqrt{${k}x + 5}$.`,
      options: [
        `x = (y² - 5)/${k}`,
        `x = (y² + 5)/${k}`,
        `x = √(y - 5)/${k}`,
        `x = y² - 5`
      ],
      correctAnswer: `x = (y² - 5)/${k}`,
      hint: `Square both sides: $y^2 = ${k}x + 5$. Subtract 5 and divide by ${k}.`,
      workedSolution: `$$y^2 = ${k}x + 5 \\implies ${k}x = y^2 - 5 \\implies x = \\frac{y^2 - 5}{${k}}$$.`,
      points: 1
    });
  } else if (mod === 1) {
    const a = (i % 4) + 2;
    // a x(x + 3) area problem
    const xVal = (i % 3) + 3;
    const area = xVal * (xVal + a);
    mediumQuestions.push({
      id: `q_b9_alg_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `The rectangle below has an area of $${area}\\text{ cm}^2$:<br/>${createAlgebraicRectSvg(`x + ${a}`, 'x')}<br/>Find the positive value of $x$.`,
      options: [
        `${xVal} cm`,
        `${xVal + 2} cm`,
        `${xVal - 1} cm`,
        `${xVal + a} cm`
      ],
      correctAnswer: `${xVal} cm`,
      hint: `Form quadratic $x(x + ${a}) = ${area} \\implies x^2 + ${a}x - ${area} = 0$.`,
      workedSolution: `$$x^2 + ${a}x - ${area} = 0 \\implies (x + ${xVal + a})(x - ${xVal}) = 0$$\nSince $x > 0$, $x = ${xVal}\\text{ cm}$.`,
      points: 1
    });
  } else if (mod === 2) {
    const aCoeff = 2;
    const p = (i % 3) + 1;
    const q = (i % 4) + 2;
    // (2x + p)(x + q) = 2x^2 + (2q + p)x + pq
    const mid = 2 * q + p;
    const cTerm = p * q;
    mediumQuestions.push({
      id: `q_b9_alg_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Factorize completely: $2x^2 + ${mid}x + ${cTerm}$.`,
      options: [
        `(2x + ${p})(x + ${q})`,
        `(2x + ${q})(x + ${p})`,
        `(x + ${p})(2x - ${q})`,
        `(2x - ${p})(x - ${q})`
      ],
      correctAnswer: `(2x + ${p})(x + ${q})`,
      hint: `Product $= 2 \\times ${cTerm} = ${2 * cTerm}$, sum $= ${mid}$. Split the middle term into $2(${q})x + ${p}x = ${2 * q}x + ${p}x$.`,
      workedSolution: `$$2x^2 + ${2 * q}x + ${p}x + ${cTerm} = 2x(x + ${q}) + ${p}(x + ${q}) = (2x + ${p})(x + ${q})$$.`,
      points: 1
    });
  } else {
    const p = (i % 4) + 2;
    mediumQuestions.push({
      id: `q_b9_alg_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Make $r$ the subject of the cylinder volume formula: $V = \\pi r^2 h$.`,
      options: [
        `r = √(V/(πh))`,
        `r = V/(πh)`,
        `r = √(πh/V)`,
        `r = (V/πh)²`
      ],
      correctAnswer: `r = √(V/(πh))`,
      hint: `Divide both sides by $\\pi h$, then take the principal square root.`,
      workedSolution: `$$r^2 = \\frac{V}{\\pi h} \\implies r = \\sqrt{\\frac{V}{\\pi h}}$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 3. HARD TIER QUESTIONS (DOK 3) - 50 Items
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b9_alg_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Make $x$ the subject of the relation: $$y = \\frac{ax + b}{cx + d}$$.",
    options: [
      "x = (b - dy)/(cy - a)",
      "x = (dy - b)/(a - cy)",
      "x = (b + dy)/(cy - a)",
      "x = (ax - b)/(cy + d)"
    ],
    correctAnswer: "x = (b - dy)/(cy - a)",
    hint: "Multiply by $(cx + d)$, group all $x$ terms on one side, and factorize out $x$.",
    workedSolution: "$$y(cx + d) = ax + b \\implies cyx + dy = ax + b$$\n$$cyx - ax = b - dy \\implies x(cy - a) = b - dy$$\n$$x = \\frac{b - dy}{cy - a}$$.",
    points: 2
  },
  {
    id: "q_b9_alg_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `A photo measuring $12\\text{ cm}$ by $8\\text{ cm}$ is placed in a frame of uniform width $x\\text{ cm}$ all round:<br/>${createFramedRectSvg('12', '8', 'x')}<br/>If the total combined area is $140\\text{ cm}^2$, find the uniform border width $x$.`,
    options: ["1 cm", "2 cm", "1.5 cm", "2.5 cm"],
    correctAnswer: "1 cm",
    hint: "Total dimensions are $(12 + 2x)$ and $(8 + 2x)$. Expand $(12 + 2x)(8 + 2x) = 140$.",
    workedSolution: "$$(12 + 2x)(8 + 2x) = 140 \\implies 96 + 40x + 4x^2 = 140$$\n$$4x^2 + 40x - 44 = 0 \\implies x^2 + 10x - 11 = 0$$\n$$(x + 11)(x - 1) = 0 \\implies x = 1\\text{ cm}$$.",
    points: 2
  },
  {
    id: "q_b9_alg_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Make $r$ the subject of: $$V = \\frac{1}{3}\\pi r^2 h$$.",
    options: ["r = √(3V/(πh))", "r = 3V/(πh)", "r = √(V/(3πh))", "r = (3V/πh)²"],
    correctAnswer: "r = √(3V/(πh))",
    hint: "Multiply by 3 to clear the fraction ($3V = \\pi r^2 h$), divide by $\\pi h$, then take the square root.",
    workedSolution: "$$3V = \\pi r^2 h \\implies r^2 = \\frac{3V}{\\pi h} \\implies r = \\sqrt{\\frac{3V}{\\pi h}}$$.",
    points: 2
  },
  {
    id: "q_b9_alg_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `A right-angled triangle has a base of $(x - 1)\\text{ cm}$, a height of $(2x + 2)\\text{ cm}$, and an area of $24\\text{ cm}^2$:<br/>${createRightTriangleSvg('x - 1', '2x + 2')}<br/>Find the value of $x$.`,
    options: ["5", "6", "4", "7"],
    correctAnswer: "5",
    hint: "Area $= \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2}(x - 1)(2x + 2) = 24$.",
    workedSolution: "$$\\frac{1}{2}(x - 1) \\times 2(x + 1) = 24 \\implies (x - 1)(x + 1) = 24$$\n$$x^2 - 1 = 24 \\implies x^2 = 25 \\implies x = 5$$.",
    points: 2
  },
  {
    id: "q_b9_alg_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Make $m$ the subject of the formula: $$E = \\frac{m v^2}{2} + m g h$$.",
    options: [
      "m = 2E/(v² + 2gh)",
      "m = E/(v² + gh)",
      "m = 2E/(v² + gh)",
      "m = (2E - v²)/(2gh)"
    ],
    correctAnswer: "m = 2E/(v² + 2gh)",
    hint: "Multiply through by 2 to clear fractions: $2E = mv^2 + 2mgh$. Factor out $m$.",
    workedSolution: "$$2E = m(v^2 + 2gh) \\implies m = \\frac{2E}{v^2 + 2gh}$$.",
    points: 2
  }
];

// Fill remaining Hard items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const a = (i % 6) + 2;
    const b = (i % 5) + 3;
    hardQuestions.push({
      id: `q_b9_alg_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Make $p$ the subject of the equation: $$k = \\frac{p + ${a}}{p - ${b}}$$.`,
      options: [
        `p = (${b}k + ${a})/(k - 1)`,
        `p = (${b}k - ${a})/(k - 1)`,
        `p = (k - 1)/(${b}k + ${a})`,
        `p = (${a}k + ${b})/(k + 1)`
      ],
      correctAnswer: `p = (${b}k + ${a})/(k - 1)`,
      hint: `Cross multiply: $k(p - ${b}) = p + ${a}$. Collect all terms with $p$ on one side.`,
      workedSolution: `$$kp - ${b}k = p + ${a} \\implies kp - p = ${b}k + ${a} \\implies p(k - 1) = ${b}k + ${a} \\implies p = \\frac{${b}k + ${a}}{k - 1}$$.`,
      points: 2
    });
  } else if (mod === 1) {
    const innerL = 10 + (i % 5);
    const innerW = 6 + (i % 3);
    const xExpected = 1;
    const outerL = innerL + 2 * xExpected;
    const outerW = innerW + 2 * xExpected;
    const totalArea = outerL * outerW;
    hardQuestions.push({
      id: `q_b9_alg_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `A rectangular picture measuring $${innerL}\\text{ cm}$ by $${innerW}\\text{ cm}$ has a border of uniform width $x\\text{ cm}$ around it:<br/>${createFramedRectSvg(`${innerL}`, `${innerW}`, 'x')}<br/>If the total area of the framed picture is $${totalArea}\\text{ cm}^2$, find $x$.`,
      options: [
        `${xExpected} cm`,
        `${xExpected + 1} cm`,
        `${xExpected + 0.5} cm`,
        `2 cm`
      ],
      correctAnswer: `${xExpected} cm`,
      hint: `Total area: $(${innerL} + 2x)(${innerW} + 2x) = ${totalArea}$. Expand and solve the quadratic.`,
      workedSolution: `$$(${innerL} + 2x)(${innerW} + 2x) = ${totalArea}$$\n$$4x^2 + ${2 * (innerL + innerW)}x + ${innerL * innerW} = ${totalArea}$$\n$$4x^2 + ${2 * (innerL + innerW)}x - ${totalArea - innerL * innerW} = 0$$\nSolving for positive $x$ yields $x = ${xExpected}\\text{ cm}$.`,
      points: 2
    });
  } else if (mod === 2) {
    const k = (i % 4) + 2;
    hardQuestions.push({
      id: `q_b9_alg_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Make $x$ the subject of: $$T = \\sqrt{\\frac{${k}x + 1}{${k}x - 1}}$$.`,
      options: [
        `x = (T² + 1)/(${k}(T² - 1))`,
        `x = (T² - 1)/(${k}(T² + 1))`,
        `x = (T + 1)/(${k}(T - 1))`,
        `x = (T² + 1)/(${k}T² - 1)`
      ],
      correctAnswer: `x = (T² + 1)/(${k}(T² - 1))`,
      hint: `Square both sides: $T^2 = \\frac{${k}x + 1}{${k}x - 1}$. Cross-multiply and isolate $x$.`,
      workedSolution: `$$T^2(${k}x - 1) = ${k}x + 1 \\implies ${k}T^2 x - T^2 = ${k}x + 1$$\n$$${k}T^2 x - ${k}x = T^2 + 1 \\implies ${k}x(T^2 - 1) = T^2 + 1$$\n$$x = \\frac{T^2 + 1}{${k}(T^2 - 1)}$$.`,
      points: 2
    });
  } else {
    const n = (i % 4) + 2;
    hardQuestions.push({
      id: `q_b9_alg_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Make $y$ the subject of the formula: $$z = \\frac{a y}{b + c y}$$.`,
      options: [
        `y = bz/(a - cz)`,
        `y = bz/(a + cz)`,
        `y = (a - cz)/bz`,
        `y = (bz + a)/c`
      ],
      correctAnswer: `y = bz/(a - cz)`,
      hint: `Clear the fraction: $z(b + cy) = ay$. Collect all terms with $y$ on one side.`,
      workedSolution: `$$bz + cyz = ay \\implies ay - cyz = bz \\implies y(a - cz) = bz \\implies y = \\frac{bz}{a - cz}$$.`,
      points: 2
    });
  }
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB9AlgebraPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 9 PRACTICE POOL: topic_algebraic_expressions');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_algebraic_expressions');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_algebraic_expressions not found in Firestore.');
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
  const p1 = path.join(__dirname, 'payloads', 'topic_algebraic_expressions.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_algebraic_expressions.json');

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

  console.log('🎉 B9 Algebraic Expressions Question Bank expansion completed successfully.');
}

seedB9AlgebraPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B9 algebra pool:', err);
    process.exit(1);
  });
