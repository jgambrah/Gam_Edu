import { CurriculumQuestionSet } from '../global-curriculum-types';

export const BECE_2018_MATH_P1_DATA = {
  "examMetadata": {
    "examYear": 2018,
    "examination": "BECE (Basic Education Certificate Examination)",
    "subject": "Mathematics",
    "paper": "Paper 1 (Objective Test)",
    "totalQuestions": 40,
    "timeAllowed": "1 hour",
    "curriculumAlignment": "NaCCA JHS Common Core Programme / WAEC Standards",
    "firestoreCollectionPath": "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2018/paper_1",
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
      "id": "BECE_2018_P1_Q01",
      "questionText": "Which of the following sets of integers is arranged in ascending order of magnitude?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $-18, -45, 6, 21$",
        "B. $-45, -18, 6, 21$",
        "C. $-45, -18, 21, 6$",
        "D. $21, 6, -18, -45$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Ascending order means ordering values from the smallest (most negative) to the largest (most positive):\n$$-45 < -18 < 6 < 21$$\n\nTherefore, option B is correct.",
      "topic": "Integers and Ordering"
    },
    {
      "questionNumber": 2,
      "id": "BECE_2018_P1_Q02",
      "questionText": "If $M = \\{x : x \\text{ is an even integer such that } 4 < x \\le 14\\}$, list the members of set $M$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\{4, 6, 8, 10, 12, 14\\}$",
        "B. $\\{6, 8, 10, 12\\}$",
        "C. $\\{5, 7, 9, 11, 13\\}$",
        "D. $\\{6, 8, 10, 12, 14\\}$"
      ],
      "correctAnswer": "D",
      "workedSolution": "The condition states $x$ is even, strictly greater than $4$ (excluding $4$), and less than or equal to $14$ (including $14$):\n$$M = \\{6, 8, 10, 12, 14\\}$$\n\nTherefore, option D is correct.",
      "topic": "Sets and Set-Builder Notation"
    },
    {
      "questionNumber": 3,
      "id": "BECE_2018_P1_Q03",
      "questionText": "Which of the following representations describes an infinite set?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\{2, 4, 6, \\dots, 20\\}$",
        "B. $\\{3, 5, 7, 11, 13, \\dots\\}$",
        "C. $\\{x : x \\text{ is a factor of } 48\\}$",
        "D. $\\{1, 4, 9, 16, 25\\}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "An infinite set has elements that continue without bound and cannot be counted completely. The set $\\{3, 5, 7, 11, 13, \\dots\\}$ continues indefinitely without a terminal upper bound.\n\nTherefore, option B is correct.",
      "topic": "Types of Sets"
    },
    {
      "questionNumber": 4,
      "id": "BECE_2018_P1_Q04",
      "questionText": "Find the highest common factor (HCF) of $24, 48,$ and $72$ in prime factor product form.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $2^2 \\times 3$",
        "B. $2^3 \\times 3$",
        "C. $2^3 \\times 3^2$",
        "D. $2 \\times 3^2$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Express each number in prime factor decomposition:\n$$24 = 2^3 \\times 3$$\n$$48 = 2^4 \\times 3$$\n$$72 = 2^3 \\times 3^2$$\nTake the lowest power of common prime bases:\n$$\\text{HCF} = 2^{\\min(3,4,3)} \\times 3^{\\min(1,1,2)} = 2^3 \\times 3$$\n\nTherefore, option B is correct.",
      "topic": "Number Theory and HCF"
    },
    {
      "questionNumber": 5,
      "id": "BECE_2018_P1_Q05",
      "questionText": "Write three hundred and five million, four thousand, three hundred and two in numerals.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $305,004,302$",
        "B. $305,040,302$",
        "C. $305,400,302$",
        "D. $350,004,302$"
      ],
      "correctAnswer": "A",
      "workedSolution": "- Three hundred and five million: $305,000,000$\n- Four thousand: $4,000$\n- Three hundred and two: $302$\nSum: $305,000,000 + 4,000 + 302 = 305,004,302$\n\nTherefore, option A is correct.",
      "topic": "Number Notation and Place Value"
    },
    {
      "questionNumber": 6,
      "id": "BECE_2018_P1_Q06",
      "questionText": "Find the least whole number that must be added to $235$ to make the sum exactly divisible by $19$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $5$",
        "B. $7$",
        "C. $12$",
        "D. $14$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Divide $235$ by $19$:\n$$235 \\div 19 = 12 \\text{ remainder } 7$$\nTo reach the next multiple of $19$ ($19 \\times 13 = 247$):\n$$\\text{Number to add} = 19 - 7 = 12$$\n\nTherefore, option C is correct.",
      "topic": "Divisibility and Integers"
    },
    {
      "questionNumber": 7,
      "id": "BECE_2018_P1_Q07",
      "questionText": "If $A = \\{\\text{factors of } 24\\}$ and $B = \\{\\text{multiples of } 3 \\text{ less than } 20\\}$, find the total number of subsets in $A \\cap B$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $4$",
        "B. $8$",
        "C. $16$",
        "D. $32$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$A = \\{1, 2, 3, 4, 6, 8, 12, 24\\}$$\n$$B = \\{3, 6, 9, 12, 15, 18\\}$$\n$$A \\cap B = \\{3, 6, 12\\} \\implies n(A \\cap B) = 3$$\n$$\\text{Number of subsets} = 2^3 = 8$$\n\nTherefore, option B is correct.",
      "topic": "Sets and Subsets"
    },
    {
      "questionNumber": 8,
      "id": "BECE_2018_P1_Q08",
      "questionText": "Find the least common multiple (LCM) of $12, 18,$ and $30$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $90$",
        "B. $120$",
        "C. $180$",
        "D. $360$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Express in prime factors:\n$$12 = 2^2 \\times 3$$\n$$18 = 2 \\times 3^2$$\n$$30 = 2 \\times 3 \\times 5$$\n$$\\text{LCM} = 2^2 \\times 3^2 \\times 5 = 4 \\times 9 \\times 5 = 180$$\n\nTherefore, option C is correct.",
      "topic": "Number Theory and LCM"
    },
    {
      "questionNumber": 9,
      "id": "BECE_2018_P1_Q09",
      "questionText": "Evaluate: $3\\frac{1}{2} - \\left(1\\frac{3}{4} + \\frac{5}{8}\\right)$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $1\\frac{1}{8}$",
        "B. $1\\frac{3}{8}$",
        "C. $1\\frac{5}{8}$",
        "D. $2\\frac{1}{8}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Convert mixed numbers and simplify inside brackets:\n$$1\\frac{3}{4} + \\frac{5}{8} = \\frac{7}{4} + \\frac{5}{8} = \\frac{14 + 5}{8} = \\frac{19}{8}$$\nSubtract from $3\\frac{1}{2} = \\frac{7}{2} = \\frac{28}{8}$:\n$$\\frac{28}{8} - \\frac{19}{8} = \\frac{9}{8} = 1\\frac{1}{8}$$\n\nTherefore, option A is correct.",
      "topic": "Operations on Fractions"
    },
    {
      "questionNumber": 10,
      "id": "BECE_2018_P1_Q10",
      "questionText": "Arrange the fractions $\\frac{4}{5}, \\frac{7}{10},$ and $\\frac{13}{15}$ in ascending order of magnitude.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{7}{10}, \\frac{4}{5}, \\frac{13}{15}$",
        "B. $\\frac{4}{5}, \\frac{7}{10}, \\frac{13}{15}$",
        "C. $\\frac{13}{15}, \\frac{4}{5}, \\frac{7}{10}$",
        "D. $\\frac{7}{10}, \\frac{13}{15}, \\frac{4}{5}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Convert each fraction to an equivalent fraction with denominator $\\text{LCM}(5, 10, 15) = 30$:\n$$\\frac{7}{10} = \\frac{21}{30}$$\n$$\\frac{4}{5} = \\frac{24}{30}$$\n$$\\frac{13}{15} = \\frac{26}{30}$$\nAscending order:\n$$\\frac{21}{30} < \\frac{24}{30} < \\frac{26}{30} \\implies \\frac{7}{10}, \\frac{4}{5}, \\frac{13}{15}$$\n\nTherefore, option A is correct.",
      "topic": "Fractions and Ordering"
    },
    {
      "questionNumber": 11,
      "id": "BECE_2018_P1_Q11",
      "questionText": "Find the simple interest on $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 900.00$ saved for $2\\text{ years } 4\\text{ months}$ at an annual interest rate of $6\\%$ per annum.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 108.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 126.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 135.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 144.00$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Convert time to years:\n$$T = 2\\text{ years} + \\frac{4}{12}\\text{ year} = 2 + \\frac{1}{3} = \\frac{7}{3}\\text{ years}$$\n$$I = \\frac{P \\times R \\times T}{100} = \\frac{900 \\times 6 \\times \\frac{7}{3}}{100} = 9 \\times 2 \\times 7 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 126.00$$\n\nTherefore, option B is correct.",
      "topic": "Simple Interest"
    },
    {
      "questionNumber": 12,
      "id": "BECE_2018_P1_Q12",
      "questionText": "The number of boys in a school is $540$. If the ratio of boys to girls in the school is $3 : 2$, calculate the total population of students in the school.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $720$",
        "B. $810$",
        "C. $900$",
        "D. $1,080$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Let the common ratio multiplier be $k$:\n$$\\text{Boys} = 3k = 540 \\implies k = 180$$\n$$\\text{Girls} = 2k = 2 \\times 180 = 360$$\n$$\\text{Total population} = 540 + 360 = 900$$\n\nTherefore, option C is correct.",
      "topic": "Ratio and Proportion"
    },
    {
      "questionNumber": 13,
      "id": "BECE_2018_P1_Q13",
      "questionText": "A card is drawn at random from a set of cards numbered $1$ to $25$. What is the probability that the number on the card is divisible by $4$?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{4}{25}$",
        "B. $\\frac{6}{25}$",
        "C. $\\frac{7}{25}$",
        "D. $\\frac{8}{25}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Sample space } n(S) = 25$$\n$$\\text{Multiples of 4: } \\{4, 8, 12, 16, 20, 24\\} \\implies n(E) = 6$$\n$$P(E) = \\frac{6}{25}$$\n\nTherefore, option B is correct.",
      "topic": "Probability"
    },
    {
      "questionNumber": 14,
      "id": "BECE_2018_P1_Q14",
      "questionText": "A trader bought a pair of shoes for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 40.00$ and sold it for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 50.00$. Find her percentage profit.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $20\\%$",
        "B. $25\\%$",
        "C. $30\\%$",
        "D. $40\\%$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Profit} = 50.00 - 40.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 10.00$$\n$$\\text{Percentage profit} = \\left(\\frac{10}{40}\\right) \\times 100\\% = 25\\%$$\n\nTherefore, option B is correct.",
      "topic": "Commercial Arithmetic: Profit"
    },
    {
      "questionNumber": 15,
      "id": "BECE_2018_P1_Q15",
      "questionText": "Ten men can weed a field in $12\\text{ days}$. How many days will $8$ men take to weed the same field working at the exact same rate?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $14\\text{ days}$",
        "B. $15\\text{ days}$",
        "C. $16\\text{ days}$",
        "D. $18\\text{ days}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Total work} = 10 \\times 12 = 120\\text{ man-days}$$\n$$\\text{Days for 8 men} = \\frac{120}{8} = 15\\text{ days}$$\n\nTherefore, option B is correct.",
      "topic": "Inverse Proportion"
    },
    {
      "questionNumber": 16,
      "id": "BECE_2018_P1_Q16",
      "questionText": "In the diagram below, line $QP$ is parallel to line $ST$ ($QP \\parallel ST$), with $\\angle QPR = 70^\\circ$ and $\\angle SRT = 45^\\circ$. Find the value of angle $\\angle PQR$.",
      "hasDiagram": true,
      "svgDiagram": "<svg width=\"360\" height=\"220\" viewBox=\"0 0 360 220\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><line x1=\"50\" y1=\"160\" x2=\"110\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"250\" y1=\"190\" x2=\"310\" y2=\"70\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"110\" y1=\"40\" x2=\"250\" y2=\"190\" stroke=\"#dc2626\" stroke-width=\"2\"/><line x1=\"50\" y1=\"160\" x2=\"310\" y2=\"70\" stroke=\"#0284c7\" stroke-width=\"2\"/><polygon points=\"80,95 86,102 78,102\" fill=\"#0f172a\"/><polygon points=\"280,125 286,132 278,132\" fill=\"#0f172a\"/><text x=\"40\" y=\"180\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Q</text><text x=\"105\" y=\"30\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"170\" y=\"110\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">R</text><text x=\"245\" y=\"210\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">S</text><text x=\"315\" y=\"65\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">T</text><text x=\"100\" y=\"65\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">70°</text><text x=\"195\" y=\"115\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#0284c7\">45°</text></svg>",
      "options": [
        "A. $45^\\circ$",
        "B. $65^\\circ$",
        "C. $70^\\circ$",
        "D. $115^\\circ$"
      ],
      "correctAnswer": "B",
      "workedSolution": "At the intersection $R$, the vertically opposite angle to $\\angle SRT = 45^\\circ$ is $\\angle PRQ = 45^\\circ$.\nInside triangle $PQR$:\n$$\\angle PQR + \\angle QPR + \\angle PRQ = 180^\\circ$$\n$$\\angle PQR + 70^\\circ + 45^\\circ = 180^\\circ$$\n$$\\angle PQR + 115^\\circ = 180^\\circ$$\n$$\\angle PQR = 180^\\circ - 115^\\circ = 65^\\circ$$\n\nTherefore, option B is correct.",
      "topic": "Plane Geometry and Angles"
    },
    {
      "questionNumber": 17,
      "id": "BECE_2018_P1_Q17",
      "questionText": "Using the diagram in Question 16, find the value of angle $\\angle TSR$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $45^\\circ$",
        "B. $65^\\circ$",
        "C. $70^\\circ$",
        "D. $110^\\circ$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Since line $QP$ is parallel to line $ST$ ($QP \\parallel ST$), transversal line $PS$ creates alternate interior angles:\n$$\\angle TSR = \\angle QPR = 70^\\circ$$\n\nTherefore, option C is correct.",
      "topic": "Plane Geometry and Parallel Lines"
    },
    {
      "questionNumber": 18,
      "id": "BECE_2018_P1_Q18",
      "questionText": "A passenger bus travels at an average speed of $72\\text{ km/h}$. What distance does it cover between $9:15\\text{ a.m.}$ and $11:45\\text{ a.m.}$?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $144\\text{ km}$",
        "B. $160\\text{ km}$",
        "C. $180\\text{ km}$",
        "D. $196\\text{ km}$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Time elapsed} = 11:45 - 9:15 = 2\\text{ hours } 30\\text{ minutes} = 2.5\\text{ hours}$$\n$$\\text{Distance} = \\text{Speed} \\times \\text{Time} = 72 \\times 2.5 = 180\\text{ km}$$\n\nTherefore, option C is correct.",
      "topic": "Speed, Distance, and Time"
    },
    {
      "questionNumber": 19,
      "id": "BECE_2018_P1_Q19",
      "questionText": "The perimeter of a rectangular banner is $32\\text{ cm}$. If its length is $11\\text{ cm}$, calculate its area.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $44\\text{ cm}^2$",
        "B. $55\\text{ cm}^2$",
        "C. $66\\text{ cm}^2$",
        "D. $110\\text{ cm}^2$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Perimeter} = 2(l + w) = 32$$\n$$11 + w = 16 \\implies w = 5\\text{ cm}$$\n$$\\text{Area} = l \\times w = 11 \\times 5 = 55\\text{ cm}^2$$\n\nTherefore, option B is correct.",
      "topic": "Mensuration: Area and Perimeter"
    },
    {
      "questionNumber": 20,
      "id": "BECE_2018_P1_Q20",
      "questionText": "Find the gradient (slope) of the straight line represented by the equation: $4x - 8y = 24$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $-2$",
        "B. $-\\frac{1}{2}$",
        "C. $\\frac{1}{2}$",
        "D. $2$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Convert to slope-intercept form $y = mx + c$:\n$$4x - 8y = 24$$\n$$-8y = -4x + 24$$\n$$y = \\frac{-4}{-8}x + \\frac{24}{-8}$$\n$$y = \\frac{1}{2}x - 3$$\n$$\\text{Slope } m = \\frac{1}{2}$$\n\nTherefore, option C is correct.",
      "topic": "Coordinate Geometry: Gradient"
    },
    {
      "questionNumber": 21,
      "id": "BECE_2018_P1_Q21",
      "questionText": "Given that $y = c + kx^2$, find the value of $y$ when $c = 3\\frac{1}{2}, k = \\frac{1}{2},$ and $x = 3$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $6$",
        "B. $8$",
        "C. $9$",
        "D. $11$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Substitute the given values:\n$$y = 3.5 + \\frac{1}{2}(3^2) = 3.5 + \\frac{1}{2}(9) = 3.5 + 4.5 = 8$$\n\nTherefore, option B is correct.",
      "topic": "Algebraic Substitution"
    },
    {
      "questionNumber": 22,
      "id": "BECE_2018_P1_Q22",
      "questionText": "The volume of a solid cylinder is $45\\pi\\text{ cm}^3$. If the height of the cylinder is $5\\text{ cm}$, find its base radius.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $2\\text{ cm}$",
        "B. $3\\text{ cm}$",
        "C. $4\\text{ cm}$",
        "D. $9\\text{ cm}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$V = \\pi r^2 h$$\n$$45\\pi = \\pi r^2 (5)$$\nDivide both sides by $5\\pi$:\n$$r^2 = \\frac{45}{5} = 9$$\n$$r = \\sqrt{9} = 3\\text{ cm}$$\n\nTherefore, option B is correct.",
      "topic": "Mensuration: Cylinders"
    },
    {
      "questionNumber": 23,
      "id": "BECE_2018_P1_Q23",
      "questionText": "In the diagram below, triangle $PQR$ is right-angled at $Q$, with hypotenuse $|PR| = 25\\text{ cm}$ and base $|QR| = 20\\text{ cm}$. Find the length of $|PQ|$.",
      "hasDiagram": true,
      "svgDiagram": "<svg width=\"280\" height=\"180\" viewBox=\"0 0 280 180\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><polygon points=\"50,140 230,140 50,30\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><polyline points=\"50,125 65,125 65,140\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.8\"/><text x=\"35\" y=\"155\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Q</text><text x=\"240\" y=\"145\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">R</text><text x=\"35\" y=\"25\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"135\" y=\"158\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">20 cm</text><text x=\"150\" y=\"80\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">25 cm</text></svg>",
      "options": [
        "A. $12\\text{ cm}$",
        "B. $15\\text{ cm}$",
        "C. $18\\text{ cm}$",
        "D. $22\\text{ cm}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "By the Pythagorean theorem:\n$$|PQ|^2 + |QR|^2 = |PR|^2$$\n$$|PQ|^2 + 20^2 = 25^2$$\n$$|PQ|^2 + 400 = 625$$\n$$|PQ|^2 = 625 - 400 = 225$$\n$$|PQ| = \\sqrt{225} = 15\\text{ cm}$$\n\nTherefore, option B is correct.",
      "topic": "Pythagoras' Theorem"
    },
    {
      "questionNumber": 24,
      "id": "BECE_2018_P1_Q24",
      "questionText": "How many edges does a triangular prism possess?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $5$",
        "B. $6$",
        "C. $8$",
        "D. $9$"
      ],
      "correctAnswer": "D",
      "workedSolution": "A triangular prism has $2$ triangular bases ($3 + 3 = 6$ edges) connected by $3$ lateral edges:\n$$\\text{Total edges} = 3 + 3 + 3 = 9$$\n\nTherefore, option D is correct.",
      "topic": "Solid Geometry"
    },
    {
      "questionNumber": 25,
      "id": "BECE_2018_P1_Q25",
      "questionText": "Make $m$ the subject of the relation: $q = \\frac{1}{3}(m + n)h$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $m = \\frac{3q}{h} - n$",
        "B. $m = 3q - hn$",
        "C. $m = \\frac{3q}{h} + n$",
        "D. $m = \\frac{3qh}{n}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Multiply both sides by $3$:\n$$3q = (m + n)h$$\nDivide by $h$:\n$$\\frac{3q}{h} = m + n$$\nSubtract $n$:\n$$m = \\frac{3q}{h} - n$$\n\nTherefore, option A is correct.",
      "topic": "Change of Subject"
    },
    {
      "questionNumber": 26,
      "id": "BECE_2018_P1_Q26",
      "questionText": "Simplify: $16^3 \\times 8^2$ in index form with base $2$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $2^{16}$",
        "B. $2^{18}$",
        "C. $2^{20}$",
        "D. $2^{24}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Convert both bases to powers of $2$:\n$$16 = 2^4 \\implies 16^3 = (2^4)^3 = 2^{12}$$\n$$8 = 2^3 \\implies 8^2 = (2^3)^2 = 2^6$$\n$$16^3 \\times 8^2 = 2^{12} \\times 2^6 = 2^{12 + 6} = 2^{18}$$\n\nTherefore, option B is correct.",
      "topic": "Indices and Exponents"
    },
    {
      "questionNumber": 27,
      "id": "BECE_2018_P1_Q27",
      "questionText": "Simplify: $6x - 11y - 3(2x - 4y)$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $-y$",
        "B. $y$",
        "C. $12x - 23y$",
        "D. $-23y$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Expand brackets taking care of signs:\n$$6x - 11y - 6x + 12y = (6x - 6x) + (-11y + 12y) = y$$\n\nTherefore, option B is correct.",
      "topic": "Algebraic Simplification"
    },
    {
      "questionNumber": 28,
      "id": "BECE_2018_P1_Q28",
      "questionText": "Given vectors $\\mathbf{u} = \\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$ and $\\mathbf{v} = \\begin{pmatrix} -1 \\\\ 4 \\end{pmatrix}$, evaluate $4\\mathbf{v} + 3\\mathbf{u}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\begin{pmatrix} 2 \\\\ 25 \\end{pmatrix}$",
        "B. $\\begin{pmatrix} -2 \\\\ 25 \\end{pmatrix}$",
        "C. $\\begin{pmatrix} 10 \\\\ 25 \\end{pmatrix}$",
        "D. $\\begin{pmatrix} 2 \\\\ 7 \\end{pmatrix}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "$$4\\mathbf{v} = 4\\begin{pmatrix} -1 \\\\ 4 \\end{pmatrix} = \\begin{pmatrix} -4 \\\\ 16 \\end{pmatrix}$$\n$$3\\mathbf{u} = 3\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ 9 \\end{pmatrix}$$\n$$4\\mathbf{v} + 3\\mathbf{u} = \\begin{pmatrix} -4 + 6 \\\\ 16 + 9 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 25 \\end{pmatrix}$$\n\nTherefore, option A is correct.",
      "topic": "Vectors"
    },
    {
      "questionNumber": 29,
      "id": "BECE_2018_P1_Q29",
      "questionText": "Find the image of the point $(3, 7)$ under the transformation $\\begin{pmatrix} x \\\\ y \\end{pmatrix} \\to \\begin{pmatrix} x^2 - y \\\\ 2y \\end{pmatrix}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $(2, 14)$",
        "B. $(-2, 14)$",
        "C. $(2, 7)$",
        "D. $(16, 14)$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Substitute $x = 3$ and $y = 7$:\n$$x' = 3^2 - 7 = 9 - 7 = 2$$\n$$y' = 2(7) = 14$$\n$$\\text{Image} = (2, 14)$$\n\nTherefore, option A is correct.",
      "topic": "Transformational Geometry"
    },
    {
      "questionNumber": 30,
      "id": "BECE_2018_P1_Q30",
      "questionText": "Find the coordinates of the image of $Q(-5, 6)$ when rotated $90^\\circ$ anti-clockwise about the origin.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $Q'(-6, -5)$",
        "B. $Q'(-6, 5)$",
        "C. $Q'(6, -5)$",
        "D. $Q'(5, 6)$"
      ],
      "correctAnswer": "A",
      "workedSolution": "The transformation mapping for $90^\\circ$ anti-clockwise rotation is $(x, y) \\to (-y, x)$:\n$$Q(-5, 6) \\to Q'(-6, -5)$$\n\nTherefore, option A is correct.",
      "topic": "Transformational Geometry: Rotation"
    },
    {
      "questionNumber": 31,
      "id": "BECE_2018_P1_Q31",
      "questionText": "The marks obtained by pupils in a classroom quiz are:\n$$9, 5, 2, 5, 4, 4, 3, 2, 2, 8, 9, 6$$\nIf the pass mark was $5$, how many pupils scored strictly more than the pass mark?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $3$",
        "B. $4$",
        "C. $5$",
        "D. $6$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Pupils scoring strictly greater than $5$ (scores $> 5$):\n$$\\{6, 8, 9, 9\\}$$\nCounting these marks gives $4$ pupils.\n\nTherefore, option B is correct.",
      "topic": "Statistics and Data Interpretation"
    },
    {
      "questionNumber": 32,
      "id": "BECE_2018_P1_Q32",
      "questionText": "Using the dataset in Question 31 ($9, 5, 2, 5, 4, 4, 3, 2, 2, 8, 9, 6$), calculate the mean mark.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $4.5$",
        "B. $4.8$",
        "C. $5.0$",
        "D. $5.2$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\sum x = 9 + 5 + 2 + 5 + 4 + 4 + 3 + 2 + 2 + 8 + 9 + 6 = 60$$\n$$n = 12$$\n$$\\text{Mean} = \\frac{60}{12} = 5.0$$\n\nTherefore, option C is correct.",
      "topic": "Statistics: Mean"
    },
    {
      "questionNumber": 33,
      "id": "BECE_2018_P1_Q33",
      "questionText": "How many lines of symmetry does a regular pentagon have?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $3$",
        "B. $4$",
        "C. $5$",
        "D. $10$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Any regular polygon with $n$ sides has exactly $n$ axes of symmetry. A regular pentagon has $5$ lines of symmetry.\n\nTherefore, option C is correct.",
      "topic": "Symmetry in Polygons"
    },
    {
      "questionNumber": 34,
      "id": "BECE_2018_P1_Q34",
      "questionText": "In an enlargement transformation, line segment $CD = 4\\text{ cm}$ is mapped onto $C'D' = 28\\text{ cm}$. Find the linear scale factor of the enlargement.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{1}{7}$",
        "B. $4$",
        "C. $7$",
        "D. $24$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Scale factor } k = \\frac{\\text{Image length}}{\\text{Object length}} = \\frac{28}{4} = 7$$\n\nTherefore, option C is correct.",
      "topic": "Transformational Geometry: Enlargement"
    },
    {
      "questionNumber": 35,
      "id": "BECE_2018_P1_Q35",
      "questionText": "Find the rule describing the linear mapping:\n$$\\begin{array}{cccccc} x & 0 & 2 & 4 & 6 & 8 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & -3 & 3 & 9 & 15 & 21 \\end{array}$$",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $y \\to 2x - 3$",
        "B. $y \\to 3x - 3$",
        "C. $y \\to 3x + 3$",
        "D. $y \\to x^2 - 3$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Find the gradient $m$:\n$$m = \\frac{3 - (-3)}{2 - 0} = \\frac{6}{2} = 3$$\n$y$-intercept at $x = 0$ is $c = -3$:\n$$y = 3x - 3$$\n\nTherefore, option B is correct.",
      "topic": "Relations and Mappings"
    },
    {
      "questionNumber": 36,
      "id": "BECE_2018_P1_Q36",
      "questionText": "Solve the inequality: $\\frac{1}{2}(4x - 2) + 3 \\le 10 + x$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $x \\le 6$",
        "B. $x \\ge 6$",
        "C. $x \\le 8$",
        "D. $x \\ge 8$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Expand brackets:\n$$(2x - 1) + 3 \\le 10 + x$$\n$$2x + 2 \\le 10 + x$$\n$$2x - x \\le 10 - 2$$\n$$x \\le 8$$\n\nTherefore, option C is correct.",
      "topic": "Linear Inequalities"
    },
    {
      "questionNumber": 37,
      "id": "BECE_2018_P1_Q37",
      "questionText": "If $6 - 2x = 4(3x + 5)$, find the value of $x$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $-2$",
        "B. $-1$",
        "C. $1$",
        "D. $2$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Expand and solve:\n$$6 - 2x = 12x + 20$$\n$$-2x - 12x = 20 - 6$$\n$$-14x = 14$$\n$$x = \\frac{14}{-14} = -1$$\n\nTherefore, option B is correct.",
      "topic": "Linear Equations"
    },
    {
      "questionNumber": 38,
      "id": "BECE_2018_P1_Q38",
      "questionText": "In a school club, there are $15\\text{ girls}$ and $35\\text{ boys}$. Calculate the percentage of members who are boys.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $30\\%$",
        "B. $50\\%$",
        "C. $70\\%$",
        "D. $75\\%$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Total members} = 15 + 35 = 50$$\n$$\\text{Percentage of boys} = \\left(\\frac{35}{50}\\right) \\times 100\\% = 35 \\times 2\\% = 70\\%$$\n\nTherefore, option C is correct.",
      "topic": "Percentages"
    },
    {
      "questionNumber": 39,
      "id": "BECE_2018_P1_Q39",
      "questionText": "The bearing of point $X$ from point $Y$ is $045^\\circ$. What is the bearing of point $Y$ from point $X$?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $135^\\circ$",
        "B. $215^\\circ$",
        "C. $225^\\circ$",
        "D. $315^\\circ$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Since the forward bearing $\\theta = 045^\\circ < 180^\\circ$, add $180^\\circ$ to find the back bearing:\n$$\\text{Back bearing} = 045^\\circ + 180^\\circ = 225^\\circ$$\n\nTherefore, option C is correct.",
      "topic": "Bearings"
    },
    {
      "questionNumber": 40,
      "id": "BECE_2018_P1_Q40",
      "questionText": "Which of the following statements correctly identifies the geometric construction shown below?",
      "hasDiagram": true,
      "svgDiagram": "<svg width=\"360\" height=\"200\" viewBox=\"0 0 360 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><line x1=\"40\" y1=\"110\" x2=\"320\" y2=\"110\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><circle cx=\"180\" cy=\"40\" r=\"4\" fill=\"#0f172a\"/><text x=\"175\" y=\"30\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"25\" y=\"115\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">A</text><text x=\"330\" y=\"115\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">B</text><path d=\"M 110 95 A 90 90 0 0 0 250 95\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2\"/><path d=\"M 160 145 A 40 40 0 0 0 190 170\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><path d=\"M 200 145 A 40 40 0 0 1 170 170\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.8\"/><line x1=\"180\" y1=\"40\" x2=\"180\" y2=\"175\" stroke=\"#0f172a\" stroke-width=\"2\"/></svg>",
      "options": [
        "A. Construction of the bisector of line $AB$",
        "B. Construction of an arc of a circle with centre $P$",
        "C. Construction of an angle of $60^\\circ$ at point $P$",
        "D. Construction of a perpendicular from point $P$ to meet line $AB$"
      ],
      "correctAnswer": "D",
      "workedSolution": "The compass needle is placed at an external point $P$ to strike an arc cutting line $AB$ at two distinct points. Arcs struck below line $AB$ from these two intersections create the perpendicular line dropped from point $P$ to line $AB$.\n\nTherefore, option D is correct.",
      "topic": "Geometric Construction"
    }
  ]
};

