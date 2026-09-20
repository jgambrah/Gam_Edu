/**
 * 2011 BECE Integrated Science Paper 2 (Set 95 Practical & Theory Essay Test)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_2011_variant
 * Set Number: Set 95
 * Format: Structured essay & laboratory practicals with sanitized responsive vector SVGs
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
 */

// 1. Vector SVG for Q1(a): Rectilinear Propagation of Light through Cardboard Holes
export const svgQ1aLightPropagation = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Light Source (Bulb on Left) -->
    <g transform='translate(35, 75)'>
      <circle cx='0' cy='0' r='14' fill='#fef08a' stroke='#f59e0b' stroke-width='2'/>
      <path d='M -4 14 L 4 14 L 3 20 L -3 20 Z' fill='#94a3b8'/>
      <!-- Light rays emitting -->
      <line x1='-18' y1='-14' x2='-25' y2='-20' stroke='#f59e0b' stroke-width='1.5'/>
      <line x1='0' y1='-20' x2='0' y2='-28' stroke='#f59e0b' stroke-width='1.5'/>
      <line x1='18' y1='-14' x2='25' y2='-20' stroke='#f59e0b' stroke-width='1.5'/>
      <text x='0' y='36' font-size='9' font-weight='bold' fill='#fde047' text-anchor='middle'>Light Source</text>
    </g>

    <!-- Cardboard A -->
    <g transform='translate(110, 35)'>
      <rect x='0' y='0' width='8' height='85' fill='#334155' stroke='#cbd5e1' stroke-width='1.2'/>
      <!-- Pinhole -->
      <circle cx='4' cy='40' r='3.5' fill='#0f172a' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='4' y='105' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Card A</text>
    </g>

    <!-- Cardboard B -->
    <g transform='translate(180, 35)'>
      <rect x='0' y='0' width='8' height='85' fill='#334155' stroke='#cbd5e1' stroke-width='1.2'/>
      <!-- Pinhole aligned -->
      <circle cx='4' cy='40' r='3.5' fill='#0f172a' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='4' y='105' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Card B</text>
    </g>

    <!-- Cardboard C -->
    <g transform='translate(250, 35)'>
      <rect x='0' y='0' width='8' height='85' fill='#334155' stroke='#cbd5e1' stroke-width='1.2'/>
      <!-- Pinhole aligned -->
      <circle cx='4' cy='40' r='3.5' fill='#0f172a' stroke='#38bdf8' stroke-width='1.5'/>
      <text x='4' y='105' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Card C</text>
    </g>

    <!-- Straight Line Light Ray Through Holes -->
    <line x1='50' y1='75' x2='310' y2='75' stroke='#ef4444' stroke-width='2' stroke-dasharray='4,3'/>
    <polygon points='295,71 305,75 295,79' fill='#ef4444'/>

    <!-- Observer Eye on Right -->
    <g transform='translate(325, 75)'>
      <path d='M 0 -12 Q 22 0 0 12 Q -8 0 0 -12 Z' fill='#ffffff' stroke='#94a3b8' stroke-width='1.5'/>
      <circle cx='3' cy='0' r='5' fill='#0284c7'/>
      <circle cx='4' cy='0' r='2' fill='#0f172a'/>
      <text x='5' y='28' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Observer</text>
    </g>

    <text x='190' y='160' font-size='9' font-weight='bold' fill='#94a3b8' text-anchor='middle'>RECTILINEAR PROPAGATION: LIGHT TRAVELS IN STRAIGHT LINES</text>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q1(b): Standard Hazard Warning Symbols (A, B, C, D)
