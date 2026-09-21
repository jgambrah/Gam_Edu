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
// PAPER 2 VECTOR SVGs (STRICTLY NACCA JHS COMPLIANT)
// ==========================================

// SVG for Q1(a): Ohm's Law Circuit (Resistor, Ammeter, Voltmeter, Rheostat, Switch)
const svgQ1aOhmsLawCircuit = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    
    <line x1='50' y1='40' x2='140' y2='40' stroke='#38bdf8' stroke-width='2'/>
    <g transform='translate(140, 40)'>
      <line x1='0' y1='-14' x2='0' y2='14' stroke='#10b981' stroke-width='2.5'/>
      <line x1='8' y1='-8' x2='8' y2='8' stroke='#ef4444' stroke-width='4'/>
      <line x1='18' y1='-14' x2='18' y2='14' stroke='#10b981' stroke-width='2.5'/>
      <line x1='26' y1='-8' x2='26' y2='8' stroke='#ef4444' stroke-width='4'/>
      
      <circle cx='13' cy='-22' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='13' y='-19' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text>
    </g>
    
    
    <line x1='166' y1='40' x2='230' y2='40' stroke='#38bdf8' stroke-width='2'/>
    <circle cx='233' cy='40' r='2.5' fill='#e2e8f0'/>
    <line x1='233' y1='40' x2='257' y2='40' stroke='#e2e8f0' stroke-width='2.5'/>
    <circle cx='257' cy='40' r='2.5' fill='#e2e8f0'/>
    
    <circle cx='245' cy='22' r='8' fill='#1e293b' stroke='#e2e8f0' stroke-width='1.5'/>
    <text x='245' y='25' font-size='9' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>II</text>
    
    <line x1='257' y1='40' x2='320' y2='40' stroke='#38bdf8' stroke-width='2'/>

    
    <line x1='320' y1='40' x2='320' y2='75' stroke='#38bdf8' stroke-width='2'/>
    <circle cx='320' cy='90' r='14' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/>
    <text x='320' y='94' font-size='11' font-weight='bold' fill='#ffffff' text-anchor='middle'>A</text>
    
    <circle cx='350' cy='90' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
    <text x='350' y='93' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text>
    <line x1='320' y1='104' x2='320' y2='140' stroke='#38bdf8' stroke-width='2'/>

    
    <line x1='320' y1='140' x2='240' y2='140' stroke='#38bdf8' stroke-width='2'/>
    
    
    <g transform='translate(170, 130)'>
      <rect x='0' y='0' width='55' height='20' fill='#1e293b' stroke='#a855f7' stroke-width='1.8'/>
      <line x1='5' y1='25' x2='50' y2='-5' stroke='#a855f7' stroke-width='2'/>
      <polygon points='46,-9 54,-5 51,3' fill='#a855f7'/>
      
      <circle cx='27' cy='-18' r='8' fill='#1e293b' stroke='#a855f7' stroke-width='1.5'/>
      <text x='27' y='-15' font-size='9' font-weight='bold' fill='#a855f7' text-anchor='middle'>V</text>
    </g>

    <line x1='170' y1='140' x2='140' y2='140' stroke='#38bdf8' stroke-width='2'/>

    
    <g transform='translate(70, 130)'>
      <rect x='0' y='0' width='55' height='20' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/>
      
      <circle cx='27.5' cy='-12' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/>
      <text x='27.5' y='-9' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>IV</text>
    </g>

    <line x1='70' y1='140' x2='50' y2='140' stroke='#38bdf8' stroke-width='2'/>
    <line x1='50' y1='140' x2='50' y2='40' stroke='#38bdf8' stroke-width='2'/>

    
    <line x1='60' y1='140' x2='60' y2='180' stroke='#38bdf8' stroke-width='1.5'/>
    <line x1='135' y1='140' x2='135' y2='180' stroke='#38bdf8' stroke-width='1.5'/>
    <line x1='60' y1='180' x2='85' y2='180' stroke='#38bdf8' stroke-width='1.5'/>
    <circle cx='97' cy='180' r='12' fill='#1e293b' stroke='#10b981' stroke-width='2'/>
    <text x='97' y='184' font-size='11' font-weight='bold' fill='#ffffff' text-anchor='middle'>V</text>
    
    <circle cx='97' cy='204' r='8' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
    <text x='97' y='207' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>VI</text>
    <line x1='109' y1='180' x2='135' y2='180' stroke='#38bdf8' stroke-width='1.5'/>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(b): Soil Porosity and Drainage Experiment (JHS NaCCA Standard)
const svgQ1bSoilDrainage = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Soil A: Sandy Soil (High drainage, low retention) -->
    <g transform='translate(35, 20)'>
      <text x='40' y='12' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Soil A (Sandy)</text>
      <polygon points='10,25 70,25 45,60 45,78 35,78 35,60' fill='#d97706' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/>
      <circle cx='40' cy='60' r='3.5' fill='#ffffff'/>
      <rect x='22' y='78' width='36' height='90' fill='none' stroke='#38bdf8' stroke-width='1.5'/>
      <rect x='23' y='110' width='34' height='57' fill='#38bdf8' opacity='0.5'/>
      <text x='40' y='145' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>65 cm³</text>
    </g>

    <!-- Soil B: Loamy Soil (Moderate drainage) -->
    <g transform='translate(150, 20)'>
      <text x='40' y='12' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Soil B (Loamy)</text>
      <polygon points='10,25 70,25 45,60 45,78 35,78 35,60' fill='#a16207' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/>
      <circle cx='40' cy='60' r='3.5' fill='#ffffff'/>
      <rect x='22' y='78' width='36' height='90' fill='none' stroke='#38bdf8' stroke-width='1.5'/>
      <rect x='23' y='130' width='34' height='37' fill='#38bdf8' opacity='0.5'/>
      <text x='40' y='155' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>40 cm³</text>
    </g>

    <!-- Soil C: Clayey Soil (Lowest drainage, high retention) -->
    <g transform='translate(265, 20)'>
      <text x='40' y='12' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>Soil C (Clayey)</text>
      <polygon points='10,25 70,25 45,60 45,78 35,78 35,60' fill='#78350f' opacity='0.7' stroke='#38bdf8' stroke-width='1.5'/>
      <circle cx='40' cy='60' r='3.5' fill='#ffffff'/>
      <rect x='22' y='78' width='36' height='90' fill='none' stroke='#38bdf8' stroke-width='1.5'/>
      <rect x='23' y='150' width='34' height='17' fill='#38bdf8' opacity='0.5'/>
      <text x='40' y='163' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>15 cm³</text>
    </g>

    <text x='190' y='205' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>DRAINAGE COMPARISON: EQUAL VOLUMES OF WATER (100 cm³) ADDED TO EACH SAMPLE</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(c): Starch Test on Leaf (Decolorization & Iodine Reaction)
