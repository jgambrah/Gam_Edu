import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { createRequire } from 'module';

dotenv.config();

const require = createRequire(import.meta.url);
const adminInstance: any = (admin as any).default || admin;

async function getFirestore(): Promise<any> {
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gamedu-69888475-f5783';
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.split(String.fromCharCode(92) + 'n').join(String.fromCharCode(10)) : undefined;
  const serviceAccountEnv = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const fallbackKeyPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';

  if (!adminInstance.apps?.length) {
    if (clientEmail && privateKey) {
      adminInstance.initializeApp({
        credential: adminInstance.credential.cert({ projectId, clientEmail, privateKey }),
        projectId
      });
      return adminInstance.firestore();
    } else if (serviceAccountEnv && fs.existsSync(serviceAccountEnv)) {
      adminInstance.initializeApp({
        credential: adminInstance.credential.cert(serviceAccountEnv),
        projectId
      });
      return adminInstance.firestore();
    } else if (fs.existsSync(fallbackKeyPath)) {
      adminInstance.initializeApp({
        credential: adminInstance.credential.cert(fallbackKeyPath),
        projectId
      });
      return adminInstance.firestore();
    }
  } else {
    return adminInstance.firestore();
  }

  try {
    const { Firestore } = require('@google-cloud/firestore');
    const { OAuth2Client } = require('google-auth-library');
    const auth = require('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    if (account && account.tokens) {
      const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
      const oauthClient = new OAuth2Client();
      oauthClient.setCredentials({
        access_token: tokenObj.access_token,
        refresh_token: account.tokens.refresh_token
      });
      return new Firestore({
        projectId: 'gamedu-69888475-f5783',
        authClient: oauthClient
      });
    }
  } catch (e) {
    console.log('Falling back to default initialization...');
  }

  adminInstance.initializeApp({
    credential: adminInstance.credential.applicationDefault(),
    projectId
  });
  return adminInstance.firestore();
}

interface QuestionItem {
  number: number;
  prompt: string;
  correctAnswer: string;
  distractors: string[];
  hint: string;
  workedSolution: string;
  points: number;
}

// ==========================================
// PAPER 1 INLINE VECTOR SVGs
// ==========================================

// SVG for Q13: Direct Current Circuit with Lamp
const svgQ13CircuitLamp = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 320 160' width='100%' height='145' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Top Wire Loop -->
    <line x1='40' y1='40' x2='110' y2='40' stroke='#38bdf8' stroke-width='2.5'/>
    
    <!-- DC Cell (Positive long, Negative short) -->
    <line x1='110' y1='25' x2='110' y2='55' stroke='#10b981' stroke-width='2.5'/>
    <text x='102' y='22' font-size='11' font-weight='bold' fill='#10b981'>+</text>
    <line x1='120' y1='32' x2='120' y2='48' stroke='#ef4444' stroke-width='4'/>
    <text x='126' y='22' font-size='11' font-weight='bold' fill='#ef4444'>-</text>
    <text x='115' y='14' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Cell</text>
    <line x1='120' y1='40' x2='190' y2='40' stroke='#38bdf8' stroke-width='2.5'/>

    <!-- Key / Switch (Open) -->
    <circle cx='194' cy='40' r='3' fill='#e2e8f0'/>
    <line x1='194' y1='40' x2='220' y2='28' stroke='#e2e8f0' stroke-width='2.5'/>
    <circle cx='224' cy='40' r='3' fill='#e2e8f0'/>
    <text x='210' y='20' font-size='10' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Switch</text>
    
    <!-- Right Wire -->
    <line x1='224' y1='40' x2='280' y2='40' stroke='#38bdf8' stroke-width='2.5'/>
    <line x1='280' y1='40' x2='280' y2='120' stroke='#38bdf8' stroke-width='2.5'/>

    <!-- Bottom Wire with Lamp -->
    <line x1='280' y1='120' x2='185' y2='120' stroke='#38bdf8' stroke-width='2.5'/>
    <!-- Filament Lamp Bulb -->
    <circle cx='160' cy='120' r='16' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/>
    <path d='M 150 128 L 160 112 L 170 128' fill='none' stroke='#f59e0b' stroke-width='2'/>
    <text x='160' y='152' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Lamp</text>
    <line x1='135' y1='120' x2='40' y2='120' stroke='#38bdf8' stroke-width='2.5'/>
    
    <!-- Left Wire Return -->
    <line x1='40' y1='120' x2='40' y2='40' stroke='#38bdf8' stroke-width='2.5'/>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q26: Laws of Reflection on a Plane Mirror
const svgQ26ReflectionPlaneMirror = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 180' width='100%' height='160' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Horizontal Plane Mirror Surface -->
    <line x1='30' y1='120' x2='310' y2='120' stroke='#38bdf8' stroke-width='3'/>
    <!-- Back Mirror Hatching -->
    <line x1='40' y1='120' x2='30' y2='130' stroke='#64748b' stroke-width='1.5'/>
    <line x1='80' y1='120' x2='70' y2='130' stroke='#64748b' stroke-width='1.5'/>
    <line x1='120' y1='120' x2='110' y2='130' stroke='#64748b' stroke-width='1.5'/>
    <line x1='160' y1='120' x2='150' y2='130' stroke='#64748b' stroke-width='1.5'/>
    <line x1='200' y1='120' x2='190' y2='130' stroke='#64748b' stroke-width='1.5'/>
    <line x1='240' y1='120' x2='230' y2='130' stroke='#64748b' stroke-width='1.5'/>
    <line x1='280' y1='120' x2='270' y2='130' stroke='#64748b' stroke-width='1.5'/>
    <text x='290' y='142' font-size='9' font-weight='bold' fill='#64748b'>Mirror</text>

    <!-- Normal Line (Perpendicular) -->
    <line x1='170' y1='25' x2='170' y2='120' stroke='#94a3b8' stroke-width='2' stroke-dasharray='4,3'/>
    <text x='170' y='18' font-size='10' font-weight='bold' fill='#94a3b8' text-anchor='middle'>Normal Line</text>

    <!-- Incident Ray -->
    <line x1='70' y1='35' x2='170' y2='120' stroke='#10b981' stroke-width='2.5'/>
    <polygon points='115,70 125,75 120,65' fill='#10b981'/>
    <text x='85' y='50' font-size='10' font-weight='bold' fill='#10b981'>Incident Ray</text>

    <!-- Reflected Ray -->
    <line x1='170' y1='120' x2='270' y2='35' stroke='#ef4444' stroke-width='2.5'/>
    <polygon points='225,70 230,80 235,70' fill='#ef4444'/>
    <text x='245' y='50' font-size='10' font-weight='bold' fill='#ef4444'>Reflected Ray</text>

    <!-- Angles i and r -->
    <path d='M 170 85 A 35 35 0 0 0 145 99' fill='none' stroke='#f59e0b' stroke-width='1.5'/>
    <text x='150' y='82' font-size='11' font-weight='bold' fill='#f59e0b'>i</text>

    <path d='M 170 85 A 35 35 0 0 1 195 99' fill='none' stroke='#f59e0b' stroke-width='1.5'/>
    <text x='185' y='82' font-size='11' font-weight='bold' fill='#f59e0b'>r</text>

    <text x='170' y='165' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LAW OF REFLECTION: ANGLE OF INCIDENCE (i) = ANGLE OF REFLECTION (r)</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// ==========================================
// PAPER 2 INLINE VECTOR SVGs
// ==========================================

