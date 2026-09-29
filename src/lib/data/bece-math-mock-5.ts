/**
 * JHS Curriculum Data - BECE Mathematics National Mock 5
 * Standardized Isomorphic Examination Suite (Paper 1 CBT + Paper 2 Theory)
 *
 * Proprietary Content © GAM IT Solutions (GAM EDU). All rights reserved.
 * Curriculum Alignment: NaCCA JHS Common Core Programme / WAEC Standards
 */

import { CurriculumQuestionSet } from '../types';
import { MathMockObjectiveQuestion } from './bece-math-mock-1';

export const allRawMathMock5Questions: MathMockObjectiveQuestion[] = [
  {
    "number": 1,
    "id": "MOCK05_P1_Q01",
    "prompt": "Given that set $K = \\{x : x \\text{ is a composite number less than } 12\\}$, list the members of $K$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\{4, 6, 8, 9, 10\\}$",
      "B. $\\{2, 4, 6, 8, 9, 10\\}$",
      "C. $\\{4, 6, 8, 10\\}$",
      "D. $\\{1, 4, 6, 8, 9, 10\\}$"
    ],
    "correctAnswer": "A",
    "hint": "Recall that 1 is neither prime nor composite, and 2, 3, 5, 7, 11 are primes.",
    "workedSolution": "A composite number has more than two distinct positive factors. Among positive integers less than $12$, the composite numbers are $4, 6, 8, 9,$ and $10$ (noting that $1$ is neither prime nor composite, and $2, 3, 5, 7, 11$ are prime):\n$$K = \\{4, 6, 8, 9, 10\\}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Sets and Number Classification"
  },
  {
    "number": 2,
    "id": "MOCK05_P1_Q02",
    "prompt": "Evaluate: $3\\frac{1}{4} - \\left(1\\frac{5}{6} + \\frac{2}{3}\\right)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{1}{2}$",
      "B. $1\\frac{1}{4}$",
      "C. $1\\frac{1}{12}$",
      "D. $\\frac{3}{4}$"
    ],
    "correctAnswer": "D",
    "hint": "Evaluate inside brackets first: $1\\frac{5}{6} + \\frac{2}{3} = \\frac{11}{6} + \\frac{4}{6} = \\frac{15}{6} = \\frac{5}{2}$.",
    "workedSolution": "Evaluate the expression inside the brackets:\n$$1\\frac{5}{6} + \\frac{2}{3} = \\frac{11}{6} + \\frac{4}{6} = \\frac{15}{6} = \\frac{5}{2}$$\nSubtract from $3\\frac{1}{4} = \\frac{13}{4}$:\n$$\\frac{13}{4} - \\frac{5}{2} = \\frac{13 - 10}{4} = \\frac{3}{4}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Operations on Fractions"
  },
  {
    "number": 3,
    "id": "MOCK05_P1_Q03",
    "prompt": "A businesswoman bought $80\\text{ boxes}$ of canned fish for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,800.00$. If $8\\text{ boxes}$ were damaged and discarded, at what price per box must she sell the remaining boxes to make an overall profit of $20\\%$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 72.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 75.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 84.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 80.00$"
    ],
    "correctAnswer": "D",
    "hint": "Calculate target revenue ($120\\% \\times 4800 = 5760$), then divide by remaining sound boxes (72).",
    "workedSolution": "$$\\text{Target Revenue} = 120\\% \\times 4,800.00 = 1.20 \\times 4,800 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5,760.00$$\n$$\\text{Remaining sound boxes} = 80 - 8 = 72\\text{ boxes}$$\n$$\\text{Selling Price per box} = \\frac{5,760.00}{72} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 80.00$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Profit and Loss"
  },
  {
    "number": 4,
    "id": "MOCK05_P1_Q04",
    "prompt": "If $x = 3$ and $y = -2$, evaluate $\\frac{4x^2 - 3y^2}{2xy + 15}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6$",
      "B. $12$",
      "C. $10$",
      "D. $8$"
    ],
    "correctAnswer": "D",
    "hint": "Substitute: numerator $= 4(9) - 3(4) = 24$, denominator $= 2(3)(-2) + 15 = 3$.",
    "workedSolution": "$$\\text{Numerator} = 4(3)^2 - 3(-2)^2 = 4(9) - 3(4) = 36 - 12 = 24$$\n$$\\text{Denominator} = 2(3)(-2) + 15 = -12 + 15 = 3$$\n$$\\text{Value} = \\frac{24}{3} = 8$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Algebraic Substitution"
  },
  {
    "number": 5,
    "id": "MOCK05_P1_Q05",
    "prompt": "The diagram shows an equilateral triangle $PQR$. Side $QR$ is extended in a straight line to $S$. If $\\angle PRS = (5w - 15)^\\circ$, find the value of $w$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"360\" height=\"200\" viewBox=\"0 0 360 200\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"120,40 50,160 190,160\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"190\" y1=\"160\" x2=\"310\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"80\" y1=\"95\" x2=\"90\" y2=\"105\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"150\" y1=\"105\" x2=\"160\" y2=\"95\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"115\" y1=\"155\" x2=\"125\" y2=\"165\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 190 160 A 30 30 0 0 0 215 135\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"2\"/><text x=\"115\" y=\"30\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"35\" y=\"165\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Q</text><text x=\"185\" y=\"185\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">R</text><text x=\"315\" y=\"165\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">S</text><text x=\"210\" y=\"135\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">(5w - 15)°</text></svg>",
    "options": [
      "A. $21$",
      "B. $24$",
      "C. $30$",
      "D. $27$"
    ],
    "correctAnswer": "D",
    "hint": "Each interior angle of equilateral $\\triangle PQR$ is $60^\\circ$. The exterior angle is $180^\\circ - 60^\\circ = 120^\\circ$.",
    "workedSolution": "Interior angles of an equilateral triangle are all $60^\\circ$, so $\\angle PRQ = 60^\\circ$.\nSince $QRS$ is a straight line:\n$$\\angle PRQ + \\angle PRS = 180^\\circ$$\n$$60 + (5w - 15) = 180$$\n$$5w + 45 = 180$$\n$$5w = 135 \\implies w = 27$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Plane Geometry: Angles in Triangles"
  },
  {
    "number": 6,
    "id": "MOCK05_P1_Q06",
    "prompt": "Factorize completely: $3x^2 - 12y^2$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3(x - 2y)^2$",
      "B. $(3x - 6y)(x + 2y)$",
      "C. $3(x - 4y)(x + 4y)$",
      "D. $3(x - 2y)(x + 2y)$"
    ],
    "correctAnswer": "D",
    "hint": "Factor out 3 first: $3(x^2 - 4y^2)$, then apply the difference of two squares.",
    "workedSolution": "Factor out common factor $3$:\n$$3(x^2 - 4y^2)$$\nRecognize the difference of two squares:\n$$= 3(x - 2y)(x + 2y)$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Algebraic Factorization"
  },
  {
    "number": 7,
    "id": "MOCK05_P1_Q07",
    "prompt": "Find the Least Common Multiple (LCM) of $12, 18,$ and $24$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $36$",
      "B. $48$",
      "C. $72$",
      "D. $144$"
    ],
    "correctAnswer": "C",
    "hint": "Express as prime powers: $12 = 2^2 \\times 3, 18 = 2 \\times 3^2, 24 = 2^3 \\times 3$. LCM $= 2^3 \\times 3^2$.",
    "workedSolution": "$$12 = 2^2 \\times 3$$\n$$18 = 2 \\times 3^2$$\n$$24 = 2^3 \\times 3$$\n$$\\text{LCM} = 2^3 \\times 3^2 = 8 \\times 9 = 72$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Number Theory and LCM"
  },
  {
    "number": 8,
    "id": "MOCK05_P1_Q08",
    "prompt": "A map is drawn to a scale of $1 : 40,000$. What distance in kilometres is represented by a line segment of length $12.5\\text{ cm}$ on the map?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $5.0\\text{ km}$",
      "B. $50.0\\text{ km}$",
      "C. $500.0\\text{ km}$",
      "D. $5,000.0\\text{ km}$"
    ],
    "correctAnswer": "A",
    "hint": "Multiply $12.5 \\times 40,000 = 500,000\\text{ cm}$. Divide by $100,000$ to get kilometres.",
    "workedSolution": "$$\\text{Actual distance} = 12.5 \\times 40,000\\text{ cm} = 500,000\\text{ cm}$$\nConvert to metres ($1\\text{ m} = 100\\text{ cm}$): $5,000\\text{ m}$.\nConvert to kilometres ($1\\text{ km} = 1,000\\text{ m}$): $5.0\\text{ km}$.\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Scale and Ratio"
  },
  {
    "number": 9,
    "id": "MOCK05_P1_Q09",
    "prompt": "Solve the linear inequality: $\\frac{2x + 5}{3} - \\frac{x - 1}{2} \\ge 2$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $x \\ge -1$",
      "B. $x \\ge 1$",
      "C. $x \\le -1$",
      "D. $x \\le 1$"
    ],
    "correctAnswer": "A",
    "hint": "Multiply through by $\\text{LCM}(3, 2) = 6$ to eliminate the fractions.",
    "workedSolution": "Multiply through by $\\text{LCM}(3, 2) = 6$:\n$$2(2x + 5) - 3(x - 1) \\ge 6(2)$$\n$$4x + 10 - 3x + 3 \\ge 12$$\n$$x + 13 \\ge 12$$\n$$x \\ge 12 - 13 \\implies x \\ge -1$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 10,
    "id": "MOCK05_P1_Q10",
    "prompt": "The diagram shows the sector of a circle with central angle $150^\\circ$ and radius $12\\text{ cm}$. Find the perimeter of the sector in terms of $\\pi$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"200\" viewBox=\"0 0 240 200\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M 120 120 L 210 120 A 90 90 0 0 1 42 75 Z\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"120\" cy=\"120\" r=\"3.5\" fill=\"#0f172a\"/><path d=\"M 150 120 A 30 30 0 0 0 94 105\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"115\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">150°</text><text x=\"110\" y=\"140\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">O</text><text x=\"150\" y=\"135\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">12 cm</text></svg>",
    "options": [
      "A. $(10\\pi + 12)\\text{ cm}$",
      "B. $20\\pi\\text{ cm}$",
      "C. $(15\\pi + 24)\\text{ cm}$",
      "D. $(10\\pi + 24)\\text{ cm}$"
    ],
    "correctAnswer": "D",
    "hint": "Perimeter includes the arc length plus two radii: $\\frac{150}{360} \\times 2\\pi(12) + 2(12)$.",
    "workedSolution": "$$\\text{Arc length} = \\frac{150^\\circ}{360^\\circ} \\times 2\\pi(12) = \\frac{5}{12} \\times 24\\pi = 10\\pi\\text{ cm}$$\n$$\\text{Perimeter} = \\text{Arc length} + 2r = 10\\pi + 12 + 12 = (10\\pi + 24)\\text{ cm}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Sectors of Circles"
  },
  {
    "number": 11,
    "id": "MOCK05_P1_Q11",
    "prompt": "A crate of fruit juice contains $15\\text{ apple cans}$, $10\\text{ mango cans}$, and $5\\text{ pineapple cans}$. If a can is selected at random, find the probability that it is **not** mango.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{1}{3}$",
      "B. $\\frac{1}{2}$",
      "C. $\\frac{2}{3}$",
      "D. $\\frac{5}{6}$"
    ],
    "correctAnswer": "C",
    "hint": "Total cans $= 30$. Non-mango cans $= 15 + 5 = 20$. Compute $\\frac{20}{30}$.",
    "workedSolution": "$$\\text{Total cans } n(S) = 15 + 10 + 5 = 30$$\n$$\\text{Not mango} = 15 + 5 = 20$$\n$$P(\\text{not mango}) = \\frac{20}{30} = \\frac{2}{3}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 12,
    "id": "MOCK05_P1_Q12",
    "prompt": "The image of point $H(-4, 7)$ when translated by vector $\\mathbf{u}$ is $H'(2, -1)$. What is the image of point $K(1, -3)$ under the same translation?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(7, -11)$",
      "B. $(-5, 5)$",
      "C. $(5, -11)$",
      "D. $(7, 5)$"
    ],
    "correctAnswer": "A",
    "hint": "Find translation vector $\\mathbf{u} = H' - H = (6, -8)$, then add it to point $K$.",
    "workedSolution": "$$\\mathbf{u} = H' - H = \\begin{pmatrix} 2 \\\\ -1 \\end{pmatrix} - \\begin{pmatrix} -4 \\\\ 7 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ -8 \\end{pmatrix}$$\nApply $\\mathbf{u}$ to $K(1, -3)$:\n$$K' = \\begin{pmatrix} 1 \\\\ -3 \\end{pmatrix} + \\begin{pmatrix} 6 \\\\ -8 \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ -11 \\end{pmatrix}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Translation"
  },
  {
    "number": 13,
    "id": "MOCK05_P1_Q13",
    "prompt": "If $5^{3x - 2} = 625$, find the value of $x$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1$",
      "B. $4$",
      "C. $3$",
      "D. $2$"
    ],
    "correctAnswer": "D",
    "hint": "Express $625 = 5^4$, then set exponents equal: $3x - 2 = 4$.",
    "workedSolution": "$$625 = 5^4$$\n$$5^{3x - 2} = 5^4 \\implies 3x - 2 = 4 \\implies 3x = 6 \\implies x = 2$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Indices and Exponents"
  },
  {
    "number": 14,
    "id": "MOCK05_P1_Q14",
    "prompt": "The interior angles of a pentagon are $x^\\circ, 2x^\\circ, (x + 40)^\\circ, (2x + 20)^\\circ,$ and $120^\\circ$. Find the value of $x$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $60$",
      "B. $65$",
      "C. $70$",
      "D. $75$"
    ],
    "correctAnswer": "A",
    "hint": "Sum of interior angles of a 5-sided polygon is $(5 - 2) \\times 180^\\circ = 540^\\circ$.",
    "workedSolution": "Sum of interior angles: $(5 - 2) \\times 180^\\circ = 540^\\circ$.\n$$x + 2x + (x + 40) + (2x + 20) + 120 = 540$$\n$$6x + 180 = 540$$\n$$6x = 360 \\implies x = 60$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Polygons and Interior Angles"
  },
  {
    "number": 15,
    "id": "MOCK05_P1_Q15",
    "prompt": "Make $k$ the subject of the relation: $m = \\frac{k + 3p}{k - p}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $k = \\frac{p(m + 3)}{m - 1}$",
      "B. $k = \\frac{p(m - 3)}{m + 1}$",
      "C. $k = \\frac{p(3 - m)}{m - 1}$",
      "D. $k = \\frac{m - 3p}{p}$"
    ],
    "correctAnswer": "A",
    "hint": "Cross-multiply: $m(k - p) = k + 3p$, collect $k$ on one side and factorize.",
    "workedSolution": "$$m(k - p) = k + 3p$$\n$$mk - mp = k + 3p$$\n$$mk - k = mp + 3p$$\n$$k(m - 1) = p(m + 3)$$\n$$k = \\frac{p(m + 3)}{m - 1}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Change of Subject"
  },
  {
    "number": 16,
    "id": "MOCK05_P1_Q16",
    "prompt": "The diagram shows a right pyramid with a square base of side $10\\text{ cm}$ and slant height $13\\text{ cm}$. Find the vertical height $h$ of the pyramid.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"220\" viewBox=\"0 0 240 220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,160 140,180 200,150 100,130\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"120\" y1=\"30\" x2=\"40\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"120\" y1=\"30\" x2=\"140\" y2=\"180\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"120\" y1=\"30\" x2=\"200\" y2=\"150\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"120\" y1=\"30\" x2=\"100\" y2=\"130\" stroke=\"#64748b\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><line x1=\"120\" y1=\"30\" x2=\"120\" y2=\"155\" stroke=\"#dc2626\" stroke-width=\"2\" stroke-dasharray=\"4\"/><circle cx=\"120\" cy=\"155\" r=\"3\" fill=\"#dc2626\"/><text x=\"115\" y=\"20\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">V</text><text x=\"125\" y=\"100\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">h</text><text x=\"165\" y=\"85\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">13 cm</text><text x=\"80\" y=\"185\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">10 cm</text></svg>",
    "options": [
      "A. $10\\text{ cm}$",
      "B. $11\\text{ cm}$",
      "C. $12\\text{ cm}$",
      "D. $14\\text{ cm}$"
    ],
    "correctAnswer": "C",
    "hint": "Use the right-angled triangle formed by height $h$, half base length $5\\text{ cm}$, and slant height $13\\text{ cm}$.",
    "workedSolution": "The perpendicular distance from the centre of the square base to the midpoint of any side is half the side length: $\\frac{10}{2} = 5\\text{ cm}$.\nIn the right-angled triangle formed by vertical height $h$, base midpoint distance $5\\text{ cm}$, and face slant height $13\\text{ cm}$:\n$$h^2 + 5^2 = 13^2$$\n$$h^2 + 25 = 169$$\n$$h^2 = 169 - 25 = 144 \\implies h = 12\\text{ cm}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Solid Geometry: Pyramids"
  },
  {
    "number": 17,
    "id": "MOCK05_P1_Q17",
    "prompt": "Find the simple interest on $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,600.00$ saved for $8\\text{ months}$ at an annual rate of $7.5\\%$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 160.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 240.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 210.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 180.00$"
    ],
    "correctAnswer": "D",
    "hint": "Express time in years: $8\\text{ months} = \\frac{8}{12} = \\frac{2}{3}\\text{ year}$.",
    "workedSolution": "$$T = \\frac{8}{12} = \\frac{2}{3}\\text{ year}$$\n$$I = \\frac{3,600 \\times 7.5 \\times \\frac{2}{3}}{100} = 36 \\times 7.5 \\times \\frac{2}{3} = 36 \\times 5 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 180.00$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Simple Interest"
  },
  {
    "number": 18,
    "id": "MOCK05_P1_Q18",
    "prompt": "The bearing of point $A$ from point $B$ is $135^\\circ$. What is the bearing of point $B$ from point $A$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $045^\\circ$",
      "B. $225^\\circ$",
      "C. $315^\\circ$",
      "D. $325^\\circ$"
    ],
    "correctAnswer": "C",
    "hint": "Since the forward bearing is $< 180^\\circ$, add $180^\\circ$ to find the back bearing.",
    "workedSolution": "Since the forward bearing $\\theta = 135^\\circ < 180^\\circ$, add $180^\\circ$:\n$$\\text{Back bearing} = 135^\\circ + 180^\\circ = 315^\\circ$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Bearings"
  },
  {
    "number": 19,
    "id": "MOCK05_P1_Q19",
    "prompt": "A steel pipe has an external diameter of $16\\text{ cm}$ and an internal diameter of $12\\text{ cm}$. Find the area of its cross-section in terms of $\\pi$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $14\\pi\\text{ cm}^2$",
      "B. $112\\pi\\text{ cm}^2$",
      "C. $56\\pi\\text{ cm}^2$",
      "D. $28\\pi\\text{ cm}^2$"
    ],
    "correctAnswer": "D",
    "hint": "Radii are $R = 8$ and $r = 6$. The cross-sectional area is $\\pi(R^2 - r^2)$.",
    "workedSolution": "$$R = \\frac{16}{2} = 8\\text{ cm}, \\quad r = \\frac{12}{2} = 6\\text{ cm}$$\n$$\\text{Cross-sectional area} = \\pi(R^2 - r^2) = \\pi(8^2 - 6^2) = \\pi(64 - 36) = 28\\pi\\text{ cm}^2$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Annulus"
  },
  {
    "number": 20,
    "id": "MOCK05_P1_Q20",
    "prompt": "Find the rule governing the mapping below:\n$$\\begin{array}{cccccc} x & 1 & 2 & 3 & 4 & 5 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & -1 & 3 & 7 & 11 & 15 \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $y = 3x - 4$",
      "B. $y = 2x - 3$",
      "C. $y = 4x + 5$",
      "D. $y = 4x - 5$"
    ],
    "correctAnswer": "D",
    "hint": "Notice that $y$ increases by 4 for every 1-unit increase in $x$.",
    "workedSolution": "Common difference in $y$: $3 - (-1) = 4$, so gradient $m = 4$.\nForm: $y = 4x + c$. For $x = 1$:\n$$-1 = 4(1) + c \\implies c = -5$$\n$$y = 4x - 5$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Relations and Mappings"
  },
  {
    "number": 21,
    "id": "MOCK05_P1_Q21",
    "prompt": "A passenger train travelling at an average speed of $72\\text{ km/h}$ leaves a station at $10:15\\text{ a.m.}$ and arrives at its destination at $12:45\\text{ p.m.}$ Find the distance travelled.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $144\\text{ km}$",
      "B. $162\\text{ km}$",
      "C. $180\\text{ km}$",
      "D. $216\\text{ km}$"
    ],
    "correctAnswer": "C",
    "hint": "Elapsed time is 2 hours 30 minutes $= 2.5$ hours. Multiply speed by time.",
    "workedSolution": "$$\\text{Time} = 12:45 - 10:15 = 2\\text{ hours } 30\\text{ minutes} = 2.5\\text{ hours}$$\n$$\\text{Distance} = 72 \\times 2.5 = 180\\text{ km}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Speed, Distance, and Time"
  },
  {
    "number": 22,
    "id": "MOCK05_P1_Q22",
    "prompt": "The diagram shows a frequency polygon for test marks scored by candidates. What is the modal mark?",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"300\" height=\"180\" viewBox=\"0 0 300 180\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"40\" y1=\"150\" x2=\"280\" y2=\"150\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"40\" y1=\"20\" x2=\"40\" y2=\"150\" stroke=\"#0f172a\" stroke-width=\"2\"/><polyline points=\"60,150 90,110 130,50 170,80 210,120 250,150\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"90\" cy=\"110\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"130\" cy=\"50\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"170\" cy=\"80\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"210\" cy=\"120\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"85\" y=\"165\" font-family=\"sans-serif\" font-size=\"10\">2</text><text x=\"125\" y=\"165\" font-family=\"sans-serif\" font-size=\"10\">4</text><text x=\"165\" y=\"165\" font-family=\"sans-serif\" font-size=\"10\">6</text><text x=\"205\" y=\"165\" font-family=\"sans-serif\" font-size=\"10\">8</text><text x=\"20\" y=\"55\" font-family=\"sans-serif\" font-size=\"10\">15</text></svg>",
    "options": [
      "A. $2$",
      "B. $4$",
      "C. $6$",
      "D. $8$"
    ],
    "correctAnswer": "B",
    "hint": "Identify the $x$-value where the frequency polygon reaches its highest vertical peak.",
    "workedSolution": "The highest peak of the frequency polygon corresponds to mark $4$ (with peak frequency $15$).\n$$\\text{Modal mark} = 4$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Statistics: Frequency Graphs"
  },
  {
    "number": 23,
    "id": "MOCK05_P1_Q23",
    "prompt": "Find the value of $y$ in the relation $y = 3x^2 - 5x + 4$ when $x = -3$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $16$",
      "B. $32$",
      "C. $46$",
      "D. $52$"
    ],
    "correctAnswer": "C",
    "hint": "Calculate step by step: $3(-3)^2 = 27$ and $-5(-3) = +15$.",
    "workedSolution": "$$y = 3(-3)^2 - 5(-3) + 4 = 3(9) + 15 + 4 = 27 + 15 + 4 = 46$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Algebraic Substitution"
  },
  {
    "number": 24,
    "id": "MOCK05_P1_Q24",
    "prompt": "How many lines of symmetry has an isosceles trapezium?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1$",
      "B. $2$",
      "C. $3$",
      "D. $4$"
    ],
    "correctAnswer": "A",
    "hint": "An isosceles trapezium has reflective symmetry along the perpendicular line connecting midpoints of its parallel bases.",
    "workedSolution": "An isosceles trapezium has non-parallel sides of equal length and base angles equal. It possesses exactly $1$ line of symmetry (the perpendicular bisector of the parallel bases).\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Symmetry in Quadrilaterals"
  },
  {
    "number": 25,
    "id": "MOCK05_P1_Q25",
    "prompt": "The diagram shows a line $MN$ on a Cartesian grid. Find the gradient (slope) of line $MN$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"200\" viewBox=\"0 0 240 200\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"160\" x2=\"220\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"80\" y1=\"20\" x2=\"80\" y2=\"180\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><line x1=\"40\" y1=\"180\" x2=\"180\" y2=\"40\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"80\" cy=\"140\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"140\" cy=\"80\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"88\" y=\"145\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">(0, 1)</text><text x=\"148\" y=\"85\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">(3, 4)</text><text x=\"175\" y=\"35\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">MN</text></svg>",
    "options": [
      "A. $-1$",
      "B. $1$",
      "C. $2$",
      "D. $3$"
    ],
    "correctAnswer": "B",
    "hint": "Use $m = \\frac{y_2 - y_1}{x_2 - x_1}$ with points $(0, 1)$ and $(3, 4)$.",
    "workedSolution": "Line $MN$ passes through points $(0, 1)$ and $(3, 4)$:\n$$m = \\frac{4 - 1}{3 - 0} = \\frac{3}{3} = 1$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Gradient"
  },
  {
    "number": 26,
    "id": "MOCK05_P1_Q26",
    "prompt": "A boy spent $\\frac{2}{5}$ of his pocket money on books and $\\frac{1}{4}$ of the remainder on snacks. What fraction of his pocket money remained?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{3}{20}$",
      "B. $\\frac{7}{20}$",
      "C. $\\frac{9}{20}$",
      "D. $\\frac{11}{20}$"
    ],
    "correctAnswer": "C",
    "hint": "After books, $\\frac{3}{5}$ remains. Snacks take $\\frac{1}{4} \\times \\frac{3}{5} = \\frac{3}{20}$.",
    "workedSolution": "$$\\text{Fraction remaining after books} = 1 - \\frac{2}{5} = \\frac{3}{5}$$\n$$\\text{Fraction spent on snacks} = \\frac{1}{4} \\times \\frac{3}{5} = \\frac{3}{20}$$\n$$\\text{Final fraction remaining} = \\frac{3}{5} - \\frac{3}{20} = \\frac{12 - 3}{20} = \\frac{9}{20}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Operations on Fractions"
  },
  {
    "number": 27,
    "id": "MOCK05_P1_Q27",
    "prompt": "The points $A(-1, 4)$ and $B(5, -4)$ are on the Cartesian plane. Find the length of line segment $AB$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $8$",
      "B. $10$",
      "C. $12$",
      "D. $14$"
    ],
    "correctAnswer": "B",
    "hint": "Apply the distance formula: $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.",
    "workedSolution": "$$|AB| = \\sqrt{(5 - (-1))^2 + (-4 - 4)^2} = \\sqrt{6^2 + (-8)^2} = \\sqrt{36 + 64} = \\sqrt{100} = 10$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Distance Formula"
  },
  {
    "number": 28,
    "id": "MOCK05_P1_Q28",
    "prompt": "Express $45\\text{ minutes}$ as a percentage of $2\\text{ hours } 30\\text{ minutes}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $25\\%$",
      "B. $30\\%$",
      "C. $33\\frac{1}{3}\\%$",
      "D. $35\\%$"
    ],
    "correctAnswer": "B",
    "hint": "Convert 2 hours 30 minutes into 150 minutes, then compute $\\frac{45}{150} \\times 100\\%$.",
    "workedSolution": "$$2\\text{ hours } 30\\text{ minutes} = (2 \\times 60) + 30 = 150\\text{ minutes}$$\n$$\\text{Percentage} = \\left(\\frac{45}{150}\\right) \\times 100\\% = \\left(\\frac{3}{10}\\right) \\times 100\\% = 30\\%$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Percentages"
  },
  {
    "number": 29,
    "id": "MOCK05_P1_Q29",
    "prompt": "If $\\mathbf{m} = \\begin{pmatrix} 4 \\\\ -2 \\end{pmatrix}$ and $\\mathbf{n} = \\begin{pmatrix} -1 \\\\ 5 \\end{pmatrix}$, calculate $|2\\mathbf{m} - \\mathbf{n}|$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $9$",
      "B. $9\\sqrt{2}$",
      "C. $12$",
      "D. $15$"
    ],
    "correctAnswer": "B",
    "hint": "Compute $2\\mathbf{m} - \\mathbf{n} = \\begin{pmatrix} 8 \\\\ -4 \\end{pmatrix} - \\begin{pmatrix} -1 \\\\ 5 \\end{pmatrix} = \\begin{pmatrix} 9 \\\\ -9 \\end{pmatrix}$.",
    "workedSolution": "$$2\\mathbf{m} - \\mathbf{n} = 2\\begin{pmatrix} 4 \\\\ -2 \\end{pmatrix} - \\begin{pmatrix} -1 \\\\ 5 \\end{pmatrix} = \\begin{pmatrix} 8 \\\\ -4 \\end{pmatrix} - \\begin{pmatrix} -1 \\\\ 5 \\end{pmatrix} = \\begin{pmatrix} 9 \\\\ -9 \\end{pmatrix}$$\n$$|2\\mathbf{m} - \\mathbf{n}| = \\sqrt{9^2 + (-9)^2} = \\sqrt{81 + 81} = \\sqrt{162} = 9\\sqrt{2}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Vectors: Magnitude"
  },
  {
    "number": 30,
    "id": "MOCK05_P1_Q30",
    "prompt": "The diagram shows a cyclic quadrilateral $EFGH$. If $\\angle FGH = 105^\\circ$, calculate the value of $\\angle FEH$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"220\" viewBox=\"0 0 220 220\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"110\" cy=\"110\" r=\"85\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><polygon points=\"110,25 185,90 140,185 35,130\" fill=\"#38bdf8\" fill-opacity=\"0.15\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"105\" y=\"18\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">E</text><text x=\"192\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">F</text><text x=\"140\" y=\"200\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">G</text><text x=\"20\" y=\"135\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">H</text><text x=\"130\" y=\"175\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">105°</text></svg>",
    "options": [
      "A. $65^\\circ$",
      "B. $75^\\circ$",
      "C. $85^\\circ$",
      "D. $95^\\circ$"
    ],
    "correctAnswer": "B",
    "hint": "Opposite angles in any cyclic quadrilateral sum to $180^\\circ$.",
    "workedSolution": "Opposite angles of a cyclic quadrilateral are supplementary:\n$$\\angle FEH + \\angle FGH = 180^\\circ$$\n$$\\angle FEH + 105^\\circ = 180^\\circ \\implies \\angle FEH = 180^\\circ - 105^\\circ = 75^\\circ$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Circle Theorems"
  },
  {
    "number": 31,
    "id": "MOCK05_P1_Q31",
    "prompt": "Simplify: $4(3x - 2) - 2(5x - 7)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2x + 6$",
      "B. $2x - 22$",
      "C. $22x - 22$",
      "D. $2x - 6$"
    ],
    "correctAnswer": "A",
    "hint": "Distribute carefully: $12x - 8 - 10x + 14$.",
    "workedSolution": "$$4(3x - 2) - 2(5x - 7) = 12x - 8 - 10x + 14 = (12x - 10x) + (-8 + 14) = 2x + 6$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Simplification"
  },
  {
    "number": 32,
    "id": "MOCK05_P1_Q32",
    "prompt": "Convert $78_{10}$ to a numeral in base five.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $203_5$",
      "B. $303_5$",
      "C. $313_5$",
      "D. $331_5$"
    ],
    "correctAnswer": "B",
    "hint": "Divide successively by 5 and write remainders upwards: $78 = 15(R3), 15 = 3(R0), 3 = 0(R3)$.",
    "workedSolution": "Successive division by 5:\n$$78 \\div 5 = 15 \\text{ remainder } 3$$\n$$15 \\div 5 = 3 \\text{ remainder } 0$$\n$$3 \\div 5 = 0 \\text{ remainder } 3$$\nReading remainders from bottom to top:\n$$78_{10} = 303_5$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Number Bases"
  },
  {
    "number": 33,
    "id": "MOCK05_P1_Q33",
    "prompt": "The perimeter of a square is $36\\text{ cm}$. Find the length of its diagonal.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $9\\text{ cm}$",
      "B. $9\\sqrt{2}\\text{ cm}$",
      "C. $12\\text{ cm}$",
      "D. $18\\text{ cm}$"
    ],
    "correctAnswer": "B",
    "hint": "Side length $s = 36 / 4 = 9\\text{ cm}$. Diagonal is $s\\sqrt{2}$.",
    "workedSolution": "$$\\text{Side length } s = \\frac{36}{4} = 9\\text{ cm}$$\n$$\\text{Diagonal } d = \\sqrt{s^2 + s^2} = \\sqrt{9^2 + 9^2} = \\sqrt{81 \\times 2} = 9\\sqrt{2}\\text{ cm}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Pythagoras' Theorem and Mensuration"
  },
  {
    "number": 34,
    "id": "MOCK05_P1_Q34",
    "prompt": "A store offers a seasonal discount of $15\\%$ on all footwear. If a customer paid $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 170.00$ for a pair of boots, find the original marked price.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 195.50$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 200.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 210.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 220.00$"
    ],
    "correctAnswer": "B",
    "hint": "Customer pays $85\\%$ of marked price: $0.85M = 170$.",
    "workedSolution": "$$\\text{Paid percentage} = 100\\% - 15\\% = 85\\%$$\n$$0.85M = 170.00 \\implies M = \\frac{170}{0.85} = \\frac{17,000}{85} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 200.00$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Discount"
  },
  {
    "number": 35,
    "id": "MOCK05_P1_Q35",
    "prompt": "The mean of the numbers $7, 11, 15, x,$ and $21$ is $14$. Find the median of the set of numbers.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $11$",
      "B. $14$",
      "C. $15$",
      "D. $16$"
    ],
    "correctAnswer": "C",
    "hint": "Sum is $5 \\times 14 = 70$. Find $x = 16$, then arrange in order to find median.",
    "workedSolution": "$$\\text{Sum} = 5 \\times 14 = 70$$\n$$7 + 11 + 15 + x + 21 = 70$$\n$$54 + x = 70 \\implies x = 16$$\nArrange the 5 numbers in ascending order:\n$$7, 11, 15, 16, 21$$\nThe median (middle value) is $15$.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics: Mean and Median"
  },
  {
    "number": 36,
    "id": "MOCK05_P1_Q36",
    "prompt": "The diagram shows a right-angled triangle $ABC$. Find the value of $\\sin(\\angle BAC)$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"180\" viewBox=\"0 0 260 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 220,140 40,30\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"40,125 55,125 55,140\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"25\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"230\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"30\" y=\"25\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"15\" y=\"90\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">6 cm</text><text x=\"120\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">8 cm</text><text x=\"145\" y=\"80\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">10 cm</text></svg>",
    "options": [
      "A. $\\frac{3}{5}$",
      "B. $\\frac{4}{5}$",
      "C. $\\frac{3}{4}$",
      "D. $\\frac{4}{3}$"
    ],
    "correctAnswer": "B",
    "hint": "Recall $\\sin = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}$. Opposite angle $A$ is $BC = 8\\text{ cm}$.",
    "workedSolution": "From vertex $A$:\n$$\\text{Opposite side} = |BC| = 8\\text{ cm}$$\n$$\\text{Hypotenuse} = |AC| = 10\\text{ cm}$$\n$$\\sin(\\angle BAC) = \\frac{\\text{Opposite}}{\\text{Hypotenuse}} = \\frac{8}{10} = \\frac{4}{5}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Trigonometry"
  },
  {
    "number": 37,
    "id": "MOCK05_P1_Q37",
    "prompt": "Simplify the expression: $\\frac{2}{3}(6x - 9) - \\frac{1}{2}(4x + 6)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2x - 9$",
      "B. $2x - 3$",
      "C. $2x + 9$",
      "D. $6x - 9$"
    ],
    "correctAnswer": "A",
    "hint": "Expand terms: $(4x - 6) - (2x + 3) = 4x - 6 - 2x - 3$.",
    "workedSolution": "$$\\frac{2}{3}(6x - 9) = 4x - 6$$\n$$\\frac{1}{2}(4x + 6) = 2x + 3$$\n$$(4x - 6) - (2x + 3) = 4x - 6 - 2x - 3 = 2x - 9$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Simplification"
  },
  {
    "number": 38,
    "id": "MOCK05_P1_Q38",
    "prompt": "A solid cylinder of base radius $7\\text{ cm}$ and height $15\\text{ cm}$ has its curved surface painted. Find the area painted. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $330\\text{ cm}^2$",
      "B. $440\\text{ cm}^2$",
      "C. $660\\text{ cm}^2$",
      "D. $968\\text{ cm}^2$"
    ],
    "correctAnswer": "C",
    "hint": "Curved surface area formula is $2\\pi rh$.",
    "workedSolution": "$$\\text{Curved Surface Area} = 2\\pi r h = 2 \\times \\frac{22}{7} \\times 7 \\times 15 = 44 \\times 15 = 660\\text{ cm}^2$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Cylinders"
  },
  {
    "number": 39,
    "id": "MOCK05_P1_Q39",
    "prompt": "Which of the following points is invariant under reflection in the $y$-axis?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(0, -5)$",
      "B. $(-5, 0)$",
      "C. $(5, 5)$",
      "D. $(-5, 5)$"
    ],
    "correctAnswer": "A",
    "hint": "A point is invariant under reflection in the $y$-axis if it lies on the $y$-axis (i.e. $x = 0$).",
    "workedSolution": "Reflection in the $y$-axis maps $(x, y) \\to (-x, y)$. A point is invariant if $-x = x \\implies 2x = 0 \\implies x = 0$. Among the options, only $(0, -5)$ lies on the $y$-axis.\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Invariance"
  },
  {
    "number": 40,
    "id": "MOCK05_P1_Q40",
    "prompt": "A fair die is tossed once. What is the probability of obtaining a factor of $6$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{1}{3}$",
      "B. $\\frac{1}{2}$",
      "C. $\\frac{2}{3}$",
      "D. $\\frac{5}{6}$"
    ],
    "correctAnswer": "C",
    "hint": "Factors of 6 on a die are 1, 2, 3, and 6 (4 outcomes out of 6).",
    "workedSolution": "Sample space $S = \\{1, 2, 3, 4, 5, 6\\} \\implies n(S) = 6$.\nFactors of $6$: $E = \\{1, 2, 3, 6\\} \\implies n(E) = 4$.\n$$P(E) = \\frac{4}{6} = \\frac{2}{3}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Probability"
  }
];

