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
    console.log('Falling back to default initialization...');
  }

  adminInstance.initializeApp({
    credential: adminInstance.credential.applicationDefault(),
    projectId
  });
  return adminInstance.firestore();
}

const SET_BECE_2012_SCIENCE_P1 = {
  "id": "paper_2012_variant",
  "title": "2012 BECE Integrated Science Paper 1 (Set 92 Objective)",
  "tier": "Junior Secondary (JHS)",
  "subject": "Integrated Science",
  "topic": "2012 BECE Integrated Science Standardized CBT",
  "variantType": "past_paper_variant",
  "year": 2012,
  "paperType": 1,
  "setNumber": 92,
  "era": "classic",
  "totalQuestions": 40,
  "version": 1,
  "format": "multiple_choice",
  "questions": [
    {
      "id": "q01",
      "number": 1,
      "title": "Question 1",
      "format": "multiple_choice",
      "prompt": "In the International System of Units (S.I.), what is the official metric unit used for measuring the mechanical work done by an applied force?",
      "options": [
        "The Newton [N]",
        "The Kelvin [K]",
        "The Watt [W]",
        "The Joule [J]"
      ],
      "correctAnswer": "The Joule [J]",
      "hint": "Force is measured in Newtons, power in Watts, and mechanical work ($W = F \\times d$) in Joules.",
      "workedSolution": "Mechanical work done is defined as force multiplied by displacement ($1\\text{ J} = 1\\text{ N}\\cdot\\text{m}$); its S.I. derived unit is the Joule (J).",
      "points": 1
    },
    {
      "id": "q02",
      "number": 2,
      "title": "Question 2",
      "format": "multiple_choice",
      "prompt": "The chemical stoichiometric formula of a pure inorganic compound directly indicates the:",
      "options": [
        "Exact geometric volume of liquid present in the container",
        "Exact physical state of matter of the surrounding container",
        "Total number of unbonded free atoms drifting in the ambient air",
        "Fixed whole-number ratio in which the constituent elements are chemically combined"
      ],
      "correctAnswer": "Fixed whole-number ratio in which the constituent elements are chemically combined",
      "hint": "For example, $\\text{H}_2\\text{O}$ indicates a fixed $2:1$ atomic combining ratio of hydrogen to oxygen.",
      "workedSolution": "A chemical formula represents the identity of the combining elements and the fixed stoichiometric atomic ratio in which they unite (e.g., $2:1$ in water).",
      "points": 1
    },
    {
      "id": "q03",
      "number": 3,
      "title": "Question 3",
      "format": "multiple_choice",
      "prompt": "Which fundamental biochemical life process in living organisms is summarized by the chemical word equation: $\\text{Glucose} + \\text{Oxygen} \\to \\text{Carbon dioxide} + \\text{Water} + \\text{Energy}$?",
      "options": [
        "Photosynthesis",
        "Enzymatic digestion",
        "Renal excretion",
        "Aerobic cellular respiration"
      ],
      "correctAnswer": "Aerobic cellular respiration",
      "hint": "The catabolic oxidation of carbohydrates within mitochondria to liberate metabolic energy (ATP).",
      "workedSolution": "Aerobic respiration oxidizes glucose in the presence of oxygen within cellular mitochondria, producing carbon dioxide, water, and usable ATP energy.",
      "points": 1
    },
    {
      "id": "q04",
      "number": 4,
      "title": "Question 4",
      "format": "multiple_choice",
      "prompt": "In pedology and soil science, each distinct horizontal layer revealed in a vertical cross-section through the soil profile is known as a:",
      "options": [
        "Soil solum",
        "Surface regolith",
        "Soil horizon",
        "Humus litter"
      ],
      "correctAnswer": "Soil horizon",
      "hint": "Designated systematically from surface to bedrock as Horizons A, B, C, and D.",
      "workedSolution": "A soil horizon is a distinct horizontal layer within a soil profile, differing in color, texture, organic matter, and mineral content from adjacent layers.",
      "points": 1
    },
    {
      "id": "q05",
      "number": 5,
      "title": "Question 5",
      "format": "multiple_choice",
      "prompt": "When a semiconductor p-n junction diode is connected in reverse bias across an external direct-current power supply:",
      "options": [
        "The internal depletion region widens and no appreciable electric current flows",
        "Heavy electric current conducts freely from the p-type to n-type material",
        "Conduction electrons cross the junction barrier with zero electrical resistance",
        "The diode emits coherent high-intensity visible light photons continuously"
      ],
      "correctAnswer": "The internal depletion region widens and no appreciable electric current flows",
      "hint": "The external potential attracts majority carriers away from the junction, increasing junction resistance.",
      "workedSolution": "In reverse bias, external polarity widens the depletion layer, presenting an extremely high resistance barrier that prevents majority carrier current conduction.",
      "points": 1
    },
    {
      "id": "q06",
      "number": 6,
      "title": "Question 6",
      "format": "multiple_choice",
      "prompt": "When an insoluble solid-liquid suspension (such as muddy river water) is separated by gravity filtration, the clear liquid that collects in the beaker below is termed the:",
      "options": [
        "Filtrate",
        "Residue",
        "Precipitate",
        "Sediment"
      ],
      "correctAnswer": "Filtrate",
      "hint": "The solid trapped on the filter paper is the residue; the liquid passing through is the filtrate.",
      "workedSolution": "Filtration separates suspensions: insoluble solid particles are retained on the filter paper as residue, while the clarified liquid passing through is the filtrate.",
      "points": 1
    },
    {
      "id": "q07",
      "number": 7,
      "title": "Question 7",
      "format": "multiple_choice",
      "prompt": "Which of the following physical phase transformations directly involves matter transitioning out of the solid state?",
      "options": [
        "Boiling",
        "Condensation",
        "Melting (Fusion)",
        "Evaporation"
      ],
      "correctAnswer": "Melting (Fusion)",
      "hint": "The thermal transition where a solid absorbs latent heat and converts into a liquid.",
      "workedSolution": "Melting (fusion) is the endothermic phase transition where a substance changes from a solid state into a liquid state upon absorbing thermal energy.",
      "points": 1
    },
    {
      "id": "q08",
      "number": 8,
      "title": "Question 8",
      "format": "multiple_choice",
      "prompt": "Which of the following agricultural cropping systems is most effective in maintaining long-term soil fertility and breaking pest life cycles?",
      "options": [
        "Continuous monoculture",
        "Shifting slash-and-burn cultivation",
        "Systematic crop rotation",
        "Indiscriminate broadcast monocropping"
      ],
      "correctAnswer": "Systematic crop rotation",
      "hint": "Alternating deep and shallow feeders and incorporating nitrogen-fixing leguminous crops across seasons.",
      "workedSolution": "Crop rotation systematically alternates crop families with differing nutrient demands and includes legumes, replenishing soil nitrates and interrupting pest cycles.",
      "points": 1
    },
    {
      "id": "q09",
      "number": 9,
      "title": "Question 9",
      "format": "multiple_choice",
      "prompt": "Which nutritional deficiency disorder in children is clinically associated with inadequate dietary intake of calcium mineral salts or Vitamin D?",
      "options": [
        "Kwashiorkor",
        "Rickets",
        "Endemic goiter",
        "Scurvy"
      ],
      "correctAnswer": "Rickets",
      "hint": "Causes soft, weakened bones that bend under body weight, resulting in bow-legs or knock-knees.",
      "workedSolution": "Rickets is a bone-softening deficiency disease in children resulting from a deficiency of calcium or Vitamin D, impairing bone mineralization.",
      "points": 1
    },
    {
      "id": "q10",
      "number": 10,
      "title": "Question 10",
      "format": "multiple_choice",
      "prompt": "In the standard schematic circuit symbol of a bipolar junction transistor (NPN or PNP), on which terminal lead is the directional current arrow always placed?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 280 170' width='100%' height='150' style='max-width: 360px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><circle cx='140' cy='85' r='50' fill='none' stroke='#64748b' stroke-width='2'/><line x1='40' y1='85' x2='110' y2='85' stroke='#38bdf8' stroke-width='3'/><line x1='110' y1='55' x2='110' y2='115' stroke='#38bdf8' stroke-width='5'/><text x='35' y='89' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='end'>Base</text><line x1='110' y1='70' x2='170' y2='35' stroke='#cbd5e1' stroke-width='3'/><line x1='170' y1='35' x2='170' y2='10' stroke='#cbd5e1' stroke-width='3'/><text x='180' y='22' font-size='11' font-weight='bold' fill='#cbd5e1'>Collector</text><line x1='110' y1='100' x2='170' y2='135' stroke='#ef4444' stroke-width='3'/><polygon points='142,120 155,128 139,132' fill='#ef4444'/><line x1='170' y1='135' x2='170' y2='160' stroke='#ef4444' stroke-width='3'/><text x='180' y='155' font-size='11' font-weight='bold' fill='#ef4444'>Emitter (Arrow)</text><text x='140' y='165' font-size='8' font-weight='bold' fill='#94a3b8' text-anchor='middle'>ARROW IS ALWAYS LOCATED ON EMITTER LEAD</text></svg></div>",
      "options": [
        "The emitter lead",
        "The base lead",
        "The collector lead",
        "The central gate lead"
      ],
      "correctAnswer": "The emitter lead",
      "hint": "The arrow indicates the direction of conventional current flow across the emitter-base junction.",
      "workedSolution": "In both NPN and PNP transistor symbols, the directional arrow is always located on the emitter lead, indicating the direction of conventional current (hole flow).",
      "points": 1
    },
    {
      "id": "q11",
      "number": 11,
      "title": "Question 11",
      "format": "multiple_choice",
      "prompt": "Which of the following destructive insect pests of agricultural crops possesses specialized piercing and sucking mouthparts to extract plant cell sap?",
      "options": [
        "Variegated grasshoppers",
        "Subterranean worker termites",
        "Cotton aphids [Aphis spp.]",
        "Maize stem borers"
      ],
      "correctAnswer": "Cotton aphids [Aphis spp.]",
      "hint": "Uses needle-like piercing stylets to suck sap, transmitting viral mosaic diseases.",
      "workedSolution": "Aphids possess piercing-sucking mouthparts (proboscis/stylets) used to penetrate plant phloem tissues and suck sugary sap, transmitting plant viruses.",
      "points": 1
    },
    {
      "id": "q12",
      "number": 12,
      "title": "Question 12",
      "format": "multiple_choice",
      "prompt": "An automatic, involuntary spinal reflex action in human physiology coordinates an immediate neuromuscular response via the:",
      "options": [
        "Spinal cord, sensory nerves, and effector muscles",
        "Cerebral cortex and conscious thought centers exclusively",
        "Autonomic digestive glands and bone marrow only",
        "Cranial optic nerve and retinal rod cells exclusively"
      ],
      "correctAnswer": "Spinal cord, sensory nerves, and effector muscles",
      "hint": "Bypasses conscious cerebral processing to allow rapid protective withdrawal from painful stimuli.",
      "workedSolution": "A simple reflex arc travels from sensory receptor to sensory neuron, through the spinal cord (integrating center), and directly via motor neurons to effector muscles.",
      "points": 1
    },
    {
      "id": "q13",
      "number": 13,
      "title": "Question 13",
      "format": "multiple_choice",
      "prompt": "Which of the following statements accurately characterizes the optical image formed by a flat, smooth plane mirror?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 160' width='100%' height='145' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='170' y1='20' x2='170' y2='140' stroke='#38bdf8' stroke-width='3'/><line x1='170' y1='30' x2='180' y2='25' stroke='#64748b' stroke-width='1.5'/><line x1='170' y1='55' x2='180' y2='50' stroke='#64748b' stroke-width='1.5'/><line x1='170' y1='80' x2='180' y2='75' stroke='#64748b' stroke-width='1.5'/><line x1='170' y1='105' x2='180' y2='100' stroke='#64748b' stroke-width='1.5'/><line x1='170' y1='130' x2='180' y2='125' stroke='#64748b' stroke-width='1.5'/><line x1='90' y1='120' x2='90' y2='45' stroke='#10b981' stroke-width='3'/><polygon points='85,55 90,40 95,55' fill='#10b981'/><text x='90' y='135' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>Object</text><line x1='250' y1='120' x2='250' y2='45' stroke='#f59e0b' stroke-width='2.5' stroke-dasharray='4,3'/><polygon points='245,55 250,40 255,55' fill='#f59e0b'/><text x='250' y='135' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Virtual Image</text><line x1='90' y1='80' x2='250' y2='80' stroke='#cbd5e1' stroke-width='1' stroke-dasharray='2,2'/><text x='170' y='152' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>PLANE MIRROR: IMAGE IS ALWAYS VIRTUAL AND ERECT</text></svg></div>",
      "options": [
        "The image is always virtual, erect, and laterally inverted",
        "The image is real, inverted, and magnified",
        "The image is real, erect, and diminished",
        "The image is virtual, upside-down, and magnified"
      ],
      "correctAnswer": "The image is always virtual, erect, and laterally inverted",
      "hint": "Light rays appear to originate behind the mirror; the image cannot be focused on a physical screen.",
      "workedSolution": "Images formed in plane mirrors are virtual (rays do not physically cross), erect (upright), laterally inverted, and identical in size to the object.",
      "points": 1
    },
    {
      "id": "q14",
      "number": 14,
      "title": "Question 14",
      "format": "multiple_choice",
      "prompt": "Which of the following statements concerning chemical acids are scientifically accurate?",
      "options": [
        "They turn moist red litmus paper into a deep blue color",
        "They possess a bitter taste and feel slippery to the touch",
        "They can be classified as organic or mineral acids and are neutralized by bases to form salt and water",
        "They have an aqueous pH value consistently greater than 9.0"
      ],
      "correctAnswer": "They can be classified as organic or mineral acids and are neutralized by bases to form salt and water",
      "hint": "Acids turn blue litmus red, neutralize bases, and exist as organic (citric, ethanoic) or mineral ($HCl, H_2SO_4$) acids.",
      "workedSolution": "Acids turn blue litmus red ($pH < 7$), can be classified into organic and mineral acids, and undergo neutralization with bases to yield salt and water.",
      "points": 1
    },
    {
      "id": "q15",
      "number": 15,
      "title": "Question 15",
      "format": "multiple_choice",
      "prompt": "A bipolar junction transistor (BJT) is operating in its active linear region when:",
      "options": [
        "Both of its p-n junctions are simultaneously reverse-biased",
        "Both of its p-n junctions are simultaneously forward-biased",
        "The base-emitter junction is completely open-circuited",
        "Its emitter-base junction is forward-biased while its collector-base junction is reverse-biased"
      ],
      "correctAnswer": "Its emitter-base junction is forward-biased while its collector-base junction is reverse-biased",
      "hint": "The required bias configuration for linear signal amplification without waveform distortion.",
      "workedSolution": "To operate in the active amplification region, the emitter-base junction must be forward-biased (allowing carrier injection) and the collector-base junction reverse-biased.",
      "points": 1
    },
    {
      "id": "q16",
      "number": 16,
      "title": "Question 16",
      "format": "multiple_choice",
      "prompt": "Pulmonary tuberculosis, caused by the bacterium *Mycobacterium tuberculosis*, is primarily transmitted from person to person through:",
      "options": [
        "Consuming uncooked freshwater tilapia fish",
        "Direct mechanical contact with unbroken dermal skin",
        "Inhaling airborne respiratory droplets coughed or sneezed into the air by an infected patient",
        "Bites from blood-sucking adult female Culex mosquitoes"
      ],
      "correctAnswer": "Inhaling airborne respiratory droplets coughed or sneezed into the air by an infected patient",
      "hint": "An airborne respiratory infectious disease transmitted via aerosol droplets.",
      "workedSolution": "Tuberculosis is an airborne communicable infection spread when a person with active pulmonary TB coughs, sneezes, or talks, aerosolizing infectious droplet nuclei.",
      "points": 1
    },
    {
      "id": "q17",
      "number": 17,
      "title": "Question 17",
      "format": "multiple_choice",
      "prompt": "What is the primary mechanical function of engine lubricating oil within the internal combustion engine of an agricultural tractor?",
      "options": [
        "Accelerating the intake of cold atmospheric air into the carburettor",
        "Ensuring the chemical decomposition of diesel fuel within fuel lines",
        "Increasing the electrical resistance of the starter motor ignition",
        "Forming a protective fluid film to lubricate moving parts and minimize frictional wear"
      ],
      "correctAnswer": "Forming a protective fluid film to lubricate moving parts and minimize frictional wear",
      "hint": "Prevents metal-to-metal rubbing contact and dissipates frictional heat between cylinders and pistons.",
      "workedSolution": "Engine oil lubricates moving engine components (crankshaft, pistons, bearings), reducing friction, preventing abrasive wear, cooling parts, and inhibiting corrosion.",
      "points": 1
    },
    {
      "id": "q18",
      "number": 18,
      "title": "Question 18",
      "format": "multiple_choice",
      "prompt": "Black pod disease is a destructive phytopathological fungal infection that attacks:",
      "options": [
        "Arabica coffee berries",
        "Cocoa tree pods [Theobroma cacao]",
        "Citrus orange fruits",
        "Mango tree leaves"
      ],
      "correctAnswer": "Cocoa tree pods [Theobroma cacao]",
      "hint": "Caused by *Phytophthora palmivora*, rotting the outer husk and beans of cocoa pods.",
      "workedSolution": "Black pod disease of cocoa is caused by *Phytophthora* fungi; it produces dark, rotting lesions across cocoa pods, causing substantial agricultural harvest losses.",
      "points": 1
    },
    {
      "id": "q19",
      "number": 19,
      "title": "Question 19",
      "format": "multiple_choice",
      "prompt": "Why is the mechanical efficiency of any real simple machine always strictly less than 100%?",
      "options": [
        "A portion of the input work is always converted into wasted thermal energy to overcome friction",
        "The mechanical advantage of a simple machine is always zero",
        "Work output is consistently multiplied by velocity ratio",
        "The gravitational acceleration acting on the load drops to zero during lifting"
      ],
      "correctAnswer": "A portion of the input work is always converted into wasted thermal energy to overcome friction",
      "hint": "Mechanical friction and the weight of machine parts require energy, meaning useful work output is less than input.",
      "workedSolution": "Due to frictional resistance between moving contact surfaces and the weight of machine components, some input energy is dissipated as heat, keeping efficiency below 100%.",
      "points": 1
    },
    {
      "id": "q20",
      "number": 20,
      "title": "Question 20",
      "format": "multiple_choice",
      "prompt": "Which combination of electronic components is wired together to generate high-frequency sinusoidal oscillations in radio oscillator circuits?",
      "options": [
        "Transformers and primary dry chemical cells only",
        "Transistors, inductors, and capacitors (LC resonant tank circuits)",
        "Incandescent filament bulbs and copper fuses only",
        "Permanent bar magnets and step-down resistors only"
      ],
      "correctAnswer": "Transistors, inductors, and capacitors (LC resonant tank circuits)",
      "hint": "An inductor and capacitor exchange electrical and magnetic energy, while a transistor provides regenerative feedback.",
      "workedSolution": "Electronic oscillator circuits use an LC resonant tank circuit (inductor and capacitor) combined with an active amplifying transistor to sustain oscillations.",
      "points": 1
    },
    {
      "id": "q21",
      "number": 21,
      "title": "Question 21",
      "format": "multiple_choice",
      "prompt": "Which of the following sources of illumination is classified as a natural source of light?",
      "options": [
        "An incandescent tungsten filament bulb",
        "A bioluminescent glow-worm (or the Sun)",
        "A mercury-vapor fluorescent lamp",
        "An explosive pyrotechnic firecracker"
      ],
      "correctAnswer": "A bioluminescent glow-worm (or the Sun)",
      "hint": "Generates light via biological luciferin reactions or stellar nuclear fusion rather than manufactured devices.",
      "workedSolution": "Glow-worms emit light naturally via enzymatic bioluminescence, whereas filament bulbs and fluorescent tubes are artificial man-made sources.",
      "points": 1
    },
    {
      "id": "q22",
      "number": 22,
      "title": "Question 22",
      "format": "multiple_choice",
      "prompt": "Which of the following physiological substances are transported through the systemic circulation by human blood plasma?",
      "options": [
        "Liquid urine and gastric hydrochloric acid",
        "Insoluble cellulose fibers and pancreatic bile",
        "Endocrine hormones, dissolved oxygen, and carbon dioxide",
        "Salivary amylase and hydrochloric acid"
      ],
      "correctAnswer": "Endocrine hormones, dissolved oxygen, and carbon dioxide",
      "hint": "Blood conveys endocrine hormones, respiratory gases, and nutrients; urine is formed and excreted by the kidneys.",
      "workedSolution": "Blood plasma transports chemical hormones, dissolved respiratory gases ($O_2, CO_2$), nutrients, and metabolic urea. Urine is excreted through the renal tract.",
      "points": 1
    },
    {
      "id": "q23",
      "number": 23,
      "title": "Question 23",
      "format": "multiple_choice",
      "prompt": "The commercial practice of identifying business opportunities, mobilizing resources, and establishing a new enterprise while accepting financial risks is termed:",
      "options": [
        "Centralized civil administration",
        "Entrepreneurship",
        "Subsistence farming",
        "Labor unionism"
      ],
      "correctAnswer": "Entrepreneurship",
      "hint": "The innovative driver of commercial ventures and agribusiness enterprises.",
      "workedSolution": "Entrepreneurship is the process of recognizing market opportunities, organizing factors of production, and assuming financial risks to launch an enterprise.",
      "points": 1
    },
    {
      "id": "q24",
      "number": 24,
      "title": "Question 24",
      "format": "multiple_choice",
      "prompt": "Which sub-atomic particle resides within the atomic nucleus and carries zero electrical charge (electrically neutral)?",
      "options": [
        "The proton",
        "The neutron",
        "The electron",
        "The beta particle"
      ],
      "correctAnswer": "The neutron",
      "hint": "Protons carry a $+1$ charge, electrons carry a $-1$ charge, and neutrons have zero charge.",
      "workedSolution": "Neutrons are neutral nucleons located in the atomic nucleus with a relative atomic mass of 1 and an electrical charge of 0.",
      "points": 1
    },
    {
      "id": "q25",
      "number": 25,
      "title": "Question 25",
      "format": "multiple_choice",
      "prompt": "Which routine livestock management practice is most essential for tracking ancestry, maintaining vaccination schedules, and accurate production record keeping?",
      "options": [
        "Animal identification (ear tagging, tattooing, or branding)",
        "Flock culling",
        "Poultry debeaking",
        "Cattle dehorning"
      ],
      "correctAnswer": "Animal identification (ear tagging, tattooing, or branding)",
      "hint": "Affixing unique identification numbers via ear tags or tattoos enables individual monitoring.",
      "workedSolution": "Animal identification assigns unique markers to individual animals, enabling farm managers to track milk yields, breeding lineages, and medical histories.",
      "points": 1
    },
    {
      "id": "q26",
      "number": 26,
      "title": "Question 26",
      "format": "multiple_choice",
      "prompt": "In an optical pinhole camera, if the aperture hole in the front plate is enlarged significantly, what happens to the image cast on the translucent screen?",
      "options": [
        "The image becomes sharply focused and highly magnified",
        "The image completely inverts into an upright virtual image",
        "The image disappears completely and leaves the screen dark",
        "The image becomes blurred and fuzzy due to multiple overlapping images"
      ],
      "correctAnswer": "The image becomes blurred and fuzzy due to multiple overlapping images",
      "hint": "A larger hole acts as many adjacent pinholes, projecting overlapping rays that blur the image.",
      "workedSolution": "Enlarging the pinhole allows multiple light rays from each object point to strike different screen areas, resulting in overlapping images that blur image sharpness.",
      "points": 1
    },
    {
      "id": "q27",
      "number": 27,
      "title": "Question 27",
      "format": "multiple_choice",
      "prompt": "Why are chemically unreactive noble metals such as pure gold and platinum preferred worldwide for fabricating ornaments and fine jewelry?",
      "options": [
        "They have exceptionally low tensile strength and crack easily",
        "They undergo rapid surface oxidation and develop flaky rust",
        "They react violently with atmospheric nitrogen and sweat",
        "They do not react with atmospheric oxygen or moisture, preserving their lustrous shine"
      ],
      "correctAnswer": "They do not react with atmospheric oxygen or moisture, preserving their lustrous shine",
      "hint": "Positioned at the bottom of the reactivity series, meaning they resist tarnishing and corrosion.",
      "workedSolution": "Gold and platinum are unreactive noble metals that do not oxidize or tarnish in air, allowing them to retain their bright metallic luster permanently.",
      "points": 1
    },
    {
      "id": "q28",
      "number": 28,
      "title": "Question 28",
      "format": "multiple_choice",
      "prompt": "In a biological ecosystem, chlorophyll-bearing green plants are designated as primary autotrophic producers because they:",
      "options": [
        "Feed directly on decomposing forest leaf litter",
        "Manufacture their own organic food from inorganic raw materials using light energy",
        "Rely entirely on parasitizing neighboring host trees",
        "Absorb pre-formed proteins and carbohydrates from animals"
      ],
      "correctAnswer": "Manufacture their own organic food from inorganic raw materials using light energy",
      "hint": "They capture solar photon energy to synthesize glucose from carbon dioxide and water.",
      "workedSolution": "Producers utilize solar radiation, water, and carbon dioxide to synthesize organic carbohydrates via photosynthesis, forming the nutritional foundation of food chains.",
      "points": 1
    },
    {
      "id": "q29",
      "number": 29,
      "title": "Question 29",
      "format": "multiple_choice",
      "prompt": "The agronomic practice of planting genetically improved, disease-resistant crop varieties to minimize fungal blights is classified as a:",
      "options": [
        "Chemical control method using systemic fungicides",
        "Mechanical physical barrier control method",
        "Thermal soil sterilization method",
        "Biological (genetic) disease control method"
      ],
      "correctAnswer": "Biological (genetic) disease control method",
      "hint": "Leverages internal plant genetics to resist pathogens without applying synthetic chemical sprays.",
      "workedSolution": "Breeding and cultivating resistant crop varieties is a biological/genetic control method that utilizes host plant immunity to suppress disease without chemicals.",
      "points": 1
    },
    {
      "id": "q30",
      "number": 30,
      "title": "Question 30",
      "format": "multiple_choice",
      "prompt": "The chemical formula of aluminum oxide is written as $\\text{Al}_x\\text{O}_y$. Given that the combining valencies of aluminum and oxygen are 3 and 2 respectively, what are the values of $x$ and $y$?",
      "options": [
        "x = 3 and y = 2",
        "x = 1 and y = 3",
        "x = 3 and y = 1",
        "x = 2 and y = 3"
      ],
      "correctAnswer": "x = 2 and y = 3",
      "hint": "Criss-cross valencies: two $\\text{Al}^{3+}$ ions balance three $\\text{O}^{2-}$ ions.",
      "workedSolution": "Criss-crossing valencies gives $\\text{Al}_2\\text{O}_3$; two aluminum ions ($2 \\times +3 = +6$) balance three oxide ions ($3 \\times -2 = -6$), meaning $x=2$ and $y=3$.",
      "points": 1
    },
    {
      "id": "q31",
      "number": 31,
      "title": "Question 31",
      "format": "multiple_choice",
      "prompt": "Which component in an electrical circuit protects domestic household appliances against destructive current surges by melting?",
      "options": [
        "A parallel capacitor",
        "A fixed wire-wound resistor",
        "A safety fuse",
        "A double-pole master switch"
      ],
      "correctAnswer": "A safety fuse",
      "hint": "Contains a low-melting-point wire that blows when current exceeds safe limits.",
      "workedSolution": "A fuse contains a metal alloy wire with a low melting point that heats and melts when excessive current passes, breaking the circuit to protect appliances.",
      "points": 1
    },
    {
      "id": "q32",
      "number": 32,
      "title": "Question 32",
      "format": "multiple_choice",
      "prompt": "What is a major socio-economic benefit of adopting modern technological advancements in manufacturing industries?",
      "options": [
        "Causing widespread environmental degradation and water poisoning",
        "Providing mechanized automated machinery that boosts production efficiency and output",
        "Permanently eliminating all skilled employment opportunities",
        "Increasing the unit cost of producing commercial consumer goods"
      ],
      "correctAnswer": "Providing mechanized automated machinery that boosts production efficiency and output",
      "hint": "Industrial technology introduces automated equipment that increases output and lowers production costs.",
      "workedSolution": "Technological innovation provides mechanized equipment and automation, improving manufacturing precision, labor productivity, and economies of scale.",
      "points": 1
    },
    {
      "id": "q33",
      "number": 33,
      "title": "Question 33",
      "format": "multiple_choice",
      "prompt": "Which of the following factors contribute to adolescent teenage pregnancy and early parenthood in developing communities?",
      "options": [
        "High academic achievement in science and mathematics",
        "Regular physical participation in competitive sports",
        "Poverty, illiteracy, lack of parental guidance, and negative peer pressure",
        "Strict enforcement of secondary school attendance rules"
      ],
      "correctAnswer": "Poverty, illiteracy, lack of parental guidance, and negative peer pressure",
      "hint": "A combination of economic hardship, lack of sex education, and negative peer influence.",
      "workedSolution": "Teenage pregnancy is driven by socioeconomic deprivation, lack of comprehensive sex education, breakdown of parental supervision, and peer pressure.",
      "points": 1
    },
    {
      "id": "q34",
      "number": 34,
      "title": "Question 34",
      "format": "multiple_choice",
      "prompt": "Which of the following agricultural soil additives is an organic manure that improves soil physical crumb structure and water retention?",
      "options": [
        "Decomposed organic compost",
        "Synthetic NPK 15-15-15 granular fertilizer",
        "Commercial pelleted ammonium sulfate",
        "Industrial chemical urea crystals"
      ],
      "correctAnswer": "Decomposed organic compost",
      "hint": "Formed from decomposed organic matter (humus) that binds mineral particles into crumbs.",
      "workedSolution": "Compost supplies decomposed organic humus that aggregates sand, silt, and clay into crumbs, enhancing aeration, water retention, and microbial activity.",
      "points": 1
    },
    {
      "id": "q35",
      "number": 35,
      "title": "Question 35",
      "format": "multiple_choice",
      "prompt": "What chemical products are formed during the neutralization reaction between dilute hydrochloric acid ($\\text{HCl}$) and sodium hydroxide ($\\text{NaOH}$)?",
      "options": [
        "Sodium oxide and hydrogen gas only",
        "Sodium chloride and toxic chlorine gas",
        "Sodium metal and pure liquid water",
        "Sodium chloride salt [NaCl] and water [H₂O]"
      ],
      "correctAnswer": "Sodium chloride salt [NaCl] and water [H₂O]",
      "hint": "$\\text{HCl} + \\text{NaOH} \\to \\text{NaCl} + \\text{H}_2\\text{O}$.",
      "workedSolution": "Neutralization of an acid with an alkali yields a neutral salt and water: $\\text{HCl}_{(aq)} + \\text{NaOH}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)}$.",
      "points": 1
    },
    {
      "id": "q36",
      "number": 36,
      "title": "Question 36",
      "format": "multiple_choice",
      "prompt": "According to modern international electrical wiring standards, what color of insulation indicates the live conductor in a domestic 3-pin plug?",
      "options": [
        "Blue",
        "Solid green",
        "Brown",
        "Green with yellow stripes"
      ],
      "correctAnswer": "Brown",
      "hint": "Live is brown, neutral is blue, and earth is green-and-yellow striped.",
      "workedSolution": "Under international standards, the live conductor wire is color-coded brown, the neutral conductor is blue, and the protective earth conductor is green/yellow.",
      "points": 1
    },
    {
      "id": "q37",
      "number": 37,
      "title": "Question 37",
      "format": "multiple_choice",
      "prompt": "Which of the following essential plant mineral elements is classified as a micronutrient (minor trace element) required only in minute concentrations?",
      "options": [
        "Nitrogen [N]",
        "Iron [Fe]",
        "Phosphorus [P]",
        "Calcium [Ca]"
      ],
      "correctAnswer": "Iron [Fe]",
      "hint": "Macro-nutrients include N, P, K, and Ca; micronutrients include trace elements like Fe, Zn, and Cu.",
      "workedSolution": "Iron (Fe) is a micronutrient required in tiny trace amounts as an enzyme cofactor, whereas nitrogen, phosphorus, and calcium are primary macronutrients.",
      "points": 1
    },
    {
      "id": "q38",
      "number": 38,
      "title": "Question 38",
      "format": "multiple_choice",
      "prompt": "In human reproductive physiology, full-term embryonic and fetal development within the maternal uterus normally spans approximately:",
      "options": [
        "9 calendar months (38 to 40 weeks)",
        "6 calendar months",
        "7 calendar months",
        "12 calendar months"
      ],
      "correctAnswer": "9 calendar months (38 to 40 weeks)",
      "hint": "Normal human gestational duration spans about 280 days from the last menstrual period.",
      "workedSolution": "Normal human pregnancy (gestation) lasts approximately 9 calendar months (around 40 gestational weeks / 280 days) from fertilization to parturition.",
      "points": 1
    },
    {
      "id": "q39",
      "number": 39,
      "title": "Question 39",
      "format": "multiple_choice",
      "prompt": "A physical material that transmits a small fraction of incident light but scatters the rays so that objects behind it cannot be seen clearly is described as:",
      "options": [
        "Completely transparent",
        "Translucent",
        "Totally opaque",
        "Specularly reflective"
      ],
      "correctAnswer": "Translucent",
      "hint": "Frosted glass and tracing paper allow light through but scatter it, obscuring clear shapes.",
      "workedSolution": "Translucent materials (e.g., frosted glass, oiled paper) allow light to pass through partially with diffuse scattering, preventing distinct image resolution.",
      "points": 1
    },
    {
      "id": "q40",
      "number": 40,
      "title": "Question 40",
      "format": "multiple_choice",
      "prompt": "In a bipolar junction transistor, which terminal lead governs switching and amplification by controlling current flow between collector and emitter?",
      "options": [
        "The base terminal",
        "The collector terminal",
        "The emitter terminal",
        "The thermal heatsink"
      ],
      "correctAnswer": "The base terminal",
      "hint": "A small input current applied to this central terminal modulates larger collector current.",
      "workedSolution": "The base terminal acts as the control electrode; varying the small base current ($I_b$) controls the larger current flowing between collector and emitter ($I_c$).",
      "points": 1
    }
  ]
};

