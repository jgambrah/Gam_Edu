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

// 1. Parallel Lines with Transversal SVG Helper
const createTransversalSvg = (angleTop: string, angleBottom: string, isAlternate = true) => `
<svg viewBox='0 0 340 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Line 1 (Top) -->
  <line x1='30' y1='50' x2='310' y2='50' stroke='#1e293b' stroke-width='2.5'/>
  <polygon points='165,46 175,50 165,54' fill='#1e293b'/>
  <polygon points='175,46 185,50 175,54' fill='#1e293b'/>
  <!-- Line 2 (Bottom) -->
  <line x1='30' y1='130' x2='310' y2='130' stroke='#1e293b' stroke-width='2.5'/>
  <polygon points='165,126 175,130 165,134' fill='#1e293b'/>
  <polygon points='175,126 185,130 175,134' fill='#1e293b'/>
  <!-- Transversal Line -->
  <line x1='90' y1='165' x2='240' y2='15' stroke='#2563eb' stroke-width='2.5'/>
  <!-- Angle Arcs -->
  <circle cx='185' cy='70' r='3' fill='#dc2626'/>
  <text x='155' y='68' font-size='12' font-weight='bold' fill='#dc2626'>${angleTop}</text>
  <circle cx='125' cy='130' r='3' fill='#2563eb'/>
  <text x='140' y='125' font-size='12' font-weight='bold' fill='#2563eb'>${angleBottom}</text>
  <text x='270' y='35' font-size='11' font-weight='bold' fill='#64748b'>L1 // L2</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Right-Angled Triangle (Pythagoras) SVG Helper
const createPythagorasSvg = (legA: string, legB: string, hypC: string) => `
<svg viewBox='0 0 280 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <polygon points='50,140 230,140 50,30' fill='#eff6ff' stroke='#1e40af' stroke-width='2.5'/>
  <rect x='50' y='124' width='16' height='16' fill='none' stroke='#475569' stroke-width='1.5'/>
  <text x='35' y='85' font-size='12' font-weight='bold' fill='#dc2626' text-anchor='end'>${legA}</text>
  <text x='140' y='160' font-size='12' font-weight='bold' fill='#16a34a' text-anchor='middle'>${legB}</text>
  <text x='155' y='75' font-size='12' font-weight='bold' fill='#2563eb' text-anchor='middle'>${hypC}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 3. Regular Polygon (Pentagon) Interior Angle SVG
