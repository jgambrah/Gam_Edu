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

// 1. Vector SVG for Q1(a): Domestic Farm Animals (Sheep, Guinea Pig, Duck)
const svgQ1aAnimalsVar = `
<svg viewBox='0 0 380 160' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Animal A: Sheep (Ruminant) -->
  <g transform='translate(25, 20)'>
    <ellipse cx='45' cy='65' rx='35' ry='24' fill='#f1f5f9' stroke='#334155' stroke-width='2'/>
    <!-- Wool curls -->
    <circle cx='30' cy='55' r='8' fill='#e2e8f0'/><circle cx='45' cy='50' r='8' fill='#e2e8f0'/>
    <circle cx='60' cy='55' r='8' fill='#e2e8f0'/><circle cx='45' cy='70' r='8' fill='#e2e8f0'/>
    <!-- Head -->
    <ellipse cx='85' cy='45' rx='14' ry='10' fill='#cbd5e1' stroke='#334155' stroke-width='1.8'/>
    <circle cx='88' cy='42' r='2' fill='#0f172a'/>
    <!-- Legs -->
    <line x1='25' y1='85' x2='25' y2='115' stroke='#334155' stroke-width='3'/>
    <line x1='38' y1='85' x2='38' y2='115' stroke='#334155' stroke-width='3'/>
    <line x1='58' y1='85' x2='58' y2='115' stroke='#334155' stroke-width='3'/>
    <line x1='68' y1='85' x2='68' y2='115' stroke='#334155' stroke-width='3'/>
    <text x='48' y='132' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>Animal A</text>
  </g>
  <!-- Animal B: Guinea Pig (Monogastric Herbivore) -->
  <g transform='translate(150, 35)'>
    <ellipse cx='40' cy='55' rx='28' ry='18' fill='#fed7aa' stroke='#c2410c' stroke-width='2'/>
    <circle cx='62' cy='48' r='10' fill='#ffedd5' stroke='#c2410c' stroke-width='1.5'/>
    <circle cx='65' cy='46' r='1.8' fill='#7c2d12'/>
    <!-- Short legs -->
    <ellipse cx='25' cy='72' rx='6' ry='4' fill='#c2410c'/>
    <ellipse cx='52' cy='72' rx='6' ry='4' fill='#c2410c'/>
    <text x='40' y='117' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>Animal B</text>
  </g>
  <!-- Animal C: Duck (Poultry) -->
  <g transform='translate(265, 25)'>
    <ellipse cx='42' cy='62' rx='24' ry='16' fill='#dcfce7' stroke='#15803d' stroke-width='2'/>
    <circle cx='22' cy='42' r='11' fill='#bbf7d0' stroke='#15803d' stroke-width='1.5'/>
    <!-- Broad bill -->
    <polygon points='12,42 2,44 12,48' fill='#f59e0b' stroke='#d97706'/>
    <circle cx='20' cy='40' r='1.8' fill='#0f172a'/>
    <!-- Webbed foot -->
    <line x1='42' y1='78' x2='42' y2='105' stroke='#d97706' stroke-width='2.5'/>
    <polygon points='34,108 42,104 50,108' fill='#d97706'/>
    <text x='42' y='127' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>Animal C</text>
  </g>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q1(b): Human Respiratory System
const svgQ1bRespiratoryVar = `
<svg viewBox='0 0 340 230' width='100%' height='210' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Head & Neck Contour -->
  <path d='M 120 15 Q 160 15 170 35 L 170 50 L 180 50' fill='none' stroke='#94a3b8' stroke-width='1.5'/>
  <!-- Part I: Larynx -->
  <rect x='162' y='32' width='16' height='12' rx='2' fill='#fbcfe8' stroke='#db2777' stroke-width='1.5'/>
  <line x1='178' y1='38' x2='260' y2='38' stroke='#475569' stroke-width='1.2'/>
  <text x='265' y='42' font-size='11' font-weight='bold' fill='#0f172a'>I</text>
  <!-- Part II: Trachea with cartilage rings -->
  <rect x='164' y='46' width='12' height='45' fill='#e2e8f0' stroke='#334155' stroke-width='1.5'/>
  <line x1='164' y1='54' x2='176' y2='54' stroke='#334155' stroke-width='1.2'/>
  <line x1='164' y1='64' x2='176' y2='64' stroke='#334155' stroke-width='1.2'/>
  <line x1='164' y1='74' x2='176' y2='74' stroke='#334155' stroke-width='1.2'/>
  <line x1='176' y1='65' x2='260' y2='65' stroke='#475569' stroke-width='1.2'/>
  <text x='265' y='69' font-size='11' font-weight='bold' fill='#0f172a'>II</text>
  <!-- Part III: Left & Right Bronchi -->
  <path d='M 166 91 L 140 115' stroke='#334155' stroke-width='3.5'/>
  <path d='M 174 91 L 200 115' stroke='#334155' stroke-width='3.5'/>
  <line x1='200' y1='115' x2='260' y2='100' stroke='#475569' stroke-width='1.2'/>
  <text x='265' y='104' font-size='11' font-weight='bold' fill='#0f172a'>III</text>
  <!-- Part IV: Right and Left Lungs -->
  <path d='M 120 105 C 100 105 85 130 90 175 C 100 185 135 185 145 175 C 150 145 145 110 120 105 Z' fill='#fee2e2' stroke='#ef4444' stroke-width='1.8'/>
  <path d='M 220 105 C 240 105 255 130 250 175 C 240 185 205 185 195 175 C 190 145 195 110 220 105 Z' fill='#fee2e2' stroke='#ef4444' stroke-width='1.8'/>
  <line x1='245' y1='150' x2='275' y2='150' stroke='#475569' stroke-width='1.2'/>
  <text x='280' y='154' font-size='11' font-weight='bold' fill='#0f172a'>IV</text>
  <!-- Part V: Diaphragm Sheet -->
  <path d='M 75 190 Q 170 160 265 190' fill='none' stroke='#2563eb' stroke-width='3.5'/>
  <line x1='170' y1='175' x2='170' y2='210' stroke='#475569' stroke-width='1.2'/>
  <text x='170' y='224' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>V</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 3. Vector SVG for Q1(c): Ohm's Law Circuit Diagram
