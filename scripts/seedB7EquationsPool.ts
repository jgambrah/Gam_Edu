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

// 1. Balance Scale SVG Helper (Pans in equilibrium)
const createBalanceScaleSvg = (leftExpr: string, rightExpr: string) => `
<svg viewBox='0 0 360 170' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'>
  <rect x='10' y='10' width='340' height='150' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Fulcrum and Beam -->
  <line x1='40' y1='80' x2='320' y2='80' stroke='#1e293b' stroke-width='4'/>
  <polygon points='180,80 160,135 200,135' fill='#475569'/>
  <rect x='140' y='135' width='80' height='10' rx='2' fill='#334155'/>
  <!-- Left Pan -->
  <line x1='75' y1='80' x2='75' y2='105' stroke='#64748b' stroke-width='2'/>
  <path d='M 45 105 Q 75 120 105 105 Z' fill='#cbd5e1' stroke='#475569' stroke-width='2'/>
  <text x='75' y='100' font-size='12' font-weight='bold' fill='#1d4ed8' text-anchor='middle'>${leftExpr}</text>
  <!-- Right Pan -->
  <line x1='285' y1='80' x2='285' y2='105' stroke='#64748b' stroke-width='2'/>
  <path d='M 255 105 Q 285 120 315 105 Z' fill='#cbd5e1' stroke='#475569' stroke-width='2'/>
  <text x='285' y='100' font-size='12' font-weight='bold' fill='#dc2626' text-anchor='middle'>${rightExpr}</text>
  <text x='180' y='65' font-size='14' font-weight='bold' fill='#0f172a' text-anchor='middle'>= (In Equilibrium)</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Linear Function Machine / Backtracking SVG Helper
const createBacktrackingSvg = (inputVar: string, op1: string, op2: string, outputVal: string) => `
<svg viewBox='0 0 360 120' width='100%' height='110' xmlns='http://www.w3.org/2000/svg'>
  <rect x='10' y='10' width='340' height='100' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Input Node -->
  <circle cx='50' cy='60' r='22' fill='#bfdbfe' stroke='#2563eb' stroke-width='2'/>
  <text x='50' y='65' font-size='14' font-weight='bold' fill='#1e3a8a' text-anchor='middle'>${inputVar}</text>
  <!-- Arrow 1 -->
  <line x1='75' y1='60' x2='115' y2='60' stroke='#64748b' stroke-width='2' marker-end='url(#arrow)'/>
  <!-- Op 1 Box -->
  <rect x='115' y='40' width='55' height='40' rx='4' fill='#fef08a' stroke='#ca8a04' stroke-width='1.5'/>
  <text x='142' y='65' font-size='12' font-weight='bold' fill='#854d0e' text-anchor='middle'>${op1}</text>
  <!-- Arrow 2 -->
  <line x1='170' y1='60' x2='210' y2='60' stroke='#64748b' stroke-width='2'/>
  <!-- Op 2 Box -->
  <rect x='210' y='40' width='55' height='40' rx='4' fill='#fed7aa' stroke='#ea580c' stroke-width='1.5'/>
  <text x='237' y='65' font-size='12' font-weight='bold' fill='#9a3412' text-anchor='middle'>${op2}</text>
  <!-- Arrow 3 -->
  <line x1='265' y1='60' x2='300' y2='60' stroke='#64748b' stroke-width='2'/>
  <!-- Output Node -->
  <circle cx='320' cy='60' r='22' fill='#bbf7d0' stroke='#16a34a' stroke-width='2'/>
  <text x='320' y='65' font-size='13' font-weight='bold' fill='#14532d' text-anchor='middle'>${outputVal}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// -----------------------------------------------------------------------------
