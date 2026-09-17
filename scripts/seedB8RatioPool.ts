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
// Constant of proportionality, basic unit conversions, distance-time graph basics,
// speed calculation.
// -----------------------------------------------------------------------------
const lowQuestions: any[] = [
  {
    id: "q_b8_rat_l01",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If $y$ is directly proportional to $x$ and $y = 48$ when $x = 4$, what is the constant of proportionality ($k$)?",
    options: ["12", "192", "44", "8"],
    correctAnswer: "12",
    hint: "Use the formula $k = \\frac{y}{x}$.",
    workedSolution: "$$k = \\frac{48}{4} = 12$$.",
    points: 1
  },
  {
    id: "q_b8_rat_l02",
    difficulty: "low",
    dokLevel: 1,
    prompt: "On a distance-time graph, what does a flat horizontal line represent?",
    options: [
      "The object is stationary (at rest)",
      "The object is moving at constant top speed",
      "The object is accelerating uniformly",
      "The object is moving backwards"
    ],
    correctAnswer: "The object is stationary (at rest)",
    hint: "Notice that distance does not change while time progresses.",
    workedSolution: "A horizontal line indicates zero gradient ($\\Delta d = 0$), meaning speed is $0\\text{ km/h}$ and the object is at rest.",
    points: 1
  },
  {
    id: "q_b8_rat_l03",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert a speed of $72\\text{ km/h}$ to metres per second ($\\text{m/s}$).",
    options: ["20 m/s", "25 m/s", "15 m/s", "30 m/s"],
    correctAnswer: "20 m/s",
    hint: "Multiply by $\\frac{1000}{3600}$ or $\\frac{5}{18}$.",
    workedSolution: "$$72 \\times \\frac{5}{18} = 4 \\times 5 = 20\\text{ m/s}$$.",
    points: 1
  },
  {
    id: "q_b8_rat_l04",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A cyclist rides at a constant speed of $15\\text{ km/h}$. How far does she travel in $3\\text{ hours}$?",
    options: ["45 km", "5 km", "18 km", "30 km"],
    correctAnswer: "45 km",
    hint: "$$\\text{Distance} = \\text{Speed} \\times \\text{Time}$$.",
    workedSolution: "$$\\text{Distance} = 15 \\times 3 = 45\\text{ km}$$.",
    points: 1
  },
  {
    id: "q_b8_rat_l05",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If the exchange rate is $\$1.00 = \\text{GH¢ } 15.00$, how much is $\$60.00$ in Ghana Cedis?",
    options: ["GH¢ 900.00", "GH¢ 750.00", "GH¢ 600.00", "GH¢ 1,000.00"],
    correctAnswer: "GH¢ 900.00",
    hint: "Multiply $\$60.00$ by 15.",
    workedSolution: "$$60 \\times 15 = \\text{GH¢ } 900.00$$.",
    points: 1
  },
  {
    id: "q_b8_rat_l06",
    difficulty: "low",
    dokLevel: 1,
    prompt: "What does the slope (gradient) of a distance-time graph represent?",
    options: ["Speed", "Acceleration", "Total distance", "Total time"],
    correctAnswer: "Speed",
    hint: "Gradient is $\\frac{\\Delta y}{\\Delta x} = \\frac{\\text{Change in distance}}{\\text{Change in time}}$.",
    workedSolution: "$$\\text{Gradient} = \\frac{\\text{Distance}}{\\text{Time}} = \\text{Speed}$$.",
    points: 1
  },
  {
    id: "q_b8_rat_l07",
    difficulty: "low",
    dokLevel: 1,
    prompt: "Convert $180\\text{ minutes}$ into hours.",
    options: ["3 hours", "2.5 hours", "4 hours", "1.8 hours"],
    correctAnswer: "3 hours",
    hint: "Divide by 60.",
    workedSolution: "$$\\frac{180}{60} = 3\\text{ hours}$$.",
    points: 1
  },
  {
    id: "q_b8_rat_l08",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If a direct proportion graph passes through $(0, 0)$ and $(5, 35)$, what is the direct variation equation?",
    options: ["y = 7x", "y = 5x", "y = x + 30", "y = 35x"],
    correctAnswer: "y = 7x",
    hint: "Find constant $k = \\frac{35}{5}$.",
    workedSolution: "$$k = \\frac{35}{5} = 7 \\implies y = 7x$$.",
    points: 1
  },
  {
    id: "q_b8_rat_l09",
    difficulty: "low",
    dokLevel: 1,
    prompt: "A runner takes $24\\text{ seconds}$ to run $200\\text{ metres}$. What is his speed in $\\text{m/s}$ in fractional form?",
    options: ["25/3 m/s", "8 m/s", "12/5 m/s", "10 m/s"],
    correctAnswer: "25/3 m/s",
    hint: "Divide $200$ by 24 and simplify the fraction.",
    workedSolution: "$$\\frac{200}{24} = \\frac{200 \\div 8}{24 \\div 8} = \\frac{25}{3}\\text{ m/s}$$.",
    points: 1
  },
  {
    id: "q_b8_rat_l10",
    difficulty: "low",
    dokLevel: 1,
    prompt: "If 1 inch is approximately $2.54\\text{ cm}$, how many centimetres are in $10\\text{ inches}$?",
    options: ["25.4 cm", "2.54 cm", "254 cm", "0.254 cm"],
    correctAnswer: "25.4 cm",
    hint: "Multiply 10 by 2.54.",
    workedSolution: "$$10 \\times 2.54 = 25.4\\text{ cm}$$.",
    points: 1
  }
];

