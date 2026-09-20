/**
 * 2012 BECE Integrated Science Paper 2 (Set 93 Practical & Theory Essay Test)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_2012_variant
 * Set Number: Set 93
 * Format: Structured essay & laboratory practicals with sanitized responsive vector SVGs
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
 */

// 1. Vector SVG for Q1(a): Measurement of Volume & Density using Sinker Method (Cylinders A, B, C)
export const svgQ1aSinkerMethod = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 220' width='100%' height='205' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Cylinder A: Initial Water Level (20 cm³) -->
    <g transform='translate(25, 20)'>
      <rect x='15' y='10' width='45' height='140' rx='3' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Water level at 20 cm³ -->
      <rect x='16' y='95' width='43' height='54' fill='#38bdf8' opacity='0.4'/>
      <line x1='15' y1='95' x2='60' y2='95' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Ticks -->
      <line x1='50' y1='35' x2='60' y2='35' stroke='#94a3b8'/><text x='46' y='38' font-size='8' fill='#94a3b8' text-anchor='end'>50</text>
      <line x1='50' y1='65' x2='60' y2='65' stroke='#94a3b8'/><text x='46' y='68' font-size='8' fill='#94a3b8' text-anchor='end'>30</text>
      <line x1='50' y1='95' x2='60' y2='95' stroke='#f59e0b' stroke-width='2'/><text x='46' y='98' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='end'>20</text>
      <text x='37' y='170' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cylinder A</text>
      <text x='37' y='184' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>V₁ = 20 cm³</text>
    </g>

    <!-- Cylinder B: Water + Submerged Stone (38 cm³) -->
    <g transform='translate(145, 20)'>
      <rect x='15' y='10' width='45' height='140' rx='3' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Water level at 38 cm³ -->
      <rect x='16' y='59' width='43' height='90' fill='#38bdf8' opacity='0.4'/>
      <line x1='15' y1='59' x2='60' y2='59' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Thread and Submerged Stone Sinker -->
      <path d='M 15 0 Q 37 40 37 130' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='3,2'/>
      <circle cx='37' cy='135' r='10' fill='#64748b' stroke='#475569' stroke-width='1.5'/>
      <line x1='50' y1='59' x2='60' y2='59' stroke='#34d399' stroke-width='2'/><text x='46' y='62' font-size='9' font-weight='bold' fill='#34d399' text-anchor='end'>38</text>
      <text x='37' y='170' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cylinder B</text>
      <text x='37' y='184' font-size='9' font-weight='bold' fill='#34d399' text-anchor='middle'>V₂ = 38 cm³</text>
    </g>

    <!-- Cylinder C: Water + Stone + Tied Cork (40 cm³) -->
    <g transform='translate(265, 20)'>
      <rect x='15' y='10' width='45' height='140' rx='3' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Water level at 40 cm³ -->
      <rect x='16' y='53' width='43' height='96' fill='#38bdf8' opacity='0.4'/>
      <line x1='15' y1='53' x2='60' y2='53' stroke='#38bdf8' stroke-width='1.5'/>
      <!-- Thread, Stone, and Submerged Cork -->
      <path d='M 15 0 Q 30 40 30 130' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='3,2'/>
      <circle cx='30' cy='135' r='10' fill='#64748b' stroke='#475569' stroke-width='1.5'/>
      <!-- Cork tied to stone -->
      <rect x='42' y='128' width='12' height='14' rx='2' fill='#d97706' stroke='#b45309'/>
      <line x1='50' y1='53' x2='60' y2='53' stroke='#f43f5e' stroke-width='2'/><text x='46' y='56' font-size='9' font-weight='bold' fill='#f43f5e' text-anchor='end'>40</text>
      <text x='37' y='170' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cylinder C</text>
      <text x='37' y='184' font-size='9' font-weight='bold' fill='#f43f5e' text-anchor='middle'>V₃ = 40 cm³</text>
    </g>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q1(b): Standard Laboratory Solution Preparation Apparatus (Sanitized, No Spoilers)
