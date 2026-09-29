import { CurriculumQuestionSet } from '../types';
import { MathMockObjectiveQuestion } from './bece-math-mock-1';

export const allRawMathMock6Questions: MathMockObjectiveQuestion[] = [
  {
    "number": 1,
    "id": "MOCK06_P1_Q01",
    "prompt": "If $P = \\{x : 10 < x < 25, x \\text{ is a multiple of } 3\\}$ and $Q = \\{x : 10 < x < 25, x \\text{ is an even number}\\}$, find $P \\cap Q$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\{12, 18, 24\\}$",
      "B. $\\{12, 18\\}$",
      "C. $\\{18, 24\\}$",
      "D. $\\{12, 15, 18, 21, 24\\}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Sets and Operations on Sets principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "List the elements of both sets within the strictly bounded interval $(10, 25)$:\n$$P = \\{12, 15, 18, 21, 24\\}$$\n$$Q = \\{12, 14, 16, 18, 20, 22, 24\\}$$\nFind common elements:\n$$P \\cap Q = \\{12, 18, 24\\}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Sets and Operations on Sets"
  },
  {
    "number": 2,
    "id": "MOCK06_P1_Q02",
    "prompt": "Simplify the surd expression: $\\sqrt{32} + \\sqrt{50} - \\sqrt{18}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $5\\sqrt{2}$",
      "B. $6\\sqrt{2}$",
      "C. $7\\sqrt{2}$",
      "D. $8\\sqrt{2}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Real Number System and Surds principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Simplify each term by factoring out perfect squares:\n$$\\sqrt{32} = \\sqrt{16 \\times 2} = 4\\sqrt{2}$$\n$$\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}$$\n$$\\sqrt{18} = \\sqrt{9 \\times 2} = 3\\sqrt{2}$$\nCombine like terms:\n$$4\\sqrt{2} + 5\\sqrt{2} - 3\\sqrt{2} = (4 + 5 - 3)\\sqrt{2} = 6\\sqrt{2}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Real Number System and Surds"
  },
  {
    "number": 3,
    "id": "MOCK06_P1_Q03",
    "prompt": "Round $0.05749$ correct to three decimal places.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $0.0575$",
      "B. $0.058$",
      "C. $0.060$",
      "D. $0.057$"
    ],
    "correctAnswer": "D",
    "hint": "Review Approximation and Estimation principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Look at the fourth digit after the decimal point ($4$). Since $4 < 5$, round down:\n$$0.05749 \\approx 0.057$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Approximation and Estimation"
  },
  {
    "number": 4,
    "id": "MOCK06_P1_Q04",
    "prompt": "The diagram shows a circle with centre $O$. Tangent line $TP$ touches the circle at $T$, and secant line $OP$ passes through the centre. If radius $OT = 5\\text{ cm}$ and $OP = 13\\text{ cm}$, calculate the length of tangent segment $TP$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"200\" viewBox=\"0 0 280 200\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"80\" cy=\"100\" r=\"60\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"80\" y1=\"100\" x2=\"240\" y2=\"100\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"80\" y1=\"100\" x2=\"116\" y2=\"52\" stroke=\"#0284c7\" stroke-width=\"2\"/><line x1=\"116\" y1=\"52\" x2=\"240\" y2=\"100\" stroke=\"#dc2626\" stroke-width=\"2.5\"/><circle cx=\"80\" cy=\"100\" r=\"3.5\" fill=\"#0f172a\"/><circle cx=\"116\" cy=\"52\" r=\"3.5\" fill=\"#0284c7\"/><polyline points=\"110,60 118,66 124,58\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.2\"/><text x=\"65\" y=\"115\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">O</text><text x=\"110\" y=\"42\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0284c7\">T</text><text x=\"245\" y=\"105\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">P</text><text x=\"80\" y=\"70\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">5 cm</text><text x=\"150\" y=\"115\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">13 cm</text></svg>",
    "options": [
      "A. $8\\text{ cm}$",
      "B. $10\\text{ cm}$",
      "C. $11\\text{ cm}$",
      "D. $12\\text{ cm}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Circle Theorems and Tangents principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "A tangent to a circle is perpendicular to the radius at the point of contact, making $\\triangle OTP$ right-angled at $T$:\n$$|OT|^2 + |TP|^2 = |OP|^2$$\n$$5^2 + |TP|^2 = 13^2$$\n$$25 + |TP|^2 = 169$$\n$$|TP|^2 = 169 - 25 = 144 \\implies |TP| = 12\\text{ cm}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Circle Theorems and Tangents"
  },
  {
    "number": 5,
    "id": "MOCK06_P1_Q05",
    "prompt": "Solve for $y$ in the linear equation: $3(2y - 5) - 4(y - 2) = 5$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $4$",
      "B. $5$",
      "C. $6$",
      "D. $7$"
    ],
    "correctAnswer": "C",
    "hint": "Review Linear Equations principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Expand brackets:\n$$6y - 15 - 4y + 8 = 5$$\n$$2y - 7 = 5$$\n$$2y = 12 \\implies y = 6$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Linear Equations"
  },
  {
    "number": 6,
    "id": "MOCK06_P1_Q06",
    "prompt": "Find the simple interest on $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,800.00$ invested for $1\\text{ year } 9\\text{ months}$ at $5\\%$ per annum.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 360.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 420.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 450.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 480.00$"
    ],
    "correctAnswer": "B",
    "hint": "Review Commercial Arithmetic: Simple Interest principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$T = 1\\text{ year } + \\frac{9}{12}\\text{ year} = 1.75\\text{ years} = \\frac{7}{4}\\text{ years}$$\n$$I = \\frac{P \\times R \\times T}{100} = \\frac{4,800 \\times 5 \\times \\frac{7}{4}}{100} = 48 \\times 5 \\times \\frac{7}{4} = 12 \\times 35 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 420.00$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Simple Interest"
  },
  {
    "number": 7,
    "id": "MOCK06_P1_Q07",
    "prompt": "The diagram shows a trapezium $ABCD$ with parallel sides $|AB| = 14\\text{ cm}, |DC| = 8\\text{ cm},$ and perpendicular height $h = 6\\text{ cm}$. Find the area of the trapezium.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"300\" height=\"180\" viewBox=\"0 0 300 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 240,140 190,40 70,40\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"70\" y1=\"40\" x2=\"70\" y2=\"140\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><polyline points=\"70,125 85,125 85,140\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.2\"/><text x=\"125\" y=\"30\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">8 cm</text><text x=\"130\" y=\"160\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">14 cm</text><text x=\"45\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">6 cm</text><text x=\"30\" y=\"150\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"245\" y=\"150\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"195\" y=\"35\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"60\" y=\"35\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">D</text></svg>",
    "options": [
      "A. $60\\text{ cm}^2$",
      "B. $66\\text{ cm}^2$",
      "C. $72\\text{ cm}^2$",
      "D. $84\\text{ cm}^2$"
    ],
    "correctAnswer": "B",
    "hint": "Review Mensuration: Trapezium Area principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Area} = \\frac{1}{2}(a + b)h = \\frac{1}{2}(14 + 8) \\times 6 = \\frac{1}{2}(22) \\times 6 = 11 \\times 6 = 66\\text{ cm}^2$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Mensuration: Trapezium Area"
  },
  {
    "number": 8,
    "id": "MOCK06_P1_Q08",
    "prompt": "Factorize completely: $5ab - 10b + 3a - 6$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(a - 3)(5b + 2)$",
      "B. $(a + 2)(5b - 3)$",
      "C. $(5a - 2)(b + 3)$",
      "D. $(a - 2)(5b + 3)$"
    ],
    "correctAnswer": "D",
    "hint": "Review Algebraic Factorization principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Group terms pairwise:\n$$5ab - 10b + 3a - 6 = 5b(a - 2) + 3(a - 2) = (a - 2)(5b + 3)$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Algebraic Factorization"
  },
  {
    "number": 9,
    "id": "MOCK06_P1_Q09",
    "prompt": "Solve the linear inequality: $\\frac{4 - 3x}{2} < 5$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $x > -2$",
      "B. $x < -2$",
      "C. $x > 2$",
      "D. $x < 2$"
    ],
    "correctAnswer": "A",
    "hint": "Review Linear Inequalities principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Multiply both sides by $2$:\n$$4 - 3x < 10$$\n$$-3x < 6$$\nDivide by $-3$ and reverse the inequality symbol:\n$$x > \\frac{6}{-3} \\implies x > -2$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 10,
    "id": "MOCK06_P1_Q10",
    "prompt": "A map is drawn to a scale of $1 : 25,000$. A forest reserve on the map has an area of $8\\text{ cm}^2$. Find the actual area of the reserve on the ground in square kilometres.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $5.0\\text{ km}^2$",
      "B. $1.0\\text{ km}^2$",
      "C. $2.0\\text{ km}^2$",
      "D. $0.5\\text{ km}^2$"
    ],
    "correctAnswer": "D",
    "hint": "Review Scale and Area Ratios principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Linear scale factor: $1\\text{ cm} = 25,000\\text{ cm} = 250\\text{ m} = 0.25\\text{ km}$.\nArea scale factor:\n$$1\\text{ cm}^2 = (0.25\\text{ km})^2 = 0.0625\\text{ km}^2$$\n$$\\text{Actual area} = 8 \\times 0.0625 = 0.5\\text{ km}^2$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Scale and Area Ratios"
  },
  {
    "number": 11,
    "id": "MOCK06_P1_Q11",
    "prompt": "The diagram shows an angle formed by two intersecting secant lines from an external point $P$. Calculate the size of angle marked $x$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"180\" viewBox=\"0 0 280 180\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"170\" cy=\"90\" r=\"65\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"20\" y1=\"90\" x2=\"235\" y2=\"90\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"20\" y1=\"90\" x2=\"216\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><circle cx=\"20\" cy=\"90\" r=\"3.5\" fill=\"#0f172a\"/><path d=\"M 50 90 A 30 30 0 0 1 48 80\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"15\" y=\"110\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">P</text><text x=\"55\" y=\"85\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">x</text><text x=\"165\" y=\"35\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">Arc = 80°</text><text x=\"110\" y=\"110\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">Arc = 20°</text></svg>",
    "options": [
      "A. $20^\\circ$",
      "B. $30^\\circ$",
      "C. $40^\\circ$",
      "D. $50^\\circ$"
    ],
    "correctAnswer": "B",
    "hint": "Review Circle Theorems: Intercepted Arcs principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "The angle formed by two secants intersecting outside a circle equals half the difference of the intercepted arcs:\n$$x = \\frac{1}{2}(\\text{Far Arc} - \\text{Near Arc}) = \\frac{1}{2}(80^\\circ - 20^\\circ) = \\frac{1}{2}(60^\\circ) = 30^\\circ$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Circle Theorems: Intercepted Arcs"
  },
  {
    "number": 12,
    "id": "MOCK06_P1_Q12",
    "prompt": "In a bag containing $24\\text{ marbles}$, some are blue and the rest are green. If the probability of choosing a blue marble at random is $\\frac{3}{8}$, how many green marbles are in the bag?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $9$",
      "B. $12$",
      "C. $18$",
      "D. $15$"
    ],
    "correctAnswer": "D",
    "hint": "Review Probability principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Blue marbles} = \\frac{3}{8} \\times 24 = 9$$\n$$\\text{Green marbles} = 24 - 9 = 15$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 13,
    "id": "MOCK06_P1_Q13",
    "prompt": "The image of point $R(6, -2)$ under reflection in the line $y = -x$ is:",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(2, -6)$",
      "B. $(-2, 6)$",
      "C. $(-6, 2)$",
      "D. $(2, 6)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Transformational Geometry: Reflection principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "The rule for reflection in the line $y = -x$ is $(x, y) \\to (-y, -x)$:\n$$R(6, -2) \\to R'(-(-2), -6) = (2, -6)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Reflection"
  },
  {
    "number": 14,
    "id": "MOCK06_P1_Q14",
    "prompt": "Express $7^4 \\times 49^{-1} \\div 343^0$ in simplest index form.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $7^1$",
      "B. $7^2$",
      "C. $7^3$",
      "D. $7^5$"
    ],
    "correctAnswer": "B",
    "hint": "Review Indices and Exponents principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Write all factors as powers of $7$:\n$$49^{-1} = (7^2)^{-1} = 7^{-2}$$\n$$343^0 = 1 = 7^0$$\n$$7^4 \\times 7^{-2} \\div 7^0 = 7^{4 + (-2) - 0} = 7^2$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Indices and Exponents"
  },
  {
    "number": 15,
    "id": "MOCK06_P1_Q15",
    "prompt": "Make $x$ the subject of the formula: $y = \\sqrt{\\frac{3x - 5}{2}}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $x = \\frac{2y^2 + 5}{3}$",
      "B. $x = \\frac{2y^2 - 5}{3}$",
      "C. $x = \\frac{2y + 5}{3}$",
      "D. $x = \\frac{4y^2 + 5}{3}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Change of Subject principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Square both sides:\n$$y^2 = \\frac{3x - 5}{2}$$\n$$2y^2 = 3x - 5$$\n$$3x = 2y^2 + 5 \\implies x = \\frac{2y^2 + 5}{3}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Change of Subject"
  },
  {
    "number": 16,
    "id": "MOCK06_P1_Q16",
    "prompt": "The diagram shows a line $AB$ on Cartesian axes. Find the coordinates of its $x$-intercept.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"200\" viewBox=\"0 0 240 200\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"140\" x2=\"220\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"120\" y1=\"20\" x2=\"120\" y2=\"180\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"40\" y1=\"180\" x2=\"200\" y2=\"40\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"120\" cy=\"110\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"154\" cy=\"80\" r=\"3.5\" fill=\"#0284c7\"/><circle cx=\"86\" cy=\"140\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"128\" y=\"115\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">(0, 2)</text><text x=\"60\" y=\"155\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">(-4, 0)</text><text x=\"205\" y=\"45\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">AB</text></svg>",
    "options": [
      "A. $(0, 2)$",
      "B. $(-4, 0)$",
      "C. $(2, 0)$",
      "D. $(0, -4)$"
    ],
    "correctAnswer": "B",
    "hint": "Review Coordinate Geometry: Intercepts principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "The $x$-intercept is the coordinate point where the line crosses the horizontal $x$-axis, meaning $y = 0$. From the diagram, the crossing point is $(-4, 0)$.\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Intercepts"
  },
  {
    "number": 17,
    "id": "MOCK06_P1_Q17",
    "prompt": "The mean of the numbers $4, 7, 9, x, 14,$ and $18$ is $11$. Find the value of $x$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $12$",
      "B. $13$",
      "C. $14$",
      "D. $15$"
    ],
    "correctAnswer": "C",
    "hint": "Review Statistics: Mean principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\sum x = 6 \\times 11 = 66$$\n$$4 + 7 + 9 + x + 14 + 18 = 66$$\n$$52 + x = 66 \\implies x = 66 - 52 = 14$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics: Mean"
  },
  {
    "number": 18,
    "id": "MOCK06_P1_Q18",
    "prompt": "Find the length of the hypotenuse of a right-angled triangle whose other two sides measure $7\\text{ cm}$ and $24\\text{ cm}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $25\\text{ cm}$",
      "B. $26\\text{ cm}$",
      "C. $28\\text{ cm}$",
      "D. $31\\text{ cm}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Pythagoras' Theorem principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "By Pythagoras' Theorem:\n$$h = \\sqrt{7^2 + 24^2} = \\sqrt{49 + 576} = \\sqrt{625} = 25\\text{ cm}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Pythagoras' Theorem"
  },
  {
    "number": 19,
    "id": "MOCK06_P1_Q19",
    "prompt": "The bearing of town $K$ from town $M$ is $080^\\circ$. What is the bearing of town $M$ from town $K$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $100^\\circ$",
      "B. $180^\\circ$",
      "C. $260^\\circ$",
      "D. $280^\\circ$"
    ],
    "correctAnswer": "C",
    "hint": "Review Bearings principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Since forward bearing $\\theta = 080^\\circ < 180^\\circ$, add $180^\\circ$:\n$$\\text{Back bearing} = 080^\\circ + 180^\\circ = 260^\\circ$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Bearings"
  },
  {
    "number": 20,
    "id": "MOCK06_P1_Q20",
    "prompt": "A cyclist travels $45\\text{ km}$ in $1\\text{ hour } 30\\text{ minutes}$. Calculate his average speed in metres per second ($\text{m/s}$).",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $15.00\\text{ m/s}$",
      "B. $10.00\\text{ m/s}$",
      "C. $12.50\\text{ m/s}$",
      "D. $8.33\\text{ m/s}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Speed and Unit Conversions principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Speed in km/h} = \\frac{45}{1.5} = 30\\text{ km/h}$$\nConvert to $\\text{m/s}$ (multiply by $\\frac{5}{18}$):\n$$30 \\times \\frac{5}{18} = \\frac{150}{18} = 8.333\\dots\\text{ m/s} = 8.33\\text{ m/s}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Speed and Unit Conversions"
  },
  {
    "number": 21,
    "id": "MOCK06_P1_Q21",
    "prompt": "If $\\mathbf{p} = \\begin{pmatrix} -3 \\\\ 5 \\end{pmatrix}$ and $\\mathbf{q} = \\begin{pmatrix} 2 \\\\ -4 \\end{pmatrix}$, find $2\\mathbf{p} + 3\\mathbf{q}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\begin{pmatrix} 0 \\\\ -2 \\end{pmatrix}$",
      "B. $\\begin{pmatrix} 0 \\\\ 2 \\end{pmatrix}$",
      "C. $\\begin{pmatrix} -1 \\\\ 1 \\end{pmatrix}$",
      "D. $\\begin{pmatrix} -12 \\\\ 22 \\end{pmatrix}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Vectors: Column Addition principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$2\\mathbf{p} + 3\\mathbf{q} = 2\\begin{pmatrix} -3 \\\\ 5 \\end{pmatrix} + 3\\begin{pmatrix} 2 \\\\ -4 \\end{pmatrix} = \\begin{pmatrix} -6 \\\\ 10 \\end{pmatrix} + \\begin{pmatrix} 6 \\\\ -12 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ -2 \\end{pmatrix}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Vectors: Column Addition"
  },
  {
    "number": 22,
    "id": "MOCK06_P1_Q22",
    "prompt": "The diagram shows a regular octagon. Find the size of one of its exterior angles.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"220\" viewBox=\"0 0 220 220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"80,30 140,30 190,80 190,140 140,190 80,190 30,140 30,80\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"140\" y1=\"190\" x2=\"220\" y2=\"190\" stroke=\"#64748b\" stroke-width=\"1.8\" stroke-dasharray=\"4\"/><path d=\"M 160 190 A 20 20 0 0 0 175 175\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"2\"/><text x=\"180\" y=\"185\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">θ</text></svg>",
    "options": [
      "A. $36^\\circ$",
      "B. $40^\\circ$",
      "C. $60^\\circ$",
      "D. $45^\\circ$"
    ],
    "correctAnswer": "D",
    "hint": "Review Polygons and Exterior Angles principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Sum of exterior angles of any convex polygon is $360^\\circ$:\n$$\\text{Exterior angle } \\theta = \\frac{360^\\circ}{n} = \\frac{360^\\circ}{8} = 45^\\circ$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Polygons and Exterior Angles"
  },
  {
    "number": 23,
    "id": "MOCK06_P1_Q23",
    "prompt": "Find the value of $k$ if $27^k = \\frac{1}{9}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $-\\frac{3}{2}$",
      "B. $-\\frac{2}{3}$",
      "C. $\\frac{2}{3}$",
      "D. $\\frac{3}{2}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Indices and Exponents principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Express both sides as powers of base $3$:\n$$27^k = (3^3)^k = 3^{3k}$$\n$$\\frac{1}{9} = 3^{-2}$$\n$$3^{3k} = 3^{-2} \\implies 3k = -2 \\implies k = -\\frac{2}{3}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Indices and Exponents"
  },
  {
    "number": 24,
    "id": "MOCK06_P1_Q24",
    "prompt": "A solid sphere of radius $3\\text{ cm}$ is melted down and recast into smaller solid spheres each of radius $1\\text{ cm}$. How many smaller spheres are produced?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $9$",
      "B. $27$",
      "C. $18$",
      "D. $36$"
    ],
    "correctAnswer": "B",
    "hint": "Review Solid Geometry: Volume Ratios principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Number of spheres} = \\frac{\\frac{4}{3}\\pi R^3}{\\frac{4}{3}\\pi r^3} = \\left(\\frac{R}{r}\\right)^3 = \\left(\\frac{3}{1}\\right)^3 = 27$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Solid Geometry: Volume Ratios"
  },
  {
    "number": 25,
    "id": "MOCK06_P1_Q25",
    "prompt": "The diagram shows a sector with radius $10\\text{ cm}$ and arc length $15.7\\text{ cm}$. Find the angle $\\theta$ subtended at the centre. $\\left[\\text{Take } \\pi = 3.14\\right]$",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"180\" viewBox=\"0 0 240 180\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M 40 140 L 160 140 A 120 120 0 0 0 125 45 Z\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"40\" cy=\"140\" r=\"3.5\" fill=\"#0f172a\"/><path d=\"M 70 140 A 30 30 0 0 0 62 115\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"72\" y=\"130\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">θ</text><text x=\"90\" y=\"155\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">10 cm</text><text x=\"150\" y=\"85\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Arc = 15.7 cm</text></svg>",
    "options": [
      "A. $60^\\circ$",
      "B. $75^\\circ$",
      "C. $90^\\circ$",
      "D. $120^\\circ$"
    ],
    "correctAnswer": "C",
    "hint": "Review Mensuration: Arc Length principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Arc length} = \\frac{\\theta}{360^\\circ} \\times 2\\pi r$$\n$$15.7 = \\frac{\\theta}{360^\\circ} \\times 2(3.14)(10) = \\frac{\\theta}{360^\\circ} \\times 62.8$$\n$$\\frac{\\theta}{360^\\circ} = \\frac{15.7}{62.8} = \\frac{1}{4}$$\n$$\\theta = \\frac{1}{4} \\times 360^\\circ = 90^\\circ$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Arc Length"
  },
  {
    "number": 26,
    "id": "MOCK06_P1_Q26",
    "prompt": "The coordinates of the endpoints of diameter $AB$ of a circle are $A(-5, 2)$ and $B(3, 8)$. Find the coordinates of the centre of the circle.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(-1, 5)$",
      "B. $(-2, 6)$",
      "C. $(1, 5)$",
      "D. $(-1, 6)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Coordinate Geometry: Midpoint principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "The centre is the midpoint of the diameter $AB$:\n$$M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right) = \\left(\\frac{-5 + 3}{2}, \\frac{2 + 8}{2}\\right) = \\left(\\frac{-2}{2}, \\frac{10}{2}\\right) = (-1, 5)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Midpoint"
  },
  {
    "number": 27,
    "id": "MOCK06_P1_Q27",
    "prompt": "How many faces has a hexagonal prism?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6$",
      "B. $7$",
      "C. $8$",
      "D. $12$"
    ],
    "correctAnswer": "C",
    "hint": "Review Solid Geometry principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "A hexagonal prism consists of $2$ parallel hexagonal bases and $6$ rectangular lateral faces:\n$$\\text{Total faces} = 2 + 6 = 8$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Solid Geometry"
  },
  {
    "number": 28,
    "id": "MOCK06_P1_Q28",
    "prompt": "Express $240\\text{ metres}$ as a fraction of $1.5\\text{ kilometres}$ in simplest terms.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{4}{25}$",
      "B. $\\frac{3}{20}$",
      "C. $\\frac{8}{50}$",
      "D. $\\frac{1}{6}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Fractions and Units of Measure principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Convert kilometres to metres:\n$$1.5\\text{ km} = 1.5 \\times 1,000 = 1,500\\text{ m}$$\n$$\\text{Fraction} = \\frac{240}{1,500} = \\frac{24}{150} = \\frac{4}{25}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Fractions and Units of Measure"
  },
  {
    "number": 29,
    "id": "MOCK06_P1_Q29",
    "prompt": "The diagram shows a ladder $KL$ leaning against a vertical wall. Find the value of $\\cos(\\angle KLM)$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"180\" viewBox=\"0 0 260 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 200,140 200,30\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"185,140 185,125 200,125\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"30\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">K</text><text x=\"205\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">M</text><text x=\"205\" y=\"25\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">L</text><text x=\"110\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">12 m</text><text x=\"215\" y=\"85\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">5 m</text><text x=\"110\" y=\"75\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">13 m</text></svg>",
    "options": [
      "A. $\\frac{5}{13}$",
      "B. $\\frac{12}{13}$",
      "C. $\\frac{5}{12}$",
      "D. $\\frac{13}{5}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Trigonometry principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "From vertex $L$ in right-angled $\\triangle KLM$:\n$$\\text{Adjacent side} = |LM| = 5\\text{ m}$$\n$$\\text{Hypotenuse} = |KL| = 13\\text{ m}$$\n$$\\cos(\\angle KLM) = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}} = \\frac{5}{13}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Trigonometry"
  },
  {
    "number": 30,
    "id": "MOCK06_P1_Q30",
    "prompt": "A trader bought a refrigerator for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,000.00$ and sold it at a loss of $8\\%$. Find the selling price.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,960.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,860.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,920.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,840.00$"
    ],
    "correctAnswer": "D",
    "hint": "Review Commercial Arithmetic: Loss principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Loss} = \\frac{8}{100} \\times 2,000 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 160.00$$\n$$\\text{Selling Price} = 2,000.00 - 160.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,840.00$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Loss"
  },
  {
    "number": 31,
    "id": "MOCK06_P1_Q31",
    "prompt": "Find the rule governing the mapping below:\n$$\\begin{array}{cccccc} x & 1 & 2 & 3 & 4 & 5 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 7 & 12 & 17 & 22 & 27 \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $y = 5x + 2$",
      "B. $y = 5x - 2$",
      "C. $y = 6x + 1$",
      "D. $y = 4x + 3$"
    ],
    "correctAnswer": "A",
    "hint": "Review Relations and Mappings principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Common difference in $y$: $12 - 7 = 5$, so $m = 5$.\nForm $y = 5x + c$. For $x = 1$:\n$$7 = 5(1) + c \\implies c = 2$$\n$$y = 5x + 2$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Relations and Mappings"
  },
  {
    "number": 32,
    "id": "MOCK06_P1_Q32",
    "prompt": "Which of the following describes an obtuse angle?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. An angle equal to $90^\\circ$",
      "B. An angle strictly between $0^\\circ$ and $90^\\circ$",
      "C. An angle strictly between $90^\\circ$ and $180^\\circ$",
      "D. An angle strictly between $180^\\circ$ and $360^\\circ$"
    ],
    "correctAnswer": "C",
    "hint": "Review Geometric Concepts: Types of Angles principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "An obtuse angle has a measure strictly greater than $90^\\circ$ but strictly less than $180^\\circ$.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Geometric Concepts: Types of Angles"
  },
  {
    "number": 33,
    "id": "MOCK06_P1_Q33",
    "prompt": "Solve the inequality: $7x - 3(2x + 1) \\le 8$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $x \\le 5$",
      "B. $x \\ge 5$",
      "C. $x \\le 11$",
      "D. $x \\ge 11$"
    ],
    "correctAnswer": "C",
    "hint": "Review Linear Inequalities principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Expand and simplify:\n$$7x - 6x - 3 \\le 8$$\n$$x - 3 \\le 8$$\n$$x \\le 8 + 3 \\implies x \\le 11$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 34,
    "id": "MOCK06_P1_Q34",
    "prompt": "Convert $101101_2$ to a base ten numeral.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $37$",
      "B. $41$",
      "C. $49$",
      "D. $45$"
    ],
    "correctAnswer": "D",
    "hint": "Review Number Bases principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$101101_2 = (1 \\times 2^5) + (0 \\times 2^4) + (1 \\times 2^3) + (1 \\times 2^2) + (0 \\times 2^1) + (1 \\times 2^0)$$\n$$= 32 + 0 + 8 + 4 + 0 + 1 = 45_{10}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Number Bases"
  },
  {
    "number": 35,
    "id": "MOCK06_P1_Q35",
    "prompt": "The diagram shows a frequency table of marks scored in a test. What percentage of candidates scored $4\\text{ marks}$ or more?\n\n$$\\begin{array}{|l|c|c|c|c|c|} \\hline \\textbf{Mark} & 1 & 2 & 3 & 4 & 5 \\\\ \\hline \\textbf{Frequency} & 3 & 5 & 8 & 9 & 5 \\\\ \\hline \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $30\\%$",
      "B. $42\\%$",
      "C. $46\\frac{2}{3}\\%$",
      "D. $50\\%$"
    ],
    "correctAnswer": "C",
    "hint": "Review Statistics and Percentages principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Total candidates} = 3 + 5 + 8 + 9 + 5 = 30$$\n$$\\text{Scoring 4 or 5} = 9 + 5 = 14$$\n$$\\text{Percentage} = \\left(\\frac{14}{30}\\right) \\times 100\\% = \\frac{140}{3}\\% = 46\\frac{2}{3}\\%$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics and Percentages"
  },
  {
    "number": 36,
    "id": "MOCK06_P1_Q36",
    "prompt": "A rectangular tank of base dimensions $3\\text{ m} \\times 2\\text{ m}$ is filled with water to a depth of $1.5\\text{ m}$. Find the mass of the water in tonnes. $[\\text{Take density of water } = 1,000\\text{ kg/m}^3, 1\\text{ tonne} = 1,000\\text{ kg}]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6\\text{ tonnes}$",
      "B. $7.5\\text{ tonnes}$",
      "C. $9\\text{ tonnes}$",
      "D. $12\\text{ tonnes}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Mensuration: Volume and Mass principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Volume} = 3 \\times 2 \\times 1.5 = 9\\text{ m}^3$$\n$$\\text{Mass} = 9\\text{ m}^3 \\times 1,000\\text{ kg/m}^3 = 9,000\\text{ kg} = 9\\text{ tonnes}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Volume and Mass"
  },
  {
    "number": 37,
    "id": "MOCK06_P1_Q37",
    "prompt": "If the perimeter of a rectangle is $50\\text{ cm}$ and its length is $15\\text{ cm}$, find its area.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $120\\text{ cm}^2$",
      "B. $135\\text{ cm}^2$",
      "C. $140\\text{ cm}^2$",
      "D. $150\\text{ cm}^2$"
    ],
    "correctAnswer": "D",
    "hint": "Review Mensuration: Area of Rectangle principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$2(l + w) = 50 \\implies 15 + w = 25 \\implies w = 10\\text{ cm}$$\n$$\\text{Area} = l \\times w = 15 \\times 10 = 150\\text{ cm}^2$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Area of Rectangle"
  },
  {
    "number": 38,
    "id": "MOCK06_P1_Q38",
    "prompt": "The diagram shows a circle of radius $10\\text{ cm}$ with two perpendicular radii forming a quadrant. Find the area of the shaded quadrant in terms of $\\pi$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"220\" viewBox=\"0 0 220 220\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"110\" cy=\"110\" r=\"80\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><path d=\"M 110 110 L 190 110 A 80 80 0 0 0 110 30 Z\" fill=\"#10b981\" fill-opacity=\"0.35\" stroke=\"#059669\" stroke-width=\"2\"/><line x1=\"110\" y1=\"110\" x2=\"190\" y2=\"110\" stroke=\"#059669\" stroke-width=\"2\"/><line x1=\"110\" y1=\"110\" x2=\"110\" y2=\"30\" stroke=\"#059669\" stroke-width=\"2\"/><polyline points=\"110,95 125,95 125,110\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><circle cx=\"110\" cy=\"110\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"95\" y=\"125\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">O</text><text x=\"140\" y=\"125\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">10 cm</text></svg>",
    "options": [
      "A. $15\\pi\\text{ cm}^2$",
      "B. $20\\pi\\text{ cm}^2$",
      "C. $25\\pi\\text{ cm}^2$",
      "D. $50\\pi\\text{ cm}^2$"
    ],
    "correctAnswer": "C",
    "hint": "Review Mensuration: Quadrant Area principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Area of quadrant} = \\frac{1}{4}\\pi r^2 = \\frac{1}{4}\\pi(10^2) = \\frac{100\\pi}{4} = 25\\pi\\text{ cm}^2$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Quadrant Area"
  },
  {
    "number": 39,
    "id": "MOCK06_P1_Q39",
    "prompt": "Find the median of the following set of observations: $19, 13, 27, 31, 15, 22, 18$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $18$",
      "B. $19$",
      "C. $20$",
      "D. $22$"
    ],
    "correctAnswer": "B",
    "hint": "Review Statistics: Median principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Arrange the $7$ values in ascending order:\n$$13, 15, 18, \\mathbf{19}, 22, 27, 31$$\nThe middle (4th) value is $19$.\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Statistics: Median"
  },
  {
    "number": 40,
    "id": "MOCK06_P1_Q40",
    "prompt": "A fair six-sided die is tossed once. What is the probability of rolling a multiple of $3$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{1}{6}$",
      "B. $\\frac{1}{3}$",
      "C. $\\frac{1}{2}$",
      "D. $\\frac{2}{3}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Probability principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Multiples of $3$ on a die are $\\{3, 6\\} \\implies n(E) = 2$.\n$$P = \\frac{2}{6} = \\frac{1}{3}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Probability"
  }
];

