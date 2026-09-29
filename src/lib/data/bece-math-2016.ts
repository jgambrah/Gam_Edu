import { CurriculumQuestionSet } from '../global-curriculum-types';

export const BECE_2016_MATH_P1_DATA = {
  "examMetadata": {
    "examYear": 2016,
    "examination": "BECE (Basic Education Certificate Examination)",
    "subject": "Mathematics",
    "paper": "Paper 1 (Objective Test)",
    "totalQuestions": 40,
    "timeAllowed": "1 hour",
    "curriculumAlignment": "NaCCA JHS Common Core Programme / WAEC Standards",
    "firestoreCollectionPath": "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2016/paper_1",
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
      "id": "BECE_2016_P1_Q01",
      "questionText": "Which of the following describes a finite set?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\{2, 4, 6, 8, \\dots\\}$",
        "B. $\\{1, 3, 5, 7, \\dots\\}$",
        "C. $\\{x : x \\text{ is a positive integer}\\}$",
        "D. $\\{4, 8, 12, 16, 20\\}$"
      ],
      "correctAnswer": "D",
      "workedSolution": "A finite set contains a countable, limited number of elements that has an end. The set $\\{4, 8, 12, 16, 20\\}$ has exactly $5$ elements, whereas the other options contain ellipses ($\\dots$) denoting infinite elements.\n\nTherefore, option D is correct.",
      "topic": "Sets and Operations on Sets"
    },
    {
      "questionNumber": 2,
      "id": "BECE_2016_P1_Q02",
      "questionText": "Given that set $K = \\{w, x, y, z\\}$, find the total number of subsets of $K$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $8$",
        "B. $12$",
        "C. $16$",
        "D. $32$"
      ],
      "correctAnswer": "C",
      "workedSolution": "The total number of subsets of a set with $n$ elements is given by $2^n$.\nHere, $n(K) = 4$:\n$$\\text{Number of subsets} = 2^4 = 16$$\n\nTherefore, option C is correct.",
      "topic": "Sets and Subsets"
    },
    {
      "questionNumber": 3,
      "id": "BECE_2016_P1_Q03",
      "questionText": "If $A = \\{2, 3, 5, 7, 11\\}$ and $B = \\{1, 3, 5, 7, 9\\}$, find $A \\cap B$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\{3, 5, 7\\}$",
        "B. $\\{2, 3, 5, 7\\}$",
        "C. $\\{1, 2, 9, 11\\}$",
        "D. $\\{1, 2, 3, 5, 7, 9, 11\\}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "The intersection $A \\cap B$ comprises all elements found simultaneously in both sets:\n$$A = \\{2, \\mathbf{3}, \\mathbf{5}, \\mathbf{7}, 11\\}$$\n$$B = \\{1, \\mathbf{3}, \\mathbf{5}, \\mathbf{7}, 9\\}$$\n$$A \\cap B = \\{3, 5, 7\\}$$\n\nTherefore, option A is correct.",
      "topic": "Sets and Operations on Sets"
    },
    {
      "questionNumber": 4,
      "id": "BECE_2016_P1_Q04",
      "questionText": "A girl bought $4$ notebooks at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 18.50$ per book and tendered two $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 50.00$ notes to the cashier. How much change did she receive?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 16.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 24.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 26.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 36.00$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Total money paid} = 2 \\times 50.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 100.00$$\n$$\\text{Cost of 4 notebooks} = 4 \\times 18.50 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 74.00$$\n$$\\text{Change received} = 100.00 - 74.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 26.00$$\n\nTherefore, option C is correct.",
      "topic": "Money and Commercial Transactions"
    },
    {
      "questionNumber": 5,
      "id": "BECE_2016_P1_Q05",
      "questionText": "Find the Least Common Multiple (LCM) of the numbers $6, 12,$ and $15$ in prime factor product form.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $2 \\times 3 \\times 5$",
        "B. $2^2 \\times 3 \\times 5$",
        "C. $2^2 \\times 3^2 \\times 5$",
        "D. $2^3 \\times 3 \\times 5$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Express each integer as a product of prime factors:\n$$6 = 2 \\times 3$$\n$$12 = 2^2 \\times 3$$\n$$15 = 3 \\times 5$$\nTake the highest power of each prime factor:\n$$\\text{LCM} = 2^2 \\times 3^1 \\times 5^1 = 2^2 \\times 3 \\times 5 = 60$$\n\nTherefore, option B is correct.",
      "topic": "Number Theory and LCM"
    },
    {
      "questionNumber": 6,
      "id": "BECE_2016_P1_Q06",
      "questionText": "Correct $59,864.3812$ to the nearest hundred.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $59,800$",
        "B. $59,860$",
        "C. $59,900$",
        "D. $60,000$"
      ],
      "correctAnswer": "C",
      "workedSolution": "To round to the nearest hundred, examine the tens digit:\n- In $59,864.3812$, the hundreds digit is $8$ and the tens digit is $6$.\n- Since $6 \\ge 5$, round up the hundreds digit from $8$ to $9$, replacing subsequent digits before the decimal with zeros:\n$$59,864.3812 \\approx 59,900$$\n\nTherefore, option C is correct.",
      "topic": "Approximation and Rounding"
    },
    {
      "questionNumber": 7,
      "id": "BECE_2016_P1_Q07",
      "questionText": "Simplify: $24 + 7.8 + 0.429$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $31.229$",
        "B. $32.229$",
        "C. $32.429$",
        "D. $322.29$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Align decimal points:\n$$\\begin{array}{r@{\\,}l} 24.000 \\\\ +\\quad 7.800 \\\\ +\\quad 0.429 \\\\ \\hline 32.229 \\end{array}$$\n\nTherefore, option B is correct.",
      "topic": "Decimals and Addition"
    },
    {
      "questionNumber": 8,
      "id": "BECE_2016_P1_Q08",
      "questionText": "Evaluate $\\frac{3}{4} - \\frac{1}{6} + \\frac{5}{12}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{7}{12}$",
        "B. $\\frac{3}{4}$",
        "C. $1$",
        "D. $1\\frac{1}{6}$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Find the LCM of the denominators $4, 6,$ and $12$, which is $12$:\n$$\\frac{3}{4} = \\frac{9}{12}, \\quad \\frac{1}{6} = \\frac{2}{12}, \\quad \\frac{5}{12} = \\frac{5}{12}$$\n$$\\frac{9 - 2 + 5}{12} = \\frac{12}{12} = 1$$\n\nTherefore, option C is correct.",
      "topic": "Operations on Fractions"
    },
    {
      "questionNumber": 9,
      "id": "BECE_2016_P1_Q09",
      "questionText": "Arrange the following integers in ascending order (from least to greatest): $-6, 8, -12, -3, 5$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $-12, -6, -3, 5, 8$",
        "B. $-3, -6, -12, 5, 8$",
        "C. $8, 5, -3, -6, -12$",
        "D. $-12, -3, -6, 5, 8$"
      ],
      "correctAnswer": "A",
      "workedSolution": "On the real number line, values further to the left are smaller:\n$$-12 < -6 < -3 < 5 < 8$$\n\nTherefore, option A is correct.",
      "topic": "Integers and Ordering"
    },
    {
      "questionNumber": 10,
      "id": "BECE_2016_P1_Q10",
      "questionText": "Simplify: $(38 \\times 10^3) + (10^3 \\times 62)$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $10,000$",
        "B. $100,000$",
        "C. $1,000,000$",
        "D. $10,000,000$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Factor out the common term $10^3$ using the distributive property:\n$$(38 \\times 10^3) + (62 \\times 10^3) = 10^3(38 + 62) = 10^3(100) = 1,000 \\times 100 = 100,000$$\n\nTherefore, option B is correct.",
      "topic": "Indices and Factorization"
    },
    {
      "questionNumber": 11,
      "id": "BECE_2016_P1_Q11",
      "questionText": "Correct $6,349.5782$ to two decimal places.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $6,349.57$",
        "B. $6,349.58$",
        "C. $6,349.60$",
        "D. $6,350.00$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Look at the third decimal place (thousandths digit):\n- In $6,349.5782$, the second decimal digit is $7$ and the third digit is $8$.\n- Since $8 \\ge 5$, round up $7$ to $8$:\n$$6,349.5782 \\approx 6,349.58$$\n\nTherefore, option B is correct.",
      "topic": "Approximation and Decimals"
    },
    {
      "questionNumber": 12,
      "id": "BECE_2016_P1_Q12",
      "questionText": "Find the simple interest on $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 180,000.00$ for $4\\text{ months}$ at an annual interest rate of $10\\%$ per annum.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,500.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 7,200.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 18,000.00$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$I = \\frac{P \\times R \\times T}{100}$$\nWhere $T = \\frac{4}{12} = \\frac{1}{3}\\text{ year}$:\n$$I = \\frac{180,000 \\times 10 \\times \\frac{1}{3}}{100} = 1,800 \\times \\frac{10}{3} = 600 \\times 10 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 6,000.00$$\n\nTherefore, option B is correct.",
      "topic": "Simple Interest"
    },
    {
      "questionNumber": 13,
      "id": "BECE_2016_P1_Q13",
      "questionText": "Twelve workers take $8\\text{ hours}$ to clear a parcel of land. If $16$ workers work at the same rate, how many hours will they take to clear the same land?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $4\\text{ hours}$",
        "B. $6\\text{ hours}$",
        "C. $9\\text{ hours}$",
        "D. $10\\text{ hours}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "This is an inverse variation problem:\n$$\\text{Total worker-hours} = 12 \\times 8 = 96\\text{ worker-hours}$$\n$$\\text{Hours for 16 workers} = \\frac{96}{16} = 6\\text{ hours}$$\n\nTherefore, option B is correct.",
      "topic": "Inverse Proportion"
    },
    {
      "questionNumber": 14,
      "id": "BECE_2016_P1_Q14",
      "questionText": "A motorbike is priced at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 16,000.00$. A discount of $8\\%$ is allowed for prompt cash payment. Calculate the cost of the motorbike when paid in cash.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 14,400.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 14,720.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 15,200.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 17,280.00$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Discount} = 8\\% \\times 16,000 = \\frac{8}{100} \\times 16,000 = 8 \\times 160 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,280.00$$\n$$\\text{Cash price} = 16,000.00 - 1,280.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 14,720.00$$\n*(Alternatively: $92\\% \\times 16,000 = 0.92 \\times 16,000 = 14,720.00$)*.\n\nTherefore, option B is correct.",
      "topic": "Commercial Arithmetic: Discount"
    },
    {
      "questionNumber": 15,
      "id": "BECE_2016_P1_Q15",
      "questionText": "Simplify: $7^3 \\times 2^2 \\times 7 \\times 2^3$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $2^5 \\times 7^3$",
        "B. $2^6 \\times 7^4$",
        "C. $2^5 \\times 7^4$",
        "D. $2^6 \\times 7^3$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Group terms by common prime bases and add indices:\n$$2^2 \\times 2^3 = 2^{2+3} = 2^5$$\n$$7^3 \\times 7^1 = 7^{3+1} = 7^4$$\n$$\\text{Product} = 2^5 \\times 7^4$$\n\nTherefore, option C is correct.",
      "topic": "Indices and Exponents"
    },
    {
      "questionNumber": 16,
      "id": "BECE_2016_P1_Q16",
      "questionText": "The table shows the distribution of scores obtained by candidates in a quiz:\n\n$$\\begin{array}{|l|c|c|c|c|c|c|c|c|c|c|c|} \\hline \\textbf{Score} & 0 & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 \\\\ \\hline \\textbf{Frequency} & 3 & 4 & 5 & 4 & 5 & 4 & 7 & 3 & 4 & 2 & 2 \\\\ \\hline \\end{array}$$\n\nWhat is the modal score?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $2$",
        "B. $5$",
        "C. $6$",
        "D. $7$"
      ],
      "correctAnswer": "C",
      "workedSolution": "The modal score is the mark corresponding to the highest frequency.\nExamining frequencies: $3, 4, 5, 4, 5, 4, \\mathbf{7}, 3, 4, 2, 2$.\nThe highest frequency is $7$, which belongs to score $6$.\n$$\\text{Modal score} = 6$$\n\nTherefore, option C is correct.",
      "topic": "Statistics: Mode"
    },
    {
      "questionNumber": 17,
      "id": "BECE_2016_P1_Q17",
      "questionText": "Using the frequency table in Question 16, how many candidates failed the quiz if the minimum pass score was $4$?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $12$",
        "B. $16$",
        "C. $21$",
        "D. $25$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Candidates failed if their score was strictly less than $4$ (i.e. scores $0, 1, 2,$ and $3$):\n$$f(0) + f(1) + f(2) + f(3) = 3 + 4 + 5 + 4 = 16$$\n\nTherefore, option B is correct.",
      "topic": "Statistics and Frequency Interpretation"
    },
    {
      "questionNumber": 18,
      "id": "BECE_2016_P1_Q18",
      "questionText": "A fair six-sided die is tossed once. What is the probability of obtaining an even number?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{1}{6}$",
        "B. $\\frac{1}{3}$",
        "C. $\\frac{1}{2}$",
        "D. $\\frac{2}{3}$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Sample space } S = \\{1, 2, 3, 4, 5, 6\\} \\implies n(S) = 6$$\n$$\\text{Even numbers } E = \\{2, 4, 6\\} \\implies n(E) = 3$$\n$$P(E) = \\frac{n(E)}{n(S)} = \\frac{3}{6} = \\frac{1}{2}$$\n\nTherefore, option C is correct.",
      "topic": "Probability"
    },
    {
      "questionNumber": 19,
      "id": "BECE_2016_P1_Q19",
      "questionText": "Make $P$ the subject of the algebraic formula: $V = \\frac{P + 2Q}{3}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $P = 3V - 2Q$",
        "B. $P = 3V + 2Q$",
        "C. $P = 2Q - 3V$",
        "D. $P = \\frac{3V}{2Q}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "$$V = \\frac{P + 2Q}{3}$$\nMultiply both sides by $3$:\n$$3V = P + 2Q$$\nSubtract $2Q$ from both sides:\n$$P = 3V - 2Q$$\n\nTherefore, option A is correct.",
      "topic": "Change of Subject"
    },
    {
      "questionNumber": 20,
      "id": "BECE_2016_P1_Q20",
      "questionText": "Given that $y = 2x^2 - 3$, find the positive value of $x$ when $y = 29$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $3$",
        "B. $4$",
        "C. $5$",
        "D. $8$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Substitute $y = 29$:\n$$29 = 2x^2 - 3$$\n$$2x^2 = 29 + 3 = 32$$\n$$x^2 = \\frac{32}{2} = 16$$\n$$x = \\sqrt{16} = 4$$\n\nTherefore, option B is correct.",
      "topic": "Quadratic Relations"
    },
    {
      "questionNumber": 21,
      "id": "BECE_2016_P1_Q21",
      "questionText": "Expand and simplify: $5(2x + 3) - 4(x + 2)$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $6x + 7$",
        "B. $6x + 23$",
        "C. $14x + 7$",
        "D. $6x - 7$"
      ],
      "correctAnswer": "A",
      "workedSolution": "$$5(2x + 3) - 4(x + 2) = 10x + 15 - 4x - 8$$\n$$= (10x - 4x) + (15 - 8) = 6x + 7$$\n\nTherefore, option A is correct.",
      "topic": "Algebraic Simplification"
    },
    {
      "questionNumber": 22,
      "id": "BECE_2016_P1_Q22",
      "questionText": "When a certain number is multiplied by $3$ and then decreased by $8$, the result is $25$. Find the number.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $9$",
        "B. $11$",
        "C. $13$",
        "D. $15$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Let the unknown number be $n$:\n$$3n - 8 = 25$$\n$$3n = 25 + 8$$\n$$3n = 33 \\implies n = 11$$\n\nTherefore, option B is correct.",
      "topic": "Algebraic Word Problems"
    },
    {
      "questionNumber": 23,
      "id": "BECE_2016_P1_Q23",
      "questionText": "Solve the linear inequality: $3x + 8 \\ge \\frac{5}{2}x - 2$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $x \\le -20$",
        "B. $x \\ge -20$",
        "C. $x \\le 10$",
        "D. $x \\ge 10$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Multiply through by $2$ to clear the fraction:\n$$2(3x + 8) \\ge 5x - 4$$\n$$6x + 16 \\ge 5x - 4$$\n$$6x - 5x \\ge -4 - 16$$\n$$x \\ge -20$$\n\nTherefore, option B is correct.",
      "topic": "Linear Inequalities"
    },
    {
      "questionNumber": 24,
      "id": "BECE_2016_P1_Q24",
      "questionText": "Find the image of $6$ under the linear mapping $x \\to 5x - 8$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $18$",
        "B. $22$",
        "C. $26$",
        "D. $30$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Substitute $x = 6$ into the mapping function:\n$$f(x) = 5x - 8$$\n$$f(6) = 5(6) - 8 = 30 - 8 = 22$$\n\nTherefore, option B is correct.",
      "topic": "Relations and Functions"
    },
    {
      "questionNumber": 25,
      "id": "BECE_2016_P1_Q25",
      "questionText": "What geometric term is used to describe an angle which is greater than $180^\\circ$ but less than $360^\\circ$?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. Right angle",
        "B. Obtuse angle",
        "C. Reflex angle",
        "D. Acute angle"
      ],
      "correctAnswer": "C",
      "workedSolution": "- Acute angle: $0^\\circ < \\theta < 90^\\circ$\n- Right angle: $\\theta = 90^\\circ$\n- Obtuse angle: $90^\\circ < \\theta < 180^\\circ$\n- Straight angle: $\\theta = 180^\\circ$\n- Reflex angle: $180^\\circ < \\theta < 360^\\circ$\n\nTherefore, option C is correct.",
      "topic": "Angles and Lines"
    },
    {
      "questionNumber": 26,
      "id": "BECE_2016_P1_Q26",
      "questionText": "How many lines of symmetry does a non-square rectangle possess?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $1$",
        "B. $2$",
        "C. $4$",
        "D. $8$"
      ],
      "correctAnswer": "B",
      "workedSolution": "A rectangle has $2$ axes of symmetry, joining the midpoints of opposite sides. It does not have diagonal lines of symmetry unless it is a square.\n\nTherefore, option B is correct.",
      "topic": "Symmetry"
    },
    {
      "questionNumber": 27,
      "id": "BECE_2016_P1_Q27",
      "questionText": "The perimeter of an isosceles triangle is $52\\text{ cm}$. If the two equal sides each measure $18\\text{ cm}$, find the length of the third side.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $14\\text{ cm}$",
        "B. $16\\text{ cm}$",
        "C. $18\\text{ cm}$",
        "D. $24\\text{ cm}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Perimeter} = a + b + c$$\n$$52 = 18 + 18 + c$$\n$$52 = 36 + c$$\n$$c = 52 - 36 = 16\\text{ cm}$$\n\nTherefore, option B is correct.",
      "topic": "Mensuration: Triangles"
    },
    {
      "questionNumber": 28,
      "id": "BECE_2016_P1_Q28",
      "questionText": "Find the area of a circle whose diameter is $14\\text{ cm}$. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $44\\text{ cm}^2$",
        "B. $88\\text{ cm}^2$",
        "C. $154\\text{ cm}^2$",
        "D. $616\\text{ cm}^2$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Radius } r = \\frac{14}{2} = 7\\text{ cm}$$\n$$\\text{Area} = \\pi r^2 = \\frac{22}{7} \\times 7 \\times 7 = 22 \\times 7 = 154\\text{ cm}^2$$\n\nTherefore, option C is correct.",
      "topic": "Mensuration: Circles"
    },
    {
      "questionNumber": 29,
      "id": "BECE_2016_P1_Q29",
      "questionText": "The mean of four numbers is $15$. If three of the numbers are $12, 18,$ and $14$, find the fourth number.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $14$",
        "B. $15$",
        "C. $16$",
        "D. $20$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Sum of all 4 numbers} = 4 \\times 15 = 60$$\n$$\\text{Sum of 3 known numbers} = 12 + 18 + 14 = 44$$\n$$\\text{Fourth number} = 60 - 44 = 16$$\n\nTherefore, option C is correct.",
      "topic": "Statistics: Mean"
    },
    {
      "questionNumber": 30,
      "id": "BECE_2016_P1_Q30",
      "questionText": "The sum of the interior angles of a regular convex polygon is $720^\\circ$. How many sides has the polygon?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $5$",
        "B. $6$",
        "C. $7$",
        "D. $8$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Sum of interior angles of an $n$-sided polygon is given by $(n - 2) \\times 180^\\circ$:\n$$(n - 2) \\times 180^\\circ = 720^\\circ$$\n$$n - 2 = \\frac{720}{180} = 4$$\n$$n = 4 + 2 = 6$$\nThe polygon is a hexagon.\n\nTherefore, option B is correct.",
      "topic": "Polygons and Interior Angles"
    },
    {
      "questionNumber": 31,
      "id": "BECE_2016_P1_Q31",
      "questionText": "In the diagram below, triangle $QPR$ is equilateral. Side $QR$ is extended in a straight line to point $S$. If $\\angle PRS = (3x - 15)^\\circ$, calculate the value of $x$.",
      "hasDiagram": true,
      "svgDiagram": "<svg width=\"360\" height=\"200\" viewBox=\"0 0 360 200\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><polygon points=\"120,40 50,160 190,160\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"190\" y1=\"160\" x2=\"300\" y2=\"160\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"80\" y1=\"95\" x2=\"90\" y2=\"105\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"150\" y1=\"105\" x2=\"160\" y2=\"95\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"115\" y1=\"155\" x2=\"125\" y2=\"165\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 190 160 A 30 30 0 0 0 215 135\" fill=\"none\" stroke=\"#dc2626\" stroke-width=\"2\"/><text x=\"115\" y=\"30\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"35\" y=\"165\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Q</text><text x=\"185\" y=\"185\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">R</text><text x=\"305\" y=\"165\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">S</text><text x=\"205\" y=\"135\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#dc2626\">(3x - 15)°</text></svg>",
      "options": [
        "A. $35$",
        "B. $40$",
        "C. $45$",
        "D. $50$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Since triangle $QPR$ is equilateral, all its interior angles equal $60^\\circ$:\n$$\\angle PRQ = 60^\\circ$$\nAngles $\\angle PRQ$ and $\\angle PRS$ lie on a straight line and sum to $180^\\circ$:\n$$\\angle PRQ + \\angle PRS = 180^\\circ$$\n$$60 + (3x - 15) = 180$$\n$$3x + 45 = 180$$\n$$3x = 180 - 45 = 135$$\n$$x = \\frac{135}{3} = 45$$\n\nTherefore, option C is correct.",
      "topic": "Plane Geometry: Angles in Triangles"
    },
    {
      "questionNumber": 32,
      "id": "BECE_2016_P1_Q32",
      "questionText": "The diagonal of a rectangle is $15\\text{ cm}$ long. If the length of the rectangle is $12\\text{ cm}$, find its breadth.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $6\\text{ cm}$",
        "B. $8\\text{ cm}$",
        "C. $9\\text{ cm}$",
        "D. $11\\text{ cm}$"
      ],
      "correctAnswer": "C",
      "workedSolution": "By the Pythagorean theorem:\n$$\\text{diagonal}^2 = \\text{length}^2 + \\text{breadth}^2$$\n$$15^2 = 12^2 + b^2$$\n$$225 = 144 + b^2$$\n$$b^2 = 225 - 144 = 81$$\n$$b = \\sqrt{81} = 9\\text{ cm}$$\n\nTherefore, option C is correct.",
      "topic": "Pythagoras' Theorem"
    },
    {
      "questionNumber": 33,
      "id": "BECE_2016_P1_Q33",
      "questionText": "In a geometric enlargement, the line segment $AB$ is mapped onto $A'B'$. If $|AB| = 36\\text{ cm}$ and $|A'B'| = 12\\text{ cm}$, calculate the linear scale factor of the enlargement.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{1}{4}$",
        "B. $\\frac{1}{3}$",
        "C. $3$",
        "D. $4$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Scale factor } k = \\frac{\\text{Image length}}{\\text{Object length}} = \\frac{|A'B'|}{|AB|} = \\frac{12}{36} = \\frac{1}{3}$$\n\nTherefore, option B is correct.",
      "topic": "Transformational Geometry: Enlargement"
    },
    {
      "questionNumber": 34,
      "id": "BECE_2016_P1_Q34",
      "questionText": "Study the triangular pattern of odd numbers below:\n\n$$\\begin{array}{ccccccc} 17 & & d & & e & & 25 \\\\ & 9 & & 11 & & a & \\\\ & & 3 & & 5 & & \\\\ & & & 1 & & & \\end{array}$$\n\nEvaluate the sum of the fourth row: $17 + d + e + 25$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $64$",
        "B. $74$",
        "C. $84$",
        "D. $94$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Notice the sequence of consecutive odd numbers placed in rows of sizes $1, 2, 3, 4, \\dots$:\n- Row 1 (1 number): $1$\n- Row 2 (2 numbers): $3, 5$\n- Row 3 (3 numbers): $9, 11, a \\implies a = 13$\n- Row 4 contains 4 consecutive odd numbers starting at $17$:\n$$17, 19, 21, 23, 25 \\implies d = 19, e = 21, 23, 25$$\nSum: $17 + 19 + 23 + 25 = 84$.\n\nTherefore, option C is correct.",
      "topic": "Number Patterns"
    },
    {
      "questionNumber": 35,
      "id": "BECE_2016_P1_Q35",
      "questionText": "Using the triangular pattern in Question 34, evaluate $a + d + e$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $45$",
        "B. $53$",
        "C. $55$",
        "D. $60$"
      ],
      "correctAnswer": "B",
      "workedSolution": "From Question 34:\n- $a = 13$ (completing row $9, 11, 13$)\n- $d = 19$\n- $e = 21$\n\nSum:\n$$a + d + e = 13 + 19 + 21 = 53$$\n\nTherefore, option B is correct.",
      "topic": "Number Patterns"
    },
    {
      "questionNumber": 36,
      "id": "BECE_2016_P1_Q36",
      "questionText": "Simplify the vector addition: $\\begin{pmatrix} -4 \\\\ 7 \\end{pmatrix} + \\begin{pmatrix} 3 \\\\ -9 \\end{pmatrix}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\begin{pmatrix} -1 \\\\ -2 \\end{pmatrix}$",
        "B. $\\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix}$",
        "C. $\\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix}$",
        "D. $\\begin{pmatrix} -7 \\\\ 16 \\end{pmatrix}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "$$\\begin{pmatrix} -4 \\\\ 7 \\end{pmatrix} + \\begin{pmatrix} 3 \\\\ -9 \\end{pmatrix} = \\begin{pmatrix} -4 + 3 \\\\ 7 + (-9) \\end{pmatrix} = \\begin{pmatrix} -1 \\\\ -2 \\end{pmatrix}$$\n\nTherefore, option A is correct.",
      "topic": "Vectors"
    },
    {
      "questionNumber": 37,
      "id": "BECE_2016_P1_Q37",
      "questionText": "The bearing of point $A$ from point $B$ is $215^\\circ$. What is the bearing of point $B$ from point $A$?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $035^\\circ$",
        "B. $055^\\circ$",
        "C. $125^\\circ$",
        "D. $305^\\circ$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Since the forward bearing $\\theta = 215^\\circ > 180^\\circ$, subtract $180^\\circ$ to find the back bearing:\n$$\\text{Back bearing} = 215^\\circ - 180^\\circ = 035^\\circ$$\n\nTherefore, option A is correct.",
      "topic": "Bearings"
    },
    {
      "questionNumber": 38,
      "id": "BECE_2016_P1_Q38",
      "questionText": "If $x = -3$ and $y = 4$, evaluate $\\frac{2x + 3y}{xy}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $-\\frac{1}{2}$",
        "B. $\\frac{1}{2}$",
        "C. $-\\frac{3}{2}$",
        "D. $\\frac{3}{2}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "$$\\text{Numerator} = 2(-3) + 3(4) = -6 + 12 = 6$$\n$$\\text{Denominator} = (-3)(4) = -12$$\n$$\\text{Value} = \\frac{6}{-12} = -\\frac{1}{2}$$\n\nTherefore, option A is correct.",
      "topic": "Algebraic Substitution"
    },
    {
      "questionNumber": 39,
      "id": "BECE_2016_P1_Q39",
      "questionText": "The point $K(-4, 9)$ is reflected in the $x$-axis. Find its image $K'$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $(-4, -9)$",
        "B. $(4, 9)$",
        "C. $(4, -9)$",
        "D. $(9, -4)$"
      ],
      "correctAnswer": "A",
      "workedSolution": "The transformation mapping for a reflection in the $x$-axis is:\n$$(x, y) \\to (x, -y)$$\nApplying to $K(-4, 9)$:\n$$K'(-4, -9)$$\n\nTherefore, option A is correct.",
      "topic": "Transformational Geometry: Reflection"
    },
    {
      "questionNumber": 40,
      "id": "BECE_2016_P1_Q40",
      "questionText": "Which geometric mathematical instrument is specifically designed to measure or draw angles on a plane sheet of paper?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. Pair of compasses",
        "B. Set-square",
        "C. Pair of dividers",
        "D. Protractor"
      ],
      "correctAnswer": "D",
      "workedSolution": "A protractor is a semicircular or circular drafting instrument marked in degrees, used specifically for measuring and constructing angles.\n\nTherefore, option D is correct.",
      "topic": "Geometrical Instruments"
    }
  ]
};

