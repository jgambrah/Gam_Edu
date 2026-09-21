/**
 * 2024 BECE Integrated Science Examination (Set 120 Cloned Practice Variant)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_2024_variant
 * Set Number: Set 120
 * Format: 
 *   - Paper 1 (40 Objectives, exactly 10 A, 10 B, 10 C, 10 D)
 *   - Paper 2 (Section A Practical [40 marks across Q1(a)-(d)] + Section B Theory [Q2-Q5, 20 marks each = 60 marks])
 * Reconstructed Visual Setups (Directly from photographic sources):
 *   - svgQ1aMammalianHeart: Longitudinal section of mammalian heart [IMG_2606.jpg]
 *   - svgQ1bPlantingMaterials: Three sets of planting materials (maize, tomato seedlings, cassava stakes) [IMG_2607.jpg]
 *   - svgQ1cMeasurementCircuit: Direct current circuit with cell, switch, resistor, voltmeter, ammeter [IMG_2608.jpg]
 *   - svgQ1dSeparatingFunnel: Separating funnel liquid-liquid extraction apparatus [IMG_2609.jpg]
 *   - svgQ5aParallelCircuit: Parallel circuit with 4-ohm and 5-ohm resistors connected to 6V battery [IMG_2612.jpg]
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

// ============================================================================
// RECONSTRUCTED VECTOR SVGS (HIGH CONTRAST & RESPONSIVE)
// ============================================================================

// SVG for Q1(a): Longitudinal Section of Mammalian Heart [Reconstructed from IMG_2606.jpg]
export const svgQ1aMammalianHeart = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 260' width='100%' height='240' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Outer Pericardial Contour & Myocardium -->
    <path d='M 120 70 C 80 70 70 120 80 160 C 90 200 150 240 190 245 C 230 240 300 195 300 150 C 300 100 270 70 240 70 C 210 70 195 90 190 95 C 185 90 160 70 120 70 Z' fill='#1e293b' stroke='#94a3b8' stroke-width='2'/>
    
    <!-- Thick Left Ventricular Myocardium V (Thicker wall on left side of diagram) -->
    <path d='M 210 140 C 230 140 280 150 280 170 C 280 195 230 230 195 235 L 195 140 Z' fill='#ef4444' opacity='0.3' stroke='#ef4444' stroke-width='1.5'/>
    <text x='250' y='195' font-size='10' font-weight='bold' fill='#ef4444'>V (Thick Muscle)</text>

    <!-- Thinner Right Ventricular Myocardium VI -->
    <path d='M 100 160 C 100 190 145 225 185 235 L 185 140 C 150 140 100 150 100 160 Z' fill='#38bdf8' opacity='0.25' stroke='#38bdf8' stroke-width='1.2'/>
    <text x='110' y='195' font-size='10' font-weight='bold' fill='#38bdf8'>VI</text>

    <!-- Superior Vena Cava IX (Right Atrium Entry) -->
    <rect x='105' y='20' width='22' height='55' rx='3' fill='#0284c7' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/>
    <line x1='116' y1='25' x2='116' y2='50' stroke='#ffffff' stroke-width='2'/>
    <polygon points='112,45 116,55 120,45' fill='#ffffff'/>
    <text x='95' y='35' font-size='11' font-weight='bold' fill='#38bdf8'>IX (Vena Cava)</text>

    <!-- Pulmonary Artery X -->
    <rect x='165' y='15' width='24' height='65' rx='3' fill='#0284c7' opacity='0.6' stroke='#38bdf8' stroke-width='1.5'/>
    <text x='160' y='10' font-size='10' font-weight='bold' fill='#38bdf8'>X (Pulm. Artery)</text>

    <!-- Aorta I (Arching Main Trunk) -->
    <path d='M 205 75 L 205 25 C 205 10 245 10 245 25 L 245 75' fill='none' stroke='#ef4444' stroke-width='8'/>
    <text x='255' y='32' font-size='11' font-weight='bold' fill='#ef4444'>I (Aorta)</text>

    <!-- Left Atrium II & Bicuspid Valve IV -->
    <circle cx='240' cy='115' r='18' fill='#ef4444' opacity='0.3' stroke='#f87171' stroke-width='1.5'/>
    <text x='270' y='115' font-size='10' font-weight='bold' fill='#ef4444'>II (Left Atrium)</text>
    <line x1='225' y1='135' x2='245' y2='135' stroke='#fde047' stroke-width='2'/>
    <text x='260' y='142' font-size='9' font-weight='bold' fill='#fde047'>IV (Bicuspid)</text>

    <!-- Right Atrium VIII & Tricuspid Valve VII -->
    <circle cx='135' cy='115' r='18' fill='#0284c7' opacity='0.3' stroke='#38bdf8' stroke-width='1.5'/>
    <text x='80' y='115' font-size='9' font-weight='bold' fill='#38bdf8'>VIII (R. Atrium)</text>
    <line x1='130' y1='135' x2='150' y2='135' stroke='#fde047' stroke-width='2'/>
    <text x='90' y='142' font-size='9' font-weight='bold' fill='#fde047'>VII (Tricuspid)</text>

    <!-- Interventricular Septum -->
    <line x1='190' y1='130' x2='190' y2='240' stroke='#cbd5e1' stroke-width='4'/>

    <text x='190' y='255' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>MAMMALIAN HEART: LEFT MYOCARDIUM (V) IS SIGNIFICANTLY THICKER THAN RIGHT (VI)</text>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// SVG for Q1(b): Three Sets of Planting Materials [Reconstructed from IMG_2607.jpg]
export const svgQ1bPlantingMaterials = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 180' width='100%' height='165' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Set P: Maize Grains (Seeds) -->
    <g transform='translate(35, 45)'>
      <ellipse cx='20' cy='20' rx='9' ry='13' fill='#facc15' stroke='#ca8a04' stroke-width='1.5'/>
      <ellipse cx='42' cy='25' rx='9' ry='13' fill='#facc15' stroke='#ca8a04' stroke-width='1.5'/>
      <ellipse cx='28' cy='45' rx='9' ry='13' fill='#facc15' stroke='#ca8a04' stroke-width='1.5'/>
      <text x='30' y='78' font-size='11' font-weight='bold' fill='#facc15' text-anchor='middle'>P</text>
      <text x='30' y='92' font-size='9' fill='#cbd5e1' text-anchor='middle'>(Maize Grains)</text>
    </g>

    <!-- Set Q: Tomato Seedlings (Nursery Transplants) -->
    <g transform='translate(150, 30)'>
      <!-- Seedling 1 -->
      <line x1='25' y1='80' x2='25' y2='30' stroke='#10b981' stroke-width='2.5'/>
      <ellipse cx='15' cy='35' rx='8' ry='5' fill='#10b981' transform='rotate(-25 15 35)'/>
      <ellipse cx='35' cy='32' rx='8' ry='5' fill='#10b981' transform='rotate(25 35 32)'/>
      <ellipse cx='25' cy='20' rx='8' ry='5' fill='#10b981'/>
      <!-- Seedling 2 -->
      <line x1='55' y1='80' x2='55' y2='40' stroke='#10b981' stroke-width='2'/>
      <ellipse cx='47' cy='45' rx='7' ry='4' fill='#10b981' transform='rotate(-20 47 45)'/>
      <ellipse cx='63' cy='42' rx='7' ry='4' fill='#10b981' transform='rotate(20 63 42)'/>
      <text x='40' y='95' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>Q</text>
      <text x='40' y='108' font-size='9' fill='#cbd5e1' text-anchor='middle'>(Tomato Seedlings)</text>
    </g>

    <!-- Set R: Cassava Stem Cuttings (Stakes with Nodes/Buds) -->
    <g transform='translate(270, 35)'>
      <!-- Cutting 1 -->
      <line x1='15' y1='80' x2='45' y2='15' stroke='#a16207' stroke-width='6' stroke-linecap='round'/>
      <line x1='20' y1='70' x2='28' y2='66' stroke='#ffffff' stroke-width='1.5'/>
      <line x1='29' y1='50' x2='37' y2='46' stroke='#ffffff' stroke-width='1.5'/>
      <line x1='38' y1='30' x2='46' y2='26' stroke='#ffffff' stroke-width='1.5'/>
      <!-- Cutting 2 -->
      <line x1='40' y1='85' x2='70' y2='20' stroke='#a16207' stroke-width='6' stroke-linecap='round'/>
      <line x1='45' y1='75' x2='53' y2='71' stroke='#ffffff' stroke-width='1.5'/>
      <line x1='54' y1='55' x2='62' y2='51' stroke='#ffffff' stroke-width='1.5'/>
      <text x='42' y='105' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>R</text>
      <text x='42' y='118' font-size='9' fill='#cbd5e1' text-anchor='middle'>(Cassava Cuttings)</text>
    </g>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// SVG for Q1(c): Direct Current Circuit with Voltmeter, Ammeter, and Resistor [Reconstructed from IMG_2608.jpg]
export const svgQ1cMeasurementCircuit = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 210' width='100%' height='195' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Top Wire Loop with Cell I and Switch II -->
    <line x1='40' y1='45' x2='150' y2='45' stroke='#38bdf8' stroke-width='2'/>
    
    <!-- DC Cell I -->
    <line x1='150' y1='30' x2='150' y2='60' stroke='#10b981' stroke-width='2.5'/>
    <line x1='158' y1='36' x2='158' y2='54' stroke='#ef4444' stroke-width='4'/>
    <text x='154' y='22' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I (Cell)</text>
    <line x1='158' y1='45' x2='235' y2='45' stroke='#38bdf8' stroke-width='2'/>

    <!-- Key / Switch II (Open) -->
    <circle cx='238' cy='45' r='2.5' fill='#e2e8f0'/>
    <line x1='238' y1='45' x2='262' y2='32' stroke='#e2e8f0' stroke-width='2'/>
    <circle cx='266' cy='45' r='2.5' fill='#e2e8f0'/>
    <text x='252' y='22' font-size='10' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>II (Switch)</text>
    <line x1='266' y1='45' x2='320' y2='45' stroke='#38bdf8' stroke-width='2'/>

    <!-- Right Bus with Series Ammeter -->
    <line x1='320' y1='45' x2='320' y2='80' stroke='#38bdf8' stroke-width='2'/>
    <circle cx='320' cy='95' r='14' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/>
    <text x='320' y='99' font-size='11' font-weight='bold' fill='#ffffff' text-anchor='middle'>A</text>
    <line x1='320' y1='110' x2='320' y2='135' stroke='#38bdf8' stroke-width='2'/>

    <!-- Bottom Branch with Resistor IV and Contact Node III -->
    <line x1='320' y1='135' x2='225' y2='135' stroke='#38bdf8' stroke-width='2'/>
    
    <!-- Resistor IV -->
    <rect x='130' y='125' width='70' height='20' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/>
    <text x='165' y='139' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>IV (Resistor)</text>
    
    <!-- Node / Terminal III -->
    <circle cx='215' cy='135' r='3.5' fill='#ffffff'/>
    <text x='215' y='120' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>III</text>

    <line x1='130' y1='135' x2='40' y2='135' stroke='#38bdf8' stroke-width='2'/>
    <line x1='40' y1='135' x2='40' y2='45' stroke='#38bdf8' stroke-width='2'/>

    <!-- Parallel Voltmeter Across Resistor IV -->
    <line x1='90' y1='135' x2='90' y2='175' stroke='#38bdf8' stroke-width='1.5'/>
    <line x1='240' y1='135' x2='240' y2='175' stroke='#38bdf8' stroke-width='1.5'/>
    <line x1='90' y1='175' x2='150' y2='175' stroke='#38bdf8' stroke-width='1.5'/>
    <circle cx='165' cy='175' r='14' fill='#1e293b' stroke='#10b981' stroke-width='2'/>
    <text x='165' y='179' font-size='11' font-weight='bold' fill='#ffffff' text-anchor='middle'>V</text>
    <line x1='180' y1='175' x2='240' y2='175' stroke='#38bdf8' stroke-width='1.5'/>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// SVG for Q1(d): Separating Funnel Set-up [Reconstructed from IMG_2609.jpg]
export const svgQ1dSeparatingFunnel = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 250' width='100%' height='230' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Retort Stand & Clamp -->
    <line x1='50' y1='235' x2='150' y2='235' stroke='#cbd5e1' stroke-width='3.5'/>
    <line x1='75' y1='235' x2='75' y2='30' stroke='#cbd5e1' stroke-width='3'/>
    <line x1='75' y1='115' x2='130' y2='115' stroke='#cbd5e1' stroke-width='2.5'/>
    <rect x='68' y='110' width='14' height='10' fill='#475569'/>

    <!-- Pear-shaped Separating Funnel Body -->
    <g transform='translate(100, 20)'>
      <!-- Upper Neck & Stopper -->
      <rect x='44' y='0' width='12' height='20' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Funnel Bulb -->
      <path d='M 44 20 C 15 45 15 95 38 125 L 46 145 L 46 175 L 54 175 L 54 145 L 62 125 C 85 95 85 45 56 20 Z' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='2'/>
      
      <!-- Top Less Dense Liquid Layer I (e.g. Kerosene/Oil) -->
      <path d='M 23 45 C 20 65 24 80 50 80 C 76 80 80 65 77 45 Z' fill='#f59e0b' opacity='0.6'/>
      <text x='85' y='60' font-size='10' font-weight='bold' fill='#f59e0b'>I (Oil/Kerosene)</text>

      <!-- Bottom Denser Liquid Layer (Water) -->
      <path d='M 24 80 C 24 95 38 125 46 145 L 54 145 C 62 125 76 95 76 80 Z' fill='#38bdf8' opacity='0.4'/>
      <text x='85' y='105' font-size='10' font-weight='bold' fill='#38bdf8'>Water</text>

      <!-- Stopcock / Tap II -->
      <rect x='40' y='148' width='20' height='7' rx='2' fill='#d97706'/>
      <circle cx='50' cy='151.5' r='2' fill='#ffffff'/>
      <text x='68' y='155' font-size='10' font-weight='bold' fill='#d97706'>II (Stopcock)</text>

      <!-- Lower Delivery Stem & Dripping Droplets -->
      <line x1='50' y1='155' x2='50' y2='190' stroke='#38bdf8' stroke-width='2.5'/>
      <circle cx='50' cy='198' r='1.5' fill='#38bdf8'/><circle cx='50' cy='205' r='1.5' fill='#38bdf8'/>
    </g>

    <!-- Conical Receiving Flask III with Drained Liquid IV -->
    <g transform='translate(125, 175)'>
      <polygon points='15,20 35,20 48,55 2,55' fill='#0284c7' opacity='0.25' stroke='#64748b' stroke-width='1.5'/>
      <rect x='4' y='42' width='42' height='12' fill='#38bdf8' opacity='0.5'/>
      <text x='58' y='32' font-size='9' font-weight='bold' fill='#64748b'>III (Flask)</text>
      <text x='58' y='50' font-size='9' font-weight='bold' fill='#38bdf8'>IV (Water)</text>
    </g>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// SVG for Q5(a): Parallel Circuit with 4-Ohm and 5-Ohm Resistors [Reconstructed from IMG_2612.jpg]
export const svgQ5aParallelCircuit = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 360 200' width='100%' height='185' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Top Wire Loop with 6V Battery and Switch -->
    <line x1='40' y1='45' x2='120' y2='45' stroke='#38bdf8' stroke-width='2'/>
    
    <!-- 6V Battery (3 Cells in Series) -->
    <g transform='translate(120, 45)'>
      <line x1='0' y1='-14' x2='0' y2='14' stroke='#10b981' stroke-width='2'/>
      <line x1='6' y1='-8' x2='6' y2='8' stroke='#ef4444' stroke-width='3.5'/>
      <line x1='14' y1='-14' x2='14' y2='14' stroke='#10b981' stroke-width='2'/>
      <line x1='20' y1='-8' x2='20' y2='8' stroke='#ef4444' stroke-width='3.5'/>
      <line x1='28' y1='-14' x2='28' y2='14' stroke='#10b981' stroke-width='2'/>
      <line x1='34' y1='-8' x2='34' y2='8' stroke='#ef4444' stroke-width='3.5'/>
      <text x='17' y='-20' font-size='11' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>6 V</text>
    </g>
    <line x1='154' y1='45' x2='210' y2='45' stroke='#38bdf8' stroke-width='2'/>

    <!-- Key / Switch in Open Position -->
    <circle cx='214' cy='45' r='2.5' fill='#e2e8f0'/>
    <line x1='214' y1='45' x2='238' y2='30' stroke='#e2e8f0' stroke-width='2'/>
    <circle cx='242' cy='45' r='2.5' fill='#e2e8f0'/>
    <line x1='242' y1='45' x2='300' y2='45' stroke='#38bdf8' stroke-width='2'/>

    <!-- Right Bus with Series Ammeter A -->
    <line x1='300' y1='45' x2='300' y2='80' stroke='#38bdf8' stroke-width='2'/>
    <circle cx='300' cy='95' r='14' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/>
    <text x='300' y='99' font-size='11' font-weight='bold' fill='#ffffff' text-anchor='middle'>A</text>
    <line x1='300' y1='110' x2='300' y2='140' stroke='#38bdf8' stroke-width='2'/>

    <!-- Parallel Resistor Network -->
    <line x1='300' y1='140' x2='250' y2='140' stroke='#38bdf8' stroke-width='2'/>
    <line x1='250' y1='120' x2='250' y2='160' stroke='#38bdf8' stroke-width='2'/>
    
    <!-- Top Branch: 4-Ohm Resistor -->
    <line x1='250' y1='120' x2='210' y2='120' stroke='#38bdf8' stroke-width='1.8'/>
    <rect x='150' y='110' width='60' height='20' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/>
    <text x='180' y='124' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>4 Ω</text>
    <line x1='150' y1='120' x2='110' y2='120' stroke='#38bdf8' stroke-width='1.8'/>

    <!-- Bottom Branch: 5-Ohm Resistor -->
    <line x1='250' y1='160' x2='210' y2='160' stroke='#38bdf8' stroke-width='1.8'/>
    <rect x='150' y='150' width='60' height='20' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/>
    <text x='180' y='164' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>5 Ω</text>
    <line x1='150' y1='160' x2='110' y2='160' stroke='#38bdf8' stroke-width='1.8'/>

    <line x1='110' y1='120' x2='110' y2='160' stroke='#38bdf8' stroke-width='2'/>
    <line x1='110' y1='140' x2='40' y2='140' stroke='#38bdf8' stroke-width='2'/>
    <line x1='40' y1='140' x2='40' y2='45' stroke='#38bdf8' stroke-width='2'/>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// ============================================================================
// PAPER 1: 40 OBJECTIVE QUESTIONS (EXACTLY 10 A, 10 B, 10 C, 10 D)
// ============================================================================

export const SET_BECE_2024_SCIENCE_P1_QUESTIONS: QuestionItem[] = [
  {
    number: 1,
    prompt: "Which of the following primary energy resources are classified as NON-RENEWABLE fuels?\nI. Bituminous Coal\nII. Solar radiation\nIII. Wind energy\nIV. Nuclear Uranium-236",
    options: [
      "I and IV only",
      "I, II and III only",
      "II, III and IV only",
      "II and III only"
    ],
    correctAnswer: "I and IV only",
    hint: "Fossil coal and fissile uranium exist in finite terrestrial reserves that cannot replenish on human timescales.",
    workedSolution: "Coal is a finite fossil fuel and Uranium-236 is a consumable nuclear ore; both are non-renewable. Solar and wind energy replenish naturally and continuously.",
    points: 1
  },
  {
    number: 2,
    prompt: "In physical chemistry, the fundamental building block of matter that represents the smallest indivisible unit retaining the chemical properties of an element is:",
    options: [
      "A charged ion",
      "An atom",
      "A polyatomic molecule",
      "An isolated proton"
    ],
    correctAnswer: "An atom",
    hint: "Consists of a central dense nucleus orbited by valence electrons.",
    workedSolution: "An atom is the smallest particle of an element that retains its chemical properties and identity, and can participate in chemical reactions.",
    points: 1
  },
  {
    number: 3,
    prompt: "Waste lubricating engine oil accidentally spilled across the surface of a stagnant roadside pool breeding mosquitoes, causing larvae to die. Which vector control method was demonstrated?",
    options: [
      "Biological control",
      "Chemical pesticide control",
      "Environmental / Physical control",
      "Genetic vector control"
    ],
    correctAnswer: "Environmental / Physical control",
    hint: "The oil forms an impermeable surface film that physically blocks the siphon breathing tubes of aquatic larvae.",
    workedSolution: "Spilling oil forms an oily surface film that alters the physical aquatic habitat, suffocating mosquito larvae by blocking their breathing spiracles (environmental/physical management).",
    points: 1
  },
  {
    number: 4,
    prompt: "Agricultural grasshopper pest management is critical for all of the following environmental and economic reasons EXCEPT:",
    options: [
      "Extensive chewing defoliation damage to cash crops",
      "Severe disruptions of agricultural agro-ecosystems",
      "Depleting pasture vegetation needed by livestock",
      "They undergo incomplete (hemimetabolous) metamorphosis"
    ],
    correctAnswer: "They undergo incomplete (hemimetabolous) metamorphosis",
    hint: "Incomplete metamorphosis is a biological lifecycle feature, not an economic reason for pest eradication.",
    workedSolution: "Grasshoppers cause crop destruction, forage depletion, and ecosystem imbalances. Undergoing incomplete metamorphosis is a developmental characteristic, not a justification for pest control.",
    points: 1
  },
  {
    number: 5,
    prompt: "A hunter experiences a sharp backward recoil force against their shoulder upon discharging a shotgun. Which of Newton's laws of motion is directly illustrated?",
    options: [
      "Newton's Third Law of Motion",
      "Newton's First Law of Motion",
      "Newton's Second Law of Motion",
      "The Law of Universal Gravitation"
    ],
    correctAnswer: "Newton's Third Law of Motion",
    hint: "'To every action, there is an equal and opposite reaction' ($F_{\\text{action}} = -F_{\\text{reaction}}$).",
    workedSolution: "Newton's third law states that whenever an object exerts a forward force on a bullet, the bullet exerts an equal and opposite backward recoil force on the gun and hunter.",
    points: 1
  },
  {
    number: 6,
    prompt: "Which of the following groups of instruments and domestic devices rely directly on the principles of magnetism and electromagnetism?",
    options: [
      "Loudspeakers, warning alarms, and liquid-crystal (LCD) television screens",
      "Dynamic moving-coil loudspeakers, magnetic navigation compasses, and electric alarms",
      "Navigation compasses, optical fiber lasers, and LCD monitors",
      "Electric irons, incandescent bulbs, and clinical thermometers"
    ],
    correctAnswer: "Dynamic moving-coil loudspeakers, magnetic navigation compasses, and electric alarms",
    hint: "LCD screens operate via liquid-crystal optical polarization, not magnetic coils.",
    workedSolution: "Loudspeakers use permanent magnets and voice coils, compasses use magnetized needles, and alarms use electromagnets. LCD screens operate via optical polarization.",
    points: 1
  },
  {
    number: 7,
    prompt: "Which of the following chemical elements contains electrons occupying four concentric Bohr energy shells in its ground state?",
    options: [
      "Aluminum [₁₃Al: 2, 8, 3]",
      "Phosphorus [₁₅P: 2, 8, 5]",
      "Potassium [₁₉K: 2, 8, 8, 1]",
      "Boron [₅B: 2, 3]"
    ],
    correctAnswer: "Potassium [₁₉K: 2, 8, 8, 1]",
    hint: "Element in Period 4 of the Periodic Table with atomic number 19.",
    workedSolution: "Potassium ($Z=19$) has an electronic configuration of $2, 8, 8, 1$, filling four electron shells ($K, L, M, N$). Aluminum and phosphorus occupy 3 shells; boron occupies 2.",
    points: 1
  },
  {
    number: 8,
    prompt: "To maintain optimal livestock herd health and disease resistance on a livestock farm, which veterinary management practices must be implemented?",
    options: [
      "Administering prophylactic vaccines and providing balanced rations only",
      "Providing balanced rations and daily pen sanitation only",
      "Administering vaccines and maintaining pen sanitation only",
      "Adhering to vaccination schedules, providing balanced rations, and maintaining strict pen sanitation (I, II, and III)"
    ],
    correctAnswer: "Adhering to vaccination schedules, providing balanced rations, and maintaining strict pen sanitation (I, II, and III)",
    hint: "Herd biosecurity requires prophylactic immunization, complete nutrition, and environmental cleanliness.",
    workedSolution: "Achieving livestock health requires complete biosecurity: vaccination prevents viral/bacterial infections, balanced rations prevent malnutrition, and sanitation reduces parasite loads.",
    points: 1
  },
  {
    number: 9,
    prompt: "Canned foods and beverages are labelled with explicit expiration dates. Consuming a spoiled canned drink past its expiry date carries the primary medical hazard of:",
    options: [
      "Acute bacterial food poisoning",
      "Permanent acoustic hearing loss",
      "Severe systemic pulmonary suffocation",
      "Immediate arterial atherosclerosis"
    ],
    correctAnswer: "Acute bacterial food poisoning",
    hint: "Microbial proliferation and bacterial enterotoxins (e.g., *Clostridium botulinum*) cause food-borne illness.",
    workedSolution: "Consuming expired canned foods risks ingestion of microbial toxins produced by decomposing bacteria, leading to severe gastrointestinal food poisoning.",
    points: 1
  },
  {
    number: 10,
    prompt: "Two unknown solutions labelled A and B were tested with litmus: red litmus paper turned blue in solution A, but remained red in solution B. Solution A is most likely:",
    options: [
      "Automobile lead-acid car battery fluid",
      "Aqueous baking soda (sodium hydrogen carbonate)",
      "Neutral sodium chloride salt solution",
      "Freshly squeezed citrus orange juice"
    ],
    correctAnswer: "Aqueous baking soda (sodium hydrogen carbonate)",
    hint: "Turning red litmus blue is the diagnostic test for an alkaline (basic) solution.",
    workedSolution: "Red litmus turning blue indicates a basic/alkaline solution ($pH > 7$). Baking soda ($\\text{NaHCO}_3$) is mildly basic, whereas battery acid and orange juice are acidic.",
    points: 1
  },
  {
    number: 11,
    prompt: "A student suffering from gastric hyperacidity was given an antacid medication labelled $\\text{Mg(OH)}_2$. What is the common pharmaceutical name of this compound?",
    options: [
      "Milk of aluminum",
      "Hydrated magnesium trisilicate",
      "Milk of magnesia",
      "Sodium effervescent liver salt"
    ],
    correctAnswer: "Milk of magnesia",
    hint: "An aqueous suspension of magnesium hydroxide used to neutralize excess stomach hydrochloric acid.",
    workedSolution: "Magnesium hydroxide [$\\text{Mg(OH)}_2$] suspension is commonly known as Milk of Magnesia, functioning as an antacid to neutralize excess gastric acid.",
    points: 1
  },
  {
    number: 12,
    prompt: "A metal pot of cold water placed over a lit gas burner gradually warms and reaches boiling point. By what primary heat transfer mechanism does heat circulate through the liquid?",
    options: [
      "Thermal radiation",
      "Cutaneous emission",
      "Direct conduction only",
      "Thermal convection currents"
    ],
    correctAnswer: "Thermal convection currents",
    hint: "Heated water expands, becomes less dense, and ascends while cooler, denser water descends.",
    workedSolution: "Heat conducts through the metal base, while heat distributes throughout the fluid via convection: warm, less-dense water rises, establishing circulating convection currents.",
    points: 1
  },
  {
    number: 13,
    prompt: "In atmospheric air (a gaseous solution of gases), which constituent gas acts as the chemical solvent?",
    options: [
      "Diatomic nitrogen gas [N₂] (constituting ~78% by volume)",
      "Diatomic oxygen gas [O₂]",
      "Carbon dioxide gas [CO₂]",
      "Inert argon gas [Ar]"
    ],
    correctAnswer: "Diatomic nitrogen gas [N₂] (constituting ~78% by volume)",
    hint: "In a solution, the component present in the largest proportion acts as the solvent.",
    workedSolution: "In a solution, the substance present in the greatest volume is the solvent. Nitrogen gas makes up approximately $78\\%$ of dry air, acting as the solvent for oxygen and trace gases.",
    points: 1
  },
  {
    number: 14,
    prompt: "Which natural meteorological optical phenomenon illustrates the dispersion of white sunlight into its constituent spectral colors?",
    options: [
      "A total solar eclipse",
      "A rainbow in the sky",
      "A sudden tropical rainfall",
      "An acoustic mountain echo"
    ],
    correctAnswer: "A rainbow in the sky",
    hint: "Spherical raindrops act as microscopic prisms that refract, reflect, and disperse sunlight.",
    workedSolution: "A rainbow is produced when spherical water raindrops refract, internally reflect, and disperse white sunlight into its spectral wavelengths (ROYGBIV).",
    points: 1
  },
  {
    number: 15,
    prompt: "When a straight wooden stick is partially immersed obliquely into a pool of clear water, the submerged portion appears to:",
    options: [
      "Appear significantly longer than its true physical length",
      "Bend downwards away from the water surface",
      "Bend upwards towards the water surface (appearing shallower)",
      "Remain completely straight and undistorted"
    ],
    correctAnswer: "Bend upwards towards the water surface (appearing shallower)",
    hint: "Light rays traveling from water into air refract away from the normal, elevating the virtual image.",
    workedSolution: "Due to refraction, light rays emerging obliquely from water into air speed up and bend away from the normal, causing the submerged object to appear displaced upward toward the surface.",
    points: 1
  },
  {
    number: 16,
    prompt: "Which of the following domestic electrical appliances convert electrical energy primarily into thermal heat energy?\nI. Electric pressing iron\nII. Electric water kettle\nIII. Immersion water heater",
    options: [
      "I and III only",
      "II and III only",
      "I and II only",
      "I, II and III"
    ],
    correctAnswer: "I, II and III",
    hint: "All three utilize high-resistance heating elements to produce heat via Joule heating ($P = I^2R$).",
    workedSolution: "Electric irons, kettles, and immersion heaters contain high-resistance heating elements that convert electrical current into thermal heat via Joule heating.",
    points: 1
  },
  {
    number: 17,
    prompt: "The adverse environmental consequences of the enhanced atmospheric greenhouse effect on human populations include:\nI. Inundation and flooding of low-lying coastal settlements\nII. Progressive desertification of fertile arable farmlands\nIII. Increased frequency and severity of tropical storms and hurricanes\nIV. Increased consumption of fossil fuels",
    options: [
      "I, II and III only",
      "I, II, III and IV",
      "II and III only",
      "I and II only"
    ],
    correctAnswer: "I, II and III only",
    hint: "Statement IV is a human cause that drives global warming, not an environmental consequence.",
    workedSolution: "Consequences of the enhanced greenhouse effect include rising sea levels, desertification, and intense storm patterns (I, II, and III). Burning fossil fuels is the causal driver, not an effect.",
    points: 1
  },
  {
    number: 18,
    prompt: "Cockroaches sheltering inside a closed kitchen cupboard are killed after an aerosolized chemical insecticide is sprayed into the room. The insecticide reached the pests via:",
    options: [
      "Osmotic suction pressure",
      "Molecular gas diffusion",
      "Direct capillary absorption",
      "Thermal electromagnetic radiation"
    ],
    correctAnswer: "Molecular gas diffusion",
    hint: "Volatile aerosol particles move spontaneously from higher to lower concentration.",
    workedSolution: "Aerosolized insecticide droplets vaporize and diffuse randomly through air particles down a concentration gradient, penetrating the cupboard and insect spiracles.",
    points: 1
  },
  {
    number: 19,
    prompt: "Which type of agricultural vegetable nursery bed design is suitable for nursing seedlings in a low-lying, flood-prone farmland?",
    options: [
      "A sunken nursery bed",
      "A plain level ground bed",
      "An elevated raised nursery bed",
      "A flat unprotected field bed"
    ],
    correctAnswer: "An elevated raised nursery bed",
    hint: "Raised beds elevate delicate seedling roots above the saturation line to prevent waterlogging.",
    workedSolution: "In flood-prone regions, raised beds are built $15-20\\text{ cm}$ above ground level to facilitate gravity drainage, preventing waterlogging and root rot. Sunken beds are used in arid zones.",
    points: 1
  },
  {
    number: 20,
    prompt: "Which of the following natural biogeochemical cycles directly utilize and depend upon radiant solar energy from the Sun?\nI. The Carbon Cycle\nII. The Hydrological (Water) Cycle\nIII. The Nitrogen Cycle",
    options: [
      "I, II and III",
      "II and III only",
      "I only",
      "I and II only"
    ],
    correctAnswer: "I and II only",
    hint: "The Sun drives evaporation in the water cycle and photosynthesis in the carbon cycle.",
    workedSolution: "The water cycle relies on solar radiation for evaporation, and the carbon cycle requires sunlight for plant photosynthesis. The nitrogen cycle is mediated by soil bacteria.",
    points: 1
  },
  {
    number: 21,
    prompt: "The primary physiological purpose of cellular aerobic respiration in the human body is to:\nI. Take in atmospheric oxygen\nII. Release carbon dioxide waste\nIII. Regulate internal core body temperature",
    options: [
      "I and II only",
      "I, II and III",
      "I and III only",
      "II and III only"
    ],
    correctAnswer: "I and II only",
    hint: "Gas exchange takes in oxygen for mitochondrial oxidation and expels carbon dioxide waste.",
    workedSolution: "Respiration consumes oxygen to oxidize glucose and releases carbon dioxide as a metabolic waste product (I and II). Core temperature is regulated by the hypothalamus and skin.",
    points: 1
  },
  {
    number: 22,
    prompt: "Severe deficiency of plant-available nitrogen in agricultural soils causes crop foliage to exhibit:",
    options: [
      "Stunted purplish pigmentation of leaf stems",
      "Chlorosis (generalized yellowing of leaves starting from older foliage)",
      "Premature flower abortion and fruit drop",
      "Severe blossom end rot on fruits"
    ],
    correctAnswer: "Chlorosis (generalized yellowing of leaves starting from older foliage)",
    hint: "Nitrogen is a structural component of the green chlorophyll molecule.",
    workedSolution: "Nitrogen is an essential constituent of chlorophyll and amino acids. Nitrogen deficiency impairs chlorophyll synthesis, causing chlorosis (yellowing of foliage).",
    points: 1
  },
  {
    number: 23,
    prompt: "An electric filament bulb is rated at an operating current of $0.5\\text{ A}$ under a potential difference of $120.0\\text{ V}$. Determine the electric power produced:",
    options: [
      "60 kW",
      "30 kW",
      "60 W",
      "30 W"
    ],
    correctAnswer: "60 W",
    hint: "$$\\text{Power } (P) = I \\times V = 0.5\\text{ A} \\times 120.0\\text{ V}$$.",
    workedSolution: "$$\\text{Electric Power } (P) = I \\times V = 0.5\\text{ A} \\times 120.0\\text{ V} = 60.0\\text{ Watts (W)}$$.",
    points: 1
  },
  {
    number: 24,
    prompt: "All of the following laboratory and domestic processes represent chemical changes EXCEPT the:",
    options: [
      "Combustion of dry firewood into ash and smoke",
      "Acid-base neutralization of hydrochloric acid with sodium hydroxide",
      "Electrochemical rusting of an iron nail exposed to air",
      "Mechanical crumpling and folding of a clean dry sheet of paper"
    ],
    correctAnswer: "Mechanical crumpling and folding of a clean dry sheet of paper",
    hint: "Crumpling paper changes only its physical shape and texture; no chemical bonds are altered.",
    workedSolution: "Crumpling paper is a physical change because cellulose molecules remain chemically intact. Burning wood, neutralization, and rusting produce new chemical substances.",
    points: 1
  },
  {
    number: 25,
    prompt: "Which of the following descriptions best defines the environmental and socioeconomic concept of a 'green economy'?",
    options: [
      "An economy that substantially reduces environmental risks and carbon emissions while restoring ecological biodiversity",
      "An economy that eliminates municipal ecological services",
      "An economic model characterized by rapid deforestation and biodiversity loss",
      "An industrial system based on unrestricted exploitation of coal resources"
    ],
    correctAnswer: "An economy that substantially reduces environmental risks and carbon emissions while restoring ecological biodiversity",
    hint: "Focuses on sustainable development, low carbon emissions, resource efficiency, and ecosystem protection.",
    workedSolution: "A green economy improves human well-being and social equity while significantly reducing environmental risks, ecological scarcities, and carbon emissions.",
    points: 1
  },
  {
    number: 26,
    prompt: "When solid sodium hydroxide pellets ($\\text{NaOH}$) dissolve in water, the beaker becomes hot to the touch. What energy transformation takes place?",
    options: [
      "Thermal heat energy is converted into gravitational potential energy",
      "Chemical potential energy is converted into thermal heat energy",
      "Chemical energy is converted into visible light energy",
      "Heat energy is converted into mechanical kinetic energy"
    ],
    correctAnswer: "Chemical potential energy is converted into thermal heat energy",
    hint: "An exothermic dissolution process releases heat as chemical hydration occurs.",
    workedSolution: "Dissolving sodium hydroxide in water is an exothermic process; the release of hydration energy converts chemical potential energy into thermal heat energy.",
    points: 1
  },
  {
    number: 27,
    prompt: "In the human digestive tract, the chemical enzymatic digestion of dietary starch contained in cooked rice begins in the:",
    options: [
      "Stomach cavity",
      "Muscular gullet (esophagus)",
      "Mouth (buccal cavity)",
      "Colon (large intestine)"
    ],
    correctAnswer: "Mouth (buccal cavity)",
    hint: "Saliva contains salivary amylase (ptyalin), which hydrolyzes cooked starch into maltose.",
    workedSolution: "Starch digestion begins in the mouth, where salivary amylase (ptyalin) in saliva hydrolyzes starch polysaccharides into maltose disaccharides.",
    points: 1
  },
  {
    number: 28,
    prompt: "Which chemical reagent is used internationally in large-scale municipal water treatment plants to disinfect water by destroying pathogenic bacteria?",
    options: [
      "Diatomic nitrogen gas",
      "Toxic hydrogen sulfide gas",
      "Compressed carbon dioxide",
      "Chlorine gas (or sodium hypochlorite)"
    ],
    correctAnswer: "Chlorine gas (or sodium hypochlorite)",
    hint: "Acts as a powerful oxidizing disinfectant that destroys water-borne pathogens.",
    workedSolution: "Chlorination is the primary disinfection stage in municipal waterworks; chlorine destroys pathogenic microorganisms, preventing water-borne epidemics like cholera.",
    points: 1
  },
  {
    number: 29,
    prompt: "In eukaryotic plant cells, the green photosynthetic pigment chlorophyll is localized within specialized double-membrane organelles called:",
    options: [
      "Chloroplasts",
      "Mitochondria",
      "Central fluid vacuoles",
      "Cell nuclei"
    ],
    correctAnswer: "Chloroplasts",
    hint: "Organelles containing thylakoid membranes where light reactions of photosynthesis occur.",
    workedSolution: "Chlorophyll pigments are embedded in the thylakoid membranes of chloroplasts, where they absorb light photons to drive photosynthesis.",
    points: 1
  },
  {
    number: 30,
    prompt: "An electrical engineer replaces a burned-out $20\\text{ W}$ light bulb with a $50\\text{ W}$ light bulb. The unit 'watt' (W) measures the bulb's:",
    options: [
      "Total accumulated electrical energy",
      "Electric power (rate of energy consumption per unit time)",
      "Mechanical work done",
      "Static electrical charge"
    ],
    correctAnswer: "Electric power (rate of energy consumption per unit time)",
    hint: "$$1\\text{ Watt} = 1\\text{ Joule per second}$$.",
    workedSolution: "The watt (W) is the derived S.I. unit of power, quantifying the rate at which electrical energy is transformed ($P = \\frac{E}{t}$).",
    points: 1
  },
  {
    number: 31,
    prompt: "When the $20\\text{ W}$ bulb is replaced with the $50\\text{ W}$ bulb in the school classroom, the $50\\text{ W}$ bulb will:\nI. Increase the illumination brightness in the room\nII. Increase the rate of electrical energy consumption\nIII. Completely eradicate the habitat of insect pests",
    options: [
      "I, II and III",
      "I and III only",
      "I and II only",
      "II and III only"
    ],
    correctAnswer: "I and II only",
    hint: "Higher wattage emits more light and consumes more energy, but brighter lights often attract nocturnal insects.",
    workedSolution: "A $50\\text{ W}$ bulb emits more luminous flux (greater brightness) and consumes more electrical energy than a $20\\text{ W}$ bulb (I and II). It does not eradicate pests.",
    points: 1
  },
  {
    number: 32,
    prompt: "All of the following domestic and laboratory devices operate on the principles of fluid pressure EXCEPT:",
    options: [
      "A liquid siphon tube",
      "A narrow plastic drinking straw",
      "A lift water hand pump",
      "A musical wind flute"
    ],
    correctAnswer: "A musical wind flute",
    hint: "Flutes operate on standing acoustic air-column resonance, not hydrostatic pressure differentials.",
    workedSolution: "Siphons, drinking straws, and water pumps operate via fluid pressure differentials. Flutes produce sound through acoustic air-column resonance.",
    points: 1
  },
  {
    number: 33,
    prompt: "In crafting jewelry and ornamental artifacts, noble metals (such as pure gold and platinum) are preferred primarily because they:",
    options: [
      "Do not react with atmospheric oxygen or moisture and retain their lustrous shine",
      "Corrode and oxidize rapidly",
      "Are highly reactive with household water",
      "Have zero tensile malleability"
    ],
    correctAnswer: "Do not react with atmospheric oxygen or moisture and retain their lustrous shine",
    hint: "Noble metals resist tarnishing, oxidation, and corrosion, preserving their metallic luster.",
    workedSolution: "Gold and platinum are unreactive noble metals positioned at the bottom of the reactivity series, resisting oxidation, tarnishing, and corrosion to maintain their luster.",
    points: 1
  },
  {
    number: 34,
    prompt: "When a metal ladle is left resting inside a pot of boiling soup, its handle becomes hot after several minutes. This occurs because the metallic atoms:",
    options: [
      "Undergo rapid, chaotic bulk circulating convection currents",
      "Contain delocalized mobile valence electrons that rapidly transfer thermal kinetic energy",
      "Are separated by large intermolecular empty spaces",
      "Lose all their nuclear protons to the soup"
    ],
    correctAnswer: "Contain delocalized mobile valence electrons that rapidly transfer thermal kinetic energy",
    hint: "Metals are superior thermal conductors because free electrons transport thermal energy through the lattice.",
    workedSolution: "Metals conduct heat via lattice vibrations and delocalized free electrons, which move through the metallic crystal to rapidly transfer thermal kinetic energy to the handle.",
    points: 1
  },
  {
    number: 35,
    prompt: "What is the simplest physical method for softening temporary hard well water to make it suitable for domestic laundry?",
    options: [
      "Adding copper sulfate crystals",
      "Passing the water through coarse sand filters",
      "Boiling the water thoroughly",
      "Adding chlorine bleaching powder"
    ],
    correctAnswer: "Boiling the water thoroughly",
    hint: "Thermal boiling decomposes soluble calcium hydrogencarbonate into insoluble calcium carbonate precipitate.",
    workedSolution: "Boiling decomposes dissolved calcium hydrogencarbonate: $\\text{Ca(HCO}_3)_2 \\xrightarrow{\\Delta} \\text{CaCO}_3\\downarrow + \\text{H}_2\\text{O} + \\text{CO}_2$, precipitating insoluble $\\text{CaCO}_3$ and softening the water.",
    points: 1
  },
  {
    number: 36,
    prompt: "A poultry farmer notices that commercial laying hens are laying eggs with soft, thin, and easily cracked shells. This defect is caused by a nutritional deficiency of:",
    options: [
      "Trace zinc minerals",
      "Magnesium ions",
      "Phosphorus alone",
      "Calcium (or Vitamin D₃)"
    ],
    correctAnswer: "Calcium (or Vitamin D₃)",
    hint: "Eggshells consist almost entirely of crystallized calcium carbonate ($\\text{CaCO}_3$).",
    workedSolution: "Avian eggshells consist of over 95% calcium carbonate. A dietary deficiency of calcium or Vitamin D3 prevents proper eggshell mineralization, producing thin-shelled eggs.",
    points: 1
  },
  {
    number: 37,
    prompt: "To correct the thin-shelled egg defect in laying hens, which feed ingredient should the farmer blend into the poultry ration?",
    options: [
      "Crushed oyster shell meal (or limestone grit)",
      "Crushed yellow maize grain",
      "Processed soybean meal",
      "Cooked cowpea seeds"
    ],
    correctAnswer: "Crushed oyster shell meal (or limestone grit)",
    hint: "A natural marine byproduct rich in calcium carbonate ($\\text{CaCO}_3$).",
    workedSolution: "Oyster shell meal consists of concentrated calcium carbonate ($\\text{CaCO}_3$). Adding it to poultry feed supplies the calcium needed for strong eggshell calcification.",
    points: 1
  },
  {
    number: 38,
    prompt: "Which of the following pairs of energy sources are clean, renewable, and environmentally friendly?",
    options: [
      "Bituminous coal and heavy thermal power",
      "Wind energy and anaerobically digested biogas",
      "Wind energy and bituminous coal",
      "Biogas and heavy diesel thermal plants"
    ],
    correctAnswer: "Wind energy and anaerobically digested biogas",
    hint: "Both wind and biogas are renewable resources that avoid fossil carbon emissions.",
    workedSolution: "Wind energy and biogas are renewable, low-carbon resources. Coal and diesel thermal generation release large quantities of sulfur dioxide, particulate soot, and greenhouse gases.",
    points: 1
  },
  {
    number: 39,
    prompt: "A student is tasked in a laboratory chemistry practical with dispensing exactly $20.0\\text{ cm}^3$ of aqueous sodium hydroxide. Which instrument should be selected?",
    options: [
      "A flexible surveyor's measuring tape",
      "A wet-and-dry bulb hygrometer",
      "A graduated measuring cylinder (or volumetric pipette)",
      "A floating liquid hydrometer"
    ],
    correctAnswer: "A graduated measuring cylinder (or volumetric pipette)",
    hint: "A calibrated glass container designed for measuring liquid volumes in cubic centimeters ($\\text{cm}^3$).",
    workedSolution: "A graduated measuring cylinder (or volumetric pipette) is designed to measure liquid volumes in $\\text{cm}^3$ or $\\text{mL}$. Hygrometers measure humidity, and hydrometers measure liquid density.",
    points: 1
  },
  {
    number: 40,
    prompt: "Clinical pediatric investigations show that a young child's daily diet is severely deficient in the trace mineral zinc. This deficiency is likely to result in:\nI. Impaired physical growth and developmental stunting\nII. Pernicious anemia and constipation\nIII. Weakened immune response and vulnerability to infections",
    options: [
      "I, II and III",
      "II and III only",
      "I and II only",
      "I and III only"
    ],
    correctAnswer: "I and III only",
    hint: "Zinc is essential for DNA synthesis, cellular growth, and immune function; iron deficiency causes anemia.",
    workedSolution: "Zinc is a cofactor for enzymes governing protein synthesis, cell division, and immune function. Zinc deficiency causes stunted growth and immune vulnerability (I and III). Iron deficiency causes anemia.",
    points: 1
  }
];

// ============================================================================
// PAPER 2: PRACTICAL (SECTION A) & THEORY ESSAY (SECTION B)
// ============================================================================

export const SET_BECE_2024_SCIENCE_P2_QUESTIONS: Paper2Question[] = [
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Fig. 1(a) is an illustration of the longitudinal section of the mammalian heart:

${svgQ1aMammalianHeart}

(i) State one physiological function for each of the cardiac parts labelled I, II, IX, and X.
(ii) Explain briefly why the left lower part of the heart (left ventricle V) possesses a significantly thicker muscular wall than the right lower part (right ventricle VI).
(iii) State two practical lifestyle habits by which the flow of blood to and from the mammalian heart can be maintained at healthy levels.
(iv) Name two anatomical chambers or vessels of the heart where oxygenated blood is found.`,
        workedSolution: `(i) Functions of labelled parts:
• Part I (Aorta): Conveys oxygenated blood under high systemic pressure from the left ventricle to all organs and tissues of the body.
• Part II (Left Atrium): Receives oxygenated blood returning from the lungs via the pulmonary veins and pumps it into the left ventricle.
• Part IX (Superior Vena Cava): Collects and returns deoxygenated venous blood from the upper body into the right atrium.
• Part X (Pulmonary Artery): Conveys deoxygenated blood under pressure from the right ventricle into the lungs for oxygenation.

(ii) Why the left ventricular muscle is thicker:
The left ventricle (V) must generate high hydrostatic pressure to pump blood through the systemic circulation to distant tissues against high vascular resistance. The right ventricle (VI) pumps blood through the shorter pulmonary circuit to the adjacent lungs under lower pressure.

(iii) Ways to maintain healthy blood flow:
1. Engaging in regular aerobic cardiovascular exercise (brisk walking, jogging) to strengthen heart muscles and maintain arterial elasticity.
2. Eating a balanced diet low in saturated fats, trans-fatty acids, and sodium to prevent atherosclerosis and hypertension.
3. Avoiding tobacco smoking and managing stress.

(iv) Chambers/vessels with oxygenated blood:
Left atrium, Left ventricle, Pulmonary veins, or Aorta.`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `Fig. 1(b) illustrates three sets of agricultural planting materials labelled P (maize grains), Q (tomato seedlings), and R (cassava stem cuttings):

${svgQ1bPlantingMaterials}

(i) Describe briefly how each of the planting materials labelled P, Q, and R is planted on a prepared seedbed.
(ii) State four agronomic conditions under which planting material R can be cultivated to produce high tuber yields.`,
        workedSolution: `(i) Planting procedures:
• Material P (Maize grains): Direct seeded by planting 2 to 3 seeds per hole at a soil depth of $2.5 - 3.0\\text{ cm}$, spaced $\\approx 75\\text{ cm} \\times 40\\text{ cm}$ apart, and covered with topsoil.
• Material Q (Tomato seedlings): Transplanted from a nursery bed when 3 to 4 weeks old, planted during late afternoon into moist holes spaced $60\\text{ cm} \\times 50\\text{ cm}$ apart, with soil firmed around roots and watered immediately.
• Material R (Cassava stem cuttings): Mature woody stem stakes ($20 - 25\\text{ cm}$ long with 4–6 nodes) are inserted into tilled mounds or ridges at a $45^\\circ$ angle with auxiliary buds pointing upward, burying two-thirds of the stake in the soil.

(ii) Conditions for high cassava yield (R):
1. Well-drained, fertile sandy-loam or friable soil that facilitates tuber expansion.
2. Adequate, well-distributed rainfall during the early vegetative phase, followed by warm sunshine.
3. Use of healthy, pest-free, high-yielding stem cuttings.
4. Regular weed management during the first 3 to 4 months of growth.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `Fig. 1(c) illustrates a laboratory direct-current measurement circuit:

${svgQ1cMeasurementCircuit}

(i) State one functional purpose for each of the circuit components labelled I, II, III, and IV.
(ii) If the voltmeter connected across IV reads $2.4\\text{ V}$ and the ammeter reads $0.8\\text{ A}$ when switch II is closed, calculate the resistance of component IV.
(iii) State one practical method of conserving the electrical energy stored in component I.
(iv) State two physical observations that can be made when switch II is closed.`,
        workedSolution: `(i) Functions of components:
• Component I (Chemical Dry Cell): Serves as the source of electromotive force (EMF), converting chemical potential energy into electrical energy to drive current.
• Component II (Switch / Key): Closes or opens the conductive path to start or stop current flow.
• Component III (Connecting Wire / Junction): Connects circuit elements and provides an unbroken path for charge flow.
• Component IV (Resistor): Offers electrical resistance to regulate current and produces a measurable potential difference.

(ii) Resistance calculation:
Formula:
$$R = \\frac{V}{I}$$
Substitute values ($V = 2.4\\text{ V}$, $I = 0.8\\text{ A}$):
$$R = \\frac{2.4\\text{ V}}{0.8\\text{ A}} = 3.0\\ \\Omega$$
Answer: The resistance of component IV is $$3.0\\ \\Omega$$.

(iii) Conserving cell I:
Open switch II immediately when readings are completed to prevent unnecessary current draw and battery discharge.

(iv) Observations when closed:
1. The pointer of the ammeter deflects to show current flow ($0.8\\text{ A}$).
2. The pointer of the voltmeter deflects to show potential difference ($2.4\\text{ V}$).`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `Fig. 1(d) illustrates a laboratory separation apparatus used to separate a heterogeneous liquid mixture:

${svgQ1dSeparatingFunnel}

(i) Describe briefly the step-by-step process of performing this separation experiment.
(ii) State one functional role for each of the parts labelled II and IV.
(iii) State two experimental precautions that must be observed to obtain reliable separation and prevent accidents during the procedure.`,
        workedSolution: `(i) Process of the experiment:
1. Pour the mixture of two immiscible liquids (oil and water) into the separating funnel with stopcock II closed, place the stopper on, and support it in a retort ring.
2. Invert the funnel and shake gently, periodically opening the stopcock to vent vapor pressure.
3. Place the funnel upright in the stand, remove the stopper, and allow it to stand undisturbed until two distinct liquid layers form.
4. Carefully open stopcock II to allow the denser bottom liquid (water IV) to drain slowly into receiving flask III, closing the stopcock when the interface reaches the bore.
5. Retain the less-dense upper liquid (oil I) in the funnel or pour it out through the top neck.

(ii) Functions of parts:
• Part II (Stopcock / Tap): Regulates and cuts off the drainage of liquid from the funnel.
• Part IV (Denser Liquid Layer / Water): The separated high-density component drained into the receiving flask.

(iii) Precautions:
1. Invert and vent the stopcock periodically during shaking to release internal vapor pressure.
2. Remove the top glass stopper before opening the stopcock to allow atmospheric pressure to facilitate steady drainage.
3. Keep the lower stem of the funnel in contact with the inner wall of the receiving flask to prevent splashing.`,
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
        prompt: `(i) With the aid of a clear ray diagram, describe how a sharp shadow of a tennis ball is cast onto a screen using a point light source (flashlight).
(ii) In a laboratory density displacement experiment, a student determines the volume of an irregular solid body of mass $4.0\\text{ kg}$ using a graduated measuring cylinder containing water. Setup A shows the initial water level at $50.0\\text{ cm}^3$ and Setup B shows the water level rising to $75.0\\text{ cm}^3$ after the body is submerged. Calculate the density of the irregular body.
(iii) State two experimental precautions that must be taken to ensure accurate volume measurement.`,
        workedSolution: `(i) Shadow formation:
• Ray diagram description: Diverging light rays from a small point source strike the opaque spherical tennis ball. Because light travels in straight lines (rectilinear propagation), the ball blocks the rays, casting a dark, sharp shadow (umbra) onto the screen behind it.

(ii) Density calculation:
• Mass: $m = 4.0\\text{ kg} = 4,000.0\\text{ g}$
• Initial volume: $V_1 = 50.0\\text{ cm}^3$
• Final volume: $V_2 = 75.0\\text{ cm}^3$
• Displaced volume:
$$V = V_2 - V_1 = 75.0\\text{ cm}^3 - 50.0\\text{ cm}^3 = 25.0\\text{ cm}^3$$
• Density formula:
$$\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)} = \\frac{4,000.0\\text{ g}}{25.0\\text{ cm}^3} = 160.0\\text{ g cm}^{-3}$$
$$(160,000.0\\text{ kg m}^{-3})$$
Answer: Density is $$160.0\\text{ g cm}^{-3}$$.

(iii) Precautions:
1. Lower the irregular body gently using a fine thread to avoid splashing water.
2. Read the graduated scale at eye level at the bottom of the water meniscus to avoid parallax error.
3. Ensure no air bubbles cling to the submerged body.`,
        maxMarks: 8
      },
      {
        subId: "(b)",
        prompt: "State three domestic safety precautions that must be strictly enforced to prevent fire outbreaks and gas explosions when using Liquefied Petroleum Gas (LPG) in the home.",
        workedSolution: `1. Ensure the kitchen or cooking area is well ventilated to prevent gas accumulation in the event of a leak.
2. Regularly inspect connecting rubber hoses, hose clips, and regulator valves for cracks or wear using soapy water (never test with an open flame).
3. Always strike a match or ignite the gas lighter first before turning on the burner gas control knob.
4. Keep the gas cylinder standing upright in a cool location away from direct heat sources.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "Explain briefly the core scientific principle underlying each of the following municipal waste management practices:\n(i) Composting;\n(ii) Recycling;\n(iii) Incineration.",
        workedSolution: `(i) Composting:
Relies on aerobic biological decomposition, where saprophytic microorganisms (bacteria and fungi) enzymatically digest biodegradable organic waste into stable, nutrient-rich humus under controlled moisture, temperature, and aeration.

(ii) Recycling:
Relies on physical sorting, thermal melting, and reprocessing of discarded materials (thermoplastics, metals, glass, paper) to manufacture new products, conserving virgin raw materials and reducing landfill waste.

(iii) Incineration:
Relies on high-temperature thermal oxidation (controlled combustion) to convert combustible solid waste into ash, flue gases, and heat, significantly reducing waste volume.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "Given two digestive tracts from domestic farm animals—one from a goat and one from a rabbit—outline three anatomical features that differentiate the two digestive systems.",
        workedSolution: `1. Stomach Structure: The goat is a ruminant with a complex, four-chambered stomach (rumen, reticulum, omasum, abomasum), whereas the rabbit is monogastric with a simple, single-chambered stomach.
2. Cecum Size and Function: The rabbit possesses an enlarged, functional cecum adapted for hindgut fermentation of cellulose, whereas the goat relies on foregut fermentation in the rumen.
3. Total Length of Alimentary Canal: The goat possesses a longer, wider gastrointestinal tract to process fibrous forage compared to the rabbit.`,
        maxMarks: 4
      }
    ]
  },
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "You are provided with maize, cowpea, cassava, and cabbage crops to cultivate on a farmland under a four-year crop rotation program:\n(i) Design a 4-year rotational cropping schedule on four partitioned plots;\n(ii) Give two agronomic reasons for the cropping sequence chosen.",
        workedSolution: `(i) 4-Year Crop Rotation Schedule:

| Year | Plot 1 | Plot 2 | Plot 3 | Plot 4 |
| :---: | :---: | :---: | :---: | :---: |
| **Year 1** | Cassava (Deep root) | Cowpea (Legume) | Maize (Gross feeder) | Cabbage (Shallow feeder) |
| **Year 2** | Cabbage | Cassava | Cowpea | Maize |
| **Year 3** | Maize | Cabbage | Cassava | Cowpea |
| **Year 4** | Cowpea | Maize | Cabbage | Cassava |

(ii) Agronomic reasons for sequence:
1. Alternating Nutrient Demand and Rooting Depths: Deep-rooted cassava absorbs nutrients from deeper soil horizons, while shallow-rooted cabbage feeds from topsoil, preventing depletion of specific horizons.
2. Nitrogen Replenishment: Planting nitrogen-fixing cowpeas before heavy-feeding maize naturally restores soil nitrate reserves without synthetic fertilizers.
3. Breaking Pest and Disease Cycles: Rotating botanical families deprives host-specific pests of continuous food sources.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "A student is suspected of contracting the viral respiratory infection COVID-19:\n(i) State three clinical symptoms that confirm this suspicion;\n(ii) Suggest two preventive measures to control the spread of COVID-19 in a school;\n(iii) Give two epidemiological reasons why COVID-19 was declared a global pandemic.",
        workedSolution: `(i) Clinical symptoms:
1. Persistent dry cough and high fever.
2. Sudden loss of taste (ageusia) or smell (anosmia).
3. Shortness of breath, fatigue, and sore throat.

(ii) School preventive measures:
1. Wearing protective face masks covering nose and mouth in enclosed classrooms.
2. Regular hand hygiene using alcohol-based hand rub or soap under running water.
3. Maintaining physical distancing and ensuring classroom cross-ventilation.

(iii) Reasons for pandemic status:
1. Rapid geographical spread across multiple continents and international borders.
2. Sustained person-to-person transmission through respiratory droplets, causing high infection rates and mortality worldwide.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: `A motor vehicle of mass $1,000.0\\text{ kg}$ travels initially at a velocity of $100.0\\text{ m s}^{-1}$. The driver accelerates the vehicle uniformly to $150.0\\text{ m s}^{-1}$ in $10.0\\text{ seconds}$. Calculate:
(i) The linear acceleration of the vehicle;
(ii) The accelerating force acting on the vehicle;
(iii) The final momentum of the vehicle when it is brought to a complete stop.`,
        workedSolution: `(i) Acceleration ($a$):
Formula:
$$a = \\frac{v - u}{t}$$
Substitute values ($u = 100.0\\text{ m s}^{-1}$, $v = 150.0\\text{ m s}^{-1}$, $t = 10.0\\text{ s}$):
$$a = \\frac{150.0\\text{ m s}^{-1} - 100.0\\text{ m s}^{-1}}{10.0\\text{ s}} = \\frac{50.0}{10.0} = 5.0\\text{ m s}^{-2}$$
Answer: Acceleration is $$5.0\\text{ m s}^{-2}$$.

(ii) Accelerating force ($F$):
Formula:
$$F = m \\times a$$
Substitute values ($m = 1,000.0\\text{ kg}$, $a = 5.0\\text{ m s}^{-2}$):
$$F = 1,000.0\\text{ kg} \\times 5.0\\text{ m s}^{-2} = 5,000.0\\text{ Newtons (N)}$$
Answer: Force is $$5,000.0\\text{ N}$$.

(iii) Final momentum when stopped ($v = 0$):
$$\\text{Momentum } (p) = m \\times v = 1,000.0\\text{ kg} \\times 0.0\\text{ m s}^{-1} = 0.0\\text{ kg m s}^{-1}$$
Answer: Final momentum is $$0\\text{ kg m s}^{-1}$$.`,
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
        prompt: "A student who went to bed immediately after a heavy meal complained of stomach discomfort and heartburn the next morning. A physician prescribed liver salt containing sodium hydrogen carbonate ($\\text{NaHCO}_3$). Using a balanced chemical equation, explain how the liver salt relieves the student's discomfort.",
        workedSolution: `Explanation & Equation:
Heartburn is caused by hyperacidity, where excess hydrochloric acid ($\\text{HCl}$) is secreted into the stomach. Sodium hydrogen carbonate ($\\text{NaHCO}_3$) in liver salt acts as an alkaline antacid that neutralizes the acid, forming harmless salt, water, and carbon dioxide:
$$\\text{NaHCO}_{3(s)} + \\text{HCl}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)} + \\text{CO}_{2(g)}$$
This neutralization raises the gastric pH toward normal, relieving discomfort.`,
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: `Fig. 4 illustrates a solid body of mass $20.0\\text{ kg}$ placed stationary on top of a boundary wall of height $10.0\\text{ m}$. Calculate the mechanical energy possessed by the body:
$$[\\text{Take acceleration due to gravity, } g = 10.0\\text{ m s}^{-2}]$$`,
        workedSolution: `Energy Calculation:
The elevated body possesses Gravitational Potential Energy ($P.E.$):
$$P.E. = m \\times g \\times h$$
Substitute values ($m = 20.0\\text{ kg}$, $g = 10.0\\text{ m s}^{-2}$, $h = 10.0\\text{ m}$):
$$P.E. = 20.0\\text{ kg} \\times 10.0\\text{ m s}^{-2} \\times 10.0\\text{ m} = 2,000.0\\text{ Joules (J)}$$
Answer: The mechanical energy of the body is $$2,000.0\\text{ J}$$.`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "(i) Define the term Light Emitting Diode (LED).\n(ii) Mention two common electronic devices that use LEDs in their operational design.",
        workedSolution: `(i) Definition of LED:
A semiconductor p-n junction diode that emits visible light photons through electroluminescence when forward-biased electric current flows through it.

(ii) Devices using LEDs:
1. Flat-screen television displays and computer monitors.
2. Traffic light control systems and automotive headlamps.
3. Digital clocks, indicator lamps, and domestic flashlights.`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "A student prepares a raised nursery bed for nursing tomato seeds:\n(i) Suggest two simple farm tools used in preparing the bed;\n(ii) State one functional purpose for each tool suggested.",
        workedSolution: `(i) Tools:
1. Garden spade (or hoe)
2. Garden rake (or hand fork)

(ii) Functions:
• Garden spade / hoe: Digs, turns over, and loosens compact topsoil, mounding it into a raised bed.
• Garden rake: Pulverizes soil clods, levels the nursery bed surface, and clears weeds and stones.`,
        maxMarks: 4
      },
      {
        subId: "(e)",
        prompt: "(i) State three microscopic structural features of a typical animal cell.\n(ii) State two physiological functions performed by mammalian nerve cells (neurons).",
        workedSolution: `(i) Features of an animal cell:
1. Bounded by a flexible plasma membrane (lacks a rigid outer cellulose cell wall).
2. Contains a membrane-bound nucleus and scattered mitochondria.
3. Possesses small, temporary vacuoles (lacks a large permanent central vacuole or chloroplasts).

(ii) Functions of nerve cells (neurons):
1. Transmit electrochemical impulses (action potentials) between receptors, the central nervous system, and effectors.
2. Process and coordinate sensory inputs to trigger rapid motor responses.`,
        maxMarks: 4
      }
    ]
  },
  {
    questionNumber: "5",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Fig. 5 is an electrical circuit diagram with a $6.0\\text{ V}$ battery connected across two parallel resistors of $4.0\\ \\Omega$ and $5.0\\ \\Omega$:

${svgQ5aParallelCircuit}

Calculate:
(i) The effective total resistance in the circuit when switch II is closed;
(ii) The total electric current flowing through the circuit ammeter when closed.`,
        workedSolution: `(i) Effective resistance ($R_p$):
For two resistors in parallel:
$$\\frac{1}{R_p} = \\frac{1}{R_1} + \\frac{1}{R_2}$$
$$\\frac{1}{R_p} = \\frac{1}{4} + \\frac{1}{5} = \\frac{5 + 4}{20} = \\frac{9}{20}$$
$$R_p = \\frac{20}{9} \\approx 2.22\\ \\Omega$$
Answer: Effective resistance is $$2.22\\ \\Omega$$.

(ii) Total circuit current ($I$):
From Ohm's law:
$$I = \\frac{V}{R_p} = \\frac{6.0\\text{ V}}{2.222\\ \\Omega} = 2.70\\text{ Amperes (A)}$$
Answer: The total current is $$2.70\\text{ A}$$.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "(i) Differentiate between an organic fertilizer and an inorganic fertilizer.\n(ii) Outline the practical steps involved in constructing a raised nursery bed.",
        workedSolution: `(i) Organic vs. Inorganic Fertilizer:
• Organic fertilizer: Soil amendments derived from biological plant or animal residues (farmyard manure, compost, green manure) that release nutrients slowly as they decompose.
• Inorganic fertilizer: Synthetically manufactured chemical mineral salts (NPK, urea, ammonium sulfate) that dissolve quickly to release readily available nutrients.

(ii) Steps in preparing raised beds:
1. Clear the site of weeds, debris, and stumps.
2. Dig the soil deeply with a spade or garden fork to loosen the subsoil.
3. Incorporate well-rotted organic compost to improve structure and moisture retention.
4. Mound and shape the topsoil into an elevated bed $15-20\\text{ cm}$ high and approximately $1\\text{ meter}$ wide.
5. Level the surface using a garden rake to create a fine, crumbly seedbed.`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `(i) State one physiological function for each of the following components of human blood:
  (α) Red blood cells (Erythrocytes);
  (β) White blood cells (Leukocytes);
  (γ) Blood plasma.
(ii) Explain briefly the biological impact on humans of:
  (α) The domestic housefly;
  (β) The field grasshopper.`,
        workedSolution: `(i) Functions of blood components:
• (α) Red blood cells: Transport oxygen from the lungs to metabolizing body tissues in the form of oxyhemoglobin.
• (β) White blood cells: Defend the body against infection via phagocytosis and antibody production.
• (γ) Blood plasma: Transports dissolved nutrients (glucose, amino acids), hormones, mineral ions, and metabolic urea.

(ii) Impacts on humans:
• (α) Housefly: Acts as a mechanical disease vector, transmitting pathogens like *Vibrio cholerae* (cholera) and typhoid onto food.
• (β) Grasshopper: An agricultural pest whose chewing mouthparts defoliate and destroy food crops, threatening food security.`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: "Describe briefly the formation of an ammonia molecule ($\\text{NH}_3$) through the covalent interaction between one Nitrogen atom ($_{7}\\text{N}$) and three Hydrogen atoms ($_{1}\\text{H}$).",
        workedSolution: `Formation of ammonia ($\\text{NH}_3$):
A nitrogen atom ($Z=7$) has an electronic configuration of $2, 5$, requiring 3 electrons to attain a stable octet. A hydrogen atom ($Z=1$) has 1 electron, requiring 1 electron to attain a stable duet.
During bonding, the nitrogen atom shares one electron with each of three hydrogen atoms, forming three single covalent electron pairs (three $\\text{N}-\\text{H}$ covalent bonds). The nitrogen atom retains one unshared lone pair, giving a trigonal pyramidal ammonia molecule ($\\text{NH}_3$).`,
        maxMarks: 4
      }
    ]
  }
];

// ============================================================================
// EXPORTED COMPOSITE OBJECTS
// ============================================================================

export const SET_BECE_2024_SCIENCE_P1 = {
  id: "paper_2024_variant",
  year: 2024,
  setNumber: 120,
  paperType: 1,
  subject: "Integrated Science",
  title: "2024 BECE Integrated Science Paper 1 (Objective Test)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: SET_BECE_2024_SCIENCE_P1_QUESTIONS
};

export const SET_BECE_2024_SCIENCE_P2 = {
  id: "paper_2024_variant_p2",
  year: 2024,
  setNumber: 120,
  paperType: 2,
  subject: "Integrated Science",
  title: "2024 BECE Integrated Science Paper 2 (Theory & Practical)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 130,
  instructions: "Answer four questions in all. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
  totalQuestions: 5,
  questions: SET_BECE_2024_SCIENCE_P2_QUESTIONS
};

export const SET_BECE_2024_SCIENCE_COMPLETE = {
  year: 2024,
  isVariant: true,
  setNumber: 120,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: SET_BECE_2024_SCIENCE_P1,
  paper2: SET_BECE_2024_SCIENCE_P2,
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 5,
    sourcePhotographsIntegrated: [
      "IMG_2606.jpg", "IMG_2607.jpg", "IMG_2608.jpg",
      "IMG_2609.jpg", "IMG_2610.jpg", "IMG_2611.jpg", "IMG_2612.jpg"
    ],
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
