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

// =============================================================================
// VECTOR SVG GENERATORS FOR B7 DATA HANDLING & PROBABILITY
// =============================================================================

// 1. Clean SVG Bar Chart Generator
const createBarChartSvg = (labels: string[], values: number[], title: string) => {
  const maxVal = Math.max(...values, 10);
  const chartHeight = 110;
  const barWidth = 32;
  const gap = 18;

  const bars = labels.map((label, idx) => {
    const val = values[idx];
    const bHeight = Math.max(8, (val / maxVal) * chartHeight);
    const x = 50 + idx * (barWidth + gap);
    const y = 145 - bHeight;
    return `
      <rect x='${x}' y='${y}' width='${barWidth}' height='${bHeight}' fill='#3b82f6' rx='3' stroke='#1d4ed8' stroke-width='1.5'/>
      <text x='${x + barWidth / 2}' y='${y - 5}' font-size='11' font-weight='bold' fill='#1e293b' text-anchor='middle'>${val}</text>
      <text x='${x + barWidth / 2}' y='162' font-size='10' font-weight='600' fill='#475569' text-anchor='middle'>${label}</text>
    `;
  }).join('');

  return `
  <svg viewBox='0 0 320 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
    <text x='160' y='20' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>${title}</text>
    <!-- Axes -->
    <line x1='40' y1='145' x2='300' y2='145' stroke='#334155' stroke-width='2'/>
    <line x1='40' y1='145' x2='40' y2='25' stroke='#334155' stroke-width='2'/>
    <text x='35' y='28' font-size='9' font-weight='bold' fill='#334155' text-anchor='end'>Freq</text>
    ${bars}
  </svg>
  `.trim().replace(/\n\s*/g, '');
};

// 2. Clean SVG Pie Chart Generator (4 sectors)
const createPieChartSvg = (angles: [number, number, number, number], labels: [string, string, string, string]) => `
<svg viewBox='0 0 320 190' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <g transform='translate(95, 95)'>
    <!-- Sector 1: 0 to 90 deg -->
    <path d='M 0 0 L 65 0 A 65 65 0 0 1 0 65 Z' fill='#3b82f6' stroke='#ffffff' stroke-width='1.5'/>
    <!-- Sector 2: 90 to 180 deg -->
    <path d='M 0 0 L 0 65 A 65 65 0 0 1 -65 0 Z' fill='#10b981' stroke='#ffffff' stroke-width='1.5'/>
    <!-- Sector 3: 180 to 270 deg -->
    <path d='M 0 0 L -65 0 A 65 65 0 0 1 0 -65 Z' fill='#f59e0b' stroke='#ffffff' stroke-width='1.5'/>
    <!-- Sector 4: 270 to 360 deg -->
    <path d='M 0 0 L 0 -65 A 65 65 0 0 1 65 0 Z' fill='#ef4444' stroke='#ffffff' stroke-width='1.5'/>
  </g>
  <!-- Legend / Labels -->
  <g transform='translate(185, 30)'>
    <circle cx='10' cy='15' r='5' fill='#3b82f6'/><text x='22' y='18' font-size='10' font-weight='bold' fill='#334155'>${labels[0]}: ${angles[0]}°</text>
    <circle cx='10' cy='42' r='5' fill='#10b981'/><text x='22' y='45' font-size='10' font-weight='bold' fill='#334155'>${labels[1]}: ${angles[1]}°</text>
    <circle cx='10' cy='69' r='5' fill='#f59e0b'/><text x='22' y='72' font-size='10' font-weight='bold' fill='#334155'>${labels[2]}: ${angles[2]}°</text>
    <circle cx='10' cy='96' r='5' fill='#ef4444'/><text x='22' y='99' font-size='10' font-weight='bold' fill='#334155'>${labels[3]}: ${angles[3]}°</text>
  </g>
</svg>
`.trim().replace(/\n\s*/g, '');

