/**
 * SET 134: BECE Integrated Science Mock 3 (Standard Mock Suite - NaCCA Calibrated)
 * Full Mock Examination Suite (Paper 1 Objective CBT + Paper 2 Theory & Practical)
 * Proprietary calibrated content © GAM IT Solutions (GAM EDU). All rights reserved.
 */

// SVG for Q1(a): Qualitative Food Tests (Neutral Test Tube Labels I, II, III)
const svgQ1aFoodTestsSanitized = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Test Tube I (Left) -->
    <g transform='translate(35, 20)'>
      <rect x='15' y='10' width='25' height='120' rx='4' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.8'/>
      <!-- Blue-black solution -->
      <path d='M 16 65 L 16 126 A 12 12 0 0 0 39 126 L 39 65 Z' fill='#1e1b4b' stroke='#312e81' stroke-width='1'/>
      <text x='27' y='95' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Blue-Black</text>
      <!-- Neutral Label I -->
      <circle cx='27' cy='155' r='10' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='27' y='159' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text>
    </g>

    <!-- Test Tube II (Middle) -->
    <g transform='translate(150, 20)'>
      <rect x='15' y='10' width='25' height='120' rx='4' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.8'/>
      <!-- Brick-red precipitate -->
      <path d='M 16 65 L 16 126 A 12 12 0 0 0 39 126 L 39 65 Z' fill='#b91c1c' stroke='#ef4444' stroke-width='1'/>
      <text x='27' y='95' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Brick-Red</text>
      <!-- Neutral Label II -->
      <circle cx='27' cy='155' r='10' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/>
      <text x='27' y='159' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II</text>
    </g>

    <!-- Test Tube III (Right) -->
    <g transform='translate(265, 20)'>
      <rect x='15' y='10' width='25' height='120' rx='4' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.8'/>
      <!-- Violet solution -->
      <path d='M 16 65 L 16 126 A 12 12 0 0 0 39 126 L 39 65 Z' fill='#7e22ce' stroke='#a855f7' stroke-width='1'/>
      <text x='27' y='95' font-size='8' font-weight='bold' fill='#ffffff' text-anchor='middle'>Violet</text>
      <!-- Neutral Label III -->
      <circle cx='27' cy='155' r='10' fill='#1e293b' stroke='#a855f7' stroke-width='1.5'/>
      <text x='27' y='159' font-size='10' font-weight='bold' fill='#a855f7' text-anchor='middle'>III</text>
    </g>

    <text x='190' y='198' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>CHEMICAL FOOD TESTS: IDENTIFY THE REAGENTS AND NUTRIENTS PRESENT IN TUBES I, II, AND III</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(b): Pinhole Camera Ray Diagram (Neutral Identification)
const svgQ1bPinholeCameraSanitized = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Object: Upright Candle on Left -->
    <g transform='translate(35, 50)'>
      <rect x='15' y='40' width='12' height='60' fill='#cbd5e1' stroke='#94a3b8' stroke-width='1.5'/>
      <line x1='21' y1='40' x2='21' y2='32' stroke='#0f172a' stroke-width='1.5'/>
      <path d='M 21 15 Q 16 25 21 32 Q 26 25 21 15 Z' fill='#f59e0b' stroke='#ea580c' stroke-width='1'/>
      <circle cx='21' cy='18' r='2' fill='#ffffff'/>
      <text x='21' y='118' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Object (AB)</text>
      <!-- Apex Point A and Base Point B -->
      <circle cx='21' cy='15' r='2.5' fill='#ef4444'/>
      <text x='10' y='18' font-size='9' font-weight='bold' fill='#ef4444'>A</text>
      <circle cx='21' cy='100' r='2.5' fill='#38bdf8'/>
      <text x='10' y='102' font-size='9' font-weight='bold' fill='#38bdf8'>B</text>
    </g>

    <!-- Camera Box -->
    <g transform='translate(170, 30)'>
      <rect x='0' y='0' width='160' height='130' fill='#1e293b' stroke='#64748b' stroke-width='2'/>
      <!-- Pinhole Aperture O -->
      <line x1='0' y1='0' x2='0' y2='60' stroke='#38bdf8' stroke-width='3'/>
      <line x1='0' y1='70' x2='0' y2='130' stroke='#38bdf8' stroke-width='3'/>
      <circle cx='0' cy='65' r='2.5' fill='#ffffff'/>
      <!-- Neutral Label O -->
      <circle cx='-14' cy='65' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='-14' y='68' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='middle'>O</text>

      <!-- Screen Line S -->
      <line x1='160' y1='0' x2='160' y2='130' stroke='#10b981' stroke-width='3'/>
      <circle cx='174' cy='65' r='8' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='174' y='68' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>S</text>

      <!-- Inverted Image Formed on Screen (B' at Top, A' at Bottom) -->
      <g transform='translate(160, 42)'>
        <circle cx='0' cy='0' r='2.5' fill='#38bdf8'/>
        <text x='-8' y='-2' font-size='8' font-weight='bold' fill='#38bdf8' text-anchor='end'>B'</text>
        <rect x='-6' y='0' width='6' height='35' fill='#cbd5e1' opacity='0.7'/>
        <path d='M -3 45 Q -6 38 -3 35 Q 0 38 -3 45 Z' fill='#f59e0b' opacity='0.8'/>
        <circle cx='0' cy='46' r='2.5' fill='#ef4444'/>
        <text x='-8' y='49' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='end'>A'</text>
      </g>
    </g>

    <!-- Ray Tracing Lines -->
    <line x1='56' y1='65' x2='170' y2='95' stroke='#ef4444' stroke-width='1.6'/>
    <line x1='170' y1='95' x2='330' y2='118' stroke='#ef4444' stroke-width='1.6'/>
    <polygon points='110,77 118,79 113,83' fill='#ef4444'/>
    <polygon points='250,107 258,109 253,113' fill='#ef4444'/>

    <line x1='56' y1='150' x2='170' y2='95' stroke='#38bdf8' stroke-width='1.6'/>
    <line x1='170' y1='95' x2='330' y2='42' stroke='#38bdf8' stroke-width='1.6'/>
    <polygon points='110,126 118,121 113,117' fill='#38bdf8'/>
    <polygon points='250,71 258,66 253,62' fill='#38bdf8'/>

    <text x='190' y='185' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>PINHOLE CAMERA EXPERIMENT: OPTICAL RAY TRACING DIAGRAM (APERTURE O AND SCREEN S)</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(c): Separating Funnel (Neutral Component Labels I, II, III, IV)
const svgQ1cSeparatingFunnelSanitized = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 240' width='100%' height='220' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Retort Stand & Clamp -->
    <line x1='50' y1='225' x2='140' y2='225' stroke='#cbd5e1' stroke-width='3'/>
    <line x1='70' y1='225' x2='70' y2='25' stroke='#cbd5e1' stroke-width='3'/>
    <line x1='70' y1='105' x2='125' y2='105' stroke='#cbd5e1' stroke-width='2'/>
    <rect x='65' y='100' width='10' height='10' fill='#475569'/>

    <!-- Separating Funnel -->
    <g transform='translate(100, 15)'>
      <rect x='44' y='0' width='12' height='18' rx='2' fill='#0284c7' opacity='0.3' stroke='#38bdf8' stroke-width='1.5'/>
      <path d='M 44 18 C 15 42 15 90 38 120 L 46 140 L 46 168 L 54 168 L 54 140 L 62 120 C 85 90 85 42 56 18 Z' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='2'/>
      
      <!-- Upper Layer I -->
      <path d='M 23 42 C 20 62 24 76 50 76 C 76 76 80 62 77 42 Z' fill='#f59e0b' opacity='0.6'/>
      <circle cx='95' cy='58' r='9' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/>
      <text x='95' y='61' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>I</text>

      <!-- Lower Layer II -->
      <path d='M 24 76 C 24 92 38 120 46 140 L 54 140 C 62 120 76 92 76 76 Z' fill='#38bdf8' opacity='0.45'/>
      <circle cx='95' cy='102' r='9' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='95' y='105' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>II</text>

      <!-- Stopcock III -->
      <rect x='40' y='142' width='20' height='7' rx='2' fill='#d97706'/>
      <circle cx='80' cy='145' r='9' fill='#1e293b' stroke='#d97706' stroke-width='1.5'/>
      <text x='80' y='148' font-size='9' font-weight='bold' fill='#d97706' text-anchor='middle'>III</text>

      <!-- Delivery Stem -->
      <line x1='50' y1='149' x2='50' y2='175' stroke='#38bdf8' stroke-width='2'/>
      <circle cx='50' cy='182' r='1.5' fill='#38bdf8'/>
    </g>

    <!-- Vessel IV Below -->
    <g transform='translate(125, 175)'>
      <polygon points='15,15 35,15 48,45 2,45' fill='#0284c7' opacity='0.25' stroke='#64748b' stroke-width='1.5'/>
      <rect x='4' y='35' width='42' height='9' fill='#38bdf8' opacity='0.5'/>
      <circle cx='70' cy='32' r='9' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/>
      <text x='70' y='35' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>IV</text>
    </g>

    <text x='170' y='230' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>SEPARATION OF IMMISCIBLE LIQUIDS USING APPARATUS LABELED I, II, III, AND IV</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

