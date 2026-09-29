import { CurriculumQuestionSet } from '../types';
import { MathMockObjectiveQuestion } from './bece-math-mock-1';

export const allRawMathMock7Questions: MathMockObjectiveQuestion[] = [
  {
    "number": 1,
    "id": "MOCK07_P1_Q01",
    "prompt": "If $R = \\{x : 20 \\le x \\le 40, x \\text{ is a multiple of } 6\\}$ and $S = \\{x : 20 \\le x \\le 40, x \\text{ is a multiple of } 8\\}$, find $R \\cap S$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\{24\\}$",
      "B. $\\{24, 36\\}$",
      "C. $\\{24, 48\\}$",
      "D. $\\{24, 32\\}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Sets and Operations on Sets principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "List the multiples of each number within the closed interval $[20, 40]$:\n$$R = \\{24, 30, 36\\}$$\n$$S = \\{24, 32, 40\\}$$\nIntersection:\n$$R \\cap S = \\{24\\}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Sets and Operations on Sets"
  },
  {
    "number": 2,
    "id": "MOCK07_P1_Q02",
    "prompt": "Evaluate: $\\left(3.2 \\times 10^4\\right) \\times \\left(2.5 \\times 10^{-7}\\right)$, giving your answer in standard form.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $8.0 \\times 10^{-3}$",
      "B. $8.0 \\times 10^{-4}$",
      "C. $8.0 \\times 10^{-2}$",
      "D. $8.0 \\times 10^3$"
    ],
    "correctAnswer": "A",
    "hint": "Review Standard Form and Scientific Notation principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Multiply coefficients and apply the product rule of exponents:\n$$(3.2 \\times 2.5) \\times 10^{4 + (-7)} = 8.0 \\times 10^{-3}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Standard Form and Scientific Notation"
  },
  {
    "number": 3,
    "id": "MOCK07_P1_Q03",
    "prompt": "A steel cargo container holds $24\\text{ pallets}$ weighing $350\\text{ kg}$ each. If the empty container has a tare mass of $1.6\\text{ tonnes}$, find the gross weight of the container in tonnes. $[1\\text{ tonne} = 1,000\\text{ kg}]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $8.4\\text{ tonnes}$",
      "B. $9.6\\text{ tonnes}$",
      "C. $10.4\\text{ tonnes}$",
      "D. $10.0\\text{ tonnes}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Units of Mass and Conversion principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Mass of 24 pallets} = 24 \\times 350 = 8,400\\text{ kg} = 8.4\\text{ tonnes}$$\n$$\\text{Gross weight} = 8.4 + 1.6 = 10.0\\text{ tonnes}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Units of Mass and Conversion"
  },
  {
    "number": 4,
    "id": "MOCK07_P1_Q04",
    "prompt": "The diagram shows a regular polygon with interior angle $(4x + 20)^\\circ$ and exterior angle $(x + 10)^\\circ$. Find the number of sides of the polygon.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"320\" height=\"160\" viewBox=\"0 0 320 160\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M 40 120 L 130 120 L 190 60\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"130\" y1=\"120\" x2=\"260\" y2=\"120\" stroke=\"#64748b\" stroke-width=\"1.8\" stroke-dasharray=\"4\"/><path d=\"M 105 120 A 25 25 0 0 1 148 102\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 155 120 A 25 25 0 0 0 168 98\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"2\"/><circle cx=\"130\" cy=\"120\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"70\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">(4x + 20)°</text><text x=\"175\" y=\"110\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">(x + 10)°</text></svg>",
    "options": [
      "A. $6$",
      "B. $8$",
      "C. $9$",
      "D. $10$"
    ],
    "correctAnswer": "C",
    "hint": "Review Polygons and Interior Angles principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Interior and exterior angles at any vertex lie on a straight line and sum to $180^\\circ$:\n$$(4x + 20) + (x + 10) = 180$$\n$$5x + 30 = 180$$\n$$5x = 150 \\implies x = 30$$\n$$\\text{Exterior angle} = x + 10 = 30 + 10 = 40^\\circ$$\n$$\\text{Number of sides } n = \\frac{360^\\circ}{\\text{Exterior angle}} = \\frac{360^\\circ}{40^\\circ} = 9$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Polygons and Interior Angles"
  },
  {
    "number": 5,
    "id": "MOCK07_P1_Q05",
    "prompt": "Simplify the algebraic expression: $\\frac{6m^2 - 13m - 5}{2m - 5}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3m - 1$",
      "B. $3m + 1$",
      "C. $2m + 1$",
      "D. $3m - 5$"
    ],
    "correctAnswer": "B",
    "hint": "Review Algebraic Quadratic Factorization principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Factorize the quadratic numerator $6m^2 - 13m - 5$:\nFind two numbers whose product is $6 \\times (-5) = -30$ and sum is $-13$: $-15$ and $+2$.\n$$6m^2 - 15m + 2m - 5 = 3m(2m - 5) + 1(2m - 5) = (2m - 5)(3m + 1)$$\nDivide by $(2m - 5)$:\n$$\\frac{(2m - 5)(3m + 1)}{2m - 5} = 3m + 1$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Algebraic Quadratic Factorization"
  },
  {
    "number": 6,
    "id": "MOCK07_P1_Q06",
    "prompt": "A financial credit union charges simple interest at $14\\%$ per annum. A trader borrows $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5,000.00$ and repays the principal together with interest in $12\\text{ equal monthly installments}$. Find the amount of each monthly installment.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 475.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 450.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 500.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 525.00$"
    ],
    "correctAnswer": "A",
    "hint": "Review Commercial Arithmetic: Installment Repayments principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$I = \\frac{5,000 \\times 14 \\times 1}{100} = 50 \\times 14 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 700.00$$\n$$\\text{Total amount to repay} = 5,000 + 700 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5,700.00$$\n$$\\text{Monthly installment} = \\frac{5,700.00}{12} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 475.00$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Installment Repayments"
  },
  {
    "number": 7,
    "id": "MOCK07_P1_Q07",
    "prompt": "The diagram shows a circle with chords $AB$ and $CD$ intersecting inside the circle at point $X$. If $|AX| = 8\\text{ cm}, |XB| = 3\\text{ cm},$ and $|CX| = 4\\text{ cm}$, find the length of segment $XD$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"240\" viewBox=\"0 0 240 240\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"120\" cy=\"120\" r=\"90\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"45\" y1=\"100\" x2=\"195\" y2=\"140\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><line x1=\"85\" y1=\"185\" x2=\"155\" y2=\"45\" stroke=\"#dc2626\" stroke-width=\"2.5\"/><circle cx=\"125\" cy=\"121\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"30\" y=\"105\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">A</text><text x=\"202\" y=\"145\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">B</text><text x=\"75\" y=\"200\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">C</text><text x=\"160\" y=\"40\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">D</text><text x=\"130\" y=\"135\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">X</text></svg>",
    "options": [
      "A. $4.5\\text{ cm}$",
      "B. $5.0\\text{ cm}$",
      "C. $7.5\\text{ cm}$",
      "D. $6.0\\text{ cm}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Circle Theorems: Intersecting Chords principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "By the intersecting chords theorem:\n$$|AX| \\times |XB| = |CX| \\times |XD|$$\n$$8 \\times 3 = 4 \\times |XD|$$\n$$24 = 4|XD| \\implies |XD| = \\frac{24}{4} = 6.0\\text{ cm}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Circle Theorems: Intersecting Chords"
  },
  {
    "number": 8,
    "id": "MOCK07_P1_Q08",
    "prompt": "Make $w$ the subject of the relation: $\\frac{1}{w} - \\frac{1}{u} = \\frac{1}{f}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $w = \\frac{uf}{u + f}$",
      "B. $w = \\frac{uf}{u - f}$",
      "C. $w = \\frac{u + f}{uf}$",
      "D. $w = u + f$"
    ],
    "correctAnswer": "A",
    "hint": "Review Change of Subject principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\frac{1}{w} = \\frac{1}{f} + \\frac{1}{u} = \\frac{u + f}{uf}$$\nInvert both sides:\n$$w = \\frac{uf}{u + f}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Change of Subject"
  },
  {
    "number": 9,
    "id": "MOCK07_P1_Q09",
    "prompt": "Solve the inequality: $3(x - 2) \\ge 5x + 4$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $x \\ge -5$",
      "B. $x \\le -5$",
      "C. $x \\ge 5$",
      "D. $x \\le 5$"
    ],
    "correctAnswer": "B",
    "hint": "Review Linear Inequalities principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$3x - 6 \\ge 5x + 4$$\n$$3x - 5x \\ge 4 + 6$$\n$$-2x \\ge 10$$\nDivide by $-2$ and reverse the inequality sign:\n$$x \\le \\frac{10}{-2} \\implies x \\le -5$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 10,
    "id": "MOCK07_P1_Q10",
    "prompt": "The diagram shows a circle with an inscribed triangle $ABC$ where $AC$ is a diameter. If $\\angle CAB = 38^\\circ$, calculate the size of $\\angle BCA$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"240\" viewBox=\"0 0 240 240\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"120\" cy=\"120\" r=\"90\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"30\" y1=\"120\" x2=\"210\" y2=\"120\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"30\" y1=\"120\" x2=\"150\" y2=\"45\" stroke=\"#0284c7\" stroke-width=\"2\"/><line x1=\"210\" y1=\"120\" x2=\"150\" y2=\"45\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"120\" cy=\"120\" r=\"3.5\" fill=\"#0f172a\"/><polyline points=\"142,50 148,58 156,52\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><text x=\"15\" y=\"125\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">A</text><text x=\"150\" y=\"35\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">B</text><text x=\"218\" y=\"125\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">C</text><text x=\"115\" y=\"135\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">O</text><text x=\"55\" y=\"115\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">38°</text></svg>",
    "options": [
      "A. $42^\\circ$",
      "B. $72^\\circ$",
      "C. $62^\\circ$",
      "D. $52^\\circ$"
    ],
    "correctAnswer": "D",
    "hint": "Review Circle Theorems: Angle in Semicircle principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "The angle inscribed in a semicircle is a right angle, so $\\angle ABC = 90^\\circ$.\nIn $\\triangle ABC$:\n$$\\angle BCA = 180^\\circ - (90^\\circ + 38^\\circ) = 180^\\circ - 128^\\circ = 52^\\circ$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Circle Theorems: Angle in Semicircle"
  },
  {
    "number": 11,
    "id": "MOCK07_P1_Q11",
    "prompt": "The image of point $P(-5, 3)$ under a translation is $P'(1, -2)$. Find the image of point $Q(4, -1)$ under the same translation.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(10, -6)$",
      "B. $(8, -4)$",
      "C. $(-2, 4)$",
      "D. $(10, 4)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Transformational Geometry: Translation principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\mathbf{v} = P' - P = \\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix} - \\begin{pmatrix} -5 \\\\ 3 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ -5 \\end{pmatrix}$$\n$$Q' = Q + \\mathbf{v} = \\begin{pmatrix} 4 \\\\ -1 \\end{pmatrix} + \\begin{pmatrix} 6 \\\\ -5 \\end{pmatrix} = \\begin{pmatrix} 10 \\\\ -6 \\end{pmatrix}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Translation"
  },
  {
    "number": 12,
    "id": "MOCK07_P1_Q12",
    "prompt": "In a secondary school admission test, the probability of a candidate passing English is $0.7$ and passing Mathematics is $0.6$. If passing both subjects are independent events, what is the probability that a candidate passes both subjects?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $0.10$",
      "B. $0.30$",
      "C. $0.88$",
      "D. $0.42$"
    ],
    "correctAnswer": "D",
    "hint": "Review Probability of Independent Events principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "For independent events $E$ and $M$:\n$$P(E \\cap M) = P(E) \\times P(M) = 0.7 \\times 0.6 = 0.42$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Probability of Independent Events"
  },
  {
    "number": 13,
    "id": "MOCK07_P1_Q13",
    "prompt": "Convert $213_{\\text{five}}$ to a base ten numeral.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $53$",
      "B. $58$",
      "C. $63$",
      "D. $68$"
    ],
    "correctAnswer": "B",
    "hint": "Review Number Bases principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$213_5 = (2 \\times 5^2) + (1 \\times 5^1) + (3 \\times 5^0) = (2 \\times 25) + 5 + 3 = 50 + 5 + 3 = 58_{10}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Number Bases"
  },
  {
    "number": 14,
    "id": "MOCK07_P1_Q14",
    "prompt": "The diagram shows a line $L$ on Cartesian axes. Find the gradient of line $L$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"200\" viewBox=\"0 0 240 200\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"140\" x2=\"220\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"120\" y1=\"20\" x2=\"120\" y2=\"180\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"40\" y1=\"40\" x2=\"200\" y2=\"160\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"120\" cy=\"100\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"173\" cy=\"140\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"128\" y=\"105\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">(0, 2)</text><text x=\"165\" y=\"155\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">(4, 0)</text><text x=\"205\" y=\"165\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">L</text></svg>",
    "options": [
      "A. $-2$",
      "B. $2$",
      "C. $\\frac{1}{2}$",
      "D. $-\\frac{1}{2}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Coordinate Geometry: Gradient principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Coordinates on line $L$: $(0, 2)$ and $(4, 0)$:\n$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{0 - 2}{4 - 0} = -\\frac{2}{4} = -\\frac{1}{2}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Gradient"
  },
  {
    "number": 15,
    "id": "MOCK07_P1_Q15",
    "prompt": "The angles of a quadrilateral are $(2x + 10)^\\circ, (3x - 10)^\\circ, (x + 40)^\\circ,$ and $2x^\\circ$. Find the largest angle of the quadrilateral.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $80^\\circ$",
      "B. $90^\\circ$",
      "C. $110^\\circ$",
      "D. $120^\\circ$"
    ],
    "correctAnswer": "C",
    "hint": "Review Plane Geometry: Angles in Quadrilaterals principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Sum of interior angles of a quadrilateral is $360^\\circ$:\n$$(2x + 10) + (3x - 10) + (x + 40) + 2x = 360$$\n$$8x + 40 = 360$$\n$$8x = 320 \\implies x = 40$$\nThe four angles are:\n- $2(40) + 10 = 90^\\circ$\n- $3(40) - 10 = 110^\\circ$\n- $40 + 40 = 80^\\circ$\n- $2(40) = 80^\\circ$\nThe largest angle is $110^\\circ$.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Plane Geometry: Angles in Quadrilaterals"
  },
  {
    "number": 16,
    "id": "MOCK07_P1_Q16",
    "prompt": "Find the length of a line segment connecting points $G(-4, -1)$ and $H(2, 7)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $8$",
      "B. $10$",
      "C. $12$",
      "D. $14$"
    ],
    "correctAnswer": "B",
    "hint": "Review Coordinate Geometry: Distance Formula principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$|GH| = \\sqrt{(2 - (-4))^2 + (7 - (-1))^2} = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Distance Formula"
  },
  {
    "number": 17,
    "id": "MOCK07_P1_Q17",
    "prompt": "A cylinder of height $14\\text{ cm}$ has a curved surface area of $528\\text{ cm}^2$. Find its base diameter. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6\\text{ cm}$",
      "B. $8\\text{ cm}$",
      "C. $10\\text{ cm}$",
      "D. $12\\text{ cm}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Mensuration: Cylinders principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Curved Surface Area} = 2\\pi r h = \\pi d h$$\n$$528 = \\frac{22}{7} \\times d \\times 14 = 44d$$\n$$d = \\frac{528}{44} = 12\\text{ cm}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Cylinders"
  },
  {
    "number": 18,
    "id": "MOCK07_P1_Q18",
    "prompt": "The diagram shows a stem-and-leaf plot of marks scored by pupils. What is the median mark?",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"300\" height=\"180\" viewBox=\"0 0 300 180\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"300\" height=\"180\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\" rx=\"6\"/><line x1=\"80\" y1=\"20\" x2=\"80\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"30\" y1=\"45\" x2=\"270\" y2=\"45\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><text x=\"40\" y=\"38\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Stem</text><text x=\"100\" y=\"38\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Leaf</text><text x=\"50\" y=\"68\" font-family=\"sans-serif\" font-size=\"12\">2</text><text x=\"100\" y=\"68\" font-family=\"sans-serif\" font-size=\"12\">3   5   8</text><text x=\"50\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\">3</text><text x=\"100\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\">1   4   6   7   9</text><text x=\"50\" y=\"122\" font-family=\"sans-serif\" font-size=\"12\">4</text><text x=\"100\" y=\"122\" font-family=\"sans-serif\" font-size=\"12\">0   2   5</text><text x=\"40\" y=\"162\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">Key: 3 | 4 means 34</text></svg>",
    "options": [
      "A. $34$",
      "B. $35$",
      "C. $36$",
      "D. $37$"
    ],
    "correctAnswer": "C",
    "hint": "Review Statistics: Stem-and-Leaf principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Total observations $n = 3 + 5 + 3 = 11$.\nThe median is the 6th observation in ascending order:\n$$23, 25, 28, 31, 34, \\mathbf{36}, 37, 39, 40, 42, 45$$\nThe 6th value is $36$.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics: Stem-and-Leaf"
  },
  {
    "number": 19,
    "id": "MOCK07_P1_Q19",
    "prompt": "The three angles of a triangle are $x^\\circ, (x + 30)^\\circ,$ and $(x + 30)^\\circ$. What type of triangle is it?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. Equilateral triangle",
      "B. Isosceles triangle",
      "C. Right-angled triangle",
      "D. Scalene obtuse triangle"
    ],
    "correctAnswer": "B",
    "hint": "Review Plane Geometry: Triangles principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Sum of interior angles of a triangle is $180^\\circ$:\n$$x + (x + 30) + (x + 30) = 180$$\n$$3x + 60 = 180$$\n$$3x = 120 \\implies x = 40$$\nThe three angles are $40^\\circ, 70^\\circ, 70^\\circ$.\nSince two angles are equal, the triangle is an isosceles triangle.\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Plane Geometry: Triangles"
  },
  {
    "number": 20,
    "id": "MOCK07_P1_Q20",
    "prompt": "A piece of work takes $6\\text{ technicians}$ $8\\text{ days}$ to complete. How many days will $4\\text{ technicians}$ take to complete the same work if they work at the same rate?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $10\\text{ days}$",
      "B. $11\\text{ days}$",
      "C. $12\\text{ days}$",
      "D. $14\\text{ days}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Inverse Proportion principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Total work} = 6 \\times 8 = 48\\text{ technician-days}$$\n$$\\text{Days for 4 technicians} = \\frac{48}{4} = 12\\text{ days}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Inverse Proportion"
  },
  {
    "number": 21,
    "id": "MOCK07_P1_Q21",
    "prompt": "The diagram shows a regular pentagon. How many diagonals can be drawn from all vertices inside the pentagon?",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"220\" viewBox=\"0 0 220 220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"110,25 195,85 160,185 60,185 25,85\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"110\" y1=\"25\" x2=\"160\" y2=\"185\" stroke=\"#dc2626\" stroke-dasharray=\"3\" stroke-width=\"1.5\"/><line x1=\"110\" y1=\"25\" x2=\"60\" y2=\"185\" stroke=\"#dc2626\" stroke-dasharray=\"3\" stroke-width=\"1.5\"/><line x1=\"195\" y1=\"85\" x2=\"60\" y2=\"185\" stroke=\"#dc2626\" stroke-dasharray=\"3\" stroke-width=\"1.5\"/><line x1=\"195\" y1=\"85\" x2=\"25\" y2=\"85\" stroke=\"#dc2626\" stroke-dasharray=\"3\" stroke-width=\"1.5\"/><line x1=\"25\" y1=\"85\" x2=\"160\" y2=\"185\" stroke=\"#dc2626\" stroke-dasharray=\"3\" stroke-width=\"1.5\"/></svg>",
    "options": [
      "A. $5$",
      "B. $6$",
      "C. $8$",
      "D. $10$"
    ],
    "correctAnswer": "A",
    "hint": "Review Polygons and Diagonals principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "The formula for the total number of diagonals in an $n$-sided polygon is:\n$$D = \\frac{n(n - 3)}{2}$$\nFor a pentagon ($n = 5$):\n$$D = \\frac{5(5 - 3)}{2} = \\frac{5 \\times 2}{2} = 5$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Polygons and Diagonals"
  },
  {
    "number": 22,
    "id": "MOCK07_P1_Q22",
    "prompt": "Simplify: $\\frac{2a}{3} - \\frac{a - 2}{4}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{5a + 6}{12}$",
      "B. $\\frac{5a - 6}{12}$",
      "C. $\\frac{5a + 2}{12}$",
      "D. $\\frac{a + 6}{12}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Algebraic Fractions principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Common denominator is $12$:\n$$\\frac{4(2a) - 3(a - 2)}{12} = \\frac{8a - 3a + 6}{12} = \\frac{5a + 6}{12}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Fractions"
  },
  {
    "number": 23,
    "id": "MOCK07_P1_Q23",
    "prompt": "Find the rule governing the mapping:\n$$\\begin{array}{cccccc} x & 1 & 2 & 3 & 4 & 5 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 0 & 3 & 8 & 15 & 24 \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $y = x^2 - 1$",
      "B. $y = 2x - 2$",
      "C. $y = x^2 + 1$",
      "D. $y = 3x - 3$"
    ],
    "correctAnswer": "A",
    "hint": "Review Relations and Non-Linear Mappings principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Test each $x$ with $y = x^2 - 1$:\n- $x = 1: 1^2 - 1 = 0$\n- $x = 2: 2^2 - 1 = 3$\n- $x = 3: 3^2 - 1 = 8$\n- $x = 4: 4^2 - 1 = 15$\n- $x = 5: 5^2 - 1 = 24$\nAll pairs are satisfied.\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Relations and Non-Linear Mappings"
  },
  {
    "number": 24,
    "id": "MOCK07_P1_Q24",
    "prompt": "The diagram shows a sector with central angle $72^\\circ$ and radius $10\\text{ cm}$. Find the perimeter of the sector. $[\\text{Take } \\pi = 3.142]$",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"180\" viewBox=\"0 0 220 180\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M 40 140 L 160 140 A 120 120 0 0 0 114 43 Z\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"40\" cy=\"140\" r=\"3.5\" fill=\"#0f172a\"/><path d=\"M 70 140 A 30 30 0 0 0 58 116\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"68\" y=\"132\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">72°</text><text x=\"90\" y=\"155\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">10 cm</text></svg>",
    "options": [
      "A. $12.57\\text{ cm}$",
      "B. $22.57\\text{ cm}$",
      "C. $42.57\\text{ cm}$",
      "D. $32.57\\text{ cm}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Mensuration: Sector Perimeter principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Arc length} = \\frac{72^\\circ}{360^\\circ} \\times 2(3.142)(10) = \\frac{1}{5} \\times 62.84 = 12.568\\text{ cm}$$\n$$\\text{Perimeter} = \\text{Arc length} + 2r = 12.568 + 10 + 10 = 32.568\\text{ cm} \\approx 32.57\\text{ cm}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Sector Perimeter"
  },
  {
    "number": 25,
    "id": "MOCK07_P1_Q25",
    "prompt": "The bearing of point $P$ from point $Q$ is $215^\\circ$. What is the bearing of point $Q$ from point $P$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $035^\\circ$",
      "B. $045^\\circ$",
      "C. $125^\\circ$",
      "D. $305^\\circ$"
    ],
    "correctAnswer": "A",
    "hint": "Review Bearings principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Since $\\theta = 215^\\circ > 180^\\circ$:\n$$\\text{Back bearing} = 215^\\circ - 180^\\circ = 035^\\circ$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Bearings"
  },
  {
    "number": 26,
    "id": "MOCK07_P1_Q26",
    "prompt": "A woman is three times as old as her daughter. In $12\\text{ years}$, the sum of their ages will be $76\\text{ years}$. How old is the daughter now?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $11\\text{ years}$",
      "B. $18\\text{ years}$",
      "C. $15\\text{ years}$",
      "D. $13\\text{ years}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Algebraic Word Problems principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Let the daughter's present age be $d$. The mother's age is $3d$.\nIn $12\\text{ years}$:\n$$(d + 12) + (3d + 12) = 76$$\n$$4d + 24 = 76$$\n$$4d = 52 \\implies d = 13$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Algebraic Word Problems"
  },
  {
    "number": 27,
    "id": "MOCK07_P1_Q27",
    "prompt": "The diagram shows a right-angled triangle $ABC$. Find the value of $\\tan(\\angle BCA)$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"180\" viewBox=\"0 0 260 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 220,140 220,40\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"205,140 205,125 220,125\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"30\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"225\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"225\" y=\"35\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"120\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">24 cm</text><text x=\"232\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">7 cm</text><text x=\"120\" y=\"80\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">25 cm</text></svg>",
    "options": [
      "A. $\\frac{7}{25}$",
      "B. $\\frac{24}{25}$",
      "C. $\\frac{7}{24}$",
      "D. $\\frac{24}{7}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Trigonometric Ratios principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "From vertex $C$:\n$$\\text{Opposite side} = |AB| = 7\\text{ cm}$$\n$$\\text{Adjacent side} = |BC| = 24\\text{ cm}$$\n$$\\tan(\\angle BCA) = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{7}{24}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Trigonometric Ratios"
  },
  {
    "number": 28,
    "id": "MOCK07_P1_Q28",
    "prompt": "An agent receives a commission of $7.5\\%$ on total sales. If her commission was $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 450.00$, what was the value of goods sold?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,500.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5,400.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,500.00$"
    ],
    "correctAnswer": "C",
    "hint": "Review Commercial Arithmetic: Commission principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$0.075S = 450.00 \\implies S = \\frac{450}{0.075} = \\frac{450,000}{75} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Commission"
  },
  {
    "number": 29,
    "id": "MOCK07_P1_Q29",
    "prompt": "Given that vector $\\mathbf{u} = \\begin{pmatrix} 5 \\\\ -2 \\end{pmatrix}$ and vector $\\mathbf{v} = \\begin{pmatrix} -1 \\\\ 6 \\end{pmatrix}$, evaluate $|\\mathbf{u} + \\mathbf{v}|$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $4$",
      "B. $4\\sqrt{2}$",
      "C. $8$",
      "D. $16$"
    ],
    "correctAnswer": "B",
    "hint": "Review Vectors: Magnitude principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\mathbf{u} + \\mathbf{v} = \\begin{pmatrix} 5 + (-1) \\\\ -2 + 6 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 4 \\end{pmatrix}$$\n$$|\\mathbf{u} + \\mathbf{v}| = \\sqrt{4^2 + 4^2} = \\sqrt{16 + 16} = \\sqrt{32} = 4\\sqrt{2}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Vectors: Magnitude"
  },
  {
    "number": 30,
    "id": "MOCK07_P1_Q30",
    "prompt": "The diagram shows a right triangular prism. How many vertices does it have?",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"160\" viewBox=\"0 0 240 160\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,120 80,40 120,120\" fill=\"#38bdf8\" fill-opacity=\"0.3\" stroke=\"#0284c7\" stroke-width=\"2\"/><polygon points=\"120,120 80,40 170,55 200,125\" fill=\"#f8fafc\" fill-opacity=\"0.4\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"80\" y1=\"40\" x2=\"170\" y2=\"55\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"40\" y1=\"120\" x2=\"110\" y2=\"135\" stroke=\"#64748b\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><line x1=\"110\" y1=\"135\" x2=\"200\" y2=\"125\" stroke=\"#64748b\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><line x1=\"110\" y1=\"135\" x2=\"170\" y2=\"55\" stroke=\"#64748b\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/></svg>",
    "options": [
      "A. $5$",
      "B. $6$",
      "C. $8$",
      "D. $9$"
    ],
    "correctAnswer": "B",
    "hint": "Review Solid Geometry principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "A triangular prism has two triangular ends, each having $3$ vertices:\n$$\\text{Total vertices} = 3 + 3 = 6$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Solid Geometry"
  },
  {
    "number": 31,
    "id": "MOCK07_P1_Q31",
    "prompt": "Evaluate $4^3 \\times 8^{-1} \\div 2^2$.",
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
    "workedSolution": "Convert all terms to powers of $2$:\n$$4^3 = (2^2)^3 = 2^6$$\n$$8^{-1} = (2^3)^{-1} = 2^{-3}$$\n$$2^6 \\times 2^{-3} \\div 2^2 = 2^{6 - 3 - 2} = 2^1 = 2$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Indices and Exponents"
  },
  {
    "number": 32,
    "id": "MOCK07_P1_Q32",
    "prompt": "Find the simple interest on $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$ saved for $3\\text{ years}$ at $4.5\\%$ per annum.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 720.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 960.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 900.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 810.00$"
    ],
    "correctAnswer": "D",
    "hint": "Review Simple Interest principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$I = \\frac{6,000 \\times 4.5 \\times 3}{100} = 60 \\times 13.5 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 810.00$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Simple Interest"
  },
  {
    "number": 33,
    "id": "MOCK07_P1_Q33",
    "prompt": "The diagram shows a frequency table of shoe sizes of pupils. Find the modal shoe size.\n\n$$\\begin{array}{|l|c|c|c|c|c|} \\hline \\textbf{Shoe Size} & 36 & 37 & 38 & 39 & 40 \\\\ \\hline \\textbf{Frequency} & 4 & 9 & 14 & 8 & 5 \\\\ \\hline \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $36$",
      "B. $37$",
      "C. $38$",
      "D. $39$"
    ],
    "correctAnswer": "C",
    "hint": "Review Statistics: Mode principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "The highest frequency is $14$, which corresponds to shoe size $38$.\n$$\\text{Mode} = 38$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics: Mode"
  },
  {
    "number": 34,
    "id": "MOCK07_P1_Q34",
    "prompt": "The point $K(3, -4)$ is rotated $180^\\circ$ about the origin. What are the coordinates of its image $K'$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(-3, 4)$",
      "B. $(-3, -4)$",
      "C. $(4, -3)$",
      "D. $(-4, 3)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Transformational Geometry: Rotation principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Under a $180^\\circ$ rotation about the origin, the mapping rule is $(x, y) \\to (-x, -y)$:\n$$K(3, -4) \\to K'(-3, -(-4)) = (-3, 4)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Rotation"
  },
  {
    "number": 35,
    "id": "MOCK07_P1_Q35",
    "prompt": "Solve for $t$ in the equation: $\\frac{2t - 1}{3} = \\frac{t + 4}{2}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $10$",
      "B. $12$",
      "C. $14$",
      "D. $16$"
    ],
    "correctAnswer": "C",
    "hint": "Review Linear Equations principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Cross-multiply:\n$$2(2t - 1) = 3(t + 4)$$\n$$4t - 2 = 3t + 12$$\n$$4t - 3t = 12 + 2 \\implies t = 14$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Linear Equations"
  },
  {
    "number": 36,
    "id": "MOCK07_P1_Q36",
    "prompt": "Express $0.000458$ in standard form.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $4.58 \\times 10^{-5}$",
      "B. $4.58 \\times 10^{-4}$",
      "C. $4.58 \\times 10^{-3}$",
      "D. $45.8 \\times 10^{-5}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Standard Form principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Move the decimal point $4$ places to the right:\n$$0.000458 = 4.58 \\times 10^{-4}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Standard Form"
  },
  {
    "number": 37,
    "id": "MOCK07_P1_Q37",
    "prompt": "The diagram shows two parallel lines cut by a transversal. Find the value of angle $a$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"320\" height=\"160\" viewBox=\"0 0 320 160\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"30\" y1=\"40\" x2=\"290\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"30\" y1=\"120\" x2=\"290\" y2=\"120\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"90\" y1=\"150\" x2=\"230\" y2=\"10\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 190 40 A 25 25 0 0 1 208 22\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><path d=\"M 120 120 A 25 25 0 0 0 138 138\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"195\" y=\"30\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">55°</text><text x=\"125\" y=\"150\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">a</text></svg>",
    "options": [
      "A. $35^\\circ$",
      "B. $55^\\circ$",
      "C. $125^\\circ$",
      "D. $135^\\circ$"
    ],
    "correctAnswer": "B",
    "hint": "Review Plane Geometry: Parallel Lines principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "By vertically opposite and alternate angle properties, the acute angle made with both parallel lines is equal:\n$$a = 55^\\circ$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Plane Geometry: Parallel Lines"
  },
  {
    "number": 38,
    "id": "MOCK07_P1_Q38",
    "prompt": "A student spends $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 36.00$ on books and has $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 24.00$ left. What percentage of her original money was spent?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $40\\%$",
      "B. $50\\%$",
      "C. $65\\%$",
      "D. $60\\%$"
    ],
    "correctAnswer": "D",
    "hint": "Review Percentages principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Total original money} = 36.00 + 24.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 60.00$$\n$$\\text{Percentage spent} = \\left(\\frac{36}{60}\\right) \\times 100\\% = \\frac{6}{10} \\times 100\\% = 60\\%$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Percentages"
  },
  {
    "number": 39,
    "id": "MOCK07_P1_Q39",
    "prompt": "Find the highest common factor (HCF) of $48, 72,$ and $120$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $12$",
      "B. $16$",
      "C. $24$",
      "D. $36$"
    ],
    "correctAnswer": "C",
    "hint": "Review Number Theory: HCF principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Prime factorizations:\n$$48 = 2^4 \\times 3$$\n$$72 = 2^3 \\times 3^2$$\n$$120 = 2^3 \\times 3 \\times 5$$\n$$\\text{HCF} = 2^3 \\times 3 = 8 \\times 3 = 24$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Number Theory: HCF"
  },
  {
    "number": 40,
    "id": "MOCK07_P1_Q40",
    "prompt": "The area of a square is $196\\text{ cm}^2$. Calculate its perimeter.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $48\\text{ cm}$",
      "B. $52\\text{ cm}$",
      "C. $56\\text{ cm}$",
      "D. $64\\text{ cm}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Mensuration: Squares principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Side length } s = \\sqrt{196} = 14\\text{ cm}$$\n$$\\text{Perimeter} = 4s = 4 \\times 14 = 56\\text{ cm}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Squares"
  }
];

