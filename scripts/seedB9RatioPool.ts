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
// 1. LOW TIER (DOK 1) - 50 ITEMS
// Focus: Direct Simple Interest, statutory SSNIT deduction rates under Act 766 & PNDCL 247,
// single-year linear depreciation deductions, calculating single insurance premiums.
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b9_rat_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Under the National Pensions Act 2008 (Act 766), what percentage of a worker's basic monthly salary is deducted as the employee's contribution to SSNIT?",
    options: ["5.5%", "13.0%", "18.5%", "5.0%"],
    correctAnswer: "5.5%",
    hint: "The employee contributes 5.5%, while the employer contributes 13.0%.",
    workedSolution: "Under Act 766, the employee deduction is strictly $5.5\\%$ of basic salary.",
    points: 1
  },
  {
    id: "q_b9_rat_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Calculate the simple interest on $\\text{GH¢ } 2,000.00$ invested for $3\\text{ years}$ at $5\\%$ per annum.",
    options: ["GH¢ 300.00", "GH¢ 100.00", "GH¢ 600.00", "GH¢ 150.00"],
    correctAnswer: "GH¢ 300.00",
    hint: "Use $I = \\frac{P \\times R \\times T}{100}$.",
    workedSolution: "$$I = \\frac{2,000 \\times 5 \\times 3}{100} = 20 \\times 15 = \\text{GH¢ } 300.00$$.",
    points: 1
  },
  {
    id: "q_b9_rat_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A television set priced at $\\text{GH¢ } 1,200.00$ depreciates by $10\\%$ after one year. What is its book value at the end of the year?",
    options: ["GH¢ 1,080.00", "GH¢ 1,100.00", "GH¢ 960.00", "GH¢ 1,120.00"],
    correctAnswer: "GH¢ 1,080.00",
    hint: "Depreciation $= 10\\% \\times 1,200 = 120$. Subtract from original value.",
    workedSolution: "$$1,200 - 120 = \\text{GH¢ } 1,080.00$$.",
    points: 1
  },
  {
    id: "q_b9_rat_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "An annual insurance premium is set at $4\\%$ of the insured property value. If a house is insured for $\\text{GH¢ } 250,000.00$, find the annual premium.",
    options: ["GH¢ 10,000.00", "GH¢ 1,000.00", "GH¢ 25,000.00", "GH¢ 12,500.00"],
    correctAnswer: "GH¢ 10,000.00",
    hint: "Calculate $\\frac{4}{100} \\times 250,000$.",
    workedSolution: "$$\\text{Premium} = 0.04 \\times 250,000 = \\text{GH¢ } 10,000.00$$.",
    points: 1
  },
  {
    id: "q_b9_rat_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the total statutory monthly remittance to SSNIT made on behalf of an employee under Act 766?",
    options: ["18.5%", "17.5%", "13.0%", "5.5%"],
    correctAnswer: "18.5%",
    hint: "Sum employee's $5.5\\%$ and employer's $13.0\\%$.",
    workedSolution: "$$5.5\\% + 13.0\\% = 18.5\\%$$.",
    points: 1
  },
  {
    id: "q_b9_rat_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If an item costs $\\text{GH¢ } 400.00$ exclusive of VAT, how much VAT is paid at a standard rate of $15\\%$?",
    options: ["GH¢ 60.00", "GH¢ 40.00", "GH¢ 50.00", "GH¢ 75.00"],
    correctAnswer: "GH¢ 60.00",
    hint: "$$\\text{VAT} = \\frac{15}{100} \\times 400$$.",
    workedSolution: "$$\\text{VAT} = 0.15 \\times 400 = \\text{GH¢ } 60.00$$.",
    points: 1
  },
  {
    id: "q_b9_rat_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Find the total amount accumulated when $\\text{GH¢ } 1,000.00$ is borrowed for $2\\text{ years}$ at $10\\%$ simple interest per annum.",
    options: ["GH¢ 1,200.00", "GH¢ 1,100.00", "GH¢ 200.00", "GH¢ 1,250.00"],
    correctAnswer: "GH¢ 1,200.00",
    hint: "$$A = P + I$$, where $I = \\frac{1000 \\times 10 \\times 2}{100} = 200$.",
    workedSolution: "$$A = 1,000 + 200 = \\text{GH¢ } 1,200.00$$.",
    points: 1
  },
  {
    id: "q_b9_rat_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Under the older PNDCL 247 pension legislation in Ghana, what was the employee's contribution rate to SSNIT?",
    options: ["5.0%", "5.5%", "12.5%", "17.5%"],
    correctAnswer: "5.0%",
    hint: "Under PNDCL 247, workers contributed 5.0% and employers contributed 12.5%.",
    workedSolution: "Under PNDCL 247, the employee deduction was $5.0\\%$.",
    points: 1
  },
  {
    id: "q_b9_rat_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A refrigerator purchased for $\\text{GH¢ } 3,000.00$ depreciates linearly by $\\text{GH¢ } 250.00$ each year. What is its value after $1\\text{ year}$?",
    options: ["GH¢ 2,750.00", "GH¢ 2,500.00", "GH¢ 2,800.00", "GH¢ 2,700.00"],
    correctAnswer: "GH¢ 2,750.00",
    hint: "Subtract the single year depreciation of 250 from 3,000.",
    workedSolution: "$$3,000 - 250 = \\text{GH¢ } 2,750.00$$.",
    points: 1
  },
  {
    id: "q_b9_rat_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the minimum qualifying age for full retirement pension under Ghana's SSNIT scheme?",
    options: ["60 years", "55 years", "65 years", "50 years"],
    correctAnswer: "60 years",
    hint: "Early retirement is at 55, but compulsory/full retirement age is 60.",
    workedSolution: "The statutory age for full retirement pension under SSNIT Act 766 is 60 years.",
    points: 1
  }
];

