import * as _admin from 'firebase-admin';
import * as fs from 'fs';

const admin: any = (_admin as any).default || _admin;
const apps = admin.apps || (_admin as any).apps || [];

if (!apps.length) {
  const serviceAccountPath = 'C:\\Users\\LENOVO\\Downloads\\gamedu-69888475-f5783-firebase-adminsdk-fbsvc-f2566f9210.json';
  if (fs.existsSync(serviceAccountPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
    });
  } else {
    admin.initializeApp({
      projectId: 'gamedu-69888475-f5783',
      credential: admin.credential.applicationDefault(),
    });
  }
}

const db = admin.firestore();

// 1. Vector SVG for Q1(c) Variant: 3x3 Magic Square (Sum = 24)
const svgQ1cMagicSquareVar = `
<svg viewBox='0 0 240 240' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <defs>
    <style>
      .cell-text { font-size: 16px; font-weight: bold; fill: #1e293b; text-anchor: middle; dominant-baseline: middle; }
      .given-text { font-size: 16px; font-weight: bold; fill: #2563eb; text-anchor: middle; dominant-baseline: middle; }
    </style>
  </defs>
  <!-- Grid Lines -->
  <rect x='30' y='30' width='180' height='180' fill='#ffffff' stroke='#1e293b' stroke-width='2.5'/>
  <line x1='90' y1='30' x2='90' y2='210' stroke='#1e293b' stroke-width='2'/>
  <line x1='150' y1='30' x2='150' y2='210' stroke='#1e293b' stroke-width='2'/>
  <line x1='30' y1='90' x2='210' y2='90' stroke='#1e293b' stroke-width='2'/>
  <line x1='30' y1='150' x2='210' y2='150' stroke='#1e293b' stroke-width='2'/>
  <!-- Given Numbers (Magic sum = 24, Center = 8) -->
  <text x='60' y='60' class='given-text'>11</text>
  <text x='120' y='60' class='cell-text'></text>
  <text x='180' y='60' class='given-text'>9</text>
  <text x='60' y='120' class='cell-text'></text>
  <text x='120' y='120' class='given-text'>8</text>
  <text x='180' y='120' class='cell-text'></text>
  <text x='60' y='180' class='cell-text'></text>
  <text x='120' y='180' class='cell-text'></text>
  <text x='180' y='180' class='cell-text'></text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q4 Variant: Compass Geometric Construction of Right Triangle with Perpendicular
const svgQ4ConstructionVar = `
<svg viewBox='0 0 340 240' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Right Triangle PQR: P(60, 50), Q(60, 190), R(260, 190) -->
  <polygon points='60,50 60,190 260,190' fill='#eff6ff' stroke='#1e40af' stroke-width='2.5'/>
  <rect x='60' y='174' width='16' height='16' fill='none' stroke='#475569' stroke-width='1.5'/>
  <!-- Perpendicular QM from Q(60,190) to PR -->
  <!-- Vector PR: (200, 140). Parametric proj of Q onto line PR gives M(128.9, 98.3) -->
  <line x1='60' y1='190' x2='129' y2='98' stroke='#dc2626' stroke-width='2' stroke-dasharray='4,3'/>
  <!-- Right angle marker at M -->
  <circle cx='129' cy='98' r='3.5' fill='#dc2626'/>
  <!-- Labels -->
  <text x='50' y='45' font-size='13' font-weight='bold' fill='#0f172a'>P</text>
  <text x='45' y='202' font-size='13' font-weight='bold' fill='#0f172a'>Q</text>
  <text x='270' y='200' font-size='13' font-weight='bold' fill='#0f172a'>R</text>
  <text x='132' y='90' font-size='12' font-weight='bold' fill='#dc2626'>M</text>
  <!-- Side lengths -->
  <text x='28' y='125' font-size='11' font-weight='bold' fill='#1e3a8a'>6 cm</text>
  <text x='160' y='210' font-size='11' font-weight='bold' fill='#1e3a8a' text-anchor='middle'>8 cm</text>
  <text x='180' y='110' font-size='11' font-weight='bold' fill='#1e3a8a'>10 cm</text>
  <text x='170' y='232' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 3. Vector SVG for Q5(a) Variant: Triangle Similar Enlargement
