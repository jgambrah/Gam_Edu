/**
 * 2005 BECE Integrated Science Paper 1 (Set 108 Objective Test Variant)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_2005_variant
 * Set Number: Set 108
 * Format: 4-Option (A-D) Framework
 * Balanced Distribution: Exactly 10 A, 10 B, 10 C, 10 D (0% skew)
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
 */

export const svgQ10LeverSystem = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 160' width='100%' height='150' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Ground Level --><line x1='20' y1='125' x2='340' y2='125' stroke='#64748b' stroke-width='2'/><!-- Pivot / Fulcrum (Small Stone / Block) --><polygon points='110,85 95,125 125,125' fill='#3b82f6' stroke='#1d4ed8' stroke-width='2'/><text x='110' y='142' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Pivot</text><!-- Lever Bar (Crowbar / Timber) --><line x1='35' y1='75' x2='320' y2='95' stroke='#cbd5e1' stroke-width='5' stroke-linecap='round'/><!-- Heavy Stone Load on Left --><ellipse cx='45' cy='65' rx='20' ry='15' fill='#64748b' stroke='#94a3b8' stroke-width='2'/><text x='45' y='69' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>Stone</text><!-- Load Distance Dimension X (Load to Pivot) --><line x1='45' y1='40' x2='110' y2='40' stroke='#f59e0b' stroke-width='1.8'/><line x1='45' y1='35' x2='45' y2='45' stroke='#f59e0b' stroke-width='1.5'/><line x1='110' y1='35' x2='110' y2='45' stroke='#f59e0b' stroke-width='1.5'/><text x='77' y='32' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Distance X</text><!-- Effort Distance Dimension Y (Pivot to Effort) --><line x1='110' y1='40' x2='315' y2='40' stroke='#10b981' stroke-width='1.8'/><line x1='315' y1='35' x2='315' y2='45' stroke='#10b981' stroke-width='1.5'/><text x='212' y='32' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>Distance Y</text><!-- Downward Effort Arrow at Right End --><line x1='315' y1='65' x2='315' y2='92' stroke='#ef4444' stroke-width='2.5'/><polygon points='311,88 315,96 319,88' fill='#ef4444'/><text x='315' y='58' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>Effort</text><text x='180' y='154' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LEVER SYSTEM: DISTANCE X = LOAD DISTANCE; Y = EFFORT DISTANCE</text></svg></div>";