export const SET_BECE_2018_MATH_P1: CurriculumQuestionSet = {
  id: "jhs-math-2018-paper1",
  title: "BECE 2018 Mathematics Paper 1 (Objective Test)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2018 Paper 1",
  variantType: "past_paper_variant",
  totalQuestions: 40,
  version: 1,
  format: 'multiple_choice',
  paperType: 1,
  year: 2018,
  era: 'legacy',
  timeAllowed: "1 hour",
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2018/paper_1",
  questions: BECE_2018_MATH_P1_DATA.questions.map((q) => {
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

export const SET_BECE_2018_MATH_P1_ALIAS: CurriculumQuestionSet = {
  ...SET_BECE_2018_MATH_P1,
  id: "bece_2018_math_p1"
};

export const BECE_2018_MATH_P2_DATA = {
  "examMetadata": {
    "examYear": 2018,
    "examination": "BECE (Basic Education Certificate Examination)",
    "subject": "Mathematics",
    "paper": "Paper 2 (Theory / Essay)",
    "totalQuestions": 6,
    "instructions": "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
    "timeAllowed": "1 hour",
    "curriculumAlignment": "NaCCA JHS Common Core Programme / WAEC Standards",
    "firestoreCollectionPath": "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2018/paper_2"
  },
  "questions": [
    {
      "questionNumber": 1,
      "id": "BECE_2018_P2_Q01",
      "marks": 15,
      "topic": "Linear Inequalities, Vector Arithmetic, and Perimeter Ratios",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"360\" height=\"80\" viewBox=\"0 0 360 80\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><line x1=\"20\" y1=\"40\" x2=\"340\" y2=\"40\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"35\" x2=\"60\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"120\" y1=\"35\" x2=\"120\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"180\" y1=\"35\" x2=\"180\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"240\" y1=\"35\" x2=\"240\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><line x1=\"300\" y1=\"35\" x2=\"300\" y2=\"45\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"55\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">-1</text><text x=\"117\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">0</text><text x=\"177\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">1</text><text x=\"237\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">2</text><text x=\"297\" y=\"60\" font-family=\"sans-serif\" font-size=\"12\">3</text><circle cx=\"177\" cy=\"25\" r=\"5\" fill=\"#0284c7\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><line x1=\"177\" y1=\"25\" x2=\"35\" y2=\"25\" stroke=\"#0284c7\" stroke-width=\"3\"/><polygon points=\"35,20 25,25 35,30\" fill=\"#0284c7\"/></svg>",
          "questionText": "Solve the inequality $4x - 2 \\ge \\frac{13x - 9}{2}$ and represent the solution on a number line.",
          "workedSolution": "**Step 1: Eliminate the fraction by multiplying through by $2$:**\n$$2(4x - 2) \\ge 13x - 9$$\n$$8x - 4 \\ge 13x - 9$$\n\n**Step 2: Group like terms:**\n$$8x - 13x \\ge -9 + 4$$\n$$-5x \\ge -5$$\n\n**Step 3: Divide both sides by $-5$ and reverse the inequality sign:**\n$$x \\le \\frac{-5}{-5}$$\n$$x \\le 1$$\n\n**Truth set:** $\\mathbf{\\{x : x \\le 1\\}}$.\n\n*(Represented on the number line above with a solid circle at $1$ and an arrow extending leftward toward negative infinity)*."
        },
        {
          "part": "b",
          "marks": 4,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Given the column vectors $\\mathbf{t} = \\begin{pmatrix} -2 \\\\ 4 \\end{pmatrix}$ and $\\mathbf{k} = \\begin{pmatrix} 3 \\\\ -5 \\end{pmatrix}$, find $2\\mathbf{t} + \\mathbf{k}$.",
          "workedSolution": "**Step 1: Multiply vector $\\mathbf{t}$ by the scalar $2$:**\n$$2\\mathbf{t} = 2\\begin{pmatrix} -2 \\\\ 4 \\end{pmatrix} = \\begin{pmatrix} 2(-2) \\\\ 2(4) \\end{pmatrix} = \\begin{pmatrix} -4 \\\\ 8 \\end{pmatrix}$$\n\n**Step 2: Add vector $\\mathbf{k}$:**\n$$2\\mathbf{t} + \\mathbf{k} = \\begin{pmatrix} -4 \\\\ 8 \\end{pmatrix} + \\begin{pmatrix} 3 \\\\ -5 \\end{pmatrix} = \\begin{pmatrix} -4 + 3 \\\\ 8 + (-5) \\end{pmatrix} = \\begin{pmatrix} -1 \\\\ 3 \\end{pmatrix}$$\n\nTherefore, **$2\\mathbf{t} + \\mathbf{k} = \\begin{pmatrix} -1 \\\\ 3 \\end{pmatrix}$**."
        },
        {
          "part": "c",
          "marks": 6,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "The sides of a triangular garden are in the ratio $5 : 7 : 8$. If the perimeter of the garden is $240\\text{ m}$, find the:\n(i) length of the longest side;\n(ii) length of the shortest side;\n(iii) difference between the longest and shortest sides.",
          "workedSolution": "**Step 1: Find the sum of ratio parts:**\n$$\\text{Total ratio parts} = 5 + 7 + 8 = 20$$\n$$\\text{Length per part} = \\frac{240\\text{ m}}{20} = 12\\text{ m}$$\n\n---\n\n**(i) Longest side:**\n$$\\text{Longest side} = 8 \\times 12\\text{ m} = 96\\text{ m}$$\n\nTherefore, the longest side is **$96\\text{ m}$**.\n\n---\n\n**(ii) Shortest side:**\n$$\\text{Shortest side} = 5 \\times 12\\text{ m} = 60\\text{ m}$$\n\nTherefore, the shortest side is **$60\\text{ m}$**.\n\n---\n\n**(iii) Difference between longest and shortest sides:**\n$$\\text{Difference} = 96\\text{ m} - 60\\text{ m} = 36\\text{ m}$$\n*(Alternatively: $(8 - 5) \\times 12\\text{ m} = 3 \\times 12\\text{ m} = 36\\text{ m}$)*.\n\nTherefore, the difference is **$36\\text{ m}$**."
        }
      ]
    },
    {
      "questionNumber": 2,
      "id": "BECE_2018_P2_Q02",
      "marks": 15,
      "topic": "Commercial Royalties, Order of Operations, and Compound Triangles",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "A social studies textbook is sold for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 30.00$. The author receives a royalty of $15\\%$ on each copy sold. If $2,400\\text{ copies}$ were sold, calculate the author's total royalty earnings.",
          "workedSolution": "**Step 1: Calculate the royalty earned per copy:**\n$$\\text{Royalty per book} = \\frac{15}{100} \\times 30.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4.50$$\n\n**Step 2: Calculate total earnings for 2,400 copies:**\n$$\\text{Total royalty} = 2,400 \\times 4.50 = 2,400 \\times \\frac{9}{2} = 1,200 \\times 9 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 10,800.00$$\n\nTherefore, the author's total share is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 10,800.00$**."
        },
        {
          "part": "b",
          "marks": 4,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Simplify: $\\left(\\frac{1}{6} + \\frac{2}{3}\\right) + \\left(\\frac{7}{8} \\times \\frac{4}{7}\\right) + \\left(\\frac{2}{5} \\div \\frac{4}{5}\\right)$.",
          "workedSolution": "Evaluate each set of parentheses separately according to the order of operations:\n\n**First bracket:**\n$$\\frac{1}{6} + \\frac{2}{3} = \\frac{1}{6} + \\frac{4}{6} = \\frac{5}{6}$$\n\n**Second bracket:**\n$$\\frac{7}{8} \\times \\frac{4}{7} = \\frac{1}{2}$$\n\n**Third bracket:**\n$$\\frac{2}{5} \\div \\frac{4}{5} = \\frac{2}{5} \\times \\frac{5}{4} = \\frac{2}{4} = \\frac{1}{2}$$\n\n**Combine all terms:**\n$$\\frac{5}{6} + \\frac{1}{2} + \\frac{1}{2} = \\frac{5}{6} + 1 = 1\\frac{5}{6} = \\frac{11}{6}$$\n\nTherefore, the simplified result is **$1\\frac{5}{6}$ (or $\\frac{11}{6}$)**."
        },
        {
          "part": "c",
          "marks": 6,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"360\" height=\"240\" viewBox=\"0 0 360 240\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><polygon points=\"40,200 320,200 130,50\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"130\" y1=\"50\" x2=\"130\" y2=\"200\" stroke=\"#0f172a\" stroke-width=\"2\"/><polyline points=\"130,185 145,185 145,200\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"125\" y=\"38\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">M</text><text x=\"25\" y=\"210\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">N</text><text x=\"325\" y=\"210\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"125\" y=\"220\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">S</text><text x=\"70\" y=\"120\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">15 cm</text><text x=\"230\" y=\"120\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">20 cm</text><text x=\"138\" y=\"130\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">12 cm</text><text x=\"110\" y=\"235\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
          "questionText": "In the diagram, $|MN| = 15\\text{ cm}, |MP| = 20\\text{ cm}, |MS| = 12\\text{ cm},$ and line $MS$ is perpendicular to line segment $NP$ ($MS \\perp NP$). Calculate the length of $NP$.",
          "workedSolution": "The altitude $MS$ splits triangle $MNP$ into two right-angled triangles, $\\triangle MSN$ and $\\triangle MSP$ with right angles at $S$:\n\n**Step 1: In $\\triangle MSN$, find $|NS|$ by Pythagoras' Theorem:**\n$$|MN|^2 = |NS|^2 + |MS|^2$$\n$$15^2 = |NS|^2 + 12^2$$\n$$225 = |NS|^2 + 144$$\n$$|NS|^2 = 225 - 144 = 81$$\n$$|NS| = \\sqrt{81} = 9\\text{ cm}$$\n\n**Step 2: In $\\triangle MSP$, find $|SP|$ by Pythagoras' Theorem:**\n$$|MP|^2 = |SP|^2 + |MS|^2$$\n$$20^2 = |SP|^2 + 12^2$$\n$$400 = |SP|^2 + 144$$\n$$|SP|^2 = 400 - 144 = 256$$\n$$|SP| = \\sqrt{256} = 16\\text{ cm}$$\n\n**Step 3: Calculate the total base length $|NP|$:**\n$$|NP| = |NS| + |SP| = 9\\text{ cm} + 16\\text{ cm} = 25\\text{ cm}$$\n\nTherefore, the length of $NP$ is **$25\\text{ cm}$**."
        }
      ]
    },
    {
      "questionNumber": 3,
      "id": "BECE_2018_P2_Q03",
      "marks": 15,
      "topic": "Scientific Notation, Change of Subject, and Mass Conversions",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Simplify $\\frac{0.096 \\times 0.64}{0.032 \\times 0.08}$ and leave your answer in standard form.",
          "workedSolution": "**Step 1: Simplify using factor cancellation:**\n$$\\frac{0.096 \\times 0.64}{0.032 \\times 0.08}$$\nNotice that:\n$$\\frac{0.096}{0.032} = 3$$\n$$\\frac{0.64}{0.08} = 8$$\n\nMultiplying the simplified terms:\n$$3 \\times 8 = 24$$\n\n**Step 2: Express in standard form ($A \\times 10^n$ where $1 \\le A < 10$):**\n$$24 = 2.4 \\times 10^1$$\n\nTherefore, the answer in standard form is **$2.4 \\times 10^1$**."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "(i) Make $r$ the subject of the relation: $y = \\frac{x - r}{x + r}$.\n(ii) Hence, find the value of $r$ when $y = 2$ and $x = 12$.",
          "workedSolution": "**(i) Making $r$ the subject:**\n$$y(x + r) = x - r$$\n$$yx + yr = x - r$$\nCollect all terms containing $r$ on one side and remaining terms on the other:\n$$yr + r = x - yx$$\n$$r(y + 1) = x(1 - y)$$\n$$r = \\frac{x(1 - y)}{y + 1} \\quad \\left(\\text{or } r = \\frac{x - yx}{y + 1}\\right)$$\n\n---\n\n**(ii) Evaluating $r$ when $y = 2$ and $x = 12$:**\n$$r = \\frac{12(1 - 2)}{2 + 1} = \\frac{12(-1)}{3} = \\frac{-12}{3} = -4$$\n\nTherefore, **$r = -4$**."
        },
        {
          "part": "c",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Abena bought $2.45\\text{ kg}$ of fresh fish, $850\\text{ g}$ of onions, and $125\\text{ g}$ of ground pepper from a market stall. What is the total weight of the items purchased, expressed in kilograms?",
          "workedSolution": "**Step 1: Convert all items measured in grams to kilograms ($1\\text{ kg} = 1,000\\text{ g}$):**\n$$\\text{Weight of fish} = 2.45\\text{ kg}$$\n$$\\text{Weight of onions} = \\frac{850}{1000} = 0.85\\text{ kg}$$\n$$\\text{Weight of pepper} = \\frac{125}{1000} = 0.125\\text{ kg}$$\n\n**Step 2: Sum the values in kilograms:**\n$$\\text{Total weight} = 2.45 + 0.85 + 0.125 = 3.425\\text{ kg}$$\n\nTherefore, the total weight of the items is **$3.425\\text{ kg}$**."
        }
      ]
    },
    {
      "questionNumber": 4,
      "id": "BECE_2018_P2_Q04",
      "marks": 15,
      "topic": "Polygons and Geometric Triangle Construction",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "The sum of the interior angles of a regular polygon is $1,080^\\circ$. Find the number of sides of the polygon.",
          "workedSolution": "The formula for the sum of the interior angles of an $n$-sided polygon is:\n$$S = (n - 2) \\times 180^\\circ$$\n$$1,080^\\circ = (n - 2) \\times 180^\\circ$$\n$$n - 2 = \\frac{1,080}{180} = 6$$\n$$n = 6 + 2 = 8$$\n\nTherefore, the polygon has **$8\\text{ sides}$** (it is an octagon)."
        },
        {
          "part": "b",
          "marks": 10,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"420\" height=\"260\" viewBox=\"0 0 420 260\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><polygon points=\"60,200 360,200 240,70\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"240\" y1=\"70\" x2=\"240\" y2=\"200\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><polyline points=\"240,185 255,185 255,200\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"1.5\"/><path d=\"M 100 200 A 40 40 0 0 0 95 180\" fill=\"none\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"105\" y=\"190\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">30°</text><text x=\"45\" y=\"215\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Y</text><text x=\"370\" y=\"215\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">X</text><text x=\"235\" y=\"58\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Z</text><text x=\"235\" y=\"225\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">P</text><text x=\"190\" y=\"220\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">10 cm</text><text x=\"135\" y=\"120\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">9 cm</text><text x=\"248\" y=\"140\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">h</text></svg>",
          "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct triangle $XYZ$ such that length $|XY| = 10.0\\text{ cm}, \\angle XYZ = 30^\\circ,$ and length $|YZ| = 9.0\\text{ cm}$;\n(ii) Construct the perpendicular line from vertex $Z$ to meet line segment $XY$ at point $P$;\n(iii) Measure the length of $|PZ|$;\n(iv) Calculate, correct to the nearest whole number, the area of triangle $XYZ$.",
          "workedSolution": "**(i) & (ii) Construction Steps:**\n1. Draw a horizontal straight line and mark vertex $Y$.\n2. Set compasses to $10.0\\text{ cm}$ and cut the line to locate point $X$.\n3. At vertex $Y$, construct an angle of $60^\\circ$ using equal radius arcs, then bisect it with intersecting arcs to obtain a $30^\\circ$ ray.\n4. Set compasses to $9.0\\text{ cm}$, place the needle at $Y$, and cut the $30^\\circ$ ray to locate vertex $Z$.\n5. Connect vertex $Z$ to vertex $X$ with a straight line to complete triangle $XYZ$.\n6. With needle at $Z$, strike arcs cutting baseline $XY$ at two distinct points. From these two points, strike arcs below $XY$ to construct perpendicular line $ZP$ meeting $XY$ at $P$.\n\n---\n\n**(iii) Measuring $|PZ|$:**\n- In right-angled triangle $\\triangle YPZ$:\n$$|PZ| = |YZ| \\times \\sin 30^\\circ = 9.0 \\times 0.5 = 4.5\\text{ cm}$$\n$$\\mathbf{|PZ| \\approx 4.5\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(iv) Calculating the area of triangle $XYZ$:**\n$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times |XY| \\times |PZ|$$\n$$\\text{Area} = \\frac{1}{2} \\times 10.0 \\times 4.5 = 5.0 \\times 4.5 = 22.5\\text{ cm}^2$$\nRounding to the nearest whole number:\n$$\\text{Area} \\approx 23\\text{ cm}^2$$\n\nTherefore, the area of triangle $XYZ$ correct to the nearest whole number is **$23\\text{ cm}^2$**."
        }
      ]
    },
    {
      "questionNumber": 5,
      "id": "BECE_2018_P2_Q05",
      "marks": 15,
      "topic": "Ratio Division and Stem-and-Leaf Statistical Analysis",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "An estate valued at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 14,400.00$ is shared between a widow and her $8\\text{ children}$ in the ratio $1 : 3$ respectively. The children shared their portion equally among themselves. Find each child's share.",
          "workedSolution": "**Step 1: Calculate total ratio parts:**\n$$\\text{Total parts} = 1 + 3 = 4$$\n\n**Step 2: Calculate the children's combined share:**\n$$\\text{Children's share} = \\frac{3}{4} \\times 14,400.00 = 3 \\times 3,600.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 10,800.00$$\n\n**Step 3: Divide equally among the 8 children:**\n$$\\text{Share per child} = \\frac{10,800.00}{8} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,350.00$$\n\nTherefore, each child received **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,350.00$**."
        },
        {
          "part": "b",
          "marks": 10,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "The following scores were obtained by $30\\text{ candidates}$ in an achievement test:\n$$\\begin{matrix} 27 & 55 & 19 & 65 & 69 & 46 \\\\ 38 & 42 & 14 & 57 & 11 & 13 \\\\ 14 & 67 & 22 & 10 & 25 & 17 \\\\ 45 & 39 & 61 & 52 & 43 & 24 \\\\ 28 & 63 & 56 & 49 & 64 & 32 \\end{matrix}$$\n(i) Construct an ordered stem-and-leaf plot to represent the distribution.\n(ii) How many candidates scored strictly more than $10$ marks and strictly less than $20$ marks?\n(iii) What is the probability that a candidate selected at random scored strictly less than $20$ marks?",
          "workedSolution": "**(i) Ordered Stem-and-Leaf Plot:**\n- Stems represent tens digits ($1, 2, 3, 4, 5, 6$)\n- Leaves represent units digits arranged in ascending order\n\n$$\\begin{array}{r|l} \\text{Stem} & \\text{Leaves} \\\\ \\hline 1 & 0, 1, 3, 4, 4, 7, 9 \\\\ 2 & 2, 4, 5, 7, 8 \\\\ 3 & 2, 8, 39 \\to 2, 8, 9 \\\\ 4 & 2, 3, 5, 6, 9 \\\\ 5 & 2, 5, 6, 7 \\\\ 6 & 1, 3, 4, 5, 67, 69 \\to 1, 3, 4, 5, 7, 9 \\end{array}$$\n\n**Neat Tabulation:**\n- **Stem 1 ($10-19$):** $0, 1, 3, 4, 4, 7, 9$ ($7$ leaves)\n- **Stem 2 ($20-29$):** $2, 4, 5, 7, 8$ ($5$ leaves)\n- **Stem 3 ($30-39$):** $2, 8, 9$ ($3$ leaves)\n- **Stem 4 ($40-49$):** $2, 3, 5, 6, 9$ ($5$ leaves)\n- **Stem 5 ($50-59$):** $2, 5, 6, 7$ ($4$ leaves)\n- **Stem 6 ($60-69$):** $1, 3, 4, 5, 7, 9$ ($6$ leaves)\n\n$$\\text{Key: } 1 \\mid 4 \\text{ represents } 14$$\n\n---\n\n**(ii) Candidates scoring strictly more than 10 and strictly less than 20 ($10 < x < 20$):**\nThese are marks with stem $1$, excluding $10$:\n$$\\{11, 13, 14, 14, 17, 19\\}$$\nCounting the leaves yields **$6\\text{ candidates}$**.\n\n---\n\n**(iii) Probability of selecting a candidate scoring strictly less than 20 ($x < 20$):**\nAll values on stem $1$ are less than $20$:\n$$\\{10, 11, 13, 14, 14, 17, 19\\} \\implies n(E) = 7$$\n$$n(S) = 30$$\n$$P(x < 20) = \\frac{7}{30}$$\n\nTherefore, the probability is **$\\frac{7}{30}$**."
        }
      ]
    },
    {
      "questionNumber": 6,
      "id": "BECE_2018_P2_Q06",
      "marks": 15,
      "topic": "Time Arithmetic and Cartesian Geometry Line Intersections",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "An international flight departed from Kotoka International Airport in Accra on Friday at $8: 45\\text{ p.m.}$ and arrived at its destination after a flight duration of $8\\text{ hours } 35\\text{ minutes}$. State the exact day and time the flight arrived at its destination.",
          "workedSolution": "**Step 1: Convert departure to 24-hour clock:**\n$$\\text{Departure} = 8:45\\text{ p.m.} = 20:45$$\n\n**Step 2: Add the flight duration of $8\\text{ h } 35\\text{ min}$:**\n$$\\text{Minutes} = 45 + 35 = 80\\text{ minutes} = 1\\text{ hour } 20\\text{ minutes}$$\n$$\\text{Hours} = 20 + 8 + 1 = 29\\text{ hours}$$\n\n**Step 3: Account for day transition:**\n$$29\\text{ hours } 20\\text{ minutes} - 24\\text{ hours} = 05:20$$\nSince the flight crossed midnight ($24:00$), the day advances from Friday to Saturday.\n\nTherefore, the aircraft reached its destination on **Saturday at $5:20\\text{ a.m.}$** (or $05:20\\text{ GMT}$)."
        },
        {
          "part": "b",
          "marks": 10,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"420\" height=\"420\" viewBox=\"0 0 420 420\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"420\" height=\"420\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"grid18\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"420\" height=\"420\" fill=\"url(#grid18)\"/><line x1=\"20\" y1=\"210\" x2=\"400\" y2=\"210\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"210\" y1=\"20\" x2=\"210\" y2=\"400\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"405\" y=\"215\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"215\" y=\"20\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><polygon points=\"210,110 150,230 180,320 250,180\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"210\" cy=\"110\" r=\"4\" fill=\"#0284c7\"/><circle cx=\"150\" cy=\"230\" r=\"4\" fill=\"#0284c7\"/><circle cx=\"180\" cy=\"320\" r=\"4\" fill=\"#0284c7\"/><circle cx=\"250\" cy=\"180\" r=\"4\" fill=\"#0284c7\"/><text x=\"215\" y=\"105\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">A(0,10)</text><text x=\"110\" y=\"230\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">B(-6,-2)</text><text x=\"135\" y=\"335\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">C(-3,-11)</text><text x=\"255\" y=\"180\" font-family=\"sans-serif\" font-size=\"10\" font-weight=\"bold\">D(4,3)</text><line x1=\"190\" y1=\"40\" x2=\"190\" y2=\"380\" stroke=\"#dc2626\" stroke-width=\"2\" stroke-dasharray=\"4\"/><circle cx=\"190\" cy=\"150\" r=\"4\" fill=\"#dc2626\"/><circle cx=\"190\" cy=\"260\" r=\"4\" fill=\"#dc2626\"/><text x=\"175\" y=\"145\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">P</text><text x=\"175\" y=\"270\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">Q</text><text x=\"180\" y=\"35\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\" fill=\"#dc2626\">x = -2</text></svg>",
          "questionText": "Using a scale of $2\\text{ cm}$ to $2\\text{ units}$ on both axes, draw on a graph sheet two perpendicular axes $Ox$ and $Oy$ for $-10 \\le x \\le 10$ and $-12 \\le y \\le 12$.\n(i) Plot the vertices $A(0, 10), B(-6, -2), C(-3, -11),$ and $D(4, 3)$ and join them to form quadrilateral $ABCD$.\n(ii) Draw the vertical line $x = -2$ to meet side $AB$ at $P$ and side $CD$ at $Q$.\n(iii) Measure the angles $\\angle BPQ$ and $\\angle PQD$.\n(iv) State the geometric relationship between:\n    $(\\alpha)$ angles $\\angle BPQ$ and $\\angle PQD$;\n    $(\\beta)$ lines $AB$ and $CD$.",
          "workedSolution": "**(i) & (ii) Coordinates and Line Intersections:**\n- Equation of side $AB$ passing through $A(0, 10)$ and $B(-6, -2)$:\n  $$m_{AB} = \\frac{-2 - 10}{-6 - 0} = \\frac{-12}{-6} = 2$$\n  $$y = 2x + 10$$\n  At $x = -2$: $y_P = 2(-2) + 10 = 6 \\implies P(-2, 6)$.\n\n- Equation of side $CD$ passing through $C(-3, -11)$ and $D(4, 3)$:\n  $$m_{CD} = \\frac{3 - (-11)}{4 - (-3)} = \\frac{14}{7} = 2$$\n  $$y - 3 = 2(x - 4) \\implies y = 2x - 5$$\n  At $x = -2$: $y_Q = 2(-2) - 5 = -9 \\implies Q(-2, -9)$.\n\n---\n\n**(iii) Measuring $\\angle BPQ$ and $\\angle PQD$:**\n- Since line $PQ$ is vertical ($x = -2$) and both lines $AB$ and $CD$ have gradient $m = 2$:\n  $$\\tan\\theta = 2 \\implies \\theta = \\arctan(2) \\approx 63.4^\\circ$$\n  The angle between a line of slope $2$ and the vertical axis is $90^\\circ - 63.4^\\circ = 26.6^\\circ$, or the interior obtuse transversal angle is $180^\\circ - 26.6^\\circ = 153.4^\\circ$ (or $63^\\circ$ depending on orientation):\n$$\\mathbf{\\angle BPQ = \\angle PQD \\approx 63^\\circ \\pm 1^\\circ} \\quad (\\text{or alternate interior angle } 117^\\circ)$$\n\n---\n\n**(iv) Geometric relationships:**\n- $(\\alpha)$ Angles $\\angle BPQ$ and $\\angle PQD$ are **alternate interior angles** and are equal in magnitude.\n- $(\\beta)$ Since both lines $AB$ and $CD$ have identical slopes ($m_{AB} = m_{CD} = 2$), lines $AB$ and $CD$ are **parallel** ($AB \\parallel CD$)."
        }
      ]
    }
  ]
};

