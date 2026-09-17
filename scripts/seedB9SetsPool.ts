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

// 1. Compact Neat 2-Set Venn Diagram Helper
const create2SetSvg = (labelA: string, labelB: string, elemA: string, elemBoth: string, elemB: string, elemOutside: string = '0') => `
<svg viewBox='0 0 320 180' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'>
  <rect x='10' y='10' width='300' height='160' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/>
  <text x='24' y='30' font-size='13' font-weight='bold' fill='#0f172a'>U</text>
  <circle cx='120' cy='95' r='54' fill='#3b82f6' fill-opacity='0.18' stroke='#2563eb' stroke-width='2'/>
  <text x='85' y='38' font-size='12' font-weight='bold' fill='#1d4ed8'>${labelA}</text>
  <circle cx='200' cy='95' r='54' fill='#10b981' fill-opacity='0.18' stroke='#059669' stroke-width='2'/>
  <text x='225' y='38' font-size='12' font-weight='bold' fill='#047857'>${labelB}</text>
  <text x='90' y='100' font-size='12' font-weight='600' fill='#1e293b' text-anchor='middle'>${elemA}</text>
  <text x='160' y='100' font-size='12' font-weight='bold' fill='#dc2626' text-anchor='middle'>${elemBoth}</text>
  <text x='230' y='100' font-size='12' font-weight='600' fill='#1e293b' text-anchor='middle'>${elemB}</text>
  <text x='280' y='155' font-size='11' font-weight='600' fill='#64748b' text-anchor='middle'>${elemOutside}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Compact Neat 3-Set Venn Diagram Helper
const create3SetSvg = (centerVal: string) => `
<svg viewBox='0 0 320 210' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'>
  <rect x='10' y='10' width='300' height='190' rx='8' fill='#f8fafc' stroke='#334155' stroke-width='2'/>
  <text x='24' y='30' font-size='13' font-weight='bold' fill='#0f172a'>U</text>
  <circle cx='160' cy='80' r='48' fill='#3b82f6' fill-opacity='0.15' stroke='#2563eb' stroke-width='2'/>
  <text x='155' y='30' font-size='11' font-weight='bold' fill='#1d4ed8'>A</text>
  <circle cx='125' cy='130' r='48' fill='#10b981' fill-opacity='0.15' stroke='#059669' stroke-width='2'/>
  <text x='85' y='165' font-size='11' font-weight='bold' fill='#047857'>B</text>
  <circle cx='195' cy='130' r='48' fill='#f59e0b' fill-opacity='0.15' stroke='#d97706' stroke-width='2'/>
  <text x='235' y='165' font-size='11' font-weight='bold' fill='#b45309'>C</text>
  <text x='160' y='116' font-size='11' font-weight='bold' fill='#dc2626' text-anchor='middle'>${centerVal}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// -----------------------------------------------------------------------------
