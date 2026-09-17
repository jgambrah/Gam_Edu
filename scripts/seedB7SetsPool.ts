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

// Helper: Standard Neat Two-Set Venn Diagram SVG
const createVennSvg = (labelA: string, labelB: string, elemA: string[], elemBoth: string[], elemB: string[], elemOutside: string[] = []) => `
<svg viewBox='0 0 340 190' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'>
  <rect x='10' y='10' width='320' height='170' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/>
  <text x='25' y='32' font-size='14' font-weight='bold' fill='#0f172a'>U</text>
  <circle cx='125' cy='100' r='58' fill='#3b82f6' fill-opacity='0.18' stroke='#2563eb' stroke-width='2'/>
  <text x='85' y='42' font-size='13' font-weight='bold' fill='#1d4ed8'>${labelA}</text>
  <circle cx='215' cy='100' r='58' fill='#10b981' fill-opacity='0.18' stroke='#059669' stroke-width='2'/>
  <text x='235' y='42' font-size='13' font-weight='bold' fill='#047857'>${labelB}</text>
  <text x='95' y='105' font-size='12' font-weight='600' fill='#1e293b' text-anchor='middle'>${elemA.join(', ')}</text>
  <text x='170' y='105' font-size='12' font-weight='bold' fill='#b91c1c' text-anchor='middle'>${elemBoth.join(', ')}</text>
  <text x='245' y='105' font-size='12' font-weight='600' fill='#1e293b' text-anchor='middle'>${elemB.join(', ')}</text>
  <text x='290' y='165' font-size='11' fill='#64748b'>${elemOutside.join(', ')}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// -----------------------------------------------------------------------------
// 1. LOW TIER (DOK 1) - 50 ITEMS
// Direct recall & set notation: finite/infinite sets, membership symbols, empty set,
// basic intersection/union, subset definitions, cardinality.
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b7_set_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which of the following describes an infinite set?",
    options: [
      "{x : x is a counting number}",
      "{x : x is a month of the year}",
      "{x : x is a vowel in the English alphabet}",
      "{x : x is a factor of 12}"
    ],
    correctAnswer: "{x : x is a counting number}",
    hint: "An infinite set has elements that cannot be completely counted or listed to an end.",
    workedSolution: "Counting numbers $\\{1, 2, 3, 4, \\dots\\}$ continue endlessly, making it an infinite set.",
    points: 1
  },
  {
    id: "q_b7_set_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $P = \\{2, 3, 5, 7, 11\\}$, which of the following statements is true?",
    options: ["5 ∈ P", "9 ∈ P", "4 ∈ P", "11 ∉ P"],
    correctAnswer: "5 ∈ P",
    hint: "The symbol $\\in$ means 'is an element of'.",
    workedSolution: "5 is an element of set $P$, so $5 \\in P$ is the true statement.",
    points: 1
  },
  {
    id: "q_b7_set_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the number of elements in the empty (null) set $\\emptyset$?",
    options: ["0", "1", "undefined", "{0}"],
    correctAnswer: "0",
    hint: "The empty set contains no elements at all.",
    workedSolution: "By definition, the cardinality of the empty set $n(\\emptyset) = 0$.",
    points: 1
  },
  {
    id: "q_b7_set_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $A = \\{a, b, c\\}$ and $B = \\{b, c, d\\}$, find $A \\cap B$.",
    options: ["{b, c}", "{a, b, c, d}", "{a}", "{d}"],
    correctAnswer: "{b, c}",
    hint: "Intersection $\\cap$ denotes elements that belong to BOTH sets simultaneously.",
    workedSolution: "$$A \\cap B = \\{b, c\\}$$.",
    points: 1
  },
  {
    id: "q_b7_set_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $X = \\{1, 2, 3\\}$ and $Y = \\{3, 4, 5\\}$, what is $X \\cup Y$?",
    options: ["{1, 2, 3, 4, 5}", "{3}", "{1, 2, 4, 5}", "{1, 2, 3, 3, 4, 5}"],
    correctAnswer: "{1, 2, 3, 4, 5}",
    hint: "Union $\\cup$ combines all elements from both sets without repeating shared elements.",
    workedSolution: "$$X \\cup Y = \\{1, 2, 3, 4, 5\\}$$.",
    points: 1
  },
  {
    id: "q_b7_set_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which of the following is a subset of $S = \\{2, 4, 6, 8\\}$?",
    options: ["{2, 6}", "{2, 5}", "{8, 10}", "{0, 2}"],
    correctAnswer: "{2, 6}",
    hint: "Every member of a subset must belong to the parent set.",
    workedSolution: "Both 2 and 6 belong to $S$, so $\\{2, 6\\} \\subset S$.",
    points: 1
  },
  {
    id: "q_b7_set_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "How many subsets can be formed from a set with 3 elements?",
    options: ["8", "6", "9", "7"],
    correctAnswer: "8",
    hint: "Total number of subsets is given by $2^n$.",
    workedSolution: "$$\\text{Number of subsets} = 2^3 = 8$$.",
    points: 1
  },
  {
    id: "q_b7_set_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $n(A) = 7$, what is the cardinality of set $A$?",
    options: ["7", "14", "49", "128"],
    correctAnswer: "7",
    hint: "Cardinality $n(A)$ is simply the number of distinct elements in set $A$.",
    workedSolution: "The cardinality of set $A$ is 7.",
    points: 1
  },
  {
    id: "q_b7_set_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If two sets $P$ and $Q$ share no common elements ($P \\cap Q = \\emptyset$), they are called:",
    options: ["Disjoint sets", "Universal sets", "Equal sets", "Infinite sets"],
    correctAnswer: "Disjoint sets",
    hint: "Disjoint sets have no intersection.",
    workedSolution: "Sets with an empty intersection are disjoint sets.",
    points: 1
  },
  {
    id: "q_b7_set_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "List the elements of the set $M = \\{x : x \\text{ is a prime number less than } 10\\}$.",
    options: ["{2, 3, 5, 7}", "{1, 2, 3, 5, 7}", "{3, 5, 7, 9}", "{2, 3, 5, 7, 9}"],
    correctAnswer: "{2, 3, 5, 7}",
    hint: "Remember that 1 is not a prime number and 9 is composite.",
    workedSolution: "Prime numbers strictly below 10 are 2, 3, 5, and 7.",
    points: 1
  }
];

// Fill items 11 through 25: Cardinality of finite sets from descriptions
const finiteSetDefs = [
  { desc: "days of the week", n: 7 },
  { desc: "vowels in the English alphabet", n: 5 },
  { desc: "factors of 6", n: 4 },
  { desc: "factors of 12", n: 6 },
  { desc: "factors of 20", n: 6 },
  { desc: "even numbers between 1 and 15", n: 7 },
  { desc: "odd numbers between 2 and 18", n: 8 },
  { desc: "prime numbers less than 20", n: 8 },
  { desc: "letters in the word 'MATHEMATICS'", n: 8 },
  { desc: "letters in the word 'GHANA'", n: 4 },
  { desc: "months of the year beginning with 'J'", n: 3 },
  { desc: "positive integers less than 10", n: 9 },
  { desc: "factors of 18", n: 6 },
  { desc: "multiples of 5 less than 35", n: 6 },
  { desc: "perfect squares less than 50", n: 7 }
];

for (let i = 0; i < finiteSetDefs.length; i++) {
  const item = finiteSetDefs[i];
  const idx = 11 + i;
  const correct = `${item.n}`;
  const opt1 = `${item.n + 1}`;
  const opt2 = `${item.n - 1 > 0 ? item.n - 1 : item.n + 2}`;
  const opt3 = `${item.n + 3}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  lowQuestions.push({
    id: `q_b7_set_l${idx < 10 ? '0' + idx : idx}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: `What is the cardinality of the set of ${item.desc}?`,
    options: options,
    correctAnswer: correct,
    hint: `List all distinct elements and count them.`,
    workedSolution: `Listing the elements yields ${item.n} distinct elements, so $n(S) = ${item.n}$.`,
    points: 1
  });
}

// Fill items 26 through 50: Set builder to count / basic membership
for (let i = 26; i <= 50; i++) {
  const k = i - 20; // 6 to 30
  const count = k;
  const upper = k * 2;
  const correct = `${count}`;
  const opt1 = `${count + 1}`;
  const opt2 = `${count - 1}`;
  const opt3 = `${upper}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  lowQuestions.push({
    id: `q_b7_set_l${i < 10 ? '0' + i : i}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: `Find the number of elements in the set $E = \\{x : x \\text{ is an even integer and } 2 \\le x \\le ${upper}\\}$.`,
    options: options,
    correctAnswer: correct,
    hint: `The elements are $2, 4, 6, \\dots, ${upper}$. Divide the upper limit by 2.`,
    workedSolution: `$$n(E) = \\frac{${upper}}{2} = ${count}$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER (DOK 2) - 50 ITEMS
// Procedural intersection & union, two-set Venn diagram interpretation with SVGs,
// cardinality formula, universal complements.
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b7_set_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Study the Venn diagram below:<br/>${createVennSvg('A', 'B', ['1', '3'], ['5', '7'], ['2', '4'])}<br/>Find $n(A \\cup B)$.`,
    options: ["6", "2", "4", "5"],
    correctAnswer: "6",
    hint: "Count all distinct elements inside both circles $A$ and $B$.",
    workedSolution: "$$A \\cup B = \\{1, 2, 3, 4, 5, 7\\} \\implies n(A \\cup B) = 6$$.",
    points: 1
  },
  {
    id: "q_b7_set_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Study the Venn diagram below:<br/>${createVennSvg('P', 'Q', ['a', 'c'], ['b'], ['d', 'e'])}<br/>Which set represents $P \\cap Q$?`,
    options: ["{b}", "{a, c}", "{d, e}", "{a, b, c, d, e}"],
    correctAnswer: "{b}",
    hint: "Look at the overlapping middle region shared by both circles.",
    workedSolution: "The intersection contains only element $b$, so $P \\cap Q = \\{b\\}$.",
    points: 1
  },
  {
    id: "q_b7_set_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "If $n(A) = 15$, $n(B) = 12$, and $n(A \\cap B) = 5$, find $n(A \\cup B)$.",
    options: ["22", "27", "17", "32"],
    correctAnswer: "22",
    hint: "Apply the formula: $n(A \\cup B) = n(A) + n(B) - n(A \\cap B)$.",
    workedSolution: "$$n(A \\cup B) = 15 + 12 - 5 = 27 - 5 = 22$$.",
    points: 1
  },
  {
    id: "q_b7_set_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Given the Universal set $U = \\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\\}$ and $A = \\{2, 3, 5, 7\\}$, find $A'$ (the complement of $A$).",
    options: [
      "{1, 4, 6, 8, 9, 10}",
      "{4, 6, 8, 9, 10}",
      "{1, 2, 4, 6, 8, 10}",
      "{2, 3, 5, 7}"
    ],
    correctAnswer: "{1, 4, 6, 8, 9, 10}",
    hint: "List all elements in $U$ that are NOT in set $A$.",
    workedSolution: "$$A' = U \\setminus A = \\{1, 4, 6, 8, 9, 10\\}$$.",
    points: 1
  },
  {
    id: "q_b7_set_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "If $A = \\{x : 1 < x \\le 6, \\, x \\in \\mathbb{Z}\\}$ and $B = \\{x : 3 \\le x < 8, \\, x \\in \\mathbb{Z}\\}$, find $A \\cap B$.",
    options: ["{3, 4, 5, 6}", "{2, 3, 4, 5, 6}", "{3, 4, 5}", "{4, 5, 6}"],
    correctAnswer: "{3, 4, 5, 6}",
    hint: "List both sets: $A = \\{2, 3, 4, 5, 6\\}$ and $B = \\{3, 4, 5, 6, 7\\}$.",
    workedSolution: "$$A = \\{2, 3, 4, 5, 6\\}, \\ B = \\{3, 4, 5, 6, 7\\}$$\n$$A \\cap B = \\{3, 4, 5, 6\\}$$.",
    points: 1
  }
];

// Fill items 6 to 25: Reading SVG Venn diagrams with various element configurations
const svgVennConfigs = [
  { la: 'X', lb: 'Y', ea: ['2', '4'], eb: ['6'], eb2: ['8', '10'], eo: ['12'], q: 'X only', ans: '{2, 4}' },
  { la: 'M', lb: 'N', ea: ['p', 'q'], eb: ['r', 's'], eb2: ['t'], eo: ['u'], q: 'M ∩ N', ans: '{r, s}' },
  { la: 'A', lb: 'B', ea: ['3'], eb: ['6', '9'], eb2: ['12'], eo: ['15'], q: 'A ∪ B', ans: '{3, 6, 9, 12}' },
  { la: 'P', lb: 'Q', ea: ['1', '5'], eb: ['7'], eb2: ['9', '11'], eo: ['13'], q: 'Q only', ans: '{9, 11}' },
  { la: 'R', lb: 'S', ea: ['a'], eb: ['b', 'c'], eb2: ['d'], eo: ['e', 'f'], q: '(R ∪ S)\'', ans: '{e, f}' },
  { la: 'C', lb: 'D', ea: ['10', '20'], eb: ['30'], eb2: ['40', '50'], eo: ['60'], q: 'n(C ∩ D)', ans: '1' },
  { la: 'E', lb: 'F', ea: ['2', '4', '6'], eb: ['8'], eb2: ['10'], eo: ['12'], q: 'n(E ∪ F)', ans: '5' },
  { la: 'G', lb: 'H', ea: ['m'], eb: ['n'], eb2: ['p', 'q'], eo: ['r'], q: 'n(H only)', ans: '2' },
  { la: 'J', lb: 'K', ea: ['5', '10'], eb: ['15', '20'], eb2: ['25'], eo: ['30'], q: 'n(J)', ans: '4' },
  { la: 'V', lb: 'W', ea: ['1'], eb: ['2'], eb2: ['3', '4'], eo: ['5', '6'], q: 'n(U)', ans: '6' },
  { la: 'A', lb: 'B', ea: ['x', 'y'], eb: ['z'], eb2: ['w'], eo: ['v'], q: 'A ∩ B', ans: '{z}' },
  { la: 'P', lb: 'Q', ea: ['4', '8'], eb: ['12'], eb2: ['16', '20'], eo: ['24'], q: 'P only', ans: '{4, 8}' },
  { la: 'S', lb: 'T', ea: ['10'], eb: ['20', '30'], eb2: ['40'], eo: ['50'], q: 'S ∪ T', ans: '{10, 20, 30, 40}' },
  { la: 'K', lb: 'L', ea: ['7', '14'], eb: ['21'], eb2: ['28'], eo: ['35'], q: 'n(K ∪ L)', ans: '4' },
  { la: 'D', lb: 'E', ea: ['3', '6'], eb: ['9', '12'], eb2: ['15', '18'], eo: ['21'], q: 'n(D ∩ E)', ans: '2' },
  { la: 'F', lb: 'G', ea: ['1'], eb: ['3', '5'], eb2: ['7'], eo: ['9', '11'], q: '(F ∪ G)\'', ans: '{9, 11}' },
  { la: 'U1', lb: 'U2', ea: ['a', 'b'], eb: ['c'], eb2: ['d', 'e'], eo: ['f'], q: 'n(U1)', ans: '3' },
  { la: 'W1', lb: 'W2', ea: ['2'], eb: ['4', '6'], eb2: ['8'], eo: ['10'], q: 'n(W2)', ans: '3' },
  { la: 'X1', lb: 'X2', ea: ['100'], eb: ['200'], eb2: ['300'], eo: ['400'], q: 'n(X1 ∪ X2)', ans: '3' },
  { la: 'Y1', lb: 'Y2', ea: ['5', '15'], eb: ['25'], eb2: ['35', '45'], eo: ['55'], q: 'n(Y1 only)', ans: '2' }
];

for (let i = 0; i < svgVennConfigs.length; i++) {
  const item = svgVennConfigs[i];
  const idx = 6 + i;
  const svg = createVennSvg(item.la, item.lb, item.ea, item.eb, item.eb2, item.eo);
  const correct = item.ans;
  const opt1 = `{${item.eb.join(', ')}}`;
  const opt2 = `{${item.ea.join(', ')}}`;
  const opt3 = `{${item.eb2.join(', ')}}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);
  while (options.length < 4) {
    options.push(`{${i + 1}}`);
  }

  mediumQuestions.push({
    id: `q_b7_set_m${idx < 10 ? '0' + idx : idx}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Examine the Venn diagram below:<br/>${svg}<br/>Determine ${item.q}.`,
    options: options,
    correctAnswer: correct,
    hint: `Locate the relevant region in the Venn diagram for ${item.q}.`,
    workedSolution: `From the visual Venn diagram, the region corresponding to ${item.q} contains ${correct}.`,
    points: 1
  });
}

// Fill items 26 to 50: Cardinality formula calculations
for (let i = 26; i <= 50; i++) {
  const nA = 12 + (i % 8);
  const nB = 10 + (i % 6);
  const nBoth = 2 + (i % 4);
  const nUnion = nA + nB - nBoth;

  mediumQuestions.push({
    id: `q_b7_set_m${i < 10 ? '0' + i : i}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `In a junior high school class, $${nA}$ pupils like Mathematics and $${nB}$ like Science. If $${nBoth}$ pupils like both subjects, how many pupils like at least one of the two subjects?`,
    options: [
      `${nUnion}`,
      `${nA + nB}`,
      `${nUnion + 2}`,
      `${nA - nBoth}`
    ],
    correctAnswer: `${nUnion}`,
    hint: `Use the addition rule of cardinality: $n(M \\cup S) = n(M) + n(S) - n(M \\cap S)$.`,
    workedSolution: `$$n(M \\cup S) = ${nA} + ${nB} - ${nBoth} = ${nUnion}$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 3. HARD TIER (DOK 3) - 50 ITEMS
// Word problems with Venn diagram deduction, unknown intersection 'x',
// universal complements, multi-condition number sets.
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b7_set_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a class of $40$ students, $25$ play football, $20$ play volleyball, and $5$ play neither sport.<br/>${createVennSvg('Football', 'Volleyball', ['25 - x'], ['x'], ['20 - x'], ['5'])}<br/>Calculate how many students play BOTH sports.`,
    options: ["10", "15", "5", "12"],
    correctAnswer: "10",
    hint: "Set up equation: $(25 - x) + x + (20 - x) + 5 = 40$.",
    workedSolution: "$$45 - x + 5 = 40 \\implies 50 - x = 40 \\implies x = 10$$.",
    points: 2
  },
  {
    id: "q_b7_set_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Given $U = \\{x : 1 \\le x \\le 20, \\, x \\in \\mathbb{Z}\\}$, $P = \\{\\text{multiples of 3}\\}$ and $Q = \\{\\text{multiples of 4}\\}$. Find $n(P \\cup Q)'$.",
    options: ["10", "11", "9", "12"],
    correctAnswer: "10",
    hint: "Find $P = \\{3, 6, 9, 12, 15, 18\\}$ and $Q = \\{4, 8, 12, 16, 20\\}$. Determine $n(P \\cup Q)$ and subtract from 20.",
    workedSolution: "$$P \\cup Q = \\{3, 4, 6, 8, 9, 12, 15, 16, 18, 20\\} \\implies n(P \\cup Q) = 10$$\n$$n(P \\cup Q)' = 20 - 10 = 10$$.",
    points: 2
  },
  {
    id: "q_b7_set_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a survey of $60$ market traders, $35$ sell yam and $30$ sell plantain. If $x$ traders sell both and $5$ traders sell neither, find the number of traders who sell ONLY plantain.<br/>${createVennSvg('Yam', 'Plantain', ['35 - x'], ['x'], ['30 - x'], ['5'])}`,
    options: ["20", "10", "25", "15"],
    correctAnswer: "20",
    hint: "Find $x$ first from total traders, then compute $30 - x$.",
    workedSolution: "$$(35 - x) + x + (30 - x) + 5 = 60 \\implies 70 - x = 60 \\implies x = 10$$\n$$\\text{Plantain only} = 30 - 10 = 20$$.",
    points: 2
  },
  {
    id: "q_b7_set_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A set $S$ has $64$ total subsets. How many elements are in set $S$?",
    options: ["6", "5", "8", "7"],
    correctAnswer: "6",
    hint: "Solve $2^n = 64$.",
    workedSolution: "$$2^n = 64 = 2^6 \\implies n = 6$$.",
    points: 2
  },
  {
    id: "q_b7_set_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "If $n(U) = 50$, $n(A) = 28$, $n(B) = 24$, and $n(A' \\cap B') = 6$, find $n(A \\cap B)$.",
    options: ["8", "10", "6", "12"],
    correctAnswer: "8",
    hint: "$n(A' \\cap B') = n(A \\cup B)' = 6$. So $n(A \\cup B) = 50 - 6 = 44$.",
    workedSolution: "$$n(A \\cup B) = 50 - 6 = 44$$\n$$n(A \\cap B) = n(A) + n(B) - n(A \\cup B) = 28 + 24 - 44 = 52 - 44 = 8$$.",
    points: 2
  }
];

// Fill items 6 to 25: Deductive two-set word problems with SVGs
const wordVennScenarios = [
  { total: 50, a: 30, b: 25, neither: 5, la: 'Music', lb: 'Art' },
  { total: 60, a: 38, b: 32, neither: 6, la: 'Debate', lb: 'Drama' },
  { total: 45, a: 28, b: 22, neither: 5, la: 'Biology', lb: 'Chemistry' },
  { total: 70, a: 45, b: 35, neither: 10, la: 'Tennis', lb: 'Badminton' },
  { total: 55, a: 35, b: 25, neither: 7, la: 'French', lb: 'Spanish' },
  { total: 80, a: 50, b: 44, neither: 10, la: 'Physics', lb: 'Maths' },
  { total: 65, a: 40, b: 35, neither: 5, la: 'Football', lb: 'Athletics' },
  { total: 50, a: 32, b: 28, neither: 4, la: 'Reading', lb: 'Writing' },
  { total: 75, a: 48, b: 40, neither: 7, la: 'Gardening', lb: 'Cooking' },
  { total: 90, a: 55, b: 50, neither: 15, la: 'Swimming', lb: 'Cycling' },
  { total: 40, a: 26, b: 20, neither: 4, la: 'IT', lb: 'Business' },
  { total: 60, a: 36, b: 34, neither: 6, la: 'Hockey', lb: 'Cricket' },
  { total: 50, a: 30, b: 30, neither: 6, la: 'English', lb: 'History' },
  { total: 70, a: 42, b: 38, neither: 8, la: 'Singing', lb: 'Dancing' },
  { total: 85, a: 52, b: 46, neither: 11, la: 'Karate', lb: 'Judo' },
  { total: 60, a: 37, b: 31, neither: 4, la: 'Drawing', lb: 'Painting' },
  { total: 75, a: 46, b: 42, neither: 9, la: 'Coding', lb: 'Robotics' },
  { total: 55, a: 34, b: 28, neither: 5, la: 'Geography', lb: 'Economics' },
  { total: 80, a: 48, b: 44, neither: 8, la: 'Netball', lb: 'Handball' },
  { total: 65, a: 39, b: 35, neither: 7, la: 'Poetry', lb: 'Prose' }
];

for (let i = 0; i < wordVennScenarios.length; i++) {
  const item = wordVennScenarios[i];
  const idx = 6 + i;
  // total = (a - x) + x + (b - x) + neither = a + b - x + neither
  // x = a + b + neither - total
  const bothX = item.a + item.b + item.neither - item.total;
  const svg = createVennSvg(item.la, item.lb, [`${item.a} - x`], ['x'], [`${item.b} - x`], [`${item.neither}`]);

  const correct = `${bothX}`;
  const opt1 = `${bothX + 4}`;
  const opt2 = `${bothX - 3 > 0 ? bothX - 3 : bothX + 2}`;
  const opt3 = `${bothX + 6}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  hardQuestions.push({
    id: `q_b7_set_h${idx < 10 ? '0' + idx : idx}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a club of $${item.total}$ members, $${item.a}$ participate in ${item.la}, $${item.b}$ participate in ${item.lb}, and $${item.neither}$ participate in neither.<br/>${svg}<br/>How many members participate in BOTH activities?`,
    options: options,
    correctAnswer: correct,
    hint: `Use the relation: $(${item.a} - x) + x + (${item.b} - x) + ${item.neither} = ${item.total}$.`,
    workedSolution: `$$${item.a + item.b + item.neither} - x = ${item.total} \\implies x = ${item.a + item.b + item.neither} - ${item.total} = ${bothX}$$.`,
    points: 2
  });
}

// Fill items 26 to 50: Complex sets, subset inversions, and De Morgan logic
for (let i = 26; i <= 50; i++) {
  const nPower = (i % 5) + 4; // 4 to 8 elements
  const subsetsCount = Math.pow(2, nPower);
  const properSubsets = subsetsCount - 1;

  hardQuestions.push({
    id: `q_b7_set_h${i < 10 ? '0' + i : i}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `A non-empty finite set has exactly $${properSubsets}$ PROPER subsets. What is the number of elements in this set?`,
    options: [
      `${nPower}`,
      `${nPower + 1}`,
      `${nPower - 1}`,
      `${nPower * 2}`
    ],
    correctAnswer: `${nPower}`,
    hint: `The number of proper subsets is given by $2^n - 1$. Solve $2^n - 1 = ${properSubsets}$.`,
    workedSolution: `$$2^n - 1 = ${properSubsets} \\implies 2^n = ${subsetsCount} = 2^{${nPower}} \\implies n = ${nPower}$$.`,
    points: 2
  });
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB7SetsPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 7 PRACTICE POOL: topic_sets_and_venn_diagrams');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_sets_and_venn_diagrams');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_sets_and_venn_diagrams not found in Firestore.');
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
  const p1 = path.join(__dirname, 'payloads', 'topic_sets_and_venn_diagrams.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_sets_and_venn_diagrams.json');

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

  console.log('🎉 B7 Sets & Venn Diagrams Question Bank expansion completed successfully.');
}

seedB7SetsPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B7 sets pool:', err);
    process.exit(1);
  });