// Fill items 11 through 25: Simple Interest on varied principals, rates, and terms
const siData = [
  { p: 1500, r: 8, t: 2 },
  { p: 2500, r: 6, t: 3 },
  { p: 3200, r: 5, t: 4 },
  { p: 4000, r: 7, t: 2 },
  { p: 1800, r: 10, t: 3 },
  { p: 5000, r: 4, t: 5 },
  { p: 6000, r: 5, t: 2 },
  { p: 2400, r: 12, t: 2 },
  { p: 3500, r: 8, t: 3 },
  { p: 4500, r: 6, t: 2 },
  { p: 7000, r: 5, t: 3 },
  { p: 8000, r: 4, t: 2 },
  { p: 1200, r: 15, t: 2 },
  { p: 2800, r: 10, t: 2 },
  { p: 3600, r: 5, t: 3 }
];

for (let i = 0; i < siData.length; i++) {
  const item = siData[i];
  const idx = 11 + i;
  const interest = (item.p * item.r * item.t) / 100;
  const correct = `GH¢ ${interest.toFixed(2)}`;
  const opt1 = `GH¢ ${(interest * 1.25).toFixed(2)}`;
  const opt2 = `GH¢ ${(interest * 0.75).toFixed(2)}`;
  const opt3 = `GH¢ ${(interest + item.p * 0.05).toFixed(2)}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  lowQuestions.push({
    id: `q_b9_rat_l${idx < 10 ? '0' + idx : idx}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: `Calculate the simple interest on a sum of $\\text{GH¢ } ${item.p.toLocaleString()}.00$ lent for $${item.t}\\text{ years}$ at $${item.r}\\%$ per annum.`,
    options: options,
    correctAnswer: correct,
    hint: `Substitute values into $I = \\frac{P \\times R \\times T}{100}$.`,
    workedSolution: `$$I = \\frac{${item.p} \\times ${item.r} \\times ${item.t}}{100} = \\text{GH¢ } ${interest.toFixed(2)}$$.`,
    points: 1
  });
}

