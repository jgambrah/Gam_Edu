/**
 * 2014 BECE Integrated Science
 * Paper 2: Practical & Theory Essay Examination (Set 75 Variant)
 *
 * Structure:
 * - Section A (Compulsory Practical Test, 40 marks): Q1 (a, b, c, d)
 * - Section B (Theory Essays, 15 marks each, Answer 4 of 5): Q2, Q3, Q4, Q5, Q6
 * Total Marks: 100 | Time Allowed: 1 hour 15 minutes (75 mins)
 *
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
 */

import { CurriculumQuestionSet } from '../global-curriculum-types';

const svgQ1aMosquitoLifeCycle = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='30' y1='115' x2='350' y2='115' stroke='#38bdf8' stroke-width='2' stroke-dasharray='4,4'/><text x='40' y='110' font-size='10' font-weight='bold' fill='#38bdf8'>Water Surface</text><g transform='translate(250, 95)'><rect x='0' y='0' width='70' height='18' rx='3' fill='#94a3b8' stroke='#cbd5e1' stroke-width='1.2'/><line x1='10' y1='0' x2='10' y2='18' stroke='#475569'/><line x1='20' y1='0' x2='20' y2='18' stroke='#475569'/><line x1='30' y1='0' x2='30' y2='18' stroke='#475569'/><line x1='40' y1='0' x2='40' y2='18' stroke='#475569'/><line x1='50' y1='0' x2='50' y2='18' stroke='#475569'/><line x1='60' y1='0' x2='60' y2='18' stroke='#475569'/><text x='35' y='32' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Stage I</text></g><g transform='translate(195, 115)'><line x1='15' y1='0' x2='15' y2='18' stroke='#f59e0b' stroke-width='3.5'/><path d='M 15 18 Q 30 45 42 75' fill='none' stroke='#cbd5e1' stroke-width='4'/><circle cx='44' cy='78' r='6' fill='#94a3b8'/><line x1='42' y1='82' x2='48' y2='88' stroke='#94a3b8' stroke-width='1.5'/><line x1='44' y1='82' x2='44' y2='90' stroke='#94a3b8' stroke-width='1.5'/><text x='25' y='96' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Stage II</text></g><g transform='translate(55, 120)'><line x1='32' y1='-5' x2='28' y2='15' stroke='#f59e0b' stroke-width='2.5'/><ellipse cx='26' cy='22' rx='14' ry='12' fill='#94a3b8' stroke='#cbd5e1' stroke-width='1.5'/><path d='M 18 30 Q 10 45 22 55 Q 32 58 35 48' fill='none' stroke='#cbd5e1' stroke-width='3.5'/><text x='25' y='74' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Stage III</text></g><g transform='translate(130, 20)'><ellipse cx='45' cy='45' rx='18' ry='7' fill='#64748b' stroke='#94a3b8' stroke-width='1.5'/><circle cx='24' cy='45' r='5' fill='#94a3b8'/><line x1='20' y1='45' x2='6' y2='52' stroke='#ef4444' stroke-width='1.8'/><ellipse cx='46' cy='32' rx='22' ry='6' fill='#38bdf8' opacity='0.6' transform='rotate(-20 46 32)'/><line x1='35' y1='50' x2='20' y2='72' stroke='#94a3b8' stroke-width='1.5'/><line x1='45' y1='50' x2='42' y2='75' stroke='#94a3b8' stroke-width='1.5'/><line x1='55' y1='50' x2='68' y2='72' stroke='#94a3b8' stroke-width='1.5'/><text x='45' y='18' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Stage IV</text></g><path d='M 195 40 L 250 85' fill='none' stroke='#64748b' stroke-width='1.5'/><path d='M 270 120 L 235 155' fill='none' stroke='#64748b' stroke-width='1.5'/><path d='M 180 180 L 105 160' fill='none' stroke='#64748b' stroke-width='1.5'/><path d='M 75 120 L 125 70' fill='none' stroke='#64748b' stroke-width='1.5'/></svg></div>`;

const svgQ1bSeparationSetups = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 200' width='100%' height='180' style='max-width: 500px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(15, 20)'><rect x='15' y='65' width='60' height='75' rx='3' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><polygon points='18,25 72,25 48,65 42,65' fill='#334155' stroke='#cbd5e1' stroke-width='1.5'/><line x1='45' y1='65' x2='45' y2='90' stroke='#cbd5e1' stroke-width='3.5'/><circle cx='45' cy='105' r='2' fill='#38bdf8'/><rect x='17' y='110' width='56' height='28' fill='#0284c7' opacity='0.4'/><text x='45' y='160' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Setup A</text></g><g transform='translate(140, 20)'><line x1='20' y1='80' x2='5' y2='138' stroke='#64748b' stroke-width='2'/><line x1='70' y1='80' x2='85' y2='138' stroke='#64748b' stroke-width='2'/><line x1='15' y1='80' x2='75' y2='80' stroke='#64748b' stroke-width='2.5'/><path d='M 45 105 Q 40 90 45 80 Q 50 90 45 105 Z' fill='#f59e0b'/><rect x='42' y='105' width='6' height='33' fill='#94a3b8'/><path d='M 15 76 Q 45 92 75 76 Z' fill='#e2e8f0' stroke='#cbd5e1' stroke-width='1.5'/><path d='M 22 78 Q 45 88 68 78 Z' fill='#f59e0b' opacity='0.6'/><text x='45' y='160' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Setup B</text></g><g transform='translate(265, 20)'><line x1='20' y1='80' x2='5' y2='138' stroke='#64748b' stroke-width='2'/><line x1='70' y1='80' x2='85' y2='138' stroke='#64748b' stroke-width='2'/><line x1='15' y1='80' x2='75' y2='80' stroke='#64748b' stroke-width='2.5'/><path d='M 45 105 Q 40 90 45 80 Q 50 90 45 105 Z' fill='#f59e0b'/><rect x='42' y='105' width='6' height='33' fill='#94a3b8'/><path d='M 15 76 Q 45 90 75 76 Z' fill='#e2e8f0' stroke='#cbd5e1' stroke-width='1.5'/><polygon points='22,74 68,74 48,35 42,35' fill='#38bdf8' opacity='0.25' stroke='#38bdf8' stroke-width='1.5'/><rect x='43' y='12' width='4' height='23' fill='#38bdf8' opacity='0.4'/><circle cx='45' cy='12' r='3.5' fill='#cbd5e1'/><text x='45' y='160' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Setup C</text></g></svg></div>`;

