/**
 * JHS Curriculum Data - Set 128
 * 1996 BECE Integrated Science Complete Variant (Paper 1 & Paper 2)
 *
 * Proprietary Content © GAM IT Solutions (GAM EDU). All rights reserved.
 */

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

// ==========================================
// PAPER 2 INLINE VECTOR SVGs
// ==========================================

export const svgQ1cFemaleReproductive = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Central Muscular Uterus (Womb) -->
    <path d='M 140 75 C 120 75 110 110 120 145 L 140 170 L 240 170 L 260 145 C 270 110 260 75 240 75 Z' fill='#1e293b' stroke='#f43f5e' stroke-width='2'/>
    <text x='190' y='125' font-size='11' font-weight='bold' fill='#f43f5e' text-anchor='middle'>Uterus (Womb)</text>

    <!-- Left Fallopian Tube (Oviduct) & Left Ovary -->
    <path d='M 140 85 C 95 65 65 75 55 95 L 60 110' fill='none' stroke='#38bdf8' stroke-width='2.5'/>
    <text x='70' y='60' font-size='10' font-weight='bold' fill='#38bdf8'>Fallopian Tube</text>
    <!-- Left Ovary -->
    <ellipse cx='60' cy='120' rx='10' ry='14' fill='#facc15' stroke='#ca8a04' stroke-width='1.5'/>
    <text x='35' y='140' font-size='10' font-weight='bold' fill='#facc15'>Ovary</text>

    <!-- Right Fallopian Tube (Oviduct) & Right Ovary -->
    <path d='M 240 85 C 285 65 315 75 325 95 L 320 110' fill='none' stroke='#38bdf8' stroke-width='2.5'/>
    <text x='310' y='60' font-size='10' font-weight='bold' fill='#38bdf8'>Oviduct</text>
    <!-- Right Ovary -->
    <ellipse cx='320' cy='120' rx='10' ry='14' fill='#facc15' stroke='#ca8a04' stroke-width='1.5'/>
    <text x='345' y='140' font-size='10' font-weight='bold' fill='#facc15'>Ovary</text>

    <!-- Cervix Neck -->
    <line x1='160' y1='170' x2='220' y2='170' stroke='#cbd5e1' stroke-width='2'/>
    <text x='250' y='174' font-size='10' font-weight='bold' fill='#cbd5e1'>Cervix</text>

    <!-- Vagina (Birth Canal) -->
    <path d='M 160 170 L 165 205 L 215 205 L 220 170' fill='none' stroke='#f43f5e' stroke-width='2'/>
    <text x='190' y='195' font-size='10' font-weight='bold' fill='#f43f5e' text-anchor='middle'>Vagina</text>

    <text x='190' y='220' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>ANTERIOR VIEW OF THE MAMMALIAN FEMALE REPRODUCTIVE TRACT</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

export const svgQ2aSolarEclipse = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Central Sun (Light Source on Left) -->
    <circle cx='50' cy='100' r='32' fill='#fef08a' stroke='#f59e0b' stroke-width='2'/>
    <text x='50' y='104' font-size='11' font-weight='bold' fill='#78350f' text-anchor='middle'>Sun</text>

    <!-- Moon (Opaque Obstacle in Middle) -->
    <circle cx='180' cy='100' r='12' fill='#64748b' stroke='#94a3b8' stroke-width='1.5'/>
    <text x='180' y='80' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Moon</text>

    <!-- Earth (Receiving Shadow on Right) -->
    <circle cx='320' cy='100' r='26' fill='#0284c7' stroke='#38bdf8' stroke-width='1.8'/>
    <text x='320' y='104' font-size='11' font-weight='bold' fill='#ffffff' text-anchor='middle'>Earth</text>

    <!-- Direct Light Tangents (Umbra Cone) -->
    <line x1='50' y1='68' x2='180' y2='88' stroke='#fde047' stroke-width='1' stroke-dasharray='3,2'/>
    <line x1='50' y1='132' x2='180' y2='112' stroke='#fde047' stroke-width='1' stroke-dasharray='3,2'/>
    <polygon points='180,88 320,95 320,105 180,112' fill='#0f172a' opacity='0.85'/>

    <!-- Cross Tangents (Penumbra Region) -->
    <line x1='50' y1='68' x2='180' y2='112' stroke='#f59e0b' stroke-width='1' stroke-dasharray='3,2'/>
    <line x1='50' y1='132' x2='180' y2='88' stroke='#f59e0b' stroke-width='1' stroke-dasharray='3,2'/>
    <polygon points='180,88 320,65 320,95' fill='#334155' opacity='0.45'/>
    <polygon points='180,112 320,135 320,105' fill='#334155' opacity='0.45'/>

    <!-- Pointer Labels -->
    <line x1='320' y1='100' x2='250' y2='30' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/>
    <text x='245' y='25' font-size='10' font-weight='bold' fill='#f43f5e' text-anchor='end'>Umbra (Total Eclipse)</text>

    <line x1='320' y1='75' x2='250' y2='170' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/>
    <text x='245' y='175' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='end'>Penumbra (Partial Eclipse)</text>

    <text x='190' y='192' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>ECLIPSE OF THE SUN: MOON PASSES BETWEEN SUN AND EARTH CASTING SHADOW</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

export const svgQ3bOxygenAtom = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 220' width='100%' height='200' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Central Nucleus (8p, 8n) -->
    <circle cx='170' cy='110' r='24' fill='#ef4444' opacity='0.4' stroke='#ef4444' stroke-width='2'/>
    <text x='170' y='107' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>8 Protons</text>
    <text x='170' y='120' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>8 Neutrons</text>

    <!-- Shell 1: K-Shell (holds 2 electrons) -->
    <circle cx='170' cy='110' r='48' fill='none' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='3,2'/>
    <circle cx='170' cy='62' r='4' fill='#38bdf8'/>
    <circle cx='170' cy='158' r='4' fill='#38bdf8'/>
    <text x='225' y='65' font-size='9' font-weight='bold' fill='#38bdf8'>K-shell (2e⁻)</text>

    <!-- Shell 2: L-Shell (holds 6 valence electrons) -->
    <circle cx='170' cy='110' r='82' fill='none' stroke='#10b981' stroke-width='1.8'/>
    <!-- 6 Valence Electrons in pairs -->
    <circle cx='170' cy='28' r='4.5' fill='#10b981'/><circle cx='185' cy='30' r='4.5' fill='#10b981'/>
    <circle cx='170' cy='192' r='4.5' fill='#10b981'/><circle cx='185' cy='190' r='4.5' fill='#10b981'/>
    <circle cx='88' cy='110' r='4.5' fill='#10b981'/>
    <circle cx='252' cy='110' r='4.5' fill='#10b981'/>
    <text x='260' y='35' font-size='9' font-weight='bold' fill='#10b981'>L-shell (6e⁻)</text>

    <text x='170' y='210' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>OXYGEN ATOM (Z=8, A=16): 2, 6 ELECTRONIC CONFIGURATION</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// ==========================================