const svgQ1cCircuitVar = `
<svg viewBox='0 0 340 190' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Loop wires -->
  <line x1='40' y1='50' x2='105' y2='50' stroke='#1e293b' stroke-width='2'/>
  <!-- Cell (I) -->
  <line x1='105' y1='38' x2='105' y2='62' stroke='#1e293b' stroke-width='2'/>
  <line x1='112' y1='44' x2='112' y2='56' stroke='#1e293b' stroke-width='3.5'/>
  <text x='108' y='32' font-size='10' font-weight='bold' fill='#1e40af' text-anchor='middle'>I</text>
  <line x1='112' y1='50' x2='145' y2='50' stroke='#1e293b' stroke-width='2'/>
  <!-- Key / Switch (III) closed -->
  <circle cx='148' cy='50' r='3' fill='#1e293b'/>
  <line x1='148' y1='50' x2='170' y2='40' stroke='#1e293b' stroke-width='2'/>
  <circle cx='174' cy='50' r='3' fill='#1e293b'/>
  <text x='160' y='32' font-size='10' font-weight='bold' fill='#1e40af' text-anchor='middle'>III</text>
  <line x1='174' y1='50' x2='205' y2='50' stroke='#1e293b' stroke-width='2'/>
  <!-- Resistor (II) -->
  <rect x='205' y='42' width='55' height='16' fill='#ffffff' stroke='#1e293b' stroke-width='2'/>
  <text x='232' y='35' font-size='10' font-weight='bold' fill='#1e40af' text-anchor='middle'>II</text>
  <line x1='260' y1='50' x2='300' y2='50' stroke='#1e293b' stroke-width='2'/>
  <!-- Right edge drop -->
  <line x1='300' y1='50' x2='300' y2='145' stroke='#1e293b' stroke-width='2'/>
  <!-- Voltmeter (IV) in parallel across resistor II -->
  <path d='M 195 50 L 195 90 L 215 90' fill='none' stroke='#2563eb' stroke-width='1.5'/>
  <circle cx='232' cy='90' r='14' fill='#eff6ff' stroke='#2563eb' stroke-width='2'/>
  <text x='232' y='95' font-size='12' font-weight='bold' fill='#2563eb' text-anchor='middle'>V</text>
  <path d='M 246 90 L 275 90 L 275 50' fill='none' stroke='#2563eb' stroke-width='1.5'/>
  <text x='232' y='118' font-size='9' font-weight='bold' fill='#2563eb' text-anchor='middle'>IV</text>
  <!-- Bottom wire returning through Ammeter (V) -->
  <line x1='300' y1='145' x2='180' y2='145' stroke='#1e293b' stroke-width='2'/>
  <circle cx='160' cy='145' r='14' fill='#f0fdf4' stroke='#16a34a' stroke-width='2'/>
  <text x='160' y='150' font-size='12' font-weight='bold' fill='#16a34a' text-anchor='middle'>A</text>
  <text x='160' y='173' font-size='9' font-weight='bold' fill='#16a34a' text-anchor='middle'>V</text>
  <line x1='146' y1='145' x2='40' y2='145' stroke='#1e293b' stroke-width='2'/>
  <line x1='40' y1='145' x2='40' y2='50' stroke='#1e293b' stroke-width='2'/>
</svg>
`.trim().replace(/\n\s*/g, '');