// 3. Probability Scale SVG Helper
const createProbabilityScaleSvg = (pointVal: string, pointLabel: string) => `
<svg viewBox='0 0 340 130' width='100%' height='120' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <text x='170' y='22' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>Probability Scale [0 to 1]</text>
  <!-- Scale Line -->
  <line x1='40' y1='70' x2='300' y2='70' stroke='#334155' stroke-width='3' stroke-linecap='round'/>
  <!-- Ticks -->
  <line x1='40' y1='60' x2='40' y2='80' stroke='#334155' stroke-width='2'/>
  <line x1='170' y1='60' x2='170' y2='80' stroke='#334155' stroke-width='2'/>
  <line x1='300' y1='60' x2='300' y2='80' stroke='#334155' stroke-width='2'/>
  <!-- Values -->
  <text x='40' y='96' font-size='10' font-weight='bold' fill='#0f172a' text-anchor='middle'>0</text>
  <text x='40' y='110' font-size='9' fill='#64748b' text-anchor='middle'>Impossible</text>
  <text x='170' y='96' font-size='10' font-weight='bold' fill='#0f172a' text-anchor='middle'>0.5</text>
  <text x='170' y='110' font-size='9' fill='#64748b' text-anchor='middle'>Even Chance</text>
  <text x='300' y='96' font-size='10' font-weight='bold' fill='#0f172a' text-anchor='middle'>1</text>
  <text x='300' y='110' font-size='9' fill='#64748b' text-anchor='middle'>Certain</text>
  <!-- Indicator Indicator Point -->
  <circle cx='${pointVal === '0' ? '40' : pointVal === '0.5' ? '170' : '300'}' cy='70' r='5' fill='#dc2626'/>
  <text x='${pointVal === '0' ? '40' : pointVal === '0.5' ? '170' : '300'}' y='52' font-size='10' font-weight='bold' fill='#dc2626' text-anchor='middle'>${pointLabel}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// =============================================================================
// 1. LOW TIER QUESTIONS (DOK 1) - 50 Items
// =============================================================================
const lowQuestions: any[] = [
  {
    id: "q_b7_dat_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Find the mode of the following set of marks: $4, 7, 5, 8, 7, 9, 7, 6$.",
    options: ["7", "6", "8", "5"],
    correctAnswer: "7",
    hint: "The mode is the number that appears with the highest frequency.",
    workedSolution: "The number 7 appears 3 times, which is more frequent than any other number. Mode $= 7$.",
    points: 1
  },
  {
    id: "q_b7_dat_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Calculate the mean of the scores: $12, 15, 18, 25, 30$.",
    options: ["20", "18", "22", "25"],
    correctAnswer: "20",
    hint: "Sum all values and divide by the count ($n = 5$).",
    workedSolution: "$$\\text{Mean} = \\frac{12 + 15 + 18 + 25 + 30}{5} = \\frac{100}{5} = 20$$.",
    points: 1
  },
  {
    id: "q_b7_dat_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Find the median of the scores: $9, 3, 7, 12, 5, 8, 10$.",
    options: ["8", "7", "9", "7.5"],
    correctAnswer: "8",
    hint: "Arrange the 7 numbers in ascending order and select the middle value.",
    workedSolution: "Ordered list: $3, 5, 7, \\mathbf{8}, 9, 10, 12$. The middle score is 8.",
    points: 1
  },
  {
    id: "q_b7_dat_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: `From the bar chart below showing preferred sports in a class:<br/>${createBarChartSvg(['Football', 'Volleyball', 'Tennis', 'Running'], [15, 8, 5, 12], 'Student Sports Preferences')}<br/>What is the modal sport?`,
    options: ["Football", "Running", "Volleyball", "Tennis"],
    correctAnswer: "Football",
    hint: "Identify the category with the tallest vertical bar.",
    workedSolution: "Football has the tallest bar with a frequency of 15, making it the mode.",
    points: 1
  },
  {
    id: "q_b7_dat_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "In a pie chart representing 60 pupils, how many degrees on the sector angle represent 1 pupil?",
    options: ["6°", "10°", "12°", "5°"],
    correctAnswer: "6°",
    hint: "Divide $360^\\circ$ by the total number of pupils (60).",
    workedSolution: "$$\\frac{360^\\circ}{60} = 6^\\circ\\text{ per pupil}$$.",
    points: 1
  },
  {
    id: "q_b7_dat_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A fair standard six-sided die is tossed once. What is the probability of rolling a 4?",
    options: ["1/6", "4/6", "1/2", "1/4"],
    correctAnswer: "1/6",
    hint: "There is only one face with a 4 out of 6 possible outcomes.",
    workedSolution: "$$P(4) = \\frac{1}{6}$$.",
    points: 1
  },
  {
    id: "q_b7_dat_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: `On the probability scale shown below:<br/>${createProbabilityScaleSvg('0', 'Event A')}<br/>What numerical value represents an event that is completely IMPOSSIBLE?`,
    options: ["0", "1", "0.5", "-1"],
    correctAnswer: "0",
    hint: "Impossible events have a probability of 0.",
    workedSolution: "An impossible event has a probability of strictly 0.",
    points: 1
  },
  {
    id: "q_b7_dat_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the range of the numbers: $23, 45, 12, 67, 34, 89, 21$?",
    options: ["77", "67", "79", "89"],
    correctAnswer: "77",
    hint: "$$\\text{Range} = \\text{Maximum} - \\text{Minimum}$$.",
    workedSolution: "$$\\text{Range} = 89 - 12 = 77$$.",
    points: 1
  },
  {
    id: "q_b7_dat_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the median of the even-count list: $4, 6, 8, 10$?",
    options: ["7", "8", "6", "7.5"],
    correctAnswer: "7",
    hint: "Take the mean of the two middle numbers: $\\frac{6 + 8}{2}$.",
    workedSolution: "$$\\text{Median} = \\frac{6 + 8}{2} = \\frac{14}{2} = 7$$.",
    points: 1
  },
  {
    id: "q_b7_dat_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A bag contains 3 red balls and 7 blue balls. What is the probability of randomly drawing a red ball?",
    options: ["3/10", "7/10", "3/7", "1/3"],
    correctAnswer: "3/10",
    hint: "Total balls $= 3 + 7 = 10$. Red balls $= 3$.",
    workedSolution: "$$P(\\text{Red}) = \\frac{3}{3 + 7} = \\frac{3}{10}$$.",
    points: 1
  }
];

// Fill items 11 through 50 to complete 50 Low items
for (let i = 11; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    // Pie chart angle calculation
    const total = 20;
    const count = (i % 5) + 2; // 2 to 6
    const sectorDeg = (count / total) * 360;
    lowQuestions.push({
      id: `q_b7_dat_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `In a school club of $${total}$ pupils, ${count} students play chess. What is the sector angle for chess on a pie chart?`,
      options: [
        `${sectorDeg}°`,
        `${sectorDeg + 18}°`,
        `${sectorDeg - 18}°`,
        `${sectorDeg * 2}°`
      ],
      correctAnswer: `${sectorDeg}°`,
      hint: `Calculate $\\frac{${count}}{${total}} \\times 360^\\circ$.`,
      workedSolution: `$$\\text{Sector Angle} = \\frac{${count}}{${total}} \\times 360^\\circ = ${count} \\times 18^\\circ = ${sectorDeg}^\\circ$$.`,
      points: 1
    });
  } else if (mod === 1) {
    // Mean of 4 numbers
    const base = (i % 10) + 2;
    const nums = [base, base + 2, base + 4, base + 6];
    const mean = base + 3;
    lowQuestions.push({
      id: `q_b7_dat_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Find the mean of the numbers: $${nums.join(', ')}$.`,
      options: [
        `${mean}`,
        `${mean + 1}`,
        `${mean - 1}`,
        `${mean + 2}`
      ],
      correctAnswer: `${mean}`,
      hint: `Add all 4 numbers and divide by 4.`,
      workedSolution: `$$\\text{Mean} = \\frac{${nums.join(' + ')}}{4} = \\frac{${nums.reduce((a, b) => a + b, 0)}}{4} = ${mean}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    // Mode of numbers
    const m = (i % 8) + 3;
    const arr = [m, m - 1, m, m + 2, m, m + 1, m - 2];
    lowQuestions.push({
      id: `q_b7_dat_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `What is the mode of the data set: $${arr.join(', ')}$?`,
      options: [
        `${m}`,
        `${m - 1}`,
        `${m + 1}`,
        `${m + 2}`
      ],
      correctAnswer: `${m}`,
      hint: "The mode is the value that appears most often.",
      workedSolution: `The number ${m} occurs 3 times, which is more frequent than any other value. Mode $= ${m}$.`,
      points: 1
    });
  } else {
    // Coin or simple event probability
    const events = [
      { q: "tossing a fair coin and getting Heads", ans: "1/2", wrong: ["1/4", "1", "0"], exp: "P(\\text{Heads}) = \\frac{1}{2}" },
      { q: "rolling an even number on a fair 6-sided die", ans: "1/2", wrong: ["1/6", "1/3", "2/3"], exp: "P(\\text{Even}) = \\frac{3}{6} = \\frac{1}{2}" },
      { q: "rolling a prime number (2, 3, 5) on a fair 6-sided die", ans: "1/2", wrong: ["1/3", "1/6", "2/3"], exp: "P(\\text{Prime}) = \\frac{3}{6} = \\frac{1}{2}" },
      { q: "drawing a black card from a standard deck of 52 cards", ans: "1/2", wrong: ["1/4", "13/52", "1/13"], exp: "P(\\text{Black}) = \\frac{26}{52} = \\frac{1}{2}" }
    ];
    const ev = events[i % events.length];
    lowQuestions.push({
      id: `q_b7_dat_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `What is the theoretical probability of ${ev.q}?`,
      options: [
        ev.ans,
        ev.wrong[0],
        ev.wrong[1],
        ev.wrong[2]
      ],
      correctAnswer: ev.ans,
      hint: `Divide favorable outcomes by total possible outcomes.`,
      workedSolution: `$$${ev.exp}$$.`,
      points: 1
    });
  }
}

// =============================================================================
// 2. MEDIUM TIER QUESTIONS (DOK 2) - 50 Items
// =============================================================================
const mediumQuestions: any[] = [
  {
    id: "q_b7_dat_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Calculate the mean of the distribution shown in the frequency table below:<br/><br/>| Mark ($x$) | 2 | 3 | 4 | 5 |<br/>| :---: | :---: | :---: | :---: | :---: |<br/>| Frequency ($f$) | 3 | 5 | 8 | 4 |",
    options: ["3.65", "3.50", "4.00", "3.80"],
    correctAnswer: "3.65",
    hint: "Compute $\\sum f$ and $\\sum fx$, then evaluate $\\bar{x} = \\frac{\\sum fx}{\\sum f}$.",
    workedSolution: "$$\\sum f = 3 + 5 + 8 + 4 = 20$$\n$$\\sum fx = (2 \\times 3) + (3 \\times 5) + (4 \\times 8) + (5 \\times 4) = 6 + 15 + 32 + 20 = 73$$\n$$\\bar{x} = \\frac{73}{20} = 3.65$$.",
    points: 1
  },
  {
    id: "q_b7_dat_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Study the pie chart below showing a farmer's budget:<br/>${createPieChartSvg([90, 90, 90, 90], ['Seeds', 'Fertilizer', 'Labor', 'Fuel'])}<br/>If the sector angle for Seeds is $90^\\circ$ and the farmer spent $\\text{GH¢ } 1,200.00$ in total, how much was spent on Seeds?`,
    options: ["GH¢ 300.00", "GH¢ 400.00", "GH¢ 250.00", "GH¢ 600.00"],
    correctAnswer: "GH¢ 300.00",
    hint: "Fraction of budget $= \\frac{90^\\circ}{360^\\circ} = \\frac{1}{4}$. Multiply $\\frac{1}{4} \\times 1,200$.",
    workedSolution: "$$\\text{Amount} = \\frac{90}{360} \\times 1,200 = \\frac{1}{4} \\times 1,200 = \\text{GH¢ } 300.00$$.",
    points: 1
  },
  {
    id: "q_b7_dat_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "The mean of five numbers is $14$. If four of the numbers are $10, 12, 16,$ and $18$, what is the fifth number?",
    options: ["14", "15", "16", "12"],
    correctAnswer: "14",
    hint: "Total sum of the 5 numbers is $5 \\times 14 = 70$. Subtract the sum of the known 4 numbers.",
    workedSolution: "$$\\text{Total Sum} = 5 \\times 14 = 70$$\n$$\\text{Sum of 4 numbers} = 10 + 12 + 16 + 18 = 56$$\n$$\\text{Fifth number} = 70 - 56 = 14$$.",
    points: 1
  },
  {
    id: "q_b7_dat_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A card is drawn at random from a standard deck of 52 playing cards. What is the probability of drawing a King or an Ace?",
    options: ["2/13", "1/13", "4/13", "1/26"],
    correctAnswer: "2/13",
    hint: "There are 4 Kings and 4 Aces in the deck: $4 + 4 = 8$ favorable outcomes.",
    workedSolution: "$$P(\\text{King or Ace}) = \\frac{8}{52} = \\frac{2}{13}$$.",
    points: 1
  },
  {
    id: "q_b7_dat_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Find the median mark from the frequency table below:<br/><br/>| Mark | 1 | 2 | 3 | 4 | 5 |<br/>| :---: | :---: | :---: | :---: | :---: | :---: |<br/>| Frequency | 2 | 4 | 7 | 5 | 3 |",
    options: ["3", "4", "2.5", "3.5"],
    correctAnswer: "3",
    hint: "Find total frequency $\\sum f = 21$. The median position is $\\frac{21 + 1}{2} = 11^{\\text{th}}$ item.",
    workedSolution: "$$\\sum f = 2 + 4 + 7 + 5 + 3 = 21$$\n$$\\text{Position} = \\frac{21 + 1}{2} = 11^{\\text{th}}$$\nCumulative frequencies: up to mark 2 is 6; up to mark 3 is $6 + 7 = 13$. The $11^{\\text{th}}$ score is 3.",
    points: 1
  }
];

// Fill remaining Medium items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    // Missing frequency in total count
    const totalN = 30 + (i % 10);
    const f1 = 8;
    const f2 = 10;
    const f3 = 5;
    const fMissing = totalN - (f1 + f2 + f3);
    mediumQuestions.push({
      id: `q_b7_dat_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `A survey of ${totalN} people recorded choices for 4 brands: Brand A has 8, Brand B has 10, Brand C has 5, and Brand D has $x$ people. Find the value of $x$.`,
      options: [
        `${fMissing}`,
        `${fMissing + 2}`,
        `${fMissing - 2}`,
        `${fMissing + 4}`
      ],
      correctAnswer: `${fMissing}`,
      hint: `Sum all frequencies: $8 + 10 + 5 + x = ${totalN}$.`,
      workedSolution: `$$23 + x = ${totalN} \\implies x = ${totalN} - 23 = ${fMissing}$$.`,
      points: 1
    });
  } else if (mod === 1) {
    // Sector angle to frequency
    const totalPeople = 120;
    const angle = (i % 6 + 1) * 30; // e.g. 30, 60, 90, 120, 150, 180
    const peopleCount = Math.round((angle / 360) * totalPeople);
    mediumQuestions.push({
      id: `q_b7_dat_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `In a pie chart representing ${totalPeople} farmers, a sector of ${angle}^\\circ$ represents maize growers. How many farmers grow maize?`,
      options: [
        `${peopleCount}`,
        `${peopleCount + 5}`,
        `${peopleCount - 5}`,
        `${peopleCount * 2}`
      ],
      correctAnswer: `${peopleCount}`,
      hint: `Number of farmers $= \\frac{\\text{Angle}}{360^\\circ} \\times ${totalPeople}$.`,
      workedSolution: `$$\\text{Frequency} = \\frac{${angle}}{360} \\times ${totalPeople} = ${peopleCount}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    // Mean of 5 exam scores
    const targetMean = 15;
    const diff = (i % 8);
    const sumKnown = 60 - (diff + 5);
    const fifthScore = 5 * targetMean - sumKnown;
    mediumQuestions.push({
      id: `q_b7_dat_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `The mean of 5 student marks is ${targetMean}. If four of the marks sum to ${sumKnown}, what is the fifth mark?`,
      options: [
        `${fifthScore}`,
        `${fifthScore + 2}`,
        `${fifthScore - 2}`,
        `${fifthScore + 4}`
      ],
      correctAnswer: `${fifthScore}`,
      hint: `Total sum of 5 marks $= 5 \\times ${targetMean} = 75$. Subtract ${sumKnown}.`,
      workedSolution: `$$\\text{Fifth mark} = (5 \\times ${targetMean}) - ${sumKnown} = 75 - ${sumKnown} = ${fifthScore}$$.`,
      points: 1
    });
  } else {
    // Probability of drawing colored balls
    const red = 4 + (i % 4);
    const blue = 6 + (i % 3);
    const green = 5;
    const tot = red + blue + green;
    mediumQuestions.push({
      id: `q_b7_dat_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `A box contains ${red} red, ${blue} blue, and ${green} green marbles. What is the probability of picking a blue marble at random?`,
      options: [
        `${blue}/${tot}`,
        `${red}/${tot}`,
        `${green}/${tot}`,
        `${blue + red}/${tot}`
      ],
      correctAnswer: `${blue}/${tot}`,
      hint: `Total marbles $= ${red} + ${blue} + ${green} = ${tot}$. Favorable outcomes $= ${blue}$.`,
      workedSolution: `$$P(\\text{Blue}) = \\frac{${blue}}{${red} + ${blue} + ${green}} = \\frac{${blue}}{${tot}}$$.`,
      points: 1
    });
  }
}

// =============================================================================
// 3. HARD TIER QUESTIONS (DOK 3) - 50 Items
// =============================================================================
const hardQuestions: any[] = [
  {
    id: "q_b7_dat_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "In a pie chart representing the distribution of books in a school library, the sector angles are: Mathematics ($2x^\\circ$), Science ($3x^\\circ$), English ($100^\\circ$), and Social Studies ($80^\\circ$). If there are $720$ books in total, how many Science books are in the library?",
    options: ["216 books", "144 books", "200 books", "180 books"],
    correctAnswer: "216 books",
    hint: "Angles in a circle sum to $360^\\circ$: $2x + 3x + 100 + 80 = 360$. Find $x$, then calculate Science sector $\\frac{3x}{360} \\times 720$.",
    workedSolution: "$$5x + 180 = 360 \\implies 5x = 180 \\implies x = 36^\\circ$$\n$$\\text{Science Sector} = 3(36^\\circ) = 108^\\circ$$\n$$\\text{Science Books} = \\frac{108}{360} \\times 720 = 108 \\times 2 = 216\\text{ books}$$.",
    points: 2
  },
  {
    id: "q_b7_dat_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A box contains $x$ green balls and $15$ yellow balls. If the probability of randomly picking a green ball is $\\frac{2}{5}$, find the value of $x$.",
    options: ["10", "8", "12", "6"],
    correctAnswer: "10",
    hint: "Set up the probability equation: $\\frac{x}{x + 15} = \\frac{2}{5}$ and cross-multiply.",
    workedSolution: "$$\\frac{x}{x + 15} = \\frac{2}{5} \\implies 5x = 2(x + 15)$$\n$$5x = 2x + 30 \\implies 3x = 30 \\implies x = 10$$.",
    points: 2
  },
  {
    id: "q_b7_dat_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "The mean of the numbers $x, x + 2, x + 4, x + 6,$ and $x + 8$ is $18$. Find the value of $x$.",
    options: ["14", "16", "12", "15"],
    correctAnswer: "14",
    hint: "Sum the 5 expressions: $5x + 20$. Set $\\frac{5x + 20}{5} = 18$.",
    workedSolution: "$$\\frac{5x + 20}{5} = 18 \\implies x + 4 = 18 \\implies x = 14$$.",
    points: 2
  },
  {
    id: "q_b7_dat_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `From the student activity bar chart below:<br/>${createBarChartSvg(['Choir', 'Drama', 'Debate', 'Cadet'], [12, 18, 14, 16], 'Club Membership')}<br/>What percentage of the students belong to the Drama club?`,
    options: ["30%", "25%", "35%", "28%"],
    correctAnswer: "30%",
    hint: "Total students $= 12 + 18 + 14 + 16 = 60$. Compute $\\frac{18}{60} \\times 100\\%$.",
    workedSolution: "$$\\text{Total} = 12 + 18 + 14 + 16 = 60$$\n$$\\text{Drama Percentage} = \\frac{18}{60} \\times 100\\% = \\frac{3}{10} \\times 100\\% = 30\\%$$.",
    points: 2
  },
  {
    id: "q_b7_dat_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Two fair six-sided dice are tossed simultaneously. What is the probability that the sum of the two numbers shown is equal to $7$?",
    options: ["1/6", "7/36", "5/36", "1/12"],
    correctAnswer: "1/6",
    hint: "Total sample space $= 6 \\times 6 = 36$. Outcomes summing to 7: $(1,6), (2,5), (3,4), (4,3), (5,2), (6,1)$.",
    workedSolution: "$$\\text{Favorable outcomes} = 6$$\n$$P(\\text{Sum} = 7) = \\frac{6}{36} = \\frac{1}{6}$$.",
    points: 2
  }
];

// Fill remaining Hard items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    // Variable sector angle deduction
    const xVal = 20 + (i % 10);
    // Sectors: x, 2x, 3x, and constant C such that 6x + C = 360 -> C = 360 - 6*xVal
    const constAngle = 360 - 6 * xVal;
    hardQuestions.push({
      id: `q_b7_dat_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `In a pie chart, four sectors have angles measuring $x^\\circ$, $2x^\\circ$, $3x^\\circ$, and $${constAngle}^\\circ$. Find the measure of the largest sector ($3x^\\circ$).`,
      options: [
        `${3 * xVal}°`,
        `${2 * xVal}°`,
        `${xVal}°`,
        `${3 * xVal + 15}°`
      ],
      correctAnswer: `${3 * xVal}°`,
      hint: `Sum of all four sectors is $360^\\circ$: $x + 2x + 3x + ${constAngle} = 360$.`,
      workedSolution: `$$6x + ${constAngle} = 360 \\implies 6x = ${360 - constAngle} \\implies x = ${xVal}^\\circ$$\n$$\\text{Largest sector} = 3(${xVal}^\\circ) = ${3 * xVal}^\\circ$$.`,
      points: 2
    });
  } else if (mod === 1) {
    // Complementary probability: P(not E) = 1 - P(E)
    const num = (i % 7) + 2;
    const den = 15;
    const compNum = den - num;
    hardQuestions.push({
      id: `q_b7_dat_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `If the probability of a football team winning a tournament match is $\\frac{${num}}{${den}}$, what is the probability that the team does NOT win the match?`,
      options: [
        `${compNum}/${den}`,
        `${num}/${den}`,
        `${compNum - 1}/${den}`,
        `1`
      ],
      correctAnswer: `${compNum}/${den}`,
      hint: `Use complementary probability: $P(E') = 1 - P(E) = 1 - \\frac{${num}}{${den}}$.`,
      workedSolution: `$$P(\\text{Not win}) = 1 - \\frac{${num}}{${den}} = \\frac{${den} - ${num}}{${den}} = \\frac{${compNum}}{${den}}$$.`,
      points: 2
    });
  } else if (mod === 2) {
    // Reverse mean with missing variable: (x + a + b + c + d) / 5 = mean
    const targetM = 20;
    const v1 = 12 + (i % 5);
    const v2 = 18;
    const v3 = 24;
    const v4 = 22;
    const xSol = (5 * targetM) - (v1 + v2 + v3 + v4);
    hardQuestions.push({
      id: `q_b7_dat_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `The mean of five integers $x, ${v1}, ${v2}, ${v3},$ and ${v4} is ${targetM}$. What is the value of $x$?`,
      options: [
        `${xSol}`,
        `${xSol + 2}`,
        `${xSol - 2}`,
        `${xSol + 4}`
      ],
      correctAnswer: `${xSol}`,
      hint: `Equate the mean: $\\frac{x + ${v1 + v2 + v3 + v4}}{5} = ${targetM}$.`,
      workedSolution: `$$x + ${v1 + v2 + v3 + v4} = 5 \\times ${targetM} = 100 \\implies x = 100 - ${v1 + v2 + v3 + v4} = ${xSol}$$.`,
      points: 2
    });
  } else {
    // Two dice probability for sum = 8 or 9
    const targetSum = (i % 2 === 0) ? 8 : 9;
    const favorable = targetSum === 8 ? 5 : 4; // 8: (2,6),(3,5),(4,4),(5,3),(6,2)=5; 9: (3,6),(4,5),(5,4),(6,3)=4
    hardQuestions.push({
      id: `q_b7_dat_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `When two fair dice are thrown simultaneously, what is the probability of obtaining a total sum of $${targetSum}$?`,
      options: [
        `${favorable}/36`,
        `${favorable + 1}/36`,
        `${favorable - 1}/36`,
        `1/6`
      ],
      correctAnswer: `${favorable}/36`,
      hint: `Count the number of pairs $(a, b)$ that add up to ${targetSum} out of 36 total outcomes.`,
      workedSolution: `Total outcomes $= 36$. Favorable pairs adding to ${targetSum} are ${favorable} pairs. Thus $P(\\text{Sum} = ${targetSum}) = \\frac{${favorable}}{36}$.`,
      points: 2
    });
  }
}

