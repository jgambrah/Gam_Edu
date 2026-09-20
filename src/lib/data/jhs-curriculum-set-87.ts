/**
 * 2021 BECE Integrated Science
 * Paper 2: Practical & Theory Essay Examination (Set 87 Variant)
 *
 * Structure:
 * - Section A (Compulsory Practical Test, 40 marks): Q1 (a, b, c, d)
 * - Section B (Theory Essays, 15 marks each, Answer any 4 of 5): Q2, Q3, Q4, Q5, Q6
 * Total Marks: 100 | Time Allowed: 1 hour 15 minutes (75 mins)
 *
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
 */

import { CurriculumQuestionSet } from '../global-curriculum-types';

const svgQ1aElevatedBall = `<div class="my-4 flex justify-center"><svg viewBox='0 0 360 220' width='100%' height='200' style='max-width: 450px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='30' y1='55' x2='180' y2='55' stroke='#94a3b8' stroke-width='4'/><line x1='180' y1='55' x2='180' y2='190' stroke='#94a3b8' stroke-width='4'/><line x1='180' y1='190' x2='330' y2='190' stroke='#64748b' stroke-width='4'/><text x='95' y='45' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>First Floor Level</text><text x='260' y='205' font-size='11' font-weight='bold' fill='#94a3b8' text-anchor='middle'>Ground Surface</text><circle cx='165' cy='38' r='16' fill='#0284c7' stroke='#38bdf8' stroke-width='2'/><text x='165' y='42' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>m = 5 kg</text><line x1='110' y1='38' x2='140' y2='38' stroke='#f59e0b' stroke-width='2.5'/><polygon points='136,34 145,38 136,42' fill='#f59e0b'/><text x='125' y='28' font-size='9' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Push</text><path d='M 185 45 Q 215 55 215 180' fill='none' stroke='#ef4444' stroke-width='2' stroke-dasharray='4,3'/><polygon points='210,175 215,185 220,175' fill='#ef4444'/><line x1='245' y1='55' x2='245' y2='190' stroke='#38bdf8' stroke-width='1.5'/><line x1='238' y1='55' x2='252' y2='55' stroke='#38bdf8' stroke-width='1.5'/><line x1='238' y1='190' x2='252' y2='190' stroke='#38bdf8' stroke-width='1.5'/><text x='255' y='125' font-size='12' font-weight='bold' fill='#38bdf8'>h = 20 m</text></svg></div>`;
const svgQ1bTeethAnatomy = `<div class="my-4 flex justify-center"><svg viewBox='0 0 360 220' width='100%' height='200' style='max-width: 450px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(50, 20)'><path d='M 20 20 L 70 20 L 65 80 L 25 80 Z' fill='#f8fafc' stroke='#cbd5e1' stroke-width='2'/><line x1='23' y1='80' x2='67' y2='80' stroke='#f43f5e' stroke-width='2'/><path d='M 25 80 L 40 160 L 50 160 L 65 80 Z' fill='#fed7aa' stroke='#ea580c' stroke-width='1.8'/><text x='45' y='185' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Tooth A</text></g><g transform='translate(200, 20)'><path d='M 45 10 L 75 45 L 68 80 L 22 80 L 15 45 Z' fill='#f8fafc' stroke='#cbd5e1' stroke-width='2'/><circle cx='45' cy='10' r='2' fill='#ef4444'/><line x1='20' y1='80' x2='70' y2='80' stroke='#f43f5e' stroke-width='2'/><path d='M 22 80 L 40 170 L 50 170 L 68 80 Z' fill='#fed7aa' stroke='#ea580c' stroke-width='1.8'/><text x='45' y='185' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Tooth B</text></g><g transform='translate(135, 20)'><line x1='5' y1='20' x2='5' y2='75' stroke='#38bdf8' stroke-width='1.5'/><text x='12' y='50' font-size='11' font-weight='bold' fill='#38bdf8'>I</text><line x1='0' y1='80' x2='25' y2='80' stroke='#f43f5e' stroke-width='1.5'/><text x='28' y='83' font-size='10' font-weight='bold' fill='#f43f5e'>II</text><line x1='5' y1='85' x2='5' y2='165' stroke='#fb923c' stroke-width='1.5'/><text x='12' y='130' font-size='11' font-weight='bold' fill='#fb923c'>III</text></g></svg></div>`;
const svgQ1dPhaseChanges = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><rect x='20' y='65' width='80' height='50' rx='6' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/><text x='60' y='90' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>ICE</text><text x='60' y='104' font-size='9' fill='#94a3b8' text-anchor='middle'>(Solid State)</text><rect x='150' y='65' width='80' height='50' rx='6' fill='#1e293b' stroke='#10b981' stroke-width='2'/><text x='190' y='90' font-size='12' font-weight='bold' fill='#10b981' text-anchor='middle'>WATER</text><text x='190' y='104' font-size='9' fill='#94a3b8' text-anchor='middle'>(Liquid State)</text><rect x='280' y='65' width='80' height='50' rx='6' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><text x='320' y='90' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>STEAM</text><text x='320' y='104' font-size='9' fill='#94a3b8' text-anchor='middle'>(Gaseous State)</text><line x1='102' y1='75' x2='146' y2='75' stroke='#ef4444' stroke-width='2'/><polygon points='142,71 148,75 142,79' fill='#ef4444'/><text x='125' y='68' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>I</text><line x1='232' y1='75' x2='276' y2='75' stroke='#ef4444' stroke-width='2'/><polygon points='272,71 278,75 272,79' fill='#ef4444'/><text x='255' y='68' font-size='10' font-weight='bold' fill='#ef4444' text-anchor='middle'>II</text><line x1='276' y1='105' x2='232' y2='105' stroke='#38bdf8' stroke-width='2'/><polygon points='236,101 230,105 236,109' fill='#38bdf8'/><text x='255' y='125' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text><line x1='146' y1='105' x2='102' y2='105' stroke='#38bdf8' stroke-width='2'/><polygon points='106,101 100,105 106,109' fill='#38bdf8'/><text x='125' y='125' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>IV</text><text x='190' y='160' font-size='9' font-weight='bold' fill='#94a3b8' text-anchor='middle'>INTER-CONVERSION OF STATES OF MATTER</text></svg></div>`;
const svgQ4cForwardBiasedDiode = `<div class="my-4 flex justify-center"><svg viewBox='0 0 340 160' width='100%' height='145' style='max-width: 430px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='40' y1='40' x2='120' y2='40' stroke='#94a3b8' stroke-width='2'/><line x1='120' y1='25' x2='120' y2='55' stroke='#10b981' stroke-width='3'/><text x='112' y='22' font-size='11' font-weight='bold' fill='#10b981'>+</text><line x1='130' y1='32' x2='130' y2='48' stroke='#ef4444' stroke-width='4'/><text x='136' y='22' font-size='11' font-weight='bold' fill='#ef4444'>-</text><line x1='130' y1='40' x2='300' y2='40' stroke='#94a3b8' stroke-width='2'/><line x1='300' y1='40' x2='300' y2='120' stroke='#94a3b8' stroke-width='2'/><line x1='300' y1='120' x2='230' y2='120' stroke='#94a3b8' stroke-width='2'/><rect x='170' y='110' width='50' height='20' rx='2' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><text x='195' y='124' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>R</text><line x1='170' y1='120' x2='130' y2='120' stroke='#94a3b8' stroke-width='2'/><polygon points='95,110 120,120 95,130' fill='#38bdf8' stroke='#0284c7'/><line x1='120' y1='108' x2='120' y2='132' stroke='#38bdf8' stroke-width='3'/><text x='92' y='145' font-size='10' font-weight='bold' fill='#10b981'>P (Anode)</text><text x='125' y='145' font-size='10' font-weight='bold' fill='#ef4444'>N (Cathode)</text><line x1='95' y1='120' x2='40' y2='120' stroke='#94a3b8' stroke-width='2'/><line x1='40' y1='120' x2='40' y2='40' stroke='#94a3b8' stroke-width='2'/></svg></div>`;

