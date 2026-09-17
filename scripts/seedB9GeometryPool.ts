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
// VECTOR SVG GENERATORS FOR B9 GEOMETRY & TRIGONOMETRY
// =============================================================================

// 1. SOH-CAH-TOA Right-Angled Triangle SVG Helper
const createTrigTriangleSvg = (opp: string, adj: string, hyp: string) => `
<svg viewBox='0 0 280 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <polygon points='50,140 230,140 50,30' fill='#eff6ff' stroke='#1e40af' stroke-width='2.5'/>
  <!-- Right Angle Square -->
  <rect x='50' y='124' width='16' height='16' fill='none' stroke='#475569' stroke-width='1.5'/>
  <!-- Angle Arc at bottom-right (230, 140) -->
  <path d='M 195 140 A 35 35 0 0 1 204 124' fill='none' stroke='#dc2626' stroke-width='2.5'/>
  <text x='180' y='132' font-size='13' font-weight='bold' fill='#dc2626'>θ</text>
  <!-- Labels -->
  <text x='38' y='85' font-size='12' font-weight='bold' fill='#1e3a8a' text-anchor='end'>opp = ${opp}</text>
  <text x='140' y='160' font-size='12' font-weight='bold' fill='#16a34a' text-anchor='middle'>adj = ${adj}</text>
  <text x='155' y='75' font-size='12' font-weight='bold' fill='#b45309' text-anchor='middle'>hyp = ${hyp}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Angle of Elevation SVG Helper
const createElevationSvg = (dist: string, height: string, angle: string) => `
<svg viewBox='0 0 340 190' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Ground Line -->
  <line x1='30' y1='150' x2='310' y2='150' stroke='#334155' stroke-width='2'/>
  <!-- Vertical Tower/Object -->
  <line x1='270' y1='150' x2='270' y2='40' stroke='#0f172a' stroke-width='4'/>
  <rect x='254' y='134' width='16' height='16' fill='none' stroke='#475569' stroke-width='1.5'/>
  <text x='280' y='95' font-size='12' font-weight='bold' fill='#0f172a'>h = ${height}</text>
  <!-- Observer point -->
  <circle cx='60' cy='150' r='4.5' fill='#2563eb'/>
  <text x='55' y='170' font-size='11' font-weight='bold' fill='#2563eb'>Observer</text>
  <!-- Line of Sight -->
  <line x1='60' y1='150' x2='270' y2='40' stroke='#dc2626' stroke-width='2.5' stroke-dasharray='5,3'/>
  <!-- Angle Arc -->
  <path d='M 105 150 A 45 45 0 0 0 98 130' fill='none' stroke='#dc2626' stroke-width='2'/>
  <text x='112' y='142' font-size='12' font-weight='bold' fill='#dc2626'>${angle}</text>
  <!-- Distance Label -->
  <text x='165' y='170' font-size='12' font-weight='bold' fill='#16a34a' text-anchor='middle'>d = ${dist}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 3. Angle of Depression SVG Helper
const createDepressionSvg = (cliffHeight: string, dist: string, angle: string) => `
<svg viewBox='0 0 340 190' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Cliff Wall -->
  <line x1='60' y1='40' x2='60' y2='150' stroke='#0f172a' stroke-width='4'/>
  <text x='48' y='95' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='end'>h = ${cliffHeight}</text>
  <!-- Horizontal Reference at Top (Dashed) -->
  <line x1='60' y1='40' x2='220' y2='40' stroke='#64748b' stroke-width='2' stroke-dasharray='4,3'/>
  <text x='225' y='44' font-size='10' fill='#64748b'>Horizontal Eye-line</text>
  <!-- Sea / Ground Level -->
  <line x1='30' y1='150' x2='310' y2='150' stroke='#38bdf8' stroke-width='2.5'/>
  <!-- Observer at Cliff Top -->
  <circle cx='60' cy='40' r='4' fill='#2563eb'/>
  <!-- Target (Boat) -->
  <polygon points='260,150 275,150 280,142 255,142' fill='#d97706'/>
  <text x='270' y='165' font-size='10' font-weight='bold' fill='#d97706' text-anchor='middle'>Boat</text>
  <!-- Line of Sight -->
  <line x1='60' y1='40' x2='265' y2='146' stroke='#dc2626' stroke-width='2' stroke-dasharray='5,3'/>
  <!-- Depression Angle Arc -->
  <path d='M 100 40 A 40 40 0 0 1 95 58' fill='none' stroke='#dc2626' stroke-width='2'/>
  <text x='106' y='55' font-size='11' font-weight='bold' fill='#dc2626'>${angle}</text>
  <text x='160' y='170' font-size='11' font-weight='bold' fill='#0369a1' text-anchor='middle'>d = ${dist}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 4. Cylinder Net SVG Helper
const createCylinderNetSvg = (r: string, h: string) => `
<svg viewBox='0 0 300 190' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Top Circle -->
  <circle cx='150' cy='35' r='24' fill='#dcfce7' stroke='#15803d' stroke-width='1.8'/>
  <text x='150' y='38' font-size='10' font-weight='bold' fill='#166534' text-anchor='middle'>r = ${r}</text>
  <!-- Unrolled Rectangular Body -->
  <rect x='60' y='60' width='180' height='70' fill='#eff6ff' stroke='#1d4ed8' stroke-width='2'/>
  <text x='150' y='98' font-size='12' font-weight='bold' fill='#1e40af' text-anchor='middle'>Length = 2πr</text>
  <text x='48' y='98' font-size='11' font-weight='bold' fill='#1e40af' text-anchor='end'>h = ${h}</text>
  <!-- Bottom Circle -->
  <circle cx='150' cy='155' r='24' fill='#dcfce7' stroke='#15803d' stroke-width='1.8'/>
  <text x='150' y='158' font-size='10' font-weight='bold' fill='#166534' text-anchor='middle'>r = ${r}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 5. Cone Net SVG Helper
