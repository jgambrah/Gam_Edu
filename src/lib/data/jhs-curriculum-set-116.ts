/**
 * 2000 BECE Integrated Science Examination (Set 116 Cloned Practice Variant)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_2000_variant
 * Set Number: Set 116
 * Format: Paper 1 (40 Objectives, 10 A, 10 B, 10 C, 10 D) & Paper 2 (4 Theory/Practical Essay Questions, 20 marks each = 80 marks total)
 * Reconstructed Visual Setups:
 *  - svgQ40Hypermetropia: Refractive correction of long-sightedness using converging convex lens
 *  - svgQ2bLiftingWork: Vertical lifting work mechanics on an 80 kg mass
 * 
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
 */

export const svgQ40Hypermetropia = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 170' width='100%' height='155' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><ellipse cx='230' cy='85' rx='80' ry='55' fill='#1e293b' stroke='#cbd5e1' stroke-width='2'/><path d='M 160 55 Q 175 85 160 115' fill='none' stroke='#38bdf8' stroke-width='3'/><ellipse cx='180' cy='85' rx='8' ry='28' fill='#0284c7' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/><text x='180' y='45' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Eye Lens</text><path d='M 105 45 Q 120 85 105 125 Q 90 85 105 45 Z' fill='#38bdf8' opacity='0.35' stroke='#38bdf8' stroke-width='2'/><text x='105' y='35' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>Convex Lens</text><circle cx='30' cy='85' r='3.5' fill='#f59e0b'/><text x='30' y='102' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Near Point</text><line x1='30' y1='85' x2='105' y2='65' stroke='#f59e0b' stroke-width='1.5'/><line x1='30' y1='85' x2='105' y2='105' stroke='#f59e0b' stroke-width='1.5'/><line x1='105' y1='65' x2='180' y2='72' stroke='#10b981' stroke-width='1.5'/><line x1='105' y1='105' x2='180' y2='98' stroke='#10b981' stroke-width='1.5'/><line x1='180' y1='72' x2='308' y2='85' stroke='#10b981' stroke-width='1.8'/><line x1='180' y1='98' x2='308' y2='85' stroke='#10b981' stroke-width='1.8'/><circle cx='308' cy='85' r='3' fill='#ef4444'/><text x='310' y='72' font-size='9' font-weight='bold' fill='#ef4444'>Retina</text><text x='180' y='155' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>CONVEX LENS CONVERGES RAYS TO FOCUS SHARPLY ON RETINA</text></svg></div>";

export const svgQ2bLiftingWork = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 180' width='100%' height='160' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='30' y1='150' x2='310' y2='150' stroke='#64748b' stroke-width='2.5'/><text x='50' y='165' font-size='9' font-weight='bold' fill='#64748b'>Ground Level</text><line x1='120' y1='150' x2='120' y2='40' stroke='#38bdf8' stroke-width='2' stroke-dasharray='4,3'/><polygon points='116,46 120,38 124,46' fill='#38bdf8'/><polygon points='116,144 120,152 124,144' fill='#38bdf8'/><text x='105' y='95' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='end'>h = 5.0 m</text><g transform='translate(170, 30)'><rect x='0' y='0' width='65' height='45' rx='3' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><text x='32' y='26' font-size='11' font-weight='bold' fill='#ffffff' text-anchor='middle'>80 kg</text><line x1='32' y1='45' x2='32' y2='95' stroke='#ef4444' stroke-width='2.5'/><polygon points='28,88 32,98 36,88' fill='#ef4444'/><text x='42' y='80' font-size='10' font-weight='bold' fill='#ef4444'>Weight = 800 N</text><line x1='32' y1='0' x2='32' y2='-20' stroke='#10b981' stroke-width='2.5'/><polygon points='28,-14 32,-24 36,-14' fill='#10b981'/><text x='42' y='-10' font-size='10' font-weight='bold' fill='#10b981'>Effort F = 800 N</text></g><text x='170' y='170' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>WORK DONE = FORCE x DISTANCE = 800 N x 5.0 m = 4,000 J</text></svg></div>";

