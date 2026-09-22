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

const balancedMock9P1: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "Which of the following processes in the water cycle involves the evaporative loss of water vapor from the leaves of living plants into the atmosphere?",
    "options": [
      "Precipitation",
      "Transpiration",
      "Infiltration",
      "Condensation"
    ],
    "correctAnswer": "Transpiration",
    "hint": "Evaporation occurring through microscopic stomata on foliage.",
    "workedSolution": "Transpiration is the biological loss of water vapor from aerial plant surfaces (chiefly stomata), contributing substantially to the hydrological water cycle.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "An electric ceiling fan rated at 60 W is operated continuously for 10 hours in a school classroom. Calculate the electrical energy consumed in kilowatt-hours (kWh).",
    "options": [
      "0.06 kWh",
      "0.60 kWh",
      "6.00 kWh",
      "60.00 kWh"
    ],
    "correctAnswer": "0.60 kWh",
    "hint": "Energy = Power in kilowatts x time in hours.",
    "workedSolution": "Power in kW = 60 W / 1000 = 0.06 kW. Energy consumed = 0.06 kW x 10 h = 0.60 kWh.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Which of the following rock types is formed when pre-existing rocks undergo profound physical and chemical alteration due to intense heat and pressure?",
    "options": [
      "Sedimentary rock",
      "Intrusive igneous rock",
      "Metamorphic rock",
      "Extrusive volcanic rock"
    ],
    "correctAnswer": "Metamorphic rock",
    "hint": "Examples include marble (from limestone) and slate (from shale).",
    "workedSolution": "Metamorphic rocks (e.g., marble, quartzite, slate) are created when sedimentary or igneous rocks recrystallize under extreme subterranean heat and tectonic pressure.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "What is the systematic chemical formula for binary Copper(I) oxide?",
    "options": [
      "Cu₂O",
      "CuO",
      "CuO₂",
      "Cu₂O₃"
    ],
    "correctAnswer": "Cu₂O",
    "hint": "Copper has an oxidation state of +1 and Oxygen has an oxidation state of -2.",
    "workedSolution": "Copper(I) has a valency of +1 (Cu⁺) and oxide has a valency of -2 (O²⁻). Two copper cations combine with one oxide anion to give Cu₂O.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "In the human female reproductive system, fertilization of the mature ovum by a spermatozoon normally takes place in the",
    "options": [
      "Uterus",
      "Cervix",
      "Fallopian tube",
      "Vagina"
    ],
    "correctAnswer": "Fallopian tube",
    "hint": "Also called the oviduct.",
    "workedSolution": "Fertilization (the fusion of sperm and ovum nuclei) typically occurs in the upper third of the Fallopian tube (oviduct).",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Which of the following physical properties is characteristic of most metallic elements?",
    "options": [
      "Malleable and ductile",
      "Brittle and easily powdered",
      "Poor conductors of electricity",
      "Dull and non-reflective surface"
    ],
    "correctAnswer": "Malleable and ductile",
    "hint": "Can be hammered into thin sheets and drawn into long wires.",
    "workedSolution": "Metals possess delocalized metallic bonding that allows atomic layers to slide without shattering, making them malleable (sheets) and ductile (wires).",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "A horizontal pulling force of 80 N drags a box across a level laboratory floor through a distance of 5 m. Calculate the work done.",
    "options": [
      "16 J",
      "75 J",
      "400 J",
      "800 J"
    ],
    "correctAnswer": "400 J",
    "hint": "Work Done = Force x Distance = 80 x 5.",
    "workedSolution": "Work Done = Force x Distance = 80 N x 5 m = 400 Joules.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Which of the following farm practices involves training and supporting trailing vegetable vines on upright poles to prevent ground rot?",
    "options": [
      "Pruning",
      "Mulching",
      "Thinning out",
      "Staking"
    ],
    "correctAnswer": "Staking",
    "hint": "Commonly done for climbing tomatoes and yams.",
    "workedSolution": "Staking supports trailing stems on vertical stakes, keeping leaves and fruits off moist soil to prevent fungal rots and improve sun exposure.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "The brown gas that diffuses visibly throughout a gas jar when copper reacts with concentrated nitric acid is",
    "options": [
      "Sulfur dioxide",
      "Carbon dioxide",
      "Ammonia gas",
      "Nitrogen dioxide"
    ],
    "correctAnswer": "Nitrogen dioxide",
    "hint": "Chemical formula NO₂; dense reddish-brown toxic gas.",
    "workedSolution": "Nitrogen dioxide (NO₂) is a dense, reddish-brown gas with a pungent odor that rapidly diffuses through air by molecular motion.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "Which component of the mammalian circulatory system initiates the formation of a blood clot to seal injured vascular tissues?",
    "options": [
      "Red blood cells",
      "White blood cells",
      "Blood platelets",
      "Liquid blood plasma"
    ],
    "correctAnswer": "Blood platelets",
    "hint": "Cellular fragments (thrombocytes) releasing clotting enzymes.",
    "workedSolution": "Blood platelets (thrombocytes) aggregate at wound sites and release thromboplastin, initiating the enzymatic cascade that converts fibrinogen into insoluble fibrin mesh.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "A machine with an applied effort force of 40 N overcomes a load resistance of 120 N. Calculate the Mechanical Advantage (MA) of the machine.",
    "options": [
      "0.33",
      "3.00",
      "4.80",
      "160.00"
    ],
    "correctAnswer": "3.00",
    "hint": "Mechanical Advantage = Load / Effort.",
    "workedSolution": "MA = Load / Effort = 120 N / 40 N = 3.00.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "Which of the following mixtures is classified as a homogeneous mixture?",
    "options": [
      "Sand mixed with water",
      "Kerosene shaken with water",
      "Powdered sulfur in iron filings",
      "Common salt dissolved in water"
    ],
    "correctAnswer": "Common salt dissolved in water",
    "hint": "Forms a uniform, single-phase true solution where solute particles do not settle.",
    "workedSolution": "Salt in water forms a true homogeneous solution with uniform composition and appearance throughout. Sand-water and sulfur-iron are heterogeneous.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "The structure in the mammalian kidney that stores liquid urine before voluntary discharge through the urethra is the",
    "options": [
      "Urinary bladder",
      "Renal pelvis",
      "Ureter",
      "Bowman's capsule"
    ],
    "correctAnswer": "Urinary bladder",
    "hint": "Distensible muscular sac situated in the pelvic cavity.",
    "workedSolution": "The urinary bladder is a hollow, expandable muscular organ that temporarily holds urine conveyed from the kidneys via the ureters.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "Which of the following optical instruments uses the principle of rectilinear propagation of light to form an inverted, real image on a screen?",
    "options": [
      "Plane mirror",
      "Magnifying glass",
      "Astronomical telescope",
      "Pinhole camera"
    ],
    "correctAnswer": "Pinhole camera",
    "hint": "A light-tight box with a small aperture on one side and a translucent screen on the opposite side.",
    "workedSolution": "In a pinhole camera, light rays travel in straight lines across the tiny aperture, projecting an inverted and real image onto the screen.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "Which of the following elements is a halogen located in Group 17 of the periodic table?",
    "options": [
      "Sodium",
      "Magnesium",
      "Chlorine",
      "Argon"
    ],
    "correctAnswer": "Chlorine",
    "hint": "Has 7 valence electrons and forms univalent anions (Cl⁻).",
    "workedSolution": "Chlorine (atomic number 17, configuration 2, 8, 7) is a halogen in Group 17. Sodium is an alkali metal; argon is a noble gas.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "In poultry production, the intensive housing system where laying hens are confined in elevated, tiered wire battery cages has the advantage of",
    "options": [
      "giving birds unlimited outdoor grazing space.",
      "keeping eggs clean and reducing parasite spread.",
      "eliminating the need for balanced compound feed rations.",
      "providing low initial installation and capital equipment costs."
    ],
    "correctAnswer": "keeping eggs clean and reducing parasite spread.",
    "hint": "Eggs roll out onto collection trays away from droppings.",
    "workedSolution": "Battery cage housing prevents birds from contacting droppings (controlling coccidiosis and internal worms) and rolls eggs safely onto troughs away from pecking.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "An object of mass 4 kg is placed on a wall 5 m above ground level. Calculate its gravitational potential energy. [g = 10 m s⁻²]",
    "options": [
      "20 J",
      "40 J",
      "200 J",
      "400 J"
    ],
    "correctAnswer": "200 J",
    "hint": "P.E. = m x g x h.",
    "workedSolution": "P.E. = m x g x h = 4 kg x 10 m s⁻² x 5 m = 200 Joules.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "What is the primary function of the lateral line system visible along the sides of a bony teleost fish?",
    "options": [
      "Propelling the fish forward through rapid thrust",
      "Detecting water vibrations and pressure changes",
      "Pumping oxygenated water across gill filaments",
      "Maintaining vertical pitch and preventing rolling"
    ],
    "correctAnswer": "Detecting water vibrations and pressure changes",
    "hint": "Contains sensory mechanoreceptors sensitive to water currents and movements.",
    "workedSolution": "The lateral line system contains sensory hair cells that detect low-frequency water vibrations, currents, and pressure gradients, aiding navigation and schooling.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "Which of the following methods can be used to soften water containing temporary hardness?",
    "options": [
      "Passing water through filter paper",
      "Adding copper sulfate crystals",
      "Exposing water to sunlight",
      "Boiling the water"
    ],
    "correctAnswer": "Boiling the water",
    "hint": "Thermal decomposition of soluble calcium hydrogencarbonate into insoluble calcium carbonate.",
    "workedSolution": "Boiling decomposes dissolved calcium hydrogencarbonate into insoluble calcium carbonate precipitate (scale), effectively softening temporary hard water.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "Which celestial body in our Solar System is the third planet from the Sun and is the only known planet supporting organic life?",
    "options": [
      "Earth",
      "Mars",
      "Venus",
      "Mercury"
    ],
    "correctAnswer": "Earth",
    "hint": "Our home planet.",
    "workedSolution": "In orbital sequence from the Sun: Mercury (1st), Venus (2nd), Earth (3rd), Mars (4th). Earth's liquid water and atmosphere sustain life.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "When an uncharged glass rod is rubbed briskly with a clean silk cloth, the glass rod becomes",
    "options": [
      "positively charged because it loses electrons.",
      "negatively charged because it gains electrons.",
      "magnetized with a north pole.",
      "a superconductor of electricity."
    ],
    "correctAnswer": "positively charged because it loses electrons.",
    "hint": "Electrons transfer from the glass to the silk cloth by friction.",
    "workedSolution": "Friction transfers negatively charged electrons from the glass rod to the silk. The glass rod is left with an excess of positive protons, becoming positively charged.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "Which of the following insect pests attacks cocoa trees by sucking sap from young vegetative shoots and developing pods?",
    "options": [
      "Maize weevil",
      "Cocoa capsid bug",
      "Stem borer larva",
      "Termite"
    ],
    "correctAnswer": "Cocoa capsid bug",
    "hint": "A piercing-and-sucking mirid pest (Distantiella theobroma).",
    "workedSolution": "Cocoa capsids (mirids) have piercing-and-sucking mouthparts that pierce green bark and cocoa pods, sucking sap and injecting toxic saliva that causes dieback.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "What is the atomic mass number of an atom containing 6 protons, 6 electrons, and 8 neutrons?",
    "options": [
      "12",
      "14",
      "20",
      "48"
    ],
    "correctAnswer": "14",
    "hint": "Mass number = Protons + Neutrons (Carbon-14).",
    "workedSolution": "Mass Number (A) = Protons + Neutrons = 6 + 8 = 14.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "Which component of an electric circuit is specifically designed to melt and break the circuit when electric current exceeds safe operating limits?",
    "options": [
      "Fuse",
      "Rheostat",
      "Voltmeter",
      "Capacitor"
    ],
    "correctAnswer": "Fuse",
    "hint": "Contains a low-melting-point alloy wire.",
    "workedSolution": "A fuse is a circuit protection device containing a thin alloy wire that melts when current exceeds its amperage rating, opening the circuit to prevent fires.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "The biological process by which autotrophic green plants synthesize organic glucose from carbon dioxide and water using sunlight is",
    "options": [
      "Photosynthesis",
      "Respiration",
      "Transpiration",
      "Translocation"
    ],
    "correctAnswer": "Photosynthesis",
    "hint": "Occurs inside chloroplasts containing chlorophyll.",
    "workedSolution": "Photosynthesis converts radiant solar energy into chemical energy: 6CO₂ + 6H₂O -> C₆H₁₂O₆ + 6O₂ in the presence of chlorophyll.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "Which of the following devices is an example of a first-class lever?",
    "options": [
      "Wheelbarrow",
      "Pair of tweezers",
      "Nutcracker",
      "Crowbar"
    ],
    "correctAnswer": "Crowbar",
    "hint": "The fulcrum is situated between the load and the applied effort.",
    "workedSolution": "In a Class 1 lever (such as a crowbar, claw hammer, or scissors), the pivot (fulcrum) is located between the effort and the load.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "Which of the following compounds is an alkali that turns blue litmus paper unchanged and red litmus paper blue?",
    "options": [
      "Hydrochloric acid",
      "Ethanol",
      "Sodium hydroxide",
      "Pure water"
    ],
    "correctAnswer": "Sodium hydroxide",
    "hint": "A strong base (NaOH) with pH > 7.",
    "workedSolution": "Sodium hydroxide (NaOH) is a strong base that dissociates into hydroxide ions (OH⁻) in water, turning red litmus paper blue.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "In agricultural crop production, why are legume crops like cowpeas and groundnuts deliberately included in a 4-year crop rotation program?",
    "options": [
      "To deplete excess soil moisture from heavy clay soils",
      "To produce toxic chemicals that destroy all insect pests",
      "To fix atmospheric nitrogen into the soil via root nodule bacteria",
      "To prevent sunlight from reaching the topsoil layer"
    ],
    "correctAnswer": "To fix atmospheric nitrogen into the soil via root nodule bacteria",
    "hint": "Symbiotic relationship with Rhizobium bacteria.",
    "workedSolution": "Legumes harbor symbiotic *Rhizobium* bacteria in their root nodules that fix atmospheric nitrogen gas into soil nitrates, naturally replenishing soil fertility.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "The pressure exerted by a static liquid column at a given depth depends directly on the",
    "options": [
      "total surface area of the liquid's container.",
      "shape and curvature of the vessel walls.",
      "atmospheric volume of air above the container.",
      "density of the liquid and the depth of the column."
    ],
    "correctAnswer": "density of the liquid and the depth of the column.",
    "hint": "P = rho x g x h.",
    "workedSolution": "Liquid hydrostatic pressure is given by P = ρgh. It depends strictly on liquid density (ρ), acceleration due to gravity (g), and depth (h), independent of container shape.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Which of the following diseases is a water-borne infection caused by the bacterium Vibrio cholerae?",
    "options": [
      "Malaria",
      "Tuberculosis",
      "Cholera",
      "River blindness"
    ],
    "correctAnswer": "Cholera",
    "hint": "Presents with acute profuse watery diarrhea and dehydration.",
    "workedSolution": "Cholera is a severe acute diarrheal infection caused by ingesting food or water contaminated with the bacterium *Vibrio cholerae*.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "What is the total number of valence electrons present in an uncharged atom of Magnesium (₁₂Mg)?",
    "options": [
      "2",
      "4",
      "8",
      "12"
    ],
    "correctAnswer": "2",
    "hint": "Electronic configuration is 2, 8, 2.",
    "workedSolution": "Magnesium has atomic number 12. Its Bohr configuration is 2, 8, 2. The outermost valence shell contains 2 electrons.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "Which of the following simple machines uses grooved wheels and ropes to hoist heavy loads vertically with a mechanical advantage?",
    "options": [
      "Pulley system",
      "Crowbar",
      "Wedge",
      "Inclined plane"
    ],
    "correctAnswer": "Pulley system",
    "hint": "A block-and-tackle assembly.",
    "workedSolution": "A pulley system (block and tackle) uses grooved wheels and ropes to lift heavy weights vertically while multiplying the applied effort.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "Which of the following farm practices involves covering topsoil with dry grass or straw to conserve soil moisture?",
    "options": [
      "Staking",
      "Earthing up",
      "Thinning out",
      "Mulching"
    ],
    "correctAnswer": "Mulching",
    "hint": "Forms a protective blanket that reduces evaporation.",
    "workedSolution": "Mulching covers bare soil around crops with organic plant residues to conserve moisture, moderate soil temperature, and suppress weeds.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "The mode of heat transfer in fluids where heated, less dense fluid rises and cooler, denser fluid sinks is called",
    "options": [
      "Conduction",
      "Radiation",
      "Convection",
      "Evaporation"
    ],
    "correctAnswer": "Convection",
    "hint": "Circulating currents in liquids and gases.",
    "workedSolution": "Convection is the transfer of thermal energy in fluids through bulk circulation currents set up by temperature-induced density differences.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "What is the combining power (valency) of the sulfate radical (SO₄) in chemical compounds?",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "correctAnswer": "2",
    "hint": "Carries a 2- charge (SO₄²⁻).",
    "workedSolution": "The sulfate radical (SO₄²⁻) has a net negative charge of 2, giving it a combining power (valency) of 2.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "Which human tooth type possesses a single sharp, chisel-shaped crown adapted for cutting and biting off food pieces?",
    "options": [
      "Canine",
      "Premolar",
      "Molar",
      "Incisor"
    ],
    "correctAnswer": "Incisor",
    "hint": "The four front teeth in the upper and lower jaws.",
    "workedSolution": "Incisors have sharp, straight, chisel-shaped cutting edges specialized for biting and cutting food.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "Which of the following materials is a good thermal and electrical conductor?",
    "options": [
      "Wood",
      "Copper",
      "Glass",
      "Plastic"
    ],
    "correctAnswer": "Copper",
    "hint": "A metal used extensively in electrical cables and cookware.",
    "workedSolution": "Copper is a metal with free conduction electrons, making it an excellent conductor of both electricity and heat.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "The physical change of state where a liquid changes into a gas at a specific fixed temperature throughout the liquid is",
    "options": [
      "Boiling",
      "Evaporation",
      "Condensation",
      "Sublimation"
    ],
    "correctAnswer": "Boiling",
    "hint": "Occurs at 100°C for pure water at standard atmospheric pressure.",
    "workedSolution": "Boiling occurs throughout the liquid at a definite, fixed temperature when vapor pressure equals atmospheric pressure. Evaporation occurs at the surface at all temperatures.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "Which of the following farm animals has a digestive system characterized by a four-chambered complex stomach?",
    "options": [
      "Pig",
      "Rabbit",
      "Domestic fowl",
      "Sheep"
    ],
    "correctAnswer": "Sheep",
    "hint": "A cud-chewing ruminant with a rumen, reticulum, omasum, and abomasum.",
    "workedSolution": "Sheep (like cattle and goats) are ruminants with four-chambered stomachs adapted for microbial cellulose digestion.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "A chemical reaction between an acid and a base that produces a neutral salt and water only is known as",
    "options": [
      "Oxidation",
      "Neutralization",
      "Fermentation",
      "Sublimation"
    ],
    "correctAnswer": "Neutralization",
    "hint": "Acid + Base -> Salt + Water.",
    "workedSolution": "Neutralization is the chemical reaction between equivalent amounts of an acid and a base to yield a salt and water: H⁺ + OH⁻ -> H₂O.",
    "points": 1
  }
];