// Fill items 26 through 50: Statutory SSNIT deductions and insurance premium calculations
for (let i = 26; i <= 50; i++) {
  const salary = 1500 + (i * 120);
  const employeeDeduction = salary * 0.055;
  const correct = `GH¢ ${employeeDeduction.toFixed(2)}`;
  const opt1 = `GH¢ ${(salary * 0.13).toFixed(2)}`;
  const opt2 = `GH¢ ${(salary * 0.185).toFixed(2)}`;
  const opt3 = `GH¢ ${(salary * 0.05).toFixed(2)}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  lowQuestions.push({
    id: `q_b9_rat_l${i < 10 ? '0' + i : i}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: `A clerk earns a basic salary of $\\text{GH¢ } ${salary.toLocaleString()}.00$ per month. How much is deducted from his salary monthly as employee SSNIT contribution ($5.5\\%$) under Act 766?`,
    options: options,
    correctAnswer: correct,
    hint: `Multiply $\\text{GH¢ } ${salary.toLocaleString()}.00$ by $0.055$.`,
    workedSolution: `$$\\text{Employee SSNIT} = 0.055 \\times ${salary} = \\text{GH¢ } ${employeeDeduction.toFixed(2)}$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER (DOK 2) - 50 ITEMS
// VAT/NHIL inclusive vs exclusive, solving for P, R, or T, multi-year linear
// depreciation, quarterly/semi-annual insurance policies.
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b9_rat_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A laptop has a VAT-inclusive price of $\\text{GH¢ } 4,600.00$. If the statutory VAT rate is $15\\%$, what was the basic cost before tax?",
    options: ["GH¢ 4,000.00", "GH¢ 3,910.00", "GH¢ 4,100.00", "GH¢ 4,200.00"],
    correctAnswer: "GH¢ 4,000.00",
    hint: "Gross price $= 1.15 \\times \\text{Basic Cost}$. Divide $4,600$ by 1.15.",
    workedSolution: "$$\\text{Basic Cost} = \\frac{4,600}{1 + 0.15} = \\frac{4,600}{1.15} = \\text{GH¢ } 4,000.00$$.",
    points: 1
  },
  {
    id: "q_b9_rat_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A worker's monthly basic salary is $\\text{GH¢ } 4,200.00$. What is the employer's monthly contribution of $13\\%$ to SSNIT under Act 766?",
    options: ["GH¢ 546.00", "GH¢ 231.00", "GH¢ 777.00", "GH¢ 520.00"],
    correctAnswer: "GH¢ 546.00",
    hint: "Calculate $13\\%$ of $\\text{GH¢ } 4,200.00$.",
    workedSolution: "$$\\text{Employer Contribution} = 0.13 \\times 4,200 = \\text{GH¢ } 546.00$$.",
    points: 1
  },
  {
    id: "q_b9_rat_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A generator bought for $\\text{GH¢ } 8,000.00$ depreciates at $12\\%$ per annum linearly. What will be its book value after $3\\text{ years}$?",
    options: ["GH¢ 5,120.00", "GH¢ 2,880.00", "GH¢ 5,600.00", "GH¢ 6,000.00"],
    correctAnswer: "GH¢ 5,120.00",
    hint: "Annual depreciation $= 0.12 \\times 8,000 = 960$. Subtract $3 \\times 960$.",
    workedSolution: "$$\\text{Total Depreciation} = 3 \\times (0.12 \\times 8,000) = 3 \\times 960 = \\text{GH¢ } 2,880.00$$\n$$\\text{Book Value} = 8,000 - 2,880 = \\text{GH¢ } 5,120.00$$.",
    points: 1
  },
  {
    id: "q_b9_rat_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "In how many years will a principal of $\\text{GH¢ } 5,000.00$ yield a simple interest of $\\text{GH¢ } 1,500.00$ at an interest rate of $6\\%$ per annum?",
    options: ["5 years", "4 years", "6 years", "3 years"],
    correctAnswer: "5 years",
    hint: "$$T = \\frac{100 \\times I}{P \\times R}$$.",
    workedSolution: "$$T = \\frac{100 \\times 1,500}{5,000 \\times 6} = \\frac{150,000}{30,000} = 5\\text{ years}$$.",
    points: 1
  },
  {
    id: "q_b9_rat_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "An office complex valued at $\\text{GH¢ } 600,000.00$ is insured against fire at an annual rate of $0.75\\%$. Find the quarterly premium payable.",
    options: ["GH¢ 1,125.00", "GH¢ 4,500.00", "GH¢ 2,250.00", "GH¢ 1,500.00"],
    correctAnswer: "GH¢ 1,125.00",
    hint: "Find total annual premium ($0.75\\% \\times 600,000 = 4,500$) and divide by 4 quarters.",
    workedSolution: "$$\\text{Annual Premium} = 0.0075 \\times 600,000 = \\text{GH¢ } 4,500.00$$\n$$\\text{Quarterly Premium} = \\frac{4,500}{4} = \\text{GH¢ } 1,125.00$$.",
    points: 1
  }
];

// Fill items 6 to 25: Solving for Principal, Rate, or Time given Interest/Amount
const solvePRT = [
  { p: 4000, r: 5, t: 3, target: 'T', i: 600 },
  { p: 6000, r: 8, t: 2, target: 'R', i: 960 },
  { p: 8000, r: 6, t: 4, target: 'P', i: 1920 },
  { p: 2500, r: 10, t: 3, target: 'T', i: 750 },
  { p: 3000, r: 7, t: 2, target: 'R', i: 420 },
  { p: 10000, r: 5, t: 5, target: 'P', i: 2500 },
  { p: 12000, r: 4, t: 3, target: 'T', i: 1440 },
  { p: 5000, r: 9, t: 2, target: 'R', i: 900 },
  { p: 7500, r: 8, t: 2, target: 'P', i: 1200 },
  { p: 9000, r: 5, t: 4, target: 'T', i: 1800 },
  { p: 4500, r: 10, t: 2, target: 'R', i: 900 },
  { p: 15000, r: 6, t: 3, target: 'P', i: 2700 },
  { p: 8500, r: 4, t: 5, target: 'T', i: 1700 },
  { p: 6500, r: 6, t: 2, target: 'R', i: 780 },
  { p: 11000, r: 5, t: 3, target: 'P', i: 1650 },
  { p: 7000, r: 7, t: 3, target: 'T', i: 1470 },
  { p: 9500, r: 8, t: 2, target: 'R', i: 1520 },
  { p: 14000, r: 5, t: 2, target: 'P', i: 1400 },
  { p: 16000, r: 4, t: 4, target: 'T', i: 2560 },
  { p: 12500, r: 6, t: 2, target: 'R', i: 1500 }
];

for (let i = 0; i < solvePRT.length; i++) {
  const item = solvePRT[i];
  const idx = 6 + i;

  if (item.target === 'T') {
    const correct = `${item.t} years`;
    const opt1 = `${item.t + 1} years`;
    const opt2 = `${item.t - 1 > 0 ? item.t - 1 : item.t + 2} years`;
    const opt3 = `${item.t + 3} years`;
    const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

    mediumQuestions.push({
      id: `q_b9_rat_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `In how many years will $\\text{GH¢ } ${item.p.toLocaleString()}.00$ yield a simple interest of $\\text{GH¢ } ${item.i.toLocaleString()}.00$ at $${item.r}\\%$ per annum?`,
      options: options,
      correctAnswer: correct,
      hint: `Use $T = \\frac{100 \\times I}{P \\times R}$.`,
      workedSolution: `$$T = \\frac{100 \\times ${item.i}}{${item.p} \\times ${item.r}} = ${correct}$$.`,
      points: 1
    });
  } else if (item.target === 'R') {
    const correct = `${item.r}%`;
    const opt1 = `${item.r + 2}%`;
    const opt2 = `${item.r - 2 > 0 ? item.r - 2 : item.r + 3}%`;
    const opt3 = `${item.r + 5}%`;
    const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

    mediumQuestions.push({
      id: `q_b9_rat_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `At what annual rate of simple interest will $\\text{GH¢ } ${item.p.toLocaleString()}.00$ earn $\\text{GH¢ } ${item.i.toLocaleString()}.00$ in $${item.t}\\text{ years}$?`,
      options: options,
      correctAnswer: correct,
      hint: `Use $R = \\frac{100 \\times I}{P \\times T}$.`,
      workedSolution: `$$R = \\frac{100 \\times ${item.i}}{${item.p} \\times ${item.t}} = ${correct}$$.`,
      points: 1
    });
  } else {
    const correct = `GH¢ ${item.p.toLocaleString()}.00`;
    const opt1 = `GH¢ ${(item.p * 0.8).toLocaleString()}.00`;
    const opt2 = `GH¢ ${(item.p * 1.25).toLocaleString()}.00`;
    const opt3 = `GH¢ ${(item.p * 1.5).toLocaleString()}.00`;
    const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

    mediumQuestions.push({
      id: `q_b9_rat_m${idx < 10 ? '0' + idx : idx}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `What principal will earn a simple interest of $\\text{GH¢ } ${item.i.toLocaleString()}.00$ when invested for $${item.t}\\text{ years}$ at $${item.r}\\%$ per annum?`,
      options: options,
      correctAnswer: correct,
      hint: `Use $P = \\frac{100 \\times I}{R \\times T}$.`,
      workedSolution: `$$P = \\frac{100 \\times ${item.i}}{${item.r} \\times ${item.t}} = ${correct}$$.`,
      points: 1
    });
  }
}