export interface QuestionItem {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

export interface SubQuestion {
  subId: string;
  prompt: string;
  workedSolution: string;
  maxMarks: number;
}

export interface Paper2Question {
  questionNumber: string;
  isPracticalSectionA: boolean;
  subQuestions: SubQuestion[];
}

export const SET_BECE_2000_SCIENCE_P2_QUESTIONS: Paper2Question[] = [
  // ==========================================
  // QUESTION 1: HYGIENE, MATTER, LEVERS & SATELLITES (20 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) What is personal hygiene in community health and medicine?
(ii) List four practical daily routines by which personal hygiene can be maintained effectively.`,
        workedSolution: `(i) Definition of personal hygiene:
The practice of maintaining personal bodily cleanliness, grooming, and sanitation to preserve physical health, boost well-being, and prevent the transmission of infectious diseases.

(ii) Four daily maintenance routines:
1. Bathing the whole body thoroughly with clean water and soap at least twice daily.
2. Brushing the teeth and cleaning the oral cavity in the morning and after meals.
3. Washing hands thoroughly with soap under running water after using the toilet and before handling food.
4. Keeping fingernails and toenails short, clean, and neatly trimmed.
5. Wearing freshly washed, clean clothes and laundering beddings regularly.`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: `Define each of the following terms, giving two valid scientific examples in each case:
(i) Chemical compound;
(ii) Physical mixture.`,
        workedSolution: `(i) Chemical compound:
A pure chemical substance composed of two or more different elements chemically bonded together in a fixed, definite stoichiometric ratio by mass, which can only be broken down by chemical reactions.
• Examples: Pure water ($\\text{H}_2\\text{O}$), Sodium chloride ($\\text{NaCl}$), Carbon dioxide ($\\text{CO}_2$).

(ii) Physical mixture:
A material system made up of two or more distinct substances physically combined in any proportion, where each individual component retains its unique chemical identity and properties, and can be separated by physical methods.
• Examples: Atmospheric air, Brine (salt solution), Brass alloy, Granitic soil.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: `(i) What is a simple machine in physical mechanics?
(ii) Give one clear practical example each of a:
  (α) First-class lever;
  (β) Second-class lever;
  (γ) Third-class lever.`,
        workedSolution: `(i) Definition of simple machine:
A mechanical tool or device that makes work easier, faster, or more convenient by altering the magnitude, speed, or direction of an applied effort force.

(ii) Lever examples:
• (α) First-class lever (Fulcrum between Effort and Load): A pair of scissors, a crowbar, a see-saw, or claw hammer pulling nails.
• (β) Second-class lever (Load between Fulcrum and Effort): A builder's wheelbarrow, a nutcracker, or a crown-cap bottle opener.
• (γ) Third-class lever (Effort between Fulcrum and Load): A pair of tweezers / forceps, a fishing rod, or sugar tongs.`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: `(i) What is an astronomical or artificial satellite?
(ii) State two vital modern telecommunication or scientific uses of artificial satellites orbiting the Earth.`,
        workedSolution: `(i) Definition of satellite:
A celestial or manufactured body that revolves in a closed gravitational orbit around a more massive primary planet (e.g., the Moon orbiting Earth).

(ii) Uses of artificial satellites:
1. Global telecommunications: Relaying international telephone calls, satellite television broadcasting, and high-speed internet data across continents.
2. Meteorological monitoring: Tracking global weather patterns, cloud movements, and early warnings for tropical storms and hurricanes.
3. Satellite navigation: Providing Global Positioning System (GPS) signals for aviation, maritime transport, and vehicle navigation.`,
        maxMarks: 4
      }
    ]
  },

  // ==========================================
  // QUESTION 2: FORCES, WORK, SEPARATION & FLOWERS (20 MARKS)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "What is an electrostatic force in physical science?",
        workedSolution: `An electrostatic force is a non-contact attractive or repulsive force exerted between stationary electrical charges across a distance, where like charges repel each other and unlike charges attract ($F = \\frac{k q_1 q_2}{r^2}$).`,
        maxMarks: 3
      },
      {
        subId: "(b)",
        prompt: `(i) State the official S.I. unit of:
  (α) Mechanical force;
  (β) Mechanical work.
(ii) A heavy concrete block of mass $80.0\\text{ kg}$ is lifted vertically through a vertical height of $5.0\\text{ m}$. Calculate the work done on the block:

${svgQ2bLiftingWork}
$$[\\text{Take acceleration due to gravity, } g = 10.0\\text{ m s}^{-2}]$$`,
        workedSolution: `(i) S.I. units:
• (α) Force: Newton [symbol: $\\text{N}$]
• (β) Work: Joule [symbol: $\\text{J}$]

(ii) Work done calculation (refer to diagram):
• Step 1: Calculate the upward lifting force required to overcome weight ($W = mg$):
$$F = m \\times g = 80.0\\text{ kg} \\times 10.0\\text{ m s}^{-2} = 800.0\\text{ N}$$
• Step 2: Apply work formula ($W = F \\times h$):
$$\\text{Work Done } (W) = 800.0\\text{ N} \\times 5.0\\text{ m} = 4,000.0\\text{ Joules (J)}$$
Answer: The work done on the block is $$4,000\\text{ J}$$.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: "Describe briefly how you would separate the constituents of a dry heterogeneous mixture of common salt (sodium chloride) and insoluble powdered sulfur in a school laboratory.",
        workedSolution: `Separation protocol:
1. Dissolution: Place the salt-sulfur mixture into a glass beaker, add distilled water, and stir thoroughly with a glass rod. The soluble sodium chloride dissolves completely to form an aqueous saline solution, while the insoluble sulfur powder remains suspended and undissolved.
2. Filtration: Pour the mixture into a glass filter funnel fitted with folded filter paper over a conical flask. The insoluble powdered sulfur is retained on the filter paper as residue. Wash the residue with cold distilled water and allow it to dry.
3. Evaporation: Pour the clear salt filtrate into an evaporating dish and heat it gently over a Bunsen flame until all water evaporates off as steam, leaving behind pure white sodium chloride crystals.`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: `In botanical morphology, state three distinct structural characteristics each of:
(i) An insect-pollinated (entomophilous) flower;
(ii) A wind-pollinated (anemophilous) flower.`,
        workedSolution: `(i) Characteristics of insect-pollinated flowers:
1. Possess large, brightly colored petals (corolla) to visually attract insect pollinators.
2. Possess scented petals and specialized nectaries that secrete sweet nectar as a reward.
3. Produce relatively small quantities of large, heavy, sticky or spiky pollen grains that cling to insect bodies.
4. Stigmas are compact, sticky, and enclosed inside the floral petals.

(ii) Characteristics of wind-pollinated flowers:
1. Possess small, dull, green or inconspicuous petals (or lack petals entirely).
2. Scentless and lack nectaries.
3. Produce vast quantities of tiny, smooth, lightweight, dry pollen grains easily carried by air currents.
4. Possess long, pendulous filaments with versatile anthers protruding outside the flower, and large, feathery stigmas exposed to catch airborne pollen.`,
        maxMarks: 6
      }
    ]
  },

  // ==========================================
  // QUESTION 3: REPRODUCTION, DENSITY & ELEMENTS (20 MARKS)
  // ==========================================
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) What is biological fertilization in human reproduction?
(ii) Describe briefly the physiological processes that lead to fertilization in humans following sexual intercourse.`,
        workedSolution: `(i) Definition of fertilization:
The biological fusion of the haploid nucleus of a male spermatozoon ($n = 23$) with the haploid nucleus of a mature female ovum ($n = 23$) to form a single diploid zygote ($2n = 46$).

(ii) Pathway to fertilization:
1. Insemination: During coitus, millions of motile spermatozoa are ejaculated into the upper vaginal canal near the cervix.
2. Sperm Migration: Viable spermatozoa swim actively using their flagella through the cervical mucus, ascend through the uterine cavity, and enter the fallopian tubes (oviducts).
3. Capacitation & Acrosome Reaction: Surviving sperm undergo capacitation; upon encountering the mature ovum in the upper third of the fallopian tube (ampulla), sperm release acrosomal enzymes to penetrate the outer corona radiata and zona pellucida.
4. Syngamy: The head of a single fertilizing spermatozoon penetrates the vitelline membrane; the egg immediately triggers a cortical reaction to block polyspermy. The male and female pronuclei fuse together to form a diploid zygote.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) Define the physical term density of a substance.
(ii) Describe briefly how the density of an irregularly shaped insoluble stone can be experimentally determined in a school laboratory.`,
        workedSolution: `(i) Definition of density:
The mass per unit volume of a physical substance ($\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)}$), expressed in $\\text{kg m}^{-3}$ or $\\text{g cm}^{-3}$.

(ii) Determination of stone density:
1. Measuring Mass: Weigh the dry stone on a laboratory beam balance or digital electronic balance and record its mass in grams ($m$).
2. Measuring Volume (Displacement Method): Pour water into a graduated measuring cylinder to a convenient level and record the initial volume reading ($V_1$) at the bottom of the meniscus.
3. Tie a fine thread around the stone and lower it gently into the water until fully submerged.
4. Record the new, elevated water volume level ($V_2$).
5. Calculate the volume displaced:
$$V = V_2 - V_1$$
6. Calculate density:
$$\\rho = \\frac{m}{V_2 - V_1}$$`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: `(i) What is a chemical element?
(ii) Classify each of the following chemical substances as an Element, a Compound, or a Mixture:\n**Pure water, Atmospheric air, Solid potassium, Ethanol alcohol, Common table salt, Cane sugar.**`,
        workedSolution: `(i) Definition of an element:
A pure chemical substance that consists of only one type of atom (having the same atomic number) that cannot be split or decomposed into simpler substances by ordinary chemical reactions.

(ii) Classification Table:

| Substance | Chemical Classification | Reason / Composition |
| :--- | :--- | :--- |
| **Solid potassium** | **Element** | Pure metallic element ($\\text{K}$) |
| **Pure water** | **Compound** | Chemically bonded hydrogen and oxygen ($\\text{H}_2\\text{O}$) |
| **Ethanol alcohol** | **Compound** | Chemically bonded organic compound ($\\text{C}_2\\text{H}_5\\text{OH}$) |
| **Common table salt** | **Compound** | Chemically bonded ionic compound ($\\text{NaCl}$) |
| **Cane sugar** | **Compound** | Chemically bonded carbohydrate disaccharide ($\\text{C}_{12}\\text{H}_{22}\\text{O}_{11}$) |
| **Atmospheric air** | **Mixture** | Physical combination of gases ($\\text{N}_2, \\text{O}_2, \\text{Ar}, \\text{CO}_2, \\text{H}_2\\text{O}$) |`,
        maxMarks: 7
      }
    ]
  },

  // ==========================================
  // QUESTION 4: COLLOIDS, POLLUTION & ENERGY (20 MARKS)
  // ==========================================
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Define each of the following scientific terms:
(i) Metallic alloy;
(ii) Molecular diffusion;
(iii) Chemical colloid.`,
        workedSolution: `(i) Metallic alloy:
A homogeneous solid solution or uniform metallic mixture composed of two or more metals, or a metal combined with a non-metal (such as carbon), melted together to improve mechanical strength or corrosion resistance.

(ii) Molecular diffusion:
The spontaneous net movement of particles (atoms, ions, or molecules) from a region of higher concentration to a region of lower concentration down a concentration gradient as a result of their random thermal kinetic motion.

(iii) Chemical colloid:
A heterogeneous two-phase mixture consisting of microscopic dispersed particles (ranging from 1 to 1000 nanometers) suspended evenly throughout a continuous dispersion medium, which do not settle out rapidly upon standing and scatter light via the Tyndall effect.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `Give two distinct commercial or everyday examples of each of:
(i) A metallic alloy;
(ii) A colloidal system.`,
        workedSolution: `(i) Examples of alloys:
1. Brass (Copper and Zinc)
2. Bronze (Copper and Tin)
3. Carbon steel (Iron and Carbon)
4. Duralumin (Aluminum, Copper, Magnesium, Manganese)

(ii) Examples of colloids:
1. Milk (liquid fat droplets emulsified in water)
2. Fog / Mist (liquid water droplets suspended in air)
3. Smoke (solid carbon soot particulates dispersed in air)
4. Paint / Mayonnaise / Gelatin jelly`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: `(i) What is environmental pollution?
(ii) List two specific harmful chemical pollutants each of:
  (α) Atmospheric air;
  (β) Aquatic bodies (water);
  (γ) Terrestrial land (soil).`,
        workedSolution: `(i) Definition of environmental pollution:
The introduction of harmful chemical contaminants, solid waste, toxic effluents, or excessive energy (noise, heat, radiation) into the natural environment at concentrations that produce adverse harm to living organisms and ecological systems.

(ii) Harmful pollutants:
• (α) Air pollutants:
  1. Carbon monoxide ($CO$) from incomplete vehicular exhaust combustion.
  2. Sulfur dioxide ($SO_2$) from industrial smokestacks causing acid rain.
  3. Particulate soot / smoke dust.
• (β) Water pollutants:
  1. Untreated municipal domestic sewage containing fecal pathogens.
  2. Agricultural runoff carrying synthetic chemical fertilizers and pesticides.
  3. Industrial heavy metal effluents (mercury, lead, cyanide from mining).
• (γ) Land pollutants:
  1. Non-biodegradable polythene plastic bags and synthetic packaging.
  2. Discarded chemical batteries leaching toxic heavy metals (cadmium, lead).
  3. Indiscriminate domestic solid refuse.`,
        maxMarks: 6
      },
      {
        subId: "(d)",
        prompt: `A ripe coconut of gravitational weight $50.0\\text{ N}$ hangs stationary on a palm tree at a vertical height of $15.0\\text{ m}$ above the ground:
(i) Name the specific form of mechanical energy possessed by the elevated coconut.
(ii) Calculate the numerical value of this stored energy in Joules, clearly showing your formula and working.`,
        workedSolution: `(i) Form of energy:
Gravitational Potential Energy ($P.E.$).

(ii) Calculation:
Formula:
$$\\text{Gravitational Potential Energy } (P.E.) = \\text{Weight } (W) \\times \\text{Height } (h)$$
$$(P.E. = mgh = W \\times h)$$
Substitute given values ($W = 50.0\\text{ N}$, $h = 15.0\\text{ m}$):
$$P.E. = 50.0\\text{ N} \\times 15.0\\text{ m} = 750.0\\text{ Joules (J)}$$
Answer: The stored energy of the coconut is $$750\\text{ J}$$.`,
        maxMarks: 4
      }
    ]
  }
];

