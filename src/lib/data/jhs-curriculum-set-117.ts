/**
 * 2000 BECE Integrated Science Paper 2 (Set 117 Practical & Theory Essay Test Variant)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_2000_variant
 * Set Number: Set 117
 * Format: 4 Comprehensive Essay Questions (20 marks each) = 80 Marks Total
 * Reconstructed Visual Setups:
 *  - svgQ2bLiftingWork: Vertical lifting work mechanics on an 80 kg mass
 * 
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
 */

export const svgQ2bLiftingWork = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 180' width='100%' height='160' style='max-width: 420px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><line x1='30' y1='150' x2='310' y2='150' stroke='#64748b' stroke-width='2.5'/><text x='50' y='165' font-size='9' font-weight='bold' fill='#64748b'>Ground Level</text><line x1='120' y1='150' x2='120' y2='40' stroke='#38bdf8' stroke-width='2' stroke-dasharray='4,3'/><polygon points='116,46 120,38 124,46' fill='#38bdf8'/><polygon points='116,144 120,152 124,144' fill='#38bdf8'/><text x='105' y='95' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='end'>h = 5.0 m</text><g transform='translate(170, 30)'><rect x='0' y='0' width='65' height='45' rx='3' fill='#1e293b' stroke='#f59e0b' stroke-width='2'/><text x='32' y='26' font-size='11' font-weight='bold' fill='#ffffff' text-anchor='middle'>80 kg</text><line x1='32' y1='45' x2='32' y2='95' stroke='#ef4444' stroke-width='2.5'/><polygon points='28,88 32,98 36,88' fill='#ef4444'/><text x='42' y='80' font-size='10' font-weight='bold' fill='#ef4444'>Weight = 800 N</text><line x1='32' y1='0' x2='32' y2='-20' stroke='#10b981' stroke-width='2.5'/><polygon points='28,-14 32,-24 36,-14' fill='#10b981'/><text x='42' y='-10' font-size='10' font-weight='bold' fill='#10b981'>Effort F = 800 N</text></g><text x='170' y='170' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>WORK DONE = FORCE x DISTANCE = 800 N x 5.0 m = 4,000 J</text></svg></div>";

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

