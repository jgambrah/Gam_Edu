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

// 1. Clean SVG Number Line Generator
const createNumberLineSvg = (val: number, isInclusive: boolean, isGreaterThan: boolean, minAxis = -5, maxAxis = 5) => {
  const width = 360;
  const height = 90;
  const padding = 35;
  const scale = (width - 2 * padding) / (maxAxis - minAxis);
  const originX = padding + (0 - minAxis) * scale;
  const targetX = padding + (val - minAxis) * scale;
  const yAxis = 50;

  // Generate tick marks and numbers
  let ticks = '';
  for (let i = minAxis; i <= maxAxis; i++) {
    const x = padding + (i - minAxis) * scale;
    ticks += `<line x1='${x}' y1='${yAxis - 6}' x2='${x}' y2='${yAxis + 6}' stroke='#475569' stroke-width='1.5'/>`;
    ticks += `<text x='${x}' y='${yAxis + 22}' font-size='11' font-family='sans-serif' fill='#334155' text-anchor='middle'>${i}</text>`;
  }

  // Directional Ray
  const rayEnd = isGreaterThan ? width - 15 : 15;
  const rayPath = `<line x1='${targetX}' y1='${yAxis - 18}' x2='${rayEnd}' y2='${yAxis - 18}' stroke='#2563eb' stroke-width='3.5'/>` +
                  `<polygon points='${isGreaterThan ? `${rayEnd},${yAxis - 23} ${rayEnd + 8},${yAxis - 18} ${rayEnd},${yAxis - 13}` : `${rayEnd},${yAxis - 23} ${rayEnd - 8},${yAxis - 18} ${rayEnd},${yAxis - 13}`}' fill='#2563eb'/>`;

  // Connector from target tick to ray level
  const connector = `<line x1='${targetX}' y1='${yAxis}' x2='${targetX}' y2='${yAxis - 18}' stroke='#2563eb' stroke-width='2' stroke-dasharray='3'/>`;

  // Circle point (open = strict, solid = inclusive)
  const circle = isInclusive
    ? `<circle cx='${targetX}' cy='${yAxis - 18}' r='5.5' fill='#2563eb' stroke='#1d4ed8' stroke-width='2'/>`
    : `<circle cx='${targetX}' cy='${yAxis - 18}' r='5.5' fill='#ffffff' stroke='#2563eb' stroke-width='2.5'/>`;

  return `
  <svg viewBox='0 0 ${width} ${height}' width='100%' height='90' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#e2e8f0' stroke-width='1'/>
    <line x1='20' y1='${yAxis}' x2='${width - 20}' y2='${yAxis}' stroke='#1e293b' stroke-width='2'/>
    <polygon points='20,${yAxis - 4} 12,${yAxis} 20,${yAxis + 4}' fill='#1e293b'/>
    <polygon points='${width - 20},${yAxis - 4} ${width - 12},${yAxis} ${width - 20},${yAxis + 4}' fill='#1e293b'/>
    ${ticks}
    ${connector}
    ${rayPath}
    ${circle}
  </svg>
  `.trim().replace(/\n\s*/g, '');
};

