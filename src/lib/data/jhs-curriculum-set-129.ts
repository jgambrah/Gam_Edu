/**
 * JHS Curriculum Data - Set 129
 * 1997 BECE Integrated Science Complete Variant (Paper 1 & Paper 2)
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

// SVG for Q2(d): Falling Sphere Viscosity Comparison (Liquid A vs. Liquid B)
export const svgQ2dViscosityTubes = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 360 210' width='100%' height='195' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Cylinder A: Low Viscosity Liquid (Water/Ethanol) -->
    <g transform='translate(60, 20)'>
      <rect x='0' y='10' width='35' height='150' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='1.8'/>
      <text x='17' y='0' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Liquid A</text>
      <!-- Fast Falling Steel Ball Bearing near bottom -->
      <circle cx='17' cy='135' r='5' fill='#cbd5e1' stroke='#ffffff' stroke-width='1.5'/>
      <!-- Motion vectors -->
      <line x1='17' y1='115' x2='17' y2='125' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='2,2'/>
      <text x='17' y='180' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>Fast Fall (Low η)</text>
    </g>

    <!-- Cylinder B: High Viscosity Liquid (Glycerol/Engine Oil) -->
    <g transform='translate(200, 20)'>
      <rect x='0' y='10' width='35' height='150' fill='#d97706' opacity='0.3' stroke='#f59e0b' stroke-width='1.8'/>
      <text x='17' y='0' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Liquid B</text>
      <!-- Slow Falling Steel Ball Bearing near top -->
      <circle cx='17' cy='55' r='5' fill='#cbd5e1' stroke='#ffffff' stroke-width='1.5'/>
      <line x1='17' y1='38' x2='17' y2='46' stroke='#f59e0b' stroke-width='1.5' stroke-dasharray='2,2'/>
      <text x='17' y='180' font-size='9' font-weight='bold' fill='#ef4444' text-anchor='middle'>Slow Fall (High η)</text>
    </g>

    <text x='180' y='200' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>VISCOSITY EXPERIMENT: TERMINAL VELOCITY OF SPHERES IN FLUID MEDIA</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q4(b): Two Cells in Parallel Connected in Series with Switch and Bulb
export const svgQ4bParallelCellsCircuit = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 360 200' width='100%' height='185' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Top Wire Loop -->
    <line x1='50' y1='45' x2='100' y2='45' stroke='#38bdf8' stroke-width='2'/>
    
    <!-- Parallel Cell Bank on Top Branch -->
    <line x1='100' y1='25' x2='100' y2='65' stroke='#38bdf8' stroke-width='2'/>
    <!-- Cell 1 (Upper) -->
    <line x1='100' y1='25' x2='125' y2='25' stroke='#38bdf8' stroke-width='1.5'/>
    <line x1='125' y1='16' x2='125' y2='34' stroke='#10b981' stroke-width='2'/>
    <line x1='131' y1='19' x2='131' y2='31' stroke='#ef4444' stroke-width='3.5'/>
    <line x1='131' y1='25' x2='155' y2='25' stroke='#38bdf8' stroke-width='1.5'/>
    <!-- Cell 2 (Lower) -->
    <line x1='100' y1='65' x2='125' y2='65' stroke='#38bdf8' stroke-width='1.5'/>
    <line x1='125' y1='56' x2='125' y2='74' stroke='#10b981' stroke-width='2'/>
    <line x1='131' y1='59' x2='131' y2='71' stroke='#ef4444' stroke-width='3.5'/>
    <line x1='131' y1='65' x2='155' y2='65' stroke='#38bdf8' stroke-width='1.5'/>
    <line x1='155' y1='25' x2='155' y2='65' stroke='#38bdf8' stroke-width='2'/>
    <text x='128' y='8' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>2 Cells in Parallel</text>
    
    <line x1='155' y1='45' x2='220' y2='45' stroke='#38bdf8' stroke-width='2'/>

    <!-- Key / Switch in Closed Position -->
    <circle cx='224' cy='45' r='2.5' fill='#e2e8f0'/>
    <line x1='224' y1='45' x2='250' y2='45' stroke='#e2e8f0' stroke-width='2.5'/>
    <circle cx='250' cy='45' r='2.5' fill='#e2e8f0'/>
    <text x='237' y='30' font-size='9' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Switch</text>
    <line x1='250' y1='45' x2='300' y2='45' stroke='#38bdf8' stroke-width='2'/>

    <!-- Right Side Bus -->
    <line x1='300' y1='45' x2='300' y2='140' stroke='#38bdf8' stroke-width='2'/>

    <!-- Bottom Branch with Series Lamp Bulb -->
    <line x1='300' y1='140' x2='200' y2='140' stroke='#38bdf8' stroke-width='2'/>
    <circle cx='175' cy='140' r='14' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/>
    <path d='M 166 148 L 175 130 L 184 148' stroke='#f59e0b' stroke-width='2' fill='none'/>
    <text x='175' y='170' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Electric Bulb</text>
    <line x1='161' y1='140' x2='50' y2='140' stroke='#38bdf8' stroke-width='2'/>
    <line x1='50' y1='140' x2='50' y2='45' stroke='#38bdf8' stroke-width='2'/>

    <text x='180' y='190' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>PARALLEL BATTERY BANK CONNECTED IN SERIES WITH SWITCH AND LOAD BULB</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q4(e): Candle Burning in Inverted Gas Jar over Water Trough
export const svgQ4eCombustionJar = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 210' width='100%' height='195' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Water Trough (Bottom) -->
    <rect x='40' y='140' width='260' height='40' fill='#0284c7' opacity='0.3' stroke='#38bdf8' stroke-width='1.5'/>
    <line x1='40' y1='155' x2='300' y2='155' stroke='#38bdf8' stroke-width='2'/>
    <text x='50' y='175' font-size='9' font-weight='bold' fill='#38bdf8'>Water Trough</text>

    <!-- Inverted Gas Jar -->
    <g transform='translate(125, 30)'>
      <path d='M 10 135 L 10 10 L 80 10 L 80 135' fill='#0284c7' opacity='0.15' stroke='#cbd5e1' stroke-width='2'/>
      <text x='45' y='-5' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Inverted Gas Jar</text>

      <!-- Water Level Rise inside Jar (~1/5th volume = 21% oxygen used) -->
      <rect x='11' y='110' width='68' height='35' fill='#38bdf8' opacity='0.6'/>
      <line x1='80' y1='110' x2='125' y2='110' stroke='#10b981' stroke-width='1.5'/>
      <text x='130' y='114' font-size='9' font-weight='bold' fill='#10b981'>Water level rises ~1/5th</text>

      <!-- Extinguished Candle on Floating Cork -->
      <rect x='30' y='100' width='30' height='10' rx='2' fill='#a16207'/>
      <rect x='40' y='75' width='10' height='25' fill='#e2e8f0' stroke='#94a3b8'/>
      <!-- Snuffed wick with smoke -->
      <line x1='45' y1='75' x2='45' y2='68' stroke='#0f172a' stroke-width='1.5'/>
      <circle cx='46' cy='62' r='2' fill='#94a3b8' opacity='0.8'/>
      <text x='45' y='60' font-size='8' fill='#94a3b8' text-anchor='middle'>Extinguished flame</text>
    </g>

    <text x='170' y='198' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>WATER RISES BY ~21% TO REPLACE OXYGEN CONSUMED BY BURNING CANDLE</text>
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
    prompt: "In the human digestive system, fully digested food nutrients are absorbed into mesenteric blood capillaries across the walls of the:",
    correctAnswer: "Small intestine (Ileum)",
    distractors: [
      "Duodenum",
      "Large intestine (colon)",
      "Terminal rectum"
    ],
    hint: "Surface area is expanded by millions of microscopic mucosal villi.",
    workedSolution: "The ileum (small intestine) possesses millions of microscopic finger-like villi that absorb digested amino acids, monosaccharides, and fatty acids into blood and lymph.",
    points: 1
  },
  {
    number: 2,
    prompt: "Which of the following organisms is an obligate external animal parasite that feeds on the blood of its mammalian host?",
    correctAnswer: "Pasture tick [Ixodida]",
    distractors: [
      "Fruitfly [Drosophila]",
      "Domestic housefly",
      "Vegetable aphid"
    ],
    hint: "An external blood-feeding arachnid attaching to cattle and dogs.",
    workedSolution: "Ticks are hematophagous ectoparasites that cling to host skin to suck blood meals, transmitting pathogens. Fruitflies and houseflies are free-living insects.",
    points: 1
  },
  {
    number: 3,
    prompt: "In agricultural soil management, excess soil acidity can be effectively neutralized by amending the topsoil with:",
    correctAnswer: "Agricultural lime (calcium hydroxide / calcium carbonate)",
    distractors: [
      "Dilute sulfuric acid solution",
      "Ammonium sulfate fertilizer",
      "Potassium chloride salt"
    ],
    hint: "Basic alkaline calcium compounds neutralize acidic hydrogen ions, raising pH.",
    workedSolution: "Agricultural liming (CaCO₃ or Ca(OH)₂) neutralizes soil acidity by replacing acidic H⁺ and Al³⁺ ions with basic Ca²⁺ ions, raising pH.",
    points: 1
  },
  {
    number: 4,
    prompt: "In astrophysics and cosmology, planet Earth and our Solar System reside within a barred spiral galaxy known as the:",
    correctAnswer: "Milky Way Galaxy",
    distractors: [
      "Orion Constellation",
      "Meteorite cluster",
      "Andromeda Satellite alone"
    ],
    hint: "A vast spiral stellar system containing several hundred billion stars.",
    workedSolution: "Our Solar System is situated in the Orion Arm of the barred spiral Milky Way Galaxy. Constellations are optical star patterns, and satellites orbit planets.",
    points: 1
  },
  {
    number: 5,
    prompt: "Which agricultural soil type is considered the most fertile and productive for commercial crop farming?",
    correctAnswer: "Loamy soil",
    distractors: [
      "Heavy clayey soil",
      "Coarse sandy soil",
      "Pure unweathered humus"
    ],
    hint: "Combines sand, silt, and clay in balanced proportions with organic matter.",
    workedSolution: "Loam contains a balanced textural blend of sand, silt, and clay along with humus, providing optimal water retention, nutrient capacity, and root aeration.",
    points: 1
  },
  {
    number: 6,
    prompt: "Which chemical reagent solution is used in laboratory food tests to detect the presence of proteins by producing a brick-red or violet precipitate?",
    correctAnswer: "Millon's reagent (or Biuret reagent)",
    distractors: [
      "Benedict's solution (for reducing sugars)",
      "Fehling's solution (for reducing sugars)",
      "Dilute iodine solution (for starch)"
    ],
    hint: "Millon's reagent turns brick-red on heating with proteins; Biuret turns violet.",
    workedSolution: "Millon's reagent tests for protein phenolic groups, forming a white precipitate that turns brick-red on heating. Benedict's and Fehling's test for reducing sugars; iodine tests for starch.",
    points: 1
  },
  {
    number: 7,
    prompt: "According to the universal Law of Conservation of Energy, energy can:",
    correctAnswer: "Neither be created nor destroyed, but can be transformed from one form to another",
    distractors: [
      "Be created from nothing and destroyed completely",
      "Be created by machines but cannot be destroyed",
      "Be destroyed by friction but never created"
    ],
    hint: "Total energy in an isolated system remains constant during all transformations.",
    workedSolution: "The Law of Conservation of Energy states that energy cannot be created or destroyed; it only changes from one form to another, maintaining a constant total energy.",
    points: 1
  },
  {
    number: 8,
    prompt: "What is the primary immunological purpose of administering prophylactic medical vaccines to children?",
    correctAnswer: "To stimulate the immune system to produce protective antibodies and memory cells",
    distractors: [
      "To chemically neutralize and replace poisoned cellular tissues",
      "To kill active disease-producing organisms currently in the body",
      "To permanently suppress all white blood cell proliferation"
    ],
    hint: "Introduces harmless antigens to train B-lymphocytes before actual infection occurs.",
    workedSolution: "Vaccines expose the immune system to attenuated or inactivated antigens, inducing B-cells to synthesize specific protective antibodies and memory cells against future infection.",
    points: 1
  },
  {
    number: 9,
    prompt: "Which planet in our Solar System appears as a luminous 'Morning Star' or 'Evening Star' in the dawn and twilight sky?",
    correctAnswer: "Planet Venus",
    distractors: [
      "Planet Jupiter",
      "Planet Mars",
      "Planet Saturn"
    ],
    hint: "Possesses a high albedo due to dense reflective sulfuric acid clouds.",
    workedSolution: "Venus is the second planet from the Sun, appearing exceptionally bright in mornings or evenings because its thick sulfuric acid cloud deck reflects ~75% of sunlight.",
    points: 1
  },
  {
    number: 10,
    prompt: "Which sequence correctly outlines the continuous unidirectional flow of systemic blood through the mammalian cardiovascular system?",
    correctAnswer: "Heart → Arteries → Organs (Capillaries) → Veins → Heart",
    distractors: [
      "Heart → Veins → Organs → Arteries → Heart",
      "Heart → Arteries → Veins → Organs → Heart",
      "Heart → Organs → Arteries → Veins → Heart"
    ],
    hint: "Arteries convey blood away from heart to tissues; veins return blood to heart.",
    workedSolution: "Oxygenated blood is pumped from the heart through muscular arteries to organ capillaries, then deoxygenated blood returns through systemic veins to the heart.",
    points: 1
  },
  {
    number: 11,
    prompt: "In Newtonian classical mechanics, the gravitational weight of an object is defined as the:",
    correctAnswer: "Downward force with which planetary gravity acts on its mass [W = mg]",
    distractors: [
      "Gravitational force with which the distant Sun pulls it",
      "Gravitational force with which the Moon pulls it",
      "Inherent inertia of the object when gravity is absent"
    ],
    hint: "A vector force measured in Newtons ($W = mg$); mass is measured in kilograms.",
    workedSolution: "Weight is the downward gravitational force exerted on an object by Earth ($W = mg$), varying with local gravitational acceleration $g$. Mass is invariant.",
    points: 1
  },
  {
    number: 12,
    prompt: "In reproductive biology, the syngamic fusion of a haploid sperm nucleus with a haploid ovum nucleus is called:",
    correctAnswer: "Fertilization",
    distractors: [
      "Menstruation",
      "Floral pollination",
      "Implantation"
    ],
    hint: "Yields a single diploid zygote ($2n$).",
    workedSolution: "Fertilization is the fusion of male and female gamete nuclei to form a single diploid zygote. Pollination is the transfer of pollen in plants.",
    points: 1
  },
  {
    number: 13,
    prompt: "Calculate the mechanical work done when a container is pushed across a horizontal floor by an applied force of $20.0\\text{ N}$ through a distance of $2.0\\text{ m}$:",
    correctAnswer: "40.0 Joules",
    distractors: [
      "0.01 Joules",
      "0.10 Joules",
      "10.0 Joules"
    ],
    hint: "$$\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (d) = 20.0 \\times 2.0$$.",
    workedSolution: "$$\\text{Work Done } (W) = F \\times d = 20.0\\text{ N} \\times 2.0\\text{ m} = 40.0\\text{ Joules (J)}$$.",
    points: 1
  },
  {
    number: 14,
    prompt: "Which of the following anatomical structures form direct functional sections of the continuous alimentary canal tube?\nI. The colon (large intestine)\nII. The gullet (esophagus)\nIII. The liver\nIV. The pancreas",
    correctAnswer: "I and II only",
    distractors: [
      "I and IV only",
      "II and III only",
      "II and IV only"
    ],
    hint: "The gullet and colon form the hollow tube; liver and pancreas are accessory digestive glands.",
    workedSolution: "The alimentary canal is the continuous digestive tube: mouth → gullet → stomach → intestines → colon → rectum (I and II). The liver and pancreas are accessory organs.",
    points: 1
  },
  {
    number: 15,
    prompt: "Which of the following simple tools represents a third-class lever whose applied effort is positioned between the pivot and the load?",
    correctAnswer: "A pair of forceps (or tweezers)",
    distractors: [
      "A crown-cap bottle opener",
      "A pair of tailoring scissors",
      "A laboratory beam balance"
    ],
    hint: "Effort is applied at the center; scissors are Class 1, bottle openers are Class 2.",
    workedSolution: "In a Class 3 lever, the effort force is exerted between the fulcrum and the load (e.g., forceps, tweezers, sugar tongs, human forearm).",
    points: 1
  },
  {
    number: 16,
    prompt: "Which of the following plant leaves exhibits rapid thigmonastic sensitivity by folding its leaflets inward when touched?",
    correctAnswer: "Mimosa pudica [Sensitive plant]",
    distractors: [
      "Cassava leaves",
      "Citrus orange leaves",
      "Oil palm fronds"
    ],
    hint: "Undergoes rapid turgor loss in specialized pulvini upon tactile stimulation.",
    workedSolution: "Mimosa pudica exhibits rapid thigmonasty: tactile contact triggers potassium and water efflux from pulvinus cells, collapsing leaflets inward.",
    points: 1
  },
  {
    number: 17,
    prompt: "Which of the following macroscopic physical properties is shared by substances in both the liquid state and the gaseous state?",
    correctAnswer: "They possess no fixed, definite geometric shape (conform to containers)",
    distractors: [
      "They possess a fixed, definite geometric shape",
      "They possess a fixed shape and fixed physical volume",
      "They are completely incompressible under pressure"
    ],
    hint: "Fluids flow and adopt the shape of their vessel; gases also expand to fill volume.",
    workedSolution: "Liquids and gases are fluids that lack a rigid shape, flowing to adopt the shape of their container. Liquids have fixed volume, whereas gases have variable volume.",
    points: 1
  },
  {
    number: 18,
    prompt: "Which of the following tropical agricultural crops is propagated vegetatively on plantations using lateral sword suckers?",
    correctAnswer: "Plantain [Musa paradisiaca]",
    distractors: [
      "Onion bulb",
      "Sweet potato tuber",
      "Citrus orange tree"
    ],
    hint: "Underground corms sprout lateral vegetative shoots known as suckers.",
    workedSolution: "Plantains and bananas are propagated vegetatively using sword suckers produced from subterranean corms, as commercial varieties do not produce viable seeds.",
    points: 1
  },
  {
    number: 19,
    prompt: "Which of the following human industrial activities causes both atmospheric air pollution and aquatic water pollution?",
    correctAnswer: "Unrestricted industrial fossil fuel combustion and chemical effluent discharge",
    distractors: [
      "Large-scale afforestation and tree planting",
      "Constructing residential school buildings",
      "Paving municipal roads with bitumen"
    ],
    hint: "Emits toxic smoke into the atmosphere while dumping chemical effluents into waterways.",
    workedSolution: "Industrial processing releases toxic exhaust fumes (SO₂, CO) into the air while discharging chemical effluents and heavy metals into rivers, polluting both media.",
    points: 1
  },
  {
    number: 20,
    prompt: "What is the total number of hydrogen atoms present in exactly two discrete molecules of pure water ($2\\text{H}_2\\text{O}$)?",
    correctAnswer: "4 hydrogen atoms",
    distractors: [
      "1 hydrogen atom",
      "2 hydrogen atoms",
      "3 hydrogen atoms"
    ],
    hint: "Each water molecule (H₂O) contains 2 hydrogen atoms: $2 \\times 2 = 4$.",
    workedSolution: "In $2\\text{H}_2\\text{O}$, the coefficient 2 multiplies the subscript 2 of hydrogen, yielding $2 \\times 2 = 4$ hydrogen atoms.",
    points: 1
  },
  {
    number: 21,
    prompt: "Biological saprophytic decay is an essential ecological process in nature primarily because it brings about the:",
    correctAnswer: "Mineralization and recycling of locked plant nutrients from dead organisms",
    distractors: [
      "Direct synthesis of animal cells in living bodies",
      "Massive production of molecular oxygen gas by fungi",
      "Formation of complex vitamins in living herbivores"
    ],
    hint: "Decomposers break down dead biomass, returning nitrates and phosphates to the soil.",
    workedSolution: "Saprophytic bacteria and fungi decompose dead organic biomass, mineralizing complex tissues into simple inorganic ions that replenish soil fertility.",
    points: 1
  },
  {
    number: 22,
    prompt: "In astronomical optics, what is the scientific name of the central, totally dark region of shadow cast during an eclipse?",
    correctAnswer: "The umbra",
    distractors: [
      "Annular eclipse",
      "Lunar eclipse",
      "The outer penumbra"
    ],
    hint: "The inner region where all direct rays from the Sun are completely blocked.",
    workedSolution: "The umbra is the completely dark central conical shadow where direct light from the illuminating source is totally obstructed. The outer, partially lit shadow is the penumbra.",
    points: 1
  },
  {
    number: 23,
    prompt: "In atomic physics, what two fundamental subatomic particles reside together inside the dense central nucleus of an atom?",
    correctAnswer: "Neutrons and protons",
    distractors: [
      "Electrons and protons",
      "Electrons and electron shells",
      "Neutrons and electrons"
    ],
    hint: "Positively charged protons and neutral neutrons form the nucleus; electrons orbit in shells.",
    workedSolution: "The atomic nucleus contains positively charged protons and uncharged neutrons (nucleons). Negatively charged electrons orbit in concentric shells around the nucleus.",
    points: 1
  },
  {
    number: 24,
    prompt: "Which chemical disinfectant is internationally used in municipal water treatment plants to destroy pathogenic bacteria in town water supplies?",
    correctAnswer: "Chlorine gas (or sodium hypochlorite)",
    distractors: [
      "Ethanol alcohol",
      "Compressed carbon dioxide",
      "Diatomic nitrogen gas"
    ],
    hint: "Acts as a powerful oxidizing disinfectant that destroys waterborne pathogens.",
    workedSolution: "Chlorination is the primary disinfection process in municipal water purification; chlorine destroys bacterial pathogens, preventing waterborne epidemics like cholera.",
    points: 1
  },
  {
    number: 25,
    prompt: "Deciduous tropical trees shed their leaves during the prolonged dry harmattan season primarily to protect themselves against:",
    correctAnswer: "Severe internal water desiccation and excessive transpiration",
    distractors: [
      "Damage from seasonal bushfires",
      "Freezing cold winter weather",
      "Herbivorous browsing cattle"
    ],
    hint: "Shedding leaves eliminates stomatal transpiration when soil moisture is depleted.",
    workedSolution: "Shedding leaves reduces transpiring surface area to near zero, conserving internal water reserves when soil moisture is depleted during the dry season.",
    points: 1
  },
  {
    number: 26,
    prompt: "When an insoluble irregular stone is lowered into a water-filled measuring cylinder, the volume increase of water is equal to the:",
    correctAnswer: "Physical volume of the submerged stone",
    distractors: [
      "Mass of the measuring container",
      "Mass of the stone in air",
      "Physical density of the water"
    ],
    hint: "By Archimedes' principle, a submerged body displaces a volume of fluid equal to its own volume.",
    workedSolution: "An insoluble solid completely submerged in a liquid displaces an amount of liquid exactly equal to the physical volume of the solid ($V = V_2 - V_1$).",
    points: 1
  },
  {
    number: 27,
    prompt: "In the systemic human circulatory system, which blood vessels convey deoxygenated blood under low pressure back to the heart?",
    correctAnswer: "Systemic veins (with internal valves)",
    distractors: [
      "Muscular systemic arteries",
      "Erythrocyte red blood cells alone",
      "Arteriolar capillaries"
    ],
    hint: "Possess wide lumens and one-way valves to prevent backflow; arteries convey oxygenated blood.",
    workedSolution: "Systemic veins return deoxygenated blood from tissues to the right atrium under low pressure, using pocket valves to prevent backflow. Systemic arteries carry oxygenated blood.",
    points: 1
  },
  {
    number: 28,
    prompt: "Which physical force must act continuously on an object directed toward the center of curvature to cause it to move in a circular path?",
    correctAnswer: "Centripetal force",
    distractors: [
      "Gravitational force alone",
      "Inertial forward force",
      "Reaction contact force"
    ],
    hint: "Acts perpendicular to linear velocity, directed toward the center of rotation ($F = \\frac{mv^2}{r}$).",
    workedSolution: "Centripetal force is the inward radial force required to keep an object moving in a curved or circular trajectory, accelerating it toward the center of rotation ($F = \\frac{mv^2}{r}$).",
    points: 1
  },
  {
    number: 29,
    prompt: "In aquatic ichthyology, the paired fins of a teleost bony fish (pectoral and pelvic fins) are utilized primarily for:",
    correctAnswer: "Steering, rising, diving, and maintaining horizontal balance",
    distractors: [
      "Protection from predators and deep diving",
      "Generating powerful forward propulsion alone",
      "Regulating internal osmotic salt balance"
    ],
    hint: "The single caudal fin provides propulsion; paired fins act as hydrodynamic rudders.",
    workedSolution: "Paired fins (pectoral and pelvic) control pitch, steering, diving, and horizontal balance. The unpaired caudal fin generates forward thrust.",
    points: 1
  },
  {
    number: 30,
    prompt: "In human excretory physiology, liquid urine is produced by filtering metabolic wastes from blood plasma inside the:",
    correctAnswer: "Kidneys (within microscopic nephrons)",
    distractors: [
      "Urinary bladder storage sac",
      "Metabolic liver",
      "External urethra"
    ],
    hint: "Ultrafiltration and selective reabsorption occur inside kidney nephrons.",
    workedSolution: "Urine is formed in the kidneys via glomerular filtration and tubular reabsorption in nephrons. The bladder merely stores urine until urination.",
    points: 1
  },
  {
    number: 31,
    prompt: "Autotrophic photosynthesis occurs exclusively in green plants and algae because they possess:",
    correctAnswer: "Photosynthetic chlorophyll pigments in chloroplasts",
    distractors: [
      "Specialized water-absorbing root hairs",
      "High metabolic respiratory activity",
      "Geographic location in the tropics"
    ],
    hint: "Photoreceptor pigments that absorb photon light energy to drive photolysis.",
    workedSolution: "Photosynthesis requires chlorophyll pigments to trap blue and red wavelengths of solar radiation, converting light energy into chemical ATP and NADPH.",
    points: 1
  },
  {
    number: 32,
    prompt: "During cellular aerobic respiration, ingested food glucose undergoes slow enzymatic oxidation in cells to produce heat and ATP. In this process:",
    correctAnswer: "Chemical potential energy is transformed into thermal heat energy and ATP",
    distractors: [
      "Electrical energy is converted into thermal heat energy",
      "Kinetic energy is converted into thermal heat energy",
      "Mechanical energy is converted into heat energy"
    ],
    hint: "Energy stored in covalent chemical bonds of glucose is released as heat and ATP.",
    workedSolution: "Cellular respiration is an exothermic catabolic process converting chemical potential energy stored in food molecules into thermal heat energy and chemical ATP.",
    points: 1
  },
  {
    number: 33,
    prompt: "In our Solar System, which planet orbits at the closest distance to planet Earth?",
    correctAnswer: "Planet Venus",
    distractors: [
      "Planet Jupiter",
      "Planet Mercury",
      "Dwarf planet Pluto"
    ],
    hint: "Earth's orbital neighbor situated inward toward the Sun.",
    workedSolution: "Venus is Earth's closest neighboring planet, orbiting at an average minimum distance of approximately 41 million kilometers from Earth.",
    points: 1
  },
  {
    number: 34,
    prompt: "Which of the following biological organisms burrows through topsoil, aerating the soil and enhancing agricultural fertility with nutrient-rich casts?",
    correctAnswer: "Subterranean earthworms",
    distractors: [
      "Parasitic Guinea worms",
      "Intestinal hookworms",
      "Parasitic roundworms"
    ],
    hint: "Annelid worms that aerate soil and decompose organic residues.",
    workedSolution: "Earthworms burrow through topsoil, improving aeration and water infiltration while their digestive casts enrich the soil with organic matter and available minerals.",
    points: 1
  },
  {
    number: 35,
    prompt: "A stone projectile fired from a stretched rubber catapult strikes and kills a pest bird. The stone possesses lethal kinetic energy because:",
    correctAnswer: "Elastic potential energy stored in the stretched rubber bands was transferred to the stone",
    distractors: [
      "The stone possessed sharp mineral cutting edges",
      "Tension forces remained permanently inside the stone",
      "The stone's chemical mass expanded in flight"
    ],
    hint: "Doing work to stretch the rubber band stores elastic potential energy that converts to kinetic energy.",
    workedSolution: "Work done in stretching the catapult stores elastic potential energy in the rubber, which converts upon release into high kinetic energy in the stone.",
    points: 1
  },
  {
    number: 36,
    prompt: "Which of the following biological organisms is a parasitic flowering plant that absorbs water and nutrients from host plants using haustoria?",
    correctAnswer: "Dodder plant [Cuscuta]",
    distractors: [
      "Cocoa capsid bug",
      "Foliage-eating caterpillar",
      "Ectoparasitic head louse"
    ],
    hint: "A yellow leafless twining vine that penetrates host plant vascular bundles.",
    workedSolution: "Dodder (Cuscuta) is a parasitic flowering plant that lacks chlorophyll, tapping into host vascular systems via haustoria to extract sap.",
    points: 1
  },
  {
    number: 37,
    prompt: "Following the complete enzymatic digestion of dietary lean meat in the human alimentary canal, the absorbable end-products are:",
    correctAnswer: "Amino acids",
    distractors: [
      "Free fatty acids",
      "Trihydric glycerol",
      "Glucose monosaccharides"
    ],
    hint: "Proteins in lean meat are hydrolyzed by proteases into individual monomers.",
    workedSolution: "Lean meat consists of proteins. Gastric pepsin and pancreatic trypsin break down peptide bonds, hydrolyzing proteins into absorbable amino acids.",
    points: 1
  },
  {
    number: 38,
    prompt: "In which of the following domestic electrical appliances is electrical energy transformed primarily into thermal heat energy?",
    correctAnswer: "An electric cooking stove",
    distractors: [
      "An electric ceiling fan",
      "A domestic refrigerator compressor",
      "An audio magnetic tape recorder"
    ],
    hint: "Utilizes high-resistance heating coils to generate heat via Joule heating ($P = I^2R$).",
    workedSolution: "Electric stoves contain high-resistance heating elements that convert electrical energy into thermal heat energy. Fans convert electrical energy into kinetic energy.",
    points: 1
  },
  {
    number: 39,
    prompt: "In a portable battery-powered electric torch, the electrical energy that illuminates the bulb filament originates from internal:",
    correctAnswer: "Chemical potential energy stored in the dry cell",
    distractors: [
      "Glass lens optics",
      "Tungsten metal filament alone",
      "External atmospheric air"
    ],
    hint: "Redox reactions between the zinc casing and manganese dioxide generate electromotive force.",
    workedSolution: "The dry cell contains chemical reactants (zinc and manganese dioxide) that undergo redox reactions, generating electromotive force to drive electrical current.",
    points: 1
  },
  {
    number: 40,
    prompt: "In human dermatological excretory physiology, what substance constitutes the largest quantitative component of cutaneous sweat?",
    correctAnswer: "Water [~99% by mass]",
    distractors: [
      "Simple glucose sugar",
      "Sebaceous oil",
      "Dissolved sodium chloride salt"
    ],
    hint: "Evaporative cooling relies on water having a high latent heat of vaporization.",
    workedSolution: "Sweat consists of approximately 99% water, with small amounts of dissolved mineral salts (sodium chloride) and traces of metabolic urea and lactic acid.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199706);

export const balancedScience1997P1: QuestionItem[] = rawScienceBank.map((q, idx) => {
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
export const paper2Science1997Questions: Paper2Question[] = [
  // ==========================================
  // QUESTION 1: OSMOSIS, CAPILLARITY, HEAT & SOLUTIONS (20 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Define the physical and biological term osmosis.",
        workedSolution: `Osmosis is the net movement or diffusion of water (solvent) molecules from a region of higher water potential (dilute solution) to a region of lower water potential (concentrated solution) across a selectively permeable (semi-permeable) membrane.`,
        maxMarks: 3
      },
      {
        subId: "(b)",
        prompt: "State two everyday domestic or natural observations that can be explained in terms of capillary action (capillarity).",
        workedSolution: `1. Liquid kerosene rising up the cotton fabric wick of a storm lantern.
2. Blotting paper or paper towels absorbing liquid ink or water spills.
3. Towel fabric absorbing water droplets from wet skin after a bath.
4. Capillary rise of moisture through fine soil pores toward the surface.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: `(i) Name the three fundamental physical processes by which thermal heat is transferred from one point to another.
(ii) Name three common domestic or industrial appliances that utilize an automated bimetallic thermostat for temperature regulation.`,
        workedSolution: `(i) Processes of heat transfer:
1. Conduction
2. Convection
3. Radiation

(ii) Appliances using a thermostat:
1. Electric pressing iron
2. Domestic refrigerator
3. Electric water heater (immersion geyser)
4. Electric cooking oven / air conditioner`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: `(i) What is a saturated solution in chemistry?
(ii) Classify each of the following liquid mixtures as either a Solution, a Suspension, or a Colloid:
• Fine clay stirred in water;
• Table sugar dissolved in water;
• Ammonia gas dissolved in water;
• Insoluble powdered chalk in water;
• Potassium permanganate crystals dissolved in water;
• Soap lather in water.`,
        workedSolution: `(i) Definition of saturated solution:
A solution that contains the maximum concentration of dissolved solute at a given specific temperature, such that no additional solute can dissolve in the presence of undissolved solute particles.

(ii) Classification Table:
• Clay in water: **Suspension** (coarse heterogeneous mixture that settles on standing)
• Sugar in water: **Solution** (homogeneous molecular single phase)
• Ammonia in water: **Solution** (homogeneous aqueous solution)
• Powdered chalk in water: **Suspension** (insoluble calcium carbonate that settles)
• Potassium permanganate in water: **Solution** (clear homogeneous ionic solution)
• Soap in water: **Colloid** (micellar colloidal dispersion exhibiting the Tyndall effect)`,
        maxMarks: 8
      }
    ]
  },

  // ==========================================
  // QUESTION 2: PARASITOLOGY, FOODS, FORMULAE & VISCOSITY (20 MARKS)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Copy the table below and write down the usual host organism for each of the parasites listed:

| Parasite | Usual Host Organism |
| :--- | :--- |
| *Plasmodium* | |
| Cocoa Capsid bug | |
| Tapeworm (*Taenia*) | |
| Dodder plant (*Cuscuta*) | |`,
        workedSolution: `Completed Table:
• *Plasmodium*: **Human being** (and female *Anopheles* mosquito vector)
• Cocoa Capsid bug: **Cocoa tree (*Theobroma cacao*)**
• Tapeworm (*Taenia*): **Human / Pig / Cattle**
• Dodder plant (*Cuscuta*): **Green flowering plants / shrubs (host vegetation)**`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: `(i) Name three major macronutrient classes of food essential for human nutrition.
(ii) For each of the following common food substances, state the primary food nutrient class to which it belongs:
**Starch, Fresh milk, Margarine, Refined cane sugar.**`,
        workedSolution: `(i) Three classes of food:
1. Carbohydrates
2. Proteins
3. Lipids (Fats and oils)

(ii) Classification of substances:
• Starch: **Carbohydrate (polysaccharide)**
• Fresh milk: **Protein / Lipid (contains casein protein, milk fat, and lactose)**
• Margarine: **Lipid (hydrogenated vegetable fat/oil)**
• Cane sugar: **Carbohydrate (sucrose disaccharide)**`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `Write down the systematic chemical formula for each of the following inorganic compounds:
(i) Calcium hydroxide;
(ii) Zinc (II) chloride;
(iii) Sodium nitrate [sodium trioxonitrate (V)];
(iv) Calcium carbonate [calcium trioxocarbonate (IV)];
(v) Potassium sulfate [potassium tetraoxosulfate (VI)].`,
        workedSolution: `Chemical Formulae:
• (i) Calcium hydroxide: $\\text{Ca(OH)}_2$
• (ii) Zinc (II) chloride: $\\text{ZnCl}_2$
• (iii) Sodium nitrate: $\\text{NaNO}_3$
• (iv) Calcium carbonate: $\\text{CaCO}_3$
• (v) Potassium sulfate: $\\text{K}_2\\text{SO}_4$`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: `(i) Define the physical term viscosity of a fluid.
(ii) Describe a simple laboratory experiment you would perform to compare the viscosities of two different transparent liquids A and B:

${svgQ2dViscosityTubes}`,
        workedSolution: `(i) Definition of viscosity:
The internal frictional resistance offered by a fluid (liquid or gas) to flow or to the relative motion of its adjacent molecular layers when subjected to shear stress.

(ii) Viscosity comparison experiment (refer to vector schematic):
1. **Apparatus:** Two identical, clean graduated glass cylinders, two identical steel ball bearings of equal mass and diameter, a stopwatch, and samples of liquids A and B.
2. **Procedure:**
   • Fill cylinder 1 with liquid A to a marked height and cylinder 2 with liquid B to the exact same height.
   • Hold a steel ball bearing at the liquid surface of cylinder A, release it gently, and start the stopwatch simultaneously.
   • Measure the time ($t_A$) taken for the ball bearing to fall through the liquid between two reference lines.
   • Repeat the identical procedure using the second ball bearing in cylinder B and record the fall time ($t_B$).
3. **Observation & Conclusion:** The liquid in which the ball bearing takes a longer time to descend has greater internal resistance to flow and is therefore more viscous (higher viscosity).`,
        maxMarks: 6
      }
    ]
  },

  // ==========================================
  // QUESTION 3: METEOROLOGY, ASTRONOMY, PRESERVATION & REACTIONS (20 MARKS)
  // ==========================================
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) Define the meteorological terms humidity and wind.
(ii) Name the calibrated instruments used to measure atmospheric humidity and wind speed.`,
        workedSolution: `(i) Definitions:
• **Humidity:** The amount or concentration of water vapor present in atmospheric air.
• **Wind:** Air in horizontal motion across the Earth's surface, driven by atmospheric pressure gradients.

(ii) Meteorological instruments:
• Humidity: **Hygrometer** (wet-and-dry bulb psychrometer)
• Wind speed: **Anemometer** (rotating cup anemometer)`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: `(i) What is an astronomical galaxy?
(ii) Name one specific example of a galaxy in the universe.`,
        workedSolution: `(i) Definition of galaxy:
An immense, gravitationally bound cosmic system consisting of billions of stars, stellar remnants, interstellar gas clouds, dust, and dark matter orbiting a common center of mass.

(ii) Example of galaxy:
The **Milky Way Galaxy** (or the Andromeda Galaxy, M31).`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "State three effective domestic or commercial methods by which fresh perishable food can be preserved against bacterial spoilage.",
        workedSolution: `1. **Salting / Curing:** High osmotic pressure dehydrates microbial cells, halting bacterial growth.
2. **Sun Drying / Dehydration:** Removes moisture essential for microbial and enzymatic action.
3. **Thermal Smoking:** Heat dries the food while wood smoke deposits antimicrobial phenolic compounds.
4. **Refrigeration / Freezing:** Low temperatures arrest microbial reproduction and inactivate enzymes.`,
        maxMarks: 3
      },
      {
        subId: "(d)",
        prompt: "From the physical principles of thermal radiation, explain why it is advantageous to wear white or light-colored clothes rather than black clothes on a bright, sunny afternoon.",
        workedSolution: `Explanation:
White and light-colored fabrics are **poor absorbers and excellent reflectors** of radiant solar heat (infrared radiation). They reflect most incident solar radiation away from the body, keeping the wearer cool. In contrast, black or dark-colored fabrics are **good absorbers of radiant heat**, absorbing solar energy and conducting it to the skin, causing thermal discomfort.`,
        maxMarks: 4
      },
      {
        subId: "(e)",
        prompt: `Write down the systematic chemical names of the new substances formed when the following compounds react chemically:
(i) Aqueous sodium hydroxide and dilute sulfuric acid;
(ii) Solid calcium carbonate and dilute hydrochloric acid;
(iii) Ammonia gas and dilute sulfuric acid.`,
        workedSolution: `Chemical Products Formed:
• (i) Sodium hydroxide + sulfuric acid:
  - Products: **Sodium sulfate** [$\\text{Na}_2\\text{SO}_4$] and **Water** [$\\text{H}_2\\text{O}$].
• (ii) Calcium carbonate + hydrochloric acid:
  - Products: **Calcium chloride** [$\\text{CaCl}_2$], **Water** [$\\text{H}_2\\text{O}$], and **Carbon dioxide gas** [$\\text{CO}_2$].
• (iii) Ammonia + sulfuric acid:
  - Product: **Ammonium sulfate** [$(\\text{NH}_4)_2\\text{SO}_4$].`,
        maxMarks: 6
      }
    ]
  },

  // ==========================================
  // QUESTION 4: ECOLOGY, CIRCUITS, TOOLS & COMBUSTION (20 MARKS)
  // ==========================================
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Define each of the following ecological feeding classifications, giving one clear animal example in each case:
(i) Herbivore;
(ii) Carnivore;
(iii) Omnivore.`,
        workedSolution: `(i) Herbivore:
• Definition: An animal that feeds exclusively on autotrophic plants, leaves, and vegetation.
• Example: Domestic goat, sheep, cow, or rabbit.

(ii) Carnivore:
• Definition: An animal that feeds exclusively on the flesh and tissues of other animals.
• Example: Lion, hawk, or leopard.

(iii) Omnivore:
• Definition: An animal that naturally feeds on both plant matter and animal flesh.
• Example: Human being, domestic pig, or baboon.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `Two dry chemical cells connected in parallel are in turn connected in series with an electric light bulb and a control switch. Draw a clear, fully labelled circuit diagram to illustrate this arrangement:

${svgQ4bParallelCellsCircuit}`,
        workedSolution: `Circuit Diagram Description (refer to vector schematic):
• Two chemical cells connected in parallel (positive terminals wired together to a common junction, and negative terminals connected to a second common junction).
• This parallel cell combination is connected in a continuous series loop through a knife switch/key and an incandescent electric lamp.
• The circuit delivers the voltage of a single cell ($V$) with twice the current capacity and operational lifespan.`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "List four common handheld garden tools used in horticultural crop production.",
        workedSolution: `1. Garden spade (for digging and turning soil)
2. Garden hand fork (for loosening surface crusts and weeding)
3. Hand trowel (for transplanting seedlings)
4. Garden rake (for leveling seedbeds and collecting debris)
*(Alternatives: Hoe, watering can, shears)*`,
        maxMarks: 2
      },
      {
        subId: "(d)",
        prompt: "What specific physical property of liquid water enables aquatic mosquito larvae to remain suspended at the water surface without sinking?",
        workedSolution: `**Surface tension** (the cohesive intermolecular attraction among surface water molecules that creates an elastic-like surface membrane supporting the larvae's breathing siphon).`,
        maxMarks: 2
      },
      {
        subId: "(e)",
        prompt: `Describe a simple laboratory experiment using an inverted gas jar over a floating candle in a water trough to prove that an active portion of atmospheric air is consumed during combustion:

${svgQ4eCombustionJar}`,
        workedSolution: `Combustion Experiment Description (refer to vector schematic):
1. **Apparatus:** A glass water trough containing colored water, a short lit wax candle mounted on a buoyant wooden cork float, and a graduated cylindrical gas jar.
2. **Procedure:**
   • Float the lit candle in the trough of water.
   • Invert the graduated gas jar carefully over the burning candle and lower it until its rim is submerged in the water.
   • Observe the burning candle and the water level inside the jar.
3. **Observations:**
   • The candle burns for a few seconds, dims, and then is extinguished.
   • The water level inside the gas jar rises, occupying approximately **one-fifth (≈ 21%)** of the initial air volume inside the jar.
4. **Conclusion:** Combustion consumes oxygen gas, which makes up about 21% of air. As oxygen is consumed, internal air pressure drops, causing atmospheric pressure to push water up into the jar to replace the consumed gas.`,
        maxMarks: 5
      }
    ]
  }
];

export const SET_BECE_1997_SCIENCE_P1 = {
  year: 1997,
  isVariant: true,
  setNumber: 129,
  subject: "Integrated Science",
  paperNumber: 1,
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  title: "Paper 1: Objective Test (Variant)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedScience1997P1
};

export const SET_BECE_1997_SCIENCE_P2 = {
  year: 1997,
  isVariant: true,
  setNumber: 129,
  subject: "Integrated Science",
  paperNumber: 2,
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  title: "Paper 2: Practical & Theory Essay (Variant)",
  durationMinutes: 75,
  instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 4,
  questions: paper2Science1997Questions
};

export const SET_BECE_1997_SCIENCE_COMPLETE = {
  year: 1997,
  isVariant: true,
  setNumber: 129,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: {
    title: "Paper 1: Objective Test (Variant)",
    durationMinutes: 45,
    totalQuestions: 40,
    questions: balancedScience1997P1
  },
  paper2: {
    title: "Paper 2: Practical & Theory Essay (Variant)",
    durationMinutes: 75,
    instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
    totalQuestions: 4,
    questions: paper2Science1997Questions
  },
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 3,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
