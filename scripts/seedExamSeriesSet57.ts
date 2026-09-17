import * as admin from 'firebase-admin';
import * as fs from 'fs';

const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}
const db = admin.firestore();

const pieChartSvg = `<svg viewBox='0 0 340 220' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <g transform='translate(110, 110)'>
    <!-- Women: 120° (0° to 120°) -->
    <path d='M 0 0 L 80 0 A 80 80 0 0 1 -40 69.28 Z' fill='#3b82f6' stroke='#ffffff' stroke-width='1.5'/>
    <!-- Men: 100° (120° to 220°) -->
    <path d='M 0 0 L -40 69.28 A 80 80 0 0 1 -61.28 -51.42 Z' fill='#10b981' stroke='#ffffff' stroke-width='1.5'/>
    <!-- Boys: 80° (220° to 300°) -->
    <path d='M 0 0 L -61.28 -51.42 A 80 80 0 0 1 40 -69.28 Z' fill='#f59e0b' stroke='#ffffff' stroke-width='1.5'/>
    <!-- Girls: 60° (300° to 360°) -->
    <path d='M 0 0 L 40 -69.28 A 80 80 0 0 1 80 0 Z' fill='#ef4444' stroke='#ffffff' stroke-width='1.5'/>
  </g>
  <g transform='translate(215, 45)'>
    <circle cx='10' cy='15' r='5' fill='#3b82f6'/><text x='24' y='19' font-size='11' font-weight='bold' fill='#334155'>Women (120°)</text>
    <circle cx='10' cy='45' r='5' fill='#10b981'/><text x='24' y='49' font-size='11' font-weight='bold' fill='#334155'>Men (100°)</text>
    <circle cx='10' cy='75' r='5' fill='#f59e0b'/><text x='24' y='79' font-size='11' font-weight='bold' fill='#334155'>Boys (80°)</text>
    <circle cx='10' cy='105' r='5' fill='#ef4444'/><text x='24' y='109' font-size='11' font-weight='bold' fill='#334155'>Girls (60°)</text>
  </g>
</svg>`;

const cartesianGridSvg = `<svg viewBox='0 0 360 360' width='100%' height='290' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <defs>
    <pattern id='gridBECE' width='16' height='16' patternUnits='userSpaceOnUse'>
      <path d='M 16 0 L 0 0 0 16' fill='none' stroke='#e2e8f0' stroke-width='0.8'/>
    </pattern>
  </defs>
  <rect width='100%' height='100%' fill='url(#gridBECE)'/>
  <!-- Axes: Origin (180, 180), Scale: 1 unit = 14px -->
  <line x1='20' y1='180' x2='340' y2='180' stroke='#475569' stroke-width='2'/>
  <polygon points='340,177 348,180 340,183' fill='#475569'/>
  <text x='342' y='196' font-size='11' font-weight='bold' fill='#334155'>x</text>
  <line x1='180' y1='340' x2='180' y2='20' stroke='#475569' stroke-width='2'/>
  <polygon points='177,20 180,12 183,20' fill='#475569'/>
  <text x='192' y='18' font-size='11' font-weight='bold' fill='#334155'>y</text>
  <text x='168' y='195' font-size='10' fill='#64748b'>O</text>
  <!-- ABCD: A(2,4) -> (208, 124), B(2,8) -> (208, 68), C(8,8) -> (292, 68), D(8,4) -> (292, 124) -->
  <polygon points='208,124 208,68 292,68 292,124' fill='#bfdbfe' fill-opacity='0.4' stroke='#1d4ed8' stroke-width='2'/>
  <text x='202' y='136' font-size='9' font-weight='bold' fill='#1d4ed8'>A(2,4)</text>
  <text x='202' y='64' font-size='9' font-weight='bold' fill='#1d4ed8'>B(2,8)</text>
  <text x='296' y='64' font-size='9' font-weight='bold' fill='#1d4ed8'>C(8,8)</text>
  <text x='296' y='136' font-size='9' font-weight='bold' fill='#1d4ed8'>D(8,4)</text>
  <!-- A1B1C1D1: A1(-3,2)->(138, 152), B1(-3,6)->(138, 96), C1(3,6)->(222, 96), D1(3,2)->(222, 152) -->
  <polygon points='138,152 138,96 222,96 222,152' fill='#bbf7d0' fill-opacity='0.4' stroke='#15803d' stroke-width='2'/>
  <text x='96' y='160' font-size='9' font-weight='bold' fill='#15803d'>A₁(-3,2)</text>
  <text x='96' y='94' font-size='9' font-weight='bold' fill='#15803d'>B₁(-3,6)</text>
  <!-- A2B2C2D2: A2(-2,4)->(152, 124), B2(-2,8)->(152, 68), C2(-8,8)->(68, 68), D2(-8,4)->(68, 124) -->
  <polygon points='152,124 152,68 68,68 68,124' fill='#fef08a' fill-opacity='0.4' stroke='#a16207' stroke-width='2'/>
  <text x='155' y='134' font-size='9' font-weight='bold' fill='#a16207'>A₂(-2,4)</text>
  <text x='155' y='64' font-size='9' font-weight='bold' fill='#a16207'>B₂(-2,8)</text>
  <!-- Line connecting A2(-2,4) and B1(-3,6) -->
  <line x1='152' y1='124' x2='138' y2='96' stroke='#dc2626' stroke-width='2' stroke-dasharray='4,2'/>
</svg>`;

