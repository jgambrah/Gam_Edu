/**
 * 1991 BECE Integrated Science Examination (Set 123 Cloned Practice Variant)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_1991_variant
 * Set Number: Set 123
 * Format: 
 *   - Paper 1 (40 Objectives, exactly 10 A, 10 B, 10 C, 10 D)
 *   - Paper 2 (4 Theory & Practical Essay Questions, 20 marks each = 80 marks total)
 * Visual Setup:
 *   - svgQ1bReflectionPlaneMirror: Law of Reflection on a plane mirror (i = r)
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

export const svgQ1bReflectionPlaneMirror = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 210' width='100%' height='195' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='40' y1='150' x2='320' y2='150' stroke='#38bdf8' stroke-width='3'/><path d='M 45 150 L 35 160 M 75 150 L 65 160 M 105 150 L 95 160 M 135 150 L 125 160 M 165 150 L 155 160 M 195 150 L 185 160 M 225 150 L 215 160 M 255 150 L 245 160 M 285 150 L 275 160 M 315 150 L 305 160' stroke='#64748b' stroke-width='1.5'/><text x='180' y='178' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Plane Mirror Surface</text><line x1='180' y1='30' x2='180' y2='150' stroke='#cbd5e1' stroke-width='1.8' stroke-dasharray='4,4'/><text x='185' y='42' font-size='10' font-weight='bold' fill='#cbd5e1'>Normal (N)</text><circle cx='180' cy='150' r='3.5' fill='#f59e0b'/><text x='180' y='142' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>O</text><line x1='65' y1='55' x2='180' y2='150' stroke='#facc15' stroke-width='2.5'/><polygon points='115,97 125,102 120,109' fill='#facc15'/><text x='70' y='45' font-size='10' font-weight='bold' fill='#facc15'>Incident Ray</text><line x1='180' y1='150' x2='295' y2='55' stroke='#10b981' stroke-width='2.5'/><polygon points='240,109 235,102 245,97' fill='#10b981'/><text x='290' y='45' font-size='10' font-weight='bold' fill='#10b981'>Reflected Ray</text><path d='M 180 110 A 40 40 0 0 0 152 127' fill='none' stroke='#facc15' stroke-width='1.5'/><text x='162' y='105' font-size='11' font-weight='bold' fill='#facc15'>i</text><path d='M 180 110 A 40 40 0 0 1 208 127' fill='none' stroke='#10b981' stroke-width='1.5'/><text x='194' y='105' font-size='11' font-weight='bold' fill='#10b981'>r</text><text x='180' y='198' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LAW OF REFLECTION: ANGLE OF INCIDENCE (i) = ANGLE OF REFLECTION (r)</text></svg></div>";

export const SET_BECE_1991_SCIENCE_P1_QUESTIONS: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "In the human digestive system, the chemical enzymatic digestion of dietary carbohydrates (starches) begins in the:",
    "options": [
      "Muscular throat (pharynx)",
      "Mouth (buccal cavity)",
      "Acidic stomach cavity",
      "Duodenum of small intestine"
    ],
    "correctAnswer": "Mouth (buccal cavity)",
    "hint": "Salivary glands secrete salivary amylase (ptyalin) to initiate starch breakdown.",
    "workedSolution": "Carbohydrate digestion initiates in the mouth, where salivary amylase (ptyalin) hydrolyzes cooked starch into maltose disaccharides. Protein digestion begins in the stomach.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "During daytime photosynthesis, autotrophic green plants synthesize organic glucose using chlorophyll, radiant sunlight, water, and:",
    "options": [
      "Diatomic oxygen gas [O₂]",
      "Gaseous water steam",
      "Pure hydrogen gas [H₂]",
      "Carbon dioxide gas [CO₂]"
    ],
    "correctAnswer": "Carbon dioxide gas [CO₂]",
    "hint": "An atmospheric gas absorbed through stomata to provide the carbon backbone of glucose.",
    "workedSolution": "Photosynthesis requires carbon dioxide (CO₂) absorbed from the air and water (H₂O) absorbed by roots, energized by sunlight trapped by chlorophyll.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Which of the following common solid materials is an excellent conductor of thermal heat energy?",
    "options": [
      "Dry natural wood",
      "Vulcanized rubber",
      "Metallic copper",
      "Synthetic polymer plastic"
    ],
    "correctAnswer": "Metallic copper",
    "hint": "Metals contain delocalized free valence electrons that rapidly transfer thermal energy.",
    "workedSolution": "Copper is a metal with free mobile valence electrons that transfer heat rapidly via lattice vibrations and electron transport. Wood, rubber, and plastics are thermal insulators.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "Calculate the mechanical work done when an applied horizontal force of $2.5\\text{ N}$ displaces an object through a linear distance of $4.0\\text{ m}$:",
    "options": [
      "10.0 Joules",
      "0.6 Joules",
      "1.5 Joules",
      "1.6 Joules"
    ],
    "correctAnswer": "10.0 Joules",
    "hint": "\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (d) = 2.5 \\times 4.0.",
    "workedSolution": "$$\\text{Work Done } (W) = F \\times d = 2.5\\text{ N} \\times 4.0\\text{ m} = 10.0\\text{ Joules (J)}$$.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "A scientific specialist whose professional work involves observing, studying, and forecasting day-to-day atmospheric weather conditions is:",
    "options": [
      "An aircraft pilot",
      "A medical physician",
      "An astronomical astrologer",
      "A meteorologist"
    ],
    "correctAnswer": "A meteorologist",
    "hint": "Studies meteorological elements such as air temperature, pressure, wind, and rainfall.",
    "workedSolution": "A meteorologist records atmospheric data using weather instruments to forecast weather. Astronomers study celestial bodies, and astrologers make pseudoscientific horoscopes.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "A young child presenting with clinical symptoms of Kwashiorkor (protruding belly, swollen limbs, and pale hair) is suffering from a dietary deficiency of:",
    "options": [
      "Dietary fats and oils",
      "Water-soluble vitamins",
      "Essential mineral salts",
      "Proteins"
    ],
    "correctAnswer": "Proteins",
    "hint": "A severe form of protein-energy malnutrition occurring when children are weaned on starch alone.",
    "workedSolution": "Kwashiorkor is caused by severe protein deficiency in the diet, leading to hypoalbuminemia, fluid retention (edema), muscle wasting, and depigmentation.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "Which of the following liquid substances is widely regarded as the 'universal solvent' because it dissolves a wide variety of chemical solutes?",
    "options": [
      "Refined kerosene",
      "Liquid palm oil",
      "Mineral turpentine",
      "Pure liquid water"
    ],
    "correctAnswer": "Pure liquid water",
    "hint": "A polar molecule with a high dielectric constant that hydrates ionic and polar compounds.",
    "workedSolution": "Water is known as the universal solvent because its polar molecular geometry and high dielectric constant allow it to dissolve more substances than any other liquid.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "All of the following food preservation methods are traditionally and routinely practiced in domestic homes EXCEPT:",
    "options": [
      "Thermal smoking over firewood hearths",
      "Salting and sun-drying of fish",
      "Industrial commercial canning in airtight metal tins",
      "Thermal boiling and reheating"
    ],
    "correctAnswer": "Industrial commercial canning in airtight metal tins",
    "hint": "Canning requires factory machinery, high-pressure steam retorts, and vacuum sealing.",
    "workedSolution": "Smoking, salting, boiling, and sun-drying are domestic food preservation methods. Canning is an industrial commercial process requiring specialized factory machinery.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "What is the international chemical symbol for the metallic alkali element Potassium?",
    "options": [
      "Fe",
      "K",
      "P",
      "Pb"
    ],
    "correctAnswer": "K",
    "hint": "Derived from its Neo-Latin elemental name Kalium; P represents phosphorus, Fe iron, Pb lead.",
    "workedSolution": "The chemical symbol for Potassium is K (from Latin Kalium). Fe represents iron, P represents phosphorus, and Pb represents lead.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "In tropical crop agriculture, the vegetative somatic plant structure planted to propagate a banana or plantain plantation is:",
    "options": [
      "An underground creeping rhizome",
      "A woody stem cutting",
      "An apical stem tuber",
      "A vegetative sucker"
    ],
    "correctAnswer": "A vegetative sucker",
    "hint": "A lateral underground shoot arising from the mother corm bearing narrow sword leaves.",
    "workedSolution": "Bananas and plantains are propagated vegetatively using sword suckers (or corms), as cultivated varieties do not produce viable botanical seeds.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "The physical process by which liquid kerosene ascends spontaneously up the cotton fabric wick of a storm lantern is:",
    "options": [
      "Surface evaporation",
      "Thermal conduction",
      "Capillarity (capillary action)",
      "Molecular diffusion"
    ],
    "correctAnswer": "Capillarity (capillary action)",
    "hint": "Liquid rising inside narrow pores due to adhesive forces overcoming cohesive forces.",
    "workedSolution": "Capillarity is the tendency of a liquid to rise in narrow tubes or porous fibers, driven by adhesive attraction between liquid kerosene and cotton fibers exceeding cohesive forces.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "Which of the following vertebrate animals is an amphibian that breathes with lungs on land and absorbs oxygen through moist skin in water?",
    "options": [
      "The house mouse",
      "The domestic rat",
      "The frog (or toad)",
      "The grasscutter (greater cane rat)"
    ],
    "correctAnswer": "The frog (or toad)",
    "hint": "A cold-blooded vertebrate with moist, scaleless skin adapted to both aquatic and terrestrial habitats.",
    "workedSolution": "Frogs and toads are amphibians capable of living on land and in freshwater, using lungs and moist skin for respiration. Mice, rats, and grasscutters are terrestrial mammals.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "A permanent bar magnet will exert an attractive magnetic force on all of the following ferromagnetic items EXCEPT:",
    "options": [
      "Steel office paper pins",
      "Carbon steel tailoring scissors",
      "Solid pure copper wire clippings",
      "Iron masonry nails"
    ],
    "correctAnswer": "Solid pure copper wire clippings",
    "hint": "Copper is a non-ferromagnetic diamagnetic metal that is not attracted by magnets.",
    "workedSolution": "Iron and steel are ferromagnetic materials strongly attracted to magnets. Pure copper is non-magnetic and experiences no magnetic attraction.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "When a moving block slides from a rough, high-friction horizontal surface onto a smooth, frictionless ice surface with constant energy, its velocity:",
    "options": [
      "Increases (or remains constant without deceleration)",
      "Decreases rapidly to zero",
      "Becomes immediately zero",
      "Oscillates back and forth"
    ],
    "correctAnswer": "Increases (or remains constant without deceleration)",
    "hint": "Removing frictional retarding resistance allows kinetic energy to be conserved without deceleration.",
    "workedSolution": "Friction opposes motion. When an object moves from a rough surface onto a smooth, low-friction surface, the removal of opposing retarding force allows it to maintain or increase speed.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "Under standard ambient atmospheric conditions, how many fundamental physical states of matter are recognized in classical science?",
    "options": [
      "3 (Solid, Liquid, and Gas)",
      "2 states",
      "4 states",
      "5 states"
    ],
    "correctAnswer": "3 (Solid, Liquid, and Gas)",
    "hint": "Solids maintain shape and volume; liquids flow with fixed volume; gases expand freely.",
    "workedSolution": "Under standard ambient terrestrial conditions, matter exists in three classical physical states: Solid, Liquid, and Gas. (Plasma occurs under extreme temperatures).",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "All of the following vertebrate animals reproduce by laying external eggs (oviparity) EXCEPT the:",
    "options": [
      "Domestic rabbit (which gives birth to live young)",
      "Tilapia freshwater fish",
      "Wall rainbow lizard",
      "Terrestrial common toad"
    ],
    "correctAnswer": "Domestic rabbit (which gives birth to live young)",
    "hint": "A viviparous placental mammal that nurses its offspring with milk.",
    "workedSolution": "Fish, lizards, and toads lay external eggs (oviparous). Rabbits are placental mammals that undergo internal gestation and give birth to live young (viviparous).",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "Which of the following anatomical structures is an epithelial tissue outgrowth rather than a specialized mammalian sense organ?",
    "options": [
      "The optic eye",
      "The auditory ear",
      "Scalp hair (and fingernails)",
      "The sensory skin"
    ],
    "correctAnswer": "Scalp hair (and fingernails)",
    "hint": "Made of dead keratinized protein filaments without sensory receptor cells.",
    "workedSolution": "The five classical sense organs are the eyes, ears, nose, tongue, and skin. Hair consists of non-living keratinized cells lacking sensory receptor nerves.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "Which laboratory separation technique is used to separate an insoluble suspended solid precipitate from a liquid solvent?",
    "options": [
      "Fractional distillation",
      "Gravity filtration through porous filter paper",
      "Thermal sublimation",
      "Open evaporation to dryness"
    ],
    "correctAnswer": "Gravity filtration through porous filter paper",
    "hint": "The filter paper retains solid particles as residue while liquid filtrate drains through.",
    "workedSolution": "Filtration separates insoluble solids from liquids: porous filter paper traps solid particles as residue while the clarified liquid drains through as filtrate.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "In community ecology, an organism that lives on or inside a host organism, deriving nutrients while causing harm, is classified as a:",
    "options": [
      "Symbiotic host",
      "Parasite",
      "Autotrophic producer",
      "Herbivorous consumer"
    ],
    "correctAnswer": "Parasite",
    "hint": "Examples include tapeworms, ticks, and dodder plants.",
    "workedSolution": "A parasite lives in or on another organism (the host), obtaining nutrients and shelter at the host's expense and often causing disease or harm.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "The clinical symptom of passing blood in urine (terminal hematuria) is a diagnostic indicator of infection with:",
    "options": [
      "Bacterial typhoid fever",
      "Bilharziasis (Urinary Schistosomiasis)",
      "Syphilis venereal disease",
      "Epidemic cholera"
    ],
    "correctAnswer": "Bilharziasis (Urinary Schistosomiasis)",
    "hint": "Caused by Schistosoma haematobium flukes damaging the blood vessels of the urinary bladder.",
    "workedSolution": "Bilharzia (schistosomiasis), caused by Schistosoma haematobium, damages veins surrounding the urinary bladder as spined eggs pierce tissues, causing hematuria.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "Which of the following cultivated agricultural food crops is classified botanically as an edible leafy vegetable crop?",
    "options": [
      "Pineapple fruit",
      "Irish potato stem tuber",
      "Cassava storage root",
      "Head cabbage [Brassica oleracea]"
    ],
    "correctAnswer": "Head cabbage [Brassica oleracea]",
    "hint": "Grown for its dense vegetative head of leaves eaten fresh or cooked.",
    "workedSolution": "Cabbage is an edible leafy vegetable crop rich in roughage and vitamins. Cassava and potatoes are root/tuber crops, and pineapple is a fruit crop.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "Lightweight insects (such as water striders and mosquito larvae) can rest and walk across the surface of water without sinking because of:",
    "options": [
      "Molecular liquid diffusion",
      "Capillary suction action",
      "Liquid surface tension",
      "Dynamic liquid viscosity"
    ],
    "correctAnswer": "Liquid surface tension",
    "hint": "Cohesive forces between surface water molecules form an elastic-like membrane.",
    "workedSolution": "Surface tension arises from unbalanced inward cohesive forces among surface water molecules, creating an elastic-like film that supports light insects.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "In chemical classification, a pure substance that consists exclusively of the exact same kind of atom (same atomic number) is:",
    "options": [
      "A physical mixture",
      "A binary chemical compound",
      "A chemical element",
      "A homogeneous solution"
    ],
    "correctAnswer": "A chemical element",
    "hint": "Cannot be decomposed into simpler substances by ordinary chemical reactions.",
    "workedSolution": "An element is a pure chemical substance consisting of only one type of atom (having the same atomic number) that cannot be broken down by chemical means.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "What fundamental physiological entity do human beings obtain from the metabolic oxidation of food nutrients to perform physical work?",
    "options": [
      "Blood volume",
      "Vitamins alone",
      "Metabolic energy (ATP)",
      "Proteins alone"
    ],
    "correctAnswer": "Metabolic energy (ATP)",
    "hint": "Chemical potential energy stored in covalent bonds is converted to ATP during respiration.",
    "workedSolution": "Food nutrients store chemical potential energy. Cellular respiration oxidizes glucose to yield ATP energy, fueling muscular contraction and biological work.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "Which calibrated meteorological instrument is installed at weather stations to measure atmospheric relative humidity?",
    "options": [
      "A mercury thermometer",
      "A wet-and-dry bulb hygrometer",
      "An optical photometer",
      "A botanical potometer"
    ],
    "correctAnswer": "A wet-and-dry bulb hygrometer",
    "hint": "Uses two thermometers (one dry, one bulb wrapped in wet muslin) to determine humidity.",
    "workedSolution": "A hygrometer (psychrometer) measures the relative humidity of air. Photometers measure light intensity, potometers measure plant transpiration, and thermometers measure temperature.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "In vascular plant morphology, the vegetative organ system that typically grows underground within the soil is the:",
    "options": [
      "Floral flower",
      "Foliage leaf",
      "Aerial shoot stem",
      "Root system"
    ],
    "correctAnswer": "Root system",
    "hint": "Anchors the plant into the soil and absorbs capillary water and mineral nutrients.",
    "workedSolution": "The root system is the subterranean part of the plant that anchors it in the soil and absorbs water and dissolved mineral ions.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "Which biological tropism directs the primary root of a germinating seedling to grow downwards into the subterranean soil?",
    "options": [
      "Positive geotropism (gravitropism)",
      "Negative hydrotropism",
      "Positive phototropism",
      "Negative geotropism"
    ],
    "correctAnswer": "Positive geotropism (gravitropism)",
    "hint": "Growth curvature directed toward the gravitational pull of the Earth.",
    "workedSolution": "Roots exhibit positive geotropism (growing downward toward gravity) and positive hydrotropism (toward water), anchoring the plant in the soil.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "In human reproductive biology, the standard physiological prenatal gestation period from fertilization to childbirth is approximately:",
    "options": [
      "9 months (38 to 40 weeks)",
      "5 months",
      "6 months",
      "7 months"
    ],
    "correctAnswer": "9 months (38 to 40 weeks)",
    "hint": "Equivalent to 280 days calculated from the first day of the last menstrual period.",
    "workedSolution": "The normal human gestational period lasts approximately 9 calendar months (around 40 weeks or 280 days), during which the fetus develops in the uterus.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "The mechanical detachment, scouring, and removal of fertile topsoil by running water or wind currents is termed:",
    "options": [
      "Soil erosion",
      "Crop rotation",
      "Plantation farming",
      "Chemical rock weathering"
    ],
    "correctAnswer": "Soil erosion",
    "hint": "Washes away topsoil nutrients, leaving degraded rills or gullies.",
    "workedSolution": "Soil erosion is the detachment and removal of topsoil by natural physical agents like moving water and wind. Weathering breaks down rocks in situ.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Under standard ambient room conditions ($25^\\circ\\text{C}$ and $1\\text{ atm}$), which of the following chemical elements exists as a LIQUID rather than a solid?",
    "options": [
      "Liquid mercury [Hg]",
      "Solid aluminum [Al]",
      "Solid lead [Pb]",
      "Solid silver [Ag]"
    ],
    "correctAnswer": "Liquid mercury [Hg]",
    "hint": "A heavy metallic element that is liquid at room temperature; used in barometers and thermometers.",
    "workedSolution": "Mercury (Hg) is the only metallic element that is liquid at standard room temperature (25°C). Aluminum, lead, silver, and potassium are solid metals.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "The vital biological life process by which living organisms produce new individuals of their own kind to increase in number is:",
    "options": [
      "Reproduction",
      "Somatic tissue growth",
      "Embryonic development",
      "Cellular multiplication alone"
    ],
    "correctAnswer": "Reproduction",
    "hint": "Can occur sexually or asexually to ensure continuity of the species.",
    "workedSolution": "Reproduction is the fundamental biological process by which living organisms generate offspring, increasing their population and ensuring species survival.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "Which of the following agricultural soil types possesses large macropores, drains water most rapidly, and retains the LEAST amount of water?",
    "options": [
      "Loamy agricultural soil",
      "Fine clayey soil",
      "Organic silt soil",
      "Sandy soil"
    ],
    "correctAnswer": "Sandy soil",
    "hint": "Coarse mineral particles allow gravitational water to percolate through rapidly.",
    "workedSolution": "Sandy soils consist of large, coarse particles with wide macropores that cannot hold capillary water against gravity, giving them the lowest water-holding capacity.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "When solid paraffin candle wax is gently heated in an evaporating dish, it undergoes a physical phase change from:",
    "options": [
      "Liquid to gas directly",
      "Liquid to open flame",
      "Solid to liquid (melting)",
      "Solid to gas directly"
    ],
    "correctAnswer": "Solid to liquid (melting)",
    "hint": "Heat weakens intermolecular forces, causing the solid wax to melt into a clear liquid.",
    "workedSolution": "Heating solid candle wax provides thermal kinetic energy that breaks crystalline intermolecular bonds, causing it to melt into liquid wax (Solid → Liquid).",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "Which metallic element is dip-coated onto corrugated mild steel sheets to produce galvanized roofing sheets resistant to rust?",
    "options": [
      "Zinc [Zn]",
      "Precious silver [Ag]",
      "Liquid mercury [Hg]",
      "Metallic tin [Sn]"
    ],
    "correctAnswer": "Zinc [Zn]",
    "hint": "Galvanized iron roofing sheets are steel sheets coated with sacrificial zinc.",
    "workedSolution": "Galvanized roofing sheets are made by coating mild steel with a protective layer of zinc (Zn), which acts as a sacrificial barrier against corrosion.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "Following the complete enzymatic digestion of dietary proteins in the human alimentary canal, the absorbable end-products are:",
    "options": [
      "Simple glucose monosaccharides",
      "Free fatty acids",
      "Trihydric glycerol",
      "Amino acids"
    ],
    "correctAnswer": "Amino acids",
    "hint": "Proteases (pepsin, trypsin, peptidases) hydrolyze peptide bonds into these basic units.",
    "workedSolution": "Proteins are hydrolyzed by gastric and pancreatic proteases into individual amino acids, which are absorbed through intestinal villi into the bloodstream.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "In mammalian trophic classification, an African lion (*Panthera leo*) is a typical example of:",
    "options": [
      "A domestic household pet",
      "An obligate carnivore",
      "A generalist omnivore",
      "A grazing herbivore"
    ],
    "correctAnswer": "An obligate carnivore",
    "hint": "Possesses specialized canines and carnassial teeth adapted to feeding on animal flesh.",
    "workedSolution": "Lions feed exclusively on the meat of other animals, possessing morphological adaptations (sharp canines, carnassials, short gut) characteristic of obligate carnivores.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "A homogeneous solid solution or uniform metallic mixture composed of two or more metals melted together is called:",
    "options": [
      "A dissolved solute",
      "An alloy",
      "A chemical colloid",
      "A heterogeneous suspension"
    ],
    "correctAnswer": "An alloy",
    "hint": "Examples include brass (copper + zinc) and bronze (copper + tin).",
    "workedSolution": "An alloy is a solid solution or homogeneous mixture consisting of two or more metals (or a metal and non-metal) combined to enhance strength and corrosion resistance.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "Which traditional Ghanaian agro-processing activity demonstrates the laboratory physical principle of distillation?",
    "options": [
      "Boiling ingredients to prepare groundnut soup",
      "The indigenous distillation of local 'akpeteshie' spirits from fermented palm wine",
      "Tapping fresh sugary sap from oil palm trees",
      "Extracting starch paste from crushed cassava roots"
    ],
    "correctAnswer": "The indigenous distillation of local 'akpeteshie' spirits from fermented palm wine",
    "hint": "Heating fermented palm wine boils off volatile ethanol vapor, which is cooled and condensed.",
    "workedSolution": "Brewing traditional akpeteshie involves heating fermented palm wine to vaporize ethanol (78°C), then condensing the vapor in a cooling pipe, demonstrating distillation.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "The successful artificial incubation and hatching of fertile poultry eggs into chicks requires a continuous, regulated supply of:",
    "options": [
      "Abundant liquid drinking water",
      "Thermal warmth / heat (optimum temperature of ~37.5°C)",
      "Continuous concentrated mash feed",
      "High hydrostatic atmospheric pressure"
    ],
    "correctAnswer": "Thermal warmth / heat (optimum temperature of ~37.5°C)",
    "hint": "The mother hen or incubator supplies warmth and humidity to maintain embryo metabolism.",
    "workedSolution": "Embryonic development inside fertile avian eggs requires constant thermal warmth (≈ 37.5°C or 99.5°F), proper humidity, and periodic egg turning.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "In angiosperm plant reproduction, following successful double fertilization, the fertilized ovule develops directly into:",
    "options": [
      "The enlarged fleshy ovary (fruit)",
      "The elongated floral style",
      "The receptive apical stigma",
      "A mature seed"
    ],
    "correctAnswer": "A mature seed",
    "hint": "The fertilized ovary becomes the fruit; the fertilized ovule becomes the seed.",
    "workedSolution": "Following fertilization in flowering plants, the ovary wall ripens into the fruit, while the fertilized ovule matures into a viable seed enclosing the plant embryo.",
    "points": 1
  }
];

export const SET_BECE_1991_SCIENCE_P2_QUESTIONS: Paper2Question[] = [
  {
    "questionNumber": "1",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) In floral botany, distinguish clearly between self-pollination and cross-pollination.\n(ii) Name two natural agents responsible for cross-pollination in flowering plants.",
        "workedSolution": "(i) Self-pollination vs. Cross-pollination:\n• Self-pollination: The transfer of pollen grains from the anther to the receptive stigma of the same flower, or to another flower on the exact same plant.\n• Cross-pollination: The transfer of pollen grains from the anther of a flower on one plant to the stigma of a flower on a different plant of the same botanical species.\n\n(ii) Agents of cross-pollination:\n1. Insects (e.g., honeybees, butterflies, moths)\n2. Wind (atmospheric air currents)\n*(Alternatives: Birds, bats, running water)*",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "A ray of light strikes the flat surface of an optical plane mirror at an oblique angle. Draw a clear, fully labelled ray diagram showing each of the following:\n(i) The normal line at the point of incidence;\n(ii) The incident light ray;\n(iii) The reflected light ray;\n(iv) The angle of incidence ($i$);\n(v) The angle of reflection ($r$):\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 360 210' width='100%' height='195' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='40' y1='150' x2='320' y2='150' stroke='#38bdf8' stroke-width='3'/><path d='M 45 150 L 35 160 M 75 150 L 65 160 M 105 150 L 95 160 M 135 150 L 125 160 M 165 150 L 155 160 M 195 150 L 185 160 M 225 150 L 215 160 M 255 150 L 245 160 M 285 150 L 275 160 M 315 150 L 305 160' stroke='#64748b' stroke-width='1.5'/><text x='180' y='178' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Plane Mirror Surface</text><line x1='180' y1='30' x2='180' y2='150' stroke='#cbd5e1' stroke-width='1.8' stroke-dasharray='4,4'/><text x='185' y='42' font-size='10' font-weight='bold' fill='#cbd5e1'>Normal (N)</text><circle cx='180' cy='150' r='3.5' fill='#f59e0b'/><text x='180' y='142' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>O</text><line x1='65' y1='55' x2='180' y2='150' stroke='#facc15' stroke-width='2.5'/><polygon points='115,97 125,102 120,109' fill='#facc15'/><text x='70' y='45' font-size='10' font-weight='bold' fill='#facc15'>Incident Ray</text><line x1='180' y1='150' x2='295' y2='55' stroke='#10b981' stroke-width='2.5'/><polygon points='240,109 235,102 245,97' fill='#10b981'/><text x='290' y='45' font-size='10' font-weight='bold' fill='#10b981'>Reflected Ray</text><path d='M 180 110 A 40 40 0 0 0 152 127' fill='none' stroke='#facc15' stroke-width='1.5'/><text x='162' y='105' font-size='11' font-weight='bold' fill='#facc15'>i</text><path d='M 180 110 A 40 40 0 0 1 208 127' fill='none' stroke='#10b981' stroke-width='1.5'/><text x='194' y='105' font-size='11' font-weight='bold' fill='#10b981'>r</text><text x='180' y='198' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LAW OF REFLECTION: ANGLE OF INCIDENCE (i) = ANGLE OF REFLECTION (r)</text></svg></div>",
        "workedSolution": "Ray Diagram Description (refer to vector illustration):\n• A straight horizontal line representing the plane mirror surface with hatching on the back.\n• A dashed line perpendicular to the mirror surface at the point of incidence ($O$) representing the **Normal**.\n• An incoming ray with an arrow pointing toward $O$ representing the **Incident Ray**.\n• An outgoing ray with an arrow pointing away from $O$ representing the **Reflected Ray**.\n• The angle between the incident ray and the normal labelled as the **angle of incidence ($i$)**.\n• The angle between the reflected ray and the normal labelled as the **angle of reflection ($r$)**, where $i = r$.",
        "maxMarks": 6
      },
      {
        "subId": "(c)",
        "prompt": "State two diagnostic characteristics of an optical image formed by a plane mirror.",
        "workedSolution": "1. The image is virtual (formed behind the mirror and cannot be captured on a physical screen).\n2. The image is upright (erect) and laterally inverted (left appears on the right).\n3. The image distance behind the mirror equals the object distance in front of the mirror ($u = v$).\n4. The size of the image is identical to the size of the object (magnification = 1).",
        "maxMarks": 3
      },
      {
        "subId": "(d)",
        "prompt": "Carbon dioxide gas is prepared in a laboratory by pouring dilute hydrochloric acid onto calcium carbonate chips:\n(i) Write a balanced chemical equation for this reaction;\n(ii) Describe the confirmatory chemical test used to identify carbon dioxide gas;\n(iii) State one industrial or everyday domestic use of carbon dioxide gas.",
        "workedSolution": "(i) Balanced chemical equation:\n$$\\text{CaCO}_{3(s)} + 2\\text{HCl}_{(aq)} \\to \\text{CaCl}_{2(aq)} + \\text{H}_2\\text{O}_{(l)} + \\text{CO}_{2(g)}\\uparrow$$\n\n(ii) Confirmatory test for carbon dioxide:\nBubble the evolved gas through clear limewater (aqueous calcium hydroxide solution, $\\text{Ca(OH)}_2$).\n• Observation: The clear limewater turns milky/cloudy due to the formation of an insoluble white precipitate of calcium carbonate:\n$$\\text{Ca(OH)}_{2(aq)} + \\text{CO}_{2(g)} \\to \\text{CaCO}_{3(s)}\\downarrow + \\text{H}_2\\text{O}_{(l)}$$\n\n(iii) Uses of carbon dioxide:\n1. Fire extinguishers (smothers flames by displacing oxygen and does not conduct electricity).\n2. Carbonating soft drinks and effervescent beverages.\n3. As dry ice (solid $\\text{CO}_2$) for refrigerating perishable goods.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "2",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Define each of the following physiological processes, and name one anatomical organ in the human body responsible for each:\n(i) Excretion;\n(ii) Respiration.",
        "workedSolution": "(i) Excretion:\n• Definition: The biological process by which toxic metabolic waste products, excess substances, and non-useful materials produced by cellular reactions are eliminated from the body.\n• Responsible organ: The Kidneys (or Skin / Lungs / Liver).\n\n(ii) Respiration (Cellular Respiration):\n• Definition: The biochemical catabolic breakdown of organic food molecules (glucose) within living cells to release usable energy in the form of ATP.\n• Responsible organ / structure: The Lungs (for external gas exchange) and Mitochondria in all metabolizing tissue cells.",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "Mention three public health precautions that should be strictly enforced to protect people from infection during an epidemic outbreak of cholera in a community.",
        "workedSolution": "1. Drinking only boiled or chemically chlorinated potable water.\n2. Washing hands thoroughly with soap under clean running water before preparing food, before eating, and after using the toilet.\n3. Eating only freshly cooked, hot food and keeping food covered to exclude houseflies.\n4. Ensuring safe and sanitary disposal of human fecal waste and avoiding open defecation.",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "Write down the systematic chemical names of each of the following inorganic compounds:\n(i) $\\text{MgCl}_2$;\n(ii) $\\text{FeS}$;\n(iii) $\\text{CuSO}_4$;\n(iv) $\\text{NH}_4\\text{OH}$.",
        "workedSolution": "Systematic chemical names:\n• (i) $\\text{MgCl}_2$: Magnesium chloride\n• (ii) $\\text{FeS}$: Iron (II) sulfide\n• (iii) $\\text{CuSO}_4$: Copper (II) sulfate\n• (iv) $\\text{NH}_4\\text{OH}$: Ammonium hydroxide",
        "maxMarks": 4
      },
      {
        "subId": "(d)",
        "prompt": "List the names of the eight major planets of our Solar System in sequential order of their distances away from the central Sun, starting with the planet nearest to it.",
        "workedSolution": "Sequential order of planets from the Sun:\n1. **Mercury** (nearest)\n2. **Venus**\n3. **Earth**\n4. **Mars**\n5. **Jupiter**\n6. **Saturn**\n7. **Uranus**\n8. **Neptune** (farthest)\n*(Mnemonic: My Very Educated Mother Just Served Us Noodles)*.",
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
        "prompt": "(i) What is a chemical solution in chemistry?\n(ii) Write down balanced chemical equations for the preparation of:\n  (α) Sodium chloride (prepared from sodium hydroxide and dilute hydrochloric acid);\n  (β) Ammonia gas (synthesized from nitrogen gas and hydrogen gas).",
        "workedSolution": "(i) Definition of solution:\nA homogeneous physical mixture composed of a solute dissolved uniformly at the molecular level within a solvent medium.\n\n(ii) Balanced chemical equations:\n• (α) Sodium chloride preparation:\n$$\\text{NaOH}_{(aq)} + \\text{HCl}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)}$$\n• (β) Ammonia synthesis (Haber Process):\n$$\\text{N}_{2(g)} + 3\\text{H}_{2(g)} \\rightleftharpoons 2\\text{NH}_{3(g)}$$",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "Classify each of the following human bodily actions as either a Voluntary action or an Involuntary (reflex) action:\n(i) Laughing at a funny joke;\n(ii) Blinking of the eyes when an object approaches;\n(iii) Sneezing when dust irritates the nasal lining;\n(iv) Eating a bowl of rice.",
        "workedSolution": "Classification:\n• (i) Laughing: **Voluntary action** (under conscious mental control)\n• (ii) Blinking of the eyes: **Involuntary action** (protective reflex)\n• (iii) Sneezing: **Involuntary action** (autonomic respiratory reflex)\n• (iv) Eating: **Voluntary action** (initiated consciously)",
        "maxMarks": 4
      },
      {
        "subId": "(c)",
        "prompt": "(i) State four fundamental biological characteristics common to all living things.\n(ii) Write down one major physiological function performed by:\n  (α) Plant leaves;\n  (β) Plant roots.",
        "workedSolution": "(i) Characteristics of living things:\n1. Nutrition / Feeding\n2. Respiration\n3. Excretion of metabolic wastes\n4. Growth and development\n5. Reproduction\n6. Irritability / Sensitivity\n\n(ii) Plant organ functions:\n• (α) Leaves: Manufacture food carbohydrates via photosynthesis and regulate water loss via transpiration.\n• (β) Roots: Firmly anchor the plant in the soil and absorb capillary water and dissolved mineral nutrients.",
        "maxMarks": 6
      },
      {
        "subId": "(d)",
        "prompt": "(i) Mention two common refractive visual defects of the human eye.\n(ii) State the specific type of corrective spectacle optical lens used to correct each defect named in (d)(i).",
        "workedSolution": "(i) Defects:\n1. Short-sightedness (Myopia)\n2. Long-sightedness (Hypermetropia)\n\n(ii) Corrective lenses:\n• Myopia (Short-sightedness): Corrected using a **concave (diverging) lens**, which diverges light rays outward so they focus on the retina.\n• Hypermetropia (Long-sightedness): Corrected using a **convex (converging) lens**, which converges incoming rays inward to bring the focal point forward onto the retina.",
        "maxMarks": 4
      }
    ]
  },
  {
    "questionNumber": "4",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) Name the atmospheric gas that is chemically consumed during both the rusting of iron and the combustion of fuels.\n(ii) State two practical everyday methods used to prevent iron tools and structures from rusting.",
        "workedSolution": "(i) Gas consumed:\nDiatomic oxygen gas [$\\text{O}_2$].\n\n(ii) Methods to prevent rusting:\n1. Applying a surface coating of oil or grease to cut off oxygen and moisture.\n2. Painting metallic iron surfaces with protective anti-rust enamel paint.\n3. Galvanization (coating iron with a sacrificial layer of metallic zinc).\n4. Electroplating with non-corrosive metals like chromium, nickel, or tin.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "Classify each of the following chemical substances as an Element, a Compound, a Mixture, or a Colloid:\n(i) Sodium chloride;\n(ii) Aqueous sugar solution;\n(iii) Atmospheric fog;\n(iv) Pure hydrogen gas;\n(v) Solid sulfur powder.",
        "workedSolution": "Classification:\n• (i) Sodium chloride ($\\text{NaCl}$): **Compound**\n• (ii) Sugar solution: **Mixture** (homogeneous solution)\n• (iii) Atmospheric fog: **Colloid** (liquid water droplets dispersed in air)\n• (iv) Hydrogen gas ($\\text{H}_2$): **Element**\n• (v) Solid sulfur ($\\text{S}_8$): **Element**",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "(i) Construct a valid ecological grazing food chain using any three of the following organisms:\n**Man, Hawk, Green grass, Domestic goat, Field grasshopper.**\n(ii) Name two infectious childhood diseases that can be effectively controlled through routine vaccination (immunization).",
        "workedSolution": "(i) Food chain (any valid 3-step sequence):\n$$\\text{Green grass (Producer)} \\to \\text{Domestic goat (Primary Consumer)} \\to \\text{Man (Secondary Consumer)}$$\n*OR:*\n$$\\text{Green grass (Producer)} \\to \\text{Field grasshopper (Primary Consumer)} \\to \\text{Hawk (Secondary Consumer)}$$\n\n(ii) Vaccine-preventable diseases:\n1. Measles\n2. Poliomyelitis (Polio)\n3. Tetanus (or Diphtheria / Pertussis / Tuberculosis)",
        "maxMarks": 5
      },
      {
        "subId": "(d)",
        "prompt": "(i) A boy throws a stone vertically upward into the air. State the sequence of mechanical energy transformations that take place as the stone falls from its maximum height to the ground.\n(ii) Give two common domestic or industrial appliances that utilize electromagnets in their operation.\n(iii) State two physical methods by which a permanent steel magnet can be demagnetized.",
        "workedSolution": "(i) Energy transformations as stone falls:\nAt maximum height, the stone stores **Gravitational Potential Energy**. As it accelerates downward, potential energy converts into **Mechanical Kinetic Energy**. Upon striking the ground, kinetic energy converts into **Thermal Heat Energy** and **Acoustic Sound Energy**.\n\n(ii) Appliances using electromagnets:\n1. Electric chime bells / buzzers\n2. Telephone earpieces and moving-coil loudspeakers\n3. Electric motor starters and electromagnetic relays\n\n(iii) Methods of demagnetization:\n1. Heating the magnet to red-hot temperature (Curie point).\n2. Hammering the magnet vigorously while aligned in an East-West direction.\n3. Placing the magnet inside a solenoid carrying alternating current (AC) and slowly withdrawing it.",
        "maxMarks": 5
      }
    ]
  }
];

export const SET_BECE_1991_SCIENCE_P1 = {
  id: "paper_1991_variant_p1",
  year: 1991,
  setNumber: 123,
  paperType: 1,
  subject: "Integrated Science",
  title: "1991 BECE Integrated Science Paper 1 (Objective Test)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: SET_BECE_1991_SCIENCE_P1_QUESTIONS
};

export const SET_BECE_1991_SCIENCE_P2 = {
  id: "paper_1991_variant_p2",
  year: 1991,
  setNumber: 123,
  paperType: 2,
  subject: "Integrated Science",
  title: "1991 BECE Integrated Science Paper 2 (Theory & Practical Essay)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 75,
  instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 4,
  questions: SET_BECE_1991_SCIENCE_P2_QUESTIONS
};

export const SET_BECE_1991_SCIENCE_COMPLETE = {
  year: 1991,
  isVariant: true,
  setNumber: 123,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: SET_BECE_1991_SCIENCE_P1,
  paper2: SET_BECE_1991_SCIENCE_P2,
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 1,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
