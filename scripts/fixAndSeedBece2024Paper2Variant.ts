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

// 1. Vector SVG for Q1(c) Magic Square (Sum = 21, Center = 7)
const svgQ1cMagicSquareVar = `<svg viewBox='0 0 240 240' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><style>.cell-text { font-size: 16px; font-weight: bold; fill: #1e293b; text-anchor: middle; dominant-baseline: middle; }.given-text { font-size: 16px; font-weight: bold; fill: #2563eb; text-anchor: middle; dominant-baseline: middle; }</style></defs><rect x='30' y='30' width='180' height='180' fill='#ffffff' stroke='#1e293b' stroke-width='2.5'/><line x1='90' y1='30' x2='90' y2='210' stroke='#1e293b' stroke-width='2'/><line x1='150' y1='30' x2='150' y2='210' stroke='#1e293b' stroke-width='2'/><line x1='30' y1='90' x2='210' y2='90' stroke='#1e293b' stroke-width='2'/><line x1='30' y1='150' x2='210' y2='150' stroke='#1e293b' stroke-width='2'/><text x='60' y='60' class='cell-text'></text><text x='120' y='60' class='given-text'>10</text><text x='180' y='60' class='cell-text'></text><text x='60' y='120' class='cell-text'></text><text x='120' y='120' class='given-text'>7</text><text x='180' y='120' class='cell-text'></text><text x='60' y='180' class='given-text'>6</text><text x='120' y='180' class='cell-text'></text><text x='180' y='180' class='given-text'>8</text></svg>`.trim().replace(/\n\s*/g, '');

// 2. Vector SVG for Q4 Geometric Construction of Triangle ABC
const svgQ4ConstructionVar = `<svg viewBox='0 0 340 240' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><polygon points='60,50 60,190 260,190' fill='#eff6ff' stroke='#1e40af' stroke-width='2.5'/><rect x='60' y='174' width='16' height='16' fill='none' stroke='#475569' stroke-width='1.5'/><line x1='60' y1='190' x2='137' y2='104' stroke='#dc2626' stroke-width='2' stroke-dasharray='4,3'/><circle cx='137' cy='104' r='3.5' fill='#dc2626'/><text x='50' y='45' font-size='13' font-weight='bold' fill='#0f172a'>A</text><text x='45' y='205' font-size='13' font-weight='bold' fill='#0f172a'>B</text><text x='270' y='200' font-size='13' font-weight='bold' fill='#0f172a'>C</text><text x='140' y='96' font-size='12' font-weight='bold' fill='#dc2626'>N</text><text x='28' y='125' font-size='11' font-weight='bold' fill='#1e3a8a'>6 cm</text><text x='160' y='210' font-size='11' font-weight='bold' fill='#1e3a8a' text-anchor='middle'>8 cm</text><text x='180' y='110' font-size='11' font-weight='bold' fill='#1e3a8a'>10 cm</text><text x='170' y='232' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>`.trim().replace(/\n\s*/g, '');

// 3. Vector SVG for Q5(a) Triangle Enlargement
const svgQ5aEnlargementVar = `<svg viewBox='0 0 360 210' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><polygon points='180,25 40,175 320,175' fill='none' stroke='#1e293b' stroke-width='2.5'/><line x1='87' y1='125' x2='273' y2='125' stroke='#2563eb' stroke-width='2.5'/><text x='180' y='18' font-size='12' font-weight='bold' fill='#0f172a' text-anchor='middle'>P</text><text x='25' y='185' font-size='12' font-weight='bold' fill='#0f172a'>Q</text><text x='330' y='185' font-size='12' font-weight='bold' fill='#0f172a'>R</text><text x='74' y='125' font-size='12' font-weight='bold' fill='#2563eb'>S</text><text x='280' y='125' font-size='12' font-weight='bold' fill='#2563eb'>T</text><text x='122' y='70' font-size='11' font-weight='bold' fill='#1e3a8a'>4 cm</text><text x='52' y='155' font-size='11' font-weight='bold' fill='#1e3a8a'>2 cm</text><text x='180' y='195' font-size='11' font-weight='bold' fill='#16a34a' text-anchor='middle'>9 cm</text><text x='180' y='118' font-size='11' font-weight='bold' fill='#2563eb' text-anchor='middle'>ST</text><text x='180' y='205' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>`.trim().replace(/\n\s*/g, '');