const svgQ1cStarchTest = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Stage 1: Water Bath with Ethanol (Left) -->
    <g transform='translate(30, 20)'>
      <line x1='15' y1='140' x2='35' y2='100' stroke='#64748b' stroke-width='2'/>
      <line x1='85' y1='140' x2='65' y2='100' stroke='#64748b' stroke-width='2'/>
      <line x1='25' y1='100' x2='75' y2='100' stroke='#94a3b8' stroke-width='2'/>
      <path d='M 50 140 Q 45 125 50 120 Q 55 125 50 140 Z' fill='#f59e0b'/>
      <rect x='25' y='45' width='50' height='55' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='15' y='55' font-size='7' fill='#38bdf8' text-anchor='end'>Water bath</text>
      <rect x='42' y='15' width='16' height='75' rx='3' fill='#10b981' opacity='0.3' stroke='#10b981' stroke-width='1.5'/>
      <path d='M 47 45 Q 52 55 47 65 Q 43 55 47 45 Z' fill='#15803d'/>
      <text x='62' y='25' font-size='8' font-weight='bold' fill='#10b981'>Boiling tube (Ethanol)</text>
      <text x='50' y='165' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Stage 1: Decolorize</text>
    </g>

    <!-- Stage 2: Iodine Test on White Tile (Right) -->
    <g transform='translate(220, 45)'>
      <ellipse cx='65' cy='75' rx='55' ry='25' fill='#ffffff' stroke='#94a3b8' stroke-width='1.5'/>
      <path d='M 30 75 C 45 60 85 60 100 75 C 85 90 45 90 30 75 Z' fill='#d97706' opacity='0.4' stroke='#78350f' stroke-width='1.5'/>
      <path d='M 45 75 C 55 65 75 65 85 75 C 75 85 55 85 45 75 Z' fill='#1e1b4b' stroke='#312e81' stroke-width='1.5'/>
      <text x='65' y='78' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Blue-Black</text>
      <text x='95' y='95' font-size='8' font-weight='bold' fill='#d97706'>Brown</text>

      <line x1='65' y1='5' x2='65' y2='35' stroke='#cbd5e1' stroke-width='3'/>
      <polygon points='63,35 67,35 65,45' fill='#d97706'/>
      <circle cx='65' cy='52' r='1.5' fill='#d97706'/>
      <text x='65' y='0' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Iodine solution</text>
      <text x='65' y='140' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Stage 2: Iodine Test</text>
    </g>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(d): Soil Profile Horizons
const svgQ1dSoilProfile = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 230' width='100%' height='210' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <g transform='translate(50, 15)'>
      <rect x='0' y='0' width='100' height='185' fill='#1e293b' stroke='#94a3b8' stroke-width='2'/>
      
      <!-- Horizon O -->
      <rect x='1' y='1' width='98' height='15' fill='#15803d' opacity='0.7'/>
      <line x1='100' y1='8' x2='135' y2='8' stroke='#10b981' stroke-width='1.5'/>
      <text x='140' y='12' font-size='9' font-weight='bold' fill='#10b981'>Horizon O (Humus / Litter)</text>

      <!-- Horizon A -->
      <rect x='1' y='16' width='98' height='40' fill='#78350f' opacity='0.85'/>
      <line x1='50' y1='0' x2='50' y2='35' stroke='#ffffff' stroke-width='1.5'/>
      <line x1='50' y1='20' x2='35' y2='32' stroke='#ffffff' stroke-width='1'/>
      <line x1='50' y1='25' x2='65' y2='38' stroke='#ffffff' stroke-width='1'/>
      <line x1='100' y1='36' x2='135' y2='36' stroke='#f59e0b' stroke-width='1.5'/>
      <text x='140' y='40' font-size='9' font-weight='bold' fill='#f59e0b'>Horizon A (Topsoil)</text>

      <!-- Horizon B -->
      <rect x='1' y='56' width='98' height='55' fill='#b45309' opacity='0.65'/>
      <line x1='100' y1='83' x2='135' y2='83' stroke='#fde047' stroke-width='1.5'/>
      <text x='140' y='87' font-size='9' font-weight='bold' fill='#fde047'>Horizon B (Subsoil)</text>

      <!-- Horizon C -->
      <rect x='1' y='111' width='98' height='42' fill='#64748b' opacity='0.6'/>
      <polygon points='20,120 30,115 28,128 15,125' fill='#94a3b8'/>
      <polygon points='60,130 72,125 68,140 55,138' fill='#94a3b8'/>
      <line x1='100' y1='132' x2='135' y2='132' stroke='#cbd5e1' stroke-width='1.5'/>
      <text x='140' y='136' font-size='9' font-weight='bold' fill='#cbd5e1'>Horizon C (Parent Material)</text>

      <!-- Horizon R -->
      <rect x='1' y='153' width='98' height='31' fill='#334155'/>
      <line x1='100' y1='168' x2='135' y2='168' stroke='#94a3b8' stroke-width='1.5'/>
      <text x='140' y='172' font-size='9' font-weight='bold' fill='#94a3b8'>Bedrock (Horizon R)</text>
    </g>

    <text x='170' y='218' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>MATURE SOIL PROFILE: STRATIFIED HORIZONS FROM ORGANIC LITTER TO BEDROCK</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// ==========================================
