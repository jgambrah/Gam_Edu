/**
 * JHS Curriculum Data - BECE Mathematics National Mock 4
 * Standardized Isomorphic Examination Suite (Paper 1 CBT + Paper 2 Theory)
 *
 * Proprietary Content © GAM IT Solutions (GAM EDU). All rights reserved.
 * Curriculum Alignment: NaCCA JHS Common Core Programme / WAEC Standards
 */

import { CurriculumQuestionSet } from '../types';
import { MathMockObjectiveQuestion } from './bece-math-mock-1';

export const allRawMathMock4Questions: MathMockObjectiveQuestion[] = [
  {
    "number": 1,
    "id": "MOCK04_P1_Q01",
    "prompt": "If $A = \\{x : x \\text{ is a factor of } 45\\}$ and $B = \\{x : x \\text{ is a multiple of } 3 \\text{ less than } 20\\}$, find $n(A \\cap B)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3$",
      "B. $2$",
      "C. $4$",
      "D. $5$"
    ],
    "correctAnswer": "A",
    "hint": "List the factors of 45 and multiples of 3 below 20, then count common elements.",
    "workedSolution": "List the elements of each set:\n$$A = \\{1, 3, 5, 9, 15, 45\\}$$\n$$B = \\{3, 6, 9, 12, 15, 18\\}$$\nFind the intersection:\n$$A \\cap B = \\{3, 9, 15\\}$$\n$$n(A \\cap B) = 3$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Sets and Operations on Sets"
  },
  {
    "number": 2,
    "id": "MOCK04_P1_Q02",
    "prompt": "Evaluate $\\frac{0.072 \\times 0.25}{0.009}$ without using a calculator, expressing your answer in standard form.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2.0 \\times 10^0$",
      "B. $2.0 \\times 10^{-1}$",
      "C. $2.0 \\times 10^1$",
      "D. $2.0 \\times 10^2$"
    ],
    "correctAnswer": "A",
    "hint": "Simplify $0.072 / 0.009 = 8$, then multiply by $0.25$.",
    "workedSolution": "Notice that $\\frac{0.072}{0.009} = 8$:\n$$8 \\times 0.25 = 2$$\nIn scientific notation (standard form):\n$$2 = 2.0 \\times 10^0$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Standard Form and Decimals"
  },
  {
    "number": 3,
    "id": "MOCK04_P1_Q03",
    "prompt": "Express $240$ as a product of prime factors in index notation.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2^4 \\times 3 \\times 5$",
      "B. $2^3 \\times 3 \\times 5$",
      "C. $2^4 \\times 3^2 \\times 5$",
      "D. $2^3 \\times 3^2 \\times 5$"
    ],
    "correctAnswer": "A",
    "hint": "Divide repeatedly by the lowest prime factor 2 until reaching 15, then factorize 15.",
    "workedSolution": "$$240 = 2 \\times 120 = 2^2 \\times 60 = 2^3 \\times 30 = 2^4 \\times 15 = 2^4 \\times 3 \\times 5$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Prime Factorization"
  },
  {
    "number": 4,
    "id": "MOCK04_P1_Q04",
    "prompt": "The diagram shows a circle of radius $21\\text{ cm}$ with an arc $AB$ subtending an angle of $60^\\circ$ at the centre $O$. Calculate the length of arc $AB$. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"220\" viewBox=\"0 0 240 220\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M 40 170 L 190 170 A 150 150 0 0 0 115 40 Z\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"40\" cy=\"170\" r=\"3.5\" fill=\"#0f172a\"/><path d=\"M 75 170 A 35 35 0 0 0 58 139\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"72\" y=\"155\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">60°</text><text x=\"25\" y=\"185\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">O</text><text x=\"195\" y=\"185\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"110\" y=\"32\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"100\" y=\"185\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">21 cm</text></svg>",
    "options": [
      "A. $11\\text{ cm}$",
      "B. $44\\text{ cm}$",
      "C. $33\\text{ cm}$",
      "D. $22\\text{ cm}$"
    ],
    "correctAnswer": "D",
    "hint": "Use formula $\\text{Arc length} = \\frac{\\theta}{360^\\circ} \\times 2\\pi r$.",
    "workedSolution": "$$\\text{Length of arc } AB = \\frac{\\theta}{360^\\circ} \\times 2\\pi r = \\frac{60^\\circ}{360^\\circ} \\times 2 \\times \\frac{22}{7} \\times 21 = \\frac{1}{6} \\times 132 = 22\\text{ cm}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Length of Arc"
  },
  {
    "number": 5,
    "id": "MOCK04_P1_Q05",
    "prompt": "Solve for $x$ in the equation: $\\frac{x - 3}{2} - \\frac{x - 1}{5} = 2$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $7$",
      "B. $9$",
      "C. $13$",
      "D. $11$"
    ],
    "correctAnswer": "D",
    "hint": "Multiply every term by $\\text{LCM}(2, 5) = 10$ to clear denominators.",
    "workedSolution": "$$5(x - 3) - 2(x - 1) = 20$$\n$$5x - 15 - 2x + 2 = 20$$\n$$3x - 13 = 20 \\implies 3x = 33 \\implies x = 11$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Linear Equations"
  },
  {
    "number": 6,
    "id": "MOCK04_P1_Q06",
    "prompt": "The diagram shows a kite $ABCD$ with perpendicular diagonals intersecting at $M$. If $|AC| = 16\\text{ cm}$ and $|BD| = 10\\text{ cm}$, calculate the area of the kite.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"260\" viewBox=\"0 0 240 260\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"120,20 200,90 120,240 40,90\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"120\" y1=\"20\" x2=\"120\" y2=\"240\" stroke=\"#dc2626\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><line x1=\"40\" y1=\"90\" x2=\"200\" y2=\"90\" stroke=\"#0284c7\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><circle cx=\"120\" cy=\"90\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"115\" y=\"15\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"205\" y=\"95\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"115\" y=\"255\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"25\" y=\"95\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">D</text><text x=\"125\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">M</text></svg>",
    "options": [
      "A. $60\\text{ cm}^2$",
      "B. $160\\text{ cm}^2$",
      "C. $120\\text{ cm}^2$",
      "D. $80\\text{ cm}^2$"
    ],
    "correctAnswer": "D",
    "hint": "Area of a kite is half the product of its diagonals: $\\frac{1}{2} d_1 d_2$.",
    "workedSolution": "The area of a kite is half the product of the lengths of its diagonals:\n$$\\text{Area} = \\frac{1}{2} d_1 d_2 = \\frac{1}{2} \\times |AC| \\times |BD| = \\frac{1}{2} \\times 16 \\times 10 = 80\\text{ cm}^2$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Area of Quadrilaterals"
  },
  {
    "number": 7,
    "id": "MOCK04_P1_Q07",
    "prompt": "Find the simple interest on $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,500.00$ saved for $2\\text{ years } 6\\text{ months}$ at $6\\%$ per annum.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 180.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 275.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 250.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 225.00$"
    ],
    "correctAnswer": "D",
    "hint": "Convert 2 years 6 months into $2.5$ years, then apply $I = \\frac{PRT}{100}$.",
    "workedSolution": "$$T = 2.5\\text{ years} = \\frac{5}{2}\\text{ years}$$\n$$I = \\frac{P \\times R \\times T}{100} = \\frac{1,500 \\times 6 \\times 2.5}{100} = 15 \\times 15 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 225.00$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Simple Interest"
  },
  {
    "number": 8,
    "id": "MOCK04_P1_Q08",
    "prompt": "Factorize completely: $12m^2n - 18mn^2$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6mn(2m - 3n)$",
      "B. $6mn(2m + 3n)$",
      "C. $3mn(4m - 6n)$",
      "D. $6m^2n(2 - 3n)$"
    ],
    "correctAnswer": "A",
    "hint": "Identify the greatest common factor $6mn$ and factor it out.",
    "workedSolution": "Find the highest common factor of the coefficients and variable terms:\n$$\\text{HCF}(12, 18) = 6, \\quad \\text{HCF}(m^2n, mn^2) = mn$$\n$$12m^2n - 18mn^2 = 6mn(2m - 3n)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Factorization"
  },
  {
    "number": 9,
    "id": "MOCK04_P1_Q09",
    "prompt": "Solve the inequality: $5 - 3x < 17$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $x < -4$",
      "B. $x > 4$",
      "C. $x < 4$",
      "D. $x > -4$"
    ],
    "correctAnswer": "D",
    "hint": "Remember to reverse the inequality sign when dividing by negative 3.",
    "workedSolution": "$$-3x < 17 - 5$$\n$$-3x < 12$$\nDivide both sides by $-3$ and reverse the inequality sign:\n$$x > \\frac{12}{-3} \\implies x > -4$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 10,
    "id": "MOCK04_P1_Q10",
    "prompt": "The angles of a triangle are in the ratio $2 : 3 : 5$. What is the size of the smallest angle?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $18^\\circ$",
      "B. $90^\\circ$",
      "C. $54^\\circ$",
      "D. $36^\\circ$"
    ],
    "correctAnswer": "D",
    "hint": "Total parts $= 2 + 3 + 5 = 10$. Compute $\\frac{2}{10} \\times 180^\\circ$.",
    "workedSolution": "Sum of interior angles of a triangle is $180^\\circ$:\n$$\\text{Total parts} = 2 + 3 + 5 = 10$$\n$$\\text{Smallest angle} = \\frac{2}{10} \\times 180^\\circ = 36^\\circ$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Ratio and Angles in Triangles"
  },
  {
    "number": 11,
    "id": "MOCK04_P1_Q11",
    "prompt": "The diagram shows a pair of intersecting lines forming vertically opposite and supplementary angles. Find the value of $y$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"180\" viewBox=\"0 0 280 180\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"30\" y1=\"140\" x2=\"250\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"40\" y1=\"40\" x2=\"240\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><circle cx=\"140\" cy=\"90\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"130\" y=\"60\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">124°</text><text x=\"180\" y=\"95\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0284c7\">y</text></svg>",
    "options": [
      "A. $46^\\circ$",
      "B. $124^\\circ$",
      "C. $66^\\circ$",
      "D. $56^\\circ$"
    ],
    "correctAnswer": "D",
    "hint": "Adjacent angles on a straight line sum to $180^\\circ$.",
    "workedSolution": "Angles on a straight line add up to $180^\\circ$:\n$$y + 124^\\circ = 180^\\circ$$\n$$y = 180^\\circ - 124^\\circ = 56^\\circ$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Plane Geometry: Angles on Straight Lines"
  },
  {
    "number": 12,
    "id": "MOCK04_P1_Q12",
    "prompt": "A factory pack contains $12$ yellow rulers, $18$ blue rulers, and $10$ green rulers. What is the probability that a ruler picked at random is blue?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{3}{10}$",
      "B. $\\frac{11}{20}$",
      "C. $\\frac{1}{4}$",
      "D. $\\frac{9}{20}$"
    ],
    "correctAnswer": "D",
    "hint": "Total rulers is $12 + 18 + 10 = 40$. Compute $\\frac{18}{40}$.",
    "workedSolution": "$$\\text{Total rulers } n(S) = 12 + 18 + 10 = 40$$\n$$\\text{Blue rulers } n(E) = 18$$\n$$P(\\text{blue}) = \\frac{18}{40} = \\frac{9}{20}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 13,
    "id": "MOCK04_P1_Q13",
    "prompt": "The image of point $M(-3, 8)$ under a reflection in the $x$-axis is:",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(3, 8)$",
      "B. $(-3, -8)$",
      "C. $(3, -8)$",
      "D. $(8, -3)$"
    ],
    "correctAnswer": "B",
    "hint": "Reflection in the $x$-axis preserves $x$ and negates $y$: $(x, y) \\to (x, -y)$.",
    "workedSolution": "Under a reflection in the $x$-axis, the transformation rule is $(x, y) \\to (x, -y)$:\n$$M(-3, 8) \\to M'(-3, -8)$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Reflection"
  },
  {
    "number": 14,
    "id": "MOCK04_P1_Q14",
    "prompt": "Make $t$ the subject of the relation: $v = u + \\frac{1}{2}at$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $t = \\frac{2(v - u)}{a}$",
      "B. $t = \\frac{v - u}{2a}$",
      "C. $t = \\frac{2v - u}{a}$",
      "D. $t = 2(v - u)a$"
    ],
    "correctAnswer": "A",
    "hint": "Subtract $u$ from both sides, multiply by 2, then divide by $a$.",
    "workedSolution": "$$v - u = \\frac{1}{2}at$$\nMultiply both sides by $2$:\n$$2(v - u) = at$$\nDivide by $a$:\n$$t = \\frac{2(v - u)}{a}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Change of Subject"
  },
  {
    "number": 15,
    "id": "MOCK04_P1_Q15",
    "prompt": "The volume of a cube is $343\\text{ cm}^3$. Calculate the total surface area of the cube.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $196\\text{ cm}^2$",
      "B. $245\\text{ cm}^2$",
      "C. $343\\text{ cm}^2$",
      "D. $294\\text{ cm}^2$"
    ],
    "correctAnswer": "D",
    "hint": "Find side $s = \\sqrt[3]{343} = 7$, then calculate total area $= 6s^2$.",
    "workedSolution": "$$V = s^3 = 343 \\implies s = \\sqrt[3]{343} = 7\\text{ cm}$$\nA cube has $6$ identical square faces:\n$$\\text{Total Surface Area} = 6s^2 = 6(7^2) = 6(49) = 294\\text{ cm}^2$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Cube Surface Area"
  },
  {
    "number": 16,
    "id": "MOCK04_P1_Q16",
    "prompt": "A motorist drove at an average speed of $84\\text{ km/h}$ for $2\\text{ hours } 15\\text{ minutes}$. Calculate the total distance covered.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $168\\text{ km}$",
      "B. $178\\text{ km}$",
      "C. $189\\text{ km}$",
      "D. $196\\text{ km}$"
    ],
    "correctAnswer": "C",
    "hint": "Convert $2\\text{ h } 15\\text{ min}$ into $2.25\\text{ hours}$, then multiply by $84$.",
    "workedSolution": "$$T = 2\\text{ h } 15\\text{ min} = 2.25\\text{ hours} = \\frac{9}{4}\\text{ hours}$$\n$$\\text{Distance} = \\text{Speed} \\times \\text{Time} = 84 \\times \\frac{9}{4} = 21 \\times 9 = 189\\text{ km}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Speed, Distance, and Time"
  },
  {
    "number": 17,
    "id": "MOCK04_P1_Q17",
    "prompt": "Find the gradient (slope) of the line passing through points $A(2, -5)$ and $B(-3, 10)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $-3$",
      "B. $-\\frac{1}{3}$",
      "C. $\\frac{1}{3}$",
      "D. $3$"
    ],
    "correctAnswer": "A",
    "hint": "Use the slope formula $m = \\frac{y_2 - y_1}{x_2 - x_1}$.",
    "workedSolution": "$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{10 - (-5)}{-3 - 2} = \\frac{15}{-5} = -3$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Gradient"
  },
  {
    "number": 18,
    "id": "MOCK04_P1_Q18",
    "prompt": "The diagram shows a right-angled triangle $PQR$. Find the length of side $PR$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"180\" viewBox=\"0 0 260 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 220,140 40,30\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"40,125 55,125 55,140\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"25\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">Q</text><text x=\"230\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">R</text><text x=\"30\" y=\"25\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">P</text><text x=\"15\" y=\"90\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">9 cm</text><text x=\"120\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">12 cm</text></svg>",
    "options": [
      "A. $13\\text{ cm}$",
      "B. $14\\text{ cm}$",
      "C. $15\\text{ cm}$",
      "D. $18\\text{ cm}$"
    ],
    "correctAnswer": "C",
    "hint": "Use Pythagoras' Theorem: $|PR| = \\sqrt{9^2 + 12^2}$.",
    "workedSolution": "By Pythagoras' Theorem:\n$$|PR|^2 = |PQ|^2 + |QR|^2 = 9^2 + 12^2 = 81 + 144 = 225$$\n$$|PR| = \\sqrt{225} = 15\\text{ cm}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Pythagoras' Theorem"
  },
  {
    "number": 19,
    "id": "MOCK04_P1_Q19",
    "prompt": "Arrange the following numbers in descending order: $0.62, \\frac{5}{8}, 65\\%, \\frac{3}{5}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $65\\%, \\frac{5}{8}, 0.62, \\frac{3}{5}$",
      "B. $\\frac{5}{8}, 65\\%, 0.62, \\frac{3}{5}$",
      "C. $65\\%, 0.62, \\frac{5}{8}, \\frac{3}{5}$",
      "D. $\\frac{3}{5}, 0.62, \\frac{5}{8}, 65\\%$"
    ],
    "correctAnswer": "A",
    "hint": "Convert all fractions and percentages into three-decimal-place numbers: $0.620, 0.625, 0.650, 0.600$.",
    "workedSolution": "Convert all values to decimals:\n- $0.62 = 0.620$\n- $\\frac{5}{8} = 0.625$\n- $65\\% = 0.650$\n- $\\frac{3}{5} = 0.600$\nComparing from largest to smallest:\n$$0.650 > 0.625 > 0.620 > 0.600 \\implies 65\\%, \\frac{5}{8}, 0.62, \\frac{3}{5}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Ordering Fractions and Decimals"
  },
  {
    "number": 20,
    "id": "MOCK04_P1_Q20",
    "prompt": "If $\\begin{pmatrix} 2a \\\\ 7 \\end{pmatrix} + \\begin{pmatrix} 4 \\\\ b \\end{pmatrix} = \\begin{pmatrix} 10 \\\\ -3 \\end{pmatrix}$, find the values of $a$ and $b$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $a = 3, b = 10$",
      "B. $a = 3, b = -10$",
      "C. $a = -3, b = -10$",
      "D. $a = 7, b = 4$"
    ],
    "correctAnswer": "B",
    "hint": "Equate corresponding vector components: $2a + 4 = 10$ and $7 + b = -3$.",
    "workedSolution": "Top components:\n$$2a + 4 = 10 \\implies 2a = 6 \\implies a = 3$$\nBottom components:\n$$7 + b = -3 \\implies b = -3 - 7 = -10$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Vectors: Column Addition"
  },
  {
    "number": 21,
    "id": "MOCK04_P1_Q21",
    "prompt": "The table below shows the distribution of ages of students in a junior debating society. Find the modal age.\n\n$$\\begin{array}{|l|c|c|c|c|c|} \\hline \\textbf{Age (years)} & 12 & 13 & 14 & 15 & 16 \\\\ \\hline \\textbf{Frequency} & 5 & 11 & 8 & 11 & 3 \\\\ \\hline \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $13\\text{ years only}$",
      "B. $14\\text{ years}$",
      "C. $13\\text{ and } 15\\text{ years (bimodal)}$",
      "D. $11\\text{ years}$"
    ],
    "correctAnswer": "C",
    "hint": "Identify the highest frequency and observe that both 13 and 15 share the peak frequency.",
    "workedSolution": "The highest frequency is $11$, which occurs at two distinct ages: $13$ and $15$. The distribution is bimodal with modes $13\\text{ years}$ and $15\\text{ years}$.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics: Mode"
  },
  {
    "number": 22,
    "id": "MOCK04_P1_Q22",
    "prompt": "Find the sum of the interior angles of a convex polygon with $9\\text{ sides}$ (nonagon).",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1,080^\\circ$",
      "B. $1,260^\\circ$",
      "C. $1,440^\\circ$",
      "D. $1,620^\\circ$"
    ],
    "correctAnswer": "B",
    "hint": "Apply the interior angle sum formula: $(n - 2) \\times 180^\\circ$.",
    "workedSolution": "$$\\text{Sum} = (n - 2) \\times 180^\\circ = (9 - 2) \\times 180^\\circ = 7 \\times 180^\\circ = 1,260^\\circ$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Polygons and Interior Angles"
  },
  {
    "number": 23,
    "id": "MOCK04_P1_Q23",
    "prompt": "A piece of cloth of length $14.4\\text{ m}$ is shared equally among $16$ dressmakers. How long is each share in centimetres?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $80\\text{ cm}$",
      "B. $85\\text{ cm}$",
      "C. $90\\text{ cm}$",
      "D. $95\\text{ cm}$"
    ],
    "correctAnswer": "C",
    "hint": "Convert $14.4\\text{ m}$ to $1,440\\text{ cm}$ before dividing by 16.",
    "workedSolution": "$$14.4\\text{ m} = 14.4 \\times 100 = 1,440\\text{ cm}$$\n$$\\text{Share} = \\frac{1,440}{16} = 90\\text{ cm}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Units of Measurement"
  },
  {
    "number": 24,
    "id": "MOCK04_P1_Q24",
    "prompt": "The bearing of point $R$ from point $S$ is $245^\\circ$. What is the bearing of point $S$ from point $R$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $065^\\circ$",
      "B. $075^\\circ$",
      "C. $115^\\circ$",
      "D. $205^\\circ$"
    ],
    "correctAnswer": "A",
    "hint": "Since the forward bearing exceeds $180^\\circ$, subtract $180^\\circ$ to find the back bearing.",
    "workedSolution": "Since forward bearing $\\theta = 245^\\circ > 180^\\circ$:\n$$\\text{Back bearing} = 245^\\circ - 180^\\circ = 065^\\circ$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Bearings"
  },
  {
    "number": 25,
    "id": "MOCK04_P1_Q25",
    "prompt": "Given that $f(x) = 2x^2 - 3x + 1$, evaluate $f(-2)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3$",
      "B. $7$",
      "C. $11$",
      "D. $15$"
    ],
    "correctAnswer": "D",
    "hint": "Carefully substitute $x = -2$: $(-2)^2 = 4$ and $-3(-2) = +6$.",
    "workedSolution": "$$f(-2) = 2(-2)^2 - 3(-2) + 1 = 2(4) + 6 + 1 = 8 + 6 + 1 = 15$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Functions and Mappings"
  },
  {
    "number": 26,
    "id": "MOCK04_P1_Q26",
    "prompt": "A trader bought $50\\text{ kg}$ of sugar for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 350.00$ and retailed it in small packets at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 8.40$ per kilogram. Find the percentage profit.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $15\\%$",
      "B. $20\\%$",
      "C. $25\\%$",
      "D. $30\\%$"
    ],
    "correctAnswer": "B",
    "hint": "Compute total selling price $50 \\times 8.40 = 420$, find profit 70, then calculate $\\frac{70}{350} \\times 100\\%$.",
    "workedSolution": "$$\\text{Total revenue} = 50 \\times 8.40 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 420.00$$\n$$\\text{Profit} = 420.00 - 350.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 70.00$$\n$$\\text{Percentage profit} = \\left(\\frac{70}{350}\\right) \\times 100\\% = \\frac{1}{5} \\times 100\\% = 20\\%$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Profit and Loss"
  },
  {
    "number": 27,
    "id": "MOCK04_P1_Q27",
    "prompt": "The diagram shows a cyclic quadrilateral $PQRS$. If $\\angle PQR = 85^\\circ$ and $\\angle QPS = 72^\\circ$, calculate the value of $\\angle QRS$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"240\" viewBox=\"0 0 240 240\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"120\" cy=\"120\" r=\"90\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><polygon points=\"120,30 205,100 150,205 45,150\" fill=\"#38bdf8\" fill-opacity=\"0.15\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"115\" y=\"22\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">P</text><text x=\"212\" y=\"105\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Q</text><text x=\"150\" y=\"222\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">R</text><text x=\"28\" y=\"155\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">S</text><text x=\"175\" y=\"100\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">85°</text><text x=\"110\" y=\"50\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">72°</text></svg>",
    "options": [
      "A. $95^\\circ$",
      "B. $108^\\circ$",
      "C. $118^\\circ$",
      "D. $125^\\circ$"
    ],
    "correctAnswer": "B",
    "hint": "Opposite angles in a cyclic quadrilateral sum up to $180^\\circ$: $\\angle QPS + \\angle QRS = 180^\\circ$.",
    "workedSolution": "Opposite angles of a cyclic quadrilateral sum to $180^\\circ$:\n$$\\angle QPS + \\angle QRS = 180^\\circ$$\n$$72^\\circ + \\angle QRS = 180^\\circ \\implies \\angle QRS = 180^\\circ - 72^\\circ = 108^\\circ$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Circle Theorems"
  },
  {
    "number": 28,
    "id": "MOCK04_P1_Q28",
    "prompt": "Simplify the expression: $4(2a - b) - 3(a - 2b)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $5a + 2b$",
      "B. $5a - 10b$",
      "C. $5a + 5b$",
      "D. $11a + 2b$"
    ],
    "correctAnswer": "A",
    "hint": "Expand brackets: $8a - 4b - 3a + 6b$, then combine like terms.",
    "workedSolution": "$$4(2a - b) - 3(a - 2b) = 8a - 4b - 3a + 6b = (8a - 3a) + (-4b + 6b) = 5a + 2b$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Simplification"
  },
  {
    "number": 29,
    "id": "MOCK04_P1_Q29",
    "prompt": "How many lines of symmetry has an equilateral triangle?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1$",
      "B. $2$",
      "C. $3$",
      "D. $4$"
    ],
    "correctAnswer": "C",
    "hint": "Each of the 3 vertices connects to the midpoint of the opposite side.",
    "workedSolution": "An equilateral triangle has $3$ lines of symmetry, each passing from a vertex to the midpoint of the opposite side.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Symmetry"
  },
  {
    "number": 30,
    "id": "MOCK04_P1_Q30",
    "prompt": "Find the Least Common Multiple (LCM) of $15, 25,$ and $45$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $90$",
      "B. $150$",
      "C. $225$",
      "D. $450$"
    ],
    "correctAnswer": "C",
    "hint": "Express as prime powers: $15 = 3 \\times 5$, $25 = 5^2$, $45 = 3^2 \\times 5$. The LCM takes highest powers: $3^2 \\times 5^2$.",
    "workedSolution": "$$15 = 3 \\times 5, \\quad 25 = 5^2, \\quad 45 = 3^2 \\times 5$$\n$$\\text{LCM} = 3^2 \\times 5^2 = 9 \\times 25 = 225$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Number Theory and LCM"
  },
  {
    "number": 31,
    "id": "MOCK04_P1_Q31",
    "prompt": "The point $Q(4, -6)$ is rotated $90^\\circ$ anti-clockwise about the origin. Find its new coordinates $Q'$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(6, 4)$",
      "B. $(-6, 4)$",
      "C. $(6, -4)$",
      "D. $(-4, 6)$"
    ],
    "correctAnswer": "A",
    "hint": "The rule for $90^\\circ$ anti-clockwise rotation is $(x, y) \\to (-y, x)$.",
    "workedSolution": "Rotation $90^\\circ$ anti-clockwise: $(x, y) \\to (-y, x)$:\n$$Q(4, -6) \\to Q'(-(-6), 4) = (6, 4)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Rotation"
  },
  {
    "number": 32,
    "id": "MOCK04_P1_Q32",
    "prompt": "A map of Ghana has a scale of $1 : 2,000,000$. What distance in kilometres is represented by $3.5\\text{ cm}$ on the map?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $35\\text{ km}$",
      "B. $70\\text{ km}$",
      "C. $140\\text{ km}$",
      "D. $700\\text{ km}$"
    ],
    "correctAnswer": "B",
    "hint": "Multiply $3.5$ by $2,000,000\\text{ cm} = 7,000,000\\text{ cm}$, then convert to kilometres ($100,000\\text{ cm} = 1\\text{ km}$).",
    "workedSolution": "$$\\text{Actual distance} = 3.5 \\times 2,000,000\\text{ cm} = 7,000,000\\text{ cm}$$\nConvert to metres: $70,000\\text{ m}$.\nConvert to kilometres: $70\\text{ km}$.\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Scale and Proportion"
  },
  {
    "number": 33,
    "id": "MOCK04_P1_Q33",
    "prompt": "The diagram shows a frequency polygon of marks scored in an ICT quiz. How many candidates took part in the quiz?",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"320\" height=\"200\" viewBox=\"0 0 320 200\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"40\" y1=\"160\" x2=\"290\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"40\" y1=\"20\" x2=\"40\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2\"/><polyline points=\"60,160 100,80 140,40 180,60 220,110 260,160\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"100\" cy=\"80\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"140\" cy=\"40\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"180\" cy=\"60\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"220\" cy=\"110\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"95\" y=\"175\" font-family=\"sans-serif\" font-size=\"10\">2</text><text x=\"135\" y=\"175\" font-family=\"sans-serif\" font-size=\"10\">4</text><text x=\"175\" y=\"175\" font-family=\"sans-serif\" font-size=\"10\">6</text><text x=\"215\" y=\"175\" font-family=\"sans-serif\" font-size=\"10\">8</text><text x=\"25\" y=\"85\" font-family=\"sans-serif\" font-size=\"10\">8</text><text x=\"20\" y=\"45\" font-family=\"sans-serif\" font-size=\"10\">12</text><text x=\"20\" y=\"65\" font-family=\"sans-serif\" font-size=\"10\">10</text><text x=\"25\" y=\"115\" font-family=\"sans-serif\" font-size=\"10\">5</text></svg>",
    "options": [
      "A. $25$",
      "B. $30$",
      "C. $35$",
      "D. $40$"
    ],
    "correctAnswer": "C",
    "hint": "Sum up the vertical frequency values at each plotted point: $8 + 12 + 10 + 5$.",
    "workedSolution": "Sum of frequencies at marked score points:\n$$f = 8 + 12 + 10 + 5 = 35$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics: Frequency Graphs"
  },
  {
    "number": 34,
    "id": "MOCK04_P1_Q34",
    "prompt": "If $2^{2x + 1} = 128$, find the value of $x$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2$",
      "B. $3$",
      "C. $4$",
      "D. $5$"
    ],
    "correctAnswer": "B",
    "hint": "Express 128 as power of base 2: $128 = 2^7$. Equate exponents.",
    "workedSolution": "$$128 = 2^7$$\n$$2^{2x + 1} = 2^7 \\implies 2x + 1 = 7 \\implies 2x = 6 \\implies x = 3$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Indices and Exponents"
  },
  {
    "number": 35,
    "id": "MOCK04_P1_Q35",
    "prompt": "A cylindrical bucket of base radius $14\\text{ cm}$ and height $20\\text{ cm}$ is two-fifths full of water. Find the volume of water in the bucket. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2,464\\text{ cm}^3$",
      "B. $4,928\\text{ cm}^3$",
      "C. $6,160\\text{ cm}^3$",
      "D. $12,320\\text{ cm}^3$"
    ],
    "correctAnswer": "B",
    "hint": "Calculate total cylinder volume $V = \\pi r^2 h$, then multiply by $\\frac{2}{5}$.",
    "workedSolution": "$$\\text{Total Volume} = \\pi r^2 h = \\frac{22}{7} \\times 14^2 \\times 20 = 22 \\times 28 \\times 20 = 12,320\\text{ cm}^3$$\n$$\\text{Water Volume} = \\frac{2}{5} \\times 12,320 = 2 \\times 2,464 = 4,928\\text{ cm}^3$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Mensuration: Cylinders"
  },
  {
    "number": 36,
    "id": "MOCK04_P1_Q36",
    "prompt": "Find the rule governing the mapping below:\n$$\\begin{array}{cccccc} x & 1 & 2 & 3 & 4 & 5 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 1 & 5 & 9 & 13 & 17 \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $y = 3x - 2$",
      "B. $y = 4x - 3$",
      "C. $y = 5x - 4$",
      "D. $y = 4x + 3$"
    ],
    "correctAnswer": "B",
    "hint": "Notice $y$ increases by 4 when $x$ increases by 1, so the gradient is 4. Test $y = 4(1) - 3 = 1$.",
    "workedSolution": "Common difference is $+4$, so $m = 4$. Form: $y = 4x + c$.\nFor $x = 1: 1 = 4(1) + c \\implies c = -3 \\implies y = 4x - 3$.\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Relations and Mappings"
  },
  {
    "number": 37,
    "id": "MOCK04_P1_Q37",
    "prompt": "Which of the following is an irrational number?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\sqrt{49}$",
      "B. $0.375$",
      "C. $\\sqrt{20}$",
      "D. $\\frac{22}{7}$"
    ],
    "correctAnswer": "C",
    "hint": "An irrational number cannot be expressed as a fraction of two integers. Check which root is not a perfect square.",
    "workedSolution": "- $\\sqrt{49} = 7$ (rational)\n- $0.375 = \\frac{3}{8}$ (rational)\n- $\\frac{22}{7}$ is a ratio of integers (rational)\n- $\\sqrt{20} = 2\\sqrt{5}$ cannot be expressed as a ratio of integers (irrational)\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Real Number System"
  },
  {
    "number": 38,
    "id": "MOCK04_P1_Q38",
    "prompt": "A line segment connects points $E(4, 7)$ and $F(-2, 1)$. Calculate the length of line segment $EF$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6$",
      "B. $6\\sqrt{2}$",
      "C. $8$",
      "D. $10$"
    ],
    "correctAnswer": "B",
    "hint": "Use distance formula $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.",
    "workedSolution": "$$|EF| = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} = \\sqrt{(-2 - 4)^2 + (1 - 7)^2} = \\sqrt{(-6)^2 + (-6)^2} = \\sqrt{36 + 36} = \\sqrt{72} = 6\\sqrt{2}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Distance Formula"
  },
  {
    "number": 39,
    "id": "MOCK04_P1_Q39",
    "prompt": "The mean of five test marks is $14$. When a sixth mark is added, the mean increases to $15$. Find the sixth mark.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $16$",
      "B. $18$",
      "C. $20$",
      "D. $22$"
    ],
    "correctAnswer": "C",
    "hint": "Sum of 6 marks $= 6 \\times 15 = 90$. Sum of 5 marks $= 5 \\times 14 = 70$.",
    "workedSolution": "$$\\text{Sum of 5 marks} = 5 \\times 14 = 70$$\n$$\\text{Sum of 6 marks} = 6 \\times 15 = 90$$\n$$\\text{Sixth mark} = 90 - 70 = 20$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics: Mean"
  },
  {
    "number": 40,
    "id": "MOCK04_P1_Q40",
    "prompt": "In the diagram, $ABCD$ is a parallelogram. If $\\angle DAB = 65^\\circ$, calculate the value of interior angle $\\angle ABC$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"160\" viewBox=\"0 0 280 160\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,130 180,130 240,40 100,40\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><text x=\"25\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"185\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"245\" y=\"38\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"95\" y=\"35\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">D</text><path d=\"M 70 130 A 30 30 0 0 1 58 104\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"72\" y=\"115\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">65°</text></svg>",
    "options": [
      "A. $65^\\circ$",
      "B. $105^\\circ$",
      "C. $115^\\circ$",
      "D. $125^\\circ$"
    ],
    "correctAnswer": "C",
    "hint": "Co-interior adjacent angles in any parallelogram are supplementary ($180^\\circ$).",
    "workedSolution": "Adjacent angles in a parallelogram are supplementary:\n$$\\angle DAB + \\angle ABC = 180^\\circ$$\n$$65^\\circ + \\angle ABC = 180^\\circ \\implies \\angle ABC = 180^\\circ - 65^\\circ = 115^\\circ$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Plane Geometry: Parallelograms"
  }
];