// SVG for Q1(d): Digestive Systems A and B (Neutral Stomach Chamber Labels 1, 2, 3, 4 and C)
const svgQ1dDigestiveSystemsSanitized = `
<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 210' width='100%' height='195' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- System A (Ruminant) -->
    <g transform='translate(20, 20)'>
      <text x='75' y='12' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Digestive System A</text>
      <!-- Esophagus -->
      <path d='M 10 30 L 40 45' stroke='#94a3b8' stroke-width='3' fill='none'/>
      <!-- Chamber 1 -->
      <ellipse cx='75' cy='65' rx='35' ry='22' fill='#1e293b' stroke='#38bdf8' stroke-width='1.8'/>
      <circle cx='75' cy='65' r='8' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='75' y='68' font-size='9' font-weight='bold' fill='#38bdf8' text-anchor='middle'>1</text>
      <!-- Chamber 2 -->
      <ellipse cx='42' cy='75' rx='12' ry='10' fill='#1e293b' stroke='#f59e0b' stroke-width='1.5'/>
      <text x='42' y='78' font-size='8' font-weight='bold' fill='#f59e0b' text-anchor='middle'>2</text>
      <!-- Chamber 3 -->
      <ellipse cx='115' cy='72' rx='14' ry='12' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='115' y='75' font-size='8' font-weight='bold' fill='#10b981' text-anchor='middle'>3</text>
      <!-- Chamber 4 -->
      <ellipse cx='95' cy='105' rx='20' ry='14' fill='#1e293b' stroke='#ef4444' stroke-width='1.8'/>
      <circle cx='95' cy='105' r='8' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/>
      <text x='95' y='108' font-size='9' font-weight='bold' fill='#ef4444' text-anchor='middle'>4</text>
      <!-- Small intestine -->
      <path d='M 115 105 Q 135 125 140 145' stroke='#94a3b8' stroke-width='2' fill='none'/>
    </g>

    <!-- Divider Line -->
    <line x1='185' y1='20' x2='185' y2='190' stroke='#334155' stroke-width='1.5' stroke-dasharray='4,3'/>

    <!-- System B (Monogastric Herbivore) -->
    <g transform='translate(205, 20)'>
      <text x='80' y='12' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Digestive System B</text>
      <!-- Esophagus -->
      <path d='M 20 30 L 45 45' stroke='#94a3b8' stroke-width='3' fill='none'/>
      <!-- Stomach S -->
      <ellipse cx='65' cy='55' rx='22' ry='15' fill='#1e293b' stroke='#ef4444' stroke-width='1.8'/>
      <circle cx='65' cy='55' r='8' fill='#1e293b' stroke='#ef4444' stroke-width='1.5'/>
      <text x='65' y='58' font-size='8' font-weight='bold' fill='#ef4444' text-anchor='middle'>S</text>
      <!-- Intestine coils -->
      <path d='M 87 55 Q 100 80 85 95' stroke='#94a3b8' stroke-width='2' fill='none'/>
      <!-- Enlarged Organ C (Caecum) -->
      <path d='M 85 95 C 130 90 140 135 105 145 C 75 155 60 125 85 95 Z' fill='#1e293b' stroke='#10b981' stroke-width='2'/>
      <circle cx='100' cy='125' r='8' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <text x='100' y='128' font-size='9' font-weight='bold' fill='#10b981' text-anchor='middle'>C</text>
      <!-- Intestine exit -->
      <path d='M 85 140 L 50 155' stroke='#94a3b8' stroke-width='2' fill='none'/>
    </g>

    <text x='190' y='200' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>COMPARISON OF TWO HERBIVOROUS DIGESTIVE SYSTEMS: IDENTIFY LABELS 1, 2, 3, 4, S, AND C</text>
  </svg>
</div>
`.trim().replace(/\n\s*/g, '');

