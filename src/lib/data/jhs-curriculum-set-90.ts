/**
 * 2013 BECE Integrated Science Paper 1 (Set 90 Objective CBT)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_2013_variant
 * Set Number: Set 90
 * Format: Standard CBT with 40 balanced multiple-choice questions
 * Key Distribution: Exactly 10 A, 10 B, 10 C, 10 D (0% skew)
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
 */

export const svgQ11LeverMechanism = `<div class="my-4 flex justify-center"><svg viewBox='0 0 340 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Base Surface --><line x1='30' y1='105' x2='310' y2='105' stroke='#64748b' stroke-width='2'/><!-- Fulcrum Triangle (Pivot point) --><polygon points='160,70 145,105 175,105' fill='#3b82f6' stroke='#1d4ed8' stroke-width='2'/><circle cx='160' cy='70' r='4' fill='#ffffff'/><text x='160' y='122' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Fixed Pivot (Fulcrum)</text><!-- Rigid Bar --><line x1='50' y1='70' x2='290' y2='70' stroke='#cbd5e1' stroke-width='4'/><!-- Load on Left --><rect x='60' y='45' width='30' height='25' fill='#ef4444' stroke='#b91c1c' stroke-width='1.5'/><text x='75' y='61' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>LOAD</text><!-- Downward Effort on Right --><line x1='270' y1='35' x2='270' y2='68' stroke='#10b981' stroke-width='2.5'/><polygon points='266,62 270,70 274,62' fill='#10b981'/><text x='270' y='28' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>Effort</text><text x='170' y='134' font-size='8' font-weight='bold' fill='#64748b' text-anchor='middle'>RIGID BAR TURNING ABOUT A FIXED FULCRUM (LEVER)</text></svg></div>`;
export const svgQ17RailwayExpansion = `<div class="my-4 flex justify-center"><svg viewBox='0 0 340 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Ballast Bed --><rect x='20' y='80' width='300' height='35' fill='#334155' stroke='#475569' stroke-width='1.5'/><!-- Left Steel Rail Segment --><rect x='30' y='55' width='125' height='25' fill='#94a3b8' stroke='#cbd5e1' stroke-width='2'/><!-- Right Steel Rail Segment --><rect x='185' y='55' width='125' height='25' fill='#94a3b8' stroke='#cbd5e1' stroke-width='2'/><!-- Expansion Gap in Middle (30 mm gap) --><line x1='155' y1='40' x2='185' y2='40' stroke='#f59e0b' stroke-width='2'/><line x1='155' y1='35' x2='155' y2='45' stroke='#f59e0b' stroke-width='1.5'/><line x1='185' y1='35' x2='185' y2='45' stroke='#f59e0b' stroke-width='1.5'/><text x='170' y='32' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Expansion Gap</text><!-- Fishplate linking rails --><rect x='140' y='63' width='60' height='9' fill='#64748b' opacity='0.7'/><circle cx='148' cy='67' r='2' fill='#0f172a'/><circle cx='192' cy='67' r='2' fill='#0f172a'/><text x='170' y='130' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>GAPS PREVENT THERMAL BUCKLING OF RAILS</text></svg></div>`;

