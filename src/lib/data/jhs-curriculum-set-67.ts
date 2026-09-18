import { CurriculumQuestionSet } from '../global-curriculum-types';

export const SET_JHS_MASTERY_SERIES_67: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-67",
  title: "Junior Core Mathematics - Structured Problem-Solving Series (Set 67)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Structured Problem Solving (2019 BECE Variant)",
  variantType: "past_paper_variant",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
        "id": "q01",
        "number": 1,
        "title": "Finite Sets, Least Common Multiple & Algebraic Ratio",
        "totalMarks": 15,
        "points": 15,
        "format": "structured_essay",
        "prompt": "Answer all parts of this question:",
        "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
        "parts": [
            {
                "partId": "(a)",
                "prompt": "Given that $X = \\{\\text{whole numbers from } 5 \\text{ to } 15\\}$ and $Y = \\{\\text{multiples of } 3 \\text{ between } 4 \\text{ and } 22\\}$, find $X \\cap Y$.",
                "points": 5,
                "workedSolution": "List the elements of each set:\n$$X = \\{5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15\\}$$\n$$Y = \\{6, 9, 12, 15, 18, 21\\}$$\nThe common elements are:\n$$X \\cap Y = \\{6, 9, 12, 15\\}$$."
            },
            {
                "partId": "(b)",
                "prompt": "Find the Least Common Multiple (LCM) of 4, 6, and 10.",
                "points": 5,
                "workedSolution": "Express each number as a product of prime factors:\n$$4 = 2^2, \\quad 6 = 2 \\times 3, \\quad 10 = 2 \\times 5$$\nTake the product of the highest powers of all prime factors:\n$$\\text{LCM} = 2^2 \\times 3 \\times 5 = 4 \\times 3 \\times 5 = 60$$."
            },
            {
                "partId": "(c)",
                "prompt": "If $$\\frac{m + 3n}{m} = \\frac{8}{5}$$, find the value of $$\\frac{n}{m}$$.",
                "points": 5,
                "workedSolution": "Cross-multiply:\n$$5(m + 3n) = 8m$$\n$$5m + 15n = 8m$$\n$$15n = 8m - 5m = 3m$$\nDivide both sides by $15m$:\n$$\\frac{n}{m} = \\frac{3}{15} = \\frac{1}{5}$$."
            }
        ]
    },
    {
        "id": "q02",
        "number": 2,
        "title": "Linear Fractional Equations, Enrolment Ratios & Monomial Products",
        "totalMarks": 15,
        "points": 15,
        "format": "structured_essay",
        "prompt": "Answer all parts of this question:",
        "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
        "parts": [
            {
                "partId": "(a)",
                "prompt": "Solve the equation: $$\\frac{3x + 4}{4} + \\frac{x - 2}{3} = -1$$.",
                "points": 6,
                "workedSolution": "Multiply through by the LCM of denominators (12):\n$$12\\left(\\frac{3x + 4}{4}\\right) + 12\\left(\\frac{x - 2}{3}\\right) = 12(-1)$$\n$$3(3x + 4) + 4(x - 2) = -12$$\n$$9x + 12 + 4x - 8 = -12$$\n$$13x + 4 = -12$$\n$$13x = -12 - 4 = -16 \\implies x = -\\frac{16}{13} \\quad \\left(\\text{or } -1\\frac{3}{13}\\right)$$."
            },
            {
                "partId": "(b)",
                "prompt": "The ratio of boys to girls in a school is $11 : 20$. If there are 110 boys:\n(i) How many girls are in the school?\n(ii) What is the total enrolment of boys and girls in the school?",
                "points": 5,
                "workedSolution": "(i) Let 1 ratio part be $k$:\n$$11k = 110 \\implies k = 10$$\n$$\\text{Number of girls} = 20 \\times 10 = 200\\text{ girls}$$\n\n(ii) $$\\text{Total enrolment} = 110 + 200 = 310\\text{ students}$$.\n*(Or $(11 + 20) \\times 10 = 31 \\times 10 = 310$)*."
            },
            {
                "partId": "(c)",
                "prompt": "Simplify: $$\\left(6a^2b^3\\right)\\left(\\frac{2}{3}ab^4\\right)$$.",
                "points": 4,
                "workedSolution": "Multiply numerical coefficients and apply the product law of indices:\n$$\\left(6 \\times \\frac{2}{3}\\right) \\times (a^2 \\times a) \\times (b^3 \\times b^4)$$\n$$= 4 \\times a^{2+1} \\times b^{3+4}$$\n$$= 4a^3b^7$$."
            }
        ]
    },
    {
        "id": "q03",
        "number": 3,
        "title": "Venn Diagram Examination Passes & Binomial Grouping",
        "totalMarks": 15,
        "points": 15,
        "format": "structured_essay",
        "prompt": "Answer all parts of this question:",
        "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
        "parts": [
            {
                "partId": "(a)",
                "prompt": "In an examination, 70 candidates passed Social Studies or English Language. If 20 passed both subjects and 10 more candidates passed English Language than Social Studies, find:\n(i) the number of candidates who passed each subject;\n(ii) the probability that a candidate selected at random passed exactly one subject.",
                "points": 10,
                "workedSolution": "(i) Let the number who passed Social Studies only be $y$.\nThen the number who passed English Language only is $y + 10$.\n$$\\text{Total} = (\\text{Social Studies only}) + (\\text{Both}) + (\\text{English only})$$\n$$y + 20 + (y + 10) = 70$$\n$$2y + 30 = 70 \\implies 2y = 40 \\implies y = 20$$\n$$\\text{Passed Social Studies} = 20 + 20 = 40\\text{ candidates}$$\n$$\\text{Passed English Language} = (20 + 10) + 20 = 30 + 20 = 50\\text{ candidates}$$\n\n(ii) Candidates passing exactly one subject:\n$$20 + 30 = 50\\text{ candidates}$$\n$$P(\\text{exactly one subject}) = \\frac{50}{70} = \\frac{5}{7}$$."
            },
            {
                "partId": "(b)",
                "prompt": "Factorize completely: $$mn + 5m + 4n + 20$$.",
                "points": 5,
                "workedSolution": "Group into pairs:\n$$= m(n + 5) + 4(n + 5)$$\n$$= (m + 4)(n + 5)$$."
            }
        ]
    },
    {
        "id": "q04",
        "number": 4,
        "title": "Percentages, Geometry Triangle Angles, Operations & Vectors",
        "totalMarks": 15,
        "points": 15,
        "format": "structured_essay",
        "prompt": "Answer all parts of this question:",
        "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
        "parts": [
            {
                "partId": "(a)",
                "prompt": "Express 225% as a common fraction in its lowest terms.",
                "points": 3,
                "workedSolution": "$$225\\% = \\frac{225}{100}$$\nDivide numerator and denominator by 25:\n$$= \\frac{9}{4} = 2\\frac{1}{4}$$."
            },
            {
                "partId": "(b)",
                "prompt": "In the diagram below, the interior apex angle of the triangle is $102^\\circ$. Find the value of $x$:<br/><svg viewBox='0 0 340 210' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><line x1='25' y1='170' x2='315' y2='170' stroke='#1e293b' stroke-width='2'/><polygon points='85,170 170,45 255,170' fill='#eff6ff' stroke='#1e40af' stroke-width='2.5'/><path d='M 152 62 A 25 25 0 0 0 188 62' fill='none' stroke='#dc2626' stroke-width='1.8'/><text x='170' y='82' font-size='11' font-weight='bold' fill='#dc2626' text-anchor='middle'>102°</text><path d='M 60 170 A 25 25 0 0 1 73 148' fill='none' stroke='#16a34a' stroke-width='1.8'/><text x='58' y='145' font-size='12' font-weight='bold' fill='#16a34a'>4x°</text><path d='M 268 149 A 25 25 0 0 1 280 170' fill='none' stroke='#d97706' stroke-width='1.8'/><text x='275' y='145' font-size='12' font-weight='bold' fill='#d97706'>2x°</text><text x='170' y='198' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>",
                "points": 5,
                "workedSolution": "The interior base angles on the straight lines are:\n$$\\text{Left interior angle} = 180^\\circ - 4x^\\circ$$\n$$\\text{Right interior angle} = 180^\\circ - 2x^\\circ$$\nThe three interior angles of a triangle sum to $180^\\circ$:\n$$(180 - 4x) + (180 - 2x) + 102 = 180$$\n$$462 - 6x = 180$$\n$$6x = 462 - 180 = 282$$\n$$x = \\frac{282}{6} = 47$$\nThus, $x = 47$."
            },
            {
                "partId": "(c)",
                "prompt": "Simplify: $$3 \\div \\left(\\frac{10}{27} \\div \\frac{5}{9}\\right)$$.",
                "points": 4,
                "workedSolution": "Evaluate the expression inside the brackets first:\n$$\\frac{10}{27} \\div \\frac{5}{9} = \\frac{10}{27} \\times \\frac{9}{5} = \\frac{2}{3}$$\nPerform the outer division:\n$$3 \\div \\frac{2}{3} = 3 \\times \\frac{3}{2} = \\frac{9}{2} = 4\\frac{1}{2}$$."
            },
            {
                "partId": "(d)",
                "prompt": "Given vectors $\\mathbf{u} = \\begin{pmatrix} 6 \\\\ -2 \\end{pmatrix}$ and $\\mathbf{v} = \\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix}$, find $(\\mathbf{u} + \\mathbf{v})$.",
                "points": 3,
                "workedSolution": "$$\\mathbf{u} + \\mathbf{v} = \\begin{pmatrix} 6 \\\\ -2 \\end{pmatrix} + \\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix} = \\begin{pmatrix} 6 + 3 \\\\ -2 + (-4) \\end{pmatrix} = \\begin{pmatrix} 9 \\\\ -6 \\end{pmatrix}$$."
            }
        ]
    },
    {
        "id": "q05",
        "number": 5,
        "title": "Linear Relation Graphing, Slope Derivation & Powers of Two",
        "totalMarks": 15,
        "points": 15,
        "format": "structured_essay",
        "prompt": "Answer all parts of this question:",
        "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
        "parts": [
            {
                "partId": "(a)",
                "prompt": "The table below represents a linear relation between $x$ and $y$:\n\n| x | 1 | 2 | 3 | 4 | 5 |\n| :---: | :---: | :---: | :---: | :---: | :---: |\n| y | 1 | 3 | 5 | 7 | 9 |\n\n(i) Using a scale of 2 cm to 1 unit on the x-axis and 2 cm to 2 units on the y-axis, plot the points $(x, y)$ on a graph sheet for $1 \\le x \\le 5$ and $0 \\le y \\le 10$.<br/>\n(ii) Join the plotted points with a straight line.<br/>\n(iii) From your graph:<br/><svg viewBox='0 0 340 320' width='100%' height='270' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><pattern id='grid2019P2' width='22' height='22' patternUnits='userSpaceOnUse'><path d='M 22 0 L 0 0 0 22' fill='none' stroke='#e2e8f0' stroke-width='0.9'/></pattern></defs><rect width='100%' height='100%' fill='url(#grid2019P2)'/><line x1='50' y1='260' x2='320' y2='260' stroke='#334155' stroke-width='2'/><polygon points='320,257 328,260 320,263' fill='#334155'/><text x='325' y='278' font-size='11' font-weight='bold' fill='#334155'>x</text><line x1='50' y1='260' x2='50' y2='25' stroke='#334155' stroke-width='2'/><polygon points='47,25 50,17 53,25' fill='#334155'/><text x='25' y='25' font-size='11' font-weight='bold' fill='#334155'>y</text><text x='38' y='275' font-size='10' fill='#64748b'>0</text><text x='95' y='275' font-size='10' fill='#334155' text-anchor='middle'>1</text><text x='140' y='275' font-size='10' fill='#334155' text-anchor='middle'>2</text><text x='185' y='275' font-size='10' fill='#334155' text-anchor='middle'>3</text><text x='230' y='275' font-size='10' fill='#334155' text-anchor='middle'>4</text><text x='275' y='275' font-size='10' fill='#334155' text-anchor='middle'>5</text><text x='38' y='229' font-size='9' fill='#334155' text-anchor='end'>2</text><text x='38' y='194' font-size='9' fill='#334155' text-anchor='end'>4</text><text x='38' y='159' font-size='9' fill='#334155' text-anchor='end'>6</text><text x='38' y='124' font-size='9' fill='#334155' text-anchor='end'>8</text><text x='38' y='89' font-size='9' fill='#334155' text-anchor='end'>10</text><line x1='72' y1='260' x2='295' y2='87' stroke='#2563eb' stroke-width='2.5'/><circle cx='95' cy='242.5' r='3.5' fill='#dc2626'/><circle cx='140' cy='207.5' r='3.5' fill='#dc2626'/><circle cx='185' cy='172.5' r='3.5' fill='#dc2626'/><circle cx='230' cy='137.5' r='3.5' fill='#dc2626'/><circle cx='275' cy='102.5' r='3.5' fill='#dc2626'/><text x='245' y='75' font-size='11' font-weight='bold' fill='#2563eb'>y = 2x - 1</text></svg><br/>Find the gradient of the line and write down the equation of the line.",
                "points": 11,
                "workedSolution": "(i) & (ii) Axes calibrated with given scale. Points $(1, 1), (2, 3), (3, 5), (4, 7), (5, 9)$ plotted accurately and connected by a continuous ruler-drawn straight line.\n\n(iii) Choose two points, e.g., $(1, 1)$ and $(2, 3)$:\n$$\\text{Gradient } m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{3 - 1}{2 - 1} = 2$$\nUsing point-slope form with $(1, 1)$:\n$$y - 1 = 2(x - 1) \\implies y - 1 = 2x - 2 \\implies y = 2x - 1$$\nEquation of the line: $$y = 2x - 1$$."
            },
            {
                "partId": "(b)",
                "prompt": "Simplify: $$16 \\times 8 \\times 4 \\times 2$$, leaving your answer in the form $2^n$.",
                "points": 4,
                "workedSolution": "Express each term as a power of 2:\n$$16 = 2^4, \\quad 8 = 2^3, \\quad 4 = 2^2, \\quad 2 = 2^1$$\nApply the product law of indices:\n$$2^4 \\times 2^3 \\times 2^2 \\times 2^1 = 2^{4+3+2+1} = 2^{10}$$\nThus, $n = 10$, so the answer is $$2^{10}$$."
            }
        ]
    },
    {
        "id": "q06",
        "number": 6,
        "title": "Frequency Distribution Table, Mode, Median & Mean",
        "totalMarks": 15,
        "points": 15,
        "format": "structured_essay",
        "prompt": "Answer all parts of this question:",
        "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
        "parts": [
            {
                "partId": "(a)",
                "prompt": "The scores obtained by 25 pupils in a class test were:\n$$3, 7, 6, 5, 6, 2, 1, 6, 3, 6, 4, 6, 5, 3, 4, 6, 5, 2, 6, 2, 5, 3, 7, 4, 2$$\nConstruct a frequency distribution table for the data.",
                "points": 7,
                "workedSolution": "Tally and count frequency of each unique mark:\n\n| Score ($x$) | Tally | Frequency ($f$) | $fx$ |\n| :---: | :---: | :---: | :---: | :---: | :---: |\n| 1 | | | 1 | 1 |\n| 2 | |||| | 4 | 8 |\n| 3 | |||| | 4 | 12 |\n| 4 | ||| | 3 | 12 |\n| 5 | |||| | 4 | 20 |\n| 6 | |||| || | 7 | 42 |\n| 7 | || | 2 | 14 |\n| **Total** | | **25** | **109** |"
            },
            {
                "partId": "(b)",
                "prompt": "From your frequency distribution table in (a), find the:\n(i) mode of the distribution;\n(ii) median score of the test;\n(iii) mean score of the test, correct to two decimal places.",
                "points": 8,
                "workedSolution": "(i) Mode is the score with the highest frequency ($f = 7$):\n$$\\text{Mode} = 6$$\n\n(ii) For $N = 25$, the median is the 13th score.\nCumulative frequencies: Score 1: 1; Score 2: 5; Score 3: 9; Score 4: 12; Score 5: 16.\nSince the 13th score falls into the group of Score 5:\n$$\\text{Median} = 5$$\n\n(iii) Mean score:\n$$\\text{Mean } (\\bar{x}) = \\frac{\\sum fx}{\\sum f} = \\frac{109}{25} = 4.36$$."
            }
        ]
    }
]
};