const svgQ1cLabInstruments = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 190' width='100%' height='175' style='max-width: 500px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(20, 30)'><circle cx='25' cy='30' r='18' fill='#f59e0b' stroke='#d97706' stroke-width='2'/><path d='M 35 40 Q 55 45 70 35' fill='none' stroke='#fde68a' stroke-width='4'/><text x='25' y='65' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>I</text></g><g transform='translate(105, 20)'><circle cx='28' cy='35' r='22' fill='#1e293b' stroke='#64748b' stroke-width='2'/><line x1='28' y1='35' x2='28' y2='20' stroke='#38bdf8' stroke-width='2'/><line x1='28' y1='35' x2='40' y2='35' stroke='#ef4444' stroke-width='1.5'/><rect x='25' y='8' width='6' height='5' fill='#cbd5e1'/><text x='28' y='75' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>II</text></g><g transform='translate(180, 15)'><rect x='10' y='10' width='6' height='75' rx='3' fill='#e2e8f0' stroke='#64748b'/><circle cx='13' cy='82' r='6' fill='#ef4444'/><line x1='13' y1='40' x2='13' y2='82' stroke='#ef4444' stroke-width='2'/><text x='13' y='105' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>III</text></g><g transform='translate(230, 25)'><path d='M 10 15 L 45 15 L 35 25 L 20 25 Z' fill='#94a3b8'/><rect x='12' y='25' width='32' height='35' rx='3' fill='#1e293b' stroke='#64748b'/><circle cx='28' cy='42' r='9' fill='#0f172a' stroke='#38bdf8'/><line x1='28' y1='42' x2='33' y2='37' stroke='#ef4444'/><text x='28' y='75' font-size='11' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>IV</text></g><g transform='translate(305, 15)'><rect x='15' y='10' width='35' height='140' rx='2' fill='#0284c7' opacity='0.2' stroke='#38bdf8' stroke-width='1.5'/><line x1='40' y1='30' x2='50' y2='30' stroke='#94a3b8'/><text x='38' y='33' font-size='7' fill='#cbd5e1' text-anchor='end'>250</text><line x1='40' y1='54' x2='50' y2='54' stroke='#94a3b8'/><text x='38' y='57' font-size='7' fill='#cbd5e1' text-anchor='end'>200</text><line x1='40' y1='78' x2='50' y2='78' stroke='#94a3b8'/><text x='38' y='81' font-size='7' fill='#cbd5e1' text-anchor='end'>150</text><line x1='40' y1='102' x2='50' y2='102' stroke='#94a3b8'/><text x='38' y='105' font-size='7' fill='#cbd5e1' text-anchor='end'>100</text><line x1='40' y1='126' x2='50' y2='126' stroke='#94a3b8'/><text x='38' y='129' font-size='7' fill='#cbd5e1' text-anchor='end'>50</text><rect x='16' y='73' width='33' height='75' fill='#38bdf8' opacity='0.6'/><path d='M 16 73 Q 32 75 49 73' fill='none' stroke='#0284c7' stroke-width='2'/><line x1='50' y1='73' x2='62' y2='73' stroke='#ef4444' stroke-width='1.5' stroke-dasharray='2,2'/><text x='32' y='165' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>V</text></g></svg></div>`;

