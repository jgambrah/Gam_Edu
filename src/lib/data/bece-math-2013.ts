import { CurriculumQuestionSet } from '../global-curriculum-types';

export const BECE_2013_MATH_P1_DATA = {
  examMetadata: {
    examYear: 2013,
    examination: "BECE (Basic Education Certificate Examination)",
    subject: "Mathematics",
    paper: "Paper 1 (Objective Test)",
    totalQuestions: 40,
    timeAllowed: "1 hour",
    curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
    firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2013/paper_1"
  },
  questions: [
    {
      questionNumber: 1,
      id: "BECE_2013_P1_Q01",
      questionText: "If $A = \\{5, 10, 15, 20, 25, 125\\}$ and $B = \\{5, 10, 15, 20, 25, 625\\}$, list the elements of $A \\cup B$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $\\{5, 25\\}$",
        "B. $\\{10, 20, 125, 625\\}$",
        "C. $\\{5, 15, 25, 125, 625\\}$",
        "D. $\\{5, 10, 15, 20, 25, 125, 625\\}$"
      ],
      correctAnswer: "D",
      workedSolution: "The union of two sets, $A \\cup B$, is the set of all distinct elements belonging to set $A$, set $B$, or both.\n\n$$A = \\{5, 10, 15, 20, 25, 125\\}$$\n$$B = \\{5, 10, 15, 20, 25, 625\\}$$\n\nCombining all distinct elements in ascending order:\n$$A \\cup B = \\{5, 10, 15, 20, 25, 125, 625\\}$$\n\nTherefore, option D is correct.",
      topic: "Sets and Operations on Sets"
    },
    {
      questionNumber: 2,
      id: "BECE_2013_P1_Q02",
      questionText: "Express $1.25$ as a percentage.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $25\\%$",
        "B. $75\\%$",
        "C. $125\\%$",
        "D. $175\\%$"
      ],
      correctAnswer: "C",
      workedSolution: "To convert a decimal numeral to a percentage, multiply by $100\\%$:\n\n$$1.25 \\times 100\\% = 125\\%$$\n\nTherefore, option C is correct.",
      topic: "Percentages and Decimals"
    },
    {
      questionNumber: 3,
      id: "BECE_2013_P1_Q03",
      questionText: "Arrange the following in ascending order of magnitude: $0.301, 0.3, 0.33, 0.03$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $0.03, 0.3, 0.301, 0.33$",
        "B. $0.03, 0.301, 0.3, 0.33$",
        "C. $0.33, 0.3, 0.301, 0.03$",
        "D. $0.33, 0.301, 0.3, 0.03$"
      ],
      correctAnswer: "A",
      workedSolution: "Equate the decimal places to three thousandths for direct comparison:\n- $0.03 = 0.030$\n- $0.3 = 0.300$\n- $0.301 = 0.301$\n- $0.33 = 0.330$\n\nComparing integers after the decimal point: $30 < 300 < 301 < 330$.\n\nAscending order:\n$$0.03, 0.3, 0.301, 0.33$$\n\nTherefore, option A is correct.",
      topic: "Fractions and Decimals"
    },
    {
      questionNumber: 4,
      id: "BECE_2013_P1_Q04",
      questionText: "Evaluate $53 - (-7) + (-15)$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $31$",
        "B. $45$",
        "C. $61$",
        "D. $75$"
      ],
      correctAnswer: "B",
      workedSolution: "Apply standard signed integer arithmetic:\n\n$$53 - (-7) + (-15) = 53 + 7 - 15$$\n$$= 60 - 15 = 45$$\n\nTherefore, option B is correct.",
      topic: "Operations on Integers"
    },
    {
      questionNumber: 5,
      id: "BECE_2013_P1_Q05",
      questionText: "Given that $A = \\{a, e, i, o, u\\}$ and $B = \\{r, s, t\\}$, how many elements are in $A \\cap B$?",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $0$",
        "B. $1$",
        "C. $2$",
        "D. $3$"
      ],
      correctAnswer: "A",
      workedSolution: "The intersection $A \\cap B$ comprises elements shared by both sets.\n\nSet $A$ contains vowels: $\\{a, e, i, o, u\\}$.\nSet $B$ contains consonants: $\\{r, s, t\\}$.\n\nThere are no common elements:\n$$A \\cap B = \\emptyset = \\{\\}$$\n$$n(A \\cap B) = 0$$\n\nTherefore, option A is correct.",
      topic: "Sets and Operations on Sets"
    },
    {
      questionNumber: 6,
      id: "BECE_2013_P1_Q06",
      questionText: "Convert $2114_5$ to a base ten numeral.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $194$",
        "B. $280$",
        "C. $284$",
        "D. $300$"
      ],
      correctAnswer: "C",
      workedSolution: "Expand using powers of base 5:\n\n$$2114_5 = (2 \\times 5^3) + (1 \\times 5^2) + (1 \\times 5^1) + (4 \\times 5^0)$$\n$$= (2 \\times 125) + (1 \\times 25) + (1 \\times 5) + (4 \\times 1)$$\n$$= 250 + 25 + 5 + 4 = 284_{10}$$\n\nTherefore, option C is correct.",
      topic: "Number Bases"
    },
    {
      questionNumber: 7,
      id: "BECE_2013_P1_Q07",
      questionText: "Find the highest common factor (HCF) of $24, 42,$ and $72$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $4$",
        "B. $6$",
        "C. $7$",
        "D. $12$"
      ],
      correctAnswer: "B",
      workedSolution: "Express each number in prime factor decomposition:\n\n$$24 = 2^3 \\times 3$$\n$$42 = 2 \\times 3 \\times 7$$\n$$72 = 2^3 \\times 3^2$$\n\nTake the lowest power of common prime factors:\n$$\\text{HCF} = 2^1 \\times 3^1 = 6$$\n\nTherefore, option B is correct.",
      topic: "Number Theory and HCF"
    },
    {
      questionNumber: 8,
      id: "BECE_2013_P1_Q08",
      questionText: "In the diagram below, line $MN$ and line $PQ$ intersect at point $O$. Angle $MOP = (2x + 10)^\\circ$ and angle $NOQ = 70^\\circ$.",
      hasDiagram: true,
      svgDiagram: "<svg width=\"320\" height=\"200\" viewBox=\"0 0 320 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc;border-radius:12px;padding:6px;\"><line x1=\"30\" y1=\"160\" x2=\"290\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"30\" y1=\"40\" x2=\"290\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2\"/><circle cx=\"160\" cy=\"100\" r=\"3\" fill=\"#0f172a\"/><text x=\"20\" y=\"175\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">M</text><text x=\"295\" y=\"35\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">N</text><text x=\"20\" y=\"35\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">P</text><text x=\"295\" y=\"175\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">Q</text><text x=\"165\" y=\"115\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">O</text><text x=\"80\" y=\"105\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0284c7\">(2x+10)°</text><text x=\"220\" y=\"105\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#dc2626\">70°</text></svg>",
      options: [
        "A. $25$",
        "B. $30$",
        "C. $35$",
        "D. $40$"
      ],
      correctAnswer: "B",
      workedSolution: "Vertically opposite angles are equal:\n\n$$\\angle MOP = \\angle NOQ$$\n$$2x + 10 = 70$$\n$$2x = 70 - 10 = 60$$\n$$x = \\frac{60}{2} = 30$$\n\nTherefore, option B is correct.",
      topic: "Plane Geometry and Angles"
    },
    {
      questionNumber: 9,
      id: "BECE_2013_P1_Q09",
      questionText: "Simplify: $4^2 \\times 2^3$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $2^5$",
        "B. $2^6$",
        "C. $2^7$",
        "D. $2^8$"
      ],
      correctAnswer: "C",
      workedSolution: "Convert $4$ to base $2$:\n$$4 = 2^2 \\implies 4^2 = (2^2)^2 = 2^{2 \\times 2} = 2^4$$\n\nNow multiply powers of the same base:\n$$4^2 \\times 2^3 = 2^4 \\times 2^3 = 2^{4+3} = 2^7$$\n\nTherefore, option C is correct.",
      topic: "Indices and Exponents"
    },
    {
      questionNumber: 10,
      id: "BECE_2013_P1_Q10",
      questionText: "If $P = \\frac{1}{2}bh$, find $b$ when $P = 42$ and $h = 7$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $6$",
        "B. $12$",
        "C. $14$",
        "D. $21$"
      ],
      correctAnswer: "B",
      workedSolution: "Substitute given values into the formula:\n\n$$42 = \\frac{1}{2} \\times b \\times 7$$\n$$42 = \\frac{7b}{2}$$\n$$7b = 42 \\times 2 = 84$$\n$$b = \\frac{84}{7} = 12$$\n\nTherefore, option B is correct.",
      topic: "Algebraic Formulae and Substitution"
    },
    {
      questionNumber: 11,
      id: "BECE_2013_P1_Q11",
      questionText: "Solve the inequality: $3x - 4 \\ge 5x + 8$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $x \\le -6$",
        "B. $x \\ge -6$",
        "C. $x \\le 6$",
        "D. $x \\ge 6$"
      ],
      correctAnswer: "A",
      workedSolution: "Collect variable terms on one side:\n\n$$3x - 4 \\ge 5x + 8$$\n$$3x - 5x \\ge 8 + 4$$\n$$-2x \\ge 12$$\n\nDivide both sides by $-2$ and reverse the inequality sign:\n$$x \\le \\frac{12}{-2}$$\n$$x \\le -6$$\n\nTherefore, option A is correct.",
      topic: "Linear Inequalities"
    },
    {
      questionNumber: 12,
      id: "BECE_2013_P1_Q12",
      questionText: "The price of a radio was reduced from $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 80.00$ to $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 68.00$. Find the percentage discount.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $12\\%$",
        "B. $15\\%$",
        "C. $17.6\\%$",
        "D. $20\\%$"
      ],
      correctAnswer: "B",
      workedSolution: "Calculate discount amount and divide by original cost:\n\n$$\\text{Discount} = 80 - 68 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12.00$$\n$$\\text{Percentage Discount} = \\left(\\frac{12}{80}\\right) \\times 100\\% = \\frac{3}{20} \\times 100\\% = 15\\%$$\n\nTherefore, option B is correct.",
      topic: "Commercial Mathematics"
    },
    {
      questionNumber: 13,
      id: "BECE_2013_P1_Q13",
      questionText: "Factorize completely: $3ax - 6ay + bx - 2by$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $(x - 2y)(3a + b)$",
        "B. $(x + 2y)(3a - b)$",
        "C. $(x - 2y)(3a - b)$",
        "D. $(x + 2y)(3a + b)$"
      ],
      correctAnswer: "A",
      workedSolution: "Factor by grouping terms:\n\n$$3ax - 6ay + bx - 2by = 3a(x - 2y) + b(x - 2y)$$\nFactor out the common binomial $(x - 2y)$:\n$$= (x - 2y)(3a + b)$$\n\nTherefore, option A is correct.",
      topic: "Algebraic Factorization"
    },
    {
      questionNumber: 14,
      id: "BECE_2013_P1_Q14",
      questionText: "In the diagram below, triangle $PQR$ is isosceles with $|PQ| = |PR|$. Angle $P = 50^\\circ$. Line $QR$ is extended to point $S$.",
      hasDiagram: true,
      svgDiagram: "<svg width=\"320\" height=\"200\" viewBox=\"0 0 320 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc;border-radius:12px;padding:6px;\"><polygon points=\"120,40 50,150 210,150\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"210\" y1=\"150\" x2=\"280\" y2=\"150\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"115\" y=\"30\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">P</text><text x=\"35\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">Q</text><text x=\"205\" y=\"170\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">R</text><text x=\"285\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">S</text><text x=\"110\" y=\"65\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0284c7\">50°</text><path d=\"M 210 150 L 225 150 A 20 20 0 0 0 217 135 Z\" fill=\"#dc2626\" fill-opacity=\"0.3\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><text x=\"225\" y=\"140\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#dc2626\">b</text></svg>",
      options: [
        "A. $65^\\circ$",
        "B. $80^\\circ$",
        "C. $100^\\circ$",
        "D. $115^\\circ$"
      ],
      correctAnswer: "D",
      workedSolution: "Since $|PQ| = |PR|$, the base angles are equal:\n$$\\angle PQR = \\angle PRQ$$\n$$\\angle PQR + \\angle PRQ + 50^\\circ = 180^\\circ$$\n$$2\\angle PRQ = 180^\\circ - 50^\\circ = 130^\\circ \\implies \\angle PRQ = 65^\\circ$$\n\nExterior angle $b$ forms a linear pair with $\\angle PRQ$:\n$$b = 180^\\circ - 65^\\circ = 115^\\circ$$\n(Alternatively: Exterior angle equals sum of opposite interior angles: $50^\\circ + 65^\\circ = 115^\\circ$).\n\nTherefore, option D is correct.",
      topic: "Plane Geometry and Triangles"
    },
    {
      questionNumber: 15,
      id: "BECE_2013_P1_Q15",
      questionText: "If $S = \\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\\}$, find the probability that a number chosen at random from $S$ is an odd number.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $\\frac{1}{10}$",
        "B. $\\frac{2}{5}$",
        "C. $\\frac{1}{2}$",
        "D. $\\frac{3}{5}$"
      ],
      correctAnswer: "C",
      workedSolution: "Sample space: $S = \\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10\\} \\implies n(S) = 10$.\nOdd numbers: $E = \\{1, 3, 5, 7, 9\\} \\implies n(E) = 5$.\n\n$$P(E) = \\frac{n(E)}{n(S)} = \\frac{5}{10} = \\frac{1}{2}$$\n\nTherefore, option C is correct.",
      topic: "Probability"
    },
    {
      questionNumber: 16,
      id: "BECE_2013_P1_Q16",
      questionText: "Find the circumference of a circular track of radius $7\\text{ m}$. [Take $\\pi = \\frac{22}{7}$]",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $22\\text{ m}$",
        "B. $44\\text{ m}$",
        "C. $88\\text{ m}$",
        "D. $154\\text{ m}$"
      ],
      correctAnswer: "B",
      workedSolution: "Apply the circumference formula $C = 2\\pi r$:\n\n$$C = 2 \\times \\frac{22}{7} \\times 7 = 44\\text{ m}$$\n\nTherefore, option B is correct.",
      topic: "Mensuration and Circles"
    },
    {
      questionNumber: 17,
      id: "BECE_2013_P1_Q17",
      questionText: "If $\\mathbf{a} = \\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$ and $\\mathbf{b} = \\begin{pmatrix} -1 \\\\ 4 \\end{pmatrix}$, find $2\\mathbf{a} - \\mathbf{b}$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $\\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix}$",
        "B. $\\begin{pmatrix} 5 \\\\ 2 \\end{pmatrix}$",
        "C. $\\begin{pmatrix} 5 \\\\ 10 \\end{pmatrix}$",
        "D. $\\begin{pmatrix} 3 \\\\ 10 \\end{pmatrix}$"
      ],
      correctAnswer: "B",
      workedSolution: "Multiply scalar and subtract vector components:\n\n$$2\\mathbf{a} = 2\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 6 \\end{pmatrix}$$\n$$2\\mathbf{a} - \\mathbf{b} = \\begin{pmatrix} 4 \\\\ 6 \\end{pmatrix} - \\begin{pmatrix} -1 \\\\ 4 \\end{pmatrix} = \\begin{pmatrix} 4 - (-1) \\\\ 6 - 4 \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 2 \\end{pmatrix}$$\n\nTherefore, option B is correct.",
      topic: "Vectors"
    },
    {
      questionNumber: 18,
      id: "BECE_2013_P1_Q18",
      questionText: "A map is drawn to a scale of $1 : 20,000$. What is the actual distance, in kilometres, represented by $5\\text{ cm}$ on the map?",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $0.1\\text{ km}$",
        "B. $1.0\\text{ km}$",
        "C. $10.0\\text{ km}$",
        "D. $100.0\\text{ km}$"
      ],
      correctAnswer: "B",
      workedSolution: "Multiply length on map by scale ratio:\n\n$$\\text{Actual distance} = 5\\text{ cm} \\times 20,000 = 100,000\\text{ cm}$$\n\nConvert centimetres to kilometres ($100,000\\text{ cm} = 1\\text{ km}$):\n$$\\text{Distance in km} = \\frac{100,000}{100,000} = 1.0\\text{ km}$$\n\nTherefore, option B is correct.",
      topic: "Ratio, Scale Drawing and Proportion"
    },
    {
      questionNumber: 19,
      id: "BECE_2013_P1_Q19",
      questionText: "Simplify: $\\frac{2}{3} + \\frac{1}{4} - \\frac{1}{2}$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $\\frac{5}{12}$",
        "B. $\\frac{7}{12}$",
        "C. $\\frac{3}{4}$",
        "D. $\\frac{11}{12}$"
      ],
      correctAnswer: "A",
      workedSolution: "Find the LCM of the denominators $3, 4,$ and $2$, which is $12$:\n\n$$\\frac{2}{3} = \\frac{8}{12}, \\quad \\frac{1}{4} = \\frac{3}{12}, \\quad \\frac{1}{2} = \\frac{6}{12}$$\n$$\\frac{8 + 3 - 6}{12} = \\frac{5}{12}$$\n\nTherefore, option A is correct.",
      topic: "Operations on Fractions"
    },
    {
      questionNumber: 20,
      id: "BECE_2013_P1_Q20",
      questionText: "Find the simple interest on $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 450.00$ for $2$ years at $10\\%$ per annum.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 45.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 90.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 180.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 540.00$"
      ],
      correctAnswer: "B",
      workedSolution: "Apply the simple interest formula $I = \\frac{P \\times R \\times T}{100}$:\n\n$$I = \\frac{450 \\times 10 \\times 2}{100} = 45 \\times 2 = 90$$\n$$\\text{Simple Interest} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 90.00$$\n\nTherefore, option B is correct.",
      topic: "Simple Interest and Commercial Arithmetic"
    },
    {
      questionNumber: 21,
      id: "BECE_2013_P1_Q21",
      questionText: "The diagram below shows the right-angled triangle $XYZ$. Find the length of $XZ$.",
      hasDiagram: true,
      svgDiagram: "<svg width=\"280\" height=\"180\" viewBox=\"0 0 280 180\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc;border-radius:12px;padding:6px;\"><polygon points=\"60,140 220,140 60,30\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><polyline points=\"60,125 75,125 75,140\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"45\" y=\"150\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">Y</text><text x=\"230\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">Z</text><text x=\"45\" y=\"25\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">X</text><text x=\"20\" y=\"90\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">5 cm</text><text x=\"130\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">12 cm</text><text x=\"150\" y=\"80\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#dc2626\">XZ</text></svg>",
      options: [
        "A. $13\\text{ cm}$",
        "B. $15\\text{ cm}$",
        "C. $17\\text{ cm}$",
        "D. $25\\text{ cm}$"
      ],
      correctAnswer: "A",
      workedSolution: "Apply the Pythagorean theorem:\n\n$$XZ^2 = XY^2 + YZ^2 = 5^2 + 12^2 = 25 + 144 = 169$$\n$$XZ = \\sqrt{169} = 13\\text{ cm}$$\n\nTherefore, option A is correct.",
      topic: "Pythagoras' Theorem"
    },
    {
      questionNumber: 22,
      id: "BECE_2013_P1_Q22",
      questionText: "If $x = -2$ and $y = 3$, evaluate $2x^2 - 3y$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $-17$",
        "B. $-1$",
        "C. $1$",
        "D. $7$"
      ],
      correctAnswer: "B",
      workedSolution: "Substitute $x = -2$ and $y = 3$ into the algebraic expression:\n\n$$2x^2 - 3y = 2(-2)^2 - 3(3) = 2(4) - 9 = 8 - 9 = -1$$\n\nTherefore, option B is correct.",
      topic: "Algebraic Substitution"
    },
    {
      questionNumber: 23,
      id: "BECE_2013_P1_Q23",
      questionText: "Calculate the mean of the numbers: $4, 7, 8, 11, 15$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $7$",
        "B. $8$",
        "C. $9$",
        "D. $11$"
      ],
      correctAnswer: "C",
      workedSolution: "Sum the elements and divide by total frequency:\n\n$$\\text{Mean} = \\frac{\\sum x}{n} = \\frac{4 + 7 + 8 + 11 + 15}{5} = \\frac{45}{5} = 9$$\n\nTherefore, option C is correct.",
      topic: "Statistics and Averages"
    },
    {
      questionNumber: 24,
      id: "BECE_2013_P1_Q24",
      questionText: "Find the image of the point $(2, -3)$ under a reflection in the $y$-axis.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $(-2, -3)$",
        "B. $(-2, 3)$",
        "C. $(2, 3)$",
        "D. $(3, -2)$"
      ],
      correctAnswer: "A",
      workedSolution: "Under a reflection in the $y$-axis, the coordinate mapping is:\n$$(x, y) \\to (-x, y)$$\n\nApplying to $(2, -3)$:\n$$(2, -3) \\to (-2, -3)$$\n\nTherefore, option A is correct.",
      topic: "Transformational Geometry"
    },
    {
      questionNumber: 25,
      id: "BECE_2013_P1_Q25",
      questionText: "How many lines of symmetry does an equilateral triangle have?",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $1$",
        "B. $2$",
        "C. $3$",
        "D. $4$"
      ],
      correctAnswer: "C",
      workedSolution: "An equilateral triangle has all three sides and interior angles equal. It possesses $3$ lines of symmetry passing from each vertex through the midpoint of the opposite side.\n\nTherefore, option C is correct.",
      topic: "Geometric Properties and Symmetry"
    },
    {
      questionNumber: 26,
      id: "BECE_2013_P1_Q26",
      questionText: "Solve for $y$ in the equation: $\\frac{2y - 1}{3} = \\frac{y + 4}{2}$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $10$",
        "B. $12$",
        "C. $14$",
        "D. $16$"
      ],
      correctAnswer: "C",
      workedSolution: "Cross-multiply:\n\n$$2(2y - 1) = 3(y + 4)$$\n$$4y - 2 = 3y + 12$$\n$$4y - 3y = 12 + 2 \\implies y = 14$$\n\nTherefore, option C is correct.",
      topic: "Linear Equations"
    },
    {
      questionNumber: 27,
      id: "BECE_2013_P1_Q27",
      questionText: "Which of the following mathematical inequalities is illustrated on the number line below?",
      hasDiagram: true,
      svgDiagram: "<svg width=\"360\" height=\"80\" viewBox=\"0 0 360 80\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc;border-radius:12px;padding:6px;\"><line x1=\"20\" y1=\"40\" x2=\"340\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"35\" x2=\"60\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"35\" x2=\"120\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"35\" x2=\"180\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"35\" x2=\"240\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"300\" y1=\"35\" x2=\"300\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"55\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">-2</text><text x=\"115\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">-1</text><text x=\"177\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">0</text><text x=\"237\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">1</text><text x=\"297\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">2</text><circle cx=\"120\" cy=\"25\" r=\"5\" fill=\"#0284c7\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"25\" x2=\"330\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"3\"/><polygon points=\"330,20 340,25 330,30\" fill=\"#0284c7\"/></svg>",
      options: [
        "A. $x < -1$",
        "B. $x \\le -1$",
        "C. $x > -1$",
        "D. $x \\ge -1$"
      ],
      correctAnswer: "D",
      workedSolution: "The circle is filled (solid) at $-1$, indicating inclusion ($\\ge$ or $\\le$). The ray extends to the right (positive direction), representing all values greater than or equal to $-1$:\n\n$$x \\ge -1$$\n\nTherefore, option D is correct.",
      topic: "Linear Inequalities and Number Lines"
    },
    {
      questionNumber: 28,
      id: "BECE_2013_P1_Q28",
      questionText: "If $180$ oranges were shared between Kwame and Ama in the ratio $7 : 5$ respectively, how many oranges did Ama receive?",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $45$",
        "B. $75$",
        "C. $105$",
        "D. $125$"
      ],
      correctAnswer: "B",
      workedSolution: "Sum of ratio parts $= 7 + 5 = 12$.\nAma's ratio share $= 5$.\n\n$$\\text{Ama's share} = \\frac{5}{12} \\times 180 = 5 \\times 15 = 75$$\n\nTherefore, option B is correct.",
      topic: "Ratio and Proportion"
    },
    {
      questionNumber: 29,
      id: "BECE_2013_P1_Q29",
      questionText: "Find the gradient (slope) of the line passing through the points $A(-1, 2)$ and $B(3, 10)$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $\\frac{1}{2}$",
        "B. $1$",
        "C. $2$",
        "D. $4$"
      ],
      correctAnswer: "C",
      workedSolution: "Apply the gradient formula:\n\n$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{10 - 2}{3 - (-1)} = \\frac{8}{3 + 1} = \\frac{8}{4} = 2$$\n\nTherefore, option C is correct.",
      topic: "Coordinate Geometry"
    },
    {
      questionNumber: 30,
      id: "BECE_2013_P1_Q30",
      questionText: "Calculate the volume of a rectangular prism of length $8\\text{ cm}$, width $5\\text{ cm}$, and height $4\\text{ cm}$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $40\\text{ cm}^3$",
        "B. $92\\text{ cm}^3$",
        "C. $160\\text{ cm}^3$",
        "D. $320\\text{ cm}^3$"
      ],
      correctAnswer: "C",
      workedSolution: "Apply the volume formula for a cuboid:\n\n$$V = l \\times w \\times h = 8 \\times 5 \\times 4 = 160\\text{ cm}^3$$\n\nTherefore, option C is correct.",
      topic: "Mensuration and Solid Geometry"
    },
    {
      questionNumber: 31,
      id: "BECE_2013_P1_Q31",
      questionText: "Express $0.0042$ in standard form.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $4.2 \\times 10^{-4}$",
        "B. $4.2 \\times 10^{-3}$",
        "C. $4.2 \\times 10^3$",
        "D. $4.2 \\times 10^4$"
      ],
      correctAnswer: "B",
      workedSolution: "Shift decimal point $3$ places to the right to place it after the first non-zero digit:\n\n$$0.0042 = 4.2 \\times 10^{-3}$$\n\nTherefore, option B is correct.",
      topic: "Standard Form"
    },
    {
      questionNumber: 32,
      id: "BECE_2013_P1_Q32",
      questionText: "The bearing of point $X$ from point $Y$ is $120^\\circ$. What is the bearing of point $Y$ from point $X$?",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $060^\\circ$",
        "B. $240^\\circ$",
        "C. $300^\\circ$",
        "D. $330^\\circ$"
      ],
      correctAnswer: "C",
      workedSolution: "Since the forward bearing $\\theta = 120^\\circ < 180^\\circ$, add $180^\\circ$ to find the back bearing:\n\n$$\\text{Back bearing} = 120^\\circ + 180^\\circ = 300^\\circ$$\n\nTherefore, option C is correct.",
      topic: "Bearings and Navigation"
    },
    {
      questionNumber: 33,
      id: "BECE_2013_P1_Q33",
      questionText: "The table below shows the distribution of scores in a test:\n\n| Score | 1 | 2 | 3 | 4 | 5 |\n| :--- | :---: | :---: | :---: | :---: | :---: |\n| Frequency | 2 | 5 | 9 | 3 | 1 |\n\nFind the modal score.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $2$",
        "B. $3$",
        "C. $5$",
        "D. $9$"
      ],
      correctAnswer: "B",
      workedSolution: "The mode is the value with the highest frequency.\n\nScore 3 has the highest frequency ($9$).\n$$\\text{Modal score} = 3$$\n\nTherefore, option B is correct.",
      topic: "Statistics and Frequency Tables"
    },
    {
      questionNumber: 34,
      id: "BECE_2013_P1_Q34",
      questionText: "Expand and simplify: $(3x - 2)(x + 5)$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $3x^2 - 10$",
        "B. $3x^2 + 13x - 10$",
        "C. $3x^2 - 13x - 10$",
        "D. $3x^2 + 17x - 10$"
      ],
      correctAnswer: "B",
      workedSolution: "Expand by binomial expansion:\n\n$$(3x - 2)(x + 5) = 3x(x + 5) - 2(x + 5)$$\n$$= 3x^2 + 15x - 2x - 10 = 3x^2 + 13x - 10$$\n\nTherefore, option B is correct.",
      topic: "Algebraic Expansion"
    },
    {
      questionNumber: 35,
      id: "BECE_2013_P1_Q35",
      questionText: "In the diagram below, lines $AB$ and $CD$ are parallel ($AB \\parallel CD$), intersected by transversal line $EF$. Angle $BPQ = 125^\\circ$.",
      hasDiagram: true,
      svgDiagram: "<svg width=\"360\" height=\"180\" viewBox=\"0 0 360 180\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#f8fafc;border-radius:12px;padding:6px;\"><line x1=\"30\" y1=\"50\" x2=\"330\" y2=\"50\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"30\" y1=\"130\" x2=\"330\" y2=\"130\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"80\" y1=\"160\" x2=\"260\" y2=\"20\" stroke=\"#dc2626\" stroke-width=\"2\"/><text x=\"35\" y=\"42\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">A</text><text x=\"315\" y=\"42\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">B</text><text x=\"35\" y=\"122\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">C</text><text x=\"315\" y=\"122\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">D</text><text x=\"215\" y=\"45\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">125°</text><text x=\"130\" y=\"125\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#dc2626\">y</text></svg>",
      options: [
        "A. $55^\\circ$",
        "B. $65^\\circ$",
        "C. $125^\\circ$",
        "D. $145^\\circ$"
      ],
      correctAnswer: "A",
      workedSolution: "Consecutive (co-interior) angles between parallel lines sum to $180^\\circ$:\n\n$$125^\\circ + y = 180^\\circ$$\n$$y = 180^\\circ - 125^\\circ = 55^\\circ$$\n\nTherefore, option A is correct.",
      topic: "Plane Geometry and Parallel Lines"
    },
    {
      questionNumber: 36,
      id: "BECE_2013_P1_Q36",
      questionText: "Find the truth set of $2(x - 1) < 8$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $\\{x : x < 3\\}$",
        "B. $\\{x : x < 4\\}$",
        "C. $\\{x : x < 5\\}$",
        "D. $\\{x : x < 6\\}$"
      ],
      correctAnswer: "C",
      workedSolution: "Expand and solve the inequality:\n\n$$2x - 2 < 8$$\n$$2x < 8 + 2$$\n$$2x < 10 \\implies x < 5$$\n$$\\text{Truth set} = \\{x : x < 5\\}$$\n\nTherefore, option C is correct.",
      topic: "Linear Inequalities"
    },
    {
      questionNumber: 37,
      id: "BECE_2013_P1_Q37",
      questionText: "If $6$ workers can weed a school compound in $4$ days, how many days will $8$ workers take to weed the same compound working at the same rate?",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $2\\text{ days}$",
        "B. $3\\text{ days}$",
        "C. $4\\text{ days}$",
        "D. $5\\text{ days}$"
      ],
      correctAnswer: "B",
      workedSolution: "This is an inverse proportion problem:\n\n$$\\text{Total man-days} = 6 \\times 4 = 24\\text{ man-days}$$\n$$\\text{Days required by 8 workers} = \\frac{24}{8} = 3\\text{ days}$$\n\nTherefore, option B is correct.",
      topic: "Inverse Proportion"
    },
    {
      questionNumber: 38,
      id: "BECE_2013_P1_Q38",
      questionText: "A sector of a circle of radius $6\\text{ cm}$ subtends an angle of $70^\\circ$ at the centre. Calculate the area of the sector. [Take $\\pi = \\frac{22}{7}$]",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $11\\text{ cm}^2$",
        "B. $22\\text{ cm}^2$",
        "C. $44\\text{ cm}^2$",
        "D. $66\\text{ cm}^2$"
      ],
      correctAnswer: "B",
      workedSolution: "Apply the area of sector formula $A = \\frac{\\theta}{360^\\circ} \\times \\pi r^2$:\n\n$$A = \\frac{70^\\circ}{360^\\circ} \\times \\frac{22}{7} \\times 6^2$$\n$$= \\frac{10}{360} \\times 22 \\times 36 = \\frac{1}{36} \\times 22 \\times 36 = 22\\text{ cm}^2$$\n\nTherefore, option B is correct.",
      topic: "Mensuration and Circles"
    },
    {
      questionNumber: 39,
      id: "BECE_2013_P1_Q39",
      questionText: "Find the value of $k$ if $2^k = 64$.",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $4$",
        "B. $5$",
        "C. $6$",
        "D. $8$"
      ],
      correctAnswer: "C",
      workedSolution: "Express $64$ as a power of base $2$:\n\n$$64 = 2^6$$\n$$2^k = 2^6 \\implies k = 6$$\n\nTherefore, option C is correct.",
      topic: "Indices and Exponents"
    },
    {
      questionNumber: 40,
      id: "BECE_2013_P1_Q40",
      questionText: "A car travels at an average speed of $80\\text{ km/h}$. What distance does it cover in $2\\frac{1}{4}$ hours?",
      hasDiagram: false,
      svgDiagram: null,
      options: [
        "A. $160\\text{ km}$",
        "B. $180\\text{ km}$",
        "C. $200\\text{ km}$",
        "D. $240\\text{ km}$"
      ],
      correctAnswer: "B",
      workedSolution: "Convert mixed time to improper fraction and multiply by speed:\n\n$$\\text{Time} = 2\\frac{1}{4}\\text{ h} = \\frac{9}{4}\\text{ h}$$\n$$\\text{Distance} = \\text{Speed} \\times \\text{Time} = 80 \\times \\frac{9}{4} = 20 \\times 9 = 180\\text{ km}$$\n\nTherefore, option B is correct.",
      topic: "Speed, Distance and Time"
    }
  ]
};

