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

// 1. Vector SVG for Q1(a): Electrical Magnetization of an Iron Nail [Reconstructed from Image 1]
const svgQ1aElectromagnetNail = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Central Iron Nail III -->
    <line x1='70' y1='70' x2='300' y2='70' stroke='#cbd5e1' stroke-width='10' stroke-linecap='round'/>
    <!-- Nail Head on Left -->
    <rect x='64' y='58' width='8' height='24' rx='2' fill='#94a3b8'/>
    <!-- Pointed Tip on Right -->
    <polygon points='300,65 315,70 300,75' fill='#cbd5e1'/>
    
    <!-- Coiled Insulated Wire (Solenoid) wrapped around nail -->
    <path d='M 100 60 Q 110 50 115 70 Q 120 90 130 60 Q 140 50 145 70 Q 150 90 160 60 Q 170 50 175 70 Q 180 90 190 60 Q 200 50 205 70 Q 210 90 220 60 Q 230 50 235 70 Q 240 90 250 60 Q 260 50 265 70 Q 270 90 275 60' fill='none' stroke='#f59e0b' stroke-width='3'/>
    
    <!-- Pointer to III (Nail / Solenoid) -->
    <line x1='195' y1='55' x2='235' y2='30' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='240' y='34' font-size='11' font-weight='bold' fill='#f59e0b'>III (Nail with Solenoid)</text>

    <!-- Connecting Wires to Circuit Loop -->
    <line x1='100' y1='70' x2='100' y2='150' stroke='#38bdf8' stroke-width='2.5'/>
    <line x1='275' y1='70' x2='275' y2='150' stroke='#38bdf8' stroke-width='2.5'/>
    <text x='280' y='110' font-size='10' font-weight='bold' fill='#38bdf8'>Connecting wire</text>

    <!-- Bottom Branch with DC Cell I and Switch II -->
    <line x1='100' y1='150' x2='150' y2='150' stroke='#38bdf8' stroke-width='2.5'/>
    
    <!-- DC Cell I -->
    <line x1='150' y1='135' x2='150' y2='165' stroke='#10b981' stroke-width='2.5'/>
    <text x='142' y='132' font-size='10' font-weight='bold' fill='#10b981'>+</text>
    <line x1='158' y1='142' x2='158' y2='158' stroke='#ef4444' stroke-width='4'/>
    <text x='164' y='132' font-size='10' font-weight='bold' fill='#ef4444'>-</text>
    <text x='154' y='180' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I (Cell)</text>

    <line x1='158' y1='150' x2='205' y2='150' stroke='#38bdf8' stroke-width='2.5'/>

    <!-- Key / Switch II -->
    <circle cx='208' cy='150' r='3' fill='#e2e8f0'/>
    <line x1='208' y1='150' x2='230' y2='138' stroke='#e2e8f0' stroke-width='2.5'/>
    <circle cx='234' cy='150' r='3' fill='#e2e8f0'/>
    <text x='220' y='175' font-size='10' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>II (Switch)</text>

    <line x1='234' y1='150' x2='275' y2='150' stroke='#38bdf8' stroke-width='2.5'/>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q1(b): Preparation of Carbon Dioxide Gas in Laboratory [Reconstructed from Image 3]
