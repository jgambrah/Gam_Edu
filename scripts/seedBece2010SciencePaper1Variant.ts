import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';
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
    console.log('Falling back to default initialization...', e);
  }

  adminInstance.initializeApp({
    credential: adminInstance.credential.applicationDefault(),
    projectId
  });
  return adminInstance.firestore();
}

/**
 * WAEC BECE Integrated Science
 * Paper 1: Objective Examination (Set 96 Variant - 2010)
 *
 * Structure:
 * - 40 Multiple-choice Questions
 * - Balanced answer distribution: 10 A, 10 B, 10 C, 10 D (0% skew)
 * Total Marks: 40 | Time Allowed: 45 minutes
 *
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
 */

type CurriculumQuestionSet = any;

// 1. Vector SVG for Q22 & Q23: NPN Transistor with labeled Base I
export const svgQ22NpnTransistor = `<div class="my-4 flex justify-center"><svg viewBox='0 0 280 180' width='100%' height='155' style='max-width: 360px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Circular casing --><circle cx='140' cy='90' r='52' fill='none' stroke='#64748b' stroke-width='2'/><!-- Base Lead I --><line x1='35' y1='90' x2='110' y2='90' stroke='#38bdf8' stroke-width='3'/><line x1='110' y1='60' x2='110' y2='120' stroke='#38bdf8' stroke-width='5'/><text x='70' y='78' font-size='12' font-weight='bold' fill='#38bdf8'>I (Base)</text><!-- Collector Lead --><line x1='110' y1='75' x2='170' y2='40' stroke='#cbd5e1' stroke-width='3'/><line x1='170' y1='40' x2='170' y2='15' stroke='#cbd5e1' stroke-width='3'/><text x='180' y='28' font-size='10' font-weight='bold' fill='#cbd5e1'>Collector</text><!-- Emitter Lead with Arrow pointing outward (NPN) --><line x1='110' y1='105' x2='170' y2='140' stroke='#ef4444' stroke-width='3'/><polygon points='142,125 155,133 139,137' fill='#ef4444'/><line x1='170' y1='140' x2='170' y2='165' stroke='#ef4444' stroke-width='3'/><text x='180' y='160' font-size='10' font-weight='bold' fill='#ef4444'>Emitter</text><text x='140' y='172' font-size='8' font-weight='bold' fill='#94a3b8' text-anchor='middle'>NPN BIPOLAR JUNCTION TRANSISTOR</text></svg></div>`;

// 2. Vector SVG for Q39: Magnetic Field Lines around a Bar Magnet (North to South)
export const svgQ39MagneticFieldLines = `<div class="my-4 flex justify-center"><svg viewBox='0 0 360 160' width='100%' height='145' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Central Bar Magnet --><g transform='translate(100, 60)'><!-- North Pole --><rect x='0' y='0' width='80' height='36' fill='#ef4444' stroke='#b91c1c' stroke-width='1.5'/><text x='40' y='24' font-size='14' font-weight='bold' fill='#ffffff' text-anchor='middle'>N</text><!-- South Pole --><rect x='80' y='0' width='80' height='36' fill='#3b82f6' stroke='#1d4ed8' stroke-width='1.5'/><text x='120' y='24' font-size='14' font-weight='bold' fill='#ffffff' text-anchor='middle'>S</text></g><!-- Upper Field Loop (N -> S) --><path d='M 130 60 C 130 15 230 15 230 60' fill='none' stroke='#38bdf8' stroke-width='2'/><polygon points='175,20 185,24 175,28' fill='#38bdf8'/><!-- Lower Field Loop (N -> S) --><path d='M 130 96 C 130 140 230 140 230 96' fill='none' stroke='#38bdf8' stroke-width='2'/><polygon points='175,128 185,132 175,136' fill='#38bdf8'/><!-- Outer Wide Loops --><path d='M 115 60 C 70 0 290 0 245 60' fill='none' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='3,2'/><polygon points='175,4 185,8 175,12' fill='#38bdf8'/><path d='M 115 96 C 70 155 290 155 245 96' fill='none' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='3,2'/><polygon points='175,148 185,152 175,156' fill='#38bdf8'/><text x='180' y='155' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>FIELD LINES EMERGE FROM NORTH AND ENTER SOUTH</text></svg></div>`;

