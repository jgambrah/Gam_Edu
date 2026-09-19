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
  } catch (cliErr) {}

  try {
    adminInstance.initializeApp({
      credential: adminInstance.credential.applicationDefault(),
    });
    return adminInstance.firestore();
  } catch (e) {
    return adminInstance.firestore();
  }
}

// 1. Vector SVG for Q1(a): Mosquito Life Cycle (Sanitized neutral labels Stage I, II, III, IV)
const svgQ1aMosquitoLifeCycle = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    <!-- Water Surface Horizon Line -->
    <line x1='30' y1='115' x2='350' y2='115' stroke='#38bdf8' stroke-width='2' stroke-dasharray='4,4'/>
    <text x='40' y='110' font-size='10' font-weight='bold' fill='#38bdf8'>Water Surface</text>
    
    <!-- Stage I: Egg Raft -->
    <g transform='translate(250, 95)'>
      <rect x='0' y='0' width='70' height='18' rx='3' fill='#94a3b8' stroke='#cbd5e1' stroke-width='1.2'/>
      <line x1='10' y1='0' x2='10' y2='18' stroke='#475569'/><line x1='20' y1='0' x2='20' y2='18' stroke='#475569'/>
      <line x1='30' y1='0' x2='30' y2='18' stroke='#475569'/><line x1='40' y1='0' x2='40' y2='18' stroke='#475569'/>
      <line x1='50' y1='0' x2='50' y2='18' stroke='#475569'/><line x1='60' y1='0' x2='60' y2='18' stroke='#475569'/>
      <text x='35' y='32' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Stage I</text>
    </g>

    <!-- Stage II: Larva -->
    <g transform='translate(195, 115)'>
      <line x1='15' y1='0' x2='15' y2='18' stroke='#f59e0b' stroke-width='3.5'/>
      <path d='M 15 18 Q 30 45 42 75' fill='none' stroke='#cbd5e1' stroke-width='4'/>
      <circle cx='44' cy='78' r='6' fill='#94a3b8'/>
      <line x1='42' y1='82' x2='48' y2='88' stroke='#94a3b8' stroke-width='1.5'/>
      <line x1='44' y1='82' x2='44' y2='90' stroke='#94a3b8' stroke-width='1.5'/>
      <text x='25' y='96' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Stage II</text>
    </g>

    <!-- Stage III: Pupa -->
    <g transform='translate(55, 120)'>
      <line x1='32' y1='-5' x2='28' y2='15' stroke='#f59e0b' stroke-width='2.5'/>
      <ellipse cx='26' cy='22' rx='14' ry='12' fill='#94a3b8' stroke='#cbd5e1' stroke-width='1.5'/>
      <path d='M 18 30 Q 10 45 22 55 Q 32 58 35 48' fill='none' stroke='#cbd5e1' stroke-width='3.5'/>
      <text x='25' y='74' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Stage III</text>
    </g>

    <!-- Stage IV: Adult -->
    <g transform='translate(130, 20)'>
      <ellipse cx='45' cy='45' rx='18' ry='7' fill='#64748b' stroke='#94a3b8' stroke-width='1.5'/>
      <circle cx='24' cy='45' r='5' fill='#94a3b8'/>
      <line x1='20' y1='45' x2='6' y2='52' stroke='#ef4444' stroke-width='1.8'/>
      <ellipse cx='46' cy='32' rx='22' ry='6' fill='#38bdf8' opacity='0.6' transform='rotate(-20 46 32)'/>
      <line x1='35' y1='50' x2='20' y2='72' stroke='#94a3b8' stroke-width='1.5'/>
      <line x1='45' y1='50' x2='42' y2='75' stroke='#94a3b8' stroke-width='1.5'/>
      <line x1='55' y1='50' x2='68' y2='72' stroke='#94a3b8' stroke-width='1.5'/>
      <text x='45' y='18' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Stage IV</text>
    </g>

    <!-- Transition arrows -->
    <path d='M 195 40 L 250 85' fill='none' stroke='#64748b' stroke-width='1.5'/>
    <path d='M 270 120 L 235 155' fill='none' stroke='#64748b' stroke-width='1.5'/>
    <path d='M 180 180 L 105 160' fill='none' stroke='#64748b' stroke-width='1.5'/>
    <path d='M 75 120 L 125 70' fill='none' stroke='#64748b' stroke-width='1.5'/>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q1(b): Three Separation Setups (Sanitized neutral labels Setup A, Setup B, Setup C)
