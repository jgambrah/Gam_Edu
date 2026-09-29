import { CurriculumQuestionSet } from '../types';
import { MathMockObjectiveQuestion } from './bece-math-mock-1';

export const allRawMathMock9Questions: MathMockObjectiveQuestion[] = [
  {
    "number": 1,
    "id": "MOCK09_P1_Q01",
    "prompt": "If $P = \\{x : 1 \\le x \\le 18, x \\text{ is a multiple of } 4\\}$ and $Q = \\{x : 1 \\le x \\le 18, x \\text{ is a factor of } 36\\}$, find $n(P \\cap Q)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2$",
      "B. $3$",
      "C. $4$",
      "D. $5$"
    ],
    "correctAnswer": "A",
    "hint": "Review Sets and Operations on Sets principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "List the elements within the domain $[1, 18]$:\n$$P = \\{4, 8, 12, 16\\}$$\nFactors of $36$ up to $18$:\n$$Q = \\{1, 2, 3, 4, 6, 9, 12, 18\\}$$\nFind $P \\cap Q$:\n$$P \\cap Q = \\{4, 12\\} \\implies n(P \\cap Q) = 2$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Sets and Operations on Sets"
  },
  {
    "number": 2,
    "id": "MOCK09_P1_Q02",
    "prompt": "Simplify: $\\sqrt{200} - \\sqrt{98} + \\sqrt{32}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $5\\sqrt{2}$",
      "B. $6\\sqrt{2}$",
      "C. $7\\sqrt{2}$",
      "D. $8\\sqrt{2}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Real Number System and Surds principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Extract square roots from each surd:\n$$\\sqrt{200} = \\sqrt{100 \\times 2} = 10\\sqrt{2}$$\n$$\\sqrt{98} = \\sqrt{49 \\times 2} = 7\\sqrt{2}$$\n$$\\sqrt{32} = \\sqrt{16 \\times 2} = 4\\sqrt{2}$$\nCombine like terms:\n$$10\\sqrt{2} - 7\\sqrt{2} + 4\\sqrt{2} = (10 - 7 + 4)\\sqrt{2} = 7\\sqrt{2}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Real Number System and Surds"
  },
  {
    "number": 3,
    "id": "MOCK09_P1_Q03",
    "prompt": "Express $0.000624$ in standard form.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6.24 \\times 10^{-4}$",
      "B. $6.24 \\times 10^{-5}$",
      "C. $6.24 \\times 10^{-3}$",
      "D. $62.4 \\times 10^{-5}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Standard Form principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Shift the decimal point $4$ places to the right to place the first non-zero digit in units position:\n$$0.000624 = 6.24 \\times 10^{-4}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Standard Form"
  },
  {
    "number": 4,
    "id": "MOCK09_P1_Q04",
    "prompt": "The diagram shows a quadrilateral $ABCD$ circumscribed around a circle touching all four sides at $P, Q, R,$ and $S$. If $|AP| = 4\\text{ cm}, |BQ| = 6\\text{ cm}, |CR| = 5\\text{ cm},$ and $|DS| = 3\\text{ cm}$, calculate the perimeter of $ABCD$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"240\" viewBox=\"0 0 280 240\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"140\" cy=\"120\" r=\"65\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><polygon points=\"50,165 230,195 210,45 70,45\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"95\" cy=\"175\" r=\"3\" fill=\"#dc2626\"/><circle cx=\"220\" cy=\"120\" r=\"3\" fill=\"#dc2626\"/><circle cx=\"140\" cy=\"45\" r=\"3\" fill=\"#dc2626\"/><circle cx=\"60\" cy=\"105\" r=\"3\" fill=\"#dc2626\"/><text x=\"35\" y=\"175\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"240\" y=\"205\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"220\" y=\"40\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"55\" y=\"40\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">D</text><text x=\"95\" y=\"195\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">P</text><text x=\"230\" y=\"125\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">Q</text><text x=\"135\" y=\"38\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">R</text><text x=\"42\" y=\"110\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">S</text></svg>",
    "options": [
      "A. $32\\text{ cm}$",
      "B. $44\\text{ cm}$",
      "C. $40\\text{ cm}$",
      "D. $36\\text{ cm}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Circle Theorems and Tangent Properties principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Tangents drawn from an external point to a circle are equal in length:\n$$|AS| = |AP| = 4\\text{ cm}, \\quad |BP| = |BQ| = 6\\text{ cm}, \\quad |CQ| = |CR| = 5\\text{ cm}, \\quad |DR| = |DS| = 3\\text{ cm}$$\n$$\\text{Perimeter} = 2(|AP| + |BQ| + |CR| + |DS|) = 2(4 + 6 + 5 + 3) = 2(18) = 36\\text{ cm}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Circle Theorems and Tangent Properties"
  },
  {
    "number": 5,
    "id": "MOCK09_P1_Q05",
    "prompt": "Solve for $x$ in the equation: $4(x - 1) - 2(x - 3) = 9$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1.5$",
      "B. $2.0$",
      "C. $2.5$",
      "D. $3.5$"
    ],
    "correctAnswer": "D",
    "hint": "Review Linear Equations principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Expand the brackets:\n$$4x - 4 - 2x + 6 = 9$$\n$$2x + 2 = 9$$\n$$2x = 7 \\implies x = \\frac{7}{2} = 3.5$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Linear Equations"
  },
  {
    "number": 6,
    "id": "MOCK09_P1_Q06",
    "prompt": "Find the simple interest on $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,200.00$ borrowed for $2\\text{ years } 3\\text{ months}$ at $7.5\\%$ per annum.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 480.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 520.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 540.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 600.00$"
    ],
    "correctAnswer": "C",
    "hint": "Review Commercial Arithmetic: Simple Interest principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$T = 2\\text{ years } + \\frac{3}{12}\\text{ year} = 2.25\\text{ years} = \\frac{9}{4}\\text{ years}$$\n$$I = \\frac{P \\times R \\times T}{100} = \\frac{3,200 \\times 7.5 \\times \\frac{9}{4}}{100} = 32 \\times 7.5 \\times \\frac{9}{4} = 8 \\times 7.5 \\times 9 = 60 \\times 9 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 540.00$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Simple Interest"
  },
  {
    "number": 7,
    "id": "MOCK09_P1_Q07",
    "prompt": "The diagram shows a right-angled triangular prism. If the triangle base has legs $6\\text{ cm}$ and $8\\text{ cm}$, and the prism length is $15\\text{ cm}$, calculate the volume of the prism.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"180\" viewBox=\"0 0 280 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 100,140 40,60\" fill=\"#38bdf8\" fill-opacity=\"0.3\" stroke=\"#0284c7\" stroke-width=\"2\"/><polygon points=\"100,140 40,60 160,40 220,120\" fill=\"#f8fafc\" fill-opacity=\"0.3\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"40\" y1=\"140\" x2=\"160\" y2=\"120\" stroke=\"#64748b\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><line x1=\"160\" y1=\"120\" x2=\"220\" y2=\"120\" stroke=\"#64748b\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><line x1=\"160\" y1=\"120\" x2=\"160\" y2=\"40\" stroke=\"#64748b\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><polyline points=\"40,125 55,125 55,140\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"25\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">6 cm</text><text x=\"65\" y=\"155\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">8 cm</text><text x=\"165\" y=\"75\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">15 cm</text></svg>",
    "options": [
      "A. $180\\text{ cm}^3$",
      "B. $240\\text{ cm}^3$",
      "C. $360\\text{ cm}^3$",
      "D. $720\\text{ cm}^3$"
    ],
    "correctAnswer": "C",
    "hint": "Review Mensuration: Triangular Prisms principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Base area of right } \\triangle = \\frac{1}{2} \\times 8 \\times 6 = 24\\text{ cm}^2$$\n$$\\text{Volume of prism} = \\text{Base area} \\times \\text{Length} = 24 \\times 15 = 360\\text{ cm}^3$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Triangular Prisms"
  },
  {
    "number": 8,
    "id": "MOCK09_P1_Q08",
    "prompt": "Factorize completely: $2px - 6qx + py - 3qy$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(p - 3q)(2x + y)$",
      "B. $(p + 3q)(2x - y)$",
      "C. $(2p - 3q)(x + y)$",
      "D. $(p - 3q)(x + 2y)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Algebraic Factorization principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Group terms pairwise:\n$$2px - 6qx + py - 3qy = 2x(p - 3q) + y(p - 3q) = (p - 3q)(2x + y)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Factorization"
  },
  {
    "number": 9,
    "id": "MOCK09_P1_Q09",
    "prompt": "Solve the linear inequality: $4(x - 2) - 3(2x + 1) > 3$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $x > -7$",
      "B. $x < -7$",
      "C. $x > 7$",
      "D. $x < 7$"
    ],
    "correctAnswer": "B",
    "hint": "Review Linear Inequalities principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$4x - 8 - 6x - 3 > 3$$\n$$-2x - 11 > 3$$\n$$-2x > 14$$\nDivide by $-2$ and reverse the inequality sign:\n$$x < \\frac{14}{-2} \\implies x < -7$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 10,
    "id": "MOCK09_P1_Q10",
    "prompt": "The diagram shows a circle with chords $AB$ and $CD$ intersecting at an interior point $M$. If $\\angle AMD = 100^\\circ$ and arc $AD = 130^\\circ$, calculate the measure of arc $BC$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"240\" viewBox=\"0 0 240 240\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"120\" cy=\"120\" r=\"90\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"45\" y1=\"160\" x2=\"195\" y2=\"80\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><line x1=\"65\" y1=\"65\" x2=\"185\" y2=\"175\" stroke=\"#dc2626\" stroke-width=\"2.5\"/><circle cx=\"125\" cy=\"117\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"30\" y=\"175\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">A</text><text x=\"205\" y=\"85\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">B</text><text x=\"55\" y=\"55\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">C</text><text x=\"195\" y=\"185\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">D</text><text x=\"130\" y=\"135\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">M</text><text x=\"110\" y=\"105\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">100°</text></svg>",
    "options": [
      "A. $60^\\circ$",
      "B. $90^\\circ$",
      "C. $80^\\circ$",
      "D. $70^\\circ$"
    ],
    "correctAnswer": "D",
    "hint": "Review Circle Theorems: Intersecting Chords principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "The measure of an interior angle formed by two intersecting chords is half the sum of intercepted arcs:\n$$\\angle AMD = \\frac{1}{2}(\\text{Arc } AD + \\text{Arc } BC)$$\n$$100^\\circ = \\frac{1}{2}(130^\\circ + \\text{Arc } BC)$$\n$$200^\\circ = 130^\\circ + \\text{Arc } BC \\implies \\text{Arc } BC = 200^\\circ - 130^\\circ = 70^\\circ$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Circle Theorems: Intersecting Chords"
  },
  {
    "number": 11,
    "id": "MOCK09_P1_Q11",
    "prompt": "Find the image of point $M(-2, 7)$ under a translation by vector $\\mathbf{r} = \\begin{pmatrix} 5 \\\\ -3 \\end{pmatrix}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(3, 4)$",
      "B. $(-7, 10)$",
      "C. $(3, 10)$",
      "D. $(7, 4)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Transformational Geometry: Translation principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\begin{pmatrix} x' \\\\ y' \\end{pmatrix} = \\begin{pmatrix} -2 \\\\ 7 \\end{pmatrix} + \\begin{pmatrix} 5 \\\\ -3 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix} \\implies M'(3, 4)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Translation"
  },
  {
    "number": 12,
    "id": "MOCK09_P1_Q12",
    "prompt": "A fair spinner has $8\\text{ equal sectors}$ numbered $1$ to $8$. What is the probability of spinning a prime number?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{1}{4}$",
      "B. $\\frac{3}{8}$",
      "C. $\\frac{1}{2}$",
      "D. $\\frac{5}{8}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Probability principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Sample space $S = \\{1, 2, 3, 4, 5, 6, 7, 8\\} \\implies n(S) = 8$.\nPrime numbers: $E = \\{2, 3, 5, 7\\} \\implies n(E) = 4$.\n$$P(\\text{prime}) = \\frac{4}{8} = \\frac{1}{2}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 13,
    "id": "MOCK09_P1_Q13",
    "prompt": "Convert $324_{\\text{five}}$ to a base ten numeral.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $84$",
      "B. $89$",
      "C. $94$",
      "D. $99$"
    ],
    "correctAnswer": "B",
    "hint": "Review Number Bases principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$324_5 = (3 \\times 5^2) + (2 \\times 5^1) + (4 \\times 5^0) = (3 \\times 25) + (2 \\times 5) + 4 = 75 + 10 + 4 = 89_{10}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Number Bases"
  },
  {
    "number": 14,
    "id": "MOCK09_P1_Q14",
    "prompt": "The diagram shows a straight line with intercepts $(0, -3)$ and $(2, 0)$. Find the equation of the line.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"200\" viewBox=\"0 0 240 200\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"100\" x2=\"220\" y2=\"100\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"80\" y1=\"20\" x2=\"80\" y2=\"180\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"40\" y1=\"180\" x2=\"160\" y2=\"20\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"80\" cy=\"140\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"120\" cy=\"100\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"88\" y=\"145\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">(0, -3)</text><text x=\"125\" y=\"95\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">(2, 0)</text></svg>",
    "options": [
      "A. $y = \\frac{3}{2}x - 3$",
      "B. $y = -\\frac{3}{2}x - 3$",
      "C. $y = \\frac{2}{3}x - 3$",
      "D. $y = 3x - 2$"
    ],
    "correctAnswer": "A",
    "hint": "Review Coordinate Geometry: Line Equations principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$m = \\frac{0 - (-3)}{2 - 0} = \\frac{3}{2}, \\quad c = -3 \\implies y = \\frac{3}{2}x - 3$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Line Equations"
  },
  {
    "number": 15,
    "id": "MOCK09_P1_Q15",
    "prompt": "Make $g$ the subject of the formula: $T = 2\\pi \\sqrt{\\frac{L}{g}}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $g = \\frac{4\\pi^2 L}{T^2}$",
      "B. $g = \\frac{2\\pi L}{T^2}$",
      "C. $g = \\frac{4\\pi^2 T^2}{L}$",
      "D. $g = \\sqrt{\\frac{4\\pi^2 L}{T}}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Change of Subject principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\frac{T}{2\\pi} = \\sqrt{\\frac{L}{g}}$$\nSquare both sides:\n$$\\frac{T^2}{4\\pi^2} = \\frac{L}{g}$$\nCross-multiply to isolate $g$:\n$$g T^2 = 4\\pi^2 L \\implies g = \\frac{4\\pi^2 L}{T^2}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Change of Subject"
  },
  {
    "number": 16,
    "id": "MOCK09_P1_Q16",
    "prompt": "The diagram shows a line segment joining $C(1, 3)$ and $D(5, 6)$. Find the length of line segment $CD$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"180\" viewBox=\"0 0 240 180\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"150\" x2=\"220\" y2=\"150\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"40\" y1=\"20\" x2=\"40\" y2=\"170\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"60\" y1=\"110\" x2=\"180\" y2=\"40\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"60\" cy=\"110\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"180\" cy=\"40\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"45\" y=\"125\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">C(1, 3)</text><text x=\"185\" y=\"45\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">D(5, 6)</text></svg>",
    "options": [
      "A. $4$",
      "B. $7$",
      "C. $6$",
      "D. $5$"
    ],
    "correctAnswer": "D",
    "hint": "Review Coordinate Geometry: Distance Formula principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$|CD| = \\sqrt{(5 - 1)^2 + (6 - 3)^2} = \\sqrt{4^2 + 3^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Distance Formula"
  },
  {
    "number": 17,
    "id": "MOCK09_P1_Q17",
    "prompt": "The mean of the numbers $13, 17, 21, 24,$ and $p$ is $20$. Find the value of $p$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $22$",
      "B. $23$",
      "C. $24$",
      "D. $25$"
    ],
    "correctAnswer": "D",
    "hint": "Review Statistics: Mean principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\sum x = 5 \\times 20 = 100$$\n$$13 + 17 + 21 + 24 + p = 100$$\n$$75 + p = 100 \\implies p = 25$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Statistics: Mean"
  },
  {
    "number": 18,
    "id": "MOCK09_P1_Q18",
    "prompt": "A lorry travels $165\\text{ km}$ in $2\\text{ hours } 45\\text{ minutes}$. Calculate its average speed in kilometres per hour ($\\text{km/h}$).",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $55\\text{ km/h}$",
      "B. $70\\text{ km/h}$",
      "C. $65\\text{ km/h}$",
      "D. $60\\text{ km/h}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Speed, Distance, and Time principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$T = 2\\text{ hours } + \\frac{45}{60}\\text{ hour} = 2.75\\text{ hours} = \\frac{11}{4}\\text{ hours}$$\n$$\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}} = \\frac{165}{11/4} = 165 \\times \\frac{4}{11} = 15 \\times 4 = 60\\text{ km/h}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Speed, Distance, and Time"
  },
  {
    "number": 19,
    "id": "MOCK09_P1_Q19",
    "prompt": "The diagram shows a sector with central angle $45^\\circ$ and radius $14\\text{ cm}$. Calculate the area of the sector. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"180\" viewBox=\"0 0 220 180\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M 40 140 L 160 140 A 120 120 0 0 0 125 55 Z\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"40\" cy=\"140\" r=\"3.5\" fill=\"#0f172a\"/><path d=\"M 70 140 A 30 30 0 0 0 61 119\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"72\" y=\"132\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">45°</text><text x=\"95\" y=\"155\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">14 cm</text></svg>",
    "options": [
      "A. $44.0\\text{ cm}^2$",
      "B. $77.0\\text{ cm}^2$",
      "C. $88.0\\text{ cm}^2$",
      "D. $154.0\\text{ cm}^2$"
    ],
    "correctAnswer": "B",
    "hint": "Review Mensuration: Area of Sector principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Area} = \\frac{\\theta}{360^\\circ} \\times \\pi r^2 = \\frac{45^\\circ}{360^\\circ} \\times \\frac{22}{7} \\times 14^2 = \\frac{1}{8} \\times 22 \\times 28 = \\frac{1}{8} \\times 616 = 77.0\\text{ cm}^2$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Mensuration: Area of Sector"
  },
  {
    "number": 20,
    "id": "MOCK09_P1_Q20",
    "prompt": "Find the image of point $W(-5, -2)$ under a reflection in the $y$-axis.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(5, -2)$",
      "B. $(-5, 2)$",
      "C. $(5, 2)$",
      "D. $(-2, -5)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Transformational Geometry: Reflection principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Reflection in the $y$-axis: $(x, y) \\to (-x, y)$:\n$$W(-5, -2) \\to W'(5, -2)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Reflection"
  },
  {
    "number": 21,
    "id": "MOCK09_P1_Q21",
    "prompt": "Find the rule governing the mapping below:\n$$\\begin{array}{cccccc} x & 1 & 2 & 3 & 4 & 5 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 6 & 11 & 16 & 21 & 26 \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $y = 5x + 1$",
      "B. $y = 5x - 1$",
      "C. $y = 6x$",
      "D. $y = 4x + 2$"
    ],
    "correctAnswer": "A",
    "hint": "Review Relations and Mappings principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Common difference in $y$: $11 - 6 = 5 \\implies m = 5$.\nForm: $y = 5x + c$. For $x = 1$:\n$$6 = 5(1) + c \\implies c = 1 \\implies y = 5x + 1$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Relations and Mappings"
  },
  {
    "number": 22,
    "id": "MOCK09_P1_Q22",
    "prompt": "The diagram shows a right-angled triangle $XYZ$. Find the length of the hypotenuse $XZ$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"180\" viewBox=\"0 0 260 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 220,140 40,30\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"40,125 55,125 55,140\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"25\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">Y</text><text x=\"230\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">Z</text><text x=\"30\" y=\"25\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">X</text><text x=\"15\" y=\"90\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">8 cm</text><text x=\"120\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">15 cm</text></svg>",
    "options": [
      "A. $16\\text{ cm}$",
      "B. $23\\text{ cm}$",
      "C. $19\\text{ cm}$",
      "D. $17\\text{ cm}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Pythagoras' Theorem principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "By Pythagoras' Theorem:\n$$|XZ|^2 = |XY|^2 + |YZ|^2 = 8^2 + 15^2 = 64 + 225 = 289$$\n$$|XZ| = \\sqrt{289} = 17\\text{ cm}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Pythagoras' Theorem"
  },
  {
    "number": 23,
    "id": "MOCK09_P1_Q23",
    "prompt": "The bearing of town $R$ from town $T$ is $160^\\circ$. What is the three-figure bearing of town $T$ from town $R$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $020^\\circ$",
      "B. $200^\\circ$",
      "C. $340^\\circ$",
      "D. $350^\\circ$"
    ],
    "correctAnswer": "C",
    "hint": "Review Bearings principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Since forward bearing $\\theta = 160^\\circ < 180^\\circ$, add $180^\\circ$:\n$$\\text{Back bearing} = 160^\\circ + 180^\\circ = 340^\\circ$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Bearings"
  },
  {
    "number": 24,
    "id": "MOCK09_P1_Q24",
    "prompt": "A trader bought an article for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 500.00$ and sold it for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 425.00$. Find the percentage loss.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $12.5\\%$",
      "B. $15.0\\%$",
      "C. $17.5\\%$",
      "D. $20.0\\%$"
    ],
    "correctAnswer": "B",
    "hint": "Review Commercial Arithmetic: Percentage Loss principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Loss} = 500 - 425 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 75.00$$\n$$\\text{Percentage loss} = \\left(\\frac{75}{500}\\right) \\times 100\\% = 15\\%$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Percentage Loss"
  },
  {
    "number": 25,
    "id": "MOCK09_P1_Q25",
    "prompt": "Evaluate: $3^4 \\times 9^{-1} \\div 27^0$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3$",
      "B. $81$",
      "C. $27$",
      "D. $9$"
    ],
    "correctAnswer": "D",
    "hint": "Review Indices and Exponents principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$3^4 \\times (3^2)^{-1} \\div 1 = 3^4 \\times 3^{-2} = 3^{4 - 2} = 3^2 = 9$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Indices and Exponents"
  },
  {
    "number": 26,
    "id": "MOCK09_P1_Q26",
    "prompt": "The diagram shows a line intersecting parallel lines. Calculate the value of interior angle $x$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"320\" height=\"160\" viewBox=\"0 0 320 160\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"30\" y1=\"40\" x2=\"290\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"30\" y1=\"120\" x2=\"290\" y2=\"120\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"90\" y1=\"150\" x2=\"230\" y2=\"10\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 190 40 A 25 25 0 0 1 208 22\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><path d=\"M 140 120 A 25 25 0 0 1 120 102\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"195\" y=\"30\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">75°</text><text x=\"100\" y=\"110\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">x</text></svg>",
    "options": [
      "A. $65^\\circ$",
      "B. $75^\\circ$",
      "C. $105^\\circ$",
      "D. $115^\\circ$"
    ],
    "correctAnswer": "C",
    "hint": "Review Plane Geometry: Parallel Lines principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Consecutive interior (allied) angles between parallel lines sum to $180^\\circ$:\n$$x + 75^\\circ = 180^\\circ \\implies x = 180^\\circ - 75^\\circ = 105^\\circ$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Plane Geometry: Parallel Lines"
  },
  {
    "number": 27,
    "id": "MOCK09_P1_Q27",
    "prompt": "If column vectors $\\mathbf{u} = \\begin{pmatrix} 2k - 1 \\\\ 5 \\end{pmatrix}$ and $\\mathbf{w} = \\begin{pmatrix} 9 \\\\ m + 2 \\end{pmatrix}$ are equal, find the values of $k$ and $m$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $k = 4, m = 3$",
      "B. $k = 5, m = 3$",
      "C. $k = 5, m = 7$",
      "D. $k = 4, m = 7$"
    ],
    "correctAnswer": "B",
    "hint": "Review Vectors: Equal Column Matrices principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Equate corresponding components:\n$$2k - 1 = 9 \\implies 2k = 10 \\implies k = 5$$\n$$m + 2 = 5 \\implies m = 3$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Vectors: Equal Column Matrices"
  },
  {
    "number": 28,
    "id": "MOCK09_P1_Q28",
    "prompt": "The diagram shows a circle with radius $6\\text{ cm}$. Find the area of the shaded quadrant in terms of $\\pi$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"200\" height=\"200\" viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"100\" cy=\"100\" r=\"70\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><path d=\"M 100 100 L 170 100 A 70 70 0 0 0 100 30 Z\" fill=\"#10b981\" fill-opacity=\"0.35\" stroke=\"#059669\" stroke-width=\"2\"/><line x1=\"100\" y1=\"100\" x2=\"170\" y2=\"100\" stroke=\"#059669\" stroke-width=\"2\"/><line x1=\"100\" y1=\"100\" x2=\"100\" y2=\"30\" stroke=\"#059669\" stroke-width=\"2\"/><polyline points=\"100,85 115,85 115,100\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><circle cx=\"100\" cy=\"100\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"85\" y=\"115\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">O</text><text x=\"125\" y=\"115\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">6 cm</text></svg>",
    "options": [
      "A. $6\\pi\\text{ cm}^2$",
      "B. $18\\pi\\text{ cm}^2$",
      "C. $12\\pi\\text{ cm}^2$",
      "D. $9\\pi\\text{ cm}^2$"
    ],
    "correctAnswer": "D",
    "hint": "Review Mensuration: Quadrant Area principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Area of quadrant} = \\frac{1}{4}\\pi r^2 = \\frac{1}{4}\\pi(6^2) = \\frac{36\\pi}{4} = 9\\pi\\text{ cm}^2$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Quadrant Area"
  },
  {
    "number": 29,
    "id": "MOCK09_P1_Q29",
    "prompt": "The sum of the interior angles of a regular polygon is $1,440^\\circ$. How many sides has the polygon?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $8$",
      "B. $9$",
      "C. $10$",
      "D. $12$"
    ],
    "correctAnswer": "C",
    "hint": "Review Polygons and Interior Angles principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$(n - 2) \\times 180^\\circ = 1,440^\\circ$$\n$$n - 2 = \\frac{1,440}{180} = 8 \\implies n = 8 + 2 = 10$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Polygons and Interior Angles"
  },
  {
    "number": 30,
    "id": "MOCK09_P1_Q30",
    "prompt": "A rectangular carton measuring $50\\text{ cm} \\times 40\\text{ cm} \\times 30\\text{ cm}$ is packed with matchboxes each measuring $5\\text{ cm} \\times 4\\text{ cm} \\times 2\\text{ cm}$. How many matchboxes can be packed into the carton?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1,200$",
      "B. $1,500$",
      "C. $1,800$",
      "D. $2,000$"
    ],
    "correctAnswer": "B",
    "hint": "Review Mensuration: Volume and Packing principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Number of boxes} = \\left(\\frac{50}{5}\\right) \\times \\left(\\frac{40}{4}\\right) \\times \\left(\\frac{30}{2}\\right) = 10 \\times 10 \\times 15 = 1,500$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Mensuration: Volume and Packing"
  },
  {
    "number": 31,
    "id": "MOCK09_P1_Q31",
    "prompt": "The diagram shows a kite $EFGH$. If diagonals $|EG| = 14\\text{ cm}$ and $|FH| = 8\\text{ cm}$, calculate the area of the kite.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"260\" viewBox=\"0 0 240 260\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"120,20 190,90 120,240 50,90\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"120\" y1=\"20\" x2=\"120\" y2=\"240\" stroke=\"#dc2626\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><line x1=\"50\" y1=\"90\" x2=\"190\" y2=\"90\" stroke=\"#0284c7\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><circle cx=\"120\" cy=\"90\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"115\" y=\"15\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">E</text><text x=\"195\" y=\"95\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">F</text><text x=\"115\" y=\"255\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">G</text><text x=\"35\" y=\"95\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">H</text></svg>",
    "options": [
      "A. $48\\text{ cm}^2$",
      "B. $56\\text{ cm}^2$",
      "C. $64\\text{ cm}^2$",
      "D. $112\\text{ cm}^2$"
    ],
    "correctAnswer": "B",
    "hint": "Review Mensuration: Area of Kite principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Area} = \\frac{1}{2} d_1 d_2 = \\frac{1}{2} \\times 14 \\times 8 = 7 \\times 8 = 56\\text{ cm}^2$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Mensuration: Area of Kite"
  },
  {
    "number": 32,
    "id": "MOCK09_P1_Q32",
    "prompt": "Find the Least Common Multiple (LCM) of $18, 24,$ and $36$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $48$",
      "B. $144$",
      "C. $108$",
      "D. $72$"
    ],
    "correctAnswer": "D",
    "hint": "Review Number Theory and LCM principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$18 = 2 \\times 3^2, \\quad 24 = 2^3 \\times 3, \\quad 36 = 2^2 \\times 3^2$$\n$$\\text{LCM} = 2^3 \\times 3^2 = 8 \\times 9 = 72$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Number Theory and LCM"
  },
  {
    "number": 33,
    "id": "MOCK09_P1_Q33",
    "prompt": "The mean mark of $6\\text{ students}$ in a mathematics test is $16$. If a seventh student scores $23$, find the new mean mark.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $16.5$",
      "B. $17.0$",
      "C. $17.5$",
      "D. $18.0$"
    ],
    "correctAnswer": "B",
    "hint": "Review Statistics: Mean principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Sum of 6 students} = 6 \\times 16 = 96$$\n$$\\text{New sum with 7th student} = 96 + 23 = 119$$\n$$\\text{New mean} = \\frac{119}{7} = 17.0$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Statistics: Mean"
  },
  {
    "number": 34,
    "id": "MOCK09_P1_Q34",
    "prompt": "If $a = 4$ and $b = -3$, evaluate $\\frac{2a^2 - 3b}{ab + 20}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3.825$",
      "B. $4.125$",
      "C. $5.125$",
      "D. $6.000$"
    ],
    "correctAnswer": "C",
    "hint": "Review Algebraic Substitution principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Numerator} = 2(4)^2 - 3(-3) = 2(16) + 9 = 32 + 9 = 41$$\n$$\\text{Denominator} = (4)(-3) + 20 = -12 + 20 = 8$$\n$$\\text{Value} = \\frac{41}{8} = 5.125$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Algebraic Substitution"
  },
  {
    "number": 35,
    "id": "MOCK09_P1_Q35",
    "prompt": "The diagram shows a right-angled triangle $ABC$. Find the value of $\\cos(\\angle BAC)$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"180\" viewBox=\"0 0 260 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 220,140 40,30\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"40,125 55,125 55,140\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"25\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"230\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"30\" y=\"25\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"15\" y=\"90\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">12 cm</text><text x=\"120\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">5 cm</text><text x=\"145\" y=\"80\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">13 cm</text></svg>",
    "options": [
      "A. $\\frac{5}{13}$",
      "B. $\\frac{12}{13}$",
      "C. $\\frac{5}{12}$",
      "D. $\\frac{12}{5}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Trigonometric Ratios principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "From vertex $A$ in $\\triangle ABC$:\n$$\\text{Adjacent side} = |AB| = 12\\text{ cm}$$\n$$\\text{Hypotenuse} = |AC| = 13\\text{ cm}$$\n$$\\cos(\\angle BAC) = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}} = \\frac{12}{13}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Trigonometric Ratios"
  },
  {
    "number": 36,
    "id": "MOCK09_P1_Q36",
    "prompt": "Simplify: $\\frac{3}{4}(8x - 12) - \\frac{2}{3}(6x - 9)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2x - 3$",
      "B. $2x - 15$",
      "C. $2x + 3$",
      "D. $4x - 3$"
    ],
    "correctAnswer": "A",
    "hint": "Review Algebraic Simplification principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\frac{3}{4}(8x - 12) = 6x - 9$$\n$$\\frac{2}{3}(6x - 9) = 4x - 6$$\n$$(6x - 9) - (4x - 6) = 6x - 9 - 4x + 6 = 2x - 3$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Simplification"
  },
  {
    "number": 37,
    "id": "MOCK09_P1_Q37",
    "prompt": "A map is drawn to a scale of $1 : 20,000$. What is the actual distance in metres represented by $6.5\\text{ cm}$ on the map?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1,300\\text{ m}$",
      "B. $1,350\\text{ m}$",
      "C. $1,400\\text{ m}$",
      "D. $1,500\\text{ m}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Scale and Ratios principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Actual distance} = 6.5 \\times 20,000\\text{ cm} = 130,000\\text{ cm} = 1,300\\text{ m}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Scale and Ratios"
  },
  {
    "number": 38,
    "id": "MOCK09_P1_Q38",
    "prompt": "Find the volume of a sphere of radius $3\\text{ cm}$ in terms of $\\pi$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $12\\pi\\text{ cm}^3$",
      "B. $24\\pi\\text{ cm}^3$",
      "C. $36\\pi\\text{ cm}^3$",
      "D. $48\\pi\\text{ cm}^3$"
    ],
    "correctAnswer": "C",
    "hint": "Review Solid Geometry: Volume of Sphere principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi (3^3) = \\frac{4}{3}\\pi (27) = 4 \\times 9\\pi = 36\\pi\\text{ cm}^3$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Solid Geometry: Volume of Sphere"
  },
  {
    "number": 39,
    "id": "MOCK09_P1_Q39",
    "prompt": "How many lines of symmetry has a regular decagon (10-sided polygon)?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $5$",
      "B. $8$",
      "C. $10$",
      "D. $20$"
    ],
    "correctAnswer": "C",
    "hint": "Review Symmetry in Polygons principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "A regular polygon with $n$ sides has exactly $n$ axes of symmetry. Thus, a regular decagon has $10$ lines of symmetry.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Symmetry in Polygons"
  },
  {
    "number": 40,
    "id": "MOCK09_P1_Q40",
    "prompt": "An agent sold a residential plot for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 80,000.00$ and earned a commission of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,800.00$. Calculate the percentage rate of commission.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $5\\%$",
      "B. $6\\%$",
      "C. $7\\%$",
      "D. $8\\%$"
    ],
    "correctAnswer": "B",
    "hint": "Review Commercial Arithmetic: Commission principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Rate} = \\left(\\frac{4,800}{80,000}\\right) \\times 100\\% = \\frac{48}{8}\\% = 6\\%$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Commission"
  }
];

