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

// Clean SVG Graphical Simultaneous Intersecting Lines Generator
const createSimultaneousGraphSvg = (
  eq1: string,
  eq2: string,
  interX: number,
  interY: number
) => {
  const width = 340;
  const height = 240;
  const cx = 170;
  const cy = 120;
  const scale = 22;

  const px = cx + interX * scale;
  const py = cy - interY * scale;

  return `
  <svg viewBox='0 0 ${width} ${height}' width='100%' height='210' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
    <defs>
      <pattern id='grid' width='22' height='22' patternUnits='userSpaceOnUse'>
        <path d='M 22 0 L 0 0 0 22' fill='none' stroke='#e2e8f0' stroke-width='1'/>
      </pattern>
    </defs>
    <rect width='100%' height='100%' fill='url(#grid)'/>
    <line x1='15' y1='${cy}' x2='${width - 15}' y2='${cy}' stroke='#475569' stroke-width='2'/>
    <polygon points='${width - 15},${cy - 3} ${width - 7},${cy} ${width - 15},${cy + 3}' fill='#475569'/>
    <text x='${width - 12}' y='${cy + 15}' font-size='11' font-weight='bold' fill='#334155'>x</text>
    <line x1='${cx}' y1='${height - 15}' x2='${cx}' y2='15' stroke='#475569' stroke-width='2'/>
    <polygon points='${cx - 3},15 ${cx},7 ${cx + 3},15' fill='#475569'/>
    <text x='${cx + 8}' y='15' font-size='11' font-weight='bold' fill='#334155'>y</text>
    <text x='${cx - 12}' y='${cy + 14}' font-size='10' fill='#64748b'>O</text>
    <line x1='${px - 100}' y1='${py + 80}' x2='${px + 100}' y2='${py - 80}' stroke='#2563eb' stroke-width='2.5'/>
    <text x='${px + 35}' y='${py - 85}' font-size='10' font-weight='bold' fill='#2563eb'>${eq1}</text>
    <line x1='${px - 100}' y1='${py - 70}' x2='${px + 100}' y2='${py + 70}' stroke='#059669' stroke-width='2.5'/>
    <text x='${px + 35}' y='${py + 85}' font-size='10' font-weight='bold' fill='#059669'>${eq2}</text>
    <circle cx='${px}' cy='${py}' r='5.5' fill='#dc2626' stroke='#ffffff' stroke-width='2'/>
    <line x1='${px}' y1='${py}' x2='${px}' y2='${cy}' stroke='#dc2626' stroke-width='1.5' stroke-dasharray='3'/>
    <line x1='${px}' y1='${py}' x2='${cx}' y2='${py}' stroke='#dc2626' stroke-width='1.5' stroke-dasharray='3'/>
    <text x='${px + 8}' y='${py - 8}' font-size='11' font-weight='bold' fill='#dc2626'>(${interX}, ${interY})</text>
  </svg>
  `.trim().replace(/\n\s*/g, '');
};