const createConeNetSvg = (r: string, l: string) => `
<svg viewBox='0 0 280 190' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Sector of circle (curved face) -->
  <path d='M 140 25 L 70 120 A 90 90 0 0 0 210 120 Z' fill='#fef3c7' stroke='#d97706' stroke-width='2'/>
  <text x='140' y='85' font-size='11' font-weight='bold' fill='#b45309' text-anchor='middle'>Curved Face (πrl)</text>
  <text x='90' y='65' font-size='10' font-weight='bold' fill='#78350f'>l = ${l}</text>
  <!-- Base circle -->
  <circle cx='140' cy='155' r='22' fill='#dbeafe' stroke='#2563eb' stroke-width='1.8'/>
  <text x='140' y='159' font-size='10' font-weight='bold' fill='#1e40af' text-anchor='middle'>r = ${r}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 6. Cuboid Net SVG Helper
const createCuboidNetSvg = (l: string, w: string, h: string) => `
<svg viewBox='0 0 300 200' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Top Face -->
  <rect x='110' y='20' width='80' height='40' fill='#f1f5f9' stroke='#334155' stroke-width='1.5'/>
  <text x='150' y='44' font-size='10' text-anchor='middle' fill='#334155'>Top</text>
  <!-- Middle row -->
  <rect x='40' y='60' width='70' height='70' fill='#e0f2fe' stroke='#0284c7' stroke-width='1.5'/>
  <text x='75' y='98' font-size='10' text-anchor='middle' fill='#0369a1'>w×h</text>
  <rect x='110' y='60' width='80' height='70' fill='#dcfce7' stroke='#16a34a' stroke-width='1.5'/>
  <text x='150' y='98' font-size='10' text-anchor='middle' fill='#15803d'>l×h (Front)</text>
  <rect x='190' y='60' width='70' height='70' fill='#e0f2fe' stroke='#0284c7' stroke-width='1.5'/>
  <text x='225' y='98' font-size='10' text-anchor='middle' fill='#0369a1'>w×h</text>
  <!-- Bottom Face -->
  <rect x='110' y='130' width='80' height='40' fill='#f1f5f9' stroke='#334155' stroke-width='1.5'/>
  <text x='150' y='154' font-size='10' text-anchor='middle' fill='#334155'>Base</text>
  <text x='150' y='190' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>l = ${l}, w = ${w}, h = ${h}</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// =============================================================================
