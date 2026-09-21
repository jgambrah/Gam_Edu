/**
 * 2013 BECE Integrated Science Examination (Set 122 Cloned Practice Variant)
 * 
 * Target Document: global_curriculum/jhs/subjects/science/past_papers/paper_2013_variant
 * Set Number: Set 122
 * Format: 
 *   - Paper 1 (40 Objectives, exactly 10 A, 10 B, 10 C, 10 D)
 *   - Paper 2 (Section A Practical [40 marks across Q1(a)-(d)] + Section B Theory [Q2-Q6, 20 marks each = 60 marks])
 * Reconstructed Visual Setups (Directly from photographic sources):
 *   - svgQ1aOsmosisYam: Living plant tissue osmometer setup A & B [IMG_2615.jpg]
 *   - svgQ1bZincAcidReaction: Displacement reaction of zinc in dilute HCl [IMG_2616.jpg]
 *   - svgQ1cThermosFlask: Double-walled vacuum thermos flask anatomy [IMG_2617.jpg]
 *   - svgQ1dSoilDrainage: Soil porosity & water-holding capacity cylinders X, Y, Z [IMG_2618.jpg]
 * 
 * Copyright: © GAM IT Solutions (GAM EDU). All rights reserved.
 */

export interface QuestionItem {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
}

export interface Paper2SubQuestion {
  subId: string;
  prompt: string;
  workedSolution: string;
  maxMarks: number;
}

export interface Paper2Question {
  questionNumber: string;
  isPracticalSectionA?: boolean;
  subQuestions: Paper2SubQuestion[];
}

export const svgQ1aOsmosisYam = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 210' width='100%' height='195' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Setup A: Beginning of Experiment (Left) --><g transform='translate(25, 20)'><text x='70' y='12' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Set-up A (Beginning)</text><!-- Outer Glass Beaker --><rect x='10' y='25' width='120' height='120' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.8'/><!-- Water in Beaker --><rect x='11' y='75' width='118' height='69' fill='#38bdf8' opacity='0.25'/><!-- Yam / Potato Cup I --><path d='M 35 65 L 45 135 L 95 135 L 105 65 L 90 65 L 85 120 L 55 120 L 50 65 Z' fill='#a16207' stroke='#78350f' stroke-width='1.5'/><line x1='35' y1='65' x2='20' y2='52' stroke='#f59e0b' stroke-width='1.5'/><text x='16' y='48' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='end'>I</text><!-- Sugar Solution inside Yam Cavity at Level II --><rect x='51' y='95' width='38' height='25' fill='#facc15' opacity='0.5'/><line x1='50' y1='95' x2='90' y2='95' stroke='#facc15' stroke-width='1.5'/><line x1='90' y1='95' x2='108' y2='95' stroke='#cbd5e1' stroke-width='1.5'/><text x='114' y='99' font-size='12' font-weight='bold' fill='#cbd5e1'>II</text><text x='70' y='165' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Set-up A</text></g><!-- Setup B: End of Experiment (Right) --><g transform='translate(205, 20)'><text x='70' y='12' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Set-up B (After hours)</text><!-- Outer Glass Beaker --><rect x='10' y='25' width='120' height='120' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.8'/><!-- Depleted Water in Beaker --><rect x='11' y='105' width='118' height='39' fill='#38bdf8' opacity='0.25'/><!-- Yam / Potato Cup --><path d='M 35 65 L 45 135 L 95 135 L 105 65 L 90 65 L 85 120 L 55 120 L 50 65 Z' fill='#a16207' stroke='#78350f' stroke-width='1.5'/><!-- Elevated Solution Level inside Yam Cavity --><rect x='51' y='72' width='38' height='48' fill='#facc15' opacity='0.6'/><line x1='50' y1='72' x2='90' y2='72' stroke='#ef4444' stroke-width='2'/><text x='70' y='165' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>Set-up B</text></g><text x='190' y='195' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LIVING PLANT TISSUE OSMOMETER INVESTIGATION</text></svg></div>";
export const svgQ1bZincAcidReaction = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 210' width='100%' height='195' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Test Tube Outline --><g transform='translate(110, 25)'><path d='M 10 10 L 10 125 A 25 25 0 0 0 60 125 L 60 10' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='2'/><ellipse cx='35' cy='10' rx='25' ry='6' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='85' y='25' font-size='10' font-weight='bold' fill='#38bdf8'>Test tube</text><!-- Dilute Hydrochloric Acid Content --><path d='M 11 65 L 11 125 A 24 24 0 0 0 59 125 L 59 65 Z' fill='#38bdf8' opacity='0.3'/><line x1='60' y1='75' x2='125' y2='75' stroke='#94a3b8' stroke-width='1.2'/><text x='130' y='79' font-size='10' font-weight='bold' fill='#cbd5e1'>Dilute hydrochloric acid</text><!-- Rising Gas Bubbles --><circle cx='30' cy='105' r='3' fill='#ffffff' opacity='0.8'/><circle cx='40' cy='95' r='2.5' fill='#ffffff' opacity='0.8'/><circle cx='25' cy='85' r='3.5' fill='#ffffff' opacity='0.8'/><circle cx='45' cy='78' r='3' fill='#ffffff' opacity='0.8'/><circle cx='35' cy='55' r='3.5' fill='#ffffff' opacity='0.8'/><circle cx='28' cy='40' r='4' fill='#ffffff' opacity='0.8'/><line x1='45' y1='85' x2='125' y2='95' stroke='#94a3b8' stroke-width='1.2'/><text x='130' y='99' font-size='10' font-weight='bold' fill='#ffffff'>Bubbles of gas</text><!-- Granulated Zinc Metal at Bottom --><polygon points='25,135 38,128 48,138 32,142' fill='#94a3b8' stroke='#cbd5e1' stroke-width='1.5'/><polygon points='18,138 28,132 25,145 15,142' fill='#94a3b8' stroke='#cbd5e1' stroke-width='1.5'/><line x1='50' y1='138' x2='125' y2='125' stroke='#94a3b8' stroke-width='1.2'/><text x='130' y='129' font-size='10' font-weight='bold' fill='#94a3b8'>Pieces of zinc</text></g><text x='170' y='195' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>ACTION OF DILUTE ACID ON A METALLIC ELEMENT</text></svg></div>";
export const svgQ1cThermosFlask = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 250' width='100%' height='230' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Outer Plastic/Metal Casing --><g transform='translate(90, 20)'><!-- Stopper I --><polygon points='50,15 90,15 85,45 55,45' fill='#d97706' stroke='#b45309' stroke-width='1.5'/><line x1='90' y1='30' x2='145' y2='30' stroke='#d97706' stroke-width='1.5'/><text x='152' y='34' font-size='12' font-weight='bold' fill='#d97706'>I</text><!-- Outer Protective Casing --><path d='M 40 45 L 100 45 L 115 75 L 115 200 L 25 200 L 25 75 Z' fill='none' stroke='#64748b' stroke-width='2'/><!-- Double-Walled Silvered Glass Vessel II --><path d='M 50 48 L 90 48 L 105 75 L 105 185 A 15 15 0 0 1 70 195 A 15 15 0 0 1 35 185 L 35 75 Z' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='2.5'/><line x1='105' y1='85' x2='145' y2='85' stroke='#38bdf8' stroke-width='1.5'/><text x='152' y='89' font-size='12' font-weight='bold' fill='#38bdf8'>II</text><!-- Evacuated Vacuum Space III between walls --><line x1='105' y1='135' x2='145' y2='135' stroke='#cbd5e1' stroke-width='1.5'/><text x='152' y='139' font-size='12' font-weight='bold' fill='#cbd5e1'>III</text><!-- Cork Support Pad IV at Bottom --><rect x='55' y='190' width='30' height='10' fill='#d97706' stroke='#b45309'/><line x1='85' y1='195' x2='145' y2='195' stroke='#d97706' stroke-width='1.5'/><text x='152' y='199' font-size='12' font-weight='bold' fill='#d97706'>IV</text><!-- Vacuum Seal Tip V at Base --><circle cx='70' cy='198' r='2' fill='#ef4444'/><line x1='70' y1='205' x2='145' y2='220' stroke='#ef4444' stroke-width='1.5'/><text x='152' y='224' font-size='12' font-weight='bold' fill='#ef4444'>V</text></g><text x='170' y='242' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>DOUBLE-WALLED THERMOS FLASK ANATOMY</text></svg></div>";
export const svgQ1dSoilDrainage = "<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Soil X Setup --><g transform='translate(25, 20)'><text x='45' y='12' font-size='13' font-weight='bold' fill='#38bdf8' text-anchor='middle'>X</text><!-- Funnel with Soil --><polygon points='15,25 75,25 50,60 50,80 40,80 40,60' fill='#d97706' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/><!-- Cotton Wool Plug --><circle cx='45' cy='60' r='3.5' fill='#ffffff'/><!-- Measuring Cylinder --><rect x='25' y='80' width='40' height='95' fill='none' stroke='#38bdf8' stroke-width='1.5'/><!-- Water Level in Cylinder --><rect x='26' y='110' width='38' height='64' fill='#38bdf8' opacity='0.5'/></g><!-- Soil Y Setup --><g transform='translate(135, 20)'><text x='45' y='12' font-size='13' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Y</text><polygon points='15,25 75,25 50,60 50,80 40,80 40,60' fill='#a16207' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/><circle cx='45' cy='60' r='3.5' fill='#ffffff'/><rect x='25' y='80' width='40' height='95' fill='none' stroke='#38bdf8' stroke-width='1.5'/><rect x='26' y='135' width='38' height='39' fill='#38bdf8' opacity='0.5'/></g><!-- Soil Z Setup --><g transform='translate(245, 20)'><text x='45' y='12' font-size='13' font-weight='bold' fill='#10b981' text-anchor='middle'>Z</text><polygon points='15,25 75,25 50,60 50,80 40,80 40,60' fill='#78350f' opacity='0.7' stroke='#38bdf8' stroke-width='1.5'/><circle cx='45' cy='60' r='3.5' fill='#ffffff'/><rect x='25' y='80' width='40' height='95' fill='none' stroke='#38bdf8' stroke-width='1.5'/><rect x='26' y='155' width='38' height='19' fill='#38bdf8' opacity='0.5'/></g><!-- Labels for Parts I, II, III, IV on the Right with Leader Lines --><line x1='320' y1='48' x2='345' y2='48' stroke='#38bdf8' stroke-width='1.5'/><text x='352' y='52' font-size='12' font-weight='bold' fill='#38bdf8'>I</text><line x1='320' y1='80' x2='345' y2='80' stroke='#ffffff' stroke-width='1.5'/><text x='352' y='84' font-size='12' font-weight='bold' fill='#ffffff'>II</text><line x1='325' y1='120' x2='345' y2='120' stroke='#38bdf8' stroke-width='1.5'/><text x='352' y='124' font-size='12' font-weight='bold' fill='#38bdf8'>III</text><line x1='325' y1='175' x2='345' y2='175' stroke='#38bdf8' stroke-width='1.5'/><text x='352' y='179' font-size='12' font-weight='bold' fill='#38bdf8'>IV</text><text x='190' y='215' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>INVESTIGATION ON PHYSICAL PROPERTIES OF SOILS X, Y, AND Z</text></svg></div>";