// 40 OBJECTIVE TEST QUESTIONS (RAW BANK)
// ==========================================
interface RawQuestionItem {
  number: number;
  prompt: string;
  correctAnswer: string;
  distractors: string[];
  hint: string;
  workedSolution: string;
  points: number;
}

const rawScienceBank: RawQuestionItem[] = [
  {
    number: 1,
    prompt: "Which of the following clinical human diseases is a sexually transmitted infection (STI) caused by a spirochete bacterium?",
    correctAnswer: "Syphilis [Treponema pallidum]",
    distractors: [
      "Bacterial cholera",
      "Nutritional rickets",
      "Pulmonary tuberculosis"
    ],
    hint: "Characterized by primary genital chancres and transmitted through sexual contact.",
    workedSolution: "Syphilis is an STI caused by the bacterium *Treponema pallidum*. Cholera and tuberculosis are non-venereal infections, and rickets is a Vitamin D deficiency disease.",
    points: 1
  },
  {
    number: 2,
    prompt: "Which group of anatomical organs constitutes the primary excretory organs responsible for eliminating metabolic wastes in humans?",
    correctAnswer: "Kidneys, lungs, and the skin",
    distractors: [
      "Kidneys and urethra only",
      "Kidneys and the skin only",
      "Kidneys and the lungs only"
    ],
    hint: "The kidneys excrete urea/salts, skin excretes sweat, and lungs excrete carbon dioxide.",
    workedSolution: "The primary excretory organs are the kidneys (urine/urea), lungs (carbon dioxide and water vapor), and skin (sweat containing water, salts, and urea). The urethra is a urinary duct.",
    points: 1
  },
  {
    number: 3,
    prompt: "Which of the following agricultural farming systems is the most effective agronomic practice for continuously maintaining soil fertility on a piece of land?",
    correctAnswer: "Crop rotation (with leguminous crops)",
    distractors: [
      "Monoculture seasonal cropping",
      "Continuous deep mechanical ploughing",
      "Indiscriminate seasonal bush burning"
    ],
    hint: "Alternates different botanical crop families to balance nutrient uptake and fix nitrogen.",
    workedSolution: "Crop rotation balances nutrient extraction, preserves soil structure, and replenishes nitrogen through legumes without exhausting specific soil layers.",
    points: 1
  },
  {
    number: 4,
    prompt: "Which of the following human bodily actions is a conscious voluntary action rather than an involuntary reflex action?",
    correctAnswer: "Engaging in speech and talking while eating a meal",
    distractors: [
      "Rapid blinking of the eyes when dust blows",
      "Immediate withdrawal of the hand from a hot cooking pot",
      "Involuntary jerking of the leg following a patellar tendon tap"
    ],
    hint: "Initiated and controlled by conscious cerebral mental deliberation.",
    workedSolution: "Talking is a voluntary motor action controlled by conscious cerebral brain centers. Blinking, hand withdrawal, and knee jerks are autonomic reflex actions.",
    points: 1
  },
  {
    number: 5,
    prompt: "A worker exerts an upward vertical lifting force of $40.0\\text{ N}$ to lift a cargo carton into a vehicle. If the mechanical work done is $80.0\\text{ J}$, calculate the vertical displacement distance through which the carton was lifted:",
    correctAnswer: "2.0 meters",
    distractors: [
      "0.5 meters",
      "40.0 meters",
      "120.0 meters"
    ],
    hint: "Distance = Work / Force = 80.0 / 40.0.",
    workedSolution: "Distance = W / F = 80.0 J / 40.0 N = 2.0 meters.",
    points: 1
  },
  {
    number: 6,
    prompt: "Which of the following biological sequences represents the correct hierarchical order of increasing structural complexity in multicellular organisms?",
    correctAnswer: "Cells → Tissues → Organs → Systems",
    distractors: [
      "Cells → Systems → Tissues → Organs",
      "Cells → Organs → Tissues → Systems",
      "Cells → Systems → Organs → Tissues"
    ],
    hint: "Specialized cells aggregate into tissues, tissues build organs, and organs form organ systems.",
    workedSolution: "The hierarchy of biological organization progresses from the simplest structural unit to the most complex: Cells → Tissues → Organs → Systems → Organism.",
    points: 1
  },
  {
    number: 7,
    prompt: "The universal Law of Conservation of Energy states that within an isolated physical system, energy can:",
    correctAnswer: "Neither be created nor destroyed, but can be transformed from one form to another",
    distractors: [
      "Be created from nothing but cannot be transformed",
      "Be destroyed completely but cannot be transformed",
      "Neither be created nor transformed into any other form"
    ],
    hint: "Total energy remains constant throughout all physical and chemical conversions.",
    workedSolution: "The Law of Conservation of Energy (First Law of Thermodynamics) states that energy cannot be created or destroyed; it can only change from one form to another, keeping total energy constant.",
    points: 1
  },
  {
    number: 8,
    prompt: "In lunar planetary astronomy, the large, bowl-shaped circular impact depressions visible across the barren surface of the Moon are called:",
    correctAnswer: "Craters",
    distractors: [
      "River valleys",
      "Erosion gullies",
      "Mountain spurs"
    ],
    hint: "Formed by high-velocity impacts of meteorites and asteroids over billions of years.",
    workedSolution: "Lunar craters are circular depressions formed by the impact of meteorites and asteroids striking the Moon's airless, unshielded surface.",
    points: 1
  },
  {
    number: 9,
    prompt: "In astronomical optics, what is the scientific name of the central, completely dark conical region of a shadow formed during a total eclipse?",
    correctAnswer: "Umbra",
    distractors: [
      "Lunar eclipse",
      "Annular eclipse",
      "Penumbra"
    ],
    hint: "The inner region where all direct rays from the light source are completely blocked.",
    workedSolution: "The umbra is the central, totally dark shadow cone where direct light from the illuminating source is completely blocked. The outer, partially lit shadow is the penumbra.",
    points: 1
  },
  {
    number: 10,
    prompt: "What are the primary chemical byproducts and metabolic wastes eliminated by living vascular green plants into their environment?",
    correctAnswer: "Water vapor, carbon dioxide, and oxygen",
    distractors: [
      "Water, carbon dioxide, and urea",
      "Water, carbon dioxide, and mineral salts",
      "Water, ammonium compounds, and oxygen"
    ],
    hint: "Oxygen is released during photosynthesis, CO2 during respiration, and water vapor via transpiration.",
    workedSolution: "Plants eliminate excess water vapor (transpiration), carbon dioxide (respiration), and oxygen (photosynthesis). Plants do not excrete nitrogenous urea.",
    points: 1
  },
  {
    number: 11,
    prompt: "A heterogeneous suspension of insoluble silica sand mixed with liquid water is separated most cleanly in a laboratory using:",
    correctAnswer: "Gravity filtration through porous filter paper",
    distractors: [
      "Electrochemical ionization",
      "Vapor condensation",
      "Magnetic separation"
    ],
    hint: "Porous filter paper retains insoluble sand residue while allowing clear water filtrate to pass.",
    workedSolution: "Filtration separates insoluble solids from liquids: filter paper traps sand particles as residue while clear water drains into the receiving flask as filtrate.",
    points: 1
  },
  {
    number: 12,
    prompt: "Which of the following balanced chemical equations correctly represents the standard laboratory preparation of carbon dioxide gas?",
    correctAnswer: "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂",
    distractors: [
      "CaCO₃ + 2HCl → CaO + Cl₂ + H₂ + CO₂",
      "CaCO₃ + 2HCl → CaCl₂ + H₂CO₃",
      "CaCO₃ + 2HCl → CaO + Cl₂ + H₂O + CO"
    ],
    hint: "Reaction between solid calcium carbonate and dilute hydrochloric acid yielding salt, water, and gas.",
    workedSolution: "Carbon dioxide is prepared by reacting marble chips (CaCO3) with dilute hydrochloric acid: CaCO3(s) + 2HCl(aq) → CaCl2(aq) + H2O(l) + CO2(g)↑.",
    points: 1
  },
  {
    number: 13,
    prompt: "Which of the following physical entities CANNOT be classified scientifically as a form of matter?",
    correctAnswer: "Visible light radiation",
    distractors: [
      "Diatomic hydrogen gas [H₂]",
      "Diatomic oxygen gas [O₂]",
      "Liquid water [H₂O]"
    ],
    hint: "Light is electromagnetic radiant energy possessing zero rest mass and occupying no volume.",
    workedSolution: "Matter must have mass and occupy volume. Light is electromagnetic radiant energy made of massless photons, so it is not matter.",
    points: 1
  },
  {
    number: 14,
    prompt: "A dense granite stone of mass $80.0\\text{ g}$ is lowered into a graduated measuring cylinder containing water, causing the water level to rise by $20.0\\text{ cm}^3$. Calculate the density of the stone:",
    correctAnswer: "4.00 g cm⁻³",
    distractors: [
      "0.25 g cm⁻³",
      "1.20 g cm⁻³",
      "1.80 g cm⁻³"
    ],
    hint: "Density = Mass / Volume = 80.0 / 20.0.",
    workedSolution: "Density = Mass / Volume = 80.0 g / 20.0 cm³ = 4.00 g cm⁻³.",
    points: 1
  },
  {
    number: 15,
    prompt: "In astronomical astrophysics, our central star (the Sun) is composed predominantly of glowing, incandescent:",
    correctAnswer: "Thermonuclear plasma gases (principally hydrogen and helium)",
    distractors: [
      "Molten igneous basalt rocks",
      "Solid crystalline gold veins",
      "Combusting bituminous coal deposits"
    ],
    hint: "A massive plasma ball powered by nuclear fusion of hydrogen into helium.",
    workedSolution: "The Sun is an incandescent plasma sphere composed of ~74% hydrogen and ~24% helium, powered by core nuclear fusion, not chemical combustion of coal or rock.",
    points: 1
  },
  {
    number: 16,
    prompt: "In mechanical simple machines, the opposing resistive force overcome by an applied effort is known as the:",
    correctAnswer: "Load",
    distractors: [
      "Applied effort",
      "Fixed pivot fulcrum",
      "Rigid lever bar"
    ],
    hint: "The weight or resistance being moved by the machine.",
    workedSolution: "The load is the opposing resistance or weight overcome by a machine when an effort force is applied to do work.",
    points: 1
  },
  {
    number: 17,
    prompt: "Calculate the mechanical work done when a downward gravitational weight of $20.0\\text{ N}$ is lifted vertically upward through a distance of $10.0\\text{ cm}$:",
    correctAnswer: "2.0 Joules",
    distractors: [
      "2000.0 Joules",
      "200.0 Joules",
      "20.0 Joules"
    ],
    hint: "Convert centimeters to meters: 10.0 cm = 0.10 m. W = F * d.",
    workedSolution: "Distance = 10.0 cm / 100 = 0.10 m. Work Done = F * d = 20.0 N * 0.10 m = 2.0 Joules (J).",
    points: 1
  },
  {
    number: 18,
    prompt: "Thermal heat energy traverses the empty vacuum of interplanetary space from the Sun to Earth by the physical process of:",
    correctAnswer: "Thermal electromagnetic radiation",
    distractors: [
      "Thermal conduction",
      "Thermal convection currents",
      "Mechanical molecular vibration"
    ],
    hint: "Does not require a material medium; travels as infrared electromagnetic waves.",
    workedSolution: "Conduction and convection require a material medium. Radiation transfers thermal energy through a vacuum via infrared electromagnetic waves.",
    points: 1
  },
  {
    number: 19,
    prompt: "In agricultural pedology, topsoil aeration and pore structure can be naturally improved by:",
    correctAnswer: "The burrowing and tunneling activities of subterranean earthworms",
    distractors: [
      "Adding coarse crushed rock minerals to the surface",
      "Excessive chemical fertilizer application",
      "Accelerated rock weathering alone"
    ],
    hint: "Earthworms ingest soil, burrowing aerating channels and depositing nutrient-rich casts.",
    workedSolution: "Earthworms burrow through topsoil, creating tunnels that improve aeration, water drainage, and root penetration, while their casts enrich soil fertility.",
    points: 1
  },
  {
    number: 20,
    prompt: "Which of the following anatomical structures in the human body does NOT participate in the chemical or mechanical digestion of food?",
    correctAnswer: "The rectum",
    distractors: [
      "The mouth cavity",
      "The duodenum",
      "The exocrine pancreas"
    ],
    hint: "Serves only as a temporary storage chamber for feces prior to defecation.",
    workedSolution: "The mouth chews, the duodenum receives enzymes, and the pancreas secretes digestive enzymes. The rectum stores feces before egestion and has no digestive function.",
    points: 1
  },
  {
    number: 21,
    prompt: "Practical simple machines always waste a portion of the input mechanical energy and operate below 100% efficiency primarily because of:",
    correctAnswer: "Mechanical friction between moving contact parts",
    distractors: [
      "Machine operational old age",
      "The magnitude of the applied effort force",
      "The weight of the load being lifted"
    ],
    hint: "Frictional resistance converts useful mechanical work into wasted thermal heat.",
    workedSolution: "Friction between moving parts and the weight of machine components converts a portion of input energy into wasted heat and sound, keeping efficiency below 100%.",
    points: 1
  },
  {
    number: 22,
    prompt: "All of the following cultivated agricultural crops enrich soil fertility with fixed nitrates through root nodule symbiosis EXCEPT:",
    correctAnswer: "Okro [Abelmoschus esculentus]",
    distractors: [
      "Broad beans [Vicia faba]",
      "French beans [Phaseolus vulgaris]",
      "Groundnuts [Arachis hypogaea]"
    ],
    hint: "Okro is a non-leguminous vegetable crop that cannot fix atmospheric nitrogen.",
    workedSolution: "Broad beans, French beans, and groundnuts are legumes harboring nitrogen-fixing Rhizobium bacteria in root nodules. Okro belongs to Malvaceae and does not fix nitrogen.",
    points: 1
  },
  {
    number: 23,
    prompt: "In mammalian cardiovascular physiology, whole blood is scientifically described as consisting of:",
    correctAnswer: "A liquid matrix (blood plasma) and formed solid cellular corpuscles",
    distractors: [
      "A simple homogeneous red mineral fluid",
      "Red blood cells and white blood cells without any fluid",
      "Concentrated blood proteins and liquid glycerol"
    ],
    hint: "Liquid plasma (~55%) and formed cellular elements: erythrocytes, leukocytes, platelets.",
    workedSolution: "Blood is a connective tissue composed of a liquid intercellular matrix called plasma (~55%) carrying suspended cellular elements: red cells, white cells, and platelets.",
    points: 1
  },
  {
    number: 24,
    prompt: "A machine receives an energy input of $600.0\\text{ J}$, during which $200.0\\text{ J}$ of energy is wasted as thermal heat due to friction. Determine the mechanical efficiency of the machine:",
    correctAnswer: "67%",
    distractors: [
      "40%",
      "33%",
      "30%"
    ],
    hint: "Useful Work Output = 600.0 - 200.0 = 400.0 J. Efficiency = Output / Input * 100%.",
    workedSolution: "Work Output = 600.0 J - 200.0 J = 400.0 J. Efficiency = (400.0 J / 600.0 J) * 100% = 66.67% ≈ 67%.",
    points: 1
  },
  {
    number: 25,
    prompt: "What specific form of energy is stored within the chemical covalent bonds of combustible fuels (such as firewood, petroleum, and coal)?",
    correctAnswer: "Chemical potential energy",
    distractors: [
      "Visible light energy",
      "Solar radiant energy directly",
      "Mechanical kinetic energy"
    ],
    hint: "Released as thermal heat and light during exothermic combustion reactions.",
    workedSolution: "Fuels store chemical potential energy within their molecular bonds, which is liberated as thermal heat and light energy during combustion.",
    points: 1
  },
  {
    number: 26,
    prompt: "An object resting completely stationary on an elevated surface has zero velocity and zero momentum, but it MAY possess:",
    correctAnswer: "Gravitational potential energy",
    distractors: [
      "Linear velocity",
      "Linear momentum",
      "Mechanical kinetic energy"
    ],
    hint: "Energy stored due to its vertical position in a gravitational field (P.E. = mgh).",
    workedSolution: "A stationary object has zero kinetic energy (K.E. = 0) and zero momentum (p = 0), but stores gravitational potential energy (P.E. = mgh) if elevated above a reference level.",
    points: 1
  },
  {
    number: 27,
    prompt: "In avian vertebrate anatomy, birds are aerodynamically adapted for sustained flight primarily because they possess:",
    correctAnswer: "Hollow, pneumatic bones that minimize structural body weight",
    distractors: [
      "Webbed swimming feet",
      "Long trailing tail feathers alone",
      "A completely flat chest without breast muscles"
    ],
    hint: "Pneumatic bones contain air cavities that reduce skeletal mass without sacrificing strength.",
    workedSolution: "Birds possess hollow pneumatic bones with internal struts, reducing skeletal weight while maintaining strength for flight. A deep keel anchors flight muscles.",
    points: 1
  },
  {
    number: 28,
    prompt: "Which energy resource constitutes the primary chief source of commercial transportation fuels in the modern global economy?",
    correctAnswer: "Crude petroleum oil",
    distractors: [
      "Anthracite coal",
      "Compressed natural gas",
      "Fissile nuclear uranium"
    ],
    hint: "Refined into petrol, diesel, and aviation kerosene.",
    workedSolution: "Crude petroleum is the leading primary fuel resource globally, refined into liquid fuels (petrol, diesel, jet fuel) powering global transport.",
    points: 1
  },
  {
    number: 29,
    prompt: "Which inorganic atmospheric gas is absorbed by autotrophic green plants through leaf stomata to synthesize carbohydrates during photosynthesis?",
    correctAnswer: "Carbon dioxide [CO₂]",
    distractors: [
      "Carbon monoxide [CO]",
      "Diatomic oxygen gas [O₂]",
      "Diatomic hydrogen gas [H₂]"
    ],
    hint: "Fixed into glucose during the light-independent Calvin cycle.",
    workedSolution: "Carbon dioxide (CO2) is absorbed from air through stomata and fixed into glucose during photosynthesis: 6CO2 + 6H2O → C6H12O6 + 6O2.",
    points: 1
  },
  {
    number: 30,
    prompt: "In tropical medicine, the parasitic protozoan disease Human African Trypanosomiasis (sleeping sickness) is transmitted by the bite of:",
    correctAnswer: "The tsetse fly [Glossina]",
    distractors: [
      "The blackfly [Simulium]",
      "The luminescent firefly",
      "The female Anopheles mosquito"
    ],
    hint: "Transmits the flagellate protozoan *Trypanosoma brucei* during blood meals.",
    workedSolution: "Sleeping sickness is transmitted by blood-feeding tsetse flies (*Glossina*), which inject *Trypanosoma* parasites into humans, causing lethargy and neurological damage.",
    points: 1
  },
  {
    number: 31,
    prompt: "Which of the following staple root crops is a heavy feeder that rapidly depletes soil potassium and nitrogen reserves when grown continuously?",
    correctAnswer: "Cassava [Manihot esculenta]",
    distractors: [
      "Common beans",
      "Leguminous cowpeas",
      "Groundnuts"
    ],
    hint: "A heavy-yielding root crop requiring high potassium for tuber development.",
    workedSolution: "Cassava extracts large quantities of potassium and nitrogen from soil to produce starch tubers, rapidly depleting fertility if cultivated without fertilizers or crop rotation.",
    points: 1
  },
  {
    number: 32,
    prompt: "In commercial cocoa cash crop farming, the destructive black pod disease that attacks maturing cocoa pods is caused by a parasitic:",
    correctAnswer: "Fungus / Oomycete [Phytophthora palmivora]",
    distractors: [
      "Plant virus",
      "Soil bacterium",
      "Protozoan Plasmodium"
    ],
    hint: "Spreads via fungal spores during cool, wet rainy seasons, turning pods brown and black.",
    workedSolution: "Cocoa black pod disease is caused by the fungal pathogen *Phytophthora palmivora*, which rots pods during wet conditions.",
    points: 1
  },
  {
    number: 33,
    prompt: "In aquatic vertebrate anatomy, which respiratory organ enables a teleost bony fish to breathe dissolved oxygen in water?",
    correctAnswer: "Vascularized gills (under the operculum)",
    distractors: [
      "Olfactory nostrils",
      "Pectoral steering fins",
      "Dorsal balancing fins"
    ],
    hint: "Water flows across thin gill filaments where counter-current gas exchange occurs.",
    workedSolution: "Fish breathe using gills. Water taken in through the mouth flows over gill filaments, where dissolved oxygen diffuses into capillary blood and CO2 is expelled.",
    points: 1
  },
  {
    number: 34,
    prompt: "In angiosperm floral reproduction, following successful double fertilization, which part of the flower develops into the seed?",
    correctAnswer: "The fertilized ovule",
    distractors: [
      "The pollen-bearing stamen",
      "The enlarged floral ovary",
      "The receptive apical stigma"
    ],
    hint: "The ovary matures into the fruit pericarp; the ovule becomes the seed.",
    workedSolution: "Following fertilization, the ovule matures into a seed enclosing the embryo and cotyledons, while the surrounding ovary wall develops into the fruit pericarp.",
    points: 1
  },
  {
    number: 35,
    prompt: "When a person vigorously rubs the palms of their hands together on a cold morning, mechanical kinetic energy is transformed into:",
    correctAnswer: "Thermal heat energy",
    distractors: [
      "Gravitational potential energy",
      "Radiant solar energy",
      "Elastic potential energy"
    ],
    hint: "Work done against kinetic friction generates warmth.",
    workedSolution: "Muscular kinetic energy moving the hands does work against surface friction between the palms, transforming kinetic energy directly into thermal heat energy.",
    points: 1
  },
  {
    number: 36,
    prompt: "Trees indigenous to arid desert regions (such as *Acacia*) possess thick corky bark primarily to:",
    correctAnswer: "Form an insulating barrier that prevents internal water desiccation",
    distractors: [
      "Accelerate heat dissipation into the air",
      "Absorb additional visible light photons",
      "Maximize water absorption from the atmosphere"
    ],
    hint: "Thick corky suberin layers prevent moisture evaporation through trunk bark.",
    workedSolution: "Thick, suberized bark insulates the tree from high desert temperatures and forms a waterproof barrier that minimizes evaporative water loss from internal tissues.",
    points: 1
  },
  {
    number: 37,
    prompt: "Which of the following agronomic statements concerning fertile loamy soil are TRUE?\nI. It is formed from a balanced textural mixture of sand, silt, and clay\nII. It is ideal for the cultivation of most agricultural crops\nIII. Its water retention capacity is poor and excessive",
    correctAnswer: "I and II only",
    distractors: [
      "I only",
      "I and III only",
      "II and III only"
    ],
    hint: "Loam combines good water retention with adequate drainage, making statement III false.",
    workedSolution: "Loamy soil combines sand, silt, and clay with organic matter, providing optimal aeration, nutrient retention, and balanced water drainage for crop cultivation (I and II).",
    points: 1
  },
  {
    number: 38,
    prompt: "In the human digestive tract, in which anatomical region is food completely digested into absorbable monomers and absorbed into the bloodstream?",
    correctAnswer: "The small intestine (Ileum)",
    distractors: [
      "The muscular esophagus",
      "The buccal mouth cavity",
      "The acidic stomach"
    ],
    hint: "Surface area is expanded by millions of microscopic finger-like villi.",
    workedSolution: "Terminal digestion and nutrient absorption occur in the small intestine (ileum). Microscopic villi and microvilli absorb glucose, amino acids, and fatty acids into blood and lymph.",
    points: 1
  },
  {
    number: 39,
    prompt: "In cosmological astronomy, the vast interstellar distances separating stars and planetary systems in deep space are measured in:",
    correctAnswer: "Light-years (or Astronomical Units / Parsecs)",
    distractors: [
      "Maritime nautical knots",
      "Standard metric kilometers",
      "Traditional English furlongs"
    ],
    hint: "The distance light travels through a vacuum in one Earth year (≈ 9.46 * 10^12 km).",
    workedSolution: "Interstellar distances are immense, so astronomers measure distances between stars in light-years (the distance light travels in one year, ≈ 9.46 * 10^12 km) or parsecs.",
    points: 1
  },
  {
    number: 40,
    prompt: "During physiological fertilization in humans, which event occurs at the precise moment of syngamy?",
    correctAnswer: "A single spermatozoon penetrates the ovum, triggering a membrane block to polyspermy",
    distractors: [
      "Multiple sperm nuclei fuse simultaneously with the egg",
      "The unfertilized egg immediately cleaves into two identical cells",
      "The egg moves backward into the ovarian follicle"
    ],
    hint: "The cortical reaction alters the vitelline membrane to block additional sperm.",
    workedSolution: "Only one sperm fertilizes the ovum. Upon entry of the sperm head, the egg undergoes a cortical reaction that hardens the zona pellucida, blocking polyspermy before pronuclei fuse.",
    points: 1
  }
];