const paper2ScienceQuestions = [
  // ==========================================
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `The diagram below shows three domestic farm animals labelled A, B, and C:<br/>${svgQ1aAnimalsVar}<br/>(i) Mention one common type of feed provided to each of the animals labelled A, B, and C.<br/>(ii) Name the principal dietary nutrient supplied by each of the feeds mentioned in (a)(i).<br/>(iii) State one physiological function in the animal's body for each named nutrient in (a)(ii).<br/>(iv) Which of the animals in the diagram is classified as a ruminant? Give one anatomical reason.`,
        workedSolution: `(i) Feed provided to each animal:
- Animal A (Sheep): Forage, pasture grass, legume fodder, or silage.
- Animal B (Guinea Pig): Fresh leafy vegetables, forage grass, hay, or formulated pellets.
- Animal C (Duck): Layers/growers mash, cereal grains (maize/millet), or commercial poultry concentrate.

(ii) Principal dietary nutrients:
- Forage/Grass: Carbohydrates (cellulose / crude fibre) and minerals.
- Pellets/Vegetables: Vitamins (especially Vitamin C) and fibre.
- Cereal/Mash: Carbohydrates (energy) and crude proteins.

(iii) Physiological functions:
- Carbohydrates: Provide energy for daily metabolic activities and locomotion.
- Proteins: Essential for muscle growth, tissue repair, and egg/feather development.
- Fibre: Maintains gastrointestinal motility and provides substrate for rumen microbes.
- Vitamins/Minerals: Enhance immune disease resistance and bone/eggshell formation.

(iv) Classification:
Animal A (Sheep) is a ruminant.
Anatomical reason: It possesses a complex, four-chambered stomach (rumen, reticulum, omasum, and abomasum) that regurgitates and chews the cud.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `The diagram below illustrates the human respiratory system:<br/>${svgQ1bRespiratoryVar}<br/>(i) Identify the anatomical parts labelled I, II, III, IV, and V.<br/>(ii) State one functional role for each of the parts labelled II, III, and V.<br/>(iii) Name the primary gas exchanged during respiration that is:<br/>(α) absorbed and utilized by body cells;<br/>(β) expelled from the lungs into the atmosphere.<br/>(iv) Describe the physical movement of part V during inhalation.`,
        workedSolution: `(i) Identification of parts:
- I: Larynx (voice box)
- II: Trachea (windpipe)
- III: Bronchus (plural: bronchi)
- IV: Lung
- V: Diaphragm

(ii) Functional roles:
- II: Transports inhaled air from the larynx to the bronchi; lined with ciliated epithelial cells and mucus that trap and sweep dust particles upwards.
- III: Channels air directly into the branching bronchioles and alveoli of each lung.
- V: Contracts and flattens downwards during inhalation to expand the thoracic volume and draw air into the lungs.

(iii) Primary gases exchanged:
- (α) Gas absorbed and utilized: Oxygen ($O_2$).
- (β) Gas expelled: Carbon (IV) oxide ($CO_2$).

(iv) Movement of Part V during inhalation:
The diaphragm contracts, moving downwards and flattening, which increases the vertical volume of the thoracic cavity and decreases internal pressure.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `The diagram below shows the circuit symbols and setup used to determine the electrical resistance of an unknown resistor:<br/>${svgQ1cCircuitVar}<br/>(i) Name the circuit components represented by symbols II, III, and IV.<br/>(ii) Explain why component V (ammeter) is connected in series while component IV (voltmeter) is connected in parallel.<br/>(iii) When switch III is closed, ammeter V records an electric current of $4.0\\text{ A}$ and voltmeter IV records a potential difference of $18.0\\text{ V}$. Calculate the electrical resistance of resistor II, stating the formula and correct S.I. unit.`,
        workedSolution: `(i) Identification of symbols:
- II: Resistor
- III: Switch (Key)
- IV: Voltmeter

(ii) Connection rationale:
- Ammeter V is connected in series so that the full circuit current flows through it; it has negligible resistance to avoid reducing current flow.
- Voltmeter IV is connected in parallel across resistor II to measure the potential difference between the two terminals; it has very high internal resistance to avoid drawing significant current away from the main branch.

(iii) Resistance calculation:
State Ohm's Law formula:
$$V = IR \\implies R = \\frac{V}{I}$$
Substitute the given readings ($V = 18.0\\text{ V}$, $I = 4.0\\text{ A}$):
$$R = \\frac{18.0}{4.0} = 4.5\\ \\Omega$$
Answer: $$4.5\\text{ ohms (}\\Omega\\text{)}$$.`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `Five test tubes labelled A, B, C, D, and E contain aqueous solutions of different substances. Three drops of universal indicator were added to each test tube, resulting in the data shown in the table below:

| Solution | Content | pH Value | Colour of Universal Indicator |
| :---: | :---: | :---: | :---: |
| A | $0.1\\text{ mol dm}^{-3}\\text{ HCl}$ | *[Unknown]* | Red |
| B | $0.1\\text{ mol dm}^{-3}\\text{ CH}_3\\text{COOH}$ | 5 | Orange |
| C | $0.1\\text{ mol dm}^{-3}\\text{ NaCl}$ | 7 | *[Unknown]* |
| D | $0.1\\text{ mol dm}^{-3}\\text{ NH}_3$ | 9 | Blue |
| E | $0.1\\text{ mol dm}^{-3}\\text{ NaOH}$ | 13 | Violet |

(i) State the colour observed in test tube C upon the addition of universal indicator.<br/>
(ii) Estimate the expected pH value of solution A.<br/>
(iii) Classify the solutions into:<br/>
(α) A strong acid;<br/>
(β) A weak alkali;<br/>
(γ) A neutral salt solution.<br/>
(iv) Identify two solutions from the table that will undergo a neutralization reaction to yield water and sodium chloride.`,
        workedSolution: `(i) Colour in test tube C:
Green (indicating a neutral solution at pH 7).

(ii) Estimated pH of solution A:
pH 1 (any value between 1 and 2 is scientifically accepted for $0.1\\text{ mol dm}^{-3}\\text{ HCl}$).

(iii) Classification:
- (α) Strong acid: Solution A ($0.1\\text{ mol dm}^{-3}\\text{ HCl}$).
- (β) Weak alkali: Solution D ($0.1\\text{ mol dm}^{-3}\\text{ NH}_3$).
- (γ) Neutral salt solution: Solution C ($0.1\\text{ mol dm}^{-3}\\text{ NaCl}$).

(iv) Neutralization pair:
Solution A (Hydrochloric acid, $\\text{HCl}$) and Solution E (Sodium hydroxide, $\\text{NaOH}$).
Chemical equation:
$$\\text{HCl}_{(aq)} + \\text{NaOH}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)}$$`,
        maxMarks: 10
      }
    ]
  },

  // ==========================================
  // SECTION B: THEORY & ESSAY QUESTIONS (ANSWER 3 ONLY)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Give two examples of each of the following categories of human diseases:\n(i) Fungal diseases;\n(ii) Nutritional deficiency diseases;\n(iii) Non-communicable diseases.",
        workedSolution: `(i) Fungal diseases:
- Ringworm (Tinea)
- Athlete's foot (Tinea pedis)
- Candidiasis (Thrush)

(ii) Nutritional deficiency diseases:
- Kwashiorkor (Protein deficiency)
- Rickets (Vitamin D / Calcium deficiency)
- Scurvy (Vitamin C deficiency)
- Anaemia (Iron deficiency)

(iii) Non-communicable diseases:
- Hypertension (High blood pressure)
- Diabetes mellitus
- Sickle cell disease
- Cancer`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "Differentiate between a homogeneous mixture and a heterogeneous mixture, providing one practical everyday example of each.",
        workedSolution: `Differences:
- Homogeneous mixture: A mixture in which the constituent particles are uniformly distributed throughout a single phase, having identical composition and properties in all parts (e.g., salt dissolved completely in water, air).
- Heterogeneous mixture: A mixture in which the components remain distinct and non-uniformly distributed, often exhibiting visible phase boundaries (e.g., a mixture of sand and water, oil and water).`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) Using scientific concepts, explain why pulling a heavy wooden packing box across a smooth concrete floor requires significantly less effort than pulling it across a rough gravel path.\n(ii) State the S.I. units of: (α) Force; (β) Work done.",
        workedSolution: `(i) Explanation:
A rough gravel surface possesses numerous microscopic and macroscopic irregularities that interlock with the base of the box, producing a high frictional force opposing motion. In contrast, a smooth concrete floor has fewer surface projections, resulting in substantially lower frictional resistance, meaning less applied tractive force is required to maintain motion.

(ii) S.I. Units:
- (α) Force: Newton (N).
- (β) Work done: Joule (J).`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: "(i) Define the term balanced ration in domestic poultry production.\n(ii) State three adverse physiological or economic effects of malnutrition in a flock of laying birds.",
        workedSolution: `(i) Definition of balanced ration:
A balanced ration is an animal feed formulation that supplies all essential nutrients (carbohydrates, proteins, fats, minerals, vitamins, and water) in the exact correct proportions and quantities required to support optimal growth, egg production, and body maintenance.

(ii) Effects of malnutrition in laying birds:
1. Sharp drop in egg production and laying percentage.
2. Production of soft-shelled or cracked eggs due to calcium/vitamin D deficiency.
3. Stunted growth, muscle wasting, and severe feather loss.
4. Weakened immune response, leading to increased disease susceptibility and flock mortality.`,
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
        prompt: "A simple closed circuit consists of a dry cell, a switch, connecting wires, and a miniature electric bulb.\n(i) State the observation made regarding the bulb's brightness when a second identical dry cell is connected in series with the first.\n(ii) State the observation made when a second identical bulb is connected in series with the first using only the original single dry cell.\n(iii) Provide a scientific explanation for each of the observations stated in (a)(i) and (a)(ii).",
        workedSolution: `(i) Observation with two cells in series:
The bulb glows noticeably brighter.

(ii) Observation with two bulbs in series:
The brightness of both bulbs dims significantly.

(iii) Scientific explanations:
- Adding a second cell in series doubles the total electromotive force (voltage) of the circuit ($V_{\\text{total}} = V_1 + V_2$). Since circuit resistance remains constant, current flow increases ($I = \\frac{V}{R}$), delivering more electrical power ($P = I^2R$) to the filament.
- Adding a second bulb in series doubles the total circuit resistance ($R_{\\text{total}} = R_1 + R_2$), halving the total current drawn from the single cell ($I = \\frac{V}{2R}$). Furthermore, the available voltage drops across each bulb ($V_{\\text{bulb}} = \\frac{V}{2}$), reducing power output.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "Explain briefly how each of the following environmental and economic factors influences commercial vegetable crop production in Ghana:\n(i) Soil texture and drainage;\n(ii) Proximity to a perennial water source;\n(iii) Proximity to an urban market center.",
        workedSolution: `(i) Soil texture and drainage:
Well-drained sandy loam soil rich in organic matter provides adequate root aeration and moisture retention. Heavy clay soils cause waterlogging that rots vegetable roots, while excessively coarse sandy soils leach nutrients rapidly and dry out.

(ii) Proximity to a perennial water source:
Vegetables require continuous, high moisture throughout their vegetative cycle. Being near a reliable river, stream, or borehole ensures low-cost irrigation during the dry season, preventing crop failure.

(iii) Proximity to an urban market center:
Vegetables are highly perishable agricultural commodities that deteriorate rapidly after harvest. Closeness to urban consumption centers minimizes post-harvest transit losses, reduces transport haulage costs, and secures premium farm-gate prices.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: "Distinguish between the following ecological symbiotic associations, giving one valid biological example of each:\n(i) Mutualism;\n(ii) Commensalism.",
        workedSolution: `(i) Mutualism:
An ecological interaction between individuals of two different species in which both organisms derive mutual survival benefits.
Example: Nitrogen-fixing *Rhizobium* bacteria in the root nodules of leguminous plants (bacteria supply nitrates while the plant supplies synthesized carbohydrates); or pollination of flowers by bees.

(ii) Commensalism:
A symbiotic relationship in which one organism benefits while the other host organism is neither harmed nor helped.
Example: Epiphytic orchids or ferns growing on the high branches of large forest trees for sunlight access; or remora fish attaching to sharks for free transport and food scraps.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "(i) Distinguish chemically between an element and a chemical compound.\n(ii) Write down the systematic chemical formula for each of the following binary compounds: (α) Aluminium oxide; (β) Sulfur dioxide.",
        workedSolution: `(i) Distinctions:
- Element: A fundamental pure chemical substance made up of only one type of atom that cannot be split into simpler substances by chemical reactions (e.g., Zinc, $\\text{Zn}$).
- Compound: A substance composed of two or more different elements chemically bonded together in a definite fixed mass ratio (e.g., Sodium chloride, $\\text{NaCl}$).

(ii) Chemical Formulae:
- (α) Aluminium oxide: Valency of $\\text{Al} = 3$, Valency of $\\text{O} = 2$. Criss-crossing gives:
  $$\\text{Al}_2\\text{O}_3$$
- (β) Sulfur dioxide: Composed of one sulfur atom and two oxygen atoms:
  $$\\text{SO}_2$$`,
        maxMarks: 4
      }
    ]
  },
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Name two examples of each of the following mineral nutrient elements required by crop plants:\n(i) Macro-nutrients;\n(ii) Micro-nutrients (trace elements).",
        workedSolution: `(i) Macro-nutrients (required in large quantities):
- Nitrogen (N)
- Phosphorus (P)
- Potassium (K)
- Calcium (Ca)
- Magnesium (Mg)
- Sulfur (S)

(ii) Micro-nutrients (required in minute trace amounts):
- Iron (Fe)
- Zinc (Zn)
- Copper (Cu)
- Boron (B)
- Manganese (Mn)
- Molybdenum (Mo)`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "Name the specific constituent of the human circulatory system responsible for each of the following physiological functions:\n(i) Transporting dissolved glucose, amino acids, and urea;\n(ii) Protecting the body by engulfing pathogens and producing antibodies;\n(iii) Facilitating blood clotting at the site of a cut or wound.",
        workedSolution: `(i) Transporting dissolved nutrients:
Blood plasma (the liquid fraction of blood).

(ii) Immune protection against infection:
White blood cells (Leukocytes / Phagocytes and Lymphocytes).

(iii) Blood clotting and haemostasis:
Blood platelets (Thrombocytes).`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "State three public health and environmental consequences of indiscriminate dumping of solid municipal waste in urban communities.",
        workedSolution: `1. Outbreak of water-borne and vector-borne epidemic diseases such as cholera, typhoid, and malaria due to the proliferation of houseflies and mosquitoes.
2. Blockage of storm drains, gutters, and culverts, triggering flash flooding during heavy rainstorms.
3. Contamination of underground aquifers and surface water bodies by toxic leachates.
4. Air pollution and emission of offensive odours and toxic dioxins from uncontrolled spontaneous refuse fires.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "(i) State two clear differences between a colloid and a suspension in terms of particle size and settling behavior.\n(ii) Classify each of the following everyday mixtures as a true solution, a colloid, or a suspension:\n(α) Fresh cow milk;\n(β) Fine sand thoroughly stirred in water;\n(γ) Common table salt completely dissolved in water.",
        workedSolution: `(i) Differences:
- Particle size: Colloidal particles are microscopic ($1\\text{ to } 100\\text{ nm}$) and cannot be seen with the naked eye, whereas suspension particles are larger ($> 100\\text{ nm}$) and visibly identifiable.
- Settling: Suspension particles settle at the bottom under gravity upon standing, while colloidal particles remain permanently dispersed and do not precipitate.
- Filtration: Suspensions can be separated using ordinary filter paper, while colloids pass freely through filter pores.

(ii) Classification:
- (α) Fresh cow milk: Colloid (an emulsion of fat globules in water).
- (β) Sand stirred in water: Suspension.
- (γ) Common table salt in water: True solution.`,
        maxMarks: 5
      },
      {
        subId: "(e)",
        prompt: "(i) Define the term work output as applied to simple and complex machines.\n(ii) A mechanical lifting crane performs $3,600\\text{ J}$ of useful work output when supplied with $4,500\\text{ J}$ of electrical work input. Calculate the efficiency of the crane as a percentage.",
        workedSolution: `(i) Work output:
The actual useful work done by a machine on the load, calculated as the product of the load force and the distance through which the load is moved ($\\text{Work Output} = \\text{Load} \\times \\text{Load Distance}$).

(ii) Efficiency calculation:
Formula:
$$\\text{Efficiency (}\\eta\\text{)} = \\frac{\\text{Useful Work Output}}{\\text{Total Work Input}} \\times 100\\%$$
Substitute the given values ($W_{\\text{out}} = 3,600\\text{ J}$, $W_{\\text{in}} = 4,500\\text{ J}$):
$$\\eta = \\frac{3,600}{4,500} \\times 100\\% = \\frac{4}{5} \\times 100\\% = 80\\%$$
Answer: $$80\\%$$.`,
        maxMarks: 4
      }
    ]
  },
  {
    questionNumber: "5",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "An atom of an element is represented by the nuclear symbol ${}^{19}_{9}\\text{Y}$.\n(i) State the number of protons, electrons, and neutrons contained in a neutral atom of element Y.\n(ii) Write down the electron configuration of element Y.\n(iii) Based on your electron configuration, deduce the (α) Group number and (β) Period number of element Y on the Periodic Table.",
        workedSolution: `(i) Sub-atomic particles:
- Number of protons $= Z = 9$
- Number of electrons $= \\text{protons} = 9$ (in a neutral atom)
- Number of neutrons $= A - Z = 19 - 9 = 10$

(ii) Electron configuration:
Shell capacities: 2 in the first shell, 7 in the second shell:
$$2, 7$$

(iii) Periodic Table position:
- (α) Group number: Group VII (or Group 17), because it possesses 7 valence electrons in its outermost shell.
- (β) Period number: Period 2, because its electrons occupy two distinct energy shells.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "(i) Explain the mechanism of thermal heat transfer by conduction through a solid copper rod.\n(ii) Name two other physical mechanisms by which thermal energy travels through space or matter.",
        workedSolution: `(i) Mechanism of conduction in a metal rod:
When one end of the copper rod is heated, the atoms in that region absorb thermal energy and vibrate more vigorously. These particles collide with neighbouring atoms, transferring kinetic energy along the lattice. In addition, free delocalized valence electrons absorb thermal energy and diffuse rapidly through the metal, accelerating heat transmission throughout the rod without any bulk movement of the material.

(ii) Other methods of heat transfer:
1. Convection (through bulk fluid/liquid and gas circulation).
2. Radiation (through infrared electromagnetic waves requiring no material medium).`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "(i) State two human activities in Ghana that cause severe degradation and pollution of freshwater bodies.\n(ii) Outline two sustainable measures that should be enforced to protect and conserve natural river basins.",
        workedSolution: `(i) Degrading human activities:
- Illegal alluvial gold mining (galamsey) along and within riverbeds, discharging heavy metals (mercury, lead) and high silt sediment loads.
- Direct discharge of untreated domestic sewage and industrial effluents into rivers.
- Indiscriminate disposal of non-biodegradable plastics and refuse along river banks.
- Agricultural runoff containing chemical fertilizers and synthetic pesticides.

(ii) Sustainable conservation measures:
- Enforcing vegetative buffer zones by planting trees (afforestation/riparian buffers) along river banks to prevent soil erosion and trap chemical runoff.
- Strictly enforcing environmental protection laws prohibiting mining and industrial effluent discharge near river catchment basins.
- Constructing modern municipal sewage treatment facilities before discharging water into natural watercourses.`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: "(i) State three general public health and clinical practices used in the control and management of bacterial diseases in humans.\n(ii) Give two specific examples of diseases caused by pathogenic bacteria.",
        workedSolution: `(i) Management of bacterial diseases:
1. Administration of a full course of specific prescription antibiotics to eradicate pathogenic bacteria.
2. Immunization and vaccination of vulnerable populations (e.g., BCG vaccine against tuberculosis).
3. Practicing personal and domestic hygiene, such as frequent handwashing with soap and clean running water, and safe sanitary food preparation.
4. Ensuring municipal chlorination and purification of community drinking water.

(ii) Examples of bacterial diseases:
- Cholera (*Vibrio cholerae*)
- Tuberculosis (*Mycobacterium tuberculosis*)
- Typhoid fever (*Salmonella typhi*)
- Tetanus (*Clostridium tetani*)`,
        maxMarks: 4
      }
    ]
  }
];

async function seedBece2026SciencePaper2Variant() {
  console.log('Seeding 2026 BECE Integrated Science Paper 2 Variant (Set 73) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2026_variant');

  await docRef.set({
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 60,
      instructions: "Answer four questions in all. Answer Question 1 from Section A (compulsory), and any three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2ScienceQuestions
    },
    'metadata.paper2Calibrated': true,
    'metadata.set73Verified': true,
    'metadata.updatedAt': new Date()
  }, { merge: true });

  console.log('✅ Successfully seeded Set 73 (2026 Science Paper 2 Variant) into past_papers/paper_2026_variant.');
}

seedBece2026SciencePaper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 73 Science Paper 2:', err);
    process.exit(1);
  });