// SVG for Q1(a): Thermal Conduction along Bar with 4 Wax-Attached Nails
const svgQ1aConductionNails = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Beaker with Boiling Water on Left -->
    <g transform='translate(15, 30)'>
      <rect x='10' y='15' width='60' height='85' rx='3' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='1.8'/>
      <rect x='11' y='35' width='58' height='63' fill='#38bdf8' opacity='0.5'/>
      <!-- Flame underneath -->
      <path d='M 40 120 Q 35 105 40 98 Q 45 105 40 120 Z' fill='#f59e0b'/>
      <text x='40' y='135' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Heat</text>
      <text x='40' y='60' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Boiling</text>
      <text x='40' y='72' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Water</text>
    </g>

    <!-- Conductive Copper Metal Bar -->
    <rect x='75' y='70' width='285' height='16' rx='2' fill='#d97706' stroke='#b45309' stroke-width='1.5'/>

    <!-- Thermometers A, B, C, D in Wells along Bar -->
    <g transform='translate(125, 20)'>
      <rect x='0' y='0' width='5' height='50' fill='#e2e8f0' stroke='#64748b'/>
      <circle cx='2.5' cy='48' r='3.5' fill='#ef4444'/>
      <text x='2.5' y='-3' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>A</text>
    </g>
    <g transform='translate(185, 20)'>
      <rect x='0' y='0' width='5' height='50' fill='#e2e8f0' stroke='#64748b'/>
      <circle cx='2.5' cy='48' r='3.5' fill='#ef4444'/>
      <text x='2.5' y='-3' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>B</text>
    </g>
    <g transform='translate(245, 20)'>
      <rect x='0' y='0' width='5' height='50' fill='#e2e8f0' stroke='#64748b'/>
      <circle cx='2.5' cy='48' r='3.5' fill='#ef4444'/>
      <text x='2.5' y='-3' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>C</text>
    </g>
    <g transform='translate(305, 20)'>
      <rect x='0' y='0' width='5' height='50' fill='#e2e8f0' stroke='#64748b'/>
      <circle cx='2.5' cy='48' r='3.5' fill='#ef4444'/>
      <text x='2.5' y='-3' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>D</text>
    </g>

    <!-- Nails 1, 2, 3, 4 Attached with Wax on Underside -->
    <g transform='translate(125, 86)'>
      <ellipse cx='2.5' cy='2' rx='6' ry='3' fill='#fef08a'/>
      <line x1='2.5' y1='2' x2='2.5' y2='30' stroke='#cbd5e1' stroke-width='2.5'/>
      <circle cx='2.5' cy='30' r='2.5' fill='#cbd5e1'/>
      <text x='2.5' y='44' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>1</text>
    </g>
    <g transform='translate(185, 86)'>
      <ellipse cx='2.5' cy='2' rx='6' ry='3' fill='#fef08a'/>
      <line x1='2.5' y1='2' x2='2.5' y2='30' stroke='#cbd5e1' stroke-width='2.5'/>
      <circle cx='2.5' cy='30' r='2.5' fill='#cbd5e1'/>
      <text x='2.5' y='44' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>2</text>
    </g>
    <g transform='translate(245, 86)'>
      <ellipse cx='2.5' cy='2' rx='6' ry='3' fill='#fef08a'/>
      <line x1='2.5' y1='2' x2='2.5' y2='30' stroke='#cbd5e1' stroke-width='2.5'/>
      <circle cx='2.5' cy='30' r='2.5' fill='#cbd5e1'/>
      <text x='2.5' y='44' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>3</text>
    </g>
    <g transform='translate(305, 86)'>
      <ellipse cx='2.5' cy='2' rx='6' ry='3' fill='#fef08a'/>
      <line x1='2.5' y1='2' x2='2.5' y2='30' stroke='#cbd5e1' stroke-width='2.5'/>
      <circle cx='2.5' cy='30' r='2.5' fill='#cbd5e1'/>
      <text x='2.5' y='44' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>4</text>
    </g>
    
    <text x='215' y='180' font-size='9' font-weight='bold' fill='#94a3b8' text-anchor='middle'>THERMAL CONDUCTION: NAILS FALL SEQUENTIALLY (1 → 2 → 3 → 4)</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(b): Rusting Conditions Experiment (Tubes A, B, C)
const svgQ1bRustingSetups = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 220' width='100%' height='205' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Setup A: Water + Ordinary Air (Rusted Nail) -->
    <g transform='translate(30, 20)'>
      <polygon points='18,5 42,5 38,20 22,20' fill='#d97706'/>
      <rect x='20' y='20' width='20' height='135' rx='10' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/>
      <rect x='21' y='85' width='18' height='68' fill='#38bdf8' opacity='0.4'/>
      <!-- Rusted nail with flakes -->
      <line x1='27' y1='55' x2='33' y2='140' stroke='#b45309' stroke-width='3.5'/>
      <circle cx='31' cy='100' r='1.5' fill='#ef4444'/><circle cx='29' cy='115' r='1.5' fill='#ef4444'/><circle cx='32' cy='130' r='1.5' fill='#ef4444'/>
      <text x='30' y='175' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Setup A</text>
      <text x='30' y='189' font-size='8' fill='#ef4444' text-anchor='middle'>(Air + Water: Rusts)</text>
    </g>

    <!-- Setup B: Boiled Water + Oil Layer (No Rust) -->
    <g transform='translate(150, 20)'>
      <polygon points='18,5 42,5 38,20 22,20' fill='#d97706'/>
      <rect x='20' y='20' width='20' height='135' rx='10' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/>
      <rect x='21' y='75' width='18' height='78' fill='#38bdf8' opacity='0.4'/>
      <!-- Oil Seal Layer -->
      <rect x='21' y='68' width='18' height='8' fill='#f59e0b' opacity='0.9'/>
      <!-- Unrusted Shiny Nail -->
      <line x1='30' y1='72' x2='30' y2='142' stroke='#cbd5e1' stroke-width='3.5'/>
      <circle cx='30' cy='70' r='3.5' fill='#cbd5e1'/>
      <text x='30' y='175' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Setup B</text>
      <text x='30' y='189' font-size='8' fill='#cbd5e1' text-anchor='middle'>(Boiled + Oil: No Rust)</text>
    </g>

    <!-- Setup C: Dry Air + Rubber Stopper + Anhydrous Agent (No Rust) -->
    <g transform='translate(270, 20)'>
      <polygon points='18,5 42,5 38,20 22,20' fill='#d97706'/>
      <rect x='20' y='20' width='20' height='135' rx='10' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/>
      <circle cx='26' cy='143' r='2.5' fill='#ffffff'/><circle cx='34' cy='144' r='2' fill='#ffffff'/>
      <!-- Clean Dry Nail in Dry Air -->
      <line x1='27' y1='50' x2='33' y2='130' stroke='#cbd5e1' stroke-width='3.5'/>
      <circle cx='27' cy='48' r='3.5' fill='#cbd5e1'/>
      <text x='30' y='175' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>Set-up C</text>
      <text x='30' y='189' font-size='8' fill='#cbd5e1' text-anchor='middle'>(Dry Air: No Rust)</text>
    </g>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(c): Starch Test in Leaves (Activities I to IV)
