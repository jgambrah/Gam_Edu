/**
 * SET 141: BECE Integrated Science Mock 10 (Final Benchmark Examination Suite)
 * Full Mock Examination Suite (Paper 1 Objective CBT + Paper 2 Theory & Practical)
 * Proprietary calibrated content © GAM IT Solutions (GAM EDU). All rights reserved.
 */

interface QuestionItem {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

const balancedMock10P1: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "Which of the following cellular organisms reproduces by budding and is widely utilized in the commercial brewing of local pito and bread baking in Ghana?",
    "options": [
      "Amoeba",
      "Paramecium",
      "Spirogyra",
      "Yeast"
    ],
    "correctAnswer": "Yeast",
    "hint": "A unicellular eukaryotic fungus (Saccharomyces cerevisiae).",
    "workedSolution": "Yeast is a unicellular fungus that reproduces asexually by budding and ferments sugars anaerobically to produce ethanol and carbon dioxide for baking and brewing.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "An electric blender rated at 400 W is operated for 30 minutes in a kitchen. Calculate the electrical energy consumed in kilowatt-hours (kWh).",
    "options": [
      "0.20 kWh",
      "2.00 kWh",
      "12.00 kWh",
      "120.00 kWh"
    ],
    "correctAnswer": "0.20 kWh",
    "hint": "Power in kW = 400 / 1000 = 0.4 kW; Time = 0.5 h.",
    "workedSolution": "Power in kW = 400 W / 1000 = 0.4 kW. Time in hours = 30 min / 60 = 0.5 h. Energy = 0.4 kW x 0.5 h = 0.20 kWh.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Which of the following rock types is formed when eroded rock sediments are transported by rivers, deposited in horizontal layers, and cemented over millions of years?",
    "options": [
      "Intrusive igneous rock",
      "Metamorphic rock",
      "Sedimentary rock",
      "Volcanic basalt"
    ],
    "correctAnswer": "Sedimentary rock",
    "hint": "Characterized by strata layers and fossil inclusions (e.g., sandstone, limestone).",
    "workedSolution": "Sedimentary rocks (such as sandstone, limestone, and shale) form through the accumulation, compaction, and cementation of mineral sediments and organic remains.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "What is the systematic chemical formula for binary Iron(III) chloride?",
    "options": [
      "FeCl₃",
      "FeCl₂",
      "Fe₂Cl",
      "Fe₃Cl"
    ],
    "correctAnswer": "FeCl₃",
    "hint": "Iron has a valency of 3 (Fe³⁺) and Chlorine has a valency of 1 (Cl⁻).",
    "workedSolution": "Iron(III) has a valency of +3 and chloride has a valency of -1. Balancing charges gives the stoichiometric formula FeCl₃.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "The human skeletal joint that connects the femur (thigh bone) to the pelvic girdle, allowing rotational movement in all planes, is a",
    "options": [
      "ball-and-socket joint.",
      "hinge joint.",
      "pivot joint.",
      "suture joint."
    ],
    "correctAnswer": "ball-and-socket joint.",
    "hint": "A spherical bone head fitting into a cup-like socket.",
    "workedSolution": "The hip joint is a synovial ball-and-socket joint where the hemispherical head of the femur articulates with the acetabulum of the pelvis, allowing 360-degree rotation.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Which of the following physical changes occurs when solid ammonium chloride crystals are gently heated in a dry test tube?",
    "options": [
      "Evaporation",
      "Melting",
      "Condensation",
      "Sublimation"
    ],
    "correctAnswer": "Sublimation",
    "hint": "Changes directly from solid to gas without forming a liquid.",
    "workedSolution": "Ammonium chloride sublimes on heating, converting directly from solid white crystals into dense white vapors that recrystallize on cooler test tube surfaces.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "A horizontal force of 50 N is applied to pull a cart across a smooth floor through a distance of 8 m. Calculate the work done.",
    "options": [
      "6.25 J",
      "40.00 J",
      "400.00 J",
      "800.00 J"
    ],
    "correctAnswer": "400.00 J",
    "hint": "Work Done = Force x Distance = 50 x 8.",
    "workedSolution": "Work Done = Force x Distance = 50 N x 8 m = 400.00 Joules.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Which of the following management practices in commercial cattle farming involves the physical branding, ear-tagging, or tattooing of animals for easy identification?",
    "options": [
      "Castration",
      "Identification",
      "Dehorning",
      "Culling"
    ],
    "correctAnswer": "Identification",
    "hint": "Essential for accurate breeding and medical record keeping.",
    "workedSolution": "Animal identification (ear-notching, ear-tagging, tattooing, branding) allows farmers to identify individual animals for health, production, and parentage records.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "Which of the following elements has the Latin-derived chemical symbol Au?",
    "options": [
      "Silver",
      "Copper",
      "Aluminum",
      "Gold"
    ],
    "correctAnswer": "Gold",
    "hint": "Derived from the Latin word Aurum.",
    "workedSolution": "Au is the chemical symbol for Gold (from Latin *Aurum*). Ag is silver (*Argentum*), Cu is copper (*Cuprum*), and Al is aluminum.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "The structure in the human eye that regulates the amount of entering light by dilating or constricting the pupil is the",
    "options": [
      "iris.",
      "retina.",
      "cornea.",
      "lens."
    ],
    "correctAnswer": "iris.",
    "hint": "The colored circular diaphragm containing smooth muscles.",
    "workedSolution": "The iris contains antagonistic circular and radial smooth muscles that constrict or dilate the central pupil opening to control light entering the eyeball.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "A simple machine with an effort force of 25 N lifts a load of 100 N. Calculate the Mechanical Advantage (MA) of the machine.",
    "options": [
      "0.25",
      "4.00",
      "75.00",
      "250.00"
    ],
    "correctAnswer": "4.00",
    "hint": "Mechanical Advantage = Load / Effort = 100 / 25.",
    "workedSolution": "MA = Load / Effort = 100 N / 25 N = 4.00.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "Which of the following substances will produce a milky precipitate of calcium carbonate when carbon dioxide gas is bubbled through it?",
    "options": [
      "Dilute hydrochloric acid",
      "Sodium chloride solution",
      "Distilled water",
      "Calcium hydroxide solution"
    ],
    "correctAnswer": "Calcium hydroxide solution",
    "hint": "Commonly known as limewater.",
    "workedSolution": "Carbon dioxide reacts with aqueous calcium hydroxide (limewater) to precipitate insoluble white calcium carbonate, turning the solution milky: CO₂ + Ca(OH)₂ -> CaCO₃↓ + H₂O.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "Which of the following organs is the primary excretory organ responsible for filtering metabolic urea from the blood in humans?",
    "options": [
      "Liver",
      "Kidney",
      "Skin",
      "Lungs"
    ],
    "correctAnswer": "Kidney",
    "hint": "Produces liquid urine by filtering blood plasma.",
    "workedSolution": "The kidneys filter blood plasma, removing urea, excess mineral salts, and surplus water to form urine. The liver synthesizes urea, but the kidneys excrete it.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "When white light passes through a triangular glass prism, it is separated into a spectrum of colors. This optical phenomenon is called",
    "options": [
      "reflection of light.",
      "dispersion of light.",
      "refraction of light.",
      "rectilinear propagation."
    ],
    "correctAnswer": "dispersion of light.",
    "hint": "Splitting of white light into its constituent wavelengths.",
    "workedSolution": "Dispersion is the separation of composite white light into its constituent spectral colors (red, orange, yellow, green, blue, indigo, violet) due to differing refraction angles.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "What is the systematic chemical formula for binary Sodium oxide?",
    "options": [
      "Na₂O",
      "NaO",
      "NaO₂",
      "Na₂O₂"
    ],
    "correctAnswer": "Na₂O",
    "hint": "Sodium has valency 1 (Na⁺) and Oxygen has valency 2 (O²⁻).",
    "workedSolution": "Sodium has a valency of +1 and oxygen has a valency of -2. Balancing charges requires two sodium ions per oxide ion, yielding Na₂O.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "Which of the following agricultural tools is designed with sharp curved blades for cutting mature cereal grains like rice and wheat?",
    "options": [
      "Pickaxe",
      "Sickle",
      "Garden rake",
      "Hand trowel"
    ],
    "correctAnswer": "Sickle",
    "hint": "A curved handheld harvesting blade.",
    "workedSolution": "A sickle has a curved steel blade designed for cutting and harvesting cereal stalks (rice, millet) and gathering forage grass.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "A stone of mass 2 kg is lifted vertically to a shelf 3 m above the floor. Calculate the potential energy gained by the stone. [g = 10 m s⁻²]",
    "options": [
      "6 J",
      "20 J",
      "60 J",
      "150 J"
    ],
    "correctAnswer": "60 J",
    "hint": "P.E. = m x g x h = 2 x 10 x 3.",
    "workedSolution": "P.E. = m x g x h = 2 kg x 10 m s⁻² x 3 m = 60 Joules.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "Which of the following blood vessels carries oxygenated blood directly from the lungs into the left atrium of the human heart?",
    "options": [
      "Pulmonary artery",
      "Systemic aorta",
      "Vena cava",
      "Pulmonary vein"
    ],
    "correctAnswer": "Pulmonary vein",
    "hint": "The only adult vein carrying oxygenated blood.",
    "workedSolution": "Pulmonary veins transport freshly oxygenated blood from the alveolar capillary beds of the lungs into the left atrium of the heart.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "Which of the following methods of heat transfer occurs through electromagnetic infrared waves and does not require any material medium?",
    "options": [
      "Radiation",
      "Conduction",
      "Convection",
      "Sublimation"
    ],
    "correctAnswer": "Radiation",
    "hint": "How solar heat traverses the vacuum of space to reach Earth.",
    "workedSolution": "Thermal radiation transfers energy via electromagnetic infrared waves through empty space without requiring a material medium.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "What is the pH range of basic (alkaline) solutions on the standard universal pH indicator scale?",
    "options": [
      "Greater than 7",
      "Less than 7",
      "Exactly 7",
      "Between 1 and 3"
    ],
    "correctAnswer": "Greater than 7",
    "hint": "Acids have pH < 7; neutral is 7.",
    "workedSolution": "On the pH scale, neutral solutions have pH = 7, acidic solutions have pH < 7, and alkaline (basic) solutions have pH values greater than 7 (up to 14).",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "An unmagnetized steel bar placed inside a wire coil carrying direct current becomes magnetized. This method is called the",
    "options": [
      "single touch method.",
      "induction method.",
      "divided touch method.",
      "electrical method."
    ],
    "correctAnswer": "electrical method.",
    "hint": "Uses a solenoid carrying direct electric current.",
    "workedSolution": "Placing a ferromagnetic steel bar inside a DC solenoid aligns its internal magnetic domains via the electrical method of magnetization.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "Which of the following insect pests attacks cereal crops by having its caterpillars bore into the interior of plant stems?",
    "options": [
      "Cocoa capsid",
      "Cotton stainer",
      "Maize stem borer",
      "Aphid"
    ],
    "correctAnswer": "Maize stem borer",
    "hint": "Busseola fusca larva boring into maize and sorghum stalks.",
    "workedSolution": "The stem borer is an agricultural insect pest whose larval caterpillars bore into and feed on internal stem tissues of cereal crops, causing lodging.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "What is the total number of protons present in the nucleus of an atom of Sodium (₁₁Na)?",
    "options": [
      "11",
      "12",
      "23",
      "34"
    ],
    "correctAnswer": "11",
    "hint": "The atomic number represents the number of protons.",
    "workedSolution": "Sodium has atomic number 11, meaning its nucleus contains exactly 11 positive protons.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "The safety device connected in the Live wire of an electrical circuit to melt and break the connection when current exceeds safe limits is a",
    "options": [
      "rheostat.",
      "voltmeter.",
      "fuse.",
      "capacitor."
    ],
    "correctAnswer": "fuse.",
    "hint": "Contains a thin low-melting-point alloy wire.",
    "workedSolution": "A fuse contains a low-melting-point wire designed to melt when electrical current exceeds safe limits, protecting wiring and appliances.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "Which of the following parts of a flowering plant develops into a viable seed after successful double fertilization?",
    "options": [
      "Maternal ovary",
      "Slender style",
      "Sticky stigma",
      "Fertilized ovule"
    ],
    "correctAnswer": "Fertilized ovule",
    "hint": "The ovary ripens into the fruit; this inner structure ripens into the seed.",
    "workedSolution": "Following fertilization, the ovule develops into a mature, viable seed containing an embryo and food reserves, while the surrounding ovary wall forms the fruit pericarp.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "Which of the following simple machines functions as a second-class lever where the load is between the fulcrum and effort?",
    "options": [
      "Crowbar",
      "Wheelbarrow",
      "Pair of tweezers",
      "Scissors"
    ],
    "correctAnswer": "Wheelbarrow",
    "hint": "The wheel axle is the fulcrum; load basin is in the center.",
    "workedSolution": "In a second-class lever (like a wheelbarrow or bottle opener), the load is situated between the fulcrum and the applied effort.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "What color change is observed when blue litmus paper is dipped into an aqueous solution of ethanoic acid (vinegar)?",
    "options": [
      "Remains blue",
      "Turns dark green",
      "Turns red",
      "Turns colorless"
    ],
    "correctAnswer": "Turns red",
    "hint": "Acidic solutions turn blue litmus red.",
    "workedSolution": "Vinegar contains ethanoic acid (pH < 7). Acidic solutions turn blue litmus paper red.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "In a crop rotation system, leguminous crops such as cowpea and groundnut are cultivated primarily to",
    "options": [
      "extract deep subterranean water from bedrock.",
      "replenish soil nitrates via root nodule bacteria.",
      "prevent earthworms from entering topsoil.",
      "shade out all weed seeds permanently."
    ],
    "correctAnswer": "replenish soil nitrates via root nodule bacteria.",
    "hint": "Symbiotic relationship with nitrogen-fixing Rhizobium bacteria.",
    "workedSolution": "Legumes harbor symbiotic *Rhizobium* bacteria in their root nodules that fix atmospheric nitrogen gas into plant-available nitrates, replenishing soil fertility.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "The pressure exerted by a column of liquid at rest increases directly with an increase in the",
    "options": [
      "surface area of the container.",
      "curvature of the container walls.",
      "depth of the liquid column.",
      "volume of air above the container."
    ],
    "correctAnswer": "depth of the liquid column.",
    "hint": "P = rho x g x h.",
    "workedSolution": "Liquid hydrostatic pressure is given by P = ρgh. It is directly proportional to depth (h) and liquid density (ρ), independent of vessel shape.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Which of the following childhood communicable diseases is caused by an airborne virus and presents with high fever, cough, and a widespread skin rash?",
    "options": [
      "Cholera",
      "Measles",
      "Tetanus",
      "Typhoid"
    ],
    "correctAnswer": "Measles",
    "hint": "Controlled through routine infant vaccination.",
    "workedSolution": "Measles is a contagious viral infection transmitted via airborne respiratory droplets, characterized by fever, cough, Koplik's spots, and a widespread skin rash.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "What is the ground-state Bohr electronic configuration of an atom of Aluminum (₁₃Al)?",
    "options": [
      "2, 8, 1",
      "2, 8, 2",
      "2, 8, 3",
      "2, 8, 8, 3"
    ],
    "correctAnswer": "2, 8, 3",
    "hint": "Fills 2 in the first shell, 8 in the second shell, and 3 in the third shell.",
    "workedSolution": "Aluminum has atomic number 13. Its electron arrangement fills 2 in the K-shell, 8 in the L-shell, and 3 in the M-shell (2, 8, 3).",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "Which of the following devices transforms electrical energy into kinetic mechanical energy in everyday domestic use?",
    "options": [
      "Electric iron",
      "Fluorescent tube",
      "Electric bell",
      "Electric motor"
    ],
    "correctAnswer": "Electric motor",
    "hint": "Drives blenders, fans, and water pumps.",
    "workedSolution": "An electric motor uses magnetic forces to convert electrical energy into rotating mechanical kinetic energy.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "Which agricultural soil type has the highest water retention capacity and becomes sticky and moldable when wet?",
    "options": [
      "Sandy soil",
      "Clayey soil",
      "Coarse gravel",
      "Sandy loam"
    ],
    "correctAnswer": "Clayey soil",
    "hint": "Composed of microscopic mineral particles (< 0.002 mm).",
    "workedSolution": "Clay soil consists of fine mineral particles with small micropores that hold water tightly, making it plastic and sticky when wet.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "The transfer of thermal heat through fluids by bulk circulation of heated rising particles and cooler sinking particles is called",
    "options": [
      "conduction.",
      "radiation.",
      "convection.",
      "absorption."
    ],
    "correctAnswer": "convection.",
    "hint": "Density-driven circulation currents in liquids and gases.",
    "workedSolution": "Convection is the transfer of heat in fluids via bulk circulation currents set up by temperature-induced density differences.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "What is the combining power (valency) of the nitrate radical (NO₃) in chemical compounds?",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "correctAnswer": "1",
    "hint": "Carries a single negative charge (NO₃⁻).",
    "workedSolution": "The nitrate radical (NO₃⁻) carries a single negative charge, giving it an ionic combining power (valency) of 1.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "Which human tooth type has a single sharp pointed crown adapted for gripping and tearing tough food items like meat?",
    "options": [
      "Incisor",
      "Premolar",
      "Molar",
      "Canine"
    ],
    "correctAnswer": "Canine",
    "hint": "Pointed tooth situated between incisors and premolars.",
    "workedSolution": "Canine teeth possess sharp, pointed crowns adapted specifically for gripping and tearing tough food materials.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "Which of the following metals is used in electrical transmission lines and cooking cookware due to its low density and excellent thermal conductivity?",
    "options": [
      "Lead",
      "Mercury",
      "Aluminum",
      "Tin"
    ],
    "correctAnswer": "Aluminum",
    "hint": "Lightweight, non-magnetic, corrosion-resistant metal.",
    "workedSolution": "Aluminum is lightweight, resists corrosion, and conducts heat and electricity efficiently, making it suitable for overhead cables and cookware.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "The physical change of state where a solid changes into a liquid upon absorbing thermal heat is called",
    "options": [
      "melting.",
      "boiling.",
      "condensation.",
      "freezing."
    ],
    "correctAnswer": "melting.",
    "hint": "Occurs at 0°C for pure ice.",
    "workedSolution": "Melting (fusion) is the physical phase transition from solid to liquid occurring at a definite melting point upon heat absorption.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "Which of the following farm animals is housed in an elevated wire and wooden hutch?",
    "options": [
      "Pig",
      "Sheep",
      "Goat",
      "Rabbit"
    ],
    "correctAnswer": "Rabbit",
    "hint": "Small domestic herbivore raised in hutches.",
    "workedSolution": "Rabbits are traditionally housed in hutches—elevated cages designed to provide ventilation and protection from predators.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "An aqueous solution that turns red litmus paper blue and has a slippery feel is classified as",
    "options": [
      "an acid.",
      "an alkali.",
      "a neutral salt.",
      "an organic ester."
    ],
    "correctAnswer": "an alkali.",
    "hint": "A water-soluble base with pH > 7.",
    "workedSolution": "An alkali is a water-soluble base that feels slippery/soapy and turns red litmus paper blue.",
    "points": 1
  }
];