const svgQ1bSeparationSetups = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='180' style='max-width: 500px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    <!-- Setup A -->
    <g transform='translate(15, 20)'>
      <rect x='15' y='65' width='60' height='75' rx='3' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/>
      <polygon points='18,25 72,25 48,65 42,65' fill='#334155' stroke='#cbd5e1' stroke-width='1.5'/>
      <line x1='45' y1='65' x2='45' y2='90' stroke='#cbd5e1' stroke-width='3.5'/>
      <circle cx='45' cy='105' r='2' fill='#38bdf8'/>
      <rect x='17' y='110' width='56' height='28' fill='#0284c7' opacity='0.4'/>
      <text x='45' y='160' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Setup A</text>
    </g>

    <!-- Setup B -->
    <g transform='translate(140, 20)'>
      <line x1='20' y1='80' x2='5' y2='138' stroke='#64748b' stroke-width='2'/>
      <line x1='70' y1='80' x2='85' y2='138' stroke='#64748b' stroke-width='2'/>
      <line x1='15' y1='80' x2='75' y2='80' stroke='#64748b' stroke-width='2.5'/>
      <path d='M 45 105 Q 40 90 45 80 Q 50 90 45 105 Z' fill='#f59e0b'/>
      <rect x='42' y='105' width='6' height='33' fill='#94a3b8'/>
      <path d='M 15 76 Q 45 92 75 76 Z' fill='#e2e8f0' stroke='#cbd5e1' stroke-width='1.5'/>
      <path d='M 22 78 Q 45 88 68 78 Z' fill='#f59e0b' opacity='0.6'/>
      <text x='45' y='160' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Setup B</text>
    </g>

    <!-- Setup C -->
    <g transform='translate(265, 20)'>
      <line x1='20' y1='80' x2='5' y2='138' stroke='#64748b' stroke-width='2'/>
      <line x1='70' y1='80' x2='85' y2='138' stroke='#64748b' stroke-width='2'/>
      <line x1='15' y1='80' x2='75' y2='80' stroke='#64748b' stroke-width='2.5'/>
      <path d='M 45 105 Q 40 90 45 80 Q 50 90 45 105 Z' fill='#f59e0b'/>
      <rect x='42' y='105' width='6' height='33' fill='#94a3b8'/>
      <path d='M 15 76 Q 45 90 75 76 Z' fill='#e2e8f0' stroke='#cbd5e1' stroke-width='1.5'/>
      <polygon points='22,74 68,74 48,35 42,35' fill='#38bdf8' opacity='0.25' stroke='#38bdf8' stroke-width='1.5'/>
      <rect x='43' y='12' width='4' height='23' fill='#38bdf8' opacity='0.4'/>
      <circle cx='45' cy='12' r='3.5' fill='#cbd5e1'/>
      <text x='45' y='160' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Setup C</text>
    </g>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 3. Vector SVG for Q1(c): Laboratory Instruments (Sanitized neutral labels I, II, III, IV, V)