export const SET_BECE_2018_MATH_P2: CurriculumQuestionSet = {
  id: "jhs-math-2018-paper2",
  title: "BECE 2018 Mathematics Paper 2 (Theory / Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2018 Paper 2",
  variantType: "past_paper_variant",
  totalQuestions: 6,
  version: 1,
  format: 'structured_essay',
  paperType: 2,
  year: 2018,
  era: 'legacy',
  instructions: "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
  timeAllowed: "1 hour",
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2018/paper_2",
  theoryTopicList: [
    { id: "q1", questionNumber: 1, theoryIndex: 1, title: "Linear Inequalities, Vectors & Perimeter Ratios", category: "Inequalities & Vectors" },
    { id: "q2", questionNumber: 2, theoryIndex: 2, title: "Book Royalties, Fraction BIDMAS & Altitude Triangles", category: "Arithmetic & Geometry" },
    { id: "q3", questionNumber: 3, theoryIndex: 3, title: "Standard Form, Change of Subject & Mass Conversions", category: "Algebra & Conversions" },
    { id: "q4", questionNumber: 4, theoryIndex: 4, title: "Polygon Angles & Compass Triangle Construction", category: "Polygons & Construction" },
    { id: "q5", questionNumber: 5, theoryIndex: 5, title: "Estate Ratio Sharing & Stem-and-Leaf Distribution", category: "Ratios & Statistics" },
    { id: "q6", questionNumber: 6, theoryIndex: 6, title: "Flight Time Arithmetic & Cartesian Line Intersections", category: "Time & Coordinate Geometry" }
  ],
  questions: BECE_2018_MATH_P2_DATA.questions.map((q) => {
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

export const SET_BECE_2018_MATH_P2_ALIAS: CurriculumQuestionSet = {
  ...SET_BECE_2018_MATH_P2,
  id: "bece_2018_math_p2"
};
