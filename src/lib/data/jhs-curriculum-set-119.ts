/**
 * 2025 BECE Integrated Science Paper 2 (Set 119 Practical & Theory Essay Test Variant)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_2025_variant
 * Set Number: Set 119
 * Format: 5 Questions (Section A Compulsory Practical Test [40 marks] + Section B Theory Essays [Answer 3, 20 marks each = 60 marks]) = 100 Marks Total
 * Reconstructed Visual Setups (Directly from photographic evidence):
 *   - svgQ1aCarbonCycle: Global Carbon Cycle stages A-D & processes P, S, T [IMG_2602.jpg]
 *   - svgQ1bFarmingSystems: Shifting Cultivation vs Crop Rotation [IMG_2603.jpg]
 *   - svgQ1cInclinedPlane: Mason pulling iron slab up inclined plane [IMG_2604.jpg]
 *   - svgQ1dSeparationSetups: Fractional/Simple Distillation vs Magnetic Separation [IMG_2605.jpg]
 * 
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
 */

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

// ============================================================================
// RECONSTRUCTED VECTOR SVGS (HIGH CONTRAST & RESPONSIVE)
// ============================================================================

// 1. Vector SVG for Q1(a): Global Carbon Cycle [Reconstructed from IMG_2602.jpg]
export const svgQ1aCarbonCycle = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 240' width='100%' height='220' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Stage B: Atmospheric Carbon Dioxide (Top) -->
    <ellipse cx='190' cy='35' rx='35' ry='18' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/>
    <text x='190' y='39' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>B (CO₂)</text>

    <!-- Stage A: Green Plants (Left) -->
    <circle cx='65' cy='95' r='24' fill='#1e293b' stroke='#10b981' stroke-width='2'/>
    <text x='65' y='99' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>A (Plants)</text>

    <!-- Stage C: Animals (Middle) -->
    <circle cx='190' cy='105' r='24' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/>
    <text x='190' y='109' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>C (Animals)</text>

    <!-- Stage D: Decomposers / Soil Carbon (Lower Middle) -->
    <circle cx='190' cy='175' r='22' fill='#1e293b' stroke='#a855f7' stroke-width='2'/>
    <text x='190' y='179' font-size='10' font-weight='bold' fill='#a855f7' text-anchor='middle'>D (Soil C)</text>

    <!-- Fossil Fuel Stage (Bottom) -->
    <ellipse cx='180' cy='220' rx='30' ry='12' fill='#334155' stroke='#94a3b8' stroke-width='1.5'/>
    <text x='180' y='224' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Fossil Fuel</text>

    <!-- Factories / Industries (Right) -->
    <ellipse cx='315' cy='95' rx='42' ry='18' fill='#1e293b' stroke='#ef4444' stroke-width='1.8'/>
    <text x='315' y='94' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>Factories &amp;</text>
    <text x='315' y='105' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>Industries</text>

    <!-- Flow Arrows & Labels -->
    <!-- P: Photosynthesis (B -> A) -->
    <path d='M 160 45 L 85 80' fill='none' stroke='#10b981' stroke-width='2'/>
    <polygon points='84,74 80,82 89,81' fill='#10b981'/>
    <text x='115' y='55' font-size='11' font-weight='bold' fill='#10b981'>P</text>

    <!-- Q: Plant Respiration (A -> B) -->
    <path d='M 90 75 L 155 42' fill='none' stroke='#38bdf8' stroke-width='2'/>
    <polygon points='150,40 160,40 154,49' fill='#38bdf8'/>
    <text x='132' y='72' font-size='11' font-weight='bold' fill='#38bdf8'>Q</text>

    <!-- Animal Respiration (C -> B) -->
    <line x1='190' y1='81' x2='190' y2='53' stroke='#f59e0b' stroke-width='2'/>
    <polygon points='186,58 190,53 194,58' fill='#f59e0b'/>

    <!-- Feeding (A -> C) -->
    <line x1='89' y1='95' x2='166' y2='105' stroke='#cbd5e1' stroke-width='1.5'/>

    <!-- Death to Decomposers (A -> D and C -> D) -->
    <line x1='85' y1='108' x2='170' y2='168' stroke='#94a3b8' stroke-width='1.2'/>
    <line x1='190' y1='129' x2='190' y2='153' stroke='#94a3b8' stroke-width='1.2'/>

    <!-- S: Fossilization (D -> Fossil fuel) -->
    <line x1='183' y1='197' x2='181' y2='208' stroke='#a855f7' stroke-width='2'/>
    <text x='192' y='205' font-size='11' font-weight='bold' fill='#a855f7'>S</text>

    <!-- Extraction to Factories -->
    <line x1='210' y1='220' x2='300' y2='113' stroke='#ef4444' stroke-width='1.8'/>
    <polygon points='294,114 302,111 298,119' fill='#ef4444'/>

    <!-- T: Combustion (Factories -> B) -->
    <path d='M 285 80 Q 240 50 225 40' fill='none' stroke='#ef4444' stroke-width='2'/>
    <polygon points='225,46 220,38 230,40' fill='#ef4444'/>
    <text x='260' y='52' font-size='11' font-weight='bold' fill='#ef4444'>T</text>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q1(b): Farming Systems K (Shifting Cultivation) & L (Crop Rotation) [Reconstructed from IMG_2603.jpg]
