/**
 * 2001 BECE Integrated Science Paper 2 (Set 115 Practical & Theory Essay Test Variant)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_2001_variant
 * Set Number: Set 115
 * Format: 4 Comprehensive Essay Questions (20 marks each) = 80 Marks Total
 * Reconstructed Visual Setups:
 *  - svgQ2cElectromagnetization (Electrical Solenoid Magnetization of Metal Bar)
 *  - svgQ4bSolarEclipse (Astronomical Solar Eclipse Geometry - Umbra vs. Penumbra)
 * 
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
 */

export const svgQ2cElectromagnetization = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><rect x='70' y='65' width='240' height='20' rx='3' fill='#475569' stroke='#94a3b8' stroke-width='2'/><text x='190' y='79' font-size='10' font-weight='bold' fill='#ffffff' text-anchor='middle'>Steel Bar (to be magnetized)</text><path d='M 90 55 Q 100 45 105 65 Q 110 85 120 55 Q 130 45 135 65 Q 140 85 150 55 Q 160 45 165 65 Q 170 85 180 55 Q 190 45 195 65 Q 200 85 210 55 Q 220 45 225 65 Q 230 85 240 55 Q 250 45 255 65 Q 260 85 270 55 Q 280 45 285 65' fill='none' stroke='#f59e0b' stroke-width='3.5'/><line x1='90' y1='65' x2='90' y2='150' stroke='#38bdf8' stroke-width='2.5'/><line x1='285' y1='65' x2='285' y2='150' stroke='#38bdf8' stroke-width='2.5'/><line x1='90' y1='150' x2='155' y2='150' stroke='#38bdf8' stroke-width='2.5'/><g transform='translate(155, 150)'><line x1='0' y1='-14' x2='0' y2='14' stroke='#10b981' stroke-width='2.5'/><line x1='7' y1='-8' x2='7' y2='8' stroke='#ef4444' stroke-width='4'/><line x1='16' y1='-14' x2='16' y2='14' stroke='#10b981' stroke-width='2.5'/><line x1='23' y1='-8' x2='23' y2='8' stroke='#ef4444' stroke-width='4'/><text x='11' y='-20' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='middle'>DC Battery</text></g><line x1='178' y1='150' x2='225' y2='150' stroke='#38bdf8' stroke-width='2.5'/><circle cx='228' cy='150' r='3' fill='#e2e8f0'/><line x1='228' y1='150' x2='252' y2='138' stroke='#e2e8f0' stroke-width='2.5'/><circle cx='256' cy='150' r='3' fill='#e2e8f0'/><text x='242' y='175' font-size='10' font-weight='bold' fill='#e2e8f0' text-anchor='middle'>Switch</text><line x1='256' y1='150' x2='285' y2='150' stroke='#38bdf8' stroke-width='2.5'/><text x='190' y='28' font-size='9' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>MAGNETIZATION OF STEEL BAR USING DIRECT CURRENT SOLENOID</text></svg></div>";