// 1. LOW TIER QUESTIONS (DOK 1) - 50 Items
// =============================================================================
const lowQuestions: any[] = [
  {
    id: "q_b9_geo_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: `From the right-angled triangle below, find the value of $\\sin\\theta$:<br/>${createTrigTriangleSvg('3', '4', '5')}`,
    options: ["3/5", "4/5", "3/4", "5/3"],
    correctAnswer: "3/5",
    hint: "$$\\sin\\theta = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}$$.",
    workedSolution: "$$\\sin\\theta = \\frac{3}{5}$$.",
    points: 1
  },
  {
    id: "q_b9_geo_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: `From the right-angled triangle below, find the value of $\\tan\\theta$:<br/>${createTrigTriangleSvg('5', '12', '13')}`,
    options: ["5/12", "12/13", "5/13", "12/5"],
    correctAnswer: "5/12",
    hint: "$$\\tan\\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}}$$.",
    workedSolution: "$$\\tan\\theta = \\frac{5}{12}$$.",
    points: 1
  },
  {
    id: "q_b9_geo_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: `From the right-angled triangle below, evaluate $\\cos\\theta$:<br/>${createTrigTriangleSvg('8', '15', '17')}`,
    options: ["15/17", "8/17", "8/15", "17/15"],
    correctAnswer: "15/17",
    hint: "$$\\cos\\theta = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}}$$.",
    workedSolution: "$$\\cos\\theta = \\frac{15}{17}$$.",
    points: 1
  },
  {
    id: "q_b9_geo_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: `The net shown below folds to form which three-dimensional solid?<br/>${createCylinderNetSvg('r', 'h')}`,
    options: ["Closed Cylinder", "Cone", "Triangular Prism", "Square Pyramid"],
    correctAnswer: "Closed Cylinder",
    hint: "Notice the rectangular body and the two circular bases at opposite ends.",
    workedSolution: "A rectangular curved surface with two identical circular bases folds into a closed cylinder.",
    points: 1
  },
  {
    id: "q_b9_geo_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $\\tan\\theta = 1$, what is the acute angle $\\theta$ in degrees?",
    options: ["45°", "30°", "60°", "90°"],
    correctAnswer: "45°",
    hint: "In an isosceles right triangle, opposite and adjacent sides are equal, giving $\\tan 45^\\circ = 1$.",
    workedSolution: "$$\\tan 45^\\circ = 1 \\implies \\theta = 45^\\circ$$.",
    points: 1
  },
  {
    id: "q_b9_geo_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the angle of elevation of the sun when a vertical pole of height $6\\text{ m}$ casts a shadow of length $6\\text{ m}$ on level ground?",
    options: ["45°", "30°", "60°", "90°"],
    correctAnswer: "45°",
    hint: "$$\\tan\\theta = \\frac{\\text{height}}{\\text{shadow}} = \\frac{6}{6} = 1$$.",
    workedSolution: "$$\\tan\\theta = 1 \\implies \\theta = 45^\\circ$$.",
    points: 1
  },
  {
    id: "q_b9_geo_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: `A cuboid net with dimensions $l = 4\\text{ cm}, w = 3\\text{ cm}, h = 2\\text{ cm}$ is shown below:<br/>${createCuboidNetSvg('4', '3', '2')}<br/>How many rectangular faces are in its net?`,
    options: ["6", "4", "8", "12"],
    correctAnswer: "6",
    hint: "Every cuboid has 3 pairs of opposite rectangular faces.",
    workedSolution: "The net of any cuboid consists of exactly 6 rectangular faces.",
    points: 1
  },
  {
    id: "q_b9_geo_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What is the value of $\\sin 30^\\circ$?",
    options: ["1/2", "√3/2", "1", "1/√2"],
    correctAnswer: "1/2",
    hint: "Recall the standard trigonometric ratio: $\\sin 30^\\circ = 0.5$.",
    workedSolution: "$$\\sin 30^\\circ = \\frac{1}{2} = 0.5$$.",
    points: 1
  },
  {
    id: "q_b9_geo_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "The angle between an observer's horizontal eye-line and their line of sight looking DOWNWARDS at an object is termed the:",
    options: ["Angle of depression", "Angle of elevation", "Reflex angle", "Bearings"],
    correctAnswer: "Angle of depression",
    hint: "Looking down from the horizontal creates an angle of depression.",
    workedSolution: "Looking below the horizontal eye-level defines the angle of depression.",
    points: 1
  },
  {
    id: "q_b9_geo_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: `The net shown below consists of a sector of a circle and a circular base:<br/>${createConeNetSvg('r', 'l')}<br/>Which solid does this net form when folded?`,
    options: ["Cone", "Cylinder", "Square Pyramid", "Sphere"],
    correctAnswer: "Cone",
    hint: "A circular base combined with a circular sector curved face forms a cone.",
    workedSolution: "The net of a cone is composed of a circular base and a sector of a circle.",
    points: 1
  }
];