export const svgQ1bFarmingSystems = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- System K: Shifting Cultivation Across 4 Separated Farmlands -->
    <g transform='translate(20, 20)'>
      <!-- Farmland A (Year 1) -->
      <rect x='0' y='0' width='35' height='35' rx='3' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='17' y='22' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>A</text>
      <text x='17' y='-5' font-size='8' fill='#cbd5e1' text-anchor='middle'>Year 1</text>
      
      <!-- Arrow A -> B -->
      <line x1='35' y1='17' x2='65' y2='17' stroke='#38bdf8' stroke-width='2'/>
      <polygon points='62,14 68,17 62,20' fill='#38bdf8'/>

      <!-- Farmland B (Year 4) -->
      <rect x='70' y='0' width='35' height='35' rx='3' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='87' y='22' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>B</text>
      <text x='87' y='-5' font-size='8' fill='#cbd5e1' text-anchor='middle'>Year 4</text>

      <!-- Arrow B -> C -->
      <line x1='87' y1='35' x2='87' y2='65' stroke='#38bdf8' stroke-width='2'/>
      <polygon points='84,62 87,68 90,62' fill='#38bdf8'/>

      <!-- Farmland C (Year 7) -->
      <rect x='70' y='70' width='35' height='35' rx='3' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='87' y='92' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>C</text>
      <text x='87' y='118' font-size='8' fill='#cbd5e1' text-anchor='middle'>Year 7</text>

      <!-- Arrow C -> D -->
      <line x1='70' y1='87' x2='40' y2='87' stroke='#38bdf8' stroke-width='2'/>
      <polygon points='43,84 37,87 43,90' fill='#38bdf8'/>

      <!-- Farmland D (Year 10) -->
      <rect x='0' y='70' width='35' height='35' rx='3' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='17' y='92' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>D</text>
      <text x='17' y='118' font-size='8' fill='#cbd5e1' text-anchor='middle'>Year 10</text>

      <!-- Arrow D -> A (Cycle return) -->
      <line x1='17' y1='70' x2='17' y2='40' stroke='#38bdf8' stroke-width='2'/>
      <polygon points='14,43 17,37 20,43' fill='#38bdf8'/>

      <text x='52' y='145' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>System K</text>
      <text x='52' y='158' font-size='8' fill='#cbd5e1' text-anchor='middle'>(Shifting Cultivation)</text>
    </g>

    <!-- System L: 4-Course Crop Rotation On Single Partitioned Farmland -->
    <g transform='translate(180, 25)'>
      <!-- Single Farmland Boundary divided into 4 Plots -->
      <rect x='0' y='0' width='160' height='105' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/>
      <line x1='80' y1='0' x2='80' y2='105' stroke='#f59e0b' stroke-width='1.5'/>
      <line x1='0' y1='52' x2='160' y2='52' stroke='#f59e0b' stroke-width='1.5'/>
      
      <!-- Plot Labels -->
      <text x='40' y='-5' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Plot 1</text>
      <text x='125' y='-5' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Plot 2</text>
      <text x='125' y='118' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Plot 3</text>
      <text x='40' y='118' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Plot 4</text>

      <!-- Crop Movement Rotational Arrows -->
      <!-- Plot 1 -> Plot 2 -->
      <path d='M 45 15 Q 80 5 115 15' fill='none' stroke='#38bdf8' stroke-width='1.8'/>
      <polygon points='111,10 120,16 112,19' fill='#38bdf8'/>

      <!-- Plot 2 -> Plot 3 -->
      <path d='M 145 35 Q 155 52 145 70' fill='none' stroke='#38bdf8' stroke-width='1.8'/>
      <polygon points='148,65 142,73 141,63' fill='#38bdf8'/>

      <!-- Plot 3 -> Plot 4 -->
      <path d='M 115 88 Q 80 98 45 88' fill='none' stroke='#38bdf8' stroke-width='1.8'/>
      <polygon points='49,92 40,86 48,83' fill='#38bdf8'/>

      <!-- Plot 4 -> Plot 1 -->
      <path d='M 15 70 Q 5 52 15 35' fill='none' stroke='#38bdf8' stroke-width='1.8'/>
      <polygon points='12,39 18,31 19,41' fill='#38bdf8'/>

      <text x='80' y='140' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>System L</text>
      <text x='80' y='153' font-size='8' fill='#cbd5e1' text-anchor='middle'>(Crop Rotation)</text>
    </g>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// 3. Vector SVG for Q1(c): Mason on Inclined Plane [Reconstructed from IMG_2604.jpg]