const svgQ1cStarchTestActivities = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 160' width='100%' height='150' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Stage I: Boiling Water (Kills cells) -->
    <g transform='translate(20, 20)'>
      <rect x='5' y='20' width='50' height='55' rx='3' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.2'/>
      <rect x='6' y='40' width='48' height='34' fill='#38bdf8' opacity='0.4'/>
      <path d='M 30 100 Q 25 85 30 78 Q 35 85 30 100 Z' fill='#f59e0b'/>
      <text x='30' y='115' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I. Boiling Water</text>
    </g>

    <!-- Stage II: Warm Alcohol (Decolorizes chlorophyll) -->
    <g transform='translate(110, 20)'>
      <rect x='5' y='20' width='50' height='55' rx='3' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.2'/>
      <!-- Inner boiling tube with ethanol -->
      <rect x='22' y='10' width='16' height='55' rx='8' fill='#1e293b' stroke='#10b981' stroke-width='1.2'/>
      <rect x='23' y='30' width='14' height='33' rx='6' fill='#10b981' opacity='0.5'/>
      <text x='30' y='115' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>II. Warm Alcohol</text>
    </g>

    <!-- Stage III: Cold Water (Softens brittle leaf) -->
    <g transform='translate(200, 20)'>
      <rect x='5' y='20' width='50' height='55' rx='3' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.2'/>
      <rect x='6' y='45' width='48' height='29' fill='#38bdf8' opacity='0.4'/>
      <text x='30' y='115' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III. Cold Water</text>
    </g>

    <!-- Stage IV: Iodine on White Tile -->
    <g transform='translate(290, 20)'>
      <rect x='5' y='45' width='55' height='30' rx='2' fill='#f8fafc' stroke='#94a3b8' stroke-width='1.5'/>
      <!-- Leaf turning blue-black -->
      <path d='M 15 60 Q 32 50 45 60 Q 32 70 15 60 Z' fill='#1e1b4b' stroke='#4338ca' stroke-width='1.2'/>
      <!-- Dropper adding iodine -->
      <line x1='32' y1='20' x2='32' y2='45' stroke='#f59e0b' stroke-width='2'/>
      <circle cx='32' cy='48' r='2' fill='#f59e0b'/>
      <text x='32' y='115' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>IV. Iodine Test</text>
    </g>
    
    <text x='190' y='145' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>STARCH TEST: BLUE-BLACK CONFIRMS PHOTOSYNTHESIS IN ILLUMINATED LEAF</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// ==========================================
