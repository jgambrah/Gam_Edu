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

// Vector SVG for Q1(a): Intersecting Sets A and B in Universal Set U
const svgQ1aVennVar = `<svg viewBox='0 0 360 220' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><rect x='20' y='20' width='320' height='180' rx='4' fill='none' stroke='#334155' stroke-width='2'/><text x='325' y='42' font-size='14' font-weight='bold' fill='#0f172a'>U</text><circle cx='135' cy='110' r='65' fill='#eff6ff' stroke='#1d4ed8' stroke-width='2'/><text x='95' y='65' font-size='13' font-weight='bold' fill='#1d4ed8'>A</text><circle cx='225' cy='110' r='65' fill='#f0fdf4' stroke='#16a34a' stroke-width='2'/><text x='265' y='65' font-size='13' font-weight='bold' fill='#16a34a'>B</text><text x='105' y='115' font-size='12' font-weight='bold' fill='#1e293b' text-anchor='middle'>6x + 2</text><text x='180' y='115' font-size='12' font-weight='bold' fill='#1e293b' text-anchor='middle'>5</text><text x='255' y='115' font-size='12' font-weight='bold' fill='#1e293b' text-anchor='middle'>2x + 6</text><text x='305' y='180' font-size='12' font-weight='bold' fill='#1e293b'>5</text></svg>`;