// Seeded target permutation ensuring exactly 10 A, 10 B, 10 C, 10 D
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

const assignedTargetIndices = seedShuffle(targetKeys, 199606);

export const balancedScience1996P1: QuestionItem[] = rawScienceBank.map((q, idx) => {
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

// ==========================================
// PAPER 2 ESSAY QUESTIONS BANK (CALIBRATED)
// ==========================================
export const paper2Science1996Questions: Paper2Question[] = [
  // ==========================================
  // QUESTION 1: CONCEPTS, FEMALE ANATOMY, WORK & CHEMISTRY (20 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Define each of the following scientific terms:
(i) Soil erosion;
(ii) Biological reproduction;
(iii) Biological parasite;
(iv) Metabolic excretion.`,
        workedSolution: `(i) Soil erosion:
The physical detachment, wearing away, and transport of topsoil from one location to another by natural physical agents, primarily running water and wind.

(ii) Biological reproduction:
The vital physiological process by which mature living organisms produce new individuals of their own kind, ensuring the continuation and numerical survival of the species.

(iii) Biological parasite:
An organism that lives in or on another living organism (the host), obtaining nutrients and shelter while causing physiological harm or disease to the host.

(iv) Metabolic excretion:
The biological process by which toxic metabolic waste products of cellular activity (such as urea, uric acid, carbon dioxide, and excess mineral salts) are eliminated from the body.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "Give one specific everyday practical example each of:\n(i) Soil erosion;\n(ii) A biological parasite and its host.",
        workedSolution: `(i) Example of erosion:
Gully erosion or rill erosion scouring topsoil on bare, cleared sloping farmlands following heavy rainfall.

(ii) Example of parasite and host:
*Plasmodium falciparum* (protozoan parasite) living inside the bloodstream and liver of a human being (host).
*(Alternative: Ticks feeding on cattle; Tapeworms in human intestines)*.`,
        maxMarks: 2
      },
      {
        subId: "(c)",
        prompt: `Draw a clear, fully labelled diagram of the human female reproductive system, showing the Uterus, Fallopian tubes (Oviducts), Ovaries, Cervix, and Vagina:

${svgQ1cFemaleReproductive}`,
        workedSolution: `Diagram Description (refer to vector schematic):
Anterior view showing:
1. **Ovaries:** Paired oval organs producing ova and female sex hormones (estrogen, progesterone).
2. **Fallopian Tubes (Oviducts):** Ciliated tubes connecting ovaries to the uterus; site of fertilization.
3. **Uterus (Womb):** Pear-shaped muscular organ where the embryo implants and develops during gestation.
4. **Cervix:** Muscular lower neck of the uterus connecting to the vagina.
5. **Vagina:** Muscular canal serving as the copulatory organ and birth canal.`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: `(i) Define the physical term mechanical work.
(ii) An amount of $300.0\\text{ J}$ of work is done when an applied force moves an object through a distance of $10.0\\text{ m}$ in the direction of the force. Calculate the magnitude of the applied force.`,
        workedSolution: `(i) Definition of work:
Work is done whenever an applied force moves an object through a displacement distance in the direction of the force:
$$W = F \\times d$$
measured in Joules (J).

(ii) Force calculation:
Formula:
$$F = \\frac{W}{d}$$
Substitute given values ($W = 300.0\\text{ J}$, $d = 10.0\\text{ m}$):
$$F = \\frac{300.0\\text{ J}}{10.0\\text{ m}} = 30.0\\text{ Newtons (N)}$$
Answer: The value of the force is $$30.0\\text{ N}$$.`,
        maxMarks: 4
      },
      {
        subId: "(e)",
        prompt: `Write down the systematic chemical names for each of the following compounds:
(i) $\\text{NH}_4\\text{Cl}$;
(ii) $\\text{HCl}$;
(iii) $\\text{CuSO}_4$;
(iv) $\\text{FeCl}_3$.`,
        workedSolution: `Systematic chemical names:
• (i) $\\text{NH}_4\\text{Cl}$: **Ammonium chloride**
• (ii) $\\text{HCl}$: **Hydrochloric acid** (or Hydrogen chloride)
• (iii) $\\text{CuSO}_4$: **Copper (II) sulfate**
• (iv) $\\text{FeCl}_3$: **Iron (III) chloride**`,
        maxMarks: 3
      },
      {
        subId: "(f)",
        prompt: "Describe how pure solid sulfur can be separated and recovered from a dry powder mixture of sulfur and iron filings.",
        workedSolution: `Separation protocol (Solvent extraction method):
1. **Dissolution:** Add carbon disulfide ($\text{CS}_2$) [or methylbenzene] to the mixture in a beaker and stir thoroughly. The solid sulfur dissolves completely into the solvent, while insoluble iron filings remain undissolved.
2. **Filtration:** Pour the suspension through a filter funnel fitted with filter paper. The iron filings are retained on the paper as residue.
3. **Evaporation / Crystallization:** Allow the clear sulfur filtrate to evaporate in a fume chamber; the volatile carbon disulfide evaporates off, leaving pure rhombic sulfur crystals.
*(Alternative: Magnetic separation using a bar magnet to extract the ferromagnetic iron filings)*.`,
        maxMarks: 2
      }
    ]
  },

  // ==========================================
  // QUESTION 2: ECLIPSE, LEVERS, POLLINATION & ALLOYS (20 MARKS)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Draw and label a ray diagram showing how a solar eclipse (eclipse of the Sun) is formed in nature:

${svgQ2aSolarEclipse}`,
        workedSolution: `Ray Diagram Description (refer to vector schematic):
• A large luminous sphere representing the **Sun** emitting light rays.
• An opaque, smaller sphere representing the **Moon** passing directly between the Sun and Earth in a straight line (syzygy).
• Direct and cross light rays showing the **Umbra** (inner cone of total darkness hitting Earth) and the **Penumbra** (outer cone of partial shadow).
• The larger sphere representing the **Earth** receiving the shadows.`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: `(i) What is a mechanical lever in simple machines?
(ii) Classify the following tools as a First-class, Second-class, or Third-class lever:
Beam balance, Crowbar, Wheelbarrow, Pair of scissors, Claw hammer, Sugar tongs, Human forearm, Bottle opener.`,
        workedSolution: `(i) Definition of lever:
A simple machine consisting of a rigid bar pivoted about a fixed axis (fulcrum), used to transmit or multiply mechanical force when an effort is applied to move a load.

(ii) Classification Table:

| Lever Class | Identifying Relative Position | Examples from List |
| :--- | :--- | :--- |
| **First Class** | Fulcrum is between Effort and Load | **Beam balance, Crowbar, Pair of scissors, Claw hammer** |
| **Second Class** | Load is between Fulcrum and Effort | **Wheelbarrow, Bottle opener** |
| **Third Class** | Effort is between Fulcrum and Load | **Sugar tongs, Human forearm** |`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `(i) What is biological pollination in flowering plants?
(ii) Name two natural agents that bring about pollination in crops.`,
        workedSolution: `(i) Definition of pollination:
The transfer of mature pollen grains from the anther of a stamen to the receptive stigma of a carpel in flowering plants.

(ii) Agents of pollination:
1. **Insects** (honeybees, butterflies, moths)
2. **Wind** (air currents)
*(Alternatives: Birds, bats, water)*`,
        maxMarks: 3
      },
      {
        subId: "(d)",
        prompt: "Name three primary excretory organs in the human body and state the specific metabolic waste products eliminated by each.",
        workedSolution: `1. **The Kidneys:** Excrete **urine** (containing urea, uric acid, excess water, and dissolved mineral salts).
2. **The Skin (Eccrine sweat glands):** Excretes **sweat** (containing water, sodium chloride mineral salts, and traces of urea).
3. **The Lungs:** Excrete **carbon dioxide gas** and **water vapor** produced during cellular aerobic respiration.`,
        maxMarks: 3
      },
      {
        subId: "(e)",
        prompt: `(i) What is a metallic alloy in industrial metallurgy?
(ii) State the constituent chemical elements of each of the following alloys:
  (α) Bronze;
  (β) Brass;
  (γ) Carbon steel;
  (δ) Duralumin.`,
        workedSolution: `(i) Definition of alloy:
A homogeneous solid solution or uniform metallic mixture composed of two or more metals, or a metal melted with a non-metal, combined to improve mechanical strength, hardness, or corrosion resistance.