export const svgQ1cInclinedPlane = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Triangular Inclined Plane Ramp Structure -->
    <polygon points='50,160 330,160 330,50' fill='#1e293b' stroke='#64748b' stroke-width='2'/>
    
    <!-- Ramp Dimensions: Length L = 10 m, Vertical Height h = 5 m -->
    <text x='180' y='90' font-size='9' font-weight='bold' fill='#38bdf8' transform='rotate(-21 180 90)'>Length = 10 m</text>
    <line x1='340' y1='50' x2='340' y2='160' stroke='#f59e0b' stroke-width='1.5'/>
    <text x='355' y='110' font-size='10' font-weight='bold' fill='#f59e0b'>h = 5 m</text>

    <!-- Slab being pulled up (Tilted at ramp angle ~21 degrees) -->
    <g transform='translate(100, 140) rotate(-21)'>
      <rect x='0' y='-30' width='60' height='30' rx='2' fill='#475569' stroke='#cbd5e1' stroke-width='2'/>
      <text x='30' y='-10' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>Slab</text>
      
      <!-- Pulling Rope Up Ramp -->
      <line x1='60' y1='-15' x2='140' y2='-15' stroke='#f59e0b' stroke-width='2.5'/>
      <!-- Effort Force Vector I (400 N) -->
      <line x1='70' y1='-22' x2='120' y2='-22' stroke='#10b981' stroke-width='2'/>
      <polygon points='116,-25 124,-22 116,-19' fill='#10b981'/>
      <text x='95' y='-30' font-size='10' font-weight='bold' fill='#10b981'>I (400 N)</text>

      <!-- Frictional Force Vector III (Opposing motion down ramp) -->
      <line x1='0' y1='2' x2='-35' y2='2' stroke='#ef4444' stroke-width='2'/>
      <polygon points='-31,-1 -39,2 -31,5' fill='#ef4444'/>
      <text x='-20' y='14' font-size='9' font-weight='bold' fill='#ef4444'>III (Friction)</text>
    </g>

    <!-- Downward Load Weight Force Vector II (100 N vertically down) -->
    <g transform='translate(130, 125)'>
      <line x1='0' y1='0' x2='0' y2='42' stroke='#ef4444' stroke-width='2.5'/>
      <polygon points='-4,38 0,46 4,38' fill='#ef4444'/>
      <text x='8' y='35' font-size='10' font-weight='bold' fill='#ef4444'>II (100 N)</text>
    </g>

    <!-- Mason Figure Pulling at top -->
    <circle cx='255' cy='70' r='6' fill='#cbd5e1'/>
    <line x1='255' y1='76' x2='250' y2='96' stroke='#cbd5e1' stroke-width='3'/>
    <line x1='250' y1='96' x2='240' y2='115' stroke='#cbd5e1' stroke-width='2.5'/>
    <line x1='250' y1='96' x2='262' y2='115' stroke='#cbd5e1' stroke-width='2.5'/>

    <text x='190' y='185' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>INCLINED PLANE: FORCE I (EFFORT) OVERCOMES LOAD II AND FRICTION III</text>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// 4. Vector SVG for Q1(d): Distillation Set-up A & Magnetic Separation Set-up B [Reconstructed from IMG_2605.jpg]
