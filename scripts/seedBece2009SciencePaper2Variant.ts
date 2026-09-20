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

// 1. Vector SVG for Q1(a): Thermal Conduction along Bar with 4 Wax-Attached Nails
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

// 2. Vector SVG for Q1(b): Corrosion Conditions Experiment (Set-ups A, B, C)
const svgQ1bRustingSetups = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 220' width='100%' height='205' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Set-up A: Water + Ordinary Air (Rusted Nail) -->
    <g transform='translate(30, 20)'>
      <polygon points='18,5 42,5 38,20 22,20' fill='#d97706'/>
      <rect x='20' y='20' width='20' height='135' rx='10' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/>
      <rect x='21' y='85' width='18' height='68' fill='#38bdf8' opacity='0.4'/>
      <!-- Rusted nail with flakes -->
      <line x1='27' y1='55' x2='33' y2='140' stroke='#b45309' stroke-width='3.5'/>
      <circle cx='31' cy='100' r='1.5' fill='#ef4444'/><circle cx='29' cy='115' r='1.5' fill='#ef4444'/><circle cx='32' cy='130' r='1.5' fill='#ef4444'/>
      <text x='30' y='175' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Set-up A</text>
      <text x='30' y='189' font-size='8' fill='#ef4444' text-anchor='middle'>(Air + Water: Rusts)</text>
    </g>

    <!-- Set-up B: Boiled Water + Oil Layer (No Rust) -->
    <g transform='translate(150, 20)'>
      <polygon points='18,5 42,5 38,20 22,20' fill='#d97706'/>
      <rect x='20' y='20' width='20' height='135' rx='10' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/>
      <rect x='21' y='75' width='18' height='78' fill='#38bdf8' opacity='0.4'/>
      <!-- Oil Seal Layer -->
      <rect x='21' y='68' width='18' height='8' fill='#f59e0b' opacity='0.9'/>
      <!-- Unrusted Shiny Nail -->
      <line x1='30' y1='72' x2='30' y2='142' stroke='#cbd5e1' stroke-width='3.5'/>
      <circle cx='30' cy='70' r='3.5' fill='#cbd5e1'/>
      <text x='30' y='175' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Set-up B</text>
      <text x='30' y='189' font-size='8' fill='#cbd5e1' text-anchor='middle'>(Boiled + Oil: No Rust)</text>
    </g>

    <!-- Set-up C: Dry Air + Rubber Stopper + Anhydrous Agent (No Rust) -->
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

// 3. Vector SVG for Q1(c): Four-Stage Foliage Starch Test Setup
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

// 4. Vector SVG for Q2(c): Specular Reflection Ray Diagram on a Plane Mirror
const svgQ2cReflectionPlaneMirror = `
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

    <!-- Point of Incidence -->
    <circle cx='170' cy='120' r='3.5' fill='#f59e0b'/>
    <text x='170' y='145' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Point of Incidence</text>

    <!-- Angles i and r -->
    <path d='M 170 85 A 35 35 0 0 0 145 99' fill='none' stroke='#f59e0b' stroke-width='1.5'/>
    <text x='150' y='82' font-size='11' font-weight='bold' fill='#f59e0b'>i</text>

    <path d='M 170 85 A 35 35 0 0 1 195 99' fill='none' stroke='#f59e0b' stroke-width='1.5'/>
    <text x='185' y='82' font-size='11' font-weight='bold' fill='#f59e0b'>r</text>

    <text x='170' y='165' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LAW OF REFLECTION: ANGLE OF INCIDENCE (i) = ANGLE OF REFLECTION (r)</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

const paper2Science2009Questions = [
  // ==========================================
  // SECTION A: COMPULSORY PRACTICAL TEST (30 MARKS)
  // ==========================================
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
(vi) State the primary scientific aim of the experiment.`,
        workedSolution: `(i) Boiling temperature of pure water:
$$100^\\circ\\text{C}\\quad (\\text{or } 373\\text{ K})$$

(ii) Sequential observations on the nails:
Nail 1 falls off first, followed by Nail 2, then Nail 3, and Nail 4 falls off last.
• Reason: Heat travels progressively along the conductive metal bar from the hot end to the cold end. The wax holding Nail 1 reaches its melting point first because it is closest to the boiling water heat source, while the wax holding subsequent nails melts in sequential order as the conduction front advances.

(iii) Comparative thermometer readings:
Thermometer A records the highest temperature, Thermometer B records a moderate temperature, Thermometer C records a lower temperature, and Thermometer D records the lowest temperature ($T_A > T_B > T_C > T_D$). Temperatures rise progressively over time from A to D.

(iv) Mode of heat transfer:
Thermal conduction (heat transfer through a solid lattice without bulk movement of the material).

(v) Effect of heat demonstrated:
Heat causes a physical change of state of matter (melting / fusion of solid candle wax into liquid wax).

(vi) Aim of the experiment:
To demonstrate that thermal heat energy travels through solid metals by conduction from regions of higher temperature to regions of lower temperature.`,
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
To boil off and expel all dissolved atmospheric air and oxygen gas from the water.

