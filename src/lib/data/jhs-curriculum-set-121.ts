/**
 * 2023 BECE Integrated Science Examination (Set 121 Cloned Practice Variant)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_2023_variant
 * Set Number: Set 121
 * Format: 
 *   - Paper 1 (40 Objectives, exactly 10 A, 10 B, 10 C, 10 D)
 *   - Paper 2 (Section A Practical [40 marks across Q1(a)-(d)] + Section B Theory [Q2-Q6, 20 marks each = 60 marks])
 * Reconstructed Visual Setups (Directly from photographic sources):
 *   - svgQ1aReproductiveSystems: Human female and male reproductive systems [IMG_2614.jpg] (Labels I, II, III, IV, V, VI, VII, VIII without spoiling answers)
 *   - svgQ1bFarmTools: Horticultural farm tools (A, B, C without spoiling answers) [IMG_2613.jpg]
 *   - svgQ1cForwardBiasedCircuit: Forward-biased semiconductor circuit with LED, diode, resistor
 * 
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
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
  isPracticalSectionA?: boolean;
  subQuestions: Paper2SubQuestion[];
}

export const svgQ1aReproductiveSystems = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Female Reproductive System (Left) --><g transform='translate(20, 25)'><!-- Uterus Body I --><path d='M 70 50 C 55 50 45 80 50 115 L 60 145 L 80 145 L 90 115 C 95 80 85 50 70 50 Z' fill='#1e293b' stroke='#f43f5e' stroke-width='2'/><text x='70' y='92' font-size='13' font-weight='bold' fill='#f43f5e' text-anchor='middle'>I</text><!-- Left Fallopian Tube II & Ovary V --><path d='M 55 55 C 35 40 15 45 10 65 L 12 75' fill='none' stroke='#38bdf8' stroke-width='2.5'/><line x1='28' y1='48' x2='28' y2='36' stroke='#38bdf8' stroke-width='1.5'/><text x='28' y='30' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>II</text><!-- Ovary V --><ellipse cx='12' cy='85' rx='7' ry='10' fill='#facc15' stroke='#ca8a04' stroke-width='1.5'/><line x1='5' y1='85' x2='-4' y2='85' stroke='#facc15' stroke-width='1.5'/><text x='-9' y='89' font-size='12' font-weight='bold' fill='#facc15' text-anchor='end'>V</text><!-- Right Fallopian Tube & Ovary --><path d='M 85 55 C 105 40 125 45 130 65 L 128 75' fill='none' stroke='#38bdf8' stroke-width='2.5'/><ellipse cx='128' cy='85' rx='7' ry='10' fill='#facc15' stroke='#ca8a04' stroke-width='1.5'/><!-- Cervix III & Vagina IV --><line x1='60' y1='145' x2='80' y2='145' stroke='#cbd5e1' stroke-width='2'/><line x1='78' y1='145' x2='96' y2='145' stroke='#cbd5e1' stroke-width='1.5'/><text x='102' y='149' font-size='12' font-weight='bold' fill='#cbd5e1'>III</text><path d='M 60 145 L 63 175 L 77 175 L 80 145' fill='none' stroke='#f43f5e' stroke-width='2'/><line x1='76' y1='165' x2='96' y2='165' stroke='#f43f5e' stroke-width='1.5'/><text x='102' y='169' font-size='12' font-weight='bold' fill='#f43f5e'>IV</text><text x='70' y='202' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Female System</text></g><!-- Divider Line --><line x1='180' y1='20' x2='180' y2='210' stroke='#334155' stroke-width='1.5' stroke-dasharray='4,3'/><!-- Male Reproductive System (Right) --><g transform='translate(195, 25)'><!-- Pelvic & Abdominal Outline --><path d='M 25 15 C 30 60 35 110 50 150' fill='none' stroke='#64748b' stroke-width='1.5'/><!-- Bladder & Prostate Region --><ellipse cx='75' cy='65' rx='16' ry='14' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><!-- Vas Deferens (Sperm Duct) VI --><path d='M 125 145 C 115 70 85 55 75 75 L 75 115' fill='none' stroke='#38bdf8' stroke-width='2.5'/><line x1='102' y1='62' x2='118' y2='52' stroke='#38bdf8' stroke-width='1.5'/><text x='124' y='54' font-size='12' font-weight='bold' fill='#38bdf8'>VI</text><!-- Testis VII inside Scrotum VIII --><path d='M 110 130 C 105 165 145 175 140 135' fill='none' stroke='#94a3b8' stroke-width='2'/><line x1='138' y1='165' x2='152' y2='165' stroke='#94a3b8' stroke-width='1.5'/><text x='157' y='169' font-size='12' font-weight='bold' fill='#94a3b8'>VIII</text><!-- Testis VII --><ellipse cx='125' cy='145' rx='9' ry='12' fill='#facc15' stroke='#ca8a04' stroke-width='1.5'/><line x1='132' y1='145' x2='150' y2='142' stroke='#ca8a04' stroke-width='1.5'/><text x='155' y='145' font-size='12' font-weight='bold' fill='#facc15'>VII</text><!-- Urethra & Penis Structure --><path d='M 75 115 C 75 130 95 140 95 155' fill='none' stroke='#38bdf8' stroke-width='3'/><text x='100' y='202' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Male System</text></g></svg></div>";
export const svgQ1bFarmTools = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 170' width='100%' height='155' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Tool A: Mattock / Pickaxe (Left) --><g transform='translate(20, 20)'><!-- Wooden Handle --><rect x='0' y='38' width='80' height='10' rx='3' fill='#a16207' stroke='#78350f' stroke-width='1.2'/><!-- Heavy Iron Head (Pick on one side, Mattock blade on other) --><path d='M 75 10 L 88 10 L 98 43 L 88 78 L 78 85 L 85 43 Z' fill='#64748b' stroke='#cbd5e1' stroke-width='1.5'/><text x='50' y='115' font-size='14' font-weight='bold' fill='#38bdf8' text-anchor='middle'>A</text></g><!-- Tool B: Dibber (Middle) --><g transform='translate(160, 20)'><!-- Pointed Wooden Stick Dibber --><ellipse cx='15' cy='12' rx='7' ry='4' fill='#d97706' stroke='#92400e'/><path d='M 8 12 L 13 88 L 17 88 L 22 12 Z' fill='#b45309' stroke='#78350f' stroke-width='1.5'/><text x='15' y='115' font-size='14' font-weight='bold' fill='#f59e0b' text-anchor='middle'>B</text></g><!-- Tool C: Hand Fork / Garden Fork (Right) --><g transform='translate(230, 25)'><!-- Metal Prongs --><rect x='0' y='10' width='35' height='6' rx='1' fill='#94a3b8'/><line x1='35' y1='13' x2='35' y2='38' stroke='#cbd5e1' stroke-width='2.5'/><line x1='0' y1='16' x2='0' y2='42' stroke='#94a3b8' stroke-width='2.5'/><line x1='12' y1='16' x2='12' y2='45' stroke='#94a3b8' stroke-width='2.5'/><line x1='23' y1='16' x2='23' y2='45' stroke='#94a3b8' stroke-width='2.5'/><line x1='35' y1='16' x2='35' y2='42' stroke='#94a3b8' stroke-width='2.5'/><!-- Shaft & Wooden Handle --><path d='M 17 10 L 17 -5 C 17 -15 35 -15 45 -5 L 65 15 C 75 25 65 35 55 25 Z' fill='#a16207' stroke='#78350f' stroke-width='1.5' transform='rotate(42 20 10)'/><text x='45' y='110' font-size='14' font-weight='bold' fill='#10b981' text-anchor='middle'>C</text></g><text x='190' y='150' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>HORTICULTURAL FARM TOOLS FOR TILLAGE, NURSERY AND WEEDING</text></svg></div>";
export const svgQ1cForwardBiasedCircuit = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 190' width='100%' height='175' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Top Wire with DC Cell and Switch --><line x1='40' y1='40' x2='120' y2='40' stroke='#38bdf8' stroke-width='2'/><!-- DC Cell (Positive long line on left) --><line x1='120' y1='25' x2='120' y2='55' stroke='#10b981' stroke-width='2.5'/><text x='112' y='22' font-size='10' font-weight='bold' fill='#10b981'>+</text><line x1='128' y1='32' x2='128' y2='48' stroke='#ef4444' stroke-width='4'/><text x='134' y='22' font-size='10' font-weight='bold' fill='#ef4444'>-</text><text x='124' y='15' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cell</text><line x1='128' y1='40' x2='200' y2='40' stroke='#38bdf8' stroke-width='2'/><!-- Key / Switch in Closed Position --><circle cx='204' cy='40' r='2.5' fill='#e2e8f0'/><line x1='204' y1='40' x2='230' y2='40' stroke='#e2e8f0' stroke-width='2.5'/><circle cx='230' cy='40' r='2.5' fill='#e2e8f0'/><text x='217' y='26' font-size='9' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Switch</text><line x1='230' y1='40' x2='300' y2='40' stroke='#38bdf8' stroke-width='2'/><line x1='300' y1='40' x2='300' y2='80' stroke='#38bdf8' stroke-width='2'/><!-- Protective Current-Limiting Resistor --><rect x='275' y='80' width='50' height='20' fill='#1e293b' stroke='#a855f7' stroke-width='1.8' transform='rotate(90 300 90)'/><text x='325' y='95' font-size='9' font-weight='bold' fill='#a855f7'>Resistor</text><line x1='300' y1='105' x2='300' y2='140' stroke='#38bdf8' stroke-width='2'/><!-- Bottom Wire with Forward-Biased Diode and LED --><line x1='300' y1='140' x2='240' y2='140' stroke='#38bdf8' stroke-width='2'/><!-- Forward-Biased p-n Junction Diode (Anode pointing left towards positive return) --><g transform='translate(210, 140)'><polygon points='15,-10 -5,0 15,10' fill='#3b82f6' stroke='#1d4ed8'/><line x1='-5' y1='-10' x2='-5' y2='10' stroke='#1d4ed8' stroke-width='2'/><text x='5' y='24' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Diode</text></g><line x1='205' y1='140' x2='145' y2='140' stroke='#38bdf8' stroke-width='2'/><!-- Forward-Biased Light Emitting Diode (LED) with Light Radiation Arrows --><g transform='translate(115, 140)'><polygon points='15,-10 -5,0 15,10' fill='#f59e0b' stroke='#b45309'/><line x1='-5' y1='-10' x2='-5' y2='10' stroke='#b45309' stroke-width='2'/><!-- Emission Arrows --><line x1='5' y1='-12' x2='-2' y2='-22' stroke='#fde047' stroke-width='1.5'/><polygon points='-4,-18 -2,-22 2,-20' fill='#fde047'/><line x1='12' y1='-12' x2='5' y2='-22' stroke='#fde047' stroke-width='1.5'/><polygon points='3,-18 5,-22 9,-20' fill='#fde047'/><text x='5' y='24' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>LED</text></g><line x1='110' y1='140' x2='40' y2='140' stroke='#38bdf8' stroke-width='2'/><line x1='40' y1='140' x2='40' y2='40' stroke='#38bdf8' stroke-width='2'/><text x='180' y='180' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>FORWARD BIASING: ANODES CONNECTED TOWARDS POSITIVE TERMINAL</text></svg></div>";

export const SET_BECE_2023_SCIENCE_P1_QUESTIONS: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "In dental oral hygiene, the hard, calcified, greenish-black mineralized deposit that forms around the corners and margins of teeth is called:",
    "options": [
      "Periodontal gum disease",
      "Dental caries alone",
      "Dental plaque (or calculus / tartar)",
      "An acute tooth cavity"
    ],
    "correctAnswer": "Dental plaque (or calculus / tartar)",
    "hint": "Mineralized bacterial film hardened by saliva mineral salts.",
    "workedSolution": "Dental plaque is a biofilm of microorganisms that calcifies over time with saliva minerals into a hard deposit known as dental calculus or tartar.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "When equal volumes of water are poured over dry soil samples, the increase in weight per unit amount of soil is highest in:",
    "options": [
      "Clayey soil",
      "Coarse gravelly soil",
      "Sandy soil",
      "Loamy soil"
    ],
    "correctAnswer": "Clayey soil",
    "hint": "Microscopic particles create fine capillary micropores that retain the greatest mass of water.",
    "workedSolution": "Clayey soil consists of microscopic particles with high surface area and fine micropores, giving it the highest water retention capacity and mass increase per unit soil.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "All of the following agronomic practices are classified as field cultural practices in crop production EXCEPT:",
    "options": [
      "Nursing seeds in nursery beds",
      "Chemical and cultural pest control",
      "Applying organic straw mulching",
      "Mechanical and manual weeding"
    ],
    "correctAnswer": "Nursing seeds in nursery beds",
    "hint": "Nursing is a pre-planting nursery activity; weeding, mulching, and pest control occur in the field.",
    "workedSolution": "Nursing is a pre-planting operation carried out in a nursery. Cultural practices refer to maintenance operations carried out on the field after planting (weeding, mulching, pest control).",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "Which of the following chemical substances is classified as a homogeneous mixture rather than a pure compound?",
    "options": [
      "Pure solid sodium sulfate [Na₂SO₄]",
      "Gaseous hydrogen chloride [HCl]",
      "Pure liquid ammonia [NH₃]",
      "Aqueous sodium chloride salt solution"
    ],
    "correctAnswer": "Aqueous sodium chloride salt solution",
    "hint": "Formed by physically dissolving salt solute into water solvent in variable proportions.",
    "workedSolution": "Salt solution is a homogeneous mixture of salt and water physically combined without fixed stoichiometry. Sodium sulfate, hydrogen chloride, and ammonia are chemically bonded compounds.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "Which of the following statements concerning chemical acids are SCIENTIFICALLY CORRECT?\\nI. They turn red litmus paper blue\\nII. They are neutralized by bases to form salts and water\\nIII. Fresh citrus fruits contain organic acids",
    "options": [
      "I and II only",
      "I and III only",
      "II and III only",
      "I, II and III"
    ],
    "correctAnswer": "II and III only",
    "hint": "Acids turn blue litmus paper red, not red to blue.",
    "workedSolution": "Acids turn blue litmus red (statement I is false), react with bases via neutralization (statement II), and occur naturally in citrus fruits as citric acid (statement III).",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "The agricultural practice of removing weak, crowded excess seedlings from a stand to leave strong seedlings is termed:",
    "options": [
      "Earthing up",
      "Filling in (supplying)",
      "Pricking out into boxes",
      "Thinning out"
    ],
    "correctAnswer": "Thinning out",
    "hint": "Reduces intra-crop competition for light, space, and soil nutrients.",
    "workedSolution": "Thinning out is the removal of surplus, overcrowded, or sickly seedlings from a stand to ensure optimal spacing, reducing competition for soil nutrients and sunlight.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "A prepared bulk herbal mixture has a total volume of $200.0\\text{ m}^3$ and a total mass of $10,000.0\\text{ kg}$. Determine the density of the mixture:",
    "options": [
      "50 kg m⁻³",
      "200 kg m⁻³",
      "800 kg m⁻³",
      "10,200 kg m⁻³"
    ],
    "correctAnswer": "50 kg m⁻³",
    "hint": "$$\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)} = \\frac{10,000}{200}$$.",
    "workedSolution": "$$\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)} = \\frac{10,000.0\\text{ kg}}{200.0\\text{ m}^3} = 50.0\\text{ kg m}^{-3}$$.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "How many total constituent atoms are present in one single chemical molecule of hydrogen peroxide (H₂O₂)?",
    "options": [
      "2 atoms",
      "3 atoms",
      "5 atoms",
      "4 atoms (2 Hydrogen atoms and 2 Oxygen atoms)"
    ],
    "correctAnswer": "4 atoms (2 Hydrogen atoms and 2 Oxygen atoms)",
    "hint": "Sum the chemical subscripts: $2 + 2 = 4$.",
    "workedSolution": "One molecule of H₂O₂ consists of 2 hydrogen atoms and 2 oxygen atoms covalently bonded together, giving a total atomicity of $2 + 2 = 4$ atoms.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "Which of the following electronic circuit components is NOT fabricated primarily from semiconductor materials?",
    "options": [
      "A p-n junction diode",
      "A Light Emitting Diode [LED]",
      "A bipolar junction transistor",
      "An electrostatic capacitor"
    ],
    "correctAnswer": "An electrostatic capacitor",
    "hint": "Consists of two metallic conducting plates separated by a dielectric insulating medium.",
    "workedSolution": "Capacitors consist of metal conducting plates separated by a dielectric insulator (mica, ceramic, paper). Diodes, LEDs, and transistors are solid-state semiconductor devices.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "High-temperature gaseous steam transforms into liquid water during phase change via the physical process of:",
    "options": [
      "Condensation",
      "Thermal evaporation",
      "Thermal melting",
      "Rapid boiling"
    ],
    "correctAnswer": "Condensation",
    "hint": "The exothermic phase change from gas to liquid upon cooling.",
    "workedSolution": "Condensation is the physical phase transformation in which a substance transitions from a gas (steam) into a liquid (water) by losing latent heat.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "Which morphological body contour minimizes hydrodynamic drag resistance and facilitates rapid locomotion through fluids?",
    "options": [
      "A rectangular blunt body shape",
      "A streamlined (fusiform) body shape",
      "A spherical round body shape",
      "A flat triangular body shape"
    ],
    "correctAnswer": "A streamlined (fusiform) body shape",
    "hint": "Tapers smoothly at both ends, characteristic of fish and birds.",
    "workedSolution": "A streamlined (fusiform) body shape tapers smoothly at both anterior and posterior ends, allowing fluid streamlines to flow with minimal friction and drag turbulence.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "In vegetable garden husbandry, light stirring and hoeing of the topsoil around growing crops serves to:\\nI. Improve soil aeration for root respiration\\nII. Stimulate the biological activity of beneficial soil organisms\\nIII. Increase rainwater penetration and infiltration\\nIV. Suppress and eliminate emerging weed growth",
    "options": [
      "I and II only",
      "I, II, III and IV",
      "I, III and IV only",
      "II, III and IV only"
    ],
    "correctAnswer": "I, II, III and IV",
    "hint": "Loosening the topsoil enhances aeration, infiltration, and microbial activity while destroying weeds.",
    "workedSolution": "Stirring garden beds breaks compacted surface crusts to improve aeration and infiltration, stimulates aerobic microbial activity, and uproots weeds (I, II, III, and IV).",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "In a bipolar N-P-N junction transistor, the central thin semiconductor base layer is fabricated from:",
    "options": [
      "An n-type semiconductor with excess free electrons",
      "An intrinsic, undoped pure semiconductor crystal",
      "A heavy metallic conductor",
      "A p-type semiconductor (where positive holes are majority carriers)"
    ],
    "correctAnswer": "A p-type semiconductor (where positive holes are majority carriers)",
    "hint": "An N-P-N transistor sandwiches a p-type semiconductor base between two n-type regions.",
    "workedSolution": "An N-P-N transistor consists of a thin p-type semiconductor base sandwiched between an n-type emitter and an n-type collector.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "Which of the following outcomes represents a primary industrial and economic benefit of adopting modern technology in manufacturing?",
    "options": [
      "Provision of automated machinery that increases production efficiency and output",
      "Steep increases in per-unit manufacturing costs",
      "A complete elimination of technical skilled labor",
      "Severe environmental pollution"
    ],
    "correctAnswer": "Provision of automated machinery that increases production efficiency and output",
    "hint": "Technology introduces automation and high-precision machinery that streamlines mass production.",
    "workedSolution": "Technology supplies automated machinery and precision tools that accelerate industrial production, increase product consistency, and reduce per-unit manufacturing costs.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "In soil conservation agronomy, contour ploughing and terracing are farming techniques practiced primarily on:",
    "options": [
      "Hard, rocky impermeable flat lands",
      "Sloppy and hilly sloping farmlands",
      "Permanently waterlogged muddy lands",
      "Completely flat, level arable plains"
    ],
    "correctAnswer": "Sloppy and hilly sloping farmlands",
    "hint": "Ploughing across slope contours creates ridges that slow water runoff and prevent erosion.",
    "workedSolution": "Contour ploughing creates ridges perpendicular to the slope on hillsides, slowing surface runoff and promoting water infiltration to prevent soil erosion.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "A student of mass $70.0\\text{ kg}$ climbs a staircase to the top of a school building of vertical height $15.0\\text{ m}$. Determine the student's potential energy at the top:\\n$$[\\text{Take acceleration due to gravity, } g = 10.0\\text{ m s}^{-2}]$$",
    "options": [
      "5,250 J",
      "1,050 J",
      "10,500 J",
      "700 J"
    ],
    "correctAnswer": "10,500 J",
    "hint": "$$P.E. = mgh = 70.0 \\times 10.0 \\times 15.0$$.",
    "workedSolution": "$$\\text{Gravitational Potential Energy } (P.E.) = mgh = 70.0\\text{ kg} \\times 10.0\\text{ m s}^{-2} \\times 15.0\\text{ m} = 10,500.0\\text{ Joules (J)}$$.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "Which of the following pairs of cellular organelles and structures are naturally present within eukaryotic animal cells?",
    "options": [
      "Small vacuoles and a membrane-bound nucleus",
      "Mitochondria and photosynthetic chloroplasts",
      "Cell nucleus and photosynthetic chloroplasts",
      "A rigid outer cellulose cell wall and mitochondria"
    ],
    "correctAnswer": "Small vacuoles and a membrane-bound nucleus",
    "hint": "Animal cells lack rigid cellulose cell walls and green chloroplasts.",
    "workedSolution": "Animal cells possess a nucleus, mitochondria, and small temporary vacuoles. Chloroplasts and cellulose cell walls are exclusive to plant cells.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "Artificial orbital satellites launched into Earth's orbit can be utilized for which scientific and commercial purposes?\\nI. Global telecommunications and internet data relay\\nII. Geological oil, gas, and mineral resource exploration\\nIII. Meteorological weather monitoring and storm tracking",
    "options": [
      "I only",
      "II only",
      "I, II and III",
      "I and II only"
    ],
    "correctAnswer": "I, II and III",
    "hint": "Satellites perform telecommunications, remote Earth sensing, and meteorological imaging.",
    "workedSolution": "Artificial satellites serve multiple functions: communication satellites relay signals, remote-sensing satellites survey geological resources, and weather satellites track storms (I, II, and III).",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "In specular reflection optics, the optical image produced of an object in a flat plane mirror is ALWAYS:",
    "options": [
      "Real and projectable onto a physical screen",
      "Significantly magnified in dimensions",
      "Vertically inverted upside down",
      "Virtual (formed behind the mirror and cannot be captured on a screen)"
    ],
    "correctAnswer": "Virtual (formed behind the mirror and cannot be captured on a screen)",
    "hint": "The image is erect, laterally inverted, same size, and virtual.",
    "workedSolution": "A plane mirror produces an image that is virtual, erect, laterally inverted, and the same size as the object, located at an image distance equal to the object distance.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "All of the following broad agricultural stages are classified as general principles of crop production EXCEPT:",
    "options": [
      "The mechanical operation of seed planting into the soil",
      "Farmland site and soil selection",
      "Integrated pest and disease management",
      "Post-harvest crop harvesting and processing"
    ],
    "correctAnswer": "The mechanical operation of seed planting into the soil",
    "hint": "Site selection, pest control, and harvesting are broad principles; planting is an operational task.",
    "workedSolution": "Principles of crop production encompass overarching management stages: site selection, soil preparation, pest management, and post-harvest handling. Seed planting is a specific cultural operation.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "Which of the following pairs of chemical elements reside in the exact same horizontal Period (Period 2) of the Periodic Table?",
    "options": [
      "Boron [₅B] and Aluminum [₁₃Al]",
      "Beryllium [₄Be] and Boron [₅B]",
      "Hydrogen [₁H] and Lithium [₃Li]",
      "Sodium [₁₁Na] and Potassium [₁₉K]"
    ],
    "correctAnswer": "Beryllium [₄Be] and Boron [₅B]",
    "hint": "Both Beryllium ($Z=4: 2, 2$) and Boron ($Z=5: 2, 3$) occupy two electron shells ($n=2$).",
    "workedSolution": "Elements in the same period have the same number of electron shells. Beryllium ($2, 2$) and Boron ($2, 3$) both have two occupied shells, placing them in Period 2.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "In environmental science, the short-term, daily variation of atmospheric temperature, rainfall, wind, and sunshine in a localized area is termed:",
    "options": [
      "Climate (long-term average)",
      "Climatic season",
      "Weather",
      "Relative humidity alone"
    ],
    "correctAnswer": "Weather",
    "hint": "The day-to-day atmospheric conditions; climate is the average over 30 years.",
    "workedSolution": "Weather describes the day-to-day state of atmospheric variables (temperature, humidity, precipitation). Climate is the long-term statistical pattern over decades.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "During a laboratory food test for starch in a green leaf, the fresh leaf is first boiled in water for 1 minute primarily to:",
    "options": [
      "Completely dissolve and isolate the starch grains",
      "Kill the leaf protoplasm and rupture cell membranes to permit chemical penetration",
      "Extract and dissolve out all green chlorophyll pigments",
      "Softens the leaf after boiling in alcohol"
    ],
    "correctAnswer": "Kill the leaf protoplasm and rupture cell membranes to permit chemical penetration",
    "hint": "Halts enzymatic activity and breaks semi-permeable membranes; alcohol dissolves chlorophyll.",
    "workedSolution": "Boiling the leaf in water kills the cells, halts all enzymatic metabolic reactions, and ruptures cell membranes so iodine solution can penetrate tissues.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "All of the following ecological and structural damages are direct consequences of severe soil erosion EXCEPT the:",
    "options": [
      "Destabilization and weakening of plant root anchorage",
      "Irreversible loss of essential mineral nutrients in topsoil",
      "Spontaneous initiation of wild bushfires",
      "Undermining of building foundations and bridges"
    ],
    "correctAnswer": "Spontaneous initiation of wild bushfires",
    "hint": "Erosion washes away topsoil and undermines structures; it does not generate sparks to ignite fires.",
    "workedSolution": "Soil erosion washes away fertile topsoil, exposes roots, and scours structural foundations. It has no causal role in igniting bushfires.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "Four commercial chemical products X, Y, Z, and W have masses of $0.05\\text{ kg}$, $50.0\\text{ mg}$, $500.0\\text{ g}$, and $0.05\\text{ g}$ respectively. If all four products occupy the exact same physical volume, which product has the HIGHEST density?",
    "options": [
      "Product X (mass = 50.0 g)",
      "Product Z (mass = 500.0 g)",
      "Product Y (mass = 0.05 g)",
      "Product W and X combined"
    ],
    "correctAnswer": "Product Z (mass = 500.0 g)",
    "hint": "Convert masses to grams: $X = 50\\text{ g}$, $Y = 0.05\\text{ g}$, $Z = 500\\text{ g}$, $W = 0.05\\text{ g}$. For equal volumes, density is directly proportional to mass.",
    "workedSolution": "Converting masses to grams: $X = 50\\text{ g}$, $Y = 0.05\\text{ g}$, $Z = 500\\text{ g}$, $W = 0.05\\text{ g}$. Because volume is constant (\\rho = m/V), product Z has the greatest density.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "From the four products X ($0.05\\text{ kg}$), Y ($50.0\\text{ mg}$), Z ($500.0\\text{ g}$), and W ($0.05\\text{ g}$), which pair of products possess the EXACT SAME mass?",
    "options": [
      "Product X and Product Y",
      "Product Y and Product Z",
      "Product X and Product W",
      "Product Y and Product W"
    ],
    "correctAnswer": "Product Y and Product W",
    "hint": "$$50.0\\text{ mg} = \\frac{50}{1,000}\\text{ g} = 0.05\\text{ g}$$.",
    "workedSolution": "$$Y = 50.0\\text{ mg} = 0.05\\text{ g}$$ and $$W = 0.05\\text{ g}$$. Therefore, products Y and W have the exact same mass.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "Which of the following chemical ions is formed when a neutral metal atom loses exactly two valence electrons?",
    "options": [
      "Sulfide anion [S²⁻]",
      "Potassium cation [K⁺]",
      "Calcium cation [Ca²⁺]",
      "Fluoride anion [F⁻]"
    ],
    "correctAnswer": "Calcium cation [Ca²⁺]",
    "hint": "Loss of electrons yields a positive cation; losing 2 electrons gives a $+2$ charge.",
    "workedSolution": "A neutral calcium atom ($Z=20: 2, 8, 8, 2$) loses its 2 valence electrons to form a stable dipositive cation (Ca²⁺). Sulfide gains 2 electrons (S²⁻).",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Which sustainable agricultural farming system makes the most efficient, continuous use of a limited parcel of arable land without abandoning it to bush fallow?",
    "options": [
      "Shifting cultivation (bush fallowing)",
      "Land rotation",
      "Crop rotation",
      "Uncontrolled mixed cropping"
    ],
    "correctAnswer": "Crop rotation",
    "hint": "Crops are rotated sequentially across partitioned plots, maintaining continuous production.",
    "workedSolution": "Crop rotation cultivates different crop families sequentially on the same land across seasons, preserving soil fertility and breaking pest cycles without abandoning land to fallow.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "Which of the following light-emitting entities represents a biological, natural source of visible light?",
    "options": [
      "A kerosene wick lantern",
      "The Earth's Moon",
      "A battery-powered LED torchlight",
      "A bioluminescent glow-worm (or firefly)"
    ],
    "correctAnswer": "A bioluminescent glow-worm (or firefly)",
    "hint": "Produces light through biological luminescence; the Moon reflects sunlight.",
    "workedSolution": "Glow-worms produce light through enzyme-catalyzed biochemical bioluminescence. The Moon is a non-luminous reflector of sunlight, and lanterns and torches are artificial sources.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "In the International System of Units (S.I.), which of the following units is classified as a DERIVED unit rather than a base unit?",
    "options": [
      "Kilogram [kg] (base unit of mass)",
      "Kelvin [K] (base unit of temperature)",
      "Second [s] (base unit of time)",
      "Pascal [Pa] (unit of pressure)"
    ],
    "correctAnswer": "Pascal [Pa] (unit of pressure)",
    "hint": "$$1\\text{ Pa} = 1\\text{ N m}^{-2} = 1\\text{ kg m}^{-1}\\text{ s}^{-2}$$, derived from base units.",
    "workedSolution": "The Pascal (Pa) is a derived unit of pressure ($1\\text{ Pa} = 1\\text{ N m}^{-2} = 1\\text{ kg m}^{-1}\\text{ s}^{-2}$). Kilogram, kelvin, and second are base units.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "In astronomy, an immense gravitationally bound cosmic system containing billions of stars, planets, gas, and interstellar dust is known as:",
    "options": [
      "An icy comet",
      "A galaxy [e.g., The Andromeda Galaxy]",
      "The planetary solar system",
      "An individual constellation"
    ],
    "correctAnswer": "A galaxy [e.g., The Andromeda Galaxy]",
    "hint": "A vast stellar system containing billions of stars; solar systems reside inside galaxies.",
    "workedSolution": "A galaxy is an immense gravitationally bound system of stars, gas, and dark matter. Our Solar System is located within the Milky Way Galaxy.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "An electric current of $3.0\\text{ A}$ flows through an ohmic resistor of resistance $4.0\\ \\Omega$. Determine the potential difference across the terminals of the resistor:",
    "options": [
      "12.00 V",
      "0.75 V",
      "1.33 V",
      "7.00 V"
    ],
    "correctAnswer": "12.00 V",
    "hint": "$$V = I \\times R = 3.0\\text{ A} \\times 4.0\\ \\Omega$$.",
    "workedSolution": "By Ohm's law: $V = I \\times R = 3.0\\text{ A} \\times 4.0\\ \\Omega = 12.00\\text{ Volts (V)}$.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "Which meteorological observation instrument is installed at weather stations to measure horizontal wind speed?",
    "options": [
      "A wet-and-dry bulb hygrometer",
      "A graduated rain gauge",
      "A rotating cup anemometer",
      "A pivoting wind vane"
    ],
    "correctAnswer": "A rotating cup anemometer",
    "hint": "Features revolving hemispherical cups driving a calibrated dial; wind vanes indicate direction.",
    "workedSolution": "An anemometer measures wind speed based on the rotation rate of cups driven by the wind. Wind vanes indicate wind direction, and rain gauges measure precipitation.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "Which of the following anatomical and physiological features correctly distinguishes systemic arteries from veins?",
    "options": [
      "Arteries possess relatively narrow lumens and thick muscular walls, while veins have wide lumens",
      "Arteries convey blood to the heart while veins carry blood away from the heart",
      "Arteries carry deoxygenated blood while veins carry oxygenated blood exclusively",
      "Arteries possess internal semilunar valves while veins lack valves completely"
    ],
    "correctAnswer": "Arteries possess relatively narrow lumens and thick muscular walls, while veins have wide lumens",
    "hint": "Arteries carry blood under high pressure away from the heart, requiring narrow lumens and thick walls.",
    "workedSolution": "Arteries convey blood away from the heart under high hydrostatic pressure, requiring thick muscular elastic walls and narrow lumens. Veins have wider lumens, thinner walls, and valves.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "Which chemical metalloid element is the primary material used in the commercial manufacturing of microchips, computer processors, and transistors?",
    "options": [
      "Alkali sodium [Na]",
      "Silicon [Si]",
      "Halogen fluorine [F]",
      "Noble gas neon [Ne]"
    ],
    "correctAnswer": "Silicon [Si]",
    "hint": "A Group 14 tetravalent semiconductor element.",
    "workedSolution": "Silicon (Si) is the semiconductor substrate used in microelectronics because its electrical conductivity can be controlled via doping.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "Which environmental factor has the greatest immediate operational influence on the daily success of commercial vegetable crop production?",
    "options": [
      "Abundant availability of manual labor alone",
      "A reliable, continuous source of clean irrigation water",
      "Geographic proximity to retail urban markets",
      "Presence of agricultural insect pests"
    ],
    "correctAnswer": "A reliable, continuous source of clean irrigation water",
    "hint": "Vegetables are succulent, shallow-rooted crops with high water requirements.",
    "workedSolution": "Vegetables are succulent crops consisting of 85–95% water with shallow root systems, making a reliable supply of irrigation water essential for production.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "In astronomical planetary observation, which planet in our Solar System appears brightest in the night sky when viewed from Earth?",
    "options": [
      "Planet Venus",
      "Planet Mars",
      "Planet Saturn",
      "Planet Uranus"
    ],
    "correctAnswer": "Planet Venus",
    "hint": "Known as the 'Morning Star' or 'Evening Star', with an albedo boosted by reflective sulfuric acid clouds.",
    "workedSolution": "Venus is the brightest planet viewed from Earth due to its proximity and reflective cloud cover of sulfuric acid droplets.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "A glass separating funnel is the most appropriate laboratory apparatus for separating which of the following heterogeneous mixtures?",
    "options": [
      "Insoluble powdered sulfur and water",
      "Dissolved sodium chloride salt and water",
      "Miscible vegetable oil and kerosene",
      "Liquid vegetable cooking oil and water"
    ],
    "correctAnswer": "Liquid vegetable cooking oil and water",
    "hint": "Separates immiscible liquids of different densities that form distinct layers.",
    "workedSolution": "Separating funnels separate immiscible liquids of different densities. Vegetable oil and water do not mix, allowing the denser water layer to be drained through the stopcock.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "When a ray of light passes obliquely from an optically less dense medium (such as air) into an optically denser medium (such as glass), it:",
    "options": [
      "Accelerates and refracts away from the normal line",
      "Slows down and refracts towards the normal line",
      "Continues along a path parallel to the incident ray",
      "Reflects back perpendicularly along the surface"
    ],
    "correctAnswer": "Slows down and refracts towards the normal line",
    "hint": "Entering a denser medium decreases wave speed, bending the ray towards the normal ($r < i$).",
    "workedSolution": "By Snell's Law, when light enters an optically denser medium, its propagation speed decreases, causing the ray to refract towards the normal line ($r < i$).",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "In atomic physics, what two fundamental sub-atomic particles reside together within the central atomic nucleus of an atom?",
    "options": [
      "Neutral neutrons and orbiting electrons",
      "Concentric shells and neutral neutrons",
      "Positively charged protons and uncharged neutrons",
      "Negatively charged electrons and protons"
    ],
    "correctAnswer": "Positively charged protons and uncharged neutrons",
    "hint": "Protons and neutrons form the nucleus, while electrons orbit in shells.",
    "workedSolution": "The atomic nucleus contains positively charged protons and neutral neutrons (nucleons). Negatively charged electrons orbit the nucleus in electron shells.",
    "points": 1
  }
];

export const SET_BECE_2023_SCIENCE_P2_QUESTIONS: Paper2Question[] = [
  {
    "questionNumber": "1",
    "isPracticalSectionA": true,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "The diagrams below illustrate the anatomical structures of the human female and male reproductive systems:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Female Reproductive System (Left) --><g transform='translate(20, 25)'><!-- Uterus Body I --><path d='M 70 50 C 55 50 45 80 50 115 L 60 145 L 80 145 L 90 115 C 95 80 85 50 70 50 Z' fill='#1e293b' stroke='#f43f5e' stroke-width='2'/><text x='70' y='92' font-size='13' font-weight='bold' fill='#f43f5e' text-anchor='middle'>I</text><!-- Left Fallopian Tube II & Ovary V --><path d='M 55 55 C 35 40 15 45 10 65 L 12 75' fill='none' stroke='#38bdf8' stroke-width='2.5'/><line x1='28' y1='48' x2='28' y2='36' stroke='#38bdf8' stroke-width='1.5'/><text x='28' y='30' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>II</text><!-- Ovary V --><ellipse cx='12' cy='85' rx='7' ry='10' fill='#facc15' stroke='#ca8a04' stroke-width='1.5'/><line x1='5' y1='85' x2='-4' y2='85' stroke='#facc15' stroke-width='1.5'/><text x='-9' y='89' font-size='12' font-weight='bold' fill='#facc15' text-anchor='end'>V</text><!-- Right Fallopian Tube & Ovary --><path d='M 85 55 C 105 40 125 45 130 65 L 128 75' fill='none' stroke='#38bdf8' stroke-width='2.5'/><ellipse cx='128' cy='85' rx='7' ry='10' fill='#facc15' stroke='#ca8a04' stroke-width='1.5'/><!-- Cervix III & Vagina IV --><line x1='60' y1='145' x2='80' y2='145' stroke='#cbd5e1' stroke-width='2'/><line x1='78' y1='145' x2='96' y2='145' stroke='#cbd5e1' stroke-width='1.5'/><text x='102' y='149' font-size='12' font-weight='bold' fill='#cbd5e1'>III</text><path d='M 60 145 L 63 175 L 77 175 L 80 145' fill='none' stroke='#f43f5e' stroke-width='2'/><line x1='76' y1='165' x2='96' y2='165' stroke='#f43f5e' stroke-width='1.5'/><text x='102' y='169' font-size='12' font-weight='bold' fill='#f43f5e'>IV</text><text x='70' y='202' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Female System</text></g><!-- Divider Line --><line x1='180' y1='20' x2='180' y2='210' stroke='#334155' stroke-width='1.5' stroke-dasharray='4,3'/><!-- Male Reproductive System (Right) --><g transform='translate(195, 25)'><!-- Pelvic & Abdominal Outline --><path d='M 25 15 C 30 60 35 110 50 150' fill='none' stroke='#64748b' stroke-width='1.5'/><!-- Bladder & Prostate Region --><ellipse cx='75' cy='65' rx='16' ry='14' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><!-- Vas Deferens (Sperm Duct) VI --><path d='M 125 145 C 115 70 85 55 75 75 L 75 115' fill='none' stroke='#38bdf8' stroke-width='2.5'/><line x1='102' y1='62' x2='118' y2='52' stroke='#38bdf8' stroke-width='1.5'/><text x='124' y='54' font-size='12' font-weight='bold' fill='#38bdf8'>VI</text><!-- Testis VII inside Scrotum VIII --><path d='M 110 130 C 105 165 145 175 140 135' fill='none' stroke='#94a3b8' stroke-width='2'/><line x1='138' y1='165' x2='152' y2='165' stroke='#94a3b8' stroke-width='1.5'/><text x='157' y='169' font-size='12' font-weight='bold' fill='#94a3b8'>VIII</text><!-- Testis VII --><ellipse cx='125' cy='145' rx='9' ry='12' fill='#facc15' stroke='#ca8a04' stroke-width='1.5'/><line x1='132' y1='145' x2='150' y2='142' stroke='#ca8a04' stroke-width='1.5'/><text x='155' y='145' font-size='12' font-weight='bold' fill='#facc15'>VII</text><!-- Urethra & Penis Structure --><path d='M 75 115 C 75 130 95 140 95 155' fill='none' stroke='#38bdf8' stroke-width='3'/><text x='100' y='202' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Male System</text></g></svg></div>\n\n(i) Name each of the reproductive parts labelled I, II, V, VI, VII, and VIII.\n(ii) State one vital physiological function for each of the parts labelled III, IV, and VII.\n(iii) Identify the specific labelled part where each of the following reproductive events takes place:\n  (α) Fertilization of the ovum;\n  (β) Production of spermatozoa;\n  (γ) Ovulation (release of mature egg).\n(iv) Name two common sexually transmitted infections (STIs) that affect the reproductive organs of both males and females.",
        "workedSolution": "(i) Identification of parts:\n• Part I: Uterus (Womb)\n• Part II: Fallopian tube (Oviduct)\n• Part V: Ovary\n• Part VI: Vas deferens (Sperm duct)\n• Part VII: Testis\n• Part VIII: Scrotum (Scrotal sac)\n\n(ii) Functions of parts:\n• Part III (Cervix): Connects the uterus to the vagina, secretes protective mucus, and dilates to allow passage of the fetus during childbirth.\n• Part IV (Vagina): Acts as the copulatory canal receiving the penis during intercourse and serves as the birth canal during parturition.\n• Part VII (Testis): Produces male gametes (spermatozoa) via spermatogenesis and synthesizes the male sex hormone testosterone.\n\n(iii) Sites of reproductive events:\n• (α) Fertilization: Fallopian tube (Part II)\n• (β) Production of sperm: Testis (Part VII)\n• (γ) Ovulation: Ovary (Part V)\n\n(iv) Sexually transmitted infections:\nGonorrhea, Syphilis, Chlamydia, or HIV/AIDS.",
        "maxMarks": 10
      },
      {
        "subId": "(b)",
        "prompt": "The diagrams below illustrate different hand-operated devices used on an agricultural farm:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 170' width='100%' height='155' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Tool A: Mattock / Pickaxe (Left) --><g transform='translate(20, 20)'><!-- Wooden Handle --><rect x='0' y='38' width='80' height='10' rx='3' fill='#a16207' stroke='#78350f' stroke-width='1.2'/><!-- Heavy Iron Head (Pick on one side, Mattock blade on other) --><path d='M 75 10 L 88 10 L 98 43 L 88 78 L 78 85 L 85 43 Z' fill='#64748b' stroke='#cbd5e1' stroke-width='1.5'/><text x='50' y='115' font-size='14' font-weight='bold' fill='#38bdf8' text-anchor='middle'>A</text></g><!-- Tool B: Dibber (Middle) --><g transform='translate(160, 20)'><!-- Pointed Wooden Stick Dibber --><ellipse cx='15' cy='12' rx='7' ry='4' fill='#d97706' stroke='#92400e'/><path d='M 8 12 L 13 88 L 17 88 L 22 12 Z' fill='#b45309' stroke='#78350f' stroke-width='1.5'/><text x='15' y='115' font-size='14' font-weight='bold' fill='#f59e0b' text-anchor='middle'>B</text></g><!-- Tool C: Hand Fork / Garden Fork (Right) --><g transform='translate(230, 25)'><!-- Metal Prongs --><rect x='0' y='10' width='35' height='6' rx='1' fill='#94a3b8'/><line x1='35' y1='13' x2='35' y2='38' stroke='#cbd5e1' stroke-width='2.5'/><line x1='0' y1='16' x2='0' y2='42' stroke='#94a3b8' stroke-width='2.5'/><line x1='12' y1='16' x2='12' y2='45' stroke='#94a3b8' stroke-width='2.5'/><line x1='23' y1='16' x2='23' y2='45' stroke='#94a3b8' stroke-width='2.5'/><line x1='35' y1='16' x2='35' y2='42' stroke='#94a3b8' stroke-width='2.5'/><!-- Shaft & Wooden Handle --><path d='M 17 10 L 17 -5 C 17 -15 35 -15 45 -5 L 65 15 C 75 25 65 35 55 25 Z' fill='#a16207' stroke='#78350f' stroke-width='1.5' transform='rotate(42 20 10)'/><text x='45' y='110' font-size='14' font-weight='bold' fill='#10b981' text-anchor='middle'>C</text></g><text x='190' y='150' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>HORTICULTURAL FARM TOOLS FOR TILLAGE, NURSERY AND WEEDING</text></svg></div>\n\n(i) Give a general classification name for the devices illustrated above.\n(ii) Name each of the specific devices labelled A, B, and C.\n(iii) State one practical agricultural use for each of the devices named in (b)(ii).\n(iv) State two physical effects that the continuous use of device C produces on garden soil.\n(v) State two routine maintenance practices that prolong the useful working life of device A.",
        "workedSolution": "(i) General classification:\nFarm hand tools (or horticultural gardening tools).\n\n(ii) Names of devices:\n• Device A: Pickaxe (or Mattock)\n• Device B: Dibber (Dibble)\n• Device C: Hand fork (Garden fork)\n\n(iii) Uses of devices:\n• Device A (Pickaxe): Breaking up hard compacted ground, digging stony soils, and uprooting tree roots.\n• Device B (Dibber): Puncturing uniform planting holes in prepared seedbeds for sowing seeds or transplanting seedlings.\n• Device C (Hand fork): Light weeding, breaking soil crusts, and aerating the root zones of vegetable beds.\n\n(iv) Effects of Device C on soil:\n1. Improves soil aeration by loosening compacted surface crusts.\n2. Enhances rainwater infiltration and drainage into the root zone.\n3. Disrupts weed seedling establishment.\n\n(v) Maintenance practices for Device A:\n1. Washing off adhering mud and drying thoroughly after work to prevent corrosion.\n2. Sharpening dull pick and chisel cutting edges regularly.\n3. Coating the metal head with grease or engine oil during storage to prevent rusting.\n4. Ensuring the wooden handle is firmly wedged into the eye of the head.",
        "maxMarks": 10
      },
      {
        "subId": "(c)",
        "prompt": "(i) Draw the conventional electronic circuit symbols for each of the following components:\n  (α) Resistor;\n  (β) p-n junction diode;\n  (γ) Direct-current chemical cell;\n  (δ) Light Emitting Diode (LED).\n(ii) Using the symbols drawn in (c)(i) together with a switch, draw a complete circuit diagram demonstrating the forward biasing of both the p-n junction diode and the Light Emitting Diode (LED):\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 190' width='100%' height='175' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Top Wire with DC Cell and Switch --><line x1='40' y1='40' x2='120' y2='40' stroke='#38bdf8' stroke-width='2'/><!-- DC Cell (Positive long line on left) --><line x1='120' y1='25' x2='120' y2='55' stroke='#10b981' stroke-width='2.5'/><text x='112' y='22' font-size='10' font-weight='bold' fill='#10b981'>+</text><line x1='128' y1='32' x2='128' y2='48' stroke='#ef4444' stroke-width='4'/><text x='134' y='22' font-size='10' font-weight='bold' fill='#ef4444'>-</text><text x='124' y='15' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cell</text><line x1='128' y1='40' x2='200' y2='40' stroke='#38bdf8' stroke-width='2'/><!-- Key / Switch in Closed Position --><circle cx='204' cy='40' r='2.5' fill='#e2e8f0'/><line x1='204' y1='40' x2='230' y2='40' stroke='#e2e8f0' stroke-width='2.5'/><circle cx='230' cy='40' r='2.5' fill='#e2e8f0'/><text x='217' y='26' font-size='9' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Switch</text><line x1='230' y1='40' x2='300' y2='40' stroke='#38bdf8' stroke-width='2'/><line x1='300' y1='40' x2='300' y2='80' stroke='#38bdf8' stroke-width='2'/><!-- Protective Current-Limiting Resistor --><rect x='275' y='80' width='50' height='20' fill='#1e293b' stroke='#a855f7' stroke-width='1.8' transform='rotate(90 300 90)'/><text x='325' y='95' font-size='9' font-weight='bold' fill='#a855f7'>Resistor</text><line x1='300' y1='105' x2='300' y2='140' stroke='#38bdf8' stroke-width='2'/><!-- Bottom Wire with Forward-Biased Diode and LED --><line x1='300' y1='140' x2='240' y2='140' stroke='#38bdf8' stroke-width='2'/><!-- Forward-Biased p-n Junction Diode (Anode pointing left towards positive return) --><g transform='translate(210, 140)'><polygon points='15,-10 -5,0 15,10' fill='#3b82f6' stroke='#1d4ed8'/><line x1='-5' y1='-10' x2='-5' y2='10' stroke='#1d4ed8' stroke-width='2'/><text x='5' y='24' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Diode</text></g><line x1='205' y1='140' x2='145' y2='140' stroke='#38bdf8' stroke-width='2'/><!-- Forward-Biased Light Emitting Diode (LED) with Light Radiation Arrows --><g transform='translate(115, 140)'><polygon points='15,-10 -5,0 15,10' fill='#f59e0b' stroke='#b45309'/><line x1='-5' y1='-10' x2='-5' y2='10' stroke='#b45309' stroke-width='2'/><!-- Emission Arrows --><line x1='5' y1='-12' x2='-2' y2='-22' stroke='#fde047' stroke-width='1.5'/><polygon points='-4,-18 -2,-22 2,-20' fill='#fde047'/><line x1='12' y1='-12' x2='5' y2='-22' stroke='#fde047' stroke-width='1.5'/><polygon points='3,-18 5,-22 9,-20' fill='#fde047'/><text x='5' y='24' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>LED</text></g><line x1='110' y1='140' x2='40' y2='140' stroke='#38bdf8' stroke-width='2'/><line x1='40' y1='140' x2='40' y2='40' stroke='#38bdf8' stroke-width='2'/><text x='180' y='180' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>FORWARD BIASING: ANODES CONNECTED TOWARDS POSITIVE TERMINAL</text></svg></div>\n\n(iii) State the functional effect of the series resistor on the p-n junction diode and the LED when the switch is closed.",
        "workedSolution": "(i) Electronic Symbols:\n• (α) Resistor: A horizontal rectangle (or zig-zag line).\n• (β) p-n junction diode: An equilateral triangle pointing toward a vertical bar ($|\\blacktriangleright|$).\n• (γ) DC cell: A long thin parallel line (positive terminal) paired with a shorter thick parallel line (negative terminal).\n• (δ) LED: A p-n junction diode symbol enclosed with two outward radiating arrows indicating light emission.\n\n(ii) Circuit Diagram (refer to vector schematic):\nA series loop connecting:\n• The positive terminal of the DC cell connected through a closed switch.\n• Connected to a fixed current-limiting resistor.\n• Connected to the anode (triangle base) of the p-n junction diode (forward-biased).\n• Connected to the anode of the Light Emitting Diode (forward-biased).\n• Returning from the LED cathode to the negative terminal of the cell.\n\n(iii) Functional effect of the resistor:\nThe resistor acts as a current-limiting safety device that drops excess supply voltage, preventing large forward currents from overheating and burning out the p-n junction diode and LED.",
        "maxMarks": 10
      },
      {
        "subId": "(d)",
        "prompt": "The following experimental activities were carried out in a chemistry laboratory:\nActivity I: $10.0\\text{ g}$ of table salt was added to $150.0\\text{ mL}$ of water in a beaker and stirred thoroughly.\nActivity II: Vegetable cooking oil was added to water in a flask, shaken vigorously, and allowed to stand for 10 minutes.\nActivity III: $5.0\\text{ g}$ of finely ground wood charcoal was added to water in a beaker, stirred vigorously, and allowed to stand.\n\n(i) State the precise physical observation made in each of Activities I, II, and III.\n(ii) Suggest a general scientific aim for this laboratory investigation.\n(iii) State one clear scientific difference between the mixtures observed in Activity I and Activity III.\n(iv) Name the appropriate laboratory apparatus and separation method used to separate the components in Activity II.",
        "workedSolution": "(i) Observations:\n• Activity I: The salt dissolves completely, forming a clear, transparent, single-phase homogeneous solution.\n• Activity II: The oil and water do not mix; upon standing, they separate into two distinct immiscible layers, with the less-dense oil floating on top of the water.\n• Activity III: The charcoal does not dissolve; it forms a black, cloudy suspension that settles to the bottom as sediment over time.\n\n(ii) Aim of the experiment:\nTo investigate the solubility of various solid and liquid solutes in water and distinguish between true solutions, immiscible liquid mixtures, and suspensions.\n\n(iii) Difference between I and III:\nActivity I forms a true homogeneous solution where solute particles dissolve at the molecular level and do not settle upon standing, whereas Activity III forms a heterogeneous suspension where insoluble particles remain visible and settle out by gravity.\n\n(iv) Separation method for Activity II:\nSeparation using a glass separating funnel (gravity separation of immiscible liquids).",
        "maxMarks": 10
      }
    ]
  },
  {
    "questionNumber": "2",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) What is the protective safety function of a fuse in an electrical appliance?\\n(ii) State two common household appliances that contain protective fuses.",
        "workedSolution": "(i) Function of a fuse:\nA fuse protects electrical appliances and building wiring from overcurrent damage by melting its thin low-melting-point alloy wire when current exceeds the safe rated amperage, breaking the circuit to prevent electrical fires and equipment damage.\n\n(ii) Household appliances with fuses:\nElectric pressing iron, microwave oven, television receiver, electric kettle, or desktop computer power supply.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "(i) What is teenage pregnancy in social and health education?\\n(ii) State two major socioeconomic or behavioral causes of teenage pregnancy in communities.",
        "workedSolution": "(i) Definition of teenage pregnancy:\nPregnancy occurring in an adolescent female between the ages of 13 and 19 years who has not reached biological or social maturity.\n\n(ii) Causes of teenage pregnancy:\n1. Inadequate comprehensive reproductive sexual health education and lack of access to family planning services.\n2. Poverty and financial deprivation leading young girls into transactional sexual exploitation.\n3. Negative peer pressure, substance abuse, and lack of parental supervision.",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "State three practical safety precautions that must be observed to prevent accidents when working in a science laboratory.",
        "workedSolution": "1. Always wear protective safety goggles, a chemical-resistant laboratory coat, and enclosed footwear.\n2. Never taste, ingest, or directly inhale chemical reagents; use a wafting motion to check odors under a fume hood.\n3. Know the locations and correct operation of emergency safety equipment (fire extinguishers, eyewash stations, first-aid kits).\n4. Tie back long hair and avoid wearing loose jewelry near open flames.",
        "maxMarks": 5
      },
      {
        "subId": "(d)",
        "prompt": "(i) State two unsustainable human practices that pollute and destroy natural freshwater bodies in Ghana.\\n(ii) Give two effective methods of conserving and protecting municipal water bodies.",
        "workedSolution": "(i) Practices destroying water bodies:\n1. Illegal alluvial gold mining (galamsey) that discharges toxic mercury and silt into rivers.\n2. Indiscriminate dumping of untreated industrial chemical effluents and raw domestic sewage into streams.\n3. Agricultural runoff carrying synthetic pesticides and chemical fertilizers into waterways.\n\n(ii) Methods of conserving water bodies:\n1. Planting protective vegetation buffer strips (afforestation) along riverbanks to prevent siltation.\n2. Enforcing environmental legislation against illegal mining and industrial waste discharge.\n3. Constructing wastewater treatment facilities to treat effluents before discharge.",
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
        "prompt": "(i) Define the biological process of aerobic cellular respiration.\\n(ii) State the fundamental biochemical difference between aerobic respiration and anaerobic respiration.",
        "workedSolution": "(i) Definition of aerobic respiration:\nThe catabolic biochemical process taking place within the mitochondria of living cells whereby organic food molecules (glucose) are completely broken down in the presence of molecular oxygen to yield carbon dioxide, water, and metabolic energy:\n$$\\text{C}_6\\text{H}_{12}\\text{O}_{6(aq)} + 6\\text{O}_{2(g)} \\to 6\\text{CO}_{2(g)} + 6\\text{H}_2\\text{O}_{(l)} + 38\\text{ ATP}$$\n\n(ii) Key difference:\nAerobic respiration requires molecular oxygen and oxidizes glucose completely to yield high energy ($36-38\\text{ ATP}$ per glucose molecule), yielding $\\text{CO}_2$ and $\\text{H}_2\\text{O}$. Anaerobic respiration occurs in the absence of oxygen, breaks down glucose incompletely to yield low energy ($2\\text{ ATP}$), yielding lactic acid (in animals) or ethanol and $\\text{CO}_2$ (in yeast).",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "(i) Explain the physical concept of potential difference across an electrical conductor.\\n(ii) The potential difference measured across the terminals of a $100.0\\ \\Omega$ resistor is $250.0\\text{ V}$. Calculate the electric current flowing through the resistor.",
        "workedSolution": "(i) Concept of potential difference:\nThe work done per unit electric charge in moving a charge between two points in an electric circuit ($V = \\frac{W}{Q}$), measured in Volts ($\\text{V}$).\n\n(ii) Current calculation:\nBy Ohm's Law:\n$$I = \\frac{V}{R}$$\nSubstitute given values ($V = 250.0\\text{ V}$, $R = 100.0\\ \\Omega$):\n$$I = \\frac{250.0\\text{ V}}{100.0\\ \\Omega} = 2.50\\text{ Amperes (A)}$$\nAnswer: The current flowing through the resistor is $$2.50\\text{ A}$$.",
        "maxMarks": 6
      },
      {
        "subId": "(c)",
        "prompt": "Concerning the Swollen Shoot disease in cash crop agriculture:\\n(i) Which commercial cash crop is attacked by this disease?\\n(ii) Name the causative pathogen of the disease;\\n(iii) State the biological vector that transmits the disease;\\n(iv) Give two agronomic methods used to control the spread of the disease.",
        "workedSolution": "(i) Crop affected:\nCocoa (*Theobroma cacao*).\n\n(ii) Causative pathogen:\nCocoa Swollen Shoot Virus (CSSV).\n\n(iii) Method of spread / Vector:\nMealybugs (*Pseudococcus njalensis* / *Ferrisia virgata*), which transfer the virus while feeding on plant sap.\n\n(iv) Methods of control:\n1. Cutting out and burning infected cocoa trees (along with adjacent barrier trees) to eliminate infection sources.\n2. Applying systemic chemical insecticides to control mealybug vector populations.\n3. Planting virus-tolerant or resistant hybrid cocoa varieties developed by research institutes (such as CRIG).",
        "maxMarks": 5
      },
      {
        "subId": "(d)",
        "prompt": "Consider the two hypothetical chemical elements: $_{3}^{7}\\text{X}$ and $_{9}^{20}\\text{Y}$:\\n(i) Write the ground-state Bohr electronic configuration for element Y;\\n(ii) State the formula and charge of the stable ion formed by element X to attain an inert gas electron configuration.",
        "workedSolution": "(i) Electronic configuration for Y ($Z = 9$, Fluorine):\nWith 9 electrons:\n• Shell 1 (K): 2 electrons\n• Shell 2 (L): 7 electrons\nConfiguration: $$2, 7$$\n\n(ii) Stable ion of X ($Z = 3$, Lithium):\nElement X has an electronic configuration of $2, 1$. It loses its single valence electron to achieve a stable duet configuration, forming the monovalent cation:\n$$\\text{X}^+\\quad (\\text{or } \\text{Li}^+)$$\nAnswer: The ion carries a net charge of $$+1$$.",
        "maxMarks": 3
      }
    ]
  },
  {
    "questionNumber": "4",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "What is an acid-base neutralization reaction in chemistry? Write a balanced word equation for a typical neutralization reaction.",
        "workedSolution": "Definition & Equation:\nA chemical reaction in which an acid reacts with an equivalent amount of a base (alkali) to produce a neutral salt and water:\n$$\\text{Acid} + \\text{Base} \\to \\text{Salt} + \\text{Water}$$\nIonic representation:\n$$\\text{H}^+_{(aq)} + \\text{OH}^-_{(aq)} \\to \\text{H}_2\\text{O}_{(l)}$$",
        "maxMarks": 4
      },
      {
        "subId": "(b)",
        "prompt": "State three diagnostic physical properties of soil that influence crop cultivation.",
        "workedSolution": "1. Soil Texture: The relative proportion of sand, silt, and clay mineral particles determining drainage and tillage.\n2. Soil Structure: The physical arrangement and aggregation of soil particles into crumbs or blocks, governing root penetration and aeration.\n3. Soil Porosity / Aeration: The volume fraction of pore spaces holding air and capillary water.\n4. Soil Color: An indicator of organic matter content, drainage status, and mineral weathering (e.g., dark topsoil indicates high humus).",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "(i) Define the physical quantity mechanical power, stating its S.I. unit.\n(ii) A mechanical hoisting machine lifts a packing case of mass $50.0\\text{ kg}$ vertically through a building height of $10.0\\text{ m}$ in a time duration of $30.0\\text{ seconds}$. Calculate the power output of the machine:\n$$[\\text{Take acceleration due to gravity, } g = 10.0\\text{ m s}^{-2}]$$",
        "workedSolution": "(i) Definition of power:\nThe time rate of doing mechanical work or transforming energy ($P = \\frac{W}{t}$), measured in Watts ($\\text{W} = \\text{J s}^{-1}$).\n\n(ii) Power calculation:\n• Step 1: Work done to overcome gravity ($W = mgh$):\n$$W = 50.0\\text{ kg} \\times 10.0\\text{ m s}^{-2} \\times 10.0\\text{ m} = 5,000.0\\text{ Joules (J)}$$\n• Step 2: Calculate power output ($P = \\frac{W}{t}$):\n$$P = \\frac{5,000.0\\text{ J}}{30.0\\text{ s}} = 166.67\\text{ Watts (W)}$$\nAnswer: The power output of the machine is $$166.67\\text{ W}$$.",
        "maxMarks": 7
      },
      {
        "subId": "(d)",
        "prompt": "State three major areas in modern society where scientific and technological innovations have significantly improved human living standards.",
        "workedSolution": "1. Modern Agriculture and Food Processing: Mechanized tractors, high-yielding hybrid seeds, and irrigation systems that boost food production.\n2. Healthcare and Medical Diagnostics: Automated clinical analyzers, MRI scanning, laser surgery, and synthetic vaccines that reduce mortality.\n3. Information and Communication Technology: Global internet connectivity, mobile computing, and satellite telecommunications.\n4. Renewable Energy and Transportation: High-speed electric trains, solar photovoltaics, and commercial aviation.",
        "maxMarks": 4
      }
    ]
  },
  {
    "questionNumber": "5",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "State three agronomic ways in which applying organic mulch onto vegetable garden beds restores and protects soil resources.",
        "workedSolution": "1. Moisture Conservation: Forms an insulating surface barrier that reduces direct solar evaporation, keeping the root zone moist.\n2. Humus and Nutrient Restoration: Decomposing organic mulch adds organic matter (humus) that releases nitrogen, phosphorus, and potassium into the soil.\n3. Weed Suppression: Blocks sunlight from reaching the soil surface, inhibiting weed seed germination and growth.\n4. Erosion and Thermal Protection: Moderates soil temperature and absorbs raindrop impact to prevent surface crusting and erosion.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "(i) Name the two elemental chemical gases that react together to synthesize ammonia gas.\\n(ii) Write a balanced chemical equation for the industrial synthesis of ammonia from these elements.",
        "workedSolution": "(i) Constituent elements:\nNitrogen gas ($\\text{N}_2$) and Hydrogen gas ($\\text{H}_2$).\n\n(ii) Balanced chemical equation (Haber Process):\n$$\\text{N}_{2(g)} + 3\\text{H}_{2(g)} \\rightleftharpoons 2\\text{NH}_{3(g)}$$\nOne mole of nitrogen gas reacts reversibly with three moles of hydrogen gas to produce two moles of ammonia gas.",
        "maxMarks": 4
      },
      {
        "subId": "(c)",
        "prompt": "The following biological feeding interactions occur within a terrestrial ecological community:\n1. Man feeds on grasscutter;\n2. Toad feeds on grasshopper;\n3. Snake feeds on toad;\n4. Goat feeds on grass;\n5. Man feeds on hawk;\n6. Grasshopper feeds on grass;\n7. Hawk feeds on snake;\n8. Grasscutter feeds on grass.\n\nUsing all the information provided above, construct a food web showing the feeding relationships and trophic levels.",
        "workedSolution": "Ecological Food Web Construction:\n\n• Base Primary Producer:\n  **Grass**\n\n• Primary Consumers (Herbivores feeding on Grass):\n  - **Grasshopper**\n  - **Goat**\n  - **Grasscutter**\n\n• Secondary Consumers (Carnivores):\n  - **Toad** (feeds on Grasshopper)\n  - **Man** (feeds on Goat and Grasscutter)\n\n• Tertiary Consumers:\n  - **Snake** (feeds on Toad)\n\n• Quaternary / Apex Predators:\n  - **Hawk** (feeds on Snake)\n  - **Man** (feeds on Hawk, Goat, and Grasscutter)\n\nDiagrammatic Representation:\n```\n          Man <------------------ Hawk\n         ^   ^                     ^\n        /     \\                    |\n      Goat  Grasscutter          Snake\n        ^        ^                 ^\n         \\      /                  |\n          \\    /                 Toad\n           \\  /                    ^\n            \\/                     |\n           Grass ------------> Grasshopper\n```",
        "maxMarks": 6
      },
      {
        "subId": "(d)",
        "prompt": "(i) What is a galaxy in astrophysics?\\n(ii) State the astronomical relationship between stars and galaxies.\\n(iii) Explain briefly what is meant by the Milky Way.",
        "workedSolution": "(i) Definition of galaxy:\nAn immense, gravitationally bound cosmic system consisting of billions of stars, stellar remnants, interstellar gas clouds, dust, and dark matter orbiting a common center of mass.\n\n(ii) Relationship between stars and galaxies:\nStars are individual stellar bodies that serve as the basic structural units of a galaxy. A galaxy is a collection of hundreds of billions of stars held together by gravitational attraction.\n\n(iii) The Milky Way:\nThe barred spiral galaxy that contains our Solar System. From Earth, it appears across the night sky as a hazy, luminous band of light produced by millions of unresolved distant stars situated within the galactic plane.",
        "maxMarks": 5
      }
    ]
  },
  {
    "questionNumber": "6",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) State three detrimental effects of unchecked soil erosion on the growth and yield of agricultural crops.\\n(ii) Mention one effective soil conservation method used to control soil erosion on sloping land.",
        "workedSolution": "(i) Detrimental effects of soil erosion:\n1. Strips away the fertile topsoil (Horizon A), removing organic humus and plant nutrients (NPK).\n2. Exposes and damages crop root systems, weakening plant anchorage and causing lodging.\n3. Decreases the soil's effective depth and water-holding capacity, making crops vulnerable to drought stress.\n\n(ii) Erosion control method on slopes:\nContour ploughing and terracing across the slope (or establishing vegetative vetiver grass strips / cover cropping).",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "(i) Name two commercial enterprises or businesses that rely directly on applied scientific principles.\\n(ii) State the fundamental scientific principles underlying the industrial operation of each business named.",
        "workedSolution": "(i) Science-related enterprises:\n1. Soap and Detergent Manufacturing Enterprise\n2. Commercial Baking / Brewing Enterprise\n\n(ii) Underlying scientific principles:\n• Soap Manufacturing: Operates on saponification—the base-catalyzed hydrolysis of vegetable or animal fats with sodium hydroxide to produce soap (sodium carboxylate) and glycerol.\n• Commercial Baking / Brewing: Operates on anaerobic fermentation—yeast (*Saccharomyces cerevisiae*) converts sugars into carbon dioxide gas (which leavens dough) and ethanol under warm conditions.",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "(i) Explain the biological mechanism by which the female Anopheles mosquito transmits malaria to human beings.\\n(ii) State one chemical method used to control mosquito vector populations.",
        "workedSolution": "(i) Transmission mechanism:\nWhen an infected female *Anopheles* mosquito takes a blood meal from a human, it injects saliva containing anticoagulant and infectious *Plasmodium* sporozoites into the host's bloodstream. The sporozoites travel to the liver, reproduce, and invade red blood cells, causing malaria.\n\n(ii) Chemical control method:\nIndoor Residual Spraying (IRS) of interior walls with long-lasting chemical insecticides (such as pyrethroids or organophosphates) to kill resting adult mosquitoes (or applying chemical larvicides to stagnant water).",
        "maxMarks": 5
      },
      {
        "subId": "(d)",
        "prompt": "(i) Name two fundamental base units in the International System of Units (S.I.).\\n(ii) State the specific physical quantity measured by each of the units named in (d)(i).",
        "workedSolution": "(i) Fundamental base units:\n1. Kilogram (symbol: $\\text{kg}$)\n2. Meter (symbol: $\\text{m}$)\n*(Alternatives: Second [s], Ampere [A], Kelvin [K], Mole [mol], Candela [cd])*\n\n(ii) Physical quantities measured:\n• The kilogram measures **Mass**.\n• The meter measures **Length** (or distance).\n• *(The second measures Time; the ampere measures Electric Current)*.",
        "maxMarks": 5
      }
    ]
  }
];

export const SET_BECE_2023_SCIENCE_P1 = {
  id: "paper_2023_variant_p1",
  year: 2023,
  setNumber: 121,
  paperType: 1,
  subject: "Integrated Science",
  title: "2023 BECE Integrated Science Paper 1 (Objective Test)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: SET_BECE_2023_SCIENCE_P1_QUESTIONS
};

export const SET_BECE_2023_SCIENCE_P2 = {
  id: "paper_2023_variant_p2",
  year: 2023,
  setNumber: 121,
  paperType: 2,
  subject: "Integrated Science",
  title: "2023 BECE Integrated Science Paper 2 (Theory & Practical)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 105,
  instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
  totalQuestions: 6,
  questions: SET_BECE_2023_SCIENCE_P2_QUESTIONS
};

export const SET_BECE_2023_SCIENCE_COMPLETE = {
  year: 2023,
  isVariant: true,
  setNumber: 121,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: SET_BECE_2023_SCIENCE_P1,
  paper2: SET_BECE_2023_SCIENCE_P2,
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 3,
    sourcePhotographsIntegrated: ["IMG_2613.jpg", "IMG_2614.jpg"],
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