// 40 OBJECTIVE TEST QUESTIONS (CALIBRATED JHS NACCA BANK)
// ==========================================
const rawScienceBank: QuestionItem[] = [
  {
    number: 1,
    prompt: "In which part of the human alimentary canal is the chemical digestion of dietary lipids (fats and oils) initiated following bile emulsification?",
    correctAnswer: "The duodenum (first part of the small intestine)",
    distractors: [
      "The buccal mouth cavity",
      "The acidic stomach chamber",
      "The ascending large intestine (colon)"
    ],
    hint: "Bile from the gall bladder and pancreatic juice empty into this structure.",
    workedSolution: "Lipid digestion begins in the duodenum, where bile salts emulsify fats into smaller droplets and pancreatic lipase hydrolyzes them into fatty acids and glycerol.",
    points: 1
  },
  {
    number: 2,
    prompt: "Which of the following units in the International System of Units (S.I.) is a derived unit used to quantify mechanical power?",
    correctAnswer: "Watt [W = J s⁻¹]",
    distractors: [
      "Joule [J]",
      "Pascal [Pa]",
      "Newton [N]"
    ],
    hint: "The rate of doing work or transforming energy ($P = \\frac{W}{t}$).",
    workedSolution: "The Watt (W) is the derived S.I. unit of power ($1\\text{ W} = 1\\text{ J s}^{-1}$). Joules measure energy, Pascals measure pressure, and Newtons measure force.",
    points: 1
  },
  {
    number: 3,
    prompt: "A farmer notices that young tomato plants are exhibiting chlorosis (generalized yellowing of leaves starting from older foliage). This deficiency symptom is caused by a soil deficit of:",
    correctAnswer: "Nitrogen [N]",
    distractors: [
      "Phosphorus [P]",
      "Potassium [K]",
      "Calcium [Ca]"
    ],
    hint: "An essential constituent element of the green chlorophyll molecule.",
    workedSolution: "Nitrogen is a structural component of chlorophyll and amino acids. Nitrogen deficiency impairs chlorophyll synthesis, causing chlorosis (yellowing of foliage).",
    points: 1
  },
  {
    number: 4,
    prompt: "When white sunlight passes obliquely from air into a triangular glass prism, it spreads into a spectrum of colors. This optical phenomenon is known as:",
    correctAnswer: "Dispersion of light",
    distractors: [
      "Total internal reflection",
      "Linear polarization",
      "Diffraction of light"
    ],
    hint: "Different wavelengths refract through different angles according to their refractive index.",
    workedSolution: "Dispersion is the separation of white light into its component spectral colors (ROYGBIV) because different light wavelengths refract through different angles in glass.",
    points: 1
  },
  {
    number: 5,
    prompt: "A clinical patient's resting blood pressure reading is recorded as $155/100\\text{ mmHg}$. This reading is classified clinically as:",
    correctAnswer: "Hypertension (high blood pressure)",
    distractors: [
      "Normal resting normotension",
      "Acute clinical hypotension",
      "Severe hypoglycemia"
    ],
    hint: "Standard normal pressure is $\\approx 120/80\\text{ mmHg}$; values $\\ge 140/90\\text{ mmHg}$ indicate hypertension.",
    workedSolution: "Normal adult blood pressure is approximately $120/80\\text{ mmHg}$. Systolic $\\ge 140\\text{ mmHg}$ or diastolic $\\ge 90\\text{ mmHg}$ represents clinical hypertension.",
    points: 1
  },
  {
    number: 6,
    prompt: "What is the systematic chemical formula for the binary ionic compound formed between Magnesium ($Z=12$) and Oxygen ($Z=8$)?",
    correctAnswer: "MgO",
    distractors: [
      "Mg₂O",
      "MgO₂",
      "Mg₂O₃"
    ],
    hint: "Magnesium loses 2 electrons ($\\text{Mg}^{2+}$) and Oxygen gains 2 electrons ($\\text{O}^{2-}$).",
    workedSolution: "Magnesium ($\\text{Mg}^{2+}$) and Oxide ($\\text{O}^{2-}$) combine in a 1:1 stoichiometric ratio to form neutral magnesium oxide ($\\text{MgO}$).",
    points: 1
  },
  {
    number: 7,
    prompt: "In eukaryotic cell biology, which membrane-bound organelle is known as the 'powerhouse of the cell' where aerobic cellular respiration generates ATP?",
    correctAnswer: "Mitochondrion",
    distractors: [
      "Ribosome",
      "Endoplasmic reticulum",
      "Golgi apparatus"
    ],
    hint: "Contains folded cristae where cellular respiration reactions take place.",
    workedSolution: "Mitochondria oxidize glucose derivatives during cellular respiration to generate metabolic ATP energy. Ribosomes synthesize proteins.",
    points: 1
  },
  {
    number: 8,
    prompt: "A machine with an applied effort force of $40.0\\text{ N}$ overcomes an opposing load weight of $160.0\\text{ N}$. Calculate the Mechanical Advantage ($MA$) of the machine:",
    correctAnswer: "4.0",
    distractors: [
      "0.25",
      "8.0",
      "200.0"
    ],
    hint: "$$MA = \\frac{\\text{Load}}{\\text{Effort}} = \\frac{160.0}{40.0}$$.",
    workedSolution: "$$\\text{Mechanical Advantage } (MA) = \\frac{\\text{Load } (L)}{\\text{Effort } (E)} = \\frac{160.0\\text{ N}}{40.0\\text{ N}} = 4.0$$.",
    points: 1
  },
  {
    number: 9,
    prompt: "Which of the following air pollutants is an odorless, colorless, highly toxic gas formed by the incomplete combustion of hydrocarbon fuels?",
    correctAnswer: "Carbon monoxide [CO]",
    distractors: [
      "Carbon dioxide [CO₂]",
      "Sulfur dioxide [SO₂]",
      "Nitrogen dioxide [NO₂]"
    ],
    hint: "Binds irreversibly with blood hemoglobin to form carboxyhemoglobin, suffocating tissues.",
    workedSolution: "Carbon monoxide ($\\text{CO}$) forms during incomplete combustion. It binds to hemoglobin with an affinity 200 times greater than oxygen, causing tissue hypoxia.",
    points: 1
  },
  {
    number: 10,
    prompt: "In solid-state semiconductor electronics, a semiconductor crystal doped with impurity atoms to supply excess conduction electrons is:",
    correctAnswer: "An n-type semiconductor",
    distractors: [
      "A p-type semiconductor",
      "An intrinsic pure semiconductor",
      "A dielectric insulator"
    ],
    hint: "Possesses negative free electrons as majority charge carriers.",
    workedSolution: "Doping tetravalent silicon with pentavalent atoms provides extra free conduction electrons, forming an n-type (negative) semiconductor.",
    points: 1
  },
  {
    number: 11,
    prompt: "Which laboratory separation method is used to separate two miscible liquids with different boiling points, such as ethanol and water?",
    correctAnswer: "Fractional distillation",
    distractors: [
      "Using a separating funnel",
      "Gravity filtration",
      "Paper chromatography"
    ],
    hint: "Uses a fractionating column to separate vapors based on boiling points.",
    workedSolution: "Fractional distillation separates miscible liquids based on boiling point differences (ethanol boils at $78^\\circ\\text{C}$, water at $100^\\circ\\text{C}$). Separating funnels separate immiscible liquids.",
    points: 1
  },
  {
    number: 12,
    prompt: "An electric iron rated $1,200.0\\text{ W}$ is operated for $2.5\\text{ hours}$. Calculate the electrical energy consumed in kilowatt-hours (kWh):",
    correctAnswer: "3.0 kWh",
    distractors: [
      "0.48 kWh",
      "30.0 kWh",
      "3,000.0 kWh"
    ],
    hint: "$$\\text{Power in kW} = \\frac{1,200}{1,000} = 1.2\\text{ kW}$$. $$\\text{Energy} = P \\times t = 1.2 \\times 2.5$$.",
    workedSolution: "$$\\text{Power} = 1.2\\text{ kW}$$. $$\\text{Energy} = P \\times t = 1.2\\text{ kW} \\times 2.5\\text{ h} = 3.0\\text{ kWh}$$.",
    points: 1
  },
  {
    number: 13,
    prompt: "Which waterborne gastrointestinal infection is caused by the bacterium Vibrio cholerae, causing severe watery diarrhea and rapid dehydration?",
    correctAnswer: "Cholera",
    distractors: [
      "Typhoid fever",
      "Amoebic dysentery",
      "Bilharzia"
    ],
    hint: "Transmitted via water or food contaminated with human feces.",
    workedSolution: "Cholera is an acute diarrheal infection caused by ingestion of food or water contaminated with the bacterium *Vibrio cholerae*.",
    points: 1
  },
  {
    number: 14,
    prompt: "What is the ground-state Bohr electronic configuration of an atom of Chlorine ($_{17}\\text{Cl}$)?",
    correctAnswer: "2, 8, 7",
    distractors: [
      "2, 8, 8",
      "2, 7, 8",
      "2, 8, 18, 7"
    ],
    hint: "Fills 2 in K-shell, 8 in L-shell, and 7 valence electrons in M-shell.",
    workedSolution: "Chlorine has 17 electrons: 2 in the first shell, 8 in the second shell, and 7 valence electrons in the third shell ($2, 8, 7$).",
    points: 1
  },
  {
    number: 15,
    prompt: "In simple machine mechanics, which of the following everyday tools is an example of a first-class lever?",
    correctAnswer: "A pair of tailoring scissors",
    distractors: [
      "A wheelbarrow",
      "A crown-cap bottle opener",
      "A pair of sugar tongs"
    ],
    hint: "The central pivot (screw) is situated between the handles (effort) and cutting blades (load).",
    workedSolution: "In a Class 1 lever, the fulcrum lies between the effort and load (e.g., scissors, crowbar). Bottle openers and wheelbarrows are Class 2; sugar tongs are Class 3.",
    points: 1
  },
  {
    number: 16,
    prompt: "Which textural property of soil is determined in the field by rubbing a moist sample between the thumb and forefingers?",
    correctAnswer: "Soil texture (feel method)",
    distractors: [
      "Soil structure",
      "Soil bulk density",
      "Soil cation exchange capacity"
    ],
    hint: "Detects grittiness (sand), silkiness (silt), or stickiness (clay).",
    workedSolution: "The finger feel method assesses soil texture: sand feels gritty, silt feels silky and smooth, and clay feels sticky and plastic.",
    points: 1
  },
  {
    number: 17,
    prompt: "Which blood vessels possess thin muscular walls, wide lumens, and internal pocket valves to prevent the backflow of blood?",
    correctAnswer: "Veins",
    distractors: [
      "Arteries",
      "Arterioles",
      "Capillaries"
    ],
    hint: "Convey deoxygenated blood under low pressure back to the heart.",
    workedSolution: "Veins convey blood under low pressure back to the heart; they possess wide lumens and semilunar valves to prevent backflow. Arteries have thick muscular walls and no valves.",
    points: 1
  },
  {
    number: 18,
    prompt: "When solid ammonium chloride ($\\text{NH}_4\\text{Cl}$) is heated gently in a dry boiling tube, it converts directly into vapor without forming a liquid. This phase change is:",
    correctAnswer: "Sublimation",
    distractors: [
      "Condensation",
      "Thermal melting",
      "Crystallization"
    ],
    hint: "Direct phase transition from solid to gas.",
    workedSolution: "Sublimation is the direct transition of a substance from solid to gas without passing through a liquid state (e.g., ammonium chloride, camphor, dry ice).",
    points: 1
  },
  {
    number: 19,
    prompt: "What is the primary visual function performed by the photoreceptor cone cells embedded in the human retina?",
    correctAnswer: "Color vision and high-acuity detailed vision in bright light",
    distractors: [
      "Monochromatic vision in dim twilight conditions",
      "Regulating intraocular fluid pressure",
      "Lubricating the anterior corneal surface"
    ],
    hint: "Rods function in dim light; cones perceive red, green, and blue light.",
    workedSolution: "Cone cells operate in bright light to provide color vision and high visual acuity, concentrated in the fovea. Rods provide black-and-white vision in dim light.",
    points: 1
  },
  {
    number: 20,
    prompt: "What color change is observed when blue litmus paper is dipped into freshly squeezed citrus lemon juice?",
    correctAnswer: "Turns red (due to acidic citric acid, pH < 7)",
    distractors: [
      "Remains blue without change",
      "Turns deep purple",
      "Turns bright green"
    ],
    hint: "Acids turn blue litmus paper red.",
    workedSolution: "Lemon juice contains organic citric and ascorbic acids ($pH \\approx 2-3$). Acids turn blue litmus paper red.",
    points: 1
  },
  {
    number: 21,
    prompt: "In a grazing food chain: $\\text{Grass} \\to \\text{Grasshopper} \\to \\text{Toad} \\to \\text{Snake} \\to \\text{Hawk}$, the toad occupies the trophic level of:",
    correctAnswer: "Secondary consumer [Trophic Level 3]",
    distractors: [
      "Primary producer",
      "Primary consumer",
      "Tertiary consumer"
    ],
    hint: "Grass is producer, grasshopper is primary consumer (herbivore), toad eats grasshopper.",
    workedSolution: "Grass is producer (Level 1), grasshopper is primary consumer (Level 2), and toad is secondary consumer (Level 3, carnivore feeding on herbivore).",
    points: 1
  },
  {
    number: 22,
    prompt: "A horizontal pulling force of $80.0\\text{ N}$ drags a cart through a distance of $5.0\\text{ m}$. Calculate the work done on the cart:",
    correctAnswer: "400.0 Joules",
    distractors: [
      "16.0 Joules",
      "85.0 Joules",
      "800.0 Joules"
    ],
    hint: "$$\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (d) = 80.0 \\times 5.0$$.",
    workedSolution: "$$\\text{Work Done } (W) = F \\times d = 80.0\\text{ N} \\times 5.0\\text{ m} = 400.0\\text{ Joules (J)}$$.",
    points: 1
  },
  {
    number: 23,
    prompt: "Which of the following agricultural practices is used to control and prevent severe water erosion on steep hillside farmlands?",
    correctAnswer: "Terracing and contour bunding across the slope",
    distractors: [
      "Clean weeding and leaving topsoil bare",
      "Continuous down-slope tractor ploughing",
      "Overgrazing with cattle"
    ],
    hint: "Constructing stepped horizontal ridges breaks the velocity of surface runoff.",
    workedSolution: "Terracing and contour ploughing create stepped horizontal platforms perpendicular to the slope, reducing runoff velocity and promoting water infiltration to prevent erosion.",
    points: 1
  },
  {
    number: 24,
    prompt: "In modern physics, the central atomic nucleus of a neutral atom is composed of which two subatomic particles?",
    correctAnswer: "Protons and neutrons",
    distractors: [
      "Electrons and protons",
      "Electrons and neutrons",
      "Positrons and orbital shells"
    ],
    hint: "Collectively termed nucleons.",
    workedSolution: "The atomic nucleus contains positively charged protons and uncharged neutrons. Negatively charged electrons orbit in concentric shells around the nucleus.",
    points: 1
  },
  {
    number: 25,
    prompt: "What is the stoichiometric empirical formula of Calcium oxide?",
    correctAnswer: "CaO",
    distractors: [
      "Ca₂O",
      "CaO₂",
      "Ca₂O₂"
    ],
    hint: "Calcium cation ($\\text{Ca}^{2+}$) balances oxide anion ($\\text{O}^{2-}$).",
    workedSolution: "Calcium has a valency of $+2$ and Oxygen has a valency of $-2$. Combining in a 1:1 ratio yields the empirical formula $\\text{CaO}$.",
    points: 1
  },
  {
    number: 26,
    prompt: "Which of the following agricultural crops is botanically propagated on farmlands using lateral sword suckers?",
    correctAnswer: "Plantain [Musa paradisiaca] and Banana",
    distractors: [
      "Cassava storage root",
      "Yellow maize seed",
      "Onion layered bulb"
    ],
    hint: "Underground corms sprout lateral shoots known as suckers.",
    workedSolution: "Plantains and bananas are propagated vegetatively using sword suckers produced from subterranean corms, as commercial varieties do not produce viable seeds.",
    points: 1
  },
  {
    number: 27,
    prompt: "When solid common salt dissolves in water, the resulting mixture is transparent and passes completely through filter paper. This mixture is:",
    correctAnswer: "A homogeneous true solution",
    distractors: [
      "A heterogeneous suspension",
      "A colloidal emulsion",
      "A permanent chemical compound"
    ],
    hint: "Solute particles dissolve at the ionic level ($< 1\\text{ nm}$) in a single phase.",
    workedSolution: "Salt dissolves into hydrated $\\text{Na}^+$ and $\\text{Cl}^-$ ions dispersed uniformly throughout water, forming a single-phase homogeneous solution.",
    points: 1
  },
  {
    number: 28,
    prompt: "An electric heating element has a resistance of $20.0\\ \\Omega$ and draws an electric current of $5.0\\text{ A}$. Determine the potential difference across the element:",
    correctAnswer: "100.0 V",
    distractors: [
      "4.0 V",
      "25.0 V",
      "500.0 V"
    ],
    hint: "By Ohm's Law: $V = I \\times R = 5.0 \\times 20.0$.",
    workedSolution: "By Ohm's Law: $V = I \\times R = 5.0\\text{ A} \\times 20.0\\ \\Omega = 100.0\\text{ Volts (V)}$.",
    points: 1
  },
  {
    number: 29,
    prompt: "Which atmospheric gas is absorbed by green plants through leaf stomata to manufacture food (glucose) during photosynthesis?",
    correctAnswer: "Carbon dioxide [CO₂]",
    distractors: [
      "Molecular nitrogen [N₂]",
      "Inert argon gas [Ar]",
      "Carbon monoxide [CO]"
    ],
    hint: "Absorbed from the surrounding air through microscopic pores on leaves called stomata.",
    workedSolution: "Carbon dioxide ($\\text{CO}_2$) is absorbed from atmospheric air through leaf stomata and combined with water in chloroplasts during photosynthesis to synthesize glucose.",
    points: 1
  },
  {
    number: 30,
    prompt: "Which anti-corrosion method protects structural iron and steel by coating them with a thin layer of molten metallic zinc?",
    correctAnswer: "Galvanization",
    distractors: [
      "Electroplating with tin",
      "Surface greasing",
      "Enamel painting"
    ],
    hint: "Zinc acts as a sacrificial anode to protect underlying steel from oxidation.",
    workedSolution: "Galvanizing coats iron or steel with a protective layer of zinc, which serves as a physical barrier and sacrificial anode to prevent rusting.",
    points: 1
  },
  {
    number: 31,
    prompt: "Which of the following human bodily actions is an involuntary protective reflex mediated through a spinal reflex arc?",
    correctAnswer: "Instantly withdrawing the hand after touching a hot stove",
    distractors: [
      "Writing answers in an examination booklet",
      "Singing an anthem during assembly",
      "Chewing food during lunch"
    ],
    hint: "Occurs rapidly and automatically without prior conscious thought.",
    workedSolution: "Withdrawing a hand from a hot object is an involuntary reflex arc mediated by the spinal cord to protect against burns. Writing, singing, and chewing are voluntary.",
    points: 1
  },
  {
    number: 32,
    prompt: "In a hydraulic lift or simple machine, the mechanical Velocity Ratio ($VR$) is defined as the ratio of the:",
    correctAnswer: "Distance moved by Effort to Distance moved by Load [d_E / d_L]",
    distractors: [
      "Load force to applied Effort force",
      "Work output to work input",
      "Momentum to linear acceleration"
    ],
    hint: "$$VR = \\frac{\\text{Effort displacement}}{\\text{Load displacement}}$$.",
    workedSolution: "Velocity Ratio ($VR$) is the ratio of the distance moved by the effort to the distance moved by the load in the same time interval ($VR = \\frac{d_E}{d_L}$).",
    points: 1
  },
  {
    number: 33,
    prompt: "Which of the following celestial bodies in our Solar System is classified as a Jovian gas giant planet?",
    correctAnswer: "Planet Jupiter",
    distractors: [
      "Planet Mercury",
      "Planet Venus",
      "Planet Mars"
    ],
    hint: "A massive outer planet composed primarily of hydrogen and helium fluids.",
    workedSolution: "Jupiter, Saturn, Uranus, and Neptune are outer Jovian gas giants. Mercury, Venus, Earth, and Mars are rocky terrestrial inner planets.",
    points: 1
  },
  {
    number: 34,
    prompt: "Which component of human blood plasma is primarily responsible for the transport of dissolved glucose, amino acids, and metabolic urea?",
    correctAnswer: "Liquid blood plasma [watery fraction]",
    distractors: [
      "Red blood cells (Erythrocytes)",
      "White blood cells (Leukocytes)",
      "Blood platelets (Thrombocytes)"
    ],
    hint: "The yellowish liquid matrix of blood constituting ~55% of blood volume.",
    workedSolution: "Blood plasma is the liquid transport medium carrying dissolved nutrients (glucose, amino acids), hormones, mineral ions, and metabolic wastes (urea).",
    points: 1
  },
  {
    number: 35,
    prompt: "When solid sodium hydroxide pellets dissolve in water, the reaction beaker becomes hot to the touch. This dissolution process is classified as:",
    correctAnswer: "An exothermic process [releasing thermal energy to surroundings]",
    distractors: [
      "An endothermic process",
      "A nuclear fission event",
      "A reversible sublimation"
    ],
    hint: "Releases heat energy, raising the temperature of the solution.",
    workedSolution: "Dissolving sodium hydroxide in water releases hydration energy ($\\Delta H < 0$), raising the temperature of the solution and demonstrating an exothermic process.",
    points: 1
  },
  {
    number: 36,
    prompt: "In agricultural crop husbandry, vegetable nursery beds in low-lying, flood-prone farmland are constructed as:",
    correctAnswer: "Elevated raised nursery beds",
    distractors: [
      "Sunken nursery beds",
      "Flat level beds",
      "Unprepared open trenches"
    ],
    hint: "Raised beds facilitate gravitational drainage, preventing waterlogging and root rot.",
    workedSolution: "Raised beds are elevated 15–20 cm above ground level to facilitate gravity drainage in flood-prone areas, preventing waterlogging and damping-off disease.",
    points: 1
  },
  {
    number: 37,
    prompt: "In flowering plant reproduction, which anatomical part of the flower receives pollen grains during pollination?",
    correctAnswer: "The receptive stigma of the carpel",
    distractors: [
      "The slender filament",
      "The pollen-bearing anther",
      "The green sepal calyx"
    ],
    hint: "The sticky, receptive apical surface of the female pistil/carpel.",
    workedSolution: "The stigma is the sticky apical structure of the carpel (pistil) specialized to capture and hydrate pollen grains during pollination.",
    points: 1
  },
  {
    number: 38,
    prompt: "Which electrical safety device contains a thin metal wire of low melting point that melts to break the circuit when current exceeds a safe limit?",
    correctAnswer: "An electrical fuse",
    distractors: [
      "A step-up transformer",
      "A three-pin plug casing",
      "A variable rheostat"
    ],
    hint: "Protects household appliances from overcurrent and electrical fires.",
    workedSolution: "A fuse contains a low-melting-point alloy wire that melts when current exceeds its amperage rating, opening the circuit to prevent fires and equipment damage.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which process describes the movement of water molecules through a semi-permeable membrane from a dilute solution into a concentrated solution?",
    correctAnswer: "Osmosis",
    distractors: [
      "Active transport",
      "Gaseous diffusion",
      "Sedimentation"
    ],
    hint: "The net movement of water along a water potential gradient across a selectively permeable barrier.",
    workedSolution: "Osmosis is the net diffusion of water molecules from a region of higher water potential (dilute) to lower water potential (concentrated) across a selectively permeable membrane.",
    points: 1
  },
  {
    number: 40,
    prompt: "Why do trees and crops shed their leaves during dry harmattan seasons in West Africa?",
    correctAnswer: "To reduce transpiring surface area and conserve internal water reserves",
    distractors: [
      "To prevent damage from bushfires",
      "To accelerate photosynthesis in the stems",
      "To attract herbivorous cattle"
    ],
    hint: "Leaves lose water through stomatal transpiration; shedding leaves prevents desiccation.",
    workedSolution: "Shedding leaves eliminates stomatal transpiration, allowing plants to conserve internal water when soil moisture is depleted during the dry season.",
    points: 1
  }
];

