/**
 * 2015 BECE Integrated Science
 * Paper 2: Practical & Theory Essay Examination (Set 77 Variant)
 *
 * Structure:
 * - Section A (Compulsory Practical Test, 40 marks): Q1 (a, b, c, d)
 * - Section B (Theory Essays, 15 marks each, Answer 4 of 5): Q2, Q3, Q4, Q5, Q6
 * Total Marks: 100 | Time Allowed: 1 hour 15 minutes (75 mins)
 *
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
 */

import { CurriculumQuestionSet } from '../global-curriculum-types';

const svgQ1aParasitesVar = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(25, 25)'><ellipse cx='35' cy='60' rx='20' ry='28' fill='#cbd5e1' stroke='#475569' stroke-width='1.8'/><ellipse cx='35' cy='26' rx='12' ry='10' fill='#94a3b8' stroke='#475569' stroke-width='1.5'/><circle cx='35' cy='12' r='7' fill='#64748b' stroke='#334155'/><path d='M 23 26 L 5 18 L 2 24' fill='none' stroke='#334155' stroke-width='2'/><path d='M 47 26 L 65 18 L 68 24' fill='none' stroke='#334155' stroke-width='2'/><path d='M 20 45 L 3 48 L 2 55' fill='none' stroke='#334155' stroke-width='2'/><path d='M 50 45 L 67 48 L 68 55' fill='none' stroke='#334155' stroke-width='2'/><text x='35' y='118' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Organism I</text></g><g transform='translate(150, 25)'><ellipse cx='40' cy='52' rx='14' ry='22' fill='#d97706' stroke='#78350f' stroke-width='1.5'/><circle cx='40' cy='25' r='10' fill='#b45309'/><line x1='40' y1='15' x2='40' y2='3' stroke='#dc2626' stroke-width='2'/><polygon points='34,35 46,35 44,85 36,85' fill='#fef3c7' opacity='0.7' stroke='#92400e'/><line x1='30' y1='35' x2='12' y2='25' stroke='#451a03' stroke-width='1.5'/><line x1='50' y1='35' x2='68' y2='25' stroke='#451a03' stroke-width='1.5'/><line x1='28' y1='50' x2='10' y2='65' stroke='#451a03' stroke-width='1.5'/><line x1='52' y1='50' x2='70' y2='65' stroke='#451a03' stroke-width='1.5'/><text x='40' y='118' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Organism II</text></g><g transform='translate(265, 15)'><circle cx='35' cy='20' r='9' fill='#f8fafc' stroke='#475569' stroke-width='1.8'/><circle cx='31' cy='18' r='2' fill='#0284c7'/><circle cx='39' cy='18' r='2' fill='#0284c7'/><path d='M 35 29 C 15 45 60 65 30 85 C 10 100 55 115 35 130' fill='none' stroke='#e2e8f0' stroke-width='6'/><path d='M 35 29 C 15 45 60 65 30 85 C 10 100 55 115 35 130' fill='none' stroke='#475569' stroke-width='6' stroke-dasharray='2,3'/><text x='35' y='152' font-size='12' font-weight='bold' fill='#34d399' text-anchor='middle'>Organism III</text></g></svg></div>`;
const svgQ1bReflection = `<div class="my-4 flex justify-center"><svg viewBox='0 0 360 210' width='100%' height='190' style='max-width: 450px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='40' y1='130' x2='320' y2='130' stroke='#38bdf8' stroke-width='2.5'/><text x='40' y='122' font-size='11' font-weight='bold' fill='#38bdf8'>M</text><text x='320' y='122' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='end'>M'</text><line x1='50' y1='130' x2='42' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='80' y1='130' x2='72' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='110' y1='130' x2='102' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='140' y1='130' x2='132' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='170' y1='130' x2='162' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='200' y1='130' x2='192' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='230' y1='130' x2='222' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='260' y1='130' x2='252' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='290' y1='130' x2='282' y2='140' stroke='#64748b' stroke-width='1.2'/><line x1='315' y1='130' x2='307' y2='140' stroke='#64748b' stroke-width='1.2'/><g transform='translate(85, 60)'><rect x='-6' y='20' width='12' height='50' fill='#f1f5f9' stroke='#94a3b8' stroke-width='1.5'/><path d='M 0 20 Q -4 10 0 0 Q 4 10 0 20 Z' fill='#f59e0b'/><text x='0' y='-8' font-size='10' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Object</text></g><line x1='180' y1='30' x2='180' y2='130' stroke='#94a3b8' stroke-width='1.5' stroke-dasharray='4,4'/><text x='185' y='45' font-size='11' font-weight='bold' fill='#94a3b8'>II</text><line x1='85' y1='60' x2='180' y2='130' stroke='#ef4444' stroke-width='2'/><polygon points='130,95 137,97 135,90' fill='#ef4444'/><text x='115' y='80' font-size='11' font-weight='bold' fill='#ef4444'>I</text><line x1='180' y1='130' x2='275' y2='60' stroke='#10b981' stroke-width='2'/><polygon points='230,90 232,97 225,95' fill='#10b981'/><text x='250' y='80' font-size='11' font-weight='bold' fill='#10b981'>III</text><path d='M 180 100 A 30 30 0 0 0 160 115' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='162' y='105' font-size='10' font-weight='bold' fill='#f59e0b'>θ₁</text><path d='M 180 100 A 30 30 0 0 1 200 115' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='192' y='105' font-size='10' font-weight='bold' fill='#f59e0b'>θ₂</text><g transform='translate(275, 130)'><rect x='-6' y='0' width='12' height='50' fill='none' stroke='#94a3b8' stroke-width='1.5' stroke-dasharray='3,3'/><path d='M 0 50 Q -4 60 0 70 Q 4 60 0 50 Z' fill='none' stroke='#f59e0b' stroke-width='1.5' stroke-dasharray='2,2'/><text x='0' y='65' font-size='11' font-weight='bold' fill='#94a3b8' text-anchor='middle'>IV</text></g></svg></div>`;
const svgQ1cSodiumWater = `<div class="my-4 flex justify-center"><svg viewBox='0 0 320 200' width='100%' height='170' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><rect x='80' y='35' width='160' height='135' rx='4' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='2'/><rect x='82' y='75' width='156' height='93' fill='#38bdf8' opacity='0.4'/><line x1='80' y1='75' x2='240' y2='75' stroke='#38bdf8' stroke-width='2'/><text x='160' y='125' font-size='11' font-weight='bold' fill='#0369a1' text-anchor='middle'>Water</text><circle cx='140' cy='74' r='7' fill='#f59e0b' stroke='#b45309' stroke-width='1.5'/><line x1='140' y1='67' x2='140' y2='45' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='3,2'/><text x='140' y='38' font-size='10' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Sodium metal</text><circle cx='132' cy='82' r='2' fill='#ffffff'/><circle cx='146' cy='85' r='2.5' fill='#ffffff'/><circle cx='138' cy='92' r='2' fill='#ffffff'/><circle cx='144' cy='78' r='1.5' fill='#ffffff'/><g transform='translate(195, 30)'><line x1='0' y1='0' x2='35' y2='0' stroke='#b45309' stroke-width='3.5'/><circle cx='0' cy='0' r='3.5' fill='#ef4444'/><text x='42' y='4' font-size='10' font-weight='bold' fill='#ef4444'>Glowing splint</text></g><path d='M 135 60 Q 130 50 135 40' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><path d='M 145 62 Q 150 52 145 42' fill='none' stroke='#cbd5e1' stroke-width='1.2' stroke-dasharray='2,2'/><text x='160' y='185' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>REACTION OF SODIUM WITH WATER</text></svg></div>`;
const svgQ1dGerminationBeakers = `<div class="my-4 flex justify-center"><svg viewBox='0 0 380 180' width='100%' height='160' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><g transform='translate(25, 20)'><rect x='10' y='20' width='70' height='95' rx='3' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><rect x='12' y='95' width='66' height='18' fill='#e2e8f0' opacity='0.7'/><circle cx='30' cy='92' r='4' fill='#ea580c'/><circle cx='45' cy='92' r='4' fill='#ea580c'/><circle cx='60' cy='92' r='4' fill='#ea580c'/><text x='45' y='136' font-size='12' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Beaker A</text></g><g transform='translate(145, 20)'><rect x='10' y='20' width='70' height='95' rx='3' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><rect x='12' y='95' width='66' height='18' fill='#0284c7' opacity='0.5'/><g transform='translate(30, 92)'><circle cx='0' cy='0' r='4' fill='#16a34a'/><path d='M 0 -4 Q -3 -12 -1 -16' fill='none' stroke='#4ade80' stroke-width='1.8'/><path d='M 0 4 Q 3 10 2 14' fill='none' stroke='#fde047' stroke-width='1.5'/></g><g transform='translate(55, 92)'><circle cx='0' cy='0' r='4' fill='#16a34a'/><path d='M 0 -4 Q -3 -12 -1 -16' fill='none' stroke='#4ade80' stroke-width='1.8'/></g><text x='45' y='136' font-size='12' font-weight='bold' fill='#4ade80' text-anchor='middle'>Beaker B</text></g><g transform='translate(265, 20)'><rect x='10' y='20' width='70' height='95' rx='3' fill='#1e293b' stroke='#64748b' stroke-width='1.5'/><rect x='12' y='50' width='66' height='63' fill='#0284c7' opacity='0.35'/><rect x='12' y='46' width='66' height='8' fill='#f59e0b' opacity='0.85'/><circle cx='30' cy='105' r='4' fill='#ea580c'/><circle cx='45' cy='105' r='4' fill='#ea580c'/><circle cx='60' cy='105' r='4' fill='#ea580c'/><text x='45' y='136' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Beaker C</text></g></svg></div>`;

