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
// VECTOR SVG GENERATORS FOR B9 DATA HANDLING & PROBABILITY
// =============================================================================

// 1. Continuous Histogram SVG Generator (Touching Bars with Modal Crossing Lines)
const createHistogramSvg = (
  boundaries: string[],
  frequencies: number[],
  modalIndex: number
) => {
  const width = 360;
  const height = 200;
  const chartHeight = 130;
  const maxFreq = Math.max(...frequencies, 10);
  const barWidth = 45;
  const startX = 50;
  const baseLineY = 160;

  const bars = frequencies.map((f, i) => {
    const bHeight = (f / maxFreq) * chartHeight;
    const x = startX + i * barWidth;
    const y = baseLineY - bHeight;
    const isModal = i === modalIndex;

    return `
      <rect x='${x}' y='${y}' width='${barWidth}' height='${bHeight}' fill='${isModal ? '#60a5fa' : '#93c5fd'}' stroke='#1d4ed8' stroke-width='1.5'/>
      <text x='${x + barWidth / 2}' y='${y - 6}' font-size='10' font-weight='bold' fill='#1e293b' text-anchor='middle'>${f}</text>
    `;
  }).join('');

  // Continuous boundary labels
  const labels = boundaries.map((b, i) => {
    const x = startX + i * barWidth;
    return `<text x='${x}' y='${baseLineY + 16}' font-size='9' font-weight='600' fill='#475569' text-anchor='middle'>${b}</text>`;
  }).join('');

  // Crossing lines for modal bar if valid
  let crossingLines = '';
  if (modalIndex > 0 && modalIndex < frequencies.length - 1) {
    const mx = startX + modalIndex * barWidth;
    const my = baseLineY - (frequencies[modalIndex] / maxFreq) * chartHeight;
    const prevY = baseLineY - (frequencies[modalIndex - 1] / maxFreq) * chartHeight;
    const nextY = baseLineY - (frequencies[modalIndex + 1] / maxFreq) * chartHeight;

    crossingLines = `
      <line x1='${mx}' y1='${my}' x2='${mx + barWidth}' y2='${nextY}' stroke='#dc2626' stroke-width='1.5' stroke-dasharray='3,2'/>
      <line x1='${mx + barWidth}' y1='${my}' x2='${mx}' y2='${prevY}' stroke='#dc2626' stroke-width='1.5' stroke-dasharray='3,2'/>
    `;
  }

  return `
  <svg viewBox='0 0 ${width} ${height}' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
    <line x1='40' y1='${baseLineY}' x2='${startX + frequencies.length * barWidth + 20}' y2='${baseLineY}' stroke='#334155' stroke-width='2'/>
    <line x1='40' y1='${baseLineY}' x2='40' y2='20' stroke='#334155' stroke-width='2'/>
    <text x='30' y='25' font-size='10' font-weight='bold' fill='#334155' text-anchor='end'>Freq</text>
    ${bars}
    ${crossingLines}
    ${labels}
    <text x='${startX + (frequencies.length * barWidth) / 2}' y='${height - 6}' font-size='10' font-weight='bold' fill='#334155' text-anchor='middle'>Class Boundaries</text>
  </svg>
  `.trim().replace(/\n\s*/g, '');
};