const questions = [
  {
    id: 'q01',
    title: 'Question 1: Set Operations & Combined Fractions Simplification',
    totalMarks: 15,
    format: 'structured_essay',
    parts: [
      {
        partLabel: '(a)',
        marks: 8,
        prompt: `Given the sets:
$$A = \\{\\text{multiples of } 3 \\text{ less than } 12\\}$$
$$B = \\{\\text{integers between } 4 \\text{ and } 8\\}$$
$$C = \\{4, 5, 7\\}$$

Find:
(i) $A \\cap B$
(ii) $(A \\cup B) \\cap C$
(iii) $(A \\cap B) \\cup C$`,
        hint: 'List the members of sets A and B explicitly first. Multiples of 3 less than 12 are {3, 6, 9}. Integers between 4 and 8 (exclusive) are {5, 6, 7}.',
        modelAnswer: '(i) {6}; (ii) {5, 7}; (iii) {4, 5, 6, 7}',
        workedSolution: `**(i) Intersection ($A \\cap B$):**
Listing the elements:
$$A = \\{3, 6, 9\\}$$
$$B = \\{5, 6, 7\\}$$
The elements common to both $A$ and $B$:
$$A \\cap B = \\{6\\}$$

**(ii) Combined Operation ($(A \\cup B) \\cap C$):**
Determine the union of $A$ and $B$:
$$A \\cup B = \\{3, 5, 6, 7, 9\\}$$
Given $C = \\{4, 5, 7\\}$, take the intersection with $(A \\cup B)$:
$$(A \\cup B) \\cap C = \\{5, 7\\}$$

**(iii) Combined Operation ($(A \\cap B) \\cup C$):**
From (a)(i), $A \\cap B = \\{6\\}$.
Combining with $C = \\{4, 5, 7\\}$:
$$(A \\cap B) \\cup C = \\{4, 5, 6, 7\\}$$.`
      },
      {
        partLabel: '(b)',
        marks: 7,
        prompt: `Simplify:
$$1\\frac{3}{4} - 2\\frac{5}{6} - 1\\frac{9}{10} + 4\\frac{7}{8}$$`,
        hint: 'Convert all mixed fractions to improper fractions with common denominator LCM(4, 6, 10, 8) = 120.',
        modelAnswer: '1\\frac{107}{120} \\text{ or } \\frac{227}{120}',
        workedSolution: `Convert all mixed fractions to improper fractions:
$$1\\frac{3}{4} = \\frac{7}{4}$$
$$2\\frac{5}{6} = \\frac{17}{6}$$
$$1\\frac{9}{10} = \\frac{19}{10}$$
$$4\\frac{7}{8} = \\frac{39}{8}$$

Find the Lowest Common Multiple (LCM) of denominators 4, 6, 10, and 8:
$$\\text{LCM}(4, 6, 10, 8) = 120$$

Express all fractions over the common denominator 120:
$$\\frac{7}{4} - \\frac{17}{6} - \\frac{19}{10} + \\frac{39}{8} = \\frac{30(7) - 20(17) - 12(19) + 15(39)}{120}$$
$$= \\frac{210 - 340 - 228 + 585}{120}$$
$$= \\frac{795 - 568}{120} = \\frac{227}{120}$$

Convert to mixed number:
$$= 1\\frac{107}{120}$$.`
      }
    ]
  },
  {
    id: 'q02',
    title: 'Question 2: Arithmetic Order of Operations, Binomial Expansion & Distance-Speed Modeling',
    totalMarks: 15,
    format: 'structured_essay',
    parts: [
      {
        partLabel: '(a)',
        marks: 3,
        prompt: `Simplify:
$$15(4 - 6) \\times 49 \\div 7$$`,
        hint: 'Perform operations inside brackets first: (4 - 6) = -2, then proceed left to right for multiplication and division.',
        modelAnswer: '-210',
        workedSolution: `Evaluate operations inside parentheses first:
$$4 - 6 = -2$$

Substitute back into the expression:
$$15(-2) \\times 49 \\div 7 = -30 \\times 49 \\div 7$$

Divide 49 by 7:
$$-30 \\times 7 = -210$$.`
      },
      {
        partLabel: '(b)',
        marks: 5,
        prompt: `Expand and simplify:
$$b(12a - 3) - (a - b)(3 + b)$$`,
        hint: 'Expand b(12a - 3), expand (a - b)(3 + b), and distribute the negative sign carefully.',
        modelAnswer: 'b^2 + 11ab - 3a',
        workedSolution: `Expand the first term:
$$b(12a - 3) = 12ab - 3b$$

Expand the binomial product $(a - b)(3 + b)$:
$$(a - b)(3 + b) = a(3 + b) - b(3 + b) = 3a + ab - 3b - b^2$$

Subtract the expanded product from the first term:
$$12ab - 3b - (3a + ab - 3b - b^2) = 12ab - 3b - 3a - ab + 3b + b^2$$

Group and collect like terms:
$$= b^2 + (12ab - ab) + (-3b + 3b) - 3a$$
$$= b^2 + 11ab - 3a$$.`
      },
      {
        partLabel: '(c)',
        marks: 7,
        prompt: `Akosua walked for 3 hours at the rate of $1\\frac{1}{2}\\text{ km/h}$ from her village to Paamu to take a bus to Quamu. If the bus travelling at $15\\frac{1}{2}\\text{ km/h}$ takes 2 hours to travel from Paamu to Quamu:
(i) What is the distance from Akosua's village to Quamu?
(ii) How long would it take a man, riding a bicycle at $5\\text{ km/h}$, to travel from Akosua's village to Quamu?`,
        hint: 'Distance = Speed × Time. Calculate walking distance and bus distance separately, then add for total distance.',
        modelAnswer: '(i) 35.5 km; (ii) 7.1 hours (7 hours 6 minutes)',
        workedSolution: `**(i) Distance from Akosua's village to Quamu:**
Walking leg (Village to Paamu):
$$\\text{Speed}_1 = 1\\frac{1}{2}\\text{ km/h} = 1.5\\text{ km/h}, \\quad \\text{Time}_1 = 3\\text{ hours}$$
$$\\text{Distance}_1 = \\text{Speed}_1 \\times \\text{Time}_1 = 1.5 \\times 3 = 4.5\\text{ km}$$

Bus leg (Paamu to Quamu):
$$\\text{Speed}_2 = 15\\frac{1}{2}\\text{ km/h} = 15.5\\text{ km/h}, \\quad \\text{Time}_2 = 2\\text{ hours}$$
$$\\text{Distance}_2 = \\text{Speed}_2 \\times \\text{Time}_2 = 15.5 \\times 2 = 31\\text{ km}$$

Total distance:
$$\\text{Total Distance} = 4.5 + 31 = 35.5\\text{ km}$$

**(ii) Time taken by bicycle rider:**
$$\\text{Speed} = 5\\text{ km/h}, \\quad \\text{Distance} = 35.5\\text{ km}$$
$$\\text{Time} = \\frac{\\text{Distance}}{\\text{Speed}} = \\frac{35.5}{5} = 7.1\\text{ hours}$$

Convert decimal hours to hours and minutes:
$$0.1\\text{ hour} = 0.1 \\times 60\\text{ minutes} = 6\\text{ minutes}$$
$$\\text{Total Time} = 7\\text{ hours } 6\\text{ minutes}$$.`
      }
    ]
  },
  {
    id: 'q03',
    title: 'Question 3: Laws of Indices, Algebraic Factorization & Percentage Financial Sharing',
    totalMarks: 15,
    format: 'structured_essay',
    parts: [
      {
        partLabel: '(a)',
        marks: 4,
        prompt: `(i) Express $8 \\times 32 \\times 4 \\times 2$ in the form $2^m$.
(ii) Using your answer in (a)(i), state the value of $m$.`,
        hint: 'Express each term as powers of 2: 8 = 2^3, 32 = 2^5, 4 = 2^2, 2 = 2^1.',
        modelAnswer: '(i) 2^11; (ii) m = 11',
        workedSolution: `**(i) Express in powers of 2:**
$$8 = 2^3$$
$$32 = 2^5$$
$$4 = 2^2$$
$$2 = 2^1$$

Apply product law of indices ($a^x \\times a^y = a^{x+y}$):
$$8 \\times 32 \\times 4 \\times 2 = 2^3 \\times 2^5 \\times 2^2 \\times 2^1 = 2^{3 + 5 + 2 + 1} = 2^{11}$$

**(ii) Value of m:**
$$2^m = 2^{11} \\implies m = 11$$.`
      },
      {
        partLabel: '(b)',
        marks: 5,
        prompt: `(i) Factorize the expression:
$$\\pi n^2k - \\frac{1}{4}\\pi n^2Q$$
(ii) Use your answer in (b)(i) to find the value of the expression when $\\pi = \\frac{22}{7}$, $n = 2$, $k = 19$, and $Q = 20$.`,
        hint: 'Factor out the common factor πn^2. Then substitute the given numerical values.',
        modelAnswer: '(i) \\pi n^2(k - \\frac{Q}{4}); (ii) 176',
        workedSolution: `**(i) Factorization:**
Factor out common algebraic term $\\pi n^2$:
$$\\pi n^2k - \\frac{1}{4}\\pi n^2Q = \\pi n^2\\left(k - \\frac{Q}{4}\\right)$$

**(ii) Numerical Evaluation:**
Substitute $\\pi = \\frac{22}{7}, n = 2, k = 19, Q = 20$:
$$= \\frac{22}{7} \\times (2)^2 \\times \\left(19 - \\frac{20}{4}\\right)$$
$$= \\frac{22}{7} \\times 4 \\times (19 - 5)$$
$$= \\frac{22}{7} \\times 4 \\times 14$$
$$= 22 \\times 4 \\times 2 = 176$$.`
      },
      {
        partLabel: '(c)',
        marks: 6,
        prompt: `Gifty and Justina shared an amount of GH¢ 418.00. If Gifty had 20% more than Justina, how much did Justina receive?`,
        hint: 'Let Justina receive x. Then Gifty receives x + 0.20x = 1.20x. Their sum equals 418.00.',
        modelAnswer: 'GH¢ 190.00',
        workedSolution: `Let the amount Justina received be $x$.
Gifty received 20% more than Justina:
$$\\text{Gifty's share} = x + 0.20x = 1.20x$$

Total amount shared is GH¢ 418.00:
$$x + 1.20x = 418.00$$
$$2.20x = 418.00$$
$$x = \\frac{418.00}{2.20} = \\text{GH¢ } 190.00$$

Justina received **GH¢ 190.00**.`
      }
    ]
  },
  {
    id: 'q04',
    title: 'Question 4: Quadratic Equation Solving & Demographic Sector Angle Pie Chart',
    totalMarks: 15,
    format: 'structured_essay',
    diagramSvg: pieChartSvg,
    parts: [
      {
        partLabel: '(a)',
        marks: 6,
        prompt: `If $4m - 2(3 + 2m) + m(2m + 4) = 0$, find the values of $m$.`,
        hint: 'Expand all terms: 4m - 6 - 4m + 2m^2 + 4m = 0. Simplify to standard form 2m^2 + 4m - 6 = 0, then factorize.',
        modelAnswer: 'm = -3 \\text{ and } m = 1',
        workedSolution: `Expand the brackets:
$$4m - 6 - 4m + 2m^2 + 4m = 0$$

Combine like terms:
$$(4m - 4m + 4m) + 2m^2 - 6 = 0$$
$$2m^2 + 4m - 6 = 0$$

Divide through by 2:
$$m^2 + 2m - 3 = 0$$

Factorize the quadratic expression:
$$(m + 3)(m - 1) = 0$$

Solve for $m$:
$$m + 3 = 0 \\implies m = -3$$
$$m - 1 = 0 \\implies m = 1$$

The values of $m$ are **$-3$ and $1$**.`
      },
      {
        partLabel: '(b)',
        marks: 9,
        prompt: `At a political rally, there were 240 women, 200 men, 160 boys, and 120 girls:
(i) Draw a pie chart to illustrate the information.
(ii) What percentage of the people at the rally were females?`,
        diagramSvg: pieChartSvg,
        hint: 'Find total attendees: 240 + 200 + 160 + 120 = 720. Calculate sector angle for each category using (frequency / 720) × 360°. Female count = women + girls.',
        modelAnswer: '(i) Angles: Women = 120°, Men = 100°, Boys = 80°, Girls = 60°; (ii) 50%',
        workedSolution: `**(i) Calculation of Sector Angles:**
$$\\text{Total attendance} = 240 + 200 + 160 + 120 = 720$$

$$\\text{Women} = \\frac{240}{720} \\times 360^\\circ = 120^\\circ$$
$$\\text{Men} = \\frac{200}{720} \\times 360^\\circ = 100^\\circ$$
$$\\text{Boys} = \\frac{160}{720} \\times 360^\\circ = 80^\\circ$$
$$\\text{Girls} = \\frac{120}{720} \\times 360^\\circ = 60^\\circ$$

*(See vector pie chart above illustrating the 120°, 100°, 80°, and 60° sectors).*

**(ii) Percentage of Females:**
Total females = Women + Girls:
$$\\text{Females} = 240 + 120 = 360$$

$$\\text{Percentage} = \\frac{360}{720} \\times 100\\% = 50\\%$$.`
      }
    ]
  },
  {
    id: 'q05',
    title: 'Question 5: Algebraic Fractional Land Partitioning & Percentages',
    totalMarks: 15,
    format: 'structured_essay',
    parts: [
      {
        partLabel: '(a)',
        marks: 3,
        prompt: `Madam Esi used $\\frac{1}{4}$ and $\\frac{2}{3}$ of her $x$ acres of land to cultivate mangoes and oranges respectively.
Express, in terms of $x$, the number of acres of land she used to cultivate:
(i) mangoes;
(ii) oranges.`,
        hint: 'Multiply the fractional share by total acreage x.',
        modelAnswer: '(i) \\frac{x}{4} \\text{ acres}; (ii) \\frac{2x}{3} \\text{ acres}',
        workedSolution: `(i) $\\text{Acres for mangoes} = \\frac{1}{4} \\times x = \\frac{x}{4}\\text{ acres}$
(ii) $\\text{Acres for oranges} = \\frac{2}{3} \\times x = \\frac{2x}{3}\\text{ acres}$`
      },
      {
        partLabel: '(b)',
        marks: 5,
        prompt: `If Madam Esi used 20 more acres of land to cultivate oranges than mangoes, find the value of $x$.`,
        hint: 'Set up equation: (2x/3) - (x/4) = 20. Clear fractions by multiplying through by LCM 12.',
        modelAnswer: 'x = 48 \\text{ acres}',
        workedSolution: `Set up the difference equation:
$$\\frac{2x}{3} - \\frac{x}{4} = 20$$

Multiply every term by the LCM (12):
$$12\\left(\\frac{2x}{3}\\right) - 12\\left(\\frac{x}{4}\\right) = 12(20)$$
$$4(2x) - 3(x) = 240$$
$$8x - 3x = 240$$
$$5x = 240 \\implies x = \\frac{240}{5} = 48$$

The total area of land is **$x = 48$ acres**.`
      },
      {
        partLabel: '(c)',
        marks: 3,
        prompt: `How many acres of land was used to cultivate mangoes?`,
        hint: 'Substitute x = 48 into the mango acreage expression x / 4.',
        modelAnswer: '12 \\text{ acres}',
        workedSolution: `$$\\text{Acres for mangoes} = \\frac{x}{4} = \\frac{48}{4} = 12\\text{ acres}$$.`
      },
      {
        partLabel: '(d)',
        marks: 4,
        prompt: `Calculate, correct to the nearest whole number, the percentage of the land that was not used.`,
        hint: 'Total cultivated = mangoes (12) + oranges (32) = 44. Unused = 48 - 44 = 4. Find (4 / 48) × 100%.',
        modelAnswer: '8%',
        workedSolution: `Acreage for oranges:
$$\\text{Acres for oranges} = \\frac{2(48)}{3} = 32\\text{ acres}$$

Total land cultivated:
$$\\text{Cultivated} = 12 + 32 = 44\\text{ acres}$$

Total uncultivated land:
$$\\text{Uncultivated} = 48 - 44 = 4\\text{ acres}$$

Percentage of uncultivated land:
$$\\text{Percentage} = \\frac{4}{48} \\times 100\\% = \\frac{1}{12} \\times 100\\% \\approx 8.33\\%$$

Correct to the nearest whole number: **8%**.`
      }
    ]
  },
  {
    id: 'q06',
    title: 'Question 6: Cartesian Coordinate Geometry, Vector Translation & Axial Reflection',
    totalMarks: 15,
    format: 'structured_essay',
    diagramSvg: cartesianGridSvg,
    parts: [
      {
        partLabel: '(a)',
        marks: 3,
        prompt: `Using a scale of 2 cm to 2 units on both axes, draw on a graph sheet two perpendicular axes, $Ox$ and $Oy$, for the interval $-10 \\le x \\le 10$ and $-10 \\le y \\le 10$.`,
        hint: 'Label the axes with scale 2 units per major division and mark the origin O(0,0).',
        modelAnswer: 'Refer to Cartesian grid illustration.',
        workedSolution: `Draw perpendicular axes $Ox$ and $Oy$ intersecting at origin $(0,0)$ with scale marked from $-10$ to $10$ on both axes. *(See rendered vector Cartesian grid above).*`
      },
      {
        partLabel: '(b)',
        marks: 8,
        prompt: `On the same graph sheet, draw:
(i) a quadrilateral $ABCD$ with vertices $A(2,4)$, $B(2,8)$, $C(8,8)$, and $D(8,4)$;
(ii) the image $A_1 B_1 C_1 D_1$ of $ABCD$ under a translation by vector $\\begin{pmatrix} -5 \\\\ -2 \\end{pmatrix}$, where $A \\to A_1$, $B \\to B_1$, $C \\to C_1$, and $D \\to D_1$;
(iii) the image $A_2 B_2 C_2 D_2$ of $ABCD$ under a reflection in the $y$-axis, where $A \\to A_2$, $B \\to B_2$, $C \\to C_2$, and $D \\to D_2$.`,
        diagramSvg: cartesianGridSvg,
        hint: 'Translation: add vector (-5, -2) to each coordinate. Reflection in y-axis: (x, y) -> (-x, y).',
        modelAnswer: `(i) A(2,4), B(2,8), C(8,8), D(8,4); (ii) A1(-3,2), B1(-3,6), C1(3,6), D1(3,2); (iii) A2(-2,4), B2(-2,8), C2(-8,8), D2(-8,4)`,
        workedSolution: `**(i) Quadrilateral ABCD:**
Plot vertices $A(2,4), B(2,8), C(8,8), D(8,4)$ and join sequentially.

**(ii) Translation under $\\vec{v} = \\begin{pmatrix} -5 \\\\ -2 \\end{pmatrix}$:**
$$A_1 = \\begin{pmatrix} 2 \\\\ 4 \\end{pmatrix} + \\begin{pmatrix} -5 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix} \\implies A_1(-3, 2)$$
$$B_1 = \\begin{pmatrix} 2 \\\\ 8 \\end{pmatrix} + \\begin{pmatrix} -5 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} -3 \\\\ 6 \\end{pmatrix} \\implies B_1(-3, 6)$$
$$C_1 = \\begin{pmatrix} 8 \\\\ 8 \\end{pmatrix} + \\begin{pmatrix} -5 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 6 \\end{pmatrix} \\implies C_1(3, 6)$$
$$D_1 = \\begin{pmatrix} 8 \\\\ 4 \\end{pmatrix} + \\begin{pmatrix} -5 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix} \\implies D_1(3, 2)$$

**(iii) Reflection in the $y$-axis: $(x, y) \\to (-x, y)$:**
$$A_2(-2, 4)$$
$$B_2(-2, 8)$$
$$C_2(-8, 8)$$
$$D_2(-8, 4)$$`
      },
      {
        partLabel: '(c)',
        marks: 4,
        prompt: `(i) What type of quadrilateral is $ABCD$?
(ii) Find the gradient of line $A_2 B_1$.`,
        hint: 'Examine lengths of sides: AB = 4, CD = 4, BC = 6, AD = 6. All angles are 90°. For gradient m = (y2 - y1) / (x2 - x1) between A2(-2,4) and B1(-3,6).',
        modelAnswer: '(i) Rectangle; (ii) -2',
        workedSolution: `**(i) Classification of ABCD:**
$$|AB| = 8 - 4 = 4\\text{ units}$$
$$|CD| = 8 - 4 = 4\\text{ units}$$
$$|BC| = 8 - 2 = 6\\text{ units}$$
$$|AD| = 8 - 2 = 6\\text{ units}$$
Opposite sides are equal and parallel, and adjacent sides intersect at right angles ($90^\\circ$).
Therefore, quadrilateral $ABCD$ is a **Rectangle**.

**(ii) Gradient of line $A_2 B_1$:**
Given points $A_2(-2, 4)$ and $B_1(-3, 6)$:
$$\\text{Gradient } (m) = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{6 - 4}{-3 - (-2)} = \\frac{2}{-3 + 2} = \\frac{2}{-1} = -2$$.`
      }
    ]
  }
];

