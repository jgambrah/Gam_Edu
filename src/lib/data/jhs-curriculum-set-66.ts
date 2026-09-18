import { CurriculumQuestionSet } from '../global-curriculum-types';

export const SET_JHS_MASTERY_SERIES_66: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-66",
  title: "Junior Core Mathematics - Objective Mastery Series (Set 66)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series (2019 BECE Variant)",
  variantType: "past_paper_variant",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
        "id": "q01",
        "prompt": "Given that $A = \\{3, 6, 9, 12, 15\\}$ and $B = \\{6, 12, 18\\}$, find $A \\cup B$.",
        "options": [
            "{6, 12}",
            "{3, 9, 15, 18}",
            "{3, 6, 9, 12, 15, 18}",
            "{6, 12, 15, 18}"
        ],
        "correctAnswer": "{3, 6, 9, 12, 15, 18}",
        "hint": "Union contains all unique elements present in either set $A$ or set $B$.",
        "workedSolution": "$$A \\cup B = \\{3, 6, 9, 12, 15\\} \\cup \\{6, 12, 18\\} = \\{3, 6, 9, 12, 15, 18\\}$$.",
        "points": 1
    },
    {
        "id": "q02",
        "prompt": "Express $0.000475$ in standard form.",
        "options": [
            "$4.75 \\times 10^{-4}$",
            "$4.75 \\times 10^{-5}$",
            "$4.75 \\times 10^{-3}$",
            "$47.5 \\times 10^{-5}$"
        ],
        "correctAnswer": "$4.75 \\times 10^{-4}$",
        "hint": "Count the number of places the decimal point moves to the right to reach the first non-zero digit.",
        "workedSolution": "Moving the decimal point 4 places to the right gives $$4.75 \\times 10^{-4}$$.",
        "points": 1
    },
    {
        "id": "q03",
        "prompt": "Which of the following integers has the largest value: $-80, -60, -5, -1$?",
        "options": [
            "-5",
            "-60",
            "-80",
            "-1"
        ],
        "correctAnswer": "-1",
        "hint": "On the number line, numbers positioned furthest to the right are greatest.",
        "workedSolution": "Among negative numbers, the one closest to zero is greatest: $$-1 > -5 > -60 > -80$$.",
        "points": 1
    },
    {
        "id": "q04",
        "prompt": "Correct $0.035672$ to three significant figures.",
        "options": [
            "0.0356",
            "0.036",
            "0.03567",
            "0.0357"
        ],
        "correctAnswer": "0.0357",
        "hint": "Leading zeros do not count. The first three significant figures are 3, 5, and 6.",
        "workedSolution": "The third significant figure is 6. The next digit is 7 ($\\ge 5$), so round 6 up to 7: $$0.0357$$.",
        "points": 1
    },
    {
        "id": "q05",
        "prompt": "Simplify: $$(5^6 \\times 5^4) \\div 5^7$$.",
        "options": [
            "$5^2$",
            "$5^3$",
            "$5^4$",
            "$5^{13}$"
        ],
        "correctAnswer": "$5^3$",
        "hint": "Apply index laws: $5^{6 + 4 - 7}$.",
        "workedSolution": "$$(5^6 \\times 5^4) \\div 5^7 = 5^{6+4-7} = 5^3$$.",
        "points": 1
    },
    {
        "id": "q06",
        "prompt": "How many lines of symmetry does an equilateral triangle have?",
        "options": [
            "1",
            "2",
            "3",
            "4"
        ],
        "correctAnswer": "3",
        "hint": "An equilateral triangle has three equal sides and three equal angles.",
        "workedSolution": "A regular 3-sided polygon (equilateral triangle) has exactly 3 axes of symmetry.",
        "points": 1
    },
    {
        "id": "q07",
        "prompt": "Solve the equation: $$12 - \\frac{x + 4}{3} = 9$$.",
        "options": [
            "7",
            "5",
            "-5",
            "13"
        ],
        "correctAnswer": "5",
        "hint": "Subtract 9 from 12 and multiply both sides by 3.",
        "workedSolution": "$$12 - 9 = \\frac{x + 4}{3} \\implies 3 = \\frac{x + 4}{3} \\implies x + 4 = 9 \\implies x = 5$$.",
        "points": 1
    },
    {
        "id": "q08",
        "prompt": "Factorize completely: $$my + 3yt - 5m - 15t$$.",
        "options": [
            "(m - 3t)(y + 5)",
            "(m + 3t)(y - 5)",
            "(m + 3t)(y + 5)",
            "(m - 5)(y - 3t)"
        ],
        "correctAnswer": "(m + 3t)(y - 5)",
        "hint": "Group terms into pairs: $y(m + 3t) - 5(m + 3t)$.",
        "workedSolution": "$$y(m + 3t) - 5(m + 3t) = (m + 3t)(y - 5)$$.",
        "points": 1
    },
    {
        "id": "q09",
        "prompt": "There are 15 boys and 25 girls in a school choir. What fraction of the choir members are boys?",
        "options": [
            "5/8",
            "3/5",
            "3/8",
            "1/3"
        ],
        "correctAnswer": "3/8",
        "hint": "Total choir members $= 15 + 25 = 40$. Simplify $\\frac{15}{40}$.",
        "workedSolution": "$$\\frac{15}{15 + 25} = \\frac{15}{40} = \\frac{3}{8}$$.",
        "points": 1
    },
    {
        "id": "q10",
        "prompt": "Express 35% as a common fraction in its lowest terms.",
        "options": [
            "7/20",
            "7/10",
            "3/20",
            "7/50"
        ],
        "correctAnswer": "7/20",
        "hint": "Divide 35 by 100 and cancel common factor 5.",
        "workedSolution": "$$\\frac{35}{100} = \\frac{7}{20}$$.",
        "points": 1
    },
    {
        "id": "q11",
        "prompt": "Make $m$ the subject of the relation: $$mx - m = x^2$$.",
        "options": [
            "m = x² / (x + 1)",
            "m = x² / (x - 1)",
            "m = (x - 1) / x²",
            "m = x²(x - 1)"
        ],
        "correctAnswer": "m = x² / (x - 1)",
        "hint": "Factor out $m$ on the left-hand side: $m(x - 1) = x^2$.",
        "workedSolution": "$$m(x - 1) = x^2 \\implies m = \\frac{x^2}{x - 1}$$.",
        "points": 1
    },
    {
        "id": "q12",
        "prompt": "The mean of the numbers $6, 3x, 5,$ and $4$ is 6. Find the value of $x$.",
        "options": [
            "2",
            "4",
            "3",
            "5"
        ],
        "correctAnswer": "3",
        "hint": "Sum of the four numbers is $4 \\times 6 = 24$.",
        "workedSolution": "$$6 + 3x + 5 + 4 = 24 \\implies 3x + 15 = 24 \\implies 3x = 9 \\implies x = 3$$.",
        "points": 1
    },
    {
        "id": "q13",
        "prompt": "Find the rule of the linear mapping below:<br/><br/>| $x$ | 1 | 2 | 3 | 4 | 5 |<br/>| :--- | :---: | :---: | :---: | :---: | :---: |<br/>| $y$ | 4 | 1 | -2 | -5 | -8 |",
        "options": [
            "y = -3x + 4",
            "y = 3x - 2",
            "y = -3x + 7",
            "y = -2x + 6"
        ],
        "correctAnswer": "y = -3x + 7",
        "hint": "Common difference is $-3$. When $x = 1$, $y = -3(1) + 7 = 4$.",
        "workedSolution": "$$\\text{Gradient } m = 1 - 4 = -3$$\n$$y = -3x + c \\implies 4 = -3(1) + c \\implies c = 7 \\implies y = -3x + 7$$.",
        "points": 1
    },
    {
        "id": "q14",
        "prompt": "Two adjacent sides of a parallelogram are $5.4\\text{ m}$ and $6.6\\text{ m}$ long. Find its perimeter.",
        "options": [
            "12.0 m",
            "35.6 m",
            "48.0 m",
            "24.0 m"
        ],
        "correctAnswer": "24.0 m",
        "hint": "Perimeter $= 2(a + b)$.",
        "workedSolution": "$$\\text{Perimeter} = 2(5.4 + 6.6) = 2(12.0) = 24.0\\text{ m}$$.",
        "points": 1
    },
    {
        "id": "q15",
        "prompt": "A water reservoir in the form of a cuboid has length $5\\text{ m}$ and breadth $3\\text{ m}$. If the volume is $45\\text{ m}^3$, find the height of the reservoir.",
        "options": [
            "2.5 m",
            "3.5 m",
            "4.0 m",
            "3.0 m"
        ],
        "correctAnswer": "3.0 m",
        "hint": "$$\\text{Volume} = l \\times b \\times h$$.",
        "workedSolution": "$$45 = 5 \\times 3 \\times h = 15h \\implies h = \\frac{45}{15} = 3.0\\text{ m}$$.",
        "points": 1
    },
    {
        "id": "q16",
        "prompt": "If the bearing of Town $P$ from Town $Q$ is $250^\\circ$, find the bearing of Town $Q$ from Town $P$.",
        "options": [
            "050°",
            "110°",
            "070°",
            "290°"
        ],
        "correctAnswer": "070°",
        "hint": "For bearings greater than $180^\\circ$, subtract $180^\\circ$.",
        "workedSolution": "$$\\text{Back bearing} = 250^\\circ - 180^\\circ = 070^\\circ$$.",
        "points": 1
    },
    {
        "id": "q17",
        "prompt": "Find the truth set of the inequality: $$3y + 4 < 5y - 6$$.",
        "options": [
            "{y : y < 5}",
            "{y : y > 1}",
            "{y : y > 5}",
            "{y : y < 1}"
        ],
        "correctAnswer": "{y : y > 5}",
        "hint": "Rearrange terms: $4 + 6 < 5y - 3y$.",
        "workedSolution": "$$10 < 2y \\implies 2y > 10 \\implies y > 5$$\n$$\\text{Truth set} = \\{y : y > 5\\}$$.",
        "points": 1
    },
    {
        "id": "q18",
        "prompt": "Find the gradient of the straight line which passes through the points $(-2, 5)$ and $(4, -1)$.",
        "options": [
            "1",
            "-2",
            "2",
            "-1"
        ],
        "correctAnswer": "-1",
        "hint": "$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$.",
        "workedSolution": "$$m = \\frac{-1 - 5}{4 - (-2)} = \\frac{-6}{6} = -1$$.",
        "points": 1
    },
    {
        "id": "q19",
        "prompt": "If $5 : 7 = k : 42$, find the value of $k$.",
        "options": [
            "25",
            "30",
            "35",
            "36"
        ],
        "correctAnswer": "30",
        "hint": "$$\\frac{5}{7} = \\frac{k}{42}$$.",
        "workedSolution": "$$k = \\frac{5 \\times 42}{7} = 5 \\times 6 = 30$$.",
        "points": 1
    },
    {
        "id": "q20",
        "prompt": "In the diagram below, $|PQ| = |PS|$ and $|QS| = |SR|$. If $\\angle QRS = 40^\\circ$, find the measure of $\\angle PQS$:<br/><svg viewBox='0 0 360 210' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><polygon points='40,40 160,180 320,30' fill='#eff6ff' stroke='#1e293b' stroke-width='2'/><line x1='160' y1='180' x2='190' y2='35' stroke='#2563eb' stroke-width='2'/><line x1='95' y1='105' x2='105' y2='115' stroke='#dc2626' stroke-width='1.8'/><line x1='99' y1='101' x2='109' y2='111' stroke='#dc2626' stroke-width='1.8'/><line x1='110' y1='33' x2='110' y2='45' stroke='#dc2626' stroke-width='1.8'/><line x1='115' y1='33' x2='115' y2='45' stroke='#dc2626' stroke-width='1.8'/><line x1='172' y1='105' x2='182' y2='108' stroke='#16a34a' stroke-width='1.8'/><line x1='250' y1='28' x2='250' y2='40' stroke='#16a34a' stroke-width='1.8'/><path d='M 285 32 A 35 35 0 0 1 292 68' fill='none' stroke='#d97706' stroke-width='1.8'/><text x='270' y='60' font-size='12' font-weight='bold' fill='#d97706'>40°</text><text x='25' y='42' font-size='13' font-weight='bold' fill='#0f172a'>P</text><text x='155' y='200' font-size='13' font-weight='bold' fill='#0f172a'>Q</text><text x='330' y='32' font-size='13' font-weight='bold' fill='#0f172a'>R</text><text x='190' y='25' font-size='13' font-weight='bold' fill='#0f172a'>S</text><text x='180' y='195' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>",
        "options": [
            "40°",
            "60°",
            "70°",
            "50°"
        ],
        "correctAnswer": "50°",
        "hint": "$\\triangle QSR$ is isosceles with base angles equal to $40^\\circ$. Exterior angle $\\angle PSQ = 40^\\circ + 40^\\circ = 80^\\circ$. In isosceles $\\triangle PQS$, base angles at $Q$ and $S$ are equal.",
        "workedSolution": "In $\\triangle QSR$, $\\vert{}QS\\vert{} = \\vert{}SR\\vert{} \\implies \\angle SQR = \\angle SRQ = 40^\\circ$.\nExterior angle $\\angle PSQ = 40^\\circ + 40^\\circ = 80^\\circ$.\nIn $\\triangle PQS$, $\\vert{}PQ\\vert{} = \\vert{}PS\\vert{} \\implies \\angle PQS = \\angle PSQ = 50^\\circ$ (or apex angle $P = 180^\\circ - 2(50^\\circ) = 80^\\circ$).\nThus, $\\angle PQS = 50^\\circ$.",
        "points": 1
    },
    {
        "id": "q21",
        "prompt": "A cyclist travels at a constant speed of $12\\text{ km/h}$. How long will it take him to cover a distance of $18\\text{ km}$?",
        "options": [
            "1 1/4 hrs",
            "1 1/2 hrs",
            "1 3/4 hrs",
            "2 hrs"
        ],
        "correctAnswer": "1 1/2 hrs",
        "hint": "$$\\text{Time} = \\frac{\\text{Distance}}{\\text{Speed}} = \\frac{18}{12}$$.",
        "workedSolution": "$$\\text{Time} = \\frac{18}{12} = \\frac{3}{2} = 1\\frac{1}{2}\\text{ hours}$$.",
        "points": 1
    },
    {
        "id": "q22",
        "prompt": "A number is selected at random from the set: $\\{15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25\\}$. Find the probability that the selected number is a prime number.",
        "options": [
            "2/11",
            "4/11",
            "5/11",
            "3/11"
        ],
        "correctAnswer": "3/11",
        "hint": "Count total items (11) and list the prime numbers in this range.",
        "workedSolution": "Total numbers $= 11$. Prime numbers in the set are $\\{17, 19, 23\\}$ (3 primes).\n$$P(\\text{prime}) = \\frac{3}{11}$$.",
        "points": 1
    },
    {
        "id": "q23",
        "prompt": "Express $\\frac{14}{25}$ as a decimal fraction.",
        "options": [
            "0.056",
            "0.54",
            "0.48",
            "0.56"
        ],
        "correctAnswer": "0.56",
        "hint": "Multiply numerator and denominator by 4 to get a denominator of 100.",
        "workedSolution": "$$\\frac{14 \\times 4}{25 \\times 4} = \\frac{56}{100} = 0.56$$.",
        "points": 1
    },
    {
        "id": "q24",
        "prompt": "Find the diameter of a circular pond whose circumference is $132\\text{ cm}$. [Take $\\pi = \\frac{22}{7}$]",
        "options": [
            "21 cm",
            "42 cm",
            "28 cm",
            "84 cm"
        ],
        "correctAnswer": "42 cm",
        "hint": "$$C = \\pi d \\implies d = \\frac{C}{\\pi}$$.",
        "workedSolution": "$$d = \\frac{132}{\\frac{22}{7}} = 132 \\times \\frac{7}{22} = 6 \\times 7 = 42\\text{ cm}$$.",
        "points": 1
    },
    {
        "id": "q25",
        "prompt": "When fifteen is subtracted from four times a certain number and the result is divided by 3, the answer is 19. Find the number.",
        "options": [
            "16",
            "18",
            "21",
            "24"
        ],
        "correctAnswer": "18",
        "hint": "Set up the equation: $\\frac{4x - 15}{3} = 19$.",
        "workedSolution": "$$4x - 15 = 3 \\times 19 = 57 \\implies 4x = 57 + 15 = 72 \\implies x = 18$$.",
        "points": 1
    },
    {
        "id": "q26",
        "prompt": "In the diagram below, line $MN$ is parallel to line $TU$. Find the value of angle $x^\\circ$:<br/><svg viewBox='0 0 360 200' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><line x1='20' y1='70' x2='340' y2='70' stroke='#1e293b' stroke-width='2'/><polygon points='120,67 130,70 120,73' fill='#1e293b'/><text x='25' y='63' font-size='12' font-weight='bold' fill='#0f172a'>M</text><text x='330' y='63' font-size='12' font-weight='bold' fill='#0f172a'>N</text><line x1='100' y1='170' x2='340' y2='170' stroke='#1e293b' stroke-width='2'/><polygon points='200,167 210,170 200,173' fill='#1e293b'/><text x='90' y='175' font-size='12' font-weight='bold' fill='#0f172a'>T</text><text x='330' y='165' font-size='12' font-weight='bold' fill='#0f172a'>U</text><line x1='100' y1='170' x2='290' y2='15' stroke='#2563eb' stroke-width='2.5'/><text x='295' y='22' font-size='12' font-weight='bold' fill='#0f172a'>S</text><text x='225' y='88' font-size='12' font-weight='bold' fill='#0f172a'>O</text><path d='M 185 70 A 35 35 0 0 1 245 35' fill='none' stroke='#dc2626' stroke-width='1.8'/><text x='195' y='55' font-size='11' font-weight='bold' fill='#dc2626'>125°</text><path d='M 130 170 A 30 30 0 0 1 120 152' fill='none' stroke='#16a34a' stroke-width='1.8'/><text x='135' y='160' font-size='11' font-weight='bold' fill='#16a34a'>x°</text><text x='180' y='192' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>",
        "options": [
            "55°",
            "65°",
            "45°",
            "125°"
        ],
        "correctAnswer": "55°",
        "hint": "Interior adjacent angle to $125^\\circ$ on straight line $MN$ is $180^\\circ - 125^\\circ = 55^\\circ$. Angle $x$ is alternate to this angle.",
        "workedSolution": "$$\\angle NOT = 180^\\circ - 125^\\circ = 55^\\circ$$\nSince $MN \\parallel TU$, alternate interior angle $x = \\angle NOT = 55^\\circ$.",
        "points": 1
    },
    {
        "id": "q27",
        "prompt": "Given column vectors $\\mathbf{p} = \\begin{pmatrix} -4 \\\\ -6 \\end{pmatrix}$ and $\\mathbf{q} = \\begin{pmatrix} 4 \\\\ -6 \\end{pmatrix}$, find $\\mathbf{p} + \\mathbf{q}$.",
        "options": [
            "(0, -12)",
            "(0, 0)",
            "(-8, 0)",
            "(0, 12)"
        ],
        "correctAnswer": "(0, -12)",
        "hint": "Add corresponding x and y components.",
        "workedSolution": "$$\\begin{pmatrix} -4 + 4 \\\\ -6 + (-6) \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ -12 \\end{pmatrix}$$.",
        "points": 1
    },
    {
        "id": "q28",
        "prompt": "A market trader sold 120 mangoes at 4 for GH¢ 1.20. How much did she receive from selling all the mangoes?",
        "options": [
            "GH¢ 30.00",
            "GH¢ 48.00",
            "GH¢ 40.00",
            "GH¢ 36.00"
        ],
        "correctAnswer": "GH¢ 36.00",
        "hint": "Find the number of 4-mango lots ($120 \\div 4 = 30$) and multiply by GH¢ 1.20.",
        "workedSolution": "$$\\text{Lots} = \\frac{120}{4} = 30$$\n$$\\text{Total} = 30 \\times 1.20 = \\text{GH¢ } 36.00$$.",
        "points": 1
    },
    {
        "id": "q29",
        "prompt": "Express 108 as a product of prime factors in index form.",
        "options": [
            "2² × 3³",
            "2³ × 3²",
            "2² × 3²",
            "2⁴ × 3"
        ],
        "correctAnswer": "2² × 3³",
        "hint": "$$108 = 4 \\times 27$$.",
        "workedSolution": "$$108 = 4 \\times 27 = 2^2 \\times 3^3$$.",
        "points": 1
    },
    {
        "id": "q30",
        "prompt": "Simplify: $4x \\times 18xy$.",
        "options": [
            "72x²y",
            "72xy²",
            "22x²y",
            "72xy"
        ],
        "correctAnswer": "72x²y",
        "hint": "Multiply numbers ($4 \\times 18$) and combine like variables ($x \\times x$).",
        "workedSolution": "$$(4 \\times 18) \\times (x \\times x) \\times y = 72x^2y$$.",
        "points": 1
    },
    {
        "id": "q31",
        "prompt": "Simplify: $\\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix} + \\begin{pmatrix} -2 \\\\ 6 \\end{pmatrix}$.",
        "options": [
            "(-1, 2)",
            "(-5, 2)",
            "(-5, 10)",
            "(5, 10)"
        ],
        "correctAnswer": "(-5, 10)",
        "hint": "$$\\begin{pmatrix} -3 + (-2) \\\\ 4 + 6 \\end{pmatrix}$$.",
        "workedSolution": "$$\\begin{pmatrix} -3 - 2 \\\\ 4 + 6 \\end{pmatrix} = \\begin{pmatrix} -5 \\\\ 10 \\end{pmatrix}$$.",
        "points": 1
    },
    {
        "id": "q32",
        "prompt": "Multiply 314 by 24.",
        "options": [
            "7436",
            "7526",
            "7536",
            "6536"
        ],
        "correctAnswer": "7536",
        "hint": "$$314 \\times 20 + 314 \\times 4$$.",
        "workedSolution": "$$314 \\times 24 = 314 \\times (20 + 4) = 6280 + 1256 = 7536$$.",
        "points": 1
    },
    {
        "id": "q33",
        "prompt": "Evaluate: $$(0.08 \\times 0.03) \\div 12$$.",
        "options": [
            "0.0002",
            "0.002",
            "0.02",
            "0.00002"
        ],
        "correctAnswer": "0.0002",
        "hint": "$$0.08 \\times 0.03 = 0.0024$$. Divide by 12.",
        "workedSolution": "$$\\frac{0.0024}{12} = 0.0002$$.",
        "points": 1
    },
    {
        "id": "q34",
        "prompt": "In a class of 27 pupils, the girls were 5 more than the boys. How many boys were in the class?",
        "options": [
            "16",
            "11",
            "10",
            "12"
        ],
        "correctAnswer": "11",
        "hint": "Let boys be $b$. Then $b + (b + 5) = 27$.",
        "workedSolution": "$$2b + 5 = 27 \\implies 2b = 22 \\implies b = 11\\text{ boys}$$.",
        "points": 1
    },
    {
        "id": "q35",
        "prompt": "Express 45 minutes as a percentage of 2 hours 30 minutes.",
        "options": [
            "25%",
            "35%",
            "30%",
            "20%"
        ],
        "correctAnswer": "30%",
        "hint": "$2\\text{ hours } 30\\text{ minutes} = 150\\text{ minutes}$. Calculate $\\frac{45}{150} \\times 100\\%$.",
        "workedSolution": "$$\\frac{45}{150} \\times 100\\% = \\frac{3}{10} \\times 100\\% = 30\\%$$.",
        "points": 1
    },
    {
        "id": "q36",
        "prompt": "Find the Least Common Multiple (LCM) of 3, 4, and 6.",
        "options": [
            "12",
            "24",
            "18",
            "6"
        ],
        "correctAnswer": "12",
        "hint": "Find the smallest positive integer that is divisible by 3, 4, and 6.",
        "workedSolution": "$$3 = 3, \\quad 4 = 2^2, \\quad 6 = 2 \\times 3$$\n$$\\text{LCM} = 2^2 \\times 3 = 12$$.",
        "points": 1
    },
    {
        "id": "q37",
        "prompt": "The simple interest on GH¢ 600.00 for 3 years is GH¢ 72.00. Find the annual rate of interest.",
        "options": [
            "3.5%",
            "4.0%",
            "4.5%",
            "5.0%"
        ],
        "correctAnswer": "4.0%",
        "hint": "$$R = \\frac{100 \\times I}{P \\times T}$$.",
        "workedSolution": "$$R = \\frac{100 \\times 72}{600 \\times 3} = \\frac{72}{18} = 4.0\\%$$.",
        "points": 1
    },
    {
        "id": "q38",
        "prompt": "Find the median of the following set of marks: $42, 65, 36, 40, 72,$ and $80$.",
        "options": [
            "53.5",
            "52.0",
            "55.0",
            "56.5"
        ],
        "correctAnswer": "53.5",
        "hint": "Arrange in ascending order and average the 3rd and 4th values.",
        "workedSolution": "Ordered set: $36, 40, 42, 65, 72, 80$.\n$$\\text{Median} = \\frac{42 + 65}{2} = \\frac{107}{2} = 53.5$$.",
        "points": 1
    },
    {
        "id": "q39",
        "prompt": "From the Venn diagram below, identify the set $M \\cap N$:<br/><svg viewBox='0 0 340 220' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><rect x='20' y='20' width='300' height='180' rx='4' fill='none' stroke='#334155' stroke-width='2'/><text x='305' y='40' font-size='13' font-weight='bold' fill='#0f172a'>U</text><circle cx='125' cy='110' r='65' fill='#eff6ff' stroke='#1d4ed8' stroke-width='2'/><text x='75' y='55' font-size='13' font-weight='bold' fill='#1d4ed8'>M</text><circle cx='215' cy='110' r='65' fill='#f0fdf4' stroke='#16a34a' stroke-width='2'/><text x='265' y='55' font-size='13' font-weight='bold' fill='#16a34a'>N</text><text x='95' y='85' font-size='12' font-weight='bold' fill='#1e293b'>4</text><text x='80' y='120' font-size='12' font-weight='bold' fill='#1e293b'>6</text><text x='105' y='150' font-size='12' font-weight='bold' fill='#1e293b'>9</text><text x='170' y='95' font-size='12' font-weight='bold' fill='#1e293b'>3</text><text x='170' y='135' font-size='12' font-weight='bold' fill='#1e293b'>8</text><text x='235' y='80' font-size='12' font-weight='bold' fill='#1e293b'>1</text><text x='255' y='110' font-size='12' font-weight='bold' fill='#1e293b'>2</text><text x='230' y='145' font-size='12' font-weight='bold' fill='#1e293b'>5</text><text x='250' y='160' font-size='12' font-weight='bold' fill='#1e293b'>7</text></svg>",
        "options": [
            "{4, 6, 9}",
            "{1, 2, 5, 7}",
            "{3}",
            "{3, 8}"
        ],
        "correctAnswer": "{3, 8}",
        "hint": "The intersection contains elements located inside the overlap of both circles.",
        "workedSolution": "The elements inside the shared overlapping region are $\\{3, 8\\}$.",
        "points": 1
    },
    {
        "id": "q40",
        "prompt": "Using the Venn diagram from Question 39, find the cardinality $n(N)$:<br/><svg viewBox='0 0 340 220' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><rect x='20' y='20' width='300' height='180' rx='4' fill='none' stroke='#334155' stroke-width='2'/><text x='305' y='40' font-size='13' font-weight='bold' fill='#0f172a'>U</text><circle cx='125' cy='110' r='65' fill='#eff6ff' stroke='#1d4ed8' stroke-width='2'/><text x='75' y='55' font-size='13' font-weight='bold' fill='#1d4ed8'>M</text><circle cx='215' cy='110' r='65' fill='#f0fdf4' stroke='#16a34a' stroke-width='2'/><text x='265' y='55' font-size='13' font-weight='bold' fill='#16a34a'>N</text><text x='95' y='85' font-size='12' font-weight='bold' fill='#1e293b'>4</text><text x='80' y='120' font-size='12' font-weight='bold' fill='#1e293b'>6</text><text x='105' y='150' font-size='12' font-weight='bold' fill='#1e293b'>9</text><text x='170' y='95' font-size='12' font-weight='bold' fill='#1e293b'>3</text><text x='170' y='135' font-size='12' font-weight='bold' fill='#1e293b'>8</text><text x='235' y='80' font-size='12' font-weight='bold' fill='#1e293b'>1</text><text x='255' y='110' font-size='12' font-weight='bold' fill='#1e293b'>2</text><text x='230' y='145' font-size='12' font-weight='bold' fill='#1e293b'>5</text><text x='250' y='160' font-size='12' font-weight='bold' fill='#1e293b'>7</text></svg>",
        "options": [
            "6",
            "4",
            "2",
            "5"
        ],
        "correctAnswer": "6",
        "hint": "Count all elements within circle $N$ (both $N$-only and the intersection).",
        "workedSolution": "$$N = \\{1, 2, 3, 5, 7, 8\\} \\implies n(N) = 6$$.",
        "points": 1
    }
]
};