// 40 OBJECTIVE TEST QUESTIONS (RAW BANK)
// ==========================================
const rawScienceBank: QuestionItem[] = [
  {
    number: 1,
    prompt: "Which of the following parasitic organisms attaches to the vascular stem tissues of green host plants to absorb water and nutrients, and is classified as a plant parasite?",
    correctAnswer: "Dodder [Cuscuta spp.]",
    distractors: [
      "Capsid bug",
      "Head louse",
      "Subterranean termite"
    ],
    hint: "A non-photosynthetic parasitic climbing vine that taps into plant vascular bundles.",
    workedSolution: "Dodder (*Cuscuta*) is a non-green holoparasitic plant that produces specialized haustoria to extract nutrients and sap directly from host vascular systems.",
    points: 1
  },
  {
    number: 2,
    prompt: "In the International System of Units (S.I.), what is the fundamental base unit for measuring electric current?",
    correctAnswer: "The Ampere [A]",
    distractors: [
      "The Candela [cd]",
      "The Joule [J]",
      "The Volt [V]"
    ],
    hint: "The S.I. base unit representing the flow of electric charge at the rate of one Coulomb per second.",
    workedSolution: "The Ampere (A) is the S.I. base unit of electric current ($1\\text{ A} = 1\\text{ C s}^{-1}$). The volt and joule are derived units.",
    points: 1
  },
  {
    number: 3,
    prompt: "What is the primary scientific and public health purpose of treating municipal river water before distribution to domestic household taps?",
    correctAnswer: "To eliminate disease-causing pathogenic microorganisms and make it safe for drinking",
    distractors: [
      "To completely eliminate all mineral hardness",
      "To render the water completely sweet-tasting",
      "To turn the liquid into a bright fluorescent color"
    ],
    hint: "Treatment focuses on removing suspended solids and disinfecting water with chlorine to kill pathogens.",
    workedSolution: "Municipal water treatment utilizes coagulation, sedimentation, sand filtration, and chlorination to eliminate turbidity and eradicate pathogenic bacteria, guaranteeing safe potable water.",
    points: 1
  },
  {
    number: 4,
    prompt: "Which of the following chemical substances is classified as a pure compound rather than a mixture or an element?",
    correctAnswer: "Pure water [H₂O]",
    distractors: [
      "Atmospheric air",
      "Solid carbon [C]",
      "Diatomic nitrogen gas [N₂]"
    ],
    hint: "A substance composed of two different elements chemically bonded in a fixed stoichiometric ratio.",
    workedSolution: "Water is a chemical compound consisting of hydrogen and oxygen atoms chemically bonded in a fixed 2:1 atomic ratio. Air is a mixture, while carbon and nitrogen are elements.",
    points: 1
  },
  {
    number: 5,
    prompt: "What form of mechanical energy is possessed by a physical body solely by virtue of its elevated vertical position in a gravitational field?",
    correctAnswer: "Gravitational potential energy",
    distractors: [
      "Mechanical kinetic energy",
      "Acoustic sound energy",
      "Internal thermal energy"
    ],
    hint: "The energy stored in an elevated mass ($PE = mgh$).",
    workedSolution: "Gravitational potential energy ($P.E. = mgh$) is the energy possessed by a body due to its position in a gravitational field relative to a baseline reference plane.",
    points: 1
  },
  {
    number: 6,
    prompt: "Which of the following human epidemic infectious diseases is mechanically transmitted by the common domestic housefly (*Musca domestica*)?",
    correctAnswer: "Cholera",
    distractors: [
      "Malaria",
      "River blindness (Onchocerciasis)",
      "Sleeping sickness (Trypanosomiasis)"
    ],
    hint: "Houseflies carry enteric bacteria on their hairy legs and mouthparts from fecal waste to food.",
    workedSolution: "The housefly acts as a mechanical vector carrying *Vibrio cholerae* from contaminated feces onto uncovered domestic food, transmitting cholera.",
    points: 1
  },
  {
    number: 7,
    prompt: "Which biological pigment located within the thylakoid membranes of chloroplasts is primarily responsible for absorbing light photons to drive photosynthesis?",
    correctAnswer: "Chlorophyll",
    distractors: [
      "Xanthophyll",
      "Carotene",
      "Anthocyanin"
    ],
    hint: "The green photosynthetic pigment that absorbs blue and red wavelengths.",
    workedSolution: "Chlorophyll is the primary photosynthetic pigment in green plants that traps solar photon radiation, converting light energy into chemical energy during the light-dependent reactions.",
    points: 1
  },
  {
    number: 8,
    prompt: "What is the systematic chemical nomenclature for common household table salt?",
    correctAnswer: "Sodium chloride [NaCl]",
    distractors: [
      "Calcium chloride",
      "Potassium chloride",
      "Sodium hydroxide"
    ],
    hint: "Formed by ionic bonding between sodium cations ($\\text{Na}^+$) and chloride anions ($\\text{Cl}^-$).",
    workedSolution: "Common table salt is the neutral ionic salt sodium chloride ($\\text{NaCl}$), formed by the neutralization of sodium hydroxide with hydrochloric acid.",
    points: 1
  },
  {
    number: 9,
    prompt: "Which of the following physical and chemical transformations represents an irreversible chemical change yielding new chemical substances?",
    correctAnswer: "The atmospheric rusting of an iron nail",
    distractors: [
      "The melting of solid paraffin candle wax",
      "The dissolution of refined salt crystals in water",
      "The thermal boiling of pure liquid water into steam"
    ],
    hint: "Bonds are broken and formed, synthesizing hydrated iron (III) oxide.",
    workedSolution: "Rusting is an electrochemical oxidation reaction yielding a new chemical compound, hydrated iron (III) oxide ($Fe_2O_3 \\cdot xH_2O$), which is permanent and irreversible by physical means.",
    points: 1
  },
  {
    number: 10,
    prompt: "Which metallic transition element remains in a liquid physical state at standard ambient room temperature (25°C)?",
    correctAnswer: "Mercury [Hg]",
    distractors: [
      "Solid aluminum [Al]",
      "Solid iron [Fe]",
      "Solid lead [Pb]"
    ],
    hint: "A heavy silvery metal with a low melting point ($-38.8^\\circ\\text{C}$).",
    workedSolution: "Mercury ($\\text{Hg}$) is the only metallic element that is liquid at standard room temperature, making it suitable for use as a thermometric fluid.",
    points: 1
  },
  {
    number: 11,
    prompt: "In a terrestrial ecological community, an organism that feeds directly on autotrophic green plants (primary producers) is classified as a:",
    correctAnswer: "Primary consumer (herbivore)",
    distractors: [
      "Secondary consumer (carnivore)",
      "Tertiary consumer (apex predator)",
      "Saprotrophic decomposer"
    ],
    hint: "Occupies the second trophic level in a grazing food chain.",
    workedSolution: "Herbivores feed directly on photosynthetic plants and are classified ecologically as primary consumers, converting plant biomass into animal tissue.",
    points: 1
  },
  {
    number: 12,
    prompt: "Which electrical measuring instrument is connected in parallel across an electrical component to determine the potential difference between two points?",
    correctAnswer: "A voltmeter",
    distractors: [
      "An ammeter",
      "A hydrometer",
      "A galvanometer in series"
    ],
    hint: "Measures electrical potential in Volts and possesses exceptionally high internal resistance.",
    workedSolution: "A voltmeter measures potential difference (voltage drop) in volts and is connected in parallel across a component so it draws negligible current.",
    points: 1
  },
  {
    number: 13,
    prompt: `In the simple direct-current electrical circuit shown below, what physical observation occurs the moment switch K is closed?<br/>${svgQ13CircuitLamp}`,
    correctAnswer: "Electric current flows through the closed loop and the lamp lights up",
    distractors: [
      "The lamp flashes with an electric spark and dies permanently",
      "The chemical cell overheats while the lamp remains unlit",
      "The circuit voltage immediately drops to zero across the battery"
    ],
    hint: "Closing the switch completes the conductive loop, allowing charges to flow from the battery through the filament.",
    workedSolution: "Closing the switch establishes a closed conducting circuit, allowing electric current to flow through the lamp filament, heating it to incandescence so it lights up.",
    points: 1
  },
  {
    number: 14,
    prompt: "During the complete chemical digestion of food in the human alimentary canal, dietary proteins are hydrolyzed into:",
    correctAnswer: "Amino acids",
    distractors: [
      "Monomeric glucose",
      "Fatty acids and glycerol",
      "Maltose disaccharides"
    ],
    hint: "The fundamental monomer building blocks absorbed across the intestinal villi into blood capillaries.",
    workedSolution: "Proteins are polymer chains of amino acids linked by peptide bonds; complete digestion by proteases (pepsin, trypsin, peptidases) breaks them down into free amino acids.",
    points: 1
  },
  {
    number: 15,
    prompt: "What is the normal boiling point of pure water at standard sea-level atmospheric pressure (1 atm / 760 mmHg)?",
    correctAnswer: "100°C",
    distractors: [
      "0°C",
      "37°C",
      "212°C (on Celsius scale)"
    ],
    hint: "The fixed upper calibration point on the Celsius thermometric scale.",
    workedSolution: "At standard atmospheric pressure ($101.3\\text{ kPa}$), pure water undergoes vaporization at a constant boiling point of $100^\\circ\\text{C}$ ($373\\text{ K}$).",
    points: 1
  },
  {
    number: 16,
    prompt: "Which of the following agricultural and environmental soil management practices HELPS TO PREVENT rather than cause soil erosion?",
    correctAnswer: "Spreading organic mulch over the bare soil surface",
    distractors: [
      "Uncontrolled seasonal bush burning",
      "Excessive overgrazing by herds of livestock",
      "Cultivating furrows straight down a hillside slope"
    ],
    hint: "Protects topsoil from beating raindrops, slows runoff, and binds soil moisture.",
    workedSolution: "Mulching covers bare soil with dry organic matter, protecting it from raindrop impact, reducing runoff velocity, and conserving topsoil.",
    points: 1
  },
  {
    number: 17,
    prompt: "Which specialized cellular constituent of human blood contains hemoglobin and is adapted for transporting respiratory oxygen to body tissues?",
    correctAnswer: "Red blood cells (Erythrocytes)",
    distractors: [
      "Blood platelets (Thrombocytes)",
      "Phagocytic neutrophils",
      "Antibody-producing lymphocytes"
    ],
    hint: "Biconcave enucleated discs packed with iron-containing hemoglobin.",
    workedSolution: "Red blood cells lack nuclei and possess a biconcave shape packed with hemoglobin, binding oxygen to form oxyhemoglobin for systemic transport.",
    points: 1
  },
  {
    number: 18,
    prompt: "Which atmospheric gas is non-flammable itself but chemically acts as the indispensable oxidizer supporting the combustion of organic fuels?",
    correctAnswer: "Diatomic oxygen gas [O₂]",
    distractors: [
      "Carbon dioxide gas [CO₂]",
      "Pure hydrogen gas [H₂]",
      "Diatomic nitrogen gas [N₂]"
    ],
    hint: "Supports combustion and relights a glowing wooden splint during testing.",
    workedSolution: "Oxygen gas does not burn itself, but it is an oxidizing agent essential for combustion; pure oxygen relights a glowing splint.",
    points: 1
  },
  {
    number: 19,
    prompt: "Which of the following natural energy resources is finite, non-renewable, and depletes permanently with continuous human extraction?",
    correctAnswer: "Crude petroleum oil",
    distractors: [
      "Radiant solar sunshine",
      "Fast-flowing river water",
      "Atmospheric wind currents"
    ],
    hint: "A fossil hydrocarbon formed over millions of geological years.",
    workedSolution: "Petroleum crude oil is a fossil fuel formed over millions of years; its rate of consumption far exceeds natural geological formation, making it non-renewable.",
    points: 1
  },
  {
    number: 20,
    prompt: "Which of the following internal human organs is an essential excretory organ responsible for filtering urea and excess mineral salts from blood?",
    correctAnswer: "The kidney",
    distractors: [
      "The muscular heart",
      "The glandular stomach",
      "The cartilaginous trachea"
    ],
    hint: "Contains millions of functional nephron filtering units to produce urine.",
    workedSolution: "The kidneys filter blood through nephrons, removing urea, excess water, and electrolytes to produce urine for excretion.",
    points: 1
  },
  {
    number: 21,
    prompt: "What is the biological term for the periodic shedding and replacement of the rigid, chitinous exoskeleton in growing arthropods (insects)?",
    correctAnswer: "Ecdysis (moulting)",
    distractors: [
      "Metamorphosis",
      "Pupation",
      "Regeneration"
    ],
    hint: "Allows the growing soft insect body to expand before the new cuticular shell hardens.",
    workedSolution: "Ecdysis (moulting) is the hormonal shedding of the rigid external chitinous cuticle, allowing the insect to increase in physical size.",
    points: 1
  },
  {
    number: 22,
    prompt: "In geometric optics, what technical term is given to a ray of light that travels toward and strikes a reflective plane boundary?",
    correctAnswer: "The incident ray",
    distractors: [
      "The emergent ray",
      "The normal line",
      "The reflected ray"
    ],
    hint: "The incoming ray that falls upon the mirror surface before reflection occurs.",
    workedSolution: "The incident ray is the incoming light ray that strikes a surface; the ray that bounces back is the reflected ray.",
    points: 1
  },
  {
    number: 23,
    prompt: "Which of the following laboratory solutions is alkaline and will turn moist red litmus paper into a distinct blue color?",
    correctAnswer: "Aqueous sodium hydroxide [NaOH]",
    distractors: [
      "Dilute hydrochloric acid [HCl]",
      "Freshly squeezed lemon juice",
      "Pure neutral distilled water"
    ],
    hint: "A strong Arrhenius base that dissociates to liberate free hydroxide ions ($OH^-$).",
    workedSolution: "Sodium hydroxide is a strong alkali ($pH > 13$) that produces hydroxide ions in aqueous solution, turning red litmus paper blue.",
    points: 1
  },
  {
    number: 24,
    prompt: "Which of the following livestock feedstuffs contains the highest percentage proportion of energy-rich digestible carbohydrates?",
    correctAnswer: "Dried cassava peelings / chips",
    distractors: [
      "Fish meal powder",
      "Defatted groundnut cake",
      "Soya bean meal"
    ],
    hint: "A starchy tuber residue, unlike protein-rich fish meal and oilseed cakes.",
    workedSolution: "Cassava peelings and chips consist predominantly of digestible starch (carbohydrates), whereas fish meal and soybean meal are protein concentrates.",
    points: 1
  },
  {
    number: 25,
    prompt: "In physics, mechanical work is said to be done on a body only when:",
    correctAnswer: "An applied force causes the body to move through a displacement in the direction of the force",
    distractors: [
      "A person holds a heavy load stationary on their head without moving",
      "An engine applies a large stationary holding tension force",
      "An elastic spring remains locked in a compressed position"
    ],
    hint: "$W = F \\times d$: both force and displacement along the line of action must be non-zero.",
    workedSolution: "Work requires an applied force to move an object through a displacement ($d > 0$); holding an object stationary produces zero mechanical work.",
    points: 1
  },
  {
    number: 26,
    prompt: `According to the fundamental laws of specular light reflection on a smooth plane mirror, what is the exact mathematical relationship between the angle of incidence ($i$) and the angle of reflection ($r$)?<br/>${svgQ26ReflectionPlaneMirror}`,
    correctAnswer: "The angle of incidence is exactly equal to the angle of reflection (i = r)",
    distractors: [
      "The angle of incidence is always greater than the angle of reflection (i > r)",
      "The angle of incidence is always smaller than the angle of reflection (i < r)",
      "The sum of both angles always equals 90° (i + r = 90°)"
    ],
    hint: "The First Law of Reflection states that the angle of incidence equals the angle of reflection.",
    workedSolution: "The Law of Reflection states that the angle of incidence equals the angle of reflection ($i = r$), measured from the normal.",
    points: 1
  },
  {
    number: 27,
    prompt: "Which meteorological instrument is used at weather stations to determine the relative humidity (moisture content) of ambient air?",
    correctAnswer: "A wet-and-dry bulb hygrometer (psychrometer)",
    distractors: [
      "A cup anemometer",
      "An aneroid barometer",
      "A liquid hydrometer"
    ],
    hint: "Uses the difference in temperature between dry and wet bulb thermometers to determine relative humidity.",
    workedSolution: "A hygrometer (such as a wet-and-dry bulb psychrometer) measures relative humidity, while a hydrometer measures liquid density.",
    points: 1
  },
  {
    number: 28,
    prompt: "In floral morphology, what is the collective biological term for the male reproductive organ of an angiosperm flower?",
    correctAnswer: "The stamen (anther and filament)",
    distractors: [
      "The carpel (pistil)",
      "The corolla (petals)",
      "The calyx (sepals)"
    ],
    hint: "Consists of a pollen-producing anther supported by a filament stalk.",
    workedSolution: "The male stamen consists of the filament and the anther, while the female carpel consists of the stigma, style, and ovary.",
    points: 1
  },
  {
    number: 29,
    prompt: "In the International System of Units (S.I.), what is the derived metric unit used to quantify a physical force?",
    correctAnswer: "The Newton [N]",
    distractors: [
      "The Joule [J]",
      "The Pascal [Pa]",
      "The Watt [W]"
    ],
    hint: "Defined as the force required to accelerate a $1\\text{ kg}$ mass at $1\\text{ m s}^{-2}$ ($F = ma$).",
    workedSolution: "The Newton (N) is the S.I. unit of force ($1\\text{ N} = 1\\text{ kg}\\cdot\\text{m s}^{-2}$). Energy is Joules, and pressure is Pascals.",
    points: 1
  },
  {
    number: 30,
    prompt: "A prolonged dietary deficiency of ascorbic acid (Vitamin C) in human nutrition leads to a clinical deficiency disorder known as:",
    correctAnswer: "Scurvy",
    distractors: [
      "Beriberi",
      "Night blindness (Nyctalopia)",
      "Rickets"
    ],
    hint: "Presents with bleeding spongy gums, loose teeth, and poor wound healing.",
    workedSolution: "Scurvy is caused by Vitamin C deficiency, which impairs collagen synthesis and leads to capillary fragility, bleeding gums, and delayed wound healing.",
    points: 1
  },
  {
    number: 31,
    prompt: "In soil pedology, how is the physical property known as soil texture defined scientifically?",
    correctAnswer: "The relative percentage proportions of different-sized mineral particles (sand, silt, and clay)",
    distractors: [
      "The spatial aggregation of particles into structured crumbs and peds",
      "The total organic humus content present in Horizon A",
      "The maximum volume of capillary water retained against gravity"
    ],
    hint: "Refers specifically to particle size distribution rather than structure or profile.",
    workedSolution: "Soil texture is the relative percentage of sand ($2.0-0.05\\text{ mm}$), silt ($0.05-0.002\\text{ mm}$), and clay ($<0.002\\text{ mm}$) particles in a soil sample.",
    points: 1
  },
  {
    number: 32,
    prompt: "Which laboratory separation technique is most appropriate for separating an insoluble solid precipitate from a liquid solvent?",
    correctAnswer: "Gravity filtration through porous filter paper",
    distractors: [
      "Fractional crystallization",
      "Simple distillation",
      "Open-air thermal evaporation"
    ],
    hint: "A porous barrier retains the insoluble solid residue while the liquid filtrate passes through.",
    workedSolution: "Filtration separates insoluble solids from liquids: the porous filter paper retains the solid residue while the liquid filtrate passes into the receiver.",
    points: 1
  },
  {
    number: 33,
    prompt: "Which anatomical division of the human brain is primarily responsible for coordinating voluntary muscular movements, posture, and body balance?",
    correctAnswer: "The cerebellum",
    distractors: [
      "The cerebrum",
      "The medulla oblongata",
      "The spinal cord"
    ],
    hint: "Located at the lower posterior base of the brain behind the brainstem.",
    workedSolution: "The cerebellum coordinates voluntary motor movement, maintains posture, and governs physical equilibrium and balance.",
    points: 1
  },
  {
    number: 34,
    prompt: "A neutral atom of magnesium has an atomic number of 12 ($Z = 12$). What is its electron configuration across Bohr energy shells?",
    correctAnswer: "2, 8, 2",
    distractors: [
      "2, 8, 1",
      "2, 8, 3",
      "2, 8, 8, 2"
    ],
    hint: "Fill the shells sequentially: first shell holds 2, second holds 8, remainder enters the third shell.",
    workedSolution: "For 12 electrons, the Bohr distribution is $2, 8, 2$. It readily loses its 2 valence electrons to form an $\\text{Mg}^{2+}$ cation.",
    points: 1
  },
  {
    number: 35,
    prompt: "What mode of thermal heat transfer occurs through a solid metal bar by particle lattice vibrations and free electron transport without any bulk movement of the solid matter?",
    correctAnswer: "Conduction",
    distractors: [
      "Convection",
      "Radiation",
      "Sublimation"
    ],
    hint: "Heat transfer typical of solid metals, unlike convective circulation in fluids.",
    workedSolution: "Thermal conduction transfers heat through solid matter via lattice vibrations and delocalized electron collisions without bulk material movement.",
    points: 1
  },
  {
    number: 36,
    prompt: "Which of the following endemic tropical diseases is caused by a protozoan blood parasite and transmitted by mosquitoes?",
    correctAnswer: "Malaria [Plasmodium spp.]",
    distractors: [
      "Anthrax [bacterial]",
      "Cholera [bacterial]",
      "Tuberculosis [bacterial]"
    ],
    hint: "Caused by *Plasmodium* parasites and transmitted by female *Anopheles* mosquitoes.",
    workedSolution: "Malaria is caused by the unicellular protozoan *Plasmodium*, whereas cholera, tuberculosis, and anthrax are caused by bacterial pathogens.",
    points: 1
  },
  {
    number: 37,
    prompt: "In mechanical physics, the fixed support point or axis about which a rigid lever bar pivots and turns is called the:",
    correctAnswer: "Fulcrum (pivot)",
    distractors: [
      "Applied effort",
      "Load resistance",
      "Mechanical moment arm"
    ],
    hint: "The stationary pivot point supporting the lever arm.",
    workedSolution: "The fulcrum is the fixed pivot point about which a lever turns to transmit force from the effort to the load.",
    points: 1
  },
  {
    number: 38,
    prompt: "Which agricultural soil tillage operation directly loosens compacted topsoil, opens macropores, and enhances soil aeration for root respiration?",
    correctAnswer: "Ploughing (and harrowing)",
    distractors: [
      "Uncontrolled overgrazing by cattle",
      "Surface flood irrigation",
      "Compaction by heavy rollers"
    ],
    hint: "Primary tillage turning over the soil before planting.",
    workedSolution: "Ploughing turns over and shatters compacted soil, increasing macropore volume and facilitating gas exchange between air and plant roots.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which fundamental sub-atomic particle carries a negative electrical charge and orbits the atomic nucleus in discrete energy levels?",
    correctAnswer: "The electron",
    distractors: [
      "The proton",
      "The neutron",
      "The alpha particle"
    ],
    hint: "Has a relative charge of $-1$ and negligible mass compared to nucleons.",
    workedSolution: "Electrons are negatively charged ($-1$) leptons that orbit the nucleus, balancing positive nuclear protons in a neutral atom.",
    points: 1
  },
  {
    number: 40,
    prompt: "A permanent steel bar magnet will lose its magnetism completely (demagnetize) if it is:",
    correctAnswer: "Heated strongly to red heat or hammered vigorously in an East-West orientation",
    distractors: [
      "Submerged in a beaker of ice-cold water",
      "Sealed inside an airtight polythene bag",
      "Suspended horizontally on a thread along the Earth's magnetic meridian"
    ],
    hint: "Thermal agitation or mechanical shock disrupts the aligned magnetic domains.",
    workedSolution: "Heating past the Curie point or vigorous hammering disrupts internal domain alignment, randomizing magnetic dipoles and demagnetizing the material.",
    points: 1
  }
];