export const SET_BECE_MOCK_5_MATH_P1: CurriculumQuestionSet = {
  id: "math_mock_5",
  title: "BECE Mathematics National Mock 5 (Paper 1 Objective CBT)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 5 Paper 1",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_05/paper_1",
  questions: allRawMathMock5Questions.map((q) => ({
    id: `math_m5_q${q.number}`,
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

export const rawMathMock5Paper2Questions = [
  {
    "questionNumber": 1,
    "id": "MOCK05_P2_Q01",
    "marks": 15,
    "topic": "Sets, Linear Inequalities, and Vector Column Operations",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"380\" height=\"240\" viewBox=\"0 0 380 240\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"10\" width=\"360\" height=\"220\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"35\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 70</text><circle cx=\"145\" cy=\"125\" r=\"72\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"235\" cy=\"125\" r=\"72\" fill=\"#f59e0b\" fill-opacity=\"0.2\" stroke=\"#d97706\" stroke-width=\"2\"/><text x=\"105\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">F (French)</text><text x=\"240\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#b45309\">S (Spanish)</text><text x=\"105\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">28</text><text x=\"182\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">14</text><text x=\"255\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">21</text><text x=\"315\" y=\"205\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">7</text></svg>",
        "questionText": "In a modern languages academy of $70\\text{ students}$, $42$ study French ($F$), $35$ study Spanish ($S$), and $14$ study both languages. The remaining students study neither language.\n(i) Illustrate the information on a Venn diagram.\n(ii) Find the number of students who study:\n    $(\\alpha)$ French only;\n    $(\\beta)$ exactly one language;\n    $(\\gamma)$ neither French nor Spanish.",
        "workedSolution": "**(i) Venn Diagram Representation:**\nUniversal set $n(U) = 70$.\n- French learners: $n(F) = 42$\n- Spanish learners: $n(S) = 35$\n- Both languages: $n(F \\cap S) = 14$\n\nRegion Breakdown:\n- French only: $n(F \\cap S') = 42 - 14 = 28$\n- Spanish only: $n(F' \\cap S) = 35 - 14 = 21$\n- Both languages: $n(F \\cap S) = 14$\n- Neither language: $n(F \\cup S)' = 70 - (28 + 14 + 21) = 70 - 63 = 7$\n\n*(See the embedded SVG above for the complete, labeled illustration)*.\n\n---\n\n**(ii) ($a$) Students studying French only:**\n$$n(F \\cap S') = 42 - 14 = 28$$\nTherefore, **$28\\text{ students}$ study French only**.\n\n---\n\n**(ii) ($\\beta$) Students studying exactly one language:**\n$$\\text{Only one language} = n(F \\cap S') + n(F' \\cap S) = 28 + 21 = 49$$\nTherefore, **$49\\text{ students}$ study exactly one language**.\n\n---\n\n**(ii) ($\\gamma$) Students studying neither language:**\n$$n(F \\cup S)' = 70 - 63 = 7$$\nTherefore, **$7\\text{ students}$ study neither language**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"80\" viewBox=\"0 0 360 80\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"40\" x2=\"340\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"35\" x2=\"60\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"35\" x2=\"120\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"35\" x2=\"180\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"35\" x2=\"240\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"300\" y1=\"35\" x2=\"300\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"55\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">-2</text><text x=\"115\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">-1</text><text x=\"177\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">0</text><text x=\"237\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">1</text><text x=\"297\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">2</text><circle cx=\"237\" cy=\"25\" r=\"5\" fill=\"#0284c7\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><line x1=\"237\" y1=\"25\" x2=\"340\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"3\"/><polygon points=\"335,20 345,25 335,30\" fill=\"#0284c7\"/></svg>",
        "questionText": "(i) Solve the inequality: $\\frac{5x - 2}{3} - \\frac{x - 1}{2} \\ge 1$.\n(ii) Illustrate the solution on a number line.",
        "workedSolution": "**(i) Solving the inequality:**\n$$\\frac{5x - 2}{3} - \\frac{x - 1}{2} \\ge 1$$\nMultiply through by $\\text{LCM}(3, 2) = 6$:\n$$6\\left(\\frac{5x - 2}{3}\\right) - 6\\left(\\frac{x - 1}{2}\\right) \\ge 6(1)$$\n$$2(5x - 2) - 3(x - 1) \\ge 6$$\n$$10x - 4 - 3x + 3 \\ge 6$$\n$$7x - 1 \\ge 6$$\n$$7x \\ge 6 + 1$$\n$$7x \\ge 7 \\implies x \\ge 1$$\n\n**Truth set:** $\\mathbf{\\{x : x \\ge 1\\}}$.\n\n---\n\n**(ii) Number Line Representation:**\nDraw a horizontal number line with a solid (filled) circle at $1$ and an arrow extending to the right toward positive infinity."
      }
    ]
  },
  {
    "questionNumber": 2,
    "id": "MOCK05_P2_Q02",
    "marks": 15,
    "topic": "Financial Literacy: Simple Interest, Compound Interest, and Depreciation",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A businesswoman deposited $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12,000.00$ in a bank offering compound interest at a rate of $8\\%$ per annum, compounded annually.\n(i) Calculate the total amount in her account at the end of $2\\text{ years}$.\n(ii) Find the compound interest earned over the $2\\text{ years}$.\n(iii) How much more would she earn if the deposit was made under compound interest rather than simple interest at the same rate and duration?",
        "workedSolution": "**(i) Calculating compound amount ($A$):**\n$$A = P\\left(1 + \\frac{R}{100}\\right)^n$$\nWhere $P = 12,000.00, R = 8\\%, n = 2$:\n$$A = 12,000\\left(1 + \\frac{8}{100}\\right)^2 = 12,000(1.08)^2$$\n$$(1.08)^2 = 1.1664$$\n$$A = 12,000 \\times 1.1664 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 13,996.80$$\n\nTherefore, the total amount at the end of two years is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 13,996.80$**.\n\n---\n\n**(ii) Compound interest earned ($CI$):**\n$$CI = A - P = 13,996.80 - 12,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,996.80$$\n\nTherefore, the compound interest earned is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,996.80$**.\n\n---\n\n**(iii) Comparing with simple interest ($SI$):**\n$$SI = \\frac{P \\times R \\times T}{100} = \\frac{12,000 \\times 8 \\times 2}{100} = 120 \\times 16 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,920.00$$\n$$\\text{Difference} = CI - SI = 1,996.80 - 1,920.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 76.80$$\n\nTherefore, she would earn **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 76.80$** more."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A commercial pickup truck purchased brand-new for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 90,000.00$ depreciates at the rate of $12\\%$ per annum on its reducing book value at the beginning of each year. Calculate the value of the truck at the end of $2\\text{ years}$.",
        "workedSolution": "**Year 1:**\n$$\\text{Depreciation}_1 = \\frac{12}{100} \\times 90,000.00 = 12 \\times 900.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 10,800.00$$\n$$\\text{Value at end of Year 1} = 90,000.00 - 10,800.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 79,200.00$$\n\n**Year 2:**\n$$\\text{Depreciation}_2 = \\frac{12}{100} \\times 79,200.00 = 12 \\times 792.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 9,504.00$$\n$$\\text{Value at end of Year 2} = 79,200.00 - 9,504.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 69,696.00$$\n\n*(Alternatively: $90,000(1 - 0.12)^2 = 90,000(0.88)^2 = 90,000(0.7744) = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 69,696.00$)*.\n\nTherefore, the value of the truck at the end of two years is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 69,696.00$**."
      }
    ]
  },
  {
    "questionNumber": 3,
    "id": "MOCK05_P2_Q03",
    "marks": 15,
    "topic": "Compound Mensuration: Cylinder and Semicircle Composite Plan",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"220\" viewBox=\"0 0 360 220\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"50\" y=\"40\" width=\"180\" height=\"140\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><path d=\"M 230 40 A 70 70 0 0 1 230 180 Z\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><line x1=\"230\" y1=\"40\" x2=\"230\" y2=\"180\" stroke=\"#64748b\" stroke-width=\"1.8\" stroke-dasharray=\"4\"/><text x=\"120\" y=\"30\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">18 m</text><text x=\"15\" y=\"115\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">14 m</text><text x=\"245\" y=\"115\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">r = 7 m</text><text x=\"100\" y=\"205\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
        "questionText": "The diagram shows the boundary plan of an outdoor assembly court consisting of a rectangle attached to a semicircular stage at one end. The rectangle measures $18\\text{ m}$ long and $14\\text{ m}$ wide, with the diameter of the semicircle matching the width of the rectangle. Calculate the:\n(i) perimeter of the entire assembly court;\n(ii) total area of the court. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
        "workedSolution": "**(i) Perimeter of the court:**\nThe outer boundary consists of two lengths ($18\\text{ m}$ each), one end width ($14\\text{ m}$), and the curved semicircular arc ($d = 14\\text{ m} \\implies r = 7\\text{ m}$):\n$$\\text{Semicircular arc length} = \\pi r = \\frac{22}{7} \\times 7 = 22\\text{ m}$$\n$$\\text{Perimeter} = 18 + 14 + 18 + 22 = 72\\text{ m}$$\n\nTherefore, the perimeter is **$72\\text{ m}$**.\n\n---\n\n**(ii) Total area of the court:**\n$$\\text{Area of rectangle} = l \\times w = 18 \\times 14 = 252\\text{ m}^2$$\n$$\\text{Area of semicircle} = \\frac{1}{2}\\pi r^2 = \\frac{1}{2} \\times \\frac{22}{7} \\times 7^2 = 11 \\times 7 = 77\\text{ m}^2$$\n$$\\text{Total Area} = 252 + 77 = 329\\text{ m}^2$$\n\nTherefore, the total area of the court is **$329\\text{ m}^2$**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A closed cylindrical metal drum of radius $3.5\\text{ m}$ and height $8.0\\text{ m}$ is to be painted externally on its entire surface (both curved side and flat circular ends). If one can of industrial paint covers $22\\text{ m}^2$, calculate the number of paint cans required. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
        "workedSolution": "**Step 1: Calculate the total surface area (closed cylinder):**\n$$\\text{TSA} = 2\\pi r(r + h)$$\nGiven $r = 3.5 = \\frac{7}{2}\\text{ m}$ and $h = 8.0\\text{ m}$:\n$$\\text{TSA} = 2 \\times \\frac{22}{7} \\times \\frac{7}{2} \\times (3.5 + 8) = 22 \\times 11.5 = 253\\text{ m}^2$$\n\n**Step 2: Calculate the number of cans:**\n$$\\text{Number of cans} = \\frac{253}{22} = 11.5$$\nSince paint can only be bought in whole cans, round up:\n$$11.5 \\implies 12\\text{ cans}$$\n\nTherefore, **$12\\text{ cans}$** of industrial paint will be required."
      }
    ]
  },
  {
    "questionNumber": 4,
    "id": "MOCK05_P2_Q04",
    "marks": 15,
    "topic": "Geometric Compass Construction: Triangle with $90^\\circ$ Angle, Median, and Circumcircle",
    "subQuestions": [
      {
        "part": "a",
        "marks": 10,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"300\" viewBox=\"0 0 400 300\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"300\" fill=\"#ffffff\"/><polygon points=\"60,220 300,220 60,60\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"60,205 75,205 75,220\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"60\" y1=\"220\" x2=\"180\" y2=\"140\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><circle cx=\"180\" cy=\"140\" r=\"4\" fill=\"#dc2626\"/><text x=\"45\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"310\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Q</text><text x=\"45\" y=\"55\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">R</text><text x=\"188\" y=\"135\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">M</text><text x=\"165\" y=\"240\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">8 cm</text><text x=\"20\" y=\"145\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">6 cm</text></svg>",
        "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct triangle $PQR$ right-angled at $P$ such that $|PQ| = 8.0\\text{ cm}$ and $|PR| = 6.0\\text{ cm}$;\n(ii) Construct the perpendicular bisector of hypotenuse $QR$ to locate its midpoint $M$;\n(iii) Join point $P$ to midpoint $M$ with a straight line (the median from $P$);\n(iv) With centre $M$ and radius equal to $|MQ|$, draw a circle passing through $P, Q,$ and $R$.",
        "workedSolution": "**Compass Construction Steps:**\n1. **Base Line $|PQ| = 8.0\\text{ cm}$:**\n   - Rule a horizontal straight line with a sharp pencil and mark point $P$.\n   - Set compasses to $8.0\\text{ cm}$, place needle at $P$, and cut the line to fix $Q$.\n2. **Construct $\\angle QPR = 90^\\circ$ at $P$:**\n   - Construct a standard $90^\\circ$ perpendicular ray at vertex $P$.\n   - Set compasses to $6.0\\text{ cm}$, place needle at $P$, and cut the perpendicular ray to locate $R$.\n   - Join $R$ to $Q$ with a firm straight line to complete triangle $PQR$.\n3. **Perpendicular Bisector of Hypotenuse $QR$ (Midpoint $M$):**\n   - Place compass needle at $Q$ with radius $> 5\\text{ cm}$, strike arcs above and below line segment $QR$.\n   - With the same radius, place needle at $R$ and strike intersecting arcs.\n   - Draw a line connecting the intersections to cross $QR$ at its midpoint $M$.\n4. **Median $PM$ and Circumcircle:**\n   - Rule a straight line connecting vertex $P$ to midpoint $M$.\n   - Place compass needle at $M$ with radius set to $|MQ| = |MR| = |MP| = 5.0\\text{ cm}$, and draw the circle passing through all three vertices."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your completed drawing in (a):\n(i) Measure the length of the hypotenuse $|QR|$;\n(ii) Measure the length of the median $|PM|$;\n(iii) What geometric conclusion can be drawn regarding the lengths $|MQ|, |MR|,$ and $|PM|$?",
        "workedSolution": "**(i) Measuring length $|QR|$:**\n- In right-angled triangle $\\triangle PQR$:\n  $$|QR| = \\sqrt{|PQ|^2 + |PR|^2} = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10.0\\text{ cm}$$\n$$\\mathbf{|QR| = 10.0\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(ii) Measuring median $|PM|$:**\n- In any right-angled triangle, the median to the hypotenuse equals half the hypotenuse:\n  $$|PM| = \\frac{1}{2}|QR| = \\frac{10.0}{2} = 5.0\\text{ cm}$$\n$$\\mathbf{|PM| = 5.0\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(iii) Geometric Conclusion:**\n$$|MQ| = |MR| = |PM| = 5.0\\text{ cm}$$\n**Conclusion:** The midpoint of the hypotenuse of a right-angled triangle is the **circumcentre** of the triangle and is equidistant from all three vertices."
      }
    ]
  },
  {
    "questionNumber": 5,
    "id": "MOCK05_P2_Q05",
    "marks": 15,
    "topic": "Frequency Distribution, Mean, and Bar Chart",
    "subQuestions": [
      {
        "part": "a",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The following dataset shows the number of goals scored by an academy football team in $30\\text{ matches}$:\n$$2, 0, 3, 1, 2, 4, 1, 2, 3, 0, 1, 2, 3, 1, 2, 4, 2, 1, 3, 2, 0, 1, 2, 3, 2, 1, 0, 3, 2, 1$$\nConstruct a frequency distribution table showing the number of goals ($x$), tally, frequency ($f$), and product ($fx$).",
        "workedSolution": "**Frequency Distribution Table:**\n\n| Number of Goals ($x$) | Tally | Frequency ($f$) | Product ($fx$) |\n| :---: | :--- | :---: | :---: |\n| $0$ | $\\parallel\\parallel$ | $4$ | $0 \\times 4 = 0$ |\n| $1$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\parallel\\mid$ | $8$ | $1 \\times 8 = 8$ |\n| $2$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\cancel{\\parallel\\parallel\\parallel\\parallel}$ | $10$ | $2 \\times 10 = 20$ |\n| $3$ | $\\cancel{\\parallel\\parallel\\parallel\\parallel}\\ \\mid$ | $6$ | $3 \\times 6 = 18$ |\n| $4$ | $\\parallel$ | $2$ | $4 \\times 2 = 8$ |\n| **Total** | | **$\\sum f = 30$** | **$\\sum fx = 54$** |"
      },
      {
        "part": "b",
        "marks": 4,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your frequency table in (a), calculate:\n(i) the modal number of goals scored;\n(ii) the mean number of goals scored per match, correct to one decimal place.",
        "workedSolution": "**(i) Modal number of goals:**\nThe highest frequency is $10$, which corresponds to $2\\text{ goals}$.\n$$\\text{Modal goals} = 2$$\n\n---\n\n**(ii) Mean number of goals ($\\bar{x}$):**\n$$\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{54}{30} = 1.8$$\n\nTherefore, the mean number of goals scored is **$1.8\\text{ goals}$**."
      },
      {
        "part": "c",
        "marks": 5,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"240\" viewBox=\"0 0 360 240\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"50\" y1=\"190\" x2=\"320\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"50\" y1=\"30\" x2=\"50\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2\"/><rect x=\"70\" y=\"134\" width=\"30\" height=\"56\" fill=\"#0284c7\"/><rect x=\"120\" y=\"78\" width=\"30\" height=\"112\" fill=\"#0284c7\"/><rect x=\"170\" y=\"50\" width=\"30\" height=\"140\" fill=\"#0284c7\"/><rect x=\"220\" y=\"106\" width=\"30\" height=\"84\" fill=\"#0284c7\"/><rect x=\"270\" y=\"162\" width=\"30\" height=\"28\" fill=\"#0284c7\"/><text x=\"80\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">0</text><text x=\"130\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">1</text><text x=\"180\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">2</text><text x=\"230\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">3</text><text x=\"280\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">4</text><text x=\"30\" y=\"138\" font-family=\"sans-serif\" font-size=\"11\">4</text><text x=\"30\" y=\"82\" font-family=\"sans-serif\" font-size=\"11\">8</text><text x=\"25\" y=\"54\" font-family=\"sans-serif\" font-size=\"11\">10</text><text x=\"160\" y=\"230\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Goals Scored</text><text x=\"15\" y=\"25\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Frequency</text></svg>",
        "questionText": "Draw a bar chart to represent the distribution in (a).",
        "workedSolution": "**Bar Chart Drawing Guide:**\n- Horizontal axis represents the number of goals ($0, 1, 2, 3, 4$) with uniform bar widths and equal inter-bar spacing.\n- Vertical axis represents frequency with scale calibrated from $0$ to $12$ ($2\\text{ cm} = 2\\text{ units}$).\n- Bar heights correspond strictly to frequencies: $4$ (for $0$), $8$ (for $1$), $10$ (for $2$), $6$ (for $3$), and $2$ (for $4$).\n\n*(See the embedded SVG above for the complete, well-labeled bar chart)*."
      }
    ]
  },
  {
    "questionNumber": 6,
    "id": "MOCK05_P2_Q06",
    "marks": 15,
    "topic": "Linear Relations, Table of Values, and Coordinate Graphing",
    "subQuestions": [
      {
        "part": "a",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "(i) Copy and complete the table of values for the relation $y = 5 - 2x$ for the interval $-3 \\le x \\le 4$.\n\n| $x$ | $-3$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y = 5 - 2x$ | $11$ | | $7$ | | $3$ | | $-1$ | |\n\n(ii) State the gradient of the line and the coordinates of the point where the line crosses the $y$-axis.",
        "workedSolution": "**(i) Completed Table:**\nEvaluate $y = 5 - 2x$:\n- $x = -2: y = 5 - 2(-2) = 5 + 4 = 9$\n- $x = 0: y = 5 - 2(0) = 5$\n- $x = 2: y = 5 - 2(2) = 5 - 4 = 1$\n- $x = 4: y = 5 - 2(4) = 5 - 8 = -3$\n\n| $x$ | $-3$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y$ | $11$ | **$9$** | $7$ | **$5$** | $3$ | **$1$** | $-1$ | **$-3$** |\n\n---\n\n**(ii) Gradient and $y$-intercept:**\n- Gradient ($m$) $= -2$\n- $y$-intercept coordinates: **$(0, 5)$**"
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"380\" viewBox=\"0 0 400 380\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"380\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"gridMK5\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"380\" fill=\"url(#gridMK5)\"/><line x1=\"20\" y1=\"260\" x2=\"380\" y2=\"260\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"160\" y1=\"20\" x2=\"160\" y2=\"360\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"385\" y=\"265\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"165\" y=\"25\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><line x1=\"70\" y1=\"40\" x2=\"320\" y2=\"320\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"70\" cy=\"40\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"100\" cy=\"80\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"130\" cy=\"120\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"160\" cy=\"160\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"190\" cy=\"200\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"220\" cy=\"240\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"250\" cy=\"280\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"280\" cy=\"320\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"245\" y=\"160\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">y = 5 - 2x</text></svg>",
        "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on the $x$-axis and $2\\text{ cm}$ to $2\\text{ units}$ on the $y$-axis, draw two perpendicular axes $Ox$ and $Oy$ on a graph sheet for the intervals $-4 \\le x \\le 5$ and $-6 \\le y \\le 14$.\nPlot the points from your table and draw a straight line through all the points.",
        "workedSolution": "**Graph Execution Protocol:**\n1. Calibrate $x$-axis: $2\\text{ cm} = 1\\text{ unit}$ ($-4$ to $5$).\n2. Calibrate $y$-axis: $2\\text{ cm} = 2\\text{ units}$ ($-6$ to $14$).\n3. Plot the coordinates: $(-3, 11), (-2, 9), (-1, 7), (0, 5), (1, 3), (2, 1), (3, -1), (4, -3)$.\n4. Connect all plotted points using a ruler to draw a continuous straight line.\n5. Label the line $y = 5 - 2x$."
      },
      {
        "part": "c",
        "marks": 3,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your graph, find the:\n(i) value of $y$ when $x = 1.5$;\n(ii) value of $x$ when $y = 0$ ($x$-intercept).",
        "workedSolution": "**(i) Finding $y$ when $x = 1.5$:**\nFrom the graph, trace vertically from $x = 1.5$ to meet the line, then horizontally to read the $y$-value:\n$$y = 5 - 2(1.5) = 5 - 3 = 2$$\nFrom graph reading: **$y = 2.0$ (tolerance $\\pm 0.1$)**.\n\n---\n\n**(ii) Finding $x$ when $y = 0$ ($x$-intercept):**\nRead the value of $x$ where the line crosses the horizontal $x$-axis:\n$$0 = 5 - 2x \\implies 2x = 5 \\implies x = 2.5$$\nFrom graph reading: **$x = 2.5$ (tolerance $\\pm 0.1$)**."
      }
    ]
  }
];
export const allRawMathMock5TheoryQuestions = rawMathMock5Paper2Questions;

export const SET_BECE_MOCK_5_MATH_P2: CurriculumQuestionSet = {
  id: "math_mock_5_p2",
  title: "BECE Mathematics National Mock 5 (Paper 2 Theory & Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 5 Paper 2",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_05/paper_2",
  questions: rawMathMock5Paper2Questions.map((q) => {
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
      id: `math_m5_p2_q${q.questionNumber}`,
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
export const SET_BECE_MOCK_5_MATH_COMPLETE = {
  mockExamNumber: 5,
  subject: "Mathematics",
  examType: "BECE Mathematics National Standard Mock 5",
  academicYear: 2026,
  paper1: SET_BECE_MOCK_5_MATH_P1,
  paper2: SET_BECE_MOCK_5_MATH_P2,
  totalMarks: 100,
  unifiedTimeMinutes: 120
};