export const SET_BECE_2021_SCIENCE_P2: CurriculumQuestionSet = {
  id: "paper_2021_variant_p2",
  title: "2021 BECE Integrated Science Practical & Theory Examination (Set 87)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2021 BECE Practical & Theory Essay Test",
  variantType: "past_paper_variant",
  year: 2021,
  paperType: 2,
  setNumber: 87,
  era: "2021 BECE Standards",
  totalQuestions: 6,
  version: 1,
  format: "structured_essay",
  questions: [
    {
      id: "q01",
      title: "Question 1: Compulsory Practical Science Laboratory Examination",
      totalMarks: 40,
      points: 40,
      format: "structured_essay",
      prompt: "This question is compulsory. Answer all parts (a), (b), (c), and (d).",
      workedSolution: "See complete step-by-step scoring rubrics and solutions below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 10,
          diagramSvg: svgQ1aElevatedBall,
          prompt: `The diagram below illustrates a bowling ball of mass $m = 5.0\\text{ kg}$ resting on the edge of the first-floor balcony of a building at a vertical height $h = 20.0\\text{ m}$ above the ground. The ball is nudged gently and falls freely under gravity to the ground below:

${svgQ1aElevatedBall}

(i) Name the specific form of mechanical energy possessed by the ball while stationary on the first floor.

(ii) State the name of the downward gravitational force acting on the ball as it accelerates toward the ground.

(iii) Calculate the magnitude of the potential energy possessed by the ball on the first floor. [Take acceleration due to gravity, $g = 10\\text{ m s}^{-2}$].

(iv) State the continuous energy transformation taking place as the ball falls from the balcony toward the ground.

(v) Applying the law of conservation of mechanical energy, calculate the velocity of the ball just before it strikes the ground.

(vi) Name two fundamental or contact forces in nature other than the gravitational force identified in (a)(ii).`,
          hint: "PE = mgh at top; all PE becomes KE = 0.5 * m * v^2 at impact, so v = sqrt(2gh).",
          modelAnswer: `(i) Form of mechanical energy [1 mark]:
Gravitational Potential Energy (P.E.).

(ii) Name of downward force [1 mark]:
Gravitational force (or weight of the ball, $W = mg$).

(iii) Potential energy calculation [2 marks]:
Formula:
$$\\text{P.E.} = mgh$$
Substitute the given parameters ($m = 5.0\\text{ kg}$, $g = 10\\text{ m s}^{-2}$, $h = 20.0\\text{ m}$):
$$\\text{P.E.} = 5.0 \\times 10 \\times 20.0 = 1,000\\text{ J}$$
Answer: $1,000\\text{ Joules (J)}$.

(iv) Energy transformation during free-fall [2 marks]:
Gravitational Potential Energy is continuously converted into Kinetic Energy ($P.E. \\to K.E.$).

(v) Velocity calculation [2 marks]:
By the Law of Conservation of Energy, loss in $P.E.$ equals gain in $K.E.$:
$$mgh = \\frac{1}{2}mv^2 \\implies v = \\sqrt{2gh}$$
Substitute values ($g = 10\\text{ m s}^{-2}$, $h = 20.0\\text{ m}$):
$$v = \\sqrt{2 \\times 10 \\times 20} = \\sqrt{400} = 20\\text{ m s}^{-1}$$
Answer: $20\\text{ m s}^{-1}$.

(vi) Other types of force [2 marks, any 2]:
1. Frictional force
2. Electrostatic force
3. Magnetic force
4. Upthrust (buoyant force)
5. Tension / Centripetal force`,
          workedSolution: "1 mark for PE, 1 mark for gravity/weight, 2 marks for PE calculation (1000 J), 2 marks for energy conversion, 2 marks for velocity (20 m/s), 2 marks for naming two other forces."
        },
        {
          partLabel: "(b)",
          marks: 10,
          diagramSvg: svgQ1bTeethAnatomy,
          prompt: `The diagrams below illustrate two distinct types of mammalian teeth found in the human dentition:

${svgQ1bTeethAnatomy}

(i) Name the specific type of tooth represented by:
  (α) Tooth A;
  (β) Tooth B.

(ii) Identify each of the three morphological regions labelled I, II, and III.

(iii) State two observable structural differences between Tooth A and Tooth B.

(iv) State the primary functional role performed by each tooth during the mechanical breakdown of food:
  (α) Tooth A;
  (β) Tooth B.

(v) State two oral hygiene practices recommended to maintain healthy teeth and gums.`,
          hint: "Tooth A has a flat chisel shape for cutting; Tooth B has a pointed cusp for tearing.",
          modelAnswer: `(i) Name of teeth [2 marks]:
• (α) Tooth A: Incisor
• (β) Tooth B: Canine

(ii) Morphological regions [3 marks]:
• I: Crown (the visible enamel-covered portion above the gum line)
• II: Neck (the narrow transitional zone at the gum margin)
• III: Root (the region embedded firmly within the alveolar jawbone socket)

(iii) Structural differences [2 marks]:
1. Crown shape: Tooth A has a flat, broad, horizontal chisel-like cutting edge, whereas Tooth B has a single, sharp, pointed conical cusp.
2. Root morphology: Tooth B possesses a longer, more robust single root compared to the relatively shorter root of Tooth A.

(iv) Functions [2 marks]:
• (α) Tooth A (Incisor): Biting, cutting, and shearing off pieces of food.
• (β) Tooth B (Canine): Piercing, gripping, and tearing tough, fibrous food materials (such as meat).

(v) Oral care practices [1 mark, any 2]:
1. Brushing teeth thoroughly twice daily with a fluoride toothpaste using a soft-bristled brush.
2. Daily flossing to remove plaque and food particles trapped between teeth.
3. Reducing the intake of refined sugary sweets, sodas, and sticky carbohydrates.
4. Regular clinical visits to a dentist for prophylactic cleanings and cavity checks.`,
          workedSolution: "2 marks for identifying incisor and canine, 3 marks for crown, neck, root, 2 marks for structural differences, 2 marks for biting/tearing functions, 1 mark for oral hygiene practices."
        },
        {
          partLabel: "(c)",
          marks: 10,
          prompt: `The following names correspond to common horticultural vegetable crops cultivated in Ghana:
**Tomato, Carrot, Onion, Sweet Pepper, Cabbage, and Garden Egg.**

(i) Classify each of the vegetables into:
  (α) Fruit vegetables;
  (β) Leafy vegetables;
  (γ) Root and bulb vegetables.

(ii) Name the specific planting material (seed, bulb, or cutting) used for propagating:
  (α) Onion;
  (β) Tomato.

(iii) State the primary edible botanical portion consumed by humans for:
  (α) Carrot;
  (β) Cabbage.

(iv) State two field cultural practices routinely carried out during the cultivation of tomato plants to:
  (α) prevent fungal fruit rot and support weak stems;
  (β) encourage the development of larger, premium fruits.`,
          hint: "Fruit vegetables develop from flowers and bear seeds; cultural practices include staking and pruning.",
          modelAnswer: `(i) Classification of vegetables [3 marks]:
• (α) Fruit vegetables: Tomato, Sweet Pepper, Garden Egg.
• (β) Leafy vegetables: Cabbage.
• (γ) Root and bulb vegetables: Carrot (taproot) and Onion (bulb).

(ii) Propagating materials [2 marks]:
• (α) Onion: Sets (small bulbs) or true botanical seeds.
• (β) Tomato: Viable true seeds (raised in nursery beds).

(iii) Edible botanical portions [2 marks]:
• (α) Carrot: Modified swollen taproot.
• (β) Cabbage: Enlarged, compact vegetative foliage bud (leaves).

(iv) Cultural practices on tomato [3 marks]:
• (α) To prevent fruit rot and support weak stems: Staking (tying stems to sturdy wooden or bamboo poles) and mulching.
• (β) To increase fruit size: Pruning / pinching out (selectively removing lateral auxiliary shoots and thinning excessive flower clusters).`,
          workedSolution: "3 marks for vegetable categories, 2 marks for planting materials, 2 marks for edible portions, 3 marks for staking and pruning justifications."
        },
        {
          partLabel: "(d)",
          marks: 10,
          diagramSvg: svgQ1dPhaseChanges,
          prompt: `The diagram below illustrates the physical inter-conversion of water through its three distinct states of matter:

${svgQ1dPhaseChanges}

(i) State the precise physical phase change taking place at each of the stages labelled I, II, III, and IV.

(ii) Identify the two stages in which thermal heat energy is absorbed by the water molecules (endothermic process).

(iii) Identify the two stages in which thermal heat energy is released to the surrounding environment (exothermic process).

(iv) What happens to the measured temperature of the water during:
  (α) Stage I (while ice is actively melting);
  (β) Stage IV (while water is actively freezing)?

(v) Describe the spatial arrangement and movement of water molecules in solid ice.`,
          hint: "Melting and boiling absorb heat; condensing and freezing release heat. Temperature stays constant during change of state.",
          modelAnswer: `(i) Physical phase changes [4 marks]:
• Stage I: Melting (or Fusion) [Solid $\\to$ Liquid]
• Stage II: Boiling (or Evaporation / Vaporization) [Liquid $\\to$ Gas]
• Stage III: Condensation (or Liquefaction) [Gas $\\to$ Liquid]
• Stage IV: Freezing (or Solidification) [Liquid $\\to$ Solid]

(ii) Stages where heat is added (absorbed) [1 mark]:
Stage I (Melting) and Stage II (Boiling) [absorbs latent heat of fusion and vaporization].

(iii) Stages where heat is removed (released) [1 mark]:
Stage III (Condensation) and Stage IV (Freezing) [releases latent heat].

(iv) Temperature behavior [2 marks]:
• (α) Stage I: Temperature remains strictly constant at $0^\\circ\\text{C}$ until all ice has melted completely.
• (β) Stage IV: Temperature remains strictly constant at $0^\\circ\\text{C}$ until all liquid has solidified.

(v) Molecular arrangement in ice [2 marks]:
Water molecules are arranged in a rigid, ordered, hexagonal open crystal lattice held by fixed intermolecular hydrogen bonds. The particles cannot move from place to place and vibrate only in fixed positions.`,
          workedSolution: "4 marks for naming phase transitions I-IV, 1 mark for endothermic stages, 1 mark for exothermic stages, 2 marks for constant 0°C temperature, 2 marks for crystal lattice description."
        }
      ]
    },

    // ==========================================
    // SECTION B: THEORY & ESSAY QUESTIONS (ANSWER ANY 4)
    // ==========================================
    {
      id: "q02",
      title: "Question 2: Climate Elements, Complete Flower Morphology, Crop Thinning & Chemical Change",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for climate elements, 5 marks for flower whorls & function, 3 marks for thinning out & pruning, 3 marks for chemical change & polar solvent.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "List four atmospheric physical elements that collectively define the climate of a geographic region.",
          hint: "Think about weather variables measured over a 30-year period: temperature, rainfall, pressure, humidity, wind.",
          modelAnswer: `Four climate elements [1 mark each, any 4]:
1. Atmospheric Temperature
2. Rainfall / Precipitation
3. Atmospheric Pressure
4. Relative Humidity
5. Wind velocity (speed and direction)
6. Solar sunshine duration and light intensity`,
          workedSolution: "1 mark each for any 4 valid atmospheric elements of climate."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "(i) Name the four primary floral whorls that constitute a complete angiosperm flower.\n\n(ii) State the reproductive function of one of the whorls named in (b)(i).",
          hint: "The four concentric whorls are calyx, corolla, stamens (androecium), and carpels (gynoecium).",
          modelAnswer: `(i) Four floral parts (whorls) [1 mark each = 4 marks]:
1. Calyx (consisting of sepals)
2. Corolla (consisting of petals)
3. Androecium (the male stamens: anther and filament)
4. Gynoecium / Pistil (the female carpels: stigma, style, and ovary)

(ii) Functional role [1 mark]:
• Corolla (Petals): Brightly coloured and scented to attract insect pollinators like bees for cross-pollination.
• Androecium (Stamens): Synthesizes and disperses pollen grains containing male gametes.
• Gynoecium (Carpel): Receives pollen on the sticky stigma, facilitates fertilization, and matures into seed-bearing fruit.
• Calyx (Sepals): Protects the delicate inner floral bud prior to opening.`,
          workedSolution: "4 marks for naming 4 floral whorls, 1 mark for accurate functional role."
        },
        {
          partLabel: "(c)",
          marks: 3,
          prompt: "(i) Explain briefly the agronomic meaning of the term thinning out in vegetable crop husbandry.\n\n(ii) State one practical reason why selective pruning of lateral shoots is important in crop production.",
          hint: "Thinning removes excess seedlings to reduce competition; pruning redirects nutrients to fruits.",
          modelAnswer: `(i) Thinning out [2 marks]:
The selective manual removal of weak, overcrowded, or malformed excess seedlings from a seedbed or planting station to achieve recommended spacing and eliminate inter-plant competition for light, water, and soil nutrients.

(ii) Importance of pruning [1 mark]:
Improves air circulation and sunlight penetration through the crop canopy (reducing fungal blight diseases) and redirects photosynthetic nutrients away from vegetative leaves toward the development of larger, higher-yielding fruits.`,
          workedSolution: "2 marks for thinning out definition, 1 mark for pruning benefit."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "(i) What is a chemical change?\n\n(ii) Name one universal polar solvent capable of dissolving crystalline cane sugar.",
          hint: "A chemical change forms entirely new substances; water is the universal polar solvent.",
          modelAnswer: `(i) Chemical change [2 marks]:
A chemical reaction in which chemical bonds are broken and formed, resulting in the production of one or more entirely new substances with different chemical compositions and properties, which is permanent and irreversible by physical means.

(ii) Solvent for sugar [1 mark]:
Water ($\\text{H}_2\\text{O}$).`,
          workedSolution: "2 marks for chemical change definition, 1 mark for water."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Farming Systems, Tyre Friction, Vegetative Organs & Calcium Electron Shells",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 5 marks for farming systems & determinants, 3 marks for tyre friction & hydroplaning, 4 marks for vegetative propagation & organs, 3 marks for calcium Bohr configuration.",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "(i) State two recognized farming systems practiced in West African agriculture.\n\n(ii) State three physical, environmental, or socio-economic factors that account for differences in farming systems across different geographic regions.",
          hint: "Farming systems include crop rotation, mixed farming, bush fallowing; factors include climate, soils, capital.",
          modelAnswer: `(i) Farming systems [2 marks, any 2]:
Crop rotation, Mixed farming, Land rotation (bush fallowing), Mixed cropping, or Organic farming.

(ii) Factors determining farming systems [1 mark each = 3 marks]:
1. Climatic factors: Annual rainfall distribution, ambient temperature, and length of the vegetative growing season.
2. Soil characteristics: Soil fertility, drainage capacity, topography, and erosion susceptibility.
3. Land availability and population density: High population pressure limits land fallowing and necessitates intensive continuous cropping.
4. Capital, technology, and market access: Availability of mechanical tractors, irrigation infrastructure, and commercial market demand.`,
          workedSolution: "2 marks for two farming systems, 3 marks for three regional determinants."
        },
        {
          partLabel: "(b)",
          marks: 3,
          prompt: "Using scientific principles of friction and road safety, explain briefly why motor vehicles should never be operated with smooth, worn-out tyres.",
          hint: "Worn treads cannot expel water, causing hydroplaning, loss of frictional grip, and skidding.",
          modelAnswer: `Scientific explanation [3 marks]:
Tyre treads are designed with deep grooves to channel away rainwater and maintain direct contact between tyre rubber and the asphalt road. 
Worn-out, smooth tyres lack tread depth and cannot displace water, creating a thin film of liquid between the tyre and the road (hydroplaning). This drastically reduces the coefficient of friction, resulting in loss of traction, longer braking distances, and severe skidding that can lead to fatal road collisions.`,
          workedSolution: "1 mark for tread water expulsion role, 1 mark for hydroplaning/reduced friction, 1 mark for loss of traction and skidding risk."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "(i) What is vegetative propagation in plant reproduction?\n\n(ii) Name the specific vegetative organ used to propagate each of the following crop plants:\n  (α) Bulb onion;\n  (β) Cocoyam.",
          hint: "Asexual reproduction using specialized vegetative organs; onions use bulbs, cocoyam uses corms.",
          modelAnswer: `(i) Vegetative propagation [2 marks]:
An asexual form of plant reproduction in which a new independent plant develops from a specialized vegetative structure (stem, root, leaf, or bud) of the parent plant without the fusion of gametes or production of seeds.

(ii) Vegetative organs [1 mark each = 2 marks]:
• (α) Bulb onion: Bulb (swollen underground shoot with fleshy scale leaves).
• (β) Cocoyam: Corm (or cormels / underground swollen stem base).`,
          workedSolution: "2 marks for vegetative propagation definition, 1 mark for onion bulb, 1 mark for cocoyam corm."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "A neutral atom of calcium has an atomic number of 20 ($Ca = 20$). State its electronic configuration across Bohr energy shells and describe its distribution.",
          hint: "Bohr shell sequence: 2 in K, 8 in L, 8 in M, 2 in N.",
          modelAnswer: `Configuration [2 marks]:
Atomic number $Z = 20 \\implies 20\\text{ electrons}$.
Filling energy shells in sequence:
• Shell 1 (K): 2 electrons
• Shell 2 (L): 8 electrons
• Shell 3 (M): 8 electrons
• Shell 4 (N): 2 valence electrons
Configuration: $$2, 8, 8, 2$$

Description [1 mark]:
The innermost shell contains 2 electrons, the second shell contains 8 electrons, the third shell contains 8 electrons, and the outermost valence shell contains 2 electrons.`,
          workedSolution: "2 marks for electron configuration 2, 8, 8, 2; 1 mark for shell description."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Iron Corrosion, Dietary Vitamins, Forward-Biased Diode & Machine Classification",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 2 marks for corrosion & CaCl2, 4 marks for vitamins & deficiencies, 5 marks for forward-biased diode operation & diagram, 4 marks for simple vs. compound machines.",
      parts: [
        {
          partLabel: "(a)",
          marks: 2,
          prompt: "In a laboratory investigation into the conditions required for the corrosion of iron nails, one sealed test tube contained anhydrous calcium chloride:\n(i) State the chemical role played by the anhydrous calcium chloride granules.\n(ii) State one essential environmental condition necessary for the rusting of iron.",
          hint: "Anhydrous calcium chloride absorbs water; rusting requires both moisture and oxygen.",
          modelAnswer: `(i) Role of anhydrous calcium chloride [1 mark]:
Acts as a drying agent (desiccant) that absorbs all water vapour and moisture from the air within the tube, maintaining a completely dry air environment.

(ii) Condition necessary for rusting [1 mark]:
The presence of oxygen gas (air) or the presence of moisture (liquid water). *(Both must be present simultaneously for rusting to occur).*`,
          workedSolution: "1 mark for desiccant role, 1 mark for moisture/oxygen condition."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "(i) What are dietary vitamins in animal nutrition?\n\n(ii) Name the specific nutritional deficiency disease associated with a prolonged lack of:\n  (α) Vitamin A;\n  (β) Vitamin D.",
          hint: "Vitamins are organic micronutrients; Vitamin A deficiency causes night blindness; Vitamin D causes rickets.",
          modelAnswer: `(i) Definition of vitamins [2 marks]:
Essential organic micronutrients required by the body in minute quantities to catalyze metabolic biochemical reactions, maintain physiological health, and boost immune defense, which cannot be synthesized in adequate quantities by the organism.

(ii) Deficiency diseases [1 mark each = 2 marks]:
• (α) Vitamin A (Retinol): Night blindness (Nyctalopia) / Xerophthalmia.
• (β) Vitamin D (Calciferol): Rickets in growing children (or Osteomalacia in adults).`,
          workedSolution: "2 marks for vitamin definition, 1 mark for night blindness, 1 mark for rickets."
        },
        {
          partLabel: "(c)",
          marks: 5,
          diagramSvg: svgQ4cForwardBiasedDiode,
          prompt: `With the aid of a circuit diagram, explain briefly the term forward bias as applied to a semiconductor p-n junction diode:

${svgQ4cForwardBiasedDiode}`,
          hint: "Forward bias: Positive terminal connected to p-type (anode) and negative terminal connected to n-type (cathode).",
          modelAnswer: `Explanation [2 marks]:
Forward bias occurs when an external direct current (DC) power source is connected such that its positive terminal is linked to the p-type semiconductor material (anode) and its negative terminal is linked to the n-type semiconductor material (cathode) of the diode.

Operation [3 marks]:
The external positive potential repels positive holes in the p-region toward the junction, while the negative terminal repels electrons in the n-region toward the junction. This opposes and collapses the internal depletion layer, reducing junction resistance and permitting electric current to flow freely through the circuit.`,
          workedSolution: "2 marks for circuit connection definition, 3 marks for depletion layer reduction and current conduction mechanics."
        },
        {
          partLabel: "(d)",
          marks: 4,
          prompt: "Give two examples each of:\n(i) Elementary simple machines;\n(ii) Compound (complex) machines.",
          hint: "Simple machines: lever, pulley, wheel and axle; compound machines: bicycle, tractor, sewing machine.",
          modelAnswer: `(i) Simple machines [2 marks, any 2]:
1. Crowbar (or lever)
2. Wheel and axle
3. Single fixed pulley
4. Inclined plane (ramp)
5. Screw / Wedge

(ii) Compound (complex) machines [2 marks, any 2]:
1. Bicycle
2. Motor vehicle (car or tractor)
3. Sewing machine
4. Wheelbarrow (incorporates both a lever and a wheel-and-axle)
5. Electric lawnmower`,
          workedSolution: "2 marks for two simple machines, 2 marks for two compound machines."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Seed Germination, Agronomic Weeding, Ionization & Mechanical Levers",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for germination conditions, 3 marks for weeding benefits, 3 marks for atomic ionization, 5 marks for lever classifications.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "State three environmental conditions essential for the germination of viable crop seeds.",
          hint: "Water activates enzymes; oxygen powers respiration; suitable temperature enables enzyme kinetics.",
          modelAnswer: `Essential conditions [4 marks]:
1. Water (moisture) [1.5 marks]: Softens the protective seed coat, hydrates protoplasm, and activates dormant metabolic digestive enzymes.
2. Oxygen (air) [1.5 marks]: Drives aerobic cellular respiration in the embryo cells to generate ATP energy for seedling growth.
3. Suitable temperature (warmth) [1 mark]: Provides the optimum thermal kinetic energy required for enzymatic reactions (typically between $20^\\circ\\text{C}$ and $35^\\circ\\text{C}$).`,
          workedSolution: "4 marks for naming and explaining moisture, oxygen, and suitable warmth."
        },
        {
          partLabel: "(b)",
          marks: 3,
          prompt: "State three agronomic benefits of regular field weeding in a vegetable crop farm.",
          hint: "Weeding stops nutrient/water competition, eliminates pest hosts, and improves aeration.",
          modelAnswer: `Agronomic benefits of weeding [1 mark each, any 3 = 3 marks]:
1. Eliminates fierce weed competition for soil mineral nutrients, capillary moisture, and sunlight.
2. Destroys alternative secondary host plants that shelter destructive insect vectors and fungal pathogens.
3. Facilitates unrestricted air circulation through the crop rows and eases harvesting operations.
4. Prevents weed root exudates from inhibiting crop growth.`,
          workedSolution: "1 mark each for any 3 valid weeding agronomic benefits."
        },
        {
          partLabel: "(c)",
          marks: 3,
          prompt: "Describe briefly how chemical ions are formed from neutral parent atoms during chemical bonding.",
          hint: "Metals lose valence electrons to form cations (+); non-metals gain electrons to form anions (-).",
          modelAnswer: `Mechanism of ion formation [3 marks]:
Ions are formed when neutral atoms lose or gain valence electrons to achieve a stable electronic configuration (duplet or octet):
• Cations (positive ions): Metallic atoms with 1, 2, or 3 valence electrons lose their outer electrons; because positive nuclear protons now outnumber orbiting electrons, they acquire a net positive charge (e.g., $\\text{Na} \\to \\text{Na}^+ + e^-$).
• Anions (negative ions): Non-metallic atoms with 5, 6, or 7 valence electrons gain extra electrons into their outer shell; because negative electrons now outnumber positive protons, they acquire a net negative charge (e.g., $\\text{Cl} + e^- \\to \\text{Cl}^-$).`,
          workedSolution: "1.5 marks for cation formation via electron loss, 1.5 marks for anion formation via electron gain."
        },
        {
          partLabel: "(d)",
          marks: 5,
          prompt: "The following mechanical implements are commonly used in laboratories and households:\n**A. Kitchen knife, B. Nutcracker, C. Yard broom, D. Pair of scissors.**\n(i) What general mechanical classification is shared by all four tools?\n(ii) State the specific lever class (Class 1, Class 2, or Class 3) to which each tool belongs.",
          hint: "Scissors: pivot in middle (Class 1); Nutcracker: load in middle (Class 2); Broom & knife: effort in middle (Class 3).",
          modelAnswer: `(i) General classification [1 mark]:
Simple machines (specifically, mechanical levers).

(ii) Lever classes [1 mark each = 4 marks]:
• Tool A (Kitchen knife): Class 3 lever (when cutting by pressing, effort is applied between the handle pivot and the blade tip; or wedge).
• Tool B (Nutcracker): Class 2 lever (the nut/load rests in the middle between the hinged pivot and the hand handles).
• Tool C (Yard broom): Class 3 lever (the upper hand acts as the pivot, the lower hand applies effort in the middle, and the brush head sweeps the load at the base).
• Tool D (Pair of scissors): Class 1 lever (the central screw pivot is situated between the finger handle effort and the blade cutting load).`,
          workedSolution: "1 mark for identifying levers/simple machines, 4 marks for classifying each tool accurately."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Electric Current, Fruit Tree Pruning, Phase Transitions & Cellular Metabolism",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for electric current & units, 4 marks for tree pruning & capillary water, 4 marks for 4 phase transitions, 3 marks for photosynthesis vs. respiration table.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) Define electric current in physical science.\n\n(ii) Name the scientific instrument used to measure electric current.\n\n(iii) State the S.I. unit of electric current.",
          hint: "Current is rate of charge flow: I = Q/t. Measured by an ammeter in Amperes.",
          modelAnswer: `(i) Definition of electric current [2 marks]:
The rate of flow of electric charge (electrons) through a cross-section of a conductor per unit time ($I = \\frac{Q}{t}$).

(ii) Measuring instrument [1 mark]:
An Ammeter.

(iii) S.I. Unit [1 mark]:
The Ampere (symbol: A).`,
          workedSolution: "2 marks for current definition, 1 mark for ammeter, 1 mark for Ampere."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "(i) State two reasons why selective pruning of shoots is beneficial to fruit trees.\n\n(ii) State one vital physiological role played by capillary soil water in plant growth.",
          hint: "Pruning removes diseased wood and opens canopy; capillary water dissolves and translocates nutrients.",
          modelAnswer: `(i) Benefits of pruning [2 marks]:
• Removes dead, broken, or diseased branches, preventing the spread of wood-decay fungi.
• Opens up the inner canopy to sunlight, improving fruit color and photosynthetic efficiency.
• Balances vegetative growth with fruit production, preventing branch breakage under heavy crop loads.

(ii) Role of capillary soil water [2 marks]:
Dissolves essential mineral nutrient ions (nitrates, phosphates, potassium) so they can be absorbed by root hairs and translocated through the xylem stream.`,
          workedSolution: "2 marks for two pruning benefits, 2 marks for nutrient dissolution and transport role of capillary water."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "List four physical processes by which matter transforms from one physical state into another.",
          hint: "Transitions between solid, liquid, and gas: melting, boiling, condensation, freezing, sublimation.",
          modelAnswer: `Four phase transitions [1 mark each, any 4]:
1. Melting / Fusion (Solid $\\to$ Liquid)
2. Boiling / Vaporization / Evaporation (Liquid $\\to$ Gas)
3. Condensation / Liquefaction (Gas $\\to$ Liquid)
4. Freezing / Solidification (Liquid $\\to$ Solid)
5. Sublimation (Solid $\\to$ Gas directly)
6. Deposition (Gas $\\to$ Solid directly)`,
          workedSolution: "1 mark each for any 4 valid phase change processes."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "In a tabular format, state three distinct biological and chemical differences between the processes of photosynthesis and aerobic cellular respiration.",
          hint: "Compare site of occurrence, energy transformation, reactants, and products.",
          modelAnswer: `Differences Table [3 marks]:

| Feature | Photosynthesis | Aerobic Cellular Respiration |
| :--- | :--- | :--- |
| **Primary Occurrence** | Occurs exclusively in green cells containing chlorophyll | Occurs in all living active cells of plants and animals |
| **Energy Transformation** | Endothermic reaction: traps light energy and stores it as chemical energy | Exothermic reaction: breaks down chemical food to release usable ATP energy |
| **Raw Materials (Reactants)** | Consumes Carbon (IV) oxide ($CO_2$) and water ($H_2O$) | Consumes glucose ($\\text{C}_6\\text{H}_{12}\\text{O}_6$) and oxygen ($O_2$) |
| **By-products (Outputs)** | Releases oxygen ($O_2$) and glucose | Releases Carbon (IV) oxide ($CO_2$) and water ($H_2O$) |
| **Organelle Site** | Takes place within chloroplasts | Takes place within mitochondria and cytoplasm |`,
          workedSolution: "1 mark each for 3 distinct, accurate comparisons formatted in a table."
        }
      ]
    }
  ]
};
