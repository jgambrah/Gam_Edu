/**
 * JHS Curriculum Data - Set 126
 * 1994 BECE Integrated Science Complete Variant (Paper 1 & Paper 2)
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

export const svgQ3aLeverStone = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 180' width='100%' height='165' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Fulcrum Pivot Triangle at 80 cm from Effort -->
    <polygon points='260,95 240,140 280,140' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/>
    <circle cx='260' cy='95' r='3.5' fill='#ffffff'/>
    <text x='260' y='155' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Pivot (Fulcrum)</text>

    <!-- Rigid 100 cm Lever Beam -->
    <rect x='40' y='90' width='280' height='10' rx='2' fill='#475569' stroke='#cbd5e1' stroke-width='1.5'/>

    <!-- Effort Force on Far Left (0 cm mark) -->
    <line x1='50' y1='40' x2='50' y2='90' stroke='#10b981' stroke-width='2.5'/>
    <polygon points='46,82 50,92 54,82' fill='#10b981'/>
    <text x='50' y='30' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>Effort</text>

    <!-- Heavy Stone Load on Far Right (100 cm mark) -->
    <ellipse cx='305' cy='75' rx='16' ry='15' fill='#64748b' stroke='#cbd5e1' stroke-width='1.8'/>
    <text x='305' y='52' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>Stone Load</text>
    <line x1='305' y1='90' x2='305' y2='130' stroke='#ef4444' stroke-width='2.5'/>
    <polygon points='301,122 305,132 309,122' fill='#ef4444'/>

    <!-- Dimension Lines: Effort Arm = 80 cm, Load Arm = 20 cm -->
    <line x1='50' y1='108' x2='260' y2='108' stroke='#10b981' stroke-width='1.5'/>
    <text x='155' y='122' font-size='10' font-weight='bold' fill='#10b981' text-anchor='middle'>Effort arm = 80 cm</text>

    <line x1='260' y1='108' x2='305' y2='108' stroke='#ef4444' stroke-width='1.5'/>
    <text x='285' y='122' font-size='9' font-weight='bold' fill='#ef4444' text-anchor='middle'>20 cm</text>

    <text x='190' y='172' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>TOTAL BAR LENGTH = 100 cm; LOAD DISTANCE = 100 - 80 = 20 cm</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

export const svgQ4cDCSeriesParallel = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Circuit 1: Two Cells in Series (Left) -->
    <g transform='translate(20, 20)'>
      <rect width='155' height='175' rx='4' fill='none' stroke='#334155' stroke-dasharray='2,2'/>
      <text x='77' y='15' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Two Cells in Series</text>

      <!-- Top Loop with Two Cells -->
      <line x1='20' y1='45' x2='50' y2='45' stroke='#38bdf8' stroke-width='2'/>
      <!-- Cell 1 -->
      <line x1='50' y1='32' x2='50' y2='58' stroke='#10b981' stroke-width='2'/>
      <line x1='56' y1='38' x2='56' y2='52' stroke='#ef4444' stroke-width='3.5'/>
      <!-- Cell 2 -->
      <line x1='66' y1='32' x2='66' y2='58' stroke='#10b981' stroke-width='2'/>
      <line x1='72' y1='38' x2='72' y2='52' stroke='#ef4444' stroke-width='3.5'/>
      <line x1='72' y1='45' x2='135' y2='45' stroke='#38bdf8' stroke-width='2'/>
      
      <!-- Right Wire with Switch -->
      <line x1='135' y1='45' x2='135' y2='80' stroke='#38bdf8' stroke-width='2'/>
      <circle cx='135' cy='80' r='2' fill='#e2e8f0'/>
      <line x1='135' y1='80' x2='148' y2='92' stroke='#e2e8f0' stroke-width='2'/>
      <circle cx='135' cy='105' r='2' fill='#e2e8f0'/>
      <text x='152' y='88' font-size='8' font-weight='bold' fill='#e2e8f0'>Key</text>
      <line x1='135' y1='105' x2='135' y2='145' stroke='#38bdf8' stroke-width='2'/>

      <!-- Bottom Wire with Bulb -->
      <line x1='135' y1='145' x2='90' y2='145' stroke='#38bdf8' stroke-width='2'/>
      <circle cx='77' cy='145' r='11' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/>
      <path d='M 70 152 L 77 138 L 84 152' stroke='#f59e0b' stroke-width='1.5' fill='none'/>
      <text x='77' y='168' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Bulb</text>
      <line x1='65' y1='145' x2='20' y2='145' stroke='#38bdf8' stroke-width='2'/>
      <line x1='20' y1='145' x2='20' y2='45' stroke='#38bdf8' stroke-width='2'/>
    </g>

    <!-- Circuit 2: Two Cells in Parallel (Right) -->
    <g transform='translate(200, 20)'>
      <rect width='155' height='175' rx='4' fill='none' stroke='#334155' stroke-dasharray='2,2'/>
      <text x='77' y='15' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>Two Cells in Parallel</text>

      <!-- Parallel Battery Bank -->
      <line x1='20' y1='45' x2='50' y2='45' stroke='#38bdf8' stroke-width='2'/>
      <line x1='50' y1='30' x2='50' y2='60' stroke='#38bdf8' stroke-width='2'/>
      <!-- Cell Branch 1 (Top) -->
      <line x1='50' y1='30' x2='65' y2='30' stroke='#38bdf8' stroke-width='1.5'/>
      <line x1='65' y1='22' x2='65' y2='38' stroke='#10b981' stroke-width='2'/>
      <line x1='71' y1='25' x2='71' y2='35' stroke='#ef4444' stroke-width='3.5'/>
      <line x1='71' y1='30' x2='85' y2='30' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Cell Branch 2 (Bottom) -->
      <line x1='50' y1='60' x2='65' y2='60' stroke='#38bdf8' stroke-width='1.5'/>
      <line x1='65' y1='52' x2='65' y2='68' stroke='#10b981' stroke-width='2'/>
      <line x1='71' y1='55' x2='71' y2='65' stroke='#ef4444' stroke-width='3.5'/>
      <line x1='71' y1='60' x2='85' y2='60' stroke='#38bdf8' stroke-width='1.5'/>
      <line x1='85' y1='30' x2='85' y2='60' stroke='#38bdf8' stroke-width='2'/>
      <line x1='85' y1='45' x2='135' y2='45' stroke='#38bdf8' stroke-width='2'/>

      <!-- Right Wire with Switch -->
      <line x1='135' y1='45' x2='135' y2='80' stroke='#38bdf8' stroke-width='2'/>
      <circle cx='135' cy='80' r='2' fill='#e2e8f0'/>
      <line x1='135' y1='80' x2='148' y2='92' stroke='#e2e8f0' stroke-width='2'/>
      <circle cx='135' cy='105' r='2' fill='#e2e8f0'/>
      <text x='152' y='88' font-size='8' font-weight='bold' fill='#e2e8f0'>Key</text>
      <line x1='135' y1='105' x2='135' y2='145' stroke='#38bdf8' stroke-width='2'/>

      <!-- Bottom Wire with Bulb -->
      <line x1='135' y1='145' x2='90' y2='145' stroke='#38bdf8' stroke-width='2'/>
      <circle cx='77' cy='145' r='11' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/>
      <path d='M 70 152 L 77 138 L 84 152' stroke='#f59e0b' stroke-width='1.5' fill='none'/>
      <text x='77' y='168' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Bulb</text>
      <line x1='65' y1='145' x2='20' y2='145' stroke='#38bdf8' stroke-width='2'/>
      <line x1='20' y1='145' x2='20' y2='45' stroke='#38bdf8' stroke-width='2'/>
    </g>

    <text x='190' y='215' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>COMPARISON: SERIES CELLS DELIVER 2V; PARALLEL CELLS DELIVER V WITH EXTENDED LIFE</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// ==========================================
// 40 OBJECTIVE TEST QUESTIONS (RAW BANK)
// ==========================================
interface RawQuestionItem {
  number: number;
  prompt: string;
  correctAnswer: string;
  distractors: string[];
  hint: string;
  workedSolution: string;
  points: number;
}

const rawScienceBank: RawQuestionItem[] = [
  {
    number: 1,
    prompt: "Which of the following common substances can exist in thermodynamic equilibrium across all three states of matter (solid, liquid, gas) around 0°C?",
    correctAnswer: "Liquid milk / Pure water",
    distractors: [
      "Volatile commercial petrol",
      "Liquid vegetable palm oil",
      "Pure ethanol alcohol"
    ],
    hint: "Water ice melts and water vaporizes around 0°C at its triple point.",
    workedSolution: "Water (and aqueous milk) exhibits ice (solid), liquid water, and water vapor in equilibrium near 0°C (at its triple point). Petrol, palm oil, and alcohol have vastly different freezing/boiling points.",
    points: 1
  },
  {
    number: 2,
    prompt: "In astronomical planetary science, why does dwarf planet Pluto appear extremely dark and faint when observed from Earth?",
    correctAnswer: "It is located at the distant cryogenic outer fringe of the Solar System, receiving negligible sunlight",
    distractors: [
      "It is significantly larger in volume than the Sun",
      "It is the largest rocky terrestrial planet in the Solar System",
      "Its surface is composed exclusively of light-absorbing black carbon"
    ],
    hint: "Pluto orbits approximately 40 astronomical units away from the Sun.",
    workedSolution: "Pluto is located nearly 6 billion kilometers from the Sun, where radiant solar flux is thousands of times weaker than on Earth, rendering its icy surface dark and cold.",
    points: 1
  },
  {
    number: 3,
    prompt: "In human reproductive embryology, the biological entity formed following the mitotic cleavage of a fertilized ovum is:",
    correctAnswer: "The developing embryo",
    distractors: [
      "The maternal ovary organ",
      "An unfertilized fertile ovum",
      "The temporary vascular placenta"
    ],
    hint: "The multicelled developmental stage that implants into the uterine endometrium.",
    workedSolution: "Upon fertilization, the single-celled zygote undergoes mitotic division to form a morula and blastocyst, developing into an embryo before advancing to the fetal stage.",
    points: 1
  },
  {
    number: 4,
    prompt: "Which of the following physical arrangements correctly defines a second-class mechanical lever?",
    correctAnswer: "The load resistance is situated between the fulcrum (pivot) and the applied effort",
    distractors: [
      "The fulcrum is situated between the applied effort and the load",
      "The applied effort is situated between the fulcrum and the load",
      "There is no fixed turning pivot fulcrum present"
    ],
    hint: "Think of a builder's wheelbarrow or a nutcracker: load is in the center.",
    workedSolution: "In a Class 2 lever, the load is located between the fulcrum and the effort force (e.g., wheelbarrow, nutcracker, bottle opener), yielding a mechanical advantage greater than 1.",
    points: 1
  },
  {
    number: 5,
    prompt: "Which of the following clinical human diseases is classified as a non-communicable, non-contagious internal medical condition?",
    correctAnswer: "Lobar pneumonia (acute lung tissue inflammation)",
    distractors: [
      "Smallpox viral infection",
      "Chickenpox viral infection",
      "Epidemic influenza virus"
    ],
    hint: "Smallpox, chickenpox, and influenza are highly contagious airborne infections.",
    workedSolution: "Influenza, smallpox, and chickenpox are highly contagious communicable viral diseases. Lobar pneumonia is an acute localized inflammation of alveolar tissue that is non-communicable.",
    points: 1
  },
  {
    number: 6,
    prompt: "When a piece of dry starchy bread is chewed in the mouth for several minutes, it begins to taste distinctly sweet because:",
    correctAnswer: "Salivary amylase (ptyalin) enzymatically hydrolyzes tasteless starch into sweet maltose",
    distractors: [
      "The bread is baked originally with table sugar and flour",
      "Alkaline saliva chemically neutralizes taste receptors",
      "Mastication merely grinds the bread into microscopic solid grains"
    ],
    hint: "Chemical starch breakdown produces maltose disaccharides in the mouth.",
    workedSolution: "Saliva contains salivary amylase (ptyalin), which breaks down insoluble starch polysaccharides into sweet-tasting maltose disaccharides as chewing continues.",
    points: 1
  },
  {
    number: 7,
    prompt: "Which of the following atmospheric gases is a normal, non-toxic natural component of atmospheric air rather than a harmful chemical air pollutant?",
    correctAnswer: "Carbon dioxide gas [CO₂]",
    distractors: [
      "Toxic cigarette smoke fumes",
      "Acidic sulfur dioxide gas [SO₂]",
      "Vehicular exhaust fumes containing carbon monoxide"
    ],
    hint: "Required by green plants for autotrophic photosynthesis; $\\text{SO}_2$ and $\\text{CO}$ are toxic pollutants.",
    workedSolution: "Carbon dioxide is a natural constituent of air (~0.04%) required for photosynthesis. Sulfur dioxide, cigarette fumes, and vehicle exhaust fumes are harmful criteria air pollutants.",
    points: 1
  },
  {
    number: 8,
    prompt: "Dissolved inorganic mineral ions in soil solution enter root hair cells across cell membranes primarily by the physical process of:",
    correctAnswer: "Molecular diffusion (and active ion transport)",
    distractors: [
      "Positive phototropism",
      "Stomatal foliar transpiration",
      "Surface capillary evaporation"
    ],
    hint: "Ions move down concentration gradients via diffusion or against gradients via active transport.",
    workedSolution: "Mineral salts dissolve in soil water and enter root cells via passive diffusion down a concentration gradient and active transport against concentration gradients using ATP.",
    points: 1
  },
  {
    number: 9,
    prompt: "Which anatomical organ serves as the central command, integration, and coordination center of the Central Nervous System (CNS)?",
    correctAnswer: "The brain",
    distractors: [
      "The metabolic kidney",
      "The detoxification liver",
      "The muscular heart"
    ],
    hint: "Enclosed within the cranium; coordinates thought, reflex responses, and sensory data.",
    workedSolution: "The brain is the principal coordinating organ of the Central Nervous System (CNS), processing sensory data, coordinating motor functions, and maintaining homeostasis.",
    points: 1
  },
  {
    number: 10,
    prompt: "All of the following agronomic practices conserve soil fertility and prevent topsoil loss EXCEPT:",
    correctAnswer: "Indiscriminate deforestation and clear-felling of tree canopies",
    distractors: [
      "Applying organic straw mulching across beds",
      "Afforestation and tree planting on bare lands",
      "Systematic multi-course crop rotation"
    ],
    hint: "Removing trees exposes bare soil to severe erosion and nutrient leaching.",
    workedSolution: "Deforestation destroys the protective vegetative canopy, exposing topsoil to rainfall impact and runoff erosion, depleting soil fertility. Mulching and rotation conserve fertility.",
    points: 1
  },
  {
    number: 11,
    prompt: "Which of the following insect organisms acts as a beneficial biological agent of cross-pollination in flowering crops?",
    correctAnswer: "The worker honeybee [Apis mellifera]",
    distractors: [
      "The domestic housefly",
      "The biting female mosquito",
      "The foraging black ant"
    ],
    hint: "Collects nectar and carries sticky pollen grains on its hairy legs and corbiculae.",
    workedSolution: "Honeybees visit flowers to gather nectar and pollen, transferring pollen grains between anthers and stigmas to bring about cross-pollination.",
    points: 1
  },
  {
    number: 12,
    prompt: "Why do deciduous tropical trees shed their green foliage during the prolonged dry harmattan season?",
    correctAnswer: "To minimize transpiring leaf surface area and conserve internal water reserves",
    distractors: [
      "To avoid being uprooted by powerful seasonal winds",
      "To deter browsing herbivorous livestock from feeding",
      "To stimulate immediate unseasonal flowering"
    ],
    hint: "Leaves lose water via stomatal transpiration; shedding leaves stops evaporative loss.",
    workedSolution: "Shedding leaves during dry harmattan periods eliminates stomatal transpiration, conserving limited internal moisture when soil water is depleted.",
    points: 1
  },
  {
    number: 13,
    prompt: "What is the systematic chemical formula for the pure binary ionic compound sodium chloride?",
    correctAnswer: "NaCl",
    distractors: [
      "Na₂Cl",
      "Sn₂Cl",
      "NaCl₂"
    ],
    hint: "Sodium cation ($\\text{Na}^+$) combines with chloride anion ($\\text{Cl}^-$) in a 1:1 stoichiometric ratio.",
    workedSolution: "Sodium has a valency of $+1$ and chlorine has a valency of $-1$. Combining in a 1:1 ratio gives the empirical formula $\\text{NaCl}$.",
    points: 1
  },
  {
    number: 14,
    prompt: "From which of the following natural hydrological sources is water considered biologically cleanest and safest for drinking without heavy treatment?",
    correctAnswer: "A protected deep groundwater borehole or tube well",
    distractors: [
      "An open stagnant village pond",
      "A fast-flowing lowland muddy river",
      "An open surface reservoir lake"
    ],
    hint: "Filtered through deep underground porous geological rock and sand strata.",
    workedSolution: "Deep well water is naturally filtered as it percolates through deep sand and gravel strata, making it free from surface biological pathogens compared to open surface waters.",
    points: 1
  },
  {
    number: 15,
    prompt: "In botanical drupe fruit morphology, the sweet, fleshy, edible pulp of a ripe mango fruit is the:",
    correctAnswer: "Mesocarp",
    distractors: [
      "Stony inner endocarp",
      "Fibrous whole drupe",
      "Outer leathery epicarp"
    ],
    hint: "The middle fleshy layer of the pericarp between the skin and the hard stone.",
    workedSolution: "In a drupe like mango, the pericarp consists of the outer skin (epicarp), fleshy edible pulp (mesocarp), and woody inner stone enclosing the seed (endocarp).",
    points: 1
  },
  {
    number: 16,
    prompt: "Which of the following biological processes is unique to autotrophs and is NOT a universal characteristic of all living organisms?",
    correctAnswer: "Photosynthesis in chloroplasts",
    distractors: [
      "Aerobic cellular respiration",
      "Biological reproduction",
      "Cellular nutrition / feeding"
    ],
    hint: "Animals and fungi are heterotrophs and cannot manufacture food from sunlight.",
    workedSolution: "Photosynthesis is restricted to photoautotrophic plants, algae, and cyanobacteria. Respiration, reproduction, growth, excretion, and feeding are universal characteristics of life.",
    points: 1
  },
  {
    number: 17,
    prompt: "In mechanical simple machines, performing work becomes significantly more difficult and requires a larger effort force when:",
    correctAnswer: "The effort distance is shorter than the load distance [Velocity Ratio < 1]",
    distractors: [
      "The effort distance is twice the load distance",
      "The effort distance is three times the load distance",
      "A small effort moves through a longer displacement distance"
    ],
    hint: "When mechanical advantage is less than 1, a large effort is needed to lift a small load.",
    workedSolution: "When the effort arm is shorter than the load arm ($VR < 1$), the operator must apply an effort force greater than the load, making work harder.",
    points: 1
  },
  {
    number: 18,
    prompt: "A massive concrete dam is constructed across a river for hydroelectric generation. What form of mechanical energy is stored by the water held in the reservoir behind the dam?",
    correctAnswer: "Gravitational potential energy",
    distractors: [
      "Mechanical kinetic energy",
      "Direct electrical energy",
      "Thermal radiant energy"
    ],
    hint: "Energy stored due to the elevated vertical height ($h$) of water above the turbines.",
    workedSolution: "Water stored at an elevated height behind a dam possesses gravitational potential energy ($P.E. = mgh$), which converts into kinetic energy as it falls through penstocks.",
    points: 1
  },
  {
    number: 19,
    prompt: "In cereal crop plants (such as maize and sorghum), what is the primary agronomic function of adventitious prop roots sprouting from lower stem nodes?",
    correctAnswer: "Providing mechanical support to anchor the plant firmly against lodging",
    distractors: [
      "Storing concentrated starch inside swollen branch roots",
      "Absorbing atmospheric air for nocturnal respiration",
      "Developing into fleshy edible underground tubers"
    ],
    hint: "Buttress-like roots that brace tall, top-heavy stems against strong winds.",
    workedSolution: "Prop roots are adventitious aerial roots that grow into the soil to provide additional mechanical support, anchoring tall maize plants firmly against wind lodging.",
    points: 1
  },
  {
    number: 20,
    prompt: "Which of the following cold-blooded vertebrate animals is classified as an amphibian rather than a member of Class Reptilia?",
    correctAnswer: "The common toad [Bufo regularis]",
    distractors: [
      "The wall rainbow lizard",
      "The land tortoise",
      "The venomous spitting cobra"
    ],
    hint: "Has scaleless, moist skin and lays jelly-covered eggs in water; reptiles have dry epidermal scales.",
    workedSolution: "Toads and frogs are amphibians possessing moist, glandular skin and an aquatic larval stage. Lizards, tortoises, and snakes are reptiles with dry, scaly skin.",
    points: 1
  },
  {
    number: 21,
    prompt: "Which sequence correctly traces how mineral nutrients in decaying organic compost finally reach and nourish human beings?",
    correctAnswer: "I → III → IV → II",
    distractors: [
      "I → II → III → IV",
      "IV → II → III → I",
      "II → III → I → IV"
    ],
    hint: "Minerals enter soil (I), dissolve in water (III), are absorbed by plants (IV), and plants are eaten by man (II).",
    workedSolution: "Decomposers release minerals into soil (I) $\\to$ minerals dissolve in soil water (III) $\\to$ crop roots absorb nutrients for growth (IV) $\\to$ humans ingest plant crops (II).",
    points: 1
  },
  {
    number: 22,
    prompt: "What form of mechanical energy is possessed by a stationary textbook resting at an elevated height on a study table?",
    correctAnswer: "Gravitational potential energy",
    distractors: [
      "Mechanical kinetic energy",
      "Static electrical energy",
      "Acoustic sound energy"
    ],
    hint: "Energy stored due to an object's position relative to the floor ($P.E. = mgh$).",
    workedSolution: "An elevated stationary object possesses gravitational potential energy ($P.E. = mgh$) due to its position in Earth's gravitational field. Its kinetic energy is zero.",
    points: 1
  },
  {
    number: 23,
    prompt: "The cyclical progression of changing shapes of the Moon (lunar phases) observed from Earth across a month is caused by:",
    correctAnswer: "The orbital revolution of the Moon around Earth altering illuminated angles",
    distractors: [
      "Thick atmospheric clouds passing across the lunar surface",
      "The annual revolution of the Earth around the Sun",
      "The central Sun revolving around the Moon"
    ],
    hint: "As the Moon orbits Earth, different proportions of its sunlit hemisphere face Earth.",
    workedSolution: "Lunar phases result from the Moon revolving around Earth every 29.5 days, changing the relative angles between Sun, Earth, and Moon and varying the visible illuminated portion.",
    points: 1
  },
  {
    number: 24,
    prompt: "In mammalian optical anatomy, which structural layer of the eyeball is the photoreceptive membrane sensitive to light rays?",
    correctAnswer: "The sensory retina (containing rods and cones)",
    distractors: [
      "The transparent central pupil",
      "The anterior curved cornea",
      "The colored circular iris"
    ],
    hint: "The neural layer at the back of the eye where optical images are focused.",
    workedSolution: "The retina contains photoreceptor cells (rods for dim light, cones for color vision) that convert light photons into nerve impulses sent via the optic nerve to the brain.",
    points: 1
  },
  {
    number: 25,
    prompt: "In animal physiological nutrition, the biological process of digestion is scientifically defined as:",
    correctAnswer: "The chemical and mechanical breakdown of insoluble food into soluble absorbable units",
    distractors: [
      "The systemic circulatory transport of nutrients throughout blood",
      "The mechanical chewing of food boluses inside the mouth alone",
      "The cellular oxidation of glucose to produce energy and carbon dioxide"
    ],
    hint: "Hydrolyzes macromolecules so they can diffuse across intestinal villi into blood.",
    workedSolution: "Digestion is the process of breaking down large, insoluble food macromolecules mechanically and enzymatically into small, soluble units that can be absorbed across the gut wall.",
    points: 1
  },
  {
    number: 26,
    prompt: "Which of the following physical or chemical processes represents a permanent chemical change in which a new substance is formed?",
    correctAnswer: "The atmospheric electrochemical rusting of an iron nail",
    distractors: [
      "Dissolution of sodium chloride in water",
      "Thermal melting of solid ice into water",
      "Thermal boiling and evaporation of pure water"
    ],
    hint: "Rusting produces hydrated iron (III) oxide ($\\text{Fe}_2\\text{O}_3 \\cdot x\\text{H}_2\\text{O}$); phase changes are physical.",
    workedSolution: "Rusting is an irreversible chemical oxidation producing hydrated iron (III) oxide. Dissolution, melting, boiling, and evaporation are reversible physical phase changes.",
    points: 1
  },
  {
    number: 27,
    prompt: "Which calibrated laboratory electrical instrument is connected in parallel across a circuit resistor to measure electrical potential difference?",
    correctAnswer: "A high-resistance voltmeter",
    distractors: [
      "A sensitive moving-coil galvanometer",
      "A variable resistance rheostat",
      "A bridge potentiometer"
    ],
    hint: "Measures electrical potential in Volts ($\\text{V}$) and has very high internal resistance.",
    workedSolution: "A voltmeter measures potential difference across components and is connected in parallel so it draws minimal current through its high internal resistance.",
    points: 1
  },
  {
    number: 28,
    prompt: "Dense tropical rainforests with towering multi-layered canopies thrive in certain geographic regions because the prevailing climate is:",
    correctAnswer: "Warm, humid, and wet with abundant rainfall throughout the year",
    distractors: [
      "Warm and continuously arid dry",
      "Cool and desert dry",
      "Extremely hot and perpetually drought-stricken"
    ],
    hint: "Rainforests require high year-round precipitation ($> 2,000\\text{ mm}$) and warm temperatures.",
    workedSolution: "Tropical rainforests require warm temperatures and high, well-distributed rainfall ($> 2,000\\text{ mm}$ annually) to support dense, multi-layered evergreen vegetation.",
    points: 1
  },
  {
    number: 29,
    prompt: "Which of the following agricultural land management practices accelerates and encourages severe soil erosion?",
    correctAnswer: "Clean tilling and removing all vegetative ground cover along slopes",
    distractors: [
      "Planting creeping legume cover crops across bare soils",
      "Applying organic straw mulching to conserve moisture",
      "Constructing contour ridges and bunds across slopes"
    ],
    hint: "Exposing bare soil leaves it vulnerable to raindrop impact and runoff scouring.",
    workedSolution: "Clearing vegetation and leaving slopes bare exposes soil directly to raindrop impact and rapid surface runoff, accelerating soil erosion. Cover cropping and mulching prevent erosion.",
    points: 1
  },
  {
    number: 30,
    prompt: "A secondary commercial lead-acid automobile battery generates direct electrical energy through the conversion of internal:",
    correctAnswer: "Chemical potential energy",
    distractors: [
      "Acoustic sound energy",
      "Mechanical kinetic energy",
      "Internal thermal heat energy"
    ],
    hint: "Redox reactions between lead plates and sulfuric acid produce electromotive force.",
    workedSolution: "Lead-acid car batteries convert chemical potential energy stored in lead ($\\text{Pb}$), lead dioxide ($\\text{PbO}_2$), and sulfuric acid ($\\text{H}_2\\text{SO}_4$) into electrical energy.",
    points: 1
  },
  {
    number: 31,
    prompt: "Which of the following chemical substances is normally ABSENT from the excretory urine of a healthy human being?",
    correctAnswer: "Glucose monosaccharides (simple sugar)",
    distractors: [
      "Ammonium and urea nitrogenous salts",
      "Common sodium chloride mineral salt",
      "Water molecules"
    ],
    hint: "Filtered glucose is completely reabsorbed in proximal renal tubules; its presence indicates diabetes.",
    workedSolution: "Healthy kidneys filter and completely reabsorb glucose in the proximal convoluted tubules. The presence of glucose in urine (glucosuria) indicates diabetes mellitus.",
    points: 1
  },
  {
    number: 32,
    prompt: "Which physical separation technique is used in traditional Ghanaian agro-processing to extract local gin (*akpeteshie*) from fermented palm wine?",
    correctAnswer: "Fractional distillation",
    distractors: [
      "Surface evaporation",
      "Vapor condensation alone",
      "Gravity sand filtration"
    ],
    hint: "Heating fermented palm wine boils off volatile ethanol ($78^\\circ\\text{C}$), which is cooled and condensed.",
    workedSolution: "Distilling *akpeteshie* involves boiling fermented palm wine to vaporize volatile ethanol, then condensing the vapor through cold pipes, demonstrating distillation.",
    points: 1
  },
  {
    number: 33,
    prompt: "In community ecology, a linear feeding sequence that illustrates the directional flow of biomass and energy from an autotroph to consumers is a:",
    correctAnswer: "Food chain",
    distractors: [
      "Linear feeding cycle",
      "Photosynthetic pyramid",
      "Nutritional cycle"
    ],
    hint: "Example: $\\text{Grass} \\to \\text{Grasshopper} \\to \\text{Toad} \\to \\text{Snake}$.",
    workedSolution: "A food chain represents a linear sequence of organisms through which nutrients and energy pass as one organism feeds on another, starting with an autotrophic producer.",
    points: 1
  },
  {
    number: 34,
    prompt: "In medical protozoology, the clinical human disease malaria is caused by infection with the parasitic protozoan:",
    correctAnswer: "Plasmodium [e.g., Plasmodium falciparum]",
    distractors: [
      "Savanna tsetse fly [Glossina]",
      "Parasitic fungal mold",
      "Dengue arbovirus"
    ],
    hint: "A blood sporozoan transmitted by female *Anopheles* mosquitoes.",
    workedSolution: "Malaria is caused by protozoan parasites of the genus *Plasmodium* (*P. falciparum*, *P. vivax*), transmitted through the bites of infected female *Anopheles* mosquitoes.",
    points: 1
  },
  {
    number: 35,
    prompt: "In angiosperm floral morphology, the male and female reproductive gametes are produced within the:",
    correctAnswer: "Pollen grains (in anthers) and Ovules (in ovary) respectively",
    distractors: [
      "Motile spermatozoa and swimming eggs",
      "Motile spermatozoa and maternal ovary tissues",
      "Floral ovary and maternal style tissues"
    ],
    hint: "Anthers produce male pollen grains; the ovary encloses female ovules.",
    workedSolution: "In flowering plants, male gametes are produced in pollen grains within the anthers of stamens, and female gametes (egg cells) are enclosed within ovules inside the ovary.",
    points: 1
  },
  {
    number: 36,
    prompt: "All of the following preventive measures help control the spread of pulmonary tuberculosis EXCEPT:",
    correctAnswer: "Indiscriminate coughing and spitting into the public environment",
    distractors: [
      "Isolating infected patients during active infectious stages",
      "Providing dedicated eating utensils and cups for infected individuals",
      "Immunizing newborn infants with the BCG vaccine"
    ],
    hint: "Spitting expels viable *Mycobacterium tuberculosis* bacteria into the air as aerosol droplets.",
    workedSolution: "Careless spitting expels *Mycobacterium tuberculosis* bacilli into air and dust, spreading tuberculosis. Isolation, separate utensils, and BCG vaccination prevent transmission.",
    points: 1
  },
  {
    number: 37,
    prompt: "During an astronomical eclipse of the Sun (solar eclipse), the central conical region of total darkness cast by the Moon onto Earth is the:",
    correctAnswer: "Umbra",
    distractors: [
      "Planetary orbit",
      "Outer penumbra",
      "Diffuse shadow"
    ],
    hint: "The inner region where sunlight is completely obscured; penumbra is the partial shadow.",
    workedSolution: "The umbra is the inner conical shadow where direct sunlight is completely blocked by the Moon, producing total darkness. The outer region of partial shadow is the penumbra.",
    points: 1
  },
  {
    number: 38,
    prompt: "Which pair of wild mammalian herbivores naturally inhabits the open tropical savanna grasslands of Africa?",
    correctAnswer: "Grazing antelopes and savanna hares",
    distractors: [
      "Canopy monkeys and Bengal tigers",
      "Predatory lions and giraffes combined",
      "Tree woodpeckers and forest baboons"
    ],
    hint: "Fast-running herbivores adapted to open grassland plains; tigers are native to Asian forests.",
    workedSolution: "Antelopes, zebras, and savanna hares are herbivores adapted to open grasslands. Tigers inhabit Asian forests, monkeys are arboreal, and lions are carnivores.",
    points: 1
  },
  {
    number: 39,
    prompt: "What chemical products are released as metabolic end-products during aerobic cellular respiration in living cells?",
    correctAnswer: "Metabolic energy (ATP), carbon dioxide [CO₂], and water [H₂O]",
    distractors: [
      "Glucose monosaccharides and molecular oxygen",
      "Solid waste food, metabolic energy, and carbon dioxide",
      "Metabolic energy, molecular oxygen, and water"
    ],
    hint: "$$\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\to 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{ATP}$$.",
    workedSolution: "Aerobic respiration oxidizes glucose in the presence of oxygen within mitochondria to produce usable ATP energy, carbon dioxide, and water.",
    points: 1
  },
  {
    number: 40,
    prompt: "Which of the following cold-blooded organisms shelters in cool, damp burrows during sunny hours to prevent cutaneous desiccation?",
    correctAnswer: "The common toad [Bufo regularis]",
    distractors: [
      "The house rat",
      "The basking wall lizard",
      "The flying diurnal butterfly"
    ],
    hint: "An amphibian with porous, glandular skin prone to rapid water loss in dry heat.",
    workedSolution: "Toads have permeable skin that loses water rapidly in dry heat. They shelter in damp burrows during the day and emerge at night to avoid desiccation.",
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

const assignedTargetIndices = seedShuffle(targetKeys, 199406);

export const balancedScience1994P1: QuestionItem[] = rawScienceBank.map((q, idx) => {
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
export const paper2Science1994Questions: Paper2Question[] = [
  // ==========================================
  // QUESTION 1: MATTER, PARASITOLOGY, FORMULAE & BOTANY (20 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) In physical chemistry, distinguish clearly between a physical change and a chemical change.
(ii) Distinguish clearly between a true solution and a suspension.`,
        workedSolution: `(i) Physical Change vs. Chemical Change:
• Physical change: A reversible change in which no new chemical substance is formed (e.g., changes of physical state like melting or boiling), involving relatively small energy changes.
• Chemical change: An irreversible change in which one or more entirely new chemical substances with different properties are formed, accompanied by significant absorption or release of energy.

(ii) Solution vs. Suspension:
• Solution: A clear, homogeneous single-phase mixture where solute particles dissolve at the molecular or ionic level ($< 1\\text{ nm}$), which do not settle out upon standing and pass through filter paper.
• Suspension: A cloudy, heterogeneous two-phase mixture containing large, insoluble solid particles ($> 1000\\text{ nm}$) that settle out by gravity upon standing and are retained on filter paper as residue.`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: `Classify each of the following chemical or physical processes as either a Physical change or a Chemical change:
(i) Dissolving common table salt in water;
(ii) Burning of charcoal in air;
(iii) Melting of solid ice into water;
(iv) Mixing dilute hydrochloric acid with sodium hydroxide solution.`,
        workedSolution: `Classification:
• (i) Dissolving salt in water: **Physical change** (reversible by evaporating the water).
• (ii) Burning of charcoal: **Chemical change** (carbon oxidizes into new substance $\\text{CO}_2$).
• (iii) Melting of ice: **Physical change** (reversible phase transition $\\text{H}_2\\text{O}_{(s)} \\to \\text{H}_2\\text{O}_{(l)}$).
• (iv) Hydrochloric acid in sodium hydroxide: **Chemical change** (acid-base neutralization forming new substances $\\text{NaCl}$ and $\\text{H}_2\\text{O}$).`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: `(i) In community ecology, define what is meant by a biological parasite.
(ii) Give two specific examples of parasites and name the corresponding host organism for each.`,
        workedSolution: `(i) Definition of parasite:
An organism that lives on (ectoparasite) or inside (endoparasite) the body of another living organism (the host), deriving nutrients and shelter while causing physiological harm, disease, or death to the host.

(ii) Examples of parasites and hosts:
1. *Plasmodium* (Parasite) — Human being (Host)
2. Livestock tick (Parasite) — Domestic cattle / dog (Host)
3. Tapeworm (*Taenia*) (Parasite) — Human / pig (Host)
4. Dodder plant (*Cuscuta*) (Parasite) — Green host plant (Host)`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: `Write down the official chemical symbol for each of the following chemical elements:
(i) Oxygen;
(ii) Chlorine;
(iii) Aluminum;
(iv) Calcium.`,
        workedSolution: `Chemical Symbols:
• (i) Oxygen: **O**
• (ii) Chlorine: **Cl**
• (iii) Aluminum: **Al**
• (iv) Calcium: **Ca**`,
        maxMarks: 4
      },
      {
        subId: "(e)",
        prompt: `(i) Explain what is meant by self-pollination in flowering plants.
(ii) Name four natural agents that bring about pollination in crops.
(iii) State the biological function of brightly colored petals in insect pollination.`,
        workedSolution: `(i) Definition of self-pollination:
The transfer of pollen grains from the anther to the receptive stigma of the exact same flower, or another flower on the same plant.

(ii) Four agents of pollination:
1. Insects (bees, butterflies, moths)
2. Wind (air currents)
3. Water (in aquatic plants)
4. Birds (sunbirds, hummingbirds)
5. Bats

(iii) Function of brightly colored petals:
To provide vivid visual signals and nectar guides that attract insect pollinators (bees, butterflies) to the flower to effect cross-pollination.`,
        maxMarks: 3
      }
    ]
  },

  // ==========================================
  // QUESTION 2: DIGESTION, THERMODYNAMICS, MORPHOLOGY & METALLURGY (20 MARKS)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) Explain the biological term digestion in animals.
(ii) State the final absorbable end-products of complete digestion for each of the following:
  (α) Carbohydrates;
  (β) Proteins;
  (γ) Fats and oils.
(iii) Name the digestive enzyme present in human saliva and state its specific function.`,
        workedSolution: `(i) Definition of digestion:
The biochemical and mechanical breakdown of large, complex, insoluble food polymers into small, soluble, absorbable molecules that can diffuse across intestinal membranes into blood capillaries.

(ii) End-products of digestion:
• (α) Carbohydrates: **Simple monosaccharides (principally Glucose)**
• (β) Proteins: **Amino acids**
• (γ) Fats and oils: **Fatty acids and glycerol**

(iii) Salivary enzyme and function:
• Name: **Salivary amylase (Ptyalin)**
• Function: Hydrolyzes cooked starch polysaccharides into soluble **maltose** disaccharides in the mouth.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `(i) By what physical heat transfer process does thermal energy from the Sun reach Earth?
(ii) An aluminum metal bowl filled with boiling hot water is placed on a table. Name the physical processes by which thermal heat is lost from the bowl to the surroundings.
(iii) State one scientific reason why wood or plastic is used as a handle for cooking utensils.`,
        workedSolution: `(i) Solar heat transfer:
**Thermal electromagnetic radiation** (infrared waves traveling through the vacuum of space).

(ii) Heat loss processes from the hot bowl:
1. **Conduction:** Heat transfers through the aluminum base directly to the contact surface of the table.
2. **Convection:** Heat warms the immediately surrounding air, setting up upward circulating convection air currents.
3. **Radiation:** The hot outer surface emits infrared thermal radiation into the surrounding room.
4. **Evaporation:** Warm water vapor escapes from the liquid surface, carrying away latent heat of vaporization.

(iii) Why wood handles are used:
Wood is a **poor thermal conductor (thermal insulator)**; it prevents heat from conducting from the hot metal pot to the user's hand, preventing burns.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: "List separately the vegetative parts and the reproductive parts of an angiosperm flowering plant.",
        workedSolution: `Organ Classification:
• **Vegetative Parts:**
  1. Roots
  2. Stems
  3. Leaves
• **Reproductive Parts:**
  1. Flowers (sepals, petals, stamens, carpels)
  2. Fruits
  3. Seeds`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: `(i) What are metallic alloys in industrial chemistry?
(ii) Give two commercial examples of alloys and state the constituent chemical elements of each.`,
        workedSolution: `(i) Definition of alloy:
A homogeneous solid solution or uniform metallic mixture composed of two or more metals (or a metal melted with a non-metal) combined to enhance mechanical strength, hardness, or corrosion resistance.

(ii) Examples and constituents:
1. **Brass:** Formed from **Copper [Cu]** and **Zinc [Zn]**.
2. **Bronze:** Formed from **Copper [Cu]** and **Tin [Sn]**.
3. **Steel:** Formed from **Iron [Fe]** and **Carbon [C]**.
4. **Duralumin:** Formed from **Aluminum [Al]**, **Copper [Cu]**, and **Magnesium [Mg]**.`,
        maxMarks: 4
      }
    ]
  },

  // ==========================================
  // QUESTION 3: FRICTION, LEVERS, EXCRETION & ECOLOGY (20 MARKS)
  // ==========================================
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) Explain the physical concept of friction in mechanics.
(ii) State two practical engineering methods of reducing friction between moving machine parts.
(iii) A rigid crowbar of total length $100.0\\text{ cm}$ is used as a first-class lever to lift a heavy stone:
  (α) Draw a diagram of the lever showing the positions of the Effort, Pivot (Fulcrum), and Load;
  (β) If the pivot is placed $80.0\\text{ cm}$ away from the effort, calculate the load distance:

${svgQ3aLeverStone}`,
        workedSolution: `(i) Concept of friction:
A contact retarding force that opposes the relative sliding or rolling motion between two surfaces in contact, acting parallel to the surface interface.

(ii) Methods of reducing friction:
1. Applying lubricants (lubricating oil, grease, graphite) between moving surfaces.
2. Using ball bearings or roller bearings to convert sliding friction into rolling friction.
3. Polishing and smoothing contact surfaces to remove microscopic asperities.

(iii) Crowbar lever analysis:
• (α) Diagram (refer to vector schematic): The fulcrum is situated between the effort applied at one end and the stone load at the opposite end.
• (β) Calculation of load distance:
$$\\text{Total Lever Length} = \\text{Effort Distance} + \\text{Load Distance}$$
$$\\text{Load Distance} = \\text{Total Length} - \\text{Effort Distance}$$
$$\\text{Load Distance} = 100.0\\text{ cm} - 80.0\\text{ cm} = 20.0\\text{ cm}$$
Answer: The load distance is $$20.0\\text{ cm}$$.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) Explain the biological term excretion in living organisms.
(ii) State the specific human organ responsible for excreting each of the following:
  (α) Sweat;
  (β) Carbon dioxide gas;
  (γ) Urine.`,
        workedSolution: `(i) Definition of excretion:
The biological process by which toxic metabolic waste products of cellular activity, excess substances, and non-useful materials are eliminated from the body to maintain internal homeostasis.

(ii) Excretory organs:
• (α) Sweat: **The Skin (Eccrine sweat glands)**
• (β) Carbon dioxide: **The Lungs**
• (γ) Urine: **The Kidneys**`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `(i) What is a food chain in community ecology?
(ii) Construct a valid grazing food chain using the following organisms:
**Hawk, Cassava leaf, Wall lizard, Field grasshopper.**`,
        workedSolution: `(i) Definition of food chain:
A linear feeding sequence showing the directional transfer of energy and nutrients as one organism feeds on another, beginning with an autotrophic primary producer and ending with an apex predator.

(ii) Food chain construction:
$$\\text{Cassava leaf (Producer)} \\to \\text{Field grasshopper (Primary Consumer)} \\to \\text{Wall lizard (Secondary Consumer)} \\to \\text{Hawk (Tertiary Consumer)}$$`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "State three environmental conditions strictly necessary for the successful germination of viable seeds.",
        workedSolution: `1. **Adequate Moisture (Water):** Softens the seed coat, activates hydrolytic enzymes, and transports dissolved food reserves to the embryo.
2. **Suitable Temperature (Warmth):** Provides the optimum kinetic thermal energy for metabolic enzymes to function.
3. **Oxygen gas:** Essential for aerobic cellular respiration to generate ATP energy for embryonic growth.`,
        maxMarks: 2
      },
      {
        subId: "(e)",
        prompt: `(i) Name two infectious diseases that are transmitted through unprotected sexual intercourse.
(ii) Give two observable physical features that can be genetically passed from parents to children.`,
        workedSolution: `(i) Sexually transmitted diseases:
1. Gonorrhea
2. Syphilis
*(Alternatives: HIV/AIDS, Chlamydia, Genital herpes)*

(ii) Inherited traits:
1. Eye color (e.g., brown, black)
2. Skin complexion / pigmentation
*(Alternatives: Natural hair texture, height, ABO blood group, sickle-cell trait)*`,
        maxMarks: 2
      }
    ]
  },

  // ==========================================
  // QUESTION 4: ASTRONOMY, FORCES, CIRCUITS & IMMUNIZATION (20 MARKS)
  // ==========================================
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) List the eight major planets of our Solar System in sequential order of their distances away from the central Sun, starting with the planet nearest to it.
(ii) State one fundamental astronomical difference between an eclipse of the Sun (solar eclipse) and an eclipse of the Moon (lunar eclipse).`,
        workedSolution: `(i) Sequential planetary order from the Sun:
1. **Mercury** (nearest)
2. **Venus**
3. **Earth**
4. **Mars**
5. **Jupiter**
6. **Saturn**
7. **Uranus**
8. **Neptune** (farthest)

(ii) Difference between Solar and Lunar Eclipses:
• In a **Solar Eclipse**, the **Moon** moves directly between the Sun and the Earth, casting the Moon's shadow onto the Earth (occurs during day at New Moon).
• In a **Lunar Eclipse**, the **Earth** moves directly between the Sun and the Moon, casting the Earth's shadow across the Moon (occurs at night at Full Moon).`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: `(i) In Newtonian physics, define the term force.
(ii) State three common types of forces operating in nature.
(iii) A wooden packing box is pulled across a smooth horizontal floor by a constant horizontal force of $20.0\\text{ N}$ through a distance of $8.0\\text{ m}$. Calculate the mechanical work done by the force.`,
        workedSolution: `(i) Definition of force:
A force is an external pull or push exerted on an object that tends to alter its state of rest, change its velocity (acceleration), or alter its shape and dimensions ($F = ma$).

(ii) Three types of forces:
1. Gravitational force
2. Frictional force
3. Magnetic force
*(Alternatives: Electrostatic force, Tensional / Elastic force)*

(iii) Work calculation:
Formula:
$$\\text{Work Done } (W) = \\text{Force } (F) \\times \\text{Distance } (d)$$
Substitute given values ($F = 20.0\\text{ N}$, $d = 8.0\\text{ m}$):
$$W = 20.0\\text{ N} \\times 8.0\\text{ m} = 160.0\\text{ Joules (J)}$$
Answer: The work done is $$160.0\\text{ J}$$.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: `Draw clear electrical circuit diagrams showing each of the following arrangements:
(i) A switch and an electric bulb connected in series with two dry cells connected in series;
(ii) A switch and an electric bulb connected in series with two dry cells connected in parallel:

${svgQ4cDCSeriesParallel}`,
        workedSolution: `Circuit Descriptions (refer to vector schematic):
• Circuit (i) Cells in Series:
  - Two dry cells connected end-to-end (positive long plate of one connected to negative short plate of the next).
  - Wired in a single continuous series loop through an open/closed switch and an incandescent lamp. Total EMF equals the sum of both cell voltages ($2V$).
• Circuit (ii) Cells in Parallel:
  - The positive terminals of both cells are wired together to a common node, and the negative terminals to a second common node.
  - Connected in series with the switch and lamp. Total circuit EMF equals that of a single cell ($V$), but current capacity and operating lifespan are doubled.`,
        maxMarks: 6
      },
      {
        subId: "(d)",
        prompt: "Name two infectious childhood diseases that can be effectively controlled through prophylactic immunization (vaccination).",
        workedSolution: `1. Measles (immunized with the Measles vaccine).
2. Poliomyelitis / Polio (immunized with the Oral Polio Vaccine [OPV]).
*(Alternatives: Tetanus, Tuberculosis [BCG], Diphtheria, Whooping Cough / Pertussis)*`,
        maxMarks: 3
      }
    ]
  }
];

// ==========================================
// EXPORTED EXAM BUNDLES
// ==========================================
export const SET_BECE_1994_SCIENCE_P1 = {
  year: 1994,
  isVariant: true,
  setNumber: 126,
  subject: "Integrated Science",
  paperNumber: 1,
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  title: "Paper 1: Objective Test (Variant)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedScience1994P1
};

export const SET_BECE_1994_SCIENCE_P2 = {
  year: 1994,
  isVariant: true,
  setNumber: 126,
  subject: "Integrated Science",
  paperNumber: 2,
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  title: "Paper 2: Practical & Theory Essay (Variant)",
  durationMinutes: 75,
  instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 4,
  questions: paper2Science1994Questions
};

export const SET_BECE_1994_SCIENCE_COMPLETE = {
  year: 1994,
  isVariant: true,
  setNumber: 126,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: {
    title: "Paper 1: Objective Test (Variant)",
    durationMinutes: 45,
    totalQuestions: 40,
    questions: balancedScience1994P1
  },
  paper2: {
    title: "Paper 2: Practical & Theory Essay (Variant)",
    durationMinutes: 75,
    instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
    totalQuestions: 4,
    questions: paper2Science1994Questions
  },
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 2,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