// 1. LOW TIER QUESTIONS (DOK 1) - 50 Items
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b7_eq_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: `The balance scale below is in equilibrium:<br/>${createBalanceScaleSvg('x + 3', '8')}<br/>What is the value of the unknown mass $x$?`,
    options: ["5", "11", "24", "4"],
    correctAnswer: "5",
    hint: "Remove 3 units from both pans: $8 - 3$.",
    workedSolution: "$$x + 3 = 8 \\implies x = 8 - 3 = 5$$.",
    points: 1
  },
  {
    id: "q_b7_eq_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Solve for $y$: $y - 7 = 15$.",
    options: ["22", "8", "105", "21"],
    correctAnswer: "22",
    hint: "Apply the inverse operation of subtracting 7 by adding 7 to both sides.",
    workedSolution: "$$y = 15 + 7 = 22$$.",
    points: 1
  },
  {
    id: "q_b7_eq_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Solve: $4x = 36$.",
    options: ["9", "8", "144", "32"],
    correctAnswer: "9",
    hint: "Divide both sides by 4.",
    workedSolution: "$$x = \\frac{36}{4} = 9$$.",
    points: 1
  },
  {
    id: "q_b7_eq_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Solve for $m$: $$\\frac{m}{5} = 7$$.",
    options: ["35", "12", "2", "25"],
    correctAnswer: "35",
    hint: "Multiply both sides by 5.",
    workedSolution: "$$m = 7 \\times 5 = 35$$.",
    points: 1
  },
  {
    id: "q_b7_eq_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: `What is the value of $w$ in this balanced scale model?<br/>${createBalanceScaleSvg('2w', '18')}`,
    options: ["9", "16", "36", "7"],
    correctAnswer: "9",
    hint: "Two blocks of $w$ equal 18 units. Divide 18 by 2.",
    workedSolution: "$$2w = 18 \\implies w = \\frac{18}{2} = 9$$.",
    points: 1
  },
  {
    id: "q_b7_eq_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which operation is the inverse of multiplying by 6?",
    options: ["Dividing by 6", "Adding 6", "Subtracting 6", "Multiplying by -6"],
    correctAnswer: "Dividing by 6",
    hint: "Multiplication and division are inverse operations.",
    workedSolution: "The inverse of multiplying by 6 is dividing by 6.",
    points: 1
  },
  {
    id: "q_b7_eq_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Solve: $x + 12 = 30$.",
    options: ["18", "42", "20", "28"],
    correctAnswer: "18",
    hint: "Subtract 12 from both sides.",
    workedSolution: "$$x = 30 - 12 = 18$$.",
    points: 1
  },
  {
    id: "q_b7_eq_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Solve for $k$: $k - 9 = 4$.",
    options: ["13", "5", "36", "-5"],
    correctAnswer: "13",
    hint: "Add 9 to both sides: $4 + 9$.",
    workedSolution: "$$k = 4 + 9 = 13$$.",
    points: 1
  },
  {
    id: "q_b7_eq_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Solve: $6p = 48$.",
    options: ["8", "7", "42", "9"],
    correctAnswer: "8",
    hint: "Divide 48 by 6.",
    workedSolution: "$$p = \\frac{48}{6} = 8$$.",
    points: 1
  },
  {
    id: "q_b7_eq_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Find $x$ from the balanced pan model:<br/>${createBalanceScaleSvg('x + 6', '15')}`,
    options: ["9", "21", "10", "8"],
    correctAnswer: "9",
    hint: "Subtract 6 from 15.",
    workedSolution: "$$x + 6 = 15 \\implies x = 15 - 6 = 9$$.",
    points: 1
  }
];