export const svgQ4bSolarEclipse = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 200' width='100%' height='185' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><circle cx='50' cy='100' r='32' fill='#fef08a' stroke='#f59e0b' stroke-width='2'/><text x='50' y='104' font-size='11' font-weight='bold' fill='#78350f' text-anchor='middle'>Sun</text><circle cx='180' cy='100' r='12' fill='#64748b' stroke='#94a3b8' stroke-width='1.5'/><text x='180' y='80' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Moon</text><circle cx='320' cy='100' r='26' fill='#0284c7' stroke='#38bdf8' stroke-width='1.8'/><text x='320' y='104' font-size='11' font-weight='bold' fill='#ffffff' text-anchor='middle'>Earth</text><line x1='50' y1='68' x2='180' y2='88' stroke='#fde047' stroke-width='1' stroke-dasharray='3,2'/><line x1='50' y1='132' x2='180' y2='112' stroke='#fde047' stroke-width='1' stroke-dasharray='3,2'/><polygon points='180,88 320,95 320,105 180,112' fill='#0f172a' opacity='0.85'/><line x1='50' y1='68' x2='180' y2='112' stroke='#f59e0b' stroke-width='1' stroke-dasharray='3,2'/><line x1='50' y1='132' x2='180' y2='88' stroke='#f59e0b' stroke-width='1' stroke-dasharray='3,2'/><polygon points='180,88 320,65 320,95' fill='#334155' opacity='0.45'/><polygon points='180,112 320,135 320,105' fill='#334155' opacity='0.45'/><line x1='320' y1='100' x2='250' y2='30' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/><text x='245' y='25' font-size='10' font-weight='bold' fill='#f43f5e' text-anchor='end'>Umbra (Total Eclipse)</text><line x1='320' y1='75' x2='250' y2='170' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/><text x='245' y='175' font-size='10' font-weight='bold' fill='#38bdf8' text-anchor='end'>Penumbra (Partial Eclipse)</text><text x='190' y='192' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>ECLIPSE OF THE SUN: MOON CASTS UMBRA AND PENUMBRA ONTO EARTH</text></svg></div>";

export interface SubQuestion {
  subId: string;
  prompt: string;
  workedSolution: string;
  maxMarks: number;
}

export interface Paper2Question {
  questionNumber: string;
  isPracticalSectionA: boolean;
  subQuestions: SubQuestion[];
}