const svgQ5aEnlargementVar = `
<svg viewBox='0 0 360 210' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Triangle PQR: P(180, 25), Q(40, 175), R(320, 175) -->
  <polygon points='180,25 40,175 320,175' fill='none' stroke='#1e293b' stroke-width='2.5'/>
  <!-- Parallel line ST: S(96, 115), T(264, 115) -->
  <line x1='96' y1='115' x2='264' y2='115' stroke='#2563eb' stroke-width='2.5'/>
  <!-- Vertices -->
  <text x='180' y='18' font-size='12' font-weight='bold' fill='#0f172a' text-anchor='middle'>P</text>
  <text x='25' y='185' font-size='12' font-weight='bold' fill='#0f172a'>Q</text>
  <text x='330' y='185' font-size='12' font-weight='bold' fill='#0f172a'>R</text>
  <text x='82' y='115' font-size='12' font-weight='bold' fill='#2563eb'>S</text>
  <text x='272' y='115' font-size='12' font-weight='bold' fill='#2563eb'>T</text>
  <!-- Length Dimensions -->
  <text x='125' y='65' font-size='11' font-weight='bold' fill='#1e3a8a'>6 cm</text>
  <text x='55' y='145' font-size='11' font-weight='bold' fill='#1e3a8a'>3 cm</text>
  <text x='180' y='195' font-size='11' font-weight='bold' fill='#16a34a' text-anchor='middle'>15 cm</text>
  <text x='180' y='108' font-size='11' font-weight='bold' fill='#2563eb' text-anchor='middle'>ST</text>
  <text x='180' y='205' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 4. Vector SVG for Q6 Variant: Temperature Conversion Graph (F = 1.8C + 32)
const svgQ6TempGraphVar = `
<svg viewBox='0 0 340 280' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/>
  <defs>
    <pattern id='gridFtoC' width='20' height='20' patternUnits='userSpaceOnUse'>
      <path d='M 20 0 L 0 0 0 20' fill='none' stroke='#e2e8f0' stroke-width='0.9'/>
    </pattern>
  </defs>
  <rect width='100%' height='100%' fill='url(#gridFtoC)'/>
  <!-- Axes: Origin (50, 240) -->
  <line x1='50' y1='240' x2='320' y2='240' stroke='#334155' stroke-width='2'/>
  <polygon points='320,237 328,240 320,243' fill='#334155'/>
  <text x='325' y='255' font-size='11' font-weight='bold' fill='#334155'>°C</text>
  <line x1='50' y1='240' x2='50' y2='20' stroke='#334155' stroke-width='2'/>
  <polygon points='47,20 50,12 53,20' fill='#334155'/>
  <text x='25' y='22' font-size='11' font-weight='bold' fill='#334155'>°F</text>
  <!-- Linear line F = (9/5)C + 32. 
       Scale: 1 unit C = 8px, 1 unit F = 2.2px
       C=0 -> (50, 240 - 32*2.2) = (50, 169.6)
       C=10 -> (130, 240 - 50*2.2) = (130, 130)
       C=20 -> (210, 240 - 68*2.2) = (210, 90.4)
       C=30 -> (290, 240 - 86*2.2) = (290, 50.8)
  -->
  <line x1='50' y1='170' x2='290' y2='51' stroke='#2563eb' stroke-width='2.5'/>
  <circle cx='50' cy='170' r='3.5' fill='#dc2626'/>
  <circle cx='130' cy='130' r='3.5' fill='#dc2626'/>
  <circle cx='210' cy='90' r='3.5' fill='#dc2626'/>
  <circle cx='290' cy='51' r='3.5' fill='#dc2626'/>
  <!-- Interpolation lines for F = 59°F -> C = 15°C: (170, 110) -->
  <line x1='50' y1='110' x2='170' y2='110' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/>
  <line x1='170' y1='110' x2='170' y2='240' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/>
  <text x='20' y='114' font-size='9' font-weight='bold' fill='#d97706'>59°F</text>
  <text x='170' y='255' font-size='9' font-weight='bold' fill='#d97706' text-anchor='middle'>15°C</text>