const createPentagonSvg = (angleLabel: string) => `
<svg viewBox='0 0 240 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <polygon points='120,25 205,85 175,160 65,160 35,85' fill='#fef3c7' stroke='#d97706' stroke-width='2.5'/>
  <path d='M 110 40 A 15 15 0 0 0 130 40' fill='none' stroke='#b45309' stroke-width='2'/>
  <text x='120' y='55' font-size='11' font-weight='bold' fill='#b45309' text-anchor='middle'>${angleLabel}</text>
  <text x='120' y='110' font-size='12' font-weight='bold' fill='#78350f' text-anchor='middle'>Regular 5-gon</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// -----------------------------------------------------------------------------
// 1. LOW TIER QUESTIONS (DOK 1) - 50 Items
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b8_geo_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: `In the diagram below, two parallel lines are cut by a transversal:<br/>${createTransversalSvg('65°', 'x')}<br/>What is the value of the alternate interior angle $x$?`,
    options: ["65°", "115°", "25°", "125°"],
    correctAnswer: "65°",
    hint: "Alternate interior angles between parallel lines are strictly equal.",
    workedSolution: "Alternate interior angles form a Z-pattern and are equal: $$x = 65^\\circ$$.",
    points: 1
  },
  {
    id: "q_b8_geo_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Calculate the length of the hypotenuse $c$ for the right-angled triangle below:<br/>${createPythagorasSvg('6 cm', '8 cm', 'c')}`,
    options: ["10 cm", "14 cm", "12 cm", "9 cm"],
    correctAnswer: "10 cm",
    hint: "Use Pythagoras theorem: $c^2 = a^2 + b^2 = 6^2 + 8^2$.",
    workedSolution: "$$c^2 = 36 + 64 = 100 \\implies c = \\sqrt{100} = 10\\text{ cm}$$.",
    points: 1
  },
  {
    id: "q_b8_geo_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the sum of the interior angles of a convex polygon with $n = 5$ sides (a pentagon)?",
    options: ["540°", "360°", "720°", "180°"],
    correctAnswer: "540°",
    hint: "Apply the polygon angle sum formula: $S = (n - 2) \\times 180^\\circ$.",
    workedSolution: "$$S = (5 - 2) \\times 180^\\circ = 3 \\times 180^\\circ = 540^\\circ$$.",
    points: 1
  },
  {
    id: "q_b8_geo_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Calculate the area of a circle with radius $r = 7\\text{ cm}$ (Take $\\pi = \\frac{22}{7}$).",
    options: ["154 cm²", "44 cm²", "308 cm²", "49 cm²"],
    correctAnswer: "154 cm²",
    hint: "Use $A = \\pi r^2 = \\frac{22}{7} \\times 7^2$.",
    workedSolution: "$$A = \\frac{22}{7} \\times 49 = 22 \\times 7 = 154\\text{ cm}^2$$.",
    points: 1
  },
  {
    id: "q_b8_geo_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Find the missing leg $b$ in this right-angled triangle:<br/>${createPythagorasSvg('5 cm', 'b', '13 cm')}`,
    options: ["12 cm", "8 cm", "18 cm", "11 cm"],
    correctAnswer: "12 cm",
    hint: "Rearrange Pythagoras theorem: $b^2 = c^2 - a^2 = 13^2 - 5^2$.",
    workedSolution: "$$b^2 = 169 - 25 = 144 \\implies b = \\sqrt{144} = 12\\text{ cm}$$.",
    points: 1
  },
  {
    id: "q_b8_geo_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the sum of the interior angles of a hexagon ($6$ sides)?",
    options: ["720°", "540°", "900°", "1080°"],
    correctAnswer: "720°",
    hint: "$$S = (6 - 2) \\times 180^\\circ = 4 \\times 180^\\circ$$.",
    workedSolution: "$$4 \\times 180^\\circ = 720^\\circ$$.",
    points: 1
  },
  {
    id: "q_b8_geo_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If two interior angles on the same side of a transversal (co-interior angles) are supplementary, what is their sum?",
    options: ["180°", "90°", "360°", "120°"],
    correctAnswer: "180°",
    hint: "Supplementary angles sum to a straight angle ($180^\\circ$).",
    workedSolution: "Co-interior angles between parallel lines always sum to $180^\\circ$.",
    points: 1
  },
  {
    id: "q_b8_geo_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the sum of the exterior angles of ANY convex polygon?",
    options: ["360°", "180°", "540°", "Depends on number of sides"],
    correctAnswer: "360°",
    hint: "The sum of exterior angles is independent of the number of sides.",
    workedSolution: "For every convex polygon, the sum of exterior angles is identically $360^\\circ$.",
    points: 1
  },
  {
    id: "q_b8_geo_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: `Find the size of ONE interior angle of a regular pentagon:<br/>${createPentagonSvg('x')}`,
    options: ["108°", "72°", "120°", "100°"],
    correctAnswer: "108°",
    hint: "Divide the total interior angle sum ($540^\\circ$) by 5.",
    workedSolution: "$$\\text{Interior Angle} = \\frac{540^\\circ}{5} = 108^\\circ$$.",
    points: 1
  },
  {
    id: "q_b8_geo_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Calculate the area of a circle with a diameter of $28\\text{ cm}$ (Take $\\pi = \\frac{22}{7}$).",
    options: ["616 cm²", "154 cm²", "88 cm²", "2,464 cm²"],
    correctAnswer: "616 cm²",
    hint: "Radius is half the diameter: $r = 14\\text{ cm}$. Area $= \\pi r^2$.",
    workedSolution: "$$r = 14\\text{ cm} \\implies A = \\frac{22}{7} \\times 14^2 = 22 \\times 28 = 616\\text{ cm}^2$$.",
    points: 1
  }
];

