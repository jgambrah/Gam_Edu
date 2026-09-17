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

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// -----------------------------------------------------------------------------
// 1. LOW TIER (DOK 1) - 50 ITEMS
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b7_num_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which of the following numbers is a prime number?",
    options: ["1", "9", "2", "15"],
    correctAnswer: "2",
    hint: "A prime number has exactly two distinct factors: 1 and itself.",
    workedSolution: "2 has only two factors (1 and 2). 1 has only one factor, while 9 and 15 have more than two.",
    points: 1
  },
  {
    id: "q_b7_num_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Express $24$ as a product of prime factors in index notation.",
    options: ["2³ × 3", "2² × 6", "2 × 3³", "4 × 6"],
    correctAnswer: "2³ × 3",
    hint: "Divide successively by 2: 24 = 2 × 12 = 2 × 2 × 6...",
    workedSolution: "$$24 = 2 \\times 2 \\times 2 \\times 3 = 2^3 \\times 3$$.",
    points: 1
  },
  {
    id: "q_b7_num_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the place value of the digit 7 in the numeral $475,230$?",
    options: ["Ten-thousands", "Thousands", "Hundreds", "Millions"],
    correctAnswer: "Ten-thousands",
    hint: "Count places from right to left starting from units.",
    workedSolution: "In 475,230, 0 is units, 3 is tens, 2 is hundreds, 5 is thousands, and 7 is ten-thousands ($10^4$).",
    points: 1
  },
  {
    id: "q_b7_num_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert $12_{\\text{five}}$ to a base ten numeral.",
    options: ["7", "10", "12", "5"],
    correctAnswer: "7",
    hint: "Expand as $(1 \\times 5^1) + (2 \\times 5^0)$.",
    workedSolution: "$$12_{\\text{five}} = (1 \\times 5) + (2 \\times 1) = 5 + 2 = 7_{\\text{ten}}$$.",
    points: 1
  },
  {
    id: "q_b7_num_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert $101_{\\text{two}}$ to a base ten numeral.",
    options: ["5", "6", "3", "7"],
    correctAnswer: "5",
    hint: "Expand across powers of two: $1 \\times 2^2 + 0 \\times 2^1 + 1 \\times 2^0$.",
    workedSolution: "$$(1 \\times 4) + (0 \\times 2) + (1 \\times 1) = 4 + 0 + 1 = 5$$.",
    points: 1
  },
  {
    id: "q_b7_num_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which of the following numbers is divisible by 3?",
    options: ["124", "235", "342", "415"],
    correctAnswer: "342",
    hint: "A number is divisible by 3 if the sum of its digits is a multiple of 3.",
    workedSolution: "For 342: $3 + 4 + 2 = 9$. Since 9 is divisible by 3, 342 is divisible by 3.",
    points: 1
  },
  {
    id: "q_b7_num_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Find the HCF of $12$ and $18$.",
    options: ["6", "2", "3", "36"],
    correctAnswer: "6",
    hint: "List the factors of both numbers and choose the largest common one.",
    workedSolution: "Factors of 12: {1, 2, 3, 4, 6, 12}; Factors of 18: {1, 2, 3, 6, 9, 18}. The highest common factor is 6.",
    points: 1
  },
  {
    id: "q_b7_num_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the LCM of $4$ and $6$?",
    options: ["12", "24", "2", "18"],
    correctAnswer: "12",
    hint: "Identify the smallest positive multiple shared by both numbers.",
    workedSolution: "Multiples of 4: 4, 8, 12, 16... Multiples of 6: 6, 12, 18... Smallest shared is 12.",
    points: 1
  },
  {
    id: "q_b7_num_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "How many digits are used in the base five numeration system?",
    options: ["5", "4", "6", "10"],
    correctAnswer: "5",
    hint: "Count the digits {0, 1, 2, 3, 4}.",
    workedSolution: "Base five uses exactly 5 symbols: 0, 1, 2, 3, and 4.",
    points: 1
  },
  {
    id: "q_b7_num_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Write $36$ as a product of prime factors.",
    options: ["2² × 3²", "4 × 9", "2³ × 3", "6²"],
    correctAnswer: "2² × 3²",
    hint: "All factors must be prime numbers: 2 and 3.",
    workedSolution: "$$36 = 4 \\times 9 = 2^2 \\times 3^2$$.",
    points: 1
  }
];