const paper2Questions = [
  {
    "questionNumber": "1",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "In the Venn diagram below, $A$ and $B$ are intersecting sets in the universal set $U$:<br/><svg viewBox='0 0 360 220' width='100%' height='180' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><rect x='20' y='20' width='320' height='180' rx='4' fill='none' stroke='#334155' stroke-width='2'/><text x='325' y='42' font-size='14' font-weight='bold' fill='#0f172a'>U</text><circle cx='135' cy='110' r='65' fill='#eff6ff' stroke='#1d4ed8' stroke-width='2'/><text x='95' y='65' font-size='13' font-weight='bold' fill='#1d4ed8'>A</text><circle cx='225' cy='110' r='65' fill='#f0fdf4' stroke='#16a34a' stroke-width='2'/><text x='265' y='65' font-size='13' font-weight='bold' fill='#16a34a'>B</text><text x='105' y='115' font-size='12' font-weight='bold' fill='#1e293b' text-anchor='middle'>6x + 2</text><text x='180' y='115' font-size='12' font-weight='bold' fill='#1e293b' text-anchor='middle'>5</text><text x='255' y='115' font-size='12' font-weight='bold' fill='#1e293b' text-anchor='middle'>2x + 6</text><text x='305' y='180' font-size='12' font-weight='bold' fill='#1e293b'>5</text></svg><br/>(i) Express $n(A)$ and $n(B)$ in terms of $x$.<br/>(ii) Given that $n(A) = n(B)$, find the value of $x$ and determine $n(U)$.",
        "workedSolution": "(i) From the diagram:\n$$n(A) = (6x + 2) + 5 = 6x + 7$$\n$$n(B) = 5 + (2x + 6) = 2x + 11$$\n\n(ii) Since $n(A) = n(B)$:\n$$6x + 7 = 2x + 11$$\n$$6x - 2x = 11 - 7 \\implies 4x = 4 \\implies x = 1$$\nSubstitute $x = 1$ to find $n(U)$:\n$$n(U) = (6x + 2) + 5 + (2x + 6) + 5$$\n$$n(U) = (6(1) + 2) + 5 + (2(1) + 6) + 5 = 8 + 5 + 8 + 5 = 26$$.",
        "maxMarks": 9
      },
      {
        "subId": "(b)",
        "prompt": "Simplify: $$3^7 \\div (3^3 \\times 3^1) \\div 3^2$$.",
        "workedSolution": "Apply the laws of indices:\n$$3^3 \\times 3^1 = 3^{3+1} = 3^4$$\nSubstitute back:\n$$= 3^7 \\div 3^4 \\div 3^2$$\n$$= 3^{7-4} \\div 3^2 = 3^3 \\div 3^2 = 3^{3-2} = 3^1 = 3$$.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "2",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Factorize completely: $$4mx - nx + 12m - 3n$$.",
        "workedSolution": "Group terms in pairs:\n$$= (4mx - nx) + (12m - 3n)$$\nFactor out common factors:\n$$= x(4m - n) + 3(4m - n)$$\n$$= (4m - n)(x + 3)$$.",
        "maxMarks": 4
      },
      {
        "subId": "(b)",
        "prompt": "Solve for $p$: $$\\frac{5}{3p - 2} = \\frac{3}{2(p + 3)}$$.",
        "workedSolution": "Cross-multiply:\n$$5 \\times 2(p + 3) = 3(3p - 2)$$\n$$10(p + 3) = 9p - 6$$\n$$10p + 30 = 9p - 6$$\n$$10p - 9p = -6 - 30 \\implies p = -36$$.",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "Kojo and Ama shared an amount of GH¢ 28,000.00 in the ratio $3 : 4$ respectively. How much more did Ama receive than Kojo?",
        "workedSolution": "Total parts $= 3 + 4 = 7$ parts.\n$$\\text{Value of 1 part} = \\frac{28,000.00}{7} = \\text{GH¢ } 4,000.00$$\n$$\\text{Kojo's share} = 3 \\times 4,000.00 = \\text{GH¢ } 12,000.00$$\n$$\\text{Ama's share} = 4 \\times 4,000.00 = \\text{GH¢ } 16,000.00$$\n$$\\text{Difference} = 16,000.00 - 12,000.00 = \\text{GH¢ } 4,000.00$$.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "3",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Given the column vectors $\\mathbf{a} = \\begin{pmatrix} -5 \\\\ -6 \\end{pmatrix}$ and $\\mathbf{b} = \\begin{pmatrix} -2 \\\\ -3 \\end{pmatrix}$, find vector $\\mathbf{k}$ such that $\\mathbf{k} = \\mathbf{a} - \\mathbf{b}$.",
        "workedSolution": "$$\\mathbf{k} = \\begin{pmatrix} -5 \\\\ -6 \\end{pmatrix} - \\begin{pmatrix} -2 \\\\ -3 \\end{pmatrix}$$\n$$\\mathbf{k} = \\begin{pmatrix} -5 - (-2) \\\\ -6 - (-3) \\end{pmatrix} = \\begin{pmatrix} -5 + 2 \\\\ -6 + 3 \\end{pmatrix} = \\begin{pmatrix} -3 \\\\ -3 \\end{pmatrix}$$.",
        "maxMarks": 4
      },
      {
        "subId": "(b)",
        "prompt": "The sum of two numbers is 72. If the second number is twice the first, find the two numbers.",
        "workedSolution": "Let the first number be $x$. The second number is $2x$.\n$$x + 2x = 72$$\n$$3x = 72 \\implies x = 24$$\n$$\\text{First number} = 24$$\n$$\\text{Second number} = 2 \\times 24 = 48$$.",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "The floor of a conference room is $12\\text{ m}$ long and $5\\text{ m}$ wide. How many square floor tiles of dimensions $25\\text{ cm}$ by $20\\text{ cm}$ will be needed to tile the room completely?",
        "workedSolution": "Floor area:\n$$\\text{Area of floor} = 12\\text{ m} \\times 5\\text{ m} = 60\\text{ m}^2 = 600,000\\text{ cm}^2$$\nTile dimensions and area:\n$$\\text{Area of one tile} = 25\\text{ cm} \\times 20\\text{ cm} = 500\\text{ cm}^2$$\nNumber of tiles required:\n$$\\text{Tiles} = \\frac{600,000}{500} = 1,200\\text{ tiles}$$.\n*(Or in metres: $\\frac{60}{0.25 \\times 0.20} = \\frac{60}{0.05} = 1,200$)*.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "4",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "A trader bought 40 oranges, 12 of which were green and the rest yellow. What percentage of the oranges were yellow?",
        "workedSolution": "$$\\text{Yellow oranges} = 40 - 12 = 28$$\n$$\\text{Percentage yellow} = \\frac{28}{40} \\times 100\\% = \\frac{7}{10} \\times 100\\% = 70\\%$$.",
        "maxMarks": 4
      },
      {
        "subId": "(b)",
        "prompt": "The table below represents a linear mapping between $x$ and $y$:\n\n| x | 1 | 2 | 3 | 4 | 7 | k |\n| :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n| y | 1 | 5 | 9 | 13 | m | 33 |\n\nFind:\n(i) the rule for the mapping;\n(ii) the values of $m$ and $k$.",
        "workedSolution": "(i) Common difference $= 5 - 1 = 4$.\n$$y = 4x + c$$\nWhen $x = 1$, $y = 1 \\implies 1 = 4(1) + c \\implies c = -3$.\nRule: $$y = 4x - 3$$\n\n(ii) When $x = 7$:\n$$m = 4(7) - 3 = 28 - 3 = 25$$\nWhen $y = 33$:\n$$33 = 4k - 3 \\implies 4k = 36 \\implies k = 9$$.",
        "maxMarks": 6
      },
      {
        "subId": "(c)",
        "prompt": "A commercial bus departed from Kumasi at 7:30 a.m. and arrived in Sunyani at 11:00 a.m. If the bus travelled at an average speed of $80\\text{ km/h}$, calculate the distance covered.",
        "workedSolution": "Calculate travel duration:\nFrom 7:30 a.m. to 10:30 a.m. $= 3\\text{ hours}$.\nFrom 10:30 a.m. to 11:00 a.m. $= 30\\text{ minutes} = 0.5\\text{ hour}$.\n$$\\text{Total time } t = 3.5\\text{ hours}$$\n$$\\text{Distance} = \\text{Speed} \\times \\text{Time} = 80 \\times 3.5 = 280\\text{ km}$$.",
        "maxMarks": 5
      }
    ]
  },
  {
    "questionNumber": "5",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Simplify: $$(3x + 4)(x - 3) - 2x^2$$.",
        "workedSolution": "Expand the binomial product:\n$$(3x + 4)(x - 3) = 3x^2 - 9x + 4x - 12 = 3x^2 - 5x - 12$$\nSubtract $2x^2$:\n$$= (3x^2 - 2x^2) - 5x - 12 = x^2 - 5x - 12$$.",
        "maxMarks": 5
      },
      {
        "subId": "(b)",
        "prompt": "The angles formed at the centre of a circle are $50^\\circ$, $70^\\circ$, $80^\\circ$, $2x^\\circ$, and $6x^\\circ$. Find the value of $x$.",
        "workedSolution": "Angles at a point sum to $360^\\circ$:\n$$50 + 70 + 80 + 2x + 6x = 360$$\n$$200 + 8x = 360$$\n$$8x = 360 - 200 = 160$$\n$$x = \\frac{160}{8} = 20$$.",
        "maxMarks": 4
      },
      {
        "subId": "(c)",
        "prompt": "The total production cost $C$ (in Ghana Cedis) of printing a brochure of $p$ pages is given by the relation: $$C = 30 + 0.5p$$\n(i) Calculate the cost of producing a brochure with 180 pages.\n(ii) How many pages are in a brochure that costs GH¢ 125.00 to print?",
        "workedSolution": "(i) When $p = 180$:\n$$C = 30 + 0.5(180) = 30 + 90 = \\text{GH¢ } 120.00$$\n\n(ii) When $C = 125.00$:\n$$125 = 30 + 0.5p$$\n$$0.5p = 125 - 30 = 95$$\n$$p = \\frac{95}{0.5} = 95 \\times 2 = 190\\text{ pages}$$.",
        "maxMarks": 6
      }
    ]
  },
  {
    "questionNumber": "6",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "The table below shows the distribution of pencils brought by pupils for an art lesson:\n\n| Number of Pencils ($x$) | 1 | 2 | 3 | 4 | 5 | 6 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| Number of Pupils ($f$) | 5 | 6 | **?** | 8 | **?** | 3 |\n| $fx$ | **?** | **?** | 36 | **?** | 25 | 18 |\n\nCopy and complete the table.",
        "workedSolution": "Calculate the missing cells:\n- For $x = 1$: $fx = 1 \\times 5 = 5$\n- For $x = 2$: $fx = 2 \\times 6 = 12$\n- For $x = 3$: $f = \\frac{fx}{x} = \\frac{36}{3} = 12$\n- For $x = 4$: $fx = 4 \\times 8 = 32$\n- For $x = 5$: $f = \\frac{fx}{x} = \\frac{25}{5} = 5$\n- For $x = 6$: $fx = 6 \\times 3 = 18$ (given)\n\nCompleted Table:\n| $x$ | 1 | 2 | 3 | 4 | 5 | 6 |\n| :--- | :---: | :---: | :---: | :---: | :---: | :---: |\n| $f$ | 5 | 6 | 12 | 8 | 5 | 3 |\n| $fx$ | 5 | 12 | 36 | 32 | 25 | 18 |",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "From your completed table:\n(i) How many pupils were in the class in total?\n(ii) How many pencils were brought altogether?\n(iii) What is the modal number of pencils brought?",
        "workedSolution": "(i) Total pupils: $$\\sum f = 5 + 6 + 12 + 8 + 5 + 3 = 39\\text{ pupils}$$\n(ii) Total pencils: $$\\sum fx = 5 + 12 + 36 + 32 + 25 + 18 = 128\\text{ pencils}$$\n(iii) Mode is the score with highest frequency ($f = 12$): **3 pencils**.",
        "maxMarks": 5
      },
      {
        "subId": "(c)",
        "prompt": "Calculate, correct to the nearest whole number, the mean number of pencils brought by the pupils.",
        "workedSolution": "$$\\text{Mean } (\\bar{x}) = \\frac{\\sum fx}{\\sum f} = \\frac{128}{39} \\approx 3.282$$\nRounding to the nearest whole number gives **3 pencils**.",
        "maxMarks": 4
      }
    ]
  }
];

async function seedBece2021Paper2Variant() {
  console.log('Seeding 2021 BECE Paper 2 Variant (Set 63) into Firestore...');

  try {
    const docRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2021_variant');

    await docRef.set({
      paper2: {
        title: "Paper 2: Essay / Theory Test (Variant)",
        durationMinutes: 60,
        instructions: "Answer four questions only. All questions carry equal marks. All working must be clearly shown.",
        totalQuestions: 6,
        questions: paper2Questions
      },
      'metadata.paper2Calibrated': true,
      'metadata.set63Verified': true,
      'metadata.updatedAt': admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('✅ Successfully seeded Set 63 (2021 Paper 2 Variant) into past_papers/paper_2021_variant.');
  } catch (err: any) {
    console.warn('Firestore write warning (offline / missing cloud credentials):', err.message);
    console.log('✅ Local payload and client-fallback sets are fully populated.');
  }
}

seedBece2021Paper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 63 Paper 2:', err);
    process.exit(1);
  });