const rawScienceBank = [
  {
    number: 1,
    prompt: "In which anatomical structure of the human digestive system does the chemical digestion of cooked starch begin?",
    correctAnswer: "The mouth (buccal cavity)",
    distractors: [
      "The stomach cavity",
      "The muscular gullet (esophagus)",
      "The small intestine (ileum)"
    ],
    hint: "Salivary glands secrete salivary amylase (ptyalin) to start breaking down starch.",
    workedSolution: "Chemical digestion of starch initiates in the mouth, where salivary amylase (ptyalin) in saliva hydrolyzes starch polysaccharides into maltose disaccharides.",
    points: 1
  },
  {
    number: 2,
    prompt: "In the International System of Units (S.I.), what is the official base unit for measuring mass?",
    correctAnswer: "Kilogram [kg]",
    distractors: [
      "Gram [g]",
      "Newton [N]",
      "Pound [lb]"
    ],
    hint: "The fundamental metric unit of mass; Newton is the unit of force/weight.",
    workedSolution: "The kilogram (kg) is the official S.I. base unit of mass. The gram is a sub-unit, and the Newton is the derived S.I. unit of weight and force.",
    points: 1
  },
  {
    number: 3,
    prompt: "Which of the following agricultural crops enriches soil fertility naturally by fixing atmospheric nitrogen through root nodule bacteria?",
    correctAnswer: "Cowpea [Vigna unguiculata]",
    distractors: [
      "Maize cereal",
      "Cassava root crop",
      "Head cabbage"
    ],
    hint: "A leguminous crop that forms a symbiotic relationship with *Rhizobium* bacteria.",
    workedSolution: "Cowpeas are leguminous crops harboring symbiotic *Rhizobium* bacteria in their root nodules that fix atmospheric nitrogen gas into plant-available nitrates.",
    points: 1
  },
  {
    number: 4,
    prompt: "A straight stick dipped obliquely into a pool of water appears bent at the liquid surface. This optical illusion is caused by:",
    correctAnswer: "The refraction of light as it travels between water and air",
    distractors: [
      "The rectilinear propagation of light in a vacuum",
      "Total specular reflection of light from the bottom",
      "The diffraction of light around the stick"
    ],
    hint: "Light changes speed and bends when passing between media of different optical densities.",
    workedSolution: "Light rays emerging obliquely from water into air speed up and bend away from the normal, making the submerged portion of the stick appear displaced upward.",
    points: 1
  },
  {
    number: 5,
    prompt: "Which clinical reading falls within the normal resting blood pressure range for a healthy adult human being?",
    correctAnswer: "120/80 mmHg",
    distractors: [
      "160/100 mmHg",
      "145/95 mmHg",
      "70/40 mmHg"
    ],
    hint: "Systolic pressure is around 120 mmHg and diastolic pressure is around 80 mmHg.",
    workedSolution: "A healthy adult resting blood pressure is approximately 120/80 mmHg. Readings at or above 140/90 mmHg indicate clinical hypertension.",
    points: 1
  },
  {
    number: 6,
    prompt: "What is the systematic chemical formula for the binary ionic compound formed between Sodium ($Z=11$) and Chlorine ($Z=17$)?",
    correctAnswer: "NaCl",
    distractors: [
      "Na₂Cl",
      "NaCl₂",
      "Na₂Cl₂"
    ],
    hint: "Sodium loses 1 electron ($\\text{Na}^+$) and Chlorine gains 1 electron ($\\text{Cl}^-$).",
    workedSolution: "Sodium has a valency of $+1$ and Chlorine has a valency of $-1$. Combining in a 1:1 ratio yields the empirical formula $\\text{NaCl}$.",
    points: 1
  },
  {
    number: 7,
    prompt: "Which of the following cellular structures is present in eukaryotic plant cells but ABSENT from animal cells?",
    correctAnswer: "A rigid cellulose cell wall and photosynthetic chloroplasts",
    distractors: [
      "A distinct nucleus and mitochondria",
      "Ribosomes and cytoplasm",
      "The flexible plasma membrane"
    ],
    hint: "Provides structural support and enables autotrophic photosynthesis.",
    workedSolution: "Plant cells possess a rigid cellulose cell wall and chloroplasts for photosynthesis. Animal cells lack both, though both share nuclei, mitochondria, and cell membranes.",
    points: 1
  },
  {
    number: 8,
    prompt: "A student applies an effort force of $25.0\\text{ N}$ to lift a load of $100.0\\text{ N}$ using a lever. Calculate the Mechanical Advantage ($MA$) of the lever:",
    correctAnswer: "4.0",
    distractors: [
      "0.25",
      "2.5",
      "75.0"
    ],
    hint: "$$MA = \\frac{\\text{Load}}{\\text{Effort}} = \\frac{100.0}{25.0}$$.",
    workedSolution: "$$\\text{Mechanical Advantage } (MA) = \\frac{\\text{Load } (L)}{\\text{Effort } (E)} = \\frac{100.0\\text{ N}}{25.0\\text{ N}} = 4.0$$.",
    points: 1
  },
  {
    number: 9,
    prompt: "Which atmospheric gas is absorbed by green plants through leaf stomata to manufacture food (glucose) during photosynthesis?",
    correctAnswer: "Carbon dioxide [CO₂]",
    distractors: [
      "Diatomic oxygen gas [O₂]",
      "Diatomic nitrogen gas [N₂]",
      "Noble argon gas [Ar]"
    ],
    hint: "Provides the carbon source fixed into glucose during photosynthesis.",
    workedSolution: "Carbon dioxide ($\\text{CO}_2$) is absorbed from air through stomata and converted into glucose during photosynthesis: $6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2$.",
    points: 1
  },
  {
    number: 10,
    prompt: "In an electric circuit, an electronic component that emits visible light when forward-biased electric current passes through it is:",
    correctAnswer: "A Light Emitting Diode [LED]",
    distractors: [
      "A fixed ceramic resistor",
      "A step-down transformer",
      "An electrostatic capacitor"
    ],
    hint: "A semiconductor p-n junction diode designed for electroluminescence.",
    workedSolution: "A Light Emitting Diode (LED) emits light when forward-biased as electrons recombine with holes at the p-n junction. Resistors and capacitors do not emit light.",
    points: 1
  },
  {
    number: 11,
    prompt: "A heterogeneous mixture of insoluble sand and liquid water can be separated most effectively in a laboratory by:",
    correctAnswer: "Gravity filtration through porous filter paper",
    distractors: [
      "Simple distillation",
      "Fractional crystallization",
      "Magnetic separation"
    ],
    hint: "Porous filter paper retains insoluble solid particles while liquid passes through.",
    workedSolution: "Filtration separates insoluble solids from liquids: filter paper traps the sand residue while clear water drains through as filtrate.",
    points: 1
  },
  {
    number: 12,
    prompt: "A box of mass $5.0\\text{ kg}$ is hoisted vertically through a height of $4.0\\text{ m}$. Calculate the work done against gravity:\n$$[\\text{Take acceleration due to gravity, } g = 10.0\\text{ m s}^{-2}]$$",
    correctAnswer: "200.0 Joules",
    distractors: [
      "20.0 Joules",
      "50.0 Joules",
      "400.0 Joules"
    ],
    hint: "$$\\text{Force } (F) = mg = 5.0 \\times 10.0 = 50.0\\text{ N}$$. $$\\text{Work Done } (W) = F \\times d$$.",
    workedSolution: "$$F = mg = 5.0\\text{ kg} \\times 10.0\\text{ m s}^{-2} = 50.0\\text{ N}$$. $$\\text{Work Done } (W) = F \\times h = 50.0\\text{ N} \\times 4.0\\text{ m} = 200.0\\text{ Joules (J)}$$.",
    points: 1
  },
  {
    number: 13,
    prompt: "Which waterborne bacterial infection causes high continuous fever, severe abdominal pain, and intestinal inflammation, transmitted via contaminated food and water?",
    correctAnswer: "Typhoid fever [Salmonella typhi]",
    distractors: [
      "Plasmodium malaria",
      "River blindness [Onchocerciasis]",
      "Viral measles"
    ],
    hint: "Caused by *Salmonella typhi* spread through the fecal-oral route.",
    workedSolution: "Typhoid fever is caused by the bacterium *Salmonella typhi*, spread via food and drinking water contaminated with infected feces or urine.",
    points: 1
  },
  {
    number: 14,
    prompt: "What is the ground-state Bohr electronic configuration of an atom of Oxygen ($_{8}\\text{O}$)?",
    correctAnswer: "2, 6",
    distractors: [
      "2, 4",
      "2, 8",
      "4, 4"
    ],
    hint: "Fills 2 electrons in the first K-shell, with the remaining 6 in the L-shell.",
    workedSolution: "Oxygen has atomic number 8: 2 electrons fill the first shell (K-shell), and the remaining 6 valence electrons occupy the second shell (L-shell), giving $2, 6$.",
    points: 1
  },
  {
    number: 15,
    prompt: "Which of the following simple machines is classified as a second-class lever where the load is located between the pivot and the effort?",
    correctAnswer: "A crown-cap bottle opener",
    distractors: [
      "A pair of scissors",
      "A claw hammer",
      "A pair of tweezers"
    ],
    hint: "The fulcrum rests on the cap top, the lifting lip applies load to the cap rim, and hand exerts effort at the handle.",
    workedSolution: "In a bottle opener (Class 2 lever), the load is between the fulcrum and effort. Scissors and claw hammers are Class 1; tweezers are Class 3.",
    points: 1
  },
  {
    number: 16,
    prompt: "Which agricultural soil type drains water most rapidly and has the lowest water-holding capacity due to its coarse macropores?",
    correctAnswer: "Sandy soil",
    distractors: [
      "Heavy clayey soil",
      "Loamy garden soil",
      "Silty river mud"
    ],
    hint: "Large particles allow gravitational water to percolate through quickly.",
    workedSolution: "Sandy soil consists of large particles ($0.05-2.0\\text{ mm}$) with wide macropores that drain water rapidly by gravity, giving it low water retention.",
    points: 1
  },
  {
    number: 17,
    prompt: "Which large blood vessel carries deoxygenated blood from the upper body back into the right atrium of the human heart?",
    correctAnswer: "The superior vena cava",
    distractors: [
      "The pulmonary artery",
      "The systemic aorta",
      "The pulmonary vein"
    ],
    hint: "The main upper systemic vein entering the right atrium.",
    workedSolution: "The superior vena cava returns deoxygenated blood from the head, neck, and arms to the right atrium. The aorta carries oxygenated blood from the left ventricle.",
    points: 1
  },
  {
    number: 18,
    prompt: "When solid naphthalene balls (camphor) placed inside a clothes wardrobe decrease in size over time without leaving a liquid residue, the process is:",
    correctAnswer: "Sublimation",
    distractors: [
      "Thermal melting",
      "Molecular condensation",
      "Dissolution"
    ],
    hint: "The direct phase change from solid to gas without an intermediate liquid phase.",
    workedSolution: "Sublimation is the direct endothermic phase transition of a substance from solid to gas without melting into a liquid (e.g., camphor, dry ice, ammonium chloride).",
    points: 1
  },
  {
    number: 19,
    prompt: "What is the primary function of the transparent curved cornea situated at the front of the human eyeball?",
    correctAnswer: "Refracting incoming light rays and focusing the initial image into the eye",
    distractors: [
      "Detecting color wavelengths using photoreceptor cones",
      "Regulating the diameter of the pupil aperture",
      "Transmitting electrical nerve impulses to the brain"
    ],
    hint: "Provides roughly two-thirds of the eye's total optical focusing power.",
    workedSolution: "The cornea is the transparent anterior bulge of the eyeball that refracts light rays entering the eye, providing most of the eye's refractive power.",
    points: 1
  },
  {
    number: 20,
    prompt: "Which of the following household substances is basic/alkaline and will turn red litmus paper blue?",
    correctAnswer: "Baking soda solution (sodium hydrogen carbonate) / Wood ash extract",
    distractors: [
      "Fresh citrus lime juice",
      "Dilute vinegar (ethanoic acid)",
      "Unripe mango juice"
    ],
    hint: "Bases turn red litmus paper blue ($pH > 7$); acidic juices turn blue litmus red.",
    workedSolution: "Baking soda ($\\text{NaHCO}_3$) and wood ash extract are basic ($pH > 7$), turning red litmus paper blue. Lime juice and vinegar are acidic ($pH < 7$).",
    points: 1
  },
  {
    number: 21,
    prompt: "In an ecological food chain: $\\text{Green Grass} \\to \\text{Caterpillar} \\to \\text{Bird} \\to \\text{Hawk}$, which organism is the primary consumer?",
    correctAnswer: "The caterpillar (herbivore)",
    distractors: [
      "The green grass",
      "The insectivorous bird",
      "The predatory hawk"
    ],
    hint: "The herbivore that feeds directly on the primary autotrophic producer.",
    workedSolution: "Green grass is the primary producer (Trophic Level 1), the caterpillar is the primary consumer (herbivore, Level 2), the bird is secondary consumer, and the hawk is tertiary consumer.",
    points: 1
  },
  {
    number: 22,
    prompt: "An electric water kettle rated $1,500.0\\text{ W}$ is operated for $2.0\\text{ hours}$. Determine the electrical energy consumed in kilowatt-hours (kWh):",
    correctAnswer: "3.0 kWh",
    distractors: [
      "0.75 kWh",
      "30.0 kWh",
      "3,000.0 kWh"
    ],
    hint: "$$\\text{Power in kW} = \\frac{1,500}{1,000} = 1.5\\text{ kW}$$. $$\\text{Energy} = P \\times t = 1.5 \\times 2.0$$.",
    workedSolution: "$$\\text{Power} = 1.5\\text{ kW}$$. $$\\text{Energy} = P \\times t = 1.5\\text{ kW} \\times 2.0\\text{ h} = 3.0\\text{ kWh}$$.",
    points: 1
  },
  {
    number: 23,
    prompt: "Which of the following agronomic practices reduces soil erosion on sloping land by creating barriers across the slope?",
    correctAnswer: "Contour ridging and stone terracing across the slope",
    distractors: [
      "Clean weeding and burning all vegetative residues",
      "Ploughing straight down the slope gradient",
      "Overgrazing pastures with cattle"
    ],
    hint: "Creates horizontal ridges that slow surface runoff and promote water infiltration.",
    workedSolution: "Contour ridging and terracing create ridges perpendicular to the slope, reducing runoff velocity and encouraging water infiltration to prevent erosion.",
    points: 1
  },
  {
    number: 24,
    prompt: "In atomic physics, what is the net electrical charge carried by an intact, unreacted neutral atom?",
    correctAnswer: "Zero [neutral]",
    distractors: [
      "+1 positive charge",
      "-1 negative charge",
      "+2 positive charge"
    ],
    hint: "The number of positive protons in the nucleus equals the number of negative electrons.",
    workedSolution: "Neutral atoms have zero net electrical charge because the positive charges of nuclear protons ($+1$) are balanced by the negative charges of orbital electrons ($-1$).",
    points: 1
  },
  {
    number: 25,
    prompt: "What is the stoichiometric chemical formula of Calcium oxide?",
    correctAnswer: "CaO",
    distractors: [
      "Ca₂O",
      "CaO₂",
      "Ca₂O₃"
    ],
    hint: "Calcium cation ($\\text{Ca}^{2+}$) balances oxide anion ($\\text{O}^{2-}$).",
    workedSolution: "Calcium has a combining power (valency) of $+2$ and Oxygen has a valency of $-2$. They combine in a 1:1 ratio to form neutral calcium oxide ($\\text{CaO}$).",
    points: 1
  },
  {
    number: 26,
    prompt: "Which agricultural crop is propagated on farms using stem cuttings?",
    correctAnswer: "Cassava [Manihot esculenta]",
    distractors: [
      "Maize grain",
      "Cowpea seed",
      "Tomato vegetable"
    ],
    hint: "Mature woody stem stakes are planted in ridges to sprout roots and shoots.",
    workedSolution: "Cassava is propagated vegetatively using woody stem cuttings (stakes) that sprout roots from nodes and leafy shoots from buds. Maize, cowpeas, and tomatoes are grown from seeds.",
    points: 1
  },
  {
    number: 27,
    prompt: "When solid table salt dissolves completely in water, the resulting mixture is clear and does not settle upon standing. This mixture is classified as:",
    correctAnswer: "A homogeneous true solution",
    distractors: [
      "A heterogeneous suspension",
      "A colloidal emulsion",
      "A pure chemical compound"
    ],
    hint: "Solute particles dissolve at the ionic level and cannot be separated by filtration.",
    workedSolution: "Salt dissolves into individual hydrated ions dispersed uniformly in water, forming a single-phase homogeneous solution that does not settle.",
    points: 1
  },
  {
    number: 28,
    prompt: "An electric lamp draws a current of $0.5\\text{ A}$ when connected across a potential difference of $240.0\\text{ V}$. Calculate the electrical resistance of the lamp filament:",
    correctAnswer: "480.0 Ω",
    distractors: [
      "120.0 Ω",
      "240.0 Ω",
      "48.0 Ω"
    ],
    hint: "By Ohm's Law: $R = \\frac{V}{I} = \\frac{240.0}{0.5}$.",
    workedSolution: "By Ohm's Law: $R = \\frac{V}{I} = \\frac{240.0\\text{ V}}{0.5\\text{ A}} = 480.0\\ \\Omega$.",
    points: 1
  },
  {
    number: 29,
    prompt: "Which essential environmental factor provides the kinetic thermal energy required for enzyme activity during seed germination?",
    correctAnswer: "Optimum temperature (warmth)",
    distractors: [
      "Bright direct sunlight",
      "High wind speed",
      "Synthetic fertilizer"
    ],
    hint: "Enzymes function within an optimal temperature range ($25-35^\\circ\\text{C}$).",
    workedSolution: "Warmth (suitable temperature) provides the kinetic energy needed for hydrolytic enzymes to break down food reserves in germinating seeds. Seeds can germinate in the dark.",
    points: 1
  },
  {
    number: 30,
    prompt: "Which anti-corrosion method protects iron tools from atmospheric rusting by applying a sacrificial zinc coating?",
    correctAnswer: "Galvanizing",
    distractors: [
      "Enamel painting",
      "Surface greasing",
      "Alloying with sulfur"
    ],
    hint: "Dip-coating steel sheets in molten zinc.",
    workedSolution: "Galvanizing coats iron or steel with a protective layer of zinc, which acts as a physical barrier and sacrificial anode to prevent rusting.",
    points: 1
  },
  {
    number: 31,
    prompt: "Which of the following human bodily actions is an involuntary reflex mediated through a spinal reflex arc?",
    correctAnswer: "Instantly withdrawing a foot after stepping on a sharp thorn",
    distractors: [
      "Kicking a football during a match",
      "Writing answers in an exercise book",
      "Chewing a piece of meat"
    ],
    hint: "Occurs rapidly and automatically to protect the body without prior conscious thought.",
    workedSolution: "Withdrawing a foot from a sharp thorn is an involuntary protective reflex mediated by the spinal cord. Kicking, writing, and chewing are voluntary actions.",
    points: 1
  },
  {
    number: 32,
    prompt: "In simple machines, the ratio of the distance moved by the effort to the distance moved by the load in the same time interval is the:",
    correctAnswer: "Velocity Ratio [VR]",
    distractors: [
      "Mechanical Advantage [MA]",
      "Mechanical Efficiency",
      "Moment of Force"
    ],
    hint: "$$VR = \\frac{\\text{Effort distance}}{\\text{Load distance}}$$.",
    workedSolution: "Velocity Ratio ($VR$) is the ratio of effort displacement to load displacement ($VR = \\frac{d_E}{d_L}$). Mechanical Advantage is $\\frac{\\text{Load}}{\\text{Effort}}$.",
    points: 1
  },
  {
    number: 33,
    prompt: "Which celestial body in our Solar System is classified as a rocky terrestrial inner planet?",
    correctAnswer: "Planet Mars",
    distractors: [
      "Planet Jupiter",
      "Planet Saturn",
      "Planet Neptune"
    ],
    hint: "A terrestrial planet with a solid rocky surface; Jupiter, Saturn, and Neptune are gas giants.",
    workedSolution: "Mars, Mercury, Venus, and Earth are rocky terrestrial inner planets with solid surfaces. Jupiter, Saturn, Uranus, and Neptune are Jovian gas giants.",
    points: 1
  },
  {
    number: 34,
    prompt: "Which blood component contains hemoglobin, which binds with oxygen to transport it as oxyhemoglobin to metabolizing tissues?",
    correctAnswer: "Red blood cells (Erythrocytes)",
    distractors: [
      "White blood cells (Leukocytes)",
      "Blood platelets (Thrombocytes)",
      "Watery blood plasma"
    ],
    hint: "Biconcave disc-shaped cells without nuclei packed with iron-containing hemoglobin.",
    workedSolution: "Red blood cells (erythrocytes) contain hemoglobin, which binds reversibly with oxygen in lung capillaries to form oxyhemoglobin, transporting oxygen to body tissues.",
    points: 1
  },
  {
    number: 35,
    prompt: "When solid sodium hydroxide pellets dissolve in water, the beaker becomes hot to the touch. This dissolution process is classified as:",
    correctAnswer: "An exothermic process [releasing heat to the surroundings]",
    distractors: [
      "An endothermic process",
      "A reversible sublimation",
      "A nuclear fission event"
    ],
    hint: "Releases thermal energy, causing the temperature of the solution to rise.",
    workedSolution: "Dissolving sodium hydroxide in water releases hydration energy ($\\Delta H < 0$), raising the temperature of the surroundings and demonstrating an exothermic process.",
    points: 1
  },
  {
    number: 36,
    prompt: "In vegetable crop production, nursery beds in low-lying, flood-prone farmland are constructed as:",
    correctAnswer: "Elevated raised nursery beds",
    distractors: [
      "Sunken nursery beds",
      "Flat level beds",
      "Open drainage trenches"
    ],
    hint: "Elevates seedling roots above the saturation line to prevent waterlogging.",
    workedSolution: "Raised beds are built 15–20 cm above ground level to facilitate gravity drainage in flood-prone areas, preventing waterlogging and root rot.",
    points: 1
  },
  {
    number: 37,
    prompt: "In flowering plant reproduction, which floral structure receives pollen grains during pollination?",
    correctAnswer: "The receptive stigma of the carpel",
    distractors: [
      "The pollen-bearing anther",
      "The slender filament",
      "The green sepal calyx"
    ],
    hint: "The sticky apical surface of the female pistil/carpel.",
    workedSolution: "The stigma is the sticky apical structure of the carpel (pistil) specialized to capture and hydrate pollen grains during pollination.",
    points: 1
  },
  {
    number: 38,
    prompt: "Which electrical safety device contains a thin metal wire of low melting point that melts to break the circuit when current exceeds a safe limit?",
    correctAnswer: "An electrical fuse",
    distractors: [
      "A step-down transformer",
      "A three-pin plug casing",
      "A variable rheostat"
    ],
    hint: "Protects household appliances from overcurrent and electrical fires.",
    workedSolution: "A fuse contains a low-melting-point alloy wire that melts when current exceeds its amperage rating, opening the circuit to prevent fires and equipment damage.",
    points: 1
  },
  {
    number: 39,
    prompt: "Which process describes the movement of water molecules through a semi-permeable membrane from a dilute solution into a concentrated solution?",
    correctAnswer: "Osmosis",
    distractors: [
      "Active transport",
      "Gaseous diffusion",
      "Sedimentation"
    ],
    hint: "The net movement of water along a water potential gradient across a selectively permeable barrier.",
    workedSolution: "Osmosis is the net diffusion of water molecules from a region of higher water potential (dilute) to lower water potential (concentrated) across a selectively permeable membrane.",
    points: 1
  },
  {
    number: 40,
    prompt: "Why do deciduous trees shed their leaves during dry harmattan seasons in West Africa?",
    correctAnswer: "To reduce transpiring surface area and conserve internal water reserves",
    distractors: [
      "To prevent damage from bushfires",
      "To accelerate photosynthesis in the stems",
      "To attract herbivorous cattle"
    ],
    hint: "Leaves lose water through stomatal transpiration; shedding leaves prevents desiccation.",
    workedSolution: "Shedding leaves eliminates stomatal transpiration, allowing plants to conserve internal water when soil moisture is depleted during the dry season.",
    points: 1
  }
];

