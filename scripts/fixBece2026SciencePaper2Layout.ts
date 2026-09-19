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
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
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

  // CLI OAuth fallback
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
  } catch (cliErr) {
    // Continue
  }

  try {
    adminInstance.initializeApp({
      credential: adminInstance.credential.applicationDefault(),
    });
    return adminInstance.firestore();
  } catch (e) {
    return adminInstance.firestore();
  }
}

// 1. Vector SVG for Q1(a): Farm Animals (Sheep, Guinea Pig, Duck)
const svgQ1aAnimals = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 150' width='100%' height='150' style='max-width: 450px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    <!-- Animal A: Sheep -->
    <g transform='translate(25, 15)'>
      <ellipse cx='45' cy='65' rx='35' ry='24' fill='#f8fafc' stroke='#64748b' stroke-width='2'/>
      <circle cx='30' cy='55' r='8' fill='#e2e8f0'/><circle cx='45' cy='50' r='8' fill='#e2e8f0'/>
      <circle cx='60' cy='55' r='8' fill='#e2e8f0'/><circle cx='45' cy='70' r='8' fill='#e2e8f0'/>
      <ellipse cx='85' cy='45' rx='14' ry='10' fill='#cbd5e1' stroke='#475569' stroke-width='1.8'/>
      <circle cx='88' cy='42' r='2' fill='#0f172a'/>
      <line x1='25' y1='85' x2='25' y2='112' stroke='#94a3b8' stroke-width='3.5'/>
      <line x1='38' y1='85' x2='38' y2='112' stroke='#94a3b8' stroke-width='3.5'/>
      <line x1='58' y1='85' x2='58' y2='112' stroke='#94a3b8' stroke-width='3.5'/>
      <line x1='68' y1='85' x2='68' y2='112' stroke='#94a3b8' stroke-width='3.5'/>
      <text x='48' y='128' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Animal A</text>
    </g>
    <!-- Animal B: Guinea Pig -->
    <g transform='translate(150, 30)'>
      <ellipse cx='40' cy='55' rx='28' ry='18' fill='#fed7aa' stroke='#ea580c' stroke-width='2'/>
      <circle cx='62' cy='48' r='10' fill='#ffedd5' stroke='#ea580c' stroke-width='1.5'/>
      <circle cx='65' cy='46' r='2' fill='#7c2d12'/>
      <ellipse cx='25' cy='72' rx='6' ry='4' fill='#c2410c'/>
      <ellipse cx='52' cy='72' rx='6' ry='4' fill='#c2410c'/>
      <text x='40' y='113' font-size='12' font-weight='bold' fill='#fb923c' text-anchor='middle'>Animal B</text>
    </g>
    <!-- Animal C: Duck -->
    <g transform='translate(265, 20)'>
      <ellipse cx='42' cy='62' rx='24' ry='16' fill='#dcfce7' stroke='#16a34a' stroke-width='2'/>
      <circle cx='22' cy='42' r='11' fill='#bbf7d0' stroke='#16a34a' stroke-width='1.5'/>
      <polygon points='12,42 2,44 12,48' fill='#f59e0b' stroke='#d97706'/>
      <circle cx='20' cy='40' r='2' fill='#0f172a'/>
      <line x1='42' y1='78' x2='42' y2='102' stroke='#d97706' stroke-width='3'/>
      <polygon points='34,105 42,101 50,105' fill='#d97706'/>
      <text x='42' y='123' font-size='12' font-weight='bold' fill='#4ade80' text-anchor='middle'>Animal C</text>
    </g>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q1(b): Human Respiratory System