// Target permutation ensuring exactly 10 A, 10 B, 10 C, 10 D
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

const assignedTargetIndices = seedShuffle(targetKeys, 202702);

const balancedMock2P1 = rawScienceBank.map((q, idx) => {
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
// PAPER 2 ESSAY QUESTIONS BANK (CALIBRATED JHS NACCA)
// ==========================================
const paper2Mock2Questions = [
  // ==========================================
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Figure 1(a) illustrates an electrical laboratory circuit diagram set up to verify Ohm's law across an unknown resistor:

${svgQ1aOhmsLawCircuit}

(i) Name each of the circuit components labelled I, II, III, IV, V, and VI.
(ii) State the specific functions of components III, V, and VI.
(iii) When circuit switch II is closed, ammeter III reads $0.5\\text{ A}$ and voltmeter VI reads $3.0\\text{ V}$. Calculate the electrical resistance of resistor IV.
(iv) State two precautions that must be taken when setting up this circuit to protect the meters and obtain accurate readings.`,
        workedSolution: `(i) Names of components:
• Component I: DC Chemical Battery (two dry cells in series)
• Component II: Key / Switch (circuit interrupter)
• Component III: Ammeter (measuring electric current in series)
• Component IV: Unknown fixed Resistor
• Component V: Rheostat (variable resistor)
• Component VI: Voltmeter (measuring potential difference in parallel)

(ii) Functions of components:
• Ammeter III: Measures the magnitude of electric current flowing through the circuit in Amperes (A).
• Rheostat V: Adjusts total circuit resistance to vary current and potential difference across resistor IV.
• Voltmeter VI: Measures electrical potential difference across resistor IV in Volts (V).

(iii) Resistance calculation:
Formula (Ohm's Law):
$$R = \\frac{V}{I}$$
Substitute given values ($V = 3.0\\text{ V}$, $I = 0.5\\text{ A}$):
$$R = \\frac{3.0\\text{ V}}{0.5\\text{ A}} = 6.0\\ \\Omega$$
Answer: The resistance of component IV is **6.0 Ω**.

(iv) Experimental precautions:
1. Connect the ammeter in series and the voltmeter in parallel across resistor IV.
2. Observe proper terminal polarity: connect positive meter terminals toward the positive battery terminal.
3. Open switch II immediately after taking readings to avoid continuous current discharge and heating of the resistor.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `Figure 1(b) illustrates an experimental setup to compare the drainage and water retention capacities of three soil samples A, B, and C:

${svgQ1bSoilDrainage}

(i) Name each of the soil types represented by samples A, B, and C.
(ii) State which soil sample has the:
  (α) Highest water-holding capacity;
  (β) Highest rate of drainage.
(iii) If $100.0\\text{ cm}^3$ of water was poured into funnel B and $40.0\\text{ cm}^3$ of water drained into the measuring cylinder, calculate the volume of water retained by soil B.
(iv) State two agricultural reasons why soil B is considered ideal for commercial crop farming.`,
        workedSolution: `(i) Names of soil types:
• Soil A: **Sandy soil** (coarse particles, high percolation)
• Soil B: **Loamy soil** (balanced texture, moderate drainage)
• Soil C: **Clayey soil** (fine particles, high retention)

(ii) Retention and drainage:
• (α) Highest water-holding capacity: **Soil C (Clayey soil)** — retains $85\\text{ cm}^3$ of water.
• (β) Highest rate of drainage: **Soil A (Sandy soil)** — drains $65\\text{ cm}^3$ of water.

(iii) Water retention calculation for Soil B:
$$\\text{Volume retained} = \\text{Volume added} - \\text{Volume drained}$$
$$\\text{Volume retained} = 100.0\\text{ cm}^3 - 40.0\\text{ cm}^3 = 60.0\\text{ cm}^3$$
Answer: Soil B retained **60.0 cm³** of water.

(iv) Why Loamy Soil (B) is ideal for crops:
1. Contains a balanced blend of sand, silt, and clay that retains adequate moisture without waterlogging.
2. Highly aerated, allowing root respiration and beneficial microbial activity.
3. Rich in organic humus that supplies nutrients to crops.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `Figure 1(c) illustrates two experimental stages performed in a laboratory to test a green-and-white variegated leaf for starch following several hours of sunlight exposure:

${svgQ1cStarchTest}

(i) State the specific purpose of:
  (α) Boiling the leaf in water for 1 minute before Stage 1;
  (β) Boiling the leaf in ethanol over a water bath in Stage 1;
  (γ) Dipping the decolorized leaf in warm water before Stage 2.
(ii) State the safety precaution that must be strictly observed when heating ethanol in Stage 1, giving a scientific reason.
(iii) State the observable color changes on the green part and the white part of the variegated leaf after adding iodine solution in Stage 2.
(iv) What conclusion can be drawn from this experiment?`,
        workedSolution: `(i) Purpose of stages:
• (α) Boiling in water: Kills leaf cells, stops enzymatic reactions, and ruptures cell membranes to allow chemical penetration.
• (β) Boiling in ethanol: Dissolves and extracts green chlorophyll pigments from chloroplasts, decolorizing the leaf so color changes with iodine are visible.
• (γ) Dipping in warm water: Softens the brittle leaf after boiling in alcohol, making it pliable for spreading on the tile.

(ii) Safety precaution:
Ethanol must **never be heated directly over an open Bunsen flame**; it must be heated in a boiling tube placed inside a **water bath**. Ethanol is highly flammable and its vapors ignite easily.

(iii) Observations with iodine solution:
• Originally green region: **Turns blue-black** (confirming starch presence).
• Originally white region: **Remains yellow-brown / brown** (no starch).

(iv) Conclusion:
Chlorophyll is strictly necessary for photosynthesis to synthesize starch.`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `Figure 1(d) is an illustration of a vertical section through a mature agricultural soil profile showing horizons O, A, B, C, and R:

${svgQ1dSoilProfile}

(i) Name each of the horizons labelled O, A, B, C, and R.
(ii) State two characteristics of Horizon A that make it the most critical zone for crop growth.
(iii) Distinguish between Horizon A (topsoil) and Horizon B (subsoil) in terms of color and organic matter content.
(iv) Explain briefly how Horizon C (weathered parent rock) is formed from Bedrock R.`,
        workedSolution: `(i) Soil Horizons:
• Horizon O: Organic litter layer (humus and decomposing leaves)
• Horizon A: Topsoil
• Horizon B: Subsoil (zone of accumulation / illuviation)
• Horizon C: Weathered parent material (broken rock fragments)
• Horizon R: Unweathered solid Bedrock

(ii) Characteristics of Horizon A (Topsoil):
1. Rich in decomposed organic matter (humus), giving it high fertility and dark coloration.
2. Contains the highest concentration of plant roots, air pores, and beneficial microorganisms (bacteria, earthworms).

(iii) Topsoil (A) vs. Subsoil (B):
• **Horizon A:** Darker in color, crumbly texture, rich in humus, and highly aerated.
• **Horizon B:** Lighter in color (brown, reddish, or yellowish), more compact, contains accumulated clay and leached mineral oxides, and has low humus content.

(iv) Formation of Horizon C:
Formed by the **weathering** of underlying bedrock (R) through physical processes (temperature fluctuations, frost action) and chemical processes (hydration, carbonation, oxidation) that fracture solid rock into loose mineral fragments *in situ*.`,
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
        prompt: `(i) Differentiate between renewable energy sources and non-renewable energy sources, providing two examples of each.
(ii) State two advantages of using biogas over firewood as a domestic cooking fuel in rural communities.`,
        workedSolution: `(i) Renewable vs. Non-Renewable Energy:
• **Renewable Energy:** Naturally replenishing energy resources that are not depleted by sustainable human consumption (e.g., Solar radiation, Wind energy, Hydroelectric power, Biogas).
• **Non-Renewable Energy:** Finite terrestrial energy resources that exist in fixed reserves and cannot be replenished on a human timescale once consumed (e.g., Crude petroleum oil, Coal, Natural gas).

(ii) Advantages of Biogas:
1. **Reduces Deforestation:** Decreases reliance on firewood, protecting forest reserves from degradation.
2. **Clean & Smoke-Free:** Burns with a clean blue flame without producing soot or indoor particulate smoke, reducing respiratory illnesses.
3. **Nutrient Recycling:** Generates nutrient-rich bio-slurry that can be used directly as organic fertilizer for crops.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `(i) State the specific safety function performed by each of the following components in domestic electrical wiring:
  (α) The Earth wire;
  (β) The electrical fuse.
(ii) An electric water heater rated at $2,400.0\\text{ W}$ is connected to a $240.0\\text{ V}$ mains supply. Calculate:
  (α) The electric current drawn by the heater;
  (β) The appropriate fuse rating (choose from $5\\text{ A}, 10\\text{ A}, 13\\text{ A}$, or $15\\text{ A}$) to protect this appliance.`,
        workedSolution: `(i) Safety functions:
• (α) Earth wire: Directs stray electrical current safely into the ground if a live wire contacts the appliance's metal chassis, preventing fatal electric shocks.
• (β) Electrical fuse: Contains a low-melting-point wire that melts when current exceeds its rated amperage, breaking the circuit to prevent electrical fires and equipment damage.

(ii) Calculations:
• (α) Current drawn:
$$I = \\frac{P}{V} = \\frac{2,400.0\\text{ W}}{240.0\\text{ V}} = 10.0\\text{ Amperes (A)}$$
Answer: Current is **10.0 A**.

• (β) Appropriate fuse rating:
A fuse rating must be slightly higher than the operating current to avoid blowing during normal operation.
Answer: The **13 A fuse** is the appropriate choice (a 10 A fuse would blow at normal operating current).`,
        maxMarks: 8
      },
      {
        subId: "(c)",
        prompt: "Describe three adverse environmental impacts of an offshore crude oil spill on marine coastal ecosystems in Ghana.",
        workedSolution: `1. **Smothers Marine Life:** Crude oil forms a thick surface slick that coats fish gills, blocks light penetration needed by phytoplankton, and suffocates aquatic organisms.
2. **Destroys Avian Plumage:** Oil coats seabird feathers, destroying their waterproofing and buoyancy, leading to drowning or hypothermia.
3. **Destroys Mangroves & Spawning Grounds:** Oil coats coastal mangrove roots, blocking gas exchange and destroying nursery habitats for fish and crabs.
4. **Economic Ruin for Fishing Communities:** Contaminates fishing nets, kills fish stocks, and disrupts livelihoods in coastal fishing towns.`,
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
        prompt: `State one digestive enzyme responsible for hydrolyzing each of the following food macronutrients, naming the gland that secretes it and the final product formed:
(i) Cooked starch;
(ii) Dietary proteins in the stomach;
(iii) Emulsified fats and oils.`,
        workedSolution: `(i) Cooked Starch:
• Enzyme: **Salivary amylase (Ptyalin)** [or Pancreatic amylase]
• Secretory Gland: **Salivary glands** [or Pancreas]
• Final Product: **Maltose** (subsequently glucose in the ileum)

(ii) Dietary Proteins:
• Enzyme: **Pepsin**
• Secretory Gland: **Gastric glands (in stomach wall)**
• Final Product: **Peptides / Polypeptides** (subsequently amino acids)

(iii) Emulsified Lipids:
• Enzyme: **Pancreatic lipase**
• Secretory Gland: **Pancreas**
• Final Product: **Fatty acids and glycerol**`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `(i) Explain why human systemic blood circulation is described as a 'double circulation'.
(ii) In a clear tabular format, state three anatomical differences between an artery and a vein.`,
        workedSolution: `(i) Double Circulation:
Blood passes through the heart **twice** during one complete circuit around the body:
1. **Pulmonary Circulation:** Deoxygenated blood is pumped from the right ventricle to the lungs for oxygenation and returns to the left atrium.
2. **Systemic Circulation:** Oxygenated blood is pumped from the left ventricle to body tissues and returns deoxygenated to the right atrium.

(ii) Artery vs. Vein Distinction Table:

| Feature | Artery | Vein |
| :--- | :--- | :--- |
| **Direction of Flow** | Conveys blood **away from the heart** | Conveys blood **toward the heart** |
| **Blood Pressure** | High hydrostatic pressure | Low hydrostatic pressure |
| **Vessel Wall** | Thick, muscular, elastic walls | Thinner walls with less muscle |
| **Lumen Size** | Relatively **narrow lumen** | Relatively **wide lumen** |
| **Internal Valves** | **No valves** (except aorta/pulmonary bases) | **Possesses valves** to prevent backflow |`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `(i) A heterozygous carrier father for the sickle-cell trait ($HbAS$) marries a heterozygous carrier mother ($HbAS$). Using a genetic cross diagram, determine the probability of them having a child suffering from sickle-cell anemia ($HbSS$).
(ii) State three stages involved in the large-scale purification of municipal drinking water.`,
        workedSolution: `(i) Genetic Cross:
• Parental Genotypes: $HbAS \\times HbAS$
• Gametes: $Hb^A, Hb^S$ and $Hb^A, Hb^S$
• Punnett Square:
  | Gametes | $Hb^A$ | $Hb^S$ |
  | :---: | :---: | :---: |
  | **$Hb^A$** | $HbAA$ (Normal) | $HbAS$ (Carrier) |
  | **$Hb^S$** | $HbAS$ (Carrier) | $HbSS$ (Sickle-Cell Disease) |
• Genotypic Ratio: $1\\ HbAA : 2\\ HbAS : 1\\ HbSS$
• Probability of a sick child ($HbSS$):
$$\\text{Probability} = \\frac{1}{4} = 25\\%$$
Answer: The probability is **25% (or 1 in 4)**.

(ii) Municipal Water Treatment Stages:
1. **Coagulation / Flocculation & Sedimentation:** Adding alum to bind suspended dirt into flocs, which settle by gravity.
2. **Filtration:** Passing water through sand and gravel filters to remove fine suspended particles.
3. **Disinfection / Chlorination:** Adding chlorine gas or sodium hypochlorite to destroy pathogenic bacteria.`,
        maxMarks: 7
      }
    ]
  },
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Consider the elements Lithium ($_{3}\\text{Li}$), Sodium ($_{11}\\text{Na}$), and Potassium ($_{19}\\text{K}$):
(i) State the common group name for these elements in the Periodic Table.
(ii) Write down their electronic configurations.
(iii) State the number of valence electrons present in an atom of each of these elements.`,
        workedSolution: `(i) Group Name:
**Alkali metals (Group 1 elements)**.

(ii) Electronic Configurations:
• Lithium ($Z=3$): **2, 1**
• Sodium ($Z=11$): **2, 8, 1**
• Potassium ($Z=19$): **2, 8, 8, 1**

(iii) Valence Electrons:
Each of these elements possesses **one (1) valence electron** in its outermost shell, which explains why they share similar chemical properties.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `(i) Describe the formation of an ionic chemical bond in Calcium oxide [$\\text{CaO}$] from a Calcium atom ($_{20}\\text{Ca}$) and an Oxygen atom ($_{8}\\text{O}$).
(ii) State two physical properties characteristic of ionic crystal lattices.`,
        workedSolution: `(i) Formation of Calcium Oxide ($\\text{CaO}$):
• Calcium ($Z=20: 2, 8, 8, 2$) has 2 valence electrons. It loses both electrons to attain an argon octet ($2, 8, 8$), forming the calcium cation:
$$\\text{Ca} \\to \\text{Ca}^{2+} + 2e^-$$
• Oxygen ($Z=8: 2, 6$) has 6 valence electrons. It gains the 2 electrons transferred from calcium to complete its neon octet ($2, 8$), forming the oxide anion:
$$\\text{O} + 2e^- \\to \\text{O}^{2-}$$
• The strong electrostatic force of attraction between oppositely charged $\\text{Ca}^{2+}$ and $\\text{O}^{2-}$ ions binds them into an ionic lattice:
$$\\text{Ca}^{2+} + \\text{O}^{2-} \\to \\text{CaO}$$

(ii) Properties of ionic compounds:
1. High melting and boiling points due to strong electrostatic bonds throughout the crystal lattice.
2. Conduct electricity when molten or dissolved in water (free mobile ions), but act as insulators when solid.
3. Hard, brittle, and soluble in polar solvents (water).`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `(i) A block and tackle pulley system possesses 4 pulley wheels (Velocity Ratio, $VR = 4$). It lifts a load of $600.0\\text{ N}$ when an effort force of $200.0\\text{ N}$ is applied. Calculate:
  (α) The Mechanical Advantage ($MA$);
  (β) The mechanical efficiency of the pulley system.
(ii) State two agronomic methods used to conserve soil on a windy plain.`,
        workedSolution: `(i) Pulley calculations:
• (α) Mechanical Advantage:
$$MA = \\frac{\\text{Load } (L)}{\\text{Effort } (E)} = \\frac{600.0\\text{ N}}{200.0\\text{ N}} = 3.0$$
Answer: Mechanical Advantage is **3.0**.

• (β) Mechanical Efficiency:
$$\\text{Efficiency} = \\frac{MA}{VR} \\times 100\\% = \\frac{3.0}{4.0} \\times 100\\% = 75.0\\%$$
Answer: Efficiency is **75.0%**.

(ii) Soil conservation on windy plains:
1. **Planting Windbreaks / Shelterbelts:** Rows of trees planted perpendicular to prevailing winds to reduce wind speed across fields.
2. **Cover Cropping:** Planting creeping legumes to protect topsoil from wind scouring.
3. **Stubble Mulching:** Leaving crop residues on fields after harvest to bind soil.`,
        maxMarks: 7
      }
    ]
  },
  {
    questionNumber: "5",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) Differentiate between biting-and-chewing insect pests and piercing-and-sucking insect pests, providing one crop pest example for each class.