const svgQ1bCarbonDioxideSetup = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Flat-bottom Generating Flask with CaCO3 and dilute HCl -->
    <g transform='translate(50, 60)'>
      <path d='M 35 45 L 35 15 L 45 15 L 45 45 Q 75 75 75 110 L 5 110 Q 5 75 35 45 Z' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.8'/>
      <!-- Solid Marble Chips + Dilute Acid Content -->
      <rect x='10' y='85' width='60' height='24' fill='#38bdf8' opacity='0.5'/>
      <!-- Marble chips dots -->
      <circle cx='20' cy='95' r='3' fill='#ffffff'/><circle cx='35' cy='98' r='3.5' fill='#ffffff'/>
      <circle cx='50' cy='94' r='3' fill='#ffffff'/><circle cx='60' cy='102' r='2.5' fill='#ffffff'/>
      <text x='40' y='125' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Flask Content</text>
      
      <!-- Stopper -->
      <rect x='33' y='11' width='14' height='10' fill='#d97706'/>

      <!-- Thistle Funnel I dipping below liquid -->
      <line x1='37' y1='-25' x2='37' y2='98' stroke='#cbd5e1' stroke-width='2'/>
      <polygon points='30,-25 44,-25 39,-12 35,-12' fill='#334155' stroke='#cbd5e1'/>
      <text x='15' y='-30' font-size='10' font-weight='bold' fill='#f59e0b'>I (Thistle Funnel)</text>
    </g>

    <!-- Delivery Tube II -->
    <path d='M 93 72 L 93 45 L 180 45 L 245 155 L 285 155' fill='none' stroke='#cbd5e1' stroke-width='3'/>
    <text x='140' y='38' font-size='10' font-weight='bold' fill='#cbd5e1'>II (Delivery Tube)</text>

    <!-- Water Trough & Inverted Gas Jar -->
    <g transform='translate(200, 110)'>
      <!-- Trough with Water -->
      <rect x='0' y='30' width='160' height='75' rx='3' fill='#0284c7' opacity='0.15' stroke='#64748b' stroke-width='2'/>
      <rect x='1' y='45' width='158' height='58' fill='#38bdf8' opacity='0.35'/>
      <text x='150' y='60' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='end'>Water</text>

      <!-- Beehive Shelf Support -->
      <rect x='60' y='65' width='50' height='38' fill='#334155' stroke='#94a3b8' stroke-width='1.5'/>
      <path d='M 75 103 L 75 88 Q 85 80 95 88 L 95 103 Z' fill='#0f172a'/>

      <!-- Inverted Gas Jar with Carbon Dioxide -->
      <rect x='65' y='-50' width='40' height='115' rx='3' fill='#0284c7' opacity='0.25' stroke='#f59e0b' stroke-width='2'/>
      <!-- Water level displaced down -->
      <rect x='66' y='20' width='38' height='45' fill='#38bdf8' opacity='0.4'/>
      <line x1='65' y1='20' x2='105' y2='20' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Rising CO2 bubbles -->
      <circle cx='85' cy='52' r='3' fill='#ffffff'/><circle cx='82' cy='38' r='3' fill='#ffffff'/>
      <!-- Gas Collected at top -->
      <text x='85' y='-15' font-size='9' font-weight='bold' fill='#fde047' text-anchor='middle'>Carbon</text>
      <text x='85' y='-3' font-size='9' font-weight='bold' fill='#fde047' text-anchor='middle'>dioxide</text>
    </g>

    <text x='190' y='220' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>PREPARATION AND OVER-WATER COLLECTION OF CARBON DIOXIDE</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 3. Vector SVG for Q1(c): Digestion of Yam Pap by Salivary Amylase [Reconstructed from Image 2]
const svgQ1cSalivaryDigestion = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 360 200' width='100%' height='185' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Test Tube A: Yam + Iodine Solution (No Saliva) -->
    <g transform='translate(60, 25)'>
      <rect x='15' y='10' width='40' height='130' rx='16' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.8'/>
      <!-- Blue-black Starch complex level -->
      <rect x='17' y='65' width='36' height='72' rx='14' fill='#1e1b4b' stroke='#312e81' stroke-width='1.5'/>
      <text x='35' y='-2' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>A</text>
      <text x='35' y='85' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Yam +</text>
      <text x='35' y='97' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Iodine</text>
      <text x='35' y='160' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Blue-black</text>
      <text x='35' y='172' font-size='7' fill='#94a3b8' text-anchor='middle'>(Starch remains)</text>
    </g>

    <!-- Test Tube B: Yam + Iodine + Saliva (Warmed to 37°C) -->
    <g transform='translate(220, 25)'>
      <rect x='15' y='10' width='40' height='130' rx='16' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.8'/>
      <!-- Yellow-brown decolorized maltose solution after 3 mins -->
      <rect x='17' y='65' width='36' height='72' rx='14' fill='#fed7aa' stroke='#ea580c' stroke-width='1.5'/>
      <text x='35' y='-2' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>B</text>
      <text x='35' y='80' font-size='7' font-weight='bold' fill='#7c2d12' text-anchor='middle'>Yam + Iodine</text>
      <text x='35' y='92' font-size='7' font-weight='bold' fill='#7c2d12' text-anchor='middle'>+ Saliva</text>
      <text x='35' y='160' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Yellow-brown</text>
      <text x='35' y='172' font-size='7' fill='#34d399' text-anchor='middle'>(Starch digested)</text>
    </g>

    <!-- Incubation Condition Label -->
    <text x='180' y='190' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>BOTH TUBES INCUBATED AT BODY TEMPERATURE (37°C)</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 4. Vector SVG for Q5(c): Parallel Circuit with Cell, Switch, and Two Lamps