export interface QuestionItem {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

export const SET_BECE_2013_SCIENCE_P1: {
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  questions: QuestionItem[];
} = {
  title: "Paper 1: Objective Test (Variant)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: [
  {
    "number": 1,
    "prompt": "In the International System of Units (S.I.), what is the fundamental base unit for thermodynamic temperature?",
    "options": [
      "Kelvin [K]",
      "Degree Celsius [°C]",
      "Degree Fahrenheit [°F]",
      "Joule [J]"
    ],
    "correctAnswer": "Kelvin [K]",
    "hint": "The absolute temperature scale starting at absolute zero (0 K).",
    "workedSolution": "The Kelvin (K) is the official S.I. base unit for thermodynamic temperature, while degrees Celsius is an accepted metric derived scale.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "Atmospheric air sampled from clean natural surroundings is physically classified as:",
    "options": [
      "A homogeneous gas-in-gas mixture",
      "A pure chemical binary compound",
      "A heterogeneous liquid-in-gas suspension",
      "A solid-in-liquid colloidal aerosol"
    ],
    "correctAnswer": "A homogeneous gas-in-gas mixture",
    "hint": "A uniform single-phase gaseous solution of nitrogen, oxygen, argon, and other gases.",
    "workedSolution": "Clean air is a homogeneous gaseous mixture comprising approximately 78% nitrogen, 21% oxygen, argon, and traces of carbon dioxide without chemical bonding.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Which of the following routine husbandry operations are essential in commercial freshwater tilapia aquaculture?",
    "options": [
      "Pond stocking and artificial incubation only",
      "Supplementary feeding and water deoxygenation",
      "Hand weeding of pond bottom mud only",
      "Pond stocking, formulated daily feeding, and aquatic pest and predator control"
    ],
    "correctAnswer": "Pond stocking, formulated daily feeding, and aquatic pest and predator control",
    "hint": "Requires introducing healthy fingerlings, providing balanced fish feed, and eliminating predatory birds and snakes.",
    "workedSolution": "Tilapia farming requires proper pond preparation, stocking with viable fingerlings, delivering daily balanced rations, and controlling weeds and predators.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "In the anatomy of an entomophilous (insect-pollinated) flower, where is sweet sugary nectar synthesized and secreted?",
    "options": [
      "On the dry surface of the pollen anthers",
      "Inside the protective green sepals of the calyx",
      "Within the nectaries located near the floral receptacle at the base of the petals",
      "Along the outer epidermis of the flower pedicel"
    ],
    "correctAnswer": "Within the nectaries located near the floral receptacle at the base of the petals",
    "hint": "Glandular structures located deep inside the flower to force foraging insects past anthers and stigmas.",
    "workedSolution": "Nectaries are specialized nectar-secreting glandular tissues located typically around the base of the ovary or inner petals to attract pollinating insects.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "Which anti-corrosion technique protects structural iron from rusting by coating it with a sacrificial layer of metallic zinc?",
    "options": [
      "Alloying",
      "Galvanizing",
      "Greasing",
      "Anodizing"
    ],
    "correctAnswer": "Galvanizing",
    "hint": "Hot-dip coating of iron sheets with zinc.",
    "workedSolution": "Galvanizing is the process of applying a protective zinc layer to iron or steel. Zinc corrodes sacrificially if scratched, protecting the underlying iron.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Continuous leaching of basic mineral nutrients from agricultural topsoil by percolating rainwater leads directly to soil:",
    "options": [
      "Alkalinity (high soil pH)",
      "Compaction",
      "Acidity (low soil pH)",
      "Porosity reduction"
    ],
    "correctAnswer": "Acidity (low soil pH)",
    "hint": "Leaching washes away exchangeable calcium and magnesium bases, leaving acidic hydrogen and aluminum ions.",
    "workedSolution": "Leaching removes alkaline basic cations (Ca²⁺, Mg²⁺, K⁺) from topsoil, concentrating acidic H⁺ and Al³⁺ ions, resulting in soil acidity.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "What is the biological term for the basic physical and functional unit of heredity transmitted from parents to offspring?",
    "options": [
      "A red blood cell",
      "A somatic ribosome",
      "A gene (DNA sequence)",
      "A blood platelet"
    ],
    "correctAnswer": "A gene (DNA sequence)",
    "hint": "Specific nucleotide sequences on chromosomes that encode traits.",
    "workedSolution": "A gene is a discrete segment of DNA located on a chromosome that carries coded genetic instructions transmitted from parents to determine offspring traits.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Our astronomical Solar System consists of:",
    "options": [
      "The Earth, Moon, and distant galaxy stars only",
      "The Sun, meteors, and interstellar nebulae only",
      "The central Sun, orbiting planets, their moons, and smaller celestial bodies like asteroids and comets",
      "The Sun, planet Earth, and the Moon only"
    ],
    "correctAnswer": "The central Sun, orbiting planets, their moons, and smaller celestial bodies like asteroids and comets",
    "hint": "The gravitationally bound planetary system revolving around our local star, the Sun.",
    "workedSolution": "The Solar System comprises the Sun and all celestial bodies bound to it by gravity: eight major planets, dwarf planets, natural satellites, asteroids, and comets.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "Which livestock management system allows farm animals to roam about freely in open pasture to scavenge for food and water?",
    "options": [
      "The intensive battery cage system",
      "The semi-intensive paddock system",
      "The extensive farming system",
      "The deep litter system"
    ],
    "correctAnswer": "The extensive farming system",
    "hint": "Animals range over large areas with minimal confinement or supplemental feeding.",
    "workedSolution": "In the extensive system (free-range), animals roam over large grazing areas to forage naturally, requiring low capital but exposing stock to weather and predators.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "In animal biology, the physical process of inhaling oxygen-rich air and exhaling air containing carbon dioxide is known as:",
    "options": [
      "Anaerobic fermentation",
      "Intracellular tissue respiration",
      "External respiration (breathing or ventilation)",
      "Active glycolysis"
    ],
    "correctAnswer": "External respiration (breathing or ventilation)",
    "hint": "Mechanical ventilation of the lungs as opposed to biochemical cellular respiration.",
    "workedSolution": "External respiration (breathing/pulmonary ventilation) is the physical exchange of oxygen and carbon dioxide between the respiratory surface and the environment.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "What type of simple machine is defined as a rigid bar that is pivoted and capable of turning about a fixed fulcrum?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Base Surface --><line x1='30' y1='105' x2='310' y2='105' stroke='#64748b' stroke-width='2'/><!-- Fulcrum Triangle (Pivot point) --><polygon points='160,70 145,105 175,105' fill='#3b82f6' stroke='#1d4ed8' stroke-width='2'/><circle cx='160' cy='70' r='4' fill='#ffffff'/><text x='160' y='122' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Fixed Pivot (Fulcrum)</text><!-- Rigid Bar --><line x1='50' y1='70' x2='290' y2='70' stroke='#cbd5e1' stroke-width='4'/><!-- Load on Left --><rect x='60' y='45' width='30' height='25' fill='#ef4444' stroke='#b91c1c' stroke-width='1.5'/><text x='75' y='61' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>LOAD</text><!-- Downward Effort on Right --><line x1='270' y1='35' x2='270' y2='68' stroke='#10b981' stroke-width='2.5'/><polygon points='266,62 270,70 274,62' fill='#10b981'/><text x='270' y='28' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>Effort</text><text x='170' y='134' font-size='8' font-weight='bold' fill='#64748b' text-anchor='middle'>RIGID BAR TURNING ABOUT A FIXED FULCRUM (LEVER)</text></svg></div>",
    "options": [
      "A lever",
      "An inclined plane",
      "A screw",
      "A wheel and axle"
    ],
    "correctAnswer": "A lever",
    "hint": "Uses a pivot, effort, and load to multiply force or distance.",
    "workedSolution": "A lever is a simple machine consisting of a rigid bar that pivots around a fixed support point called the fulcrum to move a load with applied effort.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "What is the scientific term for an atom that carries a net positive electrical charge due to the loss of valence electrons?",
    "options": [
      "A cation",
      "An anion",
      "A neutron",
      "A photon"
    ],
    "correctAnswer": "A cation",
    "hint": "Formed when metallic atoms lose negative electrons.",
    "workedSolution": "A cation is a positively charged ion formed when a neutral atom loses one or more electrons, leaving an excess of positive nuclear protons.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "Which environmental conservation strategy ensures that vulnerable wildlife species do not become endangered or extinct?",
    "options": [
      "Allowing unrestricted hunting and poaching year-round",
      "Protecting and conserving their natural wild habitats and establishing game reserves",
      "Introducing uncontrolled invasive predators into their habitats",
      "Discharging municipal and chemical effluents into their water bodies"
    ],
    "correctAnswer": "Protecting and conserving their natural wild habitats and establishing game reserves",
    "hint": "Preserving natural ecosystems prevents habitat loss, the leading driver of extinction.",
    "workedSolution": "Preserving natural ecosystems (national parks, wildlife reserves) protects feeding, breeding, and migratory corridors, sustaining biodiversity.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "Which of the following physical characteristics is an essential requirement of a reliable thermometric liquid in glass thermometers?",
    "options": [
      "It must be completely transparent and colourless",
      "It must expand uniformly and regularly with equal increments of temperature",
      "It must boil at 100°C and freeze at 0°C",
      "It must cling firmly to the inner capillary walls of the glass"
    ],
    "correctAnswer": "It must expand uniformly and regularly with equal increments of temperature",
    "hint": "Linear, regular expansion guarantees accurate and calibrated scale readings.",
    "workedSolution": "A good thermometric fluid (such as mercury or dyed alcohol) must expand linearly and uniformly over its working range without wetting the glass stem.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "Which of the following metallic elements will react with dilute natural acid (such as lime juice) to liberate effervescent bubbles of hydrogen gas?",
    "options": [
      "Magnesium ribbon [Mg]",
      "Copper wire [Cu]",
      "Pure silver foil [Ag]",
      "Lead sheet [Pb]"
    ],
    "correctAnswer": "Magnesium ribbon [Mg]",
    "hint": "A reactive metal located above hydrogen in the electrochemical activity series.",
    "workedSolution": "Magnesium is a reactive metal positioned well above hydrogen in the reactivity series: Mg + 2H⁺ → Mg²⁺ + H₂↑. Copper and silver do not react.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "In field agricultural pedology, what diagnostic physical property of soil is evaluated by rubbing a moist soil ball between the thumb and forefinger?",
    "options": [
      "Soil profile depth",
      "Soil temperature",
      "Subsoil bulk density",
      "Soil texture (relative proportions of sand, silt, and clay)"
    ],
    "correctAnswer": "Soil texture (relative proportions of sand, silt, and clay)",
    "hint": "Gritty feel indicates sand, silky smoothness indicates silt, and stickiness indicates clay.",
    "workedSolution": "The tactile 'finger-feel' method estimates soil texture by sensing the grittiness of coarse sand, the smoothness of silt, and the plasticity of clay.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "Why are small expansion gaps engineered between consecutive steel rail segments on railway lines?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Ballast Bed --><rect x='20' y='80' width='300' height='35' fill='#334155' stroke='#475569' stroke-width='1.5'/><!-- Left Steel Rail Segment --><rect x='30' y='55' width='125' height='25' fill='#94a3b8' stroke='#cbd5e1' stroke-width='2'/><!-- Right Steel Rail Segment --><rect x='185' y='55' width='125' height='25' fill='#94a3b8' stroke='#cbd5e1' stroke-width='2'/><!-- Expansion Gap in Middle (30 mm gap) --><line x1='155' y1='40' x2='185' y2='40' stroke='#f59e0b' stroke-width='2'/><line x1='155' y1='35' x2='155' y2='45' stroke='#f59e0b' stroke-width='1.5'/><line x1='185' y1='35' x2='185' y2='45' stroke='#f59e0b' stroke-width='1.5'/><text x='170' y='32' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Expansion Gap</text><!-- Fishplate linking rails --><rect x='140' y='63' width='60' height='9' fill='#64748b' opacity='0.7'/><circle cx='148' cy='67' r='2' fill='#0f172a'/><circle cx='192' cy='67' r='2' fill='#0f172a'/><text x='170' y='130' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>GAPS PREVENT THERMAL BUCKLING OF RAILS</text></svg></div>",
    "options": [
      "To allow drainage water to cool the railway line continuously",
      "To accommodate the linear thermal expansion of steel rails during hot days and prevent buckling",
      "To allow the rail segments to contract freely during cold harmattan nights",
      "To facilitate regular greasing and routine track maintenance"
    ],
    "correctAnswer": "To accommodate the linear thermal expansion of steel rails during hot days and prevent buckling",
    "hint": "Metals expand when heated by daytime sunshine; gaps give rails room to lengthen safely.",
    "workedSolution": "Metals undergo thermal expansion upon heating. Gaps provide room for the rails to expand lengthwise without exerting lateral compressive forces that cause derailment buckling.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "Which of the following detrimental effects are caused by the atmospheric rusting (oxidation) of structural iron?",
    "options": [
      "Loss of mechanical strength, structural disintegration, and loss of electrical conductivity",
      "Loss of mass with an increase in magnetic strength",
      "Increase in structural ductility and malleability",
      "Formation of a waterproof impervious coating"
    ],
    "correctAnswer": "Loss of mechanical strength, structural disintegration, and loss of electrical conductivity",
    "hint": "Rusting creates crumbly hydrated iron oxide, degrading strength and conductivity.",
    "workedSolution": "Rusting turns structural iron into flaky, non-conductive hydrated iron (III) oxide, reducing tensile strength, ruining dimensional tolerances, and degrading electrical conductivity.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "Why do farmers frequently include leguminous crops (such as cowpea and soybean) in rotational cropping programs?",
    "options": [
      "To extract and remove excess potassium from the topsoil",
      "To add inorganic carbon deposits directly into soil macropores",
      "To replenish available soil nitrogen through symbiotic nitrogen-fixing root bacteria",
      "To sterilize the soil from all microbial decomposers"
    ],
    "correctAnswer": "To replenish available soil nitrogen through symbiotic nitrogen-fixing root bacteria",
    "hint": "Root nodules contain Rhizobium bacteria that convert atmospheric N₂ into nitrates.",
    "workedSolution": "Legumes host symbiotic Rhizobium bacteria within root nodules that fix atmospheric nitrogen gas into plant-available nitrates, restoring soil fertility.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "In ecology, what is the specific term for the natural physical locality where an organism lives, feeds, and reproduces successfully?",
    "options": [
      "An ecological niche",
      "A biome",
      "An abiotic factor",
      "A habitat"
    ],
    "correctAnswer": "A habitat",
    "hint": "The physical dwelling place of an animal or plant (e.g., a freshwater pond, forest floor).",
    "workedSolution": "A habitat is the specific physical and biological environment where an organism lives and finds food, shelter, and mates to reproduce.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "Which water treatment chemical softens permanently hard water by precipitating dissolved calcium and magnesium ions as insoluble carbonates?",
    "options": [
      "Sodium chloride [NaCl]",
      "Sodium carbonate [Na₂CO₃] (washing soda)",
      "Alum [potassium aluminum sulfate]",
      "Calcium hydroxide [Ca(OH)₂]"
    ],
    "correctAnswer": "Sodium carbonate [Na₂CO₃] (washing soda)",
    "hint": "Washing soda reacts with Ca²⁺ to precipitate CaCO₃.",
    "workedSolution": "Adding sodium carbonate (Na₂CO₃) precipitates dissolved hardness-causing calcium and magnesium ions as insoluble carbonates: Ca²⁺ + CO₃²⁻ → CaCO₃↓.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "In post-harvest processing of agricultural produce, dehusking and shelling are essential processing stages carried out on:",
    "options": [
      "Cassava tubers",
      "Sweet potato roots",
      "Groundnut pods and cereal maize cobs",
      "Tomatoes and garden eggs"
    ],
    "correctAnswer": "Groundnut pods and cereal maize cobs",
    "hint": "Pods and cobs have outer protective husks and shells that must be removed to access edible seeds.",
    "workedSolution": "Dehusking removes the outer fibrous husks, and shelling breaks the pod or cob to extract seeds (e.g., groundnut seeds and maize grains).",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "How is typhoid fever, caused by the bacterium Salmonella typhi, primarily transmitted to human beings?",
    "options": [
      "Ingesting food and drinking water contaminated with infected human feces",
      "Direct airborne droplet infection from coughing",
      "Bites from infected female Anopheles mosquitoes",
      "Touching the undamaged skin of an infected patient"
    ],
    "correctAnswer": "Ingesting food and drinking water contaminated with infected human feces",
    "hint": "A water-borne fecal-oral enteric infection spread by unwashed hands, houseflies, and contaminated water.",
    "workedSolution": "Typhoid fever is a gastrointestinal bacterial infection transmitted via the fecal-oral route through contaminated drinking water or food handled by carriers.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "Which of the following situations illustrates a practical engineering or everyday advantage of friction?",
    "options": [
      "Generating excessive waste heat between moving engine parts",
      "Enabling cutting tools to be sharpened on abrasive whetstones and providing walking grip",
      "Wearing away the rubber tread soles of athletic footwear",
      "Decreasing the mechanical efficiency of simple machines below 100%"
    ],
    "correctAnswer": "Enabling cutting tools to be sharpened on abrasive whetstones and providing walking grip",
    "hint": "Without friction, abrasive sharpening would be impossible and shoes would slip on floors.",
    "workedSolution": "Friction provides the traction needed for walking, allows vehicle brakes to grip, and provides the abrasive shear force needed to grind and sharpen blades on whetstones.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "Which traditional agricultural hand tool with a curved, sharp steel blade is specifically designed for harvesting rice, wheat, and forage grass?",
    "options": [
      "A garden hand trowel",
      "A heavy steel pickaxe",
      "A dibber",
      "A harvesting sickle"
    ],
    "correctAnswer": "A harvesting sickle",
    "hint": "A crescent-shaped curved blade mounted on a short wooden handle.",
    "workedSolution": "A sickle has a curved, sharp steel blade designed to slice through cereal stalks (such as rice and wheat) and grasses during manual harvesting.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "Which of the following optical characteristics correctly describe the image formed on the screen of a pinhole camera?",
    "options": [
      "Virtual, upright, and magnified",
      "Virtual, inverted, and enlarged",
      "Real, upright, and blurred",
      "Real, inverted, and diminished"
    ],
    "correctAnswer": "Real, inverted, and diminished",
    "hint": "Light rays cross at the pinhole, projecting upside down on the rear screen.",
    "workedSolution": "Because light travels in straight lines, rays from an object cross through the narrow pinhole, forming a real, inverted (upside-down), and diminished image.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "Why do vegetable farmers transplant nursery seedlings into field seedbeds in the cool late afternoon or evening?",
    "options": [
      "Nighttime darkness accelerates the photosynthetic production of starch",
      "Transpiration water loss from foliage is minimal, reducing transplanting shock and wilting",
      "Seedlings require zero soil nutrients during nighttime hours",
      "Insects and plant pests never fly or feed after sunset"
    ],
    "correctAnswer": "Transpiration water loss from foliage is minimal, reducing transplanting shock and wilting",
    "hint": "Cool temperatures and higher humidity allow fragile roots to establish water uptake before hot morning sun.",
    "workedSolution": "Transplanting in the evening minimizes foliar transpiration water loss, allowing seedlings to absorb water overnight and adapt before facing daylight heat.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Which of the following statements concerning chemical molecules is scientifically accurate?",
    "options": [
      "They are physically loose unbonded mixtures of sub-atomic protons",
      "They always carry an overall net electrical positive or negative charge",
      "They cannot exist independently under standard temperatures",
      "They consist of chemically bonded groups of atoms capable of independent existence"
    ],
    "correctAnswer": "They consist of chemically bonded groups of atoms capable of independent existence",
    "hint": "Covalently bonded atoms formed by sharing electrons (e.g., O₂, H₂O, CO₂).",
    "workedSolution": "A molecule is an electrically neutral group of two or more atoms held together by covalent chemical bonds that can exist independently with distinct properties.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "Which morphological feature is a characteristic adaptation of seeds and fruits dispersed by wind currents (anemochory)?",
    "options": [
      "Having thick, succulent, edible sweet pulp",
      "Possessing sharp backward-curving recurved hooks and spines",
      "Being large, dense, and heavily waterlogged",
      "Possessing tufts of light, feathery hairs or papery wing-like expansions"
    ],
    "correctAnswer": "Possessing tufts of light, feathery hairs or papery wing-like expansions",
    "hint": "Seeds that float on air currents like miniature parachutes (e.g., tridax, silk cotton).",
    "workedSolution": "Wind-dispersed seeds are lightweight and feature surface modifications like feathery pappus hairs or papery wings, increasing surface area to float on air currents.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Which of the following materials allows electric current to pass through it with negligible resistance and is classified as a conductor?",
    "options": [
      "Pure silica glass",
      "Dry vulcanized rubber",
      "Solid aluminum wire",
      "Dry wooden stick"
    ],
    "correctAnswer": "Solid aluminum wire",
    "hint": "A ductile metal containing free delocalized valence electrons.",
    "workedSolution": "Aluminum is a metallic conductor possessing free delocalized conduction electrons that drift under an applied electric potential, carrying electric current.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "A pure molecule of water contains hydrogen and oxygen atoms chemically combined in a fixed ratio of:",
    "options": [
      "1 hydrogen atom to 2 oxygen atoms (1:2)",
      "2 hydrogen atoms to 1 oxygen atom (2:1)",
      "1 hydrogen atom to 3 oxygen atoms (1:3)",
      "3 hydrogen atoms to 1 oxygen atom (3:1)"
    ],
    "correctAnswer": "2 hydrogen atoms to 1 oxygen atom (2:1)",
    "hint": "Formula: H₂O.",
    "workedSolution": "Water (H₂O) contains two hydrogen atoms covalently bonded to one central oxygen atom, giving an atomic combining ratio of 2:1.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "In the complex multi-chambered stomach of ruminant animals, where do symbiotic microflora synthesize B-complex vitamins and ferment cellulose?",
    "options": [
      "In the rumen (paunch)",
      "In the abomasum (true glandular stomach)",
      "In the omasum (manyplies)",
      "In the duodenum"
    ],
    "correctAnswer": "In the rumen (paunch)",
    "hint": "The first and largest chamber containing billions of symbiotic anaerobic bacteria and protozoa.",
    "workedSolution": "The rumen serves as a large fermentation chamber where symbiotic microbes ferment cellulose and synthesize volatile fatty acids, amino acids, and B-complex vitamins.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "Which lifestyle habit helps prevent and manage high blood pressure (hypertension) in human adults?",
    "options": [
      "Consuming high amounts of saturated animal fats and alcohol",
      "Engaging in regular aerobic cardiovascular physical exercise and eating a low-salt diet",
      "Engaging in regular cigarette and tobacco smoking",
      "Leading an entirely sedentary lifestyle without movement"
    ],
    "correctAnswer": "Engaging in regular aerobic cardiovascular physical exercise and eating a low-salt diet",
    "hint": "Exercise strengthens heart muscle and improves vascular elasticity while low sodium lowers fluid volume.",
    "workedSolution": "Regular aerobic exercise, low dietary sodium intake, stress management, and avoiding tobacco maintain arterial elasticity and control blood pressure.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "What mechanical property of metals enables them to be drawn into long, thin wires without fracturing or snapping?",
    "options": [
      "Ductility",
      "Malleability",
      "Thermal conductivity",
      "Electrical resistivity"
    ],
    "correctAnswer": "Ductility",
    "hint": "Malleability allows hammering into sheets; this property allows drawing into wires.",
    "workedSolution": "Ductility is the mechanical property that permits a material (such as copper or aluminum) to undergo significant plastic deformation under tensile stress, allowing it to be drawn into wires.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "An atom of aluminum is represented by the nuclear symbol ²⁷₁₃Al. How many uncharged neutrons reside within its nucleus?",
    "options": [
      "13 neutrons",
      "27 neutrons",
      "14 neutrons",
      "40 neutrons"
    ],
    "correctAnswer": "14 neutrons",
    "hint": "Neutrons = Mass Number (A) - Atomic Number (Z) = 27 - 13.",
    "workedSolution": "Neutron Number (N) = A - Z = 27 - 13 = 14 neutrons.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "In agricultural crop production, viable seeds are scientifically defined as seeds that:",
    "options": [
      "Possess a living, healthy embryo capable of germinating under suitable conditions",
      "Possess an extremely hard, impermeable stony testa",
      "Contain high percentages of vegetable oil and lipids",
      "Have been roasted to prevent pest infestation"
    ],
    "correctAnswer": "Possess a living, healthy embryo capable of germinating under suitable conditions",
    "hint": "Viability means the embryo inside is alive and will sprout when given water, warmth, and air.",
    "workedSolution": "Viable seeds contain an intact, living, non-dormant embryo capable of germinating and establishing into a healthy seedling when provided with water, oxygen, and warmth.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "Which physical phase transition can occur continuously from the exposed surface of a liquid at any temperature below its boiling point?",
    "options": [
      "Boiling",
      "Melting",
      "Sublimation",
      "Evaporation"
    ],
    "correctAnswer": "Evaporation",
    "hint": "Unlike boiling, which occurs at a fixed temperature throughout the liquid, this occurs only at the surface at all temperatures.",
    "workedSolution": "Evaporation is a spontaneous surface phenomenon that occurs at all temperatures below the boiling point, as high-energy surface molecules escape into the vapor phase.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "Which intentional human environmental action helps maintain balance in the global carbon cycle and prevents global warming?",
    "options": [
      "Uncontrolled seasonal bush burning across savannas",
      "Indiscriminate logging and clear-felling of tropical rainforests",
      "Discharging untreated factory fumes and exhaust emissions into the atmosphere",
      "Extensive afforestation and planting replacement trees for timber felled"
    ],
    "correctAnswer": "Extensive afforestation and planting replacement trees for timber felled",
    "hint": "Trees act as carbon sinks, absorbing carbon dioxide from the air during photosynthesis.",
    "workedSolution": "Replanting and conserving trees maintains the carbon cycle; growing trees act as carbon sinks, absorbing atmospheric carbon dioxide through photosynthesis.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "What is the agronomic term for a cropping practice where only one single crop species is grown on the same field parcel season after season?",
    "options": [
      "Systematic crop rotation",
      "Monoculture (or monocropping)",
      "Mixed farming",
      "Shifting cultivation"
    ],
    "correctAnswer": "Monoculture (or monocropping)",
    "hint": "Growing a single crop without rotation (e.g., continuous maize year after year).",
    "workedSolution": "Monoculture (monocropping) is the repeated cultivation of a single crop species on the same piece of land without rotational breaks, depleting specific nutrients and encouraging pests.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "Why is the green pigment chlorophyll indispensable for the process of photosynthesis in plants?",
    "options": [
      "It absorbs molecular oxygen directly from atmospheric air",
      "It generates carbon dioxide gas within the leaf cells",
      "It acts as a mechanical barrier preventing water evaporation",
      "It traps and absorbs photon radiant energy from sunlight to drive chemical reactions"
    ],
    "correctAnswer": "It traps and absorbs photon radiant energy from sunlight to drive chemical reactions",
    "hint": "Absorbs blue and red light wavelengths, energizing the splitting of water into hydrogen and oxygen.",
    "workedSolution": "Chlorophyll pigments within thylakoid membranes absorb light energy, converting solar photons into chemical energy (ATP and NADPH) to reduce CO₂ into glucose.",
    "points": 1
  }
]
};