export const SET_BECE_2013_SCIENCE_P1_QUESTIONS: QuestionItem[] = [
  {
    "number": 1,
    "prompt": "In the International System of Units (S.I.), what is the official base unit for measuring thermodynamic temperature?",
    "options": [
      "Kelvin [K]",
      "Degree Celsius [°C]",
      "Joule [J]",
      "Candela [cd]"
    ],
    "correctAnswer": "Kelvin [K]",
    "hint": "The absolute temperature scale starting from absolute zero (0 K = -273.15 °C).",
    "workedSolution": "The Kelvin (K) is the official S.I. base unit of thermodynamic temperature. Degree Celsius is an accepted metric scale, Joule measures energy, and Candela measures luminous intensity.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "Atmospheric air sampled from the lower troposphere is classified chemically as a:",
    "options": [
      "Homogeneous gas-in-gas mixture",
      "Liquid-in-liquid colloidal suspension",
      "Solid-in-liquid saturated solution",
      "Solid-in-solid metallic alloy"
    ],
    "correctAnswer": "Homogeneous gas-in-gas mixture",
    "hint": "Consists of nitrogen, oxygen, carbon dioxide, and noble gases physically intermingled without chemical bonding.",
    "workedSolution": "Air is a homogeneous gas-in-gas mixture composed predominantly of nitrogen (~78%) and oxygen (~21%) with minor concentrations of argon, carbon dioxide, and water vapor.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Which of the following routine aquaculture husbandry activities are involved in the commercial pond rearing of tilapia fish?\\nI. Regular supplementary feeding of fish\\nII. Proper fingerling pond stocking density\\nIII. Water quality and aquatic pest control",
    "options": [
      "I and II only",
      "I and III only",
      "II and III only",
      "I, II and III"
    ],
    "correctAnswer": "I, II and III",
    "hint": "Commercial fish farming requires proper stocking, balanced feeding, and disease/predator control.",
    "workedSolution": "Tilapia farming requires proper pond stocking to avoid overcrowding, regular nutritional feeding for growth, and aquatic pest/water quality management (I, II, and III).",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "In entomophilous flowering plants, which floral structure secretes sugary nectar to attract insect pollinators?",
    "options": [
      "Anther lobes",
      "Basal sepals of the calyx",
      "Petals (specifically the floral nectaries at the corolla base)",
      "Internal ovules inside the ovary"
    ],
    "correctAnswer": "Petals (specifically the floral nectaries at the corolla base)",
    "hint": "Glands situated at the base of brightly colored floral petals.",
    "workedSolution": "Nectaries located at the base of petals secrete sweet sugary nectar that attracts insect pollinators like bees and butterflies to facilitate cross-pollination.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "Which anti-corrosion metallurgical method protects iron and steel articles from atmospheric rusting by coating them with a protective layer of metallic zinc?",
    "options": [
      "Thermal alloying",
      "Galvanizing (Galvanization)",
      "Surface grease application",
      "Protective enamel painting"
    ],
    "correctAnswer": "Galvanizing (Galvanization)",
    "hint": "Sacrificial zinc coating that corrodes preferentially to protect underlying steel.",
    "workedSolution": "Galvanizing is the process of coating iron or steel with a protective layer of zinc, which acts as a physical barrier and sacrificial anode to prevent rusting.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "In soil chemistry, the continuous downward leaching of basic mineral cations (Ca²⁺, Mg²⁺, K⁺) by heavy rainfall results in soil:",
    "options": [
      "Alkalinity (raising soil pH)",
      "Surface wind erosion",
      "Acidity (lowering soil pH)",
      "Coarse macropore porosity"
    ],
    "correctAnswer": "Acidity (lowering soil pH)",
    "hint": "Leaching removes alkaline basic cations, leaving acidic hydrogen and aluminum ions behind.",
    "workedSolution": "Heavy percolation leaches exchangeable basic cations (Ca²⁺, Mg²⁺, K⁺) from topsoil, replacing them with H⁺ and Al³⁺ ions, resulting in soil acidity.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "In classical genetics, the discrete hereditary functional units of DNA transmitted from parents to offspring that dictate biological traits are:",
    "options": [
      "Mature spermatozoa alone",
      "Erythrocyte red blood cells",
      "Genes",
      "Leukocyte white blood cells"
    ],
    "correctAnswer": "Genes",
    "hint": "DNA sequences situated at specific loci on chromosomes.",
    "workedSolution": "Genes are hereditary units of DNA located on chromosomes that carry coded biochemical instructions inherited from parents to govern specific phenotypic traits.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "In astronomy, our gravitationally bound Solar System consists of:",
    "options": [
      "Planet Earth, the Moon, and distant interstellar stars",
      "The central Sun, luminous comets, and meteors alone",
      "The central Sun, eight orbiting planets, their moons, and other celestial bodies",
      "The Sun, planet Earth, and the Moon only"
    ],
    "correctAnswer": "The central Sun, eight orbiting planets, their moons, and other celestial bodies",
    "hint": "A heliocentric system centered on the Sun with orbiting planets, dwarf planets, and asteroids.",
    "workedSolution": "The Solar System comprises the central Sun and all astronomical bodies gravitationally bound to it, including planets, dwarf planets, moons, comets, and asteroids.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "Which livestock management system allows domestic farm animals (such as cattle or sheep) to roam freely over extensive pastures to forage?",
    "options": [
      "The intensive battery system",
      "The semi-intensive housing system",
      "The extensive livestock farming system",
      "The zero-grazing feedlot system"
    ],
    "correctAnswer": "The extensive livestock farming system",
    "hint": "Low-input, free-range grazing system across wide areas of rangeland.",
    "workedSolution": "The extensive livestock system allows animals to roam freely over vast open pasturelands with minimal housing or supplementary feeding, in contrast to intensive indoor housing.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "The biological process of pulmonary ventilation involving external gas exchange between an organism and its environment is termed:",
    "options": [
      "Mitochondrial aerobic respiration",
      "Anaerobic tissue glycolysis",
      "Gaseous exchange (external respiration / breathing)",
      "Cellular internal tissue respiration"
    ],
    "correctAnswer": "Gaseous exchange (external respiration / breathing)",
    "hint": "The physical exchange of oxygen and carbon dioxide across respiratory membranes.",
    "workedSolution": "External respiration refers to the physical exchange of respiratory gases (oxygen intake and carbon dioxide elimination) between the respiratory surface and the environment.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "A rigid mechanical bar that is capable of turning freely about a fixed support pivot when an effort is applied to overcome a load is:",
    "options": [
      "A lever",
      "An inclined plane ramp",
      "A helical screw",
      "A wheel and axle system"
    ],
    "correctAnswer": "A lever",
    "hint": "A simple machine operating on the principle of moments around a fulcrum.",
    "workedSolution": "A lever is a simple machine consisting of a rigid bar pivoted about a fixed fulcrum, used to transmit or multiply mechanical force.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "In electrochemistry, an electrically charged chemical species carrying a net positive charge is called:",
    "options": [
      "A cation",
      "An anion",
      "A neutral neutron",
      "An isolated electron"
    ],
    "correctAnswer": "A cation",
    "hint": "Formed when a neutral atom loses one or more valence electrons (e.g., Na⁺).",
    "workedSolution": "A cation is a positively charged ion formed when a neutral atom loses electrons, migrating toward the negative cathode during electrolysis. Anions are negatively charged.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "Which of the following environmental conservation strategies is the most effective approach to prevent endangered wildlife species from extinction?",
    "options": [
      "Allowing unrestricted hunting and poaching in nature reserves",
      "Strictly protecting, conserving, and restoring their natural ecological habitats",
      "Encouraging apex predators to rapidly outnumber prey",
      "Discharging chemical municipal effluents into their habitats"
    ],
    "correctAnswer": "Strictly protecting, conserving, and restoring their natural ecological habitats",
    "hint": "Preserving national parks and natural reserves prevents habitat fragmentation.",
    "workedSolution": "Habitat destruction is the leading driver of species extinction. Establishing protected wildlife reserves, preventing deforestation, and prohibiting poaching protect endangered species.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "Which of the following physical characteristics is an indispensable property of an ideal thermometric liquid used in liquid-in-glass thermometers?",
    "options": [
      "It must be completely transparent and colorless",
      "It expands uniformly and regularly with equal temperature rises",
      "It boils at 100°C and freezes at 0°C like pure water",
      "It clings tenaciously to the inner capillary walls of glass"
    ],
    "correctAnswer": "It expands uniformly and regularly with equal temperature rises",
    "hint": "Must have a uniform coefficient of thermal expansion and not wet glass.",
    "workedSolution": "A good thermometric fluid (like mercury) must have uniform linear thermal expansion over a wide temperature range, an opaque meniscus, and must not cling to glass.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "Which of the following metallic elements will react with the citric acid in fresh lime juice to liberate flammable hydrogen gas?",
    "options": [
      "Magnesium [Mg]",
      "Metallic copper [Cu]",
      "Metallic lead [Pb]",
      "Metallic silver [Ag]"
    ],
    "correctAnswer": "Magnesium [Mg]",
    "hint": "A reactive metal positioned above hydrogen in the electrochemical reactivity series.",
    "workedSolution": "Magnesium is a reactive metal situated above hydrogen in the reactivity series; it displaces hydrogen from organic acids like citric acid: Mg + 2H⁺ → Mg²⁺ + H₂↑.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "In soil field agronomy, which physical property of soil is routinely evaluated in the field using the finger 'feel method'?",
    "options": [
      "Soil ped structure",
      "Soil thermal temperature",
      "Soil moisture tension",
      "Soil texture (relative proportions of sand, silt, and clay)"
    ],
    "correctAnswer": "Soil texture (relative proportions of sand, silt, and clay)",
    "hint": "Rubbing moist soil between thumb and fingers to detect grittiness, stickiness, or silkiness.",
    "workedSolution": "Soil texture is determined in the field by rubbing moist soil between fingers: sand feels gritty, silt feels smooth and silky, and clay feels sticky and plastic.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "Small expansion gaps are intentionally left between the ends of adjoining steel rails on railway tracks primarily to:",
    "options": [
      "Facilitate rapid cooling of the tracks during nighttime",
      "Accommodate linear thermal expansion during hot weather without track buckling",
      "Allow linear contraction during cold harmattan mornings",
      "Provide access for maintenance technicians"
    ],
    "correctAnswer": "Accommodate linear thermal expansion during hot weather without track buckling",
    "hint": "High solar heat causes solid steel rails to expand linearly in length.",
    "workedSolution": "Steel rails undergo linear thermal expansion when heated by solar radiation. Expansion gaps allow rails to expand freely without buckling or warping the track.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "The electrochemical atmospheric corrosion (rusting) of structural iron and steel components results in which detrimental physical effects?\\nI. Severe loss of mechanical tensile strength\\nII. Structural degradation and flaking disintegration\\nIII. Loss of metallic electrical conductivity",
    "options": [
      "I, II and III",
      "I and II only",
      "I and III only",
      "II and III only"
    ],
    "correctAnswer": "I, II and III",
    "hint": "Hydrated iron (III) oxide is flaky, structurally brittle, and non-conductive.",
    "workedSolution": "Rusting converts strong, ductile, electrically conductive iron into brittle, flaky hydrated iron (III) oxide (Fe₂O₃·xH₂O), destroying strength and conductivity (I, II, and III).",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "In agricultural crop rotation cycles, leguminous crops (such as cowpeas and groundnuts) are cultivated primarily to:",
    "options": [
      "Add large quantities of carbon to the soil",
      "Directly synthesize protein crystals into topsoil",
      "Enrich the soil with fixed nitrogen nitrates",
      "Increase exchangeable potassium ions exclusively"
    ],
    "correctAnswer": "Enrich the soil with fixed nitrogen nitrates",
    "hint": "Root nodules house symbiotic *Rhizobium* bacteria that fix atmospheric nitrogen gas.",
    "workedSolution": "Legumes harbor symbiotic *Rhizobium* bacteria in their root nodules that fix atmospheric nitrogen gas into soil nitrates, naturally restoring soil fertility.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "In community ecology, the specific geographical place or physical environment where an organism naturally lives, feeds, and reproduces is its:",
    "options": [
      "Ecological community",
      "Broad ecosystem",
      "Macro environment",
      "Habitat"
    ],
    "correctAnswer": "Habitat",
    "hint": "The biological 'address' of a living organism (e.g., pond, forest canopy, rotting log).",
    "workedSolution": "A habitat is the specific physical and environmental location where a particular organism lives, feeds, and successfully interbreeds.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "Which chemical treatment method effectively softens both temporary and permanent hard water for domestic laundry?",
    "options": [
      "Addition of potash alum",
      "Addition of washing soda (sodium carbonate)",
      "Municipal chlorination disinfection",
      "Gravity sand filtration"
    ],
    "correctAnswer": "Addition of washing soda (sodium carbonate)",
    "hint": "Na₂CO₃ precipitates dissolved calcium and magnesium ions as insoluble carbonates.",
    "workedSolution": "Adding washing soda (sodium carbonate, Na₂CO₃) precipitates soluble Ca²⁺ and Mg²⁺ ions as insoluble carbonates (CaCO₃↓, MgCO₃↓), softening the water.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "In post-harvest cereal crop processing, dehusking (removing the outer husk) and shelling (detaching kernels from the cob/pod) are carried out on:",
    "options": [
      "Cowpea seeds",
      "Groundnut pods only",
      "Maize [Zea mays]",
      "Sorghum grain"
    ],
    "correctAnswer": "Maize [Zea mays]",
    "hint": "Involves stripping off the fibrous leafy husk from the ear, then removing the hard yellow grains from the central cob.",
    "workedSolution": "Maize processing involves dehusking (removing outer leafy husks) followed by shelling (detaching kernels from the central cob). Groundnuts are decorticated or shelled from pods.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "Typhoid fever (*Salmonella typhi*) is an acute bacterial gastrointestinal infection transmitted to humans primarily through:",
    "options": [
      "Ingesting food and drinking water contaminated with fecal waste",
      "Direct dermal contact with contaminated open skin wounds",
      "Eating freshly harvested raw vegetables exclusively",
      "Drinking chlorinated and boiled municipal pipe water"
    ],
    "correctAnswer": "Ingesting food and drinking water contaminated with fecal waste",
    "hint": "A classical water-borne fecal-oral enteric infection.",
    "workedSolution": "Typhoid fever is caused by *Salmonella typhi* bacteria and spreads via the fecal-oral route through ingestion of water or food contaminated with feces from an infected person or carrier.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "Which of the following physical effects represents an everyday practical ADVANTAGE of mechanical friction?",
    "options": [
      "It significantly increases the mechanical efficiency of simple machines",
      "It allows cutting tools, knives, and axes to be sharpened against abrasive stones",
      "It generates large amounts of wasted thermal heat inside machinery",
      "It progressively wears away the outer rubber soles of footwear"
    ],
    "correctAnswer": "It allows cutting tools, knives, and axes to be sharpened against abrasive stones",
    "hint": "Abrasive contact removes blunt metal layers to create a sharp edge.",
    "workedSolution": "Friction between a blunt knife blade and an abrasive whetstone grinds away metal, enabling tools to be sharpened. Friction also enables walking and vehicular braking.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "A handheld curved steel sickle is a traditional farm harvesting implement used specifically for:",
    "options": [
      "Trimming domestic ornamental hedgerows",
      "Transplanting delicate nursery seedlings",
      "Applying irrigation water to garden beds",
      "Harvesting cereal rice and cutting pasture forage grasses"
    ],
    "correctAnswer": "Harvesting cereal rice and cutting pasture forage grasses",
    "hint": "Features a short wooden handle and a sharp, semicircular curved blade.",
    "workedSolution": "A sickle has a curved blade used for reaping cereal crops like rice and wheat, and for cutting pasture grasses for livestock.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "In pinhole camera optics, what is a permanent characteristic of the optical image formed on the translucent viewing screen?",
    "options": [
      "The image is always upright and erect",
      "The image is significantly magnified in all dimensions",
      "The image is virtual and cannot be captured on a screen",
      "The image is vertically inverted (upside down) and real"
    ],
    "correctAnswer": "The image is vertically inverted (upside down) and real",
    "hint": "Because light travels in straight lines, rays from the top of the object cross through the pinhole to the bottom of the screen.",
    "workedSolution": "Light rays from an object travel in straight lines and cross at the pinhole aperture, forming a real, inverted (upside down), and diminished image on the screen.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "Why is the transplanting of delicate vegetable seedlings from nursery beds to the field carried out in the cool late afternoon?",
    "options": [
      "Complete nighttime darkness triggers rapid cell division",
      "Atmospheric solar heat and plant transpiration rates are minimal, preventing wilt shock",
      "Insect pests and fungal pathogens never attack plants at night",
      "Seedlings require zero soil mineral nutrients during nighttime"
    ],
    "correctAnswer": "Atmospheric solar heat and plant transpiration rates are minimal, preventing wilt shock",
    "hint": "Cooler evening air allows root hairs time to re-establish before facing intense midday transpiration.",
    "workedSolution": "Transplanting in late afternoon minimizes water loss through transpiration, allowing disturbed root systems time to absorb water overnight and recover before facing hot midday sun.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "Which of the following scientific statements regarding chemical molecules are CORRECT?\\nI. They are groups of atoms chemically combined together\\nII. They are groups of atoms physically mixed together\\nIII. They can exist independently as stable entities",
    "options": [
      "I only",
      "II only",
      "I, II and III",
      "I and III only"
    ],
    "correctAnswer": "I and III only",
    "hint": "Molecules are held together by covalent or ionic chemical bonds, not physical mixtures.",
    "workedSolution": "A molecule is an electrically neutral group of two or more atoms held together by chemical bonds that can exist independently (Statements I and III). Statement II describes a mixture.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "Botanical fruits and seeds adapted for long-distance dispersal by atmospheric wind currents typically possess:",
    "options": [
      "Fleshy, succulent, sweet edible pulp",
      "Dense, heavy, waterlogged stony seeds",
      "Sticky glandular hairs with hook prickles",
      "Feathery parachute-like hairs, silky plumes, or lightweight aerodynamic wings"
    ],
    "correctAnswer": "Feathery parachute-like hairs, silky plumes, or lightweight aerodynamic wings",
    "hint": "Examples like dandelion plumes, cotton seeds, or winged mahogany samaras.",
    "workedSolution": "Wind-dispersed seeds (anemochory) are lightweight and feature aerodynamic adaptations such as feathery hairs, silky plumes, or papery wings that catch air currents.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Which of the following solid materials is an electrical conductor that permits electric current to flow through with minimal resistance?",
    "options": [
      "Non-conductive silica glass",
      "Pure deionized distilled water",
      "Solid metallic aluminum",
      "Vulcanized insulating rubber"
    ],
    "correctAnswer": "Solid metallic aluminum",
    "hint": "A metallic element with delocalized valence electrons.",
    "workedSolution": "Aluminum is a metallic conductor possessing delocalized free valence electrons that drift easily under an applied potential difference, conducting current with low resistance.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "In a single chemical molecule of pure water (H₂O), what is the stoichiometric atomic ratio of hydrogen atoms to oxygen atoms?",
    "options": [
      "1:2",
      "2:1",
      "1:3",
      "3:1"
    ],
    "correctAnswer": "2:1",
    "hint": "Two hydrogen atoms combine covalently with one oxygen atom.",
    "workedSolution": "The chemical formula of water is H₂O, indicating a fixed atomic ratio of 2 hydrogen atoms to 1 oxygen atom (2:1).",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "In the specialized complex stomach of polygastric ruminant mammals (such as cattle and goats), B-complex vitamins are synthesized in the:",
    "options": [
      "Rumen (by symbiotic anaerobic fermentative microflora)",
      "True enzymatic abomasum",
      "Omasum (manyplies)",
      "Honeycomb reticulum"
    ],
    "correctAnswer": "Rumen (by symbiotic anaerobic fermentative microflora)",
    "hint": "The large primary fermentation chamber housing millions of bacteria and ciliated protozoa.",
    "workedSolution": "Symbiotic bacteria and protozoa in the rumen ferment cellulose and synthesize all essential B-complex vitamins and Vitamin K, which are later absorbed by the animal.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "Which of the following lifestyle practices provides the most effective protection against the development of chronic hypertension (high blood pressure)?",
    "options": [
      "Consuming alcoholic beverages on a daily basis",
      "Engaging in regular aerobic physical exercise and consuming a low-sodium diet",
      "Eating diets rich in saturated animal fats and refined carbohydrates",
      "Engaging in habitual tobacco smoking"
    ],
    "correctAnswer": "Engaging in regular aerobic physical exercise and consuming a low-sodium diet",
    "hint": "Aerobic exercise lowers vascular resistance and strengthens heart muscle.",
    "workedSolution": "Regular aerobic exercise, managing body weight, and eating a balanced diet low in sodium and saturated fats maintain arterial elasticity and help prevent hypertension.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "The mechanical property of metals that allows them to be stretched and drawn into long, thin conductive electrical wires without snapping is:",
    "options": [
      "Ductility",
      "Malleability (beaten into sheets)",
      "Thermal conductivity",
      "Electrical resistivity"
    ],
    "correctAnswer": "Ductility",
    "hint": "Ductility refers to drawing into wires; malleability refers to beating into thin sheets.",
    "workedSolution": "Ductility is the physical property of a metal that allows it to undergo tensile plastic deformation and be drawn into thin wires (e.g., copper and aluminum wiring).",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "An atom of an element is represented in standard nuclear notation as ₁₃²⁷X. How many uncharged neutrons reside within its nucleus?",
    "options": [
      "13 neutrons",
      "27 neutrons",
      "14 neutrons",
      "40 neutrons"
    ],
    "correctAnswer": "14 neutrons",
    "hint": "Number of neutrons (N) = Mass number (A) - Atomic number (Z) = 27 - 13.",
    "workedSolution": "Neutrons (N) = A - Z = 27 - 13 = 14 neutrons. The nucleus contains 13 protons and 14 neutrons.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "In agricultural seed science, seeds classified as 'viable' are defined as those that:",
    "options": [
      "Possess a living embryo capable of germinating under suitable environmental conditions",
      "Are consumed by pasture animals after field sowing",
      "Contain high concentrations of vegetable oils",
      "Possess a hard, impermeable seed coat"
    ],
    "correctAnswer": "Possess a living embryo capable of germinating under suitable environmental conditions",
    "hint": "Contain an intact, respiring embryo that sprouts when moisture, warmth, and oxygen are supplied.",
    "workedSolution": "Viable seeds possess living, metabolically active embryonic tissues capable of breaking dormancy and germinating into normal seedlings under suitable environmental conditions.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "Which of the following physical phase transformations occurs continuously and spontaneously at the liquid surface at ALL temperatures?",
    "options": [
      "Bulk thermal boiling",
      "Solid melting",
      "Direct sublimation",
      "Evaporation"
    ],
    "correctAnswer": "Evaporation",
    "hint": "Occurs only at the liquid surface below the boiling point; boiling occurs throughout the liquid at a fixed temperature.",
    "workedSolution": "Evaporation is a surface phenomenon occurring at all temperatures, where high-kinetic-energy molecules escape the liquid. Boiling occurs only at a fixed boiling point.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "Which of the following human environmental practices helps maintain the natural equilibrium of the global Carbon Cycle?",
    "options": [
      "Indiscriminate seasonal bush burning",
      "Clear-felling of mature tropical forests",
      "Unrestricted discharge of industrial combustion fumes",
      "Systematic reforestation and replanting of harvested timber trees"
    ],
    "correctAnswer": "Systematic reforestation and replanting of harvested timber trees",
    "hint": "Growing trees absorb atmospheric carbon dioxide via photosynthesis, sequestering carbon.",
    "workedSolution": "Replanting trees (reforestation) expands photosynthetic carbon sinks, absorbing excess atmospheric CO₂ and helping stabilize the global carbon cycle.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "An agricultural farming system in which a farmer cultivates only one single crop species repeatedly on the same plot of land every season is:",
    "options": [
      "Mixed cropping (polyculture)",
      "Monoculture (or monocropping)",
      "Mixed livestock farming",
      "Strip cropping"
    ],
    "correctAnswer": "Monoculture (or monocropping)",
    "hint": "'Mono' means single; growing one crop continuously without rotation.",
    "workedSolution": "Monoculture is the continuous agricultural practice of growing a single crop species on the same piece of land year after year without rotational crops.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "The presence of the green pigment chlorophyll in plant chloroplasts is an essential condition for photosynthesis because chlorophyll:",
    "options": [
      "Absorbs molecular oxygen from the air",
      "Synthesizes carbon dioxide directly inside cells",
      "Excretes water vapor into the air",
      "Traps and absorbs photon radiant solar energy from sunlight"
    ],
    "correctAnswer": "Traps and absorbs photon radiant solar energy from sunlight",
    "hint": "Acts as a photoreceptor pigment capturing blue and red light wavelengths.",
    "workedSolution": "Chlorophyll absorbs photon light energy from sunlight, converting radiant energy into chemical potential energy to drive the light reactions of photosynthesis.",
    "points": 1
  }
];