export const SET_BECE_MOCK_4_MATH_P1: CurriculumQuestionSet = {
  id: "math_mock_4",
  title: "BECE Mathematics National Mock 4 (Paper 1 Objective CBT)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 4 Paper 1",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_04/paper_1",
  questions: allRawMathMock4Questions.map((q) => ({
    id: `math_m4_q${q.number}`,
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

// Paper 2 questions placeholder (ready for paper 2 arrival)
export const rawMathMock4Paper2Questions = [
  {
    "questionNumber": 1,
    "id": "MOCK04_P2_Q01",
    "marks": 15,
    "topic": "Sets, Linear Inequalities, and Fraction Simplification",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"380\" height=\"240\" viewBox=\"0 0 380 240\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"10\" width=\"360\" height=\"220\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"35\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 65</text><circle cx=\"145\" cy=\"125\" r=\"72\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"235\" cy=\"125\" r=\"72\" fill=\"#10b981\" fill-opacity=\"0.2\" stroke=\"#059669\" stroke-width=\"2\"/><text x=\"110\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">B (Biology)</text><text x=\"240\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#047857\">C (Chemistry)</text><text x=\"105\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">26</text><text x=\"182\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">12</text><text x=\"255\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">20</text><text x=\"315\" y=\"205\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">7</text></svg>",
        "questionText": "In a form three class of $65\\text{ learners}$, $38$ study Biology ($B$), $32$ study Chemistry ($C$), and $12$ study both subjects. The remaining learners study neither subject.\n(i) Illustrate the information on a Venn diagram.\n(ii) Find the number of learners who study:\n    $(\\alpha)$ Biology only;\n    $(\\beta)$ exactly one of the two subjects;\n    $(\\gamma)$ neither Biology nor Chemistry.",
        "workedSolution": "**(i) Venn Diagram Representation:**\nUniversal set $n(U) = 65$.\n- Number studying Biology: $n(B) = 38$\n- Number studying Chemistry: $n(C) = 32$\n- Number studying both: $n(B \\cap C) = 12$\n\nRegion Breakdown:\n- Biology only: $n(B \\cap C') = 38 - 12 = 26$\n- Chemistry only: $n(B' \\cap C) = 32 - 12 = 20$\n- Both subjects: $n(B \\cap C) = 12$\n- Neither subject: $n(B \\cup C)' = 65 - (26 + 12 + 20) = 65 - 58 = 7$\n\n*(See the embedded SVG above for the complete, labeled illustration)*.\n\n---\n\n**(ii) ($a$) Learners who study Biology only:**\n$n(B \\cap C') = 38 - 12 = 26$\nTherefore, **$26\\text{ learners}$ study Biology only**.\n\n---\n\n**(ii) ($\\beta$) Learners who study exactly one subject:**\n$\\text{Only one subject} = n(B \\cap C') + n(B' \\cap C) = 26 + 20 = 46$\nTherefore, **$46\\text{ learners}$ study exactly one subject**.\n\n---\n\n**(ii) ($\\gamma$) Learners who study neither subject:**\n$n(B \\cup C)' = 65 - 58 = 7$\nTherefore, **$7\\text{ learners}$ study neither Biology nor Chemistry**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"80\" viewBox=\"0 0 360 80\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"40\" x2=\"340\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"35\" x2=\"60\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"35\" x2=\"120\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"35\" x2=\"180\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"35\" x2=\"240\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"300\" y1=\"35\" x2=\"300\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"55\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">-1</text><text x=\"117\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">0</text><text x=\"177\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">1</text><text x=\"237\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">2</text><text x=\"297\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">3</text><circle cx=\"237\" cy=\"25\" r=\"5\" fill=\"#0284c7\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><line x1=\"237\" y1=\"25\" x2=\"25\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"3\"/><polygon points=\"25,20 15,25 25,30\" fill=\"#0284c7\"/></svg>",
        "questionText": "(i) Solve the inequality: $\\frac{4x - 1}{3} - \\frac{x + 2}{2} \\le \\frac{5}{6}$.\n(ii) Illustrate the solution set on a number line.",
        "workedSolution": "**(i) Solving the inequality:**\n$\\frac{4x - 1}{3} - \\frac{x + 2}{2} \\le \\frac{5}{6}$\nMultiply through by the LCM of denominators ($6$):\n$6\\left(\\frac{4x - 1}{3}\\right) - 6\\left(\\frac{x + 2}{2}\\right) \\le 6\\left(\\frac{5}{6}\\right)$\n$2(4x - 1) - 3(x + 2) \\le 5$\n$8x - 2 - 3x - 6 \\le 5$\n$5x - 8 \\le 5$\n$5x \\le 5 + 8$\n$5x \\le 13 \\implies x \\le \\frac{13}{5} = 2\\frac{3}{5} = 2.6$\n\n**Truth set:** $\\mathbf{\\left\\{x : x \\le 2\\frac{3}{5}\\right\\}}$.\n\n---\n\n**(ii) Number Line Illustration:**\nMark a solid circle at $x = 2.6$ and draw an arrow extending leftward indefinitely towards negative infinity."
      }
    ]
  },
  {
    "questionNumber": 2,
    "id": "MOCK04_P2_Q02",
    "marks": 15,
    "topic": "Commercial Arithmetic: Hire Purchase, Commission, and VAT",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The cash price of a desktop computer is $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,200.00$. Under a hire-purchase scheme, a customer pays a deposit of $25\\%$ and the remainder in $10\\text{ equal monthly instalments}$ of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 290.00$ each.\n(i) Calculate the deposit paid.\n(ii) Find the total hire-purchase price of the computer.\n(iii) Calculate the extra amount paid by using the hire-purchase scheme instead of cash payment.\n(iv) Express this extra amount as a percentage of the cash price.",
        "workedSolution": "**(i) Deposit paid:**\n$\\text{Deposit} = \\frac{25}{100} \\times 3,200.00 = \\frac{1}{4} \\times 3,200.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 800.00$\n\nTherefore, the deposit is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 800.00$**.\n\n---\n\n**(ii) Total hire-purchase price:**\n$\\text{Total instalments} = 10 \\times 290.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,900.00$\n$\\text{Hire Purchase Price} = \\text{Deposit} + \\text{Total instalments}$\n$= 800.00 + 2,900.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,700.00$\n\nTherefore, the total hire-purchase price is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,700.00$**.\n\n---\n\n**(iii) Extra amount paid:**\n$\\text{Extra amount} = 3,700.00 - 3,200.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 500.00$\n\nTherefore, the extra amount is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 500.00$**.\n\n---\n\n**(iv) Percentage extra over cash price:**\n$\\text{Percentage} = \\left(\\frac{500}{3,200}\\right) \\times 100\\% = \\frac{50}{32}\\% = \\frac{25}{16}\\% = 15.625\\% \\approx 15.6\\%$\n\nTherefore, the extra amount is **$15.6\\%$** of the cash price."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "An insurance broker earns a standard basic monthly salary of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,800.00$ plus a commission of $4\\%$ on the total premium of policies sold in that month. In August, she sold insurance policies worth a total premium of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 65,000.00$.\n(i) Calculate her commission for August.\n(ii) Find her total gross earnings for August.",
        "workedSolution": "**(i) Commission for August:**\n$\\text{Commission} = \\frac{4}{100} \\times 65,000.00 = 4 \\times 650.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,600.00$\n\nTherefore, her commission is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,600.00$**.\n\n---\n\n**(ii) Total gross earnings:**\n$\\text{Gross Earnings} = \\text{Basic Salary} + \\text{Commission}$\n$= 1,800.00 + 2,600.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,400.00$\n\nTherefore, her total gross earnings for August is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,400.00$**."
      }
    ]
  },
  {
    "questionNumber": 3,
    "id": "MOCK04_P2_Q03",
    "marks": 15,
    "topic": "Plane and Solid Geometry: Rhombus and Solid Cone Mensuration",
    "subQuestions": [
      {
        "part": "a",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"300\" height=\"220\" viewBox=\"0 0 300 220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"150,20 270,110 150,200 30,110\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"150\" y1=\"20\" x2=\"150\" y2=\"200\" stroke=\"#dc2626\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><line x1=\"30\" y1=\"110\" x2=\"270\" y2=\"110\" stroke=\"#0284c7\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><circle cx=\"150\" cy=\"110\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"145\" y=\"15\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">P</text><text x=\"275\" y=\"115\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">Q</text><text x=\"145\" y=\"215\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">R</text><text x=\"15\" y=\"115\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">S</text><text x=\"155\" y=\"125\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">O</text><text x=\"205\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">10 cm</text></svg>",
        "questionText": "The diagram shows a rhombus $PQRS$ whose diagonals $PR$ and $QS$ intersect at $O$. If $|PR| = 16\\text{ cm}$ and side length $|PQ| = 10\\text{ cm}$, calculate:\n(i) the length of diagonal $QS$;\n(ii) the area of the rhombus.",
        "workedSolution": "**(i) Finding the length of diagonal $QS$:**\nDiagonals of a rhombus bisect each other at right angles ($90^\\circ$):\n$|PO| = \\frac{1}{2}|PR| = \\frac{1}{2}(16) = 8\\text{ cm}$\nIn right-angled triangle $\\triangle POQ$, with hypotenuse $|PQ| = 10\\text{ cm}$:\n$|OQ|^2 + |PO|^2 = |PQ|^2$\n$|OQ|^2 + 8^2 = 10^2$\n$|OQ|^2 + 64 = 100$\n$|OQ|^2 = 100 - 64 = 36$\n$|OQ| = \\sqrt{36} = 6\\text{ cm}$\n$|QS| = 2 \\times |OQ| = 2 \\times 6 = 12\\text{ cm}$\n\nTherefore, the length of diagonal $QS$ is **$12\\text{ cm}$**.\n\n---\n\n**(ii) Area of rhombus $PQRS$:**\n$\\text{Area} = \\frac{1}{2} d_1 d_2 = \\frac{1}{2} \\times |PR| \\times |QS| = \\frac{1}{2} \\times 16 \\times 12 = 8 \\times 12 = 96\\text{ cm}^2$\n\nTherefore, the area of the rhombus is **$96\\text{ cm}^2$**."
      },
      {
        "part": "b",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"260\" height=\"220\" viewBox=\"0 0 260 220\" xmlns=\"http://www.w3.org/2000/svg\"><ellipse cx=\"130\" cy=\"180\" rx=\"70\" ry=\"22\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"180\" x2=\"130\" y2=\"30\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"200\" y1=\"180\" x2=\"130\" y2=\"30\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"130\" y1=\"30\" x2=\"130\" y2=\"180\" stroke=\"#dc2626\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><line x1=\"130\" y1=\"180\" x2=\"200\" y2=\"180\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"130\" cy=\"180\" r=\"3\" fill=\"#0f172a\"/><polyline points=\"130,168 142,168 142,180\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.2\"/><text x=\"125\" y=\"20\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">V</text><text x=\"155\" y=\"195\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">r = 7 cm</text><text x=\"135\" y=\"110\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">h = 24 cm</text><text x=\"175\" y=\"100\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">l</text></svg>",
        "questionText": "The diagram shows a solid metal cone with base radius $r = 7\\text{ cm}$ and vertical height $h = 24\\text{ cm}$. Calculate:\n(i) the slant height ($l$) of the cone;\n(ii) the total surface area of the solid cone. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
        "workedSolution": "**(i) Finding slant height ($l$):**\nBy Pythagoras' Theorem on the right triangle formed by vertical height, base radius, and slant height:\n$l^2 = r^2 + h^2 = 7^2 + 24^2 = 49 + 576 = 625$\n$l = \\sqrt{625} = 25\\text{ cm}$\n\nTherefore, the slant height is **$25\\text{ cm}$**.\n\n---\n\n**(ii) Total Surface Area of the solid cone:**\n$\\text{TSA} = \\text{Base Area} + \\text{Curved Surface Area} = \\pi r^2 + \\pi r l = \\pi r(r + l)$\n$\\text{TSA} = \\frac{22}{7} \\times 7 \\times (7 + 25) = 22 \\times 32 = 704\\text{ cm}^2$\n\nTherefore, the total surface area is **$704\\text{ cm}^2$**."
      }
    ]
  },
  {
    "questionNumber": 4,
    "id": "MOCK04_P2_Q04",
    "marks": 15,
    "topic": "Geometric Construction: Parallelogram with $60^\\circ$ Angle and Altitude",
    "subQuestions": [
      {
        "part": "a",
        "marks": 10,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"420\" height=\"280\" viewBox=\"0 0 420 280\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"420\" height=\"280\" fill=\"#ffffff\"/><polygon points=\"50,220 270,220 330,90 110,90\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"110\" y1=\"90\" x2=\"110\" y2=\"220\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><polyline points=\"110,205 125,205 125,220\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><path d=\"M 95 220 A 45 45 0 0 0 78 181\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><text x=\"88\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">60°</text><text x=\"35\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"275\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"340\" y=\"85\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"95\" y=\"85\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">D</text><text x=\"112\" y=\"235\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">E</text><text x=\"160\" y=\"240\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">8 cm</text><text x=\"60\" y=\"150\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">6 cm</text></svg>",
        "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct line segment $|AB| = 8.0\\text{ cm}$;\n(ii) At $A$, construct an angle $\\angle DAB = 60^\\circ$ such that $|AD| = 6.0\\text{ cm}$;\n(iii) Complete the parallelogram $ABCD$ such that $|BC| = 6.0\\text{ cm}$ and $|DC| = 8.0\\text{ cm}$;\n(iv) Construct a perpendicular line from vertex $D$ to meet base line $AB$ at point $E$.",
        "workedSolution": "**Compass Construction Steps:**\n1. **Base Line $|AB| = 8.0\\text{ cm}$:**\n   - Rule a horizontal line and mark vertex $A$.\n   - Set compasses to $8.0\\text{ cm}$, place needle at $A$, and strike an arc to locate $B$.\n2. **Construct $\\angle DAB = 60^\\circ$ and Vertex $D$:**\n   - With needle at $A$, strike an arc crossing $AB$. Without altering compass width, place needle at intersection and strike an intersecting arc to obtain a $60^\\circ$ ray.\n   - Set compasses to $6.0\\text{ cm}$, place needle at $A$, and cut the $60^\\circ$ ray to fix vertex $D$.\n3. **Locating Vertex $C$ to Complete Parallelogram:**\n   - Set compasses to $8.0\\text{ cm}$, place needle at $D$, and strike an arc towards the right.\n   - Set compasses to $6.0\\text{ cm}$, place needle at $B$, and strike an arc cutting the previous arc at vertex $C$.\n   - Rule straight lines $DC$ and $BC$ to form parallelogram $ABCD$.\n4. **Perpendicular from $D$ to $AB$ (Point $E$):**\n   - With needle at $D$, strike an arc cutting line $AB$ at two distinct points.\n   - From those two points, strike equal arcs below $AB$ to intersect.\n   - Draw a straight vertical line from $D$ to meet $AB$ at point $E$."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your completed drawing in (a):\n(i) Measure the length of altitude $|DE|$;\n(ii) Measure the length of diagonal $|AC|$;\n(iii) Calculate the area of parallelogram $ABCD$.",
        "workedSolution": "**(i) Measuring altitude $|DE|$:**\n- In right-angled triangle $\\triangle AED$:\n  $|DE| = |AD| \\sin 60^\\circ = 6.0 \\times 0.8660 = 5.196\\text{ cm} \\approx 5.2\\text{ cm}$\n$\\mathbf{|DE| \\approx 5.2\\text{ cm} \\pm 0.1\\text{ cm}}$\n\n---\n\n**(ii) Measuring diagonal $|AC|$:**\n- In $\\triangle ABC$, interior angle $\\angle B = 180^\\circ - 60^\\circ = 120^\\circ$:\n  $|AC|^2 = 8^2 + 6^2 - 2(8)(6)\\cos 120^\\circ = 64 + 36 - 96(-0.5) = 100 + 48 = 148$\n  $|AC| = \\sqrt{148} \\approx 12.165\\text{ cm}$\n$\\mathbf{|AC| \\approx 12.2\\text{ cm} \\pm 0.1\\text{ cm}}$\n\n---\n\n**(iii) Area of parallelogram $ABCD$:**\n$\\text{Area} = \\text{base} \\times \\text{height} = |AB| \\times |DE| = 8.0 \\times 5.2 = 41.6\\text{ cm}^2$\n\nTherefore, the area of the parallelogram is **$41.6\\text{ cm}^2$**."
      }
    ]
  },
  {
    "questionNumber": 5,
    "id": "MOCK04_P2_Q05",
    "marks": 15,
    "topic": "Frequency Distribution, Mean, and Pie Chart Presentation",
    "subQuestions": [
      {
        "part": "a",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The following table gives the distribution of marks scored by $40\\text{ candidates}$ in a mock examination:\n\n$\\begin{array}{|l|c|c|c|c|c|c|} \\hline \\textbf{Mark } (x) & 1 & 2 & 3 & 4 & 5 & 6 \\\\ \\hline \\textbf{Frequency } (f) & 4 & 6 & 12 & 10 & 5 & 3 \\\\ \\hline \\end{array}$\n\nCalculate:\n(i) the modal mark;\n(ii) the mean mark of the distribution, correct to two decimal places.",
        "workedSolution": "**(i) Modal mark:**\nThe highest frequency is $12$, which corresponds to mark $3$.\n$\\text{Modal mark} = 3$\n\n---\n\n**(ii) Calculating the mean ($\\bar{x}$):**\nCompute $\\sum fx$:\n- $1 \\times 4 = 4$\n- $2 \\times 6 = 12$\n- $3 \\times 12 = 36$\n- $4 \\times 10 = 40$\n- $5 \\times 5 = 25$\n- $6 \\times 3 = 18$\n\n$\\sum f = 4 + 6 + 12 + 10 + 5 + 3 = 40$\n$\\sum fx = 4 + 12 + 36 + 40 + 25 + 18 = 135$\n$\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{135}{40} = 3.375 \\approx 3.38$\n\nTherefore, the mean mark is **$3.38$**."
      },
      {
        "part": "b",
        "marks": 9,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"300\" height=\"300\" viewBox=\"0 0 300 300\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"150\" cy=\"150\" r=\"120\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 150 150 L 270 150 A 120 120 0 0 1 247.1 220.5 Z\" fill=\"#38bdf8\" fill-opacity=\"0.3\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><path d=\"M 150 150 L 247.1 220.5 A 120 120 0 0 1 150 270 Z\" fill=\"#10b981\" fill-opacity=\"0.3\" stroke=\"#059669\" stroke-width=\"1.5\"/><path d=\"M 150 150 L 150 270 A 120 120 0 0 1 46 191 Z\" fill=\"#f59e0b\" fill-opacity=\"0.3\" stroke=\"#d97706\" stroke-width=\"1.5\"/><path d=\"M 150 150 L 46 191 A 120 120 0 0 1 65.1 65.1 Z\" fill=\"#8b5cf6\" fill-opacity=\"0.3\" stroke=\"#7c3aed\" stroke-width=\"1.5\"/><path d=\"M 150 150 L 65.1 65.1 A 120 120 0 0 1 200 40.8 Z\" fill=\"#ec4899\" fill-opacity=\"0.3\" stroke=\"#db2777\" stroke-width=\"1.5\"/><path d=\"M 150 150 L 200 40.8 A 120 120 0 0 1 270 150 Z\" fill=\"#eab308\" fill-opacity=\"0.3\" stroke=\"#ca8a04\" stroke-width=\"1.5\"/><text x=\"205\" y=\"180\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">1 (36°)</text><text x=\"170\" y=\"230\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">2 (54°)</text><text x=\"100\" y=\"225\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">3 (108°)</text><text x=\"65\" y=\"140\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">4 (90°)</text><text x=\"105\" y=\"80\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">5 (45°)</text><text x=\"200\" y=\"90\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">6 (27°)</text></svg>",
        "questionText": "Using the frequency data in (a):\n(i) Calculate the sector angle for each mark in a pie chart representation;\n(ii) Draw a well-labelled pie chart to represent the distribution.",
        "workedSolution": "**(i) Calculating Sector Angles:**\n$\\text{Angle} = \\frac{f}{\\sum f} \\times 360^\\circ = \\frac{f}{40} \\times 360^\\circ = f \\times 9^\\circ$\n- **Mark 1:** $4 \\times 9^\\circ = 36^\\circ$\n- **Mark 2:** $6 \\times 9^\\circ = 54^\\circ$\n- **Mark 3:** $12 \\times 9^\\circ = 108^\\circ$\n- **Mark 4:** $10 \\times 9^\\circ = 90^\\circ$\n- **Mark 5:** $5 \\times 9^\\circ = 45^\\circ$\n- **Mark 6:** $3 \\times 9^\\circ = 27^\\circ$\n\n$\\text{Check Sum} = 36^\\circ + 54^\\circ + 108^\\circ + 90^\\circ + 45^\\circ + 27^\\circ = 360^\\circ$\n\n---\n\n**(ii) Pie Chart Drawing:**\n*(See the embedded SVG above for the complete, accurately partitioned pie chart illustration)*."
      }
    ]
  },
  {
    "questionNumber": 6,
    "id": "MOCK04_P2_Q06",
    "marks": 15,
    "topic": "Transformational Geometry: Enlargement and Reflection on Graph Sheet",
    "subQuestions": [
      {
        "part": "a",
        "marks": 10,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"400\" viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"400\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"gridMK4\" width=\"25\" height=\"25\" patternUnits=\"userSpaceOnUse\"><path d=\"M 25 0 L 0 0 0 25\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"400\" fill=\"url(#gridMK4)\"/><line x1=\"25\" y1=\"200\" x2=\"375\" y2=\"200\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"200\" y1=\"25\" x2=\"200\" y2=\"375\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"380\" y=\"205\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"205\" y=\"20\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><polygon points=\"225,175 250,175 250,150\" fill=\"#38bdf8\" fill-opacity=\"0.4\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"212\" y=\"190\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\">A(1,1)</text><text x=\"255\" y=\"190\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\">B(2,1)</text><text x=\"255\" y=\"145\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\">C(2,2)</text><polygon points=\"250,150 300,150 300,100\" fill=\"#10b981\" fill-opacity=\"0.3\" stroke=\"#059669\" stroke-width=\"2\" stroke-dasharray=\"3\"/><text x=\"238\" y=\"162\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\" fill=\"#059669\">A₁</text><text x=\"305\" y=\"162\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\" fill=\"#059669\">B₁(4,2)</text><text x=\"305\" y=\"95\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\" fill=\"#059669\">C₁(4,4)</text><polygon points=\"150,150 100,150 100,100\" fill=\"#f43f5e\" fill-opacity=\"0.3\" stroke=\"#e11d48\" stroke-width=\"2\" stroke-dasharray=\"4\"/><text x=\"155\" y=\"162\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\" fill=\"#e11d48\">A₂(-2,2)</text><text x=\"75\" y=\"162\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\" fill=\"#e11d48\">B₂(-4,2)</text><text x=\"75\" y=\"95\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\" fill=\"#e11d48\">C₂(-4,4)</text></svg>",
        "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on both axes, draw two perpendicular axes $Ox$ and $Oy$ on a graph sheet for the intervals $-5 \\le x \\le 5$ and $-5 \\le y \\le 5$.\n(i) Plot triangle $ABC$ with vertices $A(1, 1), B(2, 1),$ and $C(2, 2)$;\n(ii) Draw the image $A_1B_1C_1$ of $\\triangle ABC$ under an enlargement with scale factor $k = 2$ from the origin $(0, 0)$;\n(iii) Draw the image $A_2B_2C_2$ of $\\triangle A_1B_1C_1$ under a reflection in the $y$-axis.",
        "workedSolution": "**(i) Original Coordinates:**\n$A(1, 1), \\quad B(2, 1), \\quad C(2, 2)$\n\n---\n\n**(ii) Enlargement from Origin with $k = 2$:**\nMapping rule: $(x, y) \\to (2x, 2y)$\n- $A_1 = (2 \\times 1, 2 \\times 1) = (2, 2)$\n- $B_1 = (2 \\times 2, 2 \\times 1) = (4, 2)$\n- $C_1 = (2 \\times 2, 2 \\times 2) = (4, 4)$\n\n---\n\n**(iii) Reflection of $A_1B_1C_1$ in the $y$-axis:**\nMapping rule: $(x, y) \\to (-x, y)$\n- $A_2 = (-2, 2)$\n- $B_2 = (-4, 2)$\n- $C_2 = (-4, 4)$\n\n*(See the embedded SVG coordinate plot above for the accurate graphical rendering)*."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "Using your graph in (a):\n(i) Find the gradient of line segment $A_2C_1$;\n(ii) Calculate the ratio of the area of $\\triangle ABC$ to the area of $\\triangle A_1B_1C_1$.",
        "workedSolution": "**(i) Gradient of line segment $A_2C_1$:**\nCoordinates: $A_2(-2, 2)$ and $C_1(4, 4)$\n$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{4 - 2}{4 - (-2)} = \\frac{2}{6} = \\frac{1}{3}$\n\nTherefore, the gradient of $A_2C_1$ is **$\\frac{1}{3}$**.\n\n---\n\n**(ii) Ratio of Area of $\\triangle ABC$ to $\\triangle A_1B_1C_1$:**\n$\\text{Area of } \\triangle ABC = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 1 \\times 1 = 0.5\\text{ units}^2$\n$\\text{Area of } \\triangle A_1B_1C_1 = \\frac{1}{2} \\times 2 \\times 2 = 2.0\\text{ units}^2$\n$\\text{Area Ratio} = \\frac{0.5}{2.0} = \\frac{1}{4} = 1 : 4$\n*(Alternatively: $\\text{Area Scale Factor} = k^2 = 2^2 = 4 \\implies \\text{Ratio} = 1 : 4$)*.\n\nTherefore, the ratio of their areas is **$1 : 4$**."
      }
    ]
  }
];
export const allRawMathMock4TheoryQuestions = rawMathMock4Paper2Questions;