export const svgQ1bHazardSymbols = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 130' width='100%' height='120' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Symbol A: Toxic / Poison (Square frame with skull and crossbones) -->
    <g transform='translate(25, 18)'>
      <rect x='0' y='0' width='65' height='65' rx='6' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/>
      <circle cx='32' cy='28' r='11' fill='#ffffff'/>
      <circle cx='28' cy='26' r='2' fill='#0f172a'/><circle cx='36' cy='26' r='2' fill='#0f172a'/>
      <rect x='29' y='36' width='6' height='4' fill='#0f172a'/>
      <line x1='16' y1='48' x2='48' y2='48' stroke='#ffffff' stroke-width='2.5'/>
      <text x='32' y='82' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Symbol A</text>
    </g>

    <!-- Symbol B: Corrosive (Triangle frame with test tubes pouring acid) -->
    <g transform='translate(115, 18)'>
      <polygon points='32,4 62,60 2,60' fill='#1e293b' stroke='#ef4444' stroke-width='2'/>
      <line x1='18' y1='22' x2='28' y2='32' stroke='#ffffff' stroke-width='2.5'/>
      <rect x='28' y='46' width='22' height='6' fill='#ffffff'/>
      <circle cx='30' cy='38' r='2' fill='#ef4444'/><circle cx='36' cy='42' r='2' fill='#ef4444'/>
      <text x='32' y='82' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>Symbol B</text>
    </g>

    <!-- Symbol C: Highly Flammable (Square frame with flame) -->
    <g transform='translate(205, 18)'>
      <rect x='0' y='0' width='65' height='65' rx='6' fill='#1e293b' stroke='#ea580c' stroke-width='2'/>
      <path d='M 32 12 Q 44 26 38 38 Q 48 36 42 50 Q 22 54 22 40 Q 20 26 32 12 Z' fill='#f59e0b' stroke='#ea580c' stroke-width='1.5'/>
      <text x='32' y='82' font-size='10' font-weight='bold' fill='#ea580c' text-anchor='middle'>Symbol C</text>
    </g>

    <!-- Symbol D: High Voltage / Electrical Hazard (Triangle with lightning arrow) -->
    <g transform='translate(295, 18)'>
      <polygon points='32,4 62,60 2,60' fill='#1e293b' stroke='#eab308' stroke-width='2'/>
      <!-- Lightning flash -->
      <polygon points='34,14 22,34 32,34 26,52 44,28 32,28' fill='#fde047'/>
      <text x='32' y='82' font-size='10' font-weight='bold' fill='#fde047' text-anchor='middle'>Symbol D</text>
    </g>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// 3. Vector SVG for Q1(c): Human Teeth Types (Sanitized, No Spoilers)
export const svgQ1cTeethTypes = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 360 200' width='100%' height='185' style='max-width: 460px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Tooth A: Incisor (Flat, chisel-shaped crown, single root) -->
    <g transform='translate(40, 20)'>
      <!-- Crown I -->
      <path d='M 15 20 L 60 20 L 54 75 L 21 75 Z' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.8'/>
      <!-- Single Root II -->
      <path d='M 21 75 L 34 145 L 41 145 L 54 75 Z' fill='#fed7aa' stroke='#ea580c' stroke-width='1.8'/>
      <text x='37' y='172' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Tooth A</text>
    </g>

    <!-- Tooth B: Molar (Broad, cusped crown, multiple roots) -->
    <g transform='translate(140, 20)'>
      <!-- Broad Crown with cusps -->
      <path d='M 10 25 Q 25 15 40 25 Q 55 15 70 25 L 68 75 L 12 75 Z' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.8'/>
      <!-- Three diverging roots -->
      <path d='M 12 75 L 18 145 L 26 145 L 32 85' fill='#fed7aa' stroke='#ea580c' stroke-width='1.5'/>
      <path d='M 32 85 L 38 145 L 44 145 L 48 85' fill='#fed7aa' stroke='#ea580c' stroke-width='1.5'/>
      <path d='M 48 85 L 54 145 L 62 145 L 68 75' fill='#fed7aa' stroke='#ea580c' stroke-width='1.5'/>
      <text x='40' y='172' font-size='12' font-weight='bold' fill='#10b981' text-anchor='middle'>Tooth B</text>
    </g>

    <!-- Tooth C: Canine (Pointed conical cusp, single sturdy root) -->
    <g transform='translate(260, 20)'>
      <!-- Crown with sharp pointed cusp -->
      <path d='M 35 12 L 55 45 L 50 75 L 20 75 L 15 45 Z' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.8'/>
      <!-- Single long root -->
      <path d='M 20 75 L 32 150 L 38 150 L 50 75 Z' fill='#fed7aa' stroke='#ea580c' stroke-width='1.8'/>
      <text x='35' y='172' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Tooth C</text>
    </g>

    <!-- Section Bracket Pointer Labels -->
    <line x1='15' y1='45' x2='30' y2='45' stroke='#38bdf8' stroke-width='1.5'/>
    <text x='8' y='49' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='end'>I</text>

    <line x1='15' y1='105' x2='30' y2='105' stroke='#fb923c' stroke-width='1.5'/>
    <text x='8' y='109' font-size='12' font-weight='bold' fill='#fb923c' text-anchor='end'>II</text>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

