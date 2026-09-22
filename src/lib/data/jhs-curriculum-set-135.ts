/**
 * SET 135: BECE Integrated Science Mock 4 (Standard Mock Suite - Final Benchmark)
 * Full Mock Examination Suite (Paper 1 Objective CBT + Paper 2 Theory & Practical)
 * Proprietary calibrated content © GAM IT Solutions (GAM EDU). All rights reserved.
 */

interface QuestionItem {
  number: number;
  prompt: string;
  correctAnswer: string;
  distractors: string[];
  hint: string;
  workedSolution: string;
  points: number;
}

// ==========================================
// PAPER 2 INLINE VECTOR SVGs (NEUTRAL LABELS)
// ==========================================

// SVG for Q1(a): Dispersion of White Light through a Triangular Glass Prism
const svgQ1aLightDispersion = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Narrow White Light Beam Ray from Left -->
    <line x1='30' y1='120' x2='110' y2='100' stroke='#ffffff' stroke-width='2.5'/>
    <polygon points='70,107 80,107 75,114' fill='#ffffff'/>
    <text x='65' y='90' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>Ray I</text>

    <!-- Triangular Glass Prism P -->
    <polygon points='145,35 95,150 195,150' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='2'/>
    <!-- Neutral Label P -->
    <circle cx='145' cy='110' r='9' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
    <text x='145' y='113' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>P</text>

    <!-- Refracted & Dispersed Rays Inside Prism -->
    <line x1='110' y1='100' x2='160' y2='90' stroke='#ef4444' stroke-width='1.5'/>
    <line x1='110' y1='100' x2='163' y2='105' stroke='#8b5cf6' stroke-width='1.5'/>

    <!-- Emerging Dispersed Spectrum Rays -->
    <!-- Red Ray II (Least deviated) -->
    <line x1='160' y1='90' x2='310' y2='65' stroke='#ef4444' stroke-width='2'/>
    <circle cx='280' cy='60' r='8' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/>
    <text x='280' y='63' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>II</text>

    <!-- Orange Ray -->
    <line x1='161' y1='93' x2='310' y2='78' stroke='#f97316' stroke-width='1.2'/>
    <!-- Yellow Ray -->
    <line x1='161' y1='96' x2='310' y2='90' stroke='#eab308' stroke-width='1.2'/>
    <!-- Green Ray -->
    <line x1='162' y1='99' x2='310' y2='102' stroke='#22c55e' stroke-width='1.2'/>
    <!-- Blue Ray -->
    <line x1='162' y1='102' x2='310' y2='114' stroke='#06b6d4' stroke-width='1.2'/>
    <!-- Indigo Ray -->
    <line x1='163' y1='104' x2='310' y2='126' stroke='#3b82f6' stroke-width='1.2'/>

    <!-- Violet Ray III (Most deviated) -->
    <line x1='163' y1='105' x2='310' y2='138' stroke='#8b5cf6' stroke-width='2'/>
    <circle cx='280' cy='145' r='8' fill='#1e293b' stroke='#8b5cf6' stroke-width='1.5'/>
    <text x='280' y='148' font-size='8' font-weight='bold' fill='#8b5cf6' text-anchor='middle'>III</text>

    <!-- White Display Screen IV -->
    <line x1='310' y1='40' x2='310' y2='165' stroke='#cbd5e1' stroke-width='4'/>
    <circle cx='335' cy='105' r='8' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/>
    <text x='335' y='108' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>IV</text>

    <text x='190' y='200' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>DISPERSION OF WHITE LIGHT: IDENTIFY RAY I, PRISM P, RAYS II & III, AND SCREEN IV</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(b): Simple Laboratory Distillation Setup (Neutralized Caption)
const svgQ1bSimpleDistillation = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Distillation Flask I with Thermometer on Left -->
    <g transform='translate(40, 45)'>
      <!-- Bunsen Burner Flame & Wire Gauze -->
      <line x1='15' y1='125' x2='65' y2='125' stroke='#94a3b8' stroke-width='2'/>
      <path d='M 40 150 Q 35 135 40 130 Q 45 135 40 150 Z' fill='#f59e0b'/>
      <!-- Round-bottom Flask I -->
      <circle cx='40' cy='90' r='25' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.8'/>
      <path d='M 22 98 A 24 24 0 0 0 58 98 Z' fill='#38bdf8' opacity='0.5'/>
      <rect x='36' y='40' width='8' height='30' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Thermometer T -->
      <line x1='40' y1='15' x2='40' y2='65' stroke='#ef4444' stroke-width='2'/>
      <circle cx='40' cy='67' r='2' fill='#ef4444'/>
      <circle cx='40' cy='5' r='7' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/>
      <text x='40' y='8' font-size='7' font-weight='bold' fill='#ef4444' text-anchor='middle'>T</text>
      <!-- Neutral Label I -->
      <circle cx='10' cy='75' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='10' y='78' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text>
      <!-- Side Delivery Arm -->
      <line x1='44' y1='55' x2='75' y2='70' stroke='#38bdf8' stroke-width='2.5'/>
    </g>

    <!-- Liebig Condenser II in Center -->
    <g transform='translate(115, 80)'>
      <!-- Inner Delivery Tube -->
      <line x1='0' y1='35' x2='150' y2='75' stroke='#38bdf8' stroke-width='2'/>
      <!-- Outer Cooling Jacket -->
      <polygon points='25,25 125,52 122,85 22,58' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='1.8'/>
      <!-- Water Inlet at bottom right (W_in) -->
      <line x1='110' y1='80' x2='110' y2='105' stroke='#10b981' stroke-width='2.5'/>
      <polygon points='107,90 110,80 113,90' fill='#10b981'/>
      <circle cx='110' cy='118' r='8' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='110' y='121' font-size='7' font-weight='bold' fill='#10b981' text-anchor='middle'>W₁</text>

      <!-- Water Outlet at top left (W_out) -->
      <line x1='35' y1='30' x2='35' y2='5' stroke='#38bdf8' stroke-width='2.5'/>
      <polygon points='32,15 35,5 38,15' fill='#38bdf8'/>
      <circle cx='35' cy='-8' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='35' y='-5' font-size='7' font-weight='bold' fill='#38bdf8' text-anchor='middle'>W₂</text>

      <!-- Neutral Label II -->
      <circle cx='70' cy='35' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='70' y='38' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>II</text>
    </g>

    <!-- Receiving Flask III with Pure Distillate on Right -->
    <g transform='translate(275, 140)'>
      <polygon points='12,20 28,20 38,55 2,55' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/>
      <rect x='4' y='42' width='32' height='12' fill='#38bdf8' opacity='0.6'/>
      <!-- Neutral Label III -->
      <circle cx='20' cy='72' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='20' y='75' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text>
    </g>

    <text x='190' y='215' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LABORATORY DISTILLATION APPARATUS: IDENTIFY COMPONENTS I, II, III, AND PORTS W1 & W2</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(c): Plant Cell Osmosis & Plasmolysis (Neutralized Labels)