export const SET_BECE_2005_SCIENCE_P1: any = {
  id: "paper_2005_variant",
  title: "2005 BECE Integrated Science Paper 1 (Set 108 Objective)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2005 BECE Standardized Objective Examination",
  variantType: "past_paper_variant",
  year: 2005,
  paperType: 1,
  setNumber: 108,
  era: "classic",
  totalQuestions: 40,
  version: 1,
  format: "multiple_choice",
  durationMinutes: 45,
  instructions: "Answer all forty questions. Each question is followed by four options lettered A to D. Choose the correct option for each question.",
  questions: [
  {
    "number": 1,
    "prompt": "Diatomic hydrogen gas is represented by the chemical molecular formula $\\text{H}_2$. This chemical notation represents:",
    "options": [
      "Two isolated, uncombined atoms of hydrogen",
      "One single molecule composed of two chemically combined hydrogen atoms",
      "Two separate chemical elements of hydrogen",
      "Two positively charged hydrogen ions"
    ],
    "correctAnswer": "One single molecule composed of two chemically combined hydrogen atoms",
    "hint": "The subscript '2' indicates the atomicity of a single covalently bonded molecule.",
    "workedSolution": "Chemical formulas with subscripts describe molecular atomicity. $\\text{H}_2$ denotes one diatomic molecule formed by two covalently bonded hydrogen atoms.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "A solid metallic rod undergoes thermal expansion and increases in length when there is:",
    "options": [
      "An increase in the total number of orbiting valence electrons",
      "An increase in thermal heat energy increasing atomic vibrational spacing",
      "A decrease in the inter-atomic spacing between metallic lattice ions",
      "A sudden decrease in internal kinetic energy"
    ],
    "correctAnswer": "An increase in thermal heat energy increasing atomic vibrational spacing",
    "hint": "Heating increases kinetic vibration of atoms, causing them to push slightly farther apart.",
    "workedSolution": "Heating supplies thermal energy that increases atomic lattice vibrations, expanding the average distance between neighboring atoms (thermal expansion).",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Which electrical safety protective component contains a low-melting-point wire that melts to break the circuit when current becomes excessive?",
    "options": [
      "An electrical fuse",
      "A protective earth wire",
      "A lightning arrestor conductor",
      "A standard manual knife switch"
    ],
    "correctAnswer": "An electrical fuse",
    "hint": "Blows automatically during an electrical short circuit or overload.",
    "workedSolution": "A fuse is a safety protective device containing a low-melting-point wire that heats and melts if current exceeds safe limits, breaking the circuit.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "A candle object is placed at a perpendicular distance of $20\\text{ cm}$ in front of a flat plane mirror. What is the total distance between the candle and its virtual image?",
    "options": [
      "20 cm",
      "60 cm",
      "80 cm",
      "40 cm"
    ],
    "correctAnswer": "40 cm",
    "hint": "In plane mirrors, image distance behind mirror equals object distance in front: $$d = 20 + 20$$.",
    "workedSolution": "In a plane mirror, object distance equals image distance ($u = v = 20\\text{ cm}$). Total distance between object and image is $20\\text{ cm} + 20\\text{ cm} = 40\\text{ cm}$.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "In a direct-current electrical circuit consisting of a chemical dry cell, a switch, connecting wires, and a lamp, the bulb illuminates only when:",
    "options": [
      "A complete, closed conductive loop connects both battery terminals to the lamp",
      "The switch is kept in an open position with disconnected air gaps",
      "The connecting wires are fabricated from plastic insulation",
      "The cell delivers an alternating current of zero potential"
    ],
    "correctAnswer": "A complete, closed conductive loop connects both battery terminals to the lamp",
    "hint": "Charges require an unbroken conducting pathway to circulate through the bulb filament.",
    "workedSolution": "An electric bulb lights up only when a continuous, closed conductive circuit connects the positive and negative terminals, driving electric current through the filament.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Almost all forms of energy utilized on Earth (fossil fuels, wind, biomass, hydrological) can ultimately be traced back to:",
    "options": [
      "Geothermal earthquakes",
      "Solar radiant energy from the Sun",
      "Oceanic tidal wave friction",
      "Atmospheric thunderclouds"
    ],
    "correctAnswer": "Solar radiant energy from the Sun",
    "hint": "The central thermonuclear star driving winds, evaporation, and plant photosynthesis.",
    "workedSolution": "The Sun is the primary source of terrestrial energy; solar radiation drives the water cycle, wind currents, and photosynthetic plant growth that formed fossil fuels.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "As a ripe mango fruit detaches from a high branch and falls freely toward the ground, its initial gravitational potential energy is converted into:",
    "options": [
      "Acoustic sound energy only",
      "Chemical potential energy",
      "Internal nuclear binding energy",
      "Mechanical kinetic energy"
    ],
    "correctAnswer": "Mechanical kinetic energy",
    "hint": "Loss of vertical height corresponds to an increase in speed ($PE \\to KE$).",
    "workedSolution": "By the Law of Conservation of Energy, as height decreases during free-fall, gravitational potential energy is converted into kinetic energy of motion ($mgh = \\frac{1}{2}mv^2$).",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Household electric appliances utilize electricity to operate motors, produce heat, and emit light. This proves that electricity is a form of:",
    "options": [
      "Energy capable of doing work",
      "Mechanical contact force",
      "Solid matter",
      "Elementary simple machine"
    ],
    "correctAnswer": "Energy capable of doing work",
    "hint": "Energy is defined as the capacity to do mechanical work.",
    "workedSolution": "Electricity is a secondary form of energy (flow of charge) that does mechanical work, generates thermal heat, and produces light in electrical appliances.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "A horizontal pulling force of $2.0\\text{ N}$ moves a toy cart through a displacement distance of $10.0\\text{ m}$ in the direction of the force. Calculate the work done.",
    "options": [
      "20 Joules",
      "5 Joules",
      "8 Joules",
      "12 Joules"
    ],
    "correctAnswer": "20 Joules",
    "hint": "$$\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (d) = 2.0 \\times 10.0$$.",
    "workedSolution": "$$\\text{Work Done } (W) = F \\times d = 2.0\\text{ N} \\times 10.0\\text{ m} = 20.0\\text{ Joules (J)}$$.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "In the lever system illustrated below used to pry up a heavy stone, what technical term defines the distance X from the stone to the pivot?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 160' width='100%' height='150' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Ground Level --><line x1='20' y1='125' x2='340' y2='125' stroke='#64748b' stroke-width='2'/><!-- Pivot / Fulcrum (Small Stone / Block) --><polygon points='110,85 95,125 125,125' fill='#3b82f6' stroke='#1d4ed8' stroke-width='2'/><text x='110' y='142' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Pivot</text><!-- Lever Bar (Crowbar / Timber) --><line x1='35' y1='75' x2='320' y2='95' stroke='#cbd5e1' stroke-width='5' stroke-linecap='round'/><!-- Heavy Stone Load on Left --><ellipse cx='45' cy='65' rx='20' ry='15' fill='#64748b' stroke='#94a3b8' stroke-width='2'/><text x='45' y='69' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>Stone</text><!-- Load Distance Dimension X (Load to Pivot) --><line x1='45' y1='40' x2='110' y2='40' stroke='#f59e0b' stroke-width='1.8'/><line x1='45' y1='35' x2='45' y2='45' stroke='#f59e0b' stroke-width='1.5'/><line x1='110' y1='35' x2='110' y2='45' stroke='#f59e0b' stroke-width='1.5'/><text x='77' y='32' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Distance X</text><!-- Effort Distance Dimension Y (Pivot to Effort) --><line x1='110' y1='40' x2='315' y2='40' stroke='#10b981' stroke-width='1.8'/><line x1='315' y1='35' x2='315' y2='45' stroke='#10b981' stroke-width='1.5'/><text x='212' y='32' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>Distance Y</text><!-- Downward Effort Arrow at Right End --><line x1='315' y1='65' x2='315' y2='92' stroke='#ef4444' stroke-width='2.5'/><polygon points='311,88 315,96 319,88' fill='#ef4444'/><text x='315' y='58' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>Effort</text><text x='180' y='154' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LEVER SYSTEM: DISTANCE X = LOAD DISTANCE; Y = EFFORT DISTANCE</text></svg></div>",
    "options": [
      "The load distance (load arm)",
      "The effort distance (effort arm)",
      "The mechanical fulcrum",
      "The velocity ratio"
    ],
    "correctAnswer": "The load distance (load arm)",
    "hint": "The distance measured from the load to the fixed pivot point.",
    "workedSolution": "In lever mechanics, the perpendicular distance from the load to the fulcrum is the load distance (load arm), while the distance from effort to fulcrum is the effort distance.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "In the crowbar lever system shown above, less effort force is required to pry up the heavy stone when:",
    "options": [
      "Effort distance Y is significantly greater than load distance X (Y > X)",
      "Effort distance Y is exactly equal to load distance X",
      "Effort distance Y is much smaller than load distance X",
      "The heavy stone is positioned directly on top of the pivot"
    ],
    "correctAnswer": "Effort distance Y is significantly greater than load distance X (Y > X)",
    "hint": "By the principle of moments, a longer effort arm provides greater mechanical advantage ($E \\times Y = L \\times X$).",
    "workedSolution": "By the Principle of Moments ($E \\times Y = L \\times X$), increasing effort distance $Y$ relative to $X$ decreases the required effort force ($E = L \\times \\frac{X}{Y}$).",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "In animal nutrition and trophic ecology, an animal that feeds naturally on both plant vegetation and other animals is classified as:",
    "options": [
      "An obligate herbivore",
      "An omnivore",
      "A specialized carnivore",
      "A saprophytic decomposer"
    ],
    "correctAnswer": "An omnivore",
    "hint": "Humans, domestic pigs, and chimpanzees eat both plant and animal matter.",
    "workedSolution": "Omnivores possess anatomical and physiological adaptations to digest and obtain nutrients from both plant matter and animal tissue.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "A daily diet that supplies all essential classes of nutrients (carbohydrates, proteins, fats, vitamins, minerals, water, and roughage) in correct balanced proportions is a:",
    "options": [
      "Balanced diet",
      "High-caloric diet",
      "Vegetarian diet",
      "Protein concentrate ration"
    ],
    "correctAnswer": "Balanced diet",
    "hint": "Contains nutrients in the correct proportions required for optimal metabolic health.",
    "workedSolution": "A balanced diet provides all essential macronutrients and micronutrients in adequate proportions and quantities to sustain physiological health and growth.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "Severe nutritional deficiency of dietary proteins in weaning infants and young children results in the clinical disorder known as:",
    "options": [
      "Endemic goitre",
      "Kwashiorkor",
      "Skeletal rickets",
      "Nutritional scurvy"
    ],
    "correctAnswer": "Kwashiorkor",
    "hint": "Characterized by abdominal edema (pot-belly), muscle wasting, and reddish thinning hair.",
    "workedSolution": "Kwashiorkor is a form of severe protein-energy malnutrition characterized by fluid edema, distended abdomen, hepatomegaly, and hair depigmentation.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "When testing for the presence of reducing sugars in a food sample using Fehling's solution (or Benedict's solution) and heating, the positive color change is:",
    "options": [
      "A deep purple coloration",
      "A persistent blue-black complex",
      "A bright yellow-green stain",
      "An insoluble brick-red precipitate"
    ],
    "correctAnswer": "An insoluble brick-red precipitate",
    "hint": "Alkaline copper (II) ions are reduced to red copper (I) oxide precipitate.",
    "workedSolution": "Heating reducing sugars with Fehling's or Benedict's solution reduces soluble blue $\\text{Cu}^{2+}$ ions into an insoluble brick-red precipitate of copper (I) oxide ($\\text{Cu}_2\\text{O}$).",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "Which biological pigment located within chloroplasts enables green leaves to capture solar radiant energy for photosynthesis?",
    "options": [
      "Xanthophyll",
      "Chlorophyll",
      "Anthocyanin",
      "Phloem sap"
    ],
    "correctAnswer": "Chlorophyll",
    "hint": "The magnesium-containing green pigment absorbing blue and red light wavelengths.",
    "workedSolution": "Chlorophyll absorbs photon light energy to drive the photolysis of water and ATP synthesis during the light reactions of photosynthesis.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "In human physiology, the enzymatic detoxification and conversion of poisonous metabolic by-products and toxic chemicals into harmless substances occurs in the:",
    "options": [
      "Kidneys",
      "Urinary bladder",
      "Duodenum",
      "Liver"
    ],
    "correctAnswer": "Liver",
    "hint": "The largest internal organ responsible for converting toxic ammonia into urea.",
    "workedSolution": "The liver carries out biological detoxification, metabolizing alcohol, drugs, and converting toxic ammonia into non-toxic urea via the ornithine cycle.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "Which vital biochemical life process is summarized by the chemical equation: $\\text{Glucose} + \\text{Oxygen} \\to \\text{Water} + \\text{Carbon dioxide} + \\text{Energy}$?",
    "options": [
      "Photosynthesis",
      "Aerobic cellular respiration",
      "Extracellular digestion",
      "Renal excretion"
    ],
    "correctAnswer": "Aerobic cellular respiration",
    "hint": "Catabolic oxidation of glucose within mitochondria liberating ATP energy.",
    "workedSolution": "Aerobic respiration breaks down glucose in the presence of oxygen within cellular mitochondria to release metabolic ATP energy, carbon dioxide, and water.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "During large-scale municipal drinking water purification, chlorine gas or hypochlorite is added to the water primarily to:",
    "options": [
      "Precipitate suspended colloidal clay particles",
      "Remove mineral hardness cations completely",
      "Destroy pathogenic bacteria and disease-causing germs (disinfection)",
      "Impart a sweet flavor to the treated water"
    ],
    "correctAnswer": "Destroy pathogenic bacteria and disease-causing germs (disinfection)",
    "hint": "Acts as a chemical disinfectant destroying water-borne bacteria.",
    "workedSolution": "Chlorination is the final disinfection stage in water treatment; chlorine oxidizes and destroys pathogenic bacteria and viruses, preventing water-borne epidemics.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "Arrange the following natural sources of water in order of INCREASING contamination (from cleanest/purest to most contaminated):\nI. Clean Rainwater, II. Surface Stream, III. Hand-dug Well, IV. Deep Borehole.",
    "options": [
      "I, II, IV, III",
      "II, III, I, IV",
      "I, IV, III, II",
      "III, II, IV, I"
    ],
    "correctAnswer": "I, IV, III, II",
    "hint": "Rainwater is pure distillate; deep boreholes are filtered by rocks; wells have surface seepage; streams receive open runoff.",
    "workedSolution": "Rainwater (I) has minimal impurities; deep borehole water (IV) is filtered by deep geological strata; wells (III) receive surface seepage; surface streams (II) collect open runoff and fecal contamination.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "A chemical solution in which no additional solute can dissolve at a specific constant temperature in the presence of excess solute is termed:",
    "options": [
      "A dilute solution",
      "An unsaturated solution",
      "A colloidal suspension",
      "A saturated solution"
    ],
    "correctAnswer": "A saturated solution",
    "hint": "The solution has reached dynamic equilibrium with undissolved solute.",
    "workedSolution": "A saturated solution contains the maximum concentration of dissolved solute in thermodynamic equilibrium with undissolved solute at a given temperature.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "A clear saturated sugar solution was cooled from 100°C down to 25°C, resulting in solid sugar crystals forming at the bottom. This observation proves that sugar:",
    "options": [
      "Is completely insoluble in cold water",
      "Is completely insoluble in boiling water",
      "Has higher solubility in hot water than in cold water",
      "Has higher solubility in cold water than in hot water"
    ],
    "correctAnswer": "Has higher solubility in hot water than in cold water",
    "hint": "Solubility of solid solutes typically increases with temperature; cooling precipitates excess solute.",
    "workedSolution": "The solubility of solid sucrose increases with temperature. Cooling decreases solubility, forcing excess dissolved solute to precipitate out as crystals (crystallization).",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "Liquid water is referred to scientifically as a 'universal solvent' primarily because it:",
    "options": [
      "Is the most chemically pure liquid on Earth",
      "Is found within all living biological cells",
      "Has zero electrical dipole moment",
      "Dissolves a greater variety of chemical solutes than any other liquid"
    ],
    "correctAnswer": "Dissolves a greater variety of chemical solutes than any other liquid",
    "hint": "Its polar molecular structure and high dielectric constant dissolve a vast range of ionic and polar compounds.",
    "workedSolution": "Water is called the universal solvent because its polar bent structure ($\text{H}_2\text{O}$) and high dielectric constant enable it to dissolve a wider range of substances than any other liquid.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "What is the formal oxidation state (combining charge) of the sulfur atom in the gaseous compound sulfur dioxide ($\text{SO}_2$)?",
    "options": [
      "+4",
      "-2",
      "+2",
      "-4"
    ],
    "correctAnswer": "+4",
    "hint": "Each oxygen atom has an oxidation number of $-2$: $$S + 2(-2) = 0 \\implies S = +4$$.",
    "workedSolution": "In neutral $\\text{SO}_2$, oxygen has an oxidation number of $-2$. Therefore: $x + 2(-2) = 0 \\implies x - 4 = 0 \\implies x = +4$.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "In a vertical soil profile, the topsoil layer (Horizon A) supports vigorous agricultural crop growth primarily because it:",
    "options": [
      "Is composed of unweathered impermeable bedrock",
      "Contains zero capillary air macropores",
      "Contains abundant decayed organic humus and available mineral nutrients",
      "Drains water instantaneously like coarse gravel"
    ],
    "correctAnswer": "Contains abundant decayed organic humus and available mineral nutrients",
    "hint": "Dark, nutrient-rich layer containing decomposed biological matter (humus).",
    "workedSolution": "Topsoil (Horizon A) contains dark organic humus that enhances crumb structure, retains moisture, and releases nitrogen, phosphorus, and potassium to plant roots.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "Cultivated crop plants fail to grow effectively in coarse gravelly substrates primarily because gravel:",
    "options": [
      "Has pore spaces too small for root penetration",
      "Contains toxic concentrations of dissolved aluminum",
      "Has excessively large pore spaces that fail to retain capillary moisture",
      "Completely excludes all atmospheric oxygen from roots"
    ],
    "correctAnswer": "Has excessively large pore spaces that fail to retain capillary moisture",
    "hint": "Large particles allow gravitational water to drain away immediately, causing water stress.",
    "workedSolution": "Gravel consists of large mineral fragments with wide macropores that cannot hold capillary water against gravity, leading to rapid water deficit and drought stress.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "Which of the following biological parasites lives and reproduces internally inside the red blood cells of human beings?",
    "options": [
      "Plasmodium protozoa",
      "Head louse (Pediculus)",
      "Intestinal tapeworm (Taenia)",
      "Ectoparasitic dog tick"
    ],
    "correctAnswer": "Plasmodium protozoa",
    "hint": "The causative pathogen of malaria inhabiting erythrocytes.",
    "workedSolution": "*Plasmodium* protozoa undergo asexual reproduction (schizogony) inside human erythrocytes, rupturing them to release merozoites and cause malarial paroxysms.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "The biological vector that transmits the pathogenic *Plasmodium* parasite from an infected person to a healthy individual is the:",
    "options": [
      "Male Anopheles mosquito",
      "Tsetse fly (Glossina)",
      "Female Anopheles mosquito",
      "River blackfly (Simulium)"
    ],
    "correctAnswer": "Female Anopheles mosquito",
    "hint": "Only females take blood meals to obtain proteins required for egg development.",
    "workedSolution": "Only female *Anopheles* mosquitoes feed on mammalian blood to develop viable eggs, transferring infectious *Plasmodium* sporozoites via salivary secretions.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "Which public health measure is effective in preventing and controlling the transmission of Guinea worm disease (*Dracunculiasis*)?",
    "options": [
      "Clearing tall grass and bushes around residential compounds",
      "Applying synthetic chemical larvicides to fast-flowing rapids",
      "Filtering drinking water through nylon mesh filters to remove Cyclops copepods",
      "Sleeping under pyrethroid insecticide-treated bed nets"
    ],
    "correctAnswer": "Filtering drinking water through nylon mesh filters to remove Cyclops copepods",
    "hint": "Transmission occurs by ingesting stagnant pond water containing water fleas (*Cyclops*) harboring larvae.",
    "workedSolution": "Guinea worm is acquired by drinking pond water containing *Cyclops* copepods infected with larvae. Filtering water through nylon sieves prevents ingestion.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Which meteorological weather instrument is used at observation stations to measure the relative humidity of the atmosphere?",
    "options": [
      "A cup anemometer",
      "An aneroid barometer",
      "A liquid hydrometer",
      "A wet-and-dry bulb hygrometer"
    ],
    "correctAnswer": "A wet-and-dry bulb hygrometer",
    "hint": "Uses differential evaporative cooling between dry and moist thermometer bulbs.",
    "workedSolution": "A hygrometer (such as a wet-and-dry bulb psychrometer) measures relative humidity based on evaporative cooling from a wet bulb thermometer.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "Approximately how many calendar days does it take the Moon to complete one full orbital revolution around planet Earth?",
    "options": [
      "1 day",
      "14 days",
      "28 days (approximately one lunar month)",
      "365 days"
    ],
    "correctAnswer": "28 days (approximately one lunar month)",
    "hint": "Corresponds to the monthly lunar cycle (approximately 27.3 to 29.5 days).",
    "workedSolution": "The Moon takes approximately 27.3 days (sidereal month) to 29.5 days (synodic month) to orbit Earth, rounded commonly in introductory science to 28 days.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "Carbon steel used in construction and tool manufacturing is classified chemically as a:",
    "options": [
      "Solid-in-liquid colloidal suspension",
      "Solid-in-solid solution (interstitial metallic alloy)",
      "Gas-in-solid homogeneous mixture",
      "Pure single-element substance"
    ],
    "correctAnswer": "Solid-in-solid solution (interstitial metallic alloy)",
    "hint": "Carbon atoms fit between the crystal lattice of solid iron atoms.",
    "workedSolution": "Steel is an interstitial solid-in-solid solution (alloy) where small non-metal carbon atoms occupy spaces between iron atoms in the crystal lattice.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "Which of the following chemical elements is classified as an alkali metallic element located in Group 1 of the Periodic Table?",
    "options": [
      "Solid carbon [C]",
      "Diatomic nitrogen gas [N₂]",
      "Sodium [Na]",
      "Solid sulfur powder [S₈]"
    ],
    "correctAnswer": "Sodium [Na]",
    "hint": "A highly reactive soft metal stored under paraffin oil; forms $\text{Na}^+$ ions.",
    "workedSolution": "Sodium ($\text{Na}$) is a Group 1 alkali metal, while carbon, nitrogen, and sulfur are non-metallic elements.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "Noble metals such as gold and platinum are chosen for crafting fine jewelry and ornaments primarily because they have low:",
    "options": [
      "Electrical and thermal conductivity",
      "Mechanical ductility and malleability",
      "Chemical reactivity (high resistance to corrosion and tarnishing)",
      "Melting and boiling temperatures"
    ],
    "correctAnswer": "Chemical reactivity (high resistance to corrosion and tarnishing)",
    "hint": "They do not react with atmospheric oxygen, moisture, or sweat, retaining their luster.",
    "workedSolution": "Gold and platinum are unreactive noble metals positioned at the bottom of the electrochemical reactivity series, resisting oxidation, tarnishing, and corrosion.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "Which food preservation technique inhibits the metabolic activity and reproduction of food spoilage bacteria by maintaining low temperatures?",
    "options": [
      "Open thermal canning",
      "Refrigeration (and chilling)",
      "Solar dehydration drying",
      "Acetic acid pickling"
    ],
    "correctAnswer": "Refrigeration (and chilling)",
    "hint": "Chilling food at $0^circ\text{C}$ to $4^circ\text{C}$ slows microbial enzyme kinetics.",
    "workedSolution": "Refrigeration lowers ambient temperatures ($0^circ\text{C}$ to $4^circ\text{C}$), slowing bacterial enzyme kinetics and metabolic reproduction without destroying food nutrients.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "In human cardiovascular hematology, what is the primary physiological function performed by blood platelets (thrombocytes)?",
    "options": [
      "Initiating blood clotting to prevent excessive hemorrhage upon injury",
      "Transporting dissolved oxygen as oxyhemoglobin",
      "Engulfing pathogenic bacteria via phagocytosis",
      "Buffering internal core body temperature"
    ],
    "correctAnswer": "Initiating blood clotting to prevent excessive hemorrhage upon injury",
    "hint": "Release thromboplastin to catalyze the conversion of prothrombin into thrombin.",
    "workedSolution": "Platelets adhere to damaged endothelial surfaces and release clotting factors that convert soluble fibrinogen into an insoluble fibrin mesh, forming a clot.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "A bony fish is able to swim rapidly through water with minimal hydrodynamic drag resistance because it possesses:",
    "options": [
      "Broad flattened caudal tail fins only",
      "An internal swim bladder holding air",
      "Overlapping epidermal scales on the head",
      "A streamlined (fusiform) body shape"
    ],
    "correctAnswer": "A streamlined (fusiform) body shape",
    "hint": "Pointed at the snout, broad in the middle, and tapering smoothly toward the tail.",
    "workedSolution": "A streamlined (fusiform) body contour tapers smoothly at both ends, minimizing friction and turbulence as the fish displaces water during swimming.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "When an athletic pupil jumps upward into the air, they return to the ground due to the:",
    "options": [
      "Magnetic attraction exerted by the Earth's North pole",
      "Downwards pull of the Earth's gravitational attraction force",
      "Atmospheric drag resistance pushing downward",
      "Hydrostatic barometric pressure of the troposphere"
    ],
    "correctAnswer": "Downwards pull of the Earth's gravitational attraction force",
    "hint": "The non-contact gravitational pull ($W = mg$) directed toward the center of the Earth.",
    "workedSolution": "The Earth exerts a downward gravitational force ($W = mg$) on all masses near its surface, decelerating upward motion and accelerating the body back to Earth.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "A solid piece of metal displaces $5.0\\text{ cm}^3$ of water when completely submerged in a measuring cylinder. If its mass is $35.0\\text{ g}$, calculate its density.",
    "options": [
      "30.0 g cm⁻³",
      "40.0 g cm⁻³",
      "175.0 g cm⁻³",
      "7.0 g cm⁻³"
    ],
    "correctAnswer": "7.0 g cm⁻³",
    "hint": "$$\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)} = \\frac{35.0}{5.0}$$.",
    "workedSolution": "$$\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)} = \\frac{35.0\\text{ g}}{5.0\\text{ cm}^3} = 7.0\\text{ g cm}^{-3}$$.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "In the human respiratory tract, oxygen gas from inspired alveolar air enters surrounding capillary blood across the respiratory membrane by:",
    "options": [
      "Active capillary suction",
      "Osmotic filtration",
      "Bulk hydrodynamic pumping",
      "Diffusion down its partial pressure concentration gradient"
    ],
    "correctAnswer": "Diffusion down its partial pressure concentration gradient",
    "hint": "Moves passively from high alveolar partial pressure to lower capillary blood partial pressure.",
    "workedSolution": "Oxygen diffuses passively down its partial pressure gradient across single-cell-thick alveolar and capillary walls into erythrocytes to bind with hemoglobin.",
    "points": 1
  }
]
};