// -----------------------------------------------------------------------------
// 1. LOW TIER QUESTIONS (DOK 1) - 50 Items
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b9_eq_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: `The diagram below shows the graphs of two linear equations plotted on the Cartesian plane:<br/>${createSimultaneousGraphSvg('x + y = 5', '2x - y = 1', 2, 3)}<br/>What is the simultaneous solution $(x, y)$ of the two equations?`,
    options: ["(2, 3)", "(3, 2)", "(1, 4)", "(4, 1)"],
    correctAnswer: "(2, 3)",
    hint: "The simultaneous solution is represented by the point where the two lines intersect.",
    workedSolution: "The lines intersect at the point $x = 2$ and $y = 3$, so the solution is $(2, 3)$.",
    points: 1
  },
  {
    id: "q_b9_eq_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Complete the table of values for the relation $y = 2x - 1$ when $x = 3$:<br/><br/>| $x$ | 0 | 1 | 2 | 3 |<br/>| :---: | :---: | :---: | :---: | :---: |<br/>| $y$ | -1 | 1 | 3 | **?** |",
    options: ["5", "4", "6", "7"],
    correctAnswer: "5",
    hint: "Substitute $x = 3$ into $y = 2x - 1$.",
    workedSolution: "$$y = 2(3) - 1 = 6 - 1 = 5$$.",
    points: 1
  },
  {
    id: "q_b9_eq_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Solve the linear inequality: $$\\frac{x}{4} + 2 > 5$$.",
    options: ["x > 12", "x > 28", "x > 7", "x < 12"],
    correctAnswer: "x > 12",
    hint: "Subtract 2 from both sides first, then multiply by 4.",
    workedSolution: "$$\\frac{x}{4} > 5 - 2 \\implies \\frac{x}{4} > 3 \\implies x > 12$$.",
    points: 1
  },
  {
    id: "q_b9_eq_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Study the graph below:<br/>${createSimultaneousGraphSvg('x - y = -1', 'x + y = 3', 1, 2)}<br/>What are the values of $x$ and $y$ at the point of intersection?`,
    options: ["x = 1, y = 2", "x = 2, y = 1", "x = -1, y = 3", "x = 0, y = 3"],
    correctAnswer: "x = 1, y = 2",
    hint: "Look at the coordinates of the highlighted red dot.",
    workedSolution: "The red marker sits at $x = 1$ on the horizontal axis and $y = 2$ on the vertical axis: $x = 1, y = 2$.",
    points: 1
  },
  {
    id: "q_b9_eq_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which pair of lines will NEVER intersect on the Cartesian coordinate plane?",
    options: [
      "Lines with identical gradients and different y-intercepts (parallel lines)",
      "Lines with perpendicular gradients",
      "Lines with identical y-intercepts",
      "Lines with negative gradients"
    ],
    correctAnswer: "Lines with identical gradients and different y-intercepts (parallel lines)",
    hint: "Parallel lines have the same slope and never meet.",
    workedSolution: "Parallel lines have identical slopes ($m_1 = m_2$) and different intercepts ($c_1 \\ne c_2$), so they have no point of intersection.",
    points: 1
  },
  {
    id: "q_b9_eq_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Solve for $x$: $$\\frac{2x}{3} \\le 6$$.",
    options: ["x ≤ 9", "x ≤ 4", "x ≤ 18", "x ≥ 9"],
    correctAnswer: "x ≤ 9",
    hint: "Multiply by 3: $2x \\le 18$, then divide by 2.",
    workedSolution: "$$2x \\le 18 \\implies x \\le 9$$.",
    points: 1
  },
  {
    id: "q_b9_eq_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "In a table of values for $y = 3 - x$, what is the value of $y$ when $x = -2$?",
    options: ["5", "1", "-5", "-1"],
    correctAnswer: "5",
    hint: "Substitute: $y = 3 - (-2)$.",
    workedSolution: "$$y = 3 - (-2) = 3 + 2 = 5$$.",
    points: 1
  },
  {
    id: "q_b9_eq_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: `From the graphical system:<br/>${createSimultaneousGraphSvg('2x + y = 7', 'x - y = -1', 2, 3)}<br/>Verify whether $(2, 3)$ satisfies $2x + y = 7$.`,
    options: ["Yes, 2(2) + 3 = 7", "No, 2(2) + 3 ≠ 7", "Only if x = 0", "Cannot be determined"],
    correctAnswer: "Yes, 2(2) + 3 = 7",
    hint: "Substitute $x = 2$ and $y = 3$ into the equation.",
    workedSolution: "$$2(2) + 3 = 4 + 3 = 7$$, so the statement is verified.",
    points: 1
  },
  {
    id: "q_b9_eq_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Solve the inequality: $$\\frac{x - 3}{2} < 4$$.",
    options: ["x < 11", "x < 5", "x < 8", "x > 11"],
    correctAnswer: "x < 11",
    hint: "Multiply both sides by 2, then add 3.",
    workedSolution: "$$x - 3 < 8 \\implies x < 8 + 3 \\implies x < 11$$.",
    points: 1
  },
  {
    id: "q_b9_eq_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $(k, 4)$ lies on the line $y = 2x - 2$, what is the value of $k$?",
    options: ["3", "6", "1", "2"],
    correctAnswer: "3",
    hint: "Substitute $y = 4$ and solve $4 = 2k - 2$.",
    workedSolution: "$$4 = 2k - 2 \\implies 2k = 6 \\implies k = 3$$.",
    points: 1
  }
];