const svgQ1cLabInstruments = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 190' width='100%' height='175' style='max-width: 500px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    <!-- Instrument I -->
    <g transform='translate(20, 30)'>
      <circle cx='25' cy='30' r='18' fill='#f59e0b' stroke='#d97706' stroke-width='2'/>
      <path d='M 35 40 Q 55 45 70 35' fill='none' stroke='#fde68a' stroke-width='4'/>
      <text x='25' y='65' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>I</text>
    </g>
    <!-- Instrument II -->
    <g transform='translate(105, 20)'>
      <circle cx='28' cy='35' r='22' fill='#1e293b' stroke='#64748b' stroke-width='2'/>
      <line x1='28' y1='35' x2='28' y2='20' stroke='#38bdf8' stroke-width='2'/>
      <line x1='28' y1='35' x2='40' y2='35' stroke='#ef4444' stroke-width='1.5'/>
      <rect x='25' y='8' width='6' height='5' fill='#cbd5e1'/>
      <text x='28' y='75' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>II</text>
    </g>
    <!-- Instrument III -->
    <g transform='translate(180, 15)'>
      <rect x='10' y='10' width='6' height='75' rx='3' fill='#e2e8f0' stroke='#64748b'/>
      <circle cx='13' cy='82' r='6' fill='#ef4444'/>
      <line x1='13' y1='40' x2='13' y2='82' stroke='#ef4444' stroke-width='2'/>
      <text x='13' y='105' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>III</text>
    </g>
    <!-- Instrument IV -->
    <g transform='translate(230, 25)'>
      <path d='M 10 15 L 45 15 L 35 25 L 20 25 Z' fill='#94a3b8'/>
      <rect x='12' y='25' width='32' height='35' rx='3' fill='#1e293b' stroke='#64748b'/>
      <circle cx='28' cy='42' r='9' fill='#0f172a' stroke='#38bdf8'/>
      <line x1='28' y1='42' x2='33' y2='37' stroke='#ef4444'/>
      <text x='28' y='75' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>IV</text>
    </g>
    <!-- Instrument V -->
    <g transform='translate(305, 15)'>
      <rect x='15' y='10' width='35' height='140' rx='2' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Graduation ticks (0, 50, 100, 150, 200, 250) -->
      <line x1='40' y1='30' x2='50' y2='30' stroke='#94a3b8'/><text x='38' y='33' font-size='7' fill='#cbd5e1' text-anchor='end'>250</text>
      <line x1='40' y1='54' x2='50' y2='54' stroke='#94a3b8'/><text x='38' y='57' font-size='7' fill='#cbd5e1' text-anchor='end'>200</text>
      <line x1='40' y1='78' x2='50' y2='78' stroke='#94a3b8'/><text x='38' y='81' font-size='7' fill='#cbd5e1' text-anchor='end'>150</text>
      <line x1='40' y1='102' x2='50' y2='102' stroke='#94a3b8'/><text x='38' y='105' font-size='7' fill='#cbd5e1' text-anchor='end'>100</text>
      <line x1='40' y1='126' x2='50' y2='126' stroke='#94a3b8'/><text x='38' y='129' font-size='7' fill='#cbd5e1' text-anchor='end'>50</text>
      <!-- Liquid column filled to exactly 160 cm3 -->
      <rect x='16' y='73' width='33' height='75' fill='#38bdf8' opacity='0.6'/>
      <path d='M 16 73 Q 32 75 49 73' fill='none' stroke='#0284c7' stroke-width='2'/>
      <line x1='50' y1='73' x2='62' y2='73' stroke='#ef4444' stroke-width='1.5' stroke-dasharray='2,2'/>
      <text x='32' y='165' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>V</text>
    </g>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 4. Vector SVG for Q1(d): Avian Digestive System (Sanitized neutral labels I, II, III, IV)
const svgQ1dAvianDigestive = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 220' width='100%' height='200' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    <!-- Part I -->
    <path d='M 150 15 L 150 50' stroke='#cbd5e1' stroke-width='5'/>
    <line x1='155' y1='30' x2='230' y2='30' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='235' y='34' font-size='12' font-weight='bold' fill='#cbd5e1'>I</text>
    
    <!-- Part IV -->
    <path d='M 148 50 C 115 50 110 80 148 85 Z' fill='#fed7aa' stroke='#ea580c' stroke-width='2'/>
    <line x1='115' y1='68' x2='60' y2='68' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='55' y='72' font-size='12' font-weight='bold' fill='#fb923c' text-anchor='end'>IV</text>
    
    <!-- Proventriculus -->
    <path d='M 150 85 L 150 105' stroke='#cbd5e1' stroke-width='6'/>
    
    <!-- Part III -->
    <path d='M 130 105 C 105 105 110 135 145 130 Z' fill='#881337' stroke='#e11d48' stroke-width='1.8'/>
    <line x1='110' y1='120' x2='60' y2='120' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='55' y='124' font-size='12' font-weight='bold' fill='#f43f5e' text-anchor='end'>III</text>
    
    <!-- Part II -->
    <ellipse cx='195' cy='125' rx='25' ry='32' fill='#f87171' stroke='#b91c1c' stroke-width='2.5'/>
    <line x1='220' y1='125' x2='270' y2='125' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='275' y='129' font-size='12' font-weight='bold' fill='#f87171'>II</text>
    
    <!-- Intestinal Loop & Cloaca -->
    <path d='M 180 155 Q 150 185 180 205' fill='none' stroke='#cbd5e1' stroke-width='4'/>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