const svgQ1cCellPlasmolysis = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Cell A (Left) -->
    <g transform='translate(35, 25)'>
      <text x='65' y='12' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cell A</text>
      <!-- Outer Cellulose Cell Wall -->
      <rect x='10' y='25' width='110' height='90' rx='10' fill='none' stroke='#10b981' stroke-width='3'/>
      <!-- Turgid Cytoplasm pressed against wall -->
      <rect x='14' y='29' width='102' height='82' rx='8' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Large Central Vacuole -->
      <ellipse cx='65' cy='70' rx='40' ry='28' fill='#38bdf8' opacity='0.4' stroke='#0284c7' stroke-width='1.5'/>
      <!-- Nucleus -->
      <circle cx='35' cy='50' r='8' fill='#ef4444' opacity='0.8'/>
      <!-- Neutral Label A -->
      <circle cx='65' cy='140' r='9' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='65' y='143' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>A</text>
    </g>

    <!-- Cell B (Right) -->
    <g transform='translate(210, 25)'>
      <text x='65' y='12' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Cell B</text>
      <!-- Outer Rigid Cell Wall retains shape -->
      <rect x='10' y='25' width='110' height='90' rx='10' fill='none' stroke='#10b981' stroke-width='3'/>
      <!-- Shrunken Cytoplasm pulled away from wall -->
      <path d='M 30 50 Q 65 35 90 55 Q 105 85 85 98 Q 50 110 30 85 Z' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='1.8'/>
      <!-- Shrunken Vacuole -->
      <ellipse cx='60' cy='75' rx='20' ry='14' fill='#38bdf8' opacity='0.4' stroke='#0284c7' stroke-width='1.2'/>
      <!-- Nucleus -->
      <circle cx='45' cy='60' r='7' fill='#ef4444' opacity='0.8'/>
      <!-- Water Movement Arrows -->
      <line x1='18' y1='40' x2='2' y2='30' stroke='#38bdf8' stroke-width='1.5'/>
      <line x1='110' y1='40' x2='125' y2='30' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Neutral Label B -->
      <circle cx='65' cy='140' r='9' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/>
      <text x='65' y='143' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>B</text>
    </g>

    <text x='190' y='195' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>OSMOSIS IN PLANT CELLS: MICROSCOPIC EXAMINATION OF CELLS A AND B IN LIQUID MEDIA</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(d): Horticultural Farm Hand Tools (Neutralized)
const svgQ1dFarmTools = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Tool I: Pickaxe / Mattock -->
    <g transform='translate(35, 25)'>
      <!-- Wooden Handle -->
      <line x1='40' y1='25' x2='40' y2='120' stroke='#a16207' stroke-width='4' stroke-linecap='round'/>
      <!-- Double-ended Steel Blade Head -->
      <path d='M 10 25 C 25 22 55 22 70 25 L 68 33 C 55 30 25 30 12 33 Z' fill='#64748b' stroke='#cbd5e1' stroke-width='1.5'/>
      <!-- Neutral Label I -->
      <circle cx='40' cy='145' r='9' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='40' y='148' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text>
    </g>

    <!-- Tool II: Hand Trowel -->
    <g transform='translate(125, 25)'>
      <!-- Short Handle -->
      <line x1='35' y1='100' x2='35' y2='125' stroke='#a16207' stroke-width='5' stroke-linecap='round'/>
      <!-- Curved Scooping Blade -->
      <path d='M 22 45 C 22 25 35 15 35 15 C 35 15 48 25 48 45 C 48 80 40 98 35 98 C 30 98 22 80 22 45 Z' fill='#64748b' stroke='#cbd5e1' stroke-width='1.5'/>
      <!-- Neutral Label II -->
      <circle cx='35' cy='145' r='9' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/>
      <text x='35' y='148' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II</text>
    </g>

    <!-- Tool III: Secateurs (Pruning Shears) -->
    <g transform='translate(210, 25)'>
      <!-- Handles -->
      <path d='M 25 125 C 20 95 30 75 35 65' stroke='#ef4444' stroke-width='3.5' fill='none'/>
      <path d='M 45 125 C 50 95 40 75 35 65' stroke='#ef4444' stroke-width='3.5' fill='none'/>
      <!-- Pivot Bolt -->
      <circle cx='35' cy='65' r='3' fill='#ffffff'/>
      <!-- Curved Cutting Blades -->
      <path d='M 35 65 C 25 45 30 25 40 20' stroke='#cbd5e1' stroke-width='2.5' fill='none'/>
      <path d='M 35 65 C 42 45 38 25 30 22' stroke='#cbd5e1' stroke-width='2.5' fill='none'/>
      <!-- Neutral Label III -->
      <circle cx='35' cy='145' r='9' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='35' y='148' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>III</text>
    </g>

    <!-- Tool IV: Garden Rake -->
    <g transform='translate(295, 25)'>
      <!-- Long Handle -->
      <line x1='35' y1='25' x2='35' y2='100' stroke='#a16207' stroke-width='3.5' stroke-linecap='round'/>
      <!-- Cross Bar with Teeth -->
      <line x1='10' y1='100' x2='60' y2='100' stroke='#64748b' stroke-width='3'/>
      <line x1='12' y1='100' x2='12' y2='120' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='23' y1='100' x2='23' y2='120' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='35' y1='100' x2='35' y2='120' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='47' y1='100' x2='47' y2='120' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='58' y1='100' x2='58' y2='120' stroke='#cbd5e1' stroke-width='2'/>
      <!-- Neutral Label IV -->
      <circle cx='35' cy='145' r='9' fill='#1e293b' stroke='#cbd5e1' stroke-width='1.5'/>
      <text x='35' y='148' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>IV</text>
    </g>

    <text x='190' y='192' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>HORTICULTURAL TOOLS: IDENTIFY TOOLS I, II, III, AND IV AND STATE ONE USE FOR EACH</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// ==========================================
