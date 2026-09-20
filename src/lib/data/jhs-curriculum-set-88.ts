/**
 * WAEC BECE Integrated Science
 * Paper 1: Objective Examination (Set 88 Variant - 2022)
 *
 * Structure:
 * - 40 Multiple-choice Questions
 * - Balanced answer distribution: 10 A, 10 B, 10 C, 10 D
 * Total Marks: 40 | Time Allowed: 45 minutes
 *
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
 */

import { CurriculumQuestionSet } from '../global-curriculum-types';

export const SET_BECE_2022_SCIENCE_P1: CurriculumQuestionSet = {
  id: "paper_2022_variant",
  title: "2022 BECE Integrated Science Examination (Set 88)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2022 BECE Integrated Science Standardized CBT",
  variantType: "past_paper_variant",
  year: 2022,
  paperType: 1,
  setNumber: 88,
  era: "legacy",
  totalQuestions: 40,
  version: 1,
  format: 'multiple_choice',
  questions: [
  {
    "id": "q01",
    "number": 1,
    "title": "Question 1",
    "format": "multiple_choice",
    "prompt": "What primary energy transformation takes place in a semiconductor solar cell when exposed to bright sunshine?",
    "options": [
      "Light energy is converted into chemical potential energy",
      "Light energy is converted directly into electrical energy",
      "Electrical energy is converted into thermal heat energy",
      "Chemical energy is converted into kinetic energy"
    ],
    "correctAnswer": "Light energy is converted directly into electrical energy",
    "hint": "Photovoltaic cells harness photons from sunlight to mobilize electrons.",
    "workedSolution": "A solar (photovoltaic) cell absorbs photons of light, mobilizing electrons across a semiconductor p-n junction to generate an electric voltage and current.",
    "points": 1
  },
  {
    "id": "q02",
    "number": 2,
    "title": "Question 2",
    "format": "multiple_choice",
    "prompt": "In the natural life cycle of angiosperms (flowering plants), which reproductive process marks the final phase ensuring colonization of new habitats?",
    "options": [
      "Floral bud initiation",
      "Double fertilization of the ovule",
      "Seed dispersal away from the parent plant",
      "Vegetative leaf growth"
    ],
    "correctAnswer": "Seed dispersal away from the parent plant",
    "hint": "Seeds must be scattered away from parent plants by wind, animals, or water.",
    "workedSolution": "Following flower pollination, fertilization, and fruit formation, the life cycle completes with seed dispersal to prevent competition and spread offspring.",
    "points": 1
  },
  {
    "id": "q03",
    "number": 3,
    "title": "Question 3",
    "format": "multiple_choice",
    "prompt": "In soil science, what does the term soil texture describe?",
    "options": [
      "The spatial aggregation of soil particles into structural crumbs",
      "The relative percentage proportions of sand, silt, and clay mineral particles",
      "The total volumetric capacity of soil to absorb capillary moisture",
      "The vertical succession of horizontal horizons from surface to bedrock"
    ],
    "correctAnswer": "The relative percentage proportions of sand, silt, and clay mineral particles",
    "hint": "Refers to particle size distribution rather than structure or profile.",
    "workedSolution": "Soil texture refers to the relative proportions of distinct mineral particles: sand (2.0-0.05 mm), silt (0.05-0.002 mm), and clay (<0.002 mm).",
    "points": 1
  },
  {
    "id": "q04",
    "number": 4,
    "title": "Question 4",
    "format": "multiple_choice",
    "prompt": "Which of the following processes represents an example of a reversible physical change?",
    "options": [
      "The temporary magnetization of a soft iron bar",
      "The microbial fermentation of cooked maize dough",
      "The metabolic respiration of glucose in cells",
      "The combustion of a wooden matchstick"
    ],
    "correctAnswer": "The temporary magnetization of a soft iron bar",
    "hint": "No new chemical substance is formed, and the property can be easily undone.",
    "workedSolution": "Magnetizing iron is a physical change involving domain alignment; removing the field demagnetizes it without altering its chemical composition.",
    "points": 1
  },
  {
    "id": "q05",
    "number": 5,
    "title": "Question 5",
    "format": "multiple_choice",
    "prompt": "Which of the following destructive organisms is classified as an agricultural storage pest that attacks harvested dry cereal grains in silos?",
    "options": [
      "The variegated grasshopper",
      "The cotton stainer bug",
      "The grain weevil [Sitophilus spp.]",
      "The armyworm caterpillar"
    ],
    "correctAnswer": "The grain weevil [Sitophilus spp.]",
    "hint": "Infests stored grain silos, boring holes into dry maize and cowpea seeds.",
    "workedSolution": "Weevils bore into stored dry grains (maize, rice, cowpeas) to lay eggs and feed on the starchy endosperm, causing post-harvest grain losses.",
    "points": 1
  },
  {
    "id": "q06",
    "number": 6,
    "title": "Question 6",
    "format": "multiple_choice",
    "prompt": "In a laboratory filtration procedure, what are the solid material retained on the filter paper and the clear liquid collected below respectively called?",
    "options": [
      "Filtrate and residue",
      "Condensate and distillate",
      "Residue and filtrate",
      "Distillate and precipitate"
    ],
    "correctAnswer": "Residue and filtrate",
    "hint": "The solid that remains is the residue; the filtered liquid is the filtrate.",
    "workedSolution": "In filtration, the insoluble solid caught on the porous filter paper is termed the residue, while the clear liquid passing through is the filtrate.",
    "points": 1
  },
  {
    "id": "q07",
    "number": 7,
    "title": "Question 7",
    "format": "multiple_choice",
    "prompt": "An uncharged capacitor, a Light Emitting Diode (LED), a direct-current battery, and a switch are connected in series. What happens to the LED the moment the switch is closed?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 160' width='100%' height='145' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='40' y1='40' x2='120' y2='40' stroke='#94a3b8' stroke-width='2'/><line x1='120' y1='25' x2='120' y2='55' stroke='#10b981' stroke-width='3'/><text x='112' y='22' font-size='10' font-weight='bold' fill='#10b981'>+</text><line x1='128' y1='32' x2='128' y2='48' stroke='#ef4444' stroke-width='4'/><text x='134' y='22' font-size='10' font-weight='bold' fill='#ef4444'>-</text><line x1='128' y1='40' x2='210' y2='40' stroke='#94a3b8' stroke-width='2'/><circle cx='214' cy='40' r='3' fill='#e2e8f0'/><line x1='214' y1='40' x2='238' y2='30' stroke='#e2e8f0' stroke-width='2'/><circle cx='242' cy='40' r='3' fill='#e2e8f0'/><text x='228' y='24' font-size='9' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Switch</text><line x1='242' y1='40' x2='300' y2='40' stroke='#94a3b8' stroke-width='2'/><line x1='300' y1='40' x2='300' y2='120' stroke='#94a3b8' stroke-width='2'/><line x1='300' y1='120' x2='225' y2='120' stroke='#94a3b8' stroke-width='2'/><line x1='225' y1='105' x2='225' y2='135' stroke='#38bdf8' stroke-width='3'/><line x1='217' y1='105' x2='217' y2='135' stroke='#38bdf8' stroke-width='3'/><text x='221' y='96' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Capacitor</text><line x1='217' y1='120' x2='145' y2='120' stroke='#94a3b8' stroke-width='2'/><polygon points='115,110 140,120 115,130' fill='#f59e0b' stroke='#d97706'/><line x1='140' y1='108' x2='140' y2='132' stroke='#f59e0b' stroke-width='3'/><line x1='125' y1='108' x2='135' y2='98' stroke='#fde047' stroke-width='1.5'/><polygon points='132,96 138,98 136,104' fill='#fde047'/><text x='127' y='145' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>LED</text><line x1='115' y1='120' x2='40' y2='120' stroke='#94a3b8' stroke-width='2'/><line x1='40' y1='120' x2='40' y2='40' stroke='#94a3b8' stroke-width='2'/></svg></div>",
    "options": [
      "The LED illuminates brightly and remains permanently lit",
      "The LED remains completely unlit and shows no response",
      "The LED oscillates on and off continuously like a strobe light",
      "The LED flashes on momentarily and then goes off as the capacitor charges"
    ],
    "correctAnswer": "The LED flashes on momentarily and then goes off as the capacitor charges",
    "hint": "Current flows only while the capacitor is actively accumulating charge to reach battery voltage.",
    "workedSolution": "Initial charging current flows through the circuit, illuminating the LED. Once the capacitor charges to the battery voltage, current drops to zero and the LED goes out.",
    "points": 1
  },
  {
    "id": "q08",
    "number": 8,
    "title": "Question 8",
    "format": "multiple_choice",
    "prompt": "The presence of which dissolved cation in natural groundwater is responsible for causing water hardness?",
    "options": [
      "Sodium ions [Na⁺]",
      "Chloride ions [Cl⁻]",
      "Magnesium ions [Mg²⁺] or Calcium ions [Ca²⁺]",
      "Hydroxide ions [OH⁻]"
    ],
    "correctAnswer": "Magnesium ions [Mg²⁺] or Calcium ions [Ca²⁺]",
    "hint": "Divalent alkaline earth metal cations react with soap to precipitate insoluble scum.",
    "workedSolution": "Hardness in water is caused by dissolved divalent cations, predominantly Ca²⁺ and Mg²⁺, which precipitate soluble soap molecules as insoluble scum.",
    "points": 1
  },
  {
    "id": "q09",
    "number": 9,
    "title": "Question 9",
    "format": "multiple_choice",
    "prompt": "Which of the following entities are scientifically classified as matter?",
    "options": [
      "Granite stone only",
      "Atmospheric air and stone only",
      "Gaseous hydrogen, atmospheric air, and a solid granite stone",
      "Heat energy, light photons, and air"
    ],
    "correctAnswer": "Gaseous hydrogen, atmospheric air, and a solid granite stone",
    "hint": "Matter is anything that possesses physical mass and occupies spatial volume (solids, liquids, gases).",
    "workedSolution": "Matter includes all states of matter having mass and volume (solids, liquids, and gases like hydrogen and air). Forms of radiant energy like light and heat are not matter.",
    "points": 1
  },
  {
    "id": "q10",
    "number": 10,
    "title": "Question 10",
    "format": "multiple_choice",
    "prompt": "What is the primary agronomic reason for staking climbing tomato plants with sturdy wooden stakes?",
    "options": [
      "To accelerate the germination rate of mature seeds",
      "To prevent tomato flower pollination by insects",
      "To cause the plants to grow into woody perennial trees",
      "To elevate developing fruits and foliage off the ground to prevent fruit rot"
    ],
    "correctAnswer": "To elevate developing fruits and foliage off the ground to prevent fruit rot",
    "hint": "Keeping wet soil pathogens away from tender developing tomato fruits prevents fungal rotting.",
    "workedSolution": "Staking keeps tomato foliage and heavy fruits off wet soil, preventing fungal rotting, improving sunlight exposure, and easing harvest operations.",
    "points": 1
  },
  {
    "id": "q11",
    "number": 11,
    "title": "Question 11",
    "format": "multiple_choice",
    "prompt": "Which of the following statements concerning the physical behavior of clayey soil is INCORRECT?",
    "options": [
      "It has an exceptionally high water retention capacity",
      "It swells when dry and shrinks into small granules when wet",
      "It becomes sticky and plastic when saturated with water",
      "It forms hard, compact, cloddy crusts when dry"
    ],
    "correctAnswer": "It swells when dry and shrinks into small granules when wet",
    "hint": "Clay expands and becomes sticky when wet, and shrinks and cracks upon drying.",
    "workedSolution": "Clay swells upon wetting as water enters between crystalline silicate sheets, and shrinks and forms fissures upon drying, making the opposite statement false.",
    "points": 1
  },
  {
    "id": "q12",
    "number": 12,
    "title": "Question 12",
    "format": "multiple_choice",
    "prompt": "Why is it inadvisable from an economic and energy-efficiency standpoint to keep using obsolete, worn-out domestic electrical appliances?",
    "options": [
      "They completely eliminate electrical resistance from domestic wiring",
      "They convert alternating domestic current into nuclear radiation",
      "They decrease consumer household electricity bills automatically",
      "They waste substantial electrical energy due to high resistive thermal losses"
    ],
    "correctAnswer": "They waste substantial electrical energy due to high resistive thermal losses",
    "hint": "Degraded insulation and mechanical wear cause old appliances to consume more power and dissipate heat.",
    "workedSolution": "Older appliances have degraded components, worn bearings, and lower motor efficiencies, drawing higher current and converting energy into wasted heat.",
    "points": 1
  },
  {
    "id": "q13",
    "number": 13,
    "title": "Question 13",
    "format": "multiple_choice",
    "prompt": "Which pair of planets in the solar system orbit closer to the Sun than planet Earth?",
    "options": [
      "Mercury and Venus",
      "Venus and Mars",
      "Mercury and Mars",
      "Venus and Jupiter"
    ],
    "correctAnswer": "Mercury and Venus",
    "hint": "The first and second rocky inner planets from the Sun.",
    "workedSolution": "In order of increasing distance from the Sun: Mercury (1st), Venus (2nd), Earth (3rd), and Mars (4th). Mercury and Venus orbit inside Earth's orbit.",
    "points": 1
  },
  {
    "id": "q14",
    "number": 14,
    "title": "Question 14",
    "format": "multiple_choice",
    "prompt": "Which statement correctly describes the nature of hydrostatic fluid pressure in a liquid at rest?",
    "options": [
      "Pressure decreases progressively as depth increases",
      "Pressure acts strictly in an upward vertical direction only",
      "Pressure at any given depth level acts equally in all directions",
      "Pressure depends on the cross-sectional surface area of the container"
    ],
    "correctAnswer": "Pressure at any given depth level acts equally in all directions",
    "hint": "Fluid pressure increases with depth ($P = \\rho gh$) and is isotropic at a given depth level.",
    "workedSolution": "At a fixed vertical depth within a static liquid, hydrostatic pressure acts with equal magnitude in all directions and increases linearly with depth.",
    "points": 1
  },
  {
    "id": "q15",
    "number": 15,
    "title": "Question 15",
    "format": "multiple_choice",
    "prompt": "Which of the following environmental or land-use practices DOES NOT cause the depletion or degradation of agricultural soils?",
    "options": [
      "Uncontrolled sheet and rill water erosion",
      "Excessive nutrient leaching caused by heavy rainfall",
      "Illegal surface alluvial gold mining (galamsey)",
      "Afforestation and planting vegetative shelterbelts"
    ],
    "correctAnswer": "Afforestation and planting vegetative shelterbelts",
    "hint": "Planting trees stabilizes topsoil, adds organic humus, and prevents erosion.",
    "workedSolution": "Afforestation protects topsoil from raindrop impact, binds soil with root systems, and replenishes organic humus, conserving soil rather than depleting it.",
    "points": 1
  },
  {
    "id": "q16",
    "number": 16,
    "title": "Question 16",
    "format": "multiple_choice",
    "prompt": "What physical force acts on a ripe mango fruit to pull it downward to the ground when it detaches from a tree branch?",
    "options": [
      "Electrostatic attraction force",
      "Gravitational force",
      "Magnetic force",
      "Mechanical tension force"
    ],
    "correctAnswer": "Gravitational force",
    "hint": "The non-contact attraction force exerted by Earth's mass on all objects.",
    "workedSolution": "The Earth exerts an attractive gravitational force ($W = mg$) toward its center, causing unsupported masses to accelerate downwards.",
    "points": 1
  },
  {
    "id": "q17",
    "number": 17,
    "title": "Question 17",
    "format": "multiple_choice",
    "prompt": "Agricultural synthetic urea fertilizer [$\\text{CO(NH}_2\\text{)}_2$] is applied to cultivated farm soils primarily as a source of:",
    "options": [
      "Available phosphorus for root development",
      "Nitrogen for vegetative leaf growth and protein synthesis",
      "Soluble calcium for cell wall pectate formation",
      "Available potassium for disease resistance"
    ],
    "correctAnswer": "Nitrogen for vegetative leaf growth and protein synthesis",
    "hint": "Contains approximately 46% nitrogen, making it a concentrated nitrogenous fertilizer.",
    "workedSolution": "Urea supplies high concentrations of nitrogen ($approx 46\\%\\text{ N}$), an essential constituent of amino acids, proteins, and chlorophyll needed for vegetative leaf expansion.",
    "points": 1
  },
  {
    "id": "q18",
    "number": 18,
    "title": "Question 18",
    "format": "multiple_choice",
    "prompt": "Which of the following statements are valid scientific and environmental reasons for conserving electrical and fuel energy?",
    "options": [
      "Depleting atmospheric oxygen supplies permanently",
      "Accelerating the rate of fossil fuel extraction globally",
      "Converting all global electricity grids to open circuits",
      "Managing increasing global demand and mitigating greenhouse gas carbon (IV) oxide emissions"
    ],
    "correctAnswer": "Managing increasing global demand and mitigating greenhouse gas carbon (IV) oxide emissions",
    "hint": "Conserving energy reduces fossil fuel burning and curtails carbon emissions driving global warming.",
    "workedSolution": "Energy conservation reduces fossil fuel consumption, lowers atmospheric carbon dioxide emissions that drive climate change, and manages escalating power demand.",
    "points": 1
  },
  {
    "id": "q19",
    "number": 19,
    "title": "Question 19",
    "format": "multiple_choice",
    "prompt": "A calibrated spring balance (force meter) is used in physical science laboratories to measure:",
    "options": [
      "The weight or mechanical force exerted on an object in Newtons",
      "The internal thermodynamic temperature of a liquid",
      "The scalar inertial mass of matter in kilograms",
      "The rate of mechanical power dissipated in Watts"
    ],
    "correctAnswer": "The weight or mechanical force exerted on an object in Newtons",
    "hint": "Uses Hooke's Law extension of a spring to measure force/weight in Newtons.",
    "workedSolution": "A spring balance (force meter) utilizes spring extension to measure the gravitational pull (weight) or applied force acting on an object in Newtons (N).",
    "points": 1
  },
  {
    "id": "q20",
    "number": 20,
    "title": "Question 20",
    "format": "multiple_choice",
    "prompt": "Which of the following natural celestial and biological bodies are classified as natural sources of light?",
    "options": [
      "The Sun and a bioluminescent glow-worm",
      "The Earth's Moon and the Sun",
      "The Earth's Moon and a glow-worm",
      "Planets Mars and Venus"
    ],
    "correctAnswer": "The Sun and a bioluminescent glow-worm",
    "hint": "The Moon is non-luminous and only reflects sunlight, while the Sun and glow-worms generate light.",
    "workedSolution": "The Sun (thermonuclear fusion) and glow-worms (bioluminescence) produce their own light. The Moon is non-luminous and only reflects solar rays.",
    "points": 1
  },
  {
    "id": "q21",
    "number": 21,
    "title": "Question 21",
    "format": "multiple_choice",
    "prompt": "Which of the following characteristics accurately describe the image formed on the viewing screen of a pinhole camera?",
    "options": [
      "Virtual, erect, and magnified",
      "Virtual, inverted, and enlarged",
      "Real, erect, and blurred",
      "Real, inverted, and diminished"
    ],
    "correctAnswer": "Real, inverted, and diminished",
    "hint": "Rectilinear light rays cross at the aperture, inverting the image on the screen.",
    "workedSolution": "Because light travels in straight lines, rays cross at the pinhole, forming an inverted, real, and diminished image on the rear screen.",
    "points": 1
  },
  {
    "id": "q22",
    "number": 22,
    "title": "Question 22",
    "format": "multiple_choice",
    "prompt": "The rectangular floor of a school science laboratory measures $20.0\\text{ m}$ in length and $15.0\\text{ m}$ in width. Calculate the area of the laboratory floor.",
    "options": [
      "35 m²",
      "300 m²",
      "200 m²",
      "250 m²"
    ],
    "correctAnswer": "300 m²",
    "hint": "$$\\text{Area} = \\text{Length} \\times \\text{Width} = 20 \\times 15$$.",
    "workedSolution": "$$\\text{Area } (A) = l \\times w = 20.0\\text{ m} \\times 15.0\\text{ m} = 300.0\\text{ m}^2$$.",
    "points": 1
  },
  {
    "id": "q23",
    "number": 23,
    "title": "Question 23",
    "format": "multiple_choice",
    "prompt": "In the hydrological cycle, rainfall (precipitation) occurs in the atmosphere as a direct result of:",
    "options": [
      "Warm water vapor rising, expanding, and condensing into cloud droplets upon cooling",
      "Extremely low relative humidity in the troposphere",
      "A complete absence of condensation nuclei in the air",
      "High solar radiation heating surface water directly"
    ],
    "correctAnswer": "Warm water vapor rising, expanding, and condensing into cloud droplets upon cooling",
    "hint": "Water vapor cools as it rises, condensing into clouds until droplets become heavy enough to fall.",
    "workedSolution": "Warm moist air ascends into cooler atmospheric layers, cooling until water vapor condenses into cloud droplets that coalesce and fall as rain.",
    "points": 1
  },
  {
    "id": "q24",
    "number": 24,
    "title": "Question 24",
    "format": "multiple_choice",
    "prompt": "Which of the following mechanical tools is classified as a first-class lever?",
    "options": [
      "A wheelbarrow",
      "A pair of sugar tongs",
      "A fishing rod",
      "A steel crowbar (or a pair of scissors)"
    ],
    "correctAnswer": "A steel crowbar (or a pair of scissors)",
    "hint": "The fulcrum (pivot) is situated between the effort and the load.",
    "workedSolution": "A crowbar has its fulcrum placed between the effort applied at the handle and the load pried at the opposite tip, making it a Class 1 lever.",
    "points": 1
  },
  {
    "id": "q25",
    "number": 25,
    "title": "Question 25",
    "format": "multiple_choice",
    "prompt": "In a biological ecosystem, green autotrophic plants that produce organic carbohydrates via photosynthesis are known as:",
    "options": [
      "Secondary consumers",
      "Decomposers",
      "Apex predators",
      "Primary producers"
    ],
    "correctAnswer": "Primary producers",
    "hint": "They synthesize food from inorganic raw materials, supporting all consumer trophic levels.",
    "workedSolution": "Green plants synthesize glucose from carbon dioxide and water using sunlight via photosynthesis, functioning as primary producers in food chains.",
    "points": 1
  },
  {
    "id": "q26",
    "number": 26,
    "title": "Question 26",
    "format": "multiple_choice",
    "prompt": "In the modern Periodic Table, chemical elements are arranged systematically in order of increasing:",
    "options": [
      "Atomic number (number of nuclear protons)",
      "Mass number (total nucleons)",
      "Total number of uncharged neutrons",
      "Atomic radius in crystal form"
    ],
    "correctAnswer": "Atomic number (number of nuclear protons)",
    "hint": "Moseley's Periodic Law organizes elements by proton count ($Z$).",
    "workedSolution": "Elements in the modern periodic table are arranged in order of increasing atomic number ($Z$, proton number), grouping elements with similar valence configurations into columns.",
    "points": 1
  },
  {
    "id": "q27",
    "number": 27,
    "title": "Question 27",
    "format": "multiple_choice",
    "prompt": "What stoichiometric coefficient is required in front of $\\text{H}_2$ to balance the chemical equation: $x\\text{H}_2 + \\text{O}_2 \\to 2\\text{H}_2\\text{O}$?",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "correctAnswer": "2",
    "hint": "Ensure there are 4 Hydrogen atoms on both sides: $2 \\times 2 = 4$.",
    "workedSolution": "In $2\\text{H}_2 + \\text{O}_2 \\to 2\\text{H}_2\\text{O}$, there are 4 hydrogen atoms and 2 oxygen atoms on both sides of the reaction, satisfying mass conservation.",
    "points": 1
  },
  {
    "id": "q28",
    "number": 28,
    "title": "Question 28",
    "format": "multiple_choice",
    "prompt": "In the morphology of an angiosperm flower, the receptive stigma, the elongated style, and the basal ovary collectively form:",
    "options": [
      "The female pistil (carpel)",
      "The male stamen",
      "The vegetative receptacle",
      "The protective calyx"
    ],
    "correctAnswer": "The female pistil (carpel)",
    "hint": "The female reproductive organ of the flower.",
    "workedSolution": "The female reproductive structure (pistil or carpel) consists of the sticky pollen-receiving stigma, the supporting style, and the basal ovary containing ovules.",
    "points": 1
  },
  {
    "id": "q29",
    "number": 29,
    "title": "Question 29",
    "format": "multiple_choice",
    "prompt": "Which laboratory separation technique is best suited for separating a homogeneous mixture of two miscible liquids with different boiling points (such as ethanol and water)?",
    "options": [
      "Fractional distillation",
      "Gravity filtration through paper",
      "Open-air evaporation to dryness",
      "Separating funnel separation"
    ],
    "correctAnswer": "Fractional distillation",
    "hint": "Ethanol boils at 78°C while water boils at 100°C; fractional distillation separates them by vapor temperature.",
    "workedSolution": "Ethanol and water form a miscible solution; fractional distillation separates them based on differences in boiling point as vapor condenses in a fractionating column.",
    "points": 1
  },
  {
    "id": "q30",
    "number": 30,
    "title": "Question 30",
    "format": "multiple_choice",
    "prompt": "An atom of sodium ($_{11}^{23}\\text{Na}$) forms a stable ionic bond by losing its single outer valence electron. What is the net electrical charge on the resulting ion?",
    "options": [
      "-1",
      "+1",
      "+2",
      "-2"
    ],
    "correctAnswer": "+1",
    "hint": "The atom retains 11 positive protons but now has only 10 orbiting electrons.",
    "workedSolution": "Loss of 1 negative electron leaves an excess of 1 positive nuclear proton ($11p^+ - 10e^- = +1$), forming a sodium cation ($\\text{Na}^+$).",
    "points": 1
  },
  {
    "id": "q31",
    "number": 31,
    "title": "Question 31",
    "format": "multiple_choice",
    "prompt": "What is the hard, protective, mineralized outer covering of the human tooth crown called?",
    "options": [
      "Dentine",
      "Cementum",
      "Enamel",
      "Pulp tissue"
    ],
    "correctAnswer": "Enamel",
    "hint": "The white outer layer composed of hydroxyapatite crystals.",
    "workedSolution": "Enamel is the outermost protective covering of the tooth crown, consisting of 96% mineralized calcium hydroxyapatite.",
    "points": 1
  },
  {
    "id": "q32",
    "number": 32,
    "title": "Question 32",
    "format": "multiple_choice",
    "prompt": "What professional term is given to trained personnel who travel and operate spacecraft in outer space?",
    "options": [
      "Geologists",
      "Astronauts (or Cosmonauts)",
      "Meteorologists",
      "Archaeologists"
    ],
    "correctAnswer": "Astronauts (or Cosmonauts)",
    "hint": "Trained crew members flying space missions.",
    "workedSolution": "Astronauts (or cosmonauts) are personnel professionally trained to fly and conduct scientific operations aboard spacecraft in outer space.",
    "points": 1
  },
  {
    "id": "q33",
    "number": 33,
    "title": "Question 33",
    "format": "multiple_choice",
    "prompt": "The agricultural practice of growing maize and cowpea simultaneously on the same parcel of farmland during the same season is known as:",
    "options": [
      "Continuous monoculture",
      "Land rotation fallowing",
      "Mixed cropping (intercropping)",
      "Pastoral nomadism"
    ],
    "correctAnswer": "Mixed cropping (intercropping)",
    "hint": "Cultivating multiple crop species on the same field at the same time.",
    "workedSolution": "Mixed cropping (intercropping) involves cultivating two or more crop species together on the same plot, optimizing resource use and providing insurance against crop failure.",
    "points": 1
  },
  {
    "id": "q34",
    "number": 34,
    "title": "Question 34",
    "format": "multiple_choice",
    "prompt": "Under what specific celestial alignment does an eclipse of the Moon (lunar eclipse) take place?",
    "options": [
      "The Moon moves directly between the Earth and the Sun",
      "The Sun moves directly between the Earth and the Moon",
      "The Moon passes closer to planet Mars than planet Earth",
      "The Earth moves directly between the Sun and the Moon, casting its shadow on the Moon"
    ],
    "correctAnswer": "The Earth moves directly between the Sun and the Moon, casting its shadow on the Moon",
    "hint": "The Earth blocks sunlight from reaching the Moon during a full moon.",
    "workedSolution": "A lunar eclipse occurs when the Earth passes directly between the Sun and the Moon, blocking direct solar rays and casting its umbral shadow across the lunar surface.",
    "points": 1
  },
  {
    "id": "q35",
    "number": 35,
    "title": "Question 35",
    "format": "multiple_choice",
    "prompt": "Which precision measuring tool is specifically designed to measure the internal and external diameters of spherical or cylindrical objects accurately?",
    "options": [
      "A Vernier calliper",
      "A laboratory thermometer",
      "A standard spring balance",
      "A magnetic compass needle"
    ],
    "correctAnswer": "A Vernier calliper",
    "hint": "Equipped with internal and external jaws and a sliding Vernier scale.",
    "workedSolution": "A Vernier calliper has specialized jaws that measure the internal and external diameters of circular objects to within $0.01\\text{ cm}$.",
    "points": 1
  },
  {
    "id": "q36",
    "number": 36,
    "title": "Question 36",
    "format": "multiple_choice",
    "prompt": "According to kinetic molecular theory, what happens to the particles of a gas when the gas is heated inside a container?",
    "options": [
      "Their average kinetic energy and velocity increase, causing them to move faster and collide more frequently",
      "The particles cease all motion and crystallize into fixed positions",
      "The total mass and weight of individual gas molecules doubles",
      "The particles contract tightly and decrease in volume"
    ],
    "correctAnswer": "Their average kinetic energy and velocity increase, causing them to move faster and collide more frequently",
    "hint": "Thermal energy increases molecular kinetic energy and velocity.",
    "workedSolution": "Heating supplies thermal energy that increases the kinetic energy and average speed of gas molecules, resulting in higher collision frequencies with container walls.",
    "points": 1
  },
  {
    "id": "q37",
    "number": 37,
    "title": "Question 37",
    "format": "multiple_choice",
    "prompt": "In a germinating dicotyledonous seed, which embryonic structure grows upward to develop into the stem and foliage shoot system?",
    "options": [
      "The radicle",
      "The micropyle",
      "The plumule",
      "The seed coat (testa)"
    ],
    "correctAnswer": "The plumule",
    "hint": "The radicle forms the root system; this embryonic part develops into the shoot.",
    "workedSolution": "In seed germination, the plumule develops into the primary shoot system (stem and leaves), while the radicle develops into the root system.",
    "points": 1
  },
  {
    "id": "q38",
    "number": 38,
    "title": "Question 38",
    "format": "multiple_choice",
    "prompt": "In the schematic circuit symbol of a bipolar junction transistor, what does the small arrow on the emitter terminal indicate?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 260 200' width='100%' height='175' style='max-width: 320px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><circle cx='130' cy='100' r='55' fill='none' stroke='#64748b' stroke-width='2'/><line x1='35' y1='100' x2='100' y2='100' stroke='#38bdf8' stroke-width='3'/><line x1='100' y1='70' x2='100' y2='130' stroke='#38bdf8' stroke-width='5'/><text x='30' y='104' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='end'>Base (B)</text><line x1='100' y1='85' x2='155' y2='50' stroke='#cbd5e1' stroke-width='3'/><line x1='155' y1='50' x2='155' y2='18' stroke='#cbd5e1' stroke-width='3'/><text x='165' y='28' font-size='11' font-weight='bold' fill='#cbd5e1'>Collector (C)</text><line x1='100' y1='115' x2='155' y2='150' stroke='#ef4444' stroke-width='3'/><polygon points='130,132 142,142 126,144' fill='#ef4444'/><line x1='155' y1='150' x2='155' y2='182' stroke='#ef4444' stroke-width='3'/><text x='165' y='180' font-size='11' font-weight='bold' fill='#ef4444'>Emitter (E)</text><text x='130' y='194' font-size='9' font-weight='bold' fill='#94a3b8' text-anchor='middle'>NPN TRANSISTOR SYMBOL</text></svg></div>",
    "options": [
      "The direction of electron drift through the base",
      "The polarity of the metallic collector plate",
      "The direction of thermal heat dissipation",
      "The direction of conventional electric current (hole flow) across the emitter junction"
    ],
    "correctAnswer": "The direction of conventional electric current (hole flow) across the emitter junction",
    "hint": "Points outward in an NPN transistor and inward in a PNP transistor, indicating conventional current flow.",
    "workedSolution": "The arrow on the transistor's emitter terminal indicates the direction of conventional current flow (from positive to negative / hole flow) when the junction is forward-biased.",
    "points": 1
  },
  {
    "id": "q39",
    "number": 39,
    "title": "Question 39",
    "format": "multiple_choice",
    "prompt": "In human digestion, enzymatic breakdown of dietary proteins begins in the stomach and completes in which organ?",
    "options": [
      "The large intestine (colon)",
      "The small intestine (ileum)",
      "The gallbladder",
      "The mouth cavity"
    ],
    "correctAnswer": "The small intestine (ileum)",
    "hint": "Pepsin starts protein digestion in the stomach, and pancreatic and intestinal enzymes finish it here.",
    "workedSolution": "Protein digestion initiates in the stomach via pepsin and finishes in the small intestine (duodenum/ileum) through the action of pancreatic trypsin and intestinal peptidases.",
    "points": 1
  },
  {
    "id": "q40",
    "number": 40,
    "title": "Question 40",
    "format": "multiple_choice",
    "prompt": "Which of the following chemical substances is classified as a pure compound rather than an element or allotrope?",
    "options": [
      "Metallic copper wire [Cu]",
      "Crystalline diamond [C]",
      "Pure cane sucrose [C₁₂H₂₂O₁₁]",
      "Solid sulfur powder [S₈]"
    ],
    "correctAnswer": "Pure cane sucrose [C₁₂H₂₂O₁₁]",
    "hint": "A compound composed of carbon, hydrogen, and oxygen atoms chemically bonded in a fixed ratio.",
    "workedSolution": "Sucrose (C₁₂H₂₂O₁₁) is a chemical compound consisting of carbon, hydrogen, and oxygen chemically bonded in a fixed stoichiometric ratio. Copper, diamond, and sulfur are elements.",
    "points": 1
  }
]
};
