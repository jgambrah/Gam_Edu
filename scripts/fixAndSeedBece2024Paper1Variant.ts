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

// 1. Vector SVG for Q4 & Q5 (Concentric Subsets: Y inside X)
const svgQ4Q5VennVar = `<svg viewBox='0 0 340 220' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><rect x='20' y='20' width='300' height='180' rx='4' fill='none' stroke='#334155' stroke-width='2'/><text x='305' y='40' font-size='13' font-weight='bold' fill='#0f172a'>U</text><circle cx='160' cy='110' r='75' fill='#eff6ff' stroke='#1d4ed8' stroke-width='2'/><text x='225' y='65' font-size='13' font-weight='bold' fill='#1d4ed8'>X</text><circle cx='160' cy='110' r='42' fill='#dbeafe' stroke='#2563eb' stroke-width='1.8'/><text x='195' y='95' font-size='12' font-weight='bold' fill='#1e40af'>Y</text><text x='150' y='105' font-size='12' font-weight='bold' fill='#1e293b'>p</text><text x='170' y='105' font-size='12' font-weight='bold' fill='#1e293b'>q</text><text x='160' y='130' font-size='12' font-weight='bold' fill='#1e293b'>r</text><text x='130' y='65' font-size='12' font-weight='bold' fill='#1e293b'>u</text><text x='190' y='65' font-size='12' font-weight='bold' fill='#1e293b'>v</text><text x='45' y='180' font-size='12' font-weight='bold' fill='#1e293b'>w</text><text x='280' y='180' font-size='12' font-weight='bold' fill='#1e293b'>z</text></svg>`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q12 (Parallel Lines with Reflex Corner: 40 deg & 150 deg)
const svgQ12ParallelVar = `<svg viewBox='0 0 360 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><line x1='20' y1='35' x2='340' y2='35' stroke='#1e293b' stroke-width='2'/><polygon points='280,32 290,35 280,38' fill='#1e293b'/><polygon points='290,32 300,35 290,38' fill='#1e293b'/><text x='25' y='28' font-size='12' font-weight='bold' fill='#0f172a'>A</text><text x='330' y='28' font-size='12' font-weight='bold' fill='#0f172a'>B</text><line x1='20' y1='145' x2='340' y2='145' stroke='#1e293b' stroke-width='2'/><polygon points='280,142 290,145 280,148' fill='#1e293b'/><polygon points='290,142 300,145 290,148' fill='#1e293b'/><text x='25' y='162' font-size='12' font-weight='bold' fill='#0f172a'>C</text><text x='330' y='162' font-size='12' font-weight='bold' fill='#0f172a'>D</text><line x1='50' y1='15' x2='180' y2='95' stroke='#2563eb' stroke-width='2.5'/><line x1='80' y1='180' x2='180' y2='95' stroke='#2563eb' stroke-width='2.5'/><path d='M 70 35 A 20 20 0 0 1 80 23' fill='none' stroke='#dc2626' stroke-width='1.8'/><text x='62' y='25' font-size='11' font-weight='bold' fill='#dc2626'>40°</text><path d='M 125 145 A 25 25 0 0 1 110 130' fill='none' stroke='#16a34a' stroke-width='1.8'/><text x='96' y='135' font-size='11' font-weight='bold' fill='#16a34a'>150°</text><path d='M 165 85 A 20 20 0 1 1 170 108' fill='none' stroke='#d97706' stroke-width='2'/><text x='200' y='100' font-size='12' font-weight='bold' fill='#d97706'>x</text><text x='180' y='172' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>`.trim().replace(/\n\s*/g, '');

