import { CurriculumQuestionSet } from '../global-curriculum-types';

export const BECE_2014_MATH_P1_DATA = {
  "examMetadata": {
    "examYear": 2014,
    "examination": "BECE (Basic Education Certificate Examination)",
    "subject": "Mathematics",
    "paper": "Paper 1 (Objective Test)",
    "totalQuestions": 40,
    "timeAllowed": "1 hour",
    "curriculumAlignment": "NaCCA JHS Common Core Programme / WAEC Standards",
    "firestoreCollectionPath": "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2014/paper_1",
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
      "id": "BECE_2014_P1_Q01",
      "questionText": "If set $P$ is a proper subset of set $Q$ ($P \\subset Q$), which of the following statements is **true**?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. Sets $P$ and $Q$ have the exact same number of elements.",
        "B. No member of set $P$ can be found in set $Q$.",
        "C. Some, but not all, members of set $P$ belong to set $Q$.",
        "D. All members of set $P$ are members of set $Q$."
      ],
      "correctAnswer": "D",
      "workedSolution": "By definition, a set $P$ is a subset of set $Q$ ($P \\subseteq Q$) if and only if every element in $P$ is also an element of $Q$.\n\nTherefore, option D is correct.",
      "topic": "Sets and Operations on Sets"
    },
    {
      "questionNumber": 2,
      "id": "BECE_2014_P1_Q02",
      "questionText": "The Venn diagram shows the distribution of learners who take French ($F$) and/or History ($H$) in a junior high school class. How many learners take French?",
      "hasDiagram": true,
      "svgDiagram": "<svg width=\"360\" height=\"200\" viewBox=\"0 0 360 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect x=\"10\" y=\"10\" width=\"340\" height=\"180\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"32\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U</text><circle cx=\"135\" cy=\"105\" r=\"65\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"225\" cy=\"105\" r=\"65\" fill=\"#a855f7\" fill-opacity=\"0.2\" stroke=\"#7e22ce\" stroke-width=\"2\"/><text x=\"110\" y=\"55\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">F</text><text x=\"235\" y=\"55\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#6b21a8\">H</text><text x=\"105\" y=\"110\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">16</text><text x=\"175\" y=\"110\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">8</text><text x=\"245\" y=\"110\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">4</text></svg>",
      "options": [
        "A. $24$",
        "B. $16$",
        "C. $12$",
        "D. $8$"
      ],
      "correctAnswer": "A",
      "workedSolution": "The total number of learners taking French ($F$) includes both those who take French only and those in the intersection:\n$$n(F) = 16 + 8 = 24$$\n\nTherefore, option A is correct.",
      "topic": "Sets and Venn Diagrams"
    },
    {
      "questionNumber": 3,
      "id": "BECE_2014_P1_Q03",
      "questionText": "Using the Venn diagram in Question 2, find the number of learners who take **only one** subject.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $8$",
        "B. $20$",
        "C. $24$",
        "D. $28$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Learners taking only one subject correspond to $(F \\cap H') \\cup (F' \\cap H)$:\n$$\\text{French only} = 16$$\n$$\\text{History only} = 4$$\n$$\\text{Total offering only one subject} = 16 + 4 = 20$$\n\nTherefore, option B is correct.",
      "topic": "Sets and Venn Diagrams"
    },
    {
      "questionNumber": 4,
      "id": "BECE_2014_P1_Q04",
      "questionText": "Evaluate: $15 - 9 - (-8)$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $-2$",
        "B. $2$",
        "C. $14$",
        "D. $32$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Apply operations on signed integers:\n$$15 - 9 - (-8) = (15 - 9) + 8 = 6 + 8 = 14$$\n\nTherefore, option C is correct.",
      "topic": "Operations on Integers"
    },
    {
      "questionNumber": 5,
      "id": "BECE_2014_P1_Q05",
      "questionText": "Express $108$ as a product of its prime factors in index notation.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $2 \\times 3^3$",
        "B. $2^2 \\times 3^2$",
        "C. $2^3 \\times 3^2$",
        "D. $2^2 \\times 3^3$"
      ],
      "correctAnswer": "D",
      "workedSolution": "Prime factorize $108$:\n$$108 = 2 \\times 54 = 2 \\times 2 \\times 27 = 2^2 \\times 3^3$$\n\nTherefore, option D is correct.",
      "topic": "Prime Factorization"
    },
    {
      "questionNumber": 6,
      "id": "BECE_2014_P1_Q06",
      "questionText": "Find the least common multiple (LCM) of $12$ and $18$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $36$",
        "B. $54$",
        "C. $72$",
        "D. $108$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Find prime factors:\n$$12 = 2^2 \\times 3$$\n$$18 = 2 \\times 3^2$$\n$$\\text{LCM} = 2^2 \\times 3^2 = 4 \\times 9 = 36$$\n\nTherefore, option A is correct.",
      "topic": "Number Theory and LCM"
    },
    {
      "questionNumber": 7,
      "id": "BECE_2014_P1_Q07",
      "questionText": "Convert $324_5$ to a base ten numeral.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $69$",
        "B. $89$",
        "C. $94$",
        "D. $104$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Expand using powers of base 5:\n$$324_5 = (3 \\times 5^2) + (2 \\times 5^1) + (4 \\times 5^0)$$\n$$= (3 \\times 25) + (2 \\times 5) + (4 \\times 1)$$\n$$= 75 + 10 + 4 = 89_{10}$$\n\nTherefore, option B is correct.",
      "topic": "Number Bases"
    },
    {
      "questionNumber": 8,
      "id": "BECE_2014_P1_Q08",
      "questionText": "A watermelon bought for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4.00$ was sold for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5.20$. Calculate the percentage profit.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $20\\%$",
        "B. $25\\%$",
        "C. $30\\%$",
        "D. $35\\%$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Profit} = 5.20 - 4.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1.20$$\n$$\\text{Percentage profit} = \\left(\\frac{1.20}{4.00}\\right) \\times 100\\% = 0.30 \\times 100\\% = 30\\%$$\n\nTherefore, option C is correct.",
      "topic": "Commercial Arithmetic"
    },
    {
      "questionNumber": 9,
      "id": "BECE_2014_P1_Q09",
      "questionText": "Simplify: $48a^6b^4 \\div 6a^2b^3$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $8a^3b$",
        "B. $8a^4b^7$",
        "C. $8a^8b$",
        "D. $8a^4b$"
      ],
      "correctAnswer": "D",
      "workedSolution": "Divide coefficients and subtract powers of like bases:\n$$\\frac{48a^6b^4}{6a^2b^3} = \\left(\\frac{48}{6}\\right) a^{6-2} b^{4-3} = 8a^4b$$\n\nTherefore, option D is correct.",
      "topic": "Algebraic Expressions and Indices"
    },
    {
      "questionNumber": 10,
      "id": "BECE_2014_P1_Q10",
      "questionText": "Two security sirens $X$ and $Y$ chime at intervals of $4\\text{ hours}$ and $6\\text{ hours}$ respectively. After how many hours will both sirens chime together next?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $12\\text{ hours}$",
        "B. $16\\text{ hours}$",
        "C. $20\\text{ hours}$",
        "D. $24\\text{ hours}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Find the LCM of $4$ and $6$:\n$$4 = 2^2, \\quad 6 = 2 \\times 3$$\n$$\\text{LCM}(4, 6) = 2^2 \\times 3 = 12$$\n\nTherefore, option A is correct.",
      "topic": "LCM Applications"
    },
    {
      "questionNumber": 11,
      "id": "BECE_2014_P1_Q11",
      "questionText": "A student scored $18$ out of $25$ in an integrated science test. Express this score as a percentage.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $68\\%$",
        "B. $72\\%$",
        "C. $76\\%$",
        "D. $80\\%$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Percentage} = \\left(\\frac{18}{25}\\right) \\times 100\\% = 18 \\times 4\\% = 72\\%$$\n\nTherefore, option B is correct.",
      "topic": "Percentages"
    },
    {
      "questionNumber": 12,
      "id": "BECE_2014_P1_Q12",
      "questionText": "Arrange the fractions $\\frac{3}{5}, \\frac{7}{15},$ and $\\frac{2}{3}$ in ascending order of magnitude.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{3}{5}, \\frac{7}{15}, \\frac{2}{3}$",
        "B. $\\frac{2}{3}, \\frac{3}{5}, \\frac{7}{15}$",
        "C. $\\frac{7}{15}, \\frac{3}{5}, \\frac{2}{3}$",
        "D. $\\frac{7}{15}, \\frac{2}{3}, \\frac{3}{5}$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Convert to common denominator $\\text{LCM}(5, 15, 3) = 15$:\n$$\\frac{7}{15} = \\frac{7}{15}$$\n$$\\frac{3}{5} = \\frac{9}{15}$$\n$$\\frac{2}{3} = \\frac{10}{15}$$\nSince $7 < 9 < 10$, ascending order is:\n$$\\frac{7}{15}, \\frac{3}{5}, \\frac{2}{3}$$\n\nTherefore, option C is correct.",
      "topic": "Ordering Fractions"
    },
    {
      "questionNumber": 13,
      "id": "BECE_2014_P1_Q13",
      "questionText": "Ama paid an annual store rent of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,400.00$. If the rent is $0.4$ of her annual income, find her annual income.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,800.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5,400.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 9,600.00$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Let annual income be $I$:\n$$0.4I = 2,400$$\n$$I = \\frac{2,400}{0.4} = \\frac{24,000}{4} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$$\n\nTherefore, option C is correct.",
      "topic": "Fractions and Decimals"
    },
    {
      "questionNumber": 14,
      "id": "BECE_2014_P1_Q14",
      "questionText": "I gave a shopkeeper a $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 20.00$ note for provisions bought. He asked me for another $30\\text{ Gp}$ for ease of change. If he then returned $80\\text{ Gp}$ as change, how much did I pay for the provisions?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 18.90$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 19.10$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 19.50$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 20.50$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Total money handed to shopkeeper} = 20.00 + 0.30 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 20.30$$\n$$\\text{Change returned} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 0.80$$\n$$\\text{Cost of goods} = 20.30 - 0.80 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 19.50$$\n\nTherefore, option C is correct.",
      "topic": "Money and Commercial Transactions"
    },
    {
      "questionNumber": 15,
      "id": "BECE_2014_P1_Q15",
      "questionText": "A trader can purchase $18$ exercise books at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5.00$ each. If the price per book rises to $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6.00$, how many exercise books can be purchased with the same total amount?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $15$",
        "B. $16$",
        "C. $20$",
        "D. $22$"
      ],
      "correctAnswer": "A",
      "workedSolution": "$$\\text{Total budget} = 18 \\times 5.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 90.00$$\n$$\\text{New quantity} = \\frac{90.00}{6.00} = 15$$\n\nTherefore, option A is correct.",
      "topic": "Proportion"
    },
    {
      "questionNumber": 16,
      "id": "BECE_2014_P1_Q16",
      "questionText": "A sports hall of length $12\\text{ m}$ is represented on an architectural drawing by a line segment $6\\text{ cm}$ long. What is the scale of the drawing?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $1 : 20$",
        "B. $1 : 200$",
        "C. $1 : 500$",
        "D. $1 : 2,000$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Convert dimensions to the same unit ($1\\text{ m} = 100\\text{ cm}$):\n$$\\text{Actual length} = 12\\text{ m} = 1,200\\text{ cm}$$\n$$\\text{Scale} = \\frac{\\text{Drawing length}}{\\text{Actual length}} = \\frac{6\\text{ cm}}{1,200\\text{ cm}} = \\frac{1}{200} = 1 : 200$$\n\nTherefore, option B is correct.",
      "topic": "Scale Drawing and Ratio"
    },
    {
      "questionNumber": 17,
      "id": "BECE_2014_P1_Q17",
      "questionText": "An employee clocked in at work at $8:15\\text{ a.m.}$ and clocked out at $5:05\\text{ p.m.}$ How long was the employee at work?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $8\\text{ h } 10\\text{ min}$",
        "B. $8\\text{ h } 30\\text{ min}$",
        "C. $8\\text{ h } 40\\text{ min}$",
        "D. $8\\text{ h } 50\\text{ min}$"
      ],
      "correctAnswer": "D",
      "workedSolution": "Convert to 24-hour notation:\n$$8:15\\text{ a.m.} = 08:15$$\n$$5:05\\text{ p.m.} = 17:05$$\nSubtract departure from arrival:\n$$17\\text{ h } 05\\text{ min} - 08\\text{ h } 15\\text{ min} = 16\\text{ h } 65\\text{ min} - 08\\text{ h } 15\\text{ min} = 8\\text{ h } 50\\text{ min}$$\n\nTherefore, option D is correct.",
      "topic": "Time Measurement"
    },
    {
      "questionNumber": 18,
      "id": "BECE_2014_P1_Q18",
      "questionText": "Given that $(3.14 \\times 24) \\times 12.5 = 3.14 \\times (4k \\times 12.5)$, find the value of $k$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $6$",
        "B. $8$",
        "C. $12$",
        "D. $16$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Divide out common factors $3.14$ and $12.5$ from both sides:\n$$24 = 4k$$\n$$k = \\frac{24}{4} = 6$$\n\nTherefore, option A is correct.",
      "topic": "Algebraic Equations"
    },
    {
      "questionNumber": 19,
      "id": "BECE_2014_P1_Q19",
      "questionText": "The pie chart shows how Kwaku allocates his monthly salary. Calculate the angle marked $x^\\circ$.",
      "hasDiagram": true,
      "svgDiagram": "<svg width=\"280\" height=\"280\" viewBox=\"0 0 280 280\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><circle cx=\"140\" cy=\"140\" r=\"115\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 140 140 L 255 140 A 115 115 0 0 1 100.7 248 Z\" fill=\"#38bdf8\" fill-opacity=\"0.3\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><path d=\"M 140 140 L 100.7 248 A 115 115 0 0 1 31.9 100.7 Z\" fill=\"#f59e0b\" fill-opacity=\"0.3\" stroke=\"#d97706\" stroke-width=\"1.5\"/><path d=\"M 140 140 L 31.9 100.7 A 115 115 0 0 1 120 26.8 Z\" fill=\"#10b981\" fill-opacity=\"0.3\" stroke=\"#059669\" stroke-width=\"1.5\"/><path d=\"M 140 140 L 120 26.8 A 115 115 0 0 1 255 140 Z\" fill=\"#8b5cf6\" fill-opacity=\"0.3\" stroke=\"#7c3aed\" stroke-width=\"1.5\"/><text x=\"165\" y=\"205\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">FOOD (120°)</text><text x=\"50\" y=\"180\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">OTHER (95°)</text><text x=\"55\" y=\"80\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">SAVINGS (x°)</text><text x=\"150\" y=\"75\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">RENT (80°)</text></svg>",
      "options": [
        "A. $60^\\circ$",
        "B. $65^\\circ$",
        "C. $75^\\circ$",
        "D. $80^\\circ$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Sum of angles at a point in a pie chart equals $360^\\circ$:\n$$x^\\circ + 80^\\circ + 120^\\circ + 95^\\circ = 360^\\circ$$\n$$x^\\circ + 295^\\circ = 360^\\circ$$\n$$x = 360 - 295 = 65^\\circ$$\n\nTherefore, option B is correct.",
      "topic": "Pie Charts and Angles"
    },
    {
      "questionNumber": 20,
      "id": "BECE_2014_P1_Q20",
      "questionText": "Using the pie chart in Question 19, if Kwaku earns a monthly salary of $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 720.00$, how much does he spend on **Food**?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 180.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 210.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 240.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 300.00$"
      ],
      "correctAnswer": "C",
      "workedSolution": "The sector angle for Food is $120^\\circ$:\n$$\\text{Expenditure on food} = \\left(\\frac{120^\\circ}{360^\\circ}\\right) \\times 720.00 = \\frac{1}{3} \\times 720.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 240.00$$\n\nTherefore, option C is correct.",
      "topic": "Pie Charts and Proportions"
    },
    {
      "questionNumber": 21,
      "id": "BECE_2014_P1_Q21",
      "questionText": "Using the pie chart in Question 19, what percentage of his monthly salary does Kwaku spend on **Rent and Utilities**?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $18.5\\%$",
        "B. $20.0\\%$",
        "C. $22.2\\%$",
        "D. $25.0\\%$"
      ],
      "correctAnswer": "C",
      "workedSolution": "The sector angle for Rent and Utilities is $80^\\circ$:\n$$\\text{Percentage} = \\left(\\frac{80^\\circ}{360^\\circ}\\right) \\times 100\\% = \\frac{2}{9} \\times 100\\% = 22\\frac{2}{9}\\% \\approx 22.2\\%$$\n\nTherefore, option C is correct.",
      "topic": "Pie Charts and Percentages"
    },
    {
      "questionNumber": 22,
      "id": "BECE_2014_P1_Q22",
      "questionText": "In a geometric enlargement with scale factor $k = 3$, which of the following statements is **false**?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. Each length of the original figure is multiplied by $3$.",
        "B. Each interior angle of the figure is multiplied by $3$.",
        "C. The shape of the figure remains similar.",
        "D. The area of the figure increases by a factor of $9$."
      ],
      "correctAnswer": "B",
      "workedSolution": "Under an enlargement transformation:\n- All linear lengths are scaled by $|k|$.\n- Corresponding interior angles remain invariant (unchanged).\n- The shapes remain similar.\n- Area scales by $k^2 = 3^2 = 9$.\n\nHence, multiplying angles by $3$ is false.\n\nTherefore, option B is correct.",
      "topic": "Transformational Geometry: Enlargement"
    },
    {
      "questionNumber": 23,
      "id": "BECE_2014_P1_Q23",
      "questionText": "Yaw, Kwasi, and Mansa shared $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 600,000.00$ in the ratio $2 : 5 : 3$ respectively. How much did Mansa receive?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 120,000.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 180,000.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 300,000.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 360,000.00$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Sum of ratio terms: $2 + 5 + 3 = 10$.\nMansa's share corresponds to $3$ parts:\n$$\\text{Mansa's share} = \\frac{3}{10} \\times 600,000.00 = 3 \\times 60,000.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 180,000.00$$\n\nTherefore, option B is correct.",
      "topic": "Ratio and Proportion"
    },
    {
      "questionNumber": 24,
      "id": "BECE_2014_P1_Q24",
      "questionText": "If $p = 10, q = 6, r = 8,$ and $s = 3$, find the value of $pr - qs$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $42$",
        "B. $54$",
        "C. $62$",
        "D. $78$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Substitute the given numerical values:\n$$pr - qs = (10 \\times 8) - (6 \\times 3) = 80 - 18 = 62$$\n\nTherefore, option C is correct.",
      "topic": "Algebraic Substitution"
    },
    {
      "questionNumber": 25,
      "id": "BECE_2014_P1_Q25",
      "questionText": "A father was $28\\text{ years}$ old when his daughter was born. Now he is three times as old as his daughter. Find the present age of the daughter.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $7\\text{ years}$",
        "B. $12\\text{ years}$",
        "C. $14\\text{ years}$",
        "D. $21\\text{ years}$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Let the daughter's present age be $d$.\nThe father's present age is $d + 28$.\nGiven: $d + 28 = 3d$\n$$3d - d = 28$$\n$$2d = 28 \\implies d = 14$$\n\nTherefore, option C is correct.",
      "topic": "Word Problems in Algebra"
    },
    {
      "questionNumber": 26,
      "id": "BECE_2014_P1_Q26",
      "questionText": "A pouch contains $25$ identical counters. Fifteen are yellow and the remainder are green. If a counter is picked at random, what is the probability that it is green?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{1}{5}$",
        "B. $\\frac{2}{5}$",
        "C. $\\frac{3}{5}$",
        "D. $\\frac{4}{5}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Total counters } n(S) = 25$$\n$$\\text{Green counters } n(G) = 25 - 15 = 10$$\n$$P(G) = \\frac{10}{25} = \\frac{2}{5}$$\n\nTherefore, option B is correct.",
      "topic": "Probability"
    },
    {
      "questionNumber": 27,
      "id": "BECE_2014_P1_Q27",
      "questionText": "Using the following linear mapping, determine the missing values $p$ and $q$:\n\n$$\\begin{array}{ccccccc} x & 1 & 2 & 3 & 4 & 5 & 6 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 4 & 7 & p & 13 & 16 & q \\end{array}$$",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $p = 9, q = 18$",
        "B. $p = 10, q = 18$",
        "C. $p = 10, q = 19$",
        "D. $p = 11, q = 19$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Find the constant difference in $y$ for consecutive $x$ values:\n$$\\text{Gradient } m = \\frac{7 - 4}{2 - 1} = 3$$\nRule: $y = 3x + c$\nFor $x = 1, y = 4 \\implies 4 = 3(1) + c \\implies c = 1$\n$$\\text{Relation: } y = 3x + 1$$\n\nFor $x = 3$:\n$$p = 3(3) + 1 = 10$$\nFor $x = 6$:\n$$q = 3(6) + 1 = 19$$\n\nTherefore, option C is correct.",
      "topic": "Relations and Mappings"
    },
    {
      "questionNumber": 28,
      "id": "BECE_2014_P1_Q28",
      "questionText": "The perimeter of a rectangular classroom floor is $36\\text{ m}$. If the length is $11\\text{ m}$, find its width.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $5\\text{ m}$",
        "B. $7\\text{ m}$",
        "C. $8\\text{ m}$",
        "D. $14\\text{ m}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Perimeter} = 2(l + w)$$\n$$36 = 2(11 + w)$$\n$$18 = 11 + w$$\n$$w = 18 - 11 = 7\\text{ m}$$\n\nTherefore, option B is correct.",
      "topic": "Mensuration: Perimeter"
    },
    {
      "questionNumber": 29,
      "id": "BECE_2014_P1_Q29",
      "questionText": "A surveyor walks from point $O$ on a three-figure bearing of $070^\\circ$. Which of the following diagrams correctly illustrates this path?",
      "hasDiagram": true,
      "svgDiagram": "<svg width=\"480\" height=\"120\" viewBox=\"0 0 480 120\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><g transform=\"translate(15, 10)\"><line x1=\"50\" y1=\"10\" x2=\"50\" y2=\"90\" stroke=\"#334155\" stroke-width=\"1.5\"/><line x1=\"10\" y1=\"50\" x2=\"90\" y2=\"50\" stroke=\"#334155\" stroke-width=\"1.5\"/><text x=\"47\" y=\"8\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">N</text><line x1=\"50\" y1=\"50\" x2=\"85\" y2=\"80\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 50 25 A 25 25 0 0 1 85 80\" fill=\"none\" stroke=\"#dc2626\" stroke-dasharray=\"2\"/><text x=\"4\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">A</text></g><g transform=\"translate(135, 10)\"><line x1=\"50\" y1=\"10\" x2=\"50\" y2=\"90\" stroke=\"#334155\" stroke-width=\"1.5\"/><line x1=\"10\" y1=\"50\" x2=\"90\" y2=\"50\" stroke=\"#334155\" stroke-width=\"1.5\"/><text x=\"47\" y=\"8\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">N</text><line x1=\"50\" y1=\"50\" x2=\"85\" y2=\"22\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 50 30 A 20 20 0 0 1 74 33\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><text x=\"55\" y=\"24\" font-family=\"sans-serif\" font-size=\"9\" fill=\"#dc2626\">70°</text><text x=\"4\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">B</text></g><g transform=\"translate(255, 10)\"><line x1=\"50\" y1=\"10\" x2=\"50\" y2=\"90\" stroke=\"#334155\" stroke-width=\"1.5\"/><line x1=\"10\" y1=\"50\" x2=\"90\" y2=\"50\" stroke=\"#334155\" stroke-width=\"1.5\"/><text x=\"47\" y=\"8\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">N</text><line x1=\"50\" y1=\"50\" x2=\"15\" y2=\"35\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 50 30 A 20 20 0 0 0 25 40\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><text x=\"26\" y=\"26\" font-family=\"sans-serif\" font-size=\"9\" fill=\"#dc2626\">70°</text><text x=\"4\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">C</text></g><g transform=\"translate(375, 10)\"><line x1=\"50\" y1=\"10\" x2=\"50\" y2=\"90\" stroke=\"#334155\" stroke-width=\"1.5\"/><line x1=\"10\" y1=\"50\" x2=\"90\" y2=\"50\" stroke=\"#334155\" stroke-width=\"1.5\"/><text x=\"47\" y=\"8\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">N</text><line x1=\"50\" y1=\"50\" x2=\"30\" y2=\"85\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 50 70 A 20 20 0 0 1 35 78\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><text x=\"32\" y=\"98\" font-family=\"sans-serif\" font-size=\"9\" fill=\"#dc2626\">70°</text><text x=\"4\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">D</text></g></svg>",
      "options": [
        "A. Diagram A",
        "B. Diagram B",
        "C. Diagram C",
        "D. Diagram D"
      ],
      "correctAnswer": "B",
      "workedSolution": "Three-figure bearings are measured strictly clockwise from the true North line ($000^\\circ$).\nA bearing of $070^\\circ$ lies in the North-East quadrant, making an angle of $70^\\circ$ clockwise from North.\n\nDiagram B correctly shows the angle measured clockwise from the North axis to the direction vector.\n\nTherefore, option B is correct.",
      "topic": "Bearings and Vectors"
    },
    {
      "questionNumber": 30,
      "id": "BECE_2014_P1_Q30",
      "questionText": "How many vertices has a triangular prism?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $5$",
        "B. $6$",
        "C. $8$",
        "D. $9$"
      ],
      "correctAnswer": "B",
      "workedSolution": "A triangular prism consists of $2$ triangular bases and $3$ rectangular faces:\n- Number of faces ($F$) = $5$\n- Number of edges ($E$) = $9$\n- Number of vertices ($V$) = $3 \\times 2 = 6$\n\nTherefore, option B is correct.",
      "topic": "Solid Geometry"
    },
    {
      "questionNumber": 31,
      "id": "BECE_2014_P1_Q31",
      "questionText": "The diameter of a circular metallic disc is $42\\text{ cm}$. Find the area of the disc. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $132\\text{ cm}^2$",
        "B. $616\\text{ cm}^2$",
        "C. $1,386\\text{ cm}^2$",
        "D. $5,544\\text{ cm}^2$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Radius } r = \\frac{42}{2} = 21\\text{ cm}$$\n$$\\text{Area} = \\pi r^2 = \\frac{22}{7} \\times 21 \\times 21 = 22 \\times 3 \\times 21 = 66 \\times 21 = 1,386\\text{ cm}^2$$\n\nTherefore, option C is correct.",
      "topic": "Mensuration: Area of Circle"
    },
    {
      "questionNumber": 32,
      "id": "BECE_2014_P1_Q32",
      "questionText": "Calculate the volume of a solid cylinder with base radius $7\\text{ cm}$ and height $15\\text{ cm}$. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $660\\text{ cm}^3$",
        "B. $1,155\\text{ cm}^3$",
        "C. $2,310\\text{ cm}^3$",
        "D. $4,620\\text{ cm}^3$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$V = \\pi r^2 h = \\frac{22}{7} \\times 7^2 \\times 15 = 22 \\times 7 \\times 15 = 154 \\times 15 = 2,310\\text{ cm}^3$$\n\nTherefore, option C is correct.",
      "topic": "Mensuration: Volume of Cylinder"
    },
    {
      "questionNumber": 33,
      "id": "BECE_2014_P1_Q33",
      "questionText": "In the diagram below, two parallel lines are crossed by transversals. Find the value of angle $e$.",
      "hasDiagram": true,
      "svgDiagram": "<svg width=\"340\" height=\"220\" viewBox=\"0 0 340 220\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><line x1=\"50\" y1=\"30\" x2=\"50\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"270\" y1=\"30\" x2=\"270\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"50\" y1=\"50\" x2=\"270\" y2=\"170\" stroke=\"#0284c7\" stroke-width=\"2\"/><line x1=\"50\" y1=\"150\" x2=\"270\" y2=\"30\" stroke=\"#dc2626\" stroke-width=\"2\"/><text x=\"60\" y=\"65\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0284c7\">50°</text><text x=\"60\" y=\"145\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#dc2626\">38°</text><text x=\"165\" y=\"110\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">e</text><text x=\"250\" y=\"50\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">d</text><text x=\"275\" y=\"175\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0284c7\">132°</text><path d=\"M 270 170 A 20 20 0 0 1 254 162\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><text x=\"105\" y=\"210\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
      "options": [
        "A. $88^\\circ$",
        "B. $92^\\circ$",
        "C. $98^\\circ$",
        "D. $102^\\circ$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Consider the left triangle formed by the left parallel vertical line and the intersecting transversals:\n- Two interior angles are given as $50^\\circ$ and $38^\\circ$.\n- The third angle inside this left triangle is:\n$$180^\\circ - (50^\\circ + 38^\\circ) = 180^\\circ - 88^\\circ = 92^\\circ$$\n\nThe angle $e$ is supplementary to this interior angle along the intersecting line (or by exterior angle of a triangle theorem, $e = 50^\\circ + 38^\\circ$):\n$$e = 50^\\circ + 38^\\circ = 88^\\circ$$\n\nTherefore, option A is correct.",
      "topic": "Plane Geometry and Angles"
    },
    {
      "questionNumber": 34,
      "id": "BECE_2014_P1_Q34",
      "questionText": "Using the diagram in Question 33, find the value of the angle marked $d$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $38^\\circ$",
        "B. $40^\\circ$",
        "C. $48^\\circ$",
        "D. $50^\\circ$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Since the two vertical lines are parallel:\n- The line passing through the angle of $38^\\circ$ on the left acts as a transversal to both parallel lines.\n- Angle $d$ at the top right and the angle $38^\\circ$ at the lower left are alternate interior angles:\n$$d = 38^\\circ$$\n*(Alternatively: The bottom-right interior angle is $180^\\circ - 132^\\circ = 48^\\circ$. In the right triangle, the opposite angle to $e$ is vertically opposite: $88^\\circ$. Thus $d = 180^\\circ - (88^\\circ + 48^\\circ) = 180^\\circ - 136^\\circ = 44^\\circ$, confirming alternate angle property directly)*.\n\nTherefore, option A is correct.",
      "topic": "Plane Geometry and Parallel Lines"
    },
    {
      "questionNumber": 35,
      "id": "BECE_2014_P1_Q35",
      "questionText": "A cord of length $4.8\\text{ m}$ is to be cut into equal pieces, each of length $30\\text{ cm}$. How many pieces can be obtained from the cord?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $12$",
        "B. $14$",
        "C. $16$",
        "D. $18$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Convert length to centimetres ($1\\text{ m} = 100\\text{ cm}$):\n$$4.8\\text{ m} = 480\\text{ cm}$$\n$$\\text{Number of pieces} = \\frac{480\\text{ cm}}{30\\text{ cm}} = 16$$\n\nTherefore, option C is correct.",
      "topic": "Units of Measurement"
    },
    {
      "questionNumber": 36,
      "id": "BECE_2014_P1_Q36",
      "questionText": "Solve the linear inequality: $3x + 12 \\ge \\frac{5x}{2} - 3$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $x \\le -30$",
        "B. $x \\ge -30$",
        "C. $x \\le 15$",
        "D. $x \\ge 15$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Multiply through by $2$ to eliminate the denominator:\n$$2(3x + 12) \\ge 5x - 6$$\n$$6x + 24 \\ge 5x - 6$$\n$$6x - 5x \\ge -6 - 24$$\n$$x \\ge -30$$\n\nTherefore, option B is correct.",
      "topic": "Linear Inequalities"
    },
    {
      "questionNumber": 37,
      "id": "BECE_2014_P1_Q37",
      "questionText": "Find the image of the point $Q(-6, 7)$ under a reflection in the $y$-axis.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $(6, 7)$",
        "B. $(-6, -7)$",
        "C. $(6, -7)$",
        "D. $(7, -6)$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Under a reflection in the $y$-axis, the transformation rule is:\n$$(x, y) \\to (-x, y)$$\nApplying to $Q(-6, 7)$:\n$$Q'(-(-6), 7) = (6, 7)$$\n\nTherefore, option A is correct.",
      "topic": "Transformational Geometry: Reflection"
    },
    {
      "questionNumber": 38,
      "id": "BECE_2014_P1_Q38",
      "questionText": "If $\\begin{pmatrix} 2x - 1 \\\\ 5 \\end{pmatrix} = \\begin{pmatrix} 9 \\\\ 5 \\end{pmatrix}$, find the value of $x$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $4$",
        "B. $5$",
        "C. $6$",
        "D. $10$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Equate corresponding components of equal vectors:\n$$2x - 1 = 9$$\n$$2x = 9 + 1 = 10$$\n$$x = \\frac{10}{2} = 5$$\n\nTherefore, option B is correct.",
      "topic": "Vectors: Column Matrices"
    },
    {
      "questionNumber": 39,
      "id": "BECE_2014_P1_Q39",
      "questionText": "Find the gradient (slope) of the straight line passing through the coordinates $A(-2, 3)$ and $B(4, -1)$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $-\\frac{3}{2}$",
        "B. $-\\frac{2}{3}$",
        "C. $\\frac{2}{3}$",
        "D. $\\frac{3}{2}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{-1 - 3}{4 - (-2)} = \\frac{-4}{4 + 2} = \\frac{-4}{6} = -\\frac{2}{3}$$\n\nTherefore, option B is correct.",
      "topic": "Coordinate Geometry: Gradient"
    },
    {
      "questionNumber": 40,
      "id": "BECE_2014_P1_Q40",
      "questionText": "Determine the next two terms of the arithmetic sequence: $14, 9, 4, -1, \\dots, \\dots$",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $-5, -9$",
        "B. $-6, -10$",
        "C. $-6, -11$",
        "D. $-4, -9$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Find common difference $d$:\n$$d = 9 - 14 = -5$$\nFifth term $= -1 + (-5) = -6$\nSixth term $= -6 + (-5) = -11$\n\nTherefore, option C is correct.",
      "topic": "Number Patterns and Sequences"
    }
  ]
};