export const SET_BECE_2013_MATH_P1: CurriculumQuestionSet = {
  id: "jhs-math-2013-paper1",
  title: "BECE Mathematics Past Paper 1 (2013 Official Examination)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2013 Paper 1",
  variantType: "past_paper_variant",
  format: "multiple_choice",
  totalQuestions: 40,
  year: 2013,
  paperType: 1,
  setNumber: 90,
  era: "legacy",
  version: 1,
  timeAllowed: "1 hour",
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2013/paper_1",
  questions: BECE_2013_MATH_P1_DATA.questions.map((q) => {
    const cleanOptions = q.options.map(opt => opt.replace(/^[A-D]\\.\\s*/, '').trim());
    const letterIdx = q.correctAnswer.charCodeAt(0) - 65;
    const correctCleanAnswer = cleanOptions[letterIdx] || cleanOptions[0];

    return {
      id: q.id,
      number: q.questionNumber,
      questionNumber: q.questionNumber,
      prompt: q.questionText,
      questionText: q.questionText,
      options: cleanOptions,
      optionsWithLetters: q.options,
      correctAnswer: correctCleanAnswer,
      correctOptionLetter: q.correctAnswer,
      correctOption: q.correctAnswer,
      hasDiagram: q.hasDiagram,
      diagramSvg: q.svgDiagram || undefined,
      svgDiagram: q.svgDiagram || undefined,
      workedSolution: q.workedSolution,
      hint: `Recall concepts of ${q.topic}. ${q.workedSolution.split('\n')[0] || ''}`,
      topic: q.topic,
      category: q.topic,
      points: 1,
      format: 'multiple_choice',
      type: 'multiple_choice',
      section: 'objective'
    };
  })
};