(ii) State two cultural control methods used to suppress insect pests on a vegetable farm without synthetic pesticides.`,
        workedSolution: `(i) Insect Pest Classes:
• **Biting-and-Chewing Pests:** Possess strong, toothed mandibles and maxillae adapted to cut, chew, and defoliate crop leaves and stems (e.g., Grasshoppers, armyworms, caterpillars).
• **Piercing-and-Sucking Pests:** Possess needle-like piercing stylets adapted to puncture plant epidermal tissues and suck phloem sap (e.g., Aphids, cocoa capsids/mirids, mealybugs).

(ii) Cultural control methods:
1. **Crop Rotation:** Rotating crop families starves host-specific insect pests and disrupts their reproductive cycles.
2. **Hand-Picking & Destruction:** Manually collecting and destroying caterpillars and egg clusters on small plots.
3. **Field Sanitation:** Clearing crop residues and weed hosts after harvest to eliminate overwintering sites.
4. **Intercropping:** Planting pest-repellent companion plants (e.g., marigolds, onions) among vegetables.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `A student who consumed unhygienically prepared street food developed high fever, severe abdominal pain, and headache. Laboratory tests confirmed an infection of Salmonella typhi (Typhoid fever):
(i) State the mode of transmission of typhoid fever.
(ii) State two public health measures to prevent typhoid outbreaks in a school community.
(iii) Distinguish between an endemic disease and an epidemic disease.`,
        workedSolution: `(i) Mode of transmission:
Transmitted via the **fecal-oral route**, through ingestion of water or food contaminated with feces or urine containing *Salmonella typhi* bacteria from infected individuals or asymptomatic carriers.

(ii) Prevention measures:
1. Ensuring all food vendors undergo medical screening and practice hand hygiene before food preparation.
2. Providing treated, boiled, or chemically disinfected drinking water in schools.
3. Sanitary disposal of human waste and maintaining clean, fly-proof toilet facilities.

(iii) Endemic vs. Epidemic:
• **Endemic Disease:** A disease that is constantly present at a baseline level in a specific geographic area or population (e.g., malaria in Ghana).
• **Epidemic Disease:** A sudden outbreak of disease that spreads rapidly and affects an unusually large number of individuals in a population at the same time (e.g., cholera outbreak).`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `(i) Describe what happens to a ray of light when it passes obliquely from air into a rectangular glass block, explaining the direction of refraction with respect to the normal.
(ii) State two everyday observations that demonstrate the refraction of light.`,
        workedSolution: `(i) Refraction into glass block:
Light travels faster in air (optically less dense medium) than in glass (optically denser medium). When a light ray enters glass obliquely, its speed decreases, causing the ray to **bend toward the normal line** ($r < i$). Upon exiting the opposite parallel glass face into air, it speeds up and **bends away from the normal**, emerging parallel to the incident ray.

(ii) Everyday refraction observations:
1. A straight stick or straw dipped into a glass of water appears bent at the liquid surface.
2. A swimming pool or pond appears shallower than its actual physical depth.
3. A coin placed at the bottom of a bowl of water appears displaced upward when viewed from an angle.`,
        maxMarks: 7
      }
    ]
  }
];