(ii) Alloy compositions:
• (α) Bronze: **Copper [Cu]** and **Tin [Sn]**
• (β) Brass: **Copper [Cu]** and **Zinc [Zn]**
• (γ) Carbon steel: **Iron [Fe]** and **Carbon [C]**
• (δ) Duralumin: **Aluminum [Al]**, **Copper [Cu]**, **Magnesium [Mg]**, and **Manganese [Mn]**`,
        maxMarks: 3
      },
      {
        subId: "(f)",
        prompt: "Write down a balanced chemical equation for the neutralization reaction between dilute hydrochloric acid and aqueous sodium hydroxide solution.",
        workedSolution: `Balanced chemical equation:
$$\\text{NaOH}_{(aq)} + \\text{HCl}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)}$$
*(Aqueous sodium hydroxide reacts with hydrochloric acid in a 1:1 molar ratio to produce aqueous sodium chloride and liquid water)*.`,
        maxMarks: 1
      }
    ]
  },

  // ==========================================
  // QUESTION 3: ATOMS, DIGESTION, PRESERVATION & OPTICS (20 MARKS)
  // ==========================================
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `An atom of an element has an atomic number of 8 and a mass number of 16 ($_{8}^{16}\\text{O}$).
(i) State the number of protons in the atom;
(ii) State the number of electrons in the neutral atom;
(iii) State the number of neutrons in the nucleus.`,
        workedSolution: `Nuclear calculations:
• (i) Protons $= \\text{Atomic Number } (Z) = 8$
• (ii) Electrons in neutral atom $= \\text{Protons} = 8$
• (iii) Neutrons $= \\text{Mass Number } (A) - \\text{Atomic Number } (Z) = 16 - 8 = 8$`,
        maxMarks: 3
      },
      {
        subId: "(b)",
        prompt: `(i) Draw the Bohr electron shell structure of the atom in (a) above, showing the nucleus and occupied electron shells:

${svgQ3bOxygenAtom}

(ii) If this neutral atom gains two valence electrons to attain a stable octet, what will be the electrical charge and symbol of the resulting ion?`,
        workedSolution: `(i) Bohr structure description (refer to vector schematic):
• Central nucleus containing 8 protons and 8 neutrons ($8p, 8n$).
• Innermost $K$-shell containing 2 electrons.
• Outermost $L$-shell containing 6 valence electrons (electronic configuration: $2, 6$).

(ii) Ion charge and symbol:
Gaining two negative electrons gives $8 - 10 = -2$ net charge.
• Electrical charge: **-2 (dipositive anion, $2^-$)**
• Ion symbol: **O²⁻ (Oxide anion)**`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: `State the final absorbable monomeric end-products of complete chemical digestion for each of the following dietary macronutrients:
(i) Carbohydrates;
(ii) Proteins;
(iii) Fats and oils.`,
        workedSolution: `End-products of digestion:
• (i) Carbohydrates: **Simple monosaccharides (principally Glucose)**
• (ii) Proteins: **Amino acids**
• (iii) Fats and oils: **Fatty acids and glycerol**`,
        maxMarks: 3
      },
      {
        subId: "(d)",
        prompt: `(i) What is meant by the preservation of food?
(ii) List four common methods of food preservation practiced in Ghana.
(iii) Explain the scientific principle underlying why one of the methods listed prevents food spoilage.`,
        workedSolution: `(i) Definition of food preservation:
The process of treating and handling food to prevent or greatly slow down spoilage, loss of quality, or nutritional value caused by microorganisms, enzymes, and oxidation, allowing safe storage for future consumption.

(ii) Four methods of food preservation:
1. **Thermal Smoking** (e.g., smoked fish)
2. **Salting / Curing** (e.g., salted tilapia/momoni)
3. **Sun Drying / Dehydration** (e.g., dried pepper, maize)
4. **Freezing / Cold Storage**
5. **Canning / Bottling**

(iii) Scientific rationale (e.g., Salting / Dehydration):
Adding concentrated salt draws water out of microbial cells (bacteria and molds) and food tissues by **osmosis**. Removing free water creates a hypertonic environment where microorganisms cannot survive or reproduce, preventing bacterial decay.`,
        maxMarks: 5
      },
      {
        subId: "(e)",
        prompt: `(i) Draw a ray diagram showing how a virtual optical image of an object is formed by reflection in a flat plane mirror.
(ii) State two permanent characteristics of the image formed by a plane mirror.`,
        workedSolution: `(i) Ray diagram description:
• An upright object placed in front of a vertical plane mirror.
• Diverging light rays from the top of the object strike the mirror and reflect following the Law of Reflection ($i = r$).
• Projecting the reflected rays backward behind the mirror with dashed lines locates the virtual image point.
• The image is formed behind the mirror at an image distance ($v$) equal to the object distance ($u$).