// 3. Vector SVG for Q14 & Q15 (Linear Coordinate Graph: y = -2x + 4)
const svgQ14Q15GraphVar = `<svg viewBox='0 0 320 280' width='100%' height='230' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><pattern id='cartGridClean' width='24' height='24' patternUnits='userSpaceOnUse'><path d='M 24 0 L 0 0 0 24' fill='none' stroke='#e2e8f0' stroke-width='1'/></pattern></defs><rect width='100%' height='100%' fill='url(#cartGridClean)'/><line x1='15' y1='168' x2='305' y2='168' stroke='#334155' stroke-width='2'/><polygon points='305,165 313,168 305,171' fill='#334155'/><text x='308' y='184' font-size='11' font-weight='bold' fill='#334155'>x</text><line x1='96' y1='265' x2='96' y2='15' stroke='#334155' stroke-width='2'/><polygon points='93,15 96,7 99,15' fill='#334155'/><text x='105' y='16' font-size='11' font-weight='bold' fill='#334155'>y</text><text x='84' y='180' font-size='10' fill='#64748b'>O</text><line x1='60' y1='0' x2='180' y2='240' stroke='#2563eb' stroke-width='2.5'/><circle cx='96' cy='72' r='4' fill='#dc2626'/><circle cx='144' cy='168' r='4' fill='#dc2626'/><text x='140' y='85' font-size='11' font-weight='bold' fill='#2563eb'>y = mx + c</text></svg>`.trim().replace(/\n\s*/g, '');

// 4. Vector SVG for Q31 (Right Triangle with 30 deg Angle)
const svgQ31TrigVar = `<svg viewBox='0 0 300 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><polygon points='50,140 240,140 240,40' fill='#eff6ff' stroke='#1e40af' stroke-width='2.5'/><rect x='224' y='124' width='16' height='16' fill='none' stroke='#475569' stroke-width='1.5'/><path d='M 85 140 A 35 35 0 0 0 81 123' fill='none' stroke='#dc2626' stroke-width='2'/><text x='92' y='132' font-size='12' font-weight='bold' fill='#dc2626'>30°</text><text x='35' y='145' font-size='12' font-weight='bold' fill='#0f172a'>P</text><text x='250' y='145' font-size='12' font-weight='bold' fill='#0f172a'>R</text><text x='245' y='35' font-size='12' font-weight='bold' fill='#0f172a'>Q</text><text x='255' y='95' font-size='12' font-weight='bold' fill='#15803d'>4 cm</text><text x='145' y='165' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>`.trim().replace(/\n\s*/g, '');

const paper1Questions = [
  {
    "number": 1,
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
    "number": 2,
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
    "number": 3,
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
    "number": 4,
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
    "number": 5,
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
    "number": 6,
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
    "number": 7,
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
    "number": 8,
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
    "number": 9,
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
    "number": 10,
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
    "number": 11,
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
    "number": 12,
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
    "number": 13,
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
    "number": 14,
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
    "number": 15,
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
    "number": 16,
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
    "number": 17,
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
    "number": 18,
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
    "number": 19,
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
    "number": 20,
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
    "number": 21,
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
    "number": 22,
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
    "number": 23,
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
    "number": 24,
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
    "number": 25,
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
    "number": 26,
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
    "number": 27,
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
    "number": 28,
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
    "number": 29,
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
    "number": 30,
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
    "number": 31,
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
    "number": 32,
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
    "number": 33,
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
    "number": 34,
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
    "number": 35,
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
    "number": 36,
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
    "number": 37,
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
    "number": 38,
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
    "number": 39,
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
    "number": 40,
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

async function fixAndSeedBece2024Paper1Variant() {
  console.log('Overwriting 2024 Paper 1 Variant with exact 40-item BECE blueprint...');

  for (const q of paper1Questions) {
    q.options = shuffleArray(q.options);
  }

  const paperDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2024_variant');

  await paperDocRef.set({
    year: 2024,
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

  console.log('✅ Correctly seeded all 40 calibrated questions into past_papers/paper_2024_variant.');
}

fixAndSeedBece2024Paper1Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to overwrite Paper 1 variant:', err);
    process.exit(1);
  });