export const SET_BECE_MOCK_7_MATH_P1: CurriculumQuestionSet = {
  id: "math_mock_7_p1",
  title: "BECE Mathematics National Mock 7 (Paper 1 Objective)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 7 Paper 1",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_07/paper_1",
  questions: allRawMathMock7Questions.map((q) => ({
    id: `math_m7_q${q.number}`,
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

export const rawMathMock7Paper2Questions = [
  {
    "questionNumber": 1,
    "id": "MOCK07_P2_Q01",
    "marks": 15,
    "topic": "Sets, Linear Inequalities, and Vector Column Operations",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"380\" height=\"240\" viewBox=\"0 0 380 240\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"10\" width=\"360\" height=\"220\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"35\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 72</text><circle cx=\"145\" cy=\"125\" r=\"72\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"235\" cy=\"125\" r=\"72\" fill=\"#ec4899\" fill-opacity=\"0.2\" stroke=\"#db2777\" stroke-width=\"2\"/><text x=\"110\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">M (Music)</text><text x=\"240\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#be185d\">D (Drama)</text><text x=\"105\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">30</text><text x=\"182\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">14</text><text x=\"255\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">22</text><text x=\"315\" y=\"205\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">6</text></svg>",
        "questionText": "In a basic school club of $72\\text{ learners}$, $44$ joined the Music group ($M$), $36$ joined the Drama group ($D$), and $14$ joined both groups. The remaining learners joined neither group.\n(i) Illustrate the given information on a Venn diagram.\n(ii) Find the number of learners who joined:\n    $(\\alpha)$ the Music group only;\n    $(\\beta)$ only one of the two groups;\n    $(\\gamma)$ neither the Music nor the Drama group.",
        "workedSolution": "**(i) Venn Diagram Representation:**\nUniversal set $n(U) = 72$.\n- Music members: $n(M) = 44$\n- Drama members: $n(D) = 36$\n- Both groups: $n(M \\cap D) = 14$\n\nRegion Breakdown:\n- Music only: $n(M \\cap D') = 44 - 14 = 30$\n- Drama only: $n(M' \\cap D) = 36 - 14 = 22$\n- Both groups: $n(M \\cap D) = 14$\n- Neither group: $n(M \\cup D)' = 72 - (30 + 14 + 22) = 72 - 66 = 6$\n\n*(See the embedded SVG diagram above for the full illustration)*.\n\n---\n\n**(ii) ($a$) Learners who joined Music only:**\n$$n(M \\cap D') = 44 - 14 = 30$$\nTherefore, **$30\\text{ learners}$ joined Music only**.\n\n---\n\n**(ii) ($\\beta$) Learners who joined only one group:**\n$$\\text{Only one group} = n(M \\cap D') + n(M' \\cap D) = 30 + 22 = 52$$\nTherefore, **$52\\text{ learners}$ joined only one group**.\n\n---\n\n**(ii) ($\\gamma$) Learners who joined neither group:**\n$$n(M \\cup D)' = 72 - 66 = 6$$\nTherefore, **$6\\text{ learners}$ joined neither group**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"80\" viewBox=\"0 0 360 80\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"40\" x2=\"340\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"35\" x2=\"60\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"35\" x2=\"120\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"35\" x2=\"180\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"35\" x2=\"240\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"300\" y1=\"35\" x2=\"300\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"55\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">0</text><text x=\"117\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">1</text><text x=\"177\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">2</text><text x=\"237\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">3</text><text x=\"297\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">4</text><circle cx=\"177\" cy=\"25\" r=\"5\" fill=\"#0284c7\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><line x1=\"177\" y1=\"25\" x2=\"25\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"3\"/><polygon points=\"25,20 15,25 25,30\" fill=\"#0284c7\"/></svg>",
        "questionText": "(i) Solve the inequality: $\\frac{3x + 2}{4} - \\frac{x - 1}{3} \\le 1$.\n(ii) Illustrate your answer on a number line.",
        "workedSolution": "**(i) Solving the inequality:**\n$$\\frac{3x + 2}{4} - \\frac{x - 1}{3} \\le 1$$\nMultiply through by the LCM of $4$ and $3$, which is $12$:\n$$12\\left(\\frac{3x + 2}{4}\\right) - 12\\left(\\frac{x - 1}{3}\\right) \\le 12(1)$$\n$$3(3x + 2) - 4(x - 1) \\le 12$$\n$$9x + 6 - 4x + 4 \\le 12$$\n$$5x + 10 \\le 12$$\n$$5x \\le 12 - 10$$\n$$5x \\le 2 \\implies x \\le \\frac{2}{5} = 0.4$$\n\n**Truth set:** $\\mathbf{\\left\\{x : x \\le \\frac{2}{5}\\right\\}}$.\n\n---\n\n**(ii) Number Line Representation:**\nDraw a horizontal number line with a solid (filled) circle at $x = 0.4$ and a continuous ray extending leftward toward negative infinity."
      }
    ]
  },
  {
    "questionNumber": 2,
    "id": "MOCK07_P2_Q02",
    "marks": 15,
    "topic": "Commercial Arithmetic: Compound Growth, Shares, and Exchange Rates",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "An agricultural enterprise invested $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 15,000.00$ in a high-yield treasury bond at an annual interest rate of $10\\%$ compounded annually.\n(i) Calculate the total value of the investment at the end of $2\\text{ years}$.\n(ii) Find the compound interest earned over the $2\\text{ years}$.\n(iii) Calculate how much more interest was earned compared to simple interest at the same rate and duration.",
        "workedSolution": "**(i) Calculating compound amount ($A$):**\n$$A = P\\left(1 + \\frac{R}{100}\\right)^n$$\nWhere $P = 15,000.00, R = 10\\%, n = 2$:\n$$A = 15,000(1 + 0.10)^2 = 15,000(1.10)^2 = 15,000 \\times 1.21 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 18,150.00$$\n\nTherefore, the total value at the end of two years is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 18,150.00$**.\n\n---\n\n**(ii) Compound interest earned ($CI$):**\n$$CI = A - P = 18,150.00 - 15,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,150.00$$\n\nTherefore, the compound interest earned is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,150.00$**.\n\n---\n\n**(iii) Comparing with simple interest ($SI$):**\n$$SI = \\frac{P \\times R \\times T}{100} = \\frac{15,000 \\times 10 \\times 2}{100} = 150 \\times 20 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,000.00$$\n$$\\text{Difference} = CI - SI = 3,150.00 - 3,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 150.00$$\n\nTherefore, the compound interest yielded **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 150.00$** more."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A traveler changed $\\$650.00\\text{ (US Dollars)}$ into Ghana Cedis at a bank exchange rate of $\\$1.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12.40$. While in Ghana, he spent $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5,580.00$ and converted the remaining cedis back into US Dollars at a selling rate of $\\$1.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12.50$.\n(i) How much in Ghana Cedis did he receive initially?\n(ii) How much money in US Dollars did he receive when converting his leftover cedis?",
        "workedSolution": "**(i) Initial amount received in Ghana Cedis:**\n$$\\text{Cedis received} = 650 \\times 12.40 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 8,060.00$$\n\nTherefore, he received **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 8,060.00$** initially.\n\n---\n\n**(ii) Converting leftover Cedis back to US Dollars:**\n$$\\text{Remaining Cedis} = 8,060.00 - 5,580.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,480.00$$\n$$\\text{US Dollars received} = \\frac{2,480.00}{12.50} = \\frac{24,800}{125} = \\$198.40$$\n\nTherefore, he received **$\\$198.40$**."
      }
    ]
  },
  {
    "questionNumber": 3,
    "id": "MOCK07_P2_Q03",
    "marks": 15,
    "topic": "Compound Mensuration: Cylinder, Prism, and Surface Area Ratios",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"220\" viewBox=\"0 0 360 220\" xmlns=\"http://www.w3.org/2000/svg\"><ellipse cx=\"180\" cy=\"60\" rx=\"90\" ry=\"24\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 90 60 L 90 160 A 90 24 0 0 0 270 160 L 270 60 Z\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0f172a\" stroke-width=\"2\"/><ellipse cx=\"180\" cy=\"160\" rx=\"90\" ry=\"24\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"2\" stroke-dasharray=\"4\"/><line x1=\"180\" y1=\"60\" x2=\"270\" y2=\"60\" stroke=\"#dc2626\" stroke-width=\"2\"/><circle cx=\"180\" cy=\"60\" r=\"3.5\" fill=\"#dc2626\"/><line x1=\"285\" y1=\"60\" x2=\"285\" y2=\"160\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><polyline points=\"280,60 290,60\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><polyline points=\"280,160 290,160\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><text x=\"215\" y=\"52\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">r = 7 cm</text><text x=\"295\" y=\"115\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">h = 20 cm</text></svg>",
        "questionText": "The diagram shows a solid metal cylinder of base radius $r = 7\\text{ cm}$ and height $h = 20\\text{ cm}$. Calculate:\n(i) the area of the two circular flat ends;\n(ii) the curved surface area of the cylinder;\n(iii) the total surface area of the cylinder. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
        "workedSolution": "**(i) Area of the two circular flat ends:**\n$$\\text{Area of one end} = \\pi r^2 = \\frac{22}{7} \\times 7^2 = 22 \\times 7 = 154\\text{ cm}^2$$\n$$\\text{Area of two ends} = 2 \\times 154 = 308\\text{ cm}^2$$\n\nTherefore, the area of the two ends is **$308\\text{ cm}^2$**.\n\n---\n\n**(ii) Curved surface area:**\n$$\\text{Curved surface area} = 2\\pi r h = 2 \\times \\frac{22}{7} \\times 7 \\times 20 = 44 \\times 20 = 880\\text{ cm}^2$$\n\nTherefore, the curved surface area is **$880\\text{ cm}^2$**.\n\n---\n\n**(iii) Total surface area:**\n$$\\text{Total Surface Area} = 308 + 880 = 1,188\\text{ cm}^2$$\n\nTherefore, the total surface area is **$1,188\\text{ cm}^2$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A rectangular solid block of dimensions $22\\text{ cm} \\times 14\\text{ cm} \\times 10\\text{ cm}$ is melted down and recast into spherical lead bullets, each of radius $0.7\\text{ cm}$. Calculate the number of complete bullets formed. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
        "workedSolution": "**Step 1: Calculate volume of the rectangular block:**\n$$V_{\\text{block}} = 22 \\times 14 \\times 10 = 3,080\\text{ cm}^3$$\n\n**Step 2: Calculate volume of one bullet ($r = 0.7 = \\frac{7}{10}\\text{ cm}$):**\n$$V_{\\text{bullet}} = \\frac{4}{3}\\pi r^3 = \\frac{4}{3} \\times \\frac{22}{7} \\times \\left(\\frac{7}{10}\\right)^3$$\n$$= \\frac{4}{3} \\times \\frac{22}{7} \\times \\frac{343}{1000} = \\frac{4 \\times 22 \\times 49}{3,000} = \\frac{4,312}{3,000} \\approx 1.4373\\text{ cm}^3$$\n\n**Step 3: Calculate number of complete bullets:**\n$$\\text{Number} = \\frac{3,080}{\\frac{4,312}{3,000}} = \\frac{3,080 \\times 3,000}{4,312} = \\frac{9,240,000}{4,312} \\approx 2,142.85$$\nTaking the whole number of complete bullets formed:\n$$\\text{Complete bullets} = 2,142$$\n\nTherefore, **$2,142\\text{ complete bullets}$** can be produced."
      }
    ]
  },
  {
    "questionNumber": 4,
    "id": "MOCK07_P2_Q04",
    "marks": 15,
    "topic": "Geometric Compass Construction: Quadrilateral, Inscribed Triangle, and Measurement",
    "subQuestions": [
      {
        "part": "a",
        "marks": 10,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"420\" height=\"300\" viewBox=\"0 0 420 300\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"420\" height=\"300\" fill=\"#ffffff\"/><polygon points=\"60,220 340,220 280,80 140,80\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"60\" y1=\"220\" x2=\"280\" y2=\"80\" stroke=\"#0284c7\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><line x1=\"280\" y1=\"80\" x2=\"280\" y2=\"220\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><polyline points=\"280,205 295,205 295,220\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><path d=\"M 105 220 A 45 45 0 0 0 88 178\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"100\" y=\"205\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">60°</text><text x=\"45\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"350\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"285\" y=\"70\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"130\" y=\"70\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">D</text><text x=\"285\" y=\"235\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">P</text><text x=\"190\" y=\"240\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">9.0 cm</text><text x=\"80\" y=\"140\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">7.0 cm</text></svg>",
        "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct the base line segment $|AB| = 9.0\\text{ cm}$;\n(ii) At $A$, construct an angle $\\angle DAB = 60^\\circ$ such that side $|AD| = 7.0\\text{ cm}$;\n(iii) Through vertex $D$, construct a line parallel to $AB$;\n(iv) On this parallel line, locate point $C$ such that $|DC| = 5.0\\text{ cm}$, and join $C$ to $B$ to complete the trapezium $ABCD$;\n(v) Construct a perpendicular line from vertex $C$ to meet line segment $AB$ at point $P$.",
        "workedSolution": "**Compass Construction Steps:**\n1. **Base Line $|AB| = 9.0\\text{ cm}$:**\n   - Draw a straight horizontal line and mark point $A$.\n   - Set compasses to $9.0\\text{ cm}$, place the needle at $A$, and strike an arc to locate $B$.\n2. **Construct $\\angle DAB = 60^\\circ$ and Vertex $D$:**\n   - With needle at $A$, strike an arc crossing $AB$. From that intersection, cut the arc to establish the $60^\\circ$ ray.\n   - Set compasses to $7.0\\text{ cm}$, place the needle at $A$, and cut the $60^\\circ$ ray to fix vertex $D$.\n3. **Parallel Line through $D$:**\n   - At point $D$, construct an angle of $120^\\circ$ with $AD$ so that the line runs parallel to $AB$.\n4. **Locating $C$ and Completing $ABCD$:**\n   - Set compasses to $5.0\\text{ cm}$, place needle at $D$, and cut the parallel line to fix vertex $C$.\n   - Rule a straight line from $C$ to $B$ to complete trapezium $ABCD$.\n5. **Perpendicular from $C$ to $AB$ (Point $P$):**\n   - With needle at $C$, strike arcs cutting baseline $AB$ at two points.\n   - From those two points, strike equal arcs below $AB$ to intersect.\n   - Draw a vertical line from $C$ passing through the intersection to meet $AB$ at point $P$."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your completed construction in (a):\n(i) Measure the length of altitude $|CP|$;\n(ii) Measure the length of diagonal $|AC|$;\n(iii) Calculate the area of trapezium $ABCD$.",
        "workedSolution": "**(i) Measuring altitude $|CP|$:**\n- Theoretical height: $|CP| = |AD| \\sin 60^\\circ = 7.0 \\times 0.8660 = 6.062\\text{ cm} \\approx 6.1\\text{ cm}$\n$$\\mathbf{|CP| \\approx 6.1\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(ii) Measuring diagonal $|AC|$:**\n- Horizontal distance from $A$ to projection of $D$: $7 \\cos 60^\\circ = 3.5\\text{ cm}$\n- Horizontal distance from $A$ to projection of $C$ ($P$): $3.5 + 5.0 = 8.5\\text{ cm}$\n- Diagonal $|AC| = \\sqrt{8.5^2 + 6.06^2} = \\sqrt{72.25 + 36.72} = \\sqrt{108.97} \\approx 10.44\\text{ cm}$\n$$\\mathbf{|AC| \\approx 10.4\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(iii) Area of trapezium $ABCD$:**\n$$\\text{Area} = \\frac{1}{2}(a + b)h = \\frac{1}{2}(9.0 + 5.0) \\times 6.1 = \\frac{1}{2}(14.0) \\times 6.1 = 7.0 \\times 6.1 = 42.7\\text{ cm}^2$$\n\nTherefore, the area of the trapezium is **$42.7\\text{ cm}^2$**."
      }
    ]
  },
  {
    "questionNumber": 5,
    "id": "MOCK07_P2_Q05",
    "marks": 15,
    "topic": "Stem-and-Leaf Representation and Discrete Probability",
    "subQuestions": [
      {
        "part": "a",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The following scores were obtained by $30\\text{ candidates}$ in a mathematics talent competition:\n$$45, 62, 53, 78, 66, 49, 58, 71, 60, 55, 64, 48, 51, 67, 74, 56, 63, 79, 52, 68, 47, 59, 65, 73, 50, 61, 76, 54, 69, 57$$\nConstruct an ordered stem-and-leaf plot to represent the distribution.",
        "workedSolution": "**Stem-and-Leaf Construction Protocol:**\n- Stems represent tens digits ($4, 5, 6, 7$).\n- Leaves represent units digits arranged in ascending order:\n\n$$\\begin{array}{r|l} \\text{Stem} & \\text{Leaves} \\\\ \\hline 4 & 5, 7, 8, 9 \\\\ 5 & 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 \\\\ 6 & 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 \\\\ 7 & 1, 3, 4, 6, 8, 9 \\end{array}$$\n\n**Neat Display:**\n- **Stem 4:** $5, 7, 8, 9$ ($4$ leaves)\n- **Stem 5:** $0, 1, 2, 3, 4, 5, 6, 7, 8, 9$ ($10$ leaves)\n- **Stem 6:** $0, 1, 2, 3, 4, 5, 6, 7, 8, 9$ ($10$ leaves)\n- **Stem 7:** $1, 3, 4, 6, 8, 9$ ($6$ leaves)\n\n$$\\text{Key: } 5 \\mid 3 = 53\\text{ marks}$$\n$$\\text{Total observations } n = 4 + 10 + 10 + 6 = 30$$"
      },
      {
        "part": "b",
        "marks": 4,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your stem-and-leaf plot in (a), determine the:\n(i) median score;\n(ii) range of the distribution.",
        "workedSolution": "**(i) Median score:**\nSince $n = 30$ is even, the median is the average of the 15th and 16th values:\n- Counting through the ordered leaves:\n  - 14th value is $59$\n  - 15th value is $60$\n  - 16th value is $61$\n$$\\text{Median} = \\frac{60 + 61}{2} = 60.5$$\n\nTherefore, the median score is **$60.5$**.\n\n---\n\n**(ii) Range of the distribution:**\n$$\\text{Highest score} = 79$$\n$$\\text{Lowest score} = 45$$\n$$\\text{Range} = 79 - 45 = 34$$\n\nTherefore, the range is **$34$**."
      },
      {
        "part": "c",
        "marks": 4,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "If a candidate is selected at random from the group, find the probability that the candidate scored:\n(i) at least $65\\text{ marks}$;\n(ii) less than $55\\text{ marks}$.",
        "workedSolution": "**(i) Probability of scoring at least 65 ($x \\ge 65$):**\nQualifying values:\n- Stem 6: $65, 66, 67, 68, 69$ ($5$ scores)\n- Stem 7: $71, 73, 74, 76, 78, 79$ ($6$ scores)\n$$n(x \\ge 65) = 5 + 6 = 11$$\n$$P(x \\ge 65) = \\frac{11}{30}$$\n\nTherefore, the probability is **$\\frac{11}{30}$**.\n\n---\n\n**(ii) Probability of scoring less than 55 ($x < 55$):**\nQualifying values:\n- Stem 4: $45, 47, 48, 49$ ($4$ scores)\n- Stem 5: $50, 51, 52, 53, 54$ ($5$ scores)\n$$n(x < 55) = 4 + 5 = 9$$\n$$P(x < 55) = \\frac{9}{30} = \\frac{3}{10} = 0.3$$\n\nTherefore, the probability is **$\\frac{3}{10}$ (or $0.3$)**."
      }
    ]
  },
  {
    "questionNumber": 6,
    "id": "MOCK07_P2_Q06",
    "marks": 15,
    "topic": "Linear Relations, Table of Values, and Coordinate Graphing",
    "subQuestions": [
      {
        "part": "a",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "(i) Copy and complete the table of values for the relation $y = 4x - 3$ for the domain $-2 \\le x \\le 4$.\n\n| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y = 4x - 3$ | | $-7$ | | $1$ | | $9$ | |\n\n(ii) State the gradient and $y$-intercept of the relation.",
        "workedSolution": "**(i) Completed Table:**\nEvaluate $y = 4x - 3$:\n- $x = -2: y = 4(-2) - 3 = -8 - 3 = -11$\n- $x = 0: y = 4(0) - 3 = -3$\n- $x = 2: y = 4(2) - 3 = 8 - 3 = 5$\n- $x = 4: y = 4(4) - 3 = 16 - 3 = 13$\n\n| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y$ | **$-11$** | $-7$ | **$-3$** | $1$ | **$5$** | $9$ | **$13$** |\n\n---\n\n**(ii) Gradient and $y$-intercept:**\n- Gradient ($m$) $= 4$\n- $y$-intercept: **$(0, -3)$**"
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"380\" viewBox=\"0 0 400 380\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"380\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"gridMK7\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"380\" fill=\"url(#gridMK7)\"/><line x1=\"20\" y1=\"240\" x2=\"380\" y2=\"240\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"140\" y1=\"20\" x2=\"140\" y2=\"360\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"385\" y=\"245\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"145\" y=\"25\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><line x1=\"80\" y1=\"350\" x2=\"320\" y2=\"40\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"80\" cy=\"350\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"110\" cy=\"310\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"140\" cy=\"270\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"170\" cy=\"230\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"200\" cy=\"190\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"230\" cy=\"150\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"260\" cy=\"110\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"290\" cy=\"70\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"320\" cy=\"40\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"245\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">y = 4x - 3</text></svg>",
        "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on the $x$-axis and $2\\text{ cm}$ to $2\\text{ units}$ on the $y$-axis, draw two perpendicular axes $Ox$ and $Oy$ on a graph sheet for $-3 \\le x \\le 5$ and $-12 \\le y \\le 14$.\nPlot the coordinates from your table and draw a straight line through all the points.",
        "workedSolution": "**Graph Execution Protocol:**\n1. Calibrate $x$-axis: $2\\text{ cm} = 1\\text{ unit}$ ($-3$ to $5$).\n2. Calibrate $y$-axis: $2\\text{ cm} = 2\\text{ units}$ ($-12$ to $14$).\n3. Plot the coordinates: $(-2, -11), (-1, -7), (0, -3), (1, 1), (2, 5), (3, 9), (4, 13)$.\n4. Connect all plotted points using a ruler to draw a continuous straight line.\n5. Label the line $y = 4x - 3$."
      },
      {
        "part": "c",
        "marks": 3,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your graph, find the:\n(i) value of $y$ when $x = 1.5$;\n(ii) value of $x$ when $y = 0$ ($x$-intercept).",
        "workedSolution": "**(i) Finding $y$ when $x = 1.5$:**\nFrom the graph, project vertically from $x = 1.5$ to meet the line, then horizontally to read $y$:\n$$y = 4(1.5) - 3 = 6 - 3 = 3$$\nFrom graph reading: **$y = 3.0$ (tolerance $\\pm 0.1$)**.\n\n---\n\n**(ii) Finding $x$ when $y = 0$ ($x$-intercept):**\nRead the value of $x$ where the line intersects the horizontal $x$-axis:\n$$0 = 4x - 3 \\implies 4x = 3 \\implies x = 0.75$$\nFrom graph reading: **$x \\approx 0.8$ (tolerance $\\pm 0.1$)**."
      }
    ]
  }
];
export const allRawMathMock7TheoryQuestions = rawMathMock7Paper2Questions;

export const SET_BECE_MOCK_7_MATH_P2: CurriculumQuestionSet = {
  id: "math_mock_7_p2",
  title: "BECE Mathematics National Mock 7 (Paper 2 Theory & Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 7 Paper 2",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_07/paper_2",
  questions: rawMathMock7Paper2Questions.map((q) => {
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
      id: `math_m7_p2_q${q.questionNumber}`,
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
export const SET_BECE_MOCK_7_MATH_COMPLETE = {
  mockExamNumber: 7,
  subject: "Mathematics",
  examType: "BECE Mathematics National Standard Mock 7",
  academicYear: 2026,
  paper1: SET_BECE_MOCK_7_MATH_P1,
  paper2: SET_BECE_MOCK_7_MATH_P2,
  totalMarks: 100,
  unifiedTimeMinutes: 120
};
