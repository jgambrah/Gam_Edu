/**
 * NaCCA Common Core Programme (CCP) Integrated Science (Discovery)
 * Paper 2: Practical & Theory Essay Examination (Set 71 Variant)
 *
 * Structure:
 * - Section A (Compulsory Practical Test, 40 marks): Q1 (a, b, c, d)
 * - Section B (Theory Essays, 15 marks each): Q2, Q3, Q4, Q5
 * Total Marks: 100 | Time Allowed: 1 hour 45 minutes
 *
 * Aligned with NaCCA CCP Science Framework (B7 to B9)
 * All intellectual property rights reserved to GAM IT Solutions (GAM EDU).
 */

import { CurriculumQuestionSet } from '../global-curriculum-types';

export const SET_JHS_SCIENCE_SAMPLE_P2: CurriculumQuestionSet = {
  id: "paper_nacca_sample_variant_p2",
  title: "NaCCA Integrated Science CCP Practical & Theory Examination (Set 71)",
  tier: "Junior Secondary (JHS)",
  subject: "Integrated Science",
  topic: "NaCCA Practical Labs & Theory Blueprint (Paper 2)",
  variantType: "past_paper_variant",
  year: 2024,
  paperType: 2,
  setNumber: 71,
  era: "NaCCA Common Core Programme (CCP)",
  totalQuestions: 5,
  version: 1,
  format: "structured_essay",
  questions: [
  {
    "id": "q01",
    "title": "Question 1: Compulsory Practical Science Laboratory Test",
    "totalMarks": 40,
    "points": 40,
    "format": "structured_essay",
    "prompt": "This question is compulsory. Answer all parts (a), (b), (c), and (d).",
    "workedSolution": "See complete step-by-step laboratory scoring rubrics and deductions below.",
    "parts": [
      {
        "partLabel": "(a)",
        "marks": 10,
        "diagramSvg": "<svg viewBox=\"0 0 400 240\" width=\"100%\" height=\"200\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><g transform=\"translate(10,20)\"><rect x=\"10\" y=\"20\" width=\"160\" height=\"150\" rx=\"15\" fill=\"#dcfce7\" stroke=\"#166534\" stroke-width=\"3\"/><rect x=\"16\" y=\"26\" width=\"148\" height=\"138\" rx=\"10\" fill=\"#f0fdf4\" stroke=\"#15803d\" stroke-width=\"1.5\"/><path d=\"M 40,50 Q 120,40 130,90 Q 110,130 50,120 Z\" fill=\"#e0f2fe\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><text x=\"85\" y=\"85\" font-size=\"10\" font-weight=\"bold\" fill=\"#0369a1\" text-anchor=\"middle\">Vacuole (I)</text><circle cx=\"50\" cy=\"70\" r=\"14\" fill=\"#fef08a\" stroke=\"#ca8a04\" stroke-width=\"1.5\"/><text x=\"50\" y=\"95\" font-size=\"8\" fill=\"#854d0e\" text-anchor=\"middle\">Nucleus (II)</text><ellipse cx=\"130\" cy=\"45\" rx=\"10\" ry=\"6\" fill=\"#22c55e\" stroke=\"#15803d\"/><text x=\"130\" y=\"60\" font-size=\"8\" fill=\"#15803d\" text-anchor=\"middle\">(III)</text><text x=\"90\" y=\"190\" font-size=\"11\" font-weight=\"bold\" fill=\"#166534\" text-anchor=\"middle\">Specimen A (Plant Cell)</text></g><g transform=\"translate(200,20)\"><path d=\"M 30,50 Q 80,20 130,40 Q 160,80 150,130 Q 110,170 60,150 Q 20,130 30,50 Z\" fill=\"#fef2f2\" stroke=\"#dc2626\" stroke-width=\"2.5\"/><circle cx=\"90\" cy=\"90\" r=\"16\" fill=\"#fef08a\" stroke=\"#ca8a04\" stroke-width=\"1.5\"/><circle cx=\"90\" cy=\"90\" r=\"6\" fill=\"#ca8a04\"/><text x=\"90\" y=\"120\" font-size=\"8\" fill=\"#854d0e\" text-anchor=\"middle\">Nucleus (IV)</text><ellipse cx=\"50\" cy=\"60\" rx=\"8\" ry=\"5\" fill=\"#fbcfe8\" stroke=\"#db2777\"/><text x=\"50\" y=\"75\" font-size=\"7\" fill=\"#9d174d\" text-anchor=\"middle\">Mito (V)</text><text x=\"95\" y=\"190\" font-size=\"11\" font-weight=\"bold\" fill=\"#b91c1c\" text-anchor=\"middle\">Specimen B (Animal Cell)</text></g></svg>",
        "prompt": "The diagrams above show high-magnification representations of two biological cells labeled Specimen A and Specimen B.\n(i) Identify Specimen A and Specimen B.\n(ii) Name the labeled parts I, II, III, and V.\n(iii) State the primary function of organelle III.\n(iv) State two visible structural differences between Specimen A and Specimen B.",
        "hint": "Observe cell wall presence, vacuole dimensions, and chloroplast organelles.",
        "modelAnswer": "(i) Specimen A is a typical Plant Cell; Specimen B is an Animal Cell [2 marks].\n(ii) Part I: Large central sap vacuole; Part II: Nucleus; Part III: Chloroplast; Part V: Mitochondrion [4 marks].\n(iii) Function of Chloroplast (III): Traps sunlight with chlorophyll pigments to perform photosynthesis, manufacturing glucose and oxygen [2 marks].\n(iv) Differences [2 marks]:\n- Specimen A has a rigid cellulose cell wall; Specimen B lacks a cell wall.\n- Specimen A possesses chloroplasts and a large central vacuole; Specimen B lacks chloroplasts and has small, temporary vacuoles.",
        "workedSolution": "Full marks allocated for correct biological identification, organelle labelling, functional synthesis of photosynthesis, and comparative anatomy."
      },
      {
        "partLabel": "(b)",
        "marks": 10,
        "diagramSvg": "<svg viewBox=\"0 0 380 170\" width=\"100%\" height=\"150\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><line x1=\"40\" y1=\"130\" x2=\"340\" y2=\"130\" stroke=\"#64748b\" stroke-width=\"2\"/><polygon points=\"190,90 175,130 205,130\" fill=\"#2563eb\" stroke=\"#1d4ed8\" stroke-width=\"2\"/><circle cx=\"190\" cy=\"90\" r=\"4\" fill=\"#ffffff\"/><text x=\"190\" y=\"148\" font-size=\"10\" font-weight=\"bold\" fill=\"#1d4ed8\" text-anchor=\"middle\">Fulcrum P</text><line x1=\"60\" y1=\"90\" x2=\"320\" y2=\"90\" stroke=\"#1e293b\" stroke-width=\"4.5\"/><rect x=\"70\" y=\"55\" width=\"35\" height=\"35\" fill=\"#ef4444\" stroke=\"#b91c1c\" stroke-width=\"1.5\"/><text x=\"87\" y=\"45\" font-size=\"10\" font-weight=\"bold\" fill=\"#b91c1c\" text-anchor=\"middle\">Load = 500 N</text><line x1=\"300\" y1=\"50\" x2=\"300\" y2=\"87\" stroke=\"#16a34a\" stroke-width=\"3\"/><polygon points=\"295,83 300,90 305,83\" fill=\"#16a34a\"/><text x=\"300\" y=\"42\" font-size=\"10\" font-weight=\"bold\" fill=\"#16a34a\" text-anchor=\"middle\">Effort E = 125 N</text><line x1=\"87\" y1=\"102\" x2=\"190\" y2=\"102\" stroke=\"#475569\" stroke-width=\"1.5\" stroke-dasharray=\"2,2\"/><text x=\"138\" y=\"115\" font-size=\"9\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\">Load Arm = 0.3 m</text><line x1=\"190\" y1=\"102\" x2=\"300\" y2=\"102\" stroke=\"#475569\" stroke-width=\"1.5\" stroke-dasharray=\"2,2\"/><text x=\"245\" y=\"115\" font-size=\"9\" font-weight=\"bold\" fill=\"#475569\" text-anchor=\"middle\">Effort Arm = 1.5 m</text></svg>",
        "prompt": "The diagram illustrates a first-class lever system used on a construction site. An effort of 125 N is applied at distance 1.5 m from the fulcrum P to elevate a load of 500 N located 0.3 m from the fulcrum.\n(i) Identify the class of lever and give one domestic example.\n(ii) Calculate the Mechanical Advantage (MA) of the machine.\n(iii) Calculate the Velocity Ratio (VR) of the lever system.\n(iv) Determine the percentage efficiency of the machine and account for any loss.",
        "hint": "$$MA = \\frac{\\text{Load}}{\\text{Effort}}$$, $$VR = \\frac{\\text{Effort Arm}}{\\text{Load Arm}}$$, $$\\text{Efficiency} = \\frac{MA}{VR} \\times 100\\%$$.",
        "modelAnswer": "(i) First-class lever (Fulcrum between Load and Effort). Examples: Crowbar, pair of scissors, claw hammer [2 marks].\n\n(ii) $$\\text{Mechanical Advantage (MA)} = \\frac{\\text{Load}}{\\text{Effort}} = \\frac{500\\text{ N}}{125\\text{ N}} = 4.0$$ [2 marks].\n\n(iii) $$\\text{Velocity Ratio (VR)} = \\frac{\\text{Distance moved by Effort (Effort Arm)}}{\\text{Distance moved by Load (Load Arm)}} = \\frac{1.5\\text{ m}}{0.3\\text{ m}} = 5.0$$ [2 marks].\n\n(iv) $$\\text{Efficiency} = \\frac{\\text{MA}}{\\text{VR}} \\times 100\\% = \\frac{4.0}{5.0} \\times 100\\% = 80\\%$$ [3 marks].\nAccount for loss [1 mark]: The 20% energy loss is dissipated as heat overcoming frictional resistance at the pivot P and lifting the mass of the beam.",
        "workedSolution": "Exact substitution into standard simple machine mechanics equations yielding MA = 4.0, VR = 5.0, and 80% mechanical efficiency."
      },
      {
        "partLabel": "(c)",
        "marks": 10,
        "diagramSvg": "<svg viewBox=\"0 0 380 180\" width=\"100%\" height=\"160\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\"/><g transform=\"translate(30,20)\"><polygon points=\"20,20 80,20 55,65 45,65\" fill=\"#fde047\" stroke=\"#ca8a04\" stroke-width=\"1.5\"/><rect x=\"44\" y=\"65\" width=\"12\" height=\"30\" fill=\"#fef08a\" stroke=\"#ca8a04\"/><rect x=\"35\" y=\"95\" width=\"30\" height=\"50\" fill=\"#e0f2fe\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><rect x=\"36\" y=\"110\" width=\"28\" height=\"34\" fill=\"#60a5fa\"/><text x=\"50\" y=\"160\" font-size=\"9\" font-weight=\"bold\" fill=\"#0369a1\" text-anchor=\"middle\">Soil X (Sand: 85 cm³)</text></g><g transform=\"translate(145,20)\"><polygon points=\"20,20 80,20 55,65 45,65\" fill=\"#bbf7d0\" stroke=\"#16a34a\" stroke-width=\"1.5\"/><rect x=\"44\" y=\"65\" width=\"12\" height=\"30\" fill=\"#dcfce7\" stroke=\"#16a34a\"/><rect x=\"35\" y=\"95\" width=\"30\" height=\"50\" fill=\"#e0f2fe\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><rect x=\"36\" y=\"125\" width=\"28\" height=\"19\" fill=\"#60a5fa\"/><text x=\"50\" y=\"160\" font-size=\"9\" font-weight=\"bold\" fill=\"#15803d\" text-anchor=\"middle\">Soil Y (Loam: 45 cm³)</text></g><g transform=\"translate(260,20)\"><polygon points=\"20,20 80,20 55,65 45,65\" fill=\"#fed7aa\" stroke=\"#c2410c\" stroke-width=\"1.5\"/><rect x=\"44\" y=\"65\" width=\"12\" height=\"30\" fill=\"#ffedd5\" stroke=\"#c2410c\"/><rect x=\"35\" y=\"95\" width=\"30\" height=\"50\" fill=\"#e0f2fe\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><rect x=\"36\" y=\"137\" width=\"28\" height=\"7\" fill=\"#60a5fa\"/><text x=\"50\" y=\"160\" font-size=\"9\" font-weight=\"bold\" fill=\"#c2410c\" text-anchor=\"middle\">Soil Z (Clay: 15 cm³)</text></g></svg>",
        "prompt": "In a school laboratory experiment to determine water drainage and retention capacity of soils, 100 cm³ of water was poured through equal masses (50 g) of three dry soil samples X, Y, and Z. The volumes of water collected in the cylinders after 15 minutes were recorded as shown.\n(i) Identify soil samples X, Y, and Z.\n(ii) Calculate the volume of water retained by soil sample Y.\n(iii) Calculate the percentage water-holding capacity of soil sample Z.\n(iv) Explain why soil sample Y is regarded as the most ideal medium for crop cultivation.",
        "hint": "Water retained = Initial volume (100 cm³) - Volume drained.",
        "modelAnswer": "(i) Soil X: Sandy soil (highest drainage: 85 cm³);\nSoil Y: Loamy soil (moderate drainage: 45 cm³);\nSoil Z: Clayey soil (lowest drainage: 15 cm³) [3 marks].\n\n(ii) Water retained by Soil Y = $$100\\text{ cm}^3 - 45\\text{ cm}^3 = 55\\text{ cm}^3$$ [2 marks].\n\n(iii) Water retained by Soil Z = $$100\\text{ cm}^3 - 15\\text{ cm}^3 = 85\\text{ cm}^3$$.\n$$\\text{Percentage water-holding capacity} = \\frac{85}{100} \\times 100\\% = 85\\%$$ [3 marks].\n\n(iv) Agronomic suitability of Loam (Y) [2 marks]: It contains a balanced proportion of sand, silt, clay, and organic humus, providing optimal drainage and aeration while retaining sufficient moisture and dissolved plant nutrients.",
        "workedSolution": "Full points for accurate texture classification based on percolation kinetics and calculation of volumetric retention."
      },
      {
        "partLabel": "(d)",
        "marks": 10,
        "diagramSvg": "<svg viewBox=\"0 0 340 170\" width=\"100%\" height=\"150\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100%\" height=\"100%\" rx=\"8\" fill=\"#0f172a\" stroke=\"#334155\" stroke-width=\"1.5\"/><rect x=\"35\" y=\"35\" width=\"270\" height=\"100\" rx=\"4\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"2\"/><line x1=\"145\" y1=\"35\" x2=\"195\" y2=\"35\" stroke=\"#0f172a\" stroke-width=\"6\"/><polygon points=\"160,25 180,35 160,45\" fill=\"#38bdf8\" stroke=\"#38bdf8\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"25\" x2=\"180\" y2=\"45\" stroke=\"#38bdf8\" stroke-width=\"2.5\"/><text x=\"170\" y=\"18\" font-size=\"10\" font-weight=\"bold\" fill=\"#38bdf8\" text-anchor=\"middle\">Semiconductor Diode D</text><line x1=\"60\" y1=\"85\" x2=\"110\" y2=\"85\" stroke=\"#0f172a\" stroke-width=\"6\"/><line x1=\"80\" y1=\"73\" x2=\"80\" y2=\"97\" stroke=\"#facc15\" stroke-width=\"3\"/><line x1=\"92\" y1=\"78\" x2=\"92\" y2=\"92\" stroke=\"#facc15\" stroke-width=\"2\"/><text x=\"65\" y=\"90\" font-size=\"11\" font-weight=\"bold\" fill=\"#facc15\">+</text><text x=\"105\" y=\"90\" font-size=\"12\" font-weight=\"bold\" fill=\"#facc15\">-</text><text x=\"86\" y=\"112\" font-size=\"9\" fill=\"#facc15\" text-anchor=\"middle\">Cell (1.5 V)</text><circle cx=\"245\" cy=\"85\" r=\"15\" fill=\"#fbbf24\" stroke=\"#d97706\" stroke-width=\"1.5\"/><line x1=\"235\" y1=\"75\" x2=\"255\" y2=\"95\" stroke=\"#92400e\" stroke-width=\"1.5\"/><line x1=\"255\" y1=\"75\" x2=\"235\" y2=\"95\" stroke=\"#92400e\" stroke-width=\"1.5\"/><text x=\"245\" y=\"115\" font-size=\"9\" font-weight=\"bold\" fill=\"#fbbf24\" text-anchor=\"middle\">Filament Lamp L</text></svg>",
        "prompt": "The circuit diagram shows a 1.5 V dry cell connected in series with a p-n junction diode D, a filament lamp L, and connecting copper leads.\n(i) State whether diode D is connected in forward bias or reverse bias. Explain your answer.\n(ii) Describe what happens to the depletion layer of diode D in this configuration.\n(iii) State the observation made regarding lamp L when the switch is closed.\n(iv) Predict and explain what happens to lamp L if the terminals of the dry cell are reversed.",
        "hint": "Forward bias: p-type (anode) connected to positive terminal, n-type (cathode) to negative.",
        "modelAnswer": "(i) Forward bias [1 mark]. The positive terminal (+) of the cell is connected to the p-type anode of the diode, and the negative terminal (-) is connected to the n-type cathode [2 marks].\n(ii) Depletion layer behavior: The applied potential overcomes the internal junction barrier, narrowing and virtually eliminating the depletion layer, thus drastically lowering electrical resistance [2 marks].\n(iii) Observation: Lamp L lights up brightly because forward-bias current conducts freely around the closed loop [2 marks].\n(iv) If terminals are reversed: Lamp L fails to light up [1 mark]. Explanation: The diode enters reverse bias; the depletion region widens, creating an extremely high potential barrier that blocks conventional current flow [2 marks].",
        "workedSolution": "Complete semiconductor physics rationale detailing diode polarity, depletion layer kinetics, and conduction states."
      }
    ]
  },
  {
    "id": "q02",
    "title": "Question 2: Diversity of Matter & Chemical Bonding",
    "totalMarks": 15,
    "points": 15,
    "format": "structured_essay",
    "prompt": "Answer all parts of this question:",
    "workedSolution": "See atomic structure, electron configurations, and ionic bonding derivations below.",
    "parts": [
      {
        "partLabel": "(a)",
        "marks": 8,
        "prompt": "Magnesium has an atomic number of 12 and chlorine has an atomic number of 17.\n(i) Write the electron configuration for an atom of magnesium and an atom of chlorine.\n(ii) State the valency of magnesium and chlorine.\n(iii) Explain how magnesium and chlorine atoms attain stable noble gas octet configurations when reacting.",
        "hint": "Magnesium: 2, 8, 2. Chlorine: 2, 8, 7. Think about electron transfer.",
        "modelAnswer": "(i) Magnesium ($Z=12$): $2, 8, 2$. Chlorine ($Z=17$): $2, 8, 7$ [2 marks].\n(ii) Valency of Magnesium = 2; Valency of Chlorine = 1 [2 marks].\n(iii) Octet attainment [4 marks]:\n- Each magnesium atom loses its 2 valence electrons to form a stable magnesium cation ($Mg^{2+}$ with configuration $2, 8$, isoelectronic with neon).\n- Two separate chlorine atoms each accept 1 electron into their valence shell to form chloride anions ($Cl^-$ with configuration $2, 8, 8$, isoelectronic with argon).",
        "workedSolution": "Step-by-step electronic shell filling ($K=2, L=8, M=2$) and electron donation/acceptance mechanism."
      },
      {
        "partLabel": "(b)",
        "marks": 7,
        "prompt": "(i) Write the balanced chemical formula for magnesium chloride.\n(ii) Identify the type of bond existing in magnesium chloride and define it.\n(iii) State two physical properties characteristic of electrovalent compounds like magnesium chloride.",
        "hint": "Charges balance: $Mg^{2+}$ and $2Cl^-$ yields $MgCl_2$.",
        "modelAnswer": "(i) Balanced formula: $$MgCl_2$$ [1 mark].\n(ii) Bond type: Ionic (Electrovalent) bond [1 mark]. Definition: The electrostatic force of attraction between oppositely charged cations and anions formed by complete electron transfer [2 marks].\n(iii) Two physical properties [3 marks]:\n1. High melting and boiling points due to strong electrostatic crystal lattice forces.\n2. Conducts electricity in molten or aqueous states due to mobile ions, but does not conduct in solid state.",
        "workedSolution": "Correct chemical formulation and structural explanation of electrostatic lattice forces."
      }
    ]
  },
  {
    "id": "q03",
    "title": "Question 3: Biogeochemical Cycles & Agricultural Production",
    "totalMarks": 15,
    "points": 15,
    "format": "structured_essay",
    "prompt": "Answer all parts of this question:",
    "workedSolution": "See detailed microbial stages of the nitrogen cycle and animal digestive comparison below.",
    "parts": [
      {
        "partLabel": "(a)",
        "marks": 8,
        "prompt": "The nitrogen cycle is vital for sustaining soil fertility and protein synthesis in living organisms.\n(i) Outline the four main microbiological processes involved in the nitrogen cycle.\n(ii) Name the specific bacterium responsible for biological nitrogen fixation in the root nodules of legumes.\n(iii) State the role played by *Nitrosomonas* and *Nitrobacter* bacteria in soil nitrogen transformation.",
        "hint": "Fixation -> Nitrification -> Assimilation -> Denitrification.",
        "modelAnswer": "(i) Four processes [4 marks]:\n1. Nitrogen Fixation (conversion of atmospheric $N_2$ into ammonium/nitrates).\n2. Nitrification (oxidation of ammonia into nitrites and nitrates).\n3. Nitrogen Assimilation (uptake of nitrates by plant roots to synthesize plant proteins).\n4. Denitrification (conversion of soil nitrates back into gaseous nitrogen by denitrifying bacteria).\n(ii) Bacterium: *Rhizobium* [1 mark].\n(iii) Role of Nitrifying bacteria [3 marks]:\n- *Nitrosomonas* oxidizes ammonia ($NH_3$ / $NH_4^+$) into nitrites ($NO_2^-$).\n- *Nitrobacter* oxidizes toxic nitrites ($NO_2^-$) into plant-absorbable nitrates ($NO_3^-$).",
        "workedSolution": "Full sequential bacteriological pathway of nitrogen transformations in agricultural soils."
      },
      {
        "partLabel": "(b)",
        "marks": 7,
        "prompt": "(i) State two anatomical differences between the digestive system of a ruminant (e.g. goat) and a monogastric non-ruminant (e.g. pig).\n(ii) Explain the nutritional importance of crude fiber in the diet of ruminant farm animals.\n(iii) State two advantages of formulating a balanced ration for poultry layers.",
        "hint": "Ruminants have a complex 4-chambered stomach; monogastrics have a single simple stomach.",
        "modelAnswer": "(i) Anatomical differences [2 marks]:\n- Ruminants possess a four-chambered stomach (Rumen, Reticulum, Omasum, Abomasum); monogastrics possess a single simple stomach.\n- Ruminants possess a dental pad instead of upper incisors and practice rumination (chewing the cud); monogastrics possess both upper and lower incisors.\n(ii) Crude fiber importance [2 marks]: Cellulose and hemicellulose are fermented by rumen microflora into volatile fatty acids (acetate, propionate, butyrate), which supply over 70% of the animal's metabolic energy.\n(iii) Advantages of balanced ration for layers [3 marks]:\n1. Optimizes egg production rate, eggshell thickness, and yolk color.\n2. Prevents deficiency disorders (such as cage layer fatigue from calcium deficiency) and enhances disease immunity.",
        "workedSolution": "Comparative digestive physiology and nutritional biochemistry for commercial livestock husbandry."
      }
    ]
  },
  {
    "id": "q04",
    "title": "Question 4: Human Body Systems & Ecosystem Balance",
    "totalMarks": 15,
    "points": 15,
    "format": "structured_essay",
    "prompt": "Answer all parts of this question:",
    "workedSolution": "See human dentition formulas, dental hygiene, and trophic dynamics below.",
    "parts": [
      {
        "partLabel": "(a)",
        "marks": 8,
        "prompt": "(i) State the four types of teeth found in the human mouth and specify the primary mechanical function of each.\n(ii) Write down the dental formula of an adult human.\n(iii) Explain how dental caries (tooth decay) develops and state two effective preventive measures.",
        "hint": "Incisors (biting/cutting), Canines (tearing), Premolars/Molars (grinding/crushing).",
        "modelAnswer": "(i) Four teeth types and functions [4 marks]:\n- Incisors: Chisel-shaped for biting and cutting food pieces.\n- Canines: Sharp and pointed for gripping and tearing tough fibrous food.\n- Premolars: Broad cusped surfaces for chewing and grinding.\n- Molars: Large flat crowns with multiple cusps for crushing and pulverizing food.\n(ii) Adult Dental Formula: $$i\\frac{2}{2}, c\\frac{1}{1}, pm\\frac{2}{2}, m\\frac{3}{3}$$ (Total 32 teeth) [1 mark].\n(iii) Dental caries development and prevention [3 marks]:\n- Development: Bacteria in dental plaque ferment trapped refined sugars, producing organic lactic acid that demineralizes and dissolves calcium hydroxyapatite enamel.\n- Preventive measures: Regular brushing with fluoridated toothpaste twice daily; reducing intake of sugary confections; routine dental checkups.",
        "workedSolution": "Complete dental taxonomy, formula verification, bacterial plaque acidogenesis, and preventive prophylaxis."
      },
      {
        "partLabel": "(b)",
        "marks": 7,
        "prompt": "In a coastal savanna ecosystem, the following organisms interact:\n$$\\text{Guinea grass}, \\text{Grasshoppers}, \\text{Toads}, \\text{Snakes}, \\text{Hawks}$$.\n(i) Construct a linear food chain showing all four consumer trophic levels.\n(ii) What happens to the energy transferred from one trophic level to the next higher level? Explain why food chains rarely exceed 4 or 5 trophic levels.\n(iii) Predict two ecological consequences if all snakes in this habitat were eliminated by poachers.",
        "hint": "Only about 10% of energy is transferred between adjacent trophic levels (Lindeman's Efficiency).",
        "modelAnswer": "(i) Food Chain: $$\\text{Guinea grass (Producer)} \\rightarrow \\text{Grasshopper (Primary Consumer)} \\rightarrow \\text{Toad (Secondary Consumer)} \\rightarrow \\text{Snake (Tertiary Consumer)} \\rightarrow \\text{Hawk (Quaternary Consumer)}$$ [2 marks].\n(ii) Energy transfer (10% Rule) [2 marks]: Approximately 90% of energy is lost at each trophic level through metabolic respiration, heat loss, excretion, and unconsumed parts. Only ~10% is incorporated into new biomass; by the 5th level, insufficient energy remains to sustain another population.\n(iii) Elimination of snakes [3 marks]:\n- Population explosion of toads (loss of their primary predator).\n- Depletion of grasshoppers due to severe toad predation pressure, disrupting vegetation balance and causing hawk populations to decline or migrate.",
        "workedSolution": "Ecosystem energy thermodynamics and trophic cascading perturbation analysis."
      }
    ]
  },
  {
    "id": "q05",
    "title": "Question 5: Forces, Energy Calculations & The Green Economy",
    "totalMarks": 15,
    "points": 15,
    "format": "structured_essay",
    "prompt": "Answer all parts of this question:",
    "workedSolution": "See step-by-step mechanical energy derivations and green economy climate strategies below.",
    "parts": [
      {
        "partLabel": "(a)",
        "marks": 8,
        "prompt": "A stone of mass 2.5 kg is held stationary at the top of a cliff 20 m above the ground ($g = 10\\text{ m/s}^2$).\n(i) State the Law of Conservation of Energy.\n(ii) Calculate the gravitational potential energy of the stone at the top of the cliff.\n(iii) Neglecting air resistance, determine the kinetic energy and velocity of the stone immediately before it impacts the ground.",
        "hint": "$$PE = mgh$$, $$\\text{Loss in } PE = \\text{Gain in } KE$$, $$v = \\sqrt{2gh}$$.",
        "modelAnswer": "(i) Law of Conservation of Energy: Energy cannot be created or destroyed; it can only be transformed from one form into another [2 marks].\n\n(ii) Gravitational Potential Energy: $$PE = m \\times g \\times h = 2.5\\text{ kg} \\times 10\\text{ m/s}^2 \\times 20\\text{ m} = 500\\text{ Joules}$$ [2 marks].\n\n(iii) Immediately before impact [4 marks]:\n- By conservation of mechanical energy: $$\\text{Kinetic Energy (KE)} = \\text{Initial } PE = 500\\text{ Joules}$$.\n- Calculating velocity: $$KE = \\frac{1}{2}mv^2 \\implies 500 = \\frac{1}{2}(2.5)v^2$$\n$$1.25 v^2 = 500 \\implies v^2 = \\frac{500}{1.25} = 400$$\n$$v = \\sqrt{400} = 20\\text{ m/s}$$.",
        "workedSolution": "Rigorous physical calculations demonstrating mechanical energy conservation and kinematic velocity verification."
      },
      {
        "partLabel": "(b)",
        "marks": 7,
        "prompt": "(i) Distinguish between climate change and global warming.\n(ii) Name two principal greenhouse gases emitted through human industrial and agricultural activities.\n(iii) Describe two sustainable green economy measures that communities in Ghana can implement to mitigate climate change.",
        "hint": "Global warming is the rise in average global temperature; climate change includes long-term shifts in weather patterns.",
        "modelAnswer": "(i) Distinction [2 marks]: Global warming refers specifically to the long-term rise in Earth's average surface temperature caused by greenhouse gas accumulation. Climate change is the broader array of resultant shifts, including erratic rainfall, sea level rise, droughts, and intensified storms.\n(ii) Two greenhouse gases: Carbon dioxide ($CO_2$) and Methane ($CH_4$) [2 marks].\n(iii) Sustainable green economy measures [3 marks]:\n1. Afforestation and Community Agroforestry: Planting indigenous timber and cashew belts to sequester atmospheric carbon.\n2. Adoption of Solar and Biomass Clean Energy: Replacing wood charcoal burning with solar photovoltaic systems and agricultural briquettes.",
        "workedSolution": "Comprehensive environmental science terminology, atmospheric physics, and actionable green economy mitigations."
      }
    ]
  }
]
};