const targetKeys = [
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

const assignedTargetIndices = seedShuffle(targetKeys, 202703);

const balancedMock3P1: any[] = [
  {
    "number": 1,
    "prompt": "When three cardboards with central pinholes are aligned in a straight line between a lit candle and an observer, the flame is seen. If the middle cardboard is displaced slightly, the flame is no longer visible. This demonstrates that light",
    "options": [
      "travels in straight lines.",
      "can be reflected.",
      "can be dispersed.",
      "travels faster in air than in glass."
    ],
    "correctAnswer": "travels in straight lines.",
    "hint": "Rectilinear propagation of light.",
    "workedSolution": "Light travels along straight lines through a uniform medium. Displacing the center cardboard misaligns the pinholes, blocking the straight path of the light rays.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "In an ecosystem, which of the following organisms functions as a primary consumer?",
    "options": [
      "Grasshopper",
      "Grass",
      "Toad",
      "Hawk"
    ],
    "correctAnswer": "Grasshopper",
    "hint": "An herbivore feeding directly on autotrophic green plants.",
    "workedSolution": "Grasshoppers are herbivores that feed directly on autotrophic producers (grass), placing them at Trophic Level 2 as primary consumers.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "A student drives a nail into a wooden block using a claw hammer. The nail penetrates easily because the applied force is concentrated on",
    "options": [
      "a small surface area, producing high pressure.",
      "a large surface area, producing low pressure.",
      "a large volume, producing low friction.",
      "a small volume, producing high density."
    ],
    "correctAnswer": "a small surface area, producing high pressure.",
    "hint": "Pressure is inversely proportional to surface area (P = F / A).",
    "workedSolution": "The sharp point of a nail has an extremely small contact area. Under the applied hammer force, this small area generates high pressure, forcing the nail into the wood.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "Which part of the human tooth is modified primarily for tearing meat and flesh?",
    "options": [
      "Incisor",
      "Canine",
      "Premolar",
      "Molar"
    ],
    "correctAnswer": "Canine",
    "hint": "Pointed, dagger-shaped tooth located between incisors and premolars.",
    "workedSolution": "Canines have sharp, pointed crowns adapted specifically for gripping and tearing tough food items such as meat.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "The chemical formula for Iron(II) sulfide is",
    "options": [
      "FeS",
      "Fe₂S",
      "FeS₂",
      "Fe₂S₃"
    ],
    "correctAnswer": "FeS",
    "hint": "Both iron(II) and sulfide ions have a combining valency of 2.",
    "workedSolution": "Iron(II) carries a +2 charge (Fe²⁺) and sulfide carries a -2 charge (S²⁻). Combining in a 1:1 ratio yields FeS.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Which of the following farming systems involves moving from one cultivated piece of land to another after soil fertility declines, leaving the old land fallow?",
    "options": [
      "Shifting cultivation",
      "Mixed farming",
      "Mixed cropping",
      "Crop rotation"
    ],
    "correctAnswer": "Shifting cultivation",
    "hint": "Farmers abandon depleted plots to clear new land, returning after several years.",
    "workedSolution": "Shifting cultivation is a traditional agricultural system where plots are farmed until fertility drops, after which the farmer moves to clear fresh land while the old plot regenerates.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "An electric kettle consumes 2000 W of power when operated on a 240 V supply. What is the electric current drawn by the kettle?",
    "options": [
      "0.12 A",
      "4.80 A",
      "8.33 A",
      "12.00 A"
    ],
    "correctAnswer": "8.33 A",
    "hint": "Current I = Power / Voltage.",
    "workedSolution": "I = P / V = 2000 W / 240 V = 8.33 A.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Which of the following waste materials is non-biodegradable and persists in the environment for decades if not recycled?",
    "options": [
      "Polythene shopping bags",
      "Banana peelings",
      "Discarded paper cartons",
      "Dry wood shavings"
    ],
    "correctAnswer": "Polythene shopping bags",
    "hint": "Synthetic polymer resistant to microbial decay.",
    "workedSolution": "Polythene (plastic) is a synthetic polymer that soil microorganisms cannot readily break down, making it non-biodegradable.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "What is the mass number of an atom having 11 protons and 12 neutrons in its nucleus?",
    "options": [
      "1",
      "11",
      "12",
      "23"
    ],
    "correctAnswer": "23",
    "hint": "Mass number = Number of protons + Number of neutrons.",
    "workedSolution": "Mass Number (A) = Protons + Neutrons = 11 + 12 = 23 (Sodium-23).",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "A pregnant female rabbit giving birth is described in animal husbandry as",
    "options": [
      "culling.",
      "dubbing.",
      "weaning.",
      "kindling."
    ],
    "correctAnswer": "kindling.",
    "hint": "Term specific to parturition in rabbits.",
    "workedSolution": "Kindling refers specifically to the act of parturition (giving birth) in rabbits.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "Which of the following processes represents an exothermic chemical reaction?",
    "options": [
      "Burning of charcoal in air",
      "Dissolving ammonium chloride in water",
      "Evaporation of water from the skin",
      "Melting of ice into water"
    ],
    "correctAnswer": "Burning of charcoal in air",
    "hint": "Releases heat and light energy to the surrounding environment.",
    "workedSolution": "Combustion of charcoal (carbon) reacts with oxygen to form carbon dioxide while releasing thermal energy, making it an exothermic reaction.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "A car of mass 1000 kg accelerates at a rate of 2.5 m s⁻². Determine the net forward force acting on the car.",
    "options": [
      "400 N",
      "1000 N",
      "2500 N",
      "4000 N"
    ],
    "correctAnswer": "2500 N",
    "hint": "Force = mass x acceleration.",
    "workedSolution": "By Newton's Second Law: F = m x a = 1000 kg x 2.5 m s⁻² = 2500 N.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "Which of the following diseases is transmitted to humans by drinking water contaminated with infected freshwater snails?",
    "options": [
      "Bilharzia",
      "Cholera",
      "Typhoid",
      "Malaria"
    ],
    "correctAnswer": "Bilharzia",
    "hint": "Caused by Schistosoma flatworms whose intermediate hosts are aquatic snails.",
    "workedSolution": "Bilharzia (schistosomiasis) is caused by parasitic blood flukes that use freshwater snails as intermediate hosts to release infective cercariae into water.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "The scattering of a beam of light as it passes through a colloidal mixture such as fog or muddy water is known as the",
    "options": [
      "Doppler effect.",
      "Greenhouse effect.",
      "Meniscus effect.",
      "Tyndall effect."
    ],
    "correctAnswer": "Tyndall effect.",
    "hint": "Light scattering caused by suspended colloidal particles.",
    "workedSolution": "The Tyndall effect occurs when light beams scatter off microscopic particles suspended in a colloid or fine suspension, making the path of light visible.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "Which of the following agricultural tools is designed specifically for transplanting seedlings from nursery beds into the field?",
    "options": [
      "Garden rake",
      "Pickaxe",
      "Wheelbarrow",
      "Hand trowel"
    ],
    "correctAnswer": "Hand trowel",
    "hint": "Curved blade designed for lifting seedlings with an intact ball of soil.",
    "workedSolution": "A hand trowel has a curved, scooping blade ideal for lifting individual seedlings with their root balls intact from nursery beds.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "What is the combining power (valency) of Nitrogen in ammonia (NH₃)?",
    "options": [
      "1",
      "2",
      "3",
      "4"
    ],
    "correctAnswer": "3",
    "hint": "Each hydrogen has a valency of 1 and three are bonded to nitrogen.",
    "workedSolution": "In ammonia (NH₃), nitrogen shares three pairs of electrons with three hydrogen atoms, showing a combining valency of 3.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "Which blood vessel carries deoxygenated blood from the right ventricle of the heart to the lungs?",
    "options": [
      "Aorta",
      "Renal vein",
      "Pulmonary artery",
      "Pulmonary vein"
    ],
    "correctAnswer": "Pulmonary artery",
    "hint": "The only artery in the body that conveys deoxygenated blood.",
    "workedSolution": "The pulmonary artery arises from the right ventricle and conveys deoxygenated blood to alveolar capillaries in the lungs for gas exchange.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "A stone has a mass of 150 g and a volume of 50 cm³. Calculate its density.",
    "options": [
      "0.33 g cm⁻³",
      "3.00 g cm⁻³",
      "100.00 g cm⁻³",
      "200.00 g cm⁻³"
    ],
    "correctAnswer": "3.00 g cm⁻³",
    "hint": "Density = Mass / Volume.",
    "workedSolution": "Density = Mass / Volume = 150 g / 50 cm³ = 3.00 g cm⁻³.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "Which of the following methods is the most effective way to prevent the rusting of an iron bicycle chain?",
    "options": [
      "Painting",
      "Galvanizing",
      "Washing with water",
      "Lubricating with oil"
    ],
    "correctAnswer": "Lubricating with oil",
    "hint": "Provides a waterproof barrier while reducing friction between moving links.",
    "workedSolution": "Applying lubricating oil coats the metal links to exclude atmospheric oxygen and moisture while allowing flexible movement without chipping off.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "The part of a seed that develops into the root system during germination is the",
    "options": [
      "cotyledon.",
      "endosperm.",
      "plumule.",
      "radicle."
    ],
    "correctAnswer": "radicle.",
    "hint": "Plumule becomes the shoot; this structure becomes the root.",
    "workedSolution": "The embryonic radicle emerges through the micropyle to form the primary taproot. The plumule develops into the leafy shoot system.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "Which instrument is used by meteorologists to measure atmospheric pressure?",
    "options": [
      "Hydrometer",
      "Barometer",
      "Anemometer",
      "Thermometer"
    ],
    "correctAnswer": "Barometer",
    "hint": "Mercury or aneroid instrument reading in mmHg or Pascals.",
    "workedSolution": "A barometer measures atmospheric air pressure. Anemometers measure wind speed; hydrometers measure liquid density.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "The chemical formula Na₂CO₃ represents",
    "options": [
      "sodium hydroxide.",
      "sodium chloride.",
      "sodium hydrogencarbonate.",
      "sodium carbonate."
    ],
    "correctAnswer": "sodium carbonate.",
    "hint": "Commonly known as washing soda.",
    "workedSolution": "Na₂CO₃ is sodium carbonate. NaHCO₃ is sodium hydrogencarbonate; NaOH is sodium hydroxide.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "Which of the following conditions is required for the germination of viable seeds?",
    "options": [
      "Bright sunlight",
      "Adequate moisture",
      "Chemical fertilizer",
      "Organic compost"
    ],
    "correctAnswer": "Adequate moisture",
    "hint": "Essential to soften the seed coat and activate hydrolytic enzymes.",
    "workedSolution": "Water (moisture), suitable temperature (warmth), and oxygen are the three essential conditions for seed germination. Light is not generally required.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "A lever has an effort arm of 80 cm and a load arm of 20 cm. Determine its Velocity Ratio (VR).",
    "options": [
      "0.25",
      "4.00",
      "60.00",
      "100.00"
    ],
    "correctAnswer": "4.00",
    "hint": "Velocity Ratio = Effort arm length / Load arm length.",
    "workedSolution": "VR = Distance moved by effort / Distance moved by load = 80 cm / 20 cm = 4.00.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "Which human organ produces bile to assist in the emulsification of dietary fats?",
    "options": [
      "Stomach",
      "Gall bladder",
      "Pancreas",
      "Liver"
    ],
    "correctAnswer": "Liver",
    "hint": "The gall bladder stores and concentrates it, but this organ manufactures it.",
    "workedSolution": "Bile is synthesized by hepatocytes in the liver and transported to the gall bladder for storage before release into the duodenum.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "An element with atomic number 12 combines with an element with atomic number 8. What type of chemical bond is formed?",
    "options": [
      "Covalent bond",
      "Ionic bond",
      "Metallic bond",
      "Hydrogen bond"
    ],
    "correctAnswer": "Ionic bond",
    "hint": "Formed between a metal that loses electrons and a non-metal that gains them.",
    "workedSolution": "Element 12 (Magnesium, metal: 2, 8, 2) transfers two electrons to element 8 (Oxygen, non-metal: 2, 6), forming an ionic bond between Mg²⁺ and O²⁻.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "The transfer of heat energy through a vacuum from the Sun to the Earth occurs by",
    "options": [
      "conduction.",
      "convection.",
      "radiation.",
      "evaporation."
    ],
    "correctAnswer": "radiation.",
    "hint": "Travels via electromagnetic infrared waves without needing material particles.",
    "workedSolution": "Thermal radiation travels as electromagnetic waves through the vacuum of space without requiring a material medium.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Which of the following practices helps to maintain the nitrogen balance in agricultural soils?",
    "options": [
      "Burning crop residue after harvest",
      "Growing leguminous cover crops",
      "Continuous monoculture of maize",
      "Deep clean weeding"
    ],
    "correctAnswer": "Growing leguminous cover crops",
    "hint": "Root nodules contain symbiotic Rhizobium bacteria that fix nitrogen gas.",
    "workedSolution": "Legumes harbor symbiotic Rhizobium bacteria in their root nodules that convert atmospheric nitrogen into nitrates, restoring soil nitrogen reserves.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "What is the function of the fuse in a domestic three-pin electrical plug?",
    "options": [
      "To step down high voltage",
      "To channel stray current to the ground",
      "To melt and break the circuit during overcurrent",
      "To convert alternating current to direct current"
    ],
    "correctAnswer": "To melt and break the circuit during overcurrent",
    "hint": "Contains a low-melting-point alloy wire that melts when current exceeds safe levels.",
    "workedSolution": "A fuse protects wiring and appliances by melting its alloy wire when current exceeds its amperage rating, opening the circuit to prevent fires.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "In flowering plants, fertilization occurs when a male nucleus fuses with the female gamete inside the",
    "options": [
      "anther.",
      "stigma.",
      "style.",
      "ovule."
    ],
    "correctAnswer": "ovule.",
    "hint": "Located inside the ovary and matures into a seed.",
    "workedSolution": "The pollen tube delivers sperm nuclei into the ovule inside the ovary, where fertilization occurs to form a zygote that develops into a seed.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "Which of the following mixtures can be separated into its components using a magnet?",
    "options": [
      "Iron filings and sulfur powder",
      "Sand and common salt",
      "Sugar and water",
      "Kerosene and water"
    ],
    "correctAnswer": "Iron filings and sulfur powder",
    "hint": "One component is ferromagnetic while the other is non-magnetic.",
    "workedSolution": "Iron is magnetic and is attracted to a magnet, while non-magnetic sulfur powder remains behind, making magnetic separation effective.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "The process by which water is drawn up from soil into root hair cells across a semi-permeable membrane is",
    "options": [
      "diffusion.",
      "osmosis.",
      "transpiration.",
      "translocation."
    ],
    "correctAnswer": "osmosis.",
    "hint": "Net movement of water along a water potential gradient across cell membranes.",
    "workedSolution": "Water enters root hair cells by osmosis from higher water potential in moist soil to lower water potential in cell sap across the semi-permeable plasma membrane.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "Which component of a semiconductor diode is formed by doping pure silicon with pentavalent impurity atoms?",
    "options": [
      "Anode",
      "p-type region",
      "n-type region",
      "Dielectric layer"
    ],
    "correctAnswer": "n-type region",
    "hint": "Provides extra free electrons as majority charge carriers.",
    "workedSolution": "Doping pure silicon with pentavalent atoms (such as phosphorus) introduces free conduction electrons, creating an n-type semiconductor material.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "A layer bird producing thin-shelled eggs is suffering from a dietary deficit of",
    "options": [
      "iron.",
      "iodine.",
      "calcium.",
      "nitrogen."
    ],
    "correctAnswer": "calcium.",
    "hint": "Essential mineral for synthesizing hard calcium carbonate eggshells.",
    "workedSolution": "Eggshells consist almost entirely of calcium carbonate. Calcium deficiency in a hen's feed results in weak, thin-shelled, or shell-less eggs.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "When a ray of light passes obliquely from air into water, the refracted ray",
    "options": [
      "bends toward the normal.",
      "bends away from the normal.",
      "continues without bending.",
      "reflects back along its incident path."
    ],
    "correctAnswer": "bends toward the normal.",
    "hint": "Light slows down upon entering an optically denser medium.",
    "workedSolution": "Water is optically denser than air. Light slows down upon entering water obliquely, bending toward the normal line (angle of refraction is less than angle of incidence).",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "An adult human dentition typically contains how many permanent canine teeth in total?",
    "options": [
      "2",
      "4",
      "8",
      "12"
    ],
    "correctAnswer": "4",
    "hint": "One canine on each side of the upper and lower jaws.",
    "workedSolution": "In the human dental formula (2.1.2.3 / 2.1.2.3), each quadrant contains 1 canine, giving a total of 4 canine teeth across both jaws.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "Which of the following substances will produce a salt and hydrogen gas when reacted with dilute hydrochloric acid?",
    "options": [
      "Copper metal",
      "Zinc metal",
      "Carbon powder",
      "Sulfur powder"
    ],
    "correctAnswer": "Zinc metal",
    "hint": "A reactive metal that displaces hydrogen from dilute mineral acids.",
    "workedSolution": "Zinc reacts with dilute hydrochloric acid to produce zinc chloride salt and effervescing hydrogen gas: Zn + 2HCl -> ZnCl₂ + H₂↑. Copper does not react.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "The energy possessed by a body due to its position or compressed state is termed",
    "options": [
      "kinetic energy.",
      "thermal energy.",
      "potential energy.",
      "sound energy."
    ],
    "correctAnswer": "potential energy.",
    "hint": "Stored energy (gravitational or elastic).",
    "workedSolution": "Potential energy is stored energy possessed by an object due to its position in a gravitational field (mgh) or elastic deformation.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "The removal of excess seedlings from a nursery bed stand to reduce competition is called",
    "options": [
      "staking.",
      "pruning.",
      "thinning out.",
      "earthing up."
    ],
    "correctAnswer": "thinning out.",
    "hint": "Reduces plant density to promote vigorous growth of remaining seedlings.",
    "workedSolution": "Thinning out is the deliberate removal of crowded seedlings to eliminate competition for light, space, and soil nutrients.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "Which of the following planets in our Solar System is situated closest to the Sun?",
    "options": [
      "Venus",
      "Earth",
      "Mars",
      "Mercury"
    ],
    "correctAnswer": "Mercury",
    "hint": "First planet in orbital order from the Sun.",
    "workedSolution": "Mercury is the innermost and smallest planet in the Solar System, orbiting closest to the Sun.",
    "points": 1
  }
];

const paper2Mock3Questions = [
  {
    questionNumber: "1",
    isPracticalSectionA: true,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Figure 1(a) illustrates three test tubes I, II, and III containing samples of a food extract X tested with different chemical reagents:

${svgQ1aFoodTestsSanitized}

(i) Name the chemical reagent added to each of test tubes I, II, and III.
(ii) State the observable color change in:
  (α) Test tube I;
  (β) Test tube II;
  (γ) Test tube III.
(iii) Identify the specific food nutrient confirmed to be present in each test tube based on the results.
(iv) State the nutritional consequence to a young child whose daily diet is deficient in the nutrient confirmed in test tube III.`,
        workedSolution: `(i) Chemical reagents added:
• Test tube I: **Dilute Iodine solution**
• Test tube II: **Benedict's solution** (heated in a water bath) [or Fehling's solution A & B]
• Test tube III: **Biuret reagent** (dilute sodium hydroxide followed by copper (II) sulfate solution)

(ii) Observable color changes:
• (α) Tube I: Changes from yellow-brown to **blue-black**
• (β) Tube II: Changes from clear blue to green, yellow, and finally a **brick-red precipitate**
• (γ) Tube III: Changes from blue to **violet / purple**

(iii) Confirmed food nutrients:
• Tube I: **Starch (complex carbohydrate)**
• Tube II: **Reducing sugar (e.g., glucose / maltose)**
• Tube III: **Protein**

(iv) Deficiency consequence:
Deficiency in dietary protein leads to **Kwashiorkor** (characterized by growth stunting, protruding swollen abdomen/edema, muscle wasting, and thinning reddish hair).`,
        maxMarks: 10
      },
      {
        subId: "(b)",
        prompt: `Figure 1(b) illustrates a laboratory ray diagram of an illuminated candle placed in front of a pinhole camera:

${svgQ1bPinholeCameraSanitized}

(i) Name the components labelled O and S.
(ii) Name the fundamental property of light demonstrated by image formation in a pinhole camera.
(iii) State three characteristics of the optical image ($A'B'$) formed on screen S.
(iv) State what happens to the size and sharpness of the image on the screen when:
  (α) The camera box is moved closer to the candle;
  (β) Pinhole aperture O is enlarged into a wide hole.
(v) If a candle of height $6.0\\text{ cm}$ produces an image of height $2.0\\text{ cm}$ on the screen, calculate the linear magnification ($M$) of the camera.`,
        workedSolution: `(i) Labelled components:
• Component O: **Pinhole aperture (pinhole opening)**
• Component S: **Translucent screen (frosted glass / greaseproof paper screen)**

(ii) Fundamental property of light:
**Rectilinear propagation of light** (light travels in straight lines through a uniform medium).

(iii) Characteristics of the image ($A'B'$):
1. **Real** (can be captured on a physical screen).
2. **Inverted** (vertically upside down and laterally reversed).
3. **Diminished** (smaller in dimensions than the object under standard distances).

(iv) Effects on image:
• (α) Moving camera closer to candle: The image becomes **larger (magnified)** and **brighter**.
• (β) Enlarging pinhole into a wide hole: The image becomes **blurred (out of focus)** and **brighter**, as multiple overlapping images form through different points of the opening.

(v) Magnification calculation:
Formula:
$$\\text{Magnification } (M) = \\frac{\\text{Height of Image } (h_i)}{\\text{Height of Object } (h_o)}$$
Substitute values ($h_i = 2.0\\text{ cm}$, $h_o = 6.0\\text{ cm}$):
$$M = \\frac{2.0\\text{ cm}}{6.0\\text{ cm}} = \\frac{1}{3} \\approx 0.33$$
Answer: The linear magnification is **0.33 (or 1/3)** *(dimensionless ratio)*.`,
        maxMarks: 10
      },
      {
        subId: "(c)",
        prompt: `Figure 1(c) illustrates a laboratory separation setup using a separating funnel to separate a mixture of kerosene and water:

${svgQ1cSeparatingFunnelSanitized}

(i) Name the components labelled I, II, III, and IV.
(ii) State the physical property of the two liquids that enables them to form two distinct layers in the funnel.
(iii) Describe briefly how the two liquids are separated using this apparatus.
(iv) State one experimental precaution that must be observed during the separation process.`,
        workedSolution: `(i) Labelled components:
• Layer I: **Kerosene (less dense immiscible layer)**
• Layer II: **Water (denser immiscible layer)**
• Component III: **Stopcock / Tap**
• Vessel IV: **Conical receiving flask (or beaker)**

(ii) Physical property:
**Difference in density** between two **immiscible liquids** (kerosene has a lower density, $\\approx 0.8\\text{ g cm}^{-3}$, and floats on water, $\\approx 1.0\\text{ g cm}^{-3}$).

(iii) Separation procedure:
1. Allow the mixture in the separating funnel to stand undisturbed until two distinct layers form with a sharp interface.
2. Remove the top glass stopper from the neck of the funnel.
3. Carefully open stopcock III to allow the denser liquid (water II) to drain slowly into receiving flask IV.
4. Close stopcock III immediately when the liquid interface reaches the bore of the tap.
5. Retain the upper kerosene layer in the funnel or pour it out through the top neck.

(iv) Experimental precautions:
1. Remove the top stopper before draining so atmospheric pressure allows steady flow without bubbling.
2. Keep the stem of the funnel touching the inside wall of the receiving flask to prevent splashing.
3. Vent internal vapor pressure periodically by inverting the funnel and opening the tap while shaking.`,
        maxMarks: 10
      },
      {
        subId: "(d)",
        prompt: `Figure 1(d) compares the digestive systems of a domestic ruminant animal (System A) and a monogastric herbivore (System B):

${svgQ1dDigestiveSystemsSanitized}

(i) Name the four chambers of the stomach in System A labelled 1, 2, 3, and 4, identifying which chamber is the 'true stomach'.
(ii) State the chamber in System A where:
  (α) Swallowed unchewed forage is stored and fermented by microbes;
  (β) Regurgitated cud is formed to be chewed again;
  (γ) Gastric juice containing enzymes is secreted.
(iii) Name the organs labelled S and C in System B.
(iv) State one behavioral habit of the rabbit (coprophagy) related to its digestive process.`,
        workedSolution: `(i) Four chambers of ruminant stomach (System A):
• Chamber 1: **Rumen** (paunch)
• Chamber 2: **Reticulum** (honeycomb)
• Chamber 3: **Omasum** (manyplies)
• Chamber 4: **Abomasum** (the **true enzymatic stomach**)

(ii) Sites of digestive processes:
• (α) Storage and microbial fermentation: **Rumen (1)**
• (β) Formation of regurgitated cud: **Reticulum (2)**
• (γ) Secretion of gastric juice/enzymes: **Abomasum (4)**

(iii) Labels in System B:
• Organ S: **Single simple stomach**
• Organ C: **Enlarged Caecum**

(iv) Behavioral habit:
**Caecotrophy / Coprophagy:** The rabbit re-ingests soft cecal fecal pellets directly from the anus to digest and absorb microbial proteins and B-vitamins synthesized in the caecum.`,
        maxMarks: 10
      }
    ]
  },
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) In human respiratory physiology, distinguish between external gaseous exchange and cellular respiration.
(ii) State two structural adaptations of the alveoli in the lungs that facilitate rapid gas exchange.`,
        workedSolution: `(i) External Gas Exchange vs. Cellular Respiration:
• **External Gaseous Exchange:** The physical diffusion of oxygen from alveolar air into blood capillaries and carbon dioxide from blood into alveoli across respiratory membranes.
• **Cellular Respiration:** The intracellular biochemical oxidation of glucose inside mitochondria to yield metabolic ATP energy, water, and carbon dioxide.

(ii) Structural adaptations of alveoli:
1. **Extremely Thin Walls:** Single-cell-thick squamous epithelial lining minimizing diffusion distance.
2. **Dense Capillary Network:** Surrounded by a dense mesh of blood capillaries maintaining a steep concentration gradient.
3. **Large Surface Area:** Millions of microscopic alveoli provide a vast surface area for gas diffusion.
4. **Moist Inner Surface:** A thin film of moisture dissolves gases to facilitate diffusion across membranes.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `(i) Define the biological process of anaerobic respiration (fermentation).
(ii) State two commercial industrial applications of anaerobic yeast fermentation in Ghana.
(iii) Write a word equation for the anaerobic fermentation of glucose by yeast cells.`,
        workedSolution: `(i) Definition of anaerobic respiration:
The catabolic breakdown of organic food molecules (glucose) in the absence of molecular oxygen, yielding a small amount of ATP energy along with alcohol and carbon dioxide (in yeast) or lactic acid (in muscle cells).

(ii) Commercial applications:
1. **Baking Industry:** Carbon dioxide gas produced by yeast leavens bread dough, making bread porous and soft.
2. **Brewing & Distilling Industry:** Yeast ferments sugars into ethanol to produce traditional beers (pito) and distilled spirits (*akpeteshie*).

(iii) Word equation:
$$\\text{Glucose} \\xrightarrow{\\text{Yeast / Zymase}} \\text{Ethanol (Alcohol)} + \\text{Carbon dioxide} + \\text{Energy (2 ATP)}$$`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `(i) Name the three physical processes that drive the continuous global Water Cycle.
(ii) State two human activities that disrupt the natural water cycle, leading to environmental degradation.`,
        workedSolution: `(i) Three physical processes:
1. **Evaporation:** Solar heat converts liquid water from oceans, rivers, and soil into atmospheric water vapor (along with plant transpiration).
2. **Condensation:** Water vapor ascends, cools, and condenses into cloud droplets.
3. **Precipitation:** Water returns to Earth as rain, drizzle, or dew.

(ii) Human activities disrupting the water cycle:
1. **Deforestation:** Felling trees reduces transpiration, lowering cloud formation and causing local rainfall decline.
2. **Urban Paving & Concrete Drainage:** Paving roads and building settlements prevents rainwater infiltration, causing severe surface runoff, flash flooding, and groundwater depletion.`,
        maxMarks: 7
      }
    ]
  },
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) Explain how a double-walled vacuum thermos flask minimizes thermal heat loss by:
  (α) Conduction;
  (β) Convection;
  (γ) Radiation.
(ii) State one practical reason why a domestic metal electric pressing iron is fitted with a bimetallic strip thermostat.`,
        workedSolution: `(i) Heat loss minimization in a thermos flask:
• (α) Conduction: The evacuated vacuum space between the double glass walls contains no material particles, preventing heat conduction between walls. The stopper is made of poor-conducting cork or plastic.
• (β) Convection: The vacuum contains no fluid medium, preventing convection currents. The tightly fitted stopper prevents air convection currents with the outside.
• (γ) Radiation: Silvered mirror coatings on the glass walls reflect infrared heat waves back into the flask, preventing radiative heat loss.

(ii) Bimetallic thermostat in an electric iron:
It regulates operating temperature automatically. When the iron reaches a set temperature, unequal expansion bends the bimetallic strip, opening circuit contact points to cut off current and prevent overheating. When it cools, the strip straightens to restore current.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) State Ohm's Law governing electrical conductors.
(ii) A direct-current electrical circuit consists of an electric bulb of resistance $12.0\\ \\Omega$ connected across a $6.0\\text{ V}$ battery. Calculate:
  (α) The electric current flowing through the bulb;
  (β) The electric power consumed by the bulb.`,
        workedSolution: `(i) Ohm's Law:
Ohm's Law states that the electric current flowing through a metallic conductor is directly proportional to the potential difference across its ends, provided temperature and other physical conditions remain constant ($V = IR$).

(ii) Calculations:
• (α) Current ($I$):
$$I = \\frac{V}{R} = \\frac{6.0\\text{ V}}{12.0\\ \\Omega} = 0.50\\text{ Amperes (A)}$$
Answer: Current is **0.50 A**.

• (β) Electric Power ($P$):
$$P = V \\times I = 6.0\\text{ V} \\times 0.50\\text{ A} = 3.0\\text{ Watts (W)}$$
Answer: Power consumed is **3.0 W**.`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: "State three practical methods of conserving electrical energy in a domestic household in Ghana.",
        workedSolution: `1. Switching off lights, fans, and televisions when leaving empty rooms.
2. Replacing incandescent filament bulbs with energy-efficient Light Emitting Diode (LED) lamps.
3. Unplugging electronic appliances from wall sockets when not in use to eliminate standby power drain.
4. Keeping refrigerator doors closed and defrosting cooling coils regularly.`,
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
        prompt: `(i) State the observable color change when blue litmus paper is dipped into:
  (α) Fresh lime juice;
  (β) Aqueous sodium hydroxide solution;
  (γ) Pure distilled water.
(ii) What is an acid-base neutralization reaction? Write a balanced word equation for a typical neutralization reaction.`,
        workedSolution: `(i) Litmus paper observations:
• (α) Fresh lime juice: **Turns red** (acidic, $pH < 7$)
• (β) Sodium hydroxide: **Remains blue** (basic/alkaline, $pH > 7$)
• (γ) Pure distilled water: **Remains blue** (neutral, $pH = 7$)

(ii) Neutralization reaction:
A chemical reaction in which an acid reacts with an equivalent amount of a base (alkali) to produce a neutral salt and water:
$$\\text{Acid} + \\text{Base} \\to \\text{Salt} + \\text{Water}$$`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `(i) Distinguish between a physical change and a chemical change, giving one everyday example of each.
(ii) Classify each of the following as either a physical change or a chemical change:
  (α) Rusting of an iron nail;
  (β) Melting of solid candle wax;
  (γ) Dissolving table sugar in water;
  (δ) Burning of firewood to ash.`,
        workedSolution: `(i) Physical vs. Chemical Change:
• **Physical Change:** A reversible change in which no new chemical substance is formed (e.g., melting of ice to water).
• **Chemical Change:** An irreversible change in which one or more new chemical substances with different properties are formed (e.g., rusting of iron).

(ii) Classification:
• (α) Rusting of iron: **Chemical change** (oxidation to hydrated iron (III) oxide)
• (β) Melting of wax: **Physical change** (reversible phase change $\\text{Solid} \\to \\text{Liquid}$)
• (γ) Dissolving sugar: **Physical change** (reversible dissolution forming a solution)
• (δ) Burning of firewood: **Chemical change** (combustion producing $\\text{CO}_2$, water vapor, and ash)`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `Write down the systematic chemical formula for each of the following binary inorganic compounds:
(i) Sodium oxide;
(ii) Aluminum chloride;
(iii) Pure water;
(iv) Magnesium sulfide.`,
        workedSolution: `Chemical Formulae:
• (i) Sodium oxide: $\\text{Na}_2\\text{O}$ (Sodium valency 1, Oxygen valency 2)
• (ii) Aluminum chloride: $\\text{AlCl}_3$ (Aluminum valency 3, Chlorine valency 1)
• (iii) Water: $\\text{H}_2\\text{O}$ (Hydrogen valency 1, Oxygen valency 2)
• (iv) Magnesium sulfide: $\\text{MgS}$ (Magnesium valency 2, Sulfur valency 2)`,
        maxMarks: 7
      }
    ]
  },
  {
    questionNumber: "5",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) Name the four distinct developmental stages in the life cycle of the mosquito.