// 2. Clean SVG Coordinate Slope/Intercept Generator
const createCoordinateLineSvg = (m: number, c: number, p1: [number, number], p2: [number, number]) => `
<svg viewBox='0 0 320 200' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <line x1='30' y1='100' x2='290' y2='100' stroke='#64748b' stroke-width='2'/>
  <polygon points='290,97 298,100 290,103' fill='#64748b'/>
  <text x='298' y='115' font-size='12' font-weight='bold' fill='#334155'>x</text>
  <line x1='160' y1='180' x2='160' y2='20' stroke='#64748b' stroke-width='2'/>
  <polygon points='157,20 160,12 163,20' fill='#64748b'/>
  <text x='170' y='20' font-size='12' font-weight='bold' fill='#334155'>y</text>
  <text x='148' y='115' font-size='11' fill='#64748b'>O</text>
  <line x1='60' y1='160' x2='260' y2='40' stroke='#2563eb' stroke-width='3'/>
  <circle cx='100' cy='136' r='4.5' fill='#dc2626'/>
  <text x='105' y='152' font-size='11' font-weight='bold' fill='#dc2626'>(${p1[0]}, ${p1[1]})</text>
  <circle cx='220' cy='64' r='4.5' fill='#dc2626'/>
  <text x='215' y='52' font-size='11' font-weight='bold' fill='#dc2626'>(${p2[0]}, ${p2[1]})</text>
  <text x='50' y='40' font-size='12' font-weight='bold' fill='#2563eb'>y = ${m === 1 ? '' : m}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// -----------------------------------------------------------------------------
// 1. LOW TIER QUESTIONS (DOK 1) - 50 Items
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b8_eq_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Which inequality is represented on the number line below?<br/>${createNumberLineSvg(2, false, true, -3, 5)}`,
    options: ["x > 2", "x ≥ 2", "x < 2", "x ≤ 2"],
    correctAnswer: "x > 2",
    hint: "An open circle at 2 with the arrow pointing to the right means strictly greater than 2.",
    workedSolution: "The unshaded circle at 2 denotes $>$, and the ray pointing rightward indicates values exceeding 2. Thus, $x > 2$.",
    points: 1
  },
  {
    id: "q_b8_eq_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Calculate the gradient ($m$) of the straight line passing through the points $(1, 2)$ and $(3, 8)$.",
    options: ["3", "2", "4", "6"],
    correctAnswer: "3",
    hint: "Use the gradient formula: $m = \\frac{y_2 - y_1}{x_2 - x_1}$.",
    workedSolution: "$$m = \\frac{8 - 2}{3 - 1} = \\frac{6}{2} = 3$$.",
    points: 1
  },
  {
    id: "q_b8_eq_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "In the straight line equation $y = 4x - 7$, what are the gradient and the $y$-intercept?",
    options: [
      "Gradient = 4, y-intercept = -7",
      "Gradient = -7, y-intercept = 4",
      "Gradient = 4, y-intercept = 7",
      "Gradient = -4, y-intercept = -7"
    ],
    correctAnswer: "Gradient = 4, y-intercept = -7",
    hint: "Compare with the slope-intercept form: $y = mx + c$.",
    workedSolution: "In $y = mx + c$, the coefficient of $x$ is $m = 4$ and the constant term is $c = -7$.",
    points: 1
  },
  {
    id: "q_b8_eq_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Which inequality is shown on the number line below?<br/>${createNumberLineSvg(-1, true, false, -5, 3)}`,
    options: ["x ≤ -1", "x < -1", "x ≥ -1", "x > -1"],
    correctAnswer: "x ≤ -1",
    hint: "A solid (filled) circle represents $\\le$ or $\\ge$. The arrow points to the left.",
    workedSolution: "A solid circle at $-1$ with a ray directed leftward denotes numbers less than or equal to $-1$: $x \\le -1$.",
    points: 1
  },
  {
    id: "q_b8_eq_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Solve the linear inequality: $x + 4 > 9$.",
    options: ["x > 5", "x > 13", "x < 5", "x ≥ 5"],
    correctAnswer: "x > 5",
    hint: "Subtract 4 from both sides: $9 - 4$.",
    workedSolution: "$$x > 9 - 4 \\implies x > 5$$.",
    points: 1
  },
  {
    id: "q_b8_eq_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the gradient of any perfectly horizontal straight line?",
    options: ["0", "1", "undefined", "-1"],
    correctAnswer: "0",
    hint: "For a horizontal line, $\\Delta y = y_2 - y_1 = 0$.",
    workedSolution: "Since there is no vertical rise ($\\Delta y = 0$), $m = \\frac{0}{\\Delta x} = 0$.",
    points: 1
  },
  {
    id: "q_b8_eq_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Solve: $2x \\le 10$.",
    options: ["x ≤ 5", "x ≥ 5", "x ≤ 20", "x < 5"],
    correctAnswer: "x ≤ 5",
    hint: "Divide both sides by 2.",
    workedSolution: "$$x \\le \\frac{10}{2} \\implies x \\le 5$$.",
    points: 1
  },
  {
    id: "q_b8_eq_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: `From the coordinate graph below:<br/>${createCoordinateLineSvg(2, 1, [0, 1], [2, 5])}<br/>What is the $y$-intercept of the line?`,
    options: ["(0, 1)", "(1, 0)", "(0, 2)", "(2, 5)"],
    correctAnswer: "(0, 1)",
    hint: "The $y$-intercept is where the line crosses the vertical $y$-axis ($x = 0$).",
    workedSolution: "The line intersects the vertical $y$-axis at $y = 1$, giving coordinate $(0, 1)$.",
    points: 1
  },
  {
    id: "q_b8_eq_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Find the gradient of a straight line passing through $(0, 0)$ and $(4, 12)$.",
    options: ["3", "4", "1/3", "12"],
    correctAnswer: "3",
    hint: "$$m = \\frac{12 - 0}{4 - 0}$$.",
    workedSolution: "$$m = \\frac{12}{4} = 3$$.",
    points: 1
  },
  {
    id: "q_b8_eq_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Solve: $x - 5 < 2$.",
    options: ["x < 7", "x < -3", "x > 7", "x ≤ 7"],
    correctAnswer: "x < 7",
    hint: "Add 5 to both sides: $2 + 5$.",
    workedSolution: "$$x < 2 + 5 \\implies x < 7$$.",
    points: 1
  }
];

