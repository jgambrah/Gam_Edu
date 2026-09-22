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

const freshMock4Paper1: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "Which of the following substances is an alloy of copper and zinc?",
    "options": [
      "Steel",
      "Bronze",
      "Solder",
      "Brass"
    ],
    "correctAnswer": "Brass",
    "hint": "Bronze is copper and tin; this alloy is copper and zinc.",
    "workedSolution": "Brass is an alloy composed predominantly of copper and zinc. Bronze consists of copper and tin, while steel is iron and carbon.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "When a speeding passenger bus stops abruptly, the passengers lurch forward. This physical occurrence demonstrates",
    "options": [
      "Newton's First Law of Motion.",
      "Newton's Second Law of Motion.",
      "Newton's Third Law of Motion.",
      "the principle of conservation of momentum."
    ],
    "correctAnswer": "Newton's First Law of Motion.",
    "hint": "Inertia causes a body to maintain its state of uniform motion.",
    "workedSolution": "According to Newton's First Law (Law of Inertia), passengers continue moving forward with the bus's prior speed until an external braking force acts on them.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "The vegetative part of an onion plant modified for food storage is the",
    "options": [
      "swollen taproot.",
      "underground stem tuber.",
      "lateral runner.",
      "fleshy scale leaf."
    ],
    "correctAnswer": "fleshy scale leaf.",
    "hint": "An onion bulb consists of concentric modified leaves.",
    "workedSolution": "An onion bulb is a specialized underground shoot consisting of a reduced stem bearing concentric, fleshy scale leaves that store food reserves.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "Which of the following cellular organisms lacks a membrane-bound nucleus and is classified as prokaryotic?",
    "options": [
      "Amoeba",
      "Spirogyra",
      "Yeast cell",
      "Bacterium"
    ],
    "correctAnswer": "Bacterium",
    "hint": "Contains naked circular DNA in a nucleoid without a nuclear envelope.",
    "workedSolution": "Bacteria are unicellular prokaryotes lacking a membrane-bound nucleus or membrane-bound organelles. Amoeba, yeast, and spirogyra are eukaryotes.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "A bicycle dynamo generates electricity from the rotation of the bicycle wheel. What energy transformation takes place in the dynamo?",
    "options": [
      "Chemical energy to kinetic energy",
      "Kinetic energy to electrical energy",
      "Electrical energy to light energy",
      "Potential energy to sound energy"
    ],
    "correctAnswer": "Kinetic energy to electrical energy",
    "hint": "Mechanical movement of a magnet inside a coil induces current.",
    "workedSolution": "A bicycle dynamo uses electromagnetic induction to convert the mechanical kinetic energy of the turning wheel into electrical energy.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Which chemical compound is responsible for temporary hardness in natural well water?",
    "options": [
      "Calcium hydrogencarbonate",
      "Calcium sulfate",
      "Magnesium chloride",
      "Sodium carbonate"
    ],
    "correctAnswer": "Calcium hydrogencarbonate",
    "hint": "Decomposes on boiling to form calcium carbonate scale.",
    "workedSolution": "Temporary hardness is caused by dissolved calcium hydrogencarbonate, Ca(HCO₃)₂, or magnesium hydrogencarbonate, which decompose into insoluble carbonates upon heating.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "In human dentition, dental decay begins when mouth bacteria ferment food sugars to produce",
    "options": [
      "alkalis that dissolve dentine.",
      "enzymes that coat the cement.",
      "acids that demineralize enamel.",
      "toxins that harden the pulp cavity."
    ],
    "correctAnswer": "acids that demineralize enamel.",
    "hint": "Bacterial plaque produces acidic by-products that dissolve calcium enamel.",
    "workedSolution": "Mouth bacteria break down residual dietary sugars into organic acids that lower mouth pH, demineralizing and dissolving the outer tooth enamel.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Which farm tool is specifically used for leveling ploughed seedbeds and collecting uprooted weeds?",
    "options": [
      "Garden rake",
      "Hand trowel",
      "Pickaxe",
      "Pruning shears"
    ],
    "correctAnswer": "Garden rake",
    "hint": "Features metal tines mounted on a horizontal crossbar.",
    "workedSolution": "A garden rake has metal teeth designed to level tilled soil surfaces, pulverize surface clods, and gather uprooted weeds and debris.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "What is the total number of electrons present in an aluminum ion, Al³⁺, formed from an atom of aluminum (Z = 13)?",
    "options": [
      "3",
      "10",
      "13",
      "16"
    ],
    "correctAnswer": "10",
    "hint": "Aluminum loses its 3 valence electrons to achieve stability.",
    "workedSolution": "A neutral aluminum atom has 13 electrons (2, 8, 3). When forming the Al³⁺ cation, it loses its 3 valence electrons, leaving 10 electrons (2, 8).",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "The darkest, central region of a shadow where all light from an extended source is completely blocked is called the",
    "options": [
      "penumbra.",
      "spectrum.",
      "focus.",
      "umbra."
    ],
    "correctAnswer": "umbra.",
    "hint": "Total shadow; the partial shadow is the penumbra.",
    "workedSolution": "The umbra is the totally dark inner core of a shadow where all incident light rays from a source are blocked by an opaque body. The penumbra is the outer partial shadow.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "Why is mercury preferred over water as a thermometric liquid in laboratory thermometers?",
    "options": [
      "It wets the glass bore easily.",
      "It does not cling to the glass walls.",
      "It has a high freezing point of 0°C.",
      "It is transparent and colorless."
    ],
    "correctAnswer": "It does not cling to the glass walls.",
    "hint": "High cohesion prevents meniscus sticking; expands evenly.",
    "workedSolution": "Mercury has high surface tension and does not wet glass walls, has a wide liquid range (-39°C to 357°C), is opaque and silvery for easy reading, and conducts heat rapidly.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "The removal of the horn buds of young calves to prevent injury to other animals is known as",
    "options": [
      "culling.",
      "castrating.",
      "dehorning.",
      "docking."
    ],
    "correctAnswer": "dehorning.",
    "hint": "Also called disbudding in very young livestock.",
    "workedSolution": "Dehorning (or disbudding) is the physical or chemical removal of horn buds in livestock to prevent horned animals from injuring each other or farm handlers.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "Which of the following elements exists as allotropes in the forms of diamond and graphite?",
    "options": [
      "Carbon",
      "Silicon",
      "Sulfur",
      "Phosphorus"
    ],
    "correctAnswer": "Carbon",
    "hint": "Forms giant covalent lattices of either tetrahedral or planar hexagonal layers.",
    "workedSolution": "Carbon exists as allotropes: diamond (rigid tetrahedral network) and graphite (layered hexagonal sheets with delocalized electrons).",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "During human respiration, the diffusion of gases between the air and blood capillaries occurs across the walls of the",
    "options": [
      "bronchi.",
      "larynx.",
      "trachea.",
      "alveoli."
    ],
    "correctAnswer": "alveoli.",
    "hint": "Microscopic single-cell-thick air sacs in the lungs.",
    "workedSolution": "Alveoli provide an extensive, moist, single-cell-thick respiratory surface surrounded by pulmonary capillaries where oxygen and carbon dioxide diffuse.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "An electrical component used to adjust or vary the magnitude of current in an electric circuit is a",
    "options": [
      "transformer.",
      "voltmeter.",
      "capacitor.",
      "rheostat."
    ],
    "correctAnswer": "rheostat.",
    "hint": "A variable resistor with a sliding contact.",
    "workedSolution": "A rheostat (variable resistor) adjusts circuit resistance, allowing fine control over current flow.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "Which of the following agricultural practices helps to check severe wind erosion in open flat savannah farmlands?",
    "options": [
      "Planting shelterbelts",
      "Practicing clean weeding",
      "Ploughing along the slope",
      "Burning dry crop residues"
    ],
    "correctAnswer": "Planting shelterbelts",
    "hint": "Rows of dense trees planted across prevailing wind paths.",
    "workedSolution": "Shelterbelts (windbreaks) are linear tree barriers planted perpendicular to prevailing winds to reduce wind velocity and prevent topsoil detachment.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "A boy applies an effort force of 50 N to lift a load of 200 N using a simple lever. What is the Mechanical Advantage (MA) of the lever?",
    "options": [
      "0.25",
      "2.00",
      "4.00",
      "10.00"
    ],
    "correctAnswer": "4.00",
    "hint": "Mechanical Advantage = Load / Effort.",
    "workedSolution": "MA = Load / Effort = 200 N / 50 N = 4.00.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "In the female mammalian reproductive system, mature ova are released from the",
    "options": [
      "uterus.",
      "ovary.",
      "cervix.",
      "oviduct."
    ],
    "correctAnswer": "ovary.",
    "hint": "The primary female gonad where ovulation occurs.",
    "workedSolution": "The ovary is the primary female gonad responsible for oogenesis and the release of mature ova during ovulation.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "Which of the following mixtures can be separated by adding water, stirring, and filtering, followed by evaporation?",
    "options": [
      "Sand and common salt",
      "Kerosene and water",
      "Alcohol and water",
      "Iron filings and sulfur"
    ],
    "correctAnswer": "Sand and common salt",
    "hint": "One component dissolves in water while the other remains insoluble.",
    "workedSolution": "Salt dissolves in water while sand remains insoluble. Filtration collects the sand residue, and evaporation of the filtrate recovers pure salt crystals.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "A person who consumes a diet lacking in protein over a prolonged period is likely to develop",
    "options": [
      "rickets.",
      "scurvy.",
      "goiter.",
      "kwashiorkor."
    ],
    "correctAnswer": "kwashiorkor.",
    "hint": "Nutritional disorder characterized by edema, swollen belly, and wasting.",
    "workedSolution": "Kwashiorkor is a severe protein malnutrition disorder characterized by edema, swollen abdomen, skin depigmentation, and muscle wasting.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "What is the S.I. unit for measuring electrical resistance?",
    "options": [
      "Volt",
      "Ampere",
      "Ohm",
      "Watt"
    ],
    "correctAnswer": "Ohm",
    "hint": "Represented by the Greek symbol Omega (Ω).",
    "workedSolution": "The Ohm (Ω) is the S.I. derived unit of electrical resistance. Volts measure potential difference; Amperes measure current; Watts measure power.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "The practice of supporting trailing tomato and yam vines with upright wooden stakes is done primarily to",
    "options": [
      "absorb more soil moisture.",
      "prevent leaves and fruits from rotting on the ground.",
      "prevent birds from perching on the crops.",
      "reduce the transpiration rate of the leaves."
    ],
    "correctAnswer": "prevent leaves and fruits from rotting on the ground.",
    "hint": "Keeps foliage and fruits off wet soil to minimize fungal infections.",
    "workedSolution": "Staking keeps climbing vines and developing fruits elevated off moist soil, preventing soil-borne fungal infections, fruit rot, and facilitating sunlight capture.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "When an atom of sodium (₁₁Na) combines with an atom of chlorine (₁₇Cl), the sodium atom",
    "options": [
      "gains one electron to form an anion.",
      "loses one electron to form a cation.",
      "shares two electrons with the chlorine atom.",
      "gains seven electrons to fill its outer shell."
    ],
    "correctAnswer": "loses one electron to form a cation.",
    "hint": "Sodium has 1 valence electron (2, 8, 1) and readily donates it.",
    "workedSolution": "Sodium (2, 8, 1) loses its single valence electron to achieve a neon configuration (2, 8), forming a positively charged sodium cation (Na⁺).",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "In the human urinary system, urine flows from the kidneys to the urinary bladder through the",
    "options": [
      "renal arteries.",
      "urethras.",
      "ureters.",
      "nephron tubules."
    ],
    "correctAnswer": "ureters.",
    "hint": "Two muscular tubes leading from the renal pelvis down to the bladder.",
    "workedSolution": "The ureters are bilateral muscular ducts that convey urine from the renal pelvis of each kidney into the urinary bladder by peristalsis.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "An electric immersion heater of resistance 24 Ω is connected across a 240 V power supply. Calculate the current flowing through the heater.",
    "options": [
      "0.1 A",
      "5.7 A",
      "10.0 A",
      "24.0 A"
    ],
    "correctAnswer": "10.0 A",
    "hint": "Ohm's Law: Current = Voltage / Resistance.",
    "workedSolution": "I = V / R = 240 V / 24 Ω = 10.0 A.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "Which of the following substances will produce effervescence of carbon dioxide gas when mixed with dilute hydrochloric acid?",
    "options": [
      "Calcium carbonate",
      "Sodium chloride",
      "Copper metal",
      "Magnesium oxide"
    ],
    "correctAnswer": "Calcium carbonate",
    "hint": "Carbonates react with mineral acids to liberate carbon dioxide gas.",
    "workedSolution": "Calcium carbonate reacts with dilute hydrochloric acid to form calcium chloride, water, and effervescing carbon dioxide gas: CaCO₃ + 2HCl -> CaCl₂ + H₂O + CO₂↑.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "The transfer of heat by the actual bodily movement of heated fluid particles from one place to another is called",
    "options": [
      "conduction.",
      "radiation.",
      "absorption.",
      "convection."
    ],
    "correctAnswer": "convection.",
    "hint": "Occurs only in fluids (liquids and gases) via density currents.",
    "workedSolution": "Convection is heat transfer through fluids caused by density differences: heated fluid expands, becomes less dense, rises, and is replaced by cooler, denser fluid.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Which of the following crops is a cereal grain?",
    "options": [
      "Sorghum",
      "Cowpea",
      "Groundnut",
      "Soya bean"
    ],
    "correctAnswer": "Sorghum",
    "hint": "A grass crop cultivated for its edible grain seeds; the others are legumes.",
    "workedSolution": "Sorghum (along with maize, rice, and millet) is a graminaceous cereal crop cultivated for its starchy edible grains. Cowpea and groundnut are legumes.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "An optical pinhole camera produces an image that is always",
    "options": [
      "virtual and upright.",
      "real and inverted.",
      "magnified and upright.",
      "virtual and inverted."
    ],
    "correctAnswer": "real and inverted.",
    "hint": "Formed on a physical screen by intersecting straight rays from an aperture.",
    "workedSolution": "Because light travels in straight lines across the aperture, light rays cross, producing a real, inverted image on the screen.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "The function of white blood cells (leukocytes) in the human body is to",
    "options": [
      "transport oxygen to tissues.",
      "initiate blood clotting at wounds.",
      "protect the body against pathogen infections.",
      "distribute digested glucose throughout the body."
    ],
    "correctAnswer": "protect the body against pathogen infections.",
    "hint": "Cells of the immune system that perform phagocytosis and antibody synthesis.",
    "workedSolution": "White blood cells defend against microbial infections via phagocytosis and antibody production.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "Which of the following gas components of air supports the combustion of fuels?",
    "options": [
      "Oxygen",
      "Nitrogen",
      "Carbon dioxide",
      "Argon"
    ],
    "correctAnswer": "Oxygen",
    "hint": "Makes up ~21% of the atmosphere and reacts with fuels during burning.",
    "workedSolution": "Oxygen gas supports combustion; it serves as the oxidizing agent in chemical reactions between fuels and oxygen.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "The process whereby living organisms maintain a stable internal physiological state despite external environmental changes is called",
    "options": [
      "assimilation.",
      "transpiration.",
      "locomotion.",
      "homeostasis."
    ],
    "correctAnswer": "homeostasis.",
    "hint": "Regulates body temperature, blood glucose, and water balance.",
    "workedSolution": "Homeostasis is the biological maintenance of a dynamic, constant internal physiological environment (such as body temperature and osmoregulation).",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "A block of wood of mass 6 kg is hoisted vertically through a height of 3 m. Calculate the work done against gravity. [g = 10 m s⁻²]",
    "options": [
      "18 J",
      "60 J",
      "180 J",
      "300 J"
    ],
    "correctAnswer": "180 J",
    "hint": "Work done = Force x distance = (m x g) x h.",
    "workedSolution": "Weight = m x g = 6 kg x 10 m s⁻² = 60 N. Work Done = F x h = 60 N x 3 m = 180 J.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "In poultry production, debeaking is carried out on domestic fowls to",
    "options": [
      "improve egg incubation rates.",
      "increase feed consumption speed.",
      "control feather pecking and cannibalism.",
      "facilitate vaccination administration."
    ],
    "correctAnswer": "control feather pecking and cannibalism.",
    "hint": "Trimming the sharp tip of the upper beak.",
    "workedSolution": "Debeaking (beak trimming) removes the sharp tip of the upper mandible in domestic poultry to prevent cannibalism, feather pecking, and egg eating.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "When a beam of light passes from glass into air at an angle, the light ray",
    "options": [
      "bends toward the normal line.",
      "bends away from the normal line.",
      "travels straight without changing speed.",
      "reflects completely along its incident path."
    ],
    "correctAnswer": "bends away from the normal line.",
    "hint": "Light speeds up when emerging into an optically less dense medium.",
    "workedSolution": "Air is optically less dense than glass. Light speeds up as it leaves glass, causing the ray to bend away from the normal line (angle of refraction > angle of incidence).",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "Which of the following domestic substances will turn red litmus paper blue?",
    "options": [
      "Fresh lemon juice",
      "Wood ash solution",
      "Dilute vinegar",
      "Pure distilled water"
    ],
    "correctAnswer": "Wood ash solution",
    "hint": "Contains potassium carbonate and alkaline hydroxides (pH > 7).",
    "workedSolution": "Wood ash dissolved in water forms an alkaline solution containing potassium and carbonate hydroxides (pH > 7), turning red litmus paper blue.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "The reproductive organ in an angiosperm flower that produces pollen grains is the",
    "options": [
      "anther.",
      "stigma.",
      "ovary.",
      "sepal."
    ],
    "correctAnswer": "anther.",
    "hint": "The terminal pollen-bearing sac of the stamen.",
    "workedSolution": "The anther is the terminal pollen-producing organ of the male stamen where microspores undergo meiosis to form viable pollen grains.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "Which of the following organisms is an ectoparasite of farm cattle?",
    "options": [
      "Tapeworm",
      "Liver fluke",
      "Roundworm",
      "Tick"
    ],
    "correctAnswer": "Tick",
    "hint": "Attaches externally to the hide to suck blood.",
    "workedSolution": "Ticks are external blood-feeding ectoparasites that attach to cattle skin and transmit diseases like babesiosis. Tapeworms and flukes are endoparasites.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "The change of state directly from solid to gas without passing through a liquid phase is known as",
    "options": [
      "condensation.",
      "evaporation.",
      "sublimation.",
      "melting."
    ],
    "correctAnswer": "sublimation.",
    "hint": "Observed when heating ammonium chloride, dry ice, or camphor.",
    "workedSolution": "Sublimation is the direct phase transition of a substance from solid to gas without entering an intermediate liquid state.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "An inclined plane allows a heavy barrel to be rolled into a truck bed with less applied force because it",
    "options": [
      "reduces the weight of the barrel.",
      "increases the effort distance over the load height.",
      "eliminates all frictional resistance.",
      "decreases the total work required to lift the load."
    ],
    "correctAnswer": "increases the effort distance over the load height.",
    "hint": "Force multiplier: work is spread over a longer sloped distance.",
    "workedSolution": "An inclined plane acts as a mechanical force multiplier. By extending the sloped distance along which effort is exerted relative to the vertical lift height, it reduces the required input force.",
    "points": 1
  }
];

async function updateMock4Paper1() {
  console.log('Replacing Paper 1 in mock_exams/mock_4 with diverse, balanced questions...');

  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  freshMock4Paper1.forEach((q) => {
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
  const docRef = db.doc('global_curriculum/jhs/subjects/science/mock_exams/mock_4');
  await docRef.set({
    paper1: {
      title: "Paper 1: Objective Test (Mock 4 - Recalibrated)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: freshMock4Paper1
    },
    metadata: {
      paper1RefreshedAt: new Date(),
      optionsBalanced: true
    }
  }, { merge: true });

  console.log('✅ Mock 4 Paper 1 successfully replaced in Firestore.');
}

updateMock4Paper1()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to update Mock 4 Paper 1:', err);
    process.exit(1);
  });