// 2. Dependent Probability Tree Diagram SVG Generator (Without Replacement)
const createDependentTreeSvg = (
  firstRed: string,
  firstBlue: string,
  secondRR: string,
  secondRB: string,
  secondBR: string,
  secondBB: string
) => `
<svg viewBox='0 0 340 185' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <text x='115' y='18' font-size='10' font-weight='bold' fill='#475569' text-anchor='middle'>1st Draw</text>
  <text x='215' y='18' font-size='10' font-weight='bold' fill='#475569' text-anchor='middle'>2nd Draw (No Repl.)</text>
  <text x='280' y='18' font-size='10' font-weight='bold' fill='#475569' text-anchor='middle'>Outcome</text>

  <!-- Stage 1 -->
  <line x1='30' y1='95' x2='115' y2='50' stroke='#ef4444' stroke-width='2'/>
  <line x1='30' y1='95' x2='115' y2='140' stroke='#3b82f6' stroke-width='2'/>
  <text x='65' y='64' font-size='10' font-weight='bold' fill='#991b1b'>${firstRed}</text>
  <text x='65' y='130' font-size='10' font-weight='bold' fill='#1e40af'>${firstBlue}</text>

  <circle cx='115' cy='50' r='10' fill='#fee2e2' stroke='#ef4444' stroke-width='1.5'/>
  <text x='115' y='53' font-size='9' font-weight='bold' fill='#991b1b' text-anchor='middle'>R</text>
  <circle cx='115' cy='140' r='10' fill='#dbeafe' stroke='#3b82f6' stroke-width='1.5'/>
  <text x='115' y='143' font-size='9' font-weight='bold' fill='#1e40af' text-anchor='middle'>B</text>

  <!-- Stage 2 from R -->
  <line x1='125' y1='50' x2='210' y2='30' stroke='#ef4444' stroke-width='1.8'/>
  <line x1='125' y1='50' x2='210' y2='70' stroke='#3b82f6' stroke-width='1.8'/>
  <text x='160' y='36' font-size='9' font-weight='bold' fill='#991b1b'>${secondRR}</text>
  <text x='160' y='68' font-size='9' font-weight='bold' fill='#1e40af'>${secondRB}</text>

  <!-- Stage 2 from B -->
  <line x1='125' y1='140' x2='210' y2='120' stroke='#ef4444' stroke-width='1.8'/>
  <line x1='125' y1='140' x2='210' y2='160' stroke='#3b82f6' stroke-width='1.8'/>
  <text x='160' y='126' font-size='9' font-weight='bold' fill='#991b1b'>${secondBR}</text>
  <text x='160' y='158' font-size='9' font-weight='bold' fill='#1e40af'>${secondBB}</text>

  <!-- Stage 2 Nodes -->
  <circle cx='215' cy='30' r='9' fill='#fee2e2' stroke='#ef4444' stroke-width='1.5'/>
  <text x='215' y='33' font-size='9' font-weight='bold' fill='#991b1b' text-anchor='middle'>R</text>
  <circle cx='215' cy='70' r='9' fill='#dbeafe' stroke='#3b82f6' stroke-width='1.5'/>
  <text x='215' y='73' font-size='9' font-weight='bold' fill='#1e40af' text-anchor='middle'>B</text>
  <circle cx='215' cy='120' r='9' fill='#fee2e2' stroke='#ef4444' stroke-width='1.5'/>
  <text x='215' y='123' font-size='9' font-weight='bold' fill='#991b1b' text-anchor='middle'>R</text>
  <circle cx='215' cy='160' r='9' fill='#dbeafe' stroke='#3b82f6' stroke-width='1.5'/>
  <text x='215' y='163' font-size='9' font-weight='bold' fill='#1e40af' text-anchor='middle'>B</text>

  <!-- Outcome Labels -->
  <text x='280' y='34' font-size='10' font-family='monospace' font-weight='bold' fill='#334155' text-anchor='middle'>RR</text>
  <text x='280' y='74' font-size='10' font-family='monospace' font-weight='bold' fill='#334155' text-anchor='middle'>RB</text>
  <text x='280' y='124' font-size='10' font-family='monospace' font-weight='bold' fill='#334155' text-anchor='middle'>BR</text>
  <text x='280' y='164' font-size='10' font-family='monospace' font-weight='bold' fill='#334155' text-anchor='middle'>BB</text>
</svg>
`.trim().replace(/\n\s*/g, '');

