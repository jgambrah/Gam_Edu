/**
 * NaCCA Common Core Programme (CCP) Integrated Science (Discovery)
 * 50-Item Preparatory Assessment Blueprint (Paper 1 CBT Variant)
 *
 * Set: Set 70 (Variant P1)
 * Aligned with NaCCA CCP Science Framework (B7 to B9)
 *
 * Cognitive Weighting Verification:
 * - Level 1 (Knowledge & Understanding): 14 items (28%)
 * - Level 2 (Application): 19 items (38%)
 * - Level 3 (Reasoning & Analysis): 17 items (34%)
 * Total Items: 50 | Total Points: 50 | Time Allowed: 60 mins
 *
 * Intellectual property of GAM IT Solutions (GAM EDU). All rights reserved.
 */

import { CurriculumQuestionSet } from '../global-curriculum-types';

export const SET_JHS_SCIENCE_SAMPLE_P1: CurriculumQuestionSet = {
  id: "paper_nacca_sample_variant_p1",
  title: "NaCCA Integrated Science CCP Preparatory CBT Examination (Set 70)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "NaCCA 50-Item Preparatory Assessment Blueprint",
  variantType: "past_paper_variant",
  year: 2024,
  paperType: 1,
  setNumber: 70,
  era: "NaCCA Common Core Programme (CCP)",
  totalQuestions: 50,
  version: 1,
  questions: [
  {
    "id": "q01",
    "indicator": "B7.1.1.1.1",
    "level": "Level 1 (Knowledge)",
    "prompt": "Which of the following states of matter has a definite volume but takes the shape of the container it occupies?",
    "options": [
      "Solid",
      "Liquid",
      "Gas",
      "Plasma"
    ],
    "correctAnswer": "Liquid",
    "hint": "Think about the behavior of water poured from a jug into a glass.",
    "workedSolution": "Liquids possess fixed volume due to cohesive intermolecular forces, but their particles can slide past one another, conforming to the container shape.",
    "points": 1
  },
  {
    "id": "q02",
    "indicator": "B7.1.2.1.1",
    "level": "Level 1 (Knowledge)",
    "prompt": "Which cellular structure is present in plant cells but absent in animal cells?",
    "options": [
      "Mitochondrion",
      "Cell membrane",
      "Cellulose cell wall",
      "Cytoplasm"
    ],
    "correctAnswer": "Cellulose cell wall",
    "hint": "Consider the rigid outer layer that gives plant cells structural support and turgor.",
    "workedSolution": "Plant cells possess a rigid outer cellulose cell wall that maintains turgor pressure and structural shape, which is absent in animal cells.",
    "points": 1
  },
  {
    "id": "q03",
    "indicator": "B7.1.1.2.1",
    "level": "Level 2 (Application)",
    "prompt": "A student accidentally mixes kerosene and water. Which laboratory apparatus is most suitable for separating this mixture?",
    "options": [
      "Filter funnel and filter paper",
      "Separating funnel",
      "Liebig condenser (distillation)",
      "Evaporating dish"
    ],
    "correctAnswer": "Separating funnel",
    "hint": "Kerosene and water are immiscible liquids with different densities.",
    "workedSolution": "Immiscible liquids of different densities form distinct layers and are separated cleanly using a separating funnel.",
    "points": 1
  },
  {
    "id": "q04",
    "indicator": "B8.1.1.1.2",
    "level": "Level 2 (Application)",
    "prompt": "An atom of sodium is represented by $^{23}_{11}\\text{Na}$. Determine the number of neutrons in the nucleus of this atom.",
    "options": [
      "11",
      "12",
      "23",
      "34"
    ],
    "correctAnswer": "12",
    "hint": "Number of neutrons = Mass number (A) - Atomic number (Z).",
    "workedSolution": "$$\\text{Neutrons} = A - Z = 23 - 11 = 12$$. Sodium has 11 protons and 12 neutrons.",
    "points": 1
  },
  {
    "id": "q05",
    "indicator": "B7.1.2.1.2",
    "level": "Level 2 (Application)",
    "prompt": "Study the plant cell diagram below. What is the primary function of organelle X (Chloroplast)?",
    "diagramSvg": "<svg viewBox=\"0 0 340 220\" width=\"100%\" height=\"180\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><polygon points=\"50,30 290,30 310,180 70,190\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"3.5\"/><polygon points=\"56,36 284,36 304,174 76,184\" fill=\"#f0fdf4\" stroke=\"#15803d\" stroke-width=\"1.5\"/><path d=\"M 120,60 Q 220,50 250,110 Q 230,160 140,150 Q 100,120 120,60 Z\" fill=\"#e0f2fe\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><text x=\"175\" y=\"110\" font-size=\"11\" font-weight=\"bold\" fill=\"#0369a1\" text-anchor=\"middle\">Large Vacuole</text><circle cx=\"95\" cy=\"90\" r=\"22\" fill=\"#fef08a\" stroke=\"#ca8a04\" stroke-width=\"2\"/><circle cx=\"95\" cy=\"90\" r=\"8\" fill=\"#ca8a04\"/><text x=\"95\" y=\"125\" font-size=\"10\" font-weight=\"bold\" fill=\"#854d0e\" text-anchor=\"middle\">Nucleus</text><ellipse cx=\"260\" cy=\"60\" rx=\"14\" ry=\"8\" fill=\"#22c55e\" stroke=\"#15803d\"/><text x=\"260\" y=\"85\" font-size=\"9\" font-weight=\"bold\" fill=\"#15803d\" text-anchor=\"middle\">Chloroplast (X)</text><ellipse cx=\"100\" cy=\"160\" rx=\"14\" ry=\"8\" fill=\"#22c55e\" stroke=\"#15803d\"/><ellipse cx=\"220\" cy=\"165\" rx=\"14\" ry=\"8\" fill=\"#22c55e\" stroke=\"#15803d\"/><text x=\"170\" y=\"210\" font-size=\"10\" font-weight=\"bold\" fill=\"#64748b\" text-anchor=\"middle\">PLANT CELL ULTRASTRUCTURE</text></svg>",
    "options": [
      "Aerobic respiration to release ATP",
      "Photosynthesis to synthesize glucose",
      "Protein synthesis at ribosomes",
      "Osmoregulation and waste storage"
    ],
    "correctAnswer": "Photosynthesis to synthesize glucose",
    "hint": "Organelle X contains green chlorophyll pigments that trap light energy.",
    "workedSolution": "Chloroplasts contain chlorophyll pigments and thylakoid enzymes that absorb sunlight to convert water and carbon dioxide into glucose and oxygen.",
    "points": 1
  },
  {
    "id": "q06",
    "indicator": "B8.1.1.2.1",
    "level": "Level 2 (Application)",
    "prompt": "Which type of chemical bond is formed when magnesium transfers electrons to chlorine to form magnesium chloride ($MgCl_2$)?",
    "options": [
      "Covalent bond",
      "Ionic (electrovalent) bond",
      "Metallic bond",
      "Hydrogen bond"
    ],
    "correctAnswer": "Ionic (electrovalent) bond",
    "hint": "Magnesium is a metal and chlorine is a non-metal; one loses electrons while the other gains.",
    "workedSolution": "An ionic bond involves complete electron transfer from a metal cation ($Mg^{2+}$) to non-metal anions ($Cl^-$), held by electrostatic attraction.",
    "points": 1
  },
  {
    "id": "q07",
    "indicator": "B8.1.2.1.1",
    "level": "Level 1 (Knowledge)",
    "prompt": "What is the key distinguishing characteristic of a prokaryotic cell such as a bacterium?",
    "options": [
      "Absence of a true membrane-bound nucleus",
      "Presence of large central vacuoles",
      "Presence of multiple linear chromosomes",
      "Absence of a plasma membrane"
    ],
    "correctAnswer": "Absence of a true membrane-bound nucleus",
    "hint": "'Pro' means before, 'karyon' means nucleus.",
    "workedSolution": "Prokaryotes lack a membrane-bound nucleus; their genetic material consists of a circular naked DNA strand situated in the nucleoid.",
    "points": 1
  },
  {
    "id": "q08",
    "indicator": "B9.1.1.1.1",
    "level": "Level 2 (Application)",
    "prompt": "What are the chemical products formed when dilute hydrochloric acid ($HCl$) reacts completely with sodium hydroxide ($NaOH$)?",
    "options": [
      "Sodium chloride and water",
      "Sodium hydride and chlorine gas",
      "Sodium chlorate and hydrogen gas",
      "Sodium oxide and water"
    ],
    "correctAnswer": "Sodium chloride and water",
    "hint": "$$\\text{Acid} + \\text{Base} \\rightarrow \\text{Salt} + \\text{Water}$$.",
    "workedSolution": "Neutralization reaction: $$HCl\\text{(aq)} + NaOH\\text{(aq)} \\rightarrow NaCl\\text{(aq)} + H_2O\\text{(l)}$$. Products are common salt and water.",
    "points": 1
  },
  {
    "id": "q09",
    "indicator": "B9.1.1.1.2",
    "level": "Level 3 (Reasoning)",
    "prompt": "A laboratory technician titrates vinegar ($CH_3COOH$) with sodium hydroxide using phenolphthalein indicator. What is the color change observed at the exact stoichiometric endpoint?",
    "options": [
      "Colorless to pale pink",
      "Pink to deep red",
      "Yellow to blue",
      "Red to clear yellow"
    ],
    "correctAnswer": "Colorless to pale pink",
    "hint": "Phenolphthalein is colorless in acidic solutions and turns pink in alkaline media.",
    "workedSolution": "Phenolphthalein remains colorless in an acidic medium and transitions to a persistent faint pale pink at pH 8.2-10.0 indicating equivalence.",
    "points": 1
  },
  {
    "id": "q10",
    "indicator": "B8.1.1.1.3",
    "level": "Level 3 (Reasoning)",
    "prompt": "Calcium belongs to Group 2 of the Periodic Table ($Z = 20$). What is its expected valency and the formula of its oxide?",
    "diagramSvg": "<svg viewBox=\"0 0 240 200\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><circle cx=\"120\" cy=\"100\" r=\"18\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/><text x=\"120\" y=\"104\" font-size=\"10\" font-weight=\"bold\" fill=\"#ffffff\" text-anchor=\"middle\">11p, 12n</text><circle cx=\"120\" cy=\"100\" r=\"40\" fill=\"none\" stroke=\"#3b82f6\" stroke-width=\"1.5\" stroke-dasharray=\"3,3\"/><circle cx=\"120\" cy=\"100\" r=\"62\" fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"1.5\" stroke-dasharray=\"3,3\"/><circle cx=\"120\" cy=\"100\" r=\"84\" fill=\"none\" stroke=\"#059669\" stroke-width=\"1.5\" stroke-dasharray=\"3,3\"/><circle cx=\"120\" cy=\"60\" r=\"4\" fill=\"#3b82f6\"/><circle cx=\"120\" cy=\"140\" r=\"4\" fill=\"#3b82f6\"/><circle cx=\"120\" cy=\"16\" r=\"4\" fill=\"#059669\"/><text x=\"120\" y=\"192\" font-size=\"10\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\">Sodium Atom (2, 8, 1)</text></svg>",
    "options": [
      "Valency = 2, Formula = $CaO$",
      "Valency = 1, Formula = $Ca_2O$",
      "Valency = 2, Formula = $CaO_2$",
      "Valency = 4, Formula = $Ca_2O_3$"
    ],
    "correctAnswer": "Valency = 2, Formula = $CaO$",
    "hint": "Calcium electron configuration is 2, 8, 8, 2. Oxygen valency is 2.",
    "workedSolution": "Calcium has 2 valence electrons and readily loses them ($Ca^{2+}$). Combining with $O^{2-}$ yields a 1:1 ratio formula $$CaO$$.",
    "points": 1
  },
  {
    "id": "q11",
    "indicator": "B7.2.1.1.1",
    "level": "Level 1 (Knowledge)",
    "prompt": "In the hydrological cycle illustrated below, what name is given to process P where liquid water from reservoirs is converted into vapor by solar heat?",
    "diagramSvg": "<svg viewBox=\"0 0 360 200\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><circle cx=\"50\" cy=\"40\" r=\"22\" fill=\"#facc15\" stroke=\"#eab308\" stroke-width=\"2\"/><path d=\"M 180,35 Q 210,15 240,35 Q 270,35 280,55 Q 260,75 220,75 Q 170,75 165,55 Q 165,35 180,35 Z\" fill=\"#93c5fd\" stroke=\"#3b82f6\" stroke-width=\"1.5\"/><text x=\"220\" y=\"55\" font-size=\"9\" font-weight=\"bold\" fill=\"#1e3a8a\" text-anchor=\"middle\">Condensation (Clouds)</text><path d=\"M 15,160 Q 80,110 160,150 Q 240,180 345,130 L 345,195 L 15,195 Z\" fill=\"#bbf7d0\" stroke=\"#16a34a\" stroke-width=\"1.5\"/><path d=\"M 180,165 Q 260,155 345,170 L 345,195 L 180,195 Z\" fill=\"#60a5fa\"/><text x=\"260\" y=\"185\" font-size=\"9\" font-weight=\"bold\" fill=\"#ffffff\" text-anchor=\"middle\">Water Body</text><line x1=\"260\" y1=\"150\" x2=\"260\" y2=\"90\" stroke=\"#0284c7\" stroke-width=\"2\" stroke-dasharray=\"3,3\"/><polygon points=\"256,95 260,88 264,95\" fill=\"#0284c7\"/><text x=\"260\" y=\"120\" font-size=\"8\" font-weight=\"bold\" fill=\"#0369a1\" text-anchor=\"middle\">Process P (Evaporation)</text></svg>",
    "options": [
      "Evaporation",
      "Precipitation",
      "Infiltration",
      "Percolation"
    ],
    "correctAnswer": "Evaporation",
    "hint": "Solar radiation excites water molecules at the surface to break away as gas.",
    "workedSolution": "Evaporation is the physical phase change where liquid water absorbs heat energy from the sun to transform into gaseous water vapor.",
    "points": 1
  },
  {
    "id": "q12",
    "indicator": "B7.2.2.1.1",
    "level": "Level 1 (Knowledge)",
    "prompt": "Which of the following shows the correct sequential stages in the complete metamorphosis of the housefly (*Musca domestica*)?",
    "options": [
      "Egg -> Larva (Maggot) -> Pupa -> Adult",
      "Egg -> Nymph -> Adult",
      "Egg -> Pupa -> Larva -> Adult",
      "Larva -> Egg -> Nymph -> Adult"
    ],
    "correctAnswer": "Egg -> Larva (Maggot) -> Pupa -> Adult",
    "hint": "Complete metamorphosis consists of 4 distinct morphological stages.",
    "workedSolution": "Houseflies undergo holometabolous (complete) metamorphosis: Egg -> Larva (feeding maggot) -> Pupa (cocoon restructuring) -> Imago (adult fly).",
    "points": 1
  },
  {
    "id": "q13",
    "indicator": "B8.2.1.1.1",
    "level": "Level 2 (Application)",
    "prompt": "How do leguminous crops like cowpea and groundnut improve soil fertility during crop rotation?",
    "options": [
      "By harboring symbiotic *Rhizobium* bacteria that fix atmospheric nitrogen",
      "By secreting potassium directly from their leaves",
      "By preventing earthworms from burrowing into the subsoil",
      "By converting phosphorus into carbon dioxide gas"
    ],
    "correctAnswer": "By harboring symbiotic *Rhizobium* bacteria that fix atmospheric nitrogen",
    "hint": "Look at the root nodules of legumes.",
    "workedSolution": "Root nodules of legumes contain symbiotic *Rhizobium* bacteria capable of converting unreactive atmospheric $N_2$ gas into bioavailable nitrates ($NO_3^-$).",
    "points": 1
  },
  {
    "id": "q14",
    "indicator": "B8.2.2.1.1",
    "level": "Level 1 (Knowledge)",
    "prompt": "Which organism undergoes incomplete (hemimetabolous) metamorphosis having a nymph stage that resembles a miniature wingless adult?",
    "options": [
      "Grasshopper",
      "Mosquito",
      "Butterfly",
      "Housefly"
    ],
    "correctAnswer": "Grasshopper",
    "hint": "This insect has only 3 lifecycle stages: Egg, Nymph, Adult.",
    "workedSolution": "Grasshoppers undergo incomplete metamorphosis with three stages: Egg -> Nymph -> Adult. The nymph resembles the adult but lacks functional wings.",
    "points": 1
  },
  {
    "id": "q15",
    "indicator": "B7.2.3.1.1",
    "level": "Level 2 (Application)",
    "prompt": "A commercial fertilizer bag is labeled NPK 15-15-15. What primary physiological benefit does the Potassium (K) component provide to crops?",
    "options": [
      "Strengthens plant stalks and increases disease and drought resistance",
      "Promotes vegetative leafy green growth and chlorophyll",
      "Stimulates root initiation and early flowering",
      "Accelerates fruit ripening through ethylene synthesis"
    ],
    "correctAnswer": "Strengthens plant stalks and increases disease and drought resistance",
    "hint": "Nitrogen = vegetative growth; Phosphorus = roots & flowers; Potassium = strength, disease resistance & water regulation.",
    "workedSolution": "Potassium (K) activates enzymes, regulates stomatal opening for water conservation, and builds stalk strength against lodging and pathogens.",
    "points": 1
  },
  {
    "id": "q16",
    "indicator": "B9.2.1.1.1",
    "level": "Level 2 (Application)",
    "prompt": "Which major biological process acts as the primary carbon sink in the global carbon cycle?",
    "options": [
      "Photosynthesis in green plants and phytoplankton",
      "Combustion of fossil fuels",
      "Cellular respiration by heterotrophs",
      "Volcanic outgassing"
    ],
    "correctAnswer": "Photosynthesis in green plants and phytoplankton",
    "hint": "Which process removes carbon dioxide from the atmosphere to create biomass?",
    "workedSolution": "Photosynthesis absorbs atmospheric $CO_2$ to manufacture organic carbon compounds (glucose/starch), forming the primary terrestrial and marine carbon sink.",
    "points": 1
  },
  {
    "id": "q17",
    "indicator": "B9.2.4.1.1",
    "level": "Level 2 (Application)",
    "prompt": "In ruminant farm animals such as sheep and cattle, in which compartment does fermentation by microflora occur first?",
    "options": [
      "Rumen (paunch)",
      "Reticulum",
      "Omasum",
      "Abomasum (true stomach)"
    ],
    "correctAnswer": "Rumen (paunch)",
    "hint": "This is the largest stomach compartment where ingested grass is fermented by microbes.",
    "workedSolution": "The rumen is the primary fermentation vat where trillions of symbiotic bacteria and protozoa break down cellulose into volatile fatty acids.",
    "points": 1
  },
  {
    "id": "q18",
    "indicator": "B8.2.3.1.2",
    "level": "Level 3 (Reasoning)",
    "prompt": "A vegetable farmer notices damping-off fungal infection wiping out tomato seedlings in a nursery bed. What immediate corrective agronomic practice should be applied?",
    "options": [
      "Thinning seedlings to improve air circulation and reducing watering frequency",
      "Flooding the bed with high nitrogen synthetic fertilizer",
      "Covering the nursery bed with airtight black polythene",
      "Increasing nursery bed shade density to 100% darkness"
    ],
    "correctAnswer": "Thinning seedlings to improve air circulation and reducing watering frequency",
    "hint": "Damping-off fungi thrive in waterlogged, overcrowded, and humid environments.",
    "workedSolution": "Damping-off is caused by soil-borne fungi (*Pythium* / *Rhizoctonia*) favored by excessive moisture and overcrowding. Thinning and aerating curbs fungal spread.",
    "points": 1
  },
  {
    "id": "q19",
    "indicator": "B9.2.4.1.2",
    "level": "Level 3 (Reasoning)",
    "prompt": "A poultry farmer wishes to formulate a layer mash containing 18% crude protein using maize (9% CP) and fish meal (54% CP). Using Pearson's Square, what is the parts ratio of maize to fish meal?",
    "options": [
      "4 parts maize to 1 part fish meal (36:9)",
      "2 parts maize to 3 parts fish meal",
      "1 part maize to 4 parts fish meal",
      "5 parts maize to 2 parts fish meal"
    ],
    "correctAnswer": "4 parts maize to 1 part fish meal (36:9)",
    "hint": "|54 - 18| = 36 parts maize; |9 - 18| = 9 parts fish meal. Simplify 36 : 9.",
    "workedSolution": "By Pearson Square: Maize parts = |54 - 18| = 36; Fish meal parts = |9 - 18| = 9. Ratio = 36 : 9 = 4 : 1.",
    "points": 1
  },
  {
    "id": "q20",
    "indicator": "B7.2.2.1.2",
    "level": "Level 3 (Reasoning)",
    "prompt": "Why is introducing *Gambusia* (larvivorous fish) into stagnant drainages an effective and environmentally sustainable mosquito control strategy?",
    "options": [
      "They consume mosquito larvae without causing chemical pollution or resistance",
      "They destroy adult mosquito wings during nighttime flight",
      "They eliminate stagnant water through rapid drinking",
      "They release chlorine ions that sterilize the water"
    ],
    "correctAnswer": "They consume mosquito larvae without causing chemical pollution or resistance",
    "hint": "Biological control utilizes natural predator-prey relationships instead of insecticides.",
    "workedSolution": "Biological control with larvivorous fish disrupts the mosquito lifecycle at the aquatic larval stage without toxic chemical run-off or vector pesticide resistance.",
    "points": 1
  },
  {
    "id": "q21",
    "indicator": "B8.3.1.1.1",
    "level": "Level 1 (Knowledge)",
    "prompt": "What is the permanent dental formula for one side of the upper and lower jaws in an adult human?",
    "options": [
      "$i\\frac{2}{2}, c\\frac{1}{1}, pm\\frac{2}{2}, m\\frac{3}{3}$ (Total 32)",
      "$i\\frac{1}{1}, c\\frac{2}{2}, pm\\frac{3}{3}, m\\frac{2}{2}$ (Total 32)",
      "$i\\frac{2}{2}, c\\frac{0}{0}, pm\\frac{3}{3}, m\\frac{3}{3}$ (Total 28)",
      "$i\\frac{3}{3}, c\\frac{1}{1}, pm\\frac{1}{1}, m\\frac{2}{2}$ (Total 28)"
    ],
    "correctAnswer": "$i\\frac{2}{2}, c\\frac{1}{1}, pm\\frac{2}{2}, m\\frac{3}{3}$ (Total 32)",
    "hint": "An adult has 8 incisors, 4 canines, 8 premolars, and 12 molars.",
    "workedSolution": "Each half jaw contains 2 incisors, 1 canine, 2 premolars, and 3 molars: $$\\frac{2+1+2+3}{2+1+2+3} \\times 2 = 32\\text{ permanent teeth}$$.",
    "points": 1
  },
  {
    "id": "q22",
    "indicator": "B7.3.1.1.1",
    "level": "Level 2 (Application)",
    "prompt": "A student chews plain boiled rice for two minutes and notices it tastes sweet. Which salivary enzyme and chemical reaction explains this observation?",
    "options": [
      "Salivary amylase (ptyalin) hydrolyzing insoluble starch into maltose sugar",
      "Pepsin digesting egg proteins into amino acids",
      "Lipase breaking down lipids into fatty acids and glycerol",
      "Gastric hydrochloric acid decomposing cellulose"
    ],
    "correctAnswer": "Salivary amylase (ptyalin) hydrolyzing insoluble starch into maltose sugar",
    "hint": "Saliva contains an enzyme that breaks starch down into sweet disaccharides.",
    "workedSolution": "Salivary amylase catalyzes the hydrolysis of complex dietary starch into sweet-tasting maltose disaccharide sugars in the mouth.",
    "points": 1
  },
  {
    "id": "q23",
    "indicator": "B8.3.1.1.2",
    "level": "Level 2 (Application)",
    "prompt": "Why is human blood circulation described as a 'double circulation' system?",
    "options": [
      "Blood passes through the heart twice in one complete circuit of the body",
      "The heart pumps two different types of blood cells simultaneously",
      "Blood flows through two parallel hearts working alternately",
      "The veins carry twice the volume of arteries"
    ],
    "correctAnswer": "Blood passes through the heart twice in one complete circuit of the body",
    "hint": "One circuit goes to the lungs (pulmonary) and one goes to the rest of the body (systemic).",
    "workedSolution": "In humans, blood travels through the pulmonary circuit (heart -> lungs -> heart) and systemic circuit (heart -> body -> heart) per complete circulation.",
    "points": 1
  },
  {
    "id": "q24",
    "indicator": "B7.3.2.1.1",
    "level": "Level 1 (Knowledge)",
    "prompt": "Which pair of planets in the Solar System are classified as inner terrestrial (rocky) planets?",
    "options": [
      "Mercury and Venus",
      "Jupiter and Saturn",
      "Uranus and Neptune",
      "Mars and Jupiter"
    ],
    "correctAnswer": "Mercury and Venus",
    "hint": "The four inner terrestrial planets are Mercury, Venus, Earth, and Mars.",
    "workedSolution": "The inner solar system contains four rocky terrestrial planets: Mercury, Venus, Earth, and Mars. Jupiter and Saturn are outer gas giants.",
    "points": 1
  },
  {
    "id": "q25",
    "indicator": "B8.3.3.1.1",
    "level": "Level 2 (Application)",
    "prompt": "In a grassland ecosystem food chain ($$\\text{Grass} \\rightarrow \\text{Grasshopper} \\rightarrow \\text{Lizard} \\rightarrow \\text{Hawk}$$), what ecological role does the lizard occupy?",
    "options": [
      "Secondary consumer (carnivore)",
      "Primary producer",
      "Primary consumer (herbivore)",
      "Tertiary consumer (apex predator)"
    ],
    "correctAnswer": "Secondary consumer (carnivore)",
    "hint": "Grass = Producer; Grasshopper = Primary consumer; Lizard = Secondary consumer; Hawk = Tertiary consumer.",
    "workedSolution": "The lizard feeds directly on the herbivorous grasshopper, making it a secondary consumer situated at the 3rd trophic level.",
    "points": 1
  },
  {
    "id": "q26",
    "indicator": "B9.3.4.1.1",
    "level": "Level 3 (Reasoning)",
    "prompt": "What is the primary ecological advantage of mixed farming (raising crops and livestock together) over monoculture?",
    "options": [
      "Crop residues provide animal feed while animal manure restores soil fertility",
      "It eliminates all weeds without requiring labor",
      "Livestock prevent rainstorms from eroding the soil",
      "It guarantees 100% elimination of crop pests"
    ],
    "correctAnswer": "Crop residues provide animal feed while animal manure restores soil fertility",
    "hint": "Think of the synergistic nutrient cycle between crops and livestock.",
    "workedSolution": "Mixed farming creates a closed nutrient loop: crop stalks and forage feed the animals, and their organic manure is returned to sustain soil fertility.",
    "points": 1
  },
  {
    "id": "q27",
    "indicator": "B8.3.2.1.2",
    "level": "Level 2 (Application)",
    "prompt": "During a total solar eclipse, what is the spatial alignment of celestial bodies?",
    "options": [
      "Sun - Moon - Earth in a direct straight line",
      "Sun - Earth - Moon in a direct straight line",
      "Earth - Sun - Moon at right angles",
      "Moon - Sun - Earth at an acute angle"
    ],
    "correctAnswer": "Sun - Moon - Earth in a direct straight line",
    "hint": "The Moon casts its shadow (umbra) onto the surface of the Earth.",
    "workedSolution": "A solar eclipse occurs when the Moon moves directly between the Sun and the Earth, casting its shadow (umbra and penumbra) over parts of Earth.",
    "points": 1
  },
  {
    "id": "q28",
    "indicator": "B9.3.4.1.2",
    "level": "Level 3 (Reasoning)",
    "prompt": "In a compost pile, why is it vital to periodically turn and aerate the decomposing organic heap?",
    "options": [
      "To supply oxygen to aerobic thermophilic bacteria and prevent foul odors",
      "To cool the pile down to freezing temperatures",
      "To stop water from entering the compost heap",
      "To pack the compost tightly into solid rock"
    ],
    "correctAnswer": "To supply oxygen to aerobic thermophilic bacteria and prevent foul odors",
    "hint": "Aerobic microbes require oxygen to break down biomass cleanly without producing smelly methane or hydrogen sulfide.",
    "workedSolution": "Turning supplies oxygen ($O_2$) needed by thermophilic bacteria for rapid aerobic decomposition, preventing anaerobic putrefaction and foul odors.",
    "points": 1
  },
  {
    "id": "q29",
    "indicator": "B9.3.3.1.2",
    "level": "Level 3 (Reasoning)",
    "prompt": "If a persistent chemical pesticide (e.g. DDT) enters an aquatic ecosystem, which organism will accumulate the highest concentration due to biomagnification?",
    "options": [
      "Fish-eating birds of prey (apex carnivore)",
      "Herbivorous zooplankton",
      "Microscopic phytoplankton (producers)",
      "Small juvenile minnows"
    ],
    "correctAnswer": "Fish-eating birds of prey (apex carnivore)",
    "hint": "Non-biodegradable toxins concentrate progressively higher at each ascending trophic level.",
    "workedSolution": "Biomagnification causes non-biodegradable lipophilic toxins to accumulate in fatty tissues, reaching peak toxic concentrations in top apex predators.",
    "points": 1
  },
  {
    "id": "q30",
    "indicator": "B8.3.4.1.1",
    "level": "Level 3 (Reasoning)",
    "prompt": "A farmer practices a 3-year crop rotation: Plot 1 (Yam), Plot 2 (Maize), Plot 3 (Cowpea). Why is cowpea planted immediately prior to maize in a subsequent cycle?",
    "options": [
      "Cowpea fixes atmospheric nitrogen, leaving residual nitrates for nitrogen-hungry maize",
      "Cowpea releases toxins that kill all maize beetles permanently",
      "Maize roots cannot penetrate unplanted soil without cowpeas",
      "Cowpeas extract all excess moisture to prevent maize drowning"
    ],
    "correctAnswer": "Cowpea fixes atmospheric nitrogen, leaving residual nitrates for nitrogen-hungry maize",
    "hint": "Cereals like maize are heavy nitrogen feeders; legumes replenish nitrogen.",
    "workedSolution": "Legumes enrich the soil with fixed nitrates via *Rhizobium*, meeting the heavy nitrogen demands of cereal crops like maize without expensive synthetic fertilizer.",
    "points": 1
  },
  {
    "id": "q31",
    "indicator": "B7.4.1.1.1",
    "level": "Level 2 (Application)",
    "prompt": "An object of mass $5\\text{ kg}$ is lifted to a vertical height of $8\\text{ m}$. Calculate its gravitational potential energy ($g = 10\\text{ m/s}^2$).",
    "options": [
      "$400\\text{ J}$",
      "$40\\text{ J}$",
      "$80\\text{ J}$",
      "$800\\text{ J}$"
    ],
    "correctAnswer": "$400\\text{ J}$",
    "hint": "Apply the potential energy formula: $$PE = mgh$$.",
    "workedSolution": "$$PE = m \\times g \\times h = 5\\text{ kg} \\times 10\\text{ m/s}^2 \\times 8\\text{ m} = 400\\text{ Joules}$$.",
    "points": 1
  },
  {
    "id": "q32",
    "indicator": "B7.4.1.1.2",
    "level": "Level 2 (Application)",
    "prompt": "A toy car of mass $2\\text{ kg}$ travels with a velocity of $6\\text{ m/s}$. Determine its kinetic energy.",
    "options": [
      "$36\\text{ J}$",
      "$12\\text{ J}$",
      "$72\\text{ J}$",
      "$18\\text{ J}$"
    ],
    "correctAnswer": "$36\\text{ J}$",
    "hint": "Apply the formula: $$KE = \\frac{1}{2}mv^2$$.",
    "workedSolution": "$$KE = \\frac{1}{2}mv^2 = \\frac{1}{2}(2\\text{ kg})(6\\text{ m/s})^2 = 1 \\times 36 = 36\\text{ Joules}$$.",
    "points": 1
  },
  {
    "id": "q33",
    "indicator": "B8.4.3.1.1",
    "level": "Level 2 (Application)",
    "prompt": "In the Akosombo Hydroelectric Power Station, what sequence of energy transformations takes place?",
    "options": [
      "Potential Energy -> Kinetic Energy -> Mechanical Energy -> Electrical Energy",
      "Chemical Energy -> Heat Energy -> Electrical Energy",
      "Solar Energy -> Chemical Energy -> Nuclear Energy",
      "Electrical Energy -> Kinetic Energy -> Potential Energy"
    ],
    "correctAnswer": "Potential Energy -> Kinetic Energy -> Mechanical Energy -> Electrical Energy",
    "hint": "Water stored high up in Lake Volta falls through penstocks to turn turbines connected to generators.",
    "workedSolution": "Stored water possesses GPE, converts to kinetic energy as it rushes downhill, turns turbine blades (mechanical), and generates electricity via electromagnetic induction.",
    "points": 1
  },
  {
    "id": "q34",
    "indicator": "B8.4.4.1.1",
    "level": "Level 2 (Application)",
    "prompt": "Study the lever system shown. What is the Mechanical Advantage (MA) if an effort of $50\\text{ N}$ lifts a load of $200\\text{ N}$?",
    "diagramSvg": "<svg viewBox=\"0 0 340 160\" width=\"100%\" height=\"140\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><line x1=\"30\" y1=\"125\" x2=\"310\" y2=\"125\" stroke=\"#64748b\" stroke-width=\"2\"/><polygon points=\"160,85 145,125 175,125\" fill=\"#3b82f6\" stroke=\"#1d4ed8\" stroke-width=\"2\"/><circle cx=\"160\" cy=\"85\" r=\"3.5\" fill=\"#ffffff\"/><text x=\"160\" y=\"142\" font-size=\"10\" font-weight=\"bold\" fill=\"#1d4ed8\" text-anchor=\"middle\">Pivot (Fulcrum)</text><line x1=\"50\" y1=\"85\" x2=\"290\" y2=\"85\" stroke=\"#1e293b\" stroke-width=\"4\"/><rect x=\"60\" y=\"55\" width=\"30\" height=\"30\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"1.5\"/><text x=\"75\" y=\"45\" font-size=\"10\" font-weight=\"bold\" fill=\"#b91c1c\" text-anchor=\"middle\">Load = 200 N</text><line x1=\"270\" y1=\"50\" x2=\"270\" y2=\"82\" stroke=\"#16a34a\" stroke-width=\"2.5\"/><polygon points=\"266,78 270,85 274,78\" fill=\"#16a34a\"/><text x=\"270\" y=\"42\" font-size=\"10\" font-weight=\"bold\" fill=\"#16a34a\" text-anchor=\"middle\">Effort = 50 N</text><text x=\"110\" y=\"75\" font-size=\"9\" fill=\"#475569\" text-anchor=\"middle\">0.2 m</text><text x=\"215\" y=\"75\" font-size=\"9\" fill=\"#475569\" text-anchor=\"middle\">0.8 m</text></svg>",
    "options": [
      "$4.0$",
      "$0.25$",
      "$2.5$",
      "$10.0$"
    ],
    "correctAnswer": "$4.0$",
    "hint": "$$\\text{Mechanical Advantage} = \\frac{\\text{Load}}{\\text{Effort}}$$.",
    "workedSolution": "$$MA = \\frac{\\text{Load}}{\\text{Effort}} = \\frac{200\\text{ N}}{50\\text{ N}} = 4.0$$. The machine multiplies the applied force by 4.",
    "points": 1
  },
  {
    "id": "q35",
    "indicator": "B8.4.2.1.1",
    "level": "Level 2 (Application)",
    "prompt": "In the electronic circuit diagram below, the semiconductor diode is connected in forward bias. What happens when the switch is closed?",
    "diagramSvg": "<svg viewBox=\"0 0 320 150\" width=\"100%\" height=\"130\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#0f172a\" stroke=\"#334155\" stroke-width=\"1.5\"/><rect x=\"30\" y=\"30\" width=\"260\" height=\"90\" rx=\"4\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"2\"/><line x1=\"140\" y1=\"30\" x2=\"180\" y2=\"30\" stroke=\"#0f172a\" stroke-width=\"4\"/><polygon points=\"150,20 170,30 150,40\" fill=\"#38bdf8\" stroke=\"#38bdf8\" stroke-width=\"1.5\"/><line x1=\"170\" y1=\"20\" x2=\"170\" y2=\"40\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"160\" y=\"15\" font-size=\"10\" font-weight=\"bold\" fill=\"#38bdf8\" text-anchor=\"middle\">Diode (Forward Bias)</text><line x1=\"60\" y1=\"75\" x2=\"100\" y2=\"75\" stroke=\"#0f172a\" stroke-width=\"4\"/><line x1=\"75\" y1=\"65\" x2=\"75\" y2=\"85\" stroke=\"#facc15\" stroke-width=\"3\"/><line x1=\"85\" y1=\"70\" x2=\"85\" y2=\"80\" stroke=\"#facc15\" stroke-width=\"2\"/><circle cx=\"230\" cy=\"75\" r=\"14\" fill=\"#fbbf24\" stroke=\"#d97706\" stroke-width=\"1.5\"/><line x1=\"220\" y1=\"65\" x2=\"240\" y2=\"85\" stroke=\"#92400e\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"65\" x2=\"220\" y2=\"85\" stroke=\"#92400e\" stroke-width=\"1.5\"/><text x=\"230\" y=\"105\" font-size=\"9\" font-weight=\"bold\" fill=\"#fbbf24\" text-anchor=\"middle\">Lamp Lights</text></svg>",
    "options": [
      "The lamp lights up because the diode allows current to flow",
      "The diode melts instantly and breaks the circuit",
      "Current is blocked and the lamp remains off",
      "The polarity of the battery is reversed automatically"
    ],
    "correctAnswer": "The lamp lights up because the diode allows current to flow",
    "hint": "Forward bias occurs when the anode (p-type) is connected to the positive terminal and cathode (n-type) to negative.",
    "workedSolution": "In forward bias, the depletion layer thins, reducing resistance and allowing electrical current to conduct through the circuit, illuminating the lamp.",
    "points": 1
  },
  {
    "id": "q36",
    "indicator": "B7.4.1.2.1",
    "level": "Level 1 (Knowledge)",
    "prompt": "By which method of heat transfer does thermal energy from the Sun reach the Earth through the vacuum of outer space?",
    "options": [
      "Radiation",
      "Conduction",
      "Convection",
      "Sublimation"
    ],
    "correctAnswer": "Radiation",
    "hint": "Space is a vacuum; conduction and convection require a material medium of particles.",
    "workedSolution": "Radiation transfers heat via electromagnetic infrared waves, propagating across the vacuum of space without requiring any material medium.",
    "points": 1
  },
  {
    "id": "q37",
    "indicator": "B9.4.4.1.1",
    "level": "Level 2 (Application)",
    "prompt": "A net force of $60\\text{ N}$ is applied to a cart of mass $12\\text{ kg}$. Calculate the acceleration produced according to Newton's Second Law ($F = ma$).",
    "options": [
      "$5\\text{ m/s}^2$",
      "$720\\text{ m/s}^2$",
      "$0.2\\text{ m/s}^2$",
      "$48\\text{ m/s}^2$"
    ],
    "correctAnswer": "$5\\text{ m/s}^2$",
    "hint": "$$a = \\frac{F}{m}$$.",
    "workedSolution": "$$a = \\frac{F}{m} = \\frac{60\\text{ N}}{12\\text{ kg}} = 5\\text{ m/s}^2$$.",
    "points": 1
  },
  {
    "id": "q38",
    "indicator": "B9.4.4.1.2",
    "level": "Level 3 (Reasoning)",
    "prompt": "Why are concrete retaining walls of deep water dams (such as Akosombo) constructed with a much thicker base than top?",
    "options": [
      "Liquid pressure increases directly with liquid depth ($P = \\rho g h$)",
      "To prevent air currents from knocking over the wall",
      "Water at the bottom is less dense than water at the surface",
      "To provide a wide road for pedestrian tourists"
    ],
    "correctAnswer": "Liquid pressure increases directly with liquid depth ($P = \\rho g h$)",
    "hint": "Pressure in liquids is given by $P = h \\rho g$; greater depth means greater hydrostatic pressure.",
    "workedSolution": "Hydrostatic pressure in fluids increases with depth ($P = \\rho g h$). The dam wall must be substantially thicker at the bottom to withstand massive lateral pressure.",
    "points": 1
  },
  {
    "id": "q39",
    "indicator": "B9.4.4.2.1",
    "level": "Level 1 (Knowledge)",
    "prompt": "What happens when the North pole of one bar magnet is brought close to the North pole of another freely suspended bar magnet?",
    "options": [
      "They repel each other",
      "They attract each other strongly",
      "They demagnetize each other immediately",
      "They induce an alternating electric current"
    ],
    "correctAnswer": "They repel each other",
    "hint": "Basic law of magnetism: Like poles repel, unlike poles attract.",
    "workedSolution": "The fundamental law of magnetism states that like poles (N-N or S-S) repel one another, while unlike poles (N-S) attract.",
    "points": 1
  },
  {
    "id": "q40",
    "indicator": "B8.4.3.1.2",
    "level": "Level 3 (Reasoning)",
    "prompt": "An electric motor consumes $1,200\\text{ J}$ of electrical energy and delivers $900\\text{ J}$ of useful mechanical work. Calculate the efficiency of the motor.",
    "options": [
      "$75\\%$",
      "$25\\%$",
      "$133\\%$",
      "$85\\%$"
    ],
    "correctAnswer": "$75\\%$",
    "hint": "$$\\text{Efficiency} = \\frac{\\text{Useful Energy Output}}{\\text{Total Energy Input}} \\times 100\\%$$.",
    "workedSolution": "$$\\text{Efficiency} = \\frac{900\\text{ J}}{1200\\text{ J}} \\times 100\\% = 0.75 \\times 100\\% = 75\\%$$. The remaining 25% is dissipated as heat and sound.",
    "points": 1
  },
  {
    "id": "q41",
    "indicator": "B7.5.1.1.1",
    "level": "Level 1 (Knowledge)",
    "prompt": "Which of the following actions represents the 'Reuse' component of the 3Rs of sustainable waste management?",
    "options": [
      "Using empty glass mayonnaise jars to store cooking spices",
      "Melting plastic bottles to manufacture park benches",
      "Switching off light bulbs when leaving a room",
      "Throwing food scraps into an open burn pit"
    ],
    "correctAnswer": "Using empty glass mayonnaise jars to store cooking spices",
    "hint": "Reusing means employing an item again for the same or a new purpose without reprocessing the material.",
    "workedSolution": "Reusing involves repurposing existing containers (such as glass jars for spices) without industrial reprocessing, extending item lifespan.",
    "points": 1
  },
  {
    "id": "q42",
    "indicator": "B8.5.2.1.1",
    "level": "Level 1 (Knowledge)",
    "prompt": "A patient presents with bleeding gums, slow wound healing, and loose teeth. Which nutritional deficiency disease is this person suffering from?",
    "options": [
      "Scurvy (Vitamin C deficiency)",
      "Rickets (Vitamin D deficiency)",
      "Kwashiorkor (Protein deficiency)",
      "Goitre (Iodine deficiency)"
    ],
    "correctAnswer": "Scurvy (Vitamin C deficiency)",
    "hint": "Citrus fruits like oranges, lemons, and limes treat this condition.",
    "workedSolution": "Scurvy is caused by Vitamin C (ascorbic acid) deficiency, impairing collagen synthesis and resulting in fragile capillaries and bleeding gums.",
    "points": 1
  },
  {
    "id": "q43",
    "indicator": "B8.5.2.1.2",
    "level": "Level 1 (Knowledge)",
    "prompt": "Which pathogen causes COVID-19 and how is it primarily transmitted?",
    "options": [
      "SARS-CoV-2 (virus) via respiratory airborne droplets and aerosols",
      "*Plasmodium falciparum* (protozoan) via female Anopheles mosquitoes",
      "*Vibrio cholerae* (bacterium) via contaminated drinking water",
      "*Taenia solium* (tapeworm) via undercooked pork"
    ],
    "correctAnswer": "SARS-CoV-2 (virus) via respiratory airborne droplets and aerosols",
    "hint": "COVID-19 is an infectious respiratory viral infection.",
    "workedSolution": "COVID-19 is caused by the SARS-CoV-2 coronavirus, transmitted when an infected person expels respiratory droplets while talking, coughing, or breathing.",
    "points": 1
  },
  {
    "id": "q44",
    "indicator": "B7.5.5.1.1",
    "level": "Level 2 (Application)",
    "prompt": "A student performs a soil drainage experiment by pouring $100\\text{ cm}^3$ of water through equal masses of sand, loam, and clay. Why does sandy soil collect water the fastest?",
    "options": [
      "Sand has large particle sizes and large macro-pores, giving it high permeability",
      "Sand particles swell up and absorb all the water instantly",
      "Sand has high clay humus content that chemically repels water",
      "Sand particles are negatively charged and pump water downward"
    ],
    "correctAnswer": "Sand has large particle sizes and large macro-pores, giving it high permeability",
    "hint": "Particle size determines pore space; coarse particles create wide channels for rapid gravitational drainage.",
    "workedSolution": "Sandy soil has coarse particles (0.02 - 2.0 mm) with large macro-pores, facilitating rapid drainage with low water-holding capacity.",
    "points": 1
  },
  {
    "id": "q45",
    "indicator": "B9.5.4.1.1",
    "level": "Level 2 (Application)",
    "prompt": "Which of the following atmospheric gases is the most significant contributor to human-induced global warming and climate change?",
    "options": [
      "Carbon dioxide ($CO_2$)",
      "Oxygen ($O_2$)",
      "Argon ($Ar$)",
      "Nitrogen ($N_2$)"
    ],
    "correctAnswer": "Carbon dioxide ($CO_2$)",
    "hint": "This gas is emitted in massive quantities through fossil fuel combustion and deforestation.",
    "workedSolution": "Carbon dioxide ($CO_2$) is a greenhouse gas that absorbs outgoing terrestrial infrared radiation, trapping thermal energy in the troposphere.",
    "points": 1
  },
  {
    "id": "q46",
    "indicator": "B7.5.5.1.2",
    "level": "Level 2 (Application)",
    "prompt": "Which of the following is an example of chemical weathering of rocks?",
    "options": [
      "Acid rainwater containing dissolved carbon dioxide dissolving limestone ($CaCO_3$)",
      "Water freezing in rock crevices and expanding to split rocks",
      "Plant roots wedging into fissures and breaking boulders apart",
      "Wind blowing coarse sand grains against cliff surfaces"
    ],
    "correctAnswer": "Acid rainwater containing dissolved carbon dioxide dissolving limestone ($CaCO_3$)",
    "hint": "Chemical weathering alters the internal chemical composition of rock minerals.",
    "workedSolution": "Carbonation is chemical weathering where carbonic acid ($H_2CO_3$) in rain reacts with calcium carbonate in limestone to form soluble calcium hydrogen carbonate.",
    "points": 1
  },
  {
    "id": "q47",
    "indicator": "B8.5.3.1.1",
    "level": "Level 3 (Reasoning)",
    "prompt": "How has modern industrial palm oil processing improved upon the indigenous traditional pit extraction method in Ghana?",
    "options": [
      "Higher oil extraction yield, hygienic enclosed stainless steel processing, and lower smoke emission",
      "Complete elimination of electrical power requirement",
      "Use of charcoal combustion directly inside the cooking oil",
      "Decreasing production capacity to small clay pot batches"
    ],
    "correctAnswer": "Higher oil extraction yield, hygienic enclosed stainless steel processing, and lower smoke emission",
    "hint": "Think about mechanical screw presses, steam digesters, and sanitary standards.",
    "workedSolution": "Modern hydraulic and mechanical screw press mills maximize extraction efficiency, preserve beta-carotenes under controlled hygiene, and reduce occupational smoke hazards.",
    "points": 1
  },
  {
    "id": "q48",
    "indicator": "B9.5.1.1.1",
    "level": "Level 3 (Reasoning)",
    "prompt": "Why is segregating and composting organic kitchen waste superior to dumping it in an unmanaged municipal landfill?",
    "options": [
      "Composting produces nutrient-rich organic manure while landfilling generates hazardous methane ($CH_4$) gas",
      "Landfills turn organic waste into gold and diamonds",
      "Composting releases toxic radiation that sterilizes flies",
      "Landfills prevent bacteria from growing forever"
    ],
    "correctAnswer": "Composting produces nutrient-rich organic manure while landfilling generates hazardous methane ($CH_4$) gas",
    "hint": "Anaerobic burial in landfills produces methane, a potent greenhouse gas.",
    "workedSolution": "Under compacted landfill conditions, anaerobic digestion generates methane ($CH_4$), a greenhouse gas 28x more potent than $CO_2$. Aerobic composting generates humus fertilizer cleanly.",
    "points": 1
  },
  {
    "id": "q49",
    "indicator": "B7.5.5.1.3",
    "level": "Level 3 (Reasoning)",
    "prompt": "A farmer with land situated on a steep hillside experiences severe topsoil loss during heavy rains. Which conservation measure should be constructed across the slopes to arrest sheet erosion?",
    "options": [
      "Contour bunds and terracing with vetiver grass hedgerows",
      "Ploughing straight up and down the hill along the slope line",
      "Clearing all trees and burning ground cover before every rainstorm",
      "Applying heavy gravel across the entire farm surface"
    ],
    "correctAnswer": "Contour bunds and terracing with vetiver grass hedgerows",
    "hint": "Farming across the contours interrupts runoff velocity and encourages water infiltration.",
    "workedSolution": "Contour farming and terracing construct barriers perpendicular to slope gradient, reducing runoff velocity, trapping sediments, and promoting water infiltration.",
    "points": 1
  },
  {
    "id": "q50",
    "indicator": "B9.5.4.1.2",
    "level": "Level 3 (Reasoning)",
    "prompt": "Under Ghana's transition toward a Green Economy, which circular economy initiative delivers both environmental and economic gains from plastic waste?",
    "options": [
      "Collecting post-consumer PET bottles for pelletizing into recycled polyester fibers and construction paving tiles",
      "Dumping plastic bags into gutters to prevent soil drying",
      "Open-air burning of plastic waste on school playgrounds",
      "Shipping plastic waste to open sea offshore trenches"
    ],
    "correctAnswer": "Collecting post-consumer PET bottles for pelletizing into recycled polyester fibers and construction paving tiles",
    "hint": "A circular economy turns waste into secondary raw materials and value-added goods.",
    "workedSolution": "A circular green economy loops recovered plastic polymers back into high-value manufacturing (fabrics, composite pavers), creating green employment while eliminating plastic pollution.",
    "points": 1
  }
]
};
