/**
 * 1992 BECE Integrated Science Examination (Set 124 Cloned Practice Variant)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_1992_variant
 * Set Number: Set 124
 * Format: 
 *   - Paper 1 (40 Objectives, exactly 10 A, 10 B, 10 C, 10 D)
 *   - Paper 2 (4 Theory & Practical Essay Questions, 20 marks each = 80 marks total)
 * Visual Setups:
 *   - svgQ2bLever: First-class lever diagram with Fulcrum, Effort, and Load
 *   - svgQ3aSoilCylinder: Soil sedimentation cylinder with Humus, Clay, Silt, Sand, Gravel
 *   - svgQ4cTeleostFish: Lateral view of teleost bony fish with fins, operculum, lateral line
 * 
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
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

export interface Paper2SubQuestion {
  subId: string;
  prompt: string;
  workedSolution: string;
  maxMarks: number;
}

export interface Paper2Question {
  questionNumber: string;
  isPracticalSectionA: boolean;
  subQuestions: Paper2SubQuestion[];
}

export const svgQ2bLever = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 170' width='100%' height='155' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><polygon points='180,95 155,140 205,140' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/><circle cx='180' cy='95' r='3.5' fill='#ffffff'/><text x='180' y='155' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Pivot (Fulcrum)</text><rect x='40' y='90' width='280' height='10' rx='2' fill='#475569' stroke='#cbd5e1' stroke-width='1.5'/><line x1='60' y1='45' x2='60' y2='90' stroke='#10b981' stroke-width='2.5'/><polygon points='56,82 60,92 64,82' fill='#10b981'/><text x='60' y='35' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>Effort (E)</text><rect x='270' y='65' width='30' height='25' fill='#1e293b' stroke='#ef4444' stroke-width='1.8'/><text x='285' y='82' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>Load</text><line x1='285' y1='90' x2='285' y2='130' stroke='#ef4444' stroke-width='2.5'/><polygon points='281,122 285,132 289,122' fill='#ef4444'/><text x='285' y='145' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>Load (L)</text><text x='180' y='165' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>FIRST CLASS LEVER: FULCRUM IS LOCATED BETWEEN EFFORT AND LOAD</text></svg></div>";
export const svgQ3aSoilCylinder = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 240' width='100%' height='220' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(80, 15)'><path d='M 10 10 L 10 185 Q 10 200 50 200 Q 90 200 90 185 L 90 10' fill='none' stroke='#38bdf8' stroke-width='2'/><polygon points='0,205 100,205 90,200 10,200' fill='#334155' stroke='#38bdf8' stroke-width='1.5'/><text x='50' y='0' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Sedimentation Cylinder</text><rect x='11' y='25' width='78' height='20' fill='#78350f' opacity='0.7'/><circle cx='30' cy='35' r='1.5' fill='#fef08a'/><circle cx='55' cy='32' r='2' fill='#fef08a'/><circle cx='70' cy='37' r='1.5' fill='#fef08a'/><line x1='90' y1='35' x2='130' y2='35' stroke='#f59e0b' stroke-width='1.5'/><text x='136' y='39' font-size='11' font-weight='bold' fill='#f59e0b'>Humus (Organic)</text><rect x='11' y='45' width='78' height='35' fill='#0284c7' opacity='0.3'/><line x1='90' y1='62' x2='130' y2='62' stroke='#38bdf8' stroke-width='1.5'/><text x='136' y='66' font-size='11' font-weight='bold' fill='#38bdf8'>Clay (Water)</text><rect x='11' y='80' width='78' height='30' fill='#a16207' opacity='0.5'/><line x1='90' y1='95' x2='130' y2='95' stroke='#ca8a04' stroke-width='1.5'/><text x='136' y='99' font-size='11' font-weight='bold' fill='#ca8a04'>Silt</text><rect x='11' y='110' width='78' height='40' fill='#d97706' opacity='0.7'/><circle cx='30' cy='125' r='1.5' fill='#ffffff'/><circle cx='50' cy='135' r='1.5' fill='#ffffff'/><circle cx='70' cy='128' r='1.5' fill='#ffffff'/><line x1='90' y1='130' x2='130' y2='130' stroke='#d97706' stroke-width='1.5'/><text x='136' y='134' font-size='11' font-weight='bold' fill='#d97706'>Sand</text><rect x='11' y='150' width='78' height='38' rx='4' fill='#475569' opacity='0.9'/><polygon points='25,160 32,155 35,166 22,168' fill='#94a3b8'/><polygon points='55,162 65,158 62,172 48,170' fill='#94a3b8'/><line x1='90' y1='168' x2='130' y2='168' stroke='#94a3b8' stroke-width='1.5'/><text x='136' y='172' font-size='11' font-weight='bold' fill='#94a3b8'>Gravel / Stones</text></g><text x='170' y='230' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>SOIL STRATIFICATION ACCORDING TO PARTICLE SIZE AND DENSITY</text></svg></div>";
export const svgQ4cTeleostFish = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><path d='M 50 100 C 90 50 240 50 280 100 C 240 150 90 150 50 100 Z' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/><polygon points='280,100 330,60 310,100 330,140' fill='#0284c7' opacity='0.6' stroke='#38bdf8' stroke-width='1.5'/><text x='340' y='105' font-size='10' font-weight='bold' fill='#38bdf8'>Caudal fin</text><polygon points='150,60 210,35 230,60' fill='#0284c7' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/><text x='180' y='28' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Dorsal fin</text><circle cx='80' cy='90' r='5' fill='#facc15' stroke='#ca8a04'/><circle cx='81' cy='90' r='2' fill='#0f172a'/><path d='M 45 100 L 60 102' stroke='#38bdf8' stroke-width='2'/><text x='35' y='104' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='end'>Mouth</text><path d='M 115 75 Q 125 100 115 125' fill='none' stroke='#f59e0b' stroke-width='2.5'/><text x='125' y='68' font-size='10' font-weight='bold' fill='#f59e0b'>Operculum</text><polygon points='130,105 160,110 145,125' fill='#0284c7' opacity='0.6' stroke='#38bdf8' stroke-width='1.2'/><text x='150' y='138' font-size='9' font-weight='bold' fill='#38bdf8'>Pectoral</text><polygon points='165,138 185,155 175,138' fill='#0284c7' opacity='0.6' stroke='#38bdf8' stroke-width='1.2'/><text x='170' y='170' font-size='9' font-weight='bold' fill='#38bdf8'>Pelvic</text><polygon points='230,135 255,155 250,135' fill='#0284c7' opacity='0.6' stroke='#38bdf8' stroke-width='1.2'/><text x='250' y='170' font-size='9' font-weight='bold' fill='#38bdf8'>Anal</text><path d='M 125 100 Q 200 96 280 100' fill='none' stroke='#fde047' stroke-width='1.2' stroke-dasharray='3,2'/><text x='200' y='88' font-size='9' font-weight='bold' fill='#fde047' text-anchor='middle'>Lateral line</text><text x='190' y='190' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>BONY FISH MORPHOLOGY: ADAPTED FOR AQUATIC PROPULSION AND GAS EXCHANGE</text></svg></div>";

export const SET_BECE_1992_SCIENCE_P1_QUESTIONS: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "Which of the following statements is universally true regarding any sample of matter?",
    "options": [
      "It possesses mass (weight) and occupies a definite volume of space",
      "It possesses weight and moves in a fixed vector direction only",
      "It possesses weight but occupies zero physical volume",
      "It possesses a definite volume but zero gravitational mass"
    ],
    "correctAnswer": "It possesses mass (weight) and occupies a definite volume of space",
    "hint": "Matter is scientifically defined as anything that has mass and takes up space.",
    "workedSolution": "By physical definition, matter is any substance that possesses mass (and experiences gravitational weight) and occupies a three-dimensional volume of space.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "In chemical nomenclature and bonding, the combining capacity of an atom or radical is called its:",
    "options": [
      "Atomic number",
      "Charged ion",
      "Nuclear isotope",
      "Valency"
    ],
    "correctAnswer": "Valency",
    "hint": "Determined by the number of valence electrons an atom gains, loses, or shares.",
    "workedSolution": "Valency is the combining power of an element or radical, representing the number of hydrogen atoms (or equivalent) that can combine with or displace one atom of the element.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Why is indiscriminate disposal of human fecal waste into open rivers classified as a major public health hazard?",
    "options": [
      "It causes immediate permanent hardness of the water",
      "It permanently alters the aesthetic color of the river",
      "Downstream communities collect and consume the contaminated water for domestic drinking",
      "Solid feces cannot be broken down by aquatic microorganisms"
    ],
    "correctAnswer": "Downstream communities collect and consume the contaminated water for domestic drinking",
    "hint": "Feces contains pathogenic bacteria, viruses, and parasitic worm eggs causing waterborne disease epidemics.",
    "workedSolution": "Fecal contamination of water bodies introduces enteric pathogens (such as Vibrio cholerae, Salmonella typhi, and Schistosoma), triggering waterborne disease outbreaks in downstream users.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "Which physical laboratory separation method is most suitable for separating a dry heterogeneous mixture of iron filings and sulfur powder?",
    "options": [
      "Agricultural winnowing",
      "Gravity decantation",
      "Magnetic separation using a permanent magnet",
      "Thermal evaporation to dryness"
    ],
    "correctAnswer": "Magnetic separation using a permanent magnet",
    "hint": "Iron is ferromagnetic and is attracted to a magnet, while sulfur is non-magnetic.",
    "workedSolution": "Iron filings are ferromagnetic and cling to a magnet, while non-magnetic yellow sulfur remains behind, making magnetic separation ideal.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "An athlete running across a sports track stepped on a discarded banana peel and slipped. The athlete fell because:",
    "options": [
      "The track surface was excessively hard and unyielding",
      "The banana peel generated an upward repulsive electrostatic force",
      "The banana peel acted as a lubricant that drastically reduced friction with the ground",
      "The athlete was moving with zero linear momentum"
    ],
    "correctAnswer": "The banana peel acted as a lubricant that drastically reduced friction with the ground",
    "hint": "Moisture and soft organic cellular pulp eliminate traction between shoe and ground.",
    "workedSolution": "The organic pulp and moisture of a banana peel act as a liquid lubricant, drastically reducing the coefficient of friction and causing the foot to slip.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Which of the following agricultural cultivated plants is botanically classified as a modified underground rhizome?",
    "options": [
      "Irish potato stem tuber",
      "Onion bulb",
      "Cocoyam corm",
      "Ginger [Zingiber officinale]"
    ],
    "correctAnswer": "Ginger [Zingiber officinale]",
    "hint": "A horizontally growing subterranean stem bearing nodes, internodes, and scale leaves.",
    "workedSolution": "Ginger is an underground rhizome (a horizontal underground stem). Potatoes are stem tubers, onions are bulbs, and cocoyams are corms.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "How many different chemical elements are present in a single molecule of copper (II) chloride (CuCl₂)?",
    "options": [
      "Three elements",
      "Four elements",
      "Five elements",
      "Two elements (Copper and Chlorine)"
    ],
    "correctAnswer": "Two elements (Copper and Chlorine)",
    "hint": "Count the distinct chemical symbols: Cu and Cl.",
    "workedSolution": "CuCl₂ contains 3 total atoms, but consists of only two distinct chemical elements: Copper (Cu) and Chlorine (Cl).",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Which sequence of energy transformations takes place when a church bell is struck and tolled by a swinging clapper?",
    "options": [
      "Mechanical kinetic energy converts into acoustic sound energy and heat",
      "Chemical potential energy converts into light energy",
      "Electrical energy converts into sound energy directly",
      "Gravitational potential energy converts into nuclear energy"
    ],
    "correctAnswer": "Mechanical kinetic energy converts into acoustic sound energy and heat",
    "hint": "The moving clapper strikes the bell shell, causing metal vibrations that produce sound.",
    "workedSolution": "The mechanical kinetic energy of the moving clapper strikes the metal bell, generating acoustic sound energy through air pressure waves along with minor thermal heat.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "Living organisms are fundamentally distinguished from non-living entities because all living things:",
    "options": [
      "Lack definite geometric shapes and structural forms",
      "Consume liquid nutrient foods exclusively",
      "Possess green photosynthetic chlorophyll pigments",
      "Are composed of living, metabolizing cellular protoplasm"
    ],
    "correctAnswer": "Are composed of living, metabolizing cellular protoplasm",
    "hint": "The cell cytoplasm and nucleus constitute the physical basis of life.",
    "workedSolution": "All living things are cellular organisms containing protoplasm (cytoplasm and nucleus) that executes metabolic life processes. Chlorophyll is restricted to autotrophic plants.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "Which atmospheric gas is an essential chemical oxidizer that supports and sustains the combustion of fuels?",
    "options": [
      "Carbon dioxide gas [CO₂]",
      "Flammable hydrogen gas [H₂]",
      "Diatomic oxygen gas [O₂]",
      "Pungent ammonia gas [NH₃]"
    ],
    "correctAnswer": "Diatomic oxygen gas [O₂]",
    "hint": "Makes up approximately 21% of the atmosphere and rekindles a glowing splint.",
    "workedSolution": "Oxygen gas (O₂) is an oxidizing agent essential for combustion; pure oxygen relights a glowing wooden splint.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "Calculate the mechanical work done when an object of weight $40.0\\text{ N}$ is lifted vertically through a vertical height of $10.0\\text{ m}$:",
    "options": [
      "50.0 Joules",
      "400.0 Joules",
      "30.0 Joules",
      "4.0 Joules"
    ],
    "correctAnswer": "400.0 Joules",
    "hint": "\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (h) = 40.0 \\times 10.0.",
    "workedSolution": "$$\\text{Work Done } (W) = F \\times h = 40.0\\text{ N} \\times 10.0\\text{ m} = 400.0\\text{ Joules (J)}$$.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "Which of the following biological substances is NOT an excretory product eliminated by the sweat glands of human skin?",
    "options": [
      "Undigested solid fecal residue",
      "Excess water",
      "Dissolved sodium chloride mineral salt",
      "Traces of metabolic urea"
    ],
    "correctAnswer": "Undigested solid fecal residue",
    "hint": "Feces is undigested egested waste from the digestive tract; skin excretes sweat components.",
    "workedSolution": "Human skin excretes sweat containing water, dissolved sodium chloride, and traces of urea. Feces is egested from the alimentary canal through defecation.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "In fundamental chemistry, a pure chemical element is defined as a substance that:",
    "options": [
      "Consists exclusively of atoms having the exact same atomic number",
      "Is formed by combining a chemical compound with a physical mixture",
      "Is formed by physically dissolving an atom into a liquid solvent",
      "Can be decomposed into simpler substances by boiling"
    ],
    "correctAnswer": "Consists exclusively of atoms having the exact same atomic number",
    "hint": "Cannot be split into simpler components by ordinary chemical reactions.",
    "workedSolution": "An element is a pure chemical substance consisting of atoms with the same nuclear proton number (atomic number) that cannot be broken down by chemical means.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "In the International System of Units (S.I.), what derived unit is used to measure both mechanical work and thermal energy?",
    "options": [
      "Joule [J]",
      "Kelvin [K]",
      "Watt [W]",
      "Newton [N]"
    ],
    "correctAnswer": "Joule [J]",
    "hint": "1 Joule = 1 Newton x 1 meter.",
    "workedSolution": "The Joule (J) is the S.I. unit of work and energy. Kelvin measures temperature, Watt measures power, and Newton measures force.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "Which of the following physiological processes is specific to vascular green plants rather than a universal characteristic of all living organisms?",
    "options": [
      "Irreversible cellular growth",
      "Stomatal transpiration",
      "Biological reproduction",
      "Cellular nutrition / feeding"
    ],
    "correctAnswer": "Stomatal transpiration",
    "hint": "The evaporative loss of water vapor through microscopic leaf stomata.",
    "workedSolution": "Transpiration (evaporative water loss through stomata) occurs in vascular plants. Respiration, growth, reproduction, and feeding occur across living kingdoms.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "Which of the following chemical substances represents a physical homogeneous mixture rather than a pure chemical compound?",
    "options": [
      "Solid sodium chloride [NaCl]",
      "Aqueous cane sugar solution",
      "Gaseous sulfur dioxide [SO₂]",
      "Gaseous carbon dioxide [CO₂]"
    ],
    "correctAnswer": "Aqueous cane sugar solution",
    "hint": "Formed by dissolving sucrose solute into water solvent in variable proportions.",
    "workedSolution": "Sugar solution is a homogeneous mixture of sugar and water physically combined without fixed stoichiometry. Sodium chloride, sulfur dioxide, and carbon dioxide are pure compounds.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "Why are domestic metal cooking pots and pans fitted with wooden or plastic handles?",
    "options": [
      "Wood is an excellent conductor of thermal heat",
      "Wood is a poor conductor of thermal heat (thermal insulator)",
      "Wood is a highly efficient radiator of infrared heat",
      "Wood absorbs all food aromas during boiling"
    ],
    "correctAnswer": "Wood is a poor conductor of thermal heat (thermal insulator)",
    "hint": "Prevents heat from conducting from the hot metal pot to the user's hand.",
    "workedSolution": "Wood and plastics have very low thermal conductivity. Fitting them onto metal cooking pots prevents thermal burn injuries by blocking conductive heat transfer.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "To ensure balanced physical growth, optimal cellular repair, and disease prevention, a person's diet must contain:",
    "options": [
      "Excess dietary fats and animal oils exclusively",
      "All essential food nutrients in their correct dietary proportions",
      "Equal masses of refined carbohydrates and animal proteins only",
      "Mineral salts and water without any organic nutrients"
    ],
    "correctAnswer": "All essential food nutrients in their correct dietary proportions",
    "hint": "Defines a balanced diet containing carbohydrates, proteins, fats, vitamins, minerals, water, and roughage.",
    "workedSolution": "A balanced diet supplies all essential macronutrients and micronutrients in adequate proportions along with water and roughage to meet metabolic demands.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "When the outer protective seed coat (testa) of a soaked dicotyledonous bean seed is removed, the remaining seed consists primarily of:",
    "options": [
      "The microscopic micropyle pore",
      "The plant embryo (swollen cotyledons, plumule, and radicle)",
      "The scar-like attachment hilum",
      "The dry maternal fruit pericarp"
    ],
    "correctAnswer": "The plant embryo (swollen cotyledons, plumule, and radicle)",
    "hint": "Two fleshy cotyledons enclosing the embryonic shoot and root.",
    "workedSolution": "Removing the outer testa exposes the plant embryo, which consists of two food-storing cotyledons enclosing the embryonic shoot (plumule) and root (radicle).",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "Which of the following human industrial activities causes widespread chemical pollution of the atmospheric environment?",
    "options": [
      "Harvesting mature timber trees in managed forest reserves",
      "Controlled rotational pasture grazing by livestock",
      "Constructing concrete hydroelectric dams across rivers",
      "Combustion of coal and petroleum fuels in factories and vehicles"
    ],
    "correctAnswer": "Combustion of coal and petroleum fuels in factories and vehicles",
    "hint": "Releases sulfur dioxide, carbon monoxide, nitrogen oxides, and soot particulates.",
    "workedSolution": "Burning fossil fuels (coal, diesel, petrol) releases greenhouse gases (CO₂), toxic carbon monoxide, sulfur dioxide, and particulate soot into the atmosphere.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "A person exerts a large horizontal pushing force against a rigid, unyielding concrete wall without moving it. Scientifically, zero work is done because:",
    "options": [
      "The applied pushing force acts in the opposite direction",
      "The displacement of the wall in the direction of the force is zero [d = 0]",
      "The applied force is perpendicular to gravitational weight",
      "The concrete material of the wall possesses high tensile strength"
    ],
    "correctAnswer": "The displacement of the wall in the direction of the force is zero [d = 0]",
    "hint": "\\text{Work Done} = \\text{Force} \\times \\text{Displacement}. If d = 0, then W = 0.",
    "workedSolution": "Mechanical work requires displacement in the direction of the applied force ($W = F \\times d$). Because the wall does not move ($d = 0$), no work is performed.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "The physical process in which a hot, concentrated saturated solution is allowed to cool to precipitate solid crystals of solute is:",
    "options": [
      "Vapor condensation",
      "Thermal evaporation",
      "Crystallization",
      "Atmospheric distillation"
    ],
    "correctAnswer": "Crystallization",
    "hint": "Solute solubility decreases with temperature, forcing excess solute out of solution as crystals.",
    "workedSolution": "Crystallization occurs when a hot saturated solution cools; the decrease in solubility forces dissolved solute molecules to precipitate into geometric crystal lattices.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "Which of the following infectious communicable skin diseases in humans is caused by a parasitic fungal dermatophyte?",
    "options": [
      "Bacterial typhoid fever",
      "Bacterial leprosy [Mycobacterium leprae]",
      "Viral measles [Morbillivirus]",
      "Ringworm [Tinea capitis / corporis]"
    ],
    "correctAnswer": "Ringworm [Tinea capitis / corporis]",
    "hint": "Characterized by circular, itchy, scaly skin lesions; treated with antifungal creams.",
    "workedSolution": "Ringworm is a contagious cutaneous fungal infection caused by dermatophytes (Microsporum, Trichophyton). Typhoid and leprosy are bacterial; measles is viral.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "In commercial agriculture, cassava (*Manihot esculenta*) is propagated vegetatively using mature stem cuttings primarily because the cutting:",
    "options": [
      "Stores concentrated starch reserves inside the aerial stem",
      "Sprouts adventitious roots from nodes and leafy shoots from buds to develop rapidly",
      "Naturally repels all subterranean rodent pests",
      "Possesses floral nectaries that accelerate cross-pollination"
    ],
    "correctAnswer": "Sprouts adventitious roots from nodes and leafy shoots from buds to develop rapidly",
    "hint": "Stem stakes root easily and maintain the genetic qualities of high-yielding parent plants.",
    "workedSolution": "Cassava stem cuttings possess nodal buds that sprout into vegetative shoots above ground while developing adventitious storage roots in the soil.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "All of the following vector control and medical practices help prevent the transmission of malaria parasites EXCEPT:",
    "options": [
      "Sleeping outdoors in the open night air without protection",
      "Sleeping under insecticide-treated bed nets (ITNs)",
      "Draining and eliminating stagnant puddles of water around dwellings",
      "Taking prescribed prophylactic antimalarial medications"
    ],
    "correctAnswer": "Sleeping outdoors in the open night air without protection",
    "hint": "Outdoor sleeping exposes people directly to night-biting female Anopheles mosquitoes.",
    "workedSolution": "Sleeping outside in the open increases exposure to bites from night-feeding female Anopheles mosquitoes, facilitating malaria transmission.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "In human digestive physiology, solid feces is scientifically defined as:",
    "options": [
      "Toxic liquid metabolic excretory products filtered from blood plasma",
      "Undigested, unabsorbed food residue and cellular waste egested through the anus",
      "Fully digested and hydrolyzed nutrients absorbed by the small intestine",
      "Masticated food boluses held temporarily in the buccal mouth cavity"
    ],
    "correctAnswer": "Undigested, unabsorbed food residue and cellular waste egested through the anus",
    "hint": "Eliminated via defecation/egestion; excretion refers to metabolic wastes like urine and sweat.",
    "workedSolution": "Feces consists of undigested dietary roughage, unabsorbed water, shed intestinal epithelial cells, and bacteria egested from the bowels through defecation.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "Why does a wet cotton cloth dry much faster on a dry, sunny day than on a humid, cloudy day?",
    "options": [
      "There is high water vapor concentration in the atmosphere on a dry day",
      "Evaporation ceases completely on humid days",
      "The rate of evaporation is higher due to a steep water vapor pressure deficit",
      "Solar radiation eliminates all molecular kinetic energy"
    ],
    "correctAnswer": "The rate of evaporation is higher due to a steep water vapor pressure deficit",
    "hint": "Dry ambient air can hold more water vapor, accelerating evaporative mass transfer.",
    "workedSolution": "On dry days, low relative humidity creates a steep vapor pressure gradient between the wet cloth and air, accelerating the rate of evaporation.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Urinating indiscriminately into freshwater streams and rivers is a major transmission route for:",
    "options": [
      "Bacterial cholera",
      "Plasmodium malaria",
      "Airborne viral measles",
      "Bilharziasis (Urinary Schistosomiasis)"
    ],
    "correctAnswer": "Bilharziasis (Urinary Schistosomiasis)",
    "hint": "Schistosoma haematobium eggs shed in urine hatch into miracidia that infect freshwater snails.",
    "workedSolution": "Urinating in water releases Schistosoma haematobium eggs, which hatch into miracidia that infect aquatic snails (Bulinus), multiplying into infectious cercariae that infect humans.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "Which of the following agronomic practices accelerates rather than prevents soil erosion?",
    "options": [
      "Clear-felling protective forest vegetation and trees along sloping hillsides",
      "Afforestation and planting trees on bare exposed ground",
      "Planting vegetative cover grasses along steep slopes",
      "Contour ploughing and terracing across slope gradients"
    ],
    "correctAnswer": "Clear-felling protective forest vegetation and trees along sloping hillsides",
    "hint": "Removing trees exposes bare topsoil directly to the erosive energy of raindrops and runoff.",
    "workedSolution": "Clearing trees along slopes removes canopy interception and root reinforcement, accelerating surface runoff and soil erosion.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Which calibrated meteorological scientific instrument is installed at weather stations to measure atmospheric pressure?",
    "options": [
      "A cup anemometer",
      "A clinical thermometer",
      "A moving-coil galvanometer",
      "A barometer [mercury or aneroid]"
    ],
    "correctAnswer": "A barometer [mercury or aneroid]",
    "hint": "Measures atmospheric pressure in millimeters of mercury (mmHg) or hectopascals (hPa).",
    "workedSolution": "Barometers measure atmospheric pressure. Anemometers measure wind speed, thermometers measure temperature, and galvanometers detect electric currents.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "Which of the following physical entities CANNOT be classified as a form of matter?",
    "options": [
      "A block of solid water ice",
      "Visible light radiation",
      "Tropospheric atmospheric air",
      "Particulate wood smoke"
    ],
    "correctAnswer": "Visible light radiation",
    "hint": "Light is electromagnetic radiant energy; it possesses zero rest mass and occupies no physical volume.",
    "workedSolution": "Matter must have mass and occupy volume. Light is electromagnetic radiation consisting of massless photons, so it is a form of energy rather than matter.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "Regular oral teeth brushing is practiced in personal dental hygiene primarily to:",
    "options": [
      "Impart a pleasant mint aroma to the buccal cavity only",
      "Sterilize the entire mouth by destroying all beneficial bacteria",
      "Remove fermentable food debris and plaque to prevent bacterial acid decay",
      "Harden the inner dentine layer of teeth"
    ],
    "correctAnswer": "Remove fermentable food debris and plaque to prevent bacterial acid decay",
    "hint": "Bacteria ferment food residues into acids that demineralize enamel, causing dental caries.",
    "workedSolution": "Brushing dislodges trapped food particles and disrupts dental plaque biofilms, preventing bacteria from converting sugars into acids that cause cavities.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "When a solid sample is heated in a dry boiling tube and vaporizes completely without melting into a liquid, it shows that:",
    "options": [
      "The solid undergoes direct sublimation",
      "The solid is an alloy of high melting point",
      "The solid particles are bound by unbreakable covalent networks",
      "The solid was completely insoluble in water"
    ],
    "correctAnswer": "The solid undergoes direct sublimation",
    "hint": "Direct phase transition from solid to gas (e.g., camphor, dry ice, ammonium chloride).",
    "workedSolution": "Sublimation is the direct endothermic phase change from solid to gas without an intermediate liquid phase (e.g., camphor, ammonium chloride, iodine).",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "Which fundamental natural force continuously attracts and pulls physical objects toward the center of the Earth?",
    "options": [
      "Electrostatic attractive force",
      "Magnetic dipole force",
      "Gravitational force (gravity)",
      "Atmospheric aerodynamic drag"
    ],
    "correctAnswer": "Gravitational force (gravity)",
    "hint": "Gives objects gravitational weight (W = mg).",
    "workedSolution": "Earth's gravitational force attracts all objects possessing mass toward the planetary center of mass, producing weight (W = mg).",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "Which parasitic helminthic infection in humans is contracted by consuming raw or improperly cooked beef or pork containing viable cysticerci larvae?",
    "options": [
      "Tapeworm infestation [Taeniasis]",
      "Guinea worm infestation [Dracunculiasis]",
      "Bacterial leprosy",
      "Viral smallpox"
    ],
    "correctAnswer": "Tapeworm infestation [Taeniasis]",
    "hint": "Taenia saginata (beef tapeworm) and Taenia solium (pork tapeworm).",
    "workedSolution": "Taeniasis (tapeworm infection) is contracted by eating undercooked meat containing larval cysticerci, which excyst and mature in the human small intestine.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "A ray of light strikes a flat plane mirror such that the glancing angle between the ray and the mirror surface is 30°. Determine the angle of incidence ($i$):",
    "options": [
      "30°",
      "90°",
      "120°",
      "60°"
    ],
    "correctAnswer": "60°",
    "hint": "\\text{Angle of incidence } (i) = 90^\\circ - \\text{Glancing angle} = 90^\\circ - 30^\\circ.",
    "workedSolution": "The normal is perpendicular to the mirror surface (90°). The angle of incidence is measured from the normal: i = 90° - 30° = 60°.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "In vertebrate neuroanatomy, the Central Nervous System (CNS) consists anatomically of the:",
    "options": [
      "Brain and the sensory auditory ears",
      "Spinal cord and the optic eyes",
      "Brain and the spinal cord",
      "Cranial nerves and peripheral motor nerves"
    ],
    "correctAnswer": "Brain and the spinal cord",
    "hint": "The central processing and integration center enclosed in the skull and vertebral canal.",
    "workedSolution": "The Central Nervous System (CNS) comprises the brain and the spinal cord, which integrate sensory inputs and coordinate motor responses.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "Which dietary macronutrient class is enzymatically broken down by proteases into absorbable amino acid monomers?",
    "options": [
      "Digestible carbohydrates",
      "Saturated fats and oils",
      "Dietary vitamins",
      "Proteins"
    ],
    "correctAnswer": "Proteins",
    "hint": "Enzymes like pepsin, trypsin, and peptidases break peptide bonds in these molecules.",
    "workedSolution": "Proteins are long polymer chains of amino acids linked by peptide bonds, which are hydrolyzed by proteases into free amino acids.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "What is the scientific term for the dark, inner central region of a shadow cast on a screen where all direct light rays from a light source are completely blocked?",
    "options": [
      "The umbra",
      "The penumbra (partial shadow)",
      "A partial solar eclipse",
      "The focal point"
    ],
    "correctAnswer": "The umbra",
    "hint": "The inner region of total darkness; penumbra is the outer region of partial shadow.",
    "workedSolution": "The umbra is the innermost, completely dark region of a shadow where all direct light from the source is obstructed. The outer, partially lit shadow is the penumbra.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "Which everyday physical observations demonstrate that molecules in gases move with much higher speeds than particles in liquids or solids?\nI. Fragrant perfume vapors fill an enclosed room within seconds of opening the bottle\nII. Particulate wood smoke spreads rapidly across a large open field during combustion\nIII. Storm winds blow rapidly prior to a heavy rain shower",
    "options": [
      "I only",
      "II only",
      "I and II only",
      "I, II and III"
    ],
    "correctAnswer": "I and II only",
    "hint": "Statements I and II illustrate molecular diffusion; statement III is bulk convection driven by air pressure differences.",
    "workedSolution": "Perfume vapor spreading and smoke dispersing illustrate molecular diffusion driven by the rapid, random thermal motion of gas molecules (I and II). Wind blowing is bulk atmospheric convection.",
    "points": 1
  }
];

export const SET_BECE_1992_SCIENCE_P2_QUESTIONS: Paper2Question[] = [
  {
    "questionNumber": "1",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) Define the physical term density of a substance.\n(ii) Describe step-by-step how the density of an irregularly shaped insoluble stone can be experimentally determined in a school laboratory.",
        "workedSolution": "(i) Definition of density:\nThe mass per unit volume of a physical substance (Density (ρ) = Mass (m) / Volume (V)), expressed in kg m⁻³ or g cm⁻³.\n\n(ii) Determination of stone density:\n1. Determine Mass: Place the clean, dry stone onto a laboratory beam balance or digital electronic balance and record its mass in grams (m).\n2. Determine Volume (Displacement Method):\n   • Pour water into a clean graduated measuring cylinder to a known level and record the initial volume reading (V₁) at the bottom of the meniscus.\n   • Tie a fine, thin thread around the irregular stone.\n   • Lower the stone gently and completely into the cylinder until fully submerged, ensuring no water splashes out and no air bubbles cling to it.\n   • Record the new elevated water level reading (V₂).\n3. Calculate Volume:\nV = V₂ - V₁\n4. Calculate Density:\nρ = m / (V₂ - V₁)",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "A storage packing crate with an internal volume of $1,000.0\\text{ m}^3$ is filled with dry river sand to the brim. If the bulk density of the sand is $2.0\\text{ kg m}^{-3}$, calculate the mass of the sand in the crate.",
        "workedSolution": "Formula:\n$$\\text{Mass } (m) = \\text{Density } (\\rho) \\times \\text{Volume } (V)$$\nSubstitute given values ($\\rho = 2.0\\text{ kg m}^{-3}$, $V = 1,000.0\\text{ m}^3$):\n$$m = 2.0\\text{ kg m}^{-3} \\times 1,000.0\\text{ m}^3 = 2,000.0\\text{ kg}$$\nAnswer: The mass of the sand in the crate is $$2,000.0\\text{ kg}$$.",
        "maxMarks": 4
      },
      {
        "subId": "(c)",
        "prompt": "Copy and complete the epidemiological table below relating causative parasites, diseases, and preventive health practices:\n\n| Parasite | Clinical Disease Caused | Preventive Health Measure |\n| :--- | :--- | :--- |\n| *Vibrio cholerae* | Cholera | Eating hot, freshly cooked food / drinking treated water |\n| *Plasmodium* | **(i)** | **(ii)** |\n| Head / Body Louse | **(iii)** | Practicing personal hygiene / regular laundering |\n| **(iv)** | Ringworm (Tinea) | **(v)** |",
        "workedSolution": "Completed Table:\n• (i) Disease: **Malaria**\n• (ii) Prevention: **Sleeping under insecticide-treated bed nets (ITNs) / draining stagnant water around dwellings**\n• (iii) Disease: **Pediculosis (Louse infestation / Relapsing fever / Epidemic typhus)**\n• (iv) Parasite: **Parasitic Fungus (Dermatophyte, e.g., *Trichophyton* / *Microsporum*)**\n• (v) Prevention: **Regular bathing with soap / avoiding sharing personal towels, clothing, and combs**",
        "maxMarks": 5
      },
      {
        "subId": "(d)",
        "prompt": "Name the appropriate laboratory separation method that could be used to separate each of the following mixtures into their pure components:\n(i) A miscible liquid mixture of ethanol (alcohol) and water;\n(ii) An aqueous solution of common table salt and water;\n(iii) A dry heterogeneous powder mixture of wood charcoal and iron filings;\n(iv) A suspension of insoluble powdered chalk and water.",
        "workedSolution": "Separation Methods:\n• (i) Ethanol and water: **Fractional distillation** (exploiting the difference in boiling points: ethanol boils at $78^\\circ\\text{C}$, water at $100^\\circ\\text{C}$).\n• (ii) Salt and water: **Simple distillation** (to collect pure water distillate and solid salt) or **evaporation to dryness** (to recover solid salt crystals).\n• (iii) Charcoal and iron filings: **Magnetic separation** (a magnet attracts ferromagnetic iron filings, leaving non-magnetic charcoal behind).\n• (iv) Powdered chalk and water: **Gravity filtration** (porous filter paper retains insoluble chalk residue while clear water drains through as filtrate).",
        "maxMarks": 5
      }
    ]
  },
  {
    "questionNumber": "2",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) What is the biological process by which autotrophic green plants manufacture organic food?\n(ii) State three essential environmental or chemical factors necessary for this process to take place.",
        "workedSolution": "(i) Process:\n**Photosynthesis** (the process by which green plants synthesize glucose from carbon dioxide and water using radiant solar energy captured by chlorophyll).\n\n(ii) Essential factors (any three):\n1. **Radiant Sunlight energy** (photons)\n2. **Chlorophyll pigment** in chloroplasts\n3. **Carbon dioxide gas** ($\\text{CO}_2$) absorbed via stomata\n4. **Liquid water** ($\\text{H}_2\\text{O}$) absorbed by root hairs\n5. **Optimum temperature** for photosynthetic enzymes",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "(i) Mention a mechanical simple machine that enables a loading crew to roll a heavy barrel onto a cargo truck with minimal effort force.\n(ii) Name four practical examples of mechanical simple levers used in everyday domestic life.\n(iii) Draw a clear diagram of a first-class mechanical lever, clearly labelling the positions of the Fulcrum (Pivot), Effort, and Load:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 170' width='100%' height='155' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><polygon points='180,95 155,140 205,140' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/><circle cx='180' cy='95' r='3.5' fill='#ffffff'/><text x='180' y='155' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Pivot (Fulcrum)</text><rect x='40' y='90' width='280' height='10' rx='2' fill='#475569' stroke='#cbd5e1' stroke-width='1.5'/><line x1='60' y1='45' x2='60' y2='90' stroke='#10b981' stroke-width='2.5'/><polygon points='56,82 60,92 64,82' fill='#10b981'/><text x='60' y='35' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>Effort (E)</text><rect x='270' y='65' width='30' height='25' fill='#1e293b' stroke='#ef4444' stroke-width='1.8'/><text x='285' y='82' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>Load</text><line x1='285' y1='90' x2='285' y2='130' stroke='#ef4444' stroke-width='2.5'/><polygon points='281,122 285,132 289,122' fill='#ef4444'/><text x='285' y='145' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>Load (L)</text><text x='180' y='165' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>FIRST CLASS LEVER: FULCRUM IS LOCATED BETWEEN EFFORT AND LOAD</text></svg></div>",
        "workedSolution": "(i) Simple machine:\nAn **inclined plane** (sloped wooden loading ramp or metal skid).\n\n(ii) Four examples of simple levers:\n1. Crowbar\n2. Pair of scissors\n3. Builder's wheelbarrow\n4. Bottle opener\n5. Pair of forceps / tweezers\n6. Nutcracker\n\n(iii) Diagram Description (refer to vector schematic):\n• A rigid horizontal beam supported on a triangular fulcrum (pivot).\n• The fulcrum is located between the applied effort force and the load resistance.\n• The effort arrow points downward at one end, and the load resistance acts at the opposite end.",
        "maxMarks": 8
      },
      {
        "subId": "(c)",
        "prompt": "(i) Describe the laboratory preparation of ammonia gas using solid ammonium chloride and an alkali (calcium hydroxide).\n(ii) Write a balanced chemical equation for this reaction.",
        "workedSolution": "(i) Laboratory preparation of ammonia gas:\n1. Mix dry solid ammonium chloride [$\\text{NH}_4\\text{Cl}$] with dry calcium hydroxide [slaked lime, $\\text{Ca(OH)}_2$] in a mortar and transfer the mixture into a hard glass round-bottom flask.\n2. Clamp the flask slanting downwards to prevent condensed water droplets from running back onto hot glass and cracking it.\n3. Heat the mixture gently over a Bunsen flame.\n4. Pass the evolved alkaline ammonia gas through a drying tower containing calcium oxide (quicklime, $\\text{CaO}$); concentrated $\\text{H}_2\\text{SO}_4$ cannot be used because it reacts with ammonia.\n5. Collect the dry ammonia gas by downward displacement of air (upward delivery) because ammonia is less dense than air.\n\n(ii) Balanced chemical equation:\n$$\\text{Ca(OH)}_{2(s)} + 2\\text{NH}_4\\text{Cl}_{(s)} \\xrightarrow{\\Delta} \\text{CaCl}_{2(s)} + 2\\text{H}_2\\text{O}_{(l)} + 2\\text{NH}_{3(g)}\\uparrow$$",
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
        "prompt": "A representative sample of garden soil is placed in a glass cylinder containing water, shaken vigorously, and allowed to stand undisturbed for several hours. Draw a diagram of the sedimentation cylinder and clearly label the stratified layers formed:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 240' width='100%' height='220' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(80, 15)'><path d='M 10 10 L 10 185 Q 10 200 50 200 Q 90 200 90 185 L 90 10' fill='none' stroke='#38bdf8' stroke-width='2'/><polygon points='0,205 100,205 90,200 10,200' fill='#334155' stroke='#38bdf8' stroke-width='1.5'/><text x='50' y='0' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Sedimentation Cylinder</text><rect x='11' y='25' width='78' height='20' fill='#78350f' opacity='0.7'/><circle cx='30' cy='35' r='1.5' fill='#fef08a'/><circle cx='55' cy='32' r='2' fill='#fef08a'/><circle cx='70' cy='37' r='1.5' fill='#fef08a'/><line x1='90' y1='35' x2='130' y2='35' stroke='#f59e0b' stroke-width='1.5'/><text x='136' y='39' font-size='11' font-weight='bold' fill='#f59e0b'>Humus (Organic)</text><rect x='11' y='45' width='78' height='35' fill='#0284c7' opacity='0.3'/><line x1='90' y1='62' x2='130' y2='62' stroke='#38bdf8' stroke-width='1.5'/><text x='136' y='66' font-size='11' font-weight='bold' fill='#38bdf8'>Clay (Water)</text><rect x='11' y='80' width='78' height='30' fill='#a16207' opacity='0.5'/><line x1='90' y1='95' x2='130' y2='95' stroke='#ca8a04' stroke-width='1.5'/><text x='136' y='99' font-size='11' font-weight='bold' fill='#ca8a04'>Silt</text><rect x='11' y='110' width='78' height='40' fill='#d97706' opacity='0.7'/><circle cx='30' cy='125' r='1.5' fill='#ffffff'/><circle cx='50' cy='135' r='1.5' fill='#ffffff'/><circle cx='70' cy='128' r='1.5' fill='#ffffff'/><line x1='90' y1='130' x2='130' y2='130' stroke='#d97706' stroke-width='1.5'/><text x='136' y='134' font-size='11' font-weight='bold' fill='#d97706'>Sand</text><rect x='11' y='150' width='78' height='38' rx='4' fill='#475569' opacity='0.9'/><polygon points='25,160 32,155 35,166 22,168' fill='#94a3b8'/><polygon points='55,162 65,158 62,172 48,170' fill='#94a3b8'/><line x1='90' y1='168' x2='130' y2='168' stroke='#94a3b8' stroke-width='1.5'/><text x='136' y='172' font-size='11' font-weight='bold' fill='#94a3b8'>Gravel / Stones</text></g><text x='170' y='230' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>SOIL STRATIFICATION ACCORDING TO PARTICLE SIZE AND DENSITY</text></svg></div>",
        "workedSolution": "Stratified Layers (from top to bottom; refer to vector diagram):\n1. **Humus / Organic Matter:** Decayed low-density plant and animal residues floating on the water surface.\n2. **Clay / Turbid Water:** Very fine suspended clay mineral particles in water.\n3. **Silt Layer:** Fine mineral particles settling just below the clay.\n4. **Sand Layer:** Coarse, gritty mineral grains settling in the lower middle section.\n5. **Gravel / Pebbles:** Heavy, dense stone fragments that settle immediately to the bottom of the cylinder.",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "(i) Name four fundamental types of physical forces in science.\n(ii) A boy uses an elastic rubber catapult (slingshot) to harvest a ripe mango hanging high on a tree. State two physical forces involved in this activity.\n(iii) State the exact points of application for each force identified in (b)(ii).",
        "workedSolution": "(i) Four types of physical forces:\n1. Gravitational force\n2. Electrostatic force\n3. Magnetic force\n4. Frictional force\n5. Elastic (restoring) / Tensional force\n\n(ii) Two forces in the catapult activity:\n1. **Muscular Force:** Exerted by the boy's fingers pulling back the rubber pouch.\n2. **Elastic Restoring Force:** Developed in the stretched rubber bands pulling the stone forward upon release.\n3. **Gravitational Force:** Acts downward on the mango and falling stone.\n\n(iii) Points of application:\n• Muscular force: Applied at the leather pouch of the catapult by the boy's hand.\n• Elastic force: Applied by the tensioned rubber strips onto the stone projectile.\n• Gravitational force: Acts at the center of mass of the stone and mango toward the center of the Earth.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "Describe a laboratory experiment to demonstrate that a change in thermal heat energy occurs when a new chemical substance is formed (exothermic chemical reaction).",
        "workedSolution": "Experiment demonstrating thermal energy change:\n1. Apparatus: A glass beaker, a calibrated mercury thermometer (0–100°C), distilled water, and solid anhydrous sodium hydroxide pellets ($\\text{NaOH}$) [or dilute hydrochloric acid and sodium hydroxide].\n2. Procedure:\n   • Pour $50.0\\text{ cm}^3$ of distilled water into the glass beaker.\n   • Insert the thermometer and record the initial water temperature ($T_1 \\approx 25^\\circ\\text{C}$).\n   • Add approximately $5.0\\text{ g}$ of solid sodium hydroxide pellets to the water and stir gently with a glass rod until completely dissolved.\n   • Observe and record the highest temperature reached on the thermometer ($T_2 \\approx 45^\\circ\\text{C}$).\n3. Observation: The thermometer reading rises significantly ($T_2 > T_1$), and the beaker feels warm to the touch.\n4. Conclusion: Dissolving and chemical hydration of sodium hydroxide releases heat into the surroundings ($\\Delta H < 0$), demonstrating that thermal energy changes accompany chemical transformations (exothermic reaction).",
        "maxMarks": 7
      }
    ]
  },
  {
    "questionNumber": "4",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) Mention the three classical physical states of matter.\n(ii) State the two thermodynamic methods by which one physical state of matter can be converted into another.",
        "workedSolution": "(i) Three states of matter:\n1. **Solid**\n2. **Liquid**\n3. **Gas** (or Vapor)\n\n(ii) Two methods of interconversion:\n1. **Changing Temperature (Heating or Cooling):** Heating supplies thermal energy to overcome intermolecular bonds (melting, vaporization, sublimation); cooling removes thermal energy, allowing attractive forces to bind particles (condensation, freezing).\n2. **Changing Pressure:** Applying external pressure compresses widely spaced gas particles closer together into liquids (liquefaction of gases), while lowering pressure facilitates boiling or evaporation.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "A heavy bag of cement is dragged across a smooth horizontal floor by an applied horizontal force of $1,000.0\\text{ N}$. If the total mechanical work done in moving the bag is $100,000.0\\text{ J}$, calculate the linear displacement distance through which the bag was moved.",
        "workedSolution": "Formula:\n$$\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (d)$$\nRearrange for distance ($d$):\n$$d = \\frac{W}{F}$$\nSubstitute given values ($W = 100,000.0\\text{ J}$, $F = 1,000.0\\text{ N}$):\n$$d = \\frac{100,000.0\\text{ J}}{1,000.0\\text{ N}} = 100.0\\text{ meters (m)}$$\nAnswer: The bag was pulled through a distance of $$100.0\\text{ m}$$.",
        "maxMarks": 4
      },
      {
        "subId": "(c)",
        "prompt": "(i) Draw a lateral view of a bony fish (teleost) and label six external anatomical structures:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><path d='M 50 100 C 90 50 240 50 280 100 C 240 150 90 150 50 100 Z' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/><polygon points='280,100 330,60 310,100 330,140' fill='#0284c7' opacity='0.6' stroke='#38bdf8' stroke-width='1.5'/><text x='340' y='105' font-size='10' font-weight='bold' fill='#38bdf8'>Caudal fin</text><polygon points='150,60 210,35 230,60' fill='#0284c7' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/><text x='180' y='28' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Dorsal fin</text><circle cx='80' cy='90' r='5' fill='#facc15' stroke='#ca8a04'/><circle cx='81' cy='90' r='2' fill='#0f172a'/><path d='M 45 100 L 60 102' stroke='#38bdf8' stroke-width='2'/><text x='35' y='104' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='end'>Mouth</text><path d='M 115 75 Q 125 100 115 125' fill='none' stroke='#f59e0b' stroke-width='2.5'/><text x='125' y='68' font-size='10' font-weight='bold' fill='#f59e0b'>Operculum</text><polygon points='130,105 160,110 145,125' fill='#0284c7' opacity='0.6' stroke='#38bdf8' stroke-width='1.2'/><text x='150' y='138' font-size='9' font-weight='bold' fill='#38bdf8'>Pectoral</text><polygon points='165,138 185,155 175,138' fill='#0284c7' opacity='0.6' stroke='#38bdf8' stroke-width='1.2'/><text x='170' y='170' font-size='9' font-weight='bold' fill='#38bdf8'>Pelvic</text><polygon points='230,135 255,155 250,135' fill='#0284c7' opacity='0.6' stroke='#38bdf8' stroke-width='1.2'/><text x='250' y='170' font-size='9' font-weight='bold' fill='#38bdf8'>Anal</text><path d='M 125 100 Q 200 96 280 100' fill='none' stroke='#fde047' stroke-width='1.2' stroke-dasharray='3,2'/><text x='200' y='88' font-size='9' font-weight='bold' fill='#fde047' text-anchor='middle'>Lateral line</text><text x='190' y='190' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>BONY FISH MORPHOLOGY: ADAPTED FOR AQUATIC PROPULSION AND GAS EXCHANGE</text></svg></div>\n\n(ii) Explain the biological mechanism by which a teleost bony fish extracts dissolved oxygen gas from water.\n(iii) For each of the following animals, state two morphological adaptations that enable it to live successfully in its habitat:\n  (α) A flying bird;\n  (β) A swimming fish.",
        "workedSolution": "(i) Lateral Diagram of Bony Fish (refer to vector schematic):\nLabels: Operculum (gill cover), Mouth, Eye, Pectoral fin, Pelvic fin, Dorsal fin, Anal fin, Caudal fin, Lateral line.\n\n(ii) Respiratory Mechanism in Fish:\n1. Inspiration: The fish opens its mouth and expands its buccal cavity while keeping opercular flaps closed; water rushes into the mouth due to lower internal pressure.\n2. Expiration & Gas Exchange: The fish closes its mouth, raises the floor of its buccal cavity, and opens opercular valves. Water is forced across vascularized gill filaments.\n3. Diffusion: Dissolved oxygen diffuses across thin gill capillary walls into blood (bound to hemoglobin), while metabolic carbon dioxide diffuses out into expelled water.\n\n(iii) Morphological Adaptations:\n• (α) Flying Bird (Aves):\n  1. Streamlined aerodynamic body contour covered with lightweight feathers to reduce air resistance.\n  2. Forelimbs modified into wings for aerodynamic lift.\n  3. Hollow (pneumatic) bones that reduce body weight for flight.\n  4. Powerful pectoral flight muscles anchored to an enlarged breastbone keel.\n\n• (β) Swimming Fish (Pisces):\n  1. Streamlined fusiform body shape that minimizes water drag resistance.\n  2. Muscular fins (caudal fin for propulsion; dorsal, anal, pelvic, and pectoral fins for steering and stability).\n  3. Mucus-coated overlapping scales that reduce skin friction in water.\n  4. Swim bladder for regulating buoyancy at varying water depths.",
        "maxMarks": 11
      }
    ]
  }
];

export const SET_BECE_1992_SCIENCE_P1 = {
  id: "paper_1992_variant_p1",
  year: 1992,
  setNumber: 124,
  paperType: 1,
  subject: "Integrated Science",
  title: "1992 BECE Integrated Science Paper 1 (Objective Test)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: SET_BECE_1992_SCIENCE_P1_QUESTIONS
};

export const SET_BECE_1992_SCIENCE_P2 = {
  id: "paper_1992_variant_p2",
  year: 1992,
  setNumber: 124,
  paperType: 2,
  subject: "Integrated Science",
  title: "1992 BECE Integrated Science Paper 2 (Theory & Practical Essay)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 75,
  instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 4,
  questions: SET_BECE_1992_SCIENCE_P2_QUESTIONS
};

export const SET_BECE_1992_SCIENCE_COMPLETE = {
  year: 1992,
  isVariant: true,
  setNumber: 124,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: SET_BECE_1992_SCIENCE_P1,
  paper2: SET_BECE_1992_SCIENCE_P2,
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 3,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