const svgQ5cParallelCircuit = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 170' width='100%' height='155' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Top Wire with DC Cell and Switch -->
    <line x1='40' y1='35' x2='120' y2='35' stroke='#38bdf8' stroke-width='2'/>
    
    <!-- Cell -->
    <line x1='120' y1='22' x2='120' y2='48' stroke='#10b981' stroke-width='2.5'/>
    <text x='112' y='18' font-size='10' font-weight='bold' fill='#10b981'>+</text>
    <line x1='128' y1='28' x2='128' y2='42' stroke='#ef4444' stroke-width='4'/>
    <text x='134' y='18' font-size='10' font-weight='bold' fill='#ef4444'>-</text>
    <text x='124' y='12' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cell</text>
    <line x1='128' y1='35' x2='200' y2='35' stroke='#38bdf8' stroke-width='2'/>

    <!-- Key / Switch -->
    <circle cx='204' cy='35' r='2.5' fill='#e2e8f0'/>
    <line x1='204' y1='35' x2='226' y2='25' stroke='#e2e8f0' stroke-width='2'/>
    <circle cx='230' cy='35' r='2.5' fill='#e2e8f0'/>
    <text x='218' y='18' font-size='9' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Switch</text>
    
    <line x1='230' y1='35' x2='300' y2='35' stroke='#38bdf8' stroke-width='2'/>
    <line x1='300' y1='35' x2='300' y2='135' stroke='#38bdf8' stroke-width='2'/>

    <!-- Parallel Branch 1: Lamp 1 (Middle) -->
    <line x1='300' y1='85' x2='200' y2='85' stroke='#38bdf8' stroke-width='2'/>
    <circle cx='170' cy='85' r='14' fill='#1e293b' stroke='#f59e0b' stroke-width='1.8'/>
    <path d='M 162 92 L 170 78 L 178 92' fill='none' stroke='#f59e0b' stroke-width='1.8'/>
    <text x='170' y='65' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Lamp 1</text>
    <line x1='140' y1='85' x2='40' y2='85' stroke='#38bdf8' stroke-width='2'/>

    <!-- Parallel Branch 2: Lamp 2 (Bottom) -->
    <line x1='300' y1='135' x2='200' y2='135' stroke='#38bdf8' stroke-width='2'/>
    <circle cx='170' cy='135' r='14' fill='#1e293b' stroke='#f59e0b' stroke-width='1.8'/>
    <path d='M 162 142 L 170 128 L 178 142' fill='none' stroke='#f59e0b' stroke-width='1.8'/>
    <text x='170' y='160' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Lamp 2</text>
    <line x1='140' y1='135' x2='40' y2='135' stroke='#38bdf8' stroke-width='2'/>

    <!-- Left Bus Return -->
    <line x1='40' y1='135' x2='40' y2='35' stroke='#38bdf8' stroke-width='2'/>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

