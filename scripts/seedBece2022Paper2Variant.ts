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

// 1. Modified SVG for Question 2(c) (Equilateral Triangle with Algebraic Dimensions)
const svgQ2cEquilateralVar = `
<svg viewBox='0 0 320 220' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='none' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Equilateral Triangle ABC -->
  <polygon points='160,35 60,175 260,175' fill='rgba(239, 246, 255, 0.6)' stroke='#1e40af' stroke-width='2.5'/>
  <!-- Side Equality Hash Marks -->
  <line x1='106' y1='102' x2='114' y2='108' stroke='#1e293b' stroke-width='2'/>
  <line x1='206' y1='108' x2='214' y2='102' stroke='#1e293b' stroke-width='2'/>
  <line x1='157' y1='170' x2='163' y2='180' stroke='#1e293b' stroke-width='2'/>
  <!-- Vertex Labels -->
  <text x='160' y='25' font-size='13' font-weight='bold' fill='#0f172a' text-anchor='middle'>A</text>
  <text x='45' y='185' font-size='13' font-weight='bold' fill='#0f172a'>B</text>
  <text x='270' y='185' font-size='13' font-weight='bold' fill='#0f172a'>C</text>
  <!-- Edge Labels -->
  <text x='85' y='95' font-size='12' font-weight='bold' fill='#dc2626' transform='rotate(-54 85 95)'>(4x + 1) cm</text>
  <text x='230' y='95' font-size='12' font-weight='bold' fill='#16a34a' transform='rotate(54 230 95)'>17 cm</text>
  <text x='160' y='198' font-size='12' font-weight='bold' fill='#2563eb' text-anchor='middle'>(3y + 2) cm</text>
  <text x='160' y='214' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Modified SVG for Question 5(c) (Number Line: x >= -1.5)
const svgQ5cNumberLineVar = `
<svg viewBox='0 0 360 90' width='100%' height='85' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='none' stroke='#cbd5e1' stroke-width='1.5'/>
  <!-- Main Horizontal Axis -->
  <line x1='20' y1='50' x2='340' y2='50' stroke='#1e293b' stroke-width='2'/>
  <polygon points='20,46 12,50 20,54' fill='#1e293b'/>
  <polygon points='340,46 348,50 340,54' fill='#1e293b'/>
  <!-- Ticks -5 to 4 -->
  <line x1='45' y1='44' x2='45' y2='56' stroke='#475569' stroke-width='1.5'/><text x='45' y='72' font-size='11' fill='#334155' text-anchor='middle'>-5</text>
  <line x1='75' y1='44' x2='75' y2='56' stroke='#475569' stroke-width='1.5'/><text x='75' y='72' font-size='11' fill='#334155' text-anchor='middle'>-4</text>
  <line x1='105' y1='44' x2='105' y2='56' stroke='#475569' stroke-width='1.5'/><text x='105' y='72' font-size='11' fill='#334155' text-anchor='middle'>-3</text>
  <line x1='135' y1='44' x2='135' y2='56' stroke='#475569' stroke-width='1.5'/><text x='135' y='72' font-size='11' fill='#334155' text-anchor='middle'>-2</text>
  <line x1='165' y1='44' x2='165' y2='56' stroke='#475569' stroke-width='1.5'/><text x='165' y='72' font-size='11' fill='#334155' text-anchor='middle'>-1</text>
  <line x1='195' y1='44' x2='195' y2='56' stroke='#475569' stroke-width='1.5'/><text x='195' y='72' font-size='11' fill='#334155' text-anchor='middle'>0</text>
  <line x1='225' y1='44' x2='225' y2='56' stroke='#475569' stroke-width='1.5'/><text x='225' y='72' font-size='11' fill='#334155' text-anchor='middle'>1</text>
  <line x1='255' y1='44' x2='255' y2='56' stroke='#475569' stroke-width='1.5'/><text x='255' y='72' font-size='11' fill='#334155' text-anchor='middle'>2</text>
  <line x1='285' y1='44' x2='285' y2='56' stroke='#475569' stroke-width='1.5'/><text x='285' y='72' font-size='11' fill='#334155' text-anchor='middle'>3</text>
  <line x1='315' y1='44' x2='315' y2='56' stroke='#475569' stroke-width='1.5'/><text x='315' y='72' font-size='11' fill='#334155' text-anchor='middle'>4</text>
  <!-- Ray starting from -1.5 (x = 150) to right -->
  <line x1='150' y1='30' x2='340' y2='30' stroke='#2563eb' stroke-width='3.5'/>
  <polygon points='340,25 348,30 340,35' fill='#2563eb'/>
  <line x1='150' y1='50' x2='150' y2='30' stroke='#2563eb' stroke-width='1.8' stroke-dasharray='3,2'/>
  <circle cx='150' cy='30' r='5' fill='#2563eb' stroke='#1d4ed8' stroke-width='1.5'/>
  <text x='150' y='18' font-size='11' font-weight='bold' fill='#2563eb' text-anchor='middle'>x ≥ -1.5</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 3. Modified SVG for Question 6 (Cartesian Coordinate Graph: y = 7 - 3x)
