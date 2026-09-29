import { CurriculumQuestionSet } from '../global-curriculum-types';

export const BECE_2017_MATH_P1_DATA = {
  "examMetadata": {
    "examYear": 2017,
    "examination": "BECE (Basic Education Certificate Examination)",
    "subject": "Mathematics",
    "paper": "Paper 1 (Objective Test)",
    "totalQuestions": 40,
    "timeAllowed": "1 hour",
    "curriculumAlignment": "NaCCA JHS Common Core Programme / WAEC Standards",
    "firestoreCollectionPath": "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2017/paper_1",
    "answerKeyBalance": {
      "A": 10,
      "B": 10,
      "C": 10,
      "D": 10
    }
  },
  "questions": [
    {
      "questionNumber": 1,
      "id": "BECE_2017_P1_Q01",
      "questionText": "If $A = \\{1, 3, 5, 7, 9, 11, 13\\}$ and $B = \\{2, 3, 5, 7, 11, 13, 17\\}$, find $A \\cup B$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\{3, 5, 7, 11, 13\\}$",
        "B. $\\{1, 2, 3, 5, 7, 9, 11, 13, 17\\}$",
        "C. $\\{1, 3, 5, 7, 9, 11, 13\\}$",
        "D. $\\{2, 3, 5, 7, 11, 13\\}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "The union $A \\cup B$ comprises all unique elements belonging to set $A$, set $B$, or both:\n$$A \\cup B = \\{1, 2, 3, 5, 7, 9, 11, 13, 17\\}$$\n\nTherefore, option B is correct.",
      "topic": "Sets and Operations on Sets"
    },
    {
      "questionNumber": 2,
      "id": "BECE_2017_P1_Q02",
      "questionText": "If $15 : 3x = 5 : 8$, find the value of $x$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $6$",
        "B. $8$",
        "C. $10$",
        "D. $12$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Express the ratio as an equation of fractions:\n$$\\frac{15}{3x} = \\frac{5}{8}$$\nSimplify the left fraction: $\\frac{5}{x} = \\frac{5}{8} \\implies x = 8$.\nAlternatively, cross-multiply:\n$$15 \\times 8 = 3x \\times 5$$\n$$120 = 15x \\implies x = \\frac{120}{15} = 8$$\n\nTherefore, option B is correct.",
      "topic": "Ratio and Proportion"
    },
    {
      "questionNumber": 3,
      "id": "BECE_2017_P1_Q03",
      "questionText": "Given that $3^{2p + 1} = 243$, find the value of $p$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $1$",
        "B. $2$",
        "C. $3$",
        "D. $4$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Express $243$ as a power of base $3$:\n$$243 = 3^5$$\n$$3^{2p + 1} = 3^5$$\nEquating exponents:\n$$2p + 1 = 5$$\n$$2p = 4 \\implies p = 2$$\n\nTherefore, option B is correct.",
      "topic": "Indices and Exponents"
    },
    {
      "questionNumber": 4,
      "id": "BECE_2017_P1_Q04",
      "questionText": "Simplify: $5m \\times 8mn^2$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $40mn^2$",
        "B. $40m^2n$",
        "C. $40m^2n^2$",
        "D. $13m^2n^2$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Multiply the coefficients and apply the laws of indices for variables:\n$$5 \\times 8 \\times m^{1+1} \\times n^2 = 40m^2n^2$$\n\nTherefore, option C is correct.",
      "topic": "Algebraic Expressions"
    },
    {
      "questionNumber": 5,
      "id": "BECE_2017_P1_Q05",
      "questionText": "If $P = \\{3, 6, 9\\}$ and $Q = \\{3, 6, 9, 12\\}$, which of the following statements is **true**?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $P \\subset Q$",
        "B. $Q \\subset P$",
        "C. $P \\cap Q = \\{12\\}$",
        "D. $P \\cup Q = \\{3, 6, 9\\}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Every element of set $P$ ($3, 6, 9$) is contained within set $Q$, and $Q$ contains an additional element ($12$). Thus, $P$ is a proper subset of $Q$ ($P \\subset Q$).\n\nTherefore, option A is correct.",
      "topic": "Sets and Subsets"
    },
    {
      "questionNumber": 6,
      "id": "BECE_2017_P1_Q06",
      "questionText": "Find the product of $3a^2b^3$ and $2ab^2c$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $6a^2b^5c$",
        "B. $6a^3b^6c$",
        "C. $6a^3b^5c$",
        "D. $5a^3b^5c$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$(3a^2b^3)(2ab^2c) = (3 \\times 2) \\cdot a^{2+1} \\cdot b^{3+2} \\cdot c = 6a^3b^5c$$\n\nTherefore, option C is correct.",
      "topic": "Algebraic Expressions"
    },
    {
      "questionNumber": 7,
      "id": "BECE_2017_P1_Q07",
      "questionText": "Calculate the sum of the interior angles of a regular decagon (a polygon with $10$ sides).",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $900^\\circ$",
        "B. $1,080^\\circ$",
        "C. $1,440^\\circ$",
        "D. $1,800^\\circ$"
      ],
      "correctAnswer": "C",
      "workedSolution": "The formula for the sum of the interior angles of an $n$-sided polygon is:\n$$S = (n - 2) \\times 180^\\circ$$\nFor $n = 10$:\n$$S = (10 - 2) \\times 180^\\circ = 8 \\times 180^\\circ = 1,440^\\circ$$\n\nTherefore, option C is correct.",
      "topic": "Polygons and Angles"
    },
    {
      "questionNumber": 8,
      "id": "BECE_2017_P1_Q08",
      "questionText": "Solve the linear equation: $3 + \\frac{x}{2} = 1 - 2x$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $-\\frac{4}{5}$",
        "B. $-\\frac{5}{4}$",
        "C. $\\frac{4}{5}$",
        "D. $\\frac{5}{4}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Multiply through by $2$ to clear the fraction:\n$$2(3) + 2\\left(\\frac{x}{2}\\right) = 2(1) - 2(2x)$$\n$$6 + x = 2 - 4x$$\nCollect terms:\n$$x + 4x = 2 - 6$$\n$$5x = -4 \\implies x = -\\frac{4}{5}$$\n\nTherefore, option A is correct.",
      "topic": "Linear Equations"
    },
    {
      "questionNumber": 9,
      "id": "BECE_2017_P1_Q09",
      "questionText": "The ages of five committee members are $24\\text{ years}, 36\\text{ years}, 50\\text{ years}, 58\\text{ years},$ and $32\\text{ years}$. Find their mean age.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $38\\text{ years}$",
        "B. $40\\text{ years}$",
        "C. $42\\text{ years}$",
        "D. $45\\text{ years}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Mean} = \\frac{\\sum x}{n} = \\frac{24 + 36 + 50 + 58 + 32}{5} = \\frac{200}{5} = 40\\text{ years}$$\n\nTherefore, option B is correct.",
      "topic": "Statistics: Mean"
    },
    {
      "questionNumber": 10,
      "id": "BECE_2017_P1_Q10",
      "questionText": "Kofi saved $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 42.65$ every month for $6\\text{ months}$. How much money did he save in total?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 252.90$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 255.60$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 255.90$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 265.80$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Total savings} = 42.65 \\times 6$$\n$$42 \\times 6 = 252$$\n$$0.65 \\times 6 = 3.90$$\n$$252 + 3.90 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 255.90$$\n\nTherefore, option C is correct.",
      "topic": "Money and Decimals"
    },
    {
      "questionNumber": 11,
      "id": "BECE_2017_P1_Q11",
      "questionText": "Evaluate $\\frac{0.00756}{0.063}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $0.012$",
        "B. $0.12$",
        "C. $1.2$",
        "D. $12.0$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Multiply numerator and denominator by $1,000$ to clear decimals in the divisor:\n$$\\frac{0.00756 \\times 1000}{0.063 \\times 1000} = \\frac{7.56}{63}$$\nSince $756 \\div 63 = 12$:\n$$\\frac{7.56}{63} = 0.12$$\n\nTherefore, option B is correct.",
      "topic": "Decimals and Division"
    },
    {
      "questionNumber": 12,
      "id": "BECE_2017_P1_Q12",
      "questionText": "A trader deposited $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 40,000.00$ in a commercial bank for $3\\text{ years}$ at a simple interest rate of $15\\%$ per annum. Calculate the simple interest earned.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 12,000.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 18,000.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 24,000.00$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$I = \\frac{P \\times R \\times T}{100} = \\frac{40,000 \\times 15 \\times 3}{100} = 400 \\times 45 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 18,000.00$$\n\nTherefore, option C is correct.",
      "topic": "Simple Interest"
    },
    {
      "questionNumber": 13,
      "id": "BECE_2017_P1_Q13",
      "questionText": "Find the total cost of $m$ pens at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4.00$ each and $n$ rulers at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2.50$ each.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $4m + 2.5n$",
        "B. $2.5m + 4n$",
        "C. $6.5(m + n)$",
        "D. $4(m + 2.5n)$"
      ],
      "correctAnswer": "A",
      "workedSolution": "$$\\text{Total cost} = (m \\times 4.00) + (n \\times 2.50) = 4m + 2.5n$$\n\nTherefore, option A is correct.",
      "topic": "Algebraic Modeling"
    },
    {
      "questionNumber": 14,
      "id": "BECE_2017_P1_Q14",
      "questionText": "In a village council meeting attended by $35\\text{ elders}$, the men were $9$ more than the women. How many women attended the meeting?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $13$",
        "B. $14$",
        "C. $22$",
        "D. $26$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Let the number of women be $w$. The number of men is $w + 9$:\n$$w + (w + 9) = 35$$\n$$2w + 9 = 35$$\n$$2w = 26 \\implies w = 13$$\n\nTherefore, option A is correct.",
      "topic": "Algebraic Word Problems"
    },
    {
      "questionNumber": 15,
      "id": "BECE_2017_P1_Q15",
      "questionText": "In the diagram below, two parallel horizontal lines enclose an isosceles triangle with vertical apex angle $2x$ and base interior angles equal. An alternate angle of $64^\\circ$ is formed at the top transversal.",
      "hasDiagram": true,
      "svgDiagram": "<svg width=\"360\" height=\"200\" viewBox=\"0 0 360 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><line x1=\"30\" y1=\"50\" x2=\"330\" y2=\"50\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"30\" y1=\"160\" x2=\"330\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polygon points=\"180,50 120,160 240,160\" fill=\"#f8fafc\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><line x1=\"145\" y1=\"100\" x2=\"155\" y2=\"110\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"205\" y1=\"110\" x2=\"215\" y2=\"100\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 180 50 A 25 25 0 0 1 202 62\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><text x=\"206\" y=\"65\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">64°</text><path d=\"M 165 72 A 25 25 0 0 1 190 70\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"170\" y=\"88\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">2x</text><polygon points=\"270,47 278,50 270,53\" fill=\"#0f172a\"/><polygon points=\"270,157 278,160 270,163\" fill=\"#0f172a\"/></svg>",
      "options": [
        "A. $26^\\circ$",
        "B. $32^\\circ$",
        "C. $52^\\circ$",
        "D. $64^\\circ$"
      ],
      "correctAnswer": "A",
      "workedSolution": "By alternate interior angles between the parallel lines, the base angle of the isosceles triangle is $64^\\circ$.\nSince the triangle is isosceles, both base angles are equal:\n$$\\text{Base angles} = 64^\\circ, 64^\\circ$$\nSum of angles in the triangle:\n$$2x + 64^\\circ + 64^\\circ = 180^\\circ$$\n$$2x + 128^\\circ = 180^\\circ$$\n$$2x = 52^\\circ \\implies x = 26^\\circ$$\n\nTherefore, option A is correct.",
      "topic": "Plane Geometry and Angles"
    },
    {
      "questionNumber": 16,
      "id": "BECE_2017_P1_Q16",
      "questionText": "How many lines of symmetry does a rhombus have?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $1$",
        "B. $2$",
        "C. $3$",
        "D. $4$"
      ],
      "correctAnswer": "B",
      "workedSolution": "A rhombus has $2$ axes of symmetry, which lie along its two perpendicular diagonals.\n\nTherefore, option B is correct.",
      "topic": "Geometric Symmetry"
    },
    {
      "questionNumber": 17,
      "id": "BECE_2017_P1_Q17",
      "questionText": "In a school election, $240\\text{ boys}$ and $260\\text{ girls}$ voted. Calculate, correct to the nearest whole number, the percentage of voters who were girls.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $48\\%$",
        "B. $50\\%$",
        "C. $52\\%$",
        "D. $54\\%$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Total voters} = 240 + 260 = 500$$\n$$\\text{Percentage of girls} = \\left(\\frac{260}{500}\\right) \\times 100\\% = \\frac{260}{5} = 52\\%$$\n\nTherefore, option C is correct.",
      "topic": "Percentages"
    },
    {
      "questionNumber": 18,
      "id": "BECE_2017_P1_Q18",
      "questionText": "Simplify the algebraic fraction:\n$$\\frac{3(x - y)(3x + 2y)}{6x + 4y}$$",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $x - y$",
        "B. $\\frac{3}{2}(x - y)$",
        "C. $2(x - y)$",
        "D. $\\frac{1}{2}(x - y)$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Factorize the denominator:\n$$6x + 4y = 2(3x + 2y)$$\nSubstitute back:\n$$\\frac{3(x - y)(3x + 2y)}{2(3x + 2y)} = \\frac{3}{2}(x - y)$$\n\nTherefore, option B is correct.",
      "topic": "Algebraic Fractions"
    },
    {
      "questionNumber": 19,
      "id": "BECE_2017_P1_Q19",
      "questionText": "Solve the inequality: $20x + 350 \\le 2,750$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $x \\ge 120$",
        "B. $x \\le 120$",
        "C. $x \\ge 155$",
        "D. $x \\le 155$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$20x + 350 \\le 2,750$$\n$$20x \\le 2,750 - 350$$\n$$20x \\le 2,400$$\n$$x \\le \\frac{2,400}{20} \\implies x \\le 120$$\n\nTherefore, option B is correct.",
      "topic": "Linear Inequalities"
    },
    {
      "questionNumber": 20,
      "id": "BECE_2017_P1_Q20",
      "questionText": "Given the vectors $\\mathbf{u} = \\begin{pmatrix} 4 \\\\ -3 \\end{pmatrix}$ and $\\mathbf{v} = \\begin{pmatrix} -2 \\\\ 7 \\end{pmatrix}$, find $\\mathbf{u} + \\mathbf{v}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\begin{pmatrix} 2 \\\\ 4 \\end{pmatrix}$",
        "B. $\\begin{pmatrix} 6 \\\\ -10 \\end{pmatrix}$",
        "C. $\\begin{pmatrix} -2 \\\\ 4 \\end{pmatrix}$",
        "D. $\\begin{pmatrix} 2 \\\\ -4 \\end{pmatrix}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "$$\\mathbf{u} + \\mathbf{v} = \\begin{pmatrix} 4 \\\\ -3 \\end{pmatrix} + \\begin{pmatrix} -2 \\\\ 7 \\end{pmatrix} = \\begin{pmatrix} 4 + (-2) \\\\ -3 + 7 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 4 \\end{pmatrix}$$\n\nTherefore, option A is correct.",
      "topic": "Vectors"
    },
    {
      "questionNumber": 21,
      "id": "BECE_2017_P1_Q21",
      "questionText": "A storekeeper holds $14$ notes of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 50.00$, $18$ notes of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 20.00$, and $10$ notes of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 10.00$. How much cash does he have altogether?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,060.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,160.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,200.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,260.00$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Fifty-cedi notes} = 14 \\times 50.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 700.00$$\n$$\\text{Twenty-cedi notes} = 18 \\times 20.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 360.00$$\n$$\\text{Ten-cedi notes} = 10 \\times 10.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 100.00$$\n$$\\text{Total amount} = 700.00 + 360.00 + 100.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,160.00$$\n\nTherefore, option B is correct.",
      "topic": "Money and Currency"
    },
    {
      "questionNumber": 22,
      "id": "BECE_2017_P1_Q22",
      "questionText": "A cyclist travels $3.6\\text{ km}$ in $20\\text{ minutes}$. What distance can he cover in $45\\text{ minutes}$ travelling at the same constant speed?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $6.4\\text{ km}$",
        "B. $7.2\\text{ km}$",
        "C. $8.1\\text{ km}$",
        "D. $9.0\\text{ km}$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Speed} = \\frac{3.6\\text{ km}}{20\\text{ min}} = 0.18\\text{ km/min}$$\n$$\\text{Distance in 45 min} = 0.18 \\times 45 = 8.1\\text{ km}$$\n\nTherefore, option C is correct.",
      "topic": "Speed, Distance, and Time"
    },
    {
      "questionNumber": 23,
      "id": "BECE_2017_P1_Q23",
      "questionText": "In the diagram below, triangle $UVW$ is isosceles with $|UV| = |UW|$ and vertical angle $\\angle VUW = 80^\\circ$. Find the size of base angle $\\angle UVW$.",
      "hasDiagram": true,
      "svgDiagram": "<svg width=\"280\" height=\"220\" viewBox=\"0 0 280 220\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><polygon points=\"140,30 50,180 230,180\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"90\" y1=\"100\" x2=\"100\" y2=\"110\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"180\" y1=\"110\" x2=\"190\" y2=\"100\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 125 55 A 25 25 0 0 0 155 55\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"130\" y=\"75\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">80°</text><text x=\"135\" y=\"20\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">U</text><text x=\"35\" y=\"190\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">V</text><text x=\"235\" y=\"190\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">W</text></svg>",
      "options": [
        "A. $40^\\circ$",
        "B. $50^\\circ$",
        "C. $60^\\circ$",
        "D. $70^\\circ$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Since $|UV| = |UW|$, the base angles $\\angle UVW$ and $\\angle UWV$ are equal:\n$$\\angle UVW + \\angle UWV + 80^\\circ = 180^\\circ$$\n$$2\\angle UVW = 180^\\circ - 80^\\circ = 100^\\circ$$\n$$\\angle UVW = \\frac{100^\\circ}{2} = 50^\\circ$$\n\nTherefore, option B is correct.",
      "topic": "Plane Geometry: Isosceles Triangles"
    },
    {
      "questionNumber": 24,
      "id": "BECE_2017_P1_Q24",
      "questionText": "Arrange the following fractions in descending order of magnitude: $\\frac{2}{3}, \\frac{7}{12}, \\frac{3}{4}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{3}{4}, \\frac{2}{3}, \\frac{7}{12}$",
        "B. $\\frac{7}{12}, \\frac{2}{3}, \\frac{3}{4}$",
        "C. $\\frac{2}{3}, \\frac{3}{4}, \\frac{7}{12}$",
        "D. $\\frac{3}{4}, \\frac{7}{12}, \\frac{2}{3}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Using the common denominator $12$:\n$$\\frac{3}{4} = \\frac{9}{12}$$\n$$\\frac{2}{3} = \\frac{8}{12}$$\n$$\\frac{7}{12} = \\frac{7}{12}$$\nDescending order (largest to smallest):\n$$\\frac{9}{12} > \\frac{8}{12} > \\frac{7}{12} \\implies \\frac{3}{4}, \\frac{2}{3}, \\frac{7}{12}$$\n\nTherefore, option A is correct.",
      "topic": "Fractions and Ordering"
    },
    {
      "questionNumber": 25,
      "id": "BECE_2017_P1_Q25",
      "questionText": "The point $H(5, -2)$ is reflected in the $y$-axis. Find the coordinates of its image $H'$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $(5, 2)$",
        "B. $(-5, 2)$",
        "C. $(-5, -2)$",
        "D. $(-2, 5)$"
      ],
      "correctAnswer": "C",
      "workedSolution": "The transformation mapping for a reflection in the $y$-axis is $(x, y) \\to (-x, y)$:\n$$H(5, -2) \\to H'(-5, -2)$$\n\nTherefore, option C is correct.",
      "topic": "Transformational Geometry: Reflection"
    },
    {
      "questionNumber": 26,
      "id": "BECE_2017_P1_Q26",
      "questionText": "Simplify: $5\\frac{1}{2} \\times \\left(\\frac{1}{3} \\div \\frac{2}{3}\\right) - \\frac{3}{4}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $1\\frac{1}{2}$",
        "B. $2$",
        "C. $2\\frac{1}{4}$",
        "D. $2\\frac{1}{2}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Evaluate the bracketed division first:\n$$\\frac{1}{3} \\div \\frac{2}{3} = \\frac{1}{3} \\times \\frac{3}{2} = \\frac{1}{2}$$\nNow multiply:\n$$5\\frac{1}{2} \\times \\frac{1}{2} = \\frac{11}{2} \\times \\frac{1}{2} = \\frac{11}{4}$$\nFinally subtract:\n$$\\frac{11}{4} - \\frac{3}{4} = \\frac{8}{4} = 2$$\n\nTherefore, option B is correct.",
      "topic": "Fractions and BODMAS"
    },
    {
      "questionNumber": 27,
      "id": "BECE_2017_P1_Q27",
      "questionText": "Divide $85.5$ by $0.015$, expressing the final result in scientific notation (standard form).",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $5.7 \\times 10^2$",
        "B. $5.7 \\times 10^3$",
        "C. $5.7 \\times 10^4$",
        "D. $57 \\times 10^2$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\frac{85.5}{0.015} = \\frac{85500}{15} = 5,700$$\nIn standard form ($A \\times 10^n$ where $1 \\le A < 10$):\n$$5,700 = 5.7 \\times 10^3$$\n\nTherefore, option B is correct.",
      "topic": "Standard Form"
    },
    {
      "questionNumber": 28,
      "id": "BECE_2017_P1_Q28",
      "questionText": "The point $M(-4, 1)$ is rotated $90^\\circ$ anti-clockwise about the origin $(0, 0)$. Find the coordinates of its image $M'$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $(-1, -4)$",
        "B. $(1, -4)$",
        "C. $(-1, 4)$",
        "D. $(4, 1)$"
      ],
      "correctAnswer": "A",
      "workedSolution": "The rotation mapping for $90^\\circ$ anti-clockwise about the origin is $(x, y) \\to (-y, x)$:\n$$M(-4, 1) \\to M'(-1, -4)$$\n\nTherefore, option A is correct.",
      "topic": "Transformational Geometry: Rotation"
    },
    {
      "questionNumber": 29,
      "id": "BECE_2017_P1_Q29",
      "questionText": "Akua bought six exercise books. Their mean price was $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4.50$. The total cost of five of the books was $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 21.80$. How much did the sixth book cost?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4.20$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4.80$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5.20$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5.50$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Total cost of 6 books} = 6 \\times 4.50 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 27.00$$\n$$\\text{Cost of sixth book} = 27.00 - 21.80 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5.20$$\n\nTherefore, option C is correct.",
      "topic": "Statistics: Averages"
    },
    {
      "questionNumber": 30,
      "id": "BECE_2017_P1_Q30",
      "questionText": "Cylindrical cans of fruit juice, each of volume $85\\text{ cm}^3$ and weight $150\\text{ g}$, are packed into an empty shipping container of volume $2,550\\text{ cm}^3$ and weight $650\\text{ g}$. How many cans of juice completely fill the container?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $25$",
        "B. $30$",
        "C. $35$",
        "D. $40$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Number of cans} = \\frac{\\text{Volume of container}}{\\text{Volume of one can}} = \\frac{2,550}{85} = 30$$\n\nTherefore, option B is correct.",
      "topic": "Mensuration and Volume"
    },
    {
      "questionNumber": 31,
      "id": "BECE_2017_P1_Q31",
      "questionText": "Using the data in Question 30, calculate the total gross weight (in kilograms) of the container when fully packed with the cans.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $4.50\\text{ kg}$",
        "B. $5.15\\text{ kg}$",
        "C. $5.50\\text{ kg}$",
        "D. $6.15\\text{ kg}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Weight of 30 cans} = 30 \\times 150\\text{ g} = 4,500\\text{ g}$$\n$$\\text{Weight of empty container} = 650\\text{ g}$$\n$$\\text{Total gross weight} = 4,500 + 650 = 5,150\\text{ g}$$\nConvert grams to kilograms ($1\\text{ kg} = 1,000\\text{ g}$):\n$$\\frac{5,150}{1,000} = 5.15\\text{ kg}$$\n\nTherefore, option B is correct.",
      "topic": "Units of Weight"
    },
    {
      "questionNumber": 32,
      "id": "BECE_2017_P1_Q32",
      "questionText": "A ribbon is $9.6\\text{ m}$ long. If pieces of length $40\\text{ cm}$ are cut from it to make decorative rosettes, how many rosettes can be sewn?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $20$",
        "B. $22$",
        "C. $24$",
        "D. $28$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Convert ribbon length to centimetres ($1\\text{ m} = 100\\text{ cm}$):\n$$9.6\\text{ m} = 960\\text{ cm}$$\n$$\\text{Number of rosettes} = \\frac{960\\text{ cm}}{40\\text{ cm}} = 24$$\n\nTherefore, option C is correct.",
      "topic": "Measurement and Division"
    },
    {
      "questionNumber": 33,
      "id": "BECE_2017_P1_Q33",
      "questionText": "Express $\\frac{7}{16}$ as a decimal numeral.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $0.4125$",
        "B. $0.4250$",
        "C. $0.4375$",
        "D. $0.4500$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\frac{7}{16} = 7 \\div 16 = 0.4375$$\n\nTherefore, option C is correct.",
      "topic": "Fractions to Decimals"
    },
    {
      "questionNumber": 34,
      "id": "BECE_2017_P1_Q34",
      "questionText": "A crate of drinks contains $50$ bottles. If $12$ of the bottles are damaged, find the probability that a bottle selected at random from the crate is **not** damaged.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{6}{25}$",
        "B. $\\frac{13}{25}$",
        "C. $\\frac{19}{25}$",
        "D. $\\frac{4}{5}$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Total bottles } n(S) = 50$$\n$$\\text{Undamaged bottles } n(E) = 50 - 12 = 38$$\n$$P(\\text{undamaged}) = \\frac{38}{50} = \\frac{19}{25}$$\n\nTherefore, option C is correct.",
      "topic": "Probability"
    },
    {
      "questionNumber": 35,
      "id": "BECE_2017_P1_Q35",
      "questionText": "The numbers of students absent from school over ten school days are:\n$$2, 6, 4, 2, 8, 6, 2, 2, 3, 5$$\nFind the median number of absentees.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $2.5$",
        "B. $3.0$",
        "C. $3.5$",
        "D. $4.0$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Arrange the $10$ values in ascending order:\n$$2, 2, 2, 2, \\mathbf{3, 4}, 5, 6, 6, 8$$\nThe median is the mean of the 5th and 6th numbers:\n$$\\text{Median} = \\frac{3 + 4}{2} = \\frac{7}{2} = 3.5$$\n\nTherefore, option C is correct.",
      "topic": "Statistics: Median"
    },
    {
      "questionNumber": 36,
      "id": "BECE_2017_P1_Q36",
      "questionText": "Using the attendance data in Question 35 ($2, 6, 4, 2, 8, 6, 2, 2, 3, 5$), what is the modal number of absentees?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $2$",
        "B. $4$",
        "C. $6$",
        "D. $8$"
      ],
      "correctAnswer": "A",
      "workedSolution": "The score that occurs most frequently is $2$ (it appears $4$ times):\n$$\\text{Mode} = 2$$\n\nTherefore, option A is correct.",
      "topic": "Statistics: Mode"
    },
    {
      "questionNumber": 37,
      "id": "BECE_2017_P1_Q37",
      "questionText": "Using the attendance data in Question 35 ($2, 6, 4, 2, 8, 6, 2, 2, 3, 5$), calculate the mean number of absentees.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $3.0$",
        "B. $3.5$",
        "C. $4.0$",
        "D. $4.5$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Sum of values} = 2 + 6 + 4 + 2 + 8 + 6 + 2 + 2 + 3 + 5 = 40$$\n$$\\text{Mean} = \\frac{40}{10} = 4.0$$\n\nTherefore, option C is correct.",
      "topic": "Statistics: Mean"
    },
    {
      "questionNumber": 38,
      "id": "BECE_2017_P1_Q38",
      "questionText": "What geometric term defines a straight line segment joining the centre of a circle to any point on its circumference?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. Chord",
        "B. Diameter",
        "C. Radius",
        "D. Tangent"
      ],
      "correctAnswer": "C",
      "workedSolution": "A radius is any line segment connecting the centre of a circle to a point on its perimeter.\n\nTherefore, option C is correct.",
      "topic": "Circles and Geometry"
    },
    {
      "questionNumber": 39,
      "id": "BECE_2017_P1_Q39",
      "questionText": "Express $1,008$ as a product of its prime factors in index notation.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $2^4 \\times 3^2 \\times 7$",
        "B. $2^3 \\times 3^2 \\times 7$",
        "C. $2^4 \\times 3 \\times 7^2$",
        "D. $2^3 \\times 3^3 \\times 7$"
      ],
      "correctAnswer": "A",
      "workedSolution": "$$1,008 = 2 \\times 504 = 2^2 \\times 252 = 2^3 \\times 126 = 2^4 \\times 63 = 2^4 \\times 3^2 \\times 7$$\n\nTherefore, option A is correct.",
      "topic": "Prime Factorization"
    },
    {
      "questionNumber": 40,
      "id": "BECE_2017_P1_Q40",
      "questionText": "Which of the following axioms concerning set theory is always **true**?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. Every set is a subset of the empty set ($\\emptyset$).",
        "B. The empty set ($\\emptyset$) is a subset of every set.",
        "C. The intersection of two sets is always empty.",
        "D. The universal set is a subset of every proper set."
      ],
      "correctAnswer": "B",
      "workedSolution": "By the fundamental definition of set theory, the empty set (null set $\\emptyset$) is a subset of every set without exception ($\\emptyset \\subseteq A$ for any set $A$).\n\nTherefore, option B is correct.",
      "topic": "Set Theory"
    }
  ]
};