// Fill items 11 through 50 to complete 50 Low items
for (let i = 11; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const boundary = (i % 7) - 3;
    const isInc = (i % 2 === 0);
    lowQuestions.push({
      id: `q_b8_eq_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Identify the inequality shown on this axis:<br/>${createNumberLineSvg(boundary, isInc, true, -5, 5)}`,
      options: [
        `x ${isInc ? '≥' : '>'} ${boundary}`,
        `x ${isInc ? '≤' : '<'} ${boundary}`,
        `x ${isInc ? '>' : '≥'} ${boundary}`,
        `x ${isInc ? '<' : '≤'} ${boundary}`
      ],
      correctAnswer: `x ${isInc ? '≥' : '>'} ${boundary}`,
      hint: `Check the circle type (${isInc ? 'solid = inclusive' : 'open = strict'}) and the arrow direction (right = greater than).`,
      workedSolution: `The boundary is at ${boundary}. The circle is ${isInc ? 'solid' : 'open'}, and the ray points right, so $x ${isInc ? '\\ge' : '>'} ${boundary}$.`,
      points: 1
    });
  } else if (mod === 1) {
    const x1 = (i % 3) + 1;
    const y1 = (i % 4) + 1;
    const m = (i % 3) + 2;
    const x2 = x1 + 2;
    const y2 = y1 + m * 2;
    lowQuestions.push({
      id: `q_b8_eq_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Find the gradient ($m$) of the line passing through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
      options: [
        `${m}`,
        `${m + 1}`,
        `${m - 1}`,
        `${2 * m}`
      ],
      correctAnswer: `${m}`,
      hint: `Gradient formula: $m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{${y2} - ${y1}}{${x2} - ${x1}}$.`,
      workedSolution: `$$m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{${y2 - y1}}{2} = ${m}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    const mVal = (i % 5) + 2;
    const cVal = (i % 7) - 3;
    const cStr = cVal >= 0 ? `+ ${cVal}` : `- ${Math.abs(cVal)}`;
    lowQuestions.push({
      id: `q_b8_eq_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `What is the gradient and $y$-intercept of the straight line $y = ${mVal}x ${cStr}$?`,
      options: [
        `m = ${mVal}, c = ${cVal}`,
        `m = ${cVal}, c = ${mVal}`,
        `m = ${mVal}, c = ${-cVal}`,
        `m = ${-mVal}, c = ${cVal}`
      ],
      correctAnswer: `m = ${mVal}, c = ${cVal}`,
      hint: `Compare directly with slope-intercept form $y = mx + c$.`,
      workedSolution: `In $y = mx + c$, the coefficient of $x$ is $m = ${mVal}$ and the constant term is $c = ${cVal}$.`,
      points: 1
    });
  } else {
    const boundary = (i % 5) - 2;
    const isInc = (i % 2 !== 0);
    lowQuestions.push({
      id: `q_b8_eq_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Which inequality matches the ray shown on this number line?<br/>${createNumberLineSvg(boundary, isInc, false, -5, 5)}`,
      options: [
        `x ${isInc ? '≤' : '<'} ${boundary}`,
        `x ${isInc ? '≥' : '>'} ${boundary}`,
        `x ${isInc ? '<' : '≤'} ${boundary}`,
        `x ${isInc ? '>' : '≥'} ${boundary}`
      ],
      correctAnswer: `x ${isInc ? '≤' : '<'} ${boundary}`,
      hint: `The ray points to the left (less than). Circle is ${isInc ? 'solid (inclusive)' : 'open (strict)'}.`,
      workedSolution: `The boundary is at ${boundary}, circle is ${isInc ? 'solid' : 'open'}, and ray points left: $x ${isInc ? '\\le' : '<'} ${boundary}$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER QUESTIONS (DOK 2) - 50 Items
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b8_eq_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Solve the inequality: $$-3x < 12$$.",
    options: ["x > -4", "x < -4", "x > 4", "x ≤ -4"],
    correctAnswer: "x > -4",
    hint: "When dividing or multiplying both sides of an inequality by a negative number, reverse the inequality sign.",
    workedSolution: "$$\\frac{-3x}{-3} > \\frac{12}{-3} \\implies x > -4$$.",
    points: 1
  },
  {
    id: "q_b8_eq_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Express $2x + 3y = 12$ in the slope-intercept form $y = mx + c$, and identify its gradient.",
    options: [
      "y = -2/3x + 4; gradient = -2/3",
      "y = 2/3x + 4; gradient = 2/3",
      "y = -2x + 12; gradient = -2",
      "y = -3/2x + 6; gradient = -3/2"
    ],
    correctAnswer: "y = -2/3x + 4; gradient = -2/3",
    hint: "Isolate $3y$: $3y = -2x + 12$, then divide every term by 3.",
    workedSolution: "$$3y = -2x + 12 \\implies y = -\\frac{2}{3}x + 4$$\n$$\\text{Gradient } m = -\\frac{2}{3}$$.",
    points: 1
  },
  {
    id: "q_b8_eq_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Solve the linear inequality: $4x - 5 \\ge 2x + 7$.",
    options: ["x ≥ 6", "x ≤ 6", "x ≥ 1", "x ≥ 12"],
    correctAnswer: "x ≥ 6",
    hint: "Subtract $2x$ from both sides, then add 5 to both sides.",
    workedSolution: "$$4x - 2x \\ge 7 + 5 \\implies 2x \\ge 12 \\implies x \\ge 6$$.",
    points: 1
  },
  {
    id: "q_b8_eq_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Find the gradient of the line passing through $(-2, 5)$ and $(4, -7)$.",
    options: ["-2", "2", "-1/2", "-3"],
    correctAnswer: "-2",
    hint: "$$m = \\frac{-7 - 5}{4 - (-2)}$$.",
    workedSolution: "$$m = \\frac{-12}{4 + 2} = \\frac{-12}{6} = -2$$.",
    points: 1
  },
  {
    id: "q_b8_eq_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Solve the inequality: $5 - 2x \\le 13$.",
    options: ["x ≥ -4", "x ≤ -4", "x ≥ 4", "x ≤ 4"],
    correctAnswer: "x ≥ -4",
    hint: "Subtract 5: $-2x \\le 8$. Divide by $-2$ and flip the inequality sign.",
    workedSolution: "$$-2x \\le 13 - 5 \\implies -2x \\le 8 \\implies x \\ge \\frac{8}{-2} \\implies x \\ge -4$$.",
    points: 1
  }
];

// Fill remaining Medium items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const a = (i % 3) + 2;
    const b = (i % 5) + 2;
    const ans = (i % 5) + 3;
    const rhs = a * ans + b;
    mediumQuestions.push({
      id: `q_b8_eq_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Solve the linear inequality: $${a}x + ${b} < ${rhs}$.`,
      options: [
        `x < ${ans}`,
        `x > ${ans}`,
        `x ≤ ${ans}`,
        `x < ${ans + 1}`
      ],
      correctAnswer: `x < ${ans}`,
      hint: `Subtract ${b} from both sides: ${rhs} - ${b} = ${rhs - b}. Then divide by ${a}.`,
      workedSolution: `$$${a}x < ${rhs - b} \\implies x < \\frac{${rhs - b}}{${a}} \\implies x < ${ans}$$.`,
      points: 1
    });
  } else if (mod === 1) {
    const negCoeff = (i % 4) + 2;
    const ans = (i % 6) + 2;
    const rhs = negCoeff * ans;
    mediumQuestions.push({
      id: `q_b8_eq_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Solve the inequality: $$-${negCoeff}x \\le ${rhs}$$.`,
      options: [
        `x ≥ -${ans}`,
        `x ≤ -${ans}`,
        `x ≥ ${ans}`,
        `x ≤ ${ans}`
      ],
      correctAnswer: `x ≥ -${ans}`,
      hint: `Divide both sides by -${negCoeff} and reverse the inequality sign from $\\le$ to $\\ge$.`,
      workedSolution: `$$\\frac{-${negCoeff}x}{-${negCoeff}} \\ge \\frac{${rhs}}{-${negCoeff}} \\implies x \\ge -${ans}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    const aVal = (i % 3) + 1;
    const bVal = (i % 3) + 2;
    const cVal = bVal * 4;
    // aVal*x + bVal*y = cVal => bVal*y = -aVal*x + cVal => y = (-aVal/bVal)x + (cVal/bVal)
    mediumQuestions.push({
      id: `q_b8_eq_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Express $${aVal === 1 ? '' : aVal}x + ${bVal}y = ${cVal}$ in the form $y = mx + c$, and identify the $y$-intercept.`,
      options: [
        `y = -${aVal}/${bVal}x + ${cVal / bVal}; y-intercept = (0, ${cVal / bVal})`,
        `y = ${aVal}/${bVal}x + ${cVal / bVal}; y-intercept = (0, ${cVal / bVal})`,
        `y = -${bVal}/${aVal}x + ${cVal}; y-intercept = (0, ${cVal})`,
        `y = -${aVal}x + ${cVal / bVal}; y-intercept = (${cVal / bVal}, 0)`
      ],
      correctAnswer: `y = -${aVal}/${bVal}x + ${cVal / bVal}; y-intercept = (0, ${cVal / bVal})`,
      hint: `Subtract $${aVal === 1 ? '' : aVal}x$, then divide by ${bVal}. The $y$-intercept is $(0, c)$.`,
      workedSolution: `$$${bVal}y = -${aVal === 1 ? '' : aVal}x + ${cVal} \\implies y = -\\frac{${aVal}}{${bVal}}x + ${cVal / bVal}$$\n$$\\text{y-intercept is } (0, ${cVal / bVal})$$.`,
      points: 1
    });
  } else {
    const d = (i % 4) + 2;
    const xAns = (i % 5) + 3;
    // 3x - 4 >= x + (2*xAns - 4)
    const rightConst = 2 * xAns - 4;
    mediumQuestions.push({
      id: `q_b8_eq_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Solve for $x$: $3x - 4 \\ge x + ${rightConst}$.`,
      options: [
        `x ≥ ${xAns}`,
        `x ≤ ${xAns}`,
        `x ≥ ${xAns - 1}`,
        `x > ${xAns}`
      ],
      correctAnswer: `x ≥ ${xAns}`,
      hint: `Group variable terms on the left: $3x - x = 2x$. Add 4 to the right.`,
      workedSolution: `$$3x - x \\ge ${rightConst} + 4 \\implies 2x \\ge ${2 * xAns} \\implies x \\ge ${xAns}$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 3. HARD TIER QUESTIONS (DOK 3) - 50 Items
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b8_eq_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Find the set of all integers $x$ that satisfy the double inequality: $$-3 < 2x + 1 \\le 7$$.",
    options: ["{-1, 0, 1, 2, 3}", "{-2, -1, 0, 1, 2, 3}", "{0, 1, 2, 3}", "{-1, 0, 1, 2}"],
    correctAnswer: "{-1, 0, 1, 2, 3}",
    hint: "Subtract 1 across all three parts: $-4 < 2x \\le 6$. Divide by 2: $-2 < x \\le 3$.",
    workedSolution: "$$-3 - 1 < 2x \\le 7 - 1 \\implies -4 < 2x \\le 6 \\implies -2 < x \\le 3$$\nIntegers strictly greater than $-2$ and up to $3$ are: $\\{-1, 0, 1, 2, 3\\}$.",
    points: 2
  },
  {
    id: "q_b8_eq_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Find the equation of the straight line passing through $(2, 3)$ with gradient $m = -2$.",
    options: ["y = -2x + 7", "y = -2x + 5", "y = 2x - 1", "y = -2x - 7"],
    correctAnswer: "y = -2x + 7",
    hint: "Use $y - y_1 = m(x - x_1)$ or substitute $(2, 3)$ into $y = -2x + c$.",
    workedSolution: "$$3 = -2(2) + c \\implies 3 = -4 + c \\implies c = 7$$\n$$y = -2x + 7$$.",
    points: 2
  },
  {
    id: "q_b8_eq_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Solve for $x$: $$\\frac{x - 1}{3} - \\frac{x + 2}{4} > 1$$.",
    options: ["x > 22", "x < 22", "x > 18", "x ≥ 22"],
    correctAnswer: "x > 22",
    hint: "Multiply through by the LCM of 3 and 4, which is 12: $4(x - 1) - 3(x + 2) > 12$.",
    workedSolution: "$$4(x - 1) - 3(x + 2) > 12 \\implies 4x - 4 - 3x - 6 > 12$$\n$$x - 10 > 12 \\implies x > 22$$.",
    points: 2
  },
  {
    id: "q_b8_eq_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A student must maintain a mean score of at least 70 across 4 examination papers to qualify for a scholarship. Her scores on the first 3 papers are 65, 72, and 68. What is the minimum score she must obtain on the fourth paper?",
    options: ["75", "70", "78", "80"],
    correctAnswer: "75",
    hint: "Form the inequality: $\\frac{65 + 72 + 68 + x}{4} \\ge 70$.",
    workedSolution: "$$\\frac{205 + x}{4} \\ge 70 \\implies 205 + x \\ge 280 \\implies x \\ge 280 - 205 \\implies x \\ge 75$$.",
    points: 2
  },
  {
    id: "q_b8_eq_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Find the equation of the straight line passing through $(3, 5)$ and $(7, 13)$.",
    options: ["y = 2x - 1", "y = 2x + 1", "y = 3x - 4", "y = 2x - 5"],
    correctAnswer: "y = 2x - 1",
    hint: "Calculate gradient $m = \\frac{13 - 5}{7 - 3} = 2$. Then find $c = 5 - 2(3)$.",
    workedSolution: "$$m = \\frac{8}{4} = 2$$\n$$y = 2x + c \\implies 5 = 2(3) + c \\implies 5 = 6 + c \\implies c = -1$$\n$$y = 2x - 1$$.",
    points: 2
  }
];

// Fill remaining Hard items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const lower = -4;
    const upper = (i % 6) + 2;
    const count = upper - lower;
    hardQuestions.push({
      id: `q_b8_eq_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `If $x \\in \\mathbb{Z}$, how many integer values satisfy the double inequality: $$${lower} < x \\le ${upper}$$?`,
      options: [
        `${count}`,
        `${count + 1}`,
        `${count - 1}`,
        `${upper}`
      ],
      correctAnswer: `${count}`,
      hint: `The integers range from ${lower + 1} to ${upper}. Total count = ${upper} - ${lower}.`,
      workedSolution: `The integer set is $\\{${lower + 1}, \\dots, ${upper}\\}$. Total values = $${upper} - (${lower}) = ${count}$.`,
      points: 2
    });
  } else if (mod === 1) {
    // Equation of line from two points
    const x1 = (i % 3) + 1;
    const y1 = (i % 4) + 2;
    const m = (i % 3) + 2;
    const x2 = x1 + 3;
    const y2 = y1 + m * 3;
    const c = y1 - m * x1;
    const cStr = c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`;
    hardQuestions.push({
      id: `q_b8_eq_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Find the equation of the line passing through $(${x1}, ${y1})$ and $(${x2}, ${y2})$.`,
      options: [
        `y = ${m}x ${cStr}`,
        `y = ${m}x ${c >= 0 ? '- ' + c : '+ ' + Math.abs(c)}`,
        `y = ${m + 1}x ${cStr}`,
        `y = -${m}x ${cStr}`
      ],
      correctAnswer: `y = ${m}x ${cStr}`,
      hint: `Find gradient $m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = ${m}$. Substitute $(${x1}, ${y1})$ into $y = ${m}x + c$.`,
      workedSolution: `$$m = \\frac{${y2} - ${y1}}{${x2} - ${x1}} = \\frac{${3 * m}}{3} = ${m}$$\n$$${y1} = ${m}(${x1}) + c \\implies c = ${c}$$\n$$y = ${m}x ${cStr}$$.`,
      points: 2
    });
  } else if (mod === 2) {
    // Fractional inequality: (x + a)/2 - (x - 1)/3 > k
    const a = (i % 3) + 1;
    const k = (i % 4) + 2;
    // 3(x + a) - 2(x - 1) > 6k => 3x + 3a - 2x + 2 > 6k => x + 3a + 2 > 6k => x > 6k - 3a - 2
    const threshold = 6 * k - 3 * a - 2;
    hardQuestions.push({
      id: `q_b8_eq_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Solve the fractional inequality for $x$: $$\\frac{x + ${a}}{2} - \\frac{x - 1}{3} > ${k}$$.`,
      options: [
        `x > ${threshold}`,
        `x < ${threshold}`,
        `x ≥ ${threshold}`,
        `x > ${threshold + 2}`
      ],
      correctAnswer: `x > ${threshold}`,
      hint: `Multiply by LCM (6): $3(x + ${a}) - 2(x - 1) > ${6 * k}$.`,
      workedSolution: `$$3(x + ${a}) - 2(x - 1) > ${6 * k} \\implies 3x + ${3 * a} - 2x + 2 > ${6 * k}$$\n$$x + ${3 * a + 2} > ${6 * k} \\implies x > ${threshold}$$.`,
      points: 2
    });
  } else {
    // Budget constraint problem: cost of notebooks and pens
    const noteCost = 5;
    const penCost = 2;
    const numNotes = (i % 4) + 4;
    const budget = (i % 20) + 40;
    // noteCost * numNotes + penCost * p <= budget
    const maxPens = Math.floor((budget - noteCost * numNotes) / penCost);
    hardQuestions.push({
      id: `q_b8_eq_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Kojo has $\\text{GH¢ } ${budget}.00$ to buy ${numNotes} exercise books at $\\text{GH¢ } ${noteCost}.00$ each and some pens at $\\text{GH¢ } ${penCost}.00$ each. What is the maximum number of pens he can buy?`,
      options: [
        `${maxPens} pens`,
        `${maxPens + 1} pens`,
        `${maxPens - 1} pens`,
        `${maxPens + 2} pens`
      ],
      correctAnswer: `${maxPens} pens`,
      hint: `Form the inequality: $${noteCost}(${numNotes}) + ${penCost}p \\le ${budget}$. Solve for maximum integer $p$.`,
      workedSolution: `$$${noteCost * numNotes} + ${penCost}p \\le ${budget} \\implies ${penCost}p \\le ${budget - noteCost * numNotes} \\implies p \\le ${((budget - noteCost * numNotes) / penCost).toFixed(1)}$$\nSince $p$ must be a whole number, maximum pens = ${maxPens}.`,
      points: 2
    });
  }
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB8EquationsPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 8 PRACTICE POOL: topic_equations_inequalities_graphs');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_equations_inequalities_graphs');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_equations_inequalities_graphs not found in Firestore.');
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
  const p1 = path.join(__dirname, 'payloads', 'topic_equations_inequalities_graphs.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_equations_inequalities_graphs.json');

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

  console.log('🎉 B8 Equations, Inequalities & Graphs Question Bank expansion completed successfully.');
}

seedB8EquationsPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B8 equations pool:', err);
    process.exit(1);
  });
