import { CurriculumQuestionSet } from '../global-curriculum-types';

export const SET_JHS_MASTERY_SERIES_58: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-58",
  title: "Junior Core Mathematics • Objective Mastery Series (Set 58)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Comprehensive Objective Exam Series (2024 BECE Variant)",
  variantType: "past_paper_variant",
  totalQuestions: 40,
  version: 1,
  questions: [
    {
        "id": "q01",
        "prompt": "Two brands of gas cookers, Brand A and Brand B, cost GH¢ 2,000.00 and GH¢ 3,000.00 respectively. A caterer budgeted GH¢ 18,000.00 to purchase cookers. If the caterer bought 5 units of Brand A instead of Brand B, how much money was saved?",
        "options": [
            "GH¢ 5,000.00",
            "GH¢ 1,000.00",
            "GH¢ 10,000.00",
            "GH¢ 15,000.00"
        ],
        "correctAnswer": "GH¢ 5,000.00",
        "hint": "Calculate the savings on a single unit ($3,000 - 2,000$) and multiply by 5.",
        "workedSolution": "$$\\text{Saving per unit} = 3,000 - 2,000 = \\text{GH¢ } 1,000.00$$\n$$\\text{Total saving for 5 units} = 5 \\times 1,000.00 = \\text{GH¢ } 5,000.00$$.",
        "points": 1
    },
    {
        "id": "q02",
        "prompt": "Kwame and Abena shared an amount of money in the ratio $2 : 5$. If Abena received GH¢ 120.00 more than Kwame, how much did they share altogether?",
        "options": [
            "GH¢ 280.00",
            "GH¢ 200.00",
            "GH¢ 240.00",
            "GH¢ 350.00"
        ],
        "correctAnswer": "GH¢ 280.00",
        "hint": "Difference in parts is $5 - 2 = 3$ parts, which equals GH¢ 120.00. Find the value of total parts ($2 + 5 = 7$).",
        "workedSolution": "$$3\\text{ parts} = 120.00 \\implies 1\\text{ part} = \\frac{120}{3} = \\text{GH¢ } 40.00$$\n$$\\text{Total parts} = 2 + 5 = 7$$\n$$\\text{Total shared} = 7 \\times 40.00 = \\text{GH¢ } 280.00$$.",
        "points": 1
    },
    {
        "id": "q03",
        "prompt": "Which of the following is an example of quantitative data?",
        "options": [
            "Height",
            "Religion",
            "Nationality",
            "Blood group"
        ],
        "correctAnswer": "Height",
        "hint": "Quantitative data is measured numerically.",
        "workedSolution": "Height is a numerical measurement, making it quantitative data.",
        "points": 1
    },
    {
        "id": "q04",
        "prompt": "In the Venn diagram below, $X$ and $Y$ are two sets in the universal set $U$. Find $X \\cap Y$:<br/><svg viewBox='0 0 340 220' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><rect x='20' y='20' width='300' height='180' rx='4' fill='none' stroke='#334155' stroke-width='2'/><text x='305' y='40' font-size='13' font-weight='bold' fill='#0f172a'>U</text><circle cx='160' cy='110' r='75' fill='#eff6ff' stroke='#1d4ed8' stroke-width='2'/><text x='225' y='65' font-size='13' font-weight='bold' fill='#1d4ed8'>X</text><circle cx='160' cy='110' r='42' fill='#dbeafe' stroke='#2563eb' stroke-width='1.8'/><text x='195' y='95' font-size='12' font-weight='bold' fill='#1e40af'>Y</text><text x='150' y='105' font-size='12' font-weight='bold' fill='#1e293b'>p</text><text x='170' y='105' font-size='12' font-weight='bold' fill='#1e293b'>q</text><text x='160' y='130' font-size='12' font-weight='bold' fill='#1e293b'>r</text><text x='130' y='65' font-size='12' font-weight='bold' fill='#1e293b'>u</text><text x='190' y='65' font-size='12' font-weight='bold' fill='#1e293b'>v</text><text x='45' y='180' font-size='12' font-weight='bold' fill='#1e293b'>w</text><text x='280' y='180' font-size='12' font-weight='bold' fill='#1e293b'>z</text></svg>",
        "options": [
            "{p, q, r}",
            "{u, v}",
            "{p, q, r, u, v}",
            "{w, z}"
        ],
        "correctAnswer": "{p, q, r}",
        "hint": "Circle $Y$ is completely inside circle $X$.",
        "workedSolution": "Because $Y \\subset X$, the elements common to both sets are the elements inside $Y$: $\\{p, q, r\\}$.",
        "points": 1
    },
    {
        "id": "q05",
        "prompt": "From the Venn diagram in Question 4, how many members are in set $X$?<br/><svg viewBox='0 0 340 220' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><rect x='20' y='20' width='300' height='180' rx='4' fill='none' stroke='#334155' stroke-width='2'/><text x='305' y='40' font-size='13' font-weight='bold' fill='#0f172a'>U</text><circle cx='160' cy='110' r='75' fill='#eff6ff' stroke='#1d4ed8' stroke-width='2'/><text x='225' y='65' font-size='13' font-weight='bold' fill='#1d4ed8'>X</text><circle cx='160' cy='110' r='42' fill='#dbeafe' stroke='#2563eb' stroke-width='1.8'/><text x='195' y='95' font-size='12' font-weight='bold' fill='#1e40af'>Y</text><text x='150' y='105' font-size='12' font-weight='bold' fill='#1e293b'>p</text><text x='170' y='105' font-size='12' font-weight='bold' fill='#1e293b'>q</text><text x='160' y='130' font-size='12' font-weight='bold' fill='#1e293b'>r</text><text x='130' y='65' font-size='12' font-weight='bold' fill='#1e293b'>u</text><text x='190' y='65' font-size='12' font-weight='bold' fill='#1e293b'>v</text><text x='45' y='180' font-size='12' font-weight='bold' fill='#1e293b'>w</text><text x='280' y='180' font-size='12' font-weight='bold' fill='#1e293b'>z</text></svg>",
        "options": [
            "5",
            "3",
            "2",
            "7"
        ],
        "correctAnswer": "5",
        "hint": "Count all members inside the outer circle $X$.",
        "workedSolution": "$$X = \\{p, q, r, u, v\\} \\implies n(X) = 5$$.",
        "points": 1
    },
    {
        "id": "q06",
        "prompt": "A goat is tethered in a field such that it moves keeping an equal distance from two trees $M$ and $N$. Which of the following describes the locus of the goat?",
        "options": [
            "Perpendicular bisector of line MN",
            "Circle passing through line MN",
            "Arc through line MN",
            "Straight line MN"
        ],
        "correctAnswer": "Perpendicular bisector of line MN",
        "hint": "Points equidistant from two fixed points lie on the perpendicular bisector.",
        "workedSolution": "The locus of points equidistant from two fixed points $M$ and $N$ is the perpendicular bisector of segment $MN$.",
        "points": 1
    },
    {
        "id": "q07",
        "prompt": "A sack of maize weighs $3\\text{ kg}$. If the empty sack weighs $120\\text{ g}$, find the weight of the maize. [$1\\text{ kg} = 1,000\\text{ g}$]",
        "options": [
            "2.880 kg",
            "2.780 kg",
            "0.288 kg",
            "1.880 kg"
        ],
        "correctAnswer": "2.880 kg",
        "hint": "Convert $120\\text{ g}$ to kilograms ($0.120\\text{ kg}$) and subtract from $3\\text{ kg}$.",
        "workedSolution": "$$\\text{Empty sack} = 0.120\\text{ kg}$$\n$$\\text{Weight of maize} = 3.000 - 0.120 = 2.880\\text{ kg}$$.",
        "points": 1
    },
    {
        "id": "q08",
        "prompt": "Kweku drew three sticks such that the length of the first is $10\\text{ cm}$, the second is $12\\text{ cm}$ longer than the first, and the third is $8\\text{ cm}$ shorter than the second. Find the length of the third stick.",
        "options": [
            "14 cm",
            "22 cm",
            "18 cm",
            "6 cm"
        ],
        "correctAnswer": "14 cm",
        "hint": "Length of second stick is $10 + 12 = 22\\text{ cm}$. Subtract 8.",
        "workedSolution": "$$\\text{First} = 10\\text{ cm}$$\n$$\\text{Second} = 10 + 12 = 22\\text{ cm}$$\n$$\\text{Third} = 22 - 8 = 14\\text{ cm}$$.",
        "points": 1
    },
    {
        "id": "q09",
        "prompt": "Find the truth set of $3x - 5 < 7 + 5x$.",
        "options": [
            "{x : x > -6}",
            "{x : x < -6}",
            "{x : x > 6}",
            "{x : x < 6}"
        ],
        "correctAnswer": "{x : x > -6}",
        "hint": "Rearrange terms: $-5 - 7 < 5x - 3x$.",
        "workedSolution": "$$-12 < 2x \\implies 2x > -12 \\implies x > -6$$\n$$\\text{Truth set} = \\{x : x > -6\\}$$.",
        "points": 1
    },
    {
        "id": "q10",
        "prompt": "The locus of points equidistant from a single fixed point is called a:",
        "options": [
            "circle",
            "diameter",
            "chord",
            "tangent"
        ],
        "correctAnswer": "circle",
        "hint": "The fixed point is the center of the figure.",
        "workedSolution": "A circle is the locus of all points in a plane equidistant from a fixed center point.",
        "points": 1
    },
    {
        "id": "q11",
        "prompt": "Evaluate: $\\sqrt{48} + \\sqrt{18} - \\sqrt{12}$.",
        "options": [
            "2√3 + 3√2",
            "2√3 - 3√2",
            "3√2",
            "4√3"
        ],
        "correctAnswer": "2√3 + 3√2",
        "hint": "Simplify surds: $\\sqrt{48} = 4\\sqrt{3}$, $\\sqrt{18} = 3\\sqrt{2}$, $\\sqrt{12} = 2\\sqrt{3}$.",
        "workedSolution": "$$\\sqrt{48} = 4\\sqrt{3}, \\quad \\sqrt{18} = 3\\sqrt{2}, \\quad \\sqrt{12} = 2\\sqrt{3}$$\n$$(4\\sqrt{3} - 2\\sqrt{3}) + 3\\sqrt{2} = 2\\sqrt{3} + 3\\sqrt{2}$$.",
        "points": 1
    },
    {
        "id": "q12",
        "prompt": "In the diagram below, line $AB$ is parallel to line $CD$. Find the value of reflex angle $x$:<br/><svg viewBox='0 0 360 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><line x1='20' y1='35' x2='340' y2='35' stroke='#1e293b' stroke-width='2'/><polygon points='280,32 290,35 280,38' fill='#1e293b'/><polygon points='290,32 300,35 290,38' fill='#1e293b'/><text x='25' y='28' font-size='12' font-weight='bold' fill='#0f172a'>A</text><text x='330' y='28' font-size='12' font-weight='bold' fill='#0f172a'>B</text><line x1='20' y1='145' x2='340' y2='145' stroke='#1e293b' stroke-width='2'/><polygon points='280,142 290,145 280,148' fill='#1e293b'/><polygon points='290,142 300,145 290,148' fill='#1e293b'/><text x='25' y='162' font-size='12' font-weight='bold' fill='#0f172a'>C</text><text x='330' y='162' font-size='12' font-weight='bold' fill='#0f172a'>D</text><line x1='50' y1='15' x2='180' y2='95' stroke='#2563eb' stroke-width='2.5'/><line x1='80' y1='180' x2='180' y2='95' stroke='#2563eb' stroke-width='2.5'/><path d='M 70 35 A 20 20 0 0 1 80 23' fill='none' stroke='#dc2626' stroke-width='1.8'/><text x='62' y='25' font-size='11' font-weight='bold' fill='#dc2626'>40°</text><path d='M 125 145 A 25 25 0 0 1 110 130' fill='none' stroke='#16a34a' stroke-width='1.8'/><text x='96' y='135' font-size='11' font-weight='bold' fill='#16a34a'>150°</text><path d='M 165 85 A 20 20 0 1 1 170 108' fill='none' stroke='#d97706' stroke-width='2'/><text x='200' y='100' font-size='12' font-weight='bold' fill='#d97706'>x</text><text x='180' y='172' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>",
        "options": [
            "290°",
            "250°",
            "270°",
            "280°"
        ],
        "correctAnswer": "290°",
        "hint": "Acute bend angle $= 40^\\circ + (180^\\circ - 150^\\circ) = 40^\\circ + 30^\\circ = 70^\\circ$. Reflex angle $= 360^\\circ - 70^\\circ$.",
        "workedSolution": "Top alternate interior angle $= 40^\\circ$.\nBottom co-interior angle $= 180^\\circ - 150^\\circ = 30^\\circ$.\n$$\\text{Interior bend angle} = 40^\\circ + 30^\\circ = 70^\\circ$$\n$$\\text{Reflex angle } x = 360^\\circ - 70^\\circ = 290^\\circ$$.",
        "points": 1
    },
    {
        "id": "q13",
        "prompt": "A crate contains three types of fruits: mangoes, apples, and bananas. If $\\frac{2}{5}$ are mangoes and $\\frac{7}{25}$ are apples, what percentage of the fruits are bananas?",
        "options": [
            "32%",
            "40%",
            "28%",
            "68%"
        ],
        "correctAnswer": "32%",
        "hint": "Convert fractions to percentages: $\\frac{2}{5} = 40\\%$, $\\frac{7}{25} = 28\\%$.",
        "workedSolution": "$$\\text{Mangoes} = 40\\%, \\quad \\text{Apples} = 28\\%$$\n$$\\text{Bananas} = 100\\% - (40\\% + 28\\%) = 100\\% - 68\\% = 32\\%$$.",
        "points": 1
    },
    {
        "id": "q14",
        "prompt": "Study the graph of the linear relation below:<br/><svg viewBox='0 0 320 280' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><pattern id='cartGridClean' width='24' height='24' patternUnits='userSpaceOnUse'><path d='M 24 0 L 0 0 0 24' fill='none' stroke='#e2e8f0' stroke-width='1'/></pattern></defs><rect width='100%' height='100%' fill='url(#cartGridClean)'/><line x1='15' y1='168' x2='305' y2='168' stroke='#334155' stroke-width='2'/><polygon points='305,165 313,168 305,171' fill='#334155'/><text x='308' y='184' font-size='11' font-weight='bold' fill='#334155'>x</text><line x1='96' y1='265' x2='96' y2='15' stroke='#334155' stroke-width='2'/><polygon points='93,15 96,7 99,15' fill='#334155'/><text x='105' y='16' font-size='11' font-weight='bold' fill='#334155'>y</text><text x='84' y='180' font-size='10' fill='#64748b'>O</text><line x1='60' y1='0' x2='180' y2='240' stroke='#2563eb' stroke-width='2.5'/><circle cx='96' cy='72' r='4' fill='#dc2626'/><circle cx='144' cy='168' r='4' fill='#dc2626'/><text x='140' y='85' font-size='11' font-weight='bold' fill='#2563eb'>y = mx + c</text></svg><br/>Find the slope ($m$) of the relation.",
        "options": [
            "-2",
            "2",
            "-1",
            "4"
        ],
        "correctAnswer": "-2",
        "hint": "Use points $(0, 4)$ and $(2, 0)$. Gradient $m = \\frac{y_2 - y_1}{x_2 - x_1}$.",
        "workedSolution": "$$m = \\frac{0 - 4}{2 - 0} = \\frac{-4}{2} = -2$$.",
        "points": 1
    },
    {
        "id": "q15",
        "prompt": "Using the graph from Question 14, find the equation of the linear relation:<br/><svg viewBox='0 0 320 280' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><pattern id='cartGridClean' width='24' height='24' patternUnits='userSpaceOnUse'><path d='M 24 0 L 0 0 0 24' fill='none' stroke='#e2e8f0' stroke-width='1'/></pattern></defs><rect width='100%' height='100%' fill='url(#cartGridClean)'/><line x1='15' y1='168' x2='305' y2='168' stroke='#334155' stroke-width='2'/><polygon points='305,165 313,168 305,171' fill='#334155'/><text x='308' y='184' font-size='11' font-weight='bold' fill='#334155'>x</text><line x1='96' y1='265' x2='96' y2='15' stroke='#334155' stroke-width='2'/><polygon points='93,15 96,7 99,15' fill='#334155'/><text x='105' y='16' font-size='11' font-weight='bold' fill='#334155'>y</text><text x='84' y='180' font-size='10' fill='#64748b'>O</text><line x1='60' y1='0' x2='180' y2='240' stroke='#2563eb' stroke-width='2.5'/><circle cx='96' cy='72' r='4' fill='#dc2626'/><circle cx='144' cy='168' r='4' fill='#dc2626'/><text x='140' y='85' font-size='11' font-weight='bold' fill='#2563eb'>y = mx + c</text></svg>",
        "options": [
            "y = -2x + 4",
            "y = 2x + 4",
            "y = -2x - 4",
            "y = 4x - 2"
        ],
        "correctAnswer": "y = -2x + 4",
        "hint": "Slope is $-2$ and the line crosses the $y$-axis at $(0, 4)$.",
        "workedSolution": "$$m = -2, \\quad c = 4 \\implies y = -2x + 4$$.",
        "points": 1
    },
    {
        "id": "q16",
        "prompt": "Adwoa is 5 years younger than her sister. If the sum of their ages is 19 years, find Adwoa's age.",
        "options": [
            "7 years",
            "12 years",
            "9 years",
            "8 years"
        ],
        "correctAnswer": "7 years",
        "hint": "Let sister's age be $s$. Adwoa is $s - 5$. Sum: $s + (s - 5) = 19$.",
        "workedSolution": "$$2s - 5 = 19 \\implies 2s = 24 \\implies s = 12$$\n$$\\text{Adwoa} = 12 - 5 = 7\\text{ years old}$$.",
        "points": 1
    },
    {
        "id": "q17",
        "prompt": "A number of biscuits were shared among 40 children and each received 12 biscuits. If the same number of biscuits are shared equally among 30 children, how many will each child get?",
        "options": [
            "16",
            "15",
            "18",
            "20"
        ],
        "correctAnswer": "16",
        "hint": "Total biscuits $= 40 \\times 12 = 480$. Divide by 30.",
        "workedSolution": "$$\\text{Total biscuits} = 40 \\times 12 = 480$$\n$$\\text{Per child} = \\frac{480}{30} = 16$$.",
        "points": 1
    },
    {
        "id": "q18",
        "prompt": "If the bearing of point $Y$ from point $X$ is $110^\\circ$, find the bearing of $X$ from $Y$.",
        "options": [
            "290°",
            "070°",
            "200°",
            "250°"
        ],
        "correctAnswer": "290°",
        "hint": "Add $180^\\circ$ to find the back bearing: $110^\\circ + 180^\\circ$.",
        "workedSolution": "$$110^\\circ + 180^\\circ = 290^\\circ$$.",
        "points": 1
    },
    {
        "id": "q19",
        "prompt": "Given vectors $\\mathbf{m} = \\begin{pmatrix} 4 \\\\ -1 \\end{pmatrix}$ and $\\mathbf{n} = \\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix}$, find $2\\mathbf{m} + \\mathbf{n}$.",
        "options": [
            "(5, 0)",
            "(8, -2)",
            "(1, 1)",
            "(5, 1)"
        ],
        "correctAnswer": "(5, 0)",
        "hint": "$$2\\begin{pmatrix} 4 \\\\ -1 \\end{pmatrix} + \\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix}$$.",
        "workedSolution": "$$\\begin{pmatrix} 8 \\\\ -2 \\end{pmatrix} + \\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 0 \\end{pmatrix}$$.",
        "points": 1
    },
    {
        "id": "q20",
        "prompt": "Simplify: $$\\frac{27^{k+1}}{3^{k+2}}$$.",
        "options": [
            "3^{2k+1}",
            "3^{2k}",
            "3^{2k-1}",
            "3^{2k+2}"
        ],
        "correctAnswer": "3^{2k+1}",
        "hint": "Write 27 as $3^3$: $27^{k+1} = 3^{3(k+1)} = 3^{3k+3}$.",
        "workedSolution": "$$\\frac{3^{3k+3}}{3^{k+2}} = 3^{(3k+3) - (k+2)} = 3^{2k+1}$$.",
        "points": 1
    },
    {
        "id": "q21",
        "prompt": "There are 12 red balls and 28 green identical balls in a box. If a ball is picked at random, what is the probability that it is red?",
        "options": [
            "3/10",
            "7/10",
            "3/7",
            "1/12"
        ],
        "correctAnswer": "3/10",
        "hint": "Total balls $= 12 + 28 = 40$.",
        "workedSolution": "$$P(\\text{red}) = \\frac{12}{40} = \\frac{3}{10}$$.",
        "points": 1
    },
    {
        "id": "q22",
        "prompt": "The area of a rectangle is $24\\text{ cm}^2$. If the width is $3\\text{ cm}$, find its perimeter.",
        "options": [
            "22 cm",
            "16 cm",
            "11 cm",
            "24 cm"
        ],
        "correctAnswer": "22 cm",
        "hint": "Length $= 24 \\div 3 = 8\\text{ cm}$. Perimeter $= 2(l + w)$.",
        "workedSolution": "$$\\text{Length} = \\frac{24}{3} = 8\\text{ cm}$$\n$$\\text{Perimeter} = 2(8 + 3) = 2(11) = 22\\text{ cm}$$.",
        "points": 1
    },
    {
        "id": "q23",
        "prompt": "Find the simple interest on GH¢ 500.00 for 2 years at 6% per annum.",
        "options": [
            "GH¢ 60.00",
            "GH¢ 30.00",
            "GH¢ 120.00",
            "GH¢ 50.00"
        ],
        "correctAnswer": "GH¢ 60.00",
        "hint": "$$I = \\frac{P \\times R \\times T}{100}$$.",
        "workedSolution": "$$I = \\frac{500 \\times 6 \\times 2}{100} = 5 \\times 12 = \\text{GH¢ } 60.00$$.",
        "points": 1
    },
    {
        "id": "q24",
        "prompt": "One factor of the expression $3m^2 + 9m - 6m - 18$ is $(3m - 6)$. Find the other factor.",
        "options": [
            "m + 3",
            "m - 3",
            "3m + 3",
            "m + 6"
        ],
        "correctAnswer": "m + 3",
        "hint": "Group terms: $3m(m + 3) - 6(m + 3)$.",
        "workedSolution": "$$3m(m + 3) - 6(m + 3) = (3m - 6)(m + 3)$$\nThe other factor is $m + 3$.",
        "points": 1
    },
    {
        "id": "q25",
        "prompt": "A pair of shoes costing GH¢ 400.00 was sold at a discount of 10%. Find the selling price.",
        "options": [
            "GH¢ 360.00",
            "GH¢ 40.00",
            "GH¢ 340.00",
            "GH¢ 380.00"
        ],
        "correctAnswer": "GH¢ 360.00",
        "hint": "Selling price is 90% of GH¢ 400.00.",
        "workedSolution": "$$\\text{Discount} = 0.10 \\times 400 = \\text{GH¢ } 40.00$$\n$$\\text{Selling price} = 400 - 40 = \\text{GH¢ } 360.00$$.",
        "points": 1
    },
    {
        "id": "q26",
        "prompt": "Make $n$ the subject of the relation: $$\\frac{1}{n} = \\frac{1}{a} + \\frac{1}{b}$$.",
        "options": [
            "n = ab/(a + b)",
            "n = (a + b)/ab",
            "n = ab/(a - b)",
            "n = a + b"
        ],
        "correctAnswer": "n = ab/(a + b)",
        "hint": "Find common denominator on right side and invert.",
        "workedSolution": "$$\\frac{1}{n} = \\frac{b + a}{ab} \\implies n = \\frac{ab}{a + b}$$.",
        "points": 1
    },
    {
        "id": "q27",
        "prompt": "The point $P(-3, 4)$ is translated by the vector $\\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix}$ to point $R$. Find the coordinates of $R$.",
        "options": [
            "(-4, 6)",
            "(-2, 2)",
            "(4, -6)",
            "(-4, 2)"
        ],
        "correctAnswer": "(-4, 6)",
        "hint": "Add components: $(-3 + (-1), 4 + 2)$.",
        "workedSolution": "$$R = (-3 - 1, 4 + 2) = (-4, 6)$$.",
        "points": 1
    },
    {
        "id": "q28",
        "prompt": "A toad leaps in such a way that its distance from start after each leap is given by $3, 6, 9, \\dots\\text{ metres}$. Find its distance after the 10th leap.",
        "options": [
            "30 m",
            "27 m",
            "33 m",
            "24 m"
        ],
        "correctAnswer": "30 m",
        "hint": "Sequence is $3n$. Substitute $n = 10$.",
        "workedSolution": "$$\\text{Distance} = 3 \\times 10 = 30\\text{ metres}$$.",
        "points": 1
    },
    {
        "id": "q29",
        "prompt": "A bus departed from Cape Coast at 8:15 pm and arrived in Takoradi at 1:45 am the next day. How long did the journey take?",
        "options": [
            "5 hours 30 minutes",
            "4 hours 30 minutes",
            "5 hours 15 minutes",
            "6 hours 30 minutes"
        ],
        "correctAnswer": "5 hours 30 minutes",
        "hint": "8:15 pm to 12:00 midnight is $3\\text{ h } 45\\text{ min}$. Add $1\\text{ h } 45\\text{ min}$.",
        "workedSolution": "$$3\\text{ h } 45\\text{ min} + 1\\text{ h } 45\\text{ min} = 4\\text{ h } 90\\text{ min} = 5\\text{ hours } 30\\text{ minutes}$$.",
        "points": 1
    },
    {
        "id": "q30",
        "prompt": "Simplify: $4 - 2(3 + 3x) + x(2x + 6)$.",
        "options": [
            "2x² - 2",
            "2x² + 6x - 2",
            "2x² - 6x - 2",
            "2x² + 2"
        ],
        "correctAnswer": "2x² - 2",
        "hint": "Expand brackets: $4 - 6 - 6x + 2x^2 + 6x$.",
        "workedSolution": "$$4 - 6 - 6x + 2x^2 + 6x = 2x^2 + (-6x + 6x) + (4 - 6) = 2x^2 - 2$$.",
        "points": 1
    },
    {
        "id": "q31",
        "prompt": "In the diagram below, $\\angle QPR = 30^\\circ$ and $|QR| = 4\\text{ cm}$. Find the length of $|PQ|$: [Take $\\sin 30^\\circ = \\frac{1}{2}$]<br/><svg viewBox='0 0 300 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><polygon points='50,140 240,140 240,40' fill='#eff6ff' stroke='#1e40af' stroke-width='2.5'/><rect x='224' y='124' width='16' height='16' fill='none' stroke='#475569' stroke-width='1.5'/><path d='M 85 140 A 35 35 0 0 0 81 123' fill='none' stroke='#dc2626' stroke-width='2'/><text x='92' y='132' font-size='12' font-weight='bold' fill='#dc2626'>30°</text><text x='35' y='145' font-size='12' font-weight='bold' fill='#0f172a'>P</text><text x='250' y='145' font-size='12' font-weight='bold' fill='#0f172a'>R</text><text x='245' y='35' font-size='12' font-weight='bold' fill='#0f172a'>Q</text><text x='255' y='95' font-size='12' font-weight='bold' fill='#15803d'>4 cm</text><text x='145' y='165' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>",
        "options": [
            "8 cm",
            "2 cm",
            "6 cm",
            "12 cm"
        ],
        "correctAnswer": "8 cm",
        "hint": "$$\\sin 30^\\circ = \\frac{\\text{opp}}{\\text{hyp}} = \\frac{4}{|PQ|} = \\frac{1}{2}$$.",
        "workedSolution": "$$\\frac{4}{|PQ|} = \\frac{1}{2} \\implies |PQ| = 4 \\times 2 = 8\\text{ cm}$$.",
        "points": 1
    },
    {
        "id": "q32",
        "prompt": "A fair coin and a fair die are rolled together once. Find the probability of obtaining a head and an even number.",
        "options": [
            "1/4",
            "1/2",
            "1/6",
            "1/3"
        ],
        "correctAnswer": "1/4",
        "hint": "$$P(\\text{head}) = \\frac{1}{2}$$, $P(\\text{even}) = \\frac{3}{6} = \\frac{1}{2}$.",
        "workedSolution": "$$\\frac{1}{2} \\times \\frac{1}{2} = \\frac{1}{4}$$.",
        "points": 1
    },
    {
        "id": "q33",
        "prompt": "If the gradient of a straight line is zero ($m = 0$), then the line:",
        "options": [
            "is horizontal",
            "is vertical",
            "falls to the right",
            "rises to the right"
        ],
        "correctAnswer": "is horizontal",
        "hint": "A line with zero slope has no vertical incline.",
        "workedSolution": "A line with a slope of zero is horizontal (parallel to the $x$-axis).",
        "points": 1
    },
    {
        "id": "q34",
        "prompt": "A teacher wants to find out which subject is preferred most by junior high school students. Which data collection method is most suitable?",
        "options": [
            "Questionnaire",
            "Laboratory experiment",
            "Database simulation",
            "Observation"
        ],
        "correctAnswer": "Questionnaire",
        "hint": "A questionnaire systematically records individual personal preferences.",
        "workedSolution": "Administering a questionnaire is the most reliable way to collect preference opinions across a group of students.",
        "points": 1
    },
    {
        "id": "q35",
        "prompt": "Yaw packed 1,500 oranges into identical baskets. If each basket held 100 oranges, how many baskets were packed?",
        "options": [
            "15",
            "12",
            "16",
            "20"
        ],
        "correctAnswer": "15",
        "hint": "Divide 1,500 by 100.",
        "workedSolution": "$$\\frac{1500}{100} = 15\\text{ baskets}$$.",
        "points": 1
    },
    {
        "id": "q36",
        "prompt": "The costs of three books at a store are GH¢ 65.00, GH¢ 1,120.00, and GH¢ 215.00. If a customer paid and received GH¢ 100.00 change, how much did the customer initially give the cashier?",
        "options": [
            "GH¢ 1,500.00",
            "GH¢ 1,400.00",
            "GH¢ 1,600.00",
            "GH¢ 1,300.00"
        ],
        "correctAnswer": "GH¢ 1,500.00",
        "hint": "Add the three item costs ($65 + 1,120 + 215 = 1,400$) and add the change.",
        "workedSolution": "$$\\text{Total cost} = 65 + 1,120 + 215 = \\text{GH¢ } 1,400.00$$\n$$\\text{Amount paid} = 1,400 + 100 = \\text{GH¢ } 1,500.00$$.",
        "points": 1
    },
    {
        "id": "q37",
        "prompt": "A student rolled a die multiple times with results shown below:<br/><br/>| Number on Die | 1 | 2 | 3 | 4 | 5 | 6 |<br/>| :--- | :---: | :---: | :---: | :---: | :---: | :---: |<br/>| Frequency | 3 | 4 | 2 | 3 | 6 | 2 |<br/><br/>Find the modal number.",
        "options": [
            "5",
            "6",
            "2",
            "4"
        ],
        "correctAnswer": "5",
        "hint": "Look for the outcome with the highest frequency.",
        "workedSolution": "The number 5 has the highest frequency of 6. Mode $= 5$.",
        "points": 1
    },
    {
        "id": "q38",
        "prompt": "Using the table from Question 37, how many times did the student roll the die in total?",
        "options": [
            "20",
            "18",
            "21",
            "24"
        ],
        "correctAnswer": "20",
        "hint": "Sum all frequencies: $3 + 4 + 2 + 3 + 6 + 2$.",
        "workedSolution": "$$\\sum f = 3 + 4 + 2 + 3 + 6 + 2 = 20\\text{ rolls}$$.",
        "points": 1
    },
    {
        "id": "q39",
        "prompt": "Find the image of the point $(-4, 7)$ when it is rotated through $360^\\circ$ about the origin.",
        "options": [
            "(-4, 7)",
            "(4, -7)",
            "(-7, 4)",
            "(7, -4)"
        ],
        "correctAnswer": "(-4, 7)",
        "hint": "A $360^\\circ$ rotation returns any point to its initial position.",
        "workedSolution": "Rotation by $360^\\circ$ leaves coordinates unchanged: $(-4, 7) \\to (-4, 7)$.",
        "points": 1
    },
    {
        "id": "q40",
        "prompt": "A novel contains 60 pages. If a learner reads 10 pages per day, find the formula for the number of unread pages ($N$) after $t$ days.",
        "options": [
            "N = -10t + 60",
            "N = 10t + 60",
            "N = 10t - 60",
            "N = -10t - 60"
        ],
        "correctAnswer": "N = -10t + 60",
        "hint": "Pages decrease by 10 each day from an initial total of 60.",
        "workedSolution": "$$N = 60 - 10t = -10t + 60$$.",
        "points": 1
    }
]
};