const svgQ6LinearGraphVar = `
<svg viewBox='0 0 340 280' width='100%' height='240' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='none' stroke='#cbd5e1' stroke-width='1.5'/>
  <defs>
    <pattern id='cartesianGrid' width='20' height='20' patternUnits='userSpaceOnUse'>
      <path d='M 20 0 L 0 0 0 20' fill='none' stroke='#e2e8f0' stroke-width='1'/>
    </pattern>
  </defs>
  <rect width='100%' height='100%' fill='url(#cartesianGrid)'/>
  <!-- Axes (Origin at x=170, y=140) -->
  <line x1='20' y1='140' x2='320' y2='140' stroke='#475569' stroke-width='2'/>
  <polygon points='320,137 328,140 320,143' fill='#475569'/>
  <text x='325' y='155' font-size='11' font-weight='bold' fill='#334155'>x</text>
  <line x1='170' y1='260' x2='170' y2='20' stroke='#475569' stroke-width='2'/>
  <polygon points='167,20 170,12 173,20' fill='#475569'/>
  <text x='180' y='18' font-size='11' font-weight='bold' fill='#334155'>y</text>
  <text x='158' y='154' font-size='10' fill='#64748b'>O</text>
  <!-- Function Line: y = 7 - 3x (Slope = -3) -->
  <line x1='110' y1='20' x2='250' y2='260' stroke='#2563eb' stroke-width='2.5'/>
  <text x='205' y='55' font-size='11' font-weight='bold' fill='#2563eb'>y = 7 - 3x</text>
  <!-- Plotted points -->
  <circle cx='150' cy='80' r='3.5' fill='#dc2626'/>
  <circle cx='170' cy='100' r='3.5' fill='#dc2626'/>
  <circle cx='190' cy='120' r='3.5' fill='#dc2626'/>
  <circle cx='210' cy='140' r='3.5' fill='#dc2626'/>
  <circle cx='230' cy='160' r='3.5' fill='#dc2626'/>
  <!-- Interpolation guidelines -->
  <line x1='130' y1='140' x2='130' y2='60' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/>
  <line x1='130' y1='60' x2='170' y2='60' stroke='#d97706' stroke-width='1.5' stroke-dasharray='3,2'/>
  <text x='115' y='55' font-size='9' font-weight='bold' fill='#d97706'>(-2.0, 13.0)</text>
</svg>
`.trim().replace(/\n\s*/g, '');