export const SET_BECE_MOCK_4_MATH_P2: CurriculumQuestionSet = {
  id: "math_mock_4_p2",
  title: "BECE Mathematics National Mock 4 (Paper 2 Theory & Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 4 Paper 2",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_04/paper_2",
  theoryTopicList: [
    { id: "q1", questionNumber: 1, theoryIndex: 1, title: "Sets, Venn Diagrams & Inequalities", category: "Sets & Inequalities" },
    { id: "q2", questionNumber: 2, theoryIndex: 2, title: "Hire Purchase, Commission & VAT", category: "Commercial Arithmetic" },
    { id: "q3", questionNumber: 3, theoryIndex: 3, title: "Rhombus & Solid Cone Mensuration", category: "Mensuration & Geometry" },
    { id: "q4", questionNumber: 4, theoryIndex: 4, title: "Compass Construction: Parallelogram", category: "Compass Construction" },
    { id: "q5", questionNumber: 5, theoryIndex: 5, title: "Frequency Table, Mean & Pie Chart", category: "Statistics & Probability" },
    { id: "q6", questionNumber: 6, theoryIndex: 6, title: "Transformation: Enlargement & Reflection", category: "Transformational Geometry" }
  ],
  questions: rawMathMock4Paper2Questions.map((q) => {
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
      prompt: `**Question ${q.questionNumber} [${q.marks} Marks]** — *${q.topic}*\\n\\nAnswer all sub-parts below showing full mathematical reasoning, intermediate derivations, and final evaluations.`,
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
        hint: `Review fundamental techniques for ${q.topic}. Follow standard step-by-step WAEC marking protocols.`,
        markingRubric: `Award marks based on: Method (M) for correct mathematical setup; Accuracy (A) for correct intermediate computations; Final Answer (B/A) with proper units.`
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
export const SET_BECE_MOCK_4_MATH_COMPLETE = {
  mockExamNumber: 4,
  subject: "Mathematics",
  examType: "BECE Mathematics National Standard Mock 4",
  academicYear: 2026,
  paper1: SET_BECE_MOCK_4_MATH_P1,
  paper2: SET_BECE_MOCK_4_MATH_P2,
  totalMarks: 100,
  unifiedTimeMinutes: 120
};