// Fill items 11 through 50 to complete 50 Low items
for (let i = 11; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const addConst = (i % 9) + 2;
    const ans = (i % 12) + 5;
    const rhs = ans + addConst;
    lowQuestions.push({
      id: `q_b7_eq_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Solve for $x$: $x + ${addConst} = ${rhs}$.`,
      options: [
        `${ans}`,
        `${rhs + addConst}`,
        `${ans + 2}`,
        `${ans - 2}`
      ],
      correctAnswer: `${ans}`,
      hint: `Subtract ${addConst} from both sides: ${rhs} - ${addConst}.`,
      workedSolution: `$$x = ${rhs} - ${addConst} = ${ans}$$.`,
      points: 1
    });
  } else if (mod === 1) {
    const subConst = (i % 8) + 3;
    const ans = (i % 10) + 4;
    const rhs = ans - subConst;
    lowQuestions.push({
      id: `q_b7_eq_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Solve for $y$: $y - ${subConst} = ${rhs}$.`,
      options: [
        `${ans}`,
        `${rhs - subConst}`,
        `${ans + 1}`,
        `${ans - 3}`
      ],
      correctAnswer: `${ans}`,
      hint: `Add ${subConst} to both sides: ${rhs} + ${subConst}.`,
      workedSolution: `$$y = ${rhs} + ${subConst} = ${ans}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    const coeff = (i % 5) + 3;
    const ans = (i % 8) + 2;
    const rhs = coeff * ans;
    lowQuestions.push({
      id: `q_b7_eq_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Solve for $w$: $${coeff}w = ${rhs}$.`,
      options: [
        `${ans}`,
        `${ans + 2}`,
        `${rhs - coeff}`,
        `${ans - 1}`
      ],
      correctAnswer: `${ans}`,
      hint: `Divide both sides by ${coeff}.`,
      workedSolution: `$$w = \\frac{${rhs}}{${coeff}} = ${ans}$$.`,
      points: 1
    });
  } else {
    const denom = (i % 5) + 2;
    const rhs = (i % 6) + 4;
    const ans = denom * rhs;
    lowQuestions.push({
      id: `q_b7_eq_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Solve for $k$: $$\\frac{k}{${denom}} = ${rhs}$$.`,
      options: [
        `${ans}`,
        `${rhs + denom}`,
        `${ans - denom}`,
        `${ans + 2 * denom}`
      ],
      correctAnswer: `${ans}`,
      hint: `Multiply both sides by ${denom}: ${rhs} \\times ${denom}.`,
      workedSolution: `$$k = ${rhs} \\times ${denom} = ${ans}$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER QUESTIONS (DOK 2) - 50 Items
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b7_eq_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Solve for $x$: $3x + 5 = 26$.",
    options: ["7", "8", "6", "9"],
    correctAnswer: "7",
    hint: "First subtract 5 from both sides, then divide by 3.",
    workedSolution: "$$3x = 26 - 5 = 21 \\implies x = \\frac{21}{3} = 7$$.",
    points: 1
  },
  {
    id: "q_b7_eq_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Look at the function machine below:<br/>${createBacktrackingSvg('n', '× 4', '- 7', '25')}<br/>Using inverse operation backtracking, find the original number $n$.`,
    options: ["8", "7", "9", "6"],
    correctAnswer: "8",
    hint: "Reverse the steps: Add 7 to 25, then divide by 4.",
    workedSolution: "$$4n - 7 = 25 \\implies 4n = 32 \\implies n = 8$$.",
    points: 1
  },
  {
    id: "q_b7_eq_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Find the value of $x$ from this balance scale in equilibrium:<br/>${createBalanceScaleSvg('2x + 4', 'x + 10')}`,
    options: ["6", "7", "5", "8"],
    correctAnswer: "6",
    hint: "Remove $x$ from both sides, then remove 4 units.",
    workedSolution: "$$2x + 4 = x + 10 \\implies 2x - x = 10 - 4 \\implies x = 6$$.",
    points: 1
  },
  {
    id: "q_b7_eq_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Solve for $y$: $2(y + 3) = 18$.",
    options: ["6", "7", "9", "5"],
    correctAnswer: "6",
    hint: "Divide both sides by 2 first: $y + 3 = 9$, then subtract 3.",
    workedSolution: "$$y + 3 = \\frac{18}{2} = 9 \\implies y = 9 - 3 = 6$$.",
    points: 1
  },
  {
    id: "q_b7_eq_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Solve: $5x - 8 = 3x + 6$.",
    options: ["7", "6", "8", "5"],
    correctAnswer: "7",
    hint: "Subtract $3x$ from both sides, then add 8.",
    workedSolution: "$$5x - 3x = 6 + 8 \\implies 2x = 14 \\implies x = 7$$.",
    points: 1
  }
];

// Fill remaining Medium items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const a = (i % 4) + 2;
    const b = (i % 6) + 3;
    const xAns = (i % 5) + 3;
    const c = a * xAns + b;
    mediumQuestions.push({
      id: `q_b7_eq_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Solve for $x$: $${a}x + ${b} = ${c}$.`,
      options: [
        `${xAns}`,
        `${xAns + 1}`,
        `${xAns - 1}`,
        `${xAns + 2}`
      ],
      correctAnswer: `${xAns}`,
      hint: `Subtract ${b} from both sides: ${c} - ${b} = ${c - b}, then divide by ${a}.`,
      workedSolution: `$$${a}x = ${c} - ${b} = ${c - b} \\implies x = \\frac{${c - b}}{${a}} = ${xAns}$$.`,
      points: 1
    });
  } else if (mod === 1) {
    const mul = (i % 3) + 3;
    const sub = (i % 5) + 2;
    const ans = (i % 6) + 4;
    const result = mul * ans - sub;
    mediumQuestions.push({
      id: `q_b7_eq_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `I think of a number, multiply it by ${mul}, and subtract ${sub}. If the result is ${result}, find the number.`,
      options: [
        `${ans}`,
        `${ans + 2}`,
        `${ans - 1}`,
        `${ans + 1}`
      ],
      correctAnswer: `${ans}`,
      hint: `Set up the equation $${mul}x - ${sub} = ${result}$. Add ${sub}, then divide by ${mul}.`,
      workedSolution: `$$${mul}x - ${sub} = ${result} \\implies ${mul}x = ${result + sub} \\implies x = ${ans}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    const m = (i % 3) + 2;
    const addVal = (i % 4) + 1;
    const xAns = (i % 5) + 2;
    const rhs = m * (xAns + addVal);
    mediumQuestions.push({
      id: `q_b7_eq_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Solve for $x$: $${m}(x + ${addVal}) = ${rhs}$.`,
      options: [
        `${xAns}`,
        `${xAns + 2}`,
        `${xAns - 1}`,
        `${xAns + 3}`
      ],
      correctAnswer: `${xAns}`,
      hint: `Divide both sides by ${m}: $x + ${addVal} = ${rhs / m}$, then subtract ${addVal}.`,
      workedSolution: `$$x + ${addVal} = \\frac{${rhs}}{${m}} = ${rhs / m} \\implies x = ${rhs / m} - ${addVal} = ${xAns}$$.`,
      points: 1
    });
  } else {
    const diff = (i % 5) + 2;
    const xAns = (i % 6) + 3;
    const leftConst = (i % 4) + 1;
    const rightConst = leftConst + diff * xAns;
    // (diff + 1)x + leftConst = x + rightConst  =>  diff * x = rightConst - leftConst => x = xAns
    mediumQuestions.push({
      id: `q_b7_eq_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Solve for $x$: $${diff + 1}x + ${leftConst} = x + ${rightConst}$.`,
      options: [
        `${xAns}`,
        `${xAns + 1}`,
        `${xAns - 2}`,
        `${xAns + 2}`
      ],
      correctAnswer: `${xAns}`,
      hint: `Subtract $x$ from both sides, then subtract ${leftConst}.`,
      workedSolution: `$$(${diff + 1} - 1)x = ${rightConst} - ${leftConst} \\implies ${diff}x = ${diff * xAns} \\implies x = ${xAns}$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 3. HARD TIER QUESTIONS (DOK 3) - 50 Items
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b7_eq_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Solve for $w$: $$\\frac{2w - 3}{4} = \\frac{w + 5}{3}$$.",
    options: ["14.5", "13", "14", "15.5"],
    correctAnswer: "14.5",
    hint: "Cross-multiply: $3(2w - 3) = 4(w + 5)$.",
    workedSolution: "$$6w - 9 = 4w + 20 \\implies 6w - 4w = 20 + 9 \\implies 2w = 29 \\implies w = 14.5$$.",
    points: 2
  },
  {
    id: "q_b7_eq_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "The sum of three consecutive integers is $72$. What is the largest of the three integers?",
    options: ["25", "24", "23", "26"],
    correctAnswer: "25",
    hint: "Let integers be $x, x + 1, x + 2$. Form equation: $3x + 3 = 72$.",
    workedSolution: "$$x + (x + 1) + (x + 2) = 72 \\implies 3x + 3 = 72 \\implies 3x = 69 \\implies x = 23$$\n$$\\text{Largest} = 23 + 2 = 25$$.",
    points: 2
  },
  {
    id: "q_b7_eq_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A father is 4 times as old as his son. In 14 years' time, the father will be only twice as old as his son. How old is the son now?",
    options: ["7 years", "6 years", "8 years", "9 years"],
    correctAnswer: "7 years",
    hint: "Let son's age be $x$, father's age is $4x$. In 14 years: $4x + 14 = 2(x + 14)$.",
    workedSolution: "$$4x + 14 = 2x + 28 \\implies 4x - 2x = 28 - 14 \\implies 2x = 14 \\implies x = 7\\text{ years}$$.",
    points: 2
  },
  {
    id: "q_b7_eq_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Solve for $x$: $3(2x - 4) - 2(x + 5) = 14$.",
    options: ["9", "8", "7", "10"],
    correctAnswer: "9",
    hint: "Expand both sets of brackets carefully: $6x - 12 - 2x - 10 = 14$.",
    workedSolution: "$$6x - 12 - 2x - 10 = 14 \\implies 4x - 22 = 14 \\implies 4x = 36 \\implies x = 9$$.",
    points: 2
  },
  {
    id: "q_b7_eq_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Solve for $m$: $$\\frac{m + 2}{3} - \\frac{m - 1}{4} = 1$$.",
    options: ["1", "2", "3", "4"],
    correctAnswer: "1",
    hint: "Multiply every term by the LCM (12): $4(m + 2) - 3(m - 1) = 12$.",
    workedSolution: "$$4(m + 2) - 3(m - 1) = 12 \\implies 4m + 8 - 3m + 3 = 12$$\n$$m + 11 = 12 \\implies m = 1$$.",
    points: 2
  }
];

// Fill remaining Hard items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    // Consecutive integers
    const start = (i % 10) + 12;
    const sum = 3 * start + 3;
    const largest = start + 2;
    hardQuestions.push({
      id: `q_b7_eq_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `The sum of three consecutive integers is ${sum}. Find the largest of the three integers.`,
      options: [
        `${largest}`,
        `${start}`,
        `${start + 1}`,
        `${largest + 1}`
      ],
      correctAnswer: `${largest}`,
      hint: `Let the numbers be $x, x + 1, x + 2$. Set up $3x + 3 = ${sum}$.`,
      workedSolution: `$$x + (x + 1) + (x + 2) = ${sum} \\implies 3x + 3 = ${sum} \\implies 3x = ${sum - 3} \\implies x = ${start}$$\n$$\\text{Largest} = ${start} + 2 = ${largest}$$.`,
      points: 2
    });
  } else if (mod === 1) {
    // Fractional linear equation: (x + a)/2 - (x - b)/3 = c  => LCM 6: 3(x + a) - 2(x - b) = 6c => x + 3a + 2b = 6c => x = 6c - 3a - 2b
    const a = (i % 3) + 1;
    const b = (i % 4) + 1;
    const xAns = (i % 5) + 3;
    const c = Math.ceil((xAns + 3 * a + 2 * b) / 6);
    // Adjusted: (2x - 1)/3 = (x + k)/2 => 2(2x - 1) = 3(x + k) => 4x - 2 = 3x + 3k => x = 3k + 2
    const k = (i % 6) + 1;
    const sol = 3 * k + 2;
    hardQuestions.push({
      id: `q_b7_eq_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Solve for $x$: $$\\frac{2x - 1}{3} = \\frac{x + ${k}}{2}$$.`,
      options: [
        `${sol}`,
        `${sol + 2}`,
        `${sol - 1}`,
        `${sol + 1}`
      ],
      correctAnswer: `${sol}`,
      hint: `Cross-multiply: $2(2x - 1) = 3(x + ${k})$. Group like terms.`,
      workedSolution: `$$2(2x - 1) = 3(x + ${k}) \\implies 4x - 2 = 3x + ${3 * k} \\implies 4x - 3x = ${3 * k} + 2 \\implies x = ${sol}$$.`,
      points: 2
    });
  } else if (mod === 2) {
    // Age word problem
    // A mother is 3 times as old as her son. In 10 years, she will be twice as old.
    // 3x + y = 2(x + y) => x = y
    const yearsLater = (i % 8) + 8;
    const sonAge = yearsLater;
    hardQuestions.push({
      id: `q_b7_eq_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `A mother is 3 times as old as her daughter. In ${yearsLater} years' time, the mother will be only twice as old as her daughter. How old is the daughter now?`,
      options: [
        `${sonAge} years`,
        `${sonAge + 2} years`,
        `${sonAge - 2} years`,
        `${sonAge + 4} years`
      ],
      correctAnswer: `${sonAge} years`,
      hint: `Let daughter's age be $x$, mother's age is $3x$. Equation: $3x + ${yearsLater} = 2(x + ${yearsLater})$.`,
      workedSolution: `$$3x + ${yearsLater} = 2x + ${2 * yearsLater} \\implies 3x - 2x = ${2 * yearsLater} - ${yearsLater} \\implies x = ${sonAge}\\text{ years}$$.`,
      points: 2
    });
  } else {
    // Multi-bracket expansion: a(x - b) - c(x + d) = e
    const a = 4;
    const b = (i % 3) + 1;
    const c = 2;
    const d = (i % 4) + 1;
    const xAns = (i % 6) + 4;
    // 4(x - b) - 2(x + d) = 4x - 4b - 2x - 2d = 2x - (4b + 2d)
    const rhs = 2 * xAns - (4 * b + 2 * d);
    hardQuestions.push({
      id: `q_b7_eq_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Solve for $x$: $4(x - ${b}) - 2(x + ${d}) = ${rhs}$.`,
      options: [
        `${xAns}`,
        `${xAns + 1}`,
        `${xAns - 2}`,
        `${xAns + 2}`
      ],
      correctAnswer: `${xAns}`,
      hint: `Expand brackets: $4x - ${4 * b} - 2x - ${2 * d} = ${rhs}$. Combine like terms.`,
      workedSolution: `$$4x - ${4 * b} - 2x - ${2 * d} = ${rhs} \\implies 2x - ${4 * b + 2 * d} = ${rhs} \\implies 2x = ${rhs + 4 * b + 2 * d} \\implies x = ${xAns}$$.`,
      points: 2
    });
  }
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB7EquationsPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 7 PRACTICE POOL: topic_equations_inequalities_graphs');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_equations_inequalities_graphs');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_equations_inequalities_graphs not found in Firestore.');
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
  const p1 = path.join(__dirname, 'payloads', 'topic_equations_inequalities_graphs.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_equations_inequalities_graphs.json');

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

  console.log('🎉 B7 Equations Question Bank expansion completed successfully.');
}

seedB7EquationsPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B7 equations pool:', err);
    process.exit(1);
  });