// 1. LOW TIER (DOK 1) - 50 ITEMS
// Real number hierarchy, disjoint rational/irrational sets, 3-set region identification.
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b9_set_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which of the following correct inclusions represents the hierarchy of number systems?",
    options: [
      "ℕ ⊂ 𝕎 ⊂ ℤ ⊂ ℚ ⊂ ℝ",
      "ℝ ⊂ ℚ ⊂ ℤ ⊂ 𝕎 ⊂ ℕ",
      "ℕ ⊂ ℤ ⊂ 𝕎 ⊂ ℚ ⊂ ℝ",
      "ℚ ⊂ ℤ ⊂ 𝕎 ⊂ ℕ ⊂ ℝ"
    ],
    correctAnswer: "ℕ ⊂ 𝕎 ⊂ ℤ ⊂ ℚ ⊂ ℝ",
    hint: "Natural numbers are contained in Whole numbers, which are inside Integers, Rationals, and Reals.",
    workedSolution: "Every natural number is a whole number, every whole number is an integer, every integer is rational, and all rationals belong to the Real continuum: $$\\mathbb{N} \\subset \\mathbb{W} \\subset \\mathbb{Z} \\subset \\mathbb{Q} \\subset \\mathbb{R}$$.",
    points: 1
  },
  {
    id: "q_b9_set_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which of the following is an irrational number ($\\mathbb{Q}'$)?",
    options: ["√7", "0.35", "√9", "-5/8"],
    correctAnswer: "√7",
    hint: "An irrational number cannot be expressed as a ratio of integers; non-perfect square roots are irrational.",
    workedSolution: "$\\sqrt{7}$ is a non-terminating, non-repeating radical, so $\\sqrt{7} \\in \\mathbb{Q}'$.",
    points: 1
  },
  {
    id: "q_b9_set_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: `In the 3-set Venn diagram below:<br/>${create3SetSvg('x')}<br/>What region does the letter $x$ represent?`,
    options: [
      "A ∩ B ∩ C",
      "A ∪ B ∪ C",
      "(A ∩ B) ∪ C",
      "A ∩ (B ∪ C)"
    ],
    correctAnswer: "A ∩ B ∩ C",
    hint: "Notice that region $x$ lies simultaneously inside all three circles $A$, $B$, and $C$.",
    workedSolution: "The central overlap shared by all three circles is the triple intersection $A \\cap B \\cap C$.",
    points: 1
  },
  {
    id: "q_b9_set_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is $\\mathbb{Q} \\cap \\mathbb{Q}'$ equal to in the Real Number System?",
    options: ["∅", "ℝ", "ℚ", "ℤ"],
    correctAnswer: "∅",
    hint: "Rational and irrational numbers are disjoint sets with zero elements in common.",
    workedSolution: "By definition, a number cannot be both rational and irrational: $$\\mathbb{Q} \\cap \\mathbb{Q}' = \\emptyset$$.",
    points: 1
  },
  {
    id: "q_b9_set_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which of the following numbers belongs to $\\mathbb{Z} \\setminus \\mathbb{N}$ (Integers but NOT Natural numbers)?",
    options: ["-4", "5", "1/2", "√3"],
    correctAnswer: "-4",
    hint: "Natural numbers are positive counting numbers $\\{1, 2, 3, \\dots\\}$.",
    workedSolution: "$-4$ is an integer ($\\in \\mathbb{Z}$) but is not a natural number ($\\notin \\mathbb{N}$).",
    points: 1
  },
  {
    id: "q_b9_set_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $A \\cap B = \\emptyset$ and $A \\cap C = \\emptyset$, then set $A$ is:",
    options: [
      "Disjoint from both B and C",
      "A subset of B and C",
      "Equal to B ∪ C",
      "The universal set"
    ],
    correctAnswer: "Disjoint from both B and C",
    hint: "An empty intersection indicates disjoint sets.",
    workedSolution: "Having no common elements with either set means $A$ is mutually disjoint from both $B$ and $C$.",
    points: 1
  },
  {
    id: "q_b9_set_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "The set of all recurring decimals belongs to which domain?",
    options: [
      "Rational Numbers (ℚ)",
      "Irrational Numbers (ℚ')",
      "Natural Numbers (ℕ)",
      "Integers (ℤ)"
    ],
    correctAnswer: "Rational Numbers (ℚ)",
    hint: "Every recurring decimal can be converted into a common fraction $\\frac{a}{b}$.",
    workedSolution: "Since any recurring decimal can be expressed as $\\frac{a}{b}$ where $a, b \\in \\mathbb{Z}, b \\ne 0$, it is rational ($\\mathbb{Q}$).",
    points: 1
  },
  {
    id: "q_b9_set_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $S = \\{x : x^2 = 25, \\, x \\in \\mathbb{N}\\}$, what is $S$?",
    options: ["{5}", "{-5, 5}", "{-5}", "{25}"],
    correctAnswer: "{5}",
    hint: "Natural numbers cannot be negative.",
    workedSolution: "$x^2 = 25 \\implies x = \\pm 5$. Because $x \\in \\mathbb{N}$, only $5$ is admissible. $S = \\{5\\}$.",
    points: 1
  },
  {
    id: "q_b9_set_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "How many disjoint regions are formed inside the universal set rectangle by 3 intersecting sets?",
    options: ["8", "6", "7", "9"],
    correctAnswer: "8",
    hint: "Count: 3 single-only, 3 double-only, 1 triple-intersection, and 1 outside region.",
    workedSolution: "Three intersecting sets produce $2^3 = 8$ mutually exclusive regions.",
    points: 1
  },
  {
    id: "q_b9_set_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which set contains the number zero ($0$)?",
    options: [
      "Whole Numbers (𝕎)",
      "Natural Numbers (ℕ)",
      "Positive Integers (ℤ⁺)",
      "Irrational Numbers (ℚ')"
    ],
    correctAnswer: "Whole Numbers (𝕎)",
    hint: "$\\mathbb{W} = \\{0, 1, 2, 3, \\dots\\}$.",
    workedSolution: "Zero is the first element of Whole numbers ($\\mathbb{W}$).",
    points: 1
  }
];

