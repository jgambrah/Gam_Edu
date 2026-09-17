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

// 1. Modified SVG for Paper 1 Q28 (Linear Mapping: x -> 4x)
const svgP1Q28Var = `
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
  <text x='85' y='95' font-size='13' font-weight='600' fill='#1e293b'>4</text>
  <text x='135' y='95' font-size='13' font-weight='600' fill='#1e293b'>8</text>
  <text x='185' y='95' font-size='13' font-weight='600' fill='#1e293b'>12</text>
  <text x='235' y='95' font-size='13' font-weight='600' fill='#1e293b'>16</text>
  <text x='285' y='95' font-size='13' font-weight='600' fill='#1e293b'>20</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Modified SVG for Paper 1 Q30 (Isosceles Triangle: 3y and 48 degrees)
const svgP1Q30Var = `
<svg viewBox='0 0 360 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='none' stroke='#cbd5e1' stroke-width='1.5'/>
  <line x1='20' y1='40' x2='340' y2='40' stroke='#1e293b' stroke-width='2'/>
  <polygon points='280,37 290,40 280,43' fill='#1e293b'/>
  <polygon points='290,37 300,40 290,43' fill='#1e293b'/>
  <line x1='20' y1='150' x2='340' y2='150' stroke='#1e293b' stroke-width='2'/>
  <polygon points='280,147 290,150 280,153' fill='#1e293b'/>
  <polygon points='290,147 300,150 290,153' fill='#1e293b'/>
  <line x1='180' y1='40' x2='95' y2='150' stroke='#2563eb' stroke-width='2.5'/>
  <line x1='180' y1='40' x2='265' y2='150' stroke='#2563eb' stroke-width='2.5'/>
  <line x1='134' y1='91' x2='144' y2='99' stroke='#1e293b' stroke-width='2'/>
  <line x1='216' y1='99' x2='226' y2='91' stroke='#1e293b' stroke-width='2'/>
  <path d='M 162 60 A 25 25 0 0 0 198 60' fill='none' stroke='#dc2626' stroke-width='1.8'/>
  <text x='180' y='72' font-size='12' font-weight='bold' fill='#dc2626' text-anchor='middle'>3y</text>
  <path d='M 205 40 A 25 25 0 0 1 193 60' fill='none' stroke='#16a34a' stroke-width='1.8'/>
  <text x='215' y='55' font-size='12' font-weight='bold' fill='#16a34a'>48°</text>
  <text x='180' y='172' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 40 Isomorphic Cloned Objective Questions for Paper 1