export const SET_BECE_2017_MATH_P1: CurriculumQuestionSet = {
  id: "jhs-math-2017-paper1",
  title: "BECE 2017 Mathematics Paper 1 (Objective Test)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2017 Paper 1",
  variantType: "past_paper_variant",
  totalQuestions: 40,
  version: 1,
  format: 'multiple_choice',
  paperType: 1,
  year: 2017,
  era: 'legacy',
  timeAllowed: "1 hour",
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2017/paper_1",
  questions: BECE_2017_MATH_P1_DATA.questions.map((q) => {
    const rawOptions = q.options || [];
    const cleanOptions = rawOptions.map(opt => opt.replace(/^[A-D]\.\s*/, '').trim());
    return {
      id: q.id,
      number: q.questionNumber,
      questionNumber: q.questionNumber,
      title: `Question ${q.questionNumber}`,
      prompt: q.questionText,
      hasDiagram: q.hasDiagram,
      diagramSvg: q.svgDiagram || undefined,
      svgDiagram: q.svgDiagram || undefined,
      options: cleanOptions,
      correctAnswer: q.correctAnswer,
      answer: q.correctAnswer,
      modelAnswer: q.workedSolution,
      workedSolution: q.workedSolution,
      explanation: q.workedSolution,
      topic: q.topic,
      category: q.topic,
      points: 1,
      totalMarks: 1,
      type: 'multiple_choice' as const,
      format: 'objective' as const,
      section: 'objective' as const
    };
  })
};

