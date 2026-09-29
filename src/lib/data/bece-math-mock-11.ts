import { CurriculumQuestionSet } from '../types';
import { MathMockObjectiveQuestion, MathMockTheoryQuestion } from './bece-math-mock-1';
import { CurriculumQuestion } from '../types';

export const allRawMathMock11Questions: MathMockObjectiveQuestion[] = [
  {
    "number": 1,
    "id": "MOCK11_P1_Q01",
    "prompt": "If $X = \\{x : 10 \\le x \\le 30, x \\text{ is a multiple of } 3\\}$ and $Y = \\{x : 10 \\le x \\le 30, x \\text{ is a multiple of } 5\\}$, find $n(X \\cup Y)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $8$",
          "B. $9$",
          "C. $10$",
          "D. $12$"
    ],
    "correctAnswer": "C",
    "hint": "Review Sets and Operations on Sets principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "List the elements of both sets within the interval $[10, 30]$:\n$$X = \\{12, 15, 18, 21, 24, 27, 30\\} \\implies n(X) = 7$$\n$$Y = \\{10, 15, 20, 25, 30\\} \\implies n(Y) = 5$$\n$$X \\cap Y = \\{15, 30\\} \\implies n(X \\cap Y) = 2$$\n$$n(X \\cup Y) = n(X) + n(Y) - n(X \\cap Y) = 7 + 5 - 2 = 10$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Sets and Operations on Sets"
  },
  {
    "number": 2,
    "id": "MOCK11_P1_Q02",
    "prompt": "Simplify: $\\sqrt{128} - \\sqrt{72} + \\sqrt{32}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $4\\sqrt{2}$",
          "B. $5\\sqrt{2}$",
          "C. $6\\sqrt{2}$",
          "D. $7\\sqrt{2}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Real Number System and Surds principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Factor out perfect squares from each surd:\n$$\\sqrt{128} = \\sqrt{64 \\times 2} = 8\\sqrt{2}$$\n$$\\sqrt{72} = \\sqrt{36 \\times 2} = 6\\sqrt{2}$$\n$$\\sqrt{32} = \\sqrt{16 \\times 2} = 4\\sqrt{2}$$\n$$8\\sqrt{2} - 6\\sqrt{2} + 4\\sqrt{2} = (8 - 6 + 4)\\sqrt{2} = 6\\sqrt{2}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Real Number System and Surds"
  },
  {
    "number": 3,
    "id": "MOCK11_P1_Q03",
    "prompt": "Express $0.000318$ in standard form.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $3.18 \\times 10^{-5}$",
          "B. $31.8 \\times 10^{-5}$",
          "C. $3.18 \\times 10^{-3}$",
          "D. $3.18 \\times 10^{-4}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Standard Form principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Move the decimal point $4$ places to the right:\n$$0.000318 = 3.18 \\times 10^{-4}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Standard Form"
  },
  {
    "number": 4,
    "id": "MOCK11_P1_Q04",
    "prompt": "The diagram shows a circle with chords $AB$ and $CD$ intersecting at an external point $P$. If $|PC| = 4\\text{ cm}, |CD| = 8\\text{ cm},$ and $|PB| = 3\\text{ cm}$, find the length of chord $AB$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"200\" viewBox=\"0 0 280 200\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"160\" cy=\"100\" r=\"65\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"20\" y1=\"100\" x2=\"225\" y2=\"100\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><line x1=\"20\" y1=\"100\" x2=\"205\" y2=\"45\" stroke=\"#dc2626\" stroke-width=\"2.5\"/><circle cx=\"20\" cy=\"100\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"15\" y=\"120\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">P</text><text x=\"95\" y=\"90\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">C</text><text x=\"205\" y=\"40\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">D</text><text x=\"90\" y=\"118\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">B</text><text x=\"225\" y=\"118\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">A</text></svg>",
    "options": [
          "A. $9\\text{ cm}$",
          "B. $12\\text{ cm}$",
          "C. $13\\text{ cm}$",
          "D. $16\\text{ cm}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Circle Theorems: Secant Power Theorem principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "By the secant-secant power theorem:\n$$|PB| \\times |PA| = |PC| \\times |PD|$$\nWhere $|PD| = |PC| + |CD| = 4 + 8 = 12\\text{ cm}$:\n$$3 \\times |PA| = 4 \\times 12 = 48$$\n$$|PA| = \\frac{48}{3} = 16\\text{ cm}$$\n$$|AB| = |PA| - |PB| = 16 - 3 = 13\\text{ cm}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Circle Theorems: Secant Power Theorem"
  },
  {
    "number": 5,
    "id": "MOCK11_P1_Q05",
    "prompt": "Solve for $x$ in the equation: $\\frac{5x - 2}{4} - \\frac{2x - 1}{3} = 1$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $2$",
          "B. $3$",
          "C. $4$",
          "D. $5$"
    ],
    "correctAnswer": "A",
    "hint": "Review Linear Equations principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Multiply through by $\\text{LCM}(4, 3) = 12$:\n$$3(5x - 2) - 4(2x - 1) = 12(1)$$\n$$15x - 6 - 8x + 4 = 12$$\n$$7x - 2 = 12$$\n$$7x = 14 \\implies x = 2$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Linear Equations"
  },
  {
    "number": 6,
    "id": "MOCK11_P1_Q06",
    "prompt": "Find the simple interest on $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,500.00$ saved for $1\\text{ year } 4\\text{ months}$ at an annual interest rate of $6\\%$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 320.00$",
          "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 450.00$",
          "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 400.00$",
          "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 360.00$"
    ],
    "correctAnswer": "D",
    "hint": "Review Commercial Arithmetic: Simple Interest principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$T = 1\\text{ year } + \\frac{4}{12}\\text{ year} = 1\\frac{1}{3}\\text{ years} = \\frac{4}{3}\\text{ years}$$\n$$I = \\frac{P \\times R \\times T}{100} = \\frac{4,500 \\times 6 \\times \\frac{4}{3}}{100} = 45 \\times 2 \\times 4 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 360.00$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Simple Interest"
  },
  {
    "number": 7,
    "id": "MOCK11_P1_Q07",
    "prompt": "The diagram shows a trapezoidal lawn. If the parallel sides measure $16\\text{ m}$ and $24\\text{ m}$, and the perpendicular distance between them is $9\\text{ m}$, calculate the area of the lawn.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"300\" height=\"180\" viewBox=\"0 0 300 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 260,140 210,40 70,40\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"70\" y1=\"40\" x2=\"70\" y2=\"140\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><polyline points=\"70,125 85,125 85,140\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.2\"/><text x=\"130\" y=\"30\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">16 m</text><text x=\"140\" y=\"160\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">24 m</text><text x=\"45\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">9 m</text></svg>",
    "options": [
          "A. $160\\text{ m}^2$",
          "B. $216\\text{ m}^2$",
          "C. $200\\text{ m}^2$",
          "D. $180\\text{ m}^2$"
    ],
    "correctAnswer": "D",
    "hint": "Review Mensuration: Area of Trapezium principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Area} = \\frac{1}{2}(a + b)h = \\frac{1}{2}(16 + 24) \\times 9 = \\frac{1}{2}(40) \\times 9 = 20 \\times 9 = 180\\text{ m}^2$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Area of Trapezium"
  },
  {
    "number": 8,
    "id": "MOCK11_P1_Q08",
    "prompt": "Factorize completely: $8ax + 12ay - 6bx - 9by$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $(2x + 3y)(4a - 3b)$",
          "B. $(2x - 3y)(4a + 3b)$",
          "C. $(2x + 3y)(4a + 3b)$",
          "D. $(4x + 3y)(2a - 3b)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Algebraic Factorization principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Group terms pairwise:\n$$8ax + 12ay - 6bx - 9by = 4a(2x + 3y) - 3b(2x + 3y) = (2x + 3y)(4a - 3b)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Factorization"
  },
  {
    "number": 9,
    "id": "MOCK11_P1_Q09",
    "prompt": "Solve the linear inequality: $6 - 2(3x - 1) < 14$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $x > -1$",
          "B. $x < -1$",
          "C. $x > 1$",
          "D. $x < 1$"
    ],
    "correctAnswer": "A",
    "hint": "Review Linear Inequalities principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$6 - 6x + 2 < 14$$\n$$8 - 6x < 14$$\n$$-6x < 6$$\nDivide by $-6$ and reverse the inequality sign:\n$$x > \\frac{6}{-6} \\implies x > -1$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 10,
    "id": "MOCK11_P1_Q10",
    "prompt": "The diagram shows a cyclic quadrilateral $ABCD$. Side $CD$ is extended to point $E$. If exterior angle $\\angle ADE = 88^\\circ$, calculate the value of opposite interior angle $\\angle ABC$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"220\" viewBox=\"0 0 260 220\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"110\" cy=\"110\" r=\"80\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><polygon points=\"110,30 185,95 135,185 45,145\" fill=\"#38bdf8\" fill-opacity=\"0.15\" stroke=\"#0284c7\" stroke-width=\"2\"/><line x1=\"135\" y1=\"185\" x2=\"10\" y2=\"125\" stroke=\"#0f172a\" stroke-width=\"2\"/><circle cx=\"45\" cy=\"145\" r=\"3\" fill=\"#0f172a\"/><path d=\"M 45 145 A 25 25 0 0 1 30 130\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"105\" y=\"22\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">A</text><text x=\"192\" y=\"100\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">B</text><text x=\"145\" y=\"195\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">C</text><text x=\"50\" y=\"160\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">D</text><text x=\"5\" y=\"120\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">E</text><text x=\"25\" y=\"150\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">88°</text></svg>",
    "options": [
          "A. $88^\\circ$",
          "B. $92^\\circ$",
          "C. $98^\\circ$",
          "D. $102^\\circ$"
    ],
    "correctAnswer": "A",
    "hint": "Review Circle Theorems principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "The exterior angle of a cyclic quadrilateral equals the opposite interior angle:\n$$\\angle ABC = \\angle ADE = 88^\\circ$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Circle Theorems"
  },
  {
    "number": 11,
    "id": "MOCK11_P1_Q11",
    "prompt": "Find the image of point $T(-3, 8)$ under a reflection in the line $y = 0$ (the $x$-axis).",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $(3, 8)$",
          "B. $(-3, -8)$",
          "C. $(3, -8)$",
          "D. $(8, -3)$"
    ],
    "correctAnswer": "B",
    "hint": "Review Transformational Geometry: Reflection principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Reflection in the $x$-axis: $(x, y) \\to (x, -y)$:\n$$T(-3, 8) \\to T'(-3, -8)$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Reflection"
  },
  {
    "number": 12,
    "id": "MOCK11_P1_Q12",
    "prompt": "A fair twelve-sided die with faces numbered $1$ to $12$ is rolled once. What is the probability that the number showing is a factor of $12$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $\\frac{1}{3}$",
          "B. $\\frac{5}{12}$",
          "C. $\\frac{1}{2}$",
          "D. $\\frac{7}{12}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Probability principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Sample space $S = \\{1, 2, 3, \\dots, 12\\} \\implies n(S) = 12$.\nFactors of $12$: $E = \\{1, 2, 3, 4, 6, 12\\} \\implies n(E) = 6$.\n$$P = \\frac{6}{12} = \\frac{1}{2}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 13,
    "id": "MOCK11_P1_Q13",
    "prompt": "Convert $412_{\\text{five}}$ to a base ten numeral.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $102$",
          "B. $117$",
          "C. $112$",
          "D. $107$"
    ],
    "correctAnswer": "D",
    "hint": "Review Number Bases principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$412_5 = (4 \\times 5^2) + (1 \\times 5^1) + (2 \\times 5^0) = (4 \\times 25) + 5 + 2 = 100 + 5 + 2 = 107_{10}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Number Bases"
  },
  {
    "number": 14,
    "id": "MOCK11_P1_Q14",
    "prompt": "The diagram shows a line $L$ on Cartesian axes passing through $(0, -4)$ and $(3, 2)$. Find the gradient of line $L$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"200\" viewBox=\"0 0 240 200\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"120\" x2=\"220\" y2=\"120\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"80\" y1=\"20\" x2=\"80\" y2=\"180\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"40\" y1=\"180\" x2=\"160\" y2=\"20\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"80\" cy=\"150\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"130\" cy=\"70\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"88\" y=\"155\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">(0, -4)</text><text x=\"135\" y=\"65\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">(3, 2)</text><text x=\"170\" y=\"35\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">L</text></svg>",
    "options": [
          "A. $\\frac{1}{2}$",
          "B. $1$",
          "C. $2$",
          "D. $3$"
    ],
    "correctAnswer": "C",
    "hint": "Review Coordinate Geometry: Gradient principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{2 - (-4)}{3 - 0} = \\frac{6}{3} = 2$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Gradient"
  },
  {
    "number": 15,
    "id": "MOCK11_P1_Q15",
    "prompt": "Make $v$ the subject of the kinetic energy formula: $E_k = \\frac{1}{2}mv^2$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $v = \\sqrt{\\frac{2E_k}{m}}$",
          "B. $v = \\frac{2E_k}{m}$",
          "C. $v = \\sqrt{\\frac{E_k}{2m}}$",
          "D. $v = \\frac{\\sqrt{2E_k}}{m}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Change of Subject principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$2E_k = mv^2$$\n$$v^2 = \\frac{2E_k}{m} \\implies v = \\sqrt{\\frac{2E_k}{m}}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Change of Subject"
  },
  {
    "number": 16,
    "id": "MOCK11_P1_Q16",
    "prompt": "A straight line connects points $P(2, -3)$ and $Q(-4, 5)$. Calculate the length of line segment $PQ$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $8$",
          "B. $14$",
          "C. $12$",
          "D. $10$"
    ],
    "correctAnswer": "D",
    "hint": "Review Coordinate Geometry: Distance Formula principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$|PQ| = \\sqrt{(-4 - 2)^2 + (5 - (-3))^2} = \\sqrt{(-6)^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Distance Formula"
  },
  {
    "number": 17,
    "id": "MOCK11_P1_Q17",
    "prompt": "The mean of the numbers $15, 19, 23, x,$ and $31$ is $24$. Find the value of $x$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $28$",
          "B. $30$",
          "C. $32$",
          "D. $34$"
    ],
    "correctAnswer": "C",
    "hint": "Review Statistics: Mean principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\sum x = 5 \\times 24 = 120$$\n$$15 + 19 + 23 + x + 31 = 120$$\n$$88 + x = 120 \\implies x = 120 - 88 = 32$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics: Mean"
  },
  {
    "number": 18,
    "id": "MOCK11_P1_Q18",
    "prompt": "A freight delivery vehicle travels $270\\text{ km}$ at an average speed of $90\\text{ km/h}$. If it leaves the depot at $8:30\\text{ a.m.}$, at what time will it arrive at its destination?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $11:00\\text{ a.m.}$",
          "B. $11:30\\text{ a.m.}$",
          "C. $12:00\\text{ noon}$",
          "D. $12:30\\text{ p.m.}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Speed, Distance, and Time principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Time} = \\frac{270}{90} = 3\\text{ hours}$$\n$$08:30 + 3\\text{ hours} = 11:30\\text{ a.m.}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Speed, Distance, and Time"
  },
  {
    "number": 19,
    "id": "MOCK11_P1_Q19",
    "prompt": "The diagram shows a solid metal sphere of radius $3\\text{ cm}$. Find the total surface area of the sphere in terms of $\\pi$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"200\" height=\"200\" viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"100\" cy=\"100\" r=\"70\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0f172a\" stroke-width=\"2\"/><ellipse cx=\"100\" cy=\"100\" rx=\"70\" ry=\"22\" fill=\"none\" stroke=\"#64748b\" stroke-dasharray=\"3\" stroke-width=\"1.5\"/><line x1=\"100\" y1=\"100\" x2=\"170\" y2=\"100\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><circle cx=\"100\" cy=\"100\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"120\" y=\"95\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">r = 3 cm</text></svg>",
    "options": [
          "A. $18\\pi\\text{ cm}^2$",
          "B. $27\\pi\\text{ cm}^2$",
          "C. $36\\pi\\text{ cm}^2$",
          "D. $54\\pi\\text{ cm}^2$"
    ],
    "correctAnswer": "C",
    "hint": "Review Solid Geometry: Sphere Surface Area principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$A = 4\\pi r^2 = 4\\pi(3^2) = 4 \\times 9\\pi = 36\\pi\\text{ cm}^2$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Solid Geometry: Sphere Surface Area"
  },
  {
    "number": 20,
    "id": "MOCK11_P1_Q20",
    "prompt": "Find the image of point $R(7, -3)$ when reflected in the line $y = x$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $(-3, 7)$",
          "B. $(3, -7)$",
          "C. $(-7, 3)$",
          "D. $(7, 3)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Transformational Geometry: Reflection principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Reflection in the line $y = x$ swaps coordinates: $(x, y) \\to (y, x)$:\n$$R(7, -3) \\to R'(-3, 7)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Reflection"
  },
  {
    "number": 21,
    "id": "MOCK11_P1_Q21",
    "prompt": "Find the rule governing the mapping below:\n$$\\begin{array}{cccccc} x & 1 & 2 & 3 & 4 & 5 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 5 & 11 & 17 & 23 & 29 \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $y = 6x - 1$",
          "B. $y = 6x + 1$",
          "C. $y = 5x$",
          "D. $y = 4x + 3$"
    ],
    "correctAnswer": "A",
    "hint": "Review Relations and Mappings principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Common difference in $y$: $11 - 5 = 6 \\implies m = 6$.\nForm: $y = 6x + c$. For $x = 1$:\n$$5 = 6(1) + c \\implies c = -1 \\implies y = 6x - 1$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Relations and Mappings"
  },
  {
    "number": 22,
    "id": "MOCK11_P1_Q22",
    "prompt": "The diagram shows a right-angled triangle $PQR$. Find the value of $\\cos(\\angle RPQ)$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"180\" viewBox=\"0 0 260 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 220,140 40,30\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"40,125 55,125 55,140\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"25\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">Q</text><text x=\"230\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">R</text><text x=\"30\" y=\"25\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">P</text><text x=\"15\" y=\"90\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">12 cm</text><text x=\"120\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">16 cm</text><text x=\"145\" y=\"80\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">20 cm</text></svg>",
    "options": [
          "A. $\\frac{3}{5}$",
          "B. $\\frac{4}{5}$",
          "C. $\\frac{3}{4}$",
          "D. $\\frac{4}{3}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Trigonometry principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "From vertex $P$ in right-angled $\\triangle PQR$:\n$$\\text{Adjacent side} = |PQ| = 12\\text{ cm}$$\n$$\\text{Hypotenuse} = |PR| = 20\\text{ cm}$$\n$$\\cos(\\angle RPQ) = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}} = \\frac{12}{20} = \\frac{3}{5}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Trigonometry"
  },
  {
    "number": 23,
    "id": "MOCK11_P1_Q23",
    "prompt": "The bearing of harbour $B$ from harbour $A$ is $240^\\circ$. What is the bearing of harbour $A$ from harbour $B$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $040^\\circ$",
          "B. $300^\\circ$",
          "C. $120^\\circ$",
          "D. $060^\\circ$"
    ],
    "correctAnswer": "D",
    "hint": "Review Bearings principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Since forward bearing $\\theta = 240^\\circ > 180^\\circ$:\n$$\\text{Back bearing} = 240^\\circ - 180^\\circ = 060^\\circ$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Bearings"
  },
  {
    "number": 24,
    "id": "MOCK11_P1_Q24",
    "prompt": "A trader sold an item for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 720.00$, making a profit of $20\\%$. Find the cost price of the item.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 576.00$",
          "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 600.00$",
          "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 620.00$",
          "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 864.00$"
    ],
    "correctAnswer": "B",
    "hint": "Review Commercial Arithmetic: Profit and Cost Price principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Selling price} = 120\\% \\text{ of Cost Price}$$\n$$1.20 \\times CP = 720.00$$\n$$CP = \\frac{720}{1.2} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 600.00$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Profit and Cost Price"
  },
  {
    "number": 25,
    "id": "MOCK11_P1_Q25",
    "prompt": "Simplify: $2^5 \\times 4^{-2} \\div 8^0$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $1$",
          "B. $2$",
          "C. $4$",
          "D. $8$"
    ],
    "correctAnswer": "B",
    "hint": "Review Indices and Exponents principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$2^5 \\times (2^2)^{-2} \\div 1 = 2^5 \\times 2^{-4} = 2^{5 - 4} = 2^1 = 2$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Indices and Exponents"
  },
  {
    "number": 26,
    "id": "MOCK11_P1_Q26",
    "prompt": "The diagram shows a pair of alternate interior angles formed by parallel lines cut by a transversal. If the angles are $(3x - 15)^\\circ$ and $75^\\circ$, calculate the value of $x$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"320\" height=\"160\" viewBox=\"0 0 320 160\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"30\" y1=\"40\" x2=\"290\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"30\" y1=\"120\" x2=\"290\" y2=\"120\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"90\" y1=\"150\" x2=\"230\" y2=\"10\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 160 40 A 25 25 0 0 1 180 25\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><path d=\"M 160 120 A 25 25 0 0 1 140 135\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"120\" y=\"35\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">75°</text><text x=\"165\" y=\"135\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">(3x - 15)°</text></svg>",
    "options": [
          "A. $25$",
          "B. $40$",
          "C. $35$",
          "D. $30$"
    ],
    "correctAnswer": "D",
    "hint": "Review Plane Geometry: Parallel Lines principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Alternate interior angles between parallel lines are equal:\n$$3x - 15 = 75$$\n$$3x = 75 + 15 = 90$$\n$$x = \\frac{90}{3} = 30$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Plane Geometry: Parallel Lines"
  },
  {
    "number": 27,
    "id": "MOCK11_P1_Q27",
    "prompt": "If $\\mathbf{a} = \\begin{pmatrix} 2 \\\\ -5 \\end{pmatrix}$ and $\\mathbf{b} = \\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix}$, find $|3\\mathbf{a} + 2\\mathbf{b}|$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $5$",
          "B. $7$",
          "C. $\\sqrt{49}$",
          "D. $7\\sqrt{2}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Vectors: Magnitude and Operations principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$3\\mathbf{a} + 2\\mathbf{b} = 3\\begin{pmatrix} 2 \\\\ -5 \\end{pmatrix} + 2\\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ -15 \\end{pmatrix} + \\begin{pmatrix} -6 \\\\ 8 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ -7 \\end{pmatrix}$$\n$$|3\\mathbf{a} + 2\\mathbf{b}| = \\sqrt{0^2 + (-7)^2} = \\sqrt{49} = 7$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Vectors: Magnitude and Operations"
  },
  {
    "number": 28,
    "id": "MOCK11_P1_Q28",
    "prompt": "The diagram shows a sector with central angle $60^\\circ$ and radius $6\\text{ cm}$. Find the area of the sector in terms of $\\pi$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"180\" viewBox=\"0 0 220 180\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M 40 140 L 160 140 A 120 120 0 0 0 100 36 Z\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"40\" cy=\"140\" r=\"3.5\" fill=\"#0f172a\"/><path d=\"M 70 140 A 30 30 0 0 0 55 114\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"72\" y=\"132\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">60°</text><text x=\"95\" y=\"155\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">6 cm</text></svg>",
    "options": [
          "A. $4\\pi\\text{ cm}^2$",
          "B. $6\\pi\\text{ cm}^2$",
          "C. $12\\pi\\text{ cm}^2$",
          "D. $18\\pi\\text{ cm}^2$"
    ],
    "correctAnswer": "B",
    "hint": "Review Mensuration: Area of Sector principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Area} = \\frac{\\theta}{360^\\circ} \\times \\pi r^2 = \\frac{60^\\circ}{360^\\circ} \\times \\pi(6^2) = \\frac{1}{6} \\times 36\\pi = 6\\pi\\text{ cm}^2$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Mensuration: Area of Sector"
  },
  {
    "number": 29,
    "id": "MOCK11_P1_Q29",
    "prompt": "The sum of the interior angles of a polygon is $1,800^\\circ$. How many sides does the polygon have?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $10$",
          "B. $11$",
          "C. $14$",
          "D. $12$"
    ],
    "correctAnswer": "D",
    "hint": "Review Polygons and Interior Angles principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$(n - 2) \\times 180^\\circ = 1,800^\\circ$$\n$$n - 2 = \\frac{1,800}{180} = 10 \\implies n = 10 + 2 = 12$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Polygons and Interior Angles"
  },
  {
    "number": 30,
    "id": "MOCK11_P1_Q30",
    "prompt": "A rectangular tank measuring $5\\text{ m} \\times 4\\text{ m} \\times 3\\text{ m}$ is filled with water. Calculate the total capacity of the tank in litres. $[1\\text{ m}^3 = 1,000\\text{ litres}]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $6,000\\text{ litres}$",
          "B. $12,000\\text{ litres}$",
          "C. $120,000\\text{ litres}$",
          "D. $60,000\\text{ litres}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Mensuration: Volume and Capacity principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$V = 5 \\times 4 \\times 3 = 60\\text{ m}^3$$\n$$\\text{Capacity} = 60 \\times 1,000 = 60,000\\text{ litres}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Volume and Capacity"
  },
  {
    "number": 31,
    "id": "MOCK11_P1_Q31",
    "prompt": "The diagram shows a kite $ABCD$ with diagonals $AC = 18\\text{ cm}$ and $BD = 12\\text{ cm}$. Calculate the area of the kite.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"260\" viewBox=\"0 0 240 260\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"120,20 190,90 120,240 50,90\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"120\" y1=\"20\" x2=\"120\" y2=\"240\" stroke=\"#dc2626\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><line x1=\"50\" y1=\"90\" x2=\"190\" y2=\"90\" stroke=\"#0284c7\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><circle cx=\"120\" cy=\"90\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"115\" y=\"15\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"195\" y=\"95\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"115\" y=\"255\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"35\" y=\"95\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">D</text></svg>",
    "options": [
          "A. $96\\text{ cm}^2$",
          "B. $108\\text{ cm}^2$",
          "C. $120\\text{ cm}^2$",
          "D. $216\\text{ cm}^2$"
    ],
    "correctAnswer": "B",
    "hint": "Review Mensuration: Area of Kite principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Area} = \\frac{1}{2} d_1 d_2 = \\frac{1}{2} \\times 18 \\times 12 = 9 \\times 12 = 108\\text{ cm}^2$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Mensuration: Area of Kite"
  },
  {
    "number": 32,
    "id": "MOCK11_P1_Q32",
    "prompt": "Find the Least Common Multiple (LCM) of $24, 32,$ and $48$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $72$",
          "B. $96$",
          "C. $144$",
          "D. $192$"
    ],
    "correctAnswer": "B",
    "hint": "Review Number Theory and LCM principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$24 = 2^3 \\times 3, \\quad 32 = 2^5, \\quad 48 = 2^4 \\times 3$$\n$$\\text{LCM} = 2^5 \\times 3 = 32 \\times 3 = 96$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Number Theory and LCM"
  },
  {
    "number": 33,
    "id": "MOCK11_P1_Q33",
    "prompt": "A class has $15\\text{ boys}$ and $25\\text{ girls}$. If a student is chosen at random, find the probability that the student is a **boy**.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $\\frac{1}{4}$",
          "B. $\\frac{3}{8}$",
          "C. $\\frac{1}{2}$",
          "D. $\\frac{5}{8}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Probability principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Total students} = 15 + 25 = 40$$\n$$P(\\text{boy}) = \\frac{15}{40} = \\frac{3}{8}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 34,
    "id": "MOCK11_P1_Q34",
    "prompt": "Evaluate $2x^2 - 3y^2$ when $x = -3$ and $y = 2$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $24$",
          "B. $12$",
          "C. $18$",
          "D. $6$"
    ],
    "correctAnswer": "D",
    "hint": "Review Algebraic Substitution principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$2(-3)^2 - 3(2)^2 = 2(9) - 3(4) = 18 - 12 = 6$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Algebraic Substitution"
  },
  {
    "number": 35,
    "id": "MOCK11_P1_Q35",
    "prompt": "The diagram shows a right-angled triangle $ABC$. Find the value of $\\sin(\\angle BCA)$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"180\" viewBox=\"0 0 260 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 220,140 220,40\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"205,140 205,125 220,125\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"30\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"225\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"225\" y=\"35\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"120\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">12 cm</text><text x=\"232\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">9 cm</text><text x=\"120\" y=\"80\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">15 cm</text></svg>",
    "options": [
          "A. $\\frac{3}{5}$",
          "B. $\\frac{4}{5}$",
          "C. $\\frac{3}{4}$",
          "D. $\\frac{4}{3}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Trigonometry principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "From vertex $C$ in right-angled $\\triangle ABC$:\n$$\\text{Opposite side} = |AB| = 9\\text{ cm}$$\n$$\\text{Hypotenuse} = |AC| = 15\\text{ cm}$$\n$$\\sin(\\angle BCA) = \\frac{\\text{Opposite}}{\\text{Hypotenuse}} = \\frac{9}{15} = \\frac{3}{5}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Trigonometry"
  },
  {
    "number": 36,
    "id": "MOCK11_P1_Q36",
    "prompt": "Simplify: $\\frac{1}{2}(4x - 6) - \\frac{1}{3}(6x - 9)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $0$",
          "B. $1$",
          "C. $2x - 3$",
          "D. $4x - 6$"
    ],
    "correctAnswer": "A",
    "hint": "Review Algebraic Simplification principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\frac{1}{2}(4x - 6) = 2x - 3$$\n$$\\frac{1}{3}(6x - 9) = 2x - 3$$\n$$(2x - 3) - (2x - 3) = 0$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Simplification"
  },
  {
    "number": 37,
    "id": "MOCK11_P1_Q37",
    "prompt": "A map is drawn to a scale of $1 : 25,000$. What is the actual ground distance in kilometres represented by $16\\text{ cm}$ on the map?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $2.5\\text{ km}$",
          "B. $3.2\\text{ km}$",
          "C. $4.0\\text{ km}$",
          "D. $5.0\\text{ km}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Scale and Ratio principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Actual distance} = 16 \\times 25,000\\text{ cm} = 400,000\\text{ cm} = 4,000\\text{ m} = 4.0\\text{ km}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Scale and Ratio"
  },
  {
    "number": 38,
    "id": "MOCK11_P1_Q38",
    "prompt": "Calculate the volume of a cylinder of radius $7\\text{ cm}$ and height $10\\text{ cm}$. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $770\\text{ cm}^3$",
          "B. $1,440\\text{ cm}^3$",
          "C. $1,540\\text{ cm}^3$",
          "D. $3,080\\text{ cm}^3$"
    ],
    "correctAnswer": "C",
    "hint": "Review Mensuration: Cylinders principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$V = \\pi r^2 h = \\frac{22}{7} \\times 7^2 \\times 10 = 22 \\times 7 \\times 10 = 1,540\\text{ cm}^3$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Cylinders"
  },
  {
    "number": 39,
    "id": "MOCK11_P1_Q39",
    "prompt": "How many lines of symmetry has a square?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $2$",
          "B. $3$",
          "C. $4$",
          "D. $8$"
    ],
    "correctAnswer": "C",
    "hint": "Review Symmetry in Polygons principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "A square has $4$ lines of symmetry: $2$ connecting the midpoints of opposite sides and $2$ passing along its diagonals.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Symmetry in Polygons"
  },
  {
    "number": 40,
    "id": "MOCK11_P1_Q40",
    "prompt": "A salesman receives a commission of $6\\%$ on total sales. If he earned $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 540.00$ in a week, calculate the total value of sales he made.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
          "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 8,500.00$",
          "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 9,000.00$",
          "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 9,500.00$",
          "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 10,000.00$"
    ],
    "correctAnswer": "B",
    "hint": "Review Commercial Arithmetic: Commission principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$0.06S = 540.00 \\implies S = \\frac{540}{0.06} = \\frac{54,000}{6} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 9,000.00$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Commission"
  }
];