(ii) State two physical methods used to destroy the breeding habitats of mosquitoes around residential homes.
(iii) Name the specific disease transmitted by:
  (α) The female *Anopheles* mosquito;
  (β) The *Aedes* mosquito.`,
        workedSolution: `(i) Mosquito developmental stages (Complete metamorphosis):
$$\\text{Egg} \\to \\text{Larva (Wiggler)} \\to \\text{Pupa (Tumbler)} \\to \\text{Adult (Imago)}$$

(ii) Physical habitat destruction methods:
1. Clearing and draining stagnant water puddles, empty cans, and discarded tires around houses.
2. Keeping domestic water storage containers covered with tight-fitting lids.
3. Desilting choked gutters to ensure continuous water drainage.

(iii) Diseases transmitted:
• (α) Female *Anopheles* mosquito: **Malaria**
• (β) *Aedes* mosquito: **Yellow fever** *(or Dengue fever / Chikungunya)*`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) State two advantages of using organic manure (compost) over synthetic chemical fertilizers.
(ii) Mention two cultural farming practices that help preserve soil fertility on farmlands.`,
        workedSolution: `(i) Advantages of organic manure:
1. **Improves Soil Structure:** Adds humus that enhances soil crumb structure, aeration, and water-holding capacity, whereas chemical fertilizers add mineral salts without improving structure.
2. **Long-Lasting & Non-Leaching:** Releases nutrients slowly as it decomposes, reducing nutrient runoff and preventing water pollution.
3. **Environmentally Friendly:** Stimulates beneficial soil microorganisms without causing soil acidification.

(ii) Cultural soil conservation practices:
1. **Crop Rotation:** Alternating crop families (including legumes) to maintain nutrient balance and disrupt pest cycles.
2. **Mulching:** Covering the soil with plant residues to retain moisture, suppress weeds, and add organic matter.
3. **Cover Cropping:** Planting creeping legumes to protect topsoil from erosion and fix nitrogen.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: `(i) A simple crowbar of total length $150.0\\text{ cm}$ is used as a first-class lever to lift a stone of weight $600.0\\text{ N}$. If the fulcrum is placed $30.0\\text{ cm}$ from the stone, calculate:
  (α) The distance from the fulcrum to the applied effort (effort arm);
  (β) The minimum effort force required to balance the stone (neglecting bar weight).
