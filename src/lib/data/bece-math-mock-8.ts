import { CurriculumQuestionSet } from '../types';
import { MathMockObjectiveQuestion } from './bece-math-mock-1';

export const allRawMathMock8Questions: MathMockObjectiveQuestion[] = [
  {
    "number": 1,
    "id": "MOCK08_P1_Q01",
    "prompt": "Given that set $M = \\{x : x \\text{ is a factor of } 30\\}$ and set $N = \\{x : x \\text{ is a prime number less than } 12\\}$, find $M \\cap N$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\{2, 3, 5\\}$",
      "B. $\\{2, 3, 5, 7\\}$",
      "C. $\\{1, 2, 3, 5\\}$",
      "D. $\\{3, 5\\}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Sets and Operations on Sets principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "List the elements of both sets:\n$$M = \\{1, 2, 3, 5, 6, 10, 15, 30\\}$$\n$$N = \\{2, 3, 5, 7, 11\\}$$\nIntersection:\n$$M \\cap N = \\{2, 3, 5\\}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Sets and Operations on Sets"
  },
  {
    "number": 2,
    "id": "MOCK08_P1_Q02",
    "prompt": "Simplify: $\\sqrt{72} - \\sqrt{50} + \\sqrt{18}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2\\sqrt{2}$",
      "B. $3\\sqrt{2}$",
      "C. $4\\sqrt{2}$",
      "D. $5\\sqrt{2}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Real Number System and Surds principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Factor out perfect squares from each surd:\n$$\\sqrt{72} = \\sqrt{36 \\times 2} = 6\\sqrt{2}$$\n$$\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2}$$\n$$\\sqrt{18} = \\sqrt{9 \\times 2} = 3\\sqrt{2}$$\nCombine terms:\n$$6\\sqrt{2} - 5\\sqrt{2} + 3\\sqrt{2} = (6 - 5 + 3)\\sqrt{2} = 4\\sqrt{2}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Real Number System and Surds"
  },
  {
    "number": 3,
    "id": "MOCK08_P1_Q03",
    "prompt": "What is the place value of the digit $7$ in the numeral $49.0763$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. Tenths",
      "B. Hundredths",
      "C. Thousandths",
      "D. Ten-thousandths"
    ],
    "correctAnswer": "B",
    "hint": "Review Place Value and Decimals principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "In the decimal portion of $49.0763$:\n- $0$ is in the tenths place\n- $7$ is in the hundredths place\n- $6$ is in the thousandths place\n- $3$ is in the ten-thousandths place\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Place Value and Decimals"
  },
  {
    "number": 4,
    "id": "MOCK08_P1_Q04",
    "prompt": "A school sports ground is $120\\text{ m}$ long and $80\\text{ m}$ wide. A runner completes $5\\text{ laps}$ along its perimeter. What total distance does the runner cover?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1.0\\text{ km}$",
      "B. $1.5\\text{ km}$",
      "C. $2.0\\text{ km}$",
      "D. $2.5\\text{ km}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Mensuration: Perimeter Applications principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Perimeter} = 2(l + w) = 2(120 + 80) = 2(200) = 400\\text{ m}$$\n$$\\text{Distance for 5 laps} = 5 \\times 400\\text{ m} = 2,000\\text{ m} = 2.0\\text{ km}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Perimeter Applications"
  },
  {
    "number": 5,
    "id": "MOCK08_P1_Q05",
    "prompt": "Convert $10110_2$ to a numeral in base ten.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $22$",
      "B. $20$",
      "C. $24$",
      "D. $26$"
    ],
    "correctAnswer": "A",
    "hint": "Review Number Bases principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$10110_2 = (1 \\times 2^4) + (0 \\times 2^3) + (1 \\times 2^2) + (1 \\times 2^1) + (0 \\times 2^0)$$\n$$= 16 + 0 + 4 + 2 + 0 = 22_{10}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Number Bases"
  },
  {
    "number": 6,
    "id": "MOCK08_P1_Q06",
    "prompt": "Find the highest common factor (HCF) of $45, 60,$ and $75$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $5$",
      "B. $30$",
      "C. $25$",
      "D. $15$"
    ],
    "correctAnswer": "D",
    "hint": "Review Number Theory and HCF principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$45 = 3^2 \\times 5$$\n$$60 = 2^2 \\times 3 \\times 5$$\n$$75 = 3 \\times 5^2$$\n$$\\text{HCF} = 3^1 \\times 5^1 = 15$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Number Theory and HCF"
  },
  {
    "number": 7,
    "id": "MOCK08_P1_Q07",
    "prompt": "Simplify the algebraic expression: $\\frac{9a^2 - 16b^2}{3a - 4b}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3a - 4b$",
      "B. $3a + 4b$",
      "C. $9a + 16b$",
      "D. $a + b$"
    ],
    "correctAnswer": "B",
    "hint": "Review Algebraic Factorization principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Factorize the numerator using difference of two squares:\n$$9a^2 - 16b^2 = (3a - 4b)(3a + 4b)$$\n$$\\frac{(3a - 4b)(3a + 4b)}{3a - 4b} = 3a + 4b$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Algebraic Factorization"
  },
  {
    "number": 8,
    "id": "MOCK08_P1_Q08",
    "prompt": "The diagram shows a regular polygon with interior angle $140^\\circ$ and exterior angle $k^\\circ$. How many sides does this regular polygon have?",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"320\" height=\"160\" viewBox=\"0 0 320 160\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M 40 120 L 130 120 L 200 65\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"130\" y1=\"120\" x2=\"260\" y2=\"120\" stroke=\"#64748b\" stroke-width=\"1.8\" stroke-dasharray=\"4\"/><path d=\"M 105 120 A 25 25 0 0 1 145 100\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 155 120 A 25 25 0 0 0 170 95\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"2\"/><circle cx=\"130\" cy=\"120\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"75\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">140°</text><text x=\"175\" y=\"110\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">k°</text></svg>",
    "options": [
      "A. $7$",
      "B. $8$",
      "C. $9$",
      "D. $10$"
    ],
    "correctAnswer": "C",
    "hint": "Review Polygons and Angles principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Exterior angle } k = 180^\\circ - 140^\\circ = 40^\\circ$$\n$$n = \\frac{360^\\circ}{40^\\circ} = 9$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Polygons and Angles"
  },
  {
    "number": 9,
    "id": "MOCK08_P1_Q09",
    "prompt": "Solve the linear inequality: $3(2x + 1) - 4 \\ge 5x + 7$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $x \\ge 8$",
      "B. $x \\le 8$",
      "C. $x \\ge 10$",
      "D. $x \\le 10$"
    ],
    "correctAnswer": "A",
    "hint": "Review Linear Inequalities principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$6x + 3 - 4 \\ge 5x + 7$$\n$$6x - 1 \\ge 5x + 7$$\n$$6x - 5x \\ge 7 + 1 \\implies x \\ge 8$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 10,
    "id": "MOCK08_P1_Q10",
    "prompt": "A store manager allows a discount of $12\\%$ on a gas cooker marked at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 850.00$. Find the selling price.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 748.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 728.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 758.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 768.00$"
    ],
    "correctAnswer": "A",
    "hint": "Review Commercial Arithmetic: Discount principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Discount} = \\frac{12}{100} \\times 850 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 102.00$$\n$$\\text{Selling Price} = 850.00 - 102.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 748.00$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Discount"
  },
  {
    "number": 11,
    "id": "MOCK08_P1_Q11",
    "prompt": "Find the coordinates of the midpoint of the line segment joining $P(-6, 8)$ and $Q(2, -4)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(-2, 2)$",
      "B. $(-4, 4)$",
      "C. $(-2, 4)$",
      "D. $(2, -2)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Coordinate Geometry: Midpoint principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$M = \\left(\\frac{-6 + 2}{2}, \\frac{8 + (-4)}{2}\\right) = \\left(\\frac{-4}{2}, \\frac{4}{2}\\right) = (-2, 2)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Midpoint"
  },
  {
    "number": 12,
    "id": "MOCK08_P1_Q12",
    "prompt": "The stem-and-leaf plot shows the marks of $20\\text{ learners}$ in a quiz. How many learners scored strictly less than $35\\text{ marks}$?",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"300\" height=\"180\" viewBox=\"0 0 300 180\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"300\" height=\"180\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1.5\" rx=\"6\"/><line x1=\"80\" y1=\"20\" x2=\"80\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"30\" y1=\"45\" x2=\"270\" y2=\"45\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><text x=\"40\" y=\"38\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Stem</text><text x=\"100\" y=\"38\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Leaf</text><text x=\"50\" y=\"68\" font-family=\"sans-serif\" font-size=\"12\">2</text><text x=\"100\" y=\"68\" font-family=\"sans-serif\" font-size=\"12\">1   4   7   8</text><text x=\"50\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\">3</text><text x=\"100\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\">0   2   4   6   8   9</text><text x=\"50\" y=\"122\" font-family=\"sans-serif\" font-size=\"12\">4</text><text x=\"100\" y=\"122\" font-family=\"sans-serif\" font-size=\"12\">1   3   5   7</text><text x=\"40\" y=\"162\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">Key: 3 | 2 means 32</text></svg>",
    "options": [
      "A. $6$",
      "B. $9$",
      "C. $8$",
      "D. $7$"
    ],
    "correctAnswer": "D",
    "hint": "Review Statistics: Stem-and-Leaf principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Scores strictly less than $35$:\n- Stem 2: $21, 24, 27, 28$ ($4$ scores)\n- Stem 3: $30, 32, 34$ ($3$ scores)\n$$\\text{Total} = 4 + 3 = 7$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Statistics: Stem-and-Leaf"
  },
  {
    "number": 13,
    "id": "MOCK08_P1_Q13",
    "prompt": "Make $r$ the subject of the relation: $V = \\frac{1}{3}\\pi r^2 h$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $r = \\sqrt{\\frac{3V}{\\pi h}}$",
      "B. $r = \\frac{3V}{\\pi h}$",
      "C. $r = \\sqrt{\\frac{V}{3\\pi h}}$",
      "D. $r = \\frac{\\sqrt{3V}}{\\pi h}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Change of Subject principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$3V = \\pi r^2 h$$\n$$r^2 = \\frac{3V}{\\pi h} \\implies r = \\sqrt{\\frac{3V}{\\pi h}}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Change of Subject"
  },
  {
    "number": 14,
    "id": "MOCK08_P1_Q14",
    "prompt": "Three business partners shared a profit of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 84,000.00$ in the ratio $2 : 3 : 5$. Calculate the smallest share.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 16,800.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 21,000.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 25,200.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 42,000.00$"
    ],
    "correctAnswer": "A",
    "hint": "Review Ratio and Proportion principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Total parts} = 2 + 3 + 5 = 10$$\n$$\\text{Smallest share} = \\frac{2}{10} \\times 84,000 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 16,800.00$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Ratio and Proportion"
  },
  {
    "number": 15,
    "id": "MOCK08_P1_Q15",
    "prompt": "The diagram shows a cyclic quadrilateral $WXYZ$. If $\\angle WZY = 118^\\circ$, calculate the value of $\\angle WXY$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"240\" viewBox=\"0 0 240 240\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"120\" cy=\"120\" r=\"90\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><polygon points=\"120,30 205,100 150,205 45,150\" fill=\"#38bdf8\" fill-opacity=\"0.15\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"115\" y=\"22\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">W</text><text x=\"212\" y=\"105\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">X</text><text x=\"150\" y=\"222\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Y</text><text x=\"28\" y=\"155\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Z</text><text x=\"58\" y=\"145\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">118°</text></svg>",
    "options": [
      "A. $62^\\circ$",
      "B. $72^\\circ$",
      "C. $82^\\circ$",
      "D. $90^\\circ$"
    ],
    "correctAnswer": "A",
    "hint": "Review Circle Theorems principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Opposite angles of a cyclic quadrilateral sum to $180^\\circ$:\n$$\\angle WXY + \\angle WZY = 180^\\circ$$\n$$\\angle WXY = 180^\\circ - 118^\\circ = 62^\\circ$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Circle Theorems"
  },
  {
    "number": 16,
    "id": "MOCK08_P1_Q16",
    "prompt": "If $\\mathbf{a} = \\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix}$ and $\\mathbf{b} = \\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix}$, calculate $|2\\mathbf{a} + 3\\mathbf{b}|$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\sqrt{13}$",
      "B. $\\sqrt{17}$",
      "C. $5$",
      "D. $\\sqrt{29}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Vectors: Magnitude and Operations principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$2\\mathbf{a} + 3\\mathbf{b} = 2\\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix} + 3\\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ -8 \\end{pmatrix} + \\begin{pmatrix} -3 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$$\n$$|2\\mathbf{a} + 3\\mathbf{b}| = \\sqrt{3^2 + (-2)^2} = \\sqrt{9 + 4} = \\sqrt{13}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Vectors: Magnitude and Operations"
  },
  {
    "number": 17,
    "id": "MOCK08_P1_Q17",
    "prompt": "The mean of the numbers $16, 22, 19, y, 28,$ and $25$ is $23$. Find the value of $y$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $21$",
      "B. $23$",
      "C. $24$",
      "D. $26$"
    ],
    "correctAnswer": "D",
    "hint": "Review Statistics: Mean principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\sum x = 6 \\times 23 = 138$$\n$$18 + 22 + 19 + y + 28 + 25 = 138 \\implies 112 + y = 138 \\implies y = 26$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Statistics: Mean"
  },
  {
    "number": 18,
    "id": "MOCK08_P1_Q18",
    "prompt": "An express bus travels $240\\text{ km}$ at an average speed of $80\\text{ km/h}$. If it leaves Cape Coast at $9:45\\text{ a.m.}$, at what time will it arrive in Takoradi?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $12:15\\text{ p.m.}$",
      "B. $1:45\\text{ p.m.}$",
      "C. $1:15\\text{ p.m.}$",
      "D. $12:45\\text{ p.m.}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Speed, Distance, and Time principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Time} = \\frac{\\text{Distance}}{\\text{Speed}} = \\frac{240}{80} = 3\\text{ hours}$$\n$$09:45 + 3\\text{ hours} = 12:45\\text{ p.m.}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Speed, Distance, and Time"
  },
  {
    "number": 19,
    "id": "MOCK08_P1_Q19",
    "prompt": "Find the total surface area of a solid hemisphere of radius $7\\text{ cm}$. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $308\\text{ cm}^2$",
      "B. $462\\text{ cm}^2$",
      "C. $616\\text{ cm}^2$",
      "D. $924\\text{ cm}^2$"
    ],
    "correctAnswer": "B",
    "hint": "Review Mensuration: Solid Hemisphere principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "A solid hemisphere includes both the curved surface and the flat circular base:\n$$\\text{TSA} = 2\\pi r^2 + \\pi r^2 = 3\\pi r^2 = 3 \\times \\frac{22}{7} \\times 7^2 = 3 \\times 22 \\times 7 = 462\\text{ cm}^2$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Mensuration: Solid Hemisphere"
  },
  {
    "number": 20,
    "id": "MOCK08_P1_Q20",
    "prompt": "Find the image of point $S(-4, 6)$ when reflected in the line $y = 0$ (the $x$-axis).",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(4, 6)$",
      "B. $(-6, 4)$",
      "C. $(4, -6)$",
      "D. $(-4, -6)$"
    ],
    "correctAnswer": "D",
    "hint": "Review Transformational Geometry: Reflection principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Reflection in the $x$-axis: $(x, y) \\to (x, -y)$:\n$$S(-4, 6) \\to S'(-4, -6)$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Reflection"
  },
  {
    "number": 21,
    "id": "MOCK08_P1_Q21",
    "prompt": "Find the rule governing the mapping:\n$$\\begin{array}{cccccc} x & 1 & 2 & 3 & 4 & 5 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 4 & 10 & 18 & 28 & 40 \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $y = x^2 + 3$",
      "B. $y = 2x^2 + 2$",
      "C. $y = x^2 + 3x$",
      "D. $y = 6x - 2$"
    ],
    "correctAnswer": "C",
    "hint": "Review Relations and Non-Linear Mappings principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Testing $y = x^2 + 3x$:\n- $x = 1: 1 + 3 = 4$\n- $x = 2: 4 + 6 = 10$\n- $x = 3: 9 + 9 = 18$\n- $x = 4: 16 + 12 = 28$\n- $x = 5: 25 + 15 = 40$\nAll values match.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Relations and Non-Linear Mappings"
  },
  {
    "number": 22,
    "id": "MOCK08_P1_Q22",
    "prompt": "A letter is chosen at random from the word PROBABILITY. What is the probability that the letter is a vowel?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{3}{11}$",
      "B. $\\frac{4}{11}$",
      "C. $\\frac{5}{11}$",
      "D. $\\frac{7}{11}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Probability principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Total letters in PROBABILITY $= 11$.\nVowels: $\\{O, A, I, I\\} \\implies 4\\text{ vowels}$.\n$$P(\\text{vowel}) = \\frac{4}{11}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 23,
    "id": "MOCK08_P1_Q23",
    "prompt": "In the right-angled triangle $ABC$, $\\angle ABC = 90^\\circ, |AB| = 5\\text{ cm},$ and $|BC| = 12\\text{ cm}$. Find the value of $\\sin(\\angle BAC)$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"180\" viewBox=\"0 0 280 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 220,140 40,30\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"40,125 55,125 55,140\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"25\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"230\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"30\" y=\"25\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"15\" y=\"90\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">5 cm</text><text x=\"120\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">12 cm</text></svg>",
    "options": [
      "A. $\\frac{5}{13}$",
      "B. $\\frac{12}{13}$",
      "C. $\\frac{5}{12}$",
      "D. $\\frac{12}{5}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Trigonometry principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$|AC| = \\sqrt{5^2 + 12^2} = \\sqrt{25 + 144} = \\sqrt{169} = 13\\text{ cm}$$\n$$\\sin(\\angle BAC) = \\frac{\\text{Opposite}}{\\text{Hypotenuse}} = \\frac{|BC|}{|AC|} = \\frac{12}{13}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Trigonometry"
  },
  {
    "number": 24,
    "id": "MOCK08_P1_Q24",
    "prompt": "A radio set was bought for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 320.00$ and sold for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 400.00$. Find the percentage profit.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $20\\%$",
      "B. $35\\%$",
      "C. $30\\%$",
      "D. $25\\%$"
    ],
    "correctAnswer": "D",
    "hint": "Review Commercial Arithmetic: Profit principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Profit} = 400 - 320 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 80.00$$\n$$\\text{Percentage profit} = \\frac{80}{320} \\times 100\\% = \\frac{1}{4} \\times 100\\% = 25\\%$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Profit"
  },
  {
    "number": 25,
    "id": "MOCK08_P1_Q25",
    "prompt": "Solve for $m$ in the equation: $5(m - 2) - 3(m + 1) = 9$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $9$",
      "B. $10$",
      "C. $11$",
      "D. $12$"
    ],
    "correctAnswer": "C",
    "hint": "Review Linear Equations principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$5m - 10 - 3m - 3 = 9$$\n$$2m - 13 = 9$$\n$$2m = 22 \\implies m = 11$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Linear Equations"
  },
  {
    "number": 26,
    "id": "MOCK08_P1_Q26",
    "prompt": "The bearing of point $S$ from point $T$ is $074^\\circ$. What is the bearing of point $T$ from point $S$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $106^\\circ$",
      "B. $164^\\circ$",
      "C. $254^\\circ$",
      "D. $284^\\circ$"
    ],
    "correctAnswer": "C",
    "hint": "Review Bearings principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Since forward bearing $\\theta = 074^\\circ < 180^\\circ$:\n$$\\text{Back bearing} = 074^\\circ + 180^\\circ = 254^\\circ$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Bearings"
  },
  {
    "number": 27,
    "id": "MOCK08_P1_Q27",
    "prompt": "A concrete pillar has volume $1.8\\text{ m}^3$ and density $2,400\\text{ kg/m}^3$. Calculate its mass in tonnes. $[1\\text{ tonne} = 1,000\\text{ kg}]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3.60\\text{ tonnes}$",
      "B. $4.00\\text{ tonnes}$",
      "C. $4.32\\text{ tonnes}$",
      "D. $4.80\\text{ tonnes}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Density and Volume principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Mass} = \\text{Volume} \\times \\text{Density} = 1.8 \\times 2,400 = 4,320\\text{ kg} = 4.32\\text{ tonnes}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Density and Volume"
  },
  {
    "number": 28,
    "id": "MOCK08_P1_Q28",
    "prompt": "A cylindrical borehole has radius $1.4\\text{ m}$ and depth $20\\text{ m}$. Calculate its volume. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $61.6\\text{ m}^3$",
      "B. $123.2\\text{ m}^3$",
      "C. $154.0\\text{ m}^3$",
      "D. $246.4\\text{ m}^3$"
    ],
    "correctAnswer": "B",
    "hint": "Review Mensuration: Cylinders principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$V = \\pi r^2 h = \\frac{22}{7} \\times (1.4)^2 \\times 20 = \\frac{22}{7} \\times 1.96 \\times 20 = 22 \\times 0.28 \\times 20 = 123.2\\text{ m}^3$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Mensuration: Cylinders"
  },
  {
    "number": 29,
    "id": "MOCK08_P1_Q29",
    "prompt": "Find the image of point $A(5, -2)$ under a $90^\\circ$ clockwise rotation about the origin.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(-2, -5)$",
      "B. $(2, 5)$",
      "C. $(-5, 2)$",
      "D. $(5, 2)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Transformational Geometry: Rotation principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Rotation by $90^\\circ$ clockwise: $(x, y) \\to (y, -x)$:\n$$A(5, -2) \\to A'(-2, -5)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Rotation"
  },
  {
    "number": 30,
    "id": "MOCK08_P1_Q30",
    "prompt": "The diagram shows a line $K$ on Cartesian axes. Find its equation.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"240\" viewBox=\"0 0 280 240\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"160\" x2=\"260\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"100\" y1=\"20\" x2=\"100\" y2=\"220\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"40\" y1=\"220\" x2=\"220\" y2=\"40\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"100\" cy=\"160\" r=\"3\" fill=\"#0f172a\"/><circle cx=\"100\" cy=\"100\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"160\" cy=\"160\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"108\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">(0, 2)</text><text x=\"155\" y=\"180\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">(-2, 0)</text><text x=\"180\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">K</text></svg>",
    "options": [
      "A. $y = x - 2$",
      "B. $y = -x + 2$",
      "C. $y = 2x + 2$",
      "D. $y = x + 2$"
    ],
    "correctAnswer": "D",
    "hint": "Review Coordinate Geometry: Line Equations principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Coordinates on line $K$: $(0, 2)$ and $(-2, 0)$:\n$$m = \\frac{2 - 0}{0 - (-2)} = \\frac{2}{2} = 1, \\quad c = 2 \\implies y = x + 2$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Line Equations"
  },
  {
    "number": 31,
    "id": "MOCK08_P1_Q31",
    "prompt": "The mean of $4\\text{ numbers}$ is $15$. If three of the numbers are $12, 16,$ and $18$, find the fourth number.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $12$",
      "B. $14$",
      "C. $16$",
      "D. $18$"
    ],
    "correctAnswer": "B",
    "hint": "Review Statistics: Mean principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\sum x = 4 \\times 15 = 60$$\n$$12 + 16 + 18 + x = 60$$\n$$46 + x = 60 \\implies x = 14$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Statistics: Mean"
  },
  {
    "number": 32,
    "id": "MOCK08_P1_Q32",
    "prompt": "Which property of arithmetic states that changing the grouping of factors does not change the product, such as $(a \\times b) \\times c = a \\times (b \\times c)$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. Commutative property",
      "B. Closure property",
      "C. Distributive property",
      "D. Associative property"
    ],
    "correctAnswer": "D",
    "hint": "Review Properties of Real Numbers principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "The associative property of multiplication states that $(a \\times b) \\times c = a \\times (b \\times c)$.\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Properties of Real Numbers"
  },
  {
    "number": 33,
    "id": "MOCK08_P1_Q33",
    "prompt": "On a map of scale $1 : 50,000$, a railway track measures $14\\text{ cm}$. Find the actual length of the track in kilometres.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3.5\\text{ km}$",
      "B. $7.0\\text{ km}$",
      "C. $14.0\\text{ km}$",
      "D. $28.0\\text{ km}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Scale and Ratio principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Actual length} = 14 \\times 50,000\\text{ cm} = 700,000\\text{ cm} = 7,000\\text{ m} = 7.0\\text{ km}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Scale and Ratio"
  },
  {
    "number": 34,
    "id": "MOCK08_P1_Q34",
    "prompt": "Find the simple interest on $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,400.00$ invested for $6\\text{ months}$ at $10\\%$ per annum.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 100.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 240.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 140.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 120.00$"
    ],
    "correctAnswer": "D",
    "hint": "Review Simple Interest principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$I = \\frac{2,400 \\times 10 \\times \\frac{6}{12}}{100} = 24 \\times 10 \\times 0.5 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 120.00$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Simple Interest"
  },
  {
    "number": 35,
    "id": "MOCK08_P1_Q35",
    "prompt": "Two coins are tossed simultaneously once. What is the probability of obtaining at least one head?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{1}{4}$",
      "B. $\\frac{1}{2}$",
      "C. $\\frac{3}{4}$",
      "D. $1$"
    ],
    "correctAnswer": "C",
    "hint": "Review Probability principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Sample space $S = \\{HH, HT, TH, TT\\} \\implies n(S) = 4$.\nAt least one head: $\\{HH, HT, TH\\} \\implies n(E) = 3$.\n$$P = \\frac{3}{4}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 36,
    "id": "MOCK08_P1_Q36",
    "prompt": "The diagram shows a regular octagon inscribed in a circle. What angle does each side subtend at the centre of the circle?",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"220\" viewBox=\"0 0 220 220\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"110\" cy=\"110\" r=\"80\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><polygon points=\"80,34.6 140,34.6 185.4,80 185.4,140 140,185.4 80,185.4 34.6,140 34.6,80\" fill=\"#10b981\" fill-opacity=\"0.2\" stroke=\"#059669\" stroke-width=\"2\"/><line x1=\"110\" y1=\"110\" x2=\"140\" y2=\"34.6\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><line x1=\"110\" y1=\"110\" x2=\"80\" y2=\"34.6\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><circle cx=\"110\" cy=\"110\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"103\" y=\"80\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">θ</text></svg>",
    "options": [
      "A. $36^\\circ$",
      "B. $40^\\circ$",
      "C. $45^\\circ$",
      "D. $60^\\circ$"
    ],
    "correctAnswer": "C",
    "hint": "Review Polygons and Circles principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "A full circular turn is $360^\\circ$. For a regular octagon ($8$ equal sides):\n$$\\theta = \\frac{360^\\circ}{8} = 45^\\circ$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Polygons and Circles"
  },
  {
    "number": 37,
    "id": "MOCK08_P1_Q37",
    "prompt": "Express $0.00845$ in standard form.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $8.45 \\times 10^{-4}$",
      "B. $8.45 \\times 10^{-3}$",
      "C. $8.45 \\times 10^{-2}$",
      "D. $84.5 \\times 10^{-4}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Standard Form principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Shift the decimal point $3$ places to the right:\n$$0.00845 = 8.45 \\times 10^{-3}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Standard Form"
  },
  {
    "number": 38,
    "id": "MOCK08_P1_Q38",
    "prompt": "If $2^{3x - 2} = 64$, find the value of $x$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2$",
      "B. $2\\frac{2}{3}$",
      "C. $3$",
      "D. $4$"
    ],
    "correctAnswer": "B",
    "hint": "Review Indices and Exponents principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$64 = 2^6$$\n$$2^{3x - 2} = 2^6 \\implies 3x - 2 = 6 \\implies 3x = 8 \\implies x = \\frac{8}{3} = 2\\frac{2}{3}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Indices and Exponents"
  },
  {
    "number": 39,
    "id": "MOCK08_P1_Q39",
    "prompt": "How many lines of symmetry has a regular pentagon?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3$",
      "B. $4$",
      "C. $5$",
      "D. $10$"
    ],
    "correctAnswer": "C",
    "hint": "Review Symmetry in Polygons principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Every regular polygon with $n$ sides has exactly $n$ axes of symmetry. A regular pentagon has $5$ lines of symmetry.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Symmetry in Polygons"
  },
  {
    "number": 40,
    "id": "MOCK08_P1_Q40",
    "prompt": "A crate contains $36\\text{ bottles}$ of soft drink. If $9\\text{ bottles}$ are broken, what percentage of the bottles in the crate are sound (unbroken)?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $25\\%$",
      "B. $65\\%$",
      "C. $70\\%$",
      "D. $75\\%$"
    ],
    "correctAnswer": "D",
    "hint": "Review Percentages principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Unbroken bottles} = 36 - 9 = 27$$\n$$\\text{Percentage sound} = \\left(\\frac{27}{36}\\right) \\times 100\\% = \\frac{3}{4} \\times 100\\% = 75\\%$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Percentages"
  }
];