export const svgQ1dSeparationSetups = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Set-up A: Simple Distillation (Left) -->
    <g transform='translate(20, 25)'>
      <!-- Distillation Flask IV with Thermometer I -->
      <ellipse cx='30' cy='100' rx='20' ry='18' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='1.5'/>
      <rect x='28' y='55' width='4' height='30' fill='#38bdf8' opacity='0.3'/>
      <line x1='30' y1='35' x2='30' y2='75' stroke='#ef4444' stroke-width='1.8'/>
      <text x='15' y='40' font-size='8' font-weight='bold' fill='#ef4444'>I (Thermometer)</text>
      <!-- Bunsen Flame -->
      <path d='M 30 135 Q 26 122 30 118 Q 34 122 30 135 Z' fill='#f59e0b'/>
      <text x='48' y='110' font-size='8' font-weight='bold' fill='#38bdf8'>IV (Flask)</text>

      <!-- Condenser II with Water In & Out -->
      <line x1='32' y1='65' x2='125' y2='115' stroke='#38bdf8' stroke-width='2.5'/>
      <g transform='translate(50, 75) rotate(28)'>
        <rect x='0' y='-6' width='65' height='12' rx='2' fill='#64748b' opacity='0.6' stroke='#94a3b8'/>
        <text x='32' y='-8' font-size='7' font-weight='bold' fill='#38bdf8' text-anchor='middle'>II (Condenser)</text>
      </g>
      <text x='65' y='65' font-size='7' fill='#38bdf8'>Water out</text>
      <text x='95' y='125' font-size='7' fill='#38bdf8'>Water in</text>

      <!-- Receiver Flask III -->
      <polygon points='122,120 128,120 138,145 112,145' fill='#0284c7' opacity='0.2' stroke='#64748b' stroke-width='1.2'/>
      <text x='125' y='160' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>III (Distillate)</text>
      <text x='75' y='180' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Set-up A (Distillation)</text>
    </g>

    <!-- Set-up B: Magnetic Separation (Right) -->
    <g transform='translate(225, 30)'>
      <!-- Dish VII with Mixture of Sand and Iron Filings -->
      <ellipse cx='70' cy='120' rx='60' ry='22' fill='#334155' stroke='#94a3b8' stroke-width='1.5'/>
      <ellipse cx='70' cy='118' rx='52' ry='16' fill='#d97706' opacity='0.5'/>
      <!-- Mixture Specks -->
      <circle cx='50' cy='116' r='1.5' fill='#ffffff'/><circle cx='85' cy='122' r='1.5' fill='#ffffff'/>
      <circle cx='70' cy='114' r='1.5' fill='#ffffff'/><circle cx='95' cy='116' r='1.5' fill='#ffffff'/>
      <text x='138' y='122' font-size='9' font-weight='bold' fill='#d97706'>VII (Mixture)</text>

      <!-- Horseshoe Magnet VI Attracting Filings -->
      <g transform='translate(40, 15)'>
        <path d='M 15 65 L 15 25 Q 15 0 35 0 Q 55 0 55 25 L 55 65 L 42 65 L 42 25 Q 42 12 35 12 Q 28 12 28 25 L 28 65 Z' fill='#ef4444' stroke='#b91c1c' stroke-width='1.5'/>
        <!-- Magnet Poles at tips -->
        <rect x='15' y='52' width='13' height='13' fill='#cbd5e1'/>
        <rect x='42' y='52' width='13' height='13' fill='#3b82f6'/>
        <text x='-8' y='42' font-size='9' font-weight='bold' fill='#ef4444'>VI (Magnet)</text>
        <!-- Clinging Iron Filings -->
        <circle cx='21' cy='70' r='2' fill='#cbd5e1'/><circle cx='48' cy='70' r='2' fill='#cbd5e1'/>
      </g>
      <text x='70' y='175' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Set-up B (Magnetic)</text>
    </g>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// ============================================================================
// PAPER 2: PRACTICAL (SECTION A) & THEORY ESSAY (SECTION B)
// ============================================================================