export const SET_BECE_2010_SCIENCE_P1: CurriculumQuestionSet = {
  id: "paper_2010_variant",
  title: "2010 BECE Integrated Science Paper 1 (Set 96 Objective)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2010 BECE Integrated Science Standardized CBT",
  variantType: "past_paper_variant",
  year: 2010,
  paperType: 1,
  setNumber: 96,
  era: "classic",
  totalQuestions: 40,
  version: 1,
  format: "multiple_choice",
  durationMinutes: 45,
  instructions: "Answer all forty questions by selecting the correct option (A, B, C, or D). Each question carries 1 mark.",
  questions: [
  {
    "id": "q01",
    "number": 1,
    "format": "multiple_choice",
    "prompt": "Water that readily forms a rich, copious lather with soap without forming an insoluble curd or scum is described as:",
    "options": [
      "Hard water",
      "Turbid water",
      "Chlorinated water",
      "Soft water"
    ],
    "correctAnswer": "Soft water",
    "hint": "Contains very low concentrations of dissolved calcium and magnesium ions.",
    "workedSolution": "Soft water lacks dissolved calcium and magnesium salts, allowing soap molecules to lather immediately without precipitating scum.",
    "points": 1
  },
  {
    "id": "q02",
    "number": 2,
    "format": "multiple_choice",
    "prompt": "Which of the following vital physiological life activities are performed by both eukaryotic plants and animals?",
    "options": [
      "Locomotion from place to place and feeding",
      "Active muscular locomotion and respiration",
      "Nutrition (feeding) and cellular respiration",
      "Photosynthesis and holozoic digestion"
    ],
    "correctAnswer": "Nutrition (feeding) and cellular respiration",
    "hint": "Both plants and animals require metabolic energy and nutrition, but plants do not move from place to place.",
    "workedSolution": "All living organisms undergo nutrition and cellular respiration to release energy. Locomotion is restricted to animals, as plants are sessile.",
    "points": 1
  },
  {
    "id": "q03",
    "number": 3,
    "format": "multiple_choice",
    "prompt": "Which precision measuring instrument is best suited for measuring the internal bore diameter of a hollow bamboo pipe or test tube?",
    "options": [
      "A surveyor's steel tape",
      "A standard wooden metre rule",
      "A Vernier calliper (using internal jaws)",
      "A laboratory beam balance"
    ],
    "correctAnswer": "A Vernier calliper (using internal jaws)",
    "hint": "Equipped with specialized upper internal jaws designed to measure internal diameters accurately.",
    "workedSolution": "The internal jaws of a Vernier calliper fit inside circular openings to measure internal diameters directly to within $0.01\\text{ cm}$.",
    "points": 1
  },
  {
    "id": "q04",
    "number": 4,
    "format": "multiple_choice",
    "prompt": "In agricultural science, the natural capacity of a soil to supply all essential plant nutrients in adequate amounts and balanced proportions is termed:",
    "options": [
      "Soil texture",
      "Soil fertility",
      "Soil structure",
      "Soil consistency"
    ],
    "correctAnswer": "Soil fertility",
    "hint": "Distinguish between physical particle size (texture) and chemical nutrient-supplying capacity.",
    "workedSolution": "Soil fertility is the chemical and biological ability of the soil to supply essential macro and micronutrients in plant-available forms.",
    "points": 1
  },
  {
    "id": "q05",
    "number": 5,
    "format": "multiple_choice",
    "prompt": "What is the simplest and most accessible household method for removing temporary hardness from well water to make it suitable for laundry?",
    "options": [
      "Boiling the water vigorously",
      "Passing the water through a cloth filter",
      "Adding potash alum crystals",
      "Disinfecting with liquid chlorine bleach"
    ],
    "correctAnswer": "Boiling the water vigorously",
    "hint": "Thermal decomposition converts soluble calcium hydrogencarbonate into insoluble calcium carbonate precipitate.",
    "workedSolution": "Boiling decomposes temporary hardness: $\\text{Ca(HCO}_3\\text{)}_2 \\xrightarrow{\\Delta} \\text{CaCO}_3\\downarrow + \\text{H}_2\\text{O} + \\text{CO}_2$, precipitating calcium ions and softening the water.",
    "points": 1
  },
  {
    "id": "q06",
    "number": 6,
    "format": "multiple_choice",
    "prompt": "What is the pedological term for the downward washing and loss of dissolved plant nutrients beyond the root absorption zone by percolating water?",
    "options": [
      "Soil aeration",
      "Soil infiltration",
      "Leaching",
      "Capillary rise"
    ],
    "correctAnswer": "Leaching",
    "hint": "Heavy drainage washes soluble nitrates and potassium deep into the subsoil.",
    "workedSolution": "Leaching occurs when percolating drainage water dissolves and transports soluble soil nutrients down past the reach of crop roots.",
    "points": 1
  },
  {
    "id": "q07",
    "number": 7,
    "format": "multiple_choice",
    "prompt": "According to the physical principles of flotation, an object will float on the surface of water if it:",
    "options": [
      "Has a density significantly greater than water",
      "Possesses zero gravitational mass in air",
      "Has an average density less than or equal to that of water",
      "Is completely impervious to all electromagnetic light"
    ],
    "correctAnswer": "Has an average density less than or equal to that of water",
    "hint": "An object floats when its weight is balanced by the upthrust of the displaced water volume.",
    "workedSolution": "By the Principle of Flotation, a body floats in a fluid if its overall density is less than or equal to the density of the fluid ($\\rho_{\\text{object}} \\le \\rho_{\\text{water}}$).",
    "points": 1
  },
  {
    "id": "q08",
    "number": 8,
    "format": "multiple_choice",
    "prompt": "Which of the following cultivated vegetable crops is grown specifically for harvesting and consuming its fresh edible leaves?",
    "options": [
      "Garden lettuce [Lactuca sativa]",
      "Garden cucumber [Cucumis sativus]",
      "Okro [Abelmoschus esculentus]",
      "Bulb onion [Allium cepa]"
    ],
    "correctAnswer": "Garden lettuce [Lactuca sativa]",
    "hint": "Cucumbers and okro are fruit vegetables; this crop is grown for its salad foliage.",
    "workedSolution": "Lettuce is an annual leafy vegetable grown for its tender vegetative leaves, whereas okro and cucumber are cultivated for their edible fruits.",
    "points": 1
  },
  {
    "id": "q09",
    "number": 9,
    "format": "multiple_choice",
    "prompt": "In the human respiratory system, across which microscopic, thin-walled structures does the exchange of respiratory gases ($O_2$ and $CO_2$) take place?",
    "options": [
      "Cartilaginous trachea rings",
      "Primary bronchi",
      "Pulmonary alveoli",
      "External nostrils"
    ],
    "correctAnswer": "Pulmonary alveoli",
    "hint": "Microscopic air sacs wrapped in capillaries that provide a large, moist gas-exchange surface.",
    "workedSolution": "Alveoli are microscopic, single-cell-thick air sacs surrounded by capillaries where oxygen diffuses into the blood and carbon dioxide diffuses out.",
    "points": 1
  },
  {
    "id": "q10",
    "number": 10,
    "format": "multiple_choice",
    "prompt": "What gaseous metabolic waste product is released into the bloodstream when glucose is oxidized during internal aerobic cellular respiration?",
    "options": [
      "Carbon (IV) oxide [CO₂]",
      "Carbon (II) oxide [CO]",
      "Diatomic nitrogen gas [N₂]",
      "Pure hydrogen gas [H₂]"
    ],
    "correctAnswer": "Carbon (IV) oxide [CO₂]",
    "hint": "$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\to 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{Energy}$.",
    "workedSolution": "Aerobic respiration oxidizes glucose in cellular mitochondria, yielding carbon dioxide ($\text{CO}_2$), water, and ATP energy.",
    "points": 1
  },
  {
    "id": "q11",
    "number": 11,
    "format": "multiple_choice",
    "prompt": "Which domestic farm animal possesses an anatomical crop as an expanded storage pouch along its oesophagus?",
    "options": [
      "Domestic fowl (poultry)",
      "Domestic pig",
      "Dairy goat",
      "Mutton sheep"
    ],
    "correctAnswer": "Domestic fowl (poultry)",
    "hint": "Birds swallow feed whole, storing and moistening it in this organ before it enters the gizzard.",
    "workedSolution": "Birds (fowls) possess a crop off the oesophagus that stores and softens swallowed grains before passage to the proventriculus and gizzard.",
    "points": 1
  },
  {
    "id": "q12",
    "number": 12,
    "format": "multiple_choice",
    "prompt": "Which of the following ecological phenomena represents a beneficial agricultural effect of atmospheric wind on the environment?",
    "options": [
      "Accelerating soil sheet erosion on bare hillsides",
      "Facilitating cross-pollination in anemophilous crops like maize and guinea corn",
      "Promoting rapid leaching of soluble nitrates",
      "Causing lodging and breaking of cereal stems"
    ],
    "correctAnswer": "Facilitating cross-pollination in anemophilous crops like maize and guinea corn",
    "hint": "Carries lightweight pollen grains from male tassels to receptive female silks.",
    "workedSolution": "Wind carries airborne pollen grains from anthers to feathery stigmas in wind-pollinated crops (anemochory), facilitating fertilization.",
    "points": 1
  },
  {
    "id": "q13",
    "number": 13,
    "format": "multiple_choice",
    "prompt": "Which laboratory chemical reagent produces a characteristic brick-red coloration upon gentle heating when added to a protein solution?",
    "options": [
      "Benedict's qualitative solution",
      "Fehling's solution A and B",
      "Aqueous iodine solution",
      "Millon's reagent"
    ],
    "correctAnswer": "Millon's reagent",
    "hint": "Reacts with phenolic tyrosine groups in proteins; Benedict's tests for reducing sugars.",
    "workedSolution": "Millon's reagent (mercuric nitrate in nitric acid) reacts with tyrosine residues in proteins, forming a white precipitate that turns brick-red on heating.",
    "points": 1
  },
  {
    "id": "q14",
    "number": 14,
    "format": "multiple_choice",
    "prompt": "Which of the following statements correctly describe the environmental hazards of uncontrolled dry-season bush fires?",
    "options": [
      "They permanently increase the moisture content of topsoil",
      "They eliminate the need for crop photosynthesis completely",
      "They convert atmospheric nitrogen directly into liquid ammonia",
      "They cause air pollution, destroy vegetative ground cover, and release greenhouse gases contributing to global warming"
    ],
    "correctAnswer": "They cause air pollution, destroy vegetative ground cover, and release greenhouse gases contributing to global warming",
    "hint": "Bush fires incinerate biomass, destroy wildlife habitats, and emit smoke and carbon dioxide.",
    "workedSolution": "Wildfires strip protective vegetation, accelerate soil erosion, kill beneficial soil microbes, and emit smoke ($CO, CO_2$) that drives global warming.",
    "points": 1
  },
  {
    "id": "q15",
    "number": 15,
    "format": "multiple_choice",
    "prompt": "What is the most effective agronomic and engineering method for checking water runoff and soil erosion on steep hillside farmlands?",
    "options": [
      "Constructing stepped horizontal terraces across the slope",
      "Continuous surface clean weeding",
      "Ploughing furrows straight down the slope gradient",
      "Burning off all natural vegetative brush before planting"
    ],
    "correctAnswer": "Constructing stepped horizontal terraces across the slope",
    "hint": "Converts steep slopes into broad, flat steps that reduce runoff speed.",
    "workedSolution": "Terracing breaks steep slopes into broad, flat horizontal steps, slowing runoff water velocity and promoting rainwater infiltration.",
    "points": 1
  },
  {
    "id": "q16",
    "number": 16,
    "format": "multiple_choice",
    "prompt": "Which public statutory body in Ghana is officially mandated to collect atmospheric data and provide national weather forecasts?",
    "options": [
      "The Agricultural Extension Services Division",
      "The Meteorological Services Agency (GMet)",
      "The Information Services Department",
      "The Animal Production Directorate"
    ],
    "correctAnswer": "The Meteorological Services Agency (GMet)",
    "hint": "Monitors weather instruments (barometers, anemometers, rain gauges) across the country.",
    "workedSolution": "The Ghana Meteorological Agency (GMet) analyzes atmospheric data to issue weather reports, maritime warnings, and aviation forecasts.",
    "points": 1
  },
  {
    "id": "q17",
    "number": 17,
    "format": "multiple_choice",
    "prompt": "What agricultural term describes the continuous cultivation of a single crop species on the same farmland season after season without rotational breaks?",
    "options": [
      "Systematic crop rotation",
      "Mixed farming",
      "Shifting cultivation",
      "Monoculture (or monocropping)"
    ],
    "correctAnswer": "Monoculture (or monocropping)",
    "hint": "Growing only one crop species continuously (e.g., maize year after year).",
    "workedSolution": "Monoculture involves growing the same crop repeatedly on the same plot, which depletes specific nutrients and increases pest vulnerability.",
    "points": 1
  },
  {
    "id": "q18",
    "number": 18,
    "format": "multiple_choice",
    "prompt": "In order of increasing distance from the Sun, which planet orbits as the fifth planet in our Solar System?",
    "options": [
      "Mars",
      "Jupiter",
      "Venus",
      "Neptune"
    ],
    "correctAnswer": "Jupiter",
    "hint": "The largest gas giant, orbiting just beyond Mars and the Asteroid Belt.",
    "workedSolution": "The planetary order from the Sun is Mercury (1), Venus (2), Earth (3), Mars (4), Jupiter (5), Saturn (6), Uranus (7), and Neptune (8).",
    "points": 1
  },
  {
    "id": "q19",
    "number": 19,
    "format": "multiple_choice",
    "prompt": "In human reproductive physiology, what biological process occurs when a haploid spermatozoon fuses with a mature haploid ovum to form a diploid zygote?",
    "options": [
      "Ovulation",
      "Menstruation",
      "Fertilization",
      "Implantation"
    ],
    "correctAnswer": "Fertilization",
    "hint": "Takes place in the fallopian tube when sperm and egg nuclei unite.",
    "workedSolution": "Fertilization is the fusion of male and female haploid gametes (sperm and ovum) in the fallopian tube to form a diploid zygote.",
    "points": 1
  },
  {
    "id": "q20",
    "number": 20,
    "format": "multiple_choice",
    "prompt": "What physiological process describes the loss of water vapor from green plant leaves into the atmosphere primarily through stomatal pores?",
    "options": [
      "Root absorption",
      "Capillary condensation",
      "Active translocation",
      "Transpiration"
    ],
    "correctAnswer": "Transpiration",
    "hint": "Generates the negative pressure pull that draws water upward through xylem vessels.",
    "workedSolution": "Transpiration is the evaporative loss of water vapor from aerial plant parts (primarily stomata), driving the upward transpiration stream.",
    "points": 1
  },
  {
    "id": "q21",
    "number": 21,
    "format": "multiple_choice",
    "prompt": "Which of the following poultry housing systems is classified as an intensive management system where birds are confined indoors on litter bedding?",
    "options": [
      "The free-range scavenging system",
      "The folding unit system",
      "The tethering pastoral system",
      "The deep litter system"
    ],
    "correctAnswer": "The deep litter system",
    "hint": "Birds remain fully confined inside a ventilated coop on wood shavings or straw.",
    "workedSolution": "The deep litter system is an intensive poultry system where birds are confined indoors on an absorbent litter floor that absorbs droppings.",
    "points": 1
  },
  {
    "id": "q22",
    "number": 22,
    "format": "multiple_choice",
    "prompt": "The electronic schematic diagram below represents a three-terminal solid-state component. What device is illustrated?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 280 180' width='100%' height='155' style='max-width: 360px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Circular casing --><circle cx='140' cy='90' r='52' fill='none' stroke='#64748b' stroke-width='2'/><!-- Base Lead I --><line x1='35' y1='90' x2='110' y2='90' stroke='#38bdf8' stroke-width='3'/><line x1='110' y1='60' x2='110' y2='120' stroke='#38bdf8' stroke-width='5'/><text x='70' y='78' font-size='12' font-weight='bold' fill='#38bdf8'>I (Base)</text><!-- Collector Lead --><line x1='110' y1='75' x2='170' y2='40' stroke='#cbd5e1' stroke-width='3'/><line x1='170' y1='40' x2='170' y2='15' stroke='#cbd5e1' stroke-width='3'/><text x='180' y='28' font-size='10' font-weight='bold' fill='#cbd5e1'>Collector</text><!-- Emitter Lead with Arrow pointing outward (NPN) --><line x1='110' y1='105' x2='170' y2='140' stroke='#ef4444' stroke-width='3'/><polygon points='142,125 155,133 139,137' fill='#ef4444'/><line x1='170' y1='140' x2='170' y2='165' stroke='#ef4444' stroke-width='3'/><text x='180' y='160' font-size='10' font-weight='bold' fill='#ef4444'>Emitter</text><text x='140' y='172' font-size='8' font-weight='bold' fill='#94a3b8' text-anchor='middle'>NPN BIPOLAR JUNCTION TRANSISTOR</text></svg></div>",
    "options": [
      "A PNP bipolar junction transistor",
      "A Light Emitting Diode (LED)",
      "An NPN bipolar junction transistor",
      "A Light Dependent Resistor (LDR)"
    ],
    "correctAnswer": "An NPN bipolar junction transistor",
    "hint": "The arrow on the emitter points outward (Not Pointing iN).",
    "workedSolution": "The symbol shows a bipolar junction transistor; the arrow on the emitter points outward away from the base, identifying it as an NPN transistor.",
    "points": 1
  },
  {
    "id": "q23",
    "number": 23,
    "format": "multiple_choice",
    "prompt": "In the NPN transistor symbol shown above, the control terminal labelled I represents the p-type base region. In this region:",
    "options": [
      "Free conduction electrons are the majority charge carriers",
      "There are zero mobile holes present under any condition",
      "Positive holes are the majority charge carriers",
      "There are equal numbers of holes and conduction electrons"
    ],
    "correctAnswer": "Positive holes are the majority charge carriers",
    "hint": "In p-type doped semiconductors, electron vacancies (holes) outnumber free electrons.",
    "workedSolution": "Terminal I is the base, composed of p-type semiconductor material where positive holes are majority carriers and electrons are minority carriers.",
    "points": 1
  },
  {
    "id": "q24",
    "number": 24,
    "format": "multiple_choice",
    "prompt": "When a drop of an unknown liquid food substance is rubbed onto unglazed white paper and leaves a permanent translucent spot, the substance contains:",
    "options": [
      "Monomeric glucose sugar",
      "Soluble plant proteins",
      "Fats or vegetable oils (lipids)",
      "Complex starch polysaccharides"
    ],
    "correctAnswer": "Fats or vegetable oils (lipids)",
    "hint": "Lipids penetrate cellulose paper fibers, matching its refractive index and allowing light to pass through.",
    "workedSolution": "Fats and oils leave a permanent translucent spot on paper because lipids wet and penetrate cellulose fibers without evaporating.",
    "points": 1
  },
  {
    "id": "q25",
    "number": 25,
    "format": "multiple_choice",
    "prompt": "Which of the following primary energy sources is finite and classified as non-renewable?",
    "options": [
      "Solar radiant energy",
      "Fossil crude petroleum (and coal)",
      "Atmospheric wind currents",
      "Ocean tidal wave energy"
    ],
    "correctAnswer": "Fossil crude petroleum (and coal)",
    "hint": "Takes millions of years to form and cannot be replenished at the rate it is consumed.",
    "workedSolution": "Fossil fuels (petroleum, coal, natural gas) are non-renewable resources formed from prehistoric organic matter that deplete with extraction.",
    "points": 1
  },
  {
    "id": "q26",
    "number": 26,
    "format": "multiple_choice",
    "prompt": "Which of the following domestic small livestock animals is typically housed in an elevated wire-mesh hutch?",
    "options": [
      "Domestic rabbits",
      "Dairy goats",
      "Breeding sows (pigs)",
      "Mutton sheep"
    ],
    "correctAnswer": "Domestic rabbits",
    "hint": "Housed in wooden-framed cages with wire floors for ventilation and sanitation.",
    "workedSolution": "Rabbits are reared in elevated hutches with wire-mesh floors that allow droppings and urine to fall through, keeping the animals clean and dry.",
    "points": 1
  },
  {
    "id": "q27",
    "number": 27,
    "format": "multiple_choice",
    "prompt": "Which major blood vessel in the human cardiovascular system transports deoxygenated blood from the right ventricle into the lungs?",
    "options": [
      "The systemic aorta",
      "The pulmonary vein",
      "The renal artery",
      "The pulmonary artery"
    ],
    "correctAnswer": "The pulmonary artery",
    "hint": "Arteries carry blood away from the heart; this artery carries deoxygenated blood to alveolar capillaries.",
    "workedSolution": "The pulmonary artery is the only adult artery carrying deoxygenated blood, transporting it from the right ventricle to the lungs for oxygenation.",
    "points": 1
  },
  {
    "id": "q28",
    "number": 28,
    "format": "multiple_choice",
    "prompt": "What sequence of energy transformations takes place when a chemical lead-acid car battery powers the vehicle's headlights?",
    "options": [
      "Electrical energy → Chemical energy → Light energy",
      "Chemical energy → Light energy → Electrical energy",
      "Nuclear energy → Mechanical energy → Light energy",
      "Chemical energy → Electrical energy → Light and heat energy"
    ],
    "correctAnswer": "Chemical energy → Electrical energy → Light and heat energy",
    "hint": "Chemical reactions in battery cells generate electric current, which heats the bulb filament to produce light.",
    "workedSolution": "Chemical reactions in the battery produce direct current (electrical energy), which flows through headlight filaments to produce light and heat.",
    "points": 1
  },
  {
    "id": "q29",
    "number": 29,
    "format": "multiple_choice",
    "prompt": "Which thermometric liquid is suitable for constructing a thermometer to measure boiling industrial liquids at temperatures up to 150°C?",
    "options": [
      "Pure ethanol alcohol",
      "Liquid mercury",
      "Turpentine liquid",
      "Distilled water"
    ],
    "correctAnswer": "Liquid mercury",
    "hint": "Alcohol boils at 78°C and would vaporize; mercury has a high boiling point of 357°C.",
    "workedSolution": "Mercury has a boiling point of $357^\\circ\\text{C}$ and stays liquid at $150^\\circ\\text{C}$, whereas alcohol boils at $78^\\circ\\text{C}$ and cannot measure high temperatures.",
    "points": 1
  },
  {
    "id": "q30",
    "number": 30,
    "format": "multiple_choice",
    "prompt": "Complete enzymatic hydrolysis and digestion of dietary protein molecules in the alimentary canal yields:",
    "options": [
      "Simple glucose monosaccharides",
      "Amino acids",
      "Fatty acids and glycerol",
      "Complex disaccharides"
    ],
    "correctAnswer": "Amino acids",
    "hint": "Proteins are polymer chains broken down into these monomer units by proteases.",
    "workedSolution": "Proteins are hydrolyzed by pepsin, trypsin, and erepsin into individual amino acid monomers, which are absorbed into mesenteric blood capillaries.",
    "points": 1
  },
  {
    "id": "q31",
    "number": 31,
    "format": "multiple_choice",
    "prompt": "Which category of mammalian teeth possesses a flat, horizontal chisel-shaped cutting edge used for shearing off food?",
    "options": [
      "Canines",
      "Premolars",
      "Incisors",
      "Molars"
    ],
    "correctAnswer": "Incisors",
    "hint": "The front teeth positioned anteriorly in the jawbone.",
    "workedSolution": "Incisors are the front teeth with flat, chisel-shaped crowns adapted for biting, cutting, and shearing food morsels.",
    "points": 1
  },
  {
    "id": "q32",
    "number": 32,
    "format": "multiple_choice",
    "prompt": "In commercial aquaculture, artificial freshwater fishponds are stocked using young juvenile fish known as:",
    "options": [
      "Marine anchovies",
      "Fingerlings",
      "Unfertilized fish eggs",
      "Tadpoles"
    ],
    "correctAnswer": "Fingerlings",
    "hint": "Young fish about the size of a human finger, ready for stocking into ponds.",
    "workedSolution": "Fingerlings are young juvenile fish (typically 5–10 cm in length) used to stock aquaculture ponds for grow-out to market size.",
    "points": 1
  },
  {
    "id": "q33",
    "number": 33,
    "format": "multiple_choice",
    "prompt": "Which of the following processes represent irreversible chemical changes resulting in the synthesis of new chemical substances?",
    "options": [
      "The combustion of dry firewood and the atmospheric rusting of an iron nail",
      "The heating of liquid water into steam vapor only",
      "The melting of candle wax into liquid wax only",
      "The dissolution of common table salt in water"
    ],
    "correctAnswer": "The combustion of dry firewood and the atmospheric rusting of an iron nail",
    "hint": "Chemical changes break and form bonds, producing new substances with different properties.",
    "workedSolution": "Combustion produces ash, $\\text{CO}_2$, and water, while rusting forms hydrated iron (III) oxide; both are chemical changes. Vaporizing water is a reversible physical change.",
    "points": 1
  },
  {
    "id": "q34",
    "number": 34,
    "format": "multiple_choice",
    "prompt": "The agronomic practice of rearing disease-resistant livestock breeds (such as N'Dama cattle resistant to trypanosomiasis) is classified as a:",
    "options": [
      "Chemical control method using synthetic acaricides",
      "Mechanical physical barrier control method",
      "Thermal sterilization method",
      "Biological control method"
    ],
    "correctAnswer": "Biological control method",
    "hint": "Utilizes natural genetic immunity in living organisms to suppress disease without chemicals.",
    "workedSolution": "Using genetically resistant livestock breeds is a biological control method that relies on inherited immunity to control parasites without agrochemicals.",
    "points": 1
  },
  {
    "id": "q35",
    "number": 35,
    "format": "multiple_choice",
    "prompt": "A horizontal pulling force of $10.0\\text{ N}$ moves a wooden crate through a displacement of $2.0\\text{ m}$ in the direction of the force. Calculate the work done.",
    "options": [
      "5 Joules",
      "10 Joules",
      "50 Joules",
      "20 Joules"
    ],
    "correctAnswer": "20 Joules",
    "hint": "$$\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (d) = 10.0 \\times 2.0$$.",
    "workedSolution": "$$\\text{Work Done } (W) = F \\times d = 10.0\\text{ N} \\times 2.0\\text{ m} = 20.0\\text{ J}$$.",
    "points": 1
  },
  {
    "id": "q36",
    "number": 36,
    "format": "multiple_choice",
    "prompt": "Which of the following components of human blood is carried in true aqueous solution dissolved within the blood plasma?",
    "options": [
      "Mineral salts (electrolytes) and glucose",
      "Phagocytic white blood cells",
      "Biconcave red blood cells (erythrocytes)",
      "Cellular blood platelets (thrombocytes)"
    ],
    "correctAnswer": "Mineral salts (electrolytes) and glucose",
    "hint": "Blood cells and platelets are suspended formed elements, while electrolytes are dissolved solutes.",
    "workedSolution": "Mineral salts (sodium, potassium, chloride) and glucose dissolve in plasma water, whereas red cells, white cells, and platelets are suspended cellular elements.",
    "points": 1
  },
  {
    "id": "q37",
    "number": 37,
    "format": "multiple_choice",
    "prompt": "An atom of carbon is represented by the nuclear symbol ${}^{12}_{6}\\text{C}$. How many uncharged neutrons reside within its nucleus?",
    "options": [
      "6 neutrons",
      "2 neutrons",
      "4 neutrons",
      "12 neutrons"
    ],
    "correctAnswer": "6 neutrons",
    "hint": "$$\\text{Neutrons } (N) = \\text{Mass Number } (A) - \\text{Atomic Number } (Z) = 12 - 6$$.",
    "workedSolution": "$$\\text{Neutrons } (N) = A - Z = 12 - 6 = 6\\text{ neutrons}$$.",
    "points": 1
  },
  {
    "id": "q38",
    "number": 38,
    "format": "multiple_choice",
    "prompt": "In commercial agribusiness, wholesale traders and retail middlemen operate within the:",
    "options": [
      "Supply and distribution value chain",
      "Initial field seedbed preparation stage",
      "Primary on-farm biological production stage",
      "Fertilizer chemical synthesis manufacturing stage"
    ],
    "correctAnswer": "Supply and distribution value chain",
    "hint": "They bridge the gap between primary farm producers and final urban consumers through marketing logistics.",
    "workedSolution": "Middlemen operate in the supply and marketing chain, buying produce from farm gates, transporting it, and distributing it to retail markets.",
    "points": 1
  },
  {
    "id": "q39",
    "number": 39,
    "format": "multiple_choice",
    "prompt": "Which of the following magnetic field line configurations correctly depicts the direction of lines of force outside a permanent bar magnet?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 160' width='100%' height='145' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Central Bar Magnet --><g transform='translate(100, 60)'><!-- North Pole --><rect x='0' y='0' width='80' height='36' fill='#ef4444' stroke='#b91c1c' stroke-width='1.5'/><text x='40' y='24' font-size='14' font-weight='bold' fill='#ffffff' text-anchor='middle'>N</text><!-- South Pole --><rect x='80' y='0' width='80' height='36' fill='#3b82f6' stroke='#1d4ed8' stroke-width='1.5'/><text x='120' y='24' font-size='14' font-weight='bold' fill='#ffffff' text-anchor='middle'>S</text></g><!-- Upper Field Loop (N -> S) --><path d='M 130 60 C 130 15 230 15 230 60' fill='none' stroke='#38bdf8' stroke-width='2'/><polygon points='175,20 185,24 175,28' fill='#38bdf8'/><!-- Lower Field Loop (N -> S) --><path d='M 130 96 C 130 140 230 140 230 96' fill='none' stroke='#38bdf8' stroke-width='2'/><polygon points='175,128 185,132 175,136' fill='#38bdf8'/><!-- Outer Wide Loops --><path d='M 115 60 C 70 0 290 0 245 60' fill='none' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='3,2'/><polygon points='175,4 185,8 175,12' fill='#38bdf8'/><path d='M 115 96 C 70 155 290 155 245 96' fill='none' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='3,2'/><polygon points='175,148 185,152 175,156' fill='#38bdf8'/><text x='180' y='155' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>FIELD LINES EMERGE FROM NORTH AND ENTER SOUTH</text></svg></div>",
    "options": [
      "Lines of force emerge from the South pole and enter the North pole",
      "Lines of force emerge outward from the North pole and curve into the South pole",
      "Lines of force radiate straight inward toward both poles simultaneously",
      "Lines of force form closed circular loops around the center only"
    ],
    "correctAnswer": "Lines of force emerge outward from the North pole and curve into the South pole",
    "hint": "By international physical convention, magnetic field lines run North to South externally.",
    "workedSolution": "By convention, magnetic field lines emerge from the North-seeking pole and curve through surrounding space to enter the South-seeking pole.",
    "points": 1
  },
  {
    "id": "q40",
    "number": 40,
    "format": "multiple_choice",
    "prompt": "In human reproductive biology, male and female gametes (sex cells) are produced respectively within the:",
    "options": [
      "Scrotal sac and uterus",
      "Testes and ovaries",
      "Penis and vaginal canal",
      "Prostate gland and fallopian tube"
    ],
    "correctAnswer": "Testes and ovaries",
    "hint": "The primary gonads responsible for spermatogenesis and oogenesis.",
    "workedSolution": "Spermatozoa are produced in the testes (male gonads), and ova are produced in the ovaries (female gonads).",
    "points": 1
  }
]
};


