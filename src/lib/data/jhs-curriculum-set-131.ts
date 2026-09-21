/**
 * JHS Curriculum Data - Set 131
 * 1999 BECE Integrated Science Complete Variant (Paper 1 & Paper 2)
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
// INLINE VECTOR SVGs
// ==========================================

// SVG for Q2(a): Testing Expired Air with Lime Water
export const svgQ2aExpiredAirTest = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 220' width='100%' height='200' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Glass Test Tube / Boiling Tube -->
    <g transform='translate(130, 20)'>
      <path d='M 10 10 L 10 145 A 25 25 0 0 0 60 145 L 60 10' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='2'/>
      <ellipse cx='35' cy='10' rx='25' ry='6' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      
      <!-- Limewater Liquid Turning Milky -->
      <path d='M 11 85 L 11 145 A 24 24 0 0 0 59 145 L 59 85 Z' fill='#cbd5e1' opacity='0.6'/>
      <text x='85' y='110' font-size='9' font-weight='bold' fill='#cbd5e1'>Limewater turns milky</text>
      <text x='85' y='122' font-size='8' fill='#94a3b8'>(CaCO₃ precipitate)</text>

      <!-- Glass Delivery Straw for Exhaled Breath -->
      <line x1='35' y1='-5' x2='35' y2='135' stroke='#ffffff' stroke-width='3.5'/>
      <line x1='33' y1='-5' x2='33' y2='135' stroke='#38bdf8' stroke-width='1'/>
      <line x1='37' y1='-5' x2='37' y2='135' stroke='#38bdf8' stroke-width='1'/>

      <!-- Exhaled CO₂ Gas Bubbles -->
      <circle cx='25' cy='125' r='3' fill='#ffffff' opacity='0.85'/>
      <circle cx='45' cy='115' r='3.5' fill='#ffffff' opacity='0.85'/>
      <circle cx='28' cy='100' r='4' fill='#ffffff' opacity='0.85'/>
      <circle cx='42' cy='92' r='3' fill='#ffffff' opacity='0.85'/>

      <!-- Air Inflow Arrow -->
      <line x1='35' y1='-15' x2='35' y2='-2' stroke='#10b981' stroke-width='2.5'/>
      <polygon points='31,-4 35,2 39,-4' fill='#10b981'/>
      <text x='48' y='-8' font-size='9' font-weight='bold' fill='#10b981'>Expired breath (CO₂)</text>
    </g>

    <text x='170' y='200' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>EXHALED CO₂ REACTS WITH LIMEWATER: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q2(d): Second Class Lever (Wheelbarrow Mechanism)
export const svgQ2dSecondClassLever = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 360 170' width='100%' height='155' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Fulcrum Pivot (Wheel Axle on Left End) -->
    <circle cx='60' cy='95' r='18' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/>
    <circle cx='60' cy='95' r='4' fill='#ffffff'/>
    <text x='60' y='135' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Pivot (Fulcrum)</text>

    <!-- Rigid Lever Beam / Handles -->
    <line x1='60' y1='95' x2='310' y2='65' stroke='#cbd5e1' stroke-width='5' stroke-linecap='round'/>

    <!-- Load Situated in Middle (Wheelbarrow Basin / Cargo) -->
    <g transform='translate(160, 50)'>
      <rect x='-25' y='0' width='50' height='30' rx='3' fill='#1e293b' stroke='#ef4444' stroke-width='2'/>
      <text x='0' y='18' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>Load</text>
      <!-- Downward Load Force Vector -->
      <line x1='0' y1='30' x2='0' y2='65' stroke='#ef4444' stroke-width='2.5'/>
      <polygon points='-4,57 0,67 4,57' fill='#ef4444'/>
      <text x='12' y='55' font-size='9' font-weight='bold' fill='#ef4444'>Load (L)</text>
    </g>

    <!-- Applied Effort Force on Far Right (Handles) -->
    <g transform='translate(305, 65)'>
      <!-- Upward Effort Vector -->
      <line x1='0' y1='35' x2='0' y2='-10' stroke='#10b981' stroke-width='2.5'/>
      <polygon points='-4,-2 0,-12 4,-2' fill='#10b981'/>
      <text x='-8' y='-16' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>Effort (E)</text>
    </g>

    <text x='180' y='155' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>SECOND CLASS LEVER: LOAD RESISTANCE IS LOCATED BETWEEN FULCRUM AND EFFORT</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q3(b): Synthesis of Iron (II) Sulfide in Ignition Tube
export const svgQ3bIronSulfurReaction = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 180' width='100%' height='165' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Horizontally Clamped Hard Glass Test Tube -->
    <g transform='translate(50, 45)'>
      <path d='M 180 15 L 25 15 A 15 15 0 0 0 25 45 L 180 45' fill='none' stroke='#38bdf8' stroke-width='2'/>
      <ellipse cx='180' cy='30' rx='5' ry='15' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>

      <!-- Heated Glowing Mixture of Fe and S forming FeS -->
      <path d='M 25 16 L 75 16 L 75 44 L 25 44 A 14 14 0 0 1 25 16 Z' fill='#f59e0b' opacity='0.7'/>
      <text x='50' y='33' font-size='9' font-weight='bold' fill='#0f172a' text-anchor='middle'>Fe + S</text>

      <!-- Bunsen Burner Flame Below -->
      <path d='M 50 65 Q 43 48 50 44 Q 57 48 50 65 Z' fill='#ef4444'/>
      <path d='M 50 65 Q 46 54 50 50 Q 54 54 50 65 Z' fill='#fef08a'/>
      <text x='50' y='82' font-size='9' font-weight='bold' fill='#ef4444' text-anchor='middle'>Bunsen Heat</text>
      
      <!-- Label on Right -->
      <line x1='75' y1='30' x2='125' y2='10' stroke='#94a3b8' stroke-width='1.2'/>
      <text x='130' y='12' font-size='10' font-weight='bold' fill='#cbd5e1'>Black Iron (II) Sulfide (FeS)</text>
    </g>

    <text x='170' y='160' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>EXOTHERMIC SYNTHESIS REACTION: Fe(s) + S(s) → FeS(s) + HEAT</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// ==========================================
// 40 OBJECTIVE TEST QUESTIONS (RAW BANK)
// ==========================================
export const rawScienceBank: QuestionItem[] = [
  {
    number: 1,
    prompt: "Which sequence of laboratory procedures is required to separate and recover both dry common salt and clean sand from their dry mixture?",
    correctAnswer: "Dissolution in water, gravity filtration, and evaporation to dryness",
    distractors: [
      "Gravity filtration followed directly by simple distillation",
      "Dissolution in water followed directly by evaporation without filtration",
      "Dissolution in water, gravity sedimentation, and decantation only"
    ],
    hint: "Salt dissolves in water, sand is trapped on filter paper, and evaporating the filtrate recovers salt.",
    workedSolution: "Adding water dissolves the soluble sodium chloride (dissolution); filtering separates the insoluble sand residue (filtration); and evaporating the saline filtrate crystallizes pure dry salt.",
    points: 1
  },
  {
    number: 2,
    prompt: "In the human digestive system, which muscular tube conveys food boluses directly from the mouth cavity to the stomach?",
    correctAnswer: "The esophagus (gullet)",
    distractors: [
      "The large intestine (colon)",
      "The first part of small intestine (duodenum)",
      "The polygastric rumen"
    ],
    hint: "Pushes food downward through involuntary peristaltic muscular contractions.",
    workedSolution: "The esophagus (gullet) is the muscular conduit connecting the pharynx to the stomach, propelling food downward via coordinated peristaltic contractions.",
    points: 1
  },
  {
    number: 3,
    prompt: "In medical parasitology, the tropical human disease bilharziasis (urinary schistosomiasis) is caused by infection with a parasitic:",
    correctAnswer: "Blood fluke [Schistosoma haematobium]",
    distractors: [
      "Aquatic bloodworm",
      "Hepatic liver fluke [Fasciola]",
      "Intestinal roundworm [Ascaris]"
    ],
    hint: "A trematode parasite whose cercariae larvae penetrate human skin in freshwater.",
    workedSolution: "Bilharzia is caused by parasitic trematode blood flukes (*Schistosoma haematobium*), which infect veins of the bladder, causing hematuria.",
    points: 1
  },
  {
    number: 4,
    prompt: "Which of the following processes represents an irreversible chemical change in which an entirely new substance is formed?",
    correctAnswer: "Enzymatic hydrolysis of dietary starch by salivary amylase",
    distractors: [
      "Thermal melting of solid candle wax",
      "Dissolution of cane sugar in water",
      "Thermal boiling and vaporization of water"
    ],
    hint: "Salivary amylase breaks chemical glycosidic bonds to convert starch into maltose.",
    workedSolution: "Salivary digestion of starch into maltose is a chemical change involving enzymatic bond cleavage. Melting wax, dissolving sugar, and boiling water are reversible physical changes.",
    points: 1
  },
  {
    number: 5,
    prompt: "A neutral atom possesses 5 protons and 5 neutrons in its central nucleus. How many electrons are present in the neutral atom?",
    correctAnswer: "5 electrons",
    distractors: [
      "1 electron",
      "2 electrons",
      "9 electrons"
    ],
    hint: "In a neutral atom, the number of negatively charged electrons equals the number of positively charged protons.",
    workedSolution: "Neutral atoms have zero net electrical charge, so the number of orbiting electrons must equal the number of nuclear protons ($5\\text{ protons} = 5\\text{ electrons}$).",
    points: 1
  },
  {
    number: 6,
    prompt: "Which of the following structural adaptations in terrestrial plants is used primarily for defense against herbivorous animals?",
    correctAnswer: "Sharp leaf spines (or epidermal thorns and prickles)",
    distractors: [
      "Terminal vegetative buds",
      "Insect-capturing pitchers",
      "Subterranean tap roots"
    ],
    hint: "Sharp modified leaves that pierce browsing herbivores (e.g., in cacti and acacias).",
    workedSolution: "Leaf spines and thorns are sharp mechanical defense structures that deter herbivores from browsing on plant foliage. Pitchers are adapted for capturing insects.",
    points: 1
  },
  {
    number: 7,
    prompt: "In avian zoology, the ability of birds to achieve sustained aerodynamic flight depends fundamentally on possessing:",
    correctAnswer: "Lightweight hollow (pneumatic) bones and specialized flight feathers",
    distractors: [
      "Hollow pneumatic bones only without wing feathers",
      "Aerodynamic flight feathers only without skeletal adaptations",
      "General contour down feathers covering the body only"
    ],
    hint: "Combines a lightweight skeleton to minimize mass with aerodynamic wing surfaces for lift.",
    workedSolution: "Flight requires both pneumatic (hollow, air-filled) bones to reduce body weight and specialized flight feathers (remiges and rectrices) that generate lift and thrust.",
    points: 1
  },
  {
    number: 8,
    prompt: "In terms of the kinetic particle theory of matter, gases are significantly more compressible than solids because:",
    correctAnswer: "Gas molecules are separated by wide intermolecular empty spaces",
    distractors: [
      "Solids have rigid, hard macroscopic surfaces",
      "Gases possess fixed, definite physical volumes",
      "Particles in solids are arranged in regular crystalline lattices"
    ],
    hint: "Applying pressure easily forces widely spaced gas particles closer together.",
    workedSolution: "In gases, molecules are separated by large intermolecular distances; applying external pressure easily compresses particles closer together. Solids have tightly packed particles.",
    points: 1
  },
  {
    number: 9,
    prompt: "Which of the following statements regarding simple machines is/are SCIENTIFICALLY TRUE?\nI. The lever is the simplest and commonest of all machines\nII. The efficiency of a machine is the ratio of work output to work input\nIII. The efficiency of any practical machine is usually less than 100%\nIV. Machines make work easier and more convenient",
    correctAnswer: "I, II, III and IV",
    distractors: [
      "I only",
      "I and II only",
      "I and III only"
    ],
    hint: "All four statements accurately describe machine definition, efficiency, and real-world friction.",
    workedSolution: "All four statements are correct: levers are fundamental machines, $\\text{Efficiency} = \\frac{\\text{Output}}{\\text{Input}}$, friction keeps efficiency below 100%, and machines multiply force or speed.",
    points: 1
  },
  {
    number: 10,
    prompt: "Which chemical alkaline reagent reacts with solid ammonium chloride on heating to produce pungent ammonia gas?",
    correctAnswer: "Calcium hydroxide [Ca(OH)₂]",
    distractors: [
      "Neutral calcium chloride [CaCl₂]",
      "Insoluble calcium carbonate [CaCO₃]",
      "Calcium sulfate [CaSO₄]"
    ],
    hint: "A strong base reacts with ammonium salts to liberate ammonia gas: $\\text{Ca(OH)}_2 + 2\\text{NH}_4\\text{Cl} \\to \\text{CaCl}_2 + 2\\text{H}_2\\text{O} + 2\\text{NH}_3$.",
    workedSolution: "Ammonia is prepared by heating an ammonium salt with a base: $\\text{Ca(OH)}_{2(s)} + 2\\text{NH}_4\\text{Cl}_{(s)} \\xrightarrow{\\Delta} \\text{CaCl}_{2(s)} + 2\\text{H}_2\\text{O}_{(l)} + 2\\text{NH}_{3(g)}\\uparrow$.",
    points: 1
  },
  {
    number: 11,
    prompt: "Why are synthetic plastic polymers or wood fitted onto the handles of domestic metal cooking pots?",
    correctAnswer: "They are poor conductors of thermal heat (thermal insulators)",
    distractors: [
      "They possess high mechanical hardness",
      "They are aesthetically attractive and colorful",
      "They are easily washed with domestic water"
    ],
    hint: "Prevents heat from conducting from the hot metal pot to the user's hand.",
    workedSolution: "Plastics and wood are thermal insulators with very low thermal conductivity, preventing heat from conducting to the handle and protecting hands from burn injuries.",
    points: 1
  },
  {
    number: 12,
    prompt: "Which of the following chemical substances is alkaline/basic and will turn moist red litmus paper blue?",
    correctAnswer: "Aqueous sodium hydroxide solution (or limewater)",
    distractors: [
      "Dilute hydrochloric acid",
      "Neutral sodium chloride solution",
      "Dilute sulfuric acid"
    ],
    hint: "Bases turn red litmus paper blue; acids turn blue litmus paper red.",
    workedSolution: "Bases/alkalis turn red litmus paper blue ($pH > 7$). Sodium hydroxide and calcium hydroxide are alkaline. Hydrochloric and sulfuric acids turn blue litmus red.",
    points: 1
  },
  {
    number: 13,
    prompt: "Thermal heat energy emitted by the thermonuclear reactions in the Sun traverses the vacuum of space to reach Earth through:",
    correctAnswer: "Thermal electromagnetic radiation",
    distractors: [
      "Thermal convection currents",
      "Direct thermal conduction",
      "Both radiation and conduction"
    ],
    hint: "Radiation propagates across empty space without requiring a material medium.",
    workedSolution: "Conduction and convection require a material medium. Solar heat traverses the vacuum of interplanetary space as infrared electromagnetic radiation.",
    points: 1
  },
  {
    number: 14,
    prompt: "When living organisms die, the mineral salts locked in their bodies become recycled and available to the soil through:",
    correctAnswer: "Saprophytic microbial decomposition",
    distractors: [
      "Molecular diffusion alone",
      "Anaerobic yeast fermentation",
      "Downward soil leaching"
    ],
    hint: "Decomposers (bacteria and fungi) break down organic biomass into simple mineral ions.",
    workedSolution: "Saprophytic bacteria and fungi decompose organic remains, mineralizing complex tissues into inorganic nitrates, phosphates, and minerals that replenish soil fertility.",
    points: 1
  },
  {
    number: 15,
    prompt: "A ray of light strikes the surface of a flat plane mirror at an angle of 30° to the mirror surface. Determine the angle of reflection ($r$):",
    correctAnswer: "60°",
    distractors: [
      "30°",
      "90°",
      "120°"
    ],
    hint: "The normal is perpendicular ($90^\\circ$). Angle of incidence $$i = 90^\\circ - 30^\\circ = 60^\\circ$$. By reflection law, $$r = i$$.",
    workedSolution: "The angle between the ray and the surface is the glancing angle ($30^\\circ$). The angle of incidence is measured from the normal: $i = 90^\\circ - 30^\\circ = 60^\\circ$. Hence $r = i = 60^\\circ$.",
    points: 1
  },
  {
    number: 16,
    prompt: "In commercial salt manufacturing, solid sodium chloride is harvested from seawater in coastal salt pans primarily by:",
    correctAnswer: "Solar evaporation of water",
    distractors: [
      "Thermal boiling in closed retorts",
      "Vapor condensation",
      "Gravity decantation"
    ],
    hint: "Solar heat and coastal winds evaporate water, causing sea salt to crystallize.",
    workedSolution: "Commercial sea salt extraction relies on solar evaporation in shallow coastal lagoons, where solar heat evaporates water, leaving behind crystallized sodium chloride.",
    points: 1
  },
  {
    number: 17,
    prompt: "In human reproductive embryology, the single diploid cell resulting from the syngamic fertilization of an ovum by a spermatozoon is:",
    correctAnswer: "A zygote",
    distractors: [
      "A haploid gamete",
      "An unfertilized oocyte",
      "The maternal ovary"
    ],
    hint: "Formed immediately upon fusion of sperm and egg nuclei before cleavage begins.",
    workedSolution: "Fertilization unites the haploid sperm nucleus with the haploid ovum nucleus to form a single diploid zygote ($2n = 46$), which subsequently cleaves into an embryo.",
    points: 1
  },
  {
    number: 18,
    prompt: "In our Solar System, which recognized major planet possesses the smallest physical diameter and orbital radius?",
    correctAnswer: "Planet Mercury",
    distractors: [
      "Planet Earth",
      "Planet Jupiter",
      "Planet Mars"
    ],
    hint: "The innermost rocky planet closest to the Sun (Pluto is classified as a dwarf planet).",
    workedSolution: "Mercury is the smallest recognized major planet in the Solar System, with a diameter of ~4,879 km (Pluto was reclassified by the IAU as a dwarf planet in 2006).",
    points: 1
  },
  {
    number: 19,
    prompt: "In pedology, which of the following constituents represents the organic matter fraction of fertile agricultural topsoil?",
    correctAnswer: "Decomposed humus",
    distractors: [
      "Tropospheric soil air",
      "Dissolved mineral salts",
      "Weathered rock particles"
    ],
    hint: "Dark, amorphous organic material formed from decayed plant and animal tissues.",
    workedSolution: "Humus is the dark organic component of soil formed by the decomposition of plant and animal residues by microorganisms. Rock particles, water, and air are inorganic.",
    points: 1
  },
  {
    number: 20,
    prompt: "A vehicle headlamp illuminates brightly when connected to a secondary lead-acid battery. What form of energy is initially supplied by the battery?",
    correctAnswer: "Electrical energy (converted from internal chemical potential energy)",
    distractors: [
      "Direct chemical energy alone",
      "Thermal heat energy directly",
      "Visible light energy directly"
    ],
    hint: "Redox reactions inside the battery generate electromotive force to drive electrical current.",
    workedSolution: "A chemical battery transforms stored chemical potential energy into electrical energy, which flows through the circuit to illuminate the headlamp filament.",
    points: 1
  },
  {
    number: 21,
    prompt: "Which of the following statements regarding the biological nature of bacteria is SCIENTIFICALLY TRUE?",
    correctAnswer: "The vast majority of bacterial species are non-pathogenic decomposers harmless to humans",
    distractors: [
      "All human infections are caused exclusively by bacteria",
      "High-temperature sterilization fails to destroy bacteria",
      "Bacteria lack cellular DNA or ribosomes"
    ],
    hint: "Most bacteria are beneficial saprophytes, nitrogen fixers, or commensals; only a minority cause disease.",
    workedSolution: "Most bacteria are non-pathogenic decomposers, soil nitrifiers, or gut commensals essential for ecological cycles. Only a small fraction are pathogenic to humans.",
    points: 1
  },
  {
    number: 22,
    prompt: "Which of the following agricultural insect pests is an obligate piercing-and-sucking parasite on commercial cocoa trees?",
    correctAnswer: "The cocoa capsid bug [Distantiella theobroma]",
    distractors: [
      "The honeybee pollinator",
      "The adult citrus butterfly",
      "The predatory red ant"
    ],
    hint: "Pierces young cocoa shoots and pods with needle-like stylets to suck sap, causing dieback.",
    workedSolution: "Cocoa capsids (mirids) are piercing-and-sucking insect pests that suck sap from cocoa stems and pods, injecting toxic saliva that causes black lesions and cankers.",
    points: 1
  },
  {
    number: 23,
    prompt: "In vertebrate neuroanatomy, the Central Nervous System (CNS) is anatomically composed of the:",
    correctAnswer: "Brain and the spinal cord",
    distractors: [
      "Brain and the cranial nerves only",
      "Spinal cord and peripheral nerves only",
      "Brain, peripheral nerves, and the spinal cord"
    ],
    hint: "Enclosed in the cranium and vertebral column; peripheral nerves form the PNS.",
    workedSolution: "The Central Nervous System (CNS) comprises the brain and the spinal cord. Cranial and spinal nerves constitute the Peripheral Nervous System (PNS).",
    points: 1
  },
  {
    number: 24,
    prompt: "Which pair of human infectious diseases can be spread mechanically when exposed food is contaminated by domestic houseflies?",
    correctAnswer: "Cholera and bacterial dysentery",
    distractors: [
      "Cholera and Guinea worm disease",
      "Dysentery and Plasmodium malaria",
      "Malaria and pulmonary tuberculosis"
    ],
    hint: "Enteric diarrheal diseases spread via fecal-oral mechanical vectors onto uncovered food.",
    workedSolution: "Houseflies feed on fecal waste and mechanically transfer pathogens (*Vibrio cholerae*, *Shigella*) on their hairy legs and vomit onto food, transmitting cholera and dysentery.",
    points: 1
  },
  {
    number: 25,
    prompt: "Which of the following personal activities is a confirmed transmission route for the Human Immunodeficiency Virus (HIV/AIDS)?",
    correctAnswer: "Engaging in unprotected sexual intercourse with an infected person",
    distractors: [
      "Shaking hands with an infected person",
      "Sharing dining plates and food with an infected person",
      "Sharing casual laundered clothes with an infected person"
    ],
    hint: "Transmitted via infected body fluids (blood, semen, vaginal secretions, breast milk).",
    workedSolution: "HIV is transmitted through unprotected sexual intercourse, infected blood transfusions, shared needles, and mother-to-child transmission. Casual social contact does not transmit HIV.",
    points: 1
  },
  {
    number: 26,
    prompt: "An astronomical eclipse of the Moon (lunar eclipse) occurs in nature when:",
    correctAnswer: "Planet Earth moves directly between the Sun and the Moon in a straight line",
    distractors: [
      "The Moon moves directly between the Earth and the Sun",
      "The central Sun moves directly between the Earth and the Moon",
      "The Moon and Sun are situated on the same side of Earth"
    ],
    hint: "Earth casts its shadow (umbra) across the Moon; a solar eclipse occurs when the Moon blocks the Sun.",
    workedSolution: "A lunar eclipse occurs when the Earth passes directly between the Sun and the Moon (syzygy), casting Earth's shadow across the lunar surface during a Full Moon.",
    points: 1
  },
  {
    number: 27,
    prompt: "Indiscriminate spitting in public spaces is a dangerous public health habit primarily because it:",
    correctAnswer: "Releases pathogenic respiratory microorganisms into air and dust",
    distractors: [
      "Significantly raises atmospheric humidity in the environment",
      "Reduces the physiological volume of air in the lungs",
      "Causes severe dehydration and systemic water loss"
    ],
    hint: "Expels airborne pathogens like *Mycobacterium tuberculosis* in aerosolized saliva droplets.",
    workedSolution: "Spitting expels saliva containing viable respiratory pathogens (such as *Mycobacterium tuberculosis*), which dry into dust and spread airborne infections.",
    points: 1
  },
  {
    number: 28,
    prompt: "In angiosperm floral morphology, the male reproductive gametophytes (pollen grains) are produced and stored within the:",
    correctAnswer: "Pollen sacs inside the anther of the stamen",
    distractors: [
      "Slender floral filament",
      "Basal floral ovary",
      "Receptive apical stigma"
    ],
    hint: "The terminal pollen-producing organ of the stamen.",
    workedSolution: "Pollen grains containing male gametes are produced inside the pollen sacs of anthers (stamen). The ovary houses female ovules, and the stigma receives pollen.",
    points: 1
  },
  {
    number: 29,
    prompt: "Which of the following environmental substances represents an anthropogenic chemical pollutant when discharged untreated into waterways?",
    correctAnswer: "Untreated municipal domestic sewage and toxic industrial waste",
    distractors: [
      "Natural atmospheric water vapor fog",
      "Diatomic nitrogen gas [N₂]",
      "Diatomic oxygen gas [O₂]"
    ],
    hint: "Introduces harmful pathogens, synthetic chemicals, and heavy metals into ecosystems.",
    workedSolution: "Untreated sewage and industrial effluents introduce chemical contaminants and fecal pathogens that degrade water quality and harm ecosystems, acting as pollutants.",
    points: 1
  },
  {
    number: 30,
    prompt: "In the human digestive tract, the chemical enzymatic digestion of dietary proteins initiates in the:",
    correctAnswer: "Stomach (by gastric pepsin in hydrochloric acid)",
    distractors: [
      "First part of small intestine (duodenum)",
      "Muscular gullet (esophagus)",
      "Buccal mouth cavity"
    ],
    hint: "Gastric juice contains pepsinogen, activated by $\\text{HCl}$ to hydrolyze proteins into peptides.",
    workedSolution: "Protein digestion begins in the stomach, where pepsin in gastric juice hydrolyzes protein polymers into shorter peptide chains. Starch digestion begins in the mouth.",
    points: 1
  },
  {
    number: 31,
    prompt: "The central thermonuclear Sun together with all eight orbiting planets, dwarf planets, moons, and asteroids constitute the:",
    correctAnswer: "Solar System",
    distractors: [
      "Tropospheric atmosphere",
      "Milky Way Galaxy in its entirety",
      "Local star constellation"
    ],
    hint: "Our heliocentric planetary system centered on the Sun.",
    workedSolution: "The Solar System consists of the Sun and all celestial bodies gravitationally bound to it, including the eight planets, dwarf planets, moons, comets, and asteroids.",
    points: 1
  },
  {
    number: 32,
    prompt: "Which of the following agricultural practices accelerates topsoil erosion and land degradation?",
    correctAnswer: "Clear-felling protective tree canopies along sloping hillsides",
    distractors: [
      "Planting cover crops on bare exposed ground",
      "Establishing permanent pasture grasses along slopes",
      "Contour ploughing and terracing across slope contours"
    ],
    hint: "Clearing trees removes root binding and canopy interception, accelerating runoff scouring.",
    workedSolution: "Clearing trees on slopes removes root binding and canopy protection, exposing topsoil directly to raindrop impact and rapid runoff erosion. Terracing prevents erosion.",
    points: 1
  },
  {
    number: 33,
    prompt: "Which of the following metallic substances is an alloy composed of two or more elements melted together?",
    correctAnswer: "Commercial brass",
    distractors: [
      "Pure aluminum [Al]",
      "Pure copper [Cu]",
      "Pure iron [Fe]"
    ],
    hint: "A solid mixture of Copper and Zinc; aluminum, copper, and iron are elemental metals.",
    workedSolution: "Brass is an alloy composed of Copper ($\text{Cu}$) and Zinc ($\text{Zn}$). Aluminum, copper, and iron are pure chemical elements.",
    points: 1
  },
  {
    number: 34,
    prompt: "Which of the following biological statements concerning autotrophic green plants is SCIENTIFICALLY TRUE?",
    correctAnswer: "Green plants synthesize their own organic food using radiant solar energy [Statement II]",
    distractors: [
      "Most plants exhibit rapid locomotion from place to place [Statement I]",
      "All animals feed directly and exclusively on green plants [Statement III]",
      "Plants lack cellular respiration"
    ],
    hint: "Green plants are photoautotrophs; carnivores do not feed directly on plants.",
    workedSolution: "Statement II is correct: green plants are autotrophs that manufacture glucose via photosynthesis. Plants do not show locomotion, and carnivores feed on other animals.",
    points: 1
  },
  {
    number: 35,
    prompt: "Which of the following biological vector control practices effectively destroys the aquatic breeding grounds and larvae of mosquitoes?",
    correctAnswer: "Introducing larvivorous fish (such as Tilapia or Gambusia) into ponds",
    distractors: [
      "Sleeping under insecticide-treated bed nets (ITNs)",
      "Spraying space insecticides inside bedrooms",
      "Applying topical chemical insect repellents to skin"
    ],
    hint: "Biological predation: larvivorous fish consume aquatic mosquito larvae and pupae.",
    workedSolution: "Introducing larvivorous fish into ponds is a biological control method where fish feed on aquatic mosquito larvae and pupae, eliminating breeding grounds.",
    points: 1
  },
  {
    number: 36,
    prompt: "When a plastic pen is rubbed vigorously against dry hair, it attracts small scraps of paper. What force is responsible for this attraction?",
    correctAnswer: "Electrostatic force",
    distractors: [
      "Mechanical frictional resistance",
      "Universal gravitational force",
      "Magnetic dipole attraction"
    ],
    hint: "Friction transfers electrons, giving the pen an electric charge that polarizes and attracts paper.",
    workedSolution: "Rubbing the pen transfers electrons by friction, giving the plastic an electrostatic charge. The charged pen induces an opposite charge on paper scraps, attracting them.",
    points: 1
  },
  {
    number: 37,
    prompt: "When gaseous carbon dioxide is bubbled through clear aqueous limewater [$\\text{Ca(OH)}_2$], the observable change is that:",
    correctAnswer: "The clear solution turns milky/cloudy due to insoluble calcium carbonate precipitate",
    distractors: [
      "The limewater becomes boiling hot with bubbles",
      "The solution remains completely clear and transparent",
      "A bright yellow sulfur precipitate is formed"
    ],
    hint: "$$\\text{Ca(OH)}_2 + \\text{CO}_2 \\to \\text{CaCO}_3\\downarrow + \\text{H}_2\\text{O}$$.",
    workedSolution: "Carbon dioxide reacts with limewater to precipitate white, insoluble calcium carbonate: $\\text{Ca(OH)}_{2(aq)} + \\text{CO}_{2(g)} \\to \\text{CaCO}_{3(s)}\\downarrow + \\text{H}_2\\text{O}_{(l)}$, turning the solution milky.",
    points: 1
  },
  {
    number: 38,
    prompt: "Which of the following organic solids has a low melting point and melts easily into a liquid when exposed to sunny heat?",
    correctAnswer: "Animal fat (or solid butter / candle wax)",
    distractors: [
      "Hard thermosetting plastics",
      "Vulcanized vehicle tyre rubber",
      "Solid quartz stone"
    ],
    hint: "Lipids have relatively weak intermolecular forces and melt into liquid oils at mild temperatures ($35-45^\\circ\\text{C}$).",
    workedSolution: "Animal fats and butter are lipid mixtures with low melting points ($35-45^\\circ\\text{C}$) that liquefy into oils under solar heat. Cured plastics and vulcanized rubber do not melt easily.",
    points: 1
  },
  {
    number: 39,
    prompt: "In the optical system of the human eye, which muscular structure regulates the diameter of the pupil to control light entry?",
    correctAnswer: "The colored iris",
    distractors: [
      "The vascular choroid layer",
      "The anterior curved cornea",
      "The biconvex crystalline lens"
    ],
    hint: "Smooth circular and radial muscles constrict or dilate the pupil.",
    workedSolution: "The iris contains smooth muscles that dilate the pupil in dim light and constrict it in bright light, regulating the amount of light reaching the retina.",
    points: 1
  },
  {
    number: 40,
    prompt: "In agricultural crop rotation cycles, leguminous crops (such as cowpeas and groundnuts) are cultivated primarily to:",
    correctAnswer: "Increase the plant-available nitrate content of the soil",
    distractors: [
      "Add large quantities of decomposed humus directly",
      "Secrete concentrated animal protein into topsoil",
      "Convert heavy clay soil into sandy loam"
    ],
    hint: "Root nodules house symbiotic *Rhizobium* bacteria that fix atmospheric nitrogen gas.",
    workedSolution: "Legumes harbor symbiotic *Rhizobium* bacteria in their root nodules that fix atmospheric nitrogen into nitrates, enriching soil fertility naturally.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199906);

export const balancedScience1999P1 = rawScienceBank.map((q, idx) => {
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
export const paper2Science1999Questions: Paper2Question[] = [
  // ==========================================
  // QUESTION 1: ORGANS, CLIMATE, WORK/POWER & SEPARATION (20 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `State one vital physiological function performed by each of the following human anatomical organs:
(i) Skin;
(ii) Lungs;
(iii) Kidneys;
(iv) Testes.`,
        workedSolution: `Organ Functions:
• (i) Skin: Excretes sweat (containing water, mineral salts, and traces of urea) and regulates body temperature through evaporative cooling.
• (ii) Lungs: Facilitate external gaseous exchange, absorbing oxygen into blood and eliminating carbon dioxide and water vapor.
• (iii) Kidneys: Filter metabolic waste products (urea, uric acid) from blood plasma to form urine and maintain blood osmoregulation.
• (iv) Testes: Produce male gametes (spermatozoa) via spermatogenesis and synthesize the male sex hormone testosterone.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: `(i) What is vegetative reproduction in plant agriculture?
(ii) Name two cultivated agricultural crop plants that reproduce vegetatively.`,
        workedSolution: `(i) Definition of vegetative reproduction:
A form of asexual reproduction in flowering plants where a new plant develops directly from vegetative organs (such as stems, roots, or leaves) without the involvement of flowers, seeds, or gametic fertilization.

(ii) Examples of plants:
1. **Cassava** (propagated by stem cuttings)
2. **Plantain / Banana** (propagated by suckers)
3. **Sweet potato** (propagated by vine cuttings / root tubers)
4. **Sugar cane** (propagated by stem setts)`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "Name four principal physical and geographical factors that determine the climate of a region on Earth.",
        workedSolution: `1. **Latitude:** Distance from the Equator, determining the angle of incidence and intensity of solar insolation.
2. **Altitude (Elevation):** Height above sea level; temperature drops with increasing elevation at the environmental lapse rate.
3. **Distance from the Sea (Continentality):** Proximity to large water bodies moderates seasonal temperature extremes and influences humidity.
4. **Prevailing Wind Systems and Air Masses:** Winds transport moisture or dry harmattan dust across landmasses.
5. **Ocean Currents:** Warm ocean currents raise coastal temperatures and precipitation; cold currents lower temperatures and cause fog/deserts.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: `In physical mechanics, define each of the following quantities, stating their respective S.I. units:
(i) Mechanical work;
(ii) Power.`,
        workedSolution: `(i) Mechanical work:
• Definition: Work is done whenever an applied force moves an object through a displacement distance in the direction of the force:
$$W = F \\times d$$
• S.I. Unit: **Joule [J]** (or Newton-meter, $\\text{N m}$)

(ii) Power:
• Definition: The time rate at which mechanical work is done or energy is transformed:
$$P = \\frac{W}{t}$$
• S.I. Unit: **Watt [W]** (or Joule per second, $\\text{J s}^{-1}$)`,
        maxMarks: 4
      },
      {
        subId: "(e)",
        prompt: `Name the specific physical separation method utilized in the industrial or domestic production of each of the following substances:
(i) Local gin (*akpeteshie*) from fermented palm wine;
(ii) Solid table salt from seawater;
(iii) Potable municipal tap water from muddy river water.`,
        workedSolution: `Separation Methods:
• (i) *Akpeteshie* (alcohol): **Fractional distillation** (or simple distillation)
• (ii) Common salt: **Solar evaporation** (or crystallization)
• (iii) Tap water: **Sedimentation, sand filtration, and chlorination disinfection**`,
        maxMarks: 4
      }
    ]
  },

  // ==========================================
  // QUESTION 2: GAS TESTING, IONS, CAPILLARITY & LEVERS (20 MARKS)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Describe a simple laboratory experiment to demonstrate that exhaled (expired) human breath contains carbon dioxide gas:

${svgQ2aExpiredAirTest}`,
        workedSolution: `Experiment to demonstrate CO₂ in expired air (refer to vector schematic):
1. **Apparatus:** A test tube, a clean glass drinking straw, and freshly prepared clear limewater (aqueous calcium hydroxide solution, $\\text{Ca(OH)}_2$).
2. **Procedure:**
   • Pour approximately $10.0\\text{ cm}^3$ of clear limewater into the test tube.
   • Insert the drinking straw into the limewater and gently exhale breath through the straw into the liquid for 1 to 2 minutes.
3. **Observation:** The clear limewater gradually turns milky and cloudy due to the formation of a fine white precipitate of calcium carbonate:
$$\\text{Ca(OH)}_{2(aq)} + \\text{CO}_{2(g)} \\to \\text{CaCO}_{3(s)}\\downarrow + \\text{H}_2\\text{O}_{(l)}$$
4. **Conclusion:** The milky appearance confirms that expired human air contains carbon dioxide gas released during cellular respiration.`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: `(i) What is an ion in chemistry?
(ii) Give two specific chemical examples of ions, stating their formula and electrical charge.`,
        workedSolution: `(i) Definition of an ion:
An electrically charged chemical particle (atom or group of bonded atoms) formed when a neutral atom loses or gains one or more valence electrons.

(ii) Examples of ions:
1. **Sodium cation:** $\\text{Na}^+$ (carries a $+1$ charge, formed by losing 1 electron)
2. **Chloride anion:** $\\text{Cl}^-$ (carries a $-1$ charge, formed by gaining 1 electron)
*(Alternatives: $\\text{Ca}^{2+}$, $\\text{Mg}^{2+}$, $\\text{O}^{2-}$, $\\text{SO}_4^{2-}$)*`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: `(i) What is meant by capillary action (capillarity)?
(ii) State two practical everyday processes that rely on capillary action.`,
        workedSolution: `(i) Definition of capillarity:
The spontaneous rise or depression of a liquid inside narrow-bore capillary tubes or porous media as a result of the relative balance between adhesive forces (liquid to tube wall) and cohesive forces (liquid to liquid).

(ii) Processes using capillary action:
1. Liquid kerosene ascending the cotton wick of a storm lantern.
2. Blotting paper, paper towels, or cotton bath towels soaking up water spills.
3. Capillary ascent of soil moisture and dissolved mineral ions from roots up through plant stem xylem vessels.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: `(i) What is a mechanical lever in simple machines?
(ii) Give two practical examples of second-class levers used in daily life:

${svgQ2dSecondClassLever}`,
        workedSolution: `(i) Definition of a lever:
A simple machine consisting of a rigid bar that is free to turn or pivot about a fixed support point (fulcrum), used to transmit or multiply mechanical force.

(ii) Examples of second-class levers (refer to vector schematic):
In a Class 2 lever, the load resistance is located between the fulcrum and the effort:
1. **Builder's wheelbarrow**
2. **Crown-cap bottle opener**
3. **Nutcracker**
4. **Paper guillotine / paper cutter**`,
        maxMarks: 4
      },
      {
        subId: "(e)",
        prompt: `(i) Using any three of the following organisms, construct a valid biological grazing food chain:
**Rat, Hawk, Okro leaves, Toad, Cassava, Man, Grasshopper.**
(ii) List three daily personal hygiene practices for keeping the teeth and oral cavity healthy.`,
        workedSolution: `(i) Grazing Food Chain (any valid 3-step sequence):
$$\\text{Cassava / Okro leaves (Producer)} \\to \\text{Grasshopper (Primary Consumer)} \\to \\text{Toad (Secondary Consumer)}$$
*OR:*
$$\\text{Cassava (Producer)} \\to \\text{Rat (Primary Consumer)} \\to \\text{Hawk (Secondary Consumer)}$$

(ii) Three practices for oral dental hygiene:
1. Brushing the teeth thoroughly twice daily (morning and before bedtime) using fluoride toothpaste and a soft toothbrush.
2. Rinsing the mouth with clean water or mouthwash after every meal to clear food residues.
3. Avoiding excessive consumption of sugary confections, toffees, and acidic carbonated sodas.
4. Visiting a dental clinic for regular professional dental check-ups.`,
        maxMarks: 4
      }
    ]
  },

  // ==========================================
  // QUESTION 3: MASTICATION, DIGESTIVE TRACT, IRON SULFIDE & WORK (20 MARKS)
  // ==========================================
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) Describe briefly the mechanical and chemical processes that occur to a morsel of starchy kenkey in the mouth during eating.
(ii) List in sequential order the anatomical parts of the human alimentary canal through which food travels from ingestion to egestion.`,
        workedSolution: `(i) Processes occurring in the mouth:
• Mechanical processing: Teeth (incisors, canines, premolars, molars) bite, chew, and crush the solid kenkey into smaller particles, significantly increasing its surface area. The tongue rolls the food and mixes it thoroughly with saliva into a moist, lubricated bolus.
• Chemical processing: Saliva secreted by salivary glands provides the enzyme **salivary amylase (ptyalin)**, which hydrolyzes cooked starch polysaccharides into soluble, sweet-tasting **maltose** disaccharides under slightly alkaline/neutral pH.

(ii) Sequential order of digestive parts:
$$\\text{Mouth} \\to \\text{Pharynx} \\to \\text{Esophagus (Gullet)} \\to \\text{Stomach} \\to \\text{Small Intestine (Duodenum & Ileum)} \\to \\text{Large Intestine (Colon)} \\to \\text{Rectum} \\to \\text{Anus}$$`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `A dry mixture of gray iron filings and yellow sulfur powder is heated strongly in a hard glass test tube:

${svgQ3bIronSulfurReaction}

(i) State the chemical name of the new compound formed.
(ii) Write a balanced chemical equation for the reaction that took place.
(iii) State two practical everyday methods used to protect iron articles from rusting.`,
        workedSolution: `(i) Compound formed (refer to vector schematic):
**Iron (II) sulfide** [$\\text{FeS}$] (a black, non-magnetic solid).

(ii) Balanced chemical equation:
$$\\text{Fe}_{(s)} + \\text{S}_{(s)} \\xrightarrow{\\Delta} \\text{FeS}_{(s)}$$

(iii) Methods to prevent rusting:
1. **Painting:** Applying a protective coat of anti-rust paint to prevent oxygen and water from reaching the iron.
2. **Greasing / Oiling:** Coating moving metal machine parts with oil or grease to form a protective barrier against moisture.
3. **Galvanizing:** Coating iron or steel with a sacrificial layer of metallic zinc.
4. **Electroplating:** Plating iron with a thin layer of non-corrosive metal (chromium, nickel, or tin).`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `(i) A boy pulls a heavy box across a horizontal floor through a distance of $5.0\\text{ m}$. If he exerts a constant pulling force of $15.0\\text{ N}$ in the direction of motion, calculate the work done.
(ii) Convert the following weights expressed in kilogram-force (kgf) into Newtons (N):
  (α) $0.75\\text{ kgf}$;
  (β) $1.33\\text{ kgf}$.
$$[\\text{Take } 1\\text{ kgf} = 10.0\\text{ N}]$$`,
        workedSolution: `(i) Work calculation:
Formula:
$$\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (d)$$
Substitute given values ($F = 15.0\\text{ N}$, $d = 5.0\\text{ m}$):
$$W = 15.0\\text{ N} \\times 5.0\\text{ m} = 75.0\\text{ Joules (J)}$$
Answer: The work done is $$75.0\\text{ J}$$.

(ii) Weight conversions:
• (α) $0.75\\text{ kgf} = 0.75 \\times 10.0\\text{ N} = 7.50\\text{ Newtons (N)}$
• (β) $1.33\\text{ kgf} = 1.33 \\times 10.0\\text{ N} = 13.30\\text{ Newtons (N)}$`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: "State two differences between a physical change and a chemical change.",
        workedSolution: `Physical vs. Chemical Change:
1. **Formation of New Substances:** In a physical change, no new substance is formed (only physical state or appearance changes); in a chemical change, one or more entirely new substances with different properties are formed.
2. **Reversibility:** Physical changes are easily reversible by physical means (e.g., freezing and melting water); chemical changes are permanent and cannot be reversed by simple physical methods.
3. **Energy Changes:** Physical changes involve relatively small heat exchanges; chemical changes involve substantial absorption or evolution of energy.`,
        maxMarks: 4
      }
    ]
  },

  // ==========================================
  // QUESTION 4: RESPIRATION, CHOLERA, ASTRONOMY & DENSITY (20 MARKS)
  // ==========================================
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) State two scientific reasons which indicate that aerobic cellular respiration and combustion (burning) are fundamentally similar processes.
(ii) In plant botany, what is meant by cross-pollination?
(iii) List four public health measures by which an outbreak of cholera can be controlled and prevented in a community.`,
        workedSolution: `(i) Similarities between respiration and burning:
1. Both processes consume and require **molecular oxygen gas** ($\\text{O}_2$) as a chemical oxidizer.
2. Both processes produce **carbon dioxide** ($\\text{CO}_2$) and **water** ($\\text{H}_2\\text{O}$) as chemical byproducts.
3. Both processes are **exothermic reactions** that break chemical bonds in organic compounds to release energy.

(ii) Definition of cross-pollination:
The transfer of mature pollen grains from the anther of a flower on one plant to the receptive stigma of a flower on a different plant of the same botanical species.

(iii) Cholera prevention measures:
1. Drinking only boiled or chemically chlorinated potable water.
2. Washing hands thoroughly with soap under clean running water before preparing food, before eating, and after using the toilet.
3. Safe and sanitary disposal of human fecal waste in flush or pit latrines, completely avoiding open defecation.
4. Keeping food properly covered to exclude houseflies and eating freshly cooked, hot meals.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) Name the three coldest major planets in our Solar System.
(ii) State one clear astronomical reason that accounts for the extreme coldness of these planets.
(iii) A solid object of mass $150.0\\text{ g}$ occupies a physical volume of $250.0\\text{ cm}^3$. Calculate the density of the object.`,
        workedSolution: `(i) Three coldest planets:
**Uranus**, **Neptune**, and **Saturn** *(or dwarf planet Pluto)*.

(ii) Reason for extreme coldness:
These planets are located at immense distances from the Sun (the outer Solar System), receiving negligible radiant solar thermal flux per unit surface area.

(iii) Density calculation:
Formula:
$$\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)}$$
Substitute given values ($m = 150.0\\text{ g}$, $V = 250.0\\text{ cm}^3$):
$$\\rho = \\frac{150.0\\text{ g}}{250.0\\text{ cm}^3} = 0.60\\text{ g cm}^{-3}$$
Answer: The density of the object is $$0.60\\text{ g cm}^{-3}$$.`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `Name a suitable chemical solvent for dissolving each of the following substances:
(i) Heavy engine grease;
(ii) Oil-based gloss paint;
(iii) Pure ethanol alcohol;
(iv) Granulated cane sugar.`,
        workedSolution: `Suitable Solvents:
• (i) Engine grease: **Petrol / Kerosene / Diesel** (non-polar hydrocarbon solvent)
• (ii) Oil-based paint: **Mineral turpentine (paint thinner) / Kerosene**
• (iii) Alcohol: **Water [H₂O]** (completely miscible polar liquid)
• (iv) Cane sugar: **Water [H₂O]**`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "State two distinct biological characteristics that distinguish living organisms from non-living matter.",
        workedSolution: `1. **Cellular Organization and Protoplasm:** Living organisms are composed of living, metabolizing protoplasm organized into membrane-bound cells, whereas non-living matter is non-cellular.
2. **Metabolic Life Processes:** Living organisms carry out life processes: cellular respiration to liberate energy, active excretion of toxic wastes, irritability to environmental stimuli, and reproduction to produce offspring.`,
        maxMarks: 2
      }
    ]
  }
];

export const SET_BECE_1999_SCIENCE_P1 = {
  id: "paper_1999_variant_p1",
  year: 1999,
  isVariant: true,
  setNumber: 131,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  title: "Paper 1: Objective Test (Variant)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedScience1999P1
};

export const SET_BECE_1999_SCIENCE_P2 = {
  id: "paper_1999_variant_p2",
  year: 1999,
  isVariant: true,
  setNumber: 131,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  title: "Paper 2: Practical & Theory Essay (Variant)",
  durationMinutes: 75,
  instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 4,
  questions: paper2Science1999Questions
};

export const SET_BECE_1999_SCIENCE_COMPLETE = {
  year: 1999,
  isVariant: true,
  setNumber: 131,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: {
    title: "Paper 1: Objective Test (Variant)",
    durationMinutes: 45,
    totalQuestions: 40,
    questions: balancedScience1999P1
  },
  paper2: {
    title: "Paper 2: Practical & Theory Essay (Variant)",
    durationMinutes: 75,
    instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
    totalQuestions: 4,
    questions: paper2Science1999Questions
  },
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 3,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