export const SET_BECE_2015_SCIENCE_P2: CurriculumQuestionSet = {
  id: "paper_2015_variant_p2",
  title: "2015 BECE Integrated Science Practical & Theory Examination (Set 77)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "2015 BECE Practical & Theory Essay Test",
  variantType: "past_paper_variant",
  year: 2015,
  paperType: 2,
  setNumber: 77,
  era: "2015 BECE Standards",
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
          diagramSvg: svgQ1aParasitesVar,
          prompt: `The diagram below illustrates three different organisms (I, II, and III) that are harmful to domestic farm animals. Study the diagram carefully and answer the questions that follow:

${svgQ1aParasitesVar}

(i) Identify each of the organisms labelled I, II, and III.

(ii) Classify each of the organisms as:
  (α) an ectoparasite;
  (β) an endoparasite;
  (γ) an insect vector.

(iii) State one adverse pathological effect that each of the organisms produces on infected farm animals.

(iv) State three hygienic or management methods used to control the organism labelled III in a livestock herd.`,
          hint: "Identify external skin parasites, biting flies transmitting nagana/sleeping sickness, and segmented intestinal flatworms.",
          modelAnswer: `(i) Identification of organisms [3 marks]:
• Organism I: Body louse (lice)
• Organism II: Tsetse fly
• Organism III: Tapeworm (Taenia)

(ii) Classification [3 marks]:
• (α) Ectoparasite: Organism I (Louse) [lives externally on host skin].
• (β) Endoparasite: Organism III (Tapeworm) [lives internally in intestines].
• (γ) Insect vector: Organism II (Tsetse fly) [transmits Trypanosoma].

(iii) Adverse pathological effects [3 marks]:
• Organism I (Louse): Sucks blood, causing severe pruritus/skin irritation, anaemia, restlessness, and damaged fleece/hides.
• Organism II (Tsetse fly): Transmits Trypanosoma protozoa causing animal trypanosomiasis (Nagana), marked by fever, wasting, anaemia, and death.
• Organism III (Tapeworm): Absorbs pre-digested nutrients, leading to emaciation, stunted growth, digestive disorders, and intestinal obstruction.

(iv) Control of Organism III (Tapeworm) [3 marks, any 3]:
1. Regular deworming of livestock with broad-spectrum veterinary anthelminthics (e.g., albendazole).
2. Sanitary disposal of human and livestock excreta to prevent pasture contamination with proglottids/eggs.
3. Rotational grazing on clean paddocks to interrupt the tapeworm transmission cycle.
4. Thorough cooking and veterinary inspection of meat and animal feeds.`,
          workedSolution: "3 marks for naming organisms, 3 marks for classifications, 3 marks for pathological effects, 3 marks for valid control practices."
        },
        {
          partLabel: "(b)",
          marks: 10,
          diagramSvg: svgQ1bReflection,
          prompt: `The diagram below illustrates a burning candle placed in front of a flat plane mirror MM', forming an image behind the mirror. Study the optical ray diagram carefully and answer the questions that follow:

${svgQ1bReflection}

(i) Name each of the ray and normal lines labelled I, II, III, and IV.

(ii) State the exact mathematical relationship between the angle of incidence (θ₁) and the angle of reflection (θ₂).

(iii) Give three physical characteristics of the image labelled IV formed by the plane mirror.

(iv) Explain why image IV is represented using broken lines rather than solid lines.`,
          hint: "Recall the laws of reflection: angle of incidence equals angle of reflection. Virtual images are formed by diverging rays.",
          modelAnswer: `(i) Ray diagram labels [4 marks]:
• I: Incident ray
• II: Normal (perpendicular line to the mirror surface)
• III: Reflected ray
• IV: Virtual image of the candle

(ii) Mathematical relationship [1 mark]:
θ₁ = θ₂ (Angle of incidence = Angle of reflection, according to the First Law of Reflection).

(iii) Physical characteristics of Image IV [3 marks, any 3]:
1. It is virtual (cannot be captured on a screen).
2. It is erect (upright) and of the same size as the real object.
3. It is laterally inverted (left and right reversed).
4. Its distance behind the mirror is equal to the object's distance in front of the mirror.

(iv) Why Image IV is drawn with broken lines [2 marks]:
Image IV is a virtual image. The reflected rays do not actually pass through or emanate from that position; they only appear to originate from behind the mirror when extrapolated backward.`,
          workedSolution: "4 marks for ray names, 1 mark for θ₁ = θ₂, 3 marks for image properties, 2 marks for virtual ray explanation."
        },
        {
          partLabel: "(c)",
          marks: 10,
          diagramSvg: svgQ1cSodiumWater,
          prompt: `In a laboratory demonstration to investigate the reactivity of Group 1 alkali metals, a small freshly cut piece of sodium metal was carefully dropped into a beaker containing cold water:

${svgQ1cSodiumWater}

(i) State what observation would be made if a glowing wooden splint were held at the mouth of the beaker.

(ii) Name the flammable gas evolved during the vigorous chemical reaction.

(iii) Write a balanced chemical equation for the reaction that occurred between sodium and water.

(iv) Name two other metallic elements in the Periodic Table that react vigorously with cold water in a similar manner.`,
          hint: "Alkali metals react violently with water, generating alkaline hydroxide and hydrogen gas.",
          modelAnswer: `(i) Observation with glowing splint [2 marks]:
The splint is ignited and burns with a sharp, characteristic pop sound (or a pale blue flame).

(ii) Name of gas evolved [2 marks]:
Hydrogen gas (H₂).

(iii) Balanced chemical equation [3 marks]:
2Na(s) + 2H₂O(l) → 2NaOH(aq) + H₂(g)

(iv) Other similarly reactive alkali metals [3 marks]:
Potassium (K) and Lithium (Li).`,
          workedSolution: "2 marks for pop sound observation, 2 marks for hydrogen, 3 marks for balanced equation, 3 marks for alkali metal examples."
        },
        {
          partLabel: "(d)",
          marks: 10,
          diagramSvg: svgQ1dGerminationBeakers,
          prompt: `An experiment was performed to investigate the physical conditions necessary for the germination of viable bean seeds. Three glass beakers labelled A, B, and C containing viable seeds were set up at room temperature as shown below:

${svgQ1dGerminationBeakers}

(i) State what would happen to the seeds in each of the beakers labelled A, B, and C when inspected after five days.

(ii) Provide a scientific reason for your observation in each beaker in (d)(i).

(iii) Explain why a layer of boiled vegetable oil was poured on the surface of the water in Beaker C.`,
          hint: "Analyze the three required conditions: moisture (water), air (oxygen), and warmth (temperature).",
          modelAnswer: `(i) Observations after five days [3 marks]:
• Beaker A: Seeds do not germinate.
• Beaker B: Seeds germinate successfully (radicle and plumule emerge).
• Beaker C: Seeds do not germinate.

(ii) Scientific reasons [5 marks]:
• Beaker A: Seeds fail to germinate due to lack of water (moisture) required to activate metabolic enzymes and soften the seed coat [1.5 marks].
• Beaker B: Seeds germinate because all essential physical conditions—water, oxygen (air), and optimum temperature (warmth)—are present [2 marks].
• Beaker C: Seeds fail to germinate due to lack of oxygen (air). Boiling water expels dissolved oxygen, and the oil layer prevents atmospheric oxygen from re-entering [1.5 marks].

(iii) Purpose of oil layer in Beaker C [2 marks]:
The layer of boiled oil acts as an impermeable physical barrier that prevents atmospheric oxygen from dissolving into the water and reaching the submerged seeds.`,
          workedSolution: "3 marks for observations, 5 marks for physiological explanations, 2 marks for oil oxygen barrier explanation."
        }
      ]
    },
    {
      id: "q02",
      title: "Question 2: Weather & Seasons, Alloys, Vegetable Nutrition & Angiosperm Life Cycle",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts (a), (b), (c), and (d) of this question:",
      workedSolution: "See complete worked solutions and marking breakdown below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) Define the term weather.\n\n(ii) State two clear differences between weather and climate.",
          hint: "Weather is short-term atmospheric state; climate is long-term average over decades.",
          modelAnswer: "(i) Definition of weather [2 marks]:\nThe atmospheric condition of a specific geographic locality recorded over a short period of time (hours or days), defined by temperature, humidity, rainfall, and wind.\n\n(ii) Differences between weather and climate [2 marks]:\n1. Time scale: Weather fluctuates daily or hourly; climate represents the composite atmospheric pattern over 30 to 35 years.\n2. Predictability: Weather is highly variable and localized; climate displays stable seasonal patterns.",
          workedSolution: "2 marks for definition; 1 mark each for valid contrasts (max 2 marks)."
        },
        {
          partLabel: "(b)",
          marks: 3,
          prompt: "State the elemental composition of each of the following commercial alloys:\n\n(i) Carbon steel;\n\n(ii) Stainless steel.",
          hint: "Carbon steel is iron and carbon. Stainless steel contains additional corrosion-resisting transition metals.",
          modelAnswer: "Elemental composition [3 marks]:\n(i) Carbon steel: Iron (Fe) and Carbon (C) [1.5 marks].\n(ii) Stainless steel: Iron (Fe), Carbon (C), Chromium (Cr), and Nickel (Ni) [1.5 marks].",
          workedSolution: "Full marks for listing constituent elements of both alloys."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "List four physiological health benefits derived by humans from including fresh vegetables in their daily diet.",
          hint: "Vitamins, mineral salts, dietary fibre (roughage), and antioxidants.",
          modelAnswer: "Health benefits of vegetables [4 marks, any 4]:\n1. Supplies essential vitamins (e.g., Vitamin A and Vitamin C) that boost the immune system against infections.\n2. Provides vital minerals (iron for haemoglobin, calcium for bones and teeth).\n3. Supplies dietary fibre (roughage) that stimulates gut peristalsis and prevents constipation.\n4. Contains antioxidants that protect cells against oxidative damage and reduce the risk of chronic diseases.",
          workedSolution: "1 mark for each valid physiological benefit (max 4 marks)."
        },
        {
          partLabel: "(d)",
          marks: 4,
          prompt: "Name four sequential stages in the reproductive and developmental life cycle of an angiosperm (flowering plant).",
          hint: "From seed to vegetative plant, flowering, pollination, fertilization, and fruit formation.",
          modelAnswer: "Life cycle stages of an angiosperm [4 marks]:\n1. Seed germination and seedling emergence.\n2. Vegetative growth into a leafy mature plant.\n3. Flower bud formation and blooming.\n4. Pollination and fertilization.\n5. Seed and fruit development followed by dispersal.",
          workedSolution: "1 mark per correct sequential stage (max 4 marks)."
        }
      ]
    },
    {
      id: "q03",
      title: "Question 3: Ion Formation, Potential Energy, Teenage Pregnancy & Soil Functions",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts (a), (b), (c), and (d) of this question:",
      workedSolution: "See complete worked solutions and marking breakdown below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "Using the concept of electronic configuration and octet stability, explain how:\n\n(i) A neutral Lithium atom (₃Li) becomes a positively charged cation;\n\n(ii) A neutral Oxygen atom (₈O) becomes a negatively charged anion.",
          hint: "Lithium electron configuration is 2, 1; Oxygen is 2, 6. Consider valence electron transfer.",
          modelAnswer: "(i) Lithium cation formation [2 marks]:\nLithium has an electron configuration of 2, 1. To achieve a stable helium duplet, it loses its single valence electron (Li → Li⁺ + e⁻). The ion has 3 positive protons and only 2 negative electrons, giving a net charge of +1.\n\n(ii) Oxide anion formation [2 marks]:\nOxygen has an electron configuration of 2, 6. To achieve a stable neon octet, it gains two electrons into its valence shell (O + 2e⁻ → O²⁻). With 10 negative electrons against 8 positive protons, it carries a net charge of -2.",
          workedSolution: "2 marks per ion explanation (configuration, electron gain/loss, resulting charge)."
        },
        {
          partLabel: "(b)",
          marks: 5,
          prompt: "(i) What is gravitational potential energy?\n\n(ii) A coconut fruit of mass 2.0 kg hangs from a palm tree at a height of 5.0 m above the ground. Calculate the potential energy possessed by the coconut. [Take acceleration due to gravity, g = 10 m s⁻²].",
          hint: "PE = mgh. Substitute mass (2 kg), g (10 m/s²), and height (5 m).",
          modelAnswer: "(i) Definition [2 marks]:\nThe energy stored in a body by virtue of its elevated vertical position or height in a gravitational field.\n\n(ii) Calculation [3 marks]:\nFormula: P.E. = mgh [1 mark]\nSubstitution: P.E. = 2.0 kg × 10 m s⁻² × 5.0 m [1 mark]\nAnswer: P.E. = 100 J (or 100 Joules) [1 mark]",
          workedSolution: "2 marks for definition; 3 marks for formula, correct substitution, and final answer with units."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "State four socio-economic, educational, or behavioral causes of teenage pregnancy in developing communities.",
          hint: "Poverty, peer pressure, lack of sex education, parental neglect.",
          modelAnswer: "Causes of teenage pregnancy [4 marks, any 4]:\n1. Lack of comprehensive sexual and reproductive health education in homes and schools.\n2. Household poverty and financial deprivation leading to transactional sexual relationships.\n3. Negative peer pressure and premature sexual experimentation.\n4. Parental neglect, breakdown in family communication, and lack of guidance.\n5. Inadequate access to adolescent-friendly reproductive health counseling.",
          workedSolution: "1 mark per valid socio-economic or behavioral cause (max 4 marks)."
        },
        {
          partLabel: "(d)",
          marks: 2,
          prompt: "State two distinct agricultural functions of soil in crop husbandry.",
          hint: "Anchorage, water reservoir, mineral nutrient supply, root aeration.",
          modelAnswer: "Agricultural functions of soil [2 marks, any 2]:\n1. Mechanical anchorage: Firmly anchors crop roots to support plants upright against lodging.\n2. Nutrient reservoir: Supplies essential dissolved mineral ions (N, P, K) for plant growth.\n3. Moisture retention: Stores capillary water required for photosynthesis and transpiration.\n4. Aeration: Contains pore spaces that supply oxygen for root respiration.",
          workedSolution: "1 mark per distinct agricultural role (max 2 marks)."
        }
      ]
    },
    {
      id: "q04",
      title: "Question 4: Water in Physiology, Crop Rotation, Electrical Wiring & Osmosis vs Diffusion",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts (a), (b), (c), and (d) of this question:",
      workedSolution: "See complete worked solutions and marking breakdown below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "Outline four essential physiological roles of water in maintaining human health.",
          hint: "Universal solvent, temperature regulation (sweating), joint lubrication, excretion in urine.",
          modelAnswer: "Physiological roles of water [4 marks, any 4]:\n1. Universal solvent: Dissolves and transports digested nutrients, respiratory gases, and metabolic hormones in blood plasma.\n2. Thermoregulation: Evaporates as sweat to dissipate excess body heat and regulate internal temperature.\n3. Lubrication: Lubricates articulating skeletal joints and gastrointestinal linings to reduce friction.\n4. Excretion: Facilitates kidney filtration and elimination of metabolic nitrogenous wastes in urine.",
          workedSolution: "1 mark per physiological role (max 4 marks)."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "(i) State two agronomic benefits of practicing systematic crop rotation.\n\n(ii) Distinguish between mixed cropping and mixed farming.",
          hint: "Crop rotation conserves soil fertility and breaks pest cycles. Distinguish crops-only from crops + livestock.",
          modelAnswer: "(i) Benefits of crop rotation [2 marks]:\n• Preserves soil nutrient balance by alternating deep and shallow rooters and incorporating nitrogen-fixing legumes [1 mark].\n• Breaks the life cycles of insect pests, weeds, and plant diseases [1 mark].\n\n(ii) Distinction [2 marks]:\n• Mixed cropping: Growing two or more different crop species simultaneously on the same plot of land in a single season [1 mark].\n• Mixed farming: An integrated agricultural system combining crop cultivation with livestock rearing on the same farm [1 mark].",
          workedSolution: "2 marks for rotation benefits; 2 marks for clear distinction between mixed cropping and mixed farming."
        },
        {
          partLabel: "(c)",
          marks: 3,
          prompt: "(i) What is an electrical fuse?\n\n(ii) State the international standard insulation colour code of the live conductor wire to which a fuse is connected inside a 3-pin plug.",
          hint: "Low-melting safety wire protecting against overcurrent. Live wire is brown.",
          modelAnswer: "(i) Electrical fuse [2 marks]:\nA circuit safety device containing a thin wire with a low melting point designed to melt (blow) and interrupt current flow when current exceeds a predetermined safe rating.\n\n(ii) Colour code [1 mark]:\nBrown (or Red in older British wiring code).",
          workedSolution: "2 marks for fuse definition; 1 mark for brown/red live wire color."
        },
        {
          partLabel: "(d)",
          marks: 4,
          prompt: "(i) In a tabular format, state three scientific differences between osmosis and diffusion.\n\n(ii) State one fundamental physical similarity between osmosis and diffusion.",
          hint: "Compare moving particles, membrane requirement, and medium. Both are passive down concentration gradients.",
          modelAnswer: "(i) Differences Table [3 marks]:\n\n| Feature | Osmosis | Diffusion |\n| :--- | :--- | :--- |\n| Moving Particles | Solvent (water) molecules only | Solute particles, liquids, or gases |\n| Membrane | Requires a selectively permeable membrane | Does not require a membrane |\n| Medium | Occurs exclusively in liquid solutions | Occurs in gases, liquids, and solutions |\n\n(ii) Fundamental Similarity [1 mark]:\nBoth are passive physical transport processes driven by kinetic energy moving particles down a concentration gradient without requiring metabolic energy (ATP).",
          workedSolution: "3 marks for differences table (1 mark per valid contrast); 1 mark for passive kinetic similarity."
        }
      ]
    },
    {
      id: "q05",
      title: "Question 5: Balanced Ration, Lab Safety, Circulatory Anatomy & Simple Machines",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts (a), (b), (c), and (d) of this question:",
      workedSolution: "See complete worked solutions and marking breakdown below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) What is a balanced ration in animal nutrition?\n\n(ii) State two economic benefits of feeding balanced rations to commercial egg-laying poultry birds.",
          hint: "Feed supplying all essential nutrients in proper proportion. High egg yields, thick shells.",
          modelAnswer: "(i) Balanced ration [2 marks]:\nA daily feed allowance that contains all essential nutrients (carbohydrates, proteins, fats, vitamins, minerals, water) in the exact proportions and amounts required for maintenance, growth, and maximum egg production.\n\n(ii) Economic benefits to poultry [2 marks]:\n1. Maximizes daily egg production rate and egg weight [1 mark].\n2. Improves eggshell strength (calcium/vitamin D), reducing breakage and increasing market profits [1 mark].",
          workedSolution: "2 marks for definition; 2 marks for economic justifications."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "List four laboratory safety hazards encountered during science practical lessons and state one precaution for each.",
          hint: "Chemical burns, toxic fumes, thermal burns from flames, glass cuts.",
          modelAnswer: "Hazards and Precautions [4 marks]:\n1. Chemical burns from corrosive acids/alkalis: Wear protective goggles, lab coats, and acid-resistant gloves [1 mark].\n2. Inhaling toxic/irritating fumes: Perform volatile chemical reactions inside a fume cupboard [1 mark].\n3. Thermal burns from Bunsen flames: Tie back long hair, roll up loose sleeves, and use tongs to handle hot items [1 mark].\n4. Cuts from broken glassware: Inspect glassware before heating and dispose of cracked glass in dedicated sharps bins [1 mark].",
          workedSolution: "1 mark per hazard paired with an appropriate precaution (max 4 marks)."
        },
        {
          partLabel: "(c)",
          marks: 3,
          prompt: "Name three anatomical components of the human circulatory system.",
          hint: "The muscular pump, the fluid, and the vessels.",
          modelAnswer: "Anatomical components [3 marks]:\n1. The Heart (muscular pump) [1 mark].\n2. The Blood (circulating fluid tissue) [1 mark].\n3. The Blood Vessels (arteries, veins, and capillaries) [1 mark].",
          workedSolution: "1 mark each for Heart, Blood, and Blood Vessels."
        },
        {
          partLabel: "(d)",
          marks: 4,
          prompt: "(i) Define the term simple machine.\n\n(ii) State two mechanical methods used to minimize frictional resistance between moving parts of machines.",
          hint: "Tool that makes work easier by changing force magnitude or direction. Lubrication, ball bearings, polishing.",
          modelAnswer: "(i) Simple machine [2 marks]:\nA mechanical device that alters the magnitude, direction, or speed of an applied effort force, making work easier to accomplish.\n\n(ii) Methods of minimizing friction [2 marks, any 2]:\n1. Lubrication: Applying grease or oil between moving surfaces to form a thin sliding film.\n2. Using ball bearings or roller bearings to replace sliding friction with rolling friction.\n3. Polishing and smoothing contact surfaces to remove microscopic asperities.",
          workedSolution: "2 marks for machine definition; 2 marks for friction reduction methods."
        }
      ]
    },
    {
      id: "q06",
      title: "Question 6: Magnetic Fields, Mixtures, Dental Plaque & Indigenous Science Principles",
      totalMarks: 15,
      points: 15,
      format: "structured_essay",
      prompt: "Answer all parts (a), (b), (c), and (d) of this question:",
      workedSolution: "See complete worked solutions and marking breakdown below.",
      parts: [
        {
          partLabel: "(a)",
          marks: 4,
          prompt: "(i) What is a magnetic field?\n\n(ii) Classify each of the following everyday materials into a solid-in-gas mixture, gas-in-gas mixture, or solid-in-solid mixture:\n  (α) Air;\n  (β) Dense smoke;\n  (γ) Bronze alloy.",
          hint: "Region of magnetic influence. Air is gas-gas, smoke is solid-gas, bronze is solid-solid.",
          modelAnswer: "(i) Magnetic field [1 mark]:\nA region of space around a magnet or current-carrying conductor where magnetic forces can be felt or detected.\n\n(ii) Mixture classification [3 marks]:\n• (α) Air: Gas-in-gas mixture (nitrogen, oxygen, noble gases) [1 mark].\n• (β) Dense smoke: Solid-in-gas mixture (carbon soot suspended in air) [1 mark].\n• (γ) Bronze alloy: Solid-in-solid mixture (copper and tin alloy) [1 mark].",
          workedSolution: "1 mark for definition; 1 mark for each accurate mixture phase classification."
        },
        {
          partLabel: "(b)",
          marks: 4,
          prompt: "(i) What is dental plaque in human dentition?\n\n(ii) State the biochemical role played by chlorophyll during the process of photosynthesis in green leaves.",
          hint: "Bacterial film on teeth. Chlorophyll traps light energy for photolysis and carbohydrate synthesis.",
          modelAnswer: "(i) Dental plaque [2 marks]:\nA sticky, colorless biofilm composed of bacteria, food debris, and salivary proteins that adheres to tooth enamel and along gum margins.\n\n(ii) Role of chlorophyll [2 marks]:\nChlorophyll traps light energy from sunlight and converts it into chemical energy to drive the photolysis of water and synthesis of glucose from carbon dioxide and water.",
          workedSolution: "2 marks for plaque definition; 2 marks for chlorophyll photochemical role."
        },
        {
          partLabel: "(c)",
          marks: 4,
          prompt: "Identify the primary scientific or biochemical principle underlying each of the following traditional food processing and renewable energy industries in Ghana:\n\n(i) Kenkey production;\n\n(ii) Commercial solar salt production;\n\n(iii) Fish smoking;\n\n(iv) Domestic biogas generation.",
          hint: "Fermentation, solar evaporation, thermal dehydration & antimicrobial smoke, anaerobic microbial digestion.",
          modelAnswer: "Scientific principles [4 marks]:\n(i) Kenkey production: Anaerobic microbial fermentation (lactic acid fermentation of corn dough) [1 mark].\n(ii) Solar salt production: Evaporation of water from concentrated seawater using solar heat [1 mark].\n(iii) Fish smoking: Thermal dehydration and deposition of antimicrobial wood smoke chemicals [1 mark].\n(iv) Biogas generation: Anaerobic digestion of organic waste by methanogenic bacteria [1 mark].",
          workedSolution: "1 mark for each correctly identified scientific/biochemical principle."
        },
        {
          partLabel: "(d)",
          marks: 3,
          prompt: "(i) What is a plant parasite?\n\n(ii) Give two biological examples of parasitic plants that obtain nutrients from host trees.",
          hint: "Plants that attach via haustoria to rob nutrients. Mistletoe, dodder, striga.",
          modelAnswer: "(i) Plant parasite [1.5 marks]:\nA plant that lives on or inside another living host plant, obtaining water, mineral salts, and organic nutrients via specialized roots (haustoria), causing harm to the host.\n\n(ii) Examples of parasitic plants [1.5 marks, any 2]:\n• Mistletoe (Tapinanthus)\n• Dodder (Cuscuta)\n• Witchweed (Striga)",
          workedSolution: "1.5 marks for definition; 1.5 marks for 2 valid plant parasite examples."
        }
      ]
    }
  ]
};
