import * as admin from 'firebase-admin';
import * as fs from 'fs';

if (!admin.apps.length) {
  const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
  if (fs.existsSync(serviceAccountPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

const db = admin.firestore();

// 1. SVG Diagram for Paper 1 Q28 (Arrow Mapping)
const svgP1Q28 = `
<svg viewBox='0 0 320 110' width='100%' height='100' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='none' stroke='#cbd5e1' stroke-width='1.5'/>
  <text x='35' y='35' font-size='14' font-weight='bold' fill='#0f172a'>x</text>
  <text x='85' y='35' font-size='13' font-weight='600' fill='#1e293b'>1</text>
  <text x='135' y='35' font-size='13' font-weight='600' fill='#1e293b'>2</text>
  <text x='185' y='35' font-size='13' font-weight='600' fill='#1e293b'>3</text>
  <text x='235' y='35' font-size='13' font-weight='600' fill='#1e293b'>4</text>
  <text x='285' y='35' font-size='13' font-weight='600' fill='#1e293b'>5</text>
  
  <line x1='89' y1='45' x2='89' y2='68' stroke='#2563eb' stroke-width='2'/>
  <polygon points='86,68 89,75 92,68' fill='#2563eb'/>
  <line x1='139' y1='45' x2='139' y2='68' stroke='#2563eb' stroke-width='2'/>
  <polygon points='136,68 139,75 142,68' fill='#2563eb'/>
  <line x1='189' y1='45' x2='189' y2='68' stroke='#2563eb' stroke-width='2'/>
  <polygon points='186,68 189,75 192,68' fill='#2563eb'/>
  <line x1='239' y1='45' x2='239' y2='68' stroke='#2563eb' stroke-width='2'/>
  <polygon points='236,68 239,75 242,68' fill='#2563eb'/>
  <line x1='289' y1='45' x2='289' y2='68' stroke='#2563eb' stroke-width='2'/>
  <polygon points='286,68 289,75 292,68' fill='#2563eb'/>

  <text x='35' y='95' font-size='14' font-weight='bold' fill='#0f172a'>y</text>
  <text x='85' y='95' font-size='13' font-weight='600' fill='#1e293b'>3</text>
  <text x='135' y='95' font-size='13' font-weight='600' fill='#1e293b'>6</text>
  <text x='185' y='95' font-size='13' font-weight='600' fill='#1e293b'>9</text>
  <text x='235' y='95' font-size='13' font-weight='600' fill='#1e293b'>12</text>
  <text x='285' y='95' font-size='13' font-weight='600' fill='#1e293b'>15</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. SVG Diagram for Paper 1 Q30 (Isosceles Triangle between Parallel Lines)
const svgP1Q30 = `
<svg viewBox='0 0 360 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='none' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Top parallel line -->
  <line x1='20' y1='40' x2='340' y2='40' stroke='#1e293b' stroke-width='2'/>
  <polygon points='280,37 290,40 280,43' fill='#1e293b'/>
  <polygon points='290,37 300,40 290,43' fill='#1e293b'/>
  <!-- Bottom parallel line -->
  <line x1='20' y1='150' x2='340' y2='150' stroke='#1e293b' stroke-width='2'/>
  <polygon points='280,147 290,150 280,153' fill='#1e293b'/>
  <polygon points='290,147 300,150 290,153' fill='#1e293b'/>
  <!-- Triangle Legs -->
  <line x1='180' y1='40' x2='100' y2='150' stroke='#2563eb' stroke-width='2.5'/>
  <line x1='180' y1='40' x2='255' y2='150' stroke='#2563eb' stroke-width='2.5'/>
  <!-- Hash marks indicating equal sides -->
  <line x1='137' y1='91' x2='147' y2='99' stroke='#1e293b' stroke-width='2'/>
  <line x1='213' y1='99' x2='223' y2='91' stroke='#1e293b' stroke-width='2'/>
  <!-- Angle arcs -->
  <path d='M 165 60 A 25 25 0 0 0 195 60' fill='none' stroke='#dc2626' stroke-width='1.8'/>
  <text x='180' y='72' font-size='12' font-weight='bold' fill='#dc2626' text-anchor='middle'>2y</text>
  <path d='M 205 40 A 25 25 0 0 1 193 60' fill='none' stroke='#16a34a' stroke-width='1.8'/>
  <text x='215' y='55' font-size='12' font-weight='bold' fill='#16a34a'>56°</text>
  <text x='180' y='172' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 3. SVG Diagram for Paper 2 Q3(b) (L-shaped Room Floor)
const svgP2Q3 = `
<svg viewBox='0 0 340 200' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='none' stroke='#cbd5e1' stroke-width='1.5'/>
  <path d='M 45 35 L 285 35 L 285 105 L 145 105 L 145 165 L 45 165 Z' fill='rgba(219, 234, 254, 0.5)' stroke='#1e40af' stroke-width='2.5'/>
  <!-- Dimension Labels -->
  <text x='165' y='25' font-size='12' font-weight='bold' fill='#1e3a8a' text-anchor='middle'>8 m</text>
  <text x='30' y='105' font-size='12' font-weight='bold' fill='#1e3a8a' text-anchor='end'>5 m</text>
  <text x='298' y='75' font-size='12' font-weight='bold' fill='#1e3a8a'>3 m</text>
  <text x='215' y='125' font-size='12' font-weight='bold' fill='#1e3a8a' text-anchor='middle'>5 m</text>
  <text x='170' y='188' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 4. SVG Diagram for Paper 2 Q4(b) (Ladder Leaning against Building)
const svgP2Q4 = `
<svg viewBox='0 0 300 200' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='none' stroke='#cbd5e1' stroke-width='1.5'/>
  <line x1='30' y1='160' x2='270' y2='160' stroke='#334155' stroke-width='2'/>
  <line x1='210' y1='160' x2='210' y2='40' stroke='#0f172a' stroke-width='4'/>
  <rect x='194' y='144' width='16' height='16' fill='none' stroke='#475569' stroke-width='1.5'/>
  <line x1='70' y1='160' x2='210' y2='50' stroke='#2563eb' stroke-width='3'/>
  <path d='M 105 160 A 35 35 0 0 0 98 138' fill='none' stroke='#dc2626' stroke-width='2'/>
  <text x='112' y='152' font-size='12' font-weight='bold' fill='#dc2626'>60°</text>
  <text x='140' y='178' font-size='12' font-weight='bold' fill='#16a34a' text-anchor='middle'>5 m</text>
  <text x='125' y='95' font-size='12' font-weight='bold' fill='#2563eb'>Ladder (L)</text>
  <text x='225' y='100' font-size='12' font-weight='bold' fill='#0f172a'>Window (h)</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 40 Objective Questions for Paper 1
const paper1Questions = [
  {
    number: 1,
    prompt: "Arrange the following in descending order: $\\frac{3}{4}, \\frac{5}{8}, 0.8, 0.65$.",
    options: [
      "0.8, 3/4, 0.65, 5/8",
      "5/8, 0.8, 3/4, 0.65",
      "0.65, 5/8, 0.8, 3/4",
      "3/4, 5/8, 0.8, 0.65"
    ],
    correctAnswer: "0.8, 3/4, 0.65, 5/8",
    hint: "Convert all fractions to decimals: $3/4 = 0.75$, $5/8 = 0.625$.",
    workedSolution: "$$\\frac{3}{4} = 0.75, \\quad \\frac{5}{8} = 0.625$$\nArranging in descending order (largest to smallest): $$0.8 > 0.75 > 0.65 > 0.625 \\implies 0.8, \\frac{3}{4}, 0.65, \\frac{5}{8}$$.",
    points: 1
  },
  {
    number: 2,
    prompt: "Mr. Mensah left his house at 9:45 am and reached his village at 4:15 pm. Find the time spent.",
    options: [
      "5 hours 30 minutes",
      "8 hours",
      "6 hours 30 minutes",
      "7 hours"
    ],
    correctAnswer: "6 hours 30 minutes",
    hint: "Calculate elapsed time from 9:45 am to 12:00 noon, then add time to 4:15 pm.",
    workedSolution: "From 9:45 am to 12:00 noon $= 2\\text{ h } 15\\text{ min}$.\nFrom 12:00 noon to 4:15 pm $= 4\\text{ h } 15\\text{ min}$.\n$$\\text{Total time} = 2\\text{ h } 15\\text{ min} + 4\\text{ h } 15\\text{ min} = 6\\text{ hours } 30\\text{ minutes}$$.",
    points: 1
  },
  {
    number: 3,
    prompt: "In a test, $\\frac{2}{3}$ of the learners passed. If the number of learners who failed was 69, how many passed?",
    options: ["23", "138", "46", "207"],
    correctAnswer: "138",
    hint: "The fraction that failed is $1 - \\frac{2}{3} = \\frac{1}{3}$.",
    workedSolution: "$$\\text{Fraction failed} = 1 - \\frac{2}{3} = \\frac{1}{3}$$\n$$\\frac{1}{3} \\times \\text{Total} = 69 \\implies \\text{Total} = 69 \\times 3 = 207$$\n$$\\text{Number passed} = \\frac{2}{3} \\times 207 = 138$$.",
    points: 1
  },
  {
    number: 4,
    prompt: "Factorize completely: $3a^2b - 9ab^2$.",
    options: [
      "3ab(a - 3b)",
      "ab(3a - b)",
      "3ab(b - 3a)",
      "ab(3b - a)"
    ],
    correctAnswer: "3ab(a - 3b)",
    hint: "Identify the Highest Common Factor (HCF) of $3a^2b$ and $9ab^2$.",
    workedSolution: "$$\\text{HCF} = 3ab$$\n$$3a^2b - 9ab^2 = 3ab(a - 3b)$$.",
    points: 1
  },
  {
    number: 5,
    prompt: "Find the volume of a cube with side $5\\text{ m}$.",
    options: ["10 m³", "75 m³", "25 m³", "125 m³"],
    correctAnswer: "125 m³",
    hint: "$$V = s^3$$.",
    workedSolution: "$$V = 5^3 = 5 \\times 5 \\times 5 = 125\\text{ m}^3$$.",
    points: 1
  },
  {
    number: 6,
    prompt: "A trader sold an article for GH¢ 126.00 making a profit of 20%. Find the cost price of the item.",
    options: ["GH¢ 100.50", "GH¢ 105.00", "GH¢ 100.80", "GH¢ 151.20"],
    correctAnswer: "GH¢ 105.00",
    hint: "Selling Price corresponds to $120\\%$ of Cost Price.",
    workedSolution: "$$120\\% \\text{ of } CP = 126.00$$\n$$CP = \\frac{126.00}{1.20} = \\text{GH¢ } 105.00$$.",
    points: 1
  },
  {
    number: 7,
    prompt: "Write $0.000437$ in standard form.",
    options: [
      "4.37 × 10⁻⁴",
      "4.37 × 10⁻³",
      "4.37 × 10⁴",
      "4.37 × 10³"
    ],
    correctAnswer: "4.37 × 10⁻⁴",
    hint: "Move the decimal point 4 places to the right so that $1 \\le A < 10$.",
    workedSolution: "$$0.000437 = 4.37 \\times 10^{-4}$$.",
    points: 1
  },
  {
    number: 8,
    prompt: "Mary receives a commission of 15% on articles sold in a week. If her commission was GH¢ 60.00, how much sales did she make?",
    options: ["GH¢ 900.00", "GH¢ 90.00", "GH¢ 400.00", "GH¢ 40.00"],
    correctAnswer: "GH¢ 400.00",
    hint: "Commission $= 15\\% \\times \\text{Sales} = 60.00$.",
    workedSolution: "$$\\frac{15}{100} \\times \\text{Sales} = 60 \\implies \\text{Sales} = \\frac{60 \\times 100}{15} = 4 \\times 100 = \\text{GH¢ } 400.00$$.",
    points: 1
  },
  {
    number: 9,
    prompt: "Simplify: $\\sqrt{75} - \\sqrt{18} - \\sqrt{3} + \\sqrt{2}$.",
    options: [
      "4√3 - 2√2",
      "3√3 - 2√2",
      "4√3 + 2√2",
      "3√3 + 2√2"
    ],
    correctAnswer: "4√3 - 2√2",
    hint: "Simplify surds: $\\sqrt{75} = 5\\sqrt{3}$ and $\\sqrt{18} = 3\\sqrt{2}$.",
    workedSolution: "$$\\sqrt{75} = 5\\sqrt{3}, \\quad \\sqrt{18} = 3\\sqrt{2}$$\n$$(5\\sqrt{3} - \\sqrt{3}) + (-3\\sqrt{2} + \\sqrt{2}) = 4\\sqrt{3} - 2\\sqrt{2}$$.",
    points: 1
  },
  {
    number: 10,
    prompt: "Theresa was asked to select at random a letter from the word HAPPY. What is the probability that she selects the letter P?",
    options: ["1/5", "2/3", "2/5", "3/5"],
    correctAnswer: "2/5",
    hint: "Count total letters (5) and how many times P appears (2).",
    workedSolution: "$$\\text{Total letters} = 5, \\quad \\text{Count of P} = 2$$\n$$P(\\text{letter P}) = \\frac{2}{5}$$.",
    points: 1
  },
  {
    number: 11,
    prompt: "Find the image of the point $(2, -3)$ under the transformation $\\begin{pmatrix} x \\\\ y \\end{pmatrix} \\to \\begin{pmatrix} x \\\\ y - 2 \\end{pmatrix}$.",
    options: ["(2, 1)", "(2, -1)", "(2, -5)", "(2, 5)"],
    correctAnswer: "(2, -5)",
    hint: "Substitute $x = 2$ and $y = -3$: the new $y$-coordinate is $-3 - 2$.",
    workedSolution: "$$x' = 2$$\n$$y' = -3 - 2 = -5$$\n$$\\text{Image} = (2, -5)$$.",
    points: 1
  },
  {
    number: 12,
    prompt: "A square of area $144\\text{ cm}^2$ has the same perimeter as an equilateral triangle. Find the length of a side of the triangle.",
    options: ["10 cm", "16 cm", "14 cm", "18 cm"],
    correctAnswer: "16 cm",
    hint: "Find the side of the square: $\\sqrt{144} = 12\\text{ cm}$. Find perimeter: $4 \\times 12 = 48\\text{ cm}$. Divide by 3.",
    workedSolution: "$$\\text{Side of square} = \\sqrt{144} = 12\\text{ cm}$$\n$$\\text{Perimeter} = 4 \\times 12 = 48\\text{ cm}$$\n$$\\text{Side of equilateral triangle} = \\frac{48}{3} = 16\\text{ cm}$$.",
    points: 1
  },
  {
    number: 13,
    prompt: "Solve: $7 - 2x > 15 - 4x$.",
    options: ["x < -4", "x < 4", "x > -4", "x > 4"],
    correctAnswer: "x > 4",
    hint: "Collect $x$ terms on one side: $-2x + 4x > 15 - 7$.",
    workedSolution: "$$4x - 2x > 15 - 7 \\implies 2x > 8 \\implies x > 4$$.",
    points: 1
  },
  {
    number: 14,
    prompt: "Antwi has 20 mangoes and 20% are rotten. How many of them are not rotten?",
    options: ["4", "12", "8", "16"],
    correctAnswer: "16",
    hint: "If 20% are rotten, 80% are not rotten.",
    workedSolution: "$$\\text{Rotten mangoes} = \\frac{20}{100} \\times 20 = 4$$\n$$\\text{Not rotten} = 20 - 4 = 16$$.",
    points: 1
  },
  {
    number: 15,
    prompt: "A class of 42 learners shared some oranges and each received 11. If 22 learners shared the same number of oranges equally, how many will each get?",
    options: ["15", "21", "20", "22"],
    correctAnswer: "21",
    hint: "Find total oranges first: $42 \\times 11$, then divide by 22.",
    workedSolution: "$$\\text{Total oranges} = 42 \\times 11 = 462$$\n$$\\text{Each share for 22 learners} = \\frac{462}{22} = 21$$.",
    points: 1
  },
  {
    number: 16,
    prompt: "Make $y$ the subject of the relation: $p = \\frac{r - 4y}{3}$.",
    options: [
      "y = 1/4(3p - r)",
      "y = 1/4(r - 3p)",
      "y = 1/4(r + 3p)",
      "y = 1/4(r + p)"
    ],
    correctAnswer: "y = 1/4(r - 3p)",
    hint: "Multiply by 3: $3p = r - 4y$, then rearrange for $4y$.",
    workedSolution: "$$3p = r - 4y \\implies 4y = r - 3p \\implies y = \\frac{1}{4}(r - 3p)$$.",
    points: 1
  },
  {
    number: 17,
    prompt: "A number is chosen at random from the set $P = \\{1, 2, 3, 4, 5, \\dots, 10\\}$. What is the probability that the number is greater than 3?",
    options: ["3/10", "1/2", "7/10", "4/5"],
    correctAnswer: "7/10",
    hint: "Numbers strictly greater than 3 are 4, 5, 6, 7, 8, 9, 10 (7 elements).",
    workedSolution: "$$\\text{Favorable outcomes} = \\{4, 5, 6, 7, 8, 9, 10\\} = 7$$\n$$P(x > 3) = \\frac{7}{10}$$.",
    points: 1
  },
  {
    number: 18,
    prompt: "Kofi paid an interest of GH¢ 30.00 on a loan he took for 4 years. If the rate was 3% per annum simple interest, find the amount borrowed.",
    options: ["GH¢ 360.00", "GH¢ 250.00", "GH¢ 280.00", "GH¢ 90.00"],
    correctAnswer: "GH¢ 250.00",
    hint: "Rearrange simple interest formula: $P = \\frac{100 \\times I}{R \\times T}$.",
    workedSolution: "$$P = \\frac{100 \\times 30}{3 \\times 4} = \\frac{3000}{12} = \\text{GH¢ } 250.00$$.",
    points: 1
  },
  {
    number: 19,
    prompt: "A cyclist travelling at $20\\text{ km/h}$ covered a distance in 35 minutes. What time will it take to cover the same distance travelling at $28\\text{ km/h}$?",
    options: ["16 minutes", "48 minutes", "25 minutes", "49 minutes"],
    correctAnswer: "25 minutes",
    hint: "Inverse proportion: $\\text{Speed}_1 \\times \\text{Time}_1 = \\text{Speed}_2 \\times \\text{Time}_2$.",
    workedSolution: "$$\\text{Time} = \\frac{20 \\times 35}{28} = \\frac{700}{28} = 25\\text{ minutes}$$.",
    points: 1
  },
  {
    number: 20,
    prompt: "Which of the following is NOT a composite number?",
    options: ["24", "41", "39", "65"],
    correctAnswer: "41",
    hint: "A prime number has only two factors (1 and itself). 41 is prime.",
    workedSolution: "24, 39 ($3 \\times 13$), and 65 ($5 \\times 13$) are composite. 41 is a prime number.",
    points: 1
  },
  {
    number: 21,
    prompt: "Kofi had 150 birds. He sold 26 of them and kept the rest equally in 4 cages. How many birds were kept in each cage?",
    options: ["30", "35", "31", "36"],
    correctAnswer: "31",
    hint: "Subtract 26 from 150, then divide the remainder by 4.",
    workedSolution: "$$\\text{Remaining birds} = 150 - 26 = 124$$\n$$\\text{Per cage} = \\frac{124}{4} = 31$$.",
    points: 1
  },
  {
    number: 22,
    prompt: "If $(x + 2) : (x - 2) = 1 : 2$, find the value of $x$.",
    options: ["-2", "-6", "-3", "-35"],
    correctAnswer: "-6",
    hint: "Write as a fraction: $\\frac{x + 2}{x - 2} = \\frac{1}{2}$ and cross-multiply.",
    workedSolution: "$$2(x + 2) = 1(x - 2) \\implies 2x + 4 = x - 2 \\implies x = -2 - 4 = -6$$.",
    points: 1
  },
  {
    number: 23,
    prompt: "Given that $\\mu = \\{1, 2, 3, \\dots, 10\\}$ and $M = \\{2, 3, 5, 7\\}$, list the members in $\\mu$ that are not in $M$.",
    options: [
      "{1, 4, 6}",
      "{2, 4, 6, 8, 10}",
      "{2, 4, 6, 8}",
      "{1, 4, 6, 8, 9, 10}"
    ],
    correctAnswer: "{1, 4, 6, 8, 9, 10}",
    hint: "Find the complement $M' = \\mu \\setminus M$.",
    workedSolution: "$$M' = \\{1, 4, 6, 8, 9, 10\\}$$.",
    points: 1
  },
  {
    number: 24,
    prompt: "If $2^{2m} = 8$, find the value of $m$.",
    options: ["2.0", "1.0", "1.5", "0.5"],
    correctAnswer: "1.5",
    hint: "Express 8 in base 2: $8 = 2^3$. Then equate exponents.",
    workedSolution: "$$2^{2m} = 2^3 \\implies 2m = 3 \\implies m = \\frac{3}{2} = 1.5$$.",
    points: 1
  },
  {
    number: 25,
    prompt: "A boy spends $\\frac{1}{4}$ of his pocket money on books and $\\frac{1}{3}$ on pens. What fraction remains?",
    options: ["5/6", "5/12", "7/12", "1/12"],
    correctAnswer: "5/12",
    hint: "Add the fractions spent: $\\frac{1}{4} + \\frac{1}{3} = \\frac{7}{12}$. Subtract from 1.",
    workedSolution: "$$\\text{Fraction spent} = \\frac{1}{4} + \\frac{1}{3} = \\frac{3 + 4}{12} = \\frac{7}{12}$$\n$$\\text{Fraction remaining} = 1 - \\frac{7}{12} = \\frac{5}{12}$$.",
    points: 1
  },
  {
    number: 26,
    prompt: "Two sets which have the same number of members are ________ sets.",
    options: ["equal", "intersecting", "equivalent", "union"],
    correctAnswer: "equivalent",
    hint: "Equal sets have identical elements; equivalent sets have equal cardinality.",
    workedSolution: "Sets having the same number of elements ($n(A) = n(B)$) are called equivalent sets.",
    points: 1
  },
  {
    number: 27,
    prompt: "Change 25% to a fraction in its lowest form.",
    options: ["1/2", "1/8", "1/4", "5/6"],
    correctAnswer: "1/4",
    hint: "$$\\frac{25}{100}$$.",
    workedSolution: "$$\\frac{25}{100} = \\frac{1}{4}$$.",
    points: 1
  },
  {
    number: 28,
    prompt: `Find the rule for the mapping shown below:<br/>${svgP1Q28}`,
    options: [
      "x → 3x",
      "x → 4 - x",
      "x → x + 2",
      "x → 2x + 1"
    ],
    correctAnswer: "x → 3x",
    hint: "Look at the pattern: $1 \\to 3, 2 \\to 6, 3 \\to 9$.",
    workedSolution: "$$y = 3x \\implies x \\to 3x$$.",
    points: 1
  },
  {
    number: 29,
    prompt: "Find the circumference of a circle whose area is $100\\pi\\text{ cm}^2$.",
    options: ["5 cm", "15 cm", "10π cm", "20π cm"],
    correctAnswer: "20π cm",
    hint: "Area $= \\pi r^2 = 100\\pi \\implies r = 10$. Circumference $= 2\\pi r$.",
    workedSolution: "$$\\pi r^2 = 100\\pi \\implies r = 10\\text{ cm}$$\n$$C = 2\\pi r = 2\\pi(10) = 20\\pi\\text{ cm}$$.",
    points: 1
  },
  {
    number: 30,
    prompt: `Find the value of $y$ in the diagram below:<br/>${svgP1Q30}`,
    options: ["60°", "30°", "34°", "28°"],
    correctAnswer: "34°",
    hint: "Alternate interior angle equals $56^\\circ$. The base angles of the isosceles triangle are equal to $56^\\circ$.",
    workedSolution: "By alternate interior angles, the base angle of the isosceles triangle is $56^\\circ$.\nSince the triangle is isosceles, the two base angles are each $56^\\circ$.\nSum of angles in the triangle: $$2y + 56^\\circ + 56^\\circ = 180^\\circ \\implies 2y + 112^\\circ = 180^\\circ$$\n$$2y = 68^\\circ \\implies y = 34^\\circ$$.",
    points: 1
  },
  {
    number: 31,
    prompt: "Given the arithmetic sequence $-9, -5, m, 3, 7, 11$, find the value of $m$.",
    options: ["-3", "-1", "-2", "1"],
    correctAnswer: "-1",
    hint: "Find common difference: $-5 - (-9) = 4$. Add 4 to $-5$.",
    workedSolution: "$$d = 4$$\n$$m = -5 + 4 = -1$$.",
    points: 1
  },
  {
    number: 32,
    prompt: "The marks obtained by 11 learners in a test are: $2, 5, 5, 6, 7, 7, 8, 8, 8, 9, 10$. What is the modal mark?",
    options: ["2", "8", "7", "9"],
    correctAnswer: "8",
    hint: "Identify the mark with the highest frequency.",
    workedSolution: "The mark 8 appears three times, more than any other score. Mode $= 8$.",
    points: 1
  },
  {
    number: 33,
    prompt: "If $a = \\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix}$ and $b = \\begin{pmatrix} -2 \\\\ 1 \\end{pmatrix}$, evaluate $6b + 2a$.",
    options: [
      "(-1, 3)",
      "(-6, 8)",
      "(1, 3)",
      "(6, 8)"
    ],
    correctAnswer: "(-6, 8)",
    hint: "$$6\\begin{pmatrix} -2 \\\\ 1 \\end{pmatrix} + 2\\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix}$$.",
    workedSolution: "$$6\\begin{pmatrix} -2 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} -12 \\\\ 6 \\end{pmatrix}, \\quad 2\\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ 2 \\end{pmatrix}$$\n$$\\begin{pmatrix} -12 \\\\ 6 \\end{pmatrix} + \\begin{pmatrix} 6 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} -6 \\\\ 8 \\end{pmatrix}$$.",
    points: 1
  },
  {
    number: 34,
    prompt: "Evaluate $p^2(q - 1)$ when $p = 2$ and $q = \\frac{3}{4}$.",
    options: ["-2", "1", "-1", "2"],
    correctAnswer: "-1",
    hint: "Substitute: $2^2 \\left(\\frac{3}{4} - 1\\right)$.",
    workedSolution: "$$2^2 \\left(\\frac{3}{4} - 1\\right) = 4 \\left(-\\frac{1}{4}\\right) = -1$$.",
    points: 1
  },
  {
    number: 35,
    prompt: "Ivy and Abbey share an amount of GH¢ 30.00 in the ratio $3 : 2$ respectively. Find Abbey's share.",
    options: ["GH¢ 10.00", "GH¢ 15.00", "GH¢ 12.00", "GH¢ 18.00"],
    correctAnswer: "GH¢ 12.00",
    hint: "Total parts $= 3 + 2 = 5$. Abbey's portion is $\\frac{2}{5} \\times 30$.",
    workedSolution: "$$\\text{Abbey's share} = \\frac{2}{5} \\times 30 = 2 \\times 6 = \\text{GH¢ } 12.00$$.",
    points: 1
  },
  {
    number: 36,
    prompt: "The table below shows the marks scored by learners in a test. Find the median mark:<br/><br/>| Mark | 0 | 1 | 2 | 3 | 4 | 5 |<br/>| :--- | :---: | :---: | :---: | :---: | :---: | :---: |<br/>| Frequency | 1 | 2 | 7 | 5 | 4 | 3 |",
    options: ["1", "3", "2", "4"],
    correctAnswer: "3",
    hint: "Total frequency $\\sum f = 22$. Median is between 11th and 12th values.",
    workedSolution: "$$\\sum f = 1 + 2 + 7 + 5 + 4 + 3 = 22$$\nCumulative frequencies: Mark 0 (1), Mark 1 (3), Mark 2 (10), Mark 3 (15).\nThe 11th and 12th scores both fall in Mark 3. Median $= 3$.",
    points: 1
  },
  {
    number: 37,
    prompt: "From the table in Question 36, find the probability that a learner selected at random scored 2 marks.",
    options: ["7/22", "2/22", "5/22", "1/22"],
    correctAnswer: "7/22",
    hint: "Frequency for mark 2 is 7; total frequency is 22.",
    workedSolution: "$$P(\\text{score } 2) = \\frac{7}{22}$$.",
    points: 1
  },
  {
    number: 38,
    prompt: "If $\\frac{3}{4}x = 2 + \\frac{1}{4}$, find the value of $x$.",
    options: ["1", "4", "3", "5"],
    correctAnswer: "3",
    hint: "$$2 + \\frac{1}{4} = \\frac{9}{4}$$.",
    workedSolution: "$$\\frac{3}{4}x = \\frac{9}{4} \\implies 3x = 9 \\implies x = 3$$.",
    points: 1
  },
  {
    number: 39,
    prompt: "The product of three numbers is 90. If two of the numbers are 6 and 3, find the third number.",
    options: ["18", "9", "15", "5"],
    correctAnswer: "5",
    hint: "Divide 90 by $(6 \\times 3)$.",
    workedSolution: "$$6 \\times 3 \\times x = 90 \\implies 18x = 90 \\implies x = \\frac{90}{18} = 5$$.",
    points: 1
  },
  {
    number: 40,
    prompt: "Simplify: $x - 5(3 - 2x) - 12x + 7$.",
    options: ["x + 8", "-21x + 8", "-21x - 8", "-x - 8"],
    correctAnswer: "-x - 8",
    hint: "Expand the bracket first: $-5(3 - 2x) = -15 + 10x$.",
    workedSolution: "$$x - 15 + 10x - 12x + 7 = (x + 10x - 12x) + (-15 + 7) = -x - 8$$.",
    points: 1
  }
];

// 6 Theory / Essay Questions for Paper 2
const paper2Questions = [
  {
    questionNumber: "1",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Given that $K = \\{1, 2, 3, \\dots, 11\\}$:\n(i) list the prime numbers in $K$;\n(ii) find the probability that a number selected at random from the set $K$ is not a prime number.",
        workedSolution: "(i) Prime numbers in $K$: $\\{2, 3, 5, 7, 11\\}$.\n(ii) Total elements $n(K) = 11$.\nNon-prime numbers: $\\{1, 4, 6, 8, 9, 10\\}$, giving 6 elements.\n$$P(\\text{not prime}) = \\frac{6}{11}$$.",
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: "Factorize completely: $(x + y)(2m - n) - m(x + y)$.",
        workedSolution: "Factor out the common binomial $(x + y)$:\n$$(x + y)[(2m - n) - m] = (x + y)(2m - m - n) = (x + y)(m - n)$$.",
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "A typist charges GH¢ 68.00 for the first 8 sheets typed, and GH¢ 11.00 for each additional sheet. Calculate the amount earned if the typist typed a total of 35 sheets.",
        workedSolution: "First 8 sheets cost GH¢ 68.00.\nAdditional sheets $= 35 - 8 = 27$ sheets.\n$$\\text{Cost of additional sheets} = 27 \\times 11 = \\text{GH¢ } 297.00$$\n$$\\text{Total amount earned} = 68.00 + 297.00 = \\text{GH¢ } 365.00$$.",
        maxMarks: 6
      }
    ]
  },
  {
    questionNumber: "2",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "The image of $P(2, 5)$ when translated by the vector $\\mathbf{r}$ is $(-3, 8)$. Find:\n(i) $\\mathbf{r}$;\n(ii) the image $Q'$ of $Q(-4, -6)$ when translated by $\\mathbf{r}$.",
        workedSolution: "(i) $\\begin{pmatrix} 2 \\\\ 5 \\end{pmatrix} + \\mathbf{r} = \\begin{pmatrix} -3 \\\\ 8 \\end{pmatrix} \\implies \\mathbf{r} = \\begin{pmatrix} -3 - 2 \\\\ 8 - 5 \\end{pmatrix} = \\begin{pmatrix} -5 \\\\ 3 \\end{pmatrix}$.\n(ii) $Q' = \\begin{pmatrix} -4 \\\\ -6 \\end{pmatrix} + \\begin{pmatrix} -5 \\\\ 3 \\end{pmatrix} = \\begin{pmatrix} -9 \\\\ -3 \\end{pmatrix} \\implies Q'(-9, -3)$.",
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "Joyce and Richard contributed GH¢ 10,000.00 and GH¢ 5,000.00 respectively to start a business. They agreed that Richard will be paid one-third of the profit as a manager and the rest of the profit will be shared in the ratio of their contributions. If a profit of GH¢ 9,000.00 was made, how much did:\n(i) Joyce receive;\n(ii) Richard receive in total?",
        workedSolution: "Richard's manager share $= \\frac{1}{3} \\times 9,000 = \\text{GH¢ } 3,000.00$.\nRemaining profit $= 9,000 - 3,000 = \\text{GH¢ } 6,000.00$.\nRatio of contributions: $10,000 : 5,000 = 2 : 1$ (Total parts $= 3$).\n(i) Joyce's share $= \\frac{2}{3} \\times 6,000 = \\text{GH¢ } 4,000.00$.\n(ii) Richard's partnership share $= \\frac{1}{3} \\times 6,000 = \\text{GH¢ } 2,000.00$.\n$$\\text{Richard total} = 3,000 + 2,000 = \\text{GH¢ } 5,000.00$$.",
        maxMarks: 9
      }
    ]
  },
  {
    questionNumber: "3",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Asana was engaged to collect cashew-fruits on a farm and was paid a wage of GH¢ 25.00 a day. If the daily wage increased by 10% and she worked for 30 days, how much will she be paid?",
        workedSolution: "$$\\text{Wage increase} = 10\\% \\times 25 = \\text{GH¢ } 2.50$$\n$$\\text{New daily wage} = 25 + 2.50 = \\text{GH¢ } 27.50$$\n$$\\text{Total pay for 30 days} = 27.50 \\times 30 = \\text{GH¢ } 825.00$$.",
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `The diagram below shows the floor of a room with its dimensions:<br/>${svgP2Q3}<br/>Find the:\n(i) perimeter;\n(ii) area;\n(iii) cost of carpeting the floor if a carpet costs GH¢ 20.00 per square metre.`,
        workedSolution: "(i) Missing horizontal side $= 8 - 5 = 3\\text{ m}$.\nMissing vertical side $= 5 - 3 = 2\\text{ m}$.\n$$\\text{Perimeter} = 8 + 3 + 5 + 2 + 3 + 5 = 26\\text{ m}$$.\n(ii) Split into two rectangles (or subtract missing notch):\n$$\\text{Area} = (8 \\times 5) - (5 \\times 2) = 40 - 10 = 30\\text{ m}^2$$.\n(iii) $$\\text{Cost} = 30 \\times 20.00 = \\text{GH¢ } 600.00$$.",
        maxMarks: 9
      }
    ]
  },
  {
    questionNumber: "4",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "In a school, the monthly incomes of three workers Aku, Brako and Dagadu are GH¢ 5,000.00, GH¢ 6,500.00 and GH¢ 4,200.00 respectively.\n(i) Calculate the yearly income of each worker.\n(ii) Find the yearly income difference between Aku and Dagadu.\n(iii) Find the total yearly income of all three workers.",
        workedSolution: "(i) Yearly income $= \\text{monthly} \\times 12$:\n- Aku $= 5,000 \\times 12 = \\text{GH¢ } 60,000.00$.\n- Brako $= 6,500 \\times 12 = \\text{GH¢ } 78,000.00$.\n- Dagadu $= 4,200 \\times 12 = \\text{GH¢ } 50,400.00$.\n(ii) $$\\text{Difference} = 60,000 - 50,400 = \\text{GH¢ } 9,600.00$$.\n(iii) $$\\text{Total} = 60,000 + 78,000 + 50,400 = \\text{GH¢ } 188,400.00$$.",
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `A painter places a ladder against a building at the window. The angle the foot of the ladder makes with the horizontal ground is $60^\\circ$. If the distance from the foot of the ladder to the base of the building is $5\\text{ m}$:<br/>${svgP2Q4}<br/>(i) illustrate the information in a diagram;\n(ii) find, correct to one decimal place, the (α) length of the ladder; (β) distance between the window and the foot of the building. [Take $\\tan 60^\\circ = 1.732$ and $\\cos 60^\\circ = \\frac{1}{2}$]`,
        workedSolution: "(i) Diagram shows a right-angled triangle with base $5\\text{ m}$, angle at base $60^\\circ$, height $h$ (window), and hypotenuse $L$ (ladder).\n(ii)(α) Length of ladder $L$:\n$$\\cos 60^\\circ = \\frac{\\text{adj}}{\\text{hyp}} = \\frac{5}{L} \\implies L = \\frac{5}{1/2} = 10.0\\text{ m}$$.\n(ii)(β) Distance from window to foot of building $h$:\n$$\\tan 60^\\circ = \\frac{\\text{opp}}{\\text{adj}} = \\frac{h}{5} \\implies h = 5 \\times 1.732 = 8.66 \\approx 8.7\\text{ m}$$.",
        maxMarks: 8
      }
    ]
  },
  {
    questionNumber: "5",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Simplify $\\frac{\\sqrt{72}}{\\sqrt{18} - \\sqrt{12}}$, leaving the answer in the form $a + b\\sqrt{c}$, where $a$, $b$ and $c$ are integers.",
        workedSolution: "$$\\sqrt{72} = 6\\sqrt{2}, \\quad \\sqrt{18} = 3\\sqrt{2}, \\quad \\sqrt{12} = 2\\sqrt{3}$$\n$$\\frac{6\\sqrt{2}}{3\\sqrt{2} - 2\\sqrt{3}} \\times \\frac{3\\sqrt{2} + 2\\sqrt{3}}{3\\sqrt{2} + 2\\sqrt{3}} = \\frac{6\\sqrt{2}(3\\sqrt{2}) + 6\\sqrt{2}(2\\sqrt{3})}{(3\\sqrt{2})^2 - (2\\sqrt{3})^2}$$\n$$= \\frac{36 + 12\\sqrt{6}}{18 - 12} = \\frac{36 + 12\\sqrt{6}}{6} = 6 + 2\\sqrt{6}$$.\nThus, $a = 6, b = 2, c = 6$.",
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "Solve: $\\frac{1}{2}(2x + 1) \\ge \\frac{1}{3}x + 1\\frac{9}{10}$.",
        workedSolution: "$$x + \\frac{1}{2} \\ge \\frac{1}{3}x + \\frac{19}{10}$$\nMultiply through by the LCM of 2, 3, and 10 (30):\n$$30x + 15 \\ge 10x + 57 \\implies 20x \\ge 42 \\implies x \\ge \\frac{42}{20} = 2.1$$.",
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "An athlete runs four times round a circular track of radius $70\\text{ m}$. Find, in metres, the total distance covered by the athlete. [Take $\\pi = \\frac{22}{7}$]",
        workedSolution: "$$\\text{Circumference of 1 lap} = 2\\pi r = 2 \\times \\frac{22}{7} \\times 70 = 440\\text{ m}$$\n$$\\text{Total distance for 4 laps} = 4 \\times 440 = 1,760\\text{ m}$$.",
        maxMarks: 4
      }
    ]
  },
  {
    questionNumber: "6",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "The data below shows the shoe sizes of learners in a school: 6, 4, 7, 5, 5, 6, 4, 5, 5, 4, 6, 7, 5, 6, 4, 6, 7, 5, 6, 4, 7, 5, 4, 6, 5, 5, 4, 6, 7, 5. Construct a frequency distribution table for the data.",
        workedSolution: "| Shoe Size ($x$) | Tally | Frequency ($f$) | $fx$ |\n| :---: | :---: | :---: | :---: |\n| 4 | |||| || | 7 | 28 |\n| 5 | |||| |||| | 10 | 50 |\n| 6 | |||| ||| | 8 | 48 |\n| 7 | |||| | 5 | 35 |\n| **Total** | | **30** | **161** |",
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "If the school supplies shoes to the learners:\n(i) which size should be purchased in large quantities?\n(ii) give a reason for your answer in (b)(i);\n(iii) which size will be purchased in less quantities?\n(iv) give a reason for your answer in (b)(iii).",
        workedSolution: "(i) Size 5.\n(ii) It has the highest frequency (mode = 10 learners wear size 5).\n(iii) Size 7.\n(iv) It has the lowest frequency (only 5 learners wear size 7).",
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "Find, correct to the nearest whole number, the mean shoe size.",
        workedSolution: "$$\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{161}{30} = 5.367$$\nRounding to the nearest whole number gives **5**.",
        maxMarks: 4
      }
    ]
  }
];