const paper2Questions = [
  {
    questionNumber: "1",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Given that $P = \\{\\text{factors of } 48\\}$ and $Q = \\{\\text{factors of } 72\\}$:\n(i) list the members in the sets $P$ and $Q$;\n(ii) find:\n(α) $P \\cap Q$;\n(β) $n(P \\cap Q)$;\n(γ) the Highest Common Factor (HCF) of 48 and 72.",
        workedSolution: "(i) List all factors:\n$$P = \\{1, 2, 3, 4, 6, 8, 12, 16, 24, 48\\}$$\n$$Q = \\{1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, 72\\}$$\n\n(ii)(α) The common intersection:\n$$P \\cap Q = \\{1, 2, 3, 4, 6, 8, 12, 24\\}$$\n(ii)(β) Cardinality of intersection:\n$$n(P \\cap Q) = 8$$\n(ii)(γ) The largest shared common factor:\n$$\\text{HCF}(48, 72) = 24$$.",
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "Write down the next two terms of the sequence: $1, 8, 27, \\dots, \\dots$",
        workedSolution: "Analyze the sequence as consecutive cubic integers:\n$$1 = 1^3, \\quad 8 = 2^3, \\quad 27 = 3^3$$\nThe next two terms are:\n$$4^3 = 64$$\n$$5^3 = 125$$\nNext two terms: **64 and 125**.",
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "The median of the ordered set of observations $3, 5, (3m - 2), (2m + 4), 14, 18$ arranged in ascending order is 8. Find the value of $m$.",
        workedSolution: "For 6 observations, the median is the arithmetic mean of the 3rd and 4th terms:\n$$\\text{Median} = \\frac{(3m - 2) + (2m + 4)}{2} = 8$$\n$$5m + 2 = 16$$\n$$5m = 14 \\implies m = \\frac{14}{5} = 2.8$$.",
        maxMarks: 5
      }
    ]
  },
  {
    questionNumber: "2",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Simplify: $$\\left(\\frac{2}{5} + \\frac{1}{10}\\right) \\div \\left(\\frac{3}{4} - \\frac{1}{3}\\right)$$.",
        workedSolution: "Evaluate parentheses separately:\n$$\\text{Numerator} = \\frac{4}{10} + \\frac{1}{10} = \\frac{5}{10} = \\frac{1}{2}$$\n$$\\text{Denominator} = \\frac{9}{12} - \\frac{4}{12} = \\frac{5}{12}$$\nDivide:\n$$\\frac{1}{2} \\div \\frac{5}{12} = \\frac{1}{2} \\times \\frac{12}{5} = \\frac{6}{5} = 1\\frac{1}{5}$$.",
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: "Find the product of $(3x - 4)$ and $(3x + 4)$.",
        workedSolution: "Recognize the difference of two squares identity $(a - b)(a + b) = a^2 - b^2$:\n$$(3x - 4)(3x + 4) = (3x)^2 - (4)^2 = 9x^2 - 16$$.",
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: `In the diagram below, $\\triangle ABC$ is an equilateral triangle:<br/>${svgQ2cEquilateralVar}<br/>Find the value of $(x + y)$.`,
        workedSolution: "In an equilateral triangle, all three sides are equal to $17\\text{ cm}$:\n$$4x + 1 = 17 \\implies 4x = 16 \\implies x = 4$$\n$$3y + 2 = 17 \\implies 3y = 15 \\implies y = 5$$\n$$x + y = 4 + 5 = 9$$.",
        maxMarks: 6
      }
    ]
  },
  {
    questionNumber: "3",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Given the algebraic relation: $$K = \\frac{3(p^2 - q^2)}{6(p + q)}$$\n(i) simplify $K$;\n(ii) find the value of $K$ when $p = 5$ and $q = 2$.",
        workedSolution: "(i) Factorize the numerator using difference of squares:\n$$K = \\frac{3(p - q)(p + q)}{6(p + q)} = \\frac{3(p - q)}{6} = \\frac{p - q}{2}$$\n(ii) Substitute $p = 5$ and $q = 2$:\n$$K = \\frac{5 - 2}{2} = \\frac{3}{2} = 1.5$$.",
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: "Solve the equation: $$\\frac{3}{2}x = 8 - \\frac{2}{x}$$.",
        workedSolution: "Multiply through by $2x$ to clear all denominators:\n$$2x \\left(\\frac{3}{2}x\\right) = 2x(8) - 2x\\left(\\frac{2}{x}\\right)$$\n$$3x^2 = 16x - 4$$\n$$3x^2 - 16x + 4 = 0$$\nFactorize the quadratic trinomial (Product $= 12$, Sum $= -16$):\n$$(3x - 2)(x - 5) \\implies \\text{using quadratic formula}:$$\n$$x = \\frac{-(-16) \\pm \\sqrt{(-16)^2 - 4(3)(4)}}{2(3)} = \\frac{16 \\pm \\sqrt{256 - 48}}{6} = \\frac{16 \\pm \\sqrt{208}}{6}$$\n$$x = \\frac{8 \\pm 2\\sqrt{13}}{3}$$.",
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "A sales agent receives a commission of $4\\frac{1}{2}\\%$ on total sales made. She sold 15 reference books at GH¢ 30.00 each, 4 graphing calculators at GH¢ 75.00 each, and 10 geometry sets at GH¢ 40.00 each. Calculate her total commission.",
        workedSolution: "Calculate total value of sales:\n- Reference books: $15 \\times 30.00 = \\text{GH¢ } 450.00$\n- Calculators: $4 \\times 75.00 = \\text{GH¢ } 300.00$\n- Geometry sets: $10 \\times 40.00 = \\text{GH¢ } 400.00$\n$$\\text{Total sales} = 450.00 + 300.00 + 400.00 = \\text{GH¢ } 1,150.00$$\n$$\\text{Commission rate} = 4.5\\% = 0.045$$\n$$\\text{Commission} = 0.045 \\times 1,150.00 = \\text{GH¢ } 51.75$$.",
        maxMarks: 5
      }
    ]
  },
  {
    questionNumber: "4",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Kwame is $(x - 2)$ years old now. How old:\n(i) was he 5 years ago?\n(ii) will he be 7 years from now?\n(iii) is he now, if his age in 7 years' time will be twice his age 5 years ago?",
        workedSolution: "(i) Age 5 years ago:\n$$(x - 2) - 5 = (x - 7)\\text{ years old}$$\n(ii) Age 7 years from now:\n$$(x - 2) + 7 = (x + 5)\\text{ years old}$$\n(iii) Set up the linear equation:\n$$x + 5 = 2(x - 7)$$\n$$x + 5 = 2x - 14$$\n$$2x - x = 5 + 14 \\implies x = 19$$\nKwame's present age is $x - 2 = 19 - 2 = 17\\text{ years old}$.",
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: "The perimeter of a rectangular oil palm plantation is $360\\text{ km}$. The length of the plantation is $3\\frac{1}{2}$ times its width. Calculate the:\n(i) width;\n(ii) length of the plantation.",
        workedSolution: "Let width be $W$. Length $L = \\frac{7}{2}W$.\nPerimeter formula: $2(L + W) = 360$\n$$2\\left(\\frac{7}{2}W + W\\right) = 360$$\n$$2\\left(\\frac{9}{2}W\\right) = 360 \\implies 9W = 360$$\n(i) Width $W = \\frac{360}{9} = 40\\text{ km}$\n(ii) Length $L = \\frac{7}{2} \\times 40 = 140\\text{ km}$.",
        maxMarks: 8
      }
    ]
  },
  {
    questionNumber: "5",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Factorize completely: $(a - b)(4x + y) - (a - b)(x - 3y)$.",
        workedSolution: "Factor out the common binomial $(a - b)$:\n$$(a - b)[(4x + y) - (x - 3y)] = (a - b)(4x + y - x + 3y)$$\n$$= (a - b)(3x + 4y)$$.",
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "Given the vectors $\\mathbf{u} = \\begin{pmatrix} 4 - 2x \\\\ 6 - 3y \\end{pmatrix}$, $\\mathbf{v} = \\begin{pmatrix} -2 \\\\ 4 \\end{pmatrix}$, and $\\mathbf{u} - \\mathbf{v} = \\begin{pmatrix} 10 \\\\ 8 \\end{pmatrix}$, find the value of $(x + y)$.",
        workedSolution: "$$\\mathbf{u} - \\mathbf{v} = \\begin{pmatrix} (4 - 2x) - (-2) \\\\ (6 - 3y) - 4 \\end{pmatrix} = \\begin{pmatrix} 6 - 2x \\\\ 2 - 3y \\end{pmatrix} = \\begin{pmatrix} 10 \\\\ 8 \\end{pmatrix}$$\nEquate top row components:\n$$6 - 2x = 10 \\implies -2x = 4 \\implies x = -2$$\nEquate bottom row components:\n$$2 - 3y = 8 \\implies -3y = 6 \\implies y = -2$$\n$$x + y = (-2) + (-2) = -4$$.",
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: `(i) Find the truth set of $\\frac{x - 2}{3} \\le \\frac{1}{3} + x$.\n(ii) Illustrate your answer on a number line:<br/>${svgQ5cNumberLineVar}`,
        workedSolution: "(i) Multiply through by 3 to clear denominators:\n$$x - 2 \\le 1 + 3x$$\n$$-2 - 1 \\le 3x - x$$\n$$-3 \\le 2x \\implies 2x \\ge -3 \\implies x \\ge -1.5$$\n$$\\text{Truth set} = \\{x : x \\ge -1.5\\}$$\n(ii) The illustration displays a closed/solid circle at $-1.5$ with a directed shaded ray extending infinitely to the right.",
        maxMarks: 6
      }
    ]
  },
  {
    questionNumber: "6",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Copy and complete the table of values for the linear relation $y = 7 - 3x$ for the domain $-3 \\le x \\le 4$:\n\n| $x$ | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 |\n| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| $y$ | 16 | **?** | **?** | 7 | **?** | 1 | **?** | -5 |",
        workedSolution: "Substitute each $x$ value into $y = 7 - 3x$:\n- $x = -2: y = 7 - 3(-2) = 7 + 6 = 13$\n- $x = -1: y = 7 - 3(-1) = 7 + 3 = 10$\n- $x = 1: y = 7 - 3(1) = 4$\n- $x = 3: y = 7 - 3(3) = -2$\nCompleted table:\n| $x$ | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 |\n| $y$ | 16 | 13 | 10 | 7 | 4 | 1 | -2 | -5 |",
        maxMarks: 4
      },
      {
        subId: "(b)",
        prompt: "Using a scale of 2 cm to 1 unit on the $x$-axis and 2 cm to 2 units on the $y$-axis, draw two perpendicular axes $Ox$ and $Oy$ on a graph sheet for $-4 \\le x \\le 5$ and $-8 \\le y \\le 18$.",
        workedSolution: "Axes drawn with clear grid markings, origin $(0, 0)$, arrows at ends, and labels on both axes.",
        maxMarks: 3
      },
      {
        subId: "(c)",
        prompt: "(i) Plot all the coordinate points from the completed table.\n(ii) Draw a single continuous straight line through all the plotted points.",
        workedSolution: "Points $(-3, 16), (-2, 13), (-1, 10), (0, 7), (1, 4), (2, 1), (3, -2), (4, -5)$ plotted accurately and connected with a ruler.",
        maxMarks: 4
      },
      {
        subId: "(d)",
        prompt: `Using the drawn graph:<br/>${svgQ6LinearGraphVar}<br/>Find the:\n(i) value of $y$ when $x = -1.5$;\n(ii) value of $x$ when $y = -0.5$;\n(iii) gradient of the straight line.`,
        workedSolution: "(i) Reading vertically from $x = -1.5$ to the line and horizontally across: $y = 11.5$.\n(ii) Reading horizontally from $y = -0.5$ to the line and vertically down: $x = 2.5$.\n(iii) Gradient $m = \\frac{\\Delta y}{\\Delta x} = \\frac{1 - 7}{2 - 0} = \\frac{-6}{2} = -3$.",
        maxMarks: 4
      }
    ]
  }
];

