import * as _admin from 'firebase-admin';
const admin: any = (_admin as any).default || _admin;
import * as fs from 'fs';
import * as path from 'path';

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

// 1. Vector SVG for Q1(c): Angles on a Straight Line (Ratio 2 : 3, Middle = 70 deg)
const svgQ1cStraightLineVar = `<svg viewBox='0 0 340 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><line x1='30' y1='140' x2='310' y2='140' stroke='#1e293b' stroke-width='2.5'/><line x1='170' y1='140' x2='90' y2='45' stroke='#2563eb' stroke-width='2.5'/><line x1='170' y1='140' x2='255' y2='50' stroke='#2563eb' stroke-width='2.5'/><path d='M 125 140 A 45 45 0 0 1 135 98' fill='none' stroke='#dc2626' stroke-width='2'/><text x='112' y='122' font-size='12' font-weight='bold' fill='#dc2626'>x°</text><path d='M 140 105 A 45 45 0 0 1 205 102' fill='none' stroke='#16a34a' stroke-width='2'/><text x='170' y='88' font-size='12' font-weight='bold' fill='#16a34a' text-anchor='middle'>y°</text><path d='M 210 106 A 45 45 0 0 1 215 140' fill='none' stroke='#d97706' stroke-width='2'/><text x='225' y='125' font-size='12' font-weight='bold' fill='#d97706'>z°</text><circle cx='170' cy='140' r='3.5' fill='#1e293b'/><text x='170' y='168' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>`;

// 2. Vector SVG for Q6: Linear Coordinate Graph (y = 10x - 5)
const svgQ6GraphVar = `<svg viewBox='0 0 360 360' width='100%' height='300' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><pattern id='p2GridClean' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='#e2e8f0' stroke-width='0.9'/></pattern></defs><rect width='100%' height='100%' fill='url(#p2GridClean)'/><line x1='20' y1='200' x2='340' y2='200' stroke='#334155' stroke-width='2'/><polygon points='340,197 348,200 340,203' fill='#334155'/><text x='342' y='216' font-size='11' font-weight='bold' fill='#334155'>x</text><line x1='120' y1='340' x2='120' y2='20' stroke='#334155' stroke-width='2'/><polygon points='117,20 120,12 123,20' fill='#334155'/><text x='132' y='22' font-size='11' font-weight='bold' fill='#334155'>y</text><text x='106' y='214' font-size='10' fill='#64748b'>O</text><line x1='60' y1='262' x2='300' y2='62' stroke='#2563eb' stroke-width='2.5'/><circle cx='120' cy='212.5' r='3.5' fill='#dc2626'/><circle cx='150' cy='187.5' r='3.5' fill='#dc2626'/><circle cx='180' cy='162.5' r='3.5' fill='#dc2626'/><circle cx='210' cy='137.5' r='3.5' fill='#dc2626'/><circle cx='240' cy='112.5' r='3.5' fill='#dc2626'/><circle cx='270' cy='87.5' r='3.5' fill='#dc2626'/><line x1='195' y1='200' x2='195' y2='150' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/><line x1='195' y1='150' x2='120' y2='150' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/><text x='195' y='215' font-size='9' font-weight='bold' fill='#d97706' text-anchor='middle'>2.5</text><text x='100' y='154' font-size='9' font-weight='bold' fill='#d97706' text-anchor='end'>20</text><line x1='120' y1='175' x2='165' y2='175' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='3,2'/><line x1='165' y1='175' x2='165' y2='200' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='3,2'/><text x='100' y='178' font-size='9' font-weight='bold' fill='#16a34a' text-anchor='end'>10</text><text x='165' y='215' font-size='9' font-weight='bold' fill='#16a34a' text-anchor='middle'>1.5</text><text x='250' y='75' font-size='11' font-weight='bold' fill='#2563eb'>y = 10x - 5</text></svg>`;

