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

// 1. Complementary Angle SVG (90 degrees right angle divided by a ray)
const createComplementarySvg = (angleA: string, angleB: string) => `
<svg viewBox='0 0 240 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <line x1='40' y1='140' x2='200' y2='140' stroke='#1e293b' stroke-width='3'/>
  <line x1='40' y1='140' x2='40' y2='20' stroke='#1e293b' stroke-width='3'/>
  <rect x='40' y='124' width='16' height='16' fill='none' stroke='#475569' stroke-width='1.5'/>
  <line x1='40' y1='140' x2='155' y2='45' stroke='#2563eb' stroke-width='2.5'/>
  <path d='M 75 140 A 35 35 0 0 0 65 118' fill='none' stroke='#dc2626' stroke-width='2'/>
  <text x='92' y='132' font-size='12' font-weight='bold' fill='#dc2626'>${angleA}</text>
  <path d='M 65 118 A 35 35 0 0 0 40 105' fill='none' stroke='#2563eb' stroke-width='2'/>
  <text x='58' y='95' font-size='12' font-weight='bold' fill='#2563eb'>${angleB}</text>
  <text x='130' y='25' font-size='11' font-weight='bold' fill='#64748b'>Sum = 90°</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Supplementary Angle SVG (180 degrees straight line divided by a ray)
const createSupplementarySvg = (angleA: string, angleB: string) => `
<svg viewBox='0 0 320 150' width='100%' height='130' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <line x1='25' y1='110' x2='295' y2='110' stroke='#1e293b' stroke-width='3'/>
  <line x1='160' y1='110' x2='225' y2='30' stroke='#2563eb' stroke-width='2.5'/>
  <path d='M 125 110 A 35 35 0 0 1 187 77' fill='none' stroke='#dc2626' stroke-width='2'/>
  <text x='115' y='85' font-size='12' font-weight='bold' fill='#dc2626'>${angleA}</text>
  <path d='M 187 77 A 35 35 0 0 1 195 110' fill='none' stroke='#2563eb' stroke-width='2'/>
  <text x='205' y='95' font-size='12' font-weight='bold' fill='#2563eb'>${angleB}</text>
  <text x='160' y='138' font-size='11' font-weight='bold' fill='#64748b' text-anchor='middle'>Straight Line = 180°</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 3. Triangle with Perpendicular Height SVG
const createTriangleSvg = (base: string, height: string) => `
<svg viewBox='0 0 280 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <polygon points='50,140 230,140 140,35' fill='#dbeafe' stroke='#1e40af' stroke-width='2.5'/>
  <line x1='140' y1='35' x2='140' y2='140' stroke='#dc2626' stroke-width='2' stroke-dasharray='4'/>
  <rect x='140' y='126' width='14' height='14' fill='none' stroke='#dc2626' stroke-width='1.5'/>
  <text x='148' y='90' font-size='12' font-weight='bold' fill='#dc2626'>h = ${height}</text>
  <text x='140' y='162' font-size='12' font-weight='bold' fill='#1e3a8a' text-anchor='middle'>base = ${base}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 4. Circle SVG with Radius/Diameter
const createCircleSvg = (dimensionLabel: string, isDiameter = false) => `
<svg viewBox='0 0 220 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <circle cx='110' cy='90' r='60' fill='#f0fdf4' stroke='#15803d' stroke-width='2'/>
  <circle cx='110' cy='90' r='3' fill='#0f172a'/>
  <text x='105' y='85' font-size='10' font-weight='bold' fill='#0f172a'>O</text>
  ${
    isDiameter
      ? `<line x1='50' y1='90' x2='170' y2='90' stroke='#dc2626' stroke-width='2'/><text x='110' y='110' font-size='11' font-weight='bold' fill='#dc2626' text-anchor='middle'>d = ${dimensionLabel}</text>`
      : `<line x1='110' y1='90' x2='170' y2='90' stroke='#dc2626' stroke-width='2'/><text x='140' y='82' font-size='11' font-weight='bold' fill='#dc2626' text-anchor='middle'>r = ${dimensionLabel}</text>`
  }