// Fill items 11 through 50: Classification of square roots and real number elements
for (let i = 11; i <= 50; i++) {
  const rootVal = i + 1;
  const sqrt = Math.sqrt(rootVal);
  const isPerfect = Number.isInteger(sqrt);
  const ans = isPerfect ? "Rational Numbers (ℚ)" : "Irrational Numbers (ℚ')";
  const opt1 = isPerfect ? "Irrational Numbers (ℚ')" : "Rational Numbers (ℚ)";

  lowQuestions.push({
    id: `q_b9_set_l${i < 10 ? '0' + i : i}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: `To which set of numbers does $\\sqrt{${rootVal}}$ belong when evaluated?`,
    options: [
      ans,
      opt1,
      "Empty Set (∅)",
      "Negative Integers (ℤ⁻)"
    ],
    correctAnswer: ans,
    hint: isPerfect ? `$\\sqrt{${rootVal}} = ${sqrt}$, which is an exact integer.` : `$\\sqrt{${rootVal}}$ is a non-terminating, non-repeating radical.`,
    workedSolution: isPerfect 
      ? `$$\\sqrt{${rootVal}} = ${sqrt} \\in \\mathbb{Q}$$ (Rational).`
      : `$$\\sqrt{${rootVal}}$$ cannot be written as a ratio of two integers, so it belongs to $\\mathbb{Q}'$ (Irrational).`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER (DOK 2) - 50 ITEMS
// Multi-variable 2-set linear equations, symmetric differences, composite operations,
// real continuum intervals.
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b9_set_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Study the Venn diagram below:<br/>${create2SetSvg('P', 'Q', '2x + 1', 'x', '3x - 2', '4')}<br/>If $n(U) = 39$, determine the value of $x$.`,
    options: ["6", "5", "7", "8"],
    correctAnswer: "6",
    hint: "Sum all four disjoint regions: $(2x + 1) + x + (3x - 2) + 4 = 39$.",
    workedSolution: "$$(2x + 1) + x + (3x - 2) + 4 = 39$$\n$$6x + 3 = 39 \\implies 6x = 36 \\implies x = 6$$.",
    points: 1
  },
  {
    id: "q_b9_set_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "If $n(A) = 30$, $n(B) = 25$, and $n(A \\cup B) = 45$, find the cardinality of the symmetric difference $(A \\setminus B) \\cup (B \\setminus A)$.",
    options: ["35", "10", "20", "25"],
    correctAnswer: "35",
    hint: "Find intersection first: $n(A \\cap B) = 30 + 25 - 45 = 10$. Symmetric difference $= 45 - 10$.",
    workedSolution: "$$n(A \\cap B) = 30 + 25 - 45 = 10$$\n$$\\text{Symmetric Difference} = n(A \\cup B) - n(A \\cap B) = 45 - 10 = 35$$.",
    points: 1
  },
  {
    id: "q_b9_set_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "In a class of 44 students, 30 study ICT and 28 study French. If every student studies at least one of the two subjects, how many study BOTH subjects?",
    options: ["14", "16", "12", "18"],
    correctAnswer: "14",
    hint: "Use $n(I \\cap F) = n(I) + n(F) - n(I \\cup F) = 30 + 28 - 44$.",
    workedSolution: "$$n(I \\cap F) = 30 + 28 - 44 = 58 - 44 = 14$$.",
    points: 1
  },
  {
    id: "q_b9_set_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `In the Venn diagram below:<br/>${create2SetSvg('M', 'N', '18', '7', '15', 'x')}<br/>If $n(U) = 50$, what is the value of $x$?`,
    options: ["10", "8", "12", "5"],
    correctAnswer: "10",
    hint: "Sum all elements and subtract from 50.",
    workedSolution: "$$18 + 7 + 15 + x = 50 \\implies 40 + x = 50 \\implies x = 10$$.",
    points: 1
  },
  {
    id: "q_b9_set_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "If $A = \\{x : x \\in \\mathbb{R}, \\, -2 \\le x < 5\\}$ and $B = \\{x : x \\in \\mathbb{R}, \\, 1 < x \\le 8\\}$, what is $A \\cap B$?",
    options: [
      "{x : 1 < x < 5}",
      "{x : -2 ≤ x ≤ 8}",
      "{x : 1 ≤ x < 5}",
      "{x : 5 < x ≤ 8}"
    ],
    correctAnswer: "{x : 1 < x < 5}",
    hint: "Find the overlapping continuum interval: lower bound is $> 1$ and upper bound is $< 5$.",
    workedSolution: "The intersection of $[-2, 5)$ and $(1, 8]$ is $(1, 5)$, which translates to $\\{x : 1 < x < 5\\}$.",
    points: 1
  }
];

// Fill items 6 to 25: 2-set algebraic equations with SVGs
for (let i = 6; i <= 25; i++) {
  const x = (i % 5) + 3; // 3 to 7
  const coeffA = (i % 2) + 2; // 2 or 3
  const onlyB = 12 + i;
  const outside = 4;
  const total = (coeffA * x) + x + onlyB + outside;

  mediumQuestions.push({
    id: `q_b9_set_m${i < 10 ? '0' + i : i}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `In the Venn diagram below, $n(U) = ${total}$:<br/>${create2SetSvg('A', 'B', `${coeffA}x`, 'x', `${onlyB}`, `${outside}`)}<br/>Find the value of $x$.`,
    options: [
      `${x}`,
      `${x + 2}`,
      `${x - 1 > 0 ? x - 1 : x + 3}`,
      `${x + 4}`
    ],
    correctAnswer: `${x}`,
    hint: `Sum the 4 regions: $${coeffA}x + x + ${onlyB} + ${outside} = ${total}$.`,
    workedSolution: `$$(${coeffA + 1})x + ${onlyB + outside} = ${total} \\implies ${coeffA + 1}x = ${total - (onlyB + outside)} \\implies x = ${x}$$.`,
    points: 1
  });
}

