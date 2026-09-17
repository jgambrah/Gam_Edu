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

// 1. Modified SVG for Paper 2 Q3(b) (L-shaped Room: 10m by 6m, cutout 6m by 2m)
const svgP2Q3Var = `
<svg viewBox='0 0 340 200' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='none' stroke='#cbd5e1' stroke-width='1.5'/>
  <path d='M 40 35 L 290 35 L 290 100 L 140 100 L 140 165 L 40 165 Z' fill='rgba(219, 234, 254, 0.5)' stroke='#1e40af' stroke-width='2.5'/>
  <text x='165' y='25' font-size='12' font-weight='bold' fill='#1e3a8a' text-anchor='middle'>10 m</text>
  <text x='26' y='105' font-size='12' font-weight='bold' fill='#1e3a8a' text-anchor='end'>6 m</text>
  <text x='302' y='72' font-size='12' font-weight='bold' fill='#1e3a8a'>4 m</text>
  <text x='215' y='122' font-size='12' font-weight='bold' fill='#1e3a8a' text-anchor='middle'>6 m</text>
  <text x='170' y='188' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 2. Modified SVG for Paper 2 Q4(b) (Ladder with distance 6m and angle 60 deg)
const svgP2Q4Var = `
<svg viewBox='0 0 300 200' width='100%' height='170' xmlns='http://www.w3.org/2000/svg'>
  <rect width='100%' height='100%' rx='6' fill='none' stroke='#cbd5e1' stroke-width='1.5'/>
  <line x1='30' y1='160' x2='270' y2='160' stroke='#334155' stroke-width='2'/>
  <line x1='210' y1='160' x2='210' y2='40' stroke='#0f172a' stroke-width='4'/>
  <rect x='194' y='144' width='16' height='16' fill='none' stroke='#475569' stroke-width='1.5'/>
  <line x1='70' y1='160' x2='210' y2='50' stroke='#2563eb' stroke-width='3'/>
  <path d='M 105 160 A 35 35 0 0 0 98 138' fill='none' stroke='#dc2626' stroke-width='2'/>
  <text x='112' y='152' font-size='12' font-weight='bold' fill='#dc2626'>60°</text>
  <text x='140' y='178' font-size='12' font-weight='bold' fill='#16a34a' text-anchor='middle'>6 m</text>
  <text x='125' y='95' font-size='12' font-weight='bold' fill='#2563eb'>Ladder (L)</text>
  <text x='225' y='100' font-size='12' font-weight='bold' fill='#0f172a'>Window (h)</text>