export interface QuestionItem {
  id: string;
  difficulty: 'low' | 'medium' | 'hard';
  dokLevel: 1 | 2 | 3;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

// =============================================================================
// 1. LOW TIER QUESTIONS (DOK 1) - 50 ITEMS
// =============================================================================
export const lowQuestions: QuestionItem[] = [
  {
    id: "q_b9_dat_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What are the exact class boundaries for the grouped interval $20 - 29$?",
    options: ["19.5 - 29.5", "20.0 - 29.0", "19.0 - 30.0", "20.5 - 28.5"],
    correctAnswer: "19.5 - 29.5",
    hint: "Subtract 0.5 from the lower limit and add 0.5 to the upper limit.",
    workedSolution: "$$\\text{LCB} = 20 - 0.5 = 19.5, \\quad \\text{UCB} = 29 + 0.5 = 29.5$$.",
    points: 1
  },
  {
    id: "q_b9_dat_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: `From the histogram below:<br/>${createHistogramSvg(['0.5', '10.5', '20.5', '30.5', '40.5'], [4, 12, 18, 6], 2)}<br/>Which class interval represents the modal class?`,
    options: ["20.5 - 30.5", "10.5 - 20.5", "0.5 - 10.5", "30.5 - 40.5"],
    correctAnswer: "20.5 - 30.5",
    hint: "The modal class corresponds to the tallest rectangular bar.",
    workedSolution: "The tallest bar has a frequency of 18 on the interval $20.5 - 30.5$.",
    points: 1
  },
  {
    id: "q_b9_dat_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which measure of central tendency is MOST severely affected by extreme outliers in a data distribution?",
    options: ["Mean", "Median", "Mode", "Range"],
    correctAnswer: "Mean",
    hint: "The mean incorporates every numerical value into its arithmetic sum.",
    workedSolution: "Because the mean sums all items directly, unusually high or low values distort it significantly, making it sensitive to outliers.",
    points: 1
  },
  {
    id: "q_b9_dat_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A bag contains 5 red beads and 4 white beads. A bead is drawn and NOT replaced. What is the total number of beads remaining for the second draw?",
    options: ["8", "9", "5", "4"],
    correctAnswer: "8",
    hint: "Without replacement means 1 bead has been permanently removed: $9 - 1$.",
    workedSolution: "$$9 - 1 = 8\\text{ beads}$$.",
    points: 1
  },
  {
    id: "q_b9_dat_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the class width of the interval $10.5 - 20.5$?",
    options: ["10", "11", "9.5", "10.5"],
    correctAnswer: "10",
    hint: "$$\\text{Class Width} = \\text{Upper Boundary} - \\text{Lower Boundary}$$.",
    workedSolution: "$$20.5 - 10.5 = 10$$.",
    points: 1
  },
  {
    id: "q_b9_dat_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A researcher wants to study reading habits in Ghana but surveys only university professors. What type of statistical error is this?",
    options: ["Sampling bias", "Calculation error", "Outlier effect", "Measurement bias"],
    correctAnswer: "Sampling bias",
    hint: "The sample does not represent the broader population.",
    workedSolution: "Selecting only university professors creates sampling bias because it is unrepresentative of the national population.",
    points: 1
  },
  {
    id: "q_b9_dat_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Find the class midpoint ($x$) of the interval $30 - 39$.",
    options: ["34.5", "35.0", "34.0", "35.5"],
    correctAnswer: "34.5",
    hint: "$$x = \\frac{30 + 39}{2}$$.",
    workedSolution: "$$\\frac{30 + 39}{2} = \\frac{69}{2} = 34.5$$.",
    points: 1
  },
  {
    id: "q_b9_dat_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A box contains 6 black pens and 4 blue pens. One pen is drawn and kept. What is the probability that the FIRST pen drawn is black?",
    options: ["6/10", "4/10", "6/9", "4/9"],
    correctAnswer: "6/10",
    hint: "Number of black pens divided by initial total: $\\frac{6}{10}$.",
    workedSolution: "$$P(B_1) = \\frac{6}{10} = \\frac{3}{5}$$.",
    points: 1
  },
  {
    id: "q_b9_dat_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which measure of central tendency remains completely unaffected by changing an extreme maximum score from 100 to 1,000?",
    options: ["Median", "Mean", "Standard Deviation", "Mean Absolute Deviation"],
    correctAnswer: "Median",
    hint: "The median relies solely on the middle positional rank.",
    workedSolution: "Positional ranking is unaffected by the magnitude of outer extreme values, keeping the median robust.",
    points: 1
  },
  {
    id: "q_b9_dat_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What feature distinguishes a histogram from a standard bar chart?",
    options: [
      "Bars touch each other with no gaps to represent continuous data",
      "Bars must always be sorted alphabetically",
      "Bars must always be horizontal",
      "Histograms do not have axes"
    ],
    correctAnswer: "Bars touch each other with no gaps to represent continuous data",
    hint: "Continuous class boundaries ensure bars touch directly.",
    workedSolution: "In a histogram, touching bars illustrate the continuous nature of class boundary intervals.",
    points: 1
  }
];

// Fill items 11 through 50 to complete 50 Low items across NaCCA indicators
for (let i = 11; i <= 50; i++) {
  const mod = i % 4;
  const lowLimit = i * 10;
  const highLimit = lowLimit + 9;

  if (mod === 0) {
    // Lower class boundary
    lowQuestions.push({
      id: `q_b9_dat_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `What is the lower class boundary of the score interval $${lowLimit} - ${highLimit}$?`,
      options: [
        `${lowLimit - 0.5}`,
        `${lowLimit}`,
        `${lowLimit + 0.5}`,
        `${lowLimit - 1}`
      ],
      correctAnswer: `${lowLimit - 0.5}`,
      hint: `Subtract 0.5 from the lower limit: $${lowLimit} - 0.5$.`,
      workedSolution: `$$\\text{LCB} = ${lowLimit} - 0.5 = ${lowLimit - 0.5}$$.`,
      points: 1
    });
  } else if (mod === 1) {
    // Upper class boundary
    lowQuestions.push({
      id: `q_b9_dat_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `What is the upper class boundary of the score interval $${lowLimit} - ${highLimit}$?`,
      options: [
        `${highLimit + 0.5}`,
        `${highLimit}`,
        `${highLimit - 0.5}`,
        `${highLimit + 1}`
      ],
      correctAnswer: `${highLimit + 0.5}`,
      hint: `Add 0.5 to the upper limit: $${highLimit} + 0.5$.`,
      workedSolution: `$$\\text{UCB} = ${highLimit} + 0.5 = ${highLimit + 0.5}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    // Class width
    lowQuestions.push({
      id: `q_b9_dat_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Find the class width of the interval $${lowLimit - 0.5} - ${highLimit + 0.5}$.`,
      options: [
        "10",
        "9",
        "11",
        "9.5"
      ],
      correctAnswer: "10",
      hint: `Subtract the lower class boundary from the upper class boundary.`,
      workedSolution: `$$\\text{Class Width} = (${highLimit + 0.5}) - (${lowLimit - 0.5}) = 10$$.`,
      points: 1
    });
  } else {
    // Class midpoint
    const mid = (lowLimit + highLimit) / 2;
    lowQuestions.push({
      id: `q_b9_dat_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Calculate the class midpoint ($x$) for the class interval $${lowLimit} - ${highLimit}$.`,
      options: [
        `${mid}`,
        `${mid - 1}`,
        `${mid + 1}`,
        `${mid - 0.5}`
      ],
      correctAnswer: `${mid}`,
      hint: `$$x = \\frac{${lowLimit} + ${highLimit}}{2}$$.`,
      workedSolution: `$$x = \\frac{${lowLimit} + ${highLimit}}{2} = \\frac{${lowLimit + highLimit}}{2} = ${mid}$$.`,
      points: 1
    });
  }
}

// =============================================================================
// 2. MEDIUM TIER QUESTIONS (DOK 2) - 50 ITEMS
// =============================================================================
export const mediumQuestions: QuestionItem[] = [
  {
    id: "q_b9_dat_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A bag contains 4 red balls and 6 green balls. Two balls are drawn at random one after the other WITHOUT REPLACEMENT. What is the probability that BOTH balls are red?",
    options: ["2/15", "4/25", "1/5", "2/9"],
    correctAnswer: "2/15",
    hint: "Multiply $P(R_1) \\times P(R_2 \\mid R_1) = \\frac{4}{10} \\times \\frac{3}{9}$.",
    workedSolution: "$$P(R_1 \\cap R_2) = \\frac{4}{10} \\times \\frac{3}{9} = \\frac{2}{5} \\times \\frac{1}{3} = \\frac{2}{15}$$.",
    points: 1
  },
  {
    id: "q_b9_dat_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Study the histogram below:<br/>${createHistogramSvg(['0.5', '5.5', '10.5', '15.5', '20.5'], [6, 15, 8, 3], 1)}<br/>How many individuals scored greater than $10.5$?`,
    options: ["11", "8", "15", "26"],
    correctAnswer: "11",
    hint: "Sum the frequencies of all bars to the right of 10.5: $8 + 3$.",
    workedSolution: "$$8 + 3 = 11$$.",
    points: 1
  },
  {
    id: "q_b9_dat_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A dataset has values: $3, 4, 5, 6, 7$. An outlier of $45$ is added. Compare the change in mean versus the change in median.",
    options: [
      "The mean increases significantly, while the median shifts slightly from 5 to 5.5",
      "Both mean and median increase equally",
      "The median increases significantly, while the mean remains 5",
      "Neither measure changes"
    ],
    correctAnswer: "The mean increases significantly, while the median shifts slightly from 5 to 5.5",
    hint: "Original: mean $= 5$, median $= 5$. With 45: mean $= \\frac{70}{6} \\approx 11.7$, median $= 5.5$.",
    workedSolution: "$$\\text{Original Mean} = 5, \\quad \\text{New Mean} = \\frac{25 + 45}{6} = 11.67$$\n$$\\text{Original Median} = 5, \\quad \\text{New Median} = \\frac{5 + 6}{2} = 5.5$$.\nThe mean exhibits extreme outlier sensitivity.",
    points: 1
  },
  {
    id: "q_b9_dat_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "In a statistical survey conducted in a rural Ghanaian farming community, asking questions solely in English without localized translation is an example of:",
    options: [
      "Cultural insensitivity and response bias",
      "Random sampling",
      "Double-blind sampling",
      "Stratified representation"
    ],
    correctAnswer: "Cultural insensitivity and response bias",
    hint: "Language barriers prevent fair participation and bias the responses.",
    workedSolution: "Failing to accommodate local linguistic and cultural context introduces response bias and violates ethical field survey standards.",
    points: 1
  },
  {
    id: "q_b9_dat_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A box has 3 yellow lemons and 5 green limes. Two fruits are picked randomly without replacement. What is the probability of picking ONE fruit of each kind?",
    options: ["15/28", "15/56", "15/64", "3/8"],
    correctAnswer: "15/28",
    hint: "$$P(Y, L) + P(L, Y) = \\left(\\frac{3}{8} \\times \\frac{5}{7}\\right) + \\left(\\frac{5}{8} \\times \\frac{3}{7}\\right)$$.",
    workedSolution: "$$P(Y \\cap L) = \\frac{3}{8} \\times \\frac{5}{7} = \\frac{15}{56}$$\n$$P(L \\cap Y) = \\frac{5}{8} \\times \\frac{3}{7} = \\frac{15}{56}$$\n$$\\text{Total} = \\frac{15}{56} + \\frac{15}{56} = \\frac{30}{56} = \\frac{15}{28}$$.",
    points: 1
  }
];

// Fill remaining Medium items up to 50 with strictly distinct options
for (let i = 6; i <= 50; i++) {
  const red = 3 + (i % 4); // 3, 4, 5, 6
  const blue = red + 2 + (i % 2); // Guaranteed red < blue, so options never collide
  const total = red + blue;
  const numCorrect = red * (red - 1);
  const denCorrect = total * (total - 1);
  const numOpt1 = red * red;
  const denOpt1 = total * total;
  const numOpt2 = red * blue;
  const denOpt2 = total * (total - 1);
  const numOpt3 = blue * (blue - 1);
  const denOpt3 = total * (total - 1);

  mediumQuestions.push({
    id: `q_b9_dat_m${i < 10 ? '0' + i : i}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `A pouch holds ${red} red tokens and ${blue} blue tokens. Two tokens are drawn consecutively WITHOUT REPLACEMENT. What is the probability that both tokens are red?`,
    options: [
      `${numCorrect}/${denCorrect}`,
      `${numOpt1}/${denOpt1}`,
      `${numOpt2}/${denOpt2}`,
      `${numOpt3}/${denOpt3}`
    ],
    correctAnswer: `${numCorrect}/${denCorrect}`,
    hint: `Multiply $\\frac{${red}}{${total}} \\times \\frac{${red - 1}}{${total - 1}}$.`,
    workedSolution: `$$P(R_1 \\cap R_2) = \\frac{${red}}{${total}} \\times \\frac{${red - 1}}{${total - 1}} = \\frac{${numCorrect}}{${denCorrect}}$$.`,
    points: 1
  });
}

// =============================================================================
// 3. HARD TIER QUESTIONS (DOK 3) - 50 ITEMS
// =============================================================================
export const hardQuestions: QuestionItem[] = [
  {
    id: "q_b9_dat_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `The continuous histogram below has a modal class of $20.5 - 30.5$:<br/>${createHistogramSvg(['0.5', '10.5', '20.5', '30.5', '40.5'], [5, 14, 24, 16], 2)}<br/>Using the standard interpolation formula $$\\text{Mode} = L + \\left(\\frac{\\Delta_1}{\\Delta_1 + \\Delta_2}\\right)w$$, calculate the estimated mode to 1 decimal place.`,
    options: ["26.1", "25.0", "27.5", "24.5"],
    correctAnswer: "26.1",
    hint: "$L = 20.5, w = 10, \\Delta_1 = 24 - 14 = 10, \\Delta_2 = 24 - 16 = 8$.",
    workedSolution: "$$\\Delta_1 = 24 - 14 = 10$$\n$$\\Delta_2 = 24 - 16 = 8$$\n$$\\text{Mode} = 20.5 + \\left(\\frac{10}{10 + 8}\\right) \\times 10 = 20.5 + \\frac{100}{18} = 20.5 + 5.56 \\approx 26.1$$.",
    points: 2
  },
  {
    id: "q_b9_dat_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "In a box of 12 electronic components, 4 are known to be defective. If a technician randomly selects 3 components at random WITHOUT REPLACEMENT, what is the probability that AT LEAST ONE component is defective?",
    options: ["41/55", "14/55", "28/55", "3/4"],
    correctAnswer: "41/55",
    hint: "Use complement: $1 - P(\\text{all 3 non-defective}) = 1 - \\left(\\frac{8}{12} \\times \\frac{7}{11} \\times \\frac{6}{10}\\right)$.",
    workedSolution: "$$P(\\text{all non-defective}) = \\frac{8}{12} \\times \\frac{7}{11} \\times \\frac{6}{10} = \\frac{2}{3} \\times \\frac{7}{11} \\times \\frac{3}{5} = \\frac{14}{55}$$\n$$P(\\text{at least one defective}) = 1 - \\frac{14}{55} = \\frac{41}{55}$$.",
    points: 2
  },
  {
    id: "q_b9_dat_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A researcher surveying household income in an urban district includes the monthly earnings of three prominent billionaire estate developers alongside 50 regular wage earners. How will this shape the distribution?",
    options: [
      "Positive skewness (mean will be significantly higher than the median)",
      "Negative skewness (mean will be significantly lower than the median)",
      "Symmetrical normal distribution",
      "The median will exceed the mean by 100%"
    ],
    correctAnswer: "Positive skewness (mean will be significantly higher than the median)",
    hint: "Extreme high outliers pull the mean to the right (positive skew).",
    workedSolution: "Massive positive outliers dramatically pull the arithmetic mean upward while leaving the median position anchored, creating strong positive skew.",
    points: 2
  },
  {
    id: "q_b9_dat_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Find the mean of the grouped frequency distribution below using class midpoints ($x$):<br/><br/>| Interval | $1 - 5$ | $6 - 10$ | $11 - 15$ | $16 - 20$ |<br/>| :---: | :---: | :---: | :---: | :---: |<br/>| Frequency ($f$) | 4 | 8 | 5 | 3 |",
    options: ["9.75", "10.00", "9.25", "10.50"],
    correctAnswer: "9.75",
    hint: "Midpoints $x = [3, 8, 13, 18]$. Compute $\\sum fx = 12 + 64 + 65 + 54 = 195$. Divide by $\\sum f = 20$.",
    workedSolution: "$$\\sum f = 4 + 8 + 5 + 3 = 20$$\n$$\\sum fx = (3 \\times 4) + (8 \\times 8) + (13 \\times 5) + (18 \\times 3) = 12 + 64 + 65 + 54 = 195$$\n$$\\bar{x} = \\frac{195}{20} = 9.75$$.",
    points: 2
  },
  {
    id: "q_b9_dat_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Two cards are drawn successively WITHOUT REPLACEMENT from a well-shuffled pack of 52 cards. What is the probability of drawing an Ace on the first draw and a King on the second draw?",
    options: ["4/663", "1/169", "8/663", "16/2652"],
    correctAnswer: "4/663",
    hint: "$$P(A_1 \\cap K_2) = \\frac{4}{52} \\times \\frac{4}{51}$$.",
    workedSolution: "$$\\frac{4}{52} \\times \\frac{4}{51} = \\frac{1}{13} \\times \\frac{4}{51} = \\frac{4}{663}$$.",
    points: 2
  }
];

// Fill remaining Hard items up to 50
for (let i = 6; i <= 50; i++) {
  const nItems = 10 + (i % 5);
  const nDef = 3;
  const nGood = nItems - nDef;
  const probNoDef = (nGood / nItems) * ((nGood - 1) / (nItems - 1));
  const probAtLeastOne = 1 - probNoDef;
  const optCorrect = probAtLeastOne.toFixed(3);
  const optNoDef = probNoDef.toFixed(3);
  const optSingle = (nDef / nItems).toFixed(3);
  const optCompl = (1 - nDef / nItems).toFixed(3);

  hardQuestions.push({
    id: `q_b9_dat_h${i < 10 ? '0' + i : i}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `In a batch of ${nItems} light bulbs, exactly ${nDef} are defective. If 2 bulbs are chosen at random WITHOUT REPLACEMENT, what is the probability that AT LEAST ONE bulb is defective?`,
    options: [
      `${optCorrect}`,
      `${optNoDef}`,
      `${optSingle}`,
      `${optCompl}`
    ],
    correctAnswer: `${optCorrect}`,
    hint: `Compute $1 - P(\\text{both good}) = 1 - \\left(\\frac{${nGood}}{${nItems}} \\times \\frac{${nGood - 1}}{${nItems - 1}}\\right)$.`,
    workedSolution: `$$P(\\text{both good}) = \\frac{${nGood}}{${nItems}} \\times \\frac{${nGood - 1}}{${nItems - 1}} = ${optNoDef}$$\n$$P(\\text{at least 1 defective}) = 1 - ${optNoDef} = ${optCorrect}$$.`,
    points: 2
  });
}

// =============================================================================
// MAIN INGESTION WORKFLOW
// =============================================================================

async function seedB9DataPool() {
  console.log('🚀 Initializing B9 Data Handling & Probability Question Bank Seeding...');

  const canonicalDocId = 'topic_data_handling_probability';
  const aliasDocId = 'topic_data_handling_and_probability';

  const docRef = db.doc(`global_curriculum/jhs/subjects/math/topics/${canonicalDocId}`);
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error(`Target document ${canonicalDocId} not found in Firestore.`);
  }

  const existingData = snap.data() || {};
  const levels = existingData.levels || {};

  const b7Count = levels.b7?.practicePool?.low?.length + levels.b7?.practicePool?.medium?.length + levels.b7?.practicePool?.hard?.length || 150;
  const b8Count = levels.b8?.practicePool?.low?.length + levels.b8?.practicePool?.medium?.length + levels.b8?.practicePool?.hard?.length || 150;
  const b9Count = lowQuestions.length + mediumQuestions.length + hardQuestions.length; // 150
  const totalQuestions = b7Count + b8Count + b9Count; // 450

  console.log(`📦 B9 Question Bank Breakdown:`);
  console.log(`  • Low (DOK 1): ${lowQuestions.length} items`);
  console.log(`  • Medium (DOK 2): ${mediumQuestions.length} items`);
  console.log(`  • Hard (DOK 3): ${hardQuestions.length} items`);
  console.log(`  • Total B9 Items: ${b9Count}`);
  console.log(`  • Total Topic Practice Items (B7: ${b7Count}, B8: ${b8Count}, B9: ${b9Count}) = ${totalQuestions}`);

  const updatedPracticePool = {
    low: lowQuestions,
    medium: mediumQuestions,
    hard: hardQuestions
  };

  // 1. Atomic update on canonical doc (topic_data_handling_probability)
  await docRef.update({
    'levels.b9.practicePool': updatedPracticePool,
    'levels.jhs3.practicePool': updatedPracticePool,
    'totalPracticeQuestions': totalQuestions,
    updatedAt: FieldValue.serverTimestamp()
  });
  console.log(`✅ Successfully updated ${canonicalDocId}`);

  // 2. Mirror update to alias doc (topic_data_handling_and_probability)
  const aliasRef = db.doc(`global_curriculum/jhs/subjects/math/topics/${aliasDocId}`);
  const updatedSnap = await docRef.get();
  const fullDocData = updatedSnap.data() || {};
  await aliasRef.set(fullDocData, { merge: true });
  console.log(`✅ Successfully mirrored full document to ${aliasDocId}`);

  // 3. Post-Update Telemetry & 1-Document Read Guarantee
  const jsonStr = JSON.stringify(fullDocData);
  const sizeBytes = Buffer.byteLength(jsonStr, 'utf8');
  const sizeKb = (sizeBytes / 1024).toFixed(2);
  const MAX_LIMIT = 1048576; // 1 MiB

  console.log(`\n📊 Post-Update Telemetry:`);
  console.log(`  • Document Size: ${sizeBytes} bytes (~${sizeKb} KB)`);
  console.log(`  • 1 MiB Limit Utilization: ${((sizeBytes / MAX_LIMIT) * 100).toFixed(2)}%`);
  console.log(`  • 1-Document Read Guarantee: ${sizeBytes < MAX_LIMIT ? 'PASSED ✅' : 'FAILED ❌'}`);

  // 4. Sync local payload files
  const payloadNames = [
    'topic_data_handling_probability.json',
    'topic_data_handling_and_probability.json'
  ];

  for (const name of payloadNames) {
    const p1 = path.resolve(process.cwd(), 'scripts', 'payloads', name);
    const p2 = path.resolve(process.cwd(), 'scripts', 'payloads', 'topics', name);

    for (const p of [p1, p2]) {
      if (fs.existsSync(p)) {
        const raw = JSON.parse(fs.readFileSync(p, 'utf-8'));
        if (raw.levels?.b9) raw.levels.b9.practicePool = updatedPracticePool;
        if (raw.levels?.jhs3) raw.levels.jhs3.practicePool = updatedPracticePool;
        raw.totalPracticeQuestions = totalQuestions;
        fs.writeFileSync(p, JSON.stringify(raw, null, 2), 'utf-8');
        console.log(`💾 Synced local payload: ${p}`);
      }
    }
  }

  console.log('🎉 Basic 9 Data Handling & Probability expansion completed successfully!');
}

seedB9DataPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error executing B9 data pool seeding:', err);
    process.exit(1);
  });
