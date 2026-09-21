/**
 * 1993 BECE Integrated Science Examination (Set 125 Cloned Practice Variant)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_1993_variant
 * Set Number: Set 125
 * Format: 
 *   - Paper 1 (40 Objectives, exactly 10 A, 10 B, 10 C, 10 D)
 *   - Paper 2 (4 Theory & Practical Essay Questions, 20 marks each = 80 marks total)
 * Visual Setups:
 *   - svgQ2bPinholeCamera: Ray diagram of pinhole camera image formation
 *   - svgQ3aElectromagnet: Electromagnet solenoid circuit with iron nail
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

export const svgQ2bPinholeCamera = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(35, 60)'><rect x='15' y='40' width='12' height='60' fill='#cbd5e1' stroke='#94a3b8' stroke-width='1.5'/><line x1='21' y1='40' x2='21' y2='32' stroke='#0f172a' stroke-width='1.5'/><path d='M 21 15 Q 16 25 21 32 Q 26 25 21 15 Z' fill='#f59e0b' stroke='#ea580c' stroke-width='1'/><circle cx='21' cy='18' r='2' fill='#ffffff'/><text x='21' y='115' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Object (A)</text><circle cx='21' cy='15' r='2.5' fill='#ef4444'/><text x='10' y='18' font-size='9' font-weight='bold' fill='#ef4444'>A</text><circle cx='21' cy='100' r='2.5' fill='#38bdf8'/><text x='10' y='102' font-size='9' font-weight='bold' fill='#38bdf8'>B</text></g><g transform='translate(170, 35)'><rect x='0' y='0' width='160' height='130' fill='#1e293b' stroke='#64748b' stroke-width='2'/><line x1='0' y1='0' x2='0' y2='60' stroke='#38bdf8' stroke-width='3'/><line x1='0' y1='70' x2='0' y2='130' stroke='#38bdf8' stroke-width='3'/><circle cx='0' cy='65' r='3' fill='#ffffff'/><text x='-8' y='55' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='end'>Pinhole</text><line x1='160' y1='0' x2='160' y2='130' stroke='#10b981' stroke-width='3'/><text x='165' y='68' font-size='9' font-weight='bold' fill='#10b981'>Screen</text><g transform='translate(160, 42)'><circle cx='0' cy='0' r='2.5' fill='#38bdf8'/><text x='-8' y='-2' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='end'>B'</text><rect x='-7' y='0' width='7' height='35' fill='#cbd5e1' opacity='0.7'/><path d='M -3.5 45 Q -7 38 -3.5 35 Q 0 38 -3.5 45 Z' fill='#f59e0b' opacity='0.8'/><circle cx='0' cy='46' r='2.5' fill='#ef4444'/><text x='-8' y='49' font-size='9' font-weight='bold' fill='#ef4444' text-anchor='end'>A'</text></g></g><line x1='56' y1='75' x2='170' y2='100' stroke='#ef4444' stroke-width='1.8'/><line x1='170' y1='100' x2='330' y2='123' stroke='#ef4444' stroke-width='1.8'/><polygon points='110,87 118,89 113,93' fill='#ef4444'/><polygon points='250,111 258,113 253,117' fill='#ef4444'/><line x1='56' y1='160' x2='170' y2='100' stroke='#38bdf8' stroke-width='1.8'/><line x1='170' y1='100' x2='330' y2='42' stroke='#38bdf8' stroke-width='1.8'/><polygon points='110,132 118,127 113,123' fill='#38bdf8'/><polygon points='250,73 258,68 253,64' fill='#38bdf8'/><text x='190' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>RECTILINEAR PROPAGATION: LIGHT TRAVELS IN STRAIGHT LINES PRODUCING AN INVERTED IMAGE</text></svg></div>";
export const svgQ3aElectromagnet = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 200' width='100%' height='185' style='max-width: 460px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(75, 45)'><rect x='0' y='20' width='12' height='40' rx='2' fill='#94a3b8' stroke='#cbd5e1' stroke-width='1.5'/><polygon points='12,32 180,32 205,40 180,48 12,48' fill='#64748b' stroke='#cbd5e1' stroke-width='1.5'/><text x='100' y='18' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Soft Iron Nail Core</text><path d='M 30 24 Q 40 12 45 40 Q 50 68 60 24 Q 70 12 75 40 Q 80 68 90 24 Q 100 12 105 40 Q 110 68 120 24 Q 130 12 135 40 Q 140 68 150 24 Q 160 12 165 40' fill='none' stroke='#f59e0b' stroke-width='3.5'/><path d='M 215 35 L 225 25 L 235 35 L 225 45 Z' fill='none' stroke='#38bdf8' stroke-width='1.5'/><path d='M 220 48 L 230 40 L 240 50 L 230 58 Z' fill='none' stroke='#38bdf8' stroke-width='1.5'/><text x='230' y='18' font-size='9' font-weight='bold' fill='#38bdf8'>Attracted Clips</text></g><line x1='105' y1='85' x2='105' y2='145' stroke='#38bdf8' stroke-width='2'/><line x1='105' y1='145' x2='150' y2='145' stroke='#38bdf8' stroke-width='2'/><g transform='translate(150, 145)'><line x1='0' y1='-14' x2='0' y2='14' stroke='#10b981' stroke-width='2.5'/><line x1='7' y1='-8' x2='7' y2='8' stroke='#ef4444' stroke-width='4'/><line x1='16' y1='-14' x2='16' y2='14' stroke='#10b981' stroke-width='2.5'/><line x1='23' y1='-8' x2='23' y2='8' stroke='#ef4444' stroke-width='4'/><text x='11' y='-20' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Battery</text></g><line x1='173' y1='145' x2='220' y2='145' stroke='#38bdf8' stroke-width='2'/><circle cx='223' cy='145' r='2.5' fill='#e2e8f0'/><line x1='223' y1='145' x2='247' y2='145' stroke='#e2e8f0' stroke-width='2.5'/><circle cx='247' cy='145' r='2.5' fill='#e2e8f0'/><text x='235' y='165' font-size='10' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Switch (Closed)</text><line x1='247' y1='145' x2='240' y2='145' stroke='#38bdf8' stroke-width='2'/><line x1='240' y1='145' x2='240' y2='85' stroke='#38bdf8' stroke-width='2'/><text x='180' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>MAGNETIZING AN IRON NAIL USING ELECTRIC CURRENT THROUGH A SOLENOID</text></svg></div>";

export const SET_BECE_1993_SCIENCE_P1_QUESTIONS: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "Under standard ambient atmospheric conditions, what are the three fundamental physical states of matter recognized in science?",
    "options": [
      "Water, liquid, and gas",
      "Solid, Liquid, and Gas",
      "Earth, liquid, and gas",
      "Solid, liquid, and air"
    ],
    "correctAnswer": "Solid, Liquid, and Gas",
    "hint": "Solids maintain fixed shape and volume; liquids flow with fixed volume; gases expand freely.",
    "workedSolution": "Matter exists in three classical physical states under normal terrestrial conditions: Solid, Liquid, and Gas. Water is a specific substance, not a general state.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "In environmental pedology and agricultural science, the process of soil erosion causes:",
    "options": [
      "The washing away of moisture while leaving minerals intact",
      "An increase in soil porosity that helps crops grow better",
      "The complete sterilization and destruction of soil pests",
      "The mechanical detachment and washing away of the fertile topsoil layer"
    ],
    "correctAnswer": "The mechanical detachment and washing away of the fertile topsoil layer",
    "hint": "Strips away Horizon A, which contains organic humus and essential plant nutrients.",
    "workedSolution": "Soil erosion is the detachment and transport of fertile topsoil by running water or wind, depleting essential nutrients and organic matter needed by crops.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "What is the average normal resting internal core body temperature of a healthy human being?",
    "options": [
      "37°C (or 98.6°F)",
      "25°C",
      "36°C",
      "38°C"
    ],
    "correctAnswer": "37°C (or 98.6°F)",
    "hint": "The baseline clinical temperature maintained by hypothalamic thermoregulation.",
    "workedSolution": "Normal human core body temperature is maintained around 37.0°C (98.6°F) by physiological homeostatic mechanisms.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "Commercial steel used in structural engineering and tools is an interstitial metallic alloy composed of:",
    "options": [
      "Zinc and Copper",
      "Tin and Copper",
      "Iron and Carbon",
      "Iron and Zinc"
    ],
    "correctAnswer": "Iron and Carbon",
    "hint": "Adding small percentages of carbon to iron increases its tensile strength and hardness.",
    "workedSolution": "Steel is an alloy of iron and carbon (up to ~2%). Copper and zinc form brass; copper and tin form bronze.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "In agricultural crop rotations, leguminous crops (such as beans, cowpeas, and groundnuts) are cultivated primarily to:",
    "options": [
      "Add fixed nitrogen nitrates to the soil through root nodule bacteria",
      "Add large quantities of decomposed humus directly to topsoil",
      "Directly secrete animal proteins into the soil matrix",
      "Convert heavy clay soil into sandy loam"
    ],
    "correctAnswer": "Add fixed nitrogen nitrates to the soil through root nodule bacteria",
    "hint": "Root nodules house symbiotic Rhizobium bacteria that fix atmospheric nitrogen gas.",
    "workedSolution": "Legumes harbor symbiotic Rhizobium bacteria in their root nodules that fix atmospheric nitrogen into nitrates, naturally enriching soil fertility.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Which of the following anatomical structures in the human body is an active excretory organ?",
    "options": [
      "The lower terminal anus",
      "The sensory optic eye",
      "The skin (eliminating sweat via eccrine glands)",
      "The muscular pumping heart"
    ],
    "correctAnswer": "The skin (eliminating sweat via eccrine glands)",
    "hint": "Excretes water, mineral salts, and traces of urea; the anus egests undigested feces.",
    "workedSolution": "The skin is an excretory organ that removes water, sodium chloride, and traces of urea via sweat. The anus performs egestion (defecation), not metabolic excretion.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "In mammalian respiratory anatomy, what is the primary protective biological function performed by the hairs lining the nostrils?",
    "options": [
      "Filtering incoming air by trapping airborne dust particles, pollen, and microbes",
      "Keeping the internal nasal cavity warm during breathing",
      "Making inhalation physically easier by reducing friction",
      "Preventing carbon dioxide gas from entering the lungs"
    ],
    "correctAnswer": "Filtering incoming air by trapping airborne dust particles, pollen, and microbes",
    "hint": "Acts as a mechanical particulate filter together with sticky mucus.",
    "workedSolution": "Nasal hairs (vibrissae) and mucus trap airborne dust, soot, and pathogens, preventing them from entering the lower respiratory tract and lungs.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "In the International System of Units (S.I.) metric scale, one meter ($1\\text{ m}$) is exactly equal to:",
    "options": [
      "1 centimeter",
      "10 centimeters",
      "500 centimeters",
      "100 centimeters (100 cm)"
    ],
    "correctAnswer": "100 centimeters (100 cm)",
    "hint": "The metric prefix 'centi-' denotes one hundredth (10⁻²).",
    "workedSolution": "By metric definition, 1 meter = 100 centimeters = 1,000 millimeters.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "Which of the following statements concerning ecological feeding relationships and food chains is SCIENTIFICALLY INCORRECT?",
    "options": [
      "Metabolic energy is transferred progressively from one trophic level to another",
      "A photosynthetic green plant forms the primary base of grazing food chains",
      "Saprophytic bacteria decompose dead organic biomass to obtain energy",
      "An obligate carnivore feeds directly on green plants to obtain metabolic energy"
    ],
    "correctAnswer": "An obligate carnivore feeds directly on green plants to obtain metabolic energy",
    "hint": "Carnivores feed on animal flesh; herbivores feed on plants.",
    "workedSolution": "Carnivores consume other animals (herbivores or lower carnivores) for energy. Only herbivores feed directly on primary producer green plants.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "In simple machine mechanics, the external force applied to a machine to overcome a load resistance and perform work is called the:",
    "options": [
      "Rigid lever bar",
      "Load resistance",
      "Fixed pivot fulcrum",
      "Effort"
    ],
    "correctAnswer": "Effort",
    "hint": "The force applied to move the load; the turning point is the pivot.",
    "workedSolution": "The effort is the applied force exerted on a simple machine to overcome an opposing load resistance. The pivot (fulcrum) is the fixed turning point.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "All of the following physiological and morphological changes occur in adolescent girls during puberty EXCEPT:",
    "options": [
      "The mammary glands (breasts) enlarge and develop",
      "The pelvic girdle widens and hips broaden",
      "The tooth enamel turns whiter in color",
      "The onset of monthly menstruation (menarche)"
    ],
    "correctAnswer": "The tooth enamel turns whiter in color",
    "hint": "Secondary sexual characteristics are regulated by estrogen; tooth color is not altered by puberty.",
    "workedSolution": "Pubertal changes in girls include breast development, hip widening, body hair growth, and menarche. Tooth enamel coloration is unrelated to pubertal hormones.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "The fixed physical support point about which a rigid lever bar turns or pivots when work is performed is the:",
    "options": [
      "Applied effort force",
      "Opposing load resistance",
      "Machine handle",
      "Pivot (or fulcrum)"
    ],
    "correctAnswer": "Pivot (or fulcrum)",
    "hint": "The axis of rotation for the lever system.",
    "workedSolution": "The pivot (or fulcrum) is the fixed point or axis about which a lever turns when an effort force is applied to move a load.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "Which of the following heterogeneous mixtures can be effectively separated in a laboratory using gravity filtration?",
    "options": [
      "A true solution of sodium chloride salt in water",
      "A clear solution of cane sugar dissolved in water",
      "A suspension of insoluble sand in water",
      "An emulsion of liquid cooking oil in water"
    ],
    "correctAnswer": "A suspension of insoluble sand in water",
    "hint": "Porous filter paper traps insoluble solid particles as residue while the liquid filtrate drains through.",
    "workedSolution": "Filtration separates insoluble solids from liquids: insoluble sand particles are retained on the filter paper as residue, while clear water passes through as filtrate.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "In vertebrate histology and dermatology, the human skin is anatomically composed of two primary biological tissue layers:",
    "options": [
      "A single epithelial layer only",
      "The Epidermis and the Dermis",
      "Three distinct muscular layers",
      "Four separate fibrous sheets"
    ],
    "correctAnswer": "The Epidermis and the Dermis",
    "hint": "The outer protective epithelial epidermis and the deeper vascular dermis.",
    "workedSolution": "Mammalian skin comprises two primary biological layers: the outer avascular epidermis and the inner vascular dermis (supported beneath by subcutaneous adipose tissue).",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "Which fundamental natural force acts between celestial bodies to hold planets in stable orbital trajectories around the Sun?",
    "options": [
      "Electrostatic Coulomb force",
      "Dipole magnetic force",
      "Atmospheric frictional drag",
      "Gravitational force"
    ],
    "correctAnswer": "Gravitational force",
    "hint": "Mutual mass attraction described by Newton's Law of Universal Gravitation.",
    "workedSolution": "The gravitational force of attraction between the Sun's massive core and each orbiting planet provides the centripetal force that maintains planetary orbits.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "Which of the following agricultural soil types possesses the largest macropore spaces and allows the fastest drainage rate for water?",
    "options": [
      "Fine clayey soil",
      "Sandy soil",
      "Rich loamy soil",
      "Humus-rich black soil"
    ],
    "correctAnswer": "Sandy soil",
    "hint": "Coarse mineral particles with wide pore spaces allow water to percolate through rapidly.",
    "workedSolution": "Sandy soil consists of large, coarse particles with large non-capillary macropores, allowing water to drain rapidly by gravity and giving it low water retention.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "What is the approximate percentage by volume of diatomic oxygen gas ($\text{O}_2$) present in clean atmospheric air?",
    "options": [
      "21%",
      "0.03%",
      "1%",
      "78%"
    ],
    "correctAnswer": "21%",
    "hint": "Nitrogen makes up ~78%; oxygen is the second most abundant atmospheric gas at ~21%.",
    "workedSolution": "Clean dry atmospheric air consists of approximately 78% nitrogen (N₂), 21% oxygen (O₂), 0.9% argon, and 0.04% carbon dioxide.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "The discharge of untreated domestic sewage into a river used by downstream communities for drinking can cause an epidemic outbreak of:",
    "options": [
      "Plasmodium malaria",
      "Cholera [Vibrio cholerae]",
      "Guinea worm disease",
      "River blindness [Onchocerciasis]"
    ],
    "correctAnswer": "Cholera [Vibrio cholerae]",
    "hint": "A severe diarrheal waterborne bacterial disease spread via the fecal-oral route.",
    "workedSolution": "Untreated sewage contains enteric pathogens such as Vibrio cholerae, which causes cholera through ingestion of contaminated drinking water.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "When solid mothballs of naphthalene (camphor) placed inside a clothes wardrobe decrease in size over time without leaving a liquid residue, the process is:",
    "options": [
      "Thermal melting",
      "Molecular gas diffusion",
      "Sublimation",
      "Surface evaporation"
    ],
    "correctAnswer": "Sublimation",
    "hint": "Direct phase change from solid to gas without an intermediate liquid state.",
    "workedSolution": "Sublimation is the direct transition of a substance from solid to gas without passing through a liquid state (e.g., naphthalene, dry ice, ammonium chloride).",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "Which of the following organic food substances CANNOT be chemically oxidized by human cells during cellular respiration to yield energy?",
    "options": [
      "Free fatty acids",
      "Absorbed amino acids",
      "Cellulose (insoluble plant roughage)",
      "Glucose monosaccharides"
    ],
    "correctAnswer": "Cellulose (insoluble plant roughage)",
    "hint": "Humans lack the cellulase enzyme required to digest β-glycosidic bonds in cellulose.",
    "workedSolution": "Humans lack cellulase enzymes to break down plant cellulose, so it passes through the gut as unabsorbed dietary fiber. Glucose, fatty acids, and amino acids can be oxidized for ATP.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "In petroleum refining, volatile commercial fuels such as petrol, kerosene, and diesel are separated from crude petroleum oil by:",
    "options": [
      "Fractional distillation",
      "Vapor condensation",
      "Gravity filtration",
      "Open evaporation"
    ],
    "correctAnswer": "Fractional distillation",
    "hint": "Separation in a fractionating column based on differences in boiling points.",
    "workedSolution": "Crude petroleum is a mixture of hydrocarbons separated into fractions by fractional distillation based on differences in their boiling point ranges.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "Which of the following socioeconomic and behavioral factors contributes significantly to the spread of venereal diseases (STIs) among youth?",
    "options": [
      "Poor family planning education alone",
      "Chronic mental illness",
      "Drug and substance abuse (which impairs sexual judgment and decision-making)",
      "Parental wealth and affluence"
    ],
    "correctAnswer": "Drug and substance abuse (which impairs sexual judgment and decision-making)",
    "hint": "Substance intoxication leads to high-risk, unprotected sexual behavior.",
    "workedSolution": "Substance and alcohol abuse lowers inhibitions and impairs judgment, leading to unprotected sexual intercourse that accelerates the transmission of STIs.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "When a flashlight torch lights up after being connected to a chemical dry cell, what form of energy is initially supplied by the dry cell?",
    "options": [
      "Visible light energy directly",
      "Electrical energy (converted from stored chemical potential energy)",
      "Gravitational potential energy",
      "Nuclear thermal energy"
    ],
    "correctAnswer": "Electrical energy (converted from stored chemical potential energy)",
    "hint": "Chemical reactions in the cell generate electromotive force to drive electrical current.",
    "workedSolution": "A chemical dry cell converts stored chemical potential energy into electrical energy, which flows through the circuit to heat the bulb filament to emit light.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "Which of the following chemical elements is NOT considered an essential soil mineral nutrient absorbed by crop roots from soil solution?",
    "options": [
      "Nitrogen [N]",
      "Hydrogen (absorbed primarily as water molecules [H₂O])",
      "Potassium [K]",
      "Calcium [Ca]"
    ],
    "correctAnswer": "Hydrogen (absorbed primarily as water molecules [H₂O])",
    "hint": "Nitrogen, potassium, and calcium are soil-derived minerals; hydrogen is obtained from water.",
    "workedSolution": "Nitrogen, potassium, and calcium are essential mineral macronutrients absorbed as ions from the soil. Hydrogen is supplied through water (H₂O) and air.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "In medical parasitology, the human disease bilharziasis (schistosomiasis) is caused by infection with a parasitic:",
    "options": [
      "Blood fluke [Schistosoma haematobium / mansoni]",
      "Intestinal tapeworm [Taenia]",
      "Aquatic blood worm",
      "Intestinal roundworm [Ascaris]"
    ],
    "correctAnswer": "Blood fluke [Schistosoma haematobium / mansoni]",
    "hint": "A trematode flatworm whose cercariae larvae penetrate human skin in freshwater.",
    "workedSolution": "Bilharzia is caused by parasitic trematode blood flukes (Schistosoma). Tapeworms and roundworms cause taeniasis and ascariasis, respectively.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "When a piece of solid granite stone is dropped into a beaker of water, it sinks to the bottom because:",
    "options": [
      "Its physical density is exactly equal to that of water",
      "It displaces a volume of water equal to its own weight",
      "Its physical density is significantly less than that of water",
      "Its physical density is greater than the density of water [ρ_stone > ρ_water]"
    ],
    "correctAnswer": "Its physical density is greater than the density of water [ρ_stone > ρ_water]",
    "hint": "An object sinks in a fluid if its density exceeds the fluid's density.",
    "workedSolution": "By Archimedes' principle, an object sinks if its density is greater than that of the surrounding fluid (ρ_stone ≈ 2.6 g cm⁻³ > ρ_water = 1.0 g cm⁻³).",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "Which of the following features is a defining physiological characteristic of an involuntary reflex action?",
    "options": [
      "It occurs very slowly over several minutes",
      "It is initiated consciously through voluntary effort",
      "It occurs rapidly and automatically without conscious brain deliberation",
      "It requires conscious cognitive thinking before execution"
    ],
    "correctAnswer": "It occurs rapidly and automatically without conscious brain deliberation",
    "hint": "An autonomic protective pathway mediated through a spinal reflex arc.",
    "workedSolution": "Reflex actions are rapid, involuntary, automatic motor responses to stimuli coordinated through a reflex arc without conscious cognitive intervention.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "All of the following anatomical structures in the human body are classified as specialized sense organs EXCEPT the:",
    "options": [
      "Brain (central processing organ)",
      "Optic eye (photoreceptor)",
      "Auditory ear (phonoreceptor)",
      "Cutaneous skin (mechanoreceptor)"
    ],
    "correctAnswer": "Brain (central processing organ)",
    "hint": "The brain processes sensory data received from peripheral sense organs.",
    "workedSolution": "The eye, ear, nose, tongue, and skin are peripheral sense organs containing sensory receptors. The brain is the central processing organ of the nervous system.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "A cold heterogeneous mixture of raw, insoluble cornstarch suspended in water is separated most effectively by:",
    "options": [
      "Thermal boiling",
      "Atmospheric distillation",
      "Gravity sedimentation followed by decantation (or filtration)",
      "Agricultural winnowing"
    ],
    "correctAnswer": "Gravity sedimentation followed by decantation (or filtration)",
    "hint": "Dense insoluble starch grains settle to the bottom as sediment, allowing clear water to be poured off.",
    "workedSolution": "Because raw starch is insoluble in cold water, starch granules settle to the bottom upon standing (sedimentation), allowing the supernatant water to be decanted or filtered off.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Which of the following agricultural cultivated crops is botanically classified as an underground modified stem rhizome?",
    "options": [
      "Ginger [Zingiber officinale]",
      "Cocoyam corm",
      "Onion bulb",
      "Carrot taproot"
    ],
    "correctAnswer": "Ginger [Zingiber officinale]",
    "hint": "A horizontally growing subterranean stem bearing scale leaves and buds.",
    "workedSolution": "Ginger is an underground rhizome (horizontal stem). Cocoyams are corms, onions are bulbs, carrots are taproots, and yams are tubers.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "Which of the following physical or chemical processes represents an easily reversible physical change where no new substance is synthesized?",
    "options": [
      "The heating and caramelization of dry sugar into carbon",
      "The boiling and vaporization of liquid water into steam",
      "The exothermic reaction between sulfur and iron filings",
      "The combustion of a magnesium metal ribbon in air"
    ],
    "correctAnswer": "The boiling and vaporization of liquid water into steam",
    "hint": "Vaporization alters physical state (H₂O(l) ⇌ H₂O(g)) without changing chemical bonds.",
    "workedSolution": "Boiling water is a reversible physical phase transition; condensing steam recovers liquid water. Heating sugar, reacting iron with sulfur, and burning magnesium are chemical changes.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "In a laboratory photosynthesis experiment using a variegated green-and-white leaf, testing with iodine proves that:",
    "options": [
      "Chlorophyll pigment is strictly necessary for photosynthesis to synthesize starch",
      "Carbon dioxide gas is unneeded for photosynthesis",
      "Photosynthesis can occur in total darkness",
      "Liquid water is toxic to chloroplasts"
    ],
    "correctAnswer": "Chlorophyll pigment is strictly necessary for photosynthesis to synthesize starch",
    "hint": "Only the green parts containing chlorophyll turn blue-black with iodine; white parts remain brown.",
    "workedSolution": "Only green areas containing chlorophyll synthesize starch and turn blue-black with iodine, proving chlorophyll is necessary for photosynthesis.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "In classical Newtonian mechanics, frictional force is scientifically defined as a contact force that:",
    "options": [
      "Naturally accompanies and accelerates all motion",
      "Acts as the sole primary cause of mechanical motion",
      "Makes sliding motion completely effortless",
      "Opposes relative tangential motion between two contacting surfaces"
    ],
    "correctAnswer": "Opposes relative tangential motion between two contacting surfaces",
    "hint": "Acts parallel to the interface in the direction opposing movement.",
    "workedSolution": "Friction is a resistive contact force that opposes the relative sliding or rolling motion between two surfaces in contact, converting kinetic energy into heat.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "All of the following optical statements describe physiological functions of the crystalline lens in the human eye EXCEPT:",
    "options": [
      "It is transparent and allows light rays to transmit through it",
      "It refracts incoming light rays to converge them",
      "It focuses sharp optical images onto the sensory retina",
      "It becomes thicker and more convex when focusing on distant objects"
    ],
    "correctAnswer": "It becomes thicker and more convex when focusing on distant objects",
    "hint": "To focus on distant objects, ciliary muscles relax, pulling suspensory ligaments tight to make the lens thinner and flatter.",
    "workedSolution": "When viewing distant objects, ciliary muscles relax and suspensory ligaments pull the lens into a thinner, less convex shape. The lens becomes thicker for near objects.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "Which of the following domestic and civic practices will directly increase environmental and water pollution in a community?",
    "options": [
      "Constructing school laboratories with ventilated workshops",
      "Planting vegetative tree seedlings on bare community lands",
      "Excavating sand and clearing silt from choked street gutters",
      "Depositing untreated household refuse and feces near a domestic drinking water source"
    ],
    "correctAnswer": "Depositing untreated household refuse and feces near a domestic drinking water source",
    "hint": "Disposing of waste near water sources contaminates water with pathogens and toxic leachates.",
    "workedSolution": "Dumping household refuse near water bodies introduces enteric pathogens and toxic chemical leachates, contaminating potable water supplies.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "In colloidal chemistry, particulate wood smoke suspended in air is classified as a:",
    "options": [
      "Homogeneous mixture of pure gases only",
      "Liquid-in-gas colloidal aerosol",
      "Solid-in-gas colloidal aerosol (solid soot particles dispersed in air)",
      "Solid-in-liquid colloidal suspension"
    ],
    "correctAnswer": "Solid-in-gas colloidal aerosol (solid soot particles dispersed in air)",
    "hint": "Consists of unburned solid carbon soot particulates dispersed in combustion gases.",
    "workedSolution": "Smoke is a solid-in-gas aerosol consisting of microscopic unburned solid carbon particles and ash dispersed throughout air. Fog is a liquid-in-gas aerosol.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "What is the most effective personal hygiene practice for preventing contagious skin diseases (such as ringworm, scabies, and boils)?",
    "options": [
      "Applying strong alcohol-based perfumes onto the skin daily",
      "Keeping the skin clean by bathing regularly with soap and clean water",
      "Using chemical skin-bleaching creams to lighten skin",
      "Wearing dirty clothes continuously to protect skin from dust"
    ],
    "correctAnswer": "Keeping the skin clean by bathing regularly with soap and clean water",
    "hint": "Washing with soap removes accumulated sweat, dead epidermal cells, and pathogenic microorganisms.",
    "workedSolution": "Regular bathing with clean water and soap removes sweat, sebum, and dirt, preventing the proliferation of fungal dermatophytes and bacterial pathogens on skin.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "Under standard ambient conditions ($25^\\circ\\text{C}$ and $1\\text{ atm}$), which of the following metallic elements exists in a different physical state from the others?",
    "options": [
      "Solid zinc [Zn]",
      "Liquid mercury [Hg]",
      "Solid lead [Pb]",
      "Solid iron [Fe]"
    ],
    "correctAnswer": "Liquid mercury [Hg]",
    "hint": "A heavy metal that is liquid at room temperature; used in barometers and thermometers.",
    "workedSolution": "Mercury (Hg) is the only metal that is a liquid at standard room temperature (25°C). Zinc, lead, and iron are crystalline solids.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "Thermal heat energy emitted by thermonuclear reactions in the Sun reaches planet Earth through the vacuum of space primarily by:",
    "options": [
      "Thermal electromagnetic radiation",
      "Thermal conduction",
      "Thermal convection currents",
      "Specular optical reflection"
    ],
    "correctAnswer": "Thermal electromagnetic radiation",
    "hint": "Electromagnetic waves propagate across empty space without requiring a material medium.",
    "workedSolution": "Conduction and convection require a material medium. Solar heat traverses the vacuum of interplanetary space as infrared electromagnetic radiation.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "During an astronomical eclipse of the Moon (lunar eclipse), which celestial arrangement occurs?",
    "options": [
      "The Sun and the Moon are situated on the same side of the Earth",
      "Planet Earth moves directly between the Sun and the Moon in a straight line",
      "The Earth and the Sun are situated on the same side of the Moon",
      "The central Sun moves between the Earth and the Moon"
    ],
    "correctAnswer": "Planet Earth moves directly between the Sun and the Moon in a straight line",
    "hint": "Earth casts its shadow (umbra) onto the full Moon.",
    "workedSolution": "A lunar eclipse occurs when the Earth passes directly between the Sun and the Moon in a straight line (syzygy), casting Earth's shadow across the lunar surface.",
    "points": 1
  }
];

export const SET_BECE_1993_SCIENCE_P2_QUESTIONS: Paper2Question[] = [
  {
    "questionNumber": "1",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Define each of the following scientific terms, providing one clear practical example in each case:\n(i) Chemical element;\n(ii) Physical mixture;\n(iii) Chemical compound.",
        "workedSolution": "(i) Chemical element:\n• Definition: A pure chemical substance composed of only one type of atom (having the same atomic number) that cannot be split into simpler substances by ordinary chemical reactions.\n• Example: Metallic iron [$\\text{Fe}$], pure oxygen gas [$\\text{O}_2$], or solid copper [$\\text{Cu}$].\n\n(ii) Physical mixture:\n• Definition: A material system made up of two or more distinct substances physically combined in variable proportions, where each constituent retains its individual chemical properties and can be separated by physical methods.\n• Example: Atmospheric air, aqueous salt solution, or brass alloy.\n\n(iii) Chemical compound:\n• Definition: A pure substance composed of two or more different elements chemically bonded together in a fixed, definite stoichiometric ratio by mass, which can only be decomposed by chemical means.\n• Example: Pure water [$\\text{H}_2\\text{O}$], sodium chloride [$\\text{NaCl}$], or carbon dioxide [$\\text{CO}_2$].",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "Explain the scientific meaning of each of the following physical terms:\n(i) Mechanical work;\n(ii) Energy.",
        "workedSolution": "(i) Mechanical work:\nWork is done whenever an applied force moves an object through a distance in the direction of the force ($W = F \\times d$). It is measured in Joules (J).\n\n(ii) Energy:\nEnergy is defined as the capacity or ability of a physical body or system to do mechanical work. It exists in various interchangeable forms (kinetic, potential, thermal, electrical) and is measured in Joules (J).",
        "maxMarks": 4
      },
      {
        "subId": "(c)",
        "prompt": "State the official S.I. metric unit in which each of the following physical quantities is measured:\n(i) Power;\n(ii) Energy;\n(iii) Electric current;\n(iv) Thermodynamic temperature.",
        "workedSolution": "S.I. Units:\n• (i) Power: **Watt** [symbol: $\\text{W}$] (or Joule per second, $\\text{J s}^{-1}$)\n• (ii) Energy: **Joule** [symbol: $\\text{J}$] (or Newton-meter, $\\text{N m}$)\n• (iii) Electric current: **Ampere** [symbol: $\\text{A}$]\n• (iv) Temperature: **Kelvin** [symbol: $\\text{K}$]",
        "maxMarks": 4
      },
      {
        "subId": "(d)",
        "prompt": "A solid body of mass $100.0\\text{ kg}$ is hoisted vertically and placed stationary at a height of $2.0\\text{ m}$ above the ground. Calculate the gravitational potential energy of the body with reference to the ground:\n$$[\\text{Take acceleration due to gravity, } g = 10.0\\text{ m s}^{-2}]$$",
        "workedSolution": "Formula:\n$$\\text{Gravitational Potential Energy } (P.E.) = m \\times g \\times h$$\nSubstitute given values ($m = 100.0\\text{ kg}$, $g = 10.0\\text{ m s}^{-2}$, $h = 2.0\\text{ m}$):\n$$P.E. = 100.0\\text{ kg} \\times 10.0\\text{ m s}^{-2} \\times 2.0\\text{ m} = 2,000.0\\text{ Joules (J)}$$\nAnswer: The potential energy of the body is $$2,000.0\\text{ J}$$.",
        "maxMarks": 3
      },
      {
        "subId": "(e)",
        "prompt": "In floral botany, state three distinct structural characteristics each of:\n(i) An insect-pollinated (entomophilous) flower;\n(ii) A wind-pollinated (anemophilous) flower.",
        "workedSolution": "(i) Characteristics of insect-pollinated flowers:\n1. Possess large, brightly colored petals (corolla) to visually attract insect pollinators.\n2. Possess floral nectaries that secrete sugary nectar and have fragrant scents.\n3. Produce relatively small quantities of large, sticky, or spiky pollen grains that cling to insect bodies.\n4. Stigmas are sticky, compact, and enclosed within the flower petals.\n\n(ii) Characteristics of wind-pollinated flowers:\n1. Possess small, dull green or inconspicuous petals (or lack petals entirely).\n2. Scentless and lack nectar glands.\n3. Produce vast quantities of tiny, dry, smooth, and lightweight pollen grains easily carried by air currents.\n4. Possess long, pendulous filaments with versatile anthers protruding outside the flower, and large, feathery stigmas exposed to trap airborne pollen.",
        "maxMarks": 3
      }
    ]
  },
  {
    "questionNumber": "2",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) What is meant by a balanced diet in human nutrition?\n(ii) Name any two classes of food nutrients that must be present in a balanced diet.\n(iii) State one vital physiological function performed by each class of food named in (a)(ii).",
        "workedSolution": "(i) Definition of balanced diet:\nA diet that contains all the essential nutrient classes (carbohydrates, proteins, fats, vitamins, mineral salts, water, and dietary roughage) in their correct, adequate proportions to satisfy the metabolic and growth requirements of the body.\n\n(ii) Classes of food:\n1. Proteins\n2. Carbohydrates\n*(Alternatives: Lipids/Fats, Vitamins, Mineral salts)*\n\n(iii) Functions of named classes:\n• Proteins: Essential for cellular growth, tissue synthesis, repair of worn-out body cells, and synthesis of enzymes and antibodies.\n• Carbohydrates: Serve as the primary dietary source of metabolic energy, oxidized during respiration to yield ATP.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "An object is placed in front of a pinhole camera box. Draw a clear, fully labelled ray diagram to show how the image is formed on the translucent screen of the camera:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(35, 60)'><rect x='15' y='40' width='12' height='60' fill='#cbd5e1' stroke='#94a3b8' stroke-width='1.5'/><line x1='21' y1='40' x2='21' y2='32' stroke='#0f172a' stroke-width='1.5'/><path d='M 21 15 Q 16 25 21 32 Q 26 25 21 15 Z' fill='#f59e0b' stroke='#ea580c' stroke-width='1'/><circle cx='21' cy='18' r='2' fill='#ffffff'/><text x='21' y='115' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Object (A)</text><circle cx='21' cy='15' r='2.5' fill='#ef4444'/><text x='10' y='18' font-size='9' font-weight='bold' fill='#ef4444'>A</text><circle cx='21' cy='100' r='2.5' fill='#38bdf8'/><text x='10' y='102' font-size='9' font-weight='bold' fill='#38bdf8'>B</text></g><g transform='translate(170, 35)'><rect x='0' y='0' width='160' height='130' fill='#1e293b' stroke='#64748b' stroke-width='2'/><line x1='0' y1='0' x2='0' y2='60' stroke='#38bdf8' stroke-width='3'/><line x1='0' y1='70' x2='0' y2='130' stroke='#38bdf8' stroke-width='3'/><circle cx='0' cy='65' r='3' fill='#ffffff'/><text x='-8' y='55' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='end'>Pinhole</text><line x1='160' y1='0' x2='160' y2='130' stroke='#10b981' stroke-width='3'/><text x='165' y='68' font-size='9' font-weight='bold' fill='#10b981'>Screen</text><g transform='translate(160, 42)'><circle cx='0' cy='0' r='2.5' fill='#38bdf8'/><text x='-8' y='-2' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='end'>B'</text><rect x='-7' y='0' width='7' height='35' fill='#cbd5e1' opacity='0.7'/><path d='M -3.5 45 Q -7 38 -3.5 35 Q 0 38 -3.5 45 Z' fill='#f59e0b' opacity='0.8'/><circle cx='0' cy='46' r='2.5' fill='#ef4444'/><text x='-8' y='49' font-size='9' font-weight='bold' fill='#ef4444' text-anchor='end'>A'</text></g></g><line x1='56' y1='75' x2='170' y2='100' stroke='#ef4444' stroke-width='1.8'/><line x1='170' y1='100' x2='330' y2='123' stroke='#ef4444' stroke-width='1.8'/><polygon points='110,87 118,89 113,93' fill='#ef4444'/><polygon points='250,111 258,113 253,117' fill='#ef4444'/><line x1='56' y1='160' x2='170' y2='100' stroke='#38bdf8' stroke-width='1.8'/><line x1='170' y1='100' x2='330' y2='42' stroke='#38bdf8' stroke-width='1.8'/><polygon points='110,132 118,127 113,123' fill='#38bdf8'/><polygon points='250,73 258,68 253,64' fill='#38bdf8'/><text x='190' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>RECTILINEAR PROPAGATION: LIGHT TRAVELS IN STRAIGHT LINES PRODUCING AN INVERTED IMAGE</text></svg></div>",
        "workedSolution": "Ray Diagram Description (refer to vector schematic):\n• An upright object (candle) situated on the left with top $A$ and base $B$.\n• A closed light-tight camera box with a small pinhole aperture on its front face and a translucent screen at the back.\n• A straight light ray originating from top point $A$ passing through the pinhole to form image point $A'$ at the bottom of the screen.\n• A straight light ray originating from base point $B$ passing through the pinhole to form image point $B'$ at the top of the screen.\n• The resulting image ($A'B'$) formed on the screen is **real, vertically inverted (upside down), and diminished**.",
        "maxMarks": 6
      },
      {
        "subId": "(c)",
        "prompt": "State the two fundamental Laws of Reflection of light.",
        "workedSolution": "1. **First Law:** The incident ray, the reflected ray, and the normal to the reflecting surface at the point of incidence all lie in the exact same plane.\n2. **Second Law:** The angle of incidence ($i$) is strictly equal to the angle of reflection ($r$):\n$$i = r$$",
        "maxMarks": 4
      },
      {
        "subId": "(d)",
        "prompt": "(i) Describe briefly how positive and negative ions are formed from neutral atoms.\n(ii) State two fundamental physical differences between a nuclear proton and an orbiting electron.",
        "workedSolution": "(i) Formation of ions:\n• Cations (Positive ions): Formed when a neutral metal atom loses one or more of its valence electrons, leaving behind more positive nuclear protons than negative electrons (e.g., $\\text{Na} \\to \\text{Na}^+ + e^-$).\n• Anions (Negative ions): Formed when a neutral non-metal atom gains one or more valence electrons, resulting in an excess of negative electrons over nuclear protons (e.g., $\\text{Cl} + e^- \\to \\text{Cl}^-$).\n\n(ii) Differences between Proton and Electron:\n\n| Feature | Proton | Electron |\n| :--- | :--- | :--- |\n| **Electrical Charge** | Carries a relative charge of **$+1$** | Carries a relative charge of **$-1$** |\n| **Relative Mass** | Mass of approximately **$1\\text{ a.m.u.}$** | Negligible mass ($\\approx \\frac{1}{1840}\\text{ a.m.u.}$) |\n| **Location** | Located inside the **central nucleus** | Orbits in **electron shells** outside the nucleus |",
        "maxMarks": 5
      }
    ]
  },
  {
    "questionNumber": "3",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) Explain the physical concept of electromagnetism.\n(ii) Given an iron nail, insulated copper wire, a switch, and a DC battery, draw a complete circuit diagram showing how the nail can be magnetized:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 200' width='100%' height='185' style='max-width: 460px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(75, 45)'><rect x='0' y='20' width='12' height='40' rx='2' fill='#94a3b8' stroke='#cbd5e1' stroke-width='1.5'/><polygon points='12,32 180,32 205,40 180,48 12,48' fill='#64748b' stroke='#cbd5e1' stroke-width='1.5'/><text x='100' y='18' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Soft Iron Nail Core</text><path d='M 30 24 Q 40 12 45 40 Q 50 68 60 24 Q 70 12 75 40 Q 80 68 90 24 Q 100 12 105 40 Q 110 68 120 24 Q 130 12 135 40 Q 140 68 150 24 Q 160 12 165 40' fill='none' stroke='#f59e0b' stroke-width='3.5'/><path d='M 215 35 L 225 25 L 235 35 L 225 45 Z' fill='none' stroke='#38bdf8' stroke-width='1.5'/><path d='M 220 48 L 230 40 L 240 50 L 230 58 Z' fill='none' stroke='#38bdf8' stroke-width='1.5'/><text x='230' y='18' font-size='9' font-weight='bold' fill='#38bdf8'>Attracted Clips</text></g><line x1='105' y1='85' x2='105' y2='145' stroke='#38bdf8' stroke-width='2'/><line x1='105' y1='145' x2='150' y2='145' stroke='#38bdf8' stroke-width='2'/><g transform='translate(150, 145)'><line x1='0' y1='-14' x2='0' y2='14' stroke='#10b981' stroke-width='2.5'/><line x1='7' y1='-8' x2='7' y2='8' stroke='#ef4444' stroke-width='4'/><line x1='16' y1='-14' x2='16' y2='14' stroke='#10b981' stroke-width='2.5'/><line x1='23' y1='-8' x2='23' y2='8' stroke='#ef4444' stroke-width='4'/><text x='11' y='-20' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Battery</text></g><line x1='173' y1='145' x2='220' y2='145' stroke='#38bdf8' stroke-width='2'/><circle cx='223' cy='145' r='2.5' fill='#e2e8f0'/><line x1='223' y1='145' x2='247' y2='145' stroke='#e2e8f0' stroke-width='2.5'/><circle cx='247' cy='145' r='2.5' fill='#e2e8f0'/><text x='235' y='165' font-size='10' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Switch (Closed)</text><line x1='247' y1='145' x2='240' y2='145' stroke='#38bdf8' stroke-width='2'/><line x1='240' y1='145' x2='240' y2='85' stroke='#38bdf8' stroke-width='2'/><text x='180' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>MAGNETIZING AN IRON NAIL USING ELECTRIC CURRENT THROUGH A SOLENOID</text></svg></div>",
        "workedSolution": "(i) Explanation of electromagnetism:\nThe production of a magnetic field around an electrical conductor when direct electric current flows through it; specifically, creating a temporary magnet (electromagnet) by passing direct current through a coil wound around a ferromagnetic core.\n\n(ii) Circuit Diagram Description (refer to vector schematic):\n• An iron nail core wrapped with tightly wound turns of insulated copper wire (solenoid coil).\n• The two free ends of the solenoid are connected in series with a DC chemical battery and a control switch/key.\n• When the switch is closed, direct current circulates through the coils, setting up an internal magnetic field that magnetizes the iron nail, enabling its tip to attract small steel paper clips.",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "List three common clinical symptoms exhibited by a patient suffering from an attack of malaria.",
        "workedSolution": "1. High, intermittent body fever accompanied by chills and rigorous shivering.\n2. Profuse sweating after the shivering episode as fever subsides.\n3. Severe headache, joint/muscle pains, and general bodily weakness.\n4. Loss of appetite, nausea, and vomiting.",
        "maxMarks": 3
      },
      {
        "subId": "(c)",
        "prompt": "State three practical community sanitation practices for keeping the domestic environment clean and preventing disease transmission.",
        "workedSolution": "1. Disposing of domestic solid refuse into covered dustbins and emptying them regularly at approved collection sites.\n2. Regularly desilting and cleaning choked street gutters and drainage channels to prevent stagnant water.\n3. Weeding and clearing tall grass and bush overgrowths around dwellings that harbor mosquito vectors and rodents.\n4. Providing sanitary toilet facilities to eliminate indiscriminate open defecation.",
        "maxMarks": 5
      },
      {
        "subId": "(d)",
        "prompt": "Write down the systematic chemical names of the products formed when each of the following pairs of compounds react chemically:\n(i) Ammonia gas [$\\text{NH}_3$] and dilute hydrochloric acid [$\\text{HCl}$];\n(ii) Aqueous sodium hydroxide [$\\text{NaOH}$] and dilute hydrochloric acid [$\\text{HCl}$];\n(iii) Solid calcium carbonate [$\\text{CaCO}_3$] and dilute hydrochloric acid [$\\text{HCl}$].",
        "workedSolution": "Chemical Products:\n• (i) $\\text{NH}_3 + \\text{HCl}$:\n  - Product: **Ammonium chloride** [$\\text{NH}_4\\text{Cl}$].\n• (ii) $\\text{NaOH} + \\text{HCl}$:\n  - Products: **Sodium chloride** [$\\text{NaCl}$] and **Water** [$\\text{H}_2\\text{O}$].\n• (iii) $\\text{CaCO}_3 + 2\\text{HCl}$:\n  - Products: **Calcium chloride** [$\\text{CaCl}_2$], **Water** [$\\text{H}_2\\text{O}$], and **Carbon dioxide gas** [$\\text{CO}_2$].",
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
        "prompt": "(i) What is meant by an astronomical or artificial satellite?\n(ii) State one fundamental difference between a natural satellite and an artificial satellite.\n(iii) State two vital modern uses of artificial satellites orbiting planet Earth.",
        "workedSolution": "(i) Definition of satellite:\nA celestial or manufactured body that revolves in a closed gravitational orbit around a more massive primary planet (e.g., the Moon orbiting Earth).\n\n(ii) Natural vs. Artificial Satellite:\n• A natural satellite is a naturally occurring celestial body (such as Earth's Moon) formed during solar system evolution.\n• An artificial satellite is a human-engineered spacecraft constructed on Earth and launched into orbit by rockets.\n\n(iii) Uses of artificial satellites:\n1. Global telecommunications: Relaying international telephone signals, satellite television broadcasting, and internet data.\n2. Meteorological weather observation: Tracking storm systems, cloud patterns, and climate change trends.\n3. Satellite navigation: Providing Global Positioning System (GPS) signals for aviation, shipping, and road transit.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "In a clear tabular format, state two physical differences between the mass of a body and its weight.",
        "workedSolution": "Mass vs. Weight Distinction Table:\n\n| Feature | Mass | Weight |\n| :--- | :--- | :--- |\n| **Definition** | The actual quantity of matter contained in a body | The downward gravitational force exerted on a body by the Earth ($W = mg$) |\n| **Nature of Quantity** | Scalar quantity (has magnitude only) | Vector quantity (has magnitude and acts toward Earth's center) |\n| **Constancy** | Constant everywhere in the universe | Varies depending on local gravitational acceleration ($g$) |\n| **S.I. Unit** | **Kilogram [kg]** | **Newton [N]** |\n| **Measuring Tool** | Beam balance / Chemical balance | Spring balance / Dynamometer |",
        "maxMarks": 4
      },
      {
        "subId": "(c)",
        "prompt": "Write down the systematic chemical formula for each of the following inorganic compounds:\n(i) Calcium oxide;\n(ii) Pure water;\n(iii) Copper (II) sulfate.",
        "workedSolution": "Chemical Formulae:\n• (i) Calcium oxide: $\\text{CaO}$\n• (ii) Water: $\\text{H}_2\\text{O}$\n• (iii) Copper (II) sulfate: $\\text{CuSO}_4$",
        "maxMarks": 3
      },
      {
        "subId": "(d)",
        "prompt": "What color change is observed when a strip of blue litmus paper is dipped into each of the following liquids?\n(i) Aqueous sodium hydroxide solution;\n(ii) Dilute hydrochloric acid;\n(iii) Freshly squeezed lime juice;\n(iv) Pure distilled water.",
        "workedSolution": "Litmus Observations:\n• (i) Sodium hydroxide solution (alkali): **Remains blue** (no color change).\n• (ii) Dilute hydrochloric acid (strong acid): **Turns red**.\n• (iii) Fresh lime juice (citric acid): **Turns red**.\n• (iv) Pure distilled water (neutral, $pH = 7$): **Remains blue** (no color change).",
        "maxMarks": 4
      },
      {
        "subId": "(e)",
        "prompt": "(i) Define the biological process of breathing (pulmonary ventilation).\n(ii) Arrange the following parts of the human respiratory tract in the sequential order in which atmospheric air passes through them during inhalation:\n**Trachea, Nostrils, Lungs, Bronchus.**\n(iii) Describe briefly what happens chemically to a piece of starchy bread when it arrives in the duodenum of the small intestine.",
        "workedSolution": "(i) Definition of breathing:\nThe physical muscular process of alternately inhaling atmospheric air into the lungs and exhaling carbon dioxide-rich air out of the lungs to facilitate gaseous exchange.\n\n(ii) Correct sequential inhalation pathway:\n$$\\text{Nostrils} \\to \\text{Trachea} \\to \\text{Bronchus} \\to \\text{Lungs}$$\n\n(iii) Chemical digestion of bread in duodenum:\n1. Alkaline bile and pancreatic juice neutralize the acidic chyme coming from the stomach.\n2. The enzyme **pancreatic amylase** in pancreatic juice hydrolyzes the remaining starch molecules of the bread into **maltose** disaccharides.\n3. This prepares the maltose for subsequent hydrolysis into absorbable glucose monomers in the ileum.",
        "maxMarks": 4
      }
    ]
  }
];

export const SET_BECE_1993_SCIENCE_P1 = {
  id: "paper_1993_variant_p1",
  year: 1993,
  setNumber: 125,
  paperType: 1,
  subject: "Integrated Science",
  title: "1993 BECE Integrated Science Paper 1 (Objective Test)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: SET_BECE_1993_SCIENCE_P1_QUESTIONS
};

export const SET_BECE_1993_SCIENCE_P2 = {
  id: "paper_1993_variant_p2",
  year: 1993,
  setNumber: 125,
  paperType: 2,
  subject: "Integrated Science",
  title: "1993 BECE Integrated Science Paper 2 (Theory & Practical Essay)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 75,
  instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 4,
  questions: SET_BECE_1993_SCIENCE_P2_QUESTIONS
};

export const SET_BECE_1993_SCIENCE_COMPLETE = {
  year: 1993,
  isVariant: true,
  setNumber: 125,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: SET_BECE_1993_SCIENCE_P1,
  paper2: SET_BECE_1993_SCIENCE_P2,
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 2,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