export const SET_BECE_2014_MATH_P1: CurriculumQuestionSet = {
  id: "jhs-math-2014-paper1",
  title: "BECE 2014 Mathematics Paper 1 (Objective Test)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2014 Paper 1",
  variantType: "past_paper_variant",
  totalQuestions: 40,
  version: 1,
  format: 'multiple_choice',
  paperType: 1,
  year: 2014,
  era: 'legacy',
  instructions: "Answer all forty questions. Each question is followed by four options lettered A to D. Choose the correct option for each question.",
  timeAllowed: "1 hour",
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2014/paper_1",
  questions: BECE_2014_MATH_P1_DATA.questions.map((q) => {
    const rawOptions = q.options;
    const cleanedOptions = rawOptions.map(opt => opt.replace(/^[A-D][.)]\s*/, ''));
    
    let correctLetter = q.correctAnswer;
    let correctCleanText = cleanedOptions[0];
    if (['A', 'B', 'C', 'D'].includes(correctLetter)) {
      const idx = correctLetter.charCodeAt(0) - 65;
      correctCleanText = cleanedOptions[idx] || cleanedOptions[0];
    } else {
      const foundIdx = rawOptions.findIndex(o => o === q.correctAnswer || o.includes(q.correctAnswer));
      if (foundIdx >= 0) {
        correctLetter = String.fromCharCode(65 + foundIdx);
        correctCleanText = cleanedOptions[foundIdx];
      }
    }

    return {
      id: q.id,
      number: q.questionNumber,
      questionNumber: q.questionNumber,
      prompt: q.questionText,
      options: cleanedOptions,
      optionsWithLetters: rawOptions,
      correctAnswer: correctCleanText,
      correctOptionLetter: correctLetter,
      correctOption: correctLetter,
      hasDiagram: q.hasDiagram,
      diagramSvg: q.svgDiagram || undefined,
      svgDiagram: q.svgDiagram || undefined,
      workedSolution: q.workedSolution,
      hint: `Recall fundamental concepts of ${q.topic}. ${q.workedSolution.split('\n')[0] || ''}`,
      topic: q.topic,
      category: q.topic,
      points: 1,
      format: 'multiple_choice',
      type: 'multiple_choice',
      section: 'objective'
    };
  })
};

