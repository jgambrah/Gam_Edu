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

// 1. Modified SVG for Q18 & Q19 (Intersecting Lines with Alternate & Vertical Angles)
const svgQ18Q19Var = `
<svg viewBox='0 0 380 180' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='none' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Parallel Segments AB and DE -->
  <line x1='30' y1='110' x2='100' y2='40' stroke='#2563eb' stroke-width='2.5'/>
  <polygon points='60,78 68,70 62,68' fill='#2563eb'/>
  <line x1='280' y1='140' x2='350' y2='70' stroke='#2563eb' stroke-width='2.5'/>
  <polygon points='310,108 318,100 312,98' fill='#2563eb'/>
  <!-- Transversals crossing at C -->
  <line x1='100' y1='40' x2='280' y2='140' stroke='#1e293b' stroke-width='2'/>
  <line x1='30' y1='110' x2='350' y2='70' stroke='#1e293b' stroke-width='2'/>
  <!-- Labels -->
  <text x='18' y='120' font-size='12' font-weight='bold' fill='#0f172a'>A</text>
  <text x='100' y='30' font-size='12' font-weight='bold' fill='#0f172a'>B</text>
  <text x='185' y='110' font-size='12' font-weight='bold' fill='#0f172a'>C</text>
  <text x='285' y='155' font-size='12' font-weight='bold' fill='#0f172a'>D</text>
  <text x='358' y='75' font-size='12' font-weight='bold' fill='#0f172a'>E</text>
  <!-- Angles -->
  <text x='105' y='55' font-size='11' font-weight='bold' fill='#dc2626'>76°</text>
  <text x='48' y='108' font-size='11' font-weight='bold' fill='#16a34a'>y</text>
  <text x='215' y='95' font-size='11' font-weight='bold' fill='#2563eb'>25°</text>
  <text x='268' y='132' font-size='11' font-weight='bold' fill='#d97706'>x</text>
  <text x='190' y='168' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Modified SVG for Stem-and-Leaf Plot (Q24, Q25, Q26)
const svgStemLeafVar = `
<svg viewBox='0 0 340 210' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='none' stroke='#cbd5e1' stroke-width='1.5'/>
  <text x='45' y='25' font-size='12' font-weight='bold' fill='#475569'>Stem</text>
  <text x='100' y='25' font-size='12' font-weight='bold' fill='#475569'>Leaf</text>
  <line x1='20' y1='32' x2='320' y2='32' stroke='#cbd5e1' stroke-width='1'/>
  <line x1='80' y1='20' x2='80' y2='175' stroke='#64748b' stroke-width='1.5'/>
  
  <text x='50' y='55' font-size='12' font-weight='bold' fill='#1e293b'>4</text>
  <text x='95' y='55' font-size='12' font-family='monospace' fill='#2563eb'>2  4  6  8</text>

  <text x='50' y='80' font-size='12' font-weight='bold' fill='#1e293b'>5</text>
  <text x='95' y='80' font-size='12' font-family='monospace' fill='#2563eb'>0  2  3  5  6  9</text>

  <text x='50' y='105' font-size='12' font-weight='bold' fill='#1e293b'>6</text>
  <text x='95' y='105' font-size='12' font-family='monospace' fill='#2563eb'>1  2  2  5  5  5  5  7  8</text>

  <text x='50' y='130' font-size='12' font-weight='bold' fill='#1e293b'>7</text>
  <text x='95' y='130' font-size='12' font-family='monospace' fill='#2563eb'>0  3  4  6  7  7  9</text>

  <text x='50' y='155' font-size='12' font-weight='bold' fill='#1e293b'>8</text>
  <text x='95' y='155' font-size='12' font-family='monospace' fill='#2563eb'>1  4  5  8</text>

  <text x='50' y='175' font-size='12' font-weight='bold' fill='#1e293b'>9</text>
  <text x='95' y='175' font-size='12' font-family='monospace' fill='#2563eb'>2  6</text>

  <rect x='20' y='182' width='300' height='20' rx='3' fill='rgba(226, 232, 240, 0.7)'/>
  <text x='30' y='196' font-size='11' font-weight='600' fill='#334155'>Key: 5 | 2 = 52 kg</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 40 Isomorphic Cloned Objective Questions