export const SET_BECE_2001_SCIENCE_P2_QUESTIONS: Paper2Question[] = [
  // ==========================================
  // QUESTION 1: FLUID STATICS, NUTRITION & CHEMISTRY (20 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) What is surface tension in fluid physics?
(ii) Name two everyday devices or natural phenomena that make use of surface tension.
(iii) Explain how the principle of surface tension operates in one of the devices or phenomena named in (a)(ii).`,
        workedSolution: `(i) Definition of surface tension:
The physical property of a liquid surface that causes it to behave like a stretched elastic membrane, caused by inward, unbalanced cohesive forces pulling surface liquid molecules into the bulk liquid.

(ii) Everyday devices / phenomena:
1. Fabric umbrellas (waterproof canvas tents repelling rain).
2. Steel sewing needle or razor blade floating horizontally on water.
3. Pond skater insects walking across the surface of calm ponds.
4. Paint brushes whose hairs cling together only when withdrawn from water.

(iii) Explanation of operation (e.g., Fabric Umbrella):
The cohesive attraction between water molecules forms a curved surface film (meniscus) that spans the microscopic weave pores between the threads of the umbrella fabric. Unless broken by pressure or a wetting agent, surface tension prevents water droplets from penetrating through the tiny holes.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `(i) What is constipation in human digestive physiology?
(ii) State four dietary or lifestyle practices by which constipation can be prevented.`,
        workedSolution: `(i) Definition of constipation:
A gastrointestinal condition characterized by infrequent, difficult, or painful evacuation of hard, dry feces resulting from sluggish peristalsis and excessive water re-absorption in the colon.

(ii) Four preventive practices:
1. Consuming adequate amounts of dietary fiber / roughage (whole grains, vegetables, fruits) to add bulk to stool.
2. Drinking sufficient quantities of water daily to keep feces soft and moist.
3. Engaging in regular physical exercise to stimulate intestinal peristaltic contractions.
4. Establishing regular, scheduled habits for bowel movements without delay upon the urge.`,
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `A solid metal block of mass $10.0\\text{ kg}$ is suspended vertically from a laboratory spring balance. Calculate the downward gravitational force (weight) acting on the block.
$$[\\text{Take acceleration due to gravity, } g = 10.0\\text{ m s}^{-2}]$$`,
        workedSolution: `Formula:
$$\\text{Force } (W) = \\text{Mass } (m) \\times \\text{Acceleration due to gravity } (g)$$
Substitute given values ($m = 10.0\\text{ kg}$, $g = 10.0\\text{ m s}^{-2}$):
$$W = 10.0\\text{ kg} \\times 10.0\\text{ m s}^{-2} = 100.0\\text{ Newtons (N)}$$
Answer: The downward force acting on the block is $$100\\text{ N}$$.`,
        maxMarks: 3
      },
      {
        subId: "(d)",
        prompt: `An amount of aqueous sodium hydroxide solution was placed into a glass beaker and a piece of litmus paper was immersed in it. Dilute hydrochloric acid was added slowly from a burette with constant stirring until the litmus paper just turned purple. The resulting solution was then evaporated to dryness:
(i) What was the initial color of the litmus paper in the sodium hydroxide solution?
(ii) What did the color change of the litmus paper to purple indicate?
(iii) What chemical substance remained in the evaporating dish after all liquid had evaporated?
(iv) Write down a balanced chemical equation for the reaction that took place.`,
        workedSolution: `(i) Initial colour in sodium hydroxide:
Blue (sodium hydroxide is a strong alkali with $pH > 7$).

(ii) What purple indicates:
It indicates the exact neutralization endpoint ($pH = 7$); the acid and base have reacted in stoichiometric equivalence to form a neutral solution.

(iii) Substance remaining after evaporation:
White crystalline solid sodium chloride (table salt, $\\text{NaCl}$).

(iv) Balanced chemical equation:
$$\\text{NaOH}_{(aq)} + \\text{HCl}_{(aq)} \\to \\text{NaCl}_{(aq)} + \\text{H}_2\\text{O}_{(l)}$$`,
        maxMarks: 6
      }
    ]
  },

  // ==========================================
  // QUESTION 2: BOTANY, ANIONS & MAGNETISM (20 MARKS)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "State and explain three distinct morphological or chemical mechanisms by which terrestrial plants protect themselves from herbivorous animals and environmental hazards.",
        workedSolution: `1. Physical Spines and Thorns: Developing sharp, lignified epidermal thorns, spines, or prickles (e.g., *Acacia*, rose, cactus) that physically deter browsing mammals from feeding on tender stems and leaves.
2. Production of Chemical Toxins and Bitter Alkaloids: Synthesizing repellent chemical compounds, bitter tannins, or poisonous cardiac glycosides (e.g., *Euphorbia* milky latex, tobacco nicotine) that sicken or deter herbivores.
3. Stinging Glandular Hairs: Possessing specialized epidermal trichomes (e.g., stinging nettle) that inject irritating formic acid and histamine into animal skin upon contact.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `(i) What is an anion in electrochemistry?
(ii) Give the chemical names of the products formed when each of the following pairs of compounds react chemically together:
  (α) Aqueous ammonium hydroxide [$\\text{NH}_4\\text{OH}$] and dilute hydrochloric acid [$\\text{HCl}$];
  (β) Solid calcium carbonate [$\\text{CaCO}_3$] and dilute hydrochloric acid [$\\text{HCl}$].`,
        workedSolution: `(i) Definition of an anion:
A negatively charged ion formed when a neutral non-metallic atom or radical gains one or more valence electrons, which migrates toward the positive anode during electrolysis (e.g., $\\text{Cl}^-$, $\\text{SO}_4^{2-}$).

(ii) Products of reactions:
• (α) $\\text{NH}_4\\text{OH} + \\text{HCl}$:
  - Products: Ammonium chloride [$\\text{NH}_4\\text{Cl}$] and Water [$\\text{H}_2\\text{O}$].
• (β) $\\text{CaCO}_3 + 2\\text{HCl}$:
  - Products: Calcium chloride [$\\text{CaCl}_2$], Water [$\\text{H}_2\\text{O}$], and Carbon dioxide gas [$\\text{CO}_2$].`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: `(i) What is electromagnetism in physics?
(ii) With the aid of a labelled circuit diagram, describe how a solid bar of steel or iron can be magnetized using the electrical method:

${svgQ2cElectromagnetization}`,
        workedSolution: `(i) Definition of electromagnetism:
The branch of physics concerning the interaction between electric currents and magnetic fields; specifically, the production of a temporary or permanent magnetic field around an electrical conductor carrying direct current.

(ii) Electrical method of magnetization (refer to diagram):
1. Apparatus: A hard steel bar, an insulated copper wire wound into a long solenoid coil, a DC chemical battery, and a switch.
2. Procedure: Place the steel bar inside the solenoid coil. Connect the ends of the solenoid in series with the battery and switch. Close the switch to pass direct current (DC) through the coil for a few seconds, then open the switch.
3. Result: The direct current sets up an internal magnetic field inside the solenoid that aligns the magnetic domains of the steel bar. When removed, the steel bar has become a permanent magnet.`,
        maxMarks: 8
      }
    ]
  },

  // ==========================================
  // QUESTION 3: ROOT BIOLOGY, METROLOGY & CHEMISTRY (20 MARKS)
  // ==========================================
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `State:
(i) Three distinct morphological characteristics of plant roots;
(ii) Two vital physiological functions performed by root systems.`,
        workedSolution: `(i) Characteristics of roots:
1. Positively geotropic (grow downward into soil toward gravity) and positively hydrotropic (grow toward moisture).
2. Negatively phototropic (grow away from sunlight into darkness).
3. Lack nodes, internodes, leaves, and lateral buds.
4. Covered at their apical tips by a protective root cap and possess microscopic unicellular root hairs.

(ii) Functions of roots:
1. Anchorage: Firmly anchor the plant into the soil matrix against wind lodging.
2. Absorption: Absorb capillary soil water and dissolved inorganic mineral salts.
3. Storage: Store reserve synthesized carbohydrates (e.g., cassava, carrot, sweet potato).`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: "State two essential environmental conditions necessary for the successful germination of viable seeds.",
        workedSolution: `1. Adequate moisture (water): Softens the outer seed coat and activates hydrolytic enzymes to break down food reserves.
2. Suitable temperature (warmth): Provides the optimum thermal kinetic energy for germination enzymes to operate.
3. Oxygen gas: Essential for aerobic cellular respiration to generate ATP energy for embryo growth.`,
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "Describe briefly how the physical volume of an irregularly shaped insoluble metal sphere can be accurately determined in a school laboratory.",
        workedSolution: `Archimedes displacement method using a measuring cylinder:
1. Pour a known volume of water into a clean, graduated measuring cylinder and record the initial water volume reading ($V_1$) at the bottom of the meniscus.
2. Tie a thin thread to the irregular metal sphere.
3. Lower the sphere gently and completely into the water until fully submerged, ensuring no water splashes out and no air bubbles cling to it.
4. Record the new, elevated water level reading ($V_2$).
5. Calculate the volume:
$$\\text{Volume of metal sphere} = V_2 - V_1$$`,
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: "Write down the correct chemical formula for each of the following inorganic compounds:\n(i) Sodium chloride;\n(ii) Copper (II) sulfate;\n(iii) Magnesium sulfate;\n(iv) Potassium carbonate.",
        workedSolution: `Chemical Formulae:
• (i) Sodium chloride: $\\text{NaCl}$
• (ii) Copper (II) sulfate: $\\text{CuSO}_4$
• (iii) Magnesium sulfate: $\\text{MgSO}_4$
• (iv) Potassium carbonate: $\\text{K}_2\\text{CO}_3$`,
        maxMarks: 4
      },
      {
        subId: "(e)",
        prompt: "State the appropriate laboratory separation method that could be used to separate the constituents of each of the following mixtures:\n(i) A solid heterogeneous mixture of iodine crystals and quartz sand;\n(ii) A homogeneous miscible mixture of liquid ethanol and water.",
        workedSolution: `(i) Iodine and sand:
• Method: Sublimation.
• Explanation: Solid iodine sublimes upon gentle heating directly into purple vapor without melting, leaving the non-volatile sand behind. The vapor cools and deposits as pure crystals on an inverted cold funnel.

(ii) Ethanol and water:
• Method: Fractional distillation.
• Explanation: Both liquids are miscible but have different boiling points (ethanol boils at $78^\\circ\\text{C}$; water boils at $100^\\circ\\text{C}$). Heating vaporizes the more volatile ethanol first, which condenses in a Liebig condenser.`,
        maxMarks: 4
      }
    ]
  },

  // ==========================================
  // QUESTION 4: DIGESTION, ASTRONOMY & PHYSICS (20 MARKS)
  // ==========================================
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) What is digestion in animal physiology?
(ii) Describe briefly how ingested food is mechanically and chemically digested inside the human stomach.`,
        workedSolution: `(i) Definition of digestion:
The biochemical and mechanical breakdown of large, complex, insoluble food molecules into small, soluble, absorbable units that can diffuse across intestinal membranes into the bloodstream.

(ii) Digestion in the stomach:
1. Mechanical Churning: Rhythmic peristaltic contractions of the stomach's muscular walls churn, knead, and mix food with gastric juice to form a semi-liquid pulp called chyme.
2. Chemical Action of Hydrochloric Acid: Acidic gastric juice ($pH \\approx 1.5 - 2.0$) kills swallowed microorganisms and activates inactive pepsinogen into active pepsin.
3. Enzymatic Hydrolysis: The protease enzyme pepsin hydrolyzes large protein polymers into shorter soluble peptide chains (peptones). Rennin (in infants) coagulates liquid milk protein (casein) to facilitate pepsin action.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) What is meant by an eclipse of the Sun (solar eclipse) in astronomy?
(ii) With the aid of a clear, fully labelled ray diagram, distinguish between a total solar eclipse (umbra) and a partial solar eclipse (penumbra):

${svgQ4bSolarEclipse}`,
        workedSolution: `(i) Definition of solar eclipse:
An astronomical phenomenon that occurs when the Moon passes directly between the Sun and the Earth in a straight line (syzygy), temporarily blocking solar light and casting the Moon's shadow onto sections of the Earth's surface.

(ii) Umbra vs. Penumbra (refer to ray diagram):
• Umbra (Total Eclipse): The dark, inner conical shadow cast by the Moon where all direct sunlight is completely blocked. Observers on Earth within the umbral path experience total darkness (a total solar eclipse).
• Penumbra (Partial Eclipse): The lighter, outer region of shadow surrounding the umbra where sunlight is only partially blocked. Observers within the penumbra see only a fraction of the Sun obscured (a partial solar eclipse).`,
        maxMarks: 7
      },
      {
        subId: "(c)",
        prompt: `(i) State two fundamental physical differences between a physical change and a chemical change.
(ii) Give one clear everyday example each of a physical change and a chemical change.`,
        workedSolution: `(i) Differences:
1. Formation of New Substances: In a physical change, no new chemical substance is formed (only physical state or appearance changes). In a chemical change, new chemical substances with entirely different properties are synthesized.
2. Reversibility & Energy: Physical changes are easily reversible by simple physical methods and involve small energy changes. Chemical changes are permanent, irreversible by physical means, and involve significant absorption or release of energy.

(ii) Examples:
• Physical change: Melting of solid ice into liquid water (or dissolution of common salt in water).
• Chemical change: Atmospheric rusting of an iron nail (or combustion of firewood into ash).`,
        maxMarks: 6
      }
    ]
  }
];

export const SET_BECE_2001_SCIENCE_P2 = {
  id: "paper_2001_variant_p2",
  year: 2001,
  setNumber: 115,
  paperType: 2,
  subject: "Integrated Science",
  title: "2001 BECE Integrated Science Paper 2 (Theory & Practical)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 75,
  instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 4,
  questions: SET_BECE_2001_SCIENCE_P2_QUESTIONS
};