async function seedBece2012SciencePaper1Variant() {
  console.log('Seeding 2012 BECE Integrated Science Paper 1 Variant (Set 92) into Firestore...');
  const db = await getFirestore();

  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  SET_BECE_2012_SCIENCE_P1.questions.forEach((q: any) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Key Distribution across 40 items:', keyDist);

  // 1. Write past_papers document
  const docRef = db.doc('global_curriculum/jhs/subjects/science/past_papers/paper_2012_variant');
  await docRef.set({
    year: 2012,
    isVariant: true,
    setNumber: 92,
    subject: "Integrated Science",
    examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
    paper1: {
      id: "paper_2012_variant",
      title: "2012 BECE Integrated Science Paper 1 (Set 92 Objective)",
      durationMinutes: 45,
      totalQuestions: 40,
      format: "multiple_choice",
      questions: SET_BECE_2012_SCIENCE_P1.questions
    },
    metadata: {
      sanitized: true,
      optionsBalanced: true,
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: adminInstance.firestore?.FieldValue ? adminInstance.firestore.FieldValue.serverTimestamp() : new Date()
    }
  }, { merge: true });
  console.log('✅ Ingested into past_papers/paper_2012_variant.');

  // 2. Write topic question set for single-document reads
  const topicRef = db.doc('global_curriculum/jhs/subjects/science/topics/bece_past_papers/question_sets/paper_2012_variant');
  await topicRef.set(SET_BECE_2012_SCIENCE_P1, { merge: true });
  console.log('✅ Ingested into topics/bece_past_papers/question_sets/paper_2012_variant.');

  console.log('🌟 Set 92 Ingestion completed with exact 10A/10B/10C/10D distribution.');
}

seedBece2012SciencePaper1Variant()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Failed ingestion for Set 92 Science Paper 1:', err);
    process.exit(1);
  });
