/**
 * WAEC BECE Integrated Science
 * Paper 1: Objective Examination (Set 80 Variant - 2017)
 *
 * Structure:
 * - 40 Multiple-choice Questions
 * - Balanced answer distribution: 10 A, 10 B, 10 C, 10 D
 * Total Marks: 40 | Time Allowed: 45 minutes
 *
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
 */

import { CurriculumQuestionSet } from '../global-curriculum-types';

export const SET_BECE_2017_SCIENCE_P1: CurriculumQuestionSet = {
  id: "paper_2017_variant",
  title: "2017 BECE Integrated Science Examination (Set 80)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2017 BECE Integrated Science Standardized CBT",
  variantType: "past_paper_variant",
  year: 2017,
  paperType: 1,
  setNumber: 80,
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
    "prompt": "Which of the following meteorological instruments is specifically designed for measuring the relative humidity of the atmosphere?",
    "options": [
      "Hydrometer",
      "Mercury barometer",
      "Hygrometer (Wet-and-Dry bulb psychrometer)",
      "Cup anemometer"
    ],
    "correctAnswer": "Hygrometer (Wet-and-Dry bulb psychrometer)",
    "hint": "A hydrometer measures liquid density, while this instrument measures moisture content in air.",
    "workedSolution": "A hygrometer (such as a wet-and-dry bulb hygrometer) measures the relative humidity of ambient air, while a hydrometer measures the relative density of liquids.",
    "points": 1
  },
  {
    "id": "q02",
    "number": 2,
    "title": "Question 2",
    "format": "multiple_choice",
    "prompt": "In the International System of Units (S.I.), what is the correct metric derived unit for physical density?",
    "options": [
      "kg m⁻³ (kilogram per cubic metre)",
      "m s⁻¹",
      "m s⁻²",
      "m³ kg⁻¹"
    ],
    "correctAnswer": "kg m⁻³ (kilogram per cubic metre)",
    "hint": "$$\\text{Density} = \\frac{\\text{Mass}}{\\text{Volume}} = \\frac{\\text{kg}}{\\text{m}^3}$$.",
    "workedSolution": "Density is defined as mass per unit volume ($\\rho = \\frac{m}{V}$). The S.I. unit of mass is $\\text{kg}$ and volume is $\\text{m}^3$, yielding $\\text{kg m}^{-3}$.",
    "points": 1
  },
  {
    "id": "q03",
    "number": 3,
    "title": "Question 3",
    "format": "multiple_choice",
    "prompt": "When a ray of light passes obliquely from an optically dense glass prism into surrounding ambient air, what happens to its wave propagation speed?",
    "options": [
      "The speed of the light decreases",
      "The speed of the light increases",
      "The speed remains strictly unchanged",
      "The speed drops to zero immediately"
    ],
    "correctAnswer": "The speed of the light increases",
    "hint": "Light travels faster in less dense media like air than in dense solids like glass.",
    "workedSolution": "Air has a lower optical refractive index ($n \\approx 1.00$) than glass ($n \\approx 1.52$). As light leaves glass into air, its phase velocity increases, causing it to bend away from the normal.",
    "points": 1
  },
  {
    "id": "q04",
    "number": 4,
    "title": "Question 4",
    "format": "multiple_choice",
    "prompt": "When an unmagnetized soft iron nail is placed near the pole of a powerful permanent magnet without direct physical contact, it becomes temporarily magnetized by:",
    "options": [
      "Mechanical stroking",
      "Magnetic induction",
      "Thermal convection",
      "Electrostatic conduction"
    ],
    "correctAnswer": "Magnetic induction",
    "hint": "Magnetization caused by the presence of an external magnetic field without touching.",
    "workedSolution": "Magnetic induction is the process whereby a magnetic material becomes temporarily magnetized when placed within an external magnetic field without physical contact.",
    "points": 1
  },
  {
    "id": "q05",
    "number": 5,
    "title": "Question 5",
    "format": "multiple_choice",
    "prompt": "In an electrical circuit, what is the primary operational function of a rheostat (variable resistor)?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 140' width='100%' height='130' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='30' y1='70' x2='90' y2='70' stroke='#38bdf8' stroke-width='2'/><rect x='90' y='58' width='120' height='24' rx='3' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><line x1='210' y1='70' x2='310' y2='70' stroke='#38bdf8' stroke-width='2'/><line x1='150' y1='20' x2='150' y2='54' stroke='#10b981' stroke-width='2.5'/><polygon points='145,52 150,60 155,52' fill='#10b981'/><circle cx='30' cy='70' r='3.5' fill='#38bdf8'/><circle cx='310' cy='70' r='3.5' fill='#38bdf8'/><text x='150' y='16' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>Sliding Wiper</text><text x='150' y='75' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Resistive Element</text><text x='170' y='115' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>RHEOSTAT (VARIABLE RESISTOR)</text></svg></div>",
    "options": [
      "To keep the electric current strictly constant at all times",
      "To convert direct current into high-frequency alternating current",
      "To step down supply voltage without dissipating any energy",
      "To increase or decrease electric current in the circuit by altering resistance"
    ],
    "correctAnswer": "To increase or decrease electric current in the circuit by altering resistance",
    "hint": "Moving the sliding contact alters the effective wire length and resistance, modulating current flow.",
    "workedSolution": "A rheostat provides an adjustable resistance in an electric circuit, enabling manual regulation (increasing or decreasing) of current flow according to Ohm's Law ($I = \\frac{V}{R}$).",
    "points": 1
  },
  {
    "id": "q06",
    "number": 6,
    "title": "Question 6",
    "format": "multiple_choice",
    "prompt": "Which of the following physical characteristics correctly describes the optical behavior of an opaque body?",
    "options": [
      "It allows all incident light to transmit through it without absorption",
      "It scatters light partially so that objects behind it appear blurry",
      "It prevents light from passing through it, thereby casting a shadow behind it",
      "It cannot form a shadow under any lighting condition"
    ],
    "correctAnswer": "It prevents light from passing through it, thereby casting a shadow behind it",
    "hint": "Opaque materials completely occlude light rays traveling in straight lines.",
    "workedSolution": "An opaque object does not transmit light rays. Because light propagates rectilinearly, an unilluminated dark region (shadow) is cast behind the obstacle.",
    "points": 1
  },
  {
    "id": "q07",
    "number": 7,
    "title": "Question 7",
    "format": "multiple_choice",
    "prompt": "According to the kinetic theory of matter, which statement accurately describes the arrangement of particles in a solid?",
    "options": [
      "Particles are closely packed in fixed lattice positions and vibrate about mean points",
      "Particles move randomly at high speeds over large distances",
      "Particles slide freely past one another with no fixed shape",
      "Particles have negligible intermolecular attractive forces"
    ],
    "correctAnswer": "Particles are closely packed in fixed lattice positions and vibrate about mean points",
    "hint": "Solids possess a definite shape and volume due to strong intermolecular forces.",
    "workedSolution": "In solids, strong cohesive forces lock particles into fixed, closely packed arrangements, restricting their motion to localized vibrations.",
    "points": 1
  },
  {
    "id": "q08",
    "number": 8,
    "title": "Question 8",
    "format": "multiple_choice",
    "prompt": "Which electrical measuring instrument is connected in series in an electric circuit to determine the rate of flow of electric charge?",
    "options": [
      "An ammeter",
      "A voltmeter",
      "A photometer",
      "A galvanometer in parallel"
    ],
    "correctAnswer": "An ammeter",
    "hint": "Measures current in Amperes and has very low internal resistance.",
    "workedSolution": "An ammeter measures electric current in amperes (A) and is connected in series so that the entire branch current passes through it.",
    "points": 1
  },
  {
    "id": "q09",
    "number": 9,
    "title": "Question 9",
    "format": "multiple_choice",
    "prompt": "A clear swimming pool appears noticeably shallower than its actual geometric depth when viewed from above. Which optical property accounts for this?",
    "options": [
      "Regular reflection from the tiled bottom",
      "Dispersion of light into rainbow hues",
      "Refraction of light rays emerging from water into air",
      "Diffraction of light around pool steps"
    ],
    "correctAnswer": "Refraction of light rays emerging from water into air",
    "hint": "Light bends away from the normal when speeding up as it exits into air.",
    "workedSolution": "Light rays reflecting from the bottom of the pool refract away from the normal as they exit the water-air interface into the viewer's eye, creating a virtual image elevated above the true floor.",
    "points": 1
  },
  {
    "id": "q10",
    "number": 10,
    "title": "Question 10",
    "format": "multiple_choice",
    "prompt": "Which of the following sources of energy is finite and classified as non-renewable?",
    "options": [
      "Solar radiation",
      "Tidal wave energy",
      "Petroleum crude oil",
      "Atmospheric wind power"
    ],
    "correctAnswer": "Petroleum crude oil",
    "hint": "Fossil hydrocarbons take millions of years to form and deplete with consumption.",
    "workedSolution": "Petroleum is a fossil fuel formed over millions of geological years from buried organic matter; it cannot be replenished at the rate it is consumed.",
    "points": 1
  },
  {
    "id": "q11",
    "number": 11,
    "title": "Question 11",
    "format": "multiple_choice",
    "prompt": "Which of the following pieces of laboratory apparatus is NOT utilized in the standard setup for simple distillation?",
    "options": [
      "A Liebig condenser",
      "A round-bottom flask",
      "An open evaporating dish",
      "A Bunsen burner"
    ],
    "correctAnswer": "An open evaporating dish",
    "hint": "Distillation requires an enclosed system to catch and condense vapor rather than an open basin.",
    "workedSolution": "Simple distillation uses an enclosed distillation flask, a thermometer, a Liebig condenser, and a receiving flask. Open evaporating dishes are used for simple open-air evaporation.",
    "points": 1
  },
  {
    "id": "q12",
    "number": 12,
    "title": "Question 12",
    "format": "multiple_choice",
    "prompt": "How many total oxygen atoms are chemically bonded within three individual molecules of carbon dioxide ($3\\text{CO}_2$)?",
    "options": [
      "3 oxygen atoms",
      "6 oxygen atoms",
      "4 oxygen atoms",
      "5 oxygen atoms"
    ],
    "correctAnswer": "6 oxygen atoms",
    "hint": "Multiply the coefficient by the subscript: $3 \\times 2$.",
    "workedSolution": "Each $\\text{CO}_2$ molecule contains 2 oxygen atoms. Therefore, 3 molecules contain $3 \\times 2 = 6\\text{ oxygen atoms}$.",
    "points": 1
  },
  {
    "id": "q13",
    "number": 13,
    "title": "Question 13",
    "format": "multiple_choice",
    "prompt": "The chemical molecular formula $\\text{Cl}_2$ represents:",
    "options": [
      "One diatomic molecule consisting of two chlorine atoms",
      "Two separate unbonded chlorine atoms",
      "Two chloride anions carrying a -1 charge",
      "A mixture of chlorine and hydrogen gas"
    ],
    "correctAnswer": "One diatomic molecule consisting of two chlorine atoms",
    "hint": "Subscript 2 indicates atomicity within a single molecule.",
    "workedSolution": "$\\text{Cl}_2$ denotes a single diatomic molecule formed by two chlorine atoms sharing a pair of electrons in a single covalent bond.",
    "points": 1
  },
  {
    "id": "q14",
    "number": 14,
    "title": "Question 14",
    "format": "multiple_choice",
    "prompt": "Which of the following metallic substances is prone to destructive atmospheric corrosion known as rusting?",
    "options": [
      "Carbon steel",
      "Pure copper wire",
      "Solid aluminum sheet",
      "Unrefined bauxite ore"
    ],
    "correctAnswer": "Carbon steel",
    "hint": "Rusting specifically applies to iron and its ferrous alloys.",
    "workedSolution": "Rusting is the specific electrochemical oxidation of iron and iron alloys (such as steel) in the presence of oxygen and water to form hydrated iron (III) oxide.",
    "points": 1
  },
  {
    "id": "q15",
    "number": 15,
    "title": "Question 15",
    "format": "multiple_choice",
    "prompt": "In what form is biochemical potential energy stored within dietary food substances like starches, fats, and proteins?",
    "options": [
      "Nuclear binding energy",
      "Chemical potential energy",
      "Thermal radiant energy",
      "Mechanical kinetic energy"
    ],
    "correctAnswer": "Chemical potential energy",
    "hint": "Stored within the covalent chemical bonds connecting atoms.",
    "workedSolution": "Food stores energy in the chemical bonds between carbon, hydrogen, oxygen, and nitrogen atoms, which is liberated during cellular respiration.",
    "points": 1
  },
  {
    "id": "q16",
    "number": 16,
    "title": "Question 16",
    "format": "multiple_choice",
    "prompt": "Which of the following everyday laboratory substances is classified as a homogeneous mixture rather than a pure chemical compound?",
    "options": [
      "Pure distilled water [H₂O]",
      "Dry sodium chloride crystals [NaCl]",
      "Iron filings [Fe]",
      "Sodium chloride aqueous solution (Brine)"
    ],
    "correctAnswer": "Sodium chloride aqueous solution (Brine)",
    "hint": "A uniform single-phase solution of a dissolved solute in a solvent.",
    "workedSolution": "Sodium chloride solution is a homogeneous physical mixture of solute ($\\text{NaCl}$) dissolved uniformly throughout the solvent ($\\text{H}_2\\text{O}$); its constituents can be separated by physical evaporation.",
    "points": 1
  },
  {
    "id": "q17",
    "number": 17,
    "title": "Question 17",
    "format": "multiple_choice",
    "prompt": "In the International System of Units (S.I.), what is the fundamental base unit for quantifying the amount of a chemical substance?",
    "options": [
      "The mole [mol]",
      "The candela [cd]",
      "The Kelvin [K]",
      "The gram [g]"
    ],
    "correctAnswer": "The mole [mol]",
    "hint": "Contains exactly $6.022 \\times 10^{23}$ elementary entities (Avogadro's number).",
    "workedSolution": "The mole (symbol: $\\text{mol}$) is the S.I. base unit for the amount of substance, containing Avogadro's number of elementary entities.",
    "points": 1
  },
  {
    "id": "q18",
    "number": 18,
    "title": "Question 18",
    "format": "multiple_choice",
    "prompt": "An atom of chlorine has a proton number of 17 and a neutron number of 18. How many electrons reside in its outermost (third) energy shell?<br/><div class=\"my-4 flex justify-center\"><svg viewBox='0 0 320 200' width='100%' height='175' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><circle cx='160' cy='100' r='18' fill='#ef4444' stroke='#b91c1c' stroke-width='2'/><text x='160' y='104' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>17p, 18n</text><circle cx='160' cy='100' r='36' fill='none' stroke='#64748b' stroke-width='1.2' stroke-dasharray='3,2'/><circle cx='160' cy='64' r='3' fill='#38bdf8'/><circle cx='160' cy='136' r='3' fill='#38bdf8'/><circle cx='160' cy='100' r='58' fill='none' stroke='#64748b' stroke-width='1.2' stroke-dasharray='3,2'/><circle cx='160' cy='42' r='3' fill='#38bdf8'/><circle cx='160' cy='158' r='3' fill='#38bdf8'/><circle cx='102' cy='100' r='3' fill='#38bdf8'/><circle cx='218' cy='100' r='3' fill='#38bdf8'/><circle cx='119' cy='59' r='3' fill='#38bdf8'/><circle cx='201' cy='141' r='3' fill='#38bdf8'/><circle cx='119' cy='141' r='3' fill='#38bdf8'/><circle cx='201' cy='59' r='3' fill='#38bdf8'/><circle cx='160' cy='100' r='80' fill='none' stroke='#f59e0b' stroke-width='1.5'/><circle cx='160' cy='20' r='3.5' fill='#f59e0b'/><circle cx='160' cy='180' r='3.5' fill='#f59e0b'/><circle cx='80' cy='100' r='3.5' fill='#f59e0b'/><circle cx='240' cy='100' r='3.5' fill='#f59e0b'/><circle cx='104' cy='44' r='3.5' fill='#f59e0b'/><circle cx='216' cy='156' r='3.5' fill='#f59e0b'/><circle cx='104' cy='156' r='3.5' fill='#f59e0b'/><text x='160' y='196' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>3rd Shell contains 7 electrons (2, 8, 7)</text></svg></div>",
    "options": [
      "1 electron",
      "3 electrons",
      "5 electrons",
      "7 electrons"
    ],
    "correctAnswer": "7 electrons",
    "hint": "Distribute 17 electrons across Bohr shells: 2 in the first, 8 in the second.",
    "workedSolution": "For 17 electrons, the configuration is $2, 8, 7$. The first shell holds 2, the second holds 8, leaving 7 valence electrons in the third shell.",
    "points": 1
  },
  {
    "id": "q19",
    "number": 19,
    "title": "Question 19",
    "format": "multiple_choice",
    "prompt": "Which of the following mixtures can be separated effectively using the laboratory technique of gravity filtration?",
    "options": [
      "A solution of refined sugar in water",
      "An emulsion of vegetable oil in water",
      "A mixture of commercial ink dyes",
      "A suspension of insoluble sand in water"
    ],
    "correctAnswer": "A suspension of insoluble sand in water",
    "hint": "Filtration separates coarse insoluble solid residues from liquid solvents.",
    "workedSolution": "Sand is insoluble in water and forms macroscopic particles that cannot pass through the pores of filter paper, yielding clear water as the filtrate.",
    "points": 1
  },
  {
    "id": "q20",
    "number": 20,
    "title": "Question 20",
    "format": "multiple_choice",
    "prompt": "Which of the following household solutions turns blue litmus paper into red?",
    "options": [
      "Aqueous ammonia solution",
      "Sodium bicarbonate solution",
      "Dilute ethanoic acid (Vinegar)",
      "Pure distilled water"
    ],
    "correctAnswer": "Dilute ethanoic acid (Vinegar)",
    "hint": "Acids turn blue litmus red, whereas alkalis turn red litmus blue.",
    "workedSolution": "Vinegar contains dilute ethanoic acid ($pH \\approx 2.5$). Acidic solutions release hydrogen ions that turn blue litmus paper red.",
    "points": 1
  },
  {
    "id": "q21",
    "number": 21,
    "title": "Question 21",
    "format": "multiple_choice",
    "prompt": "According to the modern atomic theory of physical science, which fundamental particles constitute matter?",
    "options": [
      "Atoms only",
      "Atoms, molecules, and ions",
      "Molecules only",
      "Ions only"
    ],
    "correctAnswer": "Atoms, molecules, and ions",
    "hint": "Matter can be composed of single atoms, bonded molecules, or charged ions.",
    "workedSolution": "Matter is physically composed of discrete particulate entities: neutral atoms (e.g., noble gases), covalently bonded molecules (e.g., $H_2O$), or charged ionic lattices (e.g., $NaCl$).",
    "points": 1
  },
  {
    "id": "q22",
    "number": 22,
    "title": "Question 22",
    "format": "multiple_choice",
    "prompt": "Which of the following human characteristics is genetically inheritable and transmitted directly from biological parents to offspring?",
    "options": [
      "The anatomical shape of the nose and facial profile",
      "Fluency in speaking foreign languages",
      "Handwriting style and cursive technique",
      "Knowledge of computer programming"
    ],
    "correctAnswer": "The anatomical shape of the nose and facial profile",
    "hint": "Physical morphological traits are encoded in DNA, whereas skills are learned through environmental exposure.",
    "workedSolution": "Nose shape, facial architecture, blood group, and eye color are genetic traits governed by inherited alleles, while handwriting and languages are acquired traits.",
    "points": 1
  },
  {
    "id": "q23",
    "number": 23,
    "title": "Question 23",
    "format": "multiple_choice",
    "prompt": "Which of the following statements correctly summarizes the biochemical process of aerobic cellular respiration?",
    "options": [
      "It produces ethanol and carbon dioxide in the absence of oxygen",
      "It yields only a very small amount of energy compared to fermentation",
      "It consumes water and liberates pure hydrogen gas into the blood",
      "It requires oxygen gas and generates carbon (IV) oxide, water, and ATP energy"
    ],
    "correctAnswer": "It requires oxygen gas and generates carbon (IV) oxide, water, and ATP energy",
    "hint": "$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\to 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{ATP}$.",
    "workedSolution": "Aerobic respiration oxidizes glucose using molecular oxygen within mitochondria, producing carbon dioxide and water as waste products alongside large amounts of ATP.",
    "points": 1
  },
  {
    "id": "q24",
    "number": 24,
    "title": "Question 24",
    "format": "multiple_choice",
    "prompt": "In the male mammalian reproductive system, where are spermatozoa temporarily stored while undergoing physiological maturation and acquiring motility?",
    "options": [
      "The prostate gland",
      "The seminal vesicles",
      "The vas deferens",
      "The epididymis"
    ],
    "correctAnswer": "The epididymis",
    "hint": "A tightly coiled duct attached to the posterior border of each testis.",
    "workedSolution": "Sperm cells generated in the seminiferous tubules migrate to the epididymis, where they are stored, mature, and gain swimming motility prior to ejaculation.",
    "points": 1
  },
  {
    "id": "q25",
    "number": 25,
    "title": "Question 25",
    "format": "multiple_choice",
    "prompt": "Which of the following physiological and anatomical changes is a natural manifestation of senescence (old age) in humans?",
    "options": [
      "Rapid elevation of baseline mental reflex speed",
      "Loss of hair pigmentation leading to graying hair and thinning of skin",
      "Broadening of the thoracic shoulder girdle",
      "Enlargement of primary reproductive organs"
    ],
    "correctAnswer": "Loss of hair pigmentation leading to graying hair and thinning of skin",
    "hint": "Aging involves a decline in melanin production in hair follicles and loss of dermal collagen.",
    "workedSolution": "Aging is characterized by reduced cellular division, loss of melanin synthesis in hair follicles (graying), decrease in skin elasticity, and reduced bone mineral density.",
    "points": 1
  },
  {
    "id": "q26",
    "number": 26,
    "title": "Question 26",
    "format": "multiple_choice",
    "prompt": "Which floral adaptation is characteristic of anemophilous (wind-pollinated) flowers such as maize and guinea corn?",
    "options": [
      "Having large, brightly colored, conspicuous petals",
      "Secreting sweet, scented nectar from deep glands",
      "Producing heavy, sticky, spiny pollen grains",
      "Possessing large, feathery stigmas exposed outside the flower to capture airborne pollen"
    ],
    "correctAnswer": "Possessing large, feathery stigmas exposed outside the flower to capture airborne pollen",
    "hint": "Wind pollination requires net-like feathery surfaces to trap floating pollen grains.",
    "workedSolution": "Wind-pollinated flowers lack scented petals and nectar; instead, they have dangling stamens and feathery branched stigmas with large surface areas to trap airborne pollen.",
    "points": 1
  },
  {
    "id": "q27",
    "number": 27,
    "title": "Question 27",
    "format": "multiple_choice",
    "prompt": "Why are mammalian testes anatomically suspended outside the main abdominal cavity inside the scrotum?",
    "options": [
      "The testes must absorb humidity directly from the atmosphere",
      "Spermatogenesis requires an optimal temperature 2°C to 3°C cooler than core body temperature",
      "The abdominal cavity lacks room for testicular enlargement",
      "Internal body pressure prevents the secretion of testosterone"
    ],
    "correctAnswer": "Spermatogenesis requires an optimal temperature 2°C to 3°C cooler than core body temperature",
    "hint": "Normal core body temperature (37°C) degrades developing sperm cells.",
    "workedSolution": "Viable sperm production (spermatogenesis) is inhibited at core body temperature (37°C). The scrotal sac maintains the testes at 34–35°C for optimal sperm production.",
    "points": 1
  },
  {
    "id": "q28",
    "number": 28,
    "title": "Question 28",
    "format": "multiple_choice",
    "prompt": "Which sub-cellular organelle typically occupies up to 90% of the interior volume of a mature eukaryotic plant cell?",
    "options": [
      "The chloroplast",
      "The mitochondrion",
      "The large central vacuole",
      "The nucleus"
    ],
    "correctAnswer": "The large central vacuole",
    "hint": "Filled with aqueous cell sap and enclosed by the tonoplast membrane.",
    "workedSolution": "In mature plant cells, the large central permanent vacuole filled with cell sap occupies the majority of the intracellular volume, maintaining cellular turgidity.",
    "points": 1
  },
  {
    "id": "q29",
    "number": 29,
    "title": "Question 29",
    "format": "multiple_choice",
    "prompt": "During the mechanics of pulmonary ventilation in humans, the upward and outward movement of the ribcage is powered by:",
    "options": [
      "Contraction of the external intercostal muscles",
      "Expansion of the fluid-filled pleural cavity",
      "Involuntary peristalsis of the tracheal rings",
      "Vibration of the laryngeal vocal folds"
    ],
    "correctAnswer": "Contraction of the external intercostal muscles",
    "hint": "Muscles spanning the ribs pull them upward during inhalation.",
    "workedSolution": "Inhalation involves contraction of the external intercostal muscles (raising the ribs up and out) and the diaphragm (moving down), expanding the thoracic cavity volume.",
    "points": 1
  },
  {
    "id": "q30",
    "number": 30,
    "title": "Question 30",
    "format": "multiple_choice",
    "prompt": "In the human female reproductive tract, where does fertilization of the ovum by a spermatozoon normally take place?",
    "options": [
      "The endometrial uterine lining",
      "The ovarian follicle",
      "The cervical canal",
      "The fallopian tube (Oviduct)"
    ],
    "correctAnswer": "The fallopian tube (Oviduct)",
    "hint": "The egg is fertilized midway along the tube connecting the ovary to the womb.",
    "workedSolution": "Fertilization normally occurs in the ampulla of the fallopian tube (oviduct). The resulting zygote then divides and travels to the uterus for implantation.",
    "points": 1
  },
  {
    "id": "q31",
    "number": 31,
    "title": "Question 31",
    "format": "multiple_choice",
    "prompt": "Which of the following biological processes represents an example of osmosis occurring in nature?",
    "options": [
      "The spreading of perfume fragrance throughout a closed room",
      "The diffusion of dissolved glucose across intestinal villi",
      "The absorption of soil water across root hair cell membranes into the vascular cylinder",
      "The dissolution of purple potassium permanganate crystals in water"
    ],
    "correctAnswer": "The absorption of soil water across root hair cell membranes into the vascular cylinder",
    "hint": "Osmosis specifically involves water moving across a selectively permeable membrane.",
    "workedSolution": "Osmosis is the net movement of water molecules from a high water potential to a lower water potential across a selectively permeable membrane, as seen in root hair water uptake.",
    "points": 1
  },
  {
    "id": "q32",
    "number": 32,
    "title": "Question 32",
    "format": "multiple_choice",
    "prompt": "Which component of a living biological cell is selectively (semi-) permeable, regulating the passage of materials into and out of the cytoplasm?",
    "options": [
      "The aqueous cytoplasm",
      "The plasma cell membrane",
      "The rigid outer cellulose cell wall",
      "The nucleoplasm"
    ],
    "correctAnswer": "The plasma cell membrane",
    "hint": "A phospholipid bilayer with embedded protein transport channels.",
    "workedSolution": "The plasma membrane is selectively permeable, regulating the passage of ions and organic molecules into and out of the cell via diffusion, osmosis, and active transport.",
    "points": 1
  },
  {
    "id": "q33",
    "number": 33,
    "title": "Question 33",
    "format": "multiple_choice",
    "prompt": "Why is a scientific study of the soil profile of a parcel of farmland valuable to a crop farmer?",
    "options": [
      "It reveals topsoil fertility, root penetration depth, and subsoil water-holding capacity",
      "It determines the appropriate retail price of harvest commodities",
      "It eliminates the need for applying fertilizers or organic manure",
      "It prevents insect pests from ovipositing on crop stems"
    ],
    "correctAnswer": "It reveals topsoil fertility, root penetration depth, and subsoil water-holding capacity",
    "hint": "A vertical cross-section displaying horizons A, B, and C informs crop root suitability.",
    "workedSolution": "A soil profile exposes horizons from topsoil to bedrock, showing organic matter depth, pan layers, and drainage capacity to guide crop selection.",
    "points": 1
  },
  {
    "id": "q34",
    "number": 34,
    "title": "Question 34",
    "format": "multiple_choice",
    "prompt": "Which of the following agricultural practices VIOLATES the fundamental scientific principles of sustainable crop rotation?",
    "options": [
      "Including nitrogen-fixing leguminous crops within the rotation cycle",
      "Planting botanically closely related crop species sequentially on the same plot",
      "Alternating deep-rooted crops with shallow-rooted crops",
      "Allowing periodic resting or cover crop fallow intervals between plantings"
    ],
    "correctAnswer": "Planting botanically closely related crop species sequentially on the same plot",
    "hint": "Crops from the same botanical family share the same pests and extract identical nutrient ratios.",
    "workedSolution": "Closely related crops (e.g., tomato followed by pepper, both Solanaceae) should not follow each other because they share the same pests, diseases, and nutrient demands.",
    "points": 1
  },
  {
    "id": "q35",
    "number": 35,
    "title": "Question 35",
    "format": "multiple_choice",
    "prompt": "In pedology, the relative percentage proportions of sand, silt, and clay mineral fractions in a soil sample define its:",
    "options": [
      "Soil structure",
      "Soil profile",
      "Soil texture",
      "Soil porosity"
    ],
    "correctAnswer": "Soil texture",
    "hint": "Texture describes the particle size distribution of the mineral grains.",
    "workedSolution": "Soil texture is the relative percentage of sand ($2.0-0.05\\text{ mm}$), silt ($0.05-0.002\\text{ mm}$), and clay ($<0.002\\text{ mm}$) particles in a soil sample.",
    "points": 1
  },
  {
    "id": "q36",
    "number": 36,
    "title": "Question 36",
    "format": "multiple_choice",
    "prompt": "What is the very first agronomic factor an entrepreneur must assess when deciding to cultivate a commercial vegetable farm?",
    "options": [
      "Harvesting techniques and transport vehicle purchasing",
      "Chemical pesticide spraying scheduling",
      "Selection of an appropriate site with fertile soil and an accessible perennial water source",
      "Seedbed ridge construction and weeding"
    ],
    "correctAnswer": "Selection of an appropriate site with fertile soil and an accessible perennial water source",
    "hint": "Land selection and water accessibility precede all field operations.",
    "workedSolution": "Site selection—evaluating soil fertility, topography, and year-round water availability—is the critical initial decision before any land clearing or planting begins.",
    "points": 1
  },
  {
    "id": "q37",
    "number": 37,
    "title": "Question 37",
    "format": "multiple_choice",
    "prompt": "Which infrastructural and geographic factors are critical when choosing a site for commercial vegetable production?",
    "options": [
      "Proximity to urban market centers and gently sloping land topography",
      "Proximity to high-salinity oceanic beaches",
      "Presence of rocky unweathered granite outcrops",
      "Location in dense, perpetually shaded rainforest canopies"
    ],
    "correctAnswer": "Proximity to urban market centers and gently sloping land topography",
    "hint": "Vegetables are perishable and require quick road access to markets and good drainage.",
    "workedSolution": "Because vegetables are perishable, proximity to roads and markets minimizes post-harvest losses, while gentle topography prevents waterlogging and erosion.",
    "points": 1
  },
  {
    "id": "q38",
    "number": 38,
    "title": "Question 38",
    "format": "multiple_choice",
    "prompt": "Which cultural field practices are routinely carried out during the active field growth of cabbage crops?",
    "options": [
      "Pruning structural branches and deep furrow subsoiling",
      "Clear-felling tree canopies and slash-and-burn clearing",
      "Flooding fields with stagnant wastewater",
      "Regular weeding, irrigation watering, and pest monitoring"
    ],
    "correctAnswer": "Regular weeding, irrigation watering, and pest monitoring",
    "hint": "Weeding prevents competition, while regular watering supports leaf expansion.",
    "workedSolution": "Cabbages have shallow root systems and high water requirements, requiring regular weeding to eliminate nutrient competition, irrigation, and pest control.",
    "points": 1
  },
  {
    "id": "q39",
    "number": 39,
    "title": "Question 39",
    "format": "multiple_choice",
    "prompt": "Which of the following horticultural crops is cultivated as a fresh culinary vegetable fruit?",
    "options": [
      "The cocoa tree [Theobroma cacao]",
      "The cotton plant [Gossypium hirsutum]",
      "The rubber tree [Hevea brasiliensis]",
      "The garden tomato [Solanum lycopersicum]"
    ],
    "correctAnswer": "The garden tomato [Solanum lycopersicum]",
    "hint": "A perishable horticultural vegetable grown for its edible juicy red fruit.",
    "workedSolution": "Tomatoes are grown as annual vegetable crops for their edible fruits, whereas cocoa and rubber are commercial perennial cash tree crops.",
    "points": 1
  },
  {
    "id": "q40",
    "number": 40,
    "title": "Question 40",
    "format": "multiple_choice",
    "prompt": "In solid-state physics, what are the majority electric charge carriers in an extrinsic p-type semiconductor crystal?",
    "options": [
      "Free conduction electrons",
      "Positive holes (electron vacancies)",
      "Thermal neutrons",
      "Positively charged stationary nuclei"
    ],
    "correctAnswer": "Positive holes (electron vacancies)",
    "hint": "Doped with trivalent impurities like boron or indium, creating holes.",
    "workedSolution": "P-type semiconductors are doped with trivalent impurities that introduce electron vacancies ('holes'). These positive holes act as the majority charge carriers.",
    "points": 1
  }
]
};