// Rich, varied WAEC DOK 1 generator for items 11 through 50
const lowTemplates = [
  // Type A: Place value identification
  (idx: number) => {
    const digits = [3, 4, 6, 8];
    const d = digits[idx % digits.length];
    const places = [
      { name: "Thousands", val: d * 1000, str: `4${d},210`, col: "thousands" },
      { name: "Hundreds", val: d * 100, str: `12,${d}40`, col: "hundreds" },
      { name: "Tens", val: d * 10, str: `53,1${d}5`, col: "tens" },
      { name: "Ten-thousands", val: d * 10000, str: `${d}2,450`, col: "ten-thousands" }
    ];
    const p = places[idx % places.length];
    return {
      id: `q_b7_num_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `What is the place value of the digit ${d} in the numeral $${p.str}$?`,
      options: [p.name, "Units", "Millions", p.name === "Tens" ? "Hundreds" : "Tens"],
      correctAnswer: p.name,
      hint: `Count the column position from the rightmost unit digit.`,
      workedSolution: `In $${p.str}$, the digit ${d} occupies the ${p.col} position ($${p.name}$).`,
      points: 1
    };
  },
  // Type B: Prime factor power
  (idx: number) => {
    const nums = [
      { n: 16, exp: "2⁴", opts: ["2⁴", "4²", "2³", "2⁵"] },
      { n: 27, exp: "3³", opts: ["3³", "3²", "3⁴", "9²"] },
      { n: 50, exp: "2 × 5²", opts: ["2 × 5²", "2² × 5", "10 × 5", "5³"] },
      { n: 45, exp: "3² × 5", opts: ["3² × 5", "9 × 5", "3 × 5²", "3³ × 5"] }
    ];
    const item = nums[idx % nums.length];
    return {
      id: `q_b7_num_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Express $${item.n}$ as a product of prime factors in index notation.`,
      options: item.opts,
      correctAnswer: item.exp,
      hint: `Break down ${item.n} into prime divisors only.`,
      workedSolution: `Prime factorization of $${item.n}$: $${item.exp}$.`,
      points: 1
    };
  },
  // Type C: Base conversion simple
  (idx: number) => {
    const pairs = [
      { base5: "21", base10: "11" },
      { base5: "32", base10: "17" },
      { base5: "40", base10: "20" },
      { base5: "14", base10: "9" },
      { base2: "110", base10: "6" },
      { base2: "111", base10: "7" },
      { base2: "1000", base10: "8" },
      { base2: "1010", base10: "10" }
    ];
    const p = pairs[idx % pairs.length];
    if ('base5' in p) {
      const d1 = Number(p.base10) + 2;
      const d2 = Number(p.base10) - 2;
      const d3 = Number(p.base10) + 5;
      return {
        id: `q_b7_num_l${idx < 10 ? '0' + idx : idx}`,
        difficulty: "low",
        dokLevel: 1,
        prompt: `Convert $${p.base5}_{\\text{five}}$ to base ten.`,
        options: [p.base10, String(d1), String(d2), String(d3)],
        correctAnswer: p.base10,
        hint: `Expand using powers of 5: $(d_1 \\times 5^1) + (d_0 \\times 5^0)$.`,
        workedSolution: `$$${p.base5}_{\\text{five}} = (${p.base5[0]} \\times 5) + (${p.base5[1]} \\times 1) = ${p.base10}_{\\text{ten}}$$.`,
        points: 1
      };
    } else {
      const d1 = Number(p.base10) + 1;
      const d2 = Number(p.base10) - 1;
      const d3 = Number(p.base10) + 3;
      return {
        id: `q_b7_num_l${idx < 10 ? '0' + idx : idx}`,
        difficulty: "low",
        dokLevel: 1,
        prompt: `Convert binary number $${p.base2}_{\\text{two}}$ to base ten.`,
        options: [p.base10, String(d1), String(d2), String(d3)],
        correctAnswer: p.base10,
        hint: `Expand across powers of 2.`,
        workedSolution: `$${p.base2}_{\\text{two}} = ${p.base10}_{\\text{ten}}$.`,
        points: 1
      };
    }
  },
  // Type D: Divisibility
  (idx: number) => {
    const divs = [
      { divBy: 5, valid: "345", opts: ["345", "342", "341", "344"], reason: "ends in 5" },
      { divBy: 2, valid: "894", opts: ["894", "893", "891", "895"], reason: "ends in even digit 4" },
      { divBy: 10, valid: "1,290", opts: ["1,290", "1,295", "1,292", "1,298"], reason: "ends in 0" },
      { divBy: 3, valid: "513", opts: ["513", "512", "514", "515"], reason: "sum of digits $5 + 1 + 3 = 9$, which is divisible by 3" }
    ];
    const d = divs[idx % divs.length];
    return {
      id: `q_b7_num_l${idx < 10 ? '0' + idx : idx}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Which of the following numbers is divisible by ${d.divBy}?`,
      options: d.opts,
      correctAnswer: d.valid,
      hint: `Apply the divisibility rule for ${d.divBy}.`,
      workedSolution: `$${d.valid}$ is divisible by ${d.divBy} because it ${d.reason}.`,
      points: 1
    };
  }
];

for (let i = 11; i <= 50; i++) {
  const templateFn = lowTemplates[(i - 11) % lowTemplates.length];
  lowQuestions.push(templateFn(i));
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER (DOK 2) - 50 ITEMS
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b7_num_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Convert $73_{\\text{ten}}$ to a base five numeral.",
    options: ["243_five", "241_five", "143_five", "223_five"],
    correctAnswer: "243_five",
    hint: "Divide 73 successively by 5 and write remainders from bottom to top.",
    workedSolution: "$$73 \\div 5 = 14 \\text{ R } 3$$\n$$14 \\div 5 = 2 \\text{ R } 4$$\n$$2 \\div 5 = 0 \\text{ R } 2$$\nResult: $243_{\\text{five}}$.",
    points: 1
  },
  {
    id: "q_b7_num_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "If $23_x = 11_{\\text{ten}}$, find the value of base $x$.",
    options: ["4", "5", "6", "3"],
    correctAnswer: "4",
    hint: "Expand $2x + 3 = 11$ and solve for $x$.",
    workedSolution: "$$2(x) + 3 = 11 \\implies 2x = 8 \\implies x = 4$$.",
    points: 1
  },
  {
    id: "q_b7_num_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Evaluate in base two: $110_{\\text{two}} + 11_{\\text{two}}$.",
    options: ["1001_two", "1010_two", "111_two", "1000_two"],
    correctAnswer: "1001_two",
    hint: "In binary addition, $1 + 1 = 10_2$ (write 0, carry 1).",
    workedSolution: "110_two (6) + 11_two (3) = 9_ten = 1001_two.",
    points: 1
  },
  {
    id: "q_b7_num_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Determine the HCF of $72$, $108$, and $144$.",
    options: ["36", "18", "12", "72"],
    correctAnswer: "36",
    hint: "Decompose each into prime powers and take minimum exponents.",
    workedSolution: "$$72 = 2^3 \\times 3^2, \\ 108 = 2^2 \\times 3^3, \\ 144 = 2^4 \\times 3^2$$\n$$\\text{HCF} = 2^2 \\times 3^2 = 4 \\times 9 = 36$$.",
    points: 1
  },
  {
    id: "q_b7_num_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Find the smallest number that is exactly divisible by $12$, $15$, and $20$.",
    options: ["60", "120", "30", "180"],
    correctAnswer: "60",
    hint: "The smallest common multiple is the LCM.",
    workedSolution: "$$12 = 2^2 \\times 3, \\ 15 = 3 \\times 5, \\ 20 = 2^2 \\times 5$$\n$$\\text{LCM} = 2^2 \\times 3 \\times 5 = 4 \\times 15 = 60$$.",
    points: 1
  }
];

// Rich generator for Medium items 6 through 50
const mediumGenerators = [
  // Type 1: Binary to decimal & decimal to binary
  (idx: number) => {
    const val = 25 + idx;
    const binStr = val.toString(2);
    return {
      id: `q_b7_num_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Convert $${val}_{\\text{ten}}$ to binary (base two).`,
      options: [
        `${binStr}_two`,
        `${(val + 1).toString(2)}_two`,
        `${(val - 1).toString(2)}_two`,
        `${(val + 2).toString(2)}_two`
      ],
      correctAnswer: `${binStr}_two`,
      hint: `Divide by 2 successively, recording remainders from bottom to top.`,
      workedSolution: `Successive division of $${val}$ by 2 yields remainders producing $${binStr}_2$.`,
      points: 1
    };
  },
  // Type 2: Base five conversion (10 to 5)
  (idx: number) => {
    const val = 30 + (idx * 3);
    const toBase5 = (n: number) => {
      let q = n, rems = '';
      while (q > 0) {
        rems = (q % 5) + rems;
        q = Math.floor(q / 5);
      }
      return rems;
    };
    const b5 = toBase5(val);
    return {
      id: `q_b7_num_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Convert $${val}_{\\text{ten}}$ to base five numeral.`,
      options: [
        `${b5}_five`,
        `${toBase5(val + 2)}_five`,
        `${toBase5(val - 3)}_five`,
        `${toBase5(val + 5)}_five`
      ],
      correctAnswer: `${b5}_five`,
      hint: `Divide ${val} by 5 repeatedly and collect remainders.`,
      workedSolution: `Dividing $${val}$ repeatedly by 5 gives $${b5}_{\\text{five}}$.`,
      points: 1
    };
  },
  // Type 3: Linear base equation: a*x + b = c
  (idx: number) => {
    const bases = [5, 6, 7, 8];
    const targetBase = bases[idx % bases.length];
    const a = 2 + (idx % 3);
    const b = 1 + (idx % 4);
    const decVal = a * targetBase + b;
    return {
      id: `q_b7_num_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `If $${a}${b}_x = ${decVal}_{\\text{ten}}$, find the value of the base $x$.`,
      options: [String(targetBase), String(targetBase + 1), String(targetBase - 1), String(targetBase + 2)],
      correctAnswer: String(targetBase),
      hint: `Expand in powers of $x$: $${a}x + ${b} = ${decVal}$.`,
      workedSolution: `$$${a}x + ${b} = ${decVal} \\implies ${a}x = ${decVal - b} \\implies x = ${targetBase}$$.`,
      points: 1
    };
  },
  // Type 4: HCF / LCM calculation
  (idx: number) => {
    const pairs = [
      { a: 16, b: 24, hcf: 8, lcm: 48 },
      { a: 20, b: 30, hcf: 10, lcm: 60 },
      { a: 18, b: 27, hcf: 9, lcm: 54 },
      { a: 24, b: 36, hcf: 12, lcm: 72 },
      { a: 30, b: 45, hcf: 15, lcm: 90 }
    ];
    const p = pairs[idx % pairs.length];
    const isHcf = idx % 2 === 0;
    if (isHcf) {
      return {
        id: `q_b7_num_m${idx < 10 ? '0' + idx : idx}`,
        difficulty: "medium",
        dokLevel: 2,
        prompt: `Find the Highest Common Factor (HCF) of $${p.a}$ and $${p.b}$.`,
        options: [String(p.hcf), String(p.hcf / 2), String(p.hcf * 2), String(p.lcm)],
        correctAnswer: String(p.hcf),
        hint: `Use prime factorization and take the product of lowest shared prime powers.`,
        workedSolution: `$$${p.a} = ${p.a / p.hcf} \\times ${p.hcf}, \\ ${p.b} = ${p.b / p.hcf} \\times ${p.hcf}$$. Shared divisor: $\\text{HCF} = ${p.hcf}$.`,
        points: 1
      };
    } else {
      return {
        id: `q_b7_num_m${idx < 10 ? '0' + idx : idx}`,
        difficulty: "medium",
        dokLevel: 2,
        prompt: `Find the Lowest Common Multiple (LCM) of $${p.a}$ and $${p.b}$.`,
        options: [String(p.lcm), String(p.lcm * 2), String(p.hcf), String(p.lcm - 12)],
        correctAnswer: String(p.lcm),
        hint: `Use $\\text{LCM}(A, B) = \\frac{A \\times B}{\\text{HCF}(A, B)}$.`,
        workedSolution: `$$\\text{LCM}(${p.a}, ${p.b}) = \\frac{${p.a} \\times ${p.b}}{${p.hcf}} = ${p.lcm}$$.`,
        points: 1
      };
    }
  }
];