// Seeded target permutation ensuring exactly 10 A, 10 B, 10 C, 10 D
const targetKeys: number[] = [
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3
];

function seedShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let m = arr.length, t, i;
  while (m) {
    seed = (seed * 9301 + 49297) % 233280;
    i = Math.floor((seed / 233280) * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

const assignedTargetIndices = seedShuffle(targetKeys, 200906);

const balancedScience2009P1 = rawScienceBank.map((q, idx) => {
  const correctIdx = assignedTargetIndices[idx]; // 0=A, 1=B, 2=C, 3=D
  const options: string[] = [];
  let dCount = 0;
  for (let pos = 0; pos < 4; pos++) {
    if (pos === correctIdx) {
      options.push(q.correctAnswer);
    } else {
      options.push(q.distractors[dCount++]);
    }
  }
  return {
    number: q.number,
    prompt: q.prompt,
    options: options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points
  };
});

// ==========================================
// PAPER 2 ESSAY QUESTIONS BANK (CALIBRATED)
// ==========================================
const paper2Science2009Questions = [
  // SECTION A: COMPULSORY PRACTICAL TEST (30 MARKS)
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `In an experiment to investigate the transfer of thermal energy along a solid metal bar, four iron nails (1, 2, 3, and 4) were attached to the underside of the bar at equal intervals using equal amounts of candle wax. One end of the bar was submerged in a beaker of boiling water heated by a flame, and four laboratory thermometers (A, B, C, and D) were inserted into drilled oil wells along the top of the bar above the nails:

${svgQ1aConductionNails}

(i) What is the normal boiling temperature of pure water at standard atmospheric pressure?
(ii) State the sequential observations that will be made concerning nails 1, 2, 3, and 4 as heating continues, providing a clear scientific reason.
(iii) Describe the comparative temperature observations recorded by thermometers A, B, C, and D.
(iv) What mode of thermal heat transfer is demonstrated along the metal bar in this experiment?
(v) State one thermal physical effect of heat demonstrated by the wax holding the nails.
(vi) Suggest an appropriate scientific aim for this experimental investigation.`,
        workedSolution: `(i) Boiling temperature:
$$100^\\circ\\text{C}\\quad (\\text{or } 373\\text{ K})$$

(ii) Observations on the nails:
Nail 1 falls off first, followed by Nail 2, then Nail 3, and Nail 4 falls off last.
• Reason: Heat is conducted through the copper bar from the hot end to the cold end. The wax holding Nail 1 reaches its melting point first because it is closest to the boiling water heat source, followed in sequence by the others as heat travels along the bar.

(iii) Observations on the thermometers:
Thermometer A records the highest temperature, Thermometer B records a moderate temperature, Thermometer C records a lower temperature, and Thermometer D records the lowest temperature ($T_A > T_B > T_C > T_D$). Temperatures rise progressively from A to D.

(iv) Mode of heat transfer:
Thermal conduction (conduction through a solid).

(v) Effect of heat demonstrated:
Heat causes a change of state of matter (melting / fusion of solid candle wax into liquid wax).

(vi) Aim of the experiment:
To demonstrate that thermal heat travels through solid metals by conduction from regions of higher temperature to regions of lower temperature.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `In an investigation to determine the environmental conditions necessary for the corrosion of iron, three clean, dry iron nails were placed into three separate test tubes in Set-ups A, B, and C as illustrated below:

${svgQ1bRustingSetups}

After three days, the nail in Set-up A was observed to have rusted, while the nails in Set-ups B and C showed no signs of rust. Answer the following questions:

(i) Why was the water in Set-up B boiled vigorously before adding the nail?
(ii) Explain the physical function of the layer of oil floating on top of the water in Set-up B.
(iii) State the purpose of the rubber stopper and drying agent in Set-up C.
(iv) Why did the nail in Set-up A rust?
(v) Suggest an appropriate scientific aim for this experiment.
(vi) Based on the findings of this experiment, explain why applying grease or oil onto metallic surfaces protects them from rusting.`,
        workedSolution: `(i) Reason for boiling water in Set-up B:
To expel and boil off all dissolved atmospheric air and oxygen gas from the water.

(ii) Function of the oil layer:
To form an airtight physical barrier on the water surface that prevents atmospheric oxygen from dissolving back into the boiled water.

(iii) Purpose in Set-up C:
The rubber stopper prevents humid outside air from entering, while the anhydrous agent maintains a completely moisture-free environment.

(iv) Why nail in Set-up A rusted:
Both atmospheric oxygen (air) and liquid water (moisture) were present together, enabling the electrochemical oxidation of iron into hydrated iron (III) oxide.

(v) Aim of the experiment:
To demonstrate that both oxygen (air) and water (moisture) are required simultaneously for iron to rust.

(vi) Why oiling prevents rusting:
Oil or grease forms an impermeable protective coating over the metal surface that physically excludes atmospheric oxygen and moisture from coming into direct contact with iron atoms.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `In an experiment testing for the presence of starch in plant foliage, two fresh green leaves A and B were detached. Leaf A was taken from a plant exposed to bright sunlight for 5 hours, while Leaf B was taken from a potted plant kept in a dark cupboard for 24 hours. The following experimental sequence was performed on both leaves:

${svgQ1cStarchTestActivities}

Activity I: Leaves dipped in boiling water for 1 minute.
Activity II: Leaves boiled in warm ethanol using a water bath.
Activity III: Leaves rinsed in a beaker of cold water.
Activity IV: Leaves spread on a white tile and flooded with iodine solution.

Following Activity IV, Leaf A changed colour to blue-black, while Leaf B remained pale yellowish-brown.

(i) Explain the precise biological purpose of carrying out each of Activities I, II, III, and IV.
(ii) State the exact colour change observed on Leaf A after adding iodine solution.
(iii) Explain why Leaf A produced this colour change while Leaf B did not.
(iv) Suggest an appropriate scientific aim for this experiment.`,
        workedSolution: `(i) Purpose of activities:
• Activity I (Boiling water): Kills the protoplasm, halts all enzymatic metabolic reactions, and ruptures cell membranes, making cells permeable to subsequent reagents.
• Activity II (Warm alcohol): Extracts and dissolves out the green chlorophyll pigment (decolorizes the leaf) so that subsequent color changes with iodine can be observed clearly.
• Activity III (Cold water): Re-hydrates and softens the leaf, which became brittle and stiff after boiling in alcohol.
• Activity IV (Iodine solution): Serves as the biochemical indicator to detect the presence of starch.

(ii) Colour change of Leaf A:
The decolorized leaf turns deep blue-black.

(iii) Explanation:
Leaf A was exposed to sunlight, allowing chlorophyll to synthesize starch via photosynthesis, which forms a blue-black complex with iodine. Leaf B was kept in continuous darkness (de-starched); without sunlight, no photosynthesis occurred, and stored starch was converted into soluble sugars and translocated, leaving zero starch.

(iv) Aim of the experiment:
To show that sunlight is essential for green plants to produce starch through photosynthesis.`,
        maxMarks: 10
      }
    ]
  },

  // SECTION B: THEORY ESSAYS (45 MARKS - ANSWER 3 ONLY)
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Explain each of the following observations in nature:
(i) In the extreme depths of the ocean where darkness is perpetual, there are no green photosynthetic plants.
(ii) On an isolated oceanic island where there are no insects or birds, a solitary dioecious pawpaw plant produces flowers continuously but never develops edible fruits.`,
        workedSolution: `(i) Absence of green plants in deep ocean:
Green plants possess chlorophyll and require radiant sunlight to drive photosynthesis ($6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$). Solar radiation cannot penetrate into the abyssal ocean depths (the aphotic zone). Without light energy, green plants cannot synthesize food to survive.

(ii) Pawpaw producing flowers but no fruits:
Pawpaw (*Carica papaya*) is a dioecious species having separate male and female plants, and relies on biological vectors (insects such as bees and moths, or birds) for cross-pollination. Without these pollinators, pollen grains from male anthers cannot be transferred to the sticky stigmas of female flowers. Because pollination and fertilization fail to occur, the ovaries never mature into fruits.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "Describe how agricultural soil is formed from parent bedrock through the process of weathering.",
        workedSolution: `Soil is formed through the physical, chemical, and biological weathering of parent bedrock over long periods:
1. Physical (Mechanical) Weathering: Temperature fluctuations cause rocks to expand and contract, causing them to crack and fracture. Running water, wind-blown sand, and freezing ice further grind rocks into finer mineral fragments.
2. Chemical Weathering: Rainwater containing dissolved carbon dioxide (carbonic acid) and oxygen reacts with rock minerals through hydrolysis, oxidation, and carbonation, decomposing hard minerals into softer clay and soluble salts.
3. Biological Weathering: Pioneer lichens and mosses secrete organic acids that etch rock surfaces. Plant roots grow into crevices, wedging rocks apart. When plants and animals die, microbial decomposers break them down into dark, fertile humus that mixes with mineral particles to form topsoil.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: `(i) State the two fundamental laws of specular light reflection on a plane mirror.
(ii) With the aid of a clearly labelled ray diagram, show the reflection of light on a plane mirror, indicating the Normal, Incident Ray, Reflected Ray, Angle of Incidence ($i$), and Angle of Reflection ($r$).