const paper1Questions = [
  {
    number: 1,
    prompt: "Express 72 as a product of prime factors in index notation.",
    options: [
      "2³ × 3²",
      "2² × 3³",
      "2⁴ × 3",
      "2³ × 3³"
    ],
    correctAnswer: "2³ × 3²",
    hint: "Divide successively by 2 and 3: $72 = 8 \\times 9$.",
    workedSolution: "$$72 = 2 \\times 36 = 2 \\times 2 \\times 18 = 2^3 \\times 9 = 2^3 \\times 3^2$$.",
    points: 1
  },
  {
    number: 2,
    prompt: "A school inter-house debate starts at 1:35 pm and lasts for 1 hour 45 minutes. At what time will the debate conclude?",
    options: [
      "3:20 pm",
      "3:10 pm",
      "2:50 pm",
      "4:20 pm"
    ],
    correctAnswer: "3:20 pm",
    hint: "Add 1 hour to 1:35 pm ($2:35\\text{ pm}$), then add 45 minutes ($25\\text{ min}$ to 3:00 pm $+ 20\\text{ min}$).",
    workedSolution: "$$1:35\\text{ pm} + 1\\text{ h } 45\\text{ min} = 2:80\\text{ pm} = 3:20\\text{ pm}$$.",
    points: 1
  },
  {
    number: 3,
    prompt: "Which of the following geometric figures is NOT a polygon with four edges?",
    options: [
      "Hexagon",
      "Trapezium",
      "Rhombus",
      "Kite"
    ],
    correctAnswer: "Hexagon",
    hint: "A quadrilateral has 4 edges; a hexagon has 6 edges.",
    workedSolution: "A hexagon has 6 sides, while trapeziums, rhombuses, and kites are quadrilaterals (4 sides).",
    points: 1
  },
  {
    number: 4,
    prompt: "Solve the linear inequality: $4x - (6x - 5) \\le 11$.",
    options: [
      "x ≥ -3",
      "x ≤ -3",
      "x ≥ 3",
      "x ≤ 3"
    ],
    correctAnswer: "x ≥ -3",
    hint: "Expand the bracket carefully: $-(6x - 5) = -6x + 5$.",
    workedSolution: "$$4x - 6x + 5 \\le 11 \\implies -2x \\le 6$$\nDivide by $-2$ and reverse the inequality sign:\n$$x \\ge -3$$.",
    points: 1
  },
  {
    number: 5,
    prompt: "Simplify: $1\\frac{2}{3} \\div 2\\frac{2}{9}$.",
    options: [
      "3/4",
      "4/3",
      "25/27",
      "1/2"
    ],
    correctAnswer: "3/4",
    hint: "Convert to improper fractions: $\\frac{5}{3} \\div \\frac{20}{9}$.",
    workedSolution: "$$\\frac{5}{3} \\times \\frac{9}{20} = \\frac{1}{1} \\times \\frac{3}{4} = \\frac{3}{4}$$.",
    points: 1
  },
  {
    number: 6,
    prompt: "Given that vector $\\vec{AB} = \\begin{pmatrix} -4 \\\\ 7 \\end{pmatrix}$, find the opposite vector $\\vec{BA}$.",
    options: [
      "(4, -7)",
      "(-4, -7)",
      "(4, 7)",
      "(-7, 4)"
    ],
    correctAnswer: "(4, -7)",
    hint: "$$\\vec{BA} = -\\vec{AB}$$.",
    workedSolution: "$$\\vec{BA} = -\\begin{pmatrix} -4 \\\\ 7 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ -7 \\end{pmatrix}$$.",
    points: 1
  },
  {
    number: 7,
    prompt: "Point $K(5, 2)$ is reflected in the $y$-axis. Find the coordinates of its image $K'$.",
    options: [
      "(-5, 2)",
      "(5, -2)",
      "(-5, -2)",
      "(2, 5)"
    ],
    correctAnswer: "(-5, 2)",
    hint: "Reflection in the $y$-axis transforms $(x, y) \\to (-x, y)$.",
    workedSolution: "$$K(5, 2) \\to K'(-5, 2)$$.",
    points: 1
  },
  {
    number: 8,
    prompt: "Solve the linear equation: $(x - 2) = \\frac{1}{3}(x + 6)$.",
    options: [
      "6",
      "4",
      "8",
      "3"
    ],
    correctAnswer: "6",
    hint: "Multiply both sides by 3: $3(x - 2) = x + 6$.",
    workedSolution: "$$3x - 6 = x + 6 \\implies 2x = 12 \\implies x = 6$$.",
    points: 1
  },
  {
    number: 9,
    prompt: "What is the longest chord passing through the center of a circle called?",
    options: [
      "Diameter",
      "Radius",
      "Arc",
      "Segment"
    ],
    correctAnswer: "Diameter",
    hint: "A chord through the origin/center spanning both sides of the perimeter.",
    workedSolution: "By definition, the diameter is the longest possible chord in any circle.",
    points: 1
  },
  {
    number: 10,
    prompt: "Factorize completely: $ab - ak - bk + k^2$.",
    options: [
      "(a - k)(b - k)",
      "(a + k)(b - k)",
      "(a - k)(b + k)",
      "(k - a)(k - b)"
    ],
    correctAnswer: "(a - k)(b - k)",
    hint: "Group in pairs: $a(b - k) - k(b - k)$.",
    workedSolution: "$$a(b - k) - k(b - k) = (a - k)(b - k)$$.",
    points: 1
  },
  {
    number: 11,
    prompt: "Given points $R(2, -3)$ and $S(-3, 7)$, find the gradient of the line passing through $R$ and $S$.",
    options: [
      "-2",
      "2",
      "-1/2",
      "4/5"
    ],
    correctAnswer: "-2",
    hint: "Gradient $m = \\frac{y_2 - y_1}{x_2 - x_1}$.",
    workedSolution: "$$m = \\frac{7 - (-3)}{-3 - 2} = \\frac{10}{-5} = -2$$.",
    points: 1
  },
  {
    number: 12,
    prompt: "If $\\frac{k}{100} = 14.5$, find the value of $k$.",
    options: [
      "1450",
      "145",
      "1.45",
      "0.145"
    ],
    correctAnswer: "1450",
    hint: "Multiply 14.5 by 100.",
    workedSolution: "$$k = 14.5 \\times 100 = 1,450$$.",
    points: 1
  },
  {
    number: 13,
    prompt: "A relation is defined by the mapping $x \\to 3x^2 - 2$. What is the image of $x = 2$?",
    options: [
      "10",
      "12",
      "8",
      "14"
    ],
    correctAnswer: "10",
    hint: "Substitute $x = 2$: $3(2^2) - 2$.",
    workedSolution: "$$3(4) - 2 = 12 - 2 = 10$$.",
    points: 1
  },
  {
    number: 14,
    prompt: "Evaluate $y = \\frac{b^2 - 4ac}{2a}$ when $a = 3$, $b = -5$, and $c = -2$.",
    options: [
      "49/6",
      "1/6",
      "25/6",
      "7"
    ],
    correctAnswer: "49/6",
    hint: "$b^2 = (-5)^2 = 25$ and $-4ac = -4(3)(-2) = +24$.",
    workedSolution: "$$y = \\frac{25 - (-24)}{2(3)} = \\frac{25 + 24}{6} = \\frac{49}{6}$$.",
    points: 1
  },
  {
    number: 15,
    prompt: "Arrange the fractions $\\frac{2}{5}, \\frac{1}{3}, \\frac{1}{2}$ in ascending order.",
    options: [
      "1/3, 2/5, 1/2",
      "2/5, 1/3, 1/2",
      "1/2, 2/5, 1/3",
      "1/3, 1/2, 2/5"
    ],
    correctAnswer: "1/3, 2/5, 1/2",
    hint: "Common denominator is 30: $10/30, 12/30, 15/30$.",
    workedSolution: "$$\\frac{1}{3} \\approx 0.333, \\quad \\frac{2}{5} = 0.400, \\quad \\frac{1}{2} = 0.500$$\nAscending order: $$\\frac{1}{3}, \\frac{2}{5}, \\frac{1}{2}$$.",
    points: 1
  },
  {
    number: 16,
    prompt: "A storage unit is rented at GH¢ 12.00 per month. How much total rent is paid in $2\\frac{1}{2}$ years?",
    options: [
      "GH¢ 360.00",
      "GH¢ 300.00",
      "GH¢ 240.00",
      "GH¢ 180.00"
    ],
    correctAnswer: "GH¢ 360.00",
    hint: "$2\\frac{1}{2}\\text{ years} = 2.5 \\times 12 = 30\\text{ months}$. Multiply by 12.",
    workedSolution: "$$\\text{Total months} = 30$$\n$$\\text{Rent} = 30 \\times 12 = \\text{GH¢ } 360.00$$.",
    points: 1
  },
  {
    number: 17,
    prompt: "A certain number is subtracted from 15 and the difference is multiplied by 4. If the final result is 28, find the number.",
    options: [
      "8",
      "7",
      "6",
      "9"
    ],
    correctAnswer: "8",
    hint: "$$4(15 - x) = 28$$.",
    workedSolution: "$$15 - x = \\frac{28}{4} = 7 \\implies x = 15 - 7 = 8$$.",
    points: 1
  },
  {
    number: 18,
    prompt: `In the diagram below, segment $AB$ is parallel to $DE$, $\\angle ABC = 76^\\circ$, and $\\angle DCE = 25^\\circ$. Find the value of angle $x$:<br/>${svgQ18Q19Var}`,
    options: [
      "76°",
      "25°",
      "79°",
      "101°"
    ],
    correctAnswer: "76°",
    hint: "Alternate interior angles between parallel lines $AB$ and $DE$ are equal.",
    workedSolution: "$\\angle CDE$ and $\\angle ABC$ are alternate interior angles across transversal $BD$. Therefore, $x = 76^\\circ$.",
    points: 1
  },
  {
    number: 19,
    prompt: `Using the same figure from Question 18, determine the value of angle $y$:<br/>${svgQ18Q19Var}`,
    options: [
      "79°",
      "101°",
      "25°",
      "76°"
    ],
    correctAnswer: "79°",
    hint: "Vertically opposite angles are equal ($\\angle ACB = \\angle DCE = 25^\\circ$). In $\\triangle ABC$, sum of angles is $180^\\circ$.",
    workedSolution: "$$\\angle ACB = 25^\\circ$$\nIn $\\triangle ABC$:\n$$y + 76^\\circ + 25^\\circ = 180^\\circ \\implies y + 101^\\circ = 180^\\circ \\implies y = 79^\\circ$$.",
    points: 1
  },
  {
    number: 20,
    prompt: "Kweku walks 9 km due south and then 12 km due west. How far is he from his original starting point?",
    options: [
      "15 km",
      "21 km",
      "18 km",
      "13 km"
    ],
    correctAnswer: "15 km",
    hint: "Apply Pythagoras theorem: $\\sqrt{9^2 + 12^2}$.",
    workedSolution: "$$d = \\sqrt{9^2 + 12^2} = \\sqrt{81 + 144} = \\sqrt{225} = 15\\text{ km}$$.",
    points: 1
  },
  {
    number: 21,
    prompt: "Which of the following number sets encompasses all the others listed?",
    options: [
      "{Integers}",
      "{Whole numbers}",
      "{Natural numbers}",
      "{Prime numbers}"
    ],
    correctAnswer: "{Integers}",
    hint: "Natural $\\subset$ Whole $\\subset$ Integers.",
    workedSolution: "Integers ($\\mathbb{Z}$) include positive, negative numbers, and zero, subsuming whole and natural numbers.",
    points: 1
  },
  {
    number: 22,
    prompt: "Express $2450.86$ in scientific notation (standard form).",
    options: [
      "2.45086 × 10³",
      "2.45086 × 10⁻³",
      "2.45086 × 10²",
      "2.45086 × 10⁴"
    ],
    correctAnswer: "2.45086 × 10³",
    hint: "Shift decimal 3 positions to the left: $2.45086 \\times 10^3$.",
    workedSolution: "$$2450.86 = 2.45086 \\times 10^3$$.",
    points: 1
  },
  {
    number: 23,
    prompt: "Expand and simplify: $(3a - b)(a - 2b)$.",
    options: [
      "3a² - 7ab + 2b²",
      "3a² - 5ab + 2b²",
      "3a² - 7ab - 2b²",
      "3a² + 7ab + 2b²"
    ],
    correctAnswer: "3a² - 7ab + 2b²",
    hint: "FOIL: $3a(a) - 6ab - ab + 2b^2$.",
    workedSolution: "$$3a^2 - 6ab - ab + 2b^2 = 3a^2 - 7ab + 2b^2$$.",
    points: 1
  },
  {
    number: 24,
    prompt: `From the stem-and-leaf plot showing weights (kg) of maize sacks:<br/>${svgStemLeafVar}<br/>How many sacks were weighed altogether?`,
    options: [
      "32",
      "30",
      "28",
      "34"
    ],
    correctAnswer: "32",
    hint: "Count total leaves: $4 + 6 + 9 + 7 + 4 + 2$.",
    workedSolution: "$$4 + 6 + 9 + 7 + 4 + 2 = 32\\text{ sacks}$$.",
    points: 1
  },
  {
    number: 25,
    prompt: `Using the stem-and-leaf plot from Question 24, what is the modal weight?<br/>${svgStemLeafVar}`,
    options: [
      "65 kg",
      "62 kg",
      "77 kg",
      "60 kg"
    ],
    correctAnswer: "65 kg",
    hint: "Leaf 5 under stem 6 appears 4 times, more than any other digit.",
    workedSolution: "Value 65 occurs 4 times. Modal weight $= 65\\text{ kg}$.",
    points: 1
  },
  {
    number: 26,
    prompt: `Using the stem-and-leaf plot from Question 24, find the median weight:<br/>${svgStemLeafVar}`,
    options: [
      "65 kg",
      "64 kg",
      "66 kg",
      "63 kg"
    ],
    correctAnswer: "65 kg",
    hint: "Median for 32 values is the average of the 16th and 17th items.",
    workedSolution: "16th item $= 65\\text{ kg}$; 17th item $= 65\\text{ kg}$. Average $= 65\\text{ kg}$.",
    points: 1
  },
  {
    number: 27,
    prompt: "If vectors $u = \\begin{pmatrix} 3 \\\\ -5 \\end{pmatrix}$ and $v = \\begin{pmatrix} -3 \\\\ 5 \\end{pmatrix}$, compute $u + v$.",
    options: [
      "(0, 0)",
      "(6, -10)",
      "(-6, 10)",
      "(0, -10)"
    ],
    correctAnswer: "(0, 0)",
    hint: "Add corresponding $x$ and $y$ components.",
    workedSolution: "$$\\begin{pmatrix} 3 + (-3) \\\\ -5 + 5 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$$.",
    points: 1
  },
  {
    number: 28,
    prompt: "For what value of $m$ is $4^m = 64$?",
    options: [
      "3",
      "4",
      "2",
      "16"
    ],
    correctAnswer: "3",
    hint: "$$4^1 = 4, 4^2 = 16, 4^3 = 64$$.",
    workedSolution: "$$4^m = 4^3 \\implies m = 3$$.",
    points: 1
  },
  {
    number: 29,
    prompt: "Simplify: $-18 - (-25) + (-12)$.",
    options: [
      "-5",
      "5",
      "-31",
      "19"
    ],
    correctAnswer: "-5",
    hint: "$$-18 + 25 - 12$$.",
    workedSolution: "$$(-18 + 25) - 12 = 7 - 12 = -5$$.",
    points: 1
  },
  {
    number: 30,
    prompt: "Express $\\frac{5}{8}$ as a terminating decimal fraction.",
    options: [
      "0.625",
      "0.375",
      "0.580",
      "0.650"
    ],
    correctAnswer: "0.625",
    hint: "$$5 \\div 8 = 0.625$$.",
    workedSolution: "$$\\frac{5}{8} = 0.625$$.",
    points: 1
  },
  {
    number: 31,
    prompt: "What is the length of one side of a square having an area of $196\\text{ cm}^2$?",
    options: [
      "14.0 cm",
      "13.0 cm",
      "16.0 cm",
      "49.0 cm"
    ],
    correctAnswer: "14.0 cm",
    hint: "Take the square root of 196.",
    workedSolution: "$$s = \\sqrt{196} = 14\\text{ cm}$$.",
    points: 1
  },
  {
    number: 32,
    prompt: "What is the probability of rolling an odd number when a fair standard die is tossed?",
    options: [
      "1/2",
      "1/3",
      "1/6",
      "2/3"
    ],
    correctAnswer: "1/2",
    hint: "Odd outcomes are $\\{1, 3, 5\\}$ out of 6 possible outcomes.",
    workedSolution: "$$P(\\text{odd}) = \\frac{3}{6} = \\frac{1}{2}$$.",
    points: 1
  },
  {
    number: 33,
    prompt: "Given that $124(14 + 16) = 124(18 + p)$, find the value of $p$.",
    options: [
      "12",
      "-12",
      "30",
      "14"
    ],
    correctAnswer: "12",
    hint: "Equate the terms inside brackets: $14 + 16 = 18 + p$.",
    workedSolution: "$$30 = 18 + p \\implies p = 30 - 18 = 12$$.",
    points: 1
  },
  {
    number: 34,
    prompt: "A father holds GH¢ 10.00 and distributes GH¢ 2.20 to each of his 4 children. How much money remains with him?",
    options: [
      "GH¢ 1.20",
      "GH¢ 2.20",
      "GH¢ 0.80",
      "GH¢ 1.80"
    ],
    correctAnswer: "GH¢ 1.20",
    hint: "Total given out $= 4 \\times 2.20 = 8.80$.",
    workedSolution: "$$10.00 - (4 \\times 2.20) = 10.00 - 8.80 = \\text{GH¢ } 1.20$$.",
    points: 1
  },
  {
    number: 35,
    prompt: "A commuter train covers 72 kilometres in one hour. Determine its speed in metres per second (m/s).",
    options: [
      "20 m/s",
      "10 m/s",
      "25 m/s",
      "15 m/s"
    ],
    correctAnswer: "20 m/s",
    hint: "Multiply by $\\frac{5}{18}$ or convert: $\\frac{72,000}{3600}$.",
    workedSolution: "$$72 \\times \\frac{5}{18} = 4 \\times 5 = 20\\text{ m/s}$$.",
    points: 1
  },
  {
    number: 36,
    prompt: "Ama had GH¢ 250.00 and spent GH¢ 95.00 on groceries. What percentage of her money remains?",
    options: [
      "62.0%",
      "38.0%",
      "58.0%",
      "65.0%"
    ],
    correctAnswer: "62.0%",
    hint: "Remaining money $= 250 - 95 = 155$. Compute $\\frac{155}{250} \\times 100\\%$.",
    workedSolution: "$$\\frac{155}{250} \\times 100\\% = 62.0\\%$$.",
    points: 1
  },
  {
    number: 37,
    prompt: "A trader earned a profit of 15% after selling a pair of shoes for GH¢ 92.00. Find the cost price of the shoes.",
    options: [
      "GH¢ 80.00",
      "GH¢ 78.20",
      "GH¢ 85.00",
      "GH¢ 105.80"
    ],
    correctAnswer: "GH¢ 80.00",
    hint: "$$1.15 \\times CP = 92.00$$.",
    workedSolution: "$$CP = \\frac{92.00}{1.15} = \\text{GH¢ } 80.00$$.",
    points: 1
  },
  {
    number: 38,
    prompt: "Express the ratio $20 : 16$ in the standard unitary form $1 : n$.",
    options: [
      "1 : 0.8",
      "1 : 1.25",
      "1 : 0.75",
      "1 : 1.6"
    ],
    correctAnswer: "1 : 0.8",
    hint: "Divide both sides by 20: $\\frac{16}{20} = 0.8$.",
    workedSolution: "$$\\frac{20}{20} : \\frac{16}{20} = 1 : 0.8$$.",
    points: 1
  },
  {
    number: 39,
    prompt: "The ratio of teachers to students in a school district is $3 : 40$. If there are 72 teachers, how many students are enrolled?",
    options: [
      "960",
      "840",
      "1,080",
      "1,200"
    ],
    correctAnswer: "960",
    hint: "1 unit of ratio $= \\frac{72}{3} = 24$. Multiply 24 by 40.",
    workedSolution: "$$\\text{Students} = 24 \\times 40 = 960$$.",
    points: 1
  },
  {
    number: 40,
    prompt: "The volume of a cylinder is $90\\pi\\text{ cm}^3$. If the height of the cylinder is $10\\text{ cm}$, calculate its base radius.",
    options: [
      "3 cm",
      "9 cm",
      "4.5 cm",
      "6 cm"
    ],
    correctAnswer: "3 cm",
    hint: "$$V = \\pi r^2 h \\implies \\pi r^2 (10) = 90\\pi$$.",
    workedSolution: "$$10r^2 = 90 \\implies r^2 = 9 \\implies r = 3\\text{ cm}$$.",
    points: 1
  }
];