for (let i = 6; i <= 50; i++) {
  const genFn = mediumGenerators[(i - 6) % mediumGenerators.length];
  mediumQuestions.push(genFn(i));
}

// -----------------------------------------------------------------------------
// 3. HARD TIER (DOK 3) - 50 ITEMS
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b7_num_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Three church bells toll at intervals of $9$, $12$, and $15\\text{ minutes}$ respectively. If they toll together at $6:00\\text{ a.m.}$, at what time will they next toll together?",
    options: ["9:00 a.m.", "8:30 a.m.", "7:30 a.m.", "10:00 a.m."],
    correctAnswer: "9:00 a.m.",
    hint: "Find the LCM of 9, 12, and 15, then convert minutes to hours.",
    workedSolution: "$$9 = 3^2, \\ 12 = 2^2 \\times 3, \\ 15 = 3 \\times 5$$\n$$\\text{LCM} = 2^2 \\times 3^2 \\times 5 = 4 \\times 9 \\times 5 = 180\\text{ minutes} = 3\\text{ hours}$$\n$$6:00\\text{ a.m.} + 3\\text{ hours} = 9:00\\text{ a.m.}$$.",
    points: 2
  },
  {
    id: "q_b7_num_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Evaluate $134_{\\text{five}} + 1011_{\\text{two}}$ and express the final answer in base ten.",
    options: ["55", "52", "44", "49"],
    correctAnswer: "55",
    hint: "Convert both addends to base ten first, then sum.",
    workedSolution: "$$134_{\\text{five}} = (1 \\times 25) + (3 \\times 5) + (4 \\times 1) = 25 + 15 + 4 = 44_{10}$$\n$$1011_{\\text{two}} = 8 + 0 + 2 + 1 = 11_{10}$$\n$$\\text{Sum} = 44 + 11 = 55$$.",
    points: 2
  },
  {
    id: "q_b7_num_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "If $213_x = 58_{\\text{ten}}$, find the positive integer base $x$.",
    options: ["5", "6", "4", "7"],
    correctAnswer: "5",
    hint: "Set up polynomial $2x^2 + x + 3 = 58$ and factorize.",
    workedSolution: "$$2x^2 + x + 3 = 58 \\implies 2x^2 + x - 55 = 0$$\n$$(2x + 11)(x - 5) = 0 \\implies x = 5$$ (since base must be positive integer $> 3$).",
    points: 2
  },
  {
    id: "q_b7_num_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "The product of two numbers is $2,160$ and their HCF is $12$. Find their LCM.",
    options: ["180", "120", "240", "360"],
    correctAnswer: "180",
    hint: "Apply the identity: $\\text{HCF} \\times \\text{LCM} = A \\times B$.",
    workedSolution: "$$12 \\times \\text{LCM} = 2,160 \\implies \\text{LCM} = \\frac{2160}{12} = 180$$.",
    points: 2
  },
  {
    id: "q_b7_num_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Find the smallest whole number by which $180$ must be multiplied so that the product becomes a perfect square.",
    options: ["5", "2", "3", "10"],
    correctAnswer: "5",
    hint: "Prime factorize 180 and find which prime factor has an odd exponent.",
    workedSolution: "$$180 = 2^2 \\times 3^2 \\times 5^1$$. The exponent of 5 is odd (1). To make it even, multiply by 5.",
    points: 2
  }
];