export const SET_BECE_MOCK_9_MATH_P1: CurriculumQuestionSet = {
  id: "math_mock_9_p1",
  title: "BECE Mathematics National Mock 9 (Paper 1 Objective)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 9 Paper 1",
  variantType: "past_paper_variant",
  totalQuestions: 40,
  version: 1,
  format: 'multiple_choice',
  paperType: 1,
  year: 2026,
  era: 'modern',
  isMock: true,
  instructions: "Answer all forty questions on the computer-based testing interface. Each question carries equal marks. Work systematically and manage your time.",
  timeAllowed: "1 hour",
  durationMinutes: 60,
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_09/paper_1",
  questions: allRawMathMock9Questions.map((q) => ({
    id: `math_m9_q${q.number}`,
    number: q.number,
    questionNumber: q.number,
    prompt: q.prompt,
    options: q.options,
    correctAnswer: q.correctAnswer,
    hint: q.hint,
    workedSolution: q.workedSolution,
    points: q.points,
    topic: q.topic,
    section: 'objective',
    format: 'multiple_choice',
    hasDiagram: q.hasDiagram,
    svgDiagram: q.svgDiagram
  }))
};

export const rawMathMock9Paper2Questions = [
  {
    "questionNumber": 1,
    "id": "MOCK09_P2_Q01",
    "marks": 15,
    "topic": "Sets, Linear Inequalities, and Vector Column Operations",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"380\" height=\"240\" viewBox=\"0 0 380 240\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"10\" width=\"360\" height=\"220\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"35\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 72</text><circle cx=\"145\" cy=\"125\" r=\"72\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"235\" cy=\"125\" r=\"72\" fill=\"#10b981\" fill-opacity=\"0.2\" stroke=\"#059669\" stroke-width=\"2\"/><text x=\"105\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">F (Football)</text><text x=\"240\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#047857\">T (Table Tennis)</text><text x=\"105\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">27</text><text x=\"182\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">15</text><text x=\"255\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">21</text><text x=\"315\" y=\"205\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">9</text></svg>",
        "questionText": "In a sports club of $72\\text{ youths}$, $42$ play Football ($F$), $36$ play Table Tennis ($T$), and $15$ play both games. The remaining youths play neither game.\n(i) Illustrate the information on a Venn diagram.\n(ii) Find the number of youths who play:\n    $(\\alpha)$ Football only;\n    $(\\beta)$ Table Tennis only;\n    $(\\gamma)$ neither Football nor Table Tennis.",
        "workedSolution": "**(i) Venn Diagram Representation:**\nUniversal set $n(U) = 72$.\n- Football: $n(F) = 42$\n- Table Tennis: $n(T) = 36$\n- Both games: $n(F \\cap T) = 15$\n\nRegion Breakdown:\n- Football only: $n(F \\cap T') = 42 - 15 = 27$\n- Table Tennis only: $n(F' \\cap T) = 36 - 15 = 21$\n- Both games: $n(F \\cap T) = 15$\n- Neither game: $n(F \\cup T)' = 72 - (27 + 15 + 21) = 72 - 63 = 9$\n\n*(See the embedded SVG above for the complete, labeled illustration)*.\n\n---\n\n**(ii) ($a$) Youths who play Football only:**\n$$n(F \\cap T') = 42 - 15 = 27$$\nTherefore, **$27\\text{ youths}$ play Football only**.\n\n---\n\n**(ii) ($\\beta$) Youths who play Table Tennis only:**\n$$n(F' \\cap T) = 36 - 15 = 21$$\nTherefore, **$21\\text{ youths}$ play Table Tennis only**.\n\n---\n\n**(ii) ($\\gamma$) Youths who play neither game:**\n$$n(F \\cup T)' = 72 - 63 = 9$$\nTherefore, **$9\\text{ youths}$ play neither game**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"80\" viewBox=\"0 0 360 80\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"40\" x2=\"340\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"35\" x2=\"60\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"35\" x2=\"120\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"35\" x2=\"180\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"35\" x2=\"240\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"300\" y1=\"35\" x2=\"300\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"55\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">-2</text><text x=\"115\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">-1</text><text x=\"177\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">0</text><text x=\"237\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">1</text><text x=\"297\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">2</text><circle cx=\"115\" cy=\"25\" r=\"5\" fill=\"#0284c7\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><line x1=\"115\" y1=\"25\" x2=\"340\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"3\"/><polygon points=\"335,20 345,25 335,30\" fill=\"#0284c7\"/></svg>",
        "questionText": "(i) Solve the inequality: $\\frac{3x - 1}{2} - \\frac{x - 3}{3} \\ge 2$.\n(ii) Illustrate your solution on a number line.",
        "workedSolution": "**(i) Solving the inequality:**\n$$\\frac{3x - 1}{2} - \\frac{x - 3}{3} \\ge 2$$\nMultiply through by the LCM of $2$ and $3$, which is $6$:\n$$6\\left(\\frac{3x - 1}{2}\\right) - 6\\left(\\frac{x - 3}{3}\\right) \\ge 6(2)$$\n$$3(3x - 1) - 2(x - 3) \\ge 12$$\n$$9x - 3 - 2x + 6 \\ge 12$$\n$$7x + 3 \\ge 12$$\n$$7x \\ge 12 - 3$$\n$$7x \\ge 9 \\implies x \\ge \\frac{9}{7} = 1\\frac{2}{7}$$\n\n**Truth set:** $\\mathbf{\\left\\{x : x \\ge 1\\frac{2}{7}\\right\\}}$.\n\n---\n\n**(ii) Number Line Representation:**\nMark a solid circle at $x = 1\\frac{2}{7}$ (approximately $1.29$) and draw a horizontal ray pointing to the right toward positive infinity."
      }
    ]
  },
  {
    "questionNumber": 2,
    "id": "MOCK09_P2_Q02",
    "marks": 15,
    "topic": "Financial Mathematics: Partnerships, Profits, and Linear Wages",
    "subQuestions": [
      {
        "part": "a",
        "marks": 9,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "Kwame, Yaw, and Kofi started a logistics venture with capital contributions of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 24,000.00, \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 36,000.00,$ and $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 40,000.00$ respectively. They agreed that Kwame should receive $12\\%$ of the gross profit as manager and the remainder shared in the ratio of their capital investments. If an annual profit of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 75,000.00$ was realized:\n(i) How much did Kwame receive as managerial allowance?\n(ii) How much profit was shared according to capital contributions?\n(iii) Calculate the total amount received by Kwame.",
        "workedSolution": "**(i) Kwame's managerial allowance:**\n$$\\text{Allowance} = \\frac{12}{100} \\times 75,000.00 = 12 \\times 750.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 9,000.00$$\n\nTherefore, Kwame received **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 9,000.00$** as manager.\n\n---\n\n**(ii) Profit shared according to contributions:**\n$$\\text{Remaining profit} = 75,000.00 - 9,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 66,000.00$$\n\nTherefore, **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 66,000.00$** was shared according to capital contributions.\n\n---\n\n**(iii) Total amount received by Kwame:**\nRatio of contributions: Kwame : Yaw : Kofi\n$$= 24,000 : 36,000 : 40,000 = 6 : 9 : 10$$\n$$\\text{Total parts} = 6 + 9 + 10 = 25$$\n$$\\text{Kwame's share of remaining profit} = \\frac{6}{25} \\times 66,000.00 = 6 \\times 2,640.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 15,840.00$$\n$$\\text{Total for Kwame} = 9,000.00 + 15,840.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 24,840.00$$\n\nTherefore, Kwame received a total of **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 24,840.00$**."
      },
      {
        "part": "b",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A surveyor's daily wage of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 80.00$ is increased by $15\\%$. If she works for $24\\text{ days}$ at the new rate, calculate her total earnings.",
        "workedSolution": "**Step 1: Calculate the new daily wage:**\n$$\\text{Increase} = \\frac{15}{100} \\times 80.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12.00$$\n$$\\text{New wage} = 80.00 + 12.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 92.00$$\n\n**Step 2: Calculate total earnings for 24 days:**\n$$\\text{Total earnings} = 24 \\times 92.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,208.00$$\n\nTherefore, the surveyor earned **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,208.00$**."
      }
    ]
  },
  {
    "questionNumber": 3,
    "id": "MOCK09_P2_Q03",
    "marks": 15,
    "topic": "Plane and Solid Geometry: Triangular Field with Stream and Solid Cone",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"220\" viewBox=\"0 0 360 220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,180 320,180 160,50\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"160\" y1=\"50\" x2=\"160\" y2=\"180\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><polyline points=\"160,165 175,165 175,180\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><text x=\"155\" y=\"38\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"25\" y=\"190\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"325\" y=\"190\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"155\" y=\"200\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">D</text><text x=\"80\" y=\"110\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">13 m</text><text x=\"245\" y=\"110\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">15 m</text><text x=\"168\" y=\"120\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">12 m</text><text x=\"110\" y=\"215\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
        "questionText": "The diagram shows a triangular piece of land $ABC$ divided by an irrigation drainage line $AD$ perpendicular to boundary $BC$. Given $|AB| = 13\\text{ m}, |AC| = 15\\text{ m},$ and altitude $|AD| = 12\\text{ m}$, calculate the:\n(i) length of base segment $BD$;\n(ii) length of base segment $DC$;\n(iii) perimeter of the entire triangular land $ABC$;\n(iv) total area of the land.",
        "workedSolution": "**(i) Finding length $|BD|$:**\nIn right-angled triangle $\\triangle ADB$:\n$$|AB|^2 = |BD|^2 + |AD|^2$$\n$$13^2 = |BD|^2 + 12^2$$\n$$169 = |BD|^2 + 144$$\n$$|BD|^2 = 169 - 144 = 25 \\implies |BD| = 5\\text{ m}$$\n\nTherefore, **$|BD| = 5\\text{ m}$**.\n\n---\n\n**(ii) Finding length $|DC|$:**\nIn right-angled triangle $\\triangle ADC$:\n$$|AC|^2 = |DC|^2 + |AD|^2$$\n$$15^2 = |DC|^2 + 12^2$$\n$$225 = |DC|^2 + 144$$\n$$|DC|^2 = 225 - 144 = 81 \\implies |DC| = 9\\text{ m}$$\n\nTherefore, **$|DC| = 9\\text{ m}$**.\n\n---\n\n**(iii) Perimeter of $\\triangle ABC$:**\n$$|BC| = |BD| + |DC| = 5 + 9 = 14\\text{ m}$$\n$$\\text{Perimeter} = |AB| + |BC| + |AC| = 13 + 14 + 15 = 42\\text{ m}$$\n\nTherefore, the perimeter is **$42\\text{ m}$**.\n\n---\n\n**(iv) Total area of $\\triangle ABC$:**\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 14 \\times 12 = 7 \\times 12 = 84\\text{ m}^2$$\n\nTherefore, the area of the land is **$84\\text{ m}^2$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A solid metal cone of base radius $r = 7\\text{ cm}$ has a slant height $l = 25\\text{ cm}$. Calculate the:\n(i) vertical height $h$ of the cone;\n(ii) volume of the cone. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
        "workedSolution": "**(i) Finding vertical height $h$:**\nIn the right-angled triangle formed inside the cone:\n$$l^2 = r^2 + h^2$$\n$$25^2 = 7^2 + h^2$$\n$$625 = 49 + h^2$$\n$$h^2 = 625 - 49 = 576 \\implies h = \\sqrt{576} = 24\\text{ cm}$$\n\nTherefore, the vertical height of the cone is **$24\\text{ cm}$**.\n\n---\n\n**(ii) Volume of the cone:**\n$$V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3} \\times \\frac{22}{7} \\times 7^2 \\times 24 = \\frac{1}{3} \\times 22 \\times 7 \\times 24 = 22 \\times 7 \\times 8 = 1,232\\text{ cm}^3$$\n\nTherefore, the volume of the cone is **$1,232\\text{ cm}^3$**."
      }
    ]
  },
  {
    "questionNumber": 4,
    "id": "MOCK09_P2_Q04",
    "marks": 15,
    "topic": "Geometric Compass Construction: Quadrilateral $ABCD$ with Inscribed Circle",
    "subQuestions": [
      {
        "part": "a",
        "marks": 10,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"420\" height=\"300\" viewBox=\"0 0 420 300\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"420\" height=\"300\" fill=\"#ffffff\"/><polygon points=\"60,220 340,220 280,80 120,80\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"60\" y1=\"220\" x2=\"280\" y2=\"80\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><path d=\"M 105 220 A 45 45 0 0 0 85 181\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><text x=\"95\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">60°</text><text x=\"45\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"350\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"285\" y=\"70\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"110\" y=\"70\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">D</text><text x=\"190\" y=\"240\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">9 cm</text><text x=\"75\" y=\"150\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">7 cm</text><text x=\"190\" y=\"70\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">6 cm</text></svg>",
        "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct side $|AB| = 9.0\\text{ cm}$;\n(ii) At vertex $A$, construct an angle $\\angle DAB = 60^\\circ$ such that side $|AD| = 7.0\\text{ cm}$;\n(iii) Through point $D$, construct a line parallel to $AB$;\n(iv) On this parallel line, locate vertex $C$ such that $|DC| = 6.0\\text{ cm}$ and join point $C$ to point $B$ to complete trapezium $ABCD$;\n(v) Construct the diagonal $AC$.",
        "workedSolution": "**Compass Construction Steps:**\n1. **Base Line $|AB| = 9.0\\text{ cm}$:**\n   - Draw a horizontal pencil line and mark vertex $A$.\n   - Set compasses to $9.0\\text{ cm}$, place needle at $A$, and strike an arc to locate $B$.\n2. **Construct $\\angle DAB = 60^\\circ$ and Vertex $D$:**\n   - With needle at $A$, strike an arc crossing $AB$. From that intersection, cut the arc to establish the $60^\\circ$ ray.\n   - Set compasses to $7.0\\text{ cm}$, place needle at $A$, and cut the $60^\\circ$ ray to locate vertex $D$.\n3. **Parallel Line through $D$:**\n   - At point $D$, construct an angle of $120^\\circ$ with line segment $AD$ (since interior allied angles between parallel lines sum to $180^\\circ$).\n   - Extend this ray horizontally to the right.\n4. **Locating $C$ and Completing Trapezium $ABCD$:**\n   - Set compasses to $6.0\\text{ cm}$, place needle at $D$, and cut the horizontal line to fix vertex $C$.\n   - Rule a straight line connecting $C$ to $B$.\n5. **Diagonal $AC$:**\n   - Draw a straight line segment joining vertex $A$ to vertex $C$."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your completed construction in (a):\n(i) Measure the length of diagonal $|AC|$;\n(ii) Measure the interior angle $\\angle ABC$;\n(iii) Calculate the perpendicular distance between the parallel lines $AB$ and $DC$.",
        "workedSolution": "**(i) Measuring diagonal $|AC|$:**\n- Perpendicular height $h = |AD| \\sin 60^\\circ = 7.0 \\times 0.8660 \\approx 6.06\\text{ cm}$\n- Horizontal projection of $AD = 7.0 \\cos 60^\\circ = 3.5\\text{ cm}$\n- Point $C$ is at horizontal coordinate $3.5 + 6.0 = 9.5\\text{ cm}$ from $A$.\n- $|AC| = \\sqrt{9.5^2 + 6.06^2} = \\sqrt{90.25 + 36.72} = \\sqrt{126.97} \\approx 11.27\\text{ cm}$\n$$\\mathbf{|AC| \\approx 11.3\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(ii) Measuring angle $\\angle ABC$:**\n- Point $B$ is at $9.0\\text{ cm}$, while $C$ is at $9.5\\text{ cm}$ horizontally (difference $= 0.5\\text{ cm}$ outward):\n  $$\\tan(180^\\circ - \\angle ABC) = \\frac{6.06}{0.5} = 12.12 \\implies \\angle ABC \\approx 85.3^\\circ$$\n$$\\mathbf{\\angle ABC \\approx 85^\\circ \\pm 1^\\circ}$$\n\n---\n\n**(iii) Perpendicular distance between $AB$ and $DC$ ($h$):**\n$$h = 7.0 \\times \\sin 60^\\circ = 7.0 \\times 0.8660 = 6.06\\text{ cm}$$\n$$\\mathbf{h \\approx 6.1\\text{ cm} \\pm 0.1\\text{ cm}}$$"
      }
    ]
  },
  {
    "questionNumber": 5,
    "id": "MOCK09_P2_Q05",
    "marks": 15,
    "topic": "Frequency Distribution, Mean, and Bar Chart",
    "subQuestions": [
      {
        "part": "a",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The following scores were obtained by $32\\text{ candidates}$ in a mathematics speed quiz scored out of $10$ marks:\n$$6, 4, 7, 5, 8, 6, 5, 7, 6, 8, 4, 5, 6, 7, 5, 6, 8, 5, 7, 6, 4, 5, 7, 6, 8, 5, 6, 7, 4, 5, 6, 5$$\nConstruct a frequency distribution table showing the score ($x$), tally, frequency ($f$), and product ($fx$).",
        "workedSolution": "**Frequency Distribution Table:**\n\n| Score ($x$) | Tally | Frequency ($f$) | Product ($fx$) |\n| :---: | :--- | :---: | :---: |\n| $4$ | $\\parallel\\parallel$ | $4$ | $4 \\times 4 = 16$ |\n| $5$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\cancel{\\parallel\\parallel\\parallel\\parallel}$ | $9$ | $5 \\times 9 = 45$ |\n| $6$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\cancel{\\parallel\\parallel\\parallel\\parallel}$ | $9$ | $6 \\times 9 = 54$ |\n| $7$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\mid$ | $6$ | $7 \\times 6 = 42$ |\n| $8$ | $\\parallel\\parallel$ | $4$ | $8 \\times 4 = 32$ |\n| **Total** | | **$\\sum f = 32$** | **$\\sum fx = 189$** |"
      },
      {
        "part": "b",
        "marks": 4,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your frequency distribution table in (a), calculate:\n(i) the modal score(s);\n(ii) the mean score, correct to one decimal place.",
        "workedSolution": "**(i) Modal score(s):**\nThe highest frequency is $9$, which occurs at two scores: $5$ and $6$.\n$$\\text{Modes} = 5\\text{ and } 6\\text{ marks (bimodal)}$$\n\n---\n\n**(ii) Mean score ($\\bar{x}$):**\n$$\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{189}{32} = 5.90625 \\approx 5.9$$\n\nTherefore, the mean score is **$5.9\\text{ marks}$**."
      },
      {
        "part": "c",
        "marks": 5,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"240\" viewBox=\"0 0 360 240\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"50\" y1=\"190\" x2=\"320\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"50\" y1=\"30\" x2=\"50\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2\"/><rect x=\"70\" y=\"134\" width=\"30\" height=\"56\" fill=\"#0284c7\"/><rect x=\"120\" y=\"64\" width=\"30\" height=\"126\" fill=\"#0284c7\"/><rect x=\"170\" y=\"64\" width=\"30\" height=\"126\" fill=\"#0284c7\"/><rect x=\"220\" y=\"106\" width=\"30\" height=\"84\" fill=\"#0284c7\"/><rect x=\"270\" y=\"134\" width=\"30\" height=\"56\" fill=\"#0284c7\"/><text x=\"80\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">4</text><text x=\"130\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">5</text><text x=\"180\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">6</text><text x=\"230\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">7</text><text x=\"280\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">8</text><text x=\"30\" y=\"138\" font-family=\"sans-serif\" font-size=\"11\">4</text><text x=\"30\" y=\"68\" font-family=\"sans-serif\" font-size=\"11\">9</text><text x=\"160\" y=\"230\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Score</text><text x=\"15\" y=\"25\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Frequency</text></svg>",
        "questionText": "Draw a bar chart to represent the distribution in (a).",
        "workedSolution": "**Bar Chart Drawing Guide:**\n- Horizontal axis represents the test scores ($4, 5, 6, 7, 8$) with equal bar widths and uniform spacing.\n- Vertical axis represents frequency with a calibrated scale from $0$ to $10$ ($2\\text{ cm} = 2\\text{ units}$).\n- Bar heights correspond to frequencies: $4$ (for score $4$), $9$ (for score $5$), $9$ (for score $6$), $6$ (for score $7$), and $4$ (for score $8$).\n\n*(See the embedded SVG above for the complete, well-labeled bar chart)*."
      }
    ]
  },
  {
    "questionNumber": 6,
    "id": "MOCK09_P2_Q06",
    "marks": 15,
    "topic": "Linear Relations, Table of Values, and Coordinate Graphing",
    "subQuestions": [
      {
        "part": "a",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "(i) Copy and complete the table of values for the relations $y_1 = 3x - 2$ and $y_2 = 8 - 2x$ for the domain $-1 \\le x \\le 4$.\n\n| $x$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 3x - 2$ | $-5$ | | $1$ | | $7$ | |\n| $y_2 = 8 - 2x$ | $10$ | | $6$ | | $2$ | |\n\n(ii) Identify the point of intersection of the two lines from your completed table.",
        "workedSolution": "**(i) Completed Table:**\nEvaluate $y_1 = 3x - 2$:\n- $x = 0: y_1 = 3(0) - 2 = -2$\n- $x = 2: y_1 = 3(2) - 2 = 4$\n- $x = 4: y_1 = 3(4) - 2 = 10$\n\nEvaluate $y_2 = 8 - 2x$:\n- $x = 0: y_2 = 8 - 2(0) = 8$\n- $x = 2: y_2 = 8 - 2(2) = 4$\n- $x = 4: y_2 = 8 - 2(4) = 0$\n\n| $x$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 3x - 2$ | $-5$ | **$-2$** | $1$ | **$4$** | $7$ | **$10$** |\n| $y_2 = 8 - 2x$ | $10$ | **$8$** | $6$ | **$4$** | $2$ | **$0$** |\n\n---\n\n**(ii) Point of intersection:**\nAt $x = 2$, both relations give $y = 4$.\nTherefore, the point of intersection is **$(2, 4)$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"380\" viewBox=\"0 0 400 380\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"380\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"gridMK9\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"380\" fill=\"url(#gridMK9)\"/><line x1=\"20\" y1=\"260\" x2=\"380\" y2=\"260\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"140\" y1=\"20\" x2=\"140\" y2=\"360\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"385\" y=\"265\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"145\" y=\"25\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><line x1=\"80\" y1=\"320\" x2=\"320\" y2=\"80\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><text x=\"310\" y=\"70\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">y = 3x - 2</text><line x1=\"80\" y1=\"60\" x2=\"320\" y2=\"260\" stroke=\"#dc2626\" stroke-width=\"2.5\"/><text x=\"300\" y=\"280\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">y = 8 - 2x</text><circle cx=\"220\" cy=\"180\" r=\"4.5\" fill=\"#7c3aed\"/><text x=\"230\" y=\"175\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#7c3aed\">(2, 4)</text></svg>",
        "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on the $x$-axis and $2\\text{ cm}$ to $2\\text{ units}$ on the $y$-axis, draw two perpendicular axes $Ox$ and $Oy$ on a graph sheet for $-2 \\le x \\le 5$ and $-6 \\le y \\le 12$.\nPlot both lines on the same graph sheet and label them clearly.",
        "workedSolution": "**Graph Execution Protocol:**\n1. Calibrate $x$-axis: $2\\text{ cm} = 1\\text{ unit}$ ($-2$ to $5$).\n2. Calibrate $y$-axis: $2\\text{ cm} = 2\\text{ units}$ ($-6$ to $12$).\n3. Plot coordinates for $y_1 = 3x - 2$: $(-1, -5), (0, -2), (1, 1), (2, 4), (3, 7), (4, 10)$ and draw the straight line.\n4. Plot coordinates for $y_2 = 8 - 2x$: $(-1, 10), (0, 8), (1, 6), (2, 4), (3, 2), (4, 0)$ and draw the straight line.\n5. Label both lines and their intersection point $(2, 4)$."
      },
      {
        "part": "c",
        "marks": 3,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your graph, find:\n(i) the gradient of line $y = 8 - 2x$;\n(ii) the value of $x$ when $3x - 2 = 0$.",
        "workedSolution": "**(i) Gradient of line $y = 8 - 2x$:**\n$$m = -2$$\n\n---\n\n**(ii) Value of $x$ when $3x - 2 = 0$ ($x$-intercept):**\n$$3x = 2 \\implies x = \\frac{2}{3} \\approx 0.67$$\nFrom graph reading: **$x \\approx 0.7$ (tolerance $\\pm 0.1$)**."
      }
    ]
  }
];