export const svgQ1bApparatusSet = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 160' width='100%' height='150' style='max-width: 500px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Apparatus I: Volumetric Flask -->
    <g transform='translate(20, 20)'>
      <rect x='22' y='10' width='8' height='45' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.2'/>
      <path d='M 22 55 L 8 95 Q 26 102 44 95 L 30 55 Z' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.2'/>
      <!-- Stopper -->
      <rect x='20' y='4' width='12' height='8' rx='1' fill='#d97706'/>
      <text x='26' y='120' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text>
    </g>

    <!-- Apparatus II: Glass Beaker -->
    <g transform='translate(95, 30)'>
      <rect x='10' y='15' width='45' height='55' rx='3' fill='#0284c7' opacity='0.15' stroke='#64748b' stroke-width='1.5'/>
      <!-- Spout lip -->
      <polygon points='8,15 12,15 10,19' fill='#64748b'/>
      <text x='32' y='110' font-size='12' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>II</text>
    </g>

    <!-- Apparatus III: Conical Filter Funnel -->
    <g transform='translate(170, 25)'>
      <polygon points='10,15 60,15 38,50 32,50' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.2'/>
      <rect x='33' y='50' width='4' height='30' fill='#38bdf8' opacity='0.4'/>
      <text x='35' y='115' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text>
    </g>

    <!-- Apparatus IV: Glass Stirring Rod -->
    <g transform='translate(235, 25)'>
      <line x1='15' y1='80' x2='45' y2='10' stroke='#cbd5e1' stroke-width='3.5' stroke-linecap='round'/>
      <text x='30' y='115' font-size='12' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>IV</text>
    </g>

    <!-- Apparatus V: Plastic Wash Bottle -->
    <g transform='translate(295, 20)'>
      <rect x='15' y='35' width='35' height='55' rx='6' fill='#1e293b' stroke='#10b981' stroke-width='1.5'/>
      <rect x='25' y='25' width='15' height='10' fill='#10b981'/>
      <!-- Curved delivery nozzle -->
      <path d='M 32 25 Q 32 5 48 10 Q 56 15 54 22' fill='none' stroke='#10b981' stroke-width='2.5'/>
      <text x='32' y='120' font-size='12' font-weight='bold' fill='#10b981' text-anchor='middle'>V</text>
    </g>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// 3. Vector SVG for Q1(c): External Morphological Anatomy of a Flowering Plant (Sanitized, No Spoilers)
export const svgQ1cFloweringPlant = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 340 240' width='100%' height='220' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Ground Level Separator -->
    <line x1='30' y1='170' x2='310' y2='170' stroke='#64748b' stroke-width='1.5' stroke-dasharray='4,3'/>
    <text x='35' y='165' font-size='9' fill='#64748b'>Ground Surface</text>

    <!-- Shoot System (Above Ground) -->
    <!-- Main Stem Axis IV -->
    <line x1='170' y1='170' x2='170' y2='40' stroke='#22c55e' stroke-width='3.5'/>
    <line x1='170' y1='95' x2='240' y2='95' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='250' y='99' font-size='12' font-weight='bold' fill='#22c55e'>IV</text>

    <!-- Part V: Node -->
    <circle cx='170' cy='125' r='3' fill='#f59e0b'/>
    <line x1='170' y1='125' x2='240' y2='125' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='250' y='129' font-size='12' font-weight='bold' fill='#f59e0b'>V</text>

    <!-- Part III: Foliage Leaf -->
    <path d='M 170 125 Q 120 105 105 125 Q 135 145 170 125 Z' fill='#16a34a' stroke='#15803d'/>
    <line x1='110' y1='125' x2='40' y2='125' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='30' y='129' font-size='12' font-weight='bold' fill='#4ade80' text-anchor='end'>III</text>

    <!-- Part II: Developing Fruit / Pod -->
    <ellipse cx='140' cy='70' rx='14' ry='6' fill='#eab308' stroke='#ca8a04' transform='rotate(-25 140 70)'/>
    <line x1='130' y1='70' x2='40' y2='70' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='30' y='74' font-size='12' font-weight='bold' fill='#facc15' text-anchor='end'>II</text>

    <!-- Part I: Terminal Flower / Inflorescence -->
    <g transform='translate(170, 30)'>
      <circle cx='0' cy='0' r='5' fill='#f59e0b'/>
      <circle cx='-7' cy='-4' r='4' fill='#f43f5e'/><circle cx='7' cy='-4' r='4' fill='#f43f5e'/>
      <circle cx='-5' cy='6' r='4' fill='#f43f5e'/><circle cx='5' cy='6' r='4' fill='#f43f5e'/>
      <circle cx='0' cy='-8' r='4' fill='#f43f5e'/>
    </g>
    <line x1='170' y1='22' x2='240' y2='22' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='250' y='26' font-size='12' font-weight='bold' fill='#f43f5e'>I</text>

    <!-- Root System VI (Below Ground) -->
    <line x1='170' y1='170' x2='170' y2='225' stroke='#b45309' stroke-width='3'/>
    <!-- Lateral roots branching out -->
    <path d='M 170 180 Q 140 190 125 205 M 170 190 Q 205 198 220 215' fill='none' stroke='#d97706' stroke-width='1.5'/>
    <path d='M 170 200 Q 150 215 140 225 M 170 205 Q 185 220 195 230' fill='none' stroke='#d97706' stroke-width='1.5'/>
    <line x1='170' y1='210' x2='240' y2='210' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
    <text x='250' y='214' font-size='12' font-weight='bold' fill='#d97706'>VI</text>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// 4. Vector SVG for Q1(d): External Morphological Features of a Domestic Rabbit (Sanitized, No Spoilers)