export const SET_JHS_MASTERY_SERIES_59: CurriculumQuestionSet = {
  id: "jhs-math-mastery-series-59",
  title: "Junior Core Mathematics • Structured Problem-Solving Series (Set 59)",
  tier: "Junior Secondary (JHS)",
  subject: "Mathematics",
  topic: "Structured Theory, Geometry & Data Modeling (2024 BECE Variant)",
  variantType: "past_paper_variant",
  format: "structured_essay",
  totalQuestions: 6,
  version: 1,
  questions: [
  {
    "id": "q01",
    "title": "Question 1: Structured Theory & Problem Solving",
    "totalMarks": 15,
    "points": 15,
    "format": "structured_essay",
    "prompt": "Answer all parts of this question:",
    "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
    "parts": [
      {
        "partLabel": "(a)",
        "marks": 5,
        "prompt": "A fair standard six-sided die and a fair coin are tossed together once.\n(i) Write down the sample space $S$ of all possible outcomes.\n(ii) Find the probability of obtaining an odd number on the die and a head on the coin.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "(i) Let the die faces be $\\{1, 2, 3, 4, 5, 6\\}$ and coin outcomes be $\\{H, T\\}$.",
        "workedSolution": "(i) Let the die faces be $\\{1, 2, 3, 4, 5, 6\\}$ and coin outcomes be $\\{H, T\\}$.\n$$S = \\{(1,H), (1,T), (2,H), (2,T), (3,H), (3,T), (4,H), (4,T), (5,H), (5,T), (6,H), (6,T)\\}$$\nTotal outcomes $n(S) = 6 \\times 2 = 12$.\n\n(ii) Favorable outcomes with an odd number and a head:\n$$E = \\{(1,H), (3,H), (5,H)\\} \\implies n(E) = 3$$\n$$P(\\text{odd number and head}) = \\frac{n(E)}{n(S)} = \\frac{3}{12} = \\frac{1}{4}$$."
      },
      {
        "partLabel": "(b)",
        "marks": 5,
        "prompt": "The architectural plan of a playground is drawn to a linear scale of $1 : 200$. If the width and area of the playground on the map are $6\\text{ cm}$ and $72\\text{ cm}^2$ respectively, calculate the actual area of the playground in square metres ($\\text{m}^2$).",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "Linear scale $= 1 : 200$, which means $1\\text{ cm} = 200\\text{ cm} = 2\\text{ m}$.",
        "workedSolution": "Linear scale $= 1 : 200$, which means $1\\text{ cm} = 200\\text{ cm} = 2\\text{ m}$.\nArea scale factor $k^2 = (200)^2 = 40,000$.\n$$\\text{Actual area in cm}^2 = 72 \\times 40,000 = 2,880,000\\text{ cm}^2$$\nConvert to square metres ($1\\text{ m}^2 = 10,000\\text{ cm}^2$):\n$$\\text{Actual Area} = \\frac{2,880,000}{10,000} = 288\\text{ m}^2$.\n*(Alternative method: $1\\text{ cm}^2$ on map $= (2\\text{ m})^2 = 4\\text{ m}^2$ on ground; thus $72 \\times 4 = 288\\text{ m}^2$)*."
      },
      {
        "partLabel": "(c)",
        "marks": 5,
        "prompt": "Copy and complete the $3 \\times 3$ magic square below such that the sum of the numbers along each row, column, and diagonal is equal to $24$:<br/><svg viewBox='0 0 240 240' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><style>.cell-text { font-size: 16px; font-weight: bold; fill: #1e293b; text-anchor: middle; dominant-baseline: middle; }.given-text { font-size: 16px; font-weight: bold; fill: #2563eb; text-anchor: middle; dominant-baseline: middle; }</style></defs><!-- Grid Lines --><rect x='30' y='30' width='180' height='180' fill='#ffffff' stroke='#1e293b' stroke-width='2.5'/><line x1='90' y1='30' x2='90' y2='210' stroke='#1e293b' stroke-width='2'/><line x1='150' y1='30' x2='150' y2='210' stroke='#1e293b' stroke-width='2'/><line x1='30' y1='90' x2='210' y2='90' stroke='#1e293b' stroke-width='2'/><line x1='30' y1='150' x2='210' y2='150' stroke='#1e293b' stroke-width='2'/><!-- Given Numbers (Magic sum = 24, Center = 8) --><text x='60' y='60' class='given-text'>11</text><text x='120' y='60' class='cell-text'></text><text x='180' y='60' class='given-text'>9</text><text x='60' y='120' class='cell-text'></text><text x='120' y='120' class='given-text'>8</text><text x='180' y='120' class='cell-text'></text><text x='60' y='180' class='cell-text'></text><text x='120' y='180' class='cell-text'></text><text x='180' y='180' class='cell-text'></text></svg>",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "Target magic sum $= 24$. In a standard $3 \\times 3$ magic square, the central cell is $\\frac{24}{3} = 8$.",
        "workedSolution": "Target magic sum $= 24$. In a standard $3 \\times 3$ magic square, the central cell is $\\frac{24}{3} = 8$.\nRow 1: $11 + x_1 + 9 = 24 \\implies x_1 = 24 - 20 = 4$.\nMajor diagonal: $11 + 8 + x_9 = 24 \\implies x_9 = 24 - 19 = 5$.\nColumn 3: $9 + x_6 + 5 = 24 \\implies x_6 = 24 - 14 = 10$.\nMinor diagonal: $9 + 8 + x_7 = 24 \\implies x_7 = 24 - 17 = 7$.\nColumn 1: $11 + x_4 + 7 = 24 \\implies x_4 = 24 - 18 = 6$.\nColumn 2: $4 + 8 + x_8 = 24 \\implies x_8 = 24 - 12 = 12$.\n\nCompleted Magic Square:\n| 11 | 4 | 9 |\n| :---: | :---: | :---: |\n| 6 | 8 | 10 |\n| 7 | 12 | 5 |"
      }
    ]
  },
  {
    "id": "q02",
    "title": "Question 2: Structured Theory & Problem Solving",
    "totalMarks": 15,
    "points": 15,
    "format": "structured_essay",
    "prompt": "Answer all parts of this question:",
    "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
    "parts": [
      {
        "partLabel": "(a)",
        "marks": 6,
        "prompt": "Given the column vectors $\\mathbf{p} = \\begin{pmatrix} 2m + 5 \\\\ 3 - 2n \\end{pmatrix}$ and $\\mathbf{q} = \\begin{pmatrix} 4m - 1 \\\\ n - 9 \\end{pmatrix}$. If $\\mathbf{p} = \\mathbf{q}$, determine the values of $m$ and $n$.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "Equate corresponding vector components:",
        "workedSolution": "Equate corresponding vector components:\nTop components:\n$$2m + 5 = 4m - 1$$\n$$5 + 1 = 4m - 2m \\implies 2m = 6 \\implies m = 3$$\nBottom components:\n$$3 - 2n = n - 9$$\n$$3 + 9 = n + 2n \\implies 3n = 12 \\implies n = 4$$\nThus, $m = 3$ and $n = 4$."
      },
      {
        "partLabel": "(b)",
        "marks": 9,
        "prompt": "A mother shared an amount of money between her two daughters, Araba and Esi, in the ratio $5 : 4$. Araba received GH¢ 1,500.00.\n(i) Find the total amount shared.\n(ii) Esi deposited her entire share into a fixed savings account earning 15% simple interest per annum for 3 years. Calculate the total accrued amount in Esi's account at the end of the 3 years.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "(i) Araba's portion corresponds to 5 parts:",
        "workedSolution": "(i) Araba's portion corresponds to 5 parts:\n$$5\\text{ parts} = \\text{GH¢ } 1,500.00 \\implies 1\\text{ part} = \\frac{1,500.00}{5} = \\text{GH¢ } 300.00$$\nTotal ratio parts $= 5 + 4 = 9\\text{ parts}$.\n$$\\text{Total amount shared} = 9 \\times 300.00 = \\text{GH¢ } 2,700.00$$\n\n(ii) Esi's principal share:\n$$\\text{Principal } (P) = 4 \\times 300.00 = \\text{GH¢ } 1,200.00$$\n$$\\text{Simple Interest } (I) = \\frac{P \\times R \\times T}{100} = \\frac{1,200 \\times 15 \\times 3}{100} = 12 \\times 45 = \\text{GH¢ } 540.00$$\n$$\\text{Total accrued amount} = P + I = 1,200.00 + 540.00 = \\text{GH¢ } 1,740.00$$."
      }
    ]
  },
  {
    "id": "q03",
    "title": "Question 3: Structured Theory & Problem Solving",
    "totalMarks": 15,
    "points": 15,
    "format": "structured_essay",
    "prompt": "Answer all parts of this question:",
    "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
    "parts": [
      {
        "partLabel": "(a)",
        "marks": 5,
        "prompt": "Simplify the surd expression completely: $$4\\sqrt{32} + 3\\sqrt{20} - 2\\sqrt{2} + \\sqrt{5}$$.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "Decompose each radical into perfect square factors:",
        "workedSolution": "Decompose each radical into perfect square factors:\n$$\\sqrt{32} = \\sqrt{16 \\times 2} = 4\\sqrt{2} \\implies 4\\sqrt{32} = 4(4\\sqrt{2}) = 16\\sqrt{2}$$\n$$\\sqrt{20} = \\sqrt{4 \\times 5} = 2\\sqrt{5} \\implies 3\\sqrt{20} = 3(2\\sqrt{5}) = 6\\sqrt{5}$$\nSubstitute and collect like radicals:\n$$= (16\\sqrt{2} - 2\\sqrt{2}) + (6\\sqrt{5} + \\sqrt{5})$$\n$$= 14\\sqrt{2} + 7\\sqrt{5}$$."
      },
      {
        "partLabel": "(b)",
        "marks": 5,
        "prompt": "A wire of length $46\\text{ cm}$ is bent into the shape of a rectangle whose length is $5\\text{ cm}$ longer than its width. Calculate the area of the rectangle.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "Let width be $w\\text{ cm}$. Length $l = (w + 5)\\text{ cm}$.",
        "workedSolution": "Let width be $w\\text{ cm}$. Length $l = (w + 5)\\text{ cm}$.\nPerimeter formula: $2(l + w) = 46$\n$$2(w + 5 + w) = 46$$\n$$2(2w + 5) = 46 \\implies 4w + 10 = 46$$\n$$4w = 36 \\implies w = 9\\text{ cm}$$\n$$l = 9 + 5 = 14\\text{ cm}$$\n$$\\text{Area} = l \\times w = 14 \\times 9 = 126\\text{ cm}^2$$."
      },
      {
        "partLabel": "(c)",
        "marks": 5,
        "prompt": "If 12% of the length of a telecommunications transmission cable is $540\\text{ metres}$, find half of the total length of the cable.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "Let total length of cable be $L$.",
        "workedSolution": "Let total length of cable be $L$.\n$$\\frac{12}{100} \\times L = 540 \\implies L = \\frac{540 \\times 100}{12}$$\n$$L = 45 \\times 100 = 4,500\\text{ metres}$$\n$$\\text{Half of the length} = \\frac{4,500}{2} = 2,250\\text{ metres}$$."
      }
    ]
  },
  {
    "id": "q04",
    "title": "Question 4: Structured Theory & Problem Solving",
    "totalMarks": 15,
    "points": 15,
    "format": "structured_essay",
    "prompt": "Answer all parts of this question:",
    "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
    "parts": [
      {
        "partLabel": "(a)",
        "marks": 8,
        "prompt": "Using a ruler and a pair of compasses only:\n(i) Construct $\\triangle PQR$ such that $\\vert{}QR\\vert{} = 8\\text{ cm}$, $\\angle PQR = 90^\\circ$, and $\\vert{}PQ\\vert{} = 6\\text{ cm}$.\n(ii) Construct a perpendicular line from $Q$ to hypotenuse $PR$, meeting $PR$ at point $M$.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "(i) Steps of construction:",
        "workedSolution": "(i) Steps of construction:\n- Draw line segment $QR = 8\\text{ cm}$ using a ruler.\n- Construct a $90^\\circ$ perpendicular angle at vertex $Q$ using compass arcs.\n- Measure and mark off $PQ = 6\\text{ cm}$ on the perpendicular arm.\n- Join vertex $P$ to vertex $R$ to complete right-angled $\\triangle PQR$.\n\n(ii) Steps for dropping perpendicular from $Q$ to $PR$:\n- With needle at $Q$, strike an arc intersecting line $PR$ at two distinct points.\n- From these two intersection points, construct intersecting arcs on the opposite side.\n- Draw a straight line through $Q$ and the intersection of the arcs, meeting $PR$ perpendicularly at point $M$."
      },
      {
        "partLabel": "(b)",
        "marks": 7,
        "prompt": "From your accurate construction:<br/><svg viewBox='0 0 340 240' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><!-- Right Triangle PQR: P(60, 50), Q(60, 190), R(260, 190) --><polygon points='60,50 60,190 260,190' fill='#eff6ff' stroke='#1e40af' stroke-width='2.5'/><rect x='60' y='174' width='16' height='16' fill='none' stroke='#475569' stroke-width='1.5'/><!-- Perpendicular QM from Q(60,190) to PR --><!-- Vector PR: (200, 140). Parametric proj of Q onto line PR gives M(128.9, 98.3) --><line x1='60' y1='190' x2='129' y2='98' stroke='#dc2626' stroke-width='2' stroke-dasharray='4,3'/><!-- Right angle marker at M --><circle cx='129' cy='98' r='3.5' fill='#dc2626'/><!-- Labels --><text x='50' y='45' font-size='13' font-weight='bold' fill='#0f172a'>P</text><text x='45' y='202' font-size='13' font-weight='bold' fill='#0f172a'>Q</text><text x='270' y='200' font-size='13' font-weight='bold' fill='#0f172a'>R</text><text x='132' y='90' font-size='12' font-weight='bold' fill='#dc2626'>M</text><!-- Side lengths --><text x='28' y='125' font-size='11' font-weight='bold' fill='#1e3a8a'>6 cm</text><text x='160' y='210' font-size='11' font-weight='bold' fill='#1e3a8a' text-anchor='middle'>8 cm</text><text x='180' y='110' font-size='11' font-weight='bold' fill='#1e3a8a'>10 cm</text><text x='170' y='232' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg><br/>(i) Measure the length of line segment $|MR|$.<br/>(ii) Measure the length of altitude $|QM|$.<br/>(iii) Calculate, correct to the nearest whole number, the area of $\\triangle QMR$.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "By geometric theory for right triangle with legs 6 cm and 8 cm:",
        "workedSolution": "By geometric theory for right triangle with legs 6 cm and 8 cm:\nHypotenuse $\\vert{}PR\\vert{} = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$.\nArea of $\\triangle PQR = \\frac{1}{2} \\times 8 \\times 6 = 24\\text{ cm}^2$.\nSince Area $= \\frac{1}{2} \\times \\vert{}PR\\vert{} \\times \\vert{}QM\\vert{}$:\n$$24 = \\frac{1}{2} \\times 10 \\times \\vert{}QM\\vert{} \\implies \\vert{}QM\\vert{} = 4.8\\text{ cm}$$\nIn right $\\triangle QMR$:\n$$\\vert{}MR\\vert{} = \\sqrt{QR^2 - QM^2} = \\sqrt{8^2 - 4.8^2} = \\sqrt{64 - 23.04} = \\sqrt{40.96} = 6.4\\text{ cm}$$\n\n(i) $\\vert{}MR\\vert{} = 6.4\\text{ cm}$ (accept $\\pm 0.1\\text{ cm}$).\n(ii) $\\vert{}QM\\vert{} = 4.8\\text{ cm}$ (accept $\\pm 0.1\\text{ cm}$).\n(iii) $$\\text{Area of } \\triangle QMR = \\frac{1}{2} \\times \\vert{}MR\\vert{} \\times \\vert{}QM\\vert{} = \\frac{1}{2} \\times 6.4 \\times 4.8 = 15.36\\text{ cm}^2$$\nRounding to the nearest whole number gives **15 cm²**."
      }
    ]
  },
  {
    "id": "q05",
    "title": "Question 5: Structured Theory & Problem Solving",
    "totalMarks": 15,
    "points": 15,
    "format": "structured_essay",
    "prompt": "Answer all parts of this question:",
    "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
    "parts": [
      {
        "partLabel": "(a)",
        "marks": 8,
        "prompt": "In the diagram below, $\\triangle PQR$ is a geometric enlargement of $\\triangle PST$. $|PS| = 6\\text{ cm}$, $|QS| = 3\\text{ cm}$, and $|QR| = 15\\text{ cm}$:<br/><svg viewBox='0 0 360 210' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><!-- Triangle PQR: P(180, 25), Q(40, 175), R(320, 175) --><polygon points='180,25 40,175 320,175' fill='none' stroke='#1e293b' stroke-width='2.5'/><!-- Parallel line ST: S(96, 115), T(264, 115) --><line x1='96' y1='115' x2='264' y2='115' stroke='#2563eb' stroke-width='2.5'/><!-- Vertices --><text x='180' y='18' font-size='12' font-weight='bold' fill='#0f172a' text-anchor='middle'>P</text><text x='25' y='185' font-size='12' font-weight='bold' fill='#0f172a'>Q</text><text x='330' y='185' font-size='12' font-weight='bold' fill='#0f172a'>R</text><text x='82' y='115' font-size='12' font-weight='bold' fill='#2563eb'>S</text><text x='272' y='115' font-size='12' font-weight='bold' fill='#2563eb'>T</text><!-- Length Dimensions --><text x='125' y='65' font-size='11' font-weight='bold' fill='#1e3a8a'>6 cm</text><text x='55' y='145' font-size='11' font-weight='bold' fill='#1e3a8a'>3 cm</text><text x='180' y='195' font-size='11' font-weight='bold' fill='#16a34a' text-anchor='middle'>15 cm</text><text x='180' y='108' font-size='11' font-weight='bold' fill='#2563eb' text-anchor='middle'>ST</text><text x='180' y='205' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg><br/>(i) Calculate the length of segment $\\overline{ST}$.<br/>(ii) If $|PQ| = |PR|$, find the area of $\\triangle PQR$.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "(i) Total length $\\vert{}PQ\\vert{} = \\vert{}PS\\vert{} + \\vert{}QS\\vert{} = 6 + 3 = 9\\text{ cm}$.",
        "workedSolution": "(i) Total length $\\vert{}PQ\\vert{} = \\vert{}PS\\vert{} + \\vert{}QS\\vert{} = 6 + 3 = 9\\text{ cm}$.\nLinear scale factor $k$ of enlargement:\n$$k = \\frac{\\vert{}PQ\\vert{}}{\\vert{}PS\\vert{}} = \\frac{9}{6} = 1.5$$\nSince $\\triangle PQR$ is an enlargement of $\\triangle PST$, line $ST$ is parallel to $QR$:\n$$\\frac{\\vert{}QR\\vert{}}{\\vert{}ST\\vert{}} = 1.5 \\implies \\vert{}ST\\vert{} = \\frac{\\vert{}QR\\vert{}}{1.5} = \\frac{15}{1.5} = 10\\text{ cm}$$.\n\n(ii) If $\\vert{}PQ\\vert{} = \\vert{}PR\\vert{} = 9\\text{ cm}$, $\\triangle PQR$ is an isosceles triangle with base $\\vert{}QR\\vert{} = 15\\text{ cm}$.\nDraw vertical perpendicular altitude $h$ from $P$ to base $QR$, bisecting base into $7.5\\text{ cm}$ segments:\n$$h = \\sqrt{\\vert{}PQ\\vert{}^2 - 7.5^2} = \\sqrt{9^2 - 7.5^2} = \\sqrt{81 - 56.25} = \\sqrt{24.75} \\approx 4.975\\text{ cm}$$\n$$\\text{Area of } \\triangle PQR = \\frac{1}{2} \\times \\text{base} \\times h = \\frac{1}{2} \\times 15 \\times 4.975 \\approx 37.31\\text{ cm}^2$$."
      },
      {
        "partLabel": "(b)",
        "marks": 7,
        "prompt": "The total area of a school estate is $1,200\\frac{1}{2}\\text{ m}^2$. The estate contains an Administration Block, Science Laboratories, Sports Arena, and Access Walkways. The areas occupied by the Administration Block, Science Laboratories, and Sports Arena are $400\\frac{1}{4}\\text{ m}^2$, $350\\frac{1}{2}\\text{ m}^2$, and $210\\frac{1}{8}\\text{ m}^2$ respectively. Calculate the remaining area covered by the Access Walkways.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "Sum the occupied areas:",
        "workedSolution": "Sum the occupied areas:\n$$400\\frac{1}{4} + 350\\frac{1}{2} + 210\\frac{1}{8}$$\n$$= (400 + 350 + 210) + \\left(\\frac{1}{4} + \\frac{1}{2} + \\frac{1}{8}\\right)$$\n$$= 960 + \\left(\\frac{2 + 4 + 1}{8}\\right) = 960\\frac{7}{8}\\text{ m}^2$$\nSubtract from total estate area:\n$$1,200\\frac{1}{2} - 960\\frac{7}{8}$$\nConvert fractions to eighths ($\\frac{1}{2} = \\frac{4}{8}$):\n$$= 1,200\\frac{4}{8} - 960\\frac{7}{8}$$\n$$= 1,199\\frac{12}{8} - 960\\frac{7}{8} = 239\\frac{5}{8}\\text{ m}^2$$\nIn decimal form: $239.625\\text{ m}^2$."
      }
    ]
  },
  {
    "id": "q06",
    "title": "Question 6: Structured Theory & Problem Solving",
    "totalMarks": 15,
    "points": 15,
    "format": "structured_essay",
    "prompt": "Answer all parts of this question:",
    "workedSolution": "See detailed step-by-step marking rubrics and derivations for each part below.",
    "parts": [
      {
        "partLabel": "(a)",
        "marks": 4,
        "prompt": "Copy and complete the table of values for the temperature relation: $$F = \\frac{9}{5}C + 32$$\n\n| °C | 0 | 5 | 10 | 15 | 20 | 25 | 30 |\n| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| °F | 32 | **?** | **?** | **?** | 68 | **?** | **?** |",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "Evaluate $F = \\frac{9}{5}C + 32$ for each Celsius value:",
        "workedSolution": "Evaluate $F = \\frac{9}{5}C + 32$ for each Celsius value:\n- $C = 5: F = \\frac{9}{5}(5) + 32 = 9 + 32 = 41$\n- $C = 10: F = \\frac{9}{5}(10) + 32 = 18 + 32 = 50$\n- $C = 15: F = \\frac{9}{5}(15) + 32 = 27 + 32 = 59$\n- $C = 20: F = \\frac{9}{5}(20) + 32 = 36 + 32 = 68$ (given)\n- $C = 25: F = \\frac{9}{5}(25) + 32 = 45 + 32 = 77$\n- $C = 30: F = \\frac{9}{5}(30) + 32 = 54 + 32 = 86$\n\nCompleted table:\n| °C | 0 | 5 | 10 | 15 | 20 | 25 | 30 |\n| °F | 32 | 41 | 50 | 59 | 68 | 77 | 86 |"
      },
      {
        "partLabel": "(b)",
        "marks": 5,
        "prompt": "Using a scale of 2 cm to 10 units on the vertical axis (°F) and 2 cm to 5 units on the horizontal axis (°C), plot the points and draw the straight line graph representing the relation for $0 \\le C \\le 30$.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "Axes drawn with clear calibration, origin at $(0, 0)$, all points $(0, 32), (5, 41), (10, 50), (15, 59), (20, 68), (25, 77), (30, 86)$ plotted and connected by a continuous ruler-drawn straight line.",
        "workedSolution": "Axes drawn with clear calibration, origin at $(0, 0)$, all points $(0, 32), (5, 41), (10, 50), (15, 59), (20, 68), (25, 77), (30, 86)$ plotted and connected by a continuous ruler-drawn straight line."
      },
      {
        "partLabel": "(c)",
        "marks": 3,
        "prompt": "Using your drawn graph:<br/><svg viewBox='0 0 340 280' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><pattern id='gridFtoC' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='#e2e8f0' stroke-width='0.9'/></pattern></defs><rect width='100%' height='100%' fill='url(#gridFtoC)'/><!-- Axes: Origin (50, 240) --><line x1='50' y1='240' x2='320' y2='240' stroke='#334155' stroke-width='2'/><polygon points='320,237 328,240 320,243' fill='#334155'/><text x='325' y='255' font-size='11' font-weight='bold' fill='#334155'>°C</text><line x1='50' y1='240' x2='50' y2='20' stroke='#334155' stroke-width='2'/><polygon points='47,20 50,12 53,20' fill='#334155'/><text x='25' y='22' font-size='11' font-weight='bold' fill='#334155'>°F</text><!-- Linear line F = (9/5)C + 32. Scale: 1 unit C = 8px, 1 unit F = 2.2pxC=0 -> (50, 240 - 32*2.2) = (50, 169.6)C=10 -> (130, 240 - 50*2.2) = (130, 130)C=20 -> (210, 240 - 68*2.2) = (210, 90.4)C=30 -> (290, 240 - 86*2.2) = (290, 50.8)--><line x1='50' y1='170' x2='290' y2='51' stroke='#2563eb' stroke-width='2.5'/><circle cx='50' cy='170' r='3.5' fill='#dc2626'/><circle cx='130' cy='130' r='3.5' fill='#dc2626'/><circle cx='210' cy='90' r='3.5' fill='#dc2626'/><circle cx='290' cy='51' r='3.5' fill='#dc2626'/><!-- Interpolation lines for F = 59°F -> C = 15°C: (170, 110) --><line x1='50' y1='110' x2='170' y2='110' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/><line x1='170' y1='110' x2='170' y2='240' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/><text x='20' y='114' font-size='9' font-weight='bold' fill='#d97706'>59°F</text><text x='170' y='255' font-size='9' font-weight='bold' fill='#d97706' text-anchor='middle'>15°C</text></svg><br/>Find the temperature in degrees Celsius (°C) when the Fahrenheit temperature is $F = 59^\\circ\\text{F}$.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "Locate $59^\\circ\\text{F}$ on the vertical axis, read horizontally across to the straight line, and read vertically downwards to the horizontal axis:",
        "workedSolution": "Locate $59^\\circ\\text{F}$ on the vertical axis, read horizontally across to the straight line, and read vertically downwards to the horizontal axis:\n$$C = 15^\\circ\\text{C}$$\n*(Algebraic check: $59 - 32 = 27 \\implies C = 27 \\times \\frac{5}{9} = 15^\\circ\\text{C}$)*."
      },
      {
        "partLabel": "(d)",
        "marks": 3,
        "prompt": "State the mathematical interpretation of the slope ($m = \\frac{9}{5}$) of this temperature conversion relation.",
        "hint": "Show all mathematical derivations, state formulas clearly, and simplify your final result.",
        "modelAnswer": "The slope $m = \\frac{9}{5} = 1.8$ represents the rate of change of temperature: for every $1^\\circ\\text{C}$ increase in temperature, the temperature in Fahrenheit increases by $1.8^\\circ\\text{F}$ (or for every $5^\\circ\\text{C}$ rise, Fahrenheit increases by $9^\\circ\\text{F}$).",
        "workedSolution": "The slope $m = \\frac{9}{5} = 1.8$ represents the rate of change of temperature: for every $1^\\circ\\text{C}$ increase in temperature, the temperature in Fahrenheit increases by $1.8^\\circ\\text{F}$ (or for every $5^\\circ\\text{C}$ rise, Fahrenheit increases by $9^\\circ\\text{F}$)."
      }
    ]
  }
]
};
