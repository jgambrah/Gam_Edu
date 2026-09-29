/**
 * JHS Curriculum Data - BECE Mathematics National Mock 1
 * Standardized Isomorphic Examination Suite (Paper 1 CBT + Paper 2 Theory)
 *
 * Proprietary Content © GAM IT Solutions (GAM EDU). All rights reserved.
 * Curriculum Alignment: NaCCA JHS Common Core Programme / WAEC Standards
 */

import { CurriculumQuestionSet } from '../types';

export interface MathMockObjectiveQuestion {
  id?: string;
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
    "id": "MOCK01_P1_Q01",
    "prompt": "Which of the following describes a finite set?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\{x : x \\text{ is a prime factor of } 210\\}$",
      "B. $\\{2, 3, 5, 7, 11, \\dots\\}$",
      "C. $\\{x : x \\text{ is an integer multiple of } 7\\}$",
      "D. $\\{1, 4, 9, 16, 25, \\dots\\}$"
    ],
    "correctAnswer": "A",
    "hint": "Recall that a finite set has a countable, bounded number of elements.",
    "workedSolution": "A finite set contains a countable, bounded number of elements. The prime factors of $210$ are $\\{2, 3, 5, 7\\}$, which has exactly $4$ elements. All other sets contain an infinite number of members.\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Sets and Operations on Sets"
  },
  {
    "number": 2,
    "id": "MOCK01_P1_Q02",
    "prompt": "If set $X = \\{a, b, c, d\\}$, find the total number of proper subsets of $X$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $16$",
      "B. $8$",
      "C. $14$",
      "D. $15$"
    ],
    "correctAnswer": "D",
    "hint": "The number of proper subsets excludes the set itself: $2^n - 1$.",
    "workedSolution": "The total number of subsets of a set with $n$ elements is $2^n$. The number of proper subsets excludes the set itself and is given by $2^n - 1$:\n$$2^4 - 1 = 16 - 1 = 15$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Sets and Subsets"
  },
  {
    "number": 3,
    "id": "MOCK01_P1_Q03",
    "prompt": "The Venn diagram shows the number of learners who study French ($F$) and/or Twi ($T$) in a class of $45$ learners. Find the number of learners who study Twi.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"360\" height=\"200\" viewBox=\"0 0 360 200\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"10\" y=\"10\" width=\"340\" height=\"180\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"32\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 45</text><circle cx=\"135\" cy=\"105\" r=\"65\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"225\" cy=\"105\" r=\"65\" fill=\"#a855f7\" fill-opacity=\"0.2\" stroke=\"#7e22ce\" stroke-width=\"2\"/><text x=\"110\" y=\"55\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">F</text><text x=\"235\" y=\"55\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#6b21a8\">T</text><text x=\"105\" y=\"110\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">19</text><text x=\"175\" y=\"110\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">8</text><text x=\"245\" y=\"110\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">13</text><text x=\"300\" y=\"175\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">5</text></svg>",
    "options": [
      "A. $13$",
      "B. $21$",
      "C. $27$",
      "D. $32$"
    ],
    "correctAnswer": "B",
    "hint": "Include both learners studying Twi only and those studying both subjects.",
    "workedSolution": "The total number of learners studying Twi includes both those in the Twi-only region and the intersection:\n$$n(T) = 13 + 8 = 21$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Sets and Venn Diagrams"
  },
  {
    "number": 4,
    "id": "MOCK01_P1_Q04",
    "prompt": "Using the Venn diagram in Question 3, find the number of learners who study French only.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $19$",
      "B. $27$",
      "C. $8$",
      "D. $13$"
    ],
    "correctAnswer": "A",
    "hint": "Find the region representing French only: F ∩ T'.",
    "workedSolution": "The region $F \\cap T'$ represents learners studying French only, which is $19$.\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Sets and Venn Diagrams"
  },
  {
    "number": 5,
    "id": "MOCK01_P1_Q05",
    "prompt": "Evaluate: $-18 - (-25) + (-12)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $-31$",
      "B. $-19$",
      "C. $5$",
      "D. $-5$"
    ],
    "correctAnswer": "D",
    "hint": "Remember that subtracting a negative number is equivalent to addition: -(-25) = +25.",
    "workedSolution": "$$-18 - (-25) + (-12) = -18 + 25 - 12 = 7 - 12 = -5$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Operations on Integers"
  },
  {
    "number": 6,
    "id": "MOCK01_P1_Q06",
    "prompt": "Express $180$ as a product of prime factors in index notation.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $2^2 \\times 3^2 \\times 5$",
      "B. $2^2 \\times 3 \\times 5^2$",
      "C. $2^3 \\times 3^2 \\times 5$",
      "D. $2 \\times 3^2 \\times 5^2$"
    ],
    "correctAnswer": "A",
    "hint": "Divide 180 successively by prime numbers 2, 3, and 5.",
    "workedSolution": "$$180 = 2 \\times 90 = 2^2 \\times 45 = 2^2 \\times 3^2 \\times 5$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Prime Factorization"
  },
  {
    "number": 7,
    "id": "MOCK01_P1_Q07",
    "prompt": "Find the least common multiple (LCM) of $14, 21,$ and $28$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $84$",
      "B. $56$",
      "C. $42$",
      "D. $168$"
    ],
    "correctAnswer": "A",
    "hint": "Express each number in prime factors and take the highest power of each prime.",
    "workedSolution": "$$14 = 2 \\times 7, \\quad 21 = 3 \\times 7, \\quad 28 = 2^2 \\times 7$$\n$$\\text{LCM} = 2^2 \\times 3 \\times 7 = 4 \\times 21 = 84$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Number Theory and LCM"
  },
  {
    "number": 8,
    "id": "MOCK01_P1_Q08",
    "prompt": "Convert $431_5$ to a base ten numeral.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $106$",
      "B. $126$",
      "C. $121$",
      "D. $116$"
    ],
    "correctAnswer": "D",
    "hint": "Expand using powers of 5: 4(5^2) + 3(5^1) + 1(5^0).",
    "workedSolution": "$$431_5 = (4 \\times 5^2) + (3 \\times 5^1) + (1 \\times 5^0) = (4 \\times 25) + (3 \\times 5) + 1 = 100 + 15 + 1 = 116_{10}$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Number Bases"
  },
  {
    "number": 9,
    "id": "MOCK01_P1_Q09",
    "prompt": "A trader bought a carton of canned milk for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 160.00$ and sold it for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 192.00$. Calculate her percentage profit.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $16\\frac{2}{3}\\%$",
      "B. $32\\%$",
      "C. $25\\%$",
      "D. $20\\%$"
    ],
    "correctAnswer": "D",
    "hint": "Profit = Selling Price - Cost Price. Percentage Profit = (Profit / Cost Price) * 100%.",
    "workedSolution": "$$\\text{Profit} = 192.00 - 160.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 32.00$$\n$$\\text{Percentage profit} = \\left(\\frac{32}{160}\\right) \\times 100\\% = \\frac{1}{5} \\times 100\\% = 20\\%$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Commercial Arithmetic: Profit and Loss"
  },
  {
    "number": 10,
    "id": "MOCK01_P1_Q10",
    "prompt": "Simplify: $\\frac{42a^7b^5}{7a^3b^2}$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6a^4b^3$",
      "B. $6a^{10}b^7$",
      "C. $6a^4b^7$",
      "D. $35a^4b^3$"
    ],
    "correctAnswer": "A",
    "hint": "Apply the quotient rule of indices: a^m / a^n = a^(m - n).",
    "workedSolution": "$$\\frac{42a^7b^5}{7a^3b^2} = \\left(\\frac{42}{7}\\right) a^{7-3} b^{5-2} = 6a^4b^3$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Algebraic Expressions and Indices"
  },
  {
    "number": 11,
    "id": "MOCK01_P1_Q11",
    "prompt": "Two lighthouse beacons chime at intervals of $4\\text{ hours}$ and $7\\text{ hours}$ respectively. After how many hours will both beacons chime together?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $11\\text{ hours}$",
      "B. $14\\text{ hours}$",
      "C. $28\\text{ hours}$",
      "D. $56\\text{ hours}$"
    ],
    "correctAnswer": "C",
    "hint": "Find the Least Common Multiple (LCM) of 4 and 7.",
    "workedSolution": "$$\\text{LCM}(4, 7) = 4 \\times 7 = 28$$\nBoth beacons chime simultaneously every $28\\text{ hours}$.\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "LCM Applications"
  },
  {
    "number": 12,
    "id": "MOCK01_P1_Q12",
    "prompt": "A pupil scored $28$ out of $35$ in a computing quiz. Express this score as a percentage.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $70\\%$",
      "B. $75\\%$",
      "C. $80\\%$",
      "D. $85\\%$"
    ],
    "correctAnswer": "C",
    "hint": "Divide 28 by 35, simplify to 4/5, and multiply by 100%.",
    "workedSolution": "$$\\text{Percentage} = \\left(\\frac{28}{35}\\right) \\times 100\\% = \\left(\\frac{4}{5}\\right) \\times 100\\% = 80\\%$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Percentages"
  },
  {
    "number": 13,
    "id": "MOCK01_P1_Q13",
    "prompt": "Arrange the fractions $\\frac{5}{6}, \\frac{7}{12},$ and $\\frac{3}{4}$ in ascending order.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{7}{12}, \\frac{3}{4}, \\frac{5}{6}$",
      "B. $\\frac{3}{4}, \\frac{7}{12}, \\frac{5}{6}$",
      "C. $\\frac{7}{12}, \\frac{5}{6}, \\frac{3}{4}$",
      "D. $\\frac{5}{6}, \\frac{3}{4}, \\frac{7}{12}$"
    ],
    "correctAnswer": "A",
    "hint": "Convert all fractions to a common denominator of 12.",
    "workedSolution": "Common denominator $\\text{LCM}(6, 12, 4) = 12$:\n$$\\frac{7}{12} = \\frac{7}{12}, \\quad \\frac{3}{4} = \\frac{9}{12}, \\quad \\frac{5}{6} = \\frac{10}{12}$$\nSince $7 < 9 < 10$, ascending order is $\\frac{7}{12}, \\frac{3}{4}, \\frac{5}{6}$.\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Fractions and Ordering"
  },
  {
    "number": 14,
    "id": "MOCK01_P1_Q14",
    "prompt": "A worker paid an annual lease of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3,600.00$. If the lease represents $0.25$ of his annual earnings, find his total annual earnings.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 9,000.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12,400.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 14,400.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 18,000.00$"
    ],
    "correctAnswer": "C",
    "hint": "0.25 = 1/4. Multiply 3,600 by 4.",
    "workedSolution": "$$0.25I = 3,600 \\implies \\frac{1}{4}I = 3,600 \\implies I = 3,600 \\times 4 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 14,400.00$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Fractions and Decimals"
  },
  {
    "number": 15,
    "id": "MOCK01_P1_Q15",
    "prompt": "I bought provisions costing $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 37.40$ and paid with a $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 50.00$ note. If the grocer asked for an extra $40\\text{ Gp}$ to give a single $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 10.00$ note and coins, how much change in total was returned?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12.60$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 14.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 13.40$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 13.00$"
    ],
    "correctAnswer": "D",
    "hint": "Total paid = 50.00 + 0.40 = 50.40. Subtract the cost 37.40.",
    "workedSolution": "$$\\text{Total paid} = 50.00 + 0.40 = 50.40$$\n$$\\text{Change returned} = 50.40 - 37.40 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 13.00$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Money and Commercial Transactions"
  },
  {
    "number": 16,
    "id": "MOCK01_P1_Q16",
    "prompt": "A store manager can buy $24\\text{ lamps}$ at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 15.00$ each. If the price per lamp increases to $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 18.00$, how many lamps can he buy with the same budget?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $18$",
      "B. $22$",
      "C. $21$",
      "D. $20$"
    ],
    "correctAnswer": "D",
    "hint": "Total budget = 24 * 15 = 360. Divide 360 by 18.",
    "workedSolution": "$$\\text{Budget} = 24 \\times 15 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 360.00$$\n$$\\text{New quantity} = \\frac{360}{18} = 20$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Proportion"
  },
  {
    "number": 17,
    "id": "MOCK01_P1_Q17",
    "prompt": "A rectangular pitch of actual length $45\\text{ m}$ is represented on a blueprint by a line segment $9\\text{ cm}$ long. What is the scale ratio of the blueprint?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $1 : 50$",
      "B. $1 : 50,000$",
      "C. $1 : 5,000$",
      "D. $1 : 500$"
    ],
    "correctAnswer": "D",
    "hint": "Convert 45 m to cm (4,500 cm) before forming the ratio with 9 cm.",
    "workedSolution": "$$\\text{Actual length} = 45\\text{ m} = 4,500\\text{ cm}$$\n$$\\text{Scale} = \\frac{9\\text{ cm}}{4,500\\text{ cm}} = \\frac{1}{500} = 1 : 500$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Scale Drawing and Ratios"
  },
  {
    "number": 18,
    "id": "MOCK01_P1_Q18",
    "prompt": "An artisan started work at $7:35\\text{ a.m.}$ and finished at $4:10\\text{ p.m.}$ How long was the artisan at work?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $8\\text{ h } 15\\text{ min}$",
      "B. $8\\text{ h } 25\\text{ min}$",
      "C. $8\\text{ h } 35\\text{ min}$",
      "D. $8\\text{ h } 45\\text{ min}$"
    ],
    "correctAnswer": "C",
    "hint": "Convert 4:10 p.m. to 24-hour time (16:10) and subtract 07:35.",
    "workedSolution": "Convert $4:10\\text{ p.m.}$ to 24-hour time: $16:10$.\n$$16\\text{ h } 10\\text{ min} - 07\\text{ h } 35\\text{ min} = 15\\text{ h } 70\\text{ min} - 07\\text{ h } 35\\text{ min} = 8\\text{ h } 35\\text{ min}$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Time Measurement"
  },
  {
    "number": 19,
    "id": "MOCK01_P1_Q19",
    "prompt": "Given that $(3.14 \\times 36) \\times 8.5 = 3.14 \\times (6k \\times 8.5)$, find the value of $k$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $4$",
      "B. $12$",
      "C. $8$",
      "D. $6$"
    ],
    "correctAnswer": "D",
    "hint": "Divide both sides by (3.14 * 8.5), leaving 36 = 6k.",
    "workedSolution": "Divide out $3.14 \\times 8.5$ from both sides:\n$$36 = 6k \\implies k = 6$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Linear Equations"
  },
  {
    "number": 20,
    "id": "MOCK01_P1_Q20",
    "prompt": "The pie chart shows how Kofi budgets his monthly wage of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,200.00$. Find the angle marked $x^\\circ$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"280\" height=\"280\" viewBox=\"0 0 280 280\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"140\" cy=\"140\" r=\"115\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 140 140 L 255 140 A 115 115 0 0 1 100.7 248 Z\" fill=\"#38bdf8\" fill-opacity=\"0.3\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><path d=\"M 140 140 L 100.7 248 A 115 115 0 0 1 31.9 100.7 Z\" fill=\"#f59e0b\" fill-opacity=\"0.3\" stroke=\"#d97706\" stroke-width=\"1.5\"/><path d=\"M 140 140 L 31.9 100.7 A 115 115 0 0 1 140 25 Z\" fill=\"#10b981\" fill-opacity=\"0.3\" stroke=\"#059669\" stroke-width=\"1.5\"/><path d=\"M 140 140 L 140 25 A 115 115 0 0 1 255 140 Z\" fill=\"#8b5cf6\" fill-opacity=\"0.3\" stroke=\"#7c3aed\" stroke-width=\"1.5\"/><text x=\"165\" y=\"205\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">Food (120°)</text><text x=\"45\" y=\"180\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Other (95°)</text><text x=\"55\" y=\"80\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Savings (x°)</text><text x=\"150\" y=\"75\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Rent (90°)</text></svg>",
    "options": [
      "A. $55^\\circ$",
      "B. $65^\\circ$",
      "C. $75^\\circ$",
      "D. $85^\\circ$"
    ],
    "correctAnswer": "A",
    "hint": "The sum of angles in a pie chart equals 360 degrees.",
    "workedSolution": "$$x^\\circ + 90^\\circ + 120^\\circ + 95^\\circ = 360^\\circ$$\n$$x + 305 = 360 \\implies x = 55^\\circ$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Pie Charts and Angles"
  },
  {
    "number": 21,
    "id": "MOCK01_P1_Q21",
    "prompt": "Using the pie chart in Question 20, how much does Kofi spend on Food each month?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 300.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 360.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 400.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 480.00$"
    ],
    "correctAnswer": "C",
    "hint": "Calculate (120 / 360) * 1,200.00.",
    "workedSolution": "$$\\text{Food} = \\left(\\frac{120^\\circ}{360^\\circ}\\right) \\times 1,200.00 = \\frac{1}{3} \\times 1,200 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 400.00$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Pie Charts and Proportions"
  },
  {
    "number": 22,
    "id": "MOCK01_P1_Q22",
    "prompt": "Using the pie chart in Question 20, what percentage of his wage is allocated to Rent?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $20.0\\%$",
      "B. $33.3\\%$",
      "C. $30.0\\%$",
      "D. $25.0\\%$"
    ],
    "correctAnswer": "D",
    "hint": "Rent is 90 degrees out of 360 degrees. 90/360 = 1/4 = 25%.",
    "workedSolution": "$$\\text{Percentage} = \\left(\\frac{90^\\circ}{360^\\circ}\\right) \\times 100\\% = \\frac{1}{4} \\times 100\\% = 25\\%$$\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Pie Charts and Percentages"
  },
  {
    "number": 23,
    "id": "MOCK01_P1_Q23",
    "prompt": "In an enlargement transformation with scale factor $k = 4$, which of the following statements is **false**?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. Each line segment is multiplied by $4$.",
      "B. The object and image are geometrically similar.",
      "C. The area of the shape is multiplied by $16$.",
      "D. Each interior angle is multiplied by $4$."
    ],
    "correctAnswer": "D",
    "hint": "Under an enlargement transformation, angles remain invariant (unchanged).",
    "workedSolution": "Under an enlargement transformation, angles remain invariant (unchanged). They are never multiplied by the scale factor.\n\nTherefore, option D is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Enlargement"
  },
  {
    "number": 24,
    "id": "MOCK01_P1_Q24",
    "prompt": "Three partners shared a capital dividend of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 720,000.00$ in the ratio $3 : 4 : 5$. How much was the largest share?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 180,000.00$",
      "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 240,000.00$",
      "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 300,000.00$",
      "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 360,000.00$"
    ],
    "correctAnswer": "C",
    "hint": "Sum the parts: 3 + 4 + 5 = 12. Largest share = (5/12) * 720,000.",
    "workedSolution": "$$\\text{Total parts} = 3 + 4 + 5 = 12$$\n$$\\text{Largest share} = \\frac{5}{12} \\times 720,000 = 5 \\times 60,000 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 300,000.00$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Ratio and Proportion"
  },
  {
    "number": 25,
    "id": "MOCK01_P1_Q25",
    "prompt": "If $u = 8, v = 3, w = 5,$ and $z = 2$, evaluate $uw - vz$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $26$",
      "B. $34$",
      "C. $38$",
      "D. $46$"
    ],
    "correctAnswer": "B",
    "hint": "Substitute the values: (8 * 5) - (3 * 2).",
    "workedSolution": "$$uw - vz = (8 \\times 5) - (3 \\times 2) = 40 - 6 = 34$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Algebraic Substitution"
  },
  {
    "number": 26,
    "id": "MOCK01_P1_Q26",
    "prompt": "A father was $30\\text{ years}$ old when his son was born. Now he is four times as old as his son. How old is the son now?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $8\\text{ years}$",
      "B. $10\\text{ years}$",
      "C. $12\\text{ years}$",
      "D. $15\\text{ years}$"
    ],
    "correctAnswer": "B",
    "hint": "Let the son's age be s. The father's age is s + 30 = 4s.",
    "workedSolution": "Let the son's present age be $s$. The father's age is $s + 30$:\n$$s + 30 = 4s \\implies 3s = 30 \\implies s = 10$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Algebraic Word Problems"
  },
  {
    "number": 27,
    "id": "MOCK01_P1_Q27",
    "prompt": "A pouch contains $30$ identical beads. Twelve are purple and the rest are orange. What is the probability of picking an orange bead at random?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $\\frac{2}{5}$",
      "B. $\\frac{3}{5}$",
      "C. $\\frac{1}{2}$",
      "D. $\\frac{3}{10}$"
    ],
    "correctAnswer": "B",
    "hint": "Number of orange beads = 30 - 12 = 18. P(orange) = 18 / 30.",
    "workedSolution": "$$\\text{Orange beads} = 30 - 12 = 18$$\n$$P(\\text{orange}) = \\frac{18}{30} = \\frac{3}{5}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Probability"
  },
  {
    "number": 28,
    "id": "MOCK01_P1_Q28",
    "prompt": "Find the values of $p$ and $q$ from the linear mapping table:\n$$\\begin{array}{ccccccc} x & 1 & 2 & 3 & 4 & 5 & 6 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 5 & 9 & p & 17 & 21 & q \\end{array}$$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $p = 12, q = 24$",
      "B. $p = 13, q = 25$",
      "C. $p = 13, q = 26$",
      "D. $p = 14, q = 25$"
    ],
    "correctAnswer": "B",
    "hint": "The common difference in y is 4, giving rule y = 4x + 1.",
    "workedSolution": "Common difference in $y$: $9 - 5 = 4$. Form: $y = 4x + c$.\nFor $x = 1: 5 = 4(1) + c \\implies c = 1 \\implies y = 4x + 1$.\n- For $x = 3$: $p = 4(3) + 1 = 13$\n- For $x = 6$: $q = 4(6) + 1 = 25$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Relations and Mappings"
  },
  {
    "number": 29,
    "id": "MOCK01_P1_Q29",
    "prompt": "The perimeter of a rectangular garden is $44\\text{ m}$. If the length is $14\\text{ m}$, find its breadth.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $6\\text{ m}$",
      "B. $8\\text{ m}$",
      "C. $10\\text{ m}$",
      "D. $16\\text{ m}$"
    ],
    "correctAnswer": "B",
    "hint": "Perimeter = 2(length + breadth). 44 = 2(14 + b).",
    "workedSolution": "$$2(l + b) = 44 \\implies 14 + b = 22 \\implies b = 22 - 14 = 8\\text{ m}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Mensuration: Perimeter"
  },
  {
    "number": 30,
    "id": "MOCK01_P1_Q30",
    "prompt": "A patrol boat navigates on a bearing of $115^\\circ$. Which of the following diagrams correctly illustrates this bearing?",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"480\" height=\"120\" viewBox=\"0 0 480 120\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"translate(15, 10)\"><line x1=\"50\" y1=\"10\" x2=\"50\" y2=\"90\" stroke=\"#334155\" stroke-width=\"1.5\"/><line x1=\"10\" y1=\"50\" x2=\"90\" y2=\"50\" stroke=\"#334155\" stroke-width=\"1.5\"/><text x=\"47\" y=\"8\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">N</text><line x1=\"50\" y1=\"50\" x2=\"85\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 50 30 A 20 20 0 0 1 78 35\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><text x=\"4\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">A</text></g><g transform=\"translate(135, 10)\"><line x1=\"50\" y1=\"10\" x2=\"50\" y2=\"90\" stroke=\"#334155\" stroke-width=\"1.5\"/><line x1=\"10\" y1=\"50\" x2=\"90\" y2=\"50\" stroke=\"#334155\" stroke-width=\"1.5\"/><text x=\"47\" y=\"8\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">N</text><line x1=\"50\" y1=\"50\" x2=\"82\" y2=\"75\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 50 25 A 25 25 0 0 1 82 75\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><text x=\"60\" y=\"38\" font-family=\"sans-serif\" font-size=\"9\" fill=\"#dc2626\">115°</text><text x=\"4\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">B</text></g><g transform=\"translate(255, 10)\"><line x1=\"50\" y1=\"10\" x2=\"50\" y2=\"90\" stroke=\"#334155\" stroke-width=\"1.5\"/><line x1=\"10\" y1=\"50\" x2=\"90\" y2=\"50\" stroke=\"#334155\" stroke-width=\"1.5\"/><text x=\"47\" y=\"8\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">N</text><line x1=\"50\" y1=\"50\" x2=\"15\" y2=\"35\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"4\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">C</text></g><g transform=\"translate(375, 10)\"><line x1=\"50\" y1=\"10\" x2=\"50\" y2=\"90\" stroke=\"#334155\" stroke-width=\"1.5\"/><line x1=\"10\" y1=\"50\" x2=\"90\" y2=\"50\" stroke=\"#334155\" stroke-width=\"1.5\"/><text x=\"47\" y=\"8\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">N</text><line x1=\"50\" y1=\"50\" x2=\"25\" y2=\"80\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"4\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">D</text></g></svg>",
    "options": [
      "A. Diagram A",
      "B. Diagram B",
      "C. Diagram C",
      "D. Diagram D"
    ],
    "correctAnswer": "B",
    "hint": "Bearings are measured clockwise from North. 115 degrees is in the South-East quadrant.",
    "workedSolution": "A three-figure bearing is measured clockwise starting strictly from North ($000^\\circ$). A bearing of $115^\\circ$ lies between East ($090^\\circ$) and South ($180^\\circ$) in the South-East quadrant, correctly shown in Diagram B.\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Bearings and Vectors"
  },
  {
    "number": 31,
    "id": "MOCK01_P1_Q31",
    "prompt": "Find the area of a circular table top whose diameter is $28\\text{ cm}$. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $88\\text{ cm}^2$",
      "B. $154\\text{ cm}^2$",
      "C. $616\\text{ cm}^2$",
      "D. $2,464\\text{ cm}^2$"
    ],
    "correctAnswer": "C",
    "hint": "Radius r = diameter / 2 = 14 cm. Area = pi * r^2.",
    "workedSolution": "$$r = \\frac{28}{2} = 14\\text{ cm}$$\n$$A = \\pi r^2 = \\frac{22}{7} \\times 14 \\times 14 = 22 \\times 2 \\times 14 = 616\\text{ cm}^2$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Area of Circle"
  },
  {
    "number": 32,
    "id": "MOCK01_P1_Q32",
    "prompt": "Calculate the volume of a solid cylinder of base radius $3.5\\text{ cm}$ and height $12\\text{ cm}$. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $132\\text{ cm}^3$",
      "B. $264\\text{ cm}^3$",
      "C. $462\\text{ cm}^3$",
      "D. $924\\text{ cm}^3$"
    ],
    "correctAnswer": "C",
    "hint": "Volume of cylinder = pi * r^2 * h. Note that 3.5 = 7/2.",
    "workedSolution": "$$V = \\pi r^2 h = \\frac{22}{7} \\times \\left(\\frac{7}{2}\\right)^2 \\times 12 = \\frac{22}{7} \\times \\frac{49}{4} \\times 12 = 22 \\times 7 \\times 3 = 462\\text{ cm}^3$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Mensuration: Volume of Cylinder"
  },
  {
    "number": 33,
    "id": "MOCK01_P1_Q33",
    "prompt": "In the diagram below, two parallel vertical lines are intersected by transversals. Find the value of angle $e$.",
    "hasDiagram": true,
    "svgDiagram": "<svg width=\"340\" height=\"220\" viewBox=\"0 0 340 220\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"50\" y1=\"30\" x2=\"50\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"270\" y1=\"30\" x2=\"270\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"50\" y1=\"50\" x2=\"270\" y2=\"170\" stroke=\"#0284c7\" stroke-width=\"2\"/><line x1=\"50\" y1=\"150\" x2=\"270\" y2=\"30\" stroke=\"#dc2626\" stroke-width=\"2\"/><text x=\"60\" y=\"65\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0284c7\">55°</text><text x=\"60\" y=\"145\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#dc2626\">40°</text><text x=\"165\" y=\"110\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">e</text><text x=\"250\" y=\"50\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">d</text><text x=\"105\" y=\"210\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
    "options": [
      "A. $85^\\circ$",
      "B. $95^\\circ$",
      "C. $105^\\circ$",
      "D. $115^\\circ$"
    ],
    "correctAnswer": "B",
    "hint": "Apply the exterior angle theorem on the triangle: e = 55° + 40°.",
    "workedSolution": "By the exterior angle theorem on the left triangle formed by the vertical line and transversals:\n$$e = 55^\\circ + 40^\\circ = 95^\\circ$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Plane Geometry and Angles"
  },
  {
    "number": 34,
    "id": "MOCK01_P1_Q34",
    "prompt": "Using the diagram in Question 33, find the value of angle $d$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $40^\\circ$",
      "B. $50^\\circ$",
      "C. $55^\\circ$",
      "D. $85^\\circ$"
    ],
    "correctAnswer": "A",
    "hint": "Since the two vertical lines are parallel, identify the alternate interior angle for d.",
    "workedSolution": "Since the two vertical lines are parallel, the transversal line carries alternate interior angles across the two lines:\n$$d = 40^\\circ$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Plane Geometry and Parallel Lines"
  },
  {
    "number": 35,
    "id": "MOCK01_P1_Q35",
    "prompt": "A wire of length $7.2\\text{ m}$ is cut into equal pieces, each $45\\text{ cm}$ long. How many pieces are obtained?",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $14$",
      "B. $16$",
      "C. $18$",
      "D. $20$"
    ],
    "correctAnswer": "B",
    "hint": "Convert 7.2 m to cm (720 cm) and divide by 45 cm.",
    "workedSolution": "$$7.2\\text{ m} = 720\\text{ cm}$$\n$$\\text{Number of pieces} = \\frac{720}{45} = 16$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Units of Measurement"
  },
  {
    "number": 36,
    "id": "MOCK01_P1_Q36",
    "prompt": "Solve the linear inequality: $4x + 15 \\ge \\frac{7x}{2} - 3$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $x \\ge -36$",
      "B. $x \\le -36$",
      "C. $x \\ge 18$",
      "D. $x \\le 18$"
    ],
    "correctAnswer": "A",
    "hint": "Multiply through by 2 to clear fractions: 8x + 30 >= 7x - 6.",
    "workedSolution": "Multiply through by $2$:\n$$8x + 30 \\ge 7x - 6$$\n$$8x - 7x \\ge -6 - 30 \\implies x \\ge -36$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Linear Inequalities"
  },
  {
    "number": 37,
    "id": "MOCK01_P1_Q37",
    "prompt": "Find the image of the point $N(-8, 5)$ under a reflection in the $y$-axis.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $(8, 5)$",
      "B. $(-8, -5)$",
      "C. $(8, -5)$",
      "D. $(5, -8)$"
    ],
    "correctAnswer": "A",
    "hint": "Under reflection in the y-axis, (x, y) maps to (-x, y).",
    "workedSolution": "Under a reflection in the $y$-axis: $(x, y) \\to (-x, y)$:\n$$N(-8, 5) \\to N'(8, 5)$$\n\nTherefore, option A is correct.",
    "points": 1,
    "topic": "Transformational Geometry: Reflection"
  },
  {
    "number": 38,
    "id": "MOCK01_P1_Q38",
    "prompt": "If $\\begin{pmatrix} 3x - 4 \\\\ 7 \\end{pmatrix} = \\begin{pmatrix} 11 \\\\ 7 \\end{pmatrix}$, find the value of $x$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $3$",
      "B. $4$",
      "C. $5$",
      "D. $6$"
    ],
    "correctAnswer": "C",
    "hint": "Equate the corresponding top components: 3x - 4 = 11.",
    "workedSolution": "$$3x - 4 = 11 \\implies 3x = 15 \\implies x = 5$$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Vectors: Column Matrices"
  },
  {
    "number": 39,
    "id": "MOCK01_P1_Q39",
    "prompt": "Find the gradient of the straight line passing through coordinates $P(-3, 4)$ and $Q(5, -2)$.",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $-\\frac{4}{3}$",
      "B. $-\\frac{3}{4}$",
      "C. $\\frac{3}{4}$",
      "D. $\\frac{4}{3}$"
    ],
    "correctAnswer": "B",
    "hint": "Gradient m = (y2 - y1) / (x2 - x1).",
    "workedSolution": "$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{-2 - 4}{5 - (-3)} = \\frac{-6}{8} = -\\frac{3}{4}$$\n\nTherefore, option B is correct.",
    "points": 1,
    "topic": "Coordinate Geometry: Gradient"
  },
  {
    "number": 40,
    "id": "MOCK01_P1_Q40",
    "prompt": "Determine the next two terms of the arithmetic sequence: $23, 17, 11, 5, \\dots, \\dots$",
    "hasDiagram": false,
    "svgDiagram": null,
    "options": [
      "A. $0, -6$",
      "B. $-1, -6$",
      "C. $-1, -7$",
      "D. $-2, -8$"
    ],
    "correctAnswer": "C",
    "hint": "Common difference d = 17 - 23 = -6. Subtract 6 sequentially.",
    "workedSolution": "Common difference $d = 17 - 23 = -6$:\n- Fifth term $= 5 + (-6) = -1$\n- Sixth term $= -1 + (-6) = -7$\n\nTherefore, option C is correct.",
    "points": 1,
    "topic": "Number Patterns and Sequences"
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
    "questionNumber": 1,
    "id": "MOCK01_P2_Q01",
    "marks": 15,
    "topic": "Sets, Simple Interest, and Standard Form",
    "subQuestions": [
      {
        "part": "a",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "Given that:\n$$P = \\{\\text{factors of } 36\\}$$\n$$Q = \\{\\text{multiples of } 4 \\text{ less than } 40\\}$$\nFind $P \\cap Q$.",
        "workedSolution": "**Step 1: List the elements of set $P$:**\nFactors of $36$ are positive integers dividing $36$ completely:\n$$P = \\{1, 2, 3, 4, 6, 9, 12, 18, 36\\}$$\n\n**Step 2: List the elements of set $Q$:**\nMultiples of $4$ less than $40$:\n$$Q = \\{4, 8, 12, 16, 20, 24, 28, 32, 36\\}$$\n\n**Step 3: Determine the intersection $P \\cap Q$:**\nCompare both sets for common members:\n$$P \\cap Q = \\{4, 12, 36\\}$$\n\nTherefore, **$P \\cap Q = \\{4, 12, 36\\}$**."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A cooperative union saved $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 450.00$ in an account for $3\\text{ years}$ at a simple interest rate of $12\\%$ per annum. Calculate the total balance in the account at the end of the $3\\text{ years}$.",
        "workedSolution": "**Step 1: Calculate the simple interest earned ($I$):**\n$$I = \\frac{P \\times R \\times T}{100}$$\nWhere:\n- Principal ($P$) $= \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 450.00$\n- Rate ($R$) $= 12\\%$\n- Time ($T$) $= 3\\text{ years}$\n\n$$I = \\frac{450 \\times 12 \\times 3}{100} = \\frac{450 \\times 36}{100} = 4.5 \\times 36 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 162.00$$\n\n**Step 2: Find total balance ($A$):**\n$$A = P + I = 450.00 + 162.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 612.00$$\n\nTherefore, the total amount in the account is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 612.00$**."
      },
      {
        "part": "c",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "Evaluate $\\frac{5.76 \\times 3.2}{0.18}$, leaving your answer in scientific notation (standard form).",
        "workedSolution": "**Step 1: Simplify the numerical fraction:**\nNotice that $\\frac{5.76}{0.18} = \\frac{576}{18} = 32$:\n$$= 32 \\times 3.2 = 102.4$$\n\n*(Verification via index rules:)*\n$$\\frac{(576 \\times 10^{-2}) \\times (32 \\times 10^{-1})}{18 \\times 10^{-2}} = \\frac{576 \\times 32}{18} \\times 10^{-1} = 32 \\times 32 \\times 10^{-1} = 1024 \\times 10^{-1} = 102.4$$\n\n**Step 2: Convert to standard form ($A \\times 10^n$, where $1 \\le A < 10$):**\n$$102.4 = 1.024 \\times 10^2$$\n\nTherefore, the answer in standard form is **$1.024 \\times 10^2$**."
      }
    ]
  },
  {
    "questionNumber": 2,
    "id": "MOCK01_P2_Q02",
    "marks": 15,
    "topic": "Averages, Medians, and Isosceles Angle Geometry with Parallel Lines",
    "subQuestions": [
      {
        "part": "a",
        "marks": 7,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "(i) Kwaku scored $76, 82,$ and $88$ in three terminal science quizzes. What mark must he score in the fourth quiz so that his mean mark across all four quizzes becomes $84$?\n(ii) Find his median score across the four quizzes.",
        "workedSolution": "**(i) Finding the required fourth score ($x$):**\n$$\\text{Mean} = \\frac{\\sum x}{n}$$\n$$\\frac{76 + 82 + 88 + x}{4} = 84$$\n$$246 + x = 84 \\times 4$$\n$$246 + x = 336$$\n$$x = 336 - 246 = 90$$\n\nTherefore, he must score **$90$ marks** in the fourth quiz.\n\n---\n\n**(ii) Finding the median score:**\nArrange the four scores in ascending order:\n$$76, 82, 88, 90$$\nSince $n = 4$ is even, the median is the arithmetic mean of the two middle scores:\n$$\\text{Median} = \\frac{82 + 88}{2} = \\frac{170}{2} = 85$$\n\nTherefore, the median mark is **$85$**."
      },
      {
        "part": "b",
        "marks": 8,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"420\" height=\"220\" viewBox=\"0 0 420 220\" xmlns=\"http://www.w3.org/2000/svg\"><line x1=\"30\" y1=\"60\" x2=\"390\" y2=\"60\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"30\" y1=\"170\" x2=\"390\" y2=\"170\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"110\" y1=\"60\" x2=\"210\" y2=\"170\" stroke=\"#0284c7\" stroke-width=\"2\"/><line x1=\"310\" y1=\"60\" x2=\"210\" y2=\"170\" stroke=\"#0284c7\" stroke-width=\"2\"/><line x1=\"155\" y1=\"110\" x2=\"165\" y2=\"120\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"255\" y1=\"120\" x2=\"265\" y2=\"110\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 245 170 A 35 35 0 0 1 233 145\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><path d=\"M 210 170 A 30 30 0 0 0 185 145\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"248\" y=\"162\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0284c7\">46°</text><text x=\"203\" y=\"140\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">x</text><text x=\"45\" y=\"50\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"105\" y=\"50\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"310\" y=\"50\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"370\" y=\"50\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">D</text><text x=\"45\" y=\"195\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">E</text><text x=\"205\" y=\"195\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">F</text><text x=\"370\" y=\"195\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">G</text><text x=\"150\" y=\"210\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
        "questionText": "In the diagram, line segment $AD$ is parallel to line segment $EG$ ($AD \\parallel EG$). Triangle $BCF$ is isosceles with $|BF| = |CF|$, and the lines $BF$ and $CF$ meet at point $F$ on line $EG$. If $\\angle CFG = 46^\\circ$, calculate the value of:\n(i) $\\angle DCF$;\n(ii) $\\angle CBF$;\n(iii) $x$ (which is $\\angle BFC$).",
        "workedSolution": "**(i) Finding the value of $\\angle DCF$:**\nSince $AD \\parallel EG$ and line segment $CF$ acts as a transversal crossing both parallel lines:\n$$\\angle DCF = \\angle CFG = 46^\\circ \\quad (\\text{alternate interior angles})$$\n\nTherefore, **$\\angle DCF = 46^\\circ$**.\n\n---\n\n**(ii) Finding the value of $\\angle CBF$:**\nAlternate interior angle $\\angle BCF = \\angle CFG = 46^\\circ$.\nSince triangle $BCF$ is isosceles with legs $|BF| = |CF|$:\n$$\\angle CBF = \\angle BCF = 46^\\circ \\quad (\\text{base angles of isosceles } \\triangle)$$\n\nTherefore, **$\\angle CBF = 46^\\circ$**.\n\n---\n\n**(iii) Finding the value of $x$ ($\\angle BFC$):**\nThe sum of interior angles in triangle $BCF$ equals $180^\\circ$:\n$$\\angle BFC + \\angle CBF + \\angle BCF = 180^\\circ$$\n$$x + 46^\\circ + 46^\\circ = 180^\\circ$$\n$$x + 92^\\circ = 180^\\circ$$\n$$x = 180^\\circ - 92^\\circ = 88^\\circ$$\n\n*(Cross-check along straight line $EG$: $\\angle BFE + x + \\angle CFG = 46^\\circ + 88^\\circ + 46^\\circ = 180^\\circ$, verified)*.\n\nTherefore, **$x = 88^\\circ$**."
      }
    ]
  },
  {
    "questionNumber": 3,
    "id": "MOCK01_P2_Q03",
    "marks": 15,
    "topic": "Algebraic Inequalities and Stem-and-Leaf Representation",
    "subQuestions": [
      {
        "part": "a",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "Solve for $x$ in the inequality: $\\frac{1}{3}x + 1\\frac{3}{4} < -\\frac{1}{2}x - \\frac{1}{4}$.",
        "workedSolution": "Given inequality:\n$$\\frac{1}{3}x + \\frac{7}{4} < -\\frac{1}{2}x - \\frac{1}{4}$$\n\n**Step 1: Clear the denominators by multiplying through by the LCM of 3, 4, and 2, which is $12$:**\n$$12\\left(\\frac{1}{3}x\\right) + 12\\left(\\frac{7}{4}\\right) < 12\\left(-\\frac{1}{2}x\\right) - 12\\left(\\frac{1}{4}\\right)$$\n$$4x + 3(7) < -6x - 3$$\n$$4x + 21 < -6x - 3$$\n\n**Step 2: Collect like terms:**\n$$4x + 6x < -3 - 21$$\n$$10x < -24$$\n\n**Step 3: Divide by 10:**\n$$x < -\\frac{24}{10} = -\\frac{12}{5} = -2.4$$\n\n**Truth set:** $\\mathbf{\\left\\{x : x < -2\\frac{2}{5}\\right\\}}$."
      },
      {
        "part": "b",
        "marks": 9,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "The following numbers represent the test scores of $20\\text{ candidates}$ in an introductory computing exam:\n$$8, 41, 25, 17, 28, 43, 7, 22, 33, 37, 54, 45, 38, 46, 57, 12, 15, 34, 51, 47$$\n(i) Construct an ordered stem-and-leaf plot for the data.\n(ii) Find the probability of randomly choosing a candidate who scored between $40$ and $50$ inclusive.\n(iii) If the pass mark was set at $30$, how many candidates passed the examination?",
        "workedSolution": "**(i) Ordered Stem-and-Leaf Plot:**\n- Stems represent tens digits: $0, 1, 2, 3, 4, 5$\n- Leaves represent units digits arranged in ascending order:\n\n$$\\begin{array}{r|l} \\text{Stem} & \\text{Leaves} \\\\ \\hline 0 & 7, 8 \\\\ 1 & 2, 5, 7 \\\\ 2 & 2, 5, 8 \\\\ 3 & 3, 4, 7, 8 \\\\ 4 & 1, 3, 5, 6, 7 \\\\ 5 & 1, 4, 7 \\end{array}$$\n$$\\text{Key: } 2 \\mid 5 = 25$$\n\n---\n\n**(ii) Probability of selecting a candidate scoring between 40 and 50 inclusive ($40 \\le x \\le 50$):**\nScores in this range fall strictly on stem $4$:\n$$\\{41, 43, 45, 46, 47\\} \\implies n(E) = 5$$\n$$n(S) = 20$$\n$$P(40 \\le x \\le 50) = \\frac{5}{20} = \\frac{1}{4} = 0.25$$\n\nTherefore, the probability is **$\\frac{1}{4}$**.\n\n---\n\n**(iii) Candidates passing the exam ($x \\ge 30$):**\nCount all leaves on stems $3, 4,$ and $5$:\n- Stem $3$: $4$ candidates ($33, 34, 37, 38$)\n- Stem $4$: $5$ candidates ($41, 43, 45, 46, 47$)\n- Stem $5$: $3$ candidates ($51, 54, 57$)\n$$\\text{Total passed} = 4 + 5 + 3 = 12$$\n\nTherefore, **$12\\text{ candidates}$ passed the examination**."
      }
    ]
  },
  {
    "questionNumber": 4,
    "id": "MOCK01_P2_Q04",
    "marks": 15,
    "topic": "Cuboid Surface Mensuration and Coordinate Geometry Transformations",
    "subQuestions": [
      {
        "part": "a",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A rectangular solid wooden block has length $10.0\\text{ cm}$, width $5.0\\text{ cm}$, and height $7.0\\text{ cm}$. Find the:\n(i) total surface area of the block;\n(ii) volume of the block.",
        "workedSolution": "**(i) Total Surface Area of the Cuboid:**\n$$\\text{TSA} = 2(lw + lh + wh)$$\nGiven $l = 10.0\\text{ cm}, w = 5.0\\text{ cm}, h = 7.0\\text{ cm}$:\n$$lw = 10 \\times 5 = 50\\text{ cm}^2$$\n$$lh = 10 \\times 7 = 70\\text{ cm}^2$$\n$$wh = 5 \\times 7 = 35\\text{ cm}^2$$\n$$\\text{TSA} = 2(50 + 70 + 35) = 2(155) = 310\\text{ cm}^2$$\n\nTherefore, the total surface area is **$310\\text{ cm}^2$**.\n\n---\n\n**(ii) Volume of the Cuboid:**\n$$V = l \\times w \\times h = 10.0 \\times 5.0 \\times 7.0 = 50 \\times 7 = 350\\text{ cm}^3$$\n\nTherefore, the volume is **$350\\text{ cm}^3$**."
      },
      {
        "part": "b",
        "marks": 9,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"400\" height=\"380\" viewBox=\"0 0 400 380\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"400\" height=\"380\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"gridMK1\" width=\"25\" height=\"25\" patternUnits=\"userSpaceOnUse\"><path d=\"M 25 0 L 0 0 0 25\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"380\" fill=\"url(#gridMK1)\"/><line x1=\"25\" y1=\"190\" x2=\"375\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"200\" y1=\"15\" x2=\"200\" y2=\"365\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"380\" y=\"195\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"205\" y=\"20\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><polygon points=\"200,90 250,90 300,40\" fill=\"#38bdf8\" fill-opacity=\"0.3\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"180\" y=\"90\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">A(0,4)</text><text x=\"255\" y=\"82\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">B(2,4)</text><text x=\"305\" y=\"40\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">C(4,6)</text><polygon points=\"175,115 225,115 275,65\" fill=\"#10b981\" fill-opacity=\"0.25\" stroke=\"#059669\" stroke-dasharray=\"3\" stroke-width=\"1.8\"/><text x=\"125\" y=\"125\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#059669\">A₁(-1,3)</text><text x=\"225\" y=\"132\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#059669\">B₁(1,3)</text><text x=\"275\" y=\"60\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#059669\">C₁(3,5)</text><polygon points=\"200,290 250,290 300,340\" fill=\"#f43f5e\" fill-opacity=\"0.25\" stroke=\"#e11d48\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><text x=\"165\" y=\"295\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#e11d48\">A₂(0,-4)</text><text x=\"255\" y=\"305\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#e11d48\">B₂(2,-4)</text><text x=\"305\" y=\"345\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#e11d48\">C₂(4,-6)</text></svg>",
        "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on both axes, draw two perpendicular axes $Ox$ and $Oy$ on a graph sheet for $-5 \\le x \\le 5$ and $-6 \\le y \\le 6$.\n(i) Plot the vertices $A(0, 4), B(2, 4),$ and $C(4, 6)$ and join them to form triangle $ABC$.\n(ii) Draw the image $A_1B_1C_1$ of triangle $ABC$ under a translation by vector $\\mathbf{v} = \\begin{pmatrix} -1 \\\\ -1 \\end{pmatrix}$.\n(iii) Draw the image $A_2B_2C_2$ of triangle $ABC$ under a reflection in the $x$-axis.",
        "workedSolution": "**(i) Original Coordinates:**\n$$A(0, 4), \\quad B(2, 4), \\quad C(4, 6)$$\n\n---\n\n**(ii) Translation by vector $\\mathbf{v} = \\begin{pmatrix} -1 \\\\ -1 \\end{pmatrix}$:**\n$$\\begin{pmatrix} x' \\\\ y' \\end{pmatrix} = \\begin{pmatrix} x \\\\ y \\end{pmatrix} + \\begin{pmatrix} -1 \\\\ -1 \\end{pmatrix}$$\n- $A_1 = \\begin{pmatrix} 0 - 1 \\\\ 4 - 1 \\end{pmatrix} = \\begin{pmatrix} -1 \\\\ 3 \\end{pmatrix} \\implies A_1(-1, 3)$\n- $B_1 = \\begin{pmatrix} 2 - 1 \\\\ 4 - 1 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 3 \\end{pmatrix} \\implies B_1(1, 3)$\n- $C_1 = \\begin{pmatrix} 4 - 1 \\\\ 6 - 1 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 5 \\end{pmatrix} \\implies C_1(3, 5)$\n\n---\n\n**(iii) Reflection in the $x$-axis:**\nMapping rule: $(x, y) \\to (x, -y)$\n- $A_2(0, -4)$\n- $B_2(2, -4)$\n- $C_2(4, -6)$\n\n*(See the embedded SVG coordinate plot above for the exact geometric rendering)*."
      }
    ]
  },
  {
    "questionNumber": 5,
    "id": "MOCK01_P2_Q05",
    "marks": 15,
    "topic": "Geometric Compass Construction: Perpendicular Bisectors and Circumcircle",
    "subQuestions": [
      {
        "part": "a",
        "marks": 10,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"380\" height=\"340\" viewBox=\"0 0 380 340\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"380\" height=\"340\" fill=\"#ffffff\"/><circle cx=\"190\" cy=\"170\" r=\"88\" fill=\"none\" stroke=\"#7c3aed\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><polygon points=\"110,210 270,210 170,95\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"190\" y1=\"60\" x2=\"190\" y2=\"280\" stroke=\"#0284c7\" stroke-dasharray=\"4\" stroke-width=\"1.5\"/><line x1=\"130\" y1=\"220\" x2=\"250\" y2=\"100\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.5\"/><circle cx=\"190\" cy=\"170\" r=\"4\" fill=\"#7c3aed\"/><text x=\"198\" y=\"168\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#7c3aed\">N</text><text x=\"95\" y=\"225\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"280\" y=\"225\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">R</text><text x=\"165\" y=\"85\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Q</text><text x=\"180\" y=\"230\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">8 cm</text><text x=\"120\" y=\"145\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">6 cm</text><text x=\"230\" y=\"145\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">5 cm</text></svg>",
        "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct triangle $PQR$ such that $|PR| = 8.0\\text{ cm}, |PQ| = 6.0\\text{ cm},$ and $|QR| = 5.0\\text{ cm}$;\n(ii) Construct the perpendicular bisector of $|PR|$ and label it $l_1$;\n(iii) Construct the perpendicular bisector of $|QR|$ and label it $l_2$;\n(iv) Label the point of intersection of $l_1$ and $l_2$ as $N$;\n(v) With centre $N$ and radius equal to $|NP|$, construct a circle circumscribing triangle $PQR$.",
        "workedSolution": "**Step-by-Step Construction Procedure:**\n1. **Base Line $|PR| = 8.0\\text{ cm}$:**\n   - Draw a straight baseline and mark point $P$.\n   - With compasses opened to $8.0\\text{ cm}$, place the needle at $P$ and cut the line to fix $R$.\n2. **Locating Vertex $Q$:**\n   - With compasses opened to $6.0\\text{ cm}$ from $P$, strike an arc above $PR$.\n   - With compasses opened to $5.0\\text{ cm}$ from $R$, strike an intersecting arc to fix $Q$.\n   - Join $PQ$ and $QR$ with straight lines to form triangle $PQR$.\n3. **Perpendicular Bisector of $PR$ ($l_1$):**\n   - Strike arcs of equal radius $> 4.0\\text{ cm}$ above and below $PR$ using $P$ and $R$ as centres.\n   - Connect the intersection points to draw line $l_1$.\n4. **Perpendicular Bisector of $QR$ ($l_2$):**\n   - Repeat the perpendicular bisection process on line segment $QR$.\n   - Connect the intersection points to draw line $l_2$.\n5. **Circumcentre $N$ and Circumcircle:**\n   - Mark the intersection of $l_1$ and $l_2$ as $N$.\n   - With needle at $N$ and radius $|NP|$, draw the circle passing through $P, Q,$ and $R$."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "(i) Measure the radius of the circle in (a)(v).\n(ii) Calculate the circumference of the circle correct to 3 significant figures. $[\\text{Take } \\pi = 3.142]$",
        "workedSolution": "**(i) Measured Radius ($R$):**\n$$R = |NP| \\approx 4.1\\text{ cm} \\quad (\\text{acceptable tolerance: } 4.0\\text{ cm} \\text{ to } 4.2\\text{ cm})$$\n\n---\n\n**(ii) Circumference Calculation:**\n$$C = 2\\pi R = 2 \\times 3.142 \\times 4.1 = 6.284 \\times 4.1 = 25.7644\\text{ cm}$$\nRounding to $3$ significant figures:\n$$C \\approx 25.8\\text{ cm}$$\n\nTherefore, the circumference of the circle is **$25.8\\text{ cm}$**."
      }
    ]
  },
  {
    "questionNumber": 6,
    "id": "MOCK01_P2_Q06",
    "marks": 15,
    "topic": "Algebraic Grouping, Wall Ladder Geometry, and Fractional Inventory",
    "subQuestions": [
      {
        "part": "a",
        "marks": 4,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "Factorize completely: $8xy - 4y + 6x - 3$.",
        "workedSolution": "Group terms pairwise:\n$$8xy - 4y + 6x - 3 = (8xy - 4y) + (6x - 3)$$\nExtract common factors:\n$$= 4y(2x - 1) + 3(2x - 1)$$\nFactor out the common binomial $(2x - 1)$:\n$$= (2x - 1)(4y + 3)$$\n\nTherefore, the completely factorized form is **$(2x - 1)(4y + 3)$**."
      },
      {
        "part": "b",
        "marks": 5,
        "hasDiagram": true,
        "svgDiagram": "<svg width=\"360\" height=\"280\" viewBox=\"0 0 360 280\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"360\" height=\"280\" fill=\"#ffffff\"/><line x1=\"40\" y1=\"240\" x2=\"320\" y2=\"240\" stroke=\"#334155\" stroke-width=\"2\"/><line x1=\"80\" y1=\"30\" x2=\"80\" y2=\"240\" stroke=\"#0f172a\" stroke-width=\"3\"/><polygon points=\"80,30 65,45 80,60 65,75 80,90 65,105 80,120 65,135 80,150 65,165 80,180 65,195 80,210 65,225 80,240\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"1.5\"/><line x1=\"80\" y1=\"80\" x2=\"260\" y2=\"240\" stroke=\"#b45309\" stroke-width=\"3.5\" stroke-linecap=\"round\"/><polyline points=\"80,222 98,222 98,240\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><circle cx=\"80\" cy=\"80\" r=\"4\" fill=\"#0f172a\"/><circle cx=\"80\" cy=\"240\" r=\"4\" fill=\"#0f172a\"/><circle cx=\"260\" cy=\"240\" r=\"4\" fill=\"#0f172a\"/><text x=\"72\" y=\"22\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Q</text><text x=\"55\" y=\"85\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"60\" y=\"258\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"265\" y=\"258\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"25\" y=\"165\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">12 m</text><text x=\"160\" y=\"260\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">9 m</text><text x=\"180\" y=\"150\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#b45309\">AB</text><text x=\"100\" y=\"275\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
        "questionText": "The diagram shows a ladder $AB$ which leans against a vertical building wall $PQ$ at point $B$. If the height $|PB|$ reached on the wall is $12\\text{ m}$ and the foot of the ladder $A$ is $9\\text{ m}$ from the base of the wall at $P$, calculate the length of the ladder ($AB$).",
        "workedSolution": "Triangle $APB$ is right-angled at $P$ ($\\angle APB = 90^\\circ$):\n- Base $|AP| = 9\\text{ m}$\n- Height $|PB| = 12\\text{ m}$\n- Hypotenuse $= |AB|$\n\nApplying Pythagoras' Theorem:\n$$|AB|^2 = |AP|^2 + |PB|^2$$\n$$|AB|^2 = 9^2 + 12^2 = 81 + 144 = 225$$\n$$|AB| = \\sqrt{225} = 15\\text{ m}$$\n\nTherefore, the length of the ladder is **$15\\text{ m}$**."
      },
      {
        "part": "c",
        "marks": 6,
        "hasDiagram": false,
        "svgDiagram": null,
        "questionText": "A warehouse supervisor had $2,400\\text{ bags}$ of sugar in stock. In June, he dispatched $\\frac{3}{5}$ of the stock. In July, he dispatched $\\frac{2}{3}$ of what was left.\n(i) What fraction of the total stock was dispatched:\n    $(\\alpha)$ in July?\n    $(\\beta)$ altogether in June and July?\n(ii) How many bags of sugar remained in the warehouse by the end of July?",
        "workedSolution": "**(i) ($a$) Fraction dispatched in July:**\n- Fraction remaining after June: $1 - \\frac{3}{5} = \\frac{2}{5}$\n- Fraction in July: $\\frac{2}{3} \\times \\frac{2}{5} = \\frac{4}{15}$\n\nTherefore, **$\\frac{4}{15}$** of the original stock was dispatched in July.\n\n---\n\n**(i) ($\\beta$) Fraction dispatched altogether:**\n$$\\text{Total fraction} = \\frac{3}{5} + \\frac{4}{15} = \\frac{9}{15} + \\frac{4}{15} = \\frac{13}{15}$$\n\nTherefore, **$\\frac{13}{15}$** of the stock was dispatched altogether.\n\n---\n\n**(ii) Bags of sugar remaining:**\n- Remaining fraction: $1 - \\frac{13}{15} = \\frac{2}{15}$\n$$\\text{Remaining bags} = \\frac{2}{15} \\times 2,400 = 2 \\times 160 = 320\\text{ bags}$$\n\nTherefore, **$320\\text{ bags}$** of sugar remained."
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
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/mock_series/mock_01/paper_2",
  theoryTopicList: [
{
        "id": "q1",
        "questionNumber": 1,
        "theoryIndex": 1,
        "title": "Sets, Simple Interest & Standard Form",
        "category": "Sets & Commercial Arithmetic"
    },
    {
        "id": "q2",
        "questionNumber": 2,
        "theoryIndex": 2,
        "title": "Averages, Medians & Isosceles Geometry",
        "category": "Statistics & Geometry"
    },
    {
        "id": "q3",
        "questionNumber": 3,
        "theoryIndex": 3,
        "title": "Algebraic Inequalities & Stem-and-Leaf Plot",
        "category": "Algebra & Data Handling"
    },
    {
        "id": "q4",
        "questionNumber": 4,
        "theoryIndex": 4,
        "title": "Cuboid Mensuration & Coordinate Geometry",
        "category": "Mensuration & Transformations"
    },
    {
        "id": "q5",
        "questionNumber": 5,
        "theoryIndex": 5,
        "title": "Compass Construction: Bisectors & Circumcircle",
        "category": "Geometric Construction"
    },
    {
        "id": "q6",
        "questionNumber": 6,
        "theoryIndex": 6,
        "title": "Algebraic Grouping, Ladder Geometry & Fractions",
        "category": "Algebra & Mensuration"
    }
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