export const svgQ1dRabbitFeatures = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 360 210' width='100%' height='190' style='max-width: 450px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Body Profile of Rabbit -->
    <g transform='translate(50, 30)'>
      <!-- Rounded compact torso -->
      <ellipse cx='140' cy='95' rx='65' ry='45' fill='#f8fafc' stroke='#cbd5e1' stroke-width='2'/>
      
      <!-- Part I: Long Upright Pinna (Ear) -->
      <ellipse cx='75' cy='25' rx='10' ry='32' fill='#fbcfe8' stroke='#cbd5e1' stroke-width='1.8' transform='rotate(-15 75 25)'/>
      <line x1='75' y1='10' x2='125' y2='-10' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
      <text x='130' y='-7' font-size='12' font-weight='bold' fill='#f472b6'>I</text>

      <!-- Head & Eye -->
      <circle cx='55' cy='65' r='24' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.8'/>
      <circle cx='52' cy='60' r='3.5' fill='#ef4444'/>
      
      <!-- Part II: Vibrissae / Whiskers -->
      <line x1='35' y1='72' x2='10' y2='68' stroke='#94a3b8' stroke-width='1.2'/>
      <line x1='35' y1='74' x2='8' y2='76' stroke='#94a3b8' stroke-width='1.2'/>
      <line x1='35' y1='76' x2='12' y2='84' stroke='#94a3b8' stroke-width='1.2'/>
      <line x1='20' y1='76' x2='-10' y2='95' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
      <text x='-15' y='108' font-size='12' font-weight='bold' fill='#cbd5e1' text-anchor='end'>II</text>

      <!-- Limbs -->
      <!-- Fore limb -->
      <ellipse cx='70' cy='128' rx='8' ry='16' fill='#e2e8f0' stroke='#94a3b8'/>
      <!-- Part IV: Hind limb / Hock -->
      <ellipse cx='160' cy='128' rx='14' ry='22' fill='#e2e8f0' stroke='#94a3b8'/>
      <line x1='165' y1='138' x2='220' y2='155' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
      <text x='225' y='159' font-size='12' font-weight='bold' fill='#38bdf8'>IV</text>

      <!-- Part III: Ventral Abdomen / Belly -->
      <line x1='115' y1='135' x2='115' y2='165' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
      <text x='115' y='178' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text>

      <!-- Part V: Scut (Short Tail) -->
      <circle cx='208' cy='95' r='10' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
      <line x1='215' y1='95' x2='260' y2='95' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
      <text x='265' y='99' font-size='12' font-weight='bold' fill='#cbd5e1'>V</text>

      <!-- Part VI: Rump / Dorsal Back -->
      <line x1='160' y1='52' x2='210' y2='40' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/>
      <text x='215' y='44' font-size='12' font-weight='bold' fill='#cbd5e1'>VI</text>
    </g>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