const paper2Science2014Questions = [
  // ==========================================
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `The diagram below illustrates the complete developmental metamorphosis of a mosquito in an aquatic breeding habitat. Study the diagram carefully and answer the questions that follow:

${svgQ1aMosquitoLifeCycle}

(i) Name each of the developmental stages labelled I, II, III, and IV.

(ii) Explain how stage II obtains atmospheric oxygen while submerged under the water surface.

(iii) State two physical or chemical methods used to control stage III in aquatic habitats.

(iv) State two environmental or physical methods used to control stage IV in human habitations.`,
        workedSolution: `(i) Names of developmental stages:
• Stage I: Egg raft (or eggs)
• Stage II: Larva (wiggler)
• Stage III: Pupa (tumbler)
• Stage IV: Adult (imago)

(ii) Respiratory mechanism of Stage II (Larva):
The larva suspends itself upside down from the water surface tension film and protrudes its specialized respiratory siphon tube into atmospheric air to intake oxygen.

(iii) Control methods for Stage III (Pupa):
• Spreading a thin layer of oil or kerosene over stagnant water surfaces to break surface tension and occlude respiratory trumpets.
• Applying biological control agents, such as stocking ponds with larvivorous fish (e.g., *Gambusia* or tilapia fingerlings).
• Adding environmentally safe chemical larvicides or insect growth regulators.

(iv) Control methods for Stage IV (Adult mosquito):
• Clearing domestic mosquito breeding grounds by draining choked gutters and disposing of discarded tins and car tyres.
• Sleeping under insecticide-treated bed nets (ITNs) and installing wire mesh screens on windows and doors.
• Spraying aerosol knock-down insecticides or lighting mosquito coils in living rooms.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `The diagram below illustrates three standard laboratory setups (A, B, and C) utilized in the separation of mixtures. Study the diagram carefully and answer the questions that follow:

${svgQ1bSeparationSetups}

(i) Name the specific physical separation method represented by each of the setups labelled A, B, and C.

(ii) Identify the parts of the apparatus labelled:
  (α) The porous cone in Setup A;
  (β) The shallow ceramic container in Setup B;
  (γ) The inverted glass apparatus in Setup C.

(iii) State which of the setups (A, B, or C) is most appropriate for:
  (α) Obtaining clear potable water from a muddy stream suspension;
  (β) Recovering dry sodium chloride crystals from seawater.

(iv) Explain why Setup C requires an inverted funnel with a plugged stem during the separation of an ammonium chloride and sand mixture.`,
        workedSolution: `(i) Separation methods:
• Setup A: Filtration
• Setup B: Evaporation (to dryness)
• Setup C: Sublimation

(ii) Apparatus identification:
• (α) Porous cone in Setup A: Filter paper (supported in a filter funnel).
• (β) Ceramic container in Setup B: Evaporating dish (porcelain basin).
• (γ) Inverted apparatus in Setup C: Inverted glass funnel (with cotton wool plug at the stem).

(iii) Appropriate setup selection:
• (α) Clear water from muddy suspension: Setup A (Filtration).
• (β) Dry sodium chloride crystals from seawater: Setup B (Evaporation).

(iv) Explanation for Setup C:
Ammonium chloride sublimes readily upon heating, transforming directly from a solid into vapour without passing through a liquid phase. The inverted funnel provides a cool condensing surface where the pure vapour deposits back into solid ammonium chloride crystals (sublimate), while the cotton plug prevents the escaping vapour from dissipating into the atmosphere.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `The diagram below displays standard measuring instruments (I, II, III, IV, and V) routinely used in physical science laboratories. Study the diagram carefully and answer the questions that follow:

${svgQ1cLabInstruments}

(i) Name each of the measuring instruments labelled I, II, III, IV, and V.

(ii) State the primary physical quantity measured by each of the instruments labelled I, II, III, and IV, indicating their respective S.I. units.

(iii) Carefully read and record the volume of the liquid contained in the graduated measuring cylinder labelled V, stating the correct metric unit.`,
        workedSolution: `(i) Name of each measuring instrument:
• I: Measuring tape (or tape measure)
• II: Stop clock (or stopwatch)
• III: Laboratory thermometer (mercury-in-glass or alcohol thermometer)
• IV: Top-pan balance (or weighing balance)
• V: Graduated measuring cylinder

(ii) Physical quantities and S.I. units:
• Instrument I: Length or distance (S.I. unit: Metre, $\\text{m}$)
• Instrument II: Time interval (S.I. unit: Second, $\\text{s}$)
• Instrument III: Temperature (S.I. unit: Kelvin, $\\text{K}$; standard Celsius, $^\\circ\\text{C}$)
• Instrument IV: Mass of matter (S.I. unit: Kilogram, $\\text{kg}$)

(iii) Reading of liquid volume in Instrument V:
The bottom of the concave meniscus rests exactly at $160\\text{ cm}^3$ (or $160\\text{ mL}$).
Reading: $$160\\text{ cm}^3\\quad (\\text{or } 160\\text{ mL})$$.`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `The diagram below illustrates the anatomical structure of the digestive tract of a domestic farm bird (poultry). Study the diagram carefully and answer the questions that follow:

${svgQ1dAvianDigestive}

(i) Name each of the anatomical organs labelled I, II, III, and IV.

(ii) State one vital digestive function performed by each of the organs labelled II and IV.

(iii) Name two domestic farm animals that possess this specialized digestive system.

(iv) Name two contagious viral or parasitic diseases that infect this class of livestock.`,
        workedSolution: `(i) Name of anatomical organs:
• I: Oesophagus (gullet)
• II: Gizzard (ventriculus)
• III: Liver
• IV: Crop

(ii) Digestive functions:
• Part II (Gizzard): Acts as a heavy muscular grinder, using swallowed small stones and grit to mechanically crush and pulverize hard grains and seeds.
• Part IV (Crop): Temporarily stores swallowed feed and moistens/softens whole grains with secretions before onward passage.

(iii) Farm animals possessing this digestive system:
Domestic fowl (chicken), turkey, duck, guinea fowl, goose.

(iv) Livestock diseases:
• Newcastle disease (viral)
• Coccidiosis (protozoan)
• Fowl pox (viral)
• Fowl typhoid / Pullorum disease (bacterial)`,
        maxMarks: 10
      }
    ]
  },

  // ==========================================
  // SECTION B: THEORY & ESSAY QUESTIONS (ANSWER 4 ONLY)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) Name the two chemical elements that react together to form pure water.\n\n(ii) Write a balanced chemical equation for the synthesis of water from its constituent gaseous elements.",
        workedSolution: `(i) Elements:
Hydrogen and Oxygen.

(ii) Balanced chemical equation:
$$2\\text{H}_{2(g)} + \\text{O}_{2(g)} \\to 2\\text{H}_2\\text{O}_{(l)}$$
*(Or $\\text{H}_{2(g)} + \\frac{1}{2}\\text{O}_{2(g)} \\to \\text{H}_2\\text{O}_{(l)}$)*.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "State two sustainable conservation practices required to maintain biological equilibrium in an ecosystem.",
        workedSolution: `1. Enforcing strict environmental bans on uncontrolled deforestation, illegal mining (galamsey), and wildfire bush burning.
