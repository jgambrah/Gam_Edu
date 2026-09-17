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

// Standard Neat Two-Set Venn Diagram Helper for B8
const createVennSvgB8 = (labelA: string, labelB: string, elemA: string, elemBoth: string, elemB: string, elemOutside: string = '0') => `
<svg viewBox='0 0 350 200' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'>
  <rect x='10' y='10' width='330' height='180' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/>
  <text x='25' y='32' font-size='14' font-weight='bold' fill='#0f172a'>U</text>
  <circle cx='130' cy='105' r='62' fill='#3b82f6' fill-opacity='0.18' stroke='#2563eb' stroke-width='2'/>
  <text x='85' y='38' font-size='13' font-weight='bold' fill='#1d4ed8'>${labelA}</text>
  <circle cx='220' cy='105' r='62' fill='#10b981' fill-opacity='0.18' stroke='#059669' stroke-width='2'/>
  <text x='235' y='38' font-size='13' font-weight='bold' fill='#047857'>${labelB}</text>
  <text x='95' y='110' font-size='13' font-weight='600' fill='#1e293b' text-anchor='middle'>${elemA}</text>
  <text x='175' y='110' font-size='13' font-weight='bold' fill='#dc2626' text-anchor='middle'>${elemBoth}</text>
  <text x='255' y='110' font-size='13' font-weight='600' fill='#1e293b' text-anchor='middle'>${elemB}</text>
  <text x='305' y='170' font-size='12' font-weight='600' fill='#64748b' text-anchor='middle'>${elemOutside}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// -----------------------------------------------------------------------------
// 1. LOW TIER (DOK 1) - 50 ITEMS
// Universal set complements, De Morgan representations, reading direct numerical
// region counts from Venn diagrams with SVGs, evaluating cardinality of complements.
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b8_set_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Study the Venn diagram below:<br/>${createVennSvgB8('n(M)', 'n(S)', '14', '6', '12', '8')}<br/>What is the total number of elements in the Universal set $U$?`,
    options: ["40", "32", "38", "34"],
    correctAnswer: "40",
    hint: "Sum all four disjoint regions: $\\text{Only } M + \\text{Both} + \\text{Only } S + \\text{Outside}$.",
    workedSolution: "$$n(U) = 14 + 6 + 12 + 8 = 40$$.",
    points: 1
  },
  {
    id: "q_b8_set_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Given $U = \\{1, 2, 3, 4, 5, 6, 7, 8\\}$ and $A = \\{2, 4, 6, 8\\}$, what is $n(A')$?",
    options: ["4", "8", "2", "6"],
    correctAnswer: "4",
    hint: "$A'$ contains the elements in $U$ that are not in $A$.",
    workedSolution: "$$A' = \\{1, 3, 5, 7\\} \\implies n(A') = 4$$.",
    points: 1
  },
  {
    id: "q_b8_set_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: `From the Venn diagram:<br/>${createVennSvgB8('A', 'B', '15', '5', '20', '10')}<br/>What is the value of $n(A \\cap B)$?`,
    options: ["5", "15", "20", "25"],
    correctAnswer: "5",
    hint: "Identify the number situated in the shared overlapping region.",
    workedSolution: "The center overlapping section represents the intersection: $n(A \\cap B) = 5$.",
    points: 1
  },
  {
    id: "q_b8_set_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "According to De Morgan's laws, $(A \\cup B)'$ is identical to which set?",
    options: ["A' ∩ B'", "A' ∪ B'", "(A ∩ B)'", "A ∩ B"],
    correctAnswer: "A' ∩ B'",
    hint: "The complement of a union is the intersection of the individual complements.",
    workedSolution: "$$(A \\cup B)' = A' \\cap B'$$.",
    points: 1
  },
  {
    id: "q_b8_set_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: `From the Venn diagram:<br/>${createVennSvgB8('P', 'Q', '18', '7', '11', '4')}<br/>What is the value of $n(P)$?`,
    options: ["25", "18", "7", "36"],
    correctAnswer: "25",
    hint: "Add the elements belonging ONLY to P and the intersection: $18 + 7$.",
    workedSolution: "$$n(P) = 18 + 7 = 25$$.",
    points: 1
  },
  {
    id: "q_b8_set_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $U = \\{x : 1 \\le x \\le 10, \\, x \\in \\mathbb{Z}\\}$ and $E = \\{\\text{even numbers}\\}$, find $E'$.",
    options: [
      "{1, 3, 5, 7, 9}",
      "{2, 4, 6, 8, 10}",
      "{1, 2, 3, 5, 7}",
      "{3, 5, 7, 9}"
    ],
    correctAnswer: "{1, 3, 5, 7, 9}",
    hint: "The complement of even numbers in this universal set is the odd numbers.",
    workedSolution: "$$E' = U \\setminus \\{2, 4, 6, 8, 10\\} = \\{1, 3, 5, 7, 9\\}$$.",
    points: 1
  },
  {
    id: "q_b8_set_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: `In the diagram below:<br/>${createVennSvgB8('X', 'Y', '10', '4', '16', '5')}<br/>Find $n(X \\cup Y)'$.`,
    options: ["5", "30", "35", "14"],
    correctAnswer: "5",
    hint: "$(X \\cup Y)'$ refers to the region outside both circles.",
    workedSolution: "The region outside both circle $X$ and circle $Y$ contains 5 elements.",
    points: 1
  },
  {
    id: "q_b8_set_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $n(U) = 50$ and $n(A) = 32$, what is $n(A')$?",
    options: ["18", "28", "82", "32"],
    correctAnswer: "18",
    hint: "$$n(A') = n(U) - n(A)$$.",
    workedSolution: "$$n(A') = 50 - 32 = 18$$.",
    points: 1
  },
  {
    id: "q_b8_set_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: `From the Venn diagram:<br/>${createVennSvgB8('A', 'B', '8', '3', '12', '2')}<br/>What is the number of elements belonging to ONLY set B?`,
    options: ["12", "15", "3", "8"],
    correctAnswer: "12",
    hint: "Look at the crescent region of B excluding the intersection.",
    workedSolution: "$$n(B \\setminus A) = 12$$.",
    points: 1
  },
  {
    id: "q_b8_set_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $A \\subset B$, what is $A \\cap B$ equal to?",
    options: ["A", "B", "U", "∅"],
    correctAnswer: "A",
    hint: "Since every element of $A$ is in $B$, their common intersection is all of $A$.",
    workedSolution: "When $A \\subset B$, $A \\cap B = A$.",
    points: 1
  }
];

