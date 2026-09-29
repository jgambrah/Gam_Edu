/**
 * JHS Curriculum Data - BECE Mathematics National Mock 1
 * Standardized Isomorphic Examination Suite (Paper 1 CBT + Paper 2 Theory)
 *
 * Proprietary Content © GAM IT Solutions (GAM EDU). All rights reserved.
 * Curriculum Alignment: NaCCA JHS Common Core Programme / WAEC Standards
 */

import { CurriculumQuestionSet } from '../types';

export interface MathMockObjectiveQuestion {
  number: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  workedSolution: string;
  points: number;
  topic: string;
  hasDiagram?: boolean;
  svgDiagram?: string | null;
}

export const allRawMathMock1Questions: MathMockObjectiveQuestion[] = [

  {
    "number": 1,
    "prompt": "If $P = \\{x : x \\text{ is a factor of } 36\\}$ and $Q = \\{x : x \\text{ is a prime number less than } 20\\}$, find $n(P \\cap Q)$.",
    "options": [
      "A. $2$",
      "B. $3$",
      "C. $4$",
      "D. $5$"
    ],
    "correctAnswer": "A",
    "hint": "Identify the prime factors of 36 that are strictly less than 20.",
    "workedSolution": "The factors of $36$ are $\\{1, 2, 3, 4, 6, 9, 12, 18, 36\\}$. The prime numbers less than $20$ are $\\{2, 3, 5, 7, 11, 13, 17, 19\\}.\nThe intersection $P \\cap Q = \\{2, 3\\}$.\nTherefore, $n(P \\cap Q) = 2$.",
    "points": 1,
    "topic": "Sets and Prime Numbers"
  },
  {
    "number": 2,
    "prompt": "Express $0.000458$ in standard form.",
    "options": [
      "A. $4.58 \\times 10^{-5}$",
      "B. $4.58 \\times 10^{-4}$",
      "C. $45.8 \\times 10^{-5}$",
      "D. $4.58 \\times 10^{4}$"
    ],
    "correctAnswer": "B",
    "hint": "Standard form is written as $A \\times 10^n$, where $1 \\le A < 10$. Count decimal places shifted to the right.",
    "workedSolution": "Shifting the decimal point $4$ places to the right gives $4.58$.\nSince the number is less than $1$, the exponent is negative:\n$$0.000458 = 4.58 \\times 10^{-4}$$",
    "points": 1,
    "topic": "Standard Form"
  },
  {
    "number": 3,
    "prompt": "Evaluate: $\\frac{3}{4} - \\left(\\frac{2}{5} \\div \\frac{8}{15}\\right)$.",
    "options": [
      "A. $\\frac{1}{2}$",
      "B. $\\frac{1}{4}$",
      "C. $-\\frac{1}{4}$",
      "D. $0$"
    ],
    "correctAnswer": "D",
    "hint": "Apply the order of operations (BODMAS). Evaluate the division inside parentheses first.",
    "workedSolution": "First evaluate the bracket:\n$$\\frac{2}{5} \\div \\frac{8}{15} = \\frac{2}{5} \\times \\frac{15}{8} = \\frac{30}{40} = \\frac{3}{4}$$\nThen subtract:\n$$\\frac{3}{4} - \\frac{3}{4} = 0$$",
    "points": 1,
    "topic": "Fractions and BODMAS"
  },
  {
    "number": 4,
    "prompt": "Find the Least Common Multiple (LCM) of $12, 18,$ and $30$.",
    "options": [
      "A. $90$",
      "B. $120$",
      "C. $180$",
      "D. $360$"
    ],
    "correctAnswer": "C",
    "hint": "Decompose each number into prime factors and take the highest power of each prime.",
    "workedSolution": "$$12 = 2^2 \\times 3$$\n$$18 = 2 \\times 3^2$$\n$$30 = 2 \\times 3 \\times 5$$\n$$\\text{LCM} = 2^2 \\times 3^2 \\times 5 = 4 \\times 9 \\times 5 = 180$$",
    "points": 1,
    "topic": "Number Theory and LCM"
  },
  {
    "number": 5,
    "prompt": "Convert $11011_2$ to a base ten numeral.",
    "options": [
      "A. $23$",
      "B. $25$",
      "C. $27$",
      "D. $31$"
    ],
    "correctAnswer": "C",
    "hint": "Expand using powers of 2 from right to left: $2^0, 2^1, 2^2, 2^3, 2^4$.",
    "workedSolution": "$$11011_2 = (1 \\times 2^4) + (1 \\times 2^3) + (0 \\times 2^2) + (1 \\times 2^1) + (1 \\times 2^0)$$\n$$= 16 + 8 + 0 + 2 + 1 = 27$$",
    "points": 1,
    "topic": "Number Bases"
  },
  {
    "number": 6,
    "prompt": "In a class of $45$ students, the ratio of boys to girls is $2 : 3$. How many more girls than boys are in the class?",
    "options": [
      "A. $6$",
      "B. $9$",
      "C. $12$",
      "D. $15$"
    ],
    "correctAnswer": "B",
    "hint": "Find the total ratio parts $2 + 3 = 5$, then evaluate the difference of $1$ part.",
    "workedSolution": "$$\\text{Total parts} = 2 + 3 = 5$$\n$$\\text{Value of one part} = \\frac{45}{5} = 9$$\n$$\\text{Boys} = 2 \\times 9 = 18$$\n$$\\text{Girls} = 3 \\times 9 = 27$$\n$$\\text{Difference} = 27 - 18 = 9$$",
    "points": 1,
    "topic": "Ratio and Proportion"
  },
  {
    "number": 7,
    "prompt": "A television set marked at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,200.00$ is sold at a cash discount of $12\\%$. Calculate the cash price paid.",
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,056.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,080.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,144.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,188.00$"
    ],
    "correctAnswer": "A",
    "hint": "The cash price is $100\\% - 12\\% = 88\\%$ of the marked price.",
    "workedSolution": "$$\\text{Discount} = \\frac{12}{100} \\times 1200 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 144.00$$\n$$\\text{Cash price} = 1200 - 144 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,056.00$$",
    "points": 1,
    "topic": "Commercial Arithmetic and Discount"
  },
  {
    "number": 8,
    "prompt": "Calculate the simple interest on $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 800.00$ invested for $2\\frac{1}{2}\\text{ years}$ at $5\\%\\text{ per annum}$.",
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 80.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 100.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 120.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 200.00$"
    ],
    "correctAnswer": "B",
    "hint": "Use the formula $I = \\frac{P \\times R \\times T}{100}$.",
    "workedSolution": "$$I = \\frac{800 \\times 5 \\times 2.5}{100} = 8 \\times 5 \\times 2.5 = 40 \\times 2.5 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 100.00$$",
    "points": 1,
    "topic": "Simple Interest"
  },
  {
    "number": 9,
    "prompt": "If $8\\text{ men}$ can weed a school compound in $6\\text{ hours}$, how many hours will $12\\text{ men}$ take working at the exact same rate?",
    "options": [
      "A. $3\\text{ hours}$",
      "B. $4\\text{ hours}$",
      "C. $5\\text{ hours}$",
      "D. $9\\text{ hours}$"
    ],
    "correctAnswer": "B",
    "hint": "This is inverse proportion: more men require less time. $\\text{Total man-hours} = 8 \\times 6$.",
    "workedSolution": "$$\\text{Total work} = 8 \\times 6 = 48\\text{ man-hours}$$\n$$\\text{Time for 12 men} = \\frac{48}{12} = 4\\text{ hours}$$",
    "points": 1,
    "topic": "Inverse Proportion"
  },
  {
    "number": 10,
    "prompt": "Evaluate $(3^4 \\times 3^{-2}) \\div 3^0$.",
    "options": [
      "A. $1$",
      "B. $3$",
      "C. $6$",
      "D. $9$"
    ],
    "correctAnswer": "D",
    "hint": "Use index laws: $a^m \\times a^n = a^{m+n}$ and $a^0 = 1$.",
    "workedSolution": "$$3^4 \\times 3^{-2} = 3^{4 + (-2)} = 3^2 = 9$$\n$$3^0 = 1$$\n$$\\frac{9}{1} = 9$$",
    "points": 1,
    "topic": "Indices"
  },
  {
    "number": 11,
    "prompt": "Solve the linear equation: $3(2x - 1) - 2(x + 4) = 9$.",
    "options": [
      "A. $x = 5$",
      "B. $x = 4$",
      "C. $x = 3$",
      "D. $x = 6$"
    ],
    "correctAnswer": "A",
    "hint": "Expand the brackets carefully, paying attention to the negative sign on $-2(x + 4)$.",
    "workedSolution": "$$6x - 3 - 2x - 8 = 9$$\n$$4x - 11 = 9$$\n$$4x = 20 \\implies x = 5$$",
    "points": 1,
    "topic": "Linear Equations"
  },
  {
    "number": 12,
    "prompt": "Factorize completely: $6ab - 9a + 4b - 6$.",
    "options": [
      "A. $(2b - 3)(3a + 2)$",
      "B. $(2b + 3)(3a - 2)$",
      "C. $(3a - 3)(2b + 2)$",
      "D. $(6a + 2)(b - 3)$"
    ],
    "correctAnswer": "A",
    "hint": "Group terms in pairs: $(6ab - 9a) + (4b - 6)$.",
    "workedSolution": "$$3a(2b - 3) + 2(2b - 3) = (2b - 3)(3a + 2)$$",
    "points": 1,
    "topic": "Factorization by Grouping"
  },
  {
    "number": 13,
    "prompt": "If $y = \\frac{2x + 3}{x - 1}$, make $x$ the subject of the relation.",
    "options": [
      "A. $x = \\frac{2y + 1}{y - 3}$",
      "B. $x = \\frac{y - 3}{y + 2}$",
      "C. $x = \\frac{y + 3}{y - 2}$",
      "D. $x = \\frac{3 - y}{2 - y}$"
    ],
    "correctAnswer": "C",
    "hint": "Clear the fraction by multiplying both sides by $(x - 1)$, then collect all $x$ terms on one side.",
    "workedSolution": "$$y(x - 1) = 2x + 3$$\n$$yx - y = 2x + 3$$\n$$yx - 2x = y + 3$$\n$$x(y - 2) = y + 3$$\n$$x = \\frac{y + 3}{y - 2}$$",
    "points": 1,
    "topic": "Change of Subject"
  },
  {
    "number": 14,
    "prompt": "Solve the inequality: $\\frac{x - 3}{2} \\ge \\frac{2x + 1}{5}$.",
    "options": [
      "A. $x \\le 17$",
      "B. $x \\ge 7$",
      "C. $x \\ge 17$",
      "D. $x \\le 7$"
    ],
    "correctAnswer": "C",
    "hint": "Multiply both sides by the LCM of 2 and 5, which is 10.",
    "workedSolution": "$$10\\left(\\frac{x - 3}{2}\\right) \\ge 10\\left(\\frac{2x + 1}{5}\\right)$$\n$$5(x - 3) \\ge 2(2x + 1)$$\n$$5x - 15 \\ge 4x + 2$$\n$$5x - 4x \\ge 2 + 15$$\n$$x \\ge 17$$",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 15,
    "prompt": "Given that $p = -2, q = 3,$ and $r = -1$, evaluate $p^2 - 2qr$.",
    "options": [
      "A. $-2$",
      "B. $4$",
      "C. $10$",
      "D. $16$"
    ],
    "correctAnswer": "C",
    "hint": "Substitute carefully: $(-2)^2 = 4$ and $-2(3)(-1) = +6$.",
    "workedSolution": "$$p^2 - 2qr = (-2)^2 - 2(3)(-1) = 4 - (-6) = 4 + 6 = 10$$",
    "points": 1,
    "topic": "Substitution"
  },
  {
    "number": 16,
    "prompt": "Simplify: $\\frac{4x^2 - 9}{2x + 3}$.",
    "options": [
      "A. $2x - 3$",
      "B. $2x + 3$",
      "C. $x - 3$",
      "D. $4x - 3$"
    ],
    "correctAnswer": "A",
    "hint": "The numerator is a difference of two squares: $a^2 - b^2 = (a - b)(a + b)$.",
    "workedSolution": "$$4x^2 - 9 = (2x)^2 - 3^2 = (2x - 3)(2x + 3)$$\n$$\\frac{(2x - 3)(2x + 3)}{2x + 3} = 2x - 3$$",
    "points": 1,
    "topic": "Difference of Two Squares"
  },
  {
    "number": 17,
    "prompt": "The sum of two numbers is $28$ and their difference is $6$. Find the larger number.",
    "options": [
      "A. $11$",
      "B. $15$",
      "C. $17$",
      "D. $22$"
    ],
    "correctAnswer": "C",
    "hint": "Set up simultaneous equations: $x + y = 28$ and $x - y = 6$. Add the equations.",
    "workedSolution": "$$x + y = 28$$\n$$x - y = 6$$\n$$\\text{Adding: } 2x = 34 \\implies x = 17$$\n$$y = 28 - 17 = 11$$\nThe larger number is $17$.",
    "points": 1,
    "topic": "Simultaneous Linear Equations"
  },
  {
    "number": 18,
    "prompt": "Find the truth set of $2x - 5 < 7$ where $x \\in \\{\\text{counting numbers}\\}$.",
    "options": [
      "A. $\\{1, 2, 3, 4, 5\\}$",
      "B. $\\{1, 2, 3, 4, 5, 6\\}$",
      "C. $\\{0, 1, 2, 3, 4, 5\\}$",
      "D. $\\{x : x < 6\\}$"
    ],
    "correctAnswer": "A",
    "hint": "Solve $2x < 12 \\implies x < 6$. Counting numbers start from 1.",
    "workedSolution": "$$2x < 12 \\implies x < 6$$\nCounting numbers strictly less than $6$ are $\\{1, 2, 3, 4, 5\\}$.",
    "points": 1,
    "topic": "Truth Sets"
  },
  {
    "number": 19,
    "prompt": "If $f(x) = 3x^2 - 4x + 1$, find the value of $f(-2)$.",
    "options": [
      "A. $5$",
      "B. $13$",
      "C. $21$",
      "D. $25$"
    ],
    "correctAnswer": "C",
    "hint": "Remember that $(-2)^2 = +4$ and $-4(-2) = +8$.",
    "workedSolution": "$$f(-2) = 3(-2)^2 - 4(-2) + 1 = 3(4) + 8 + 1 = 12 + 8 + 1 = 21$$",
    "points": 1,
    "topic": "Functions and Mappings"
  },
  {
    "number": 20,
    "prompt": "Evaluate $17 \\pmod 5$.",
    "options": [
      "A. $1$",
      "B. $2$",
      "C. $3$",
      "D. $4$"
    ],
    "correctAnswer": "B",
    "hint": "Find the remainder when $17$ is divided by $5$.",
    "workedSolution": "$$17 = (3 \\times 5) + 2$$\nThe remainder is $2$.\nTherefore, $17 \\equiv 2 \\pmod 5$.",
    "points": 1,
    "topic": "Modular Arithmetic"
  },
  {
    "number": 21,
    "prompt": "Find the size of an interior angle of a regular six-sided polygon (hexagon).",
    "options": [
      "A. $108^\\circ$",
      "B. $120^\\circ$",
      "C. $135^\\circ$",
      "D. $140^\\circ$"
    ],
    "correctAnswer": "B",
    "hint": "Each interior angle $= \\frac{(n - 2) \\times 180^\\circ}{n}$ where $n = 6$.",
    "workedSolution": "$$\\text{Interior angle} = \\frac{(6 - 2) \\times 180^\\circ}{6} = \\frac{4 \\times 180^\\circ}{6} = 4 \\times 30^\\circ = 120^\\circ$$",
    "points": 1,
    "topic": "Polygons"
  },
  {
    "number": 22,
    "prompt": "The diameter of a cylinder is $14\\text{ cm}$ and its height is $10\\text{ cm}$. Calculate its volume. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "options": [
      "A. $440\\text{ cm}^3$",
      "B. $770\\text{ cm}^3$",
      "C. $1,540\\text{ cm}^3$",
      "D. $6,160\\text{ cm}^3$"
    ],
    "correctAnswer": "C",
    "hint": "Radius $r = \\frac{14}{2} = 7\\text{ cm}$. Volume formula is $V = \\pi r^2 h$.",
    "workedSolution": "$$V = \\frac{22}{7} \\times 7^2 \\times 10 = 22 \\times 7 \\times 10 = 154 \\times 10 = 1,540\\text{ cm}^3$$",
    "points": 1,
    "topic": "Cylinder Mensuration"
  },
  {
    "number": 23,
    "prompt": "A ladder $13\\text{ m}$ long leans against a vertical wall. If the foot of the ladder is $5\\text{ m}$ from the base of the wall, how high up the wall does the ladder reach?",
    "options": [
      "A. $8\\text{ m}$",
      "B. $10\\text{ m}$",
      "C. $12\\text{ m}$",
      "D. $14\\text{ m}$"
    ],
    "correctAnswer": "C",
    "hint": "Apply Pythagoras theorem: $h^2 + 5^2 = 13^2$.",
    "workedSolution": "$$h^2 = 13^2 - 5^2 = 169 - 25 = 144$$\n$$h = \\sqrt{144} = 12\\text{ m}$$",
    "points": 1,
    "topic": "Pythagoras Theorem"
  },
  {
    "number": 24,
    "prompt": "The circumference of a circular running track is $88\\text{ m}$. Find the radius of the track. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "options": [
      "A. $7\\text{ m}$",
      "B. $14\\text{ m}$",
      "C. $21\\text{ m}$",
      "D. $28\\text{ m}$"
    ],
    "correctAnswer": "B",
    "hint": "$C = 2\\pi r \\implies r = \\frac{C}{2\\pi}$.",
    "workedSolution": "$$88 = 2 \\times \\frac{22}{7} \\times r = \\frac{44}{7} r$$\n$$r = \\frac{88 \\times 7}{44} = 2 \\times 7 = 14\\text{ m}$$",
    "points": 1,
    "topic": "Circles and Circumference"
  },
  {
    "number": 25,
    "prompt": "Calculate the area of a trapezium with parallel sides of length $8\\text{ cm}$ and $14\\text{ cm}$ and perpendicular height $6\\text{ cm}$.",
    "options": [
      "A. $44\\text{ cm}^2$",
      "B. $66\\text{ cm}^2$",
      "C. $88\\text{ cm}^2$",
      "D. $132\\text{ cm}^2$"
    ],
    "correctAnswer": "B",
    "hint": "Area of a trapezium $= \\frac{1}{2}(a + b)h$.",
    "workedSolution": "$$\\text{Area} = \\frac{1}{2}(8 + 14) \\times 6 = \\frac{1}{2}(22) \\times 6 = 11 \\times 6 = 66\\text{ cm}^2$$",
    "points": 1,
    "topic": "Trapezium Area"
  },
  {
    "number": 26,
    "prompt": "Find the gradient of the straight line passing through points $A(2, -3)$ and $B(6, 5)$.",
    "options": [
      "A. $1$",
      "B. $2$",
      "C. $3$",
      "D. $4$"
    ],
    "correctAnswer": "B",
    "hint": "Gradient formula $m = \\frac{y_2 - y_1}{x_2 - x_1}$.",
    "workedSolution": "$$m = \\frac{5 - (-3)}{6 - 2} = \\frac{5 + 3}{4} = \\frac{8}{4} = 2$$",
    "points": 1,
    "topic": "Coordinate Geometry"
  },
  {
    "number": 27,
    "prompt": "If vector $\\mathbf{u} = \\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix}$ and vector $\\mathbf{v} = \\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix}$, find the magnitude of $2\\mathbf{u} + 3\\mathbf{v}$.",
    "options": [
      "A. $\\sqrt{13}$",
      "B. $\\sqrt{25} = 5$",
      "C. $\\sqrt{17}$",
      "D. $\\sqrt{29}$"
    ],
    "correctAnswer": "A",
    "hint": "First find $2\\mathbf{u} + 3\\mathbf{v}$, then calculate $|\\mathbf{w}| = \\sqrt{x^2 + y^2}$.",
    "workedSolution": "$$2\\mathbf{u} + 3\\mathbf{v} = 2\\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix} + 3\\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 6 - 3 \\\\ -8 + 6 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$$\n$$\\text{Magnitude} = \\sqrt{3^2 + (-2)^2} = \\sqrt{9 + 4} = \\sqrt{13}$$",
    "points": 1,
    "topic": "Vectors"
  },
  {
    "number": 28,
    "prompt": "The three-figure bearing of point $B$ from point $A$ is $060^\\circ$. What is the back bearing of point $A$ from point $B$?",
    "options": [
      "A. $120^\\circ$",
      "B. $150^\\circ$",
      "C. $300^\\circ$",
      "D. $240^\\circ$"
    ],
    "correctAnswer": "D",
    "hint": "If bearing is less than $180^\\circ$, add $180^\\circ$ to find the back bearing.",
    "workedSolution": "$$\\text{Back bearing} = 060^\\circ + 180^\\circ = 240^\\circ$$",
    "points": 1,
    "topic": "Bearings"
  },
  {
    "number": 29,
    "prompt": "In triangle $PQR$, $\\angle P = 90^\\circ, |PQ| = 4\\text{ cm},$ and $|PR| = 3\\text{ cm}$. Find the value of $\\sin Q$.",
    "options": [
      "A. $\\frac{3}{5}$",
      "B. $\\frac{4}{5}$",
      "C. $\\frac{3}{4}$",
      "D. $\\frac{4}{3}$"
    ],
    "correctAnswer": "A",
    "hint": "Hypotenuse $|QR| = \\sqrt{4^2 + 3^2} = 5$. $\\sin Q = \\frac{\\text{opposite}}{\\text{hypotenuse}}$.",
    "workedSolution": "$$\\text{Opposite to } \\angle Q = |PR| = 3$$\n$$\\text{Hypotenuse} = |QR| = 5$$\n$$\\sin Q = \\frac{3}{5}$$",
    "points": 1,
    "topic": "Trigonometry"
  },
  {
    "number": 30,
    "prompt": "Point $P(-3, 4)$ is reflected in the $y$-axis to point $P'$. Find the coordinates of $P'$.",
    "options": [
      "A. $(-3, -4)$",
      "B. $(3, 4)$",
      "C. $(3, -4)$",
      "D. $(4, -3)$"
    ],
    "correctAnswer": "B",
    "hint": "Reflection in the $y$-axis maps $(x, y) \\to (-x, y)$.",
    "workedSolution": "Reflecting in the $y$-axis negates the $x$-coordinate while keeping the $y$-coordinate unchanged:\n$$(-3, 4) \\to (-(-3), 4) = (3, 4)$$",
    "points": 1,
    "topic": "Transformations and Reflection"
  },
  {
    "number": 31,
    "prompt": "The mean of the numbers $7, 12, x, 15,$ and $18$ is $13$. Find the value of $x$.",
    "options": [
      "A. $11$",
      "B. $16$",
      "C. $14$",
      "D. $13$"
    ],
    "correctAnswer": "D",
    "hint": "Sum of 5 numbers $= 5 \\times 13 = 65$. Subtract the known numbers.",
    "workedSolution": "$$\\frac{7 + 12 + x + 15 + 18}{5} = 13$$\n$$52 + x = 65 \\implies x = 65 - 52 = 13$$",
    "points": 1,
    "topic": "Mean and Averages"
  },
  {
    "number": 32,
    "prompt": "Find the median of the following set of marks: $14, 8, 12, 19, 10, 15, 17$.",
    "options": [
      "A. $12$",
      "B. $17$",
      "C. $15$",
      "D. $14$"
    ],
    "correctAnswer": "D",
    "hint": "First arrange the numbers in ascending order: $8, 10, 12, 14, 15, 17, 19$.",
    "workedSolution": "Ascending order: $8, 10, 12, \\mathbf{14}, 15, 17, 19$.\nThe middle (4th) value is $14$.",
    "points": 1,
    "topic": "Median"
  },
  {
    "number": 33,
    "prompt": "A fair six-sided die is rolled once. What is the probability of obtaining a prime number?",
    "options": [
      "A. $\\frac{1}{6}$",
      "B. $\\frac{1}{3}$",
      "C. $\\frac{1}{2}$",
      "D. $\\frac{2}{3}$"
    ],
    "correctAnswer": "C",
    "hint": "Sample space $S = \\{1, 2, 3, 4, 5, 6\\}$. Prime numbers on a die are $2, 3, 5$.",
    "workedSolution": "$$n(S) = 6$$\n$$\\text{Prime numbers } E = \\{2, 3, 5\\} \\implies n(E) = 3$$\n$$P(\\text{prime}) = \\frac{3}{6} = \\frac{1}{2}$$",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 34,
    "prompt": "A bag contains $5$ red balls, $4$ blue balls, and $3$ green balls. If a ball is picked at random, what is the probability that it is NOT red?",
    "options": [
      "A. $\\frac{5}{12}$",
      "B. $\\frac{3}{4}$",
      "C. $\\frac{1}{3}$",
      "D. $\\frac{7}{12}$"
    ],
    "correctAnswer": "D",
    "hint": "Total balls $= 5 + 4 + 3 = 12$. Balls that are not red $= 4 + 3 = 7$.",
    "workedSolution": "$$\\text{Total balls} = 12$$\n$$\\text{Not red} = 4 + 3 = 7$$\n$$P(\\text{not red}) = \\frac{7}{12}$$",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 35,
    "prompt": "In a pie chart, an angle of $72^\\circ$ represents $30\\text{ candidates}$. What is the total number of candidates in the survey?",
    "options": [
      "A. $120$",
      "B. $200$",
      "C. $180$",
      "D. $150$"
    ],
    "correctAnswer": "D",
    "hint": "The entire circle represents $360^\\circ$. Multiply $30$ by $\\frac{360}{72}$.",
    "workedSolution": "$$\\frac{72^\\circ}{360^\\circ} = \\frac{1}{5}$$\n$$\\text{Total candidates} = 30 \\times 5 = 150$$",
    "points": 1,
    "topic": "Pie Charts"
  },
  {
    "number": 36,
    "prompt": "Find the mode of the distribution: $4, 6, 7, 4, 8, 9, 7, 4, 5, 6$.",
    "options": [
      "A. $4$",
      "B. $6$",
      "C. $7$",
      "D. $8$"
    ],
    "correctAnswer": "A",
    "hint": "The mode is the number that appears with the highest frequency.",
    "workedSolution": "Counting occurrences:\n$4$ appears $3$ times;\n$6$ appears $2$ times;\n$7$ appears $2$ times;\n$5, 8, 9$ appear once each.\nThe mode is $4$.",
    "points": 1,
    "topic": "Mode and Frequency"
  },
  {
    "number": 37,
    "prompt": "The table below shows the distribution of goals scored by a team in 20 matches:\n\n$$\\begin{array}{|l|c|c|c|c|} \\hline \\textbf{Goals} & 0 & 1 & 2 & 3 \\\\ \\hline \\textbf{Frequency} & 5 & 8 & 4 & 3 \\\\ \\hline \\end{array}$$\n\nHow many goals did the team score in total?",
    "options": [
      "A. $20$",
      "B. $23$",
      "C. $28$",
      "D. $25$"
    ],
    "correctAnswer": "D",
    "hint": "Compute $\\sum fx$: $(0 \\times 5) + (1 \\times 8) + (2 \\times 4) + (3 \\times 3)$.",
    "workedSolution": "$$\\sum fx = (0 \\times 5) + (1 \\times 8) + (2 \\times 4) + (3 \\times 3)$$\n$$= 0 + 8 + 8 + 9 = 25\\text{ goals}$$",
    "points": 1,
    "topic": "Frequency Tables"
  },
  {
    "number": 38,
    "prompt": "If the probability that it will rain tomorrow is $0.35$, what is the probability that it will NOT rain tomorrow?",
    "options": [
      "A. $0.35$",
      "B. $0.55$",
      "C. $0.75$",
      "D. $0.65$"
    ],
    "correctAnswer": "D",
    "hint": "$P(E') = 1 - P(E)$.",
    "workedSolution": "$$P(\\text{no rain}) = 1 - 0.35 = 0.65$$",
    "points": 1,
    "topic": "Complementary Probability"
  },
  {
    "number": 39,
    "prompt": "A letter is chosen at random from the word **MATHEMATICS**. What is the probability that it is the letter **M**?",
    "options": [
      "A. $\\frac{1}{11}$",
      "B. $\\frac{4}{11}$",
      "C. $\\frac{3}{11}$",
      "D. $\\frac{2}{11}$"
    ],
    "correctAnswer": "D",
    "hint": "Count total letters (11) and occurrences of 'M' (2).",
    "workedSolution": "Total letters $= 11$. Occurrences of 'M' $= 2$.\n$$P(\\text{letter is M}) = \\frac{2}{11}$$",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 40,
    "prompt": "In a stem-and-leaf plot, stem $3$ with leaves $2, 5, 8$ represents marks scored. If key $3 \\mid 2 = 32$, what is the range of these three marks?",
    "options": [
      "A. $6$",
      "B. $8$",
      "C. $10$",
      "D. $12$"
    ],
    "correctAnswer": "A",
    "hint": "Range $= \\text{Highest} - \\text{Lowest} = 38 - 32$.",
    "workedSolution": "The values are $32, 35, 38$.\n$$\\text{Range} = 38 - 32 = 6$$",
    "points": 1,
    "topic": "Stem-and-Leaf Displays"
  }

];

