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

// 1. Vector SVG for Q1(a): Magnetization of Bar AB by Single Touch Method [Reconstructed from Image 1]
const svgQ1aMagnetizationSingleTouch = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 180' width='100%' height='165' style='max-width: 460px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Stationary Steel Bar AB to be Magnetized -->
    <rect x='50' y='105' width='280' height='26' rx='2' fill='#1e293b' stroke='#94a3b8' stroke-width='2'/>
    <text x='62' y='122' font-size='12' font-weight='bold' fill='#38bdf8'>A</text>
    <text x='318' y='122' font-size='12' font-weight='bold' fill='#38bdf8'>B</text>
    <text x='190' y='122' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>Steel Bar (AB)</text>

    <!-- Permanent Stroking Magnet (Tilted at ~20 degrees) -->
    <g transform='translate(75, 45) rotate(18)'>
      <!-- South Pole End -->
      <rect x='0' y='0' width='45' height='22' fill='#3b82f6' stroke='#1d4ed8' stroke-width='1.2'/>
      <text x='22' y='16' font-size='11' font-weight='bold' fill='#ffffff' text-anchor='middle'>S</text>
      <!-- North Pole End (Stroking Pole Touching Bar) -->
      <rect x='45' y='0' width='45' height='22' fill='#ef4444' stroke='#b91c1c' stroke-width='1.2'/>
      <text x='67' y='16' font-size='11' font-weight='bold' fill='#ffffff' text-anchor='middle'>N</text>
    </g>

    <!-- Stroking Direction Arrows (A -> B) -->
    <g transform='translate(0, 92)'>
      <line x1='80' y1='0' x2='120' y2='0' stroke='#f59e0b' stroke-width='2.5'/>
      <polygon points='118,-3 126,0 118,3' fill='#f59e0b'/>
      
      <line x1='160' y1='0' x2='200' y2='0' stroke='#f59e0b' stroke-width='2.5'/>
      <polygon points='198,-3 206,0 198,3' fill='#f59e0b'/>

      <line x1='240' y1='0' x2='280' y2='0' stroke='#f59e0b' stroke-width='2.5'/>
      <polygon points='278,-3 286,0 278,3' fill='#f59e0b'/>
    </g>

    <!-- Lift-off arc indication -->
    <path d='M 305 85 Q 330 40 200 25 Q 90 25 80 55' fill='none' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='4,3'/>
    <polygon points='84,52 80,60 76,52' fill='#38bdf8'/>

    <text x='190' y='160' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>SINGLE TOUCH MAGNETIZATION: STROKING WITH NORTH POLE FROM A TO B</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q1(b): Laboratory Gas Preparation via Downward Displacement of Water [Reconstructed from Image 2]
