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
    // Continue to applicationDefault
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

// 1. Vector SVG: Three Types of Mixtures (Solution, Colloid, Suspension)
const svgMixturesColloid = `
<svg viewBox='0 0 360 140' width='100%' height='130' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Beaker I: True Solution -->
  <rect x='30' y='30' width='70' height='75' rx='4' fill='#e0f2fe' stroke='#0284c7' stroke-width='2'/>
  <rect x='32' y='55' width='66' height='48' fill='#38bdf8' opacity='0.4'/>
  <text x='65' y='122' font-size='11' font-weight='bold' fill='#0369a1' text-anchor='middle'>I (Solution)</text>
  <!-- Beaker II: Colloid -->
  <rect x='145' y='30' width='70' height='75' rx='4' fill='#f1f5f9' stroke='#475569' stroke-width='2'/>
  <rect x='147' y='55' width='66' height='48' fill='#94a3b8' opacity='0.5'/>
  <!-- Microscopic suspended particles -->
  <circle cx='160' cy='65' r='1.5' fill='#334155'/><circle cx='175' cy='72' r='1.5' fill='#334155'/>
  <circle cx='195' cy='68' r='1.5' fill='#334155'/><circle cx='165' cy='85' r='1.5' fill='#334155'/>
  <circle cx='185' cy='88' r='1.5' fill='#334155'/><circle cx='200' cy='80' r='1.5' fill='#334155'/>
  <text x='180' y='122' font-size='11' font-weight='bold' fill='#334155' text-anchor='middle'>II (Colloid)</text>
  <!-- Beaker III: Suspension -->
  <rect x='260' y='30' width='70' height='75' rx='4' fill='#f8fafc' stroke='#0f172a' stroke-width='2'/>
  <rect x='262' y='55' width='66' height='48' fill='#cbd5e1' opacity='0.3'/>
  <!-- Large visible settling particles -->
  <circle cx='275' cy='70' r='3.5' fill='#0284c7'/><circle cx='295' cy='65' r='4' fill='#0284c7'/>
  <circle cx='315' cy='75' r='3' fill='#0284c7'/><circle cx='285' cy='85' r='4' fill='#0284c7'/>
  <circle cx='305' cy='92' r='3.5' fill='#0284c7'/><circle cx='270' cy='95' r='4' fill='#0284c7'/>
  <text x='295' y='122' font-size='11' font-weight='bold' fill='#0f172a' text-anchor='middle'>III (Suspension)</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG: Rectilinear Propagation of Light Apparatus
const svgLightPropagation = `
<svg viewBox='0 0 360 160' width='100%' height='140' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Lighted Candle -->
  <rect x='30' y='90' width='16' height='40' fill='#cbd5e1' stroke='#475569' stroke-width='1.5'/>
  <path d='M 38 90 Q 33 75 38 65 Q 43 75 38 90 Z' fill='#f59e0b' stroke='#d97706'/>
  <circle cx='38' cy='77' r='3' fill='#fef08a'/>
  <!-- Three Cardboards with Pinholes in a straight line -->
  <rect x='95' y='40' width='10' height='95' fill='#94a3b8' stroke='#334155'/>
  <circle cx='100' cy='80' r='2' fill='#ffffff'/>
  <rect x='175' y='40' width='10' height='95' fill='#94a3b8' stroke='#334155'/>
  <circle cx='180' cy='80' r='2' fill='#ffffff'/>
  <rect x='255' y='40' width='10' height='95' fill='#94a3b8' stroke='#334155'/>
  <circle cx='260' cy='80' r='2' fill='#ffffff'/>
  <!-- Straight Light Ray Line -->
  <line x1='38' y1='77' x2='310' y2='77' stroke='#dc2626' stroke-width='1.8' stroke-dasharray='3,2'/>
  <!-- Observer Eye -->
  <path d='M 315 70 Q 335 77 315 84 Z' fill='none' stroke='#1e293b' stroke-width='2'/>
  <circle cx='322' cy='77' r='3' fill='#1e293b'/>
  <text x='180' y='150' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>RECTILINEAR PROPAGATION OF LIGHT</text>