</svg>
`.trim().replace(/\n\s*/g, '');

// -----------------------------------------------------------------------------
// 1. LOW TIER QUESTIONS (DOK 1) - 50 Items
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b7_geo_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Find the value of $x$ in the right-angled figure below:<br/>${createComplementarySvg('x', '35°')}`,
    options: ["55°", "65°", "145°", "45°"],
    correctAnswer: "55°",
    hint: "Complementary angles sum to $90^\\circ$. Subtract $35^\\circ$ from $90^\\circ$.",
    workedSolution: "$$x + 35^\\circ = 90^\\circ \\implies x = 90^\\circ - 35^\\circ = 55^\\circ$$.",
    points: 1
  },
  {
    id: "q_b7_geo_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Calculate the angle $y$ on the straight line below:<br/>${createSupplementarySvg('y', '65°')}`,
    options: ["115°", "125°", "25°", "105°"],
    correctAnswer: "115°",
    hint: "Angles on a straight line sum to $180^\\circ$. Subtract $65^\\circ$ from $180^\\circ$.",
    workedSolution: "$$y + 65^\\circ = 180^\\circ \\implies y = 180^\\circ - 65^\\circ = 115^\\circ$$.",
    points: 1
  },
  {
    id: "q_b7_geo_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Calculate the area of the triangle shown below:<br/>${createTriangleSvg('12 cm', '8 cm')}`,
    options: ["48 cm²", "96 cm²", "20 cm²", "24 cm²"],
    correctAnswer: "48 cm²",
    hint: "Use the triangle area formula: $A = \\frac{1}{2} \\times b \\times h$.",
    workedSolution: "$$A = \\frac{1}{2} \\times 12 \\times 8 = 6 \\times 8 = 48\\text{ cm}^2$$.",
    points: 1
  },
  {
    id: "q_b7_geo_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Find the circumference of the circle below (Take $\\pi = \\frac{22}{7}$):<br/>${createCircleSvg('7 cm', false)}`,
    options: ["44 cm", "22 cm", "154 cm", "88 cm"],
    correctAnswer: "44 cm",
    hint: "Use circumference formula: $C = 2\\pi r$.",
    workedSolution: "$$C = 2 \\times \\frac{22}{7} \\times 7 = 44\\text{ cm}$$.",
    points: 1
  },
  {
    id: "q_b7_geo_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Which of the following describes an angle that measures strictly between $90^\\circ$ and $180^\\circ$?",
    options: ["Obtuse angle", "Acute angle", "Reflex angle", "Right angle"],
    correctAnswer: "Obtuse angle",
    hint: "Acute is $< 90^\\circ$, right is $90^\\circ$, and obtuse is between $90^\\circ$ and $180^\\circ$.",
    workedSolution: "An angle measuring greater than $90^\\circ$ but less than $180^\\circ$ is defined as an obtuse angle.",
    points: 1
  },
  {
    id: "q_b7_geo_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the complement of an angle of $42^\\circ$?",
    options: ["48°", "138°", "58°", "38°"],
    correctAnswer: "48°",
    hint: "Subtract $42^\\circ$ from $90^\\circ$.",
    workedSolution: "$$90^\\circ - 42^\\circ = 48^\\circ$$.",
    points: 1
  },
  {
    id: "q_b7_geo_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the supplement of an angle of $75^\\circ$?",
    options: ["105°", "15°", "115°", "95°"],
    correctAnswer: "105°",
    hint: "Subtract $75^\\circ$ from $180^\\circ$.",
    workedSolution: "$$180^\\circ - 75^\\circ = 105^\\circ$$.",
    points: 1
  },
  {
    id: "q_b7_geo_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Find the circumference of a circle with a diameter of $14\\text{ cm}$ (Take $\\pi = \\frac{22}{7}$):<br/>${createCircleSvg('14 cm', true)}`,
    options: ["44 cm", "88 cm", "154 cm", "22 cm"],
    correctAnswer: "44 cm",
    hint: "Use $C = \\pi d = \\frac{22}{7} \\times 14$.",
    workedSolution: "$$C = \\pi d = \\frac{22}{7} \\times 14 = 22 \\times 2 = 44\\text{ cm}$$.",
    points: 1
  },
  {
    id: "q_b7_geo_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "An angle that is greater than $180^\\circ$ but less than $360^\\circ$ is classified as a:",
    options: ["Reflex angle", "Obtuse angle", "Straight angle", "Acute angle"],
    correctAnswer: "Reflex angle",
    hint: "Think of an angle beyond a straight line.",
    workedSolution: "Angles between $180^\\circ$ and $360^\\circ$ are known as reflex angles.",
    points: 1
  },
  {
    id: "q_b7_geo_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A right-angled triangle has a base of $6\\text{ cm}$ and a height of $5\\text{ cm}$. Find its area.",
    options: ["15 cm²", "30 cm²", "11 cm²", "20 cm²"],
    correctAnswer: "15 cm²",
    hint: "$$A = \\frac{1}{2} \\times 6 \\times 5$$.",
    workedSolution: "$$A = \\frac{1}{2} \\times 30 = 15\\text{ cm}^2$$.",
    points: 1
  }
];