const paper2Science2006Questions = [
  // ==========================================
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `The diagram below illustrates the electrical method of magnetizing an iron nail:

${svgQ1aElectromagnetNail}

(i) Give the names of the parts of the circuit labelled I, II, and III.
(ii) List two ferromagnetic substances that can be made into permanent or temporary magnets.
(iii) State two other practical methods of making magnets.
(iv) Name one metallic material that is used in making electrical connecting wires.
(v) Give two physical properties of the material named in (a)(iv) that make it suitable for use as an electrical wire.`,
        workedSolution: `(i) Names of circuit parts:
• I: Electric cell (or direct-current battery)
• II: Switch (or Key)
• III: Solenoid coil (insulated wire wrapped around the iron nail)

(ii) Ferromagnetic substances:
Iron (soft iron), Steel, Cobalt, or Nickel.

(iii) Other methods of making magnets:
1. Single touch method (single stroke method)
2. Divided touch method
3. Magnetic induction

(iv) Material for electrical wires:
Copper (or Aluminum).

(v) Properties making it useful as wire:
1. Excellent electrical conductivity (very low electrical resistivity).
2. High ductility and malleability (can be drawn easily into thin, flexible wires without breaking).
3. High tensile strength and resistance to corrosion.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `The diagram below shows the laboratory apparatus set-up for the preparation and collection of carbon dioxide gas:

${svgQ1bCarbonDioxideSetup}

(i) Name the parts of the set-up labelled I and II.
(ii) Give the recognized name of the method of gas collection shown in the diagram.
(iii) State one physical or chemical property common to gases collected over water.
(iv) What will happen if the lower stem of component I does not dip below the liquid contents of the flask?
(v) List two chemical compounds that form the reacting contents of the generating flask.
(vi) Write down the systematic IUPAC name of carbon dioxide.`,
        workedSolution: `(i) Names of labelled parts:
• I: Thistle funnel
• II: Delivery tube

(ii) Method of gas collection:
Downward displacement of water (or collection over water).

(iii) Property of gases collected over water:
The gas is insoluble or only slightly (sparingly) soluble in water.

(iv) Consequence if component I does not dip below liquid:
The carbon dioxide gas generated will escape backwards into the room through the open thistle funnel stem instead of passing through delivery tube II into the gas jar.

(v) Two compounds in the flask:
1. Calcium carbonate ($\\text{CaCO}_3$, marble chips / limestone)
2. Dilute hydrochloric acid ($\\text{HCl}$)
Reaction: $$\\text{CaCO}_{3(s)} + 2\\text{HCl}_{(aq)} \\to \\text{CaCl}_{2(aq)} + \\text{H}_2\\text{O}_{(l)} + \\text{CO}_{2(g)}$$

(vi) Systematic IUPAC name:
Carbon (IV) oxide.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `In an experiment, yam pap (starch suspension) is placed into two test tubes A and B containing iodine solution. The test tubes are incubated in a water bath at body temperature ($37^\\circ\\text{C}$) and fresh human saliva is added into test tube B:

${svgQ1cSalivaryDigestion}

(i) State the observed color of the contents in test tube A.
(ii) State the color changes observed in the contents of test tube B after 3 minutes.
(iii) When Fehling's solution is added to the contents of test tube B after 3 minutes and boiled, the mixture turns brick-red. What food nutrient has been formed?
(iv) Give two physiological functions of saliva in eating and oral digestion.
(v) Why was it necessary to warm the contents of the test tubes to approximately $37^\\circ\\text{C}$?
(vi) State two scientific aims of this experimental investigation.`,
        workedSolution: `(i) Colour in Test Tube A:
Deep blue-black (confirms the presence of undigested starch).

(ii) Colour changes in Test Tube B after 3 minutes:
The initial blue-black color gradually fades, decolourizes, and turns pale yellow-brown.
• Reason: The enzyme salivary amylase (ptyalin) in saliva hydrolyzes starch into maltose, eliminating starch so the blue-black iodine complex disappears.

(iii) Food nutrient formed:
Reducing sugar (maltose / glucose).

(iv) Functions of saliva:
1. Moistens and lubricates dry food particles to form a soft, cohesive bolus for smooth swallowing (deglutition).
2. Contains the digestive enzyme salivary amylase (ptyalin) that initiates the chemical breakdown of cooked starch into maltose.
3. Dissolves food molecules so they can stimulate taste receptors on gustatory taste buds.

(v) Why warmed to 37°C:
$37^\\circ\\text{C}$ represents normal human body temperature, which is the optimum temperature for human salivary amylase to operate at its maximum catalytic rate.

(vi) Aims of the experiment:
1. To demonstrate that human saliva contains an enzyme that digests starch into reducing sugar.
2. To show that salivary enzymes operate effectively at human body temperature ($37^\\circ\\text{C}$).`,
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
        prompt: "(i) State two essential environmental or internal conditions required for photosynthesis to take place in green leaves.\n(ii) Describe briefly how you would experimentally prove that starch is synthesized in a leaf during photosynthesis.",
        workedSolution: `(i) Conditions for photosynthesis:
1. Radiant sunlight (light energy)
2. Chlorophyll pigment in chloroplasts
3. Carbon (IV) oxide ($\\text{CO}_2$) gas
4. Water ($\\text{H}_2\\text{O}$) absorbed by roots

(ii) Proving starch is formed:
1. Detach an illuminated green leaf and dip it in boiling water for 1 minute to kill cells and rupture membranes.
2. Boil the leaf in warm ethanol using a water bath to extract and decolorize the green chlorophyll.
3. Rinse the brittle leaf in cold water to soften and re-hydrate it.
4. Spread the leaf flat on a white ceramic tile and add drops of iodine solution.
5. Observation: The leaf turns deep blue-black, confirming the synthesis of starch.`,
        maxMarks: 8
      },
      {
        subId: "(b)",
        prompt: "Write a balanced chemical equation showing the direct combination synthesis reaction between hydrogen gas and oxygen gas.",
        workedSolution: `Balanced equation:
$$2\\text{H}_{2(g)} + \\text{O}_{2(g)} \\to 2\\text{H}_2\\text{O}_{(l)}$$
Two moles of diatomic hydrogen gas react with one mole of diatomic oxygen gas to produce two moles of liquid water.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) What is an astronomical satellite?\n(ii) Give one natural example of a satellite in our Solar System.\n(iii) List two vital modern telecommunication or scientific uses of artificial satellites.",
        workedSolution: `(i) Definition of satellite:
A celestial or artificial body orbiting around a larger planet or celestial body in a closed gravitational path.

(ii) Natural satellite:
The Moon (orbits planet Earth).

(iii) Uses of artificial satellites:
1. Global telecommunications, satellite television broadcasting, and international internet data relay.
2. Weather forecasting, cloud monitoring, and tracking tropical cyclones.
3. Global Positioning System (GPS) navigation for aviation, maritime transport, and mobile phones.
4. Earth resource surveying, agricultural monitoring, and environmental cartography.`,
        maxMarks: 8
      }
    ]
  },
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Define the following botanical terms in angiosperm reproduction:\n(i) Self-pollination;\n(ii) Cross-pollination.",
        workedSolution: `(i) Self-pollination:
The transfer of pollen grains from the anther of a flower to the receptive stigma of the exact same flower, or to another flower on the same plant.

(ii) Cross-pollination:
The transfer of pollen grains from the anther of a flower on one plant to the receptive stigma of a flower on a different plant of the same species.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "State two biological ways in which cross-pollinated crop plants are genetically and agronomically superior to self-pollinated plants.",
        workedSolution: `1. Enhanced Genetic Variation & Adaptability: Cross-pollination introduces genetic recombination, producing diverse offspring better equipped to survive changing environmental conditions.
2. Hybrid Vigor (Heterosis): Produces healthier, more vigorous seedlings with higher crop yields and greater resistance to fungal diseases and insect pests compared to inbred lines.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "Sodium chloride salt is prepared by the neutralization reaction between dilute hydrochloric acid and aqueous sodium hydroxide:\n(i) Write a balanced chemical equation for this reaction;\n(ii) What scientific name is given to this class of reaction?",
        workedSolution: `(i) Balanced chemical equation:
$$\\text{HCl}_{(aq)} + \\text{NaOH}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)}$$