// Rich, WAEC-calibrated DOK 3 generator for items 6 through 50
const hardGenerators = [
  // Type 1: Simultaneous interval modeling (traffic lights, runners, alarms)
  (idx: number) => {
    const t1 = 6 + (idx % 5) * 2;
    const t2 = t1 + 4;
    const ansLcm = lcm(t1, t2);
    const d1 = ansLcm * 2;
    const d2 = ansLcm - t1;
    const d3 = t1 * t2;
    return {
      id: `q_b7_num_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Two automated factory sirens sound every $${t1}\\text{ seconds}$ and $${t2}\\text{ seconds}$ respectively. If they sound together, after how many seconds will they sound together again?`,
      options: [String(ansLcm), String(d1), String(d2), String(d3)],
      correctAnswer: String(ansLcm),
      hint: `The next simultaneous synchronization occurs at the Lowest Common Multiple (LCM) of $${t1}$ and $${t2}$.`,
      workedSolution: `$$\\text{LCM}(${t1}, ${t2}) = ${ansLcm}\\text{ seconds}$$.`,
      points: 2
    };
  },
  // Type 2: Multi-base expression evaluation
  (idx: number) => {
    const b5Val = 10 + (idx % 15);
    // convert b5Val to base 5
    const toB5 = (n: number) => {
      let q = n, s = '';
      while (q > 0) { s = (q % 5) + s; q = Math.floor(q / 5); }
      return s;
    };
    const b5Str = toB5(b5Val);
    const b2Val = 5 + (idx % 6);
    const b2Str = b2Val.toString(2);
    const totalDec = b5Val + b2Val;
    return {
      id: `q_b7_num_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Evaluate $${b5Str}_{\\text{five}} + ${b2Str}_{\\text{two}}$ and express the result in base ten.`,
      options: [String(totalDec), String(totalDec + 2), String(totalDec - 3), String(totalDec + 5)],
      correctAnswer: String(totalDec),
      hint: `Convert both numerals to base ten first, then add them.`,
      workedSolution: `$$${b5Str}_{\\text{five}} = ${b5Val}_{10}, \\quad ${b2Str}_{\\text{two}} = ${b2Val}_{10}$$\n$$\\text{Total} = ${b5Val} + ${b2Val} = ${totalDec}_{10}$$.`,
      points: 2
    };
  },
  // Type 3: Remainder & divisibility word problem
  (idx: number) => {
    const divisor = 7 + (idx % 4);
    const quotient = 12 + (idx % 5);
    const remainder = 3 + (idx % 3);
    const dividend = divisor * quotient + remainder;
    return {
      id: `q_b7_num_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `When a certain positive integer $N$ is divided by $${divisor}$, the quotient is $${quotient}$ and the remainder is $${remainder}$. Find the value of $N$.`,
      options: [String(dividend), String(dividend + 1), String(dividend - divisor), String(divisor * quotient)],
      correctAnswer: String(dividend),
      hint: `Use the Division Algorithm: $\\text{Dividend} = (\\text{Divisor} \\times \\text{Quotient}) + \\text{Remainder}$.`,
      workedSolution: `$$N = (${divisor} \\times ${quotient}) + ${remainder} = ${divisor * quotient} + ${remainder} = ${dividend}$$.`,
      points: 2
    };
  },
  // Type 4: Quadratic base determination
  (idx: number) => {
    const bases = [5, 6, 7];
    const b = bases[idx % bases.length];
    const a2 = 1;
    const a1 = 2;
    const a0 = 1; // 121_b = (b+1)^2
    const dec = a2 * b * b + a1 * b + a0;
    return {
      id: `q_b7_num_h${idx < 10 ? '0' + idx : idx}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `If $121_x = ${dec}_{\\text{ten}}$, find the positive base $x$.`,
      options: [String(b), String(b + 1), String(b - 1), String(b + 2)],
      correctAnswer: String(b),
      hint: `Note that $121_x = x^2 + 2x + 1 = (x + 1)^2$.`,
      workedSolution: `$$(x + 1)^2 = ${dec} \\implies x + 1 = ${Math.sqrt(dec)} \\implies x = ${b}$$.`,
      points: 2
    };
  }
];

