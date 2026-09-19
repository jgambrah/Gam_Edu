/**
 * 2016 BECE Integrated Science
 * Paper 2: Practical & Theory Essay Examination (Set 79 Variant)
 *
 * Structure:
 * - Section A (Compulsory Practical Test, 40 marks): Q1 (a, b, c, d)
 * - Section B (Theory Essays, 15 marks each, Answer 4 of 5): Q2, Q3, Q4, Q5, Q6
 * Total Marks: 100 | Time Allowed: 1 hour 15 minutes (75 mins)
 *
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
 */

import { CurriculumQuestionSet } from '../global-curriculum-types';

const svgQ1aSoilDrainage = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 220' width='100%' height='200' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(25, 20)'><polygon points='10,15 70,15 45,55 35,55' fill='#fef08a' opacity='0.7' stroke='#cbd5e1' stroke-width='1.5'/><rect x='37' y='55' width='6' height='25' fill='#cbd5e1'/><text x='40' y='35' font-size='10' font-weight='bold' fill='#854d0e' text-anchor='middle'>Soil K</text><rect x='20' y='75' width='40' height='100' rx='2' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/><rect x='21' y='105' width='38' height='69' fill='#38bdf8' opacity='0.6'/><text x='40' y='190' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cylinder K</text><text x='40' y='145' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>78 cm³</text></g><g transform='translate(145, 20)'><polygon points='10,15 70,15 45,55 35,55' fill='#b45309' opacity='0.6' stroke='#cbd5e1' stroke-width='1.5'/><rect x='37' y='55' width='6' height='25' fill='#cbd5e1'/><text x='40' y='35' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>Soil L</text><rect x='20' y='75' width='40' height='100' rx='2' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/><rect x='21' y='132' width='38' height='42' fill='#38bdf8' opacity='0.6'/><text x='40' y='190' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cylinder L</text><text x='40' y='155' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>45 cm³</text></g><g transform='translate(265, 20)'><polygon points='10,15 70,15 45,55 35,55' fill='#991b1b' opacity='0.6' stroke='#cbd5e1' stroke-width='1.5'/><rect x='37' y='55' width='6' height='25' fill='#cbd5e1'/><text x='40' y='35' font-size='10' font-weight='bold' fill='#fecaca' text-anchor='middle'>Soil M</text><rect x='20' y='75' width='40' height='100' rx='2' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.5'/><rect x='21' y='158' width='38' height='16' fill='#38bdf8' opacity='0.6'/><text x='40' y='190' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Cylinder M</text><text x='40' y='170' font-size='9' font-weight='bold' fill='#ffffff' text-anchor='middle'>18 cm³</text></g></svg></div>`;
const svgQ1bHazardSymbols = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 130' width='100%' height='120' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(25, 20)'><rect x='0' y='0' width='65' height='65' rx='6' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><circle cx='32' cy='28' r='12' fill='#ffffff'/><circle cx='28' cy='26' r='2.5' fill='#0f172a'/><circle cx='36' cy='26' r='2.5' fill='#0f172a'/><rect x='29' y='36' width='6' height='5' fill='#0f172a'/><line x1='16' y1='48' x2='48' y2='48' stroke='#ffffff' stroke-width='3'/><text x='32' y='82' font-size='11' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Symbol I</text></g><g transform='translate(115, 20)'><polygon points='32,4 62,60 2,60' fill='#1e293b' stroke='#ef4444' stroke-width='2'/><line x1='20' y1='22' x2='30' y2='32' stroke='#ffffff' stroke-width='2.5'/><rect x='28' y='48' width='22' height='6' fill='#ffffff'/><circle cx='31' cy='38' r='2' fill='#ef4444'/><circle cx='36' cy='43' r='2' fill='#ef4444'/><text x='32' y='82' font-size='11' font-weight='bold' fill='#ef4444' text-anchor='middle'>Symbol II</text></g><g transform='translate(205, 20)'><rect x='0' y='0' width='65' height='65' rx='6' fill='#1e293b' stroke='#ea580c' stroke-width='2'/><path d='M 32 12 Q 45 28 38 40 Q 48 38 42 52 Q 22 56 22 42 Q 20 28 32 12 Z' fill='#f59e0b' stroke='#ea580c' stroke-width='1.5'/><text x='32' y='82' font-size='11' font-weight='bold' fill='#ea580c' text-anchor='middle'>Symbol III</text></g><g transform='translate(295, 20)'><circle cx='32' cy='32' r='30' fill='#1e293b' stroke='#dc2626' stroke-width='3'/><line x1='18' y1='36' x2='46' y2='36' stroke='#ffffff' stroke-width='3'/><circle cx='18' cy='36' r='3.5' fill='#f59e0b'/><line x1='12' y1='12' x2='52' y2='52' stroke='#dc2626' stroke-width='3.5'/><text x='32' y='82' font-size='11' font-weight='bold' fill='#dc2626' text-anchor='middle'>Symbol IV</text></g></svg></div>`;
const svgQ1cSimpleMachines = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 500px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(15, 20)'><circle cx='18' cy='65' r='8' fill='#3b82f6' stroke='#1d4ed8' stroke-width='1.5'/><line x1='18' y1='65' x2='82' y2='35' stroke='#94a3b8' stroke-width='3'/><polygon points='30,55 70,38 65,65 35,68' fill='#ef4444' opacity='0.7' stroke='#b91c1c' stroke-width='1.5'/><circle cx='82' cy='35' r='3' fill='#10b981'/><text x='45' y='110' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Device A</text></g><g transform='translate(110, 20)'><polygon points='10,65 75,65 75,20' fill='#334155' stroke='#64748b' stroke-width='1.5'/><line x1='10' y1='65' x2='75' y2='20' stroke='#f59e0b' stroke-width='2.5'/><line x1='18' y1='52' x2='58' y2='25' stroke='#10b981' stroke-width='2'/><polygon points='54,20 64,21 59,30' fill='#10b981'/><text x='45' y='110' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Device B</text></g><g transform='translate(205, 20)'><line x1='40' y1='10' x2='40' y2='25' stroke='#cbd5e1' stroke-width='2'/><circle cx='40' cy='35' r='14' fill='#1e293b' stroke='#38bdf8' stroke-width='2'/><path d='M 26 35 L 26 70' stroke='#cbd5e1' stroke-width='1.5'/><path d='M 54 35 L 54 70' stroke='#cbd5e1' stroke-width='1.5'/><rect x='18' y='70' width='16' height='16' rx='2' fill='#ef4444'/><text x='40' y='110' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Device C</text></g><g transform='translate(295, 20)'><circle cx='28' cy='45' r='16' fill='#1e293b' stroke='#a855f7' stroke-width='2' stroke-dasharray='4,2'/><circle cx='28' cy='45' r='5' fill='#a855f7'/><circle cx='55' cy='32' r='12' fill='#1e293b' stroke='#ec4899' stroke-width='2' stroke-dasharray='4,2'/><circle cx='55' cy='32' r='4' fill='#ec4899'/><text x='42' y='110' font-size='12' font-weight='bold' fill='#c084fc' text-anchor='middle'>Device D</text></g></svg></div>`;
const svgQ1dDigestiveSystem = `<div class="my-4 flex justify-center"><svg viewBox='0 0 340 240' width='100%' height='220' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><path d='M 170 15 L 170 65' stroke='#cbd5e1' stroke-width='6'/><line x1='173' y1='40' x2='260' y2='40' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='265' y='44' font-size='12' font-weight='bold' fill='#cbd5e1'>V</text><path d='M 170 65 C 130 65 125 115 165 115 C 195 115 200 80 170 65 Z' fill='#881337' stroke='#f43f5e' stroke-width='2'/><line x1='135' y1='88' x2='60' y2='88' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='92' font-size='12' font-weight='bold' fill='#f43f5e' text-anchor='end'>I</text><path d='M 125 120 L 125 180 L 215 180 L 215 120 L 125 120' fill='none' stroke='#38bdf8' stroke-width='8'/><line x1='219' y1='145' x2='260' y2='145' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='265' y='149' font-size='12' font-weight='bold' fill='#38bdf8'>III</text><path d='M 140 135 Q 170 125 190 140 Q 150 160 180 170' fill='none' stroke='#f59e0b' stroke-width='5'/><line x1='140' y1='155' x2='60' y2='155' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='55' y='159' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='end'>II</text><rect x='164' y='184' width='12' height='24' fill='#cbd5e1' stroke='#94a3b8'/><line x1='176' y1='196' x2='240' y2='196' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='245' y='200' font-size='12' font-weight='bold' fill='#cbd5e1'>IV</text></svg></div>`;