// Fill items 11 through 50: Reading counts from SVG Venn diagrams & complement arithmetic
for (let i = 11; i <= 50; i++) {
  const onlyA = 10 + (i % 8);
  const both = 3 + (i % 5);
  const onlyB = 12 + (i % 7);
  const outside = 4 + (i % 4);
  const total = onlyA + both + onlyB + outside;

  if (i % 2 === 0) {
    lowQuestions.push({
      id: `q_b8_set_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Refer to the Venn diagram below:<br/>${createVennSvgB8('A', 'B', `${onlyA}`, `${both}`, `${onlyB}`, `${outside}`)}<br/>What is the total cardinality of the Universal set $n(U)$?`,
      options: [
        `${total}`,
        `${total - outside}`,
        `${total + 4}`,
        `${onlyA + onlyB}`
      ],
      correctAnswer: `${total}`,
      hint: `Sum all 4 mutually exclusive regions: $${onlyA} + ${both} + ${onlyB} + ${outside}$.`,
      workedSolution: `$$n(U) = ${onlyA} + ${both} + ${onlyB} + ${outside} = ${total}$$.`,
      points: 1
    });
  } else {
    const compA = onlyB + outside;
    lowQuestions.push({
      id: `q_b8_set_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Refer to the Venn diagram below:<br/>${createVennSvgB8('P', 'Q', `${onlyA}`, `${both}`, `${onlyB}`, `${outside}`)}<br/>What is the cardinality of $n(P')$?`,
      options: [
        `${compA}`,
        `${onlyA + both}`,
        `${onlyB}`,
        `${compA + 5}`
      ],
      correctAnswer: `${compA}`,
      hint: `Elements outside set P consist of only Q plus the outside region: $${onlyB} + ${outside}$.`,
      workedSolution: `$$n(P') = n(\\text{Q only}) + n(\\text{outside}) = ${onlyB} + ${outside} = ${compA}$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER (DOK 2) - 50 ITEMS
// Procedural algebraic regions ($x$ in intersection), symmetric differences,
// two-set surveys with known complements, elements in "only one set".
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b8_set_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `In a class of $45$ students, $28$ study History ($H$) and $22$ study Geography ($G$). Every student studies at least one of the two subjects.<br/>${createVennSvgB8('H', 'G', '28 - x', 'x', '22 - x', '0')}<br/>Find the number of students $x$ who study BOTH subjects.`,
    options: ["5", "8", "6", "10"],
    correctAnswer: "5",
    hint: "Set up the equation: $(28 - x) + x + (22 - x) = 45$.",
    workedSolution: "$$50 - x = 45 \\implies x = 50 - 45 = 5$$.",
    points: 1
  },
  {
    id: "q_b8_set_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Study the Venn diagram below:<br/>${createVennSvgB8('A', 'B', '20', '8', '14', '6')}<br/>Calculate the number of elements in $(A \\cup B)' + n(A \\cap B)$.`,
    options: ["14", "22", "12", "16"],
    correctAnswer: "14",
    hint: "$(A \\cup B)' = 6$ and $n(A \\cap B) = 8$. Add them together.",
    workedSolution: "$$6 + 8 = 14$$.",
    points: 1
  },
  {
    id: "q_b8_set_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "In a club of $50$ members, $30$ drink Tea, $25$ drink Coffee, and $7$ drink neither. How many members drink Tea ONLY?",
    options: ["18", "12", "20", "15"],
    correctAnswer: "18",
    hint: "Find both first: $30 + 25 - x + 7 = 50 \\implies 62 - x = 50 \\implies x = 12$. Tea only is $30 - 12$.",
    workedSolution: "$$\\text{Both } x = 30 + 25 + 7 - 50 = 12$$\n$$\\text{Tea only} = 30 - 12 = 18$$.",
    points: 1
  },
  {
    id: "q_b8_set_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `From the Venn diagram below:<br/>${createVennSvgB8('P', 'Q', '2x', 'x', '15', '5')}<br/>If $n(U) = 50$, find the value of $x$.`,
    options: ["10", "8", "12", "15"],
    correctAnswer: "10",
    hint: "Sum all four regions and equate to 50: $2x + x + 15 + 5 = 50$.",
    workedSolution: "$$3x + 20 = 50 \\implies 3x = 30 \\implies x = 10$$.",
    points: 1
  },
  {
    id: "q_b8_set_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "If $n(A \\setminus B) = 17$, $n(B \\setminus A) = 13$, and $n(A \\cap B) = 9$, find $n(A \\cup B)$.",
    options: ["39", "30", "48", "35"],
    correctAnswer: "39",
    hint: "$$n(A \\cup B) = n(A \\setminus B) + n(A \\cap B) + n(B \\setminus A)$$.",
    workedSolution: "$$n(A \\cup B) = 17 + 9 + 13 = 39$$.",
    points: 1
  }
];

// Fill items 6 to 25: Algebraic region equations with unknown x
for (let i = 6; i <= 25; i++) {
  const xVal = (i % 6) + 3; // 3 to 8
  const coeffA = (i % 3) + 1; // 1, 2, 3
  const onlyB = 10 + i;
  const outside = 5;
  const total = (coeffA * xVal) + xVal + onlyB + outside;

  mediumQuestions.push({
    id: `q_b8_set_m${i < 10 ? '0' + i : i}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `In the Venn diagram below, $n(U) = ${total}$:<br/>${createVennSvgB8('M', 'N', `${coeffA > 1 ? coeffA + 'x' : 'x'}`, 'x', `${onlyB}`, `${outside}`)}<br/>Find the numerical value of $x$.`,
    options: [
      `${xVal}`,
      `${xVal + 2}`,
      `${xVal - 1 > 0 ? xVal - 1 : xVal + 3}`,
      `${xVal + 4}`
    ],
    correctAnswer: `${xVal}`,
    hint: `Sum all 4 regions: $(${coeffA + 1})x + ${onlyB + outside} = ${total}$.`,
    workedSolution: `$$${coeffA + 1}x + ${onlyB + outside} = ${total} \\implies ${coeffA + 1}x = ${total - (onlyB + outside)} \\implies x = ${xVal}$$.`,
    points: 1
  });
}

// Fill items 26 to 50: Elements in "only one set" (symmetric difference) and surveys
for (let i = 26; i <= 50; i++) {
  const nA = 25 + (i % 8);
  const nB = 20 + (i % 7);
  const both = 5 + (i % 5);
  const symDiff = (nA - both) + (nB - both);

  mediumQuestions.push({
    id: `q_b8_set_m${i < 10 ? '0' + i : i}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `In a youth club of members who participate in either swimming or athletics, $${nA}$ swim and $${nB}$ run athletics. If $${both}$ members participate in BOTH sports, how many participate in EXACTLY ONE sport?<br/>${createVennSvgB8('Swim', 'Run', `${nA - both}`, `${both}`, `${nB - both}`, '0')}`,
    options: [
      `${symDiff}`,
      `${nA + nB}`,
      `${symDiff + both}`,
      `${nA + nB - both}`
    ],
    correctAnswer: `${symDiff}`,
    hint: `Calculate swimming only ($${nA} - ${both} = ${nA - both}$) and athletics only ($${nB} - ${both} = ${nB - both}$), then add them.`,
    workedSolution: `$$\\text{Swim only} = ${nA} - ${both} = ${nA - both}$$\n$$\\text{Run only} = ${nB} - ${both} = ${nB - both}$$\n$$\\text{Exactly One} = ${nA - both} + ${nB - both} = ${symDiff}$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 3. HARD TIER (DOK 3) - 50 ITEMS
// Multi-variable constraints (x and 2x), optimization of intersections,
// reverse deduction of universal sets from percentages, complex surveys.
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b8_set_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a cohort of $68$ students, $36$ play Football ($F$), $28$ play Basketball ($B$), and $2x$ play neither sport. If the number of students who play BOTH sports is $x$, find the value of $x$.<br/>${createVennSvgB8('F', 'B', '36 - x', 'x', '28 - x', '2x')}`,
    options: ["4", "6", "5", "8"],
    correctAnswer: "4",
    hint: "Set up the equation: $(36 - x) + x + (28 - x) + 2x = 68$.",
    workedSolution: "$$(36 - x) + x + (28 - x) + 2x = 68 \\implies 64 + x = 68 \\implies x = 4$$.",
    points: 2
  },
  {
    id: "q_b8_set_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In an examination of $75$ candidates, $48$ passed English ($E$) and $45$ passed Mathematics ($M$). If $6$ candidates failed both subjects, calculate how many candidates passed in ONLY ONE subject.<br/>${createVennSvgB8('E', 'M', '48 - x', 'x', '45 - x', '6')}`,
    options: ["45", "36", "24", "51"],
    correctAnswer: "45",
    hint: "Find $x$ first: $(48 - x) + x + (45 - x) + 6 = 75 \\implies 99 - x = 75 \\implies x = 24$. Only one subject is $(48 - 24) + (45 - 24)$.",
    workedSolution: "$$99 - x = 75 \\implies x = 24$$\n$$\\text{English only} = 48 - 24 = 24$$\n$$\\text{Maths only} = 45 - 24 = 21$$\n$$\\text{Passed only one} = 24 + 21 = 45$$.",
    points: 2
  },
  {
    id: "q_b8_set_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "In a market survey of 100 consumers, $70\\%$ buy Rice and $60\\%$ buy Beans. What is the MINIMUM possible number of consumers who buy BOTH Rice and Beans?",
    options: ["30", "40", "10", "20"],
    correctAnswer: "30",
    hint: "Minimum intersection occurs when the union is maximized at 100: $n(R \\cap B) \\ge n(R) + n(B) - n(U)$.",
    workedSolution: "$$\\min n(R \\cap B) = 70 + 60 - 100 = 130 - 100 = 30$$.",
    points: 2
  },
  {
    id: "q_b8_set_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a hospital ward of $50$ patients, $32$ were diagnosed with Malaria ($M$), $24$ with Typhoid ($T$), and $x$ with both. If every patient has at least one illness, what percentage of the patients have Malaria ONLY?<br/>${createVennSvgB8('M', 'T', '32 - x', 'x', '24 - x', '0')}`,
    options: ["52%", "48%", "64%", "36%"],
    correctAnswer: "52%",
    hint: "Find $x$: $32 + 24 - x = 50 \\implies x = 6$. Malaria only $= 32 - 6 = 26$. Percentage $= \\frac{26}{50} \\times 100\\%$.",
    workedSolution: "$$56 - x = 50 \\implies x = 6$$\n$$\\text{Malaria only} = 32 - 6 = 26$$\n$$\\text{Percentage} = \\frac{26}{50} \\times 100\\% = 52\\%$$.",
    points: 2
  },
  {
    id: "q_b8_set_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Given $n(U) = 80$, $n(A) = 45$, $n(B) = 40$, and $n(A' \\cap B') = 15$, find the cardinality of the symmetric difference $(A \\setminus B) \\cup (B \\setminus A)$.",
    options: ["45", "50", "20", "65"],
    correctAnswer: "45",
    hint: "$n(A \\cup B) = 80 - 15 = 65$. $n(A \\cap B) = 45 + 40 - 65 = 20$. Symmetric difference $= n(A \\cup B) - n(A \\cap B)$.",
    workedSolution: "$$n(A \\cup B) = 80 - 15 = 65$$\n$$n(A \\cap B) = 45 + 40 - 65 = 20$$\n$$\\text{Symmetric Difference} = 65 - 20 = 45$$.",
    points: 2
  }
];

// Fill items 6 to 25: Multi-variable constraint analysis with SVGs
const multiVarSurveys = [
  { tot: 70, a: 40, b: 35, multOut: 3, x: 5, la: 'Music', lb: 'Drama' },
  { tot: 80, a: 48, b: 40, multOut: 2, x: 8, la: 'Physics', lb: 'Chemistry' },
  { tot: 65, a: 38, b: 32, multOut: 2, x: 5, la: 'French', lb: 'Spanish' },
  { tot: 90, a: 55, b: 45, multOut: 2, x: 10, la: 'Football', lb: 'Volleyball' },
  { tot: 75, a: 45, b: 38, multOut: 3, x: 8, la: 'Biology', lb: 'Geography' },
  { tot: 85, a: 52, b: 42, multOut: 2, x: 9, la: 'Economics', lb: 'Government' },
  { tot: 60, a: 35, b: 30, multOut: 2, x: 5, la: 'Art', lb: 'Craft' },
  { tot: 95, a: 60, b: 50, multOut: 2, x: 15, la: 'Maths', lb: 'ICT' },
  { tot: 72, a: 44, b: 36, multOut: 2, x: 8, la: 'English', lb: 'Literature' },
  { tot: 88, a: 54, b: 44, multOut: 2, x: 10, la: 'History', lb: 'Civics' },
  { tot: 64, a: 38, b: 32, multOut: 2, x: 6, la: 'Agric', lb: 'HomeEcon' },
  { tot: 78, a: 46, b: 40, multOut: 2, x: 8, la: 'Tennis', lb: 'Squash' },
  { tot: 82, a: 50, b: 42, multOut: 2, x: 10, la: 'Cricket', lb: 'Hockey' },
  { tot: 68, a: 42, b: 34, multOut: 2, x: 8, la: 'Judo', lb: 'Karate' },
  { tot: 92, a: 58, b: 48, multOut: 2, x: 14, la: 'Coding', lb: 'Robotics' },
  { tot: 74, a: 44, b: 38, multOut: 2, x: 8, la: 'Reading', lb: 'Debating' },
  { tot: 86, a: 52, b: 44, multOut: 2, x: 10, la: 'Singing', lb: 'Dancing' },
  { tot: 66, a: 40, b: 32, multOut: 2, x: 6, la: 'Painting', lb: 'Sculpture' },
  { tot: 84, a: 50, b: 44, multOut: 2, x: 10, la: 'Sailing', lb: 'Rowing' },
  { tot: 76, a: 46, b: 38, multOut: 2, x: 8, la: 'Poetry', lb: 'Drama' }
];

for (let i = 0; i < multiVarSurveys.length; i++) {
  const item = multiVarSurveys[i];
  const idx = 6 + i;
  // equation: (a - x) + x + (b - x) + multOut*x = a + b + (multOut - 1)*x = tot
  // (multOut - 1)*x = tot - a - b
  // Let's ensure integer tot = a + b + (item.multOut - 1) * item.x
  const adjustedTot = item.a + item.b + (item.multOut - 1) * item.x;
  const svg = createVennSvgB8(item.la, item.lb, `${item.a} - x`, 'x', `${item.b} - x`, `${item.multOut}x`);

  const correct = `${item.x}`;
  const opt1 = `${item.x + 3}`;
  const opt2 = `${item.x - 2 > 0 ? item.x - 2 : item.x + 4}`;
  const opt3 = `${item.x + 5}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  hardQuestions.push({
    id: `q_b8_set_h${idx < 10 ? '0' + idx : idx}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a survey of $${adjustedTot}$ individuals, $${item.a}$ choose ${item.la}, $${item.b}$ choose ${item.lb}, $x$ choose both, and $${item.multOut}x$ choose neither.<br/>${svg}<br/>Find the number of individuals $x$ who choose both.`,
    options: options,
    correctAnswer: correct,
    hint: `Sum the 4 regions: $(${item.a} - x) + x + (${item.b} - x) + ${item.multOut}x = ${adjustedTot}$.`,
    workedSolution: `$$${item.a + item.b} + ${item.multOut - 1}x = ${adjustedTot} \\implies ${item.multOut - 1}x = ${adjustedTot - (item.a + item.b)} \\implies x = ${item.x}$$.`,
    points: 2
  });
}

// Fill items 26 to 50: Optimization and percentage/fractional survey analysis
for (let i = 26; i <= 50; i++) {
  const pctA = 60 + (i % 15); // 60% to 74%
  const pctB = 50 + (i % 20); // 50% to 69%
  const minOverlap = (pctA + pctB) - 100;

  hardQuestions.push({
    id: `q_b8_set_h${i < 10 ? '0' + i : i}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a consumer research study of $100$ shoppers, $${pctA}\\%$ purchase product A and $${pctB}\\%$ purchase product B. What is the MINIMUM possible percentage of shoppers who purchase BOTH products?`,
    options: [
      `${minOverlap}%`,
      `${minOverlap + 10}%`,
      `${minOverlap - 5 > 0 ? minOverlap - 5 : minOverlap + 15}%`,
      `${pctA - pctB > 0 ? pctA - pctB : 10}%`
    ],
    correctAnswer: `${minOverlap}%`,
    hint: `Use the minimum intersection inequality: $\\min n(A \\cap B) = n(A) + n(B) - 100$.`,
    workedSolution: `$$\\min n(A \\cap B) = ${pctA}\\% + ${pctB}\\% - 100\\% = ${minOverlap}\\%$$.`,
    points: 2
  });
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB8SetsPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 8 PRACTICE POOL: topic_sets_and_venn_diagrams');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_sets_and_venn_diagrams');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_sets_and_venn_diagrams not found in Firestore.');
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
  const p1 = path.join(__dirname, 'payloads', 'topic_sets_and_venn_diagrams.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_sets_and_venn_diagrams.json');

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

  console.log('🎉 B8 Sets & Venn Diagrams Question Bank expansion completed successfully.');
}

seedB8SetsPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B8 sets pool:', err);
    process.exit(1);
  });
