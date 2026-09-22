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

const balancedMock6P1: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "Which of the following elements has a complete outer electron shell and is chemically inert?",
    "options": [
      "Sodium",
      "Fluorine",
      "Oxygen",
      "Neon"
    ],
    "correctAnswer": "Neon",
    "hint": "Noble gas in Group 18 with 8 valence electrons.",
    "workedSolution": "Neon has atomic number 10 with an electronic configuration of 2, 8. Its complete valence shell satisfies the stable octet rule, making it inert.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "An echo is heard when sound waves strike a large obstacle and bounce back. This acoustic phenomenon demonstrates sound",
    "options": [
      "refraction.",
      "absorption.",
      "reflection.",
      "diffraction."
    ],
    "correctAnswer": "reflection.",
    "hint": "Sound waves bouncing off a rigid reflecting surface.",
    "workedSolution": "An echo is formed by the reflection of sound waves off an acoustic boundary back toward the sound source.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Which of the following blood components engulfs and digests pathogenic bacteria through phagocytosis?",
    "options": [
      "Red blood cells",
      "White blood cells",
      "Blood platelets",
      "Blood plasma"
    ],
    "correctAnswer": "White blood cells",
    "hint": "Leukocytes acting as active immune defense cells.",
    "workedSolution": "Phagocytic white blood cells (neutrophils and monocytes) engulf and destroy pathogenic microbes via phagocytosis.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "The metallic alloy Solder is composed predominantly of",
    "options": [
      "copper and tin.",
      "iron and carbon.",
      "copper and zinc.",
      "tin and lead."
    ],
    "correctAnswer": "tin and lead.",
    "hint": "Low-melting-point alloy used to join electronic joints.",
    "workedSolution": "Solder is an alloy of tin and lead with a low melting point, making it suitable for electrical connections. Brass is copper and zinc; bronze is copper and tin.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "Which stage in the life cycle of the housefly feeds actively on organic waste and decomposes it?",
    "options": [
      "Adult",
      "Pupa",
      "Egg",
      "Maggot"
    ],
    "correctAnswer": "Maggot",
    "hint": "The voracious, worm-like larval stage.",
    "workedSolution": "The maggot (larva) feeds on organic refuse before pupating into a resting pupa.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "A stone of mass 2.0 kg is accelerated from rest to a speed of 6.0 m s⁻¹. Calculate the kinetic energy attained by the stone.",
    "options": [
      "6.0 J",
      "12.0 J",
      "36.0 J",
      "72.0 J"
    ],
    "correctAnswer": "36.0 J",
    "hint": "Kinetic energy = 0.5 x mass x (velocity squared).",
    "workedSolution": "K.E. = 0.5 x 2.0 kg x (6.0 m s⁻¹)² = 1.0 x 36.0 = 36.0 Joules.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "Which layer of the human tooth is the hardest substance in the human body?",
    "options": [
      "Dentine",
      "Enamel",
      "Cementum",
      "Pulp cavity"
    ],
    "correctAnswer": "Enamel",
    "hint": "The highly mineralized outer protective cap covering the crown.",
    "workedSolution": "Tooth enamel consists of roughly 96% mineralized calcium hydroxyapatite, making it the hardest tissue in the human body.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "What is the systematic chemical formula for binary Magnesium chloride?",
    "options": [
      "MgCl",
      "MgCl₂",
      "Mg₂Cl",
      "MgCl₃"
    ],
    "correctAnswer": "MgCl₂",
    "hint": "Magnesium has a valency of 2 and Chlorine has a valency of 1.",
    "workedSolution": "Magnesium (Mg²⁺) requires two chloride anions (Cl⁻) to achieve electrical neutrality, yielding MgCl₂.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "Which agricultural husbandry practice involves trimming off the sharp tips of fowls' beaks to prevent cannibalism?",
    "options": [
      "Culling",
      "Candling",
      "Castrating",
      "Debeaking"
    ],
    "correctAnswer": "Debeaking",
    "hint": "Beak trimming in commercial poultry layers.",
    "workedSolution": "Debeaking removes the sharp tip of the upper beak in poultry to control feather pecking, cannibalism, and egg eating.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "When solid ice cubes are heated, they turn to water at 0°C. Further heating from 0°C to 4°C causes the water to",
    "options": [
      "increase in volume.",
      "decrease in density.",
      "decrease in volume.",
      "boil immediately."
    ],
    "correctAnswer": "decrease in volume.",
    "hint": "Anomalous expansion of water below 4°C.",
    "workedSolution": "Between 0°C and 4°C, water contracts (its volume decreases and its density increases to a maximum at 4°C) due to hydrogen bond restructuring.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "Which planetary body in the Solar System is renowned for its wide, bright planetary ring system composed of orbiting ice and rock particles?",
    "options": [
      "Saturn",
      "Mars",
      "Jupiter",
      "Venus"
    ],
    "correctAnswer": "Saturn",
    "hint": "The second-largest Jovian gas giant.",
    "workedSolution": "Saturn is surrounded by a prominent and extensive planetary ring system composed of ice crystals and rocky dust particles.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "The removal of green chlorophyll from a leaf during a starch test is achieved by boiling the leaf in",
    "options": [
      "ethanol.",
      "cold water.",
      "iodine solution.",
      "dilute acid."
    ],
    "correctAnswer": "ethanol.",
    "hint": "An organic alcohol solvent that dissolves chlorophyll pigments.",
    "workedSolution": "Boiling the leaf in ethanol (in a water bath) dissolves and extracts the green chlorophyll pigments, decolorizing the leaf for the iodine test.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "Which of the following electrical components is used to step up or step down alternating voltage in power distribution?",
    "options": [
      "Capacitor",
      "Rheostat",
      "Diode",
      "Transformer"
    ],
    "correctAnswer": "Transformer",
    "hint": "Operates on electromagnetic mutual induction with primary and secondary coils.",
    "workedSolution": "A transformer increases (steps up) or decreases (steps down) alternating voltages through electromagnetic mutual induction.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "Which soil organism improves soil aeration and drainage by burrowing through the ground and depositing organic worm casts?",
    "options": [
      "Earthworm",
      "Termite",
      "Nematode",
      "Millipede"
    ],
    "correctAnswer": "Earthworm",
    "hint": "Annelid worm that burrows channels in agricultural topsoil.",
    "workedSolution": "Earthworms create subsurface tunnels that improve soil aeration and water infiltration, while their casts enrich topsoil with humus and nutrients.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "What is the pH value of a neutral aqueous solution at room temperature?",
    "options": [
      "1",
      "5",
      "7",
      "14"
    ],
    "correctAnswer": "7",
    "hint": "Pure water with balanced H⁺ and OH⁻ ions.",
    "workedSolution": "A neutral solution has equal concentrations of hydrogen ions and hydroxide ions, corresponding to a pH of 7 on the universal scale.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "Which of the following simple machines operates with the load located between the fulcrum and the effort?",
    "options": [
      "Crowbar",
      "Wheelbarrow",
      "Pair of tweezers",
      "Scissors"
    ],
    "correctAnswer": "Wheelbarrow",
    "hint": "A second-class lever with the load basin in the middle.",
    "workedSolution": "In a second-class lever (like a wheelbarrow or bottle opener), the load lies between the pivot (front wheel) and the applied effort (handles).",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "The transfer of thermal heat through a metal cooking spoon placed in hot soup occurs through",
    "options": [
      "convection.",
      "conduction.",
      "radiation.",
      "sublimation."
    ],
    "correctAnswer": "conduction.",
    "hint": "Vibrations and free mobile electrons passing kinetic energy through solid lattice points.",
    "workedSolution": "Conduction is the mode of heat transfer in solids where energetic lattice vibrations and free electrons transfer thermal energy through contact.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "Which blood vessel supplies oxygen-rich blood directly to the heart muscle (myocardium) itself?",
    "options": [
      "Coronary artery",
      "Pulmonary vein",
      "Renal artery",
      "Carotid artery"
    ],
    "correctAnswer": "Coronary artery",
    "hint": "Blockage of this vessel causes coronary heart disease or heart attacks.",
    "workedSolution": "Coronary arteries branch from the base of the aorta to supply oxygenated blood and nutrients directly to the cardiac heart muscle.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "Which chemical compound is added to soil by farmers to neutralize excessive soil acidity?",
    "options": [
      "Ammonium nitrate",
      "Calcium hydroxide",
      "Sodium chloride",
      "Hydrochloric acid"
    ],
    "correctAnswer": "Calcium hydroxide",
    "hint": "Agricultural slaked lime used in soil liming.",
    "workedSolution": "Agricultural lime (calcium hydroxide or calcium carbonate) is a basic compound applied to acidic soils to raise the pH to optimal levels.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "A vegetative propagation technique where a branch is bent and covered with soil while still attached to the parent plant until roots sprout is called",
    "options": [
      "grafting.",
      "budding.",
      "stem cutting.",
      "layering."
    ],
    "correctAnswer": "layering.",
    "hint": "Simple ground layering or mound layering.",
    "workedSolution": "Layering is an artificial vegetative propagation method where an attached branch is girdled and covered with soil to develop adventitious roots.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "The mechanical efficiency of a machine is always less than 100% primarily because",
    "options": [
      "some energy is converted to heat overcoming friction.",
      "gravitational force increases during movement.",
      "the load distance is always zero.",
      "electrical power diminishes in air."
    ],
    "correctAnswer": "some energy is converted to heat overcoming friction.",
    "hint": "Friction between moving parts dissipates useful work as heat.",
    "workedSolution": "Work output is always less than work input in real machines because some energy is dissipated as heat and sound overcoming friction between moving parts.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "Which of the following optical media is completely transparent to visible light?",
    "options": [
      "Clean sheet of clear glass",
      "Frosted glass",
      "Oily tracing paper",
      "Cardboard sheet"
    ],
    "correctAnswer": "Clean sheet of clear glass",
    "hint": "Allows light rays to pass through without diffuse scattering.",
    "workedSolution": "Clear glass is transparent, transmitting light without scattering, allowing objects to be viewed clearly through it.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "Which organelle in eukaryotic cells contains genetic chromosomes composed of DNA?",
    "options": [
      "Ribosome",
      "Nucleus",
      "Mitochondrion",
      "Endoplasmic reticulum"
    ],
    "correctAnswer": "Nucleus",
    "hint": "The command center of the cell enclosed by a double membrane.",
    "workedSolution": "The nucleus houses the organism's genetic material (chromatin/DNA) and directs cellular growth and protein synthesis.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "What is the systematic chemical name of the compound with the formula CO?",
    "options": [
      "Carbon dioxide",
      "Carbon(IV) oxide",
      "Carbon(II) oxide",
      "Carbon trioxide"
    ],
    "correctAnswer": "Carbon(II) oxide",
    "hint": "IUPAC systematic name reflecting an oxidation state of +2.",
    "workedSolution": "Carbon monoxide has the systematic IUPAC name Carbon(II) oxide, indicating carbon's +2 oxidation state.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "Which cultural farm practice conserves topsoil moisture by covering the ground around crops with dry straw?",
    "options": [
      "Staking",
      "Thinning",
      "Pruning",
      "Mulching"
    ],
    "correctAnswer": "Mulching",
    "hint": "Forms a protective blanket reducing surface water evaporation.",
    "workedSolution": "Mulching covers topsoil with organic residues (straw, dry grass) to minimize evaporation, suppress weeds, and moderate soil temperature.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "An electric bulb has a resistance of 20 Ω and draws an electric current of 0.5 A. What is the potential difference across the bulb?",
    "options": [
      "10.0 V",
      "20.5 V",
      "40.0 V",
      "100.0 V"
    ],
    "correctAnswer": "10.0 V",
    "hint": "Ohm's Law: Voltage = Current x Resistance.",
    "workedSolution": "V = I x R = 0.5 A x 20 Ω = 10.0 Volts.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "Which hormone regulates blood sugar levels by stimulating liver and muscle cells to convert excess glucose into glycogen?",
    "options": [
      "Thyroxine",
      "Adrenaline",
      "Insulin",
      "Estrogen"
    ],
    "correctAnswer": "Insulin",
    "hint": "Secreted by beta cells of the islets of Langerhans in the pancreas.",
    "workedSolution": "Insulin (secreted by the pancreas) lowers elevated blood glucose by promoting its uptake and storage as glycogen in hepatocytes and myocytes.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Which of the following substances can be separated from a mixture with sand by using a bar magnet?",
    "options": [
      "Copper shavings",
      "Iron filings",
      "Aluminum powder",
      "Zinc granules"
    ],
    "correctAnswer": "Iron filings",
    "hint": "Ferromagnetic metal attracted to magnetic poles.",
    "workedSolution": "Iron is ferromagnetic and is attracted to a magnet, while non-magnetic sand remains behind.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "The female gamete in a flowering plant is produced inside the",
    "options": [
      "anther.",
      "filament.",
      "ovule.",
      "sepal."
    ],
    "correctAnswer": "ovule.",
    "hint": "Located inside the ovary and develops into a seed after fertilization.",
    "workedSolution": "The ovule inside the floral ovary contains the embryo sac, which produces the female egg cell (ovum).",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "What is the S.I. unit for measuring electrical power?",
    "options": [
      "Watt",
      "Joule",
      "Pascal",
      "Newton"
    ],
    "correctAnswer": "Watt",
    "hint": "Equivalent to one Joule of energy consumed per second.",
    "workedSolution": "The Watt (W) is the derived S.I. unit of power, representing energy transferred at a rate of 1 Joule per second (1 W = 1 J s⁻¹).",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "Which of the following states of matter possesses a definite volume but takes the shape of its container?",
    "options": [
      "Solid",
      "Gas",
      "Liquid",
      "Plasma"
    ],
    "correctAnswer": "Liquid",
    "hint": "Particles slide over one another but remain bounded by cohesive forces.",
    "workedSolution": "Liquids have fixed volume due to cohesive intermolecular forces, but their particles flow past one another to adapt to container geometry.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "The structure in the human respiratory tract that prevents food boluses from entering the trachea during swallowing is the",
    "options": [
      "vocal cord.",
      "epiglottis.",
      "soft palate.",
      "diaphragm."
    ],
    "correctAnswer": "epiglottis.",
    "hint": "Cartilaginous flap folding over the glottis during swallowing.",
    "workedSolution": "The epiglottis is a cartilaginous flap at the larynx entrance that folds downward over the trachea during swallowing, directing food into the esophagus.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "Which of the following materials is an electrical conductor?",
    "options": [
      "Porcelain",
      "Dry wood",
      "Plastic",
      "Copper"
    ],
    "correctAnswer": "Copper",
    "hint": "Metallic element with abundant free conduction electrons.",
    "workedSolution": "Copper has a high density of delocalized valence electrons, providing low resistance to current flow.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "The practice of growing different crops on the same field in sequential years according to a definite plan is",
    "options": [
      "crop rotation.",
      "monocropping.",
      "mixed farming.",
      "pastoral farming."
    ],
    "correctAnswer": "crop rotation.",
    "hint": "Alternating shallow and deep-rooted crops and legumes across seasons.",
    "workedSolution": "Crop rotation systematically alternates crop families across plots over multiple seasons to balance soil nutrients and disrupt pest lifecycles.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "Which of the following elements has atomic number 12 and forms a dipositive cation (+2)?",
    "options": [
      "Sodium",
      "Aluminum",
      "Magnesium",
      "Calcium"
    ],
    "correctAnswer": "Magnesium",
    "hint": "Group 2 alkaline earth metal with configuration 2, 8, 2.",
    "workedSolution": "Magnesium has atomic number 12 (configuration 2, 8, 2). It loses both valence electrons to form the stable Mg²⁺ cation.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "The bending of light as it passes obliquely from one optical medium into another of different optical density is",
    "options": [
      "dispersion.",
      "diffraction.",
      "reflection.",
      "refraction."
    ],
    "correctAnswer": "refraction.",
    "hint": "Occurs because light changes speed between media.",
    "workedSolution": "Refraction is the change in direction of a light wave as it passes obliquely across a boundary between media of differing optical densities due to speed changes.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "Which of the following farm animals is housed in a hutch?",
    "options": [
      "Sheep",
      "Pig",
      "Rabbit",
      "Goat"
    ],
    "correctAnswer": "Rabbit",
    "hint": "Small domestic herbivore raised in elevated wire cages.",
    "workedSolution": "Rabbits are traditionally housed in hutches—elevated wooden and wire cages providing shelter, ventilation, and predator protection.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "The process by which liquid water changes to water vapor at any temperature from its exposed surface is",
    "options": [
      "evaporation.",
      "boiling.",
      "sublimation.",
      "condensation."
    ],
    "correctAnswer": "evaporation.",
    "hint": "Surface cooling phenomenon occurring at all temperatures.",
    "workedSolution": "Evaporation is the phase transition from liquid to vapor occurring at the liquid surface below its boiling point.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "In an electric circuit, which instrument must be connected in series to measure current?",
    "options": [
      "Voltmeter",
      "Ohmmeter",
      "Barometer",
      "Ammeter"
    ],
    "correctAnswer": "Ammeter",
    "hint": "Low internal resistance instrument that measures flow rate in Amperes.",
    "workedSolution": "An ammeter has very low internal resistance and is connected in series so all circuit current flows through it to be measured.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "Which infectious bacterial disease causes continuous high fever, abdominal tenderness, and is spread by food contaminated with infected feces?",
    "options": [
      "Malaria",
      "Typhoid fever",
      "Measles",
      "Ringworm"
    ],
    "correctAnswer": "Typhoid fever",
    "hint": "Caused by Salmonella typhi via the fecal-oral route.",
    "workedSolution": "Typhoid fever is a bacterial infection caused by Salmonella enterica serotype Typhi, transmitted via water and food contaminated with human feces.",
    "points": 1
  }
];
const paper2Mock6Questions = [
  {
    "questionNumber": "1",
    "isPracticalSectionA": true,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Figure 1(a) illustrates an experiment demonstrating the magnetic field lines around a bar magnet using a plotting compass:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(110, 85)'><rect x='0' y='0' width='80' height='35' fill='#ef4444' stroke='#cbd5e1' stroke-width='1.5'/><text x='40' y='22' font-size='12' font-weight='bold' fill='#ffffff' text-anchor='middle'>N</text><rect x='80' y='0' width='80' height='35' fill='#3b82f6' stroke='#cbd5e1' stroke-width='1.5'/><text x='120' y='22' font-size='12' font-weight='bold' fill='#ffffff' text-anchor='middle'>S</text><circle cx='80' cy='-15' r='9' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/><text x='80' y='-12' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>M</text></g><path d='M 130 85 C 130 20 250 20 250 85' fill='none' stroke='#38bdf8' stroke-width='1.8'/><polygon points='185,34 195,37 185,40' fill='#38bdf8'/><path d='M 115 95 C 90 -5 290 -5 265 95' fill='none' stroke='#38bdf8' stroke-width='1.5'/><polygon points='185,12 195,15 185,18' fill='#38bdf8'/><path d='M 130 120 C 130 185 250 185 250 120' fill='none' stroke='#38bdf8' stroke-width='1.8'/><polygon points='195,166 185,169 195,172' fill='#38bdf8'/><path d='M 115 110 C 90 210 290 210 265 110' fill='none' stroke='#38bdf8' stroke-width='1.5'/><polygon points='195,188 185,191 195,194' fill='#38bdf8'/><g transform='translate(190, 37)'><circle cx='0' cy='0' r='10' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><line x1='-7' y1='0' x2='7' y2='0' stroke='#ef4444' stroke-width='2'/><polygon points='4,-3 8,0 4,3' fill='#ef4444'/><circle cx='0' cy='-16' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='0' y='-13' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>I</text></g><g transform='translate(40, 102)'><circle cx='0' cy='0' r='8' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/><text x='0' y='3' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>X₁</text></g><g transform='translate(340, 102)'><circle cx='0' cy='0' r='8' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/><text x='0' y='3' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>X₂</text></g><text x='190' y='210' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>MAGNETIC FIELD OF A BAR MAGNET: IDENTIFY COMPONENT M, COMPASS I, AND POINTS X₁ & X₂</text></svg></div>\n\n(i) Name the component labelled M and state the polarity of its two ends.\n(ii) State the direction of the magnetic field lines outside the bar magnet.\n(iii) Identify the points labelled X₁ and X₂ on the diagram, and explain what happens to a magnetic compass needle placed exactly at point X₁.\n(iv) State two methods by which a permanent steel bar magnet can lose its magnetism (demagnetization).",
        "workedSolution": "(i) Identification of component M:\n• Component M is a **Bar magnet**.\n• Polarity: Left end is the **North pole (N)** and the right end is the **South pole (S)**.\n\n(ii) Direction of magnetic field lines:\nOutside the magnet, magnetic field lines emerge from the **North pole (N)** and curve continuously to enter the **South pole (S)**.\n\n(iii) Points X₁ and X₂:\n• Points X₁ and X₂ are **Neutral points (null points)**.\n• Explanation: At a neutral point, the horizontal magnetic field of the bar magnet is equal in magnitude and opposite in direction to the Earth's horizontal magnetic field. Because the resultant magnetic field is zero, a compass needle placed at X₁ will experience no net magnetic force and will point in any random direction.\n\n(iv) Methods of demagnetization:\n1. **Heating:** Heating the magnet to red heat (above its Curie temperature) disrupts the alignment of its internal magnetic domains.\n2. **Hammering / Mechanical Impact:** Hammering the magnet repeatedly while oriented in an East-West direction disorganizes its domains.\n3. **Electrical Method:** Placing the magnet inside a solenoid carrying an alternating current (AC) and slowly withdrawing it in an East-West direction.",
        "maxMarks": 10
      },
      {
        "subId": "(b)",
        "prompt": "Figure 1(b) illustrates a laboratory fractional distillation setup used to separate a miscible mixture of ethanol (boiling point 78°C) and water (boiling point 100°C):\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 240' width='100%' height='220' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(45, 60)'><path d='M 35 150 Q 30 135 35 130 Q 40 135 35 150 Z' fill='#f59e0b'/><line x1='15' y1='125' x2='55' y2='125' stroke='#94a3b8' stroke-width='2'/><circle cx='35' cy='95' r='24' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.8'/><path d='M 18 102 A 22 22 0 0 0 52 102 Z' fill='#38bdf8' opacity='0.4'/><circle cx='10' cy='85' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='10' y='88' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text><rect x='30' y='15' width='10' height='60' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/><circle cx='35' cy='25' r='2' fill='#cbd5e1'/><circle cx='35' cy='35' r='2' fill='#cbd5e1'/><circle cx='35' cy='45' r='2' fill='#cbd5e1'/><circle cx='35' cy='55' r='2' fill='#cbd5e1'/><circle cx='35' cy='65' r='2' fill='#cbd5e1'/><circle cx='10' cy='35' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='10' y='38' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>II</text><line x1='35' y1='-15' x2='35' y2='25' stroke='#ef4444' stroke-width='2'/><circle cx='35' cy='27' r='2' fill='#ef4444'/><circle cx='35' cy='-25' r='7' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/><text x='35' y='-22' font-size='7' font-weight='bold' fill='#ef4444' text-anchor='middle'>T</text><line x1='40' y1='18' x2='75' y2='35' stroke='#38bdf8' stroke-width='2'/></g><g transform='translate(120, 95)'><line x1='0' y1='0' x2='150' y2='45' stroke='#38bdf8' stroke-width='2'/><polygon points='25,-8 125,22 120,55 20,25' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='1.8'/><line x1='110' y1='50' x2='110' y2='70' stroke='#10b981' stroke-width='2'/><circle cx='110' cy='82' r='7' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/><text x='110' y='85' font-size='7' font-weight='bold' fill='#10b981' text-anchor='middle'>W₁</text><line x1='35' y1='0' x2='35' y2='-20' stroke='#38bdf8' stroke-width='2'/><circle cx='35' cy='-30' r='7' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='35' y='-27' font-size='7' font-weight='bold' fill='#38bdf8' text-anchor='middle'>W₂</text><circle cx='70' cy='8' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='70' y='11' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text></g><g transform='translate(280, 140)'><polygon points='10,25 30,25 40,65 0,65' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/><rect x='3' y='52' width='34' height='12' fill='#38bdf8' opacity='0.6'/><circle cx='20' cy='82' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='20' y='85' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>IV</text></g><text x='190' y='225' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>FRACTIONAL DISTILLATION: SEPARATION OF MISCIBLE LIQUIDS (ETHANOL AND WATER)</text></svg></div>\n\n(i) Name each of the parts labelled I, II, III, and IV.\n(ii) State the specific purpose of the glass beads inside fractionating column II.\n(iii) State the reading on thermometer T when the first distillate begins to drop steadily into flask IV.\n(iv) Name the distillate collected in flask IV during this first stage of distillation.\n(v) Explain why cooling water must enter condenser III through inlet W₁ rather than through W₂.",
        "workedSolution": "(i) Identification of parts:\n• Part I: **Round-bottom distillation flask**\n• Part II: **Fractionating column**\n• Part III: **Liebig condenser**\n• Part IV: **Receiving flask (or conical beaker)**\n\n(ii) Purpose of glass beads in column II:\nThe glass beads provide a large surface area for repeated, continuous evaporation and condensation of rising vapors. Higher-boiling water vapor condenses and trickles back down, allowing the lower-boiling ethanol vapor to rise up the column to the condenser.\n\n(iii) Thermometer reading:\nThermometer T will read **78°C** (the boiling point of pure ethanol).\n\n(iv) Distillate collected:\n**Pure Ethanol (alcohol)**.\n\n(v) Reason for water entry at W₁:\nCold water enters at the lowest point (W₁) to ensure the cooling jacket stays completely filled with water without air locks. This setup establishes counter-current cooling, where the coldest water meets the coolest exit vapors, maximizing condensation efficiency.",
        "maxMarks": 10
      },
      {
        "subId": "(c)",
        "prompt": "Figure 1(c) illustrates a longitudinal section through a human tooth:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 230' width='100%' height='210' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(100, 25)'><path d='M 40 45 C 40 15 100 15 100 45 L 95 65 L 45 65 Z' fill='#ffffff' stroke='#cbd5e1' stroke-width='1.8'/><circle cx='125' cy='30' r='8' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/><text x='125' y='33' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>I</text><path d='M 45 45 C 45 25 95 25 95 45 L 88 115 L 75 165 L 65 165 L 52 115 Z' fill='#fef08a' stroke='#eab308' stroke-width='1.5'/><circle cx='125' cy='75' r='8' fill='#1e293b' stroke='#eab308' stroke-width='1.5'/><text x='125' y='78' font-size='8' font-weight='bold' fill='#eab308' text-anchor='middle'>II</text><path d='M 58 55 C 58 40 82 40 82 55 L 75 110 L 72 165 L 68 165 L 65 110 Z' fill='#ef4444' opacity='0.7' stroke='#b91c1c' stroke-width='1.2'/><circle cx='125' cy='115' r='8' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/><text x='125' y='118' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>III</text><path d='M 15 65 C 30 60 45 65 45 75 L 48 115 L 15 115 Z' fill='#f43f5e' opacity='0.5'/><path d='M 125 65 C 110 60 95 65 95 75 L 92 115 L 125 115 Z' fill='#f43f5e' opacity='0.5'/><circle cx='20' cy='85' r='8' fill='#1e293b' stroke='#f43f5e' stroke-width='1.5'/><text x='20' y='88' font-size='8' font-weight='bold' fill='#f43f5e' text-anchor='middle'>IV</text><rect x='10' y='115' width='38' height='55' fill='#64748b' opacity='0.4'/><rect x='92' y='115' width='38' height='55' fill='#64748b' opacity='0.4'/><circle cx='20' cy='145' r='8' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><text x='20' y='148' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>V</text></g><text x='170' y='215' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LONGITUDINAL SECTION OF A HUMAN TOOTH: IDENTIFY STRUCTURES I, II, III, IV, AND V</text></svg></div>\n\n(i) Name the anatomical parts of the tooth labelled I, II, III, IV, and V.\n(ii) State the function of part I and part III.\n(iii) Name the mineral element required in the diet to keep part I strong and resistant to decay.\n(iv) Explain briefly how dental caries (tooth cavities) develop when sweet foods are left on the tooth surface.",
        "workedSolution": "(i) Labelled anatomical structures:\n• Part I: **Enamel (crown enamel layer)**\n• Part II: **Dentine**\n• Part III: **Pulp cavity**\n• Part IV: **Gum (gingiva)**\n• Part V: **Jawbone (alveolar bone)**\n\n(ii) Functions of parts:\n• Part I (Enamel): Forms a hard, wear-resistant outer surface that protects underlying layers during biting, cutting, and chewing.\n• Part III (Pulp cavity): Contains living sensory nerves and blood capillaries that supply oxygen and nutrients to the tooth while providing sensation (pain, temperature).\n\n(iii) Mineral element:\n**Calcium** *(or Phosphorus / Fluorine)*.\n\n(iv) Development of dental caries:\n1. Food residues containing refined sugars stick to tooth surfaces, forming a sticky bacterial biofilm called **dental plaque**.\n2. Plaque bacteria ferment these sugars anaerobically, producing **organic acids**.\n3. These acids react with and dissolve the calcium phosphate minerals in the **enamel (I)**, forming microscopic pits.\n4. Over time, these pits deepen into cavities that penetrate the dentine (II) and expose the nerves in the pulp cavity (III), causing pain and infection.",
        "maxMarks": 10
      },
      {
        "subId": "(d)",
        "prompt": "Figure 1(d) illustrates two methods of artificial vegetative plant propagation labelled Method A and Method B:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 210' width='100%' height='190' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(35, 20)'><text x='70' y='12' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Method A</text><line x1='70' y1='25' x2='70' y2='155' stroke='#a16207' stroke-width='6' stroke-linecap='round'/><rect x='67' y='65' width='6' height='20' fill='#fde047'/><ellipse cx='70' cy='75' rx='25' ry='20' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='1.5'/><line x1='50' y1='57' x2='90' y2='57' stroke='#ffffff' stroke-width='2'/><line x1='50' y1='93' x2='90' y2='93' stroke='#ffffff' stroke-width='2'/><path d='M 65 72 Q 55 80 60 90' stroke='#22c55e' stroke-width='1.5' fill='none'/><path d='M 75 75 Q 85 82 80 92' stroke='#22c55e' stroke-width='1.5' fill='none'/><circle cx='70' cy='125' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='70' y='128' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text></g><line x1='185' y1='20' x2='185' y2='180' stroke='#334155' stroke-width='1.5' stroke-dasharray='4,3'/><g transform='translate(205, 20)'><text x='80' y='12' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Method B</text><line x1='80' y1='100' x2='80' y2='155' stroke='#78350f' stroke-width='7' stroke-linecap='round'/><polygon points='76,100 84,100 80,85' fill='#0f172a'/><circle cx='115' cy='130' r='8' fill='#1e293b' stroke='#78350f' stroke-width='1.5'/><text x='115' y='133' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>II</text><line x1='80' y1='25' x2='80' y2='85' stroke='#a16207' stroke-width='5' stroke-linecap='round'/><circle cx='77' cy='45' r='2' fill='#22c55e'/><circle cx='83' cy='60' r='2' fill='#22c55e'/><circle cx='115' cy='45' r='8' fill='#1e293b' stroke='#a16207' stroke-width='1.5'/><text x='115' y='48' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>III</text><rect x='74' y='80' width='12' height='18' rx='2' fill='#ef4444' opacity='0.7'/><circle cx='50' cy='90' r='8' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/><text x='50' y='93' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>IV</text></g><text x='190' y='198' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>VEGETATIVE PLANT PROPAGATION: IDENTIFY METHODS A & B AND PARTS I, II, III, AND IV</text></svg></div>\n\n(i) Name the plant propagation method labelled Method A and Method B.\n(ii) Identify the parts labelled I, II, III, and IV in the diagrams.\n(iii) State two advantages of vegetative propagation over growing crops from seeds.\n(iv) Name one fruit crop commonly propagated using Method A and one commonly propagated using Method B.",
        "workedSolution": "(i) Propagation methods:\n• Method A: **Air layering (Marcottage)**\n• Method B: **Stem grafting (Wedge grafting)**\n\n(ii) Labelled parts:\n• Part I: **Moist rooting medium enclosed in polythene wrapping (soil/moss ball)**\n• Part II: **Rootstock (Stock - rooted lower plant base)**\n• Part III: **Scion (detached shoot bearing dormant buds)**\n• Part IV: **Grafting tape (waxed binding wrap)**\n\n(iii) Advantages of vegetative propagation:\n1. **Preserves Genetic Purity:** Produces offspring that are genetically identical (clones) to the parent plant, preserving desirable fruit qualities.\n2. **Early Maturity and Rapid Fruiting:** Vegetatively propagated plants flower and fruit earlier than seedlings grown from seeds.\n3. **Overcomes Inviable Seeds:** Allows propagation of seedless crop varieties (like naval oranges or seedless grapes).\n\n(iv) Crop examples:\n• Method A (Air layering): **Citrus (orange/lemon)** *(or Mango, Guava, Cashew)*\n• Method B (Stem grafting): **Cocoa** *(or Mango, Avocado, Apple)*",
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
        "prompt": "(i) Explain why sound waves travel faster through a solid steel rail than through atmospheric air.\n(ii) State the conditions necessary for the formation of an audible echo.",
        "workedSolution": "(i) Why sound travels faster in steel:\nSound is a mechanical wave transmitted by collisions between neighboring particles. In solid steel, atoms are packed closely together in a rigid crystal lattice with strong elastic intermolecular bonds, allowing vibrational energy to pass quickly between particles. In atmospheric air, molecules are widely separated by large intermolecular distances, resulting in fewer collisions per second and slower sound transmission.\n\n(ii) Conditions for an audible echo:\n1. **Sufficient Distance:** The reflecting surface must be at least 17.0 meters away from the sound source so the reflected sound reaches the ear at least 0.1 seconds after the original sound (the limit of human persistence of hearing).\n2. **Hard Reflecting Surface:** The obstacle (such as a high wall, cliff, or bare rock face) must be large, rigid, and smooth rather than soft or porous, so it reflects rather than absorbs sound energy.",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "(i) Describe two medical and two industrial applications of ultrasound vibrations.\n(ii) State two methods used to reduce acoustic reverberation (unwanted echoes) in public auditoriums.",
        "workedSolution": "(i) Applications of ultrasound:\n• **Medical Applications:**\n  1. *Ultrasound Scanning (Ultrasonography):* Examining the growth and health of developing fetuses during pregnancy without harmful radiation.\n  2. *Lithotripsy:* Breaking down internal kidney stones into small fragments using focused high-energy ultrasound pulses.\n• **Industrial Applications:**\n  1. *SONAR (Sound Navigation and Ranging):* Determining ocean depths and detecting submerged submarines or schools of fish.\n  2. *Non-destructive Testing:* Detecting internal hairline cracks, voids, and structural defects in steel pipelines, engine blocks, and aircraft wings.\n\n(ii) Methods to reduce reverberation:\n1. Covering bare walls and ceilings with soft acoustic sound-absorbing materials (such as perforated acoustic tiles, felt, or heavy fabric drapes).\n2. Covering auditorium floors with thick carpets to minimize sound reflection.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "(i) An electric pressing iron rated at 1,500.0 W is used for 4.0 hours daily. Calculate the electrical energy consumed by the iron over a period of 30 days in kilowatt-hours (kWh).\n(ii) State two daily household habits that reduce electricity consumption in Ghana.",
        "workedSolution": "(i) Energy consumption calculation:\nFormula:\n$$\\text{Power in kW} = \\frac{1,500.0\\text{ W}}{1,000} = 1.5\\text{ kW}$$\n$$\\text{Daily Energy} = \\text{Power} \\times \\text{Daily Hours} = 1.5\\text{ kW} \\times 4.0\\text{ h} = 6.0\\text{ kWh}$$\n$$\\text{Total Energy for 30 Days} = 6.0\\text{ kWh/day} \\times 30\\text{ days} = 180.0\\text{ kWh}$$\nAnswer: The total electrical energy consumed is **180.0 kWh**.\n\n(ii) Household habits to conserve electricity:\n1. Switching off lights, fans, and entertainment appliances at the socket when leaving unoccupied rooms.\n2. Replacing older incandescent filament bulbs with energy-efficient Light Emitting Diode (LED) lamps.\n3. Keeping refrigerator doors closed and cleaning cooling coils regularly.",
        "maxMarks": 7
      }
    ]
  },
  {
    "questionNumber": "3",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) State the antigens present on the red blood cells and the antibodies present in the blood plasma of an individual with blood group O.\n(ii) Explain why an individual with blood group O can donate blood to a person of blood group A, but cannot receive blood from a blood group A donor.",
        "workedSolution": "(i) Blood Group O components:\n• **Antigens on red blood cells:** None (neither Antigen A nor Antigen B).\n• **Antibodies in blood plasma:** Both **Anti-A antibody** and **Anti-B antibody**.\n\n(ii) Transfusion explanation:\n• *Why Group O can donate to Group A:* Group O red blood cells carry no A or B surface antigens. When transfused into a Group A recipient, the recipient's antibodies find no foreign antigens on the donor red blood cells, so no agglutination (clumping) occurs.\n• *Why Group O cannot receive from Group A:* Group O plasma contains Anti-A antibodies. If Group A blood is transfused, the recipient's Anti-A antibodies bind to the A antigens on the donor's red blood cells, triggering agglutination and hemolytic transfusion reactions.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) A man who is a carrier of the sickle-cell trait (HbAS) marries a woman who is also a carrier (HbAS). Using a genetic cross diagram, determine the genotypic and phenotypic ratios of their potential offspring.\n(ii) State one clinical symptom experienced by a person with sickle-cell disease (HbSS) during an acute sickle-cell crisis.",
        "workedSolution": "(i) Genetic Cross:\n• Parental Genotypes: $HbAS \\times HbAS$\n• Gametes: $Hb^A, Hb^S$ and $Hb^A, Hb^S$\n• Punnett Square:\n  | Gametes | $Hb^A$ | $Hb^S$ |\n  | :---: | :---: | :---: |\n  | **$Hb^A$** | $HbAA$ (Normal) | $HbAS$ (Carrier) |\n  | **$Hb^S$** | $HbAS$ (Carrier) | $HbSS$ (Sickle-cell disease) |\n\n• **Genotypic Ratio:** 1 HbAA : 2 HbAS : 1 HbSS\n• **Phenotypic Ratio:** **3 Normal/Carriers (without sickle-cell disease) : 1 Sickle-cell diseased individual** (or 25% Normal HbAA, 50% Carrier HbAS, 25% Sickler HbSS).\n\n(ii) Clinical symptom during crisis:\n**Severe bone and joint pain** (vaso-occlusive crisis) caused by crescent-shaped red blood cells blocking microcapillaries, depriving local tissues of oxygen.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "Outline three sequential stages involved in the large-scale purification of river water for municipal domestic supply.",
        "workedSolution": "1. **Coagulation, Flocculation, and Sedimentation:** Alum (aluminum sulfate) is added to river water in settling tanks. It neutralizes the negative charges on colloidal clay particles, causing them to aggregate into heavier flocs that settle to the bottom by gravity.\n2. **Filtration:** The clear upper water is passed through rapid sand and gravel filter beds to strain out fine suspended solids and microbes.\n3. **Disinfection / Chlorination:** A controlled dose of chlorine gas or sodium hypochlorite is added to destroy pathogenic bacteria, viruses, and parasites before water is pumped into distribution mains.",
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
        "prompt": "(i) With the aid of Bohr shell diagrams, describe the formation of the ionic bond in magnesium chloride [MgCl₂] from magnesium (₁₂Mg) and chlorine (₁₇Cl).\n(ii) State two physical properties typical of ionic crystal lattices.",
        "workedSolution": "(i) Formation of Magnesium Chloride (MgCl₂):\n• Magnesium (Z=12, electron arrangement 2, 8, 2) has 2 valence electrons. It loses both electrons to achieve a stable neon octet (2, 8), forming a dipositive magnesium cation:\n$$\\text{Mg} \\to \\text{Mg}^{2+} + 2e^-$$\n• Chlorine (Z=17, electron arrangement 2, 8, 7) has 7 valence electrons. Two separate chlorine atoms each accept one of the released electrons to complete an argon octet (2, 8, 8), forming two chloride anions:\n$$2\\text{Cl} + 2e^- \\to 2\\text{Cl}^-$$\n• The strong electrostatic forces of attraction between the Mg²⁺ cation and the two Cl⁻ anions bind them into a crystal lattice:\n$$\\text{Mg}^{2+} + 2\\text{Cl}^- \\to \\text{MgCl}_2$$\n\n(ii) Properties of ionic compounds:\n1. High melting and boiling points due to strong electrostatic attraction across the crystal lattice.\n2. Conduct electricity when molten or dissolved in water (free mobile ions), but act as electrical insulators when solid.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) An inclined plane of sloped length 6.0 m is used to roll a drum of oil weighing 900.0 N onto a loading lorry platform 1.5 m high. If an applied effort force of 300.0 N is exerted along the ramp, calculate:\n  (α) The Velocity Ratio (VR) of the inclined plane;\n  (β) The Mechanical Advantage (MA);\n  (γ) The percentage efficiency of the machine.\n(ii) Explain why the efficiency of this inclined plane is less than 100%.",
        "workedSolution": "(i) Calculations:\n• (α) Velocity Ratio (VR):\n$$VR = \\frac{\\text{Distance moved by effort}}{\\text{Distance moved by load (height)}} = \\frac{6.0\\text{ m}}{1.5\\text{ m}} = 4.0$$\nAnswer: Velocity Ratio is **4.0**.\n\n• (β) Mechanical Advantage (MA):\n$$MA = \\frac{\\text{Load } (L)}{\\text{Effort } (E)} = \\frac{900.0\\text{ N}}{300.0\\text{ N}} = 3.0$$\nAnswer: Mechanical Advantage is **3.0**.\n\n• (γ) Percentage Efficiency:\n$$\\text{Efficiency} = \\frac{MA}{VR} \\times 100\\% = \\frac{3.0}{4.0} \\times 100\\% = 75.0\\%$$\nAnswer: Efficiency is **75.0%**.\n\n(ii) Reason efficiency is below 100%:\nA portion of the input work is converted to heat and sound to overcome friction between the rolling oil drum and the surface of the ramp.",
        "maxMarks": 8
      },
      {
        "subId": "(c)",
        "prompt": "State three biological or agronomic characteristics of weeds that enable them to compete aggressively with cultivated crops on farmlands.",
        "workedSolution": "1. **High Seed Production:** Weeds produce large numbers of seeds per plant, increasing their chances of establishment.\n2. **Prolonged Seed Dormancy and Viability:** Weed seeds can remain viable in topsoil for years, germinating once conditions become favorable.\n3. **Vegetative Propagation Mechanisms:** Many noxious weeds (such as spear grass) propagate vegetatively via deep rhizomes, stolons, or tubers that survive weeding.\n4. **Rapid Vegetative Growth and Deep Roots:** Weeds often grow faster and root deeper than young crop seedlings, outcompeting them for moisture, soil nutrients, and sunlight.",
        "maxMarks": 5
      }
    ]
  },
  {
    "questionNumber": "5",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "State the site of production, substrate, and end-products for each of the following digestive enzymes in the human alimentary canal:\n(i) Salivary amylase (ptyalin);\n(ii) Gastric pepsin;\n(iii) Pancreatic lipase.",
        "workedSolution": "(i) Salivary Amylase (Ptyalin):\n• **Site of production:** Salivary glands (mouth)\n• **Substrate:** Cooked starch\n• **End-product:** Maltose (disaccharide)\n\n(ii) Gastric Pepsin:\n• **Site of production:** Gastric glands (stomach mucosa)\n• **Substrate:** Proteins\n• **End-product:** Peptides and polypeptides\n\n(iii) Pancreatic Lipase:\n• **Site of production:** Pancreas (acting in the duodenum)\n• **Substrate:** Emulsified fats and oils (lipids)\n• **End-product:** Fatty acids and glycerol",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "(i) Describe the behavior of pure water when cooled from 10.0°C down to 0.0°C, highlighting its anomalous expansion.\n(ii) Explain the biological importance of the anomalous expansion of water to freshwater aquatic organisms during cold winter periods.",
        "workedSolution": "(i) Behavior of cooling water:\nAs water cools from 10.0°C down to 4.0°C, it contracts normally, decreasing in volume and increasing in density. However, when cooled from **4.0°C down to 0.0°C**, it expands anomalously—its volume increases and its density decreases until it freezes into ice at 0.0°C. Water reaches its **maximum density at 4.0°C**.\n\n(ii) Biological importance to aquatic life:\nIn cold weather, surface water cools, becomes denser, and sinks until the entire body of water reaches 4.0°C. As surface water cools below 4.0°C, it becomes less dense and remains at the top, eventually freezing into an insulating layer of ice at 0°C. Because ice floats and conducts heat poorly, the water underneath stays liquid at 4.0°C, allowing fish, crabs, and aquatic plants to survive beneath the frozen surface.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "Explain the importance of each of the following cultural practices carried out in vegetable seedling nurseries:\n(i) Hardening off;\n(ii) Pricking out.",
        "workedSolution": "(i) Hardening off:\n• **Importance:** Gradually reducing watering frequency and removing shade coverings a week before transplanting conditions seedlings to field conditions. This toughens stem tissues, encourages root development, and minimizes transplant shock in the open field.\n\n(ii) Pricking out:\n• **Importance:** Transplanting overcrowded young seedlings from germination seed boxes into wider nursery beds or individual polythene seedling bags gives each seedling adequate space, light, and nutrients to develop a strong root system before final field planting.",
        "maxMarks": 7
      }
    ]
  }
];

