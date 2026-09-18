import * as _admin from 'firebase-admin';
const admin: any = (_admin as any).default || _admin;
import * as fs from 'fs';

const apps = admin.apps || (_admin as any).apps || [];
if (!apps.length) {
  const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
  if (fs.existsSync(serviceAccountPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      projectId: 'gamedu-69888475-f5783'
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
      projectId: 'gamedu-69888475-f5783'
    });
  } else {
    admin.initializeApp({
      projectId: 'gamedu-69888475-f5783',
    });
  }
}

const db = admin.firestore();

// 1. Vector SVG for Q18 & Q19 Variant (Parallel Lines AB and DE intersecting at C)
const svgQ18Q19Var = `<svg viewBox='0 0 380 180' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><line x1='30' y1='110' x2='100' y2='40' stroke='#2563eb' stroke-width='2.5'/><polygon points='60,78 68,70 62,68' fill='#2563eb'/><line x1='280' y1='140' x2='350' y2='70' stroke='#2563eb' stroke-width='2.5'/><polygon points='310,108 318,100 312,98' fill='#2563eb'/><line x1='100' y1='40' x2='280' y2='140' stroke='#1e293b' stroke-width='2'/><line x1='30' y1='110' x2='350' y2='70' stroke='#1e293b' stroke-width='2'/><text x='18' y='120' font-size='12' font-weight='bold' fill='#0f172a'>A</text><text x='100' y='30' font-size='12' font-weight='bold' fill='#0f172a'>B</text><text x='185' y='110' font-size='12' font-weight='bold' fill='#0f172a'>C</text><text x='285' y='155' font-size='12' font-weight='bold' fill='#0f172a'>D</text><text x='358' y='75' font-size='12' font-weight='bold' fill='#0f172a'>E</text><text x='105' y='55' font-size='11' font-weight='bold' fill='#dc2626'>75°</text><text x='48' y='108' font-size='11' font-weight='bold' fill='#16a34a'>y</text><text x='215' y='95' font-size='11' font-weight='bold' fill='#2563eb'>25°</text><text x='268' y='132' font-size='11' font-weight='bold' fill='#d97706'>x</text><text x='190' y='168' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q24, Q25, Q26 Variant (Stem-and-Leaf Plot: Cocoa Weights)
const svgStemLeafVar = `<svg viewBox='0 0 340 210' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><text x='45' y='25' font-size='12' font-weight='bold' fill='#475569'>Stem</text><text x='100' y='25' font-size='12' font-weight='bold' fill='#475569'>Leaf</text><line x1='20' y1='32' x2='320' y2='32' stroke='#cbd5e1' stroke-width='1'/><line x1='80' y1='20' x2='80' y2='175' stroke='#64748b' stroke-width='1.5'/><text x='50' y='55' font-size='12' font-weight='bold' fill='#1e293b'>4</text><text x='95' y='55' font-size='12' font-family='monospace' fill='#2563eb'>1  3  5  8</text><text x='50' y='80' font-size='12' font-weight='bold' fill='#1e293b'>5</text><text x='95' y='80' font-size='12' font-family='monospace' fill='#2563eb'>2  4  5  6  7  9</text><text x='50' y='105' font-size='12' font-weight='bold' fill='#1e293b'>6</text><text x='95' y='105' font-size='12' font-family='monospace' fill='#2563eb'>1  2  3  5  5  5  5  6  7  8</text><text x='50' y='130' font-size='12' font-weight='bold' fill='#1e293b'>7</text><text x='95' y='130' font-size='12' font-family='monospace' fill='#2563eb'>2  3  4  5  6  8  8  9</text><text x='50' y='155' font-size='12' font-weight='bold' fill='#1e293b'>8</text><text x='95' y='155' font-size='12' font-family='monospace' fill='#2563eb'>1  3  4  7  8</text><text x='50' y='175' font-size='12' font-weight='bold' fill='#1e293b'>9</text><text x='95' y='175' font-size='12' font-family='monospace' fill='#2563eb'>3  6</text><rect x='20' y='182' width='300' height='20' rx='3' fill='#e2e8f0'/><text x='30' y='196' font-size='11' font-weight='600' fill='#334155'>Key: 5 | 2 = 52 kg</text></svg>`.trim().replace(/\n\s*/g, '');

const paper1Questions = [
  {
    "number": 1,
    "prompt": "Express 72 as a product of prime factors in index notation.",
    "options": [
      "2³ × 3²",
      "2² × 3³",
      "2⁴ × 3",
      "2³ × 3"
    ],
    "correctAnswer": "2³ × 3²",
    "hint": "Divide successively by prime numbers: 72 = 8 × 9.",
    "workedSolution": "$$72 = 2 \\times 36 = 2^2 \\times 18 = 2^3 \\times 9 = 2^3 \\times 3^2$$.",
    "points": 1
  },
  {
    "number": 2,
    "prompt": "A football match starts at 3:20 pm and lasts for 1 hour 50 minutes. At what time will the game end?",
    "options": [
      "5:10 pm",
      "4:10 pm",
      "5:20 pm",
      "6:10 pm"
    ],
    "correctAnswer": "5:10 pm",
    "hint": "Add 1 hour to 3:20 pm (4:20 pm), then add 50 minutes.",
    "workedSolution": "$$3:20\\text{ pm} + 1\\text{ h } 50\\text{ min} = 4:70\\text{ pm} = 5:10\\text{ pm}$$.",
    "points": 1
  },
  {
    "number": 3,
    "prompt": "Which of the following is NOT a quadrilateral?",
    "options": [
      "Pentagon",
      "Rhombus",
      "Parallelogram",
      "Trapezium"
    ],
    "correctAnswer": "Pentagon",
    "hint": "A quadrilateral has exactly 4 sides.",
    "workedSolution": "A pentagon has 5 sides, so it is not a quadrilateral.",
    "points": 1
  },
  {
    "number": 4,
    "prompt": "Solve the inequality: $4x - (6x - 2) \\le 8$.",
    "options": [
      "x ≥ -3",
      "x ≤ -3",
      "x ≥ -5",
      "x ≤ 3"
    ],
    "correctAnswer": "x ≥ -3",
    "hint": "Expand the brackets carefully: $-(6x - 2) = -6x + 2$.",
    "workedSolution": "$$4x - 6x + 2 \\le 8 \\implies -2x \\le 6$$\nDivide by -2 and reverse the inequality sign: $$x \\ge -3$$.",
    "points": 1
  },
  {
    "number": 5,
    "prompt": "Simplify: $1\\frac{1}{4} \\div 2\\frac{1}{2}$.",
    "options": [
      "1/2",
      "2/5",
      "3/4",
      "5/8"
    ],
    "correctAnswer": "1/2",
    "hint": "Convert to improper fractions: $\\frac{5}{4} \\div \\frac{5}{2}$.",
    "workedSolution": "$$\\frac{5}{4} \\div \\frac{5}{2} = \\frac{5}{4} \\times \\frac{2}{5} = \\frac{2}{4} = \\frac{1}{2}$$.",
    "points": 1
  },
  {
    "number": 6,
    "prompt": "Given that vector $\\vec{AB} = \\begin{pmatrix} -4 \\\\ 7 \\end{pmatrix}$, find $\\vec{BA}$.",
    "options": [
      "(4, -7)",
      "(-4, -7)",
      "(4, 7)",
      "(-7, 4)"
    ],
    "correctAnswer": "(4, -7)",
    "hint": "$$\\vec{BA} = -\\vec{AB}$$.",
    "workedSolution": "$$\\vec{BA} = -\\begin{pmatrix} -4 \\\\ 7 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ -7 \\end{pmatrix}$$.",
    "points": 1
  },
  {
    "number": 7,
    "prompt": "The point $K(5, 2)$ is reflected in the $y$-axis. Find the coordinates of the image of $K$.",
    "options": [
      "(-5, 2)",
      "(5, -2)",
      "(-5, -2)",
      "(2, 5)"
    ],
    "correctAnswer": "(-5, 2)",
    "hint": "Reflection in the y-axis maps $(x, y) \\to (-x, y)$.",
    "workedSolution": "$$K(5, 2) \\to K'(-5, 2)$$.",
    "points": 1
  },
  {
    "number": 8,
    "prompt": "Solve: $(x - 2) = \\frac{1}{2}(x + 4)$.",
    "options": [
      "8",
      "6",
      "4",
      "2"
    ],
    "correctAnswer": "8",
    "hint": "Multiply both sides by 2: $2(x - 2) = x + 4$.",
    "workedSolution": "$$2x - 4 = x + 4 \\implies 2x - x = 4 + 4 \\implies x = 8$$.",
    "points": 1
  },
  {
    "number": 9,
    "prompt": "The longest chord of a circle is the:",
    "options": [
      "diameter",
      "radius",
      "segment",
      "sector"
    ],
    "correctAnswer": "diameter",
    "hint": "It passes directly through the center of the circle.",
    "workedSolution": "The diameter is the longest chord that can be drawn in any circle.",
    "points": 1
  },
  {
    "number": 10,
    "prompt": "Factorize completely: $ab - am - mb + m^2$.",
    "options": [
      "(a - m)(b - m)",
      "(m - b)(a - m)",
      "(a + m)(b - m)",
      "(b - m)(m - a)"
    ],
    "correctAnswer": "(a - m)(b - m)",
    "hint": "Group terms: $a(b - m) - m(b - m)$.",
    "workedSolution": "$$a(b - m) - m(b - m) = (a - m)(b - m)$$.",
    "points": 1
  },
  {
    "number": 11,
    "prompt": "Given that $P(4, -3)$ and $Q(-1, 3)$ are points in a plane, find the gradient of the line joining $P$ to $Q$.",
    "options": [
      "-6/5",
      "6/5",
      "-5/6",
      "5/6"
    ],
    "correctAnswer": "-6/5",
    "hint": "$$m = \\frac{y_2 - y_1}{x_2 - x_1}$$.",
    "workedSolution": "$$m = \\frac{3 - (-3)}{-1 - 4} = \\frac{6}{-5} = -\\frac{6}{5}$$.",
    "points": 1
  },
  {
    "number": 12,
    "prompt": "If $\\frac{k}{100} = 12.5$, find the value of $k$.",
    "options": [
      "1250",
      "125",
      "1.25",
      "0.125"
    ],
    "correctAnswer": "1250",
    "hint": "Multiply 12.5 by 100.",
    "workedSolution": "$$k = 12.5 \\times 100 = 1,250$$.",
    "points": 1
  },
  {
    "number": 13,
    "prompt": "The rule of a mapping is $x \\to 3x^2 - 1$. What number does $x = 2$ map to?",
    "options": [
      "11",
      "12",
      "10",
      "7"
    ],
    "correctAnswer": "11",
    "hint": "Substitute $x = 2$: $3(2^2) - 1$.",
    "workedSolution": "$$3(4) - 1 = 12 - 1 = 11$$.",
    "points": 1
  },
  {
    "number": 14,
    "prompt": "Find the value of $y = \\frac{b^2 - 4ac}{2a}$ when $a = 2$, $b = -6$, and $c = -2$.",
    "options": [
      "13",
      "8",
      "16",
      "10"
    ],
    "correctAnswer": "13",
    "hint": "$$b^2 = (-6)^2 = 36$$, $$-4ac = -4(2)(-2) = +16$$.",
    "workedSolution": "$$y = \\frac{36 - (-16)}{2(2)} = \\frac{36 + 16}{4} = \\frac{52}{4} = 13$$.",
    "points": 1
  },
  {
    "number": 15,
    "prompt": "Arrange the following fractions from the lowest to the highest: $\\frac{2}{5}, \\frac{1}{4}, \\frac{1}{2}$.",
    "options": [
      "1/4, 2/5, 1/2",
      "2/5, 1/4, 1/2",
      "1/2, 2/5, 1/4",
      "1/4, 1/2, 2/5"
    ],
    "correctAnswer": "1/4, 2/5, 1/2",
    "hint": "Convert to decimals: $1/4 = 0.25$, $2/5 = 0.40$, $1/2 = 0.50$.",
    "workedSolution": "$$0.25 < 0.40 < 0.50 \\implies \\frac{1}{4}, \\frac{2}{5}, \\frac{1}{2}$$.",
    "points": 1
  },
  {
    "number": 16,
    "prompt": "A room is rented at GH¢ 12.00 per month. How much money is paid in $1\\frac{1}{2}$ years?",
    "options": [
      "GH¢ 216.00",
      "GH¢ 180.00",
      "GH¢ 144.00",
      "GH¢ 108.00"
    ],
    "correctAnswer": "GH¢ 216.00",
    "hint": "$1\\frac{1}{2}\\text{ years} = 18\\text{ months}$. Multiply 18 by GH¢ 12.00.",
    "workedSolution": "$$\\text{Rent} = 18 \\times 12 = \\text{GH¢ } 216.00$$.",
    "points": 1
  },
  {
    "number": 17,
    "prompt": "A certain number is subtracted from 15 and the result is multiplied by 3. If the answer is 24, find the number.",
    "options": [
      "7",
      "8",
      "6",
      "9"
    ],
    "correctAnswer": "7",
    "hint": "$$3(15 - x) = 24$$.",
    "workedSolution": "$$15 - x = \\frac{24}{3} = 8 \\implies x = 15 - 8 = 7$$.",
    "points": 1
  },
  {
    "number": 18,
    "prompt": "In the diagram below, $AB$ is parallel to $DE$, $\\angle ABC = 75^\\circ$ and $\\angle DCE = 25^\\circ$. What is the value of $x$?<br/><svg viewBox='0 0 380 180' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><line x1='30' y1='110' x2='100' y2='40' stroke='#2563eb' stroke-width='2.5'/><polygon points='60,78 68,70 62,68' fill='#2563eb'/><line x1='280' y1='140' x2='350' y2='70' stroke='#2563eb' stroke-width='2.5'/><polygon points='310,108 318,100 312,98' fill='#2563eb'/><line x1='100' y1='40' x2='280' y2='140' stroke='#1e293b' stroke-width='2'/><line x1='30' y1='110' x2='350' y2='70' stroke='#1e293b' stroke-width='2'/><text x='18' y='120' font-size='12' font-weight='bold' fill='#0f172a'>A</text><text x='100' y='30' font-size='12' font-weight='bold' fill='#0f172a'>B</text><text x='185' y='110' font-size='12' font-weight='bold' fill='#0f172a'>C</text><text x='285' y='155' font-size='12' font-weight='bold' fill='#0f172a'>D</text><text x='358' y='75' font-size='12' font-weight='bold' fill='#0f172a'>E</text><text x='105' y='55' font-size='11' font-weight='bold' fill='#dc2626'>75°</text><text x='48' y='108' font-size='11' font-weight='bold' fill='#16a34a'>y</text><text x='215' y='95' font-size='11' font-weight='bold' fill='#2563eb'>25°</text><text x='268' y='132' font-size='11' font-weight='bold' fill='#d97706'>x</text><text x='190' y='168' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>",
    "options": [
      "75°",
      "25°",
      "80°",
      "105°"
    ],
    "correctAnswer": "75°",
    "hint": "$\\angle CDE$ and $\\angle ABC$ are alternate interior angles.",
    "workedSolution": "Since $AB \\parallel DE$, angle $x$ and angle $ABC$ are alternate interior angles. Thus, $x = 75^\\circ$.",
    "points": 1
  },
  {
    "number": 19,
    "prompt": "In the diagram from Question 18, find the value of angle $y$:<br/><svg viewBox='0 0 380 180' width='100%' height='160' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><line x1='30' y1='110' x2='100' y2='40' stroke='#2563eb' stroke-width='2.5'/><polygon points='60,78 68,70 62,68' fill='#2563eb'/><line x1='280' y1='140' x2='350' y2='70' stroke='#2563eb' stroke-width='2.5'/><polygon points='310,108 318,100 312,98' fill='#2563eb'/><line x1='100' y1='40' x2='280' y2='140' stroke='#1e293b' stroke-width='2'/><line x1='30' y1='110' x2='350' y2='70' stroke='#1e293b' stroke-width='2'/><text x='18' y='120' font-size='12' font-weight='bold' fill='#0f172a'>A</text><text x='100' y='30' font-size='12' font-weight='bold' fill='#0f172a'>B</text><text x='185' y='110' font-size='12' font-weight='bold' fill='#0f172a'>C</text><text x='285' y='155' font-size='12' font-weight='bold' fill='#0f172a'>D</text><text x='358' y='75' font-size='12' font-weight='bold' fill='#0f172a'>E</text><text x='105' y='55' font-size='11' font-weight='bold' fill='#dc2626'>75°</text><text x='48' y='108' font-size='11' font-weight='bold' fill='#16a34a'>y</text><text x='215' y='95' font-size='11' font-weight='bold' fill='#2563eb'>25°</text><text x='268' y='132' font-size='11' font-weight='bold' fill='#d97706'>x</text><text x='190' y='168' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>",
    "options": [
      "80°",
      "75°",
      "100°",
      "25°"
    ],
    "correctAnswer": "80°",
    "hint": "Vertically opposite angle $\\angle ACB = 25^\\circ$. In $\\triangle ABC$, angles sum to $180^\\circ$.",
    "workedSolution": "$$\\angle ACB = \\angle DCE = 25^\\circ$$\n$$y + 75^\\circ + 25^\\circ = 180^\\circ \\implies y + 100^\\circ = 180^\\circ \\implies y = 80^\\circ$$.",
    "points": 1
  },
  {
    "number": 20,
    "prompt": "Kofi walked 8 km due north and 6 km due east. How far was he from his starting point?",
    "options": [
      "10 km",
      "14 km",
      "48 km",
      "2 km"
    ],
    "correctAnswer": "10 km",
    "hint": "Apply Pythagoras theorem: $\\sqrt{8^2 + 6^2}$.",
    "workedSolution": "$$d = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = \\sqrt{100} = 10\\text{ km}$$.",
    "points": 1
  },
  {
    "number": 21,
    "prompt": "Which of the following is the largest set of numbers?",
    "options": [
      "{Integers}",
      "{Whole numbers}",
      "{Natural numbers}",
      "{Prime numbers}"
    ],
    "correctAnswer": "{Integers}",
    "hint": "Integers contain both negative numbers, zero, and natural numbers.",
    "workedSolution": "{Integers} encompasses all natural numbers, whole numbers, and their negative counterparts.",
    "points": 1
  },
  {
    "number": 22,
    "prompt": "Write $1840.65$ in standard form.",
    "options": [
      "1.84065 × 10³",
      "1.84065 × 10⁻³",
      "1.84065 × 10²",
      "1.84065 × 10⁴"
    ],
    "correctAnswer": "1.84065 × 10³",
    "hint": "Shift decimal point 3 places to the left.",
    "workedSolution": "$$1840.65 = 1.84065 \\times 10^3$$.",
    "points": 1
  },
  {
    "number": 23,
    "prompt": "Expand: $(2x - y)(x - y)$.",
    "options": [
      "2x² - 3xy + y²",
      "2x² + 3xy - y²",
      "2x² - 3xy - y²",
      "2x² + 3xy + y²"
    ],
    "correctAnswer": "2x² - 3xy + y²",
    "hint": "FOIL: $2x(x) - 2xy - xy + y^2$.",
    "workedSolution": "$$2x^2 - 2xy - xy + y^2 = 2x^2 - 3xy + y^2$$.",
    "points": 1
  },
  {
    "number": 24,
    "prompt": "The stem and leaf plot below shows the weights (kg) of cocoa bags weighed in a week:<br/><svg viewBox='0 0 340 210' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><text x='45' y='25' font-size='12' font-weight='bold' fill='#475569'>Stem</text><text x='100' y='25' font-size='12' font-weight='bold' fill='#475569'>Leaf</text><line x1='20' y1='32' x2='320' y2='32' stroke='#cbd5e1' stroke-width='1'/><line x1='80' y1='20' x2='80' y2='175' stroke='#64748b' stroke-width='1.5'/><text x='50' y='55' font-size='12' font-weight='bold' fill='#1e293b'>4</text><text x='95' y='55' font-size='12' font-family='monospace' fill='#2563eb'>1  3  5  8</text><text x='50' y='80' font-size='12' font-weight='bold' fill='#1e293b'>5</text><text x='95' y='80' font-size='12' font-family='monospace' fill='#2563eb'>2  4  5  6  7  9</text><text x='50' y='105' font-size='12' font-weight='bold' fill='#1e293b'>6</text><text x='95' y='105' font-size='12' font-family='monospace' fill='#2563eb'>1  2  3  5  5  5  5  6  7  8</text><text x='50' y='130' font-size='12' font-weight='bold' fill='#1e293b'>7</text><text x='95' y='130' font-size='12' font-family='monospace' fill='#2563eb'>2  3  4  5  6  8  8  9</text><text x='50' y='155' font-size='12' font-weight='bold' fill='#1e293b'>8</text><text x='95' y='155' font-size='12' font-family='monospace' fill='#2563eb'>1  3  4  7  8</text><text x='50' y='175' font-size='12' font-weight='bold' fill='#1e293b'>9</text><text x='95' y='175' font-size='12' font-family='monospace' fill='#2563eb'>3  6</text><rect x='20' y='182' width='300' height='20' rx='3' fill='#e2e8f0'/><text x='30' y='196' font-size='11' font-weight='600' fill='#334155'>Key: 5 | 2 = 52 kg</text></svg><br/>How many bags of cocoa were weighed in total?",
    "options": [
      "35",
      "29",
      "40",
      "30"
    ],
    "correctAnswer": "35",
    "hint": "Count the total number of leaves across all stems.",
    "workedSolution": "$$4 + 6 + 10 + 8 + 5 + 2 = 35\\text{ bags}$$.",
    "points": 1
  },
  {
    "number": 25,
    "prompt": "Using the stem and leaf plot from Question 24, find the modal weight:<br/><svg viewBox='0 0 340 210' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><text x='45' y='25' font-size='12' font-weight='bold' fill='#475569'>Stem</text><text x='100' y='25' font-size='12' font-weight='bold' fill='#475569'>Leaf</text><line x1='20' y1='32' x2='320' y2='32' stroke='#cbd5e1' stroke-width='1'/><line x1='80' y1='20' x2='80' y2='175' stroke='#64748b' stroke-width='1.5'/><text x='50' y='55' font-size='12' font-weight='bold' fill='#1e293b'>4</text><text x='95' y='55' font-size='12' font-family='monospace' fill='#2563eb'>1  3  5  8</text><text x='50' y='80' font-size='12' font-weight='bold' fill='#1e293b'>5</text><text x='95' y='80' font-size='12' font-family='monospace' fill='#2563eb'>2  4  5  6  7  9</text><text x='50' y='105' font-size='12' font-weight='bold' fill='#1e293b'>6</text><text x='95' y='105' font-size='12' font-family='monospace' fill='#2563eb'>1  2  3  5  5  5  5  6  7  8</text><text x='50' y='130' font-size='12' font-weight='bold' fill='#1e293b'>7</text><text x='95' y='130' font-size='12' font-family='monospace' fill='#2563eb'>2  3  4  5  6  8  8  9</text><text x='50' y='155' font-size='12' font-weight='bold' fill='#1e293b'>8</text><text x='95' y='155' font-size='12' font-family='monospace' fill='#2563eb'>1  3  4  7  8</text><text x='50' y='175' font-size='12' font-weight='bold' fill='#1e293b'>9</text><text x='95' y='175' font-size='12' font-family='monospace' fill='#2563eb'>3  6</text><rect x='20' y='182' width='300' height='20' rx='3' fill='#e2e8f0'/><text x='30' y='196' font-size='11' font-weight='600' fill='#334155'>Key: 5 | 2 = 52 kg</text></svg>",
    "options": [
      "65 kg",
      "62 kg",
      "78 kg",
      "68 kg"
    ],
    "correctAnswer": "65 kg",
    "hint": "Leaf 5 on stem 6 occurs 4 times.",
    "workedSolution": "The value 65 kg has the highest frequency (4 times). Mode = 65 kg.",
    "points": 1
  },
  {
    "number": 26,
    "prompt": "Using the stem and leaf plot from Question 24, find the median weight:<br/><svg viewBox='0 0 340 210' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><text x='45' y='25' font-size='12' font-weight='bold' fill='#475569'>Stem</text><text x='100' y='25' font-size='12' font-weight='bold' fill='#475569'>Leaf</text><line x1='20' y1='32' x2='320' y2='32' stroke='#cbd5e1' stroke-width='1'/><line x1='80' y1='20' x2='80' y2='175' stroke='#64748b' stroke-width='1.5'/><text x='50' y='55' font-size='12' font-weight='bold' fill='#1e293b'>4</text><text x='95' y='55' font-size='12' font-family='monospace' fill='#2563eb'>1  3  5  8</text><text x='50' y='80' font-size='12' font-weight='bold' fill='#1e293b'>5</text><text x='95' y='80' font-size='12' font-family='monospace' fill='#2563eb'>2  4  5  6  7  9</text><text x='50' y='105' font-size='12' font-weight='bold' fill='#1e293b'>6</text><text x='95' y='105' font-size='12' font-family='monospace' fill='#2563eb'>1  2  3  5  5  5  5  6  7  8</text><text x='50' y='130' font-size='12' font-weight='bold' fill='#1e293b'>7</text><text x='95' y='130' font-size='12' font-family='monospace' fill='#2563eb'>2  3  4  5  6  8  8  9</text><text x='50' y='155' font-size='12' font-weight='bold' fill='#1e293b'>8</text><text x='95' y='155' font-size='12' font-family='monospace' fill='#2563eb'>1  3  4  7  8</text><text x='50' y='175' font-size='12' font-weight='bold' fill='#1e293b'>9</text><text x='95' y='175' font-size='12' font-family='monospace' fill='#2563eb'>3  6</text><rect x='20' y='182' width='300' height='20' rx='3' fill='#e2e8f0'/><text x='30' y='196' font-size='11' font-weight='600' fill='#334155'>Key: 5 | 2 = 52 kg</text></svg>",
    "options": [
      "65 kg",
      "64 kg",
      "66 kg",
      "63 kg"
    ],
    "correctAnswer": "65 kg",
    "hint": "For 35 items, the median is the 18th value.",
    "workedSolution": "Counting to the 18th value: leaves on stems 4 and 5 account for $4 + 6 = 10$ values. The 8th value on stem 6 is 5, giving 65 kg.",
    "points": 1
  },
  {
    "number": 27,
    "prompt": "If $\\mathbf{a} = \\begin{pmatrix} 3 \\\\ -4 \\end{pmatrix}$ and $\\mathbf{b} = \\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix}$, find $\\mathbf{a} + \\mathbf{b}$.",
    "options": [
      "(0, 0)",
      "(6, -8)",
      "(-6, 8)",
      "(0, -8)"
    ],
    "correctAnswer": "(0, 0)",
    "hint": "Add corresponding x and y components.",
    "workedSolution": "$$\\begin{pmatrix} 3 + (-3) \\\\ -4 + 4 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\end{pmatrix}$$.",
    "points": 1
  },
  {
    "number": 28,
    "prompt": "For what value of $x$ is $2^x = 32$?",
    "options": [
      "5",
      "4",
      "6",
      "16"
    ],
    "correctAnswer": "5",
    "hint": "$$2^1=2, 2^2=4, 2^3=8, 2^4=16, 2^5=32$$.",
    "workedSolution": "$$2^x = 2^5 \\implies x = 5$$.",
    "points": 1
  },
  {
    "number": 29,
    "prompt": "Simplify: $-12 - (-18) + (-8)$.",
    "options": [
      "-2",
      "2",
      "-22",
      "14"
    ],
    "correctAnswer": "-2",
    "hint": "$$-12 + 18 - 8$$.",
    "workedSolution": "$$(-12 + 18) - 8 = 6 - 8 = -2$$.",
    "points": 1
  },
  {
    "number": 30,
    "prompt": "Express $\\frac{5}{8}$ as a decimal fraction.",
    "options": [
      "0.625",
      "0.375",
      "0.585",
      "0.650"
    ],
    "correctAnswer": "0.625",
    "hint": "Divide 5.000 by 8.",
    "workedSolution": "$$\\frac{5}{8} = 0.625$$.",
    "points": 1
  },
  {
    "number": 31,
    "prompt": "What is the length of one side of a square of area $144\\text{ cm}^2$?",
    "options": [
      "12.00 cm",
      "14.00 cm",
      "72.00 cm",
      "36.00 cm"
    ],
    "correctAnswer": "12.00 cm",
    "hint": "Side = $\\sqrt{144}$.",
    "workedSolution": "$$s = \\sqrt{144} = 12\\text{ cm}$$.",
    "points": 1
  },
  {
    "number": 32,
    "prompt": "What is the probability that a number greater than 4 shows up when a standard die is thrown?",
    "options": [
      "1/3",
      "1/6",
      "2/3",
      "1/2"
    ],
    "correctAnswer": "1/3",
    "hint": "Numbers greater than 4 are {5, 6}.",
    "workedSolution": "$$P(>4) = \\frac{2}{6} = \\frac{1}{3}$$.",
    "points": 1
  },
  {
    "number": 33,
    "prompt": "Given that $115(14 + 16) = 115(18 + k)$, find the value of $k$.",
    "options": [
      "12",
      "-12",
      "30",
      "15"
    ],
    "correctAnswer": "12",
    "hint": "Equate brackets: $14 + 16 = 18 + k$.",
    "workedSolution": "$$30 = 18 + k \\implies k = 30 - 18 = 12$$.",
    "points": 1
  },
  {
    "number": 34,
    "prompt": "A mother has GH¢ 10.00 and gives each of her 3 children GH¢ 2.50 as pocket money. How much is left for her?",
    "options": [
      "GH¢ 2.50",
      "GH¢ 3.50",
      "GH¢ 1.50",
      "GH¢ 7.50"
    ],
    "correctAnswer": "GH¢ 2.50",
    "hint": "Total given out = $3 \\times 2.50 = 7.50$.",
    "workedSolution": "$$10.00 - (3 \\times 2.50) = 10.00 - 7.50 = \\text{GH¢ } 2.50$$.",
    "points": 1
  },
  {
    "number": 35,
    "prompt": "A vehicle travels 72 kilometres in an hour. Find its speed in metres per second (m/s).",
    "options": [
      "20 m/s",
      "10 m/s",
      "15 m/s",
      "25 m/s"
    ],
    "correctAnswer": "20 m/s",
    "hint": "Multiply by $\\frac{5}{18}$.",
    "workedSolution": "$$72 \\times \\frac{5}{18} = 4 \\times 5 = 20\\text{ m/s}$$.",
    "points": 1
  },
  {
    "number": 36,
    "prompt": "Ama had GH¢ 200.00 and spent GH¢ 76.00. What percentage of the money is left?",
    "options": [
      "62.00%",
      "38.00%",
      "58.00%",
      "42.00%"
    ],
    "correctAnswer": "62.00%",
    "hint": "Remaining money is $200 - 76 = 124$.",
    "workedSolution": "$$\\frac{124}{200} \\times 100\\% = 62.00\\%$$.",
    "points": 1
  },
  {
    "number": 37,
    "prompt": "If a trader made a profit of 10% in selling a shirt for GH¢ 55.00, find the cost price.",
    "options": [
      "GH¢ 50.00",
      "GH¢ 49.50",
      "GH¢ 45.00",
      "GH¢ 60.50"
    ],
    "correctAnswer": "GH¢ 50.00",
    "hint": "$$1.10 \\times CP = 55.00$$.",
    "workedSolution": "$$CP = \\frac{55.00}{1.10} = \\text{GH¢ } 50.00$$.",
    "points": 1
  },
  {
    "number": 38,
    "prompt": "Express the ratio $20 : 16$ in the form $1 : n$.",
    "options": [
      "1 : 0.8",
      "1 : 1.25",
      "1 : 0.75",
      "1 : 1.2"
    ],
    "correctAnswer": "1 : 0.8",
    "hint": "Divide both terms by 20: $16 \\div 20 = 0.8$.",
    "workedSolution": "$$\\frac{20}{20} : \\frac{16}{20} = 1 : 0.8$$.",
    "points": 1
  },
  {
    "number": 39,
    "prompt": "The ratio of teachers to students in a school is $2 : 25$. If there were 30 teachers, how many students were there?",
    "options": [
      "375",
      "250",
      "300",
      "500"
    ],
    "correctAnswer": "375",
    "hint": "1 unit of ratio = $30 \\div 2 = 15$. Multiply 15 by 25.",
    "workedSolution": "$$\\text{Students} = 15 \\times 25 = 375$$.",
    "points": 1
  },
  {
    "number": 40,
    "prompt": "The volume of a cylinder is $60\\pi\\text{ cm}^3$. If the height of the cylinder is $15\\text{ cm}$, find the base radius.",
    "options": [
      "2 cm",
      "4 cm",
      "1 cm",
      "3 cm"
    ],
    "correctAnswer": "2 cm",
    "hint": "$$V = \\pi r^2 h \\implies \\pi r^2 (15) = 60\\pi$$.",
    "workedSolution": "$$15r^2 = 60 \\implies r^2 = 4 \\implies r = 2\\text{ cm}$$.",
    "points": 1
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

async function fixAndSeedBece2022Paper1Variant() {
  console.log('Injecting strictly calibrated 2022 BECE Paper 1 Variant...');

  for (const q of paper1Questions) {
    q.options = shuffleArray(q.options);
  }

  const paperDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2022_variant');

  await paperDocRef.set({
    year: 2022,
    isVariant: true,
    examination: "WAEC BECE Mathematics (Cloned Practice Model)",
    paper1: {
      title: "Paper 1: Objective Test (Variant)",
      durationMinutes: 60,
      totalQuestions: 40,
      questions: paper1Questions
    },
    'metadata.paper1Calibrated': true,
    'metadata.updatedAt': admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  console.log('✅ Correctly seeded all 40 questions into past_papers/paper_2022_variant.');
}

fixAndSeedBece2022Paper1Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to overwrite 2022 Paper 1 variant:', err);
    process.exit(1);
  });
