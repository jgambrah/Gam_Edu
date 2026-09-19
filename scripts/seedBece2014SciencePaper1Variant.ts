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

interface QuestionItem {
  number: number;
  prompt: string;
  correctAnswer: string;
  distractors: string[];
  hint: string;
  workedSolution: string;
  points: number;
}

// 1. Vector SVG for Q02: Solar Eclipse Geometry
const svgQ02SolarEclipse = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 360 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    <!-- Sun (Source) -->
    <circle cx='45' cy='70' r='25' fill='#f59e0b' stroke='#d97706' stroke-width='2'/>
    <text x='45' y='110' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Sun</text>
    <!-- Moon (Between Sun and Earth) -->
    <circle cx='170' cy='70' r='8' fill='#94a3b8' stroke='#cbd5e1' stroke-width='1.5'/>
    <text x='170' y='95' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Moon</text>
    <!-- Earth (Receiving Shadow) -->
    <circle cx='300' cy='70' r='20' fill='#0284c7' stroke='#38bdf8' stroke-width='2'/>
    <text x='300' y='105' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Earth</text>
    <!-- Umbra Light Ray Bounds -->
    <line x1='70' y1='60' x2='170' y2='66' stroke='#e2e8f0' stroke-width='1' stroke-dasharray='2,2'/>
    <line x1='70' y1='80' x2='170' y2='74' stroke='#e2e8f0' stroke-width='1' stroke-dasharray='2,2'/>
    <polygon points='178,66 280,68 280,72 178,74' fill='#000000' opacity='0.7'/>
    <text x='180' y='130' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>SOLAR ECLIPSE: MOON OCCLUDING SUNLIGHT</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q22: Hydrostatic Pressure with Liquid Depth
const svgQ22HydrostaticPressure = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 320 180' width='100%' height='150' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    <!-- Tall Water Cylinder -->
    <rect x='60' y='25' width='100' height='130' fill='#0284c7' opacity='0.3' stroke='#38bdf8' stroke-width='2'/>
    <!-- Spout A (High up, weak jet) -->
    <circle cx='160' cy='50' r='3' fill='#38bdf8'/>
    <path d='M 160 50 Q 185 55 195 145' fill='none' stroke='#38bdf8' stroke-width='1.8'/>
    <text x='170' y='46' font-size='9' font-weight='bold' fill='#94a3b8'>Hole A</text>
    <!-- Spout B (Midway, medium jet) -->
    <circle cx='160' cy='90' r='3' fill='#38bdf8'/>
    <path d='M 160 90 Q 215 95 235 145' fill='none' stroke='#38bdf8' stroke-width='1.8'/>
    <text x='170' y='86' font-size='9' font-weight='bold' fill='#94a3b8'>Hole B</text>
    <!-- Spout C (Bottom, furthest jet) -->
    <circle cx='160' cy='135' r='3' fill='#38bdf8'/>
    <path d='M 160 135 Q 260 138 290 145' fill='none' stroke='#38bdf8' stroke-width='2.2'/>
    <text x='170' y='130' font-size='9' font-weight='bold' fill='#38bdf8'>Hole C (Furthest)</text>
    <line x1='40' y1='145' x2='305' y2='145' stroke='#64748b' stroke-width='2'/>
    <text x='160' y='168' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>FLUID PRESSURE INCREASES WITH DEPTH (P = ρgh)</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