// Fill items 11 through 50 to complete 50 Low items
for (let i = 11; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const n = (i % 8) + 3; // 3 to 10 sides
    const sumAngles = (n - 2) * 180;
    lowQuestions.push({
      id: `q_b8_geo_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Find the sum of the interior angles of a polygon with $n = ${n}$ sides.`,
      options: [
        `${sumAngles}°`,
        `${sumAngles + 180}°`,
        `${sumAngles - 180}°`,
        `${n * 180}°`
      ],
      correctAnswer: `${sumAngles}°`,
      hint: `Apply the formula $(n - 2) \\times 180^\\circ$ with $n = ${n}$.`,
      workedSolution: `$$(${n} - 2) \\times 180^\\circ = ${n - 2} \\times 180^\\circ = ${sumAngles}^\\circ$$.`,
      points: 1
    });
  } else if (mod === 1) {
    const triples = [
      [3, 4, 5],
      [5, 12, 13],
      [6, 8, 10],
      [8, 15, 17],
      [9, 12, 15]
    ];
    const [a, b, c] = triples[i % triples.length];
    lowQuestions.push({
      id: `q_b8_geo_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Find the hypotenuse $c$ of a right-angled triangle with legs $a = ${a}\\text{ cm}$ and $b = ${b}\\text{ cm}$.`,
      options: [
        `${c} cm`,
        `${c + 2} cm`,
        `${a + b} cm`,
        `${c - 1} cm`
      ],
      correctAnswer: `${c} cm`,
      hint: `Use Pythagoras: $c = \\sqrt{${a}^2 + ${b}^2} = \\sqrt{${a * a} + ${b * b}}$.`,
      workedSolution: `$$c = \\sqrt{${a * a} + ${b * b}} = \\sqrt{${c * c}} = ${c}\\text{ cm}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    const angle = (i % 40) + 40;
    lowQuestions.push({
      id: `q_b8_geo_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Two parallel lines are cut by a transversal. If one interior angle is $${angle}^\\circ$, what is the measure of its alternate interior angle?`,
      options: [
        `${angle}°`,
        `${180 - angle}°`,
        `${90 - angle}°`,
        `${angle + 10}°`
      ],
      correctAnswer: `${angle}°`,
      hint: `Alternate interior angles between parallel lines are always equal.`,
      workedSolution: `Alternate angles are congruent, so the measure is $${angle}^\\circ$.`,
      points: 1
    });
  } else {
    const r = ((i % 4) + 1) * 7;
    const area = (22 / 7) * r * r;
    lowQuestions.push({
      id: `q_b8_geo_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `Calculate the area of a circle with radius $r = ${r}\\text{ cm}$ (Take $\\pi = \\frac{22}{7}$).`,
      options: [
        `${area} cm²`,
        `${area / 2} cm²`,
        `${area * 2} cm²`,
        `${2 * 22 * (r / 7)} cm²`
      ],
      correctAnswer: `${area} cm²`,
      hint: `Use $A = \\pi r^2 = \\frac{22}{7} \\times ${r}^2$.`,
      workedSolution: `$$A = \\frac{22}{7} \\times ${r * r} = ${area}\\text{ cm}^2$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER QUESTIONS (DOK 2) - 50 Items
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b8_geo_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `In the parallel line figure below, solve for $x$:<br/>${createTransversalSvg('2x + 10°', '3x - 20°')}`,
    options: ["30°", "20°", "40°", "25°"],
    correctAnswer: "30°",
    hint: "Alternate interior angles are equal: equate $2x + 10 = 3x - 20$.",
    workedSolution: "$$3x - 20 = 2x + 10 \\implies 3x - 2x = 10 + 20 \\implies x = 30^\\circ$$.",
    points: 1
  },
  {
    id: "q_b8_geo_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "If each interior angle of a regular polygon is $140^\\circ$, how many sides does the polygon have?",
    options: ["9 sides", "8 sides", "10 sides", "12 sides"],
    correctAnswer: "9 sides",
    hint: "Each exterior angle $= 180^\\circ - 140^\\circ = 40^\\circ$. Number of sides $n = \\frac{360^\\circ}{40^\\circ}$.",
    workedSolution: "$$\\text{Exterior Angle} = 180^\\circ - 140^\\circ = 40^\\circ$$\n$$n = \\frac{360^\\circ}{40^\\circ} = 9\\text{ sides}$$.",
    points: 1
  },
  {
    id: "q_b8_geo_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A ladder of length $10\\text{ m}$ rests against a vertical wall with its foot $6\\text{ m}$ away from the base of the wall. How far up the wall does the ladder reach?",
    options: ["8 m", "7 m", "9 m", "8.5 m"],
    correctAnswer: "8 m",
    hint: "Wall height $h = \\sqrt{10^2 - 6^2}$.",
    workedSolution: "$$h = \\sqrt{100 - 36} = \\sqrt{64} = 8\\text{ m}$$.",
    points: 1
  },
  {
    id: "q_b8_geo_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "The area of a circular metal plate is $1,386\\text{ cm}^2$. What is its radius? (Take $\\pi = \\frac{22}{7}$).",
    options: ["21 cm", "14 cm", "28 cm", "19 cm"],
    correctAnswer: "21 cm",
    hint: "$$r^2 = \\frac{A}{\\pi} = 1,386 \\times \\frac{7}{22}$$.",
    workedSolution: "$$r^2 = 1,386 \\times \\frac{7}{22} = 63 \\times 7 = 441 \\implies r = \\sqrt{441} = 21\\text{ cm}$$.",
    points: 1
  },
  {
    id: "q_b8_geo_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `Calculate the area of a right-angled triangle whose hypotenuse is $17\\text{ cm}$ and one leg is $8\\text{ cm}$:<br/>${createPythagorasSvg('8 cm', 'b', '17 cm')}`,
    options: ["60 cm²", "120 cm²", "68 cm²", "136 cm²"],
    correctAnswer: "60 cm²",
    hint: "Find the missing leg first: $b = \\sqrt{17^2 - 8^2} = \\sqrt{289 - 64} = 15\\text{ cm}$. Then compute $A = \\frac{1}{2} \\times 8 \\times 15$.",
    workedSolution: "$$b = \\sqrt{289 - 64} = \\sqrt{225} = 15\\text{ cm}$$\n$$A = \\frac{1}{2} \\times 8 \\times 15 = 4 \\times 15 = 60\\text{ cm}^2$$.",
    points: 1
  }
];

// Fill remaining Medium items up to 50
const polygonSides = [5, 6, 8, 9, 10, 12];

for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const n = polygonSides[i % polygonSides.length];
    const extAngle = 360 / n;
    mediumQuestions.push({
      id: `q_b8_geo_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `If each exterior angle of a regular polygon measures $${extAngle.toFixed(1)}^\\circ$, how many sides does the polygon possess?`,
      options: [
        `${n} sides`,
        `${n + 1} sides`,
        `${n - 1} sides`,
        `${n + 2} sides`
      ],
      correctAnswer: `${n} sides`,
      hint: `Divide $360^\\circ$ by the exterior angle size: $n = \\frac{360^\\circ}{${extAngle.toFixed(1)}^\\circ}$.`,
      workedSolution: `$$n = \\frac{360^\\circ}{${extAngle.toFixed(1)}^\\circ} = ${n}\\text{ sides}$$.`,
      points: 1
    });
  } else if (mod === 1) {
    const xVal = (i % 15) + 15;
    const diff = (i % 10) + 10;
    // 2x + diff = 3x - (xVal - diff) => x = xVal
    const constRight = xVal - diff;
    mediumQuestions.push({
      id: `q_b8_geo_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Two alternate interior angles on parallel lines are given by $(2x + ${diff})^\\circ$ and $(3x - ${constRight})^\\circ$. Find the value of $x$.`,
      options: [
        `${xVal}°`,
        `${xVal + 5}°`,
        `${xVal - 5}°`,
        `${xVal + 10}°`
      ],
      correctAnswer: `${xVal}°`,
      hint: `Alternate angles are equal: equate $2x + ${diff} = 3x - ${constRight}$.`,
      workedSolution: `$$3x - 2x = ${diff} + ${constRight} \\implies x = ${xVal}^\\circ$$.`,
      points: 1
    });
  } else if (mod === 2) {
    const hyp = 25;
    const legA = (i % 2 === 0) ? 15 : 7;
    const legB = (i % 2 === 0) ? 20 : 24;
    mediumQuestions.push({
      id: `q_b8_geo_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `In a right-angled triangle, the hypotenuse is $${hyp}\\text{ cm}$ and one side is $${legA}\\text{ cm}$. Find the length of the third side.`,
      options: [
        `${legB} cm`,
        `${legB + 2} cm`,
        `${legB - 2} cm`,
        `${legB + 4} cm`
      ],
      correctAnswer: `${legB} cm`,
      hint: `Use Pythagoras: $b = \\sqrt{${hyp}^2 - ${legA}^2}$.`,
      workedSolution: `$$b = \\sqrt{${hyp * hyp} - ${legA * legA}} = \\sqrt{${legB * legB}} = ${legB}\\text{ cm}$$.`,
      points: 1
    });
  } else {
    const r = ((i % 3) + 2) * 7;
    const area = (22 / 7) * r * r;
    mediumQuestions.push({
      id: `q_b8_geo_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `The area of a circle is $${area}\\text{ cm}^2$. What is its radius? (Take $\\pi = \\frac{22}{7}$).`,
      options: [
        `${r} cm`,
        `${r / 2} cm`,
        `${r * 2} cm`,
        `${r + 7} cm`
      ],
      correctAnswer: `${r} cm`,
      hint: `Use $r^2 = \\frac{A}{\\pi} = ${area} \\times \\frac{7}{22}$.`,
      workedSolution: `$$r^2 = ${area} \\times \\frac{7}{22} = ${r * r} \\implies r = ${r}\\text{ cm}$$.`,
      points: 1
    });
  }
}