// Fill items 26 to 50: Symmetric differences and set operations
for (let i = 26; i <= 50; i++) {
  const nA = 24 + (i % 8);
  const nB = 22 + (i % 6);
  const both = 6 + (i % 4);
  const symDiff = (nA - both) + (nB - both);

  mediumQuestions.push({
    id: `q_b9_set_m${i < 10 ? '0' + i : i}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Given two sets $P$ and $Q$ with $n(P) = ${nA}$, $n(Q) = ${nB}$, and $n(P \\cap Q) = ${both}$, find $n(P \\Delta Q)$ (the symmetric difference).`,
    options: [
      `${symDiff}`,
      `${nA + nB}`,
      `${symDiff + both}`,
      `${nA + nB - both}`
    ],
    correctAnswer: `${symDiff}`,
    hint: `Symmetric difference $n(P \\Delta Q) = n(P \\cup Q) - n(P \\cap Q) = (${nA} + ${nB} - ${both}) - ${both}$.`,
    workedSolution: `$$n(P \\Delta Q) = (${nA} - ${both}) + (${nB} - ${both}) = ${nA - both} + ${nB - both} = ${symDiff}$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 3. HARD TIER (DOK 3) - 50 ITEMS
// 3-set survey analysis with central intersections, multi-variable systems with percentage
// distributions, quadratic set intersections.
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b9_set_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a survey of $100$ farmers:<br/>* $50$ rear Poultry ($P$)<br/>* $45$ rear Goats ($G$)<br/>* $40$ rear Cattle ($C$)<br/>* $15$ rear Poultry and Goats<br/>* $12$ rear Goats and Cattle<br/>* $10$ rear Poultry and Cattle<br/>* $5$ rear all three animals<br/>${create3SetSvg('5')}<br/>Calculate how many farmers rear NONE of these three animals.`,
    options: ["7", "12", "5", "10"],
    correctAnswer: "7",
    hint: "Use 3-set union formula: $n(P \\cup G \\cup C) = \\sum n(A) - \\sum n(A \\cap B) + n(A \\cap B \\cap C)$.",
    workedSolution: "$$n(P \\cup G \\cup C) = (50 + 45 + 40) - (15 + 12 + 10) + 5 = 135 - 37 + 5 = 103 - 10 = 93$$\n$$\\text{None} = 100 - 93 = 7$$.",
    points: 2
  },
  {
    id: "q_b9_set_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a school cohort of $112$ candidates, $52$ passed Core Mathematics, $44$ passed Science, and $3x$ passed neither subject. If $x$ passed BOTH subjects, find the number of candidates who passed Science ONLY.<br/>${create2SetSvg('Maths', 'Science', '52 - x', 'x', '44 - x', '3x')}`,
    options: ["36", "8", "44", "28"],
    correctAnswer: "36",
    hint: "Set up equation: $(52 - x) + x + (44 - x) + 3x = 112$. Solve for $x$, then calculate $44 - x$.",
    workedSolution: "$$96 + 2x = 112 \\implies 2x = 16 \\implies x = 8$$\n$$\\text{Science only} = 44 - 8 = 36$$.",
    points: 2
  },
  {
    id: "q_b9_set_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "In a sports academy of 60 athletes, 35 play Tennis, 30 play Basketball, and 28 play Football. 12 play Tennis and Basketball, 10 play Basketball and Football, and 11 play Tennis and Football. If 4 athletes play all three sports, how many play EXACTLY TWO sports?",
    options: ["21", "25", "18", "24"],
    correctAnswer: "21",
    hint: "Each double-only region is $(A \\cap B) - \\text{all three}$: $(12 - 4) + (10 - 4) + (11 - 4)$.",
    workedSolution: "$$\\text{Exactly two} = (12 - 4) + (10 - 4) + (11 - 4) = 8 + 6 + 7 = 21$$.",
    points: 2
  },
  {
    id: "q_b9_set_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Given universal set $U = \\mathbb{R}$, if $A = \\{x : x^2 - 4 = 0\\}$ and $B = \\{x : x^2 - 5x + 6 = 0\\}$, find the elements of $(A \\cup B) \\setminus (A \\cap B)$.",
    options: ["{-2, 3}", "{-2, 2, 3}", "{2}", "{3}"],
    correctAnswer: "{-2, 3}",
    hint: "Solve both quadratics: $A = \\{-2, 2\\}$ and $B = \\{2, 3\\}$. Intersection is $\\{2\\}$.",
    workedSolution: "$$A = \\{-2, 2\\}, \\quad B = \\{2, 3\\}$$\n$$A \\cup B = \\{-2, 2, 3\\}, \\quad A \\cap B = \\{2\\}$$\n$$(A \\cup B) \\setminus (A \\cap B) = \\{-2, 3\\}$$.",
    points: 2
  },
  {
    id: "q_b9_set_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a community library of $120$ readers, $70$ read Fiction, $60$ read Biographies, and $20$ read neither.<br/>${create2SetSvg('Fiction', 'Biography', '70 - x', 'x', '60 - x', '20')}<br/>What percentage of the readers read Fiction ONLY?`,
    options: ["33.33%", "40.00%", "25.00%", "50.00%"],
    correctAnswer: "33.33%",
    hint: "Find both: $70 + 60 - x + 20 = 120 \\implies 150 - x = 120 \\implies x = 30$. Fiction only $= 70 - 30 = 40$. Compute $\\frac{40}{120} \\times 100\\%$.",
    workedSolution: "$$150 - x = 120 \\implies x = 30$$\n$$\\text{Fiction only} = 70 - 30 = 40$$\n$$\\text{Percentage} = \\frac{40}{120} \\times 100\\% = 33\\frac{1}{3}\\% \\approx 33.33\\%$$.",
    points: 2
  }
];

// Fill remaining Hard items up to 50: Introductory 3-set calculations and multi-variable surveys
for (let i = 6; i <= 50; i++) {
  const triple = 3 + (i % 4); // 3 to 6
  const ab = 8 + (i % 3);
  const bc = 7 + (i % 3);
  const ac = 9 + (i % 3);
  const exactTwo = (ab - triple) + (bc - triple) + (ac - triple);

  hardQuestions.push({
    id: `q_b9_set_h${i < 10 ? '0' + i : i}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a senior three-set academic competition, pairwise intersections are $n(A \\cap B) = ${ab}$, $n(B \\cap C) = ${bc}$, and $n(A \\cap C) = ${ac}$. If exactly ${triple} candidates qualified in all three subjects, how many qualified in EXACTLY TWO subjects?<br/>${create3SetSvg(`${triple}`)}`,
    options: [
      `${exactTwo}`,
      `${exactTwo + 3}`,
      `${exactTwo - 2 > 0 ? exactTwo - 2 : exactTwo + 4}`,
      `${exactTwo + 6}`
    ],
    correctAnswer: `${exactTwo}`,
    hint: `Subtract the triple intersection $${triple}$ from each pairwise intersection and sum the results.`,
    workedSolution: `$$\\text{Exactly two} = (${ab} - ${triple}) + (${bc} - ${triple}) + (${ac} - ${triple}) = ${exactTwo}$$.`,
    points: 2
  });
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB9SetsPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 9 PRACTICE POOL: topic_sets_and_venn_diagrams');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_sets_and_venn_diagrams');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_sets_and_venn_diagrams not found in Firestore.');
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
  const p1 = path.join(__dirname, 'payloads', 'topic_sets_and_venn_diagrams.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_sets_and_venn_diagrams.json');

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

  console.log('🎉 B9 Sets & Venn Diagrams Question Bank expansion completed successfully.');
}

seedB9SetsPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B9 sets pool:', err);
    process.exit(1);
  });
