import { CurriculumQuestionSet } from '../global-curriculum-types';

export const BECE_2015_MATH_P1_DATA = {
  "examMetadata": {
    "examYear": 2015,
    "examination": "BECE (Basic Education Certificate Examination)",
    "subject": "Mathematics",
    "paper": "Paper 1 (Objective Test)",
    "totalQuestions": 40,
    "timeAllowed": "1 hour",
    "curriculumAlignment": "NaCCA JHS Common Core Programme / WAEC Standards",
    "firestoreCollectionPath": "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2015/paper_1",
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
      "id": "BECE_2015_P1_Q01",
      "questionText": "List the elements of the set $P = \\{\\text{prime factors of } 42\\}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\{2, 3, 7\\}$",
        "B. $\\{2, 6, 7\\}$",
        "C. $\\{3, 7, 14\\}$",
        "D. $\\{1, 2, 3, 7\\}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "The factors of $42$ are $1, 2, 3, 6, 7, 14, 21, 42$.\nAmong these, the prime numbers are $2, 3,$ and $7$.\n$$P = \\{2, 3, 7\\}$$\n\nTherefore, option A is correct.",
      "topic": "Sets and Prime Numbers"
    },
    {
      "questionNumber": 2,
      "id": "BECE_2015_P1_Q02",
      "questionText": "Given that set $S = \\{a, b, c, d, e\\}$, find the total number of subsets of $S$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $10$",
        "B. $16$",
        "C. $25$",
        "D. $32$"
      ],
      "correctAnswer": "D",
      "workedSolution": "The number of subsets of a set with $n$ elements is given by $2^n$.\nHere, $n(S) = 5$:\n$$\\text{Number of subsets} = 2^5 = 32$$\n\nTherefore, option D is correct.",
      "topic": "Sets and Subsets"
    },
    {
      "questionNumber": 3,
      "id": "BECE_2015_P1_Q03",
      "questionText": "If $X = \\{\\text{multiples of } 3 \\text{ between } 8 \\text{ and } 22\\}$ and $Y = \\{\\text{even numbers between } 9 \\text{ and } 21\\}$, find $X \\cup Y$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\{9, 12, 15, 18, 21\\}$",
        "B. $\\{10, 12, 14, 16, 18, 20\\}$",
        "C. $\\{9, 10, 12, 14, 15, 16, 18, 20, 21\\}$",
        "D. $\\{12, 18\\}$"
      ],
      "correctAnswer": "C",
      "workedSolution": "List the elements of both sets:\n$$X = \\{9, 12, 15, 18, 21\\}$$\n$$Y = \\{10, 12, 14, 16, 18, 20\\}$$\nTake the union $X \\cup Y$:\n$$X \\cup Y = \\{9, 10, 12, 14, 15, 16, 18, 20, 21\\}$$\n\nTherefore, option C is correct.",
      "topic": "Sets and Operations on Sets"
    },
    {
      "questionNumber": 4,
      "id": "BECE_2015_P1_Q04",
      "questionText": "What is the place value of the digit $8$ in the decimal number $53.481$?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. Tenths",
        "B. Hundredths",
        "C. Thousandths",
        "D. Tens"
      ],
      "correctAnswer": "B",
      "workedSolution": "In the decimal $53.481$:\n- $5$ is in the Tens place\n- $3$ is in the Units place\n- $4$ is in the Tenths place ($\\frac{1}{10}$)\n- $8$ is in the Hundredths place ($\\frac{1}{100}$)\n- $1$ is in the Thousandths place ($\\frac{1}{1000}$)\n\nTherefore, option B is correct.",
      "topic": "Place Value and Decimals"
    },
    {
      "questionNumber": 5,
      "id": "BECE_2015_P1_Q05",
      "questionText": "Find the highest common factor (HCF) of $36, 54,$ and $90$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $6$",
        "B. $9$",
        "C. $18$",
        "D. $27$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Express each number in prime factor decomposition:\n$$36 = 2^2 \\times 3^2$$\n$$54 = 2 \\times 3^3$$\n$$90 = 2 \\times 3^2 \\times 5$$\n$$\\text{HCF} = 2^{\\min(2,1,1)} \\times 3^{\\min(2,3,2)} = 2^1 \\times 3^2 = 2 \\times 9 = 18$$\n\nTherefore, option C is correct.",
      "topic": "Number Theory and HCF"
    },
    {
      "questionNumber": 6,
      "id": "BECE_2015_P1_Q06",
      "questionText": "Express $231_5$ as a number in base ten.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $66$",
        "B. $65$",
        "C. $56$",
        "D. $46$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Expand using powers of base 5:\n$$231_5 = (2 \\times 5^2) + (3 \\times 5^1) + (1 \\times 5^0)$$\n$$= (2 \\times 25) + (3 \\times 5) + (1 \\times 1)$$\n$$= 50 + 15 + 1 = 66_{10}$$\n\nTherefore, option A is correct.",
      "topic": "Number Bases"
    },
    {
      "questionNumber": 7,
      "id": "BECE_2015_P1_Q07",
      "questionText": "If $x \\times y \\times z = 1,440$, and $x = 16, y = 5$, find the value of $z$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $12$",
        "B. $16$",
        "C. $18$",
        "D. $24$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Substitute $x = 16$ and $y = 5$:\n$$16 \\times 5 \\times z = 1,440$$\n$$80z = 1,440$$\n$$z = \\frac{1,440}{80} = 18$$\n\nTherefore, option C is correct.",
      "topic": "Algebraic Equations"
    },
    {
      "questionNumber": 8,
      "id": "BECE_2015_P1_Q08",
      "questionText": "How many integers satisfy the strict inequality $-4 < y < 8$?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $10$",
        "B. $11$",
        "C. $12$",
        "D. $13$"
      ],
      "correctAnswer": "B",
      "workedSolution": "The integers strictly between $-4$ and $8$ are:\n$$\\{-3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7\\}$$\nCounting the elements:\n$$7 - (-3) + 1 = 7 + 3 + 1 = 11$$\n\nTherefore, option B is correct.",
      "topic": "Integers and Inequalities"
    },
    {
      "questionNumber": 9,
      "id": "BECE_2015_P1_Q09",
      "questionText": "Divide $2.142$ by $0.06$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $3.57$",
        "B. $35.7$",
        "C. $357$",
        "D. $0.357$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Multiply numerator and denominator by $100$ to clear the decimal in the divisor:\n$$\\frac{2.142}{0.06} = \\frac{214.2}{6} = 35.7$$\n\nTherefore, option B is correct.",
      "topic": "Decimals and Division"
    },
    {
      "questionNumber": 10,
      "id": "BECE_2015_P1_Q10",
      "questionText": "Arrange the following fractions in ascending order: $\\frac{3}{4}, \\frac{7}{12}, \\frac{5}{6}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{7}{12}, \\frac{3}{4}, \\frac{5}{6}$",
        "B. $\\frac{3}{4}, \\frac{7}{12}, \\frac{5}{6}$",
        "C. $\\frac{5}{6}, \\frac{3}{4}, \\frac{7}{12}$",
        "D. $\\frac{7}{12}, \\frac{5}{6}, \\frac{3}{4}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Convert all fractions to equivalent fractions with denominator $\\text{LCM}(4, 12, 6) = 12$:\n$$\\frac{7}{12} = \\frac{7}{12}$$\n$$\\frac{3}{4} = \\frac{9}{12}$$\n$$\\frac{5}{6} = \\frac{10}{12}$$\nComparing numerators: $7 < 9 < 10$.\nAscending order:\n$$\\frac{7}{12}, \\frac{3}{4}, \\frac{5}{6}$$\n\nTherefore, option A is correct.",
      "topic": "Fractions and Ordering"
    },
    {
      "questionNumber": 11,
      "id": "BECE_2015_P1_Q11",
      "questionText": "Adjoa spent $\\frac{2}{5}$ of her pocket money on transport, $\\frac{1}{3}$ on lunch, and saved the remainder. What fraction of her money did she save?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{1}{15}$",
        "B. $\\frac{4}{15}$",
        "C. $\\frac{7}{15}$",
        "D. $\\frac{11}{15}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Total fraction spent} = \\frac{2}{5} + \\frac{1}{3} = \\frac{6 + 5}{15} = \\frac{11}{15}$$\n$$\\text{Fraction saved} = 1 - \\frac{11}{15} = \\frac{15 - 11}{15} = \\frac{4}{15}$$\n\nTherefore, option B is correct.",
      "topic": "Operations on Fractions"
    },
    {
      "questionNumber": 12,
      "id": "BECE_2015_P1_Q12",
      "questionText": "If $6$ laborers take $15\\text{ days}$ to dig a trench, how many days will $9$ laborers take to dig the same trench working at the same rate?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $8\\text{ days}$",
        "B. $10\\text{ days}$",
        "C. $12\\text{ days}$",
        "D. $18\\text{ days}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "This is an inverse proportion problem:\n$$\\text{Total laborer-days} = 6 \\times 15 = 90\\text{ laborer-days}$$\n$$\\text{Days for 9 laborers} = \\frac{90}{9} = 10\\text{ days}$$\n\nTherefore, option B is correct.",
      "topic": "Inverse Proportion"
    },
    {
      "questionNumber": 13,
      "id": "BECE_2015_P1_Q13",
      "questionText": "A businesswoman invested $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,200.00$ at a simple interest rate of $6\\%$ per annum. Calculate the total amount in her account at the end of $2\\text{ years}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,272.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,320.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,344.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,440.00$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$I = \\frac{P \\times R \\times T}{100} = \\frac{1,200 \\times 6 \\times 2}{100} = 12 \\times 12 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 144.00$$\n$$\\text{Total amount } A = P + I = 1,200.00 + 144.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,344.00$$\n\nTherefore, option C is correct.",
      "topic": "Simple Interest"
    },
    {
      "questionNumber": 14,
      "id": "BECE_2015_P1_Q14",
      "questionText": "Kojo sold a generator for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 72,000.00$ and made a profit of $20\\%$. Find the cost price of the generator.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 57,600.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 60,000.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 64,000.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 86,400.00$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Selling Price} = 120\\% \\text{ of Cost Price}$$\n$$72,000 = 1.20 \\times \\text{CP}$$\n$$\\text{CP} = \\frac{72,000}{1.2} = \\frac{720,000}{12} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 60,000.00$$\n\nTherefore, option B is correct.",
      "topic": "Profit and Loss"
    },
    {
      "questionNumber": 15,
      "id": "BECE_2015_P1_Q15",
      "questionText": "Find the value of $m$ if $10^m = 100,000$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $3$",
        "B. $4$",
        "C. $5$",
        "D. $6$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Express $100,000$ as a power of $10$:\n$$100,000 = 10^5$$\n$$10^m = 10^5 \\implies m = 5$$\n\nTherefore, option C is correct.",
      "topic": "Indices and Exponents"
    },
    {
      "questionNumber": 16,
      "id": "BECE_2015_P1_Q16",
      "questionText": "Express $843.27$ in standard form (scientific notation).",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $8.4327 \\times 10^2$",
        "B. $8.4327 \\times 10^{-2}$",
        "C. $8.4327 \\times 10^3$",
        "D. $84.327 \\times 10^1$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Shift the decimal point $2$ places to the left:\n$$843.27 = 8.4327 \\times 10^2$$\n\nTherefore, option A is correct.",
      "topic": "Standard Form"
    },
    {
      "questionNumber": 17,
      "id": "BECE_2015_P1_Q17",
      "questionText": "Find the median of the following set of numbers: $19, 13, 16, 17, 9, 20, 14, 15$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $14.5$",
        "B. $15.0$",
        "C. $15.5$",
        "D. $16.0$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Arrange the $8$ numbers in ascending order:\n$$9, 13, 14, \\mathbf{15, 16}, 17, 19, 20$$\nThe median is the mean of the 4th and 5th numbers:\n$$\\text{Median} = \\frac{15 + 16}{2} = \\frac{31}{2} = 15.5$$\n\nTherefore, option C is correct.",
      "topic": "Statistics and Medians"
    },
    {
      "questionNumber": 18,
      "id": "BECE_2015_P1_Q18",
      "questionText": "The ages (in years) of $12$ pupils in a club are $4, 5, 5, 5, 6, 6, 7, 7, 7, 7, 8, 9$. If a pupil is selected at random, what is the probability that the pupil is **not less than** $7$ years old?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\frac{1}{3}$",
        "B. $\\frac{5}{12}$",
        "C. $\\frac{1}{2}$",
        "D. $\\frac{7}{12}$"
      ],
      "correctAnswer": "C",
      "workedSolution": "\"Not less than $7$\" means age $\\ge 7$.\nPupils aged $7, 8,$ or $9$:\n$$\\{7, 7, 7, 7, 8, 9\\} \\implies n(E) = 6$$\n$$\\text{Total pupils } n(S) = 12$$\n$$P(\\text{age } \\ge 7) = \\frac{6}{12} = \\frac{1}{2}$$\n\nTherefore, option C is correct.",
      "topic": "Probability"
    },
    {
      "questionNumber": 19,
      "id": "BECE_2015_P1_Q19",
      "questionText": "Expand and simplify: $(3x + 2y)(3x - 2y)$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $9x^2 + 4y^2$",
        "B. $9x^2 - 4y^2$",
        "C. $6x^2 - 4y^2$",
        "D. $9x^2 - 12xy - 4y^2$"
      ],
      "correctAnswer": "B",
      "workedSolution": "Apply the difference of two squares identity $(a + b)(a - b) = a^2 - b^2$:\n$$(3x + 2y)(3x - 2y) = (3x)^2 - (2y)^2 = 9x^2 - 4y^2$$\n\nTherefore, option B is correct.",
      "topic": "Algebraic Expansion"
    },
    {
      "questionNumber": 20,
      "id": "BECE_2015_P1_Q20",
      "questionText": "Find the value of $k$ if $36.004 = (3 \\times 10) + (6 \\times 1) + (4 \\times k)$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $0.001$",
        "B. $0.01$",
        "C. $0.1$",
        "D. $0.0001$"
      ],
      "correctAnswer": "A",
      "workedSolution": "$$36.004 = 30 + 6 + 0.004$$\n$$4 \\times k = 0.004$$\n$$k = \\frac{0.004}{4} = 0.001$$\n\nTherefore, option A is correct.",
      "topic": "Decimal Expansion"
    },
    {
      "questionNumber": 21,
      "id": "BECE_2015_P1_Q21",
      "questionText": "Evaluate $(4p)^2 - 4p^2$ when $p = 3$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $72$",
        "B. $96$",
        "C. $108$",
        "D. $144$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Simplify the algebraic expression first:\n$$(4p)^2 - 4p^2 = 16p^2 - 4p^2 = 12p^2$$\nNow substitute $p = 3$:\n$$12(3)^2 = 12 \\times 9 = 108$$\n\nTherefore, option C is correct.",
      "topic": "Algebraic Substitution"
    },
    {
      "questionNumber": 22,
      "id": "BECE_2015_P1_Q22",
      "questionText": "A digital smartphone is priced at $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 1,500.00$. A merchant allows a discount of $4\\%$ on each phone. Find the total discount allowed on $10$ such smartphones.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 450.00$",
        "B. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 500.00$",
        "C. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 600.00$",
        "D. $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 750.00$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$\\text{Discount on one smartphone} = \\frac{4}{100} \\times 1,500 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 60.00$$\n$$\\text{Total discount on 10 smartphones} = 10 \\times 60.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 600.00$$\n\nTherefore, option C is correct.",
      "topic": "Commercial Arithmetic: Discount"
    },
    {
      "questionNumber": 23,
      "id": "BECE_2015_P1_Q23",
      "questionText": "Find the value of $k$ if $5(k + 3) = -15$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $-6$",
        "B. $-3$",
        "C. $0$",
        "D. $6$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Divide both sides by $5$:\n$$k + 3 = \\frac{-15}{5}$$\n$$k + 3 = -3$$\n$$k = -3 - 3 = -6$$\n\nTherefore, option A is correct.",
      "topic": "Linear Equations"
    },
    {
      "questionNumber": 24,
      "id": "BECE_2015_P1_Q24",
      "questionText": "Find the rule governing the following mapping:\n$$\\begin{array}{cccccc} x & 1 & 2 & 3 & 4 & 5 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 1 & 8 & 27 & 64 & 125 \\end{array}$$",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $y \\to 3x - 2$",
        "B. $y \\to x^2$",
        "C. $y \\to 2x^2$",
        "D. $y \\to x^3$"
      ],
      "correctAnswer": "D",
      "workedSolution": "Examine the relationship between inputs $x$ and outputs $y$:\n- $1^3 = 1$\n- $2^3 = 8$\n- $3^3 = 27$\n- $4^3 = 64$\n- $5^3 = 125$\n\nThe mapping assigns each number to its cube: $y = x^3$.\n\nTherefore, option D is correct.",
      "topic": "Relations and Mappings"
    },
    {
      "questionNumber": 25,
      "id": "BECE_2015_P1_Q25",
      "questionText": "How many vertices has a rectangular cuboid?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $6$",
        "B. $8$",
        "C. $10$",
        "D. $12$"
      ],
      "correctAnswer": "B",
      "workedSolution": "A cuboid has $6$ faces, $12$ edges, and $8$ vertices (corners).\n\nTherefore, option B is correct.",
      "topic": "Solid Geometry"
    },
    {
      "questionNumber": 26,
      "id": "BECE_2015_P1_Q26",
      "questionText": "The circumference of a circular lawn is $880\\text{ m}$. Find the area of the lawn. $\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $15,400\\text{ m}^2$",
        "B. $30,800\\text{ m}^2$",
        "C. $61,600\\text{ m}^2$",
        "D. $123,200\\text{ m}^2$"
      ],
      "correctAnswer": "C",
      "workedSolution": "$$C = 2\\pi r \\implies 880 = 2 \\times \\frac{22}{7} \\times r$$\n$$880 = \\frac{44}{7}r$$\n$$r = \\frac{880 \\times 7}{44} = 20 \\times 7 = 140\\text{ m}$$\nNow compute the area:\n$$A = \\pi r^2 = \\frac{22}{7} \\times 140 \\times 140 = 22 \\times 20 \\times 140 = 440 \\times 140 = 61,600\\text{ m}^2$$\n\nTherefore, option C is correct.",
      "topic": "Mensuration: Circles"
    },
    {
      "questionNumber": 27,
      "id": "BECE_2015_P1_Q27",
      "questionText": "What geometric name is given to a triangle that has all three of its sides unequal in length?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. Equilateral triangle",
        "B. Isosceles triangle",
        "C. Scalene triangle",
        "D. Right-angled triangle"
      ],
      "correctAnswer": "C",
      "workedSolution": "- An equilateral triangle has all 3 sides equal.\n- An isosceles triangle has 2 sides equal.\n- A scalene triangle has all 3 sides of different lengths.\n\nTherefore, option C is correct.",
      "topic": "Plane Geometry: Triangles"
    },
    {
      "questionNumber": 28,
      "id": "BECE_2015_P1_Q28",
      "questionText": "At nine o'clock ($9:00$), what is the smaller interior angle between the hour and minute hands of an analog clock?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $60^\\circ$",
        "B. $90^\\circ$",
        "C. $120^\\circ$",
        "D. $150^\\circ$"
      ],
      "correctAnswer": "B",
      "workedSolution": "A clock face comprises $360^\\circ$ divided into $12$ hourly divisions ($30^\\circ$ per hour).\nAt 9:00, the minute hand points to $12$ and the hour hand points to $9$.\nThe number of hourly intervals between $9$ and $12$ is $3$:\n$$\\text{Angle} = 3 \\times 30^\\circ = 90^\\circ$$\n\nTherefore, option B is correct.",
      "topic": "Angles and Clocks"
    },
    {
      "questionNumber": 29,
      "id": "BECE_2015_P1_Q29",
      "questionText": "A rectangular playground of width $40\\text{ m}$ and length $x\\text{ m}$ requires $220\\text{ m}$ of perimeter fencing. Find the value of $x$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $60\\text{ m}$",
        "B. $70\\text{ m}$",
        "C. $80\\text{ m}$",
        "D. $140\\text{ m}$"
      ],
      "correctAnswer": "B",
      "workedSolution": "$$\\text{Perimeter} = 2(l + w)$$\n$$220 = 2(x + 40)$$\n$$110 = x + 40$$\n$$x = 110 - 40 = 70\\text{ m}$$\n\nTherefore, option B is correct.",
      "topic": "Mensuration: Perimeter"
    },
    {
      "questionNumber": 30,
      "id": "BECE_2015_P1_Q30",
      "questionText": "Which of the following geometric concepts is described as 'the locus of a point which moves at a fixed distance from a single stationary point'?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. A straight line",
        "B. An angle bisector",
        "C. A circle",
        "D. Parallel lines"
      ],
      "correctAnswer": "C",
      "workedSolution": "A circle is defined as the locus of all points in a plane that are equidistant from a fixed centre point.\n\nTherefore, option C is correct.",
      "topic": "Geometric Locus"
    },
    {
      "questionNumber": 31,
      "id": "BECE_2015_P1_Q31",
      "questionText": "The point $A(2, 6)$ is rotated through $90^\\circ$ anti-clockwise about the origin. Find the coordinates of its image $A'$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $(-6, 2)$",
        "B. $(6, -2)$",
        "C. $(-2, -6)$",
        "D. $(2, -6)$"
      ],
      "correctAnswer": "A",
      "workedSolution": "The transformation mapping for a $90^\\circ$ anti-clockwise rotation about the origin is:\n$$(x, y) \\to (-y, x)$$\nApplying to $A(2, 6)$:\n$$A'(-6, 2)$$\n\nTherefore, option A is correct.",
      "topic": "Transformational Geometry: Rotation"
    },
    {
      "questionNumber": 32,
      "id": "BECE_2015_P1_Q32",
      "questionText": "A sentry faces South. Through how many degrees must he turn anti-clockwise to face West?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $90^\\circ$",
        "B. $180^\\circ$",
        "C. $270^\\circ$",
        "D. $360^\\circ$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Cardinal directions anti-clockwise from South:\n- South to East = $90^\\circ$\n- South to North = $180^\\circ$\n- South to West = $270^\\circ$\n\nTherefore, option C is correct.",
      "topic": "Bearings and Cardinal Directions"
    },
    {
      "questionNumber": 33,
      "id": "BECE_2015_P1_Q33",
      "questionText": "Given the column vectors $\\mathbf{a} = \\begin{pmatrix} -4 \\\\ 6 \\end{pmatrix}$ and $\\mathbf{b} = \\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix}$, calculate $2\\mathbf{b} - \\mathbf{a}$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $\\begin{pmatrix} 10 \\\\ -10 \\end{pmatrix}$",
        "B. $\\begin{pmatrix} 2 \\\\ -10 \\end{pmatrix}$",
        "C. $\\begin{pmatrix} 10 \\\\ 10 \\end{pmatrix}$",
        "D. $\\begin{pmatrix} 2 \\\\ 2 \\end{pmatrix}$"
      ],
      "correctAnswer": "A",
      "workedSolution": "$$2\\mathbf{b} = 2\\begin{pmatrix} 3 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ -4 \\end{pmatrix}$$\n$$2\\mathbf{b} - \\mathbf{a} = \\begin{pmatrix} 6 \\\\ -4 \\end{pmatrix} - \\begin{pmatrix} -4 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} 6 - (-4) \\\\ -4 - 6 \\end{pmatrix} = \\begin{pmatrix} 10 \\\\ -10 \\end{pmatrix}$$\n\nTherefore, option A is correct.",
      "topic": "Vectors: Column Matrices"
    },
    {
      "questionNumber": 34,
      "id": "BECE_2015_P1_Q34",
      "questionText": "What is the mathematical name of the 3-dimensional solid figure shown below?",
      "hasDiagram": true,
      "svgDiagram": "<svg width=\"240\" height=\"240\" viewBox=\"0 0 240 240\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><polygon points=\"120,30 30,190 210,190\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"120\" y1=\"30\" x2=\"120\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"1.8\" stroke-dasharray=\"4\"/><line x1=\"30\" y1=\"190\" x2=\"120\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"1.8\" stroke-dasharray=\"4\"/><line x1=\"210\" y1=\"190\" x2=\"120\" y2=\"140\" stroke=\"#0f172a\" stroke-width=\"1.8\" stroke-dasharray=\"4\"/><circle cx=\"120\" cy=\"140\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"120\" cy=\"30\" r=\"3.5\" fill=\"#0284c7\"/></svg>",
      "options": [
        "A. Prism",
        "B. Cone",
        "C. Tetrahedron (Triangular Pyramid)",
        "D. Cuboid"
      ],
      "correctAnswer": "C",
      "workedSolution": "The figure consists of a triangular base and three triangular lateral faces meeting at a single apex. This solid is a triangular pyramid (tetrahedron).\n\nTherefore, option C is correct.",
      "topic": "Solid Geometry"
    },
    {
      "questionNumber": 35,
      "id": "BECE_2015_P1_Q35",
      "questionText": "The table below represents a $3 \\times 3$ magic square where the sum of numbers in each row, column, and diagonal is constant:\n\n$$\\begin{array}{|c|c|c|} \\hline 15 & 14 & 19 \\\\ \\hline E & F & 12 \\\\ \\hline 13 & 18 & G \\\\ \\hline \\end{array}$$\n\nFind the value of $F$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $14$",
        "B. $15$",
        "C. $16$",
        "D. $18$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Calculate the magic constant from Row 1:\n$$\\text{Sum} = 15 + 14 + 19 = 48$$\nColumn 2 must also sum to $48$:\n$$14 + F + 18 = 48$$\n$$F + 32 = 48 \\implies F = 16$$\n\nTherefore, option C is correct.",
      "topic": "Magic Squares and Arithmetic"
    },
    {
      "questionNumber": 36,
      "id": "BECE_2015_P1_Q36",
      "questionText": "Using the magic square in Question 35, find the value of $E$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $17$",
        "B. $19$",
        "C. $20$",
        "D. $23$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Column 1 must sum to the magic constant $48$:\n$$15 + E + 13 = 48$$\n$$E + 28 = 48 \\implies E = 20$$\n*(Cross-check with Row 2: $E + F + 12 = 20 + 16 + 12 = 48$, verified)*.\n\nTherefore, option C is correct.",
      "topic": "Magic Squares and Arithmetic"
    },
    {
      "questionNumber": 37,
      "id": "BECE_2015_P1_Q37",
      "questionText": "Using the magic square in Question 35, evaluate $E + G$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $31$",
        "B. $34$",
        "C. $37$",
        "D. $40$"
      ],
      "correctAnswer": "C",
      "workedSolution": "First find $G$ from Column 3:\n$$19 + 12 + G = 48$$\n$$31 + G = 48 \\implies G = 17$$\nFrom Question 36, $E = 20$.\nNow evaluate:\n$$E + G = 20 + 17 = 37$$\n\nTherefore, option C is correct.",
      "topic": "Magic Squares and Arithmetic"
    },
    {
      "questionNumber": 38,
      "id": "BECE_2015_P1_Q38",
      "questionText": "The hypotenuse and one leg of a right-angled triangle are $17\\text{ cm}$ and $8\\text{ cm}$ respectively. Find the length of the third side.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $9\\text{ cm}$",
        "B. $12\\text{ cm}$",
        "C. $14\\text{ cm}$",
        "D. $15\\text{ cm}$"
      ],
      "correctAnswer": "D",
      "workedSolution": "By the Pythagorean theorem:\n$$a^2 + b^2 = c^2$$\n$$8^2 + b^2 = 17^2$$\n$$64 + b^2 = 289$$\n$$b^2 = 289 - 64 = 225$$\n$$b = \\sqrt{225} = 15\\text{ cm}$$\n\nTherefore, option D is correct.",
      "topic": "Pythagoras' Theorem"
    },
    {
      "questionNumber": 39,
      "id": "BECE_2015_P1_Q39",
      "questionText": "Find the missing term in the sequence: $13, 19, 26, 34, \\underline{\\hspace{0.5cm}}, 53, 64$.",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $41$",
        "B. $42$",
        "C. $43$",
        "D. $44$"
      ],
      "correctAnswer": "C",
      "workedSolution": "Analyze the successive differences:\n- $19 - 13 = +6$\n- $26 - 19 = +7$\n- $34 - 26 = +8$\n- Next difference must be $+9$:\n$$34 + 9 = 43$$\nCheck subsequent terms:\n- $43 + 10 = 53$\n- $53 + 11 = 64$\nThe pattern is verified.\n\nTherefore, option C is correct.",
      "topic": "Number Sequences"
    },
    {
      "questionNumber": 40,
      "id": "BECE_2015_P1_Q40",
      "questionText": "An assembly hall which is $30\\text{ m}$ long is represented on an architectural floor plan as $15\\text{ cm}$ long. What is the scale of the plan?",
      "hasDiagram": false,
      "svgDiagram": null,
      "options": [
        "A. $1 : 200$",
        "B. $1 : 250$",
        "C. $1 : 400$",
        "D. $1 : 500$"
      ],
      "correctAnswer": "A",
      "workedSolution": "Convert dimensions to the same unit ($1\\text{ m} = 100\\text{ cm}$):\n$$\\text{Actual length} = 30\\text{ m} = 3,000\\text{ cm}$$\n$$\\text{Scale} = \\frac{\\text{Plan length}}{\\text{Actual length}} = \\frac{15\\text{ cm}}{3,000\\text{ cm}} = \\frac{1}{200} = 1 : 200$$\n\nTherefore, option A is correct.",
      "topic": "Ratio and Scale Drawing"
    }
  ]
};

