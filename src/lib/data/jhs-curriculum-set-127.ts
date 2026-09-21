/**
 * JHS Curriculum Data - Set 127
 * 1995 BECE Integrated Science Complete Variant (Paper 1 & Paper 2)
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

export const svgQ1aCapillarityMeniscus = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 360 200' width='100%' height='185' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Water Trough (Bottom) -->
    <rect x='40' y='130' width='280' height='50' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='1.5'/>
    <line x1='40' y1='145' x2='320' y2='145' stroke='#38bdf8' stroke-width='2'/>
    <text x='50' y='165' font-size='10' font-weight='bold' fill='#38bdf8'>Water reservoir</text>

    <!-- Wide Tube (Left) -->
    <g transform='translate(90, 40)'>
      <rect x='0' y='0' width='36' height='110' fill='none' stroke='#cbd5e1' stroke-width='2'/>
      <!-- Water level slightly elevated with concave meniscus -->
      <path d='M 2 85 Q 18 95 34 85 L 34 110 L 2 110 Z' fill='#38bdf8' opacity='0.4'/>
      <text x='18' y='-8' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Wide Tube</text>
    </g>

    <!-- Narrow Capillary Tube (Right) - High Elevation -->
    <g transform='translate(210, 40)'>
      <rect x='0' y='0' width='14' height='110' fill='none' stroke='#cbd5e1' stroke-width='2'/>
      <!-- Water level highly elevated with sharp concave meniscus -->
      <path d='M 2 25 Q 7 35 12 25 L 12 110 L 2 110 Z' fill='#38bdf8' opacity='0.5'/>
      <line x1='14' y1='25' x2='45' y2='25' stroke='#10b981' stroke-width='1.5'/>
      <text x='52' y='29' font-size='10' font-weight='bold' fill='#10b981'>High Capillary Rise (h)</text>
      <text x='7' y='-8' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Capillary Tube</text>
    </g>

    <text x='180' y='190' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>ADHESION (WATER-GLASS) > COHESION (WATER-WATER) CAUSES WATER TO WET GLASS AND ASCEND</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

export const svgQ2aHumanEye = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Outer Sclera & Globe Outline -->
    <path d='M 120 40 C 60 70 60 160 120 190 C 200 220 280 190 300 135 L 340 130 L 340 100 L 300 95 C 280 40 200 10 120 40 Z' fill='#1e293b' stroke='#94a3b8' stroke-width='2'/>
    
    <!-- Cornea (Anterior Transparent Bulge on Left) -->
    <path d='M 120 40 C 85 70 85 160 120 190' fill='none' stroke='#38bdf8' stroke-width='3.5'/>
    <line x1='90' y1='115' x2='30' y2='65' stroke='#38bdf8' stroke-width='1.5'/>
    <text x='25' y='60' font-size='10' font-weight='bold' fill='#38bdf8'>Cornea</text>

    <!-- Pupil Aperture & Iris -->
    <path d='M 132 50 L 140 85' stroke='#f59e0b' stroke-width='4'/>
    <path d='M 132 180 L 140 145' stroke='#f59e0b' stroke-width='4'/>
    <line x1='136' y1='70' x2='50' y2='90' stroke='#f59e0b' stroke-width='1.5'/>
    <text x='45' y='94' font-size='10' font-weight='bold' fill='#f59e0b'>Iris</text>
    <text x='115' y='118' font-size='9' font-weight='bold' fill='#ffffff'>Pupil</text>

    <!-- Crystalline Biconvex Lens -->
    <ellipse cx='155' cy='115' rx='10' ry='32' fill='#0284c7' opacity='0.5' stroke='#38bdf8' stroke-width='2'/>
    <line x1='155' y1='80' x2='100' y2='25' stroke='#38bdf8' stroke-width='1.5'/>
    <text x='95' y='20' font-size='10' font-weight='bold' fill='#38bdf8'>Crystalline Lens</text>

    <!-- Ciliary Muscles / Suspensory Ligaments -->
    <circle cx='155' cy='82' r='4' fill='#ef4444'/>
    <circle cx='155' cy='148' r='4' fill='#ef4444'/>
    <line x1='155' y1='150' x2='100' y2='205' stroke='#ef4444' stroke-width='1.5'/>
    <text x='95' y='210' font-size='10' font-weight='bold' fill='#ef4444'>Ciliary Body</text>

    <!-- Sensory Retina (Inner Posterior Layer) -->
    <path d='M 160 52 C 220 52 270 80 275 115 C 270 150 220 178 160 178' fill='none' stroke='#f43f5e' stroke-width='3'/>
    <line x1='250' y1='75' x2='310' y2='35' stroke='#f43f5e' stroke-width='1.5'/>
    <text x='315' y='32' font-size='10' font-weight='bold' fill='#f43f5e'>Retina</text>

    <!-- Optic Nerve Exit (Right) -->
    <line x1='300' y1='115' x2='360' y2='115' stroke='#cbd5e1' stroke-width='6'/>
    <text x='370' y='118' font-size='10' font-weight='bold' fill='#cbd5e1'>Optic Nerve</text>

    <text x='190' y='224' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>SAGITTAL CROSS-SECTION: LIGHT IS REFRACTED BY CORNEA & LENS ONTO RETINA</text>
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
    prompt: "All of the following unsustainable human activities accelerate the physical detachment and erosion of agricultural soil EXCEPT:",
    correctAnswer: "Constructing stone bunds, terraces, and planting cover crops across slopes",
    distractors: [
      "Total clear-felling and mechanical clearing of natural forest vegetation",
      "Indiscriminate bush burning of vegetative pasture covers",
      "Overgrazing of open pastures by excessive herds of livestock"
    ],
    hint: "Cover crops and terraces protect topsoil from raindrop impact and runoff scouring.",
    workedSolution: "Vegetation clearing, bush burning, and overgrazing expose topsoil to erosion. Establishing cover crops, terracing, and mulching conserve and protect soil.",
    points: 1
  },
  {
    number: 2,
    prompt: "In classical physics, what is the fundamental scientific difference between the mass of an object and its gravitational weight?",
    correctAnswer: "The mass of an object is constant everywhere, but its weight varies with gravitational field strength",
    distractors: [
      "The mass of an object is always exactly twice its numerical weight",
      "The weight of an object is constant everywhere, but its mass varies with altitude",
      "Mass is measured in Newtons while gravitational weight is measured in kilograms"
    ],
    hint: "Mass is an invariant scalar quantity of matter; weight is a downward gravitational force ($W = mg$).",
    workedSolution: "Mass is the invariant quantity of matter in an object, constant anywhere in the universe. Weight is the gravitational force exerted on that mass ($W = mg$), which varies with local gravity.",
    points: 1
  },
  {
    number: 3,
    prompt: "By what primary thermodynamic heat transfer mechanism does heat circulate from the heated base of a water-filled glass beaker to the surface?",
    correctAnswer: "Convection",
    distractors: [
      "Thermal conduction",
      "Electromagnetic radiation",
      "Direct photon absorption"
    ],
    hint: "Warm water expands, becomes less dense, and ascends while cooler, denser water descends.",
    workedSolution: "Heat transfer through fluids (liquids and gases) occurs primarily by convection, where density differences establish circulating fluid currents that transport thermal energy.",
    points: 1
  },
  {
    number: 4,
    prompt: "In the International System of Units (S.I.), in what metric units are mechanical work and thermal energy quantified?",
    correctAnswer: "Work is measured in Joules [J], and Energy is measured in Joules [J]",
    distractors: [
      "Work is measured in Joules [J], and Energy is measured in Watts [W]",
      "Work is measured in Newtons [N], and Energy is measured in Joules [J]",
      "Work is measured in Watts [W], and Energy is measured in Watts [W]"
    ],
    hint: "Work done is energy transformed; both are measured in the same unit ($1\\text{ J} = 1\\text{ N m}$).",
    workedSolution: "Both mechanical work ($W = F \\times d$) and energy are quantified in Joules (J). The Watt measures power, and the Newton measures force.",
    points: 1
  },
  {
    number: 5,
    prompt: "In pedology, which of the following components constitutes the living and decomposed organic fraction of fertile agricultural topsoil?",
    correctAnswer: "Organic humus (decomposed plant and animal biomass)",
    distractors: [
      "Inorganic weathered rock mineral particles",
      "Capillary soil water solution",
      "Macropore atmospheric soil air"
    ],
    hint: "Dark, spongy organic matter derived from decomposed leaves and microorganisms.",
    workedSolution: "Humus is the dark, amorphous organic fraction of soil formed by the biochemical decomposition of plant and animal residues. Rock fragments, water, and air are inorganic components.",
    points: 1
  },
  {
    number: 6,
    prompt: "A liquid mixture containing solid cane sugar dissolved completely in water can be separated to recover both components by:",
    correctAnswer: "Simple distillation (or evaporation to crystallization)",
    distractors: [
      "Gravity filtration through filter paper",
      "Gravity sedimentation and decantation",
      "Magnetic separation"
    ],
    hint: "Sugar forms a true molecular solution; boiling vaporizes the volatile water, leaving non-volatile sugar.",
    workedSolution: "Sugar forms a true homogeneous solution in water. Simple distillation vaporizes and condenses water while leaving solid sugar behind. Filtration cannot separate dissolved solutes.",
    points: 1
  },
  {
    number: 7,
    prompt: "Which calibrated meteorological instrument is used to measure atmospheric pressure at high altitudes and sea level?",
    correctAnswer: "A barometer [mercury or aneroid]",
    distractors: [
      "A clinical thermometer",
      "A rotating cup anemometer",
      "A liquid hydrometer"
    ],
    hint: "Measures atmospheric pressure in millimeters of mercury ($\\text{mmHg}$) or hectopascals ($\\text{hPa}$).",
    workedSolution: "A barometer measures atmospheric air pressure. Anemometers measure wind speed, hydrometers measure liquid density, and thermometers measure temperature.",
    points: 1
  },
  {
    number: 8,
    prompt: "Which of the following biological organisms is capable of reproducing asexually without requiring sexual mating with a partner?",
    correctAnswer: "Amoeba proteus (via binary fission) / Hydra (via budding)",
    distractors: [
      "The terrestrial common toad",
      "The domestic canine dog",
      "The wall rainbow lizard"
    ],
    hint: "Single-celled protozoans and simple cnidarians reproduce asexually; vertebrates require mating.",
    workedSolution: "*Amoeba* and *Hydra* reproduce asexually through binary fission or budding without gametic mating. Toads, lizards, and dogs are vertebrates that reproduce sexually.",
    points: 1
  },
  {
    number: 9,
    prompt: "Which combination of micro-climatic environmental conditions induces the FASTEST rate of transpiration from the leaves of a plant?",
    correctAnswer: "High ambient temperature, bright sunlight, and dry, windy air",
    distractors: [
      "Extremely high relative humidity",
      "A calm, completely still, windless atmosphere",
      "Freezing cold temperatures"
    ],
    hint: "High temperature and wind create a steep vapor pressure deficit that accelerates evaporation.",
    workedSolution: "Transpiration accelerates under warm temperatures, bright sunlight (opening stomata), low humidity, and dry winds that sweep away boundary layer water vapor.",
    points: 1
  },
  {
    number: 10,
    prompt: "Botanical fruits and seeds adapted for dispersal over long distances by wind currents (anemochory) are typically:",
    correctAnswer: "Lightweight with feathery plumes, silky pappus hairs, or aerodynamic wings",
    distractors: [
      "Succulent, sweet, and brightly colored",
      "Covered with curved, sticky adhesive hooks",
      "Dense, heavy, and stony"
    ],
    hint: "Examples like dandelion parachutes, cotton seeds, or winged mahogany samaras.",
    workedSolution: "Wind-dispersed seeds are lightweight and possess buoyant aerodynamic structures (wings, parachutes, or plumes) that allow air currents to transport them.",
    points: 1
  },
  {
    number: 11,
    prompt: "All of the following common substances are classified chemically as physical mixtures EXCEPT:",
    correctAnswer: "Pure distilled water [H₂O]",
    distractors: [
      "Writing fountain-pen ink",
      "Whole mammalian blood",
      "Fermented palm wine"
    ],
    hint: "Distilled water is a pure chemical compound composed of hydrogen and oxygen in a fixed 2:1 ratio.",
    workedSolution: "Distilled water ($\\text{H}_2\\text{O}$) is a pure chemical compound with fixed stoichiometric composition. Ink, blood, air, and palm wine are complex homogeneous or heterogeneous mixtures.",
    points: 1
  },
  {
    number: 12,
    prompt: "In a classical first-class mechanical lever, what is the relative spatial arrangement of the components?",
    correctAnswer: "The fixed pivot (fulcrum) is located between the applied effort and the load",
    distractors: [
      "The load is situated on top of the applied effort",
      "The load is located between the effort arm and the pivot",
      "The effort is located between the pivot and the load"
    ],
    hint: "Think of a crowbar, see-saw, or pair of scissors: pivot is in the middle.",
    workedSolution: "In a Class 1 lever, the fulcrum (pivot) lies between the effort force and the load resistance (e.g., crowbar, scissors, see-saw). In Class 2, the load is between pivot and effort.",
    points: 1
  },
  {
    number: 13,
    prompt: "In vertebrate physiology, the biological process of excretion involves the active elimination of:",
    correctAnswer: "Toxic metabolic waste products synthesized by metabolizing body cells",
    distractors: [
      "Excess water alone from the body",
      "Undigested solid fecal residue from the alimentary canal",
      "Circulating blood cells from damaged capillaries"
    ],
    hint: "Excretion removes cellular wastes like urea and carbon dioxide; eliminating feces is egestion.",
    workedSolution: "Excretion is the removal of toxic metabolic byproducts (urea, uric acid, carbon dioxide) produced by cellular reactions. Removing undigested feces via the anus is egestion (defecation).",
    points: 1
  },
  {
    number: 14,
    prompt: "Which of the following celestial or terrestrial entities represents an indirect (non-luminous) source of visible light?",
    correctAnswer: "The Earth's Moon (reflecting incident sunlight)",
    distractors: [
      "An illuminated battery torchlight",
      "The central thermonuclear Sun",
      "A glowing campfire"
    ],
    hint: "A cold, non-luminous body that does not emit its own light.",
    workedSolution: "The Moon is a non-luminous body that shines by reflecting light from the Sun. The Sun, fires, and electric torches generate and emit their own light photons.",
    points: 1
  },
  {
    number: 15,
    prompt: "In mammalian sensory anatomy, which organ contains specialized photoreceptor rod and cone cells responsible for sight?",
    correctAnswer: "The eye",
    distractors: [
      "The sensory cutaneous skin",
      "The olfactory nasal cavity",
      "The auditory ear"
    ],
    hint: "Light focuses on the sensory retina to form visual images.",
    workedSolution: "The eye is the sensory organ for vision, focusing light onto retinal photoreceptors (rods and cones) that transmit electrical impulses to the brain.",
    points: 1
  },
  {
    number: 16,
    prompt: "Which of the following physical properties is a critical requirement for a thermometric liquid used in liquid-in-glass thermometers?",
    correctAnswer: "It must NOT cling to or wet the inner walls of the glass capillary",
    distractors: [
      "It must possess a very low boiling point near room temperature",
      "It must possess a high melting point above 50°C",
      "It must be completely transparent and invisible"
    ],
    hint: "Wetting glass leaves liquid droplets on walls, distorting meniscus readings.",
    workedSolution: "A thermometric liquid (like mercury) must not wet glass so the meniscus moves freely without leaving droplets behind, and must expand uniformly with temperature.",
    points: 1
  },
  {
    number: 17,
    prompt: "When living organisms die, the mineral nutrients locked in their tissues are recycled back to the soil through the biological process of:",
    correctAnswer: "Saprophytic microbial decomposition (decay)",
    distractors: [
      "Surface capillary evaporation",
      "Physical gravity sedimentation",
      "Gastrointestinal defecation"
    ],
    hint: "Decomposers (bacteria and fungi) break down organic biomass into simple inorganic minerals.",
    workedSolution: "Decomposers (saprophytic bacteria and fungi) enzymatically digest dead organic matter, mineralizing complex organic polymers back into soil nitrates, phosphates, and potassium.",
    points: 1
  },
  {
    number: 18,
    prompt: "Why does solid water ice float when placed in a container of liquid water?",
    correctAnswer: "Liquid water is denser than solid ice [ρ_ice < ρ_water]",
    distractors: [
      "Solid ice is significantly denser than liquid water",
      "Ice has the exact same thermodynamic temperature as liquid water",
      "Ice has a higher thermal conductivity than liquid water"
    ],
    hint: "Water expands upon freezing, forming an open hexagonal crystal lattice of lower density.",
    workedSolution: "Due to anomalous expansion, water expands as it freezes into ice, forming an open lattice with a lower density ($\\approx 0.92\\text{ g cm}^{-3}$) than liquid water ($1.00\\text{ g cm}^{-3}$), allowing it to float.",
    points: 1
  },
  {
    number: 19,
    prompt: "In human digestive physiology, what is the primary mechanical purpose of thoroughly chewing food before swallowing?",
    correctAnswer: "To break food into smaller particles, increasing surface area for digestive enzymes",
    distractors: [
      "To completely sterilize the food from bacteria",
      "To stimulate the brain to produce digestive bile",
      "To prevent saliva from mixing with the food bolus"
    ],
    hint: "Mastication pulverizes food, allowing enzymes like salivary amylase to act faster.",
    workedSolution: "Mastication mechanically breaks food down, significantly increasing the surface area exposed to salivary and gastric enzymes to accelerate chemical digestion.",
    points: 1
  },
  {
    number: 20,
    prompt: "In mechanical physics, the physical quantity power is defined as the:",
    correctAnswer: "Time rate of doing mechanical work or transforming energy [P = W/t]",
    distractors: [
      "Total capacity or ability to do mechanical work",
      "Total accumulated amount of chemical energy",
      "Rate of linear distance covered per unit time"
    ],
    hint: "Quantified in Joules per second, or Watts ($1\\text{ W} = 1\\text{ J s}^{-1}$).",
    workedSolution: "Power is the rate at which work is performed or energy is transformed per unit time ($P = \\frac{W}{t}$). Energy is the capacity to do work, and velocity is the rate of distance covered.",
    points: 1
  },
  {
    number: 21,
    prompt: "Which physical force enables light objects (such as a steel razor blade or pond skater insect) to rest on the surface of water without sinking?",
    correctAnswer: "Surface tension",
    distractors: [
      "Mechanical kinetic friction",
      "Internal fluid viscosity",
      "Capillary suction action"
    ],
    hint: "Cohesive forces among surface water molecules create an elastic-like surface membrane.",
    workedSolution: "Surface tension arises from unbalanced inward cohesive forces among surface water molecules, forming an elastic-like surface film that supports light objects.",
    points: 1
  },
  {
    number: 22,
    prompt: "In modern atomic physics, what two fundamental sub-atomic particles reside together within the central atomic nucleus?",
    correctAnswer: "Neutrons and protons",
    distractors: [
      "Neutrons and electron shells",
      "Protons and orbiting electrons",
      "Electrons and electron shells"
    ],
    hint: "Positively charged protons and neutral neutrons form the nucleus; electrons orbit in shells.",
    workedSolution: "The dense central nucleus of an atom consists of positively charged protons and uncharged neutrons (nucleons). Negatively charged electrons orbit in external shells.",
    points: 1
  },
  {
    number: 23,
    prompt: "In human reproductive physiology, the syngamic fusion of a haploid spermatozoon with a mature haploid ovum produces a single diploid cell that develops into:",
    correctAnswer: "A developing embryo",
    distractors: [
      "The maternal ovary organ",
      "An unfertilized mature ovum",
      "The maternal placenta"
    ],
    hint: "Fertilization yields a diploid zygote, which divides mitotically to form the embryo.",
    workedSolution: "Syngamy unites male and female gamete nuclei to form a single diploid zygote, which undergoes mitotic cleavage to form a blastocyst and developing embryo.",
    points: 1
  },
  {
    number: 24,
    prompt: "Most non-xerophytic agricultural crops fail to grow and thrive in arid desert environments primarily because:",
    correctAnswer: "Annual rainfall precipitation is extremely low and soil moisture is scarce",
    distractors: [
      "There is zero mineral subsoil present in desert soils",
      "Atmospheric solar illumination is toxic to plants",
      "Atmospheric wind speeds destroy all chlorophyll molecules"
    ],
    hint: "Water is the essential physiological solvent and electron donor for photosynthesis.",
    workedSolution: "Water is the primary limiting factor in deserts. Extremely low rainfall and high evaporation rates deprive crop roots of the moisture needed for growth and photosynthesis.",
    points: 1
  },
  {
    number: 25,
    prompt: "Determine the mechanical work done when a girl lifts a bucket of water weighing $40.0\text{ N}$ vertically upward through a displacement of $1.0\text{ m}$:",
    correctAnswer: "40.0 Joules",
    distractors: [
      "400.0 Joules",
      "4.0 Joules",
      "1.0 Joule"
    ],
    hint: "$$\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (h) = 40.0 \\times 1.0$$.",
    workedSolution: "$$\\text{Work Done } (W) = F \\times h = 40.0\\text{ N} \\times 1.0\\text{ m} = 40.0\\text{ Joules (J)}$$.",
    points: 1
  },
  {
    number: 26,
    prompt: "Which of the following biological capabilities is NOT a universal characteristic of all living organisms?",
    correctAnswer: "Manufacturing organic food carbohydrates from sunlight (Photosynthesis)",
    distractors: [
      "Breaking down food molecules to release metabolic energy (Respiration)",
      "Utilizing absorbed food nutrients for physical growth and tissue repair",
      "Responding to external sensory changes in the environment (Irritability)"
    ],
    hint: "Photosynthesis is restricted to green plants and algae; animals and fungi are heterotrophs.",
    workedSolution: "Photosynthesis is limited to photoautotrophs. Respiration, cellular growth, reproduction, excretion, and irritability are universal characteristics shared by all living organisms.",
    points: 1
  },
  {
    number: 27,
    prompt: "Which physical separation process is used commercially in coastal salt pans to harvest solid table salt from seawater?",
    correctAnswer: "Solar evaporation of water",
    distractors: [
      "Thermal boiling in closed retorts",
      "Atmospheric vapor condensation",
      "Gravity decantation"
    ],
    hint: "Solar radiation and wind evaporate water from shallow brine ponds, crystallizing salt.",
    workedSolution: "Commercial sea salt extraction relies on solar evaporation: seawater in shallow coastal lagoons evaporates under sun and wind, leaving crystallized sodium chloride.",
    points: 1
  },
  {
    number: 28,
    prompt: "In astronomical planetary science, which celestial body is the natural orbital satellite of planet Earth?",
    correctAnswer: "The Moon",
    distractors: [
      "Planet Mars",
      "The central Sun",
      "Planet Venus"
    ],
    hint: "A natural rocky body revolving in an elliptical orbit around the Earth every 27.3 days.",
    workedSolution: "The Moon is Earth's only natural satellite, held in orbit by Earth's gravitational field. Mars and Venus are separate planets, and the Sun is our central star.",
    points: 1
  },
  {
    number: 29,
    prompt: "Which of the following soil organisms is classified as a microscopic decomposer that recycles nutrients in agricultural soils?",
    correctAnswer: "Soil bacteria",
    distractors: [
      "Wood-eating subterranean termites",
      "Non-cellular obligate viruses",
      "Blood-sucking pasture ticks"
    ],
    hint: "Unicellular prokaryotes that decompose organic matter into humus.",
    workedSolution: "Bacteria and fungi are microscopic decomposers that break down organic residues in soil. Termites and ticks are macroscopic arthropods, and viruses are non-cellular obligate parasites.",
    points: 1
  },
  {
    number: 30,
    prompt: "When light from an extended source strikes an opaque object, what is the scientific name of the central, completely dark region of the cast shadow?",
    correctAnswer: "The umbra",
    distractors: [
      "The outer penumbra",
      "A partial solar eclipse",
      "The focal point"
    ],
    hint: "The region where all direct rays are blocked; the surrounding partial shadow is the penumbra.",
    workedSolution: "The umbra is the completely dark central region of a shadow where all direct light rays from the source are obstructed. The outer, partially illuminated shadow is the penumbra.",
    points: 1
  },
  {
    number: 31,
    prompt: "Which gaseous component of atmospheric air actively supports chemical combustion and rekindles a glowing splint?",
    correctAnswer: "Diatomic oxygen gas [O₂]",
    distractors: [
      "Diatomic nitrogen gas [N₂]",
      "Inert argon gas [Ar]",
      "Atmospheric water vapor [H₂O]"
    ],
    hint: "Constitutes approximately 21% of the atmosphere and serves as the universal oxidizer for burning.",
    workedSolution: "Oxygen gas ($\\text{O}_2$) is an oxidizing agent essential for combustion; pure oxygen gas rekindles a glowing wooden splint. Nitrogen, argon, and water vapor do not support burning.",
    points: 1
  },
  {
    number: 32,
    prompt: "In the human digestive tract, what muscular tubular structure conveys masticated food boluses from the mouth cavity down to the stomach?",
    correctAnswer: "The esophagus (gullet)",
    distractors: [
      "The duodenum",
      "The absorptive ileum",
      "The cartilaginous trachea"
    ],
    hint: "Transports food downward through coordinated, involuntary peristaltic muscular contractions.",
    workedSolution: "The esophagus (gullet) connects the pharynx to the stomach, moving food boluses downward via involuntary peristaltic contractions. The trachea conveys air to the lungs.",
    points: 1
  },
  {
    number: 33,
    prompt: "Which calibrated laboratory electrical instrument is wired in series in an electric circuit to measure electric current in Amperes?",
    correctAnswer: "An ammeter",
    distractors: [
      "A parallel voltmeter",
      "A mercury barometer",
      "A clinical thermometer"
    ],
    hint: "Possesses very low internal resistance so it does not alter current flow in the circuit.",
    workedSolution: "An ammeter measures electric current in Amperes (A) and is wired in series so all circuit charges pass through it. Voltmeters measure potential difference in parallel.",
    points: 1
  },
  {
    number: 34,
    prompt: "Dense tropical rainforest biomes with tall evergreen trees flourish in regions where the prevailing climate is:",
    correctAnswer: "Hot and wet (with high year-round rainfall and warm temperatures)",
    distractors: [
      "Cool and continuously dry",
      "Hot, arid, and perpetually dry",
      "Cool and seasonally dry"
    ],
    hint: "Equatorial rainforests require abundant moisture ($> 2,000\\text{ mm}$) and high temperatures year-round.",
    workedSolution: "Tropical rainforests require warm, sunny conditions combined with heavy, well-distributed rainfall ($> 2,000\\text{ mm}$ annually) to support dense, multi-layered evergreen canopies.",
    points: 1
  },
  {
    number: 35,
    prompt: "In mammalian auditory anatomy, the external cartilaginous flap of the outer ear that collects sound waves is the:",
    correctAnswer: "Pinna (auricle)",
    distractors: [
      "Spiral cochlea",
      "Tympanic membrane (eardrum)",
      "Incus (anvil bone)"
    ],
    hint: "Directs sound waves into the external auditory meatus; the cochlea is in the inner ear.",
    workedSolution: "The pinna (auricle) is the external cartilaginous structure that collects sound waves and funnels them into the auditory canal. The tympanum is the eardrum, and the cochlea is in the inner ear.",
    points: 1
  },
  {
    number: 36,
    prompt: "In indigenous agro-processing, traditional gin (*akpeteshie*) is extracted from fermented palm wine through the physical process of:",
    correctAnswer: "Distillation",
    distractors: [
      "Vapor condensation alone",
      "Freezing crystallization",
      "Gravity sedimentation"
    ],
    hint: "Heating fermented sap boils off ethanol ($78^\\circ\\text{C}$), which is cooled and condensed through pipes.",
    workedSolution: "Distilling *akpeteshie* involves boiling fermented palm wine to vaporize volatile ethanol, then condensing the vapor through cold pipes, demonstrating simple/fractional distillation.",
    points: 1
  },
  {
    number: 37,
    prompt: "When meteorological weather reports record that atmospheric relative humidity is exceptionally high, which weather condition is most likely?",
    correctAnswer: "Precipitation and rain showers are likely to occur",
    distractors: [
      "The atmosphere will be dry and arid",
      "Intense sunny drought conditions will prevail",
      "The day will be completely cloudless and dry"
    ],
    hint: "High relative humidity means air is near water vapor saturation; cooling triggers condensation and rain.",
    workedSolution: "High relative humidity indicates that air is nearly saturated with water vapor. Minor cooling causes water vapor to condense into cloud droplets, increasing the likelihood of rain.",
    points: 1
  },
  {
    number: 38,
    prompt: "Which of the following morphological anatomical features is shared by both bony fish and wall lizards?",
    correctAnswer: "Possession of protective epidermal scales covering the body",
    distractors: [
      "Possession of an extensible, sticky prey-capturing tongue",
      "Possession of a lateral line sensory canal system",
      "Possession of flexible dorsal balancing fins"
    ],
    hint: "Both are cold-blooded vertebrates whose skins are covered with protective scales.",
    workedSolution: "Both fish and reptiles (lizards) possess protective scales. Lizards have dry epidermal scales, and bony fish have dermal scales. Lateral lines and fins are unique to aquatic fish.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which of the following astronomical statements concerning our heliocentric Solar System is SCIENTIFICALLY ACCURATE?",
    correctAnswer: "All eight major planets revolve in elliptical orbits around the central Sun",
    distractors: [
      "The central Sun revolves in an orbit around planet Earth",
      "The planets revolve in stable orbits around the Moon",
      "The central Sun moves in an orbit around the Solar System"
    ],
    hint: "The heliocentric model demonstrates that planets orbit the massive central Sun.",
    workedSolution: "In our heliocentric Solar System, all eight major planets (including Earth) revolve in elliptical orbits around the massive central Sun, held by gravitational attraction.",
    points: 1
  },
  {
    number: 40,
    prompt: "In botanical taxonomy, the succulent edible fruit of the mango tree (*Mangifera indica*) is classified as:",
    correctAnswer: "A drupe",
    distractors: [
      "A pepo",
      "A berry",
      "A caryopsis"
    ],
    hint: "A stone fruit featuring a thin skin, fleshy edible mesocarp, and hard woody endocarp enclosing one seed.",
    workedSolution: "A mango is a fleshy drupe (stone fruit) containing a single seed enclosed in a hard, lignified endocarp, surrounded by a fleshy, succulent mesocarp and thin epicarp.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199506);

export const balancedScience1995P1: QuestionItem[] = rawScienceBank.map((q, idx) => {
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
export const paper2Science1995Questions: Paper2Question[] = [
  // ==========================================
  // QUESTION 1: FLUID MECHANICS, HEMATOLOGY & ATOMIC PHYSICS (20 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Explain clearly each of the following physical terms in fluid mechanics:
(i) Molecular diffusion;
(ii) Surface tension;
(iii) Capillarity (capillary action).`,
        workedSolution: `(i) Molecular diffusion:
The spontaneous net movement of particles (atoms, ions, or molecules) from a region of higher concentration to a region of lower concentration down a concentration gradient as a result of their random thermal kinetic motion.

(ii) Surface tension:
The physical property of a liquid surface that causes it to behave like a stretched elastic membrane, caused by inward, unbalanced cohesive forces pulling surface liquid molecules into the bulk liquid.

(iii) Capillarity (capillary action):
The physical phenomenon whereby liquids spontaneously rise or fall in narrow-bore capillary tubes or porous media due to the relative balance between adhesive forces (liquid to container wall) and cohesive forces (liquid to liquid).`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `Why does liquid water wet and cling to clean glass surfaces, whereas liquid mercury does not:

${svgQ1aCapillarityMeniscus}`,
        workedSolution: `Explanation of wetting:
Water wets glass because the adhesive attractive forces between water molecules and the polar silicate molecules of the glass are significantly stronger than the cohesive forces holding water molecules to one another ($\\text{Adhesion} > \\text{Cohesion}$). Consequently, water spreads out and forms a concave upward meniscus. Conversely, mercury does not wet glass because its internal metallic cohesive forces exceed its adhesive attraction to glass ($\\text{Cohesion} > \\text{Adhesion}$).`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: `(i) State the biological composition of human whole blood.
(ii) List three vital physiological functions performed by blood in the human body.`,
        workedSolution: `(i) Composition of blood:
Whole blood consists of formed cellular elements suspended in a pale yellow liquid medium called blood plasma ($\\approx 55\\%$):
1. **Red blood cells (Erythrocytes):** Biconcave disc-shaped cells containing hemoglobin.
2. **White blood cells (Leukocytes):** Phagocytes and lymphocytes.
3. **Blood platelets (Thrombocytes):** Cell fragments essential for clotting.
4. **Blood plasma:** Liquid matrix containing water ($\\approx 90\\%$), plasma proteins (albumin, fibrinogen), dissolved glucose, mineral ions, hormones, and urea.

(ii) Functions of blood:
1. **Transport:** Transports oxygen from lungs to tissues (via hemoglobin), carbon dioxide to lungs, nutrients to cells, and metabolic urea to kidneys.
2. **Immune Defense:** Leukocytes engulf pathogens via phagocytosis, and lymphocytes produce antibodies to neutralize infections.
3. **Hemostasis (Clotting):** Platelets and plasma fibrinogen form clots at wounds to prevent fatal hemorrhage.
4. **Thermoregulation:** Distributes metabolic heat uniformly throughout the body to maintain constant core temperature.`,
        maxMarks: 6
      },
      {
        subId: "(d)",
        prompt: `(i) Describe briefly how positive ions (cations) and negative ions (anions) are formed from neutral atoms.
(ii) State two fundamental physical differences between a nuclear proton and an orbiting electron.
(iii) Write down the official chemical symbol for each of the following:
  (α) A neutral atom of Lithium;
  (β) A diatomic molecule of Chlorine;
  (γ) A neutral atom of Oxygen.`,
        workedSolution: `(i) Formation of ions:
• Cations (Positive ions): Formed when a neutral metal atom loses one or more valence electrons, leaving an excess of positive nuclear protons over negative electrons (e.g., $\\text{Li} \\to \\text{Li}^+ + e^-$).
• Anions (Negative ions): Formed when a neutral non-metal atom gains one or more valence electrons, giving an excess of negative electrons over nuclear protons (e.g., $\\text{Cl} + e^- \\to \\text{Cl}^-$).

(ii) Differences between Proton and Electron:

| Feature | Proton | Electron |
| :--- | :--- | :--- |
| **Electrical Charge** | Carries a charge of **$+1$** ($+1.6 \\times 10^{-19}\\text{ C}$) | Carries a charge of **$-1$** ($-1.6 \\times 10^{-19}\\text{ C}$) |
| **Mass** | Substantial mass ($\\approx 1\\text{ a.m.u.}$) | Negligible mass ($\\approx \\frac{1}{1840}\\text{ a.m.u.}$) |
| **Position** | Bound inside the **central nucleus** | Orbits in **electron shells** outside nucleus |

(iii) Chemical Symbols:
• (α) Lithium atom: **Li**
• (β) Chlorine molecule: **Cl₂**
• (γ) Oxygen atom: **O**`,
        maxMarks: 5
      }
    ]
  },

  // ==========================================
  // QUESTION 2: OCULAR ANATOMY, DEFECTS, SATELLITES & CHEMISTRY (20 MARKS)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Draw a clear, fully labelled sagittal cross-sectional diagram of the human eye, showing six optical components:

${svgQ2aHumanEye}`,
        workedSolution: `Diagram Description (refer to vector schematic):
A sagittal cross-section showing:
1. **Cornea:** Transparent anterior bulge that refracts incoming light.
2. **Iris:** Colored muscular ring that regulates pupil size.
3. **Pupil:** Central aperture admitting light into the eyeball.
4. **Crystalline Lens:** Biconvex flexible optical lens that adjusts focal length.
5. **Ciliary Body / Muscles:** Controls lens curvature for accommodation.
6. **Retina:** Inner posterior sensory layer containing photoreceptor rods and cones.
7. **Optic Nerve:** Transmits electrical nerve impulses from the retina to the brain.
8. **Sclera:** Tough, protective outer fibrous white layer of the eyeball.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `(i) Name two common refractive visual defects of the human eye.
(ii) State the specific type of spectacle lens used to optically correct each defect named in (b)(i).`,
        workedSolution: `(i) Visual defects:
1. **Short-sightedness (Myopia)**
2. **Long-sightedness (Hypermetropia)**

(ii) Optical corrections:
• Myopia (Short-sightedness): Light rays from distant objects focus in front of the retina. It is corrected using a **concave (diverging) lens**, which diverges incoming rays outward so they focus on the retina.
• Hypermetropia (Long-sightedness): Light rays from near objects focus behind the retina. It is corrected using a **convex (converging) lens**, which converges incoming rays inward to bring the focus forward onto the retina.`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `(i) What is an astronomical or artificial satellite?
(ii) State one fundamental difference between a natural satellite and an artificial satellite.
(iii) State two vital modern applications of artificial satellites orbiting planet Earth.`,
        workedSolution: `(i) Definition of satellite:
A celestial or manufactured body that revolves in a closed gravitational orbit around a more massive primary planet (e.g., the Moon orbiting Earth).

(ii) Natural vs. Artificial Satellite:
• A natural satellite is a naturally formed astronomical body (such as Earth's Moon).
• An artificial satellite is a human-engineered spacecraft launched into orbit by rockets.

(iii) Applications of artificial satellites:
1. **Global Telecommunications:** Relaying international telephone calls, satellite television broadcasting, and high-speed internet data.
2. **Meteorological Monitoring:** Tracking global weather patterns, cloud movements, and storm systems.
3. **Satellite Navigation:** Providing Global Positioning System (GPS) signals for aviation, maritime transport, and vehicle navigation.`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: `Write down the systematic chemical names of the substances formed when dilute hydrochloric acid [$\\text{HCl}$] reacts with each of the following compounds:
(i) Ammonia gas [$\\text{NH}_3$];
(ii) Aqueous sodium hydroxide [$\\text{NaOH}$];
(iii) Solid calcium carbonate [$\\text{CaCO}_3$].`,
        workedSolution: `Chemical Products:
• (i) Ammonia + $\\text{HCl}$:
  - Product: **Ammonium chloride** [$\\text{NH}_4\\text{Cl}$].
• (ii) Sodium hydroxide + $\\text{HCl}$:
  - Products: **Sodium chloride** [$\\text{NaCl}$] and **Water** [$\\text{H}_2\\text{O}$].
• (iii) Calcium carbonate + $\\text{HCl}$:
  - Products: **Calcium chloride** [$\\text{CaCl}_2$], **Water** [$\\text{H}_2\\text{O}$], and **Carbon dioxide gas** [$\\text{CO}_2$].`,
        maxMarks: 4
      }
    ]
  },

  // ==========================================
  // QUESTION 3: PHYSICAL/CHEMICAL CHANGES, MACHINES & EPIDEMIOLOGY (20 MARKS)
  // ==========================================
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `In each of the following everyday activities, state whether the change that occurs is a Physical change or a Chemical change, giving a clear scientific reason for your answer:
(i) An egg is boiled in water for five minutes;
(ii) A piece of starchy bread is chewed in the mouth for two minutes;
(iii) A piece of lean meat is chewed in the mouth for two minutes;
(iv) A piece of dry firewood is burned to ashes.`,
        workedSolution: `(i) Boiled egg:
• Change: **Chemical change**
• Reason: Heat permanently denatures and coagulates the liquid albumin proteins into a solid mass; new chemical cross-linkages are formed that cannot be reversed by cooling.

(ii) Chewed bread:
• Change: **Chemical change**
• Reason: Salivary amylase (ptyalin) in saliva chemically hydrolyzes insoluble starch polysaccharides into sweet-tasting maltose disaccharides, forming new chemical substances.

(iii) Chewed meat:
• Change: **Physical change**
• Reason: Chewing merely masticates and mechanically shreds muscle fibers into smaller pieces to increase surface area without chemical protein digestion occurring in the mouth (protein digestion begins in the stomach).

(iv) Burned firewood:
• Change: **Chemical change**
• Reason: Combustion oxidizes cellulose into entirely new chemical substances (carbon dioxide, water vapor, and mineral ash), releasing heat irreversibly.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `Define each of the following mechanical concepts in simple machines:
(i) A simple machine;
(ii) Mechanical Advantage ($MA$);
(iii) Velocity Ratio ($VR$).`,
        workedSolution: `(i) Simple machine:
A mechanical tool or device that makes work easier, faster, or more convenient by allowing an applied effort force at one point to overcome an opposing load resistance at another point.

(ii) Mechanical Advantage ($MA$):
The ratio of the opposing load force overcome by a machine to the applied effort force exerted on it:
$$MA = \\frac{\\text{Load } (L)}{\\text{Effort } (E)}$$

(iii) Velocity Ratio ($VR$):
The ratio of the displacement distance moved by the effort force to the distance moved by the load resistance in the same time interval:
$$VR = \\frac{\\text{Distance moved by Effort } (d_E)}{\\text{Distance moved by Load } (d_L)}$$`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "A system of levers is used to lift a load resistance of $3,000.0\\text{ N}$ when an effort force of $150.0\\text{ N}$ is applied to the effort arm. Calculate the Mechanical Advantage ($MA$) of the lever system.",
        workedSolution: `Formula:
$$\\text{Mechanical Advantage } (MA) = \\frac{\\text{Load } (L)}{\\text{Effort } (E)}$$
Substitute given values ($L = 3,000.0\\text{ N}$, $E = 150.0\\text{ N}$):
$$MA = \\frac{3,000.0\\text{ N}}{150.0\\text{ N}} = 20.0$$
Answer: The mechanical advantage of the system is $$20.0$$ *(dimensionless ratio)*.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: `(i) List three general causes of human pathological diseases.
(ii) State four practical public health measures by which infectious diseases can be prevented in a community.`,
        workedSolution: `(i) Causes of diseases:
1. **Infection by biological pathogens:** Pathogenic bacteria, viruses, fungi, protozoa, or parasitic worms.
2. **Nutritional deficiencies:** Chronic dietary lack of essential vitamins, minerals, or proteins (e.g., Kwashiorkor, Scurvy).
3. **Genetic and hereditary disorders:** Inherited chromosomal or gene mutations (e.g., Sickle-cell anemia, hemophilia).
4. **Environmental and chemical toxins:** Exposure to industrial pollutants, radiation, or heavy metals.

(ii) Preventive measures:
1. **Immunization / Vaccination:** Routine prophylactic vaccination of children against infectious diseases (measles, polio, tuberculosis).
2. **Safe Potable Water Supply:** Providing boiled or chemically chlorinated drinking water to prevent waterborne infections (cholera, typhoid).
3. **Environmental Sanitation:** Proper disposal of domestic sewage and solid refuse in covered bins, and clearing choked gutters to destroy vector breeding sites.
4. **Personal Hygiene:** Regular hand-washing with soap, bathing, and proper food hygiene.`,
        maxMarks: 5
      }
    ]
  },

  // ==========================================
  // QUESTION 4: REPRODUCTION, PROPAGATION, DENSITY & SOLVENTS (20 MARKS)
  // ==========================================
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Distinguish clearly between sexual reproduction and asexual reproduction in living organisms.",
        workedSolution: `Sexual vs. Asexual Reproduction:
• **Sexual reproduction:** Involves the fusion of haploid male and female gametes (fertilization) derived from two parents (or bisexual flowers), producing genetically varied diploid offspring.
• **Asexual reproduction:** Involves only a single parent organism producing offspring through mitosis without gametic fusion or fertilization, resulting in offspring that are genetically identical clones of the parent.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: `State the specific vegetative planting part that is used to propagate each of the following agricultural crops:
(i) Cassava;
(ii) Onion;
(iii) Banana;
(iv) Yam;
(v) Ginger;
(vi) Pineapple.`,
        workedSolution: `Vegetative Planting Parts:
• (i) Cassava: **Stem cutting (woody stem stake)**
• (ii) Onion: **Underground modified bulb**
• (iii) Banana: **Sword sucker (or basal corm piece)**
• (iv) Yam: **Tuber piece (yam sett / seed yam)**
• (v) Ginger: **Underground rhizome piece**
• (vi) Pineapple: **Crown (top foliage) / Sucker / Slip**`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: `(i) Define the physical term density of a substance.
(ii) Describe briefly how you would determine the bulk density of a dry sample of garden soil in a school laboratory.`,
        workedSolution: `(i) Definition of density:
The mass per unit volume of a physical substance:
$$\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)}$$
measured in $\\text{kg m}^{-3}$ or $\\text{g cm}^{-3}$.

(ii) Determination of soil density:
1. Weigh a clean, dry graduated measuring cylinder on an electronic balance and record its mass ($m_1$).
2. Pour a dry, crushed sample of garden soil into the cylinder to a known level (e.g., $50.0\\text{ cm}^3$) and gently tap the base on a rubber mat to settle particles without excessive compaction.
3. Record the volume occupied by the soil ($V$).
4. Weigh the cylinder containing the soil on the balance and record the total mass ($m_2$).
5. Calculate the mass of the soil sample:
$$m = m_2 - m_1$$
6. Calculate density:
$$\\rho = \\frac{m_2 - m_1}{V}$$`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: `State one appropriate chemical solvent for dissolving each of the following substances:
(i) Common table salt (sodium chloride);
(ii) Oil-based gloss paint;
(iii) Coal tar (bitumen);
(iv) Sucrose (cane sugar);
(v) Green chlorophyll pigment from leaves.`,
        workedSolution: `Appropriate Solvents:
• (i) Common salt: **Water [H₂O]**
• (ii) Oil-based paint: **Turpentine (mineral spirits) / Kerosene**
• (iii) Coal tar: **Benzene / Kerosene / Petrol**
• (iv) Sucrose sugar: **Water [H₂O]**
• (v) Chlorophyll: **Warm Ethanol (ethyl alcohol) / Acetone**`,
        maxMarks: 5
      }
    ]
  }
];

// ==========================================
// EXPORTED EXAM BUNDLES
// ==========================================
export const SET_BECE_1995_SCIENCE_P1 = {
  year: 1995,
  isVariant: true,
  setNumber: 127,
  subject: "Integrated Science",
  paperNumber: 1,
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  title: "Paper 1: Objective Test (Variant)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedScience1995P1
};

export const SET_BECE_1995_SCIENCE_P2 = {
  year: 1995,
  isVariant: true,
  setNumber: 127,
  subject: "Integrated Science",
  paperNumber: 2,
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  title: "Paper 2: Practical & Theory Essay (Variant)",
  durationMinutes: 75,
  instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 4,
  questions: paper2Science1995Questions
};

export const SET_BECE_1995_SCIENCE_COMPLETE = {
  year: 1995,
  isVariant: true,
  setNumber: 127,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: {
    title: "Paper 1: Objective Test (Variant)",
    durationMinutes: 45,
    totalQuestions: 40,
    questions: balancedScience1995P1
  },
  paper2: {
    title: "Paper 2: Practical & Theory Essay (Variant)",
    durationMinutes: 75,
    instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
    totalQuestions: 4,
    questions: paper2Science1995Questions
  },
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 2,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
