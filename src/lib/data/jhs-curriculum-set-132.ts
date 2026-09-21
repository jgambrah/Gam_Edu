/**
 * JHS Curriculum Data - Set 132
 * BECE Integrated Science Predictive Mock 1 (Paper 1 & Paper 2)
 *
 * Proprietary Content © GAM IT Solutions (GAM EDU). All rights reserved.
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

export interface SubQuestion {
  subId: string;
  prompt: string;
  workedSolution: string;
  maxMarks: number;
}

export interface Paper2Question {
  questionNumber: string;
  isPracticalSectionA: boolean;
  subQuestions: SubQuestion[];
}

// ==========================================
// PAPER 2 INLINE VECTOR SVGs
// ==========================================

// SVG for Q1(b): Eureka Can Displacement Experiment
export const svgQ1bEurekaDisplacement = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 360 210' width='100%' height='195' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Eureka Can (Overflow Can) on Left -->
    <g transform='translate(50, 25)'>
      <!-- Metal Can Body -->
      <path d='M 10 10 L 10 145 A 15 15 0 0 0 25 160 L 95 160 A 15 15 0 0 0 110 145 L 110 10' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='2'/>
      
      <!-- Slanted Overflow Spout -->
      <path d='M 110 50 L 140 75 L 140 85 L 110 65' fill='#0284c7' opacity='0.3' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='60' y='-5' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Eureka Can (Overflow Can)</text>

      <!-- Water Content inside Can filled to spout level -->
      <path d='M 11 50 L 11 145 A 14 14 0 0 0 25 159 L 95 159 A 14 14 0 0 0 109 145 L 109 50 Z' fill='#38bdf8' opacity='0.35'/>

      <!-- Submerged Irregular Metal Bob suspended by thread -->
      <line x1='60' y1='10' x2='60' y2='95' stroke='#ffffff' stroke-width='1.5'/>
      <ellipse cx='60' cy='115' rx='16' ry='20' fill='#64748b' stroke='#cbd5e1' stroke-width='1.8'/>
      <text x='60' y='119' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Solid Bob</text>
      <text x='60' y='35' font-size='8' fill='#cbd5e1' text-anchor='middle'>Thread</text>

      <!-- Water Droplets overflowing from spout -->
      <circle cx='145' cy='95' r='1.5' fill='#38bdf8'/>
      <circle cx='147' cy='105' r='1.5' fill='#38bdf8'/>
    </g>

    <!-- Graduated Measuring Cylinder on Right collecting displaced water -->
    <g transform='translate(205, 75)'>
      <rect x='0' y='0' width='35' height='110' fill='none' stroke='#38bdf8' stroke-width='1.8'/>
      <line x1='-5' y1='110' x2='40' y2='110' stroke='#38bdf8' stroke-width='2'/>
      <!-- Collected Displaced Water (Volume V) -->
      <rect x='1' y='65' width='33' height='44' fill='#38bdf8' opacity='0.6'/>
      <line x1='1' y1='65' x2='34' y2='65' stroke='#ef4444' stroke-width='1.5'/>
      <text x='45' y='68' font-size='9' font-weight='bold' fill='#ef4444'>V = 45 cm³</text>
      <text x='17' y='125' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Measuring Cylinder</text>
    </g>

    <text x='180' y='198' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>DISPLACEMENT PRINCIPLE: VOLUME OF DISPLACED WATER = VOLUME OF SUBMERGED BOB</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(c): Paper Chromatography Experiment
export const svgQ1cPaperChromatography = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 210' width='100%' height='195' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Outer Glass Boiling Tube / Chamber with Rubber Bung -->
    <g transform='translate(120, 15)'>
      <!-- Rubber Bung Stopper -->
      <polygon points='30,5 70,5 65,22 35,22' fill='#d97706' stroke='#b45309'/>
      <rect x='48' y='0' width='4' height='15' fill='#94a3b8'/>
      <!-- Boiling Tube Glass Walls -->
      <path d='M 25 22 L 25 155 A 25 25 0 0 0 75 155 L 75 22' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.8'/>
      
      <!-- Chromatography Paper Strip Suspended Inside -->
      <rect x='38' y='20' width='24' height='130' fill='#ffffff' opacity='0.9' stroke='#94a3b8' stroke-width='1'/>
      
      <!-- Baseline Pencil Line -->
      <line x1='38' y1='128' x2='62' y2='128' stroke='#64748b' stroke-width='1.5'/>
      <text x='28' y='131' font-size='8' font-weight='bold' fill='#64748b' text-anchor='end'>Baseline</text>

      <!-- Solvent Level at Bottom (below baseline) -->
      <rect x='26' y='140' width='48' height='22' fill='#38bdf8' opacity='0.5'/>
      <text x='82' y='152' font-size='8' font-weight='bold' fill='#38bdf8'>Solvent</text>

      <!-- Separated Dye Spots -->
      <!-- Yellow Dye Component (High Rf) -->
      <circle cx='50' cy='65' r='3.5' fill='#facc15'/>
      <!-- Blue Dye Component (Medium Rf) -->
      <circle cx='50' cy='92' r='3.5' fill='#3b82f6'/>
      
      <!-- Solvent Front Line near Top -->
      <line x1='38' y1='48' x2='62' y2='48' stroke='#ef4444' stroke-width='1.5' stroke-dasharray='2,2'/>
      <text x='68' y='51' font-size='8' font-weight='bold' fill='#ef4444'>Solvent Front</text>
    </g>

    <text x='170' y='198' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>PAPER CHROMATOGRAPHY: SEPARATION BASED ON DIFFERENTIAL ADSORPTION & SOLUBILITY</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// ==========================================
// 40 OBJECTIVE TEST QUESTIONS (RAW BANK)
// ==========================================
export const rawScienceBank: QuestionItem[] = [
  {
    number: 1,
    prompt: "In which anatomical region of the human alimentary canal does the enzymatic chemical digestion of dietary proteins begin?",
    correctAnswer: "The stomach (by gastric pepsin in acidic medium)",
    distractors: [
      "The buccal mouth cavity",
      "The muscular esophagus",
      "The terminal ileum"
    ],
    hint: "Gastric juice contains hydrochloric acid and pepsinogen.",
    workedSolution: "Protein digestion initiates in the stomach, where gastric pepsin hydrolyzes peptide bonds under an acidic pH (~2). Starch begins digestion in the mouth.",
    points: 1
  },
  {
    number: 2,
    prompt: "In the International System of Units (S.I.), which of the following represents the derived unit of mechanical pressure?",
    correctAnswer: "Pascal [Pa = N m⁻²]",
    distractors: [
      "Joule [J]",
      "Watt [W]",
      "Newton [N]"
    ],
    hint: "Defined as force per unit area ($P = \\frac{F}{A}$).",
    workedSolution: "Pressure is force per unit area; its S.I. unit is the Pascal ($\text{Pa} = \text{N m}^{-2}$). Joule measures energy, Watt measures power, and Newton measures force.",
    points: 1
  },
  {
    number: 3,
    prompt: "Which agricultural practice is the most effective biological method for restoring nitrogen to depleted soils without synthetic chemical fertilizers?",
    correctAnswer: "Cultivating leguminous cover crops that harbor symbiotic Rhizobium bacteria",
    distractors: [
      "Continuous monoculture farming",
      "Indiscriminate seasonal bush burning",
      "Applying excess quicklime"
    ],
    hint: "Root nodules fix atmospheric nitrogen gas into plant-available nitrates.",
    workedSolution: "Legumes (beans, cowpeas, groundnuts) possess root nodules containing symbiotic *Rhizobium* bacteria that fix atmospheric nitrogen gas into soil nitrates.",
    points: 1
  },
  {
    number: 4,
    prompt: "When a straight wooden stick is partially immersed obliquely into a pool of clean water, it appears bent at the liquid surface because:",
    correctAnswer: "Light rays emerging from water into air refract away from the normal",
    distractors: [
      "Light rays undergo complete specular internal reflection",
      "Light is dispersed into its constituent spectral colors",
      "Light rays travel faster in water than in air"
    ],
    hint: "Light changes speed and bends when crossing media of different optical densities.",
    workedSolution: "Light emerging obliquely from optically denser water into air speeds up and bends away from the normal, causing the submerged stick to appear displaced toward the surface.",
    points: 1
  },
  {
    number: 5,
    prompt: "A resting adult patient's blood pressure is measured clinically as $145/95\\text{ mmHg}$. This reading is medically diagnosed as:",
    correctAnswer: "Hypertension (high blood pressure)",
    distractors: [
      "Normal healthy adult blood pressure",
      "Severe acute hypotension",
      "Physiological hypoglycemia"
    ],
    hint: "Normal resting blood pressure is $\\approx 120/80\\text{ mmHg}$; values $\\ge 140/90\\text{ mmHg}$ indicate hypertension.",
    workedSolution: "Standard normotension is approximately $120/80\text{ mmHg}$. Systolic pressure $\ge 140\text{ mmHg}$ or diastolic $\ge 90\text{ mmHg}$ indicates clinical hypertension.",
    points: 1
  },
  {
    number: 6,
    prompt: "What is the systematic chemical formula for the binary ionic compound formed between Calcium ($Z=20$) and Chlorine ($Z=17$)?",
    correctAnswer: "CaCl₂",
    distractors: [
      "CaCl",
      "Ca₂Cl",
      "CaCl₃"
    ],
    hint: "Calcium has a valency of $+2$ and Chlorine has a valency of $-1$.",
    workedSolution: "Calcium ($\text{Ca}^{2+}$) requires two chloride anions ($\text{Cl}^-$) to balance electrical charges, yielding the stoichiometric formula $\\text{CaCl}_2$.",
    points: 1
  },
  {
    number: 7,
    prompt: "Which of the following cellular structures is present in eukaryotic plant cells but completely ABSENT from animal cells?",
    correctAnswer: "A rigid cellulose cell wall and photosynthetic chloroplasts",
    distractors: [
      "A membrane-bound nucleus and ribosomes",
      "Mitochondria and cytoplasm",
      "The outer plasma cell membrane"
    ],
    hint: "Provides mechanical rigidity and enables autotrophic photosynthesis.",
    workedSolution: "Cellulose cell walls and chloroplasts are unique to plant cells. Both plant and animal cells possess nuclei, mitochondria, ribosomes, and plasma membranes.",
    points: 1
  },
  {
    number: 8,
    prompt: "A machine with an applied effort force of $50.0\\text{ N}$ lifts an opposing load weight of $200.0\\text{ N}$. Calculate the Mechanical Advantage ($MA$) of the machine:",
    correctAnswer: "4.0",
    distractors: [
      "0.25",
      "10.0",
      "250.0"
    ],
    hint: "$$MA = \\frac{\\text{Load}}{\\text{Effort}} = \\frac{200.0}{50.0}$$.",
    workedSolution: "$$\\text{Mechanical Advantage } (MA) = \\frac{\\text{Load } (L)}{\\text{Effort } (E)} = \\frac{200.0\\text{ N}}{50.0\\text{ N}} = 4.0$$.",
    points: 1
  },
  {
    number: 9,
    prompt: "Which gaseous air pollutant is the primary anthropogenic greenhouse gas driving global climate change?",
    correctAnswer: "Carbon dioxide [CO₂]",
    distractors: [
      "Diatomic oxygen [O₂]",
      "Diatomic nitrogen [N₂]",
      "Inert argon gas [Ar]"
    ],
    hint: "Released in vast quantities by the industrial combustion of fossil fuels.",
    workedSolution: "Carbon dioxide ($\text{CO}_2$), emitted by fossil fuel combustion and deforestation, is the primary long-lived anthropogenic greenhouse gas driving global warming.",
    points: 1
  },
  {
    number: 10,
    prompt: "In semiconductor electronics, which electronic component allows electric current to flow freely in only one forward direction while blocking reverse current?",
    correctAnswer: "A p-n junction diode",
    distractors: [
      "An electrostatic capacitor",
      "An ohmic fixed resistor",
      "A step-down transformer"
    ],
    hint: "Acts as an electrical one-way valve.",
    workedSolution: "A p-n junction diode conducts current when forward-biased and blocks current when reverse-biased, serving as a rectifier.",
    points: 1
  },
  {
    number: 11,
    prompt: "Which pair of physical separation techniques is used to obtain pure liquid water and dry crystalline salt from seawater?",
    correctAnswer: "Simple distillation (for pure water) and evaporation (for salt crystals)",
    distractors: [
      "Gravity filtration and decantation",
      "Centrifugation and sublimation",
      "Magnetic separation and chromatography"
    ],
    hint: "Water vaporizes and condenses in distillation; evaporating brine leaves salt.",
    workedSolution: "Simple distillation boils seawater and condenses the steam into pure liquid water, while evaporation drives off water to leave dry crystallized sodium chloride.",
    points: 1
  },
  {
    number: 12,
    prompt: "A stone of mass $0.5\\text{ kg}$ is dropped from a cliff height of $20.0\\text{ m}$. Determine its kinetic energy just before striking the ground:\n$$[\\text{Take } g = 10.0\\text{ m s}^{-2}]$$",
    correctAnswer: "100.0 Joules",
    distractors: [
      "10.0 Joules",
      "50.0 Joules",
      "200.0 Joules"
    ],
    hint: "$$\\text{Initial } P.E. = mgh = 0.5 \\times 10.0 \\times 20.0 = \\text{Final } K.E.$$.",
    workedSolution: "By conservation of mechanical energy: $K.E. = P.E. = mgh = 0.5\\text{ kg} \\times 10.0\\text{ m s}^{-2} \\times 20.0\\text{ m} = 100.0\\text{ J}$.",
    points: 1
  },
  {
    number: 13,
    prompt: "Which tropical disease is caused by a parasitic protozoan transmitted through the bite of an infected female Anopheles mosquito?",
    correctAnswer: "Malaria [Plasmodium falciparum]",
    distractors: [
      "Yellow fever arbovirus",
      "River blindness [Onchocerciasis]",
      "Bacterial cholera"
    ],
    hint: "The mosquito injects *Plasmodium* sporozoites into the blood.",
    workedSolution: "Malaria is caused by the unicellular protozoan parasite *Plasmodium*, transmitted through the saliva of blood-feeding female *Anopheles* mosquitoes.",
    points: 1
  },
  {
    number: 14,
    prompt: "What is the ground-state Bohr electronic configuration of an atom of Sodium ($_{11}\\text{Na}$)?",
    correctAnswer: "2, 8, 1",
    distractors: [
      "2, 8, 8, 1",
      "2, 9",
      "2, 7, 2"
    ],
    hint: "Fills 2 electrons in K-shell, 8 in L-shell, and 1 in M-shell.",
    workedSolution: "Sodium has 11 electrons: 2 in the first shell, 8 in the second shell, and 1 valence electron in the third shell ($2, 8, 1$).",
    points: 1
  },
  {
    number: 15,
    prompt: "Which of the following simple machines operates as a second-class lever where the load resistance is situated between the fulcrum and effort?",
    correctAnswer: "A builder's wheelbarrow",
    distractors: [
      "A pair of scissors",
      "A claw hammer",
      "A pair of tweezers"
    ],
    hint: "The wheel is the pivot, cargo is in the middle, and handles receive the effort.",
    workedSolution: "In a Class 2 lever, the load is between the fulcrum and effort (e.g., wheelbarrow, nutcracker). Scissors and claw hammers are Class 1; tweezers are Class 3.",
    points: 1
  },
  {
    number: 16,
    prompt: "Which agricultural soil type has the highest capillary water retention capacity and smallest particle sizes?",
    correctAnswer: "Clayey soil",
    distractors: [
      "Coarse sandy soil",
      "Loamy agricultural soil",
      "Fine gravel"
    ],
    hint: "Microscopic particles create fine micropores that hold water tightly.",
    workedSolution: "Clayey soil consists of microscopic mineral particles ($< 0.002\\text{ mm}$) with high surface area and fine micropores, giving it the highest water-holding capacity.",
    points: 1
  },
  {
    number: 17,
    prompt: "Which blood vessel conveys oxygenated blood under high systemic pressure from the left ventricle of the heart to the rest of the body?",
    correctAnswer: "The aorta",
    distractors: [
      "The pulmonary artery",
      "The superior vena cava",
      "The renal vein"
    ],
    hint: "The largest artery in the human body.",
    workedSolution: "The aorta arises from the left ventricle, carrying oxygenated blood under high pressure to all systemic organs. The pulmonary artery carries deoxygenated blood to the lungs.",
    points: 1
  },
  {
    number: 18,
    prompt: "Why is water widely designated as the universal solvent in chemical science?",
    correctAnswer: "Its polar molecular structure and high dielectric constant dissolve a vast range of solutes",
    distractors: [
      "It is an organic hydrocarbon liquid",
      "It has a neutral pH of exactly 14",
      "It dissolves all non-polar covalent polymers"
    ],
    hint: "Polarity enables water molecules to hydrate and separate ionic lattices.",
    workedSolution: "Water's bent polar geometry ($\text{H}_2\text{O}$) and high dielectric constant allow it to overcome ionic bonds and form hydrogen bonds, dissolving a wide variety of solutes.",
    points: 1
  },
  {
    number: 19,
    prompt: "What is the primary function of the crystalline biconvex lens in the optical system of the human eye?",
    correctAnswer: "Fine-focusing light rays onto the sensory retina by altering its curvature",
    distractors: [
      "Regulating the diameter of the pupil aperture",
      "Protecting the cornea from mechanical abrasions",
      "Transmitting electrical impulses to the brain"
    ],
    hint: "Ciliary muscles alter its shape to accommodate for near and distant vision.",
    workedSolution: "The crystalline lens refracts and fine-tunes the focal point of incoming light rays onto the retina. The iris regulates light quantity, and the optic nerve transmits signals.",
    points: 1
  },
  {
    number: 20,
    prompt: "Which chemical reagent is commonly used as an antacid medication to neutralize excess gastric hydrochloric acid causing heartburn?",
    correctAnswer: "Magnesium hydroxide [Milk of Magnesia] / Sodium hydrogen carbonate",
    distractors: [
      "Dilute sulfuric acid",
      "Concentrated sodium hydroxide",
      "Copper (II) sulfate crystals"
    ],
    hint: "A mild, non-toxic base that raises stomach pH without harming tissues.",
    workedSolution: "Mild bases like magnesium hydroxide [$\\text{Mg(OH)}_2$] and sodium hydrogen carbonate [$\\text{NaHCO}_3$] neutralize excess gastric $\\text{HCl}$ to form harmless salts and water.",
    points: 1
  },
  {
    number: 21,
    prompt: "In ecological community food chains, which trophic level represents primary autotrophs that fix radiant solar energy?",
    correctAnswer: "Green plants and photosynthetic algae (Producers)",
    distractors: [
      "Herbivorous caterpillars (Primary consumers)",
      "Carnivorous toads (Secondary consumers)",
      "Saprophytic fungi (Decomposers)"
    ],
    hint: "Capture sunlight via photosynthesis to form the base of the food web.",
    workedSolution: "Green plants and algae are primary autotrophic producers that synthesize organic chemical energy from sunlight, forming the base of all grazing food chains.",
    points: 1
  },
  {
    number: 22,
    prompt: "An electric appliance rated $2,000.0\\text{ W}$ is operated continuously for $5.0\\text{ hours}$. Calculate the electrical energy consumed in kilowatt-hours (kWh):",
    correctAnswer: "10.0 kWh",
    distractors: [
      "400.0 kWh",
      "10,000.0 kWh",
      "2.5 kWh"
    ],
    hint: "$$\\text{Power in kW} = \\frac{2,000}{1,000} = 2.0\\text{ kW}$$. $$\\text{Energy} = P \\times t = 2.0 \\times 5.0$$.",
    workedSolution: "$$\\text{Power} = 2.0\\text{ kW}$$. $$\\text{Energy} = P \\times t = 2.0\\text{ kW} \\times 5.0\\text{ h} = 10.0\\text{ kWh}$$.",
    points: 1
  },
  {
    number: 23,
    prompt: "Which method of waste management provides the most sustainable, eco-friendly solution for managing discarded thermoplastic polymers?",
    correctAnswer: "Industrial sorting, shredding, and recycling into new plastic goods",
    distractors: [
      "Open-air domestic combustion in incinerators",
      "Disposal into agricultural compost pits",
      "Dumping into municipal open-air landfill trenches"
    ],
    hint: "Plastics are non-biodegradable and burning emits toxic dioxins; reprocessing preserves resources.",
    workedSolution: "Mechanical and chemical recycling reprocesses discarded thermoplastics into new products, conserving petroleum reserves and preventing toxic air emissions from burning.",
    points: 1
  },
  {
    number: 24,
    prompt: "In vertebrate anatomy, which respiratory structure contains single-cell-thick air sacs where gaseous exchange occurs between air and blood?",
    correctAnswer: "Alveoli in the lungs",
    distractors: [
      "Cartilaginous trachea",
      "Primary bronchi",
      "Laryngeal vocal cords"
    ],
    hint: "Surrounded by dense networks of pulmonary capillaries.",
    workedSolution: "Alveoli are microscopic, single-cell-thick air sacs in the lungs where oxygen diffuses into blood and carbon dioxide diffuses into alveolar air.",
    points: 1
  },
  {
    number: 25,
    prompt: "What is the stoichiometric ratio of hydrogen to oxygen atoms in a single molecule of pure water (H₂O)?",
    correctAnswer: "2:1",
    distractors: [
      "1:2",
      "1:1",
      "3:1"
    ],
    hint: "Two hydrogen atoms are covalently bonded to one oxygen atom.",
    workedSolution: "Water's chemical formula is $\\text{H}_2\\text{O}$, representing a fixed atomic ratio of two hydrogen atoms to one oxygen atom ($2:1$).",
    points: 1
  },
  {
    number: 26,
    prompt: "Which of the following cultivated crops is propagated vegetatively using mature stem cuttings?",
    correctAnswer: "Cassava [Manihot esculenta]",
    distractors: [
      "Maize cereal",
      "Cowpea legume",
      "Tomato vegetable"
    ],
    hint: "Woody stem stakes are inserted into ridges at an angle.",
    workedSolution: "Cassava is propagated vegetatively using stem cuttings (stakes) that sprout roots from nodes and leafy shoots from buds. Maize, cowpeas, and tomatoes are grown from seeds.",
    points: 1
  },
  {
    number: 27,
    prompt: "When solid ice cubes are heated, they melt into liquid water at 0°C. This transition is classified as a:",
    correctAnswer: "Reversible physical phase change",
    distractors: [
      "Permanent chemical oxidation",
      "Nuclear fusion reaction",
      "Irreversible decomposition"
    ],
    hint: "No new substance is synthesized; freezing recovers solid ice.",
    workedSolution: "Melting ice is a reversible physical change of state ($\\text{H}_2\\text{O}_{(s)} \\rightleftharpoons \\text{H}_2\\text{O}_{(l)}$) that does not alter molecular chemical bonds.",
    points: 1
  },
  {
    number: 28,
    prompt: "Which electrical meter is connected in series within an electric circuit to measure electric current?",
    correctAnswer: "An ammeter",
    distractors: [
      "A parallel voltmeter",
      "A mercury barometer",
      "A hydrometer"
    ],
    hint: "Possesses very low internal resistance so it does not reduce circuit current.",
    workedSolution: "An ammeter measures current in Amperes (A) and is wired in series so all charges flow through it. Voltmeters measure potential difference in parallel.",
    points: 1
  },
  {
    number: 29,
    prompt: "Which environmental factor is a primary requirement for seed germination that softens the seed coat and activates hydrolytic enzymes?",
    correctAnswer: "Adequate moisture (water)",
    distractors: [
      "Bright radiant sunlight",
      "Synthetic chemical fertilizer",
      "Organic compost manure"
    ],
    hint: "Imbibition of water activates metabolism; seeds can germinate in the dark.",
    workedSolution: "Water softens the seed coat, hydrates protoplasm, and activates hydrolytic enzymes (amylase) to break down stored food reserves during germination.",
    points: 1
  },
  {
    number: 30,
    prompt: "What is the chemical name of the compound formed when iron rusts in the presence of moist air?",
    correctAnswer: "Hydrated iron (III) oxide [Fe₂O₃·xH₂O]",
    distractors: [
      "Anhydrous iron (II) sulfide",
      "Pure iron (II) chloride",
      "Iron carbide"
    ],
    hint: "Formed by electrochemical oxidation of iron by oxygen and water.",
    workedSolution: "Rust is reddish-brown hydrated iron (III) oxide ($\\text{Fe}_2\\text{O}_3 \\cdot x\\text{H}_2\\text{O}$), formed when iron reacts electrochemically with oxygen and water.",
    points: 1
  },
  {
    number: 31,
    prompt: "Which of the following pairs of primary energy sources are renewable and environmentally friendly?",
    correctAnswer: "Solar radiation and wind energy",
    distractors: [
      "Bituminous coal and heavy crude oil",
      "Nuclear uranium and diesel fuel",
      "Crude petroleum and natural gas"
    ],
    hint: "Naturally replenishing resources that produce power without greenhouse gas emissions.",
    workedSolution: "Solar and wind energy are renewable resources replenished naturally that generate electricity without greenhouse gas emissions or environmental degradation.",
    points: 1
  },
  {
    number: 32,
    prompt: "In animal nutrition, which class of digestive enzymes hydrolyzes fats and oils into fatty acids and glycerol?",
    correctAnswer: "Lipases",
    distractors: [
      "Amylases",
      "Proteases",
      "Cellulases"
    ],
    hint: "Secreted by the pancreas to digest emulsified lipid droplets.",
    workedSolution: "Lipases (such as pancreatic lipase) break ester bonds in fats and oils, converting them into absorbable fatty acids and glycerol. Amylases digest starch, and proteases digest proteins.",
    points: 1
  },
  {
    number: 33,
    prompt: "What happens to the resistance of an ohmic conductor when its length is doubled while keeping its cross-sectional area and temperature constant?",
    correctAnswer: "The electrical resistance is doubled [R ∝ L]",
    distractors: [
      "The electrical resistance is halved",
      "The electrical resistance remains unchanged",
      "The electrical resistance becomes zero"
    ],
    hint: "Resistance is directly proportional to length: $R = \\frac{\\rho L}{A}$.",
    workedSolution: "Resistance is directly proportional to conductor length ($R \\propto L$). Doubling the length doubles the collisions moving electrons experience, doubling resistance.",
    points: 1
  },
  {
    number: 34,
    prompt: "Which component of whole human blood is responsible for blood clot formation at wound sites to prevent fatal hemorrhage?",
    correctAnswer: "Blood platelets (Thrombocytes)",
    distractors: [
      "Red blood cells (Erythrocytes)",
      "White blood cells (Leukocytes)",
      "Watery blood plasma alone"
    ],
    hint: "Cell fragments that aggregate and release thromboplastin to trigger clotting.",
    workedSolution: "Platelets (thrombocytes) adhere to damaged blood vessel walls and initiate the clotting cascade, converting soluble fibrinogen into an insoluble fibrin mesh.",
    points: 1
  },
  {
    number: 35,
    prompt: "What is the pH value of a neutral aqueous solution at 25°C?",
    correctAnswer: "Exactly 7.0",
    distractors: [
      "Less than 3.0",
      "Greater than 11.0",
      "Exactly 0.0"
    ],
    hint: "$$[\\text{H}^+] = [\\text{OH}^-] = 1.0 \\times 10^{-7}\\text{ M}$$.",
    workedSolution: "In a neutral solution at 25°C, hydrogen ion concentration equals hydroxide ion concentration ($10^{-7}\\text{ M}$), yielding a neutral $pH = 7.0$. Acids have $pH < 7$; bases have $pH > 7$.",
    points: 1
  },
  {
    number: 36,
    prompt: "Which mechanical simple machine is utilized in sloped wheelchair ramps to raise heavy loads with minimal applied effort?",
    correctAnswer: "An inclined plane",
    distractors: [
      "A hydraulic press",
      "A fixed single pulley alone",
      "A spur gear train"
    ],
    hint: "A flat surface tilted at an angle that trades distance for reduced effort.",
    workedSolution: "An inclined plane is a sloped surface allowing a load to be raised through a vertical height using an effort force smaller than the load, moving through a longer distance.",
    points: 1
  },
  {
    number: 37,
    prompt: "In plant botany, the protective floral envelope consisting of green leaf-like sepals that protects the young bud before opening is the:",
    correctAnswer: "Calyx",
    distractors: [
      "Corolla",
      "Androecium",
      "Gynoecium"
    ],
    hint: "The outermost floral whorl made of sepals; corolla consists of petals.",
    workedSolution: "The calyx is the outermost whorl of a flower composed of sepals that enclose and protect developing floral organs in the bud stage. The corolla consists of petals.",
    points: 1
  },
  {
    number: 38,
    prompt: "Which infectious respiratory illness is caused by an aerosolized viral pathogen?",
    correctAnswer: "Influenza [Flu virus]",
    distractors: [
      "Bacterial cholera",
      "Amoebic dysentery",
      "Cutaneous ringworm"
    ],
    hint: "Spread through airborne droplets expelled during coughing and sneezing.",
    workedSolution: "Influenza is an acute respiratory infection caused by influenza viruses transmitted via airborne droplets. Cholera and dysentery are waterborne bacterial/protozoan infections.",
    points: 1
  },
  {
    number: 39,
    prompt: "When an electric current passes through an aqueous electrolyte, chemical decomposition occurs at the electrodes. This process is:",
    correctAnswer: "Electrolysis",
    distractors: [
      "Electromagnetic induction",
      "Electrostatic charging",
      "Thermal convection"
    ],
    hint: "Electrical energy drives non-spontaneous chemical redox reactions.",
    workedSolution: "Electrolysis is the chemical decomposition of an ionic compound (molten or in solution) into its constituent elements by passing direct electric current through it.",
    points: 1
  },
  {
    number: 40,
    prompt: "Why is an unworked field of bare topsoil quickly degraded and scoured during tropical rainstorms?",
    correctAnswer: "The lack of vegetative canopy and root binding leaves topsoil exposed to erosion",
    distractors: [
      "Soil microbes consume all mineral particles",
      "Rainwater chemically dissolves all quartz sand",
      "Solar radiation eliminates soil mass"
    ],
    hint: "Vegetation absorbs raindrop impact energy and plant roots bind soil particles.",
    workedSolution: "Bare soil lacks plant canopies to intercept falling raindrops and root systems to bind soil aggregates, allowing raindrop impact and surface runoff to scour away topsoil.",
    points: 1
  }
];

// Seeded target permutation ensuring exactly 10 A, 10 B, 10 C, 10 D
const targetKeys: number[] = [
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3,
  0, 1, 2, 3, 0, 1, 2, 3, 0, 1,
  2, 3, 0, 1, 2, 3, 0, 1, 2, 3
];

function seedShuffle<T>(array: T[], seed: number): T[] {
  const arr = [...array];
  let m = arr.length, t, i;
  while (m) {
    seed = (seed * 9301 + 49297) % 233280;
    i = Math.floor((seed / 233280) * m--);
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

const assignedTargetIndices = seedShuffle(targetKeys, 202701);

export const balancedMock1P1 = rawScienceBank.map((q, idx) => {
  const correctIdx = assignedTargetIndices[idx]; // 0=A, 1=B, 2=C, 3=D
  const options: string[] = [];
  let dCount = 0;
  for (let pos = 0; pos < 4; pos++) {
    if (pos === correctIdx) {
      options.push(q.correctAnswer);
    } else {
      options.push(q.distractors[dCount++]);
    }
  }
  return {
    number: q.number,
    prompt: q.prompt,
    options: options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points
  };
});

// ==========================================
// PAPER 2 ESSAY QUESTIONS BANK (CALIBRATED)
// ==========================================
export const paper2Mock1Questions: Paper2Question[] = [
  // ==========================================
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `In a genetics breeding experiment on pea plants, a pure-breeding tall plant ($TT$) was cross-pollinated with a pure-breeding dwarf plant ($tt$):
(i) Using a clear genetic Punnett square diagram, determine the genotypes and phenotypes of the first filial ($F_1$) generation.
(ii) If two plants from the $F_1$ generation are self-pollinated, determine the phenotypic ratio of tall to dwarf plants in the second filial ($F_2$) generation.
(iii) State one practical agricultural benefit of artificial cross-breeding in commercial crop production.`,
        workedSolution: `(i) Genetic Cross ($F_1$ Generation):
• Parental Genotypes: $TT \\times tt$
• Gametes: $T, T$ and $t, t$
• Punnett Square:
  | Gametes | T | T |
  | :---: | :---: | :---: |
  | **t** | Tt | Tt |
  | **t** | Tt | Tt |
• Genotypic Ratio: $100\\%$ heterozygous tall ($Tt$)
• Phenotypic Result: All $F_1$ offspring are **Tall plants**.

(ii) $F_2$ Generation Cross ($Tt \\times Tt$):
• Punnett Square:
  | Gametes | T | t |
  | :---: | :---: | :---: |
  | **T** | TT | Tt |
  | **t** | Tt | tt |
• Genotypes: $1\\ TT : 2\\ Tt : 1\\ tt$
• Phenotypic Ratio: **3 Tall plants : 1 Dwarf plant** (3:1 ratio).

(iii) Practical agricultural benefit:
Produces hybrid vigor (heterosis), breeding high-yielding, disease-resistant, and climate-resilient crop varieties.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `The diagram below illustrates a laboratory density experiment using an Archimedean Eureka (overflow) can to determine the volume and density of an irregular metallic bob:

${svgQ1bEurekaDisplacement}

(i) Name the physical principle demonstrated in this experiment.
(ii) If the mass of the dry metallic bob measured on an electronic balance is $360.0\\text{ g}$, and the volume of displaced water collected in the graduated cylinder is $45.0\\text{ cm}^3$, calculate the density of the metal.
(iii) State two experimental precautions that must be observed to obtain an accurate result.`,
        workedSolution: `(i) Physical Principle:
**Archimedes' Principle of Displacement:** A completely submerged solid displaces a volume of liquid exactly equal to its own physical volume ($V_{\\text{displaced}} = V_{\\text{solid}}$).

(ii) Density Calculation:
Formula:
$$\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)}$$
Substitute given values ($m = 360.0\\text{ g}$, $V = 45.0\\text{ cm}^3$):
$$\\rho = \\frac{360.0\\text{ g}}{45.0\\text{ cm}^3} = 8.00\\text{ g cm}^{-3}$$
$$(8,000.0\\text{ kg m}^{-3})$$
Answer: The density of the metallic bob is $$8.00\\text{ g cm}^{-3}$$.

(iii) Precautions:
1. Ensure the Eureka can is filled to the spout and allowed to stop dripping completely before lowering the solid.
2. Lower the bob gently using a thin thread to prevent splashing water.
3. Read the measuring cylinder at eye level at the bottom of the meniscus to avoid parallax error.
4. Ensure no air bubbles cling to the submerged bob.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `The diagram below illustrates an ascending paper chromatography experiment performed to separate the dye pigments in black ink:

${svgQ1cPaperChromatography}

(i) Explain the scientific principle underlying paper chromatography.
(ii) State the functions of:
  (α) The pencil baseline;
  (β) The developing solvent.
(iii) If the solvent front travels a distance of $10.0\\text{ cm}$ from the baseline while the blue dye spot travels $6.0\\text{ cm}$, calculate the Retention Factor ($R_f$) of the blue dye.
(iv) State one industrial or forensic application of chromatography.`,
        workedSolution: `(i) Principle of Chromatography:
Relies on the differential partition of solutes between two phases: a stationary phase (cellulose paper fibers) and a mobile phase (developing solvent). Solutes separate based on their relative solubility in the solvent and degree of adsorption to the paper.

(ii) Functions of components:
• (α) Pencil baseline: Provides an insoluble reference starting line for measuring migration distances (pen ink cannot be used as it dissolves and distorts results).
• (β) Developing solvent: Acts as the mobile phase, dissolving solutes and carrying them upward through capillary action.

(iii) Retention Factor ($R_f$) Calculation:
Formula:
$$R_f = \\frac{\\text{Distance traveled by solute spot}}{\\text{Distance traveled by solvent front}}$$
Substitute values:
$$R_f = \\frac{6.0\\text{ cm}}{10.0\\text{ cm}} = 0.60$$
Answer: The $R_f$ value of the blue dye is $$0.60$$ *(dimensionless ratio)*.

(iv) Applications:
1. Forensic crime scene analysis (identifying ink, poison, or blood components).
2. Pharmaceutical quality control (testing drug purity).
3. Analyzing food colorings and synthetic dyes.`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `In an agricultural crop rotation program, a farmer partitions a field into four equal plots to cultivate **Maize (cereal), Cowpea (legume), Cassava (root crop), and Cabbage (leafy vegetable)** over four years:
(i) Design a 4-year rotational cropping schedule for Plots 1, 2, 3, and 4.
(ii) Give two agronomic reasons for the sequence of crops chosen in your schedule.
(iii) State two advantages of crop rotation over continuous monoculture farming.`,
        workedSolution: `(i) 4-Year Crop Rotation Schedule:

| Year | Plot 1 | Plot 2 | Plot 3 | Plot 4 |
| :---: | :---: | :---: | :---: | :---: |
| **Year 1** | Cassava (Deep feeder) | Cowpea (Legume) | Maize (Gross feeder) | Cabbage (Shallow feeder) |
| **Year 2** | Cabbage | Cassava | Cowpea | Maize |
| **Year 3** | Maize | Cabbage | Cassava | Cowpea |
| **Year 4** | Cowpea | Maize | Cabbage | Cassava |

(ii) Agronomic reasons for sequence:
1. **Nutrient Balancing:** Planting nitrogen-fixing cowpeas directly before heavy-feeding maize naturally replenishes soil nitrates.
2. **Root Depth Alternation:** Deep-rooted cassava draws nutrients from lower soil horizons, while shallow-rooted cabbage feeds from topsoil, preventing depletion of a single horizon.

(iii) Advantages of crop rotation:
1. Maintains and naturally regenerates soil fertility without heavy chemical fertilizer use.
2. Breaks pest and disease life cycles by depriving host-specific pathogens of continuous host plants.
3. Suppresses weed establishment and reduces soil erosion through varying canopy covers.`,
        maxMarks: 10
      }
    ]
  },

  // ==========================================
  // SECTION B: THEORY ESSAYS (ANSWER ANY 3 QUESTIONS, 60 MARKS TOTAL)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) State three practical measures for conserving electrical energy in a domestic household.
(ii) A household air conditioner rated at $3,500.0\\text{ W}$ is operated for $8.0\\text{ hours}$ daily. Calculate:
  (α) The electrical energy consumed in kilowatt-hours (kWh) per day;
  (β) The total cost of operating the appliance for a 30-day month if electricity costs GH₵ 1.50 per kWh.`,
        workedSolution: `(i) Energy conservation measures:
1. Switching off lights and unplugging appliances when not in use.
2. Replacing incandescent filament bulbs with energy-efficient LED lamps.
3. Keeping refrigerator doors closed and maintaining cooling coils.

(ii) Calculations:
• (α) Energy consumed per day:
$$\\text{Power in kW} = \\frac{3,500.0\\text{ W}}{1,000} = 3.5\\text{ kW}$$
$$\\text{Daily Energy} = P \\times t = 3.5\\text{ kW} \\times 8.0\\text{ h} = 28.0\\text{ kWh}$$
Answer: Daily consumption is $$28.0\\text{ kWh}$$.

• (β) Monthly cost:
$$\\text{Monthly Energy} = 28.0\\text{ kWh/day} \\times 30\\text{ days} = 840.0\\text{ kWh}$$
$$\\text{Total Cost} = 840.0\\text{ kWh} \\times \\text{GH₵ } 1.50 = \\text{GH₵ } 1,260.00$$
Answer: The total monthly cost is **GH₵ 1,260.00**.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `A patient experiencing acute acid indigestion drinks an antacid containing sodium hydrogen carbonate [$\\text{NaHCO}_3$]:
(i) Write a balanced chemical equation for the neutralization of excess gastric hydrochloric acid [$\\text{HCl}$] by the antacid.
(ii) Explain how this chemical reaction relieves stomach discomfort.`,
        workedSolution: `(i) Balanced chemical equation:
$$\\text{NaHCO}_{3(aq)} + \\text{HCl}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)} + \\text{CO}_{2(g)}\\uparrow$$

(ii) Explanation of relief:
Heartburn is caused by hyperacidity (excess $\\text{HCl}$ irritating the stomach lining). Sodium hydrogen carbonate neutralizes the acid, forming neutral sodium chloride salt, water, and carbon dioxide. This raises gastric pH toward normal, relieving discomfort.`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `(i) Explain what is meant by a 'green economy' in environmental science.
(ii) State three national policy initiatives that Ghana can implement to transition toward a green economy.
(iii) Name two primary industrial greenhouse gases contributing to global warming.`,
        workedSolution: `(i) Definition of green economy:
An economic development model that aims for sustainable development by significantly reducing environmental risks, ecological scarcities, and carbon emissions while improving human well-being and social equity.

(ii) National policy initiatives:
1. Large-scale afforestation and reforestation to restore degraded forests.
2. Expanding renewable energy infrastructure (grid-scale solar and wind farms).
3. Establishing nationwide plastic waste recycling programs.
4. Transitioning public transit to electric buses and light rail.

(iii) Industrial greenhouse gases:
1. Carbon dioxide [$\\text{CO}_2$]
2. Methane [$\\text{CH}_4$]
*(Alternatives: Nitrous oxide $\\text{N}_2\\text{O}$, Chlorofluorocarbons CFCs)*`,
        maxMarks: 8
      }
    ]
  },
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `A patient's resting blood pressure is recorded clinically as $150/95\\text{ mmHg}$:
(i) State the clinical significance of the two numerical values ($150$ and $95$).
(ii) Identify the medical condition diagnosed from this reading.
(iii) State three non-pharmacological lifestyle remedies recommended to manage this condition.`,
        workedSolution: `(i) Clinical significance:
• **150 mmHg (Systolic Pressure):** The peak arterial pressure when the left ventricle contracts and pumps blood into the aorta (elevated above the normal $120\\text{ mmHg}$).
• **95 mmHg (Diastolic Pressure):** The minimum arterial pressure when the heart rests between beats (elevated above the normal $80\\text{ mmHg}$).

(ii) Diagnosis:
**Stage 1 / Stage 2 Hypertension (High Blood Pressure)**.

(iii) Lifestyle remedies:
1. Reducing dietary sodium (salt) intake and avoiding processed foods.
2. Engaging in regular moderate aerobic exercise (brisk walking, swimming) for at least 30 minutes daily.
3. Managing stress and abstaining from tobacco smoking and excessive alcohol consumption.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `(i) State the two fundamental Laws of Reflection of light.
(ii) An incident light ray strikes a flat optical plane mirror such that the glancing angle between the ray and the mirror surface is $35^\\circ$. Determine:
  (α) The angle of incidence ($i$);
  (β) The angle of reflection ($r$).`,
        workedSolution: `(i) Laws of Reflection:
1. **First Law:** The incident ray, the reflected ray, and the normal to the reflecting surface at the point of incidence all lie in the exact same plane.
2. **Second Law:** The angle of incidence ($i$) is strictly equal to the angle of reflection ($r$):
$$i = r$$

(ii) Calculations:
The normal line is perpendicular to the mirror ($90^\\circ$):
• (α) Angle of incidence ($i$):
$$i = 90^\\circ - \\text{Glancing Angle} = 90^\\circ - 35^\\circ = 55^\\circ$$
Answer: The angle of incidence is $$55^\\circ$$.

• (β) Angle of reflection ($r$):
By the Second Law of Reflection:
$$r = i = 55^\\circ$$
Answer: The angle of reflection is $$55^\\circ$$.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: `The following feeding interactions occur in a tropical savanna grassland community:
• Grass is eaten by grasshoppers, zebras, and field mice.
• Grasshoppers are eaten by toads and lizards.
• Toads are eaten by snakes.
• Field mice are eaten by snakes and hawks.
• Zebras are eaten by lions.
• Snakes are eaten by hawks.

(i) Construct a food web connecting these feeding relationships.
(ii) Identify from your food web:
  (α) The primary producer;
  (β) Two primary consumers (herbivores);
  (γ) One tertiary or apex consumer.`,
        workedSolution: `(i) Food Web Diagram:
\`\`\`
                    Lion               Hawk
                     ^                ^  ^  ^
                     |               /   |   \\
                   Zebra        Snake   |    |
                     ^            ^      |    |
                     |           / \\     |    |
                     |       Toad   \\    |    |
                     |        ^      \\   |    |
                     |        |       \\  |    |
                     |   Grasshopper   Field Mouse
                     |        ^             ^
                     \\        |            /
                      \\-------Grass-------/
\`\`\`

(ii) Identification:
• (α) Primary Producer: **Grass**
• (β) Primary Consumers (Herbivores): **Zebra, Field Mouse, Grasshopper**
• (γ) Apex / Tertiary Consumer: **Lion or Hawk**`,
        maxMarks: 8
      }
    ]
  },
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) Using dot-and-cross valence electron diagrams, illustrate the formation of a covalent molecule of water [$\\text{H}_2\\text{O}$] from one Oxygen atom ($_{8}\\text{O}$) and two Hydrogen atoms ($_{1}\\text{H}$).
(ii) State two physical properties of covalent chemical compounds.`,
        workedSolution: `(i) Formation of Water Molecule ($\\text{H}_2\\text{O}$):
• Oxygen ($Z=8$) configuration: $2, 6$ (needs 2 electrons for stable octet).
• Hydrogen ($Z=1$) configuration: $1$ (needs 1 electron for stable duet).
• Bonding: Oxygen shares one electron with each of two hydrogen atoms, forming **two single covalent bonds** ($\\text{O}-\\text{H}$) and retaining **two unshared lone pairs** of electrons:
$$\\text{H} \\cdot + \\cdot \\ddot{\\text{O}} \\cdot + \\cdot \\text{H} \\to \\text{H} : \\ddot{\\text{O}} : \\text{H}$$

(ii) Properties of covalent compounds:
1. Low melting and boiling points due to weak intermolecular forces.
2. Generally poor electrical conductors (non-electrolytes) because they lack free mobile ions.
3. Insoluble in polar solvents (water) but soluble in non-polar organic solvents (kerosene, ethanol).`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) Draw the conventional electronic circuit symbols for:
  (α) A p-n junction diode;
  (β) A Light Emitting Diode (LED).
(ii) Draw a simple series circuit diagram showing an LED connected in forward bias with a DC cell, a protective fixed resistor, and a switch.
(iii) State the function of the fixed resistor in this circuit.`,
        workedSolution: `(i) Electronic Symbols:
• (α) Diode: A triangle pointing to a vertical bar ($|\\blacktriangleright|$).
• (β) LED: A diode symbol with two outward-radiating arrows indicating light emission.

(ii) Circuit Diagram:
A series loop connecting:
• DC Cell positive terminal $\\to$ closed switch $\\to$ protective fixed resistor $\\to$ LED anode (triangle base) $\\to$ LED cathode (vertical bar) returning to the negative cell terminal.

(iii) Function of resistor:
The resistor acts as a current limiter, dropping excess voltage and preventing large forward currents from overheating and destroying the LED.`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `Describe the step-by-step procedure for preparing high-quality organic compost manure using garden and household organic residues.`,
        workedSolution: `Composting Protocol:
1. **Site Selection:** Select a shaded, well-drained site to build a compost pit or heap.
2. **Base Layer:** Lay coarse woody twigs or maize stalks at the base ($10-15\\text{ cm}$) to ensure aeration and drainage.
3. **Alternating Layers:**
   • Add green nitrogen-rich matter (kitchen scraps, fresh grass, animal dung).
   • Cover with brown carbon-rich matter (dry leaves, straw).
   • Add a thin sprinkle of topsoil to introduce decomposing bacteria and fungi.
4. **Moisture Control:** Sprinkle water lightly over each layer to maintain dampness without waterlogging.
5. **Aeration & Turning:** Turn the heap with a garden fork every 2 to 3 weeks to aerate the decomposing mass.
6. **Maturation:** After 8 to 12 weeks, microbial decomposition yields dark, crumbly, fertile compost with an earthy aroma.`,
        maxMarks: 6
      }
    ]
  },
  {
    questionNumber: "5",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) In animal husbandry, distinguish between the digestive systems of a ruminant animal (goat) and a monogastric animal (rabbit).
(ii) State three agronomic advantages of feeding fermented forage silage to livestock during dry seasons.`,
        workedSolution: `(i) Ruminant vs. Monogastric Digestion:
• **Goat (Ruminant):** Possesses a complex, four-chambered stomach (rumen, reticulum, omasum, abomasum) adapted for foregut microbial fermentation of cellulose.
• **Rabbit (Monogastric):** Possesses a simple, single-chambered stomach with an enlarged, functional caecum adapted for hindgut microbial fermentation.

(ii) Advantages of silage:
1. **High Palatability:** Lactic acid fermentation gives silage a pleasant aroma and taste that stimulates appetite.
2. **High Nutrient Retention:** Retains green forage protein, vitamins, and energy better than sun-dried hay.
3. **Year-Round Feed Security:** Provides succulent feed during prolonged dry seasons when pastures are dry.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) A crowbar of total length $120.0\\text{ cm}$ is used as a first-class lever to lift a heavy rock. If the pivot (fulcrum) is placed $30.0\\text{ cm}$ from the rock, calculate the Velocity Ratio ($VR$) of the lever.
(ii) If an applied effort of $250.0\\text{ N}$ lifts a rock load of $700.0\\text{ N}$, calculate:
  (α) The Mechanical Advantage ($MA$);
  (β) The mechanical efficiency of the lever.`,
        workedSolution: `(i) Velocity Ratio Calculation:
• $\\text{Load Distance } (d_L) = 30.0\\text{ cm}$
• $\\text{Effort Distance } (d_E) = 120.0\\text{ cm} - 30.0\\text{ cm} = 90.0\\text{ cm}$
$$VR = \\frac{\\text{Distance moved by Effort } (d_E)}{\\text{Distance moved by Load } (d_L)} = \\frac{90.0\\text{ cm}}{30.0\\text{ cm}} = 3.0$$
Answer: The Velocity Ratio is $$3.0$$.

(ii) Calculations:
• (α) Mechanical Advantage:
$$MA = \\frac{\\text{Load } (L)}{\\text{Effort } (E)} = \\frac{700.0\\text{ N}}{250.0\\text{ N}} = 2.80$$
Answer: The Mechanical Advantage is $$2.80$$.

• (β) Mechanical Efficiency:
$$\\text{Efficiency} = \\frac{MA}{VR} \\times 100\\% = \\frac{2.80}{3.0} \\times 100\\% = 93.33\\%$$
Answer: The mechanical efficiency is $$93.33\\%$$.`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `(i) In astronomical planetary science, differentiate between terrestrial inner planets and Jovian gas giant planets, giving two examples of each.
(ii) State two physical reasons why biological life cannot survive on planet Jupiter.`,
        workedSolution: `(i) Terrestrial vs. Jovian Planets:
• **Terrestrial (Inner) Planets:** Dense, rocky, compact planets with solid surfaces and few/no moons (e.g., Mercury, Venus, Earth, Mars).
• **Jovian (Outer) Gas Giants:** Massive planets composed predominantly of hydrogen and helium fluids lacking solid surfaces, with ring systems and many moons (e.g., Jupiter, Saturn, Uranus, Neptune).

(ii) Why life cannot exist on Jupiter:
1. **Lack of Solid Surface:** Jupiter is a gas giant composed of dense fluids under extreme atmospheric pressure.
2. **Extreme Atmospheric Conditions:** Severe pressure, high radiation, violent storms, and sub-zero temperatures (around $-145^\\circ\\text{C}$) prevent biological life.`,
        maxMarks: 6
      }
    ]
  }
];

export const SET_BECE_MOCK_1_SCIENCE_P1 = {
  year: "Mock 1",
  isMock: true,
  setNumber: 132,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Predictive Standard Mock 1)",
  title: "Paper 1: Objective Test (Mock 1)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedMock1P1
};

export const SET_BECE_MOCK_1_SCIENCE_P2 = {
  year: "Mock 1",
  isMock: true,
  setNumber: 132,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Predictive Standard Mock 1)",
  title: "Paper 2: Practical & Theory Essay (Mock 1)",
  durationMinutes: 105,
  instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
  totalQuestions: 5,
  questions: paper2Mock1Questions
};

export const SET_BECE_MOCK_1_SCIENCE_COMPLETE = {
  year: "Mock 1",
  isMock: true,
  setNumber: 132,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Predictive Standard Mock 1)",
  paper1: {
    title: "Paper 1: Objective Test (Mock 1)",
    durationMinutes: 45,
    totalQuestions: 40,
    questions: balancedMock1P1
  },
  paper2: {
    title: "Paper 2: Practical & Theory Essay (Mock 1)",
    durationMinutes: 105,
    instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
    totalQuestions: 5,
    questions: paper2Mock1Questions
  },
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    predictiveModel: true,
    vectorGraphicsCount: 2,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