const paper1Questions = [
  {
    number: 1,
    prompt: "Arrange the following numbers in descending order: $\\frac{4}{5}, \\frac{7}{10}, 0.85, 0.72$.",
    options: [
      "0.85, 4/5, 0.72, 7/10",
      "4/5, 0.85, 7/10, 0.72",
      "0.72, 7/10, 0.85, 4/5",
      "7/10, 4/5, 0.85, 0.72"
    ],
    correctAnswer: "0.85, 4/5, 0.72, 7/10",
    hint: "Convert fractions to decimals: $4/5 = 0.80$ and $7/10 = 0.70$.",
    workedSolution: "$$\\frac{4}{5} = 0.80, \\quad \\frac{7}{10} = 0.70$$\nDescending order: $$0.85 > 0.80 > 0.72 > 0.70 \\implies 0.85, \\frac{4}{5}, 0.72, \\frac{7}{10}$$.",
    points: 1
  },
  {
    number: 2,
    prompt: "Madam Osei left her office at 8:40 am and arrived in Cape Coast at 3:10 pm. Calculate the total time spent on the journey.",
    options: [
      "6 hours 30 minutes",
      "6 hours 50 minutes",
      "7 hours 10 minutes",
      "5 hours 30 minutes"
    ],
    correctAnswer: "6 hours 30 minutes",
    hint: "Calculate elapsed time to 12:00 noon ($3\\text{ h } 20\\text{ min}$), then add time to 3:10 pm ($3\\text{ h } 10\\text{ min}$).",
    workedSolution: "$$8:40\\text{ am to } 12:00\\text{ noon} = 3\\text{ h } 20\\text{ min}$$\n$$12:00\\text{ noon to } 3:10\\text{ pm} = 3\\text{ h } 10\\text{ min}$$\n$$\\text{Total} = 3\\text{ h } 20\\text{ min} + 3\\text{ h } 10\\text{ min} = 6\\text{ hours } 30\\text{ minutes}$$.",
    points: 1
  },
  {
    number: 3,
    prompt: "In a diagnostic test, $\\frac{3}{5}$ of the candidates passed. If the number of candidates who failed was 48, how many candidates passed?",
    options: ["72", "120", "32", "80"],
    correctAnswer: "72",
    hint: "Fraction who failed is $1 - \\frac{3}{5} = \\frac{2}{5}$. Set $\\frac{2}{5}T = 48$.",
    workedSolution: "$$\\frac{2}{5}T = 48 \\implies T = 48 \\times \\frac{5}{2} = 120$$\n$$\\text{Number passed} = \\frac{3}{5} \\times 120 = 72$$.",
    points: 1
  },
  {
    number: 4,
    prompt: "Factorize completely: $4x^2y - 12xy^2$.",
    options: [
      "4xy(x - 3y)",
      "xy(4x - 12y)",
      "4xy(3y - x)",
      "2xy(2x - 6y)"
    ],
    correctAnswer: "4xy(x - 3y)",
    hint: "Find the Highest Common Factor (HCF) of the numerical and variable parts: $4xy$.",
    workedSolution: "$$\\text{HCF} = 4xy$$\n$$4x^2y - 12xy^2 = 4xy(x - 3y)$$.",
    points: 1
  },
  {
    number: 5,
    prompt: "Find the volume of a solid cube with an edge length of $4\\text{ m}$.",
    options: ["64 m³", "16 m³", "48 m³", "96 m³"],
    correctAnswer: "64 m³",
    hint: "Volume of a cube is $s^3$.",
    workedSolution: "$$V = 4^3 = 4 \\times 4 \\times 4 = 64\\text{ m}^3$$.",
    points: 1
  },
  {
    number: 6,
    prompt: "A merchant sold a wristwatch for GH¢ 180.00, making a profit of 20%. What was the cost price of the wristwatch?",
    options: ["GH¢ 150.00", "GH¢ 144.00", "GH¢ 160.00", "GH¢ 216.00"],
    correctAnswer: "GH¢ 150.00",
    hint: "Selling Price corresponds to $120\\%$ of Cost Price.",
    workedSolution: "$$1.20 \\times CP = 180.00 \\implies CP = \\frac{180.00}{1.20} = \\text{GH¢ } 150.00$$.",
    points: 1
  },
  {
    number: 7,
    prompt: "Express $0.000685$ in standard form.",
    options: [
      "6.85 × 10⁻⁴",
      "6.85 × 10⁻³",
      "6.85 × 10⁴",
      "6.85 × 10⁻⁵"
    ],
    correctAnswer: "6.85 × 10⁻⁴",
    hint: "Shift the decimal point 4 places to the right: $6.85 \\times 10^{-4}$.",
    workedSolution: "$$0.000685 = 6.85 \\times 10^{-4}$$.",
    points: 1
  },
  {
    number: 8,
    prompt: "Korkor receives an agent commission of 12% on all textiles sold. If her commission for a particular sale was GH¢ 72.00, what was the value of goods sold?",
    options: ["GH¢ 600.00", "GH¢ 60.00", "GH¢ 864.00", "GH¢ 500.00"],
    correctAnswer: "GH¢ 600.00",
    hint: "$$\\text{Commission} = 0.12 \\times \\text{Sales}$$.",
    workedSolution: "$$0.12 \\times \\text{Sales} = 72 \\implies \\text{Sales} = \\frac{72}{0.12} = \\text{GH¢ } 600.00$$.",
    points: 1
  },
  {
    number: 9,
    prompt: "Simplify: $\\sqrt{48} - \\sqrt{50} - \\sqrt{3} + \\sqrt{2}$.",
    options: [
      "3√3 - 4√2",
      "4√3 - 5√2",
      "3√3 + 4√2",
      "5√3 - 4√2"
    ],
    correctAnswer: "3√3 - 4√2",
    hint: "Simplify surds: $\\sqrt{48} = 4\\sqrt{3}$ and $\\sqrt{50} = 5\\sqrt{2}$.",
    workedSolution: "$$\\sqrt{48} = 4\\sqrt{3}, \\quad \\sqrt{50} = 5\\sqrt{2}$$\n$$(4\\sqrt{3} - \\sqrt{3}) + (-5\\sqrt{2} + \\sqrt{2}) = 3\\sqrt{3} - 4\\sqrt{2}$$.",
    points: 1
  },
  {
    number: 10,
    prompt: "A letter is chosen at random from the word SUCCESS. What is the probability that the chosen letter is S?",
    options: ["3/7", "2/7", "1/7", "4/7"],
    correctAnswer: "3/7",
    hint: "Total letters $= 7$. Letter S occurs 3 times.",
    workedSolution: "$$\\text{Total letters} = 7, \\quad \\text{Count of S} = 3$$\n$$P(S) = \\frac{3}{7}$$.",
    points: 1
  },
  {
    number: 11,
    prompt: "Find the image of the point $(3, -4)$ under the mapping $\\begin{pmatrix} x \\\\ y \\end{pmatrix} \\to \\begin{pmatrix} x \\\\ y - 3 \\end{pmatrix}$.",
    options: ["(3, -7)", "(3, -1)", "(0, -4)", "(3, 7)"],
    correctAnswer: "(3, -7)",
    hint: "Substitute $x = 3$ and $y = -4$: the new $y$-coordinate is $-4 - 3$.",
    workedSolution: "$$x' = 3, \\quad y' = -4 - 3 = -7 \\implies (3, -7)$$.",
    points: 1
  },
  {
    number: 12,
    prompt: "A square with an area of $100\\text{ cm}^2$ has the same perimeter as an equilateral triangle. Determine the length of one side of the triangle.",
    options: ["13.3 cm", "10 cm", "12 cm", "15 cm"],
    correctAnswer: "13.3 cm",
    hint: "Side of square $= \\sqrt{100} = 10\\text{ cm}$. Perimeter $= 40\\text{ cm}$. Divide by 3.",
    workedSolution: "$$\\text{Side of square} = \\sqrt{100} = 10\\text{ cm}$$\n$$\\text{Perimeter} = 4 \\times 10 = 40\\text{ cm}$$\n$$\\text{Side of equilateral triangle} = \\frac{40}{3} \\approx 13.3\\text{ cm}$$.",
    points: 1
  },
  {
    number: 13,
    prompt: "Solve the linear inequality: $9 - 3x > 21 - 7x$.",
    options: ["x > 3", "x < 3", "x > -3", "x < -3"],
    correctAnswer: "x > 3",
    hint: "Collect variables on the left: $-3x + 7x > 21 - 9$.",
    workedSolution: "$$4x > 12 \\implies x > 3$$.",
    points: 1
  },
  {
    number: 14,
    prompt: "Esi picked 30 oranges and discovered that 10% were bruised. How many oranges were NOT bruised?",
    options: ["27", "3", "24", "20"],
    correctAnswer: "27",
    hint: "90% of the oranges are not bruised: $0.90 \\times 30$.",
    workedSolution: "$$\\text{Bruised} = 0.10 \\times 30 = 3$$\n$$\\text{Not bruised} = 30 - 3 = 27$$.",
    points: 1
  },
  {
    number: 15,
    prompt: "A consignment of text books was shared equally among 36 students, each receiving 8 books. If 24 students shared the same consignment equally, how many books would each receive?",
    options: ["12", "16", "10", "14"],
    correctAnswer: "12",
    hint: "Inverse variation: $\\text{Total books} = 36 \\times 8 = 288$. Divide by 24.",
    workedSolution: "$$\\text{Total books} = 36 \\times 8 = 288$$\n$$\\text{Share per student} = \\frac{288}{24} = 12\\text{ books}$$.",
    points: 1
  },
  {
    number: 16,
    prompt: "Make $w$ the subject of the formula: $q = \\frac{m - 5w}{2}$.",
    options: [
      "w = 1/5(m - 2q)",
      "w = 1/5(2q - m)",
      "w = 1/5(m + 2q)",
      "w = 2q - m/5"
    ],
    correctAnswer: "w = 1/5(m - 2q)",
    hint: "Multiply by 2: $2q = m - 5w$, then transpose $5w$.",
    workedSolution: "$$2q = m - 5w \\implies 5w = m - 2q \\implies w = \\frac{1}{5}(m - 2q)$$.",
    points: 1
  },
  {
    number: 17,
    prompt: "A number is picked at random from the set $S = \\{1, 2, 3, 4, \\dots, 12\\}$. Find the probability that the number is greater than 4.",
    options: ["2/3", "1/3", "3/4", "5/12"],
    correctAnswer: "2/3",
    hint: "Numbers strictly greater than 4 are 5 through 12 (8 numbers).",
    workedSolution: "$$\\text{Favorable outcomes} = 8$$\n$$P(x > 4) = \\frac{8}{12} = \\frac{2}{3}$$.",
    points: 1
  },
  {
    number: 18,
    prompt: "Yaw paid an interest of GH¢ 45.00 on a microfinance loan taken for 3 years at a simple interest rate of 5% per annum. Calculate the principal sum borrowed.",
    options: ["GH¢ 300.00", "GH¢ 250.00", "GH¢ 350.00", "GH¢ 400.00"],
    correctAnswer: "GH¢ 300.00",
    hint: "$$P = \\frac{100 \\times I}{R \\times T}$$.",
    workedSolution: "$$P = \\frac{100 \\times 45}{5 \\times 3} = \\frac{4,500}{15} = \\text{GH¢ } 300.00$$.",
    points: 1
  },
  {
    number: 19,
    prompt: "A motorist travelling at $30\\text{ km/h}$ completes a journey in 40 minutes. How many minutes will the journey take if the speed is increased to $50\\text{ km/h}$?",
    options: ["24 minutes", "20 minutes", "32 minutes", "25 minutes"],
    correctAnswer: "24 minutes",
    hint: "Inverse variation: $30 \\times 40 = 50 \\times t$.",
    workedSolution: "$$t = \\frac{30 \\times 40}{50} = \\frac{1,200}{50} = 24\\text{ minutes}$$.",
    points: 1
  },
  {
    number: 20,
    prompt: "Which of the following is NOT a composite number?",
    options: ["53", "51", "57", "55"],
    correctAnswer: "53",
    hint: "$51 = 3 \\times 17$ and $57 = 3 \\times 19$. 53 has only factors 1 and 53.",
    workedSolution: "51, 55, and 57 are composite integers. 53 is a prime number.",
    points: 1
  },
  {
    number: 21,
    prompt: "Akosua harvested 180 watermelons. She sold 36 and stored the remaining melons equally in 6 crates. How many melons were in each crate?",
    options: ["24", "26", "22", "25"],
    correctAnswer: "24",
    hint: "Subtract 36 from 180, then divide by 6.",
    workedSolution: "$$\\text{Remaining melons} = 180 - 36 = 144$$\n$$\\text{Per crate} = \\frac{144}{6} = 24$$.",
    points: 1
  },
  {
    number: 22,
    prompt: "If $(y + 3) : (y - 3) = 1 : 3$, determine the value of $y$.",
    options: ["-6", "-3", "-9", "-4"],
    correctAnswer: "-6",
    hint: "Cross-multiply: $\\frac{y + 3}{y - 3} = \\frac{1}{3}$.",
    workedSolution: "$$3(y + 3) = 1(y - 3) \\implies 3y + 9 = y - 3 \\implies 2y = -12 \\implies y = -6$$.",
    points: 1
  },
  {
    number: 23,
    prompt: "Given universal set $\\mu = \\{1, 2, 3, \\dots, 10\\}$ and subset $A = \\{2, 3, 5, 7\\}$, list the members of $A'$ (the complement of $A$).",
    options: [
      "{1, 4, 6, 8, 9, 10}",
      "{1, 4, 6, 8, 10}",
      "{2, 4, 6, 8, 10}",
      "{4, 6, 8, 9, 10}"
    ],
    correctAnswer: "{1, 4, 6, 8, 9, 10}",
    hint: "Extract all elements in $\\mu$ that do not belong to $A$.",
    workedSolution: "$$A' = \\mu \\setminus \\{2, 3, 5, 7\\} = \\{1, 4, 6, 8, 9, 10\\}$$.",
    points: 1
  },
  {
    number: 24,
    prompt: "If $3^{2k} = 27$, find the value of $k$.",
    options: ["1.5", "1.0", "2.0", "0.5"],
    correctAnswer: "1.5",
    hint: "Express 27 in base 3: $27 = 3^3$. Set $2k = 3$.",
    workedSolution: "$$3^{2k} = 3^3 \\implies 2k = 3 \\implies k = 1.5$$.",
    points: 1
  },
  {
    number: 25,
    prompt: "A girl spends $\\frac{1}{5}$ of her allowance on transport and $\\frac{1}{2}$ on lunch. What fraction of her allowance is left?",
    options: ["3/10", "7/10", "1/10", "2/5"],
    correctAnswer: "3/10",
    hint: "Add fractions spent: $\\frac{1}{5} + \\frac{1}{2} = \\frac{7}{10}$. Subtract from 1.",
    workedSolution: "$$\\text{Spent} = \\frac{2 + 5}{10} = \\frac{7}{10}$$\n$$\\text{Remaining} = 1 - \\frac{7}{10} = \\frac{3}{10}$$.",
    points: 1
  },
  {
    number: 26,
    prompt: "Sets that contain the exact same number of elements without necessarily having identical members are classified as:",
    options: ["equivalent sets", "equal sets", "universal sets", "empty sets"],
    correctAnswer: "equivalent sets",
    hint: "Equal sets have identical members; equivalent sets have identical cardinality.",
    workedSolution: "Sets with the same cardinality ($n(A) = n(B)$) are equivalent sets.",
    points: 1
  },
  {
    number: 27,
    prompt: "Convert 35% to a common fraction in its lowest terms.",
    options: ["7/20", "3/10", "7/25", "1/4"],
    correctAnswer: "7/20",
    hint: "Divide 35 and 100 by 5.",
    workedSolution: "$$\\frac{35}{100} = \\frac{35 \\div 5}{100 \\div 5} = \\frac{7}{20}$$.",
    points: 1
  },
  {
    number: 28,
    prompt: `Find the mathematical rule for the mapping shown below:<br/>${svgP1Q28Var}`,
    options: [
      "x → 4x",
      "x → x + 3",
      "x → 3x + 1",
      "x → 2x + 2"
    ],
    correctAnswer: "x → 4x",
    hint: "Each output is 4 times the input value: $1 \\to 4, 2 \\to 8, \\dots$",
    workedSolution: "$$y = 4x \\implies x \\to 4x$$.",
    points: 1
  },
  {
    number: 29,
    prompt: "Find the circumference of a circle whose area is $64\\pi\\text{ cm}^2$.",
    options: ["16π cm", "8π cm", "32π cm", "64π cm"],
    correctAnswer: "16π cm",
    hint: "$\\pi r^2 = 64\\pi \\implies r = 8$. $C = 2\\pi r$.",
    workedSolution: "$$r = \\sqrt{64} = 8\\text{ cm}$$\n$$C = 2\\pi(8) = 16\\pi\\text{ cm}$$.",
    points: 1
  },
  {
    number: 30,
    prompt: `Find the value of $y$ in the geometric figure below:<br/>${svgP1Q30Var}`,
    options: ["28°", "32°", "24°", "30°"],
    correctAnswer: "28°",
    hint: "Alternate angle gives base angle $48^\\circ$. The isosceles triangle has two equal base angles of $48^\\circ$.",
    workedSolution: "$$3y + 48^\\circ + 48^\\circ = 180^\\circ$$\n$$3y + 96^\\circ = 180^\\circ \\implies 3y = 84^\\circ \\implies y = 28^\\circ$$.",
    points: 1
  },
  {
    number: 31,
    prompt: "Given the linear sequence $-8, -3, p, 7, 12, 17$, find the value of $p$.",
    options: ["2", "1", "3", "0"],
    correctAnswer: "2",
    hint: "Common difference $d = -3 - (-8) = 5$. Add 5 to $-3$.",
    workedSolution: "$$d = 5$$\n$$p = -3 + 5 = 2$$.",
    points: 1
  },
  {
    number: 32,
    prompt: "The marks obtained by 9 students in a quiz are: $3, 6, 6, 7, 8, 8, 8, 9, 10$. What is the modal mark?",
    options: ["8", "6", "7", "9"],
    correctAnswer: "8",
    hint: "The mark 8 appears three times.",
    workedSolution: "Mark 8 has the highest frequency of 3. Mode $= 8$.",
    points: 1
  },
  {
    number: 33,
    prompt: "If $u = \\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$ and $v = \\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix}$, evaluate $4v + 3u$.",
    options: [
      "(-6, 17)",
      "(-6, 14)",
      "(6, 17)",
      "(-18, 17)"
    ],
    correctAnswer: "(-6, 17)",
    hint: "$$4\\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix} + 3\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$$.",
    workedSolution: "$$\\begin{pmatrix} -12 \\\\ 8 \\end{pmatrix} + \\begin{pmatrix} 6 \\\\ 9 \\end{pmatrix} = \\begin{pmatrix} -6 \\\\ 17 \\end{pmatrix}$$.",
    points: 1
  },
  {
    number: 34,
    prompt: "Evaluate $m^2(n - 1)$ when $m = 3$ and $n = \\frac{2}{3}$.",
    options: ["-3", "3", "-1", "1"],
    correctAnswer: "-3",
    hint: "Substitute: $3^2 \\left(\\frac{2}{3} - 1\\right)$.",
    workedSolution: "$$9 \\left(-\\frac{1}{3}\\right) = -3$$.",
    points: 1
  },
  {
    number: 35,
    prompt: "Kojo and Mensah share GH¢ 48.00 in the ratio $5 : 3$ respectively. Find Mensah's share.",
    options: ["GH¢ 18.00", "GH¢ 30.00", "GH¢ 16.00", "GH¢ 24.00"],
    correctAnswer: "GH¢ 18.00",
    hint: "Total parts $= 5 + 3 = 8$. Mensah receives $\\frac{3}{8} \\times 48$.",
    workedSolution: "$$\\text{Mensah} = \\frac{3}{8} \\times 48 = 3 \\times 6 = \\text{GH¢ } 18.00$$.",
    points: 1
  },
  {
    number: 36,
    prompt: "The table below shows marks scored by candidates. Find the median score:<br/><br/>| Mark | 0 | 1 | 2 | 3 | 4 | 5 |<br/>| :--- | :---: | :---: | :---: | :---: | :---: | :---: |<br/>| Frequency | 2 | 3 | 6 | 6 | 4 | 3 |",
    options: ["3", "2", "2.5", "4"],
    correctAnswer: "3",
    hint: "Total frequency is 24. Median is the mean of the 12th and 13th values.",
    workedSolution: "$$\\sum f = 24$$\nCumulative frequencies: Mark 0 (2), Mark 1 (5), Mark 2 (11), Mark 3 (17).\nThe 12th and 13th positions fall under Mark 3. Median $= 3$.",
    points: 1
  },
  {
    number: 37,
    prompt: "From the frequency table in Question 36, find the probability that a candidate selected at random scored 2 marks.",
    options: ["1/4", "1/6", "1/3", "1/8"],
    correctAnswer: "1/4",
    hint: "Frequency for mark 2 is 6; total frequency is 24.",
    workedSolution: "$$P(\\text{score } 2) = \\frac{6}{24} = \\frac{1}{4}$$.",
    points: 1
  },
  {
    number: 38,
    prompt: "If $\\frac{2}{3}y = 3 + \\frac{1}{3}$, find the value of $y$.",
    options: ["5", "4", "6", "3"],
    correctAnswer: "5",
    hint: "$$3 + \\frac{1}{3} = \\frac{10}{3}$$.",
    workedSolution: "$$\\frac{2}{3}y = \\frac{10}{3} \\implies 2y = 10 \\implies y = 5$$.",
    points: 1
  },
  {
    number: 39,
    prompt: "The product of three positive integers is 120. If two of the integers are 4 and 5, find the third integer.",
    options: ["6", "8", "5", "10"],
    correctAnswer: "6",
    hint: "Divide 120 by $(4 \\times 5 = 20)$.",
    workedSolution: "$$4 \\times 5 \\times z = 120 \\implies 20z = 120 \\implies z = 6$$.",
    points: 1
  },
  {
    number: 40,
    prompt: "Simplify: $2x - 3(4 - 3x) - 10x + 5$.",
    options: ["x - 7", "-x - 7", "x + 7", "-19x - 7"],
    correctAnswer: "x - 7",
    hint: "Expand bracket: $-3(4 - 3x) = -12 + 9x$.",
    workedSolution: "$$2x - 12 + 9x - 10x + 5 = (2x + 9x - 10x) + (-12 + 5) = x - 7$$.",
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

async function seedBece2026VariantPaper1() {
  console.log('===============================================================');
  console.log('  STAGE 1: SEEDING 2026 BECE VARIANT - PAPER 1 (OBJECTIVE)     ');
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

  const paperDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2026_variant');

  const payload = {
    id: "paper_2026_variant",
    year: 2026,
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
  await paperDocRef.set(payload, { merge: true });
  console.log('✅ Ingested Paper 1 into past_papers/paper_2026_variant');

  // 2. Also mirror to year_2026_variant for historical series parity
  const yearDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/year_2026_variant');
  await yearDocRef.set({ ...payload, id: "year_2026_variant" }, { merge: true });
  console.log('✅ Ingested Paper 1 into past_papers/year_2026_variant');

  console.log('\n🎉 Stage 1 (Paper 1) successfully completed!');
}

seedBece2026VariantPaper1()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to seed 2026 variant Paper 1:', err);
    process.exit(1);
  });
