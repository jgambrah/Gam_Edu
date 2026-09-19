/**
 * NaCCA Common Core Programme (CCP) Integrated Science (Discovery)
 * Master Curriculum Repository & Topical Units Foundation
 *
 * Covers All 5 Strands across B7 (JHS 1), B8 (JHS 2), and B9 (JHS 3)
 * Full parity with JHS Mathematics Curriculum Architecture
 *
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
 */

export interface ScienceTopicalUnit {
  id: string;
  gradeLevel: "BS7" | "BS8" | "BS9";
  strandNumber: 1 | 2 | 3 | 4 | 5;
  strandTitle: string;
  subStrandTitle: string;
  order: number;
  notes: {
    summaryMarkdown: string;
    keyTerms: Array<{ term: string; definition: string }>;
    diagramSvg?: string;
  };
  sampleWorkedProblems: Array<{
    id: string;
    questionPrompt: string;
    stepByStepSolution: string;
    examinerTip: string;
  }>;
  drillQuestions: Array<{
    id: string;
    difficulty: "low" | "medium" | "high";
    type: "objective" | "structured";
    prompt: string;
    diagramSvg?: string;
    options?: string[];
    correctAnswer: string;
    hint: string;
    workedSolution: string;
    points: number;
  }>;
  metadata?: any;
}