export const SET_BECE_2000_SCIENCE_P2_QUESTIONS: Paper2Question[] = [
  // ==========================================
  // QUESTION 1: HYGIENE, MATTER, LEVERS & SATELLITES (20 MARKS)
  // ==========================================
  {
    questionNumber: "1",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) What is personal hygiene in community health and medicine?
(ii) List four practical daily routines by which personal hygiene can be maintained effectively.`,
        workedSolution: `(i) Definition of personal hygiene:
The practice of maintaining personal bodily cleanliness, grooming, and sanitation to preserve physical health, boost well-being, and prevent the transmission of infectious diseases.

(ii) Four daily maintenance routines:
1. Bathing the whole body thoroughly with clean water and soap at least twice daily.
2. Brushing the teeth and cleaning the oral cavity in the morning and after meals.
3. Washing hands thoroughly with soap under running water after using the toilet and before handling food.
4. Keeping fingernails and toenails short, clean, and neatly trimmed.
5. Wearing freshly washed, clean clothes and laundering beddings regularly.`,
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: `Define each of the following terms, giving two valid scientific examples in each case:
(i) Chemical compound;
(ii) Physical mixture.`,
        workedSolution: `(i) Chemical compound:
A pure chemical substance composed of two or more different elements chemically bonded together in a fixed, definite stoichiometric ratio by mass, which can only be broken down by chemical reactions.
• Examples: Pure water ($\\text{H}_2\\text{O}$), Sodium chloride ($\\text{NaCl}$), Carbon dioxide ($\\text{CO}_2$).

(ii) Physical mixture:
A material system made up of two or more distinct substances physically combined in any proportion, where each individual component retains its unique chemical identity and properties, and can be separated by physical methods.
• Examples: Atmospheric air, Brine (salt solution), Brass alloy, Granitic soil.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: `(i) What is a simple machine in physical mechanics?
(ii) Give one clear practical example each of a:
  (α) First-class lever;
  (β) Second-class lever;
  (γ) Third-class lever.`,
        workedSolution: `(i) Definition of simple machine:
A mechanical tool or device that makes work easier, faster, or more convenient by altering the magnitude, speed, or direction of an applied effort force.

(ii) Lever examples:
• (α) First-class lever (Fulcrum between Effort and Load): A pair of scissors, a crowbar, a see-saw, or claw hammer pulling nails.
• (β) Second-class lever (Load between Fulcrum and Effort): A builder's wheelbarrow, a nutcracker, or a crown-cap bottle opener.
• (γ) Third-class lever (Effort between Fulcrum and Load): A pair of tweezers / forceps, a fishing rod, or sugar tongs.`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: `(i) What is an astronomical or artificial satellite?
(ii) State two vital modern telecommunication or scientific uses of artificial satellites orbiting the Earth.`,
        workedSolution: `(i) Definition of satellite:
A celestial or manufactured body that revolves in a closed gravitational orbit around a more massive primary planet (e.g., the Moon orbiting Earth).

(ii) Uses of artificial satellites:
1. Global telecommunications: Relaying international telephone calls, satellite television broadcasting, and high-speed internet data across continents.
2. Meteorological monitoring: Tracking global weather patterns, cloud movements, and early warnings for tropical storms and hurricanes.
3. Satellite navigation: Providing Global Positioning System (GPS) signals for aviation, maritime transport, and vehicle navigation.`,
        maxMarks: 4
      }
    ]
  },

  // ==========================================
  // QUESTION 2: FORCES, WORK, SEPARATION & FLOWERS (20 MARKS)
  // ==========================================
  {
    questionNumber: "2",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: "What is an electrostatic force in physical science?",
        workedSolution: `An electrostatic force is a non-contact attractive or repulsive force exerted between stationary electrical charges across a distance, where like charges repel each other and unlike charges attract ($F = \\frac{k q_1 q_2}{r^2}$).`,
        maxMarks: 3
      },
      {
        subId: "(b)",
        prompt: `(i) State the official S.I. unit of:
  (α) Mechanical force;
  (β) Mechanical work.
(ii) A heavy concrete block of mass $80.0\\text{ kg}$ is lifted vertically through a vertical height of $5.0\\text{ m}$. Calculate the work done on the block:

${svgQ2bLiftingWork}
$$[\\text{Take acceleration due to gravity, } g = 10.0\\text{ m s}^{-2}]$$`,
        workedSolution: `(i) S.I. units:
• (α) Force: Newton [symbol: $\\text{N}$]
• (β) Work: Joule [symbol: $\\text{J}$]

(ii) Work done calculation (refer to diagram):
• Step 1: Calculate the upward lifting force required to overcome weight ($W = mg$):
$$F = m \\times g = 80.0\\text{ kg} \\times 10.0\\text{ m s}^{-2} = 800.0\\text{ N}$$
• Step 2: Apply work formula ($W = F \\times h$):
$$\\text{Work Done } (W) = 800.0\\text{ N} \\times 5.0\\text{ m} = 4,000.0\\text{ Joules (J)}$$
Answer: The work done on the block is $$4,000\\text{ J}$$.`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: "Describe briefly how you would separate the constituents of a dry heterogeneous mixture of common salt (sodium chloride) and insoluble powdered sulfur in a school laboratory.",
        workedSolution: `Separation protocol:
1. Dissolution: Place the salt-sulfur mixture into a glass beaker, add distilled water, and stir thoroughly with a glass rod. The soluble sodium chloride dissolves completely to form an aqueous saline solution, while the insoluble sulfur powder remains suspended and undissolved.
2. Filtration: Pour the mixture into a glass filter funnel fitted with folded filter paper over a conical flask. The insoluble powdered sulfur is retained on the filter paper as residue. Wash the residue with cold distilled water and allow it to dry.
3. Evaporation: Pour the clear salt filtrate into an evaporating dish and heat it gently over a Bunsen flame until all water evaporates off as steam, leaving behind pure white sodium chloride crystals.`,
        maxMarks: 5
      },
      {
        subId: "(d)",
        prompt: `In botanical morphology, state three distinct structural characteristics each of:
(i) An insect-pollinated (entomophilous) flower;
(ii) A wind-pollinated (anemophilous) flower.`,
        workedSolution: `(i) Characteristics of insect-pollinated flowers:
1. Possess large, brightly colored petals (corolla) to visually attract insect pollinators.
2. Possess scented petals and specialized nectaries that secrete sweet nectar as a reward.
3. Produce relatively small quantities of large, heavy, sticky or spiky pollen grains that cling to insect bodies.
4. Stigmas are compact, sticky, and enclosed inside the floral petals.

(ii) Characteristics of wind-pollinated flowers:
1. Possess small, dull, green or inconspicuous petals (or lack petals entirely).
2. Scentless and lack nectaries.
3. Produce vast quantities of tiny, smooth, lightweight, dry pollen grains easily carried by air currents.
4. Possess long, pendulous filaments with versatile anthers protruding outside the flower, and large, feathery stigmas exposed to catch airborne pollen.`,
        maxMarks: 6
      }
    ]
  },

  // ==========================================
  // QUESTION 3: REPRODUCTION, DENSITY & ELEMENTS (20 MARKS)
  // ==========================================
  {
    questionNumber: "3",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `(i) What is biological fertilization in human reproduction?
(ii) Describe briefly the physiological processes that lead to fertilization in humans following sexual intercourse.`,
        workedSolution: `(i) Definition of fertilization:
The biological fusion of the haploid nucleus of a male spermatozoon ($n = 23$) with the haploid nucleus of a mature female ovum ($n = 23$) to form a single diploid zygote ($2n = 46$).

(ii) Pathway to fertilization:
1. Insemination: During coitus, millions of motile spermatozoa are ejaculated into the upper vaginal canal near the cervix.
2. Sperm Migration: Viable spermatozoa swim actively using their flagella through the cervical mucus, ascend through the uterine cavity, and enter the fallopian tubes (oviducts).
3. Capacitation & Acrosome Reaction: Surviving sperm undergo capacitation; upon encountering the mature ovum in the upper third of the fallopian tube (ampulla), sperm release acrosomal enzymes to penetrate the outer corona radiata and zona pellucida.
4. Syngamy: The head of a single fertilizing spermatozoon penetrates the vitelline membrane; the egg immediately triggers a cortical reaction to block polyspermy. The male and female pronuclei fuse together to form a diploid zygote.`,
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `(i) Define the physical term density of a substance.
(ii) Describe briefly how the density of an irregularly shaped insoluble stone can be experimentally determined in a school laboratory.`,
        workedSolution: `(i) Definition of density:
The mass per unit volume of a physical substance ($\\text{Density } (\\rho) = \\frac{\\text{Mass } (m)}{\\text{Volume } (V)}$), expressed in $\\text{kg m}^{-3}$ or $\\text{g cm}^{-3}$.

(ii) Determination of stone density:
1. Measuring Mass: Weigh the dry stone on a laboratory beam balance or digital electronic balance and record its mass in grams ($m$).
2. Measuring Volume (Displacement Method): Pour water into a graduated measuring cylinder to a convenient level and record the initial volume reading ($V_1$) at the bottom of the meniscus.
3. Tie a fine thread around the stone and lower it gently into the water until fully submerged.
4. Record the new, elevated water volume level ($V_2$).
5. Calculate the volume displaced:
$$V = V_2 - V_1$$
6. Calculate density:
$$\\rho = \\frac{m}{V_2 - V_1}$$`,
        maxMarks: 6
      },
      {
        subId: "(c)",
        prompt: `(i) What is a chemical element?
(ii) Classify each of the following chemical substances as an Element, a Compound, or a Mixture:\n**Pure water, Atmospheric air, Solid potassium, Ethanol alcohol, Common table salt, Cane sugar.**`,
        workedSolution: `(i) Definition of an element:
A pure chemical substance that consists of only one type of atom (having the same atomic number) that cannot be split or decomposed into simpler substances by ordinary chemical reactions.

(ii) Classification Table:

| Substance | Chemical Classification | Reason / Composition |
| :--- | :--- | :--- |
| **Solid potassium** | **Element** | Pure metallic element ($\\text{K}$) |
| **Pure water** | **Compound** | Chemically bonded hydrogen and oxygen ($\\text{H}_2\\text{O}$) |
| **Ethanol alcohol** | **Compound** | Chemically bonded organic compound ($\\text{C}_2\\text{H}_5\\text{OH}$) |
| **Common table salt** | **Compound** | Chemically bonded ionic compound ($\\text{NaCl}$) |
| **Cane sugar** | **Compound** | Chemically bonded carbohydrate disaccharide ($\\text{C}_{12}\\text{H}_{22}\\text{O}_{11}$) |
| **Atmospheric air** | **Mixture** | Physical combination of gases ($\\text{N}_2, \\text{O}_2, \\text{Ar}, \\text{CO}_2, \\text{H}_2\\text{O}$) |`,
        maxMarks: 7
      }
    ]
  },

  // ==========================================
  // QUESTION 4: COLLOIDS, POLLUTION & ENERGY (20 MARKS)
  // ==========================================
  {
    questionNumber: "4",
    isPracticalSectionA: false,
    subQuestions: [
      {
        subId: "(a)",
        prompt: `Define each of the following scientific terms:
(i) Metallic alloy;
(ii) Molecular diffusion;
(iii) Chemical colloid.`,
        workedSolution: `(i) Metallic alloy:
A homogeneous solid solution or uniform metallic mixture composed of two or more metals, or a metal combined with a non-metal (such as carbon), melted together to improve mechanical strength or corrosion resistance.

(ii) Molecular diffusion:
The spontaneous net movement of particles (atoms, ions, or molecules) from a region of higher concentration to a region of lower concentration down a concentration gradient as a result of their random thermal kinetic motion.

(iii) Chemical colloid:
A heterogeneous two-phase mixture consisting of microscopic dispersed particles (ranging from 1 to 1000 nanometers) suspended evenly throughout a continuous dispersion medium, which do not settle out rapidly upon standing and scatter light via the Tyndall effect.`,
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `Give two distinct commercial or everyday examples of each of:
(i) A metallic alloy;
(ii) A colloidal system.`,
        workedSolution: `(i) Examples of alloys:
1. Brass (Copper and Zinc)
2. Bronze (Copper and Tin)
3. Carbon steel (Iron and Carbon)
4. Duralumin (Aluminum, Copper, Magnesium, Manganese)

(ii) Examples of colloids:
1. Milk (liquid fat droplets emulsified in water)
2. Fog / Mist (liquid water droplets suspended in air)
3. Smoke (solid carbon soot particulates dispersed in air)
4. Paint / Mayonnaise / Gelatin jelly`,
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: `(i) What is environmental pollution?
(ii) List two specific harmful chemical pollutants each of:
  (α) Atmospheric air;
  (β) Aquatic bodies (water);
  (γ) Terrestrial land (soil).`,
        workedSolution: `(i) Definition of environmental pollution:
The introduction of harmful chemical contaminants, solid waste, toxic effluents, or excessive energy (noise, heat, radiation) into the natural environment at concentrations that produce adverse harm to living organisms and ecological systems.

(ii) Harmful pollutants:
• (α) Air pollutants:
  1. Carbon monoxide ($CO$) from incomplete vehicular exhaust combustion.
  2. Sulfur dioxide ($SO_2$) from industrial smokestacks causing acid rain.
  3. Particulate soot / smoke dust.
• (β) Water pollutants:
  1. Untreated municipal domestic sewage containing fecal pathogens.
  2. Agricultural runoff carrying synthetic chemical fertilizers and pesticides.
  3. Industrial heavy metal effluents (mercury, lead, cyanide from mining).
• (γ) Land pollutants:
  1. Non-biodegradable polythene plastic bags and synthetic packaging.
  2. Discarded chemical batteries leaching toxic heavy metals (cadmium, lead).
  3. Indiscriminate domestic solid refuse.`,
        maxMarks: 6
      },
      {
        subId: "(d)",
        prompt: `A ripe coconut of gravitational weight $50.0\\text{ N}$ hangs stationary on a palm tree at a vertical height of $15.0\\text{ m}$ above the ground:
(i) Name the specific form of mechanical energy possessed by the elevated coconut.
(ii) Calculate the numerical value of this stored energy in Joules, clearly showing your formula and working.`,
        workedSolution: `(i) Form of energy:
Gravitational Potential Energy ($P.E.$).

(ii) Calculation:
Formula:
$$\\text{Gravitational Potential Energy } (P.E.) = \\text{Weight } (W) \\times \\text{Height } (h)$$
$$(P.E. = mgh = W \\times h)$$
Substitute given values ($W = 50.0\\text{ N}$, $h = 15.0\\text{ m}$):
$$P.E. = 50.0\\text{ N} \\times 15.0\\text{ m} = 750.0\\text{ Joules (J)}$$
Answer: The stored energy of the coconut is $$750\\text{ J}$$.`,
        maxMarks: 4
      }
    ]
  }
];

export const SET_BECE_2000_SCIENCE_P2 = {
  id: "paper_2000_variant_p2",
  year: 2000,
  setNumber: 117,
  paperType: 2,
  subject: "Integrated Science",
  title: "2000 BECE Integrated Science Paper 2 (Theory & Practical)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 75,
  instructions: "Answer four questions in all. All working must be clearly shown. Credit will be given for clarity of expression and orderly presentation of material.",
  totalQuestions: 4,
  questions: SET_BECE_2000_SCIENCE_P2_QUESTIONS
};