export const SET_BECE_2000_SCIENCE_P2 = {
  id: "paper_2000_variant_p2",
  year: 2000,
  setNumber: 117,
  paperType: 2,
  subject: "Integrated Science",
  title: "2000 BECE Integrated Science Paper 2 (Theory & Practical)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 75,
  instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 4,
  questions: SET_BECE_2000_SCIENCE_P2_QUESTIONS
};

export const SET_BECE_2000_SCIENCE_P1_QUESTIONS: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "Which specialized external anatomical organs are used by a teleost bony fish for swimming, steering, and stabilizing its position in water?",
    "options": [
      "Lateral sensory eyes",
      "Vascularized gill arches",
      "Muscular fins (pectoral, pelvic, dorsal, and caudal fins)",
      "The bony opercular flap"
    ],
    "correctAnswer": "Muscular fins (pectoral, pelvic, dorsal, and caudal fins)",
    "hint": "Flexible membranous appendages supported by bony rays that provide propulsion and balance.",
    "workedSolution": "Fins provide thrust and stability: the caudal fin generates forward propulsion, while pectoral and pelvic fins steer and maintain vertical balance.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "In astronomical science, a massive gravitationally bound cosmic system containing billions of stars, stellar remnants, interstellar gas, and dark matter is called:",
    "options": [
      "A meteor trail",
      "A galaxy [e.g., The Milky Way]",
      "A fallen meteorite",
      "An isolated terrestrial planet"
    ],
    "correctAnswer": "A galaxy [e.g., The Milky Way]",
    "hint": "Our Solar System resides inside the barred spiral Milky Way system.",
    "workedSolution": "A galaxy is an immense gravitationally bound system of stars, stellar remnants, gas, and dust. The Milky Way contains several hundred billion stars.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "In physical chemistry, the fundamental building block and smallest indivisible particle of a chemical element that retains its elemental properties is the:",
    "options": [
      "Binary chemical compound",
      "Macro element",
      "Orbital electron alone",
      "Atom"
    ],
    "correctAnswer": "Atom",
    "hint": "Consists of a central dense nucleus orbited by valence electrons.",
    "workedSolution": "The atom is the basic structural and chemical unit of an element that retains its chemical properties and can participate in chemical reactions.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "Which of the following physical or chemical processes represents an easily reversible physical change in which no new chemical substance is synthesized?",
    "options": [
      "The electrochemical rusting of an iron nail",
      "The combustion of dry paper into ash",
      "The fermentation of sweet palm wine into ethanol",
      "The melting of solid ice into liquid water"
    ],
    "correctAnswer": "The melting of solid ice into liquid water",
    "hint": "A phase transition where molecular composition ($\\text{H}_2\\text{O}$) remains intact.",
    "workedSolution": "Melting ice into liquid water is a reversible physical phase change without alteration of covalent chemical bonds: $\\text{H}_2\\text{O}_{(s)} \\rightleftharpoons \\text{H}_2\\text{O}_{(l)}$.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "Which vital internal organ in human physiology is responsible for filtering out toxic metabolic urea and excess mineral salts from blood plasma?",
    "options": [
      "The terminal rectum",
      "The muscular heart",
      "The kidney",
      "The lower anal canal"
    ],
    "correctAnswer": "The kidney",
    "hint": "Contains microscopic nephrons that form liquid urine.",
    "workedSolution": "The kidneys filter blood through nephrons to eliminate metabolic urea, uric acid, and excess electrolytes as urine, regulating fluid balance and blood pressure.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Which of the following feeding sequences represents a scientifically valid terrestrial grazing food chain that occurs naturally in an ecosystem?",
    "options": [
      "Green plants → Lizards → Herbivorous insects → Snakes",
      "Grasshoppers → Green plants → Lizards → Hawks",
      "Green plants → Snakes → Hawks → Primary consumers",
      "Green plants → Grasshoppers → Lizards → Snakes"
    ],
    "correctAnswer": "Green plants → Grasshoppers → Lizards → Snakes",
    "hint": "Must start with a photosynthetic primary producer, followed by a herbivore, then successive carnivores.",
    "workedSolution": "A valid grazing food chain starts with a photosynthetic primary producer (green plants), eaten by a primary consumer herbivore (grasshopper), followed by secondary (lizard) and tertiary consumers (snake).",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "Which of the following domestic electrical appliances utilizes an internal temporary electromagnet in its fundamental mechanical operation?",
    "options": [
      "An electric chime bell",
      "An electric dry iron",
      "A portable transistor radio",
      "A domestic refrigerator compressor"
    ],
    "correctAnswer": "An electric chime bell",
    "hint": "Direct current creates an electromagnetic field that attracts an armature to strike a gong repeatedly.",
    "workedSolution": "An electric bell utilizes an electromagnet to attract a soft-iron armature, causing a striker to hit a gong and simultaneously break the circuit to repeat the striking cycle.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Which of the following biological characteristics is an indispensable diagnostic feature unique to vertebrate animals of Class Mammalia?",
    "options": [
      "Laying external hard-shelled eggs exclusively",
      "Possession of aerodynamic feathers",
      "Possession of a keratinous toothless beak",
      "Possession of true epidermal hair/fur and mammary glands"
    ],
    "correctAnswer": "Possession of true epidermal hair/fur and mammary glands",
    "hint": "Females nourish their newborn offspring with milk secreted by specialized glands.",
    "workedSolution": "Mammals are distinguished from all other vertebrates by possessing epidermal hair (or fur) and mammary glands that secrete milk to nourish young.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "Which external blood-sucking ectoparasite is commonly found attached to the skin and ears of domestic dogs?",
    "options": [
      "The dog tick [Rhipicephalus sanguineus]",
      "The cocoa capsid bug",
      "The Guinea worm parasite",
      "The Plasmodium protozoan"
    ],
    "correctAnswer": "The dog tick [Rhipicephalus sanguineus]",
    "hint": "An external blood-feeding arachnid vector attaching firmly to skin.",
    "workedSolution": "Ticks are blood-feeding arachnid ectoparasites that cling to dog skin, transmitting pathogens like *Babesia*. *Plasmodium* and Guinea worms are internal endoparasites.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "Which of the following chemical substances undergoes direct endothermic sublimation (transitioning from a solid directly into a gas) upon gentle heating?",
    "options": [
      "Solid camphor (or ammonium chloride / iodine)",
      "Commercial baking powder",
      "Refined table salt crystals",
      "Refined cane sugar"
    ],
    "correctAnswer": "Solid camphor (or ammonium chloride / iodine)",
    "hint": "Vaporizes directly without melting into an intermediate liquid phase.",
    "workedSolution": "Camphor, naphthalene, dry ice, and iodine undergo sublimation upon heating, transitioning directly from solid to vapor without forming a liquid phase.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "In flowering plant reproduction, when a haploid male sperm nucleus fuses with the female egg cell nucleus in the ovule, the initial diploid structure formed is:",
    "options": [
      "The mature embryo",
      "The outer protective testa",
      "The zygote",
      "The ripe pericarp fruit"
    ],
    "correctAnswer": "The zygote",
    "hint": "The single diploid fertilized cell that subsequently undergoes mitosis to form an embryo.",
    "workedSolution": "Syngamy (the fusion of male and female gametes) yields a single diploid cell called a zygote, which divides mitotically to form the plant embryo.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "Clayey soil retains significantly more water than sandy or gravelly soil primarily because clay particles:",
    "options": [
      "Possess large particle diameters",
      "Enclose large macropore air spaces",
      "Are extremely fine and pack tightly to create tiny micropores with strong capillary attraction",
      "Are highly irregular and loose like gravel"
    ],
    "correctAnswer": "Are extremely fine and pack tightly to create tiny micropores with strong capillary attraction",
    "hint": "Microscopic particles create small pore spaces that hold capillary water tenaciously.",
    "workedSolution": "Clay particles are microscopic ($< 0.002\\text{ mm}$) and tightly packed, creating fine micropores that exert strong capillary and adhesive forces to retain water against gravity.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "Indiscriminate disposal of untreated domestic sewage, human urine, and feces into open river bodies used for drinking can trigger outbreaks of:",
    "options": [
      "Airborne measles",
      "Bacterial cholera and bilharziasis (schistosomiasis)",
      "Vector-borne malaria",
      "Dry tetanus"
    ],
    "correctAnswer": "Bacterial cholera and bilharziasis (schistosomiasis)",
    "hint": "Fecal contamination of water spreads water-borne enteric pathogens.",
    "workedSolution": "Contaminating water with human waste spreads fecal-oral pathogens like *Vibrio cholerae* (cholera) and schistosome parasite eggs that infect freshwater snails.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "A recorded ambient temperature of $20.0^\\circ\\text{C}$ corresponds on the absolute thermodynamic Kelvin temperature scale to:",
    "options": [
      "293 K",
      "253 K",
      "263 K",
      "273 K"
    ],
    "correctAnswer": "293 K",
    "hint": "$$T(\\text{K}) = \\theta(^\\circ\\text{C}) + 273.15 = 20 + 273 = 293\\text{ K}$$.",
    "workedSolution": "To convert Celsius to Kelvin: $T = 20^\\circ\\text{C} + 273 = 293\\text{ K}$. (The absolute zero base point is $-273.15^\\circ\\text{C}$).",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "Which celestial body in our Solar System generates and radiates its own electromagnetic light energy through thermonuclear reactions?",
    "options": [
      "Planet Mars",
      "A fallen iron meteorite",
      "The Earth's Moon",
      "The Sun"
    ],
    "correctAnswer": "The Sun",
    "hint": "A luminous star undergoing nuclear fusion; planets and moons are non-luminous reflectors.",
    "workedSolution": "The Sun is a self-luminous thermonuclear star generating radiant light and heat via hydrogen-to-helium nuclear fusion. Planets and moons only reflect sunlight.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "Why do xerophytic desert plants (and deciduous trees in dry harmattan seasons) shed their green foliage?",
    "options": [
      "To accelerate the absorption of soil mineral nutrients",
      "To reduce transpiring leaf surface area and prevent excessive water loss",
      "To increase the rate of molecular cellular diffusion",
      "To completely eliminate internal cellular respiration"
    ],
    "correctAnswer": "To reduce transpiring leaf surface area and prevent excessive water loss",
    "hint": "Water is scarce; dropping leaves closes the primary pathway of stomatal evaporation.",
    "workedSolution": "Shedding leaves reduces transpiring surface area, conserving moisture when soil water is depleted during dry seasons.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "Which of the following electrical components converts electrical current into visible radiant light energy?",
    "options": [
      "An incandescent filament lamp bulb",
      "An electric chime bell",
      "An amplified electric guitar",
      "A kerosene wick lantern"
    ],
    "correctAnswer": "An incandescent filament lamp bulb",
    "hint": "Electric current passes through a high-resistance tungsten filament, heating it to incandescence.",
    "workedSolution": "An incandescent bulb converts electrical energy into thermal heat in its tungsten filament, emitting visible light photons upon reaching incandescence.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "In the human cardiovascular circulatory system, what is the anatomical name of the smallest microscopic blood vessel?",
    "options": [
      "A muscular artery",
      "A capillary",
      "A branching arteriole",
      "A systemic vein"
    ],
    "correctAnswer": "A capillary",
    "hint": "Single-cell-thick endothelial tubes connecting arterioles to venules.",
    "workedSolution": "Capillaries are the smallest blood vessels, with single-cell-thick walls that permit diffusion of oxygen, carbon dioxide, glucose, and wastes between blood and tissues.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "Which of the following human physiological activities is classified as an involuntary, rapid somatic reflex action?",
    "options": [
      "Masticating and eating food",
      "Engaging in physical fighting",
      "Sneezing when dust irritates the nasal mucosa",
      "Memorizing and learning academic facts"
    ],
    "correctAnswer": "Sneezing when dust irritates the nasal mucosa",
    "hint": "An automatic protective response coordinated at the spinal/brainstem level without conscious thought.",
    "workedSolution": "Sneezing is an involuntary reflex action coordinated by the brainstem to expel foreign irritants from the respiratory tract without conscious intervention.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "Which physical separation technique is used in municipal water treatment plants to separate dense, settled flocs of coagulated silt from clear water?",
    "options": [
      "Atmospheric distillation",
      "Open thermal evaporation",
      "Industrial magnetic separation",
      "Sedimentation (and gravity decantation)"
    ],
    "correctAnswer": "Sedimentation (and gravity decantation)",
    "hint": "Allowing heavy coagulated particles to settle to the bottom of large settling basins.",
    "workedSolution": "Sedimentation allows dense coagulated sludge flocs to settle by gravity in settling basins, allowing clear clarified water to be decanted for sand filtration.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "What gaseous product is rapidly evolved when dilute hydrochloric acid ($\\text{HCl}$) is poured over solid calcium carbonate ($\\text{CaCO}_3$, marble chips)?",
    "options": [
      "Pungent ammonia gas [NH₃]",
      "Carbon dioxide gas [CO₂]",
      "Diatomic chlorine gas [Cl₂]",
      "Flammable hydrogen gas [H₂]"
    ],
    "correctAnswer": "Carbon dioxide gas [CO₂]",
    "hint": "$$\\text{CaCO}_3 + 2\\text{HCl} \\to \\text{CaCl}_2 + \\text{H}_2\\text{O} + \\text{CO}_2\\uparrow$$.",
    "workedSolution": "Reaction of an acid with a metal carbonate yields a salt, water, and carbon dioxide gas: $\\text{CaCO}_{3(s)} + 2\\text{HCl}_{(aq)} \\to \\text{CaCl}_{2(aq)} + \\text{H}_2\\text{O}_{(l)} + \\text{CO}_{2(g)}$.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "Which ambient environmental condition triggers an increase in the rate of cutaneous perspiration (sweating) in human beings?",
    "options": [
      "Extremely low air temperature",
      "Low atmospheric pressure",
      "High barometric pressure alone",
      "High ambient environmental temperature"
    ],
    "correctAnswer": "High ambient environmental temperature",
    "hint": "The body secretes sweat onto the skin so evaporative cooling can dissipate core body heat.",
    "workedSolution": "Elevated ambient temperature triggers hypothalamus-mediated thermoregulation, stimulating eccrine sweat glands to secrete sweat for evaporative cooling.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "Which staple agricultural food crop is propagated on farmlands asexually using woody stem cuttings?",
    "options": [
      "Coconut palm",
      "Mango tree",
      "Cassava [Manihot esculenta]",
      "Okro vegetable"
    ],
    "correctAnswer": "Cassava [Manihot esculenta]",
    "hint": "Farmers plant mature woody stem stakes directly into mounds or ridges.",
    "workedSolution": "Cassava is propagated vegetatively using woody stem cuttings (stakes) that sprout adventitious roots and shoots. Coconuts, mangoes, and okro are grown from seeds.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "What specific form of potential energy is stored within the chemical covalent bonds of ingested food molecules?",
    "options": [
      "Electrical potential energy",
      "Internal thermal heat energy",
      "Chemical potential energy",
      "Mechanical kinetic energy"
    ],
    "correctAnswer": "Chemical potential energy",
    "hint": "Released during cellular respiration when covalent bonds are enzymatically broken.",
    "workedSolution": "Food stores chemical potential energy within the covalent bonds of carbohydrates, lipids, and proteins, which is liberated as ATP during cellular respiration.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "Following complete enzymatic digestion of dietary proteins in the human alimentary canal, the absorbable monomeric end-products are:",
    "options": [
      "Simple glucose monosaccharides",
      "Maltose disaccharides",
      "Complex polypeptides",
      "Amino acids"
    ],
    "correctAnswer": "Amino acids",
    "hint": "Proteases (pepsin, trypsin, erepsin) hydrolyze peptide bonds into these individual monomers.",
    "workedSolution": "Proteins are broken down by proteases into individual amino acids, which are absorbed across intestinal villi into mesenteric blood capillaries.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "In physical magnetism, the magnetic attractive strength and field concentration of a permanent bar magnet is greatest at its:",
    "options": [
      "Extreme opposite poles (North and South poles)",
      "Exact geometric center",
      "Lateral middle edges",
      "Top flat surfaces"
    ],
    "correctAnswer": "Extreme opposite poles (North and South poles)",
    "hint": "Iron filings cling in dense clusters to the ends of the magnet where field lines converge.",
    "workedSolution": "Magnetic field lines converge at the poles (North and South), creating the highest magnetic flux density and attractive force at the magnet's ends.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "Biological protein catalysts that accelerate the chemical breakdown of insoluble food polymers into absorbable units are called:",
    "options": [
      "Endocrine hormones",
      "Digestive enzymes",
      "Lymphatic fluids",
      "Mucous secretions"
    ],
    "correctAnswer": "Digestive enzymes",
    "hint": "Substances such as salivary amylase, gastric pepsin, and pancreatic lipase.",
    "workedSolution": "Digestive enzymes are biological catalysts that accelerate the hydrolysis of insoluble food macromolecules into absorbable monomers without being consumed.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Thermal heat transfer through an opaque solid copper rod occurs via which physical mechanism?",
    "options": [
      "Conduction exclusively",
      "Convection exclusively",
      "Radiation exclusively",
      "Conduction and convection combined"
    ],
    "correctAnswer": "Conduction exclusively",
    "hint": "Heat passes through solids via lattice vibrations and electron collisions without bulk material movement.",
    "workedSolution": "Conduction is the only mode of heat transfer in opaque solids, operating via inter-atomic lattice vibrations and free electron transport without bulk matter movement.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "Engaging in casual, unprotected sexual intercourse with multiple sexual partners can result in the transmission and spread of:",
    "options": [
      "Bacterial cholera",
      "HIV/AIDS and other sexually transmitted infections",
      "Poliomyelitis virus",
      "Vector-borne malaria"
    ],
    "correctAnswer": "HIV/AIDS and other sexually transmitted infections",
    "hint": "Sexually transmitted infections spread through infected genital fluids and blood.",
    "workedSolution": "Unprotected sexual intercourse is the primary transmission route for sexually transmitted infections (STIs) such as HIV/AIDS, syphilis, and gonorrhea.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Which of the following physical actions will accelerate the rate at which a solid cube of sugar dissolves in a fixed volume of water?",
    "options": [
      "Cooling the water down to 0°C",
      "Keeping the solution completely still without stirring",
      "Dissolving in an opaque ceramic container",
      "Grinding the sugar cube into a fine powder (maximizing surface area)"
    ],
    "correctAnswer": "Grinding the sugar cube into a fine powder (maximizing surface area)",
    "hint": "Pulverizing solid solute increases the contact surface area exposed to water molecules.",
    "workedSolution": "Grinding a sugar cube into fine powder increases total surface area in contact with water molecules, significantly accelerating the rate of dissolution.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "Which atmospheric gas acts as the vital inorganic carbon substrate absorbed by plant foliage during photosynthesis?",
    "options": [
      "Active chlorophyll pigment",
      "Dissolved mineral salts",
      "Carbon dioxide [CO₂]",
      "Diatomic oxygen gas [O₂]"
    ],
    "correctAnswer": "Carbon dioxide [CO₂]",
    "hint": "Diffuses into leaves through stomatal pores and is fixed into glucose.",
    "workedSolution": "Carbon dioxide ($\text{CO}_2$) is the inorganic carbon raw material absorbed through stomata that is fixed into organic glucose during photosynthesis.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "Which celestial body is situated at the gravitational focal center of our heliocentric planetary system?",
    "options": [
      "Planet Earth",
      "Planet Mercury",
      "The Sun",
      "Dwarf planet Pluto"
    ],
    "correctAnswer": "The Sun",
    "hint": "The massive thermonuclear star holding planets in elliptical orbits.",
    "workedSolution": "The Solar System is heliocentric; the Sun is the massive central star holding all eight planets in orbit by its immense gravitational pull.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "Why are leguminous crops (such as cowpeas and groundnuts) systematically included in agricultural crop rotation cycles?",
    "options": [
      "They harbor symbiotic root nodule bacteria that fix atmospheric nitrogen to enrich soil fertility",
      "They are exceptionally easy to uproot before the next season",
      "They have very short vegetative life cycles",
      "They prevent all forms of weed growth completely"
    ],
    "correctAnswer": "They harbor symbiotic root nodule bacteria that fix atmospheric nitrogen to enrich soil fertility",
    "hint": "*Rhizobium* bacteria in root nodules convert atmospheric nitrogen gas into plant-available nitrates.",
    "workedSolution": "Legumes house symbiotic *Rhizobium* bacteria in their root nodules that fix atmospheric nitrogen gas into soil nitrates, naturally restoring soil fertility.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "Which insect vector is biologically responsible for transmitting the unicellular *Plasmodium* parasite that causes malaria?",
    "options": [
      "The common domestic housefly",
      "The female Anopheles mosquito",
      "The diurnal garden butterfly",
      "The nocturnal domestic cockroach"
    ],
    "correctAnswer": "The female Anopheles mosquito",
    "hint": "Requires blood proteins to develop eggs and injects sporozoites while biting.",
    "workedSolution": "Only female *Anopheles* mosquitoes take mammalian blood meals to develop eggs, transmitting infectious *Plasmodium* sporozoites via salivary secretions.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "Which physical property of liquid water enables mosquito larvae and light aquatic insects to remain suspended at the surface without sinking?",
    "options": [
      "Bulk liquid density",
      "Surface tension",
      "Dynamic viscosity",
      "High thermal capacity"
    ],
    "correctAnswer": "Surface tension",
    "hint": "Cohesive forces between surface water molecules form an elastic-like surface skin.",
    "workedSolution": "Surface tension creates cohesive forces among surface water molecules, forming an elastic-like film that supports the weight of light mosquito larvae and water striders.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "Which of the following personal grooming practices is an unhygienic habit that facilitates the transmission of skin pathogens?",
    "options": [
      "Keeping domestic residential surroundings clean",
      "Drinking boiled and filtered potable water",
      "Covering cooked food from houseflies",
      "Sharing personal bath towels, combs, and underwear with others"
    ],
    "correctAnswer": "Sharing personal bath towels, combs, and underwear with others",
    "hint": "Can spread fungal ringworm, scabies mites, and head lice.",
    "workedSolution": "Sharing personal grooming items like towels and combs facilitates the direct transmission of fungal dermatophytes (ringworm), head lice, and bacterial skin infections.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "When additional pure liquid water (solvent) is added to a concentrated aqueous salt solution, the resulting solution becomes more:",
    "options": [
      "Dilute",
      "Dense",
      "Concentrated",
      "Saturated"
    ],
    "correctAnswer": "Dilute",
    "hint": "The ratio of solute to solvent decreases, reducing concentration.",
    "workedSolution": "Adding more solvent increases total solution volume without changing solute mass, decreasing solute concentration and making the solution more dilute.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "A neutral atom possesses 4 protons and 5 neutrons in its nucleus. How many positively charged particles are present in this atom?",
    "options": [
      "4 positively charged particles (protons)",
      "1 particle",
      "2 particles",
      "3 particles"
    ],
    "correctAnswer": "4 positively charged particles (protons)",
    "hint": "Protons carry $+1$ charges, neutrons carry zero charge, and electrons carry $-1$ charges.",
    "workedSolution": "Protons are the only positively charged particles in an atom ($+1$ each). Because the atom has 4 protons, it contains exactly 4 positively charged particles.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "Which of the following biological statements are fundamentally true for ALL living organisms (plants and animals)?",
    "options": [
      "All living organisms manufacture their own food through photosynthesis",
      "All living organisms undergo cellular respiration and exhibit growth",
      "All living organisms possess active muscular locomotion",
      "All living organisms ingest pre-formed organic matter"
    ],
    "correctAnswer": "All living organisms undergo cellular respiration and exhibit growth",
    "hint": "Photosynthesis is limited to autotrophs, while respiration and growth occur in all living things.",
    "workedSolution": "All living organisms undergo cellular respiration to release metabolic ATP and exhibit irreversible growth. Photosynthesis is restricted to autotrophic green plants and algae.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "Eyeglasses fitted with converging biconvex lenses are prescribed to optically correct which refractive visual defect?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 170' width='100%' height='155' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><ellipse cx='230' cy='85' rx='80' ry='55' fill='#1e293b' stroke='#cbd5e1' stroke-width='2'/><path d='M 160 55 Q 175 85 160 115' fill='none' stroke='#38bdf8' stroke-width='3'/><ellipse cx='180' cy='85' rx='8' ry='28' fill='#0284c7' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/><text x='180' y='45' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Eye Lens</text><path d='M 105 45 Q 120 85 105 125 Q 90 85 105 45 Z' fill='#38bdf8' opacity='0.35' stroke='#38bdf8' stroke-width='2'/><text x='105' y='35' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>Convex Lens</text><circle cx='30' cy='85' r='3.5' fill='#f59e0b'/><text x='30' y='102' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Near Point</text><line x1='30' y1='85' x2='105' y2='65' stroke='#f59e0b' stroke-width='1.5'/><line x1='30' y1='85' x2='105' y2='105' stroke='#f59e0b' stroke-width='1.5'/><line x1='105' y1='65' x2='180' y2='72' stroke='#10b981' stroke-width='1.5'/><line x1='105' y1='105' x2='180' y2='98' stroke='#10b981' stroke-width='1.5'/><line x1='180' y1='72' x2='308' y2='85' stroke='#10b981' stroke-width='1.8'/><line x1='180' y1='98' x2='308' y2='85' stroke='#10b981' stroke-width='1.8'/><circle cx='308' cy='85' r='3' fill='#ef4444'/><text x='310' y='72' font-size='9' font-weight='bold' fill='#ef4444'>Retina</text><text x='180' y='155' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>CONVEX LENS CONVERGES RAYS TO FOCUS SHARPLY ON RETINA</text></svg></div>",
    "options": [
      "Ocular cataract opacity",
      "High intraocular glaucoma",
      "Long-sightedness (Hypermetropia)",
      "Short-sightedness (Myopia)"
    ],
    "correctAnswer": "Long-sightedness (Hypermetropia)",
    "hint": "Nearby rays focus behind the retina; a convex lens adds converging power to focus rays on the retina.",
    "workedSolution": "In hypermetropia (long-sightedness), light rays from near objects focus behind the retina. A converging convex lens refracts rays inward so they focus sharply onto the retina.",
    "points": 1
  }
];

export const SET_BECE_2000_SCIENCE_P1 = {
  id: "paper_2000_variant",
  year: 2000,
  setNumber: 116,
  paperType: 1,
  subject: "Integrated Science",
  title: "2000 BECE Integrated Science Paper 1 (Objective Test)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: SET_BECE_2000_SCIENCE_P1_QUESTIONS
};

export const SET_BECE_2000_SCIENCE_COMPLETE = {
  year: 2000,
  isVariant: true,
  setNumber: 116,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: SET_BECE_2000_SCIENCE_P1,
  paper2: SET_BECE_2000_SCIENCE_P2,
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 2,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
