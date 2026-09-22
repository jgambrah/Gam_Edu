/**
 * SET 139: BECE Integrated Science Mock 8 (Comprehensive National Standards Suite)
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

const balancedMock8P1: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "Which of the following chemical reagents changes color from white to bright blue in the presence of water?",
    "options": [
      "Cobalt(II) chloride",
      "Anhydrous copper(II) sulfate",
      "Benedict's solution",
      "Universal indicator"
    ],
    "correctAnswer": "Anhydrous copper(II) sulfate",
    "hint": "A dry inorganic salt used as a confirmatory test for liquid water.",
    "workedSolution": "Anhydrous copper(II) sulfate is white when dry and turns bright blue when hydrated by water: CuSO₄ + 5H₂O -> CuSO₄·5H₂O.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "The structure in the human ear that separates the outer ear canal from the middle ear cavity and vibrates when struck by sound waves is the",
    "options": [
      "cochlea.",
      "tympanic membrane.",
      "Eustachian tube.",
      "pinna."
    ],
    "correctAnswer": "tympanic membrane.",
    "hint": "Also commonly called the eardrum.",
    "workedSolution": "The tympanic membrane (eardrum) is a thin, taut membrane that vibrates in response to airborne sound waves, transmitting vibrations to the ossicles.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Which of the following rocks is formed by the cooling and solidification of molten magma beneath the Earth's crust?",
    "options": [
      "Limestone",
      "Sandstone",
      "Granite",
      "Marble"
    ],
    "correctAnswer": "Granite",
    "hint": "An intrusive igneous rock with coarse interlocking mineral crystals.",
    "workedSolution": "Granite is an intrusive igneous rock formed when molten underground magma cools slowly beneath the Earth's surface.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "An electric ceiling fan rated at 80 W is operated for 5 hours. Calculate the electrical energy consumed in kilowatt-hours (kWh).",
    "options": [
      "0.04 kWh",
      "0.40 kWh",
      "4.00 kWh",
      "40.00 kWh"
    ],
    "correctAnswer": "0.40 kWh",
    "hint": "Energy = Power (in kW) x Time (in hours).",
    "workedSolution": "Power in kW = 80 W / 1000 = 0.08 kW. Energy = 0.08 kW x 5 h = 0.40 kWh.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "Which of the following organisms serves as the secondary (intermediate) host in the life cycle of the pork tapeworm (Taenia solium)?",
    "options": [
      "Pig",
      "Human",
      "Cattle",
      "Freshwater snail"
    ],
    "correctAnswer": "Pig",
    "hint": "Harbors the encysted bladderworm stage (cysticercus) in its muscle tissues.",
    "workedSolution": "The pig is the intermediate host that ingests tapeworm eggs, which hatch into larvae and encyst as bladderworms in its muscles. Humans are the primary definitive host.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "What is the systematic chemical formula for Copper(II) oxide?",
    "options": [
      "Cu₂O",
      "CuO",
      "CuO₂",
      "Cu₂O₃"
    ],
    "correctAnswer": "CuO",
    "hint": "Copper has a valency of 2 (Cu²⁺) and Oxygen has a valency of 2 (O²⁻).",
    "workedSolution": "Copper(II) has a valency of +2 and oxide has a valency of -2. Combining in a 1:1 ratio gives the neutral formula CuO. Cu₂O is Copper(I) oxide.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "The method of separating an insoluble solid from a liquid by carefully pouring off the clear supernatant liquid without disturbing the sediment is called",
    "options": [
      "filtration.",
      "evaporation.",
      "decantation.",
      "distillation."
    ],
    "correctAnswer": "decantation.",
    "hint": "Requires the mixture to settle under gravity before pouring.",
    "workedSolution": "Decantation is the physical separation of a liquid from settled insoluble solid sediments by gently pouring the liquid out of the container.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Which of the following farm practices involves removing excess weak or diseased seedlings from a crowded nursery stand?",
    "options": [
      "Staking",
      "Pruning",
      "Thinning out",
      "Mulching"
    ],
    "correctAnswer": "Thinning out",
    "hint": "Reduces plant density to promote healthy growth of remaining stands.",
    "workedSolution": "Thinning out is the deliberate removal of crowded seedlings to eliminate competition for light, space, and soil nutrients.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "Through which of the following media does sound travel with the highest speed?",
    "options": [
      "Atmospheric air",
      "Solid steel",
      "Liquid water",
      "Vacuum"
    ],
    "correctAnswer": "Solid steel",
    "hint": "Sound travels fastest in dense solids with tightly packed particles.",
    "workedSolution": "Sound is a mechanical wave requiring a material medium. Its velocity is highest in rigid solids (steel ~5000 m/s), lower in liquids, and slowest in gases. Sound cannot travel in a vacuum.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "Which of the following elements is a non-metal that exists as a liquid at room temperature?",
    "options": [
      "Mercury",
      "Chlorine",
      "Iodine",
      "Bromine"
    ],
    "correctAnswer": "Bromine",
    "hint": "A reddish-brown halogen; mercury is a liquid metal.",
    "workedSolution": "Bromine is the only non-metallic element that is liquid at standard room temperature and pressure. Mercury is also liquid, but it is a metal.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "The Latin-derived chemical symbol Ag represents which of the following metallic elements?",
    "options": [
      "Gold",
      "Iron",
      "Lead",
      "Silver"
    ],
    "correctAnswer": "Silver",
    "hint": "Derived from the Latin word Argentum.",
    "workedSolution": "Ag comes from the Latin name Argentum, meaning Silver. Au represents Gold (Aurum); Fe represents Iron (Ferrum); Pb represents Lead (Plumbum).",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "Which part of the human alimentary canal produces bile to assist in the emulsification of dietary lipids?",
    "options": [
      "Stomach",
      "Pancreas",
      "Liver",
      "Gall bladder"
    ],
    "correctAnswer": "Liver",
    "hint": "The gall bladder stores bile, but this large organ synthesizes it.",
    "workedSolution": "Bile is synthesized by hepatocytes in the liver and stored in the gall bladder before release into the duodenum to emulsify fats.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "A metallic needle placed inside an insulated coil of wire carrying direct current becomes magnetized. This method is called",
    "options": [
      "single touch stroking.",
      "magnetic induction.",
      "divided touch stroking.",
      "electrical method."
    ],
    "correctAnswer": "electrical method.",
    "hint": "Uses a solenoid carrying continuous direct electric current.",
    "workedSolution": "Placing a ferromagnetic steel bar inside a current-carrying solenoid aligns internal magnetic domains via the electrical method of magnetization.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "Which of the following agricultural crops is a perennial fruit crop?",
    "options": [
      "Maize",
      "Cowpea",
      "Orange",
      "Cabbage"
    ],
    "correctAnswer": "Orange",
    "hint": "Lives and produces crops over several consecutive years.",
    "workedSolution": "Orange (citrus) is a perennial woody tree crop that survives and produces fruit for many years. Maize and cowpeas are annual crops.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "What is the primary role of the Eustachian tube in the mammalian ear?",
    "options": [
      "Transmitting sound vibrations to the cochlea",
      "Equalizing air pressure on both sides of the eardrum",
      "Collecting sound waves from the atmosphere",
      "Detecting head rotational balance"
    ],
    "correctAnswer": "Equalizing air pressure on both sides of the eardrum",
    "hint": "Connects the middle ear cavity to the nasopharynx.",
    "workedSolution": "The Eustachian tube connects the middle ear to the throat, equalizing air pressure across the tympanic membrane to prevent eardrum rupture.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "Which of the following gases is produced when dilute hydrochloric acid reacts with calcium carbonate?",
    "options": [
      "Carbon dioxide",
      "Hydrogen",
      "Oxygen",
      "Nitrogen"
    ],
    "correctAnswer": "Carbon dioxide",
    "hint": "Turns limewater milky by forming calcium carbonate precipitate.",
    "workedSolution": "Carbonates react with dilute acids to release carbon dioxide gas: CaCO₃ + 2HCl -> CaCl₂ + H₂O + CO₂↑.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "An object is pulled across a rough horizontal concrete floor. The opposing force that resists motion between the contact surfaces is called",
    "options": [
      "gravitational force.",
      "centripetal force.",
      "electrostatic force.",
      "frictional force."
    ],
    "correctAnswer": "frictional force.",
    "hint": "Acts parallel to the interface, opposing relative motion.",
    "workedSolution": "Friction is the resistive contact force that opposes sliding or rolling motion between two surfaces in physical contact.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "Which of the following farm animals is classified as a monogastric herbivore with an enlarged functional caecum?",
    "options": [
      "Rabbit",
      "Goat",
      "Sheep",
      "Pig"
    ],
    "correctAnswer": "Rabbit",
    "hint": "Practices caecotrophy (coprophagy) to re-digest microbial proteins.",
    "workedSolution": "The rabbit is a non-ruminant (monogastric) herbivore that possesses a large functional caecum for bacterial cellulose fermentation.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "What is the valency of the polyatomic carbonate radical (CO₃) in chemical compounds?",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "correctAnswer": "2",
    "hint": "Carries a 2- charge (CO₃²⁻).",
    "workedSolution": "The carbonate radical has the chemical formula CO₃²⁻ with an ionic combining power (valency) of 2.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "A boy applies a force of 60 N to push a wheelbarrow through a horizontal distance of 15 m. Calculate the work done.",
    "options": [
      "4 J",
      "75 J",
      "450 J",
      "900 J"
    ],
    "correctAnswer": "900 J",
    "hint": "Work Done = Force x Distance = 60 x 15.",
    "workedSolution": "Work Done = Force x Distance = 60 N x 15 m = 900 Joules.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "Which of the following blood vessels carries deoxygenated blood from the lower body back to the right atrium of the human heart?",
    "options": [
      "Pulmonary vein",
      "Systemic aorta",
      "Coronary artery",
      "Inferior vena cava"
    ],
    "correctAnswer": "Inferior vena cava",
    "hint": "The main systemic vein entering the heart from below the diaphragm.",
    "workedSolution": "The inferior vena cava returns deoxygenated blood from lower body tissues and organs directly into the right atrium of the heart.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "In flowering plants, the transfer of pollen grains from the anther to the stigma of the same flower is called",
    "options": [
      "cross-pollination.",
      "fertilization.",
      "dispersal.",
      "self-pollination."
    ],
    "correctAnswer": "self-pollination.",
    "hint": "Occurs within the same individual flower or plant.",
    "workedSolution": "Self-pollination is the transfer of pollen from the anther to the receptive stigma of the same flower or another flower on the same plant.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "Which of the following instruments is used to measure the potential difference across an electric circuit component?",
    "options": [
      "Voltmeter",
      "Ammeter",
      "Ohmmeter",
      "Hydrometer"
    ],
    "correctAnswer": "Voltmeter",
    "hint": "Connected in parallel across two electrical terminals.",
    "workedSolution": "A voltmeter measures potential difference (voltage) in Volts and is connected in parallel across the component.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "Which of the following materials is an example of an electrical insulator?",
    "options": [
      "Dry wood",
      "Copper wire",
      "Aluminum strip",
      "Graphite rod"
    ],
    "correctAnswer": "Dry wood",
    "hint": "Lacks free mobile conduction electrons.",
    "workedSolution": "Dry wood has tightly bound valence electrons and high electrical resistance, making it an insulator. Copper, aluminum, and graphite conduct current.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "The term kindling in animal production refers specifically to the act of giving birth in",
    "options": [
      "pigs.",
      "sheep.",
      "rabbits.",
      "goats."
    ],
    "correctAnswer": "rabbits.",
    "hint": "Giving birth to a litter of kits.",
    "workedSolution": "Kindling is the technical term for parturition (giving birth) in rabbits. In pigs it is farrowing; in sheep it is lambing.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "Which of the following optical phenomena is responsible for the formation of a rainbow in the sky after a rainstorm?",
    "options": [
      "Dispersion of light",
      "Total internal reflection",
      "Diffraction of light",
      "Rectilinear propagation"
    ],
    "correctAnswer": "Dispersion of light",
    "hint": "Splitting of sunlight into constituent spectral colors by water droplets.",
    "workedSolution": "Water droplets act as natural prisms that refract and disperse white sunlight into its component colors, producing a visible rainbow.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "What is the ground-state Bohr electronic configuration of an atom of Phosphorus (₁₅P)?",
    "options": [
      "2, 8, 3",
      "2, 5, 8",
      "2, 8, 5",
      "2, 8, 8, 2"
    ],
    "correctAnswer": "2, 8, 5",
    "hint": "2 in the first shell, 8 in the second shell, and 5 in the valence shell.",
    "workedSolution": "Phosphorus has atomic number 15. Its electron arrangement fills 2 in the K-shell, 8 in the L-shell, and the remaining 5 in the M-shell (2, 8, 5).",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Which human joint allows rotary movement in multiple planes, such as the shoulder and hip joints?",
    "options": [
      "Ball-and-socket joint",
      "Hinge joint",
      "Suture joint",
      "Gliding joint"
    ],
    "correctAnswer": "Ball-and-socket joint",
    "hint": "A rounded bone head resting in a cup-like socket.",
    "workedSolution": "Ball-and-socket joints permit rotational movement in all planes (circumduction, rotation, flexion, extension) at the shoulder and hip.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "Which of the following methods of heat transfer does not require any material medium?",
    "options": [
      "Conduction",
      "Convection",
      "Radiation",
      "Absorption"
    ],
    "correctAnswer": "Radiation",
    "hint": "Travels through the vacuum of space as electromagnetic waves.",
    "workedSolution": "Thermal radiation travels as infrared electromagnetic waves through empty space without requiring a material medium.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Which soil type feels distinctly gritty when rubbed between fingers and has the lowest water retention capacity?",
    "options": [
      "Clayey soil",
      "Loamy soil",
      "Silty soil",
      "Sandy soil"
    ],
    "correctAnswer": "Sandy soil",
    "hint": "Composed of coarse quartz grains with large macropores.",
    "workedSolution": "Sandy soil particles are large ($0.05-2.0\\text{ mm}$), imparting a rough, gritty feel with rapid drainage and poor water retention.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "The periodic table arranges chemical elements in order of increasing",
    "options": [
      "mass number.",
      "number of neutrons.",
      "density.",
      "atomic number."
    ],
    "correctAnswer": "atomic number.",
    "hint": "The number of positive protons in the atomic nucleus.",
    "workedSolution": "The modern periodic table organizes elements in ascending order of atomic number (proton number), determining periodic physical and chemical properties.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "Which of the following vector organisms transmits the protozoan parasite that causes malaria in humans?",
    "options": [
      "Housefly",
      "Tsetse fly",
      "Black fly",
      "Female Anopheles mosquito"
    ],
    "correctAnswer": "Female Anopheles mosquito",
    "hint": "Bites at night and injects Plasmodium sporozoites.",
    "workedSolution": "Female *Anopheles* mosquitoes transmit *Plasmodium* sporozoites into human blood during blood-feeding, causing malaria.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "A machine with an effort of 50 N lifts a load of 150 N. Calculate the Mechanical Advantage (MA) of the machine.",
    "options": [
      "0.33",
      "2.00",
      "3.00",
      "7.50"
    ],
    "correctAnswer": "3.00",
    "hint": "Mechanical Advantage = Load / Effort.",
    "workedSolution": "MA = Load / Effort = 150 N / 50 N = 3.00.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "Which of the following structures in a plant cell contains green chlorophyll pigments for photosynthesis?",
    "options": [
      "Mitochondrion",
      "Vacuole",
      "Chloroplast",
      "Nucleus"
    ],
    "correctAnswer": "Chloroplast",
    "hint": "The primary organelle that absorbs sunlight to produce glucose.",
    "workedSolution": "Chloroplasts contain green chlorophyll pigments that absorb light energy to drive photosynthesis in plant cells.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "The change of state of matter from gas directly to liquid when cooled is known as",
    "options": [
      "condensation.",
      "evaporation.",
      "melting.",
      "sublimation."
    ],
    "correctAnswer": "condensation.",
    "hint": "Observed when water vapor cools to form dew or rain droplets.",
    "workedSolution": "Condensation is the physical phase transition where gas cools and changes into liquid, such as water vapor forming cloud droplets.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "Which of the following farm tools is specifically designed for trimming hedges and pruning overgrown vegetative shoots?",
    "options": [
      "Shears",
      "Pickaxe",
      "Garden fork",
      "Spade"
    ],
    "correctAnswer": "Shears",
    "hint": "Handheld cutting tool with long straight steel blades.",
    "workedSolution": "Hedge shears feature long sharp blades designed for trimming ornamental hedges and pruning woody shrub foliage.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "Which of the following waste materials can be recycled into organic compost to improve soil fertility?",
    "options": [
      "Polythene sachet",
      "Vegetable scraps",
      "Glass bottle",
      "Aluminum can"
    ],
    "correctAnswer": "Vegetable scraps",
    "hint": "Biodegradable kitchen waste that decomposes naturally.",
    "workedSolution": "Vegetable scraps and plant foliage are organic, biodegradable materials broken down by microorganisms into nutrient-rich compost.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "An electric iron has a power rating of 1000 W and is connected across a 200 V mains supply. What electric current does it draw?",
    "options": [
      "0.2 A",
      "5.0 A",
      "10.0 A",
      "50.0 A"
    ],
    "correctAnswer": "5.0 A",
    "hint": "Current I = Power / Voltage.",
    "workedSolution": "I = P / V = 1000 W / 200 V = 5.0 Amperes.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "Which of the following celestial bodies in the Solar System is known as a dirty snowball composed of frozen ice, dust, and rock with a glowing tail?",
    "options": [
      "Comet",
      "Asteroid",
      "Meteorite",
      "Planet"
    ],
    "correctAnswer": "Comet",
    "hint": "Develops a luminous vapor tail pointing away from the Sun when near perihelion.",
    "workedSolution": "Comets are icy small Solar System bodies that warm and outgas when passing close to the Sun, producing a visible coma and tail.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "What color change is observed when red litmus paper is dipped into an aqueous solution of sodium hydroxide?",
    "options": [
      "Remains red",
      "Turns blue",
      "Turns colorless",
      "Turns bright yellow"
    ],
    "correctAnswer": "Turns blue",
    "hint": "Sodium hydroxide is a strong base (pH > 7).",
    "workedSolution": "Sodium hydroxide is an alkaline solution containing excess hydroxide ions (OH⁻), turning red litmus paper blue.",
    "points": 1
  }
];

const paper2Mock8Questions = [
  {
    "questionNumber": "1",
    "isPracticalSectionA": true,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Figure 1(a) illustrates an experiment demonstrating atmospheric pressure using the crushing can demonstration:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Stage A: Boiling water in open tin can on left --><g transform='translate(40, 30)'><text x='50' y='12' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Stage A: Heating</text><!-- Steam coming out --><path d='M 45 35 Q 40 20 48 10 M 55 35 Q 60 20 52 10' stroke='#cbd5e1' stroke-width='1.5' fill='none'/><!-- Tin Can I --><rect x='25' y='35' width='50' height='75' rx='3' fill='#475569' stroke='#94a3b8' stroke-width='1.8'/><!-- Water boiling at bottom --><rect x='26' y='95' width='48' height='14' fill='#38bdf8' opacity='0.5'/><!-- Open neck II --><rect x='42' y='28' width='16' height='7' fill='#64748b' stroke='#94a3b8' stroke-width='1.2'/><!-- Burner flame below --><path d='M 50 135 Q 42 120 50 112 Q 58 120 50 135 Z' fill='#f59e0b'/><!-- Neutral Label I --><circle cx='50' cy='155' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='50' y='158' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text></g><!-- Stage B: Sealed and cold water poured over on right --><g transform='translate(210, 30)'><text x='65' y='12' font-size='9' font-weight='bold' fill='#ef4444' text-anchor='middle'>Stage B: Crushing</text><!-- Cold water stream poured III --><path d='M 60 10 L 60 40 M 55 15 L 50 45 M 65 15 L 70 45' stroke='#38bdf8' stroke-width='2' stroke-dasharray='3,2'/><!-- Sealed Cap II --><rect x='57' y='36' width='16' height='6' rx='1' fill='#ef4444'/><!-- Crushed / Collapsed Tin Can IV --><path d='M 45 42 Q 65 52 50 75 Q 85 85 55 110 L 80 110 Q 70 85 85 65 Q 65 50 85 42 Z' fill='#475569' stroke='#ef4444' stroke-width='1.8'/><!-- Atmospheric pressure arrows pointing inward --><line x1='20' y1='75' x2='38' y2='75' stroke='#cbd5e1' stroke-width='2'/><polygon points='38,75 30,72 30,78' fill='#cbd5e1'/><line x1='110' y1='75' x2='92' y2='75' stroke='#cbd5e1' stroke-width='2'/><polygon points='92,75 100,72 100,78' fill='#cbd5e1'/><line x1='65' y1='135' x2='65' y2='118' stroke='#cbd5e1' stroke-width='2'/><polygon points='65,118 62,126 68,126' fill='#cbd5e1'/><!-- Neutral Label IV --><circle cx='65' cy='155' r='8' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/><text x='65' y='158' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>IV</text></g><text x='190' y='198' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>DEMONSTRATION OF ATMOSPHERIC PRESSURE: CRUSHING CAN EXPERIMENT</text></svg></div>\n\n(i) Name the components labelled I, II, III, and IV.\n(ii) Explain why water was boiled in the open tin can during Stage A before sealing.\n(iii) State what happens to the steam inside the can when cold water III is poured over the sealed can in Stage B.\n(iv) Explain why can IV collapses and becomes crushed inward in Stage B.\n(v) State one everyday domestic appliance or device that operates based on the principle of atmospheric pressure.",
        "workedSolution": "(i) Identification of components:\n• Part I: **Metal tin can (unsealed during boiling)**\n• Part II: **Airtight stopper / Screw cap**\n• Part III: **Stream of cold water**\n• Part IV: **Collapsed / Crushed tin can**\n\n(ii) Reason for boiling water in Stage A:\nBoiling converts liquid water into steam. The expanding steam drives out atmospheric air from inside the tin can, filling the entire interior with water vapor.\n\n(iii) What happens to steam in Stage B:\nThe cold water poured over the outside cools the can, causing the internal steam to rapidly **condense into a small volume of liquid water**.\n\n(iv) Why the can collapses:\nCondensation creates a partial vacuum inside the can, causing internal pressure to drop significantly below outside atmospheric pressure. The greater external atmospheric air pressure pressing inward on the walls exceeds the internal pressure, crushing the can.\n\n(v) Everyday devices operating on atmospheric pressure:\n**Drinking straw** *(or Siphon, Rubber suction pad, Bicycle pump, Syringe)*.",
        "maxMarks": 10
      },
      {
        "subId": "(b)",
        "prompt": "Figure 1(b) illustrates chemical confirmatory tests used to detect the presence of liquid water using dry chemical reagents:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Test A: Anhydrous Copper(II) Sulfate Powder in Watchglass --><g transform='translate(50, 30)'><text x='60' y='12' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Test with Copper(II) Sulfate</text><!-- Watch glass dish --><path d='M 15 70 Q 60 95 105 70' stroke='#cbd5e1' stroke-width='2' fill='none'/><!-- Dry white powder turning bright blue upon water drop --><ellipse cx='45' cy='75' rx='18' ry='6' fill='#ffffff' stroke='#cbd5e1' stroke-width='1'/><text x='45' y='63' font-size='7' fill='#cbd5e1' text-anchor='middle'>White powder</text><ellipse cx='75' cy='75' rx='18' ry='6' fill='#2563eb' stroke='#38bdf8' stroke-width='1'/><text x='75' y='63' font-size='7' fill='#38bdf8' text-anchor='middle'>Turns Blue</text><!-- Water droplet falling --><circle cx='75' cy='45' r='3' fill='#38bdf8'/><path d='M 75 40 L 72 45 L 78 45 Z' fill='#38bdf8'/><!-- Neutral Label I --><circle cx='60' cy='125' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='60' y='128' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text></g><!-- Test B: Cobalt(II) Chloride Test Paper Strip --><g transform='translate(225, 30)'><text x='60' y='12' font-size='9' font-weight='bold' fill='#f43f5e' text-anchor='middle'>Test with Cobalt(II) Chloride</text><!-- Dry Blue Paper Strip II turning Pink at wetted zone --><rect x='45' y='35' width='30' height='70' rx='2' fill='#3b82f6' stroke='#cbd5e1' stroke-width='1.5'/><!-- Bottom wetted portion turned pink --><rect x='45' y='75' width='30' height='30' rx='2' fill='#f43f5e' stroke='#cbd5e1' stroke-width='1.5'/><text x='25' y='55' font-size='7' fill='#3b82f6'>Dry: Blue</text><text x='25' y='95' font-size='7' fill='#f43f5e'>Wet: Pink</text><!-- Dropper adding water --><line x1='60' y1='20' x2='60' y2='30' stroke='#cbd5e1' stroke-width='2'/><circle cx='60' cy='32' r='2' fill='#38bdf8'/><!-- Neutral Label II --><circle cx='60' cy='125' r='8' fill='#1e293b' stroke='#f43f5e' stroke-width='1.5'/><text x='60' y='128' font-size='8' font-weight='bold' fill='#f43f5e' text-anchor='middle'>II</text></g><text x='190' y='180' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>CHEMICAL CONFIRMATORY TESTS FOR LIQUID WATER USING ANHYDROUS REAGENTS</text></svg></div>\n\n(i) Name the chemical reagents represented in Test A (powder I) and Test B (paper strip II).\n(ii) State the observable color change in:\n  (α) Reagent I when pure water is added;\n  (β) Reagent II when pure water is added.\n(iii) State whether these tests confirm that the water sample is chemically pure, giving a reason for your answer.\n(iv) State the boiling point and freezing point of chemically pure water at standard atmospheric pressure.",
        "workedSolution": "(i) Names of chemical reagents:\n• Reagent I (Test A): **Anhydrous copper(II) sulfate**\n• Reagent II (Test B): **Dry cobalt(II) chloride paper**\n\n(ii) Observable color changes:\n• (α) Reagent I: Changes from **white to bright blue**.\n• (β) Reagent II: Changes from **blue to pink**.\n\n(iii) Purity confirmation:\n**No**, these tests do not confirm chemical purity.\n• *Reason:* These tests only confirm the **presence of water**, but do not show whether impurities or dissolved solutes are present. To test for purity, physical constants must be measured (pure water boils sharply at $100.0^\\circ\\text{C}$ and freezes sharply at $0.0^\\circ\\text{C}$).\n\n(iv) Physical constants of pure water:\n• Boiling Point: **$100.0^\\circ\\text{C}$**\n• Freezing Point: **$0.0^\\circ\\text{C}$**",
        "maxMarks": 10
      },
      {
        "subId": "(c)",
        "prompt": "Figure 1(c) illustrates the gross anatomical structure of the mammalian ear:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Pinna I on Left --><path d='M 35 40 C 15 50 15 110 40 145 C 55 165 75 145 65 125 C 50 100 50 65 70 50 Z' fill='#fbcfe8' stroke='#f43f5e' stroke-width='2'/><circle cx='25' cy='30' r='8' fill='#1e293b' stroke='#f43f5e' stroke-width='1.5'/><text x='25' y='33' font-size='8' font-weight='bold' fill='#f43f5e' text-anchor='middle'>I</text><!-- Auditory Canal II --><path d='M 65 85 L 140 95 L 140 115 L 65 105 Z' fill='#475569' stroke='#64748b' stroke-width='1.5'/><circle cx='100' cy='80' r='8' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><text x='100' y='83' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>II</text><!-- Tympanic Membrane (Eardrum) III --><line x1='140' y1='90' x2='145' y2='120' stroke='#38bdf8' stroke-width='3.5'/><circle cx='135' cy='72' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='135' y='75' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text><!-- Middle Ear Ossicles IV (Malleus, Incus, Stapes) --><g transform='translate(150, 95)'><path d='M 0 10 L 15 5 L 25 15 L 35 12' stroke='#f59e0b' stroke-width='3' fill='none'/><circle cx='15' cy='-12' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='15' y='-9' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>IV</text></g><!-- Semicircular Canals V (Balance) --><g transform='translate(195, 55)'><ellipse cx='20' cy='20' rx='12' ry='8' fill='none' stroke='#10b981' stroke-width='2' transform='rotate(-30 20 20)'/><ellipse cx='20' cy='20' rx='8' ry='12' fill='none' stroke='#10b981' stroke-width='2' transform='rotate(45 20 20)'/><circle cx='20' cy='-8' r='8' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/><text x='20' y='-5' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>V</text></g><!-- Cochlea VI (Spiral hearing organ) --><g transform='translate(200, 100)'><path d='M 10 10 A 15 15 0 0 1 35 15 A 10 10 0 0 1 30 35 A 6 6 0 0 1 18 30' fill='none' stroke='#a855f7' stroke-width='3.5'/><circle cx='48' cy='25' r='8' fill='#1e293b' stroke='#a855f7' stroke-width='1.5'/><text x='48' y='28' font-size='8' font-weight='bold' fill='#a855f7' text-anchor='middle'>VI</text></g><!-- Eustachian Tube VII extending downwards --><path d='M 175 120 L 210 175 L 225 170 L 190 115 Z' fill='#475569' stroke='#64748b' stroke-width='1.5'/><circle cx='235' cy='155' r='8' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><text x='235' y='158' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>VII</text><text x='190' y='205' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>MAMMALIAN EAR ANATOMY: IDENTIFY STRUCTURES I, II, III, IV, V, VI, AND VII</text></svg></div>\n\n(i) Name the anatomical parts labelled I, II, III, IV, V, VI, and VII.\n(ii) State the specific functions of parts I, III, and V.\n(iii) State the function of tube VII and explain why swallowing during an airplane descent helps relieve ear discomfort.",
        "workedSolution": "(i) Anatomical parts:\n• Part I: **Pinna (outer ear flap)**\n• Part II: **Auditory canal (ear canal)**\n• Part III: **Tympanic membrane (eardrum)**\n• Part IV: **Middle ear ossicles (malleus, incus, stapes)**\n• Part V: **Semicircular canals**\n• Part VI: **Cochlea**\n• Part VII: **Eustachian tube**\n\n(ii) Functions of parts:\n• Part I (Pinna): Collects airborne sound waves and directs them into the auditory canal.\n• Part III (Tympanic membrane): Vibrates in response to sound waves and transmits vibrations to the ear ossicles.\n• Part V (Semicircular canals): Contains sensory fluid that detects rotational head movement to maintain dynamic body balance.\n\n(iii) Eustachian tube function:\nConnects the middle ear cavity to the nasopharynx to equalize air pressure across both sides of the eardrum. Swallowing opens the tube, allowing outside air to enter the middle ear, equalizing pressure and relieving eardrum strain during descent.",
        "maxMarks": 10
      },
      {
        "subId": "(d)",
        "prompt": "Figure 1(d) illustrates two common parasites of farm livestock labelled Parasite A and Parasite B:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Parasite A: Pork Tapeworm (Taenia solium) on Left --><g transform='translate(40, 25)'><text x='60' y='12' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Parasite A (Endoparasite)</text><!-- Scolex with suckers and hooks --><circle cx='60' cy='30' r='6' fill='#cbd5e1' stroke='#94a3b8' stroke-width='1.5'/><circle cx='58' cy='29' r='1.5' fill='#0f172a'/><circle cx='62' cy='29' r='1.5' fill='#0f172a'/><!-- Slender neck --><line x1='60' y1='36' x2='60' y2='45' stroke='#cbd5e1' stroke-width='3'/><!-- Segmented Proglottids ribbon curving --><path d='M 60 45 Q 40 60 65 75 Q 85 90 55 105 Q 35 120 70 135' stroke='#cbd5e1' stroke-width='5' fill='none' stroke-dasharray='4,2'/><circle cx='60' cy='155' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='60' y='158' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>A</text></g><!-- Divider --><line x1='185' y1='20' x2='185' y2='175' stroke='#334155' stroke-width='1.5' stroke-dasharray='4,3'/><!-- Parasite B: Cattle Tick (Boophilus) on Right --><g transform='translate(230, 25)'><text x='60' y='12' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Parasite B (Ectoparasite)</text><!-- Capitulum / Mouthparts --><polygon points='57,35 63,35 60,25' fill='#78350f'/><!-- Oval Flattened Body (Idiosoma) --><ellipse cx='60' cy='65' rx='22' ry='28' fill='#92400e' stroke='#cbd5e1' stroke-width='1.8'/><!-- 4 Pairs of Jointed Legs --><path d='M 40 50 L 20 40 M 40 60 L 15 55 M 40 70 L 18 75 M 42 80 L 22 90' stroke='#cbd5e1' stroke-width='2' fill='none'/><path d='M 80 50 L 100 40 M 80 60 L 105 55 M 80 70 L 102 75 M 78 80 L 98 90' stroke='#cbd5e1' stroke-width='2' fill='none'/><circle cx='60' cy='155' r='8' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/><text x='60' y='158' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>B</text></g><text x='190' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LIVESTOCK PARASITES: IDENTIFY PARASITES A & B AND STATE MODES OF TRANSMISSION</text></svg></div>\n\n(i) Identify each of the parasites labelled Parasite A and Parasite B.\n(ii) Classify each parasite as either an **endoparasite** or an **ectoparasite**.\n(iii) Name one farm animal host affected by:\n  (α) Parasite A;\n  (β) Parasite B.\n(iv) State two harmful effects of Parasite B on its livestock host.\n(v) State one management practice used by farmers to control Parasite A and one practice to control Parasite B.",
        "workedSolution": "(i) Identification of parasites:\n• Parasite A: **Tapeworm [Taenia solium / Taenia saginata]**\n• Parasite B: **Tick [Boophilus species]**\n\n(ii) Classification:\n• Parasite A: **Endoparasite** (internal parasite living inside the gut)\n• Parasite B: **Ectoparasite** (external parasite living on the skin)\n\n(iii) Farm animal hosts:\n• (α) Parasite A (Tapeworm): **Pigs / Cattle** *(and Humans)*\n• (β) Parasite B (Tick): **Cattle** *(or Sheep, Goats)*\n\n(iv) Harmful effects of Parasite B (Tick):\n1. Sucks blood from the host, causing chronic anemia and weakness.\n2. Transmits tick-borne pathogens (e.g., babesiosis, redwater fever, heartwater).\n3. Pierces the skin, damaging hides and predisposing animals to secondary bacterial infections.\n\n(v) Management and control practices:\n• To control Parasite A (Tapeworm): **Drenching** animals with anthelmintic dewormers *(and inspecting meat thoroughly before slaughter)*.\n• To control Parasite B (Tick): **Dipping or spraying** livestock with acaricides *(or handpicking ticks)*.",
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
        "workedSolution": "(i) Why sound travels faster in solids:\nSound is a mechanical wave that propagates through particle collisions. In solid metals, particles are packed closely in a rigid lattice with strong elastic bonds, allowing vibrational energy to pass quickly from particle to particle. In liquids and gases, particles are farther apart, resulting in fewer collisions per second and slower sound transmission.\n\n(ii) Why sound cannot travel through a vacuum:\nSound waves are mechanical waves that require a material medium (particles) to compress and rarefy. Because a vacuum is empty space containing no matter, there are no particles to vibrate and transmit acoustic waves.",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "A sound wave emitted from a ship travels through seawater at a speed of $1,500.0\\text{ m s}^{-1}$. An echo reflected from the seabed is detected by a hydrophone on the ship $2.0\\text{ seconds}$ after emission.\n(i) State the formula connecting the total distance traveled by an echo to sound speed and time.\n(ii) Calculate the depth of the sea beneath the ship.",
        "workedSolution": "(i) Echo distance formula:\n$$\\text{Total Distance } (2d) = \\text{Speed } (v) \\times \\text{Echo Time } (t)$$\n$$\\implies d = \\frac{v \\times t}{2}$$\n*(where $d$ is depth or distance to reflecting barrier, $v$ is sound speed, and $t$ is total echo transit time)*.\n\n(ii) Depth calculation:\nSubstitute values ($v = 1,500.0\\text{ m s}^{-1}$, $t = 2.0\\text{ s}$):\n$$d = \\frac{1,500.0\\text{ m s}^{-1} \\times 2.0\\text{ s}}{2} = \\frac{3,000.0}{2} = 1,500.0\\text{ meters}$$\nAnswer: The depth of the sea is **1,500.0 meters**.",
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
        "prompt": "(i) What is the Nitrogen Cycle?\n(ii) Describe the role played by nitrifying bacteria in the nitrogen cycle.\n(iii) Name two leguminous crops that enrich soil nitrogen through root nodule bacteria.",
        "workedSolution": "(i) Nitrogen Cycle definition:\nThe nitrogen cycle is the biogeochemical sequence of natural processes by which atmospheric nitrogen is converted into usable soil nitrates by microorganisms, absorbed by plants, passed along food chains, and returned to the atmosphere by decomposers and denitrifying bacteria.\n\n(ii) Role of nitrifying bacteria:\nNitrifying bacteria convert toxic ammonia into nitrates that plants can absorb:\n1. *Nitrosomonas* bacteria oxidize ammonia into nitrites ($\\text{NO}_2^-$).\n2. *Nitrobacter* bacteria oxidize nitrites into nitrates ($\\text{NO}_3^-$).\n\n(iii) Leguminous crop examples:\n**Cowpeas [Beans]** and **Groundnuts [Peanuts]** *(or Soya beans, Bambara groundnuts)*.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) Classify each of the following skeletal joints in the human body as either a Hinge joint or a Ball-and-socket joint:\n  (α) Knee joint;\n  (β) Shoulder joint;\n  (γ) Elbow joint;\n  (δ) Hip joint.\n(ii) State two functions of the human skeletal framework other than locomotion.",
        "workedSolution": "(i) Classification of joints:\n• (α) Knee joint: **Hinge joint**\n• (β) Shoulder joint: **Ball-and-socket joint**\n• (γ) Elbow joint: **Hinge joint**\n• (δ) Hip joint: **Ball-and-socket joint**\n\n(ii) Functions of the skeleton:\n1. **Protection of Vital Organs:** The skull protects the brain; the ribcage shields the heart and lungs; the vertebral column protects the spinal cord.\n2. **Blood Cell Formation (Hematopoiesis):** Red bone marrow inside spongy bones produces red blood cells, white blood cells, and platelets.\n3. **Mineral Storage:** Acts as a bodily reservoir storing calcium and phosphorus.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "(i) Name the causative organism and the insect vector responsible for transmitting River Blindness (Onchocerciasis) in Ghana.\n(ii) State two measures used to control the spread of river blindness in endemic communities.",
        "workedSolution": "(i) Etiology of River Blindness:\n• Causative Organism: **Onchocerca volvulus** (a parasitic filarial nematode worm)\n• Insect Vector: **Black fly [Simulium damnosum]**\n\n(ii) Control measures:\n1. Mass administration of Ivermectin (Mectizan) to treat infected populations and destroy microfilariae.\n2. Applying larvicides to fast-flowing river rapids to destroy black fly larvae.\n3. Wearing long-sleeved clothing near riverbanks to prevent bites.",
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
        "prompt": "(i) State two structural differences between diamond and graphite.\n(ii) Explain why graphite conducts electricity while diamond acts as an electrical insulator.",
        "workedSolution": "(i) Structural differences:\n1. **Bonding Arrangement:** In diamond, each carbon atom is covalently bonded to four others in a rigid 3D tetrahedral network. In graphite, each carbon atom is bonded to three others in flat hexagonal layers.\n2. **Inter-particle Forces:** Diamond forms a continuous covalent network; graphite features layers held together by weak van der Waals forces that slide over one another.\n\n(ii) Electrical conductivity explanation:\nIn graphite, each carbon atom bonds to only three neighbors, leaving one free valence electron delocalized along the layers to carry electric current. In diamond, all four valence electrons are locked in covalent bonds, leaving no free mobile electrons to conduct electricity.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) Write a balanced chemical equation for the reaction between magnesium metal and dilute hydrochloric acid.\n(ii) State two physical properties of the gas produced in this reaction.",
        "workedSolution": "(i) Balanced chemical equation:\n$$\\text{Mg}_{(s)} + 2\\text{HCl}_{(aq)} \\to \\text{MgCl}_{2(aq)} + \\text{H}_{2(g)}$$\n\n(ii) Properties of hydrogen gas ($\\text{H}_2$):\n1. Colorless, odorless, and insoluble in water.\n2. Less dense than air.\n3. Flammable, burning with a pale blue flame and extinguishing with a characteristic 'pop' sound.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "(i) Define pressure and state its S.I. unit.\n(ii) A wooden box of weight $600.0\\text{ N}$ rests on a table over a contact area of $0.20\\text{ m}^2$. Calculate the pressure exerted by the box on the table.",
        "workedSolution": "(i) Pressure definition:\nPressure is the force exerted perpendicularly per unit surface area ($P = \\frac{F}{A}$). Its S.I. unit is the **Pascal (Pa)** or **Newton per square meter ($\\text{N m}^{-2}$)**.\n\n(ii) Pressure calculation:\nFormula:\n$$P = \\frac{\\text{Force } (F)}{\\text{Area } (A)}$$\nSubstitute values ($F = 600.0\\text{ N}$, $A = 0.20\\text{ m}^2$):\n$$P = \\frac{600.0\\text{ N}}{0.20\\text{ m}^2} = 3,000.0\\text{ Pascals (Pa)}$$\nAnswer: The pressure exerted is **3,000.0 Pa** (or $\\text{N m}^{-2}$).",
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
        "prompt": "(i) State two fundamental differences between an artery and a vein in the human circulatory system.\n(ii) Explain why the left ventricle of the mammalian heart has a significantly thicker muscular wall than the right ventricle.",
        "workedSolution": "(i) Artery vs. Vein differences:\n1. **Direction of Blood Flow:** Arteries carry blood away from the heart; veins return blood toward the heart.\n2. **Wall Thickness & Pressure:** Arteries have thick, muscular, elastic walls carrying blood under high pressure; veins have thinner walls carrying blood under low pressure.\n3. **Internal Valves:** Arteries have no internal valves (except semilunar valves at exits); veins contain pocket valves to prevent backward blood flow.\n\n(ii) Why the left ventricle is thicker:\nThe left ventricle pumps oxygenated blood into the aorta to supply the entire body (systemic circulation), requiring high pressure to overcome systemic resistance. The right ventricle pumps deoxygenated blood only to the nearby lungs (pulmonary circulation) under lower pressure.",
        "maxMarks": 7
      },
      {
        "subId": "(b)",
        "prompt": "(i) State the Laws of Reflection of light.\n(ii) A ray of light strikes a flat plane mirror at a glancing angle of $40.0^\\circ$ to the mirror surface. Determine:\n  (α) The angle of incidence ($i$);\n  (β) The angle of reflection ($r$).",
        "workedSolution": "(i) Laws of Reflection:\n1. **First Law:** The incident ray, the reflected ray, and the normal to the mirror at the point of incidence all lie in the same plane.\n2. **Second Law:** The angle of incidence ($i$) is equal to the angle of reflection ($r$) ($i = r$).\n\n(ii) Calculations:\n• (α) Angle of incidence ($i$):\n$$i = 90.0^\\circ - \\text{Glancing Angle} = 90.0^\\circ - 40.0^\\circ = 50.0^\\circ$$\nAnswer: Angle of incidence is **$50.0^\\circ$**.\n\n• (β) Angle of reflection ($r$):\nBy the Second Law of Reflection ($r = i$):\n$$r = 50.0^\\circ$$\nAnswer: Angle of reflection is **$50.0^\\circ$**.",
        "maxMarks": 7
      },
      {
        "subId": "(c)",
        "prompt": "State three reasons why weeds are harmful to cultivated crops on farmlands.",
        "workedSolution": "1. **Resource Competition:** Weeds compete with crop plants for water, soil nutrients, and sunlight, reducing crop yield.\n2. **Harboring Pests and Diseases:** Weeds serve as alternate hosts for crop insect pests, pathogenic fungi, and viruses.\n3. **Contaminating Harvests:** Weed seeds mix with harvested crop seeds, lowering market quality and commercial value.\n4. **Increasing Production Costs:** Weeds require additional labor and expenses for weeding and herbicide applications.",
        "maxMarks": 6
      }
    ]
  }
];

export const SET_BECE_MOCK_8_SCIENCE_P1 = {
  title: "Paper 1: Objective Test (Mock 8)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedMock8P1
};

export const SET_BECE_MOCK_8_SCIENCE_P2 = {
  title: "Paper 2: Practical & Theory Essay (Mock 8)",
  durationMinutes: 105,
  instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
  totalQuestions: 5,
  questions: paper2Mock8Questions
};

export const SET_BECE_MOCK_8_SCIENCE_COMPLETE = {
  id: "mock_8",
  setNumber: 139,
  subject: "Integrated Science",
  title: "BECE Integrated Science Mock 8 (Comprehensive National Standards Suite)",
  totalDurationMinutes: 150,
  paper1: SET_BECE_MOCK_8_SCIENCE_P1,
  paper2: SET_BECE_MOCK_8_SCIENCE_P2,
  metadata: {
    isMock: true,
    isMockExam: true,
    setNumber: 139,
    version: "NaCCA JHS Standards-Compliant",
    totalMarks: 140,
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 4,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