export const SET_BECE_2016_MATH_P1: CurriculumQuestionSet = {
  id: "jhs-math-2016-paper1",
  title: "BECE 2016 Mathematics Paper 1 (Objective Test)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2016 Paper 1",
  variantType: "past_paper_variant",
  totalQuestions: 40,
  version: 1,
  format: 'multiple_choice',
  paperType: 1,
  year: 2016,
  era: 'legacy',
  timeAllowed: "1 hour",
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2016/paper_1",
  questions: BECE_2016_MATH_P1_DATA.questions.map((q) => {
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

export const SET_BECE_2016_MATH_P1_ALIAS: CurriculumQuestionSet = {
  ...SET_BECE_2016_MATH_P1,
  id: "bece_2016_math_p1"
};

export const BECE_2016_MATH_P2_DATA = {
  "examMetadata": {
    "examYear": 2016,
    "examination": "BECE (Basic Education Certificate Examination)",
    "subject": "Mathematics",
    "paper": "Paper 2 (Theory / Essay)",
    "totalQuestions": 6,
    "instructions": "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
    "timeAllowed": "1 hour",
    "curriculumAlignment": "NaCCA JHS Common Core Programme / WAEC Standards",
    "firestoreCollectionPath": "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2016/paper_2"
  },
  "questions": [
    {
      "questionNumber": 1,
      "id": "BECE_2016_P2_Q01",
      "marks": 15,
      "topic": "Sets, Venn Diagrams, and Equal Vectors",
      "subQuestions": [
        {
          "part": "a",
          "marks": 4,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "In an examination, $60$ candidates sat for either Mathematics or English Language. $70\\%$ passed in Mathematics and $45\\%$ passed in English Language. If each candidate passed in at least one of the subjects, how many candidates passed in:\n(i) Mathematics?\n(ii) English Language?",
          "workedSolution": "**(i) Number of candidates who passed in Mathematics:**\n$$\\text{Total candidates } n(U) = 60$$\n$$\\text{Percentage passing Mathematics} = 70\\%$$\n$$n(M) = \\frac{70}{100} \\times 60 = 7 \\times 6 = 42$$\n\nTherefore, **$42$ candidates passed in Mathematics**.\n\n---\n\n**(ii) Number of candidates who passed in English Language:**\n$$\\text{Percentage passing English Language} = 45\\%$$\n$$n(E) = \\frac{45}{100} \\times 60 = \\frac{9}{20} \\times 60 = 9 \\times 3 = 27$$\n\nTherefore, **$27$ candidates passed in English Language**."
        },
        {
          "part": "b",
          "marks": 3,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"360\" height=\"220\" viewBox=\"0 0 360 220\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect x=\"10\" y=\"10\" width=\"340\" height=\"200\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"32\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 60</text><circle cx=\"135\" cy=\"115\" r=\"70\" fill=\"#38bdf8\" fill-opacity=\"0.2\" stroke=\"#0284c7\" stroke-width=\"2\"/><circle cx=\"225\" cy=\"115\" r=\"70\" fill=\"#a855f7\" fill-opacity=\"0.2\" stroke=\"#7e22ce\" stroke-width=\"2\"/><text x=\"105\" y=\"60\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#0369a1\">M (42)</text><text x=\"225\" y=\"60\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#6b21a8\">E (27)</text><text x=\"100\" y=\"120\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">33</text><text x=\"175\" y=\"120\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#dc2626\">9</text><text x=\"245\" y=\"120\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">18</text><text x=\"295\" y=\"190\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">0</text></svg>",
          "questionText": "Illustrate the information given in (a) on a Venn diagram.",
          "workedSolution": "**Venn Diagram Specification:**\n- Universal Set $U$ contains $60$ candidates.\n- Mathematics set $M$ contains $42$ candidates.\n- English Language set $E$ contains $27$ candidates.\n- Intersection region $M \\cap E = 9$ candidates.\n- Mathematics only region $= 42 - 9 = 33$ candidates.\n- English Language only region $= 27 - 9 = 18$ candidates.\n- Outside region: Since each candidate passed in at least one subject, $n(M \\cup E)' = 0$.\n\n*(See the embedded SVG above for the complete, labeled illustration)*."
        },
        {
          "part": "c",
          "marks": 4,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Using the Venn diagram, find the number of candidates who passed in:\n(i) both subjects;\n(ii) Mathematics only.",
          "workedSolution": "**(i) Number of candidates who passed in both subjects:**\nLet $n(M \\cap E) = x$.\nSince every student passed at least one subject:\n$$n(M \\cup E) = n(M) + n(E) - n(M \\cap E) = n(U)$$\n$$42 + 27 - x = 60$$\n$$69 - x = 60$$\n$$x = 69 - 60 = 9$$\n\nTherefore, **$9$ candidates passed in both subjects**.\n\n---\n\n**(ii) Number of candidates who passed in Mathematics only:**\n$$n(M \\cap E') = n(M) - x = 42 - 9 = 33$$\n\nTherefore, **$33$ candidates passed in Mathematics only**."
        },
        {
          "part": "d",
          "marks": 4,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "If $\\mathbf{a} = \\begin{pmatrix} 6 \\\\ -8 \\end{pmatrix}$ and $\\mathbf{b} = \\begin{pmatrix} 3x \\\\ 2 + y \\end{pmatrix}$ are equal vectors, find the values of $x$ and $y$.",
          "workedSolution": "Since vector $\\mathbf{a}$ equals vector $\\mathbf{b}$, their corresponding horizontal and vertical components are identical:\n$$\\begin{pmatrix} 6 \\\\ -8 \\end{pmatrix} = \\begin{pmatrix} 3x \\\\ 2 + y \\end{pmatrix}$$\n\n**Equating horizontal components:**\n$$3x = 6$$\n$$x = \\frac{6}{3} = 2$$\n\n**Equating vertical components:**\n$$2 + y = -8$$\n$$y = -8 - 2 = -10$$\n\nTherefore, **$x = 2$ and $y = -10$**."
        }
      ]
    },
    {
      "questionNumber": 2,
      "id": "BECE_2016_P2_Q02",
      "marks": 15,
      "topic": "Linear Cost Relations and Percentage Excess Weight",
      "subQuestions": [
        {
          "part": "a",
          "marks": 8,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "The cost ($P$), in Ghana cedis, of manufacturing $n$ branded school bags is modeled by the linear relation:\n$$P = \\frac{4}{5}n + 2,400$$\nFind the:\n(i) cost of manufacturing $3,500$ school bags;\n(ii) number of school bags that can be produced with $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,800.00$;\n(iii) fixed cost when no bags are produced.",
          "workedSolution": "**(i) Cost of manufacturing $3,500$ school bags ($n = 3,500$):**\n$$P = \\frac{4}{5}(3,500) + 2,400$$\n$$P = 4(700) + 2,400 = 2,800 + 2,400 = 5,200$$\n\nTherefore, the cost is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 5,200.00$**.\n\n---\n\n**(ii) Number of bags produced with $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 4,800.00$ ($P = 4,800$):**\n$$4,800 = \\frac{4}{5}n + 2,400$$\n$$\\frac{4}{5}n = 4,800 - 2,400 = 2,400$$\n$$4n = 2,400 \\times 5 = 12,000$$\n$$n = \\frac{12,000}{4} = 3,000$$\n\nTherefore, **$3,000$ school bags** will be produced.\n\n---\n\n**(iii) Cost when no items are produced ($n = 0$):**\n$$P = \\frac{4}{5}(0) + 2,400 = 0 + 2,400 = 2,400$$\n\nTherefore, the fixed setup cost is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 2,400.00$**."
        },
        {
          "part": "b",
          "marks": 7,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "An airline passenger is allowed a maximum baggage allowance of $23\\text{ kg}$. A traveler checks in four bags weighing $5.5\\text{ kg}, 14.0\\text{ kg}, 4.2\\text{ kg},$ and $3.9\\text{ kg}$.\n(i) Find the excess weight of his luggage.\n(ii) Express the excess weight as a percentage of the maximum allowed weight.",
          "workedSolution": "**(i) Finding the excess weight:**\n$$\\text{Total luggage weight} = 5.5 + 14.0 + 4.2 + 3.9 = 27.6\\text{ kg}$$\n$$\\text{Maximum allowance} = 23.0\\text{ kg}$$\n$$\\text{Excess weight} = 27.6 - 23.0 = 4.6\\text{ kg}$$\n\nTherefore, the excess weight is **$4.6\\text{ kg}$**.\n\n---\n\n**(ii) Excess weight as a percentage of the allowance:**\n$$\\text{Percentage excess} = \\left(\\frac{\\text{Excess weight}}{\\text{Maximum allowed weight}}\\right) \\times 100\\%$$\n$$= \\left(\\frac{4.6}{23}\\right) \\times 100\\% = 0.20 \\times 100\\% = 20\\%$$\n\nTherefore, the excess weight represents **$20\\%$** of the maximum weight permitted."
        }
      ]
    },
    {
      "questionNumber": 3,
      "id": "BECE_2016_P2_Q03",
      "marks": 15,
      "topic": "Work-Rate Arithmetic and Pie Chart Data Analysis",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "A dentist examined $1,800$ patients during a public health outreach. If he worked for $6\\text{ hours}$ a day and spent an average of $12\\text{ minutes}$ consulting each patient, how many days did the dentist spend attending to all the patients?",
          "workedSolution": "**Step 1: Calculate total consultation time required:**\n$$\\text{Total time} = 1,800 \\times 12\\text{ minutes} = 21,600\\text{ minutes}$$\n\n**Step 2: Convert total time to hours:**\n$$\\text{Total hours} = \\frac{21,600}{60} = 360\\text{ hours}$$\n\n**Step 3: Calculate the number of working days:**\n$$\\text{Daily working hours} = 6\\text{ hours/day}$$\n$$\\text{Days taken} = \\frac{360}{6} = 60\\text{ days}$$\n\nTherefore, the dentist spent **$60\\text{ days}$** to attend to all the patients."
        },
        {
          "part": "b",
          "marks": 10,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"320\" height=\"320\" viewBox=\"0 0 320 320\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><circle cx=\"160\" cy=\"160\" r=\"130\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 160 160 L 160 30 A 130 130 0 0 1 259.6 76.5 Z\" fill=\"#38bdf8\" fill-opacity=\"0.3\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><path d=\"M 160 160 L 259.6 76.5 A 130 130 0 0 1 289.9 164.5 Z\" fill=\"#f59e0b\" fill-opacity=\"0.3\" stroke=\"#d97706\" stroke-width=\"1.5\"/><path d=\"M 160 160 L 289.9 164.5 A 130 130 0 0 1 224.9 272.6 Z\" fill=\"#10b981\" fill-opacity=\"0.3\" stroke=\"#059669\" stroke-width=\"1.5\"/><path d=\"M 160 160 L 224.9 272.6 A 130 130 0 0 1 104.9 277.6 Z\" fill=\"#8b5cf6\" fill-opacity=\"0.3\" stroke=\"#7c3aed\" stroke-width=\"1.5\"/><path d=\"M 160 160 L 104.9 277.6 A 130 130 0 0 1 31.7 139.7 Z\" fill=\"#ec4899\" fill-opacity=\"0.3\" stroke=\"#db2777\" stroke-width=\"1.5\"/><path d=\"M 160 160 L 31.7 139.7 A 130 130 0 0 1 160 30 Z\" fill=\"#eab308\" fill-opacity=\"0.3\" stroke=\"#ca8a04\" stroke-width=\"1.5\"/><text x=\"190\" y=\"70\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">B (50°)</text><text x=\"245\" y=\"135\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">C (40°)</text><text x=\"215\" y=\"225\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">D (80°)</text><text x=\"145\" y=\"270\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">E (60°)</text><text x=\"60\" y=\"210\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">F (70°)</text><text x=\"75\" y=\"95\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">A (60°)</text><text x=\"80\" y=\"310\" font-family=\"sans-serif\" font-size=\"11\" font-style=\"italic\" fill=\"#64748b\">NOT DRAWN TO SCALE</text></svg>",
          "questionText": "The pie chart shows the distribution of library books to six classes $A, B, C, D, E,$ and $F$ in a school. The sector angles are: $\\angle A = 60^\\circ, \\angle B = 50^\\circ, \\angle D = 80^\\circ, \\angle E = 60^\\circ, \\angle F = 70^\\circ,$ and the sector angle for class $C$ completes the circle.\n(i) If class $D$ was given $640$ textbooks, how many textbooks were distributed to each of the remaining classes?\n(ii) What was the average (mean) number of textbooks distributed per class?\n(iii) How many classes received less than the average number of textbooks?",
          "workedSolution": "**(i) Finding the books given to each remaining class:**\nFirst, determine the sector angle for Class $C$:\n$$\\angle C = 360^\\circ - (60^\\circ + 50^\\circ + 80^\\circ + 60^\\circ + 70^\\circ) = 360^\\circ - 320^\\circ = 40^\\circ$$\n\nSince Class $D$ ($80^\\circ$) received $640$ books:\n$$\\text{Books per degree} = \\frac{640}{80^\\circ} = 8\\text{ books per degree}$$\n\nNow calculate book counts for all classes:\n- **Class A ($60^\\circ$):** $60 \\times 8 = 480\\text{ books}$\n- **Class B ($50^\\circ$):** $50 \\times 8 = 400\\text{ books}$\n- **Class C ($40^\\circ$):** $40 \\times 8 = 320\\text{ books}$\n- **Class D ($80^\\circ$):** $640\\text{ books}$ (Given)\n- **Class E ($60^\\circ$):** $60 \\times 8 = 480\\text{ books}$\n- **Class F ($70^\\circ$):** $70 \\times 8 = 560\\text{ books}$\n\n---\n\n**(ii) Average number of textbooks distributed per class:**\n$$\\text{Total books} = 360^\\circ \\times 8 = 2,880\\text{ books}$$\n$$\\text{Average per class} = \\frac{2,880}{6} = 480\\text{ books}$$\n\nTherefore, the average number of books distributed is **$480$ textbooks**.\n\n---\n\n**(iii) Classes receiving less than the average ($< 480$ books):**\nComparing each class count against $480$:\n- Class B ($400$ books) $< 480$\n- Class C ($320$ books) $< 480$\n*(Classes A and E received exactly 480; D and F received more)*.\n\nTherefore, exactly **$2$ classes (Classes B and C)** had less than the average number of textbooks distributed."
        }
      ]
    },
    {
      "questionNumber": 4,
      "id": "BECE_2016_P2_Q04",
      "marks": 15,
      "topic": "Graph Transformations: Enlargement, Reflection, and Line Gradient",
      "subQuestions": [
        {
          "part": "a",
          "marks": 11,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"400\" height=\"400\" viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"400\" height=\"400\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"gridP_2016\" width=\"25\" height=\"25\" patternUnits=\"userSpaceOnUse\"><path d=\"M 25 0 L 0 0 0 25\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"400\" fill=\"url(#gridP_2016)\"/><line x1=\"25\" y1=\"200\" x2=\"375\" y2=\"200\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"200\" y1=\"25\" x2=\"200\" y2=\"375\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"380\" y=\"205\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"205\" y=\"20\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><polygon points=\"225,175 225,150 250,150 250,175\" fill=\"#38bdf8\" fill-opacity=\"0.4\" stroke=\"#0284c7\" stroke-width=\"2\"/><text x=\"212\" y=\"190\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\">P(1,1)</text><text x=\"252\" y=\"190\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\">S(2,1)</text><polygon points=\"250,150 250,100 300,100 300,150\" fill=\"#10b981\" fill-opacity=\"0.3\" stroke=\"#059669\" stroke-width=\"2\" stroke-dasharray=\"3\"/><text x=\"240\" y=\"162\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\" fill=\"#059669\">P₁</text><text x=\"305\" y=\"162\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\" fill=\"#059669\">S₁(4,2)</text><polygon points=\"250,250 250,300 300,300 300,250\" fill=\"#f43f5e\" fill-opacity=\"0.3\" stroke=\"#e11d48\" stroke-width=\"2\" stroke-dasharray=\"4\"/><text x=\"240\" y=\"245\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\" fill=\"#e11d48\">P₂</text><text x=\"305\" y=\"245\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\" fill=\"#e11d48\">S₂</text><text x=\"305\" y=\"315\" font-family=\"sans-serif\" font-size=\"9\" font-weight=\"bold\" fill=\"#e11d48\">R₂(4,-4)</text><line x1=\"250\" y1=\"175\" x2=\"300\" y2=\"300\" stroke=\"#7c3aed\" stroke-width=\"2\"/></svg>",
          "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on both axes, draw on a graph sheet two perpendicular axes $Ox$ and $Oy$ for $-5 \\le x \\le 5$ and $-5 \\le y \\le 5$.\n(i) Plot the points $P(1, 1), Q(1, 2), R(2, 2),$ and $S(2, 1)$ and join them to form square $PQRS$.\n(ii) Draw the image $P_1Q_1R_1S_1$ of square $PQRS$ under an enlargement from the origin with a scale factor of $2$.\n(iii) Draw the image $P_2Q_2R_2S_2$ of square $P_1Q_1R_1S_1$ under a reflection in the $x$-axis.",
          "workedSolution": "**(i) Coordinates of original square $PQRS$:**\n- $P(1, 1), Q(1, 2), R(2, 2), S(2, 1)$\n\n---\n\n**(ii) Enlargement by scale factor $k = 2$ from origin $(0, 0)$:**\nMapping rule: $(x, y) \\to (2x, 2y)$\n- $P_1 = (2 \\times 1, 2 \\times 1) = (2, 2)$\n- $Q_1 = (2 \\times 1, 2 \\times 2) = (2, 4)$\n- $R_1 = (2 \\times 2, 2 \\times 2) = (4, 4)$\n- $S_1 = (2 \\times 2, 2 \\times 1) = (4, 2)$\n\n---\n\n**(iii) Reflection of $P_1Q_1R_1S_1$ in the $x$-axis:**\nMapping rule: $(x, y) \\to (x, -y)$\n- $P_2 = (2, -2)$\n- $Q_2 = (2, -4)$\n- $R_2 = (4, -4)$\n- $S_2 = (4, -2)$\n\n*(See the embedded SVG coordinate plot above for the exact geometric rendering)*."
        },
        {
          "part": "b",
          "marks": 4,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Using the coordinates from the graph, find the gradient (slope) of the line passing through points $R_2$ and $S$.",
          "workedSolution": "Coordinates to use:\n- $R_2 = (4, -4)$\n- $S = (2, 1)$\n\nApply the gradient formula:\n$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$\n$$m = \\frac{1 - (-4)}{2 - 4} = \\frac{1 + 4}{-2} = \\frac{5}{-2} = -\\frac{5}{2} = -2.5$$\n\nTherefore, the gradient of line $R_2S$ is **$-\\frac{5}{2}$ (or $-2.5$)**."
        }
      ]
    },
    {
      "questionNumber": 5,
      "id": "BECE_2016_P2_Q05",
      "marks": 15,
      "topic": "Kinematic Formula Substitution, Commercial Discount, and Probability",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Given that initial velocity $u = 6$, time $t = 4$, acceleration $a = 8,$ and displacement is defined by the formula:\n$$s = ut + \\frac{1}{2}at^2$$\nFind the value of $s$.",
          "workedSolution": "Substitute the given numerical quantities directly into the equation:\n$$s = (6)(4) + \\frac{1}{2}(8)(4^2)$$\n$$s = 24 + 4(16)$$\n$$s = 24 + 64 = 88$$\n\nTherefore, the value of $s$ is **$88$**."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "The marked price of a television set is $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 850.00$. If a customer is granted a trade discount of $15\\%$, calculate the:\n(i) discount allowed;\n(ii) amount actually paid by the customer.",
          "workedSolution": "**(i) Discount allowed:**\n$$\\text{Discount} = \\frac{15}{100} \\times 850.00 = 15 \\times 8.50 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 127.50$$\n\nTherefore, the discount allowed is **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 127.50$**.\n\n---\n\n**(ii) Amount paid by customer:**\n$$\\text{Amount paid} = \\text{Marked price} - \\text{Discount}$$\n$$= 850.00 - 127.50 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 722.50$$\n*(Alternatively: $85\\% \\times 850.00 = 0.85 \\times 850 = 722.50$)*.\n\nTherefore, the customer paid **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 722.50$**."
        },
        {
          "part": "c",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "A cooler contains $12\\text{ cans}$ of apple juice and $18\\text{ cans}$ of mango juice. If a student reaches in and selects a can at random, find the probability that it is:\n(i) mango juice;\n(ii) not mango juice.",
          "workedSolution": "**(i) Probability of picking mango juice:**\n$$\\text{Total cans } n(S) = 12 + 18 = 30$$\n$$\\text{Mango cans } n(M) = 18$$\n$$P(M) = \\frac{18}{30} = \\frac{3}{5} = 0.6$$\n\nTherefore, the probability is **$\\frac{3}{5}$**.\n\n---\n\n**(ii) Probability of not picking mango juice:**\n$$P(M') = 1 - P(M) = 1 - \\frac{3}{5} = \\frac{2}{5} = 0.4$$\n*(Alternatively: $\\frac{12}{30} = \\frac{2}{5}$)*.\n\nTherefore, the probability is **$\\frac{2}{5}$**."
        }
      ]
    },
    {
      "questionNumber": 6,
      "id": "BECE_2016_P2_Q06",
      "marks": 15,
      "topic": "Geometric Compass Construction: Perpendicular Bisectors and Inscribed Locus",
      "subQuestions": [
        {
          "part": "a",
          "marks": 10,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"420\" height=\"340\" viewBox=\"0 0 420 340\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"420\" height=\"340\" fill=\"#ffffff\"/><polygon points=\"70,240 330,240 180,80\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"200\" y1=\"40\" x2=\"200\" y2=\"300\" stroke=\"#0284c7\" stroke-dasharray=\"4\" stroke-width=\"1.5\"/><line x1=\"60\" y1=\"100\" x2=\"220\" y2=\"220\" stroke=\"#dc2626\" stroke-dasharray=\"4\" stroke-width=\"1.5\"/><circle cx=\"200\" cy=\"180\" r=\"65\" fill=\"none\" stroke=\"#7c3aed\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><circle cx=\"200\" cy=\"180\" r=\"4\" fill=\"#7c3aed\"/><text x=\"208\" y=\"178\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#7c3aed\">T</text><text x=\"50\" y=\"255\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">X</text><text x=\"340\" y=\"255\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Y</text><text x=\"175\" y=\"70\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">Z</text><text x=\"190\" y=\"260\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">10 cm</text><text x=\"265\" y=\"150\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">12 cm</text><text x=\"105\" y=\"150\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">8 cm</text></svg>",
          "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct triangle $XYZ$ such that base $|XY| = 10.0\\text{ cm}, |YZ| = 12.0\\text{ cm},$ and $|XZ| = 8.0\\text{ cm}$;\n(ii) Construct the perpendicular bisector of line $XY$;\n(iii) Construct the perpendicular bisector of line $XZ$;\n(iv) Label the point of intersection of the two perpendicular bisectors as $T$;\n(v) With point $T$ as centre, draw a circle of radius $5.5\\text{ cm}$.",
          "workedSolution": "**Detailed Compass Construction Guide:**\n1. **Base Line $|XY| = 10.0\\text{ cm}$:**\n   - Draw a horizontal line segment with a sharp pencil and mark point $X$.\n   - Set compasses to $10.0\\text{ cm}$ using a ruler, place the needle at $X$, and strike an arc to locate $Y$.\n2. **Locating Vertex $Z$:**\n   - Open compasses to $8.0\\text{ cm}$, place the needle at $X$, and draw an arc above line $XY$.\n   - Open compasses to $12.0\\text{ cm}$, place the needle at $Y$, and draw a second arc intersecting the first at point $Z$.\n   - Connect $XZ$ and $YZ$ with straight lines to form triangle $XYZ$.\n3. **Perpendicular Bisector of $XY$:**\n   - Place the compass needle at $X$ with radius $> 5.0\\text{ cm}$, and strike arcs above and below line $XY$.\n   - Repeat with needle at $Y$ to intersect both arcs.\n   - Draw a continuous straight line through the intersections.\n4. **Perpendicular Bisector of $XZ$:**\n   - With needle at $X$ and $Z$ respectively, strike intersecting arcs across line segment $XZ$.\n   - Draw the straight bisector line through the intersection points.\n5. **Intersection Point $T$ and Circle:**\n   - Label the meeting point of the two bisectors as $T$.\n   - Adjust compass radius to exactly $5.5\\text{ cm}$, place needle at $T$, and draw a complete circle."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "From your construction in (a), measure:\n(i) the length of $|TX|$;\n(ii) the angle $\\angle XYZ$.",
          "workedSolution": "**(i) Measuring length $|TX|$:**\n- Point $T$ is the circumcentre of triangle $XYZ$, equidistant from all three vertices $X, Y,$ and $Z$.\n- By the circumradius formula $R = \\frac{abc}{4\\Delta}$:\n  $$s = \\frac{10 + 12 + 8}{2} = 15\\text{ cm}$$\n  $$\\Delta = \\sqrt{15(15-10)(15-12)(15-8)} = \\sqrt{15 \\times 5 \\times 3 \\times 7} = \\sqrt{1,575} \\approx 39.69\\text{ cm}^2$$\n  $$R = \\frac{10 \\times 12 \\times 8}{4 \\times 39.69} = \\frac{960}{158.75} \\approx 6.05\\text{ cm}$$\n- The measured length on the drawing sheet is:\n$$\\mathbf{|TX| \\approx 6.1\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(ii) Measuring angle $\\angle XYZ$:**\n- By the Law of Cosines on $\\triangle XYZ$:\n$$\\cos(\\angle XYZ) = \\frac{XY^2 + YZ^2 - XZ^2}{2(XY)(YZ)} = \\frac{10^2 + 12^2 - 8^2}{2(10)(12)} = \\frac{100 + 144 - 64}{240} = \\frac{180}{240} = 0.75$$\n$$\\angle XYZ = \\arccos(0.75) \\approx 41.4^\\circ$$\n- The measured angle using a protractor is:\n$$\\mathbf{\\angle XYZ \\approx 41^\\circ \\pm 1^\\circ}$$\n\nTherefore, **$|TX| \\approx 6.1\\text{ cm}$** and **$\\angle XYZ \\approx 41^\\circ$**."
        }
      ]
    }
  ]
};