(ii) Name of reaction:
Neutralization reaction (acid-base neutralization).`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "Describe a simple laboratory experiment using a spouting can or pierced container to demonstrate that hydrostatic fluid pressure acts equally in all directions at a given depth.",
        workedSolution: `Experiment to demonstrate liquid pressure acts equally in all directions:
1. Apparatus: A tall cylindrical metal can or plastic container with three or four identical pinholes punctured at the exact same horizontal height around its circumference.
2. Procedure: Cover the holes with adhesive tape and fill the can completely with water. Place the can on a level workbench and quickly pull off the tape.
3. Observation: Water spurts out from all the holes simultaneously, and each water jet shoots out to the exact same horizontal distance from the base of the can.
4. Conclusion: Because all jets emerge with equal velocity and trajectory, liquid pressure at a fixed depth acts with equal magnitude in all directions.`,
        maxMarks: 8
      }
    ]
  },
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) What is an epidemiological disease vector?\n(ii) State two specific methods each by which the vectors of the following diseases can be controlled or destroyed:\n  (α) River blindness (Onchocerciasis);\n  (β) Malaria.",
        workedSolution: `(i) Disease vector definition:
An organism (typically an arthropod such as an insect or tick) that carries and transmits infectious pathogens from an infected host to a healthy individual without suffering from the disease itself.