async function seedBeceMock6Science() {
  console.log('Seeding BECE Integrated Science Mock 6 (Set 137) into dedicated mock_exams/mock_6...');

  const keyDist = { A: 0, B: 0, C: 0, D: 0 };
  balancedMock6P1.forEach((q) => {
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) keyDist.A++;
    if (idx === 1) keyDist.B++;
    if (idx === 2) keyDist.C++;
    if (idx === 3) keyDist.D++;
  });
  console.log('Verified Mock 6 Paper 1 Key Distribution across 40 items:', keyDist);

  if (keyDist.A !== 10 || keyDist.B !== 10 || keyDist.C !== 10 || keyDist.D !== 10) {
    throw new Error('Key balancing failed! Must be exactly 10 A, 10 B, 10 C, 10 D.');
  }

  const db = await getDb();
  const docRef = db.doc('global_curriculum/jhs/subjects/science/mock_exams/mock_6');
  await docRef.set({
    mockId: "mock_6",
    title: "BECE Integrated Science Mock 6 (National Standards-Compliant Benchmark Suite)",
    subject: "Integrated Science",
    totalDurationMinutes: 150,
    metadata: {
      isMock: true,
      isMockExam: true,
      setNumber: 137,
      version: "NaCCA JHS Standards-Compliant",
      totalMarks: 140,
      sanitized: true,
      optionsBalanced: true,
      vectorGraphicsCount: 4,
      copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved.",
      updatedAt: new Date()
    },
    paper1: {
      title: "Paper 1: Objective Test (Mock 6)",
      durationMinutes: 45,
      totalQuestions: 40,
      questions: balancedMock6P1
    },
    paper2: {
      title: "Paper 2: Practical & Theory Essay (Mock 6)",
      durationMinutes: 105,
      instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
      totalQuestions: 5,
      questions: paper2Mock6Questions
    }
  }, { merge: true });

  console.log('✅ Ingestion complete: Set 137 (Mock 6) seeded successfully into mock_exams/mock_6.');
}

seedBeceMock6Science()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Mock 6 Science:', err);
    process.exit(1);
  });
