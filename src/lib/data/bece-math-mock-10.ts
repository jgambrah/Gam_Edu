import { CurriculumQuestionSet } from '../types';
import { MathMockObjectiveQuestion } from './bece-math-mock-1';

export const allRawMathMock10Questions: MathMockObjectiveQuestion[] = [
  {
    "number": 1,
    "id": "MOCK10_P1_Q01",
    "prompt": "If $A = \\{x : 15 < x < 35, x \\text{ is a multiple of } 5\\}$ and $B = \\{x : 15 < x < 35, x \\text{ is an odd number}\\}$, find $A \\cap B$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\{25\\}$",
      "B. $\\{20, 30\\}$",
      "C. $\\{25, 35\\}$",
      "D. $\\{20, 25, 30\\}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Sets and Operations on Sets principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "List the elements within the strict open interval $(15, 35)$:\n$$A = \\{20, 25, 30\\}$$\n$$B = \\{17, 19, 21, 23, 25, 27, 29, 31, 33\\}$$\n$$A \\cap B = \\{25\\}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Sets and Operations on Sets"
  },
  {
    "number": 2,
    "id": "MOCK10_P1_Q02",
    "prompt": "Evaluate $\\frac{\\sqrt{147}}{\\sqrt{27}}$ without using mathematical tables or a calculator.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{7}{9}$",
      "B. $\\frac{49}{9}$",
      "C. $3$",
      "D. $\\frac{7}{3}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Real Number System and Surds principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Simplify both surds using prime factor squares:\n$$\\sqrt{147} = \\sqrt{49 \\times 3} = 7\\sqrt{3}$$\n$$\\sqrt{27} = \\sqrt{9 \\times 3} = 3\\sqrt{3}$$\n$$\\frac{\\sqrt{147}}{\\sqrt{27}} = \\frac{7\\sqrt{3}}{3\\sqrt{3}} = \\frac{7}{3}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Real Number System and Surds"
  },
  {
    "number": 3,
    "id": "MOCK10_P1_Q03",
    "prompt": "Express $0.0000852$ in scientific notation (standard form).",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $8.52 \\times 10^{-6}$",
      "B. $8.52 \\times 10^{-5}$",
      "C. $8.52 \\times 10^{-4}$",
      "D. $85.2 \\times 10^{-6}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Standard Form principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Shift the decimal point $5$ places to the right so that $8$ lies in the units place:\n$$0.0000852 = 8.52 \\times 10^{-5}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Standard Form"
  },
  {
    "number": 4,
    "id": "MOCK10_P1_Q04",
    "prompt": "The diagram shows a regular hexagon of side $6\\text{ cm}$ inscribed in a circle of radius $6\\text{ cm}$. Find the perimeter of the shaded non-overlapping region outside the hexagon but bounded by the circle.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"220\" viewBox=\"0 0 220 220\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"110\" cy=\"110\" r=\"80\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0f172a\" stroke-width=\"2\"/><polygon points=\"110,30 179.3,70 179.3,150 110,190 40.7,150 40.7,70\" fill=\"#ffffff\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"110\" cy=\"110\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"103\" y=\"115\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">O</text><text x=\"145\" y=\"60\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">6 cm</text></svg>",
    "options": [
      "A. $12\\pi\\text{ cm}$",
      "B. $(6\\pi + 36)\\text{ cm}$",
      "C. $36\\text{ cm}$",
      "D. $(12\\pi + 36)\\text{ cm}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Mensuration: Composite Boundaries principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "The boundary of the region outside the hexagon but within the circular disc consists of the outer circular circumference and the inner perimeter of the hexagon:\n$$\\text{Circumference} = 2\\pi r = 2\\pi(6) = 12\\pi\\text{ cm}$$\n$$\\text{Perimeter of hexagon} = 6 \\times 6 = 36\\text{ cm}$$\n$$\\text{Total boundary perimeter} = (12\\pi + 36)\\text{ cm}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Composite Boundaries"
  },
  {
    "number": 5,
    "id": "MOCK10_P1_Q05",
    "prompt": "Solve for $x$ in the equation: $\\frac{3x + 1}{4} - \\frac{x - 2}{3} = \\frac{13}{6}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2$",
      "B. $3$",
      "C. $4$",
      "D. $5$"
    ],
    "correctAnswer": "B",
    "hint": "Review Linear Equations principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Multiply through by $\\text{LCM}(4, 3, 6) = 12$:\n$$3(3x + 1) - 4(x - 2) = 12\\left(\\frac{13}{6}\\right)$$\n$$9x + 3 - 4x + 8 = 26$$\n$$5x + 11 = 26$$\n$$5x = 15 \\implies x = 3$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Linear Equations"
  },
  {
    "number": 6,
    "id": "MOCK10_P1_Q06",
    "prompt": "A businesswoman imported goods valued at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 40,000.00$. She paid a customs import duty of $12.5\\%$ and port handling fees of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,500.00$. Find the total cost incurred to clear the goods.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 45,000.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 48,000.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 46,500.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 50,000.00$"
    ],
    "correctAnswer": "C",
    "hint": "Review Commercial Arithmetic: Duties and Levies principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Duty} = 12.5\\% \\times 40,000 = \\frac{1}{8} \\times 40,000 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5,000.00$$\n$$\\text{Total cost} = 40,000 + 5,000 + 1,500 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 46,500.00$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Duties and Levies"
  },
  {
    "number": 7,
    "id": "MOCK10_P1_Q07",
    "prompt": "The diagram shows a right pyramid with a rectangular base of dimensions $12\\text{ cm} \\times 10\\text{ cm}$ and vertical height $15\\text{ cm}$. Find the volume of the pyramid.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"200\" viewBox=\"0 0 240 200\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,150 140,170 200,140 100,120\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"120\" y1=\"30\" x2=\"40\" y2=\"150\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"120\" y1=\"30\" x2=\"140\" y2=\"170\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"120\" y1=\"30\" x2=\"200\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"120\" y1=\"30\" x2=\"100\" y2=\"120\" stroke=\"#64748b\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><line x1=\"120\" y1=\"30\" x2=\"120\" y2=\"145\" stroke=\"#dc2626\" stroke-width=\"2\" stroke-dasharray=\"4\"/><text x=\"115\" y=\"20\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">V</text><text x=\"125\" y=\"95\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">h = 15 cm</text><text x=\"80\" y=\"175\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">12 cm</text><text x=\"175\" y=\"165\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">10 cm</text></svg>",
    "options": [
      "A. $400\\text{ cm}^3$",
      "B. $1,800\\text{ cm}^3$",
      "C. $800\\text{ cm}^3$",
      "D. $600\\text{ cm}^3$"
    ],
    "correctAnswer": "D",
    "hint": "Review Solid Geometry: Pyramids principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Base area} = 12 \\times 10 = 120\\text{ cm}^2$$\n$$V = \\frac{1}{3} \\times \\text{Base area} \\times h = \\frac{1}{3} \\times 120 \\times 15 = 40 \\times 15 = 600\\text{ cm}^3$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Solid Geometry: Pyramids"
  },
  {
    "number": 8,
    "id": "MOCK10_P1_Q08",
    "prompt": "Factorize completely: $15xy + 20x - 6y - 8$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(3y + 4)(5x - 2)$",
      "B. $(3y - 4)(5x + 2)$",
      "C. $(5y + 4)(3x - 2)$",
      "D. $(3y + 2)(5x - 4)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Algebraic Factorization principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Group terms pairwise:\n$$15xy + 20x - 6y - 8 = 5x(3y + 4) - 2(3y + 4) = (3y + 4)(5x - 2)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Factorization"
  },
  {
    "number": 9,
    "id": "MOCK10_P1_Q09",
    "prompt": "Solve the inequality: $5x - 2(3x - 4) \\le 11$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $x \\le -3$",
      "B. $x \\ge -3$",
      "C. $x \\le 3$",
      "D. $x \\ge 3$"
    ],
    "correctAnswer": "B",
    "hint": "Review Linear Inequalities principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$5x - 6x + 8 \\le 11$$\n$$-x + 8 \\le 11$$\n$$-x \\le 11 - 8$$\n$$-x \\le 3 \\implies x \\ge -3$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 10,
    "id": "MOCK10_P1_Q10",
    "prompt": "The diagram shows a cyclic quadrilateral $PQRS$. Side $QR$ is extended to $T$. If exterior angle $\\angle SRT = 78^\\circ$, calculate the value of opposite interior angle $\\angle QPS$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"220\" viewBox=\"0 0 260 220\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"110\" cy=\"110\" r=\"80\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><polygon points=\"110,30 185,95 135,185 45,145\" fill=\"#38bdf8\" fill-opacity=\"0.15\" stroke=\"#0284c7\" stroke-width=\"2\"/><line x1=\"185\" y1=\"95\" x2=\"110\" y2=\"230\" stroke=\"#0f172a\" stroke-width=\"2\"/><circle cx=\"135\" cy=\"185\" r=\"3\" fill=\"#0f172a\"/><path d=\"M 135 185 A 25 25 0 0 1 120 210\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"105\" y=\"22\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">P</text><text x=\"192\" y=\"100\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Q</text><text x=\"145\" y=\"185\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">R</text><text x=\"30\" y=\"150\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">S</text><text x=\"100\" y=\"240\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">T</text><text x=\"125\" y=\"220\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">78°</text></svg>",
    "options": [
      "A. $78^\\circ$",
      "B. $88^\\circ$",
      "C. $102^\\circ$",
      "D. $112^\\circ$"
    ],
    "correctAnswer": "A",
    "hint": "Review Circle Theorems principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "The exterior angle of a cyclic quadrilateral is equal to the opposite interior angle:\n$$\\angle QPS = \\angle SRT = 78^\\circ$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Circle Theorems"
  },
  {
    "number": 11,
    "id": "MOCK10_P1_Q11",
    "prompt": "Find the image of point $N(4, -5)$ under a clockwise rotation of $90^\\circ$ about the origin.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(-4, 5)$",
      "B. $(5, 4)$",
      "C. $(-5, -4)$",
      "D. $(-5, 4)$"
    ],
    "correctAnswer": "C",
    "hint": "Review Transformational Geometry: Rotation principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Clockwise rotation through $90^\\circ$ maps $(x, y) \\to (y, -x)$:\n$$N(4, -5) \\to N'(-5, -(4)) = (-5, -4)$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Rotation"
  },
  {
    "number": 12,
    "id": "MOCK10_P1_Q12",
    "prompt": "A basket contains $14\\text{ red balls}$, $10\\text{ white balls}$, and $16\\text{ black balls}$. If a ball is picked at random, what is the probability that it is **white**?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{1}{4}$",
      "B. $\\frac{7}{20}$",
      "C. $\\frac{2}{5}$",
      "D. $\\frac{3}{10}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Probability principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Total balls} = 14 + 10 + 16 = 40$$\n$$P(\\text{white}) = \\frac{10}{40} = \\frac{1}{4}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 13,
    "id": "MOCK10_P1_Q13",
    "prompt": "Convert $11101_2$ to a numeral in base ten.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $27$",
      "B. $33$",
      "C. $31$",
      "D. $29$"
    ],
    "correctAnswer": "D",
    "hint": "Review Number Bases principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$11101_2 = (1 \\times 2^4) + (1 \\times 2^3) + (1 \\times 2^2) + (0 \\times 2^1) + (1 \\times 2^0)$$\n$$= 16 + 8 + 4 + 0 + 1 = 29_{10}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Number Bases"
  },
  {
    "number": 14,
    "id": "MOCK10_P1_Q14",
    "prompt": "The diagram shows a line $MN$ on a Cartesian grid with intercepts $(0, 4)$ and $(6, 0)$. Find the equation of the line.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"200\" viewBox=\"0 0 240 200\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"160\" x2=\"220\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"60\" y1=\"20\" x2=\"60\" y2=\"180\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"40\" y1=\"53\" x2=\"200\" y2=\"187\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"60\" cy=\"70\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"180\" cy=\"160\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"68\" y=\"75\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">(0, 4)</text><text x=\"175\" y=\"180\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">(6, 0)</text><text x=\"195\" y=\"145\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">MN</text></svg>",
    "options": [
      "A. $2x + 3y = 12$",
      "B. $3x + 2y = 12$",
      "C. $2x - 3y = 12$",
      "D. $3x - 2y = 12$"
    ],
    "correctAnswer": "A",
    "hint": "Review Coordinate Geometry: Line Equations principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$m = \\frac{0 - 4}{6 - 0} = -\\frac{4}{6} = -\\frac{2}{3}, \\quad c = 4$$\n$$y = -\\frac{2}{3}x + 4 \\implies 3y = -2x + 12 \\implies 2x + 3y = 12$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Line Equations"
  },
  {
    "number": 15,
    "id": "MOCK10_P1_Q15",
    "prompt": "Make $p$ the subject of the relation: $k = \\sqrt{\\frac{3p + q}{p - q}}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $p = \\frac{q(k^2 + 1)}{k^2 - 3}$",
      "B. $p = \\frac{q(k^2 - 1)}{k^2 + 3}$",
      "C. $p = \\frac{q(k + 1)}{k - 3}$",
      "D. $p = \\frac{k^2 + q}{3}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Change of Subject principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Square both sides:\n$$k^2 = \\frac{3p + q}{p - q}$$\n$$k^2(p - q) = 3p + q$$\n$$k^2 p - k^2 q = 3p + q$$\n$$k^2 p - 3p = k^2 q + q$$\n$$p(k^2 - 3) = q(k^2 + 1)$$\n$$p = \\frac{q(k^2 + 1)}{k^2 - 3}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Change of Subject"
  },
  {
    "number": 16,
    "id": "MOCK10_P1_Q16",
    "prompt": "A straight line connects $A(-3, 2)$ and $B(5, -4)$. Find the length of line segment $AB$.",
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
    "workedSolution": "$$|AB| = \\sqrt{(5 - (-3))^2 + (-4 - 2)^2} = \\sqrt{8^2 + (-6)^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Distance Formula"
  },
  {
    "number": 17,
    "id": "MOCK10_P1_Q17",
    "prompt": "The mean of the numbers $12, 16, 20, 24,$ and $k$ is $18$. Find the value of $k$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $16$",
      "B. $18$",
      "C. $20$",
      "D. $22$"
    ],
    "correctAnswer": "B",
    "hint": "Review Statistics: Mean principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\sum x = 5 \\times 18 = 90$$\n$$12 + 16 + 20 + 24 + k = 90$$\n$$72 + k = 90 \\implies k = 18$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Statistics: Mean"
  },
  {
    "number": 18,
    "id": "MOCK10_P1_Q18",
    "prompt": "A motorist covers $210\\text{ km}$ in $2\\text{ hours } 20\\text{ minutes}$. Calculate the speed of the vehicle in kilometres per hour ($\\text{km/h}$).",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $80\\text{ km/h}$",
      "B. $85\\text{ km/h}$",
      "C. $90\\text{ km/h}$",
      "D. $95\\text{ km/h}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Speed, Distance, and Time principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$T = 2\\text{ hours } + \\frac{20}{60}\\text{ hour} = 2\\frac{1}{3}\\text{ hours} = \\frac{7}{3}\\text{ hours}$$\n$$\\text{Speed} = \\frac{\\text{Distance}}{\\text{Time}} = \\frac{210}{7/3} = 210 \\times \\frac{3}{7} = 30 \\times 3 = 90\\text{ km/h}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Speed, Distance, and Time"
  },
  {
    "number": 19,
    "id": "MOCK10_P1_Q19",
    "prompt": "The diagram shows a solid metal cylinder of diameter $14\\text{ cm}$ and height $10\\text{ cm}$. Calculate its total surface area. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"200\" viewBox=\"0 0 220 200\" xmlns=\"http://www.w3.org/2000/svg\"><ellipse cx=\"110\" cy=\"45\" rx=\"50\" ry=\"16\" fill=\"#38bdf8\" fill-opacity=\"0.3\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"45\" x2=\"60\" y2=\"145\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"160\" y1=\"45\" x2=\"160\" y2=\"145\" stroke=\"#0f172a\" stroke-width=\"2\"/><ellipse cx=\"110\" cy=\"145\" rx=\"50\" ry=\"16\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"95\" y=\"48\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">d = 14 cm</text><text x=\"168\" y=\"100\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">10 cm</text></svg>",
    "options": [
      "A. $594\\text{ cm}^2$",
      "B. $1,056\\text{ cm}^2$",
      "C. $896\\text{ cm}^2$",
      "D. $748\\text{ cm}^2$"
    ],
    "correctAnswer": "D",
    "hint": "Review Mensuration: Cylinders principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$r = \\frac{14}{2} = 7\\text{ cm}$$\n$$\\text{TSA} = 2\\pi r(r + h) = 2 \\times \\frac{22}{7} \\times 7 \\times (7 + 10) = 44 \\times 17 = 748\\text{ cm}^2$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Cylinders"
  },
  {
    "number": 20,
    "id": "MOCK10_P1_Q20",
    "prompt": "Find the image of point $P(-6, 3)$ when translated by vector $\\mathbf{v} = \\begin{pmatrix} 4 \\\\ -5 \\end{pmatrix}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(-2, -2)$",
      "B. $(-10, 8)$",
      "C. $(2, -2)$",
      "D. $(-2, 8)$"
    ],
    "correctAnswer": "A",
    "hint": "Review Transformational Geometry: Translation principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\begin{pmatrix} x' \\\\ y' \\end{pmatrix} = \\begin{pmatrix} -6 \\\\ 3 \\end{pmatrix} + \\begin{pmatrix} 4 \\\\ -5 \\end{pmatrix} = \\begin{pmatrix} -2 \\\\ -2 \\end{pmatrix} \\implies P'(-2, -2)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Translation"
  },
  {
    "number": 21,
    "id": "MOCK10_P1_Q21",
    "prompt": "Find the rule governing the mapping below:\n$$\\begin{array}{cccccc} x & 1 & 2 & 3 & 4 & 5 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 3 & 8 & 15 & 24 & 35 \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $y = x^2 + 2$",
      "B. $y = x(x + 2)$",
      "C. $y = 2x^2 + 1$",
      "D. $y = 5x - 2$"
    ],
    "correctAnswer": "B",
    "hint": "Review Relations and Non-Linear Mappings principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Notice the product form $x(x + 2)$:\n- $x = 1: 1(3) = 3$\n- $x = 2: 2(4) = 8$\n- $x = 3: 3(5) = 15$\n- $x = 4: 4(6) = 24$\n- $x = 5: 5(7) = 35$\nAll values match $y = x(x + 2) = x^2 + 2x$.\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Relations and Non-Linear Mappings"
  },
  {
    "number": 22,
    "id": "MOCK10_P1_Q22",
    "prompt": "The diagram shows a right-angled triangle $ABC$. Find the value of $\\tan(\\angle BAC)$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"180\" viewBox=\"0 0 260 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 220,140 40,30\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"40,125 55,125 55,140\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"25\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"230\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"30\" y=\"25\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"15\" y=\"90\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">9 cm</text><text x=\"120\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">12 cm</text></svg>",
    "options": [
      "A. $\\frac{3}{4}$",
      "B. $\\frac{4}{5}$",
      "C. $\\frac{3}{5}$",
      "D. $\\frac{4}{3}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Trigonometry principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "From vertex $A$ in $\\triangle ABC$:\n$$\\text{Opposite side} = |BC| = 12\\text{ cm}$$\n$$\\text{Adjacent side} = |AB| = 9\\text{ cm}$$\n$$\\tan(\\angle BAC) = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{12}{9} = \\frac{4}{3}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Trigonometry"
  },
  {
    "number": 23,
    "id": "MOCK10_P1_Q23",
    "prompt": "The bearing of point $X$ from point $Y$ is $225^\\circ$. What is the bearing of point $Y$ from point $X$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $045^\\circ$",
      "B. $055^\\circ$",
      "C. $135^\\circ$",
      "D. $315^\\circ$"
    ],
    "correctAnswer": "A",
    "hint": "Review Bearings principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Since forward bearing $\\theta = 225^\\circ > 180^\\circ$:\n$$\\text{Back bearing} = 225^\\circ - 180^\\circ = 045^\\circ$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Bearings"
  },
  {
    "number": 24,
    "id": "MOCK10_P1_Q24",
    "prompt": "A store manager offers a cash discount of $8\\%$ on an article with a catalog price of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 750.00$. How much does a customer pay in cash?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 660.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 680.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 690.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 710.00$"
    ],
    "correctAnswer": "C",
    "hint": "Review Commercial Arithmetic: Discount principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Discount} = \\frac{8}{100} \\times 750 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 60.00$$\n$$\\text{Cash price} = 750.00 - 60.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 690.00$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Discount"
  },
  {
    "number": 25,
    "id": "MOCK10_P1_Q25",
    "prompt": "Simplify: $5^3 \\times 25^{-1} \\div 125^0$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1$",
      "B. $125$",
      "C. $25$",
      "D. $5$"
    ],
    "correctAnswer": "D",
    "hint": "Review Indices and Exponents principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Express each factor as a power of $5$:\n$$5^3 \\times (5^2)^{-1} \\div 1 = 5^3 \\times 5^{-2} = 5^{3 - 2} = 5^1 = 5$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Indices and Exponents"
  },
  {
    "number": 26,
    "id": "MOCK10_P1_Q26",
    "prompt": "The diagram shows two parallel lines $PQ$ and $RS$ cut by a transversal. Calculate the value of interior angle $y$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"320\" height=\"160\" viewBox=\"0 0 320 160\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"30\" y1=\"40\" x2=\"290\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"30\" y1=\"120\" x2=\"290\" y2=\"120\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"90\" y1=\"150\" x2=\"230\" y2=\"10\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 190 40 A 25 25 0 0 1 208 22\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><path d=\"M 140 120 A 25 25 0 0 1 120 102\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"195\" y=\"30\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">82°</text><text x=\"100\" y=\"110\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">y</text></svg>",
    "options": [
      "A. $82^\\circ$",
      "B. $98^\\circ$",
      "C. $108^\\circ$",
      "D. $118^\\circ$"
    ],
    "correctAnswer": "B",
    "hint": "Review Plane Geometry: Parallel Lines principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Consecutive interior angles sum to $180^\\circ$:\n$$y + 82^\\circ = 180^\\circ \\implies y = 180^\\circ - 82^\\circ = 98^\\circ$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Plane Geometry: Parallel Lines"
  },
  {
    "number": 27,
    "id": "MOCK10_P1_Q27",
    "prompt": "If $\\mathbf{p} = \\begin{pmatrix} 3a - 2 \\\\ 7 \\end{pmatrix}$ and $\\mathbf{q} = \\begin{pmatrix} 13 \\\\ 2b + 1 \\end{pmatrix}$ are equal vectors, find the value of $a + b$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6$",
      "B. $7$",
      "C. $8$",
      "D. $9$"
    ],
    "correctAnswer": "C",
    "hint": "Review Vectors: Equal Vectors principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Equate corresponding components:\n$$3a - 2 = 13 \\implies 3a = 15 \\implies a = 5$$\n$$2b + 1 = 7 \\implies 2b = 6 \\implies b = 3$$\n$$a + b = 5 + 3 = 8$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Vectors: Equal Vectors"
  },
  {
    "number": 28,
    "id": "MOCK10_P1_Q28",
    "prompt": "The diagram shows a circle of radius $8\\text{ cm}$. Find the area of the shaded quadrant in terms of $\\pi$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"200\" height=\"200\" viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"100\" cy=\"100\" r=\"70\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><path d=\"M 100 100 L 170 100 A 70 70 0 0 0 100 30 Z\" fill=\"#10b981\" fill-opacity=\"0.35\" stroke=\"#059669\" stroke-width=\"2\"/><line x1=\"100\" y1=\"100\" x2=\"170\" y2=\"100\" stroke=\"#059669\" stroke-width=\"2\"/><line x1=\"100\" y1=\"100\" x2=\"100\" y2=\"30\" stroke=\"#059669\" stroke-width=\"2\"/><polyline points=\"100,85 115,85 115,100\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><circle cx=\"100\" cy=\"100\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"85\" y=\"115\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">O</text><text x=\"125\" y=\"115\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">8 cm</text></svg>",
    "options": [
      "A. $8\\pi\\text{ cm}^2$",
      "B. $12\\pi\\text{ cm}^2$",
      "C. $16\\pi\\text{ cm}^2$",
      "D. $32\\pi\\text{ cm}^2$"
    ],
    "correctAnswer": "C",
    "hint": "Review Mensuration: Quadrant Area principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Area of quadrant} = \\frac{1}{4}\\pi r^2 = \\frac{1}{4}\\pi(8^2) = \\frac{64\\pi}{4} = 16\\pi\\text{ cm}^2$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Quadrant Area"
  },
  {
    "number": 29,
    "id": "MOCK10_P1_Q29",
    "prompt": "The interior angle of a regular polygon is $150^\\circ$. How many sides does the polygon possess?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $10$",
      "B. $12$",
      "C. $14$",
      "D. $16$"
    ],
    "correctAnswer": "B",
    "hint": "Review Polygons and Interior Angles principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Exterior angle} = 180^\\circ - 150^\\circ = 30^\\circ$$\n$$n = \\frac{360^\\circ}{\\text{Exterior angle}} = \\frac{360^\\circ}{30^\\circ} = 12$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Polygons and Interior Angles"
  },
  {
    "number": 30,
    "id": "MOCK10_P1_Q30",
    "prompt": "A storage tank measuring $4\\text{ m} \\times 3\\text{ m} \\times 2.5\\text{ m}$ is filled with water. Calculate the total mass of the water in tonnes. $[\\text{Take density of water } = 1,000\\text{ kg/m}^3, 1\\text{ tonne} = 1,000\\text{ kg}]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $24\\text{ tonnes}$",
      "B. $25\\text{ tonnes}$",
      "C. $30\\text{ tonnes}$",
      "D. $36\\text{ tonnes}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Mensuration: Volume and Mass principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Volume} = 4 \\times 3 \\times 2.5 = 30\\text{ m}^3$$\n$$\\text{Mass} = 30 \\times 1,000\\text{ kg} = 30,000\\text{ kg} = 30\\text{ tonnes}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Volume and Mass"
  },
  {
    "number": 31,
    "id": "MOCK10_P1_Q31",
    "prompt": "The diagram shows a rhombus $ABCD$ with diagonals $AC = 12\\text{ cm}$ and $BD = 16\\text{ cm}$. Calculate the perimeter of the rhombus.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"220\" viewBox=\"0 0 240 220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"120,20 200,110 120,200 40,110\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"120\" y1=\"20\" x2=\"120\" y2=\"200\" stroke=\"#dc2626\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><line x1=\"40\" y1=\"110\" x2=\"200\" y2=\"110\" stroke=\"#0284c7\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><circle cx=\"120\" cy=\"110\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"115\" y=\"15\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">A</text><text x=\"205\" y=\"115\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">B</text><text x=\"115\" y=\"215\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">C</text><text x=\"25\" y=\"115\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">D</text></svg>",
    "options": [
      "A. $32\\text{ cm}$",
      "B. $36\\text{ cm}$",
      "C. $40\\text{ cm}$",
      "D. $48\\text{ cm}$"
    ],
    "correctAnswer": "C",
    "hint": "Review Mensuration: Rhombus principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "Diagonals of a rhombus bisect each other at $90^\\circ$:\n$$\\text{Semi-diagonals: } \\frac{12}{2} = 6\\text{ cm}, \\quad \\frac{16}{2} = 8\\text{ cm}$$\n$$\\text{Side length } s = \\sqrt{6^2 + 8^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10\\text{ cm}$$\n$$\\text{Perimeter} = 4s = 4 \\times 10 = 40\\text{ cm}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Rhombus"
  },
  {
    "number": 32,
    "id": "MOCK10_P1_Q32",
    "prompt": "Find the Least Common Multiple (LCM) of $20, 25,$ and $30$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $150$",
      "B. $200$",
      "C. $250$",
      "D. $300$"
    ],
    "correctAnswer": "D",
    "hint": "Review Number Theory and LCM principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$20 = 2^2 \\times 5$$\n$$25 = 5^2$$\n$$30 = 2 \\times 3 \\times 5$$\n$$\\text{LCM} = 2^2 \\times 3 \\times 5^2 = 4 \\times 3 \\times 25 = 300$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Number Theory and LCM"
  },
  {
    "number": 33,
    "id": "MOCK10_P1_Q33",
    "prompt": "A class has $18\\text{ boys}$ and $12\\text{ girls}$. What is the probability of selecting a girl at random as class prefect?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{2}{5}$",
      "B. $\\frac{3}{5}$",
      "C. $\\frac{1}{3}$",
      "D. $\\frac{2}{3}$"
    ],
    "correctAnswer": "A",
    "hint": "Review Probability principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Total learners} = 18 + 12 = 30$$\n$$P(\\text{girl}) = \\frac{12}{30} = \\frac{2}{5}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 34,
    "id": "MOCK10_P1_Q34",
    "prompt": "Evaluate $3p^2 - 2q^2$ when $p = -2$ and $q = 3$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $-30$",
      "B. $-6$",
      "C. $6$",
      "D. $30$"
    ],
    "correctAnswer": "B",
    "hint": "Review Algebraic Substitution principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$3(-2)^2 - 2(3)^2 = 3(4) - 2(9) = 12 - 18 = -6$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Algebraic Substitution"
  },
  {
    "number": 35,
    "id": "MOCK10_P1_Q35",
    "prompt": "The diagram shows a right-angled triangle $ABC$. Find the value of $\\cos(\\angle BCA)$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"180\" viewBox=\"0 0 260 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 220,140 220,40\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"205,140 205,125 220,125\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"30\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"225\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"225\" y=\"35\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"120\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">15 cm</text><text x=\"232\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">8 cm</text><text x=\"120\" y=\"80\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">17 cm</text></svg>",
    "options": [
      "A. $\\frac{8}{17}$",
      "B. $\\frac{15}{17}$",
      "C. $\\frac{8}{15}$",
      "D. $\\frac{15}{8}$"
    ],
    "correctAnswer": "B",
    "hint": "Review Trigonometry principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "From vertex $C$ in $\\triangle ABC$:\n$$\\text{Adjacent side} = |BC| = 15\\text{ cm}$$\n$$\\text{Hypotenuse} = |AC| = 17\\text{ cm}$$\n$$\\cos(\\angle BCA) = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}} = \\frac{15}{17}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Trigonometry"
  },
  {
    "number": 36,
    "id": "MOCK10_P1_Q36",
    "prompt": "Simplify: $\\frac{2}{5}(10x - 15) - \\frac{1}{3}(6x - 12)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2x - 2$",
      "B. $2x + 2$",
      "C. $2x - 10$",
      "D. $6x - 2$"
    ],
    "correctAnswer": "A",
    "hint": "Review Algebraic Simplification principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\frac{2}{5}(10x - 15) = 4x - 6$$\n$$\\frac{1}{3}(6x - 12) = 2x - 4$$\n$$(4x - 6) - (2x - 4) = 4x - 6 - 2x + 4 = 2x - 2$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Simplification"
  },
  {
    "number": 37,
    "id": "MOCK10_P1_Q37",
    "prompt": "A map is drawn to a scale of $1 : 15,000$. What is the actual distance in metres represented by $8\\text{ cm}$ on the map?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1,050\\text{ m}$",
      "B. $1,100\\text{ m}$",
      "C. $1,150\\text{ m}$",
      "D. $1,200\\text{ m}$"
    ],
    "correctAnswer": "D",
    "hint": "Review Scale and Ratio principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Actual distance} = 8 \\times 15,000\\text{ cm} = 120,000\\text{ cm} = 1,200\\text{ m}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Scale and Ratio"
  },
  {
    "number": 38,
    "id": "MOCK10_P1_Q38",
    "prompt": "Calculate the volume of a sphere of radius $6\\text{ cm}$ in terms of $\\pi$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $144\\pi\\text{ cm}^3$",
      "B. $216\\pi\\text{ cm}^3$",
      "C. $288\\pi\\text{ cm}^3$",
      "D. $576\\pi\\text{ cm}^3$"
    ],
    "correctAnswer": "C",
    "hint": "Review Solid Geometry: Volume of Sphere principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$V = \\frac{4}{3}\\pi r^3 = \\frac{4}{3}\\pi (6^3) = \\frac{4}{3}\\pi (216) = 4 \\times 72\\pi = 288\\pi\\text{ cm}^3$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Solid Geometry: Volume of Sphere"
  },
  {
    "number": 39,
    "id": "MOCK10_P1_Q39",
    "prompt": "How many lines of symmetry has a regular octagon (an 8-sided regular polygon)?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $4$",
      "B. $6$",
      "C. $8$",
      "D. $16$"
    ],
    "correctAnswer": "C",
    "hint": "Recall that any regular polygon with n sides has exactly n lines of symmetry.",
    "workedSolution": "Every regular polygon with $n$ sides possesses exactly $n$ axes of symmetry. A regular octagon has $8$ sides, and therefore has exactly $8$ lines of symmetry ($4$ connecting opposite vertices and $4$ connecting the midpoints of opposite sides).\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Symmetry in Polygons"
  },
  {
    "number": 40,
    "id": "MOCK10_P1_Q40",
    "prompt": "A real estate agent sold a house for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 250,000.00$ and earned a commission of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12,500.00$. Calculate the percentage rate of commission.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $4\\%$",
      "B. $5\\%$",
      "C. $6\\%$",
      "D. $7.5\\%$"
    ],
    "correctAnswer": "B",
    "hint": "Review Commercial Arithmetic: Commission principles under the NaCCA syllabus to solve this systematically.",
    "workedSolution": "$$\\text{Rate} = \\left(\\frac{12,500}{250,000}\\right) \\times 100\\% = \\frac{125}{25}\\% = 5\\%$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Commission"
  }
];