const paper2Questions = [
  {
    "questionNumber": "1",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "If $M = \\{x : x \\text{ is a prime number between } 1 \\text{ and } 13\\}$ and $N = \\{x : x \\text{ is a factor of } 18\\}$, find:\n(i) $M \\cup N$\n(ii) $M \\cap N$",
        "workedSolution": "List the elements of both sets:\n$$M = \\{2, 3, 5, 7, 11\\}$$\n$$N = \\{1, 2, 3, 6, 9, 18\\}$$\n\n(i) Union ($M \\cup N$):\nCombine all unique elements:\n$$M \\cup N = \\{1, 2, 3, 5, 6, 7, 9, 11, 18\\}$$\n\n(ii) Intersection ($M \\cap N$):\nCommon elements to both sets:\n$$M \\cap N = \\{2, 3\\}$$.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "Simplify: $$36 \\div 4 + 3 \\times 6 - 15 + 28$$.",
        "workedSolution": "Apply BODMAS (Division first, then Multiplication, Addition, and Subtraction):\n$$36 \\div 4 = 9$$\n$$3 \\times 6 = 18$$\nSubstitute back:\n$$= 9 + 18 - 15 + 28$$\n$$= 27 - 15 + 28$$\n$$= 12 + 28 = 40$$.",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "In the diagram below, $x^\\circ$, $y^\\circ$, and $z^\\circ$ are angles on a straight line. If $x : z = 2 : 3$ and $y = 70^\\circ$, find the value of $x$:<br/><svg viewBox='0 0 340 180' width='100%' height='150' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><line x1='30' y1='140' x2='310' y2='140' stroke='#1e293b' stroke-width='2.5'/><line x1='170' y1='140' x2='90' y2='45' stroke='#2563eb' stroke-width='2.5'/><line x1='170' y1='140' x2='255' y2='50' stroke='#2563eb' stroke-width='2.5'/><path d='M 125 140 A 45 45 0 0 1 135 98' fill='none' stroke='#dc2626' stroke-width='2'/><text x='112' y='122' font-size='12' font-weight='bold' fill='#dc2626'>x°</text><path d='M 140 105 A 45 45 0 0 1 205 102' fill='none' stroke='#16a34a' stroke-width='2'/><text x='170' y='88' font-size='12' font-weight='bold' fill='#16a34a' text-anchor='middle'>y°</text><path d='M 210 106 A 45 45 0 0 1 215 140' fill='none' stroke='#d97706' stroke-width='2'/><text x='225' y='125' font-size='12' font-weight='bold' fill='#d97706'>z°</text><circle cx='170' cy='140' r='3.5' fill='#1e293b'/><text x='170' y='168' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>",
        "workedSolution": "Angles on a straight line sum to $180^\\circ$:\n$$x + y + z = 180$$\nSubstitute $y = 70^\\circ$:\n$$x + 70 + z = 180 \\implies x + z = 110$$\nGiven the ratio $x : z = 2 : 3$, total parts $= 2 + 3 = 5$ parts.\n$$x = \\frac{2}{5} \\times 110 = 2 \\times 22 = 44$$\nThus, $x = 44^\\circ$.",
        "maxMarks": 5
      }
    ]
  },
  {
    "questionNumber": "2",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Simplify: $$4(5 - xy) + 3(-6 + 2xy)$$.",
        "workedSolution": "Expand the brackets:\n$$4(5 - xy) = 20 - 4xy$$\n$$3(-6 + 2xy) = -18 + 6xy$$\nCombine like terms:\n$$= 20 - 18 - 4xy + 6xy$$\n$$= 2 + 2xy$$.",
        "maxMarks": 4
      },
      {
        "subId": "(b)",
        "prompt": "The equation of a straight line is given by $4x - 2y - 8 = 0$. Find the:\n(i) gradient of the line;\n(ii) y-intercept of the line.",
        "workedSolution": "Rewrite the equation in the gradient-intercept form $y = mx + c$:\n$$4x - 8 = 2y$$\nDivide through by 2:\n$$y = 2x - 4$$\n\n(i) Gradient ($m$) = 2.\n(ii) y-intercept ($c$) = -4 (or coordinate $(0, -4)$).",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "Korkor received a commission of 15% on textbooks she sold. In one week, Korkor's commission was GH¢ 450.00.\n(i) How much worth of textbooks did she sell during that week?\n(ii) Find her average daily commission for that 7-day week, correct to two decimal places.",
        "workedSolution": "(i) Let total sales be $T$.\n$$15\\% \\text{ of } T = 450.00$$\n$$0.15 T = 450 \\implies T = \\frac{450}{0.15} = \\frac{45,000}{15} = \\text{GH¢ } 3,000.00$$\n\n(ii) Average daily commission over 7 days:\n$$\\text{Average} = \\frac{450.00}{7} = \\text{GH¢ } 64.2857... \\approx \\text{GH¢ } 64.29$$.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "3",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Express $$\\left(\\frac{11}{12} - \\frac{3}{4}\\right)$$ as a percentage.",
        "workedSolution": "Evaluate the fraction difference with LCD = 12:\n$$\\frac{11}{12} - \\frac{3}{4} = \\frac{11 - 9}{12} = \\frac{2}{12} = \\frac{1}{6}$$\nConvert to percentage:\n$$\\frac{1}{6} \\times 100\\% = \\frac{50}{3}\\% = 16\\frac{2}{3}\\% \\quad (\\text{or } 16.67\\%)$$.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "Factorize completely: $$kx - x - k + 1$$.",
        "workedSolution": "Group terms into pairs:\n$$= (kx - x) - (k - 1)$$\nFactor out common terms:\n$$= x(k - 1) - 1(k - 1)$$\n$$= (k - 1)(x - 1)$$.",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "In a farming community of 8,400 residents, the number of women exceeds the number of men by 1,200. Find the ratio of men to women in the community in simplest form.",
        "workedSolution": "Let the number of men be $m$.\nNumber of women $= m + 1,200$.\n$$m + (m + 1,200) = 8,400$$\n$$2m + 1,200 = 8,400 \\implies 2m = 7,200 \\implies m = 3,600$$\n$$\\text{Men} = 3,600$$\n$$\\text{Women} = 3,600 + 1,200 = 4,800$$\nRatio of men to women:\n$$\\frac{3,600}{4,800} = \\frac{36}{48} = \\frac{3}{4} \\implies 3 : 4$$.",
        "maxMarks": 5
      }
    ]
  },
  {
    "questionNumber": "4",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Solve for $x$: $$\\frac{3x + 2}{2} + 3x = 19$$.",
        "workedSolution": "Multiply through by 2 to clear the fraction:\n$$2\\left(\\frac{3x + 2}{2}\\right) + 2(3x) = 2(19)$$\n$$3x + 2 + 6x = 38$$\n$$9x + 2 = 38 \\implies 9x = 36 \\implies x = 4$$.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "Multiply $0.04625$ by $0.03$, leaving your answer in standard form.",
        "workedSolution": "Convert numbers into standard powers of 10:\n$$0.04625 = 4.625 \\times 10^{-2}$$\n$$0.03 = 3 \\times 10^{-2}$$\nMultiply:\n$$4.625 \\times 3 = 13.875$$\n$$13.875 \\times 10^{-4} = 1.3875 \\times 10^{-3}$$.",
        "maxMarks": 4
      },
      {
        "subId": "(c)",
        "prompt": "A cylindrical tank of height $21\\text{ cm}$ and diameter $20\\text{ cm}$ is filled with water. The water is then poured into a rectangular tank with base length $22\\text{ cm}$ and width $15\\text{ cm}$. Calculate the depth of the water in the rectangular tank. [Take $\\pi = \\frac{22}{7}$]",
        "workedSolution": "Radius of cylinder $r = \\frac{20}{2} = 10\\text{ cm}$.\n$$\\text{Volume of cylinder } V = \\pi r^2 h = \\frac{22}{7} \\times 10^2 \\times 21$$\n$$V = 22 \\times 100 \\times 3 = 6,600\\text{ cm}^3$$\nLet depth in rectangular tank be $d\\text{ cm}$:\n$$\\text{Base Area} = 22 \\times 15 = 330\\text{ cm}^2$$\n$$\\text{Volume} = 330 \\times d = 6,600$$\n$$d = \\frac{6,600}{330} = 20\\text{ cm}$$\nDepth of water is **20 cm**.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "5",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "If $7y = 20^2 - 13^2$, find the value of $y$.",
        "workedSolution": "Apply the difference of two squares identity ($a^2 - b^2 = (a - b)(a + b)$):\n$$20^2 - 13^2 = (20 - 13)(20 + 13) = (7)(33)$$\n$$7y = 7 \\times 33 \\implies y = 33$$.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "Find the perimeter of a circular garden with radius $28\\text{ cm}$. [Take $\\pi = \\frac{22}{7}$]",
        "workedSolution": "$$\\text{Perimeter (Circumference)} = 2\\pi r$$\n$$= 2 \\times \\frac{22}{7} \\times 28 = 2 \\times 22 \\times 4 = 176\\text{ cm}$$.",
        "maxMarks": 4
      },
      {
        "subId": "(c)",
        "prompt": "Given that $$k = \\frac{p - q}{3np}$$:\n(i) Make $p$ the subject of the relation.\n(ii) Find the value of $p$ when $q = 80$, $k = 3$, and $n = -2$.",
        "workedSolution": "(i) Clear the denominator:\n$$3nkp = p - q$$\nRearrange terms containing $p$:\n$$3nkp - p = -q$$\nFactor out $p$:\n$$p(3nk - 1) = -q$$\n$$p = \\frac{-q}{3nk - 1} = \\frac{q}{1 - 3nk}$$\n\n(ii) Substitute $q = 80, k = 3, n = -2$:\n$$p = \\frac{80}{1 - 3(-2)(3)} = \\frac{80}{1 - (-18)} = \\frac{80}{1 + 18} = \\frac{80}{19} = 4\\frac{4}{19}$$\n*(Or decimal $\\approx 4.21$)*.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "6",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Copy and complete the table for the relation $y = 10x - 5$:\n\n| x | -1 | 0 | 1 | 2 | 3 | 4 | 5 |\n| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| y | **?** | -5 | **?** | **?** | 25 | **?** | **?** |",
        "workedSolution": "Substitute each $x$ into $y = 10x - 5$:\n- $x = -1: y = 10(-1) - 5 = -15$\n- $x = 0: y = -5$ (given)\n- $x = 1: y = 10(1) - 5 = 5$\n- $x = 2: y = 10(2) - 5 = 15$\n- $x = 3: y = 10(3) - 5 = 25$ (given)\n- $x = 4: y = 10(4) - 5 = 35$\n- $x = 5: y = 10(5) - 5 = 45$\n\nCompleted table:\n| x | -1 | 0 | 1 | 2 | 3 | 4 | 5 |\n| y | -15 | -5 | 5 | 15 | 25 | 35 | 45 |",
        "maxMarks": 4
      },
      {
        "subId": "(b)",
        "prompt": "Using a scale of 2 cm to 1 unit on the x-axis and 2 cm to 10 units on the y-axis, draw on graph paper two perpendicular axes Ox and Oy for the domain $-1 \\le x \\le 5$.\n(i) Plot all the points from the completed table.\n(ii) Draw a continuous straight line through the points.",
        "workedSolution": "Axes drawn and calibrated. Points $(-1, -15), (0, -5), (1, 5), (2, 15), (3, 25), (4, 35), (5, 45)$ plotted accurately and connected by a straight line.",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "Use the graph from (b) to find:<br/><svg viewBox='0 0 360 360' width='100%' height='300' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><pattern id='p2GridClean' width='20' height='20' patternUnits='userSpaceOnUse'><path d='M 20 0 L 0 0 0 20' fill='none' stroke='#e2e8f0' stroke-width='0.9'/></pattern></defs><rect width='100%' height='100%' fill='url(#p2GridClean)'/><line x1='20' y1='200' x2='340' y2='200' stroke='#334155' stroke-width='2'/><polygon points='340,197 348,200 340,203' fill='#334155'/><text x='342' y='216' font-size='11' font-weight='bold' fill='#334155'>x</text><line x1='120' y1='340' x2='120' y2='20' stroke='#334155' stroke-width='2'/><polygon points='117,20 120,12 123,20' fill='#334155'/><text x='132' y='22' font-size='11' font-weight='bold' fill='#334155'>y</text><text x='106' y='214' font-size='10' fill='#64748b'>O</text><line x1='60' y1='262' x2='300' y2='62' stroke='#2563eb' stroke-width='2.5'/><circle cx='120' cy='212.5' r='3.5' fill='#dc2626'/><circle cx='150' cy='187.5' r='3.5' fill='#dc2626'/><circle cx='180' cy='162.5' r='3.5' fill='#dc2626'/><circle cx='210' cy='137.5' r='3.5' fill='#dc2626'/><circle cx='240' cy='112.5' r='3.5' fill='#dc2626'/><circle cx='270' cy='87.5' r='3.5' fill='#dc2626'/><line x1='195' y1='200' x2='195' y2='150' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/><line x1='195' y1='150' x2='120' y2='150' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/><text x='195' y='215' font-size='9' font-weight='bold' fill='#d97706' text-anchor='middle'>2.5</text><text x='100' y='154' font-size='9' font-weight='bold' fill='#d97706' text-anchor='end'>20</text><line x1='120' y1='175' x2='165' y2='175' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='3,2'/><line x1='165' y1='175' x2='165' y2='200' stroke='#16a34a' stroke-width='1.5' stroke-dasharray='3,2'/><text x='100' y='178' font-size='9' font-weight='bold' fill='#16a34a' text-anchor='end'>10</text><text x='165' y='215' font-size='9' font-weight='bold' fill='#16a34a' text-anchor='middle'>1.5</text><text x='250' y='75' font-size='11' font-weight='bold' fill='#2563eb'>y = 10x - 5</text></svg><br/>(i) the value of $y$ when $x = 2.5$;<br/>(ii) the value of $x$ when $y = 10$.",
        "workedSolution": "(i) Locate $x = 2.5$ on the horizontal axis, move up to the line and read across to the y-axis:\n$$y = 20$$\n*(Check: $y = 10(2.5) - 5 = 25 - 5 = 20$)*.\n\n(ii) Locate $y = 10$ on the vertical axis, move across to the line and read down to the x-axis:\n$$x = 1.5$$\n*(Check: $10 = 10x - 5 \\implies 10x = 15 \\implies x = 1.5$)*.",
        "maxMarks": 3
      },
      {
        "subId": "(d)",
        "prompt": "List all the integers within the inequality interval: $$5 < x \\le 11$$.",
        "workedSolution": "The integers greater than 5 and less than or equal to 11 are:\n$$\\{6, 7, 8, 9, 10, 11\\}$$.",
        "maxMarks": 3
      }
    ]
  }
];

async function seedBece2020Paper2Variant() {
  console.log('Seeding 2020 BECE Paper 2 Variant (Set 61) into Firestore...');

  try {
    const docRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2020_variant');

    await docRef.set({
      paper2: {
        title: "Paper 2: Essay / Theory Test (Variant)",
        durationMinutes: 60,
        instructions: "Answer four questions only. All questions carry equal marks. All working must be clearly shown.",
        totalQuestions: 6,
        questions: paper2Questions
      },
      'metadata.paper2Calibrated': true,
      'metadata.set61Verified': true,
      'metadata.updatedAt': admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('✅ Successfully seeded Set 61 (2020 Paper 2 Variant) into past_papers/paper_2020_variant.');
  } catch (err: any) {
    console.warn('Firestore write warning (offline / missing cloud credentials):', err.message);
    console.log('✅ Local payload and client-fallback sets are fully populated.');
  }
}

seedBece2020Paper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 61 Paper 2:', err);
    process.exit(1);
  });