const rawScienceBank: QuestionItem[] = [
  {
    number: 1,
    prompt: "Which category of mammalian teeth possesses a pointed crown specialized for gripping and tearing tough flesh?",
    correctAnswer: "Canines",
    distractors: ["Incisors", "Premolars", "Molars"],
    hint: "These dagger-like teeth are prominent in carnivores.",
    workedSolution: "Canines have sharp, pointed cusps adapted specifically for seizing prey and ripping tough muscle fibers.",
    points: 1
  },
  {
    number: 2,
    prompt: `What celestial event takes place when the Moon moves directly between the Sun and the Earth, casting its shadow upon the Earth's surface?<br/>${svgQ02SolarEclipse}`,
    correctAnswer: "A solar eclipse",
    distractors: ["A lunar eclipse", "An equinox", "A planetary transit"],
    hint: "The Moon blocks out the Sun during the daytime.",
    workedSolution: "A solar eclipse occurs when the Moon passes directly between the Sun and Earth, projecting its umbral shadow across parts of Earth.",
    points: 1
  },
  {
    number: 3,
    prompt: "Which chemical element is represented by the Latin-derived chemical symbol 'Na' on the Periodic Table?",
    correctAnswer: "Sodium (Natrium)",
    distractors: ["Nitrogen", "Nickel", "Neon"],
    hint: "From the Latin word 'Natrium'.",
    workedSolution: "The symbol 'Na' originates from the Latin name 'Natrium', representing the alkali metal sodium.",
    points: 1
  },
  {
    number: 4,
    prompt: "In agricultural science, what does the term leaching refer to?",
    correctAnswer: "The downward washing of soluble mineral nutrients beyond the reach of plant roots by drainage water",
    distractors: [
      "The biological breakdown of plant tissues into rich humus",
      "The biological fixation of atmospheric nitrogen by bacteria",
      "The mechanical accumulation of gravel on the surface of soil"
    ],
    hint: "Water drains dissolved soil minerals down into deep subsoil layers.",
    workedSolution: "Leaching is the removal of soluble plant nutrients from the topsoil as percolating water drains deeply downward.",
    points: 1
  },
  {
    number: 5,
    prompt: "Which of the following structural characteristics is true of a typical mature plant cell?",
    correctAnswer: "It possesses a large central permanent vacuole and a rigid cellulose wall",
    distractors: [
      "It completely lacks a membrane-bound nucleus",
      "It is enclosed only by a flexible plasma membrane",
      "It possesses an irregular and indefinite shape"
    ],
    hint: "Plant cells have rigid borders and a large sap reservoir.",
    workedSolution: "Plant cells are characterized by a rigid cellulose cell wall that maintains a fixed shape and a large central fluid-filled vacuole.",
    points: 1
  },
  {
    number: 6,
    prompt: "Which of the following physical quantities is classified as a derived quantity rather than a fundamental base quantity?",
    correctAnswer: "Volume",
    distractors: ["Length", "Mass", "Thermodynamic temperature"],
    hint: "Derived quantities are formed from products or quotients of base dimensions (L × L × L).",
    workedSolution: "Volume is derived from the base dimension of length (m³), whereas length, mass, and temperature are fundamental base units.",
    points: 1
  },
  {
    number: 7,
    prompt: "Why do solid non-metallic elements such as sulfur and graphite shatter into fragments when struck with a hammer?",
    correctAnswer: "They are brittle and lack metallic bonding",
    distractors: ["They are highly malleable", "They are ductile", "They have high tensile strength"],
    hint: "Brittleness is the tendency to fracture under mechanical impact without plastic deformation.",
    workedSolution: "Solid non-metals lack delocalized metallic bonding; applied shear stresses cause adjacent like charges to repel and shatter (brittleness).",
    points: 1
  },
  {
    number: 8,
    prompt: "In domestic animal husbandry, what is the correct biological term for a young rabbit?",
    correctAnswer: "A bunny (or kit)",
    distractors: ["A fingerling", "A lamb", "A kid"],
    hint: "Young goats are kids, young sheep are lambs, and young rabbits are kits or bunnies.",
    workedSolution: "A juvenile rabbit is termed a kit or bunny. Fingerlings are young fish, and kids are young goats.",
    points: 1
  },
  {
    number: 9,
    prompt: "In an ecosystem, autotrophic green plants are designated as primary producers because they:",
    correctAnswer: "Synthesize their own organic carbohydrates using solar energy and carbon dioxide",
    distractors: [
      "Feed directly on decomposing forest litter",
      "Rely entirely on capturing insects for protein",
      "Absorb pre-formed organic compounds from soil bacteria"
    ],
    hint: "Autotrophs manufacture their own food through photosynthesis.",
    workedSolution: "Green plants convert inorganic carbon dioxide and water into chemical energy via photosynthesis, forming the base of ecological food chains.",
    points: 1
  },
  {
    number: 10,
    prompt: "What form of energy is released during the splitting (fission) or combining (fusion) of atomic nuclei?",
    correctAnswer: "Nuclear energy",
    distractors: ["Chemical energy", "Sound energy", "Gravitational potential energy"],
    hint: "Originates from the nucleus of atoms.",
    workedSolution: "Energy liberated from nuclear binding forces during fission or fusion is termed nuclear energy.",
    points: 1
  },
  {
    number: 11,
    prompt: "Which of the following elements is classified as a semi-metal (metalloid) exhibiting intermediate electrical conductivity?",
    correctAnswer: "Silicon",
    distractors: ["Sulfur", "Sodium", "Nitrogen"],
    hint: "Located on the staircase boundary of the Periodic Table; crucial for microchips.",
    workedSolution: "Silicon (Si) is a metalloid with chemical and electrical properties intermediate between metallic conductors and non-metallic insulators.",
    points: 1
  },
  {
    number: 12,
    prompt: "Which traditional agricultural system involves clearing and burning virgin forest plots repeatedly, abandoning them as fertility falls?",
    correctAnswer: "Shifting cultivation",
    distractors: ["Mixed farming", "Rotational paddock grazing", "Controlled crop rotation"],
    hint: "Farmers abandon depleted clearings to slash and burn fresh forest tracts.",
    workedSolution: "Shifting cultivation involves clearing new virgin forest plots once the old plot becomes depleted, driving deforestation.",
    points: 1
  },
  {
    number: 13,
    prompt: "What are the primary metabolic by-products generated during aerobic cellular respiration in living organisms?",
    correctAnswer: "Carbon (IV) oxide, water, and ATP energy",
    distractors: [
      "Oxygen gas and glucose",
      "Ethanol and methane",
      "Hydrogen gas and mineral salts"
    ],
    hint: "C₆H₁₂O₆ + 6O₂ ⟶ 6CO₂ + 6H₂O + Energy.",
    workedSolution: "Aerobic respiration oxidizes glucose in mitochondria, releasing carbon dioxide, water vapor, and cellular energy (ATP).",
    points: 1
  },
  {
    number: 14,
    prompt: "Which of the following statements about a mechanical force is scientifically accurate?",
    correctAnswer: "It is measured in Newtons and can alter the speed or direction of motion of a body",
    distractors: [
      "It is measured in Joules and represents the total energy stored",
      "It is a scalar quantity that has magnitude without direction",
      "It cannot cause a stationary mass to accelerate"
    ],
    hint: "A force is a push or pull (F = ma) measured in Newtons.",
    workedSolution: "Force is a vector quantity measured in Newtons (N) that can initiate motion, change speed, or alter direction.",
    points: 1
  },
  {
    number: 15,
    prompt: "Which of the following substances is classified as a solid-in-gas colloidal mixture (aerosol)?",
    correctAnswer: "Smoke (carbon soot suspended in air)",
    distractors: ["Brass alloy", "Soap lather", "Sugar syrup"],
    hint: "Tiny solid carbon particles dispersed in atmospheric air.",
    workedSolution: "Smoke consists of unburnt solid carbon particles dispersed in a gaseous medium, forming a solid-in-gas aerosol.",
    points: 1
  },
  {
    number: 16,
    prompt: "Which weed management technique involves manually pulling weeds out of nursery beds with their roots?",
    correctAnswer: "Hand-pulling / Handpicking",
    distractors: ["Flooding the plot", "Deep mechanical harrowing", "Applying non-selective systemic herbicides"],
    hint: "A gentle manual technique ideal for nursery seedlings.",
    workedSolution: "Hand-pulling removes weeds with their root systems intact without damaging adjacent young seedlings in delicate seedbeds.",
    points: 1
  },
  {
    number: 17,
    prompt: "Which artificial, non-living membrane is commonly used in laboratory demonstrations of osmosis to model a selectively permeable cell membrane?",
    correctAnswer: "Dialysis tubing (Cellophane)",
    distractors: ["Ordinary filter paper", "A strip of thick cardboard", "Perforated aluminum foil"],
    hint: "A synthetic cellulose membrane possessing microscopic pores that allow water through while blocking sugar molecules.",
    workedSolution: "Cellophane (dialysis tubing) acts as a selectively permeable non-living barrier, permitting small solvent molecules to pass while blocking larger solutes.",
    points: 1
  },
  {
    number: 18,
    prompt: "Why is a thin film of kerosene or vegetable oil spread over stagnant pools to control mosquito populations?",
    correctAnswer: "It reduces surface tension and blocks the respiratory siphons of larvae and pupae",
    distractors: [
      "It chemically sterilizes adult female mosquitoes",
      "It turns the water acidic and dissolves mosquito eggs",
      "It attracts aquatic predators that consume the larvae"
    ],
    hint: "Larvae cannot hang from the surface film and drown.",
    workedSolution: "An oil film breaks surface tension and occludes the breathing siphons of mosquito larvae and pupae, leading to suffocation.",
    points: 1
  },
  {
    number: 19,
    prompt: "Which laboratory separation method is used to separate an insoluble solid residue from a liquid suspension?",
    correctAnswer: "Filtration",
    distractors: ["Fractional distillation", "Crystallization", "Simple sublimation"],
    hint: "Employs a porous barrier (filter paper) that retains the solid residue.",
    workedSolution: "Filtration separates insoluble solids from liquids: the liquid filtrate passes through the filter pores while the solid residue is retained.",
    points: 1
  },
  {
    number: 20,
    prompt: "In commercial egg-laying poultry enterprises, the practice of systematically removing unproductive, old, or sick birds is known as:",
    correctAnswer: "Culling",
    distractors: ["Candling", "Debeaking", "Brooding"],
    hint: "Maintains flock feed efficiency by eliminating non-layers.",
    workedSolution: "Culling is the planned removal of unprofitable, diseased, or non-producing birds from a poultry flock to conserve feed.",
    points: 1
  },
  {
    number: 21,
    prompt: "Which pair of human gastrointestinal infectious diseases is mechanically transmitted by houseflies landing on uncovered food?",
    correctAnswer: "Cholera and amoebic dysentery",
    distractors: [
      "Malaria and yellow fever",
      "Tuberculosis and measles",
      "Tetanus and rabies"
    ],
    hint: "Caused by pathogens transferred from fecal matter onto food by flies.",
    workedSolution: "Houseflies walk on faecal waste and transfer pathogens such as Vibrio cholerae and Entamoeba histolytica to uncovered human food.",
    points: 1
  },
  {
    number: 22,
    prompt: `In a tall container filled with water, how does the hydrostatic fluid pressure vary with increasing depth below the surface?<br/>${svgQ22HydrostaticPressure}`,
    correctAnswer: "Pressure increases directly with increasing depth",
    distractors: [
      "Pressure decreases progressively toward the bottom",
      "Pressure remains constant at all depths",
      "Pressure acts only in a downward vertical direction"
    ],
    hint: "Water jets from the lowest hole squirt furthest.",
    workedSolution: "Fluid pressure is given by P = ρgh. As depth h increases, the weight of the overlying water column increases, elevating pressure.",
    points: 1
  },
  {
    number: 23,
    prompt: "Which phase change represents an exothermic transition in which a substance converts from a liquid state into a solid state?",
    correctAnswer: "Freezing (Solidification)",
    distractors: ["Sublimation", "Evaporation", "Melting"],
    hint: "Water turning into solid ice cubes in a freezer.",
    workedSolution: "Freezing is the physical phase transition from liquid to solid, releasing latent heat of fusion as particles lose kinetic energy.",
    points: 1
  },
  {
    number: 24,
    prompt: "Which of the following food substances provides the highest concentration of dietary fiber (roughage) to stimulate peristalsis?",
    correctAnswer: "Fresh green cabbage / leafy vegetables",
    distractors: ["Boiled egg white", "Refined white sugar", "Melted butter"],
    hint: "Plant cell walls rich in cellulose provide bulk to digest.",
    workedSolution: "Green leafy vegetables contain high levels of insoluble cellulose (dietary fiber), which adds bulk to stool and prevents constipation.",
    points: 1
  },
  {
    number: 25,
    prompt: "Which of the following organisms functions as an ectoparasite that feeds on animal blood while attached to external skin?",
    correctAnswer: "A tick",
    distractors: ["A tapeworm", "A roundworm", "A liver fluke"],
    hint: "Lives externally on cattle or dogs; endoparasites live inside the gut.",
    workedSolution: "Ticks are external blood-feeding ectoparasites. Tapeworms and liver flukes are endoparasites residing inside host internal organs.",
    points: 1
  },
  {
    number: 26,
    prompt: "Which semiconductor electronic device consisting of two p-n junctions can function as an amplifier or an electronic switch?",
    correctAnswer: "A transistor",
    distractors: ["An electrical inductor", "A ceramic capacitor", "A wire-wound resistor"],
    hint: "Can be n-p-n or p-n-p, featuring emitter, base, and collector terminals.",
    workedSolution: "A bipolar junction transistor contains two p-n junctions and functions as an electronic switch and amplifier.",
    points: 1
  },
  {
    number: 27,
    prompt: "Which of the following statements correctly describes the chemical and physical properties of pure distilled water?",
    correctAnswer: "It has a neutral pH of 7 and leaves red and blue litmus papers unchanged",
    distractors: [
      "It turns blue litmus paper strongly red",
      "It turns red litmus paper dark blue",
      "It possesses a density of 10 g/cm³ at room temperature"
    ],
    hint: "Pure water is neither acidic nor basic.",
    workedSolution: "Pure water is a neutral solvent (pH = 7) containing equal concentrations of H⁺ and OH⁻ ions, having no effect on litmus papers.",
    points: 1
  },
  {
    number: 28,
    prompt: "Why is analyzing the soil profile of a farmland parcel important before establishing a fruit orchard?",
    correctAnswer: "It reveals topsoil depth, subsoil drainage, and root-penetration limits",
    distractors: [
      "It dictates the market retail price of the harvested fruit",
      "It determines the type of agro-chemical pesticides required",
      "It prevents wind pollination from occurring on the farm"
    ],
    hint: "Perennial fruit trees need deep, uncompacted subsoil for taproots.",
    workedSolution: "Examining soil profile horizons shows topsoil depth, water-table levels, and hardpans, confirming whether deep taproots can establish.",
    points: 1
  },
  {
    number: 29,
    prompt: "In a laboratory test for starch in a green leaf, why is the leaf boiled in ethanol over a water bath?",
    correctAnswer: "To extract and dissolve the green chlorophyll pigment for clear iodine color observation",
    distractors: [
      "To hydrolyze stored starch into glucose molecules",
      "To kill photosynthetic enzymes and make the leaf brittle",
      "To synthesize new carbohydrates within the palisade cells"
    ],
    hint: "Chlorophyll must be removed so that the blue-black color change with iodine is clearly visible.",
    workedSolution: "Boiling in ethanol decolourizes the leaf by dissolving chlorophyll, ensuring any subsequent blue-black color with iodine is clearly visible.",
    points: 1
  },
  {
    number: 30,
    prompt: "Which of the following energy resources can be replenished naturally and will not be exhausted by continuous human utilization?",
    correctAnswer: "Solar and wind energy",
    distractors: ["Crude petroleum oil", "Natural bituminous coal", "Refined diesel fuel"],
    hint: "Resources powered continuously by natural atmospheric and solar cycles.",
    workedSolution: "Solar and wind energy are inexhaustible renewable resources, unlike fossil fuels, which require millions of years to regenerate.",
    points: 1
  },
  {
    number: 31,
    prompt: "Which of the following chemical substances represents a compound formed by chemical bonding between distinct elements?",
    correctAnswer: "Pure water [H₂O]",
    distractors: ["Oxygen gas [O₂]", "Nitrogen gas [N₂]", "Solid zinc metal [Zn]"],
    hint: "A compound must contain two or more different elements chemically united.",
    workedSolution: "Water (H₂O) is a compound consisting of hydrogen and oxygen atoms chemically bonded in a fixed 2:1 ratio.",
    points: 1
  },
  {
    number: 32,
    prompt: "Which category of plant pathogens lacks cellular organelles and is notoriously difficult to control once established in crop tissue?",
    correctAnswer: "Plant viruses (e.g., Cocoa Swollen Shoot Virus)",
    distractors: ["Soil nematodes", "Parasitic fungi", "Epiphytic mosses"],
    hint: "Sub-microscopic infectious agents consisting of nucleic acid inside a protein coat.",
    workedSolution: "Plant viruses integrate into host cellular machinery and lack metabolic targets, making them immune to conventional antibiotics and fungicides.",
    points: 1
  },
  {
    number: 33,
    prompt: "Which of the following organisms possesses a multicellular level of biological organization with specialized tissues?",
    correctAnswer: "An onion plant (Allium cepa)",
    distractors: ["Amoeba proteus", "Paramecium caudatum", "Euglena viridis"],
    hint: "Amoeba and Paramecium are single-celled organisms.",
    workedSolution: "An onion is a multicellular eukaryotic angiosperm with distinct root, bulb, and leaf tissues, while Amoeba is unicellular.",
    points: 1
  },
  {
    number: 34,
    prompt: "In direct current electronic circuits, what is the primary diagnostic function of a Light Emitting Diode (LED)?",
    correctAnswer: "Providing a visual illumination indicator that electric current is flowing",
    distractors: [
      "Stepping down high alternating supply voltages",
      "Storing high capacitive electrical energy",
      "Converting electrical signals into sound waves"
    ],
    hint: "Glows when current passes through in forward bias.",
    workedSolution: "LEDs emit light when forward-biased, serving as low-power visual indicators of circuit continuity and power status.",
    points: 1
  },
  {
    number: 35,
    prompt: "Carbon steel is a widely manufactured structural alloy composed primarily of:",
    correctAnswer: "Iron and a small percentage of carbon",
    distractors: ["Copper and zinc", "Copper and tin", "Aluminum and silicon"],
    hint: "Iron alloyed with carbon to increase tensile strength.",
    workedSolution: "Steel is an interstitial alloy composed of iron mixed with 0.02% to 2% carbon to improve hardness and tensile strength.",
    points: 1
  },
  {
    number: 36,
    prompt: "Which field practice improves soil aeration in waterlogged agricultural land by facilitating rapid removal of excess gravitational water?",
    correctAnswer: "Constructing artificial drainage channels",
    distractors: [
      "Heavy surface flood irrigation",
      "Applying fine powdered sulfur",
      "Rolling the field with heavy compaction machinery"
    ],
    hint: "Draining excess water empties soil macropores, allowing atmospheric oxygen in.",
    workedSolution: "Drainage removes excess free water from soil macropores, allowing atmospheric air to diffuse into the root zone.",
    points: 1
  },
  {
    number: 37,
    prompt: "Which anatomical conduits in the human respiratory system branch directly off the trachea to lead into each lung?",
    correctAnswer: "The left and right primary bronchi",
    distractors: ["The alveoli", "The vocal cords", "The pulmonary veins"],
    hint: "The windpipe bifurcates at its base into two primary tubes.",
    workedSolution: "The trachea bifurcates at its lower end into the left and right primary bronchi, which channel air into each lung.",
    points: 1
  },
  {
    number: 38,
    prompt: "Which of the following hazards is an immediate consequence of illegal unauthorized electricity connections?",
    correctAnswer: "Severe fire outbreaks from circuit overloading and electrical shock",
    distractors: [
      "A permanent reduction in utility generation frequency",
      "A complete elimination of transmission line resistance",
      "Immediate purification of atmospheric air"
    ],
    hint: "Bypassing safety breakers leads to overheated cables and fires.",
    workedSolution: "Illegal connections bypass safety circuit breakers and fuses, leading to cable overloading, insulation melting, and fatal fires.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which statement correctly reflects a fundamental cornerstone of the empirical scientific method?",
    correctAnswer: "Scientific hypotheses and conclusions must be grounded in observable, repeatable, and verifiable evidence",
    distractors: [
      "Scientific theories once adopted can never be revised or falsified",
      "Conclusions are derived purely through personal opinions",
      "Scientific facts do not require experimental testing"
    ],
    hint: "Science relies on testing, experimental verification, and reproducibility.",
    workedSolution: "The scientific method relies on systematic observation, falsifiable hypotheses, controlled experimentation, and empirical verification.",
    points: 1
  },
  {
    number: 40,
    prompt: "In agribusiness management, an entrepreneur's decision regarding which specific crop to cultivate and how to allocate resources is classified as a:",
    correctAnswer: "Planning function",
    distractors: ["Supervising function", "Directing function", "Controlling function"],
    hint: "Involves setting goals and determining courses of action in advance.",
    workedSolution: "Deciding what commodities to produce, selecting target markets, and projecting resource allocations constitute the managerial planning function.",
    points: 1
  }
];