export const SET_BECE_2012_SCIENCE_P2: any = {
  id: "paper_2012_variant_p2",
  title: "2012 BECE Integrated Science Paper 2 (Set 93 Practical & Theory)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2012 BECE Practical & Theory Essay Test",
  variantType: "past_paper_variant",
  year: 2012,
  paperType: 2,
  setNumber: 93,
  era: "classic",
  totalQuestions: 6,
  version: 1,
  format: "structured_essay",
  durationMinutes: 75,
  instructions: "Answer four questions in all. Answer Question 1 from Section A (compulsory, 40 marks), and any three questions from Section B (60 marks). All working must be clearly shown.",
  questions: [
    // ==========================================
    // SECTION A: COMPULSORY PRACTICAL TEST (40 MARKS)
    // ==========================================
    {
      id: "q01",
      questionNumber: "1",
      isPracticalSectionA: true,
      subQuestions: [
        {
          subId: "(a)",
          id: "q01_a",
          prompt: `The diagrams below illustrate a laboratory experiment conducted to determine the volume and density of a piece of cork of mass $4.0\\text{ g}$ using an insoluble stone as a sinker and a graduated measuring cylinder:

${svgQ1aSinkerMethod}

The initial water volume in Cylinder A was read and noted ($V_1$). A stone was attached to a thread and lowered gently into the water as shown in Cylinder B, and the new volume ($V_2$) was recorded. Finally, the cork was tied to the stone and both were lowered gently into the water as shown in Cylinder C, and the total volume ($V_3$) was noted.

(i) Why did the level of the water rise when the stone was lowered into Cylinder B?

(ii) Why was it necessary to tie the stone to the cork before lowering it into Cylinder C?

(iii) What would have happened if the cork alone were placed into the measuring cylinder containing water?

(iv) From the graduated volume levels shown in the diagrams ($V_1 = 20\\text{ cm}^3$, $V_2 = 38\\text{ cm}^3$, $V_3 = 40\\text{ cm}^3$), determine the volume of:
  (α) The stone;
  (β) The cork.

(v) Calculate the physical density of the cork in $\\text{g cm}^{-3}$, stating the formula used.

(vi) State two practical precautions taken when lowering the solid objects into the measuring cylinder.`,
          workedSolution: `(i) Why water level rose:
By Archimedes' principle of liquid displacement, the submerged stone takes up space and displaces a volume of water exactly equal to its own physical volume.

(ii) Why stone was attached to cork:
Cork is less dense than water and floats naturally on the surface. The heavy, denser stone acts as a sinker to pull the buoyant cork completely beneath the water surface so its full volume is submerged.

(iii) If cork alone were placed in water:
The cork would float on the surface of the water without being fully submerged, making it impossible to measure its total volume by displacement.

(iv) Volume determinations:
• (α) Volume of stone:
$$V_{\\text{stone}} = V_2 - V_1 = 38\\text{ cm}^3 - 20\\text{ cm}^3 = 18\\text{ cm}^3$$
• (β) Volume of cork:
$$V_{\\text{cork}} = V_3 - V_2 = 40\\text{ cm}^3 - 38\\text{ cm}^3 = 2.0\\text{ cm}^3$$

(v) Density of cork calculation:
Formula:
$$\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)}$$
Given $m = 4.0\\text{ g}$ and $V = 2.0\\text{ cm}^3$:
$$\\rho = \\frac{4.0\\text{ g}}{2.0\\text{ cm}^3} = 2.0\\text{ g cm}^{-3}$$
Answer: $$2.0\\text{ g cm}^{-3}$$.

(vi) Precautions:
1. Lowering objects gently using thread to prevent water splashing out of the cylinder (which would alter volume readings).
2. Avoiding hitting the glass base violently to prevent cracking the measuring cylinder.
3. Ensuring the observer's eye is aligned horizontally with the bottom of the concave water meniscus to eliminate parallax error.`,
          maxMarks: 10,
          marks: 10
        },
        {
          subId: "(b)",
          id: "q01_b",
          prompt: `A standard sodium chloride salt solution was prepared in a chemistry laboratory using the apparatus set illustrated below:

${svgQ1bApparatusSet}

(i) Name each of the apparatus labelled I, II, III, IV, and V.

(ii) State one specific operational function performed by each of the apparatus labelled I, II, III, IV, and V during the preparation of the solution.`,
          workedSolution: `(i) Identification of apparatus:
• I: Volumetric flask (measuring flask)
• II: Glass beaker
• III: Filter funnel
• IV: Glass stirring rod
• V: Plastic wash bottle

(ii) Operational functions:
• Apparatus I (Volumetric flask): Used to make up and hold an exact, calibrated standard volume of solution accurately to the graduation mark.
• Apparatus II (Glass beaker): Used as a vessel to dissolve the solid solute (salt crystals) in a measured volume of solvent.
• Apparatus III (Filter funnel): Used to channel and transfer the dissolved liquid solution smoothly into the narrow neck of the volumetric flask without spilling.
• Apparatus IV (Glass rod): Used to stir the mixture to accelerate the dissolution of salt crystals and guide the liquid stream during pouring.
• Apparatus V (Wash bottle): Dispenses fine jets of distilled water to rinse the beaker, funnel, and stirring rod and bring the final solution meniscus accurately to the calibration mark.`,
          maxMarks: 10,
          marks: 10
        },
        {
          subId: "(c)",
          id: "q01_c",
          prompt: `The diagram below illustrates the external morphological features of a typical dicotyledonous flowering plant:

${svgQ1cFloweringPlant}

(i) Name each of the external anatomical structures labelled I, II, III, IV, V, and VI.

(ii) State one primary biological function for each of the parts labelled I, II, III, V, and VI.

(iii) Name the two main structural organ systems that constitute a flowering plant.`,
          workedSolution: `(i) Names of anatomical structures:
• I: Flower (inflorescence)
• II: Fruit (or seed pod)
• III: Leaf lamina (foliage leaf)
• IV: Stem (internode)
• V: Node (point of leaf/branch attachment)
• VI: Root system (taproot and lateral roots)

(ii) Biological functions:
• Part I (Flower): The reproductive organ that facilitates pollination and double fertilization to produce seeds and fruits.
• Part II (Fruit): Protects the developing seeds and facilitates seed dispersal by wind, animals, or explosive mechanism.
• Part III (Leaf): Synthesizes organic carbohydrates via photosynthesis and facilitates transpiration and gaseous exchange through stomata.
• Part V (Node): The active meristematic site on the stem from which leaves, lateral buds, and branches arise.
• Part VI (Root system): Anchors the plant securely into the soil and absorbs capillary water and dissolved mineral nutrient ions.

(iii) Two main plant systems:
1. The Shoot System (the aerial portion: stems, leaves, flowers, fruits)
2. The Root System (the subterranean portion: taproots, lateral roots, root hairs)`,
          maxMarks: 10,
          marks: 10
        },
        {
          subId: "(d)",
          id: "q01_d",
          prompt: `The diagram below is an illustration of a domestic small farm animal (rabbit):

${svgQ1dRabbitFeatures}

(i) Identify the common or zoological name of the domestic farm animal illustrated.

(ii) Name each of the external anatomical features labelled I, II, III, IV, V, and VI.

(iii) Name the specialized wooden or wire housing structure in which this animal is reared.

(iv) Mention three commercial breeds of this farm animal reared in Ghana.

(v) State two routine management practices adopted by a rabbit farmer to prevent and control outbreaks of pests and diseases.`,
          workedSolution: `(i) Identification of animal:
Domestic rabbit (or *Oryctolagus cuniculus* / hare).

(ii) External anatomical parts:
• I: Pinna (external ear)
• II: Vibrissae (sensory whiskers / snout)
• III: Abdomen / Belly (ventral surface)
• IV: Hind limb (hock and foot)
• V: Tail (scut)
• VI: Rump / Loin (dorsal back)

(iii) Housing structure:
Hutch (rabbit hutch / cage battery).

(iv) Commercial breeds of rabbit:
1. New Zealand White
2. California White
3. Chinchilla
4. Flemish Giant
5. Dutch Rabbit

(v) Disease and pest control practices:
1. Regular cleaning, scrubbing, and chemical disinfection of hutch floors and droppings trays to prevent coccidiosis.
2. Providing clean, mold-free concentrate pellets and fresh, wilted forage feed along with chlorinated potable water.
3. Isolating newly acquired breeding stock in quarantine for 14 days before introduction to the main hutch.
4. Routine veterinary prophylactic deworming and applying acaricide drops to control ear canker mites.`,
          maxMarks: 10,
          marks: 10
        }
      ]
    },

    // ==========================================
    // SECTION B: THEORY & ESSAY QUESTIONS (ANSWER 4 ONLY)
    // ==========================================
    {
      id: "q02",
      questionNumber: "2",
      isPracticalSectionA: false,
      subQuestions: [
        {
          subId: "(a)",
          id: "q02_a",
          prompt: "(i) What is technology?\n(ii) State one practical application of modern technology in long-distance communication.",
          workedSolution: `(i) Definition of technology:
The practical application of scientific knowledge, engineering principles, and technical methods to develop tools, devices, and systems that solve human problems and make work faster, easier, and more efficient.

(ii) Application in communication:
The use of smartphones, fibre-optic networks, and satellite telecommunication systems for real-time mobile telephony, internet data browsing, and video conferencing.`,
          maxMarks: 3,
          marks: 3
        },
        {
          subId: "(b)",
          id: "q02_b",
          prompt: "Write down and balance each of the following chemical synthesis equations:\n(i) $\\text{Fe} + \\text{O}_2 \\to \\text{Fe}_2\\text{O}_3$;\n(ii) $\\text{Na} + \\text{Cl}_2 \\to \\text{NaCl}$;\n(iii) $\\text{H}_2 + \\text{O}_2 \\to \\text{H}_2\\text{O}$.",
          workedSolution: `Balanced chemical equations:
• (i) Formation of iron (III) oxide:
$$4\\text{Fe}_{(s)} + 3\\text{O}_{2(g)} \\to 2\\text{Fe}_2\\text{O}_{3(s)}$$
• (ii) Synthesis of sodium chloride:
$$2\\text{Na}_{(s)} + \\text{Cl}_{2(g)} \\to 2\\text{NaCl}_{(s)}$$
• (iii) Synthesis of water:
$$2\\text{H}_{2(g)} + \\text{O}_{2(g)} \\to 2\\text{H}_2\\text{O}_{(l)}$$`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(c)",
          id: "q02_c",
          prompt: "State one primary physiological function performed by each of the following sub-cellular organelles in a eukaryotic cell:\n(i) Nucleus;\n(ii) Chloroplast;\n(iii) Mitochondrion.",
          workedSolution: `(i) Nucleus:
Contains genetic material (DNA/chromosomes) that coordinates and controls all cellular metabolic activities and governs heredity and cell division.

(ii) Chloroplast:
Contains the green pigment chlorophyll and enzymes that trap solar light energy to synthesize glucose carbohydrates via photosynthesis.

(iii) Mitochondrion:
Acts as the cellular powerhouse, conducting aerobic cellular respiration (Krebs cycle and oxidative phosphorylation) to liberate metabolic energy in the form of ATP.`,
          maxMarks: 3,
          marks: 3
        },
        {
          subId: "(d)",
          id: "q02_d",
          prompt: "Mention four cultural field practices routinely carried out on a commercial vegetable farm to maximize crop yield.",
          workedSolution: `1. Weeding: Eliminates weed competition for light, water, and nutrients.
2. Mulching: Conserves soil moisture, suppresses weed germination, and moderates soil temperature.
3. Staking: Supports weak herbaceous climbing stems off wet soil, preventing fruit rot.
4. Thinning out: Removes overcrowded, weak seedlings to establish recommended plant spacing.
5. Pruning / Pinching: Removes lateral auxiliary shoots to channel nutrients into developing fruits.`,
          maxMarks: 3,
          marks: 3
        },
        {
          subId: "(e)",
          id: "q02_e",
          prompt: "Name two statutory regulatory agencies responsible for food safety, consumer standards, and quality assurance in Ghana.",
          workedSolution: `1. Food and Drugs Authority (FDA, Ghana)
2. Ghana Standards Authority (GSA)`,
          maxMarks: 2,
          marks: 2
        }
      ]
    },
    {
      id: "q03",
      questionNumber: "3",
      isPracticalSectionA: false,
      subQuestions: [
        {
          subId: "(a)",
          id: "q03_a",
          prompt: "Using biological and osmotic principles, explain why a healthy tomato plant is likely to wilt and suffer leaf scorching if an excessive concentration of chemical fertilizer is applied around its base.",
          workedSolution: `Applying excessive chemical fertilizer dissolves into the soil moisture, creating a hypertonic soil solution with a lower water potential than the internal cell sap of the tomato root hair cells. 
By osmosis, water moves out of the root cells into the surrounding concentrated soil solution. This causes root and stem cells to lose turgidity and become flaccid (plasmolysis). Deprived of internal hydrostatic turgor pressure to support herbaceous tissues, the plant wilts and suffers fertilizer burn.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(b)",
          id: "q03_b",
          prompt: "(i) Give two fundamental differences between electrical conductors and electrical insulators.\n(ii) State two hazards or dangerous consequences of illegal electrical connections in residential buildings.",
          workedSolution: `(i) Differences:
1. Electron mobility: Electrical conductors possess free, mobile delocalized valence electrons that drift easily under an applied potential, whereas insulators hold electrons tightly in covalent or ionic bonds with no free charge carriers.
2. Electrical resistance: Conductors have very low electrical resistivity, while insulators have extremely high resistivity.

(ii) Hazards of illegal electrical connections:
1. Severe risk of domestic fires caused by overloaded, unrated cables melting their insulation.
2. Fatal electric shocks and electrocution of household occupants due to ungrounded live wires.
3. Damage and destruction of delicate domestic electrical appliances from erratic voltage surges.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(c)",
          id: "q03_c",
          prompt: "Explain each of the following terms as applied to physical changes of state in matter:\n(i) Condensation;\n(ii) Freezing.",
          workedSolution: `(i) Condensation:
The exothermic physical phase transition in which a substance changes from a gaseous state (vapor) into a liquid state upon cooling or loss of latent heat.

(ii) Freezing (Solidification):
The exothermic physical phase transition in which a substance converts from a liquid state into a solid crystalline state as its temperature drops to its freezing point.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(d)",
          id: "q03_d",
          prompt: "(i) State two clinical diseases or disorders associated with the human circulatory system.\n(ii) Mention two clinical or lifestyle practices that help prevent each of the diseases stated in (d)(i).",
          workedSolution: `(i) Circulatory diseases:
1. Hypertension (High blood pressure)
2. Arteriosclerosis / Coronary artery disease (Atherosclerosis)

(ii) Preventive measures:
• For Hypertension: Engage in regular aerobic cardiovascular exercise, maintain low dietary salt (sodium) intake, manage stress, and avoid tobacco smoking.
• For Arteriosclerosis: Consume low-cholesterol diets (reduce saturated animal fats and trans-fats), consume high-fibre green vegetables, and maintain a healthy body mass index.`,
          maxMarks: 3,
          marks: 3
        }
      ]
    },
    {
      id: "q04",
      questionNumber: "4",
      isPracticalSectionA: false,
      subQuestions: [
        {
          subId: "(a)",
          id: "q04_a",
          prompt: "(i) What is a bipolar junction transistor in electronics?\n(ii) Give two practical operational uses of a transistor in electronic circuits.",
          workedSolution: `(i) Definition of transistor:
A three-terminal solid-state semiconductor electronic device composed of three doped semiconductor layers (either NPN or PNP) with two internal p-n junctions, used to regulate, amplify, or switch electrical signals.

(ii) Practical uses:
1. As an electronic switch (turning current on and off without moving mechanical parts).
2. As a linear signal amplifier (amplifying weak audio or sensor voltages in radio receivers).`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(b)",
          id: "q04_b",
          prompt: "Identify a suitable liquid solvent capable of dissolving each of the following common solutes or stains:\n(i) Engine grease;\n(ii) Ballpoint ink stain;\n(iii) Starch powder;\n(iv) Cane sugar crystals;\n(v) Oil paint;\n(vi) Solid iodine crystals.",
          workedSolution: `Suitable solvents:
• (i) Engine grease: Kerosene (or petrol / turpentine)
• (ii) Ballpoint ink stain: Methylated spirit (or pure ethanol)
• (iii) Starch powder: Warm water
• (iv) Cane sugar crystals: Pure water
• (v) Oil paint: Turpentine (or paint thinner / kerosene)
• (vi) Solid iodine crystals: Ethanol (alcohol) or potassium iodide solution`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(c)",
          id: "q04_c",
          prompt: "(i) What is a respiratory organ in animal physiology?\n(ii) Name two anatomical organs or structures that make up the human respiratory tract.",
          workedSolution: `(i) Definition:
A specialized anatomical structure or organ possessing a large, thin, moist, and vascularized surface area through which respiratory gases (oxygen and carbon dioxide) diffuse between the body and the external environment.

(ii) Respiratory structures in humans:
Lungs (containing alveoli), Trachea (windpipe), and Bronchi.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(d)",
          id: "q04_d",
          prompt: "(i) What is an agricultural value chain?\n(ii) Name two functional stages or components of an agricultural commodity chain.",
          workedSolution: `(i) Definition of agricultural value chain:
The entire sequence of commercial activities and enterprises involved in bringing an agricultural commodity from initial input supply and on-farm production, through harvesting, agro-processing, packaging, storage, and transportation, to the final consumer.

(ii) Components / Stages:
1. Agricultural input supply stage (seeds, fertilizers, farm machinery)
2. On-farm crop/livestock production stage
3. Post-harvest processing and value addition stage
4. Marketing, logistics, and retail distribution stage`,
          maxMarks: 3,
          marks: 3
        }
      ]
    },
    {
      id: "q05",
      questionNumber: "5",
      isPracticalSectionA: false,
      subQuestions: [
        {
          subId: "(a)",
          id: "q05_a",
          prompt: "(i) What are astronomical stars?\n(ii) Arrange in sequential order, starting closest to the Sun, the first four inner planets of our Solar System.",
          workedSolution: `(i) Definition of stars:
Massive, luminous celestial bodies of incandescent plasma held together by their own gravity that generate light, heat, and radiation through thermonuclear fusion of hydrogen into helium in their cores.

(ii) First four planets from the Sun:
1. Mercury
2. Venus
3. Earth
4. Mars`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(b)",
          id: "q05_b",
          prompt: "(i) State two physiological or morphological differences between plants and animals.\n(ii) State two biological similarities shared by both plants and animals.",
          workedSolution: `(i) Differences:
1. Nutrition: Plants are autotrophic (synthesize food via photosynthesis using chlorophyll), whereas animals are heterotrophic (ingest pre-formed organic food).
2. Cell structure: Plant cells have a rigid cellulose cell wall and large permanent vacuoles, whereas animal cells lack cell walls and have small temporary vacuoles.
3. Locomotion: Animals move from place to place, whereas plants are anchored and show only localized tropism movements.

(ii) Similarities:
1. Both carry out cellular respiration to produce metabolic ATP energy.
2. Both grow, reproduce, excrete metabolic wastes, and respond to environmental stimuli.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(c)",
          id: "q05_c",
          prompt: "Explain each of the following agricultural farming systems:\n(i) Pastoral farming;\n(ii) Ecological (organic) farming.",
          workedSolution: `(i) Pastoral farming:
A branch of agriculture dedicated to the extensive rearing and grazing of livestock (such as cattle, sheep, and goats) on natural grasslands and rangelands, often involving transhumance or nomadic herding.

(ii) Ecological (organic) farming:
A sustainable crop and livestock production system that avoids synthetic chemical fertilizers, pesticides, and growth hormones, relying instead on biological pest control, organic composting, crop rotation, and green manuring.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(d)",
          id: "q05_d",
          prompt: "State the characteristic physical and chemical properties of pure water with respect to:\n(i) Odour;\n(ii) Taste;\n(iii) Action on blue and red litmus papers.",
          workedSolution: `Properties of pure water:
• (i) Odour: Completely odourless (has no smell).
• (ii) Taste: Completely tasteless (insipid).
• (iii) Effect on litmus: Completely neutral ($pH = 7$); it leaves red litmus paper red and blue litmus paper blue without color change.`,
          maxMarks: 3,
          marks: 3
        }
      ]
    },
    {
      id: "q06",
      questionNumber: "6",
      isPracticalSectionA: false,
      subQuestions: [
        {
          subId: "(a)",
          id: "q06_a",
          prompt: "Explain what is meant by each of the following botanical terms:\n(i) Annual crop plants;\n(ii) Perennial crop plants.",
          workedSolution: `(i) Annual plants:
Crop plants that complete their entire vegetative, flowering, and reproductive life cycle from seed germination to seed production and death within a single growing season or one calendar year (e.g., maize, cowpea, tomato).

(ii) Perennial plants:
Plants that survive, grow, and reproduce for several consecutive years, continuing vegetative growth and fruiting across multiple seasons without dying after a single harvest (e.g., cocoa, oil palm, mango, citrus).`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(b)",
          id: "q06_b",
          prompt: "Mention the specific health hazard or physical injury involved in each of the following unsafe laboratory practices:\n(i) Consuming food or drinking water inside a science laboratory;\n(ii) Washing hands using an unlabelled liquid found in a glass beaker on a workbench;\n(iii) Walking barefoot or in open-toed sandals inside a laboratory.",
          workedSolution: `(i) Eating/drinking in the laboratory:
Risk of accidental ingestion of toxic chemical residues, heavy metal poisons, or pathogenic microorganisms from contaminated bench surfaces or hands.

(ii) Washing with unlabelled liquid:
The liquid may be a concentrated corrosive acid, caustic alkali, or toxic organic solvent that causes severe chemical burns, skin blistering, or systemic poisoning.

(iii) Walking barefoot / open shoes:
Risk of severe cuts from broken glass splinters on the floor or chemical burns from corrosive spills.`,
          maxMarks: 3,
          marks: 3
        },
        {
          subId: "(c)",
          id: "q06_c",
          prompt: "(i) What is a digestive enzyme in animal physiology?\n(ii) Give two specific examples of digestive enzymes produced in the human alimentary canal, stating the substrate acted upon by each.",
          workedSolution: `(i) Definition:
A biological protein catalyst secreted by digestive glands into the alimentary canal to accelerate the biochemical hydrolysis of large, insoluble food polymers into small, absorbable monomers.

(ii) Examples:
• Salivary amylase (Ptyalin): Secreted in the mouth; hydrolyzes cooked starch into maltose.
• Pepsin: Secreted by gastric glands in the stomach; hydrolyzes complex proteins into peptides.
• Pancreatic Lipase: Secreted by the pancreas into the duodenum; hydrolyzes emulsified lipids into fatty acids and glycerol.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(d)",
          id: "q06_d",
          prompt: "In a tabular format, state two distinct physical differences between the conduction of heat and the radiation of heat.",
          workedSolution: `Differences Table:

| Criterion | Conduction | Radiation |
| :--- | :--- | :--- |
| **Material Medium Requirement** | Requires a physical material medium (predominantly solids) | Does not require any material medium (travels through vacuum) |
| **Mechanism of Transfer** | Transferred via particle lattice vibrations and free electron collisions | Transferred via electromagnetic infrared waves at the speed of light ($3 \\times 10^8\\text{ m s}^{-1}$) |
| **Rate of Transfer** | Relatively slow thermal transfer process | Extremely rapid transfer at the speed of light |`,
          maxMarks: 4,
          marks: 4
        }
      ]
    }
  ]
};

// Also attach parts = subQuestions to all questions for universal compatibility
SET_BECE_2012_SCIENCE_P2.questions.forEach((q: any) => {
  if (q.subQuestions) {
    q.parts = q.subQuestions;
  }
});