// Fill items 26 to 50: VAT/NHIL inclusive pricing and linear depreciation
for (let i = 26; i <= 50; i++) {
  const basicCost = (i - 15) * 200; // 2200 to 7000
  const vatRate = 15;
  const vatInclusive = basicCost * 1.15;

  const correct = `GH¢ ${vatInclusive.toFixed(2)}`;
  const opt1 = `GH¢ ${(basicCost * 1.10).toFixed(2)}`;
  const opt2 = `GH¢ ${(basicCost * 1.20).toFixed(2)}`;
  const opt3 = `GH¢ ${(basicCost * 0.85).toFixed(2)}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  mediumQuestions.push({
    id: `q_b9_rat_m${i < 10 ? '0' + i : i}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `A retailer purchases wholesale building hardware with a basic value of $\\text{GH¢ } ${basicCost.toLocaleString()}.00$ exclusive of VAT. What is the final customer price when $15\\%$ VAT is added?`,
    options: options,
    correctAnswer: correct,
    hint: `Multiply basic cost by $1.15$ ($100\\% + 15\\% = 115\\%$).`,
    workedSolution: `$$\\text{VAT} = 0.15 \\times ${basicCost} = \\text{GH¢ } ${(basicCost * 0.15).toFixed(2)}$$\n$$\\text{Gross Price} = ${basicCost} + ${(basicCost * 0.15).toFixed(2)} = ${correct}$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 3. HARD TIER (DOK 3) - 50 ITEMS
// SSNIT Pension Rights formula (37.5% + 1.125% per additional year), reducing balance
// compound depreciation, compound interest comparisons, reverse tax extraction.
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b9_rat_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Mr. Addo retired at age 60 after 20 years (240 months) of active contribution under the National Pension Act (Act 766). His Pension Right is $43.125\\%$, and the average of his best 3 years' annual salary was $\\text{GH¢ } 24,000.00$. Calculate his monthly pension benefit.",
    options: ["GH¢ 862.50", "GH¢ 10,350.00", "GH¢ 750.00", "GH¢ 925.00"],
    correctAnswer: "GH¢ 862.50",
    hint: "Annual Pension $= 43.125\\% \\times 24,000$. Divide by 12 months for monthly benefit.",
    workedSolution: "$$\\text{Annual Pension} = 0.43125 \\times 24,000 = \\text{GH¢ } 10,350.00$$\n$$\\text{Monthly Benefit} = \\frac{10,350}{12} = \\text{GH¢ } 862.50$$.",
    points: 2
  },
  {
    id: "q_b9_rat_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A delivery van bought for $\\text{GH¢ } 80,000.00$ depreciates at a rate of $15\\%$ per annum on a reducing balance (compound depreciation). Calculate its salvage value at the end of $2\\text{ years}$.",
    options: ["GH¢ 57,800.00", "GH¢ 56,000.00", "GH¢ 68,000.00", "GH¢ 60,000.00"],
    correctAnswer: "GH¢ 57,800.00",
    hint: "Value after 2 years $= P(1 - r)^2 = 80,000 \\times (0.85)^2$.",
    workedSolution: "$$\\text{Year 1 Value} = 80,000 \\times 0.85 = \\text{GH¢ } 68,000.00$$\n$$\\text{Year 2 Value} = 68,000 \\times 0.85 = \\text{GH¢ } 57,800.00$$.",
    points: 2
  },
  {
    id: "q_b9_rat_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "An invoice lists goods at $\\text{GH¢ } 14,000.00$ subject to a trade discount of $10\\%$. If the combined VAT and NHIL rate of $15\\%$ is applied to the net discounted price, calculate the total invoice amount payable.",
    options: ["GH¢ 14,490.00", "GH¢ 16,100.00", "GH¢ 12,600.00", "GH¢ 14,000.00"],
    correctAnswer: "GH¢ 14,490.00",
    hint: "Discounted price $= 14,000 \\times 0.90 = 12,600$. Add $15\\%$ tax on $12,600$.",
    workedSolution: "$$\\text{Net Price} = 14,000 - (0.10 \\times 14,000) = \\text{GH¢ } 12,600.00$$\n$$\\text{Tax} = 0.15 \\times 12,600 = \\text{GH¢ } 1,890.00$$\n$$\\text{Total Invoice} = 12,600 + 1,890 = \\text{GH¢ } 14,490.00$$.",
    points: 2
  },
  {
    id: "q_b9_rat_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A retired teacher contributed for the minimum statutory period of 15 years (180 months) to qualify for a full pension. Under Act 766, her guaranteed Pension Right is $37.5\\%$. If the average annual salary of her best 3 years was $\\text{GH¢ } 32,000.00$, what is her annual pension?",
    options: ["GH¢ 12,000.00", "GH¢ 10,500.00", "GH¢ 15,000.00", "GH¢ 1,000.00"],
    correctAnswer: "GH¢ 12,000.00",
    hint: "Calculate $37.5\\%$ of $32,000$.",
    workedSolution: "$$\\text{Annual Pension} = 0.375 \\times 32,000 = \\frac{3}{8} \\times 32,000 = 3 \\times 4,000 = \\text{GH¢ } 12,000.00$$.",
    points: 2
  },
  {
    id: "q_b9_rat_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A businessman borrows $\\text{GH¢ } 10,000.00$ for $2\\text{ years}$. Bank A charges $12\\%$ simple interest per annum, while Bank B charges $11\\%$ compound interest per annum compounded annually. Which bank option is cheaper, and by how much?",
    options: [
      "Bank B is cheaper by GH¢ 79.00",
      "Bank A is cheaper by GH¢ 79.00",
      "Bank B is cheaper by GH¢ 100.00",
      "Both charge the exact same amount"
    ],
    correctAnswer: "Bank B is cheaper by GH¢ 79.00",
    hint: "Bank A Interest $= \\frac{10000 \\times 12 \\times 2}{100} = 2,400$. Bank B Interest $= 10000(1.11)^2 - 10000 = 12,321 - 10,000 = 2,321$.",
    workedSolution: "$$\\text{Bank A Interest} = \\text{GH¢ } 2,400.00$$\n$$\\text{Bank B Interest} = 10,000(1.11)^2 - 10,000 = 12,321 - 10,000 = \\text{GH¢ } 2,321.00$$\nBank B is cheaper by $2,400 - 2,321 = \\text{GH¢ } 79.00$.",
    points: 2
  }
];

// Fill items 6 to 25: Reducing balance compound depreciation and salvage values
const depReducing = [
  { p: 50000, r: 10, t: 2 },
  { p: 60000, r: 12, t: 2 },
  { p: 75000, r: 10, t: 2 },
  { p: 40000, r: 15, t: 2 },
  { p: 90000, r: 10, t: 2 },
  { p: 35000, r: 20, t: 2 },
  { p: 45000, r: 10, t: 2 },
  { p: 100000, r: 15, t: 2 },
  { p: 85000, r: 10, t: 2 },
  { p: 120000, r: 10, t: 2 },
  { p: 65000, r: 20, t: 2 },
  { p: 55000, r: 12, t: 2 },
  { p: 70000, r: 15, t: 2 },
  { p: 95000, r: 10, t: 2 },
  { p: 110000, r: 10, t: 2 },
  { p: 48000, r: 25, t: 2 },
  { p: 52000, r: 10, t: 2 },
  { p: 64000, r: 12.5, t: 2 },
  { p: 88000, r: 10, t: 2 },
  { p: 130000, r: 10, t: 2 }
];

for (let i = 0; i < depReducing.length; i++) {
  const item = depReducing[i];
  const idx = 6 + i;
  const factor = (100 - item.r) / 100;
  const valEnd = item.p * Math.pow(factor, item.t);
  const correct = `GH¢ ${valEnd.toFixed(2)}`;
  const linearVal = item.p - (item.p * (item.r / 100) * item.t);
  const opt1 = `GH¢ ${linearVal.toFixed(2)}`;
  const opt2 = `GH¢ ${(valEnd * 1.1).toFixed(2)}`;
  const opt3 = `GH¢ ${(valEnd * 0.9).toFixed(2)}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  hardQuestions.push({
    id: `q_b9_rat_h${idx < 10 ? '0' + idx : idx}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `An industrial processing machine bought for $\\text{GH¢ } ${item.p.toLocaleString()}.00$ depreciates at an annual rate of $${item.r}\\%$ on a reducing balance basis. What is its salvage value after $${item.t}\\text{ years}$?`,
    options: options,
    correctAnswer: correct,
    hint: `Reducing balance formula: $A = P(1 - r)^t = ${item.p.toLocaleString()} \\times (${factor})^2$.`,
    workedSolution: `$$\\text{Value after 1 year} = ${item.p} \\times ${factor} = \\text{GH¢ } ${(item.p * factor).toFixed(2)}$$\n$$\\text{Value after 2 years} = ${(item.p * factor).toFixed(2)} \\times ${factor} = ${correct}$$.`,
    points: 2
  });
}

// Fill items 26 to 50: Act 766 SSNIT Pension Rights and monthly payout models
for (let i = 26; i <= 50; i++) {
  const years = 15 + ((i - 25) % 16); // 15 to 30 years
  const pensionRight = 37.5 + ((years - 15) * 1.125);
  const avgBest3 = 20000 + (i * 400); // 30400 to 40000
  const annualPayout = avgBest3 * (pensionRight / 100);
  const monthlyPayout = annualPayout / 12;

  const correct = `GH¢ ${monthlyPayout.toFixed(2)}`;
  const opt1 = `GH¢ ${(annualPayout).toFixed(2)}`;
  const opt2 = `GH¢ ${(monthlyPayout * 1.25).toFixed(2)}`;
  const opt3 = `GH¢ ${((avgBest3 * 0.375) / 12).toFixed(2)}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  hardQuestions.push({
    id: `q_b9_rat_h${i < 10 ? '0' + i : i}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `Under Ghana's National Pensions Act (Act 766), a retiree completed ${years} years (${years * 12} months) of valid SSNIT contributions, securing a Pension Right of ${pensionRight.toFixed(3)}\\%. If the average annual salary of the best three years was $\\text{GH¢ } ${avgBest3.toLocaleString()}.00$, what is the retiree's monthly pension benefit?`,
    options: options,
    correctAnswer: correct,
    hint: `Compute annual pension ($${pensionRight.toFixed(3)}\\% \\times ${avgBest3.toLocaleString()}$) and divide by 12 months.`,
    workedSolution: `$$\\text{Annual Pension} = \\frac{${pensionRight.toFixed(3)}}{100} \\times ${avgBest3} = \\text{GH¢ } ${annualPayout.toFixed(2)}$$\n$$\\text{Monthly Pension} = \\frac{${annualPayout.toFixed(2)}}{12} = ${correct}$$.`,
    points: 2
  });
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB9RatioPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 9 PRACTICE POOL: topic_ratio_proportion_financial');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_ratio_proportion_financial');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_ratio_proportion_financial not found in Firestore.');
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
  const p1 = path.join(__dirname, 'payloads', 'topic_ratio_proportion_financial.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_ratio_proportion_financial.json');

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

  console.log('🎉 B9 Ratio, Proportion & Financial Math Question Bank expansion completed successfully.');
}

seedB9RatioPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B9 ratio pool:', err);
    process.exit(1);
  });
