/**
 * JHS Curriculum Data - BECE Mathematics National Mock 2
 * Standardized Isomorphic Examination Suite (Paper 1 CBT + Paper 2 Theory)
 *
 * Proprietary Content © GAM IT Solutions (GAM EDU). All rights reserved.
 * Curriculum Alignment: NaCCA JHS Common Core Programme / WAEC Standards
 */

import { CurriculumQuestionSet } from '../types';

import { MathMockObjectiveQuestion } from './bece-math-mock-1';

export const allRawMathMock2Questions: MathMockObjectiveQuestion[] = [
  {
    "number": 1,
    "id": "MOCK02_P1_Q01",
    "prompt": "If $M = \\{x : x \\text{ is a factor of } 28\\}$ and $N = \\{x : x \\text{ is a prime number less than } 15\\}$, find $n(M \\cap N)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1$",
      "B. $2$",
      "C. $3$",
      "D. $4$"
    ],
    "correctAnswer": "B",
    "hint": "List the elements of both sets and find the count of shared members.",
    "workedSolution": "List the elements of both sets:\n$$M = \\{1, 2, 4, 7, 14, 28\\}$$\n$$N = \\{2, 3, 5, 7, 11, 13\\}$$\nIntersection:\n$$M \\cap N = \\{2, 7\\}$$\n$$n(M \\cap N) = 2$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Sets and Operations on Sets"
  },
  {
    "number": 2,
    "id": "MOCK02_P1_Q02",
    "prompt": "Evaluate $\\sqrt{48} - \\sqrt{75} + \\sqrt{108}$ and simplify your answer in the form $k\\sqrt{3}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $5\\sqrt{3}$",
      "B. $4\\sqrt{3}$",
      "C. $3\\sqrt{3}$",
      "D. $7\\sqrt{3}$"
    ],
    "correctAnswer": "A",
    "hint": "Extract perfect squares from under the square root radicals: 48 = 16 * 3, 75 = 25 * 3, 108 = 36 * 3.",
    "workedSolution": "Simplify each surd by extracting perfect square factors:\n$$\\sqrt{48} = \\sqrt{16 \\times 3} = 4\\sqrt{3}$$\n$$\\sqrt{75} = \\sqrt{25 \\times 3} = 5\\sqrt{3}$$\n$$\\sqrt{108} = \\sqrt{36 \\times 3} = 6\\sqrt{3}$$\nCombine terms:\n$$4\\sqrt{3} - 5\\sqrt{3} + 6\\sqrt{3} = (4 - 5 + 6)\\sqrt{3} = 5\\sqrt{3}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Real Number System and Surds"
  },
  {
    "number": 3,
    "id": "MOCK02_P1_Q03",
    "prompt": "What is the place value of the digit $4$ in the number $385.2047$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. Thousandths",
      "B. Hundredths",
      "C. Tenths",
      "D. Ten-thousandths"
    ],
    "correctAnswer": "A",
    "hint": "Count decimal places to the right of the point: tenths (1st), hundredths (2nd), thousandths (3rd).",
    "workedSolution": "In the decimal portion of $385.2047$:\n- $2$ is in the tenths position ($\\frac{1}{10}$)\n- $0$ is in the hundredths position ($\\frac{1}{100}$)\n- $4$ is in the thousandths position ($\\frac{1}{1000}$)\n- $7$ is in the ten-thousandths position ($\\frac{1}{10000}$)\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Place Value and Decimals"
  },
  {
    "number": 4,
    "id": "MOCK02_P1_Q04",
    "prompt": "A rectangular school compound of length $80\\text{ m}$ and width $45\\text{ m}$ is enclosed with wire mesh. If fence posts are placed at intervals of $5\\text{ m}$ along the entire perimeter, how many posts are used?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $48$",
      "B. $54$",
      "C. $52$",
      "D. $50$"
    ],
    "correctAnswer": "D",
    "hint": "Find the total perimeter 2(length + width), then divide by the 5 m interval spacing.",
    "workedSolution": "First find the perimeter of the closed rectangular boundary:\n$$\\text{Perimeter} = 2(l + w) = 2(80 + 45) = 2(125) = 250\\text{ m}$$\nFor a closed boundary, the number of posts equals the total perimeter divided by the spacing interval:\n$$\\text{Number of posts} = \\frac{250}{5} = 50$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Perimeter Applications"
  },
  {
    "number": 5,
    "id": "MOCK02_P1_Q05",
    "prompt": "Convert $11011_2$ to a numeral in base ten.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $25$",
      "B. $31$",
      "C. $29$",
      "D. $27$"
    ],
    "correctAnswer": "D",
    "hint": "Expand in powers of 2: 1(16) + 1(8) + 0(4) + 1(2) + 1(1).",
    "workedSolution": "Expand using powers of base 2:\n$$11011_2 = (1 \\times 2^4) + (1 \\times 2^3) + (0 \\times 2^2) + (1 \\times 2^1) + (1 \\times 2^0)$$\n$$= 16 + 8 + 0 + 2 + 1 = 27_{10}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Number Bases"
  },
  {
    "number": 6,
    "id": "MOCK02_P1_Q06",
    "prompt": "Find the highest common factor (HCF) of $36, 72,$ and $90$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6$",
      "B. $9$",
      "C. $36$",
      "D. $18$"
    ],
    "correctAnswer": "D",
    "hint": "Find the highest factor that divides 36, 72, and 90 without remainder.",
    "workedSolution": "Prime factorization:\n$$36 = 2^2 \\times 3^2$$\n$$72 = 2^3 \\times 3^2$$\n$$90 = 2 \\times 3^2 \\times 5$$\n$$\\text{HCF} = 2^1 \\times 3^2 = 2 \\times 9 = 18$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Number Theory and HCF"
  },
  {
    "number": 7,
    "id": "MOCK02_P1_Q07",
    "prompt": "Simplify the algebraic fraction: $\\frac{4x^2 - 9y^2}{2x + 3y}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2x - 3y$",
      "B. $2x + 3y$",
      "C. $4x - 9y$",
      "D. $x - y$"
    ],
    "correctAnswer": "A",
    "hint": "Use difference of two squares: a^2 - b^2 = (a - b)(a + b).",
    "workedSolution": "Factorize the numerator using the difference of two squares:\n$$4x^2 - 9y^2 = (2x)^2 - (3y)^2 = (2x - 3y)(2x + 3y)$$\nDivide by $(2x + 3y)$:\n$$\\frac{(2x - 3y)(2x + 3y)}{2x + 3y} = 2x - 3y$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Factorization"
  },
  {
    "number": 8,
    "id": "MOCK02_P1_Q08",
    "prompt": "The diagram shows a regular polygon with interior angle $135^\\circ$ and exterior angle $y^\\circ$. How many sides does this regular polygon have?",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"320\" height=\"180\" viewBox=\"0 0 320 180\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M 40 130 L 120 130 L 190 80 L 190 20\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"120\" y1=\"130\" x2=\"240\" y2=\"130\" stroke=\"#64748b\" stroke-width=\"1.8\" stroke-dasharray=\"4\"/><path d=\"M 100 130 A 20 20 0 0 1 140 115\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"75\" y=\"115\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">135°</text><path d=\"M 140 130 A 20 20 0 0 0 160 110\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"2\"/><text x=\"165\" y=\"120\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">y°</text><circle cx=\"120\" cy=\"130\" r=\"3.5\" fill=\"#0f172a\"/></svg>",
    "options": [
      "A. $6$",
      "B. $7$",
      "C. $10$",
      "D. $8$"
    ],
    "correctAnswer": "D",
    "hint": "Exterior angle y = 180° - 135° = 45°. Number of sides = 360° / exterior angle.",
    "workedSolution": "Exterior angle $y$ and interior angle lie on a straight line:\n$$y = 180^\\circ - 135^\\circ = 45^\\circ$$\nFor any regular polygon, the sum of exterior angles is $360^\\circ$:\n$$\\text{Number of sides } n = \\frac{360^\\circ}{\\text{Exterior angle}} = \\frac{360^\\circ}{45^\\circ} = 8$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Polygons and Interior Angles"
  },
  {
    "number": 9,
    "id": "MOCK02_P1_Q09",
    "prompt": "Solve the inequality: $2(3x - 1) - 5 \\le 4x + 7$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $x \\le 5$",
      "B. $x \\ge 5$",
      "C. $x \\ge 7$",
      "D. $x \\le 7$"
    ],
    "correctAnswer": "D",
    "hint": "Expand: 6x - 2 - 5 <= 4x + 7, then group x-terms on the left.",
    "workedSolution": "Expand and collect like terms:\n$$6x - 2 - 5 \\le 4x + 7$$\n$$6x - 7 \\le 4x + 7$$\n$$6x - 4x \\le 7 + 7$$\n$$2x \\le 14 \\implies x \\le 7$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 10,
    "id": "MOCK02_P1_Q10",
    "prompt": "An agent received a commission of $6\\%$ on agricultural land sold for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 45,000.00$. How much commission did the agent earn?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,400.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,600.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,200.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,700.00$"
    ],
    "correctAnswer": "D",
    "hint": "Multiply (6 / 100) by 45,000.00.",
    "workedSolution": "$$\\text{Commission} = \\frac{6}{100} \\times 45,000.00 = 6 \\times 450.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,700.00$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Commission"
  },
  {
    "number": 11,
    "id": "MOCK02_P1_Q11",
    "prompt": "A line passes through coordinates $C(-3, 2)$ and $D(5, -6)$. Find the midpoint of line segment $CD$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(1, -2)$",
      "B. $(2, -4)$",
      "C. $(-1, 2)$",
      "D. $(1, -4)$"
    ],
    "correctAnswer": "A",
    "hint": "Midpoint formula: ((x1 + x2)/2, (y1 + y2)/2).",
    "workedSolution": "$$\\text{Midpoint } M = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right) = \\left(\\frac{-3 + 5}{2}, \\frac{2 + (-6)}{2}\\right) = \\left(\\frac{2}{2}, \\frac{-4}{2}\\right) = (1, -2)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Midpoint"
  },
  {
    "number": 12,
    "id": "MOCK02_P1_Q12",
    "prompt": "The stem-and-leaf plot shows the masses in kilograms of bags of cocoa weighed at a purchasing shed. How many bags weighed at least $65\\text{ kg}$?",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"300\" height=\"180\" viewBox=\"0 0 300 180\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"300\" height=\"180\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\" rx=\"6\"/><line x1=\"80\" y1=\"20\" x2=\"80\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"30\" y1=\"45\" x2=\"270\" y2=\"45\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><text x=\"40\" y=\"38\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Stem</text><text x=\"100\" y=\"38\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Leaf</text><text x=\"50\" y=\"68\" font-family=\"sans-serif\" font-size=\"12\">5</text><text x=\"100\" y=\"68\" font-family=\"sans-serif\" font-size=\"12\">2   4   7   9</text><text x=\"50\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\">6</text><text x=\"100\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\">0   3   5   5   8</text><text x=\"50\" y=\"122\" font-family=\"sans-serif\" font-size=\"12\">7</text><text x=\"100\" y=\"122\" font-family=\"sans-serif\" font-size=\"12\">1   2   4   6</text><text x=\"40\" y=\"162\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">Key: 6 | 3 means 63 kg</text></svg>",
    "options": [
      "A. $5$",
      "B. $6$",
      "C. $7$",
      "D. $8$"
    ],
    "correctAnswer": "C",
    "hint": "Count leaves where the value is 65 or higher (stem 6 leaves >= 5 and all stem 7 leaves).",
    "workedSolution": "\"At least $65\\text{ kg}$\" means mass $\\ge 65\\text{ kg}$:\n- From Stem 6: $65, 65, 68$ (3 bags)\n- From Stem 7: $71, 72, 74, 76$ (4 bags)\n$$\\text{Total} = 3 + 4 = 7\\text{ bags}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics: Stem-and-Leaf Displays"
  },
  {
    "number": 13,
    "id": "MOCK02_P1_Q13",
    "prompt": "Make $h$ the subject of the formula for the curved surface area of a cone: $A = \\pi r \\sqrt{r^2 + h^2}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $h = \\sqrt{\\frac{A^2}{\\pi^2 r^2} - r^2}$",
      "B. $h = \\frac{A}{\\pi r} - r$",
      "C. $h = \\sqrt{\\frac{A}{\\pi r} - r^2}$",
      "D. $h = \\frac{A^2}{\\pi^2 r^2} - r^2$"
    ],
    "correctAnswer": "A",
    "hint": "Isolate the square root, square both sides, and solve for h.",
    "workedSolution": "Divide by $\\pi r$:\n$$\\frac{A}{\\pi r} = \\sqrt{r^2 + h^2}$$\nSquare both sides:\n$$\\frac{A^2}{\\pi^2 r^2} = r^2 + h^2$$\nSubtract $r^2$:\n$$h^2 = \\frac{A^2}{\\pi^2 r^2} - r^2$$\nTake the principal square root:\n$$h = \\sqrt{\\frac{A^2}{\\pi^2 r^2} - r^2}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Change of Subject"
  },
  {
    "number": 14,
    "id": "MOCK02_P1_Q14",
    "prompt": "In a town council election, candidates $X, Y,$ and $Z$ received votes in the ratio $4 : 5 : 7$. If candidate $Z$ received $2,100\\text{ votes}$, how many total votes were cast in all?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3,600$",
      "B. $4,200$",
      "C. $4,800$",
      "D. $5,400$"
    ],
    "correctAnswer": "C",
    "hint": "7 parts = 2,100 votes. Find the value of 1 part, then multiply by total parts (4 + 5 + 7 = 16).",
    "workedSolution": "Candidate $Z$ represents $7$ parts:\n$$7\\text{ parts} = 2,100 \\implies 1\\text{ part} = \\frac{2,100}{7} = 300\\text{ votes}$$\nTotal parts $= 4 + 5 + 7 = 16$:\n$$\\text{Total votes} = 16 \\times 300 = 4,800$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Ratio and Proportion"
  },
  {
    "number": 15,
    "id": "MOCK02_P1_Q15",
    "prompt": "The diagram shows a quadrilateral $ABCD$ inscribed inside a circle with centre $O$. If $\\angle ADC = 112^\\circ$, calculate the value of opposite angle $\\angle ABC$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"240\" viewBox=\"0 0 240 240\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"120\" cy=\"120\" r=\"90\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><polygon points=\"120,30 205,100 150,205 45,150\" fill=\"#38bdf8\" fill-opacity=\"0.15\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"115\" y=\"22\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">A</text><text x=\"212\" y=\"105\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">B</text><text x=\"150\" y=\"222\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">C</text><text x=\"28\" y=\"155\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">D</text><text x=\"58\" y=\"145\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">112°</text></svg>",
    "options": [
      "A. $68^\\circ$",
      "B. $78^\\circ$",
      "C. $88^\\circ$",
      "D. $92^\\circ$"
    ],
    "correctAnswer": "A",
    "hint": "Opposite angles of a cyclic quadrilateral sum up to 180 degrees.",
    "workedSolution": "A quadrilateral whose vertices all touch the circumference of a circle is a cyclic quadrilateral. Opposite angles in a cyclic quadrilateral are supplementary:\n$$\\angle ABC + \\angle ADC = 180^\\circ$$\n$$\\angle ABC + 112^\\circ = 180^\\circ \\implies \\angle ABC = 180^\\circ - 112^\\circ = 68^\\circ$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Circle Theorems and Cyclic Quadrilaterals"
  },
  {
    "number": 16,
    "id": "MOCK02_P1_Q16",
    "prompt": "If $\\mathbf{p} = \\begin{pmatrix} 2 \\\\ -3 \\end{pmatrix}$ and $\\mathbf{q} = \\begin{pmatrix} -4 \\\\ 1 \\end{pmatrix}$, find the magnitude of the vector $3\\mathbf{p} + 2\\mathbf{q}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\sqrt{53}$",
      "B. $\\sqrt{65}$",
      "C. $\\sqrt{74}$",
      "D. $9$"
    ],
    "correctAnswer": "A",
    "hint": "Find the column vector first: 3p + 2q = (-2, -7), then use sqrt(x^2 + y^2).",
    "workedSolution": "$$3\\mathbf{p} + 2\\mathbf{q} = 3\\begin{pmatrix} 2 \\\\ -3 \\end{pmatrix} + 2\\begin{pmatrix} -4 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ -9 \\end{pmatrix} + \\begin{pmatrix} -8 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} -2 \\\\ -7 \\end{pmatrix}$$\nMagnitude:\n$$|3\\mathbf{p} + 2\\mathbf{q}| = \\sqrt{(-2)^2 + (-7)^2} = \\sqrt{4 + 49} = \\sqrt{53}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Vectors: Magnitude and Operations"
  },
  {
    "number": 17,
    "id": "MOCK02_P1_Q17",
    "prompt": "The mean of the numbers $14, 21, 17, x, 25,$ and $19$ is $20$. Find the value of $x$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $22$",
      "B. $23$",
      "C. $24$",
      "D. $26$"
    ],
    "correctAnswer": "C",
    "hint": "Total sum = 6 * 20 = 120. Subtract the five known numbers.",
    "workedSolution": "$$\\text{Sum of } 6 \\text{ numbers} = 6 \\times 20 = 120$$\n$$14 + 21 + 17 + x + 25 + 19 = 120$$\n$$96 + x = 120 \\implies x = 120 - 96 = 24$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics: Mean"
  },
  {
    "number": 18,
    "id": "MOCK02_P1_Q18",
    "prompt": "A sales representative drives $180\\text{ km}$ from Kumasi to Sunyani at an average speed of $75\\text{ km/h}$. If he departs at $8:40\\text{ a.m.}$, at what time does he arrive?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $10:54\\text{ a.m.}$",
      "B. $11:04\\text{ a.m.}$",
      "C. $11:15\\text{ a.m.}$",
      "D. $11:24\\text{ a.m.}$"
    ],
    "correctAnswer": "B",
    "hint": "Time = distance / speed = 180 / 75 = 2.4 hours (2 hours 24 minutes). Add to 8:40 a.m.",
    "workedSolution": "$$\\text{Time} = \\frac{\\text{Distance}}{\\text{Speed}} = \\frac{180}{75} = 2.4\\text{ hours}$$\nConvert decimal hours to minutes:\n$$0.4 \\times 60\\text{ min} = 24\\text{ minutes} \\implies 2\\text{ hours } 24\\text{ minutes}$$\nAdd to departure time $08:40$:\n$$08:40 + 2\\text{ h } 24\\text{ min} = 10:64 = 11:04\\text{ a.m.}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Speed, Distance, and Time"
  },
  {
    "number": 19,
    "id": "MOCK02_P1_Q19",
    "prompt": "A solid sphere has radius $6\\text{ cm}$. Find its volume in terms of $\\pi$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $144\\pi\\text{ cm}^3$",
      "B. $216\\pi\\text{ cm}^3$",
      "C. $288\\pi\\text{ cm}^3$",
      "D. $576\\pi\\text{ cm}^3$"
    ],
    "correctAnswer": "C",
    "hint": "Volume of sphere = (4/3) * pi * r^3.",
    "workedSolution": "$$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi (6^3) = \\frac{4}{3}\\pi (216) = 4 \\times 72\\pi = 288\\pi\\text{ cm}^3$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Solid Geometry: Volume of Sphere"
  },
  {
    "number": 20,
    "id": "MOCK02_P1_Q20",
    "prompt": "The image of point $P(x, y)$ when reflected in the line $y = x$ is $(4, -7)$. Find the coordinates of $P$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(-4, 7)$",
      "B. $(-7, 4)$",
      "C. $(7, -4)$",
      "D. $(4, 7)$"
    ],
    "correctAnswer": "B",
    "hint": "Reflection in y = x maps (x, y) to (y, x).",
    "workedSolution": "The transformation mapping for reflection in the diagonal line $y = x$ is $(x, y) \\to (y, x)$. Since the mapping is self-inverse:\n$$(y, x) = (4, -7) \\implies y = 4, \\quad x = -7 \\implies P(-7, 4)$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Reflection"
  },
  {
    "number": 21,
    "id": "MOCK02_P1_Q21",
    "prompt": "Find the rule governing the mapping below:\n$$\\begin{array}{cccccc} x & 1 & 2 & 3 & 4 & 5 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 3 & 7 & 13 & 21 & 31 \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $y = x^2 + 2$",
      "B. $y = 2x^2 + 1$",
      "C. $y = x^2 + x + 1$",
      "D. $y = 4x - 1$"
    ],
    "correctAnswer": "C",
    "hint": "Test quadratic relationships by looking at first and second differences.",
    "workedSolution": "Check outputs for $y = x^2 + x + 1$:\n- $x = 1: 1^2 + 1 + 1 = 3$\n- $x = 2: 2^2 + 2 + 1 = 7$\n- $x = 3: 3^2 + 3 + 1 = 13$\n- $x = 4: 4^2 + 4 + 1 = 21$\n- $x = 5: 5^2 + 5 + 1 = 31$\nEvery ordered pair matches.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Relations and Non-Linear Mappings"
  },
  {
    "number": 22,
    "id": "MOCK02_P1_Q22",
    "prompt": "Two dice are rolled together once. What is the probability that the sum of the two uppermost numbers is equal to $8$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{5}{36}$",
      "B. $\\frac{1}{6}$",
      "C. $\\frac{7}{36}$",
      "D. $\\frac{1}{4}$"
    ],
    "correctAnswer": "A",
    "hint": "Count favorable pairs out of 36: (2,6), (3,5), (4,4), (5,3), (6,2).",
    "workedSolution": "Total possible outcomes: $6 \\times 6 = 36$.\nPairs giving a sum of $8$:\n$$\\{(2, 6), (3, 5), (4, 4), (5, 3), (6, 2)\\} \\implies n(E) = 5$$\n$$P(\\text{sum} = 8) = \\frac{5}{36}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Probability with Two Independent Events"
  },
  {
    "number": 23,
    "id": "MOCK02_P1_Q23",
    "prompt": "In the right-angled triangle shown, $\\angle XYZ = 90^\\circ, |XY| = 8\\text{ cm},$ and $|YZ| = 15\\text{ cm}$. Find the value of $\\cos(\\angle YXZ)$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"180\" viewBox=\"0 0 280 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 220,140 40,30\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"40,125 55,125 55,140\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"25\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">Y</text><text x=\"230\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">Z</text><text x=\"30\" y=\"25\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">X</text><text x=\"15\" y=\"90\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">8 cm</text><text x=\"120\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">15 cm</text></svg>",
    "options": [
      "A. $\\frac{8}{17}$",
      "B. $\\frac{15}{17}$",
      "C. $\\frac{8}{15}$",
      "D. $\\frac{15}{8}$"
    ],
    "correctAnswer": "A",
    "hint": "Hypotenuse = sqrt(8^2 + 15^2) = 17. Cosine = Adjacent / Hypotenuse.",
    "workedSolution": "Hypotenuse $|XZ|$ by Pythagoras' Theorem:\n$$|XZ| = \\sqrt{8^2 + 15^2} = \\sqrt{64 + 225} = \\sqrt{289} = 17\\text{ cm}$$\nFrom angle at $X$:\n$$\\text{Adjacent} = |XY| = 8\\text{ cm}$$\n$$\\text{Hypotenuse} = |XZ| = 17\\text{ cm}$$\n$$\\cos(\\angle YXZ) = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}} = \\frac{8}{17}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Trigonometry and Right-Angled Triangles"
  },
  {
    "number": 24,
    "id": "MOCK02_P1_Q24",
    "prompt": "A store manager marked a television set for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,400.00$. If a buyer pays cash, a discount of $7.5\\%$ is allowed. How much does the cash customer pay?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,180.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,220.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,240.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,280.00$"
    ],
    "correctAnswer": "B",
    "hint": "Calculate 7.5% discount on 2,400, then subtract from the marked price.",
    "workedSolution": "$$\\text{Discount} = \\frac{7.5}{100} \\times 2,400 = 7.5 \\times 24 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 180.00$$\n$$\\text{Cash price} = 2,400.00 - 180.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,220.00$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Discount"
  },
  {
    "number": 25,
    "id": "MOCK02_P1_Q25",
    "prompt": "Solve for $x$ in the equation: $\\frac{3x - 2}{5} - \\frac{x - 4}{3} = 2$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6$",
      "B. $4$",
      "C. $7$",
      "D. $9$"
    ],
    "correctAnswer": "B",
    "hint": "Multiply through by 15: 3(3x - 2) - 5(x - 4) = 30.",
    "workedSolution": "Multiply through by $\\text{LCM}(5, 3) = 15$:\n$$3(3x - 2) - 5(x - 4) = 15(2)$$\n$$9x - 6 - 5x + 20 = 30$$\n$$4x + 14 = 30$$\n$$4x = 16 \\implies x = 4$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Linear Equations"
  },
  {
    "number": 26,
    "id": "MOCK02_P1_Q26",
    "prompt": "Solve for $x$ in the equation: $4(x - 3) - 2(x - 1) = 8$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6$",
      "B. $7$",
      "C. $8$",
      "D. $9$"
    ],
    "correctAnswer": "D",
    "hint": "Expand: 4x - 12 - 2x + 2 = 8, giving 2x - 10 = 8.",
    "workedSolution": "$$4x - 12 - 2x + 2 = 8$$\n$$2x - 10 = 8$$\n$$2x = 18 \\implies x = 9$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Linear Equations"
  },
  {
    "number": 27,
    "id": "MOCK02_P1_Q27",
    "prompt": "The bearings of port $K$ from lighthouse $L$ is $058^\\circ$. What is the bearing of lighthouse $L$ from port $K$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $122^\\circ$",
      "B. $148^\\circ$",
      "C. $218^\\circ$",
      "D. $238^\\circ$"
    ],
    "correctAnswer": "D",
    "hint": "Back bearing = forward bearing + 180° when angle is less than 180°.",
    "workedSolution": "Since the forward bearing $\\theta = 058^\\circ < 180^\\circ$, add $180^\\circ$:\n$$\\text{Back bearing} = 058^\\circ + 180^\\circ = 238^\\circ$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Bearings and Vectors"
  },
  {
    "number": 28,
    "id": "MOCK02_P1_Q28",
    "prompt": "A steel rod of mass $4.2\\text{ kg}$ has a uniform density of $7.5\\text{ g/cm}^3$. Calculate the volume of the steel rod in $\\text{cm}^3$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $480\\text{ cm}^3$",
      "B. $520\\text{ cm}^3$",
      "C. $560\\text{ cm}^3$",
      "D. $600\\text{ cm}^3$"
    ],
    "correctAnswer": "C",
    "hint": "Convert 4.2 kg to 4,200 g. Volume = Mass / Density.",
    "workedSolution": "Convert mass to grams: $4.2\\text{ kg} = 4,200\\text{ g}$.\n$$\\text{Volume} = \\frac{\\text{Mass}}{\\text{Density}} = \\frac{4,200}{7.5} = \\frac{42,000}{75} = 560\\text{ cm}^3$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Rates of Measure: Density and Volume"
  },
  {
    "number": 29,
    "id": "MOCK02_P1_Q29",
    "prompt": "A cylindrical tank has base diameter $14\\text{ m}$ and height $10\\text{ m}$. Calculate its capacity in litres. $\\left[\\text{Take } \\pi = \\frac{22}{7} \\text{ and } 1\\text{ m}^3 = 1,000\\text{ litres}\\right]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $154,000\\text{ litres}$",
      "B. $616,000\\text{ litres}$",
      "C. $1,540,000\\text{ litres}$",
      "D. $3,080,000\\text{ litres}$"
    ],
    "correctAnswer": "C",
    "hint": "Radius = 7 m. Volume = pi * r^2 * h. Multiply by 1,000 to convert m^3 to litres.",
    "workedSolution": "Radius $r = \\frac{14}{2} = 7\\text{ m}$.\n$$V = \\pi r^2 h = \\frac{22}{7} \\times 7^2 \\times 10 = 22 \\times 7 \\times 10 = 1,540\\text{ m}^3$$\n$$\\text{Capacity in litres} = 1,540 \\times 1,000 = 1,540,000\\text{ litres}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Volume and Capacity"
  },
  {
    "number": 30,
    "id": "MOCK02_P1_Q30",
    "prompt": "Find the image of the point $T(3, -5)$ under a rotation of $180^\\circ$ about the origin.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(-3, 5)$",
      "B. $(-5, 3)$",
      "C. $(5, -3)$",
      "D. $(3, 5)$"
    ],
    "correctAnswer": "A",
    "hint": "A 180° rotation maps (x, y) to (-x, -y).",
    "workedSolution": "Under a rotation through $180^\\circ$ about the origin, the mapping rule is $(x, y) \\to (-x, -y)$:\n$$T(3, -5) \\to T'(-3, -(-5)) = (-3, 5)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Rotation"
  },
  {
    "number": 31,
    "id": "MOCK02_P1_Q31",
    "prompt": "The diagram shows a line $L$ intersecting the Cartesian plane. Find the equation of the line.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"240\" viewBox=\"0 0 280 240\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"160\" x2=\"260\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"100\" y1=\"20\" x2=\"100\" y2=\"220\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"265\" y=\"165\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"105\" y=\"25\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><line x1=\"40\" y1=\"220\" x2=\"220\" y2=\"40\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"100\" cy=\"160\" r=\"3\" fill=\"#0f172a\"/><circle cx=\"100\" cy=\"100\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"160\" cy=\"160\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"108\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">(0, 3)</text><text x=\"155\" y=\"180\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">(-3, 0)</text><text x=\"180\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">L</text></svg>",
    "options": [
      "A. $y = x - 3$",
      "B. $y = -x + 3$",
      "C. $y = 2x + 3$",
      "D. $y = x + 3$"
    ],
    "correctAnswer": "D",
    "hint": "Find the slope m = (3 - 0)/(0 - (-3)) = 1, and y-intercept c = 3.",
    "workedSolution": "The line passes through $(0, 3)$ and $(-3, 0)$:\n$$\\text{Gradient } m = \\frac{3 - 0}{0 - (-3)} = \\frac{3}{3} = 1$$\n$y$-intercept $c = 3$.\nEquation of line: $y = mx + c \\implies y = x + 3$.\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Linear Equations"
  },
  {
    "number": 32,
    "id": "MOCK02_P1_Q32",
    "prompt": "The mean age of $5\\text{ boys}$ is $12\\text{ years}$. When their teacher's age is added, the mean age becomes $16\\text{ years}$. How old is the teacher?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $32\\text{ years}$",
      "B. $34\\text{ years}$",
      "C. $36\\text{ years}$",
      "D. $40\\text{ years}$"
    ],
    "correctAnswer": "C",
    "hint": "Total sum for 6 people = 6 * 16 = 96. Total sum for 5 boys = 5 * 12 = 60.",
    "workedSolution": "$$\\text{Sum of 5 boys' ages} = 5 \\times 12 = 60\\text{ years}$$\n$$\\text{Sum of 6 people (boys + teacher)} = 6 \\times 16 = 96\\text{ years}$$\n$$\\text{Teacher's age} = 96 - 60 = 36\\text{ years}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics: Averages"
  },
  {
    "number": 33,
    "id": "MOCK02_P1_Q33",
    "prompt": "Which property of real numbers is illustrated by $7 \\times (10 + 4) = (7 \\times 10) + (7 \\times 4)$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. Associative property",
      "B. Commutative property",
      "C. Distributive property",
      "D. Identity property"
    ],
    "correctAnswer": "C",
    "hint": "Multiplying across parentheses over addition is the distributive property: a(b + c) = ab + ac.",
    "workedSolution": "The distributive property states that multiplying a number by a sum is equivalent to multiplying by each addend separately: $a(b + c) = ab + ac$.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Properties of Real Numbers"
  },
  {
    "number": 34,
    "id": "MOCK02_P1_Q34",
    "prompt": "A map is drawn to a scale of $1 : 25,000$. What is the actual ground distance in kilometres between two market centers that are $8\\text{ cm}$ apart on the map?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1.6\\text{ km}$",
      "B. $2.0\\text{ km}$",
      "C. $2.5\\text{ km}$",
      "D. $20.0\\text{ km}$"
    ],
    "correctAnswer": "B",
    "hint": "8 cm * 25,000 = 200,000 cm = 2,000 m = 2.0 km.",
    "workedSolution": "$$\\text{Actual distance} = 8\\text{ cm} \\times 25,000 = 200,000\\text{ cm}$$\nConvert to metres ($100\\text{ cm} = 1\\text{ m}$): $2,000\\text{ m}$.\nConvert to kilometres ($1,000\\text{ m} = 1\\text{ km}$): $2.0\\text{ km}$.\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Ratio, Scale, and Proportion"
  },
  {
    "number": 35,
    "id": "MOCK02_P1_Q35",
    "prompt": "Find the simple interest on $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 800.00$ invested for $9\\text{ months}$ at an annual interest rate of $5\\%$ per annum.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 25.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 30.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 36.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 40.00$"
    ],
    "correctAnswer": "B",
    "hint": "Convert 9 months to years (9/12 = 3/4 year). I = (P * R * T) / 100.",
    "workedSolution": "$$T = \\frac{9}{12} = \\frac{3}{4}\\text{ year}$$\n$$I = \\frac{P \\times R \\times T}{100} = \\frac{800 \\times 5 \\times \\frac{3}{4}}{100} = 8 \\times 5 \\times \\frac{3}{4} = 40 \\times \\frac{3}{4} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 30.00$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Simple Interest"
  },
  {
    "number": 36,
    "id": "MOCK02_P1_Q36",
    "prompt": "A card is drawn from a standard pack of $52$ playing cards. What is the probability of selecting an Ace or a King?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{1}{13}$",
      "B. $\\frac{2}{13}$",
      "C. $\\frac{3}{13}$",
      "D. $\\frac{4}{13}$"
    ],
    "correctAnswer": "B",
    "hint": "There are 4 Aces and 4 Kings, totaling 8 favorable cards out of 52.",
    "workedSolution": "There are $4$ Aces and $4$ Kings in a standard deck of $52$ cards:\n$$n(E) = 4 + 4 = 8$$\n$$P(\\text{Ace or King}) = \\frac{8}{52} = \\frac{2}{13}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 37,
    "id": "MOCK02_P1_Q37",
    "prompt": "The diagram shows a circle of radius $7\\text{ cm}$ with an inscribed regular hexagon. Find the perimeter of the regular hexagon.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"220\" viewBox=\"0 0 220 220\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"110\" cy=\"110\" r=\"80\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><polygon points=\"110,30 179.3,70 179.3,150 110,190 40.7,150 40.7,70\" fill=\"#10b981\" fill-opacity=\"0.2\" stroke=\"#059669\" stroke-width=\"2\"/><line x1=\"110\" y1=\"110\" x2=\"179.3\" y2=\"70\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><circle cx=\"110\" cy=\"110\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"135\" y=\"85\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">7 cm</text><text x=\"105\" y=\"125\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">O</text></svg>",
    "options": [
      "A. $28\\text{ cm}$",
      "B. $35\\text{ cm}$",
      "C. $42\\text{ cm}$",
      "D. $44\\text{ cm}$"
    ],
    "correctAnswer": "C",
    "hint": "The side of an inscribed regular hexagon equals the radius of the circle (7 cm). Perimeter = 6 * 7.",
    "workedSolution": "A regular hexagon inscribed in a circle can be partitioned into $6$ equilateral triangles of side length equal to the circumradius $r = 7\\text{ cm}$.\n$$\\text{Perimeter} = 6 \\times r = 6 \\times 7 = 42\\text{ cm}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Polygons and Inscribed Figures"
  },
  {
    "number": 38,
    "id": "MOCK02_P1_Q38",
    "prompt": "Express $0.00375$ in standard form.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3.75 \\times 10^{-4}$",
      "B. $3.75 \\times 10^{-3}$",
      "C. $3.75 \\times 10^{-2}$",
      "D. $37.5 \\times 10^{-4}$"
    ],
    "correctAnswer": "B",
    "hint": "Move the decimal 3 places to the right to obtain 3.75 * 10^-3.",
    "workedSolution": "Shift the decimal point $3$ places to the right to place the leading non-zero digit $3$ in the units place:\n$$0.00375 = 3.75 \\times 10^{-3}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Standard Form"
  },
  {
    "number": 39,
    "id": "MOCK02_P1_Q39",
    "prompt": "If $3^{2x - 1} = 81$, find the value of $x$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2$",
      "B. $2.5$",
      "C. $3$",
      "D. $3.5$"
    ],
    "correctAnswer": "B",
    "hint": "Express 81 as 3^4, then equate exponents 2x - 1 = 4.",
    "workedSolution": "Express $81$ as a power of base $3$:\n$$81 = 3^4$$\n$$3^{2x - 1} = 3^4$$\nEquate exponents:\n$$2x - 1 = 4$$\n$$2x = 5 \\implies x = 2.5$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Indices and Exponential Equations"
  },
  {
    "number": 40,
    "id": "MOCK02_P1_Q40",
    "prompt": "How many lines of symmetry does a regular hexagon possess?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3$",
      "B. $4$",
      "C. $5$",
      "D. $6$"
    ],
    "correctAnswer": "D",
    "hint": "An n-sided regular polygon has n lines of symmetry.",
    "workedSolution": "Every regular polygon with $n$ sides has exactly $n$ axes of symmetry. A regular hexagon has $6$ lines of symmetry ($3$ connecting opposite vertices and $3$ connecting midpoints of opposite sides).\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Symmetry in Polygons"
  }
];
export const SET_BECE_MOCK_2_MATH_P1: CurriculumQuestionSet = {
  id: "math_mock_2",
  title: "BECE Mathematics National Mock 2 (Paper 1 Objective CBT)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 2 Paper 1",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_02/paper_1",
  questions: allRawMathMock2Questions.map((q) => ({
    id: `math_m2_q${q.number}`,
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


// ==========================================
// PAPER 2 THEORY ESSAY (6 QUESTIONS • 15 MARKS EACH)
// ==========================================
export const rawMathMock2Paper2Questions = [
  {
    "questionNumber": 1,
    "id": "MOCK02_P2_Q01",
    "marks": 15,
    "topic": "Sets, Venn Diagrams, and Equal Vectors",
    "subQuestions": [
      {
        "part": "a",
        "marks": 9,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"380\" height=\"240\" viewBox=\"0 0 380 240\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"10\" width=\"360\" height=\"220\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"35\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 75</text><circle cx=\"145\" cy=\"125\" r=\"72\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"235\" cy=\"125\" r=\"72\" fill=\"#f59e0b\" fill-opacity=\"0.2\" stroke=\"#d97706\" stroke-width=\"2\"/><text x=\"110\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">B (Basketball)</text><text x=\"240\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#b45309\">V (Volleyball)</text><text x=\"105\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">31</text><text x=\"182\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">14</text><text x=\"255\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">22</text><text x=\"315\" y=\"205\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">8</text></svg>",
        "questionText": "In a junior high school of $75\\text{ learners}$, $45$ play Basketball ($B$), $36$ play Volleyball ($V$), and $14$ play both games. The remaining learners do not play either of the two games.\n(i) Illustrate the information on a Venn diagram.\n(ii) How many learners play:\n    $(\\alpha)$ Basketball only;\n    $(\\beta)$ only one of the two games;\n    $(\\gamma)$ neither Basketball nor Volleyball?",
        "workedSolution": "**(i) Venn Diagram Representation:**\nLet the Universal set be $U$, with $n(U) = 75$.\n- Number playing Basketball: $n(B) = 45$\n- Number playing Volleyball: $n(V) = 36$\n- Number playing both games: $n(B \\cap V) = 14$\n\nRegion calculations:\n- Basketball only: $n(B \\cap V') = 45 - 14 = 31$\n- Volleyball only: $n(B' \\cap V) = 36 - 14 = 22$\n- Both games: $n(B \\cap V) = 14$\n- Neither game: $n(B \\cup V)' = 75 - (31 + 14 + 22) = 75 - 67 = 8$\n\n*(See the embedded SVG above for the complete, labeled illustration)*.\n\n---\n\n**(ii) ($a$) Learners who play Basketball only:**\n$n(B \\cap V') = 45 - 14 = 31$\nTherefore, **$31\\text{ learners}$ play Basketball only**.\n\n---\n\n**(ii) ($\\beta$) Learners who play only one game:**\n$\\text{Only one game} = n(B \\cap V') + n(B' \\cap V) = 31 + 22 = 53$\nTherefore, **$53\\text{ learners}$ play only one game**.\n\n---\n\n**(ii) ($\\gamma$) Learners who play neither game:**\n$n(B \\cup V)' = 75 - 67 = 8$\nTherefore, **$8\\text{ learners}$ play neither Basketball nor Volleyball**."
      },
      {
        "part": "b",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "If $\\mathbf{u} = \\begin{pmatrix} 3x - 2 \\\\ 4 + 2y \\end{pmatrix}$ and $\\mathbf{w} = \\begin{pmatrix} 13 \\\\ -6 \\end{pmatrix}$ are equal vectors, find the:\n(i) values of $x$ and $y$;\n(ii) value of $2x - 3y$.",
        "workedSolution": "**(i) Finding the values of $x$ and $y$:**\nSince vectors $\\mathbf{u}$ and $\\mathbf{w}$ are equal, their corresponding components are equal:\n$\\begin{pmatrix} 3x - 2 \\\\ 4 + 2y \\end{pmatrix} = \\begin{pmatrix} 13 \\\\ -6 \\end{pmatrix}$\n\n**Horizontal components:**\n$3x - 2 = 13$\n$3x = 13 + 2 = 15$\n$x = \\frac{15}{3} = 5$\n\n**Vertical components:**\n$4 + 2y = -6$\n$2y = -6 - 4 = -10$\n$y = \\frac{-10}{2} = -5$\n\nTherefore, **$x = 5$ and $y = -5$**.\n\n---\n\n**(ii) Evaluating $2x - 3y$:**\nSubstitute $x = 5$ and $y = -5$:\n$2x - 3y = 2(5) - 3(-5) = 10 + 15 = 25$\n\nTherefore, **$2x - 3y = 25$**."
      }
    ]
  },
  {
    "questionNumber": 2,
    "id": "MOCK02_P2_Q02",
    "marks": 15,
    "topic": "Algebraic Relations, Rate/Time Problems, and Angles in Triangles",
    "subQuestions": [
      {
        "part": "a",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A commercial printing press charges a fixed setup cost of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 75.00$ plus $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1.50$ for each copy of a booklet printed.\n(i) Write down an equation connecting the total cost ($C$) in Ghana cedis and the number of booklets ($n$) printed.\n(ii) Find the total cost of printing $450\\text{ booklets}$.\n(iii) How many booklets were printed if the total bill was $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 600.00$?",
        "workedSolution": "**(i) Equation for total cost ($C$):**\n$C = 75 + 1.50n \\quad \\left(\\text{or } C = 75 + \\frac{3}{2}n\\right)$\n\n---\n\n**(ii) Cost of printing $450\\text{ booklets}$ ($n = 450$):**\n$C = 75 + 1.50(450)$\n$C = 75 + 675 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 750.00$\n\nTherefore, the total cost is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 750.00$**.\n\n---\n\n**(iii) Number of booklets for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 600.00$ ($C = 600$):**\n$600 = 75 + 1.50n$\n$1.50n = 600 - 75 = 525$\n$n = \\frac{525}{1.5} = \\frac{5,250}{15} = 350$\n\nTherefore, **$350\\text{ booklets}$** were printed."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A water pump fills a $3,600\\text{-litre}$ community storage tank in $45\\text{ minutes}$.\n(i) Calculate the pumping rate of the pump in litres per minute.\n(ii) How many hours will it take the same pump to fill a larger reservoir of capacity $14,400\\text{ litres}$?",
        "workedSolution": "**(i) Rate in litres per minute:**\n$\\text{Rate} = \\frac{\\text{Volume}}{\\text{Time}} = \\frac{3,600\\text{ litres}}{45\\text{ minutes}} = 80\\text{ litres/minute}$\n\nTherefore, the pumping rate is **$80\\text{ litres per minute}$**.\n\n---\n\n**(ii) Time to fill $14,400\\text{ litres}$:**\n$\\text{Time in minutes} = \\frac{14,400}{80} = 180\\text{ minutes}$\nConvert to hours ($60\\text{ minutes} = 1\\text{ hour}$):\n$\\text{Time in hours} = \\frac{180}{60} = 3\\text{ hours}$\n\nTherefore, it will take **$3\\text{ hours}$**."
      },
      {
        "part": "c",
        "marks": 5,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"200\" viewBox=\"0 0 360 200\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,160 240,160 160,40\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"240\" y1=\"160\" x2=\"320\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><path d=\"M 65 160 A 25 25 0 0 0 62 140\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 148 58 A 25 25 0 0 0 172 58\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 240 160 A 30 30 0 0 0 262 138\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"2\"/><text x=\"70\" y=\"150\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">(2x + 5)°</text><text x=\"142\" y=\"78\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">(3x - 10)°</text><text x=\"265\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">125°</text><text x=\"25\" y=\"170\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"160\" y=\"30\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Q</text><text x=\"240\" y=\"180\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">R</text><text x=\"325\" y=\"170\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">S</text><text x=\"105\" y=\"190\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
        "questionText": "In the diagram, the side $PR$ of triangle $PQR$ is extended to $S$. If $\\angle QPR = (2x + 5)^\\circ, \\angle PQR = (3x - 10)^\\circ,$ and exterior angle $\\angle QRS = 125^\\circ$, find the value of:\n(i) $x$;\n(ii) interior angle $\\angle PRQ$.",
        "workedSolution": "**(i) Finding the value of $x$:**\nBy the exterior angle theorem, the exterior angle of a triangle equals the sum of the two opposite interior angles:\n$\\angle QPR + \\angle PQR = \\angle QRS$\n$(2x + 5) + (3x - 10) = 125$\n$5x - 5 = 125$\n$5x = 125 + 5 = 130$\n$x = \\frac{130}{5} = 26$\n\nTherefore, **$x = 26$**.\n\n---\n\n**(ii) Finding interior angle $\\angle PRQ$:**\nAngles $\\angle PRQ$ and $\\angle QRS$ lie on the straight line $PRS$ and are supplementary:\n$\\angle PRQ + 125^\\circ = 180^\\circ$\n$\\angle PRQ = 180^\\circ - 125^\\circ = 55^\\circ$\n\n*(Cross-check with triangle angle sum: $(2(26)+5) + (3(26)-10) + 55 = 57 + 68 + 55 = 180^\\circ$, verified)*.\n\nTherefore, **$\\angle PRQ = 55^\\circ$**."
      }
    ]
  },
  {
    "questionNumber": 3,
    "id": "MOCK02_P2_Q03",
    "marks": 15,
    "topic": "Compound Mensuration: Trapezium Cross-Section and Cylinder Water Transfer",
    "subQuestions": [
      {
        "part": "a",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"200\" viewBox=\"0 0 360 200\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"60,160 300,160 230,50 110,50\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"110\" y1=\"50\" x2=\"110\" y2=\"160\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><polyline points=\"110,145 125,145 125,160\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><text x=\"160\" y=\"40\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">10 m</text><text x=\"170\" y=\"180\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">18 m</text><text x=\"80\" y=\"110\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">6 m</text><text x=\"110\" y=\"195\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
        "questionText": "The diagram shows the cross-section of a drainage channel in the shape of a trapezium with parallel sides of lengths $10\\text{ m}$ and $18\\text{ m}$, and a perpendicular depth of $6\\text{ m}$.\n(i) Calculate the cross-sectional area of the channel.\n(ii) If the channel is $50\\text{ m}$ long, calculate the total volume of water it holds when completely full.",
        "workedSolution": "**(i) Cross-sectional area of the trapezium:**\n$\\text{Area} = \\frac{1}{2}(a + b)h$\nWhere $a = 10\\text{ m}, b = 18\\text{ m},$ and $h = 6\\text{ m}$:\n$\\text{Area} = \\frac{1}{2}(10 + 18) \\times 6 = \\frac{1}{2}(28) \\times 6 = 14 \\times 6 = 84\\text{ m}^2$\n\nTherefore, the cross-sectional area is **$84\\text{ m}^2$**.\n\n---\n\n**(ii) Volume of the channel ($50\\text{ m}$ long):**\n$\\text{Volume} = \\text{Cross-sectional Area} \\times \\text{Length}$\n$\\text{Volume} = 84 \\times 50 = 4,200\\text{ m}^3$\n\nTherefore, the total volume is **$4,200\\text{ m}^3$**."
      },
      {
        "part": "b",
        "marks": 8,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A rectangular tank of length $22\\text{ cm}$, width $14\\text{ cm}$, and depth $18\\text{ cm}$ is completely filled with water. All the water is poured into an empty cylindrical container of base radius $7\\text{ cm}$. Calculate the depth of water in the cylindrical container. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
        "workedSolution": "**Step 1: Calculate the volume of water in the rectangular tank:**\n$V = l \\times w \\times h = 22 \\times 14 \\times 18$\n$22 \\times 14 = 308$\n$V = 308 \\times 18 = 5,544\\text{ cm}^3$\n\n**Step 2: Equate the volume to the cylindrical container to find depth ($h_c$):**\n$\\text{Volume of cylinder} = \\pi r^2 h_c$\n$5,544 = \\frac{22}{7} \\times 7^2 \\times h_c$\n$5,544 = 22 \\times 7 \\times h_c = 154 h_c$\n$h_c = \\frac{5,544}{154} = 36\\text{ cm}$\n\nTherefore, the depth of water in the cylindrical container is **$36\\text{ cm}$**."
      }
    ]
  },
  {
    "questionNumber": 4,
    "id": "MOCK02_P2_Q04",
    "marks": 15,
    "topic": "Geometric Construction: Triangle with $60^\\circ$ Angle, Incircle, and Tangent Properties",
    "subQuestions": [
      {
        "part": "a",
        "marks": 10,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"320\" viewBox=\"0 0 400 320\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"320\" fill=\"#ffffff\"/><polygon points=\"60,240 340,240 200,70\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><circle cx=\"200\" cy=\"183\" r=\"57\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><circle cx=\"200\" cy=\"183\" r=\"3.5\" fill=\"#0284c7\"/><line x1=\"60\" y1=\"240\" x2=\"245\" y2=\"140\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.5\"/><line x1=\"340\" y1=\"240\" x2=\"155\" y2=\"140\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.5\"/><path d=\"M 105 240 A 45 45 0 0 0 85 200\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"95\" y=\"225\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">60°</text><text x=\"45\" y=\"255\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"350\" y=\"255\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"195\" y=\"58\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"206\" y=\"180\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0284c7\">I</text><text x=\"190\" y=\"260\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">9 cm</text><text x=\"115\" y=\"145\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">8 cm</text></svg>",
        "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct triangle $ABC$ such that $|AB| = 9.0\\text{ cm}, \\angle CAB = 60^\\circ,$ and $|AC| = 8.0\\text{ cm}$;\n(ii) Construct the internal angle bisector of $\\angle CAB$;\n(iii) Construct the internal angle bisector of $\\angle CBA$;\n(iv) Label the point of intersection of the two angle bisectors as $I$;\n(v) Construct a perpendicular line from $I$ to line segment $AB$ to establish the inradius, and draw the inscribed circle (incircle) touching all three sides of triangle $ABC$.",
        "workedSolution": "**Step-by-Step Construction Guide:**\n1. **Base Line $|AB| = 9.0\\text{ cm}$:**\n   - Draw a horizontal line segment with a pencil and mark vertex $A$.\n   - Set compasses to $9.0\\text{ cm}$, place the needle at $A$, and strike an arc to locate vertex $B$.\n2. **Constructing $\\angle CAB = 60^\\circ$:**\n   - Place needle at $A$, strike an arc crossing $AB$. With the same radius, place needle at the intersection and cut the arc.\n   - Draw a ray through this intersection from $A$.\n3. **Locating Vertex $C$ ($|AC| = 8.0\\text{ cm}$):**\n   - Set compasses to $8.0\\text{ cm}$, place needle at $A$, and cut the $60^\\circ$ ray to locate point $C$.\n   - Connect $C$ to $B$ with a straight line to complete triangle $ABC$.\n4. **Angle Bisectors of $\\angle CAB$ and $\\angle CBA$:**\n   - Bisect the $60^\\circ$ angle at $A$ (giving a $30^\\circ$ line).\n   - Construct arcs at vertex $B$ to bisect $\\angle CBA$.\n   - Extend both bisector rays until they intersect at point $I$ (the incentre).\n5. **Incircle Construction:**\n   - From point $I$, construct a perpendicular line to meet $AB$ at $D$.\n   - Set compass radius to $|ID|$, place needle at $I$, and draw the inscribed circle touching $AB, BC,$ and $AC$."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your construction in (a):\n(i) Measure the length of side $|BC|$;\n(ii) Measure the inradius $r$ of the inscribed circle;\n(iii) Calculate the area of the incircle. $\\left[\\text{Take } \\pi = 3.142\\right]$",
        "workedSolution": "**(i) Measuring length $|BC|$:**\n- By the Law of Cosines on $\\triangle ABC$:\n  $|BC|^2 = |AB|^2 + |AC|^2 - 2(|AB|)(|AC|)\\cos 60^\\circ$\n  $|BC|^2 = 9^2 + 8^2 - 2(9)(8)(0.5) = 81 + 64 - 72 = 73$\n  $|BC| = \\sqrt{73} \\approx 8.54\\text{ cm}$\n$\\mathbf{|BC| \\approx 8.5\\text{ cm} \\pm 0.1\\text{ cm}}$\n\n---\n\n**(ii) Measuring inradius $r$ ($|ID|$):**\n- Semi-perimeter $s = \\frac{9 + 8 + 8.54}{2} = 12.77\\text{ cm}$\n- Area of $\\triangle ABC = \\frac{1}{2} \\times 9 \\times 8 \\times \\sin 60^\\circ = 36 \\times 0.8660 = 31.18\\text{ cm}^2$\n- Theoretical inradius: $r = \\frac{\\text{Area}}{s} = \\frac{31.18}{12.77} \\approx 2.44\\text{ cm}$\n$\\mathbf{r \\approx 2.4\\text{ cm} \\pm 0.1\\text{ cm}}$\n\n---\n\n**(iii) Calculating the area of the incircle:**\n$\\text{Area} = \\pi r^2 = 3.142 \\times (2.4)^2 = 3.142 \\times 5.76 \\approx 18.1\\text{ cm}^2$\n\nTherefore, the area of the incircle is **$18.1\\text{ cm}^2$**."
      }
    ]
  },
  {
    "questionNumber": 5,
    "id": "MOCK02_P2_Q05",
    "marks": 15,
    "topic": "Frequency Distribution, Mean from Frequency Table, and Probability",
    "subQuestions": [
      {
        "part": "a",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The following are the scores obtained by $30\\text{ learners}$ in a class test scored out of $10$ marks:\n$7, 5, 8, 6, 4, 7, 9, 5, 6, 8, 7, 6, 5, 4, 6, 8, 7, 9, 6, 7, 5, 6, 8, 7, 4, 6, 5, 7, 8, 6$\nConstruct a frequency distribution table showing the score ($x$), tally, frequency ($f$), and product ($fx$).",
        "workedSolution": "**Frequency Distribution Table:**\n\n| Score ($x$) | Tally | Frequency ($f$) | Product ($fx$) |\n| :---: | :--- | :---: | :---: |\n| $4$ | $\\parallel\\mid$ | $3$ | $4 \\times 3 = 12$ |\n| $5$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}$ | $5$ | $5 \\times 5 = 25$ |\n| $6$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\parallel\\mid$ | $8$ | $6 \\times 8 = 48$ |\n| $7$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\parallel$ | $7$ | $7 \\times 7 = 49$ |\n| $8$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}$ | $5$ | $8 \\times 5 = 40$ |\n| $9$ | $\\parallel$ | $2$ | $9 \\times 2 = 18$ |\n| **Total** | | **$\\sum f = 30$** | **$\\sum fx = 192$** |"
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your frequency distribution table in (a), calculate:\n(i) the modal score;\n(ii) the mean score, correct to one decimal place.",
        "workedSolution": "**(i) Modal score:**\nThe score with the highest frequency ($f = 8$) is $6$.\n$\\text{Modal score} = 6$\n\n---\n\n**(ii) Mean score ($\\bar{x}$):**\n$\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{192}{30} = 6.4$\n\nTherefore, the mean score is **$6.4$**."
      },
      {
        "part": "c",
        "marks": 4,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "If a learner is picked at random from the class, find the probability that the learner scored:\n(i) strictly greater than $6$ marks;\n(ii) at most $5$ marks.",
        "workedSolution": "**(i) Probability of scoring strictly greater than 6 ($x > 6$):**\nScores $> 6$ are $7, 8,$ and $9$:\n$n(x > 6) = f(7) + f(8) + f(9) = 7 + 5 + 2 = 14$\n$P(x > 6) = \\frac{14}{30} = \\frac{7}{15}$\n\nTherefore, the probability is **$\\frac{7}{15}$**.\n\n---\n\n**(ii) Probability of scoring at most 5 ($x \\le 5$):**\nScores $\\le 5$ are $4$ and $5$:\n$n(x \\le 5) = f(4) + f(5) = 3 + 5 = 8$\n$P(x \\le 5) = \\frac{8}{30} = \\frac{4}{15}$\n\nTherefore, the probability is **$\\frac{4}{15}$**."
      }
    ]
  },
  {
    "questionNumber": 6,
    "id": "MOCK02_P2_Q06",
    "marks": 15,
    "topic": "Linear Graphing, Simultaneous Intersections, and Distance-Time Travel",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"380\" viewBox=\"0 0 400 380\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"380\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"gridMK2\" width=\"25\" height=\"25\" patternUnits=\"userSpaceOnUse\"><path d=\"M 25 0 L 0 0 0 25\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"380\" fill=\"url(#gridMK2)\"/><line x1=\"25\" y1=\"200\" x2=\"375\" y2=\"200\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"200\" y1=\"25\" x2=\"200\" y2=\"365\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"380\" y=\"205\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"205\" y=\"20\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><line x1=\"75\" y1=\"325\" x2=\"325\" y2=\"75\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><text x=\"295\" y=\"90\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">y = 2x - 1</text><line x1=\"75\" y1=\"100\" x2=\"325\" y2=\"300\" stroke=\"#dc2626\" stroke-width=\"2.5\"/><text x=\"295\" y=\"315\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">y = 5 - x</text><circle cx=\"250\" y=\"150\" r=\"4.5\" fill=\"#7c3aed\"/><text x=\"258\" y=\"145\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#7c3aed\">(2, 3)</text></svg>",
        "questionText": "(i) Copy and complete the table of values for the relations $y_1 = 2x - 1$ and $y_2 = 5 - x$ for $-2 \\le x \\le 4$.\n\n| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 2x - 1$ | $-5$ | | $-1$ | | $3$ | | $7$ |\n| $y_2 = 5 - x$ | $7$ | | $5$ | | $3$ | | $1$ |\n\n(ii) Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on both axes, plot the two lines on the same graph sheet.\n(iii) From your graph, find the coordinates of the point of intersection of the two lines.",
        "workedSolution": "**(i) Completed Table:**\n- For $y_1 = 2x - 1$:\n  - $x = -1: y_1 = 2(-1) - 1 = -3$\n  - $x = 1: y_1 = 2(1) - 1 = 1$\n  - $x = 3: y_1 = 2(3) - 1 = 5$\n\n- For $y_2 = 5 - x$:\n  - $x = -1: y_2 = 5 - (-1) = 6$\n  - $x = 1: y_2 = 5 - 1 = 4$\n  - $x = 3: y_2 = 5 - 3 = 2$\n\n| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 2x - 1$ | $-5$ | **$-3$** | $-1$ | **$1$** | $3$ | **$5$** | $7$ |\n| $y_2 = 5 - x$ | $7$ | **$6$** | $5$ | **$4$** | $3$ | **$2$** | $1$ |\n\n---\n\n**(ii) Graph Drawing:**\nPlot the points for both lines and draw straight lines through them.\n\n---\n\n**(iii) Point of Intersection:**\nEquating both relations algebraically:\n$2x - 1 = 5 - x$\n$3x = 6 \\implies x = 2$\n$y = 2(2) - 1 = 3$\nFrom the graph, the lines intersect at **$(2, 3)$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A cyclist left Town $A$ at $6:00\\text{ a.m.}$ and rode at a steady speed of $15\\text{ km/h}$ towards Town $B$, which is $45\\text{ km}$ away. After riding for $2\\text{ hours}$, he rested for $30\\text{ minutes}$, and then completed the remaining distance at $10\\text{ km/h}$.\n(i) How far was he from Town $B$ when he stopped to rest?\n(ii) At what time did he arrive in Town $B$?",
        "workedSolution": "**(i) Distance from Town $B$ when resting:**\n$\\text{Distance covered in first 2 hours} = 15\\text{ km/h} \\times 2\\text{ h} = 30\\text{ km}$\n$\\text{Remaining distance to Town } B = 45 - 30 = 15\\text{ km}$\n\nTherefore, he was **$15\\text{ km}$ away from Town $B$**.\n\n---\n\n**(ii) Arrival time in Town $B$:**\n- Departure: $6:00\\text{ a.m.}$\n- First leg: $2\\text{ hours} \\implies 8:00\\text{ a.m.}$\n- Rest: $30\\text{ minutes} \\implies 8:30\\text{ a.m.}$\n- Second leg:\n  $\\text{Time for second leg} = \\frac{15\\text{ km}}{10\\text{ km/h}} = 1.5\\text{ hours} = 1\\text{ hour } 30\\text{ minutes}$\n- Arrival time:\n  $08:30 + 1\\text{ h } 30\\text{ min} = 10:00\\text{ a.m.}$\n\nTherefore, the cyclist arrived in Town $B$ at **$10:00\\text{ a.m.}$**"
      }
    ]
  }
];

export const SET_BECE_MOCK_2_MATH_P2: CurriculumQuestionSet = {
  id: "math_mock_2_p2",
  title: "BECE Mathematics National Mock 2 (Paper 2 Theory & Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 2 Paper 2",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_02/paper_2",
  theoryTopicList: [
    { id: "q1", questionNumber: 1, theoryIndex: 1, title: "Sets, Venn Diagrams & Equal Vectors", category: "Sets & Vectors" },
    { id: "q2", questionNumber: 2, theoryIndex: 2, title: "Cost Functions, Rates & Triangle Angles", category: "Algebra & Geometry" },
    { id: "q3", questionNumber: 3, theoryIndex: 3, title: "Trapezium Channel & Cylinder Transfer", category: "Mensuration & Volume" },
    { id: "q4", questionNumber: 4, theoryIndex: 4, title: "Geometric Construction: Incircle & Inradius", category: "Compass Construction" },
    { id: "q5", questionNumber: 5, theoryIndex: 5, title: "Frequency Table, Mode, Mean & Probability", category: "Statistics & Probability" },
    { id: "q6", questionNumber: 6, theoryIndex: 6, title: "Simultaneous Lines & Cyclist Travel", category: "Graphs & Kinematics" }
  ],
  questions: rawMathMock2Paper2Questions.map((q) => {
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
export const SET_BECE_MOCK_2_MATH_COMPLETE = {
  mockExamNumber: 2,
  subject: "Mathematics",
  examType: "BECE Mathematics National Standard Mock 2",
  academicYear: 2026,
  paper1: SET_BECE_MOCK_2_MATH_P1,
  paper2: SET_BECE_MOCK_2_MATH_P2,
  totalMarks: 100,
  unifiedTimeMinutes: 120
};