const svgQ1bGasPreparationWater = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Flat-bottom Generating Flask III -->
    <g transform='translate(50, 60)'>
      <!-- Flask Body -->
      <path d='M 35 45 L 35 15 L 45 15 L 45 45 Q 75 75 75 110 L 5 110 Q 5 75 35 45 Z' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.8'/>
      <!-- Solid/Liquid Reactants III Content -->
      <rect x='10' y='85' width='60' height='24' fill='#38bdf8' opacity='0.5'/>
      <text x='40' y='100' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Reactants</text>
      <!-- Rubber Stopper -->
      <rect x='33' y='11' width='14' height='10' fill='#d97706'/>
      
      <!-- Thistle Funnel I -->
      <line x1='37' y1='-25' x2='37' y2='95' stroke='#cbd5e1' stroke-width='2'/>
      <polygon points='30,-25 44,-25 39,-12 35,-12' fill='#334155' stroke='#cbd5e1'/>
      <text x='15' y='-30' font-size='10' font-weight='bold' fill='#f59e0b'>I (Thistle Funnel)</text>
      
      <text x='40' y='130' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III (Flask)</text>
    </g>

    <!-- Delivery Tube II -->
    <path d='M 93 72 L 93 45 L 175 45 L 245 155 L 285 155' fill='none' stroke='#cbd5e1' stroke-width='3'/>
    <text x='140' y='38' font-size='10' font-weight='bold' fill='#cbd5e1'>II (Delivery Tube)</text>

    <!-- Water Trough & Beehive Shelf -->
    <g transform='translate(200, 110)'>
      <!-- Water Trough -->
      <rect x='0' y='30' width='160' height='75' rx='3' fill='#0284c7' opacity='0.15' stroke='#64748b' stroke-width='2'/>
      <rect x='1' y='45' width='158' height='58' fill='#38bdf8' opacity='0.35'/>
      <text x='150' y='60' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='end'>Water Trough</text>

      <!-- Beehive Shelf Support -->
      <rect x='60' y='65' width='50' height='38' fill='#334155' stroke='#94a3b8' stroke-width='1.5'/>
      <path d='M 75 103 L 75 88 Q 85 80 95 88 L 95 103 Z' fill='#0f172a'/>

      <!-- Inverted Gas Jar IV -->
      <rect x='65' y='-50' width='40' height='115' rx='3' fill='#0284c7' opacity='0.25' stroke='#f59e0b' stroke-width='2'/>
      <!-- Depressed water level in jar -->
      <rect x='66' y='15' width='38' height='50' fill='#38bdf8' opacity='0.4'/>
      <line x1='65' y1='15' x2='105' y2='15' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Rising Gas Bubbles -->
      <circle cx='85' cy='50' r='3' fill='#ffffff'/><circle cx='82' cy='35' r='3' fill='#ffffff'/>
      <circle cx='88' cy='22' r='3' fill='#ffffff'/>
      <!-- Gas Collected -->
      <text x='85' y='-20' font-size='9' font-weight='bold' fill='#fde047' text-anchor='middle'>Gas</text>
      <text x='115' y='-45' font-size='10' font-weight='bold' fill='#f59e0b'>IV (Gas Jar)</text>
    </g>

    <text x='190' y='220' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>DOWNWARD DISPLACEMENT OF WATER (OVER-WATER GAS COLLECTION)</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 3. Vector SVG for Q1(c): Exhaled Breath Bubbled through Limewater [Reconstructed from Image 3]
const svgQ1cLimewaterExhalation = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 210' width='100%' height='190' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Test Tube -->
    <g transform='translate(155, 35)'>
      <rect x='0' y='0' width='40' height='130' rx='18' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='2'/>
      <!-- Milky Precipitate Liquid Level (CaCO3 in Ca(OH)2) -->
      <rect x='2' y='55' width='36' height='72' rx='16' fill='#f8fafc' opacity='0.7'/>
      <!-- Milky particles dots -->
      <circle cx='10' cy='85' r='1.5' fill='#cbd5e1'/><circle cx='25' cy='95' r='1.5' fill='#cbd5e1'/>
      <circle cx='18' cy='110' r='1.5' fill='#cbd5e1'/><circle cx='30' cy='75' r='1.5' fill='#cbd5e1'/>
      
      <!-- Delivery Tube from Mouth dipping into liquid -->
      <path d='M -100 20 L 15 20 L 15 110' fill='none' stroke='#cbd5e1' stroke-width='3'/>
      <path d='M -100 25 L 20 25 L 20 110' fill='none' stroke='#cbd5e1' stroke-width='1.2'/>
      <!-- Effervescent Gas Bubbles from delivery tip -->
      <circle cx='17' cy='105' r='3' fill='#ffffff'/><circle cx='22' cy='90' r='3.5' fill='#ffffff'/>
      <circle cx='14' cy='75' r='4' fill='#ffffff'/><circle cx='24' cy='60' r='3.5' fill='#ffffff'/>
    </g>

    <!-- Inflow Arrow and Label -->
    <g transform='translate(40, 48)'>
      <line x1='0' y1='0' x2='40' y2='0' stroke='#38bdf8' stroke-width='2'/>
      <polygon points='38,-4 46,0 38,4' fill='#38bdf8'/>
      <text x='-5' y='-8' font-size='10' font-weight='bold' fill='#38bdf8'>Air Breathed Out</text>
      <text x='-5' y='6' font-size='9' fill='#94a3b8'>from the Mouth</text>
    </g>

    <!-- Limewater turns milky pointer -->
    <line x1='205' y1='130' x2='260' y2='130' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='265' y='134' font-size='10' font-weight='bold' fill='#f8fafc'>Limewater Turns Milky</text>

    <text x='170' y='192' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Ca(OH)₂ (aq) + CO₂ (g) → CaCO₃ (s)↓ + H₂O (l)</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 4. Vector SVG for Q2(c): Particle Arrangements in States of Matter
