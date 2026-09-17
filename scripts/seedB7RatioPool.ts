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

// Helper: Greatest common divisor
function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// -----------------------------------------------------------------------------
// 1. LOW TIER (DOK 1) - 50 ITEMS
// Direct recall, unit matching, simplifying two-part ratios, evaluating unit rates,
// percentage as rate per hundred, equivalent ratio scaling.
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b7_rat_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Simplify the ratio $15 : 25$ to its simplest form.",
    options: ["3 : 5", "5 : 3", "1 : 5", "3 : 10"],
    correctAnswer: "3 : 5",
    hint: "Divide both terms by their Highest Common Factor (5).",
    workedSolution: "$$\\frac{15 \\div 5}{25 \\div 5} = \\frac{3}{5} = 3 : 5$$.",
    points: 1
  },
  {
    id: "q_b7_rat_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Express the ratio of $50\\text{ pesewas}$ to $\\text{GH¢ } 2.50$ in simplest form.",
    options: ["1 : 5", "50 : 2.5", "1 : 2", "1 : 10"],
    correctAnswer: "1 : 5",
    hint: "Convert $\\text{GH¢ } 2.50$ to pesewas first ($1\\text{ cedi} = 100\\text{ pesewas}$).",
    workedSolution: "$$\\text{GH¢ } 2.50 = 250\\text{ pesewas}$$\n$$\\frac{50}{250} = \\frac{1}{5} = 1 : 5$$.",
    points: 1
  },
  {
    id: "q_b7_rat_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If 4 exercise books cost $\\text{GH¢ } 20.00$, what is the unit rate (cost per book)?",
    options: ["GH¢ 5.00", "GH¢ 4.00", "GH¢ 10.00", "GH¢ 6.00"],
    correctAnswer: "GH¢ 5.00",
    hint: "Divide total cost by the number of books: $\\frac{20}{4}$.",
    workedSolution: "$$\\text{Unit Rate} = \\frac{20}{4} = \\text{GH¢ } 5.00\\text{ per book}$$.",
    points: 1
  },
  {
    id: "q_b7_rat_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A car travels $180\\text{ km}$ in $3\\text{ hours}$. What is its average speed in $\\text{km/h}$?",
    options: ["60 km/h", "50 km/h", "90 km/h", "54 km/h"],
    correctAnswer: "60 km/h",
    hint: "$$\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}}$$.",
    workedSolution: "$$\\frac{180}{3} = 60\\text{ km/h}$$.",
    points: 1
  },
  {
    id: "q_b7_rat_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What does $45\\%$ mean as a rate per hundred?",
    options: ["45 out of 100", "4.5 out of 100", "45 out of 10", "45 out of 1000"],
    correctAnswer: "45 out of 100",
    hint: "Percent comes from 'per centum', meaning per one hundred.",
    workedSolution: "$$45\\% = \\frac{45}{100}$$, which translates to 45 parts out of every 100.",
    points: 1
  },
  {
    id: "q_b7_rat_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Simplify the ratio $30\\text{ cm}$ to $1.2\\text{ m}$.",
    options: ["1 : 4", "1 : 40", "3 : 12", "1 : 25"],
    correctAnswer: "1 : 4",
    hint: "Convert $1.2\\text{ m}$ to cm ($1.2 \\times 100 = 120\\text{ cm}$).",
    workedSolution: "$$30\\text{ cm} : 120\\text{ cm} = \\frac{30}{120} = 1 : 4$$.",
    points: 1
  },
  {
    id: "q_b7_rat_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If the ratio of boys to girls is $2 : 3$, what fraction of the group are boys?",
    options: ["2/5", "2/3", "3/5", "1/2"],
    correctAnswer: "2/5",
    hint: "Total parts $= 2 + 3 = 5$.",
    workedSolution: "$$\\text{Fraction of boys} = \\frac{2}{2 + 3} = \\frac{2}{5}$$.",
    points: 1
  },
  {
    id: "q_b7_rat_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Find the missing value $x$ in the equivalent ratio: $2 : 5 = 6 : x$.",
    options: ["15", "10", "12", "20"],
    correctAnswer: "15",
    hint: "$$\\frac{2}{5} = \\frac{6}{x}$$. Multiply both sides or scale up by 3.",
    workedSolution: "$$2 \\times 3 = 6 \\implies 5 \\times 3 = 15$$.",
    points: 1
  },
  {
    id: "q_b7_rat_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A machine seals $120$ bottles in $6\\text{ minutes}$. What is its sealing rate per minute?",
    options: ["20 bottles/min", "25 bottles/min", "12 bottles/min", "30 bottles/min"],
    correctAnswer: "20 bottles/min",
    hint: "Divide $120$ by 6.",
    workedSolution: "$$\\frac{120}{6} = 20\\text{ bottles/min}$$.",
    points: 1
  },
  {
    id: "q_b7_rat_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert $\\frac{7}{10}$ to a percentage.",
    options: ["70%", "7%", "700%", "0.7%"],
    correctAnswer: "70%",
    hint: "Multiply by 100%.",
    workedSolution: "$$\\frac{7}{10} \\times 100\\% = 70\\%$$.",
    points: 1
  }
];