const svgQ1bRespiratory = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 360 230' width='100%' height='210' style='max-width: 450px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    <path d='M 120 15 Q 160 15 170 35 L 170 50 L 180 50' fill='none' stroke='#64748b' stroke-width='1.5'/>
    <!-- Part I: Larynx -->
    <rect x='162' y='32' width='16' height='12' rx='2' fill='#fbcfe8' stroke='#db2777' stroke-width='1.5'/>
    <line x1='178' y1='38' x2='260' y2='38' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='265' y='42' font-size='11' font-weight='bold' fill='#f472b6'>I (Larynx)</text>
    <!-- Part II: Trachea -->
    <rect x='164' y='46' width='12' height='45' fill='#e2e8f0' stroke='#334155' stroke-width='1.5'/>
    <line x1='164' y1='54' x2='176' y2='54' stroke='#334155' stroke-width='1.2'/>
    <line x1='164' y1='64' x2='176' y2='64' stroke='#334155' stroke-width='1.2'/>
    <line x1='164' y1='74' x2='176' y2='74' stroke='#334155' stroke-width='1.2'/>
    <line x1='176' y1='65' x2='260' y2='65' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='265' y='69' font-size='11' font-weight='bold' fill='#38bdf8'>II (Trachea)</text>
    <!-- Part III: Bronchus -->
    <path d='M 166 91 L 140 115' stroke='#e2e8f0' stroke-width='3.5'/>
    <path d='M 174 91 L 200 115' stroke='#e2e8f0' stroke-width='3.5'/>
    <line x1='200' y1='115' x2='260' y2='100' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='265' y='104' font-size='11' font-weight='bold' fill='#a78bfa'>III (Bronchus)</text>
    <!-- Part IV: Lungs -->
    <path d='M 120 105 C 100 105 85 130 90 175 C 100 185 135 185 145 175 C 150 145 145 110 120 105 Z' fill='#881337' stroke='#f43f5e' stroke-width='1.8'/>
    <path d='M 220 105 C 240 105 255 130 250 175 C 240 185 205 185 195 175 C 190 145 195 110 220 105 Z' fill='#881337' stroke='#f43f5e' stroke-width='1.8'/>
    <line x1='245' y1='150' x2='275' y2='150' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='280' y='154' font-size='11' font-weight='bold' fill='#fb7185'>IV (Lung)</text>
    <!-- Part V: Diaphragm -->
    <path d='M 75 190 Q 170 160 265 190' fill='none' stroke='#38bdf8' stroke-width='3.5'/>
    <line x1='170' y1='175' x2='170' y2='210' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='170' y='224' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>V (Diaphragm)</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 3. Vector SVG for Q1(c): Ohm's Law Circuit Diagram
const svgQ1cCircuit = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 185' width='100%' height='165' style='max-width: 450px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    <!-- Main loop wires -->
    <line x1='40' y1='45' x2='105' y2='45' stroke='#94a3b8' stroke-width='2'/>
    <!-- Cell (I) -->
    <line x1='105' y1='33' x2='105' y2='57' stroke='#38bdf8' stroke-width='2'/>
    <line x1='112' y1='39' x2='112' y2='51' stroke='#38bdf8' stroke-width='3.5'/>
    <text x='108' y='27' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I (Cell)</text>
    <line x1='112' y1='45' x2='145' y2='45' stroke='#94a3b8' stroke-width='2'/>
    <!-- Switch (III) closed -->
    <circle cx='148' cy='45' r='3' fill='#e2e8f0'/>
    <line x1='148' y1='45' x2='170' y2='35' stroke='#e2e8f0' stroke-width='2'/>
    <circle cx='174' cy='45' r='3' fill='#e2e8f0'/>
    <text x='160' y='27' font-size='10' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>III (Switch)</text>
    <line x1='174' y1='45' x2='205' y2='45' stroke='#94a3b8' stroke-width='2'/>
    <!-- Resistor (II) -->
    <rect x='205' y='37' width='55' height='16' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/>
    <text x='232' y='30' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II (Resistor)</text>
    <line x1='260' y1='45' x2='300' y2='45' stroke='#94a3b8' stroke-width='2'/>
    <!-- Right side wire drop -->
    <line x1='300' y1='45' x2='300' y2='140' stroke='#94a3b8' stroke-width='2'/>
    <!-- Voltmeter (IV) connected in parallel across resistor -->
    <path d='M 195 45 L 195 85 L 215 85' fill='none' stroke='#38bdf8' stroke-width='1.5'/>
    <circle cx='232' cy='85' r='14' fill='#0284c7' stroke='#38bdf8' stroke-width='2'/>
    <text x='232' y='90' font-size='12' font-weight='bold' fill='#ffffff' text-anchor='middle'>V</text>
    <path d='M 246 85 L 275 85 L 275 45' fill='none' stroke='#38bdf8' stroke-width='1.5'/>
    <text x='232' y='112' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>IV (Voltmeter)</text>
    <!-- Ammeter (V) in series along the bottom line -->
    <line x1='300' y1='140' x2='180' y2='140' stroke='#94a3b8' stroke-width='2'/>
    <circle cx='160' cy='140' r='14' fill='#16a34a' stroke='#4ade80' stroke-width='2'/>
    <text x='160' y='145' font-size='12' font-weight='bold' fill='#ffffff' text-anchor='middle'>A</text>
    <text x='160' y='168' font-size='9' font-weight='bold' fill='#4ade80' text-anchor='middle'>V (Ammeter)</text>
    <line x1='146' y1='140' x2='40' y2='140' stroke='#94a3b8' stroke-width='2'/>
    <line x1='40' y1='140' x2='40' y2='45' stroke='#94a3b8' stroke-width='2'/>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 4. Clean Responsive HTML Table for Q1(d)