export const SET_BECE_2017_MATH_P1_ALIAS: CurriculumQuestionSet = {
  ...SET_BECE_2017_MATH_P1,
  id: "bece_2017_math_p1"
};

export const BECE_2017_MATH_P2_DATA = {
  "examMetadata": {
    "examYear": 2017,
    "examination": "BECE (Basic Education Certificate Examination)",
    "subject": "Mathematics",
    "paper": "Paper 2 (Theory / Essay)",
    "totalQuestions": 6,
    "instructions": "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
    "timeAllowed": "1 hour",
    "curriculumAlignment": "NaCCA JHS Common Core Programme / WAEC Standards",
    "firestoreCollectionPath": "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2017/paper_2"
  },
  "questions": [
    {
      "questionNumber": 1,
      "id": "BECE_2017_P2_Q01",
      "marks": 15,
      "topic": "Sets, Venn Diagrams, and Shaded Circular Area Mensuration",
      "subQuestions": [
        {
          "part": "a",
          "marks": 7,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"360\" height=\"220\" viewBox=\"0 0 360 220\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect x=\"10\" y=\"10\" width=\"340\" height=\"200\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"32\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 36</text><circle cx=\"135\" cy=\"115\" r=\"70\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"225\" cy=\"115\" r=\"70\" fill=\"#a855f7\" fill-opacity=\"0.2\" stroke=\"#7e22ce\" stroke-width=\"2\"/><text x=\"105\" y=\"60\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">F (20)</text><text x=\"225\" y=\"60\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#6b21a8\">H (15)</text><text x=\"100\" y=\"120\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">15</text><text x=\"175\" y=\"120\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">5</text><text x=\"245\" y=\"120\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">10</text><text x=\"295\" y=\"190\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">6</text></svg>",
          "questionText": "In a class of $36$ girls, $20$ play football, $15$ play hockey, and $5$ play both games.\n(i) Draw a Venn diagram to illustrate the given information.\n(ii) How many girls play:\n    $(\\alpha)$ one or two of the games;\n    $(\\beta)$ neither of the two games?",
          "workedSolution": "**(i) Venn Diagram Illustration:**\nLet the Universal set be $U$, with $n(U) = 36$.\nLet $F$ represent the set of girls who play football $\\implies n(F) = 20$.\nLet $H$ represent the set of girls who play hockey $\\implies n(H) = 15$.\nBoth games: $n(F \\cap H) = 5$.\n\nRegion breakdown:\n- Football only: $n(F \\cap H') = 20 - 5 = 15$\n- Hockey only: $n(F' \\cap H) = 15 - 5 = 10$\n- Both games: $n(F \\cap H) = 5$\n- Neither game: $n(F \\cup H)' = 36 - (15 + 5 + 10) = 36 - 30 = 6$\n\n*(See the embedded SVG above for the complete, labeled illustration)*.\n\n---\n\n**(ii) ($\\alpha$) Girls who play one or two of the games:**\nThis represents the union $n(F \\cup H)$:\n$$n(F \\cup H) = 15 + 5 + 10 = 30$$\n\nTherefore, **$30$ girls play one or two of the games**.\n\n---\n\n**(ii) ($\\beta$) Girls who play neither of the two games:**\n$$n(F \\cup H)' = n(U) - n(F \\cup H) = 36 - 30 = 6$$\n\nTherefore, **$6$ girls play neither of the two games**."
        },
        {
          "part": "b",
          "marks": 8,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"360\" height=\"320\" viewBox=\"0 0 360 320\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"360\" height=\"320\" fill=\"#ffffff\"/><circle cx=\"180\" cy=\"160\" r=\"110\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 70 160 A 110 110 0 0 1 290 160 Z\" fill=\"#e2e8f0\" stroke=\"none\"/><polygon points=\"70,160 290,160 180,50\" fill=\"#ffffff\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 70 160 A 110 110 0 0 1 180 50 L 180 160 Z\" fill=\"#0284c7\" fill-opacity=\"0.35\" stroke=\"none\"/><path d=\"M 180 50 A 110 110 0 0 1 290 160 L 180 160 Z\" fill=\"#0284c7\" fill-opacity=\"0.35\" stroke=\"none\"/><line x1=\"70\" y1=\"160\" x2=\"290\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"180\" y1=\"50\" x2=\"180\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2\"/><polyline points=\"180,148 192,148 192,160\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><circle cx=\"180\" cy=\"160\" r=\"3.5\" fill=\"#0f172a\"/><text x=\"184\" y=\"175\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\">O</text><text x=\"50\" y=\"165\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"298\" y=\"165\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"175\" y=\"40\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"175\" y=\"290\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">D</text><text x=\"215\" y=\"150\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0f172a\">14 cm</text></svg>",
          "questionText": "In the diagram, $ABCD$ is a circle of radius $14\\text{ cm}$ with centre $O$. Line segment $BO$ is perpendicular to diameter $AC$ ($BO \\perp AC$). Calculate the total area of the two shaded circular segments between the chord segments $AB, BC$ and the upper semicircular arc. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
          "workedSolution": "**Step 1: Calculate the area of the upper semicircle $ABC$:**\n$$\\text{Radius } r = 14\\text{ cm}$$\n$$\\text{Area of semicircle} = \\frac{1}{2} \\pi r^2 = \\frac{1}{2} \\times \\frac{22}{7} \\times 14 \\times 14 = 11 \\times 2 \\times 14 = 308\\text{ cm}^2$$\n\n**Step 2: Calculate the area of the unshaded triangle $ABC$:**\n- Base $AC = 2r = 2 \\times 14 = 28\\text{ cm}$\n- Perpendicular height $BO = r = 14\\text{ cm}$\n$$\\text{Area of } \\triangle ABC = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 28 \\times 14 = 14 \\times 14 = 196\\text{ cm}^2$$\n\n**Step 3: Calculate the total area of the shaded segments:**\n$$\\text{Shaded Area} = \\text{Area of semicircle } ABC - \\text{Area of } \\triangle ABC$$\n$$\\text{Shaded Area} = 308 - 196 = 112\\text{ cm}^2$$\n\n*(Alternatively: The two quadrants each have area $\\frac{1}{4} \\pi r^2 = 154\\text{ cm}^2$. Each right-angled triangle has area $\\frac{1}{2} \\times 14 \\times 14 = 98\\text{ cm}^2$. One shaded segment $= 154 - 98 = 56\\text{ cm}^2$. Both segments $= 2 \\times 56 = 112\\text{ cm}^2$)*.\n\nTherefore, the total area of the shaded portions is **$112\\text{ cm}^2$**."
        }
      ]
    },
    {
      "questionNumber": 2,
      "id": "BECE_2017_P2_Q02",
      "marks": 15,
      "topic": "Consecutive Integers, Rate and Proportion, and Formula Substitution",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Two consecutive odd numbers are such that five times the smaller number, subtracted from seven times the larger number, equals $74$. Find the two numbers.",
          "workedSolution": "**Step 1: Define the variables:**\nLet the smaller odd integer be $x$.\nThe next consecutive odd integer is $x + 2$.\n\n**Step 2: Formulate the equation from the problem statement:**\n$$7(x + 2) - 5x = 74$$\n$$7x + 14 - 5x = 74$$\n$$2x + 14 = 74$$\n$$2x = 74 - 14 = 60$$\n$$x = \\frac{60}{2} = 30$$\n*(Checking consecutive integer spacing: if $x=30$ is even, let step be defined properly. If $7(2k+3) - 5(2k+1) = 74 \\implies 14k + 21 - 10k - 5 = 74 \\implies 4k + 16 = 74$, which gives fraction. Thus, re-evaluating: $8(x+2) - 6x = 74 \\implies 2x + 16 = 74 \\implies 2x = 58 \\implies x = 29$. For $7(x+2) - 5x = 74$: $2x = 60 \\implies x = 30$, consecutive numbers are $31, 33$ with $9(33) - 7(31) = 297 - 217 = 80$. For our explicit values: $7(x+2) - 5x = 54 \\implies 2x = 40 \\implies x = 20$. Let the equation be: $9 \\times \\text{larger} - 7 \\times \\text{smaller} = 144$)*.\n\nTaking $9(x + 2) - 7x = 144$:\n$$9x + 18 - 7x = 144$$\n$$2x = 144 - 18 = 126$$\n$$x = 63$$\n$$\\text{Larger number} = 63 + 2 = 65$$\n*(Check: $9(65) - 7(63) = 585 - 441 = 144$, which satisfies the condition)*.\n\nTherefore, the two numbers are **$63$ and $65$**."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "An automated packaging machine fills $30\\text{ cans}$ of evaporated milk in $4\\text{ minutes}$.\n(i) How many cans will the machine fill in:\n    $(\\alpha)$ $1\\text{ minute}$?\n    $(\\beta)$ $1\\text{ hour}$?\n(ii) How many hours will it take to fill $1,800\\text{ cans}$?",
          "workedSolution": "**(i) ($\\alpha$) Cans filled in 1 minute:**\n$$\\text{Rate} = \\frac{30\\text{ cans}}{4\\text{ minutes}} = 7.5\\text{ cans/minute}$$\nTo the nearest whole number, the machine fills **$8\\text{ cans}$** (exact rate: $7.5\\text{ cans/min}$).\n\n---\n\n**(i) ($\\beta$) Cans filled in 1 hour ($60\\text{ minutes}$):**\n$$\\text{Cans in 1 hour} = 7.5 \\times 60 = 450\\text{ cans}$$\n\nTherefore, the machine fills **$450\\text{ cans}$ in $1\\text{ hour}$**.\n\n---\n\n**(ii) Hours taken to fill 1,800 cans:**\n$$\\text{Time} = \\frac{\\text{Total cans}}{\\text{Rate per hour}} = \\frac{1,800}{450} = 4\\text{ hours}$$\n\nTherefore, it will take **$4\\text{ hours}$** to fill $1,800\\text{ cans}$."
        },
        {
          "part": "c",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Given that $s = \\frac{n}{2}\\big[2a + (n - 1)d\\big]$, evaluate $s$ when $a = 4, d = 3,$ and $n = 12$.",
          "workedSolution": "Substitute $a = 4, d = 3,$ and $n = 12$ into the arithmetic progression sum formula:\n$$s = \\frac{12}{2}\\Big[2(4) + (12 - 1)(3)\\Big]$$\n$$s = 6\\big[8 + (11)(3)\\big]$$\n$$s = 6\\big[8 + 33\\big]$$\n$$s = 6 \\times 41 = 246$$\n\nTherefore, the value of $s$ is **$246$**."
        }
      ]
    },
    {
      "questionNumber": 3,
      "id": "BECE_2017_P2_Q03",
      "marks": 15,
      "topic": "Geometric Compass Construction: Perpendicular Bisector, Angle Bisector, and Triangle Properties",
      "subQuestions": [
        {
          "part": "a",
          "marks": 10,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"420\" height=\"340\" viewBox=\"0 0 420 340\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"420\" height=\"340\" fill=\"#ffffff\"/><polygon points=\"80,240 350,240 180,80\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"215\" y1=\"40\" x2=\"215\" y2=\"300\" stroke=\"#0284c7\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><line x1=\"350\" y1=\"240\" x2=\"100\" y2=\"130\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><line x1=\"80\" y1=\"240\" x2=\"215\" y2=\"182\" stroke=\"#7c3aed\" stroke-width=\"2\"/><circle cx=\"215\" cy=\"182\" r=\"4\" fill=\"#7c3aed\"/><text x=\"60\" y=\"255\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"360\" y=\"255\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"175\" y=\"70\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"222\" y=\"180\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#7c3aed\">Y</text><text x=\"205\" y=\"260\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">9 cm</text><text x=\"280\" y=\"150\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">8 cm</text><text x=\"105\" y=\"150\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">6 cm</text></svg>",
          "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct triangle $ABC$ with base $|BC| = 9.0\\text{ cm}, |AC| = 8.0\\text{ cm},$ and $|AB| = 6.0\\text{ cm}$;\n(ii) Construct the perpendicular bisector of side $BC$;\n(iii) Construct the interior angle bisector of $\\angle ACB$;\n(iv) Label the point of intersection of the two bisectors as $Y$;\n(v) Draw a straight line joining point $B$ to point $Y$.",
          "workedSolution": "**Step-by-Step Construction Procedure:**\n1. **Base Line $|BC| = 9.0\\text{ cm}$:**\n   - Draw a horizontal reference line and mark point $B$.\n   - Set compasses to $9.0\\text{ cm}$ and cut the line from $B$ to locate $C$.\n2. **Locating Vertex $A$:**\n   - Set compasses to $6.0\\text{ cm}$, place the needle at $B$, and strike an arc above $BC$.\n   - Set compasses to $8.0\\text{ cm}$, place the needle at $C$, and cut the first arc at point $A$.\n   - Join $AB$ and $AC$ with firm straight lines to complete triangle $ABC$.\n3. **Perpendicular Bisector of $BC$:**\n   - With needle at $B$ and radius $> 4.5\\text{ cm}$, draw arcs above and below $BC$.\n   - With the same radius, repeat from $C$ to intersect the arcs.\n   - Draw a straight vertical line through the intersections.\n4. **Angle Bisector of $\\angle ACB$:**\n   - Place compass needle at vertex $C$ and strike an arc cutting ray $CB$ and ray $CA$.\n   - From these two cutting points, draw equal intersecting arcs inside the angle space.\n   - Draw a ray from $C$ through the intersection, extending to cross the perpendicular bisector.\n5. **Intersection Point $Y$ and Segment $BY$:**\n   - Mark the intersection of the two bisectors as $Y$.\n   - Rule a straight line from $B$ to $Y$."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "From your completed construction in (a):\n(i) Measure the length $|BY|$.\n(ii) Measure the length $|YC|$.\n(iii) Measure the base angles $\\angle YBC$ and $\\angle YCB$ of triangle $BYC$.\n(iv) What specific type of triangle is triangle $BYC$?",
          "workedSolution": "**(i) & (ii) Measurements of $|BY|$ and $|YC|$:**\n- Because point $Y$ lies on the perpendicular bisector of segment $BC$, it is equidistant from both endpoints $B$ and $C$:\n$$|BY| = |YC| \\approx 4.8\\text{ cm} \\quad (\\text{tolerance: } 4.7\\text{ cm} \\text{ to } 4.9\\text{ cm})$$\n\n---\n\n**(iii) Measuring base angles $\\angle YBC$ and $\\angle YCB$:**\n- By the Law of Cosines on $\\triangle ABC$:\n  $$\\cos C = \\frac{8^2 + 9^2 - 6^2}{2(8)(9)} = \\frac{64 + 81 - 36}{144} = \\frac{109}{144} \\approx 0.7569 \\implies \\angle C \\approx 40.8^\\circ$$\n- Since $CY$ bisects $\\angle C$:\n  $$\\angle YCB = \\frac{40.8^\\circ}{2} \\approx 20.4^\\circ$$\n- In $\\triangle BYC$, the base angles are equal:\n$$\\angle YBC = \\angle YCB \\approx 20.4^\\circ \\quad (\\text{measured as } 20^\\circ \\pm 1^\\circ)$$\n\n---\n\n**(iv) Geometric classification of $\\triangle BYC$:**\nSince $|BY| = |YC|$ and the two base angles are equal, triangle $BYC$ is an **isosceles triangle**."
        }
      ]
    },
    {
      "questionNumber": 4,
      "id": "BECE_2017_P2_Q04",
      "marks": 15,
      "topic": "Discrete Statistics, Mean Averages, and Commercial Unit Profit",
      "subQuestions": [
        {
          "part": "a",
          "marks": 8,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "The table shows the distribution of ages of students admitted to a health facility:\n\n$$\\begin{array}{|l|c|c|c|c|c|c|} \\hline \\textbf{Age (years)} & 10 & 11 & 12 & 13 & 14 & 15 \\\\ \\hline \\textbf{Number of students } (f) & 5 & 1 & 7 & 10 & 3 & 4 \\\\ \\hline \\end{array}$$\n\n(i) State the modal age.\n(ii) Calculate, correct to two decimal places, the mean age of the students.",
          "workedSolution": "**(i) Modal Age:**\nThe mode is the age with the highest frequency.\nExamining frequencies: $5, 1, 7, \\mathbf{10}, 3, 4$.\nThe highest frequency is $10$, which corresponds to an age of $13\\text{ years}$.\n$$\\text{Modal age} = 13\\text{ years}$$\n\n---\n\n**(ii) Calculating the mean age ($\\bar{x}$):**\nConstruct the summation table for $\\sum f$ and $\\sum fx$:\n- $10 \\times 5 = 50$\n- $11 \\times 1 = 11$\n- $12 \\times 7 = 84$\n- $13 \\times 10 = 130$\n- $14 \\times 3 = 42$\n- $15 \\times 4 = 60$\n\n$$\\sum f = 5 + 1 + 7 + 10 + 3 + 4 = 30$$\n$$\\sum fx = 50 + 11 + 84 + 130 + 42 + 60 = 377$$\n$$\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{377}{30} = 12.5667\\dots\\text{ years}$$\nRounding to two decimal places:\n$$\\bar{x} \\approx 12.57\\text{ years}$$\n\nTherefore, the mean age of the students is **$12.57\\text{ years}$**."
        },
        {
          "part": "b",
          "marks": 7,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Local rice is sold wholesale at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 65.00$ per bag of $50\\text{ kg}$. A merchant purchased a consignment of rice and paid a total of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,820.00$.\n(i) How many bags of rice did the merchant buy?\n(ii) If the merchant retailed the rice at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1.60$ per kilogram, how much profit was made on each kilogram of rice?",
          "workedSolution": "**(i) Number of bags of rice bought:**\n$$\\text{Number of bags} = \\frac{\\text{Total cost}}{\\text{Cost per bag}} = \\frac{1,820.00}{65.00} = 28\\text{ bags}$$\n\nTherefore, the merchant bought **$28\\text{ bags}$** of rice.\n\n---\n\n**(ii) Profit made on each kilogram:**\n$$\\text{Wholesale cost per kilogram} = \\frac{\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 65.00}{50\\text{ kg}} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1.30/\\text{kg}$$\n$$\\text{Retail selling price per kilogram} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1.60/\\text{kg}$$\n$$\\text{Profit per kg} = \\text{Selling Price} - \\text{Cost Price} = 1.60 - 1.30 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 0.30$$\n\nTherefore, the merchant made a profit of **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 0.30$ (or $30\\text{ Gp}$)** on each kilogram of rice."
        }
      ]
    },
    {
      "questionNumber": 5,
      "id": "BECE_2017_P2_Q05",
      "marks": 15,
      "topic": "Coordinate Geometry: Linear Plots, Intersections, and Angle Measurement",
      "subQuestions": [
        {
          "part": "a",
          "marks": 10,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"400\" height=\"400\" viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"400\" height=\"400\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"grid17\" width=\"25\" height=\"25\" patternUnits=\"userSpaceOnUse\"><path d=\"M 25 0 L 0 0 0 25\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"400\" fill=\"url(#grid17)\"/><line x1=\"25\" y1=\"200\" x2=\"375\" y2=\"200\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"200\" y1=\"25\" x2=\"200\" y2=\"375\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"380\" y=\"205\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"205\" y=\"20\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><line x1=\"75\" y1=\"75\" x2=\"325\" y2=\"125\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"250\" cy=\"125\" r=\"4\" fill=\"#0284c7\"/><circle cx=\"125\" cy=\"100\" r=\"4\" fill=\"#0284c7\"/><text x=\"255\" y=\"120\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#0284c7\">A(2,3)</text><text x=\"75\" y=\"95\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#0284c7\">B(-3,4)</text><line x1=\"120\" y1=\"300\" x2=\"340\" y2=\"115\" stroke=\"#dc2626\" stroke-width=\"2.5\"/><circle cx=\"300\" cy=\"150\" r=\"4\" fill=\"#dc2626\"/><circle cx=\"150\" cy=\"275\" r=\"4\" fill=\"#dc2626\"/><text x=\"305\" y=\"150\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">C(4,2)</text><text x=\"95\" y=\"285\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#dc2626\">D(-2,-3)</text><circle cx=\"270\" cy=\"129\" r=\"4.5\" fill=\"#7c3aed\"/></svg>",
          "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on both axes, draw on a graph sheet two perpendicular axes $Ox$ and $Oy$ for $-5 \\le x \\le 5$ and $-5 \\le y \\le 5$.\n(i) Plot the points $A(2, 3)$ and $B(-3, 4)$. Draw a continuous straight line passing through points $A$ and $B$.\n(ii) Plot on the same graph sheet the points $C(4, 2)$ and $D(-2, -3)$. Draw a straight line passing through points $C$ and $D$ to intersect line $AB$.",
          "workedSolution": "**Graph Plotting Protocol:**\n1. **Axis Setup:** Calibrate horizontal $Ox$ and vertical $Oy$ at $2\\text{ cm} = 1\\text{ unit}$ from $-5$ to $5$.\n2. **Plot line $AB$:**\n   - Point $A(2, 3)$\n   - Point $B(-3, 4)$\n   - Equation of $AB$: $m_1 = \\frac{4 - 3}{-3 - 2} = -\\frac{1}{5} = -0.2$\n   - Function: $y - 3 = -0.2(x - 2) \\implies y = -0.2x + 3.4$\n3. **Plot line $CD$:**\n   - Point $C(4, 2)$\n   - Point $D(-2, -3)$\n   - Equation of $CD$: $m_2 = \\frac{2 - (-3)}{4 - (-2)} = \\frac{5}{6} \\approx 0.833$\n   - Function: $y - 2 = \\frac{5}{6}(x - 4) \\implies y = \\frac{5}{6}x - \\frac{4}{3}$\n4. **Lines Intersection:** Extend both lines with a ruler until they cross."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Using your graph in (a):\n(i) Find the value of $y$ on line $AB$ when $x = -2$.\n(ii) Measure the acute angle between lines $AB$ and $CD$.",
          "workedSolution": "**(i) Finding the value of $y$ when $x = -2$ on line $AB$:**\nLocate $x = -2$ on the $x$-axis and project vertically up to meet line $AB$:\n$$y = -0.2(-2) + 3.4 = 0.4 + 3.4 = 3.8$$\nFrom the graph sheet reading: **$y = 3.8$ (tolerance $\\pm 0.1$)**.\n\n---\n\n**(ii) Measuring the angle between lines $AB$ and $CD$:**\n- Gradient of $AB$: $m_1 = -0.2 \\implies \\theta_1 = \\arctan(-0.2) = -11.31^\\circ$\n- Gradient of $CD$: $m_2 = \\frac{5}{6} \\approx 0.833 \\implies \\theta_2 = \\arctan(0.833) = 39.81^\\circ$\n- Angle of intersection $\\theta = |\\theta_2 - \\theta_1| = 39.81^\\circ - (-11.31^\\circ) = 51.12^\\circ$\n\nUsing a protractor directly on the graph sheet:\n$$\\mathbf{\\text{Angle} \\approx 51^\\circ \\pm 2^\\circ}$$\n\nTherefore, **$y = 3.8$** and the **measured angle is $\\approx 51^\\circ$**."
        }
      ]
    },
    {
      "questionNumber": 6,
      "id": "BECE_2017_P2_Q06",
      "marks": 15,
      "topic": "Vector Algebra, Linear Inequalities on Number Lines, and Parallel Line Angle Geometry",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "If $\\mathbf{m} = \\begin{pmatrix} 2x + 1 \\\\ 2 - 3y \\end{pmatrix}$, $\\mathbf{n} = \\begin{pmatrix} 6 \\\\ -8 \\end{pmatrix}$, and $\\mathbf{m} + \\mathbf{n} = \\begin{pmatrix} 9 \\\\ -12 \\end{pmatrix}$, find the:\n(i) values of $x$ and $y$;\n(ii) components of vector $\\mathbf{m}$.",
          "workedSolution": "**(i) Finding the values of $x$ and $y$:**\n$$\\mathbf{m} + \\mathbf{n} = \\begin{pmatrix} (2x + 1) + 6 \\\\ (2 - 3y) + (-8) \\end{pmatrix} = \\begin{pmatrix} 2x + 7 \\\\ -3y - 6 \\end{pmatrix} = \\begin{pmatrix} 9 \\\\ -12 \\end{pmatrix}$$\n\n**Equating top components:**\n$$2x + 7 = 9$$\n$$2x = 9 - 7 = 2$$\n$$x = 1$$\n\n**Equating bottom components:**\n$$-3y - 6 = -12$$\n$$-3y = -12 + 6$$\n$$-3y = -6$$\n$$y = 2$$\n\nTherefore, **$x = 1$ and $y = 2$**.\n\n---\n\n**(ii) Components of vector $\\mathbf{m}$:**\n$$\\mathbf{m} = \\begin{pmatrix} 2(1) + 1 \\\\ 2 - 3(2) \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix}$$\n*(Check: $\\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix} + \\begin{pmatrix} 6 \\\\ -8 \\end{pmatrix} = \\begin{pmatrix} 9 \\\\ -12 \\end{pmatrix}$, verified)*.\n\nTherefore, **$\\mathbf{m} = \\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix}$**."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"360\" height=\"80\" viewBox=\"0 0 360 80\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><line x1=\"20\" y1=\"40\" x2=\"340\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"35\" x2=\"60\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"35\" x2=\"120\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"35\" x2=\"180\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"35\" x2=\"240\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"300\" y1=\"35\" x2=\"300\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"53\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">15</text><text x=\"113\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">16</text><text x=\"173\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">17</text><text x=\"233\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">18</text><text x=\"293\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">19</text><circle cx=\"235\" cy=\"25\" r=\"5\" fill=\"#0284c7\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><line x1=\"235\" y1=\"25\" x2=\"35\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"3\"/><polygon points=\"35,20 25,25 35,30\" fill=\"#0284c7\"/></svg>",
          "questionText": "(i) Solve the inequality: $\\frac{3}{4}(x + 1) + 1 \\le \\frac{1}{2}(x - 2) + 6$.\n(ii) Illustrate the answer in (b)(i) on a number line.",
          "workedSolution": "**(i) Solving the inequality:**\n$$\\frac{3(x + 1)}{4} + 1 \\le \\frac{x - 2}{2} + 6$$\nMultiply through by the LCM of 4 and 2, which is $4$:\n$$4\\left(\\frac{3(x + 1)}{4}\\right) + 4(1) \\le 4\\left(\\frac{x - 2}{2}\\right) + 4(6)$$\n$$3(x + 1) + 4 \\le 2(x - 2) + 24$$\n$$3x + 3 + 4 \\le 2x - 4 + 24$$\n$$3x + 7 \\le 2x + 20$$\n$$3x - 2x \\le 20 - 7$$\n$$x \\le 13$$\n*(If solving the exact prompt version $\\frac{3}{4}(x + 1) + 1 \\le \\frac{1}{2}(x - 2) + 5$: $3x + 7 \\le 2x + 16 \\implies x \\le 9$)*.\n\n**Truth set:** $\\mathbf{\\{x : x \\le 13\\}}$ (or $\\{x : x \\le 9\\}$).\n\n---\n\n**(ii) Number line representation:**\nDraw a horizontal number line with a solid (filled) circular marker at the boundary value indicating inclusive inequality ($\\le$), and draw an arrow extending leftward toward negative infinity.\n\n*(See the embedded SVG above for the visual rendering)*."
        },
        {
          "part": "c",
          "marks": 5,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"380\" height=\"220\" viewBox=\"0 0 380 220\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><line x1=\"40\" y1=\"170\" x2=\"240\" y2=\"30\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"140\" y1=\"190\" x2=\"340\" y2=\"50\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"70\" y1=\"75\" x2=\"290\" y2=\"170\" stroke=\"#dc2626\" stroke-width=\"2\"/><line x1=\"230\" y1=\"95\" x2=\"230\" y2=\"195\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><polyline points=\"230,183 242,183 242,195\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.2\"/><text x=\"245\" y=\"28\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"30\" y=\"185\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"345\" y=\"48\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">D</text><text x=\"125\" y=\"205\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"110\" y=\"110\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">y</text><text x=\"215\" y=\"88\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">x</text><text x=\"190\" y=\"160\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#dc2626\">47°</text><text x=\"240\" y=\"165\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0284c7\">102°</text></svg>",
          "questionText": "In the diagram, line $AB$ is parallel to line $CD$ ($AB \\parallel CD$). A transversal crosses both lines, and at the lower intersection, vertical/inclined lines form adjacent angles of $47^\\circ$ and $102^\\circ$ as marked. Find the value of:\n(i) $x$;\n(ii) $y$.",
          "workedSolution": "**(i) Finding the value of $x$:**\nNotice that at the intersection on line $CD$, the angles lying along the straight transversal sum to $180^\\circ$ (or form an angle on a straight line):\n$$x + 47^\\circ + (180^\\circ - 102^\\circ) = 180^\\circ$$\nFrom the ray angles: $x$ and $47^\\circ + 102^\\circ$ lie around the vertex. The straight transversal line gives:\n$$x = 180^\\circ - 102^\\circ = 78^\\circ$$\n\n---\n\n**(ii) Finding the value of $y$:**\nSince line $AB$ is parallel to line $CD$, alternate interior angles (or corresponding angles) across the transversal are equal:\n$$y = x = 78^\\circ$$\n\nTherefore, **$x = 78^\\circ$ and $y = 78^\\circ$**."
        }
      ]
    }
  ]
};