export const SET_BECE_2013_SCIENCE_P2_QUESTIONS: Paper2Question[] = [
  {
    "questionNumber": "1",
    "isPracticalSectionA": true,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "The diagrams below illustrate a laboratory experiment using living plant tissue to demonstrate a biological principle:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 210' width='100%' height='195' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Setup A: Beginning of Experiment (Left) --><g transform='translate(25, 20)'><text x='70' y='12' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Set-up A (Beginning)</text><!-- Outer Glass Beaker --><rect x='10' y='25' width='120' height='120' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.8'/><!-- Water in Beaker --><rect x='11' y='75' width='118' height='69' fill='#38bdf8' opacity='0.25'/><!-- Yam / Potato Cup I --><path d='M 35 65 L 45 135 L 95 135 L 105 65 L 90 65 L 85 120 L 55 120 L 50 65 Z' fill='#a16207' stroke='#78350f' stroke-width='1.5'/><line x1='35' y1='65' x2='20' y2='52' stroke='#f59e0b' stroke-width='1.5'/><text x='16' y='48' font-size='12' font-weight='bold' fill='#f59e0b' text-anchor='end'>I</text><!-- Sugar Solution inside Yam Cavity at Level II --><rect x='51' y='95' width='38' height='25' fill='#facc15' opacity='0.5'/><line x1='50' y1='95' x2='90' y2='95' stroke='#facc15' stroke-width='1.5'/><line x1='90' y1='95' x2='108' y2='95' stroke='#cbd5e1' stroke-width='1.5'/><text x='114' y='99' font-size='12' font-weight='bold' fill='#cbd5e1'>II</text><text x='70' y='165' font-size='11' font-weight='bold' fill='#38bdf8' text-anchor='middle'>Set-up A</text></g><!-- Setup B: End of Experiment (Right) --><g transform='translate(205, 20)'><text x='70' y='12' font-size='10' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>Set-up B (After hours)</text><!-- Outer Glass Beaker --><rect x='10' y='25' width='120' height='120' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='1.8'/><!-- Depleted Water in Beaker --><rect x='11' y='105' width='118' height='39' fill='#38bdf8' opacity='0.25'/><!-- Yam / Potato Cup --><path d='M 35 65 L 45 135 L 95 135 L 105 65 L 90 65 L 85 120 L 55 120 L 50 65 Z' fill='#a16207' stroke='#78350f' stroke-width='1.5'/><!-- Elevated Solution Level inside Yam Cavity --><rect x='51' y='72' width='38' height='48' fill='#facc15' opacity='0.6'/><line x1='50' y1='72' x2='90' y2='72' stroke='#ef4444' stroke-width='2'/><text x='70' y='165' font-size='11' font-weight='bold' fill='#10b981' text-anchor='middle'>Set-up B</text></g><text x='190' y='195' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>LIVING PLANT TISSUE OSMOMETER INVESTIGATION</text></svg></div>\n\n(i) Name the experimental parts labelled I and II.\n(ii) State two visible differences between set-ups A and B.\n(iii) What specific physiological role is played by the living tissue labelled I in this experiment?\n(iv) Name the fundamental biological principle being demonstrated.\n(v) State one way in which vascular land plants benefit from the principle named in (a)(iv).\n(vi) State one way in which vertebrate animals benefit from the principle named in (a)(iv).",
        "workedSolution": "(i) Names of labelled parts:\n• Part I: Living yam cup (or peeled Irish potato tissue)\n• Part II: Initial level of concentrated sugar solution (liquid meniscus)\n\n(ii) Differences between set-up A and set-up B:\n1. In set-up A, the sugar solution inside the yam cup is at a lower initial level II, whereas in set-up B, the solution has risen to an elevated level.\n2. In set-up A, the distilled water in the outer beaker is at a higher level, whereas in set-up B, the volume of water in the beaker has decreased.\n\n(iii) Role played by Part I:\nThe living cell membranes of the yam tissue act as a selectively permeable (semi-permeable) membrane that permits the passage of water molecules while preventing the passage of sugar solute molecules.\n\n(iv) Biological principle demonstrated:\nOsmosis (the net movement of water molecules from a region of higher water potential to a region of lower water potential across a selectively permeable membrane).\n\n(v) Benefit to plants:\nEnables root hair cells to absorb capillary water and dissolved nutrients from the soil, maintaining cellular turgidity for mechanical support.\n\n(vi) Benefit to animals:\nEnables selective reabsorption of water in the kidney nephrons (loops of Henle and collecting ducts) to prevent dehydration and maintain blood osmoregulation.",
        "maxMarks": 10
      },
      {
        "subId": "(b)",
        "prompt": "In an experiment to investigate the chemical reactivity of zinc, a piece of the metal was dropped into a test tube containing dilute hydrochloric acid:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 210' width='100%' height='195' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Test Tube Outline --><g transform='translate(110, 25)'><path d='M 10 10 L 10 125 A 25 25 0 0 0 60 125 L 60 10' fill='#0284c7' opacity='0.15' stroke='#38bdf8' stroke-width='2'/><ellipse cx='35' cy='10' rx='25' ry='6' fill='#1e293b' stroke='#38bdf8' stroke-width='1.5'/><text x='85' y='25' font-size='10' font-weight='bold' fill='#38bdf8'>Test tube</text><!-- Dilute Hydrochloric Acid Content --><path d='M 11 65 L 11 125 A 24 24 0 0 0 59 125 L 59 65 Z' fill='#38bdf8' opacity='0.3'/><line x1='60' y1='75' x2='125' y2='75' stroke='#94a3b8' stroke-width='1.2'/><text x='130' y='79' font-size='10' font-weight='bold' fill='#cbd5e1'>Dilute hydrochloric acid</text><!-- Rising Gas Bubbles --><circle cx='30' cy='105' r='3' fill='#ffffff' opacity='0.8'/><circle cx='40' cy='95' r='2.5' fill='#ffffff' opacity='0.8'/><circle cx='25' cy='85' r='3.5' fill='#ffffff' opacity='0.8'/><circle cx='45' cy='78' r='3' fill='#ffffff' opacity='0.8'/><circle cx='35' cy='55' r='3.5' fill='#ffffff' opacity='0.8'/><circle cx='28' cy='40' r='4' fill='#ffffff' opacity='0.8'/><line x1='45' y1='85' x2='125' y2='95' stroke='#94a3b8' stroke-width='1.2'/><text x='130' y='99' font-size='10' font-weight='bold' fill='#ffffff'>Bubbles of gas</text><!-- Granulated Zinc Metal at Bottom --><polygon points='25,135 38,128 48,138 32,142' fill='#94a3b8' stroke='#cbd5e1' stroke-width='1.5'/><polygon points='18,138 28,132 25,145 15,142' fill='#94a3b8' stroke='#cbd5e1' stroke-width='1.5'/><line x1='50' y1='138' x2='125' y2='125' stroke='#94a3b8' stroke-width='1.2'/><text x='130' y='129' font-size='10' font-weight='bold' fill='#94a3b8'>Pieces of zinc</text></g><text x='170' y='195' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>ACTION OF DILUTE ACID ON A METALLIC ELEMENT</text></svg></div>\n\n(i) Write a balanced chemical equation for the reaction that occurred in the experiment.\n(ii) Name the gas evolved as bubbles in the test tube.\n(iii) List two other metallic elements that react with dilute hydrochloric acid in a similar way to zinc.\n(iv) List two metallic elements that CANNOT react in a similar way to zinc.\n(v) Name two alternative pieces of laboratory glassware that could have been used instead of the test tube.",
        "workedSolution": "(i) Balanced chemical equation:\n$$\\text{Zn}_{(s)} + 2\\text{HCl}_{(aq)} \\to \\text{ZnCl}_{2(aq)} + \\text{H}_{2(g)}\\uparrow$$\n*(Solid zinc reacts with aqueous hydrochloric acid to yield aqueous zinc chloride and hydrogen gas)*.\n\n(ii) Name of gas evolved:\nHydrogen gas [$\\text{H}_2$].\n\n(iii) Metals that react similarly (positioned above hydrogen in the reactivity series):\nMagnesium [$\\text{Mg}$], Iron [$\\text{Fe}$], or Aluminum [$\\text{Al}$] *(Calcium [$\\text{Ca}$])*.\n\n(iv) Metals that cannot react similarly (positioned below hydrogen):\nCopper [$\\text{Cu}$], Silver [$\\text{Ag}$], or Gold [$\\text{Au}$].\n\n(v) Alternative glass apparatus:\nA conical flask, flat-bottomed flask, or boiling tube.",
        "maxMarks": 10
      },
      {
        "subId": "(c)",
        "prompt": "The diagram below is an illustration of a double-walled vacuum thermos flask:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 340 250' width='100%' height='230' style='max-width: 440px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Outer Plastic/Metal Casing --><g transform='translate(90, 20)'><!-- Stopper I --><polygon points='50,15 90,15 85,45 55,45' fill='#d97706' stroke='#b45309' stroke-width='1.5'/><line x1='90' y1='30' x2='145' y2='30' stroke='#d97706' stroke-width='1.5'/><text x='152' y='34' font-size='12' font-weight='bold' fill='#d97706'>I</text><!-- Outer Protective Casing --><path d='M 40 45 L 100 45 L 115 75 L 115 200 L 25 200 L 25 75 Z' fill='none' stroke='#64748b' stroke-width='2'/><!-- Double-Walled Silvered Glass Vessel II --><path d='M 50 48 L 90 48 L 105 75 L 105 185 A 15 15 0 0 1 70 195 A 15 15 0 0 1 35 185 L 35 75 Z' fill='#0284c7' opacity='0.25' stroke='#38bdf8' stroke-width='2.5'/><line x1='105' y1='85' x2='145' y2='85' stroke='#38bdf8' stroke-width='1.5'/><text x='152' y='89' font-size='12' font-weight='bold' fill='#38bdf8'>II</text><!-- Evacuated Vacuum Space III between walls --><line x1='105' y1='135' x2='145' y2='135' stroke='#cbd5e1' stroke-width='1.5'/><text x='152' y='139' font-size='12' font-weight='bold' fill='#cbd5e1'>III</text><!-- Cork Support Pad IV at Bottom --><rect x='55' y='190' width='30' height='10' fill='#d97706' stroke='#b45309'/><line x1='85' y1='195' x2='145' y2='195' stroke='#d97706' stroke-width='1.5'/><text x='152' y='199' font-size='12' font-weight='bold' fill='#d97706'>IV</text><!-- Vacuum Seal Tip V at Base --><circle cx='70' cy='198' r='2' fill='#ef4444'/><line x1='70' y1='205' x2='145' y2='220' stroke='#ef4444' stroke-width='1.5'/><text x='152' y='224' font-size='12' font-weight='bold' fill='#ef4444'>V</text></g><text x='170' y='242' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>DOUBLE-WALLED THERMOS FLASK ANATOMY</text></svg></div>\n\n(i) Name the anatomical components labelled I, II, III, IV, and V.\n(ii) Explain how the thermos flask minimizes heat loss or heat gain through:\n  (α) Conduction;\n  (β) Convection;\n  (γ) Radiation.\n(iii) State one practical domestic or medical use of the thermos flask.",
        "workedSolution": "(i) Names of parts:\n• Part I: Insulating cork / plastic stopper\n• Part II: Double-walled silvered glass container\n• Part III: Evacuated vacuum space\n• Part IV: Cork / rubber support pad\n• Part V: Vacuum seal tip (fused evacuation point)\n\n(ii) How heat transfer is minimized:\n• (α) Conduction: The vacuum space (III) contains no material particles, preventing heat conduction between the inner and outer walls. The stopper (I) and base supports (IV) are made of poor conductors (cork/plastic).\n• (β) Convection: The vacuum space (III) contains no fluid medium, preventing convection currents. The tightly fitted stopper (I) prevents convection currents with outside air.\n• (γ) Radiation: The silvered mirror coatings on the glass walls (II) reflect infrared thermal radiation back into the flask (preventing loss) and reflect external radiation away (preventing gain).\n\n(iii) Practical use:\nKeeping hot beverages (tea, soup) hot or keeping cold liquids (cold water, vaccine vials) chilled for prolonged periods.",
        "maxMarks": 10
      },
      {
        "subId": "(d)",
        "prompt": "The diagrams below illustrate an experimental set-up on a physical property of soil using three soil types X, Y, and Z:\n\n<div class=\"my-4 flex justify-center\"><svg viewBox='0 0 380 230' width='100%' height='210' style='max-width: 480px;' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='8' fill='#0f172a' stroke='#334155' stroke-width='1.5'/><!-- Soil X Setup --><g transform='translate(25, 20)'><text x='45' y='12' font-size='13' font-weight='bold' fill='#38bdf8' text-anchor='middle'>X</text><!-- Funnel with Soil --><polygon points='15,25 75,25 50,60 50,80 40,80 40,60' fill='#d97706' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/><!-- Cotton Wool Plug --><circle cx='45' cy='60' r='3.5' fill='#ffffff'/><!-- Measuring Cylinder --><rect x='25' y='80' width='40' height='95' fill='none' stroke='#38bdf8' stroke-width='1.5'/><!-- Water Level in Cylinder --><rect x='26' y='110' width='38' height='64' fill='#38bdf8' opacity='0.5'/></g><!-- Soil Y Setup --><g transform='translate(135, 20)'><text x='45' y='12' font-size='13' font-weight='bold' fill='#f59e0b' text-anchor='middle'>Y</text><polygon points='15,25 75,25 50,60 50,80 40,80 40,60' fill='#a16207' opacity='0.5' stroke='#38bdf8' stroke-width='1.5'/><circle cx='45' cy='60' r='3.5' fill='#ffffff'/><rect x='25' y='80' width='40' height='95' fill='none' stroke='#38bdf8' stroke-width='1.5'/><rect x='26' y='135' width='38' height='39' fill='#38bdf8' opacity='0.5'/></g><!-- Soil Z Setup --><g transform='translate(245, 20)'><text x='45' y='12' font-size='13' font-weight='bold' fill='#10b981' text-anchor='middle'>Z</text><polygon points='15,25 75,25 50,60 50,80 40,80 40,60' fill='#78350f' opacity='0.7' stroke='#38bdf8' stroke-width='1.5'/><circle cx='45' cy='60' r='3.5' fill='#ffffff'/><rect x='25' y='80' width='40' height='95' fill='none' stroke='#38bdf8' stroke-width='1.5'/><rect x='26' y='155' width='38' height='19' fill='#38bdf8' opacity='0.5'/></g><!-- Labels for Parts I, II, III, IV on the Right with Leader Lines --><line x1='320' y1='48' x2='345' y2='48' stroke='#38bdf8' stroke-width='1.5'/><text x='352' y='52' font-size='12' font-weight='bold' fill='#38bdf8'>I</text><line x1='320' y1='80' x2='345' y2='80' stroke='#ffffff' stroke-width='1.5'/><text x='352' y='84' font-size='12' font-weight='bold' fill='#ffffff'>II</text><line x1='325' y1='120' x2='345' y2='120' stroke='#38bdf8' stroke-width='1.5'/><text x='352' y='124' font-size='12' font-weight='bold' fill='#38bdf8'>III</text><line x1='325' y1='175' x2='345' y2='175' stroke='#38bdf8' stroke-width='1.5'/><text x='352' y='179' font-size='12' font-weight='bold' fill='#38bdf8'>IV</text><text x='190' y='215' font-size='8' font-weight='bold' fill='#cbd5e1' text-anchor='middle'>INVESTIGATION ON PHYSICAL PROPERTIES OF SOILS X, Y, AND Z</text></svg></div>\n\n(i) Name the apparatus and components labelled I, II, III, and IV.\n(ii) From the set-up, state which soil type has the:\n  (α) Highest water-holding capacity;\n  (β) Least water-holding capacity.\n(iii) Identify each of the three soil types X, Y, and Z.\n(iv) Suggest a suitable title for this laboratory experiment.",
        "workedSolution": "(i) Identification of components:\n• Part I: Glass filter funnel\n• Part II: Cotton wool plug (or folded filter paper)\n• Part III: Graduated measuring cylinder\n• Part IV: Percolated water (filtrate)\n\n(ii) Water-holding capacity:\n• (α) Highest water-holding capacity: Soil type Z (retains the most water, allowing the least filtrate IV to drain).\n• (β) Least water-holding capacity: Soil type X (retains the least water, allowing the highest volume of filtrate IV to drain).\n\n(iii) Names of soil types:\n• Soil X: Sandy soil (coarse texture, rapid drainage, low retention)\n• Soil Y: Loamy soil (medium texture, moderate drainage and retention)\n• Soil Z: Clayey soil (fine texture, slow drainage, high retention)\n\n(iv) Suitable experimental title:\nAn experiment to compare the drainage and water-holding capacity of different soil types (or an experiment to determine soil porosity).",
        "maxMarks": 10
      }
    ]
  },
  {
    "questionNumber": "2",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "List the three fundamental subatomic particles that make up an atom of matter.",
        "workedSolution": "1. Protons (positively charged particles in the nucleus).\n2. Neutrons (neutral, uncharged particles in the nucleus).\n3. Electrons (negatively charged particles orbiting in electron shells).",
        "maxMarks": 3
      },
      {
        "subId": "(b)",
        "prompt": "State four distinct hereditary morphological or physiological features in humans that are passed from parents to offspring.",
        "workedSolution": "1. Eye color (e.g., brown, blue).\n2. Skin pigmentation (complexion).\n3. Natural hair texture and color (e.g., curly, straight).\n4. ABO blood group and Rhesus factor.\n5. Sickle-cell hemoglobin genotype (HbAA, HbAS, HbSS).\n6. Tongue-rolling ability or attached earlobes.",
        "maxMarks": 4
      },
      {
        "subId": "(c)",
        "prompt": "State the specific form of energy transformation that takes place in each of the following everyday activities:\\n(i) A chemical dry cell in active use in a flashlight;\\n(ii) A photovoltaic solar panel in use on a rooftop;\\n(iii) An electric cooking stove in operation;\\n(iv) Hammering a piece of metal repeatedly with a steel hammer.",
        "workedSolution": "(i) Dry cell in use:\nChemical potential energy $\\to$ Electrical energy $\\to$ Light energy $+$ Heat energy.\n\n(ii) Solar panel in use:\nRadiant solar (light) energy $\\to$ Electrical energy.\n\n(iii) Electric stove in use:\nElectrical energy $\\to$ Thermal heat energy.\n\n(iv) Hammering a piece of metal:\nMechanical kinetic energy $\\to$ Acoustic sound energy $+$ Thermal heat energy.",
        "maxMarks": 5
      },
      {
        "subId": "(d)",
        "prompt": "State two practical agronomic ways in which each of the following cultural practices is important in commercial vegetable crop production:\\n(i) Staking;\\n(ii) Pruning.",
        "workedSolution": "(i) Importance of Staking (e.g., in tomatoes):\n1. Keeps developing fruits and foliage off damp soil, preventing soil-borne fungal diseases and fruit rot.\n2. Supports the weak stem against lodging and exposes foliage to sunlight and air, improving photosynthesis and fruit ripening.\n\n(ii) Importance of Pruning:\n1. Removes unproductive auxiliary suckers, diseased branches, and dead leaves, directing nutrients toward developing larger, higher-quality fruits.\n2. Improves airflow and sunlight penetration through the plant canopy, suppressing fungal infections.",
        "maxMarks": 8
      }
    ]
  },
  {
    "questionNumber": "3",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) What is meant by indiscriminate sexual intercourse?\\n(ii) Give two common social or psychological reasons why teenagers indulge in indiscriminate sex.",
        "workedSolution": "(i) Definition of indiscriminate sex:\nEngaging in casual, unprotected sexual intercourse with multiple or uncommitted sexual partners without regard to personal safety, health consequences, or reproductive responsibility.\n\n(ii) Reasons why teenagers indulge:\n1. Negative peer pressure and the desire to conform to adolescent peer groups.\n2. Inadequate sex education and ignorance regarding sexually transmitted infections (STIs) and pregnancy risks.\n3. Poverty and economic hardship leading to transactional sex for financial or material support.\n4. Curiosity, substance abuse, and lack of parental supervision.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "Name two examples each of:\\n(i) Natural sources of visible light;\\n(ii) Artificial sources of light.",
        "workedSolution": "(i) Natural sources of light:\n1. The Sun\n2. Distant stars\n3. Bioluminescent organisms (fireflies, glow-worms)\n4. Lightning flashes\n\n(ii) Artificial sources of light:\n1. Incandescent electric filament bulbs / LED lamps\n2. Kerosene lanterns\n3. Lit wax candles\n4. Fluorescent tubes",
        "maxMarks": 4
      },
      {
        "subId": "(c)",
        "prompt": "State three agronomic ways in which soil texture is important in agricultural crop production.",
        "workedSolution": "1. Determines Water-Holding Capacity and Drainage: Influences the rate at which gravitational water drains and the amount of capillary water available to crop roots.\n2. Determines Soil Aeration: Dictates pore space size, governing the supply of oxygen to roots for respiration.\n3. Influences Cation Exchange Capacity (Nutrient Retention): Fine-textured clayey soils retain dissolved mineral nutrients, whereas sandy soils are prone to leaching.\n4. Influences Ease of Cultivation (Workability): Loamy soils are easily tilled into fine seedbeds, whereas heavy clays require high draft force.",
        "maxMarks": 5
      },
      {
        "subId": "(d)",
        "prompt": "Write down the systematic IUPAC chemical name for each of the following compounds:\\n(i) $\\text{FeS}$;\\n(ii) $\\text{CO}$;\\n(iii) $\\text{Cu}_2\\text{O}$;\\n(iv) $\\text{NaOH}$.",
        "workedSolution": "Systematic IUPAC names:\n• (i) $\\text{FeS}$: Iron (II) sulfide\n• (ii) $\\text{CO}$: Carbon (II) oxide (or Carbon monoxide)\n• (iii) $\\text{Cu}_2\\text{O}$: Copper (I) oxide\n• (iv) $\\text{NaOH}$: Sodium hydroxide",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "4",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) What do the letter symbols L, N, and E represent in a standard three-pin electrical plug?\\n(ii) What is the function of the main fuse box (consumer unit) in household electrical wiring?",
        "workedSolution": "(i) Symbols in a three-pin plug:\n• L: Live terminal / wire (Brown insulation)\n• N: Neutral terminal / wire (Blue insulation)\n• E: Earth terminal / wire (Green with yellow stripes)\n\n(ii) Function of the fuse box:\nActs as the central distribution and electrical safety center in a building; it houses circuit breakers or fuses that automatically cut off power if an overload or short circuit occurs, protecting the installation from electrical fires and electrocution.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "Mention three distinct classes of insect crop pests based on their mouthparts and feeding habits, providing one crop pest example for each class.",
        "workedSolution": "1. Biting and Chewing Pests: Possess strong mandibles to bite and chew foliage and stems (e.g., Grasshoppers, armyworms, caterpillars).\n2. Piercing and Sucking Pests: Possess needle-like stylets to pierce plant tissues and suck sap (e.g., Aphids, cocoa capsids/mirids, mealybugs).\n3. Boring Pests: Bore holes into seeds, stems, or fruits to feed and lay eggs (e.g., Maize weevils, stalk borers, stem borers).",
        "maxMarks": 6
      },
      {
        "subId": "(c)",
        "prompt": "Classify the first four chemical elements of the Periodic Table as either Metals or Non-metals:\\n**Hydrogen [₁H], Helium [₂He], Lithium [₃Li], Beryllium [₄Be].**",
        "workedSolution": "Classification:\n• Hydrogen ($_{1}\\text{H}$): Non-metal (gaseous non-metal)\n• Helium ($_{2}\\text{He}$): Non-metal (noble/inert gas)\n• Lithium ($_{3}\\text{Li}$): Metal (alkali metal)\n• Beryllium ($_{4}\\text{Be}$): Metal (alkaline earth metal)",
        "maxMarks": 4
      },
      {
        "subId": "(d)",
        "prompt": "Name the three primary anatomical types of blood vessels in the human circulatory system.",
        "workedSolution": "1. Arteries: Convey oxygenated blood under high pressure away from the heart to body tissues (except the pulmonary artery).\n2. Veins: Return deoxygenated blood under low pressure from tissues back to the heart (except pulmonary veins).\n3. Capillaries: Microscopic, thin-walled vessels connecting arterioles to venules, where gas and nutrient exchange occurs.",
        "maxMarks": 5
      }
    ]
  },
  {
    "questionNumber": "5",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "(i) State the fundamental difference between an organic fertilizer and an inorganic fertilizer.\\n(ii) State two adverse environmental effects that can result from the excessive application of inorganic fertilizers.",
        "workedSolution": "(i) Organic vs. Inorganic Fertilizer:\n• Organic fertilizer: Derived from natural biological plant or animal waste (compost, farmyard manure) that releases nutrients slowly as it decomposes, improving soil structure and microbial life.\n• Inorganic fertilizer: Synthetically manufactured chemical mineral salts (e.g., N.P.K., urea) containing concentrated, readily soluble nutrients that dissolve quickly.\n\n(ii) Adverse environmental effects:\n1. Eutrophication: Fertilizer runoff washes into rivers and lakes, causing algal blooms that deplete dissolved oxygen and suffocate aquatic life.\n2. Soil Acidification and Salinization: Continuous chemical application can alter soil pH and accumulate salts, damaging beneficial soil microbes.",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "Classify each of the following common substances as an Acid or a Base (Alkali):\\n(i) Unripe lemon juice;\\n(ii) Aqueous wood ash extract;\\n(iii) Lead-acid automobile battery fluid;\\n(iv) Bicarbonate of soda (baking soda).",
        "workedSolution": "Classification:\n• (i) Unripe lemon juice: **Acid** (contains citric and ascorbic acids, $pH < 7$)\n• (ii) Wood ash extract: **Base** (contains potassium hydroxide and potassium carbonate, $pH > 7$)\n• (iii) Car battery fluid: **Acid** (dilute sulfuric acid, $\\text{H}_2\\text{SO}_4$, $pH < 7$)\n• (iv) Bicarbonate of soda: **Base** (sodium hydrogen carbonate, $\\text{NaHCO}_3$, $pH > 7$)",
        "maxMarks": 4
      },
      {
        "subId": "(c)",
        "prompt": "(i) In botanical terms, define what a true fruit is.\\n(ii) State two morphological differences between a fruit and a seed.",
        "workedSolution": "(i) Definition of a fruit:\nA mature, ripened floral ovary developed following fertilization (or through parthenocarpy), which encloses and protects one or more seeds.\n\n(ii) Differences between a Fruit and a Seed:\n\n| Feature | Fruit | Seed |\n| :--- | :--- | :--- |\n| **Origin** | Develops from the ripened **ovary** of a flower | Develops from a fertilized **ovule** |\n| **Protective Covering** | Bounded by an outer pericarp (epicarp, mesocarp, endocarp) | Bounded by an outer seed coat (testa and tegmen) |\n| **Contents** | Encloses and protects seeds within its cavity | Encloses an embryo (radicle and plumule) and food storage tissue |",
        "maxMarks": 5
      },
      {
        "subId": "(d)",
        "prompt": "State the physical effect of heating on each of the following substances:\\n(i) A piece of thermoplastic material;\\n(ii) Pure liquid ethanol alcohol;\\n(iii) A solid metallic iron rod.",
        "workedSolution": "(i) Thermoplastic: Softens, melts into a viscous liquid, and may deform or catch fire upon continued heating.\n(ii) Ethanol alcohol: Expands in volume, vaporizes rapidly, and boils vigorously at its boiling point ($78^\\circ\\text{C}$); its vapors ignite easily in the presence of a flame.\n(iii) Solid metal rod: Undergoes linear thermal expansion (increases in length and volume), becomes hot to the touch (conducts heat), and glows red hot at very high temperatures without burning.",
        "maxMarks": 5
      }
    ]
  },
  {
    "questionNumber": "6",
    "isPracticalSectionA": false,
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Classify the following chemical substances based on their primary applications under the table headings: **Agriculture, Industry, and Medicine**:\n**Milk of magnesia, Ethyl alcohol, Paracetamol tablets, Sodium hydroxide, N.P.K. fertilizer.**",
        "workedSolution": "Classification Table:\n\n| Heading | Chemical Substance(s) | Primary Use / Application |\n| :--- | :--- | :--- |\n| **Agriculture** | **N.P.K. fertilizer** | Supplies nitrogen, phosphorus, and potassium to boost crop yields. |\n| **Industry** | **Ethyl alcohol**, **Sodium hydroxide** | Alcohol is an industrial solvent and fuel; sodium hydroxide is used in saponification and paper manufacturing. |\n| **Medicine** | **Milk of magnesia**, **Paracetamol** | Milk of magnesia serves as an antacid/laxative; paracetamol acts as an analgesic/antipyretic. |",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "State one specific scientific function for each of the following meteorological weather instruments:\\n(i) Rain gauge;\\n(ii) Hygrometer;\\n(iii) Anemometer.",
        "workedSolution": "(i) Rain gauge: Measures the depth of liquid precipitation (rainfall) collected over a specified period in millimeters (mm).\n(ii) Hygrometer: Measures the relative humidity (percentage moisture content) of atmospheric air.\n(iii) Anemometer: Measures the horizontal velocity (speed) of wind in meters per second (m/s) or knots.",
        "maxMarks": 3
      },
      {
        "subId": "(c)",
        "prompt": "(i) Name the two basic types of bipolar junction transistors.\\n(ii) Draw and label the standard electronic circuit symbols for each of the transistors named in (c)(i), indicating the Collector (C), Base (B), and Emitter (E) terminals, and showing the correct emitter arrow direction.",
        "workedSolution": "(i) Two types of transistors:\n1. N-P-N Transistor\n2. P-N-P Transistor\n\n(ii) Circuit Symbols:\n• N-P-N Transistor:\n  - Three terminals: Base (B), Collector (C), Emitter (E).\n  - The arrow on the Emitter terminal points **outwards** (away from the Base: \"Not Pointing iN\").\n• P-N-P Transistor:\n  - Three terminals: Base (B), Collector (C), Emitter (E).\n  - The arrow on the Emitter terminal points **inwards** (toward the Base: \"Points iN Proudly\").",
        "maxMarks": 6
      },
      {
        "subId": "(d)",
        "prompt": "State three socioeconomic and nutritional reasons why commercial vegetable farming is important in a developing economy.",
        "workedSolution": "1. Improves Dietary Nutrition and Public Health: Provides essential vitamins (A, C), dietary minerals (iron, calcium), and roughage, preventing deficiency disorders like scurvy and anemia.\n2. Source of Household Income and Employment: Offers income for smallholder farmers and generates employment in production, transport, and retail.\n3. Rapid Return on Investment: Vegetables are short-season crops that can be harvested and sold within weeks, providing regular cash flow.",
        "maxMarks": 6
      }
    ]
  }
];