// 4. Vector SVG for Q1(d): Agricultural Hand Tools (Sanitized, No Spoilers)
export const svgQ1dFarmTools = `<div class="my-4 flex justify-center">
  <svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 500px;' xmlns='http://www.w3.org/2000/svg'>
    <rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/>
    
    <!-- Tool A: Garden Digging Fork -->
    <g transform='translate(20, 20)'>
      <!-- D-handle -->
      <path d='M 12 10 L 28 10 L 28 24 L 12 24 Z' fill='none' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='20' y1='24' x2='20' y2='95' stroke='#94a3b8' stroke-width='2.5'/>
      <!-- 4 prongs -->
      <line x1='8' y1='95' x2='32' y2='95' stroke='#cbd5e1' stroke-width='3'/>
      <line x1='10' y1='95' x2='10' y2='140' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='16' y1='95' x2='16' y2='140' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='24' y1='95' x2='24' y2='140' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='30' y1='95' x2='30' y2='140' stroke='#cbd5e1' stroke-width='2'/>
      <text x='20' y='165' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Tool A</text>
    </g>

    <!-- Tool B: Garden Spade -->
    <g transform='translate(85, 20)'>
      <path d='M 12 10 L 28 10 L 28 24 L 12 24 Z' fill='none' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='20' y1='24' x2='20' y2='95' stroke='#94a3b8' stroke-width='2.5'/>
      <!-- Rectangular flat cutting blade -->
      <rect x='8' y='95' width='24' height='45' fill='#475569' stroke='#cbd5e1' stroke-width='1.5'/>
      <text x='20' y='165' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Tool B</text>
    </g>

    <!-- Tool C: Hand Trowel -->
    <g transform='translate(155, 30)'>
      <line x1='10' y1='20' x2='35' y2='45' stroke='#d97706' stroke-width='4' stroke-linecap='round'/>
      <!-- Curved pointed metal scoop -->
      <path d='M 35 45 Q 60 70 70 85 Q 50 85 30 65 Z' fill='#64748b' stroke='#cbd5e1' stroke-width='1.5'/>
      <text x='35' y='115' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Tool C</text>
    </g>

    <!-- Tool D: Hand Fork (Weeding cultivator) -->
    <g transform='translate(155, 115)'>
      <line x1='10' y1='20' x2='35' y2='20' stroke='#d97706' stroke-width='4' stroke-linecap='round'/>
      <line x1='35' y1='20' x2='60' y2='12' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='35' y1='20' x2='60' y2='20' stroke='#cbd5e1' stroke-width='2'/>
      <line x1='35' y1='20' x2='60' y2='28' stroke='#cbd5e1' stroke-width='2'/>
      <text x='35' y='50' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Tool D</text>
    </g>

    <!-- Tool E: Watering Can with Rose Head -->
    <g transform='translate(260, 45)'>
      <!-- Cylindrical body -->
      <rect x='30' y='30' width='55' height='60' rx='8' fill='#0284c7' opacity='0.3' stroke='#38bdf8' stroke-width='1.8'/>
      <!-- Top and back handles -->
      <path d='M 38 30 Q 58 10 78 30' fill='none' stroke='#38bdf8' stroke-width='2.5'/>
      <path d='M 85 45 Q 105 60 85 80' fill='none' stroke='#38bdf8' stroke-width='2.5'/>
      <!-- Long angled spout -->
      <line x1='30' y1='75' x2='0' y2='45' stroke='#38bdf8' stroke-width='3.5'/>
      <!-- Perforated rose head -->
      <ellipse cx='-2' cy='42' rx='7' ry='12' fill='#cbd5e1' stroke='#38bdf8' transform='rotate(30 -2 42)'/>
      <text x='55' y='125' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Tool E</text>
    </g>
  </svg>
</div>`.trim().replace(/\n\s*/g, '');