// Fill items 11 through 50 to complete 50 Low items
for (let i = 11; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const m = (i % 4) + 1;
    const c = (i % 5) - 2;
    const xTest = 2;
    const yAns = m * xTest + c;
    lowQuestions.push({
      id: `q_b9_eq_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `In the linear relation $y = ${m}x ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}$, what is $y$ when $x = ${xTest}$?`,
      options: [
        `${yAns}`,
        `${yAns + 1}`,
        `${yAns - 1}`,
        `${yAns + 2}`
      ],
      correctAnswer: `${yAns}`,
      hint: `Substitute $x = ${xTest}$: $${m}(${xTest}) ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)}$.`,
      workedSolution: `$$y = ${m}(${xTest}) ${c >= 0 ? '+ ' + c : '- ' + Math.abs(c)} = ${yAns}$$.`,
      points: 1
    });
  } else if (mod === 1) {
    const denom = (i % 4) + 2;
    const addVal = (i % 3) + 1;
    const rhs = (i % 4) + 4;
    // x / denom + addVal > rhs => x / denom > rhs - addVal => x > denom * (rhs - addVal)
    const ans = denom * (rhs - addVal);
    lowQuestions.push({
      id: `q_b9_eq_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Solve the linear inequality: $$\\frac{x}{${denom}} + ${addVal} > ${rhs}$$.`,
      options: [
        `x > ${ans}`,
        `x > ${ans + denom}`,
        `x < ${ans}`,
        `x ≥ ${ans}`
      ],
      correctAnswer: `x > ${ans}`,
      hint: `Subtract ${addVal} from both sides, then multiply by ${denom}.`,
      workedSolution: `$$\\frac{x}{${denom}} > ${rhs - addVal} \\implies x > ${ans}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    const ix = (i % 3) + 1;
    const iy = (i % 4) + 1;
    lowQuestions.push({
      id: `q_b9_eq_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `The graphs of two linear functions intersect at the point shown below:<br/>${createSimultaneousGraphSvg(`y = x + ${iy - ix}`, `x + y = ${ix + iy}`, ix, iy)}<br/>Identify the coordinates of their point of intersection.`,
      options: [
        `(${ix}, ${iy})`,
        `(${iy}, ${ix})`,
        `(${ix + 1}, ${iy})`,
        `(${ix}, ${iy - 1})`
      ],
      correctAnswer: `(${ix}, ${iy})`,
      hint: `Read the coordinates of the highlighted red intersection point.`,
      workedSolution: `The point of intersection is located at $x = ${ix}$ and $y = ${iy}$: $(${ix}, ${iy})$.`,
      points: 1
    });
  } else {
    const m1 = (i % 5) + 2;
    lowQuestions.push({
      id: `q_b9_eq_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `A line $L_1$ has the equation $y = ${m1}x + 3$. Which of the following lines is parallel to $L_1$?`,
      options: [
        `y = ${m1}x - 5`,
        `y = -${m1}x + 3`,
        `y = ${m1 + 1}x + 3`,
        `y = -1/${m1}x + 4`
      ],
      correctAnswer: `y = ${m1}x - 5`,
      hint: `Parallel lines have the same gradient $m = ${m1}$.`,
      workedSolution: `Two lines are parallel if and only if their gradients are equal ($m_1 = m_2 = ${m1}$).`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER QUESTIONS (DOK 2) - 50 Items
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b9_eq_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Solve the multi-step rational inequality: $$\\frac{2x - 1}{3} - \\frac{x + 2}{2} \\le 1$$.",
    options: ["x ≤ 14", "x ≥ 14", "x ≤ 10", "x ≤ 8"],
    correctAnswer: "x ≤ 14",
    hint: "Multiply every term by the LCM (6): $2(2x - 1) - 3(x + 2) \\le 6$.",
    workedSolution: "$$2(2x - 1) - 3(x + 2) \\le 6 \\implies 4x - 2 - 3x - 6 \\le 6$$\n$$x - 8 \\le 6 \\implies x \\le 14$$.",
    points: 1
  },
  {
    id: "q_b9_eq_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Solve the simultaneous equations algebraically: $$\\begin{cases} 2x + y = 11 \\\\ x - y = 1 \\end{cases}$$",
    options: ["x = 4, y = 3", "x = 3, y = 4", "x = 5, y = 1", "x = 6, y = -1"],
    correctAnswer: "x = 4, y = 3",
    hint: "Add both equations to eliminate $y$: $3x = 12$.",
    workedSolution: "$$(2x + y) + (x - y) = 11 + 1 \\implies 3x = 12 \\implies x = 4$$\n$$4 - y = 1 \\implies y = 3$$.",
    points: 1
  },
  {
    id: "q_b9_eq_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Study the graphical simultaneous solution below:<br/>${createSimultaneousGraphSvg('3x - y = 3', 'x + 2y = 8', 2, 3)}<br/>Find the value of $2x + 3y$ at the intersection point.`,
    options: ["13", "12", "15", "10"],
    correctAnswer: "13",
    hint: "Identify the intersection $(x, y) = (2, 3)$ and evaluate $2(2) + 3(3)$.",
    workedSolution: "$$x = 2, \\ y = 3$$\n$$2(2) + 3(3) = 4 + 9 = 13$$.",
    points: 1
  },
  {
    id: "q_b9_eq_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Solve the rational inequality: $$\\frac{3 - 2x}{5} > \\frac{x - 1}{2}$$.",
    options: ["x < 11/9", "x > 11/9", "x < 1", "x > 1"],
    correctAnswer: "x < 11/9",
    hint: "Cross-multiply by positive 10: $2(3 - 2x) > 5(x - 1)$.",
    workedSolution: "$$6 - 4x > 5x - 5 \\implies -9x > -11 \\implies x < \\frac{11}{9}$$.",
    points: 1
  },
  {
    id: "q_b9_eq_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A line passes through $(1, 3)$ and $(3, 7)$. At what coordinate does it intersect the line $y = 5$?",
    options: ["(2, 5)", "(3, 5)", "(1, 5)", "(4, 5)"],
    correctAnswer: "(2, 5)",
    hint: "Gradient $m = 2$, equation is $y = 2x + 1$. Substitute $y = 5$.",
    workedSolution: "$$5 = 2x + 1 \\implies 2x = 4 \\implies x = 2$$. Intersection is $(2, 5)$.",
    points: 1
  }
];