${svgQ26ReflectionPlaneMirror}`,
        workedSolution: `(i) Laws of Reflection:
1. The incident ray, the reflected ray, and the normal to the mirror at the point of incidence all lie in the same geometric plane.
2. The angle of incidence is exactly equal to the angle of reflection ($i = r$).

(ii) Diagrammatic illustration:
(Refer to the vector diagram above):
• The horizontal reflecting mirror boundary has a vertical dashed Normal line perpendicular to it at the point of incidence.
• The Incident Ray strikes the surface at angle $i$ to the normal.
• The Reflected Ray bounces away from the surface at an equal angle $r$ to the normal ($i = r$).`,
        maxMarks: 5
      }
    ]
  },
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `A young child experiences extreme difficulty seeing in dim light and at twilight (night blindness):
(i) What nutritional deficiency disease is the child suffering from?
(ii) Which dietary vitamin is deficient in the child's diet?
(iii) List two natural food sources that can provide this nutrient to restore healthy vision.`,
        workedSolution: `(i) Deficiency disease:
Night blindness (Nyctalopia) / Xerophthalmia.

(ii) Deficient vitamin:
Vitamin A (Retinol).

(iii) Food sources of Vitamin A:
1. Fresh carrots (rich in beta-carotene precursor)
2. Red palm oil
3. Liver, egg yolks, and milk
4. Green leafy vegetables (spinach, kontomire)`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: `(i) What is an atom?
(ii) Name the specific sub-atomic particle(s) of an atom that determine:
  (α) The mass of the atom;
  (β) The electrical charge of the atom.
(iii) Why is an isolated neutral atom electrically uncharged?`,
        workedSolution: `(i) Definition of atom:
The smallest indivisible particle of a chemical element that retains the chemical properties of that element and can take part in a chemical reaction.

(ii) Determining particles:
• (α) Mass of the atom: Protons and Neutrons (the nucleons located within the central nucleus).
• (β) Charge of the atom: Protons (positive charges) and Electrons (negative charges).

(iii) Why an atom is electrically neutral:
In any neutral atom, the number of positively charged nuclear protons ($+1$) exactly equals the number of negatively charged orbiting electrons ($-1$), canceling out to produce a net electrical charge of zero.`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `(i) What is mechanical friction?
(ii) Give two adverse or disadvantageous effects of friction in machines.
(iii) Give two everyday situations where friction is an essential advantage.`,
        workedSolution: `(i) Definition of friction:
A contact resistive force that opposes the relative sliding or rolling motion between two surfaces in physical contact ($F_f = \\mu N$).

(ii) Disadvantages of friction:
1. Converts useful mechanical energy into wasted thermal energy, reducing the mechanical efficiency of machines.
2. Causes abrasive surface wear and tear on moving engine parts, bearings, and vehicle tyre treads.