(ii) Control methods:
• (α) Vector of River Blindness (Blackfly / *Simulium spp.*):
  1. Applying biodegradable larvicides to fast-flowing river breeding streams to destroy blackfly larvae.
  2. Clearing thick vegetation and brushwood along riverbanks near human settlements.
• (β) Vector of Malaria (Female *Anopheles* mosquito):
  1. Sleeping under insecticide-treated mosquito bed nets (ITNs).
  2. Draining standing, stagnant water puddles, ditches, and empty cans around dwellings to destroy breeding sites.
  3. Indoor residual spraying (IRS) with insecticides and biological control using larvivorous fish (e.g., *Gambusia*).`,
        maxMarks: 8
      },
      {
        subId: "(b)",
        prompt: "Write down the systematic IUPAC chemical name for each of the following inorganic compounds:\n(i) $\\text{CaCO}_3$;\n(ii) $\\text{FeS}$;\n(iii) $\\text{NaCl}$;\n(iv) $\\text{NaOH}$.",
        workedSolution: `Systematic IUPAC names:
• (i) $\\text{CaCO}_3$: Calcium carbonate
• (ii) $\\text{FeS}$: Iron (II) sulfide
• (iii) $\\text{NaCl}$: Sodium chloride
• (iv) $\\text{NaOH}$: Sodium hydroxide`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) State the two universal physical properties common to all states of matter.\n(ii) In a laboratory density displacement experiment, an insoluble stone of mass $60.0\\text{ g}$ is lowered gently into a graduated measuring cylinder of water. If the water level rises from $60.0\\text{ cm}^3$ to $75.0\\text{ cm}^3$, calculate the density of the stone.",
        workedSolution: `(i) Two properties of all matter:
1. All matter possesses gravitational mass.
2. All matter occupies three-dimensional physical space (volume).

(ii) Density calculation:
• Step 1: Displaced volume of the stone:
$$V = V_{\\text{final}} - V_{\\text{initial}} = 75.0\\text{ cm}^3 - 60.0\\text{ cm}^3 = 15.0\\text{ cm}^3$$
• Step 2: Apply density formula:
$$\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)}$$
Substitute given values ($m = 60.0\\text{ g}$, $V = 15.0\\text{ cm}^3$):
$$\\rho = \\frac{60.0\\text{ g}}{15.0\\text{ cm}^3} = 4.0\\text{ g cm}^{-3}$$
Answer: The density of the stone is $$4.0\\text{ g cm}^{-3}$$.`,
        maxMarks: 8
      }
    ]
  },
  {
    questionNumber: "5",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Mention five distinct biological, structural, or physiological differences between eukaryotic plants and animals.",
        workedSolution: `Differences Table:

| Feature | Plants | Animals |
| :--- | :--- | :--- |
| **Mode of Nutrition** | Autotrophic (synthesize food via photosynthesis with chlorophyll) | Heterotrophic (ingest pre-formed organic matter holozoically) |
| **Cell Wall** | Present (rigid cellulose cell wall outside plasma membrane) | Absent (bounded by flexible cell membrane only) |
| **Locomotion** | Sessile (anchored to substrate; show localized tropisms) | Active muscular locomotion from place to place |
| **Growth Pattern** | Indeterminate and localized to apical meristems | Determinate and intercalary (throughout the whole body) |
| **Response to Stimuli** | Slow response mediated by plant hormones | Rapid response mediated by specialized nervous and endocrine systems |`,
        maxMarks: 8
      },
      {
        subId: "(b)",
        prompt: "Define each of the following terms, giving one valid scientific example in each case:\n(i) Chemical compound;\n(ii) Chemical element.",
        workedSolution: `(i) Chemical compound:
A pure chemical substance composed of two or more different elements chemically bonded together in a fixed, definite stoichiometric ratio by mass, which can only be decomposed by chemical reactions.
• Example: Pure water ($\\text{H}_2\\text{O}$), Carbon dioxide ($\\text{CO}_2$), or Sodium chloride ($\\text{NaCl}$).

(ii) Chemical element:
A fundamental pure chemical substance consisting of only one type of atom that cannot be broken down into simpler substances by ordinary chemical means.
• Example: Copper ($\\text{Cu}$), Iron ($\\text{Fe}$), Oxygen gas ($\\text{O}_2$), or Gold ($\\text{Au}$).\n`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: `(i) State two fundamental physical differences between an electrical conductor and an electrical insulator.\n(ii) Draw and label a clear circuit diagram of a simple direct-current electrical circuit consisting of a single chemical cell and a switch connected to two miniature lamps connected in parallel:\n\n${svgQ5cParallelCircuit}`,
        workedSolution: `(i) Conductor vs. Insulator differences:
1. Charge Carrier Mobility: Electrical conductors possess free, mobile delocalized valence electrons that drift easily under an applied potential, whereas insulators hold electrons tightly in covalent/ionic bonds with no free charge carriers.
2. Electrical Resistivity: Conductors have very low electrical resistivity and high conductivity, whereas insulators have extremely high resistivity and block current flow.

(ii) Circuit diagram:
(Refer to the vector schematic above):
• A DC chemical cell connected in series with a control switch.
• The conducting line splits into two separate parallel branches, with each branch containing an incandescent lamp, reconnecting back to the negative terminal of the cell so each lamp experiences the full cell voltage.`,
        maxMarks: 8
      }
    ]
  }
];

async function seedBece2006SciencePaper2Only() {
  console.log('Seeding 2006 BECE Integrated Science Paper 2 (Section B) Variant (Set 107) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2006_variant');

  await docRef.set({
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer four questions in all. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2Science2006Questions
    },
    metadata: {
      paper2Calibrated: true,
      set107Verified: true,
      sourceImages: ["IMG_2579.jpg", "IMG_2580.jpg", "IMG_2581.jpg"],
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  }, { merge: true });

  console.log('✅ Successfully seeded Set 107 (2006 Science Paper 2 Variant) into past_papers/paper_2006_variant.');

  // Also sync single-document read paths for Paper 2
  const p2Data = {
    id: "paper_2006_variant_p2",
    title: "2006 BECE Integrated Science Paper 2 (Set 107 Theory & Practical)",
    tier: "Junior Secondary (JHS)",
    subject: "Integrated Science",
    topic: "2006 BECE Standardized Theory & Practical Examination",
    variantType: "past_paper_variant",
    year: 2006,
    paperType: 2,
    setNumber: 107,
    era: "classic",
    totalQuestions: 5,
    version: 1,
    format: "structured_essay",
    durationMinutes: 75,
    instructions: "Answer four questions in all. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
    questions: paper2Science2006Questions,
    metadata: {
      sanitized: true,
      vectorGraphicsCount: 4,
      sourcePhotographsIntegrated: ["IMG_2579.jpg", "IMG_2580.jpg", "IMG_2581.jpg"],
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  };

  const p2Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2006_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2006_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2006_variant/question_sets/paper_2006_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2006_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2006_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2006_variant/question_sets/paper_2006_variant_p2',
  ];

  for (const p of p2Paths) {
    await db.doc(p).set(p2Data, { merge: true });
    console.log('✅ Ingested P2 ->', p);
  }

  console.log('🎉 Set 107 (2006 Science Paper 2) ingestion complete!');
}

seedBece2006SciencePaper2Only()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 107 Science Paper 2:', err);
    process.exit(1);
  });
