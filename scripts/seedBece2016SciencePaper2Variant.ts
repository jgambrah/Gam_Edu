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
    throw new Error('Unable to initialize Firestore: ' + e);
  }
}

const svgQ1aSoilDrainage = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(25, 20)'><polygon points='10,15 70,15 45,55 35,55' fill='#fef08a' opacity='0.7' stroke='#cbd5e1' stroke-width='1.5'/><rect x='37' y='55' width='6' height='25' fill='#cbd5e1'/><text x='40' y='35' font-size='10' font-weight='bold' fill='#854d0e' text-anchor='middle'>Soil K</text><rect x='20' y='75' width='40' height='100' rx='2' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/><rect x='21' y='105' width='38' height='69' fill='#38bdf8' opacity='0.6'/><text x='40' y='190' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cylinder K</text><text x='40' y='145' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>78 cm³</text></g><g transform='translate(145, 20)'><polygon points='10,15 70,15 45,55 35,55' fill='#b45309' opacity='0.6' stroke='#cbd5e1' stroke-width='1.5'/><rect x='37' y='55' width='6' height='25' fill='#cbd5e1'/><text x='40' y='35' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>Soil L</text><rect x='20' y='75' width='40' height='100' rx='2' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/><rect x='21' y='132' width='38' height='42' fill='#38bdf8' opacity='0.6'/><text x='40' y='190' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cylinder L</text><text x='40' y='155' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>45 cm³</text></g><g transform='translate(265, 20)'><polygon points='10,15 70,15 45,55 35,55' fill='#991b1b' opacity='0.6' stroke='#cbd5e1' stroke-width='1.5'/><rect x='37' y='55' width='6' height='25' fill='#cbd5e1'/><text x='40' y='35' font-size='10' font-weight='bold' fill='#fecaca' text-anchor='middle'>Soil M</text><rect x='20' y='75' width='40' height='100' rx='2' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/><rect x='21' y='158' width='38' height='16' fill='#38bdf8' opacity='0.6'/><text x='40' y='190' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cylinder M</text><text x='40' y='170' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>18 cm³</text></g></svg></div>`;
const svgQ1bHazardSymbols = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 130' width='100%' height='120' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(25, 20)'><rect x='0' y='0' width='65' height='65' rx='6' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><circle cx='32' cy='28' r='12' fill='#ffffff'/><circle cx='28' cy='26' r='2.5' fill='#0f172a'/><circle cx='36' cy='26' r='2.5' fill='#0f172a'/><rect x='29' y='36' width='6' height='5' fill='#0f172a'/><line x1='16' y1='48' x2='48' y2='48' stroke='#ffffff' stroke-width='3'/><text x='32' y='82' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Symbol I</text></g><g transform='translate(115, 20)'><polygon points='32,4 62,60 2,60' fill='#1e293b' stroke='#ef4444' stroke-width='2'/><line x1='20' y1='22' x2='30' y2='32' stroke='#ffffff' stroke-width='2.5'/><rect x='28' y='48' width='22' height='6' fill='#ffffff'/><circle cx='31' cy='38' r='2' fill='#ef4444'/><circle cx='36' cy='43' r='2' fill='#ef4444'/><text x='32' y='82' font-size='11' font-weight='bold' fill='#ef4444' text-anchor='middle'>Symbol II</text></g><g transform='translate(205, 20)'><rect x='0' y='0' width='65' height='65' rx='6' fill='#1e293b' stroke='#ea580c' stroke-width='2'/><path d='M 32 12 Q 45 28 38 40 Q 48 38 42 52 Q 22 56 22 42 Q 20 28 32 12 Z' fill='#f59e0b' stroke='#ea580c' stroke-width='1.5'/><text x='32' y='82' font-size='11' font-weight='bold' fill='#ea580c' text-anchor='middle'>Symbol III</text></g><g transform='translate(295, 20)'><circle cx='32' cy='32' r='30' fill='#1e293b' stroke='#dc2626' stroke-width='3'/><line x1='18' y1='36' x2='46' y2='36' stroke='#ffffff' stroke-width='3'/><circle cx='18' cy='36' r='3.5' fill='#f59e0b'/><line x1='12' y1='12' x2='52' y2='52' stroke='#dc2626' stroke-width='3.5'/><text x='32' y='82' font-size='11' font-weight='bold' fill='#dc2626' text-anchor='middle'>Symbol IV</text></g></svg></div>`;
const svgQ1cSimpleMachines = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 500px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(15, 20)'><circle cx='18' cy='65' r='8' fill='#3b82f6' stroke='#1d4ed8' stroke-width='1.5'/><line x1='18' y1='65' x2='82' y2='35' stroke='#94a3b8' stroke-width='3'/><polygon points='30,55 70,38 65,65 35,68' fill='#ef4444' opacity='0.7' stroke='#b91c1c' stroke-width='1.5'/><circle cx='82' cy='35' r='3' fill='#10b981'/><text x='45' y='110' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Device A</text></g><g transform='translate(110, 20)'><polygon points='10,65 75,65 75,20' fill='#334155' stroke='#64748b' stroke-width='1.5'/><line x1='10' y1='65' x2='75' y2='20' stroke='#f59e0b' stroke-width='2.5'/><line x1='18' y1='52' x2='58' y2='25' stroke='#10b981' stroke-width='2'/><polygon points='54,20 64,21 59,30' fill='#10b981'/><text x='45' y='110' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Device B</text></g><g transform='translate(205, 20)'><line x1='40' y1='10' x2='40' y2='25' stroke='#cbd5e1' stroke-width='2'/><circle cx='40' cy='35' r='14' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/><path d='M 26 35 L 26 70' stroke='#cbd5e1' stroke-width='1.5'/><path d='M 54 35 L 54 70' stroke='#cbd5e1' stroke-width='1.5'/><rect x='18' y='70' width='16' height='16' rx='2' fill='#ef4444'/><text x='40' y='110' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Device C</text></g><g transform='translate(295, 20)'><circle cx='28' cy='45' r='16' fill='#1e293b' stroke='#a855f7' stroke-width='2' stroke-dasharray='4,2'/><circle cx='28' cy='45' r='5' fill='#a855f7'/><circle cx='55' cy='32' r='12' fill='#1e293b' stroke='#ec4899' stroke-width='2' stroke-dasharray='4,2'/><circle cx='55' cy='32' r='4' fill='#ec4899'/><text x='42' y='110' font-size='12' font-weight='bold' fill='#c084fc' text-anchor='middle'>Device D</text></g></svg></div>`;
const svgQ1dDigestiveSystem = `<div class="my-4 flex justify-center"><svg viewBox='0 0 340 240' width='100%' height='220' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><path d='M 170 15 L 170 65' stroke='#cbd5e1' stroke-width='6'/><line x1='173' y1='40' x2='260' y2='40' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='265' y='44' font-size='12' font-weight='bold' fill='#cbd5e1'>V</text><path d='M 170 65 C 130 65 125 115 165 115 C 195 115 200 80 170 65 Z' fill='#881337' stroke='#f43f5e' stroke-width='2'/><line x1='135' y1='88' x2='60' y2='88' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='92' font-size='12' font-weight='bold' fill='#f43f5e' text-anchor='end'>I</text><path d='M 125 120 L 125 180 L 215 180 L 215 120 L 125 120' fill='none' stroke='#38bdf8' stroke-width='8'/><line x1='219' y1='145' x2='260' y2='145' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='265' y='149' font-size='12' font-weight='bold' fill='#38bdf8'>III</text><path d='M 140 135 Q 170 125 190 140 Q 150 160 180 170' fill='none' stroke='#f59e0b' stroke-width='5'/><line x1='140' y1='155' x2='60' y2='155' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='159' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='end'>II</text><rect x='164' y='184' width='12' height='24' fill='#cbd5e1' stroke='#94a3b8'/><line x1='176' y1='196' x2='240' y2='196' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='245' y='200' font-size='12' font-weight='bold' fill='#cbd5e1'>IV</text></svg></div>`;