// Fill items 11 through 50 for Low DOK 1
for (let i = 11; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const triples = [
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      [7, 24, 25],
      [6, 8, 10],
      [9, 12, 15]
    ];
    const [opp, adj, hyp] = triples[i % triples.length];
    lowQuestions.push({
      id: `q_b9_geo_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `In a right-angled triangle, the opposite side to angle $\\theta$ is $${opp}\\text{ cm}$ and the hypotenuse is $${hyp}\\text{ cm}$. What is $\\sin\\theta$?`,
      options: [
        `${opp}/${hyp}`,
        `${adj}/${hyp}`,
        `${opp}/${adj}`,
        `${hyp}/${opp}`
      ],
      correctAnswer: `${opp}/${hyp}`,
      hint: "Sine is Opposite divided by Hypotenuse: $\\sin\\theta = \\frac{\\text{opp}}{\\text{hyp}}$.",
      workedSolution: `$$\\sin\\theta = \\frac{\\text{Opposite}}{\\text{Hypotenuse}} = \\frac{${opp}}{${hyp}}$$.`,
      points: 1
    });
  } else if (mod === 1) {
    const triples = [
      [3, 4, 5],
      [5, 12, 13],
      [8, 15, 17],
      [7, 24, 25],
      [9, 40, 41]
    ];
    const [opp, adj, hyp] = triples[i % triples.length];
    lowQuestions.push({
      id: `q_b9_geo_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `In a right-angled triangle, the side adjacent to angle $\\theta$ is $${adj}\\text{ cm}$ and the hypotenuse is $${hyp}\\text{ cm}$. Find $\\cos\\theta$.`,
      options: [
        `${adj}/${hyp}`,
        `${opp}/${hyp}`,
        `${adj}/${opp}`,
        `${hyp}/${adj}`
      ],
      correctAnswer: `${adj}/${hyp}`,
      hint: "Cosine is Adjacent divided by Hypotenuse: $\\cos\\theta = \\frac{\\text{adj}}{\\text{hyp}}$.",
      workedSolution: `$$\\cos\\theta = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}} = \\frac{${adj}}{${hyp}}$$.`,
      points: 1
    });
  } else if (mod === 2) {
    const specials = [
      { name: "cos 60°", val: "1/2", wrong: ["√3/2", "1", "1/√2"], exp: "\\cos 60^\\circ = \\frac{1}{2} = 0.5" },
      { name: "sin 45°", val: "1/√2", wrong: ["1/2", "√3/2", "1"], exp: "\\sin 45^\\circ = \\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}" },
      { name: "cos 45°", val: "1/√2", wrong: ["1/2", "√3/2", "0"], exp: "\\cos 45^\\circ = \\frac{1}{\\sqrt{2}}" },
      { name: "tan 60°", val: "√3", wrong: ["1/√3", "1", "2"], exp: "\\tan 60^\\circ = \\sqrt{3}" },
      { name: "tan 30°", val: "1/√3", wrong: ["√3", "1", "1/2"], exp: "\\tan 30^\\circ = \\frac{1}{\\sqrt{3}}" }
    ];
    const item = specials[i % specials.length];
    lowQuestions.push({
      id: `q_b9_geo_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `What is the exact value of $${item.name}$?`,
      options: [
        item.val,
        item.wrong[0],
        item.wrong[1],
        item.wrong[2]
      ],
      correctAnswer: item.val,
      hint: `Recall the standard trigonometric ratios for special angles ($30^\\circ, 45^\\circ, 60^\\circ$).`,
      workedSolution: `$$${item.exp}$$.`,
      points: 1
    });
  } else {
    const solidNames = ["Triangular Prism", "Square Pyramid", "Tetrahedron", "Cuboid"];
    const solid = solidNames[i % solidNames.length];
    const netDesc = solid === "Triangular Prism"
      ? "two triangular bases and three rectangular lateral faces"
      : solid === "Square Pyramid"
      ? "one square base and four triangular faces"
      : solid === "Tetrahedron"
      ? "four equilateral triangular faces"
      : "six rectangular faces";
    lowQuestions.push({
      id: `q_b9_geo_l${i < 10 ? '0' + i : i}`,
      difficulty: "low",
      dokLevel: 1,
      prompt: `A net consisting of ${netDesc} folds into which geometric solid?`,
      options: [
        solid,
        solid === "Square Pyramid" ? "Triangular Prism" : "Square Pyramid",
        "Cone",
        "Cylinder"
      ],
      correctAnswer: solid,
      hint: `Count and identify the shapes of the base and lateral faces.`,
      workedSolution: `A solid with ${netDesc} is a ${solid}.`,
      points: 1
    });
  }
}

// =============================================================================
// 2. MEDIUM TIER QUESTIONS (DOK 2) - 50 Items
// =============================================================================
const mediumQuestions: any[] = [
  {
    id: "q_b9_geo_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `From the diagram below, a surveyor stands $20\\text{ m}$ from the foot of a vertical flagpole. The angle of elevation to the top of the pole is $30^\\circ$ (Take $\\tan 30^\\circ = 0.577$):<br/>${createElevationSvg('20 m', 'h', '30°')}<br/>Calculate the height $h$ of the flagpole to 1 decimal place.`,
    options: ["11.5 m", "10.0 m", "12.2 m", "14.1 m"],
    correctAnswer: "11.5 m",
    hint: "$$\\tan 30^\\circ = \\frac{h}{20} \\implies h = 20 \\times 0.577$$.",
    workedSolution: "$$h = 20 \\times \\tan 30^\\circ = 20 \\times 0.5774 = 11.548\\text{ m} \\approx 11.5\\text{ m}$$.",
    points: 1
  },
  {
    id: "q_b9_geo_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `A closed cylinder has a radius of $7\\text{ cm}$ and a height of $10\\text{ cm}$:<br/>${createCylinderNetSvg('7 cm', '10 cm')}<br/>Calculate its total surface area using $\\pi = \\frac{22}{7}$.`,
    options: ["748 cm²", "440 cm²", "308 cm²", "616 cm²"],
    correctAnswer: "748 cm²",
    hint: "Total Surface Area $= 2\\pi rh + 2\\pi r^2 = 2\\pi r(h + r)$.",
    workedSolution: "$$\\text{TSA} = 2 \\times \\frac{22}{7} \\times 7(10 + 7) = 44 \\times 17 = 748\\text{ cm}^2$$.",
    points: 1
  },
  {
    id: "q_b9_geo_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `An observer at the top of a cliff $40\\text{ m}$ high views a fishing canoe at an angle of depression of $45^\\circ$:<br/>${createDepressionSvg('40 m', 'd', '45°')}<br/>How far is the canoe from the base of the cliff?`,
    options: ["40 m", "20 m", "40√2 m", "80 m"],
    correctAnswer: "40 m",
    hint: "The angle of elevation from the canoe to the cliff top equals the angle of depression ($45^\\circ$). $\\tan 45^\\circ = 1$.",
    workedSolution: "$$\\tan 45^\\circ = \\frac{40}{d} \\implies 1 = \\frac{40}{d} \\implies d = 40\\text{ m}$$.",
    points: 1
  },
  {
    id: "q_b9_geo_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: `The net of a rectangular box has dimensions: $l = 5\\text{ cm}, w = 4\\text{ cm}, h = 3\\text{ cm}$:<br/>${createCuboidNetSvg('5', '4', '3')}<br/>Find the total surface area of the box.`,
    options: ["94 cm²", "60 cm²", "47 cm²", "100 cm²"],
    correctAnswer: "94 cm²",
    hint: "$$A = 2(lw + lh + wh) = 2(20 + 15 + 12)$$.",
    workedSolution: "$$A = 2(20 + 15 + 12) = 2(47) = 94\\text{ cm}^2$$.",
    points: 1
  },
  {
    id: "q_b9_geo_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "In a right-angled triangle, $\\cos\\theta = \\frac{12}{13}$. What is the exact value of $\\tan\\theta$?",
    options: ["5/12", "12/5", "5/13", "13/12"],
    correctAnswer: "5/12",
    hint: "Use Pythagoras to find opposite side: $\\sqrt{13^2 - 12^2} = \\sqrt{25} = 5$. Then $\\tan\\theta = \\frac{\\text{opp}}{\\text{adj}}$.",
    workedSolution: "$$\\text{Opposite} = \\sqrt{169 - 144} = 5$$\n$$\\tan\\theta = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{5}{12}$$.",
    points: 1
  }
];

// Fill remaining Medium items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const dist = 12 + (i % 7) * 4;
    mediumQuestions.push({
      id: `q_b9_geo_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `From a point on level ground $${dist}\\text{ m}$ away from the foot of a tree, the angle of elevation of the top is $45^\\circ$. What is the height of the tree?`,
      options: [
        `${dist} m`,
        `${dist * 2} m`,
        `${dist / 2} m`,
        `${dist + 5} m`
      ],
      correctAnswer: `${dist} m`,
      hint: "Since $\\tan 45^\\circ = 1$, the opposite side (height) equals the adjacent side (distance).",
      workedSolution: `$$\\tan 45^\\circ = \\frac{h}{${dist}} \\implies 1 = \\frac{h}{${dist}} \\implies h = ${dist}\\text{ m}$$.`,
      points: 1
    });
  } else if (mod === 1) {
    const l = 4 + (i % 4);
    const w = 3 + (i % 3);
    const h = 2 + (i % 2);
    const tsa = 2 * (l * w + l * h + w * h);
    mediumQuestions.push({
      id: `q_b9_geo_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Calculate the total surface area of a rectangular cuboid with length $l = ${l}\\text{ cm}$, width $w = ${w}\\text{ cm}$, and height $h = ${h}\\text{ cm}$.`,
      options: [
        `${tsa} cm²`,
        `${tsa + 10} cm²`,
        `${tsa - 10} cm²`,
        `${l * w * h} cm²`
      ],
      correctAnswer: `${tsa} cm²`,
      hint: `Use $\\text{TSA} = 2(lw + lh + wh) = 2(${l * w} + ${l * h} + ${w * h})$.`,
      workedSolution: `$$\\text{TSA} = 2(${l * w} + ${l * h} + ${w * h}) = 2(${l * w + l * h + w * h}) = ${tsa}\\text{ cm}^2$$.`,
      points: 1
    });
  } else if (mod === 2) {
    const r = 7;
    const h = 5 + (i % 10);
    const csa = 2 * (22 / 7) * r * h;
    mediumQuestions.push({
      id: `q_b9_geo_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `Find the curved surface area of a cylinder of radius $r = ${r}\\text{ cm}$ and height $h = ${h}\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).`,
      options: [
        `${csa} cm²`,
        `${csa + 154} cm²`,
        `${csa - 44} cm²`,
        `${csa / 2} cm²`
      ],
      correctAnswer: `${csa} cm²`,
      hint: `Curved surface area $= 2\\pi rh = 2 \\times \\frac{22}{7} \\times ${r} \\times ${h}$.`,
      workedSolution: `$$\\text{CSA} = 2 \\times \\frac{22}{7} \\times 7 \\times ${h} = 44 \\times ${h} = ${csa}\\text{ cm}^2$$.`,
      points: 1
    });
  } else {
    const triples = [
      { opp: 3, adj: 4, hyp: 5 },
      { opp: 5, adj: 12, hyp: 13 },
      { opp: 8, adj: 15, hyp: 17 }
    ];
    const item = triples[i % triples.length];
    mediumQuestions.push({
      id: `q_b9_geo_m${i < 10 ? '0' + i : i}`,
      difficulty: "medium",
      dokLevel: 2,
      prompt: `If $\\tan\\theta = \\frac{${item.opp}}{${item.adj}}$, what is the exact value of $\\cos\\theta$ for acute angle $\\theta$?`,
      options: [
        `${item.adj}/${item.hyp}`,
        `${item.opp}/${item.hyp}`,
        `${item.hyp}/${item.adj}`,
        `${item.adj}/${item.opp}`
      ],
      correctAnswer: `${item.adj}/${item.hyp}`,
      hint: `Find the hypotenuse using Pythagoras: $\\text{hyp} = \\sqrt{${item.opp}^2 + ${item.adj}^2} = ${item.hyp}$. Then $\\cos\\theta = \\frac{\\text{adj}}{\\text{hyp}}$.`,
      workedSolution: `$$\\text{hyp} = \\sqrt{${item.opp * item.opp} + ${item.adj * item.adj}} = ${item.hyp}$$\n$$\\cos\\theta = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}} = \\frac{${item.adj}}{${item.hyp}}$$.`,
      points: 1
    });
  }
}

// =============================================================================
// 3. HARD TIER QUESTIONS (DOK 3) - 50 Items
// =============================================================================
const hardQuestions: any[] = [
  {
    id: "q_b9_geo_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Two observers $A$ and $B$ stand on level ground on opposite sides of a communication tower of height $30\\text{ m}$. Observer $A$ measures an angle of elevation of $45^\\circ$, while observer $B$ measures an angle of elevation of $60^\\circ$ (Take $\\tan 60^\\circ = 1.732$). What is the total distance between observers $A$ and $B$ to 1 decimal place?",
    options: ["47.3 m", "30.0 m", "52.0 m", "45.5 m"],
    correctAnswer: "47.3 m",
    hint: "Calculate individual ground distances $d_A$ and $d_B$, then add: $d_A = \\frac{30}{\\tan 45^\\circ} = 30$, $d_B = \\frac{30}{\\tan 60^\\circ} = \\frac{30}{1.732}$.",
    workedSolution: "$$d_A = \\frac{30}{\\tan 45^\\circ} = 30\\text{ m}$$\n$$d_B = \\frac{30}{1.732} \\approx 17.32\\text{ m}$$\n$$\\text{Total Distance} = 30 + 17.32 = 47.32\\text{ m} \\approx 47.3\\text{ m}$$.",
    points: 2
  },
  {
    id: "q_b9_geo_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: `An open cylindrical water tank (without top lid) has an internal radius of $7\\text{ cm}$ and a height of $15\\text{ cm}$:<br/>${createCylinderNetSvg('7 cm', '15 cm')}<br/>Calculate the total interior surface area that needs waterproofing (Take $\\pi = \\frac{22}{7}$).`,
    options: ["814 cm²", "968 cm²", "660 cm²", "770 cm²"],
    correctAnswer: "814 cm²",
    hint: "For an open cylinder, include only ONE circular base: $\\text{Area} = 2\\pi rh + \\pi r^2$.",
    workedSolution: "$$\\text{Curved Surface Area} = 2 \\times \\frac{22}{7} \\times 7 \\times 15 = 44 \\times 15 = 660\\text{ cm}^2$$\n$$\\text{One Base Area} = \\frac{22}{7} \\times 7^2 = 154\\text{ cm}^2$$\n$$\\text{Total Interior Area} = 660 + 154 = 814\\text{ cm}^2$$.",
    points: 2
  },
  {
    id: "q_b9_geo_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "From the top of a cliff $60\\text{ m}$ high, the angles of depression of two boats in a straight line with the base of the cliff are $30^\\circ$ and $45^\\circ$ respectively (Take $\\tan 30^\\circ = 0.577$). Calculate the distance between the two boats.",
    options: ["44.0 m", "60.0 m", "104.0 m", "34.6 m"],
    correctAnswer: "44.0 m",
    hint: "$d_1 = \\frac{60}{\\tan 45^\\circ} = 60\\text{ m}$. $d_2 = \\frac{60}{\\tan 30^\\circ} = \\frac{60}{0.5774} \\approx 103.9\\text{ m}$. Subtract $d_2 - d_1$.",
    workedSolution: "$$d_1 = \\frac{60}{1} = 60\\text{ m}$$\n$$d_2 = \\frac{60}{0.5774} \\approx 103.92\\text{ m}$$\n$$\\text{Distance between boats} = 103.92 - 60 = 43.92\\text{ m} \\approx 44.0\\text{ m}$$.",
    points: 2
  },
  {
    id: "q_b9_geo_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A rectangular hall has length $12\\text{ m}$, width $9\\text{ m}$, and height $8\\text{ m}$. What is the length of the longest rigid pole that can fit inside the hall (the 3D space diagonal)?",
    options: ["17 m", "15 m", "20 m", "16 m"],
    correctAnswer: "17 m",
    hint: "Use 3D Pythagoras theorem: $D = \\sqrt{l^2 + w^2 + h^2} = \\sqrt{12^2 + 9^2 + 8^2}$.",
    workedSolution: "$$D = \\sqrt{144 + 81 + 64} = \\sqrt{289} = 17\\text{ m}$$.",
    points: 2
  },
  {
    id: "q_b9_geo_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "The net of a square pyramid consists of a square base of side $10\\text{ cm}$ and four congruent isosceles triangles each with a slant height of $13\\text{ cm}$. Find the total surface area of the pyramid.",
    options: ["360 cm²", "260 cm²", "100 cm²", "420 cm²"],
    correctAnswer: "360 cm²",
    hint: "Base area $= 10^2 = 100$. Four triangles $= 4 \\times \\left(\\frac{1}{2} \\times 10 \\times 13\\right) = 260$. Add both.",
    workedSolution: "$$\\text{Base Area} = 10 \\times 10 = 100\\text{ cm}^2$$\n$$\\text{Lateral Area} = 4 \\times \\left(\\frac{1}{2} \\times 10 \\times 13\\right) = 4 \\times 65 = 260\\text{ cm}^2$$\n$$\\text{Total Surface Area} = 100 + 260 = 360\\text{ cm}^2$$.",
    points: 2
  }
];

// Fill remaining Hard items up to 50
for (let i = 6; i <= 50; i++) {
  const mod = i % 4;
  if (mod === 0) {
    const r = 7;
    const h = 10 + (i % 15);
    const closedTSA = Math.round(2 * (22 / 7) * r * (h + r));
    hardQuestions.push({
      id: `q_b9_geo_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Calculate the total surface area of a closed cylindrical container fabricated from a net with circular bases of radius $r = ${r}\\text{ cm}$ and a height of $h = ${h}\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).`,
      options: [
        `${closedTSA} cm²`,
        `${closedTSA - 154} cm²`,
        `${closedTSA + 154} cm²`,
        `${closedTSA - 44} cm²`
      ],
      correctAnswer: `${closedTSA} cm²`,
      hint: `Use the formula $\\text{TSA} = 2\\pi r(h + r) = 2 \\times \\frac{22}{7} \\times ${r} \\times (${h} + ${r})$.`,
      workedSolution: `$$\\text{TSA} = 44 \\times (${h} + 7) = 44 \\times ${h + 7} = ${closedTSA}\\text{ cm}^2$$.`,
      points: 2
    });
  } else if (mod === 1) {
    const quadruples = [
      { l: 2, w: 3, h: 6, d: 7 },
      { l: 1, w: 4, h: 8, d: 9 },
      { l: 2, w: 6, h: 9, d: 11 },
      { l: 3, w: 4, h: 12, d: 13 },
      { l: 6, w: 10, h: 15, d: 19 },
      { l: 4, w: 7, h: 4, d: 9 }
    ];
    const quad = quadruples[i % quadruples.length];
    hardQuestions.push({
      id: `q_b9_geo_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `A storage crate has internal dimensions $l = ${quad.l}\\text{ m}$, $w = ${quad.w}\\text{ m}$, and $h = ${quad.h}\\text{ m}$. What is the maximum length of a straight metal pipe that can be packed inside?`,
      options: [
        `${quad.d} m`,
        `${quad.d + 1} m`,
        `${quad.d - 1} m`,
        `${quad.l + quad.w + quad.h} m`
      ],
      correctAnswer: `${quad.d} m`,
      hint: `Compute the 3D space diagonal: $D = \\sqrt{l^2 + w^2 + h^2} = \\sqrt{${quad.l}^2 + ${quad.w}^2 + ${quad.h}^2}$.`,
      workedSolution: `$$D = \\sqrt{${quad.l * quad.l} + ${quad.w * quad.w} + ${quad.h * quad.h}} = \\sqrt{${quad.d * quad.d}} = ${quad.d}\\text{ m}$$.`,
      points: 2
    });
  } else if (mod === 2) {
    const r = 7;
    const l = 13 + (i % 6) * 5;
    const coneTSA = Math.round((22 / 7) * r * (l + r));
    hardQuestions.push({
      id: `q_b9_geo_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Find the total surface area of a solid right circular cone with base radius $r = ${r}\\text{ cm}$ and slant height $l = ${l}\\text{ cm}$. (Take $\\pi = \\frac{22}{7}$).`,
      options: [
        `${coneTSA} cm²`,
        `${coneTSA - 154} cm²`,
        `${coneTSA + 154} cm²`,
        `${Math.round((22 / 7) * r * l)} cm²`
      ],
      correctAnswer: `${coneTSA} cm²`,
      hint: `Total surface area of cone $= \\pi r(l + r) = \\frac{22}{7} \\times ${r} \\times (${l} + ${r})$.`,
      workedSolution: `$$\\text{TSA} = 22 \\times (${l} + 7) = 22 \\times ${l + 7} = ${coneTSA}\\text{ cm}^2$$.`,
      points: 2
    });
  } else {
    const h = 20 + (i % 5) * 10;
    const sep = Math.round(h * 0.732);
    hardQuestions.push({
      id: `q_b9_geo_h${i < 10 ? '0' + i : i}`,
      difficulty: "hard",
      dokLevel: 3,
      prompt: `Two observers stand on the SAME side of a vertical transmission mast of height $${h}\\text{ m}$. Their angles of elevation to the top are $45^\\circ$ and $30^\\circ$ respectively (Take $\\tan 30^\\circ = 0.577$). What is the distance between the two observers to the nearest meter?`,
      options: [
        `${sep} m`,
        `${Math.round(h * 1.732)} m`,
        `${h} m`,
        `${sep + 10} m`
      ],
      correctAnswer: `${sep} m`,
      hint: `Distance of closer observer $= \\frac{${h}}{\\tan 45^\\circ} = ${h}\\text{ m}$. Distance of farther observer $= \\frac{${h}}{0.577} \\approx ${Math.round(h / 0.5774)}\\text{ m}$. Find their difference.`,
      workedSolution: `$$d_1 = \\frac{${h}}{1} = ${h}\\text{ m}$$\n$$d_2 = \\frac{${h}}{0.5774} \\approx ${Math.round(h / 0.5774)}\\text{ m}$$\n$$\\text{Distance between them} = ${Math.round(h / 0.5774)} - ${h} = ${sep}\\text{ m}$$.`,
      points: 2
    });
  }
}

// =============================================================================
// SEEDING AND PERSISTENCE LOGIC
// =============================================================================
async function seedB9GeometryPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 9 PRACTICE POOL: topic_geometry_and_trigonometry');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_geometry_and_trigonometry');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_geometry_and_trigonometry not found in Firestore.');
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
  const p1 = path.resolve(process.cwd(), 'scripts', 'payloads', 'topic_geometry_and_trigonometry.json');
  const p2 = path.resolve(process.cwd(), 'scripts', 'payloads', 'topics', 'topic_geometry_and_trigonometry.json');

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

  console.log('🎉 B9 Geometry, Measurement & Trigonometry Question Bank expansion completed successfully.');
}

seedB9GeometryPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B9 geometry pool:', err);
    process.exit(1);
  });