export const SET_BECE_2013_MATH_P1_ALIAS: CurriculumQuestionSet = {
  ...SET_BECE_2013_MATH_P1,
  id: "bece_2013_math_p1"
};


export const BECE_2013_MATH_P2_DATA = {
  "examMetadata": {
    "examYear": 2013,
    "examination": "BECE (Basic Education Certificate Examination)",
    "subject": "Mathematics",
    "paper": "Paper 2 (Theory / Essay)",
    "totalQuestions": 6,
    "instructions": "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
    "timeAllowed": "1 hour",
    "curriculumAlignment": "NaCCA JHS Common Core Programme / WAEC Standards",
    "firestoreCollectionPath": "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2013/paper_2"
  },
  "questions": [
    {
      "questionNumber": 1,
      "id": "BECE_2013_P2_Q01",
      "marks": 15,
      "topic": "Sets, Probability, Factorization, and Commercial Arithmetic",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Given that $K = \\{1, 2, 3, \\dots, 15\\}$:\n(i) List the prime numbers in $K$;\n(ii) Find the probability that a number selected at random from the set $K$ is not a prime number.",
          "workedSolution": "**(i) Listing the prime numbers in $K$:**\nThe universal set is $K = \\{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15\\}$, so $n(K) = 15$.\nA prime number is a natural number greater than $1$ that has exactly two distinct factors ($1$ and itself).\n$$\\text{Prime numbers in } K = \\{2, 3, 5, 7, 11, 13\\}$$\n\n---\n\n**(ii) Finding the probability that a selected number is not a prime number:**\nLet $P$ be the set of prime numbers $\\implies n(P) = 6$.\nNumbers that are not prime ($P'$):\n$$P' = \\{1, 4, 6, 8, 9, 10, 12, 14, 15\\}$$\n$$n(P') = 15 - 6 = 9$$\n\n$$\\text{P}(\\text{not prime}) = \\frac{n(P')}{n(K)} = \\frac{9}{15} = \\frac{3}{5} = 0.6$$\n\nTherefore, the probability that the number is not a prime number is $\\mathbf{\\frac{3}{5}}$."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Factorize completely: $(a + b)(3x - y) - k(a + b)$.",
          "workedSolution": "Given expression:\n$$(a + b)(3x - y) - k(a + b)$$\n\nNotice that the binomial factor $(a + b)$ is common to both terms:\n$$= (a + b)\\big[(3x - y) - k\\big]$$\n$$= (a + b)(3x - y - k)$$\n\nTherefore, the completely factorized form is $\\mathbf{(a + b)(3x - y - k)}$."
        },
        {
          "part": "c",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "A typist charges $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 75.00$ for the first $10$ sheets typed, and $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12.00$ for each additional sheet. Calculate the amount earned if the typist typed a total of $42$ sheets.",
          "workedSolution": "**Step 1: Determine the breakdown of sheets:**\n$$\\text{Total sheets typed} = 42$$\n$$\\text{First tier sheets} = 10$$\n$$\\text{Additional sheets} = 42 - 10 = 32$$\n\n**Step 2: Calculate the cost for each tier:**\n$$\\text{Cost of first 10 sheets} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 75.00$$\n$$\\text{Cost of additional 32 sheets} = 32 \\times \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 384.00$$\n\n**Step 3: Calculate the total earnings:**\n$$\\text{Total amount earned} = 75.00 + 384.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 459.00$$\n\nTherefore, the typist earned $\\mathbf{\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 459.00}$."
        }
      ]
    },
    {
      "questionNumber": 2,
      "id": "BECE_2013_P2_Q02",
      "marks": 15,
      "topic": "Vector Translation and Business Partnership Sharing",
      "subQuestions": [
        {
          "part": "a",
          "marks": 7,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "The image of $P(3, 4)$ when translated by the vector $\\mathbf{r}$ is $P'(-2, 9)$. Find:\n(i) the translation vector $\\mathbf{r}$;\n(ii) the image $Q'$ of $Q(-5, -3)$ when translated by $\\mathbf{r}$.",
          "workedSolution": "**(i) Finding the translation vector $\\mathbf{r}$:**\nBy vector translation transformation:\n$$\\mathbf{r} + \\vec{OP} = \\vec{OP'}$$\n$$\\mathbf{r} = \\vec{OP'} - \\vec{OP}$$\n\nWriting points as position vectors:\n$$\\vec{OP} = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix}, \\quad \\vec{OP'} = \\begin{pmatrix} -2 \\\\ 9 \\end{pmatrix}$$\n$$\\mathbf{r} = \\begin{pmatrix} -2 \\\\ 9 \\end{pmatrix} - \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix} = \\begin{pmatrix} -2 - 3 \\\\ 9 - 4 \\end{pmatrix} = \\begin{pmatrix} -5 \\\\ 5 \\end{pmatrix}$$\n\nTherefore, the translation vector $\\mathbf{r} = \\mathbf{\\begin{pmatrix} -5 \\\\ 5 \\end{pmatrix}}$.\n\n---\n\n**(ii) Finding the image $Q'$ of $Q(-5, -3)$:**\n$$\\vec{OQ'} = \\vec{OQ} + \\mathbf{r}$$\n$$\\vec{OQ'} = \\begin{pmatrix} -5 \\\\ -3 \\end{pmatrix} + \\begin{pmatrix} -5 \\\\ 5 \\end{pmatrix} = \\begin{pmatrix} -5 + (-5) \\\\ -3 + 5 \\end{pmatrix} = \\begin{pmatrix} -10 \\\\ 2 \\end{pmatrix}$$\n\nTherefore, the coordinates of the image are $\\mathbf{Q'(-10, 2)}$."
        },
        {
          "part": "b",
          "marks": 8,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Kofi and Kwesi contributed $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12,000.00$ and $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 8,000.00$ respectively to start a commercial venture. They agreed that Kwesi will be paid one-quarter ($\\frac{1}{4}$) of the profit as a managing partner and the rest of the profit will be shared in the ratio of their capital contributions. If a total profit of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 16,000.00$ was made, how much did:\n(i) Kofi receive;\n(ii) Kwesi receive in total?",
          "workedSolution": "**Step 1: Calculate Kwesi's management allowance:**\n$$\\text{Total profit} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 16,000.00$$\n$$\\text{Kwesi's manager pay} = \\frac{1}{4} \\times 16,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,000.00$$\n\n**Step 2: Calculate the remaining profit to be shared:**\n$$\\text{Remaining profit} = 16,000.00 - 4,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12,000.00$$\n\n**Step 3: Determine the ratio of capital contributions:**\n$$\\text{Ratio} = \\text{Kofi} : \\text{Kwesi} = 12,000 : 8,000 = 12 : 8 = 3 : 2$$\n$$\\text{Sum of ratio parts} = 3 + 2 = 5$$\n\n---\n\n**(i) Amount Kofi received:**\n$$\\text{Kofi's share} = \\frac{3}{5} \\times 12,000.00 = 3 \\times 2,400.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 7,200.00$$\n\nTherefore, **Kofi received $\\mathbf{\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 7,200.00}$**.\n\n---\n\n**(ii) Total amount Kwesi received:**\n$$\\text{Kwesi's profit share} = \\frac{2}{5} \\times 12,000.00 = 2 \\times 2,400.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,800.00$$\n$$\\text{Total received by Kwesi} = \\text{Manager's pay} + \\text{Profit share}$$\n$$= 4,000.00 + 4,800.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 8,800.00$$\n\n*(Check: $7,200.00 + 8,800.00 = 16,000.00$)*.\n\nTherefore, **Kwesi received a total of $\\mathbf{\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 8,800.00}$**."
        }
      ]
    },
    {
      "questionNumber": 3,
      "id": "BECE_2013_P2_Q03",
      "marks": 15,
      "topic": "Wages, Compound L-Shaped Floor Geometry, and Area Mensuration",
      "subQuestions": [
        {
          "part": "a",
          "marks": 6,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Fuseina was engaged to harvest cocoa pods on a plantation and was paid a wage of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 35.00$ a day. If the daily wage increased by $20\\%$ and she worked for $25$ days, how much will she be paid?",
          "workedSolution": "**Step 1: Calculate the wage increase per day:**\n$$\\text{Increase} = 20\\% \\times 35.00 = \\frac{20}{100} \\times 35 = \\frac{1}{5} \\times 35 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 7.00$$\n\n**Step 2: Calculate the new daily wage:**\n$$\\text{New daily wage} = 35.00 + 7.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 42.00$$\n*(Alternatively: $120\\% \\times 35 = 1.2 \\times 35 = 42.00$)*.\n\n**Step 3: Calculate the total payment for 25 days:**\n$$\\text{Total payment} = 25 \\times 42.00 = 25 \\times (40 + 2) = 1,000 + 50 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,050.00$$\n\nTherefore, Fuseina will be paid $\\mathbf{\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,050.00}$."
        },
        {
          "part": "b",
          "marks": 9,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"440\" height=\"240\" viewBox=\"0 0 440 240\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"440\" height=\"240\" fill=\"#ffffff\" rx=\"12\"/><path d=\"M 60 40 L 380 40 L 380 120 L 220 120 L 220 200 L 60 200 Z\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><text x=\"210\" y=\"30\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">10 m</text><text x=\"25\" y=\"125\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">6 m</text><text x=\"390\" y=\"85\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">4 m</text><text x=\"290\" y=\"112\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">6 m</text><text x=\"130\" y=\"220\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">4 m</text><text x=\"230\" y=\"165\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">2 m</text><text x=\"150\" y=\"160\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
          "questionText": "The diagram above shows the floor of a room with its dimensions.\nFind the:\n(i) perimeter;\n(ii) area;\n(iii) cost of carpeting the floor if a carpet costs $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 35.00$ per square metre.",
          "workedSolution": "**(i) Finding the perimeter of the floor:**\nLet us trace all exterior boundary edges clockwise starting from top-left:\n1. Top horizontal edge $= 10\\text{ m}$\n2. Right upper vertical edge $= 4\\text{ m}$\n3. Inner horizontal step $= 6\\text{ m}$\n4. Inner vertical drop $= 6 - 4 = 2\\text{ m}$\n5. Bottom horizontal edge $= 10 - 6 = 4\\text{ m}$\n6. Left complete vertical edge $= 6\\text{ m}$\n\n$$\\text{Perimeter} = 10 + 4 + 6 + 2 + 4 + 6 = 32\\text{ m}$$\n*(Check: Sum of horizontal lengths $= 10 + 6 + 4 = 20\\text{ m}$; Sum of vertical lengths $= 4 + 2 + 6 = 12\\text{ m}$; Total $= 20 + 12 = 32\\text{ m}$)*.\n\nTherefore, the **perimeter of the floor is $\\mathbf{32\\text{ m}}$**.\n\n---\n\n**(ii) Finding the area of the floor:**\nDivide the compound L-shaped polygon vertically into two rectangles, $A_1$ (left vertical block) and $A_2$ (right cantilevered block):\n- Rectangle $A_1$ (Left): Width $= 4\\text{ m}$, Height $= 6\\text{ m}$\n$$\\text{Area}(A_1) = 4\\text{ m} \\times 6\\text{ m} = 24\\text{ m}^2$$\n- Rectangle $A_2$ (Right upper): Length $= 6\\text{ m}$, Height $= 4\\text{ m}$\n$$\\text{Area}(A_2) = 6\\text{ m} \\times 4\\text{ m} = 24\\text{ m}^2$$\n\n$$\\text{Total Area} = \\text{Area}(A_1) + \\text{Area}(A_2) = 24\\text{ m}^2 + 24\\text{ m}^2 = 48\\text{ m}^2$$\n*(Alternative horizontal split: Top strip $= 10 \\times 4 = 40\\text{ m}^2$; Bottom niche $= 4 \\times 2 = 8\\text{ m}^2$; Total $= 40 + 8 = 48\\text{ m}^2$)*.\n\nTherefore, the **area of the floor is $\\mathbf{48\\text{ m}^2}$**.\n\n---\n\n**(iii) Finding the cost of carpeting:**\n$$\\text{Cost} = \\text{Total Area} \\times \\text{Unit Price}$$\n$$\\text{Cost} = 48\\text{ m}^2 \\times \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 35.00/\\text{m}^2$$\n$$48 \\times 35 = 48 \\times \\frac{70}{2} = 24 \\times 70 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,680.00$$\n\nTherefore, the **cost of carpeting the floor is $\\mathbf{\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,680.00}$**."
        }
      ]
    },
    {
      "questionNumber": 4,
      "id": "BECE_2013_P2_Q04",
      "marks": 15,
      "topic": "Income Arithmetic, Right-Angled Trigonometry and Elevation",
      "subQuestions": [
        {
          "part": "a",
          "marks": 7,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "In an institution, the monthly income of three workers Mensah, Kwarteng, and Appiah are $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,500.00$, $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,200.00$, and $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,800.00$ respectively.\n(i) Calculate the yearly income of each worker;\n(ii) Find the yearly income difference between Mensah and Appiah;\n(iii) Find the total yearly income of all three workers.",
          "workedSolution": "**(i) Calculating the yearly income of each worker (1 year = 12 months):**\n- **Mensah:**\n$$\\text{Yearly income} = 4,500.00 \\times 12 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 54,000.00$$\n- **Kwarteng:**\n$$\\text{Yearly income} = 6,200.00 \\times 12 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 74,400.00$$\n- **Appiah:**\n$$\\text{Yearly income} = 3,800.00 \\times 12 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 45,600.00$$\n\n---\n\n**(ii) Finding the yearly income difference between Mensah and Appiah:**\n$$\\text{Difference} = 54,000.00 - 45,600.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 8,400.00$$\n*(Alternatively: $(4,500 - 3,800) \\times 12 = 700 \\times 12 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 8,400.00$)*.\n\nTherefore, the difference is $\\mathbf{\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 8,400.00}$.\n\n---\n\n**(iii) Finding the total yearly income of all three workers:**\n$$\\text{Total} = 54,000.00 + 74,400.00 + 45,600.00$$\n$$= 54,000.00 + 120,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 174,000.00$$\n*(Alternatively: $(4,500 + 6,200 + 3,800) \\times 12 = 14,500 \\times 12 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 174,000.00$)*.\n\nTherefore, the total yearly income is $\\mathbf{\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 174,000.00}$."
        },
        {
          "part": "b",
          "marks": 8,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"380\" height=\"280\" viewBox=\"0 0 380 280\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"380\" height=\"280\" fill=\"#ffffff\" rx=\"12\"/><line x1=\"30\" y1=\"230\" x2=\"350\" y2=\"230\" stroke=\"#334155\" stroke-width=\"2\"/><line x1=\"280\" y1=\"50\" x2=\"280\" y2=\"230\" stroke=\"#0f172a\" stroke-width=\"3\"/><polygon points=\"280,50 330,50 330,230 280,230\" fill=\"#e2e8f0\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><rect x=\"290\" y=\"70\" width=\"25\" height=\"35\" fill=\"#38bdf8\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><line x1=\"100\" y1=\"230\" x2=\"280\" y2=\"80\" stroke=\"#b45309\" stroke-width=\"3.5\" stroke-linecap=\"round\"/><polyline points=\"265,230 265,215 280,215\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><path d=\"M 140 230 A 40 40 0 0 0 131 204\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"2\"/><text x=\"145\" y=\"218\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">60°</text><circle cx=\"100\" cy=\"230\" r=\"4\" fill=\"#0f172a\"/><circle cx=\"280\" cy=\"80\" r=\"4\" fill=\"#0f172a\"/><circle cx=\"280\" cy=\"230\" r=\"4\" fill=\"#0f172a\"/><text x=\"80\" y=\"250\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">F (Foot)</text><text x=\"285\" y=\"250\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B (Base)</text><text x=\"250\" y=\"75\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">W (Window)</text><text x=\"175\" y=\"250\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">6 m</text><text x=\"165\" y=\"140\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#b45309\">L</text><text x=\"295\" y=\"160\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0284c7\">h</text></svg>",
          "questionText": "A painter places a ladder against a building at the window. The angle the foot of the ladder makes with the horizontal ground is $60^\\circ$. If the distance from the foot of the ladder to the base of the building is $6\\text{ m}$:\n(i) illustrate the information in a diagram;\n(ii) find, correct to one decimal place, the:\n    $(\\alpha)$ length of the ladder;\n    $(\\beta)$ distance between the window and the foot of the building.\n$[\\text{Take } \\tan 60^\\circ = 1.732, \\text{ and } \\cos 60^\\circ = \\frac{1}{2}]$",
          "workedSolution": "**(i) Geometric Diagram Illustration:**\nLet $F$ be the foot of the ladder, $B$ be the base of the building, and $W$ be the position of the window.\n- Triangle $FBW$ forms a right-angled triangle at $B$ ($\\angle FBW = 90^\\circ$).\n- Distance $|FB| = 6\\text{ m}$ (adjacent side).\n- Angle of inclination at $F$: $\\angle BFW = 60^\\circ$.\n- Length of ladder: Hypotenuse $|FW| = L$.\n- Window height from base: Opposite side $|BW| = h$.\n\n*(See the embedded SVG drawing above for the exact geometric rendering)*.\n\n---\n\n**(ii) ($a$) Finding the length of the ladder ($L$):**\nUsing the cosine ratio:\n$$\\cos 60^\\circ = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}} = \\frac{|FB|}{|FW|} = \\frac{6}{L}$$\nGiven $\\cos 60^\\circ = \\frac{1}{2}$:\n$$\\frac{1}{2} = \\frac{6}{L}$$\n$$L = 6 \\times 2 = 12.0\\text{ m}$$\n\nTherefore, the length of the ladder is $\\mathbf{12.0\\text{ m}}$.\n\n---\n\n**(ii) ($\\beta$) Finding the distance between window and foot of building ($h$):**\nUsing the tangent ratio:\n$$\\tan 60^\\circ = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{h}{|FB|} = \\frac{h}{6}$$\n$$h = 6 \\times \\tan 60^\\circ$$\nGiven $\\tan 60^\\circ = 1.732$:\n$$h = 6 \\times 1.732 = 10.392\\text{ m}$$\nRounding to one decimal place:\n$$h \\approx 10.4\\text{ m}$$\n\nTherefore, the height from the foot of the building to the window is $\\mathbf{10.4\\text{ m}}$."
        }
      ]
    },
    {
      "questionNumber": 5,
      "id": "BECE_2013_P2_Q05",
      "marks": 15,
      "topic": "Radical Simplification, Linear Inequalities, and Circular Track Distance",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Simplify $\\frac{\\sqrt{98}}{\\sqrt{32} - \\sqrt{18}}$, leaving the answer in the form $a + b\\sqrt{c}$, where $a, b,$ and $c$ are integers.",
          "workedSolution": "**Step 1: Simplify each surd by factoring out the largest perfect square:**\n$$\\sqrt{98} = \\sqrt{49 \\times 2} = 7\\sqrt{2}$$\n$$\\sqrt{32} = \\sqrt{16 \\times 2} = 4\\sqrt{2}$$\n$$\\sqrt{18} = \\sqrt{9 \\times 2} = 3\\sqrt{2}$$\n\n**Step 2: Substitute into the given expression:**\n$$\\frac{\\sqrt{98}}{\\sqrt{32} - \\sqrt{18}} = \\frac{7\\sqrt{2}}{4\\sqrt{2} - 3\\sqrt{2}}$$\n\n**Step 3: Simplify the denominator:**\n$$4\\sqrt{2} - 3\\sqrt{2} = (4 - 3)\\sqrt{2} = 1\\sqrt{2} = \\sqrt{2}$$\n\n**Step 4: Divide numerator by denominator:**\n$$\\frac{7\\sqrt{2}}{\\sqrt{2}} = 7$$\n\nIn the form $a + b\\sqrt{c}$:\n$$7 = 7 + 0\\sqrt{c} \\quad (\\text{where } a = 7, b = 0)$$\n\nTherefore, the simplified exact value is $\\mathbf{7}$."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Solve: $\\frac{1}{3}(2x + 5) \\ge \\frac{1}{4}x + 2\\frac{1}{2}$.",
          "workedSolution": "Given inequality:\n$$\\frac{1}{3}(2x + 5) \\ge \\frac{1}{4}x + \\frac{5}{2}$$\n$$\\frac{2x + 5}{3} \\ge \\frac{x}{4} + \\frac{5}{2}$$\n\n**Step 1: Clear fractions by multiplying through by the LCM of 3, 4, and 2, which is $12$:**\n$$12 \\left(\\frac{2x + 5}{3}\\right) \\ge 12 \\left(\\frac{x}{4}\\right) + 12 \\left(\\frac{5}{2}\\right)$$\n$$4(2x + 5) \\ge 3x + 6(5)$$\n$$8x + 20 \\ge 3x + 30$$\n\n**Step 2: Group like terms:**\n$$8x - 3x \\ge 30 - 20$$\n$$5x \\ge 10$$\n$$x \\ge \\frac{10}{5}$$\n$$x \\ge 2$$\n\n**Truth set:** $\\mathbf{\\{x : x \\ge 2\\}}$."
        },
        {
          "part": "c",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "An athlete runs six times round a circular track of radius $35\\text{ m}$. Find, in metres, the total distance covered by the athlete. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
          "workedSolution": "**Step 1: Calculate the circumference of one full lap of the track:**\n$$C = 2\\pi r$$\nGiven $r = 35\\text{ m}$ and $\\pi = \\frac{22}{7}$:\n$$C = 2 \\times \\frac{22}{7} \\times 35$$\n$$C = 2 \\times 22 \\times 5 = 220\\text{ m}$$\n\n**Step 2: Calculate the total distance covered in 6 laps:**\n$$\\text{Total distance} = 6 \\times C = 6 \\times 220\\text{ m} = 1,320\\text{ m}$$\n\nTherefore, the total distance covered by the athlete is $\\mathbf{1,320\\text{ m}}$."
        }
      ]
    },
    {
      "questionNumber": 6,
      "id": "BECE_2013_P2_Q06",
      "marks": 15,
      "topic": "Frequency Distribution, Commercial Decision Analysis, and Mean Averages",
      "subQuestions": [
        {
          "part": "a",
          "marks": 6,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "The data shows the shoe sizes of $30$ learners in a basic school:\n$$\\begin{matrix} 6 & 4 & 7 & 5 & 5 & 6 \\\\ 4 & 5 & 5 & 4 & 6 & 7 \\\\ 5 & 6 & 4 & 6 & 7 & 5 \\\\ 6 & 4 & 7 & 5 & 4 & 6 \\\\ 5 & 5 & 4 & 6 & 7 & 5 \\end{matrix}$$\nConstruct a frequency distribution table for the data.",
          "workedSolution": "**Frequency Distribution Table:**\n\n| Shoe Size ($x$) | Tally | Frequency ($f$) | Product ($fx$) |\n| :---: | :--- | :---: | :---: |\n| $4$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\parallel$ | $7$ | $4 \\times 7 = 28$ |\n| $5$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\cancel{\\parallel\\parallel\\parallel\\parallel}$ | $10$ | $5 \\times 10 = 50$ |\n| $6$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\parallel\\parallel\\mid$ | $8$ | $6 \\times 8 = 48$ |\n| $7$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}$ | $5$ | $7 \\times 5 = 35$ |\n| **Total** | | **$\\sum f = 30$** | **$\\sum fx = 161$** |"
        },
        {
          "part": "b",
          "marks": 4,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "If the school supplies shoes to the learners:\n(i) which size should be purchased in large quantities?\n(ii) give reason for the answer in (b)(i);\n(iii) which size will be purchased in less quantities?\n(iv) give reason for the answer in (b)(iii).",
          "workedSolution": "**(i) Size to be purchased in large quantities:**\n$$\\mathbf{\\text{Size } 5}$$\n\n---\n\n**(ii) Reason for (b)(i):**\nSize $5$ has the **highest frequency ($10$ learners)**; it is the modal shoe size and therefore in greatest demand.\n\n---\n\n**(iii) Size to be purchased in less quantities:**\n$$\\mathbf{\\text{Size } 7}$$\n\n---\n\n**(iv) Reason for (b)(iii):**\nSize $7$ has the **lowest frequency ($5$ learners)**; it is needed by the fewest number of learners."
        },
        {
          "part": "c",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Find, correct to the nearest whole number, the mean shoe size.",
          "workedSolution": "**Calculating the mean shoe size ($\\bar{x}$):**\n$$\\bar{x} = \\frac{\\sum fx}{\\sum f}$$\nFrom the frequency table in part (a):\n$$\\sum fx = 161$$\n$$\\sum f = 30$$\n\n$$\\bar{x} = \\frac{161}{30} = 5.3667\\dots$$\n\nRounding to the nearest whole number:\n$$5.3667 \\approx 5$$\n\nTherefore, the mean shoe size correct to the nearest whole number is $\\mathbf{5}$."
        }
      ]
    }
  ]
};