(ii) Function of the oil layer:
To form an airtight physical barrier on the water surface that prevents atmospheric oxygen from dissolving back into the boiled water.

(iii) Purpose in Set-up C:
The rubber stopper forms an airtight seal preventing outside humid air from entering, while the anhydrous drying agent absorbs all residual water vapor within the tube, maintaining a completely dry air environment.

(iv) Why nail in Set-up A rusted:
Both atmospheric oxygen (air) and liquid water (moisture) were present simultaneously, enabling the electrochemical oxidation of iron into hydrated iron (III) oxide ($Fe_2O_3 \\cdot xH_2O$).

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
• Activity I (Boiling water): Kills the protoplasm, halts all enzymatic metabolic reactions, and ruptures cell membranes, making cells fully permeable to subsequent chemical reagents.
• Activity II (Warm alcohol): Extracts and dissolves out the green chlorophyll pigment (decolorizes the leaf) so that subsequent color changes with iodine can be seen clearly without optical masking.
• Activity III (Cold water): Re-hydrates and softens the leaf, which became brittle and stiff after boiling in alcohol.
• Activity IV (Iodine solution): Serves as the biochemical indicator to test for and detect the presence of starch.

(ii) Colour change of Leaf A:
The pale decolorized leaf turns deep blue-black.

(iii) Explanation:
Leaf A was exposed to sunlight, enabling chlorophyll to synthesize starch via photosynthesis, which reacts with iodine to form a blue-black complex. Leaf B was kept in continuous darkness (de-starched); without sunlight, no photosynthesis occurred, and stored starch was converted into soluble sugars and translocated, leaving zero starch.

(iv) Aim of the experiment:
To show that sunlight is essential for green plants to produce starch through photosynthesis.`,
        maxMarks: 10
      }
    ]
  },

  // ==========================================
  // SECTION B: THEORY ESSAYS (45 MARKS - ANSWER 3 ONLY)
  // ==========================================
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
Green plants possess chlorophyll and require radiant sunlight to drive photosynthesis ($6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$). Solar radiation penetrates only the photic zone (upper 100 to 200 meters) and cannot reach the abyssal ocean depths. In perpetual darkness, green plants cannot synthesize food and cannot survive.

(ii) Pawpaw producing flowers but no fruits:
Pawpaw (*Carica papaya*) is a dioecious species possessing separate male and female plants, and relies on biological vectors (insects such as bees and moths, or birds) for cross-pollination. Without these animal vectors on the island, pollen grains from male anthers cannot be transferred to the sticky stigmas of female flowers. Because pollination and subsequent double fertilization fail to occur, the floral ovaries never mature into fruits.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "Describe how agricultural soil is formed from parent bedrock through the physical, chemical, and biological processes of weathering.",
        workedSolution: `Soil is formed through the weathering of parent bedrock over geological time:
1. Physical (Mechanical) Weathering: Diurnal temperature variations cause rocks to expand and contract unevenly, creating thermal stress fractures. Running river water, abrasive wind-blown sand, and freezing ice further grind and shatter rocks into finer mineral fragments.
2. Chemical Weathering: Rainwater containing dissolved carbon dioxide (forming weak carbonic acid) and oxygen reacts with rock minerals through hydrolysis, oxidation, and carbonation, chemically breaking down hard primary minerals into soft secondary clays and soluble mineral salts.
3. Biological Weathering: Pioneer lichens, mosses, and fungal hyphae secrete organic acids that etch and crumble rock surfaces. Growing plant roots penetrate microscopic crevices, wedging rock masses apart. When plants and soil organisms die, decomposers humify their remains into dark organic matter (humus) that blends with weathered mineral particles to form topsoil.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: `(i) State the two fundamental laws of specular light reflection on a plane mirror.
(ii) With the aid of a clearly labelled ray diagram, show the reflection of light on a plane mirror, indicating the Normal, Incident Ray, Reflected Ray, Angle of Incidence ($i$), and Angle of Reflection ($r$):

${svgQ2cReflectionPlaneMirror}`,
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
1. Fresh carrots (rich in beta-carotene provitamin)
2. Red palm oil
3. Fresh beef liver, egg yolks, and whole milk
4. Dark green leafy vegetables (spinach, kontomire / cocoyam leaves)
5. Ripe pawpaw and mangoes`,
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
1. Converts useful mechanical energy into wasted thermal energy, reducing the mechanical efficiency of machines below 100%.
2. Causes abrasive surface wear and tear on moving engine parts, bearings, and vehicle tyre treads.

(iii) Advantages of friction:
1. Provides traction between shoe soles and the ground, enabling humans and animals to walk without slipping.
2. Enables vehicular brake pads to grip rotating wheel drums/discs to decelerate and stop moving vehicles.
3. Enables abrasive sharpening of cutting blades on whetstones and allows nails/screws to hold in wood.`,
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
1. ABO blood group phenotype (A, B, AB, O)
2. Sickle cell hemoglobin genotype (HbA / HbS)
3. Morphological eye iris color / skin complexion
4. Ability or inability to roll the lateral edges of the tongue (tongue-rolling trait)
5. Attachment of earlobes (free vs. attached)`,
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
5. Screw / Wedge

(iii) Why efficiency cannot equal 100%:
Mechanical efficiency is defined as $\\text{Efficiency} = \\frac{\\text{Work Output}}{\\text{Work Input}} \\times 100\\%$. In any real machine, a portion of the input energy is always converted into wasted thermal heat to overcome friction between moving contact parts, and extra work is needed to lift the weight of the machine parts themselves, meaning useful work output is always less than work input.`,
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

async function seedBece2009SciencePaper2Variant() {
  console.log('Seeding 2009 BECE Integrated Science Paper 2 Variant (Set 101) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2009_variant');

  await docRef.set({
    paper2: {
      id: "paper_2009_variant_p2",
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer four questions in all. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2Science2009Questions
    },
    metadata: {
      paper2Calibrated: true,
      set101Verified: true,
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  }, { merge: true });
  console.log('✅ Successfully seeded Set 101 into past_papers/paper_2009_variant.');

  // Single-document read pattern
  const topicDocRef = db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2009_variant_p2');
  await topicDocRef.set({
    id: "paper_2009_variant_p2",
    year: 2009,
    subject: "Integrated Science",
    setNumber: 101,
    title: "Paper 2: Practical & Theory Essay (Variant)",
    durationMinutes: 75,
    instructions: "Answer four questions in all. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
    totalQuestions: 5,
    questions: paper2Science2009Questions,
    updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
  }, { merge: true });
  console.log('✅ Successfully seeded Set 101 into topics/bece_past_papers/question_sets/paper_2009_variant_p2.');

  console.log('🌟 Successfully seeded Set 101 (2009 Science Paper 2 Variant) into Firestore.');
}

seedBece2009SciencePaper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 101 Science Paper 2:', err);
    process.exit(1);
  });