// In-place Fisher-Yates shuffle for options balancing
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function seedBece2026Paper() {
  console.log('Seeding 2026 WAEC BECE Mathematics Examination Paper...');

  // Track position distribution across the 40 items
  const distribution = { A: 0, B: 0, C: 0, D: 0 };

  // Randomize option locations across all 40 questions to prevent clustering at option A
  for (const q of paper1Questions) {
    q.options = shuffleArray(q.options);
    if (!q.options.includes(q.correctAnswer)) {
      throw new Error(`Correct answer lost during shuffle for question ${q.number}`);
    }
    const idx = q.options.indexOf(q.correctAnswer);
    if (idx === 0) distribution.A++;
    else if (idx === 1) distribution.B++;
    else if (idx === 2) distribution.C++;
    else if (idx === 3) distribution.D++;
  }

  console.log(`Paper 1 Distribution: A=${distribution.A}, B=${distribution.B}, C=${distribution.C}, D=${distribution.D}`);

  const payload = {
    id: "paper_2026",
    year: 2026,
    examination: "WAEC BECE Mathematics",
    paper1: {
      title: "Paper 1: Objective Test",
      durationMinutes: 60,
      totalQuestions: 40,
      questions: paper1Questions
    },
    paper2: {
      title: "Paper 2: Essay / Theory Test",
      durationMinutes: 60,
      instructions: "Answer four questions only. All working must be clearly shown.",
      questions: paper2Questions
    },
    metadata: {
      ingestedAt: admin.firestore.FieldValue.serverTimestamp(),
      verified: true,
      optionsBalanced: true
    }
  };

  // 1. Primary path: global_curriculum/jhs/subjects/math/past_papers/paper_2026
  const paperDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2026');
  await paperDocRef.set(payload, { merge: true });
  console.log('✅ Ingested into past_papers/paper_2026');

  // 2. Historical series alias path: global_curriculum/jhs/subjects/math/past_papers/year_2026
  const yearDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/year_2026');
  await yearDocRef.set({ ...payload, id: "year_2026" }, { merge: true });
  console.log('✅ Ingested into past_papers/year_2026');

  // 3. Save local JSON backup
  const outDir = 'scripts/payloads';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(`${outDir}/paper_2026.json`, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`✅ Saved local payload backup to ${outDir}/paper_2026.json`);
}

seedBece2026Paper()
  .then(() => {
    console.log('🎉 2026 BECE Mathematics Paper Seeding Complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to ingest 2026 paper:', err);
    process.exit(1);
  });