const paper2Mock9Questions = [
  {
    "questionNumber": "1",
    "isPracticalSectionA": true,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Figure 1(a) illustrates an optical experiment demonstrating image formation using a pinhole camera:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Object Candle I on Left --><g transform='translate(35, 60)'><rect x='10' y='30' width='12' height='55' fill='#cbd5e1' stroke='#94a3b8' stroke-width='1.2'/><path d='M 16 30 Q 10 18 16 10 Q 22 18 16 30 Z' fill='#f59e0b'/><circle cx='16' cy='12' r='2' fill='#ffffff'/><circle cx='35' cy='55' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='35' y='58' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>I</text><text x='16' y='100' font-size='8' fill='#cbd5e1' text-anchor='middle'>Object</text></g><!-- Camera Box III --><rect x='130' y='35' width='160' height='120' rx='4' fill='#1e293b' stroke='#64748b' stroke-width='2'/><!-- Neutral Label III --><circle cx='210' cy='25' r='8' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><text x='210' y='28' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>III</text><!-- Pinhole Aperture II in front face --><circle cx='130' cy='95' r='3' fill='#0f172a' stroke='#38bdf8' stroke-width='1.5'/><circle cx='115' cy='85' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='115' y='88' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>II</text><!-- Ray 1 from flame tip passing straight through pinhole to bottom of screen --><line x1='51' y1='70' x2='290' y2='125' stroke='#f59e0b' stroke-width='1.5' stroke-dasharray='3,2'/><!-- Ray 2 from candle base passing straight through pinhole to top of screen --><line x1='51' y1='145' x2='290' y2='65' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='3,2'/><!-- Inverted Image IV on Translucent Screen --><g transform='translate(285, 65)'><line x1='5' y1='0' x2='5' y2='60' stroke='#cbd5e1' stroke-width='3'/><!-- Inverted flame pointing down --><path d='M 5 60 Q 0 70 5 75 Q 10 70 5 60 Z' fill='#f59e0b'/><!-- Inverted base at top --><rect x='0' y='0' width='10' height='4' fill='#cbd5e1'/><circle cx='25' cy='30' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='25' y='33' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>IV</text></g><!-- Translucent Ground Glass Screen Line --><line x1='290' y1='35' x2='290' y2='155' stroke='#38bdf8' stroke-width='2'/><!-- Viewing Eye V on Right --><g transform='translate(330, 85)'><path d='M 0 15 Q 12 5 25 15 Q 12 25 0 15 Z' fill='none' stroke='#10b981' stroke-width='2'/><circle cx='12' cy='15' r='4' fill='#10b981'/><circle cx='35' cy='15' r='8' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/><text x='35' y='18' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>V</text></g><text x='190' y='195' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>PINHOLE CAMERA RAY OPTICS: IDENTIFY COMPONENTS I, II, III, IV, AND V</text></svg></div>\n\n(i) Name each of the parts labelled I, II, III, IV, and V.\n(ii) State two characteristics of the image IV formed on the translucent screen.\n(iii) Explain why the image IV formed by the pinhole camera is inverted (upside down).\n(iv) Describe what happens to the size and sharpness of the image IV if:\n  (α) The pinhole II is enlarged to a large circular hole;\n  (β) The camera box III is moved closer to object I.",
        "workedSolution": "(i) Identification of parts:\n• Part I: **Lighted object (candle)**\n• Part II: **Pinhole (small aperture)**\n• Part III: **Light-tight camera box**\n• Part IV: **Inverted image**\n• Part V: **Observer's eye**\n\n(ii) Characteristics of the image:\n1. **Real** (formed by actual intersecting light rays and projected onto a physical screen).\n2. **Inverted** (upside down and laterally reversed).\n3. **Diminished** (smaller in size than the original object when object distance exceeds camera length).\n\n(iii) Why the image is inverted:\nLight travels in straight lines (rectilinear propagation). Light rays from the top of the flame pass straight through the pinhole and strike the bottom of the screen, while rays from the candle base travel straight through the pinhole to the top of the screen, creating an inverted image.\n\n(iv) Effects of modifications:\n• (α) Enlarging the pinhole: The image becomes **blurred and bright**, because multiple overlapping images of the object are formed through the wider opening.\n• (β) Moving camera closer to object: The image becomes **magnified (larger)**, because the angle subtended by the object at the pinhole increases.",
        "maxMarks": 10
      },
      {
        "subId": "(b)",
        "prompt": "Figure 1(b) illustrates a laboratory setup used to separate an immiscible liquid-liquid mixture of kerosene and water:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Retort Stand Support --><line x1='60' y1='210' x2='120' y2='210' stroke='#64748b' stroke-width='3'/><line x1='80' y1='210' x2='80' y2='25' stroke='#64748b' stroke-width='3'/><line x1='80' y1='50' x2='160' y2='50' stroke='#64748b' stroke-width='2.5'/><!-- Separating Funnel Bulb I --><g transform='translate(160, 25)'><!-- Stopper --><rect x='15' y='5' width='10' height='10' rx='2' fill='#cbd5e1' stroke='#94a3b8' stroke-width='1.2'/><!-- Funnel Body --><path d='M 10 15 L 30 15 C 45 35 45 75 25 105 L 25 130 L 15 130 L 15 105 C -5 75 -5 35 10 15 Z' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.8'/><!-- Neutral Label I --><circle cx='55' cy='35' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='55' y='38' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text><!-- Upper Layer II: Kerosene (Lighter liquid, Yellowish-orange) --><path d='M 7 40 C 0 55 0 65 4 72 L 36 72 C 40 65 40 55 33 40 Z' fill='#f59e0b' opacity='0.4'/><circle cx='55' cy='58' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='55' y='61' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II</text><!-- Boundary Meniscus Interface --><line x1='4' y1='72' x2='36' y2='72' stroke='#ffffff' stroke-width='1.5'/><!-- Lower Layer III: Water (Denser liquid, Blue) --><path d='M 4 72 C 10 85 18 95 18 105 L 18 115 L 22 115 L 22 105 C 22 95 30 85 36 72 Z' fill='#0284c7' opacity='0.5'/><circle cx='55' cy='88' r='8' fill='#1e293b' stroke='#0284c7' stroke-width='1.5'/><text x='55' y='91' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text><!-- Stopcock / Tap IV --><rect x='12' y='115' width='16' height='6' rx='1' fill='#ef4444'/><line x1='20' y1='112' x2='20' y2='124' stroke='#cbd5e1' stroke-width='2'/><circle cx='-10' cy='118' r='8' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/><text x='-10' y='121' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>IV</text><!-- Delivery Stem Tube --><line x1='18' y1='121' x2='18' y2='145' stroke='#38bdf8' stroke-width='2'/><line x1='22' y1='121' x2='22' y2='145' stroke='#38bdf8' stroke-width='2'/></g><!-- Receiving Conical Flask V below --><g transform='translate(160, 160)'><polygon points='12,10 28,10 38,45 2,45' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/><rect x='4' y='32' width='32' height='12' fill='#0284c7' opacity='0.6'/><circle cx='55' cy='30' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='55' y='33' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>V</text></g><text x='190' y='218' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>SEPARATION OF IMMISCIBLE LIQUIDS (KEROSENE AND WATER) USING SEPARATING FUNNEL</text></svg></div>\n\n(i) Name each of the components labelled I, II, III, IV, and V.\n(ii) State the physical property that allows kerosene and water to be separated using this apparatus.\n(iii) Identify which of the liquid layers II or III represents:\n  (α) Pure water;\n  (β) Kerosene.\n(iv) Outline the practical steps taken by a student to collect layer III completely into flask V without contaminating it with layer II.\n(v) Name one other pair of immiscible liquids that can be separated using this apparatus.",
        "workedSolution": "(i) Identification of components:\n• Part I: **Separating funnel**\n• Part II: **Upper liquid layer (Kerosene)**\n• Part III: **Lower liquid layer (Water)**\n• Part IV: **Stopcock (tap)**\n• Part V: **Receiving conical flask (or beaker)**\n\n(ii) Physical property:\n**Difference in density and immiscibility:** Water and kerosene are immiscible (do not dissolve in each other); water is denser than kerosene, so it forms a distinct bottom layer under gravity.\n\n(iii) Identification of layers:\n• (α) Pure water: **Layer III (lower, denser layer)**\n• (β) Kerosene: **Layer II (upper, less dense layer)**\n\n(iv) Operational steps to separate:\n1. Remove the glass stopper at the top of the separating funnel.\n2. Open stopcock IV carefully, allowing the denser water (III) to drain slowly into flask V.\n3. Close the stopcock promptly the instant the boundary interface reaches the tap.\n4. Replace flask V with a waste beaker to discard the interface zone, then drain the remaining kerosene (II) into a separate clean flask.\n\n(v) Other immiscible liquid pairs:\n**Vegetable oil and water** *(or Petrol and water, Palm oil and water)*.",
        "maxMarks": 10
      },
      {
        "subId": "(c)",
        "prompt": "Figure 1(c) illustrates the external features of a bony fish (Tilapia):\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Tilapia Fish Body Outline --><g transform='translate(35, 25)'><!-- Streamlined Fusiform Body --><path d='M 40 70 C 80 25 200 25 240 70 C 200 115 80 115 40 70 Z' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/><!-- Operculum / Gill Cover I --><path d='M 85 45 C 95 65 95 85 85 95' stroke='#f59e0b' stroke-width='2.5' fill='none'/><circle cx='90' cy='30' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='90' y='33' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>I</text><!-- Eye & Snout --><circle cx='60' cy='60' r='5' fill='#cbd5e1'/><circle cx='60' cy='60' r='2' fill='#0f172a'/><!-- Dorsal Fin II --><path d='M 110 33 L 130 15 L 210 20 L 220 38 Z' fill='#0284c7' opacity='0.4' stroke='#38bdf8' stroke-width='1.5'/><circle cx='165' cy='12' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='165' y='15' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>II</text><!-- Caudal / Tail Fin III --><path d='M 240 70 L 285 35 L 275 70 L 285 105 Z' fill='#0284c7' opacity='0.4' stroke='#ef4444' stroke-width='1.5'/><circle cx='295' cy='70' r='8' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/><text x='295' y='73' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>III</text><!-- Lateral Line System IV --><path d='M 95 68 C 145 68 185 73 235 70' stroke='#10b981' stroke-width='1.8' stroke-dasharray='3,2' fill='none'/><circle cx='165' cy='60' r='8' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/><text x='165' y='63' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>IV</text><!-- Pectoral Fin V --><path d='M 105 75 C 120 70 135 80 125 90 Z' fill='#0284c7' opacity='0.5' stroke='#a855f7' stroke-width='1.5'/><circle cx='118' cy='105' r='8' fill='#1e293b' stroke='#a855f7' stroke-width='1.5'/><text x='118' y='108' font-size='8' font-weight='bold' fill='#a855f7' text-anchor='middle'>V</text><!-- Pelvic Fin Below --><path d='M 135 102 L 145 120 L 155 105 Z' fill='#0284c7' opacity='0.4' stroke='#38bdf8' stroke-width='1.5'/></g><text x='190' y='180' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>EXTERNAL MORPHOLOGY OF A BONY FISH: IDENTIFY STRUCTURES I, II, III, IV, AND V</text></svg></div>\n\n(i) Name the anatomical structures labelled I, II, III, IV, and V.\n(ii) State the specific function performed by:\n  (α) Structure I;\n  (β) Structure III;\n  (γ) Structure IV.\n(iii) State two observable hydrodynamic adaptations of the fish's body that allow it to move through water with minimal resistance.",
        "workedSolution": "(i) Identification of structures:\n• Structure I: **Operculum (gill cover)**\n• Structure II: **Dorsal fin**\n• Structure III: **Caudal fin (tail fin)**\n• Structure IV: **Lateral line system**\n• Structure V: **Pectoral fin**\n\n(ii) Functions of structures:\n• (α) Structure I (Operculum): Protects the delicate internal gill filaments and helps pump water over the gills for respiration.\n• (β) Structure III (Caudal fin): Generates forward propulsive thrust and steers the fish during swimming.\n• (γ) Structure IV (Lateral line): Contains sensory mechanoreceptors that detect water vibrations, currents, and pressure gradients.\n\n(iii) Hydrodynamic adaptations:\n1. **Streamlined Fusiform Body Shape:** Tapered at both ends, reducing water resistance (drag) during swimming.\n2. **Backward-overlapping Mucus-coated Scales:** Provides a smooth, slippery exterior that reduces friction with water.\n3. **Paired Balancing Fins:** Pectoral and pelvic fins control steering, braking, pitch, and balance.",
        "maxMarks": 10
      },
      {
        "subId": "(d)",
        "prompt": "Figure 1(d) illustrates two poultry housing management systems labelled Housing System A and Housing System B:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- System A: Battery Cage System on Left --><g transform='translate(35, 20)'><text x='65' y='12' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Housing System A</text><!-- Wire mesh tiered cage frames --><rect x='10' y='25' width='110' height='40' fill='none' stroke='#cbd5e1' stroke-width='1.5'/><line x1='10' y1='45' x2='120' y2='45' stroke='#64748b' stroke-width='1'/><line x1='45' y1='25' x2='45' y2='65' stroke='#64748b' stroke-width='1'/><line x1='85' y1='25' x2='85' y2='65' stroke='#64748b' stroke-width='1'/><!-- Sloped wire floor for egg rollout --><line x1='10' y1='65' x2='125' y2='75' stroke='#38bdf8' stroke-width='2'/><circle cx='128' cy='74' r='3' fill='#ffffff'/><!-- Lower Tier --><rect x='10' y='80' width='110' height='40' fill='none' stroke='#cbd5e1' stroke-width='1.5'/><line x1='10' y1='120' x2='125' y2='130' stroke='#38bdf8' stroke-width='2'/><circle cx='128' cy='129' r='3' fill='#ffffff'/><!-- Neutral Label A --><circle cx='65' cy='148' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='65' y='151' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>A</text></g><!-- Divider --><line x1='185' y1='20' x2='185' y2='175' stroke='#334155' stroke-width='1.5' stroke-dasharray='4,3'/><!-- System B: Deep Litter Housing System on Right --><g transform='translate(205, 20)'><text x='75' y='12' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Housing System B</text><!-- House Walls & Roof --><path d='M 15 50 L 75 25 L 135 50 L 135 125 L 15 125 Z' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/><!-- Open ventilated wire mesh windows --><rect x='30' y='55' width='90' height='25' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.2'/><line x1='30' y1='67' x2='120' y2='67' stroke='#38bdf8' stroke-width='1'/><!-- Deep Litter floor bed (wood shavings / straw) --><rect x='16' y='110' width='118' height='14' fill='#d97706' opacity='0.5'/><text x='75' y='121' font-size='7' fill='#fef08a' text-anchor='middle'>Dry litter bedding</text><!-- Feed / Drinker trough hanging --><rect x='45' y='90' width='20' height='8' fill='#ef4444' rx='2'/><circle cx='95' cy='94' r='5' fill='#10b981'/><!-- Neutral Label B --><circle cx='75' cy='148' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='75' y='151' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>B</text></g><text x='190' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>POULTRY PRODUCTION SYSTEMS: IDENTIFY HOUSING SYSTEMS A & B</text></svg></div>\n\n(i) Identify each of the poultry housing systems labelled A and B.\n(ii) State two advantages of Housing System A over Housing System B in commercial egg production.\n(iii) State two management practices carried out by poultry farmers to maintain hygienic conditions in Housing System B.\n(iv) State the ingredient added to poultry feed rations to prevent laying hens from laying thin-shelled eggs.",
        "workedSolution": "(i) Identification of housing systems:\n• System A: **Battery cage system**\n• System B: **Deep litter housing system**\n\n(ii) Advantages of System A (Battery Cage):\n1. **Cleaner Eggs:** Eggs roll out onto collection trays immediately after laying, keeping them clean and preventing egg-pecking.\n2. **Better Disease Control:** Birds do not contact their droppings, reducing the spread of internal parasites and coccidiosis.\n3. **Accurate Record Keeping:** Makes it easy to monitor individual feed consumption and identify non-productive hens for culling.\n\n(iii) Management practices for System B (Deep Litter):\n1. Keep litter material dry and loose by raking regularly to prevent caking and excessive ammonia buildup.\n2. Remove and replace wet litter around drinkers promptly to control coccidiosis.\n3. Ensure adequate cross-ventilation through wire mesh windows to maintain dry bedding.\n\n(iv) Feed ingredient:\n**Crushed oyster shells [Oyster shell meal]** *(or Limestone grit / Dicalcium phosphate)* to provide calcium carbonate ($\\text{CaCO}_3$) for strong eggshells.",
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
        "prompt": "(i) List the three modes of heat transfer.\n(ii) Name the type of medium through which each mode listed in (i) primarily takes place.\n(iii) Explain why birds fluff up their feathers during cold, chilly mornings.",
        "workedSolution": "(i) Modes of heat transfer:\n1. **Conduction**\n2. **Convection**\n3. **Radiation**\n\n(ii) Media for each mode:\n• Conduction: Primarily occurs in **solids** (especially metallic conductors).\n• Convection: Occurs in **fluids (liquids and gases)**.\n• Radiation: Does not require a material medium; travels through a **vacuum (empty space)**.\n\n(iii) Why birds fluff up feathers:\nFluffing feathers traps a thick layer of still air between the feathers and the bird's skin. Air is a poor conductor of heat (an insulator), so this trapped air layer reduces heat loss from the bird's body by conduction and convection to the cold surrounding environment.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) Describe how a double-walled vacuum thermos flask minimizes heat loss by:\n  (α) Conduction;\n  (β) Convection;\n  (γ) Radiation.\n(ii) State one practical reason why the stopper of a vacuum flask is made of plastic or cork rather than metal.",
        "workedSolution": "(i) How a thermos flask minimizes heat loss:\n• (α) Conduction: The evacuated vacuum space between the double glass walls contains no material particles, preventing heat conduction between walls.\n• (β) Convection: Because the vacuum space contains no fluid (gas or liquid), convection currents cannot form. The tight stopper prevents warm air from escaping through convection currents.\n• (γ) Radiation: The silvered mirror coating on the inside glass walls reflects radiant infrared heat back into the flask, minimizing radiative heat loss.\n\n(ii) Material for stopper:\nCork and plastic are poor thermal conductors (insulators), whereas metals conduct heat quickly and would allow heat to escape from the liquid inside.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "An electric kettle rated at $2,000.0\\text{ W}$ is used to boil water for $30.0\\text{ minutes}$ each morning.\n(i) Calculate the electrical energy consumed by the kettle in one morning in kilowatt-hours (kWh).\n(ii) If electricity costs 50 pesewas per kWh, calculate the cost of operating the kettle for a 30-day month.",
        "workedSolution": "(i) Daily energy calculation:\nFormula:\n$$\\text{Power in kW} = \\frac{2,000.0\\text{ W}}{1,000} = 2.0\\text{ kW}$$\n$$\\text{Time in hours} = \\frac{30.0\\text{ min}}{60} = 0.5\\text{ hours}$$\n$$\\text{Daily Energy} = \\text{Power} \\times \\text{Time} = 2.0\\text{ kW} \\times 0.5\\text{ h} = 1.0\\text{ kWh}$$\nAnswer: The daily energy consumed is **1.0 kWh**.\n\n(ii) Monthly cost calculation:\n$$\\text{Total Energy for 30 Days} = 1.0\\text{ kWh/day} \\times 30\\text{ days} = 30.0\\text{ kWh}$$\n$$\\text{Cost} = 30.0\\text{ kWh} \\times 0.50\\text{ GHS} = 15.00\\text{ GHS (or 1,500 pesewas)}$$\nAnswer: The monthly operating cost is **GHS 15.00**.",
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
        "prompt": "(i) State the three main classes of rocks based on their mode of formation, giving one example of each.\n(ii) Explain the difference between physical weathering and chemical weathering of rocks.",
        "workedSolution": "(i) Classes of rocks:\n1. **Igneous Rocks:** Formed by the cooling and solidification of molten magma or lava (e.g., Granite, Basalt).\n2. **Sedimentary Rocks:** Formed by the accumulation, compaction, and cementation of mineral sediments and organic debris over time (e.g., Sandstone, Limestone, Shale).\n3. **Metamorphic Rocks:** Formed when pre-existing rocks recrystallize under intense subterranean heat and pressure (e.g., Marble, Slate, Quartzite).\n\n(ii) Physical vs. Chemical Weathering:\n• **Physical Weathering:** Mechanical breakdown of large rocks into smaller fragments without altering their chemical composition (caused by temperature fluctuations, freeze-thaw cycles, or root penetration).\n• **Chemical Weathering:** Decomposition and alteration of the rock's mineral composition through chemical reactions with water, oxygen, and carbon dioxide (e.g., carbonation of limestone, oxidation of iron minerals).",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) Define soil erosion.\n(ii) State three human farming activities that accelerate soil erosion on farmlands.\n(iii) State two agronomic methods used to prevent soil erosion on sloping land.",
        "workedSolution": "(i) Soil Erosion definition:\nSoil erosion is the detachment and washing or blowing away of topsoil by natural agents such as running water and wind.\n\n(ii) Human activities accelerating erosion:\n1. **Deforestation and Clean Weeding:** Removing vegetative cover leaves bare topsoil exposed to direct raindrop impact and surface runoff.\n2. **Bush Burning:** Destroys organic mulch and surface vegetation, exposing the soil.\n3. **Overgrazing:** Livestock consume vegetation and compact the soil with hooves, reducing water infiltration and increasing surface runoff.\n\n(iii) Agronomic methods to prevent erosion:\n1. **Contour Ploughing:** Ploughing across slopes creates ridges that slow down runoff water.\n2. **Cover Cropping:** Planting creeping legumes provides canopy cover that cushions raindrop impact.\n3. **Terracing:** Cutting steep hillsides into stepped horizontal benches to reduce runoff velocity.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "(i) What is crop rotation?\n(ii) State two scientific principles to observe when planning a 4-year crop rotation program.",
        "workedSolution": "(i) Crop Rotation definition:\nCrop rotation is the agricultural practice of growing different crop families sequentially on the same plot of land over seasons according to a definite schedule.\n\n(ii) Principles of crop rotation:\n1. **Include Legumes in the Cycle:** Leguminous crops (such as cowpeas) should alternate with nitrogen-demanding crops to naturally replenish soil nitrates.\n2. **Alternate Rooting Depths:** Deep-rooted crops (like cassava or yam) should follow shallow-rooted crops (like maize or lettuce) to utilize nutrients from different soil layers.\n3. **Vary Crop Families:** Avoid planting crops from the same family sequentially (e.g., do not follow tomatoes with peppers or garden eggs) to break shared pest and disease cycles.",
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
        "prompt": "(i) Name the four primary organs that make up the human urinary system.\n(ii) State the function of:\n  (α) The ureters;\n  (β) The urethra.\n(iii) State three metabolic waste products excreted in human urine.",
        "workedSolution": "(i) Organs of the urinary system:\n1. **Kidneys (left and right)**\n2. **Ureters (two ducts)**\n3. **Urinary bladder**\n4. **Urethra**\n\n(ii) Functions of organs:\n• (α) Ureters: Muscular tubes that convey urine from the renal pelvis of each kidney down to the urinary bladder by peristalsis.\n• (β) Urethra: Duct that discharges urine from the urinary bladder out of the body during urination.\n\n(iii) Metabolic wastes in urine:\n1. **Urea** (from deamination of excess amino acids in the liver)\n2. **Excess water**\n3. **Mineral salts** (excess sodium and potassium chlorides)\n*(Also uric acid and creatinine)*.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) State two daily healthy lifestyle habits that help maintain proper kidney health.\n(ii) State two common signs or symptoms that may indicate kidney dysfunction in an individual.",
        "workedSolution": "(i) Healthy kidney habits:\n1. Drinking adequate clean water daily to assist in flushing metabolic wastes.\n2. Reducing excessive dietary table salt and processed food intake to avoid hypertension.\n3. Avoiding self-medication, especially chronic use of unprescribed analgesics (painkillers).\n4. Exercising regularly to manage healthy blood pressure and blood sugar levels.\n\n(ii) Symptoms of kidney dysfunction:\n1. Swelling (edema) in the feet, ankles, legs, or face due to fluid retention.\n2. Blood in the urine (hematuria) or dark, foamy urine.\n3. Persistent fatigue, weakness, or unexplained loss of appetite.\n4. Drastic changes in urination frequency (urinating much more or much less, especially at night).",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "(i) State the causative organism and method of transmission of:\n  (α) Cholera;\n  (β) Bilharzia (Schistosomiasis).\n(ii) State one effective preventive measure for each disease.",
        "workedSolution": "(i) Causative organisms and transmission:\n• (α) Cholera:\n  - *Causative Organism:* **Vibrio cholerae** (bacterium)\n  - *Transmission:* Ingesting drinking water or food contaminated with human feces from an infected person (fecal-oral route).\n• (β) Bilharzia (Schistosomiasis):\n  - *Causative Organism:* **Schistosoma species** (parasitic blood fluke)\n  - *Transmission:* Bathing, swimming, or wading in freshwater infested with cercariae larvae shed by infected aquatic freshwater snails.\n\n(ii) Preventive measures:\n• For Cholera: Boil drinking water, wash hands thoroughly with soap before eating, and maintain proper community sanitation.\n• For Bilharzia: Avoid swimming, washing, or wading in stagnant freshwater bodies where freshwater snails breed.",
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
        "prompt": "(i) State two factors that affect the pressure exerted by a liquid at rest.\n(ii) Explain why the wall of a large hydroelectric dam is built much thicker at the bottom than at the top.",
        "workedSolution": "(i) Factors affecting liquid pressure:\n1. **Depth of the liquid column ($h$):** Pressure increases directly with depth ($P = \\rho g h$).\n2. **Density of the liquid ($\\rho$):** Denser liquids exert greater pressure at the same depth.\n\n(ii) Why dam walls are thicker at the bottom:\nLiquid pressure increases with depth. The deep water at the bottom of the reservoir exerts much greater hydrostatic pressure against the dam wall than the water near the surface. The base must be built thicker and reinforced with mass concrete to withstand this immense pressure and prevent structural failure.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) State the relationship between Mechanical Advantage ($MA$), Velocity Ratio ($VR$), and percentage Efficiency of a simple machine.\n(ii) A block and tackle pulley system has a Velocity Ratio ($VR$) of 4. If it requires an applied effort force of $250.0\\text{ N}$ to lift a load of $800.0\\text{ N}$, calculate:\n  (α) The Mechanical Advantage ($MA$);\n  (β) The percentage efficiency of the pulley system.",
        "workedSolution": "(i) Machine efficiency formula:\n$$\\text{Efficiency } (\\%) = \\frac{\\text{Mechanical Advantage } (MA)}{\\text{Velocity Ratio } (VR)} \\times 100\\%$$\n\n(ii) Calculations:\n• (α) Mechanical Advantage ($MA$):\n$$MA = \\frac{\\text{Load } (L)}{\\text{Effort } (E)} = \\frac{800.0\\text{ N}}{250.0\\text{ N}} = 3.20$$\nAnswer: Mechanical Advantage is **3.20**.\n\n• (β) Percentage Efficiency:\n$$\\text{Efficiency} = \\frac{MA}{VR} \\times 100\\% = \\frac{3.20}{4.0} \\times 100\\% = 80.0\\%$$\nAnswer: Efficiency is **80.0%**.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "Explain why each of the following cultural practices is important in vegetable production:\n(i) Staking;\n(ii) Mulching.",
        "workedSolution": "(i) Staking:\n• **Importance:** Supports climbing vines and heavy fruit-bearing stems on vertical poles, keeping leaves and fruits off moist ground. This prevents soil-borne fungal infections and fruit rot while improving sunlight capture and air circulation.\n\n(ii) Mulching:\n• **Importance:** Spreading dry straw or leaves over topsoil reduces evaporative water loss, preserves soil moisture, suppresses weed germination, buffers soil temperatures, and adds organic humus upon decomposition.",
        "maxMarks": 6
      }
    ]
  }
];

async function seedBeceMock9Science() {
  console.log('Seeding BECE Integrated Science Mock 9 (Set 140) into dedicated mock_exams/mock_9...');

  const db = await getDb();

  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedMock9P1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Mock 9 Paper 1 Key Distribution across 40 items:', keyDist);

  const docRef = db.doc('global_curriculum/jhs/subjects/science/mock_exams/mock_9');
  await docRef.set({
    mockId: "mock_9",
    title: "BECE Integrated Science Mock 9 (National Standards-Compliant Benchmark Suite)",
    subject: "Integrated Science",
    totalDurationMinutes: 150,
    metadata: {
      isMock: true,
      isMockExam: true,
      setNumber: 140,
      version: "NaCCA JHS Standards-Compliant",
      totalMarks: 140,
      sanitized: true,
      optionsBalanced: true,
      vectorGraphicsCount: 4,
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test (Mock 9)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: balancedMock9P1
    },
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Mock 9)",
      durationMinutes: 105,
      instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2Mock9Questions
    }
  }, { merge: true });

  console.log('✅ Ingestion complete: Set 140 (Mock 9) seeded successfully into mock_exams/mock_9.');
}

seedBeceMock9Science()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Mock 9 Science:', err);
    process.exit(1);
  });