export const SET_BECE_2016_MATH_P2: CurriculumQuestionSet = {
  id: "jhs-math-2016-paper2",
  title: "BECE 2016 Mathematics Paper 2 (Theory / Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2016 Paper 2",
  variantType: "past_paper_variant",
  totalQuestions: 6,
  version: 1,
  format: 'structured_essay',
  paperType: 2,
  year: 2016,
  era: 'legacy',
  instructions: "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
  timeAllowed: "1 hour",
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2016/paper_2",
  theoryTopicList: [
    { id: "q1", questionNumber: 1, theoryIndex: 1, title: "Sets, Venn Diagrams & Equal Vectors", category: "Sets & Vectors" },
    { id: "q2", questionNumber: 2, theoryIndex: 2, title: "Linear Cost Modeling & Excess Weight", category: "Algebra & Arithmetic" },
    { id: "q3", questionNumber: 3, theoryIndex: 3, title: "Work-Rate Days & Pie Chart Textbooks", category: "Arithmetic & Statistics" },
    { id: "q4", questionNumber: 4, theoryIndex: 4, title: "Enlargement, Reflection & Gradient", category: "Geometry & Graphs" },
    { id: "q5", questionNumber: 5, theoryIndex: 5, title: "Kinematics Formula, Discount & Chance", category: "Algebra & Probability" },
    { id: "q6", questionNumber: 6, theoryIndex: 6, title: "Geometric Construction & Circumcentre", category: "Geometry & Construction" }
  ],
  questions: BECE_2016_MATH_P2_DATA.questions.map((q) => {
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

export const SET_BECE_2016_MATH_P2_ALIAS: CurriculumQuestionSet = {
  ...SET_BECE_2016_MATH_P2,
  id: "bece_2016_math_p2"
};