async function seedBece2022Paper2Variant() {
  console.log('===============================================================');
  console.log('    SEEDING 2022 BECE VARIANT - PAPER 2 (THEORY / ESSAY)       ');
  console.log('===============================================================\n');

  const paper2Payload = {
    title: "Paper 2: Essay / Theory Test (Variant)",
    durationMinutes: 60,
    instructions: "Answer four questions only. All working must be clearly shown.",
    totalQuestions: 6,
    questions: paper2Questions
  };

  const docPaths = [
    'global_curriculum/jhs/subjects/math/past_papers/paper_2022_variant',
    'global_curriculum/jhs/subjects/math/past_papers/year_2022_variant'
  ];

  for (const path of docPaths) {
    const docRef = db.doc(path);
    await docRef.set({
      paper2: paper2Payload,
      'metadata.paper2Ingested': true,
      'metadata.completed': true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`✅ Ingested Paper 2 into ${path}`);
  }

  // Fetch full consolidated document to save local backup
  const snap = await db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2022_variant').get();
  const fullData = snap.data();

  const outDir = 'scripts/payloads';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(`${outDir}/paper_2022_variant.json`, JSON.stringify(fullData, null, 2), 'utf-8');
  console.log(`✅ Saved full consolidated variant payload to ${outDir}/paper_2022_variant.json`);

  // Update past papers registry index to record paper2Count
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
      paper2Count: 6,
      isVariant: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    await registryDocRef.update({ variants, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    await db.doc('global_curriculum/jhs/subjects/math/past_papers/registry').set({ variants }, { merge: true });
    console.log('✅ Updated past papers registry index with 2022 variant Paper 2.');
  }

  console.log('\n🎉 Successfully seeded 2022 Paper 2 Variant into Firestore!');
}

seedBece2022Paper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to seed 2022 Paper 2 variant:', err);
    process.exit(1);
  });