// Target permutation ensuring exactly 10 A, 10 B, 10 C, 10 D
const targetKeys: number[] = [
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3
];

function seedShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let m = arr.length, t, i;
  while (m) {
    seed = (seed * 9301 + 49297) % 233280;
    i = Math.floor((seed / 233280) * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

const assignedTargetIndices = seedShuffle(targetKeys, 201406);

export const balancedScience2014P1 = rawScienceBank.map((q, idx) => {
  const correctIdx = assignedTargetIndices[idx]; // 0=A, 1=B, 2=C, 3=D
  const options: string[] = [];
  let dCount = 0;
  for (let pos = 0; pos < 4; pos++) {
    if (pos === correctIdx) {
      options.push(q.correctAnswer);
    } else {
      options.push(q.distractors[dCount++]);
    }
  }
  return {
    number: q.number,
    prompt: q.prompt,
    options: options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points
  };
});

async function seedBece2014SciencePaper1Variant() {
  console.log('Seeding 2014 BECE Integrated Science Paper 1 Variant (Set 74) into Firestore...');
  const db = await getFirestore();

  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedScience2014P1.forEach(q => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Key Distribution across 40 items:', keyDist);

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2014_variant');
  await docRef.set({
    year: 2014,
    isVariant: true,
    setNumber: 74,
    subject: "Integrated Science",
    examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
    paper1: {
      title: "Paper 1: Objective Test (Variant)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: balancedScience2014P1
    },
    metadata: {
      sanitized: true,
      optionsBalanced: true,
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  }, { merge: true });

  console.log('✅ Ingestion complete: 2014 Science Paper 1 Variant seeded with exact 10A/10B/10C/10D distribution.');
}

seedBece2014SciencePaper1Variant()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Failed ingestion for Set 74 Science Paper 1:', err);
    process.exit(1);
  });
