/**
 * 2018 BECE Integrated Science
 * Paper 2: Practical & Theory Essay Examination (Set 85 Variant)
 *
 * Structure:
 * - Section A (Compulsory Practical Test, 40 marks): Q1 (a, b, c, d)
 * - Section B (Theory Essays, 15 marks each, Answer any 4 of 5): Q2, Q3, Q4, Q5, Q6
 * Total Marks: 100 | Time Allowed: 1 hour 15 minutes (75 mins)
 *
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
 */

import { CurriculumQuestionSet } from '../global-curriculum-types';

const svgQ1aBonyFish = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><path d='M 60 110 C 90 40 250 40 300 110 C 250 180 90 180 60 110 Z' fill='#0284c7' opacity='0.3' stroke='#38bdf8' stroke-width='2'/><path d='M 300 110 L 350 65 C 335 110 335 110 350 155 Z' fill='#0284c7' opacity='0.5' stroke='#38bdf8' stroke-width='1.8'/><path d='M 130 54 Q 190 20 250 54 Z' fill='#0284c7' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/><path d='M 190 166 Q 230 185 260 166 Z' fill='#0284c7' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/><path d='M 60 110 L 50 106 L 62 115' fill='none' stroke='#cbd5e1' stroke-width='2'/><line x1='50' y1='106' x2='20' y2='80' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='15' y='75' font-size='11' font-weight='bold' fill='#cbd5e1'>I</text><circle cx='85' cy='95' r='8' fill='#ffffff' stroke='#0f172a' stroke-width='1.5'/><circle cx='85' cy='95' r='4' fill='#0f172a'/><line x1='85' y1='87' x2='85' y2='35' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='85' y='28' font-size='11' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>VI</text><path d='M 115 80 C 130 95 130 125 115 140' fill='none' stroke='#f59e0b' stroke-width='2.5'/><line x1='125' y1='130' x2='125' y2='195' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='125' y='208' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>II</text><path d='M 135 115 Q 165 110 170 135 Q 145 135 135 115 Z' fill='#38bdf8' opacity='0.7' stroke='#cbd5e1' stroke-width='1.5'/><line x1='155' y1='130' x2='180' y2='195' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='185' y='208' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>III</text><path d='M 170 85 Q 178 80 186 85 M 180 92 Q 188 87 196 92 M 172 100 Q 180 95 188 100' fill='none' stroke='#94a3b8' stroke-width='1.5'/><line x1='186' y1='85' x2='220' y2='35' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='225' y='30' font-size='11' font-weight='bold' fill='#cbd5e1'>IV</text><line x1='125' y1='110' x2='295' y2='110' stroke='#ef4444' stroke-width='1.8' stroke-dasharray='4,3'/><line x1='230' y1='110' x2='265' y2='135' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='270' y='145' font-size='11' font-weight='bold' fill='#ef4444'>V</text></svg></div>`;
const svgQ1bSoilProfile = `<div class="my-4 flex justify-center"><svg viewBox='0 0 320 260' width='100%' height='240' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><rect x='40' y='20' width='160' height='210' fill='none' stroke='#64748b' stroke-width='2'/><rect x='41' y='21' width='158' height='45' fill='#451a03' opacity='0.9'/><path d='M 50 20 L 55 10 L 60 20 M 75 20 L 80 8 L 85 20 M 110 20 L 115 10 L 120 20 M 150 20 L 155 8 L 160 20' stroke='#22c55e' stroke-width='2'/><line x1='205' y1='43' x2='240' y2='43' stroke='#94a3b8' stroke-width='1.5'/><text x='245' y='47' font-size='11' font-weight='bold' fill='#f59e0b'>I</text><rect x='41' y='66' width='158' height='65' fill='#9a3412' opacity='0.75'/><circle cx='70' cy='95' r='5' fill='#78350f'/><circle cx='130' cy='85' r='7' fill='#78350f'/><circle cx='165' cy='110' r='6' fill='#78350f'/><line x1='205' y1='98' x2='240' y2='98' stroke='#94a3b8' stroke-width='1.5'/><text x='245' y='102' font-size='11' font-weight='bold' fill='#fb923c'>II</text><rect x='41' y='131' width='158' height='50' fill='#475569' opacity='0.8'/><polygon points='55,145 75,138 85,155 60,165' fill='#334155' stroke='#94a3b8'/><polygon points='105,140 135,135 145,155 115,160' fill='#334155' stroke='#94a3b8'/><polygon points='155,142 185,146 175,165 150,158' fill='#334155' stroke='#94a3b8'/><line x1='205' y1='156' x2='240' y2='156' stroke='#94a3b8' stroke-width='1.5'/><text x='245' y='160' font-size='11' font-weight='bold' fill='#cbd5e1'>III</text><rect x='41' y='181' width='158' height='48' fill='#1e293b' stroke='#475569'/><line x1='41' y1='195' x2='199' y2='195' stroke='#334155' stroke-width='2'/><line x1='41' y1='210' x2='199' y2='210' stroke='#334155' stroke-width='2'/><line x1='205' y1='205' x2='240' y2='205' stroke='#94a3b8' stroke-width='1.5'/><text x='245' y='209' font-size='11' font-weight='bold' fill='#94a3b8'>IV</text></svg></div>`;
const svgQ1cCircuitInvestigation = `<div class="my-4 flex justify-center"><svg viewBox='0 0 360 200' width='100%' height='180' style='max-width: 460px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='40' y1='45' x2='95' y2='45' stroke='#94a3b8' stroke-width='2'/><line x1='95' y1='33' x2='95' y2='57' stroke='#38bdf8' stroke-width='2'/><line x1='103' y1='39' x2='103' y2='51' stroke='#38bdf8' stroke-width='3.5'/><text x='99' y='27' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>I</text><line x1='103' y1='45' x2='165' y2='45' stroke='#94a3b8' stroke-width='2'/><circle cx='168' cy='45' r='3' fill='#e2e8f0'/><line x1='168' y1='45' x2='195' y2='33' stroke='#e2e8f0' stroke-width='2'/><circle cx='200' cy='45' r='3' fill='#e2e8f0'/><text x='185' y='27' font-size='10' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>II</text><line x1='200' y1='45' x2='310' y2='45' stroke='#94a3b8' stroke-width='2'/><line x1='310' y1='45' x2='310' y2='80' stroke='#94a3b8' stroke-width='2'/><circle cx='310' cy='100' r='15' fill='#1e293b' stroke='#10b981' stroke-width='2'/><text x='310' y='105' font-size='13' font-weight='bold' fill='#10b981' text-anchor='middle'>A</text><text x='332' y='104' font-size='10' font-weight='bold' fill='#10b981'>III</text><line x1='310' y1='115' x2='310' y2='155' stroke='#94a3b8' stroke-width='2'/><line x1='310' y1='155' x2='255' y2='155' stroke='#94a3b8' stroke-width='2'/><rect x='195' y='145' width='60' height='20' rx='2' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><text x='225' y='159' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>IV</text><line x1='195' y1='155' x2='145' y2='155' stroke='#94a3b8' stroke-width='2'/><rect x='75' y='145' width='70' height='20' rx='2' fill='#1e293b' stroke='#a855f7' stroke-width='2'/><line x1='80' y1='172' x2='140' y2='138' stroke='#a855f7' stroke-width='2'/><polygon points='136,136 145,135 140,144' fill='#a855f7'/><text x='110' y='140' font-size='10' font-weight='bold' fill='#c084fc' text-anchor='middle'>VI</text><line x1='75' y1='155' x2='40' y2='155' stroke='#94a3b8' stroke-width='2'/><line x1='40' y1='155' x2='40' y2='45' stroke='#94a3b8' stroke-width='2'/><path d='M 185 155 L 185 185 L 208 185' fill='none' stroke='#38bdf8' stroke-width='1.5'/><circle cx='225' cy='185' r='14' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/><text x='225' y='190' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>V</text><path d='M 242 185 L 265 185 L 265 155' fill='none' stroke='#38bdf8' stroke-width='1.5'/></svg></div>`;