</svg>
`.trim().replace(/\n\s*/g, '');

interface ObjectiveQuestion {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

// Ingesting NaCCA Science Set 1 Questions (Standardized 40 Objective Items with 10A/10B/10C/10D Distribution)
const rawScienceItems: ObjectiveQuestion[] = [
  {
    number: 1,
    prompt: "Which of the following statements best describes a colloid?",
    options: [
      "A heterogeneous mixture whose particles remain dispersed without settling",
      "A completely homogeneous transparent solution with dissolved particles",
      "A mixture where large solid particles settle rapidly at the bottom",
      "A pure single-phase liquid compound"
    ],
    correctAnswer: "A heterogeneous mixture whose particles remain dispersed without settling",
    hint: "Colloidal particles are larger than solute molecules but do not settle out upon standing.",
    workedSolution: "A colloid is an intermediate heterogeneous system where dispersed microscopic particles do not precipitate under gravity.",
    points: 1
  },
  {
    number: 2,
    prompt: "The scattering of a visible beam of light by dispersed colloidal particles in a medium is known as the:",
    options: ["Tyndall effect", "Colloidal effect", "Suspension effect", "Brownian displacement"],
    correctAnswer: "Tyndall effect",
    hint: "Think of a sunbeam cutting through dusty air or mist.",
    workedSolution: "The scattering of light by colloidal particles is the Tyndall effect.",
    points: 1
  },
  {
    number: 3,
    prompt: "In the structure of a neutral atom, which sub-atomic particles reside within the dense central nucleus?",
    options: ["Protons and neutrons", "Protons and electrons", "Electrons and neutrons", "Electrons only"],
    correctAnswer: "Protons and neutrons",
    hint: "Electrons orbit in the outer shells.",
    workedSolution: "Protons and neutrons occupy the nucleus, while electrons occupy surrounding shells.",
    points: 1
  },
  {
    number: 4,
    prompt: "Which of the following organisms are classified as prokaryotes?",
    options: [
      "Bacteria and cyanobacteria",
      "Amoeba and Paramecium",
      "Spirogyra and mushroom",
      "Flowering plants and insects"
    ],
    correctAnswer: "Bacteria and cyanobacteria",
    hint: "Prokaryotes lack a true membrane-bound nucleus.",
    workedSolution: "Bacteria are unicellular prokaryotes lacking a membrane-bound nucleus and organelles.",
    points: 1
  },
  {
    number: 5,
    prompt: "Which of the following represents an example of a homogeneous mixture?",
    options: ["Sugar dissolved in pure water", "Sand stirred in water", "A mixture of kerosene and water", "Chalk powder in water"],
    correctAnswer: "Sugar dissolved in pure water",
    hint: "Homogeneous mixtures have uniform composition throughout.",
    workedSolution: "Sugar dissolved completely in water forms a single, uniform liquid phase.",
    points: 1
  },
  {
    number: 6,
    prompt: "Which sequence correctly arranges the developmental stages of the housefly after egg hatching?",
    options: [
      "Larva → Pupa → Adult",
      "Pupa → Larva → Adult",
      "Nymph → Pupa → Adult",
      "Larva → Nymph → Adult"
    ],
    correctAnswer: "Larva → Pupa → Adult",
    hint: "Houseflies undergo complete metamorphosis: Egg -> Larva (maggot) -> Pupa -> Adult.",
    workedSolution: "Following hatching from the egg, the housefly progresses through the larva (maggot) and pupa stages before emerging as an adult.",
    points: 1
  },
  {
    number: 7,
    prompt: "Why is the life cycle of a grasshopper described as incomplete metamorphosis compared to that of a housefly or mosquito?",
    options: [
      "Grasshoppers lack a pupal resting stage",
      "Grasshoppers do not lay eggs",
      "Grasshoppers have aquatic nymph stages",
      "Grasshoppers undergo four active larval molts"
    ],
    correctAnswer: "Grasshoppers lack a pupal resting stage",
    hint: "Incomplete metamorphosis consists of Egg -> Nymph -> Adult.",
    workedSolution: "Grasshoppers exhibit incomplete metamorphosis (hemimetabolous development), transitioning from egg to nymph to adult without a pupal stage.",
    points: 1
  },
  {
    number: 8,
    prompt: "Which of the following energy sources is classified as non-renewable?",
    options: ["Crude oil / Fossil fuel", "Solar radiation", "Wind energy", "Hydroelectric power"],
    correctAnswer: "Crude oil / Fossil fuel",
    hint: "Non-renewable resources cannot be regenerated at the rate they are consumed.",
    workedSolution: "Fossil fuels take millions of years to form and are finite in quantity.",
    points: 1
  },
  {
    number: 9,
    prompt: "A sodium atom ($_{11}\text{Na}$) loses one valence electron to form a sodium ion ($\text{Na}^+$). What is the net electrical charge of the resulting ion?",
    options: ["+1", "-1", "0", "+2"],
    correctAnswer: "+1",
    hint: "The atom now has 11 protons (+11) and 10 electrons (-10).",
    workedSolution: "11 positive protons balanced against 10 negative electrons yields a net charge of +1.",
    points: 1
  },
  {
    number: 10,
    prompt: "What is the primary function of the chisel-shaped incisor teeth in mammals?",
    options: ["Cutting and biting food", "Tearing and shredding muscle fibers", "Grinding and pulverizing grains", "Crushing tough bones"],
    correctAnswer: "Cutting and biting food",
    hint: "Incisors are the sharp front teeth.",
    workedSolution: "Incisors have a sharp, flat edge designed for biting off pieces of food.",
    points: 1
  },
  {
    number: 11,
    prompt: "In a plant cell, in which organelle does aerobic cellular respiration take place to generate usable ATP energy?",
    options: ["Mitochondria", "Chloroplasts", "Vacuole", "Ribosomes"],
    correctAnswer: "Mitochondria",
    hint: "Commonly described as the powerhouse of the cell.",
    workedSolution: "Mitochondria oxidize glucose during aerobic respiration to release energy in the form of ATP.",
    points: 1
  },
  {
    number: 12,
    prompt: "How must a semiconductor P-N junction diode be connected in a circuit to be in forward bias and allow current to flow?",
    options: [
      "The P-region connected to the positive terminal and N-region to the negative terminal",
      "The P-region connected to the negative terminal and N-region to the positive terminal",
      "Both P and N regions connected in parallel to the negative terminal",
      "The polarity does not influence diode conductance"
    ],
    correctAnswer: "The P-region connected to the positive terminal and N-region to the negative terminal",
    hint: "P (positive) connects to the positive terminal of the source.",
    workedSolution: "Forward bias reduces the depletion layer, permitting majority charge carriers to conduct current.",
    points: 1
  },
  {
    number: 13,
    prompt: "Which metallic material is primarily selected for fabricating the blades of agricultural hoes and shovels due to its high tensile strength?",
    options: ["Steel", "Aluminum", "Copper", "Lead"],
    correctAnswer: "Steel",
    hint: "An alloy of iron and carbon capable of withstanding soil resistance.",
    workedSolution: "Carbon steel provides hardness, structural rigidity, and resistance to deformation during soil tillage.",
    points: 1
  },
  {
    number: 14,
    prompt: "Which of the following chemical compounds is widely used as a synthetic nitrogenous fertilizer in commercial agriculture?",
    options: ["Ammonium nitrate (NH₄NO₃)", "Sodium peroxide (Na₂O₂)", "Calcium carbonate (CaCO₃)", "Carbonic acid (H₂CO₃)"],
    correctAnswer: "Ammonium nitrate (NH₄NO₃)",
    hint: "Provides readily absorbable ammonium and nitrate ions.",
    workedSolution: "$\text{NH}_4\text{NO}_3$ supplies high concentrations of nitrogen essential for plant chlorophyll and protein synthesis.",
    points: 1
  },
  {
    number: 15,
    prompt: "In the study of shadow formation, how does an umbra differ fundamentally from a penumbra?",
    options: [
      "The umbra is the darkest region with total light occlusion, while the penumbra is a partial shadow",
      "The umbra is formed only by reflection, while the penumbra is formed by refraction",
      "The umbra is lighter in color than the penumbra",
      "The penumbra is located in front of the opaque obstacle"
    ],
    correctAnswer: "The umbra is the darkest region with total light occlusion, while the penumbra is a partial shadow",
    hint: "Umbra = full shadow; Penumbra = partial shadow.",
    workedSolution: "An umbra receives zero light rays from an extended light source, while a penumbra receives rays from only part of the light source.",
    points: 1
  },
  {
    number: 16,
    prompt: "When human breath is directed through a delivery tube into clear limewater, the solution turns milky due to the precipitation of:",
    options: ["Calcium carbonate", "Calcium chloride", "Calcium hydroxide", "Calcium sulfate"],
    correctAnswer: "Calcium carbonate",
    hint: "Carbon dioxide reacts with limewater.",
    workedSolution: "$\text{Ca(OH)}_2 + \text{CO}_2 \to \text{CaCO}_3\downarrow + \text{H}_2\text{O}$.",
    points: 1
  },
  {
    number: 17,
    prompt: "Which animal feed category is characterized by a high crude fiber content and is primarily utilized by ruminants?",
    options: ["Roughages (hay, pasture grass, silage)", "Concentrates (cereal grains, fishmeal)", "Supplements (vitamins and trace minerals)", "Energy-rich refined syrups"],
    correctAnswer: "Roughages (hay, pasture grass, silage)",
    hint: "Essential for rumination and microbial fermentation.",
    workedSolution: "Ruminants have complex, multi-chambered stomachs containing symbiotic microbes capable of digesting cellulose in roughages.",
    points: 1
  },
  {
    number: 18,
    prompt: "A carpenter drives a sharp nail into hardwood using a steel hammer. In terms of pressure, force, and area, why does the nail penetrate easily?",
    options: [
      "The pointed tip has a very small contact area, generating high pressure for a given force",
      "The large head of the nail creates low pressure on the wood",
      "The hammer reduces the total force applied to the nail",
      "The sharp tip increases the surface area over which the force acts"
    ],
    correctAnswer: "The pointed tip has a very small contact area, generating high pressure for a given force",
    hint: "$P = \frac{\text{Force}}{\text{Area}}$. Smaller area means higher pressure.",
    workedSolution: "Because the tip area $A$ is tiny, the applied impact force $F$ produces a high local pressure ($P = \frac{F}{A}$) that exceeds the shear strength of the wood fibers.",
    points: 1
  },
  {
    number: 19,
    prompt: "In a closed electrical circuit with a dry cell, which object inserted between open terminals will conduct electricity and light the bulb?",
    options: ["An iron nail", "A dry wooden toothpick", "A plastic ruler", "A rubber band"],
    correctAnswer: "An iron nail",
    hint: "Metals possess free delocalized electrons that carry current.",
    workedSolution: "Iron is a metallic conductor possessing free conduction electrons.",
    points: 1
  },
  {
    number: 20,
    prompt: "Which word equation correctly summarizes the neutralization reaction between sodium hydroxide and hydrochloric acid?",
    options: [
      "Sodium hydroxide + hydrochloric acid → sodium chloride + water",
      "Sodium hydroxide + hydrochloric acid → sodium chloride + hydrogen gas",
      "Sodium hydroxide + hydrochloric acid → ammonia gas + water",
      "Sodium hydroxide + hydrochloric acid → sodium oxide + chlorine gas"
    ],
    correctAnswer: "Sodium hydroxide + hydrochloric acid → sodium chloride + water",
    hint: "Base + Acid -> Salt + Water.",
    workedSolution: "$\text{NaOH} + \text{HCl} \to \text{NaCl} + \text{H}_2\text{O}$.",
    points: 1
  },
  {
    number: 21,
    prompt: "Agricultural crops thrive best in fertile loam soil because it contains balanced proportions of sand, clay, and:",
    options: ["Humus (decayed organic matter)", "Large gravel fragments", "Dry coarse quartz crystals", "Insoluble plastic residues"],
    correctAnswer: "Humus (decayed organic matter)",
    hint: "Provides mineral nutrients, improves aeration, and retains moisture.",
    workedSolution: "Humus enriches soil with essential plant nutrients and enhances its moisture-retention and crumb structure.",
    points: 1
  },
  {
    number: 22,
    prompt: "Which organelle in green plant cells absorbs radiant sunlight to synthesize carbohydrates during photosynthesis?",
    options: ["Chloroplast", "Mitochondrion", "Vacuole", "Endoplasmic reticulum"],
    correctAnswer: "Chloroplast",
    hint: "Contains the green pigment chlorophyll.",
    workedSolution: "Chloroplasts house chlorophyll molecules that trap solar photons to drive photosynthesis.",
    points: 1
  },
  {
    number: 23,
    prompt: "In the hydrological cycle, what is the technical term for water vapor cooling and changing into liquid water droplets to form clouds?",
    options: ["Condensation", "Evaporation", "Transpiration", "Precipitation"],
    correctAnswer: "Condensation",
    hint: "Gas to liquid phase transition upon cooling.",
    workedSolution: "As warm moist air rises, it expands and cools, condensing into liquid droplets around condensation nuclei.",
    points: 1
  },
  {
    number: 24,
    prompt: "A medical doctor diagnoses a young child with severe swollen abdomen, thin limbs, and reddish discolored hair. What nutritional deficiency disease is this?",
    options: ["Kwashiorkor (Protein deficiency)", "Rickets (Vitamin D deficiency)", "Scurvy (Vitamin C deficiency)", "Goitre (Iodine deficiency)"],
    correctAnswer: "Kwashiorkor (Protein deficiency)",
    hint: "Caused by inadequate protein intake in the diet.",
    workedSolution: "Kwashiorkor is a severe form of protein-energy malnutrition characterized by abdominal edema and skin/hair depigmentation.",
    points: 1
  },
  {
    number: 25,
    prompt: "Which dietary nutrient deficiency causes bleeding, swollen gums, loose teeth, and poor wound healing (scurvy)?",
    options: ["Ascorbic acid (Vitamin C)", "Calciferol (Vitamin D)", "Iron mineral", "Retinol (Vitamin A)"],
    correctAnswer: "Ascorbic acid (Vitamin C)",
    hint: "Found abundantly in fresh citrus fruits and green vegetables.",
    workedSolution: "Vitamin C (ascorbic acid) is required for collagen synthesis. Deficiency leads to fragile capillaries and scurvy.",
    points: 1
  },
  {
    number: 26,
    prompt: "When a person pedals a bicycle fitted with a dynamo connected to a headlamp, what is the main sequence of energy transformations?",
    options: [
      "Chemical energy → Kinetic/Mechanical energy → Electrical energy → Light & Heat energy",
      "Potential energy → Chemical energy → Nuclear energy → Light energy",
      "Electrical energy → Kinetic energy → Sound energy → Light energy",
      "Solar energy → Potential energy → Heat energy → Light energy"
    ],
    correctAnswer: "Chemical energy → Kinetic/Mechanical energy → Electrical energy → Light & Heat energy",
    hint: "Food energy in muscles -> Motion of pedals/dynamo -> Current -> Lamp glow.",
    workedSolution: "Muscle chemical energy transforms into mechanical kinetic energy turning the dynamo, generating electrical energy, which emits light and heat in the filament.",
    points: 1
  },
  {
    number: 27,
    prompt: "Water falling from the spillway of a high hydroelectric dam drives a turbine to heat water via an immersion heater. What is the energy chain?",
    options: [
      "Potential energy → Kinetic energy → Mechanical energy → Electrical energy → Heat energy",
      "Heat energy → Chemical energy → Kinetic energy → Electrical energy",
      "Sound energy → Potential energy → Electrical energy → Heat energy",
      "Chemical energy → Electrical energy → Light energy → Heat energy"
    ],
    correctAnswer: "Potential energy → Kinetic energy → Mechanical energy → Electrical energy → Heat energy",
    hint: "Water elevated at height has gravitational potential energy.",
    workedSolution: "Elevated water releases gravitational potential energy into kinetic energy as it flows, turning the generator turbine to produce electricity, which powers the heater.",
    points: 1
  },
  {
    number: 28,
    prompt: "Which mode of thermal energy transfer occurs primarily through direct particle-to-particle collisions without the bulk movement of the medium?",
    options: ["Conduction", "Convection", "Radiation", "Evaporation"],
    correctAnswer: "Conduction",
    hint: "Dominates in solid conductors such as metals.",
    workedSolution: "Conduction transfers heat through progressive lattice vibrations and free electron diffusion without bulk material movement.",
    points: 1
  },
  {
    number: 29,
    prompt: "In a domestic electric kettle, heat transfers throughout the body of water primarily by which mechanism?",
    options: ["Convection", "Conduction", "Radiation", "Insulation"],
    correctAnswer: "Convection",
    hint: "Warm, less dense fluid rises while cooler fluid sinks.",
    workedSolution: "Heated water expands, becomes less dense, and ascends, creating circulating convection currents that distribute thermal energy.",
    points: 1
  },
  {
    number: 30,
    prompt: "What physical phenomenon occurs when a beam of white sunlight is passed through a triangular glass prism, projecting a spectrum of colors on a screen?",
    options: ["Dispersion", "Rectilinear propagation", "Polarization", "Interference"],
    correctAnswer: "Dispersion",
    hint: "Different wavelengths bend by different amounts.",
    workedSolution: "Dispersion occurs because different colors travel at different speeds in glass, refracting at distinct angles.",
    points: 1
  },
  {
    number: 31,
    prompt: "A straight pencil immersed partially in a beaker of water appears broken or bent at the water surface due to:",
    options: ["Refraction of light rays", "Regular reflection of light", "Diffraction through water molecules", "Total dispersion"],
    correctAnswer: "Refraction of light rays",
    hint: "Light changes speed when entering a different optical medium.",
    workedSolution: "Light rays travelling from water into air bend away from the normal, causing the pencil to appear displaced upwards.",
    points: 1
  },
  {
    number: 32,
    prompt: "According to Newton's First Law of Motion, what causes an object moving at a constant speed in a straight line to alter its velocity?",
    options: ["An unbalanced external resultant force", "A balanced internal pair of forces", "The inherent inertia of the object", "The total absence of friction"],
    correctAnswer: "An unbalanced external resultant force",
    hint: "A body stays at rest or uniform motion unless acted upon by a net force.",
    workedSolution: "Newton's First Law states that a net (unbalanced) external force is required to accelerate or decelerate an object.",
    points: 1
  },
  {
    number: 33,
    prompt: "What is the mathematical equation derived from Newton's Second Law relating force ($F$), mass ($m$), and acceleration ($a$)?",
    options: ["F = ma", "F = m / a", "F = a / m", "F = m + a"],
    correctAnswer: "F = ma",
    hint: "Force is directly proportional to mass and acceleration.",
    workedSolution: "Force is defined as the rate of change of momentum, simplifying to $F = ma$ for constant mass.",
    points: 1
  },
  {
    number: 34,
    prompt: "Which pair of planets constitute the inner terrestrial planets nearest to the Sun?",
    options: ["Mercury and Venus", "Jupiter and Saturn", "Uranus and Neptune", "Mars and Jupiter"],
    correctAnswer: "Mercury and Venus",
    hint: "The first two rocky planets from the Sun.",
    workedSolution: "The inner planets in order from the Sun are Mercury, Venus, Earth, and Mars.",
    points: 1
  },
  {
    number: 35,
    prompt: "Which of the following farming practices involves leaving a piece of land uncultivated for several seasons to allow natural regeneration of soil fertility?",
    options: ["Land rotation (Fallowing)", "Crop rotation", "Monocropping", "Mixed farming"],
    correctAnswer: "Land rotation (Fallowing)",
    hint: "The farmer clears and cultivates a new plot while the old one rests.",
    workedSolution: "Land rotation (bush fallowing) allows exhausted soil to regenerate its nutrient reserves and organic matter naturally over time.",
    points: 1
  },
  {
    number: 36,
    prompt: "In a terrestrial ecosystem, which trophic level organisms absorb carbon dioxide from the atmosphere to initiate food chains?",
    options: ["Primary producers (green plants)", "Primary consumers (herbivores)", "Secondary consumers (carnivores)", "Decomposers (bacteria and fungi)"],
    correctAnswer: "Primary producers (green plants)",
    hint: "Autotrophs that perform photosynthesis.",
    workedSolution: "Autotrophic green plants fix carbon dioxide into chemical energy, forming the foundation of food chains.",
    points: 1
  },
  {
    number: 37,
    prompt: "Which infectious communicable disease is caused by a protozoan parasite transmitted through the bite of an infected female Anopheles mosquito?",
    options: ["Malaria", "Cholera", "Tuberculosis", "Typhoid fever"],
    correctAnswer: "Malaria",
    hint: "The vector is the female Anopheles mosquito; the pathogen is Plasmodium.",
    workedSolution: "Female Anopheles mosquitoes transmit *Plasmodium* parasites into the bloodstream during blood meals, causing malaria.",
    points: 1
  },
  {
    number: 38,
    prompt: "Which greenhouse gas emitted predominantly from vehicular exhausts, industrial factories, and bush fires contributes to global warming?",
    options: ["Carbon (IV) oxide (CO₂)", "Oxygen gas (O₂)", "Nitrogen gas (N₂)", "Argon gas (Ar)"],
    correctAnswer: "Carbon (IV) oxide (CO₂)",
    hint: "A primary greenhouse gas involved in the carbon cycle.",
    workedSolution: "$\text{CO}_2$ traps infrared thermal radiation in the troposphere, driving the greenhouse effect and climate change.",
    points: 1
  },
  {
    number: 39,
    prompt: "What is the mechanical advantage (M.A.) of a simple machine that requires an effort of 50 N to lift a load of 250 N?",
    options: ["5.0", "0.2", "200", "12,500"],
    correctAnswer: "5.0",
    hint: "$\text{M.A.} = \frac{\text{Load}}{\text{Effort}}$.",
    workedSolution: "$$\text{M.A.} = \frac{250\text{ N}}{50\text{ N}} = 5.0$$.",
    points: 1
  },
  {
    number: 40,
    prompt: "Which agricultural tool is best suited for transplanting fragile vegetable seedlings from a nursery bed into the garden?",
    options: ["Hand trowel", "Pickaxe", "Spade", "Mattock"],
    correctAnswer: "Hand trowel",
    hint: "A small curved handheld scoop that avoids root damage.",
    workedSolution: "A hand trowel allows careful lifting of young seedlings with intact root balls to minimize transplant shock.",
    points: 1
  }
];

// Seeded pseudorandom shuffle ensuring exactly 10 A, 10 B, 10 C, 10 D
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

const assignedTargetIndices = seedShuffle(targetKeys, 202609);

const balancedScienceP1 = rawScienceItems.map((q, idx) => {
  const correctIdx = assignedTargetIndices[idx]; // 0=A, 1=B, 2=C, 3=D
  const otherOptions = q.options.filter(opt => opt !== q.correctAnswer);
  const finalOptions: string[] = [];
  let dCount = 0;
  for (let pos = 0; pos < 4; pos++) {
    if (pos === correctIdx) {
      finalOptions.push(q.correctAnswer);
    } else {
      finalOptions.push(otherOptions[dCount++]);
    }
  }
  return {
    number: q.number,
    prompt: q.prompt,
    options: finalOptions,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: 1
  };
});

// Structured Paper 2 (Section A Practical + Section B Theory)
const sciencePaper2Questions = [
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `The diagram below shows three beakers labelled I, II, and III containing different mixtures:<br/>${svgMixturesColloid}<br/>(i) Classify the mixtures in beakers I, II, and III as a true solution, a colloid, or a suspension.<br/>(ii) Describe an optical test you would conduct to distinguish between beaker I and beaker II.<br/>(iii) State what observation would be made during the test in (a)(ii).`,
        workedSolution: "(i) Classification:\n- Beaker I: True solution\n- Beaker II: Colloid\n- Beaker III: Suspension\n\n(ii) Optical Test (Tyndall Effect):\nDirect a narrow beam of light (e.g., from a laser pointer or flashlight) horizontally through beaker I and beaker II in a darkened room.\n\n(iii) Expected Observation:\n- In Beaker I (solution), the light beam passes through cleanly without being visible from the side.\n- In Beaker II (colloid), the path of the light beam is clearly visible and illuminated due to scattering by dispersed particles (Tyndall effect).",
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `The diagram below shows an experimental setup used to demonstrate a fundamental property of light:<br/>${svgLightPropagation}<br/>(i) State the property of light being investigated.<br/>(ii) What observation is made by the eye when all three card pinholes are perfectly aligned?<br/>(iii) What happens if the middle cardboard is displaced slightly to one side?<br/>(iv) Give two natural phenomena that occur as a direct consequence of this property of light.`,
        workedSolution: "(i) Rectilinear propagation of light (light travels in straight lines).\n\n(ii) The candle flame is clearly visible to the observer's eye.\n\n(iii) The candle flame is immediately blocked and cannot be seen, because light cannot bend around the displaced cardboard.\n\n(iv) Natural phenomena:\n1. Formation of sharp shadows (umbra and penumbra).\n2. Occurrence of solar and lunar eclipses.\n3. Image formation in a pinhole camera.",
        maxMarks: 10
      }
    ]
  },
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Explain the difference between an element and a chemical compound, giving one example of each with their respective chemical symbols or formulas.",
        workedSolution: "An element is a pure chemical substance consisting of only one type of atom that cannot be broken down into simpler substances by chemical means (e.g., Sodium, $\\text{Na}$). A compound is a substance formed when two or more different chemical elements chemically combine in a fixed ratio (e.g., Water, $\\text{H}_2\\text{O}$).",
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: "Describe the function of each of the following components in a simple direct current (DC) electronic circuit:\n(i) Light Emitting Diode (LED)\n(ii) Resistor\n(iii) Capacitor",
        workedSolution: "(i) Light Emitting Diode (LED): Converts electrical energy into light when forward biased.\n(ii) Resistor: Opposes and limits the flow of electric current to protect sensitive components.\n(iii) Capacitor: Stores electrical energy in an electrostatic field and discharges it when needed, smoothing voltage fluctuations.",
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "State three management practices a farmer should carry out to ensure the maintenance and longevity of metallic farm tools.",
        workedSolution: "1. Clean and wash off all adhering soil and debris after use, followed by drying.\n2. Apply grease or oil to metal parts to prevent rusting and oxidation.\n3. Sharpen cutting edges (e.g., cutlass blades, hoes) regularly and store tools in a dry shed.",
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
        prompt: "Explain how the carbon cycle maintains a balanced concentration of oxygen and carbon dioxide in the Earth's atmosphere.",
        workedSolution: "During photosynthesis, autotrophic green plants absorb atmospheric carbon dioxide and water, releasing oxygen as a byproduct. In turn, living organisms and plants carry out aerobic respiration, consuming oxygen and expelling carbon dioxide back into the atmosphere. This continuous exchange prevents the accumulation or depletion of either gas.",
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: "State two differences between the life cycle of a housefly and that of a grasshopper.",
        workedSolution: "1. Metamorphosis type: The housefly undergoes complete metamorphosis (4 stages: egg, larva, pupa, adult), whereas the grasshopper undergoes incomplete metamorphosis (3 stages: egg, nymph, adult).\n2. Pupal stage: The housefly has a distinct resting, non-feeding pupal stage, which is completely absent in the grasshopper.",
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "A load of $500\\text{ N}$ is raised through a vertical distance of $2\\text{ m}$ using an inclined plane of length $10\\text{ m}$ with an applied effort of $125\\text{ N}$. Calculate the:\n(i) Mechanical Advantage (M.A.)\n(ii) Velocity Ratio (V.R.)\n(iii) Efficiency of the inclined plane",
        workedSolution: "(i) $$\\text{M.A.} = \\frac{\\text{Load}}{\\text{Effort}} = \\frac{500\\text{ N}}{125\\text{ N}} = 4.0$$\n\n(ii) $$\\text{V.R.} = \\frac{\\text{Distance moved by Effort}}{\\text{Distance moved by Load}} = \\frac{10\\text{ m}}{2\\text{ m}} = 5.0$$\n\n(iii) $$\\text{Efficiency} = \\frac{\\text{M.A.}}{\\text{V.R.}} \\times 100\\% = \\frac{4.0}{5.0} \\times 100\\% = 80\\%$$.",
        maxMarks: 5
      }
    ]
  }
];

async function seedNaccaSciencePastPaper() {
  console.log("Seeding NaCCA Science Preparatory Past Paper (Set 70 & 71) into Firestore...");

  // Verify 10A/10B/10C/10D distribution
  const keyDist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  balancedScienceP1.forEach(q => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log("Verified Paper 1 Key Distribution across 40 items:", keyDist);

  const db = await getFirestore();
  const docRef = db.doc("global_curriculum/jhs/subjects/science/past_papers/paper_nacca_sample_variant");

  await docRef.set({
    year: 2024,
    setNumber: 70, // Set 70 (P1) and Set 71 (P2)
    isVariant: true,
    subject: "Integrated Science",
    examination: "NaCCA Common Core Science Preparatory Assessment",
    paper1: {
      title: "Paper 1: Objective Test (Variant)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: balancedScienceP1
    },
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Variant)",
      durationMinutes: 75,
      instructions: "Section A is compulsory. Answer any two questions from Section B. All working must be clearly shown.",
      totalQuestions: 3,
      questions: sciencePaper2Questions
    },
    metadata: {
      source: "NaCCA Preparatory Materials for Common Core Programme Assessment",
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      isomorphic: true,
      optionsBalanced: true,
      updatedAt: new Date()
    }
  }, { merge: true });

  console.log("✅ NaCCA Science Preparatory Papers (Set 70 & 71) successfully seeded into Firestore.");
}

seedNaccaSciencePastPaper()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed to seed NaCCA Science Past Paper:", err);
    process.exit(1);
  });
