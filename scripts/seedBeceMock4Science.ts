process.env.GCLOUD_PROJECT = 'gamedu-69888475-f5783';
process.env.GOOGLE_CLOUD_PROJECT = 'gamedu-69888475-f5783';
import * as admin from 'firebase-admin';
import { createRequire } from 'module';

const req = typeof require !== 'undefined' ? require : createRequire(import.meta.url);

async function getDb() {
  const fbAdmin = (admin as any).default || admin;
  try {
    const { OAuth2Client } = req('google-auth-library');
    const { Firestore } = req('@google-cloud/firestore');
    const auth = req('C:\\Users\\DELL\\AppData\\Local\\npm-cache\\_npx\\7750544ccf494d8b\\node_modules\\firebase-tools\\lib\\auth');
    const account = auth.getGlobalDefaultAccount();
    const tokenObj = await auth.getAccessToken(account.tokens.refresh_token, []);
    const oauthClient = new OAuth2Client();
    oauthClient.setCredentials({ access_token: tokenObj.access_token, refresh_token: account.tokens.refresh_token });
    return new Firestore({ projectId: 'gamedu-69888475-f5783', authClient: oauthClient });
  } catch (e) {
    if (!fbAdmin.apps?.length) {
      fbAdmin.initializeApp({
        credential: fbAdmin.credential.applicationDefault(),
      });
    }
    return fbAdmin.firestore();
  }
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
// PAPER 2 INLINE VECTOR SVGs (NEUTRAL LABELS)
// ==========================================

// SVG for Q1(a): Dispersion of White Light through a Triangular Glass Prism
const svgQ1aLightDispersion = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Narrow White Light Beam Ray from Left -->
    <line x1='30' y1='120' x2='110' y2='100' stroke='#ffffff' stroke-width='2.5'/>
    <polygon points='70,107 80,107 75,114' fill='#ffffff'/>
    <text x='65' y='90' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>Ray I</text>

    <!-- Triangular Glass Prism P -->
    <polygon points='145,35 95,150 195,150' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='2'/>
    <!-- Neutral Label P -->
    <circle cx='145' cy='110' r='9' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
    <text x='145' y='113' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>P</text>

    <!-- Refracted & Dispersed Rays Inside Prism -->
    <line x1='110' y1='100' x2='160' y2='90' stroke='#ef4444' stroke-width='1.5'/>
    <line x1='110' y1='100' x2='163' y2='105' stroke='#8b5cf6' stroke-width='1.5'/>

    <!-- Emerging Dispersed Spectrum Rays -->
    <!-- Red Ray II (Least deviated) -->
    <line x1='160' y1='90' x2='310' y2='65' stroke='#ef4444' stroke-width='2'/>
    <circle cx='280' cy='60' r='8' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/>
    <text x='280' y='63' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>II</text>

    <!-- Orange Ray -->
    <line x1='161' y1='93' x2='310' y2='78' stroke='#f97316' stroke-width='1.2'/>
    <!-- Yellow Ray -->
    <line x1='161' y1='96' x2='310' y2='90' stroke='#eab308' stroke-width='1.2'/>
    <!-- Green Ray -->
    <line x1='162' y1='99' x2='310' y2='102' stroke='#22c55e' stroke-width='1.2'/>
    <!-- Blue Ray -->
    <line x1='162' y1='102' x2='310' y2='114' stroke='#06b6d4' stroke-width='1.2'/>
    <!-- Indigo Ray -->
    <line x1='163' y1='104' x2='310' y2='126' stroke='#3b82f6' stroke-width='1.2'/>

    <!-- Violet Ray III (Most deviated) -->
    <line x1='163' y1='105' x2='310' y2='138' stroke='#8b5cf6' stroke-width='2'/>
    <circle cx='280' cy='145' r='8' fill='#1e293b' stroke='#8b5cf6' stroke-width='1.5'/>
    <text x='280' y='148' font-size='8' font-weight='bold' fill='#8b5cf6' text-anchor='middle'>III</text>

    <!-- White Display Screen IV -->
    <line x1='310' y1='40' x2='310' y2='165' stroke='#cbd5e1' stroke-width='4'/>
    <circle cx='335' cy='105' r='8' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/>
    <text x='335' y='108' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>IV</text>

    <text x='190' y='200' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>DISPERSION OF WHITE LIGHT: IDENTIFY RAY I, PRISM P, RAYS II & III, AND SCREEN IV</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(b): Simple Laboratory Distillation Setup (Neutralized Caption)
const svgQ1bSimpleDistillation = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Distillation Flask I with Thermometer on Left -->
    <g transform='translate(40, 45)'>
      <!-- Bunsen Burner Flame & Wire Gauze -->
      <line x1='15' y1='125' x2='65' y2='125' stroke='#94a3b8' stroke-width='2'/>
      <path d='M 40 150 Q 35 135 40 130 Q 45 135 40 150 Z' fill='#f59e0b'/>
      <!-- Round-bottom Flask I -->
      <circle cx='40' cy='90' r='25' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.8'/>
      <path d='M 22 98 A 24 24 0 0 0 58 98 Z' fill='#38bdf8' opacity='0.5'/>
      <rect x='36' y='40' width='8' height='30' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Thermometer T -->
      <line x1='40' y1='15' x2='40' y2='65' stroke='#ef4444' stroke-width='2'/>
      <circle cx='40' cy='67' r='2' fill='#ef4444'/>
      <circle cx='40' cy='5' r='7' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/>
      <text x='40' y='8' font-size='7' font-weight='bold' fill='#ef4444' text-anchor='middle'>T</text>
      <!-- Neutral Label I -->
      <circle cx='10' cy='75' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='10' y='78' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text>
      <!-- Side Delivery Arm -->
      <line x1='44' y1='55' x2='75' y2='70' stroke='#38bdf8' stroke-width='2.5'/>
    </g>

    <!-- Liebig Condenser II in Center -->
    <g transform='translate(115, 80)'>
      <!-- Inner Delivery Tube -->
      <line x1='0' y1='35' x2='150' y2='75' stroke='#38bdf8' stroke-width='2'/>
      <!-- Outer Cooling Jacket -->
      <polygon points='25,25 125,52 122,85 22,58' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='1.8'/>
      <!-- Water Inlet at bottom right (W_in) -->
      <line x1='110' y1='80' x2='110' y2='105' stroke='#10b981' stroke-width='2.5'/>
      <polygon points='107,90 110,80 113,90' fill='#10b981'/>
      <circle cx='110' cy='118' r='8' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='110' y='121' font-size='7' font-weight='bold' fill='#10b981' text-anchor='middle'>W₁</text>

      <!-- Water Outlet at top left (W_out) -->
      <line x1='35' y1='30' x2='35' y2='5' stroke='#38bdf8' stroke-width='2.5'/>
      <polygon points='32,15 35,5 38,15' fill='#38bdf8'/>
      <circle cx='35' cy='-8' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='35' y='-5' font-size='7' font-weight='bold' fill='#38bdf8' text-anchor='middle'>W₂</text>

      <!-- Neutral Label II -->
      <circle cx='70' cy='35' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='70' y='38' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>II</text>
    </g>

    <!-- Receiving Flask III with Pure Distillate on Right -->
    <g transform='translate(275, 140)'>
      <polygon points='12,20 28,20 38,55 2,55' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/>
      <rect x='4' y='42' width='32' height='12' fill='#38bdf8' opacity='0.6'/>
      <!-- Neutral Label III -->
      <circle cx='20' cy='72' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='20' y='75' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text>
    </g>

    <text x='190' y='215' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LABORATORY DISTILLATION APPARATUS: IDENTIFY COMPONENTS I, II, III, AND PORTS W1 & W2</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(c): Plant Cell Osmosis & Plasmolysis (Neutralized Labels)
const svgQ1cCellPlasmolysis = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Cell A (Left) -->
    <g transform='translate(35, 25)'>
      <text x='65' y='12' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cell A</text>
      <!-- Outer Cellulose Cell Wall -->
      <rect x='10' y='25' width='110' height='90' rx='10' fill='none' stroke='#10b981' stroke-width='3'/>
      <!-- Turgid Cytoplasm pressed against wall -->
      <rect x='14' y='29' width='102' height='82' rx='8' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Large Central Vacuole -->
      <ellipse cx='65' cy='70' rx='40' ry='28' fill='#38bdf8' opacity='0.4' stroke='#0284c7' stroke-width='1.5'/>
      <!-- Nucleus -->
      <circle cx='35' cy='50' r='8' fill='#ef4444' opacity='0.8'/>
      <!-- Neutral Label A -->
      <circle cx='65' cy='140' r='9' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='65' y='143' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>A</text>
    </g>

    <!-- Cell B (Right) -->
    <g transform='translate(210, 25)'>
      <text x='65' y='12' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Cell B</text>
      <!-- Outer Rigid Cell Wall retains shape -->
      <rect x='10' y='25' width='110' height='90' rx='10' fill='none' stroke='#10b981' stroke-width='3'/>
      <!-- Shrunken Cytoplasm pulled away from wall -->
      <path d='M 30 50 Q 65 35 90 55 Q 105 85 85 98 Q 50 110 30 85 Z' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='1.8'/>
      <!-- Shrunken Vacuole -->
      <ellipse cx='60' cy='75' rx='20' ry='14' fill='#38bdf8' opacity='0.4' stroke='#0284c7' stroke-width='1.2'/>
      <!-- Nucleus -->
      <circle cx='45' cy='60' r='7' fill='#ef4444' opacity='0.8'/>
      <!-- Water Movement Arrows -->
      <line x1='18' y1='40' x2='2' y2='30' stroke='#38bdf8' stroke-width='1.5'/>
      <line x1='110' y1='40' x2='125' y2='30' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Neutral Label B -->
      <circle cx='65' cy='140' r='9' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/>
      <text x='65' y='143' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>B</text>
    </g>

    <text x='190' y='195' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>OSMOSIS IN PLANT CELLS: MICROSCOPIC EXAMINATION OF CELLS A AND B IN LIQUID MEDIA</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(d): Horticultural Farm Hand Tools (Neutralized)
const svgQ1dFarmTools = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Tool I: Pickaxe / Mattock -->
    <g transform='translate(35, 25)'>
      <!-- Wooden Handle -->
      <line x1='40' y1='25' x2='40' y2='120' stroke='#a16207' stroke-width='4' stroke-linecap='round'/>
      <!-- Double-ended Steel Blade Head -->
      <path d='M 10 25 C 25 22 55 22 70 25 L 68 33 C 55 30 25 30 12 33 Z' fill='#64748b' stroke='#cbd5e1' stroke-width='1.5'/>
      <!-- Neutral Label I -->
      <circle cx='40' cy='145' r='9' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='40' y='148' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text>
    </g>

    <!-- Tool II: Hand Trowel -->
    <g transform='translate(125, 25)'>
      <!-- Short Handle -->
      <line x1='35' y1='100' x2='35' y2='125' stroke='#a16207' stroke-width='5' stroke-linecap='round'/>
      <!-- Curved Scooping Blade -->
      <path d='M 22 45 C 22 25 35 15 35 15 C 35 15 48 25 48 45 C 48 80 40 98 35 98 C 30 98 22 80 22 45 Z' fill='#64748b' stroke='#cbd5e1' stroke-width='1.5'/>
      <!-- Neutral Label II -->
      <circle cx='35' cy='145' r='9' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/>
      <text x='35' y='148' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II</text>
    </g>

    <!-- Tool III: Secateurs (Pruning Shears) -->
    <g transform='translate(210, 25)'>
      <!-- Handles -->
      <path d='M 25 125 C 20 95 30 75 35 65' stroke='#ef4444' stroke-width='3.5' fill='none'/>
      <path d='M 45 125 C 50 95 40 75 35 65' stroke='#ef4444' stroke-width='3.5' fill='none'/>
      <!-- Pivot Bolt -->
      <circle cx='35' cy='65' r='3' fill='#ffffff'/>
      <!-- Curved Cutting Blades -->
      <path d='M 35 65 C 25 45 30 25 40 20' stroke='#cbd5e1' stroke-width='2.5' fill='none'/>
      <path d='M 35 65 C 42 45 38 25 30 22' stroke='#cbd5e1' stroke-width='2.5' fill='none'/>
      <!-- Neutral Label III -->
      <circle cx='35' cy='145' r='9' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='35' y='148' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>III</text>
    </g>

    <!-- Tool IV: Garden Rake -->
    <g transform='translate(295, 25)'>
      <!-- Long Handle -->
      <line x1='35' y1='25' x2='35' y2='100' stroke='#a16207' stroke-width='3.5' stroke-linecap='round'/>
      <!-- Cross Bar with Teeth -->
      <line x1='10' y1='100' x2='60' y2='100' stroke='#64748b' stroke-width='3'/>
      <line x1='12' y1='100' x2='12' y2='120' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='23' y1='100' x2='23' y2='120' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='35' y1='100' x2='35' y2='120' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='47' y1='100' x2='47' y2='120' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='58' y1='100' x2='58' y2='120' stroke='#cbd5e1' stroke-width='2'/>
      <!-- Neutral Label IV -->
      <circle cx='35' cy='145' r='9' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/>
      <text x='35' y='148' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>IV</text>
    </g>

    <text x='190' y='192' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>HORTICULTURAL TOOLS: IDENTIFY TOOLS I, II, III, AND IV AND STATE ONE USE FOR EACH</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// ==========================================
// 40 OBJECTIVE TEST QUESTIONS (STRICT JHS NACCA STANDARDS)
// ==========================================
const rawScienceBank: QuestionItem[] = [
  {
    number: 1,
    prompt: "In which anatomical section of the human kidney does the ultrafiltration of blood plasma occur to separate metabolic wastes from blood cells?",
    correctAnswer: "Bowman's capsule (in the renal cortex)",
    distractors: [
      "The renal pelvis",
      "The urinary bladder",
      "The collecting duct"
    ],
    hint: "High blood pressure forces water, urea, and glucose across glomerular capillaries into this cup-shaped structure.",
    workedSolution: "Ultrafiltration occurs in Bowman's capsule surrounding the glomerulus in the renal cortex, filtering small molecules into nephron tubules while retaining large blood cells and proteins.",
    points: 1
  },
  {
    number: 2,
    prompt: "In the International System of Units (S.I.), what derived unit is used to measure electrical potential difference (voltage)?",
    correctAnswer: "Volt [V = J C⁻¹]",
    distractors: [
      "Ampere [A]",
      "Ohm [Ω]",
      "Watt [W]"
    ],
    hint: "The energy transformed per unit electric charge passing between two points ($V = \\frac{W}{Q}$).",
    workedSolution: "The Volt (V) is the derived S.I. unit of potential difference. Ampere measures current, Ohm measures electrical resistance, and Watt measures power.",
    points: 1
  },
  {
    number: 3,
    prompt: "A livestock farmer adds crushed oyster shell meal to the feed ration of laying hens. This mineral supplement is provided primarily to:",
    correctAnswer: "Supply calcium for the development of hard, strong eggshells",
    distractors: [
      "Accelerate the enzymatic digestion of crude fiber in the gizzard",
      "Eliminate intestinal tapeworm infections",
      "Provide energy to keep the birds warm during the rainy season"
    ],
    hint: "Oyster shells are rich in calcium carbonate ($\\text{CaCO}_3$).",
    workedSolution: "Eggshells consist almost entirely of calcium carbonate. Supplying crushed oyster shells provides the calcium needed to prevent thin-shelled or soft-shelled eggs in laying birds.",
    points: 1
  },
  {
    number: 4,
    prompt: "When white light is dispersed by a triangular glass prism into a spectrum of colors, which spectral color is deviated LEAST from its original path?",
    correctAnswer: "Red light",
    distractors: [
      "Yellow light",
      "Green light",
      "Violet light"
    ],
    hint: "Has the longest wavelength in the visible spectrum and travels fastest in glass.",
    workedSolution: "Red light has the longest wavelength and is refracted (bent) the least when entering glass. Violet light has the shortest wavelength and is deviated the most.",
    points: 1
  },
  {
    number: 5,
    prompt: "Which of the following clinical conditions in humans is an inheritable genetic blood disorder rather than an infectious disease?",
    correctAnswer: "Sickle-cell anemia",
    distractors: [
      "Bacterial typhoid fever",
      "Plasmodium malaria",
      "Epidemic cholera"
    ],
    hint: "Caused by an inherited abnormal hemoglobin gene ($HbS$) passed from parents to children.",
    workedSolution: "Sickle-cell anemia is an inherited autosomal recessive genetic condition where abnormal hemoglobin causes red blood cells to deform into sickles. Typhoid, malaria, and cholera are infectious.",
    points: 1
  },
  {
    number: 6,
    prompt: "What is the systematic chemical formula for the binary inorganic compound Aluminum oxide?",
    correctAnswer: "Al₂O₃",
    distractors: [
      "AlO",
      "AlO₂",
      "Al₃O₂"
    ],
    hint: "Aluminum has a valency of 3 ($\\text{Al}^{3+}$) and Oxygen has a valency of 2 ($\\text{O}^{2-}$).",
    workedSolution: "Exchanging valencies gives $\\text{Al}_2\\text{O}_3$, representing a neutral binary ionic compound formed between two $\\text{Al}^{3+}$ ions and three $\\text{O}^{2-}$ ions.",
    points: 1
  },
  {
    number: 7,
    prompt: "In living cells, which of the following biological processes involves the net movement of water molecules across a selectively permeable membrane?",
    correctAnswer: "Osmosis",
    distractors: [
      "Molecular gas diffusion",
      "Gravitational sedimentation",
      "Sublimation"
    ],
    hint: "Water moves along a water potential gradient from a dilute to a concentrated solution.",
    workedSolution: "Osmosis is the net diffusion of water molecules from a region of higher water potential (dilute solution) to a lower water potential (concentrated solution) across a semi-permeable membrane.",
    points: 1
  },
  {
    number: 8,
    prompt: "A crowbar of total length $150.0\\text{ cm}$ has its fulcrum placed $30.0\\text{ cm}$ from the load. Calculate the Velocity Ratio ($VR$) of the lever:",
    correctAnswer: "4.0",
    distractors: [
      "0.25",
      "3.0",
      "5.0"
    ],
    hint: "$$\\text{Effort arm} = 150.0 - 30.0 = 120.0\\text{ cm}$$. $$VR = \\frac{\\text{Effort arm}}{\\text{Load arm}}$$.",
    workedSolution: "$$\\text{Effort Arm } (d_E) = 150.0\\text{ cm} - 30.0\\text{ cm} = 120.0\\text{ cm}$$. $$VR = \\frac{d_E}{d_L} = \\frac{120.0\\text{ cm}}{30.0\\text{ cm}} = 4.0$$.",
    points: 1
  },
  {
    number: 9,
    prompt: "Which chemical reagent solution is used in laboratories to confirm the presence of dissolved carbon dioxide gas by forming a milky white precipitate?",
    correctAnswer: "Aqueous calcium hydroxide [Limewater]",
    distractors: [
      "Dilute hydrochloric acid",
      "Benedict's solution",
      "Ethanol alcohol"
    ],
    hint: "Forms an insoluble precipitate of calcium carbonate ($\\text{CaCO}_3$).",
    workedSolution: "Carbon dioxide reacts with limewater (calcium hydroxide) to precipitate insoluble white calcium carbonate ($\\text{CaCO}_3$), turning the solution milky: $\\text{Ca(OH)}_2 + \\text{CO}_2 \\to \\text{CaCO}_3\\downarrow + \\text{H}_2\\text{O}$.",
    points: 1
  },
  {
    number: 10,
    prompt: "In electrical circuits, what is the primary function of connecting an electrical fuse in series with a household appliance?",
    correctAnswer: "To melt and break the circuit when electric current exceeds safe operating limits",
    distractors: [
      "To step down mains voltage from 240 V to 12 V",
      "To convert alternating current into direct current",
      "To store electrical energy for emergency backup"
    ],
    hint: "Contains a low-melting-point wire that prevents electrical fires caused by overcurrent.",
    workedSolution: "A fuse is a safety device containing a thin wire with a low melting point that melts when current exceeds its amperage rating, cutting off current to protect wiring and appliances.",
    points: 1
  },
  {
    number: 11,
    prompt: "Which laboratory apparatus is specifically designed to separate two immiscible liquids of different densities, such as kerosene and water?",
    correctAnswer: "A separating funnel",
    distractors: [
      "A Liebig condenser",
      "A filter funnel with filter paper",
      "A desiccator"
    ],
    hint: "Features a glass bulb and a bottom stopcock to drain the denser liquid layer.",
    workedSolution: "A separating funnel separates immiscible liquids of different densities: the denser liquid (water) settles at the bottom and drains through the stopcock, leaving the lighter liquid (kerosene) behind.",
    points: 1
  },
  {
    number: 12,
    prompt: "An electric blender rated $500.0\\text{ W}$ is operated for $6.0\\text{ hours}$ in a commercial bakery. Calculate the electrical energy consumed in kilowatt-hours (kWh):",
    correctAnswer: "3.0 kWh",
    distractors: [
      "0.08 kWh",
      "30.0 kWh",
      "3,000.0 kWh"
    ],
    hint: "$$\\text{Power in kW} = \\frac{500.0}{1,000} = 0.5\\text{ kW}$$. $$\\text{Energy} = P \\times t = 0.5 \\times 6.0$$.",
    workedSolution: "$$\\text{Power} = 0.5\\text{ kW}$$. $$\\text{Energy} = P \\times t = 0.5\\text{ kW} \\times 6.0\\text{ h} = 3.0\\text{ kWh}$$.",
    points: 1
  },
  {
    number: 13,
    prompt: "Which infectious childhood disease is caused by an airborne virus, presenting with high fever, cough, and a widespread reddish skin rash?",
    correctAnswer: "Measles [Morbillivirus]",
    distractors: [
      "Poliomyelitis",
      "Bacterial tetanus",
      "Cholera"
    ],
    hint: "Controlled through routine MMR / Measles infant vaccination.",
    workedSolution: "Measles is a contagious viral infection transmitted via airborne respiratory droplets, characterized by fever, cough, Koplik's spots, and an extensive maculopapular rash.",
    points: 1
  },
  {
    number: 14,
    prompt: "What is the ground-state Bohr electronic configuration of an atom of Magnesium ($_{12}\\text{Mg}$)?",
    correctAnswer: "2, 8, 2",
    distractors: [
      "2, 8, 8, 2",
      "2, 10",
      "2, 8, 1"
    ],
    hint: "Fills 2 electrons in the K-shell, 8 in the L-shell, and 2 valence electrons in the M-shell.",
    workedSolution: "Magnesium has atomic number 12: 2 electrons in the first shell, 8 in the second shell, and 2 valence electrons in the third shell ($2, 8, 2$).",
    points: 1
  },
  {
    number: 15,
    prompt: "Which of the following common tools operates as a third-class lever where the applied effort is situated between the fulcrum and the load?",
    correctAnswer: "A pair of tweezers (or forceps)",
    distractors: [
      "A crowbar",
      "A wheelbarrow",
      "A crown-cap bottle opener"
    ],
    hint: "The effort is applied at the center between the hinged joint and gripping tips.",
    workedSolution: "In a Class 3 lever, the effort force is exerted between the fulcrum and load (e.g., tweezers, forceps, human forearm). Scissors are Class 1; wheelbarrows are Class 2.",
    points: 1
  },
  {
    number: 16,
    prompt: "Which soil type feels distinctly sticky and plastic when molded with water, forming long flexible ribbons that do not crack?",
    correctAnswer: "Clayey soil",
    distractors: [
      "Coarse sandy soil",
      "Sandy loam soil",
      "Gravelly sand"
    ],
    hint: "Composed of microscopic mineral particles with high cohesion.",
    workedSolution: "Clay soil consists of fine mineral particles ($< 0.002\\text{ mm}$) that become sticky, plastic, and moldable when wet, forming ribbons without breaking.",
    points: 1
  },
  {
    number: 17,
    prompt: "Which chamber of the human heart has the thickest muscular myocardium to pump oxygenated blood throughout systemic circulation?",
    correctAnswer: "The left ventricle",
    distractors: [
      "The right ventricle",
      "The left atrium",
      "The right atrium"
    ],
    hint: "Must generate high hydrostatic pressure to drive blood through the systemic aorta.",
    workedSolution: "The left ventricle has the thickest muscular wall because it must generate enough contractile force to overcome systemic vascular resistance and pump blood through the aorta to the body.",
    points: 1
  },
  {
    number: 18,
    prompt: "When solid candle wax is gently heated in a crucible, it melts into liquid wax. When cooled, it resolidifies into solid wax. This change is classified as a:",
    correctAnswer: "Reversible physical change",
    distractors: [
      "Permanent chemical change",
      "Nuclear transmutation",
      "Irreversible decomposition"
    ],
    hint: "No new chemical substance is formed; only physical state changes.",
    workedSolution: "Melting wax is a reversible physical phase transition ($\\text{Solid} \\rightleftharpoons \\text{Liquid}$) that does not break covalent bonds or form new chemical compounds.",
    points: 1
  },
  {
    number: 19,
    prompt: "What is the primary physiological function performed by the colored muscular iris in the human eye?",
    correctAnswer: "Controlling the diameter of the pupil to regulate the amount of entering light",
    distractors: [
      "Focusing sharp optical images onto the retina",
      "Secreting aqueous humor into the anterior chamber",
      "Protecting the sclera from bacterial infections"
    ],
    hint: "Smooth circular and radial muscles constrict or dilate the central pupil opening.",
    workedSolution: "The iris contains smooth muscles that constrict the pupil in bright light to protect the retina and dilate it in dim light to maximize light entry.",
    points: 1
  },
  {
    number: 20,
    prompt: "What color change is observed when red litmus paper is dipped into an aqueous solution of sodium hydroxide [$\\text{NaOH}$]?",
    correctAnswer: "Turns blue (indicating an alkaline/basic solution, pH > 7)",
    distractors: [
      "Remains red without change",
      "Turns bright yellow",
      "Turns colorless"
    ],
    hint: "Bases turn red litmus paper blue.",
    workedSolution: "Sodium hydroxide is a strong base with a high concentration of $\\text{OH}^-$ ions ($pH > 7$). Alkalis turn red litmus paper blue.",
    points: 1
  },
  {
    number: 21,
    prompt: "In a biological community food web, organisms that feed directly on primary autotrophic producers are classified as:",
    correctAnswer: "Primary consumers (Herbivores)",
    distractors: [
      "Secondary consumers",
      "Tertiary consumers",
      "Apex predators"
    ],
    hint: "Herbivorous animals (e.g., grasshoppers, cattle, caterpillars) occupying Trophic Level 2.",
    workedSolution: "Primary consumers are herbivores that feed directly on autotrophic plants (producers). Secondary consumers feed on herbivores.",
    points: 1
  },
  {
    number: 22,
    prompt: "A horizontal pulling force of $50.0\\text{ N}$ moves a trolley across a level floor through a distance of $6.0\\text{ m}$. Calculate the work done:",
    correctAnswer: "300.0 Joules",
    distractors: [
      "8.33 Joules",
      "56.0 Joules",
      "600.0 Joules"
    ],
    hint: "$$\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (d) = 50.0 \\times 6.0$$.",
    workedSolution: "$$\\text{Work Done } (W) = F \\times d = 50.0\\text{ N} \\times 6.0\\text{ m} = 300.0\\text{ Joules (J)}$$.",
    points: 1
  },
  {
    number: 23,
    prompt: "Which agronomic conservation practice establishes rows of tall trees along field borders to reduce wind speed across bare topsoil?",
    correctAnswer: "Windbreaks / Shelterbelts",
    distractors: [
      "Strip cropping",
      "Clean weeding",
      "Overgrazing"
    ],
    hint: "Barrier plantings perpendicular to prevailing winds that prevent wind erosion.",
    workedSolution: "Windbreaks (shelterbelts) are rows of trees planted along field edges to reduce wind velocity at ground level, preventing topsoil detachment by wind.",
    points: 1
  },
  {
    number: 24,
    prompt: "In fundamental chemistry, a pure chemical element is defined as a substance that:",
    correctAnswer: "Consists exclusively of atoms having the exact same atomic number",
    distractors: [
      "Can be chemically decomposed into simpler substances by boiling",
      "Is formed by physically dissolving a solid in a liquid solvent",
      "Is composed of two or more elements combined in variable proportions"
    ],
    hint: "Cannot be broken down into simpler chemical substances by chemical means.",
    workedSolution: "An element is a pure chemical substance consisting of atoms with the same nuclear proton number (atomic number) that cannot be split into simpler substances by chemical reactions.",
    points: 1
  },
  {
    number: 25,
    prompt: "What is the stoichiometric chemical formula of binary Sodium oxide?",
    correctAnswer: "Na₂O",
    distractors: [
      "NaO",
      "NaO₂",
      "Na₂O₂"
    ],
    hint: "Sodium has a valency of 1 ($\\text{Na}^+$) and Oxygen has a valency of 2 ($\\text{O}^{2-}$).",
    workedSolution: "Two sodium cations combine with one oxide anion to form neutral sodium oxide, yielding the stoichiometric formula $\\text{Na}_2\\text{O}$.",
    points: 1
  },
  {
    number: 26,
    prompt: "Which of the following agricultural food crops is propagated on farmlands using lateral vegetative sword suckers?",
    correctAnswer: "Banana and Plantain [Musa spp.]",
    distractors: [
      "Cassava stem",
      "Irish potato tuber",
      "Sweet potato vine"
    ],
    hint: "Lateral shoots arising from underground corms bearing narrow sword-shaped leaves.",
    workedSolution: "Bananas and plantains are propagated vegetatively using sword suckers produced from subterranean corms, as commercial varieties do not produce viable seeds.",
    points: 1
  },
  {
    number: 27,
    prompt: "When solid sodium chloride dissolves completely in water, the liquid remains transparent and does not settle. This mixture is:",
    correctAnswer: "A homogeneous true solution",
    distractors: [
      "A heterogeneous suspension",
      "A colloidal emulsion",
      "A permanent chemical compound"
    ],
    hint: "Solute particles disperse uniformly at the ionic level throughout the solvent.",
    workedSolution: "Dissolved salt forms a single-phase homogeneous solution: sodium and chloride ions disperse uniformly among water molecules and cannot be separated by filtration.",
    points: 1
  },
  {
    number: 28,
    prompt: "An electric heater of resistance $40.0\\ \\Omega$ draws a current of $2.5\\text{ A}$ from an electrical outlet. Determine the potential difference across the heater:",
    correctAnswer: "100.0 V",
    distractors: [
      "16.0 V",
      "42.5 V",
      "250.0 V"
    ],
    hint: "By Ohm's Law: $V = I \\times R = 2.5 \\times 40.0$.",
    workedSolution: "By Ohm's Law: $V = I \\times R = 2.5\\text{ A} \\times 40.0\\ \\Omega = 100.0\\text{ Volts (V)}$.",
    points: 1
  },
  {
    number: 29,
    prompt: "Which environmental factor is essential for aerobic cellular respiration in germinating seeds to break down stored food into ATP?",
    correctAnswer: "Diatomic oxygen gas [O₂]",
    distractors: [
      "Bright radiant sunlight",
      "Synthetic fertilizer salts",
      "Carbon monoxide gas"
    ],
    hint: "Acts as the final electron acceptor in the electron transport chain during aerobic respiration.",
    workedSolution: "Oxygen gas ($\\text{O}_2$) is essential for aerobic respiration during seed germination, oxidizing stored food reserves to produce the ATP energy required for embryonic growth.",
    points: 1
  },
  {
    number: 30,
    prompt: "Which protective anti-rust method covers moving bicycle and engine parts with an oil barrier to exclude oxygen and moisture?",
    correctAnswer: "Lubricating with oil and grease",
    distractors: [
      "Galvanizing with zinc",
      "Enamel painting",
      "Electroplating with chromium"
    ],
    hint: "Forms a waterproof barrier while reducing friction between moving contact parts.",
    workedSolution: "Applying oil and grease forms a waterproof barrier that prevents atmospheric oxygen and moisture from contacting iron surfaces, while reducing mechanical friction.",
    points: 1
  },
  {
    number: 31,
    prompt: "Which human bodily action is an involuntary reflex mediated through an autonomic reflex arc?",
    correctAnswer: "Blinking of the eye when an insect approaches the face",
    distractors: [
      "Reading a printed science textbook",
      "Chewing a mouthful of food",
      "Writing with a fountain pen"
    ],
    hint: "Occurs rapidly and automatically to protect the eye without prior conscious deliberation.",
    workedSolution: "The corneal blink reflex is an involuntary protective reflex mediated through cranial nerves to shield the eye from foreign objects. Reading, chewing, and writing are voluntary.",
    points: 1
  },
  {
    number: 32,
    prompt: "In simple machine mechanics, the Mechanical Advantage ($MA$) is mathematically defined as the ratio of:",
    correctAnswer: "Load force overcome to applied Effort force [L / E]",
    distractors: [
      "Distance moved by effort to distance moved by load",
      "Work input to work output",
      "Momentum to linear velocity"
    ],
    hint: "$$MA = \\frac{\\text{Load}}{\\text{Effort}}$$.",
    workedSolution: "Mechanical Advantage ($MA$) is the ratio of the load force overcome by a machine to the applied effort force exerted on it: $MA = \\frac{\\text{Load}}{\\text{Effort}}$.",
    points: 1
  },
  {
    number: 33,
    prompt: "Which planet in our Solar System is surrounded by prominent, wide rings composed of orbiting ice, dust, and rock particles?",
    correctAnswer: "Planet Saturn",
    distractors: [
      "Planet Mars",
      "Planet Venus",
      "Planet Mercury"
    ],
    hint: "The second-largest gas giant planet, famous for its visible ring system.",
    workedSolution: "Saturn is a Jovian gas giant surrounded by a prominent, extensive system of planetary rings composed of orbiting ice, dust, and rocky debris.",
    points: 1
  },
  {
    number: 34,
    prompt: "Which component of human whole blood is responsible for engulfing pathogenic bacteria through phagocytosis to defend the body?",
    correctAnswer: "White blood cells (Leukocytes)",
    distractors: [
      "Red blood cells (Erythrocytes)",
      "Blood platelets (Thrombocytes)",
      "Liquid blood plasma"
    ],
    hint: "Cells of the immune system that engulf pathogens and synthesize antibodies.",
    workedSolution: "White blood cells (leukocytes, such as neutrophils and monocytes) engulf invading pathogens by phagocytosis, while lymphocytes produce antibodies.",
    points: 1
  },
  {
    number: 35,
    prompt: "When dilute hydrochloric acid reacts with sodium hydroxide solution, thermal heat is liberated and the temperature rises. This reaction is:",
    correctAnswer: "An exothermic neutralization reaction",
    distractors: [
      "An endothermic neutralization reaction",
      "A physical phase change",
      "A nuclear fusion reaction"
    ],
    hint: "Acid-base neutralization liberates heat energy ($\\Delta H < 0$).",
    workedSolution: "Acid-base neutralization is an exothermic reaction ($\\text{HCl} + \\text{NaOH} \\to \\text{NaCl} + \\text{H}_2\\text{O} + \\text{Heat}$), releasing thermal energy and raising the temperature.",
    points: 1
  },
  {
    number: 36,
    prompt: "In vegetable crop husbandry, sunken nursery beds are prepared in dry, arid regions primarily to:",
    correctAnswer: "Conserve limited soil moisture and catch surface irrigation water",
    distractors: [
      "Accelerate gravity water drainage during flood storms",
      "Expose plant roots to direct midday sunlight",
      "Prevent earthworms from entering topsoil"
    ],
    hint: "Constructed 5–10 cm below ground level to collect and conserve scarce water.",
    workedSolution: "Sunken beds are constructed below the surrounding soil level in dry regions to collect and conserve irrigation water and protect seedlings from dry winds.",
    points: 1
  },
  {
    number: 37,
    prompt: "In angiosperm floral reproduction, following successful double fertilization, which floral structure ripens into the fruit pericarp?",
    correctAnswer: "The maternal floral ovary",
    distractors: [
      "The fertilized ovule",
      "The slender style",
      "The receptive stigma"
    ],
    hint: "The ovary wall becomes the fruit pericarp; the ovule develops into the seed.",
    workedSolution: "Following fertilization, the ovary wall ripens into the fruit pericarp enclosing the seeds, while the fertilized ovules develop into viable seeds.",
    points: 1
  },
  {
    number: 38,
    prompt: "Why is the third top pin (Earth pin) of a standard domestic three-pin electrical plug made longer and thicker than the Live and Neutral pins?",
    correctAnswer: "To open safety shutters and establish grounding before current-carrying pins connect",
    distractors: [
      "To conduct electrical power directly into the appliance motor",
      "To prevent alternating current from reversing direction",
      "To resist high mechanical pulling forces from the wall socket"
    ],
    hint: "Ensures the metal chassis of the appliance is safely grounded before live contact is made.",
    workedSolution: "The longer Earth pin opens the protective socket shutters and connects the appliance's chassis to ground before the live pin enters, protecting users from electric shocks.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which physical separation method uses boiling and subsequent condensation to recover pure solvent from a solution, such as fresh water from brine?",
    correctAnswer: "Simple distillation",
    distractors: [
      "Open solar evaporation",
      "Gravity filtration",
      "Paper chromatography"
    ],
    hint: "Vaporizes volatile water and condenses it back to liquid in a Liebig condenser.",
    workedSolution: "Simple distillation boils the saline solution to generate water vapor, then condenses the vapor in a cooling condenser to collect pure water distillate.",
    points: 1
  },
  {
    number: 40,
    prompt: "Why do plants wilt and droop when transplanted into a new garden bed on a hot, sunny afternoon?",
    correctAnswer: "The rate of water loss via transpiration exceeds water absorption by disturbed roots",
    distractors: [
      "The plants lack carbon dioxide gas in the new garden soil",
      "Solar radiation eliminates all cellular chloroplasts",
      "The roots absorb too much water, causing tissue rupture"
    ],
    hint: "Disturbed root hairs cannot absorb water fast enough to keep pace with rapid transpiration.",
    workedSolution: "Transplanting damages delicate root hairs, reducing water uptake. On hot afternoons, high transpiration rates cause cells to lose turgor pressure and wilt.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 202704);

const balancedMock4P1 = rawScienceBank.map((q, idx) => {
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
// PAPER 2 ESSAY QUESTIONS BANK (STRICT JHS NACCA STANDARDS)
// ==========================================
const paper2Mock4Questions = [
  // ==========================================
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Figure 1(a) illustrates an optical experiment demonstrating the dispersion of a beam of light using a triangular glass prism:

${svgQ1aLightDispersion}

(i) Name the components labelled Ray I, Prism P, and Screen IV.
(ii) State the optical phenomenon demonstrated in this experiment.
(iii) Identify the spectral colors represented by rays II and III.
(iv) Explain why ray III is deviated (refracted) more than ray II by prism P.
(v) Name one natural atmospheric phenomenon that occurs as a result of the dispersion of sunlight.`,
        workedSolution: `(i) Names of components:
• Ray I: **Incident beam of white light**
• Prism P: **Triangular glass prism**
• Screen IV: **White display screen (or white cardboard sheet)**

(ii) Optical phenomenon:
**Dispersion of light** (the separation of white light into its constituent spectral colors).

(iii) Identification of rays:
• Ray II (least deviated): **Red light**
• Ray III (most deviated): **Violet light**

(iv) Explanation of deviation:
Glass has different refractive indices for different light wavelengths. Violet light (III) has a shorter wavelength and slows down more upon entering glass, refracting through a larger angle. Red light (II) has a longer wavelength and travels faster in glass, undergoing the least deviation.

(v) Natural phenomenon:
The formation of a **rainbow** in the sky after a rain shower (water droplets act as natural prisms that disperse sunlight).`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `Figure 1(b) illustrates a simple laboratory distillation apparatus set up to purify water from a salt solution:

${svgQ1bSimpleDistillation}

(i) Name each of the parts labelled I, II, and III.
(ii) State the specific functions of parts labelled T and II.
(iii) Indicate which of the tubes labelled $W_1$ or $W_2$ represents:
  (α) The cold water inlet;
  (β) The warm water outlet.
(iv) Explain why cooling water is introduced through the bottom ($W_1$) rather than the top ($W_2$).
(v) State one domestic or medical application of pure distilled water (collected in vessel III).`,
        workedSolution: `(i) Labelled parts:
• Part I: **Round-bottom distillation flask**
• Part II: **Liebig condenser**
• Vessel III: **Conical receiving flask (or beaker)**

(ii) Functions of components:
• Thermometer T: Monitors the boiling temperature of the vapor to ensure only pure water vapor ($100^\\circ\\text{C}$) passes into the condenser.
• Liebig Condenser II: Cools and condenses hot water vapor back into liquid water.

(iii) Water connections:
• (α) Cold water inlet: **$W_1$ (bottom connection)**
• (β) Warm water outlet: **$W_2$ (top connection)**

(iv) Why water enters through $W_1$:
Introducing cold water at the bottom ensures the condenser jacket remains completely filled with water without air pockets, providing efficient heat exchange and counter-current cooling.

(v) Applications of distilled water:
1. Preparing clinical medicines and liquid pharmaceutical injections.
2. Topping up lead-acid car battery electrolyte solutions.
3. Conducting quantitative chemical experiments in laboratories.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `Figure 1(c) illustrates two epidermal plant cells A and B placed in different liquid solutions:

${svgQ1cCellPlasmolysis}

(i) State the physiological condition of:
  (α) Cell A;
  (β) Cell B.
(ii) Name the type of solution in which each cell was placed:
  (α) Cell A;
  (β) Cell B.
(iii) Name the biological process that caused the change in Cell B.
(iv) State what happens to the size and shape of Cell B if it is removed from the concentrated solution and placed in pure distilled water for two hours.`,
        workedSolution: `(i) Condition of cells:
• (α) Cell A: **Turgid (fully swollen and firm)**
• (β) Cell B: **Plasmolyzed (flaccid, with cytoplasm pulled away from the cell wall)**

(ii) Solutions:
• (α) Cell A: **Hypotonic solution (pure distilled water / dilute solution)**
• (β) Cell B: **Hypertonic solution (concentrated salt or sugar solution)**

(iii) Biological process:
**Plasmolysis** (caused by exosmosis — water moves out of the central vacuole into the hypertonic external solution down a water potential gradient).

(iv) Effect of returning Cell B to pure water:
**Deplasmolysis occurs:** Water enters the cell by endosmosis; the central vacuole swells with water, pushing the cytoplasm back against the cell wall to restore the cell to a **turgid state**.`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `Figure 1(d) illustrates four common handheld tools used on a vegetable farm:

${svgQ1dFarmTools}

(i) Name each of the farm tools labelled I, II, III, and IV.
(ii) State one practical agricultural use for each tool.
(iii) State two maintenance practices used to keep these tools in good working order.`,
        workedSolution: `(i) Names of tools:
• Tool I: **Pickaxe (or Mattock)**
• Tool II: **Hand trowel**
• Tool III: **Secateurs (pruning shears)**
• Tool IV: **Garden rake**

(ii) Practical agricultural uses:
• Tool I (Pickaxe/Mattock): Digging hard, compacted soils and removing tree roots and rocks during land preparation.
• Tool II (Hand trowel): Scooping soil to transplant delicate vegetable seedlings from nursery beds into the field.
• Tool III (Secateurs): Pruning unwanted branches, trimming shoots, and harvesting fruit stems cleanly.
• Tool IV (Garden rake): Leveling tilled seedbeds, breaking surface soil crusts, and gathering weeds and stones.

(iii) Maintenance practices:
1. Wash and dry tools thoroughly after use to remove adhering moist soil.
2. Sharpen cutting blades regularly (e.g., mattock edges, secateurs).
3. Apply oil or grease to metal parts and cutting joints to prevent rusting.
4. Replace loose or cracked wooden handles.`,
        maxMarks: 10
      }
    ]
  },

  // ==========================================
  // SECTION B: THEORY ESSAYS (ANSWER ANY 3 QUESTIONS, 60 MARKS TOTAL)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) Name the four types of human teeth in an adult dentition and state the primary mechanical feeding function of each.
(ii) Explain how bacterial plaque leads to dental caries (tooth decay) and state two oral hygiene practices that prevent dental disease.`,
        workedSolution: `(i) Four types of adult teeth and functions:
1. **Incisors:** Chisel-shaped front teeth for **cutting and biting** food.
2. **Canines:** Pointed, dagger-like teeth for **tearing and ripping** tough food (meat).
3. **Premolars:** Flat crowns with two cusps for **crushing and grinding** food.
4. **Molars:** Broad surface with four or five cusps for **heavy grinding and chewing** food.

(ii) Dental caries formation & prevention:
• **Mechanism:** Bacteria in dental plaque ferment residual sugars from trapped food particles, producing organic acids. These acids slowly dissolve and demineralize the hard enamel and dentine layers, creating cavities (caries).
• **Oral hygiene practices:**
1. Brushing teeth thoroughly with fluoride toothpaste at least twice daily (morning and before bed).
2. Rinsing the mouth with water after meals and avoiding frequent sugary sweets.
3. Visiting a dental clinic periodically for professional check-ups.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) In human renal physiology, distinguish between ultrafiltration and selective reabsorption occurring in the kidney nephron.
(ii) Name two metabolic waste products excreted by the human kidneys in urine.
(iii) State two healthy daily habits that support proper kidney function.`,
        workedSolution: `(i) Ultrafiltration vs. Selective Reabsorption:
• **Ultrafiltration:** The non-selective pressure-driven filtration of blood plasma across glomerular capillaries into Bowman's capsule under high hydrostatic pressure, separating water, urea, glucose, and salts while leaving blood cells and plasma proteins in the blood.
• **Selective Reabsorption:** The active and passive transport of essential nutrients (all glucose, amino acids, and requisite water and mineral ions) from the nephron renal tubules back into surrounding capillary blood.

(ii) Metabolic waste products in urine:
1. **Urea** (from deamination of excess amino acids in the liver).
2. **Uric acid** (from nucleic acid breakdown).
3. **Excess mineral salts** (sodium chloride) and creatinine.

(iii) Habits supporting kidney health:
1. Drinking sufficient clean drinking water daily to facilitate metabolic waste clearance.
2. Moderating dietary salt and processed food intake to prevent hypertension.`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `(i) State two ways by which flowering plants eliminate metabolic wastes in the absence of specialized excretory organs.
(ii) Name two waste substances produced by plants that are commercially useful to humans.`,
        workedSolution: `(i) Plant excretory mechanisms:
1. **Diffusion through Stomata and Lenticels:** Excess oxygen (from photosynthesis) and carbon dioxide/water vapor (from cellular respiration) diffuse out into the atmosphere.
2. **Abscission (Leaf Shedding):** Waste crystals (calcium oxalate) stored in leaves, bark, and fruit are permanently shed when leaves drop during the dry season.

(ii) Commercially useful plant waste products:
1. **Natural Rubber Latex** (from *Hevea brasiliensis*, used to manufacture vehicle tires and gloves).
2. **Gums and Resins** (used in adhesives, varnishes, and perfumes).
3. **Quinine / Tannins** (used in pharmaceuticals and leather tanning).`,
        maxMarks: 6
      }
    ]
  },
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) In electronics, explain the difference between the forward-biased and reverse-biased states of a semiconductor p-n junction diode.
(ii) What is electrical rectification? Explain why semiconductor diodes are essential components in mobile phone chargers.
(iii) State the function of a Light Emitting Diode (LED) and give one reason why LEDs are preferred over traditional filament bulbs in home lighting.`,
        workedSolution: `(i) Forward Bias vs. Reverse Bias:
• **Forward Bias:** The positive terminal of the power supply is connected to the p-type anode and the negative terminal to the n-type cathode, narrowing the depletion layer and allowing electric current to flow freely with low resistance.
• **Reverse Bias:** The positive terminal is connected to the n-type cathode and the negative terminal to the p-type anode, widening the depletion layer and preventing electric current from flowing (high resistance).

(ii) Electrical rectification & phone chargers:
• **Rectification:** The conversion of alternating current (AC) which reverses direction periodically into direct current (DC) which flows in only one direction.
• **Phone chargers:** Mobile phone lithium-ion batteries require steady direct current (DC) for charging. Diodes arranged in a rectifier bridge convert the $240\\text{ V}$ AC mains supply into unidirectional DC.

(iii) LEDs in home lighting:
• **Function:** An LED converts electrical energy directly into visible light when forward-biased.
• **Advantage:** LEDs consume significantly less electrical energy (high luminous efficiency) and have a much longer operating lifespan compared to incandescent filament bulbs.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) State Ohm's Law for an electrical conductor.
(ii) An electric heating element of resistance $60.0\\ \\Omega$ is connected across a $240.0\\text{ V}$ domestic mains supply. Calculate:
  (α) The electric current drawn by the heating element;
  (β) The electrical power consumed by the element in kilowatts (kW).`,
        workedSolution: `(i) Ohm's Law:
Ohm's Law states that the electric current passing through a metallic conductor between two points is directly proportional to the potential difference across the points, provided temperature and other physical conditions remain constant ($V = IR$).

(ii) Calculations:
• (α) Current ($I$):
$$I = \\frac{V}{R} = \\frac{240.0\\text{ V}}{60.0\\ \\Omega} = 4.0\\text{ Amperes (A)}$$
Answer: The current is **4.0 A**.

• (β) Power ($P$):
$$P = V \\times I = 240.0\\text{ V} \\times 4.0\\text{ A} = 960.0\\text{ Watts (W)}$$
Convert to kilowatts:
$$P = \\frac{960.0}{1,000} = 0.96\\text{ kW}$$
Answer: Power consumed is **0.96 kW**.`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: "State three safety precautions that must be observed when installing or repairing domestic electrical appliances.",
        workedSolution: `1. Switching off the main electrical circuit breaker and unplugging the appliance before commencing repairs.
2. Ensuring hands and surrounding floors are completely dry to prevent accidental electric shocks.
3. Using the correct fuse rating for each appliance to avoid overheating and fire hazards.
4. Ensuring the Earth wire is properly grounded to the metal casing of high-power appliances.`,
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
        prompt: `(i) In the biological Nitrogen Cycle, outline the specific role played by symbiotic *Rhizobium* bacteria residing in the root nodules of leguminous crops.
(ii) Distinguish between the biochemical processes of nitrification and denitrification in agricultural soils.
(iii) Explain how electrical lightning discharges during thunderstorms contribute to natural soil fertility.`,
        workedSolution: `(i) Role of *Rhizobium* bacteria:
Symbiotic *Rhizobium* bacteria in the root nodules of legumes fix inert atmospheric nitrogen gas [$\\text{N}_2$] into ammonia and ammonium ions [$\\text{NH}_4^+$], converting it into a form that the host plant can synthesize into organic amino acids and proteins.

(ii) Nitrification vs. Denitrification:
• **Nitrification:** An aerobic biological oxidation where nitrifying bacteria (*Nitrosomonas* and *Nitrobacter*) convert toxic ammonia into nitrites [$\\text{NO}_2^-$] and subsequently into plant-available nitrates [$\\text{NO}_3^-$].
• **Denitrification:** An anaerobic biological reduction where denitrifying bacteria (*Pseudomonas*) convert soil nitrates back into gaseous nitrogen [$\\text{N}_2$], releasing it into the atmosphere.

(iii) Nitrogen fixation by lightning:
The extreme thermal energy of lightning causes atmospheric nitrogen [$\\text{N}_2$] and oxygen [$\\text{O}_2$] to combine into nitric oxide, which is oxidized to nitrogen dioxide. Rain dissolves this into dilute nitric acid, which falls into the soil and reacts with soil minerals to form soluble nitrates.`,
        maxMarks: 8
      },
      {
        subId: "(b)",
        prompt: `(i) State two farming practices that cause the depletion of nitrogen and organic matter from agricultural soils.
(ii) Explain why green manuring or planting cover crops enhances soil fertility on a crop farm.`,
        workedSolution: `(i) Practices depleting soil nitrogen:
1. **Bush Burning (Slash-and-Burn):** Volatilizes organic nitrogen into nitrogen oxide gases and burns humus, exposing soil to leaching.
2. **Continuous Monocropping without Legumes:** Exhausts nitrogen reserves as the same crop continually extracts the nutrient without replacement.

(ii) Benefits of green manuring:
Ploughing fresh green leguminous vegetative matter directly into topsoil adds substantial organic matter (humus). When decomposed by soil microbes, it releases mineralized nitrates and improves soil moisture-holding capacity and crumb structure.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: "State three observable differences between the physical properties of sandy soil and clayey soil.",
        workedSolution: `1. **Particle Size:** Sandy soil has large, coarse mineral particles ($0.05 - 2.0\\text{ mm}$), while clayey soil consists of microscopic particles ($< 0.002\\text{ mm}$).
2. **Drainage & Aeration:** Sandy soil has large macropores with very rapid drainage and high aeration, whereas clayey soil has micropores with slow drainage and poor aeration.
3. **Water-Holding Capacity:** Sandy soil has low water retention, while clayey soil holds large volumes of water and becomes easily waterlogged.
4. **Texture when Wet:** Sandy soil feels gritty and cannot be molded into ribbons, whereas clayey soil feels sticky and plastic and rolls into flexible ribbons.`,
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
        prompt: `(i) Define an acid and an alkali in terms of observable color changes on litmus paper.
(ii) Bee venom contains an acidic liquid that causes intense pain. Explain why applying baking soda paste (sodium hydrogen carbonate) or wood ash extract relieves the pain.
(iii) Write a word equation for the chemical reaction between dilute hydrochloric acid and calcium carbonate (limestone).`,
        workedSolution: `(i) Acid vs. Alkali by litmus paper:
• **Acid:** A chemical substance that turns blue litmus paper red ($pH < 7$).
• **Alkali (Base):** A water-soluble basic substance that turns red litmus paper blue ($pH > 7$).

(ii) Bee sting relief:
Bee sting venom is mildly acidic. Applying baking soda paste or wood ash extract (which are mild alkalis) causes an **acid-base neutralization reaction**, neutralizing the acid venom and reducing skin inflammation and stinging pain.

(iii) Word equation:
$$\\text{Hydrochloric acid} + \\text{Calcium carbonate} \\to \\text{Calcium chloride} + \\text{Water} + \\text{Carbon dioxide}$$`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) A wheelbarrow is used to transport a load of $400.0\\text{ N}$ of gravel on a farm. The wheel axle serves as the fulcrum, the center of gravity of the load is $40.0\\text{ cm}$ from the wheel, and effort is applied at the handles $120.0\\text{ cm}$ from the wheel:
  (α) Identify the class of lever represented by the wheelbarrow;
  (β) Calculate the minimum upward effort force required to balance the load.
(ii) Distinguish between Mechanical Advantage ($MA$) and Velocity Ratio ($VR$) of a simple machine.`,
        workedSolution: `(i) Wheelbarrow calculations:
• (α) Class of lever: **Second-class lever** (the load is positioned between the fulcrum/wheel and the applied effort).
• (β) Minimum effort force ($E$):
By the Principle of Moments about the wheel axle:
$$\\text{Clockwise Moment} = \\text{Anticlockwise Moment}$$
$$\\text{Effort } (E) \\times \\text{Effort Arm } (d_E) = \\text{Load } (L) \\times \\text{Load Arm } (d_L)$$
$$E \\times 120.0\\text{ cm} = 400.0\\text{ N} \\times 40.0\\text{ cm}$$
$$E = \\frac{400.0 \\times 40.0}{120.0} = \\frac{16,000.0}{120.0} = 133.33\\text{ Newtons (N)}$$
Answer: The minimum effort required is **133.33 N**.

(ii) MA vs. VR:
• **Mechanical Advantage ($MA$):** The ratio of load force overcome to applied effort force ($MA = \\frac{L}{E}$), taking friction into account.
• **Velocity Ratio ($VR$):** The ratio of distance moved by effort to distance moved by load in the same time ($VR = \\frac{d_E}{d_L}$), dependent solely on machine geometry.`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `(i) Name the causative micro-organism and the mode of transmission of Cholera in human communities.
(ii) State two environmental sanitation practices that effectively prevent cholera epidemics during heavy rainy seasons in Ghana.`,
        workedSolution: `(i) Causative organism & transmission:
• **Causative pathogen:** The bacterium **Vibrio cholerae**.
• **Mode of transmission:** Ingestion of food or drinking water contaminated with infected human fecal matter (fecal-oral route).

(ii) Prevention practices:
1. Boiling drinking water or treating it with chlorine tablets before consumption.
2. Proper disposal of human sewage in sanitary latrines and avoiding open defecation.
3. Washing hands thoroughly with soap under running water before handling food and after visiting the toilet.`,
        maxMarks: 6
      }
    ]
  }
];