export const SET_BECE_2013_SCIENCE_P1 = {
  id: "paper_2013_variant_p1",
  year: 2013,
  setNumber: 122,
  paperType: 1,
  subject: "Integrated Science",
  title: "2013 BECE Integrated Science Paper 1 (Objective Test)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 45,
  totalQuestions: 40,
  questions: SET_BECE_2013_SCIENCE_P1_QUESTIONS
};

export const SET_BECE_2013_SCIENCE_P2 = {
  id: "paper_2013_variant_p2",
  year: 2013,
  setNumber: 122,
  paperType: 2,
  subject: "Integrated Science",
  title: "2013 BECE Integrated Science Paper 2 (Theory & Practical)",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  durationMinutes: 105,
  instructions: "This paper is in two sections: A and B. Answer Question 1 in Section A (compulsory), and any other three questions from Section B. All working must be clearly shown.",
  totalQuestions: 6,
  questions: SET_BECE_2013_SCIENCE_P2_QUESTIONS
};

export const SET_BECE_2013_SCIENCE_COMPLETE = {
  year: 2013,
  isVariant: true,
  setNumber: 122,
  subject: "Integrated Science",
  examination: "WAEC BECE Integrated Science (Cloned Practice Model)",
  paper1: SET_BECE_2013_SCIENCE_P1,
  paper2: SET_BECE_2013_SCIENCE_P2,
  metadata: {
    sanitized: true,
    optionsBalanced: true,
    vectorGraphicsCount: 4,
    sourcePhotographsIntegrated: [
      "IMG_2615.jpg", "IMG_2616.jpg", "IMG_2617.jpg",
      "IMG_2618.jpg", "IMG_2619.jpg"
    ],
    copyright: "Proprietary content © GAM IT Solutions (GAM EDU). All rights reserved."
  }
};