</svg>
`.trim().replace(/\n\s*/g, '');

// 6 Isomorphic Cloned Theory Questions for Paper 2
const paper2Questions = [
  {
    questionNumber: "1",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Given that universal set $M = \\{1, 2, 3, \\dots, 13\\}$:\n(i) list the prime numbers in $M$;\n(ii) find the probability that an integer picked at random from $M$ is NOT a prime number.",
        workedSolution: "(i) Prime numbers in $M$: $\\{2, 3, 5, 7, 11, 13\\}$.\n(ii) Total count $n(M) = 13$.\nNon-prime numbers: $\\{1, 4, 6, 8, 9, 10, 12\\}$, giving 7 elements.\n$$P(\\text{not prime}) = \\frac{7}{13}$$.",
        maxMarks: 5
      },
      {
        subId: "(b)",
        prompt: "Factorize completely: $(a + b)(3p - 2q) - p(a + b)$.",
        workedSolution: "Factor out $(a + b)$:\n$$(a + b)[(3p - 2q) - p] = (a + b)(3p - p - 2q) = (a + b)(2p - 2q) = 2(a + b)(p - q)$$.",
        maxMarks: 4
      },
      {
        subId: "(c)",
        prompt: "A graphic designer charges GH¢ 75.00 for the first 10 pages designed, and GH¢ 12.00 for each additional page. Calculate the total earnings for designing 42 pages.",
        workedSolution: "First 10 pages cost GH¢ 75.00.\nAdditional pages $= 42 - 10 = 32$ pages.\n$$\\text{Cost of additional pages} = 32 \\times 12.00 = \\text{GH¢ } 384.00$$\n$$\\text{Total earned} = 75.00 + 384.00 = \\text{GH¢ } 459.00$$.",
        maxMarks: 6
      }
    ]
  },
  {
    questionNumber: "2",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "The image of point $A(3, 4)$ under a translation vector $\\mathbf{t}$ is $(-2, 9)$. Find:\n(i) the translation vector $\\mathbf{t}$;\n(ii) the image $B'$ of point $B(-5, -4)$ when translated by $\\mathbf{t}$.",
        workedSolution: "(i) $\\begin{pmatrix} 3 \\\\ 4 \\end{pmatrix} + \\mathbf{t} = \\begin{pmatrix} -2 \\\\ 9 \\end{pmatrix} \\implies \\mathbf{t} = \\begin{pmatrix} -2 - 3 \\\\ 9 - 4 \\end{pmatrix} = \\begin{pmatrix} -5 \\\\ 5 \\end{pmatrix}$.\n(ii) $B' = \\begin{pmatrix} -5 \\\\ -4 \\end{pmatrix} + \\begin{pmatrix} -5 \\\\ 5 \\end{pmatrix} = \\begin{pmatrix} -10 \\\\ 1 \\end{pmatrix} \\implies B'(-10, 1)$.",
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "Abena and Kwesi contributed GH¢ 12,000.00 and GH¢ 6,000.00 respectively to finance a business. They agreed that Kwesi will receive one-fourth of the net profit as manager, and the remaining profit will be shared in the ratio of their capital contributions. If the business made a net profit of GH¢ 16,000.00, calculate the total amount received by:\n(i) Abena;\n(ii) Kwesi.",
        workedSolution: "Kwesi's management allowance $= \\frac{1}{4} \\times 16,000.00 = \\text{GH¢ } 4,000.00$.\nRemaining profit $= 16,000 - 4,000 = \\text{GH¢ } 12,000.00$.\nRatio of capital $= 12,000 : 6,000 = 2 : 1$ (Total parts $= 3$).\n(i) Abena's share $= \\frac{2}{3} \\times 12,000.00 = \\text{GH¢ } 8,000.00$.\n(ii) Kwesi's profit share $= \\frac{1}{3} \\times 12,000.00 = \\text{GH¢ } 4,000.00$.\n$$\\text{Kwesi's total} = 4,000.00 + 4,000.00 = \\text{GH¢ } 8,000.00$$.",
        maxMarks: 9
      }
    ]
  },
  {
    questionNumber: "3",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "A farm worker was engaged to harvest cocoa pods at a daily wage of GH¢ 40.00. If his daily wage was increased by 15% and he worked for 25 days, calculate his total wages.",
        workedSolution: "$$\\text{Wage increase} = 0.15 \\times 40.00 = \\text{GH¢ } 6.00$$\n$$\\text{New wage} = 40.00 + 6.00 = \\text{GH¢ } 46.00$$\n$$\\text{Total pay for 25 days} = 46.00 \\times 25 = \\text{GH¢ } 1,150.00$$.",
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: `The diagram below shows the layout of a conference hall with its dimensions:<br/>${svgP2Q3Var}<br/>Calculate the:\n(i) perimeter of the hall;\n(ii) area of the hall floor;\n(iii) cost of tiling the floor at GH¢ 25.00 per square metre.`,
        workedSolution: "(i) Missing horizontal edge $= 10\\text{ m} - 6\\text{ m} = 4\\text{ m}$.\nMissing vertical edge $= 6\\text{ m} - 4\\text{ m} = 2\\text{ m}$.\n$$\\text{Perimeter} = 10 + 4 + 6 + 2 + 4 + 6 = 32\\text{ m}$$.\n(ii) Using enclosing rectangle minus cutout:\n$$\\text{Total Area} = (10 \\times 6) - (6 \\times 2) = 60 - 12 = 48\\text{ m}^2$$.\n(iii) $$\\text{Cost of tiling} = 48\\text{ m}^2 \\times 25.00/\\text{m}^2 = \\text{GH¢ } 1,200.00$$.",
        maxMarks: 9
      }
    ]
  },
  {
    questionNumber: "4",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "In a company, the monthly salaries of three supervisors Mensah, Addo, and Boateng are GH¢ 6,000.00, GH¢ 7,200.00, and GH¢ 4,800.00 respectively.\n(i) Calculate the annual salary of each supervisor.\n(ii) Find the annual salary difference between Mensah and Boateng.\n(iii) Determine the total annual salary expenditure for all three supervisors.",
        workedSolution: "(i) Annual salary $= \\text{monthly} \\times 12$:\n- Mensah $= 6,000 \\times 12 = \\text{GH¢ } 72,000.00$\n- Addo $= 7,200 \\times 12 = \\text{GH¢ } 86,400.00$\n- Boateng $= 4,800 \\times 12 = \\text{GH¢ } 57,600.00$\n(ii) $$\\text{Difference} = 72,000.00 - 57,600.00 = \\text{GH¢ } 14,400.00$$\n(iii) $$\\text{Total} = 72,000 + 86,400 + 57,600 = \\text{GH¢ } 216,000.00$$.",
        maxMarks: 7
      },
      {
        subId: "(b)",
        prompt: `A technician rests an inspection ladder against a vertical telecom pole at a maintenance window. The ladder makes an angle of $60^\\circ$ with the horizontal ground. The foot of the ladder is $6\\text{ m}$ away from the base of the pole:<br/>${svgP2Q4Var}<br/>(i) Draw a clearly labelled mathematical diagram representing this scenario.\n(ii) Calculate, correct to one decimal place, the:\n(α) length of the ladder;\n(β) height of the window above the ground.\n[Take $\\tan 60^\\circ = 1.732$ and $\\cos 60^\\circ = 0.5$]`,
        workedSolution: "(i) Right-angled triangle with base $= 6\\text{ m}$, angle at base $= 60^\\circ$, pole height $= h$, and ladder hypotenuse $= L$.\n(ii)(α) Length of ladder $L$:\n$$\\cos 60^\\circ = \\frac{6}{L} \\implies L = \\frac{6}{0.5} = 12.0\\text{ m}$$.\n(ii)(β) Height of window $h$:\n$$\\tan 60^\\circ = \\frac{h}{6} \\implies h = 6 \\times 1.732 = 10.392 \\approx 10.4\\text{ m}$$.",
        maxMarks: 8
      }
    ]
  },
  {
    questionNumber: "5",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "Simplify $\\frac{\\sqrt{98}}{\\sqrt{32} - \\sqrt{18}}$, leaving your answer in the form $p + q\\sqrt{r}$ where $p, q, r$ are integers.",
        workedSolution: "$$\\sqrt{98} = 7\\sqrt{2}, \\quad \\sqrt{32} = 4\\sqrt{2}, \\quad \\sqrt{18} = 3\\sqrt{2}$$\n$$\\frac{\\sqrt{98}}{\\sqrt{32} - \\sqrt{18}} = \\frac{7\\sqrt{2}}{4\\sqrt{2} - 3\\sqrt{2}} = \\frac{7\\sqrt{2}}{\\sqrt{2}} = 7$$\nExpressing in the form $p + q\\sqrt{r}$ gives $7 + 0\\sqrt{2}$ (where $p = 7, q = 0$).",
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "Solve the linear inequality: $\\frac{1}{2}(3x + 2) \\ge \\frac{1}{4}x + 2\\frac{1}{5}$.",
        workedSolution: "$$\\frac{3x + 2}{2} \\ge \\frac{x}{4} + \\frac{11}{5}$$\nMultiply through by the LCM of 2, 4, and 5 (which is 20):\n$$10(3x + 2) \\ge 5x + 44$$\n$$30x + 20 \\ge 5x + 44 \\implies 25x \\ge 24 \\implies x \\ge \\frac{24}{25} = 0.96$$.",
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "A runner completes five laps around a circular training track with a radius of $35\\text{ m}$. Calculate the total distance covered in metres. [Take $\\pi = \\frac{22}{7}$]",
        workedSolution: "$$\\text{Circumference of 1 lap} = 2\\pi r = 2 \\times \\frac{22}{7} \\times 35 = 220\\text{ m}$$\n$$\\text{Total distance for 5 laps} = 5 \\times 220 = 1,100\\text{ m}$$.",
        maxMarks: 4
      }
    ]
  },
  {
    questionNumber: "6",
    subQuestions: [
      {
        subId: "(a)",
        prompt: "The list below represents the shoe sizes worn by 30 pupils: 7, 5, 8, 6, 6, 7, 5, 6, 6, 5, 7, 8, 6, 7, 5, 7, 8, 6, 7, 5, 8, 6, 5, 7, 6, 6, 5, 7, 8, 6. Construct a frequency distribution table for this dataset.",
        workedSolution: "| Shoe Size ($x$) | Tally | Frequency ($f$) | $fx$ |\n| :---: | :---: | :---: | :---: |\n| 5 | |||| || | 7 | 35 |\n| 6 | |||| |||| | 10 | 60 |\n| 7 | |||| ||| | 8 | 56 |\n| 8 | |||| | 5 | 40 |\n| **Total** | | **30** | **191** |",
        maxMarks: 6
      },
      {
        subId: "(b)",
        prompt: "From your table in (a):\n(i) state the modal shoe size;\n(ii) give a reason for your answer in (b)(i);\n(iii) which shoe size should a donor order in the least quantity?\n(iv) explain your answer in (b)(iii).",
        workedSolution: "(i) Size 6.\n(ii) It occurs most frequently (highest frequency $= 10$).\n(iii) Size 8.\n(iv) It has the least frequency of demand (only 5 pupils).",
        maxMarks: 5
      },
      {
        subId: "(c)",
        prompt: "Calculate the mean shoe size correct to the nearest whole number.",
        workedSolution: "$$\\bar{x} = \\frac{\\sum fx}{\\sum f} = \\frac{191}{30} \\approx 6.37$$\nCorrect to the nearest whole number: **6**.",
        maxMarks: 4
      }
    ]
  }
];

async function seedBece2026VariantPaper2() {
  console.log('===============================================================');
  console.log('  STAGE 2: SEEDING 2026 BECE VARIANT - PAPER 2 (THEORY/ESSAY)  ');
  console.log('===============================================================\n');

  const paper2Payload = {
    title: "Paper 2: Essay / Theory Test (Variant)",
    durationMinutes: 60,
    instructions: "Answer four questions only. All working must be clearly shown.",
    totalQuestions: 6,
    questions: paper2Questions
  };

  const docPaths = [
    'global_curriculum/jhs/subjects/math/past_papers/paper_2026_variant',
    'global_curriculum/jhs/subjects/math/past_papers/year_2026_variant'
  ];

  for (const p of docPaths) {
    const docRef = db.doc(p);
    await docRef.set({
      paper2: paper2Payload,
      'metadata.verifiedPaper2': true,
      'metadata.completed': true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    console.log(`✅ Ingested Paper 2 into ${p}`);
  }

  // Fetch full consolidated document to save local backup
  const snap = await db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2026_variant').get();
  const fullData = snap.data();

  const outDir = 'scripts/payloads';
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(`${outDir}/paper_2026_variant.json`, JSON.stringify(fullData, null, 2), 'utf-8');
  console.log(`✅ Saved full consolidated variant payload to ${outDir}/paper_2026_variant.json`);

  // Update past papers registry index to record the variant
  const registryDocRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/index');
  const regSnap = await registryDocRef.get();
  if (regSnap.exists) {
    const regData = regSnap.data()!;
    const variants = regData.variants || {};
    variants['2026_variant'] = {
      year: 2026,
      paperId: 'paper_2026_variant',
      yearDocId: 'year_2026_variant',
      title: '2026 WAEC BECE Mathematics (Cloned Practice Model)',
      paper1Count: 40,
      paper2Count: 6,
      isVariant: true,
      addedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    await registryDocRef.update({ variants, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    await db.doc('global_curriculum/jhs/subjects/math/past_papers/registry').set({ variants }, { merge: true });
    console.log('✅ Updated past papers registry index with 2026 variant entry.');
  }

  console.log('\n🎉 Stage 2 (Paper 2) successfully completed!');
}

seedBece2026VariantPaper2()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to seed 2026 variant Paper 2:', err);
    process.exit(1);
  });