// Items 11 to 25: Unit conversions and simplifying two-part ratios
const ratioSimplificationPairs = [
  { a: 18, b: 24, g: 6, sa: 3, sb: 4 },
  { a: 28, b: 42, g: 14, sa: 2, sb: 3 },
  { a: 35, b: 49, g: 7, sa: 5, sb: 7 },
  { a: 40, b: 60, g: 20, sa: 2, sb: 3 },
  { a: 36, b: 48, g: 12, sa: 3, sb: 4 },
  { a: 21, b: 35, g: 7, sa: 3, sb: 5 },
  { a: 45, b: 60, g: 15, sa: 3, sb: 4 },
  { a: 32, b: 56, g: 8, sa: 4, sb: 7 },
  { a: 54, b: 72, g: 18, sa: 3, sb: 4 },
  { a: 16, b: 36, g: 4, sa: 4, sb: 9 },
  { a: 27, b: 45, g: 9, sa: 3, sb: 5 },
  { a: 25, b: 40, g: 5, sa: 5, sb: 8 },
  { a: 48, b: 64, g: 16, sa: 3, sb: 4 },
  { a: 30, b: 75, g: 15, sa: 2, sb: 5 },
  { a: 63, b: 84, g: 21, sa: 3, sb: 4 }
];

for (let i = 0; i < ratioSimplificationPairs.length; i++) {
  const p = ratioSimplificationPairs[i];
  const idx = 11 + i;
  const correct = `${p.sa} : ${p.sb}`;
  const inv = `${p.sb} : ${p.sa}`;
  const w1 = `${p.sa + 1} : ${p.sb}`;
  const w2 = `${p.sa} : ${p.sb + 1}`;
  const options = Array.from(new Set([correct, inv, w1, w2])).slice(0, 4);

  lowQuestions.push({
    id: `q_b7_rat_l${idx < 10 ? '0' + idx : idx}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: `Express the ratio $${p.a} : ${p.b}$ in its lowest terms.`,
    options: options,
    correctAnswer: correct,
    hint: `Find the Highest Common Factor (HCF) of ${p.a} and ${p.b}, which is ${p.g}.`,
    workedSolution: `$$\\frac{${p.a} \\div ${p.g}}{${p.b} \\div ${p.g}} = \\frac{${p.sa}}{${p.sb}} = ${p.sa} : ${p.sb}$$.`,
    points: 1
  });
}

// Items 26 to 50: Unit cost rates and missing values in equivalent ratios
for (let i = 26; i <= 50; i++) {
  const qty = (i % 5) + 2; // 2, 3, 4, 5, 6
  const unitPrice = (i % 7) + 3; // 3, 4, 5, 6, 7, 8, 9
  const totalCost = qty * unitPrice;

  lowQuestions.push({
    id: `q_b7_rat_l${i < 10 ? '0' + i : i}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: `If $${qty}\\text{ kg}$ of sugar cost $\\text{GH¢ } ${totalCost}.00$, what is the cost of $1\\text{ kg}$?`,
    options: [
      `GH¢ ${unitPrice.toFixed(2)}`,
      `GH¢ ${(unitPrice + 1).toFixed(2)}`,
      `GH¢ ${(unitPrice - 1 > 0 ? unitPrice - 1 : unitPrice + 2).toFixed(2)}`,
      `GH¢ ${(totalCost / (qty - 1)).toFixed(2)}`
    ],
    correctAnswer: `GH¢ ${unitPrice.toFixed(2)}`,
    hint: `Divide total cost $\\text{GH¢ } ${totalCost}.00$ by the quantity $${qty}\\text{ kg}$.`,
    workedSolution: `$$\\text{Unit Cost} = \\frac{${totalCost}}{${qty}} = \\text{GH¢ } ${unitPrice.toFixed(2)}$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER (DOK 2) - 50 ITEMS
// Equivalent ratio tables, 2-part and 3-part sharing, percentage increase/decrease,
// best-value rate comparisons.
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b7_rat_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Share $\\text{GH¢ } 720.00$ between Kwame and Ama in the ratio $3 : 5$. How much does Ama receive?",
    options: ["GH¢ 450.00", "GH¢ 270.00", "GH¢ 360.00", "GH¢ 400.00"],
    correctAnswer: "GH¢ 450.00",
    hint: "Total parts $= 3 + 5 = 8$. Ama's fraction is $\\frac{5}{8}$.",
    workedSolution: "$$\\text{Ama's Share} = \\frac{5}{8} \\times 720 = 5 \\times 90 = \\text{GH¢ } 450.00$$.",
    points: 1
  },
  {
    id: "q_b7_rat_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Complete the equivalent ratio table: If $x : y = 4 : 7$ and $x = 28$, what is the value of $y$?",
    options: ["49", "42", "35", "56"],
    correctAnswer: "49",
    hint: "Determine scale factor: $\\frac{28}{4} = 7$. Multiply $7 \\times 7$.",
    workedSolution: "$$\\frac{x}{y} = \\frac{4}{7} \\implies \\frac{28}{y} = \\frac{4}{7} \\implies 4y = 196 \\implies y = 49$$.",
    points: 1
  },
  {
    id: "q_b7_rat_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A shop sells Brand A rice at $\\text{GH¢ } 45.00$ for $5\\text{ kg}$ and Brand B rice at $\\text{GH¢ } 80.00$ for $10\\text{ kg}$. Which brand is cheaper per kilogram, and by how much?",
    options: [
      "Brand B is cheaper by GH¢ 1.00/kg",
      "Brand A is cheaper by GH¢ 1.00/kg",
      "Both brands cost the same",
      "Brand B is cheaper by GH¢ 2.00/kg"
    ],
    correctAnswer: "Brand B is cheaper by GH¢ 1.00/kg",
    hint: "Find unit price for each: $\\frac{45}{5}$ and $\\frac{80}{10}$.",
    workedSolution: "$$\\text{Brand A} = \\frac{45}{5} = \\text{GH¢ } 9.00\\text{/kg}$$\n$$\\text{Brand B} = \\frac{80}{10} = \\text{GH¢ } 8.00\\text{/kg}$$\nBrand B is cheaper by $9 - 8 = \\text{GH¢ } 1.00\\text{/kg}$.",
    points: 1
  },
  {
    id: "q_b7_rat_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "The price of a bag of cement increases from $\\text{GH¢ } 80.00$ to $\\text{GH¢ } 100.00$. What is the percentage increase?",
    options: ["25%", "20%", "15%", "30%"],
    correctAnswer: "25%",
    hint: "Increase $= 100 - 80 = 20$. Compute $\\frac{\\text{Increase}}{\\text{Original}} \\times 100\\%$.",
    workedSolution: "$$\\frac{20}{80} \\times 100\\% = \\frac{1}{4} \\times 100\\% = 25\\%$$.",
    points: 1
  },
  {
    id: "q_b7_rat_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Three partners share profit in the ratio $2 : 3 : 5$. If the total profit is $\\text{GH¢ } 5,000.00$, what is the smallest share?",
    options: ["GH¢ 1,000.00", "GH¢ 1,500.00", "GH¢ 2,500.00", "GH¢ 500.00"],
    correctAnswer: "GH¢ 1,000.00",
    hint: "Total parts $= 2 + 3 + 5 = 10$. Smallest share is $\\frac{2}{10}$.",
    workedSolution: "$$\\frac{2}{10} \\times 5,000 = 2 \\times 500 = \\text{GH¢ } 1,000.00$$.",
    points: 1
  }
];

// Fill items 6 to 25: 2-part and 3-part proportional sharing problems
const sharingScenarios = [
  { p1: 2, p2: 3, total: 600, target: 'smaller', shareNum: 2, totalP: 5 },
  { p1: 3, p2: 4, total: 840, target: 'larger', shareNum: 4, totalP: 7 },
  { p1: 1, p2: 4, total: 500, target: 'smaller', shareNum: 1, totalP: 5 },
  { p1: 5, p2: 7, total: 1200, target: 'larger', shareNum: 7, totalP: 12 },
  { p1: 2, p2: 5, total: 700, target: 'larger', shareNum: 5, totalP: 7 },
  { p1: 3, p2: 7, total: 1000, target: 'smaller', shareNum: 3, totalP: 10 },
  { p1: 4, p2: 5, total: 1800, target: 'smaller', shareNum: 4, totalP: 9 },
  { p1: 3, p2: 5, total: 1600, target: 'larger', shareNum: 5, totalP: 8 },
  { p1: 1, p2: 3, total: 800, target: 'larger', shareNum: 3, totalP: 4 },
  { p1: 5, p2: 8, total: 2600, target: 'smaller', shareNum: 5, totalP: 13 },
  { p1: 2, p2: 3, p3: 4, total: 900, target: 'middle', shareNum: 3, totalP: 9 },
  { p1: 1, p2: 2, p3: 3, total: 1200, target: 'largest', shareNum: 3, totalP: 6 },
  { p1: 3, p2: 4, p3: 5, total: 2400, target: 'smallest', shareNum: 3, totalP: 12 },
  { p1: 2, p2: 4, p3: 5, total: 2200, target: 'middle', shareNum: 4, totalP: 11 },
  { p1: 1, p2: 3, p3: 6, total: 3000, target: 'largest', shareNum: 6, totalP: 10 },
  { p1: 2, p2: 5, p3: 8, total: 4500, target: 'middle', shareNum: 5, totalP: 15 },
  { p1: 3, p2: 5, p3: 7, total: 3000, target: 'smallest', shareNum: 3, totalP: 15 },
  { p1: 2, p2: 3, p3: 7, total: 3600, target: 'largest', shareNum: 7, totalP: 12 },
  { p1: 4, p2: 5, p3: 6, total: 4500, target: 'middle', shareNum: 5, totalP: 15 },
  { p1: 1, p2: 4, p3: 5, total: 2000, target: 'smallest', shareNum: 1, totalP: 10 }
];

for (let i = 0; i < sharingScenarios.length; i++) {
  const sc = sharingScenarios[i];
  const idx = 6 + i;
  const ansVal = (sc.total * sc.shareNum) / sc.totalP;
  const correct = `GH¢ ${ansVal.toFixed(2)}`;
  const opt1 = `GH¢ ${(ansVal * 0.8).toFixed(2)}`;
  const opt2 = `GH¢ ${(ansVal * 1.2).toFixed(2)}`;
  const opt3 = `GH¢ ${(sc.total / sc.totalP).toFixed(2)}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  const ratioStr = sc.p3 ? `${sc.p1} : ${sc.p2} : ${sc.p3}` : `${sc.p1} : ${sc.p2}`;

  mediumQuestions.push({
    id: `q_b7_rat_m${idx < 10 ? '0' + idx : idx}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `An amount of $\\text{GH¢ } ${sc.total}.00$ is divided in the ratio $${ratioStr}$. Calculate the ${sc.target} share.`,
    options: options,
    correctAnswer: correct,
    hint: `Total parts $= ${sc.totalP}$. The ${sc.target} share takes $\\frac{${sc.shareNum}}{${sc.totalP}}$ of the total.`,
    workedSolution: `$$\\text{Total Parts} = ${sc.totalP}$$\n$$\\text{Share} = \\frac{${sc.shareNum}}{${sc.totalP}} \\times ${sc.total} = \\text{GH¢ } ${ansVal.toFixed(2)}$$.`,
    points: 1
  });
}

// Fill items 26 to 50: Percentage change and competitive unit rates
for (let i = 26; i <= 50; i++) {
  const oldPrice = 50 + (i * 5);
  const incRate = (i % 4 + 1) * 5; // 5%, 10%, 15%, 20%
  const newPrice = oldPrice * (1 + incRate / 100);

  mediumQuestions.push({
    id: `q_b7_rat_m${i < 10 ? '0' + i : i}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `The cost of a crate of eggs rose from $\\text{GH¢ } ${oldPrice}.00$ to $\\text{GH¢ } ${newPrice.toFixed(2)}$. What was the percentage increase?`,
    options: [
      `${incRate}%`,
      `${incRate + 5}%`,
      `${incRate - 2 > 0 ? incRate - 2 : incRate + 2}%`,
      `${(incRate * 1.5).toFixed(0)}%`
    ],
    correctAnswer: `${incRate}%`,
    hint: `Increase $= ${newPrice.toFixed(2)} - ${oldPrice} = ${(newPrice - oldPrice).toFixed(2)}$. Divide by original price $\\text{GH¢ } ${oldPrice}.00$.`,
    workedSolution: `$$\\text{Increase} = ${newPrice.toFixed(2)} - ${oldPrice} = ${(newPrice - oldPrice).toFixed(2)}$$\n$$\\text{Percentage Increase} = \\frac{${(newPrice - oldPrice).toFixed(2)}}{${oldPrice}} \\times 100\\% = ${incRate}\\%$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 3. HARD TIER (DOK 3) - 50 ITEMS
// Changing ratios after additions/subtractions, inverse rates, multi-step commissions,
// difference-given sharing.
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b7_rat_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Two numbers are in the ratio $3 : 5$. If $4$ is added to each number, the new ratio becomes $2 : 3$. Find the original smaller number.",
    options: ["12", "20", "15", "9"],
    correctAnswer: "12",
    hint: "Let numbers be $3x$ and $5x$. Set up equation: $\\frac{3x + 4}{5x + 4} = \\frac{2}{3}$.",
    workedSolution: "$$3(3x + 4) = 2(5x + 4)$$\n$$9x + 12 = 10x + 8$$\n$$10x - 9x = 12 - 8 \\implies x = 4$$\n$$\\text{Smaller number} = 3x = 3(4) = 12$$.",
    points: 2
  },
  {
    id: "q_b7_rat_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "In a youth club, the ratio of boys to girls is $4 : 3$. When 6 new girls join the club, the ratio of boys to girls becomes $1 : 1$. How many boys are in the club?",
    options: ["24", "18", "30", "16"],
    correctAnswer: "24",
    hint: "Let boys be $4x$ and girls $3x$. Set $\\frac{4x}{3x + 6} = 1$.",
    workedSolution: "$$4x = 3x + 6 \\implies x = 6$$\n$$\\text{Boys} = 4x = 4(6) = 24$$.",
    points: 2
  },
  {
    id: "q_b7_rat_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Kofi and Baah shared a sum of money in the ratio $5 : 7$. If Baah received $\\text{GH¢ } 60.00$ more than Kofi, what was the TOTAL sum shared?",
    options: ["GH¢ 360.00", "GH¢ 420.00", "GH¢ 300.00", "GH¢ 480.00"],
    correctAnswer: "GH¢ 360.00",
    hint: "Difference in parts $= 7 - 5 = 2\\text{ parts}$. Set $2\\text{ parts} = 60$. Total parts $= 12$.",
    workedSolution: "$$2\\text{ parts} = 60 \\implies 1\\text{ part} = 30$$\n$$\\text{Total Parts} = 5 + 7 = 12$$\n$$\\text{Total Sum} = 12 \\times 30 = \\text{GH¢ } 360.00$$.",
    points: 2
  },
  {
    id: "q_b7_rat_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A salesman receives a basic salary of $\\text{GH¢ } 800.00$ plus a commission of $5\\%$ on all sales exceeding $\\text{GH¢ } 2,000.00$. If his total monthly income is $\\text{GH¢ } 1,200.00$, what was the value of his total sales for that month?",
    options: ["GH¢ 10,000.00", "GH¢ 8,000.00", "GH¢ 12,000.00", "GH¢ 9,500.00"],
    correctAnswer: "GH¢ 10,000.00",
    hint: "Commission $= 1,200 - 800 = 400$. Set $5\\% \\times (S - 2,000) = 400$.",
    workedSolution: "$$\\text{Commission} = 1,200 - 800 = 400$$\n$$0.05(S - 2,000) = 400 \\implies S - 2,000 = \\frac{400}{0.05} = 8,000$$\n$$S = 8,000 + 2,000 = \\text{GH¢ } 10,000.00$$.",
    points: 2
  },
  {
    id: "q_b7_rat_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "If 12 men can weed a field in 8 days, how many MORE men must be employed to complete the work in 6 days at the same working rate?",
    options: ["4 more men", "16 more men", "2 more men", "6 more men"],
    correctAnswer: "4 more men",
    hint: "Total man-days $= 12 \\times 8 = 96$. Find men needed for 6 days: $\\frac{96}{6}$. Subtract original 12.",
    workedSolution: "$$\\text{Total Work} = 12 \\times 8 = 96\\text{ man-days}$$\n$$\\text{Men needed for 6 days} = \\frac{96}{6} = 16\\text{ men}$$\n$$\\text{Additional men} = 16 - 12 = 4\\text{ more men}$$.",
    points: 2
  }
];

// Fill items 6 to 25: Difference-given sharing problems
const diffScenarios = [
  { p1: 3, p2: 5, diff: 40 },
  { p1: 2, p2: 7, diff: 100 },
  { p1: 4, p2: 9, diff: 150 },
  { p1: 5, p2: 8, diff: 90 },
  { p1: 1, p2: 4, diff: 60 },
  { p1: 3, p2: 8, diff: 125 },
  { p1: 2, p2: 5, diff: 75 },
  { p1: 7, p2: 10, diff: 120 },
  { p1: 3, p2: 7, diff: 80 },
  { p1: 5, p2: 11, diff: 180 },
  { p1: 4, p2: 7, diff: 90 },
  { p1: 1, p2: 6, diff: 100 },
  { p1: 2, p2: 9, diff: 140 },
  { p1: 3, p2: 10, diff: 210 },
  { p1: 5, p2: 9, diff: 160 },
  { p1: 6, p2: 11, diff: 150 },
  { p1: 2, p2: 3, diff: 50 },
  { p1: 7, p2: 12, diff: 200 },
  { p1: 4, p2: 11, diff: 210 },
  { p1: 3, p2: 5, diff: 70 }
];

for (let i = 0; i < diffScenarios.length; i++) {
  const sc = diffScenarios[i];
  const idx = 6 + i;
  const diffParts = sc.p2 - sc.p1;
  const onePart = sc.diff / diffParts;
  const totalSum = (sc.p1 + sc.p2) * onePart;
  const correct = `GH¢ ${totalSum.toFixed(2)}`;
  const opt1 = `GH¢ ${(totalSum * 0.75).toFixed(2)}`;
  const opt2 = `GH¢ ${(totalSum * 1.25).toFixed(2)}`;
  const opt3 = `GH¢ ${(totalSum * 1.5).toFixed(2)}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  hardQuestions.push({
    id: `q_b7_rat_h${idx < 10 ? '0' + idx : idx}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `Two partners share money in the ratio $${sc.p1} : ${sc.p2}$. If the second partner receives $\\text{GH¢ } ${sc.diff}.00$ more than the first, what was the total amount shared?`,
    options: options,
    correctAnswer: correct,
    hint: `Difference in parts is $${sc.p2} - ${sc.p1} = ${diffParts}\\text{ parts}$. Find the value of 1 part, then multiply by total parts ($${sc.p1 + sc.p2}$).`,
    workedSolution: `$$\\text{Difference in Parts} = ${sc.p2} - ${sc.p1} = ${diffParts}\\text{ parts}$$\n$$1\\text{ part} = \\frac{${sc.diff}}{${diffParts}} = \\text{GH¢ } ${onePart.toFixed(2)}$$\n$$\\text{Total Sum} = (${sc.p1} + ${sc.p2}) \\times ${onePart.toFixed(2)} = \\text{GH¢ } ${totalSum.toFixed(2)}$$.`,
    points: 2
  });
}

// Fill items 26 to 50: Inverse proportion, workers/days, and changing ratio problems
for (let i = 26; i <= 50; i++) {
  const men = (i % 6) + 6; // 6, 7, 8, 9, 10, 11
  const days = 12;
  const newDays = 8;
  const totalManDays = men * days;
  const menNeeded = Math.round(totalManDays / newDays);
  const extraMen = menNeeded - men > 0 ? menNeeded - men : 2;

  hardQuestions.push({
    id: `q_b7_rat_h${i < 10 ? '0' + i : i}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `If $${men}$ men can complete a construction project in $${days}$ days, how many men working at the same rate are needed to complete the project in $${newDays}$ days?`,
    options: [
      `${menNeeded} men`,
      `${menNeeded + 2} men`,
      `${menNeeded - 2 > 0 ? menNeeded - 2 : menNeeded + 3} men`,
      `${men + 1} men`
    ],
    correctAnswer: `${menNeeded} men`,
    hint: `Inverse proportion: Total work in man-days $= ${men} \\times ${days}$. Divide by target time $${newDays}$ days.`,
    workedSolution: `$$\\text{Total Work} = ${men} \\times ${days} = ${totalManDays}\\text{ man-days}$$\n$$\\text{Men Required} = \\frac{${totalManDays}}{${newDays}} = ${menNeeded}\\text{ men}$$.`,
    points: 2
  });
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB7RatioPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 7 PRACTICE POOL: topic_ratio_proportion_financial');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_ratio_proportion_financial');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_ratio_proportion_financial not found in Firestore.');
  }

  const existingData = snap.data() || {};
  const levels = existingData.levels || {};

  const b7Count = lowQuestions.length + mediumQuestions.length + hardQuestions.length;
  const b8Count = levels.b8?.practicePool?.low?.length + levels.b8?.practicePool?.medium?.length + levels.b8?.practicePool?.hard?.length || 15;
  const b9Count = levels.b9?.practicePool?.low?.length + levels.b9?.practicePool?.medium?.length + levels.b9?.practicePool?.hard?.length || 15;
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
  const p1 = path.join(__dirname, 'payloads', 'topic_ratio_proportion_financial.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_ratio_proportion_financial.json');

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

  console.log('🎉 B7 Ratio & Financial Math Question Bank expansion completed successfully.');
}

seedB7RatioPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B7 ratio pool:', err);
    process.exit(1);
  });