// ==========================================
// SEEDING AND INGESTION ENGINE
// ==========================================
async function seedBeceMock4Science() {
  console.log('Connecting to Firestore and Seeding BECE Integrated Science Mock 4 (Set 135)...');
  const db = await getDb();

  // Verify balanced key distribution for Paper 1
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedMock4P1.forEach(q => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Mock 4 Paper 1 Key Distribution across 40 items:', keyDist);

  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error('Key balancing check failed! Must be exactly 10 A, 10 B, 10 C, 10 D.');
  }

  const docRef = db.doc('global_curriculum/jhs/subjects/science/mock_exams/mock_4');
  await docRef.set({
    mockId: "mock_4",
    title: "BECE Integrated Science Mock 4 (Standard Mock Suite - Final Benchmark)",
    subject: "Integrated Science",
    totalDurationMinutes: 150,
    metadata: {
      isMock: true,
      isMockExam: true,
      setNumber: 135,
      version: "NaCCA JHS Standards-Compliant",
      totalMarks: 140,
      sanitized: true,
      optionsBalanced: true,
      vectorGraphicsCount: 4,
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test (Mock 4)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: balancedMock4P1
    },
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Mock 4)",
      durationMinutes: 105,
      instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2Mock4Questions
    }
  }, { merge: true });

  console.log('✅ Ingestion complete: Set 135 (Mock 4) seeded successfully into mock_exams/mock_4.');
}

seedBeceMock4Science()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Failed ingestion for Mock 4 Science:', err);
    process.exit(1);
  });