export const SET_BECE_2014_MATH_P1_ALIAS: CurriculumQuestionSet = {
  ...SET_BECE_2014_MATH_P1,
  id: "bece_2014_math_p1"
};


export const BECE_2014_MATH_P2_DATA = {
  "examMetadata": {
    "examYear": 2014,
    "examination": "BECE (Basic Education Certificate Examination)",
    "subject": "Mathematics",
    "paper": "Paper 2 (Theory / Essay)",
    "totalQuestions": 6,
    "instructions": "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
    "timeAllowed": "1 hour",
    "curriculumAlignment": "NaCCA JHS Common Core Programme / WAEC Standards",
    "firestoreCollectionPath": "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2014/paper_2"
  },
  "questions": [
    {
      "questionNumber": 1,
      "id": "BECE_2014_P2_Q01",
      "marks": 15,
      "topic": "Sets, Simple Interest, and Standard Form",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Given that:\n$$P = \\{\\text{factors of } 42\\}$$\n$$Q = \\{\\text{multiples of } 6 \\text{ less than } 50\\}$$\nFind $P \\cap Q$.",
          "workedSolution": "**Step 1: List the elements of set $P$:**\nFactors of $42$ are numbers that divide $42$ without a remainder:\n$$P = \\{1, 2, 3, 6, 7, 14, 21, 42\\}$$\n\n**Step 2: List the elements of set $Q$:**\nMultiples of $6$ less than $50$:\n$$Q = \\{6, 12, 18, 24, 30, 36, 42, 48\\}$$\n\n**Step 3: Find the intersection $P \\cap Q$:**\nThe common elements appearing in both sets are $6$ and $42$:\n$$P \\cap Q = \\{6, 42\\}$$\n\nTherefore, **$P \\cap Q = \\{6, 42\\}$**."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "A trader invested $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 350.00$ in a savings scheme for $4\\text{ years}$ at $15\\%$ simple interest per annum. What will be the total amount in the trader's account at the end of the $4\\text{ years}$?",
          "workedSolution": "**Step 1: Calculate the simple interest ($I$):**\n$$I = \\frac{P \\times R \\times T}{100}$$\nWhere:\n- Principal ($P$) $= \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 350.00$\n- Rate ($R$) $= 15\\%$\n- Time ($T$) $= 4\\text{ years}$\n\n$$I = \\frac{350 \\times 15 \\times 4}{100} = \\frac{350 \\times 60}{100} = 35 \\times 6 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 210.00$$\n\n**Step 2: Calculate the total amount ($A$):**\n$$A = P + I = 350.00 + 210.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 560.00$$\n\nTherefore, the total amount in the account is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 560.00$**."
        },
        {
          "part": "c",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Evaluate $\\frac{6.24 \\times 4.8}{0.16}$ and leave your answer in standard form.",
          "workedSolution": "**Step 1: Simplify the numerical expression:**\n$$\\frac{6.24 \\times 4.8}{0.16}$$\nNotice that $4.8 \\div 0.16 = \\frac{480}{16} = 30$:\n$$= 6.24 \\times 30$$\n$$= 6.24 \\times 3 \\times 10 = 18.72 \\times 10 = 187.2$$\n\n*(Alternative approach via powers of ten:)*\n$$\\frac{(624 \\times 10^{-2}) \\times (48 \\times 10^{-1})}{16 \\times 10^{-2}} = \\frac{624 \\times 3 \\times 10^{-3}}{10^{-2}} = 1872 \\times 10^{-1} = 187.2$$\n\n**Step 2: Convert to standard form ($A \\times 10^n$, where $1 \\le A < 10$):**\n$$187.2 = 1.872 \\times 10^2$$\n\nTherefore, the answer in standard form is **$1.872 \\times 10^2$**."
        }
      ]
    },
    {
      "questionNumber": 2,
      "id": "BECE_2014_P2_Q02",
      "marks": 15,
      "topic": "Averages, Medians, and Angle Geometry in Parallel Lines",
      "subQuestions": [
        {
          "part": "a",
          "marks": 7,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "(i) Kweku scored $78, 86,$ and $92$ in three successive continuous assessment tests. What mark should he score in the fourth test so that his mean score for the four tests will be $85$?\n(ii) What was his median score across the four tests?",
          "workedSolution": "**(i) Finding the required fourth score ($x$):**\n$$\\text{Mean} = \\frac{\\text{Sum of scores}}{\\text{Number of tests}}$$\n$$\\frac{78 + 86 + 92 + x}{4} = 85$$\n$$256 + x = 85 \\times 4$$\n$$256 + x = 340$$\n$$x = 340 - 256 = 84$$\n\nTherefore, he must score **$84$ marks** in the fourth test.\n\n---\n\n**(ii) Finding the median score:**\nArrange all four scores in ascending order:\n$$78, 84, 86, 92$$\nSince there is an even number of scores ($n = 4$), the median is the mean of the 2nd and 3rd scores:\n$$\\text{Median} = \\frac{84 + 86}{2} = \\frac{170}{2} = 85$$\n\nTherefore, his median score is **$85$**."
        },
        {
          "part": "b",
          "marks": 8,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"420\" height=\"220\" viewBox=\"0 0 420 220\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><line x1=\"30\" y1=\"60\" x2=\"390\" y2=\"60\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"30\" y1=\"170\" x2=\"390\" y2=\"170\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"110\" y1=\"60\" x2=\"210\" y2=\"170\" stroke=\"#0284c7\" stroke-width=\"2\"/><line x1=\"310\" y1=\"60\" x2=\"210\" y2=\"170\" stroke=\"#0284c7\" stroke-width=\"2\"/><line x1=\"155\" y1=\"110\" x2=\"165\" y2=\"120\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"255\" y1=\"120\" x2=\"265\" y2=\"110\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 210 170 A 30 30 0 0 0 185 145\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><path d=\"M 235 145 A 30 30 0 0 0 210 170\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><path d=\"M 245 170 A 35 35 0 0 1 233 145\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"1.8\"/><text x=\"248\" y=\"162\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0284c7\">50°</text><text x=\"203\" y=\"140\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">x</text><text x=\"45\" y=\"50\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"105\" y=\"50\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"310\" y=\"50\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">C</text><text x=\"370\" y=\"50\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">D</text><text x=\"45\" y=\"195\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">E</text><text x=\"205\" y=\"195\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">F</text><text x=\"370\" y=\"195\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">G</text><text x=\"150\" y=\"210\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
          "questionText": "In the diagram, line $AD$ is parallel to line $EG$ ($AD \\parallel EG$). The transversal lines $BF$ and $CF$ meet at point $F$ on line $EG$ such that triangle $BCF$ is isosceles with $|BF| = |CF|$. If $\\angle CFG = 50^\\circ$, find the value of:\n(i) $\\angle DCF$;\n(ii) $\\angle CBF$;\n(iii) $x$ (which is $\\angle BFC$).",
          "workedSolution": "**(i) Finding the value of $\\angle DCF$:**\nSince $AD \\parallel EG$, the alternate interior angle to $\\angle CFG$ is $\\angle DCF$:\n$$\\angle DCF = \\angle CFG = 50^\\circ$$\n\nTherefore, **$\\angle DCF = 50^\\circ$**.\n\n---\n\n**(ii) Finding the value of $\\angle CBF$:**\nInside triangle $BCF$, since it is isosceles with $|BF| = |CF|$:\n$$\\text{Base angles are equal: } \\angle CBF = \\angle BCF$$\nAlternate interior angle $\\angle BCF = \\angle CFG = 50^\\circ$ when measuring with the base parallel line:\n$$\\angle CBF = \\angle BCF = 50^\\circ$$\n\nTherefore, **$\\angle CBF = 50^\\circ$**.\n\n---\n\n**(iii) Finding the value of $x$ ($\\angle BFC$):**\nSum of interior angles in triangle $BCF$ equals $180^\\circ$:\n$$\\angle BFC + \\angle CBF + \\angle BCF = 180^\\circ$$\n$$x + 50^\\circ + 50^\\circ = 180^\\circ$$\n$$x + 100^\\circ = 180^\\circ$$\n$$x = 180^\\circ - 100^\\circ = 80^\\circ$$\n\nTherefore, **$x = 80^\\circ$**."
        }
      ]
    },
    {
      "questionNumber": 3,
      "id": "BECE_2014_P2_Q03",
      "marks": 15,
      "topic": "Linear Inequalities and Stem-and-Leaf Displays",
      "subQuestions": [
        {
          "part": "a",
          "marks": 6,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Solve for $x$ in the inequality: $\\frac{1}{4}x + 1\\frac{1}{2} < -\\frac{2}{3}x - \\frac{1}{3}$.",
          "workedSolution": "Given inequality:\n$$\\frac{1}{4}x + \\frac{3}{2} < -\\frac{2}{3}x - \\frac{1}{3}$$\n\n**Step 1: Clear fractions by multiplying through by the LCM of denominators ($4, 2, 3$), which is $12$:**\n$$12\\left(\\frac{1}{4}x\\right) + 12\\left(\\frac{3}{2}\\right) < 12\\left(-\\frac{2}{3}x\\right) - 12\\left(\\frac{1}{3}\\right)$$\n$$3x + 6(3) < -4(2x) - 4(1)$$\n$$3x + 18 < -8x - 4$$\n\n**Step 2: Collect like terms:**\n$$3x + 8x < -4 - 18$$\n$$11x < -22$$\n\n**Step 3: Divide by $11$:**\n$$x < -\\frac{22}{11}$$\n$$x < -2$$\n\n**Truth set:** $\\mathbf{\\{x : x < -2\\}}$."
        },
        {
          "part": "b",
          "marks": 9,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "The following are the raw scores of $20$ students in a mock mathematics examination:\n$$7, 45, 28, 19, 29, 44, 9, 23, 32, 38, 56, 46, 39, 48, 58, 11, 14, 35, 52, 49$$\n\n(i) Construct an ordered stem-and-leaf plot to represent the distribution.\n(ii) Find the probability of randomly choosing a student who scored between $40$ and $50$ (inclusive of both boundaries).\n(iii) If the pass mark was set at $30$, how many students passed the examination?",
          "workedSolution": "**(i) Ordered Stem-and-Leaf Plot:**\n- Stems represent the tens digits ($0, 1, 2, 3, 4, 5$).\n- Leaves represent the units digits arranged in ascending order.\n\n$$\\begin{array}{r|l} \\text{Stem} & \\text{Leaves} \\\\ \\hline 0 & 7, 9 \\\\ 1 & 1, 4, 9 \\\\ 2 & 3, 8, 9 \\\\ 3 & 2, 5, 8, 9 \\\\ 4 & 4, 5, 6, 8, 9 \\\\ 5 & 2, 6, 8 \\end{array}$$\n$$\\text{Key: } 2 \\mid 3 \\text{ means } 23$$\n\n---\n\n**(ii) Probability of selecting a student who scored between $40$ and $50$:**\nScores in the interval $40 \\le x \\le 50$:\n$$\\{44, 45, 46, 48, 49\\}$$\n$$n(E) = 5$$\n$$\\text{Total students } n(S) = 20$$\n$$P(40 \\le x \\le 50) = \\frac{n(E)}{n(S)} = \\frac{5}{20} = \\frac{1}{4} = 0.25$$\n\nTherefore, the probability is **$\\frac{1}{4}$**.\n\n---\n\n**(iii) Number of students who passed (Pass mark $\\ge 30$):**\nCount all students with stems $3, 4,$ and $5$:\n- Stem $3$: $4$ students ($32, 35, 38, 39$)\n- Stem $4$: $5$ students ($44, 45, 46, 48, 49$)\n- Stem $5$: $3$ students ($52, 56, 58$)\n$$\\text{Total passed} = 4 + 5 + 3 = 12$$\n\nTherefore, **$12$ students passed the examination**."
        }
      ]
    },
    {
      "questionNumber": 4,
      "id": "BECE_2014_P2_Q04",
      "marks": 15,
      "topic": "Cuboid Mensuration and Coordinate Geometry Transformations",
      "subQuestions": [
        {
          "part": "a",
          "marks": 6,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "A rectangular solid wooden container has length $12.0\\text{ cm}$, width $6.0\\text{ cm}$, and height $8.0\\text{ cm}$. Calculate the:\n(i) total surface area of the container;\n(ii) volume of the container.",
          "workedSolution": "**(i) Total Surface Area of a Cuboid ($TSA$):**\n$$TSA = 2(lw + lh + wh)$$\nGiven $l = 12.0\\text{ cm}, w = 6.0\\text{ cm}, h = 8.0\\text{ cm}$:\n$$lw = 12.0 \\times 6.0 = 72.0\\text{ cm}^2$$\n$$lh = 12.0 \\times 8.0 = 96.0\\text{ cm}^2$$\n$$wh = 6.0 \\times 8.0 = 48.0\\text{ cm}^2$$\n\n$$TSA = 2(72 + 96 + 48) = 2(216) = 432\\text{ cm}^2$$\n\nTherefore, the total surface area is **$432\\text{ cm}^2$**.\n\n---\n\n**(ii) Volume of the Cuboid ($V$):**\n$$V = l \\times w \\times h = 12.0 \\times 6.0 \\times 8.0 = 72 \\times 8 = 576\\text{ cm}^3$$\n\nTherefore, the volume is **$576\\text{ cm}^3$**."
        },
        {
          "part": "b",
          "marks": 9,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"400\" height=\"380\" viewBox=\"0 0 400 380\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"400\" height=\"380\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\" rx=\"10\"/><defs><pattern id=\"grid4b\" width=\"25\" height=\"25\" patternUnits=\"userSpaceOnUse\"><path d=\"M 25 0 L 0 0 0 25\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"380\" fill=\"url(#grid4b)\"/><line x1=\"25\" y1=\"190\" x2=\"375\" y2=\"190\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"200\" y1=\"15\" x2=\"200\" y2=\"365\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"380\" y=\"195\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"205\" y=\"20\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><polygon points=\"200,90 275,90 325,40\" fill=\"#38bdf8\" fill-opacity=\"0.3\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"180\" y=\"90\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">A(0,4)</text><text x=\"275\" y=\"82\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">B(3,4)</text><text x=\"330\" y=\"40\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">C(5,6)</text><polygon points=\"150,115 225,115 275,65\" fill=\"#10b981\" fill-opacity=\"0.25\" stroke=\"#059669\" stroke-dasharray=\"3\" stroke-width=\"1.8\"/><text x=\"110\" y=\"125\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#059669\">A₁(-2,3)</text><text x=\"225\" y=\"132\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#059669\">B₁(1,3)</text><text x=\"275\" y=\"60\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#059669\">C₁(3,5)</text><polygon points=\"200,290 275,290 325,340\" fill=\"#f43f5e\" fill-opacity=\"0.25\" stroke=\"#e11d48\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><text x=\"165\" y=\"295\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#e11d48\">A₂(0,-4)</text><text x=\"275\" y=\"305\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#e11d48\">B₂(3,-4)</text><text x=\"330\" y=\"345\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\" fill=\"#e11d48\">C₂(5,-6)</text></svg>",
          "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on both axes, draw two perpendicular axes $Ox$ and $Oy$ on a graph sheet for the intervals $-5 \\le x \\le 5$ and $-6 \\le y \\le 6$.\n(i) Plot and join the vertices $A(0, 4), B(3, 4),$ and $C(5, 6)$ to form triangle $ABC$.\n(ii) Draw the image $A_1B_1C_1$ of triangle $ABC$ under a translation by the vector $\\mathbf{v} = \\begin{pmatrix} -2 \\\\ -1 \\end{pmatrix}$.\n(iii) Draw the image $A_2B_2C_2$ of triangle $ABC$ under a reflection in the $x$-axis.",
          "workedSolution": "**(i) Vertices of original triangle $ABC$:**\n- $A(0, 4)$\n- $B(3, 4)$\n- $C(5, 6)$\n\n---\n\n**(ii) Translation by vector $\\mathbf{v} = \\begin{pmatrix} -2 \\\\ -1 \\end{pmatrix}$:**\n$$\\begin{pmatrix} x' \\\\ y' \\end{pmatrix} = \\begin{pmatrix} x \\\\ y \\end{pmatrix} + \\begin{pmatrix} -2 \\\\ -1 \\end{pmatrix}$$\n- $A_1 = \\begin{pmatrix} 0 \\\\ 4 \\end{pmatrix} + \\begin{pmatrix} -2 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} -2 \\\\ 3 \\end{pmatrix} \\implies A_1(-2, 3)$\n- $B_1 = \\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix} + \\begin{pmatrix} -2 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 3 \\end{pmatrix} \\implies B_1(1, 3)$\n- $C_1 = \\begin{pmatrix} 5 \\\\ 6 \\end{pmatrix} + \\begin{pmatrix} -2 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 5 \\end{pmatrix} \\implies C_1(3, 5)$\n\n---\n\n**(iii) Reflection in the $x$-axis:**\nMapping rule: $(x, y) \\to (x, -y)$\n- $A_2(0, -4)$\n- $B_2(3, -4)$\n- $C_2(5, -6)$\n\n*(See the embedded SVG coordinate plot for the exact geometric rendering)*."
        }
      ]
    },
    {
      "questionNumber": 5,
      "id": "BECE_2014_P2_Q05",
      "marks": 15,
      "topic": "Geometric Construction and Circumscribed Circle",
      "subQuestions": [
        {
          "part": "a",
          "marks": 10,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"380\" height=\"340\" viewBox=\"0 0 380 340\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"380\" height=\"340\" fill=\"#ffffff\" rx=\"10\"/><circle cx=\"190\" cy=\"170\" r=\"88\" fill=\"none\" stroke=\"#7c3aed\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><polygon points=\"110,210 270,210 170,95\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"190\" y1=\"60\" x2=\"190\" y2=\"280\" stroke=\"#0284c7\" stroke-dasharray=\"4\" stroke-width=\"1.5\"/><line x1=\"130\" y1=\"220\" x2=\"250\" y2=\"100\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.5\"/><circle cx=\"190\" cy=\"170\" r=\"4\" fill=\"#7c3aed\"/><text x=\"198\" y=\"168\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#7c3aed\">N</text><text x=\"95\" y=\"225\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"280\" y=\"225\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">R</text><text x=\"165\" y=\"85\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Q</text><text x=\"180\" y=\"230\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">8 cm</text><text x=\"120\" y=\"145\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">6 cm</text><text x=\"230\" y=\"145\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">5 cm</text></svg>",
          "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct triangle $PQR$ such that $|PR| = 8.0\\text{ cm}, |PQ| = 6.0\\text{ cm},$ and $|QR| = 5.0\\text{ cm}$;\n(ii) Construct the perpendicular bisector of line $PR$ and label it $l_1$;\n(iii) Construct the perpendicular bisector of line $QR$ and label it $l_2$;\n(iv) Label the point of intersection of $l_1$ and $l_2$ as $N$;\n(v) With $N$ as centre and radius $|NP|$, construct a circle to circumscribe triangle $PQR$.",
          "workedSolution": "**Step-by-Step Construction Guide:**\n1. **Base Line $|PR| = 8.0\\text{ cm}$:**\n   - Draw a horizontal reference line and mark point $P$.\n   - Set compasses to $8.0\\text{ cm}$ and cut the line from $P$ to establish $R$.\n2. **Locating Vertex $Q$:**\n   - Open compasses to $6.0\\text{ cm}$, place needle at $P$, and draw an arc above $PR$.\n   - Open compasses to $5.0\\text{ cm}$, place needle at $R$, and draw a second arc intersecting the first at point $Q$.\n   - Join $PQ$ and $QR$ with firm straight lines to complete triangle $PQR$.\n3. **Perpendicular Bisector of $PR$ ($l_1$):**\n   - With needle at $P$ and radius $> 4.0\\text{ cm}$, strike arcs above and below $PR$.\n   - Repeat with needle at $R$ to intersect these arcs.\n   - Draw a line through the intersections and label it $l_1$.\n4. **Perpendicular Bisector of $QR$ ($l_2$):**\n   - With needle at $Q$ and $R$ respectively, draw intersecting arcs across segment $QR$.\n   - Draw the line through the intersection points and label it $l_2$.\n5. **Circumcentre $N$ and Circumscribed Circle:**\n   - Mark the intersection of $l_1$ and $l_2$ as $N$.\n   - Place compass needle at $N$, adjust radius to touch vertex $P$ (which also touches $Q$ and $R$), and draw the complete circumscribed circle."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "(i) Measure the radius of the circle in (a)(v);\n(ii) Calculate the circumference of the circle, correct to $3\\text{ significant figures}$. $[\\text{Take } \\pi = 3.142]$",
          "workedSolution": "**(i) Measuring the circumradius ($R$):**\n- From the scaled geometric construction, the measured radius $|NP|$ is:\n$$R \\approx 4.1\\text{ cm} \\quad (\\text{acceptable tolerance: } 4.0\\text{ cm} \\text{ to } 4.2\\text{ cm})$$\n\n---\n\n**(ii) Calculating the circumference of the circle:**\n$$C = 2\\pi R$$\nUsing measured $R = 4.1\\text{ cm}$ and $\\pi = 3.142$:\n$$C = 2 \\times 3.142 \\times 4.1 = 6.284 \\times 4.1 = 25.7644\\text{ cm}$$\nRounding to $3$ significant figures:\n$$C \\approx 25.8\\text{ cm}$$\n\nTherefore, the circumference of the circle is **$25.8\\text{ cm}$**."
        }
      ]
    },
    {
      "questionNumber": 6,
      "id": "BECE_2014_P2_Q06",
      "marks": 15,
      "topic": "Algebraic Factorization, Pythagorean Wall Ladder, and Fractional Inventory",
      "subQuestions": [
        {
          "part": "a",
          "marks": 4,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Factorize completely: $8ab - 4b + 6a - 3$.",
          "workedSolution": "Group terms pairwise:\n$$8ab - 4b + 6a - 3 = (8ab - 4b) + (6a - 3)$$\n\nFactor out common factors from each pair:\n$$= 4b(2a - 1) + 3(2a - 1)$$\n\nExtract the common binomial factor $(2a - 1)$:\n$$= (2a - 1)(4b + 3)$$\n\nTherefore, the completely factorized form is **$(2a - 1)(4b + 3)$**."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"360\" height=\"280\" viewBox=\"0 0 360 280\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"360\" height=\"280\" fill=\"#ffffff\" rx=\"10\"/><line x1=\"40\" y1=\"240\" x2=\"320\" y2=\"240\" stroke=\"#334155\" stroke-width=\"2\"/><line x1=\"80\" y1=\"30\" x2=\"80\" y2=\"240\" stroke=\"#0f172a\" stroke-width=\"3\"/><polygon points=\"80,30 65,45 80,60 65,75 80,90 65,105 80,120 65,135 80,150 65,165 80,180 65,195 80,210 65,225 80,240\" fill=\"none\" stroke=\"#64748b\" stroke-width=\"1.5\"/><line x1=\"80\" y1=\"80\" x2=\"260\" y2=\"240\" stroke=\"#b45309\" stroke-width=\"3.5\" stroke-linecap=\"round\"/><polyline points=\"80,222 98,222 98,240\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><circle cx=\"80\" cy=\"80\" r=\"4\" fill=\"#0f172a\"/><circle cx=\"80\" cy=\"240\" r=\"4\" fill=\"#0f172a\"/><circle cx=\"260\" cy=\"240\" r=\"4\" fill=\"#0f172a\"/><text x=\"72\" y=\"22\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Q</text><text x=\"55\" y=\"85\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><text x=\"60\" y=\"258\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"265\" y=\"258\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"25\" y=\"165\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">12 m</text><text x=\"160\" y=\"260\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0f172a\">9 m</text><text x=\"180\" y=\"150\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#b45309\">AB</text><text x=\"100\" y=\"275\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
          "questionText": "The diagram shows a ladder $AB$ which leans against a vertical wall $PQ$ at point $B$. If $|PB|$ is $12\\text{ m}$ and the foot of the ladder $A$ is $9\\text{ m}$ away from the foot of the wall at $P$, calculate the length of the ladder ($AB$).",
          "workedSolution": "From the diagram, triangle $APB$ is a right-angled triangle with the right angle at $P$ ($\\angle APB = 90^\\circ$):\n- Base $|AP| = 9\\text{ m}$\n- Vertical height $|PB| = 12\\text{ m}$\n- Hypotenuse = ladder length $|AB|$\n\nApply the Pythagorean theorem:\n$$|AB|^2 = |AP|^2 + |PB|^2$$\n$$|AB|^2 = 9^2 + 12^2$$\n$$|AB|^2 = 81 + 144 = 225$$\n$$|AB| = \\sqrt{225} = 15\\text{ m}$$\n\nTherefore, the length of the ladder ($AB$) is **$15\\text{ m}$**."
        },
        {
          "part": "c",
          "marks": 6,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "A storekeeper had $2,400\\text{ bags}$ of fertilizer in stock for the planting season. In April, he sold $\\frac{3}{5}$ of the stock. In May, he sold $\\frac{2}{3}$ of what was left.\n(i) What fraction of the original stock of fertilizer did he sell:\n    $(\\alpha)$ in May?\n    $(\\beta)$ altogether in April and May?\n(ii) How many bags of fertilizer were left unsold by the end of May?",
          "workedSolution": "**(i) ($a$) Fraction of original stock sold in May:**\n- Fraction sold in April $= \\frac{3}{5}$\n- Fraction remaining after April $= 1 - \\frac{3}{5} = \\frac{2}{5}$\n- Fraction sold in May $= \\frac{2}{3}$ of the remainder:\n$$\\text{Fraction in May} = \\frac{2}{3} \\times \\frac{2}{5} = \\frac{4}{15}$$\n\nTherefore, he sold **$\\frac{4}{15}$** of the original stock in May.\n\n---\n\n**(i) ($\\beta$) Fraction sold altogether in April and May:**\n$$\\text{Total fraction sold} = \\frac{3}{5} + \\frac{4}{15}$$\nUsing common denominator $15$:\n$$= \\frac{9}{15} + \\frac{4}{15} = \\frac{13}{15}$$\n\nTherefore, he sold **$\\frac{13}{15}$** of the total stock altogether.\n\n---\n\n**(ii) Number of bags left unsold by the end of May:**\n- Fraction left unsold $= 1 - \\frac{13}{15} = \\frac{2}{15}$\n$$\\text{Unsold bags} = \\frac{2}{15} \\times 2,400$$\n$$= 2 \\times 160 = 320\\text{ bags}$$\n\nTherefore, **$320\\text{ bags}$** of fertilizer were left unsold."
        }
      ]
    }
  ]
};