// -----------------------------------------------------------------------------
// 3. HARD TIER QUESTIONS (DOK 3) - 50 Items
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b8_geo_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A circular running track has an outer radius of $21\\text{ m}$ and an inner radius of $14\\text{ m}$. Calculate the area of the track path (the shaded annulus). (Take $\\pi = \\frac{22}{7}$).",
    options: ["770 m²", "616 m²", "1,386 m²", "462 m²"],
    correctAnswer: "770 m²",
    hint: "Area of annulus $= \\pi(R^2 - r^2) = \\frac{22}{7}(21^2 - 14^2)$.",
    workedSolution: "$$A = \\frac{22}{7}(441 - 196) = \\frac{22}{7} \\times 245 = 22 \\times 35 = 770\\text{ m}^2$$.",
    points: 2
  },
  {
    id: "q_b8_geo_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Two parallel lines $L_1$ and $L_2$ contain a reflex zig-zag vertex $P$ between them. If the angle at the top parallel line is $45^\\circ$ and the angle at the bottom parallel line is $35^\\circ$, find the reflex angle at vertex $P$.",
    options: ["280°", "80°", "100°", "260°"],
    correctAnswer: "280°",
    hint: "Draw an auxiliary parallel line through $P$. The interior reflex vertex equals $360^\\circ - (45^\\circ + 35^\\circ)$.",
    workedSolution: "$$\\text{Interior vertex angle} = 45^\\circ + 35^\\circ = 80^\\circ$$\n$$\\text{Reflex angle} = 360^\\circ - 80^\\circ = 280^\\circ$$.",
    points: 2
  },
  {
    id: "q_b8_geo_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "The perimeter of a right-angled triangle is $60\\text{ cm}$ and its hypotenuse is $25\\text{ cm}$. Find the area of the triangle.",
    options: ["150 cm²", "300 cm²", "120 cm²", "75 cm²"],
    correctAnswer: "150 cm²",
    hint: "Sum of legs $a + b = 60 - 25 = 35\\text{ cm}$. Using $(a + b)^2 = a^2 + b^2 + 2ab$: $35^2 = 25^2 + 2(2A)$.",
    workedSolution: "$$(a + b)^2 = c^2 + 4A \\implies 1,225 = 625 + 4A$$\n$$4A = 600 \\implies A = 150\\text{ cm}^2$$.",
    points: 2
  },
  {
    id: "q_b8_geo_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "The interior angles of an irregular pentagon are in the ratio $2 : 3 : 4 : 4 : 5$. What is the measure of the largest interior angle?",
    options: ["150°", "120°", "135°", "160°"],
    correctAnswer: "150°",
    hint: "Total angle sum of pentagon $= 540^\\circ$. Total parts $= 2 + 3 + 4 + 4 + 5 = 18\\text{ parts}$.",
    workedSolution: "$$\\text{Value of 1 part} = \\frac{540^\\circ}{18} = 30^\\circ$$\n$$\\text{Largest angle (5 parts)} = 5 \\times 30^\\circ = 150^\\circ$$.",
    points: 2
  },
  {
    id: "q_b8_geo_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A quadrant of a circle (quarter circle) has a radius of $14\\text{ cm}$. Calculate its total perimeter including the two straight radial boundaries (Take $\\pi = \\frac{22}{7}$).",
    options: ["50 cm", "22 cm", "44 cm", "36 cm"],
    correctAnswer: "50 cm",
    hint: "Perimeter $= \\text{Arc length} + 2r = \\left(\\frac{1}{4} \\times 2 \\times \\frac{22}{7} \\times 14\\right) + 2(14)$.",
    workedSolution: "$$\\text{Arc} = \\frac{1}{4} \\times 88 = 22\\text{ cm}$$\n$$\\text{Perimeter} = 22 + 14 + 14 = 50\\text{ cm}$$.",
    points: 2
  }
];