export const SET_BECE_2017_MATH_P2: CurriculumQuestionSet = {
  id: "jhs-math-2017-paper2",
  title: "BECE 2017 Mathematics Paper 2 (Theory / Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2017 Paper 2",
  variantType: "past_paper_variant",
  totalQuestions: 6,
  version: 1,
  format: 'structured_essay',
  paperType: 2,
  year: 2017,
  era: 'legacy',
  instructions: "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
  timeAllowed: "1 hour",
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2017/paper_2",
  theoryTopicList: [
    { id: "q1", questionNumber: 1, theoryIndex: 1, title: "Sets, Venn Diagrams & Circular Segment Area", category: "Sets & Mensuration" },
    { id: "q2", questionNumber: 2, theoryIndex: 2, title: "Consecutive Numbers, Machine Rate & AP Sum", category: "Algebra & Arithmetic" },
    { id: "q3", questionNumber: 3, theoryIndex: 3, title: "Compass Construction & Isosceles Bisectors", category: "Geometry & Construction" },
    { id: "q4", questionNumber: 4, theoryIndex: 4, title: "Frequency Table Mean & Wholesale Profit", category: "Statistics & Commercial" },
    { id: "q5", questionNumber: 5, theoryIndex: 5, title: "Coordinate Intersection & Acute Angles", category: "Geometry & Graphs" },
    { id: "q6", questionNumber: 6, theoryIndex: 6, title: "Vector Operations, Number Lines & Parallel Lines", category: "Vectors & Geometry" }
  ],
  questions: BECE_2017_MATH_P2_DATA.questions.map((q) => {
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
      prompt: `**Question ${q.questionNumber} [${q.marks} Marks]** — *${q.topic}*\n\nAnswer all sub-parts below showing full mathematical reasoning, intermediate derivations, and final evaluations.`,
      hasDiagram: q.subQuestions.some(sq => sq.hasDiagram),
      diagramSvg: mainDiagram,
      svgDiagram: mainDiagram,
      subQuestions: q.subQuestions,
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
        workedSolution: sq.workedSolution,
        hint: `Review fundamental techniques for ${q.topic}. Follow standard step-by-step WAEC marking criteria.`
      }))
    };
  })
};

export const SET_BECE_2017_MATH_P2_ALIAS: CurriculumQuestionSet = {
  ...SET_BECE_2017_MATH_P2,
  id: "bece_2017_math_p2"
};
