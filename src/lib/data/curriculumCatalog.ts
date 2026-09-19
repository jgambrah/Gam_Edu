import { AssignmentExamOption } from '@/types/assignmentTypes';

/**
 * Universal Curriculum & Question Catalog
 * Combines all standardized past paper variants, mastery series, and subject modules.
 */
export const COMPREHENSIVE_QUESTION_CATALOG: AssignmentExamOption[] = [
  // ==========================================
  // INTEGRATED SCIENCE - NACCA CCP PREPARATORY VARIANTS (SETS 70 & 71)
  // ==========================================
  {
    id: 'paper_nacca_sample_variant_p1',
    title: 'NaCCA Integrated Science CCP Preparatory CBT Exam (Set 70)',
    year: 2024,
    setNumber: 70,
    paperType: 1,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'NaCCA CBT Set 70',
    questionCount: 50,
    topic: 'NaCCA 50-Item Preparatory Assessment Blueprint',
    description: 'Official 50-item randomized CBT examination with immediate grading, vector diagrams, and KaTeX equations aligned with B7-B9 strands.'
  },
  {
    id: 'paper_nacca_sample_variant_p2',
    title: 'NaCCA Integrated Science CCP Practical & Theory Exam (Set 71)',
    year: 2024,
    setNumber: 71,
    paperType: 2,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'NaCCA Theory Set 71',
    questionCount: 5,
    topic: 'Practical Science Labs & Core Theory',
    description: 'Section A compulsory practical tests (cells, levers, soil permeability, diode circuits) + Section B theory essay questions with AI rubrics.'
  },
  {
    id: 'paper_2026_variant',
    title: '2026 BECE Integrated Science Paper 1 (Set 72 Objective)',
    year: 2026,
    setNumber: 72,
    paperType: 1,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Science Set 72',
    questionCount: 40,
    topic: 'BECE 2026 Science Blueprint & Standardized CBT',
    description: 'Calibrated isomorphic practice variant of 2026 BECE Integrated Science Paper 1 with KaTeX equations, vector SVGs, and step-by-step worked solutions.'
  },
  {
    id: 'paper_2026_variant_p2',
    title: '2026 BECE Integrated Science Paper 2 (Set 73 Practical & Essay)',
    year: 2026,
    setNumber: 73,
    paperType: 2,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Science Set 73',
    questionCount: 5,
    topic: '2026 BECE Practical & Theory Essay Test',
    description: 'Calibrated isomorphic practice variant of 2026 BECE Integrated Science Paper 2 featuring Section A compulsory practical tests (farm animals, respiratory system, Ohm\'s law, pH colorimetric analysis) and Section B theory essays.'
  },
  {
    id: 'paper_2014_variant',
    title: '2014 BECE Integrated Science Paper 1 (Set 74 Objective)',
    year: 2014,
    setNumber: 74,
    paperType: 1,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Science Set 74',
    questionCount: 40,
    topic: '2014 BECE Integrated Science Standardized CBT',
    description: 'Calibrated isomorphic practice variant of 2014 BECE Integrated Science Paper 1 with KaTeX equations, vector SVGs, and step-by-step worked solutions.'
  },
  {
    id: 'paper_2014_variant_p2',
    title: '2014 BECE Integrated Science Paper 2 (Set 75 Practical & Essay)',
    year: 2014,
    setNumber: 75,
    paperType: 2,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Science Set 75',
    questionCount: 6,
    topic: '2014 BECE Practical & Theory Essay Test',
    description: 'Calibrated isomorphic practice variant of 2014 BECE Integrated Science Paper 2 featuring Section A compulsory practical tests (mosquito life cycle, separation setups, measuring instruments, avian digestive anatomy) and Section B theory essays.'
  },
  {
    id: 'paper_2015_variant',
    title: '2015 BECE Integrated Science Paper 1 (Set 76 Objective)',
    year: 2015,
    setNumber: 76,
    paperType: 1,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Science Set 76',
    questionCount: 40,
    topic: '2015 BECE Integrated Science Standardized CBT',
    description: 'Calibrated isomorphic practice variant of 2015 BECE Integrated Science Paper 1 with KaTeX equations, vector SVGs, and step-by-step worked solutions.'
  },
  {
    id: 'paper_2015_variant_p2',
    title: '2015 BECE Integrated Science Paper 2 (Set 77 Practical & Essay)',
    year: 2015,
    setNumber: 77,
    paperType: 2,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Science Set 77',
    questionCount: 6,
    topic: '2015 BECE Practical & Theory Essay Test',
    description: 'Calibrated isomorphic practice variant of 2015 BECE Integrated Science Paper 2 featuring Section A compulsory practical tests (animal parasites, optical reflection at plane mirrors, sodium water reactivity, seed germination conditions) and Section B theory essays.'
  },
  {
    id: 'paper_2016_variant',
    title: '2016 BECE Integrated Science Paper 1 (Set 78 Objective)',
    year: 2016,
    setNumber: 78,
    paperType: 1,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Science Set 78',
    questionCount: 40,
    topic: '2016 BECE Integrated Science Standardized CBT',
    description: 'Calibrated isomorphic practice variant of 2016 BECE Integrated Science Paper 1 with KaTeX equations, vector SVGs, and step-by-step worked solutions.'
  },
  {
    id: 'paper_2016_variant_p2',
    title: '2016 BECE Integrated Science Paper 2 (Set 79 Practical & Essay)',
    year: 2016,
    setNumber: 79,
    paperType: 2,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Science Set 79',
    questionCount: 6,
    topic: '2016 BECE Practical & Theory Essay Test',
    description: 'Calibrated isomorphic practice variant of 2016 BECE Integrated Science Paper 2 featuring Section A compulsory practical tests (comparative soil drainage and water retention, standard hazard warning pictograms, simple machines, human digestive system) and Section B theory essays.'
  },
  {
    id: 'paper_2017_variant',
    title: '2017 BECE Integrated Science Paper 1 (Set 80 Objective)',
    year: 2017,
    setNumber: 80,
    paperType: 1,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Science Set 80',
    questionCount: 40,
    topic: '2017 BECE Integrated Science Standardized CBT',
    description: 'Calibrated isomorphic practice variant of 2017 BECE Integrated Science Paper 1 with KaTeX equations, vector SVGs, and step-by-step worked solutions.'
  },

  // ==========================================
  // MATHEMATICS - BECE PAST EXAM VARIANTS (MODERN ERA)
  // ==========================================
  {
    id: 'paper_2025_variant',
    title: '2025 BECE Mathematics Paper 2 (Set 65 Theory)',
    year: 2025,
    setNumber: 65,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2025 Theory',
    questionCount: 6,
    topic: 'Algebra, Geometry & Statistics',
    description: 'Modern standard 6-question theory paper with step-by-step AI marking rubrics, vectors, Venn diagrams, and algebraic fractions.'
  },
  {
    id: 'paper_2025_p1_variant',
    title: '2025 BECE Mathematics Paper 1 (Objective CBT)',
    year: 2025,
    setNumber: 65,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2025 CBT',
    questionCount: 40,
    topic: 'Core Curriculum Mastery',
    description: '40 randomized multiple-choice questions covering full JHS syllabus with immediate grading.'
  },
  {
    id: 'paper_2024_variant',
    title: '2024 BECE Mathematics Paper 2 (Set 60 Theory)',
    year: 2024,
    setNumber: 60,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2024 Theory',
    questionCount: 6,
    topic: 'Quadratics, Polygons & Probability',
    description: 'Official-standard structured paper covering polygon angle theorems, linear inequalities, and probability distributions.'
  },
  {
    id: 'paper_2024_p1_variant',
    title: '2024 BECE Mathematics Paper 1 (Objective CBT)',
    year: 2024,
    setNumber: 60,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2024 CBT',
    questionCount: 40,
    topic: 'Numeracy & Proportions',
    description: '40 multiple-choice questions on percentages, standard form, ratio, and transformations.'
  },
  {
    id: 'paper_2023_variant',
    title: '2023 BECE Mathematics Paper 2 (Set 62 Theory)',
    year: 2023,
    setNumber: 62,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2023 Theory',
    questionCount: 6,
    topic: 'Trigonometry & Solid Mensuration',
    description: 'Structured theory focusing on cylinder-to-cone volumes, bearings, and simultaneous equations.'
  },
  {
    id: 'paper_2023_p1_variant',
    title: '2023 BECE Mathematics Paper 1 (Objective CBT)',
    year: 2023,
    setNumber: 62,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2023 CBT',
    questionCount: 40,
    topic: 'Core Mathematics',
    description: '40 CBT questions on binary operations, prime factorization, and coordinate geometry.'
  },
  {
    id: 'paper_2022_variant',
    title: '2022 BECE Mathematics Paper 2 (Set 64 Theory)',
    year: 2022,
    setNumber: 64,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2022 Theory',
    questionCount: 6,
    topic: 'Linear Relations & Circle Geometry',
    description: 'Full multi-part structured theory paper covering circle theorems, coordinate geometry, and business arithmetic.'
  },
  {
    id: 'paper_2022_p1_variant',
    title: '2022 BECE Mathematics Paper 1 (Objective CBT)',
    year: 2022,
    setNumber: 64,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2022 CBT',
    questionCount: 40,
    topic: 'Objective Standard',
    description: '40 questions on sequences, profit & loss, base-two arithmetic, and angles.'
  },
  {
    id: 'paper_2021_variant',
    title: '2021 BECE Mathematics Paper 2 (Set 63 Theory)',
    year: 2021,
    setNumber: 63,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2021 Theory',
    questionCount: 6,
    topic: 'Mensuration, Statistics & Sets',
    description: 'Theory exam with SVG geometry diagrams for composite shapes and frequency polygons.'
  },
  {
    id: 'paper_2021_p1_variant',
    title: '2021 BECE Mathematics Paper 1 (Objective CBT)',
    year: 2021,
    setNumber: 63,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2021 CBT',
    questionCount: 40,
    topic: 'Numeracy & Algebra',
    description: 'Standardized 40 questions covering algebraic expansion, fractions, and indices.'
  },
  {
    id: 'paper_2020_variant',
    title: '2020 BECE Mathematics Paper 2 (Set 61 Theory)',
    year: 2020,
    setNumber: 61,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2020 Theory',
    questionCount: 6,
    topic: 'Plane Geometry & Data Handling',
    description: 'Classic WAEC standard 6-question theory exam with step-by-step derivations.'
  },
  {
    id: 'paper_2020_p1_variant',
    title: '2020 BECE Mathematics Paper 1 (Objective CBT)',
    year: 2020,
    setNumber: 61,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2020 CBT',
    questionCount: 40,
    topic: 'Core Curriculum',
    description: '40 multiple-choice questions on sets, percentages, and simple equations.'
  },
  {
    id: 'paper_2019_variant',
    title: '2019 BECE Mathematics Paper 2 (Set 67 Theory)',
    year: 2019,
    setNumber: 67,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2019 Theory',
    questionCount: 6,
    topic: 'Composite Shapes & Statistics',
    description: 'Multi-part problems with embedded diagrams and frequency distribution calculations.'
  },
  {
    id: 'paper_2019_p1_variant',
    title: '2019 BECE Mathematics Paper 1 (Set 66 Objective CBT)',
    year: 2019,
    setNumber: 66,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE 2019 CBT',
    questionCount: 40,
    topic: 'General Mathematics',
    description: '40 objective questions covering vectors, geometry, and consumer arithmetic.'
  },

  // ==========================================
  // MATHEMATICS - HISTORIC MASTERY SERIES (SETS 01 - 20)
  // ==========================================
  {
    id: 'jhs-math-mastery-series-01',
    title: 'Junior Core Math • Objective Mastery Series (Set 1 / 2012 Variant)',
    year: 2012,
    setNumber: 1,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'Mastery Series',
    questionCount: 40,
    topic: 'Arithmetic, Sets & Fractions',
    description: '40 questions on standard form, prime factors, set unions, and geometric transformations.'
  },
  {
    id: 'jhs-math-mastery-series-02',
    title: 'Junior Core Math • Structured Problem-Solving (Set 2 / 2012 Variant)',
    year: 2012,
    setNumber: 2,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'Mastery Series',
    questionCount: 6,
    topic: 'Algebra & Geometry',
    description: '6 multi-part questions covering algebraic fractions, Venn diagram partitions, and prism volumes.'
  },
  {
    id: 'jhs-math-mastery-series-03',
    title: 'Junior Core Math • Objective Mastery Series (Set 3 / 2011 Variant)',
    year: 2011,
    setNumber: 3,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'Mastery Series',
    questionCount: 40,
    topic: 'Numeracy & Sequences',
    description: '40 questions on base conversions, indices, ratio, and plane geometry.'
  },
  {
    id: 'jhs-math-mastery-series-04',
    title: 'Junior Core Math • Structured Problem-Solving (Set 4 / 2011 Variant)',
    year: 2011,
    setNumber: 4,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'Mastery Series',
    questionCount: 6,
    topic: 'Coordinate Reflections & Statistics',
    description: 'Structured theory featuring reflections, translations, and frequency distributions.'
  },
  {
    id: 'jhs-math-mastery-series-05',
    title: 'Junior Core Math • Objective Mastery Series (Set 5 / 2010 Variant)',
    year: 2010,
    setNumber: 5,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'Mastery Series',
    questionCount: 40,
    topic: 'Sequences & Probability',
    description: '40 objective questions covering well-defined sets, base-five sequences, and probability.'
  },
  {
    id: 'jhs-math-mastery-series-06',
    title: 'Junior Core Math • Structured Problem-Solving (Set 6 / 2010 Variant)',
    year: 2010,
    setNumber: 6,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'Mastery Series',
    questionCount: 6,
    topic: 'Liquid Volumes & Trapeziums',
    description: 'Cuboid-to-cylinder liquid volumes, intersecting lines, and factorization.'
  },
  {
    id: 'jhs-math-mastery-series-07',
    title: 'Junior Core Math • Objective Mastery Series (Set 7 / 2009 Variant)',
    year: 2009,
    setNumber: 7,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'Mastery Series',
    questionCount: 40,
    topic: 'Vectors & Angles',
    description: '40 questions on standard form, linear equations, vectors, and percentages.'
  },
  {
    id: 'jhs-math-mastery-series-08',
    title: 'Junior Core Math • Structured Problem-Solving (Set 8 / 2009 Variant)',
    year: 2009,
    setNumber: 8,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'Mastery Series',
    questionCount: 6,
    topic: 'Pie Charts & Transformations',
    description: 'Pie chart sector angles, composite land areas, and column vectors.'
  },
  {
    id: 'jhs-math-mastery-series-58',
    title: 'Junior Core Math • Objective Mastery Series (Set 58)',
    year: 2018,
    setNumber: 58,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'WAEC Standard',
    questionCount: 40,
    topic: 'Full JHS Mathematics Syllabus',
    description: 'Comprehensive 40-question CBT exam series across all arithmetic, algebra, and geometry strands.'
  },
  {
    id: 'jhs-math-mastery-series-59',
    title: 'Junior Core Math • Structured Problem-Solving (Set 59)',
    year: 2018,
    setNumber: 59,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Junior High (JHS)',
    badge: 'WAEC Standard',
    questionCount: 6,
    topic: 'Structured Geometry & Algebra',
    description: 'Step-by-step multi-part theory problems with detailed marking schemes.'
  },

  // ==========================================
  // SENIOR HIGH (SHS) & WASSCE MATHEMATICS
  // ==========================================
  {
    id: 'shs-math-calc-01',
    title: 'WASSCE Elective Math • Paper 1 (Calculus & Core Analysis)',
    year: 2024,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Senior High (SHS)',
    badge: 'WASSCE Series',
    questionCount: 40,
    topic: 'Calculus, Polynomials & Vectors',
    description: 'Official-standard SHS WASSCE examination series covering differentiation, matrices, and vectors.'
  },
  {
    id: 'shs-math-algebra-01',
    title: 'SHS Core Math • Polynomials & Quadratic Functions',
    year: 2023,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Senior High (SHS)',
    badge: 'SHS Core',
    questionCount: 5,
    topic: 'Polynomial Systems & Discriminants',
    description: 'Formulate and solve higher-degree polynomial systems, remainder theorem, and quadratic roots.'
  },
  {
    id: 'shs-math-trig-01',
    title: 'SHS Elective Math • Trigonometric Identities & Circle Theorems',
    year: 2023,
    paperType: 2,
    subject: 'Mathematics',
    gradeTier: 'Senior High (SHS)',
    badge: 'SHS Elective',
    questionCount: 5,
    topic: 'Trigonometry & Radians',
    description: 'Compound angle proofs, unit circle radian measures, sine/cosine rules, and cyclic quadrilaterals.'
  },

  // ==========================================
  // INTEGRATED SCIENCE - BECE & TOPICAL LABS
  // ==========================================
  {
    id: 'bece-science-2024-p1',
    title: '2024 BECE Integrated Science Paper 1 (Objective CBT)',
    year: 2024,
    paperType: 1,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Science CBT',
    questionCount: 40,
    topic: 'Physics, Chemistry, Biology & Agriculture',
    description: '40 standardized multiple-choice questions covering full JHS Integrated Science syllabus.'
  },
  {
    id: 'bece-science-2024-p2',
    title: '2024 BECE Integrated Science Paper 2 (Theory & Practicals)',
    year: 2024,
    paperType: 2,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Science Theory',
    questionCount: 5,
    topic: 'Laboratory Practicals & Systematic Analysis',
    description: 'Experimental setup questions, chemical equations, farming systems, and human digestive anatomy.'
  },
  {
    id: 'sci-jhs-mechanics-01',
    title: 'JHS Science • Newtonian Mechanics & Force Dynamics',
    year: 2023,
    paperType: 2,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'Physics Lab',
    questionCount: 6,
    topic: 'Forces, Friction & Newton Laws',
    description: 'Calculations on friction, acceleration, terminal velocity, and Newton three laws of motion.'
  },
  {
    id: 'sci-jhs-chemistry-01',
    title: 'JHS Science • Acids, Bases & Neutralization Reactions',
    year: 2023,
    paperType: 2,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'Chemistry Lab',
    questionCount: 5,
    topic: 'Acid-Base Chemistry & pH',
    description: 'Laboratory titrations, indicator color transitions, and common everyday neutralizations.'
  },
  {
    id: 'sci-jhs-circuits-01',
    title: 'JHS Science • Electric Circuits, Voltage & Ohm Law',
    year: 2023,
    paperType: 1,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'Electricity Lab',
    questionCount: 20,
    topic: 'Current, Voltage & Resistance',
    description: 'Series and parallel circuit calculations, ammeter readings, and domestic wiring safety.'
  },
  {
    id: 'sci-jhs-biology-01',
    title: 'JHS Science • Cellular Respiration & Photosynthesis',
    year: 2023,
    paperType: 2,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'Biology Lab',
    questionCount: 5,
    topic: 'Energy Pathways in Living Organisms',
    description: 'Light absorption, leaf anatomy, aerobic vs anaerobic respiration, and gas exchange.'
  },
  {
    id: 'sci-jhs-density-01',
    title: 'JHS Science • Density, Pressure & Liquid Upthrust',
    year: 2022,
    paperType: 1,
    subject: 'Integrated Science',
    gradeTier: 'Junior High (JHS)',
    badge: 'Fluids Lab',
    questionCount: 20,
    topic: 'Archimedes Principle & Floatation',
    description: 'Density hydrometers, hydrostatic pressure, and buoyant force derivations.'
  },

  // ==========================================
  // ENGLISH LANGUAGE - BECE & LITERACY SERIES
  // ==========================================
  {
    id: 'bece-english-2024-p1',
    title: '2024 BECE English Language Paper 1 (Lexis & Structure CBT)',
    year: 2024,
    paperType: 1,
    subject: 'English Language',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE English CBT',
    questionCount: 40,
    topic: 'Grammar, Synonyms, Antonyms & Idioms',
    description: '40 questions on verb tense agreement, prepositions, antonyms, synonyms, and punctuation.'
  },
  {
    id: 'bece-english-2024-p2',
    title: '2024 BECE English Language Paper 2 (Essay & Comprehension)',
    year: 2024,
    paperType: 2,
    subject: 'English Language',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE English Theory',
    questionCount: 4,
    topic: 'Continuous Writing, Summary & Passage Inferences',
    description: 'Formal letter writing, descriptive essay, comprehension inferences, and summary analysis.'
  },
  {
    id: 'eng-jhs-rhetoric-01',
    title: 'JHS English • Rhetorical Devices & Persuasive Writing',
    year: 2023,
    paperType: 2,
    subject: 'English Language',
    gradeTier: 'Junior High (JHS)',
    badge: 'Composition',
    questionCount: 4,
    topic: 'Debate, Ethos, Pathos & Logos',
    description: 'Crafting structured arguments, counter-arguments, rhetorical questions, and thesis statements.'
  },
  {
    id: 'eng-jhs-comprehension-01',
    title: 'JHS English • Critical Reading & Scholarly Inferences',
    year: 2023,
    paperType: 1,
    subject: 'English Language',
    gradeTier: 'Junior High (JHS)',
    badge: 'Reading Lab',
    questionCount: 25,
    topic: 'Passage Inferences & Context Clues',
    description: 'Contextual vocabulary, central themes, tone analysis, and inference questions.'
  },
  {
    id: 'eng-jhs-figurative-01',
    title: 'JHS English • Figurative Language, Similes & Metaphors',
    year: 2022,
    paperType: 1,
    subject: 'English Language',
    gradeTier: 'Junior High (JHS)',
    badge: 'Literary Devices',
    questionCount: 20,
    topic: 'Poetic Meter & Imagery',
    description: 'Identify personification, hyperbole, metaphors, alliteration, and onomatopoeia.'
  },

  // ==========================================
  // COMPUTING & ICT
  // ==========================================
  {
    id: 'computing-jhs-2024-p1',
    title: '2024 BECE Computing Paper 1 (Objective CBT)',
    year: 2024,
    paperType: 1,
    subject: 'Computing',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Computing',
    questionCount: 40,
    topic: 'Hardware, Software & Networking',
    description: '40 multiple-choice questions on digital literacy, operating systems, spreadsheets, and online safety.'
  },
  {
    id: 'computing-jhs-2024-p2',
    title: '2024 BECE Computing Paper 2 (Algorithms & Application Theory)',
    year: 2024,
    paperType: 2,
    subject: 'Computing',
    gradeTier: 'Junior High (JHS)',
    badge: 'BECE Computing Theory',
    questionCount: 4,
    topic: 'Flowcharts, Pseudocode & Office Tools',
    description: 'Structured algorithms, word processing shortcuts, database concepts, and cyber security protocols.'
  },

  // ==========================================
  // PRIMARY CURRICULUM (BS 1 - 6)
  // ==========================================
  {
    id: 'up-math-frac-01',
    title: 'Upper Primary Math • Fractions, Decimals & Proportions (BS 4 - 6)',
    year: 2024,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Upper Primary (BS 4 - 6)',
    badge: 'Primary Standard',
    questionCount: 20,
    topic: 'Fractions & Decimals',
    description: 'Equivalent fractions, mixed numbers, long division, and word problems with money.'
  },
  {
    id: 'lp-math-add-01',
    title: 'Lower Primary Math • Visual Addition & Number Bonds (BS 1 - 3)',
    year: 2024,
    paperType: 1,
    subject: 'Mathematics',
    gradeTier: 'Lower Primary (BS 1 - 3)',
    badge: 'Foundational',
    questionCount: 15,
    topic: 'Visual Addition',
    description: 'Counting on, number pairs to 20, and introductory subtraction with visual objects.'
  },
  {
    id: 'lp-eng-phonics-01',
    title: 'Lower Primary English • Phonics, Vowel Blends & Rhymes (BS 1 - 3)',
    year: 2024,
    paperType: 1,
    subject: 'English Language',
    gradeTier: 'Lower Primary (BS 1 - 3)',
    badge: 'Foundational',
    questionCount: 15,
    topic: 'Phonics & Sight Words',
    description: 'Consonant blends, rhyming pairs, silent vowels, and sentence completion.'
  }
];

export const SUBJECT_CATEGORIES = [
  'All Subjects',
  'Mathematics',
  'Integrated Science',
  'English Language',
  'Computing'
] as const;

export const GRADE_TIERS = [
  'All Levels',
  'Junior High (JHS)',
  'Upper Primary (BS 4 - 6)',
  'Lower Primary (BS 1 - 3)',
  'Senior High (SHS)'
] as const;
