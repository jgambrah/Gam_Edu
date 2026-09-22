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
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

const balancedMock7P1: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "Which of the following separation techniques is most appropriate for obtaining pure drinking water from muddy river water in a laboratory?",
    "options": [
      "Magnetic separation",
      "Manual decantation",
      "Evaporation to dryness",
      "Simple distillation"
    ],
    "correctAnswer": "Simple distillation",
    "hint": "Boiling muddy water followed by vapor condensation.",
    "workedSolution": "Simple distillation vaporizes water and condenses the steam in a condenser, leaving behind suspended clay particles and non-volatile impurities.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "In human muscle mechanics during the bending of the arm at the elbow, the biceps muscle",
    "options": [
      "contracts and shortens.",
      "relaxes and lengthens.",
      "remains completely rigid.",
      "detaches from the radius bone."
    ],
    "correctAnswer": "contracts and shortens.",
    "hint": "Antagonistic muscle action: bicep acts as the flexor.",
    "workedSolution": "To flex the forearm, the biceps muscle contracts (shortens) while the antagonistic triceps muscle relaxes and lengthens.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Which of the following agricultural practices involves growing two or more different crop species simultaneously on the same farmland without any definite row arrangement?",
    "options": [
      "Monoculture",
      "Crop rotation",
      "Shifting cultivation",
      "Mixed cropping"
    ],
    "correctAnswer": "Mixed cropping",
    "hint": "Grown together concurrently on the same plot.",
    "workedSolution": "Mixed cropping is the practice of planting multiple crop varieties concurrently on the same land parcel without distinct row patterns.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "What is the chemical formula for ammonium sulfate, a widely used agricultural inorganic fertilizer?",
    "options": [
      "NH₄NO₃",
      "NaNO₃",
      "(NH₄)₂SO₄",
      "Ca(NO₃)₂"
    ],
    "correctAnswer": "(NH₄)₂SO₄",
    "hint": "Ammonium ion (NH₄⁺) combined with sulfate ion (SO₄²⁻).",
    "workedSolution": "Ammonium has a valency of +1 and sulfate has a valency of -2. Balancing ionic charges yields (NH₄)₂SO₄.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "Which layer of the soil profile contains the highest concentration of dark organic humus and supports most plant roots?",
    "options": [
      "O-horizon",
      "B-horizon",
      "A-horizon",
      "R-horizon"
    ],
    "correctAnswer": "A-horizon",
    "hint": "The topmost mineral topsoil layer directly beneath organic leaf litter.",
    "workedSolution": "The A-horizon (topsoil) is rich in decomposed organic matter (humus) and provides the principal rooting zone and nutrients for crops.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "An object of mass 5 kg is dropped from the top of a cliff and falls freely under gravity. Calculate its weight. [g = 10 m s⁻²]",
    "options": [
      "0.5 N",
      "5.0 N",
      "25.0 N",
      "50.0 N"
    ],
    "correctAnswer": "50.0 N",
    "hint": "Weight = mass x acceleration due to gravity (W = mg).",
    "workedSolution": "Weight = m x g = 5 kg x 10 m s⁻² = 50.0 Newtons.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "Which of the following organs in the human body is responsible for excreting excess water, mineral salts, and metabolic urea?",
    "options": [
      "Liver",
      "Pancreas",
      "Gall bladder",
      "Kidney"
    ],
    "correctAnswer": "Kidney",
    "hint": "Filters blood plasma to produce liquid urine.",
    "workedSolution": "The kidneys are the primary excretory organs that filter nitrogenous urea, surplus water, and mineral salts from blood to form urine.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "A solar eclipse occurs when which of the following celestial bodies is positioned directly between the other two?",
    "options": [
      "Moon is between Sun and Earth",
      "Earth is between Sun and Moon",
      "Sun is between Earth and Moon",
      "Mars is between Sun and Earth"
    ],
    "correctAnswer": "Moon is between Sun and Earth",
    "hint": "The Moon blocks sunlight from reaching parts of the Earth's surface.",
    "workedSolution": "During a solar eclipse, the Moon passes directly between the Sun and Earth, casting an umbra and penumbra shadow onto the Earth.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "Which of the following micro-organisms is classified as a fungus?",
    "options": [
      "Amoeba",
      "Bacterium",
      "Spirogyra",
      "Yeast"
    ],
    "correctAnswer": "Yeast",
    "hint": "Unicellular eukaryotic organism used in baking and brewing.",
    "workedSolution": "Yeast (Saccharomyces cerevisiae) is a unicellular fungus. Amoeba is a protozoan, bacteria are prokaryotes, and spirogyra is an alga.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "When a piece of magnesium metal reacts with dilute hydrochloric acid, the gas evolved can be identified by its ability to",
    "options": [
      "turn limewater milky.",
      "reignite a glowing wooden splint.",
      "bleach damp litmus paper white.",
      "extinguish a glowing splint with a pop sound."
    ],
    "correctAnswer": "extinguish a glowing splint with a pop sound.",
    "hint": "Test for flammable hydrogen gas.",
    "workedSolution": "Magnesium reacts with dilute hydrochloric acid to produce hydrogen gas, which burns with a characteristic squeaky 'pop' sound.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "Which of the following human teeth is broad and flat, specialized for grinding and crushing food particles?",
    "options": [
      "Incisor",
      "Canine",
      "Wisdom tooth",
      "Premolar"
    ],
    "correctAnswer": "Premolar",
    "hint": "Located between canines and molars with cusps for crushing.",
    "workedSolution": "Premolars and molars have broad occlusal surfaces with cusps adapted for grinding and crushing food during mastication.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "The transfer of thermal energy from the warm land surface to cooling night air during a land breeze is driven by",
    "options": [
      "conduction.",
      "radiation.",
      "convection.",
      "sublimation."
    ],
    "correctAnswer": "convection.",
    "hint": "Circulation of fluid air currents due to temperature and density differences.",
    "workedSolution": "Convection drives coastal breezes as warmer, less dense air rises and is replaced by cooler, denser air moving in horizontally.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "Which of the following agricultural pests attacks stored grains by boring into maize kernels?",
    "options": [
      "Capsid bug",
      "Maize weevil",
      "Cotton stainer",
      "Stem borer larva"
    ],
    "correctAnswer": "Maize weevil",
    "hint": "Possesses a prominent snout and destroys dried cereals in granaries.",
    "workedSolution": "The maize weevil (Sitophilus zeamais) is a major storage pest that uses its rostrum to bore into dry grains and consume the starchy endosperm.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "What type of image is always formed by a plane mirror?",
    "options": [
      "Virtual and upright",
      "Real and inverted",
      "Real and magnified",
      "Virtual and inverted"
    ],
    "correctAnswer": "Virtual and upright",
    "hint": "Formed behind the mirror and cannot be projected onto a screen.",
    "workedSolution": "Images formed by plane mirrors are always virtual, erect (upright), laterally inverted, and the same size as the object.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "Which of the following substances is a pure chemical compound rather than a mixture?",
    "options": [
      "Distilled water",
      "Sea water",
      "Crude petroleum",
      "Air"
    ],
    "correctAnswer": "Distilled water",
    "hint": "Composed of hydrogen and oxygen chemically combined in a fixed 2:1 ratio.",
    "workedSolution": "Distilled water (H₂O) is a pure compound consisting of chemically bonded elements in a fixed ratio. Sea water, petroleum, and air are mixtures.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "In an electrical circuit, an instrument connected in parallel across a resistor to measure potential difference is a",
    "options": [
      "voltmeter.",
      "ammeter.",
      "galvanometer.",
      "rheostat."
    ],
    "correctAnswer": "voltmeter.",
    "hint": "Has very high internal resistance and measures in Volts.",
    "workedSolution": "A voltmeter is connected in parallel across components to measure potential difference without drawing significant current from the branch.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "Which plant germination type describes seeds whose cotyledons remain underground during germination?",
    "options": [
      "Epigeal germination",
      "Photoperiodism",
      "Vernalization",
      "Hypogeal germination"
    ],
    "correctAnswer": "Hypogeal germination",
    "hint": "Observed in maize where the epicotyl elongates.",
    "workedSolution": "In hypogeal germination (e.g., maize), the epicotyl elongates while the hypocotyl remains short, keeping cotyledons below ground.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "A metal block has a mass of 200 g and displaces 40 cm³ of water when submerged. Calculate its density.",
    "options": [
      "0.2 g cm⁻³",
      "5.0 g cm⁻³",
      "8.0 g cm⁻³",
      "40.0 g cm⁻³"
    ],
    "correctAnswer": "5.0 g cm⁻³",
    "hint": "Density = Mass / Volume.",
    "workedSolution": "Density = Mass / Displaced Volume = 200 g / 40 cm³ = 5.0 g cm⁻³.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "Which of the following livestock diseases is caused by a virus and affects the respiratory and nervous systems of poultry?",
    "options": [
      "Anthrax",
      "Tuberculosis",
      "Foot-and-mouth disease",
      "Newcastle disease"
    ],
    "correctAnswer": "Newcastle disease",
    "hint": "Highly contagious viral affliction in domestic chickens.",
    "workedSolution": "Newcastle disease is an acute viral disease of poultry that causes respiratory distress, twisted necks (nervous signs), and high mortality.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "What is the primary function of red blood cells (erythrocytes) in mammalian blood?",
    "options": [
      "Transporting oxygen via hemoglobin",
      "Fighting bacterial infections",
      "Initiating blood clotting",
      "Synthesizing antibodies"
    ],
    "correctAnswer": "Transporting oxygen via hemoglobin",
    "hint": "Contain iron-rich pigment that binds oxygen.",
    "workedSolution": "Red blood cells contain hemoglobin, which binds oxygen in the lungs to form oxyhemoglobin, transporting it to tissues throughout the body.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "When wood is burned in an open fireplace, the process is classified as a chemical change because",
    "options": [
      "new chemical substances like ash and carbon dioxide are formed.",
      "no new substances are created.",
      "it is easily reversible by cooling.",
      "the total mass of the system changes."
    ],
    "correctAnswer": "new chemical substances like ash and carbon dioxide are formed.",
    "hint": "Combustion forms new permanent products with different properties.",
    "workedSolution": "Burning wood is an irreversible chemical change that produces new substances: ash, carbon dioxide, and water vapor.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "Which of the following agricultural practices helps to preserve soil fertility and break pest cycles on a farm over several years?",
    "options": [
      "Monoculture",
      "Crop rotation",
      "Clean weeding",
      "Bush burning"
    ],
    "correctAnswer": "Crop rotation",
    "hint": "Systematic sequencing of different crop families on the same plot.",
    "workedSolution": "Crop rotation alternates crop families over time, balancing nutrient uptake and breaking host-specific pest and disease life cycles.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "A force of 40 N moves an object through a distance of 6 m in the direction of the force. Calculate the work done.",
    "options": [
      "6.6 J",
      "46.0 J",
      "240.0 J",
      "960.0 J"
    ],
    "correctAnswer": "240.0 J",
    "hint": "Work Done = Force x Distance.",
    "workedSolution": "Work Done = Force x Distance = 40 N x 6 m = 240.0 Joules.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "Which of the following structures in a flowering plant is responsible for transporting manufactured food from leaves to roots?",
    "options": [
      "Xylem vessel",
      "Phloem tissue",
      "Cortex parenchyma",
      "Pith cambium"
    ],
    "correctAnswer": "Phloem tissue",
    "hint": "Conducting vascular tissue specialized for translocation of sugars.",
    "workedSolution": "Phloem tissue transports synthesized sucrose and amino acids from photosynthetic leaves to non-photosynthetic organs (translocation). Xylem conducts water and mineral salts.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "What is the systematic chemical formula for Aluminum oxide?",
    "options": [
      "AlO",
      "AlO₂",
      "Al₂O₃",
      "Al₃O₂"
    ],
    "correctAnswer": "Al₂O₃",
    "hint": "Aluminum has valency 3 and Oxygen has valency 2.",
    "workedSolution": "Aluminum has a combining valency of +3 and oxygen has a valency of -2. Balancing charges gives Al₂O₃.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "Which of the following weather instruments is used specifically to measure the amount of rainfall over a specific period?",
    "options": [
      "Wind vane",
      "Barometer",
      "Hygrometer",
      "Rain gauge"
    ],
    "correctAnswer": "Rain gauge",
    "hint": "Collects precipitation into a graduated cylinder calibrated in millimeters.",
    "workedSolution": "A rain gauge measures liquid precipitation over a given time interval in millimeters.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "An atom X has 18 nucleons and 8 protons. How many neutrons are present in its nucleus?",
    "options": [
      "8",
      "10",
      "18",
      "26"
    ],
    "correctAnswer": "10",
    "hint": "Neutrons = Mass Number - Proton Number.",
    "workedSolution": "Neutrons = Nucleons (Mass Number) - Protons = 18 - 8 = 10 neutrons.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Which part of the male human reproductive system stores spermatozoa temporarily before ejaculation?",
    "options": [
      "Testis",
      "Epididymis",
      "Prostate gland",
      "Urethra"
    ],
    "correctAnswer": "Epididymis",
    "hint": "Coiled tube resting on top of each testis.",
    "workedSolution": "The epididymis is a coiled duct system on the posterior surface of the testis that stores and matures sperm cells.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "In a simple electronic circuit, what is the role of a fixed resistor placed in series with a Light Emitting Diode (LED)?",
    "options": [
      "To step up the supply voltage",
      "To convert direct current into alternating current",
      "To limit current and protect the LED from burning out",
      "To store electrical charge like a battery"
    ],
    "correctAnswer": "To limit current and protect the LED from burning out",
    "hint": "Prevents excessive current from overheating delicate semiconductor components.",
    "workedSolution": "A current-limiting resistor placed in series reduces excess current and drops voltage, preventing damage to the LED.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Which of the following materials allows heat to pass through it most rapidly by conduction?",
    "options": [
      "Wood",
      "Glass",
      "Aluminum",
      "Rubber"
    ],
    "correctAnswer": "Aluminum",
    "hint": "A metallic element with high thermal conductivity.",
    "workedSolution": "Metals like aluminum conduct heat rapidly due to free electrons that transfer kinetic energy across the lattice.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "The release of mature ova from the ovary into the Fallopian tube in human females is called",
    "options": [
      "menstruation.",
      "ovulation.",
      "fertilization.",
      "implantation."
    ],
    "correctAnswer": "ovulation.",
    "hint": "Occurs midway through the menstrual cycle.",
    "workedSolution": "Ovulation is the periodic release of an unfertilized ovum from an ovarian follicle into the Fallopian tube.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "Which of the following methods is used to control internal parasites (such as roundworms and liver flukes) in farm livestock?",
    "options": [
      "Dipping in insecticide wash",
      "Drenching with anthelmintics",
      "Dusting with sulfur powder",
      "Spraying with acaricide"
    ],
    "correctAnswer": "Drenching with anthelmintics",
    "hint": "Oral administration of liquid deworming medication.",
    "workedSolution": "Drenching is the oral dosing of livestock with anthelmintic medications to eliminate internal helminths (roundworms, tapeworms, flukes).",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "What is the primary function of the iris in the human eye?",
    "options": [
      "Regulating the size of the pupil aperture",
      "Focusing light rays onto the retina",
      "Detecting color wavelengths",
      "Producing aqueous humor fluid"
    ],
    "correctAnswer": "Regulating the size of the pupil aperture",
    "hint": "Colored muscular ring controlling light entry.",
    "workedSolution": "The iris contains radial and circular muscles that dilate or constrict the pupil to control light entry into the eye.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "A machine has a velocity ratio of 5 and an efficiency of 80%. Calculate its mechanical advantage (MA).",
    "options": [
      "1.6",
      "4.0",
      "6.25",
      "400.0"
    ],
    "correctAnswer": "4.0",
    "hint": "Efficiency = (MA / VR) x 100%.",
    "workedSolution": "Efficiency = (MA / VR) x 100% => 80% = (MA / 5) x 100% => MA = 0.8 x 5 = 4.0.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "Which of the following compounds is classified as a salt?",
    "options": [
      "HCl",
      "NaOH",
      "NaCl",
      "H₂O"
    ],
    "correctAnswer": "NaCl",
    "hint": "Formed by neutralizing hydrochloric acid with sodium hydroxide.",
    "workedSolution": "Sodium chloride (NaCl) is an ionic salt. HCl is an acid, NaOH is an alkali, and H₂O is a neutral oxide.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "In an ecosystem, green plants are termed producers because they",
    "options": [
      "consume herbivorous animals.",
      "manufacture their own food via photosynthesis.",
      "decompose dead organic matter.",
      "parasitize host plants."
    ],
    "correctAnswer": "manufacture their own food via photosynthesis.",
    "hint": "Autotrophs converting solar energy into organic chemical energy.",
    "workedSolution": "Green plants are autotrophs that synthesize organic carbohydrates from inorganic carbon dioxide and water using light energy.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "Which of the following activities helps maintain the balance of the carbon cycle in nature?",
    "options": [
      "Afforestation and tree planting",
      "Intensive bush burning",
      "Clearing forests for farming",
      "Operating industrial coal power plants"
    ],
    "correctAnswer": "Afforestation and tree planting",
    "hint": "Removes carbon dioxide from the atmosphere via photosynthesis.",
    "workedSolution": "Planting trees (afforestation) removes carbon dioxide from the atmosphere during photosynthesis, acting as a carbon sink.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "An electric iron rated 1200 W is connected to a 240 V mains supply. Determine the electrical resistance of its heating element.",
    "options": [
      "0.2 Ω",
      "5.0 Ω",
      "48.0 Ω",
      "288.0 Ω"
    ],
    "correctAnswer": "48.0 Ω",
    "hint": "P = V² / R, so R = V² / P.",
    "workedSolution": "R = V² / P = (240)² / 1200 = 57,600 / 1200 = 48.0 Ω.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "Which of the following seed dispersal mechanisms is characteristic of fruits with hooked spines or sticky hairs?",
    "options": [
      "Animal dispersal",
      "Wind dispersal",
      "Explosive mechanism",
      "Water buoyancy"
    ],
    "correctAnswer": "Animal dispersal",
    "hint": "Clings to the fur of passing animals or human clothing.",
    "workedSolution": "Fruits with hooked spines (e.g., blackjack) attach to animal fur or human clothes to be transported and dispersed away from parent plants.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "Why is crude petroleum classified as a non-renewable energy resource?",
    "options": [
      "It is found deep underground in sedimentary rocks.",
      "It cannot be burned in internal combustion engines.",
      "It takes millions of years to form and depletes with use.",
      "It produces greenhouse gases when refined."
    ],
    "correctAnswer": "It takes millions of years to form and depletes with use.",
    "hint": "Finite fossil resource formed over geological timescales.",
    "workedSolution": "Petroleum forms over millions of years from compressed organic deposits; because it cannot be replenished on human timescales, it is non-renewable.",
    "points": 1
  }
];
const paper2Mock7Questions = [
  {
    "questionNumber": "1",
    "isPracticalSectionA": true,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Figure 1(a) illustrates an experiment demonstrating the rectilinear propagation of light using three perforated cardboards aligned between a light source and an observer:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(35, 60)'><rect x='10' y='30' width='12' height='50' fill='#cbd5e1' stroke='#94a3b8' stroke-width='1.2'/><path d='M 16 30 Q 11 20 16 12 Q 21 20 16 30 Z' fill='#f59e0b'/><circle cx='16' cy='15' r='1.5' fill='#ffffff'/><circle cx='35' cy='55' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='35' y='58' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>I</text></g><g transform='translate(110, 30)'><rect x='0' y='0' width='12' height='130' fill='#475569' stroke='#64748b' stroke-width='1.5'/><circle cx='6' cy='65' r='3' fill='#0f172a'/><circle cx='25' cy='65' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='25' y='68' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>II</text></g><g transform='translate(190, 30)'><rect x='0' y='0' width='12' height='130' fill='#475569' stroke='#64748b' stroke-width='1.5'/><circle cx='6' cy='65' r='3' fill='#0f172a'/><circle cx='25' cy='65' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='25' y='68' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text></g><g transform='translate(270, 30)'><rect x='0' y='0' width='12' height='130' fill='#475569' stroke='#64748b' stroke-width='1.5'/><circle cx='6' cy='65' r='3' fill='#0f172a'/><circle cx='25' cy='65' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='25' y='68' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>IV</text></g><line x1='51' y1='115' x2='330' y2='115' stroke='#38bdf8' stroke-width='2' stroke-dasharray='4,2'/><g transform='translate(330, 95)'><path d='M 0 20 Q 15 10 30 20 Q 15 30 0 20 Z' fill='none' stroke='#10b981' stroke-width='2'/><circle cx='15' cy='20' r='5' fill='#10b981'/><circle cx='38' cy='20' r='8' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/><text x='38' y='23' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>V</text></g><text x='190' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>RECTILINEAR PROPAGATION OF LIGHT: ALIGNED PINHOLE EXPERIMENT</text></svg></div>\n\n(i) Name the components labelled I, II, III, IV, and V.\n(ii) State what the observer sees at position V when pinholes II, III, and IV are arranged in a straight line.\n(iii) Describe the observation made at position V if cardboard III is slightly displaced sideways out of alignment.\n(iv) Explain the scientific principle demonstrated by this experiment.\n(v) Name one natural optical phenomenon that occurs in nature based on this principle.",
        "workedSolution": "(i) Identification of components:\n• Part I: **Light source (lit candle)**\n• Parts II, III, IV: **Perforated cardboards (screen barriers with pinholes)**\n• Part V: **Observer's eye**\n\n(ii) Observation when aligned:\nThe observer sees the **light from the candle flame clearly**.\n\n(iii) Observation when displaced:\nThe observer **cannot see the candle flame** (darkness is observed).\n\n(iv) Scientific principle:\n**Rectilinear propagation of light:** Light travels in straight lines through a uniform medium and cannot bend around opaque obstacles or misaligned apertures.\n\n(v) Natural optical phenomenon:\nThe formation of **shadows** (umbra and penumbra) or **solar and lunar eclipses** *(or pinhole camera images)*.",
        "maxMarks": 10
      },
      {
        "subId": "(b)",
        "prompt": "Figure 1(b) illustrates a laboratory experiment testing three water samples I, II, and III with soap solution to investigate water hardness:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(35, 25)'><polygon points='15,20 45,20 52,110 8,110' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/><circle cx='25' cy='25' r='5' fill='#ffffff' opacity='0.8'/><circle cx='35' cy='22' r='6' fill='#ffffff' opacity='0.9'/><circle cx='45' cy='26' r='5' fill='#ffffff' opacity='0.8'/><circle cx='30' cy='30' r='4' fill='#ffffff'/><circle cx='40' cy='32' r='5' fill='#ffffff'/><circle cx='30' cy='125' r='9' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='30' y='128' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text><text x='30' y='155' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Soft Water</text></g><g transform='translate(160, 25)'><polygon points='15,20 45,20 52,110 8,110' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/><rect x='22' y='50' width='6' height='4' fill='#cbd5e1' rx='1'/><rect x='35' y='70' width='5' height='5' fill='#cbd5e1' rx='1'/><circle cx='30' cy='125' r='9' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='30' y='128' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II</text><text x='30' y='155' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Hard Water</text></g><g transform='translate(285, 25)'><polygon points='15,20 45,20 52,110 8,110' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/><circle cx='25' cy='25' r='5' fill='#ffffff' opacity='0.8'/><circle cx='35' cy='22' r='6' fill='#ffffff' opacity='0.9'/><circle cx='45' cy='26' r='5' fill='#ffffff' opacity='0.8'/><rect x='15' y='102' width='30' height='8' fill='#cbd5e1' opacity='0.6'/><circle cx='30' cy='125' r='9' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/><text x='30' y='128' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>III</text><text x='30' y='155' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Softened Water</text></g><text x='190' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>WATER HARDNESS INVESTIGATION: LATHER FORMATION AND CHEMICAL SOFTENING</text></svg></div>\n\n(i) Identify which of the water samples labelled I, II, and III represents:\n  (α) Soft water;\n  (β) Hard water;\n  (γ) Softened hard water.\n(ii) State the observable difference between flask I and flask II after vigorous shaking with soap solution.\n(iii) Name the chemical substance responsible for scum formation in flask II.\n(iv) State what chemical substance was added to flask II to transform it into flask III.\n(v) Write a word equation for the softening reaction when washing soda is added to hard water containing calcium sulfate.",
        "workedSolution": "(i) Identification of water samples:\n• (α) Soft water: **Flask I**\n• (β) Hard water: **Flask II**\n• (γ) Softened hard water: **Flask III**\n\n(ii) Observable difference:\nFlask I forms a **rich, abundant lather** readily with a small amount of soap, whereas Flask II forms **no lather but produces an insoluble scum/curd** floating on top.\n\n(iii) Scum substance:\n**Insoluble calcium stearate** *(or magnesium stearate / insoluble soap scum)*.\n\n(iv) Chemical substance added:\n**Sodium carbonate [Washing soda, Na₂CO₃]**.\n\n(v) Word equation for softening:\n$$\\text{Calcium sulfate} + \\text{Sodium carbonate} \\to \\text{Calcium carbonate (precipitate)} + \\text{Sodium sulfate (dissolved)}$$",
        "maxMarks": 10
      },
      {
        "subId": "(c)",
        "prompt": "Figure 1(c) illustrates two types of seed germination observed in flowering plants labelled Seedling A and Seedling B:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='30' y1='110' x2='350' y2='110' stroke='#78350f' stroke-width='3'/><text x='50' y='102' font-size='8' font-weight='bold' fill='#92400e'>Soil Surface</text><g transform='translate(60, 25)'><text x='65' y='12' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Seedling A (Epigeal)</text><path d='M 65 85 L 55 125 M 65 85 L 75 120' stroke='#a16207' stroke-width='2' fill='none'/><path d='M 65 85 Q 65 55 50 45' stroke='#22c55e' stroke-width='3' fill='none'/><ellipse cx='38' cy='42' rx='10' ry='6' fill='#22c55e' transform='rotate(-20 38 42)'/><ellipse cx='62' cy='42' rx='10' ry='6' fill='#22c55e' transform='rotate(20 62 42)'/><line x1='50' y1='45' x2='50' y2='25' stroke='#22c55e' stroke-width='2'/><circle cx='65' cy='150' r='9' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='65' y='153' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>A</text></g><g transform='translate(240, 25)'><text x='65' y='12' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Seedling B (Hypogeal)</text><path d='M 65 85 L 55 125 M 65 85 L 75 120' stroke='#a16207' stroke-width='2' fill='none'/><ellipse cx='65' cy='90' rx='14' ry='10' fill='#d97706'/><path d='M 65 85 L 65 25' stroke='#22c55e' stroke-width='3' fill='none'/><path d='M 65 35 Q 85 25 80 40 Z' fill='#22c55e'/><path d='M 65 35 Q 45 25 50 40 Z' fill='#22c55e'/><circle cx='65' cy='150' r='9' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='65' y='153' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>B</text></g><text x='190' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>SEED GERMINATION TYPES: EPIGEAL VERSUS HYPOGEAL BEHAVIOR</text></svg></div>\n\n(i) Name the type of seed germination represented by Seedling A and Seedling B.\n(ii) State what happens to the cotyledons during germination in:\n  (α) Seedling A;\n  (β) Seedling B.\n(iii) Give one example of an agricultural crop that exhibits:\n  (α) Germination type A;\n  (β) Germination type B.\n(iv) State two environmental conditions necessary for viable seeds to commence germination.",
        "workedSolution": "(i) Germination types:\n• Seedling A: **Epigeal germination**\n• Seedling B: **Hypogeal germination**\n\n(ii) Behavior of cotyledons:\n• (α) Seedling A (Epigeal): The hypocotyl elongates rapidly, pushing the cotyledons **above the soil surface**.\n• (β) Seedling B (Hypogeal): The epicotyl elongates while the hypocotyl remains short, keeping the cotyledons **retained underground**.\n\n(iii) Crop examples:\n• (α) Type A (Epigeal): **Cowpea [Bean]** *(or Groundnut, Castor oil, Cotton)*\n• (β) Type B (Hypogeal): **Maize [Corn]** *(or Rice, Sorghum, Millet, Broad bean)*\n\n(iv) Environmental conditions for germination:\n1. **Adequate moisture (water)** to soften seed coats and activate enzymes.\n2. **Suitable temperature (warmth)** to provide kinetic energy for enzyme activity.\n3. **Oxygen (air)** for aerobic cellular respiration.",
        "maxMarks": 10
      },
      {
        "subId": "(d)",
        "prompt": "Figure 1(d) illustrates an exposed soil profile pit showing different geological horizons:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 230' width='100%' height='210' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(50, 15)'><rect x='0' y='0' width='180' height='20' fill='#1c1917' stroke='#44403c' stroke-width='1'/><circle cx='195' cy='10' r='8' fill='#1e293b' stroke='#1c1917' stroke-width='1.5'/><text x='195' y='13' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>I</text><rect x='0' y='20' width='180' height='35' fill='#292524' stroke='#44403c' stroke-width='1'/><circle cx='195' cy='38' r='8' fill='#1e293b' stroke='#292524' stroke-width='1.5'/><text x='195' y='41' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>II</text><rect x='0' y='55' width='180' height='50' fill='#78350f' stroke='#44403c' stroke-width='1'/><circle cx='195' cy='80' r='8' fill='#1e293b' stroke='#78350f' stroke-width='1.5'/><text x='195' y='83' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>III</text><rect x='0' y='105' width='180' height='40' fill='#a16207' stroke='#44403c' stroke-width='1'/><circle cx='40' cy='125' r='5' fill='#64748b'/><circle cx='120' cy='130' r='7' fill='#64748b'/><circle cx='195' cy='125' r='8' fill='#1e293b' stroke='#a16207' stroke-width='1.5'/><text x='195' y='128' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>IV</text><path d='M 0 145 L 180 145 L 180 180 L 0 180 Z' fill='#475569' stroke='#334155' stroke-width='1'/><circle cx='195' cy='162' r='8' fill='#1e293b' stroke='#475569' stroke-width='1.5'/><text x='195' y='165' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>V</text></g><text x='170' y='215' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>SOIL PROFILE PIT: IDENTIFY HORIZONS I, II, III, IV, AND V</text></svg></div>\n\n(i) Name each of the soil profile horizons labelled I, II, III, IV, and V.\n(ii) State which horizon is:\n  (α) The richest in organic humus;\n  (β) The zone of accumulation (subsoil);\n  (γ) The unweathered parent bedrock.\n(iii) State two ways in which the study of a soil profile is important to a commercial crop farmer.",
        "workedSolution": "(i) Identification of horizons:\n• Horizon I: **O-horizon (Organic layer / Leaf litter)**\n• Horizon II: **A-horizon (Topsoil)**\n• Horizon III: **B-horizon (Subsoil)**\n• Horizon IV: **C-horizon (Weathered parent material)**\n• Horizon V: **R-horizon (Bedrock)**\n\n(ii) Horizon identification:\n• (α) Richest in humus: **Horizon II (A-horizon / Topsoil)**\n• (β) Zone of accumulation: **Horizon III (B-horizon / Subsoil)**\n• (γ) Unweathered bedrock: **Horizon V (R-horizon)**\n\n(iii) Importance of soil profile to farmers:\n1. **Determines Effective Root Depth:** Helps farmers assess whether an underlying hardpan layer will restrict deep taproots.\n2. **Informs Crop Selection:** Guides the farmer on which crop varieties are suited to the soil's drainage and nutrient profile.\n3. **Fertility and Drainage Planning:** Identifies subsoil compaction and leaching zones, aiding fertilizer application and irrigation planning.",
        "maxMarks": 10
      }
    ]
  },
  {
    "questionNumber": "2",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) State two differences between balanced forces and unbalanced forces acting on an object.\n(ii) A farmer applies a horizontal pulling force of 150.0 N to drag a bag of harvested maize across a level floor through a distance of 8.0 m. Calculate the work done by the farmer.",
        "workedSolution": "(i) Balanced vs. Unbalanced Forces:\n• **Balanced Forces:** Equal in magnitude and opposite in direction; the net resultant force is zero, meaning an object at rest remains at rest or an object in motion continues at constant velocity without changing speed or direction.\n• **Unbalanced Forces:** The opposing forces are unequal, producing a non-zero net force that causes the object to accelerate, decelerate, or change direction.\n\n(ii) Work Done calculation:\nFormula:\n$$\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (d)$$\nSubstitute values ($F = 150.0\\text{ N}$, $d = 8.0\\text{ m}$):\n$$W = 150.0\\text{ N} \\times 8.0\\text{ m} = 1,200.0\\text{ Joules (J)}$$\nAnswer: The work done is **1,200.0 J**.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) Define potential energy and state its S.I. unit.\n(ii) A crate of mass 25.0 kg is hoisted vertically onto a loading platform 4.0 m above the ground. Calculate:\n  (α) The weight of the crate [g = 10.0 m s⁻²];\n  (β) The potential energy gained by the crate on the platform.",
        "workedSolution": "(i) Potential Energy definition:\nPotential energy is the stored energy possessed by an object due to its position in a gravitational field or its compressed/stretched state. Its S.I. unit is the **Joule (J)**.\n\n(ii) Calculations:\n• (α) Weight (W):\n$$W = m \\times g = 25.0\\text{ kg} \\times 10.0\\text{ m s}^{-2} = 250.0\\text{ Newtons (N)}$$\nAnswer: Weight is **250.0 N**.\n\n• (β) Potential Energy (P.E.):\n$$P.E. = m \\times g \\times h = 250.0\\text{ N} \\times 4.0\\text{ m} = 1,000.0\\text{ Joules (J)}$$\nAnswer: Potential energy gained is **1,000.0 J**.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "State three safety precautions that must be observed when using electrical appliances in a domestic home.",
        "workedSolution": "1. Never touch electrical switches or appliances with wet hands, as water lowers skin resistance and increases the risk of electric shock.\n2. Avoid overloading electrical sockets by connecting too many high-power appliances into a single adapter.\n3. Replace frayed power cords and cracked plug casings promptly.\n4. Always switch off and unplug appliances before cleaning or maintenance.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "3",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) State two reasons why the study of a soil profile is important to agricultural crop production.\n(ii) Mention two cultural farming practices used to control soil erosion on sloping farmlands.",
        "workedSolution": "(i) Importance of soil profile:\n1. **Determines Effective Rooting Depth:** Indicates whether underlying hardpan layers will impede root penetration.\n2. **Guides Crop Selection:** Helps farmers select crop species suited to the soil's drainage and nutrient profile.\n\n(ii) Erosion control practices:\n1. **Contour Ploughing:** Ploughing across slopes rather than up and down, creating ridges that trap runoff water.\n2. **Terracing:** Constructing horizontal stepped platforms on steep slopes to slow surface runoff.\n3. **Strip Cropping:** Alternating strips of erosion-resistant crops (such as legumes) with clean-tilled row crops.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) Differentiate between primary macronutrients and micronutrients in plants, giving two examples of each.\n(ii) State two observable deficiency symptoms of phosphorus in crop plants.",
        "workedSolution": "(i) Macronutrients vs. Micronutrients:\n• **Macronutrients:** Essential mineral elements required by plants in **large quantities** for structural growth and metabolism (e.g., Nitrogen, Phosphorus, Potassium).\n• **Micronutrients (Trace elements):** Essential mineral elements required by plants in **very small trace amounts** to act as enzyme cofactors (e.g., Zinc, Iron, Copper, Boron).\n\n(ii) Phosphorus deficiency symptoms:\n1. **Purplish Discoloration:** Leaves and stems develop abnormal purple or reddish tints.\n2. **Stunted Root and Fruit Development:** Poor root growth, delayed plant maturity, and small, shriveled seed formation.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "Describe briefly how compost manure can be prepared in a backyard garden for vegetable crop production.",
        "workedSolution": "1. **Site Selection & Excavation:** Choose a shaded, well-drained spot and dig a shallow pit or construct a compost bin roughly 1 m x 1 m.\n2. **Layering Organic Waste:** Alternate layers of dry carbonaceous material (dried leaves, straw) with green nitrogenous material (vegetable scraps, fresh grass) and thin layers of garden soil or animal manure.\n3. **Moistening and Aeration:** Sprinkle water periodically to keep the heap moist and turn the pile with a fork every two to three weeks to supply oxygen for aerobic decomposition.\n4. **Curing:** After two to three months, mature, dark brown, earthy-smelling compost is ready to apply to vegetable beds.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "4",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) Name the four main organs that make up the human urinary system.\n(ii) State three metabolic waste substances excreted in human urine.\n(iii) State two healthy lifestyle practices that help maintain proper kidney health.",
        "workedSolution": "(i) Organs of the urinary system:\n1. **Kidneys (left and right)**\n2. **Ureters (bilateral ducts)**\n3. **Urinary bladder**\n4. **Urethra**\n\n(ii) Waste substances in urine:\n1. **Urea** (from deamination of excess amino acids)\n2. **Excess water**\n3. **Mineral salts** (e.g., excess sodium chloride)\n*(Also uric acid and creatinine)*.\n\n(iii) Healthy kidney practices:\n1. Drinking adequate clean water daily to assist in flushing metabolic wastes.\n2. Reducing excessive dietary salt and refined sugar intake.\n3. Avoiding indiscriminate consumption of unprescribed medications or excessive alcohol.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) Differentiate between a biological disease vector and a mechanical disease vector, giving one example of each.\n(ii) State two public health measures used to control houseflies in community food markets.",
        "workedSolution": "(i) Biological vs. Mechanical Vectors:\n• **Biological Vector:** An organism in which the disease-causing pathogen develops, multiplies, or completes part of its life cycle before transmission (e.g., Female *Anopheles* mosquito transmitting the malaria parasite).\n• **Mechanical Vector:** An organism that carries pathogens externally on its feet or body parts without the pathogen multiplying inside it (e.g., Housefly carrying *Vibrio cholerae* bacteria on its legs).\n\n(ii) Housefly control in markets:\n1. Storing market refuse and food scraps in covered bins and emptying them daily.\n2. Screening raw and cooked food display stalls with fine wire gauze to exclude flies.\n3. Constructing fly-proof, sanitary toilet facilities with running water away from market stalls.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "State three hygienic practices that must be observed in a home to prevent food contamination and waterborne diseases.",
        "workedSolution": "1. Washing hands thoroughly with soap and clean running water before preparing or eating food.\n2. Keeping cooked and raw food items stored separately in covered containers to prevent cross-contamination.\n3. Boiling drinking water or treating it with chlorine tablets when municipal supply purity is uncertain.\n4. Washing fruits and raw vegetables thoroughly in clean salt water before consumption.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "5",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) Draw the circuit symbol for each of the following electronic components:\n  (α) A cell;\n  (β) A Light Emitting Diode (LED);\n  (γ) A fixed resistor.\n(ii) In a simple direct-current circuit containing an LED, explain why:\n  (α) The LED lights up only when connected in one specific orientation;\n  (β) A fixed resistor is connected in series with the LED.",
        "workedSolution": "(i) Circuit Symbols:\n• (α) Cell: [Long thin line (+) parallel to short thick line (-)]\n• (β) Light Emitting Diode (LED): [Diode triangle with cathode bar, with two arrows pointing outward representing emitted light]\n• (γ) Fixed Resistor: [A clean open rectangular box or zigzag line]\n\n(ii) Explanations:\n• (α) Specific orientation: An LED has polarity. It emits light only when its longer lead (anode) is connected to the positive terminal of the power supply and its shorter lead (cathode) is connected to the negative terminal, allowing current to flow through it.\n• (β) Series resistor: The resistor limits circuit current to a safe value, preventing excessive current from burning out the delicate LED.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) Explain the role of green plants in maintaining the balance of the carbon cycle in nature.\n(ii) State two human activities that disrupt the carbon cycle, leading to global climate change.",
        "workedSolution": "(i) Role of green plants:\nGreen plants serve as biological carbon sinks. Through photosynthesis, they absorb carbon dioxide (CO₂) gas from the atmosphere and fix carbon into organic glucose molecules, regulating atmospheric carbon levels while releasing oxygen.\n\n(ii) Human activities disrupting the cycle:\n1. **Deforestation:** Clear-felling and burning forests eliminates carbon sinks and releases stored carbon as CO₂.\n2. **Burning Fossil Fuels:** Combustion of petroleum, coal, and natural gas in vehicles and industries releases large volumes of CO₂ into the atmosphere.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "State three reasons why the establishment of school and community vegetable gardens is important.",
        "workedSolution": "1. **Nutritional Security:** Provides fresh vegetables rich in vitamins, minerals, and dietary fiber to improve student nutrition.\n2. **Practical Science Learning:** Serves as an outdoor laboratory for hands-on observation of plant growth, soil science, and ecological principles.\n3. **Entrepreneurial & Agricultural Skills:** Equips students with practical crop husbandry and basic farm management skills.",
        "maxMarks": 6
      }
    ]
  }
];