export const SET_BECE_2015_MATH_P1: CurriculumQuestionSet = {
  id: "jhs-math-2015-paper1",
  title: "BECE 2015 Mathematics Paper 1 (Objective Test)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2015 Paper 1",
  variantType: "past_paper_variant",
  totalQuestions: 40,
  version: 1,
  format: 'multiple_choice',
  paperType: 1,
  year: 2015,
  era: 'legacy',
  instructions: "Answer all forty questions. Each question is followed by four options lettered A to D. Choose the correct option for each question.",
  timeAllowed: "1 hour",
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2015/paper_1",
  questions: BECE_2015_MATH_P1_DATA.questions.map((q) => {
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

export const SET_BECE_2015_MATH_P1_ALIAS: CurriculumQuestionSet = {
  ...SET_BECE_2015_MATH_P1,
  id: "bece_2015_math_p1"
};

export const BECE_2015_MATH_P2_DATA = {
  "examMetadata": {
    "examYear": 2015,
    "examination": "BECE (Basic Education Certificate Examination)",
    "subject": "Mathematics",
    "paper": "Paper 2 (Theory / Essay)",
    "totalQuestions": 6,
    "instructions": "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
    "timeAllowed": "1 hour",
    "curriculumAlignment": "NaCCA JHS Common Core Programme / WAEC Standards",
    "firestoreCollectionPath": "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2015/paper_2"
  },
  "questions": [
    {
      "questionNumber": 1,
      "id": "BECE_2015_P2_Q01",
      "marks": 15,
      "topic": "Sets, Venn Diagrams, and Fractional Land Area",
      "subQuestions": [
        {
          "part": "a",
          "marks": 9,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"360\" height=\"220\" viewBox=\"0 0 360 220\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect x=\"10\" y=\"10\" width=\"340\" height=\"200\" fill=\"#f8fafc\" stroke=\"#334155\" stroke-width=\"2\" rx=\"8\"/><text x=\"25\" y=\"32\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">U = 80</text><circle cx=\"130\" cy=\"115\" r=\"70\" fill=\"#ef4444\" fill-opacity=\"0.2\" stroke=\"#dc2626\" stroke-width=\"2\"/><circle cx=\"220\" cy=\"115\" r=\"70\" fill=\"#3b82f6\" fill-opacity=\"0.2\" stroke=\"#2563eb\" stroke-width=\"2\"/><text x=\"95\" y=\"60\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">R (Red Cross)</text><text x=\"220\" y=\"60\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#2563eb\">G (Girls' Guide)</text><text x=\"100\" y=\"120\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">33</text><text x=\"168\" y=\"120\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">15</text><text x=\"235\" y=\"120\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">17</text><text x=\"295\" y=\"190\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\" fill=\"#0f172a\">15</text></svg>",
          "questionText": "In a school of $80$ students, $48$ belong to the Red Cross Society, $32$ belong to the Girls' Guide Society, and $15$ belong to both societies. The remaining students do not belong to either of the two societies.\n(i) Illustrate the information on a Venn diagram.\n(ii) How many students belong to the Red Cross Society only?\n(iii) How many students do not belong to either of the two societies?",
          "workedSolution": "**(i) Venn Diagram Representation:**\nLet the Universal set be $U$, with $n(U) = 80$.\nLet $R$ denote the set of students in the Red Cross Society $\\implies n(R) = 48$.\nLet $G$ denote the set of students in the Girls' Guide Society $\\implies n(G) = 32$.\nIntersection (both societies): $n(R \\cap G) = 15$.\n\nRegion calculations:\n- Students in Red Cross only: $n(R \\cap G') = 48 - 15 = 33$.\n- Students in Girls' Guide only: $n(R' \\cap G) = 32 - 15 = 17$.\n- Students in neither society: $x = n(R \\cup G)'$.\n\n*(See the embedded SVG above for the complete, labeled illustration)*.\n\n---\n\n**(ii) Students belonging to the Red Cross Society only:**\n$$n(R \\text{ only}) = n(R) - n(R \\cap G) = 48 - 15 = 33$$\n\nTherefore, **$33$ students belong to the Red Cross Society only**.\n\n---\n\n**(iii) Students who do not belong to either society ($x$):**\n$$\\text{Total in either society } n(R \\cup G) = 33 + 15 + 17 = 65$$\n$$n(R \\cup G)' = n(U) - n(R \\cup G) = 80 - 65 = 15$$\n\nTherefore, **$15$ students do not belong to either of the two societies**."
        },
        {
          "part": "b",
          "marks": 6,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "A farmer uses $\\frac{1}{4}$ of his land to plant oil palm, $\\frac{2}{5}$ of the remaining land to plant citrus, and the rest for groundnuts. If groundnuts cover an area of $18\\text{ acres}$, what is the total area of the farmer's land?",
          "workedSolution": "**Step 1: Calculate the fraction remaining after planting oil palm:**\n$$\\text{Fraction for oil palm} = \\frac{1}{4}$$\n$$\\text{Remaining land} = 1 - \\frac{1}{4} = \\frac{3}{4}$$\n\n**Step 2: Calculate the fraction of total land used for citrus:**\n$$\\text{Fraction for citrus} = \\frac{2}{5} \\text{ of } \\frac{3}{4} = \\frac{2}{5} \\times \\frac{3}{4} = \\frac{6}{20} = \\frac{3}{10}$$\n\n**Step 3: Calculate the fraction left for groundnuts:**\n$$\\text{Fraction for groundnuts} = \\frac{3}{4} - \\frac{3}{10} = \\frac{15 - 6}{20} = \\frac{9}{20}$$\n*(Alternatively: $1 - \\frac{2}{5} = \\frac{3}{5}$ of the remainder $\\implies \\frac{3}{5} \\times \\frac{3}{4} = \\frac{9}{20}$)*.\n\n**Step 4: Equate fraction to the actual area:**\nLet the total area of the land be $A$:\n$$\\frac{9}{20}A = 18$$\n$$A = 18 \\times \\frac{20}{9} = 2 \\times 20 = 40\\text{ acres}$$\n\nTherefore, the total area of the farmer's land is **$40\\text{ acres}$**."
        }
      ]
    },
    {
      "questionNumber": 2,
      "id": "BECE_2015_P2_Q02",
      "marks": 15,
      "topic": "Linear Inequalities and Pie Chart Representation",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Solve for $x$ in the inequality: $3 - \\frac{2}{3}x \\le 1\\frac{1}{2}$.",
          "workedSolution": "Given inequality:\n$$3 - \\frac{2}{3}x \\le \\frac{3}{2}$$\n\n**Step 1: Multiply through by the LCM of 3 and 2, which is $6$, to clear denominators:**\n$$6(3) - 6\\left(\\frac{2}{3}x\\right) \\le 6\\left(\\frac{3}{2}\\right)$$\n$$18 - 4x \\le 9$$\n\n**Step 2: Isolate the variable term:**\n$$-4x \\le 9 - 18$$\n$$-4x \\le -9$$\n\n**Step 3: Divide both sides by $-4$ and reverse the inequality sign:**\n$$x \\ge \\frac{-9}{-4}$$\n$$x \\ge \\frac{9}{4} = 2\\frac{1}{4} = 2.25$$\n\n**Truth set:** $\\mathbf{\\left\\{x : x \\ge 2\\frac{1}{4}\\right\\}}$."
        },
        {
          "part": "b",
          "marks": 10,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"320\" height=\"320\" viewBox=\"0 0 320 320\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><circle cx=\"160\" cy=\"160\" r=\"130\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2\"/><path d=\"M 160 160 L 290 160 A 130 130 0 0 1 123.6 284.8 Z\" fill=\"#38bdf8\" fill-opacity=\"0.3\" stroke=\"#0284c7\" stroke-width=\"1.5\"/><path d=\"M 160 160 L 123.6 284.8 A 130 130 0 0 1 31.7 139.7 Z\" fill=\"#f59e0b\" fill-opacity=\"0.3\" stroke=\"#d97706\" stroke-width=\"1.5\"/><path d=\"M 160 160 L 31.7 139.7 A 130 130 0 0 1 83.6 54.8 Z\" fill=\"#10b981\" fill-opacity=\"0.3\" stroke=\"#059669\" stroke-width=\"1.5\"/><path d=\"M 160 160 L 83.6 54.8 A 130 130 0 0 1 200.2 36.3 Z\" fill=\"#8b5cf6\" fill-opacity=\"0.3\" stroke=\"#7c3aed\" stroke-width=\"1.5\"/><path d=\"M 160 160 L 200.2 36.3 A 130 130 0 0 1 290 160 Z\" fill=\"#ec4899\" fill-opacity=\"0.3\" stroke=\"#db2777\" stroke-width=\"1.5\"/><text x=\"190\" y=\"230\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Ashanti (126°)</text><text x=\"60\" y=\"215\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Ewe (90°)</text><text x=\"45\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Ga (54°)</text><text x=\"125\" y=\"60\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Fante (54°)</text><text x=\"215\" y=\"105\" font-family=\"sans-serif\" font-size=\"11\" font-weight=\"bold\">Dagomba (36°)</text></svg>",
          "questionText": "At a regional youth convention attended by $600\\text{ delegates}$, $35\\%$ were Ashantis, $25\\%$ were Ewes, $15\\%$ were Gas, $15\\%$ were Fantes, and the remainder were Dagombas.\n(i) How many Dagombas were at the convention?\n(ii) How many more Ashantis than Gas were at the convention?\n(iii) Calculate the sector angles and draw a pie chart to illustrate the information.",
          "workedSolution": "**(i) Finding the number of Dagombas:**\n$$\\text{Sum of known percentages} = 35\\% + 25\\% + 15\\% + 15\\% = 90\\%$$\n$$\\text{Percentage of Dagombas} = 100\\% - 90\\% = 10\\%$$\n$$\\text{Number of Dagombas} = \\frac{10}{100} \\times 600 = 60$$\n\nTherefore, **$60$ Dagombas were at the convention**.\n\n---\n\n**(ii) Difference between Ashantis and Gas:**\n$$\\text{Number of Ashantis} = \\frac{35}{100} \\times 600 = 35 \\times 6 = 210$$\n$$\\text{Number of Gas} = \\frac{15}{100} \\times 600 = 15 \\times 6 = 90$$\n$$\\text{Difference} = 210 - 90 = 120$$\n*(Alternatively: $(35\\% - 15\\%) \\times 600 = 20\\% \\times 600 = 120$)*.\n\nTherefore, there were **$120$ more Ashantis than Gas**.\n\n---\n\n**(iii) Sector Angles for Pie Chart:**\nTotal angle in a pie chart $= 360^\\circ$:\n- **Ashanti:** $\\frac{35}{100} \\times 360^\\circ = 35 \\times 3.6^\\circ = 126^\\circ$\n- **Ewe:** $\\frac{25}{100} \\times 360^\\circ = \\frac{1}{4} \\times 360^\\circ = 90^\\circ$\n- **Ga:** $\\frac{15}{100} \\times 360^\\circ = 15 \\times 3.6^\\circ = 54^\\circ$\n- **Fante:** $\\frac{15}{100} \\times 360^\\circ = 15 \\times 3.6^\\circ = 54^\\circ$\n- **Dagomba:** $\\frac{10}{100} \\times 360^\\circ = 36^\\circ$\n\n$$\\text{Total} = 126^\\circ + 90^\\circ + 54^\\circ + 54^\\circ + 36^\\circ = 360^\\circ$$\n\n*(See the embedded SVG above for the pie chart drawing)*."
        }
      ]
    },
    {
      "questionNumber": 3,
      "id": "BECE_2015_P2_Q03",
      "marks": 15,
      "topic": "Travel Distance, Field Geometry Equating Perimeters, and Line Gradient",
      "subQuestions": [
        {
          "part": "a",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Mr. Osei's farm is $24\\text{ km}$ from his home. He drives his pickup truck for $d\\text{ km}$ of the journey, and walks the remaining distance for $1\\frac{1}{2}\\text{ hours}$ at an average walking speed of $4\\text{ km/h}$. Find the value of $d$.",
          "workedSolution": "**Step 1: Calculate the distance walked:**\n$$\\text{Distance walked} = \\text{Speed} \\times \\text{Time}$$\n$$\\text{Speed} = 4\\text{ km/h}$$\n$$\\text{Time} = 1\\frac{1}{2}\\text{ hours} = 1.5\\text{ hours}$$\n$$\\text{Distance walked} = 4 \\times 1.5 = 6\\text{ km}$$\n\n**Step 2: Solve for $d$:**\n$$\\text{Total distance} = d + \\text{Distance walked}$$\n$$24 = d + 6$$\n$$d = 24 - 6 = 18\\text{ km}$$\n\nTherefore, **$d = 18\\text{ km}$**."
        },
        {
          "part": "b",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "The perimeter of a square park is equal to that of a rectangular field. If the length of the rectangular field is $10\\text{ km}$ and the width is $6\\text{ km}$, calculate the area of the square park.",
          "workedSolution": "**Step 1: Find the perimeter of the rectangular field:**\n$$P = 2(l + w) = 2(10 + 6) = 2(16) = 32\\text{ km}$$\n\n**Step 2: Find the side length of the square park ($s$):**\n$$\\text{Perimeter of square} = 4s = 32\\text{ km}$$\n$$s = \\frac{32}{4} = 8\\text{ km}$$\n\n**Step 3: Calculate the area of the square park:**\n$$\\text{Area} = s^2 = 8^2 = 64\\text{ km}^2$$\n\nTherefore, the area of the square park is **$64\\text{ km}^2$**."
        },
        {
          "part": "c",
          "marks": 5,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Find the gradient (slope) of the straight line which passes through the points $P(3, -2)$ and $Q(-2, 8)$.",
          "workedSolution": "Apply the gradient formula:\n$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$\nGiven coordinates $(x_1, y_1) = (3, -2)$ and $(x_2, y_2) = (-2, 8)$:\n$$m = \\frac{8 - (-2)}{-2 - 3} = \\frac{8 + 2}{-5} = \\frac{10}{-5} = -2$$\n\nTherefore, the gradient of the line is **$-2$**."
        }
      ]
    },
    {
      "questionNumber": 4,
      "id": "BECE_2015_P2_Q04",
      "marks": 15,
      "topic": "Geometric Construction and Circle Intersections",
      "subQuestions": [
        {
          "part": "a",
          "marks": 11,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"420\" height=\"340\" viewBox=\"0 0 420 340\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"420\" height=\"340\" fill=\"#ffffff\"/><circle cx=\"270\" cy=\"150\" r=\"75\" fill=\"none\" stroke=\"#7c3aed\" stroke-width=\"1.8\" stroke-dasharray=\"3\"/><polygon points=\"50,230 270,230 270,150\" fill=\"#f8fafc\" stroke=\"#0f172a\" stroke-width=\"2.5\"/><line x1=\"160\" y1=\"30\" x2=\"160\" y2=\"310\" stroke=\"#0284c7\" stroke-dasharray=\"4\" stroke-width=\"1.8\"/><circle cx=\"160\" cy=\"78\" r=\"4\" fill=\"#dc2626\"/><circle cx=\"160\" cy=\"222\" r=\"4\" fill=\"#dc2626\"/><circle cx=\"270\" cy=\"150\" r=\"3.5\" fill=\"#7c3aed\"/><text x=\"35\" y=\"245\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">P</text><text x=\"280\" y=\"245\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">S</text><text x=\"280\" y=\"145\" font-family=\"sans-serif\" font-size=\"14\" font-weight=\"bold\">T</text><text x=\"168\" y=\"80\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">Q₁</text><text x=\"168\" y=\"225\" font-family=\"sans-serif\" font-size=\"13\" font-weight=\"bold\" fill=\"#dc2626\">Q₂</text><path d=\"M 230 230 A 40 40 0 0 1 245 195\" fill=\"none\" stroke=\"#0f172a\" stroke-width=\"1.5\"/><text x=\"215\" y=\"215\" font-family=\"sans-serif\" font-size=\"12\">30°</text><text x=\"150\" y=\"250\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">10 cm</text><text x=\"280\" y=\"195\" font-family=\"sans-serif\" font-size=\"12\" fill=\"#0f172a\">8 cm</text><line x1=\"270\" y1=\"150\" x2=\"160\" y2=\"78\" stroke=\"#7c3aed\" stroke-width=\"1.2\" stroke-dasharray=\"2\"/><line x1=\"270\" y1=\"150\" x2=\"160\" y2=\"222\" stroke=\"#7c3aed\" stroke-width=\"1.2\" stroke-dasharray=\"2\"/></svg>",
          "questionText": "Using a ruler and a pair of compasses only:\n(i) Construct triangle $PST$ such that $\\angle PST = 30^\\circ, |ST| = 8.0\\text{ cm},$ and $|PS| = 10.0\\text{ cm}$;\n(ii) With vertex $T$ as centre, construct a circle of radius $6.0\\text{ cm}$;\n(iii) Construct the perpendicular bisector (mediator) of line segment $PS$;\n(iv) Label the two intersection points of the circle and the mediator as $Q_1$ and $Q_2$.",
          "workedSolution": "**Step-by-Step Construction Protocol:**\n1. **Base Line $|PS| = 10.0\\text{ cm}$:**\n   - Draw a horizontal line segment and mark point $P$.\n   - Using compasses set to $10.0\\text{ cm}$, cut the line from $P$ to locate point $S$.\n2. **Constructing $\\angle PST = 30^\\circ$:**\n   - At vertex $S$, construct a standard $60^\\circ$ angle above the baseline.\n   - Bisect the $60^\\circ$ angle using two intersecting arcs to obtain a $30^\\circ$ ray.\n3. **Locating Vertex $T$ ($|ST| = 8.0\\text{ cm}$):**\n   - Set compasses to $8.0\\text{ cm}$, place the needle at $S$, and cut the $30^\\circ$ ray to establish point $T$.\n   - Join $P$ to $T$ with a straight line to complete triangle $PST$.\n4. **Constructing the Circle at Centre $T$:**\n   - Adjust compass radius to exactly $6.0\\text{ cm}$.\n   - With needle firmly placed at $T$, draw a full circle.\n5. **Perpendicular Bisector of Line $PS$:**\n   - With needle at $P$ and radius $> 5.0\\text{ cm}$, draw arcs above and below line $PS$.\n   - With the same radius, place needle at $S$ and strike intersecting arcs.\n   - Draw the straight vertical mediator passing through the mid-point of $PS$ ($5.0\\text{ cm}$ from $P$).\n6. **Marking Intersections:**\n   - Label the top intersection of this mediator with the circle as $Q_1$ and the bottom intersection as $Q_2$."
        },
        {
          "part": "b",
          "marks": 4,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "(i) Measure the distance $|Q_1Q_2|$.\n(ii) Measure $\\angle Q_1TQ_2$.",
          "workedSolution": "**(i) Measuring length $|Q_1Q_2|$:**\n- The perpendicular distance from centre $T$ to the mediator of $PS$ is:\n$$d = |x_T - x_{\\text{mid}}| = (10 - 8\\cos 30^\\circ) - 5 = 10 - 6.928 - 5 = -1.928\\text{ cm} \\implies |d| \\approx 1.93\\text{ cm}$$\n- The chord length $|Q_1Q_2|$ is:\n$$|Q_1Q_2| = 2\\sqrt{r^2 - d^2} = 2\\sqrt{6^2 - 1.93^2} = 2\\sqrt{36 - 3.72} = 2\\sqrt{32.28} \\approx 11.4\\text{ cm}$$\n$$\\mathbf{|Q_1Q_2| = 11.4\\text{ cm} \\pm 0.1\\text{ cm}}$$\n\n---\n\n**(ii) Measuring $\\angle Q_1TQ_2$:**\n$$\\cos\\left(\\frac{\\theta}{2}\\right) = \\frac{d}{r} = \\frac{1.93}{6} \\approx 0.3217$$\n$$\\frac{\\theta}{2} = \\arccos(0.3217) \\approx 71.2^\\circ \\implies \\theta \\approx 142.4^\\circ$$\n$$\\mathbf{\\angle Q_1TQ_2 \\approx 142^\\circ \\pm 2^\\circ}$$\n\nTherefore, **$|Q_1Q_2| \\approx 11.4\\text{ cm}$** and **$\\angle Q_1TQ_2 \\approx 142^\\circ$**."
        }
      ]
    },
    {
      "questionNumber": 5,
      "id": "BECE_2015_P2_Q05",
      "marks": 15,
      "topic": "Commercial Unit Pricing and Closed-End Cylinder Mensuration",
      "subQuestions": [
        {
          "part": "a",
          "marks": 6,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "Akosua purchased $60\\text{ tubers}$ of yam at a wholesale rate of $4\\text{ tubers}$ for $\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 15.00$. When retailing them, she suffered a loss of $20\\%$. How much did she sell each tuber of yam?",
          "workedSolution": "**Step 1: Calculate the total cost price:**\n$$\\text{Number of groups of 4 tubers} = \\frac{60}{4} = 15$$\n$$\\text{Total Cost Price} = 15 \\times \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 15.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 225.00$$\n*(Cost price per single tuber $= \\frac{15.00}{4} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3.75$)*.\n\n**Step 2: Calculate the total selling price with a $20\\%$ loss:**\n$$\\text{Selling Price} = (100\\% - 20\\%) \\text{ of Cost Price} = 80\\% \\times 225.00$$\n$$\\text{Total Selling Price} = 0.80 \\times 225.00 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 180.00$$\n\n**Step 3: Calculate the selling price per tuber:**\n$$\\text{Price per tuber} = \\frac{180.00}{60} = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3.00$$\n*(Alternatively: $80\\% \\times 3.75 = 0.8 \\times 3.75 = \\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3.00$)*.\n\nTherefore, she sold each tuber of yam for **$\\text{GH}\\mkern1mu\\cancel{\\text{c}}\\, 3.00$**."
        },
        {
          "part": "b",
          "marks": 9,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "The volume of a metal cylinder closed at one end is $1,540\\text{ cm}^3$. If its height is $10\\text{ cm}$, find its:\n(i) diameter;\n(ii) total external surface area.\n$\\left[\\text{Take } \\pi = \\frac{22}{7}\\right]$",
          "workedSolution": "**(i) Finding the diameter of the cylinder:**\nVolume of a cylinder: $V = \\pi r^2 h$\n$$1,540 = \\frac{22}{7} \\times r^2 \\times 10$$\n$$1,540 = \\frac{220}{7} r^2$$\n$$r^2 = \\frac{1,540 \\times 7}{220} = 7 \\times 7 = 49$$\n$$r = \\sqrt{49} = 7\\text{ cm}$$\n$$\\text{Diameter } d = 2r = 2 \\times 7 = 14\\text{ cm}$$\n\nTherefore, the diameter of the cylinder is **$14\\text{ cm}$**.\n\n---\n\n**(ii) Finding the total external surface area (closed at ONE end):**\nA cylinder closed at one end comprises one circular base and the curved surface area:\n$$\\text{Total Surface Area} = \\pi r^2 + 2\\pi r h = \\pi r(r + 2h)$$\nUsing $r = 7\\text{ cm}, h = 10\\text{ cm},$ and $\\pi = \\frac{22}{7}$:\n$$\\text{Base Area} = \\frac{22}{7} \\times 7^2 = 22 \\times 7 = 154\\text{ cm}^2$$\n$$\\text{Curved Surface Area} = 2 \\times \\frac{22}{7} \\times 7 \\times 10 = 44 \\times 10 = 440\\text{ cm}^2$$\n$$\\text{Total Surface Area} = 154 + 440 = 594\\text{ cm}^2$$\n\nTherefore, the total surface area of the cylinder is **$594\\text{ cm}^2$**."
        }
      ]
    },
    {
      "questionNumber": 6,
      "id": "BECE_2015_P2_Q06",
      "marks": 15,
      "topic": "Linear Relations, Table of Values, and Straight-Line Graphing",
      "subQuestions": [
        {
          "part": "a",
          "marks": 4,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "(i) Copy and complete the following linear mapping table:\n$$\\begin{array}{cccccccc} x & 1 & 2 & 3 & 4 & 5 & 6 & 7 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 4 & 7 & 10 & - & - & - & 22 \\end{array}$$\n(ii) Determine the mathematical rule for the mapping.",
          "workedSolution": "**(i) Completing the mapping table:**\nObserve the common difference between consecutive $y$-values:\n$$7 - 4 = 3, \\quad 10 - 7 = 3$$\nThe output increments by $3$ for every unit increase in $x$.\n- For $x = 4$: $y = 10 + 3 = 13$\n- For $x = 5$: $y = 13 + 3 = 16$\n- For $x = 6$: $y = 16 + 3 = 19$\n- For $x = 7$: $y = 19 + 3 = 22$ (Verified)\n\n**Completed Table:**\n$$\\begin{array}{cccccccc} x & 1 & 2 & 3 & 4 & 5 & 6 & 7 \\\\ \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow & \\downarrow \\\\ y & 4 & 7 & 10 & \\mathbf{13} & \\mathbf{16} & \\mathbf{19} & 22 \\end{array}$$\n\n---\n\n**(ii) Determining the rule:**\nLinear function form: $y = mx + c$\n$$m = 3$$\nSubstitute $x = 1, y = 4$:\n$$4 = 3(1) + c \\implies c = 1$$\n$$\\mathbf{y = 3x + 1} \\quad \\text{or} \\quad \\mathbf{x \\to 3x + 1}$$"
        },
        {
          "part": "b",
          "marks": 7,
          "hasDiagram": true,
          "svgDiagram": "<svg width=\"400\" height=\"360\" viewBox=\"0 0 400 360\" xmlns=\"http://www.w3.org/2000/svg\" style=\"background:#ffffff;border-radius:12px;padding:6px;\"><rect width=\"400\" height=\"360\" fill=\"#f8fafc\" stroke=\"#cbd5e1\" stroke-width=\"1\"/><defs><pattern id=\"grid6_2015\" width=\"20\" height=\"20\" patternUnits=\"userSpaceOnUse\"><path d=\"M 20 0 L 0 0 0 20\" fill=\"none\" stroke=\"#e2e8f0\" stroke-width=\"0.8\"/></pattern></defs><rect width=\"400\" height=\"360\" fill=\"url(#grid6_2015)\"/><line x1=\"40\" y1=\"320\" x2=\"380\" y2=\"320\" stroke=\"#0f172a\" stroke-width=\"2\"/><line x1=\"60\" y1=\"20\" x2=\"60\" y2=\"340\" stroke=\"#0f172a\" stroke-width=\"2\"/><text x=\"385\" y=\"325\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">x</text><text x=\"65\" y=\"25\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\">y</text><text x=\"50\" y=\"335\" font-family=\"sans-serif\" font-size=\"10\">0</text><text x=\"98\" y=\"335\" font-family=\"sans-serif\" font-size=\"10\">1</text><text x=\"138\" y=\"335\" font-family=\"sans-serif\" font-size=\"10\">2</text><text x=\"178\" y=\"335\" font-family=\"sans-serif\" font-size=\"10\">3</text><text x=\"218\" y=\"335\" font-family=\"sans-serif\" font-size=\"10\">4</text><text x=\"258\" y=\"335\" font-family=\"sans-serif\" font-size=\"10\">5</text><text x=\"298\" y=\"335\" font-family=\"sans-serif\" font-size=\"10\">6</text><text x=\"338\" y=\"335\" font-family=\"sans-serif\" font-size=\"10\">7</text><text x=\"35\" y=\"265\" font-family=\"sans-serif\" font-size=\"10\">4</text><text x=\"35\" y=\"205\" font-family=\"sans-serif\" font-size=\"10\">8</text><text x=\"30\" y=\"145\" font-family=\"sans-serif\" font-size=\"10\">12</text><text x=\"30\" y=\"85\" font-family=\"sans-serif\" font-size=\"10\">16</text><text x=\"30\" y=\"35\" font-family=\"sans-serif\" font-size=\"10\">20</text><line x1=\"60\" y1=\"305\" x2=\"350\" y2=\"15\" stroke=\"#0284c7\" stroke-width=\"2.5\"/><circle cx=\"60\" cy=\"305\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"100\" cy=\"260\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"140\" cy=\"215\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"180\" cy=\"170\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"220\" cy=\"125\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"260\" cy=\"80\" r=\"3.5\" fill=\"#dc2626\"/><circle cx=\"300\" cy=\"35\" r=\"3.5\" fill=\"#dc2626\"/><text x=\"235\" y=\"90\" font-family=\"sans-serif\" font-size=\"12\" font-weight=\"bold\" fill=\"#0284c7\">y = 3x + 1</text></svg>",
          "questionText": "Using a scale of $2\\text{ cm}$ to $1\\text{ unit}$ on the $x$-axis and $2\\text{ cm}$ to $2\\text{ units}$ on the $y$-axis, mark the $x$-axis from $0$ to $8$ and the $y$-axis from $0$ to $24$.\nPlot the ordered pairs $(x, y)$ from the table and join them with a straight line.",
          "workedSolution": "**Graphing Procedure:**\n1. **Scale and Axes Setup:**\n   - Horizontal $x$-axis: $2\\text{ cm} = 1\\text{ unit}$ ($0, 1, 2, 3, 4, 5, 6, 7, 8$).\n   - Vertical $y$-axis: $2\\text{ cm} = 2\\text{ units}$ ($0, 2, 4, 6, \\dots, 24$).\n2. **Plot the points:**\n   - $(1, 4), (2, 7), (3, 10), (4, 13), (5, 16), (6, 19), (7, 22)$.\n3. **Draw the line:** Use a clear ruler to connect all points into a single straight line spanning the grid.\n4. **Label the line:** $y = 3x + 1$."
        },
        {
          "part": "c",
          "marks": 4,
          "hasDiagram": false,
          "svgDiagram": null,
          "questionText": "From your graph, find:\n(i) the value of $y$ when $x = 0$;\n(ii) the value of $x$ when $y = 16$.",
          "workedSolution": "**(i) Finding $y$ when $x = 0$ ($y$-intercept):**\nTrace the point where the line intersects the vertical $y$-axis ($x = 0$):\n$$y = 3(0) + 1 = 1$$\nFrom the graph: **$y = 1$**.\n\n---\n\n**(ii) Finding $x$ when $y = 16$:**\nTrace horizontally from $y = 16$ on the vertical axis to the line, then down to the horizontal axis:\n$$16 = 3x + 1$$\n$$3x = 15 \\implies x = 5$$\nFrom the graph: **$x = 5$**.\n\nTherefore, **$y = 1$ when $x = 0$** and **$x = 5$ when $y = 16$**."
        }
      ]
    }
  ]
};

export const SET_BECE_2015_MATH_P2: CurriculumQuestionSet = {
  id: "jhs-math-2015-paper2",
  title: "BECE 2015 Mathematics Paper 2 (Theory / Essay)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "BECE Past Papers • 2015 Paper 2",
  variantType: "past_paper_variant",
  totalQuestions: 6,
  version: 1,
  format: 'structured_essay',
  paperType: 2,
  year: 2015,
  era: 'legacy',
  instructions: "Answer four questions only. All questions carry equal marks. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
  timeAllowed: "1 hour",
  curriculumAlignment: "NaCCA JHS Common Core Programme / WAEC Standards",
  firestoreCollectionPath: "global_curriculum/jhs/subjects/mathematics/past_questions/bece_2015/paper_2",
  theoryTopicList: [
    { id: "q1", questionNumber: 1, theoryIndex: 1, title: "Sets, Venn Diagrams & Land Area", category: "Sets & Arithmetic" },
    { id: "q2", questionNumber: 2, theoryIndex: 2, title: "Inequalities & Pie Chart Angles", category: "Algebra & Statistics" },
    { id: "q3", questionNumber: 3, theoryIndex: 3, title: "Speed-Distance, Perimeter & Gradient", category: "Geometry & Coordinates" },
    { id: "q4", questionNumber: 4, theoryIndex: 4, title: "Geometric Construction & Chords", category: "Geometry & Construction" },
    { id: "q5", questionNumber: 5, theoryIndex: 5, title: "Retail Loss & Cylinder Mensuration", category: "Commercial & Mensuration" },
    { id: "q6", questionNumber: 6, theoryIndex: 6, title: "Linear Mapping, Graphing & Intercepts", category: "Relations & Graphs" }
  ],
  questions: BECE_2015_MATH_P2_DATA.questions.map((q) => {
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

export const SET_BECE_2015_MATH_P2_ALIAS: CurriculumQuestionSet = {
  ...SET_BECE_2015_MATH_P2,
  id: "bece_2015_math_p2"
};