export const SET_BECE_MOCK_11_MATH_P1: CurriculumQuestionSet = {
  id: "math_mock_11_p1",
  title: "BECE Mathematics National Mock 11 (Paper 1 Objective)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 11 Paper 1",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_11/paper_1",
  questions: allRawMathMock11Questions.map((q) => ({
    id: `math_m11_q${q.number}`,
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

export const rawMathMock11Paper2Questions: MathMockTheoryQuestion[] = [
  {
    "questionNumber": 1,
    "id": "MOCK11_P2_Q01",
    "marks": 15,
    "topic": "Sets, Linear Inequalities, and Vector Column Operations",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"380\" height=\"240\" viewBox=\"0 0 380 240\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"10\" width=\"360\" height=\"220\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"35\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 100</text><circle cx=\"145\" cy=\"125\" r=\"72\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"235\" cy=\"125\" r=\"72\" fill=\"#10b981\" fill-opacity=\"0.2\" stroke=\"#059669\" stroke-width=\"2\"/><text x=\"105\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">A (Art)</text><text x=\"240\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#047857\">M (Music)</text><text x=\"105\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">38</text><text x=\"182\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">20</text><text x=\"255\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">28</text><text x=\"315\" y=\"205\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">14</text></svg>",
        "questionText": "In a cohort of $100\\text{ junior high school learners}$, $58$ offer Art ($A$), $48$ offer Music ($M$), and $20$ offer both subjects. The remaining learners offer neither of the two subjects.\n(i) Illustrate the information on a Venn diagram.\n(ii) Find the number of learners who offer:\n    $(\\alpha)$ Art only;\n    $(\\beta)$ exactly one of the two subjects;\n    $(\\gamma)$ neither Art nor Music.",
        "workedSolution": "**(i) Venn Diagram Representation:**\nUniversal set $n(U) = 100$.\n- Art learners: $n(A) = 58$\n- Music learners: $n(M) = 48$\n- Both subjects: $n(A \\cap M) = 20$\n\nRegion Breakdown:\n- Art only: $n(A \\cap M') = 58 - 20 = 38$\n- Music only: $n(A' \\cap M) = 48 - 20 = 28$\n- Both subjects: $n(A \\cap M) = 20$\n- Neither subject: $n(A \\cup M)' = 100 - (38 + 20 + 28) = 100 - 86 = 14$\n\n*(See the embedded SVG above for the complete, labeled illustration)*.\n\n---\n\n**(ii) ($a$) Learners offering Art only:**\n$$n(A \\cap M') = 58 - 20 = 38$$\nTherefore, **$38\\text{ learners}$ offer Art only**.\n\n---\n\n**(ii) ($\\beta$) Learners offering exactly one subject:**\n$$\\text{Exactly one subject} = n(A \\cap M') + n(A' \\cap M) = 38 + 28 = 66$$\nTherefore, **$66\\text{ learners}$ offer exactly one subject**.\n\n---\n\n**(ii) ($\\gamma$) Learners offering neither subject:**\n$$n(A \\cup M)' = 100 - 86 = 14$$\nTherefore, **$14\\text{ learners}$ offer neither Art nor Music**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"80\" viewBox=\"0 0 360 80\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"40\" x2=\"340\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"35\" x2=\"60\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"35\" x2=\"120\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"35\" x2=\"180\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"35\" x2=\"240\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"300\" y1=\"35\" x2=\"300\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"55\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">-1</text><text x=\"117\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">0</text><text x=\"177\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">1</text><text x=\"237\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">2</text><text x=\"297\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">3</text><circle cx=\"237\" cy=\"25\" r=\"5\" fill=\"#0284c7\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><line x1=\"237\" y1=\"25\" x2=\"25\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"3\"/><polygon points=\"25,20 15,25 25,30\" fill=\"#0284c7\"/></svg>",
        "questionText": "(i) Solve the inequality: $\\frac{3x + 2}{5} - \\frac{x - 1}{2} \\le \\frac{3}{10}$.\n(ii) Illustrate the solution on a number line.",
        "workedSolution": "**(i) Solving the inequality:**\n$$\\frac{3x + 2}{5} - \\frac{x - 1}{2} \\le \\frac{3}{10}$$\nMultiply through by the LCM of denominators ($10$):\n$$10\\left(\\frac{3x + 2}{5}\\right) - 10\\left(\\frac{x - 1}{2}\\right) \\le 10\\left(\\frac{3}{10}\\right)$$\n$$2(3x + 2) - 5(x - 1) \\le 3$$\n$$6x + 4 - 5x + 5 \\le 3$$\n$$x + 9 \\le 3$$\n$$x \\le 3 - 9 \\implies x \\le -6$$\n\n**Truth set:** $\\mathbf{\\{x : x \\le -6\\}}$.\n\n---\n\n**(ii) Number Line Representation:**\nMark a solid circle at $x = -6$ on a horizontal number line and draw a directed arrow pointing to the left toward negative infinity."
      }
    ]
  },
  {
    "questionNumber": 2,
    "id": "MOCK11_P2_Q02",
    "marks": 15,
    "topic": "Financial Mathematics: Simple Interest, Value Added Tax (VAT), and Proportional Sharing",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A cooperative union borrowed $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 36,000.00$ to procure tractor equipment at an interest rate of $15\\%$ simple interest per annum for $2\\text{ years } 6\\text{ months}$.\n(i) Calculate the simple interest charged on the loan.\n(ii) Calculate the total amount payable at the end of the loan term.\n(iii) If the union repays the total debt in $15\\text{ equal monthly installments}$, find the amount of each monthly payment.",
        "workedSolution": "**(i) Calculating the simple interest:**\nConvert duration to years:\n$$T = 2\\text{ years } + \\frac{6}{12}\\text{ year} = 2.5\\text{ years} = \\frac{5}{2}\\text{ years}$$\n$$I = \\frac{P \\times R \\times T}{100} = \\frac{36,000 \\times 15 \\times 2.5}{100} = 360 \\times 37.5 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 13,500.00$$\n\nTherefore, the simple interest charged is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 13,500.00$**.\n\n---\n\n**(ii) Total amount payable:**\n$$A = P + I = 36,000.00 + 13,500.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 49,500.00$$\n\nTherefore, the total amount payable is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 49,500.00$**.\n\n---\n\n**(iii) Monthly installment:**\n$$\\text{Installment} = \\frac{49,500.00}{15} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,300.00$$\n\nTherefore, each monthly payment is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,300.00$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A father bequeathed an estate of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 72,000.00$ to be shared among his three children, Abena, Kojo, and Yaa. Abena received $\\frac{1}{3}$ of the estate, while the remainder was shared between Kojo and Yaa in the ratio $3 : 5$ respectively. Calculate:\n(i) the amount received by Abena;\n(ii) the amount received by Kojo;\n(iii) the amount received by Yaa.",
        "workedSolution": "**(i) Abena's share:**\n$$\\text{Abena} = \\frac{1}{3} \\times 72,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 24,000.00$$\n\nTherefore, Abena received **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 24,000.00$**.\n\n---\n\n**(ii) & (iii) Kojo and Yaa's shares:**\n$$\\text{Remaining amount} = 72,000.00 - 24,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 48,000.00$$\n$$\\text{Total ratio parts} = 3 + 5 = 8$$\n$$\\text{Value per part} = \\frac{48,000.00}{8} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$$\n\n- Kojo's share ($3$ parts):\n  $$\\text{Kojo} = 3 \\times 6,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 18,000.00$$\n- Yaa's share ($5$ parts):\n  $$\\text{Yaa} = 5 \\times 6,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 30,000.00$$\n\nTherefore, Kojo received **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 18,000.00$** and Yaa received **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 30,000.00$**."
      }
    ]
  },
  {
    "questionNumber": 3,
    "id": "MOCK11_P2_Q03",
    "marks": 15,
    "topic": "Plane and Solid Geometry: Right-Angled Triangles and Hollow Cylindrical Tanks",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"220\" viewBox=\"0 0 360 220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,180 320,180 136,40\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"136\" y1=\"40\" x2=\"136\" y2=\"180\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><polyline points=\"136,165 151,165 151,180\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><text x=\"130\" y=\"30\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"25\" y=\"190\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Q</text><text x=\"325\" y=\"190\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">R</text><text x=\"130\" y=\"200\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">S</text><text x=\"70\" y=\"105\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">20 cm</text><text x=\"240\" y=\"105\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">20 cm</text><text x=\"144\" y=\"115\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">16 cm</text><text x=\"110\" y=\"215\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
        "questionText": "In the diagram, triangle $PQR$ is isosceles with $|PQ| = |PR| = 20\\text{ cm}$. Altitude $PS$ is perpendicular to base $QR$ ($PS \\perp QR$), and $|PS| = 16\\text{ cm}$. Calculate:\n(i) the length of segment $QS$;\n(ii) the total length of base $QR$;\n(iii) the area of triangle $PQR$.",
        "workedSolution": "**(i) Finding length $|QS|$:**\nIn right-angled triangle $\\triangle PSQ$:\n$$|PQ|^2 = |QS|^2 + |PS|^2$$\n$$20^2 = |QS|^2 + 16^2$$\n$$400 = |QS|^2 + 256$$\n$$|QS|^2 = 400 - 256 = 144 \\implies |QS| = \\sqrt{144} = 12\\text{ cm}$$\n\nTherefore, **$|QS| = 12\\text{ cm}$**.\n\n---\n\n**(ii) Finding length $|QR|$:**\nSince triangle $PQR$ is isosceles with $|PQ| = |PR|$, the altitude $PS$ bisects base $QR$:\n$$|SR| = |QS| = 12\\text{ cm}$$\n$$|QR| = |QS| + |SR| = 12 + 12 = 24\\text{ cm}$$\n\nTherefore, the length of $QR$ is **$24\\text{ cm}$**.\n\n---\n\n**(iii) Area of triangle $PQR$:**\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times |QR| \\times |PS| = \\frac{1}{2} \\times 24 \\times 16 = 12 \\times 16 = 192\\text{ cm}^2$$\n\nTherefore, the area of triangle $PQR$ is **$192\\text{ cm}^2$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A water reservoir has the shape of a cylinder of internal radius $2.1\\text{ m}$ and height $4.0\\text{ m}$. Calculate the volume of water the reservoir holds when it is three-quarters full, giving your answer in litres. $\\left[\\text{Take } \\pi = \\frac{22}{7} \\text{ and } 1\\text{ m}^3 = 1,000\\text{ litres}\\right]$",
        "workedSolution": "**Step 1: Calculate the total capacity of the cylinder:**\n$$V = \\pi r^2 h = \\frac{22}{7} \\times (2.1)^2 \\times 4.0$$\n$$(2.1)^2 = 4.41$$\n$$V = \\frac{22}{7} \\times 4.41 \\times 4 = 22 \\times 0.63 \\times 4 = 22 \\times 2.52 = 55.44\\text{ m}^3$$\n\n**Step 2: Calculate the volume when three-quarters full:**\n$$V_{3/4} = \\frac{3}{4} \\times 55.44 = 3 \\times 13.86 = 41.58\\text{ m}^3$$\n\n**Step 3: Convert to litres:**\n$$\\text{Volume in litres} = 41.58 \\times 1,000 = 41,580\\text{ litres}$$\n\nTherefore, the volume of water is **$41,580\\text{ litres}$**."
      }
    ]
  },
  {
    "questionNumber": 4,
    "id": "MOCK11_P2_Q04",
    "marks": 15,
    "topic": "Geometric Compass Construction: Triangle $XYZ$ with $60^\\circ$ and $30^\\circ$ Angles and Circumcircle",
    "subQuestions": [
      {
        "part": "a",
        "marks": 10,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"420\" height=\"300\" viewBox=\"0 0 420 300\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"420\" height=\"300\" fill=\"#ffffff\"/><polygon points=\"70,230 350,230 210,65\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"210\" y1=\"65\" x2=\"210\" y2=\"230\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><polyline points=\"210,215 225,215 225,230\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><path d=\"M 120 230 A 50 50 0 0 0 95 187\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 300 230 A 50 50 0 0 1 325 205\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"108\" y=\"215\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">60°</text><text x=\"295\" y=\"215\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">30°</text><text x=\"55\" y=\"245\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">X</text><text x=\"360\" y=\"245\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Y</text><text x=\"205\" y=\"55\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Z</text><text x=\"205\" y=\"250\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">P</text><text x=\"200\" y=\"250\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">10 cm</text></svg>",
        "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct the base line segment $|XY| = 10.0\\text{ cm}$;\n(ii) At vertex $X$, construct an angle $\\angle ZXY = 60^\\circ$;\n(iii) At vertex $Y$, construct an angle $\\angle ZYX = 30^\\circ$ such that the two rays meet at vertex $Z$ to complete triangle $XYZ$;\n(iv) Drop a perpendicular line from vertex $Z$ to meet baseline $XY$ at point $P$.",
        "workedSolution": "**Compass Construction Steps:**\n1. **Base Line $|XY| = 10.0\\text{ cm}$:**\n   - Draw a horizontal pencil line and mark vertex $X$.\n   - Set compasses to $10.0\\text{ cm}$, place needle at $X$, and strike an arc to locate $Y$.\n2. **Construct $\\angle ZXY = 60^\\circ$ at $X$:**\n   - With needle at $X$, strike an arc crossing $XY$. Without altering compass radius, place needle at intersection and strike an intersecting arc to obtain a $60^\\circ$ ray.\n   - Extend the ray upward from $X$.\n3. **Construct $\\angle ZYX = 30^\\circ$ at $Y$:**\n   - At vertex $Y$, construct a $60^\\circ$ angle ray towards $X$, then bisect it with intersecting arcs to obtain a $30^\\circ$ ray.\n   - Extend the $30^\\circ$ ray until it intersects the $60^\\circ$ ray from $X$ at vertex $Z$.\n4. **Perpendicular Altitude from $Z$ to $XY$ (Point $P$):**\n   - Place needle at $Z$ and strike an arc cutting $XY$ at two distinct points.\n   - From those two points, strike equal arcs below $XY$ to intersect.\n   - Rule a straight vertical line from $Z$ passing through the intersection to cross $XY$ at point $P$."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your completed construction in (a):\n(i) Measure the length of side $|XZ|$;\n(ii) Measure the altitude $|ZP|$;\n(iii) Calculate, correct to the nearest whole number, the area of triangle $XYZ$.",
        "workedSolution": "**(i) Measuring length $|XZ|$:**\n- In $\\triangle XYZ$, the third angle is $\\angle XZY = 180^\\circ - (60^\\circ + 30^\\circ) = 90^\\circ$ (right-angled at $Z$):\n  $$|XZ| = |XY| \\cos 60^\\circ = 10.0 \\times 0.5 = 5.0\\text{ cm}$$\n$$\\mathbf{|XZ| = 5.0\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(ii) Measuring altitude $|ZP|$:**\n- In right-angled triangle $\\triangle XPZ$:\n  $$|ZP| = |XZ| \\sin 60^\\circ = 5.0 \\times 0.8660 = 4.33\\text{ cm}$$\n$$\\mathbf{|ZP| \\approx 4.3\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(iii) Calculating the area of triangle $XYZ$:**\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 10.0 \\times 4.33 = 5.0 \\times 4.33 = 21.65\\text{ cm}^2$$\nRounding to the nearest whole number:\n$$\\text{Area} \\approx 22\\text{ cm}^2$$\n\nTherefore, the area of triangle $XYZ$ is **$22\\text{ cm}^2$**."
      }
    ]
  },
  {
    "questionNumber": 5,
    "id": "MOCK11_P2_Q05",
    "marks": 15,
    "topic": "Stem-and-Leaf Representation and Discrete Probability",
    "subQuestions": [
      {
        "part": "a",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The following scores were obtained by $30\\text{ students}$ in a regional mathematics contest:\n$$25, 48, 36, 52, 61, 29, 34, 42, 55, 38, 45, 59, 28, 33, 47, 51, 64, 30, 41, 56, 37, 49, 53, 62, 35, 44, 50, 39, 46, 58$$\nConstruct an ordered stem-and-leaf plot to represent the distribution.",
        "workedSolution": "**Stem-and-Leaf Construction Protocol:**\n- Stems represent tens digits ($2, 3, 4, 5, 6$).\n- Leaves represent units digits arranged in ascending order:\n\n$$\\begin{array}{r|l} \\text{Stem} & \\text{Leaves} \\\\ \\hline 2 & 5, 8, 9 \\\\ 3 & 0, 3, 4, 5, 6, 7, 8, 9 \\\\ 4 & 1, 2, 4, 5, 6, 7, 8, 9 \\\\ 5 & 0, 1, 2, 3, 5, 6, 8, 9 \\\\ 6 & 1, 2, 4 \\end{array}$$\n\n**Neat Display:**\n- **Stem 2:** $5, 8, 9$ ($3$ leaves)\n- **Stem 3:** $0, 3, 4, 5, 6, 7, 8, 9$ ($8$ leaves)\n- **Stem 4:** $1, 2, 4, 5, 6, 7, 8, 9$ ($8$ leaves)\n- **Stem 5:** $0, 1, 2, 3, 5, 6, 8, 9$ ($8$ leaves)\n- **Stem 6:** $1, 2, 4$ ($3$ leaves)\n\n$$\\text{Key: } 3 \\mid 4 = 34\\text{ marks}$$\n$$\\text{Total observations } n = 3 + 8 + 8 + 8 + 3 = 30$$"
      },
      {
        "part": "b",
        "marks": 4,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your stem-and-leaf plot in (a), calculate:\n(i) the median score;\n(ii) the range of the scores.",
        "workedSolution": "**(i) Finding the median score:**\nSince $n = 30$ is even, the median is the average of the 15th and 16th values:\n- Counting through the ordered distribution:\n  - 15th value $= 45$\n  - 16th value $= 46$\n$$\\text{Median} = \\frac{45 + 46}{2} = 45.5$$\n\nTherefore, the median score is **$45.5$**.\n\n---\n\n**(ii) Finding the range:**\n$$\\text{Highest score} = 64$$\n$$\\text{Lowest score} = 25$$\n$$\\text{Range} = 64 - 25 = 39$$\n\nTherefore, the range of the scores is **$39$**."
      },
      {
        "part": "c",
        "marks": 4,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "If a student is selected at random from the contest, find the probability that the student scored:\n(i) strictly more than $50\\text{ marks}$;\n(ii) at most $35\\text{ marks}$.",
        "workedSolution": "**(i) Probability of scoring strictly more than 50 ($x > 50$):**\nScores $> 50$ on stems $5$ and $6$:\n- Stem 5: $51, 52, 53, 55, 56, 58, 59$ ($7$ scores)\n- Stem 6: $61, 62, 64$ ($3$ scores)\n$$n(x > 50) = 7 + 3 = 10$$\n$$P(x > 50) = \\frac{10}{30} = \\frac{1}{3}$$\n\nTherefore, the probability is **$\\frac{1}{3}$**.\n\n---\n\n**(ii) Probability of scoring at most 35 ($x \\le 35$):**\nScores $\\le 35$ on stems $2$ and $3$:\n- Stem 2: $25, 28, 29$ ($3$ scores)\n- Stem 3: $30, 33, 34, 35$ ($4$ scores)\n$$n(x \\le 35) = 3 + 4 = 7$$\n$$P(x \\le 35) = \\frac{7}{30}$$\n\nTherefore, the probability is **$\\frac{7}{30}$**."
      }
    ]
  },
  {
    "questionNumber": 6,
    "id": "MOCK11_P2_Q06",
    "marks": 15,
    "topic": "Linear Relations, Table of Values, and Coordinate Graphing",
    "subQuestions": [
      {
        "part": "a",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "(i) Copy and complete the table of values for the relations $y_1 = 3x - 1$ and $y_2 = 9 - 2x$ for the domain $-1 \\le x \\le 4$.\n\n| $x$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 3x - 1$ | $-4$ | | $2$ | | $8$ | |\n| $y_2 = 9 - 2x$ | $11$ | | $7$ | | $3$ | |\n\n(ii) Identify the point of intersection of the two lines from your completed table.",
        "workedSolution": "**(i) Completed Table:**\nEvaluate $y_1 = 3x - 1$:\n- $x = 0: y_1 = 3(0) - 1 = -1$\n- $x = 2: y_1 = 3(2) - 1 = 5$\n- $x = 4: y_1 = 3(4) - 1 = 11$\n\nEvaluate $y_2 = 9 - 2x$:\n- $x = 0: y_2 = 9 - 2(0) = 9$\n- $x = 2: y_2 = 9 - 2(2) = 5$\n- $x = 4: y_2 = 9 - 2(4) = 1$\n\n| $x$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 3x - 1$ | $-4$ | **$-1$** | $2$ | **$5$** | $8$ | **$11$** |\n| $y_2 = 9 - 2x$ | $11$ | **$9$** | $7$ | **$5$** | $3$ | **$1$** |\n\n---\n\n**(ii) Point of intersection:**\nAt $x = 2$, both relations give $y = 5$.\nTherefore, the point of intersection is **$(2, 5)$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"380\" viewBox=\"0 0 400 380\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"380\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"gridMK11\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"380\" fill=\"url(#gridMK11)\"/><line x1=\"20\" y1=\"260\" x2=\"380\" y2=\"260\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"140\" y1=\"20\" x2=\"140\" y2=\"360\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"385\" y=\"265\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"145\" y=\"25\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><line x1=\"80\" y1=\"320\" x2=\"320\" y2=\"60\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><text x=\"310\" y=\"50\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">y = 3x - 1</text><line x1=\"80\" y1=\"40\" x2=\"320\" y2=\"240\" stroke=\"#dc2626\" stroke-width=\"2.5\"/><text x=\"300\" y=\"260\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">y = 9 - 2x</text><circle cx=\"220\" cy=\"160\" r=\"4.5\" fill=\"#7c3aed\"/><text x=\"230\" y=\"155\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#7c3aed\">(2, 5)</text></svg>",
        "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on the $x$-axis and $2\\text{ cm}$ to $2\\text{ units}$ on the $y$-axis, draw two perpendicular axes $Ox$ and $Oy$ on a graph sheet for $-2 \\le x \\le 5$ and $-6 \\le y \\le 12$.\nPlot both lines on the same graph sheet and label them clearly.",
        "workedSolution": "**Graph Execution Protocol:**\n1. Calibrate $x$-axis: $2\\text{ cm} = 1\\text{ unit}$ ($-2$ to $5$).\n2. Calibrate $y$-axis: $2\\text{ cm} = 2\\text{ units}$ ($-6$ to $12$).\n3. Plot coordinates for $y_1 = 3x - 1$: $(-1, -4), (0, -1), (1, 2), (2, 5), (3, 8), (4, 11)$ and draw the line.\n4. Plot coordinates for $y_2 = 9 - 2x$: $(-1, 11), (0, 9), (1, 7), (2, 5), (3, 3), (4, 1)$ and draw the line.\n5. Label both straight lines and their intersection point $(2, 5)$."
      },
      {
        "part": "c",
        "marks": 3,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your graph, find:\n(i) the gradient of line $y = 9 - 2x$;\n(ii) the value of $x$ when $3x - 1 = 0$.",
        "workedSolution": "**(i) Gradient of line $y = 9 - 2x$:**\n$$m = -2$$\n\n---\n\n**(ii) Value of $x$ when $3x - 1 = 0$ ($x$-intercept):**\n$$3x = 1 \\implies x = \\frac{1}{3} \\approx 0.33$$\nFrom graph reading: **$x \\approx 0.3$ (tolerance $\\pm 0.1$)**."
      }
    ]
  }
];