export const SET_BECE_2011_SCIENCE_P2: any = {
  id: "paper_2011_variant_p2",
  title: "2011 BECE Integrated Science Paper 2 (Set 95 Practical & Theory)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2011 BECE Practical & Theory Essay Test",
  variantType: "past_paper_variant",
  year: 2011,
  paperType: 2,
  setNumber: 95,
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
          prompt: `In an experiment to demonstrate a fundamental optical property of light, three opaque cardboards labelled A, B, and C with small pinholes drilled at their exact geometric centers were positioned vertically in a straight line between a lighted bulb and an observer:

${svgQ1aLightPropagation}

(i) What would the observer see through the holes from the position shown when all three cardboards are aligned in a straight line?

(ii) What would the observer see when middle cardboard B is displaced slightly to one side out of alignment?

(iii) Explain the scientific reason for the observation made in (a)(ii).

(iv) What would be observed when cardboard B is shifted back into its original alignment with cardboards A and C?

(v) Name the specific physical property of light demonstrated in this experiment.

(vi) Mention:
  (α) two natural phenomena that occur in the environment as a consequence of this property of light;
  (β) one optical instrument that functions based on this property of light.`,
          workedSolution: `(i) Observation in initial alignment:
The observer sees the illuminated light from the glowing bulb clearly through the aligned pinholes.

(ii) Observation when Card B is displaced:
The observer no longer sees the light from the bulb (the light disappears from view / darkness is seen).

(iii) Explanation of observation in (a)(ii):
Light travels rectilinearly (in straight lines). Displacing cardboard B puts an opaque barrier across the straight path of the light rays, blocking them from passing through the hole in cardboard C to the observer's eye.

(iv) Observation when Card B is restored:
The light from the bulb becomes visible to the observer once again.

(v) Property of light demonstrated:
Rectilinear propagation of light (light travels in straight lines).

(vi) Natural occurrences and device:
• (α) Natural occurrences:
  1. The formation of sharp shadows cast by opaque objects.
  2. The occurrence of solar and lunar eclipses (eclipses of the Sun and Moon).
  3. The alternating sequence of day and night.
• (β) Optical device:
  A pinhole camera (or shadow-casting sundial / periscope).`,
          maxMarks: 10,
          marks: 10
        },
        {
          subId: "(b)",
          id: "q01_b",
          prompt: `The diagrams below illustrate standard international hazard warning symbols encountered in science laboratories and everyday industrial environments:

${svgQ1bHazardSymbols}

(i) State what each of the hazard warning symbols labelled A, B, C, and D represents.

(ii) Name one specific chemical substance or material associated with each of the symbols labelled A, B, and C.

(iii) Name one public, commercial, or industrial facility where the hazard symbol labelled D is prominently displayed.

(iv) State two practical advantages of using standardized graphic hazard symbols instead of written text labels on chemical containers and equipment.`,
          workedSolution: `(i) Meaning of symbols:
• Symbol A: Toxic / Poisonous hazard (Danger of serious poisoning or death if inhaled, ingested, or absorbed).
• Symbol B: Corrosive hazard (Attacks and destroys living dermal tissue and corrodes metals).
• Symbol C: Highly Flammable / Combustible hazard (Catches fire easily at low ignition temperatures).
• Symbol D: High Voltage / Electrical Shock hazard (Risk of electric shock or fatal electrocution).

(ii) Associated substances:
• Symbol A (Toxic): Potassium cyanide, Mercury (II) chloride, or synthetic organophosphate pesticides (e.g., DDT).
• Symbol B (Corrosive): Concentrated hydrochloric acid ($HCl$), concentrated sulfuric acid ($H_2SO_4$), or caustic sodium hydroxide ($NaOH$).
• Symbol C (Flammable): Pure ethanol (alcohol), kerosene, petrol (gasoline), or Liquefied Petroleum Gas (LPG).

(iii) Facility displaying Symbol D:
Electrical substations, power generating plants, high-voltage transformer yards, switchgear distribution panels, or industrial transmission towers.

(iv) Advantages of hazard symbols:
1. Universal communication: Graphic symbols transcend language barriers and illiteracy, communicating danger instantly to all individuals.
2. Rapid recognition: Visual pictograms alert workers to hazards quickly from a distance, prompting immediate safety precautions.`,
          maxMarks: 10,
          marks: 10
        },
        {
          subId: "(c)",
          id: "q01_c",
          prompt: `The diagrams below illustrate the three principal morphological types of teeth found in the human dentition:

${svgQ1cTeethTypes}

(i) Identify each type of tooth labelled A, B, and C.

(ii) Describe the characteristic shape of the crown of each of the teeth labelled A, B, and C.

(iii) State the primary mechanical mastication function performed by each of the teeth labelled A, B, and C.

(iv) Name the two anatomical tooth regions labelled I and II.`,
          workedSolution: `(i) Identification of teeth:
• Tooth A: Incisor
• Tooth B: Molar (or Premolar)
• Tooth C: Canine

(ii) Shape of the crown:
• Tooth A (Incisor): Broad, flat, horizontal chisel-like crown with a sharp straight cutting edge.
• Tooth B (Molar): Broad, flat, rectangular crown possessing four or five rounded cusps and ridges, anchored by multiple roots.
• Tooth C (Canine): Single, sharp, conical crown tapering to a pointed cusp.

(iii) Mechanical functions:
• Tooth A (Incisor): Biting, cutting, and shearing off pieces of food morsels.
• Tooth B (Molar): Crushing, grinding, and masticating food into fine particles for swallowing.
• Tooth C (Canine): Piercing, seizing, and tearing tough, fibrous food materials (such as meat).

(iv) Anatomical regions:
• Region I: Crown (the exposed upper portion covered with enamel above the gum line).
• Region II: Root (the lower portion embedded into the alveolar jawbone socket).`,
          maxMarks: 10,
          marks: 10
        },
        {
          subId: "(d)",
          id: "q01_d",
          prompt: `The diagrams below illustrate standard agricultural hand tools labelled A, B, C, D, and E used in crop husbandry:

${svgQ1dFarmTools}

(i) Identify each of the agricultural hand tools labelled A, B, C, D, and E.

(ii) Mention one specific practical agricultural use for each of the tools labelled A, B, C, D, and E.`,
          workedSolution: `(i) Identification of hand tools:
• Tool A: Garden digging fork
• Tool B: Garden spade
• Tool C: Hand trowel
• Tool D: Hand fork (hand cultivator)
• Tool E: Watering can (with perforated rose)

(ii) Specific agricultural uses:
• Tool A (Garden Fork): Turning over heavy compacted soil, breaking up large soil clods during primary tillage, and lifting farmyard manure or compost.
• Tool B (Spade): Digging straight-sided planting trenches, leveling soil surfaces, cutting sods, and lifting loose earth.
• Tool C (Hand Trowel): Scooping out small planting holes and lifting tender seedlings with their root balls from nursery beds during transplanting.
• Tool D (Hand Fork): Lightly loosening and aerating surface topsoil around growing seedlings and uprooting shallow-rooted weeds in vegetable beds.
• Tool E (Watering Can): Applying fine, uniform showers of water to nursery seedbeds and newly transplanted crops without washing away delicate seeds or eroding topsoil.`,
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
          prompt: "(i) What are ruminant animals in livestock farming?\n(ii) Give two common biological examples of ruminants reared on farms in Ghana.",
          workedSolution: `(i) Definition of ruminants:
Herbivorous, even-toed cud-chewing mammals that possess a complex, four-chambered stomach (comprising the rumen, reticulum, omasum, and abomasum) capable of digesting tough fibrous cellulose via symbiotic microbial fermentation.

(ii) Examples:
Cattle, sheep, and goats (also camels).`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(b)",
          id: "q02_b",
          prompt: "(i) Define a physical force in mechanics.\n(ii) State two specific dynamic effects that an applied unbalanced force can produce on a body.",
          workedSolution: `(i) Definition of force:
A physical influence in the form of a push or pull that alters or tends to alter a body's state of rest or uniform motion in a straight line ($F = ma$).

(ii) Dynamic effects:
• It can cause a stationary body to begin moving.
• It can accelerate or decelerate (stop) a moving body.
• It can change the direction of motion of a moving body.
• It can distort, compress, or change the shape of an object.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(c)",
          id: "q02_c",
          prompt: "(i) Mention two sustainable environmental practices that help maintain balance in the global carbon cycle.\n(ii) State one major environmental consequence that occurs when the carbon cycle is severely disrupted by excessive emissions.",
          workedSolution: `(i) Practices maintaining carbon cycle:
1. Reforestation and afforestation: Planting trees that absorb atmospheric carbon dioxide through photosynthesis to act as long-term carbon sinks.
2. Reducing the combustion of fossil fuels by adopting renewable energy (solar, wind, hydroelectric).

(ii) Environmental consequence of disruption:
Global warming (enhanced greenhouse effect), leading to rising sea levels, severe droughts, and erratic global climate patterns.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(d)",
          id: "q02_d",
          prompt: "(i) Mention the three fundamental sub-atomic particles that constitute an atom.\n(ii) State the relative electrical charge carried by each of the three sub-atomic particles named in (d)(i).\n(iii) Name the specific charged entity formed when a neutral metallic atom loses one or more valence electrons.",
          workedSolution: `(i) Sub-atomic particles:
Protons, Neutrons, and Electrons.

(ii) Relative electrical charges:
• Proton: $+1$ (positive charge)
• Neutron: $0$ (neutral / no charge)
• Electron: $-1$ (negative charge)

(iii) Entity formed upon electron loss:
A cation (or positively charged ion).`,
          maxMarks: 3,
          marks: 3
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
          prompt: "(i) What is a mixture in physical chemistry?\n(ii) Explain why certain liquid mixtures (such as suspensions and liquid medicines) must be stirred or shaken thoroughly before they are used.",
          workedSolution: `(i) Definition of a mixture:
A physical combination of two or more distinct substances in any proportion in which the individual constituents retain their unique chemical identities and can be separated by physical methods.

(ii) Why suspensions are stirred:
In suspensions, the insoluble solid particles are denser than the liquid vehicle and settle out to the bottom upon standing (sedimentation). Stirring or shaking re-disperses the particles uniformly throughout the liquid, ensuring a uniform dosage or composition upon administration.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(b)",
          id: "q03_b",
          prompt: "(i) What is meant by the reflection of light?\n(ii) State two physical characteristics of the images formed by flat plane mirrors.",
          workedSolution: `(i) Definition of reflection:
The bouncing back of light rays into the same medium when they strike an interface or reflecting boundary.

(ii) Characteristics of plane mirror images:
1. The image is virtual (cannot be captured on a physical screen).
2. The image is erect (upright) and of identical size to the object.
3. The image is laterally inverted (left and right sides are reversed).
4. The image distance behind the mirror equals the perpendicular object distance in front.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(c)",
          id: "q03_c",
          prompt: "(i) What is a fertilizer in agriculture?\n(ii) Give one commercial example of a synthetic inorganic chemical fertilizer.",
          workedSolution: `(i) Definition of fertilizer:
Any natural organic manure or manufactured synthetic chemical substance applied to soil or plant tissues to supply one or more essential plant nutrients needed for healthy vegetative growth and crop yield.

(ii) Example of inorganic fertilizer:
NPK 15-15-15 compound fertilizer (or Urea, Ammonium sulfate, Muriate of potash).`,
          maxMarks: 3,
          marks: 3
        },
        {
          subId: "(d)",
          id: "q03_d",
          prompt: "(i) What is indiscriminate sexual intercourse?\n(ii) State two adverse health, social, or educational dangers that indiscriminate sex poses to human beings.",
          workedSolution: `(i) Definition:
Engaging in casual, unprotected sexual relations with multiple sexual partners without emotional commitment, marital stability, or contraceptive protection.

(ii) Dangers:
1. High risk of contracting sexually transmitted infections (STIs), including HIV/AIDS, syphilis, and gonorrhea.
2. Unplanned teenage pregnancy, leading to school dropouts, emotional distress, and financial hardship.
3. Social stigmatization and exposure to unsafe illegal abortions.`,
          maxMarks: 4,
          marks: 4
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
          prompt: "(i) What is a simple machine?\n(ii) Give two everyday examples of elementary simple machines.",
          workedSolution: `(i) Definition:
A mechanical tool or device that makes work easier, faster, or more convenient by altering the magnitude, speed, or direction of an applied effort force.

(ii) Examples:
1. Lever (e.g., crowbar, pair of scissors)
2. Inclined plane (ramp)
3. Single fixed pulley
4. Wheel and axle
5. Wedge (axe)
6. Screw`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(b)",
          id: "q04_b",
          prompt: "(i) What is rusting in chemistry?\n(ii) State two destructive physical or economic effects of rusting on iron structures.",
          workedSolution: `(i) Definition:
The electrochemical oxidation of iron or its ferrous alloys in the presence of atmospheric oxygen and moisture to form hydrated iron (III) oxide ($Fe_2O_3 \\cdot xH_2O$).

(ii) Effects of rusting:
1. Weakens structural strength and causes perforation of metal roofs, bridges, and vehicle bodies.
2. Causes mechanical seizure of moving machine components and hinges.
3. Degrades electrical conductivity and incurs heavy financial costs for replacement and maintenance.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(c)",
          id: "q04_c",
          prompt: "(i) What are food nutrients in human and animal nutrition?\n(ii) Classify the following food items into Carbohydrates, Fats and Oils, or Proteins:\n**Beans, Fresh Palm Fruits, Lean Beef, Margarine, Bread, Maize Grain.**",
          workedSolution: `(i) Definition of food nutrients:
Essential chemical substances present in ingested food that are digested, absorbed, and utilized by living organisms to supply energy, build and repair body tissues, and regulate metabolic processes.

(ii) Classification:
• Carbohydrates: Bread, Maize Grain
• Fats and Oils: Fresh Palm Fruits, Margarine
• Proteins: Beans, Lean Beef`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(d)",
          id: "q04_d",
          prompt: "(i) State two clinical effects of nutritional malnutrition on domestic farm animals.\n(ii) Mention one infectious animal disease caused by a viral pathogen.",
          workedSolution: `(i) Effects of malnutrition:
1. Retarded physical growth, severe emaciation, and muscle wasting.
2. Low reproductive performance, infertility, and reduced milk, meat, or egg production.
3. Weakened immune resistance, making animals susceptible to opportunistic diseases.

(ii) Viral animal diseases:
Newcastle disease (in poultry), Fowl pox, Rinderpest, African swine fever, or Foot-and-mouth disease.`,
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
          prompt: "(i) What is soil erosion?\n(ii) Name two agronomic or mechanical methods used to control soil erosion on farmlands.",
          workedSolution: `(i) Definition of soil erosion:
The detachment and carrying away of topsoil particles from one locality to another by natural physical agents, primarily moving water or wind.

(ii) Erosion control methods:
1. Terracing (constructing stepped horizontal benches along steep hillsides).
2. Contour ploughing (tilling ridges across the slope gradient).
3. Planting cover crops (e.g., cowpea, mucuna) to protect bare topsoil.
4. Heavy mulching and constructing stone bunds or drainage ditches.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(b)",
          id: "q05_b",
          prompt: "Explain each of the following biological terms as used in ecology:\n(i) Physiological or morphological adaptation;\n(ii) Endangered species.",
          workedSolution: `(i) Adaptation:
Any inherited structural, physiological, or behavioral characteristic that enables an organism to survive and reproduce successfully in its specific ecological habitat.

(ii) Endangered species:
A biological species that is at serious risk of global or local extinction because its wild population has declined severely due to habitat destruction, poaching, or environmental changes.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(c)",
          id: "q05_c",
          prompt: "(i) Name one natural source or type of hard water.\n(ii) Explain why it is biologically and health-wise advisable for humans to drink hard water rather than soft water.",
          workedSolution: `(i) Source of hard water:
Deep borehole water, spring water from limestone hills, or mineral well water.

(ii) Health benefits of drinking hard water:
Hard water contains dissolved mineral cations of calcium ($\\text{Ca}^{2+}$) and magnesium ($\\text{Mg}^{2+}$). These essential minerals strengthen bones and teeth, help prevent dental caries, and are clinically associated with lower risks of cardiovascular heart diseases.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(d)",
          id: "q05_d",
          prompt: "(i) What is a magnetic field?\n(ii) State two methods used to manufacture artificial permanent magnets from ferromagnetic materials.",
          workedSolution: `(i) Definition of magnetic field:
A region of space surrounding a permanent magnet, moving electric charge, or current-carrying coil within which magnetic forces of attraction or repulsion can be detected.

(ii) Methods of making magnets:
1. Electrical method: Placing a steel bar inside a solenoid coil and passing direct current (DC) through it.
2. Stroking method: Stroking a steel bar repeatedly in one direction with the pole of a permanent magnet (single or divided touch).
3. Magnetic induction.`,
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
          prompt: "(i) Define each of the following terms in solutions chemistry: (α) Solvent; (β) Solute.\n(ii) Name one common universal liquid solvent used in the home.",
          workedSolution: `(i) Definitions:
• (α) Solvent: The continuous liquid medium in which another substance (solute) dissolves to form a homogeneous solution.
• (β) Solute: The substance that dissolves in a solvent to form a homogeneous solution.

(ii) Common household solvent:
Water ($\\text{H}_2\\text{O}$).`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(b)",
          id: "q06_b",
          prompt: "Explain the meaning of each of the following management terms as applied to animal production:\n(i) Daily balanced ration;\n(ii) Dehorning (debudding).",
          workedSolution: `(i) Balanced Ration:
The formulated feed allowance provided to a farm animal during a 24-hour period that contains all essential dietary nutrients in the correct proportions and quantities required for maintenance and production.

(ii) Dehorning (Debudding):
The surgical or thermal removal or cauterization of the horn buds or horns of cattle, sheep, or goats to prevent injury to herd-mates and farm handlers and facilitate easier handling.`,
          maxMarks: 4,
          marks: 4
        },
        {
          subId: "(c)",
          id: "q06_c",
          prompt: "(i) What is a chemical element?\n(ii) Write down the standard international chemical symbol for: (α) Potassium; (β) Sulfur.",
          workedSolution: `(i) Definition of element:
A pure chemical substance that consists of only one type of atom and cannot be broken down into simpler substances by ordinary chemical reactions.

(ii) Chemical symbols:
• (α) Potassium: $\\text{K}$ (from Latin *Kalium*)
• (β) Sulfur: $\\text{S}$`,
          maxMarks: 3,
          marks: 3
        },
        {
          subId: "(d)",
          id: "q06_d",
          prompt: "Explain the agronomic difference between the cropping systems:\n(i) Mixed farming;\n(ii) Mixed cropping.",
          workedSolution: `(i) Mixed farming:
An integrated agricultural system where crop cultivation and the rearing of livestock are practiced simultaneously on different sections of the same farmland parcel, allowing manure from animals to fertilize crops and crop residues to feed livestock.

(ii) Mixed cropping (Intercropping):
The practice of cultivating two or more distinct crop species simultaneously on the same piece of land during the same farming season without distinct row segregation.`,
          maxMarks: 4,
          marks: 4
        }
      ]
    }
  ]
};

// Also attach parts = subQuestions to all questions for universal compatibility
SET_BECE_2011_SCIENCE_P2.questions.forEach((q: any) => {
  if (q.subQuestions) {
    q.parts = q.subQuestions;
  }
});