export const SET_BECE_MOCK_6_MATH_P1: CurriculumQuestionSet = {
  id: "math_mock_6_p1",
  title: "BECE Mathematics National Mock 6 (Paper 1 Objective)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 6 Paper 1",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_06/paper_1",
  questions: allRawMathMock6Questions.map((q) => ({
    id: `math_m6_q${q.number}`,
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
    hasDiagram: q.hasDiagram || false,
    diagramSvg: q.svgDiagram || undefined,
    svgDiagram: q.svgDiagram || undefined
  }))
};

export const rawMathMock6Paper2Questions = [
  {
    "questionNumber": 1,
    "id": "MOCK06_P2_Q01",
    "marks": 15,
    "topic": "Sets, Linear Inequalities, and Vector Column Operations",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"380\" height=\"240\" viewBox=\"0 0 380 240\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"10\" width=\"360\" height=\"220\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"35\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 80</text><circle cx=\"145\" cy=\"125\" r=\"72\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"235\" cy=\"125\" r=\"72\" fill=\"#10b981\" fill-opacity=\"0.2\" stroke=\"#059669\" stroke-width=\"2\"/><text x=\"105\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">A (Apples)</text><text x=\"240\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#047857\">B (Bananas)</text><text x=\"105\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">33</text><text x=\"182\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">15</text><text x=\"255\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">23</text><text x=\"315\" y=\"205\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">9</text></svg>",
        "questionText": "In a survey of $80\\text{ market traders}$, $48$ sell Apples ($A$), $38$ sell Bananas ($B$), and $15$ sell both fruits. The remaining traders sell neither of the two fruits.\n(i) Illustrate the information on a Venn diagram.\n(ii) Find the number of traders who sell:\n    $(\\alpha)$ Apples only;\n    $(\\beta)$ exactly one kind of fruit;\n    $(\\gamma)$ neither Apples nor Bananas.",
        "workedSolution": "**(i) Venn Diagram Representation:**\nUniversal set $n(U) = 80$.\n- Selling Apples: $n(A) = 48$\n- Selling Bananas: $n(B) = 38$\n- Selling both fruits: $n(A \\cap B) = 15$\n\nRegion Breakdown:\n- Apples only: $n(A \\cap B') = 48 - 15 = 33$\n- Bananas only: $n(A' \\cap B) = 38 - 15 = 23$\n- Both fruits: $n(A \\cap B) = 15$\n- Neither fruit: $n(A \\cup B)' = 80 - (33 + 15 + 23) = 80 - 71 = 9$\n\n*(See the embedded SVG above for the complete, labeled illustration)*.\n\n---\n\n**(ii) ($a$) Traders selling Apples only:**\n$$n(A \\cap B') = 48 - 15 = 33$$\nTherefore, **$33\\text{ traders}$ sell Apples only**.\n\n---\n\n**(ii) ($\\beta$) Traders selling exactly one kind of fruit:**\n$$\\text{Exactly one} = n(A \\cap B') + n(A' \\cap B) = 33 + 23 = 56$$\nTherefore, **$56\\text{ traders}$ sell exactly one kind of fruit**.\n\n---\n\n**(ii) ($\\gamma$) Traders selling neither fruit:**\n$$n(A \\cup B)' = 80 - 71 = 9$$\nTherefore, **$9\\text{ traders}$ sell neither Apples nor Bananas**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"80\" viewBox=\"0 0 360 80\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"40\" x2=\"340\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"35\" x2=\"60\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"35\" x2=\"120\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"35\" x2=\"180\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"35\" x2=\"240\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"300\" y1=\"35\" x2=\"300\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"55\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">0</text><text x=\"117\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">1</text><text x=\"177\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">2</text><text x=\"237\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">3</text><text x=\"297\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">4</text><circle cx=\"237\" cy=\"25\" r=\"5\" fill=\"#ffffff\" stroke=\"#0284c7\" stroke-width=\"2\"/><line x1=\"242\" y1=\"25\" x2=\"340\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"3\"/><polygon points=\"335,20 345,25 335,30\" fill=\"#0284c7\"/></svg>",
        "questionText": "(i) Solve the inequality: $\\frac{4x + 1}{5} - \\frac{x - 2}{3} > 1$.\n(ii) Illustrate the answer on a number line.",
        "workedSolution": "**(i) Solving the inequality:**\n$$\\frac{4x + 1}{5} - \\frac{x - 2}{3} > 1$$\nMultiply through by the LCM of $5$ and $3$, which is $15$:\n$$15\\left(\\frac{4x + 1}{5}\\right) - 15\\left(\\frac{x - 2}{3}\\right) > 15(1)$$\n$$3(4x + 1) - 5(x - 2) > 15$$\n$$12x + 3 - 5x + 10 > 15$$\n$$7x + 13 > 15$$\n$$7x > 15 - 13$$\n$$7x > 2 \\implies x > \\frac{2}{7}$$\n\n**Truth set:** $\\mathbf{\\left\\{x : x > \\frac{2}{7}\\right\\}}$.\n\n---\n\n**(ii) Number Line Representation:**\nMark an open circle at $x = \\frac{2}{7}$ (approximately $0.29$) and draw an arrow extending to the right toward positive infinity."
      }
    ]
  },
  {
    "questionNumber": 2,
    "id": "MOCK06_P2_Q02",
    "marks": 15,
    "topic": "Algebraic Formulae, Proportional Rates, and Angles in Parallel Lines",
    "subQuestions": [
      {
        "part": "a",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "(i) Make $m$ the subject of the relation: $T = \\sqrt{\\frac{3m - 2k}{5m + k}}$.\n(ii) Hence, evaluate $m$ when $T = 1$ and $k = 4$.",
        "workedSolution": "**(i) Making $m$ the subject:**\nSquare both sides:\n$$T^2 = \\frac{3m - 2k}{5m + k}$$\nClear the fraction:\n$$T^2(5m + k) = 3m - 2k$$\n$$5T^2m + T^2k = 3m - 2k$$\nCollect all terms containing $m$ on one side:\n$$T^2k + 2k = 3m - 5T^2m$$\n$$k(T^2 + 2) = m(3 - 5T^2)$$\n$$m = \\frac{k(T^2 + 2)}{3 - 5T^2}$$\n\n---\n\n**(ii) Evaluating $m$ when $T = 1$ and $k = 4$:**\n$$m = \\frac{4(1^2 + 2)}{3 - 5(1^2)} = \\frac{4(1 + 2)}{3 - 5} = \\frac{4(3)}{-2} = \\frac{12}{-2} = -6$$\n\nTherefore, **$m = -6$**."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "Eight bricklayers can construct a perimeter wall in $15\\text{ days}$.\n(i) How many days will it take $10\\text{ bricklayers}$ working at the same rate to complete the wall?\n(ii) If the wall must be completed in $6\\text{ days}$, how many additional bricklayers must be employed?",
        "workedSolution": "**(i) Days for 10 bricklayers:**\n$$\\text{Total work} = 8 \\times 15 = 120\\text{ man-days}$$\n$$\\text{Days for 10 bricklayers} = \\frac{120}{10} = 12\\text{ days}$$\n\nTherefore, $10\\text{ bricklayers}$ will take **$12\\text{ days}$**.\n\n---\n\n**(ii) Additional bricklayers for 6-day completion:**\n$$\\text{Bricklayers needed} = \\frac{120\\text{ man-days}}{6\\text{ days}} = 20\\text{ bricklayers}$$\n$$\\text{Additional bricklayers} = 20 - 8 = 12$$\n\nTherefore, **$12\\text{ additional bricklayers}$** must be employed."
      },
      {
        "part": "c",
        "marks": 4,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"180\" viewBox=\"0 0 360 180\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"30\" y1=\"50\" x2=\"330\" y2=\"50\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"30\" y1=\"140\" x2=\"330\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"80\" y1=\"170\" x2=\"260\" y2=\"20\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 215 50 A 25 25 0 0 1 236 33\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><path d=\"M 125 140 A 25 25 0 0 1 148 122\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"220\" y=\"38\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">58°</text><text x=\"130\" y=\"132\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">(3x - 5)°</text><text x=\"30\" y=\"42\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">P</text><text x=\"320\" y=\"42\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">Q</text><text x=\"30\" y=\"132\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">R</text><text x=\"320\" y=\"132\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">S</text></svg>",
        "questionText": "In the diagram, line $PQ$ is parallel to line $RS$ ($PQ \\parallel RS$). A transversal cuts line $PQ$ and line $RS$ such that the acute angles formed are $58^\\circ$ and $(3x - 5)^\\circ$ as shown. Find the value of $x$.",
        "workedSolution": "Since line $PQ$ is parallel to line $RS$, corresponding angles across the transversal line are equal:\n$$3x - 5 = 58$$\n$$3x = 58 + 5 = 63$$\n$$x = \\frac{63}{3} = 21$$\n\nTherefore, **$x = 21$**."
      }
    ]
  },
  {
    "questionNumber": 3,
    "id": "MOCK06_P2_Q03",
    "marks": 15,
    "topic": "Compound Mensuration: Rectangular Compound with Circular Fountain and Shaded Ring Area",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"240\" viewBox=\"0 0 360 240\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"40\" y=\"30\" width=\"280\" height=\"180\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><circle cx=\"180\" cy=\"120\" r=\"50\" fill=\"#38bdf8\" fill-opacity=\"0.35\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"180\" cy=\"120\" r=\"3.5\" fill=\"#0284c7\"/><line x1=\"180\" y1=\"120\" x2=\"230\" y2=\"120\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"160\" y=\"20\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">28 m</text><text x=\"10\" y=\"125\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">20 m</text><text x=\"190\" y=\"115\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">r = 7 m</text></svg>",
        "questionText": "The diagram shows a rectangular civic park of length $28\\text{ m}$ and width $20\\text{ m}$. In the middle of the park is a circular water fountain of radius $7\\text{ m}$. The remaining area is paved with flagstones.\n(i) Calculate the area of the circular fountain.\n(ii) Calculate the paved area of the park.\n(iii) If paving costs $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 35.00$ per square metre, calculate the total cost of paving the park. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
        "workedSolution": "**(i) Area of the circular fountain:**\n$$\\text{Area of circle} = \\pi r^2 = \\frac{22}{7} \\times 7^2 = 22 \\times 7 = 154\\text{ m}^2$$\n\nTherefore, the area of the fountain is **$154\\text{ m}^2$**.\n\n---\n\n**(ii) Paved area:**\n$$\\text{Total area of park} = 28 \\times 20 = 560\\text{ m}^2$$\n$$\\text{Paved area} = 560 - 154 = 406\\text{ m}^2$$\n\nTherefore, the paved area is **$406\\text{ m}^2$**.\n\n---\n\n**(iii) Cost of paving:**\n$$\\text{Cost} = 406 \\times \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 35.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 14,210.00$$\n\nTherefore, the total cost of paving is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 14,210.00$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A cylindrical water storage tank of internal radius $1.4\\text{ m}$ and height $5.0\\text{ m}$ is half-filled with water. Calculate the volume of water currently in the tank in litres. $\\left[\\text{Take } \\pi = \\frac{22}{7} \\text{ and } 1\\text{ m}^3 = 1,000\\text{ litres}\\right]$",
        "workedSolution": "**Step 1: Calculate the full volume of the cylinder:**\n$$V = \\pi r^2 h = \\frac{22}{7} \\times (1.4)^2 \\times 5.0$$\n$$(1.4)^2 = 1.96 = \\frac{196}{100}$$\n$$V = \\frac{22}{7} \\times 1.96 \\times 5 = 22 \\times 0.28 \\times 5 = 22 \\times 1.4 = 30.8\\text{ m}^3$$\n\n**Step 2: Calculate the volume of water (half-full):**\n$$\\text{Water volume} = \\frac{1}{2} \\times 30.8 = 15.4\\text{ m}^3$$\n\n**Step 3: Convert cubic metres to litres:**\n$$\\text{Capacity in litres} = 15.4 \\times 1,000 = 15,400\\text{ litres}$$\n\nTherefore, the volume of water in the tank is **$15,400\\text{ litres}$**."
      }
    ]
  },
  {
    "questionNumber": 4,
    "id": "MOCK06_P2_Q04",
    "marks": 15,
    "topic": "Geometric Compass Construction: Rhombus and Perpendicular Inscribed Heights",
    "subQuestions": [
      {
        "part": "a",
        "marks": 10,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"420\" height=\"300\" viewBox=\"0 0 420 300\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"420\" height=\"300\" fill=\"#ffffff\"/><polygon points=\"80,220 240,220 320,81 160,81\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"80\" y1=\"220\" x2=\"320\" y2=\"81\" stroke=\"#0284c7\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><line x1=\"240\" y1=\"220\" x2=\"160\" y2=\"81\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><circle cx=\"200\" cy=\"150.5\" r=\"4\" fill=\"#7c3aed\"/><path d=\"M 125 220 A 45 45 0 0 0 105 177\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"115\" y=\"205\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">60°</text><text x=\"65\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"245\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"328\" y=\"80\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"145\" y=\"80\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">D</text><text x=\"160\" y=\"240\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">8 cm</text><text x=\"100\" y=\"140\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">8 cm</text></svg>",
        "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct side $|AB| = 8.0\\text{ cm}$;\n(ii) At $A$, construct an angle $\\angle DAB = 60^\\circ$ such that side $|AD| = 8.0\\text{ cm}$;\n(iii) Complete the rhombus $ABCD$ such that all four sides are equal to $8.0\\text{ cm}$;\n(iv) Construct the diagonals $AC$ and $BD$ intersecting at point $M$.",
        "workedSolution": "**Compass Construction Steps:**\n1. **Base Line $|AB| = 8.0\\text{ cm}$:**\n   - Draw a horizontal reference line and mark vertex $A$.\n   - Set compasses to $8.0\\text{ cm}$, place needle at $A$, and cut the line to fix $B$.\n2. **Construct $\\angle DAB = 60^\\circ$ and Vertex $D$:**\n   - With needle at $A$, strike an arc crossing $AB$. From that intersection, cut the arc to establish the $60^\\circ$ ray.\n   - Set compasses to $8.0\\text{ cm}$, place needle at $A$, and cut the $60^\\circ$ ray to locate vertex $D$.\n3. **Locating Vertex $C$ and Completing Rhombus:**\n   - Keep compass radius at $8.0\\text{ cm}$, place needle at $D$, and strike an arc towards the right.\n   - With needle at $B$ and same radius $8.0\\text{ cm}$, strike an intersecting arc to fix vertex $C$.\n   - Rule straight lines $BC$ and $CD$ to complete rhombus $ABCD$.\n4. **Diagonals $AC$ and $BD$:**\n   - Rule straight line segments $AC$ and $BD$.\n   - Mark their intersection as $M$."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your completed construction in (a):\n(i) Measure the length of diagonal $|AC|$;\n(ii) Measure the length of diagonal $|BD|$;\n(iii) Calculate the area of the rhombus.",
        "workedSolution": "**(i) Measuring diagonal $|AC|$:**\n- In $\\triangle ABC$, interior angle $\\angle B = 180^\\circ - 60^\\circ = 120^\\circ$:\n  $$|AC|^2 = 8^2 + 8^2 - 2(8)(8)\\cos 120^\\circ = 64 + 64 - 128(-0.5) = 128 + 64 = 192$$\n  $$|AC| = \\sqrt{192} = 8\\sqrt{3} \\approx 13.856\\text{ cm}$$\n$$\\mathbf{|AC| \\approx 13.9\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(ii) Measuring diagonal $|BD|$:**\n- In $\\triangle ABD$, vertex angle is $60^\\circ$ with equal legs $8.0\\text{ cm}$, making $\\triangle ABD$ equilateral:\n  $$|BD| = 8.0\\text{ cm}$$\n$$\\mathbf{|BD| = 8.0\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(iii) Calculating the area of rhombus $ABCD$:**\n$$\\text{Area} = \\frac{1}{2} d_1 d_2 = \\frac{1}{2} \\times |AC| \\times |BD| = \\frac{1}{2} \\times 13.86 \\times 8.0 = 4.0 \\times 13.86 \\approx 55.4\\text{ cm}^2$$\n*(Or base $\\times$ height: $8.0 \\times 8.0\\sin 60^\\circ = 64 \\times 0.8660 = 55.42\\text{ cm}^2$)*.\n\nTherefore, the area of the rhombus is **$55.4\\text{ cm}^2$**."
      }
    ]
  },
  {
    "questionNumber": 5,
    "id": "MOCK06_P2_Q05",
    "marks": 15,
    "topic": "Frequency Distribution, Mean from Frequency Table, and Probability",
    "subQuestions": [
      {
        "part": "a",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The following table gives the frequency distribution of ages of $40\\text{ young athletes}$ in a district athletics contingent:\n\n$$\\begin{array}{|l|c|c|c|c|c|c|} \\hline \\textbf{Age (years) } (x) & 11 & 12 & 13 & 14 & 15 & 16 \\\\ \\hline \\textbf{Frequency } (f) & 3 & 7 & 12 & 10 & 5 & 3 \\\\ \\hline \\end{array}$$\n\nCalculate:\n(i) the modal age;\n(ii) the mean age, correct to one decimal place.",
        "workedSolution": "**(i) Modal age:**\nThe highest frequency is $12$, which corresponds to an age of $13\\text{ years}$.\n$$\\text{Modal age} = 13\\text{ years}$$\n\n---\n\n**(ii) Mean age ($\\bar{x}$):**\nCompute products $fx$:\n- $11 \\times 3 = 33$\n- $12 \\times 7 = 84$\n- $13 \\times 12 = 156$\n- $14 \\times 10 = 140$\n- $15 \\times 5 = 75$\n- $16 \\times 3 = 48$\n\n$$\\sum f = 3 + 7 + 12 + 10 + 5 + 3 = 40$$\n$$\\sum fx = 33 + 84 + 156 + 140 + 75 + 48 = 536$$\n$$\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{536}{40} = 13.4\\text{ years}$$\n\nTherefore, the mean age is **$13.4\\text{ years}$**."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "If an athlete is selected at random from the contingent, find the probability that the athlete is:\n(i) at least $14\\text{ years old}$;\n(ii) younger than $13\\text{ years old}$.",
        "workedSolution": "**(i) Probability of being at least 14 years old ($x \\ge 14$):**\nAthletes aged $14, 15,$ and $16$:\n$$n(x \\ge 14) = 10 + 5 + 3 = 18$$\n$$P(x \\ge 14) = \\frac{18}{40} = \\frac{9}{20} = 0.45$$\n\nTherefore, the probability is **$\\frac{9}{20}$ (or $0.45$)**.\n\n---\n\n**(ii) Probability of being younger than 13 ($x < 13$):**\nAthletes aged $11$ and $12$:\n$$n(x < 13) = 3 + 7 = 10$$\n$$P(x < 13) = \\frac{10}{40} = \\frac{1}{4} = 0.25$$\n\nTherefore, the probability is **$\\frac{1}{4}$ (or $0.25$)**."
      },
      {
        "part": "c",
        "marks": 4,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "Find the median age of the athletes.",
        "workedSolution": "Since $n = 40$ is even, the median lies between the 20th and 21st values:\n- Cumulative frequency up to age 11: $3$\n- Cumulative frequency up to age 12: $3 + 7 = 10$\n- Cumulative frequency up to age 13: $10 + 12 = 22$\nSince positions $11$ through $22$ are all athletes aged $13$, both the 20th and 21st values are $13$.\n$$\\text{Median} = 13\\text{ years}$$\n\nTherefore, the median age is **$13\\text{ years}$**."
      }
    ]
  },
  {
    "questionNumber": 6,
    "id": "MOCK06_P2_Q06",
    "marks": 15,
    "topic": "Linear Relations, Table of Values, and Coordinate Graphing",
    "subQuestions": [
      {
        "part": "a",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "(i) Copy and complete the table of values for the relation $y = 3x - 1$ for the domain $-2 \\le x \\le 4$.\n\n| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y = 3x - 1$ | | $-4$ | | $2$ | | $8$ | |\n\n(ii) State the gradient and $y$-intercept of the relation.",
        "workedSolution": "**(i) Completed Table:**\nEvaluate $y = 3x - 1$:\n- $x = -2: y = 3(-2) - 1 = -6 - 1 = -7$\n- $x = 0: y = 3(0) - 1 = -1$\n- $x = 2: y = 3(2) - 1 = 6 - 1 = 5$\n- $x = 4: y = 3(4) - 1 = 12 - 1 = 11$\n\n| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y$ | **$-7$** | $-4$ | **$-1$** | $2$ | **$5$** | $8$ | **$11$** |\n\n---\n\n**(ii) Gradient and $y$-intercept:**\n- Gradient ($m$) $= 3$\n- $y$-intercept: **$(0, -1)$**"
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"380\" viewBox=\"0 0 400 380\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"380\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"gridMK6\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"380\" fill=\"url(#gridMK6)\"/><line x1=\"20\" y1=\"220\" x2=\"380\" y2=\"220\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"140\" y1=\"20\" x2=\"140\" y2=\"360\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"385\" y=\"225\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"145\" y=\"25\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><line x1=\"80\" y1=\"325\" x2=\"320\" y2=\"55\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"80\" cy=\"325\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"110\" cy=\"280\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"140\" cy=\"235\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"170\" cy=\"190\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"200\" cy=\"145\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"230\" cy=\"100\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"260\" cy=\"55\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"245\" y=\"80\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">y = 3x - 1</text></svg>",
        "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on the $x$-axis and $2\\text{ cm}$ to $2\\text{ units}$ on the $y$-axis, draw two perpendicular axes $Ox$ and $Oy$ on a graph sheet for $-3 \\le x \\le 5$ and $-8 \\le y \\le 12$.\nPlot the points from your table and draw a straight line through all the points.",
        "workedSolution": "**Graph Execution Protocol:**\n1. Calibrate $x$-axis: $2\\text{ cm} = 1\\text{ unit}$ ($-3$ to $5$).\n2. Calibrate $y$-axis: $2\\text{ cm} = 2\\text{ units}$ ($-8$ to $12$).\n3. Plot the coordinates: $(-2, -7), (-1, -4), (0, -1), (1, 2), (2, 5), (3, 8), (4, 11)$.\n4. Rule a continuous straight line through all plotted points.\n5. Label the line $y = 3x - 1$."
      },
      {
        "part": "c",
        "marks": 3,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your graph, find the:\n(i) value of $y$ when $x = 2.5$;\n(ii) value of $x$ when $y = 0$.",
        "workedSolution": "**(i) Finding $y$ when $x = 2.5$:**\nFrom the graph, project vertically from $x = 2.5$ to meet the line, then horizontally to read $y$:\n$$y = 3(2.5) - 1 = 7.5 - 1 = 6.5$$\nFrom graph reading: **$y = 6.5$ (tolerance $\\pm 0.1$)**.\n\n---\n\n**(ii) Finding $x$ when $y = 0$ ($x$-intercept):**\nRead the value of $x$ where the line intersects the horizontal $x$-axis:\n$$0 = 3x - 1 \\implies 3x = 1 \\implies x = \\frac{1}{3} \\approx 0.33$$\nFrom graph reading: **$x \\approx 0.3$ (tolerance $\\pm 0.1$)**."
      }
    ]
  }
];
export const allRawMathMock6TheoryQuestions = rawMathMock6Paper2Questions;

export const SET_BECE_MOCK_6_MATH_P2: CurriculumQuestionSet = {
  id: "math_mock_6_p2",
  title: "BECE Mathematics National Mock 6 (Paper 2 Theory & Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 6 Paper 2",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_06/paper_2",
  questions: rawMathMock6Paper2Questions.map((q) => {
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
      id: `math_m6_p2_q${q.questionNumber}`,
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
export const SET_BECE_MOCK_6_MATH_COMPLETE = {
  mockExamNumber: 6,
  subject: "Mathematics",
  examType: "BECE Mathematics National Standard Mock 6",
  academicYear: 2026,
  paper1: SET_BECE_MOCK_6_MATH_P1,
  paper2: SET_BECE_MOCK_6_MATH_P2,
  totalMarks: 100,
  unifiedTimeMinutes: 120
};
