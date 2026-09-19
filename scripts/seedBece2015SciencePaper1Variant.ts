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
    return adminInstance.firestore();
  }
}

const balancedScience2015P1 = [
  {
    "id": "q01",
    "number": 1,
    "title": "Question 1",
    "format": "multiple_choice",
    "prompt": "Bronze is a non-ferrous commercial alloy composed of:",
    "options": [
      "Copper and zinc",
      "Copper and tin",
      "Iron and carbon",
      "Aluminum and magnesium"
    ],
    "correctAnswer": "Copper and tin",
    "hint": "Brass is copper and zinc, while bronze is copper combined with tin.",
    "workedSolution": "Bronze is a solid-solid metal solution composed predominantly of copper with approximately 12% tin.",
    "points": 1
  },
  {
    "id": "q02",
    "number": 2,
    "title": "Question 2",
    "format": "multiple_choice",
    "prompt": "Which of the following soil additives is classified as a synthetic inorganic fertilizer?",
    "options": [
      "Decomposed farmyard manure",
      "Composted poultry droppings",
      "Cow dung slurry",
      "NPK 15-15-15 compound"
    ],
    "correctAnswer": "NPK 15-15-15 compound",
    "hint": "Formulated industrially from processed chemical mineral salts.",
    "workedSolution": "NPK is an inorganic, manufactured synthetic chemical fertilizer supplying nitrogen, phosphorus, and potassium salts.",
    "points": 1
  },
  {
    "id": "q03",
    "number": 3,
    "title": "Question 3",
    "format": "multiple_choice",
    "prompt": "Which cellular constituent of human blood is specialized for transporting oxygen from pulmonary alveoli to body tissues?",
    "options": [
      "Red blood cells (Erythrocytes)",
      "Blood plasma",
      "Blood platelets (Thrombocytes)",
      "White blood cells (Leukocytes)"
    ],
    "correctAnswer": "Red blood cells (Erythrocytes)",
    "hint": "Contains the red iron-rich respiratory pigment hemoglobin.",
    "workedSolution": "Erythrocytes contain hemoglobin, which combines reversibly with oxygen to form oxyhemoglobin for systemic transport.",
    "points": 1
  },
  {
    "id": "q04",
    "number": 4,
    "title": "Question 4",
    "format": "multiple_choice",
    "prompt": "What is the primary safety function of an electrical fuse connected in series with a domestic circuit?",
    "options": [
      "Stepping down high transmission voltage to 240 V",
      "Storing capacitive charges during sudden blackouts",
      "Melting to break the circuit when electric current exceeds a safe limit",
      "Converting wasted alternating current into direct current"
    ],
    "correctAnswer": "Melting to break the circuit when electric current exceeds a safe limit",
    "hint": "Contains a low-melting-point wire that acts as an overcurrent protection device.",
    "workedSolution": "A fuse contains a thin wire with a low melting point that heats up and melts (blows) when excessive current flows, protecting equipment from fire.",
    "points": 1
  },
  {
    "id": "q05",
    "number": 5,
    "title": "Question 5",
    "format": "multiple_choice",
    "prompt": "Which of the following steps is an essential requirement in conducting investigation via the scientific method?",
    "options": [
      "Formulating a testable hypothesis based on observable problem identification",
      "Accepting established opinions without controlled experimental trials",
      "Fabricating laboratory data to match theoretical assumptions",
      "Rejecting experimental findings whenever they contradict popular intuition"
    ],
    "correctAnswer": "Formulating a testable hypothesis based on observable problem identification",
    "hint": "Science requires identifying a problem, proposing a hypothesis, and testing it empirically.",
    "workedSolution": "The empirical scientific method relies on systematic problem identification, hypothesis formulation, controlled experimentation, and data analysis.",
    "points": 1
  },
  {
    "id": "q06",
    "number": 6,
    "title": "Question 6",
    "format": "multiple_choice",
    "prompt": "Complete gastrointestinal digestion of which of the following food substances yields amino acids as end-products?",
    "options": [
      "Melted shea butter (Lipid)",
      "Boiled lean beef (Protein)",
      "Cooked cassava dough (Starch)",
      "Ripe sweet orange (Glucose)"
    ],
    "correctAnswer": "Boiled lean beef (Protein)",
    "hint": "Proteins are hydrolyzed by pepsin and trypsin into amino acids.",
    "workedSolution": "Dietary proteins in meat are enzymatically digested into polypeptides and finally absorbed into the blood as monomeric amino acids.",
    "points": 1
  },
  {
    "id": "q07",
    "number": 7,
    "title": "Question 7",
    "format": "multiple_choice",
    "prompt": "In modern consumer electronic devices, what is the process of increasing the power or amplitude of a weak electrical input signal using a transistor called?",
    "options": [
      "Rectification",
      "Doping",
      "Amplification",
      "Frequency modulation"
    ],
    "correctAnswer": "Amplification",
    "hint": "A transistor acts as a signal booster in public address sound systems.",
    "workedSolution": "Amplification is the process where a small alternating base current modulates a larger collector current in a transistor circuit.",
    "points": 1
  },
  {
    "id": "q08",
    "number": 8,
    "title": "Question 8",
    "format": "multiple_choice",
    "prompt": "What term describes the natural physical arrangement and clumping of individual soil particles into distinct aggregates or peds?",
    "options": [
      "Soil texture",
      "Soil profile",
      "Soil structure",
      "Soil porosity"
    ],
    "correctAnswer": "Soil structure",
    "hint": "Texture is particle size distribution; structure is how those particles group together.",
    "workedSolution": "Soil structure refers to the spatial arrangement and binding of sand, silt, and clay particles into natural aggregates called peds.",
    "points": 1
  },
  {
    "id": "q09",
    "number": 9,
    "title": "Question 9",
    "format": "multiple_choice",
    "prompt": "Which solvent is most effective for safely dissolving and removing hydrophobic bitumen, engine grease, or tar from a worker's hands?",
    "options": [
      "Kerosene",
      "Pure cold water",
      "Dilute hydrochloric acid",
      "Dilute sodium hydroxide"
    ],
    "correctAnswer": "Kerosene",
    "hint": "An organic non-polar petroleum distillate that dissolves oily hydrocarbons.",
    "workedSolution": "Bitumen is a non-polar petroleum hydrocarbon that is insoluble in polar water but dissolves readily in organic solvents such as kerosene.",
    "points": 1
  },
  {
    "id": "q10",
    "number": 10,
    "title": "Question 10",
    "format": "multiple_choice",
    "prompt": "Why is a dense granite cobblestone classified physically as an opaque material?",
    "options": [
      "It prevents any incident light rays from transmitting through it",
      "It transmits light rays with complete optical refraction",
      "It allows light rays to pass through partially with scattering",
      "It generates its own electromagnetic photons spontaneously"
    ],
    "correctAnswer": "It prevents any incident light rays from transmitting through it",
    "hint": "Opaque materials block all direct light transmission, casting distinct shadows.",
    "workedSolution": "Opaque materials absorb or reflect all incident light rays, allowing zero light transmission through their bulk.",
    "points": 1
  },
  {
    "id": "q11",
    "number": 11,
    "title": "Question 11",
    "format": "multiple_choice",
    "prompt": "What morphological adaptation enables bony fish to swim rapidly through aquatic environments with minimal frictional resistance?",
    "options": [
      "Heavy calcified scales covering the head",
      "Internal bony operculum flaps",
      "A streamlined body tapering toward both anterior and posterior ends",
      "Large lateral respiratory gill filaments"
    ],
    "correctAnswer": "A streamlined body tapering toward both anterior and posterior ends",
    "hint": "Reduces water drag and turbulence during locomotion.",
    "workedSolution": "A streamlined (fusiform) body contour minimizes drag forces and water turbulence as the aquatic animal moves forward.",
    "points": 1
  },
  {
    "id": "q12",
    "number": 12,
    "title": "Question 12",
    "format": "multiple_choice",
    "prompt": "Which pair of environmental conditions is indispensable for the atmospheric rusting (corrosion) of an exposed iron nail?",
    "options": [
      "Oxygen gas and moisture (water)",
      "Nitrogen gas and mineral oil",
      "Carbon dioxide and dry silica gel",
      "Pure nitrogen gas and bright sunshine"
    ],
    "correctAnswer": "Oxygen gas and moisture (water)",
    "hint": "Rust is hydrated iron (III) oxide: both air and water must be present simultaneously.",
    "workedSolution": "Rusting requires both oxygen and water: $4\\text{Fe} + 3\\text{O}_2 + 2x\\text{H}_2\\text{O} \\to 2\\text{Fe}_2\\text{O}_3 \\cdot x\\text{H}_2\\text{O}$.",
    "points": 1
  },
  {
    "id": "q13",
    "number": 13,
    "title": "Question 13",
    "format": "multiple_choice",
    "prompt": "A piece of insoluble stone is gently lowered into a measuring cylinder containing water, causing the level to rise from $50\\text{ cm}^3$ to $75\\text{ cm}^3$. The change in volume ($25\\text{ cm}^3$) equals the:<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 180' width='100%' height='150' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(50, 15)'><rect x='10' y='10' width='45' height='130' rx='3' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/><rect x='11' y='85' width='43' height='54' fill='#38bdf8' opacity='0.5'/><line x1='10' y1='85' x2='25' y2='85' stroke='#f59e0b' stroke-width='2'/><text x='5' y='88' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='end'>50 cm³</text><text x='32' y='160' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Initial (V₁)</text></g><g transform='translate(165, 55)'><path d='M 15 0 L 15 45' stroke='#cbd5e1' stroke-width='1' stroke-dasharray='3,2'/><ellipse cx='15' cy='55' rx='12' ry='10' fill='#94a3b8' stroke='#64748b' stroke-width='1.5'/><text x='15' y='80' font-size='9' fill='#cbd5e1' text-anchor='middle'>Insoluble Stone</text></g><g transform='translate(245, 15)'><rect x='10' y='10' width='45' height='130' rx='3' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/><rect x='11' y='60' width='43' height='79' fill='#38bdf8' opacity='0.5'/><line x1='10' y1='60' x2='25' y2='60' stroke='#34d399' stroke-width='2'/><text x='5' y='63' font-size='9' font-weight='bold' fill='#34d399' text-anchor='end'>75 cm³</text><ellipse cx='32' cy='115' rx='12' ry='10' fill='#94a3b8' stroke='#64748b' stroke-width='1.5'/><line x1='32' y1='10' x2='32' y2='105' stroke='#cbd5e1' stroke-width='1' stroke-dasharray='3,2'/><text x='32' y='160' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Final (V₂)</text></g></svg></div>",
    "options": [
      "Mass of the submerged stone",
      "Density of the submerged stone",
      "Weight of the submerged stone",
      "Volume of the submerged stone"
    ],
    "correctAnswer": "Volume of the submerged stone",
    "hint": "By Archimedes' principle, a completely submerged solid displaces its own volume of liquid.",
    "workedSolution": "An insoluble solid fully submerged in water displaces a volume of liquid exactly equal to the volume of the solid.",
    "points": 1
  },
  {
    "id": "q14",
    "number": 14,
    "title": "Question 14",
    "format": "multiple_choice",
    "prompt": "In the complete metamorphosis of the mosquito, what is the second developmental stage that hatches directly from the egg?",
    "options": [
      "Pupa (Tumbler)",
      "Larva (Wiggler)",
      "Imago (Adult)",
      "Nymph"
    ],
    "correctAnswer": "Larva (Wiggler)",
    "hint": "The active aquatic feeding stage with a breathing siphon.",
    "workedSolution": "Mosquito development follows: $\\text{Egg} \\to \\text{Larva (wiggler)} \\to \\text{Pupa (tumbler)} \\to \\text{Adult (imago)}$.",
    "points": 1
  },
  {
    "id": "q15",
    "number": 15,
    "title": "Question 15",
    "format": "multiple_choice",
    "prompt": "Which of the following metal objects will be strongly attracted toward the poles of a permanent magnet?",
    "options": [
      "A pure gold wedding ring",
      "An aluminum foil strip",
      "A carbon-steel sewing needle",
      "A solid copper wire"
    ],
    "correctAnswer": "A carbon-steel sewing needle",
    "hint": "Only ferromagnetic materials (iron, steel, nickel, cobalt) are attracted by magnets.",
    "workedSolution": "Steel contains ferromagnetic iron, so it experiences strong magnetic attraction.",
    "points": 1
  },
  {
    "id": "q16",
    "number": 16,
    "title": "Question 16",
    "format": "multiple_choice",
    "prompt": "Why is a diagnostic test of soil texture critically important to an agronomist before establishing a farm plantation?",
    "options": [
      "It dictates water retention capacity, nutrient drainage, and crop suitability",
      "It determines the appropriate planting calendar and seasonal rainfall",
      "It predicts the retail price of harvested crops in local markets",
      "It alters the genetic variety of seeds planted in the soil"
    ],
    "correctAnswer": "It dictates water retention capacity, nutrient drainage, and crop suitability",
    "hint": "The proportions of sand, silt, and clay determine moisture retention and aeration.",
    "workedSolution": "Soil texture determines pore space, drainage, and water retention, indicating which crops will thrive.",
    "points": 1
  },
  {
    "id": "q17",
    "number": 17,
    "title": "Question 17",
    "format": "multiple_choice",
    "prompt": "How many total constituent atoms are present in one formula unit of the chemical salt calcium chloride ($\\text{CaCl}_2$)?",
    "options": [
      "2 atoms",
      "4 atoms",
      "5 atoms",
      "3 atoms"
    ],
    "correctAnswer": "3 atoms",
    "hint": "One Calcium atom plus two Chlorine atoms.",
    "workedSolution": "$\\text{CaCl}_2$ contains 1 calcium atom and 2 chlorine atoms, totaling $1 + 2 = 3\\text{ atoms}$.",
    "points": 1
  },
  {
    "id": "q18",
    "number": 18,
    "title": "Question 18",
    "format": "multiple_choice",
    "prompt": "When water is heated from beneath in a glass beaker on a Bunsen flame, heat spreads through the liquid bulk primarily by:",
    "options": [
      "Conduction along molecules",
      "Electromagnetic radiation",
      "Capillary absorption",
      "Convection currents"
    ],
    "correctAnswer": "Convection currents",
    "hint": "Heated liquid expands, becomes less dense, and ascends while cooler fluid sinks.",
    "workedSolution": "Heating water sets up circulation currents where warmer, less dense water rises and cooler water sinks (convection).",
    "points": 1
  },
  {
    "id": "q19",
    "number": 19,
    "title": "Question 19",
    "format": "multiple_choice",
    "prompt": "Which of the following chemical substances is classified as a compound rather than a pure element?",
    "options": [
      "Ammonia gas [NH₃]",
      "Pure solid phosphorus [P₄]",
      "Gaseous nitrogen [N₂]",
      "Solid zinc granules [Zn]"
    ],
    "correctAnswer": "Ammonia gas [NH₃]",
    "hint": "A compound consists of two or more different elements chemically bonded.",
    "workedSolution": "Ammonia ($\\text{NH}_3$) is a compound of nitrogen and hydrogen atoms combined in a fixed 1:3 ratio.",
    "points": 1
  },
  {
    "id": "q20",
    "number": 20,
    "title": "Question 20",
    "format": "multiple_choice",
    "prompt": "Which category of mammalian teeth has broad, flattened crowns with four cusps specialized for crushing and grinding food?",
    "options": [
      "Incisors",
      "Molars",
      "Canines",
      "Eyeteeth"
    ],
    "correctAnswer": "Molars",
    "hint": "The large back teeth anchored by multiple roots.",
    "workedSolution": "Molars have large, broad surfaces with multiple cusps adapted for crushing and grinding plant and grain fibers.",
    "points": 1
  },
  {
    "id": "q21",
    "number": 21,
    "title": "Question 21",
    "format": "multiple_choice",
    "prompt": "Which of the following astronomical celestial bodies generates its own light through thermonuclear fusion and is classified as a star?",
    "options": [
      "Planet Jupiter",
      "The Sun",
      "The Earth's Moon",
      "Planet Venus"
    ],
    "correctAnswer": "The Sun",
    "hint": "Planets and moons merely reflect sunlight; the Sun is a luminous star.",
    "workedSolution": "The Sun is a medium-sized star generating radiant electromagnetic energy through nuclear fusion of hydrogen into helium.",
    "points": 1
  },
  {
    "id": "q22",
    "number": 22,
    "title": "Question 22",
    "format": "multiple_choice",
    "prompt": "Which of the following harmful organisms is classified as an endoparasite residing inside the intestinal lumen of domestic animals?",
    "options": [
      "Dog tick",
      "Body louse",
      "Poultry mite",
      "Tapeworm (Taenia)"
    ],
    "correctAnswer": "Tapeworm (Taenia)",
    "hint": "Endoparasites live inside the internal tissues or digestive tracts of hosts.",
    "workedSolution": "Tapeworms (*Taenia spp.*) live internally in host intestines (endoparasites), while ticks and lice live externally on skin (ectoparasites).",
    "points": 1
  },
  {
    "id": "q23",
    "number": 23,
    "title": "Question 23",
    "format": "multiple_choice",
    "prompt": "In flowering plants (angiosperms), on which specific floral organ does pollination take place?",
    "options": [
      "The stigma",
      "The ovule",
      "The filament",
      "The sepals"
    ],
    "correctAnswer": "The stigma",
    "hint": "The sticky terminal receptive surface of the pistil (carpel).",
    "workedSolution": "Pollination is the transfer of pollen grains from an anther to the receptive sticky surface of the stigma.",
    "points": 1
  },
  {
    "id": "q24",
    "number": 24,
    "title": "Question 24",
    "format": "multiple_choice",
    "prompt": "Which of the following chemical solutions can neutralize an acidic solution to form salt and water?",
    "options": [
      "Sodium hydroxide solution [NaOH]",
      "Dilute ethanoic acid (vinegar)",
      "Pure distilled water",
      "Dilute citric acid"
    ],
    "correctAnswer": "Sodium hydroxide solution [NaOH]",
    "hint": "A strong soluble base (alkali) reacts with an acid.",
    "workedSolution": "Sodium hydroxide is an alkali that neutralizes acids: $\\text{NaOH} + \\text{HCl} \\to \\text{NaCl} + \\text{H}_2\\text{O}$.",
    "points": 1
  },
  {
    "id": "q25",
    "number": 25,
    "title": "Question 25",
    "format": "multiple_choice",
    "prompt": "How are respiratory infectious diseases such as tuberculosis, influenza, and common cold primarily transmitted?",
    "options": [
      "Direct ingestion of raw contaminated river silt",
      "Mechanical transfer by crawling worker termites",
      "Infrequent washing of metal farming implements",
      "Airborne respiratory droplets expelled during coughing and sneezing"
    ],
    "correctAnswer": "Airborne respiratory droplets expelled during coughing and sneezing",
    "hint": "Microscopic pathogen-laden aerosols travel through the air.",
    "workedSolution": "Pathogenic bacteria and viruses spread in microscopic droplets sneezed or coughed into the air by infected individuals.",
    "points": 1
  },
  {
    "id": "q26",
    "number": 26,
    "title": "Question 26",
    "format": "multiple_choice",
    "prompt": "Which of the following physical quantities is classified as a derived vector quantity?",
    "options": [
      "Length",
      "Mass",
      "Velocity",
      "Electric current"
    ],
    "correctAnswer": "Velocity",
    "hint": "Velocity is displacement divided by time ($\\text{m/s}$) and possesses direction.",
    "workedSolution": "Velocity is a derived vector quantity requiring both magnitude and direction, while length, mass, and current are fundamental base quantities.",
    "points": 1
  },
  {
    "id": "q27",
    "number": 27,
    "title": "Question 27",
    "format": "multiple_choice",
    "prompt": "In the human male reproductive system, where are mature spermatozoa temporarily stored prior to ejaculation?",
    "options": [
      "The prostate gland",
      "The Cowper's gland",
      "The urinary bladder",
      "The epididymis"
    ],
    "correctAnswer": "The epididymis",
    "hint": "A coiled duct resting along the posterior surface of each testis.",
    "workedSolution": "Sperm produced in the seminiferous tubules pass into the epididymis for maturation and temporary storage.",
    "points": 1
  },
  {
    "id": "q28",
    "number": 28,
    "title": "Question 28",
    "format": "multiple_choice",
    "prompt": "Which statement correctly describes the physical process of gaseous diffusion?",
    "options": [
      "It requires a selectively permeable living membrane",
      "Particles move randomly from a region of higher concentration to lower concentration down a gradient",
      "It occurs exclusively in solid metals under high compression",
      "It requires continuous expenditure of cellular metabolic ATP"
    ],
    "correctAnswer": "Particles move randomly from a region of higher concentration to lower concentration down a gradient",
    "hint": "Passive net movement driven by thermal kinetic energy.",
    "workedSolution": "Diffusion is the passive net movement of particles from a region of higher concentration to one of lower concentration down a concentration gradient.",
    "points": 1
  },
  {
    "id": "q29",
    "number": 29,
    "title": "Question 29",
    "format": "multiple_choice",
    "prompt": "Which agronomic system cultivates different crop families across designated field plots in a planned cyclical sequence over several seasons?",
    "options": [
      "Continuous monoculture",
      "Crop rotation",
      "Mixed farming",
      "Pastoral nomadism"
    ],
    "correctAnswer": "Crop rotation",
    "hint": "Deep-rooted crops follow shallow-rooted crops, incorporating nitrogen-fixing legumes.",
    "workedSolution": "Crop rotation grows different crops on the same land in a planned sequence to maintain soil fertility and break pest life cycles.",
    "points": 1
  },
  {
    "id": "q30",
    "number": 30,
    "title": "Question 30",
    "format": "multiple_choice",
    "prompt": "Which sub-cellular organelle is known as the powerhouse of the cell because it conducts aerobic cellular respiration?",
    "options": [
      "Chloroplast",
      "Mitochondrion",
      "Nucleus",
      "Large central vacuole"
    ],
    "correctAnswer": "Mitochondrion",
    "hint": "Site of the Krebs cycle and ATP synthesis in both plant and animal cells.",
    "workedSolution": "Mitochondria contain respiratory enzymes that oxidize pyruvate to release cellular energy in the form of ATP.",
    "points": 1
  },
  {
    "id": "q31",
    "number": 31,
    "title": "Question 31",
    "format": "multiple_choice",
    "prompt": "Which of the following simple machines represents a second-class lever in which the load is positioned between the pivot (fulcrum) and the effort?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><circle cx='50' cy='85' r='10' fill='#3b82f6' stroke='#1d4ed8' stroke-width='2'/><text x='50' y='115' font-size='10' font-weight='bold' fill='#3b82f6' text-anchor='middle'>Fulcrum (Wheel)</text><line x1='50' y1='85' x2='290' y2='45' stroke='#94a3b8' stroke-width='4'/><rect x='140' y='45' width='45' height='30' rx='3' fill='#ef4444' stroke='#b91c1c' stroke-width='2'/><text x='162' y='64' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>LOAD</text><line x1='162' y1='80' x2='162' y2='105' stroke='#ef4444' stroke-width='2'/><polygon points='158,102 162,110 166,102' fill='#ef4444'/><text x='162' y='125' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>Load Force</text><line x1='285' y1='75' x2='285' y2='25' stroke='#10b981' stroke-width='2.5'/><polygon points='281,30 285,20 289,30' fill='#10b981'/><text x='285' y='95' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>Effort (Handles)</text><text x='170' y='132' font-size='8' font-weight='bold' fill='#64748b' text-anchor='middle'>CLASS 2 LEVER: LOAD IN THE MIDDLE</text></svg></div>",
    "options": [
      "A pair of scissors",
      "A fishing rod",
      "A crowbar",
      "A wheelbarrow"
    ],
    "correctAnswer": "A wheelbarrow",
    "hint": "The wheel is the pivot at one end, the handles are at the other end, and the cargo is in the middle.",
    "workedSolution": "In a wheelbarrow, the pivot (wheel) is at one end, the effort is applied at the handles, and the load rests in between (Class 2 lever).",
    "points": 1
  },
  {
    "id": "q32",
    "number": 32,
    "title": "Question 32",
    "format": "multiple_choice",
    "prompt": "What is an important domestic advantage of washing clothes with soft water rather than hard water?",
    "options": [
      "It deposits protective mineral scales inside household kettles",
      "It lathers readily with soap without forming insoluble scum or wasting detergent",
      "It contains high concentrations of calcium and magnesium salts",
      "It prevents clothes from drying quickly under the sun"
    ],
    "correctAnswer": "It lathers readily with soap without forming insoluble scum or wasting detergent",
    "hint": "Hard water contains dissolved calcium and magnesium ions that precipitate soap.",
    "workedSolution": "Soft water lacks dissolved calcium and magnesium ions, allowing soap to lather freely without precipitating sticky insoluble scum.",
    "points": 1
  },
  {
    "id": "q33",
    "number": 33,
    "title": "Question 33",
    "format": "multiple_choice",
    "prompt": "During complete aerobic cellular respiration in humans, what gas is produced alongside water and released into the bloodstream?",
    "options": [
      "Hydrogen gas [H₂]",
      "Nitrogen gas [N₂]",
      "Carbon (IV) oxide [CO₂]",
      "Carbon monoxide [CO]"
    ],
    "correctAnswer": "Carbon (IV) oxide [CO₂]",
    "hint": "Diffuses from capillaries into pulmonary alveoli to be exhaled.",
    "workedSolution": "Oxidation of glucose yields carbon dioxide and water: $\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\to 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{ATP}$.",
    "points": 1
  },
  {
    "id": "q34",
    "number": 34,
    "title": "Question 34",
    "format": "multiple_choice",
    "prompt": "What is the systematic IUPAC chemical name for the gaseous compound with the chemical formula $\\text{N}_2\\text{O}$?",
    "options": [
      "Nitrogen (II) oxide",
      "Nitrogen dioxide",
      "Dinitrogen monoxide (Nitrogen (I) oxide)",
      "Dinitrogen pentoxide"
    ],
    "correctAnswer": "Dinitrogen monoxide (Nitrogen (I) oxide)",
    "hint": "Commonly known as nitrous oxide or laughing gas; nitrogen has an oxidation state of +1.",
    "workedSolution": "In $\\text{N}_2\\text{O}$, two nitrogen atoms balance one oxygen atom (oxidation state of $+1$), giving Nitrogen (I) oxide or dinitrogen monoxide.",
    "points": 1
  },
  {
    "id": "q35",
    "number": 35,
    "title": "Question 35",
    "format": "multiple_choice",
    "prompt": "Which cultural crop management practice involves the selective removal of diseased, dead, or overgrown shoots and lateral branches?",
    "options": [
      "Mulching",
      "Thinning out",
      "Pruning",
      "Pricking out"
    ],
    "correctAnswer": "Pruning",
    "hint": "Improves light penetration, air circulation, and fruit quality.",
    "workedSolution": "Pruning removes unwanted, dead, or diseased plant branches to encourage flowering, improve ventilation, and increase fruit yields.",
    "points": 1
  },
  {
    "id": "q36",
    "number": 36,
    "title": "Question 36",
    "format": "multiple_choice",
    "prompt": "How many internal semiconductor p-n junctions are present in a standard bipolar junction transistor (BJT)?",
    "options": [
      "One p-n junction",
      "Two p-n junctions",
      "Three p-n junctions",
      "Four p-n junctions"
    ],
    "correctAnswer": "Two p-n junctions",
    "hint": "Consists of three doped semiconductor layers: either p-n-p or n-p-n.",
    "workedSolution": "A bipolar junction transistor consists of three doped semiconductor regions, creating two p-n junctions (emitter-base and collector-base).",
    "points": 1
  },
  {
    "id": "q37",
    "number": 37,
    "title": "Question 37",
    "format": "multiple_choice",
    "prompt": "Which morphological feature is a characteristic adaptation of seeds and fruits dispersed by wind (anemochory)?",
    "options": [
      "Having bright fleshy sweet pulp with edible seeds",
      "Possessing sharp backward-curving recurved hooks",
      "Being heavy with a thick, impermeable waterproof husk",
      "Possessing tufts of light, feathery hairs or wing-like papery expansions"
    ],
    "correctAnswer": "Possessing tufts of light, feathery hairs or wing-like papery expansions",
    "hint": "Adapted to float on air currents like tiny parachutes (e.g., silk cotton, tridax).",
    "workedSolution": "Wind-dispersed seeds feature parachute-like pappus hairs or papery wings, reducing weight and increasing surface area to drift on air currents.",
    "points": 1
  },
  {
    "id": "q38",
    "number": 38,
    "title": "Question 38",
    "format": "multiple_choice",
    "prompt": "Chemicals that cause severe burning and destruction of living dermal tissue upon direct contact are classified and labelled as:",
    "options": [
      "Flammable liquids",
      "Irritant aerosols",
      "Radioactive isotopes",
      "Corrosive substances"
    ],
    "correctAnswer": "Corrosive substances",
    "hint": "Includes concentrated mineral acids (sulfuric acid) and caustic alkalis (sodium hydroxide).",
    "workedSolution": "Corrosive substances (such as concentrated sulfuric acid) chemically destroy living skin and mucous membranes on contact.",
    "points": 1
  },
  {
    "id": "q39",
    "number": 39,
    "title": "Question 39",
    "format": "multiple_choice",
    "prompt": "What is the primary physiological function of blood platelets (thrombocytes) in the human circulatory system?",
    "options": [
      "Initiating blood clotting to seal damaged capillaries and prevent haemorrhage",
      "Transporting dissolved oxygen to skeletal muscles",
      "Engulfing invasive bacterial pathogens by phagocytosis",
      "Carrying synthesized digestive enzymes to the liver"
    ],
    "correctAnswer": "Initiating blood clotting to seal damaged capillaries and prevent haemorrhage",
    "hint": "Cell fragments that aggregate to form a hemostatic plug at wounds.",
    "workedSolution": "Platelets adhere to broken blood vessel walls and release clotting factors that convert fibrinogen into insoluble fibrin to form a clot.",
    "points": 1
  },
  {
    "id": "q40",
    "number": 40,
    "title": "Question 40",
    "format": "multiple_choice",
    "prompt": "In physical science, what is the precise definition of energy?",
    "options": [
      "The rate at which mechanical power is expended",
      "The gravitational downward force exerted on a mass",
      "The capacity or ability to perform mechanical work",
      "The momentum generated by a body in linear motion"
    ],
    "correctAnswer": "The capacity or ability to perform mechanical work",
    "hint": "Measured in Joules; the ability to do work.",
    "workedSolution": "Energy is defined as the capacity to do work, measured in Joules (J). Power is the rate of doing work.",
    "points": 1
  }
];

async function seedBece2015SciencePaper1Variant() {
  console.log('Seeding 2015 BECE Integrated Science Paper 1 Variant (Set 76) into Firestore...');
  const db = await getFirestore();

  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedScience2015P1.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Key Distribution across 40 items:', keyDist);

  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2015_variant');
  await docRef.set({
    year: 2015,
    isVariant: true,
    setNumber: 76,
    subject: "Integrated Science",
    examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
    paper1: {
      title: "Paper 1: Objective Test (Variant)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: balancedScience2015P1
    },
    metadata: {
      sanitized: true,
      optionsBalanced: true,
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: new Date()
    }
  }, { merge: true });

  console.log('✅ Ingestion complete: 2015 Science Paper 1 Variant seeded with exact 10A/10B/10C/10D distribution.');
}

seedBece2015SciencePaper1Variant()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Failed ingestion for Set 76 Science Paper 1:', err);
    process.exit(1);
  });