export const SET_BECE_2018_SCIENCE_P2: CurriculumQuestionSet = {
  id: "paper_2018_variant_p2",
  title: "2018 BECE Integrated Science Practical & Theory Examination (Set 85)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2018 BECE Practical & Theory Essay Test",
  variantType: "past_paper_variant",
  year: 2018,
  paperType: 2,
  setNumber: 85,
  era: "2018 BECE Standards",
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
          diagramSvg: svgQ1aBonyFish,
          prompt: `The diagram below is an illustration of a typical bony fish (Tilapia). Study the anatomical diagram carefully and answer the questions that follow:

${svgQ1aBonyFish}

(i) Identify the common or scientific name of the fish illustrated.

(ii) Name each of the external anatomical parts labelled I, II, IV, and V.

(iii) Name the natural aquatic habitat in which this fish lives.

(iv) Explain how each of the structures labelled III (pectoral fin) and VI (eye) enables the fish to adapt to its aquatic environment.`,
          hint: "Identify the terminal mouth, gill cover, fins, scales, and sensory line.",
          modelAnswer: `(i) Identity of fish [2 marks]:
Tilapia (or Bony fish / Oreochromis niloticus).

(ii) External anatomical parts [1 mark each = 4 marks]:
• I: Mouth (terminal mouth)
• II: Operculum (gill cover)
• IV: Scales (ctenoid / cycloid scales)
• V: Lateral line

(iii) Natural habitat [1 mark]:
Freshwater habitat (rivers, lakes, ponds, lagoons, streams).

(iv) Adaptive features [1.5 marks each = 3 marks]:
• Part III (Pectoral fin): Acts as a paddle for steering, balancing, braking, changing direction, and controlling pitching movements during locomotion in water.
• Part VI (Eye): Lacks eyelids and possesses a round, rigid crystalline lens providing a wide lateral field of view in water; kept moist continuously by the surrounding aquatic medium.`,
          workedSolution: "2 marks for identity, 4 marks for labelling I, II, IV, V, 1 mark for aquatic habitat, 3 marks for adaptive functions of fin and eye."
        },
        {
          partLabel: "(b)",
          marks: 10,
          diagramSvg: svgQ1bSoilProfile,
          prompt: `The diagram below illustrates a vertical cross-section through the soil (soil profile) showing distinct horizontal layers:

${svgQ1bSoilProfile}

(i) What does the complete diagram represent in pedology?

(ii) Name each of the distinct layers (horizons) labelled I, II, III, and IV.

(iii) Which specific layer (I, II, III, or IV) of the soil profile:
  (α) Is the richest in decayed organic matter (humus)?
  (β) Serves as the primary biological habitat for soil-dwelling microorganisms and plant roots?
  (γ) Consists of partially broken rock fragments actively undergoing physical and chemical weathering?

(iv) What is the destructive physical effect of heavy torrential rainfall on the exposed top layer labelled I if left unmanaged?`,
          hint: "The vertical section shows horizons from topsoil down to solid bedrock.",
          modelAnswer: `(i) Representation [1 mark]:
Soil profile (a vertical cross-section of soil from the surface down to the underlying parent bedrock).

(ii) Names of layers (horizons) [1 mark each = 4 marks]:
• I: Topsoil (Horizon A)
• II: Subsoil (Horizon B)
• III: Weathered parent material / rock fragments (Horizon C)
• IV: Unweathered solid bedrock (Horizon D / Horizon R)

(iii) Soil profile zones [1 mark each = 3 marks]:
• (α) Richest in humus: Layer I (Topsoil / Horizon A).
• (β) Primary habitat for soil organisms and roots: Layer I (Topsoil / Horizon A).
• (γ) Undergoing active weathering: Layer III (Parent material / Horizon C).

(iv) Effect of heavy rainfall on Layer I [2 marks]:
Soil erosion (sheet, rill, or splash erosion) and nutrient leaching, which washes away fertile topsoil, organic humus, and dissolved mineral salts.`,
          workedSolution: "1 mark for soil profile definition, 4 marks for layers I to IV, 3 marks for horizon properties, 2 marks for erosion and leaching impact."
        },
        {
          partLabel: "(c)",
          marks: 10,
          diagramSvg: svgQ1cCircuitInvestigation,
          prompt: `The diagram below is an illustration of an electrical circuit assembled to investigate the relationship between potential difference and electric current:

${svgQ1cCircuitInvestigation}

(i) Name each of the circuit components labelled I, II, IV, and VI.

(ii) State the primary energy transformation that takes place in:
  (α) Component I (when supplying current);
  (β) Component IV (when electric current flows through it).

(iii) State the S.I. unit of the electrical quantity measured by each of the instruments labelled:
  (α) III;
  (β) V.

(iv) State the functional role of the component labelled VI in this experimental circuit.`,
          hint: "Recall the symbols for DC cell, key, fixed resistor, rheostat, ammeter, and voltmeter.",
          modelAnswer: `(i) Circuit components [1 mark each = 4 marks]:
• I: Electric cell (or DC battery source)
• II: Switch (or Key)
• IV: Fixed resistor (R)
• VI: Rheostat (variable resistor)

(ii) Energy transformations [1 mark each = 2 marks]:
• (α) In Component I (Cell): Chemical energy is converted into electrical energy.
• (β) In Component IV (Resistor): Electrical energy is converted into heat energy (thermal dissipation).

(iii) S.I. Units [1 mark each = 2 marks]:
• (α) Measured by III (Ammeter): Ampere (A) [measures electric current].
• (β) Measured by V (Voltmeter): Volt (V) [measures potential difference / voltage].

(iv) Function of Part VI (Rheostat) [2 marks]:
To vary the total resistance of the circuit, thereby adjusting and regulating the electric current flowing through the fixed resistor to obtain multiple voltage-current readings.`,
          workedSolution: "4 marks for naming components, 2 marks for energy transformations, 2 marks for SI units, 2 marks for rheostat function."
        },
        {
          partLabel: "(d)",
          marks: 10,
          prompt: `In a chemistry experiment, equal volumes and equal concentrations of dilute hydrochloric acid ($\\text{HCl}$) and dilute sodium hydroxide ($\\text{NaOH}$) solutions were prepared in separate test tubes:

Read the following sequential experimental steps carefully:
  I. Both red and blue litmus papers were dipped into each of the original solutions in turn.
  II. Equal volumes of both solutions were mixed thoroughly together in a third test tube to obtain a resultant mixture.
  III. Both red and blue litmus papers were dipped into this third mixture.

(i) Explain briefly how you would identify each of the starting solutions using the litmus test in Step I:
  (α) Hydrochloric acid;
  (β) Sodium hydroxide.

(ii) State the specific type of chemical reaction that occurred when the two solutions were mixed together in Step II.

(iii) What type of chemical solution was formed in the third test tube following the reaction?

(iv) State the observation made when both red and blue litmus papers were dipped into the third solution in Step III.

(v) Explain briefly how dry solid crystals of the compound formed in the third solution could be recovered.`,
          hint: "Acid turns blue litmus red; alkali turns red litmus blue; neutralization yields neutral salt solution and water.",
          modelAnswer: `(i) Identification of solutions [1 mark each = 2 marks]:
• (α) Hydrochloric acid: Turns blue litmus paper red, while red litmus paper remains unchanged (confirms an acidic solution).
• (β) Sodium hydroxide: Turns red litmus paper blue, while blue litmus paper remains unchanged (confirms a basic/alkaline solution).

(ii) Type of chemical reaction [2 marks]:
Neutralization reaction.
$$\\text{HCl}_{(aq)} + \\text{NaOH}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)}$$

(iii) Type of solution formed [1 mark]:
A neutral salt solution (aqueous sodium chloride, brine).

(iv) Litmus observation on third solution [2 marks]:
Neither litmus paper changes colour: blue litmus paper remains blue and red litmus paper remains red (confirming the solution is neutral with $pH = 7$).

(v) Recovery of solid crystals [3 marks]:
Pour the neutral solution into an evaporating dish and heat gently over a Bunsen flame to evaporate water until saturation point, then allow it to cool and crystallize (or evaporate completely to dryness) to leave white sodium chloride crystals.`,
          workedSolution: "2 marks for litmus identification, 2 marks for neutralization, 1 mark for neutral salt solution, 2 marks for litmus neutrality, 3 marks for evaporation/crystallization procedure."
        }
      ]
    },

    // ==========================================
    // SECTION B: THEORY & ESSAY QUESTIONS (ANSWER ANY 4)
    // ==========================================
    {
      id: "q02",
      title: "Question 2: Ions, Water Softening, Pests vs. Parasites, Mechanical Work & Circulatory Health",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for ion & water softening, 4 marks for crop pests vs. livestock parasites, 4 marks for mechanical work calculation, 3 marks for circulatory disorders.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) What is an ion in chemistry?\n\n(ii) State two physical or chemical methods used to soften hard water.",
          hint: "An ion has gained or lost electrons; hard water can be softened by precipitation, boiling, or ion exchange.",
          modelAnswer: `(i) Definition of ion [2 marks]:
An atom or chemically bonded group of atoms (radical) that carries a net electrical charge as a result of losing or gaining one or more valence electrons.

(ii) Methods of softening hard water [1 mark each, any 2 = 2 marks]:
1. Boiling: Decomposes dissolved calcium and magnesium hydrogencarbonates (for temporary hardness).
2. Addition of washing soda (sodium carbonate, $\\text{Na}_2\\text{CO}_3$): Precipitates dissolved calcium and magnesium ions as insoluble carbonates.
3. Ion exchange (zeolite / permutit process): Replaces $\\text{Ca}^{2+}$ and $\\text{Mg}^{2+}$ ions with soluble $\\text{Na}^+$ ions.
4. Distillation: Evaporates pure water vapor away from dissolved mineral salts.`,
          workedSolution: "2 marks for ion definition, 2 marks for two valid water softening methods."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "(i) Differentiate between a crop pest and a livestock parasite as used in agriculture.\n\n(ii) Give one example each of an agricultural:\n  (α) Crop pest;\n  (β) Livestock parasite.",
          hint: "Pests damage crops directly; parasites live on or inside animals to feed.",
          modelAnswer: `(i) Differentiation [2 marks]:
• Crop Pest: An organism (typically an insect, rodent, or bird) that attacks, damages, or feeds on cultivated crop plants, reducing harvest yield or quality.
• Livestock Parasite: An organism that lives on (ectoparasite) or inside (endoparasite) the body of a farm animal, deriving nourishment and shelter at the expense of the host's health.

(ii) Examples [1 mark each = 2 marks]:
• (α) Crop pest: Stem borer, variegated grasshopper, aphid, weevil, weaver bird.
• (β) Livestock parasite: Tick, louse, flea, tapeworm, liver fluke, roundworm.`,
          workedSolution: "2 marks for clear distinction, 1 mark for crop pest example, 1 mark for livestock parasite example."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "(i) What is mechanical work done in physics?\n\n(ii) A constant horizontal force of $10\\text{ N}$ pulls a wooden crate across a floor through a distance of $5.2\\text{ m}$ in the direction of the force. Calculate the work done in Joules.",
          hint: "Work = Force x distance moved in the direction of the force.",
          modelAnswer: `(i) Definition of work [2 marks]:
The product of the magnitude of an applied force and the displacement moved by the object in the direction of the force ($W = F \\times d$).

(ii) Calculation [2 marks]:
Formula:
$$\\text{Work Done } (W) = F \\times d$$
Substitute the given values ($F = 10\\text{ N}$, $d = 5.2\\text{ m}$):
$$W = 10\\text{ N} \\times 5.2\\text{ m} = 52\\text{ J}$$
Answer: $52\\text{ Joules (J)}$.`,
          workedSolution: "2 marks for work definition, 1 mark for formula substitution, 1 mark for correct value 52 J with units."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "Name two non-communicable clinical diseases or disorders associated with the human circulatory system.",
          hint: "Think about conditions affecting blood pressure, arteries, and the heart muscle.",
          modelAnswer: `Circulatory diseases/disorders [1.5 marks each, any 2 = 3 marks]:
1. Hypertension (persistently elevated arterial blood pressure).
2. Arteriosclerosis / Atherosclerosis (narrowing and hardening of arteries by plaque deposits).
3. Coronary heart disease / Coronary thrombosis (myocardial infarction).
4. Stroke (cerebrovascular accident).`,
          workedSolution: "1.5 marks each for any two valid non-communicable cardiovascular disorders."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Malnutrition, Bohr Atomic Shells of Potassium, Kinetic Energy & Soil Nutrients",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for malnutrition & deficiency diseases, 4 marks for potassium configuration & diagram, 4 marks for PE definition & KE calculation, 3 marks for macro and micro nutrients.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) What is malnutrition in human health?\n\n(ii) State one visible clinical symptom for each of the following nutritional deficiency diseases:\n  (α) Scurvy;\n  (β) Rickets.",
          hint: "Scurvy is caused by Vitamin C deficiency; rickets by Vitamin D/calcium deficiency.",
          modelAnswer: `(i) Definition of malnutrition [2 marks]:
A pathological condition resulting from an unbalanced diet characterized by an inadequate, excessive, or disproportionate intake of essential nutrients.

(ii) Clinical symptoms [1 mark each = 2 marks]:
• (α) Scurvy (Vitamin C deficiency): Spongy, swollen, bleeding gums, loose teeth, poor wound healing, and subcutaneous capillary hemorrhages.
• (β) Rickets (Vitamin D/Calcium deficiency): Softened, malformed bones resulting in bow-legs, knock-knees, pigeon chest, and swollen wrists/ankles in children.`,
          workedSolution: "2 marks for malnutrition definition, 1 mark for scurvy symptom, 1 mark for rickets symptom."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "A neutral potassium atom has an atomic number of 19 ($K = 19$). State its electron configuration across Bohr shells and draw its electron distribution diagram.",
          hint: "Bohr shell maximum capacities: 2 in K, 8 in L, 8 in M, and remaining in N.",
          modelAnswer: `Electron configuration [2 marks]:
Atomic number $Z = 19 \\implies 19\\text{ electrons}$.
Bohr shell capacity rules:
• Shell 1 (K): 2 electrons
• Shell 2 (L): 8 electrons
• Shell 3 (M): 8 electrons
• Shell 4 (N): 1 electron
Configuration: $$2, 8, 8, 1$$

Diagrammatic representation [2 marks]:
Four concentric circles surrounding a central nucleus ($19p, 20n$): the innermost ring bears 2 electrons, the second bears 8, the third bears 8, and the outermost valence ring bears 1 electron.`,
          workedSolution: "2 marks for electronic configuration 2, 8, 8, 1; 2 marks for clear shell diagram representation."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "(i) Define potential energy in mechanics.\n\n(ii) A mass of $10\\text{ kg}$ is moving with a constant velocity of $2.0\\text{ m s}^{-1}$. Calculate the kinetic energy possessed by the moving body.",
          hint: "KE = 0.5 * m * v^2 where m = 10 kg and v = 2 m/s.",
          modelAnswer: `(i) Definition of potential energy [2 marks]:
The stored energy possessed by a body as a consequence of its vertical elevation in a gravitational field or its elastic deformation.

(ii) Kinetic energy calculation [2 marks]:
Formula:
$$\\text{K.E.} = \\frac{1}{2}mv^2$$
Substitute given values ($m = 10\\text{ kg}$, $v = 2.0\\text{ m s}^{-1}$):
$$\\text{K.E.} = \\frac{1}{2} \\times 10 \\times (2.0)^2 = 5 \\times 4 = 20\\text{ J}$$
Answer: $20\\text{ Joules (J)}$.`,
          workedSolution: "2 marks for potential energy definition, 1 mark for formula substitution, 1 mark for correct value 20 J with unit."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "Give one specific example each of a mineral nutrient required by agricultural crops classified as:\n(i) A soil macro-nutrient;\n(ii) A soil micro-nutrient (trace element).",
          hint: "Macro-nutrients are needed in large amounts (NPK, Ca, Mg); micro-nutrients in trace quantities (Fe, Zn, Cu, B).",
          modelAnswer: `(i) Macro-nutrient [1.5 marks]:
Nitrogen (N), Phosphorus (P), Potassium (K), Calcium (Ca), Magnesium (Mg), or Sulfur (S).

(ii) Micro-nutrient [1.5 marks]:
Iron (Fe), Zinc (Zn), Copper (Cu), Boron (B), Manganese (Mn), or Molybdenum (Mo).`,
          workedSolution: "1.5 marks for valid macro-nutrient, 1.5 marks for valid micro-nutrient."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Laboratory Safety, Osmosis vs. Diffusion, Weather & Soil Fertility",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for lab hazards & safety, 4 marks for osmosis/diffusion comparison table, 4 marks for weather and season differences, 3 marks for soil fertility depletion.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) Explain what is meant by a hazard in a school science laboratory.\n\n(ii) List two essential safety precautions observed to protect students against hazards during practical science lessons.",
          hint: "Hazards present risks of injury or damage; PPE and strict rules minimize exposure.",
          modelAnswer: `(i) Hazard definition [2 marks]:
Any situation, chemical substance, piece of equipment, or activity with the potential to cause physical injury, chemical burns, health impairment, or property damage.

(ii) Safety precautions [1 mark each, any 2 = 2 marks]:
1. Always wearing personal protective equipment (PPE), including safety eye goggles, lab coats, and closed-toe shoes.
2. Never eating, tasting, drinking, or running inside the laboratory.
3. Conducting reactions that release toxic or volatile fumes inside a functional fume chamber.
4. Washing hands thoroughly with soap and clean water before exiting the laboratory.`,
          workedSolution: "2 marks for hazard definition, 2 marks for two valid lab safety precautions."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "In a tabular format, state three scientific differences between the processes of osmosis and diffusion.",
          hint: "Compare moving particles, requirement of a semi-permeable membrane, and medium.",
          modelAnswer: `Differences Table [4 marks]:

| Feature | Osmosis | Diffusion |
| :--- | :--- | :--- |
| **Particles Moving** | Solvent (water) molecules only | Solute particles, liquids, or gas molecules |
| **Membrane Requirement** | Strictly requires a selectively permeable membrane | Does not require a membrane |
| **Medium of Occurrence** | Occurs exclusively in aqueous liquid solutions | Occurs in gases, liquids, and solutions |
| **Concentration Gradient** | Water moves from higher water potential to lower water potential | Particles move from higher solute concentration to lower concentration |`,
          workedSolution: "1 mark for neat table format, 1 mark each for 3 accurate point-by-point contrasts."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "(i) What is weather?\n\n(ii) State two clear differences between weather and season.",
          hint: "Weather is short-term atmospheric conditions; season is a prolonged annual period.",
          modelAnswer: `(i) Weather [2 marks]:
The physical state and atmospheric conditions of a particular locality (temperature, rainfall, pressure, humidity, wind) recorded over a short period of time (hours or days).

(ii) Differences between weather and season [1 mark each = 2 marks]:
1. Duration: Weather changes from hour to hour or day to day, whereas a season lasts for a prolonged period of several months (e.g., dry harmattan season or rainy season).
2. Predictability: Weather exhibits day-to-day fluctuations, whereas seasons follow a repeating, predictable annual cycle.`,
          workedSolution: "2 marks for weather definition, 2 marks for duration and predictability differences."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "(i) What is meant by fertile soil in crop husbandry?\n\n(ii) State two natural or human-induced factors that cause the depletion of soil fertility.",
          hint: "Fertile soil provides balanced nutrients and physical support; erosion and leaching deplete nutrients.",
          modelAnswer: `(i) Fertile soil [1.5 marks]:
Soil that possesses the physical structure, aeration, moisture capacity, and chemical nutrients required in optimal balance to support healthy, vigorous plant growth and crop yields.

(ii) Factors causing loss of soil fertility [1.5 marks, any 2]:
1. Soil erosion: Running water or wind sweeps away topsoil and organic humus.
2. Leaching: Heavy rainfall percolates soluble nitrates and potassium beyond the root zone.
3. Continuous monoculture without fallowing or manure application.
4. Bush burning, which incinerates soil organic matter and beneficial microflora.`,
          workedSolution: "1.5 marks for fertile soil definition, 1.5 marks for two valid fertility depletion causes."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Magnetic Fields, Teenage Pregnancy, Chemical Formulae & Soil Texture",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for magnetic field & magnet making, 4 marks for teenage pregnancy & consequences, 4 marks for chemical formulae, 3 marks for soil physical properties & clay texture.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) What is a magnetic field?\n\n(ii) Name two distinct methods used to make artificial permanent magnets from ferromagnetic materials.",
          hint: "A magnetic field is the region of magnetic force; magnets can be made by electrical stroking, or induction.",
          modelAnswer: `(i) Magnetic field [2 marks]:
A region of space surrounding a permanent magnet, moving electric charge, or current-carrying conductor in which magnetic forces can be experienced by magnetic materials.

(ii) Methods of making magnets [1 mark each, any 2 = 2 marks]:
1. Electrical method: Placing a steel bar inside a cylindrical coil (solenoid) and passing direct current (DC) through it.
2. Stroking method: Stroking a steel bar repeatedly in one direction from end to end with the pole of a permanent magnet (single touch or divided touch).
3. Magnetic induction.`,
          workedSolution: "2 marks for magnetic field definition, 2 marks for two valid magnet-making methods."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "Explain briefly what is meant by teenage pregnancy and state two socio-economic or educational consequences on the teenage mother.",
          hint: "Pregnancy in females aged 13-19 years often leads to school dropout and financial hardship.",
          modelAnswer: `Definition [2 marks]:
Pregnancy occurring in an adolescent female between the ages of 13 and 19 years before physiological, emotional, or financial maturity.

Consequences [1 mark each, any 2 = 2 marks]:
1. Disruption and premature termination of formal schooling and academic education.
2. Financial distress and deepened poverty due to lack of employable skills.
3. Elevated risk of obstetric complications (e.g., obstructed labor, obstetric fistula, high maternal mortality).
4. Social stigma, emotional depression, and parental rejection.`,
          workedSolution: "2 marks for teenage pregnancy definition, 2 marks for two valid socio-economic or educational impacts."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Write down the systematic chemical formula for each of the following inorganic compounds:\n(i) Calcium chloride;\n(ii) Copper (I) oxide;\n(iii) Nitrogen (IV) oxide;\n(iv) Ammonia gas.",
          hint: "Combine oxidation states: Ca is +2, Cl is -1; Cu(I) is +1, O is -2; N(IV) with O2; ammonia is NH3.",
          modelAnswer: `Chemical Formulae [1 mark each = 4 marks]:
• (i) Calcium chloride: $\\text{CaCl}_2$
• (ii) Copper (I) oxide: $\\text{Cu}_2\\text{O}$
• (iii) Nitrogen (IV) oxide: $\\text{NO}_2$
• (iv) Ammonia: $\\text{NH}_3$`,
          workedSolution: "1 mark each for CaCl2, Cu2O, NO2, and NH3."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "(i) List three physical properties of agricultural soils.\n\n(ii) What is the characteristic tactile texture of a wet clayey soil?",
          hint: "Physical properties include texture, structure, porosity, color; wet clay feels sticky and plastic.",
          modelAnswer: `(i) Physical properties [1.5 marks, any 3]:
1. Soil texture (particle size distribution of sand, silt, and clay)
2. Soil structure (arrangement of particles into aggregates/peds)
3. Water-holding capacity and permeability
4. Soil color and bulk density

(ii) Texture of wet clayey soil [1.5 marks]:
It feels sticky, smooth, plastic, and heavy, and can be easily molded into ribbons without cracking.`,
          workedSolution: "1.5 marks for three physical properties, 1.5 marks for tactile texture of wet clay."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Derived Quantities, Photosynthesis Factors, Water Hardness & Seed Nursery",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for derived quantities & SI units, 4 marks for photosynthesis factors & functions, 4 marks for soft vs. hard water, 3 marks for nursery agronomic advantages.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) What are derived physical quantities in scientific measurement?\n\n(ii) State the standard S.I. units for each of the following derived quantities:\n  (α) Area;\n  (β) Volume.",
          hint: "Derived quantities are formed by combining fundamental base units.",
          modelAnswer: `(i) Derived quantities [2 marks]:
Physical quantities that are not fundamental, but are derived mathematically from combinations (products or quotients) of base S.I. quantities (such as length, mass, and time).

(ii) S.I. Units [1 mark each = 2 marks]:
• (α) Area: Square metre ($\\text{m}^2$)
• (β) Volume: Cubic metre ($\\text{m}^3$)`,
          workedSolution: "2 marks for derived quantity definition, 1 mark for m^2, 1 mark for m^3."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "(i) State two external environmental factors necessary for photosynthesis in green leaves.\n\n(ii) Explain the specific physiological function of each of the two factors named in (b)(i).",
          hint: "Sunlight energizes the reaction; carbon dioxide provides carbon for glucose synthesis.",
          modelAnswer: `(i) Environmental factors [2 marks]:
Sunlight (radiant light energy) and Carbon (IV) oxide ($CO_2$) gas. *(Water and chlorophyll are also essential).*

(ii) Functions [1 mark each = 2 marks]:
• Sunlight: Provides radiant photon energy absorbed by chlorophyll to drive the photolysis (splitting) of water molecules and energize ATP synthesis.
• Carbon (IV) oxide ($CO_2$): Enters leaf stomata to serve as the raw carbon source reduced during dark reactions (Calvin cycle) into glucose carbohydrates.`,
          workedSolution: "2 marks for naming sunlight and CO2, 2 marks for explaining photolysis/energy and carbon source."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Explain each of the following terms in water chemistry:\n(i) Soft water;\n(ii) Hard water.",
          hint: "Soft water lathers easily with soap; hard water contains calcium and magnesium ions and forms scum.",
          modelAnswer: `(i) Soft water [2 marks]:
Water that is free from dissolved calcium ($\\text{Ca}^{2+}$) and magnesium ($\\text{Mg}^{2+}$) ions, and therefore lathers easily and immediately with soap without forming insoluble scum.

(ii) Hard water [2 marks]:
Water that contains dissolved mineral salts of calcium and magnesium (such as hydrogencarbonates, sulfates, or chlorides), which precipitate soap into an insoluble grey scum before a lather can form.`,
          workedSolution: "2 marks for soft water definition, 2 marks for hard water definition."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "State three agronomic reasons why certain vegetable and tree crop seeds are sown in a nursery bed before transplanting into the field.",
          hint: "Nurseries protect small seeds, allow intensive care, and enable selection of vigorous seedlings.",
          modelAnswer: `Agronomic reasons [1 mark each, any 3 = 3 marks]:
1. Protection of tiny, fragile seeds from harsh environmental factors like heavy beating raindrops, scorching solar heat, and surface runoff.
2. Easier management and protection against field pests, fungal damping-off diseases, and weed competition.
3. Allows the farmer to select only vigorous, healthy, disease-free seedlings for field transplanting.
4. Facilitates intensive watering, shading, and thinning out in a concentrated, manageable space.`,
          workedSolution: "1 mark each for any 3 valid agronomic justifications for nursery practice."
        }
      ]
    }
  ]
};