2. Promoting afforestation and reforestation to sequester carbon dioxide and provide wildlife habitats.
3. Regulating commercial fishing and banning the hunting/poaching of endangered wildlife species during breeding seasons.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) What is a fertile soil?\n\n(ii) State two natural or human-induced factors that cause the loss of soil fertility.",
        workedSolution: `(i) Fertile soil:
Soil that possesses the physical, chemical, and biological capacity to supply all essential macro and micro plant nutrients in the correct proportions and optimum moisture/aeration needed to support healthy plant growth.

(ii) Factors causing loss of soil fertility:
1. Soil erosion: Surface rainwater runoff sweeps away nutrient-rich topsoil and organic humus.
2. Leaching: Excessive water percolation washes dissolved nitrates and minerals down into deep subsoil horizons.
3. Continuous mono-cropping: Cultivating the same crop species repeatedly without fallowing or manuring exhausts specific nutrients.
4. Bush burning: Destroys soil organic matter and incinerates beneficial soil decomposing bacteria.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "Classify the following everyday materials into magnetic substances and non-magnetic substances:\nSteel razor blade, dry wooden ruler, rubber band, glass tumbler.",
        workedSolution: `Classification:
• Magnetic substance: Steel razor blade (contains ferromagnetic iron).
• Non-magnetic substances: Dry wooden ruler, rubber band, glass tumbler.`,
        maxMarks: 3
      }
    ]
  },
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) What is seed germination?\n\n(ii) State two environmental conditions essential for the germination of viable seeds.",
        workedSolution: `(i) Definition of germination:
The physiological process by which a viable dormant seed awakens, absorbs moisture, and begins metabolic growth to develop into a seedling.

(ii) Essential conditions:
1. Presence of water (moisture) to soften the seed coat and activate metabolic enzymes.
2. Presence of oxygen (air) to drive aerobic respiration for cellular energy.
3. Optimum temperature (warmth) suitable for enzymatic activity.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "State four conventional management methods used by livestock farmers to identify individual farm animals in a herd.",
        workedSolution: `1. Ear tagging (affixing numbered plastic or metal tags to ears).
2. Ear notching (cutting distinct geometric V-notches along ear margins).
3. Tattooing (imprinting indelible permanent ink numbers inside the ear or flank).
4. Branding (hot-iron or freeze-branding numbering on the hide).`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "Using the scientific principles of force, pressure, and surface area, explain why it is considerably easier to cut a tuber of yam with a sharp knife than with a blunt knife.",
        workedSolution: `Pressure is defined as force applied per unit area ($P = \\frac{F}{A}$).
A sharp knife possesses an extremely fine edge with a tiny surface area ($A$), so even a moderate downward force ($F$) produces a high cutting pressure that easily shears through the yam fibers. Conversely, a blunt knife has a broad, worn cutting edge with a larger surface area, which dissipates the force and generates low pressure, requiring substantially more muscular effort to penetrate the yam.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "State three physical differences between metals and non-metals.",
        workedSolution: `Differences:
1. Electrical and thermal conductivity: Metals are good conductors of heat and electricity due to free delocalized electrons, whereas non-metals are poor conductors (insulators), with the exception of graphite.
2. Malleability and ductility: Metals can be hammered into thin sheets (malleable) and drawn into wires (ductile), whereas solid non-metals are brittle and fracture under impact.
3. Lustre and appearance: Metals exhibit a lustrous, shiny metallic sheen when polished, whereas non-metals have a dull surface.
4. Density and melting points: Metals generally have high melting points and high densities, while non-metals typically have low melting points and low densities.`,
        maxMarks: 3
      }
    ]
  },
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) What is debeaking in poultry flock management?\n\n(ii) State two economic and welfare reasons why debeaking is practiced in commercial egg production.",
        workedSolution: `(i) Definition of debeaking:
The surgical or thermal trimming of about one-third to one-half of the upper beak (and tip of the lower beak) of a poultry bird using an electrically heated cauterizing blade.