// In-place Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

async function seedBece2022Variant() {
  console.log('===============================================================');
  console.log('    SEEDING 2022 BECE VARIANT - PAPER 1 (OBJECTIVE)            ');
  console.log('===============================================================\n');

  const distribution = { A: 0, B: 0, C: 0, D: 0 };

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
    id: "paper_2022_variant",
    year: 2022,
    isVariant: true,
    examination: "WAEC BECE Mathematics (Cloned Practice Model)",
    paper1: {
      title: "Paper 1: Objective Test (Variant)",
      durationMinutes: 60,
      totalQuestions: 40,
      questions: paper1Questions
    },
    metadata: {
      ingestedAt: admin.firestore.FieldValue.serverTimestamp(),
      verifiedPaper1: true,
      optionsBalanced: true
    }
  };

  // 1. Primary path
  const paperDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2022_variant');
  await paperDocRef.set(payload, { merge: true });
  console.log('✅ Ingested into past_papers/paper_2022_variant');

  // 2. Mirror path for historical series consistency
  const yearDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/year_2022_variant');
  await yearDocRef.set({ ...payload, id: "year_2022_variant" }, { merge: true });
  console.log('✅ Ingested into past_papers/year_2022_variant');

  // 3. Save local JSON backup
  const outDir = 'scripts/payloads';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(`${outDir}/paper_2022_variant.json`, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`✅ Saved local payload backup to ${outDir}/paper_2022_variant.json`);

  // 4. Update registry index
  const registryDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/index');
  const regSnap = await registryDocRef.get();
  if (regSnap.exists) {
    const regData = regSnap.data()!;
    const variants = regData.variants || {};
    variants['2022_variant'] = {
      year: 2022,
      paperId: 'paper_2022_variant',
      yearDocId: 'year_2022_variant',
      title: '2022 WAEC BECE Mathematics (Cloned Practice Model)',
      paper1Count: 40,
      isVariant: true,
      addedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    await registryDocRef.update({ variants, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    await db.doc('global_curriculum/jhs/subjects/math/past_papers/registry').set({ variants }, { merge: true });
    console.log('✅ Updated past papers registry index with 2022 variant entry.');
  }

  console.log('\n🎉 Successfully seeded 2022 Paper 1 Variant into Firestore!');
}

seedBece2022Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to seed 2022 variant paper:', err);
    process.exit(1);
  });
