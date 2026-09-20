/**
 * WAEC BECE Integrated Science
 * Paper 1: Objective Examination (Set 94 Variant - 2011)
 *
 * Structure:
 * - 40 Multiple-choice Questions
 * - Balanced answer distribution: 10 A, 10 B, 10 C, 10 D (0% skew)
 * Total Marks: 40 | Time Allowed: 45 minutes
 *
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
 */

import { CurriculumQuestionSet } from '../global-curriculum-types';

// 1. Vector SVG for Q10: Angiosperm Stamen Anatomy (Anther and Filament)
export const svgQ10StamenAnatomy = `<div class="my-4 flex justify-center"><svg viewBox='0 0 280 170' width='100%' height='150' style='max-width: 360px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Slender Filament Stem --><path d='M 140 145 Q 130 90 140 45' fill='none' stroke='#22c55e' stroke-width='3.5'/><line x1='135' y1='100' x2='60' y2='100' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='104' font-size='10' font-weight='bold' fill='#22c55e' text-anchor='end'>Filament</text><!-- Bilobed Pollen Anther at Tip --><g transform='translate(140, 45)'><ellipse cx='-8' cy='-6' rx='9' ry='14' fill='#f59e0b' stroke='#d97706' stroke-width='1.5'/><ellipse cx='8' cy='-6' rx='9' ry='14' fill='#f59e0b' stroke='#d97706' stroke-width='1.5'/><!-- Pollen grains --><circle cx='-8' cy='-6' r='1.5' fill='#ffffff'/><circle cx='8' cy='-6' r='1.5' fill='#ffffff'/></g><line x1='155' y1='38' x2='220' y2='38' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='225' y='42' font-size='10' font-weight='bold' fill='#f59e0b'>Anther (Pollen)</text><!-- Floral Base Receptacle --><ellipse cx='140' cy='150' rx='25' ry='8' fill='#15803d'/><text x='140' y='162' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>MALE STAMEN = ANTHER + FILAMENT</text></svg></div>`;

// 2. Vector SVG for Q40: Hierarchy of Biological Organization
export const svgQ40BiologicalHierarchy = `<div class="my-4 flex justify-center"><svg viewBox='0 0 360 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Level 1: Cell --><rect x='15' y='45' width='60' height='40' rx='4' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='45' y='68' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cells</text><!-- Arrow 1 --><line x1='80' y1='65' x2='98' y2='65' stroke='#94a3b8' stroke-width='2'/><polygon points='96,61 104,65 96,69' fill='#94a3b8'/><!-- Level 2: Tissue --><rect x='105' y='45' width='60' height='40' rx='4' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/><text x='135' y='68' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>Tissues</text><!-- Arrow 2 --><line x1='170' y1='65' x2='188' y2='65' stroke='#94a3b8' stroke-width='2'/><polygon points='186,61 194,65 186,69' fill='#94a3b8'/><!-- Level 3: Organ --><rect x='195' y='45' width='60' height='40' rx='4' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='225' y='68' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Organs</text><!-- Arrow 3 --><line x1='260' y1='65' x2='278' y2='65' stroke='#94a3b8' stroke-width='2'/><polygon points='276,61 284,65 276,69' fill='#94a3b8'/><!-- Level 4: System --><rect x='285' y='45' width='60' height='40' rx='4' fill='#1e293b' stroke='#ec4899' stroke-width='1.5'/><text x='315' y='68' font-size='11' font-weight='bold' fill='#ec4899' text-anchor='middle'>Systems</text><text x='180' y='115' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>INCREASING COMPLEXITY OF LIVING STRUCTURES</text></svg></div>`;