for (let i = 6; i <= 50; i++) {
  const genFn = hardGenerators[(i - 6) % hardGenerators.length];
  hardQuestions.push(genFn(i));
}

async function seedPool() {
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

  const b7Total = lowQuestions.length + mediumQuestions.length + hardQuestions.length;
  const b8Total = (existingData.levels?.b8?.practicePool?.low?.length || 0) +
                  (existingData.levels?.b8?.practicePool?.medium?.length || 0) +
                  (existingData.levels?.b8?.practicePool?.hard?.length || 0);
  const b9Total = (existingData.levels?.b9?.practicePool?.low?.length || 0) +
                  (existingData.levels?.b9?.practicePool?.medium?.length || 0) +
                  (existingData.levels?.b9?.practicePool?.hard?.length || 0);

  const totalQuestions = b7Total + b8Total + b9Total;

  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 7 PRACTICE POOL: topic_numbers_and_numeration');
  console.log('================================================================');
  console.log(`📦 Ingesting B7 Question Bank:`);
  console.log(`  • Low (DOK 1): ${lowQuestions.length} items`);
  console.log(`  • Medium (DOK 2): ${mediumQuestions.length} items`);
  console.log(`  • Hard (DOK 3): ${hardQuestions.length} items`);
  console.log(`  • Total B7 Items: ${b7Total}`);
  console.log(`  • Total Topic Practice Items (B7 + B8 + B9): ${totalQuestions}`);

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
  const p1 = path.join(__dirname, 'payloads', 'topic_numbers_and_numeration.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_numbers_and_numeration.json');

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

  console.log('🎉 B7 Question Bank expansion completed successfully.');
}

seedPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding pool:', err);
    process.exit(1);
  });