// Fill remaining Medium items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const k = (i % 5) + 2;
    mediumQuestions.push({
      id: `q_b9_eq_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Solve for $x$: $$\\frac{${k}x + 1}{4} \\le 2$$.`,
      options: [
        `x ≤ 7/${k}`,
        `x ≥ 7/${k}`,
        `x ≤ 9/${k}`,
        `x ≤ 8/${k}`
      ],
      correctAnswer: `x ≤ 7/${k}`,
      hint: `Multiply by 4: $${k}x + 1 \\le 8$. Subtract 1 and divide by ${k}.`,
      workedSolution: `$$${k}x + 1 \\le 8 \\implies ${k}x \\le 7 \\implies x \\le \\frac{7}{${k}}$$.`,
      points: 1
    });
  } else if (mod === 1) {
    // Simultaneous system: x + y = A, x - y = B => x = (A+B)/2, y = (A-B)/2
    const xVal = (i % 4) + 3;
    const yVal = (i % 3) + 1;
    const A = xVal + yVal;
    const B = xVal - yVal;
    mediumQuestions.push({
      id: `q_b9_eq_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Solve the simultaneous linear system: $$\\begin{cases} x + y = ${A} \\\\ x - y = ${B} \\end{cases}$$`,
      options: [
        `x = ${xVal}, y = ${yVal}`,
        `x = ${yVal}, y = ${xVal}`,
        `x = ${xVal + 1}, y = ${yVal - 1}`,
        `x = ${xVal}, y = ${yVal + 1}`
      ],
      correctAnswer: `x = ${xVal}, y = ${yVal}`,
      hint: `Add equations: $2x = ${A + B} \\implies x = ${xVal}$. Subtract to find $y$.`,
      workedSolution: `$$2x = ${A + B} \\implies x = ${xVal}$$\n$$y = ${A} - ${xVal} = ${yVal}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    // Rational inequality: (3x + 1)/5 - (x - 1)/2 < 1 => 2(3x + 1) - 5(x - 1) < 10 => 6x + 2 - 5x + 5 < 10 => x + 7 < 10 => x < 3
    const a = (i % 3) + 1;
    const threshold = (i % 5) + 3;
    const rhsConst = threshold + 7;
    // 2(3x + 1) - 5(x - 1) < rhsConst - 7 => x + 7 < rhsConst => x < threshold
    mediumQuestions.push({
      id: `q_b9_eq_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Solve the rational inequality: $$\\frac{3x + 1}{5} - \\frac{x - 1}{2} < ${((rhsConst - 7) / 10).toFixed(1)}$$.`,
      options: [
        `x < ${threshold}`,
        `x > ${threshold}`,
        `x ≤ ${threshold}`,
        `x < ${threshold + 2}`
      ],
      correctAnswer: `x < ${threshold}`,
      hint: `Multiply by LCM 10: $2(3x + 1) - 5(x - 1) < ${rhsConst - 7}$.`,
      workedSolution: `$$6x + 2 - 5x + 5 < ${rhsConst - 7} \\implies x + 7 < ${rhsConst} \\implies x < ${threshold}$$.`,
      points: 1
    });
  } else {
    // Point on line test: (x, y) on y = mx + c
    const m = (i % 3) + 2;
    const c = (i % 4) + 1;
    const x0 = (i % 3) + 2;
    const y0 = m * x0 + c;
    mediumQuestions.push({
      id: `q_b9_eq_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `The line $L$ has equation $y = ${m}x + ${c}$. What is the value of $y$ at $x = ${x0}$?`,
      options: [
        `${y0}`,
        `${y0 + 2}`,
        `${y0 - 1}`,
        `${y0 + 3}`
      ],
      correctAnswer: `${y0}`,
      hint: `Substitute $x = ${x0}$ into $y = ${m}(${x0}) + ${c}$.`,
      workedSolution: `$$y = ${m}(${x0}) + ${c} = ${m * x0} + ${c} = ${y0}$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 3. HARD TIER QUESTIONS (DOK 3) - 50 Items
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b9_eq_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Find the truth set of integers $x \\in \\mathbb{Z}$ that satisfy both inequalities: $$\\frac{2x - 1}{3} < 3 \\quad \\text{and} \\quad \\frac{3x + 4}{2} \\ge 5$$.",
    options: ["{2, 3, 4}", "{2, 3, 4, 5}", "{1, 2, 3, 4}", "{3, 4}"],
    correctAnswer: "{2, 3, 4}",
    hint: "Inequality 1: $2x - 1 < 9 \\implies x < 5$. Inequality 2: $3x + 4 \\ge 10 \\implies 3x \\ge 6 \\implies x \\ge 2$. Combine: $2 \\le x < 5$.",
    workedSolution: "$$x < 5 \\quad \\text{and} \\quad x \\ge 2 \\implies 2 \\le x < 5$$\nIntegers in this range: $\\{2, 3, 4\\}$.",
    points: 2
  },
  {
    id: "q_b9_eq_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `Two straight lines $L_1: y = 2x - 1$ and $L_2: x + y = 5$ intersect at point $P$:<br/>${createSimultaneousGraphSvg('y = 2x - 1', 'x + y = 5', 2, 3)}<br/>Calculate the area of the triangle formed by $P$, the point where $L_2$ crosses the $x$-axis $(5, 0)$, and the origin $(0, 0)$.`,
    options: ["7.5 square units", "10 square units", "5 square units", "15 square units"],
    correctAnswer: "7.5 square units",
    hint: "Base lies along the $x$-axis from $(0, 0)$ to $(5, 0)$ (base $= 5$). The vertical height is the $y$-coordinate of $P$ ($h = 3$).",
    workedSolution: "$$\\text{Base} = 5, \\quad \\text{Height} = y_P = 3$$\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 5 \\times 3 = 7.5\\text{ sq units}$$.",
    points: 2
  },
  {
    id: "q_b9_eq_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Solve the fractional simultaneous system: $$\\begin{cases} \\frac{x}{2} + \\frac{y}{3} = 4 \\\\ \\frac{x}{4} + \\frac{y}{2} = 4 \\end{cases}$$",
    options: ["x = 4, y = 6", "x = 6, y = 4", "x = 2, y = 8", "x = 4, y = 4"],
    correctAnswer: "x = 4, y = 6",
    hint: "Clear fractions: Eq 1: $3x + 2y = 24$. Eq 2: $x + 2y = 16$. Subtract Eq 2 from Eq 1.",
    workedSolution: "$$(3x + 2y) - (x + 2y) = 24 - 16 \\implies 2x = 8 \\implies x = 4$$\n$$4 + 2y = 16 \\implies 2y = 12 \\implies y = 6$$.",
    points: 2
  },
  {
    id: "q_b9_eq_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A printer charges a fixed setup cost plus an amount per copy. For 50 copies, the total bill is $\\text{GH¢ } 35.00$; for 120 copies, the total bill is $\\text{GH¢ } 70.00$. By setting up simultaneous equations, determine the cost of printing 200 copies.",
    options: ["GH¢ 110.00", "GH¢ 105.00", "GH¢ 100.00", "GH¢ 120.00"],
    correctAnswer: "GH¢ 110.00",
    hint: "Let total cost $C = a + bx$. Find rate $b = \\frac{70 - 35}{120 - 50} = \\frac{35}{70} = 0.50$. Find fixed setup $a$.",
    workedSolution: "$$b = \\frac{70 - 35}{120 - 50} = \\frac{35}{70} = \\text{GH¢ } 0.50\\text{ per copy}$$\n$$a = 35 - 50(0.50) = 35 - 25 = \\text{GH¢ } 10.00$$\n$$C(200) = 10 + 200(0.50) = 10 + 100 = \\text{GH¢ } 110.00$$.",
    points: 2
  },
  {
    id: "q_b9_eq_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Solve for $x$: $$\\frac{3(x + 1)}{4} - \\frac{x - 1}{2} \\le 2$$.",
    options: ["x ≤ 3", "x ≥ 3", "x ≤ 5", "x ≤ 1"],
    correctAnswer: "x ≤ 3",
    hint: "Multiply every term by 4: $3(x + 1) - 2(x - 1) \\le 8$.",
    workedSolution: "$$3x + 3 - 2x + 2 \\le 8 \\implies x + 5 \\le 8 \\implies x \\le 3$$.",
    points: 2
  }
];

// Fill remaining Hard items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const c1 = (i % 5) + 1;
    const diff = 2 * ((i % 4) + 1);
    const c2 = c1 + diff;
    const xSol = diff / 2;
    hardQuestions.push({
      id: `q_b9_eq_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Two straight lines $L_1: y = x + ${c1}$ and $L_2: y = -x + ${c2}$ are plotted on the Cartesian plane. What is the $x$-coordinate of their point of intersection?`,
      options: [
        `${xSol}`,
        `${xSol + 1}`,
        `${xSol - 1}`,
        `${diff}`
      ],
      correctAnswer: `${xSol}`,
      hint: `Set equations equal: $x + ${c1} = -x + ${c2} \\implies 2x = ${c2} - ${c1}$.`,
      workedSolution: `$$x + ${c1} = -x + ${c2} \\implies 2x = ${diff} \\implies x = ${xSol}$$.`,
      points: 2
    });
  } else if (mod === 1) {
    // Area between intersecting lines and axis:
    // Line 1: y = x, Line 2: x + y = 2k => intersect at (k, k)
    // Line 2 crosses x-axis at (2k, 0).
    // Triangle (0, 0), (2k, 0), (k, k) has area = 1/2 * 2k * k = k^2.
    const k = (i % 4) + 2;
    const area = k * k;
    hardQuestions.push({
      id: `q_b9_eq_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `The lines $y = x$ and $x + y = ${2 * k}$ intersect at $P(${k}, ${k})$:<br/>${createSimultaneousGraphSvg('y = x', `x + y = ${2 * k}`, k, k)}<br/>Calculate the area of the triangle bounded by the origin $(0, 0)$, the point $P(${k}, ${k})$, and the $x$-intercept $(${2 * k}, 0)$.`,
      options: [
        `${area} sq units`,
        `${area * 2} sq units`,
        `${area + 2} sq units`,
        `${area / 2} sq units`
      ],
      correctAnswer: `${area} sq units`,
      hint: `Base on the $x$-axis is ${2 * k}. Vertical height is the $y$-coordinate of $P$ ($h = ${k}$).`,
      workedSolution: `$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times ${2 * k} \\times ${k} = ${area}\\text{ sq units}$$.`,
      points: 2
    });
  } else if (mod === 2) {
    // Integer truth set of double inequality:
    // a <= 2x + 1 < b
    const lowBound = 2 * ((i % 3) + 1);
    const count = (i % 4) + 2;
    const highBound = lowBound + 2 * count;
    // lowBound <= 2x + 1 < highBound
    // lowBound - 1 <= 2x < highBound - 1
    // (lowBound - 1)/2 <= x < (highBound - 1)/2
    hardQuestions.push({
      id: `q_b9_eq_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `How many integers $x \\in \\mathbb{Z}$ satisfy the double inequality: $$${lowBound} \\le 2x < ${highBound}$$?`,
      options: [
        `${count}`,
        `${count + 1}`,
        `${count - 1}`,
        `${count + 2}`
      ],
      correctAnswer: `${count}`,
      hint: `Divide all parts by 2: ${lowBound / 2} \\le x < ${highBound / 2}. Count integers in this interval.`,
      workedSolution: `$$\\frac{${lowBound}}{2} \\le x < \\frac{${highBound}}{2} \\implies ${lowBound / 2} \\le x < ${highBound / 2}$$\nIntegers from ${lowBound / 2} up to ${(highBound / 2) - 1} total exactly ${count} integers.`,
      points: 2
    });
  } else {
    // Cost revenue break-even
    const unitCost = (i % 3) + 2;
    const unitRev = unitCost + 3;
    const fixedCost = (i % 4 + 2) * 15;
    // Rev = Cost => unitRev * x = fixedCost + unitCost * x => 3x = fixedCost => x = fixedCost / 3
    const breakEvenUnits = fixedCost / 3;
    hardQuestions.push({
      id: `q_b9_eq_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `A student enterprise produces greeting cards. The fixed equipment cost is $\\text{GH¢ } ${fixedCost}.00$, and each card costs $\\text{GH¢ } ${unitCost}.00$ to produce. If each card sells for $\\text{GH¢ } ${unitRev}.00$, how many cards must be sold to break even (where Total Revenue = Total Cost)?`,
      options: [
        `${breakEvenUnits} cards`,
        `${breakEvenUnits + 5} cards`,
        `${breakEvenUnits - 5} cards`,
        `${breakEvenUnits + 10} cards`
      ],
      correctAnswer: `${breakEvenUnits} cards`,
      hint: `Equate Revenue and Cost: $${unitRev}x = ${fixedCost} + ${unitCost}x$.`,
      workedSolution: `$$${unitRev}x - ${unitCost}x = ${fixedCost} \\implies 3x = ${fixedCost} \\implies x = ${breakEvenUnits}\\text{ cards}$$.`,
      points: 2
    });
  }
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB9EquationsPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 9 PRACTICE POOL: topic_equations_inequalities_graphs');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_equations_inequalities_graphs');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_equations_inequalities_graphs not found in Firestore.');
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
  const p1 = path.join(__dirname, 'payloads', 'topic_equations_inequalities_graphs.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_equations_inequalities_graphs.json');

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

  console.log('🎉 B9 Equations, Inequalities & Graphs Question Bank expansion completed successfully.');
}

seedB9EquationsPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B9 equations pool:', err);
    process.exit(1);
  });