export const SET_BECE_MOCK_10_MATH_P1: CurriculumQuestionSet = {
  id: "math_mock_10_p1",
  title: "BECE Mathematics National Mock 10 (Paper 1 Objective)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 10 Paper 1",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_10/paper_1",
  questions: allRawMathMock10Questions.map((q) => ({
    id: `math_m10_q${q.number}`,
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

export const rawMathMock10Paper2Questions = [
  {
    "questionNumber": 1,
    "id": "MOCK10_P2_Q01",
    "marks": 15,
    "topic": "Sets, Linear Inequalities, and Vector Column Operations",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"380\" height=\"240\" viewBox=\"0 0 380 240\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"10\" width=\"360\" height=\"220\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"35\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 90</text><circle cx=\"145\" cy=\"125\" r=\"72\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"235\" cy=\"125\" r=\"72\" fill=\"#10b981\" fill-opacity=\"0.2\" stroke=\"#059669\" stroke-width=\"2\"/><text x=\"105\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">M (Music)</text><text x=\"240\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#047857\">D (Drama)</text><text x=\"105\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">34</text><text x=\"182\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">18</text><text x=\"255\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">26</text><text x=\"315\" y=\"205\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">12</text></svg>",
        "questionText": "In a creative arts school of $90\\text{ students}$, $52$ belong to the Music club ($M$), $44$ belong to the Drama club ($D$), and $18$ belong to both clubs. The remaining students do not belong to either club.\n(i) Illustrate the information on a Venn diagram.\n(ii) Find the number of students who belong to:\n    $(\\alpha)$ Music club only;\n    $(\\beta)$ exactly one club;\n    $(\\gamma)$ neither Music nor Drama club.",
        "workedSolution": "**(i) Venn Diagram Representation:**\nUniversal set $n(U) = 90$.\n- Music club members: $n(M) = 52$\n- Drama club members: $n(D) = 44$\n- Both clubs: $n(M \\cap D) = 18$\n\nRegion Breakdown:\n- Music club only: $n(M \\cap D') = 52 - 18 = 34$\n- Drama club only: $n(M' \\cap D) = 44 - 18 = 26$\n- Both clubs: $n(M \\cap D) = 18$\n- Neither club: $n(M \\cup D)' = 90 - (34 + 18 + 26) = 90 - 78 = 12$\n\n*(See the embedded SVG above for the complete, labeled illustration)*.\n\n---\n\n**(ii) ($a$) Students who belong to the Music club only:**\n$$n(M \\cap D') = 52 - 18 = 34$$\nTherefore, **$34\\text{ students}$ belong to the Music club only**.\n\n---\n\n**(ii) ($\\beta$) Students who belong to exactly one club:**\n$$\\text{Exactly one club} = n(M \\cap D') + n(M' \\cap D) = 34 + 26 = 60$$\nTherefore, **$60\\text{ students}$ belong to exactly one club**.\n\n---\n\n**(ii) ($\\gamma$) Students who belong to neither club:**\n$$n(M \\cup D)' = 90 - 78 = 12$$\nTherefore, **$12\\text{ students}$ belong to neither club**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"80\" viewBox=\"0 0 360 80\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"40\" x2=\"340\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"35\" x2=\"60\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"35\" x2=\"120\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"35\" x2=\"180\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"35\" x2=\"240\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"300\" y1=\"35\" x2=\"300\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"55\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">0</text><text x=\"117\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">1</text><text x=\"177\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">2</text><text x=\"237\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">3</text><text x=\"297\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">4</text><circle cx=\"237\" cy=\"25\" r=\"5\" fill=\"#0284c7\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><line x1=\"237\" y1=\"25\" x2=\"25\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"3\"/><polygon points=\"25,20 15,25 25,30\" fill=\"#0284c7\"/></svg>",
        "questionText": "(i) Solve the inequality: $\\frac{2(x + 1)}{3} - \\frac{x - 3}{4} \\le \\frac{5}{2}$.\n(ii) Illustrate the solution on a number line.",
        "workedSolution": "**(i) Solving the inequality:**\n$$\\frac{2(x + 1)}{3} - \\frac{x - 3}{4} \\le \\frac{5}{2}$$\nMultiply through by the LCM of denominators ($12$):\n$$12\\left(\\frac{2(x + 1)}{3}\\right) - 12\\left(\\frac{x - 3}{4}\\right) \\le 12\\left(\\frac{5}{2}\\right)$$\n$$4[2(x + 1)] - 3(x - 3) \\le 6(5)$$\n$$8(x + 1) - 3(x - 3) \\le 30$$\n$$8x + 8 - 3x + 9 \\le 30$$\n$$5x + 17 \\le 30$$\n$$5x \\le 30 - 17$$\n$$5x \\le 13 \\implies x \\le \\frac{13}{5} = 2.6$$\n\n**Truth set:** $\\mathbf{\\left\\{x : x \\le 2\\frac{3}{5}\\right\\}}$.\n\n---\n\n**(ii) Number Line Representation:**\nMark a solid circle at $x = 2.6$ on a horizontal number line and draw a directed arrow pointing to the left toward negative infinity."
      }
    ]
  },
  {
    "questionNumber": 2,
    "id": "MOCK10_P2_Q02",
    "marks": 15,
    "topic": "Financial Literacy: Compound Interest, Value Added Tax (VAT), and Utility Bills",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "An agricultural enterprise deposits $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 25,000.00$ in a fixed commercial deposit account that yields $12\\%$ compound interest per annum, compounded annually.\n(i) Calculate the total balance in the account at the end of $2\\text{ years}$.\n(ii) Find the compound interest earned over the $2\\text{ years}$.\n(iii) Calculate how much extra interest the enterprise earned compared to a simple interest account offering the same annual interest rate over the same duration.",
        "workedSolution": "**(i) Total balance at the end of 2 years:**\nUsing the compound amount formula $A = P\\left(1 + \\frac{R}{100}\\right)^n$:\n$$A = 25,000\\left(1 + \\frac{12}{100}\\right)^2 = 25,000(1.12)^2$$\n$$(1.12)^2 = 1.2544$$\n$$A = 25,000 \\times 1.2544 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 31,360.00$$\n\nTherefore, the total balance in the account is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 31,360.00$**.\n\n---\n\n**(ii) Compound interest earned:**\n$$CI = A - P = 31,360.00 - 25,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,360.00$$\n\nTherefore, the compound interest earned is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,360.00$**.\n\n---\n\n**(iii) Comparing with simple interest:**\n$$SI = \\frac{P \\times R \\times T}{100} = \\frac{25,000 \\times 12 \\times 2}{100} = 250 \\times 24 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$$\n$$\\text{Difference} = CI - SI = 6,360.00 - 6,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 360.00$$\n\nTherefore, the enterprise earned **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 360.00$** more in compound interest."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The marked cash price of an industrial solar inverter is $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,500.00$ exclusive of Value Added Tax (VAT). If VAT is charged at $15\\%$ and the dealer offers a prompt-payment discount of $5\\%$ on the total tax-inclusive bill:\n(i) Calculate the VAT charged on the inverter.\n(ii) Calculate the total amount payable including VAT.\n(iii) Calculate the net amount paid after the discount is applied.",
        "workedSolution": "**(i) Calculating VAT charged:**\n$$\\text{VAT} = \\frac{15}{100} \\times 4,500.00 = 15 \\times 45.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 675.00$$\n\nTherefore, the VAT charged is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 675.00$**.\n\n---\n\n**(ii) Total bill including VAT:**\n$$\\text{Gross Bill} = 4,500.00 + 675.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5,175.00$$\n\nTherefore, the total bill including VAT is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5,175.00$**.\n\n---\n\n**(iii) Net amount paid after 5% prompt-payment discount:**\n$$\\text{Discount} = \\frac{5}{100} \\times 5,175.00 = 0.05 \\times 5,175.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 258.75$$\n$$\\text{Net Amount} = 5,175.00 - 258.75 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,916.25$$\n\nTherefore, the final amount paid is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,916.25$**."
      }
    ]
  },
  {
    "questionNumber": 3,
    "id": "MOCK10_P2_Q03",
    "marks": 15,
    "topic": "Compound Mensuration: Trapezoidal Cross-Section and Solid Pyramid Volume",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"200\" viewBox=\"0 0 360 200\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"50,160 310,160 240,50 120,50\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"120\" y1=\"50\" x2=\"120\" y2=\"160\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><polyline points=\"120,145 135,145 135,160\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><text x=\"165\" y=\"40\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">12 m</text><text x=\"170\" y=\"180\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">26 m</text><text x=\"90\" y=\"110\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">8 m</text><text x=\"110\" y=\"195\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
        "questionText": "The diagram shows the cross-section of a concrete drainage embankment in the shape of a trapezium. The parallel top and bottom sides measure $12\\text{ m}$ and $26\\text{ m}$ respectively, and the perpendicular height is $8\\text{ m}$.\n(i) Calculate the cross-sectional area of the embankment.\n(ii) If the embankment extends horizontally for a distance of $45\\text{ m}$, calculate the total volume of concrete used in cubic metres.\n(iii) Given that $1\\text{ m}^3$ of reinforced concrete has a mass of $2.4\\text{ tonnes}$, find the total mass of the embankment in tonnes.",
        "workedSolution": "**(i) Cross-sectional area of the trapezium:**\n$$\\text{Area} = \\frac{1}{2}(a + b)h = \\frac{1}{2}(12 + 26) \\times 8 = \\frac{1}{2}(38) \\times 8 = 19 \\times 8 = 152\\text{ m}^2$$\n\nTherefore, the cross-sectional area is **$152\\text{ m}^2$**.\n\n---\n\n**(ii) Volume of the embankment:**\n$$\\text{Volume} = \\text{Cross-sectional Area} \\times \\text{Length} = 152 \\times 45 = 6,840\\text{ m}^3$$\n\nTherefore, the volume of concrete is **$6,840\\text{ m}^3$**.\n\n---\n\n**(iii) Total mass of the embankment:**\n$$\\text{Mass} = 6,840 \\times 2.4\\text{ tonnes} = 16,416\\text{ tonnes}$$\n\nTherefore, the mass of the embankment is **$16,416\\text{ tonnes}$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A rectangular swimming pool measures $25\\text{ m}$ long and $10\\text{ m}$ wide. It has a uniform depth of $1.8\\text{ m}$. Water is pumped into the empty pool at a rate of $750\\text{ litres per minute}$. Calculate the time, in hours and minutes, it will take to fill the pool completely. $[1\\text{ m}^3 = 1,000\\text{ litres}]$",
        "workedSolution": "**Step 1: Calculate the total capacity of the pool:**\n$$V = l \\times w \\times d = 25 \\times 10 \\times 1.8 = 450\\text{ m}^3$$\n$$\\text{Capacity in litres} = 450 \\times 1,000 = 450,000\\text{ litres}$$\n\n**Step 2: Calculate the time taken in minutes:**\n$$\\text{Time in minutes} = \\frac{450,000}{750} = 600\\text{ minutes}$$\n\n**Step 3: Convert minutes to hours:**\n$$\\text{Time in hours} = \\frac{600}{60} = 10\\text{ hours}$$\n\nTherefore, it will take exactly **$10\\text{ hours } 0\\text{ minutes}$** to fill the pool."
      }
    ]
  },
  {
    "questionNumber": 4,
    "id": "MOCK10_P2_Q04",
    "marks": 15,
    "topic": "Geometric Compass Construction: Rhombus and Diagonals",
    "subQuestions": [
      {
        "part": "a",
        "marks": 10,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"420\" height=\"300\" viewBox=\"0 0 420 300\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"420\" height=\"300\" fill=\"#ffffff\"/><polygon points=\"70,220 250,220 340,64 160,64\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"70\" y1=\"220\" x2=\"340\" y2=\"64\" stroke=\"#0284c7\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><line x1=\"250\" y1=\"220\" x2=\"160\" y2=\"64\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><circle cx=\"205\" cy=\"142\" r=\"4\" fill=\"#7c3aed\"/><path d=\"M 120 220 A 50 50 0 0 0 95 177\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"108\" y=\"205\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">60°</text><text x=\"55\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"255\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"348\" y=\"65\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"145\" y=\"65\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">D</text><text x=\"150\" y=\"240\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">9 cm</text><text x=\"100\" y=\"135\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">9 cm</text></svg>",
        "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct the base line segment $|AB| = 9.0\\text{ cm}$;\n(ii) At vertex $A$, construct an angle $\\angle DAB = 60^\\circ$ such that side $|AD| = 9.0\\text{ cm}$;\n(iii) Complete the rhombus $ABCD$ such that $|BC| = 9.0\\text{ cm}$ and $|CD| = 9.0\\text{ cm}$;\n(iv) Construct the diagonal line segments $AC$ and $BD$ intersecting at point $M$.",
        "workedSolution": "**Compass Construction Steps:**\n1. **Base Line $|AB| = 9.0\\text{ cm}$:**\n   - Draw a horizontal pencil line and mark vertex $A$.\n   - Set compasses to $9.0\\text{ cm}$, place the needle at $A$, and strike an arc to locate $B$.\n2. **Construct $\\angle DAB = 60^\\circ$ and Vertex $D$:**\n   - With needle at $A$, strike an arc crossing $AB$. From that intersection, cut the arc to establish the $60^\\circ$ ray.\n   - Set compasses to $9.0\\text{ cm}$, place needle at $A$, and cut the $60^\\circ$ ray to locate vertex $D$.\n3. **Locating Vertex $C$ and Completing Rhombus $ABCD$:**\n   - Maintain compass opening at $9.0\\text{ cm}$, place needle at $D$, and strike an arc to the right.\n   - Place needle at $B$ with the same $9.0\\text{ cm}$ opening and strike an intersecting arc to fix vertex $C$.\n   - Rule straight lines $BC$ and $CD$ to complete the rhombus.\n4. **Diagonals $AC$ and $BD$:**\n   - Rule straight line segments connecting $A$ to $C$ and $B$ to $D$.\n   - Mark the point of intersection as $M$."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your completed construction in (a):\n(i) Measure the length of diagonal $|AC|$;\n(ii) Measure the length of diagonal $|BD|$;\n(iii) Calculate the area of the rhombus $ABCD$.",
        "workedSolution": "**(i) Measuring diagonal $|AC|$:**\n- In $\\triangle ABC$, interior angle $\\angle B = 180^\\circ - 60^\\circ = 120^\\circ$:\n  $$|AC|^2 = 9^2 + 9^2 - 2(9)(9)\\cos 120^\\circ = 81 + 81 - 162(-0.5) = 162 + 81 = 243$$\n  $$|AC| = \\sqrt{243} = 9\\sqrt{3} \\approx 15.588\\text{ cm}$$\n$$\\mathbf{|AC| \\approx 15.6\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(ii) Measuring diagonal $|BD|$:**\n- Triangle $ABD$ has vertex angle $60^\\circ$ and two equal sides of $9.0\\text{ cm}$, making it an equilateral triangle:\n  $$|BD| = 9.0\\text{ cm}$$\n$$\\mathbf{|BD| = 9.0\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(iii) Calculating the area of rhombus $ABCD$:**\n$$\\text{Area} = \\frac{1}{2} d_1 d_2 = \\frac{1}{2} \\times |AC| \\times |BD| = \\frac{1}{2} \\times 15.59 \\times 9.0 = 4.5 \\times 15.59 \\approx 70.155\\text{ cm}^2$$\n*(Or base $\\times$ altitude: $9.0 \\times 9.0\\sin 60^\\circ = 81 \\times 0.8660 = 70.15\\text{ cm}^2$)*.\n\nTherefore, the area of the rhombus is **$70.2\\text{ cm}^2$**."
      }
    ]
  },
  {
    "questionNumber": 5,
    "id": "MOCK10_P2_Q05",
    "marks": 15,
    "topic": "Frequency Distribution, Mean, and Bar Chart",
    "subQuestions": [
      {
        "part": "a",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The following frequency table shows the marks obtained by $40\\text{ candidates}$ in an introductory accounting quiz:\n\n$$\\begin{array}{|l|c|c|c|c|c|c|} \\hline \\textbf{Mark } (x) & 10 & 12 & 14 & 16 & 18 & 20 \\\\ \\hline \\textbf{Frequency } (f) & 4 & 8 & 12 & 9 & 5 & 2 \\\\ \\hline \\end{array}$$\n\nCalculate:\n(i) the modal mark;\n(ii) the mean mark of the quiz, correct to one decimal place.",
        "workedSolution": "**(i) Modal mark:**\nThe highest frequency is $12$, which corresponds to mark $14$.\n$$\\text{Modal mark} = 14$$\n\n---\n\n**(ii) Mean mark ($\\bar{x}$):**\nCompute products $fx$:\n- $10 \\times 4 = 40$\n- $12 \\times 8 = 96$\n- $14 \\times 12 = 168$\n- $16 \\times 9 = 144$\n- $18 \\times 5 = 90$\n- $20 \\times 2 = 40$\n\n$$\\sum f = 4 + 8 + 12 + 9 + 5 + 2 = 40$$\n$$\\sum fx = 40 + 96 + 168 + 144 + 90 + 40 = 578$$\n$$\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{578}{40} = 14.45 \\approx 14.5$$\n\nTherefore, the mean mark is **$14.5$**."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "If a candidate is selected at random from the class, find the probability that the candidate scored:\n(i) at least $16\\text{ marks}$;\n(ii) strictly less than $14\\text{ marks}$.",
        "workedSolution": "**(i) Probability of scoring at least 16 ($x \\ge 16$):**\nMarks $\\ge 16$ are $16, 18,$ and $20$:\n$$n(x \\ge 16) = 9 + 5 + 2 = 16$$\n$$P(x \\ge 16) = \\frac{16}{40} = \\frac{2}{5} = 0.4$$\n\nTherefore, the probability is **$\\frac{2}{5}$ (or $0.4$)**.\n\n---\n\n**(ii) Probability of scoring strictly less than 14 ($x < 14$):**\nMarks $< 14$ are $10$ and $12$:\n$$n(x < 14) = 4 + 8 = 12$$\n$$P(x < 14) = \\frac{12}{40} = \\frac{3}{10} = 0.3$$\n\nTherefore, the probability is **$\\frac{3}{10}$ (or $0.3$)**."
      },
      {
        "part": "c",
        "marks": 4,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"240\" viewBox=\"0 0 360 240\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"50\" y1=\"190\" x2=\"330\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"50\" y1=\"30\" x2=\"50\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2\"/><rect x=\"65\" y=\"142\" width=\"28\" height=\"48\" fill=\"#0284c7\"/><rect x=\"110\" y=\"94\" width=\"28\" height=\"96\" fill=\"#0284c7\"/><rect x=\"155\" y=\"46\" width=\"28\" height=\"144\" fill=\"#0284c7\"/><rect x=\"200\" y=\"82\" width=\"28\" height=\"108\" fill=\"#0284c7\"/><rect x=\"245\" y=\"130\" width=\"28\" height=\"60\" fill=\"#0284c7\"/><rect x=\"290\" y=\"166\" width=\"28\" height=\"24\" fill=\"#0284c7\"/><text x=\"72\" y=\"208\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">10</text><text x=\"117\" y=\"208\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">12</text><text x=\"162\" y=\"208\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">14</text><text x=\"207\" y=\"208\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">16</text><text x=\"252\" y=\"208\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">18</text><text x=\"297\" y=\"208\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">20</text><text x=\"30\" y=\"146\" font-family=\"sans-serif\" font-size=\"11\">4</text><text x=\"30\" y=\"98\" font-family=\"sans-serif\" font-size=\"11\">8</text><text x=\"25\" y=\"50\" font-family=\"sans-serif\" font-size=\"11\">12</text><text x=\"160\" y=\"230\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Mark</text><text x=\"15\" y=\"25\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Frequency</text></svg>",
        "questionText": "Draw a bar chart to represent the distribution in (a).",
        "workedSolution": "**Bar Chart Drawing Guide:**\n- Horizontal axis represents the marks ($10, 12, 14, 16, 18, 20$) with uniform bar widths and equal inter-bar spacing.\n- Vertical axis represents frequency with a scale calibrated from $0$ to $14$ ($2\\text{ cm} = 2\\text{ units}$).\n- Bar heights correspond to frequencies: $4$ (for $10$), $8$ (for $12$), $12$ (for $14$), $9$ (for $16$), $5$ (for $18$), and $2$ (for $20$).\n\n*(See the embedded SVG above for the complete, well-labeled bar chart)*."
      }
    ]
  },
  {
    "questionNumber": 6,
    "id": "MOCK10_P2_Q06",
    "marks": 15,
    "topic": "Linear Relations, Table of Values, and Coordinate Graphing",
    "subQuestions": [
      {
        "part": "a",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "(i) Copy and complete the table of values for the relations $y_1 = 4 - x$ and $y_2 = 2x - 5$ for the domain $-1 \\le x \\le 5$.\n\n| $x$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 4 - x$ | $5$ | | $3$ | | $1$ | | $-1$ |\n| $y_2 = 2x - 5$ | $-7$ | | $-3$ | | $1$ | | $5$ |\n\n(ii) Identify the point of intersection of the two lines from your completed table.",
        "workedSolution": "**(i) Completed Table:**\nEvaluate $y_1 = 4 - x$:\n- $x = 0: y_1 = 4 - 0 = 4$\n- $x = 2: y_1 = 4 - 2 = 2$\n- $x = 4: y_1 = 4 - 4 = 0$\n\nEvaluate $y_2 = 2x - 5$:\n- $x = 0: y_2 = 2(0) - 5 = -5$\n- $x = 2: y_2 = 2(2) - 5 = -1$\n- $x = 4: y_2 = 2(4) - 5 = 3$\n\n| $x$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y_1 = 4 - x$ | $5$ | **$4$** | $3$ | **$2$** | $1$ | **$0$** | $-1$ |\n| $y_2 = 2x - 5$ | $-7$ | **$-5$** | $-3$ | **$-1$** | $1$ | **$3$** | $5$ |\n\n---\n\n**(ii) Point of intersection:**\nAt $x = 3$, both relations give $y = 1$.\nTherefore, the point of intersection is **$(3, 1)$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"380\" viewBox=\"0 0 400 380\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"380\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"gridMK10\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"380\" fill=\"url(#gridMK10)\"/><line x1=\"20\" y1=\"200\" x2=\"380\" y2=\"200\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"120\" y1=\"20\" x2=\"120\" y2=\"360\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"385\" y=\"205\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"125\" y=\"25\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><line x1=\"60\" y1=\"100\" x2=\"340\" y2=\"220\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><text x=\"310\" y=\"240\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">y = 4 - x</text><line x1=\"60\" y1=\"340\" x2=\"320\" y2=\"100\" stroke=\"#dc2626\" stroke-width=\"2.5\"/><text x=\"290\" y=\"90\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">y = 2x - 5</text><circle cx=\"240\" cy=\"180\" r=\"4.5\" fill=\"#7c3aed\"/><text x=\"250\" y=\"175\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#7c3aed\">(3, 1)</text></svg>",
        "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on the $x$-axis and $2\\text{ cm}$ to $2\\text{ units}$ on the $y$-axis, draw two perpendicular axes $Ox$ and $Oy$ on a graph sheet for $-2 \\le x \\le 6$ and $-8 \\le y \\le 8$.\nPlot both lines on the same graph sheet and label them clearly.",
        "workedSolution": "**Graph Execution Protocol:**\n1. Calibrate $x$-axis: $2\\text{ cm} = 1\\text{ unit}$ ($-2$ to $6$).\n2. Calibrate $y$-axis: $2\\text{ cm} = 2\\text{ units}$ ($-8$ to $8$).\n3. Plot the coordinates for $y_1 = 4 - x$: $(-1, 5), (0, 4), (1, 3), (2, 2), (3, 1), (4, 0), (5, -1)$ and draw the line.\n4. Plot the coordinates for $y_2 = 2x - 5$: $(-1, -7), (0, -5), (1, -3), (2, -1), (3, 1), (4, 3), (5, 5)$ and draw the line.\n5. Label both lines and their intersection point $(3, 1)$."
      },
      {
        "part": "c",
        "marks": 3,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your graph, find:\n(i) the gradient of line $y = 4 - x$;\n(ii) the value of $x$ when $2x - 5 = 0$.",
        "workedSolution": "**(i) Gradient of line $y = 4 - x$:**\n$$m = -1$$\n\n---\n\n**(ii) Value of $x$ when $2x - 5 = 0$ ($x$-intercept):**\n$$2x = 5 \\implies x = 2.5$$\nFrom graph reading: **$x = 2.5$ (tolerance $\\pm 0.1$)**."
      }
    ]
  }
];

export const allRawMathMock10TheoryQuestions = rawMathMock10Paper2Questions;

export const SET_BECE_MOCK_10_MATH_P2: CurriculumQuestionSet = {
  id: "math_mock_10_p2",
  title: "BECE Mathematics National Mock 10 (Paper 2 Theory & Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 10 Paper 2",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_10/paper_2",
  questions: rawMathMock10Paper2Questions.map((q) => {
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
      id: `math_m10_p2_q${q.questionNumber}`,
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
export const SET_BECE_MOCK_10_MATH_COMPLETE = {
  mockExamNumber: 10,
  subject: "Mathematics",
  examType: "BECE Mathematics National Standard Mock 10",
  academicYear: 2026,
  paper1: SET_BECE_MOCK_10_MATH_P1,
  paper2: SET_BECE_MOCK_10_MATH_P2,
  totalMarks: 100,
  unifiedTimeMinutes: 120
};