async function seedBeceMock7ScienceCalibrated() {
  console.log('Seeding BECE Integrated Science Mock 7 (Set 138) into dedicated mock_exams/mock_7...');

  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedMock7P1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Mock 7 Paper 1 Key Distribution across 40 items:', keyDist);

  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error('Key balancing failed! Must be exactly 10 A, 10 B, 10 C, 10 D.');
  }

  const db = await getDb();
  const docRef = db.doc('global_curriculum/jhs/subjects/science/mock_exams/mock_7');
  await docRef.set({
    mockId: "mock_7",
    title: "BECE Integrated Science Mock 7 (100% NaCCA JHS Standards-Calibrated)",
    subject: "Integrated Science",
    totalDurationMinutes: 150,
    metadata: {
      isMock: true,
      isMockExam: true,
      setNumber: 138,
      version: "NaCCA JHS Standards-Compliant",
      totalMarks: 140,
      sanitized: true,
      optionsBalanced: true,
      vectorGraphicsCount: 4,
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test (Mock 7)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: balancedMock7P1
    },
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Mock 7)",
      durationMinutes: 105,
      instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2Mock7Questions
    }
  }, { merge: true });

  console.log('✅ Ingestion complete: Set 138 (Mock 7) seeded successfully into mock_exams/mock_7.');
}

seedBeceMock7ScienceCalibrated()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Mock 7 Science:', err);
    process.exit(1);
  });