async function seedSet57() {
  console.log('🚀 Seeding Set 57: 2023 BECE Mathematics Paper 2 (Theory)...\n');

  const setId = 'jhs-math-mastery-series-57';
  const docRef = db.doc(`global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery/question_sets/${setId}`);

  const payload = {
    id: setId,
    title: 'Junior Core Mathematics • Structured Problem-Solving Series (Set 57)',
    topic: 'Structured Theory, Geometry & Data Modeling',
    tier: 'Junior Secondary (JHS)',
    subject: 'Mathematics',
    format: 'structured_essay',
    variantType: 'official',
    totalQuestions: questions.length,
    questions,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };

  await docRef.set(payload, { merge: true });
  console.log(`✅ Set 57 document written to ${docRef.path}`);

  // Update Topic Manifest
  const topicRef = db.doc('global_curriculum/jhs/subjects/math/topics/core_curriculum_mastery');
  await topicRef.set({
    id: 'core_curriculum_mastery',
    title: 'Core Curriculum Mastery',
    subjectId: 'math',
    levelId: 'jhs',
    questionSetIds: admin.firestore.FieldValue.arrayUnion(setId),
    lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log(`✅ Appended ${setId} to core_curriculum_mastery topic manifest.`);

  // Verify
  const snap = await docRef.get();
  if (snap.exists) {
    const d = snap.data()!;
    console.log(`\n🔍 VERIFIED: ${d.id} | Title: "${d.title}" | Questions: ${d.questions?.length}`);
  } else {
    throw new Error('Verification failed: Document does not exist!');
  }

  process.exit(0);
}

seedSet57().catch(err => {
  console.error('Error seeding Set 57:', err);
  process.exit(1);
});