(ii) State the principle of moments for a lever in rotational equilibrium.`,
        workedSolution: `(i) Lever calculations:
• (α) Effort Arm ($d_E$):
$$d_E = \\text{Total Length} - \\text{Load Arm} = 150.0\\text{ cm} - 30.0\\text{ cm} = 120.0\\text{ cm}$$
Answer: Effort arm is **120.0 cm** (or $1.20\\text{ m}$).

• (β) Minimum Effort ($E$):
By the Principle of Moments:
$$\\text{Clockwise Moment} = \\text{Anticlockwise Moment}$$
$$\\text{Effort } (E) \\times d_E = \\text{Load } (L) \\times d_L$$
$$E \\times 120.0\\text{ cm} = 600.0\\text{ N} \\times 30.0\\text{ cm}$$
$$E = \\frac{600.0 \\times 30.0}{120.0} = \\frac{18,000.0}{120.0} = 150.0\\text{ Newtons (N)}$$
Answer: The minimum effort required is **150.0 N**.

(ii) Principle of Moments:
When a body is in rotational equilibrium, the sum of clockwise moments about any pivot point is equal to the sum of anticlockwise moments about that same pivot point.`,
        maxMarks: 7
      }
    ]
  }
];

export const SET_BECE_MOCK_3_SCIENCE_P1 = {
  year: "Mock 3",
  isMock: true,
  setNumber: 134,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Standard Mock 3)",
  title: "Paper 1: Objective Test (Mock 3)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: balancedMock3P1
};

export const SET_BECE_MOCK_3_SCIENCE_P2 = {
  year: "Mock 3",
  isMock: true,
  setNumber: 134,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Standard Mock 3)",
  title: "Paper 2: Practical & Theory Essay (Mock 3)",
  durationMinutes: 105,
  instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
  totalQuestions: 5,
  questions: paper2Mock3Questions
};

export const SET_BECE_MOCK_3_SCIENCE_COMPLETE = {
  year: "Mock 3",
  isMock: true,
  setNumber: 134,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Standard Mock 3)",
  paper1: {
    title: "Paper 1: Objective Test (Mock 3)",
    durationMinutes: 45,
    totalQuestions: 40,
    questions: balancedMock3P1
  },
  paper2: {
    title: "Paper 2: Practical & Theory Essay (Mock 3)",
    durationMinutes: 105,
    instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
    totalQuestions: 5,
    questions: paper2Mock3Questions
  },
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    isMockExam: true,
    vectorGraphicsCount: 4,
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