// 40 OBJECTIVE TEST QUESTIONS (STRICT JHS NACCA STANDARDS)
// ==========================================
const balancedMock4P1: any[] = [
  {
    "number": 1,
    "prompt": "Which of the following substances is an alloy of copper and zinc?",
    "options": [
      "Steel",
      "Bronze",
      "Solder",
      "Brass"
    ],
    "correctAnswer": "Brass",
    "hint": "Bronze is copper and tin; this alloy is copper and zinc.",
    "workedSolution": "Brass is an alloy composed predominantly of copper and zinc. Bronze consists of copper and tin, while steel is iron and carbon.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "When a speeding passenger bus stops abruptly, the passengers lurch forward. This physical occurrence demonstrates",
    "options": [
      "Newton's First Law of Motion.",
      "Newton's Second Law of Motion.",
      "Newton's Third Law of Motion.",
      "the principle of conservation of momentum."
    ],
    "correctAnswer": "Newton's First Law of Motion.",
    "hint": "Inertia causes a body to maintain its state of uniform motion.",
    "workedSolution": "According to Newton's First Law (Law of Inertia), passengers continue moving forward with the bus's prior speed until an external braking force acts on them.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "The vegetative part of an onion plant modified for food storage is the",
    "options": [
      "swollen taproot.",
      "underground stem tuber.",
      "lateral runner.",
      "fleshy scale leaf."
    ],
    "correctAnswer": "fleshy scale leaf.",
    "hint": "An onion bulb consists of concentric modified leaves.",
    "workedSolution": "An onion bulb is a specialized underground shoot consisting of a reduced stem bearing concentric, fleshy scale leaves that store food reserves.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "Which of the following cellular organisms lacks a membrane-bound nucleus and is classified as prokaryotic?",
    "options": [
      "Amoeba",
      "Spirogyra",
      "Yeast cell",
      "Bacterium"
    ],
    "correctAnswer": "Bacterium",
    "hint": "Contains naked circular DNA in a nucleoid without a nuclear envelope.",
    "workedSolution": "Bacteria are unicellular prokaryotes lacking a membrane-bound nucleus or membrane-bound organelles. Amoeba, yeast, and spirogyra are eukaryotes.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "A bicycle dynamo generates electricity from the rotation of the bicycle wheel. What energy transformation takes place in the dynamo?",
    "options": [
      "Chemical energy to kinetic energy",
      "Kinetic energy to electrical energy",
      "Electrical energy to light energy",
      "Potential energy to sound energy"
    ],
    "correctAnswer": "Kinetic energy to electrical energy",
    "hint": "Mechanical movement of a magnet inside a coil induces current.",
    "workedSolution": "A bicycle dynamo uses electromagnetic induction to convert the mechanical kinetic energy of the turning wheel into electrical energy.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Which chemical compound is responsible for temporary hardness in natural well water?",
    "options": [
      "Calcium hydrogencarbonate",
      "Calcium sulfate",
      "Magnesium chloride",
      "Sodium carbonate"
    ],
    "correctAnswer": "Calcium hydrogencarbonate",
    "hint": "Decomposes on boiling to form calcium carbonate scale.",
    "workedSolution": "Temporary hardness is caused by dissolved calcium hydrogencarbonate, Ca(HCO₃)₂, or magnesium hydrogencarbonate, which decompose into insoluble carbonates upon heating.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "In human dentition, dental decay begins when mouth bacteria ferment food sugars to produce",
    "options": [
      "alkalis that dissolve dentine.",
      "enzymes that coat the cement.",
      "acids that demineralize enamel.",
      "toxins that harden the pulp cavity."
    ],
    "correctAnswer": "acids that demineralize enamel.",
    "hint": "Bacterial plaque produces acidic by-products that dissolve calcium enamel.",
    "workedSolution": "Mouth bacteria break down residual dietary sugars into organic acids that lower mouth pH, demineralizing and dissolving the outer tooth enamel.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Which farm tool is specifically used for leveling ploughed seedbeds and collecting uprooted weeds?",
    "options": [
      "Garden rake",
      "Hand trowel",
      "Pickaxe",
      "Pruning shears"
    ],
    "correctAnswer": "Garden rake",
    "hint": "Features metal tines mounted on a horizontal crossbar.",
    "workedSolution": "A garden rake has metal teeth designed to level tilled soil surfaces, pulverize surface clods, and gather uprooted weeds and debris.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "What is the total number of electrons present in an aluminum ion, Al³⁺, formed from an atom of aluminum (Z = 13)?",
    "options": [
      "3",
      "10",
      "13",
      "16"
    ],
    "correctAnswer": "10",
    "hint": "Aluminum loses its 3 valence electrons to achieve stability.",
    "workedSolution": "A neutral aluminum atom has 13 electrons (2, 8, 3). When forming the Al³⁺ cation, it loses its 3 valence electrons, leaving 10 electrons (2, 8).",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "The darkest, central region of a shadow where all light from an extended source is completely blocked is called the",
    "options": [
      "penumbra.",
      "spectrum.",
      "focus.",
      "umbra."
    ],
    "correctAnswer": "umbra.",
    "hint": "Total shadow; the partial shadow is the penumbra.",
    "workedSolution": "The umbra is the totally dark inner core of a shadow where all incident light rays from a source are blocked by an opaque body. The penumbra is the outer partial shadow.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "Why is mercury preferred over water as a thermometric liquid in laboratory thermometers?",
    "options": [
      "It wets the glass bore easily.",
      "It does not cling to the glass walls.",
      "It has a high freezing point of 0°C.",
      "It is transparent and colorless."
    ],
    "correctAnswer": "It does not cling to the glass walls.",
    "hint": "High cohesion prevents meniscus sticking; expands evenly.",
    "workedSolution": "Mercury has high surface tension and does not wet glass walls, has a wide liquid range (-39°C to 357°C), is opaque and silvery for easy reading, and conducts heat rapidly.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "The removal of the horn buds of young calves to prevent injury to other animals is known as",
    "options": [
      "culling.",
      "castrating.",
      "dehorning.",
      "docking."
    ],
    "correctAnswer": "dehorning.",
    "hint": "Also called disbudding in very young livestock.",
    "workedSolution": "Dehorning (or disbudding) is the physical or chemical removal of horn buds in livestock to prevent horned animals from injuring each other or farm handlers.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "Which of the following elements exists as allotropes in the forms of diamond and graphite?",
    "options": [
      "Carbon",
      "Silicon",
      "Sulfur",
      "Phosphorus"
    ],
    "correctAnswer": "Carbon",
    "hint": "Forms giant covalent lattices of either tetrahedral or planar hexagonal layers.",
    "workedSolution": "Carbon exists as allotropes: diamond (rigid tetrahedral network) and graphite (layered hexagonal sheets with delocalized electrons).",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "During human respiration, the diffusion of gases between the air and blood capillaries occurs across the walls of the",
    "options": [
      "bronchi.",
      "larynx.",
      "trachea.",
      "alveoli."
    ],
    "correctAnswer": "alveoli.",
    "hint": "Microscopic single-cell-thick air sacs in the lungs.",
    "workedSolution": "Alveoli provide an extensive, moist, single-cell-thick respiratory surface surrounded by pulmonary capillaries where oxygen and carbon dioxide diffuse.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "An electrical component used to adjust or vary the magnitude of current in an electric circuit is a",
    "options": [
      "transformer.",
      "voltmeter.",
      "capacitor.",
      "rheostat."
    ],
    "correctAnswer": "rheostat.",
    "hint": "A variable resistor with a sliding contact.",
    "workedSolution": "A rheostat (variable resistor) adjusts circuit resistance, allowing fine control over current flow.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "Which of the following agricultural practices helps to check severe wind erosion in open flat savannah farmlands?",
    "options": [
      "Planting shelterbelts",
      "Practicing clean weeding",
      "Ploughing along the slope",
      "Burning dry crop residues"
    ],
    "correctAnswer": "Planting shelterbelts",
    "hint": "Rows of dense trees planted across prevailing wind paths.",
    "workedSolution": "Shelterbelts (windbreaks) are linear tree barriers planted perpendicular to prevailing winds to reduce wind velocity and prevent topsoil detachment.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "A boy applies an effort force of 50 N to lift a load of 200 N using a simple lever. What is the Mechanical Advantage (MA) of the lever?",
    "options": [
      "0.25",
      "2.00",
      "4.00",
      "10.00"
    ],
    "correctAnswer": "4.00",
    "hint": "Mechanical Advantage = Load / Effort.",
    "workedSolution": "MA = Load / Effort = 200 N / 50 N = 4.00.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "In the female mammalian reproductive system, mature ova are released from the",
    "options": [
      "uterus.",
      "ovary.",
      "cervix.",
      "oviduct."
    ],
    "correctAnswer": "ovary.",
    "hint": "The primary female gonad where ovulation occurs.",
    "workedSolution": "The ovary is the primary female gonad responsible for oogenesis and the release of mature ova during ovulation.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "Which of the following mixtures can be separated by adding water, stirring, and filtering, followed by evaporation?",
    "options": [
      "Sand and common salt",
      "Kerosene and water",
      "Alcohol and water",
      "Iron filings and sulfur"
    ],
    "correctAnswer": "Sand and common salt",
    "hint": "One component dissolves in water while the other remains insoluble.",
    "workedSolution": "Salt dissolves in water while sand remains insoluble. Filtration collects the sand residue, and evaporation of the filtrate recovers pure salt crystals.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "A person who consumes a diet lacking in protein over a prolonged period is likely to develop",
    "options": [
      "rickets.",
      "scurvy.",
      "goiter.",
      "kwashiorkor."
    ],
    "correctAnswer": "kwashiorkor.",
    "hint": "Nutritional disorder characterized by edema, swollen belly, and wasting.",
    "workedSolution": "Kwashiorkor is a severe protein malnutrition disorder characterized by edema, swollen abdomen, skin depigmentation, and muscle wasting.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "What is the S.I. unit for measuring electrical resistance?",
    "options": [
      "Volt",
      "Ampere",
      "Ohm",
      "Watt"
    ],
    "correctAnswer": "Ohm",
    "hint": "Represented by the Greek symbol Omega (Ω).",
    "workedSolution": "The Ohm (Ω) is the S.I. derived unit of electrical resistance. Volts measure potential difference; Amperes measure current; Watts measure power.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "The practice of supporting trailing tomato and yam vines with upright wooden stakes is done primarily to",
    "options": [
      "absorb more soil moisture.",
      "prevent leaves and fruits from rotting on the ground.",
      "prevent birds from perching on the crops.",
      "reduce the transpiration rate of the leaves."
    ],
    "correctAnswer": "prevent leaves and fruits from rotting on the ground.",
    "hint": "Keeps foliage and fruits off wet soil to minimize fungal infections.",
    "workedSolution": "Staking keeps climbing vines and developing fruits elevated off moist soil, preventing soil-borne fungal infections, fruit rot, and facilitating sunlight capture.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "When an atom of sodium (₁₁Na) combines with an atom of chlorine (₁₇Cl), the sodium atom",
    "options": [
      "gains one electron to form an anion.",
      "loses one electron to form a cation.",
      "shares two electrons with the chlorine atom.",
      "gains seven electrons to fill its outer shell."
    ],
    "correctAnswer": "loses one electron to form a cation.",
    "hint": "Sodium has 1 valence electron (2, 8, 1) and readily donates it.",
    "workedSolution": "Sodium (2, 8, 1) loses its single valence electron to achieve a neon configuration (2, 8), forming a positively charged sodium cation (Na⁺).",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "In the human urinary system, urine flows from the kidneys to the urinary bladder through the",
    "options": [
      "renal arteries.",
      "urethras.",
      "ureters.",
      "nephron tubules."
    ],
    "correctAnswer": "ureters.",
    "hint": "Two muscular tubes leading from the renal pelvis down to the bladder.",
    "workedSolution": "The ureters are bilateral muscular ducts that convey urine from the renal pelvis of each kidney into the urinary bladder by peristalsis.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "An electric immersion heater of resistance 24 Ω is connected across a 240 V power supply. Calculate the current flowing through the heater.",
    "options": [
      "0.1 A",
      "5.7 A",
      "10.0 A",
      "24.0 A"
    ],
    "correctAnswer": "10.0 A",
    "hint": "Ohm's Law: Current = Voltage / Resistance.",
    "workedSolution": "I = V / R = 240 V / 24 Ω = 10.0 A.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "Which of the following substances will produce effervescence of carbon dioxide gas when mixed with dilute hydrochloric acid?",
    "options": [
      "Calcium carbonate",
      "Sodium chloride",
      "Copper metal",
      "Magnesium oxide"
    ],
    "correctAnswer": "Calcium carbonate",
    "hint": "Carbonates react with mineral acids to liberate carbon dioxide gas.",
    "workedSolution": "Calcium carbonate reacts with dilute hydrochloric acid to form calcium chloride, water, and effervescing carbon dioxide gas: CaCO₃ + 2HCl -> CaCl₂ + H₂O + CO₂↑.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "The transfer of heat by the actual bodily movement of heated fluid particles from one place to another is called",
    "options": [
      "conduction.",
      "radiation.",
      "absorption.",
      "convection."
    ],
    "correctAnswer": "convection.",
    "hint": "Occurs only in fluids (liquids and gases) via density currents.",
    "workedSolution": "Convection is heat transfer through fluids caused by density differences: heated fluid expands, becomes less dense, rises, and is replaced by cooler, denser fluid.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Which of the following crops is a cereal grain?",
    "options": [
      "Sorghum",
      "Cowpea",
      "Groundnut",
      "Soya bean"
    ],
    "correctAnswer": "Sorghum",
    "hint": "A grass crop cultivated for its edible grain seeds; the others are legumes.",
    "workedSolution": "Sorghum (along with maize, rice, and millet) is a graminaceous cereal crop cultivated for its starchy edible grains. Cowpea and groundnut are legumes.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "An optical pinhole camera produces an image that is always",
    "options": [
      "virtual and upright.",
      "real and inverted.",
      "magnified and upright.",
      "virtual and inverted."
    ],
    "correctAnswer": "real and inverted.",
    "hint": "Formed on a physical screen by intersecting straight rays from an aperture.",
    "workedSolution": "Because light travels in straight lines across the aperture, light rays cross, producing a real, inverted image on the screen.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "The function of white blood cells (leukocytes) in the human body is to",
    "options": [
      "transport oxygen to tissues.",
      "initiate blood clotting at wounds.",
      "protect the body against pathogen infections.",
      "distribute digested glucose throughout the body."
    ],
    "correctAnswer": "protect the body against pathogen infections.",
    "hint": "Cells of the immune system that perform phagocytosis and antibody synthesis.",
    "workedSolution": "White blood cells defend against microbial infections via phagocytosis and antibody production.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "Which of the following gas components of air supports the combustion of fuels?",
    "options": [
      "Oxygen",
      "Nitrogen",
      "Carbon dioxide",
      "Argon"
    ],
    "correctAnswer": "Oxygen",
    "hint": "Makes up ~21% of the atmosphere and reacts with fuels during burning.",
    "workedSolution": "Oxygen gas supports combustion; it serves as the oxidizing agent in chemical reactions between fuels and oxygen.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "The process whereby living organisms maintain a stable internal physiological state despite external environmental changes is called",
    "options": [
      "assimilation.",
      "transpiration.",
      "locomotion.",
      "homeostasis."
    ],
    "correctAnswer": "homeostasis.",
    "hint": "Regulates body temperature, blood glucose, and water balance.",
    "workedSolution": "Homeostasis is the biological maintenance of a dynamic, constant internal physiological environment (such as body temperature and osmoregulation).",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "A block of wood of mass 6 kg is hoisted vertically through a height of 3 m. Calculate the work done against gravity. [g = 10 m s⁻²]",
    "options": [
      "18 J",
      "60 J",
      "180 J",
      "300 J"
    ],
    "correctAnswer": "180 J",
    "hint": "Work done = Force x distance = (m x g) x h.",
    "workedSolution": "Weight = m x g = 6 kg x 10 m s⁻² = 60 N. Work Done = F x h = 60 N x 3 m = 180 J.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "In poultry production, debeaking is carried out on domestic fowls to",
    "options": [
      "improve egg incubation rates.",
      "increase feed consumption speed.",
      "control feather pecking and cannibalism.",
      "facilitate vaccination administration."
    ],
    "correctAnswer": "control feather pecking and cannibalism.",
    "hint": "Trimming the sharp tip of the upper beak.",
    "workedSolution": "Debeaking (beak trimming) removes the sharp tip of the upper mandible in domestic poultry to prevent cannibalism, feather pecking, and egg eating.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "When a beam of light passes from glass into air at an angle, the light ray",
    "options": [
      "bends toward the normal line.",
      "bends away from the normal line.",
      "travels straight without changing speed.",
      "reflects completely along its incident path."
    ],
    "correctAnswer": "bends away from the normal line.",
    "hint": "Light speeds up when emerging into an optically less dense medium.",
    "workedSolution": "Air is optically less dense than glass. Light speeds up as it leaves glass, causing the ray to bend away from the normal line (angle of refraction > angle of incidence).",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "Which of the following domestic substances will turn red litmus paper blue?",
    "options": [
      "Fresh lemon juice",
      "Wood ash solution",
      "Dilute vinegar",
      "Pure distilled water"
    ],
    "correctAnswer": "Wood ash solution",
    "hint": "Contains potassium carbonate and alkaline hydroxides (pH > 7).",
    "workedSolution": "Wood ash dissolved in water forms an alkaline solution containing potassium and carbonate hydroxides (pH > 7), turning red litmus paper blue.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "The reproductive organ in an angiosperm flower that produces pollen grains is the",
    "options": [
      "anther.",
      "stigma.",
      "ovary.",
      "sepal."
    ],
    "correctAnswer": "anther.",
    "hint": "The terminal pollen-bearing sac of the stamen.",
    "workedSolution": "The anther is the terminal pollen-producing organ of the male stamen where microspores undergo meiosis to form viable pollen grains.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "Which of the following organisms is an ectoparasite of farm cattle?",
    "options": [
      "Tapeworm",
      "Liver fluke",
      "Roundworm",
      "Tick"
    ],
    "correctAnswer": "Tick",
    "hint": "Attaches externally to the hide to suck blood.",
    "workedSolution": "Ticks are external blood-feeding ectoparasites that attach to cattle skin and transmit diseases like babesiosis. Tapeworms and flukes are endoparasites.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "The change of state directly from solid to gas without passing through a liquid phase is known as",
    "options": [
      "condensation.",
      "evaporation.",
      "sublimation.",
      "melting."
    ],
    "correctAnswer": "sublimation.",
    "hint": "Observed when heating ammonium chloride, dry ice, or camphor.",
    "workedSolution": "Sublimation is the direct phase transition of a substance from solid to gas without entering an intermediate liquid state.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "An inclined plane allows a heavy barrel to be rolled into a truck bed with less applied force because it",
    "options": [
      "reduces the weight of the barrel.",
      "increases the effort distance over the load height.",
      "eliminates all frictional resistance.",
      "decreases the total work required to lift the load."
    ],
    "correctAnswer": "increases the effort distance over the load height.",
    "hint": "Force multiplier: work is spread over a longer sloped distance.",
    "workedSolution": "An inclined plane acts as a mechanical force multiplier. By extending the sloped distance along which effort is exerted relative to the vertical lift height, it reduces the required input force.",
    "points": 1
  }
];