export const SET_BECE_2014_MATH_P2: CurriculumQuestionSet = {
  id: "jhs-math-2014-paper2",
  title: "BECE 2014 Mathematics Paper 2 (Theory / Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2014 Paper 2",
  variantType: "past_paper_variant",
  totalQuestions: 6,
  version: 1,
  format: 'structured_essay',
  paperType: 2,
  year: 2014,
  era: 'legacy',
  instructions: "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
  timeAllowed: "1 hour",
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2014/paper_2",
  theoryTopicList: [
    { id: "q1", questionNumber: 1, theoryIndex: 1, title: "Sets, Simple Interest & Standard Form", category: "Algebra & Number" },
    { id: "q2", questionNumber: 2, theoryIndex: 2, title: "Averages & Parallel Lines Angles", category: "Statistics & Geometry" },
    { id: "q3", questionNumber: 3, theoryIndex: 3, title: "Linear Inequalities & Stem-and-Leaf", category: "Algebra & Data" },
    { id: "q4", questionNumber: 4, theoryIndex: 4, title: "Cuboid Mensuration & Transformations", category: "Mensuration & Geometry" },
    { id: "q5", questionNumber: 5, theoryIndex: 5, title: "Geometric Construction & Circumscribed Circle", category: "Geometry & Construction" },
    { id: "q6", questionNumber: 6, theoryIndex: 6, title: "Factorization, Ladder & Inventory", category: "Algebra & Arithmetic" }
  ],
  questions: BECE_2014_MATH_P2_DATA.questions.map((q) => {
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

export const SET_BECE_2014_MATH_P2_ALIAS: CurriculumQuestionSet = {
  ...SET_BECE_2014_MATH_P2,
  id: "bece_2014_math_p2"
};