export const SET_BECE_2013_MATH_P2: CurriculumQuestionSet = {
  id: "jhs-math-2013-paper2",
  title: "BECE 2013 Mathematics Paper 2 (Theory / Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2013 Paper 2",
  variantType: "past_paper_variant",
  totalQuestions: 6,
  version: 1,
  format: 'structured_essay',
  paperType: 2,
  year: 2013,
  era: 'legacy',
  instructions: "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
  timeAllowed: "1 hour",
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2013/paper_2",
  theoryTopicList: [
    { id: "q1", questionNumber: 1, theoryIndex: 1, title: "Sets, Probability & Factorization", category: "Algebra & Number" },
    { id: "q2", questionNumber: 2, theoryIndex: 2, title: "Vector Translation & Partnership Sharing", category: "Vectors & Commerce" },
    { id: "q3", questionNumber: 3, theoryIndex: 3, title: "Wages, L-Shaped Floor & Carpeting", category: "Mensuration & Geometry" },
    { id: "q4", questionNumber: 4, theoryIndex: 4, title: "Incomes & Ladder Angle of Elevation", category: "Trigonometry & Arithmetic" },
    { id: "q5", questionNumber: 5, theoryIndex: 5, title: "Surds, Inequalities & Circular Track", category: "Surds & Algebra" },
    { id: "q6", questionNumber: 6, theoryIndex: 6, title: "Shoe Sizes Frequency Table & Mean", category: "Statistics & Averages" }
  ],
  questions: BECE_2013_MATH_P2_DATA.questions.map((q) => {
    const mainDiagram = q.subQuestions.find(sq => sq.hasDiagram && sq.svgDiagram)?.svgDiagram || undefined;
    return {
      id: q.id,
      number: q.questionNumber,
      questionNumber: q.questionNumber,
      theoryIndex: q.questionNumber,
      title: `Question ${q.questionNumber}: ${q.topic}`,
      topic: q.topic,
      category: q.topic,
      totalMarks: q.marks,
      points: q.marks,
      section: 'theory',
      format: 'structured_essay',
      type: 'structured_essay',
      prompt: `**Question ${q.questionNumber} [${q.marks} Marks]** — *${q.topic}*\n\nAnswer all sub-parts below showing full mathematical reasoning, intermediate derivations, and final evaluations.`,
      hasDiagram: q.subQuestions.some(sq => sq.hasDiagram),
      diagramSvg: mainDiagram,
      svgDiagram: mainDiagram,
      subQuestions: q.subQuestions.map((sq) => ({
        ...sq,
        part: sq.part,
        partId: `${q.id}_${sq.part}`,
        partLabel: `(${sq.part})`,
        marks: sq.marks,
        points: sq.marks,
        prompt: sq.questionText,
        question: sq.questionText,
        questionText: sq.questionText,
        hasDiagram: sq.hasDiagram,
        diagramSvg: sq.svgDiagram || undefined,
        svgDiagram: sq.svgDiagram || undefined,
        modelAnswer: sq.workedSolution,
        workedSolution: sq.workedSolution,
        hint: `Review fundamental techniques for ${q.topic}. Follow standard step-by-step WAEC marking criteria.`
      })),
      parts: q.subQuestions.map((sq) => ({
        ...sq,
        part: sq.part,
        partId: `${q.id}_${sq.part}`,
        partLabel: `(${sq.part})`,
        marks: sq.marks,
        points: sq.marks,
        prompt: sq.questionText,
        question: sq.questionText,
        questionText: sq.questionText,
        hasDiagram: sq.hasDiagram,
        diagramSvg: sq.svgDiagram || undefined,
        svgDiagram: sq.svgDiagram || undefined,
        modelAnswer: sq.workedSolution,
        workedSolution: sq.workedSolution,
        hint: `Review fundamental techniques for ${q.topic}. Follow standard step-by-step WAEC marking criteria.`
      }))
    };
  })
};

export const SET_BECE_2013_MATH_P2_ALIAS: CurriculumQuestionSet = {
  ...SET_BECE_2013_MATH_P2,
  id: "bece_2013_math_p2"
};