const svgQ1dAvianDigestive = `<div class="my-4 flex justify-center"><svg viewBox='0 0 340 220' width='100%' height='200' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><path d='M 150 15 L 150 50' stroke='#cbd5e1' stroke-width='5'/><line x1='155' y1='30' x2='230' y2='30' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='235' y='34' font-size='12' font-weight='bold' fill='#cbd5e1'>I</text><path d='M 148 50 C 115 50 110 80 148 85 Z' fill='#fed7aa' stroke='#ea580c' stroke-width='2'/><line x1='115' y1='68' x2='60' y2='68' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='72' font-size='12' font-weight='bold' fill='#fb923c' text-anchor='end'>IV</text><path d='M 150 85 L 150 105' stroke='#cbd5e1' stroke-width='6'/><path d='M 130 105 C 105 105 110 135 145 130 Z' fill='#881337' stroke='#e11d48' stroke-width='1.8'/><line x1='110' y1='120' x2='60' y2='120' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='124' font-size='12' font-weight='bold' fill='#f43f5e' text-anchor='end'>III</text><ellipse cx='195' cy='125' rx='25' ry='32' fill='#f87171' stroke='#b91c1c' stroke-width='2.5'/><line x1='220' y1='125' x2='270' y2='125' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='275' y='129' font-size='12' font-weight='bold' fill='#f87171'>II</text><path d='M 180 155 Q 150 185 180 205' fill='none' stroke='#cbd5e1' stroke-width='4'/></svg></div>`;