export const SET_BECE_2016_SCIENCE_P2: CurriculumQuestionSet = {
  id: "paper_2016_variant_p2",
  title: "2016 BECE Integrated Science Practical & Theory Examination (Set 79)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2016 BECE Practical & Theory Essay Test",
  variantType: "past_paper_variant",
  year: 2016,
  paperType: 2,
  setNumber: 79,
  era: "2016 BECE Standards",
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
          diagramSvg: svgQ1aSoilDrainage,
          prompt: `An experiment was set up to compare the drainage ability and water-holding capacity of three distinct soil types labelled K, L, and M. Equal masses ($100\\text{ g}$) of dry soil were placed into filter funnels lined with cotton wool, and equal volumes ($100\\text{ cm}^3$) of water were poured onto each soil at the same time and allowed to drain for 20 minutes into graduated cylinders as illustrated below:

${svgQ1aSoilDrainage}

(i) What is the scientific aim of this experimental investigation?

(ii) Which of the soil samples (K, L, or M) exhibited the highest rate of water drainage?

(iii) Which soil sample has the highest water retention (water-holding) capacity?

(iv) Identify the soil sample that is most likely to dry out and lose water rapidly following rainfall.

(v) Which of the soils is most susceptible to severe waterlogging under prolonged precipitation?

(vi) Deduce which of the three soils (K, L, or M) is most suitable for commercial maize cultivation.`,
          hint: "Evaluate the volume of drained water in each cylinder: Soil K collected 78 cm³, Soil L collected 45 cm³, and Soil M collected 18 cm³.",
          modelAnswer: `(i) Scientific aim of experiment [2 marks]:
To compare the water drainage ability (permeability) and water-holding (retention) capacity of three different soil types.

(ii) Soil with highest rate of water drainage [1 mark]:
Soil K (it collected the largest volume of water in the cylinder: $78\\text{ cm}^3$).

(iii) Soil with highest water retention capacity [2 marks]:
Soil M (it retained the greatest amount of water, allowing only $18\\text{ cm}^3$ of water to drain through: $100 - 18 = 82\\text{ cm}^3$ retained).

(iv) Soil that dries out most rapidly [1 mark]:
Soil K (coarse sandy soil with large macro-pores that drains gravitational water very quickly).

(v) Soil most susceptible to waterlogging [2 marks]:
Soil M (heavy clay soil with fine micro-pores that hold water tenaciously and impede downward percolation).

(vi) Soil most suitable for maize cultivation [2 marks]:
Soil L (loamy soil, which provides balanced drainage, good aeration, and adequate water/nutrient retention without becoming waterlogged).`,
          workedSolution: "Full marks awarded for correct identification of drainage trends, retention capacities, and agronomic justification for loamy soil."
        },
        {
          partLabel: "(b)",
          marks: 10,
          diagramSvg: svgQ1bHazardSymbols,
          prompt: `The diagrams below illustrate standard international hazard warning symbols labelled I, II, III, and IV:

${svgQ1bHazardSymbols}

(i) State what each of the hazard warning symbols labelled I, II, III, and IV represents.

(ii) Name one hazardous chemical substance typically associated with:
  (α) Symbol I;
  (β) Symbol II;
  (γ) Symbol III.

(iii) Name one public or commercial facility where the safety prohibition symbol labelled IV is mandatorily displayed.

(iv) Identify which of the symbols (I, II, III, or IV) are routinely found on commercial laboratory chemical reagent containers.`,
          hint: "Identify the skull-and-crossbones, corrosive liquid attacking surface, open flame, and the prohibition ban on naked matches.",
          modelAnswer: `(i) Meaning of symbols [4 marks]:
• Symbol I: Toxic / Poisonous substance (Danger of death or serious acute poisoning).
• Symbol II: Corrosive substance (Attacks and destroys living tissues and metals).
• Symbol III: Highly flammable / Combustible substance (Ignites readily in air).
• Symbol IV: Prohibition symbol: No naked flames / No smoking permitted.

(ii) Associated chemical substances [3 marks]:
• (α) Symbol I (Toxic): Potassium cyanide ($KCN$), Mercury(II) chloride, or organophosphate pesticides.
• (β) Symbol II (Corrosive): Concentrated sulfuric acid ($H_2SO_4$), concentrated hydrochloric acid ($HCl$), or concentrated sodium hydroxide ($NaOH$).
• (γ) Symbol III (Flammable): Pure ethanol, kerosene, petrol (gasoline), or liquefied petroleum gas (LPG).

(iii) Facility displaying Symbol IV [1 mark]:
Commercial fuel filling stations (petrol stations), LPG gas bottling plants, chemical fuel storage depots, or paint manufacturing warehouses.

(iv) Symbols found on laboratory chemical reagent bottles [2 marks]:
Symbols I, II, and III.`,
          workedSolution: "4 marks for hazard meanings, 3 marks for chemical examples, 1 mark for mandatory display location, 2 marks for laboratory reagent symbols."
        },
        {
          partLabel: "(c)",
          marks: 10,
          diagramSvg: svgQ1cSimpleMachines,
          prompt: `The diagrams below illustrate mechanical devices and simple machines (A, B, C, and D) used to perform work efficiently:

${svgQ1cSimpleMachines}

(i) What general engineering term is given to mechanical devices of this nature?

(ii) Identify each of the specific machines labelled A, B, C, and D.

(iii) When Device A is evaluated as a lever, identify the parts representing:
  (α) The Pivot (Fulcrum);
  (β) The Load;
  (γ) The Effort.

(iv) What physical quantity does the green arrow along the slope represent in Device B?

(v) Name the primary mechanical function or useful work accomplished using:
  (α) Device C;
  (β) Device D.`,
          hint: "Identify the wheelbarrow as a second-class lever, inclined ramp, fixed pulley, and interlocking toothed gear wheels.",
          modelAnswer: `(i) General engineering term [1 mark]:
Simple machines (or mechanical mechanisms).

(ii) Identification of machines [4 marks]:
• Device A: Wheelbarrow (Class 2 lever)
• Device B: Inclined plane (ramp)
• Device C: Single fixed pulley
• Device D: Spur gears (interlocking toothed wheels)

(iii) Lever components of Device A (Wheelbarrow) [3 marks]:
• (α) Pivot (Fulcrum): The front wheel axle.
• (β) Load: The central metal tray / hopper holding the materials.
• (γ) Effort: The rear lifting handles operated by human hands.

(iv) Physical quantity in Device B [1 mark]:
The displacement distance along the inclined surface through which the effort force acts (effort distance / direction of applied effort).

(v) Primary mechanical function [1 mark]:
• (α) Device C (Fixed Pulley): Changes the direction of an applied effort force, allowing a heavy load to be raised vertically by pulling downward.
• (β) Device D (Gears): Transmits rotational mechanical energy between shafts, altering rotational speed, torque (turning force), or direction of rotation.`,
          workedSolution: "1 mark for term, 4 marks for machine names, 3 marks for lever points, 1 mark for effort vector, 1 mark for functions."
        },
        {
          partLabel: "(d)",
          marks: 10,
          diagramSvg: svgQ1dDigestiveSystem,
          prompt: `The diagram below illustrates the human alimentary canal (digestive system):

${svgQ1dDigestiveSystem}

(i) Name each of the anatomical organs labelled I, II, III, IV, and V.

(ii) Name the specific organ(s) where:
  (α) Chemical and mechanical digestion of proteins takes place;
  (β) Completely digested soluble nutrients are absorbed into the bloodstream.

(iii) Name three monomeric end-products of digestion that are absorbed directly across the intestinal mucosa into the mesenteric capillaries and lacteals.`,
          hint: "Trace the alimentary canal from the gullet down to the stomach, small intestine, large intestine, and rectum.",
          modelAnswer: `(i) Names of anatomical organs [5 marks]:
• I: Stomach
• II: Small intestine (duodenum / ileum)
• III: Large intestine (colon)
• IV: Rectum
• V: Oesophagus (gullet)

(ii) Specific organ sites [2 marks]:
• (α) Protein digestion: Stomach (Part I, by pepsin in acidic gastric juice) and Small intestine (Part II, by trypsin and erepsin in alkaline juice).
• (β) Absorption of digested nutrients: Small intestine (Part II, through the villi and microvilli of the ileum).

(iii) Monomeric end-products of digestion [3 marks]:
1. Glucose (and other monosaccharides such as fructose and galactose from carbohydrates).
2. Amino acids (from proteins).
3. Fatty acids and Glycerol (from dietary fats and lipids, absorbed into lacteals).`,
          workedSolution: "5 marks for organ identification, 2 marks for digestion/absorption sites, 3 marks for end-products."
        }
      ]
    },

    // ==========================================
    // SECTION B: THEORY & ESSAY QUESTIONS (ANSWER 4 ONLY)
    // ==========================================
    {
      id: "q02",
      title: "Question 2: Meteorology, Water Properties & Soil Profiles",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for weather instruments, 4 marks for mosquito life cycle, 4 marks for water properties and soft water benefits, 3 marks for soil profile extension uses.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "Name four scientific instruments used in meteorological stations to measure weather elements.",
          hint: "Think of instruments measuring temperature, rainfall, wind velocity, wind direction, atmospheric pressure, and humidity.",
          modelAnswer: `Four meteorological instruments [1 mark each, any 4]:
1. Thermometer (Maximum-Minimum thermometer for atmospheric temperature).
2. Rain gauge (for precipitation / rainfall depth in mm).
3. Anemometer (for measuring wind speed / velocity).
4. Wind vane (for indicating wind direction).
5. Hygrometer / Psychrometer (for measuring relative humidity).
6. Barometer (for measuring atmospheric air pressure).`,
          workedSolution: "1 mark for each valid weather instrument named with its corresponding element."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "List the four distinct developmental stages in the life cycle of a mosquito in sequential order.",
          hint: "Complete metamorphosis involves an aquatic egg, feeding wiggler, active tumbler, and airborne adult.",
          modelAnswer: `Sequential stages in mosquito life cycle [1 mark each]:
1. Egg stage (laid in rafts or singly on stagnant water surfaces)
2. Larval stage (wiggler, feeds actively in water using siphon tube)
3. Pupal stage (tumbler, comma-shaped non-feeding stage)
4. Adult stage (imago, winged airborne insect capable of reproduction)`,
          workedSolution: "Award 1 mark per sequential stage. Deduct 1 mark if sequential chronological order is violated."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "(i) State two physical properties of pure water.\n\n(ii) Explain why it is advantageous to launder clothes using soft water rather than hard water.",
          hint: "Recall standard freezing and boiling points, density at 4°C, and how soft water reacts with soap.",
          modelAnswer: `(i) Physical properties of pure water [2 marks, any 2]:
• It is a clear, colourless, odourless, and tasteless liquid at room temperature.
• It has a standard freezing point of $0^\\circ\\text{C}$ and a boiling point of $100^\\circ\\text{C}$ at standard atmospheric pressure ($1\\text{ atm}$ / $760\\text{ mmHg}$).
• It achieves its maximum density of $1.0\\text{ g cm}^{-3}$ ($1000\\text{ kg m}^{-3}$) at $4^\\circ\\text{C}$.

(ii) Advantage of soft water in laundering [2 marks]:
Soft water is free from dissolved calcium and magnesium ions ($Ca^{2+}$ and $Mg^{2+}$). Therefore, soap lathers readily and profusely without forming sticky insoluble grey scum ($\\text{calcium stearate}$), which saves soap, avoids fabric staining, and cleans garments more effectively.`,
          workedSolution: "2 marks for physical properties, 2 marks for explanation of lathering without scum formation."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "State three ways in which studying the soil profile of a farmland helps an agricultural extension officer guide farmers.",
          hint: "Consider topsoil depth, drainage layers, hardpans, and root penetration depths.",
          modelAnswer: `Three benefits of studying the soil profile [1 mark each, any 3]:
1. Assessing the depth of the fertile topsoil (Horizon A) to determine whether it can support deep-rooted perennial crops or only shallow-rooted annuals.
2. Evaluating subsoil permeability and drainage to detect impermeable clay hardpans that cause waterlogging.
3. Determining the depth of the underground water table to prevent root rot in flood-prone zones.
4. Guiding proper fertilizer application and soil conditioning based on organic matter distribution across horizons.`,
          workedSolution: "Award 1 mark for each scientifically sound agricultural application."
        }
      ]
    },

    {
      id: "q03",
      title: "Question 3: Heat Transfer, Human Nutrition & Soil Degradation",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 3 marks for heat transfer modes, 5 marks for nutritional deficiency diseases, 4 marks for soil nutrient depletion, 3 marks for physical phase transitions.",
      parts: [
        {
          partLabel: "(a)",
          marks: 3,
          prompt: "Name the three physical modes by which thermal heat energy travels from one point to another in matter and space.",
          hint: "Think of molecular vibration in solids, fluid convection currents, and electromagnetic waves.",
          modelAnswer: `Three modes of heat transfer [1 mark each]:
1. Conduction: Transfer of thermal energy through solids by lattice vibrations and free electron collisions without macroscopic movement of the matter.
2. Convection: Transfer of heat in fluids (liquids and gases) via the bulk circulation of heated fluid currents driven by density differences.
3. Radiation: Transfer of heat through electromagnetic infrared waves that can propagate across a vacuum without needing a material medium.`,
          workedSolution: "1 mark each for conduction, convection, and radiation with accurate physical descriptions."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "(i) What is a nutritional deficiency disease?\n\n(ii) Name three deficiency diseases in humans and state the deficient nutrient responsible for each.",
          hint: "Recall disorders caused by a lack of proteins, vitamin C, vitamin D/calcium, or iodine.",
          modelAnswer: `(i) Definition of nutritional deficiency disease [2 marks]:
A pathological disorder caused by the prolonged lack or inadequate intake of one or more essential nutrients (proteins, vitamins, or mineral salts) in the diet.

(ii) Deficiency diseases and deficient nutrients [3 marks, 1 mark per pair]:
• Kwashiorkor: Caused by severe dietary deficiency of protein.
• Scurvy: Caused by deficiency of Vitamin C (ascorbic acid).
• Rickets: Caused by deficiency of Vitamin D or calcium.
• Endemic Goiter: Caused by deficiency of the trace mineral iodine.
• Nutritional Anaemia: Caused by deficiency of dietary iron.`,
          workedSolution: "2 marks for clear definition, 3 marks for three correctly matched pairs of disease and deficient nutrient."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Explain two distinct ways in which each of the following agricultural and environmental factors causes depletion of soil nutrients:\n\n(i) Uncontrolled bush burning;\n\n(ii) Excessive rainwater leaching.",
          hint: "Consider volatilization of nitrogen/sulfur, destruction of humus/soil microbes, and the dissolution of soluble mineral salts downward beyond roots.",
          modelAnswer: `(i) Depletion by uncontrolled bush burning [2 marks]:
1. Volatilization: High combustion temperatures volatilize vital organic nutrients like nitrogen and sulfur into atmospheric gases ($N_2, SO_2$), removing them permanently from the soil.
2. Destruction of organic matter and microbes: Fires incinerate topsoil leaf litter (humus) and kill beneficial nitrifying bacteria and earthworms that break down organic matter into available plant nutrients.

(ii) Depletion by excessive rainwater leaching [2 marks]:
1. Downward wash of soluble salts: Heavy percolating rainwater dissolves soluble macronutrients (nitrates, potassium, magnesium) and carries them deep into the subsoil beyond the reach of crop roots.
2. Soil acidification: Leaching removes basic exchangeable cations ($Ca^{2+}, Mg^{2+}, K^+$), replacing them with acidic hydrogen ($H^+$) and aluminum ($Al^{3+}$) ions, reducing soil nutrient availability.`,
          workedSolution: "2 marks for bush burning explanations, 2 marks for leaching explanations."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "List three physical processes by which matter transforms from one physical state into another.",
          hint: "Think of changes between solid, liquid, and gas phases.",
          modelAnswer: `Three physical phase change processes [1 mark each, any 3]:
1. Melting (Fusion): Transition from solid to liquid upon absorbing latent heat.
2. Vaporization (Evaporation / Boiling): Transition from liquid to gas/vapour.
3. Condensation (Liquefaction): Transition from gas to liquid upon cooling.
4. Freezing (Solidification): Transition from liquid to solid.
5. Sublimation: Direct transition from solid to gas without entering the liquid phase.`,
          workedSolution: "1 mark each for naming 3 valid thermodynamic phase transformations."
        }
      ]
    },

    {
      id: "q04",
      title: "Question 4: Satellite Physics, Engineering Alloys & Vegetable Agronomy",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 5 marks for satellites, 3 marks for alloy compositions, 3 marks for post-planting practices, 4 marks for respiratory tract organs.",
      parts: [
        {
          partLabel: "(a)",
          marks: 5,
          prompt: "(i) Define the term astronomical satellite.\n\n(ii) State three technological and scientific uses of artificial earth satellites.",
          hint: "Differentiate between natural celestial bodies and artificial spacecraft orbiting planets, then think of GPS, weather, and telecommunications.",
          modelAnswer: `(i) Definition of satellite [2 marks]:
A natural celestial body (such as the Moon) or a manufactured artificial spacecraft that moves in a stable curved orbit around a larger planet under gravitational attraction.

(ii) Three uses of artificial satellites [3 marks, 1 mark each]:
1. Telecommunications: Relaying global telephone calls, television broadcasts, and high-speed internet data across continents.
2. Navigation: Providing precise spatial coordinates and real-time positioning via Global Positioning System (GPS) for marine, aviation, and road transport.
3. Meteorological forecasting: Monitoring global cloud patterns, atmospheric temperatures, and tracking severe cyclonic storms.
4. Earth observation and remote sensing: Mapping natural mineral resources, monitoring agricultural crop health, and tracking environmental deforestation.`,
          workedSolution: "2 marks for satellite definition, 3 marks for 3 distinct technological applications."
        },
        {
          partLabel: "(b)",
          marks: 3,
          prompt: "State the elemental chemical composition of each of the following commercial engineering alloys:\n\n(i) Brass;\n\n(ii) Carbon steel;\n\n(iii) Bronze.",
          hint: "Recall the constituent metals for each alloy (copper, zinc, tin, iron, carbon).",
          modelAnswer: `Elemental composition of alloys [1 mark each]:
(i) Brass: An alloy of Copper (Cu) and Zinc (Zn).
(ii) Carbon steel: An alloy of Iron (Fe) and Carbon (C).
(iii) Bronze: An alloy of Copper (Cu) and Tin (Sn).`,
          workedSolution: "1 mark per correct alloy composition."
        },
        {
          partLabel: "(c)",
          marks: 3,
          prompt: "Name three post-planting cultural field practices routinely carried out on a vegetable farm to ensure optimal yield.",
          hint: "Think of field care practices after transplanting seedlings, such as mulching, weeding, staking, pruning, and thinning.",
          modelAnswer: `Three post-planting cultural practices [1 mark each, any 3]:
1. Mulching / Weeding: Applying dry grass or plastic mulch to suppress weed competition, conserve soil moisture, and regulate root temperature.
2. Pruning: Removing excessive, dead, or diseased shoots and suckers to direct photosynthates to developing fruits.
3. Staking: Supporting climbing or weak-stemmed crops (e.g., tomatoes, sweet peppers) with bamboo stakes to keep fruits off the ground and avoid disease.
4. Thinning out: Removing overcrowded or sickly seedlings to reduce competition for sunlight, water, and nutrients.`,
          workedSolution: "1 mark each for naming and briefly describing 3 recognized cultural agronomic practices."
        },
        {
          partLabel: "(d)",
          marks: 4,
          prompt: "List four anatomical organs or structures that make up the human respiratory tract.",
          hint: "Trace the airflow path from the nostrils into the lungs.",
          modelAnswer: `Four organs of the human respiratory tract [1 mark each, any 4]:
1. Nasal cavity (nostrils / nasal passages)
2. Pharynx / Larynx (voice box)
3. Trachea (windpipe)
4. Bronchi (primary bronchus branches)
5. Bronchioles
6. Alveoli (alveolar air sacs)
7. Diaphragm / Intercostal muscles`,
          workedSolution: "1 mark each for naming 4 valid respiratory tract structures."
        }
      ]
    },

    {
      id: "q05",
      title: "Question 5: Force Dynamics, Chemical Thermodynamics & Circulatory Pathologies",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for force dynamics, 5 marks for chemical vs. physical changes, 3 marks for soil properties, 3 marks for circulatory disorders.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) Define a physical force in mechanics.\n\n(ii) State two specific dynamic effects that an applied unbalanced force can produce on a physical body.",
          hint: "Force is a push or pull that alters motion ($F = ma$); recall what happens to velocity, direction, or shape.",
          modelAnswer: `(i) Definition of force [2 marks]:
A physical agent or influence in the form of a push or pull that changes or tends to change an object's state of rest or uniform motion in a straight line ($F = ma$).

(ii) Two dynamic effects on a body [2 marks, any 2]:
• It can cause a stationary object to start moving (acceleration from rest).
• It can increase or decrease the speed of an already moving object (acceleration or deceleration).
• It can change the direction of motion of a moving body.
• It can alter the shape, volume, or dimensions of an object (elastic or plastic deformation).`,
          workedSolution: "2 marks for force definition, 2 marks for 2 valid physical effects."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "(i) What is a chemical change?\n\n(ii) In a tabular format, state three fundamental differences between a chemical change and a physical change.",
          hint: "Chemical changes create new substances with broken/formed covalent or ionic bonds, whereas physical changes are easily reversible.",
          modelAnswer: `(i) Definition of chemical change [2 marks]:
A chemical reaction in which chemical bonds between reactant atoms are broken and new bonds are formed, yielding one or more entirely new substances with different chemical properties, usually accompanied by significant energy changes and being irreversible by physical means.

(ii) Differences Table [3 marks, 1 mark per row]:

| Feature | Chemical Change | Physical Change |
| :--- | :--- | :--- |
| **New Substance Formation** | Entirely new chemical substances are synthesized | No new chemical substance is formed |
| **Reversibility** | Usually permanent and irreversible by simple physical methods | Readily reversible by reversing physical conditions |
| **Energy Change** | Substantial heat, light, or sound energy is absorbed or liberated | Little or negligible energy change occurs |
| **Bonding** | Involves breaking and making of chemical (covalent/ionic) bonds | Only intermolecular forces are rearranged; chemical bonds remain intact |`,
          workedSolution: "2 marks for definition, 3 marks for 3 distinct, accurately contrasted table rows."
        },
        {
          partLabel: "(c)",
          marks: 3,
          prompt: "Name three physical properties of agricultural soil that determine its productivity.",
          hint: "Consider particle proportions, ped arrangement, pore spaces, and drainage characteristics.",
          modelAnswer: `Three physical properties of soil [1 mark each, any 3]:
1. Soil Texture: The relative proportion of sand, silt, and clay mineral particles.
2. Soil Structure: The arrangement and aggregation of individual soil particles into peds or crumbs.
3. Soil Porosity and Permeability: The size, continuity, and volume fraction of pore spaces holding air and capillary water.
4. Soil Depth: The thickness of the cultivable topsoil layer.
5. Soil Temperature and Bulk Density.`,
          workedSolution: "1 mark each for naming 3 recognized physical properties of soil."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "Mention three clinical diseases or disorders associated with the human circulatory system.",
          hint: "Recall cardiovascular conditions such as high blood pressure, plaque accumulation in arteries, heart attack, and stroke.",
          modelAnswer: `Three circulatory system diseases/disorders [1 mark each, any 3]:
1. Hypertension (persistently elevated systemic arterial blood pressure).
2. Arteriosclerosis / Atherosclerosis (narrowing and hardening of arterial walls by atheromatous cholesterol plaques).
3. Coronary thrombosis / Myocardial infarction (heart attack caused by obstruction of coronary arteries).
4. Stroke (cerebrovascular accident resulting from interruption of cerebral blood supply).
5. Sickle cell disease (genetic red blood cell disorder leading to vaso-occlusive crises and haemolysis).`,
          workedSolution: "1 mark each for mentioning 3 valid circulatory pathologies."
        }
      ]
    },

    {
      id: "q06",
      title: "Question 6: IUPAC Chemical Nomenclature, Lab Instruments & Plant Reproduction",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all sub-questions (a), (b), (c), and (d).",
      workedSolution: "Full scoring criteria: 4 marks for chemical names, 4 marks for laboratory tools, 3 marks for farm site selection, 4 marks for flowering plant life cycle stages.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "Write down the systematic IUPAC chemical name for each of the following inorganic compounds:\n\n(i) $\\text{H}_2\\text{O}$;\n\n(ii) $\\text{MgO}$;\n\n(iii) $\\text{CaO}$;\n\n(iv) $\\text{CaCl}_2$.",
          hint: "Apply IUPAC naming rules for binary compounds of hydrogen, magnesium, and calcium.",
          modelAnswer: `Systematic chemical names [1 mark each]:
• (i) $\\text{H}_2\\text{O}$: Dihydrogen monoxide (or Hydrogen oxide)
• (ii) $\\text{MgO}$: Magnesium oxide
• (iii) $\\text{CaO}$: Calcium oxide
• (iv) $\\text{CaCl}_2$: Calcium chloride`,
          workedSolution: "1 mark per correct systematic chemical name."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "Name the precise laboratory measuring instrument used to determine each of the following physical quantities:\n\n(i) Length of a copper electrical wire;\n\n(ii) Gravitational mass of a mineral stone;\n\n(iii) Temperature of an aqueous acid solution;\n\n(iv) Exact volume of a clear liquid filtrate.",
          hint: "Select standard laboratory instruments for linear measurement, mass, temperature, and volume.",
          modelAnswer: `Laboratory instruments [1 mark each]:
(i) Length of wire: Metre rule (or vernier caliper / micrometer screw gauge for diameter).
(ii) Gravitational mass of stone: Electronic top-pan balance (or beam balance).
(iii) Temperature of solution: Laboratory mercury-in-glass (or alcohol) thermometer.
(iv) Volume of liquid filtrate: Graduated measuring cylinder (or volumetric pipette / burette).`,
          workedSolution: "1 mark per correctly matched laboratory instrument."
        },
        {
          partLabel: "(c)",
          marks: 3,
          prompt: "List three critical agronomic and infrastructural factors considered when selecting a site for commercial vegetable crop production.",
          hint: "Consider water availability, soil type, transport accessibility, and slope/topography.",
          modelAnswer: `Three factors for site selection [1 mark each, any 3]:
1. Reliable Water Supply: Proximity to a perennial river, stream, borehole, or dam for irrigation, especially during dry seasons.
2. Soil Quality: Deep, well-drained, fertile sandy-loam soil rich in organic matter with a neutral to slightly acidic pH ($6.0 - 6.8$).
3. Road Accessibility and Market Proximity: Nearness to good motorable feeder roads and urban consumer markets to prevent post-harvest spoilage of perishable produce.
4. Topography: Gently sloping terrain that facilitates water drainage without causing severe topsoil erosion.`,
          workedSolution: "1 mark each for 3 valid agronomic and infrastructural criteria."
        },
        {
          partLabel: "(d)",
          marks: 4,
          prompt: "List four developmental stages in the life cycle of a flowering plant.",
          hint: "Trace from seed germination through vegetative growth, flowering, fertilization, and seed dispersal.",
          modelAnswer: `Four stages in the life cycle of a flowering plant [1 mark each, any 4]:
1. Seed germination and seedling emergence.
2. Vegetative growth (development of roots, stems, and foliage).
3. Floral bud initiation and flowering (anthesis).
4. Pollination and fertilization (gamete fusion).
5. Fruit and seed development followed by seed dispersal.`,
          workedSolution: "1 mark each for 4 sequential developmental phases."
        }
      ]
    }
  ]
};
