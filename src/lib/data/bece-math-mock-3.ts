/**
 * JHS Curriculum Data - BECE Mathematics National Mock 3
 * Standardized Isomorphic Examination Suite (Paper 1 CBT + Paper 2 Theory)
 *
 * Proprietary Content © GAM IT Solutions (GAM EDU). All rights reserved.
 * Curriculum Alignment: NaCCA JHS Common Core Programme / WAEC Standards
 */

import { CurriculumQuestionSet } from '../types';
import { MathMockObjectiveQuestion } from './bece-math-mock-1';

export const allRawMathMock3Questions: MathMockObjectiveQuestion[] = [
  {
    "number": 1,
    "id": "MOCK03_P1_Q01",
    "prompt": "Given that the universal set $U = \\{x : 1 \\le x \\le 15, x \\text{ is an integer}\\}$ and $E = \\{x : x \\text{ is a prime number}\\}$, find $n(E')$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $9$",
      "B. $8$",
      "C. $6$",
      "D. $10$"
    ],
    "correctAnswer": "A",
    "hint": "Recall that $n(E') = n(U) - n(E)$. Count the prime numbers between 1 and 15 first.",
    "workedSolution": "The universal set has $15$ elements: $\\{1, 2, 3, \\dots, 15\\}$.\nThe prime numbers in $U$ are $E = \\{2, 3, 5, 7, 11, 13\\} \\implies n(E) = 6$.\nThe complement $E'$ consists of non-prime integers in $U$:\n$$n(E') = n(U) - n(E) = 15 - 6 = 9$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Sets and Operations on Sets"
  },
  {
    "number": 2,
    "id": "MOCK03_P1_Q02",
    "prompt": "Evaluate: $(-4)^2 - 3(-2)^3 + 5(0)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $-8$",
      "B. $16$",
      "C. $32$",
      "D. $40$"
    ],
    "correctAnswer": "D",
    "hint": "Apply order of operations: calculate the powers first, noting that $(-4)^2 = 16$ and $(-2)^3 = -8$.",
    "workedSolution": "Calculate each term step by step:\n$$(-4)^2 = 16$$\n$$(-2)^3 = -8 \\implies -3(-8) = +24$$\n$$5(0) = 0$$\n$$16 + 24 + 0 = 40$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Operations on Integers and Powers"
  },
  {
    "number": 3,
    "id": "MOCK03_P1_Q03",
    "prompt": "Express the recurring decimal $0.\\dot{4}\\dot{5}$ as a common fraction in its lowest terms.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{9}{20}$",
      "B. $\\frac{4}{9}$",
      "C. $\\frac{45}{100}$",
      "D. $\\frac{5}{11}$"
    ],
    "correctAnswer": "D",
    "hint": "Let $x = 0.4545...$ then multiply by 100 and subtract $x$.",
    "workedSolution": "Let $x = 0.454545\\dots$\n$$100x = 45.454545\\dots$$\n$$100x - x = 45$$\n$$99x = 45 \\implies x = \\frac{45}{99} = \\frac{5}{11}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Fractions and Decimals"
  },
  {
    "number": 4,
    "id": "MOCK03_P1_Q04",
    "prompt": "A school library bought $15$ geometry sets at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 24.00$ each. If the price per set increases by $25\\%$, how many geometry sets can be purchased with the same total amount?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $10$",
      "B. $18$",
      "C. $14$",
      "D. $12$"
    ],
    "correctAnswer": "D",
    "hint": "Compute the total budget ($15 \\times 24 = 360$) and divide by the new increased price.",
    "workedSolution": "$$\\text{Total budget} = 15 \\times 24.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 360.00$$\n$$\\text{New price} = 24.00 + (0.25 \\times 24.00) = 24.00 + 6.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 30.00$$\n$$\\text{Number of sets} = \\frac{360.00}{30.00} = 12$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Percentages and Proportion"
  },
  {
    "number": 5,
    "id": "MOCK03_P1_Q05",
    "prompt": "If $243^{x - 1} = 27^{x + 1}$, find the value of $x$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $4$",
      "B. $3$",
      "C. $2$",
      "D. $5$"
    ],
    "correctAnswer": "A",
    "hint": "Express both sides as powers of 3: $243 = 3^5$ and $27 = 3^3$.",
    "workedSolution": "Express both numbers as powers of base $3$:\n$$243 = 3^5, \\quad 27 = 3^3$$\n$$(3^5)^{x - 1} = (3^3)^{x + 1}$$\n$$3^{5x - 5} = 3^{3x + 3}$$\nEquating exponents:\n$$5x - 5 = 3x + 3$$\n$$5x - 3x = 3 + 5$$\n$$2x = 8 \\implies x = 4$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Indices and Exponents"
  },
  {
    "number": 6,
    "id": "MOCK03_P1_Q06",
    "prompt": "The diagram shows a circle with centre $O$ and chord $AB$ of length $16\\text{ cm}$. If the radius of the circle is $10\\text{ cm}$, calculate the perpendicular distance $OM$ from the centre to the chord.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"240\" height=\"240\" viewBox=\"0 0 240 240\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"120\" cy=\"120\" r=\"90\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"50\" y1=\"170\" x2=\"190\" y2=\"170\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><line x1=\"120\" y1=\"120\" x2=\"120\" y2=\"170\" stroke=\"#dc2626\" stroke-width=\"2\" stroke-dasharray=\"3\"/><line x1=\"120\" y1=\"120\" x2=\"190\" y2=\"170\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><polyline points=\"120,158 132,158 132,170\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.2\"/><circle cx=\"120\" cy=\"120\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"115\" y=\"110\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">O</text><text x=\"35\" y=\"175\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"195\" y=\"175\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"115\" y=\"188\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">M</text><text x=\"160\" y=\"140\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">10 cm</text><text x=\"100\" y=\"150\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">d</text></svg>",
    "options": [
      "A. $5\\text{ cm}$",
      "B. $6\\text{ cm}$",
      "C. $7\\text{ cm}$",
      "D. $8\\text{ cm}$"
    ],
    "correctAnswer": "B",
    "hint": "Use Pythagoras' theorem on the right-angled triangle $\\triangle OMB$, where $MB = 8\\text{ cm}$ and hypotenuse $OB = 10\\text{ cm}$.",
    "workedSolution": "A perpendicular from the centre of a circle to a chord bisects the chord:\n$$|MB| = \\frac{1}{2}|AB| = \\frac{1}{2}(16) = 8\\text{ cm}$$\nIn the right-angled triangle $\\triangle OMB$, radius $|OB| = 10\\text{ cm}$:\n$$|OM|^2 + |MB|^2 = |OB|^2$$\n$$|OM|^2 + 8^2 = 10^2$$\n$$|OM|^2 + 64 = 100$$\n$$|OM|^2 = 36 \\implies |OM| = 6\\text{ cm}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Circle Theorems and Chords"
  },
  {
    "number": 7,
    "id": "MOCK03_P1_Q07",
    "prompt": "Simplify: $\\frac{3}{2x - 1} - \\frac{2}{x + 3}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{x + 11}{(2x - 1)(x + 3)}$",
      "B. $\\frac{x + 7}{(2x - 1)(x + 3)}$",
      "C. $\\frac{-x + 11}{(2x - 1)(x + 3)}$",
      "D. $\\frac{7x + 7}{(2x - 1)(x + 3)}$"
    ],
    "correctAnswer": "C",
    "hint": "Express with common denominator $(2x-1)(x+3)$ and expand the numerator carefully.",
    "workedSolution": "Combine over a common denominator:\n$$\\frac{3(x + 3) - 2(2x - 1)}{(2x - 1)(x + 3)} = \\frac{3x + 9 - 4x + 2}{(2x - 1)(x + 3)} = \\frac{-x + 11}{(2x - 1)(x + 3)}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Algebraic Fractions"
  },
  {
    "number": 8,
    "id": "MOCK03_P1_Q08",
    "prompt": "An interior angle of a regular polygon is $144^\\circ$. How many lines of symmetry does the polygon have?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $8$",
      "B. $9$",
      "C. $10$",
      "D. $12$"
    ],
    "correctAnswer": "C",
    "hint": "Exterior angle $= 180^\\circ - 144^\\circ = 36^\\circ$. The number of sides $n = 360^\\circ / 36^\\circ$. A regular polygon has $n$ lines of symmetry.",
    "workedSolution": "$$\\text{Exterior angle} = 180^\\circ - 144^\\circ = 36^\\circ$$\n$$\\text{Number of sides } n = \\frac{360^\\circ}{36^\\circ} = 10$$\nA regular decagon has exactly $10$ sides, hence it possesses $10$ lines of symmetry.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Polygons and Symmetry"
  },
  {
    "number": 9,
    "id": "MOCK03_P1_Q09",
    "prompt": "A rectangular carton of dimensions $40\\text{ cm} \\times 30\\text{ cm} \\times 20\\text{ cm}$ is packed with smaller cubic soap bars of side $5\\text{ cm}$. How many soap bars will completely fill the carton?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $96$",
      "B. $128$",
      "C. $192$",
      "D. $240$"
    ],
    "correctAnswer": "C",
    "hint": "Divide each dimension by 5 cm: $(40/5) \\times (30/5) \\times (20/5)$.",
    "workedSolution": "$$\\text{Volume of carton} = 40 \\times 30 \\times 20 = 24,000\\text{ cm}^3$$\n$$\\text{Volume of one soap cube} = 5 \\times 5 \\times 5 = 125\\text{ cm}^3$$\n$$\\text{Number of bars} = \\frac{24,000}{125} = 192$$\n*(Or by dimensional alignment: $\\frac{40}{5} \\times \\frac{30}{5} \\times \\frac{20}{5} = 8 \\times 6 \\times 4 = 192$)*.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Volume and Packing"
  },
  {
    "number": 10,
    "id": "MOCK03_P1_Q10",
    "prompt": "The probability that a candidate passes an entrance exam is $\\frac{5}{8}$. What are the odds against the candidate passing the exam?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3 : 8$",
      "B. $5 : 8$",
      "C. $5 : 3$",
      "D. $3 : 5$"
    ],
    "correctAnswer": "D",
    "hint": "Odds against passing is the ratio $P(\\text{fail}) : P(\\text{pass})$.",
    "workedSolution": "$$P(\\text{pass}) = \\frac{5}{8} \\implies P(\\text{fail}) = 1 - \\frac{5}{8} = \\frac{3}{8}$$\n$$\\text{Odds against passing} = \\frac{P(\\text{fail})}{P(\\text{pass})} = \\frac{3/8}{5/8} = \\frac{3}{5} = 3 : 5$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Probability and Odds"
  },
  {
    "number": 11,
    "id": "MOCK03_P1_Q11",
    "prompt": "The diagram shows a sector of a circle of radius $14\\text{ cm}$ subtending an angle of $90^\\circ$ at the centre $O$. Calculate the perimeter of the sector. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"220\" viewBox=\"0 0 220 220\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M 40 180 L 180 180 A 140 140 0 0 0 40 40 Z\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><polyline points=\"40,165 55,165 55,180\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><circle cx=\"40\" cy=\"180\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"25\" y=\"195\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">O</text><text x=\"185\" y=\"195\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">P</text><text x=\"25\" y=\"35\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">Q</text><text x=\"100\" y=\"195\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">14 cm</text><text x=\"15\" y=\"115\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">14 cm</text></svg>",
    "options": [
      "A. $22\\text{ cm}$",
      "B. $36\\text{ cm}$",
      "C. $44\\text{ cm}$",
      "D. $50\\text{ cm}$"
    ],
    "correctAnswer": "D",
    "hint": "Perimeter of sector includes the curved arc plus the two radii: $\\text{arc} + 2r$.",
    "workedSolution": "$$\\text{Length of arc } PQ = \\frac{\\theta}{360^\\circ} \\times 2\\pi r = \\frac{90^\\circ}{360^\\circ} \\times 2 \\times \\frac{22}{7} \\times 14 = \\frac{1}{4} \\times 88 = 22\\text{ cm}$$\n$$\\text{Perimeter of sector} = \\text{arc length} + 2r = 22 + 14 + 14 = 50\\text{ cm}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Mensuration: Sectors of Circles"
  },
  {
    "number": 12,
    "id": "MOCK03_P1_Q12",
    "prompt": "Find the truth set of the linear inequality: $\\frac{x - 3}{2} \\ge \\frac{2x + 1}{5}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\{x : x \\ge 17\\}$",
      "B. $\\{x : x \\le 17\\}$",
      "C. $\\{x : x \\ge 13\\}$",
      "D. $\\{x : x \\le 13\\}$"
    ],
    "correctAnswer": "A",
    "hint": "Cross-multiply by the positive LCM = 10 to clear denominators.",
    "workedSolution": "Multiply through by $\\text{LCM}(2, 5) = 10$:\n$$5(x - 3) \\ge 2(2x + 1)$$\n$$5x - 15 \\ge 4x + 2$$\n$$5x - 4x \\ge 2 + 15$$\n$$x \\ge 17$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 13,
    "id": "MOCK03_P1_Q13",
    "prompt": "The price of an article after a value added tax (VAT) of $15\\%$ is $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 460.00$. Find the price of the article before VAT was added.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 391.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 529.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 420.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 400.00$"
    ],
    "correctAnswer": "D",
    "hint": "The gross price is $115\\%$ of the net price: $1.15P = 460$.",
    "workedSolution": "$$\\text{Selling price} = 115\\% \\text{ of initial price}$$\n$$1.15P = 460.00$$\n$$P = \\frac{460}{1.15} = \\frac{46,000}{115} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 400.00$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Taxation"
  },
  {
    "number": 14,
    "id": "MOCK03_P1_Q14",
    "prompt": "The bearings of $X$ from $Y$ is $310^\\circ$. What is the three-figure bearing of $Y$ from $X$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $050^\\circ$",
      "B. $220^\\circ$",
      "C. $140^\\circ$",
      "D. $130^\\circ$"
    ],
    "correctAnswer": "D",
    "hint": "Because the forward bearing $> 180^\\circ$, the back bearing is $\\theta - 180^\\circ$.",
    "workedSolution": "Since forward bearing $\\theta = 310^\\circ > 180^\\circ$:\n$$\\text{Back bearing} = 310^\\circ - 180^\\circ = 130^\\circ$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Bearings and Navigation"
  },
  {
    "number": 15,
    "id": "MOCK03_P1_Q15",
    "prompt": "Find the gradient (slope) of the straight line with equation $5x + 2y - 8 = 0$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $-\\frac{5}{2}$",
      "B. $-\\frac{2}{5}$",
      "C. $\\frac{2}{5}$",
      "D. $\\frac{5}{2}$"
    ],
    "correctAnswer": "A",
    "hint": "Rearrange into $y = mx + c$ to identify the gradient $m$.",
    "workedSolution": "Rearrange to slope-intercept form $y = mx + c$:\n$$2y = -5x + 8$$\n$$y = -\\frac{5}{2}x + 4$$\n$$\\text{Gradient } m = -\\frac{5}{2}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Gradient"
  },
  {
    "number": 16,
    "id": "MOCK03_P1_Q16",
    "prompt": "Given that vector $\\mathbf{a} = \\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix}$ and vector $\\mathbf{b} = \\begin{pmatrix} 5 \\\\ -1 \\end{pmatrix}$, calculate $|\\mathbf{a} + 2\\mathbf{b}|$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\sqrt{45}$",
      "B. $\\sqrt{74}$",
      "C. $\\sqrt{65}$",
      "D. $\\sqrt{53}$"
    ],
    "correctAnswer": "D",
    "hint": "First find vector $\\mathbf{a} + 2\\mathbf{b}$, then take the square root of $x^2 + y^2$.",
    "workedSolution": "$$\\mathbf{a} + 2\\mathbf{b} = \\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix} + 2\\begin{pmatrix} 5 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix} + \\begin{pmatrix} 10 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} 7 \\\\ 2 \\end{pmatrix}$$\n$$|\\mathbf{a} + 2\\mathbf{b}| = \\sqrt{7^2 + 2^2} = \\sqrt{49 + 4} = \\sqrt{53}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Vectors: Magnitude and Operations"
  },
  {
    "number": 17,
    "id": "MOCK03_P1_Q17",
    "prompt": "The diagram shows a straight line $AB$ intersecting parallel lines. Calculate the value of angle $z$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"340\" height=\"180\" viewBox=\"0 0 340 180\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"30\" y1=\"50\" x2=\"310\" y2=\"50\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"30\" y1=\"130\" x2=\"310\" y2=\"130\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"80\" y1=\"160\" x2=\"260\" y2=\"20\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><text x=\"210\" y=\"42\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">68°</text><path d=\"M 220 50 A 25 25 0 0 1 238 35\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><text x=\"105\" y=\"150\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">z</text><path d=\"M 120 130 A 25 25 0 0 0 138 145\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><polygon points=\"270,47 278,50 270,53\" fill=\"#0f172a\"/><polygon points=\"270,127 278,130 270,133\" fill=\"#0f172a\"/></svg>",
    "options": [
      "A. $68^\\circ$",
      "B. $112^\\circ$",
      "C. $122^\\circ$",
      "D. $136^\\circ$"
    ],
    "correctAnswer": "A",
    "hint": "Use alternate interior and vertically opposite angle theorems for parallel lines cut by a transversal.",
    "workedSolution": "By vertically opposite and alternate angle properties, the acute angle made by the transversal with both parallel lines is equal:\n$$z = 68^\\circ$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Plane Geometry and Angles"
  },
  {
    "number": 18,
    "id": "MOCK03_P1_Q18",
    "prompt": "Expand and simplify completely: $(3p - 2q)(2p + 5q)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6p^2 - 10q^2$",
      "B. $6p^2 + 11pq - 10q^2$",
      "C. $6p^2 - 11pq - 10q^2$",
      "D. $6p^2 + 19pq - 10q^2$"
    ],
    "correctAnswer": "B",
    "hint": "Use the FOIL method: $(3p)(2p) + (3p)(5q) - (2q)(2p) - (2q)(5q)$.",
    "workedSolution": "$$(3p - 2q)(2p + 5q) = 3p(2p + 5q) - 2q(2p + 5q)$$\n$$= 6p^2 + 15pq - 4pq - 10q^2 = 6p^2 + 11pq - 10q^2$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Algebraic Expansion"
  },
  {
    "number": 19,
    "id": "MOCK03_P1_Q19",
    "prompt": "The scores of seven candidates in an oral French test are $12, 18, 15, 11, 19, 14,$ and $16$. Find the interquartile range of the distribution.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $4$",
      "B. $6$",
      "C. $7$",
      "D. $8$"
    ],
    "correctAnswer": "B",
    "hint": "Arrange the numbers in ascending order, then find $Q_3 - Q_1$.",
    "workedSolution": "Arrange in ascending order:\n$$11, 12, 14, 15, 16, 18, 19$$\n- Lower quartile ($Q_1$) is the median of lower half $\\{11, 12, 14\\} \\implies Q_1 = 12$.\n- Upper quartile ($Q_3$) is the median of upper half $\\{16, 18, 19\\} \\implies Q_3 = 18$.\n$$\\text{Interquartile Range} = Q_3 - Q_1 = 18 - 12 = 6$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Statistics: Quartiles and Dispersion"
  },
  {
    "number": 20,
    "id": "MOCK03_P1_Q20",
    "prompt": "A car uses $8\\text{ litres}$ of petrol to travel $96\\text{ km}$. How many litres of petrol are required to travel $216\\text{ km}$ at the same fuel consumption rate?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $16\\text{ litres}$",
      "B. $18\\text{ litres}$",
      "C. $20\\text{ litres}$",
      "D. $24\\text{ litres}$"
    ],
    "correctAnswer": "B",
    "hint": "Find rate of travel per litre: $96 / 8 = 12\\text{ km/l}$, then divide $216$ by $12$.",
    "workedSolution": "$$\\text{Distance per litre} = \\frac{96}{8} = 12\\text{ km/litre}$$\n$$\\text{Petrol required} = \\frac{216}{12} = 18\\text{ litres}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Rates and Direct Proportion"
  },
  {
    "number": 21,
    "id": "MOCK03_P1_Q21",
    "prompt": "Which of the following points lies on the straight line $y = 3x - 4$?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(2, 2)$",
      "B. $(1, 1)$",
      "C. $(3, 4)$",
      "D. $(-1, -1)$"
    ],
    "correctAnswer": "A",
    "hint": "Substitute the $x$-coordinate into $3x - 4$ and verify if the result matches $y$.",
    "workedSolution": "Test $(2, 2)$:\n$$y = 3(2) - 4 = 6 - 4 = 2$$\nSince LHS = RHS, the point $(2, 2)$ satisfies the equation.\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Linear Relations"
  },
  {
    "number": 22,
    "id": "MOCK03_P1_Q22",
    "prompt": "The curved surface area of a cone with slant height $10\\text{ cm}$ is $110\\text{ cm}^2$. Calculate its base radius. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2.5\\text{ cm}$",
      "B. $3.5\\text{ cm}$",
      "C. $4.5\\text{ cm}$",
      "D. $7.0\\text{ cm}$"
    ],
    "correctAnswer": "B",
    "hint": "Formula for cone curved surface area is $A = \\pi r l$.",
    "workedSolution": "$$\\text{Curved surface area} = \\pi r l$$\n$$110 = \\frac{22}{7} \\times r \\times 10$$\n$$110 = \\frac{220}{7} r$$\n$$r = \\frac{110 \\times 7}{220} = \\frac{7}{2} = 3.5\\text{ cm}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Mensuration: Cones"
  },
  {
    "number": 23,
    "id": "MOCK03_P1_Q23",
    "prompt": "If $x : y = 3 : 5$ and $y : z = 4 : 7$, find the combined ratio $x : y : z$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $12 : 20 : 35$",
      "B. $3 : 4 : 7$",
      "C. $12 : 15 : 35$",
      "D. $7 : 9 : 12$"
    ],
    "correctAnswer": "A",
    "hint": "Find the LCM of the common variable $y$ (LCM of 5 and 4 is 20).",
    "workedSolution": "Harmonize the common term $y$:\n$$\\text{LCM}(5, 4) = 20$$\n$$x : y = (3 \\times 4) : (5 \\times 4) = 12 : 20$$\n$$y : z = (4 \\times 5) : (7 \\times 5) = 20 : 35$$\n$$x : y : z = 12 : 20 : 35$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Compound Ratios"
  },
  {
    "number": 24,
    "id": "MOCK03_P1_Q24",
    "prompt": "The diagram shows a triangular prism. What is the total number of faces on this prism?",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"260\" height=\"180\" viewBox=\"0 0 260 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,130 90,40 140,130\" fill=\"#38bdf8\" fill-opacity=\"0.3\" stroke=\"#0284c7\" stroke-width=\"2\"/><polygon points=\"140,130 90,40 190,60 220,140\" fill=\"#f8fafc\" fill-opacity=\"0.4\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"40\" y1=\"130\" x2=\"120\" y2=\"150\" stroke=\"#64748b\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><line x1=\"120\" y1=\"150\" x2=\"220\" y2=\"140\" stroke=\"#64748b\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><line x1=\"120\" y1=\"150\" x2=\"190\" y2=\"60\" stroke=\"#64748b\" stroke-width=\"1.5\" stroke-dasharray=\"3\"/><line x1=\"90\" y1=\"40\" x2=\"190\" y2=\"60\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"140\" y1=\"130\" x2=\"220\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"2\"/></svg>",
    "options": [
      "A. $4$",
      "B. $5$",
      "C. $6$",
      "D. $9$"
    ],
    "correctAnswer": "B",
    "hint": "Count 2 triangular base faces plus 3 rectangular side faces.",
    "workedSolution": "A triangular prism consists of $2$ triangular bases and $3$ rectangular lateral faces:\n$$\\text{Total faces} = 2 + 3 = 5$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Solid Geometry"
  },
  {
    "number": 25,
    "id": "MOCK03_P1_Q25",
    "prompt": "Find the simple interest on a loan of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,500.00$ borrowed for $3\\text{ years}$ at $8\\%$ per annum.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 400.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 500.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 600.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 750.00$"
    ],
    "correctAnswer": "C",
    "hint": "Use formula $I = \\frac{P \\times R \\times T}{100}$.",
    "workedSolution": "$$I = \\frac{P \\times R \\times T}{100} = \\frac{2,500 \\times 8 \\times 3}{100} = 25 \\times 24 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 600.00$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Simple Interest"
  },
  {
    "number": 26,
    "id": "MOCK03_P1_Q26",
    "prompt": "The image of $P(-2, 5)$ under a translation by vector $\\mathbf{v}$ is $P'(3, 1)$. Find vector $\\mathbf{v}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\begin{pmatrix} 5 \\\\ -4 \\end{pmatrix}$",
      "B. $\\begin{pmatrix} -5 \\\\ 4 \\end{pmatrix}$",
      "C. $\\begin{pmatrix} 1 \\\\ 6 \\end{pmatrix}$",
      "D. $\\begin{pmatrix} 5 \\\\ 4 \\end{pmatrix}$"
    ],
    "correctAnswer": "A",
    "hint": "Translation vector is the difference between image and object: $\\mathbf{v} = P' - P$.",
    "workedSolution": "$$\\mathbf{v} = P' - P = \\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix} - \\begin{pmatrix} -2 \\\\ 5 \\end{pmatrix} = \\begin{pmatrix} 3 - (-2) \\\\ 1 - 5 \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ -4 \\end{pmatrix}$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Translation"
  },
  {
    "number": 27,
    "id": "MOCK03_P1_Q27",
    "prompt": "Solve the simultaneous equations:\n$$2x + y = 7$$\n$$3x - 2y = 7$$\nFind the value of $xy$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2$",
      "B. $3$",
      "C. $4$",
      "D. $6$"
    ],
    "correctAnswer": "B",
    "hint": "Multiply equation 1 by 2 and add to eliminate $y$, then calculate the product $xy$.",
    "workedSolution": "Multiply equation (1) by $2$:\n$$4x + 2y = 14$$\nAdd to equation (2):\n$$(4x + 2y) + (3x - 2y) = 14 + 7$$\n$$7x = 21 \\implies x = 3$$\nSubstitute $x = 3$ into (1):\n$$2(3) + y = 7 \\implies 6 + y = 7 \\implies y = 1$$\n$$xy = 3 \\times 1 = 3$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Simultaneous Linear Equations"
  },
  {
    "number": 28,
    "id": "MOCK03_P1_Q28",
    "prompt": "In a class of $40\\text{ learners}$, $65\\%$ are girls. How many boys are in the class?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $14$",
      "B. $16$",
      "C. $24$",
      "D. $26$"
    ],
    "correctAnswer": "A",
    "hint": "Boys comprise $100\\% - 65\\% = 35\\%$ of 40.",
    "workedSolution": "$$\\text{Percentage of boys} = 100\\% - 65\\% = 35\\%$$\n$$\\text{Number of boys} = \\frac{35}{100} \\times 40 = \\frac{7}{20} \\times 40 = 14$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Percentages"
  },
  {
    "number": 29,
    "id": "MOCK03_P1_Q29",
    "prompt": "The diagram shows a right-angled triangle $ABC$ with sides $5\\text{ cm}, 12\\text{ cm},$ and $13\\text{ cm}$. Find the value of $\\tan(\\angle BAC)$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"180\" viewBox=\"0 0 280 180\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"40,140 240,140 40,40\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"40,125 55,125 55,140\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"25\" y=\"155\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">B</text><text x=\"245\" y=\"145\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">C</text><text x=\"30\" y=\"35\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">A</text><text x=\"15\" y=\"95\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">5 cm</text><text x=\"130\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">12 cm</text><text x=\"150\" y=\"80\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">13 cm</text></svg>",
    "options": [
      "A. $\\frac{5}{12}$",
      "B. $\\frac{5}{13}$",
      "C. $\\frac{12}{13}$",
      "D. $\\frac{12}{5}$"
    ],
    "correctAnswer": "D",
    "hint": "Recall $\\tan = \\frac{\\text{Opposite}}{\\text{Adjacent}}$. Looking from angle $A$, opposite is $BC = 12$ and adjacent is $AB = 5$.",
    "workedSolution": "From vertex $A$:\n$$\\text{Opposite side} = |BC| = 12\\text{ cm}$$\n$$\\text{Adjacent side} = |AB| = 5\\text{ cm}$$\n$$\\tan(\\angle BAC) = \\frac{\\text{Opposite}}{\\text{Adjacent}} = \\frac{12}{5}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Trigonometric Ratios"
  },
  {
    "number": 30,
    "id": "MOCK03_P1_Q30",
    "prompt": "Write $0.0000785$ in standard form.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $7.85 \\times 10^{-6}$",
      "B. $7.85 \\times 10^{-5}$",
      "C. $7.85 \\times 10^{-4}$",
      "D. $78.5 \\times 10^{-6}$"
    ],
    "correctAnswer": "B",
    "hint": "Standard form is $A \\times 10^n$, where $1 \\le A < 10$. Count 5 shifts to the right.",
    "workedSolution": "Shift the decimal point $5$ places to the right to obtain $7.85$:\n$$0.0000785 = 7.85 \\times 10^{-5}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Standard Form"
  },
  {
    "number": 31,
    "id": "MOCK03_P1_Q31",
    "prompt": "Find the perimeter of a semi-circular garden with diameter $28\\text{ m}$. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $44\\text{ m}$",
      "B. $58\\text{ m}$",
      "C. $72\\text{ m}$",
      "D. $88\\text{ m}$"
    ],
    "correctAnswer": "C",
    "hint": "Total perimeter is the curved half-circumference $\\pi r$ plus the straight diameter $d$.",
    "workedSolution": "$$\\text{Arc length} = \\frac{1}{2}(2\\pi r) = \\pi r = \\frac{22}{7} \\times 14 = 44\\text{ m}$$\n$$\\text{Total perimeter} = \\text{arc length} + \\text{diameter} = 44 + 28 = 72\\text{ m}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Semi-circles"
  },
  {
    "number": 32,
    "id": "MOCK03_P1_Q32",
    "prompt": "A trader allows a trade discount of $12\\%$ on wholesale goods. If a merchant pays $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,080.00$, find the catalog marked price.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,400.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,450.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,500.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,600.00$"
    ],
    "correctAnswer": "C",
    "hint": "The merchant pays $88\\%$ of the marked price: $0.88 M = 3,080$.",
    "workedSolution": "$$\\text{Net paid} = (100\\% - 12\\%) \\text{ of Marked Price} = 88\\%$$\n$$0.88M = 3,080.00$$\n$$M = \\frac{3,080}{0.88} = \\frac{308,000}{88} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,500.00$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Discount"
  },
  {
    "number": 33,
    "id": "MOCK03_P1_Q33",
    "prompt": "Factorize completely: $2a^2 - 8b^2$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2(a - 2b)^2$",
      "B. $2(a - 4b)(a + 4b)$",
      "C. $2(a - 2b)(a + 2b)$",
      "D. $(2a - 4b)(a + 2b)$"
    ],
    "correctAnswer": "C",
    "hint": "Factor out the common factor 2 first, then apply the difference of two squares $a^2 - (2b)^2$.",
    "workedSolution": "Factor out common factor $2$ first:\n$$2a^2 - 8b^2 = 2(a^2 - 4b^2)$$\nApply difference of two squares:\n$$= 2(a - 2b)(a + 2b)$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Algebraic Factorization"
  },
  {
    "number": 34,
    "id": "MOCK03_P1_Q34",
    "prompt": "The mean of the numbers $8, 12, 16, 20,$ and $y$ is $15$. Find the value of $y$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $15$",
      "B. $17$",
      "C. $19$",
      "D. $21$"
    ],
    "correctAnswer": "C",
    "hint": "The sum of the 5 numbers is $5 \\times 15 = 75$. Subtract the known sum.",
    "workedSolution": "$$\\text{Sum} = 5 \\times 15 = 75$$\n$$8 + 12 + 16 + 20 + y = 75$$\n$$56 + y = 75 \\implies y = 75 - 56 = 19$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Statistics: Mean"
  },
  {
    "number": 35,
    "id": "MOCK03_P1_Q35",
    "prompt": "If $x = -2$ and $y = 3$, evaluate $\\frac{3x^2 - 2y}{xy + 10}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1.5$",
      "B. $2.0$",
      "C. $2.5$",
      "D. $3.0$"
    ],
    "correctAnswer": "A",
    "hint": "Compute numerator $3(-2)^2 - 2(3) = 12 - 6 = 6$ and denominator $(-2)(3) + 10 = 4$.",
    "workedSolution": "$$\\text{Numerator} = 3(-2)^2 - 2(3) = 3(4) - 6 = 12 - 6 = 6$$\n$$\\text{Denominator} = (-2)(3) + 10 = -6 + 10 = 4$$\n$$\\text{Value} = \\frac{6}{4} = 1.5$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Substitution"
  },
  {
    "number": 36,
    "id": "MOCK03_P1_Q36",
    "prompt": "A map has a representative fraction of $1 : 50,000$. A straight road measures $7\\text{ cm}$ on the map. Find the true length of the road in kilometres.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $0.35\\text{ km}$",
      "B. $3.5\\text{ km}$",
      "C. $35.0\\text{ km}$",
      "D. $350\\text{ km}$"
    ],
    "correctAnswer": "B",
    "hint": "Multiply $7$ by $50,000$ to get $350,000\\text{ cm}$. Divide by $100$ for metres, then $1000$ for km.",
    "workedSolution": "$$\\text{Actual length} = 7 \\times 50,000\\text{ cm} = 350,000\\text{ cm}$$\nConvert to metres: $3,500\\text{ m}$.\nConvert to kilometres: $3.5\\text{ km}$.\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Scale Drawing and Ratios"
  },
  {
    "number": 37,
    "id": "MOCK03_P1_Q37",
    "prompt": "Solve the linear equation: $\\frac{3y - 1}{5} - \\frac{y - 2}{3} = 1$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $-2$",
      "B. $-1$",
      "C. $1$",
      "D. $2$"
    ],
    "correctAnswer": "D",
    "hint": "Multiply every term by $\\text{LCM}(5, 3) = 15$ to clear the fractions.",
    "workedSolution": "Multiply through by $\\text{LCM}(5, 3) = 15$:\n$$3(3y - 1) - 5(y - 2) = 15(1)$$\n$$9y - 3 - 5y + 10 = 15$$\n$$4y + 7 = 15$$\n$$4y = 8 \\implies y = 2$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Linear Equations"
  },
  {
    "number": 38,
    "id": "MOCK03_P1_Q38",
    "prompt": "The diagram shows a sector with central angle $120^\\circ$ and radius $6\\text{ cm}$. Find the area of the sector in terms of $\\pi$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"220\" height=\"200\" viewBox=\"0 0 220 200\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M 110 110 L 190 110 A 80 80 0 0 1 70 179 Z\" fill=\"#10b981\" fill-opacity=\"0.2\" stroke=\"#059669\" stroke-width=\"2\"/><path d=\"M 140 110 A 30 30 0 0 1 95 136\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"2\"/><text x=\"135\" y=\"140\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">120°</text><circle cx=\"110\" cy=\"110\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"100\" y=\"100\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">O</text><text x=\"145\" y=\"105\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">6 cm</text></svg>",
    "options": [
      "A. $6\\pi\\text{ cm}^2$",
      "B. $12\\pi\\text{ cm}^2$",
      "C. $18\\pi\\text{ cm}^2$",
      "D. $24\\pi\\text{ cm}^2$"
    ],
    "correctAnswer": "B",
    "hint": "Sector area formula is $\\frac{\\theta}{360^\\circ} \\times \\pi r^2$. Notice $\\frac{120}{360} = \\frac{1}{3}$.",
    "workedSolution": "$$\\text{Area} = \\frac{\\theta}{360^\\circ} \\times \\pi r^2 = \\frac{120^\\circ}{360^\\circ} \\times \\pi (6^2) = \\frac{1}{3} \\times 36\\pi = 12\\pi\\text{ cm}^2$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Mensuration: Area of Sector"
  },
  {
    "number": 39,
    "id": "MOCK03_P1_Q39",
    "prompt": "A fair spinner has four equal sectors numbered $1, 2, 3,$ and $4$. If spun twice, what is the probability that both spins yield the same number?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{1}{16}$",
      "B. $\\frac{1}{8}$",
      "C. $\\frac{1}{4}$",
      "D. $\\frac{1}{2}$"
    ],
    "correctAnswer": "C",
    "hint": "Total outcomes is $4 \\times 4 = 16$. Favourable matching outcomes are $(1,1), (2,2), (3,3), (4,4)$.",
    "workedSolution": "Total outcomes $= 4 \\times 4 = 16$.\nMatching pairs: $\\{(1,1), (2,2), (3,3), (4,4)\\} \\implies n(E) = 4$.\n$$P = \\frac{4}{16} = \\frac{1}{4}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 40,
    "id": "MOCK03_P1_Q40",
    "prompt": "Solve for $m$ in the linear relation: $5m - (2m - 4) = 19$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3$",
      "B. $4$",
      "C. $5$",
      "D. $7$"
    ],
    "correctAnswer": "C",
    "hint": "Distribute the negative sign carefully: $-(2m - 4) = -2m + 4$.",
    "workedSolution": "$$5m - 2m + 4 = 19$$\n$$3m + 4 = 19$$\n$$3m = 15 \\implies m = 5$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Linear Equations"
  }
];