export const SET_BECE_2011_SCIENCE_P1: CurriculumQuestionSet = {
  id: "paper_2011_variant",
  title: "2011 BECE Integrated Science Paper 1 (Set 94 Objective)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2011 BECE Integrated Science Standardized CBT",
  variantType: "past_paper_variant",
  year: 2011,
  paperType: 1,
  setNumber: 94,
  era: "classic",
  totalQuestions: 40,
  version: 1,
  format: "multiple_choice",
  durationMinutes: 45,
  instructions: "Answer all forty questions by selecting the correct option (A, B, C, or D). Each question carries 1 mark.",
  questions: [
  {
    "id": "q01",
    "number": 1,
    "format": "multiple_choice",
    "prompt": "Which of the following chemical elements belongs to Group 18 of the Periodic Table and is classified as an inert noble gas?",
    "options": [
      "Diatomic chlorine [Cl₂]",
      "Neon [Ne]",
      "Diatomic nitrogen [N₂]",
      "Diatomic oxygen [O₂]"
    ],
    "correctAnswer": "Neon [Ne]",
    "hint": "Possesses a stable, fully filled outermost shell of valence electrons.",
    "workedSolution": "Neon is a noble gas located in Group 18 with a complete octet ($2, 8$), making it chemically unreactive.",
    "points": 1
  },
  {
    "id": "q02",
    "number": 2,
    "format": "multiple_choice",
    "prompt": "In the human male reproductive anatomy, which convoluted ductal structure stores spermatozoa temporarily while they undergo physiological maturation?",
    "options": [
      "The scrotal sac",
      "The vas deferens",
      "The seminal vesicles",
      "The epididymis"
    ],
    "correctAnswer": "The epididymis",
    "hint": "A tightly coiled cord-like structure resting along the posterior border of each testis.",
    "workedSolution": "Spermatozoa produced in the seminiferous tubules pass into the epididymis for temporary storage, concentration, and functional maturation.",
    "points": 1
  },
  {
    "id": "q03",
    "number": 3,
    "format": "multiple_choice",
    "prompt": "Which physical property makes tinted ethanol alcohol particularly suitable as a thermometric liquid in meteorological minimum thermometers?",
    "options": [
      "It does not wet the internal glass capillary walls",
      "It possesses an opaque, reflective metallic luster",
      "It has an exceptionally low freezing point (-114°C)",
      "It has an extremely high boiling point above 400°C"
    ],
    "correctAnswer": "It has an exceptionally low freezing point (-114°C)",
    "hint": "Mercury freezes at $-39^\\circ\\text{C}$, but alcohol remains fluid down past $-110^\\circ\\text{C}$.",
    "workedSolution": "Ethanol freezes at $-114^\\circ\\text{C}$, enabling it to measure extremely low winter and sub-zero temperatures where mercury would solidify.",
    "points": 1
  },
  {
    "id": "q04",
    "number": 4,
    "format": "multiple_choice",
    "prompt": "In which agro-ecological vegetation zone of Ghana do drought-tolerant cereal crops like guinea corn (sorghum) and pearl millet thrive best?",
    "options": [
      "The semi-deciduous forest zone",
      "The Guinea and Sudan savanna zones",
      "The wet high rainforest zone",
      "The coastal mangrove swamps"
    ],
    "correctAnswer": "The Guinea and Sudan savanna zones",
    "hint": "Characterized by an open grassland biome with a distinct, short single rainy season.",
    "workedSolution": "Sorghum and millet possess extensive root systems and C4 photosynthetic pathways suited for the hot, semi-arid conditions of the northern savannas.",
    "points": 1
  },
  {
    "id": "q05",
    "number": 5,
    "format": "multiple_choice",
    "prompt": "Which of the following traditional and industrial methods are utilized for preserving harvested fish from microbial spoilage?",
    "options": [
      "Thermal canning only",
      "Thermal canning, deep frying, and wood-smoke dehydration",
      "Deep frying and cold water soaking only",
      "Wood smoking and cold water dilution only"
    ],
    "correctAnswer": "Thermal canning, deep frying, and wood-smoke dehydration",
    "hint": "Includes thermal sterilization as well as methods that reduce moisture content and deposit antimicrobial phenols.",
    "workedSolution": "Fish preservation prevents bacterial decay via moisture removal (smoking, frying) and hermetic heat sterilization (commercial canning).",
    "points": 1
  },
  {
    "id": "q06",
    "number": 6,
    "format": "multiple_choice",
    "prompt": "Which domestic hygiene practice in the home is effective in preventing the spread of water- and food-borne bacterial infections?",
    "options": [
      "Keeping prepared meals tightly covered against insect vectors",
      "Drinking untreated surface river runoff",
      "Sharing bath sponges and damp personal towels",
      "Disposing of refuse in open, stagnant gutter pools"
    ],
    "correctAnswer": "Keeping prepared meals tightly covered against insect vectors",
    "hint": "Prevents domestic houseflies and cockroaches from depositing pathogens on food.",
    "workedSolution": "Covering food prevents mechanical vectors like houseflies (*Musca domestica*) from transferring *Vibrio cholerae* and *Salmonella* onto meals.",
    "points": 1
  },
  {
    "id": "q07",
    "number": 7,
    "format": "multiple_choice",
    "prompt": "Which of the following chemical elements is classified as a semi-metal (metalloid) exhibiting properties intermediate between metals and non-metals?",
    "options": [
      "Calcium [Ca]",
      "Lithium [Li]",
      "Silicon [Si]",
      "Sodium [Na]"
    ],
    "correctAnswer": "Silicon [Si]",
    "hint": "Located along the staircase boundary of the Periodic Table; crucial for semiconductor microchips.",
    "workedSolution": "Silicon (Si) is a metalloid with intermediate electrical conductivity that increases with temperature, unlike metallic conductors.",
    "points": 1
  },
  {
    "id": "q08",
    "number": 8,
    "format": "multiple_choice",
    "prompt": "What primary energy transformation takes place in a functional direct-current electric motor?",
    "options": [
      "Electrical energy is converted into mechanical kinetic energy",
      "Chemical energy is converted into electrical energy",
      "Electrical energy is converted directly into nuclear energy",
      "Mechanical kinetic energy is converted into chemical energy"
    ],
    "correctAnswer": "Electrical energy is converted into mechanical kinetic energy",
    "hint": "Electric current interacting with a magnetic field produces rotary mechanical torque.",
    "workedSolution": "An electric motor uses magnetic Lorentz forces on current-carrying coils to convert electrical power into rotary mechanical motion.",
    "points": 1
  },
  {
    "id": "q09",
    "number": 9,
    "format": "multiple_choice",
    "prompt": "In commercial livestock husbandry, Landrace is a well-known exotic breed of:",
    "options": [
      "Dairy cattle",
      "Meat goats",
      "Pigs (swine)",
      "Mutton sheep"
    ],
    "correctAnswer": "Pigs (swine)",
    "hint": "A long-bodied, white-coated breed of swine with drooping ears, bred for bacon.",
    "workedSolution": "The Landrace is a long-bodied, white swine breed known for high prolificacy, maternal ability, and lean bacon carcasses.",
    "points": 1
  },
  {
    "id": "q10",
    "number": 10,
    "format": "multiple_choice",
    "prompt": "In an angiosperm flower, what anatomical parts collectively constitute the male stamen?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 280 170' width='100%' height='150' style='max-width: 360px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Slender Filament Stem --><path d='M 140 145 Q 130 90 140 45' fill='none' stroke='#22c55e' stroke-width='3.5'/><line x1='135' y1='100' x2='60' y2='100' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='104' font-size='10' font-weight='bold' fill='#22c55e' text-anchor='end'>Filament</text><!-- Bilobed Pollen Anther at Tip --><g transform='translate(140, 45)'><ellipse cx='-8' cy='-6' rx='9' ry='14' fill='#f59e0b' stroke='#d97706' stroke-width='1.5'/><ellipse cx='8' cy='-6' rx='9' ry='14' fill='#f59e0b' stroke='#d97706' stroke-width='1.5'/><!-- Pollen grains --><circle cx='-8' cy='-6' r='1.5' fill='#ffffff'/><circle cx='8' cy='-6' r='1.5' fill='#ffffff'/></g><line x1='155' y1='38' x2='220' y2='38' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='225' y='42' font-size='10' font-weight='bold' fill='#f59e0b'>Anther (Pollen)</text><!-- Floral Base Receptacle --><ellipse cx='140' cy='150' rx='25' ry='8' fill='#15803d'/><text x='140' y='162' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>MALE STAMEN = ANTHER + FILAMENT</text></svg></div>",
    "options": [
      "The receptive stigma and the style",
      "The basal ovary and the ovules",
      "The petal corolla and the sepal calyx",
      "The pollen-producing anther and the supporting filament"
    ],
    "correctAnswer": "The pollen-producing anther and the supporting filament",
    "hint": "The male organ consists of a stalk bearing pollen sacs at its tip.",
    "workedSolution": "The male stamen consists of the filament (a slender stalk) and the anther (terminal bilobed sacs where pollen grains mature).",
    "points": 1
  },
  {
    "id": "q11",
    "number": 11,
    "format": "multiple_choice",
    "prompt": "Which statement correctly describes an important functional property of a bipolar junction transistor?",
    "options": [
      "It can be operated as an active linear amplifier of electric current",
      "It consists of exactly two metallic terminal leads only",
      "It is constructed by joining three discrete p-n diodes in parallel",
      "It contains three internal p-n semiconductor depletion junctions"
    ],
    "correctAnswer": "It can be operated as an active linear amplifier of electric current",
    "hint": "A small base current modulates and amplifies a larger collector-emitter current.",
    "workedSolution": "A bipolar junction transistor contains two p-n junctions and three leads (E, B, C), functioning as a current-controlled signal amplifier.",
    "points": 1
  },
  {
    "id": "q12",
    "number": 12,
    "format": "multiple_choice",
    "prompt": "An atom of an element possesses 6 protons and 7 neutrons within its nucleus. What is its atomic mass number?",
    "options": [
      "1",
      "6",
      "13",
      "7"
    ],
    "correctAnswer": "13",
    "hint": "$$\\text{Mass Number } (A) = \\text{Protons } (Z) + \\text{Neutrons } (N) = 6 + 7$$.",
    "workedSolution": "Mass number is the total number of nucleons: $A = 6 + 7 = 13$ (corresponding to the Carbon-13 isotope).",
    "points": 1
  },
  {
    "id": "q13",
    "number": 13,
    "format": "multiple_choice",
    "prompt": "In farm record keeping, a chronological logbook recording all day-to-day operations, weather events, and field observations is termed a:",
    "options": [
      "Labour muster roll",
      "Farm diary",
      "Capital inventory record",
      "Profit and loss ledger"
    ],
    "correctAnswer": "Farm diary",
    "hint": "A daily record of farm activities, planting dates, and weather conditions.",
    "workedSolution": "A farm diary is a chronological journal where daily activities, inputs applied, rainfall events, and general occurrences are recorded.",
    "points": 1
  },
  {
    "id": "q14",
    "number": 14,
    "format": "multiple_choice",
    "prompt": "Which of the following mechanical and medical devices operate on the principle of uniform transmission of pressure in fluids (Pascal's Principle)?",
    "options": [
      "Medical syringes only",
      "Reciprocating water lift pumps only",
      "Mechanical lever crowbars only",
      "Hydraulic car lifts, medical syringes, and hydraulic bicycle brakes"
    ],
    "correctAnswer": "Hydraulic car lifts, medical syringes, and hydraulic bicycle brakes",
    "hint": "Pressure exerted anywhere in a confined incompressible fluid is transmitted equally in all directions.",
    "workedSolution": "Hydraulic brakes, syringes, and fluid pumps utilize Pascal's principle: enclosed fluid pressure is transmitted undiminished throughout the system.",
    "points": 1
  },
  {
    "id": "q15",
    "number": 15,
    "format": "multiple_choice",
    "prompt": "Which of the following agricultural crops is INCORRECTLY matched with its primary agronomic classification?",
    "options": [
      "Cowpea — Cereal grain crop",
      "Cocoa — Stimulant beverage crop",
      "Coconut — Vegetable oil crop",
      "Cocoyam — Root and tuber crop"
    ],
    "correctAnswer": "Cowpea — Cereal grain crop",
    "hint": "Cereals are grasses (maize, rice, wheat); cowpea is a leguminous pulse.",
    "workedSolution": "Cowpea (*Vigna unguiculata*) is a leguminous pulse (grain legume), not a cereal crop (Gramineae).",
    "points": 1
  },
  {
    "id": "q16",
    "number": 16,
    "format": "multiple_choice",
    "prompt": "Which of the following chemical substances is classified as a neutral chemical salt produced from acid-base neutralization?",
    "options": [
      "Sulfuric acid [H₂SO₄]",
      "Calcium chloride [CaCl₂]",
      "Sodium hydroxide [NaOH]",
      "Hydrochloric acid [HCl]"
    ],
    "correctAnswer": "Calcium chloride [CaCl₂]",
    "hint": "Formed when an acid reacts with a metal base; contains metal cations and non-metal anions.",
    "workedSolution": "$\\text{CaCl}_2$ is an ionic salt formed from hydrochloric acid and calcium base, whereas $\\text{HCl}$ and $\\text{H}_2\\text{SO}_4$ are acids, and $\\text{NaOH}$ is an alkali.",
    "points": 1
  },
  {
    "id": "q17",
    "number": 17,
    "format": "multiple_choice",
    "prompt": "In the specialized digestive anatomy of domestic poultry (fowl), where does mechanical crushing and grinding of tough grains occur?",
    "options": [
      "The crop reservoir",
      "The muscular gizzard (ventriculus)",
      "The tubular oesophagus",
      "The glandular proventriculus"
    ],
    "correctAnswer": "The muscular gizzard (ventriculus)",
    "hint": "Contains a tough keratin lining and swallowed grit stones that crush hard feed.",
    "workedSolution": "The gizzard possesses thick muscular walls and ingested pebbles/grit that mechanically pulverize whole grains and fibrous feed.",
    "points": 1
  },
  {
    "id": "q18",
    "number": 18,
    "format": "multiple_choice",
    "prompt": "Which pair of anatomical fins in a bony fish acts as hydroplanes to control diving, ascending, and depth levels in water?",
    "options": [
      "The paired pectoral and pelvic fins",
      "The dorsal fin and the anal fin",
      "The homocercal caudal tail fin only",
      "The dorsal fin and the caudal fin"
    ],
    "correctAnswer": "The paired pectoral and pelvic fins",
    "hint": "Paired lateral fins that control pitch and vertical movement through the water column.",
    "workedSolution": "Paired pectoral and pelvic fins act like aircraft ailerons, controlling pitch, braking, and vertical ascent and descent in water.",
    "points": 1
  },
  {
    "id": "q19",
    "number": 19,
    "format": "multiple_choice",
    "prompt": "In a qualitative biochemical food test, Millon's reagent turns brick-red upon gentle heating in the presence of:",
    "options": [
      "Soluble reducing sugars",
      "Dietary proteins",
      "Emulsified animal lipids",
      "Water-soluble vitamins"
    ],
    "correctAnswer": "Dietary proteins",
    "hint": "Detects phenolic groups present in amino acids like tyrosine within protein chains.",
    "workedSolution": "Millon's reagent reacts with phenolic tyrosine residues in proteins, yielding a white precipitate that turns brick-red on heating.",
    "points": 1
  },
  {
    "id": "q20",
    "number": 20,
    "format": "multiple_choice",
    "prompt": "In an NPN bipolar junction transistor circuit, connecting the n-type collector to the positive terminal of a DC battery ensures that the:",
    "options": [
      "Base-collector junction is forward-biased",
      "Base-emitter junction is reverse-biased",
      "Base-collector junction is reverse-biased",
      "Collector-emitter circuit conducts zero current"
    ],
    "correctAnswer": "Base-collector junction is reverse-biased",
    "hint": "In NPN configuration, applying positive voltage to n-type collector widens the collector-base depletion zone.",
    "workedSolution": "Applying a positive potential to an n-type semiconductor pulls electrons away from the junction, placing the collector-base junction in reverse bias.",
    "points": 1
  },
  {
    "id": "q21",
    "number": 21,
    "format": "multiple_choice",
    "prompt": "Which major ecological vegetation zone in Ghana is characterized by high year-round ambient temperatures and heavy annual rainfall?",
    "options": [
      "The dry coastal savanna",
      "The northern Sudan savanna",
      "The arid sand dunes",
      "The tropical moist rainforest zone"
    ],
    "correctAnswer": "The tropical moist rainforest zone",
    "hint": "Supports dense multi-layered evergreen tree canopies and luxuriant undergrowth.",
    "workedSolution": "The tropical rainforest biome features high temperatures ($>26^\\circ\\text{C}$) and heavy, well-distributed rainfall ($>1500\\text{ mm}$ per annum).",
    "points": 1
  },
  {
    "id": "q22",
    "number": 22,
    "format": "multiple_choice",
    "prompt": "During prolonged agricultural drought, why do field crops suffer severe wilting and leaf desiccation?",
    "options": [
      "High atmospheric temperatures and high vapor pressure deficit accelerate transpiration beyond root water uptake",
      "Excessive relative humidity saturates stomatal air cavities",
      "Soil capillary pores become waterlogged with stagnant water",
      "Photosynthetic enzymes synthesize excess water in chloroplasts"
    ],
    "correctAnswer": "High atmospheric temperatures and high vapor pressure deficit accelerate transpiration beyond root water uptake",
    "hint": "High heat and dry air pull moisture out of leaves faster than dry roots can absorb it.",
    "workedSolution": "Drought combines dry soil with high ambient heat, driving high transpiration from leaves that exceeds root water absorption, causing flaccidity and death.",
    "points": 1
  },
  {
    "id": "q23",
    "number": 23,
    "format": "multiple_choice",
    "prompt": "Which soil conservation practice is most effective in preventing water runoff and erosion on steep, sloping farmlands?",
    "options": [
      "Continuous clean weeding of all ground cover",
      "Constructing stepped horizontal terraces along the hill gradient",
      "Ploughing furrows straight down the slope gradient",
      "Annual burning of protective vegetative litter"
    ],
    "correctAnswer": "Constructing stepped horizontal terraces along the hill gradient",
    "hint": "Carves steep slopes into a series of stepped, flat benches that slow runoff water.",
    "workedSolution": "Terracing converts steep inclines into broad, flat steps, reducing runoff velocity and giving rainwater time to infiltrate the soil.",
    "points": 1
  },
  {
    "id": "q24",
    "number": 24,
    "format": "multiple_choice",
    "prompt": "In agricultural crop production, a viable seed is scientifically defined as one that:",
    "options": [
      "Has been roasted to eliminate all internal moisture",
      "Contains high concentrations of vegetable lipids",
      "Possesses a living embryo capable of germinating under favorable moisture and warmth",
      "Possesses an impenetrable, heavily lignified outer coat"
    ],
    "correctAnswer": "Possesses a living embryo capable of germinating under favorable moisture and warmth",
    "hint": "Viability denotes living metabolic capacity to sprout into a healthy seedling.",
    "workedSolution": "A seed is viable if its embryonic axis is metabolically alive and capable of germinating when provided with suitable water, oxygen, and warmth.",
    "points": 1
  },
  {
    "id": "q25",
    "number": 25,
    "format": "multiple_choice",
    "prompt": "Which pair of anatomical organs belongs to the human female reproductive tract?",
    "options": [
      "The male urethra and the uterus",
      "The urinary ureter and the uterus",
      "The cervix and the urinary bladder",
      "The cervix and the muscular uterus"
    ],
    "correctAnswer": "The cervix and the muscular uterus",
    "hint": "The lower neck of the womb and the hollow muscular organ where the fetus develops.",
    "workedSolution": "The uterus (womb) and cervix (uterine neck) are internal organs of the female reproductive tract; the ureter belongs to the urinary system.",
    "points": 1
  },
  {
    "id": "q26",
    "number": 26,
    "format": "multiple_choice",
    "prompt": "Which of the following chemical symbols represents an alkaline earth metallic element?",
    "options": [
      "Ne (Neon)",
      "P (Phosphorus)",
      "S (Sulfur)",
      "Ca (Calcium)"
    ],
    "correctAnswer": "Ca (Calcium)",
    "hint": "Located in Group 2 of the Periodic Table; forms $\\text{Ca}^{2+}$ cations.",
    "workedSolution": "Calcium (Ca) is a Group 2 reactive metal, while Neon is a noble gas, and Phosphorus and Sulfur are non-metals.",
    "points": 1
  },
  {
    "id": "q27",
    "number": 27,
    "format": "multiple_choice",
    "prompt": "In ecological science, the complete complex of biotic organisms and abiotic physical factors that surround and influence an organism is termed its:",
    "options": [
      "Isolated population",
      "Trophic guild",
      "Environment",
      "Biological species"
    ],
    "correctAnswer": "Environment",
    "hint": "Includes all external physical, chemical, and biological conditions affecting life.",
    "workedSolution": "An organism's environment consists of all external physical (abiotic: light, water, temperature) and living (biotic: predators, prey) surroundings.",
    "points": 1
  },
  {
    "id": "q28",
    "number": 28,
    "format": "multiple_choice",
    "prompt": "In a systematic 4-year crop rotation program, which crop should follow a heavy-feeding, deep-rooted tuber crop like cassava?",
    "options": [
      "White yam (another heavy tuber feeder)",
      "Water yam (a deep-rooted tuber)",
      "Cowpea (a nitrogen-fixing leguminous crop)",
      "Cassava again (continuous monoculture)"
    ],
    "correctAnswer": "Cowpea (a nitrogen-fixing leguminous crop)",
    "hint": "Legumes restore depleted soil nitrogen via symbiotic root nodule bacteria.",
    "workedSolution": "Cassava severely depletes soil nutrients; following it with a leguminous pulse like cowpea restores soil nitrogen through symbiotic fixation.",
    "points": 1
  },
  {
    "id": "q29",
    "number": 29,
    "format": "multiple_choice",
    "prompt": "Internal helminth parasites (endoparasites like tapeworms and liver flukes) in farm livestock are controlled by:",
    "options": [
      "Drenching with liquid anthelmintic medications",
      "Dipping animals in acaricide plunge baths",
      "Dusting hides externally with sulfur powder",
      "Spraying pens with synthetic pyrethroid mists"
    ],
    "correctAnswer": "Drenching with liquid anthelmintic medications",
    "hint": "Administering oral antiparasitic medication using a dosing gun.",
    "workedSolution": "Drenching delivers oral liquid anthelmintics into the digestive tract to expel internal parasitic helminths (endoparasites).",
    "points": 1
  },
  {
    "id": "q30",
    "number": 30,
    "format": "multiple_choice",
    "prompt": "Which modern domestic or industrial electronic device relies on millions of integrated microscopic transistors to process digital data?",
    "options": [
      "An electric immersion water heater",
      "Dynamic moving-coil microphone",
      "A digital electronic computer",
      "Domestic mechanical pendulum clock"
    ],
    "correctAnswer": "A digital electronic computer",
    "hint": "Microprocessors utilize dense integrated arrays of silicon transistors as logic gates.",
    "workedSolution": "Computers use microprocessors containing billions of nanoscale transistors functioning as high-speed electronic logic switches.",
    "points": 1
  },
  {
    "id": "q31",
    "number": 31,
    "format": "multiple_choice",
    "prompt": "In pedology, what diagnostic physical soil property is determined by rubbing a moist soil sample between the thumb and forefinger?",
    "options": [
      "Soil texture (relative proportions of sand, silt, and clay)",
      "Soil horizon depth",
      "Subsoil bulk density",
      "Soil moisture content"
    ],
    "correctAnswer": "Soil texture (relative proportions of sand, silt, and clay)",
    "hint": "Sand feels gritty, silt feels smooth and floury, and clay feels sticky and plastic.",
    "workedSolution": "The 'feel method' assesses soil texture based on the grittiness of sand, the silkiness of silt, and the stickiness of clay.",
    "points": 1
  },
  {
    "id": "q32",
    "number": 32,
    "format": "multiple_choice",
    "prompt": "Which modes of thermal heat transfer is a vacuum thermos flask engineered to minimize simultaneously?",
    "options": [
      "Conduction and convection only",
      "Convection and radiation only",
      "Conduction and radiation only",
      "Conduction, convection, and radiation"
    ],
    "correctAnswer": "Conduction, convection, and radiation",
    "hint": "Uses a vacuum, silvered reflective walls, and an insulated stopper.",
    "workedSolution": "A thermos flask minimizes conduction and convection via its evacuated vacuum space, and minimizes radiation via its mirrored reflective silver coating.",
    "points": 1
  },
  {
    "id": "q33",
    "number": 33,
    "format": "multiple_choice",
    "prompt": "An atom of magnesium is represented by the nuclide symbol ${}^{25}_{12}\\text{Mg}$. How many neutrons and protons reside within its nucleus?",
    "options": [
      "12 neutrons and 13 protons",
      "12 neutrons and 25 protons",
      "13 neutrons and 12 protons respectively",
      "25 neutrons and 12 protons"
    ],
    "correctAnswer": "13 neutrons and 12 protons respectively",
    "hint": "$$\\text{Protons} = Z = 12;\\quad \\text{Neutrons} = A - Z = 25 - 12$$.",
    "workedSolution": "Atomic number $Z = 12\\text{ protons}$. Neutron number $N = A - Z = 25 - 12 = 13\\text{ neutrons}$.",
    "points": 1
  },
  {
    "id": "q34",
    "number": 34,
    "format": "multiple_choice",
    "prompt": "Which meteorological weather instrument is utilized at weather stations to measure the velocity (speed) of atmospheric wind?",
    "options": [
      "A cup anemometer",
      "A rain gauge collector",
      "A wet-and-dry bulb hygrometer",
      "A Campbell-Stokes sunshine recorder"
    ],
    "correctAnswer": "A cup anemometer",
    "hint": "Consists of three or four hemispherical cups that rotate on a vertical axis in the wind.",
    "workedSolution": "An anemometer measures wind speed based on the rotational velocity of wind-driven cups mounted on a vertical spindle.",
    "points": 1
  },
  {
    "id": "q35",
    "number": 35,
    "format": "multiple_choice",
    "prompt": "Which of the following academic and professional disciplines are classified as applied sciences?",
    "options": [
      "Pure Theoretical Biology only",
      "Pure Chemistry and Physics only",
      "Astrophysics and Mathematics only",
      "Clinical Medicine and Agricultural Engineering"
    ],
    "correctAnswer": "Clinical Medicine and Agricultural Engineering",
    "hint": "Fields that apply fundamental scientific principles to solve practical human problems.",
    "workedSolution": "Applied sciences (Medicine, Agriculture, Engineering) utilize foundational biological and physical principles to produce practical technological solutions.",
    "points": 1
  },
  {
    "id": "q36",
    "number": 36,
    "format": "multiple_choice",
    "prompt": "In domestic small animal husbandry, the Chinchilla is a recognized breed of:",
    "options": [
      "Dairy goats",
      "Domestic rabbits",
      "Bacon pigs",
      "Mutton sheep"
    ],
    "correctAnswer": "Domestic rabbits",
    "hint": "A rabbit breed prized for its dense, silvery-grey fur resembling a wild rodent.",
    "workedSolution": "The Standard Chinchilla is a domestic rabbit breed developed for its fine, dense, silvery-grey coat and meat production.",
    "points": 1
  },
  {
    "id": "q37",
    "number": 37,
    "format": "multiple_choice",
    "prompt": "Which of the following human traits is an acquired characteristic resulting from environmental learning rather than genetic heredity?",
    "options": [
      "The anatomical shape of the nose",
      "The natural color of the eye iris",
      "The ABO blood group phenotype",
      "The language dialect and accent spoken by an individual"
    ],
    "correctAnswer": "The language dialect and accent spoken by an individual",
    "hint": "Morphological and biochemical traits are encoded in DNA, whereas languages are learned through culture.",
    "workedSolution": "Language and dialect are acquired cultural traits learned through social environmental exposure, whereas nose shape and blood groups are inherited genetically.",
    "points": 1
  },
  {
    "id": "q38",
    "number": 38,
    "format": "multiple_choice",
    "prompt": "Which class of dietary food nutrients is essential in trace quantities to maintain disease immunity and good health in farm animals?",
    "options": [
      "Pure energy-dense starches",
      "Concentrated dietary vegetable oils",
      "Bulk crude indigestible fiber",
      "Vitamins and trace mineral salts"
    ],
    "correctAnswer": "Vitamins and trace mineral salts",
    "hint": "Protective organic micronutrients that act as enzyme cofactors and immune enhancers.",
    "workedSolution": "Vitamins and trace minerals function as metabolic coenzymes and immune regulators that protect livestock from deficiency disorders.",
    "points": 1
  },
  {
    "id": "q39",
    "number": 39,
    "format": "multiple_choice",
    "prompt": "Developing and rearing livestock breeds genetically resistant to trypanosomiasis (such as N'Dama cattle) represents a:",
    "options": [
      "Chemical control method using organophosphates",
      "Biological method of pest and disease control",
      "Mechanical physical barrier control method",
      "Thermal pasture sterilization method"
    ],
    "correctAnswer": "Biological method of pest and disease control",
    "hint": "Utilizes natural genetic immunity in living organisms to withstand pests without chemical sprays.",
    "workedSolution": "Using genetically resistant livestock breeds is a biological control strategy that exploits natural hereditary resistance to parasites.",
    "points": 1
  },
  {
    "id": "q40",
    "number": 40,
    "format": "multiple_choice",
    "prompt": "Which sequence correctly displays the hierarchical order of increasing structural complexity in multicellular living organisms?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Level 1: Cell --><rect x='15' y='45' width='60' height='40' rx='4' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='45' y='68' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cells</text><!-- Arrow 1 --><line x1='80' y1='65' x2='98' y2='65' stroke='#94a3b8' stroke-width='2'/><polygon points='96,61 104,65 96,69' fill='#94a3b8'/><!-- Level 2: Tissue --><rect x='105' y='45' width='60' height='40' rx='4' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/><text x='135' y='68' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>Tissues</text><!-- Arrow 2 --><line x1='170' y1='65' x2='188' y2='65' stroke='#94a3b8' stroke-width='2'/><polygon points='186,61 194,65 186,69' fill='#94a3b8'/><!-- Level 3: Organ --><rect x='195' y='45' width='60' height='40' rx='4' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='225' y='68' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Organs</text><!-- Arrow 3 --><line x1='260' y1='65' x2='278' y2='65' stroke='#94a3b8' stroke-width='2'/><polygon points='276,61 284,65 276,69' fill='#94a3b8'/><!-- Level 4: System --><rect x='285' y='45' width='60' height='40' rx='4' fill='#1e293b' stroke='#ec4899' stroke-width='1.5'/><text x='315' y='68' font-size='11' font-weight='bold' fill='#ec4899' text-anchor='middle'>Systems</text><text x='180' y='115' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>INCREASING COMPLEXITY OF LIVING STRUCTURES</text></svg></div>",
    "options": [
      "Cells → Tissues → Organs → Organ Systems",
      "Cells → Organs → Tissues → Organ Systems",
      "Cells → Organ Systems → Tissues → Organs",
      "Tissues → Cells → Organs → Organ Systems"
    ],
    "correctAnswer": "Cells → Tissues → Organs → Organ Systems",
    "hint": "Similar cells form tissues, tissues form functional organs, and organs form organ systems.",
    "workedSolution": "Multicellular biological hierarchy organizes from the base: $\\text{Cells} \\to \\text{Tissues} \\to \\text{Organs} \\to \\text{Organ Systems} \\to \\text{Organism}$.",
    "points": 1
  }
]
};