export const SET_BECE_2025_SCIENCE_P2_QUESTIONS: Paper2Question[] = [
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Figure 1(a) is an illustration of a global biogeochemical cycle showing stages and processes:

${svgQ1aCarbonCycle}

(i) Name each of the biological or environmental stages labelled A, B, C, and D.
(ii) Name each of the biochemical or industrial processes labelled P, S, and T.
(iii) State three unsustainable anthropogenic (human) activities that disrupt the natural equilibrium of this cycle.`,
        workedSolution: `(i) Stages of the Carbon Cycle:
• Stage A: Green plants (Primary autotrophic producers)
• Stage B: Atmospheric carbon dioxide reservoir [$\\text{CO}_2$]
• Stage C: Animals (Primary and secondary consumers)
• Stage D: Decomposers (Soil organic matter / Saprophytes)

(ii) Processes:
• Process P: Photosynthesis (carbon fixation by plants)
• Process S: Fossilization (formation of fossil fuels over geological time)
• Process T: Industrial combustion (burning of fossil fuels in factories)

(iii) Human activities disrupting the cycle:
1. Widespread deforestation and clear-felling of tropical forests (destroys carbon sinks).
2. Excessive combustion of fossil fuels (petrol, diesel, coal) in industries and transportation.
3. Indiscriminate bush burning and wildfire clearing that releases massive amounts of carbon dioxide into the atmosphere.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `Figure 1(b) illustrates two traditional and modern farming systems practised in Ghana labelled K and L:

${svgQ1bFarmingSystems}

(i) Identify each of the farming systems labelled K and L.
(ii) Give a clear agronomic reason for each of the names identified in (b)(i).
(iii) State two ways in which farming system K was of practical importance to traditional farmers.
(iv) State three reasons why farming system K is no longer encouraged in modern agriculture.
(v) Name one category of crop that should be included in system L to naturally enhance soil fertility.`,
        workedSolution: `(i) Names of farming systems:
• System K: Shifting cultivation (or bush fallowing)
• System L: Crop rotation (four-course crop rotation)

(ii) Reasons for identification:
• System K: The farmer clears and cultivates a piece of land for a period, then abandons it to move to a new virgin plot (from A to B to C to D), allowing the abandoned land to fallow naturally.
• System L: Different crops are cultivated sequentially on the same partitioned plot of land in a definite cycle (plots 1, 2, 3, 4) across seasons.

(iii) Importance of System K:
1. Allows depleted soil to naturally regenerate its fertility, humus, and structure during long fallow periods without commercial chemical fertilizers.
2. Requires low financial capital and no costly chemical inputs.

(iv) Why System K is discouraged today:
1. High population growth and urban sprawl have created severe land scarcity, making long fallow periods impossible.
2. Encourages deforestation, habitat destruction, and biodiversity loss through continuous clearing and burning of virgin forests.
3. Requires excessive physical labor and delivers low economic crop yields per hectare.

(v) Crop category to improve fertility in System L:
Leguminous crops (e.g., cowpeas, soybeans, groundnuts) that harbor nitrogen-fixing *Rhizobium* bacteria in root nodules.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `Figure 1(c) illustrates a mason pulling a heavy concrete slab up an inclined plane using a rope:

${svgQ1cInclinedPlane}

(i) Give three practical everyday applications of inclined planes in society.
(ii) Given that Effort Force I is $400.0\\text{ N}$ moving through an effort distance of $10.0\\text{ m}$, while Load Weight Force II is $100.0\\text{ N}$ lifted through a vertical height of $5.0\\text{ m}$, calculate:
  (α) The mechanical work output;
  (β) The mechanical work input;
  (γ) The mechanical efficiency of the inclined plane.`,
        workedSolution: `(i) Everyday applications:
1. Sloped access ramps for hospital wheelchairs and cargo loading bays.
2. Winding roads and pathways ascending steep hillsides.
3. Staircases and pedestrian overpass bridges.
4. Screws, wood chisels, and wedges.

(ii) Calculations:
• (α) Work Output:
$$\\text{Work Output} = \\text{Load Force (II)} \\times \\text{Vertical Height}$$
$$\\text{Work Output} = 100.0\\text{ N} \\times 5.0\\text{ m} = 500.0\\text{ Joules (J)}$$

• (β) Work Input:
$$\\text{Work Input} = \\text{Effort Force (I)} \\times \\text{Ramp Length}$$
$$\\text{Work Input} = 400.0\\text{ N} \\times 10.0\\text{ m} = 4,000.0\\text{ Joules (J)}$$

• (γ) Mechanical Efficiency:
$$\\text{Efficiency} = \\frac{\\text{Work Output}}{\\text{Work Input}} \\times 100\\%$$
$$\\text{Efficiency} = \\frac{500.0\\text{ J}}{4,000.0\\text{ J}} \\times 100\\% = 12.5\\%$$
Answer: The efficiency of the inclined plane is $$12.5\\%$$.`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `Figure 1(d) illustrates two experimental laboratory separation set-ups A and B:

${svgQ1dSeparationSetups}

(i) Name the physical separation principle demonstrated in Set-up A and Set-up B.
(ii) Describe the specific functions of parts II and VI.
(iii) Name two specific materials that could be present in:
  (α) Flask receiver III in Set-up A;
  (β) Evaporating dish VII in Set-up B.
(iv) State the scientific reason why the direction of cooling water flow through Liebig condenser II in Set-up A must never be reversed.`,
        workedSolution: `(i) Scientific principles demonstrated:
• Set-up A: Simple distillation, based on differences in boiling points of miscible liquids.
• Set-up B: Magnetic separation, based on differences in magnetic properties (ferromagnetism).

(ii) Functions of parts:
• Part II (Liebig Condenser): Cools and condenses hot rising vapor into liquid distillate by circulating cold water around the inner vapor tube.
• Part VI (Horseshoe Magnet): Exerts a magnetic force to attract and separate ferromagnetic materials (iron filings) from non-magnetic substances.

(iii) Materials present:
• (α) In receiver III: Distilled pure water, pure ethanol, or liquid distillate.
• (β) In dish VII: A mixture of iron filings and sulfur powder (or iron filings and sand/sawdust).

(iv) Why condenser water flow must not be reversed:
Water must enter at the bottom and exit at the top to ensure the condenser jacket remains completely filled with cold water against gravity. Reversing flow creates air pockets and causes incomplete cooling, allowing vapor to escape without condensing.`,
        maxMarks: 10
      }
    ]
  },

  // SECTION B: THEORY ESSAYS (60 MARKS, 20 MARKS EACH)
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) State three practical methods of conserving electrical energy in a domestic household.\n(ii) A domestic air conditioner uses $4,000.0\\text{ W}$ of electric power continuously for 12 hours. Calculate the electrical energy consumed in kilowatt-hours (kWh) and Joules (J).",
        workedSolution: `(i) Energy conservation methods:
1. Switching off lights and unplugging electronic appliances when not in active use.
2. Replacing high-wattage incandescent filament bulbs with energy-efficient LED bulbs.
3. Using energy-rated star appliances and keeping refrigerator doors closed.

(ii) Energy calculation:
• Power in kilowatts: $P = \\frac{4,000\\text{ W}}{1,000} = 4.0\\text{ kW}$
• Time: $t = 12.0\\text{ hours}$
• Energy in kWh:
$$\\text{Energy} = P \\times t = 4.0\\text{ kW} \\times 12.0\\text{ h} = 48.0\\text{ kWh}$$
• Energy in Joules ($1\\text{ kWh} = 3.6 \\times 10^6\\text{ J}$):
$$\\text{Energy} = 48.0 \\times 3.6 \\times 10^6\\text{ J} = 1.728 \\times 10^8\\text{ Joules}$$
Answer: Energy consumed is $$48.0\\text{ kWh}\\quad (\\text{or } 1.728 \\times 10^8\\text{ J})$$.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: "(i) Name two common laboratory acid-base indicators.\n(ii) State the expected color change when each indicator named in (b)(i) is added to freshly squeezed orange juice.",
        workedSolution: `(i) Acid-base indicators:
1. Litmus paper (or litmus solution)
2. Methyl orange indicator
*(Alternative: Phenolphthalein / Universal indicator)*.

(ii) Colour changes in orange juice (acidic, $pH < 7$):
• Blue litmus: Turns red.
• Methyl orange: Turns pink / red.
• Phenolphthalein: Remains colorless.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) State four national policy initiatives or activities that could be undertaken to achieve a green economy in Ghana.\n(ii) Name two primary industrial greenhouse gases responsible for global warming.",
        workedSolution: `(i) Green economy initiatives:
1. Large-scale afforestation and reforestation to restore degraded forests.
2. Promoting renewable energy infrastructure (grid-scale solar and wind farms).
3. Implementing nationwide plastic waste recycling programs.
4. Transitioning public transit to electric buses and light rail.

(ii) Primary industrial greenhouse gases:
1. Carbon dioxide [$\\text{CO}_2$]
2. Methane [$\\text{CH}_4$]
*(Alternative: Nitrous oxide $\\text{N}_2\\text{O}$ or Chlorofluorocarbons CFCs)*.`,
        maxMarks: 6
      },
      {
        subId: "(d)",
        prompt: "Describe briefly how high-quality compost manure can be prepared using agricultural and household organic residues for a backyard garden.",
        workedSolution: `Backyard composting protocol:
1. Dig a pit (or build an elevated compost bin) in a shaded, well-drained area.
2. Layer alternating carbon-rich brown matter (dry leaves, straw) and nitrogen-rich green matter (kitchen scraps, fresh grass, animal manure).
3. Sprinkle water lightly over each layer to maintain moisture without waterlogging.
4. Turn the heap with a garden fork every 2 to 3 weeks to aerate the decomposing mass.
5. After 2 to 3 months, decomposition yields dark, crumbly, fertile compost ready for soil application.`,
        maxMarks: 3
      }
    ]
  },
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Name two:\n(i) Animal products used in formulating protein-rich poultry feed rations;\n(ii) Plant produces used in formulating carbohydrate-rich energy feed for poultry.",
        workedSolution: `(i) Animal protein sources:
1. Fish meal
2. Blood meal (or Bone meal / Meat-and-bone scrap)

(ii) Plant carbohydrate sources:
1. Yellow maize grain
2. Wheat bran / Wheat middlings (or Rice bran / Sorghum grain)`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "Describe briefly the continuous circulation of water in nature known as the hydrological (water) cycle.",
        workedSolution: `The water cycle:
1. Solar radiation heats oceans, lakes, and rivers, driving liquid water to vaporize into the atmosphere (evaporation).
2. Terrestrial plants release water vapor through stomatal pores into the air (transpiration).
3. Warm water vapor rises into the cooler upper atmosphere, cools below its dew point, and condenses around dust nuclei to form clouds (condensation).
4. Cloud droplets coalesce until heavy enough to fall to Earth as rain (precipitation).
5. Rainwater infiltrates the soil to replenish groundwater or flows across surface streams back into oceans (runoff), repeating the cycle continuously.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: "Consider the two common mixtures: Atmospheric Air and Domestic Vinegar:\n(i) Name the two major chemical components of each mixture;\n(ii) For each mixture, identify which component acts as the solvent.",
        workedSolution: `(i) Major components:
• Air: Nitrogen gas ($\\approx 78\\%$) and Oxygen gas ($\\approx 21\\%$).
• Vinegar: Water ($\\approx 95\\%$) and Ethanoic acid / Acetic acid ($\\approx 5\\%$).

(ii) Solvents in each mixture:
• In Air: Nitrogen gas acts as the solvent (the majority component in which oxygen dissolves).
• In Vinegar: Water acts as the solvent (dissolves the acetic acid solute).`,
        maxMarks: 6
      },
      {
        subId: "(d)",
        prompt: "(i) State two physical or chemical reasons why biological life cannot exist on the planet Jupiter.\n(ii) Name two other outer planets in the Solar System that cannot sustain life.",
        workedSolution: `(i) Why Jupiter cannot sustain life:
1. Lack of a solid surface: Jupiter is a gas giant composed primarily of hydrogen and helium fluids under extreme gravitational pressure.
2. Extreme atmospheric conditions: Severe atmospheric pressure, high radiation, and sub-zero temperatures (around $-145^\\circ\\text{C}$) prevent life.

(ii) Other outer planets:
Saturn, Uranus, or Neptune.`,
        maxMarks: 4
      }
    ]
  },
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "(i) Using the physical principles of pressure, explain why a kitchen knife is sharpened before slicing a yam.\n(ii) A downward force of $10.0\\text{ N}$ is exerted onto a yam using a knife edge of contact surface area $1.0 \\times 10^{-3}\\text{ m}^2$. Determine the cutting pressure exerted.",
        workedSolution: `(i) Why sharpening makes cutting easier:
Pressure is inversely proportional to surface area ($P = \\frac{F}{A}$). Sharpening a knife reduces the surface area of the cutting edge. Consequently, a modest muscular force generates a very high cutting pressure that easily slices through tough yam fibers.

(ii) Pressure calculation:
Formula:
$$\\text{Pressure } (P) = \\frac{\\text{Force } (F)}{\\text{Area } (A)}$$
Substitute given values ($F = 10.0\\text{ N}$, $A = 1.0 \\times 10^{-3}\\text{ m}^2$):
$$P = \\frac{10.0\\text{ N}}{1.0 \\times 10^{-3}\\text{ m}^2} = 10,000.0\\text{ Pascals (Pa)}$$
Answer: The pressure exerted is $$10,000\\text{ Pa}\\quad (\\text{or } 10\\text{ kPa})$$.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "Outline the laboratory experimental procedure used to estimate the pH value of a farmland soil sample.",
        workedSolution: `Procedure for soil pH testing:
1. Collect a representative soil sample, air-dry it, crush clods, and pass it through a $2\\text{ mm}$ sieve.
2. Weigh approximately $10\\text{ g}$ of soil into a clean beaker and add $25\\text{ cm}^3$ of distilled water (1:2.5 soil-to-water ratio).
3. Stir the suspension thoroughly with a glass rod for 5 minutes and allow it to stand for 30 minutes to settle.
4. Dip a strip of broad-range Universal Indicator paper into the supernatant liquid (or insert a calibrated digital pH meter electrode).
5. Compare the resulting color of the test strip against a standard pH color chart to determine the soil pH value.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: "A clinical patient's resting blood pressure reading is recorded as $150/90\\text{ mmHg}$:\n(i) State the clinical significance of these two numerical values;\n(ii) State three non-pharmacological lifestyle remedies that should be recommended to this patient.",
        workedSolution: `(i) Clinical significance:
• $150\\text{ mmHg}$ represents the systolic pressure (arterial pressure during left ventricular contraction), which is elevated above the normal $120\\text{ mmHg}$.
• $90\\text{ mmHg}$ represents the diastolic pressure (arterial pressure when the heart rests between beats), which is elevated at the hypertensive threshold ($80\\text{ mmHg}$ is normal).
• Overall reading indicates Stage 1/Stage 2 clinical hypertension.

(ii) Non-pharmacological remedies:
1. Reducing dietary sodium intake (low-salt diet) and avoiding processed fatty foods.
2. Engaging in regular moderate aerobic exercise (brisk walking, swimming) for at least 30 minutes daily.
3. Managing psychological stress and abstaining from tobacco smoking and excessive alcohol consumption.`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: "State three agronomic characteristics of silage that have made its adoption desirable for livestock feeding in dry-season farming.",
        workedSolution: `1. High Palatability: Lactic acid fermentation gives silage a pleasant aroma and taste that stimulates feed intake in cattle and sheep.
2. High Nutrient Retention: Retains green forage protein, vitamins, and energy far better than sun-dried hay.
3. Year-Round Feed Security: Preserves surplus wet-season forage for dry-season feeding when fresh pasture is scarce.`,
        maxMarks: 3
      }
    ]
  },
  {
    questionNumber: "5",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Explain briefly how each of the following agricultural farming systems is practised:\n(i) Organic farming;\n(ii) Mixed farming;\n(iii) Mixed cropping.",
        workedSolution: `(i) Organic farming:
An ecological agricultural system that relies on natural biological inputs (compost, animal manure, crop rotation, biological pest control) while strictly avoiding synthetic chemical fertilizers, pesticides, and GMOs.

(ii) Mixed farming:
An integrated farming system where crop cultivation and livestock rearing are practiced simultaneously on the same farm, allowing animal manure to fertilize crops and crop residues to feed livestock.

(iii) Mixed cropping (Intercropping):
The cultivation of two or more distinct crop species simultaneously on the same piece of land during the same growing season without strict row segregation.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "Classify a mixture of each of the following pairs of substances as either a Homogeneous mixture or a Heterogeneous mixture:\n(i) Vegetable cooking oil and water;\n(ii) Sodium chloride salt and water;\n(iii) Ethanol alcohol and water.",
        workedSolution: `Classification:
• (i) Oil and water: Heterogeneous mixture (immiscible two-phase emulsion).
• (ii) Salt and water: Homogeneous mixture (uniform single-phase solution).
• (iii) Ethanol and water: Homogeneous mixture (completely miscible single-phase solution).`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "(i) Give two scientific reasons why solar energy from the Sun is classified as a renewable energy source.\n(ii) In a clear tabular format, state three fundamental physical differences between heat and temperature.",
        workedSolution: `(i) Why solar energy is renewable:
1. Inexhaustible supply: It is derived from continuous thermonuclear fusion inside the Sun that will last billions of years without depletion.
2. Natural replenishment: It is continuously replenished naturally and cannot be exhausted by human consumption.

(ii) Heat vs. Temperature Distinction Table:

| Feature | Heat Energy | Temperature |
| :--- | :--- | :--- |
| **Definition** | Total thermal energy transferred between systems due to a temperature difference | Measure of the degree of hotness or coldness of a body (average particle kinetic energy) |
| **Type of Quantity** | Extensive form of energy dependent on mass | Intensive thermal state property independent of mass |
| **Measuring Instrument** | Calorimeter / Joule meter | Thermometer |
| **S.I. Unit** | **Joule [J]** | **Kelvin [K]** |`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: "Explain briefly two adverse ecological effects that each of the following environmental factors has on the global Nitrogen cycle:\n(i) Soil leaching;\n(ii) Widespread removal of leguminous plants.",
        workedSolution: `(i) Effects of soil leaching:
1. Depletes soluble plant-available nitrates ($\\text{NO}_3^-$) from the root zone, causing nitrogen deficiency in crops.
2. Contaminates groundwater and causes eutrophication in aquatic water bodies from percolating nitrates.

(ii) Effects of removing leguminous plants:
1. Reduces biological nitrogen fixation, as symbiotic *Rhizobium* root nodules are eliminated.
2. Lowers natural replenishment of soil nitrogen reserves, forcing farmers to rely on expensive synthetic chemical fertilizers.`,
        maxMarks: 6
      }
    ]
  }
];

// ============================================================================
// EXPORTED OBJECT WRAPPER
// ============================================================================

export const SET_BECE_2025_SCIENCE_P2 = {
  id: "paper_2025_variant_p2",
  year: 2025,
  setNumber: 119,
  paperType: 2,
  subject: "Integrated Science",
  title: "2025 BECE Integrated Science Paper 2 (Practical & Theory Essay Variant)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 130,
  instructions: "Answer four questions in all. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 5,
  questions: SET_BECE_2025_SCIENCE_P2_QUESTIONS
};
