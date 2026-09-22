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

const freshMock3Paper1: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "When three cardboards with central pinholes are aligned in a straight line between a lit candle and an observer, the flame is seen. If the middle cardboard is displaced slightly, the flame is no longer visible. This demonstrates that light",
    "options": [
      "travels in straight lines.",
      "can be reflected.",
      "can be dispersed.",
      "travels faster in air than in glass."
    ],
    "correctAnswer": "travels in straight lines.",
    "hint": "Rectilinear propagation of light.",
    "workedSolution": "Light travels along straight lines through a uniform medium. Displacing the center cardboard misaligns the pinholes, blocking the straight path of the light rays.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "In an ecosystem, which of the following organisms functions as a primary consumer?",
    "options": [
      "Grasshopper",
      "Grass",
      "Toad",
      "Hawk"
    ],
    "correctAnswer": "Grasshopper",
    "hint": "An herbivore feeding directly on autotrophic green plants.",
    "workedSolution": "Grasshoppers are herbivores that feed directly on autotrophic producers (grass), placing them at Trophic Level 2 as primary consumers.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "A student drives a nail into a wooden block using a claw hammer. The nail penetrates easily because the applied force is concentrated on",
    "options": [
      "a small surface area, producing high pressure.",
      "a large surface area, producing low pressure.",
      "a large volume, producing low friction.",
      "a small volume, producing high density."
    ],
    "correctAnswer": "a small surface area, producing high pressure.",
    "hint": "Pressure is inversely proportional to surface area (P = F / A).",
    "workedSolution": "The sharp point of a nail has an extremely small contact area. Under the applied hammer force, this small area generates high pressure, forcing the nail into the wood.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "Which part of the human tooth is modified primarily for tearing meat and flesh?",
    "options": [
      "Incisor",
      "Canine",
      "Premolar",
      "Molar"
    ],
    "correctAnswer": "Canine",
    "hint": "Pointed, dagger-shaped tooth located between incisors and premolars.",
    "workedSolution": "Canines have sharp, pointed crowns adapted specifically for gripping and tearing tough food items such as meat.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "The chemical formula for Iron(II) sulfide is",
    "options": [
      "FeS",
      "Fe₂S",
      "FeS₂",
      "Fe₂S₃"
    ],
    "correctAnswer": "FeS",
    "hint": "Both iron(II) and sulfide ions have a combining valency of 2.",
    "workedSolution": "Iron(II) carries a +2 charge (Fe²⁺) and sulfide carries a -2 charge (S²⁻). Combining in a 1:1 ratio yields FeS.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Which of the following farming systems involves moving from one cultivated piece of land to another after soil fertility declines, leaving the old land fallow?",
    "options": [
      "Shifting cultivation",
      "Mixed farming",
      "Mixed cropping",
      "Crop rotation"
    ],
    "correctAnswer": "Shifting cultivation",
    "hint": "Farmers abandon depleted plots to clear new land, returning after several years.",
    "workedSolution": "Shifting cultivation is a traditional agricultural system where plots are farmed until fertility drops, after which the farmer moves to clear fresh land while the old plot regenerates.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "An electric kettle consumes 2000 W of power when operated on a 240 V supply. What is the electric current drawn by the kettle?",
    "options": [
      "0.12 A",
      "4.80 A",
      "8.33 A",
      "12.00 A"
    ],
    "correctAnswer": "8.33 A",
    "hint": "Current I = Power / Voltage.",
    "workedSolution": "I = P / V = 2000 W / 240 V = 8.33 A.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Which of the following waste materials is non-biodegradable and persists in the environment for decades if not recycled?",
    "options": [
      "Polythene shopping bags",
      "Banana peelings",
      "Discarded paper cartons",
      "Dry wood shavings"
    ],
    "correctAnswer": "Polythene shopping bags",
    "hint": "Synthetic polymer resistant to microbial decay.",
    "workedSolution": "Polythene (plastic) is a synthetic polymer that soil microorganisms cannot readily break down, making it non-biodegradable.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "What is the mass number of an atom having 11 protons and 12 neutrons in its nucleus?",
    "options": [
      "1",
      "11",
      "12",
      "23"
    ],
    "correctAnswer": "23",
    "hint": "Mass number = Number of protons + Number of neutrons.",
    "workedSolution": "Mass Number (A) = Protons + Neutrons = 11 + 12 = 23 (Sodium-23).",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "A pregnant female rabbit giving birth is described in animal husbandry as",
    "options": [
      "culling.",
      "dubbing.",
      "weaning.",
      "kindling."
    ],
    "correctAnswer": "kindling.",
    "hint": "Term specific to parturition in rabbits.",
    "workedSolution": "Kindling refers specifically to the act of parturition (giving birth) in rabbits.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "Which of the following processes represents an exothermic chemical reaction?",
    "options": [
      "Burning of charcoal in air",
      "Dissolving ammonium chloride in water",
      "Evaporation of water from the skin",
      "Melting of ice into water"
    ],
    "correctAnswer": "Burning of charcoal in air",
    "hint": "Releases heat and light energy to the surrounding environment.",
    "workedSolution": "Combustion of charcoal (carbon) reacts with oxygen to form carbon dioxide while releasing thermal energy, making it an exothermic reaction.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "A car of mass 1000 kg accelerates at a rate of 2.5 m s⁻². Determine the net forward force acting on the car.",
    "options": [
      "400 N",
      "1000 N",
      "2500 N",
      "4000 N"
    ],
    "correctAnswer": "2500 N",
    "hint": "Force = mass x acceleration.",
    "workedSolution": "By Newton's Second Law: F = m x a = 1000 kg x 2.5 m s⁻² = 2500 N.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "Which of the following diseases is transmitted to humans by drinking water contaminated with infected freshwater snails?",
    "options": [
      "Bilharzia",
      "Cholera",
      "Typhoid",
      "Malaria"
    ],
    "correctAnswer": "Bilharzia",
    "hint": "Caused by Schistosoma flatworms whose intermediate hosts are aquatic snails.",
    "workedSolution": "Bilharzia (schistosomiasis) is caused by parasitic blood flukes that use freshwater snails as intermediate hosts to release infective cercariae into water.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "The scattering of a beam of light as it passes through a colloidal mixture such as fog or muddy water is known as the",
    "options": [
      "Doppler effect.",
      "Greenhouse effect.",
      "Meniscus effect.",
      "Tyndall effect."
    ],
    "correctAnswer": "Tyndall effect.",
    "hint": "Light scattering caused by suspended colloidal particles.",
    "workedSolution": "The Tyndall effect occurs when light beams scatter off microscopic particles suspended in a colloid or fine suspension, making the path of light visible.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "Which of the following agricultural tools is designed specifically for transplanting seedlings from nursery beds into the field?",
    "options": [
      "Garden rake",
      "Pickaxe",
      "Wheelbarrow",
      "Hand trowel"
    ],
    "correctAnswer": "Hand trowel",
    "hint": "Curved blade designed for lifting seedlings with an intact ball of soil.",
    "workedSolution": "A hand trowel has a curved, scooping blade ideal for lifting individual seedlings with their root balls intact from nursery beds.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "What is the combining power (valency) of Nitrogen in ammonia (NH₃)?",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "correctAnswer": "3",
    "hint": "Each hydrogen has a valency of 1 and three are bonded to nitrogen.",
    "workedSolution": "In ammonia (NH₃), nitrogen shares three pairs of electrons with three hydrogen atoms, showing a combining valency of 3.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "Which blood vessel carries deoxygenated blood from the right ventricle of the heart to the lungs?",
    "options": [
      "Aorta",
      "Renal vein",
      "Pulmonary artery",
      "Pulmonary vein"
    ],
    "correctAnswer": "Pulmonary artery",
    "hint": "The only artery in the body that conveys deoxygenated blood.",
    "workedSolution": "The pulmonary artery arises from the right ventricle and conveys deoxygenated blood to alveolar capillaries in the lungs for gas exchange.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "A stone has a mass of 150 g and a volume of 50 cm³. Calculate its density.",
    "options": [
      "0.33 g cm⁻³",
      "3.00 g cm⁻³",
      "100.00 g cm⁻³",
      "200.00 g cm⁻³"
    ],
    "correctAnswer": "3.00 g cm⁻³",
    "hint": "Density = Mass / Volume.",
    "workedSolution": "Density = Mass / Volume = 150 g / 50 cm³ = 3.00 g cm⁻³.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "Which of the following methods is the most effective way to prevent the rusting of an iron bicycle chain?",
    "options": [
      "Painting",
      "Galvanizing",
      "Washing with water",
      "Lubricating with oil"
    ],
    "correctAnswer": "Lubricating with oil",
    "hint": "Provides a waterproof barrier while reducing friction between moving links.",
    "workedSolution": "Applying lubricating oil coats the metal links to exclude atmospheric oxygen and moisture while allowing flexible movement without chipping off.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "The part of a seed that develops into the root system during germination is the",
    "options": [
      "cotyledon.",
      "endosperm.",
      "plumule.",
      "radicle."
    ],
    "correctAnswer": "radicle.",
    "hint": "Plumule becomes the shoot; this structure becomes the root.",
    "workedSolution": "The embryonic radicle emerges through the micropyle to form the primary taproot. The plumule develops into the leafy shoot system.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "Which instrument is used by meteorologists to measure atmospheric pressure?",
    "options": [
      "Hydrometer",
      "Barometer",
      "Anemometer",
      "Thermometer"
    ],
    "correctAnswer": "Barometer",
    "hint": "Mercury or aneroid instrument reading in mmHg or Pascals.",
    "workedSolution": "A barometer measures atmospheric air pressure. Anemometers measure wind speed; hydrometers measure liquid density.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "The chemical formula Na₂CO₃ represents",
    "options": [
      "sodium hydroxide.",
      "sodium chloride.",
      "sodium hydrogencarbonate.",
      "sodium carbonate."
    ],
    "correctAnswer": "sodium carbonate.",
    "hint": "Commonly known as washing soda.",
    "workedSolution": "Na₂CO₃ is sodium carbonate. NaHCO₃ is sodium hydrogencarbonate; NaOH is sodium hydroxide.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "Which of the following conditions is required for the germination of viable seeds?",
    "options": [
      "Bright sunlight",
      "Adequate moisture",
      "Chemical fertilizer",
      "Organic compost"
    ],
    "correctAnswer": "Adequate moisture",
    "hint": "Essential to soften the seed coat and activate hydrolytic enzymes.",
    "workedSolution": "Water (moisture), suitable temperature (warmth), and oxygen are the three essential conditions for seed germination. Light is not generally required.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "A lever has an effort arm of 80 cm and a load arm of 20 cm. Determine its Velocity Ratio (VR).",
    "options": [
      "0.25",
      "4.00",
      "60.00",
      "100.00"
    ],
    "correctAnswer": "4.00",
    "hint": "Velocity Ratio = Effort arm length / Load arm length.",
    "workedSolution": "VR = Distance moved by effort / Distance moved by load = 80 cm / 20 cm = 4.00.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "Which human organ produces bile to assist in the emulsification of dietary fats?",
    "options": [
      "Stomach",
      "Gall bladder",
      "Pancreas",
      "Liver"
    ],
    "correctAnswer": "Liver",
    "hint": "The gall bladder stores and concentrates it, but this organ manufactures it.",
    "workedSolution": "Bile is synthesized by hepatocytes in the liver and transported to the gall bladder for storage before release into the duodenum.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "An element with atomic number 12 combines with an element with atomic number 8. What type of chemical bond is formed?",
    "options": [
      "Covalent bond",
      "Ionic bond",
      "Metallic bond",
      "Hydrogen bond"
    ],
    "correctAnswer": "Ionic bond",
    "hint": "Formed between a metal that loses electrons and a non-metal that gains them.",
    "workedSolution": "Element 12 (Magnesium, metal: 2, 8, 2) transfers two electrons to element 8 (Oxygen, non-metal: 2, 6), forming an ionic bond between Mg²⁺ and O²⁻.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "The transfer of heat energy through a vacuum from the Sun to the Earth occurs by",
    "options": [
      "conduction.",
      "convection.",
      "radiation.",
      "evaporation."
    ],
    "correctAnswer": "radiation.",
    "hint": "Travels via electromagnetic infrared waves without needing material particles.",
    "workedSolution": "Thermal radiation travels as electromagnetic waves through the vacuum of space without requiring a material medium.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Which of the following practices helps to maintain the nitrogen balance in agricultural soils?",
    "options": [
      "Burning crop residue after harvest",
      "Growing leguminous cover crops",
      "Continuous monoculture of maize",
      "Deep clean weeding"
    ],
    "correctAnswer": "Growing leguminous cover crops",
    "hint": "Root nodules contain symbiotic Rhizobium bacteria that fix nitrogen gas.",
    "workedSolution": "Legumes harbor symbiotic Rhizobium bacteria in their root nodules that convert atmospheric nitrogen into nitrates, restoring soil nitrogen reserves.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "What is the function of the fuse in a domestic three-pin electrical plug?",
    "options": [
      "To step down high voltage",
      "To channel stray current to the ground",
      "To melt and break the circuit during overcurrent",
      "To convert alternating current to direct current"
    ],
    "correctAnswer": "To melt and break the circuit during overcurrent",
    "hint": "Contains a low-melting-point alloy wire that melts when current exceeds safe levels.",
    "workedSolution": "A fuse protects wiring and appliances by melting its alloy wire when current exceeds its amperage rating, opening the circuit to prevent fires.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "In flowering plants, fertilization occurs when a male nucleus fuses with the female gamete inside the",
    "options": [
      "anther.",
      "stigma.",
      "style.",
      "ovule."
    ],
    "correctAnswer": "ovule.",
    "hint": "Located inside the ovary and matures into a seed.",
    "workedSolution": "The pollen tube delivers sperm nuclei into the ovule inside the ovary, where fertilization occurs to form a zygote that develops into a seed.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "Which of the following mixtures can be separated into its components using a magnet?",
    "options": [
      "Iron filings and sulfur powder",
      "Sand and common salt",
      "Sugar and water",
      "Kerosene and water"
    ],
    "correctAnswer": "Iron filings and sulfur powder",
    "hint": "One component is ferromagnetic while the other is non-magnetic.",
    "workedSolution": "Iron is magnetic and is attracted to a magnet, while non-magnetic sulfur powder remains behind, making magnetic separation effective.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "The process by which water is drawn up from soil into root hair cells across a semi-permeable membrane is",
    "options": [
      "diffusion.",
      "osmosis.",
      "transpiration.",
      "translocation."
    ],
    "correctAnswer": "osmosis.",
    "hint": "Net movement of water along a water potential gradient across cell membranes.",
    "workedSolution": "Water enters root hair cells by osmosis from higher water potential in moist soil to lower water potential in cell sap across the semi-permeable plasma membrane.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "Which component of a semiconductor diode is formed by doping pure silicon with pentavalent impurity atoms?",
    "options": [
      "Anode",
      "p-type region",
      "n-type region",
      "Dielectric layer"
    ],
    "correctAnswer": "n-type region",
    "hint": "Provides extra free electrons as majority charge carriers.",
    "workedSolution": "Doping pure silicon with pentavalent atoms (such as phosphorus) introduces free conduction electrons, creating an n-type semiconductor material.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "A layer bird producing thin-shelled eggs is suffering from a dietary deficit of",
    "options": [
      "iron.",
      "iodine.",
      "calcium.",
      "nitrogen."
    ],
    "correctAnswer": "calcium.",
    "hint": "Essential mineral for synthesizing hard calcium carbonate eggshells.",
    "workedSolution": "Eggshells consist almost entirely of calcium carbonate. Calcium deficiency in a hen's feed results in weak, thin-shelled, or shell-less eggs.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "When a ray of light passes obliquely from air into water, the refracted ray",
    "options": [
      "bends toward the normal.",
      "bends away from the normal.",
      "continues without bending.",
      "reflects back along its incident path."
    ],
    "correctAnswer": "bends toward the normal.",
    "hint": "Light slows down upon entering an optically denser medium.",
    "workedSolution": "Water is optically denser than air. Light slows down upon entering water obliquely, bending toward the normal line (angle of refraction is less than angle of incidence).",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "An adult human dentition typically contains how many permanent canine teeth in total?",
    "options": [
      "2",
      "4",
      "8",
      "12"
    ],
    "correctAnswer": "4",
    "hint": "One canine on each side of the upper and lower jaws.",
    "workedSolution": "In the human dental formula (2.1.2.3 / 2.1.2.3), each quadrant contains 1 canine, giving a total of 4 canine teeth across both jaws.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "Which of the following substances will produce a salt and hydrogen gas when reacted with dilute hydrochloric acid?",
    "options": [
      "Copper metal",
      "Zinc metal",
      "Carbon powder",
      "Sulfur powder"
    ],
    "correctAnswer": "Zinc metal",
    "hint": "A reactive metal that displaces hydrogen from dilute mineral acids.",
    "workedSolution": "Zinc reacts with dilute hydrochloric acid to produce zinc chloride salt and effervescing hydrogen gas: Zn + 2HCl -> ZnCl₂ + H₂↑. Copper does not react.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "The energy possessed by a body due to its position or compressed state is termed",
    "options": [
      "kinetic energy.",
      "thermal energy.",
      "potential energy.",
      "sound energy."
    ],
    "correctAnswer": "potential energy.",
    "hint": "Stored energy (gravitational or elastic).",
    "workedSolution": "Potential energy is stored energy possessed by an object due to its position in a gravitational field (mgh) or elastic deformation.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "The removal of excess seedlings from a nursery bed stand to reduce competition is called",
    "options": [
      "staking.",
      "pruning.",
      "thinning out.",
      "earthing up."
    ],
    "correctAnswer": "thinning out.",
    "hint": "Reduces plant density to promote vigorous growth of remaining seedlings.",
    "workedSolution": "Thinning out is the deliberate removal of crowded seedlings to eliminate competition for light, space, and soil nutrients.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "Which of the following planets in our Solar System is situated closest to the Sun?",
    "options": [
      "Venus",
      "Earth",
      "Mars",
      "Mercury"
    ],
    "correctAnswer": "Mercury",
    "hint": "First planet in orbital order from the Sun.",
    "workedSolution": "Mercury is the innermost and smallest planet in the Solar System, orbiting closest to the Sun.",
    "points": 1
  }
];

async function updateMock3Paper1() {
  console.log('Replacing Paper 1 in mock_exams/mock_3 with diverse, balanced questions...');

  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  freshMock3Paper1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Paper 1 Key Distribution across 40 items:', keyDist);

  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error('Key balancing failed! Must be exactly 10 A, 10 B, 10 C, 10 D.');
  }

  const db = await getDb();
  const docRef = db.doc('global_curriculum/jhs/subjects/science/mock_exams/mock_3');
  await docRef.set({
    paper1: {
      title: "Paper 1: Objective Test (Mock 3 - Recalibrated)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: freshMock3Paper1
    },
    metadata: {
      paper1RefreshedAt: new Date(),
      optionsBalanced: true
    }
  }, { merge: true });

  console.log('✅ Mock 3 Paper 1 successfully replaced in Firestore.');
}

updateMock3Paper1()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to update Mock 3 Paper 1:', err);
    process.exit(1);
  });