async function seedBece2010SciencePaper1Variant() {
  console.log('Seeding 2010 BECE Integrated Science Paper 1 Variant (Set 96) into Firestore...');
  const db = await getFirestore();

  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  SET_BECE_2010_SCIENCE_P1.questions.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Key Distribution across 40 items:', keyDist);

  // 1. Write to past_papers/paper_2010_variant
  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2010_variant');
  await docRef.set({
    year: 2010,
    isVariant: true,
    setNumber: 96,
    subject: "Integrated Science",
    examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
    paper1: {
      id: "paper_2010_variant",
      title: "Paper 1: Objective Test (Variant)",
      durationMinutes: 45,
      totalQuestions: 40,
      format: "multiple_choice",
      questions: SET_BECE_2010_SCIENCE_P1.questions
    },
    metadata: {
      sanitized: true,
      optionsBalanced: true,
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  }, { merge: true });
  console.log('✅ Ingested into past_papers/paper_2010_variant.');

  // 2. Write topic question set for single-document reads
  const topicRef = db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2010_variant');
  await topicRef.set(SET_BECE_2010_SCIENCE_P1, { merge: true });
  console.log('✅ Ingested into topics/bece_past_papers/question_sets/paper_2010_variant.');

  console.log('🌟 Set 96 Ingestion completed with exact 10A/10B/10C/10D distribution.');
}

seedBece2010SciencePaper1Variant()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Failed ingestion for Set 96 Science Paper 1:', err);
    process.exit(1);
  });