const svgQ2cStatesOfMatter = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 150' width='100%' height='140' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Solid (Ordered Lattice) -->
    <g transform='translate(25, 20)'>
      <rect x='0' y='0' width='85' height='85' rx='3' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <g fill='#38bdf8'>
        <circle cx='18' cy='18' r='6'/><circle cx='36' cy='18' r='6'/><circle cx='54' cy='18' r='6'/><circle cx='72' cy='18' r='6'/>
        <circle cx='18' cy='36' r='6'/><circle cx='36' cy='36' r='6'/><circle cx='54' cy='36' r='6'/><circle cx='72' cy='36' r='6'/>
        <circle cx='18' cy='54' r='6'/><circle cx='36' cy='54' r='6'/><circle cx='54' cy='54' r='6'/><circle cx='72' cy='54' r='6'/>
        <circle cx='18' cy='72' r='6'/><circle cx='36' cy='72' r='6'/><circle cx='54' cy='72' r='6'/><circle cx='72' cy='72' r='6'/>
      </g>
      <text x='42' y='105' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Solid (Fixed)</text>
    </g>

    <!-- Liquid (Close but Disordered) -->
    <g transform='translate(145, 20)'>
      <rect x='0' y='0' width='85' height='85' rx='3' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <g fill='#10b981'>
        <circle cx='20' cy='35' r='6'/><circle cx='35' cy='22' r='6'/><circle cx='56' cy='28' r='6'/><circle cx='70' cy='40' r='6'/>
        <circle cx='28' cy='52' r='6'/><circle cx='48' cy='48' r='6'/><circle cx='68' cy='60' r='6'/><circle cx='16' cy='68' r='6'/>
        <circle cx='36' cy='72' r='6'/><circle cx='55' cy='68' r='6'/><circle cx='72' cy='75' r='6'/>
      </g>
      <text x='42' y='105' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>Liquid (Fluid)</text>
    </g>

    <!-- Gas (Far Apart and Random) -->
    <g transform='translate(265, 20)'>
      <rect x='0' y='0' width='85' height='85' rx='3' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/>
      <g fill='#f59e0b'>
        <circle cx='20' cy='25' r='6'/><circle cx='68' cy='20' r='6'/>
        <circle cx='42' cy='50' r='6'/>
        <circle cx='22' cy='75' r='6'/><circle cx='70' cy='70' r='6'/>
      </g>
      <text x='42' y='105' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Gas (Dispersed)</text>
    </g>

    <text x='190' y='135' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>PARTICLE ARRANGEMENT IN SOLID, LIQUID, AND GAS PHASES</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