export const NACCA_JHS_SCIENCE_TOPICAL_UNITS: ScienceTopicalUnit[] = [
  {
    "id": "b7_strand1_materials",
    "gradeLevel": "BS7",
    "strandNumber": 1,
    "strandTitle": "Strand 1: Diversity of Matter",
    "subStrandTitle": "Materials (Particulate Nature & Separation Techniques)",
    "order": 1,
    "notes": {
      "summaryMarkdown": "### Particulate Nature of Matter & Separation of Mixtures\nMatter is anything that has mass and volume. The particulate theory states that all matter consists of minute particles (atoms, molecules, or ions) in continuous motion.\n\n#### States of Matter:\n1. **Solids**: Particles tightly packed in regular lattice; strong cohesive intermolecular forces; vibrate about fixed equilibrium points.\n2. **Liquids**: Particles loosely packed with kinetic freedom to slide past one another; fixed volume conforming to container geometry.\n3. **Gases**: Particles widely separated; negligible intermolecular attraction; high kinetic velocities occupying all available volume.\n\n#### Separation Techniques:\n* **Filtration**: Separates insoluble solid particles from a liquid mixture based on particle diameter using porous filter paper.\n* **Separating Funnel**: Separates two immiscible liquids (e.g. kerosene and water) exploiting density divergence.\n* **Simple Distillation**: Recovers pure solvent from soluble solid-liquid solutions by boiling and condensing in a Liebig condenser.\n* **Fractional Distillation**: Separates miscible liquids with close boiling points (e.g. crude oil refining, ethanol-water mixture).\n* **Evaporation to Dryness / Crystallization**: Recovers dissolved non-volatile solute from solution.",
      "keyTerms": [
        {
          "term": "Immiscible Liquids",
          "definition": "Liquids that do not mix to form a homogeneous solution (e.g. oil and water), forming separate distinct phases."
        },
        {
          "term": "Filtrate",
          "definition": "The clear liquid that passes through the filter medium during filtration."
        },
        {
          "term": "Residue",
          "definition": "Insoluble solid particles trapped on the filter paper after filtration."
        }
      ],
      "diagramSvg": "<svg viewBox=\"0 0 240 200\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><circle cx=\"120\" cy=\"100\" r=\"18\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/><text x=\"120\" y=\"104\" font-size=\"10\" font-weight=\"bold\" fill=\"#ffffff\" text-anchor=\"middle\">Nucleus</text><circle cx=\"120\" cy=\"100\" r=\"42\" fill=\"none\" stroke=\"#3b82f6\" stroke-width=\"1.5\" stroke-dasharray=\"3,3\"/><circle cx=\"120\" cy=\"100\" r=\"70\" fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"1.5\" stroke-dasharray=\"3,3\"/><circle cx=\"120\" cy=\"58\" r=\"4\" fill=\"#3b82f6\"/><circle cx=\"120\" cy=\"142\" r=\"4\" fill=\"#3b82f6\"/><circle cx=\"120\" cy=\"30\" r=\"4\" fill=\"#8b5cf6\"/><circle cx=\"120\" cy=\"170\" r=\"4\" fill=\"#8b5cf6\"/><text x=\"120\" y=\"192\" font-size=\"10\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\">Bohr Atomic Model</text></svg>"
    },
    "sampleWorkedProblems": [
      {
        "id": "wp_b7_s1_01",
        "questionPrompt": "Explain how a mixture containing table salt, fine sand, and iron filings can be separated into its pure components.",
        "stepByStepSolution": "1. Wrap a bar magnet in cling film and sweep it through the dry mixture to attract and extract magnetic iron filings.\n2. Add distilled water to the remaining sand and salt mixture and stir thoroughly so that sodium chloride dissolves while sand remains insoluble.\n3. Pour the slurry through a filter funnel lined with filter paper: sand is collected as insoluble residue.\n4. Wash the sand residue with distilled water and dry it on watch glass.\n5. Heat the salt filtrate in an evaporating dish until water evaporates, leaving behind pure white salt crystals.",
        "examinerTip": "Always separate magnetic materials first before introducing any solvent to avoid rusting."
      }
    ],
    "drillQuestions": [
      {
        "id": "b7_s1_q1",
        "difficulty": "low",
        "type": "objective",
        "prompt": "Which state of matter has neither a definite shape nor a definite volume?",
        "options": [
          "Gas",
          "Liquid",
          "Solid",
          "Crystal"
        ],
        "correctAnswer": "Gas",
        "hint": "Gas particles move randomly with negligible intermolecular bonds.",
        "workedSolution": "Gases expand spontaneously to occupy the entire volume and shape of their enclosure.",
        "points": 1
      },
      {
        "id": "b7_s1_q2",
        "difficulty": "medium",
        "type": "objective",
        "prompt": "Which separation technique is most appropriate for obtaining pure drinking water from muddy seawater?",
        "options": [
          "Simple distillation",
          "Filtration only",
          "Magnetic separation",
          "Sublimation"
        ],
        "correctAnswer": "Simple distillation",
        "hint": "Distillation boils the water into steam and condenses pure potable water, leaving behind salt and mud.",
        "workedSolution": "Distillation vaporizes water away from non-volatile salts and suspended silt, condensing it into pure distillate.",
        "points": 1
      },
      {
        "id": "b7_s1_q3",
        "difficulty": "high",
        "type": "structured",
        "prompt": "A student states that dissolving sugar in water is a chemical change. Criticize this statement with two scientific reasons.",
        "correctAnswer": "Dissolving sugar is a physical change because: (1) No new chemical substance is formed; (2) The process is reversible by evaporating the water to recover original sugar crystals.",
        "hint": "Consider reversibility and whether covalent bonds in sucrose were permanently broken.",
        "workedSolution": "Dissolving sugar is a physical change: sugar molecules simply disperse among water molecules without forming new chemical bonds, and sugar can be quantitatively recovered by gentle crystallization.",
        "points": 3
      }
    ]
  },
  {
    "id": "b7_strand1_cells",
    "gradeLevel": "BS7",
    "strandNumber": 1,
    "strandTitle": "Strand 1: Diversity of Matter",
    "subStrandTitle": "Living Cells (Plant & Animal Cell Ultrastructure)",
    "order": 2,
    "notes": {
      "summaryMarkdown": "### The Cell as the Fundamental Unit of Life\nThe cell is the basic structural, functional, and biological unit of all living organisms.\n\n#### Key Organelles & Functions:\n* **Nucleus**: Houses deoxyribonucleic acid (DNA); controls all cellular activities and directs protein synthesis.\n* **Cell Membrane**: Selectively permeable lipid bilayer regulating ionic and molecular transit into and out of the cytoplasm.\n* **Cell Wall**: Rigid non-living cellulose exoskeleton giving plant cells structural turgidity and osmotic lysis protection.\n* **Mitochondrion**: The powerhouse of the cell; site of aerobic cellular respiration generating adenosine triphosphate ($ATP$).\n* **Chloroplast**: Double-membraned organelle packed with chlorophyll pigments; site of photosynthetic glucose manufacture.\n* **Vacuole**: Large fluid-filled central sac in plants storing cell sap, mineral salts, and maintaining hydrostatic turgor pressure.",
      "keyTerms": [
        {
          "term": "Prokaryote",
          "definition": "A microscopic single-celled organism (e.g. bacterium) that lacks a true membrane-bound nucleus or membrane-bound organelles."
        },
        {
          "term": "Eukaryote",
          "definition": "An organism consisting of cells in which the genetic material is contained within a distinct membrane-bound nucleus."
        }
      ],
      "diagramSvg": "<svg viewBox=\"0 0 340 220\" width=\"100%\" height=\"180\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><polygon points=\"50,30 290,30 310,180 70,190\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"3.5\"/><polygon points=\"56,36 284,36 304,174 76,184\" fill=\"#f0fdf4\" stroke=\"#15803d\" stroke-width=\"1.5\"/><path d=\"M 120,60 Q 220,50 250,110 Q 230,160 140,150 Q 100,120 120,60 Z\" fill=\"#e0f2fe\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><text x=\"175\" y=\"110\" font-size=\"11\" font-weight=\"bold\" fill=\"#0369a1\" text-anchor=\"middle\">Large Vacuole</text><circle cx=\"95\" cy=\"90\" r=\"22\" fill=\"#fef08a\" stroke=\"#ca8a04\" stroke-width=\"2\"/><circle cx=\"95\" cy=\"90\" r=\"8\" fill=\"#ca8a04\"/><text x=\"95\" y=\"125\" font-size=\"10\" font-weight=\"bold\" fill=\"#854d0e\" text-anchor=\"middle\">Nucleus</text><ellipse cx=\"260\" cy=\"60\" rx=\"14\" ry=\"8\" fill=\"#22c55e\" stroke=\"#15803d\"/><text x=\"260\" y=\"85\" font-size=\"9\" font-weight=\"bold\" fill=\"#15803d\" text-anchor=\"middle\">Chloroplast</text><ellipse cx=\"100\" cy=\"160\" rx=\"14\" ry=\"8\" fill=\"#22c55e\" stroke=\"#15803d\"/><ellipse cx=\"220\" cy=\"165\" rx=\"14\" ry=\"8\" fill=\"#22c55e\" stroke=\"#15803d\"/><text x=\"170\" y=\"210\" font-size=\"10\" font-weight=\"bold\" fill=\"#64748b\" text-anchor=\"middle\">PLANT CELL ULTRASTRUCTURE</text></svg>"
    },
    "sampleWorkedProblems": [
      {
        "id": "wp_b7_s2_01",
        "questionPrompt": "Why does a red blood cell burst when placed in pure distilled water, whereas an epidermal plant cell swells without bursting?",
        "stepByStepSolution": "1. Distilled water is hypotonic relative to the cell cytoplasm.\n2. Water moves into both cells down a water potential gradient via endosmosis.\n3. The animal red blood cell possesses only a fragile flexible plasma membrane that cannot withstand excessive hydrostatic pressure, resulting in osmotic lysis (bursting).\n4. The plant cell possesses a tough, rigid cellulose cell wall that exerts wall pressure (turgor pressure) counteracting internal hydrostatic pressure, preventing bursting.",
        "examinerTip": "Clearly contrast the absence of cell wall in animal cells with its presence in plant cells."
      }
    ],
    "drillQuestions": [
      {
        "id": "b7_s2_q1",
        "difficulty": "low",
        "type": "objective",
        "prompt": "Which organelle is responsible for generating chemical energy ($ATP$) through aerobic respiration?",
        "options": [
          "Mitochondrion",
          "Ribosome",
          "Golgi apparatus",
          "Endoplasmic reticulum"
        ],
        "correctAnswer": "Mitochondrion",
        "hint": "Referred to as the 'powerhouse' of the cell.",
        "workedSolution": "Mitochondria oxidize pyruvate into carbon dioxide and water, phosphorylating ADP into energy-rich ATP.",
        "points": 1
      },
      {
        "id": "b7_s2_q2",
        "difficulty": "medium",
        "type": "objective",
        "prompt": "Which of the following cellular features is unique to plant cells compared to human epithelial cells?",
        "options": [
          "Chloroplasts and cellulose cell wall",
          "Mitochondria and nucleus",
          "Endoplasmic reticulum and ribosomes",
          "Cell membrane and cytoplasm"
        ],
        "correctAnswer": "Chloroplasts and cellulose cell wall",
        "hint": "Structures providing green pigment and rigid cell shape.",
        "workedSolution": "Plant cells uniquely possess cellulose cell walls, chloroplasts, and large permanent vacuoles.",
        "points": 1
      },
      {
        "id": "b7_s2_q3",
        "difficulty": "high",
        "type": "structured",
        "prompt": "State two distinct advantages of specialized multicellular differentiation over unicellular amoebic life.",
        "correctAnswer": "(1) Division of labor allows specialized cells to perform specific tasks with high efficiency (e.g. red blood cells for oxygen transport, neurons for impulses); (2) Damage to individual cells does not cause immediate death of the entire organism.",
        "hint": "Think about efficiency and resilience in multicellular organisms.",
        "workedSolution": "Multicellular differentiation allows specialization and high metabolic efficiency through division of labor, as well as greater organismal size and survival capability.",
        "points": 3
      }
    ]
  },
  {
    "id": "b8_strand1_atoms_bonding",
    "gradeLevel": "BS8",
    "strandNumber": 1,
    "strandTitle": "Strand 1: Diversity of Matter",
    "subStrandTitle": "Atomic Structure, Periodic Table & Chemical Bonds",
    "order": 3,
    "notes": {
      "summaryMarkdown": "### Atomic Architecture & Chemical Bonding\nAtoms are the indivisible building blocks of chemical elements composed of subatomic particles:\n* **Protons**: Positively charged ($+1$), mass $= 1\\text{ amu}$, located in nucleus.\n* **Neutrons**: Electrically neutral ($0$), mass $= 1\\text{ amu}$, located in nucleus.\n* **Electrons**: Negatively charged ($-1$), negligible mass, orbiting in shells ($K=2, L=8, M=8, N=2$).\n\n#### Chemical Bonding:\n1. **Ionic (Electrovalent) Bonding**: Electrostatic attraction formed when metals transfer valence electrons to non-metals (e.g. $Na \\rightarrow Na^+ + e^-$, $Cl + e^- \\rightarrow Cl^- \\implies NaCl$).\n2. **Covalent Bonding**: Formed when non-metal atoms share electron pairs to attain stable noble gas octets (e.g. $H_2O, CO_2, CH_4$).",
      "keyTerms": [
        {
          "term": "Atomic Number (Z)",
          "definition": "The total number of protons present in the nucleus of an atom."
        },
        {
          "term": "Mass Number (A)",
          "definition": "The total number of protons plus neutrons present in the nucleus."
        },
        {
          "term": "Valency",
          "definition": "The combining capacity of an atom, equal to the number of electrons lost, gained, or shared to achieve an octet."
        }
      ],
      "diagramSvg": "<svg viewBox=\"0 0 240 200\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><circle cx=\"120\" cy=\"100\" r=\"18\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/><text x=\"120\" y=\"104\" font-size=\"10\" font-weight=\"bold\" fill=\"#ffffff\" text-anchor=\"middle\">Nucleus</text><circle cx=\"120\" cy=\"100\" r=\"42\" fill=\"none\" stroke=\"#3b82f6\" stroke-width=\"1.5\" stroke-dasharray=\"3,3\"/><circle cx=\"120\" cy=\"100\" r=\"70\" fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"1.5\" stroke-dasharray=\"3,3\"/><circle cx=\"120\" cy=\"58\" r=\"4\" fill=\"#3b82f6\"/><circle cx=\"120\" cy=\"142\" r=\"4\" fill=\"#3b82f6\"/><circle cx=\"120\" cy=\"30\" r=\"4\" fill=\"#8b5cf6\"/><circle cx=\"120\" cy=\"170\" r=\"4\" fill=\"#8b5cf6\"/><text x=\"120\" y=\"192\" font-size=\"10\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\">Bohr Atomic Model</text></svg>"
    },
    "sampleWorkedProblems": [
      {
        "id": "wp_b8_s1_01",
        "questionPrompt": "Deduce the chemical formula of aluminum oxide given aluminum ($Z=13$) and oxygen ($Z=8$).",
        "stepByStepSolution": "1. Aluminum configuration: 2, 8, 3. It loses 3 electrons to attain an octet: Valency = 3 ($Al^{3+}$).\n2. Oxygen configuration: 2, 6. It gains 2 electrons to attain an octet: Valency = 2 ($O^{2-}$).\n3. Swap and balance valencies: $Al_2O_3$.\n4. Formula is $Al_2O_3$.",
        "examinerTip": "Always balance net charges: $2 \\times (+3) + 3 \\times (-2) = 0$."
      }
    ],
    "drillQuestions": [
      {
        "id": "b8_s1_q1",
        "difficulty": "low",
        "type": "objective",
        "prompt": "What is the maximum number of electrons that can occupy the second electron shell (L-shell)?",
        "options": [
          "8",
          "2",
          "18",
          "32"
        ],
        "correctAnswer": "8",
        "hint": "Formula for maximum shell capacity is $2n^2$, where $n=2$.",
        "workedSolution": "By the Bohr rule $2n^2$, the second shell ($n=2$) holds $2(2)^2 = 8$ electrons.",
        "points": 1
      },
      {
        "id": "b8_s1_q2",
        "difficulty": "medium",
        "type": "objective",
        "prompt": "Which pair of elements will react to form a covalent compound?",
        "options": [
          "Carbon and Oxygen",
          "Sodium and Chlorine",
          "Magnesium and Fluorine",
          "Potassium and Sulfur"
        ],
        "correctAnswer": "Carbon and Oxygen",
        "hint": "Covalent bonds occur between non-metals sharing electron pairs.",
        "workedSolution": "Carbon and oxygen are both non-metals; they share electrons to form covalent carbon dioxide ($CO_2$).",
        "points": 1
      },
      {
        "id": "b8_s1_q3",
        "difficulty": "high",
        "type": "structured",
        "prompt": "Why does solid sodium chloride not conduct electricity, whereas molten or aqueous sodium chloride conducts freely?",
        "correctAnswer": "In the solid state, $Na^+$ and $Cl^-$ ions are fixed tightly in a crystal lattice and cannot migrate. In molten or aqueous states, the lattice breaks down, freeing mobile ions to conduct current.",
        "hint": "Electrical conduction requires mobile charge carriers (electrons or ions).",
        "workedSolution": "Solid NaCl contains immobilized ions in a crystalline grid. When melted or dissolved in water, the lattice dissociates into mobile hydrated $Na^+$ and $Cl^-$ ions that freely migrate toward electrodes.",
        "points": 3
      }
    ]
  },
  {
    "id": "b9_strand1_acids_bases",
    "gradeLevel": "BS9",
    "strandNumber": 1,
    "strandTitle": "Strand 1: Diversity of Matter",
    "subStrandTitle": "Acids, Bases, Salts & Neutralization",
    "order": 4,
    "notes": {
      "summaryMarkdown": "### Chemistry of Acids, Bases & Neutralization\n#### Acids:\nSubstances that dissociate in aqueous solution to liberate hydrogen ions ($H^+$ or $H_3O^+$). Turn blue litmus red; pH $< 7$.\n* Strong mineral acids: $HCl, H_2SO_4, HNO_3$.\n* Weak organic acids: Citric acid (citrus), Ethanoic acid (vinegar), Lactic acid (sour milk).\n\n#### Bases & Alkalis:\nOxides and hydroxides of metals that react with acids to form salt and water only. Water-soluble bases are called **alkalis** ($NaOH, KOH, Ca(OH)_2$). Turn red litmus blue; pH $> 7$.\n\n#### Neutralization:\n$$\\text{Acid} + \\text{Base} \\rightarrow \\text{Salt} + \\text{Water}$$\n$$H^+\\text{(aq)} + OH^-\\text{(aq)} \\rightarrow H_2O\\text{(l)}$$",
      "keyTerms": [
        {
          "term": "pH Scale",
          "definition": "Logarithmic scale from 0 to 14 measuring hydrogen ion concentration; pH 7 is neutral, <7 acidic, >7 alkaline."
        },
        {
          "term": "Indicator",
          "definition": "A weak organic dye that exhibits distinct colors in acidic and alkaline media (e.g. litmus, phenolphthalein, methyl orange)."
        }
      ],
      "diagramSvg": "<svg viewBox=\"0 0 240 200\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><circle cx=\"120\" cy=\"100\" r=\"18\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"2\"/><text x=\"120\" y=\"104\" font-size=\"10\" font-weight=\"bold\" fill=\"#ffffff\" text-anchor=\"middle\">Nucleus</text><circle cx=\"120\" cy=\"100\" r=\"42\" fill=\"none\" stroke=\"#3b82f6\" stroke-width=\"1.5\" stroke-dasharray=\"3,3\"/><circle cx=\"120\" cy=\"100\" r=\"70\" fill=\"none\" stroke=\"#8b5cf6\" stroke-width=\"1.5\" stroke-dasharray=\"3,3\"/><circle cx=\"120\" cy=\"58\" r=\"4\" fill=\"#3b82f6\"/><circle cx=\"120\" cy=\"142\" r=\"4\" fill=\"#3b82f6\"/><circle cx=\"120\" cy=\"30\" r=\"4\" fill=\"#8b5cf6\"/><circle cx=\"120\" cy=\"170\" r=\"4\" fill=\"#8b5cf6\"/><text x=\"120\" y=\"192\" font-size=\"10\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\">Bohr Atomic Model</text></svg>"
    },
    "sampleWorkedProblems": [
      {
        "id": "wp_b9_s1_01",
        "questionPrompt": "Write a balanced chemical equation for the reaction between dilute sulfuric acid ($H_2SO_4$) and sodium hydroxide ($NaOH$).",
        "stepByStepSolution": "1. Identify reactants: Sulfuric acid ($H_2SO_4$) and Sodium hydroxide ($NaOH$).\n2. Predict products: Sodium sulfate ($Na_2SO_4$) and water ($H_2O$).\n3. Balance sodium atoms: Add coefficient 2 before $NaOH$.\n4. Balance hydrogen and oxygen: Add coefficient 2 before $H_2O$.\n5. Balanced equation: $$H_2SO_4\\text{(aq)} + 2NaOH\\text{(aq)} \\rightarrow Na_2SO_4\\text{(aq)} + 2H_2O\\text{(l)}$$.",
        "examinerTip": "Always verify that every atom balances on both reactant and product sides."
      }
    ],
    "drillQuestions": [
      {
        "id": "b9_s1_q1",
        "difficulty": "low",
        "type": "objective",
        "prompt": "What is the pH value of pure distilled water at $25^\\circ\\text{C}$?",
        "options": [
          "7.0",
          "1.0",
          "14.0",
          "4.5"
        ],
        "correctAnswer": "7.0",
        "hint": "Pure water is neutral, having equal concentrations of $H^+$ and $OH^-$ ions.",
        "workedSolution": "At $25^\\circ\\text{C}$, $[H^+] = [OH^-] = 10^{-7}\\text{ mol/dm}^3$, corresponding to pH = 7.0.",
        "points": 1
      },
      {
        "id": "b9_s1_q2",
        "difficulty": "medium",
        "type": "objective",
        "prompt": "Which gas is evolved when dilute hydrochloric acid reacts with calcium carbonate chips?",
        "options": [
          "Carbon dioxide ($CO_2$)",
          "Hydrogen ($H_2$)",
          "Oxygen ($O_2$)",
          "Chlorine ($Cl_2$)"
        ],
        "correctAnswer": "Carbon dioxide ($CO_2$)",
        "hint": "Acid + Carbonate -> Salt + Water + Carbon Dioxide. Turns limewater milky.",
        "workedSolution": "$$CaCO_3\\text{(s)} + 2HCl\\text{(aq)} \\rightarrow CaCl_2\\text{(aq)} + H_2O\\text{(l)} + CO_2\\text{(g)}$$. The gas is carbon dioxide.",
        "points": 1
      },
      {
        "id": "b9_s1_q3",
        "difficulty": "high",
        "type": "structured",
        "prompt": "Explain how slaked lime ($Ca(OH)_2$) is used to remediate acidic farmland soil in agricultural practice.",
        "correctAnswer": "Slaked lime is an alkaline base. When applied to acidic soil, it reacts with and neutralizes excess hydrogen ions ($H^+$), raising soil pH to an optimal neutral level (6.0 - 7.0) suitable for crop nutrient uptake.",
        "hint": "Think about acid-base neutralization in agricultural liming.",
        "workedSolution": "Liming neutralizes soil acidity through chemical neutralization ($Ca(OH)_2 + 2H^+ \\rightarrow Ca^{2+} + 2H_2O$), eliminating aluminum/manganese toxicity and unlocking phosphorus availability.",
        "points": 3
      }
    ]
  },
  {
    "id": "b7_strand2_earth_cycles",
    "gradeLevel": "BS7",
    "strandNumber": 2,
    "strandTitle": "Strand 2: Cycles",
    "subStrandTitle": "Earth Science & Biogeochemical Cycles",
    "order": 5,
    "notes": {
      "summaryMarkdown": "### The Hydrological & Carbon Cycles\n#### The Water Cycle:\nContinuous circulation of water between oceans, atmosphere, and terrestrial ecosystems driven by solar energy.\n* **Evaporation**: Solar heating converts liquid surface water into water vapor.\n* **Transpiration**: Evaporation of water from microscopic leaf stomata into the atmosphere.\n* **Condensation**: Water vapor cools and coalesces into microscopic droplets, forming clouds.\n* **Precipitation**: Condensed water falls as rain, snow, or hail when clouds reach saturation.\n* **Percolation & Infiltration**: Downward movement of water into soil horizons to replenish underground aquifers.",
      "keyTerms": [
        {
          "term": "Transpiration",
          "definition": "The loss of water vapor from the aerial parts of plants, principally through the stomata of leaves."
        },
        {
          "term": "Aquifer",
          "definition": "An underground layer of water-bearing permeable rock or gravel yielding groundwater."
        }
      ],
      "diagramSvg": "<svg viewBox=\"0 0 360 200\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><circle cx=\"50\" cy=\"40\" r=\"20\" fill=\"#facc15\" stroke=\"#eab308\" stroke-width=\"2\"/><path d=\"M 180,35 Q 210,15 240,35 Q 270,35 280,55 Q 260,75 220,75 Q 170,75 165,55 Z\" fill=\"#93c5fd\" stroke=\"#3b82f6\" stroke-width=\"1.5\"/><text x=\"220\" y=\"55\" font-size=\"9\" font-weight=\"bold\" fill=\"#1e3a8a\" text-anchor=\"middle\">Condensation</text><path d=\"M 180,165 Q 260,155 345,170 L 345,195 L 180,195 Z\" fill=\"#60a5fa\"/><text x=\"260\" y=\"185\" font-size=\"9\" font-weight=\"bold\" fill=\"#ffffff\" text-anchor=\"middle\">Reservoir / Ocean</text><line x1=\"260\" y1=\"150\" x2=\"260\" y2=\"85\" stroke=\"#0284c7\" stroke-width=\"2\" stroke-dasharray=\"3,3\"/><polygon points=\"256,90 260,83 264,90\" fill=\"#0284c7\"/><text x=\"260\" y=\"118\" font-size=\"8\" font-weight=\"bold\" fill=\"#0369a1\" text-anchor=\"middle\">Evaporation</text></svg>"
    },
    "sampleWorkedProblems": [
      {
        "id": "wp_b7_s2_02",
        "questionPrompt": "Explain how extensive deforestation in the Ashanti forest belt disrupts the regional water cycle.",
        "stepByStepSolution": "1. Trees absorb large volumes of groundwater through roots and release it into the atmosphere via transpiration.\n2. Cutting down forest cover dramatically reduces transpiration rates, lowering local atmospheric moisture and humidity.\n3. With fewer condensation nuclei and less atmospheric moisture, cloud formation declines, resulting in erratic, diminished rainfall and desertification.\n4. Without leaf canopies and root networks, rainfall causes rapid flash surface runoff and erosion rather than infiltrating into groundwater aquifers.",
        "examinerTip": "Connect biological transpiration directly to meteorological cloud formation and soil infiltration."
      }
    ],
    "drillQuestions": [
      {
        "id": "b7_cy_q1",
        "difficulty": "low",
        "type": "objective",
        "prompt": "By which process do clouds form in the upper troposphere from rising water vapor?",
        "options": [
          "Condensation",
          "Sublimation",
          "Evaporation",
          "Transpiration"
        ],
        "correctAnswer": "Condensation",
        "hint": "Vapor cools as it ascends, changing from gas into liquid droplets.",
        "workedSolution": "Rising water vapor cools below its dew point, condensing onto aerosol dust particles to form clouds.",
        "points": 1
      },
      {
        "id": "b7_cy_q2",
        "difficulty": "medium",
        "type": "objective",
        "prompt": "What is the primary biological process that removes carbon dioxide directly from the atmosphere?",
        "options": [
          "Photosynthesis by green plants",
          "Cellular respiration by animals",
          "Fermentation by yeast",
          "Decomposition by fungi"
        ],
        "correctAnswer": "Photosynthesis by green plants",
        "hint": "Plants absorb $CO_2$ to synthesize carbohydrates.",
        "workedSolution": "Green plants, algae, and cyanobacteria absorb $CO_2$ and water in the presence of sunlight to synthesize glucose, acting as primary carbon sinks.",
        "points": 1
      },
      {
        "id": "b7_cy_q3",
        "difficulty": "high",
        "type": "structured",
        "prompt": "Describe how the burning of fossil fuels disrupts the dynamic equilibrium of the global carbon cycle.",
        "correctAnswer": "Fossil fuels (coal, petroleum, natural gas) sequester carbon underground for millions of years. Rapid combustion releases massive volumes of ancient carbon as $CO_2$ into the atmosphere faster than forests and oceans can absorb it, causing the enhanced greenhouse effect.",
        "hint": "Consider the imbalance between carbon emission rates and natural carbon sink absorption capacities.",
        "workedSolution": "Industrial combustion bypasses geological timescales, discharging sequestered carbon directly into the atmosphere, creating a net surplus of $CO_2$ that drives global atmospheric warming.",
        "points": 3
      }
    ]
  },
  {
    "id": "b8_strand2_life_cycles",
    "gradeLevel": "BS8",
    "strandNumber": 2,
    "strandTitle": "Strand 2: Cycles",
    "subStrandTitle": "Life Cycle of Organisms (Complete & Incomplete Metamorphosis)",
    "order": 6,
    "notes": {
      "summaryMarkdown": "### Insect Metamorphosis & Vector Control\nMetamorphosis is the biological process of physical development after birth or hatching, involving conspicuous changes in body structure through cell growth and differentiation.\n\n#### 1. Complete (Holometabolous) Metamorphosis:\nFour distinct developmental stages: **Egg -> Larva -> Pupa -> Adult (Imago)**.\n* **Housefly (*Musca domestica*)**: Egg laid on decaying matter -> Larva (feeding maggot) -> Pupa (inactive brown barrel) -> Winged adult. Vector of cholera, typhoid, and dysentery.\n* **Mosquito (*Anopheles*, *Culex*, *Aedes*)**: Egg laid on water -> Larva (wriggler breathing through siphon) -> Pupa (tumbler) -> Adult. *Anopheles* transmits malaria; *Aedes* transmits yellow fever/dengue.\n\n#### 2. Incomplete (Hemimetabolous) Metamorphosis:\nThree distinct stages: **Egg -> Nymph -> Adult**.\n* **Grasshopper / Cockroach**: Nymph hatches resembling a miniature wingless adult; undergoes successive molts (ecdysis) to achieve full size and develop wings.",
      "keyTerms": [
        {
          "term": "Ecdysis (Molting)",
          "definition": "The periodic shedding of the rigid chitinous exoskeleton in arthropods to allow organismal growth."
        },
        {
          "term": "Pupa",
          "definition": "The non-feeding, quiescent developmental stage of holometabolous insects during which internal metamorphosis occurs."
        }
      ],
      "diagramSvg": "<svg viewBox=\"0 0 360 200\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><circle cx=\"50\" cy=\"40\" r=\"20\" fill=\"#facc15\" stroke=\"#eab308\" stroke-width=\"2\"/><path d=\"M 180,35 Q 210,15 240,35 Q 270,35 280,55 Q 260,75 220,75 Q 170,75 165,55 Z\" fill=\"#93c5fd\" stroke=\"#3b82f6\" stroke-width=\"1.5\"/><text x=\"220\" y=\"55\" font-size=\"9\" font-weight=\"bold\" fill=\"#1e3a8a\" text-anchor=\"middle\">Condensation</text><path d=\"M 180,165 Q 260,155 345,170 L 345,195 L 180,195 Z\" fill=\"#60a5fa\"/><text x=\"260\" y=\"185\" font-size=\"9\" font-weight=\"bold\" fill=\"#ffffff\" text-anchor=\"middle\">Reservoir / Ocean</text><line x1=\"260\" y1=\"150\" x2=\"260\" y2=\"85\" stroke=\"#0284c7\" stroke-width=\"2\" stroke-dasharray=\"3,3\"/><polygon points=\"256,90 260,83 264,90\" fill=\"#0284c7\"/><text x=\"260\" y=\"118\" font-size=\"8\" font-weight=\"bold\" fill=\"#0369a1\" text-anchor=\"middle\">Evaporation</text></svg>"
    },
    "sampleWorkedProblems": [
      {
        "id": "wp_b8_s2_01",
        "questionPrompt": "Explain why spraying oil on stagnant breeding water is more effective against mosquito larvae and pupae than spraying insecticides against adult mosquitoes.",
        "stepByStepSolution": "1. Mosquito larvae and pupae are strictly aquatic and must regularly reach the water surface to breathe atmospheric oxygen via respiratory siphons or trumpets.\n2. A thin film of kerosene or engine oil spreads across the water surface, lowering surface tension and mechanically blocking the respiratory siphons, suffocating both larvae and pupae within hours.\n3. In contrast, adult mosquitoes are airborne and disperse widely over large areas, making adulticidal spraying temporary, costly, and prone to triggering insecticide resistance.",
        "examinerTip": "Focus on the physical suffocation mechanism of the respiratory siphon at the aquatic stage."
      }
    ],
    "drillQuestions": [
      {
        "id": "b8_lc_q1",
        "difficulty": "low",
        "type": "objective",
        "prompt": "Which stage in the life cycle of the housefly is known as the maggot?",
        "options": [
          "Larva",
          "Pupa",
          "Nymph",
          "Egg"
        ],
        "correctAnswer": "Larva",
        "hint": "The voracious feeding stage that emerges from the egg.",
        "workedSolution": "The larva of the housefly is a legless, cylindrical feeding maggot.",
        "points": 1
      },
      {
        "id": "b8_lc_q2",
        "difficulty": "medium",
        "type": "objective",
        "prompt": "Which insect undergoes incomplete metamorphosis?",
        "options": [
          "Grasshopper",
          "Housefly",
          "Mosquito",
          "Butterfly"
        ],
        "correctAnswer": "Grasshopper",
        "hint": "This insect has only 3 lifecycle stages: Egg, Nymph, Adult.",
        "workedSolution": "Grasshoppers undergo incomplete metamorphosis with three stages: Egg -> Nymph -> Adult.",
        "points": 1
      },
      {
        "id": "b8_lc_q3",
        "difficulty": "high",
        "type": "structured",
        "prompt": "State three public health measures necessary to break the transmission cycle of housefly-borne diseases in community food markets.",
        "correctAnswer": "(1) Storing all cooked and fresh food in fly-proof wire mesh showcases; (2) Disposing of organic garbage in tightly covered dustbins; (3) Constructing ventilated improved pit (VIP) latrines and screening drainage channels.",
        "hint": "Prevent flies from contacting human feces and contaminating exposed food.",
        "workedSolution": "Break transmission by denying flies access to breeding substrates (organic wastes/feces) and shielding food surfaces using fly-proof mesh covers.",
        "points": 3
      }
    ]
  },
  {
    "id": "b8_strand3_dentition",
    "gradeLevel": "BS8",
    "strandNumber": 3,
    "strandTitle": "Strand 3: Systems",
    "subStrandTitle": "The Human Body Systems (Dentition & Digestion)",
    "order": 7,
    "notes": {
      "summaryMarkdown": "### Human Dentition & Digestive Architecture\nHumans are heterodonts possessing four distinct morphofunctional types of teeth adapted for an omnivorous diet:\n1. **Incisors** (8 total): Chisel-shaped crowns with sharp horizontal cutting edges; specialized for biting, snipping, and cutting food.\n2. **Canines** (4 total): Pointed conical crowns; specialized for piercing, gripping, and tearing fibrous meat.\n3. **Premolars** (8 total): Broad crowns with two distinct cusps (bicuspids); specialized for crushing and grinding food.\n4. **Molars** (12 total): Large flattened crowns with 4 to 5 grinding cusps; specialized for crushing and pulverizing food during mastication.\n\n#### Permanent Dental Formula:\n$$i\\frac{2}{2}, c\\frac{1}{1}, pm\\frac{2}{2}, m\\frac{3}{3} \\times 2 = 32\\text{ teeth}$$",
      "keyTerms": [
        {
          "term": "Dental Plaque",
          "definition": "A sticky, colorless biofilm of bacteria, salivary proteins, and food residues that adheres to teeth surfaces."
        },
        {
          "term": "Enamel",
          "definition": "The highly mineralized calcium hydroxyapatite protective outer layer covering the tooth crown; hardest tissue in the human body."
        }
      ],
      "diagramSvg": "<svg viewBox=\"0 0 320 180\" width=\"100%\" height=\"150\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><path d=\"M 50,140 Q 160,20 270,140\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"4\"/><rect x=\"145\" y=\"42\" width=\"14\" height=\"20\" rx=\"3\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"1.5\"/><rect x=\"161\" y=\"42\" width=\"14\" height=\"20\" rx=\"3\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"1.5\"/><text x=\"160\" y=\"32\" font-size=\"9\" font-weight=\"bold\" fill=\"#2563eb\" text-anchor=\"middle\">Incisors (Biting)</text><polygon points=\"125,72 135,55 142,72\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"1.5\"/><polygon points=\"180,72 187,55 197,72\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"1.5\"/><text x=\"110\" y=\"60\" font-size=\"8\" font-weight=\"bold\" fill=\"#d97706\" text-anchor=\"end\">Canines (Tearing)</text><rect x=\"90\" y=\"80\" width=\"16\" height=\"22\" rx=\"3\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"1.5\"/><rect x=\"214\" y=\"80\" width=\"16\" height=\"22\" rx=\"3\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"1.5\"/><text x=\"75\" y=\"95\" font-size=\"8\" font-weight=\"bold\" fill=\"#059669\" text-anchor=\"end\">Premolars</text><rect x=\"65\" y=\"110\" width=\"18\" height=\"24\" rx=\"4\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"1.5\"/><rect x=\"237\" y=\"110\" width=\"18\" height=\"24\" rx=\"4\" fill=\"#ffffff\" stroke=\"#475569\" stroke-width=\"1.5\"/><text x=\"50\" y=\"125\" font-size=\"8\" font-weight=\"bold\" fill=\"#7c3aed\" text-anchor=\"end\">Molars (Grinding)</text><text x=\"160\" y=\"170\" font-size=\"10\" font-weight=\"bold\" fill=\"#334155\" text-anchor=\"middle\">HUMAN LOWER JAW DENTITION</text></svg>"
    },
    "sampleWorkedProblems": [
      {
        "id": "wp_b8_s3_01",
        "questionPrompt": "Explain the biochemical etiology of dental caries (tooth decay) and why fluoridated toothpaste provides prophylactic protection.",
        "stepByStepSolution": "1. Cariogenic bacteria (*Streptococcus mutans*) residing in dental plaque metabolize dietary sucrose sugars via anaerobic glycolysis.\n2. This fermentation generates organic lactic acid, causing localized plaque pH to plunge below critical 5.5.\n3. The acidic medium demineralizes and dissolves calcium hydroxyapatite enamel, carving out dental cavities.\n4. Fluoride in toothpaste converts hydroxyapatite into fluorapatite ($Ca_5(PO_4)_3F$), which is substantially more resistant to acid demineralization and remineralizes early enamel lesions.",
        "examinerTip": "Emphasize that bacteria + sugar = acid, and acid dissolves enamel minerals."
      }
    ],
    "drillQuestions": [
      {
        "id": "b8_dt_q1",
        "difficulty": "low",
        "type": "objective",
        "prompt": "What is the total number of canine teeth present in a complete set of permanent adult human teeth?",
        "options": [
          "4",
          "8",
          "2",
          "6"
        ],
        "correctAnswer": "4",
        "hint": "There is one canine on each side of the upper and lower jaws (1 x 4).",
        "workedSolution": "An adult human has 4 canines: 2 in the maxilla (upper jaw) and 2 in the mandible (lower jaw).",
        "points": 1
      },
      {
        "id": "b8_dt_q2",
        "difficulty": "medium",
        "type": "objective",
        "prompt": "Which enzyme present in human saliva initiates the chemical digestion of carbohydrates in the mouth?",
        "options": [
          "Salivary amylase (ptyalin)",
          "Pepsin",
          "Trypsin",
          "Gastric lipase"
        ],
        "correctAnswer": "Salivary amylase (ptyalin)",
        "hint": "Hydrolyzes insoluble starch into sweet maltose disaccharides.",
        "workedSolution": "Salivary amylase (ptyalin) catalyzes the hydrolytic cleavage of starch into maltose disaccharide sugars in the mouth at optimal neutral pH.",
        "points": 1
      },
      {
        "id": "b8_dt_q3",
        "difficulty": "high",
        "type": "structured",
        "prompt": "Compare the dentition of a sheep (herbivore) with that of a lion (carnivore) in relation to their dietary specializations.",
        "correctAnswer": "Sheep possess a hard horny dental pad on the upper jaw and sharp lower incisors for shearing grass, with a diastema space and broad ridged molars for grinding cellulose. Lions possess long curved canines for suffocating prey and razor-sharp carnassial teeth for shearing bone and flesh.",
        "hint": "Contrast grinding herbivorous molars and dental pad with shearing carnassial teeth and stabbing canines.",
        "workedSolution": "Herbivores lack upper incisors (possessing a dental pad) and feature high-crowned molars for crushing cellulose. Carnivores possess elongated stabbing canines and specialized shearing carnassial premolars/molars.",
        "points": 3
      }
    ]
  },
  {
    "id": "b8_strand3_solar_system",
    "gradeLevel": "BS8",
    "strandNumber": 3,
    "strandTitle": "Strand 3: Systems",
    "subStrandTitle": "The Solar System & Planetary Dynamics",
    "order": 8,
    "notes": {
      "summaryMarkdown": "### Structure of the Solar System\nThe Solar System consists of the Sun (a yellow dwarf star) and all celestial objects bound to it by gravitational attraction.\n\n#### 1. Inner (Terrestrial) Planets:\nDense, rocky composition, few or no moons, no ring systems:\n* **Mercury**: Closest planet to Sun; extreme temperature fluctuations; cratered surface.\n* **Venus**: Dense $CO_2$ atmosphere causing runaway greenhouse effect; hottest planet ($~465^\\circ\\text{C}$).\n* **Earth**: Only planet with abundant liquid surface water and life-supporting oxygen atmosphere.\n* **Mars**: The Red Planet; iron oxide surface dust; thin $CO_2$ atmosphere.\n\n#### 2. Outer (Gas & Ice Giants):\nLow densities, massive gaseous envelopes, numerous moons, ring systems:\n* **Jupiter**: Largest planet; famous Great Red Spot cyclonic storm.\n* **Saturn**: Spectacular planetary rings composed of water ice and rock fragments.\n* **Uranus & Neptune**: Ice giants containing frozen water, ammonia, and methane compounds.",
      "keyTerms": [
        {
          "term": "Asteroid Belt",
          "definition": "A circumstellar disc in the Solar System located between the orbits of Mars and Jupiter occupied by numerous irregularly shaped asteroids."
        },
        {
          "term": "Light Year",
          "definition": "The astronomical distance that light travels in a vacuum in one Julian year ($~9.46 \\times 10^{12}\\text{ km}$)."
        }
      ],
      "diagramSvg": "<svg viewBox=\"0 0 360 180\" width=\"100%\" height=\"150\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#090d16\" stroke=\"#334155\" stroke-width=\"1.5\"/><circle cx=\"20\" cy=\"90\" r=\"38\" fill=\"#f59e0b\" stroke=\"#fbbf24\" stroke-width=\"2\"/><text x=\"20\" y=\"95\" font-size=\"10\" font-weight=\"bold\" fill=\"#ffffff\" text-anchor=\"middle\">Sun</text><circle cx=\"90\" cy=\"90\" r=\"4\" fill=\"#a3a3a3\"/><text x=\"90\" y=\"110\" font-size=\"7\" fill=\"#cbd5e1\" text-anchor=\"middle\">Mercury</text><circle cx=\"120\" cy=\"90\" r=\"7\" fill=\"#fbbf24\"/><text x=\"120\" y=\"110\" font-size=\"7\" fill=\"#cbd5e1\" text-anchor=\"middle\">Venus</text><circle cx=\"155\" cy=\"90\" r=\"8\" fill=\"#38bdf8\"/><text x=\"155\" y=\"110\" font-size=\"7\" fill=\"#cbd5e1\" text-anchor=\"middle\">Earth</text><circle cx=\"190\" cy=\"90\" r=\"6\" fill=\"#ef4444\"/><text x=\"190\" y=\"110\" font-size=\"7\" fill=\"#cbd5e1\" text-anchor=\"middle\">Mars</text><line x1=\"210\" y1=\"30\" x2=\"210\" y2=\"150\" stroke=\"#64748b\" stroke-width=\"1\" stroke-dasharray=\"2,3\"/><text x=\"210\" y=\"22\" font-size=\"7\" fill=\"#94a3b8\" text-anchor=\"middle\">Asteroid Belt</text><circle cx=\"245\" cy=\"90\" r=\"16\" fill=\"#f97316\"/><text x=\"245\" y=\"120\" font-size=\"7\" fill=\"#cbd5e1\" text-anchor=\"middle\">Jupiter</text><circle cx=\"295\" cy=\"90\" r=\"13\" fill=\"#eab308\"/><ellipse cx=\"295\" cy=\"90\" rx=\"20\" ry=\"4\" fill=\"none\" stroke=\"#fef08a\" stroke-width=\"1.5\"/><text x=\"295\" y=\"120\" font-size=\"7\" fill=\"#cbd5e1\" text-anchor=\"middle\">Saturn</text></svg>"
    },
    "sampleWorkedProblems": [
      {
        "id": "wp_b8_s3_02",
        "questionPrompt": "Why is Venus substantially hotter than Mercury, even though Mercury is located much closer to the Sun?",
        "stepByStepSolution": "1. Mercury possesses virtually no atmosphere to trap heat, radiating absorbed solar thermal energy immediately into space at night.\n2. In contrast, Venus possesses an extremely thick, dense atmosphere composed of 96% carbon dioxide ($CO_2$) beneath thick sulfuric acid clouds.\n3. Carbon dioxide acts as a potent greenhouse gas, permitting incoming shortwave solar radiation to penetrate but absorbing and re-radiating outgoing infrared thermal radiation.\n4. This creates a severe runaway greenhouse effect, trapping heat and maintaining surface temperatures above $460^\\circ\\text{C}$ globally.",
        "examinerTip": "Attribute the temperature difference directly to Venus's thick carbon dioxide greenhouse atmosphere."
      }
    ],
    "drillQuestions": [
      {
        "id": "b8_ss_q1",
        "difficulty": "low",
        "type": "objective",
        "prompt": "Which is the largest planet in the Solar System?",
        "options": [
          "Jupiter",
          "Saturn",
          "Neptune",
          "Earth"
        ],
        "correctAnswer": "Jupiter",
        "hint": "The massive gas giant featuring the Great Red Spot.",
        "workedSolution": "Jupiter is the most massive planet in the Solar System, possessing more than twice the mass of all other planets combined.",
        "points": 1
      },
      {
        "id": "b8_ss_q2",
        "difficulty": "medium",
        "type": "objective",
        "prompt": "Where is the Asteroid Belt located within our Solar System?",
        "options": [
          "Between the orbits of Mars and Jupiter",
          "Between Earth and Mars",
          "Beyond the orbit of Neptune",
          "Between Mercury and Venus"
        ],
        "correctAnswer": "Between the orbits of Mars and Jupiter",
        "hint": "It divides the inner rocky planets from the outer gas giants.",
        "workedSolution": "The main Asteroid Belt is situated in the circumstellar region between the orbits of Mars and Jupiter.",
        "points": 1
      },
      {
        "id": "b8_ss_q3",
        "difficulty": "high",
        "type": "structured",
        "prompt": "Distinguish between a meteor, a meteoroid, and a meteorite.",
        "correctAnswer": "A meteoroid is a small rocky or metallic fragment traveling through outer space. A meteor is the streak of light produced when a meteoroid burns up entering Earth's atmosphere. A meteorite is the surviving fragment that strikes Earth's surface.",
        "hint": "Consider location: space vs atmosphere vs landed on Earth's surface.",
        "workedSolution": "Meteoroid = space particle; Meteor = shooting star streak during atmospheric friction entry; Meteorite = terrestrial impact remnant.",
        "points": 3
      }
    ]
  },
  {
    "id": "b8_strand4_electricity",
    "gradeLevel": "BS8",
    "strandNumber": 4,
    "strandTitle": "Strand 4: Forces and Energy",
    "subStrandTitle": "Electricity & Basic Electronics (Semiconductors & Circuits)",
    "order": 9,
    "notes": {
      "summaryMarkdown": "### Fundamentals of Electricity & Semiconductor Electronics\n#### Basic Electronic Components:\n* **Resistor**: Limits electrical current flow and drops potential difference according to Ohm's Law ($V = IR$).\n* **Capacitor**: Stores electrical charge on parallel conductive plates separated by a dielectric ($Q = CV$).\n* **Diode**: P-N junction semiconductor device that allows current to flow in only one direction (forward bias) while blocking reverse current.\n* **Light-Emitting Diode (LED)**: Semiconductor diode that emits visible photons when electrons recombine with holes in forward bias.\n\n#### Diode Biasing:\n* **Forward Bias**: Anode (p-type) connected to positive terminal; cathode (n-type) connected to negative terminal. Depletion layer shrinks, allowing current conduction.\n* **Reverse Bias**: Anode connected to negative terminal; cathode to positive terminal. Depletion layer expands, blocking conventional current.",
      "keyTerms": [
        {
          "term": "Forward Bias",
          "definition": "The condition where an external voltage is applied across a p-n junction diode in the direction that permits charge carriers to cross the junction freely."
        },
        {
          "term": "Depletion Region",
          "definition": "The insulating region at a p-n junction devoid of mobile charge carriers."
        }
      ],
      "diagramSvg": "<svg viewBox=\"0 0 320 150\" width=\"100%\" height=\"130\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#0f172a\" stroke=\"#334155\" stroke-width=\"1.5\"/><rect x=\"30\" y=\"30\" width=\"260\" height=\"90\" rx=\"4\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"2\"/><polygon points=\"150,20 170,30 150,40\" fill=\"#38bdf8\" stroke=\"#38bdf8\" stroke-width=\"1.5\"/><line x1=\"170\" y1=\"20\" x2=\"170\" y2=\"40\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"160\" y=\"15\" font-size=\"10\" font-weight=\"bold\" fill=\"#38bdf8\" text-anchor=\"middle\">Diode (Forward Bias)</text><line x1=\"75\" y1=\"65\" x2=\"75\" y2=\"85\" stroke=\"#facc15\" stroke-width=\"3\"/><line x1=\"85\" y1=\"70\" x2=\"85\" y2=\"80\" stroke=\"#facc15\" stroke-width=\"2\"/><circle cx=\"230\" cy=\"75\" r=\"14\" fill=\"#fbbf24\" stroke=\"#d97706\" stroke-width=\"1.5\"/><text x=\"230\" y=\"105\" font-size=\"9\" font-weight=\"bold\" fill=\"#fbbf24\" text-anchor=\"middle\">Lamp Lights</text></svg>"
    },
    "sampleWorkedProblems": [
      {
        "id": "wp_b8_s4_01",
        "questionPrompt": "In an electronic circuit, an LED rated at 2.0 V and 20 mA is powered by a 9.0 V battery. Calculate the value of the protective series resistor required.",
        "stepByStepSolution": "1. Determine voltage drop across resistor: $$V_R = V_{battery} - V_{LED} = 9.0\\text{ V} - 2.0\\text{ V} = 7.0\\text{ V}$$.\n2. Convert current to amperes: $$I = 20\\text{ mA} = 0.020\\text{ A}$$.\n3. Apply Ohm's Law: $$R = \\frac{V_R}{I} = \\frac{7.0\\text{ V}}{0.020\\text{ A}} = 350\\;\\Omega$$.\n4. A $350\\;\\Omega$ protective current-limiting resistor is required.",
        "examinerTip": "Never forget to subtract the LED forward voltage drop before applying Ohm's law to the resistor."
      }
    ],
    "drillQuestions": [
      {
        "id": "b8_el_q1",
        "difficulty": "low",
        "type": "objective",
        "prompt": "Which electronic component allows electrical current to flow in one direction only?",
        "options": [
          "Diode",
          "Resistor",
          "Capacitor",
          "Transformer"
        ],
        "correctAnswer": "Diode",
        "hint": "Acts like a one-way electronic check valve.",
        "workedSolution": "A semiconductor diode conducts current freely in forward bias and blocks current in reverse bias.",
        "points": 1
      },
      {
        "id": "b8_el_q2",
        "difficulty": "medium",
        "type": "objective",
        "prompt": "Why must a current-limiting resistor always be placed in series with an LED in a circuit?",
        "options": [
          "To prevent excessive electrical current from burning out the delicate semiconductor junction",
          "To change the color of the emitted light",
          "To convert alternating current into direct current",
          "To recharge the dry cell battery"
        ],
        "correctAnswer": "To prevent excessive electrical current from burning out the delicate semiconductor junction",
        "hint": "LEDs have negligible resistance when conducting; excessive current destroys the diode junction.",
        "workedSolution": "In forward bias, LEDs exhibit very low internal resistance. Without a series ballast resistor, large current flows causing thermal burnout.",
        "points": 1
      },
      {
        "id": "b8_el_q3",
        "difficulty": "high",
        "type": "structured",
        "prompt": "Explain how a bridge rectifier constructed with four semiconductor diodes converts alternating current (AC) into direct current (DC).",
        "correctAnswer": "During each alternating half-cycle of AC voltage, two diagonally opposite diodes enter forward bias and conduct, while the other two enter reverse bias and block current. This redirects both alternating polarities through the load in the identical direction, producing unidirectional pulsating DC.",
        "hint": "Consider diode pairs conducting alternately during positive and negative AC half-cycles.",
        "workedSolution": "Bridge rectification directs both halves of the AC waveform through alternate forward-biased diode pairs so that current passes through the load in a single constant direction.",
        "points": 3
      }
    ]
  },
  {
    "id": "b9_strand4_force_motion",
    "gradeLevel": "BS9",
    "strandNumber": 4,
    "strandTitle": "Strand 4: Forces and Energy",
    "subStrandTitle": "Force, Motion, Pressure & Mechanics",
    "order": 10,
    "notes": {
      "summaryMarkdown": "### Classical Mechanics, Newton's Laws & Fluid Pressure\n#### Newton's Laws of Motion:\n1. **First Law (Inertia)**: An object remains in its state of rest or uniform motion in a straight line unless acted upon by a resultant external force.\n2. **Second Law ($F = ma$)**: The rate of change of momentum of a body is directly proportional to the applied resultant force and takes place in the direction of the force.\n3. **Third Law (Action & Reaction)**: If body A exerts a force on body B, body B exerts an equal and opposite force on body A ($F_{action} = -F_{reaction}$).\n\n#### Pressure in Fluids:\n$$P = \\frac{\\text{Force (N)}}{\\text{Area (m}^2\\text{)}} = \\frac{F}{A}\\text{ (Pascals)}$$\n$$P_{liquid} = h \\rho g\\text{ (increases linearly with depth } h\\text{)}$$",
      "keyTerms": [
        {
          "term": "Inertia",
          "definition": "The natural reluctance of any physical body to change its state of rest or uniform velocity."
        },
        {
          "term": "Pascal (Pa)",
          "definition": "The SI unit of pressure equivalent to one Newton per square meter ($1\\text{ N/m}^2$)."
        }
      ],
      "diagramSvg": "<svg viewBox=\"0 0 340 160\" width=\"100%\" height=\"140\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><line x1=\"30\" y1=\"125\" x2=\"310\" y2=\"125\" stroke=\"#64748b\" stroke-width=\"2\"/><polygon points=\"160,85 145,125 175,125\" fill=\"#3b82f6\" stroke=\"#1d4ed8\" stroke-width=\"2\"/><circle cx=\"160\" cy=\"85\" r=\"3.5\" fill=\"#ffffff\"/><text x=\"160\" y=\"142\" font-size=\"10\" font-weight=\"bold\" fill=\"#1d4ed8\" text-anchor=\"middle\">Fulcrum (Pivot)</text><line x1=\"50\" y1=\"85\" x2=\"290\" y2=\"85\" stroke=\"#1e293b\" stroke-width=\"4\"/><rect x=\"60\" y=\"55\" width=\"30\" height=\"30\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"1.5\"/><text x=\"75\" y=\"45\" font-size=\"10\" font-weight=\"bold\" fill=\"#b91c1c\" text-anchor=\"middle\">Load (L)</text><line x1=\"270\" y1=\"50\" x2=\"270\" y2=\"82\" stroke=\"#16a34a\" stroke-width=\"2.5\"/><polygon points=\"266,78 270,85 274,78\" fill=\"#16a34a\"/><text x=\"270\" y=\"42\" font-size=\"10\" font-weight=\"bold\" fill=\"#16a34a\" text-anchor=\"middle\">Effort (E)</text><text x=\"110\" y=\"75\" font-size=\"9\" fill=\"#475569\" text-anchor=\"middle\">Load arm</text><text x=\"215\" y=\"75\" font-size=\"9\" fill=\"#475569\" text-anchor=\"middle\">Effort arm</text></svg>"
    },
    "sampleWorkedProblems": [
      {
        "id": "wp_b9_s4_01",
        "questionPrompt": "A hydraulic vehicle lift has a small piston of cross-sectional area $0.02\\text{ m}^2$ and a large piston of area $0.80\\text{ m}^2$. Calculate the minimum force that must be applied to the small piston to lift a car of mass $1,600\\text{ kg}$ ($g = 10\\text{ m/s}^2$).",
        "stepByStepSolution": "1. Calculate weight of car (Load): $$F_2 = mg = 1,600\\text{ kg} \\times 10\\text{ m/s}^2 = 16,000\\text{ N}$$.\n2. According to Pascal's Principle, pressure is transmitted undiminished: $$P_1 = P_2 \\implies \\frac{F_1}{A_1} = \\frac{F_2}{A_2}$$.\n3. Rearrange for effort force $F_1$: $$F_1 = F_2 \\times \\frac{A_1}{A_2} = 16,000\\text{ N} \\times \\frac{0.02\\text{ m}^2}{0.80\\text{ m}^2}$$.\n4. $$F_1 = 16,000 \\times \\frac{1}{40} = 400\\text{ N}$$.\n5. A modest force of $400\\text{ N}$ lifts the $16,000\\text{ N}$ automobile.",
        "examinerTip": "State Pascal's principle clearly: pressure is equal throughout an enclosed hydraulic fluid."
      }
    ],
    "drillQuestions": [
      {
        "id": "b9_fm_q1",
        "difficulty": "low",
        "type": "objective",
        "prompt": "Which physical quantity is obtained from the product of mass and acceleration ($F = ma$)?",
        "options": [
          "Resultant Force",
          "Work Done",
          "Kinetic Energy",
          "Momentum"
        ],
        "correctAnswer": "Resultant Force",
        "hint": "Newton's Second Law of Motion.",
        "workedSolution": "Newton's Second Law defines resultant force as mass multiplied by acceleration: $$F = ma$$.",
        "points": 1
      },
      {
        "id": "b9_fm_q2",
        "difficulty": "medium",
        "type": "objective",
        "prompt": "Why do broad caterpillar tracks enable heavy agricultural bulldozers to traverse marshy swamp soil without sinking?",
        "options": [
          "Large contact surface area significantly reduces the pressure exerted on the ground",
          "The tracks weigh less than circular rubber tires",
          "The tracks emit vibrations that solidify muddy water",
          "They increase gravitational attraction"
        ],
        "correctAnswer": "Large contact surface area significantly reduces the pressure exerted on the ground",
        "hint": "Pressure is inversely proportional to surface area ($P = F/A$).",
        "workedSolution": "Broad tracks maximize contact area $A$. Since $P = F/A$, spreading vehicle weight over a large area drastically reduces ground pressure, preventing sinking.",
        "points": 1
      },
      {
        "id": "b9_fm_q3",
        "difficulty": "high",
        "type": "structured",
        "prompt": "A passenger standing in a moving Metro Mass bus lunges forward when the driver brakes suddenly. Explain this phenomenon using Newton's First Law of Motion.",
        "correctAnswer": "Due to inertia, the passenger's body possesses forward momentum matching the bus's forward velocity. When brakes apply an external stopping force to the bus wheels, no external force has acted directly on the passenger's upper torso, which continues moving forward at constant velocity.",
        "hint": "Refer to inertia and resistance to changes in uniform velocity.",
        "workedSolution": "Newton's First Law (Law of Inertia) dictates that the passenger's body tends to maintain its uniform forward velocity until restrained, causing the apparent forward lunge upon sudden deceleration.",
        "points": 3
      }
    ]
  },
  {
    "id": "b9_strand5_climate_change",
    "gradeLevel": "BS9",
    "strandNumber": 5,
    "strandTitle": "Strand 5: Humans and the Environment",
    "subStrandTitle": "Climate Change, Green Economy & Waste Management",
    "order": 11,
    "notes": {
      "summaryMarkdown": "### Climate Change Dynamics & The Green Economy\n#### The Greenhouse Effect:\nNatural warming of the planet driven by greenhouse gases ($CO_2, CH_4, N_2O, H_2O\\text{ vapor}$) that absorb terrestrial infrared radiation.\n* **Enhanced Greenhouse Effect**: Anthropogenic emissions from industrial fossil fuel burning and deforestation amplify atmospheric thermal trapping, causing global surface temperature rises, rising sea levels, and severe droughts.\n\n#### Green Economy & Circular Resource Strategies:\n* **Transition to Renewable Energy**: Solar PV arrays, wind turbines, and micro-hydro schemes replacing fossil thermal plants.\n* **Integrated Waste Management (3Rs)**:\n  1. *Reduce*: Minimizing plastic packaging and single-use commodities at source.\n  2. *Reuse*: Reutilizing containers and items repeatedly without reprocessing.\n  3. *Recycle*: Industrial collection and remanufacturing of post-consumer polymers, glass, and metals into secondary products.\n* **Composting**: Converting organic biodegradable fractions into humus soil conditioner, averting anaerobic methane generation in landfills.",
      "keyTerms": [
        {
          "term": "Greenhouse Gas (GHG)",
          "definition": "Atmospheric gases capable of absorbing and emitting radiant infrared energy within the thermal infrared range."
        },
        {
          "term": "Circular Economy",
          "definition": "An economic model targeting zero waste through perpetual recycling, refurbishment, and remanufacturing of material streams."
        }
      ],
      "diagramSvg": "<svg viewBox=\"0 0 360 200\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><circle cx=\"50\" cy=\"40\" r=\"20\" fill=\"#facc15\" stroke=\"#eab308\" stroke-width=\"2\"/><path d=\"M 180,35 Q 210,15 240,35 Q 270,35 280,55 Q 260,75 220,75 Q 170,75 165,55 Z\" fill=\"#93c5fd\" stroke=\"#3b82f6\" stroke-width=\"1.5\"/><text x=\"220\" y=\"55\" font-size=\"9\" font-weight=\"bold\" fill=\"#1e3a8a\" text-anchor=\"middle\">Condensation</text><path d=\"M 180,165 Q 260,155 345,170 L 345,195 L 180,195 Z\" fill=\"#60a5fa\"/><text x=\"260\" y=\"185\" font-size=\"9\" font-weight=\"bold\" fill=\"#ffffff\" text-anchor=\"middle\">Reservoir / Ocean</text><line x1=\"260\" y1=\"150\" x2=\"260\" y2=\"85\" stroke=\"#0284c7\" stroke-width=\"2\" stroke-dasharray=\"3,3\"/><polygon points=\"256,90 260,83 264,90\" fill=\"#0284c7\"/><text x=\"260\" y=\"118\" font-size=\"8\" font-weight=\"bold\" fill=\"#0369a1\" text-anchor=\"middle\">Evaporation</text></svg>"
    },
    "sampleWorkedProblems": [
      {
        "id": "wp_b9_s5_01",
        "questionPrompt": "Discuss two practical climate adaptation strategies that coastal communities along the Gulf of Guinea in Ghana can implement against sea erosion.",
        "stepByStepSolution": "1. Construction of Rock Groynes and Sea Defense Boulders: Armoring vulnerable coastlines (e.g. Keta, Ada) with heavy granite boulders dissipates wave kinetic energy and arrests longshore sand drift.\n2. Mangrove Wetland Afforestation: Replanting indigenous red and white mangrove trees along lagoons stabilizes shoreline sediments with dense prop roots while creating fish nurseries and sequestering carbon.",
        "examinerTip": "Provide specific engineering (sea defense walls) and ecological (mangrove restoration) interventions."
      }
    ],
    "drillQuestions": [
      {
        "id": "b9_cc_q1",
        "difficulty": "low",
        "type": "objective",
        "prompt": "Which of the following is a primary greenhouse gas produced by livestock enteric fermentation and anaerobic landfills?",
        "options": [
          "Methane ($CH_4$)",
          "Oxygen ($O_2$)",
          "Nitrogen ($N_2$)",
          "Helium ($He$)"
        ],
        "correctAnswer": "Methane ($CH_4$)",
        "hint": "A hydrocarbon gas emitted by ruminant belching and decomposing landfill refuse.",
        "workedSolution": "Methane ($CH_4$) is an extremely potent greenhouse gas with a global warming potential 28 times greater than carbon dioxide.",
        "points": 1
      },
      {
        "id": "b9_cc_q2",
        "difficulty": "medium",
        "type": "objective",
        "prompt": "How does composting organic market waste contribute to climate change mitigation?",
        "options": [
          "Aerobic composting prevents the anaerobic generation of potent methane gas in landfills",
          "It stops the sun from shining on the soil",
          "It absorbs solar radiation and turns it into liquid water",
          "It eliminates the need for rainfall permanently"
        ],
        "correctAnswer": "Aerobic composting prevents the anaerobic generation of potent methane gas in landfills",
        "hint": "Aerobic microbes produce $CO_2$ and humus, preventing the formation of $CH_4$.",
        "workedSolution": "When organic waste is buried in landfills, anaerobic microbes generate methane ($CH_4$). Aerobic composting produces benign humus without methane emissions.",
        "points": 1
      },
      {
        "id": "b9_cc_q3",
        "difficulty": "high",
        "type": "structured",
        "prompt": "Formulate a three-point waste valorization plan for a Junior High School to achieve a 'Zero Waste to Landfill' policy.",
        "correctAnswer": "(1) Source segregation: Install color-coded bins for organic food scraps, plastics, and paper; (2) School composting facility: Aerobically convert cafeteria food waste into organic manure for the school vegetable garden; (3) Polymer recycling partnership: Collect and clean post-consumer PET water bottles for sale to local plastic pelletizing enterprises.",
        "hint": "Address segregation at source, composting organics, and recycling polymers.",
        "workedSolution": "A sustainable zero-waste plan pairs source segregation with on-site biological recovery (composting for agriculture) and industrial recycling partnerships for inorganic polymers.",
        "points": 3
      }
    ]
  },
  {
    "id": "b7_strand5_soil_weathering",
    "gradeLevel": "BS7",
    "strandNumber": 5,
    "strandTitle": "Strand 5: Humans and the Environment",
    "subStrandTitle": "Soil Formation, Weathering & Physical Properties",
    "order": 12,
    "notes": {
      "summaryMarkdown": "### Rock Weathering & Physical Soil Profiles\nSoil is the upper weathered crust of the Earth supporting plant life, composed of mineral particles (45%), organic matter (5%), water (25%), and air (25%).\n\n#### Weathering of Rocks:\n1. **Physical (Mechanical) Weathering**: Breakdown of rocks into smaller particles without chemical alteration (e.g. exfoliation from temperature fluctuation, frost wedging in crevices, root wedging).\n2. **Chemical Weathering**: Decomposition of rock minerals through chemical reactions (e.g. carbonation of limestone by carbonic acid, hydration, oxidation of iron-bearing minerals to rust).\n3. **Biological Weathering**: Disintegration caused by living organisms (e.g. burrowing worms, moss/lichen humic acid excretion).\n\n#### Soil Physical Types:\n* **Sandy Soil**: Coarse particles, large pores, rapid drainage, low water/nutrient retention, highly aerated.\n* **Clayey Soil**: Fine microscopic particles (<0.002 mm), tiny pores, high water retention, poorly aerated, prone to waterlogging.\n* **Loamy Soil**: Balanced mixture of sand, silt, clay, and organic humus; optimal drainage and aeration for crop agriculture.",
      "keyTerms": [
        {
          "term": "Weathering",
          "definition": "The in situ breakdown and decomposition of rocks and minerals at or near the Earth's surface by physical, chemical, and biological processes."
        },
        {
          "term": "Humus",
          "definition": "The dark, amorphous organic component of soil formed by the microbial decomposition of plant and animal residues."
        }
      ],
      "diagramSvg": "<svg viewBox=\"0 0 340 220\" width=\"100%\" height=\"180\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><polygon points=\"50,30 290,30 310,180 70,190\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"3.5\"/><polygon points=\"56,36 284,36 304,174 76,184\" fill=\"#f0fdf4\" stroke=\"#15803d\" stroke-width=\"1.5\"/><path d=\"M 120,60 Q 220,50 250,110 Q 230,160 140,150 Q 100,120 120,60 Z\" fill=\"#e0f2fe\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><text x=\"175\" y=\"110\" font-size=\"11\" font-weight=\"bold\" fill=\"#0369a1\" text-anchor=\"middle\">Large Vacuole</text><circle cx=\"95\" cy=\"90\" r=\"22\" fill=\"#fef08a\" stroke=\"#ca8a04\" stroke-width=\"2\"/><circle cx=\"95\" cy=\"90\" r=\"8\" fill=\"#ca8a04\"/><text x=\"95\" y=\"125\" font-size=\"10\" font-weight=\"bold\" fill=\"#854d0e\" text-anchor=\"middle\">Nucleus</text><ellipse cx=\"260\" cy=\"60\" rx=\"14\" ry=\"8\" fill=\"#22c55e\" stroke=\"#15803d\"/><text x=\"260\" y=\"85\" font-size=\"9\" font-weight=\"bold\" fill=\"#15803d\" text-anchor=\"middle\">Chloroplast</text><ellipse cx=\"100\" cy=\"160\" rx=\"14\" ry=\"8\" fill=\"#22c55e\" stroke=\"#15803d\"/><ellipse cx=\"220\" cy=\"165\" rx=\"14\" ry=\"8\" fill=\"#22c55e\" stroke=\"#15803d\"/><text x=\"170\" y=\"210\" font-size=\"10\" font-weight=\"bold\" fill=\"#64748b\" text-anchor=\"middle\">PLANT CELL ULTRASTRUCTURE</text></svg>"
    },
    "sampleWorkedProblems": [
      {
        "id": "wp_b7_s5_01",
        "questionPrompt": "Explain how onion-peeling exfoliation physical weathering occurs on exposed granite inselbergs in northern Ghana.",
        "stepByStepSolution": "1. Granite rock is a poor conductor of heat.\n2. During cloudless daytime in northern Ghana, intense solar radiation causes the outer rock shell to expand rapidly while the cooler interior remains unaffected.\n3. At night, surface temperatures plummet, causing rapid thermal contraction of the outer rock layer.\n4. These cyclical expansions and contractions generate intense shearing differential stresses between outer and inner layers.\n5. Over repeated diurnal cycles, the outer rock shell develops curved stress fractures and peels off in curved concentric sheets like onion skins.",
        "examinerTip": "Highlight that rock is a poor thermal conductor, resulting in thermal gradient stresses."
      }
    ],
    "drillQuestions": [
      {
        "id": "b7_sw_q1",
        "difficulty": "low",
        "type": "objective",
        "prompt": "Which soil constituent represents approximately 45% of the volumetric composition of ideal agricultural soil?",
        "options": [
          "Inorganic Mineral Matter",
          "Organic Humus",
          "Soil Air",
          "Soil Water"
        ],
        "correctAnswer": "Inorganic Mineral Matter",
        "hint": "Weathered rock fragments, sand, silt, and clay particles.",
        "workedSolution": "Ideal loam soil consists of 45% mineral particles, 25% water, 25% air, and 5% organic matter.",
        "points": 1
      },
      {
        "id": "b7_sw_q2",
        "difficulty": "medium",
        "type": "objective",
        "prompt": "Why does clay soil become sticky and plastic when wet and rock-hard when baked dry by the sun?",
        "options": [
          "Clay consists of microscopic colloidal plate-like particles with high cohesion and water-holding capacity",
          "Clay has the largest macro-pore diameters among all soils",
          "Clay contains 90% quartz gravel",
          "Clay repels water molecules through electrostatic repulsion"
        ],
        "correctAnswer": "Clay consists of microscopic colloidal plate-like particles with high cohesion and water-holding capacity",
        "hint": "Colloidal sheet particles cling together tightly when lubricated by water.",
        "workedSolution": "Clay particles (<0.002 mm) are colloidal flat plates with massive surface area per unit mass, developing high cohesion when wet and baking into rigid crusts when dehydrated.",
        "points": 1
      },
      {
        "id": "b7_sw_q3",
        "difficulty": "high",
        "type": "structured",
        "prompt": "Describe the chemical reaction that occurs when acid rainwater dissolves limestone bedrock to create karst caves.",
        "correctAnswer": "Atmospheric carbon dioxide dissolves in rainwater to form weak carbonic acid: $$H_2O + CO_2 \\rightarrow H_2CO_3$$. When acidic rain trickles over limestone ($CaCO_3$), it reacts to form soluble calcium hydrogen carbonate: $$CaCO_3\\text{(s)} + H_2CO_3\\text{(aq)} \\rightarrow Ca(HCO_3)_2\\text{(aq)}$$, gradually washing away rock to hollow out caves.",
        "hint": "Write equations for carbonic acid formation and conversion of insoluble $CaCO_3$ to soluble $Ca(HCO_3)_2$.",
        "workedSolution": "Carbonation chemical weathering: $$CaCO_3\\text{(s)} + H_2O\\text{(l)} + CO_2\\text{(g)} \\rightarrow Ca(HCO_3)_2\\text{(aq)}$$. Insoluble calcium carbonate is transformed into soluble bicarbonate that leaches away.",
        "points": 3
      }
    ]
  }
];