(ii) Characteristics of image:
1. **Virtual:** Cannot be formed or captured on a physical screen.
2. **Upright (Erect) and Laterally Inverted:** Left and right sides are reversed.
3. **Same Size:** Image height equals object height (magnification $= 1$).
4. **Equal Distance:** Distance behind mirror equals distance of object in front.`,
        maxMarks: 5
      }
    ]
  },

  // ==========================================
  // QUESTION 4: PATHOLOGY, CROPS, RESPIRATION & CHANGES (20 MARKS)
  // ==========================================
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) Give the specific names of the biological pathogen or organism that causes each of the following diseases:
  • Sleeping sickness;
  • Cholera;
  • Malaria;
  • Bilharzia (Schistosomiasis).
(ii) Which specific vegetative planting part does a farmer use to propagate each of the following crops:
  • Banana;
  • Cocoyam;
  • Tomato;
  • Ginger;
  • Yam;
  • Cassava.`,
        workedSolution: `(i) Disease Pathogens:
• Sleeping sickness: ***Trypanosoma brucei*** (protozoan transmitted by tsetse fly)
• Cholera: ***Vibrio cholerae*** (bacterium)
• Malaria: ***Plasmodium*** (*P. falciparum* protozoan)
• Bilharzia: ***Schistosoma*** (*S. haematobium* blood fluke)

(ii) Planting Parts:
• Banana: **Sword sucker (or corm piece)**
• Cocoyam: **Corm (or cormel piece)**
• Tomato: **Botanical seed**
• Ginger: **Underground rhizome piece**
• Yam: **Yam sett / seed yam (tuber piece)**
• Cassava: **Stem cutting (woody stake)**`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: `Name the specific anatomical respiratory organs used for external gas exchange by:
(i) Tilapia fish;
(ii) Adult terrestrial toad.`,
        workedSolution: `(i) Tilapia fish:
**Gills** (vascularized gill filaments).

(ii) Adult toad:
**Lungs**, **moist glandular skin (cutaneous respiration)**, and the **buccopharyngeal cavity (mouth lining)**.`,
        maxMarks: 2
      },
      {
        subId: "(c)",
        prompt: `(i) What happens to the temperature of pure water while it is boiling vigorously in an open container?
(ii) Give two macroscopic physical characteristics of a substance in the liquid state.
(iii) Name the three physical processes by which thermal heat is transferred.
(iv) State two practical engineering applications of the thermal expansion of solids in everyday life.`,
        workedSolution: `(i) Temperature of boiling water:
The temperature **remains constant at 100°C** (at standard atmospheric pressure); supplied thermal energy is consumed as latent heat of vaporization to break intermolecular hydrogen bonds.

(ii) Characteristics of a liquid:
1. Possesses a **fixed, definite physical volume**.
2. Has **no fixed shape**, taking the shape of the container it occupies.
3. Incompressible under modest pressures with particles sliding freely over one another.

(iii) Processes of heat transfer:
1. **Conduction**
2. **Convection**
3. **Radiation**

(iv) Applications of thermal expansion:
1. **Bimetallic strips** in electrical thermostats (irons, fire alarms, refrigerators).
2. **Shrink-fitting** of steel tires onto railway locomotive wheels.
3. **Expansion gaps** left between railway tracks and bridge rollers to accommodate expansion without buckling.`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: `In chemical science, explain what is meant by:
(i) A physical change;
(ii) A chemical change.`,
        workedSolution: `(i) Physical change:
A reversible change in which the physical state, shape, or appearance of a substance is altered without changing its molecular composition or forming new chemical substances.

(ii) Chemical change:
An irreversible change in which chemical bonds are broken and formed, producing one or more entirely new chemical substances with distinct properties, accompanied by significant absorption or evolution of energy.`,
        maxMarks: 2
      },
      {
        subId: "(e)",
        prompt: `Classify each of the following processes as either a Physical change or a Chemical change:
(i) Rusting of an iron nail;
(ii) Freezing of liquid water into ice;
(iii) Burning of firewood to ash;
(iv) Fermentation of palm wine into alcohol;
(v) Grinding a stick of chalk into powder;
(vi) Dissolving table sugar in water.`,
        workedSolution: `Classification:
• (i) Rusting of iron: **Chemical change** (oxidation to hydrated iron (III) oxide)
• (ii) Freezing of water: **Physical change** (reversible phase change $\\text{H}_2\\text{O}_{(l)} \\to \\text{H}_2\\text{O}_{(s)}$)
• (iii) Burning of wood: **Chemical change** (combustion producing $\\text{CO}_2$, $\\text{H}_2\\text{O}$, and ash)
• (iv) Fermentation: **Chemical change** (enzymatic conversion of sugars into ethanol and $\\text{CO}_2$)
• (v) Grinding chalk: **Physical change** (reduces particle size without altering chemical $\\text{CaCO}_3$)
• (vi) Dissolving sugar: **Physical change** (reversible dissolution forming a homogeneous mixture)`,
        maxMarks: 3
      },
      {
        subId: "(f)",
        prompt: `Write down the systematic chemical name of the binary compound formed when each of the following pairs of elements combine chemically:
(i) Iron and Sulfur;
(ii) Zinc and Oxygen;
(iii) Sodium and Chlorine;
(iv) Calcium and Chlorine.`,
        workedSolution: `Binary Compounds Formed:
• (i) Iron + Sulfur $\\to$ **Iron (II) sulfide** [$\\text{FeS}$]
• (ii) Zinc + Oxygen $\\to$ **Zinc oxide** [$\\text{ZnO}$]
• (iii) Sodium + Chlorine $\\to$ **Sodium chloride** [$\\text{NaCl}$]
• (iv) Calcium + Chlorine $\\to$ **Calcium chloride** [$\\text{CaCl}_2$]`,
        maxMarks: 3
      }
    ]
  }
];

// ==========================================
// EXPORTED EXAM BUNDLES
// ==========================================
export const SET_BECE_1996_SCIENCE_P1 = {
  year: 1996,
  isVariant: true,
  setNumber: 128,
  subject: "Integrated Science",
  paperNumber: 1,
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  title: "Paper 1: Objective Test (Variant)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedScience1996P1
};

export const SET_BECE_1996_SCIENCE_P2 = {
  year: 1996,
  isVariant: true,
  setNumber: 128,
  subject: "Integrated Science",
  paperNumber: 2,
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  title: "Paper 2: Practical & Theory Essay (Variant)",
  durationMinutes: 75,
  instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 4,
  questions: paper2Science1996Questions
};

export const SET_BECE_1996_SCIENCE_COMPLETE = {
  year: 1996,
  isVariant: true,
  setNumber: 128,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: {
    title: "Paper 1: Objective Test (Variant)",
    durationMinutes: 45,
    totalQuestions: 40,
    questions: balancedScience1996P1
  },
  paper2: {
    title: "Paper 2: Practical & Theory Essay (Variant)",
    durationMinutes: 75,
    instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
    totalQuestions: 4,
    questions: paper2Science1996Questions
  },
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 3,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