const tableQ1dUniversalIndicator = `
<div class="my-4 overflow-x-auto">
  <table class="min-w-full text-xs text-left border border-slate-700 bg-slate-900/90 rounded-lg overflow-hidden">
    <thead class="bg-slate-800 text-slate-200 border-b border-slate-700">
      <tr>
        <th class="px-3 py-2 border-r border-slate-700">Solution</th>
        <th class="px-3 py-2 border-r border-slate-700">Content / Chemical Formula</th>
        <th class="px-3 py-2 border-r border-slate-700 text-center">pH Value</th>
        <th class="px-3 py-2">Colour with Universal Indicator</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-800 text-slate-300">
      <tr class="hover:bg-slate-800/50">
        <td class="px-3 py-2 font-bold text-sky-400 border-r border-slate-700">A</td>
        <td class="px-3 py-2 border-r border-slate-700 font-mono">0.1 mol dm⁻³ HCl</td>
        <td class="px-3 py-2 border-r border-slate-700 text-center font-bold text-amber-400">[Unknown]</td>
        <td class="px-3 py-2 text-red-400 font-semibold">Red</td>
      </tr>
      <tr class="hover:bg-slate-800/50">
        <td class="px-3 py-2 font-bold text-sky-400 border-r border-slate-700">B</td>
        <td class="px-3 py-2 border-r border-slate-700 font-mono">0.1 mol dm⁻³ CH₃COOH</td>
        <td class="px-3 py-2 border-r border-slate-700 text-center font-bold">5</td>
        <td class="px-3 py-2 text-orange-400 font-semibold">Orange</td>
      </tr>
      <tr class="hover:bg-slate-800/50">
        <td class="px-3 py-2 font-bold text-sky-400 border-r border-slate-700">C</td>
        <td class="px-3 py-2 border-r border-slate-700 font-mono">0.1 mol dm⁻³ NaCl</td>
        <td class="px-3 py-2 border-r border-slate-700 text-center font-bold">7</td>
        <td class="px-3 py-2 text-amber-400 font-bold">[Unknown]</td>
      </tr>
      <tr class="hover:bg-slate-800/50">
        <td class="px-3 py-2 font-bold text-sky-400 border-r border-slate-700">D</td>
        <td class="px-3 py-2 border-r border-slate-700 font-mono">0.1 mol dm⁻³ NH₃</td>
        <td class="px-3 py-2 border-r border-slate-700 text-center font-bold">9</td>
        <td class="px-3 py-2 text-blue-400 font-semibold">Blue</td>
      </tr>
      <tr class="hover:bg-slate-800/50">
        <td class="px-3 py-2 font-bold text-sky-400 border-r border-slate-700">E</td>
        <td class="px-3 py-2 border-r border-slate-700 font-mono">0.1 mol dm⁻³ NaOH</td>
        <td class="px-3 py-2 border-r border-slate-700 text-center font-bold">13</td>
        <td class="px-3 py-2 text-purple-400 font-semibold">Violet</td>
      </tr>
    </tbody>
  </table>
</div>
`.trim().replace(/\n\s*/g, '');