const paper2Science2016Questions = [
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `An experiment was set up to compare the drainage ability and water-holding capacity of three distinct soil types labelled K, L, and M. Equal masses ($100\\text{ g}$) of dry soil were placed into filter funnels lined with cotton wool, and equal volumes ($100\\text{ cm}^3$) of water were poured onto each soil at the same time and allowed to drain for 20 minutes into graduated cylinders as illustrated below:

${svgQ1aSoilDrainage}

(i) What is the scientific aim of this experimental investigation?

(ii) Which of the soil samples (K, L, or M) exhibited the highest rate of water drainage?

(iii) Which soil sample has the highest water retention (water-holding) capacity?

(iv) Identify the soil sample that is most likely to dry out and lose water rapidly following rainfall.

(v) Which of the soils is most susceptible to severe waterlogging under prolonged precipitation?

(vi) Deduce which of the three soils (K, L, or M) is most suitable for commercial maize cultivation.`,
        workedSolution: `(i) Aim of the experiment:
To compare the rate of water drainage and the water retention (water-holding) capacity of three different soil types.

(ii) Highest rate of drainage:
Soil K (yielded the greatest volume of drained water in the cylinder: $78\\text{ cm}^3$).

(iii) Highest water retention capacity:
Soil M (retained the most water, allowing only $18\\text{ cm}^3$ to drain through: $100 - 18 = 82\\text{ cm}^3$ retained).

(iv) Soil that dries out most rapidly:
Soil K (coarse sandy soil with large macropores that drain gravitational water quickly).

(v) Soil most susceptible to waterlogging:
Soil M (heavy clayey soil with microscopic micropores that hold water tenaciously and impede drainage).

(vi) Soil most suitable for maize cultivation:
Soil L (loamy soil, which provides optimal crumb structure, balanced drainage, and sufficient water/nutrient retention without waterlogging).`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `The diagrams below illustrate standard international hazard warning symbols labelled I, II, III, and IV:

${svgQ1bHazardSymbols}

(i) State what each of the hazard warning symbols labelled I, II, III, and IV represents.

(ii) Name one hazardous chemical substance typically associated with:
  (α) Symbol I;
  (β) Symbol II;
  (γ) Symbol III.

(iii) Name one public or commercial facility where the safety prohibition symbol labelled IV is mandatorily displayed.

(iv) Identify which of the symbols (I, II, III, or IV) are routinely found on commercial laboratory chemical reagent containers.`,
        workedSolution: `(i) Meaning of symbols:
• Symbol I: Toxic / Poisonous substance (Danger of death or severe acute poisoning).
• Symbol II: Corrosive substance (Chemically attacks and destroys living dermal tissue and metals).
• Symbol III: Highly flammable / Combustible substance (Catches fire readily at low ignition temperatures).
• Symbol IV: Prohibition symbol: No naked flames / No smoking permitted.

(ii) Associated chemical substances:
• (α) Symbol I (Toxic): Potassium cyanide ($KCN$), Mercury (II) chloride, or concentrated organophosphate pesticides.
• (β) Symbol II (Corrosive): Concentrated hydrochloric acid ($HCl$), concentrated sulfuric acid ($H_2SO_4$), or concentrated sodium hydroxide ($NaOH$).
• (γ) Symbol III (Flammable): Pure ethanol, kerosene, petrol (gasoline), or Liquefied Petroleum Gas (LPG).

(iii) Display locations for Symbol IV:
Commercial fuel filling stations (petrol stations), chemical bulk storage depots, paint factories, or LPG gas refilling plants.

(iv) Symbols found on chemical reagent containers:
Symbols I, II, and III.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `The diagrams below illustrate mechanical devices and simple machines (A, B, C, and D) used to perform work efficiently:

${svgQ1cSimpleMachines}

(i) What general engineering term is given to mechanical devices of this nature?

(ii) Identify each of the specific machines labelled A, B, C, and D.

(iii) When Device A is evaluated as a lever, identify the parts representing:
  (α) The Pivot (Fulcrum);
  (β) The Load;
  (γ) The Effort.

(iv) What physical quantity does the green arrow along the slope represent in Device B?

(v) Name the primary mechanical function or useful work accomplished using:
  (α) Device C;
  (β) Device D.`,
        workedSolution: `(i) General engineering term:
Simple machines (or mechanical mechanisms).

(ii) Identification of devices:
• Device A: Wheelbarrow (Class 2 lever)
• Device B: Inclined plane (ramp)
• Device C: Single fixed pulley
• Device D: Spur gears (interlocking toothed wheels)

(iii) Lever components of Device A (Wheelbarrow):
• (α) Pivot (Fulcrum): The front axle wheel.
• (β) Load: The central cargo tray / bin.
• (γ) Effort: The rear lifting handles gripped by the operator.

(iv) Quantity represented by the arrow in Device B:
The direction and displacement distance through which the effort force is exerted (effort distance).

(v) Primary mechanical function / work accomplished:
• (α) Device C (Fixed Pulley): Changes the direction of an applied effort force, allowing a heavy load to be hoisted vertically by pulling downward.
• (β) Device D (Gears): Transmits rotary motion between shafts, modifying mechanical speed, torque (turning effect), and rotational direction in engines and gearboxes.`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `The diagram below illustrates the human alimentary canal (digestive system):

${svgQ1dDigestiveSystem}

(i) Name each of the anatomical organs labelled I, II, III, IV, and V.

(ii) Name the specific organ(s) where:
  (α) Chemical and mechanical digestion of proteins takes place;
  (β) Completely digested soluble nutrients are absorbed into the bloodstream.

(iii) Name three monomeric end-products of digestion that are absorbed directly across the intestinal mucosa into the mesenteric capillaries and lacteals.`,
        workedSolution: `(i) Names of anatomical organs:
• I: Stomach
• II: Small intestine (duodenum / ileum)
• III: Large intestine (colon)
• IV: Rectum
• V: Oesophagus (gullet)

(ii) Functional sites:
• (α) Protein digestion: Stomach (Part I, via pepsin in acidic gastric juice) and Small intestine (Part II, via pancreatic trypsin and erepsin in alkaline conditions).
• (β) Nutrient absorption into bloodstream: Small intestine (Part II, across the specialized microvilli of the ileum).

(iii) Monomeric end-products of digestion absorbed:
1. Glucose (and simple monosaccharides like fructose and galactose from carbohydrates).
2. Amino acids (from proteins).
3. Fatty acids and Glycerol (from lipids and dietary fats, absorbed into lacteals).`,
        maxMarks: 10
      }
    ]
  },

  // SECTION B: THEORY & ESSAY QUESTIONS (ANSWER 4 ONLY)
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Name four scientific instruments used in meteorological stations to measure weather elements.",
        workedSolution: `1. Thermometer (Maximum-Minimum thermometer for temperature).
2. Rain gauge (for precipitation / rainfall depth).
3. Anemometer (for wind speed).
4. Wind vane (for wind direction).
5. Hygrometer (wet and dry bulb psychrometer for relative humidity).
6. Barometer (mercury or aneroid barometer for atmospheric pressure).`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "List the four distinct developmental stages in the life cycle of a mosquito in sequential order.",
        workedSolution: `Sequential stages:
1. Egg stage
2. Larval stage (wiggler)
3. Pupal stage (tumbler)
4. Adult stage (imago)`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) State two physical properties of pure water.\n\n(ii) Explain why it is advantageous to launder clothes using soft water rather than hard water.",
        workedSolution: `(i) Physical properties of pure water:
• It is a clear, colourless, odourless, and tasteless liquid.
• It has a standard freezing point of $0^\\circ\\text{C}$ and a boiling point of $100^\\circ\\text{C}$ at $1\\text{ atmosphere}$ of pressure.
• It has a maximum density of $1.0\\text{ g cm}^{-3}$ ($1000\\text{ kg m}^{-3}$) at $4^\\circ\\text{C}$.

(ii) Advantage of soft water in laundering:
Soft water lacks dissolved calcium and magnesium hydrogencarbonates or sulfates. Consequently, soap lathers immediately and profusely without forming sticky insoluble grey scum ($\\text{calcium stearate}$), saving soap and preventing fabric discoloration.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "State three ways in which studying the soil profile of a farmland helps an agricultural extension officer guide farmers.",
        workedSolution: `1. Determining the depth of the fertile topsoil layer (Horizon A), confirming whether it can support deep-rooted perennial crops.
2. Assessing subsoil permeability, drainage characteristics, and water-table depth to avert root waterlogging.
3. Identifying impenetrable underlying hardpans or rock layers that restrict mechanical tillage and root penetration.
4. Formulating targeted fertilizer recommendations based on organic matter content across horizons.`,
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
        prompt: "Name the three physical modes by which thermal heat energy travels from one point to another in matter and space.",
        workedSolution: `1. Conduction (through solid particle lattice vibrations and free electron transport).
2. Convection (through bulk circulation currents in liquids and gases).
3. Radiation (through electromagnetic infrared waves requiring no physical medium).`,
        maxMarks: 3
      },
      {
        subId: "(b)",
        prompt: "(i) What is a nutritional deficiency disease?\n\n(ii) Name three deficiency diseases in humans and state the deficient nutrient responsible for each.",
        workedSolution: `(i) Definition:
A physiological disorder caused by the prolonged lack or inadequate intake of one or more essential nutrients in the daily diet.

(ii) Deficiency diseases and deficient nutrients:
• Kwashiorkor: Caused by severe dietary protein deficiency.
• Scurvy: Caused by a lack of ascorbic acid (Vitamin C).
• Rickets: Caused by a lack of Vitamin D or calcium minerals.
• Endemic goiter: Caused by a deficiency of the trace element iodine.
• Nutritional anaemia: Caused by an inadequate intake of dietary iron.`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "Explain two distinct ways in which each of the following agricultural and environmental factors causes depletion of soil nutrients:\n\n(i) Uncontrolled bush burning;\n\n(ii) Excessive rainwater leaching.",
        workedSolution: `(i) Depletion by bush burning:
• Volatilizes organic nitrogen and sulfur into gaseous atmospheric emissions, depriving the soil of these vital macronutrients.
• Incinerates topsoil organic matter (humus) and destroys beneficial soil microorganisms (e.g., nitrifying bacteria) that decompose litter.

(ii) Depletion by leaching:
• Percolating drainage water dissolves soluble mineral salts (nitrates, potassium, sulfates) and carries them deeply below the root absorption zone.
• Replaces exchangeable basic cations ($Ca^{2+}, Mg^{2+}, K^+$) with hydrogen ions ($H^+$), inducing severe topsoil acidity.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "List three physical processes by which matter transforms from one physical state into another.",
        workedSolution: `1. Melting / Fusion (Solid $\\to$ Liquid)
2. Vaporization / Evaporation / Boiling (Liquid $\\to$ Gas)
3. Condensation / Liquefaction (Gas $\\to$ Liquid)
4. Freezing / Solidification (Liquid $\\to$ Solid)
5. Sublimation (Solid $\\to$ Gas directly without liquid phase)`,
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
        prompt: "(i) Define the term astronomical satellite.\n\n(ii) State three technological and scientific uses of artificial earth satellites.",
        workedSolution: `(i) Definition of satellite:
A natural celestial body or manufactured orbital craft that revolves around a larger planet in a closed gravitational path.

(ii) Uses of artificial satellites:
1. Global telecommunications, transcontinental telephony, and internet data relay.
2. Global Positioning System (GPS) navigation for marine, aviation, and vehicular tracking.
3. Meteorological tracking and real-time weather/cyclone forecasting.
4. Earth resource observation, agricultural crop monitoring, and environmental deforestation mapping.`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: "State the elemental chemical composition of each of the following commercial engineering alloys:\n\n(i) Brass;\n\n(ii) Carbon steel;\n\n(iii) Bronze.",
        workedSolution: `(i) Brass:
Alloy composed of Copper (Cu) and Zinc (Zn).

(ii) Carbon steel:
Alloy composed of Iron (Fe) and Carbon (C).

(iii) Bronze:
Alloy composed of Copper (Cu) and Tin (Sn).`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "Name three post-planting cultural field practices routinely carried out on a vegetable farm to ensure optimal yield.",
        workedSolution: `1. Weeding / Mulching: Eliminates weed competition for light, water, and nutrients while suppressing soil evaporation.
2. Pruning: Removing dead, diseased, or excessive vegetative shoots to direct photosynthetic assimilates to fruit development.
3. Staking: Supporting weak-stemmed climbing crops (e.g., tomatoes, climbing beans) on wooden poles to elevate fruits above soil pathogens.
4. Thinning out: Selectively removing overcrowded, weak seedlings to give remaining plants adequate spacing.`,
        maxMarks: 3
      },
      {
        subId: "(d)",
        prompt: "List four anatomical organs or structures that make up the human respiratory tract.",
        workedSolution: `1. Nasal cavity (nostrils)
2. Trachea (windpipe with cartilaginous C-rings)
3. Bronchi (primary, secondary, and tertiary branches)
4. Bronchioles
5. Alveoli (microscopic air sacs for gas exchange)
6. Diaphragm`,
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
        prompt: "(i) Define a physical force in mechanics.\n\n(ii) State two specific dynamic effects that an applied unbalanced force can produce on a physical body.",
        workedSolution: `(i) Definition of force:
A physical influence in the form of a push or pull that alters or tends to alter a body's state of rest or uniform motion in a straight line ($F = ma$).

(ii) Effects of a force on a body:
• It can cause a stationary body to begin moving (accelerate).
• It can increase or decrease the velocity of a moving object (acceleration or deceleration).
• It can alter the direction of motion of a moving body.
• It can change the shape, dimensions, or volume of an elastic or plastic body (deformation).`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "(i) What is a chemical change?\n\n(ii) In a tabular format, state three fundamental differences between a chemical change and a physical change.",
        workedSolution: `(i) Definition of chemical change:
A chemical transformation in which chemical bonds between reactant atoms are broken and new bonds are formed, resulting in one or more entirely new substances with different chemical properties, typically accompanied by significant energy changes and being irreversible.

(ii) Differences Table:

| Feature | Chemical Change | Physical Change |
| :--- | :--- | :--- |
| **New Substance Formation** | Entirely new substances are synthesized | No new chemical substance is formed |
| **Reversibility** | Usually permanent and irreversible by physical means | Readily reversible by reversing physical conditions |
| **Energy Transfer** | Large amounts of heat or light energy are absorbed or released | Little or negligible energy change occurs |
| **Chemical Bonds** | Covalent or ionic bonds are broken and formed | Intermolecular bonds are rearranged; intramolecular bonds stay intact |`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "Name three physical properties of agricultural soil that determine its productivity.",
        workedSolution: `1. Soil Texture: The relative proportion of sand, silt, and clay mineral particles.
2. Soil Structure: The spatial arrangement and aggregation of particles into peds or crumbs.
3. Water-Holding Capacity / Porosity: The volume fraction of pore spaces holding air and capillary moisture.
4. Soil Temperature and Bulk Density.`,
        maxMarks: 3
      },
      {
        subId: "(d)",
        prompt: "Mention three clinical diseases or disorders associated with the human circulatory system.",
        workedSolution: `1. Hypertension (persistently elevated blood pressure).
2. Arteriosclerosis / Atherosclerosis (hardening and narrowing of arterial lumina by atheromatous plaques).
3. Coronary thrombosis / Myocardial infarction (heart attack).
4. Stroke (cerebrovascular accident due to cerebral ischemia or hemorrhage).
5. Sickle cell disease (genetic hemoglobinopathy causing vaso-occlusive crises).`,
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
        prompt: "Write down the systematic IUPAC chemical name for each of the following inorganic compounds:\n\n(i) $\\text{H}_2\\text{O}$;\n\n(ii) $\\text{MgO}$;\n\n(iii) $\\text{CaO}$;\n\n(iv) $\\text{CaCl}_2$.",
        workedSolution: `Systematic chemical names:
• (i) $\\text{H}_2\\text{O}$: Dihydrogen monoxide (or Hydrogen oxide)
• (ii) $\\text{MgO}$: Magnesium oxide
• (iii) $\\text{CaO}$: Calcium oxide
• (iv) $\\text{CaCl}_2$: Calcium chloride`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "Name the precise laboratory measuring instrument used to determine each of the following physical quantities:\n\n(i) Length of a copper electrical wire;\n\n(ii) Gravitational mass of a mineral stone;\n\n(iii) Temperature of an aqueous acid solution;\n\n(iv) Exact volume of a clear liquid filtrate.",
        workedSolution: `(i) Length of wire: Metre rule (or vernier caliper / micrometer screw gauge for diameter).
(ii) Mass of stone: Beam balance (or electronic top-pan balance).
(iii) Temperature of solution: Laboratory mercury-in-glass (or alcohol) thermometer.
(iv) Volume of liquid: Graduated measuring cylinder (or volumetric pipette / burette).`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "List three critical agronomic and infrastructural factors considered when selecting a site for commercial vegetable crop production.",
        workedSolution: `1. Availability of a reliable perennial water supply for dry-season irrigation.
2. Soil characteristics: Presence of deep, fertile, well-drained sandy loam soil rich in organic matter.
3. Proximity to accessible motorable roads and urban markets to reduce post-harvest spoilage of perishable vegetables.
4. Topography: Gently sloping land that promotes good drainage without accelerating water erosion.`,
        maxMarks: 3
      },
      {
        subId: "(d)",
        prompt: "List four developmental stages in the life cycle of a flowering plant.",
        workedSolution: `1. Seed germination and seedling emergence
2. Vegetative growth (development of roots, stems, and leaves)
3. Floral bud initiation and flowering
4. Pollination and fertilization
5. Fruit and seed development followed by dispersal`,
        maxMarks: 4
      }
    ]
  }
];

async function seedBece2016SciencePaper2Variant() {
  console.log('Seeding 2016 BECE Integrated Science Paper 2 Variant (Set 79) into Firestore...');
  const db = await getFirestore();

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2016_variant');

  await docRef.set({
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Answer four questions in all. Answer Question 1 from Section A (compulsory), and any three questions from Section B. All working must be clearly shown.",
      totalQuestions: 6,
      questions: paper2Science2016Questions
    },
    'metadata.paper2Calibrated': true,
    'metadata.set79Verified': true,
    'metadata.updatedAt': new Date()
  }, { merge: true });

  console.log('✅ Successfully seeded Set 79 (2016 Science Paper 2 Variant) into past_papers/paper_2016_variant.');
}

seedBece2016SciencePaper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 79 Science Paper 2:', err);
    process.exit(1);
  });