// Fill remaining Hard items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const rOut = 14 + (i % 3) * 7; // 14, 21, 28
    const rIn = 7;
    const areaRing = Math.round((22 / 7) * (rOut * rOut - rIn * rIn));
    hardQuestions.push({
      id: `q_b8_geo_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `A circular ring has outer radius $R = ${rOut}\\text{ cm}$ and inner radius $r = ${rIn}\\text{ cm}$. What is the area of the ring? (Take $\\pi = \\frac{22}{7}$).`,
      options: [
        `${areaRing} cm²`,
        `${areaRing + 22} cm²`,
        `${areaRing - 22} cm²`,
        `${Math.round((22 / 7) * rOut * rOut)} cm²`
      ],
      correctAnswer: `${areaRing} cm²`,
      hint: `Use $A = \\pi(R^2 - r^2) = \\frac{22}{7}(${rOut}^2 - ${rIn}^2)$.`,
      workedSolution: `$$A = \\frac{22}{7}(${rOut * rOut} - ${rIn * rIn}) = \\frac{22}{7}(${rOut * rOut - rIn * rIn}) = ${areaRing}\\text{ cm}^2$$.`,
      points: 2
    });
  } else if (mod === 1) {
    const a1 = (i % 20) + 30;
    const a2 = (i % 25) + 35;
    const reflex = 360 - (a1 + a2);
    hardQuestions.push({
      id: `q_b8_geo_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `In a zig-zag configuration between two parallel lines, the top angle is $${a1}^\\circ$ and the bottom angle is $${a2}^\\circ$. Find the reflex angle at the vertex between them.`,
      options: [
        `${reflex}°`,
        `${a1 + a2}°`,
        `${180 - (a1 + a2)}°`,
        `${reflex - 10}°`
      ],
      correctAnswer: `${reflex}°`,
      hint: `The interior vertex angle is $${a1}^\\circ + ${a2}^\\circ$. The reflex angle is $360^\\circ - (${a1}^\\circ + ${a2}^\\circ)$.`,
      workedSolution: `$$\\text{Interior angle} = ${a1}^\\circ + ${a2}^\\circ = ${a1 + a2}^\\circ$$\n$$\\text{Reflex angle} = 360^\\circ - ${a1 + a2}^\\circ = ${reflex}^\\circ$$.`,
      points: 2
    });
  } else if (mod === 2) {
    const r = ((i % 4) + 1) * 7;
    const arc = (0.25) * 2 * (22 / 7) * r;
    const perim = arc + 2 * r;
    hardQuestions.push({
      id: `q_b8_geo_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Find the total perimeter of a quadrant (one-fourth of a circle) with radius $r = ${r}\\text{ cm}$ (Take $\\pi = \\frac{22}{7}$).`,
      options: [
        `${perim} cm`,
        `${arc} cm`,
        `${2 * r} cm`,
        `${perim + 7} cm`
      ],
      correctAnswer: `${perim} cm`,
      hint: `Perimeter of quadrant $= \\frac{1}{4}(2\\pi r) + 2r$.`,
      workedSolution: `$$\\text{Arc} = \\frac{1}{4} \\times 2 \\times \\frac{22}{7} \\times ${r} = ${arc}\\text{ cm}$$\n$$\\text{Perimeter} = ${arc} + 2(${r}) = ${perim}\\text{ cm}$$.`,
      points: 2
    });
  } else {
    // Regular polygon interior-exterior ratio
    // Interior / Exterior = k => Interior = k * Exterior. Since Int + Ext = 180 => (k+1)*Ext = 180 => Ext = 180 / (k+1).
    // n = 360 / Ext = 360 / (180 / (k+1)) = 2(k+1).
    const k = (i % 3) + 2; // k = 2 -> n = 6; k = 3 -> n = 8; k = 4 -> n = 10
    const n = 2 * (k + 1);
    hardQuestions.push({
      id: `q_b8_geo_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `In a regular polygon, the ratio of each interior angle to each exterior angle is $${k} : 1$. How many sides does this polygon have?`,
      options: [
        `${n} sides`,
        `${n + 2} sides`,
        `${n - 2} sides`,
        `${k * 2} sides`
      ],
      correctAnswer: `${n} sides`,
      hint: `Since interior + exterior $= 180^\\circ$, each exterior angle $= \\frac{180^\\circ}{${k + 1}}$. Then $n = \\frac{360^\\circ}{\\text{exterior angle}}$.`,
      workedSolution: `$$\\text{Exterior} = \\frac{180^\\circ}{${k} + 1} = \\frac{180^\\circ}{${k + 1}}$$\n$$n = \\frac{360^\\circ}{\\text{Exterior}} = 360 \\times \\frac{${k + 1}}{180} = 2(${k + 1}) = ${n}\\text{ sides}$$.`,
      points: 2
    });
  }
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB8GeometryPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 8 PRACTICE POOL: topic_geometry_and_trigonometry');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_geometry_and_trigonometry');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_geometry_and_trigonometry not found in Firestore.');
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
  const p1 = path.join(__dirname, 'payloads', 'topic_geometry_and_trigonometry.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_geometry_and_trigonometry.json');

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

  console.log('🎉 B8 Geometry & Trigonometry Question Bank expansion completed successfully.');
}

seedB8GeometryPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B8 geometry pool:', err);
    process.exit(1);
  });