// Fill items 11 through 25: Speed, Distance, Time direct computations
const sdtTrips = [
  { s: 50, t: 2, d: 100 },
  { s: 80, t: 3, d: 240 },
  { s: 65, t: 4, d: 260 },
  { s: 90, t: 2, d: 180 },
  { s: 40, t: 5, d: 200 },
  { s: 75, t: 2, d: 150 },
  { s: 100, t: 3, d: 300 },
  { s: 60, t: 5, d: 300 },
  { s: 45, t: 4, d: 180 },
  { s: 85, t: 2, d: 170 },
  { s: 55, t: 4, d: 220 },
  { s: 70, t: 3, d: 210 },
  { s: 95, t: 2, d: 190 },
  { s: 50, t: 6, d: 300 },
  { s: 120, t: 2, d: 240 }
];

for (let i = 0; i < sdtTrips.length; i++) {
  const trip = sdtTrips[i];
  const idx = 11 + i;
  const correct = `${trip.d} km`;
  const opt1 = `${trip.d - trip.s} km`;
  const opt2 = `${trip.d + trip.s} km`;
  const opt3 = `${Math.round(trip.d / 2)} km`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  lowQuestions.push({
    id: `q_b8_rat_l${idx < 10 ? '0' + idx : idx}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: `A commercial van travels at an average speed of $${trip.s}\\text{ km/h}$ for $${trip.t}\\text{ hours}$. What is the total distance covered?`,
    options: options,
    correctAnswer: correct,
    hint: `Use $\\text{Distance} = \\text{Speed} \\times \\text{Time}$.`,
    workedSolution: `$$\\text{Distance} = ${trip.s} \\times ${trip.t} = ${trip.d}\\text{ km}$$.`,
    points: 1
  });
}

// Fill items 26 through 50: Constant of proportionality k = y / x
for (let i = 26; i <= 50; i++) {
  const k = (i % 8) + 3; // 3 to 10
  const x = (i % 6) + 2; // 2 to 7
  const y = k * x;

  const correct = `${k}`;
  const opt1 = `${k + 2}`;
  const opt2 = `${k - 1 > 0 ? k - 1 : k + 3}`;
  const opt3 = `${y}`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  lowQuestions.push({
    id: `q_b8_rat_l${i < 10 ? '0' + i : i}`,
    difficulty: "low",
    dokLevel: 1,
    prompt: `If $y$ is directly proportional to $x$, and $y = ${y}$ when $x = ${x}$, determine the constant of proportionality ($k$).`,
    options: options,
    correctAnswer: correct,
    hint: `Recall that $y = kx \\implies k = \\frac{y}{x}$.`,
    workedSolution: `$$k = \\frac{${y}}{${x}} = ${k}$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 2. MEDIUM TIER (DOK 2) - 50 ITEMS
// Table of values proportionality check, gradients on distance-time graphs,
// fuel consumption, journeys with stops, map scales.
// -----------------------------------------------------------------------------
const mediumQuestions: any[] = [
  {
    id: "q_b8_rat_m01",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A car covers $150\\text{ km}$ in $2\\text{ hours}$ and $30\\text{ minutes}$. What is its average speed in $\\text{km/h}$?",
    options: ["60 km/h", "75 km/h", "65 km/h", "55 km/h"],
    correctAnswer: "60 km/h",
    hint: "Convert 2 hours 30 minutes to decimal: $2.5\\text{ hours}$. Divide 150 by 2.5.",
    workedSolution: "$$\\text{Time} = 2.5\\text{ hours}$$\n$$\\text{Speed} = \\frac{150}{2.5} = \\frac{1500}{25} = 60\\text{ km/h}$$.",
    points: 1
  },
  {
    id: "q_b8_rat_m02",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "Which of the following tables represents a direct proportional relationship?",
    options: [
      "x: [2, 4, 6], y: [10, 20, 30]",
      "x: [2, 4, 6], y: [10, 20, 25]",
      "x: [1, 2, 3], y: [4, 5, 6]",
      "x: [2, 3, 4], y: [8, 12, 20]"
    ],
    correctAnswer: "x: [2, 4, 6], y: [10, 20, 30]",
    hint: "The ratio $\\frac{y}{x}$ must be identical across all pairs.",
    workedSolution: "$$\\frac{10}{2} = 5, \\ \\frac{20}{4} = 5, \\ \\frac{30}{6} = 5$$. The ratio is constant ($k = 5$).",
    points: 1
  },
  {
    id: "q_b8_rat_m03",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "On a travel graph, a bus travels from $d = 20\\text{ km}$ at $t = 1\\text{ h}$ to $d = 140\\text{ km}$ at $t = 3\\text{ h}$. Calculate its speed during this stage.",
    options: ["60 km/h", "70 km/h", "40 km/h", "50 km/h"],
    correctAnswer: "60 km/h",
    hint: "$$m = \\frac{\\Delta d}{\\Delta t} = \\frac{140 - 20}{3 - 1}$$.",
    workedSolution: "$$\\text{Speed} = \\frac{140 - 20}{3 - 1} = \\frac{120}{2} = 60\\text{ km/h}$$.",
    points: 1
  },
  {
    id: "q_b8_rat_m04",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A water pump fills a tank at a constant rate of $45\\text{ litres per minute}$. How long will it take to fill a $2,700\\text{ litre}$ reservoir?",
    options: ["60 minutes", "45 minutes", "50 minutes", "75 minutes"],
    correctAnswer: "60 minutes",
    hint: "Divide total volume by rate: $\\frac{2700}{45}$.",
    workedSolution: "$$\\text{Time} = \\frac{2700}{45} = 60\\text{ minutes} = 1\\text{ hour}$$.",
    points: 1
  },
  {
    id: "q_b8_rat_m05",
    difficulty: "medium",
    dokLevel: 2,
    prompt: "A map has a scale of $1 : 50,000$. If two towns are $6\\text{ cm}$ apart on the map, what is the actual distance between them in kilometres?",
    options: ["3.0 km", "30 km", "0.3 km", "300 km"],
    correctAnswer: "3.0 km",
    hint: "Multiply $6 \\times 50,000\\text{ cm} = 300,000\\text{ cm}$. Divide by $100,000$ to get km.",
    workedSolution: "$$\\text{Distance} = 6 \\times 50,000 = 300,000\\text{ cm}$$\n$$\\frac{300,000}{100,000} = 3\\text{ km}$$.",
    points: 1
  }
];

// Fill items 6 to 25: Map scale conversions and fuel consumption rates
const mapScales = [
  { cm: 4, scale: 25000, km: 1.0 },
  { cm: 8, scale: 25000, km: 2.0 },
  { cm: 5, scale: 50000, km: 2.5 },
  { cm: 10, scale: 50000, km: 5.0 },
  { cm: 3, scale: 100000, km: 3.0 },
  { cm: 7, scale: 100000, km: 7.0 },
  { cm: 12, scale: 50000, km: 6.0 },
  { cm: 4, scale: 200000, km: 8.0 },
  { cm: 5, scale: 200000, km: 10.0 },
  { cm: 6, scale: 25000, km: 1.5 },
  { cm: 9, scale: 50000, km: 4.5 },
  { cm: 15, scale: 20000, km: 3.0 },
  { cm: 2, scale: 250000, km: 5.0 },
  { cm: 4, scale: 125000, km: 5.0 },
  { cm: 8, scale: 125000, km: 10.0 },
  { cm: 5, scale: 40000, km: 2.0 },
  { cm: 10, scale: 40000, km: 4.0 },
  { cm: 6, scale: 80000, km: 4.8 },
  { cm: 5, scale: 150000, km: 7.5 },
  { cm: 4, scale: 300000, km: 12.0 }
];

for (let i = 0; i < mapScales.length; i++) {
  const item = mapScales[i];
  const idx = 6 + i;
  const correct = `${item.km.toFixed(1)} km`;
  const opt1 = `${(item.km * 10).toFixed(1)} km`;
  const opt2 = `${(item.km / 10).toFixed(1)} km`;
  const opt3 = `${(item.km * 2).toFixed(1)} km`;
  const options = Array.from(new Set([correct, opt1, opt2, opt3])).slice(0, 4);

  mediumQuestions.push({
    id: `q_b8_rat_m${idx < 10 ? '0' + idx : idx}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `On a survey map with scale $1 : ${item.scale.toLocaleString()}$, the distance between two market centres is $${item.cm}\\text{ cm}$. What is the actual distance in kilometres?`,
    options: options,
    correctAnswer: correct,
    hint: `Ground distance in cm $= ${item.cm} \\times ${item.scale.toLocaleString()}$. Divide by $100,000$ to convert cm to km.`,
    workedSolution: `$$\\text{Ground Distance} = ${item.cm} \\times ${item.scale} = ${(item.cm * item.scale).toLocaleString()}\\text{ cm}$$\n$$\\text{Distance in km} = \\frac{${item.cm * item.scale}}{100,000} = ${item.km.toFixed(1)}\\text{ km}$$.`,
    points: 1
  });
}

// Fill items 26 to 50: Fuel consumption and gradients on travel graphs
for (let i = 26; i <= 50; i++) {
  const d1 = (i - 20) * 15;
  const d2 = d1 + 60;
  const t1 = 1;
  const t2 = 2.5; // dt = 1.5 h
  const speedVal = (d2 - d1) / (t2 - t1); // 60 / 1.5 = 40 km/h

  const distCovered = d2 - d1;
  const hours = t2 - t1;

  mediumQuestions.push({
    id: `q_b8_rat_m${i < 10 ? '0' + i : i}`,
    difficulty: "medium",
    dokLevel: 2,
    prompt: `A truck moves from coordinate $(t = ${t1}\\text{ h}, d = ${d1}\\text{ km})$ to $(t = ${t2}\\text{ h}, d = ${d2}\\text{ km})$ on a travel graph. What is the gradient (speed) of this section?`,
    options: [
      `${speedVal.toFixed(0)} km/h`,
      `${(speedVal * 1.25).toFixed(0)} km/h`,
      `${(speedVal * 0.75).toFixed(0)} km/h`,
      `${(speedVal + 10).toFixed(0)} km/h`
    ],
    correctAnswer: `${speedVal.toFixed(0)} km/h`,
    hint: `Gradient $m = \\frac{\\Delta d}{\\Delta t} = \\frac{${d2} - ${d1}}{${t2} - ${t1}}$.`,
    workedSolution: `$$\\text{Speed} = \\frac{${d2} - ${d1}}{${t2} - ${t1}} = \\frac{${distCovered}}{${hours}} = ${speedVal.toFixed(0)}\\text{ km/h}$$.`,
    points: 1
  });
}

// -----------------------------------------------------------------------------
// 3. HARD TIER (DOK 3) - 50 ITEMS
// Multi-stage travel graphs (average speed with rest stops), inverse proportion
// (workers/days, pipes), relative speeds (meeting/overtaking), multi-currency.
// -----------------------------------------------------------------------------
const hardQuestions: any[] = [
  {
    id: "q_b8_rat_h01",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Anita drove $120\\text{ km}$ from Accra to Shama in $1.5\\text{ hours}$, stopped for $30\\text{ minutes}$ to rest, and then completed another $60\\text{ km}$ to Takoradi in $1\\text{ hour}$. What was her average speed for the ENTIRE journey including the rest stop?",
    options: ["60 km/h", "72 km/h", "65 km/h", "55 km/h"],
    correctAnswer: "60 km/h",
    hint: "Total distance divided by total elapsed time (including rest stop).",
    workedSolution: "$$\\text{Total Distance} = 120 + 60 = 180\\text{ km}$$\n$$\\text{Total Time} = 1.5 + 0.5 + 1.0 = 3.0\\text{ hours}$$\n$$\\text{Average Speed} = \\frac{180}{3.0} = 60\\text{ km/h}$$.",
    points: 2
  },
  {
    id: "q_b8_rat_h02",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "If 8 men can build a school wall in 15 days, how many days will 12 men take working at the exact same pace?",
    options: ["10 days", "12 days", "8 days", "9 days"],
    correctAnswer: "10 days",
    hint: "This is inverse proportion: $\\text{Men} \\times \\text{Days} = \\text{Constant Work (Man-days)}$.",
    workedSolution: "$$\\text{Work} = 8 \\times 15 = 120\\text{ man-days}$$\n$$\\text{Days for 12 men} = \\frac{120}{12} = 10\\text{ days}$$.",
    points: 2
  },
  {
    id: "q_b8_rat_h03",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "Two vehicles leave town A and town B ($300\\text{ km}$ apart) at 8:00 a.m. travelling toward each other. Vehicle 1 travels at $60\\text{ km/h}$ and Vehicle 2 travels at $40\\text{ km/h}$. At what time will they meet?",
    options: ["11:00 a.m.", "10:30 a.m.", "12:00 p.m.", "11:30 a.m."],
    correctAnswer: "11:00 a.m.",
    hint: "Relative closing speed $= 60 + 40 = 100\\text{ km/h}$. Time $= \\frac{300}{100}$.",
    workedSolution: "$$\\text{Relative Speed} = 60 + 40 = 100\\text{ km/h}$$\n$$\\text{Time to meet} = \\frac{300}{100} = 3\\text{ hours}$$\n$$8:00\\text{ a.m.} + 3\\text{ hours} = 11:00\\text{ a.m.}$$.",
    points: 2
  },
  {
    id: "q_b8_rat_h04",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "A driver covers the first $40\\text{ km}$ of a trip at $80\\text{ km/h}$ and the remaining $60\\text{ km}$ at $30\\text{ km/h}$. What is the average speed of the trip?",
    options: ["40 km/h", "50 km/h", "45 km/h", "55 km/h"],
    correctAnswer: "40 km/h",
    hint: "Calculate time for each stage: $t_1 = 40/80 = 0.5\\text{ h}$, $t_2 = 60/30 = 2.0\\text{ h}$. Total time $= 2.5\\text{ h}$.",
    workedSolution: "$$t_1 = \\frac{40}{80} = 0.5\\text{ h}, \\quad t_2 = \\frac{60}{30} = 2.0\\text{ h}$$\n$$\\text{Total Time} = 2.5\\text{ hours}, \\quad \\text{Total Distance} = 100\\text{ km}$$\n$$\\text{Average Speed} = \\frac{100}{2.5} = 40\\text{ km/h}$$.",
    points: 2
  },
  {
    id: "q_b8_rat_h05",
    difficulty: "hard",
    dokLevel: 3,
    prompt: "On a travel graph, a car accelerates from rest to $90\\text{ km/h}$ over $15\\text{ minutes}$ ($0.25\\text{ hours}$). What was its rate of acceleration in $\\text{km/h}^2$?",
    options: ["360 km/h²", "300 km/h²", "250 km/h²", "400 km/h²"],
    correctAnswer: "360 km/h²",
    hint: "$$\\text{Acceleration} = \\frac{\\Delta v}{\\Delta t} = \\frac{90 - 0}{0.25}$$.",
    workedSolution: "$$\\text{Acceleration} = \\frac{90}{0.25} = 360\\text{ km/h}^2$$.",
    points: 2
  }
];

// Fill items 6 to 25: Relative motion and multi-stage journeys with stops
const multiStageTrips = [
  { d1: 90, t1: 1.5, stopMins: 30, d2: 90, t2: 1.0, totD: 180, totH: 3.0, avgS: 60 },
  { d1: 100, t1: 2.0, stopMins: 60, d2: 140, t2: 2.0, totD: 240, totH: 5.0, avgS: 48 },
  { d1: 80, t1: 1.0, stopMins: 30, d2: 120, t2: 2.5, totD: 200, totH: 4.0, avgS: 50 },
  { d1: 150, t1: 2.5, stopMins: 30, d2: 150, t2: 2.0, totD: 300, totH: 5.0, avgS: 60 },
  { d1: 70, t1: 1.0, stopMins: 15, d2: 110, t2: 1.75, totD: 180, totH: 3.0, avgS: 60 },
  { d1: 120, t1: 2.0, stopMins: 45, d2: 80, t2: 1.25, totD: 200, totH: 4.0, avgS: 50 },
  { d1: 60, t1: 1.0, stopMins: 30, d2: 90, t2: 1.5, totD: 150, totH: 3.0, avgS: 50 },
  { d1: 140, t1: 2.0, stopMins: 30, d2: 160, t2: 2.5, totD: 300, totH: 5.0, avgS: 60 },
  { d1: 110, t1: 1.5, stopMins: 30, d2: 130, t2: 2.0, totD: 240, totH: 4.0, avgS: 60 },
  { d1: 85, t1: 1.25, stopMins: 45, d2: 115, t2: 2.0, totD: 200, totH: 4.0, avgS: 50 },
  { d1: 75, t1: 1.5, stopMins: 30, d2: 125, t2: 2.0, totD: 200, totH: 4.0, avgS: 50 },
  { d1: 160, t1: 2.5, stopMins: 30, d2: 140, t2: 2.0, totD: 300, totH: 5.0, avgS: 60 },
  { d1: 95, t1: 1.5, stopMins: 30, d2: 145, t2: 2.0, totD: 240, totH: 4.0, avgS: 60 },
  { d1: 130, t1: 2.0, stopMins: 60, d2: 170, t2: 2.0, totD: 300, totH: 5.0, avgS: 60 },
  { d1: 50, t1: 1.0, stopMins: 30, d2: 70, t2: 1.5, totD: 120, totH: 3.0, avgS: 40 },
  { d1: 105, t1: 1.75, stopMins: 45, d2: 135, t2: 2.5, totD: 240, totH: 5.0, avgS: 48 },
  { d1: 65, t1: 1.0, stopMins: 30, d2: 95, t2: 1.5, totD: 160, totH: 3.0, avgS: 53.33 },
  { d1: 125, t1: 2.0, stopMins: 30, d2: 155, t2: 2.5, totD: 280, totH: 5.0, avgS: 56 },
  { d1: 145, t1: 2.5, stopMins: 30, d2: 155, t2: 2.0, totD: 300, totH: 5.0, avgS: 60 },
  { d1: 90, t1: 1.25, stopMins: 45, d2: 150, t2: 2.0, totD: 240, totH: 4.0, avgS: 60 }
];

for (let i = 0; i < multiStageTrips.length; i++) {
  const item = multiStageTrips[i];
  const idx = 6 + i;
  const speedStr = `${item.avgS.toFixed(0)} km/h`;
  const opt1 = `${(item.avgS * 1.2).toFixed(0)} km/h`;
  const opt2 = `${(item.avgS * 0.8).toFixed(0)} km/h`;
  const opt3 = `${(item.avgS + 12).toFixed(0)} km/h`;
  const options = Array.from(new Set([speedStr, opt1, opt2, opt3])).slice(0, 4);

  hardQuestions.push({
    id: `q_b8_rat_h${idx < 10 ? '0' + idx : idx}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `A haulage truck travels $${item.d1}\\text{ km}$ in $${item.t1}\\text{ h}$, halts for $${item.stopMins}\\text{ minutes}$ at a checkpoint, and then travels $${item.d2}\\text{ km}$ in $${item.t2}\\text{ h}$. What is the average speed for the whole journey?`,
    options: options,
    correctAnswer: speedStr,
    hint: `Sum all distances ($${item.d1} + ${item.d2} = ${item.totD}\\text{ km}$) and divide by total elapsed time including the rest stop ($${item.totH}\\text{ h}$).`,
    workedSolution: `$$\\text{Total Distance} = ${item.d1} + ${item.d2} = ${item.totD}\\text{ km}$$\n$$\\text{Total Time} = ${item.t1} + \\frac{${item.stopMins}}{60} + ${item.t2} = ${item.totH}\\text{ hours}$$\n$$\\text{Average Speed} = \\frac{${item.totD}}{${item.totH}} = ${speedStr}$$.`,
    points: 2
  });
}

// Fill items 26 to 50: Inverse proportion, workers/days, meeting times
for (let i = 26; i <= 50; i++) {
  const men = (i % 6) + 4; // 4 to 9
  const days = 15;
  const targetDays = 10;
  const menNeeded = Math.round((men * days) / targetDays);

  hardQuestions.push({
    id: `q_b8_rat_h${i < 10 ? '0' + i : i}`,
    difficulty: "hard",
    dokLevel: 3,
    prompt: `If $${men}$ skilled artisans take $${days}$ days to plaster a community clinic, how many artisans working at the same pace will complete the job in $${targetDays}$ days?`,
    options: [
      `${menNeeded} artisans`,
      `${menNeeded + 3} artisans`,
      `${menNeeded - 2 > 0 ? menNeeded - 2 : menNeeded + 2} artisans`,
      `${men + 4} artisans`
    ],
    correctAnswer: `${menNeeded} artisans`,
    hint: `Inverse proportion: $M_1 \\times D_1 = M_2 \\times D_2$. Work $= ${men} \\times ${days} = ${men * days}\\text{ artisan-days}$.`,
    workedSolution: `$$\\text{Total Work} = ${men} \\times ${days} = ${men * days}\\text{ artisan-days}$$\n$$\\text{Artisans Needed} = \\frac{${men * days}}{${targetDays}} = ${menNeeded}\\text{ artisans}$$.`,
    points: 2
  });
}

// -----------------------------------------------------------------------------
// SEEDING AND PERSISTENCE LOGIC
// -----------------------------------------------------------------------------
async function seedB8RatioPool() {
  console.log('================================================================');
  console.log('🚀 EXPANDING BASIC 8 PRACTICE POOL: topic_ratio_proportion_financial');
  console.log('================================================================');

  const docRef = db.doc('global_curriculum/jhs/subjects/math/topics/topic_ratio_proportion_financial');
  const snap = await docRef.get();

  if (!snap.exists) {
    throw new Error('Target document topic_ratio_proportion_financial not found in Firestore.');
  }

  const existingData = snap.data() || {};
  const levels = existingData.levels || {};

  const b7Count = levels.b7?.practicePool?.low?.length + levels.b7?.practicePool?.medium?.length + levels.b7?.practicePool?.hard?.length || 150;
  const b8Count = lowQuestions.length + mediumQuestions.length + hardQuestions.length;
  const b9Count = levels.b9?.practicePool?.low?.length + levels.b9?.practicePool?.medium?.length + levels.b9?.practicePool?.hard?.length || 15;
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
  const p1 = path.join(__dirname, 'payloads', 'topic_ratio_proportion_financial.json');
  const p2 = path.join(__dirname, 'payloads', 'topics', 'topic_ratio_proportion_financial.json');

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

  console.log('🎉 B8 Ratio & Proportion Question Bank expansion completed successfully.');
}

seedB8RatioPool()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Error seeding B8 ratio pool:', err);
    process.exit(1);
  });