// Fill items 11 through 50 to complete 50 Low items
for (let i = 11; i <= 50; i++) {
  const isComp = (i % 2 === 0);
  const givenAngle = isComp ? ((i % 35) + 20) : ((i % 70) + 30);
  const ans = isComp ? 90 - givenAngle : 180 - givenAngle;
  lowQuestions.push({
    id: `q_b7_geo_l${i < 10 ? '0' + i : i}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: isComp 
      ? `Find the complement of an angle measuring $${givenAngle}^\\circ$.`
      : `Find the supplement of an angle measuring $${givenAngle}^\\circ$.`,
    options: [
      `${ans}°`,
      `${ans + 10}°`,
      `${ans - 10}°`,
      `${givenAngle}°`
    ],
    correctAnswer: `${ans}°`,
    hint: isComp ? `Subtract $${givenAngle}^\\circ$ from $90^\\circ$.` : `Subtract $${givenAngle}^\\circ$ from $180^\\circ$.`,
    workedSolution: isComp
      ? `$$90^\\circ - ${givenAngle}^\\circ = ${ans}^\\circ$$.`
      : `$$180^\\circ - ${givenAngle}^\\circ = ${ans}^\\circ$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER QUESTIONS (DOK 2) - 50 Items
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b7_geo_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `In the right angle figure below, determine the value of $x$:<br/>${createComplementarySvg('2x', '30°')}`,
    options: ["30°", "60°", "45°", "20°"],
    correctAnswer: "30°",
    hint: "Set up the equation: $2x + 30^\\circ = 90^\\circ$.",
    workedSolution: "$$2x + 30^\\circ = 90^\\circ \\implies 2x = 60^\\circ \\implies x = 30^\\circ$$.",
    points: 1
  },
  {
    id: "q_b7_geo_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Determine the value of $k$ on the straight line below:<br/>${createSupplementarySvg('3k', '2k')}`,
    options: ["36°", "45°", "30°", "60°"],
    correctAnswer: "36°",
    hint: "Sum the angles on the straight line: $3k + 2k = 180^\\circ$.",
    workedSolution: "$$5k = 180^\\circ \\implies k = \\frac{180^\\circ}{5} = 36^\\circ$$.",
    points: 1
  },
  {
    id: "q_b7_geo_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `A triangle has an area of $60\\text{ cm}^2$ and a base of $15\\text{ cm}$:<br/>${createTriangleSvg('15 cm', 'h')}<br/>Calculate its perpendicular height $h$.`,
    options: ["8 cm", "4 cm", "16 cm", "10 cm"],
    correctAnswer: "8 cm",
    hint: "Rearrange $A = \\frac{1}{2}bh \\implies h = \\frac{2A}{b}$.",
    workedSolution: "$$h = \\frac{2 \\times 60}{15} = \\frac{120}{15} = 8\\text{ cm}$$.",
    points: 1
  },
  {
    id: "q_b7_geo_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Find the perimeter of a semicircle with a radius of $7\\text{ cm}$ (Take $\\pi = \\frac{22}{7}$):<br/>${createCircleSvg('7 cm', false)}`,
    options: ["36 cm", "44 cm", "22 cm", "29 cm"],
    correctAnswer: "36 cm",
    hint: "Perimeter of semicircle is half the circumference plus the diameter: $P = \\pi r + 2r$.",
    workedSolution: "$$\\text{Arc Length} = \\frac{22}{7} \\times 7 = 22\\text{ cm}$$\n$$\\text{Diameter} = 2 \\times 7 = 14\\text{ cm}$$\n$$\\text{Perimeter} = 22 + 14 = 36\\text{ cm}$$.",
    points: 1
  },
  {
    id: "q_b7_geo_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Four angles meet at a point: $90^\\circ, 110^\\circ, 80^\\circ,$ and $x^\\circ$. Find the value of $x$.",
    options: ["80°", "70°", "90°", "100°"],
    correctAnswer: "80°",
    hint: "Angles meeting at a point add up to $360^\\circ$.",
    workedSolution: "$$90^\\circ + 110^\\circ + 80^\\circ + x = 360^\\circ \\implies 280^\\circ + x = 360^\\circ \\implies x = 80^\\circ$$.",
    points: 1
  }
];

// Fill remaining Medium items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const k = (i % 4) + 2;
    const ans = (90 / (k + 1));
    mediumQuestions.push({
      id: `q_b7_geo_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Two complementary angles are in the ratio $1 : ${k}$. What is the size of the smaller angle?`,
      options: [
        `${ans.toFixed(1)}°`,
        `${(ans * k).toFixed(1)}°`,
        `${(ans + 5).toFixed(1)}°`,
        `45.0°`
      ],
      correctAnswer: `${ans.toFixed(1)}°`,
      hint: `Sum of parts is $1 + ${k} = ${k + 1}$. Divide $90^\\circ$ by ${k + 1}.`,
      workedSolution: `$$x + ${k}x = 90^\\circ \\implies ${k + 1}x = 90^\\circ \\implies x = ${ans.toFixed(1)}^\\circ$$.`,
      points: 1
    });
  } else if (mod === 1) {
    const r = ((i % 6) + 1) * 7;
    const circ = 2 * 22 * (r / 7);
    mediumQuestions.push({
      id: `q_b7_geo_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Calculate the circumference of a circular flower bed with radius $r = ${r}\\text{ cm}$ using $\\pi = \\frac{22}{7}$.`,
      options: [
        `${circ} cm`,
        `${circ / 2} cm`,
        `${circ * 2} cm`,
        `${circ + 14} cm`
      ],
      correctAnswer: `${circ} cm`,
      hint: `Use $C = 2 \\times \\frac{22}{7} \\times ${r}$.`,
      workedSolution: `$$C = 2 \\times \\frac{22}{7} \\times ${r} = 44 \\times ${r / 7} = ${circ}\\text{ cm}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    const b = (i % 5 + 3) * 2;
    const h = (i % 4 + 4);
    const area = 0.5 * b * h;
    mediumQuestions.push({
      id: `q_b7_geo_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `A triangle has an area of $${area}\\text{ cm}^2$ and a base of $${b}\\text{ cm}$. Find its perpendicular height $h$.`,
      options: [
        `${h} cm`,
        `${h + 2} cm`,
        `${h - 2} cm`,
        `${2 * h} cm`
      ],
      correctAnswer: `${h} cm`,
      hint: `Formula: $h = \\frac{2A}{b} = \\frac{2 \\times ${area}}{${b}}$.`,
      workedSolution: `$$h = \\frac{2(${area})}{${b}} = \\frac{${2 * area}}{${b}} = ${h}\\text{ cm}$$.`,
      points: 1
    });
  } else {
    const angle1 = 80 + (i % 20);
    const angle2 = 100 + (i % 15);
    const angle3 = 70 + (i % 20);
    const angle4 = 360 - (angle1 + angle2 + angle3);
    mediumQuestions.push({
      id: `q_b7_geo_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Four angles meet at a point: $${angle1}^\\circ$, $${angle2}^\\circ$, $${angle3}^\\circ$, and $x^\\circ$. Find the value of $x$.`,
      options: [
        `${angle4}°`,
        `${angle4 + 10}°`,
        `${angle4 - 10}°`,
        `90°`
      ],
      correctAnswer: `${angle4}°`,
      hint: `Angles meeting at a point sum to $360^\\circ$. Subtract the three given angles from $360^\\circ$.`,
      workedSolution: `$$x = 360^\\circ - (${angle1}^\\circ + ${angle2}^\\circ + ${angle3}^\\circ) = 360^\\circ - ${angle1 + angle2 + angle3}^\\circ = ${angle4}^\\circ$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 3. HARD TIER QUESTIONS (DOK 3) - 50 Items
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b7_geo_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A piece of wire of length $88\\text{ cm}$ is bent to form a complete circle (Take $\\pi = \\frac{22}{7}$). What is the area of the circle formed?",
    options: ["616 cm²", "308 cm²", "154 cm²", "1,232 cm²"],
    correctAnswer: "616 cm²",
    hint: "First find radius from circumference: $2\\pi r = 88 \\implies r = 14\\text{ cm}$. Then find $A = \\pi r^2$.",
    workedSolution: "$$2 \\times \\frac{22}{7} \\times r = 88 \\implies r = \\frac{88 \\times 7}{44} = 14\\text{ cm}$$\n$$\\text{Area} = \\frac{22}{7} \\times 14^2 = 22 \\times 28 = 616\\text{ cm}^2$$.",
    points: 2
  },
  {
    id: "q_b7_geo_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `Two angles on a straight line are in the ratio $4 : 5$:<br/>${createSupplementarySvg('4x', '5x')}<br/>What is the measure of the smaller angle?`,
    options: ["80°", "100°", "90°", "75°"],
    correctAnswer: "80°",
    hint: "Total parts $= 4 + 5 = 9$. Set $9x = 180^\\circ$, then find $4x$.",
    workedSolution: "$$4x + 5x = 180^\\circ \\implies 9x = 180^\\circ \\implies x = 20^\\circ$$\n$$\\text{Smaller angle} = 4(20^\\circ) = 80^\\circ$$.",
    points: 2
  },
  {
    id: "q_b7_geo_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "An athletic running track consists of a rectangle measuring $100\\text{ m}$ by $56\\text{ m}$ with semicircular ends joined at both shorter ends. Find the total distance around the track (Take $\\pi = \\frac{22}{7}$).",
    options: ["376 m", "476 m", "312 m", "432 m"],
    correctAnswer: "376 m",
    hint: "The two semicircles form one full circle with diameter $56\\text{ m}$ ($r = 28\\text{ m}$). Add $2 \\times 100\\text{ m}$.",
    workedSolution: "$$\\text{Circumference of 2 semicircles} = \\pi d = \\frac{22}{7} \\times 56 = 176\\text{ m}$$\n$$\\text{Total distance} = 100 + 100 + 176 = 376\\text{ m}$$.",
    points: 2
  },
  {
    id: "q_b7_geo_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `The area of a triangle is $84\\text{ cm}^2$. If its base is $(x + 2)\\text{ cm}$ and its height is $12\\text{ cm}$, find the value of $x$:<br/>${createTriangleSvg('x + 2', '12 cm')}`,
    options: ["12", "14", "10", "16"],
    correctAnswer: "12",
    hint: "$$\\frac{1}{2}(x + 2)(12) = 84$$.",
    workedSolution: "$$6(x + 2) = 84 \\implies x + 2 = 14 \\implies x = 12$$.",
    points: 2
  },
  {
    id: "q_b7_geo_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A thin wire is bent to form a circle of radius $21\\text{ cm}$. If the same wire is straightened and rebent into an equilateral triangle, what is the length of one side of the triangle? (Take $\\pi = \\frac{22}{7}$).",
    options: ["44 cm", "132 cm", "66 cm", "33 cm"],
    correctAnswer: "44 cm",
    hint: "Find wire length (circle circumference): $C = 2 \\times \\frac{22}{7} \\times 21 = 132\\text{ cm}$. Divide by 3 equal sides.",
    workedSolution: "$$C = 2 \\times \\frac{22}{7} \\times 21 = 132\\text{ cm}$$\n$$\\text{Side of triangle} = \\frac{132}{3} = 44\\text{ cm}$$.",
    points: 2
  }
];

// Fill remaining Hard items up to 50
// Use integer-friendly supplementary angle ratios
const ratioPairs = [
  [1, 2], // 3 parts -> 60 deg unit
  [1, 3], // 4 parts -> 45 deg unit
  [2, 3], // 5 parts -> 36 deg unit
  [1, 5], // 6 parts -> 30 deg unit
  [4, 5], // 9 parts -> 20 deg unit
  [1, 9], // 10 parts -> 18 deg unit
  [5, 7], // 12 parts -> 15 deg unit
  [7, 11] // 18 parts -> 10 deg unit
];

for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const [pA, pB] = ratioPairs[i % ratioPairs.length];
    const sumParts = pA + pB;
    const unitVal = 180 / sumParts;
    const largerAngle = Math.max(pA, pB) * unitVal;
    const smallerAngle = Math.min(pA, pB) * unitVal;
    hardQuestions.push({
      id: `q_b7_geo_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Two supplementary angles are in the ratio $${pA} : ${pB}$:<br/>${createSupplementarySvg(`${pA}x`, `${pB}x`)}<br/>Calculate the size of the larger angle.`,
      options: [
        `${largerAngle}°`,
        `${smallerAngle}°`,
        `${largerAngle - 10}°`,
        `${largerAngle + 10}°`
      ],
      correctAnswer: `${largerAngle}°`,
      hint: `Sum of parts is $${pA} + ${pB} = ${sumParts}$. Divide $180^\\circ$ by ${sumParts}, then multiply by ${Math.max(pA, pB)}.`,
      workedSolution: `$$x = \\frac{180^\\circ}{${sumParts}} = ${unitVal}^\\circ$$\n$$\\text{Larger angle} = ${Math.max(pA, pB)} \\times ${unitVal}^\\circ = ${largerAngle}^\\circ$$.`,
      points: 2
    });
  } else if (mod === 1) {
    // Triangle with algebraic base
    const h = 8 + (i % 5) * 2;
    const xVal = (i % 6) + 4;
    const baseExpr = `x + 3`;
    const baseVal = xVal + 3;
    const area = 0.5 * baseVal * h;
    hardQuestions.push({
      id: `q_b7_geo_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `The area of a triangle is $${area}\\text{ cm}^2$. If its height is $${h}\\text{ cm}$ and its base is $(${baseExpr})\\text{ cm}$, find the value of $x$:<br/>${createTriangleSvg(baseExpr, `${h} cm`)}`,
      options: [
        `${xVal}`,
        `${xVal + 2}`,
        `${xVal - 1}`,
        `${xVal + 3}`
      ],
      correctAnswer: `${xVal}`,
      hint: `Form the equation: $\\frac{1}{2}(x + 3)(${h}) = ${area}$.`,
      workedSolution: `$$\\frac{1}{2}(${h})(x + 3) = ${area} \\implies ${h / 2}(x + 3) = ${area} \\implies x + 3 = ${baseVal} \\implies x = ${xVal}$$.`,
      points: 2
    });
  } else if (mod === 2) {
    // Semicircle perimeter with radius multiple of 7
    const r = ((i % 5) + 1) * 7;
    const arc = 22 * (r / 7);
    const diam = 2 * r;
    const perim = arc + diam;
    hardQuestions.push({
      id: `q_b7_geo_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `A window is designed in the shape of a semicircle with radius $r = ${r}\\text{ cm}$ (Take $\\pi = \\frac{22}{7}$):<br/>${createCircleSvg(`${r} cm`, false)}<br/>Find the total perimeter (outer boundary) of the window.`,
      options: [
        `${perim} cm`,
        `${arc} cm`,
        `${diam} cm`,
        `${perim + 7} cm`
      ],
      correctAnswer: `${perim} cm`,
      hint: `Perimeter of a semicircle includes the curved arc plus the straight diameter: $P = \\pi r + 2r$.`,
      workedSolution: `$$\\text{Arc} = \\frac{22}{7} \\times ${r} = ${arc}\\text{ cm}$$\n$$\\text{Diameter} = 2 \\times ${r} = ${diam}\\text{ cm}$$\n$$\\text{Perimeter} = ${arc} + ${diam} = ${perim}\\text{ cm}$$.`,
      points: 2
    });
  } else {
    // Wire bending circle into square
    const r = ((i % 4) + 1) * 7;
    const circ = 44 * (r / 7);
    const side = circ / 4;
    hardQuestions.push({
      id: `q_b7_geo_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `A piece of wire is bent into a circle of radius $${r}\\text{ cm}$. If the same wire is straightened and rebent into a square, what is the length of each side of the square? (Take $\\pi = \\frac{22}{7}$).`,
      options: [
        `${side} cm`,
        `${circ} cm`,
        `${side + 2} cm`,
        `${side - 2} cm`
      ],
      correctAnswer: `${side} cm`,
      hint: `Find circle circumference $C = 2 \\times \\frac{22}{7} \\times ${r}$. Then divide by 4.`,
      workedSolution: `$$C = 2 \\times \\frac{22}{7} \\times ${r} = ${circ}\\text{ cm}$$\n$$\\text{Side of square} = \\frac{${circ}}{4} = ${side}\\text{ cm}$$.`,
      points: 2
    });
  }
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB7GeometryPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 7 PRACTICE POOL: topic_geometry_and_trigonometry');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_geometry_and_trigonometry');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_geometry_and_trigonometry not found in Firestore.');
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
  const p1 = path.join(__dirname, 'payloads', 'topic_geometry_and_trigonometry.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_geometry_and_trigonometry.json');

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

  console.log('🎉 B7 Geometry & Trigonometry Question Bank expansion completed successfully.');
}

seedB7GeometryPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B7 geometry pool:', err);
    process.exit(1);
  });
