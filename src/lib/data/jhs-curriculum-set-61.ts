import { CurriculumQuestionSet } from '../global-curriculum-types';

export const SET_JHS_MASTERY_SERIES_61: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-61",
  title: "Junior Core Mathematics - Structured Problem-Solving Series (Set 61)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Structured Problem Solving (2020 BECE Variant)",
  variantType: "past_paper_variant",
  totalQuestions: 6,
  version: 1,
  questions: [
    {
        "id": "q01",
        "title": "Question 1: Set Operations, BODMAS & Straight-Line Angles",
        "totalMarks": 15,
        "points": 15,
        "format": "structured_essay",
        "prompt": "Answer all parts of this question:",
        "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
        "parts": [
            {
                "partLabel": "(a)",
                "marks": 5,
                "prompt": "If $M = \\{x : x \\text{ is a prime number between } 1 \\text{ and } 13\\}$ and $N = \\{x : x \\text{ is a factor of } 18\\}$, find:\n(i) $M \\cup N$\n(ii) $M \\cap N$",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "List the elements of both sets:\n$$M = \\{2, 3, 5, 7, 11\\}$$\n$$N = \\{1, 2, 3, 6, 9, 18\\}$$\n\n(i) Union ($M \\cup N$):\nCombine all unique elements:\n$$M \\cup N = \\{1, 2, 3, 5, 6, 7, 9, 11, 18\\}$$\n\n(ii) Intersection ($M \\cap N$):\nCommon elements to both sets:\n$$M \\cap N = \\{2, 3\\}$$.",
                "workedSolution": "List the elements of both sets:\n$$M = \\{2, 3, 5, 7, 11\\}$$\n$$N = \\{1, 2, 3, 6, 9, 18\\}$$\n\n(i) Union ($M \\cup N$):\nCombine all unique elements:\n$$M \\cup N = \\{1, 2, 3, 5, 6, 7, 9, 11, 18\\}$$\n\n(ii) Intersection ($M \\cap N$):\nCommon elements to both sets:\n$$M \\cap N = \\{2, 3\\}$$."
            },
            {
                "partLabel": "(b)",
                "marks": 5,
                "prompt": "Simplify: $$36 \\div 4 + 3 \\times 6 - 15 + 28$$.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Apply BODMAS (Division first, then Multiplication, Addition, and Subtraction):\n$$36 \\div 4 = 9$$\n$$3 \\times 6 = 18$$\nSubstitute back:\n$$= 9 + 18 - 15 + 28$$\n$$= 27 - 15 + 28$$\n$$= 12 + 28 = 40$$.",
                "workedSolution": "Apply BODMAS (Division first, then Multiplication, Addition, and Subtraction):\n$$36 \\div 4 = 9$$\n$$3 \\times 6 = 18$$\nSubstitute back:\n$$= 9 + 18 - 15 + 28$$\n$$= 27 - 15 + 28$$\n$$= 12 + 28 = 40$$."
            },
            {
                "partLabel": "(c)",
                "marks": 5,
                "prompt": "In the diagram below, $x^\\circ$, $y^\\circ$, and $z^\\circ$ are angles on a straight line. If $x : z = 2 : 3$ and $y = 70^\\circ$, find the value of $x$:<br/><svg viewBox='0 0 340 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><line x1='30' y1='140' x2='310' y2='140' stroke='#1e293b' stroke-width='2.5'/><line x1='170' y1='140' x2='90' y2='45' stroke='#2563eb' stroke-width='2.5'/><line x1='170' y1='140' x2='255' y2='50' stroke='#2563eb' stroke-width='2.5'/><path d='M 125 140 A 45 45 0 0 1 135 98' fill='none' stroke='#dc2626' stroke-width='2'/><text x='112' y='122' font-size='12' font-weight='bold' fill='#dc2626'>x°</text><path d='M 140 105 A 45 45 0 0 1 205 102' fill='none' stroke='#16a34a' stroke-width='2'/><text x='170' y='88' font-size='12' font-weight='bold' fill='#16a34a' text-anchor='middle'>y°</text><path d='M 210 106 A 45 45 0 0 1 215 140' fill='none' stroke='#d97706' stroke-width='2'/><text x='225' y='125' font-size='12' font-weight='bold' fill='#d97706'>z°</text><circle cx='170' cy='140' r='3.5' fill='#1e293b'/><text x='170' y='168' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Angles on a straight line sum to $180^\\circ$:\n$$x + y + z = 180$$\nSubstitute $y = 70^\\circ$:\n$$x + 70 + z = 180 \\implies x + z = 110$$\nGiven the ratio $x : z = 2 : 3$, total parts $= 2 + 3 = 5$ parts.\n$$x = \\frac{2}{5} \\times 110 = 2 \\times 22 = 44$$\nThus, $x = 44^\\circ$.",
                "workedSolution": "Angles on a straight line sum to $180^\\circ$:\n$$x + y + z = 180$$\nSubstitute $y = 70^\\circ$:\n$$x + 70 + z = 180 \\implies x + z = 110$$\nGiven the ratio $x : z = 2 : 3$, total parts $= 2 + 3 = 5$ parts.\n$$x = \\frac{2}{5} \\times 110 = 2 \\times 22 = 44$$\nThus, $x = 44^\\circ$."
            }
        ]
    },
    {
        "id": "q02",
        "title": "Question 2: Algebraic Expansion, Linear Relations & Sales Commission",
        "totalMarks": 15,
        "points": 15,
        "format": "structured_essay",
        "prompt": "Answer all parts of this question:",
        "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
        "parts": [
            {
                "partLabel": "(a)",
                "marks": 4,
                "prompt": "Simplify: $$4(5 - xy) + 3(-6 + 2xy)$$.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Expand the brackets:\n$$4(5 - xy) = 20 - 4xy$$\n$$3(-6 + 2xy) = -18 + 6xy$$\nCombine like terms:\n$$= 20 - 18 - 4xy + 6xy$$\n$$= 2 + 2xy$$.",
                "workedSolution": "Expand the brackets:\n$$4(5 - xy) = 20 - 4xy$$\n$$3(-6 + 2xy) = -18 + 6xy$$\nCombine like terms:\n$$= 20 - 18 - 4xy + 6xy$$\n$$= 2 + 2xy$$."
            },
            {
                "partLabel": "(b)",
                "marks": 5,
                "prompt": "The equation of a straight line is given by $4x - 2y - 8 = 0$. Find the:\n(i) gradient of the line;\n(ii) y-intercept of the line.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Rewrite the equation in the gradient-intercept form $y = mx + c$:\n$$4x - 8 = 2y$$\nDivide through by 2:\n$$y = 2x - 4$$\n\n(i) Gradient ($m$) = 2.\n(ii) y-intercept ($c$) = -4 (or coordinate $(0, -4)$).",
                "workedSolution": "Rewrite the equation in the gradient-intercept form $y = mx + c$:\n$$4x - 8 = 2y$$\nDivide through by 2:\n$$y = 2x - 4$$\n\n(i) Gradient ($m$) = 2.\n(ii) y-intercept ($c$) = -4 (or coordinate $(0, -4)$)."
            },
            {
                "partLabel": "(c)",
                "marks": 6,
                "prompt": "Korkor received a commission of 15% on textbooks she sold. In one week, Korkor's commission was GH¢ 450.00.\n(i) How much worth of textbooks did she sell during that week?\n(ii) Find her average daily commission for that 7-day week, correct to two decimal places.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "(i) Let total sales be $T$.\n$$15\\% \\text{ of } T = 450.00$$\n$$0.15 T = 450 \\implies T = \\frac{450}{0.15} = \\frac{45,000}{15} = \\text{GH¢ } 3,000.00$$\n\n(ii) Average daily commission over 7 days:\n$$\\text{Average} = \\frac{450.00}{7} = \\text{GH¢ } 64.2857... \\approx \\text{GH¢ } 64.29$$.",
                "workedSolution": "(i) Let total sales be $T$.\n$$15\\% \\text{ of } T = 450.00$$\n$$0.15 T = 450 \\implies T = \\frac{450}{0.15} = \\frac{45,000}{15} = \\text{GH¢ } 3,000.00$$\n\n(ii) Average daily commission over 7 days:\n$$\\text{Average} = \\frac{450.00}{7} = \\text{GH¢ } 64.2857... \\approx \\text{GH¢ } 64.29$$."
            }
        ]
    },
    {
        "id": "q03",
        "title": "Question 3: Fractions to Percentage, Grouping Factorization & Ratio Word Problem",
        "totalMarks": 15,
        "points": 15,
        "format": "structured_essay",
        "prompt": "Answer all parts of this question:",
        "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
        "parts": [
            {
                "partLabel": "(a)",
                "marks": 5,
                "prompt": "Express $$\\left(\\frac{11}{12} - \\frac{3}{4}\\right)$$ as a percentage.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Evaluate the fraction difference with LCD = 12:\n$$\\frac{11}{12} - \\frac{3}{4} = \\frac{11 - 9}{12} = \\frac{2}{12} = \\frac{1}{6}$$\nConvert to percentage:\n$$\\frac{1}{6} \\times 100\\% = \\frac{50}{3}\\% = 16\\frac{2}{3}\\% \\quad (\\text{or } 16.67\\%)$$.",
                "workedSolution": "Evaluate the fraction difference with LCD = 12:\n$$\\frac{11}{12} - \\frac{3}{4} = \\frac{11 - 9}{12} = \\frac{2}{12} = \\frac{1}{6}$$\nConvert to percentage:\n$$\\frac{1}{6} \\times 100\\% = \\frac{50}{3}\\% = 16\\frac{2}{3}\\% \\quad (\\text{or } 16.67\\%)$$."
            },
            {
                "partLabel": "(b)",
                "marks": 5,
                "prompt": "Factorize completely: $$kx - x - k + 1$$.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Group terms into pairs:\n$$= (kx - x) - (k - 1)$$\nFactor out common terms:\n$$= x(k - 1) - 1(k - 1)$$\n$$= (k - 1)(x - 1)$$.",
                "workedSolution": "Group terms into pairs:\n$$= (kx - x) - (k - 1)$$\nFactor out common terms:\n$$= x(k - 1) - 1(k - 1)$$\n$$= (k - 1)(x - 1)$$."
            },
            {
                "partLabel": "(c)",
                "marks": 5,
                "prompt": "In a farming community of 8,400 residents, the number of women exceeds the number of men by 1,200. Find the ratio of men to women in the community in simplest form.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Let the number of men be $m$.\nNumber of women $= m + 1,200$.\n$$m + (m + 1,200) = 8,400$$\n$$2m + 1,200 = 8,400 \\implies 2m = 7,200 \\implies m = 3,600$$\n$$\\text{Men} = 3,600$$\n$$\\text{Women} = 3,600 + 1,200 = 4,800$$\nRatio of men to women:\n$$\\frac{3,600}{4,800} = \\frac{36}{48} = \\frac{3}{4} \\implies 3 : 4$$.",
                "workedSolution": "Let the number of men be $m$.\nNumber of women $= m + 1,200$.\n$$m + (m + 1,200) = 8,400$$\n$$2m + 1,200 = 8,400 \\implies 2m = 7,200 \\implies m = 3,600$$\n$$\\text{Men} = 3,600$$\n$$\\text{Women} = 3,600 + 1,200 = 4,800$$\nRatio of men to women:\n$$\\frac{3,600}{4,800} = \\frac{36}{48} = \\frac{3}{4} \\implies 3 : 4$$."
            }
        ]
    },
    {
        "id": "q04",
        "title": "Question 4: Linear Fraction Equations, Standard Form & Water Transfer Between Tanks",
        "totalMarks": 15,
        "points": 15,
        "format": "structured_essay",
        "prompt": "Answer all parts of this question:",
        "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
        "parts": [
            {
                "partLabel": "(a)",
                "marks": 5,
                "prompt": "Solve for $x$: $$\\frac{3x + 2}{2} + 3x = 19$$.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Multiply through by 2 to clear the fraction:\n$$2\\left(\\frac{3x + 2}{2}\\right) + 2(3x) = 2(19)$$\n$$3x + 2 + 6x = 38$$\n$$9x + 2 = 38 \\implies 9x = 36 \\implies x = 4$$.",
                "workedSolution": "Multiply through by 2 to clear the fraction:\n$$2\\left(\\frac{3x + 2}{2}\\right) + 2(3x) = 2(19)$$\n$$3x + 2 + 6x = 38$$\n$$9x + 2 = 38 \\implies 9x = 36 \\implies x = 4$$."
            },
            {
                "partLabel": "(b)",
                "marks": 4,
                "prompt": "Multiply $0.04625$ by $0.03$, leaving your answer in standard form.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Convert numbers into standard powers of 10:\n$$0.04625 = 4.625 \\times 10^{-2}$$\n$$0.03 = 3 \\times 10^{-2}$$\nMultiply:\n$$4.625 \\times 3 = 13.875$$\n$$13.875 \\times 10^{-4} = 1.3875 \\times 10^{-3}$$.",
                "workedSolution": "Convert numbers into standard powers of 10:\n$$0.04625 = 4.625 \\times 10^{-2}$$\n$$0.03 = 3 \\times 10^{-2}$$\nMultiply:\n$$4.625 \\times 3 = 13.875$$\n$$13.875 \\times 10^{-4} = 1.3875 \\times 10^{-3}$$."
            },
            {
                "partLabel": "(c)",
                "marks": 6,
                "prompt": "A cylindrical tank of height $21\\text{ cm}$ and diameter $20\\text{ cm}$ is filled with water. The water is then poured into a rectangular tank with base length $22\\text{ cm}$ and width $15\\text{ cm}$. Calculate the depth of the water in the rectangular tank. [Take $\\pi = \\frac{22}{7}$]",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Radius of cylinder $r = \\frac{20}{2} = 10\\text{ cm}$.\n$$\\text{Volume of cylinder } V = \\pi r^2 h = \\frac{22}{7} \\times 10^2 \\times 21$$\n$$V = 22 \\times 100 \\times 3 = 6,600\\text{ cm}^3$$\nLet depth in rectangular tank be $d\\text{ cm}$:\n$$\\text{Base Area} = 22 \\times 15 = 330\\text{ cm}^2$$\n$$\\text{Volume} = 330 \\times d = 6,600$$\n$$d = \\frac{6,600}{330} = 20\\text{ cm}$$\nDepth of water is **20 cm**.",
                "workedSolution": "Radius of cylinder $r = \\frac{20}{2} = 10\\text{ cm}$.\n$$\\text{Volume of cylinder } V = \\pi r^2 h = \\frac{22}{7} \\times 10^2 \\times 21$$\n$$V = 22 \\times 100 \\times 3 = 6,600\\text{ cm}^3$$\nLet depth in rectangular tank be $d\\text{ cm}$:\n$$\\text{Base Area} = 22 \\times 15 = 330\\text{ cm}^2$$\n$$\\text{Volume} = 330 \\times d = 6,600$$\n$$d = \\frac{6,600}{330} = 20\\text{ cm}$$\nDepth of water is **20 cm**."
            }
        ]
    },
    {
        "id": "q05",
        "title": "Question 5: Difference of Two Squares, Circumference & Subject Substitution",
        "totalMarks": 15,
        "points": 15,
        "format": "structured_essay",
        "prompt": "Answer all parts of this question:",
        "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
        "parts": [
            {
                "partLabel": "(a)",
                "marks": 5,
                "prompt": "If $7y = 20^2 - 13^2$, find the value of $y$.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Apply the difference of two squares identity ($a^2 - b^2 = (a - b)(a + b)$):\n$$20^2 - 13^2 = (20 - 13)(20 + 13) = (7)(33)$$\n$$7y = 7 \\times 33 \\implies y = 33$$.",
                "workedSolution": "Apply the difference of two squares identity ($a^2 - b^2 = (a - b)(a + b)$):\n$$20^2 - 13^2 = (20 - 13)(20 + 13) = (7)(33)$$\n$$7y = 7 \\times 33 \\implies y = 33$$."
            },
            {
                "partLabel": "(b)",
                "marks": 4,
                "prompt": "Find the perimeter of a circular garden with radius $28\\text{ cm}$. [Take $\\pi = \\frac{22}{7}$]",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "$$\\text{Perimeter (Circumference)} = 2\\pi r$$\n$$= 2 \\times \\frac{22}{7} \\times 28 = 2 \\times 22 \\times 4 = 176\\text{ cm}$$.",
                "workedSolution": "$$\\text{Perimeter (Circumference)} = 2\\pi r$$\n$$= 2 \\times \\frac{22}{7} \\times 28 = 2 \\times 22 \\times 4 = 176\\text{ cm}$$."
            },
            {
                "partLabel": "(c)",
                "marks": 6,
                "prompt": "Given that $$k = \\frac{p - q}{3np}$$:\n(i) Make $p$ the subject of the relation.\n(ii) Find the value of $p$ when $q = 80$, $k = 3$, and $n = -2$.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "(i) Clear the denominator:\n$$3nkp = p - q$$\nRearrange terms containing $p$:\n$$3nkp - p = -q$$\nFactor out $p$:\n$$p(3nk - 1) = -q$$\n$$p = \\frac{-q}{3nk - 1} = \\frac{q}{1 - 3nk}$$\n\n(ii) Substitute $q = 80, k = 3, n = -2$:\n$$p = \\frac{80}{1 - 3(-2)(3)} = \\frac{80}{1 - (-18)} = \\frac{80}{1 + 18} = \\frac{80}{19} = 4\\frac{4}{19}$$\n*(Or decimal $\\approx 4.21$)*.",
                "workedSolution": "(i) Clear the denominator:\n$$3nkp = p - q$$\nRearrange terms containing $p$:\n$$3nkp - p = -q$$\nFactor out $p$:\n$$p(3nk - 1) = -q$$\n$$p = \\frac{-q}{3nk - 1} = \\frac{q}{1 - 3nk}$$\n\n(ii) Substitute $q = 80, k = 3, n = -2$:\n$$p = \\frac{80}{1 - 3(-2)(3)} = \\frac{80}{1 - (-18)} = \\frac{80}{1 + 18} = \\frac{80}{19} = 4\\frac{4}{19}$$\n*(Or decimal $\\approx 4.21$)*."
            }
        ]
    },
    {
        "id": "q06",
        "title": "Question 6: Linear Table Completion, Coordinate Graphing & Interval Integers",
        "totalMarks": 15,
        "points": 15,
        "format": "structured_essay",
        "prompt": "Answer all parts of this question:",
        "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
        "parts": [
            {
                "partLabel": "(a)",
                "marks": 4,
                "prompt": "Copy and complete the table for the relation $y = 10x - 5$:\n\n| x | -1 | 0 | 1 | 2 | 3 | 4 | 5 |\n| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| y | **?** | -5 | **?** | **?** | 25 | **?** | **?** |",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Substitute each $x$ into $y = 10x - 5$:\n- $x = -1: y = 10(-1) - 5 = -15$\n- $x = 0: y = -5$ (given)\n- $x = 1: y = 10(1) - 5 = 5$\n- $x = 2: y = 10(2) - 5 = 15$\n- $x = 3: y = 10(3) - 5 = 25$ (given)\n- $x = 4: y = 10(4) - 5 = 35$\n- $x = 5: y = 10(5) - 5 = 45$\n\nCompleted table:\n| x | -1 | 0 | 1 | 2 | 3 | 4 | 5 |\n| y | -15 | -5 | 5 | 15 | 25 | 35 | 45 |",
                "workedSolution": "Substitute each $x$ into $y = 10x - 5$:\n- $x = -1: y = 10(-1) - 5 = -15$\n- $x = 0: y = -5$ (given)\n- $x = 1: y = 10(1) - 5 = 5$\n- $x = 2: y = 10(2) - 5 = 15$\n- $x = 3: y = 10(3) - 5 = 25$ (given)\n- $x = 4: y = 10(4) - 5 = 35$\n- $x = 5: y = 10(5) - 5 = 45$\n\nCompleted table:\n| x | -1 | 0 | 1 | 2 | 3 | 4 | 5 |\n| y | -15 | -5 | 5 | 15 | 25 | 35 | 45 |"
            },
            {
                "partLabel": "(b)",
                "marks": 5,
                "prompt": "Using a scale of 2 cm to 1 unit on the x-axis and 2 cm to 10 units on the y-axis, draw on graph paper two perpendicular axes Ox and Oy for the domain $-1 \\le x \\le 5$.\n(i) Plot all the points from the completed table.\n(ii) Draw a continuous straight line through the points.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "Axes drawn and calibrated. Points $(-1, -15), (0, -5), (1, 5), (2, 15), (3, 25), (4, 35), (5, 45)$ plotted accurately and connected by a straight line.",
                "workedSolution": "Axes drawn and calibrated. Points $(-1, -15), (0, -5), (1, 5), (2, 15), (3, 25), (4, 35), (5, 45)$ plotted accurately and connected by a straight line."
            },
            {
                "partLabel": "(c)",
                "marks": 3,
                "prompt": "Use the graph from (b) to find:<br/><svg viewBox='0 0 360 360' width='100%' height='300' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><pattern id='p2GridClean' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='#e2e8f0' stroke-width='0.9'/></pattern></defs><rect width='100%' height='100%' fill='url(#p2GridClean)'/><line x1='20' y1='200' x2='340' y2='200' stroke='#334155' stroke-width='2'/><polygon points='340,197 348,200 340,203' fill='#334155'/><text x='342' y='216' font-size='11' font-weight='bold' fill='#334155'>x</text><line x1='120' y1='340' x2='120' y2='20' stroke='#334155' stroke-width='2'/><polygon points='117,20 120,12 123,20' fill='#334155'/><text x='132' y='22' font-size='11' font-weight='bold' fill='#334155'>y</text><text x='106' y='214' font-size='10' fill='#64748b'>O</text><line x1='60' y1='262' x2='300' y2='62' stroke='#2563eb' stroke-width='2.5'/><circle cx='120' cy='212.5' r='3.5' fill='#dc2626'/><circle cx='150' cy='187.5' r='3.5' fill='#dc2626'/><circle cx='180' cy='162.5' r='3.5' fill='#dc2626'/><circle cx='210' cy='137.5' r='3.5' fill='#dc2626'/><circle cx='240' cy='112.5' r='3.5' fill='#dc2626'/><circle cx='270' cy='87.5' r='3.5' fill='#dc2626'/><line x1='195' y1='200' x2='195' y2='150' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/><line x1='195' y1='150' x2='120' y2='150' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/><text x='195' y='215' font-size='9' font-weight='bold' fill='#d97706' text-anchor='middle'>2.5</text><text x='100' y='154' font-size='9' font-weight='bold' fill='#d97706' text-anchor='end'>20</text><line x1='120' y1='175' x2='165' y2='175' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='3,2'/><line x1='165' y1='175' x2='165' y2='200' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='3,2'/><text x='100' y='178' font-size='9' font-weight='bold' fill='#16a34a' text-anchor='end'>10</text><text x='165' y='215' font-size='9' font-weight='bold' fill='#16a34a' text-anchor='middle'>1.5</text><text x='250' y='75' font-size='11' font-weight='bold' fill='#2563eb'>y = 10x - 5</text></svg><br/>(i) the value of $y$ when $x = 2.5$;<br/>(ii) the value of $x$ when $y = 10$.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "(i) Locate $x = 2.5$ on the horizontal axis, move up to the line and read across to the y-axis:\n$$y = 20$$\n*(Check: $y = 10(2.5) - 5 = 25 - 5 = 20$)*.\n\n(ii) Locate $y = 10$ on the vertical axis, move across to the line and read down to the x-axis:\n$$x = 1.5$$\n*(Check: $10 = 10x - 5 \\implies 10x = 15 \\implies x = 1.5$)*.",
                "workedSolution": "(i) Locate $x = 2.5$ on the horizontal axis, move up to the line and read across to the y-axis:\n$$y = 20$$\n*(Check: $y = 10(2.5) - 5 = 25 - 5 = 20$)*.\n\n(ii) Locate $y = 10$ on the vertical axis, move across to the line and read down to the x-axis:\n$$x = 1.5$$\n*(Check: $10 = 10x - 5 \\implies 10x = 15 \\implies x = 1.5$)*."
            },
            {
                "partLabel": "(d)",
                "marks": 3,
                "prompt": "List all the integers within the inequality interval: $$5 < x \\le 11$$.",
                "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
                "modelAnswer": "The integers greater than 5 and less than or equal to 11 are:\n$$\\{6, 7, 8, 9, 10, 11\\}$$.",
                "workedSolution": "The integers greater than 5 and less than or equal to 11 are:\n$$\\{6, 7, 8, 9, 10, 11\\}$$."
            }
        ]
    }
]
};