// =============================================================================
// SEEDING AND PERSISTENCE LOGIC
// =============================================================================
async function seedB7DataPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 7 PRACTICE POOL: topic_data_handling_probability');
  console.log('================================================================');

  let docId = 'topic_data_handling_probability';
  let docRef = db.doc(`global_curriculum/jhs/subjects/math/topics/${docId}`);
  let snap = await docRef.get();

  if (!snap.exists) {
    docId = 'topic_data_handling_and_probability';
    docRef = db.doc(`global_curriculum/jhs/subjects/math/topics/${docId}`);
    snap = await docRef.get();
  }

  if (!snap.exists) {
    throw new Error('Target document topic_data_handling_probability not found in Firestore.');
  }

  console.log(`📌 Target Document ID: ${docId}`);

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

  // Sync local payload files
  const payloadNames = [
    'topic_data_handling_probability.json',
    'topic_data_handling_and_probability.json'
  ];

  for (const name of payloadNames) {
    const p1 = path.resolve(process.cwd(), 'scripts', 'payloads', name);
    const p2 = path.resolve(process.cwd(), 'scripts', 'payloads', 'topics', name);

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
  }

  console.log('🎉 B7 Data Handling & Probability Question Bank expansion completed successfully.');
}

seedB7DataPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B7 data pool:', err);
    process.exit(1);
  });