const paper2Mock10Questions = [
  {
    "questionNumber": "1",
    "isPracticalSectionA": true,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Figure 1(a) illustrates an experiment set up to determine the mass of an unknown body M₂ using the principle of moments on a uniform metre rule:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Retort Stand Support --><line x1='50' y1='205' x2='120' y2='205' stroke='#cbd5e1' stroke-width='3'/><line x1='80' y1='205' x2='80' y2='20' stroke='#cbd5e1' stroke-width='3'/><line x1='80' y1='35' x2='190' y2='35' stroke='#cbd5e1' stroke-width='2.5'/><!-- Thread Suspended from Clamp down to Metre Rule Pivot --><line x1='190' y1='35' x2='190' y2='95' stroke='#f59e0b' stroke-width='2'/><!-- Knife Edge / Pivot Loop II at 50 cm mark --><polygon points='186,95 194,95 190,85' fill='#cbd5e1'/><!-- Neutral Label II --><circle cx='190' cy='65' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='190' y='68' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II</text><!-- Balanced Metre Rule I (Graduated 0 to 100 cm) --><rect x='40' y='95' width='300' height='16' rx='2' fill='#d97706' opacity='0.7' stroke='#fef08a' stroke-width='1.5'/><!-- Scale Markings --><line x1='70' y1='95' x2='70' y2='103' stroke='#ffffff' stroke-width='1'/><text x='70' y='122' font-size='7' fill='#cbd5e1' text-anchor='middle'>10cm</text><line x1='190' y1='95' x2='190' y2='107' stroke='#ffffff' stroke-width='1.5'/><text x='190' y='122' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>50cm</text><line x1='310' y1='95' x2='310' y2='103' stroke='#ffffff' stroke-width='1'/><text x='310' y='122' font-size='7' fill='#cbd5e1' text-anchor='middle'>90cm</text><!-- Neutral Label I --><circle cx='40' cy='85' r='8' fill='#1e293b' stroke='#fef08a' stroke-width='1.5'/><text x='40' y='88' font-size='8' font-weight='bold' fill='#fef08a' text-anchor='middle'>I</text><!-- Left Mass III (Known mass M1 = 60 g suspended at 20 cm mark, d1 = 30 cm) --><line x1='100' y1='111' x2='100' y2='135' stroke='#38bdf8' stroke-width='1.5'/><rect x='88' y='135' width='24' height='30' rx='2' fill='#1e293b' stroke='#38bdf8' stroke-width='1.8'/><text x='100' y='153' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>M₁</text><!-- Neutral Label III --><circle cx='70' cy='150' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='70' y='153' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text><!-- Right Mass IV (Unknown mass M2 suspended at 70 cm mark, d2 = 20 cm) --><line x1='250' y1='111' x2='250' y2='135' stroke='#ef4444' stroke-width='1.5'/><rect x='236' y='135' width='28' height='35' rx='2' fill='#1e293b' stroke='#ef4444' stroke-width='1.8'/><text x='250' y='155' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>M₂</text><!-- Neutral Label IV --><circle cx='280' cy='150' r='8' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/><text x='280' y='153' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>IV</text><!-- Distance dimension arrows --><!-- d1 = 30 cm --><line x1='100' y1='80' x2='190' y2='80' stroke='#38bdf8' stroke-width='1.2'/><polygon points='102,78 98,80 102,82' fill='#38bdf8'/><polygon points='188,78 192,80 188,82' fill='#38bdf8'/><text x='145' y='75' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>d₁ = 30 cm</text><!-- d2 = 20 cm --><line x1='190' y1='80' x2='250' y2='80' stroke='#ef4444' stroke-width='1.2'/><polygon points='192,78 188,80 192,82' fill='#ef4444'/><polygon points='248,78 252,80 248,82' fill='#ef4444'/><text x='220' y='75' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>d₂ = 20 cm</text><text x='190' y='198' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>EQUILIBRIUM OF A UNIFORM LEVER: PRINCIPLE OF MOMENTS</text></svg></div>\n\n(i) Name each of the components labelled I, II, III, and IV.\n(ii) State the reading on the metre rule at the point where pivot II supports the rule in horizontal equilibrium.\n(iii) State the Principle of Moments for a body in rotational equilibrium.\n(iv) Given that mass M₁ is 60.0 g and is placed at the 20.0 cm mark, while unknown mass M₂ balances the rule horizontally when placed at the 70.0 cm mark:\n  (α) Determine the distance of mass M₁ from pivot II (d₁);\n  (β) Determine the distance of mass M₂ from pivot II (d₂);\n  (γ) Calculate the mass of the unknown body M₂.\n(v) State one experimental precaution that must be observed to ensure accurate results.",
        "workedSolution": "(i) Identification of components:\n• Part I: **Uniform metre rule**\n• Part II: **Pivot (Fulcrum / Knife-edge support loop)**\n• Part III: **Known slotted mass ($M_1$)**\n• Part IV: **Unknown mass ($M_2$)**\n\n(ii) Pivot Reading:\nThe pivot is at the **$50.0\\text{ cm}$ mark** (the center of gravity of a uniform $100\\text{ cm}$ metre rule).\n\n(iii) Principle of Moments:\nWhen a body is in rotational equilibrium, the sum of the **anticlockwise moments** about any pivot point is equal to the sum of the **clockwise moments** about that same pivot point.\n\n(iv) Calculations:\n• (α) $d_1 = 50.0\\text{ cm} - 20.0\\text{ cm} = \\mathbf{30.0\\text{ cm}}$\n• (β) $d_2 = 70.0\\text{ cm} - 50.0\\text{ cm} = \\mathbf{20.0\\text{ cm}}$\n• (γ) By the Principle of Moments:\n  $$\\text{Anticlockwise Moment} = \\text{Clockwise Moment}$$\n  $$M_1 \\times d_1 = M_2 \\times d_2$$\n  $$60.0\\text{ g} \\times 30.0\\text{ cm} = M_2 \\times 20.0\\text{ cm}$$\n  $$1,800.0 = 20.0 \\times M_2$$\n  $$M_2 = \\frac{1,800.0}{20.0} = \\mathbf{90.0\\text{ g}}$$\n  *(Mass of $M_2$ is **90.0 g**)*.\n\n(v) Precautions:\n1. Ensure the metre rule settles horizontally before taking readings.\n2. Avoid air currents (switch off overhead fans) during measurement.\n3. Suspend masses with light thread to avoid adding unmeasured weight.",
        "maxMarks": 10
      },
      {
        "subId": "(b)",
        "prompt": "Figure 1(b) illustrates a laboratory experiment to prepare sodium chloride salt by neutralization followed by evaporation:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Stage 1: Neutralization in Conical Flask on Left --><g transform='translate(45, 30)'><text x='50' y='12' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Stage 1: Neutralization</text><!-- Conical Flask I --><polygon points='30,35 70,35 85,115 15,115' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.8'/><!-- Neutralized NaCl solution --><polygon points='20,113 80,113 74,80 26,80' fill='#0284c7' opacity='0.4'/><circle cx='50' cy='65' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='50' y='68' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text><!-- Dropper adding indicator/acid --><line x1='50' y1='18' x2='50' y2='34' stroke='#cbd5e1' stroke-width='2'/><circle cx='50' cy='36' r='2' fill='#ef4444'/></g><!-- Arrow between stages --><line x1='165' y1='100' x2='205' y2='100' stroke='#f59e0b' stroke-width='2'/><polygon points='205,100 197,96 197,104' fill='#f59e0b'/><text x='185' y='90' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Heat</text><!-- Stage 2: Evaporation in Evaporating Dish on Right --><g transform='translate(230, 30)'><text x='60' y='12' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>Stage 2: Evaporation</text><!-- Evaporating Dish II --><path d='M 20 80 Q 60 110 100 80 Z' fill='#cbd5e1' stroke='#94a3b8' stroke-width='2'/><!-- Salt crystals remaining at bottom III --><path d='M 32 88 Q 60 105 88 88 Z' fill='#ffffff' stroke='#e2e8f0' stroke-width='1'/><circle cx='115' cy='90' r='8' fill='#1e293b' stroke='#ffffff' stroke-width='1.5'/><text x='115' y='93' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>III</text><!-- Steam vapors rising IV --><path d='M 45 75 Q 40 60 48 50 M 60 75 Q 65 60 58 50 M 75 75 Q 70 60 78 50' stroke='#38bdf8' stroke-width='1.5' fill='none'/><!-- Tripod & Burner --><line x1='25' y1='145' x2='45' y2='105' stroke='#64748b' stroke-width='2'/><line x1='95' y1='145' x2='75' y2='105' stroke='#64748b' stroke-width='2'/><line x1='35' y1='105' x2='85' y2='105' stroke='#94a3b8' stroke-width='2.5'/><!-- Flame --><path d='M 60 145 Q 52 130 60 122 Q 68 130 60 145 Z' fill='#f59e0b'/><!-- Neutral Label II --><circle cx='10' cy='90' r='8' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/><text x='10' y='93' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>II</text></g><text x='190' y='198' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>PREPARATION OF SODIUM CHLORIDE SALT BY NEUTRALIZATION AND EVAPORATION</text></svg></div>\n\n(i) Name each of the apparatus labelled I, II, and III.\n(ii) Name two chemical solutions that react in flask I to form sodium chloride salt.\n(iii) Write a word equation for the chemical reaction that occurs in flask I.\n(iv) State the physical process taking place in dish II during Stage 2.\n(v) State one domestic use of the solid crystals III obtained at the end of the experiment.",
        "workedSolution": "(i) Identification of apparatus:\n• Part I: **Conical flask (reaction vessel)**\n• Part II: **Evaporating dish (porcelain basin)**\n• Part III: **Solid common salt crystals (sodium chloride)**\n\n(ii) Reacting solutions:\n**Dilute hydrochloric acid [$\\text{HCl}$]** and **Sodium hydroxide solution [$\\text{NaOH}$]**.\n\n(iii) Word equation:\n$$\\text{Hydrochloric acid} + \\text{Sodium hydroxide} \\to \\text{Sodium chloride (salt)} + \\text{Water}$$\n\n(iv) Physical process in dish II:\n**Thermal evaporation (evaporation to dryness)** to remove water solvent.\n\n(v) Domestic use of crystals III:\nSeasoning food in cooking *(or food preservation/salting fish)*.",
        "maxMarks": 10
      },
      {
        "subId": "(c)",
        "prompt": "Figure 1(c) illustrates an experiment demonstrating that chlorophyll is necessary for photosynthesis using a variegated leaf:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Leaf Before Starch Test on Left --><g transform='translate(50, 25)'><text x='60' y='12' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Before Iodine Test</text><!-- Leaf Outline --><path d='M 60 135 C 10 100 10 45 60 25 C 110 45 110 100 60 135 Z' fill='#fef08a' stroke='#cbd5e1' stroke-width='1.8'/><!-- Green Chlorophyll Center (Photosynthetic zone) --><path d='M 60 115 C 30 90 30 55 60 40 C 90 55 90 90 60 115 Z' fill='#22c55e' stroke='#15803d' stroke-width='1.2'/><text x='60' y='75' font-size='7' font-weight='bold' fill='#ffffff' text-anchor='middle'>Green</text><text x='60' y='125' font-size='7' font-weight='bold' fill='#713f12' text-anchor='middle'>White edge</text><!-- Leaf petiole stem --><line x1='60' y1='135' x2='60' y2='155' stroke='#a16207' stroke-width='2.5'/></g><!-- Arrow --><line x1='165' y1='95' x2='205' y2='95' stroke='#f59e0b' stroke-width='2'/><polygon points='205,95 197,91 197,99' fill='#f59e0b'/><text x='185' y='85' font-size='7' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Iodine</text><!-- Leaf After Starch Test on Right --><g transform='translate(225, 25)'><text x='60' y='12' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>After Iodine Test</text><!-- Leaf Outline --><path d='M 60 135 C 10 100 10 45 60 25 C 110 45 110 100 60 135 Z' fill='#fef08a' stroke='#cbd5e1' stroke-width='1.8'/><!-- Blue-black Zone I (Positive starch test) --><path d='M 60 115 C 30 90 30 55 60 40 C 90 55 90 90 60 115 Z' fill='#1e1b4b' stroke='#312e81' stroke-width='1.2'/><!-- Neutral Label I --><circle cx='60' cy='75' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='60' y='78' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text><!-- Neutral Label II (Yellow/Brown perimeter) --><circle cx='95' cy='105' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='95' y='108' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II</text><!-- Leaf petiole stem --><line x1='60' y1='135' x2='60' y2='155' stroke='#a16207' stroke-width='2.5'/></g><text x='190' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>VARIEGATED LEAF STARCH TEST: IDENTIFY REGIONS I AND II AND EXPLAIN COLOR CHANGES</text></svg></div>\n\n(i) Name the chemical solution used to test the leaf for starch.\n(ii) State the color observed in:\n  (α) Region I;\n  (β) Region II.\n(iii) Explain why Region I gave a positive result while Region II gave a negative result.\n(iv) State why the leaf was boiled in ethanol before applying the test solution.\n(v) What general conclusion can be drawn from this experiment?",
        "workedSolution": "(i) Chemical test solution:\n**Iodine solution**.\n\n(ii) Color observations:\n• (α) Region I: **Turns blue-black**.\n• (β) Region II: **Remains yellowish-brown (color of iodine)**.\n\n(iii) Explanation:\nRegion I contained green chlorophyll in the living leaf, allowing it to perform photosynthesis and manufacture starch. Region II lacked chlorophyll, could not perform photosynthesis, and therefore formed no starch.\n\n(iv) Purpose of boiling in ethanol:\nTo dissolve and extract green chlorophyll pigments, decolorizing the leaf so the blue-black color change can be clearly observed.\n\n(v) Conclusion:\n**Chlorophyll is essential for photosynthesis** in green plants.",
        "maxMarks": 10
      },
      {
        "subId": "(d)",
        "prompt": "Figure 1(d) illustrates a 4-year crop rotation program on four plots of farmland:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- 4 Field Plots Matrix --><g transform='translate(50, 25)'><!-- Plot 1: Cassava (Deep feeder / Root tuber) --><rect x='0' y='0' width='130' height='65' fill='#78350f' opacity='0.4' stroke='#cbd5e1' stroke-width='1.5'/><text x='65' y='25' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Plot 1 (Year 1)</text><text x='65' y='45' font-size='9' font-weight='bold' fill='#fde047' text-anchor='middle'>Cassava</text><!-- Plot 2: Maize (Shallow feeder / Cereal grain) --><rect x='150' y='0' width='130' height='65' fill='#15803d' opacity='0.4' stroke='#cbd5e1' stroke-width='1.5'/><text x='215' y='25' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Plot 2 (Year 1)</text><text x='215' y='45' font-size='9' font-weight='bold' fill='#fde047' text-anchor='middle'>Maize</text><!-- Plot 3: Cowpea (Legume / Nitrogen fixer) --><rect x='0' y='80' width='130' height='65' fill='#1d4ed8' opacity='0.4' stroke='#cbd5e1' stroke-width='1.5'/><text x='65' y='105' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Plot 3 (Year 1)</text><text x='65' y='125' font-size='9' font-weight='bold' fill='#fde047' text-anchor='middle'>Cowpea (Legume)</text><!-- Plot 4: Cabbage (Heavy leaf feeder / Vegetable) --><rect x='150' y='80' width='130' height='65' fill='#b45309' opacity='0.4' stroke='#cbd5e1' stroke-width='1.5'/><text x='215' y='105' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Plot 4 (Year 1)</text><text x='215' y='125' font-size='9' font-weight='bold' fill='#fde047' text-anchor='middle'>Cabbage</text><!-- Rotation Arrows --><path d='M 135 32 L 145 32' stroke='#38bdf8' stroke-width='2'/><path d='M 215 68 L 215 76' stroke='#38bdf8' stroke-width='2'/><path d='M 145 112 L 135 112' stroke='#38bdf8' stroke-width='2'/><path d='M 65 76 L 65 68' stroke='#38bdf8' stroke-width='2'/></g><text x='190' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>4-COURSE CROP ROTATION: PLOT SHIFTING AND SOIL NUTRIENT BALANCING</text></svg></div>\n\n(i) Name the type of crop grown in:\n  (α) Plot 1 (Cassava);\n  (β) Plot 2 (Maize);\n  (γ) Plot 3 (Cowpea).\n(ii) State the scientific reason why cowpea is included in this rotation schedule.\n(iii) State what crop will be cultivated in Plot 1 during Year 2 following the rotation cycle shown.\n(iv) State two advantages of practicing crop rotation on a farm.",
        "workedSolution": "(i) Crop classifications:\n• (α) Plot 1 (Cassava): **Root tuber crop (Deep feeder)**\n• (β) Plot 2 (Maize): **Cereal grain crop (Shallow feeder)**\n• (γ) Plot 3 (Cowpea): **Leguminous crop (Nitrogen fixer)**\n\n(ii) Reason cowpea is included:\nCowpea harbors symbiotic *Rhizobium* bacteria in its root nodules that fix atmospheric nitrogen gas into soil nitrates, naturally restoring fertility.\n\n(iii) Crop for Plot 1 in Year 2:\n**Maize** (moving in sequence to Plot 1).\n\n(iv) Advantages of crop rotation:\n1. Maintains balanced soil fertility by alternating nutrient demands.\n2. Breaks weed, insect pest, and soil-borne disease lifecycles.\n3. Improves soil structure and reduces soil erosion.",
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
        "prompt": "(i) Explain why sound waves travel faster through solid metals than through liquids and gases.\n(ii) Explain why sound cannot travel through a vacuum.",
        "workedSolution": "(i) Why sound travels faster in solids:\nSound is a mechanical wave that propagates via particle collisions. In solid metals, particles are packed closely together in a rigid crystal lattice with strong elastic bonds, allowing vibrational energy to pass quickly between particles. In liquids and gases, particles are farther apart, resulting in fewer collisions per second and slower sound transmission.\n\n(ii) Why sound cannot travel through a vacuum:\nSound waves are mechanical waves that require a material medium (particles) to compress and rarefy. Because a vacuum contains no matter, there are no particles to vibrate and transmit sound waves.",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "A sound wave emitted from a ship travels through seawater at a speed of $1,500.0\\text{ m s}^{-1}$. An echo reflected from the seabed is detected by a hydrophone on the ship $2.0\\text{ seconds}$ after emission.\n(i) State the formula connecting the total distance traveled by an echo to sound speed and time.\n(ii) Calculate the depth of the sea beneath the ship.",
        "workedSolution": "(i) Echo distance formula:\n$$\\text{Total Distance } (2d) = \\text{Speed } (v) \\times \\text{Echo Time } (t)$$\n$$\\implies d = \\frac{v \\times t}{2}$$\n\n(ii) Depth calculation:\nSubstitute values ($v = 1,500.0\\text{ m s}^{-1}$, $t = 2.0\\text{ s}$):\n$$d = \\frac{1,500.0\\text{ m s}^{-1} \\times 2.0\\text{ s}}{2} = \\frac{3,000.0}{2} = 1,500.0\\text{ meters}$$\nAnswer: The depth of the sea is **1,500.0 meters**.",
        "maxMarks": 8
      },
      {
        "subId": "(c)",
        "prompt": "State three practical methods of conserving electrical energy in a domestic household in Ghana.",
        "workedSolution": "1. Switching off lights, fans, and entertainment electronics at wall sockets when leaving unoccupied rooms.\n2. Replacing incandescent filament bulbs with energy-efficient Light Emitting Diode (LED) lamps.\n3. Keeping refrigerator doors closed, defrosting regularly, and setting thermostats to recommended temperatures.\n4. Using natural daylight for daytime indoor illumination rather than electric lighting.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "3",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) State the three main classes of rocks based on their mode of formation, giving one example of each.\n(ii) Explain the difference between physical weathering and chemical weathering of rocks.",
        "workedSolution": "(i) Classes of rocks:\n1. **Igneous Rocks:** Formed by cooling and solidification of molten magma or lava (e.g., Granite, Basalt).\n2. **Sedimentary Rocks:** Formed by compaction and cementation of mineral sediments and organic debris (e.g., Sandstone, Limestone, Shale).\n3. **Metamorphic Rocks:** Formed when pre-existing rocks recrystallize under intense heat and tectonic pressure (e.g., Marble, Slate, Quartzite).\n\n(ii) Physical vs. Chemical Weathering:\n• **Physical Weathering:** Mechanical breakdown of large rocks into smaller fragments without altering mineral composition (e.g., temperature changes, root wedging).\n• **Chemical Weathering:** Decomposition and alteration of rock minerals through chemical reactions with water, oxygen, and carbon dioxide (e.g., carbonation of limestone).",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) Define soil erosion.\n(ii) State three human farming activities that accelerate soil erosion on farmlands.\n(iii) State two agronomic methods used to prevent soil erosion on sloping land.",
        "workedSolution": "(i) Soil Erosion definition:\nSoil erosion is the detachment and washing or blowing away of fertile topsoil by water or wind.\n\n(ii) Human activities accelerating erosion:\n1. **Deforestation and Clean Weeding:** Removing plant cover leaves bare topsoil exposed to direct raindrop impact and runoff.\n2. **Bush Burning:** Destroys organic surface mulch and vegetation, exposing bare ground.\n3. **Overgrazing:** Animals remove vegetative ground cover and compact the soil with hooves.\n\n(iii) Agronomic methods to prevent erosion:\n1. **Contour Ploughing:** Ploughing across slopes creates ridges that trap runoff water.\n2. **Cover Cropping:** Planting creeping legumes provides canopy cover that cushions raindrop impact.\n3. **Terracing:** Cutting steep hillsides into stepped horizontal benches to reduce runoff velocity.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "(i) What is crop rotation?\n(ii) State two scientific principles to observe when planning a 4-year crop rotation program.",
        "workedSolution": "(i) Crop Rotation definition:\nCrop rotation is the agricultural practice of growing different crop families sequentially on the same plot of land over seasons according to a definite schedule.\n\n(ii) Principles of crop rotation:\n1. **Include Legumes in the Cycle:** Leguminous crops (such as cowpeas) should alternate with nitrogen-demanding crops to naturally replenish soil nitrates.\n2. **Alternate Rooting Depths:** Deep-rooted crops (like cassava or yam) should follow shallow-rooted crops (like maize or lettuce) to utilize nutrients from different soil layers.\n3. **Vary Crop Families:** Avoid planting crops from the same family sequentially (e.g., do not follow tomatoes with peppers or garden eggs) to break shared pest and disease cycles.",
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
        "prompt": "(i) Name the four primary organs that make up the human urinary system.\n(ii) State the function of:\n  (α) The ureters;\n  (β) The urethra.\n(iii) State three metabolic waste products excreted in human urine.",
        "workedSolution": "(i) Organs of the urinary system:\n1. **Kidneys (left and right)**\n2. **Ureters (two ducts)**\n3. **Urinary bladder**\n4. **Urethra**\n\n(ii) Functions of organs:\n• (α) Ureters: Muscular tubes that convey urine from the renal pelvis of each kidney down to the urinary bladder by peristalsis.\n• (β) Urethra: Duct that discharges urine from the urinary bladder out of the body during urination.\n\n(iii) Metabolic wastes in urine:\n1. **Urea** (from deamination of excess amino acids in the liver)\n2. **Excess water**\n3. **Mineral salts** (excess sodium and potassium chlorides)\n*(Also uric acid and creatinine)*.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) State two daily healthy lifestyle habits that help maintain proper kidney health.\n(ii) State two common signs or symptoms that may indicate kidney dysfunction in an individual.",
        "workedSolution": "(i) Healthy kidney habits:\n1. Drinking adequate clean water daily to assist in flushing metabolic wastes.\n2. Reducing excessive dietary table salt and processed food intake to avoid hypertension.\n3. Avoiding self-medication, especially chronic use of unprescribed analgesics (painkillers).\n4. Exercising regularly to manage healthy blood pressure and blood sugar levels.\n\n(ii) Symptoms of kidney dysfunction:\n1. Swelling (edema) in the feet, ankles, legs, or face due to fluid retention.\n2. Blood in the urine (hematuria) or dark, foamy urine.\n3. Persistent fatigue, weakness, or unexplained loss of appetite.\n4. Drastic changes in urination frequency (urinating much more or much less, especially at night).",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "(i) State the causative organism and method of transmission of:\n  (α) Cholera;\n  (β) Bilharzia (Schistosomiasis).\n(ii) State one effective preventive measure for each disease.",
        "workedSolution": "(i) Causative organisms and transmission:\n• (α) Cholera:\n  - *Causative Organism:* **Vibrio cholerae** (bacterium)\n  - *Transmission:* Ingesting drinking water or food contaminated with human feces from an infected person (fecal-oral route).\n• (β) Bilharzia (Schistosomiasis):\n  - *Causative Organism:* **Schistosoma species** (parasitic blood fluke)\n  - *Transmission:* Bathing, swimming, or wading in freshwater infested with cercariae larvae shed by infected aquatic freshwater snails.\n\n(ii) Preventive measures:\n• For Cholera: Boil drinking water, wash hands thoroughly with soap before eating, and maintain proper community sanitation.\n• For Bilharzia: Avoid swimming, washing, or wading in stagnant freshwater bodies where freshwater snails breed.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "5",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) State two factors that affect the pressure exerted by a liquid at rest.\n(ii) Explain why the wall of a large hydroelectric dam is built much thicker at the bottom than at the top.",
        "workedSolution": "(i) Factors affecting liquid pressure:\n1. **Depth of the liquid column ($h$):** Pressure increases directly with depth ($P = \\rho g h$).\n2. **Density of the liquid ($\\rho$):** Denser liquids exert greater pressure at the same depth.\n\n(ii) Why dam walls are thicker at the bottom:\nLiquid pressure increases with depth. The deep water at the bottom of the reservoir exerts much greater hydrostatic pressure against the dam wall than the water near the surface. The base must be built thicker and reinforced with mass concrete to withstand this immense pressure and prevent structural failure.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) State the relationship between Mechanical Advantage ($MA$), Velocity Ratio ($VR$), and percentage Efficiency of a simple machine.\n(ii) A block and tackle pulley system has a Velocity Ratio ($VR$) of 4. If it requires an applied effort force of $250.0\\text{ N}$ to lift a load of $800.0\\text{ N}$, calculate:\n  (α) The Mechanical Advantage ($MA$);\n  (β) The percentage efficiency of the pulley system.",
        "workedSolution": "(i) Machine efficiency formula:\n$$\\text{Efficiency } (\\%) = \\frac{\\text{Mechanical Advantage } (MA)}{\\text{Velocity Ratio } (VR)} \\times 100\\%$$\n\n(ii) Calculations:\n• (α) Mechanical Advantage ($MA$):\n$$MA = \\frac{\\text{Load } (L)}{\\text{Effort } (E)} = \\frac{800.0\\text{ N}}{250.0\\text{ N}} = 3.20$$\nAnswer: Mechanical Advantage is **3.20**.\n\n• (β) Percentage Efficiency:\n$$\\text{Efficiency} = \\frac{MA}{VR} \\times 100\\% = \\frac{3.20}{4.0} \\times 100\\% = 80.0\\%$$\nAnswer: Efficiency is **80.0%**.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "Explain why each of the following cultural practices is important in vegetable production:\n(i) Staking;\n(ii) Mulching.",
        "workedSolution": "(i) Staking:\n• **Importance:** Supports climbing vines and heavy fruit-bearing stems on vertical poles, keeping leaves and fruits off moist ground. This prevents soil-borne fungal infections and fruit rot while improving sunlight capture and air circulation.\n\n(ii) Mulching:\n• **Importance:** Spreading dry straw or leaves over topsoil reduces evaporative water loss, preserves soil moisture, suppresses weed germination, buffers soil temperatures, and adds organic humus upon decomposition.",
        "maxMarks": 6
      }
    ]
  }
];

export const SET_BECE_MOCK_10_SCIENCE_P1 = {
  title: "Paper 1: Objective Test (Mock 10)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedMock10P1
};

export const SET_BECE_MOCK_10_SCIENCE_P2 = {
  title: "Paper 2: Practical & Theory Essay (Mock 10)",
  durationMinutes: 105,
  instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
  totalQuestions: 5,
  questions: paper2Mock10Questions
};

export const SET_BECE_MOCK_10_SCIENCE_COMPLETE = {
  id: "mock_10",
  setNumber: 141,
  subject: "Integrated Science",
  title: "BECE Integrated Science Mock 10 (Final Benchmark Examination Suite)",
  totalDurationMinutes: 150,
  paper1: SET_BECE_MOCK_10_SCIENCE_P1,
  paper2: SET_BECE_MOCK_10_SCIENCE_P2,
  metadata: {
    isMock: true,
    isMockExam: true,
    setNumber: 141,
    version: "NaCCA JHS Standards-Compliant",
    totalMarks: 140,
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 4,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