// 4. Vector SVG for Q6 Temperature Conversion Graph
const svgQ6TempGraphVar = `<svg viewBox='0 0 340 280' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><pattern id='tempGridClean' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='#e2e8f0' stroke-width='0.9'/></pattern></defs><rect width='100%' height='100%' fill='url(#tempGridClean)'/><line x1='50' y1='240' x2='320' y2='240' stroke='#334155' stroke-width='2'/><polygon points='320,237 328,240 320,243' fill='#334155'/><text x='325' y='255' font-size='11' font-weight='bold' fill='#334155'>°C</text><line x1='50' y1='240' x2='50' y2='20' stroke='#334155' stroke-width='2'/><polygon points='47,20 50,12 53,20' fill='#334155'/><text x='25' y='22' font-size='11' font-weight='bold' fill='#334155'>°F</text><line x1='50' y1='170' x2='290' y2='51' stroke='#2563eb' stroke-width='2.5'/><circle cx='50' cy='170' r='3.5' fill='#dc2626'/><circle cx='130' cy='130' r='3.5' fill='#dc2626'/><circle cx='210' cy='90' r='3.5' fill='#dc2626'/><circle cx='290' cy='51' r='3.5' fill='#dc2626'/><line x1='50' y1='130' x2='130' y2='130' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/><line x1='130' y1='130' x2='130' y2='240' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/><text x='20' y='134' font-size='9' font-weight='bold' fill='#d97706'>50°F</text><text x='130' y='255' font-size='9' font-weight='bold' fill='#d97706' text-anchor='middle'>10°C</text></svg>`.trim().replace(/\n\s*/g, '');