export const SET_BECE_2014_SCIENCE_P2: CurriculumQuestionSet = {
  id: "paper_2014_variant_p2",
  title: "2014 BECE Integrated Science Practical & Theory Examination (Set 75)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2014 BECE Practical & Theory Essay Test",
  variantType: "past_paper_variant",
  year: 2014,
  paperType: 2,
  setNumber: 75,
  era: "2014 BECE Standards",
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
          diagramSvg: svgQ1aMosquitoLifeCycle,
          prompt: `The diagram below illustrates the complete developmental metamorphosis of a mosquito in an aquatic breeding habitat. Study the diagram carefully and answer the questions that follow:

${svgQ1aMosquitoLifeCycle}

(i) Name each of the developmental stages labelled I, II, III, and IV.

(ii) Explain how stage II obtains atmospheric oxygen while submerged under the water surface.

(iii) State two physical or chemical methods used to control stage III in aquatic habitats.

(iv) State two environmental or physical methods used to control stage IV in human habitations.`,
          hint: "Identify the four stages of complete insect metamorphosis. Consider surface tension and atmospheric breathing apparatus.",
          modelAnswer: `(i) Names of developmental stages [4 marks]:
• Stage I: Egg raft (or eggs)
• Stage II: Larva (wiggler)
• Stage III: Pupa (tumbler)
• Stage IV: Adult (imago)

(ii) Respiratory mechanism of Stage II [2 marks]:
The larva suspends itself upside down from the surface tension film of water and extends its specialized breathing siphon tube to intake atmospheric oxygen.

(iii) Control methods for Stage III [2 marks]:
• Spreading a layer of oil or kerosene over stagnant water surfaces to break surface tension and block respiratory trumpets.
• Biological control: stocking ponds with mosquito-eating fish (e.g., Gambusia / tilapia fingerlings).
• Application of chemical larvicides or insect growth regulators.

(iv) Control methods for Stage IV [2 marks]:
• Draining choked gutters and disposing of discarded containers and tyres to eliminate breeding sites.
• Sleeping under insecticide-treated bed nets (ITNs) and installing wire mesh screens on windows and doors.
• Spraying aerosol knock-down insecticides or lighting mosquito coils in rooms.`,
          workedSolution: "Full marks awarded for correctly identifying all 4 stages, explaining siphon mechanics, and listing valid practical control methods."
        },
        {
          partLabel: "(b)",
          marks: 10,
          diagramSvg: svgQ1bSeparationSetups,
          prompt: `The diagram below illustrates three standard laboratory setups (A, B, and C) utilized in the separation of mixtures. Study the diagram carefully and answer the questions that follow:

${svgQ1bSeparationSetups}

(i) Name the specific physical separation method represented by each of the setups labelled A, B, and C.

(ii) Identify the parts of the apparatus labelled:
  (α) The porous cone in Setup A;
  (β) The shallow ceramic container in Setup B;
  (γ) The inverted glass apparatus in Setup C.

(iii) State which of the setups (A, B, or C) is most appropriate for:
  (α) Obtaining clear potable water from a muddy stream suspension;
  (β) Recovering dry sodium chloride crystals from seawater.

(iv) Explain why Setup C requires an inverted funnel with a plugged stem during the separation of an ammonium chloride and sand mixture.`,
          hint: "Identify the three separation techniques based on phase states, solubility, and phase transition directly from solid to gas.",
          modelAnswer: `(i) Separation methods [3 marks]:
• Setup A: Filtration
• Setup B: Evaporation (to dryness)
• Setup C: Sublimation

(ii) Apparatus identification [3 marks]:
• (α) Porous cone in Setup A: Filter paper (supported in a funnel).
• (β) Ceramic container in Setup B: Evaporating dish (porcelain basin).
• (γ) Inverted apparatus in Setup C: Inverted glass funnel (with plugged stem).

(iii) Appropriate setup selection [2 marks]:
• (α) Clear water from muddy suspension: Setup A (Filtration).
• (β) Dry sodium chloride crystals from seawater: Setup B (Evaporation).

(iv) Explanation for Setup C [2 marks]:
Ammonium chloride sublimes upon heating, turning directly into vapour. The inverted funnel provides a cool condensing surface where the vapour deposits back into solid crystals (sublimate), while the plug prevents the vapour from escaping into the open air.`,
          workedSolution: "Full marks for accurate method names, component identification, application matching, and sublimation principle explanation."
        },
        {
          partLabel: "(c)",
          marks: 10,
          diagramSvg: svgQ1cLabInstruments,
          prompt: `The diagram below displays standard measuring instruments (I, II, III, IV, and V) routinely used in physical science laboratories. Study the diagram carefully and answer the questions that follow:

${svgQ1cLabInstruments}

(i) Name each of the measuring instruments labelled I, II, III, IV, and V.

(ii) State the primary physical quantity measured by each of the instruments labelled I, II, III, and IV, indicating their respective S.I. units.

(iii) Carefully read and record the volume of the liquid contained in the graduated measuring cylinder labelled V, stating the correct metric unit.`,
          hint: "Identify common laboratory apparatus for length, time, temperature, mass, and liquid volume.",
          modelAnswer: `(i) Instrument names [5 marks]:
• I: Measuring tape (tape measure)
• II: Stop clock (or stopwatch)
• III: Laboratory thermometer (mercury/alcohol-in-glass)
• IV: Top-pan balance (or weighing balance)
• V: Graduated measuring cylinder

(ii) Physical quantities and S.I. units [4 marks]:
• Instrument I: Length or distance (S.I. unit: Metre, m)
• Instrument II: Time interval (S.I. unit: Second, s)
• Instrument III: Temperature (S.I. unit: Kelvin, K; Celsius, °C)
• Instrument IV: Mass of matter (S.I. unit: Kilogram, kg)

(iii) Reading of liquid volume [1 mark]:
The bottom of the concave meniscus lies precisely at 160 cm³ (or 160 mL).
Reading: 160 cm³ (or 160 mL).`,
          workedSolution: "1 mark per instrument name, 1 mark per physical quantity & unit, 1 mark for accurate meniscus reading."
        },
        {
          partLabel: "(d)",
          marks: 10,
          diagramSvg: svgQ1dAvianDigestive,
          prompt: `The diagram below illustrates the anatomical structure of the digestive tract of a domestic farm bird (poultry). Study the diagram carefully and answer the questions that follow:

${svgQ1dAvianDigestive}

(i) Name each of the anatomical organs labelled I, II, III, and IV.

(ii) State one vital digestive function performed by each of the organs labelled II and IV.

(iii) Name two domestic farm animals that possess this specialized digestive system.

(iv) Name two contagious viral or parasitic diseases that infect this class of livestock.`,
          hint: "Recognize avian digestive tract components: gullet, crop, gizzard, liver.",
          modelAnswer: `(i) Anatomical organs [4 marks]:
• I: Oesophagus (gullet)
• II: Gizzard (ventriculus)
• III: Liver
• IV: Crop

(ii) Digestive functions [2 marks]:
• Part II (Gizzard): Mechanically grinds and crushes hard grains and seeds using ingested grit/small stones and muscular contractions.
• Part IV (Crop): Temporarily stores swallowed feed and softens whole grains with digestive secretions.

(iii) Domestic farm animals [2 marks]:
Domestic fowl (chicken), turkey, duck, guinea fowl, goose.

(iv) Livestock diseases [2 marks]:
• Newcastle disease (viral)
• Coccidiosis (protozoan)
• Fowl pox (viral)
• Fowl typhoid / Pullorum disease (bacterial)`,
          workedSolution: "4 marks for anatomical identification, 2 marks for functions, 2 marks for poultry species, 2 marks for avian pathologies."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Water Synthesis, Ecosystems, Soil Fertility & Magnetism",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts (a), (b), (c), and (d) of this question:",
      workedSolution: "See complete worked solutions and marking breakdown below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) Name the two chemical elements that react together to form pure water.\n\n(ii) Write a balanced chemical equation for the synthesis of water from its constituent gaseous elements.",
          hint: "Recall diatomic hydrogen and oxygen molecules reacting to produce water vapour or liquid.",
          modelAnswer: "(i) Elements [2 marks]:\nHydrogen and Oxygen.\n\n(ii) Balanced chemical equation [2 marks]:\n2H₂ + O₂ → 2H₂O",
          workedSolution: "2 marks for naming both elements; 2 marks for correctly balanced equation."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "State two sustainable conservation practices required to maintain biological equilibrium in an ecosystem.",
          hint: "Focus on habitat preservation, controlling exploitation, and pollution prevention.",
          modelAnswer: "Sustainable practices [4 marks, any 2]:\n1. Enforcing strict bans on illegal mining (galamsey), reckless deforestation, and indiscriminate bush burning.\n2. Implementing afforestation and reforestation projects to restore depleted tree cover.\n3. Regulating commercial fishing and banning the hunting/poaching of wild animals during closed breeding seasons.",
          workedSolution: "2 marks per valid conservation practice."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "(i) What is a fertile soil?\n\n(ii) State two natural or human-induced factors that cause the loss of soil fertility.",
          hint: "Fertile soil provides balanced nutrients, good structure, and aeration.",
          modelAnswer: "(i) Fertile soil [2 marks]:\nSoil that has the capacity to supply all essential macro- and micro-nutrients in correct proportions, adequate moisture, and proper aeration to support vigorous plant growth.\n\n(ii) Factors causing fertility loss [2 marks]:\n• Soil erosion (removal of topsoil by wind/water).\n• Leaching (dissolved nutrients washed deep beyond root zone).\n• Continuous mono-cropping without fallowing or manuring.\n• Bush burning (destroys organic matter and beneficial micro-organisms).",
          workedSolution: "2 marks for accurate definition; 1 mark per valid depletion factor."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "Classify the following everyday materials into magnetic substances and non-magnetic substances:\nSteel razor blade, dry wooden ruler, rubber band, glass tumbler.",
          hint: "Magnetic materials are attracted to magnets (contain ferromagnetic iron/steel).",
          modelAnswer: "Classification [3 marks]:\n• Magnetic substance: Steel razor blade (contains ferromagnetic iron) [1.5 marks].\n• Non-magnetic substances: Dry wooden ruler, rubber band, glass tumbler [1.5 marks].",
          workedSolution: "Full marks for complete classification."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Germination, Livestock Identification, Pressure & Metals",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts (a), (b), (c), and (d) of this question:",
      workedSolution: "See complete worked solutions and marking breakdown below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) What is seed germination?\n\n(ii) State two environmental conditions essential for the germination of viable seeds.",
          hint: "The awakening of the embryo plant. Water, oxygen, warmth (temperature).",
          modelAnswer: "(i) Seed germination [2 marks]:\nThe physiological process by which a viable dormant seed embryo absorbs moisture and starts metabolic activity to grow into a young seedling.\n\n(ii) Essential conditions [2 marks, any 2]:\n1. Water (moisture) to activate enzymes and soften the seed coat.\n2. Oxygen (air) for aerobic cellular respiration.\n3. Suitable optimum temperature (warmth) for enzyme catalysis.",
          workedSolution: "2 marks for definition; 1 mark each for essential environmental conditions."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "State four conventional management methods used by livestock farmers to identify individual farm animals in a herd.",
          hint: "Methods for marking farm animals permanently or semi-permanently.",
          modelAnswer: "Livestock identification methods [4 marks]:\n1. Ear tagging (fixing numbered plastic or metal tags).\n2. Ear notching (cutting distinct geometric notches on the ear edges).\n3. Tattooing (applying indelible ink numbers inside the ear or flank).\n4. Branding (applying hot-iron or freeze branding on the hide).",
          workedSolution: "1 mark for each valid identification method (max 4 marks)."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Using the scientific principles of force, pressure, and surface area, explain why it is considerably easier to cut a tuber of yam with a sharp knife than with a blunt knife.",
          hint: "Pressure = Force / Area. Contrast the contact surface areas.",
          modelAnswer: "Explanation [4 marks]:\nPressure is defined as force applied per unit area (P = F / A). A sharp knife has an extremely small contact surface area at its blade edge, which produces a very high cutting pressure for a given applied force, cutting easily into the yam fibers. In contrast, a blunt knife has a wider, worn edge with a larger contact area, producing much lower pressure for the same force, making cutting difficult.",
          workedSolution: "Full marks for linking P = F/A, contrasting blade areas, and deriving the resulting pressure difference."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "State three physical differences between metals and non-metals.",
          hint: "Compare electrical/heat conductivity, malleability/ductility, lustre, and state.",
          modelAnswer: "Physical differences [3 marks, any 3]:\n1. Electrical and thermal conductivity: Metals are good conductors of heat and electricity; non-metals are poor conductors (except graphite).\n2. Malleability and ductility: Metals can be hammered into sheets (malleable) and drawn into wires (ductile); solid non-metals are brittle.\n3. Lustre: Metals have a shiny, lustrous appearance when polished; non-metals are generally dull.\n4. Melting and boiling points: Metals generally have high melting points; non-metals typically have low melting points.",
          workedSolution: "1 mark per clear physical contrast (max 3 marks)."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Debeaking, Surface Tension, Noble Metals & Weather",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts (a), (b), (c), and (d) of this question:",
      workedSolution: "See complete worked solutions and marking breakdown below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) What is debeaking in poultry flock management?\n\n(ii) State two economic and welfare reasons why debeaking is practiced in commercial egg production.",
          hint: "Beak trimming to reduce injury and feed loss.",
          modelAnswer: "(i) Debeaking [2 marks]:\nThe partial trimming/cauterization of the upper beak (and lower beak tip) of poultry birds using an electrically heated cauterizing blade.\n\n(ii) Reasons for debeaking [2 marks, any 2]:\n1. To prevent feather pecking, vent pecking, and cannibalism among birds.\n2. To prevent egg-eating habit which leads to economic losses.\n3. To minimize feed wastage caused by birds billing out feed from troughs.",
          workedSolution: "2 marks for definition; 1 mark each for valid economic/welfare justifications."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "(i) A dry, polished steel sewing needle placed horizontally on the calm surface of water floats despite having a density seven times greater than water. Name the force responsible for supporting the needle.\n\n(ii) Name two substances that, when added to the water, will cause the needle to sink immediately.",
          hint: "Liquid surface skin effect and substances that break surface cohesive bonds.",
          modelAnswer: "(i) Force [2 marks]:\nSurface tension (cohesive force among surface water molecules forming an elastic skin).\n\n(ii) Substances causing the needle to sink [2 marks, any 2]:\nSoap solution, liquid detergent, kerosene, alcohol, or oil (surfactants that lower surface tension).",
          workedSolution: "2 marks for naming surface tension; 1 mark each for surfactants."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "(i) Explain why pure gold is preferred to metallic iron for the fabrication of fine jewellery.\n\n(ii) State two technical methods used to prevent the rusting of iron structures exposed to the atmosphere.",
          hint: "Reactivity series, corrosion resistance, and protective coating barriers.",
          modelAnswer: "(i) Preference for gold [2 marks]:\nGold is an unreactive noble metal at the bottom of the reactivity series that does not react with atmospheric oxygen, moisture, or tarnishing gases, retaining its shiny luster indefinitely. Iron readily oxidizes into crumbly rust.\n\n(ii) Methods to prevent rusting [2 marks, any 2]:\n1. Painting or greasing to exclude moisture and air.\n2. Galvanizing (coating iron with a layer of zinc).\n3. Electroplating with unreactive metals (e.g., tin, chromium).\n4. Alloying (e.g., making stainless steel).",
          workedSolution: "2 marks for chemical inertia explanation; 1 mark each for anti-rust methods."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "Name two atmospheric elements of climate and state the scientific instrument used to measure each element.",
          hint: "Temperature, rainfall, pressure, humidity, wind speed.",
          modelAnswer: "Atmospheric elements and instruments [3 marks, any 2 pairs]:\n• Temperature: Thermometer (maximum-minimum thermometer)\n• Rainfall: Rain gauge\n• Relative Humidity: Hygrometer\n• Wind Speed: Anemometer\n• Atmospheric Pressure: Barometer\n• Wind Direction: Wind vane",
          workedSolution: "1.5 marks per correctly paired element and instrument."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Refraction, Iron (II) Sulfide, Digestive Enzymes & Fertilizer Agronomy",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts (a), (b), (c), and (d) of this question:",
      workedSolution: "See complete worked solutions and marking breakdown below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) Define the term refraction of light.\n\n(ii) Describe the path taken by a light ray as it travels obliquely from air into a rectangular glass block.",
          hint: "Bending of light due to velocity change in media of different optical density.",
          modelAnswer: "(i) Refraction of light [2 marks]:\nThe bending or change in direction of a light ray as it passes obliquely from one transparent medium into another of different optical density, caused by a change in wave speed.\n\n(ii) Path of light into glass [2 marks]:\nAs the ray enters the optically denser glass block from air, it slows down and bends toward the normal line (angle of incidence i > angle of refraction r). When it exits the opposite parallel face into air, it bends away from the normal and emerges parallel to the incident ray.",
          workedSolution: "2 marks for definition; 2 marks for describing bending toward normal and exit path."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "Explain why a mixture of iron filings and powdered sulfur can be separated easily with a bar magnet, but cannot be separated after the mixture has been heated strongly to redness.",
          hint: "Physical mixture vs. chemical compound formation.",
          modelAnswer: "Explanation [4 marks]:\nBefore heating, the iron filings and sulfur form a physical mixture in which each constituent retains its individual properties; the ferromagnetic iron is attracted by the magnet while sulfur is left behind. Upon strong heating to redness, an exothermic chemical reaction takes place forming a new chemical compound, iron (II) sulfide (Fe + S → FeS). In this compound, the atoms are chemically bonded, the iron loses its ferromagnetism, and the compound cannot be separated by physical methods.",
          workedSolution: "Full marks for distinguishing physical mixture retention of properties from chemical compound formation with new properties."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "(i) Name two digestive enzymes secreted into the human alimentary canal.\n\n(ii) For each named enzyme in (c)(i), state the specific anatomical organ where it is produced and its substrate food substance.",
          hint: "Amylase, pepsin, trypsin, lipase. Identify gland/organ and food substrate.",
          modelAnswer: "Enzymes, Organs, and Substrates [4 marks, any 2]:\n• Salivary amylase (Ptyalin): Secreted by salivary glands in the mouth; acts on cooked starch, converting it into maltose.\n• Pepsin: Secreted by gastric glands in the stomach wall; acts on proteins, breaking them into peptides.\n• Trypsin: Produced by the pancreas and secreted into the duodenum; breaks down proteins/peptides into amino acids.\n• Pancreatic Lipase: Secreted by the pancreas into the small intestine; hydrolyzes fats and oils into fatty acids and glycerol.",
          workedSolution: "2 marks per complete enzyme profile (name, site of secretion, substrate)."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "List three agronomic methods used by crop farmers to apply chemical fertilizers to cultivated fields.",
          hint: "Broadcasting, placement (side-dressing/ring), foliar spraying.",
          modelAnswer: "Fertilizer application methods [3 marks, any 3]:\n1. Broadcasting: Scattering granular fertilizer evenly over the whole field.\n2. Side-dressing / Band placement: Placing fertilizer in shallow furrows along crop rows.\n3. Ring placement: Applying fertilizer in a circular trench around the base of individual trees or plants.\n4. Foliar spraying: Spraying liquid fertilizer directly onto the leaves of crops.",
          workedSolution: "1 mark per agronomic application method (max 3 marks)."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Chemical Substances, Cardiovascular Diseases, Plant Nutrients & Thermometry",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts (a), (b), (c), and (d) of this question:",
      workedSolution: "See complete worked solutions and marking breakdown below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 3,
          prompt: "Consider the following list of chemical substances:\nCarbon dioxide, Gold, Bronze, Iron, Oxygen, Ink.\nFrom the list, select the substance that:\n\n(i) Strongly supports the combustion of fuels;\n\n(ii) Is an unreactive precious metal used for making jewellery;\n\n(iii) Is a copper-tin alloy traditionally cast into statues and commemorative medals.",
          hint: "Identify the gas supporting combustion, the noble jewellery metal, and the copper-tin alloy.",
          modelAnswer: "Substance selection [3 marks]:\n(i) Supports combustion: Oxygen [1 mark].\n(ii) Unreactive metal for jewellery: Gold [1 mark].\n(iii) Copper-tin alloy: Bronze [1 mark].",
          workedSolution: "1 mark for each correctly matched substance."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "(i) Name two chronic cardiovascular diseases associated with the human circulatory system.\n\n(ii) Outline one clinical or lifestyle practice that helps prevent each of the diseases named in (b)(i).",
          hint: "Hypertension, arteriosclerosis, stroke, coronary heart disease. Diet and exercise.",
          modelAnswer: "Diseases and Prevention [4 marks]:\n• Hypertension (High blood pressure) [1 mark]:\n  Prevention: Regular cardiovascular exercise, reducing dietary sodium (salt), managing stress, avoiding smoking [1 mark].\n• Arteriosclerosis / Coronary Artery Disease [1 mark]:\n  Prevention: Consuming a diet low in saturated fats and cholesterol, maintaining healthy body weight, eating high-fiber foods [1 mark].",
          workedSolution: "1 mark per disease, 1 mark per corresponding lifestyle prevention."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Differentiate between major plant nutrients (macro-nutrients) and minor plant nutrients (micro-nutrients), citing two examples of each.",
          hint: "Quantity required by plants for physiological growth. N, P, K vs. Fe, Zn, B.",
          modelAnswer: "Nutrient differentiation [4 marks]:\n• Macro-nutrients: Essential mineral elements required by plants in relatively large quantities for tissue building and growth (e.g., Nitrogen, Phosphorus, Potassium, Calcium) [2 marks].\n• Micro-nutrients (Trace elements): Essential mineral elements required in very small, minute quantities, mainly serving as enzyme cofactors (e.g., Iron, Zinc, Boron, Copper, Manganese) [2 marks].",
          workedSolution: "2 marks for macro-nutrients with 2 examples; 2 marks for micro-nutrients with 2 examples."
        },
        {
          partLabel: "(d)",
          marks: 4,
          prompt: "(i) State two physical properties of an ideal thermometric liquid used in clinical and laboratory thermometers.\n\n(ii) Name two thermometric liquids commonly employed in glass thermometers.",
          hint: "Uniform thermal expansion, wide liquid range, non-wetting of glass, high visibility.",
          modelAnswer: "(i) Physical properties [2 marks, any 2]:\n1. Expands uniformly and regularly with equal temperature rises.\n2. Does not cling to or wet the glass capillary walls.\n3. Has a wide liquid range (high boiling point and low freezing point).\n4. Opaque and easily visible with a low specific heat capacity.\n\n(ii) Common thermometric liquids [2 marks]:\nMercury and Alcohol (ethanol tinted with red dye).",
          workedSolution: "1 mark per valid physical property; 1 mark per named liquid."
        }
      ]
    }
  ]
};