const fixedQuestion1SubQuestions = [
  {
    subId: "(a)",
    prompt: `Study the illustration below showing three domestic farm animals labelled A, B, and C carefully and answer the questions that follow:

${svgQ1aAnimals}

(i) Mention one common type of feed provided to each of the animals labelled A, B, and C.

(ii) Name the principal dietary nutrient supplied by each of the feeds mentioned in (a)(i).

(iii) State one physiological function in the animal's body for each named nutrient in (a)(ii).

(iv) Which of the animals in the diagram is classified as a ruminant? Give one anatomical reason.`,
    workedSolution: `(i) Feed provided to each animal:
• Animal A (Sheep): Forage, pasture grass, legume fodder, or silage.
• Animal B (Guinea Pig): Fresh leafy vegetables, forage grass, hay, or formulated pellets.
• Animal C (Duck): Layers/growers mash, cereal grains (maize/millet), or commercial poultry concentrate.

(ii) Principal dietary nutrients:
• Forage / Grass: Carbohydrates (cellulose / crude fibre) and minerals.
• Pellets / Vegetables: Vitamins (especially Vitamin C) and fibre.
• Cereal / Mash: Carbohydrates (energy) and crude proteins.

(iii) Physiological functions:
• Carbohydrates: Provide energy for daily metabolic activities and locomotion.
• Proteins: Essential for muscle growth, tissue repair, and egg/feather development.
• Fibre: Maintains gastrointestinal motility and provides substrate for rumen microbes.
• Vitamins/Minerals: Enhance disease resistance and promote bone and eggshell formation.

(iv) Classification:
Animal A (Sheep) is a ruminant.
Anatomical reason: It possesses a complex, four-chambered stomach (rumen, reticulum, omasum, and abomasum) and regurgitates swallowed forage to chew the cud.`,
    maxMarks: 10
  },
  {
    subId: "(b)",
    prompt: `The diagram below illustrates the human respiratory system. Study the figure carefully and answer the questions that follow:

${svgQ1bRespiratory}

(i) Identify the anatomical parts labelled I, II, III, IV, and V.

(ii) State one functional role for each of the parts labelled II, III, and V.

(iii) Name the primary gas exchanged during respiration that is:
  (α) absorbed and utilized by body cells;
  (β) expelled from the lungs into the atmosphere.

(iv) Describe the physical movement and shape change of part V during inhalation.`,
    workedSolution: `(i) Identification of parts:
• I: Larynx (voice box)
• II: Trachea (windpipe)
• III: Bronchus (plural: bronchi)
• IV: Lung
• V: Diaphragm

(ii) Functional roles:
• II (Trachea): Conveys inhaled air toward the bronchi; lined with ciliated epithelial cells and mucus that trap and sweep dust particles upwards.
• III (Bronchus): Channels air directly into the branching bronchioles and alveoli of each lung.
• V (Diaphragm): Contracts and moves downward during inhalation to expand the thoracic volume and draw air into the lungs.

(iii) Primary gases exchanged:
• (α) Gas absorbed and utilized: Oxygen ($O_2$).
• (β) Gas expelled: Carbon (IV) oxide ($CO_2$).

(iv) Movement of Part V (Diaphragm):
The diaphragm contracts and flattens downwards, increasing thoracic cavity volume and lowering internal air pressure.`,
    maxMarks: 10
  },
  {
    subId: "(c)",
    prompt: `The circuit diagram below shows electrical components arranged to investigate the relationship between potential difference and electric current:

${svgQ1cCircuit}

(i) Name the circuit components represented by symbols II, III, and IV.

(ii) Explain why component V (ammeter) is connected in series while component IV (voltmeter) is connected in parallel across component II.

(iii) When switch III is closed, ammeter V records an electric current of $4.0\\text{ A}$ and voltmeter IV records a potential difference of $18.0\\text{ V}$. Calculate the electrical resistance of resistor II, stating the formula and correct S.I. unit.`,
    workedSolution: `(i) Identification of symbols:
• II: Resistor
• III: Switch (Key)
• IV: Voltmeter

(ii) Connection rationale:
• Ammeter V is connected in series so that the full circuit current passes directly through it. It has very low internal resistance to prevent reducing current flow.
• Voltmeter IV is connected in parallel across resistor II to measure the potential drop between its two ends. It has very high internal resistance to avoid diverting significant current from the main line.

(iii) Resistance calculation:
State Ohm's Law:
$$V = IR \\implies R = \\frac{V}{I}$$
Substitute values ($V = 18.0\\text{ V}$, $I = 4.0\\text{ A}$):
$$R = \\frac{18.0}{4.0} = 4.5\\ \\Omega$$
Answer: $$4.5\\text{ ohms (}\\Omega\\text{)}$$.`,
    maxMarks: 10
  },
  {
    subId: "(d)",
    prompt: `Five test tubes labelled A, B, C, D, and E contain aqueous solutions of different substances. Three drops of universal indicator were added to each test tube, resulting in the data shown in the table below:

${tableQ1dUniversalIndicator}

(i) State the colour that would be observed in test tube C upon the addition of universal indicator.

(ii) Suggest the expected pH value of solution A.

(iii) Classify the solutions into:
  (α) A strong acid;
  (β) A weak alkali;
  (γ) A neutral salt solution.

(iv) Identify two solutions from the table that will undergo a neutralization reaction to yield water and sodium chloride.`,
    workedSolution: `(i) Observed colour in test tube C:
Green (indicating a neutral salt solution at pH 7).

(ii) Suggested pH value of solution A:
pH 1 (any value between 1.0 and 2.0 is accepted for $0.1\\text{ mol dm}^{-3}\\text{ HCl}$).

(iii) Classification:
• (α) Strong acid: Solution A ($0.1\\text{ mol dm}^{-3}\\text{ HCl}$).
• (β) Weak alkali: Solution D ($0.1\\text{ mol dm}^{-3}\\text{ NH}_3$).
• (γ) Neutral salt solution: Solution C ($0.1\\text{ mol dm}^{-3}\\text{ NaCl}$).

(iv) Neutralization reaction pair:
Solution A (Hydrochloric acid, $\\text{HCl}$) and Solution E (Sodium hydroxide, $\\text{NaOH}$).
Chemical equation:
$$\\text{HCl}_{(aq)} + \\text{NaOH}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)}$$`,
    maxMarks: 10
  }
];

async function fixBece2026SciencePaper2Layout() {
  console.log("Updating 2026 Science Paper 2 (Set 73) formatting in Firestore...");
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2026_variant');
  const snap = await docRef.get();

  if (!snap.exists) {
    console.error("Error: paper_2026_variant document does not exist yet.");
    return;
  }

  const existingPaper2 = snap.data()?.paper2 || {};
  const existingQuestions = existingPaper2.questions || [];

  // Replace Question 1 with our formatted sub-questions while keeping Questions 2-5 intact
  const updatedQuestions = existingQuestions.map((q: any) => {
    if (q.questionNumber === "1") {
      return {
        ...q,
        subQuestions: fixedQuestion1SubQuestions
      };
    }
    return q;
  });

  await docRef.set({
    paper2: {
      ...existingPaper2,
      questions: updatedQuestions
    },
    'metadata.layoutSanitized': true,
    'metadata.updatedAt': admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  console.log("✅ Successfully updated Question 1 with separated sub-item lines, directional alignment, and responsive HTML table in primary doc.");
}

fixBece2026SciencePaper2Layout()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Layout patch failed:", err);
    process.exit(1);
  });