const paper2Science2007Questions = [
  // ==========================================
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `In a laboratory physics experiment on magnetism, an unmagnetized steel bar AB is magnetized by repeatedly dragging the North pole of a permanent bar magnet along its surface from end A to end B several times as illustrated below:

${svgQ1aMagnetizationSingleTouch}

(i) Mention the specific method of magnetization demonstrated in the diagram.
(ii) State the magnetic polarity acquired by end A and end B of the steel bar after magnetization.
(iii) Describe how you would experimentally test and confirm that bar AB has become a magnet.
(iv) Describe how you would test and determine the exact magnetic poles of ends A and B using a known bar magnet.
(v) State one essential precaution that must be taken during this magnetization process.
(vi) Name one other practical method used to make permanent magnets.`,
        workedSolution: `(i) Method of magnetization:
Single touch method (or single stroke method).

(ii) Polarity of ends:
• End A: North pole (N) [acquires the same polarity as the stroking pole at the starting contact point].
• End B: South pole (S) [acquires opposite polarity to the stroking pole at the point where the magnet is lifted off].

(iii) Testing if bar AB is a magnet:
Bring small ferromagnetic materials (such as iron filings, steel pins, or paper clips) near ends A and B of the bar. If the bar attracts and holds the filings at its ends, it has successfully become magnetized.

(iv) Testing for poles of A and B:
Suspend the magnetized bar AB horizontally on a thread so it swings freely in the Earth's magnetic field, or bring the known North pole of a marked bar magnet near each end in turn:
• The end that repels the North pole of the known magnet is confirmed to be the North pole (End A).
• The end that attracts the North pole and repels the South pole is confirmed to be the South pole (End B).
*(Scientific Note: Magnetic repulsion is the only sure test for a magnet's polarity, as attraction can occur with any unmagnetized magnetic material).*

(v) Precaution:
1. The magnet must be stroked in one continuous direction only (from A to B) and lifted high above the bar in a wide arc before returning to the start.
2. Never rub the magnet back and forth along the bar, as reverse stroking randomizes magnetic domains and cancels magnetization.

(vi) Other method of magnetization:
Electrical method (placing the steel bar inside a solenoid coil and passing direct current through it) or Divided touch method.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `The laboratory apparatus set-up illustrated below is used to prepare and collect gases:

${svgQ1bGasPreparationWater}

(i) Give the names of the laboratory apparatus components labelled I, II, III, and IV.
(ii) State the two recognized scientific names for this method of gas collection.
(iii) Explain how the gas collects inside the inverted gas jar over water.
(iv) Name two chemical gases that are routinely prepared and collected in the laboratory using this set-up.`,
        workedSolution: `(i) Identification of components:
• I: Thistle funnel
• II: Delivery tube
• III: Flat-bottomed flask (or generating flask)
• IV: Gas jar (inverted over water trough)

(ii) Names of collection method:
1. Downward displacement of water
2. Over-water collection (collection over water)

(iii) How gas collects:
As the chemical reaction proceeds in flask III, generated gas passes through delivery tube II into the water trough. Because the gas is insoluble (or only sparingly soluble) in water and less dense than water, gas bubbles rise to the top of the inverted gas jar. The accumulated gas exerts downward pressure that forces the water level down, displacing water into the trough.

(iv) Gases prepared with this setup:
Oxygen (\\text{O}_2), Hydrogen (\\text{H}_2), or Nitrogen (\\text{N}_2). *(Only gases that do not dissolve significantly in water can be collected using this method).*`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `The experimental set-up below illustrates exhaled breath from the mouth being bubbled through a glass tube into a test-tube containing a clear solution of calcium hydroxide (limewater):

${svgQ1cLimewaterExhalation}

(i) Why does the clear limewater turn milky (cloudy) when exhaled air is bubbled through it?
(ii) Identify the chemical substance responsible for the milky precipitate.
(iii) Write a balanced chemical equation for the reaction that occurred.
(iv) Name two other physical or chemical substances present in exhaled human breath.
(v) State the primary scientific aim of this experiment.`,
        workedSolution: `(i) Why limewater turns milky:
Exhaled breath contains carbon (IV) oxide gas (\\text{CO}_2), which reacts chemically with dissolved calcium hydroxide in limewater to precipitate tiny insoluble white particles of calcium carbonate.

(ii) Identity of milky substance:
Calcium carbonate (\\text{CaCO}_3).

(iii) Balanced chemical equation:
$$\\text{Ca(OH)}_{2(aq)} + \\text{CO}_{2(g)} \\to \\text{CaCO}_{3(s)}\\downarrow + \\text{H}_2\\text{O}_{(l)}$$

(iv) Other substances in exhaled breath:
1. Water vapor (\\text{H}_2\\text{O})
2. Nitrogen gas (\\text{N}_2)
3. Unconsumed oxygen gas (\\text{O}_2, approximately $16\\%$)

(v) Aim of the experiment:
To demonstrate that human aerobic cellular respiration produces carbon (IV) oxide (\\text{CO}_2) which is expelled into the atmosphere during breathing.`,
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
        prompt: "What is a living cell in biological science?",
        workedSolution: `A living cell is the basic microscopic structural, functional, and biological unit of all living organisms capable of independent existence and carrying out essential metabolic life processes.`,
        maxMarks: 2
      },
      {
        subId: "(b)",
        prompt: "State one primary physiological function for each of the following cellular components:\n(i) Cell membrane (plasma membrane);\n(ii) Chloroplast;\n(iii) Nucleus.",
        workedSolution: `(i) Cell membrane:
Acts as a selectively permeable barrier that regulates the entry and exit of substances in and out of the cell, protecting internal protoplasmic contents.

(ii) Chloroplast:
Contains chlorophyll pigments and thylakoid enzymes that absorb solar photon energy to synthesize glucose carbohydrates via photosynthesis.

(iii) Nucleus:
Houses the genetic material (DNA/chromosomes) that directs cell division, governs hereditary transmission, and coordinates all cellular metabolic activities.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: `Make clear scientific sketches showing the spatial arrangement of particles in each of the three physical states of matter (Solid, Liquid, Gas):<br/>${svgQ2cStatesOfMatter}`,
        workedSolution: `Particle Arrangements (refer to diagram):
1. Solid: Particles are tightly packed together in an orderly, fixed geometric lattice held by strong intermolecular forces, vibrating only in fixed positions.
2. Liquid: Particles are closely packed but arranged disorderly, possessing sufficient kinetic energy to slide past one another, taking the shape of their container.
3. Gas: Particles are widely separated with large intermolecular spaces, moving rapidly and randomly in all directions with negligible intermolecular attraction.`,
        maxMarks: 6
      },
      {
        subId: "(d)",
        prompt: "Name the specific scientific instrument used to measure each of the following physical quantities:\n(i) Volume of a liquid;\n(ii) Gravitational mass of a stone;\n(iii) Duration of time;\n(iv) Velocity of atmospheric wind.",
        workedSolution: `(i) Volume of a liquid: Graduated measuring cylinder (or burette / pipette).
(ii) Mass of a stone: Beam balance (or electronic balance).
(iii) Time: Stopwatch (or digital timer / clock).
(iv) Speed of wind: Cup anemometer.`,
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
        prompt: "Name three nutritional deficiency diseases associated with human diet and state the specific dietary nutrient lack responsible for each disease.",
        workedSolution: `1. Kwashiorkor: Caused by severe dietary deficiency of proteins.
2. Scurvy: Caused by dietary deficiency of Vitamin C (ascorbic acid).
3. Rickets: Caused by dietary deficiency of Vitamin D or calcium minerals.
4. Night blindness (Nyctalopia): Caused by dietary deficiency of Vitamin A (retinol).
5. Nutritional anemia: Caused by dietary deficiency of iron.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "(i) What is hard water in chemistry?\n(ii) Mention three physical or chemical methods by which hard water can be converted into soft water.",
        workedSolution: `(i) Definition of hard water:
Water containing dissolved divalent mineral salts of calcium (\\text{Ca}^{2+}) or magnesium (\\text{Mg}^{2+}) that reacts with soap to precipitate an insoluble scum, failing to form lather readily.

(ii) Methods of softening hard water:
1. Boiling: Decomposes dissolved calcium and magnesium hydrogencarbonates (for temporary hardness).
2. Addition of washing soda (sodium carbonate, \\text{Na}_2\\text{CO}_3): Precipitates dissolved \\text{Ca}^{2+} and \\text{Mg}^{2+} ions as insoluble carbonates.
3. Ion-exchange process (zeolite / permutit method): Replaces hardness cations with soluble sodium ions (\\text{Na}^+).
4. Distillation: Evaporates pure water vapor away from dissolved mineral salts.`,
        maxMarks: 8
      },
      {
        subId: "(c)",
        prompt: "(i) Explain how acoustic sound is produced in physical science.\n(ii) State one musical instrument example for each of: (α) A wind musical instrument; (β) A string musical instrument.",
        workedSolution: `(i) How sound is produced:
Sound is generated by the mechanical vibrations of an object. The vibrating source sets adjacent air particles into vibration, creating compressions and rarefactions that propagate as longitudinal sound waves through an elastic medium to the ear.

(ii) Musical instrument examples:
• (α) Wind instrument: Flute, trumpet, saxophone, or recorder (sound produced by vibrating air columns).
• (β) String instrument: Guitar, violin, harp, or cello (sound produced by vibrating stretched strings).`,
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
        prompt: "Give two biological examples each of:\n(i) A carnivorous animal;\n(ii) An herbivorous animal.",
        workedSolution: `(i) Carnivores: Lion, tiger, leopard, dog, hawk, eagle.
(ii) Herbivores: Cow, sheep, goat, grasscutter, rabbit, elephant.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "In human physiology, state the biological difference between the processes of egestion and excretion.",
        workedSolution: `• Excretion: The physiological discharge and elimination of toxic metabolic waste products resulting from cellular biochemical reactions (e.g., urea via kidneys, carbon dioxide via lungs, sweat salts via skin).
• Egestion: The discharge and evacuation of undigested, unabsorbed solid food residue (feces) from the alimentary canal through the anus, which never took part in cellular metabolism.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "Explain briefly why:\n(i) Pure gold is widely preferred for making ornaments, earrings, and necklaces.\n(ii) Carbon steel is used instead of pure soft iron for constructing motor vehicle bodies.",
        workedSolution: `(i) Why gold is preferred for jewelry:
Gold is a noble, chemically unreactive metal that does not tarnish or oxidize when exposed to air, moisture, or sweat, permanently preserving its lustrous metallic shine. It is also highly malleable and ductile, allowing it to be worked into intricate jewelry shapes.

(ii) Why steel is used instead of pure iron:
Pure iron is soft, ductile, and rusts rapidly when exposed to environmental moisture. Carbon steel is an alloy that is harder, stronger, and possesses higher tensile strength, resisting mechanical denting and providing superior structural safety for vehicle chassis.`,
        maxMarks: 6
      },
      {
        subId: "(d)",
        prompt: "(i) What is surface tension in fluid physics?\n(ii) Explain why the surface meniscus of clean water in a glass container is not flat but curves upward at the edges.",
        workedSolution: `(i) Definition of surface tension:
The property of a liquid surface that causes it to behave like a stretched elastic membrane, caused by unbalanced inward cohesive forces pulling surface molecules into the liquid bulk.

(ii) Why water forms a curved concave meniscus:
Water in a glass container experiences both cohesive forces (attraction between water molecules) and adhesive forces (attraction between water molecules and glass molecules). Because the adhesive attraction between water and glass molecules exceeds the internal cohesive attraction of water molecules, water wets the glass walls and climbs upward at the perimeter, forming a concave meniscus.`,
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
        prompt: `Copy and complete the epidemiological table below by providing the missing entries for diseases, causative agents, and preventive measures:

| Disease | Causative Agent | Prevention / Control |
| :--- | :--- | :--- |
| **Cholera** | *Vibrio cholerae* | Eating hot cooked food / chlorinated water |
| (i) ..................... | *Plasmodium spp.* | (ii) ...................... |
| (iii) .................... | Head louse (*Pediculus*) | Personal body hygiene / clean bedding |
| **Ringworm** | (iv) ........................ | (v) .................................. |`,
        workedSolution: `Completed Disease Table:

| Disease | Causative Agent | Prevention / Control |
| :--- | :--- | :--- |
| **Cholera** | *Vibrio cholerae* | Eating hot cooked food / chlorinated water |
| **(i) Malaria** | *Plasmodium spp.* | **(ii) Sleeping under insecticide-treated bednets / clearing mosquito breeding pools** |
| **(iii) Pediculosis (Lice infestation)** | Head louse (*Pediculus*) | Personal body hygiene / clean bedding |
| **Ringworm** | **(iv) Pathogenic fungus (*Tinea spp.* / *Microsporum*)** | **(v) Avoiding sharing personal towels/combs and applying antifungal ointments** |`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "Name two distinct particles or ions of matter that carry:\n(i) A net negative electrical charge;\n(ii) A net positive electrical charge;\n(iii) Zero electrical charge (neutral).",
        workedSolution: `(i) Negative charge: Electron, Chloride ion (\\text{Cl}^-), Hydroxide ion (\\text{OH}^-).
(ii) Positive charge: Proton, Alpha particle ($He^{2+}$), Sodium ion (\\text{Na}^+), Calcium ion (\\text{Ca}^{2+}).
(iii) Zero charge: Neutron, uncharged neutral atom (e.g., Neon atom), neutral molecule (e.g., \\text{H}_2\\text{O}).`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: `A simple mechanical machine raises a load of $20.0\\text{ N}$ through a vertical distance of $2.0\\text{ m}$. An effort force of $25.0\\text{ N}$ is applied, moving through an effort distance of $4.0\\text{ m}$. Calculate:
(i) The work input of the machine;
(ii) The work output of the machine;
(iii) The mechanical efficiency of the machine.`,
        workedSolution: `(i) Work input:
$$\\text{Work Input} = \\text{Effort} \\times \\text{Effort Distance}$$
$$\\text{Work Input} = 25.0\\text{ N} \\times 4.0\\text{ m} = 100.0\\text{ Joules (J)}$$

(ii) Work output:
$$\\text{Work Output} = \\text{Load} \\times \\text{Load Distance}$$
$$\\text{Work Output} = 20.0\\text{ N} \\times 2.0\\text{ m} = 40.0\\text{ Joules (J)}$$

(iii) Mechanical efficiency:
$$\\text{Efficiency} = \\frac{\\text{Work Output}}{\\text{Work Input}} \\times 100\\%$$
$$\\text{Efficiency} = \\frac{40.0\\text{ J}}{100.0\\text{ J}} \\times 100\\% = 40.0\\%$$
Answer: Efficiency is $$40\\%$$.`,
        maxMarks: 8
      }
    ]
  }
];

async function seedBece2007SciencePaper2Only() {
  console.log('Seeding 2007 BECE Integrated Science Paper 2 (Section B) Variant (Set 105) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2007_variant');

  await docRef.set({
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer four questions in all. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2Science2007Questions
    },
    metadata: {
      paper2Calibrated: true,
      set105Verified: true,
      sourceImages: ["IMG_2576.jpg", "IMG_2577.jpg", "IMG_2578.jpg"],
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  }, { merge: true });

  console.log('✅ Successfully seeded Set 105 (2007 Science Paper 2 Variant) into past_papers/paper_2007_variant.');

  // Also sync single-document read paths for Paper 2
  const p2Data = {
    id: "paper_2007_variant_p2",
    title: "2007 BECE Integrated Science Paper 2 (Set 105 Theory & Practical)",
    tier: "Junior Secondary (JHS)",
    subject: "Integrated Science",
    topic: "2007 BECE Standardized Theory & Practical Examination",
    variantType: "past_paper_variant",
    year: 2007,
    paperType: 2,
    setNumber: 105,
    era: "classic",
    totalQuestions: 5,
    version: 1,
    format: "structured_essay",
    durationMinutes: 75,
    instructions: "Answer four questions in all. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
    questions: paper2Science2007Questions,
    metadata: {
      sanitized: true,
      vectorGraphicsCount: 4,
      sourcePhotographsIntegrated: ["IMG_2576.jpg", "IMG_2577.jpg", "IMG_2578.jpg"],
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  };

  const p2Paths = [
    'global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2007_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/past_papers/question_sets/paper_2007_variant_p2',
    'global_curriculum/jhs/subjects/science/topics/bece_2007_variant/question_sets/paper_2007_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_past_papers/question_sets/paper_2007_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/past_papers/question_sets/paper_2007_variant_p2',
    'global_curriculum/jhs/subjects/integrated_science/topics/bece_2007_variant/question_sets/paper_2007_variant_p2',
  ];

  for (const p of p2Paths) {
    await db.doc(p).set(p2Data, { merge: true });
    console.log('✅ Ingested P2 ->', p);
  }

  console.log('🎉 Set 105 (2007 Science Paper 2) ingestion complete!');
}

seedBece2007SciencePaper2Only()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 105 Science Paper 2:', err);
    process.exit(1);
  });