(ii) Reasons for debeaking:
1. To prevent cannibalism, feather pecking, and vent pecking among densely stocked birds.
2. To prevent the habit of egg-eating, which causes economic loss.
3. To reduce feed wastage from birds flicking feed out of troughs.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "(i) A dry, polished steel sewing needle placed horizontally on the calm surface of water floats despite having a density seven times greater than water. Name the force responsible for supporting the needle.\n\n(ii) Name two substances that, when added to the water, will cause the needle to sink immediately.",
        workedSolution: `(i) Force:
Surface tension (cohesive forces among surface water molecules forming an elastic skin-like layer).

(ii) Substances that reduce surface tension:
Soap solution, synthetic liquid detergent, kerosene, alcohol, or oil (surfactants that weaken cohesive hydrogen bonds among water molecules).`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) Explain why pure gold is preferred to metallic iron for the fabrication of fine jewellery.\n\n(ii) State two technical methods used to prevent the rusting of iron structures exposed to the atmosphere.",
        workedSolution: `(i) Why gold is preferred:
Gold is chemically unreactive and resides at the bottom of the electrochemical reactivity series. It does not react with atmospheric oxygen, moisture, or sulfur compounds, meaning it never tarnishes or corrodes, preserving its shiny golden luster. Iron oxidizes rapidly into flaky red-brown rust ($Fe_2O_3 \\cdot xH_2O$) in damp air.

(ii) Methods to prevent rusting:
1. Painting or applying grease/oil to provide an impermeable barrier against air and water.
2. Galvanizing: Coating the iron with a protective layer of zinc.
3. Electroplating: Coating with an unreactive metal such as chromium or tin.
4. Alloying: Melting iron with carbon, chromium, and nickel to form corrosion-resistant stainless steel.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "Name two atmospheric elements of climate and state the scientific instrument used to measure each element.",
        workedSolution: `Elements and Instruments:
• Atmospheric Temperature: Measured using a Thermometer (maximum-minimum thermometer).
• Rainfall / Precipitation: Measured using a Rain gauge.
• Atmospheric Pressure: Measured using a Barometer.
• Relative Humidity: Measured using a Hygrometer.
• Wind Speed: Measured using an Anemometer.
• Wind Direction: Measured using a Wind vane.`,
        maxMarks: 3
      }
    ]
  },
  {
    questionNumber: "5",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) Define the term refraction of light.\n\n(ii) Describe the path taken by a light ray as it travels obliquely from air into a rectangular glass block.",
        workedSolution: `(i) Definition:
Refraction is the bending or change in direction of a light ray as it passes obliquely from one transparent medium into another of differing optical density, caused by a change in the wave velocity of light.

(ii) Path of light entering glass:
Because glass is optically denser than air, the light ray slows down upon crossing the boundary and bends toward the normal line ($i > r$). Upon exiting the opposite parallel glass face back into air, the ray speeds up and bends away from the normal, emerging parallel to its original incident trajectory with a slight lateral displacement.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "Explain why a mixture of iron filings and powdered sulfur can be separated easily with a bar magnet, but cannot be separated after the mixture has been heated strongly to redness.",
        workedSolution: `Before heating, the iron filings and sulfur powder form a physical mixture: each substance retains its individual chemical properties, allowing a bar magnet to attract and remove the ferromagnetic iron filings. 
Upon strong heating to redness, an exothermic chemical reaction occurs that forms a new compound, iron (II) sulfide:
$$\\text{Fe}_{(s)} + \\text{S}_{(s)} \\xrightarrow{\\Delta} \\text{FeS}_{(s)}$$
The original properties of iron are lost because the atoms are chemically bonded; iron (II) sulfide is non-ferromagnetic and cannot be separated by physical methods.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) Name two digestive enzymes secreted into the human alimentary canal.\n\n(ii) For each named enzyme in (c)(i), state the specific anatomical organ where it is produced and its substrate food substance.",
        workedSolution: `Enzymes, Organs, and Substrates:
• Salivary amylase (Ptyalin): Produced by salivary glands in the mouth; acts on cooked starch, hydrolyzing it into maltose.
• Pepsin: Secreted by gastric glands in the stomach wall; acts on complex proteins, breaking them down into peptides.
• Trypsin: Produced by the pancreas and secreted into the duodenum; hydrolyzes peptides into smaller peptides and amino acids.
• Pancreatic Lipase: Secreted by the pancreas into the small intestine; hydrolyzes emulsified fats and oils into fatty acids and glycerol.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "List three agronomic methods used by crop farmers to apply chemical fertilizers to cultivated fields.",
        workedSolution: `1. Broadcasting: Uniformly scattering granular fertilizer over the entire field surface by hand or mechanical spreader.
2. Side-dressing / Band placement: Placing fertilizer in shallow furrows or bands along the rows of growing plants, slightly away from plant stems.
3. Ring placement: Applying fertilizer in a circular trench dug around the base of individual trees or crops, matching the canopy drip-line.
4. Foliar application: Spraying soluble liquid fertilizer directly onto the leaves of crops.`,
        maxMarks: 3
      }
    ]
  },
  {
    questionNumber: "6",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Consider the following list of chemical substances:\nCarbon dioxide, Gold, Bronze, Iron, Oxygen, Ink.\nFrom the list, select the substance that:\n\n(i) Strongly supports the combustion of fuels;\n\n(ii) Is an unreactive precious metal used for making jewellery;\n\n(iii) Is a copper-tin alloy traditionally cast into statues and commemorative medals.",
        workedSolution: `(i) Supports combustion: Oxygen.
(ii) Used for jewellery: Gold.
(iii) Alloy used for statues and medals: Bronze (alloy of copper and tin).`,
        maxMarks: 3
      },
      {
        subId: "(b)",
        prompt: "(i) Name two chronic cardiovascular diseases associated with the human circulatory system.\n\n(ii) Outline one clinical or lifestyle practice that helps prevent each of the diseases named in (b)(i).",
        workedSolution: `(i) Diseases:
• Hypertension (High blood pressure)
• Arteriosclerosis / Coronary artery disease

(ii) Preventive lifestyle practices:
• For Hypertension: Engage in regular aerobic cardiovascular exercise, maintain low dietary sodium (salt) intake, manage stress, and avoid tobacco smoking.
• For Arteriosclerosis: Reduce the consumption of saturated animal fats and trans-cholesterol, maintain a healthy body weight, and consume dietary fiber from vegetables.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "Differentiate between major plant nutrients (macro-nutrients) and minor plant nutrients (micro-nutrients), citing two examples of each.",
        workedSolution: `Differences and Examples:
• Major nutrients (Macro-nutrients): Mineral elements required by crop plants in relatively large amounts for basic tissue building and physiological growth.
Examples: Nitrogen (N), Phosphorus (P), Potassium (K), Calcium (Ca).
• Minor nutrients (Micro-nutrients / Trace elements): Essential mineral elements required in minute, trace quantities, primarily acting as enzyme activators and cofactors.
Examples: Iron (Fe), Zinc (Zn), Boron (B), Copper (Cu), Manganese (Mn).`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "(i) State two physical properties of an ideal thermometric liquid used in clinical and laboratory thermometers.\n\n(ii) Name two thermometric liquids commonly employed in glass thermometers.",
        workedSolution: `(i) Physical properties of an ideal thermometric liquid:
1. It must expand uniformly and regularly with equal increments of temperature.
2. It must remain in the liquid state over a wide temperature range (having a high boiling point and low freezing point).
3. It must not cling to or wet the inner glass capillary wall, ensuring accurate meniscus readings.
4. It should be easily visible (opaque or brightly colored) and possess a low specific heat capacity for rapid thermal response.

(ii) Examples:
Mercury and Alcohol (ethanol tinted red).`,
        maxMarks: 4
      }
    ]
  }
];

async function seedBece2014SciencePaper2Variant() {
  console.log('Seeding 2014 BECE Integrated Science Paper 2 Variant (Set 75) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2014_variant');

  await docRef.set({
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer four questions in all. Answer Question 1 from Section A (compulsory), and any three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2Science2014Questions
    },
    'metadata.paper2Calibrated': true,
    'metadata.set75Verified': true,
    'metadata.updatedAt': new Date()
  }, { merge: true });

  console.log('✅ Successfully seeded Set 75 (2014 Science Paper 2 Variant) into past_papers/paper_2014_variant.');
}

seedBece2014SciencePaper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 75 Science Paper 2:', err);
    process.exit(1);
  });