export const SET_BECE_MOCK_1_MATH_P1: CurriculumQuestionSet = {
  id: "math_mock_1",
  title: "BECE Mathematics National Mock 1 (Paper 1 Objective CBT)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 1 Paper 1",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_exams/math_mock_1",
  questions: allRawMathMock1Questions.map((q) => ({
    id: `math_m1_q${q.number}`,
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
export const rawMathMock1Paper2Questions = [
  {
    questionNumber: 1,
    id: "BECE_MATH_MOCK_1_Q01",
    marks: 15,
    topic: "Sets, Venn Diagrams, and Linear Equations",
    subQuestions: [
      {
        part: "a",
        marks: 8,
        hasDiagram: true,
        svgDiagram: `<svg width="360" height="220" viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;border-radius:12px;padding:6px;"><rect x="10" y="10" width="340" height="200" fill="#f8fafc" stroke="#334155" stroke-width="2" rx="8"/><text x="25" y="32" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">U = 50</text><circle cx="135" cy="115" r="70" fill="#38bdf8" fill-opacity="0.2" stroke="#0284c7" stroke-width="2"/><circle cx="225" cy="115" r="70" fill="#a855f7" fill-opacity="0.2" stroke="#7e22ce" stroke-width="2"/><text x="105" y="60" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0369a1">M (32)</text><text x="225" y="60" font-family="sans-serif" font-size="13" font-weight="bold" fill="#6b21a8">S (28)</text><text x="95" y="120" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">32 - x</text><text x="175" y="120" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">x</text><text x="245" y="120" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">28 - x</text><text x="295" y="190" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">4</text></svg>`,
        questionText: "In a class of $50$ students, $32$ study Mathematics, $28$ study Science, and $4$ study neither of the two subjects.\n(i) Illustrate the given information on a Venn diagram.\n(ii) Find the number of students who study both subjects.\n(iii) What is the probability that a student selected at random studies Mathematics only?",
        workedSolution: "**(i) Venn Diagram Representation:**\nLet universal set $U$ be the class $\\implies n(U) = 50$.\nLet $M$ be students studying Mathematics $\\implies n(M) = 32$.\nLet $S$ be students studying Science $\\implies n(S) = 28$.\nNeither subject: $n(M \\cup S)' = 4$.\nLet the number of students who study both subjects be $x \\implies n(M \\cap S) = x$.\n\nRegion Breakdown:\n- Mathematics only: $32 - x$\n- Science only: $28 - x$\n- Both subjects: $x$\n- Outside both: $4$\n\n*(See the embedded Venn diagram above for illustration)*.\n\n---\n\n**(ii) Finding $x$ (Students studying both subjects):**\n$$\\text{Sum of all regions} = n(U)$$\n$$(32 - x) + x + (28 - x) + 4 = 50$$\n$$64 - x = 50$$\n$$x = 64 - 50 = 14$$\n\nTherefore, **$14$ students study both subjects**.\n\n---\n\n**(iii) Probability of selecting a student studying Mathematics only:**\n$$\\text{Mathematics only} = 32 - x = 32 - 14 = 18$$\n$$P(\\text{Math only}) = \\frac{18}{50} = \\frac{9}{25}$$\n\nTherefore, the probability is **$\\frac{9}{25}$ (or $0.36$)**."
      },
      {
        part: "b",
        marks: 7,
        hasDiagram: false,
        svgDiagram: null,
        questionText: "Solve the equation: $\\frac{2x - 1}{3} - \\frac{x + 2}{4} = \\frac{1}{2}$.",
        workedSolution: "**Step 1: Find the LCM of denominators ($3, 4, 2$), which is $12$:**\n$$12\\left(\\frac{2x - 1}{3}\\right) - 12\\left(\\frac{x + 2}{4}\\right) = 12\\left(\\frac{1}{2}\\right)$$\n\n**Step 2: Simplify and expand brackets:**\n$$4(2x - 1) - 3(x + 2) = 6$$\n$$8x - 4 - 3x - 6 = 6$$\n$$5x - 10 = 6$$\n\n**Step 3: Solve for $x$:**\n$$5x = 6 + 10$$\n$$5x = 16$$\n$$x = \\frac{16}{5} = 3\\frac{1}{5} = 3.2$$\n\nTherefore, **$x = 3\\frac{1}{5}$ (or $3.2$)**."
      }
    ]
  },
  {
    questionNumber: 2,
    id: "BECE_MATH_MOCK_1_Q02",
    marks: 15,
    topic: "Commercial Profit, Ratio Sharing, and Compound Shapes",
    subQuestions: [
      {
        part: "a",
        marks: 7,
        hasDiagram: false,
        svgDiagram: null,
        questionText: "A trader bought $120\\text{ cartons}$ of canned milk at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 45.00$ per carton. She paid $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 600.00$ for transportation. If she sold all the cartons at a total profit of $25\\%$, calculate:\n(i) the total cost price;\n(ii) the selling price per carton.",
        workedSolution: "**(i) Total Cost Price:**\n$$\\text{Cost of cartons} = 120 \\times 45.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5,400.00$$\n$$\\text{Transportation} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 600.00$$\n$$\\text{Total Cost Price} = 5,400.00 + 600.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$$\n\n---\n\n**(ii) Selling Price per carton:**\n$$\\text{Total Selling Price} = 6,000.00 \\times \\frac{125}{100} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 7,500.00$$\n$$\\text{Selling Price per carton} = \\frac{7,500.00}{120} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 62.50$$\n\nTherefore, the selling price per carton is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 62.50$**."
      },
      {
        part: "b",
        marks: 8,
        hasDiagram: true,
        svgDiagram: `<svg width="360" height="200" viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;border-radius:12px;padding:6px;"><polygon points="40,40 240,40 240,160 40,160" fill="#f1f5f9" stroke="#0f172a" stroke-width="2"/><polygon points="240,40 320,160 240,160" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/><line x1="240" y1="40" x2="240" y2="160" stroke="#0f172a" stroke-dasharray="4" stroke-width="1.5"/><polyline points="240,145 255,145 255,160" fill="none" stroke="#0f172a" stroke-width="1.2"/><text x="130" y="32" font-family="sans-serif" font-size="12" font-weight="bold">20 m</text><text x="170" y="180" font-family="sans-serif" font-size="12" font-weight="bold">26 m</text><text x="215" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">12 m</text><text x="285" y="95" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0284c7">c</text></svg>`,
        questionText: "The diagram shows a field in the shape of a trapezium with parallel sides of lengths $20\\text{ m}$ and $26\\text{ m}$, and perpendicular height $12\\text{ m}$.\n(i) Calculate the length of the inclined side $c$.\n(ii) Find the perimeter of the field.\n(iii) Calculate the total area of the field.",
        workedSolution: "**(i) Length of the inclined side $c$:**\nThe difference in parallel bases is $26 - 20 = 6\\text{ m}$.\nUsing Pythagoras theorem on the right triangle:\n$$c^2 = 12^2 + 6^2 = 144 + 36 = 180$$\n$$c = \\sqrt{180} = \\sqrt{36 \\times 5} = 6\\sqrt{5} \\approx 13.42\\text{ m}$$\n\n---\n\n**(ii) Perimeter of the field:**\n$$\\text{Perimeter} = 20 + 12 + 26 + 13.42 = 71.42\\text{ m}$$\n\n---\n\n**(iii) Area of the field:**\n$$\\text{Area} = \\frac{1}{2}(a + b)h = \\frac{1}{2}(20 + 26) \\times 12 = 46 \\times 6 = 276\\text{ m}^2$$\n\nTherefore, the area of the field is **$276\\text{ m}^2$**."
      }
    ]
  },
  {
    questionNumber: 3,
    id: "BECE_MATH_MOCK_1_Q03",
    marks: 15,
    topic: "Change of Subject, Inequalities, and Number Lines",
    subQuestions: [
      {
        part: "a",
        marks: 7,
        hasDiagram: false,
        svgDiagram: null,
        questionText: "Given that $T = \\frac{k \\sqrt{L}}{g}$,\n(i) Make $L$ the subject of the relation.\n(ii) Find the value of $L$ when $T = 6, k = 3,$ and $g = 10$.",
        workedSolution: "**(i) Making $L$ the subject:**\n$$T g = k \\sqrt{L}$$\n$$\\sqrt{L} = \\frac{T g}{k}$$\nSquaring both sides:\n$$L = \\left(\\frac{T g}{k}\\right)^2 = \\frac{T^2 g^2}{k^2}$$\n\n---\n\n**(ii) Evaluating $L$:**\n$$L = \\left(\\frac{6 \\times 10}{3}\\right)^2 = \\left(\\frac{60}{3}\\right)^2 = 20^2 = 400$$\n\nTherefore, **$L = 400$**."
      },
      {
        part: "b",
        marks: 8,
        hasDiagram: true,
        svgDiagram: `<svg width="360" height="80" viewBox="0 0 360 80" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;border-radius:12px;padding:6px;"><line x1="20" y1="40" x2="340" y2="40" stroke="#0f172a" stroke-width="2"/><line x1="60" y1="35" x2="60" y2="45" stroke="#0f172a" stroke-width="1.5"/><line x1="120" y1="35" x2="120" y2="45" stroke="#0f172a" stroke-width="1.5"/><line x1="180" y1="35" x2="180" y2="45" stroke="#0f172a" stroke-width="1.5"/><line x1="240" y1="35" x2="240" y2="45" stroke="#0f172a" stroke-width="1.5"/><line x1="300" y1="35" x2="300" y2="45" stroke="#0f172a" stroke-width="1.5"/><text x="57" y="60" font-family="sans-serif" font-size="12">0</text><text x="117" y="60" font-family="sans-serif" font-size="12">1</text><text x="177" y="60" font-family="sans-serif" font-size="12">2</text><text x="237" y="60" font-family="sans-serif" font-size="12">3</text><text x="297" y="60" font-family="sans-serif" font-size="12">4</text><circle cx="177" cy="25" r="5" fill="#ffffff" stroke="#0284c7" stroke-width="2.5"/><line x1="182" y1="25" x2="335" y2="25" stroke="#0284c7" stroke-width="3"/><polygon points="335,20 345,25 335,30" fill="#0284c7"/></svg>`,
        questionText: "Solve the inequality $5x - 3 > 2(x + 1) + 1$ and illustrate your answer on a number line.",
        workedSolution: "**Step 1: Expand brackets and group like terms:**\n$$5x - 3 > 2x + 2 + 1$$\n$$5x - 3 > 2x + 3$$\n$$5x - 2x > 3 + 3$$\n$$3x > 6$$\n$$x > 2$$\n\n**Truth set:** $\\mathbf{\\{x : x > 2\\}}$.\n\n*(Represented on the number line above with an open (unfilled) circle at $2$ and an arrow extending to the right)*."
      }
    ]
  },
  {
    questionNumber: 4,
    id: "BECE_MATH_MOCK_1_Q04",
    marks: 15,
    topic: "Geometric Compass Construction",
    subQuestions: [
      {
        part: "a",
        marks: 10,
        hasDiagram: true,
        svgDiagram: `<svg width="420" height="260" viewBox="0 0 420 260" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;border-radius:12px;padding:6px;"><polygon points="60,200 360,200 180,60" fill="#f8fafc" stroke="#0f172a" stroke-width="2.5"/><line x1="180" y1="60" x2="180" y2="200" stroke="#dc2626" stroke-dasharray="4" stroke-width="1.8"/><polyline points="180,185 195,185 195,200" fill="none" stroke="#dc2626" stroke-width="1.5"/><path d="M 100 200 A 40 40 0 0 0 95 175" fill="none" stroke="#0284c7" stroke-width="2"/><text x="105" y="190" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0284c7">60°</text><text x="45" y="215" font-family="sans-serif" font-size="14" font-weight="bold">A</text><text x="370" y="215" font-family="sans-serif" font-size="14" font-weight="bold">B</text><text x="175" y="50" font-family="sans-serif" font-size="14" font-weight="bold">C</text><text x="175" y="225" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">D</text><text x="195" y="220" font-family="sans-serif" font-size="12" font-weight="bold">8 cm</text><text x="105" y="115" font-family="sans-serif" font-size="12" font-weight="bold">7 cm</text></svg>`,
        questionText: "Using a ruler and a pair of compasses only:\n(i) Construct triangle $ABC$ such that $|AB| = 8.0\\text{ cm}, \\angle CAB = 60^\\circ,$ and $|AC| = 7.0\\text{ cm}$.\n(ii) Construct the perpendicular line from vertex $C$ to meet side $AB$ at point $D$.\n(iii) Measure the length $|CD|$.",
        workedSolution: "**Construction Steps:**\n1. Draw a baseline and measure segment $|AB| = 8.0\\text{ cm}$ using compasses.\n2. At vertex $A$, construct an angle of $60^\\circ$ using equal radius arcs.\n3. Along the $60^\\circ$ ray, measure $|AC| = 7.0\\text{ cm}$ and mark vertex $C$.\n4. Join vertex $C$ to vertex $B$ with a straight line to complete triangle $ABC$.\n5. From point $C$, strike arcs intersecting line $AB$ at two points, and construct the perpendicular line meeting $AB$ at $D$.\n\n**Measurement:**\n$$|CD| = |AC| \\times \\sin 60^\\circ = 7.0 \\times 0.866 = 6.06\\text{ cm}$$\n$$\\mathbf{|CD| \\approx 6.1\\text{ cm} \\pm 0.1\\text{ cm}}$$"
      },
      {
        part: "b",
        marks: 5,
        hasDiagram: false,
        svgDiagram: null,
        questionText: "From your construction in (a):\n(i) Calculate the area of triangle $ABC$.\n(ii) State the length of side $|BC|$.",
        workedSolution: "**(i) Calculating the area of triangle $ABC$:**\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times |AB| \\times |CD|$$\n$$\\text{Area} = \\frac{1}{2} \\times 8.0 \\times 6.1 = 4.0 \\times 6.1 = 24.4\\text{ cm}^2$$\n\n---\n\n**(ii) Length of side $|BC|$:**\nBy the Law of Cosines:\n$$|BC|^2 = 8^2 + 7^2 - 2(8)(7)\\cos 60^\\circ = 64 + 49 - 112(0.5) = 113 - 56 = 57$$\n$$|BC| = \\sqrt{57} \\approx 7.55\\text{ cm}$$\n$$\\mathbf{|BC| \\approx 7.6\\text{ cm} \\pm 0.1\\text{ cm}}$$"
      }
    ]
  },
  {
    questionNumber: 5,
    id: "BECE_MATH_MOCK_1_Q05",
    marks: 15,
    topic: "Stem-and-Leaf Plot, Median, and Mean Statistics",
    subQuestions: [
      {
        part: "a",
        marks: 9,
        hasDiagram: false,
        svgDiagram: null,
        questionText: "The test scores of $25\\text{ students}$ in a mathematics test are given below:\n$$\\begin{matrix} 34 & 56 & 42 & 68 & 71 \\\\ 45 & 38 & 52 & 64 & 49 \\\\ 58 & 61 & 73 & 39 & 44 \\\\ 50 & 66 & 55 & 47 & 60 \\\\ 77 & 32 & 54 & 63 & 48 \\end{matrix}$$\n\n(i) Construct an ordered stem-and-leaf plot for the data.\n(ii) Find the median score.\n(iii) Calculate the percentage of students who scored at least $60\\text{ marks}$.",
        workedSolution: "**(i) Ordered Stem-and-Leaf Plot:**\n$$\\begin{array}{r|l} \\text{Stem} & \\text{Leaves} \\\\ \\hline 3 & 2, 4, 8, 9 \\\\ 4 & 2, 4, 5, 7, 8, 9 \\\\ 5 & 0, 2, 4, 5, 6, 8 \\\\ 6 & 0, 1, 3, 4, 6, 8 \\\\ 7 & 1, 3, 7 \\end{array}$$\n$$\\text{Key: } 3 \\mid 2 = 32\\text{ marks}$$\n\n---\n\n**(ii) Finding the Median Score:**\nFor $n = 25$, the median position is $\\frac{25 + 1}{2} = 13\\text{th}$ value.\nCounting 13 values from the lowest:\n- Stem 3: 4 values\n- Stem 4: 6 values (cumulative: 10)\n- Stem 5: 3rd leaf is $4$ (cumulative: 13)\n$$\\text{Median} = 54\\text{ marks}$$\n\n---\n\n**(iii) Percentage of students scoring at least 60 marks ($\\ge 60$):**\nStems 6 and 7 contain: $6 + 3 = 9\\text{ students}$.\n$$\\text{Percentage} = \\frac{9}{25} \\times 100\\% = 36\\%$$"
      },
      {
        part: "b",
        marks: 6,
        hasDiagram: false,
        svgDiagram: null,
        questionText: "Five numbers have a mean of $16$. When a sixth number is added, the mean increases to $18$. Find the sixth number.",
        workedSolution: "**Step 1: Calculate the sum of the first 5 numbers:**\n$$\\text{Sum}_5 = 5 \\times 16 = 80$$\n\n**Step 2: Calculate the sum of all 6 numbers:**\n$$\\text{Sum}_6 = 6 \\times 18 = 108$$\n\n**Step 3: Find the sixth number:**\n$$\\text{Sixth number} = \\text{Sum}_6 - \\text{Sum}_5 = 108 - 80 = 28$$\n\nTherefore, the sixth number is **$28$**."
      }
    ]
  },
  {
    questionNumber: 6,
    id: "BECE_MATH_MOCK_1_Q06",
    marks: 15,
    topic: "Vectors, Coordinate Line Intersections, and Angle Relationships",
    subQuestions: [
      {
        part: "a",
        marks: 7,
        hasDiagram: false,
        svgDiagram: null,
        questionText: "Given that $\\mathbf{p} = \\begin{pmatrix} 2x + 1 \\\\ 5 \\end{pmatrix}, \\mathbf{q} = \\begin{pmatrix} 3 \\\\ y - 4 \\end{pmatrix},$ and $2\\mathbf{p} - \\mathbf{q} = \\begin{pmatrix} 7 \\\\ 18 \\end{pmatrix}$, find the:\n(i) values of $x$ and $y$;\n(ii) vector $\\mathbf{p} + \\mathbf{q}$.",
        workedSolution: "**(i) Finding $x$ and $y$:**\n$$2\\begin{pmatrix} 2x + 1 \\\\ 5 \\end{pmatrix} - \\begin{pmatrix} 3 \\\\ y - 4 \\end{pmatrix} = \\begin{pmatrix} 4x + 2 - 3 \\\\ 10 - y + 4 \\end{pmatrix} = \\begin{pmatrix} 4x - 1 \\\\ 14 - y \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ 18 \\end{pmatrix}$$\n\n**Top component:**\n$$4x - 1 = 7 \\implies 4x = 8 \\implies x = 2$$\n\n**Bottom component:**\n$$14 - y = 18 \\implies -y = 4 \\implies y = -4$$\n\nTherefore, **$x = 2$ and $y = -4$**.\n\n---\n\n**(ii) Evaluating $\\mathbf{p} + \\mathbf{q}$:**\n$$\\mathbf{p} = \\begin{pmatrix} 2(2) + 1 \\\\ 5 \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 5 \\end{pmatrix}$$\n$$\\mathbf{q} = \\begin{pmatrix} 3 \\\\ -4 - 4 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ -8 \\end{pmatrix}$$\n$$\\mathbf{p} + \\mathbf{q} = \\begin{pmatrix} 5 + 3 \\\\ 5 + (-8) \\end{pmatrix} = \\begin{pmatrix} 8 \\\\ -3 \\end{pmatrix}$$"
      },
      {
        part: "b",
        marks: 8,
        hasDiagram: true,
        svgDiagram: `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;border-radius:12px;padding:6px;"><rect width="400" height="300" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/><line x1="40" y1="150" x2="360" y2="150" stroke="#0f172a" stroke-width="2"/><line x1="200" y1="20" x2="200" y2="280" stroke="#0f172a" stroke-width="2"/><text x="365" y="155" font-family="sans-serif" font-size="12" font-weight="bold">x</text><text x="205" y="30" font-family="sans-serif" font-size="12" font-weight="bold">y</text><line x1="80" y1="230" x2="320" y2="70" stroke="#0284c7" stroke-width="2.5"/><circle cx="140" cy="190" r="4" fill="#0284c7"/><circle cx="260" cy="110" r="4" fill="#0284c7"/><text x="85" y="195" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0284c7">A(-3,-2)</text><text x="265" y="105" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0284c7">B(3,2)</text></svg>`,
        questionText: "On a Cartesian plane, line $L_1$ passes through points $A(-3, -2)$ and $B(3, 2)$.\n(i) Find the equation of line $L_1$.\n(ii) Determine whether point $P(6, 4)$ lies on line $L_1$.\n(iii) State the gradient of any line parallel to $L_1$.",
        workedSolution: "**(i) Equation of line $L_1$:**\n$$\\text{Gradient } m = \\frac{2 - (-2)}{3 - (-3)} = \\frac{4}{6} = \\frac{2}{3}$$\nUsing point-slope form with $(3, 2)$:\n$$y - 2 = \\frac{2}{3}(x - 3)$$\n$$y - 2 = \\frac{2}{3}x - 2$$\n$$y = \\frac{2}{3}x \\quad (\\text{or } 2x - 3y = 0)$$\n\n---\n\n**(ii) Checking if $P(6, 4)$ lies on $L_1$:**\nSubstitute $x = 6$ into the equation:\n$$y = \\frac{2}{3}(6) = 4$$\nSince this matches the given $y$-value of $4$, **point $P(6, 4)$ lies on line $L_1$**.\n\n---\n\n**(iii) Gradient of a parallel line:**\nParallel lines have equal gradients.\nTherefore, the gradient is **$\\frac{2}{3}$**."
      }
    ]
  }
];

export const SET_BECE_MOCK_1_MATH_P2: CurriculumQuestionSet = {
  id: "math_mock_1_p2",
  title: "BECE Mathematics National Mock 1 (Paper 2 Theory & Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 1 Paper 2",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_exams/math_mock_1_p2",
  theoryTopicList: [
    { id: "q1", questionNumber: 1, theoryIndex: 1, title: "Sets, Venn Diagrams & Linear Equations", category: "Sets & Algebra" },
    { id: "q2", questionNumber: 2, theoryIndex: 2, title: "Commercial Profit & Compound Shapes", category: "Arithmetic & Mensuration" },
    { id: "q3", questionNumber: 3, theoryIndex: 3, title: "Change of Subject & Number Line Inequalities", category: "Algebra & Inequalities" },
    { id: "q4", questionNumber: 4, theoryIndex: 4, title: "Compass Triangle Construction & Area", category: "Geometry & Construction" },
    { id: "q5", questionNumber: 5, theoryIndex: 5, title: "Stem-and-Leaf Plot & Mean Averages", category: "Statistics & Probability" },
    { id: "q6", questionNumber: 6, theoryIndex: 6, title: "Vectors & Cartesian Line Intersections", category: "Vectors & Coordinate Geometry" }
  ],
  questions: rawMathMock1Paper2Questions.map((q) => {
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

export const SET_BECE_MOCK_1_MATH_COMPLETE = {
  year: "Mock 1",
  isMock: true,
  setNumber: 101,
  subject: "Mathematics",
  examination: "WAEC BECE Mathematics (National Mock 1)",
  paper1: SET_BECE_MOCK_1_MATH_P1,
  paper2: SET_BECE_MOCK_1_MATH_P2
};