export const allRawMathMock9TheoryQuestions = rawMathMock9Paper2Questions;

export const SET_BECE_MOCK_9_MATH_P2: CurriculumQuestionSet = {
  id: "math_mock_9_p2",
  title: "BECE Mathematics National Mock 9 (Paper 2 Theory & Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 9 Paper 2",
  variantType: "past_paper_variant",
  totalQuestions: 6,
  version: 1,
  format: 'structured_essay',
  paperType: 2,
  year: 2026,
  era: 'modern',
  isMock: true,
  instructions: "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
  timeAllowed: "1 hour",
  durationMinutes: 60,
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_09/paper_2",
  questions: rawMathMock9Paper2Questions.map((q) => {
    const combinedPrompt = [
      `### Question ${q.questionNumber} (${q.marks} Marks)`,
      `**Topic**: ${q.topic}`,
      `**Instructions**: Show complete, step-by-step working. Marks will be awarded for method (M), accuracy (A), and final statements.`,
      '',
      ...q.subQuestions.map((sq) => {
        let text = `#### Part (${sq.part}) [${sq.marks} Marks]\n${sq.questionText}`;
        if (sq.hasDiagram && sq.svgDiagram) {
          text += `\n\n<div class="my-4 flex justify-center">\n${sq.svgDiagram}\n</div>`;
        }
        return text;
      })
    ].join('\n\n');

    const combinedSolution = q.subQuestions.map((sq) => {
      let sol = `### Part (${sq.part}) Solution [${sq.marks} Marks]\n${sq.workedSolution}`;
      if (sq.hasDiagram && sq.svgDiagram) {
        sol += `\n\n<div class="my-3 flex justify-center">\n${sq.svgDiagram}\n</div>`;
      }
      return sol;
    }).join('\n\n---\n\n');

    return {
      id: `math_m9_p2_q${q.questionNumber}`,
      number: q.questionNumber,
      questionNumber: q.questionNumber,
      prompt: combinedPrompt,
      points: q.marks,
      topic: q.topic,
      section: 'theory',
      format: 'structured_essay',
      modelAnswer: combinedSolution,
      workedSolution: combinedSolution,
      markingRubric: q.subQuestions.map((sq) => ({
        part: sq.part,
        maxMarks: sq.marks,
        criteria: `Full method (M) and accuracy (A) marks for sub-question (${sq.part}). Award method marks for relevant mathematical formulations, accuracy marks for arithmetic correctness, and final answer (B/A) with proper units.`
      })),
      parts: q.subQuestions.map((sq) => ({
        partId: `${q.id}_${sq.part}`,
        partLabel: `(${sq.part})`,
        marks: sq.marks,
        points: sq.marks,
        prompt: sq.questionText,
        hasDiagram: sq.hasDiagram,
        diagramSvg: sq.svgDiagram || undefined,
        svgDiagram: sq.svgDiagram || undefined,
        modelAnswer: sq.workedSolution,
        workedSolution: sq.workedSolution
      }))
    };
  })
};

// Complete Unified Simulation
export const SET_BECE_MOCK_9_MATH_COMPLETE = {
  mockExamNumber: 9,
  subject: "Mathematics",
  examType: "BECE Mathematics National Standard Mock 9",
  academicYear: 2026,
  paper1: SET_BECE_MOCK_9_MATH_P1,
  paper2: SET_BECE_MOCK_9_MATH_P2,
  totalMarks: 100,
  unifiedTimeMinutes: 120
};