// ==========================================
// SEEDING AND INGESTION ENGINE
// ==========================================
async function seedBeceMock2ScienceRecalibrated() {
  const db = await getDb();
  console.log('Seeding Recalibrated BECE Integrated Science Mock 2 into mock_exams/mock_2...');

  // Verify balanced key distribution for Paper 1
  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedMock2P1.forEach(q => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Mock 2 Paper 1 Key Distribution across 40 items:', keyDist);

  const docRef = db.doc('global_curriculum/jhs/subjects/science/mock_exams/mock_2');
  await docRef.set({
    mockId: "mock_2",
    title: "BECE Integrated Science Mock 2 (Standard Mock Suite - NaCCA Calibrated)",
    subject: "Integrated Science",
    totalDurationMinutes: 150,
    metadata: {
      isMock: true,
      isMockExam: true,
      setNumber: 133,
      version: "NaCCA JHS Standards-Compliant",
      totalMarks: 140,
      sanitized: true,
      optionsBalanced: true,
      vectorGraphicsCount: 4,
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test (Mock 2)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: balancedMock2P1
    },
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Mock 2)",
      durationMinutes: 105,
      instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2Mock2Questions
    }
  }, { merge: true });

  console.log('✅ Ingestion complete: Mock 2 seeded into mock_exams/mock_2.');
}

seedBeceMock2ScienceRecalibrated()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Failed ingestion for Mock 2 Science:', err);
    process.exit(1);
  });