export const allRawMathMock11TheoryQuestions: CurriculumQuestion[] = rawMathMock11Paper2Questions.map((q) => ({
  id: `math_m11_p2_q${q.questionNumber}`,
  number: q.questionNumber,
  questionNumber: q.questionNumber,
  prompt: q.subQuestions.map(sq => `(${sq.part}) ${sq.questionText}`).join('\n\n'),
  options: [],
  correctAnswer: '',
  hint: `Review ${q.topic} principles under the NaCCA syllabus.`,
  workedSolution: q.subQuestions.map(sq => `### Part (${sq.part}) [${sq.marks} marks]\n${sq.workedSolution}`).join('\n\n'),
  points: q.marks,
  topic: q.topic,
  section: 'theory',
  format: 'theory',
  hasDiagram: q.subQuestions.some(sq => sq.hasDiagram),
  svgDiagram: q.subQuestions.find(sq => sq.hasDiagram)?.svgDiagram || undefined,
  subQuestions: q.subQuestions
}));

export const SET_BECE_MOCK_11_MATH_P2: CurriculumQuestionSet = {
  id: "math_mock_11_p2",
  title: "BECE Mathematics National Mock 11 (Paper 2 Theory)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 11 Paper 2",
  variantType: "past_paper_variant",
  totalQuestions: 6,
  version: 1,
  format: 'theory',
  paperType: 2,
  year: 2026,
  era: 'modern',
  isMock: true,
  instructions: "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
  timeAllowed: "1 hour",
  durationMinutes: 60,
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_11/paper_2",
  questions: allRawMathMock11TheoryQuestions
};

export const SET_BECE_MOCK_11_MATH_COMPLETE: CurriculumQuestionSet = {
  id: "math_mock_11_complete",
  title: "BECE Mathematics National Mock 11 (Comprehensive P1 & P2)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 11 Comprehensive",
  variantType: "past_paper_variant",
  totalQuestions: 46,
  version: 1,
  format: 'mixed',
  paperType: 1,
  year: 2026,
  era: 'modern',
  isMock: true,
  instructions: "Paper 1: 40 Multiple Choice Questions (60 minutes). Paper 2: Answer 4 of 6 Theory questions (60 minutes). Show all working clearly.",
  timeAllowed: "2 hours",
  durationMinutes: 120,
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_11/complete",
  questions: [...SET_BECE_MOCK_11_MATH_P1.questions, ...allRawMathMock11TheoryQuestions]
};