const paper2Questions = [
  {
    "questionNumber": "1",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "A fair die and a fair coin are thrown together once.\n(i) Write down the set of all possible outcomes.\n(ii) Find the probability of obtaining an even number and a head.",
        "workedSolution": "(i) Die faces: $\\{1, 2, 3, 4, 5, 6\\}$, Coin faces: $\\{H, T\\}$.\nSample space $S = \\{(1,H), (1,T), (2,H), (2,T), (3,H), (3,T), (4,H), (4,T), (5,H), (5,T), (6,H), (6,T)\\}$.\nTotal outcomes $n(S) = 12$.\n\n(ii) Favorable outcomes $E = \\{(2,H), (4,H), (6,H)\\} \\implies n(E) = 3$.\n$$P(\\text{even number and head}) = \\frac{n(E)}{n(S)} = \\frac{3}{12} = \\frac{1}{4}$$.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "The map of a school football pitch is drawn to a scale of $1 : 100$. If the width and area of the pitch on the map are $6\\text{ cm}$ and $72\\text{ cm}^2$ respectively, find in $\\text{m}^2$, the area of the actual football pitch.",
        "workedSolution": "On the map:\n$$\\text{Length} = \\frac{\\text{Area}}{\\text{Width}} = \\frac{72}{6} = 12\\text{ cm}$$\nUsing scale $1 : 100$ ($1\\text{ cm} = 100\\text{ cm} = 1\\text{ m}$ on ground):\n$$\\text{Actual width} = 6 \\times 1\\text{ m} = 6\\text{ m}$$\n$$\\text{Actual length} = 12 \\times 1\\text{ m} = 12\\text{ m}$$\n$$\\text{Actual Area} = 6\\text{ m} \\times 12\\text{ m} = 72\\text{ m}^2$$.\n*(Or by area scale factor: $k^2 = (100)^2 = 10,000$. Actual area $= 72 \\times 10,000\\text{ cm}^2 = 720,000\\text{ cm}^2 = 72\\text{ m}^2$)*.",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "Copy and complete the $3 \\times 3$ magic square below such that the sum of the numbers in each row, column, and diagonal is equal to $21$:<br/><svg viewBox='0 0 240 240' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><style>.cell-text { font-size: 16px; font-weight: bold; fill: #1e293b; text-anchor: middle; dominant-baseline: middle; }.given-text { font-size: 16px; font-weight: bold; fill: #2563eb; text-anchor: middle; dominant-baseline: middle; }</style></defs><rect x='30' y='30' width='180' height='180' fill='#ffffff' stroke='#1e293b' stroke-width='2.5'/><line x1='90' y1='30' x2='90' y2='210' stroke='#1e293b' stroke-width='2'/><line x1='150' y1='30' x2='150' y2='210' stroke='#1e293b' stroke-width='2'/><line x1='30' y1='90' x2='210' y2='90' stroke='#1e293b' stroke-width='2'/><line x1='30' y1='150' x2='210' y2='150' stroke='#1e293b' stroke-width='2'/><text x='60' y='60' class='cell-text'></text><text x='120' y='60' class='given-text'>10</text><text x='180' y='60' class='cell-text'></text><text x='60' y='120' class='cell-text'></text><text x='120' y='120' class='given-text'>7</text><text x='180' y='120' class='cell-text'></text><text x='60' y='180' class='given-text'>6</text><text x='120' y='180' class='cell-text'></text><text x='180' y='180' class='given-text'>8</text></svg>",
        "workedSolution": "Magic Sum $= 21$. Central cell $= \\frac{21}{3} = 7$.\nMain diagonal (top-right to bottom-left): $x_3 + 7 + 6 = 21 \\implies x_3 = 21 - 13 = 8$.\nRow 1: $x_1 + 10 + 8 = 21 \\implies x_1 = 21 - 18 = 3$.\nColumn 1: $3 + x_4 + 6 = 21 \\implies x_4 = 21 - 9 = 12$.\nOther diagonal: $3 + 7 + x_9 = 21 \\implies x_9 = 21 - 10 = 11$.\nRow 3: $6 + x_8 + 11 = 21 \\implies x_8 = 21 - 17 = 4$.\nColumn 3: $8 + x_6 + 11 = 21 \\implies x_6 = 21 - 19 = 2$.\n\nCompleted 3x3 Magic Square:\n| 3 | 10 | 8 |\n| :---: | :---: | :---: |\n| 12 | 7 | 2 |\n| 6 | 4 | 11 |",
        "maxMarks": 5
      }
    ]
  },
  {
    "questionNumber": "2",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Given the column vectors $\\mathbf{p} = \\begin{pmatrix} a + 4 \\\\ 3 - b \\end{pmatrix}$ and $\\mathbf{q} = \\begin{pmatrix} 2a - 1 \\\\ b - 5 \\end{pmatrix}$. If $\\mathbf{p} = \\mathbf{q}$, find the values of $a$ and $b$.",
        "workedSolution": "Equate corresponding vector components:\n$$a + 4 = 2a - 1 \\implies 2a - a = 4 + 1 \\implies a = 5$$\n$$3 - b = b - 5 \\implies 2b = 3 + 5 = 8 \\implies b = 4$$.",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "A father shared an amount of money between his two children, Kojo and Fiifi, in the ratio $6 : 5$. Kojo received GH¢ 1,800.00.\n(i) Find the total amount shared.\n(ii) Fiifi invested his share in a savings account at the rate of 10% simple interest per annum for 2 years. Find the total amount in his account at the end of the 2 years.",
        "workedSolution": "(i) Kojo's portion corresponds to 6 parts:\n$$6\\text{ parts} = \\text{GH¢ } 1,800.00 \\implies 1\\text{ part} = \\frac{1,800.00}{6} = \\text{GH¢ } 300.00$$\nTotal parts $= 6 + 5 = 11\\text{ parts}$.\n$$\\text{Total amount shared} = 11 \\times 300.00 = \\text{GH¢ } 3,300.00$$\n\n(ii) Fiifi's principal share:\n$$\\text{Principal } (P) = 5 \\times 300.00 = \\text{GH¢ } 1,500.00$$\n$$\\text{Simple Interest } (I) = \\frac{P \\times R \\times T}{100} = \\frac{1,500 \\times 10 \\times 2}{100} = 15 \\times 20 = \\text{GH¢ } 300.00$$\n$$\\text{Total amount in account} = P + I = 1,500.00 + 300.00 = \\text{GH¢ } 1,800.00$$.",
        "maxMarks": 9
      }
    ]
  },
  {
    "questionNumber": "3",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Simplify: $$2\\sqrt{50} + 3\\sqrt{45} - 2\\sqrt{2} + 2\\sqrt{5}$$.",
        "workedSolution": "Decompose surds into square factors:\n$$\\sqrt{50} = \\sqrt{25 \\times 2} = 5\\sqrt{2} \\implies 2\\sqrt{50} = 2(5\\sqrt{2}) = 10\\sqrt{2}$$\n$$\\sqrt{45} = \\sqrt{9 \\times 5} = 3\\sqrt{5} \\implies 3\\sqrt{45} = 3(3\\sqrt{5}) = 9\\sqrt{5}$$\nSubstitute and collect like terms:\n$$= (10\\sqrt{2} - 2\\sqrt{2}) + (9\\sqrt{5} + 2\\sqrt{5})$$\n$$= 8\\sqrt{2} + 11\\sqrt{5}$$.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "A wire of length $42\\text{ cm}$ is bent into the shape of a rectangle whose length is $5\\text{ cm}$ more than the width. Find the area of the rectangle.",
        "workedSolution": "Let width be $w\\text{ cm}$. Length $l = (w + 5)\\text{ cm}$.\n$$\\text{Perimeter} = 2(l + w) = 42$$\n$$2(w + 5 + w) = 42 \\implies 2w + 5 = 21$$\n$$2w = 16 \\implies w = 8\\text{ cm}$$\n$$l = 8 + 5 = 13\\text{ cm}$$\n$$\\text{Area} = l \\times w = 13 \\times 8 = 104\\text{ cm}^2$$.",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "If 20% of the length of a pole is $60\\text{ metres}$, find half of the total length of the pole.",
        "workedSolution": "Let total length be $L$.\n$$\\frac{20}{100} \\times L = 60 \\implies \\frac{1}{5}L = 60 \\implies L = 60 \\times 5 = 300\\text{ metres}$$\n$$\\text{Half of the length} = \\frac{300}{2} = 150\\text{ metres}$$.",
        "maxMarks": 5
      }
    ]
  },
  {
    "questionNumber": "4",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Using a ruler and a pair of compasses only:\n(i) Construct $\\triangle ABC$ such that $\\angle ABC = 90^\\circ$, $|AB| = 6\\text{ cm}$, and $|BC| = 8\\text{ cm}$.\n(ii) Construct a perpendicular from $B$ to hypotenuse $AC$.\n(iii) Locate $N$, the intersection of the perpendicular and $AC$.",
        "workedSolution": "(i) Steps:\n- Draw line segment $BC = 8\\text{ cm}$ using a ruler.\n- Construct a perpendicular $90^\\circ$ angle at $B$ with compass arcs.\n- Measure and mark off $|AB| = 6\\text{ cm}$ on the vertical ray.\n- Join vertex $A$ to vertex $C$.\n\n(ii) & (iii) From vertex $B$, swing an arc intersecting segment $AC$ at two distinct points. From those points, strike intersecting arcs on the opposite side of $AC$. Draw a straight line from $B$ through the intersection, meeting $AC$ perpendicularly at point $N$.",
        "maxMarks": 8
      },
      {
        "subId": "(b)",
        "prompt": "From your construction in (a):<br/><svg viewBox='0 0 340 240' width='100%' height='200' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><polygon points='60,50 60,190 260,190' fill='#eff6ff' stroke='#1e40af' stroke-width='2.5'/><rect x='60' y='174' width='16' height='16' fill='none' stroke='#475569' stroke-width='1.5'/><line x1='60' y1='190' x2='137' y2='104' stroke='#dc2626' stroke-width='2' stroke-dasharray='4,3'/><circle cx='137' cy='104' r='3.5' fill='#dc2626'/><text x='50' y='45' font-size='13' font-weight='bold' fill='#0f172a'>A</text><text x='45' y='205' font-size='13' font-weight='bold' fill='#0f172a'>B</text><text x='270' y='200' font-size='13' font-weight='bold' fill='#0f172a'>C</text><text x='140' y='96' font-size='12' font-weight='bold' fill='#dc2626'>N</text><text x='28' y='125' font-size='11' font-weight='bold' fill='#1e3a8a'>6 cm</text><text x='160' y='210' font-size='11' font-weight='bold' fill='#1e3a8a' text-anchor='middle'>8 cm</text><text x='180' y='110' font-size='11' font-weight='bold' fill='#1e3a8a'>10 cm</text><text x='170' y='232' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg><br/>Measure:<br/>(i) $|NC|$;<br/>(ii) $|BN|$.<br/>(iii) Calculate, correct to the nearest whole number, the area of $\\triangle BNC$.",
        "workedSolution": "By geometric theory for legs 6 cm and 8 cm:\nHypotenuse $|AC| = \\sqrt{6^2 + 8^2} = 10\\text{ cm}$.\nAltitude $|BN| = \\frac{6 \\times 8}{10} = 4.8\\text{ cm}$.\nSegment $|NC| = \\frac{BC^2}{AC} = \\frac{8^2}{10} = 6.4\\text{ cm}$.\n\n(i) $|NC| = 6.4\\text{ cm}$ (accept $6.3\\text{ cm} - 6.5\\text{ cm}$).\n(ii) $|BN| = 4.8\\text{ cm}$ (accept $4.7\\text{ cm} - 4.9\\text{ cm}$).\n(iii) $$\\text{Area of } \\triangle BNC = \\frac{1}{2} \\times |NC| \\times |BN| = \\frac{1}{2} \\times 6.4 \\times 4.8 = 15.36\\text{ cm}^2$$\nTo the nearest whole number: **15 cm²**.",
        "maxMarks": 7
      }
    ]
  },
  {
    "questionNumber": "5",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "In the diagram below, $\\triangle PQR$ is an enlargement of $\\triangle PST$. Line $ST$ is parallel to $QR$, $|PS| = 4\\text{ cm}$, $|QS| = 2\\text{ cm}$, and $|QR| = 9\\text{ cm}$:<br/><svg viewBox='0 0 360 210' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><polygon points='180,25 40,175 320,175' fill='none' stroke='#1e293b' stroke-width='2.5'/><line x1='87' y1='125' x2='273' y2='125' stroke='#2563eb' stroke-width='2.5'/><text x='180' y='18' font-size='12' font-weight='bold' fill='#0f172a' text-anchor='middle'>P</text><text x='25' y='185' font-size='12' font-weight='bold' fill='#0f172a'>Q</text><text x='330' y='185' font-size='12' font-weight='bold' fill='#0f172a'>R</text><text x='74' y='125' font-size='12' font-weight='bold' fill='#2563eb'>S</text><text x='280' y='125' font-size='12' font-weight='bold' fill='#2563eb'>T</text><text x='122' y='70' font-size='11' font-weight='bold' fill='#1e3a8a'>4 cm</text><text x='52' y='155' font-size='11' font-weight='bold' fill='#1e3a8a'>2 cm</text><text x='180' y='195' font-size='11' font-weight='bold' fill='#16a34a' text-anchor='middle'>9 cm</text><text x='180' y='118' font-size='11' font-weight='bold' fill='#2563eb' text-anchor='middle'>ST</text><text x='180' y='205' font-size='9' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg><br/>(i) Find the length of line segment $\\overline{ST}$.<br/>(ii) If $\\triangle PQR$ has a perpendicular height of $6\\text{ cm}$ from $P$ to base $QR$, find the area of $\\triangle PQR$.",
        "workedSolution": "(i) Total side $|PQ| = |PS| + |QS| = 4 + 2 = 6\\text{ cm}$.\nScale factor $k = \\frac{|PQ|}{|PS|} = \\frac{6}{4} = 1.5$.\nSince $ST \\parallel QR$:\n$$|ST| = \\frac{|QR|}{k} = \\frac{9}{1.5} = 6\\text{ cm}$$.\n\n(ii) $$\\text{Area of } \\triangle PQR = \\frac{1}{2} \\times \\text{base} \\times \\text{height} = \\frac{1}{2} \\times 9 \\times 6 = 27\\text{ cm}^2$$.",
        "maxMarks": 8
      },
      {
        "subId": "(b)",
        "prompt": "The total area of a school compound is $800\\frac{1}{2}\\text{ m}^2$. The compound has an Administration and Classroom block, Library, and School Park, with the remaining area used for Roads and Walkways. The areas of the Administration and Classroom block, Library, and School Park are $250\\frac{1}{4}\\text{ m}^2$, $300\\frac{1}{2}\\text{ m}^2$, and $150\\frac{1}{8}\\text{ m}^2$ respectively. Find the area covered by Roads and Walkways.",
        "workedSolution": "Sum the occupied areas:\n$$250\\frac{1}{4} + 300\\frac{1}{2} + 150\\frac{1}{8}$$\n$$= (250 + 300 + 150) + \\left(\\frac{2}{8} + \\frac{4}{8} + \\frac{1}{8}\\right)$$\n$$= 700 + \\frac{7}{8} = 700\\frac{7}{8}\\text{ m}^2$$\nSubtract from the total area:\n$$800\\frac{1}{2} - 700\\frac{7}{8} = 800\\frac{4}{8} - 700\\frac{7}{8}$$\n$$= 799\\frac{12}{8} - 700\\frac{7}{8} = 99\\frac{5}{8}\\text{ m}^2 \\quad (\\text{or } 99.625\\text{ m}^2)$$.",
        "maxMarks": 7
      }
    ]
  },
  {
    "questionNumber": "6",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Copy and complete the table for the relation $F = \\frac{9}{5}C + 32$:\n\n| °C | 0 | 5 | 10 | 15 | 20 | 25 | 30 |\n| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| °F | 32 | **?** | **?** | **?** | 68 | **?** | **?** |",
        "workedSolution": "Evaluate $F = \\frac{9}{5}C + 32$:\n- $C = 5: F = \\frac{9}{5}(5) + 32 = 9 + 32 = 41$\n- $C = 10: F = \\frac{9}{5}(10) + 32 = 18 + 32 = 50$\n- $C = 15: F = \\frac{9}{5}(15) + 32 = 27 + 32 = 59$\n- $C = 20: F = \\frac{9}{5}(20) + 32 = 36 + 32 = 68$ (given)\n- $C = 25: F = \\frac{9}{5}(25) + 32 = 45 + 32 = 77$\n- $C = 30: F = \\frac{9}{5}(30) + 32 = 54 + 32 = 86$\n\nCompleted table:\n| °C | 0 | 5 | 10 | 15 | 20 | 25 | 30 |\n| °F | 32 | 41 | 50 | 59 | 68 | 77 | 86 |",
        "maxMarks": 4
      },
      {
        "subId": "(b)",
        "prompt": "Using a scale of 2 cm to 10 units on the vertical axis (°F) and 2 cm to 5 units on the horizontal axis (°C), draw a linear graph for the relation for $0 \\le C \\le 30$.",
        "workedSolution": "Axes drawn and calibrated with uniform scales. Points $(0, 32), (5, 41), (10, 50), (15, 59), (20, 68), (25, 77), (30, 86)$ plotted accurately and connected with a ruler-drawn straight line.",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "Use the graph to find the temperature in degrees Celsius (°C) when $F = 50^\\circ\\text{F}$:<br/><svg viewBox='0 0 340 280' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><pattern id='tempGridClean' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='#e2e8f0' stroke-width='0.9'/></pattern></defs><rect width='100%' height='100%' fill='url(#tempGridClean)'/><line x1='50' y1='240' x2='320' y2='240' stroke='#334155' stroke-width='2'/><polygon points='320,237 328,240 320,243' fill='#334155'/><text x='325' y='255' font-size='11' font-weight='bold' fill='#334155'>°C</text><line x1='50' y1='240' x2='50' y2='20' stroke='#334155' stroke-width='2'/><polygon points='47,20 50,12 53,20' fill='#334155'/><text x='25' y='22' font-size='11' font-weight='bold' fill='#334155'>°F</text><line x1='50' y1='170' x2='290' y2='51' stroke='#2563eb' stroke-width='2.5'/><circle cx='50' cy='170' r='3.5' fill='#dc2626'/><circle cx='130' cy='130' r='3.5' fill='#dc2626'/><circle cx='210' cy='90' r='3.5' fill='#dc2626'/><circle cx='290' cy='51' r='3.5' fill='#dc2626'/><line x1='50' y1='130' x2='130' y2='130' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/><line x1='130' y1='130' x2='130' y2='240' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/><text x='20' y='134' font-size='9' font-weight='bold' fill='#d97706'>50°F</text><text x='130' y='255' font-size='9' font-weight='bold' fill='#d97706' text-anchor='middle'>10°C</text></svg>",
        "workedSolution": "Locate $50^\\circ\\text{F}$ on the vertical axis, read across to the line, and down to the horizontal axis:\n$$C = 10^\\circ\\text{C}$$\n*(Algebraic verification: $50 - 32 = 18 \\implies C = 18 \\times \\frac{5}{9} = 10^\\circ\\text{C}$)*.",
        "maxMarks": 3
      },
      {
        "subId": "(d)",
        "prompt": "Interpret the slope of the relation.",
        "workedSolution": "The slope $m = \\frac{9}{5} = 1.8$ indicates the rate of change: for every $1^\\circ\\text{C}$ increase in temperature, the Fahrenheit temperature increases by $1.8^\\circ\\text{F}$ (or for every $5^\\circ\\text{C}$ increase, Fahrenheit increases by $9^\\circ\\text{F}$).",
        "maxMarks": 3
      }
    ]
  }
];

async function fixAndSeedBece2024Paper2Variant() {
  console.log('Overwriting 2024 Paper 2 Variant with calibrated BECE blueprint...');

  const paperDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2024_variant');

  await paperDocRef.set({
    paper2: {
      title: "Paper 2: Essay / Theory Test (Variant)",
      durationMinutes: 60,
      instructions: "Answer four questions only. All questions carry equal marks. All working must be clearly shown.",
      totalQuestions: 6,
      questions: paper2Questions
    },
    'metadata.paper2Calibrated': true,
    'metadata.updatedAt': admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });

  console.log('✅ Correctly overwrote and calibrated Paper 2 under past_papers/paper_2024_variant.');
}

fixAndSeedBece2024Paper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to overwrite Paper 2 variant:', err);
    process.exit(1);
  });