export const SET_BECE_MOCK_8_MATH_P1: CurriculumQuestionSet = {
  id: "math_mock_8_p1",
  title: "BECE Mathematics National Mock 8 (Paper 1 Objective)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 8 Paper 1",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_08/paper_1",
  questions: allRawMathMock8Questions.map((q) => ({
    id: `math_m8_q${q.number}`,
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

export const rawMathMock8Paper2Questions = [
  {
    "questionNumber": 1,
    "id": "MOCK08_P2_Q01_VARB",
    "marks": 15,
    "topic": "Sets, Linear Inequalities, and Vector Column Operations",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"380\" height=\"240\" viewBox=\"0 0 380 240\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"10\" width=\"360\" height=\"220\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"35\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 85</text><circle cx=\"145\" cy=\"125\" r=\"72\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"235\" cy=\"125\" r=\"72\" fill=\"#10b981\" fill-opacity=\"0.2\" stroke=\"#059669\" stroke-width=\"2\"/><text x=\"105\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">P (Physics)</text><text x=\"240\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#047857\">C (Chemistry)</text><text x=\"105\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">32</text><text x=\"182\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">18</text><text x=\"255\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">24</text><text x=\"315\" y=\"205\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">11</text></svg>",
        "questionText": "In a school of $85\\text{ science candidates}$, $50$ take Physics ($P$), $42$ take Chemistry ($C$), and $18$ take both subjects. The remaining candidates take neither of the two subjects.\n(i) Illustrate the information on a Venn diagram.\n(ii) Find the number of candidates who take:\n    $(\\alpha)$ Physics only;\n    $(\\beta)$ exactly one subject;\n    $(\\gamma)$ neither Physics nor Chemistry.",
        "workedSolution": "**(i) Venn Diagram Representation:**\nUniversal set $n(U) = 85$.\n- Physics candidates: $n(P) = 50$\n- Chemistry candidates: $n(C) = 42$\n- Both subjects: $n(P \\cap C) = 18$\n\nRegion Breakdown:\n- Physics only: $n(P \\cap C') = 50 - 18 = 32$\n- Chemistry only: $n(P' \\cap C) = 42 - 18 = 24$\n- Both subjects: $n(P \\cap C) = 18$\n- Neither subject: $n(P \\cup C)' = 85 - (32 + 18 + 24) = 85 - 74 = 11$\n\n*(See the embedded SVG above for the complete, labeled illustration)*.\n\n---\n\n**(ii) ($a$) Candidates taking Physics only:**\n$$n(P \\cap C') = 50 - 18 = 32$$\nTherefore, **$32\\text{ candidates}$ take Physics only**.\n\n---\n\n**(ii) ($\\beta$) Candidates taking exactly one subject:**\n$$\\text{Exactly one subject} = n(P \\cap C') + n(P' \\cap C) = 32 + 24 = 56$$\nTherefore, **$56\\text{ candidates}$ take exactly one subject**.\n\n---\n\n**(ii) ($\\gamma$) Candidates taking neither subject:**\n$$n(P \\cup C)' = 85 - 74 = 11$$\nTherefore, **$11\\text{ candidates}$ take neither Physics nor Chemistry**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"80\" viewBox=\"0 0 360 80\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"40\" x2=\"340\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"35\" x2=\"60\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"35\" x2=\"120\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"35\" x2=\"180\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"35\" x2=\"240\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"300\" y1=\"35\" x2=\"300\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"55\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">0</text><text x=\"117\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">1</text><text x=\"177\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">2</text><text x=\"237\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">3</text><text x=\"297\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">4</text><circle cx=\"237\" cy=\"25\" r=\"5\" fill=\"#0284c7\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><line x1=\"237\" y1=\"25\" x2=\"340\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"3\"/><polygon points=\"335,20 345,25 335,30\" fill=\"#0284c7\"/></svg>",
        "questionText": "(i) Solve the inequality: $\\frac{2x - 3}{3} - \\frac{x - 4}{4} \\ge \\frac{1}{2}$.\n(ii) Illustrate the solution on a number line.",
        "workedSolution": "**(i) Solving the inequality:**\n$$\\frac{2x - 3}{3} - \\frac{x - 4}{4} \\ge \\frac{1}{2}$$\nMultiply through by the LCM of denominators ($12$):\n$$12\\left(\\frac{2x - 3}{3}\\right) - 12\\left(\\frac{x - 4}{4}\\right) \\ge 12\\left(\\frac{1}{2}\\right)$$\n$$4(2x - 3) - 3(x - 4) \\ge 6$$\n$$8x - 12 - 3x + 12 \\ge 6$$\n$$5x \\ge 6 \\implies x \\ge \\frac{6}{5} = 1.2$$\n\n**Truth set:** $\\mathbf{\\left\\{x : x \\ge 1\\frac{1}{5}\\right\\}}$.\n\n---\n\n**(ii) Number Line Representation:**\nMark a solid circle at $x = 1.2$ on a horizontal number line and draw a directed arrow pointing to the right toward positive infinity."
      }
    ]
  },
  {
    "questionNumber": 2,
    "id": "MOCK08_P2_Q02_VARB",
    "marks": 15,
    "topic": "Algebraic Formulae, Rates of Work, and Angles in Parallel Lines",
    "subQuestions": [
      {
        "part": "a",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "(i) Make $u$ the subject of the relation: $E = \\frac{1}{2}m(v^2 - u^2)$.\n(ii) Hence, find the value of $u$ when $E = 72, m = 4,$ and $v = 10$.",
        "workedSolution": "**(i) Making $u$ the subject:**\nMultiply both sides by $2$:\n$$2E = m(v^2 - u^2)$$\nDivide by $m$:\n$$\\frac{2E}{m} = v^2 - u^2$$\nRearrange to isolate $u^2$:\n$$u^2 = v^2 - \\frac{2E}{m}$$\nTake the positive square root:\n$$u = \\sqrt{v^2 - \\frac{2E}{m}}$$\n\n---\n\n**(ii) Evaluating $u$ when $E = 72, m = 4,$ and $v = 10$:**\n$$u = \\sqrt{10^2 - \\frac{2(72)}{4}} = \\sqrt{100 - \\frac{144}{4}} = \\sqrt{100 - 36} = \\sqrt{64} = 8$$\n\nTherefore, **$u = 8$**."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "Ten agricultural workers take $12\\text{ days}$ to harvest a citrus plantation.\n(i) How many days will it take $15\\text{ workers}$ working at the same rate to harvest the plantation?\n(ii) If the harvest must be completed in $8\\text{ days}$, how many additional workers must be recruited?",
        "workedSolution": "**(i) Days for 15 workers:**\n$$\\text{Total work} = 10 \\times 12 = 120\\text{ worker-days}$$\n$$\\text{Days for 15 workers} = \\frac{120}{15} = 8\\text{ days}$$\n\nTherefore, $15\\text{ workers}$ will take **$8\\text{ days}$**.\n\n---\n\n**(ii) Additional workers for an 8-day harvest:**\n$$\\text{Workers needed} = \\frac{120\\text{ worker-days}}{8\\text{ days}} = 15\\text{ workers}$$\n$$\\text{Additional workers} = 15 - 10 = 5$$\n\nTherefore, **$5\\text{ additional workers}$** must be recruited."
      },
      {
        "part": "c",
        "marks": 4,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"180\" viewBox=\"0 0 360 180\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"30\" y1=\"50\" x2=\"330\" y2=\"50\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"30\" y1=\"140\" x2=\"330\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"90\" y1=\"170\" x2=\"250\" y2=\"20\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 215 50 A 25 25 0 0 1 234 32\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><path d=\"M 135 140 A 25 25 0 0 1 154 122\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"220\" y=\"38\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">64°</text><text x=\"140\" y=\"132\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">(4k - 8)°</text><text x=\"30\" y=\"42\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"320\" y=\"42\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"30\" y=\"132\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"320\" y=\"132\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">D</text></svg>",
        "questionText": "In the diagram, line $AB$ is parallel to line $CD$ ($AB \\parallel CD$). The transversal intersects lines $AB$ and $CD$ such that corresponding angles are $64^\\circ$ and $(4k - 8)^\\circ$. Find the value of $k$.",
        "workedSolution": "Since $AB \\parallel CD$, corresponding angles across the transversal line are equal:\n$$4k - 8 = 64$$\n$$4k = 64 + 8 = 72$$\n$$k = \\frac{72}{4} = 18$$\n\nTherefore, **$k = 18$**."
      }
    ]
  },
  {
    "questionNumber": 3,
    "id": "MOCK08_P2_Q03_VARB",
    "marks": 15,
    "topic": "Compound Mensuration: Rectangular Compound with Semicircle and Cylindrical Drum",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"220\" viewBox=\"0 0 360 220\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"50\" y=\"40\" width=\"180\" height=\"140\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><path d=\"M 230 40 A 70 70 0 0 1 230 180 Z\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><line x1=\"230\" y1=\"40\" x2=\"230\" y2=\"180\" stroke=\"#64748b\" stroke-width=\"1.8\" stroke-dasharray=\"4\"/><text x=\"120\" y=\"30\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">25 m</text><text x=\"15\" y=\"115\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">14 m</text><text x=\"245\" y=\"115\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">r = 7 m</text><text x=\"100\" y=\"205\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
        "questionText": "The diagram shows a recreational compound comprising a rectangular lawn attached to a semicircular garden bed. The rectangle is $25\\text{ m}$ long and $14\\text{ m}$ wide, with the diameter of the semicircle matching the width of the rectangle. Calculate the:\n(i) total perimeter of the compound;\n(ii) total area of the compound. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
        "workedSolution": "**(i) Total perimeter of the compound:**\nThe boundary includes two lengths ($25\\text{ m}$ each), one end width ($14\\text{ m}$), and the semicircular arc ($r = 7\\text{ m}$):\n$$\\text{Arc length} = \\pi r = \\frac{22}{7} \\times 7 = 22\\text{ m}$$\n$$\\text{Perimeter} = 25 + 14 + 25 + 22 = 86\\text{ m}$$\n\nTherefore, the total perimeter is **$86\\text{ m}$**.\n\n---\n\n**(ii) Total area of the compound:**\n$$\\text{Area of rectangle} = 25 \\times 14 = 350\\text{ m}^2$$\n$$\\text{Area of semicircle} = \\frac{1}{2}\\pi r^2 = \\frac{1}{2} \\times \\frac{22}{7} \\times 7^2 = 11 \\times 7 = 77\\text{ m}^2$$\n$$\\text{Total Area} = 350 + 77 = 427\\text{ m}^2$$\n\nTherefore, the total area of the compound is **$427\\text{ m}^2$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A closed cylindrical fuel drum of base radius $2.1\\text{ m}$ and height $6.0\\text{ m}$ is to be painted externally across its entire surface (both circular bases and curved side). Calculate the:\n(i) total surface area of the drum;\n(ii) number of paint tins required if one tin covers $18\\text{ m}^2$. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
        "workedSolution": "**(i) Total surface area of the closed drum:**\n$$\\text{TSA} = 2\\pi r(r + h)$$\nGiven $r = 2.1 = \\frac{21}{10}\\text{ m}$ and $h = 6.0\\text{ m}$:\n$$\\text{TSA} = 2 \\times \\frac{22}{7} \\times \\frac{21}{10} \\times (2.1 + 6.0) = 2 \\times 22 \\times \\frac{3}{10} \\times 8.1 = \\frac{132}{10} \\times 8.1 = 13.2 \\times 8.1 = 106.92\\text{ m}^2$$\n\nTherefore, the total surface area is **$106.92\\text{ m}^2$**.\n\n---\n\n**(ii) Number of paint tins required:**\n$$\\text{Number of tins} = \\frac{106.92}{18} = 5.94$$\nRounding up to the nearest whole tin:\n$$5.94 \\implies 6\\text{ tins}$$\n\nTherefore, **$6\\text{ tins}$** of paint are required."
      }
    ]
  },
  {
    "questionNumber": 4,
    "id": "MOCK08_P2_Q04_VARB",
    "marks": 15,
    "topic": "Geometric Compass Construction: Triangle with $60^\\circ$ and $45^\\circ$ Angles and Altitude",
    "subQuestions": [
      {
        "part": "a",
        "marks": 10,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"420\" height=\"300\" viewBox=\"0 0 420 300\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"420\" height=\"300\" fill=\"#ffffff\"/><polygon points=\"70,230 350,230 190,65\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"190\" y1=\"65\" x2=\"190\" y2=\"230\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><polyline points=\"190,215 205,215 205,230\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><path d=\"M 120 230 A 50 50 0 0 0 95 187\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 295 230 A 55 55 0 0 1 318 191\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"108\" y=\"215\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">60°</text><text x=\"290\" y=\"210\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">45°</text><text x=\"55\" y=\"245\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"360\" y=\"245\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"185\" y=\"55\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"185\" y=\"250\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">D</text><text x=\"205\" y=\"250\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">10 cm</text></svg>",
        "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct the baseline $|AB| = 10.0\\text{ cm}$;\n(ii) At vertex $A$, construct an angle $\\angle CAB = 60^\\circ$;\n(iii) At vertex $B$, construct an angle $\\angle CBA = 45^\\circ$ such that the rays intersect at vertex $C$ to complete triangle $ABC$;\n(iv) Drop a perpendicular line from vertex $C$ to meet side $AB$ at point $D$.",
        "workedSolution": "**Compass Construction Steps:**\n1. **Base Line $|AB| = 10.0\\text{ cm}$:**\n   - Draw a horizontal pencil line and mark vertex $A$.\n   - Set compasses to $10.0\\text{ cm}$, place needle at $A$, and strike an arc to locate $B$.\n2. **Construct $\\angle CAB = 60^\\circ$ at $A$:**\n   - With needle at $A$, strike an arc crossing $AB$. From the intersection, strike an equal arc to locate the $60^\\circ$ ray.\n   - Draw the ray extending upward from $A$.\n3. **Construct $\\angle CBA = 45^\\circ$ at $B$:**\n   - Construct a $90^\\circ$ perpendicular ray at $B$ and bisect it to obtain a $45^\\circ$ ray.\n   - Draw the ray from $B$ until it intersects the $60^\\circ$ ray from $A$ at vertex $C$.\n4. **Perpendicular Altitude from $C$ to $AB$ (Point $D$):**\n   - Place needle at $C$ and strike an arc cutting $AB$ at two distinct points.\n   - From those points, strike intersecting arcs below $AB$.\n   - Rule a straight vertical line from $C$ through the intersection to cross $AB$ at point $D$."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your completed construction in (a):\n(i) Measure the length of side $|BC|$;\n(ii) Measure the altitude $|CD|$;\n(iii) Calculate, correct to the nearest whole number, the area of triangle $ABC$.",
        "workedSolution": "**(i) Measuring length $|BC|$:**\n- In $\\triangle ABC$, $\\angle C = 180^\\circ - (60^\\circ + 45^\\circ) = 75^\\circ$:\n  By the Sine Rule:\n  $$\\frac{|BC|}{\\sin 60^\\circ} = \\frac{|AB|}{\\sin 75^\\circ} \\implies |BC| = 10.0 \\times \\frac{\\sin 60^\\circ}{\\sin 75^\\circ} = 10.0 \\times \\frac{0.8660}{0.9659} \\approx 8.97\\text{ cm}$$\n$$\\mathbf{|BC| \\approx 9.0\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(ii) Measuring altitude $|CD|$:**\n- In right-angled triangle $\\triangle BDC$:\n  $$|CD| = |BC| \\sin 45^\\circ = 8.97 \\times 0.7071 \\approx 6.34\\text{ cm}$$\n$$\\mathbf{|CD| \\approx 6.3\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(iii) Area of triangle $ABC$:**\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 10.0 \\times 6.34 = 5.0 \\times 6.34 = 31.7\\text{ cm}^2$$\nRounding to the nearest whole number:\n$$\\text{Area} \\approx 32\\text{ cm}^2$$\n\nTherefore, the area of triangle $ABC$ is **$32\\text{ cm}^2$**."
      }
    ]
  },
  {
    "questionNumber": 5,
    "id": "MOCK08_P2_Q05_VARB",
    "marks": 15,
    "topic": "Frequency Distribution, Mean, and Bar Chart",
    "subQuestions": [
      {
        "part": "a",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The following dataset displays the number of text messages sent by $30\\text{ students}$ on a given weekend:\n$$3, 1, 4, 2, 3, 5, 2, 3, 4, 1, 2, 3, 4, 2, 3, 5, 3, 2, 4, 3, 1, 2, 3, 4, 3, 2, 1, 4, 3, 2$$\nConstruct a frequency distribution table showing the number of messages ($x$), tally, frequency ($f$), and product ($fx$).",
        "workedSolution": "**Frequency Distribution Table:**\n\n| Number of Messages ($x$) | Tally | Frequency ($f$) | Product ($fx$) |\n| :---: | :--- | :---: | :---: |\n| $1$ | $\\parallel\\parallel$ | $4$ | $1 \\times 4 = 4$ |\n| $2$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\parallel\\mid$ | $8$ | $2 \\times 8 = 16$ |\n| $3$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\cancel{\\parallel\\parallel\\parallel\\parallel}$ | $10$ | $3 \\times 10 = 30$ |\n| $4$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\mid$ | $6$ | $4 \\times 6 = 24$ |\n| $5$ | $\\parallel$ | $2$ | $5 \\times 2 = 10$ |\n| **Total** | | **$\\sum f = 30$** | **$\\sum fx = 84$** |"
      },
      {
        "part": "b",
        "marks": 4,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your frequency distribution table in (a), calculate:\n(i) the modal number of text messages sent;\n(ii) the mean number of text messages sent per student, correct to one decimal place.",
        "workedSolution": "**(i) Modal number of messages:**\nThe highest frequency is $10$, which corresponds to $3\\text{ messages}$.\n$$\\text{Modal messages} = 3$$\n\n---\n\n**(ii) Mean number of messages ($\\bar{x}$):**\n$$\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{84}{30} = 2.8$$\n\nTherefore, the mean number of text messages is **$2.8\\text{ messages}$**."
      },
      {
        "part": "c",
        "marks": 5,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"240\" viewBox=\"0 0 360 240\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"50\" y1=\"190\" x2=\"320\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"50\" y1=\"30\" x2=\"50\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2\"/><rect x=\"70\" y=\"134\" width=\"30\" height=\"56\" fill=\"#0284c7\"/><rect x=\"120\" y=\"78\" width=\"30\" height=\"112\" fill=\"#0284c7\"/><rect x=\"170\" y=\"50\" width=\"30\" height=\"140\" fill=\"#0284c7\"/><rect x=\"220\" y=\"106\" width=\"30\" height=\"84\" fill=\"#0284c7\"/><rect x=\"270\" y=\"162\" width=\"30\" height=\"28\" fill=\"#0284c7\"/><text x=\"80\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">1</text><text x=\"130\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">2</text><text x=\"180\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">3</text><text x=\"230\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">4</text><text x=\"280\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">5</text><text x=\"30\" y=\"138\" font-family=\"sans-serif\" font-size=\"11\">4</text><text x=\"30\" y=\"82\" font-family=\"sans-serif\" font-size=\"11\">8</text><text x=\"25\" y=\"54\" font-family=\"sans-serif\" font-size=\"11\">10</text><text x=\"140\" y=\"230\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Messages Sent</text><text x=\"15\" y=\"25\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Frequency</text></svg>",
        "questionText": "Draw a bar chart to represent the distribution in (a).",
        "workedSolution": "**Bar Chart Drawing Guide:**\n- Horizontal axis represents the number of messages ($1, 2, 3, 4, 5$) with uniform bar widths and equal inter-bar spacing.\n- Vertical axis represents frequency with a scale from $0$ to $12$ ($2\\text{ cm} = 2\\text{ units}$).\n- Bar heights correspond to frequencies: $4$ (for $1$), $8$ (for $2$), $10$ (for $3$), $6$ (for $4$), and $2$ (for $5$).\n\n*(See the embedded SVG above for the complete, well-labeled bar chart)*."
      }
    ]
  },
  {
    "questionNumber": 6,
    "id": "MOCK08_P2_Q06_VARB",
    "marks": 15,
    "topic": "Linear Relations, Table of Values, and Coordinate Graphing",
    "subQuestions": [
      {
        "part": "a",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "(i) Copy and complete the table of values for the linear relations $y_1 = 2x + 1$ and $y_2 = 7 - x$ for the domain $-2 \\le x \\le 4$.\n\n| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 2x + 1$ | $-3$ | | $1$ | | $5$ | | $9$ |\n| $y_2 = 7 - x$ | $9$ | | $7$ | | $5$ | | $3$ |\n\n(ii) Identify the point of intersection of the two lines from your completed table.",
        "workedSolution": "**(i) Completed Table:**\nEvaluate $y_1 = 2x + 1$:\n- $x = -1: y_1 = 2(-1) + 1 = -1$\n- $x = 1: y_1 = 2(1) + 1 = 3$\n- $x = 3: y_1 = 2(3) + 1 = 7$\n\nEvaluate $y_2 = 7 - x$:\n- $x = -1: y_2 = 7 - (-1) = 8$\n- $x = 1: y_2 = 7 - 1 = 6$\n- $x = 3: y_2 = 7 - 3 = 4$\n\n| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 2x + 1$ | $-3$ | **$-1$** | $1$ | **$3$** | $5$ | **$7$** | $9$ |\n| $y_2 = 7 - x$ | $9$ | **$8$** | $7$ | **$6$** | $5$ | **$4$** | $3$ |\n\n---\n\n**(ii) Point of intersection:**\nAt $x = 2$, both relations give $y = 5$.\nTherefore, the point of intersection is **$(2, 5)$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"380\" viewBox=\"0 0 400 380\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"380\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"gridMK8\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"380\" fill=\"url(#gridMK8)\"/><line x1=\"20\" y1=\"260\" x2=\"380\" y2=\"260\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"140\" y1=\"20\" x2=\"140\" y2=\"360\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"385\" y=\"265\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"145\" y=\"25\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><line x1=\"80\" y1=\"320\" x2=\"320\" y2=\"80\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><text x=\"310\" y=\"70\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">y = 2x + 1</text><line x1=\"80\" y1=\"80\" x2=\"320\" y2=\"200\" stroke=\"#dc2626\" stroke-width=\"2.5\"/><text x=\"300\" y=\"220\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">y = 7 - x</text><circle cx=\"220\" cy=\"160\" r=\"4.5\" fill=\"#7c3aed\"/><text x=\"230\" y=\"155\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#7c3aed\">(2, 5)</text></svg>",
        "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on the $x$-axis and $2\\text{ cm}$ to $2\\text{ units}$ on the $y$-axis, draw two perpendicular axes $Ox$ and $Oy$ on a graph sheet for $-3 \\le x \\le 5$ and $-4 \\le y \\le 10$.\nPlot both lines on the same graph sheet and label them clearly.",
        "workedSolution": "**Graph Execution Protocol:**\n1. Calibrate $x$-axis: $2\\text{ cm} = 1\\text{ unit}$ ($-3$ to $5$).\n2. Calibrate $y$-axis: $2\\text{ cm} = 2\\text{ units}$ ($-4$ to $10$).\n3. Plot the points for $y_1 = 2x + 1$: $(-2, -3), (-1, -1), (0, 1), (1, 3), (2, 5), (3, 7), (4, 9)$ and draw the line.\n4. Plot the points for $y_2 = 7 - x$: $(-2, 9), (-1, 8), (0, 7), (1, 6), (2, 5), (3, 4), (4, 3)$ and draw the line.\n5. Label both lines and their intersection point $(2, 5)$."
      },
      {
        "part": "c",
        "marks": 3,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your graph, find:\n(i) the gradient of line $y = 2x + 1$;\n(ii) the value of $x$ when $7 - x = 0$.",
        "workedSolution": "**(i) Gradient of line $y = 2x + 1$:**\n$$m = 2$$\n\n---\n\n**(ii) Value of $x$ when $7 - x = 0$ ($x$-intercept):**\n$$7 - x = 0 \\implies x = 7$$\n*(Or from graph reading: $x = 7$)*."
      }
    ]
  }
];

export const allRawMathMock8TheoryQuestions = rawMathMock8Paper2Questions;

export const SET_BECE_MOCK_8_MATH_P2: CurriculumQuestionSet = {
  id: "math_mock_8_p2",
  title: "BECE Mathematics National Mock 8 (Paper 2 Theory & Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 8 Paper 2",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_08/paper_2",
  questions: rawMathMock8Paper2Questions.map((q) => {
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
      id: `math_m8_p2_q${q.questionNumber}`,
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
export const SET_BECE_MOCK_8_MATH_COMPLETE = {
  mockExamNumber: 8,
  subject: "Mathematics",
  examType: "BECE Mathematics National Standard Mock 8",
  academicYear: 2026,
  paper1: SET_BECE_MOCK_8_MATH_P1,
  paper2: SET_BECE_MOCK_8_MATH_P2,
  totalMarks: 100,
  unifiedTimeMinutes: 120
};