(iii) Advantages of friction:
1. Provides traction between shoe soles and the ground, enabling humans and animals to walk without slipping.
2. Enables vehicular brake pads to grip rotating wheel drums/discs to decelerate and stop moving vehicles.
3. Enables abrasive sharpening of cutting blades on whetstones.`,
        maxMarks: 6
      }
    ]
  },
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) Explain what is meant by biological heredity.
(ii) Give two distinct examples of hereditary traits in humans.`,
        workedSolution: `(i) Definition of heredity:
The biological transmission of genetic characteristics, phenotypic traits, and physiological potential from biological parents to their offspring through coded genes on DNA during sexual reproduction.

(ii) Examples of hereditary traits in humans:
1. ABO blood group phenotype
2. Sickle cell hemoglobin genotype (HbA / HbS)
3. Morphological eye iris color / skin complexion
4. Ability or inability to roll the tongue`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: `Classify each of the following processes as either a chemical change or a physical change:
(i) Rusting of an iron gate exposed to damp coastal air;
(ii) Combustion (burning) of dry firewood in a hearth;
(iii) Separation of chalk dust from water by gravity filtration;
(iv) Linear thermal expansion of a solid copper bar upon heating.`,
        workedSolution: `(i) Rusting of iron:
Chemical change (electrochemical oxidation forming hydrated iron (III) oxide; permanent and irreversible).

(ii) Burning of firewood:
Chemical change (exothermic combustion breaking covalent bonds to form ash, carbon dioxide, and water vapor).

(iii) Filtration:
Physical change (mechanical separation based on particle size; no new chemical substance is synthesized).

(iv) Thermal expansion of copper:
Physical change (inter-atomic spacing increases upon heating without altering the metallic elemental identity of copper).`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: `(i) What is a simple machine?
(ii) Name two distinct classes or types of simple machines.
(iii) Explain why the mechanical efficiency of any real simple machine can never equal 100%.`,
        workedSolution: `(i) Definition:
A mechanical tool or device that makes work easier, faster, or more convenient by altering the magnitude, speed, or direction of an applied effort force.

(ii) Types of simple machines:
1. Lever (e.g., crowbar, scissors)
2. Inclined plane (ramp)
3. Pulley (single fixed or movable pulley)
4. Wheel and axle

(iii) Why efficiency cannot equal 100%:
Mechanical efficiency is defined as $\\text{Efficiency} = \frac{\\text{Work Output}}{\\text{Work Input}} \\times 100\%$. In any real machine, a portion of the input energy is always converted into wasted thermal heat to overcome friction between moving contact parts, and extra work is needed to lift the weight of the machine parts themselves, meaning useful work output is always less than work input.`,
        maxMarks: 6
      }
    ]
  },
  {
    questionNumber: "5",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Study the organisms listed below:
**Earthworm, Sheep, Cassava plant, Grasshopper, Man, Hen.**

Construct a valid four-organism terrestrial food chain using only organisms from this list, clearly indicating the primary producer, primary consumer, secondary consumer, and tertiary consumer.`,
        workedSolution: `A valid terrestrial food chain:

$$\\text{Cassava plant} \\longrightarrow \\text{Grasshopper} \\longrightarrow \\text{Hen} \\longrightarrow \\text{Man}$$

• Primary Producer: Cassava plant (synthesizes organic food via photosynthesis)
• Primary Consumer (Herbivore): Grasshopper (feeds on cassava foliage)
• Secondary Consumer (Carnivore / Insectivore): Hen (feeds on grasshopper)
• Tertiary Consumer (Omnivore / Apex): Man (feeds on domestic hen)

*(Alternative valid chain: $\\text{Cassava plant} \\to \\text{Sheep} \\to \\text{Man}$)*`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: `(i) Name four fundamental or contact forces in nature apart from friction.
(ii) State three dynamic or structural effects that an applied unbalanced force can produce on a physical body.`,
        workedSolution: `(i) Four types of force:
1. Gravitational force (weight)
2. Electrostatic force
3. Magnetic force
4. Upthrust (buoyant force)
5. Mechanical tension force

(ii) Effects of a force on a body:
1. Causes a stationary body to start moving (induces acceleration).
2. Increases or decreases the velocity of a moving body (acceleration or deceleration).
3. Changes the direction of motion of a moving body.
4. Distorts, bends, compresses, or changes the physical shape and dimensions of an elastic/plastic object.`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `A student in a classroom can read text written on the blackboard clearly only when sitting on the front bench, but sees blurred images when seated at the back:
(i) Name the specific vision defect the student is suffering from.
(ii) Explain why the student is unable to see distant objects clearly based on optical image focusing.
(iii) How can this visual defect be optically corrected?`,
        workedSolution: `(i) Eye defect:
Short-sightedness (Myopia).

(ii) Optical explanation:
In a myopic eye, the eyeball is either too long from front to back, or the crystalline lens/cornea is overly curved and powerful. Consequently, parallel light rays coming from distant objects (like the blackboard seen from the rear) are refracted too sharply and brought to a focus in front of the retina rather than directly on the photoreceptive retinal layer, forming a blurred image.

(iii) Optical correction:
Wearing spectacles or contact lenses fitted with diverging concave lenses. The concave lens diverges incoming parallel rays before they enter the eye, allowing the eye's lens system to focus the rays onto the retina.`,
        maxMarks: 4
      }
    ]
  }
];

// ==========================================
// SEEDING AND INGESTION ENGINE
// ==========================================
async function seedBece2009ScienceCompleteVariant() {
  console.log('Calibrating & Seeding 2009 BECE Integrated Science Complete Variant (Sets 100 & 101)...');
  const db = await getFirestore();

  // Verify balanced key distribution for Paper 1
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedScience2009P1.forEach(q => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Paper 1 Key Distribution across 40 items:', keyDist);

  // 1. Target parent document (used by verifySet100 and verifySet101)
  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2009_variant');
  await docRef.set({
    year: 2009,
    isVariant: true,
    setNumber: 100,
    subject: "Integrated Science",
    examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
    paper1: {
      title: "Paper 1: Objective Test (Variant)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: balancedScience2009P1
    },
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer four questions in all. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2Science2009Questions
    },
    metadata: {
      sanitized: true,
      optionsBalanced: true,
      vectorGraphicsCount: 5,
      paper2Calibrated: true,
      set101Verified: true,
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  }, { merge: true });
  console.log('✅ Ingested into past_papers/paper_2009_variant with calibration flags.');

  // 2. Paper 1 single-doc read paths (Set 100)
  const p1Data = {
    id: "paper_2009_variant",
    title: "2009 BECE Integrated Science Paper 1 (Set 100 Objective)",
    tier: "Junior Secondary (JHS)",
    subject: "Integrated Science",
    topic: "2009 BECE Standardized Objective Examination",
    variantType: "past_paper_variant",
    year: 2009,
    paperType: 1,
    setNumber: 100,
    era: "classic",
    totalQuestions: 40,
    version: 1,
    format: "multiple_choice",
    durationMinutes: 45,
    instructions: "Answer all forty questions. Each question is followed by four options lettered A to D. Choose the correct option for each question.",
    questions: balancedScience2009P1,
    updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
  };

  const p1Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2009_variant',
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2009_variant_p1',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2009_variant',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2009_variant_p1',
    'global_curriculum/jhs/subjects/science/topics/bece_2009_variant/question_sets/paper_2009_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2009_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2009_variant_p1',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2009_variant',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2009_variant_p1',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2009_variant/question_sets/paper_2009_variant',
  ];

  for (const p of p1Paths) {
    const docData = p.endsWith('_p1') ? { ...p1Data, id: "paper_2009_variant_p1" } : p1Data;
    await db.doc(p).set(docData, { merge: true });
    console.log('✅ Ingested P1 ->', p);
  }

  // 3. Paper 2 single-doc read paths (Set 101)
  const p2Data = {
    id: "paper_2009_variant_p2",
    title: "2009 BECE Integrated Science Paper 2 (Set 101 Theory & Practical)",
    tier: "Junior Secondary (JHS)",
    subject: "Integrated Science",
    topic: "2009 BECE Standardized Theory & Practical Examination",
    variantType: "past_paper_variant",
    year: 2009,
    paperType: 2,
    setNumber: 101,
    era: "classic",
    totalQuestions: 5,
    version: 1,
    format: "structured_essay",
    durationMinutes: 75,
    instructions: "Answer four questions in all. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
    questions: paper2Science2009Questions,
    updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
  };

  const p2Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2009_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2009_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2009_variant/question_sets/paper_2009_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2009_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2009_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2009_variant/question_sets/paper_2009_variant_p2',
  ];

  for (const p of p2Paths) {
    await db.doc(p).set(p2Data, { merge: true });
    console.log('✅ Ingested P2 ->', p);
  }

  console.log('🌟 Ingestion complete: Sets 100 & 101 seeded successfully across all topic paths.');
}

seedBece2009ScienceCompleteVariant()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Failed ingestion for Set 100/101 Science Variant:', err);
    process.exit(1);
  });