// ==========================================
// PAPER 2 ESSAY QUESTIONS BANK (STRICT JHS NACCA STANDARDS)
// ==========================================
const paper2Mock4Questions = [
  // ==========================================
  // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Figure 1(a) illustrates an optical experiment demonstrating the dispersion of a beam of light using a triangular glass prism:

${svgQ1aLightDispersion}

(i) Name the components labelled Ray I, Prism P, and Screen IV.
(ii) State the optical phenomenon demonstrated in this experiment.
(iii) Identify the spectral colors represented by rays II and III.
(iv) Explain why ray III is deviated (refracted) more than ray II by prism P.
(v) Name one natural atmospheric phenomenon that occurs as a result of the dispersion of sunlight.`,
        workedSolution: `(i) Names of components:
• Ray I: **Incident beam of white light**
• Prism P: **Triangular glass prism**
• Screen IV: **White display screen (or white cardboard sheet)**

(ii) Optical phenomenon:
**Dispersion of light** (the separation of white light into its constituent spectral colors).

(iii) Identification of rays:
• Ray II (least deviated): **Red light**
• Ray III (most deviated): **Violet light**

(iv) Explanation of deviation:
Glass has different refractive indices for different light wavelengths. Violet light (III) has a shorter wavelength and slows down more upon entering glass, refracting through a larger angle. Red light (II) has a longer wavelength and travels faster in glass, undergoing the least deviation.

(v) Natural phenomenon:
The formation of a **rainbow** in the sky after a rain shower (water droplets act as natural prisms that disperse sunlight).`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `Figure 1(b) illustrates a simple laboratory distillation apparatus set up to purify water from a salt solution:

${svgQ1bSimpleDistillation}

(i) Name each of the parts labelled I, II, and III.
(ii) State the specific functions of parts labelled T and II.
(iii) Indicate which of the tubes labelled $W_1$ or $W_2$ represents:
  (α) The cold water inlet;
  (β) The warm water outlet.
(iv) Explain why cooling water is introduced through the bottom ($W_1$) rather than the top ($W_2$).
(v) State one domestic or medical application of pure distilled water (collected in vessel III).`,
        workedSolution: `(i) Labelled parts:
• Part I: **Round-bottom distillation flask**
• Part II: **Liebig condenser**
• Vessel III: **Conical receiving flask (or beaker)**

(ii) Functions of components:
• Thermometer T: Monitors the boiling temperature of the vapor to ensure only pure water vapor ($100^\\circ\\text{C}$) passes into the condenser.
• Liebig Condenser II: Cools and condenses hot water vapor back into liquid water.

(iii) Water connections:
• (α) Cold water inlet: **$W_1$ (bottom connection)**
• (β) Warm water outlet: **$W_2$ (top connection)**

(iv) Why water enters through $W_1$:
Introducing cold water at the bottom ensures the condenser jacket remains completely filled with water without air pockets, providing efficient heat exchange and counter-current cooling.

(v) Applications of distilled water:
1. Preparing clinical medicines and liquid pharmaceutical injections.
2. Topping up lead-acid car battery electrolyte solutions.
3. Conducting quantitative chemical experiments in laboratories.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `Figure 1(c) illustrates two epidermal plant cells A and B placed in different liquid solutions:

${svgQ1cCellPlasmolysis}

(i) State the physiological condition of:
  (α) Cell A;
  (β) Cell B.
(ii) Name the type of solution in which each cell was placed:
  (α) Cell A;
  (β) Cell B.
(iii) Name the biological process that caused the change in Cell B.
(iv) State what happens to the size and shape of Cell B if it is removed from the concentrated solution and placed in pure distilled water for two hours.`,
        workedSolution: `(i) Condition of cells:
• (α) Cell A: **Turgid (fully swollen and firm)**
• (β) Cell B: **Plasmolyzed (flaccid, with cytoplasm pulled away from the cell wall)**

(ii) Solutions:
• (α) Cell A: **Hypotonic solution (pure distilled water / dilute solution)**
• (β) Cell B: **Hypertonic solution (concentrated salt or sugar solution)**

(iii) Biological process:
**Plasmolysis** (caused by exosmosis — water moves out of the central vacuole into the hypertonic external solution down a water potential gradient).

(iv) Effect of returning Cell B to pure water:
**Deplasmolysis occurs:** Water enters the cell by endosmosis; the central vacuole swells with water, pushing the cytoplasm back against the cell wall to restore the cell to a **turgid state**.`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `Figure 1(d) illustrates four common handheld tools used on a vegetable farm:

${svgQ1dFarmTools}

(i) Name each of the farm tools labelled I, II, III, and IV.
(ii) State one practical agricultural use for each tool.
(iii) State two maintenance practices used to keep these tools in good working order.`,
        workedSolution: `(i) Names of tools:
• Tool I: **Pickaxe (or Mattock)**
• Tool II: **Hand trowel**
• Tool III: **Secateurs (pruning shears)**
• Tool IV: **Garden rake**

(ii) Practical agricultural uses:
• Tool I (Pickaxe/Mattock): Digging hard, compacted soils and removing tree roots and rocks during land preparation.
• Tool II (Hand trowel): Scooping soil to transplant delicate vegetable seedlings from nursery beds into the field.
• Tool III (Secateurs): Pruning unwanted branches, trimming shoots, and harvesting fruit stems cleanly.
• Tool IV (Garden rake): Leveling tilled seedbeds, breaking surface soil crusts, and gathering weeds and stones.

(iii) Maintenance practices:
1. Wash and dry tools thoroughly after use to remove adhering moist soil.
2. Sharpen cutting blades regularly (e.g., mattock edges, secateurs).
3. Apply oil or grease to metal parts and cutting joints to prevent rusting.
4. Replace loose or cracked wooden handles.`,
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
        prompt: `(i) Name the four types of human teeth in an adult dentition and state the primary mechanical feeding function of each.
(ii) Explain how bacterial plaque leads to dental caries (tooth decay) and state two oral hygiene practices that prevent dental disease.`,
        workedSolution: `(i) Four types of adult teeth and functions:
1. **Incisors:** Chisel-shaped front teeth for **cutting and biting** food.
2. **Canines:** Pointed, dagger-like teeth for **tearing and ripping** tough food (meat).
3. **Premolars:** Flat crowns with two cusps for **crushing and grinding** food.
4. **Molars:** Broad surface with four or five cusps for **heavy grinding and chewing** food.

(ii) Dental caries formation & prevention:
• **Mechanism:** Bacteria in dental plaque ferment residual sugars from trapped food particles, producing organic acids. These acids slowly dissolve and demineralize the hard enamel and dentine layers, creating cavities (caries).
• **Oral hygiene practices:**
1. Brushing teeth thoroughly with fluoride toothpaste at least twice daily (morning and before bed).
2. Rinsing the mouth with water after meals and avoiding frequent sugary sweets.
3. Visiting a dental clinic periodically for professional check-ups.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) In human renal physiology, distinguish between ultrafiltration and selective reabsorption occurring in the kidney nephron.
(ii) Name two metabolic waste products excreted by the human kidneys in urine.
(iii) State two healthy daily habits that support proper kidney function.`,
        workedSolution: `(i) Ultrafiltration vs. Selective Reabsorption:
• **Ultrafiltration:** The non-selective pressure-driven filtration of blood plasma across glomerular capillaries into Bowman's capsule under high hydrostatic pressure, separating water, urea, glucose, and salts while leaving blood cells and plasma proteins in the blood.
• **Selective Reabsorption:** The active and passive transport of essential nutrients (all glucose, amino acids, and requisite water and mineral ions) from the nephron renal tubules back into surrounding capillary blood.

(ii) Metabolic waste products in urine:
1. **Urea** (from deamination of excess amino acids in the liver).
2. **Uric acid** (from nucleic acid breakdown).
3. **Excess mineral salts** (sodium chloride) and creatinine.

(iii) Habits supporting kidney health:
1. Drinking sufficient clean drinking water daily to facilitate metabolic waste clearance.
2. Moderating dietary salt and processed food intake to prevent hypertension.`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `(i) State two ways by which flowering plants eliminate metabolic wastes in the absence of specialized excretory organs.
(ii) Name two waste substances produced by plants that are commercially useful to humans.`,
        workedSolution: `(i) Plant excretory mechanisms:
1. **Diffusion through Stomata and Lenticels:** Excess oxygen (from photosynthesis) and carbon dioxide/water vapor (from cellular respiration) diffuse out into the atmosphere.
2. **Abscission (Leaf Shedding):** Waste crystals (calcium oxalate) stored in leaves, bark, and fruit are permanently shed when leaves drop during the dry season.

(ii) Commercially useful plant waste products:
1. **Natural Rubber Latex** (from *Hevea brasiliensis*, used to manufacture vehicle tires and gloves).
2. **Gums and Resins** (used in adhesives, varnishes, and perfumes).
3. **Quinine / Tannins** (used in pharmaceuticals and leather tanning).`,
        maxMarks: 6
      }
    ]
  },
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) In electronics, explain the difference between the forward-biased and reverse-biased states of a semiconductor p-n junction diode.
(ii) What is electrical rectification? Explain why semiconductor diodes are essential components in mobile phone chargers.
(iii) State the function of a Light Emitting Diode (LED) and give one reason why LEDs are preferred over traditional filament bulbs in home lighting.`,
        workedSolution: `(i) Forward Bias vs. Reverse Bias:
• **Forward Bias:** The positive terminal of the power supply is connected to the p-type anode and the negative terminal to the n-type cathode, narrowing the depletion layer and allowing electric current to flow freely with low resistance.
• **Reverse Bias:** The positive terminal is connected to the n-type cathode and the negative terminal to the p-type anode, widening the depletion layer and preventing electric current from flowing (high resistance).

(ii) Electrical rectification & phone chargers:
• **Rectification:** The conversion of alternating current (AC) which reverses direction periodically into direct current (DC) which flows in only one direction.
• **Phone chargers:** Mobile phone lithium-ion batteries require steady direct current (DC) for charging. Diodes arranged in a rectifier bridge convert the $240\\text{ V}$ AC mains supply into unidirectional DC.

(iii) LEDs in home lighting:
• **Function:** An LED converts electrical energy directly into visible light when forward-biased.
• **Advantage:** LEDs consume significantly less electrical energy (high luminous efficiency) and have a much longer operating lifespan compared to incandescent filament bulbs.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) State Ohm's Law for an electrical conductor.
(ii) An electric heating element of resistance $60.0\\ \\Omega$ is connected across a $240.0\\text{ V}$ domestic mains supply. Calculate:
  (α) The electric current drawn by the heating element;
  (β) The electrical power consumed by the element in kilowatts (kW).`,
        workedSolution: `(i) Ohm's Law:
Ohm's Law states that the electric current passing through a metallic conductor between two points is directly proportional to the potential difference across the points, provided temperature and other physical conditions remain constant ($V = IR$).

(ii) Calculations:
• (α) Current ($I$):
$$I = \\frac{V}{R} = \\frac{240.0\\text{ V}}{60.0\\ \\Omega} = 4.0\\text{ Amperes (A)}$$
Answer: The current is **4.0 A**.

• (β) Power ($P$):
$$P = V \\times I = 240.0\\text{ V} \\times 4.0\\text{ A} = 960.0\\text{ Watts (W)}$$
Convert to kilowatts:
$$P = \\frac{960.0}{1,000} = 0.96\\text{ kW}$$
Answer: Power consumed is **0.96 kW**.`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: "State three safety precautions that must be observed when installing or repairing domestic electrical appliances.",
        workedSolution: `1. Switching off the main electrical circuit breaker and unplugging the appliance before commencing repairs.
2. Ensuring hands and surrounding floors are completely dry to prevent accidental electric shocks.
3. Using the correct fuse rating for each appliance to avoid overheating and fire hazards.
4. Ensuring the Earth wire is properly grounded to the metal casing of high-power appliances.`,
        maxMarks: 6
      }
    ]
  },
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) In the biological Nitrogen Cycle, outline the specific role played by symbiotic *Rhizobium* bacteria residing in the root nodules of leguminous crops.
(ii) Distinguish between the biochemical processes of nitrification and denitrification in agricultural soils.
(iii) Explain how electrical lightning discharges during thunderstorms contribute to natural soil fertility.`,
        workedSolution: `(i) Role of *Rhizobium* bacteria:
Symbiotic *Rhizobium* bacteria in the root nodules of legumes fix inert atmospheric nitrogen gas [$\\text{N}_2$] into ammonia and ammonium ions [$\\text{NH}_4^+$], converting it into a form that the host plant can synthesize into organic amino acids and proteins.

(ii) Nitrification vs. Denitrification:
• **Nitrification:** An aerobic biological oxidation where nitrifying bacteria (*Nitrosomonas* and *Nitrobacter*) convert toxic ammonia into nitrites [$\\text{NO}_2^-$] and subsequently into plant-available nitrates [$\\text{NO}_3^-$].
• **Denitrification:** An anaerobic biological reduction where denitrifying bacteria (*Pseudomonas*) convert soil nitrates back into gaseous nitrogen [$\\text{N}_2$], releasing it into the atmosphere.

(iii) Nitrogen fixation by lightning:
The extreme thermal energy of lightning causes atmospheric nitrogen [$\\text{N}_2$] and oxygen [$\\text{O}_2$] to combine into nitric oxide, which is oxidized to nitrogen dioxide. Rain dissolves this into dilute nitric acid, which falls into the soil and reacts with soil minerals to form soluble nitrates.`,
        maxMarks: 8
      },
      {
        subId: "(b)",
        prompt: `(i) State two farming practices that cause the depletion of nitrogen and organic matter from agricultural soils.
(ii) Explain why green manuring or planting cover crops enhances soil fertility on a crop farm.`,
        workedSolution: `(i) Practices depleting soil nitrogen:
1. **Bush Burning (Slash-and-Burn):** Volatilizes organic nitrogen into nitrogen oxide gases and burns humus, exposing soil to leaching.
2. **Continuous Monocropping without Legumes:** Exhausts nitrogen reserves as the same crop continually extracts the nutrient without replacement.

(ii) Benefits of green manuring:
Ploughing fresh green leguminous vegetative matter directly into topsoil adds substantial organic matter (humus). When decomposed by soil microbes, it releases mineralized nitrates and improves soil moisture-holding capacity and crumb structure.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: "State three observable differences between the physical properties of sandy soil and clayey soil.",
        workedSolution: `1. **Particle Size:** Sandy soil has large, coarse mineral particles ($0.05 - 2.0\\text{ mm}$), while clayey soil consists of microscopic particles ($< 0.002\\text{ mm}$).
2. **Drainage & Aeration:** Sandy soil has large macropores with very rapid drainage and high aeration, whereas clayey soil has micropores with slow drainage and poor aeration.
3. **Water-Holding Capacity:** Sandy soil has low water retention, while clayey soil holds large volumes of water and becomes easily waterlogged.
4. **Texture when Wet:** Sandy soil feels gritty and cannot be molded into ribbons, whereas clayey soil feels sticky and plastic and rolls into flexible ribbons.`,
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
        prompt: `(i) Define an acid and an alkali in terms of observable color changes on litmus paper.
(ii) Bee venom contains an acidic liquid that causes intense pain. Explain why applying baking soda paste (sodium hydrogen carbonate) or wood ash extract relieves the pain.
(iii) Write a word equation for the chemical reaction between dilute hydrochloric acid and calcium carbonate (limestone).`,
        workedSolution: `(i) Acid vs. Alkali by litmus paper:
• **Acid:** A chemical substance that turns blue litmus paper red ($pH < 7$).
• **Alkali (Base):** A water-soluble basic substance that turns red litmus paper blue ($pH > 7$).

(ii) Bee sting relief:
Bee sting venom is mildly acidic. Applying baking soda paste or wood ash extract (which are mild alkalis) causes an **acid-base neutralization reaction**, neutralizing the acid venom and reducing skin inflammation and stinging pain.

(iii) Word equation:
$$\\text{Hydrochloric acid} + \\text{Calcium carbonate} \\to \\text{Calcium chloride} + \\text{Water} + \\text{Carbon dioxide}$$`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) A wheelbarrow is used to transport a load of $400.0\\text{ N}$ of gravel on a farm. The wheel axle serves as the fulcrum, the center of gravity of the load is $40.0\\text{ cm}$ from the wheel, and effort is applied at the handles $120.0\\text{ cm}$ from the wheel:
  (α) Identify the class of lever represented by the wheelbarrow;
  (β) Calculate the minimum upward effort force required to balance the load.
(ii) Distinguish between Mechanical Advantage ($MA$) and Velocity Ratio ($VR$) of a simple machine.`,
        workedSolution: `(i) Wheelbarrow calculations:
• (α) Class of lever: **Second-class lever** (the load is positioned between the fulcrum/wheel and the applied effort).
• (β) Minimum effort force ($E$):
By the Principle of Moments about the wheel axle:
$$\\text{Clockwise Moment} = \\text{Anticlockwise Moment}$$
$$\\text{Effort } (E) \\times \\text{Effort Arm } (d_E) = \\text{Load } (L) \\times \\text{Load Arm } (d_L)$$
$$E \\times 120.0\\text{ cm} = 400.0\\text{ N} \\times 40.0\\text{ cm}$$
$$E = \\frac{400.0 \\times 40.0}{120.0} = \\frac{16,000.0}{120.0} = 133.33\\text{ Newtons (N)}$$
Answer: The minimum effort required is **133.33 N**.

(ii) MA vs. VR:
• **Mechanical Advantage ($MA$):** The ratio of load force overcome to applied effort force ($MA = \\frac{L}{E}$), taking friction into account.
• **Velocity Ratio ($VR$):** The ratio of distance moved by effort to distance moved by load in the same time ($VR = \\frac{d_E}{d_L}$), dependent solely on machine geometry.`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `(i) Name the causative micro-organism and the mode of transmission of Cholera in human communities.
(ii) State two environmental sanitation practices that effectively prevent cholera epidemics during heavy rainy seasons in Ghana.`,
        workedSolution: `(i) Causative organism & transmission:
• **Causative pathogen:** The bacterium **Vibrio cholerae**.
• **Mode of transmission:** Ingestion of food or drinking water contaminated with infected human fecal matter (fecal-oral route).

(ii) Prevention practices:
1. Boiling drinking water or treating it with chlorine tablets before consumption.
2. Proper disposal of human sewage in sanitary latrines and avoiding open defecation.
3. Washing hands thoroughly with soap under running water before handling food and after visiting the toilet.`,
        maxMarks: 6
      }
    ]
  }
];



export const SET_BECE_MOCK_4_SCIENCE_P1 = {
  year: "Mock 4",
  isMock: true,
  setNumber: 135,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Standard Mock 4)",
  title: "Paper 1: Objective Test (Mock 4)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedMock4P1
};

export const SET_BECE_MOCK_4_SCIENCE_P2 = {
  year: "Mock 4",
  isMock: true,
  setNumber: 135,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Standard Mock 4)",
  title: "Paper 2: Practical & Theory Essay (Mock 4)",
  durationMinutes: 105,
  instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
  totalQuestions: 5,
  questions: paper2Mock4Questions
};

export const SET_BECE_MOCK_4_SCIENCE_COMPLETE = {
  year: "Mock 4",
  isMock: true,
  setNumber: 135,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Standard Mock 4)",
  paper1: {
    title: "Paper 1: Objective Test (Mock 4)",
    durationMinutes: 45,
    totalQuestions: 40,
    questions: balancedMock4P1
  },
  paper2: {
    title: "Paper 2: Practical & Theory Essay (Mock 4)",
    durationMinutes: 105,
    instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
    totalQuestions: 5,
    questions: paper2Mock4Questions
  },
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    isMockExam: true,
    vectorGraphicsCount: 4,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