</svg>
`.trim().replace(/\n\s*/g, '');

const paper2Questions = [
  {
    questionNumber: "1",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "A fair standard six-sided die and a fair coin are tossed together once.\n(i) Write down the sample space $S$ of all possible outcomes.\n(ii) Find the probability of obtaining an odd number on the die and a head on the coin.",
        workedSolution: "(i) Let the die faces be $\\{1, 2, 3, 4, 5, 6\\}$ and coin outcomes be $\\{H, T\\}$.\n$$S = \\{(1,H), (1,T), (2,H), (2,T), (3,H), (3,T), (4,H), (4,T), (5,H), (5,T), (6,H), (6,T)\\}$$\nTotal outcomes $n(S) = 6 \\times 2 = 12$.\n\n(ii) Favorable outcomes with an odd number and a head:\n$$E = \\{(1,H), (3,H), (5,H)\\} \\implies n(E) = 3$$\n$$P(\\text{odd number and head}) = \\frac{n(E)}{n(S)} = \\frac{3}{12} = \\frac{1}{4}$$.",
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: "The architectural plan of a playground is drawn to a linear scale of $1 : 200$. If the width and area of the playground on the map are $6\\text{ cm}$ and $72\\text{ cm}^2$ respectively, calculate the actual area of the playground in square metres ($\\text{m}^2$).",
        workedSolution: "Linear scale $= 1 : 200$, which means $1\\text{ cm} = 200\\text{ cm} = 2\\text{ m}$.\nArea scale factor $k^2 = (200)^2 = 40,000$.\n$$\\text{Actual area in cm}^2 = 72 \\times 40,000 = 2,880,000\\text{ cm}^2$$\nConvert to square metres ($1\\text{ m}^2 = 10,000\\text{ cm}^2$):\n$$\\text{Actual Area} = \\frac{2,880,000}{10,000} = 288\\text{ m}^2$.\n*(Alternative method: $1\\text{ cm}^2$ on map $= (2\\text{ m})^2 = 4\\text{ m}^2$ on ground; thus $72 \\times 4 = 288\\text{ m}^2$)*.",
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `Copy and complete the $3 \\times 3$ magic square below such that the sum of the numbers along each row, column, and diagonal is equal to $24$:<br/>${svgQ1cMagicSquareVar}`,
        workedSolution: "Target magic sum $= 24$. In a standard $3 \\times 3$ magic square, the central cell is $\\frac{24}{3} = 8$.\nRow 1: $11 + x_1 + 9 = 24 \\implies x_1 = 24 - 20 = 4$.\nMajor diagonal: $11 + 8 + x_9 = 24 \\implies x_9 = 24 - 19 = 5$.\nColumn 3: $9 + x_6 + 5 = 24 \\implies x_6 = 24 - 14 = 10$.\nMinor diagonal: $9 + 8 + x_7 = 24 \\implies x_7 = 24 - 17 = 7$.\nColumn 1: $11 + x_4 + 7 = 24 \\implies x_4 = 24 - 18 = 6$.\nColumn 2: $4 + 8 + x_8 = 24 \\implies x_8 = 24 - 12 = 12$.\n\nCompleted Magic Square:\n| 11 | 4 | 9 |\n| :---: | :---: | :---: |\n| 6 | 8 | 10 |\n| 7 | 12 | 5 |",
        maxMarks: 5
      }
    ]
  },
  {
    questionNumber: "2",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Given the column vectors $\\mathbf{p} = \\begin{pmatrix} 2m + 5 \\\\ 3 - 2n \\end{pmatrix}$ and $\\mathbf{q} = \\begin{pmatrix} 4m - 1 \\\\ n - 9 \\end{pmatrix}$. If $\\mathbf{p} = \\mathbf{q}$, determine the values of $m$ and $n$.",
        workedSolution: "Equate corresponding vector components:\nTop components:\n$$2m + 5 = 4m - 1$$\n$$5 + 1 = 4m - 2m \\implies 2m = 6 \\implies m = 3$$\nBottom components:\n$$3 - 2n = n - 9$$\n$$3 + 9 = n + 2n \\implies 3n = 12 \\implies n = 4$$\nThus, $m = 3$ and $n = 4$.",
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "A mother shared an amount of money between her two daughters, Araba and Esi, in the ratio $5 : 4$. Araba received GH¢ 1,500.00.\n(i) Find the total amount shared.\n(ii) Esi deposited her entire share into a fixed savings account earning 15% simple interest per annum for 3 years. Calculate the total accrued amount in Esi's account at the end of the 3 years.",
        workedSolution: "(i) Araba's portion corresponds to 5 parts:\n$$5\\text{ parts} = \\text{GH¢ } 1,500.00 \\implies 1\\text{ part} = \\frac{1,500.00}{5} = \\text{GH¢ } 300.00$$\nTotal ratio parts $= 5 + 4 = 9\\text{ parts}$.\n$$\\text{Total amount shared} = 9 \\times 300.00 = \\text{GH¢ } 2,700.00$$\n\n(ii) Esi's principal share:\n$$\\text{Principal } (P) = 4 \\times 300.00 = \\text{GH¢ } 1,200.00$$\n$$\\text{Simple Interest } (I) = \\frac{P \\times R \\times T}{100} = \\frac{1,200 \\times 15 \\times 3}{100} = 12 \\times 45 = \\text{GH¢ } 540.00$$\n$$\\text{Total accrued amount} = P + I = 1,200.00 + 540.00 = \\text{GH¢ } 1,740.00$$.",
        maxMarks: 9
      }
    ]
  },
  {
    questionNumber: "3",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Simplify the surd expression completely: $$4\\sqrt{32} + 3\\sqrt{20} - 2\\sqrt{2} + \\sqrt{5}$$.",
        workedSolution: "Decompose each radical into perfect square factors:\n$$\\sqrt{32} = \\sqrt{16 \\times 2} = 4\\sqrt{2} \\implies 4\\sqrt{32} = 4(4\\sqrt{2}) = 16\\sqrt{2}$$\n$$\\sqrt{20} = \\sqrt{4 \\times 5} = 2\\sqrt{5} \\implies 3\\sqrt{20} = 3(2\\sqrt{5}) = 6\\sqrt{5}$$\nSubstitute and collect like radicals:\n$$= (16\\sqrt{2} - 2\\sqrt{2}) + (6\\sqrt{5} + \\sqrt{5})$$\n$$= 14\\sqrt{2} + 7\\sqrt{5}$$.",
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: "A wire of length $46\\text{ cm}$ is bent into the shape of a rectangle whose length is $5\\text{ cm}$ longer than its width. Calculate the area of the rectangle.",
        workedSolution: "Let width be $w\\text{ cm}$. Length $l = (w + 5)\\text{ cm}$.\nPerimeter formula: $2(l + w) = 46$\n$$2(w + 5 + w) = 46$$\n$$2(2w + 5) = 46 \\implies 4w + 10 = 46$$\n$$4w = 36 \\implies w = 9\\text{ cm}$$\n$$l = 9 + 5 = 14\\text{ cm}$$\n$$\\text{Area} = l \\times w = 14 \\times 9 = 126\\text{ cm}^2$$.",
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "If 12% of the length of a telecommunications transmission cable is $540\\text{ metres}$, find half of the total length of the cable.",
        workedSolution: "Let total length of cable be $L$.\n$$\\frac{12}{100} \\times L = 540 \\implies L = \\frac{540 \\times 100}{12}$$\n$$L = 45 \\times 100 = 4,500\\text{ metres}$$\n$$\\text{Half of the length} = \\frac{4,500}{2} = 2,250\\text{ metres}$$.",
        maxMarks: 5
      }
    ]
  },
  {
    questionNumber: "4",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Using a ruler and a pair of compasses only:\n(i) Construct $\\triangle PQR$ such that $\\vert{}QR\\vert{} = 8\\text{ cm}$, $\\angle PQR = 90^\\circ$, and $\\vert{}PQ\\vert{} = 6\\text{ cm}$.\n(ii) Construct a perpendicular line from $Q$ to hypotenuse $PR$, meeting $PR$ at point $M$.",
        workedSolution: "(i) Steps of construction:\n- Draw line segment $QR = 8\\text{ cm}$ using a ruler.\n- Construct a $90^\\circ$ perpendicular angle at vertex $Q$ using compass arcs.\n- Measure and mark off $PQ = 6\\text{ cm}$ on the perpendicular arm.\n- Join vertex $P$ to vertex $R$ to complete right-angled $\\triangle PQR$.\n\n(ii) Steps for dropping perpendicular from $Q$ to $PR$:\n- With needle at $Q$, strike an arc intersecting line $PR$ at two distinct points.\n- From these two intersection points, construct intersecting arcs on the opposite side.\n- Draw a straight line through $Q$ and the intersection of the arcs, meeting $PR$ perpendicularly at point $M$.",
        maxMarks: 8
      },
      {
        subId: "(b)",
        prompt: `From your accurate construction:<br/>${svgQ4ConstructionVar}<br/>(i) Measure the length of line segment $|MR|$.<br/>(ii) Measure the length of altitude $|QM|$.<br/>(iii) Calculate, correct to the nearest whole number, the area of $\\triangle QMR$.`,
        workedSolution: "By geometric theory for right triangle with legs 6 cm and 8 cm:\nHypotenuse $\\vert{}PR\\vert{} = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$.\nArea of $\\triangle PQR = \\frac{1}{2} \\times 8 \\times 6 = 24\\text{ cm}^2$.\nSince Area $= \\frac{1}{2} \\times \\vert{}PR\\vert{} \\times \\vert{}QM\\vert{}$:\n$$24 = \\frac{1}{2} \\times 10 \\times \\vert{}QM\\vert{} \\implies \\vert{}QM\\vert{} = 4.8\\text{ cm}$$\nIn right $\\triangle QMR$:\n$$\\vert{}MR\\vert{} = \\sqrt{QR^2 - QM^2} = \\sqrt{8^2 - 4.8^2} = \\sqrt{64 - 23.04} = \\sqrt{40.96} = 6.4\\text{ cm}$$\n\n(i) $\\vert{}MR\\vert{} = 6.4\\text{ cm}$ (accept $\\pm 0.1\\text{ cm}$).\n(ii) $\\vert{}QM\\vert{} = 4.8\\text{ cm}$ (accept $\\pm 0.1\\text{ cm}$).\n(iii) $$\\text{Area of } \\triangle QMR = \\frac{1}{2} \\times \\vert{}MR\\vert{} \\times \\vert{}QM\\vert{} = \\frac{1}{2} \\times 6.4 \\times 4.8 = 15.36\\text{ cm}^2$$\nRounding to the nearest whole number gives **15 cm²**.",
        maxMarks: 7
      }
    ]
  },
  {
    questionNumber: "5",
    subQuestions: [
      {
        subId: "(a)",
        prompt: `In the diagram below, $\\triangle PQR$ is a geometric enlargement of $\\triangle PST$. $|PS| = 6\\text{ cm}$, $|QS| = 3\\text{ cm}$, and $|QR| = 15\\text{ cm}$:<br/>${svgQ5aEnlargementVar}<br/>(i) Calculate the length of segment $\\overline{ST}$.<br/>(ii) If $|PQ| = |PR|$, find the area of $\\triangle PQR$.`,
        workedSolution: "(i) Total length $\\vert{}PQ\\vert{} = \\vert{}PS\\vert{} + \\vert{}QS\\vert{} = 6 + 3 = 9\\text{ cm}$.\nLinear scale factor $k$ of enlargement:\n$$k = \\frac{\\vert{}PQ\\vert{}}{\\vert{}PS\\vert{}} = \\frac{9}{6} = 1.5$$\nSince $\\triangle PQR$ is an enlargement of $\\triangle PST$, line $ST$ is parallel to $QR$:\n$$\\frac{\\vert{}QR\\vert{}}{\\vert{}ST\\vert{}} = 1.5 \\implies \\vert{}ST\\vert{} = \\frac{\\vert{}QR\\vert{}}{1.5} = \\frac{15}{1.5} = 10\\text{ cm}$$.\n\n(ii) If $\\vert{}PQ\\vert{} = \\vert{}PR\\vert{} = 9\\text{ cm}$, $\\triangle PQR$ is an isosceles triangle with base $\\vert{}QR\\vert{} = 15\\text{ cm}$.\nDraw vertical perpendicular altitude $h$ from $P$ to base $QR$, bisecting base into $7.5\\text{ cm}$ segments:\n$$h = \\sqrt{\\vert{}PQ\\vert{}^2 - 7.5^2} = \\sqrt{9^2 - 7.5^2} = \\sqrt{81 - 56.25} = \\sqrt{24.75} \\approx 4.975\\text{ cm}$$\n$$\\text{Area of } \\triangle PQR = \\frac{1}{2} \\times \\text{base} \\times h = \\frac{1}{2} \\times 15 \\times 4.975 \\approx 37.31\\text{ cm}^2$$.",
        maxMarks: 8
      },
      {
        subId: "(b)",
        prompt: "The total area of a school estate is $1,200\\frac{1}{2}\\text{ m}^2$. The estate contains an Administration Block, Science Laboratories, Sports Arena, and Access Walkways. The areas occupied by the Administration Block, Science Laboratories, and Sports Arena are $400\\frac{1}{4}\\text{ m}^2$, $350\\frac{1}{2}\\text{ m}^2$, and $210\\frac{1}{8}\\text{ m}^2$ respectively. Calculate the remaining area covered by the Access Walkways.",
        workedSolution: "Sum the occupied areas:\n$$400\\frac{1}{4} + 350\\frac{1}{2} + 210\\frac{1}{8}$$\n$$= (400 + 350 + 210) + \\left(\\frac{1}{4} + \\frac{1}{2} + \\frac{1}{8}\\right)$$\n$$= 960 + \\left(\\frac{2 + 4 + 1}{8}\\right) = 960\\frac{7}{8}\\text{ m}^2$$\nSubtract from total estate area:\n$$1,200\\frac{1}{2} - 960\\frac{7}{8}$$\nConvert fractions to eighths ($\\frac{1}{2} = \\frac{4}{8}$):\n$$= 1,200\\frac{4}{8} - 960\\frac{7}{8}$$\n$$= 1,199\\frac{12}{8} - 960\\frac{7}{8} = 239\\frac{5}{8}\\text{ m}^2$$\nIn decimal form: $239.625\\text{ m}^2$.",
        maxMarks: 7
      }
    ]
  },
  {
    questionNumber: "6",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Copy and complete the table of values for the temperature relation: $$F = \\frac{9}{5}C + 32$$\n\n| °C | 0 | 5 | 10 | 15 | 20 | 25 | 30 |\n| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| °F | 32 | **?** | **?** | **?** | 68 | **?** | **?** |",
        workedSolution: "Evaluate $F = \\frac{9}{5}C + 32$ for each Celsius value:\n- $C = 5: F = \\frac{9}{5}(5) + 32 = 9 + 32 = 41$\n- $C = 10: F = \\frac{9}{5}(10) + 32 = 18 + 32 = 50$\n- $C = 15: F = \\frac{9}{5}(15) + 32 = 27 + 32 = 59$\n- $C = 20: F = \\frac{9}{5}(20) + 32 = 36 + 32 = 68$ (given)\n- $C = 25: F = \\frac{9}{5}(25) + 32 = 45 + 32 = 77$\n- $C = 30: F = \\frac{9}{5}(30) + 32 = 54 + 32 = 86$\n\nCompleted table:\n| °C | 0 | 5 | 10 | 15 | 20 | 25 | 30 |\n| °F | 32 | 41 | 50 | 59 | 68 | 77 | 86 |",
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "Using a scale of 2 cm to 10 units on the vertical axis (°F) and 2 cm to 5 units on the horizontal axis (°C), plot the points and draw the straight line graph representing the relation for $0 \\le C \\le 30$.",
        workedSolution: "Axes drawn with clear calibration, origin at $(0, 0)$, all points $(0, 32), (5, 41), (10, 50), (15, 59), (20, 68), (25, 77), (30, 86)$ plotted and connected by a continuous ruler-drawn straight line.",
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `Using your drawn graph:<br/>${svgQ6TempGraphVar}<br/>Find the temperature in degrees Celsius (°C) when the Fahrenheit temperature is $F = 59^\\circ\\text{F}$.`,
        workedSolution: "Locate $59^\\circ\\text{F}$ on the vertical axis, read horizontally across to the straight line, and read vertically downwards to the horizontal axis:\n$$C = 15^\\circ\\text{C}$$\n*(Algebraic check: $59 - 32 = 27 \\implies C = 27 \\times \\frac{5}{9} = 15^\\circ\\text{C}$)*.",
        maxMarks: 3
      },
      {
        subId: "(d)",
        prompt: "State the mathematical interpretation of the slope ($m = \\frac{9}{5}$) of this temperature conversion relation.",
        workedSolution: "The slope $m = \\frac{9}{5} = 1.8$ represents the rate of change of temperature: for every $1^\\circ\\text{C}$ increase in temperature, the temperature in Fahrenheit increases by $1.8^\\circ\\text{F}$ (or for every $5^\\circ\\text{C}$ rise, Fahrenheit increases by $9^\\circ\\text{F}$).",
        maxMarks: 3
      }
    ]
  }
];

async function seedBece2024Paper2Variant() {
  console.log('Seeding 2024 BECE Paper 2 Variant (Question Set 58) into Firestore...');

  const paperDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2024_variant');

  const payload = {
    paper2: {
      title: "Paper 2: Essay / Theory Test (Variant)",
      durationMinutes: 60,
      instructions: "Answer four questions only. All working must be clearly shown. Marks will not be awarded for correct answers without corresponding working.",
      totalQuestions: 6,
      questions: paper2Questions
    },
    'metadata.paper2Ingested': true,
    'metadata.updatedAt': admin.firestore.FieldValue.serverTimestamp()
  };

  await paperDocRef.set(payload, { merge: true });
  console.log('✅ Successfully seeded 2024 Paper 2 Variant into past_papers/paper_2024_variant.');
}

seedBece2024Paper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to seed 2024 Paper 2 variant:', err);
    process.exit(1);
  });
