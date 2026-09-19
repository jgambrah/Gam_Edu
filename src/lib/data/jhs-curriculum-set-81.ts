/**
 * 2017 BECE Integrated Science
 * Paper 2: Practical & Theory Essay Examination (Set 81 Variant)
 *
 * Structure:
 * - Section A (Compulsory Practical Test, 40 marks): Q1 (a, b, c, d)
 * - Section B (Theory Essays, 15 marks each, Answer 4 of 5): Q2, Q3, Q4, Q5, Q6
 * Total Marks: 100 | Time Allowed: 1 hour 15 minutes (75 mins)
 *
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
 */

import { CurriculumQuestionSet } from '../global-curriculum-types';

const svgQ1aCanineTooth = `<div class="my-4 flex justify-center"><svg viewBox='0 0 340 240' width='100%' height='220' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><path d='M 140 25 Q 170 10 200 25 L 205 95 L 135 95 Z' fill='#f8fafc' stroke='#cbd5e1' stroke-width='2'/><line x1='195' y1='40' x2='260' y2='40' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='265' y='44' font-size='12' font-weight='bold' fill='#f8fafc'>I</text><path d='M 145 45 Q 170 30 195 45 L 198 160 L 142 160 Z' fill='#fed7aa' stroke='#f97316' stroke-width='1.5'/><line x1='190' y1='75' x2='260' y2='75' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='265' y='79' font-size='12' font-weight='bold' fill='#fb923c'>II</text><path d='M 160 70 Q 170 60 180 70 L 175 175 L 165 175 Z' fill='#ef4444' stroke='#b91c1c' stroke-width='1.5'/><circle cx='170' cy='85' r='4' fill='#fef08a'/><line x1='160' y1='85' x2='60' y2='85' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='89' font-size='12' font-weight='bold' fill='#ef4444' text-anchor='end'>V</text><path d='M 110 95 Q 135 90 135 105 L 135 125' fill='none' stroke='#f43f5e' stroke-width='3'/><path d='M 230 95 Q 205 90 205 105 L 205 125' fill='none' stroke='#f43f5e' stroke-width='3'/><text x='95' y='115' font-size='10' font-weight='bold' fill='#f43f5e'>Gum</text><path d='M 135 105 L 140 195 L 145 195 L 140 105 Z' fill='#38bdf8' opacity='0.7'/><path d='M 205 105 L 200 195 L 195 195 L 200 105 Z' fill='#38bdf8' opacity='0.7'/><line x1='138' y1='145' x2='60' y2='145' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='149' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='end'>III</text><line x1='205' y1='165' x2='260' y2='165' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='265' y='169' font-size='12' font-weight='bold' fill='#cbd5e1'>IV</text><rect x='115' y='130' width='20' height='75' fill='#334155' opacity='0.5'/><rect x='205' y='130' width='20' height='75' fill='#334155' opacity='0.5'/></svg></div>`;
const svgQ1bRefractionInterface = `<div class="my-4 flex justify-center"><svg viewBox='0 0 360 210' width='100%' height='190' style='max-width: 460px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><rect x='40' y='105' width='280' height='90' fill='#0284c7' opacity='0.25'/><line x1='30' y1='105' x2='330' y2='105' stroke='#38bdf8' stroke-width='2'/><text x='45' y='95' font-size='11' font-weight='bold' fill='#38bdf8'>Air (Less Dense)</text><text x='45' y='125' font-size='11' font-weight='bold' fill='#0284c7'>Water (Denser)</text><line x1='180' y1='25' x2='180' y2='185' stroke='#94a3b8' stroke-width='1.5' stroke-dasharray='4,3'/><text x='185' y='35' font-size='12' font-weight='bold' fill='#94a3b8'>I</text><line x1='80' y1='30' x2='180' y2='105' stroke='#ef4444' stroke-width='2.5'/><polygon points='125,62 133,65 131,57' fill='#ef4444'/><text x='95' y='45' font-size='12' font-weight='bold' fill='#ef4444'>II</text><path d='M 180 80 A 25 25 0 0 0 155 86' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='148' y='75' font-size='12' font-weight='bold' fill='#f59e0b'>III</text><path d='M 180 135 A 30 30 0 0 0 196 128' fill='none' stroke='#10b981' stroke-width='1.5'/><text x='192' y='145' font-size='12' font-weight='bold' fill='#10b981'>IV</text><line x1='180' y1='105' x2='235' y2='185' stroke='#10b981' stroke-width='2.5'/><polygon points='208,143 216,149 214,141' fill='#10b981'/><text x='245' y='175' font-size='12' font-weight='bold' fill='#10b981'>V</text></svg></div>`;
const svgQ1cFiltrationApparatus = `<div class="my-4 flex justify-center"><svg viewBox='0 0 340 220' width='100%' height='200' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='60' y1='195' x2='120' y2='195' stroke='#cbd5e1' stroke-width='4'/><line x1='90' y1='195' x2='90' y2='25' stroke='#cbd5e1' stroke-width='3.5'/><line x1='90' y1='80' x2='155' y2='80' stroke='#cbd5e1' stroke-width='2'/><text x='45' y='40' font-size='12' font-weight='bold' fill='#cbd5e1'>I</text><polygon points='120,60 210,60 170,110 160,110' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/><rect x='162' y='110' width='6' height='35' fill='#38bdf8' opacity='0.5'/><line x1='210' y1='75' x2='265' y2='75' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='270' y='79' font-size='12' font-weight='bold' fill='#38bdf8'>III</text><polygon points='126,62 204,62 165,108' fill='#78350f' opacity='0.8' stroke='#f59e0b' stroke-width='1.5'/><line x1='135' y1='70' x2='45' y2='70' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='40' y='74' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='end'>II</text><rect x='135' y='135' width='60' height='60' rx='3' fill='#0284c7' opacity='0.15' stroke='#64748b' stroke-width='1.5'/><rect x='136' y='165' width='58' height='29' fill='#38bdf8' opacity='0.4'/><circle cx='165' cy='152' r='2' fill='#38bdf8'/><line x1='195' y1='175' x2='265' y2='175' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='270' y='179' font-size='11' font-weight='bold' fill='#38bdf8'>Filtrate</text></svg></div>`;
const svgQ1dSlopedFarmland = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><polygon points='30,40 350,140 350,165 30,165' fill='#334155' stroke='#64748b' stroke-width='2'/><line x1='30' y1='40' x2='350' y2='140' stroke='#10b981' stroke-width='3.5'/><line x1='60' y1='30' x2='220' y2='80' stroke='#ef4444' stroke-width='2.5'/><polygon points='215,73 228,82 220,88' fill='#ef4444'/><text x='140' y='45' font-size='11' font-weight='bold' fill='#ef4444' transform='rotate(17 140 45)'>Slope Gradient / Water Runoff</text><g transform='translate(80, 50)'><path d='M 0 0 Q -4 -10 0 -15 Q 4 -10 0 0' fill='#22c55e'/></g><g transform='translate(140, 70)'><path d='M 0 0 Q -4 -10 0 -15 Q 4 -10 0 0' fill='#22c55e'/></g><g transform='translate(200, 90)'><path d='M 0 0 Q -4 -10 0 -15 Q 4 -10 0 0' fill='#22c55e'/></g><g transform='translate(260, 110)'><path d='M 0 0 Q -4 -10 0 -15 Q 4 -10 0 0' fill='#22c55e'/></g><path d='M 100 65 Q 160 95 240 125' fill='none' stroke='#38bdf8' stroke-width='1.5' stroke-dasharray='4,3'/><text x='190' y='165' font-size='9' font-weight='bold' fill='#94a3b8' text-anchor='middle'>FARMLAND LOCATED ON GENTLE HILL SLOPE</text></svg></div>`;

export const SET_BECE_2017_SCIENCE_P2: CurriculumQuestionSet = {
  id: "paper_2017_variant_p2",
  title: "2017 BECE Integrated Science Practical & Theory Examination (Set 81)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2017 BECE Practical & Theory Essay Test",
  variantType: "past_paper_variant",
  year: 2017,
  paperType: 2,
  setNumber: 81,
  era: "2017 BECE Standards",
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
          diagramSvg: svgQ1aCanineTooth,
          prompt: `The diagram below is a longitudinal section of a canine tooth in humans. Study the anatomical diagram carefully and answer the questions that follow:

${svgQ1aCanineTooth}

(i) Name each of the anatomical structures labelled I, II, III, IV, and V.

(ii) State one physiological function for each of the parts labelled I and III.

(iii) Which of the labelled anatomical parts is the living core containing blood vessels and nerve fibers that becomes exposed during advanced tooth decay?

(iv) State three hygienic habits or preventive measures that should be adopted to prevent tooth and gum decay.`,
          hint: "Identify the outer hard crown, the intermediate dentine, the anchoring cementum, the bony socket, and the vascular pulp core.",
          modelAnswer: `(i) Anatomical structures [5 marks]:
• I: Enamel (or Crown)
• II: Dentine
• III: Cementum (or Periodontal membrane / ligament)
• IV: Jawbone socket (or Root)
• V: Pulp cavity

(ii) Physiological functions [2 marks]:
• Part I (Enamel): Provides a hard, mineralized outer protective shield capable of withstanding biting/tearing forces and protects inner sensitive tissues from bacterial invasion.
• Part III (Cementum / Periodontal membrane): Firmly anchors the root of the tooth into the jawbone socket and absorbs mechanical shock during mastication.

(iii) Living core affected by decay [1 mark]:
Part V (Pulp cavity), which contains blood capillaries and sensory nerve endings.

(iv) Preventative dental hygiene practices [2 marks, any 3]:
1. Brushing teeth thoroughly twice daily with a fluoride toothpaste (after breakfast and before bedtime).
2. Daily flossing to eliminate food particles and dental plaque from interdental crevices.
3. Limiting intake of sugary snacks, confectionery, and acidic carbonated soft drinks.
4. Visiting a dental practitioner for routine checkups and scaling every 6 months.`,
          workedSolution: "5 marks for anatomical labels, 2 marks for functions, 1 mark for pulp cavity, 2 marks for dental hygiene practices."
        },
        {
          partLabel: "(b)",
          marks: 10,
          diagramSvg: svgQ1bRefractionInterface,
          prompt: `The diagram below illustrates an optical phenomenon that occurs when a ray of light transitions obliquely across a planar boundary between air and water:

${svgQ1bRefractionInterface}

(i) What specific physical phenomenon does the optical diagram illustrate?

(ii) Identify each of the lines, rays, and angles labelled I, II, III, IV, and V.

(iii) Using the wave behaviour of light, explain why a straight wooden ruler or fish swimming at the bottom of a pond appears closer to the surface than its true depth.`,
          hint: "Light bends toward the normal when entering a denser medium and bends away when exiting into air.",
          modelAnswer: `(i) Optical phenomenon [1 mark]:
Refraction of light (bending of light at an optical boundary).

(ii) Identification [5 marks]:
• I: Normal line (perpendicular to interface at point of incidence)
• II: Incident ray (in air)
• III: Angle of incidence ($i$ or $\\theta_1$)
• IV: Angle of refraction ($r$ or $\\theta_2$)
• V: Refracted ray (in water)

(iii) Explanation of apparent depth [4 marks]:
Light rays reflecting from an submerged object at the bottom travel through water (optically denser medium) into air (optically less dense medium). As the rays emerge into air, their speed increases, causing them to bend away from the normal. When these diverging rays enter the viewer's eye, the brain traces them backwards along straight lines, producing a virtual image located higher than the actual position.`,
          workedSolution: "1 mark for phenomenon, 5 marks for parts I-V, 4 marks for scientific explanation of apparent depth."
        },
        {
          partLabel: "(c)",
          marks: 10,
          diagramSvg: svgQ1cFiltrationApparatus,
          prompt: `The diagram below shows a standard laboratory apparatus setup assembled to separate the constituents of muddy water:

${svgQ1cFiltrationApparatus}

(i) Name each of the apparatus components labelled I, II, and III.

(ii) State the physical function performed by the part labelled II in this separation process.

(iii) Name the clear liquid substance collected in the beaker as the filtrate.

(iv) State three physical properties of pure water obtained from this filtrate after subsequent distillation.

(v) Name two alternative porous everyday materials that could be used in place of part II in rural field conditions.`,
          hint: "Identify the stand, the porous filter paper cone, the funnel, and the resulting clarified water.",
          modelAnswer: `(i) Name of components [3 marks]:
• I: Retort stand (with clamp)
• II: Filter paper (folded into cone)
• III: Filter funnel

(ii) Function of Part II (Filter paper) [2 marks]:
Acts as a semi-permeable porous barrier that retains insoluble solid suspended clay and sand particles (residue) while allowing liquid water molecules to pass through.

(iii) Name of filtrate [1 mark]:
Water (clarified water).

(iv) Physical properties of pure water [2 marks, any 3]:
1. Density of $1.0\\text{ g cm}^{-3}$ ($1000\\text{ kg m}^{-3}$) at $4^\\circ\\text{C}$.
2. Normal boiling point of $100^\\circ\\text{C}$ at standard atmospheric pressure ($1\\text{ atm}$).
3. Freezing point of $0^\\circ\\text{C}$.
4. Clear, colourless, odourless, and tasteless liquid with neutral $pH = 7.0$.

(v) Alternative field filtration materials [2 marks]:
1. Clean cotton cloth / linen fabric.
2. Clean cotton wool.
3. Clean fine sand and charcoal bed (bio-sand filter).`,
          workedSolution: "3 marks for apparatus, 2 marks for filter function, 1 mark for filtrate name, 2 marks for water properties, 2 marks for field substitutes."
        },
        {
          partLabel: "(d)",
          marks: 10,
          diagramSvg: svgQ1dSlopedFarmland,
          prompt: `The diagram below illustrates a cultivated crop field located on a sloping hillside:

${svgQ1dSlopedFarmland}

(i) What destructive physical process is most likely to take place on this farmland during a heavy, torrential rainstorm?

(ii) State two unsustainable farming practices that exacerbate or accelerate the process identified in (d)(i).

(iii) List four soil conservation practices that a farmer should adopt on this field to arrest and control the process mentioned in (d)(i).

(iv) Mention three vital soil components or agricultural resources that are washed away and lost from the field during heavy surface runoff.`,
          hint: "Runoff moving downhill strips topsoil, carrying away mineral nutrients and organic humus.",
          modelAnswer: `(i) Destructive physical process [1 mark]:
Soil erosion (specifically water erosion / sheet and rill erosion).

(ii) Unsustainable farming practices [2 marks, any 2]:
• Deforestation and clear-felling trees on slopes.
• Slash-and-burn clearing that leaves the soil bare.
• Ploughing up and down the slope (parallel to gradient) rather than across contours.
• Overgrazing by livestock, removing vegetative ground cover.

(iii) Soil conservation practices [4 marks, any 4]:
1. Contour ploughing: Tilling across the hill slope to form ridges that trap water.
2. Terracing: Carving stepped horizontal terraces on steep slopes to slow runoff velocity.
3. Cover cropping: Planting trailing legumes (e.g., mucuna, cowpea) to shield bare soil.
4. Constructing stone bunds or diversion drains across the slope.
5. Strip cropping and heavy organic mulching.

(iv) Depleted soil resources [3 marks, any 3]:
1. Fertile topsoil (sand, silt, and clay mineral fractions).
2. Humus and decomposing organic matter.
3. Soluble plant nutrients (nitrogen, phosphorus, potassium).
4. Beneficial soil organisms (earthworms, nitrifying bacteria).`,
          workedSolution: "1 mark for process, 2 marks for destructive practices, 4 marks for conservation measures, 3 marks for lost resources."
        }
      ]
    },

    // ==========================================
    // SECTION B: THEORY & ESSAY QUESTIONS (ANSWER 4 ONLY)
    // ==========================================
    {
      id: "q02",
      title: "Question 2: Atomic Ionization, Farming Systems & Diode Electronics",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for atomic ionization, 4 marks for farming systems, 4 marks for seed dispersal, 3 marks for diode forward bias.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "An atom of an element Y has an atomic number of 12. In order to achieve a stable electronic configuration, it loses two electrons.\n\n(i) State the proton number of atom Y before it loses electrons.\n\n(ii) State the total number of electrons in atom Y:\n  (α) before it loses electrons;\n  (β) after losing two electrons.\n\n(iii) Name the specific type of electrical ion formed by atom Y.",
          hint: "Atomic number equals proton count; losing negative electrons leaves a net positive charge.",
          modelAnswer: `(i) Proton number [1 mark]:
Proton number $= 12$.

(ii) Electron counts [2 marks]:
• (α) Before losing electrons: 12 electrons (neutral atom).
• (β) After losing two electrons: $12 - 2 = 10\\text{ electrons}$.

(iii) Type of ion formed [1 mark]:
Cation (a positively charged ion: $\\text{Y}^{2+}$, specifically a magnesium cation $\\text{Mg}^{2+}$).`,
          workedSolution: "1 mark for proton number, 2 marks for electron counts, 1 mark for cation identification."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "Name four recognized farming systems practiced in commercial crop and livestock production in Ghana.",
          hint: "Think of rotational, mixed, or land-clearing agronomic systems.",
          modelAnswer: `Four recognized farming systems [1 mark each, any 4]:
1. Crop rotation system
2. Mixed farming system (crops + livestock)
3. Mixed cropping system (intercropping)
4. Land rotation / Bush fallowing system
5. Monoculture / Plantation agriculture
6. Organic farming system`,
          workedSolution: "1 mark each for naming 4 valid farming systems."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "(i) What is meant by the term seed dispersal in botany?\n\n(ii) State two morphological adaptations characteristic of seeds and fruits dispersed by wind currents.",
          hint: "Consider lightweight structures, feathery parachutes, and wing-like expansions.",
          modelAnswer: `(i) Definition of seed dispersal [2 marks]:
The natural process or mechanism by which seeds or fruits are transported away from the parent plant to distant locations to minimize overcrowding and intra-specific competition.

(ii) Adaptations for wind dispersal (anemochory) [2 marks, any 2]:
• Minute, dry, and extremely lightweight seeds (e.g., orchids).
• Presence of feathery tufts of hair (pappus) forming natural parachutes (e.g., *Tridax*, cotton).
• Presence of flat, papery wing-like extensions (e.g., mahogany, *Combretum*).`,
          workedSolution: "2 marks for botanical definition, 2 marks for 2 valid wind adaptations."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "Explain what is meant by the forward bias of a semiconductor p-n junction diode, describing its effect on electric current flow.",
          hint: "Positive battery terminal connected to p-type and negative to n-type.",
          modelAnswer: `Forward bias explanation [3 marks]:
Forward bias occurs when an external DC voltage is applied across a p-n junction diode such that the positive terminal connects to the p-type region and the negative terminal connects to the n-type region.
This external electric potential opposes the internal barrier potential, narrowing the depletion layer and allowing majority charge carriers to cross the junction, permitting electric current to flow freely through the diode.`,
          workedSolution: "3 marks for correct polarity linkage, depletion layer effect, and current flow explanation."
        }
      ]
    },

    {
      id: "q03",
      title: "Question 3: Acids & Bases, Pressure Physics & Cellular Organization",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for acid/base properties, 5 marks for pressure physics, 4 marks for unicellular/multicellular biology, 2 marks for soil aeration.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) Define an acid according to the Arrhenius theory.\n\n(ii) In a tabular format, state two distinct physical differences between a dilute acid and an alkaline base in terms of taste and tactile feel.",
          hint: "Acids produce hydrogen ions in water; recall taste and texture differences.",
          modelAnswer: `(i) Definition of acid [2 marks]:
An Arrhenius acid is any chemical compound that dissociates in aqueous solution to yield hydrogen ions ($H^+$ or hydronium ions, $H_3O^+$) as the only positive ions.

(ii) Differences Table [2 marks]:

| Criterion | Acid | Base / Alkali |
| :--- | :--- | :--- |
| **Taste** | Sharp, sour taste | Bitter taste |
| **Tactile Feel** | Stinging, watery feel | Slippery, soapy feel |`,
          workedSolution: "2 marks for chemical definition, 2 marks for accurate contrast table."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "(i) Define the physical quantity pressure.\n\n(ii) A concrete foundation block exerts a normal downward force of $200\\text{ N}$ distributed uniformly over a surface area of $50\\text{ m}^2$. Calculate the pressure exerted on the ground in S.I. units.",
          hint: "$$P = \\frac{F}{A}$$; divide 200 by 50.",
          modelAnswer: `(i) Definition of pressure [2 marks]:
The perpendicular (normal) force exerted per unit surface area ($P = \\frac{F}{A}$).

(ii) Calculation [3 marks]:
$$\\text{Pressure } (P) = \\frac{\\text{Force } (F)}{\\text{Area } (A)}$$
Substitute values:
$$P = \\frac{200\\text{ N}}{50\\text{ m}^2} = 4\\text{ N m}^{-2}\\quad (\\text{or } 4\\text{ Pa})$$
Answer: $$4\\text{ Pascals (Pa)}$$.`,
          workedSolution: "2 marks for definition, 1 mark for formula, 1 mark for substitution, 1 mark for final value with unit."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Explain the following biological terms as applied to living organisms, giving one valid example of each:\n\n(i) Unicellular organism;\n\n(ii) Multicellular organism.",
          hint: "Single-celled vs. multiple specialized cells.",
          modelAnswer: `(i) Unicellular organism [2 marks]:
An organism whose entire anatomical body is composed of a single solitary cell that carries out all metabolic and reproductive functions.
Example: *Amoeba*, *Paramecium*, *Euglena*, or Bacterium.

(ii) Multicellular organism [2 marks]:
An organism composed of numerous specialized cells organized into tissues, organs, and organ systems.
Example: Domestic fowl, human, maize plant, onion.`,
          workedSolution: "1 mark definition + 1 mark example for each category."
        },
        {
          partLabel: "(d)",
          marks: 2,
          prompt: "State two reasons why the presence of air in soil pores is essential for agricultural crop production.",
          hint: "Root cellular respiration and aerobic microbial decomposition.",
          modelAnswer: `Importance of soil air [1 mark each, any 2]:
1. Provides oxygen gas required by plant roots for aerobic cellular respiration to drive active nutrient uptake.
2. Supplies oxygen to aerobic nitrifying bacteria and decomposers that convert organic matter into plant-available nitrates.
3. Prevents anaerobic conditions that produce phytotoxic reduced compounds (e.g., hydrogen sulfide).`,
          workedSolution: "1 mark each for two valid physiological/biological reasons."
        }
      ]
    },

    {
      id: "q04",
      title: "Question 4: Machine Efficiency, Cellular Energetics & Neutralization Reactions",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 5 marks for simple machines, 4 marks for chloroplast & respiration, 4 marks for litmus & neutralization, 2 marks for vegetable nutrition.",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "(i) Explain the terms work input and work output as applied to mechanical simple machines.\n\n(ii) State one physical factor that inevitably limits the work output of any real simple machine, keeping its efficiency below 100%.",
          hint: "Work input = effort × distance; work output = load × distance; friction causes energy dissipation.",
          modelAnswer: `(i) Definitions [4 marks]:
• Work Input: The total work or mechanical energy supplied to the machine by the applied effort force ($W_{\\text{in}} = E \\times d_E$).
• Work Output: The useful work performed directly by the machine in raising or overcoming the load ($W_{\\text{out}} = L \\times d_L$).

(ii) Limiting physical factor [1 mark]:
Frictional resistance between moving mechanical contact parts (and the gravitational weight of the moving parts themselves), which converts some input work into wasted thermal heat.`,
          workedSolution: "2 marks per definition, 1 mark for friction / machine weight explanation."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "(i) What is a chloroplast?\n\n(ii) State two biochemical differences between aerobic respiration and anaerobic respiration.",
          hint: "Organelle containing chlorophyll; compare oxygen requirement, ATP yield, and end-products.",
          modelAnswer: `(i) Definition of chloroplast [2 marks]:
A specialized double-membrane cytoplasmic organelle present in green plant cells containing chlorophyll, within which photosynthesis occurs.

(ii) Differences between aerobic and anaerobic respiration [2 marks, any 2]:
1. Oxygen requirement: Aerobic respiration requires molecular oxygen; anaerobic respiration proceeds in the absence of oxygen.
2. Energy output: Aerobic respiration completely oxidizes glucose to yield large amounts of ATP; anaerobic respiration yields very little ATP.
3. End-products: Aerobic respiration produces $CO_2$ and $H_2O$; anaerobic respiration yields lactic acid (in humans) or ethanol and $CO_2$ (in yeast).`,
          workedSolution: "2 marks for chloroplast definition, 2 marks for 2 valid biochemical distinctions."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "(i) State the colour change observed when moist blue litmus paper is dipped into: (α) Dilute vinegar; (β) Wood ash solution.\n\n(ii) Name the two chemical products formed when hydrochloric acid undergoes neutralization with sodium hydroxide.",
          hint: "Vinegar is acidic; wood ash is alkaline. Acid + Base → Salt + Water.",
          modelAnswer: `(i) Litmus colour changes [2 marks]:
• (α) Vinegar: Turns red (acidic ethanoic acid solution).
• (β) Wood ash solution: Remains blue (alkaline solution containing potassium carbonate).

(ii) Neutralization products [2 marks]:
Sodium chloride ($\\text{NaCl}$) and Water ($\\text{H}_2\\text{O}$).
$$\\text{HCl} + \\text{NaOH} \\to \\text{NaCl} + \\text{H}_2\\text{O}$$`,
          workedSolution: "1 mark each for litmus reactions, 1 mark each for salt and water names."
        },
        {
          partLabel: "(d)",
          marks: 2,
          prompt: "List two nutritional or physiological benefits of including leafy and fruity vegetables in the human diet.",
          hint: "Think of vitamins, minerals, and dietary fiber.",
          modelAnswer: `Two dietary benefits [1 mark each, any 2]:
1. Provides essential vitamins (Vitamins A, C, K) and mineral salts (calcium, iron) that bolster the immune system and prevent deficiency disorders.
2. Supplies dietary fibre (roughage) that adds bulk to digestive chyme, promotes healthy peristalsis, and prevents constipation.`,
          workedSolution: "1 mark each for two valid nutritional benefits."
        }
      ]
    },

    {
      id: "q05",
      title: "Question 5: Animal Digestion, Applied Chemistry & Scientific Methodology",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for digestion vs egestion, 3 marks for chemical compounds, 4 marks for soil profiles, 4 marks for scientific method & applied sciences.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) Differentiate between digestion and egestion in animal nutrition.\n\n(ii) Name three absorbable end-products resulting from the complete digestion of human food.",
          hint: "Chemical breakdown vs. expulsion of undigested waste; glucose, amino acids, fatty acids.",
          modelAnswer: `(i) Differentiation [2 marks]:
• Digestion: The biochemical and mechanical breakdown of large, complex, insoluble food molecules into small, simple, soluble molecules that can be absorbed across the intestinal wall into the bloodstream.
• Egestion: The physiological elimination or discharge of undigested and unabsorbed food residues (feces) from the body through the anus.

(ii) Absorbable end-products [2 marks, any 3]:
1. Glucose (and simple monosaccharides from carbohydrates).
2. Amino acids (from proteins).
3. Fatty acids and Glycerol (from dietary fats and oils).`,
          workedSolution: "2 marks for differentiation, 2 marks for naming 3 correct end-products."
        },
        {
          partLabel: "(b)",
          marks: 3,
          prompt: "Give one specific example of a chemical compound routinely utilized in:\n\n(i) Clinical medicine;\n\n(ii) Agriculture;\n\n(iii) Manufacturing industry.",
          hint: "Think of pharmaceuticals, fertilizers/pesticides, and industrial reagents.",
          modelAnswer: `Examples of chemical compounds [1 mark each]:
(i) Clinical medicine: Paracetamol (or acetylsalicylic acid / sodium chloride IV saline / magnesium hydroxide antacid).
(ii) Agriculture: Ammonium nitrate [$\\text{NH}_4\\text{NO}_3$] (or urea [$\\text{CO(NH}_2\\text{)}_2$] / copper(II) sulfate fungicide).
(iii) Manufacturing industry: Sulfuric acid [$\\text{H}_2\\text{SO}_4$] (or sodium hydroxide [$\\text{NaOH}$] / ethanol [$\\text{C}_2\\text{H}_5\\text{OH}$]).`,
          workedSolution: "1 mark per correct chemical compound."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "(i) Define the term soil profile.\n\n(ii) State two ways in which understanding the soil profile of an area assists a farmer in crop husbandry.",
          hint: "Vertical cross-section showing horizons A, B, C; helps determine topsoil depth and drainage.",
          modelAnswer: `(i) Definition of soil profile [2 marks]:
The vertical cross-section of the soil extending from the surface down to the underlying parent rock, displaying distinct horizontal layers called horizons.

(ii) Importance to crop husbandry [2 marks, any 2]:
1. Determines the depth of the fertile topsoil (Horizon A) to guide crop selection (shallow vs. deep-rooted crops).
2. Detects impermeable subsurface clay or iron hardpans that impede root penetration and drainage.
3. Assesses subsoil moisture-holding capacity and aeration within the root zone.`,
          workedSolution: "2 marks for definition, 2 marks for 2 agronomic applications."
        },
        {
          partLabel: "(d)",
          marks: 4,
          prompt: "(i) State two sequential steps followed by scientists in scientific investigations.\n\n(ii) Give two academic disciplines classified as applied sciences.",
          hint: "Observation, hypothesis, experiment, data analysis; engineering, medicine, agriculture.",
          modelAnswer: `(i) Steps in scientific method [2 marks, any 2 in sequence]:
1. Making keen observations and identifying a scientific problem.
2. Formulating a testable hypothesis.
3. Designing and conducting controlled experiments.
4. Collecting and analyzing empirical data to draw conclusions.

(ii) Applied sciences [2 marks, any 2]:
Medicine, Agricultural Science, Civil / Mechanical Engineering, Pharmacy, Computer Technology.`,
          workedSolution: "2 marks for scientific method steps, 2 marks for applied science disciplines."
        }
      ]
    },

    {
      id: "q06",
      title: "Question 6: Alloy Metallurgy, Planetary Astronomy & Blood Circulation",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for alloys & corrosion, 4 marks for planetary astronomy, 4 marks for circulatory physiology, 3 marks for crop rotation & pest control.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) What is an alloy?\n\n(ii) State two environmental conditions that cause the atmospheric corrosion (rusting) of ferrous metals.",
          hint: "Homogeneous mixture of metals; oxygen and water/moisture.",
          modelAnswer: `(i) Definition of alloy [2 marks]:
A homogeneous solid solution or uniform metallic mixture consisting of two or more metals, or a metal combined with a non-metal, fused together to improve mechanical strength, durability, or corrosion resistance.

(ii) Environmental conditions causing rusting [2 marks]:
1. Presence of oxygen gas ($O_2$ in atmospheric air).
2. Presence of liquid water or moisture (humidity).
*(Salts and acidic pollutants accelerate the electrochemical process).*`,
          workedSolution: "2 marks for alloy definition, 2 marks for oxygen and moisture."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "(i) What is an astronomical planet?\n\n(ii) Name the two inner planets whose orbits lie between the Sun and planet Earth.",
          hint: "Celestial body orbiting a star; Mercury and Venus.",
          modelAnswer: `(i) Definition of planet [2 marks]:
A major celestial body that orbits a central star (such as the Sun), has sufficient mass for its self-gravity to achieve a nearly spherical shape, and has cleared its orbital path of debris.

(ii) Inner planets between Sun and Earth [2 marks]:
Mercury and Venus.`,
          workedSolution: "2 marks for planet definition, 1 mark each for Mercury and Venus."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "State four physiological functions of the blood circulatory system in the human body.",
          hint: "Gas exchange, nutrient delivery, waste removal, immune defense, thermoregulation.",
          modelAnswer: `Four functions of the circulatory system [1 mark each, any 4]:
1. Respiratory gas transport: Transports oxygen from lungs to body tissues and carbon dioxide from tissues back to lungs.
2. Nutrient transport: Distributes digested glucose, amino acids, vitamins, and minerals to systemic cells.
3. Waste excretion: Transports metabolic wastes (urea, excess salts) to the kidneys for filtration and excretion.
4. Immunity and defense: Circulates white blood cells and antibodies to engulf pathogens and neutralize toxins.
5. Thermoregulation: Regulates body core temperature by redistributing metabolic heat through cutaneous vasodilation and vasoconstriction.
6. Hemostasis: Blood platelets and clotting proteins seal wounds to prevent fatal blood loss.`,
          workedSolution: "1 mark each for 4 valid physiological functions."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "(i) Define the term crop rotation.\n\n(ii) Give one example of a chemical method used to control insect pests on a vegetable farm.",
          hint: "Cyclical planting of different crop families on divided plots; synthetic pesticide/insecticide spraying.",
          modelAnswer: `(i) Definition of crop rotation [2 marks]:
The agronomic practice of growing different crop species from distinct plant families on the same parcel of farmland in a planned, recurrent cyclical sequence across multiple growing seasons.

(ii) Chemical pest control method [1 mark]:
Applying calibrated synthetic chemical insecticides (e.g., pyrethroids or organophosphates) to crop foliage using a knapsack sprayer.`,
          workedSolution: "2 marks for crop rotation definition, 1 mark for chemical pest control example."
        }
      ]
    }
  ]
};