export const SET_BECE_MOCK_3_MATH_P1: CurriculumQuestionSet = {
  id: "math_mock_3",
  title: "BECE Mathematics National Mock 3 (Paper 1 Objective CBT)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 3 Paper 1",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_03/paper_1",
  questions: allRawMathMock3Questions.map((q) => ({
    id: `math_m3_q${q.number}`,
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
export const rawMathMock3Paper2Questions = [
  {
    "questionNumber": 1,
    "id": "MOCK03_P2_Q01",
    "marks": 15,
    "topic": "Sets, Linear Inequalities, and Number Line Representations",
    "subQuestions": [
      {
        "part": "a",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"380\" height=\"240\" viewBox=\"0 0 380 240\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"10\" width=\"360\" height=\"220\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"35\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 84</text><circle cx=\"145\" cy=\"125\" r=\"72\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"235\" cy=\"125\" r=\"72\" fill=\"#a855f7\" fill-opacity=\"0.2\" stroke=\"#7e22ce\" stroke-width=\"2\"/><text x=\"105\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">A (Arabic)</text><text x=\"240\" y=\"65\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#6b21a8\">F (French)</text><text x=\"105\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">36</text><text x=\"182\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">16</text><text x=\"255\" y=\"130\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">24</text><text x=\"315\" y=\"205\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">8</text></svg>",
        "questionText": "In a school of $84\\text{ learners}$, $52$ study Arabic ($A$), $40$ study French ($F$), and $16$ study both languages. The rest study neither of the two languages.\n(i) Illustrate the information on a Venn diagram.\n(ii) How many learners study:\n    $(\\alpha)$ Arabic only;\n    $(\\beta)$ French only;\n    $(\\gamma)$ neither Arabic nor French?",
        "workedSolution": "**(i) Venn Diagram Setup:**\nLet universal set $n(U) = 84$.\n- Arabic: $n(A) = 52$\n- French: $n(F) = 40$\n- Intersection (both): $n(A \\cap F) = 16$\n\nRegion Breakdown:\n- Arabic only: $n(A \\cap F') = 52 - 16 = 36$\n- French only: $n(A' \\cap F) = 40 - 16 = 24$\n- Neither language: $n(A \\cup F)' = 84 - (36 + 16 + 24) = 84 - 76 = 8$\n\n*(See the embedded SVG above for the complete, labeled illustration)*.\n\n---\n\n**(ii) ($\\alpha$) Learners studying Arabic only:**\n$n(A \\cap F') = 52 - 16 = 36$\nTherefore, **$36\\text{ learners}$ study Arabic only**.\n\n---\n\n**(ii) ($\\beta$) Learners studying French only:**\n$n(A' \\cap F) = 40 - 16 = 24$\nTherefore, **$24\\text{ learners}$ study French only**.\n\n---\n\n**(ii) ($\\gamma$) Learners studying neither language:**\n$n(A \\cup F)' = 84 - 76 = 8$\nTherefore, **$8\\text{ learners}$ study neither language**."
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"80\" viewBox=\"0 0 360 80\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"20\" y1=\"40\" x2=\"340\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"35\" x2=\"60\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"35\" x2=\"120\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"35\" x2=\"180\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"35\" x2=\"240\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"300\" y1=\"35\" x2=\"300\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"55\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">0</text><text x=\"117\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">1</text><text x=\"177\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">2</text><text x=\"237\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">3</text><text x=\"297\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">4</text><circle cx=\"177\" cy=\"25\" r=\"5\" fill=\"#0284c7\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><line x1=\"177\" y1=\"25\" x2=\"340\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"3\"/><polygon points=\"335,20 345,25 335,30\" fill=\"#0284c7\"/></svg>",
        "questionText": "(i) Solve the inequality: $\\frac{3x - 1}{4} - \\frac{x - 3}{2} \\le 1$.\n(ii) Illustrate the solution on a number line.",
        "workedSolution": "**(i) Solving the inequality:**\n$\\frac{3x - 1}{4} - \\frac{x - 3}{2} \\le 1$\nMultiply through by the LCM of $4$ and $2$, which is $4$:\n$4\\left(\\frac{3x - 1}{4}\\right) - 4\\left(\\frac{x - 3}{2}\\right) \\le 4(1)$\n$(3x - 1) - 2(x - 3) \\le 4$\n$3x - 1 - 2x + 6 \\le 4$\n$x + 5 \\le 4$\n$x \\le 4 - 5 \\implies x \\le -1$\n\n*(Truth set: $\\{x : x \\le -1\\}$)*.\n\n---\n\n**(ii) Number Line Representation:**\nDraw a horizontal number line with a solid (filled) circle at $-1$ and a continuous ray extending leftward toward negative infinity."
      }
    ]
  },
  {
    "questionNumber": 2,
    "id": "MOCK03_P2_Q02",
    "marks": 15,
    "topic": "Financial Partnerships, Wages, and Depreciation",
    "subQuestions": [
      {
        "part": "a",
        "marks": 9,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "Kofi and Ama invested $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 18,000.00$ and $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12,000.00$ respectively in a poultry farm. They agreed that Ama should receive $15\\%$ of the annual net profit as manager, and the remaining profit shared in the ratio of their capital contributions. At the end of the year, the farm made a net profit of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 40,000.00$.\n(i) How much did Ama receive as managerial allowance?\n(ii) How much profit was shared according to capital contributions?\n(iii) Calculate the total amount received by Ama.",
        "workedSolution": "**(i) Ama's managerial allowance:**\n$\\text{Allowance} = \\frac{15}{100} \\times 40,000.00 = 15 \\times 400.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$\n\nTherefore, Ama received **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$** as manager.\n\n---\n\n**(ii) Remaining profit to share:**\n$\\text{Remaining profit} = 40,000.00 - 6,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 34,000.00$\n\nTherefore, **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 34,000.00$** was shared according to capital contributions.\n\n---\n\n**(iii) Total amount received by Ama:**\nCapital ratio $\\text{Kofi} : \\text{Ama} = 18,000 : 12,000 = 3 : 2$\n$\\text{Total parts} = 3 + 2 = 5$\n$\\text{Ama's share of remaining profit} = \\frac{2}{5} \\times 34,000.00 = 2 \\times 6,800.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 13,600.00$\n$\\text{Total for Ama} = 6,000.00 + 13,600.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 19,600.00$\n\nTherefore, Ama received a total of **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 19,600.00$**."
      },
      {
        "part": "b",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A commercial corn-mill machine bought for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 8,000.00$ depreciates at a rate of $10\\%$ per annum on its value at the beginning of each year. Calculate the value of the machine at the end of $2\\text{ years}$.",
        "workedSolution": "**Year 1:**\n$\\text{Depreciation} = \\frac{10}{100} \\times 8,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 800.00$\n$\\text{Value at end of Year 1} = 8,000.00 - 800.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 7,200.00$\n\n**Year 2:**\n$\\text{Depreciation} = \\frac{10}{100} \\times 7,200.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 720.00$\n$\\text{Value at end of Year 2} = 7,200.00 - 720.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,480.00$\n\n*(Alternatively: $8,000(1 - 0.10)^2 = 8,000(0.81) = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,480.00$)*.\n\nTherefore, the value of the machine at the end of two years is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,480.00$**."
      }
    ]
  },
  {
    "questionNumber": 3,
    "id": "MOCK03_P2_Q03",
    "marks": 15,
    "topic": "Plane and Solid Geometry: Right-Angled Triangles and Hollow Cylinders",
    "subQuestions": [
      {
        "part": "a",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"220\" viewBox=\"0 0 360 220\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"50,180 310,180 170,50\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"170\" y1=\"50\" x2=\"170\" y2=\"180\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><polyline points=\"170,165 185,165 185,180\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><text x=\"165\" y=\"38\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"35\" y=\"190\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Q</text><text x=\"315\" y=\"190\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">R</text><text x=\"165\" y=\"200\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">S</text><text x=\"95\" y=\"110\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">17 cm</text><text x=\"245\" y=\"110\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">25 cm</text><text x=\"178\" y=\"120\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">15 cm</text><text x=\"110\" y=\"215\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
        "questionText": "In the diagram, $|PQ| = 17\\text{ cm}, |PR| = 25\\text{ cm}, |PS| = 15\\text{ cm},$ and line segment $PS$ is perpendicular to base $QR$ ($PS \\perp QR$). Calculate the:\n(i) length of segment $QS$;\n(ii) length of segment $SR$;\n(iii) area of triangle $PQR$.",
        "workedSolution": "**(i) Finding length $|QS|$:**\nIn right-angled triangle $\\triangle PSQ$, by Pythagoras' Theorem:\n$|PQ|^2 = |QS|^2 + |PS|^2$\n$17^2 = |QS|^2 + 15^2$\n$289 = |QS|^2 + 225$\n$|QS|^2 = 289 - 225 = 64$\n$|QS| = \\sqrt{64} = 8\\text{ cm}$\n\nTherefore, **$|QS| = 8\\text{ cm}$**.\n\n---\n\n**(ii) Finding length $|SR|$:**\nIn right-angled triangle $\\triangle PSR$, by Pythagoras' Theorem:\n$|PR|^2 = |SR|^2 + |PS|^2$\n$25^2 = |SR|^2 + 15^2$\n$625 = |SR|^2 + 225$\n$|SR|^2 = 625 - 225 = 400$\n$|SR| = \\sqrt{400} = 20\\text{ cm}$\n\nTherefore, **$|SR| = 20\\text{ cm}$**.\n\n---\n\n**(iii) Area of triangle $PQR$:**\n$\\text{Base } |QR| = |QS| + |SR| = 8 + 20 = 28\\text{ cm}$\n$\\text{Height } |PS| = 15\\text{ cm}$\n$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 28 \\times 15 = 14 \\times 15 = 210\\text{ cm}^2$\n\nTherefore, the area of triangle $PQR$ is **$210\\text{ cm}^2$**."
      },
      {
        "part": "b",
        "marks": 8,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A hollow metal pipe of length $20\\text{ cm}$ has an external radius of $5\\text{ cm}$ and an internal radius of $4\\text{ cm}$. Calculate the:\n(i) volume of metal used in making the pipe;\n(ii) total surface area (both curved surfaces and ends) of the pipe. $\\left[\\text{Take } \\pi = 3.142\\right]$",
        "workedSolution": "**(i) Volume of metal:**\n$V = \\pi (R^2 - r^2)h$\nWhere $R = 5\\text{ cm}, r = 4\\text{ cm}, h = 20\\text{ cm}$:\n$R^2 - r^2 = 5^2 - 4^2 = 25 - 16 = 9\\text{ cm}^2$\n$V = 3.142 \\times 9 \\times 20 = 3.142 \\times 180 = 565.56\\text{ cm}^3$\n\nTherefore, the volume of metal is **$565.6\\text{ cm}^3$**.\n\n---\n\n**(ii) Total Surface Area:**\n$\\text{TSA} = \\text{External Curved} + \\text{Internal Curved} + 2(\\text{End Ring Area})$\n$\\text{TSA} = 2\\pi R h + 2\\pi r h + 2\\pi (R^2 - r^2) = 2\\pi \\big[h(R + r) + (R^2 - r^2)\\big]$\n$h(R + r) = 20(5 + 4) = 20(9) = 180$\n$R^2 - r^2 = 9$\n$\\text{TSA} = 2 \\times 3.142 \\times (180 + 9) = 6.284 \\times 189 = 1,187.676\\text{ cm}^2$\n\nTherefore, the total surface area is **$1,187.7\\text{ cm}^2$**."
      }
    ]
  },
  {
    "questionNumber": 4,
    "id": "MOCK03_P2_Q04",
    "marks": 15,
    "topic": "Geometric Compass Construction: Trapezium and Angle Measurement",
    "subQuestions": [
      {
        "part": "a",
        "marks": 10,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"420\" height=\"280\" viewBox=\"0 0 420 280\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"420\" height=\"280\" fill=\"#ffffff\"/><polygon points=\"60,220 360,220 280,100 140,100\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"60\" y1=\"220\" x2=\"140\" y2=\"100\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"140\" y1=\"100\" x2=\"280\" y2=\"100\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"280\" y1=\"100\" x2=\"360\" y2=\"220\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"140\" y1=\"100\" x2=\"140\" y2=\"220\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.5\"/><polyline points=\"140,205 155,205 155,220\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><path d=\"M 105 220 A 45 45 0 0 0 85 182\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><text x=\"95\" y=\"208\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">60°</text><text x=\"45\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"370\" y=\"235\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"285\" y=\"90\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"130\" y=\"90\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">D</text><text x=\"205\" y=\"240\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">10 cm</text><text x=\"205\" y=\"90\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">5 cm</text><text x=\"80\" y=\"150\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">6 cm</text></svg>",
        "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct the base line segment $|AB| = 10.0\\text{ cm}$;\n(ii) At vertex $A$, construct an angle $\\angle DAB = 60^\\circ$ such that side $|AD| = 6.0\\text{ cm}$;\n(iii) Through point $D$, construct a line parallel to $AB$;\n(iv) On this parallel line, locate point $C$ such that $|DC| = 5.0\\text{ cm}$ and join $C$ to $B$ to complete the trapezium $ABCD$.",
        "workedSolution": "**Construction Protocol:**\n1. **Base Line $|AB| = 10.0\\text{ cm}$:**\n   - Draw a horizontal pencil line and mark point $A$.\n   - Set compasses to $10.0\\text{ cm}$, place needle at $A$, and cut the line to fix $B$.\n2. **Construct $\\angle DAB = 60^\\circ$ and Side $AD$:**\n   - With needle at $A$, strike an arc crossing $AB$. From that intersection, cut the arc to establish the $60^\\circ$ ray.\n   - Set compasses to $6.0\\text{ cm}$, place needle at $A$, and cut the ray to fix vertex $D$.\n3. **Parallel Line through $D$:**\n   - At point $D$, construct an angle of $120^\\circ$ with $AD$ (interior allied angles sum to $180^\\circ$, or construct alternate $60^\\circ$ angle with transversal $AD$).\n   - Draw a straight parallel line through $D$ running towards the right.\n4. **Locating $C$ and Completing $ABCD$:**\n   - Set compasses to $5.0\\text{ cm}$, place needle at $D$, and cut the parallel line to fix vertex $C$.\n   - Rule a straight line connecting $C$ to $B$."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your completed construction in (a):\n(i) Measure the length of side $|BC|$;\n(ii) Measure the interior angle $\\angle ABC$;\n(iii) Calculate the perpendicular distance between the parallel lines $AB$ and $DC$.",
        "workedSolution": "**(i) Measuring length $|BC|$:**\n- Perpendicular height $h = |AD| \\sin 60^\\circ = 6 \\times 0.8660 = 5.196\\text{ cm} \\approx 5.2\\text{ cm}$\n- Horizontal projection of $AD = 6 \\cos 60^\\circ = 3.0\\text{ cm}$\n- Baseline remaining for triangle at $B = 10 - (3 + 5) = 2.0\\text{ cm}$\n- $|BC| = \\sqrt{5.2^2 + 2.0^2} = \\sqrt{27.04 + 4} = \\sqrt{31.04} \\approx 5.57\\text{ cm}$\n$\\mathbf{|BC| \\approx 5.6\\text{ cm} \\pm 0.1\\text{ cm}}$\n\n---\n\n**(ii) Measuring angle $\\angle ABC$:**\n$\\tan(\\angle ABC) = \\frac{5.196}{2.0} = 2.598 \\implies \\angle ABC = \\arctan(2.598) \\approx 68.9^\\circ$\n$\\mathbf{\\angle ABC \\approx 69^\\circ \\pm 1^\\circ}$\n\n---\n\n**(iii) Perpendicular distance between $AB$ and $DC$ ($h$):**\n$h = 6.0 \\times \\sin 60^\\circ = 6.0 \\times 0.866 = 5.2\\text{ cm}$\n$\\mathbf{h \\approx 5.2\\text{ cm}}$"
      }
    ]
  },
  {
    "questionNumber": 5,
    "id": "MOCK03_P2_Q05",
    "marks": 15,
    "topic": "Stem-and-Leaf Representation and Discrete Probability",
    "subQuestions": [
      {
        "part": "a",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The following scores were obtained by $28\\text{ candidates}$ in a nationwide science screening test:\n$42, 65, 58, 71, 39, 48, 52, 66, 74, 55, 63, 49, 38, 59, 68, 77, 45, 51, 62, 70, 44, 56, 69, 75, 41, 53, 67, 50$\nConstruct an ordered stem-and-leaf plot to represent the distribution.",
        "workedSolution": "**Stem-and-Leaf Construction Protocol:**\n- Stems represent tens digits ($3, 4, 5, 6, 7$).\n- Leaves represent units digits arranged in ascending order:\n\n$\\begin{array}{r|l} \\text{Stem} & \\text{Leaves} \\\\ \\hline 3 & 8, 9 \\\\ 4 & 1, 2, 4, 5, 8, 9 \\\\ 5 & 0, 1, 2, 3, 5, 6, 8, 9 \\\\ 6 & 2, 3, 5, 6, 7, 8, 9 \\\\ 7 & 0, 1, 4, 5, 7 \\end{array}$\n\n**Neat Display:**\n- **Stem 3:** $8, 9$ ($2$ leaves)\n- **Stem 4:** $1, 2, 4, 5, 8, 9$ ($6$ leaves)\n- **Stem 5:** $0, 1, 2, 3, 5, 6, 8, 9$ ($8$ leaves)\n- **Stem 6:** $2, 3, 5, 6, 7, 8, 9$ ($7$ leaves)\n- **Stem 7:** $0, 1, 4, 5, 7$ ($5$ leaves)\n\n$\\text{Key: } 5 \\mid 2 = 52\\text{ marks}$\n$\\text{Total observations } n = 2 + 6 + 8 + 7 + 5 = 28$"
      },
      {
        "part": "b",
        "marks": 4,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your stem-and-leaf plot in (a), determine the:\n(i) median score;\n(ii) modal score.",
        "workedSolution": "**(i) Median score:**\nSince $n = 28$ is even, the median is the average of the 14th and 15th values:\n- Counting through the ordered leaves:\n  - 14th value $= 56$\n  - 15th value $= 58$\n$\\text{Median} = \\frac{56 + 58}{2} = 57$\n\nTherefore, the median score is **$57$**.\n\n---\n\n**(ii) Modal score:**\nEvery leaf in the distribution occurs with frequency $1$. There is no single repeated score.\n\nTherefore, **there is no mode (multimodal / uniform distribution)**."
      },
      {
        "part": "c",
        "marks": 4,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "If a candidate is selected at random from the group, find the probability that the candidate scored:\n(i) at least $65\\text{ marks}$;\n(ii) strictly less than $50\\text{ marks}$.",
        "workedSolution": "**(i) Probability of scoring at least 65 ($x \\ge 65$):**\nQualifying values:\n- Stem 6: $65, 66, 67, 68, 69$ ($5$ scores)\n- Stem 7: $70, 71, 74, 75, 77$ ($5$ scores)\n$n(x \\ge 65) = 5 + 5 = 10$\n$P(x \\ge 65) = \\frac{10}{28} = \\frac{5}{14}$\n\nTherefore, the probability is **$\\frac{5}{14}$**.\n\n---\n\n**(ii) Probability of scoring strictly less than 50 ($x < 50$):**\nQualifying values are all on stems $3$ and $4$:\n$n(x < 50) = 2 + 6 = 8$\n$P(x < 50) = \\frac{8}{28} = \\frac{2}{7}$\n\nTherefore, the probability is **$\\frac{2}{7}$**."
      }
    ]
  },
  {
    "questionNumber": 6,
    "id": "MOCK03_P2_Q06",
    "marks": 15,
    "topic": "Linear Relations, Table of Values, and Coordinate Graphing",
    "subQuestions": [
      {
        "part": "a",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "(i) Copy and complete the table of values for the relation $y = 3x - 2$ for the domain $-2 \\le x \\le 4$.\n\n| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y = 3x - 2$ | | $-5$ | | $1$ | | $7$ | |\n\n(ii) State the gradient (slope) and $y$-intercept of the relation.",
        "workedSolution": "**(i) Completed Table:**\nEvaluate $y = 3x - 2$:\n- $x = -2: y = 3(-2) - 2 = -6 - 2 = -8$\n- $x = -1: y = 3(-1) - 2 = -5$\n- $x = 0: y = 3(0) - 2 = -2$\n- $x = 1: y = 3(1) - 2 = 1$\n- $x = 2: y = 3(2) - 2 = 4$\n- $x = 3: y = 3(3) - 2 = 7$\n- $x = 4: y = 3(4) - 2 = 10$\n\n| $x$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ | $4$ |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y$ | **$-8$** | $-5$ | **$-2$** | $1$ | **$4$** | $7$ | **$10$** |\n\n---\n\n**(ii) Gradient and $y$-intercept:**\n- Gradient ($m$) $= 3$\n- $y$-intercept ($c$) $= -2$"
      },
      {
        "part": "b",
        "marks": 7,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"380\" viewBox=\"0 0 400 380\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"380\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"gridMK3\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"380\" fill=\"url(#gridMK3)\"/><line x1=\"20\" y1=\"200\" x2=\"380\" y2=\"200\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"160\" y1=\"20\" x2=\"160\" y2=\"360\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"385\" y=\"205\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"165\" y=\"25\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><line x1=\"80\" y1=\"320\" x2=\"320\" y2=\"50\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"80\" cy=\"320\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"120\" cy=\"275\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"160\" cy=\"230\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"200\" cy=\"185\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"240\" cy=\"140\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"280\" cy=\"95\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"320\" cy=\"50\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"260\" y=\"80\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">y = 3x - 2</text></svg>",
        "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on the $x$-axis and $2\\text{ cm}$ to $2\\text{ units}$ on the $y$-axis, draw two perpendicular axes $Ox$ and $Oy$ for $-3 \\le x \\le 5$ and $-10 \\le y \\le 12$.\nPlot the ordered pairs $(x, y)$ from your table and draw a continuous straight line through them.",
        "workedSolution": "**Graphing Procedure:**\n1. Calibrate axes with proper scaling.\n2. Plot the points: $(-2, -8), (-1, -5), (0, -2), (1, 1), (2, 4), (3, 7), (4, 10)$.\n3. Connect with a clear, straight ruled line across the entire grid.\n4. Label the line $y = 3x - 2$."
      },
      {
        "part": "c",
        "marks": 3,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "From your graph, find the:\n(i) value of $y$ when $x = 2.5$;\n(ii) value of $x$ when $y = 0$ ($x$-intercept).",
        "workedSolution": "**(i) Finding $y$ when $x = 2.5$:**\nFrom the graph, trace vertically up from $x = 2.5$ to the line, then horizontally to the $y$-axis:\n$y = 3(2.5) - 2 = 7.5 - 2 = 5.5$\nFrom graph reading: **$y = 5.5$ (tolerance $\\pm 0.1$)**.\n\n---\n\n**(ii) Finding $x$ when $y = 0$ ($x$-intercept):**\nTrace where the line crosses the horizontal $x$-axis:\n$0 = 3x - 2 \\implies 3x = 2 \\implies x = \\frac{2}{3} \\approx 0.67$\nFrom graph reading: **$x \\approx 0.7$ (tolerance $\\pm 0.1$)**."
      }
    ]
  }
];
export const allRawMathMock3TheoryQuestions = rawMathMock3Paper2Questions;

export const SET_BECE_MOCK_3_MATH_P2: CurriculumQuestionSet = {
  id: "math_mock_3_p2",
  title: "BECE Mathematics National Mock 3 (Paper 2 Theory & Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Mathematics Mock Suite • Mock 3 Paper 2",
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_03/paper_2",
  theoryTopicList: [
    { id: "q1", questionNumber: 1, theoryIndex: 1, title: "Sets, Venn Diagrams & Inequalities", category: "Sets & Inequalities" },
    { id: "q2", questionNumber: 2, theoryIndex: 2, title: "Partnerships, Wages & Depreciation", category: "Commercial Arithmetic" },
    { id: "q3", questionNumber: 3, theoryIndex: 3, title: "Right Triangles & Hollow Cylinders", category: "Mensuration & Geometry" },
    { id: "q4", questionNumber: 4, theoryIndex: 4, title: "Compass Construction: Trapezium", category: "Compass Construction" },
    { id: "q5", questionNumber: 5, theoryIndex: 5, title: "Stem-and-Leaf & Discrete Probability", category: "Statistics & Probability" },
    { id: "q6", questionNumber: 6, theoryIndex: 6, title: "Linear Relations & Coordinate Graphing", category: "Algebra & Coordinate Geometry" }
  ],
  questions: rawMathMock3Paper2Questions.map((q) => {
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
export const SET_BECE_MOCK_3_MATH_COMPLETE = {
  mockExamNumber: 3,
  subject: "Mathematics",
  examType: "BECE Mathematics National Standard Mock 3",
  academicYear: 2026,
  paper1: SET_BECE_MOCK_3_MATH_P1,
  paper2: SET_BECE_MOCK_3_MATH_P2,
  totalMarks: 100,
  unifiedTimeMinutes: 120
};
