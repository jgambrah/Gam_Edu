/**
 * JHS Curriculum Data - Set 130
 * 1998 BECE Integrated Science Complete Variant (Paper 1 & Paper 2)
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
// INLINE VECTOR SVGs
// ==========================================

// SVG for Q4(c): Bohr Electron Shell Structure of Lithium Atom (Z=3)
export const svgQ4cLithiumAtom = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 220' width='100%' height='200' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Central Nucleus (3p, 3n) -->
    <circle cx='170' cy='110' r='24' fill='#ef4444' opacity='0.4' stroke='#ef4444' stroke-width='2'/>
    <text x='170' y='107' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>3 Protons</text>
    <text x='170' y='120' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>3 Neutrons</text>

    <!-- Shell 1: K-Shell (holds 2 electrons) -->
    <circle cx='170' cy='110' r='48' fill='none' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='3,2'/>
    <circle cx='170' cy='62' r='4' fill='#38bdf8'/>
    <circle cx='170' cy='158' r='4' fill='#38bdf8'/>
    <text x='225' y='65' font-size='9' font-weight='bold' fill='#38bdf8'>K-shell (2e⁻)</text>

    <!-- Shell 2: L-Shell (holds 1 valence electron) -->
    <circle cx='170' cy='110' r='82' fill='none' stroke='#10b981' stroke-width='1.8'/>
    <circle cx='170' cy='28' r='4.5' fill='#10b981'/>
    <text x='230' y='32' font-size='9' font-weight='bold' fill='#10b981'>L-shell (1e⁻)</text>

    <text x='170' y='210' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LITHIUM ATOM (Z=3): 2, 1 ELECTRONIC CONFIGURATION</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q39 / Histology: Alveolar-Capillary Gas Exchange
export const svgAlveolarGasExchange = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 360 210' width='100%' height='195' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Alveolus Air Sac (Left) -->
    <path d='M 130 30 C 50 30 30 90 30 130 C 30 170 70 190 120 190 C 135 190 145 180 145 165 C 145 120 145 60 130 30 Z' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='2'/>
    <text x='85' y='110' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Alveolus</text>
    <text x='85' y='125' font-size='9' fill='#94a3b8' text-anchor='middle'>(Air Sac)</text>

    <!-- Pulmonary Capillary (Right) -->
    <path d='M 175 25 C 165 75 165 145 175 195 L 245 195 C 235 145 235 75 245 25 Z' fill='#ef4444' opacity='0.25' stroke='#f87171' stroke-width='2'/>
    <text x='205' y='110' font-size='11' font-weight='bold' fill='#f87171' text-anchor='middle'>Capillary</text>
    <text x='205' y='125' font-size='9' fill='#94a3b8' text-anchor='middle'>(Blood Stream)</text>

    <!-- Gas Exchange Diffusion Arrows -->
    <!-- Oxygen (Alveolus -> Capillary) -->
    <line x1='115' y1='65' x2='175' y2='65' stroke='#10b981' stroke-width='2.5'/>
    <polygon points='175,65 167,61 167,69' fill='#10b981'/>
    <text x='145' y='55' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>O₂ In</text>

    <!-- Carbon Dioxide (Capillary -> Alveolus) -->
    <line x1='175' y1='155' x2='115' y2='155' stroke='#38bdf8' stroke-width='2.5'/>
    <polygon points='115,155 123,151 123,159' fill='#38bdf8'/>
    <text x='145' y='170' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>CO₂ Out</text>

    <!-- Red Blood Cells -->
    <circle cx='205' cy='48' r='7' fill='#ef4444' stroke='#b91c1c'/>
    <circle cx='205' cy='165' r='7' fill='#ef4444' stroke='#b91c1c'/>

    <text x='180' y='202' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>ALVEOLAR-CAPILLARY MEMBRANE GAS DIFFUSION</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// ==========================================
// 40 OBJECTIVE TEST QUESTIONS (RAW BANK)
// ==========================================
interface RawQuestion {
  number: number;
  prompt: string;
  correctAnswer: string;
  distractors: string[];
  hint: string;
  workedSolution: string;
  points: number;
}

const rawScienceBank: RawQuestion[] = [
  {
    number: 1,
    prompt: "Which of the following combined traditional food preservation methods is most effective for preserving fresh fish for a prolonged period?",
    correctAnswer: "Thorough salting combined with complete sun drying (or thermal smoking)",
    distractors: [
      "Thermal boiling in water only",
      "Surface salting only without drying",
      "Brief sun drying only without salting"
    ],
    hint: "Salt draws out moisture via osmosis, and drying removes water needed by bacteria.",
    workedSolution: "Combining salting with sun drying dehydrates tissues and creates a hypertonic environment that inhibits microbial enzymes and bacterial decomposition, preserving fish long-term.",
    points: 1
  },
  {
    number: 2,
    prompt: "In agricultural land survey and metric area measurements, one hectare ($1\\text{ ha}$) is equivalent to:",
    correctAnswer: "10,000 m²",
    distractors: [
      "100 m²",
      "1,000 m²",
      "100,000 m²"
    ],
    hint: "$$1\\text{ hectare} = 100\\text{ m} \\times 100\\text{ m}$$.",
    workedSolution: "A hectare is a metric unit of area defined as a square of 100 meters on each side: $100\\text{ m} \\times 100\\text{ m} = 10,000\\text{ m}^2$.",
    points: 1
  },
  {
    number: 3,
    prompt: "Which of the following biological pathogens is the causative agent of the contagious human skin infection ringworm (tinea)?",
    correctAnswer: "Parasitic fungi [Dermatophytes]",
    distractors: [
      "Pathogenic bacteria",
      "Unicellular protozoa",
      "Parasitic pasture ticks"
    ],
    hint: "Fungal pathogens such as *Trichophyton* and *Microsporum* that feed on skin keratin.",
    workedSolution: "Ringworm is a cutaneous fungal infection caused by dermatophytes that metabolize keratin in skin, hair, and nails. It is not caused by worms or bacteria.",
    points: 1
  },
  {
    number: 4,
    prompt: "In mammalian neuroanatomy, the Central Nervous System (CNS) is anatomically composed of the:",
    correctAnswer: "Brain and the spinal cord",
    distractors: [
      "Brain and the cranial nerves only",
      "Spinal cord and peripheral nerves only",
      "Brain and the peripheral sense organs"
    ],
    hint: "The central integration and command center enclosed in the skull and vertebral canal.",
    workedSolution: "The Central Nervous System (CNS) consists of the brain and the spinal cord. Cranial and spinal nerves form the Peripheral Nervous System (PNS).",
    points: 1
  },
  {
    number: 5,
    prompt: "A heavy container weighing $60.0\\text{ N}$ is dragged across a horizontal floor through a distance of $2.0\\text{ m}$. Calculate the mechanical work done:",
    correctAnswer: "120.0 Joules",
    distractors: [
      "6.0 Joules",
      "15.0 Joules",
      "30.0 Joules"
    ],
    hint: "$$\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (d) = 60.0 \\times 2.0$$.",
    workedSolution: "$$\\text{Work Done } (W) = F \\times d = 60.0\\text{ N} \\times 2.0\\text{ m} = 120.0\\text{ Joules (J)}$$.",
    points: 1
  },
  {
    number: 6,
    prompt: "Which of the following inorganic atmospheric gases is essential for autotrophic plants to synthesize glucose during photosynthesis?",
    correctAnswer: "Carbon dioxide [CO₂]",
    distractors: [
      "Diatomic nitrogen gas [N₂]",
      "Diatomic oxygen gas [O₂]",
      "Stored plant starch"
    ],
    hint: "Diffuses into leaves through stomata to provide carbon atoms for glucose.",
    workedSolution: "Carbon dioxide (CO₂) is absorbed from air through stomata and fixed into organic glucose during photosynthesis: $6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$.",
    points: 1
  },
  {
    number: 7,
    prompt: "In astronomical climatology, how many times in a calendar year is the Sun directly overhead at the Equator at noon?",
    correctAnswer: "Twice a year (during the March and September equinoxes)",
    distractors: [
      "Once a year",
      "Three times a year",
      "Four times a year"
    ],
    hint: "Occurs during the two equinoxes (approximately March 21 and September 23).",
    workedSolution: "The Sun is directly overhead at the Equator twice a year during the equinoxes (around March 21 and September 23), when day and night are of equal duration worldwide.",
    points: 1
  },
  {
    number: 8,
    prompt: "Which of the following substances possesses a fixed volume but lacks a rigid shape, conforming to the shape of its container?",
    correctAnswer: "Liquid commercial petrol",
    distractors: [
      "Solid writing chalk",
      "Solid wood charcoal",
      "A dry sheet of paper"
    ],
    hint: "Liquids flow and take the shape of the container while maintaining a constant volume.",
    workedSolution: "Petrol is a liquid; its particles flow over one another to take the shape of the vessel while maintaining a definite, fixed volume. Chalk, charcoal, and paper are rigid solids.",
    points: 1
  },
  {
    number: 9,
    prompt: "In galactic astronomy, a vast gravitationally bound system containing billions of stars, interstellar dust, and gas clouds forms:",
    correctAnswer: "A galaxy [e.g., The Milky Way]",
    distractors: [
      "The planetary solar system",
      "The tropospheric atmosphere",
      "A local asteroid belt"
    ],
    hint: "A vast stellar system containing billions of stars; solar systems reside inside galaxies.",
    workedSolution: "A galaxy is an immense gravitationally bound system of stars, stellar remnants, gas, and dark matter. Our Solar System is situated within the Milky Way Galaxy.",
    points: 1
  },
  {
    number: 10,
    prompt: "Which of the following soil types possesses balanced water retention, high aeration, and high fertility, making it ideal for agricultural crop growth?",
    correctAnswer: "Loamy soil",
    distractors: [
      "Heavy compact clay",
      "Coarse gravelly sand",
      "Fine loose quartz sand"
    ],
    hint: "A balanced textural mixture of sand, silt, clay, and decomposed humus.",
    workedSolution: "Loam contains a balanced blend of sand, silt, and clay with organic humus, providing optimal drainage, capillary water retention, and root aeration for crops.",
    points: 1
  },
  {
    number: 11,
    prompt: "The biochemical word equation:\n$$\\text{Carbon (IV) oxide} + \\text{Water} \\xrightarrow[\\text{chlorophyll}]{\\text{light}} \\text{Glucose} + \\text{Oxygen}$$\nrepresents the biological process of:",
    correctAnswer: "Photosynthesis",
    distractors: [
      "Pulmonary breathing",
      "Molecular gas diffusion",
      "Aerobic cellular respiration"
    ],
    hint: "The light-driven conversion of inorganic substrates into organic chemical energy.",
    workedSolution: "This equation represents photosynthesis, in which green plants convert radiant solar energy into chemical energy stored in glucose, releasing oxygen as a byproduct.",
    points: 1
  },
  {
    number: 12,
    prompt: "Which of the following pairs of clinical human diseases are both waterborne infections contracted through drinking contaminated water?",
    correctAnswer: "Cholera and amoebic dysentery",
    distractors: [
      "Smallpox and bacillary dysentery",
      "Ringworm and smallpox",
      "Pulmonary tuberculosis and cholera"
    ],
    hint: "Both are enteric diarrheal infections transmitted via the fecal-oral route in water.",
    workedSolution: "Cholera (*Vibrio cholerae*) and dysentery (*Shigella* or *Entamoeba*) spread through drinking water contaminated with fecal matter. Tuberculosis and smallpox are airborne.",
    points: 1
  },
  {
    number: 13,
    prompt: "In mechanical physics, the operational efficiency of any practical machine is always less than 100% primarily because of:",
    correctAnswer: "Mechanical friction between moving contact parts",
    distractors: [
      "Routine oiling and greasing",
      "The magnitude of the load being lifted",
      "The mechanical velocity ratio"
    ],
    hint: "Friction converts useful mechanical work into wasted thermal heat.",
    workedSolution: "Frictional resistance between moving parts and the weight of machine components converts a portion of input energy into wasted heat and sound, keeping efficiency below 100%.",
    points: 1
  },
  {
    number: 14,
    prompt: "In terrestrial and aquatic ecosystems, which pair of biological organisms serves as the primary saprophytic decomposers of organic biomass?",
    correctAnswer: "Bacteria and fungi",
    distractors: [
      "Herbivorous animals and bacteria",
      "Carnivorous animals and fungi",
      "Autotrophic plants and bacteria"
    ],
    hint: "Microscopic saprophytes that secrete digestive enzymes onto dead organic matter.",
    workedSolution: "Bacteria and fungi are the primary decomposers in nature, breaking down dead organic matter and mineralizing locked nutrients to restore soil fertility.",
    points: 1
  },
  {
    number: 15,
    prompt: "A heterogeneous liquid mixture of lubricating engine oil and water is separated most effectively in a laboratory by:",
    correctAnswer: "Using a separating funnel (or gravity decantation)",
    distractors: [
      "Thermal evaporation to dryness",
      "Freezing crystallization",
      "Heating in a closed crucible"
    ],
    hint: "The two liquids are immiscible with different densities, forming distinct layers.",
    workedSolution: "Engine oil and water are immiscible liquids with different densities. In a separating funnel, the denser water layer drains through the stopcock, leaving the lighter oil behind.",
    points: 1
  },
  {
    number: 16,
    prompt: "Which of the following cultivated agricultural fruit crops is routinely propagated vegetatively (by budding, grafting, or stem layering)?",
    correctAnswer: "Avocado pear [Persea americana]",
    distractors: [
      "Pawpaw [Carica papaya]",
      "Coconut palm [Cocos nucifera]",
      "Wild forest apple"
    ],
    hint: "Propagated via vegetative grafting or budding to preserve high fruit quality.",
    workedSolution: "Avocado pear and citrus are propagated vegetatively through budding or grafting to preserve desirable fruit traits and hasten fruiting. Pawpaw and coconut are grown from seeds.",
    points: 1
  },
  {
    number: 17,
    prompt: "Which of the following infectious diseases is transmitted through direct contact and airborne respiratory droplets from an infected person?",
    correctAnswer: "Measles [Morbillivirus]",
    distractors: [
      "Bilharziasis (Schistosomiasis)",
      "Elephantiasis (Lymphatic filariasis)",
      "HIV/AIDS (via body fluids)"
    ],
    hint: "A highly contagious viral infection characterized by high fever and a full-body rash.",
    workedSolution: "Measles is a contagious airborne viral infection spread through respiratory droplets and direct contact. Bilharzia is waterborne, and elephantiasis is transmitted by mosquitoes.",
    points: 1
  },
  {
    number: 18,
    prompt: "In physical pedology and geology, the mechanical and chemical disintegration of parent rock into smaller mineral particles in situ is:",
    correctAnswer: "Weathering",
    distractors: [
      "Surface soil erosion",
      "Organic decomposition",
      "Deep contour ploughing"
    ],
    hint: "The breakdown of rocks in place without transport; erosion involves transport.",
    workedSolution: "Weathering is the breakdown of rocks into smaller mineral fragments in situ by physical, chemical, and biological agents. Erosion involves detachment and transport.",
    points: 1
  },
  {
    number: 19,
    prompt: "What sequence of energy conversions takes place when a church bell is tolled by a swinging metal clapper?",
    correctAnswer: "Mechanical kinetic energy is converted into acoustic sound energy and heat",
    distractors: [
      "Chemical energy is converted into sound energy directly",
      "Gravitational potential energy converts into electrical energy",
      "Potential energy converts into nuclear energy"
    ],
    hint: "The moving clapper strikes the bell shell, causing vibrations that produce sound.",
    workedSolution: "The mechanical kinetic energy of the moving clapper strikes the bell shell, setting up acoustic air pressure waves (sound energy) along with minor thermal heat.",
    points: 1
  },
  {
    number: 20,
    prompt: "The twining growth of a parasitic dodder plant (*Cuscuta*) on a green milk bush shrub is an ecological example of a:",
    correctAnswer: "Plant parasite feeding on a plant host",
    distractors: [
      "Plant parasite feeding on an animal host",
      "Mutualistic association beneficial to both",
      "Animal parasite feeding on an animal host"
    ],
    hint: "Dodder lacks chlorophyll and taps sap from the host shrub using haustoria.",
    workedSolution: "Dodder (*Cuscuta*) is a parasitic flowering plant that wraps around host plants (such as milk bush), penetrating vascular bundles with haustoria to extract nutrients (plant-on-plant parasitism).",
    points: 1
  },
  {
    number: 21,
    prompt: "Which of the following physiological processes occurs in vascular green plants but is ABSENT in vertebrate animals?",
    correctAnswer: "Stomatal foliar transpiration",
    distractors: [
      "Cellular growth and tissue repair",
      "Cellular feeding / nutrition",
      "Biological reproduction"
    ],
    hint: "The evaporative loss of water vapor through microscopic leaf stomata.",
    workedSolution: "Transpiration (evaporative loss of water vapor through leaf stomata) occurs in plants. Respiration, growth, reproduction, and feeding occur across animals and plants.",
    points: 1
  },
  {
    number: 22,
    prompt: "Which specialized histological structure within human skin is responsible for synthesizing and eliminating metabolic sweat wastes?",
    correctAnswer: "Sweat glands [Eccrine glands]",
    distractors: [
      "Subcutaneous adipose fat deposits",
      "Epidermal hair follicles",
      "Cornified keratin layer"
    ],
    hint: "Coiled tubular glands in the dermis that secrete water and salts onto the skin surface.",
    workedSolution: "Eccrine sweat glands in the dermis extract water, sodium chloride, and traces of urea from blood capillaries, secreting sweat through sweat ducts for excretion and evaporative cooling.",
    points: 1
  },
  {
    number: 23,
    prompt: "Which of the following statements concerning the optical properties of light is SCIENTIFICALLY ACCURATE?",
    correctAnswer: "Light reflects regularly from polished, shiny reflective surfaces",
    distractors: [
      "Light rays easily pass straight through dense opaque objects",
      "Light transmits completely through the silvered backing of plane mirrors",
      "The angle of incidence is measured between the mirror surface and the reflected ray"
    ],
    hint: "Polished mirrors reflect light according to the Law of Reflection ($i = r$).",
    workedSolution: "Light undergoes specular reflection from polished, shiny surfaces, where the angle of incidence equals the angle of reflection ($i = r$). Opaque objects block light, casting shadows.",
    points: 1
  },
  {
    number: 24,
    prompt: "In classical mechanics, the mechanical efficiency of a simple machine is mathematically expressed as the ratio of:",
    correctAnswer: "Useful Work Output to Total Work Input [× 100%]",
    distractors: [
      "Load force divided by applied Effort force",
      "Momentum divided by linear velocity",
      "Distance moved by effort divided by distance moved by load"
    ],
    hint: "$$\\text{Efficiency} = \\frac{\\text{Work Output}}{\\text{Work Input}} = \\frac{MA}{VR} \\times 100\\%$$.",
    workedSolution: "Mechanical efficiency is the ratio of useful work output to total work input: $\\text{Efficiency} = \\frac{\\text{Work Output}}{\\text{Work Input}} \\times 100\\%$. $\\frac{\\text{Load}}{\\text{Effort}}$ is Mechanical Advantage.",
    points: 1
  },
  {
    number: 25,
    prompt: "In mammalian hematology, liquid blood plasma makes up approximately 55% of whole blood volume, while the remaining 45% is composed of:",
    correctAnswer: "Formed cellular corpuscles (erythrocytes, leukocytes, thrombocytes)",
    distractors: [
      "Auditory cochlea fluid",
      "Ocular iris muscles",
      "Retinal photoreceptors"
    ],
    hint: "Red blood cells, white blood cells, and platelets suspended in plasma.",
    workedSolution: "Whole blood consists of liquid plasma (~55%) and formed cellular elements (~45%): red blood cells (erythrocytes), white blood cells (leukocytes), and platelets (thrombocytes).",
    points: 1
  },
  {
    number: 26,
    prompt: "In human sensory anatomy, which of the following anatomical structures is located inside the inner ear?",
    correctAnswer: "The spiral cochlea",
    distractors: [
      "The transparent anterior cornea",
      "The muscular colored iris",
      "The sensory neural retina"
    ],
    hint: "A fluid-filled snail-shell structure containing the organ of Corti for hearing.",
    workedSolution: "The cochlea is a spiral, fluid-filled organ of the inner ear containing hair cells that convert sound vibrations into nerve impulses. The cornea, iris, and retina are eye structures.",
    points: 1
  },
  {
    number: 27,
    prompt: "Commercial brass used in plumbing fixtures, musical instruments, and hardware is an alloy composed of:",
    correctAnswer: "Copper and Zinc",
    distractors: [
      "Aluminum and Zinc",
      "Copper and Tin",
      "Iron and Carbon"
    ],
    hint: "Copper and tin make bronze; copper and zinc make brass.",
    workedSolution: "Brass is an alloy of Copper (Cu) and Zinc (Zn). Bronze consists of Copper and Tin; steel consists of Iron and Carbon.",
    points: 1
  },
  {
    number: 28,
    prompt: "In the optical system of the human eye, which muscular structure regulates the aperture diameter of the pupil to control light entry?",
    correctAnswer: "The colored iris",
    distractors: [
      "The transparent cornea",
      "The biconvex crystalline lens",
      "The sensory retina"
    ],
    hint: "Contains circular and radial smooth muscle fibers that dilate or constrict the pupil.",
    workedSolution: "The iris contains smooth muscle fibers that constrict the pupil in bright light and dilate it in dim light, regulating the amount of light entering the eye.",
    points: 1
  },
  {
    number: 29,
    prompt: "In celestial astronomy, any natural astronomical body or human-engineered spacecraft that revolves in orbit around the Earth is called:",
    correctAnswer: "A satellite",
    distractors: [
      "A fallen meteorite",
      "A distant thermonuclear star",
      "Planet Jupiter"
    ],
    hint: "The Moon is Earth's natural satellite; communication satellites are artificial.",
    workedSolution: "A satellite is any celestial body (e.g., the Moon) or artificial craft that orbits a planet. Meteorites fall to Earth, and Jupiter is an independent planet orbiting the Sun.",
    points: 1
  },
  {
    number: 30,
    prompt: "When separating a dry heterogeneous mixture of insoluble sand and common table salt, which laboratory process must be performed FIRST?",
    correctAnswer: "Dissolution of the salt by adding water and stirring",
    distractors: [
      "Evaporating the mixture to crystallization",
      "Gravity filtration of the dry mixture",
      "Fractional distillation of the solids"
    ],
    hint: "Adding water dissolves the soluble salt, leaving the insoluble sand behind.",
    workedSolution: "Water must be added first (dissolution) so the soluble sodium chloride dissolves into an aqueous solution while sand remains solid, allowing subsequent filtration.",
    points: 1
  },
  {
    number: 31,
    prompt: "An automated temperature-regulating device that operates using the differential thermal expansion and contraction of metals is called:",
    correctAnswer: "A bimetallic thermostat",
    distractors: [
      "An electrical conductor",
      "A melting circuit fuse",
      "A fluid manometer"
    ],
    hint: "Found in electric pressing irons and refrigerators to cycle current on and off.",
    workedSolution: "A thermostat uses a bimetallic strip made of two bonded metals with different expansion coefficients; heating causes it to bend, opening the circuit to regulate temperature.",
    points: 1
  },
  {
    number: 32,
    prompt: "Commercial hydrocarbon fuels such as petrol, kerosene, and diesel are refined from crude petroleum oil by:",
    correctAnswer: "Fractional distillation",
    distractors: [
      "Atmospheric vapor condensation",
      "Gravity decantation",
      "Open solar evaporation"
    ],
    hint: "Separation in a fractionating column based on differences in boiling points.",
    workedSolution: "Crude petroleum is refined into commercial fractions (petrol, kerosene, diesel) by fractional distillation, separating hydrocarbons based on their boiling points.",
    points: 1
  },
  {
    number: 33,
    prompt: "In reproductive biology, the syngamic fusion of a haploid sperm nucleus with a mature haploid egg cell nucleus is termed:",
    correctAnswer: "Fertilization",
    distractors: [
      "Sexual copulation",
      "Species evolution",
      "Ovarian ovulation"
    ],
    hint: "Produces a single diploid zygote ($2n = 46$).",
    workedSolution: "Fertilization (syngamy) is the fusion of male and female gamete nuclei to form a diploid zygote. Copulation is mating, and ovulation is the release of an egg from an ovary.",
    points: 1
  },
  {
    number: 34,
    prompt: "Calculate the electric potential difference (voltage) across an ohmic conductor wire of resistance $4.0\\ \\Omega$ when an electric current of $3.0\\text{ A}$ passes through it:",
    correctAnswer: "12.00 V",
    distractors: [
      "0.75 V",
      "1.00 V",
      "1.33 V"
    ],
    hint: "$$\\text{Voltage } (V) = \\text{Current } (I) \\times \\text{Resistance } (R) = 3.0 \\times 4.0$$.",
    workedSolution: "By Ohm's Law: $V = I \\times R = 3.0\\text{ A} \\times 4.0\\ \\Omega = 12.00\\text{ Volts (V)}$.",
    points: 1
  },
  {
    number: 35,
    prompt: "In angiosperm floral reproduction, following successful double fertilization, which part of the flower develops into the seed?",
    correctAnswer: "The fertilized ovule",
    distractors: [
      "The pollen grain",
      "The pollen-bearing stamen",
      "The receptive apical stigma"
    ],
    hint: "The ovary wall becomes the fruit pericarp; the ovule becomes the seed.",
    workedSolution: "Following fertilization, the ovule develops into a mature seed enclosing the plant embryo, while the surrounding ovary wall matures into the fruit pericarp.",
    points: 1
  },
  {
    number: 36,
    prompt: "The physiological capacity of a living organism to resist and neutralize infectious disease pathogens by synthesizing antibodies is known as:",
    correctAnswer: "Immunity",
    distractors: [
      "Clinical diagnosis",
      "Pathogen incubation",
      "Surgical inoculation"
    ],
    hint: "Involves white blood cells (B-lymphocytes) synthesizing specific antibodies.",
    workedSolution: "Immunity is the state of biological protection against infectious pathogens, conferred by circulating antibodies and sensitized lymphocytes produced by the immune system.",
    points: 1
  },
  {
    number: 37,
    prompt: "In commercial root crop farming, cocoyam (*Xanthosoma sagittifolium*) is propagated vegetatively on farm mounds using its modified underground:",
    correctAnswer: "Corm (or cormel setts)",
    distractors: [
      "Layered bulb",
      "Botanical seed",
      "Aerial sucker"
    ],
    hint: "A solid, swollen underground stem base storing starch; onions have bulbs.",
    workedSolution: "Cocoyams are propagated vegetatively using underground corms or cormels bearing buds. Onions produce bulbs, and plantains produce suckers.",
    points: 1
  },
  {
    number: 38,
    prompt: "Which of the following infectious communicable diseases specifically attacks and destroys alveolar tissues in human lungs?",
    correctAnswer: "Pulmonary tuberculosis [Mycobacterium tuberculosis]",
    distractors: [
      "Bacterial cholera",
      "Viral measles rash",
      "Lockjaw tetanus"
    ],
    hint: "Causes chronic coughing, blood-stained sputum, and night sweats.",
    workedSolution: "Tuberculosis is caused by *Mycobacterium tuberculosis*, which infects and damages lung alveoli, causing cavitations and hemoptysis (coughing blood). Cholera attacks the gut.",
    points: 1
  },
  {
    number: 39,
    prompt: "In the human respiratory tract, external gaseous exchange between inspired atmospheric air and pulmonary capillary blood occurs across the thin walls of the alveoli:\n" + svgAlveolarGasExchange,
    correctAnswer: "Alveoli (microscopic air sacs)",
    distractors: [
      "Primary bronchi",
      "Narrow bronchioles",
      "Cartilaginous larynx"
    ],
    hint: "Single-cell-thick air sacs surrounded by dense capillary networks.",
    workedSolution: "Alveoli are microscopic air sacs in the lungs with single-cell-thick walls surrounded by capillaries, providing a large surface area for oxygen and carbon dioxide diffusion.",
    points: 1
  },
  {
    number: 40,
    prompt: "The stretched arm of a student holding a heavy stone stationary in the palm of the hand represents an anatomical example of a:",
    correctAnswer: "Third-class lever [Effort between Pivot and Load]",
    distractors: [
      "First-class lever",
      "Second-class lever",
      "Fourth-class lever"
    ],
    hint: "The elbow joint is the pivot, the biceps muscle exerts effort in the middle, and the stone is the load.",
    workedSolution: "The human forearm functions as a Class 3 lever: the elbow joint acts as the fulcrum (pivot), the biceps muscle tendon exerts upward effort at the radius in the middle, and the stone in the palm is the load.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199806);

export const balancedScience1998P1: QuestionItem[] = rawScienceBank.map((q, idx) => {
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
export const paper2Science1998Questions: Paper2Question[] = [
  // ==========================================
  // QUESTION 1: ASTRONOMY, FLUIDS, STEMS & NOMENCLATURE (20 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "State two fundamental physical differences between a planet and a star in astrophysics.",
        workedSolution: `Differences between Planet and Star:
1. **Light Emission:** A star is a self-luminous thermonuclear body that generates and radiates its own light via nuclear fusion, whereas a planet is a non-luminous body that shines only by reflecting light from a star.
2. **Orbital Motion:** A planet revolves in a closed elliptical orbit around a parent star, whereas a star occupies the focal center of a planetary system.
3. **Mass and Temperature:** Stars possess immense mass and high core temperatures (millions of degrees), whereas planets have smaller masses and cooler temperatures.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: `(i) Define the physical term surface tension of a liquid.
(ii) State one practical way in which surface tension is useful to human activities or nature.`,
        workedSolution: `(i) Definition of surface tension:
The physical property of a liquid that causes its surface to behave like a stretched elastic membrane, caused by unbalanced inward cohesive forces pulling surface liquid molecules into the bulk liquid.

(ii) Practical utility:
1. **Action of Detergents and Soaps:** Soaps lower the surface tension of water, allowing water to penetrate fabric fibers and lift dirt.
2. **Ecological Habitat:** Enables aquatic insects (such as water striders and pond skaters) to walk on water surfaces without sinking.
3. **Waterproofing:** Tightly woven umbrella and tent fabrics rely on water surface tension to bridge pores and prevent water leakage.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: `(i) Give one clear botanical crop example each of:
  • A rhizome;
  • A corm;
  • A stem tuber;
  • A bulb;
  • A sucker.
(ii) State two botanical morphological reasons why a rhizome, a corm, and a stem tuber are all classified as modified stems rather than true roots.`,
        workedSolution: `(i) Crop Examples:
• Rhizome: **Ginger [Zingiber officinale]**
• Corm: **Cocoyam [Xanthosoma sagittifolium]**
• Stem tuber: **Irish potato [Solanum tuberosum]**
• Bulb: **Onion [Allium cepa]**
• Sucker: **Banana / Plantain [Musa spp.]**

(ii) Reasons classified as stems:
1. They possess **nodes and internodes** along their axes.
2. They bear **axillary buds ('eyes') and terminal buds** capable of sprouting into leafy shoots.
3. They produce reduced, protective **scale leaves** at the nodes.
*(True roots lack nodes, buds, and scale leaves)*.`,
        maxMarks: 7
      },
      {
        subId: "(d)",
        prompt: `Write down the systematic chemical name of the binary compound formed when each of the following pairs of chemical elements combine:
(i) Zinc and Oxygen;
(ii) Calcium and Chlorine;
(iii) Sodium and Bromine;
(iv) Potassium and Iodine.`,
        workedSolution: `Systematic chemical names:
• (i) Zinc + Oxygen $\\to$ **Zinc oxide** [$\\text{ZnO}$]
• (ii) Calcium + Chlorine $\\to$ **Calcium chloride** [$\\text{CaCl}_2$]
• (iii) Sodium + Bromine $\\to$ **Sodium bromide** [$\\text{NaBr}$]
• (iv) Potassium + Iodine $\\to$ **Potassium iodide** [$\\text{KI}$]`,
        maxMarks: 5
      }
    ]
  },

  // ==========================================
  // QUESTION 2: SOIL, DENSITY CALCULATIONS & ATOMIC STRUCTURE (20 MARKS)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) What is meant by a fertile soil in agronomy?
(ii) Name four of the most critical plant mineral nutrients absorbed by crop roots from the soil solution to synthesize food.`,
        workedSolution: `(i) Definition of fertile soil:
Soil that contains an adequate supply of all essential plant nutrients in balanced, plant-available forms, accompanied by favorable physical structure, drainage, aeration, and soil pH to support crop growth and yield.

(ii) Four critical mineral nutrients:
1. **Nitrogen [N]** (absorbed as $\\text{NO}_3^-$ or $\\text{NH}_4^+$)
2. **Phosphorus [P]** (absorbed as $\\text{H}_2\\text{PO}_4^-$)
3. **Potassium [K]** (absorbed as $\\text{K}^+$)
4. **Calcium [Ca]** (absorbed as $\\text{Ca}^{2+}$)
*(Alternatives: Magnesium [Mg], Sulfur [S])*`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: `(i) Define the physical term density of a substance.
(ii) Describe briefly how you would determine the density of an irregular piece of stone in a laboratory.
(iii) A storage packing container with an internal volume of $1,200.0\\text{ m}^3$ is filled to the brim with dry sand. If the bulk density of the sand is $1.95\\text{ kg m}^{-3}$, calculate the mass of the sand contained in the container.`,
        workedSolution: `(i) Definition of density:
The mass per unit volume of a physical substance:
$$\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)}$$
measured in $\\text{kg m}^{-3}$ or $\\text{g cm}^{-3}$.

(ii) Determination of stone density:
1. Weigh the clean, dry stone on an electronic balance and record its mass in grams ($m$).
2. Fill a graduated measuring cylinder with water to a known mark and record the initial volume ($V_1$) at the bottom of the meniscus.
3. Tie a thin thread to the stone and lower it gently into the water until fully submerged.
4. Record the elevated water level ($V_2$).
5. Calculate displaced volume ($V = V_2 - V_1$).
6. Calculate density:
$$\\rho = \\frac{m}{V_2 - V_1}$$

(iii) Sand mass calculation:
Formula:
$$\\text{Mass } (m) = \\text{Density } (\\rho) \\times \\text{Volume } (V)$$
Substitute given values:
$$m = 1.95\\text{ kg m}^{-3} \\times 1,200.0\\text{ m}^3 = 2,340.0\\text{ kg}$$
Answer: The mass of the sand is $$2,340.0\\text{ kg}$$.`,
        maxMarks: 8
      },
      {
        subId: "(c)",
        prompt: `(i) Define an atom in chemistry.
(ii) Explain why neutral atoms carry zero net electrical charge (are electrically neutral).`,
        workedSolution: `(i) Definition of an atom:
The smallest indivisible particle of a chemical element that retains all the unique chemical properties of that element and can participate in a chemical reaction.

(ii) Why atoms are electrically neutral:
In any neutral atom, the number of positively charged protons ($+1$ each) in the central nucleus is **exactly equal** to the number of negatively charged electrons ($-1$ each) orbiting in the electron shells. The positive and negative charges balance each other out, resulting in a net electrical charge of zero.`,
        maxMarks: 7
      }
    ]
  },

  // ==========================================
  // QUESTION 3: THERMAL EXPANSION, LITMUS, DIGESTION & HEALTH (20 MARKS)
  // ==========================================
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Using scientific principles, explain each of the following everyday observations:
(i) Loud crackling noises are heard from a corrugated iron roof on a hot afternoon;
(ii) Steel railway tracks are laid with small gaps left between adjoining rail ends;
(iii) An automobile mechanic washes greasy hands with petrol rather than with water.`,
        workedSolution: `(i) Hot metal roof crackling:
Corrugated iron roofing sheets absorb intense solar radiation and expand rapidly. As the sheets expand, they slip against wooden purlins and holding nails, releasing built-up thermal strain energy as sudden, audible crackling noises.

(ii) Gaps in railway tracks:
Steel expands linearly when heated by direct sunlight. Expansion gaps provide space for tracks to expand freely during hot afternoons without buckling or derailing trains.

(iii) Washing greasy hands with petrol:
Engine grease is composed of non-polar hydrocarbons that are insoluble in polar water molecules. Petrol is a non-polar organic solvent; by the principle of "like dissolves like," petrol dissolves grease, allowing it to be wiped clean.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `State the observable color change when a strip of blue litmus paper is dropped into each of the following liquid samples:
(i) Aqueous sodium hydroxide solution;
(ii) Dilute hydrochloric acid;
(iii) Freshly squeezed lime juice;
(iv) Pure distilled water;
(v) Fresh natural rainwater.`,
        workedSolution: `Litmus Observations:
• (i) Sodium hydroxide solution (alkali): **Remains blue** (no change)
• (ii) Dilute hydrochloric acid (strong acid): **Turns red**
• (iii) Lime juice (citric acid): **Turns red**
• (iv) Distilled water (neutral, $pH = 7$): **Remains blue** (no change)
• (v) Fresh rainwater (weakly acidic due to dissolved atmospheric $\\text{CO}_2$ forming carbonic acid): **Turns faintly red (or remains blue/red depending on purity)**`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "State three practical dietary or lifestyle habits by which chronic constipation can be prevented in humans.",
        workedSolution: `1. Eating diets rich in dietary roughage / fiber (e.g., leafy vegetables, whole grain cereals, fruits, legumes).
2. Drinking adequate amounts of clean water daily ($\\ge 2\\text{ liters/day}$) to keep fecal matter soft.
3. Engaging in regular physical exercise to stimulate intestinal peristaltic contractions.
4. Responding promptly to the urge to defecate rather than delaying bowel movements.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: `State the final absorbable monomeric end-products of complete chemical digestion for each of the following food substances:
(i) Carbohydrates;
(ii) Proteins;
(iii) Fats and oils.`,
        workedSolution: `Digestion End-Products:
• (i) Carbohydrates: **Simple monosaccharides (principally Glucose)**
• (ii) Proteins: **Amino acids**
• (iii) Fats and oils: **Fatty acids and glycerol**`,
        maxMarks: 5
      }
    ]
  },

  // ==========================================
  // QUESTION 4: DEFENSE, POLLINATION, BOHR LITHIUM & ENERGY (20 MARKS)
  // ==========================================
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "State four natural structural or chemical adaptations by which plants protect themselves against herbivorous animals.",
        workedSolution: `1. **Sharp Thorns, Spines, and Prickles:** Physical sharp structures (e.g., in roses, *Acacia*, cacti) that pierce and deter herbivores from browsing.
2. **Stinging Trichome Hairs:** Epidermal hairs containing irritant chemicals (such as formic acid and histamine in stinging nettles).
3. **Toxic Chemical Alkaloids:** Producing poisonous or bitter compounds (such as nicotine, tannins, cardiac glycosides, or milky latex in *Euphorbia*).
4. **Hard Protective Bark and Shells:** Thick, tough, fibrous coverings (e.g., coconut husks) that resist biting and chewing.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: `(i) Define the term biological pollination in flowering plants.
(ii) List four morphological characteristics of insect-pollinated (entomophilous) flowers.`,
        workedSolution: `(i) Definition of pollination:
The transfer of pollen grains from the mature anther of a stamen to the receptive stigma of a carpel in a flower.

(ii) Characteristics of insect-pollinated flowers:
1. Possess large, brightly colored petals (corolla) that visually attract insects.
2. Possess floral nectaries that secrete sweet sugary nectar and emit fragrant scents.
3. Produce relatively small quantities of large, sticky, or spiky pollen grains that cling to insect bodies.
4. Possess compact, sticky stigmas enclosed inside the petals.`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `A neutral atom of Lithium has 3 protons and 3 neutrons in its nucleus ($_{3}^{6}\\text{Li}$ or $_{3}^{7}\\text{Li}$):
(i) How many electrons are present in this neutral atom?
(ii) Draw a fully labelled diagram showing the Bohr electron shell arrangement of all subatomic particles in the atom:

${svgQ4cLithiumAtom}`,
        workedSolution: `(i) Number of electrons:
In a neutral atom, the number of electrons equals the number of protons:
$$\\text{Number of electrons} = 3$$

(ii) Bohr diagram description (refer to vector schematic):
• A central nucleus containing **3 protons** and **3 neutrons** ($3p, 3n$).
• Innermost $K$-shell containing **2 electrons**.
• Outermost $L$-shell containing **1 valence electron** (electronic configuration: **2, 1**).`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: `A ripe fruit of mass $12.0\\text{ kg}$ hangs stationary on an orange tree at a vertical height of $20.0\\text{ m}$ above the ground:
(i) Calculate its gravitational potential energy with reference to the ground;
(ii) If the fruit detaches and falls freely under gravity, determine its kinetic energy at the instant just before it strikes the ground:
$$[\\text{Take acceleration due to gravity, } g = 10.0\\text{ m s}^{-2}]$$`,
        workedSolution: `(i) Gravitational Potential Energy ($P.E.$):
Formula:
$$P.E. = m \\times g \\times h$$
Substitute given values ($m = 12.0\\text{ kg}$, $g = 10.0\\text{ m s}^{-2}$, $h = 20.0\\text{ m}$):
$$P.E. = 12.0\\text{ kg} \\times 10.0\\text{ m s}^{-2} \\times 20.0\\text{ m} = 2,400.0\\text{ Joules (J)}$$
Answer: The potential energy is $$2,400.0\\text{ J}$$.

(ii) Kinetic Energy ($K.E.$) just before impact:
By the **Law of Conservation of Mechanical Energy** (neglecting air resistance), all initial gravitational potential energy converts into kinetic energy as it falls:
$$\\text{Final } K.E. = \\text{Initial } P.E. = 2,400.0\\text{ Joules (J)}$$
Answer: The kinetic energy just before hitting the ground is $$2,400.0\\text{ J}$$.`,
        maxMarks: 6
      }
    ]
  }
];

export const SET_BECE_1998_SCIENCE_P1 = {
  year: 1998,
  isVariant: true,
  setNumber: 130,
  subject: "Integrated Science",
  paperNumber: 1,
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  title: "Paper 1: Objective Test (Variant)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedScience1998P1
};

export const SET_BECE_1998_SCIENCE_P2 = {
  year: 1998,
  isVariant: true,
  setNumber: 130,
  subject: "Integrated Science",
  paperNumber: 2,
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  title: "Paper 2: Practical & Theory Essay (Variant)",
  durationMinutes: 75,
  instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 4,
  questions: paper2Science1998Questions
};

export const SET_BECE_1998_SCIENCE_COMPLETE = {
  year: 1998,
  isVariant: true,
  setNumber: 130,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: {
    title: "Paper 1: Objective Test (Variant)",
    durationMinutes: 45,
    totalQuestions: 40,
    questions: balancedScience1998P1
  },
  paper2: {
    title: "Paper 2: Practical & Theory Essay (Variant)",
    durationMinutes: 75,
    instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
    totalQuestions: 4,
    questions: paper2Science1998Questions
  },
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 2,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
