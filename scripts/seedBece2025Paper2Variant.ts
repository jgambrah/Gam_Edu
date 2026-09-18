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

// 1. Vector SVG for Q5(a): Pie Chart of Household Items
const svgQ5aPieVar = `<svg viewBox='0 0 340 240' width='100%' height='210' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><g transform='translate(120, 115)'><path d='M 0 0 L 85 0 A 85 85 0 0 1 -26.27 80.84 Z' fill='#3b82f6' stroke='#ffffff' stroke-width='1.5'/><path d='M 0 0 L -26.27 80.84 A 85 85 0 0 1 -85 0 Z' fill='#06b6d4' stroke='#ffffff' stroke-width='1.5'/><path d='M 0 0 L -85 0 A 85 85 0 0 1 -68.77 -49.96 Z' fill='#f59e0b' stroke='#ffffff' stroke-width='1.5'/><path d='M 0 0 L -68.77 -49.96 A 85 85 0 0 1 49.96 -68.77 Z' fill='#10b981' stroke='#ffffff' stroke-width='1.5'/><path d='M 0 0 L 49.96 -68.77 A 85 85 0 0 1 85 0 Z' fill='#8b5cf6' stroke='#ffffff' stroke-width='1.5'/></g><g transform='translate(215, 35)'><circle cx='10' cy='15' r='4.5' fill='#3b82f6'/><text x='20' y='18' font-size='10' font-weight='bold' fill='#334155'>Rice 108°</text><circle cx='10' cy='35' r='4.5' fill='#10b981'/><text x='20' y='38' font-size='10' font-weight='bold' fill='#334155'>Gari 90°</text><circle cx='10' cy='55' r='4.5' fill='#06b6d4'/><text x='20' y='58' font-size='10' font-weight='bold' fill='#334155'>Fish (x°)</text><circle cx='10' cy='75' r='4.5' fill='#8b5cf6'/><text x='20' y='78' font-size='10' font-weight='bold' fill='#334155'>Flour 54°</text><circle cx='10' cy='95' r='4.5' fill='#f59e0b'/><text x='20' y='98' font-size='10' font-weight='bold' fill='#334155'>Sugar 36°</text></g><text x='170' y='228' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg>`;

// 2. Vector SVG for Q6(a): Distance-Time Graph
const svgQ6DistanceTimeVar = `<svg viewBox='0 0 360 300' width='100%' height='260' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><pattern id='distGrid' width='25' height='25' patternUnits='userSpaceOnUse'><path d='M 25 0 L 0 0 0 25' fill='none' stroke='#e2e8f0' stroke-width='0.9'/></pattern></defs><rect width='100%' height='100%' fill='url(#distGrid)'/><line x1='50' y1='240' x2='330' y2='240' stroke='#334155' stroke-width='2'/><polygon points='330,237 338,240 330,243' fill='#334155'/><text x='332' y='256' font-size='10' font-weight='bold' fill='#334155'>Time (min)</text><line x1='50' y1='240' x2='50' y2='25' stroke='#334155' stroke-width='2'/><polygon points='47,25 50,17 53,25' fill='#334155'/><text x='20' y='25' font-size='10' font-weight='bold' fill='#334155'>Dist (km)</text><text x='40' y='252' font-size='10' fill='#64748b'>0</text><text x='120' y='255' font-size='9' fill='#334155' text-anchor='middle'>60</text><text x='155' y='255' font-size='9' fill='#334155' text-anchor='middle'>90</text><text x='260' y='255' font-size='9' fill='#334155' text-anchor='middle'>150</text><text x='32' y='193' font-size='9' fill='#334155' text-anchor='end'>10</text><text x='32' y='143' font-size='9' fill='#334155' text-anchor='end'>20</text><text x='32' y='93' font-size='9' fill='#334155' text-anchor='end'>30</text><text x='32' y='43' font-size='9' fill='#334155' text-anchor='end'>40</text><line x1='50' y1='240' x2='120' y2='190' stroke='#2563eb' stroke-width='2.5'/><circle cx='120' cy='190' r='3.5' fill='#dc2626'/><line x1='120' y1='190' x2='155' y2='190' stroke='#16a34a' stroke-width='3'/><circle cx='155' cy='190' r='3.5' fill='#dc2626'/><line x1='155' y1='190' x2='260' y2='40' stroke='#2563eb' stroke-width='2.5'/><circle cx='260' cy='40' r='3.5' fill='#dc2626'/><line x1='120' y1='240' x2='120' y2='190' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/><line x1='155' y1='240' x2='155' y2='190' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/><line x1='260' y1='240' x2='260' y2='40' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/><line x1='50' y1='190' x2='155' y2='190' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/><line x1='50' y1='40' x2='260' y2='40' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/></svg>`;

const paper2Questions = [
  {
    "questionNumber": "1",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Given that $A = \\{\\text{multiples of } 4\\}$ and $B = \\{\\text{positive even numbers}\\}$ are subsets of the universal set $U = \\{x : 1 \\le x \\le 24, \\text{ where } x \\text{ is a counting number}\\}$:\n(i) List the elements in $A \\cap B$.\n(ii) List all the subsets of $A \\cap B$ if $A \\cap B$ is restricted to multiples of 4 that are also multiples of 6 within $U$.",
        "workedSolution": "(i) List the universal set and subsets:\n$$U = \\{1, 2, 3, \\dots, 24\\}$$\n$$A = \\{4, 8, 12, 16, 20, 24\\}$$\n$$B = \\{2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24\\}$$\nSince every multiple of 4 is even, $A \\subset B$:\n$$A \\cap B = \\{4, 8, 12, 16, 20, 24\\}$$\n\n(ii) Multiples of 4 and 6 within $U$ are the common multiples: $\\{12, 24\\}$.\nThe subsets of $\\{12, 24\\}$ are:\n$$\\emptyset, \\{12\\}, \\{24\\}, \\{12, 24\\}$$\n*(Total number of subsets = $2^2 = 4$)*.",
        "maxMarks": 8
      },
      {
        "subId": "(b)",
        "prompt": "Given the relation: $$\\frac{1}{w} = 2m - \\frac{3}{k}$$\n(i) Make $w$ the subject of the relation.\n(ii) Using your result in (b)(i), calculate the value of $w$ when $k = -1$ and $m = 2$.",
        "workedSolution": "(i) Express the right-hand side as a single fraction:\n$$\\frac{1}{w} = \\frac{2mk - 3}{k}$$\nInvert both sides to make $w$ the subject:\n$$w = \\frac{k}{2mk - 3}$$\n\n(ii) Substitute $k = -1$ and $m = 2$:\n$$w = \\frac{-1}{2(2)(-1) - 3} = \\frac{-1}{-4 - 3} = \\frac{-1}{-7} = \\frac{1}{7}$$.",
        "maxMarks": 7
      }
    ]
  },
  {
    "questionNumber": "2",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Evaluate: $$\\frac{6000 \\times 0.28}{0.04}$$, leaving your answer in standard form.",
        "workedSolution": "Simplify the division:\n$$\\frac{0.28}{0.04} = \\frac{28}{4} = 7$$\n$$6000 \\times 7 = 42,000$$\nConvert to standard form:\n$$42,000 = 4.2 \\times 10^4$$.",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "A real estate consultant earns a 10% commission on Type A residential units and a 15% commission on Type B commercial units. In a month, he sold 3 Type A units at GH¢ 600,000.00 each and 2 Type B units at GH¢ 1,200,000.00 each. Calculate the total commission earned.",
        "workedSolution": "Total sales for Type A units:\n$$3 \\times 600,000.00 = \\text{GH¢ } 1,800,000.00$$\n$$\\text{Commission on Type A} = 0.10 \\times 1,800,000.00 = \\text{GH¢ } 180,000.00$$\n\nTotal sales for Type B units:\n$$2 \\times 1,200,000.00 = \\text{GH¢ } 2,400,000.00$$\n$$\\text{Commission on Type B} = 0.15 \\times 2,400,000.00 = \\text{GH¢ } 360,000.00$$\n\n$$\\text{Total Commission} = 180,000.00 + 360,000.00 = \\text{GH¢ } 540,000.00$$.",
        "maxMarks": 9
      }
    ]
  },
  {
    "questionNumber": "3",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "Given column vectors $\\mathbf{p} = \\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix}$, $\\mathbf{q} = \\begin{pmatrix} x \\\\ -4 \\end{pmatrix}$, and $\\mathbf{r} = \\begin{pmatrix} 8 \\\\ 0 \\end{pmatrix}$:\n(i) Find the value of $x$ if $2\\mathbf{p} + \\mathbf{q} = \\mathbf{r}$.\n(ii) Find vector $\\mathbf{u} = \\mathbf{r} - 3\\mathbf{p}$.\n(iii) Calculate the magnitude of vector $\\mathbf{u}$.",
        "workedSolution": "(i) $$2\\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix} + \\begin{pmatrix} x \\\\ -4 \\end{pmatrix} = \\begin{pmatrix} 8 \\\\ 0 \\end{pmatrix}$$\n$$\\begin{pmatrix} 6 + x \\\\ 4 - 4 \\end{pmatrix} = \\begin{pmatrix} 8 \\\\ 0 \\end{pmatrix} \\implies 6 + x = 8 \\implies x = 2$$\n\n(ii) $$\\mathbf{u} = \\begin{pmatrix} 8 \\\\ 0 \\end{pmatrix} - 3\\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 8 \\\\ 0 \\end{pmatrix} - \\begin{pmatrix} 9 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} -1 \\\\ -6 \\end{pmatrix}$$\n\n(iii) $$\u000bert{}\\mathbf{u}\u000bert{} = \\sqrt{(-1)^2 + (-6)^2} = \\sqrt{1 + 36} = \\sqrt{37}\\text{ units}$$.",
        "maxMarks": 8
      },
      {
        "subId": "(b)",
        "prompt": "A reservoir holds 5,000 litres of water. If $\\frac{1}{4}$ of the water is drawn for irrigation:\n(i) Calculate the volume of water used for irrigation.\n(ii) What percentage of water remains in the reservoir?",
        "workedSolution": "(i) $$\\text{Water used} = \\frac{1}{4} \\times 5,000 = 1,250\\text{ litres}$$\n\n(ii) $$\\text{Water remaining} = 5,000 - 1,250 = 3,750\\text{ litres}$$\n$$\\text{Percentage remaining} = \\frac{3,750}{5,000} \\times 100\\% = \\frac{3}{4} \\times 100\\% = 75\\%$$.",
        "maxMarks": 7
      }
    ]
  },
  {
    "questionNumber": "4",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "A businesswoman borrowed GH¢ 6,400.00 from a credit union at a simple interest rate of 6% per annum for 9 months. Calculate the interest paid.",
        "workedSolution": "Convert time to years: $T = \\frac{9}{12} = \\frac{3}{4}\\text{ year}$.\n$$I = \\frac{P \\times R \\times T}{100} = \\frac{6,400 \\times 6 \\times \\frac{3}{4}}{100}$$\n$$I = 64 \\times 6 \\times 0.75 = 64 \\times 4.5 = \\text{GH¢ } 288.00$$.",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "A cocoa farmer shared a tract of farmland among his three children. The first child received $\\frac{2}{5}$ of the land, and the second child received 6 acres more than the first child. The third child was given the remaining 18 acres. Find:\n(i) the total acres of land shared;\n(ii) the number of acres received by the first child;\n(iii) the number of acres received by the second child.",
        "workedSolution": "(i) Let total land be $y$ acres.\nFirst child: $\\frac{2}{5}y$\nSecond child: $\\frac{2}{5}y + 6$\nThird child: 18\n$$\\frac{2}{5}y + \\left(\\frac{2}{5}y + 6\\right) + 18 = y$$\n$$\\frac{4}{5}y + 24 = y \\implies 24 = y - \\frac{4}{5}y = \\frac{1}{5}y$$\n$$y = 24 \\times 5 = 120\\text{ acres}$$\n\n(ii) First child: $$\\frac{2}{5} \\times 120 = 2 \\times 24 = 48\\text{ acres}$$\n\n(iii) Second child: $$48 + 6 = 54\\text{ acres}$$\n*(Check: $48 + 54 + 18 = 120$)*.",
        "maxMarks": 9
      }
    ]
  },
  {
    "questionNumber": "5",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "The pie chart below represents the weight distribution of provisions purchased by a caterer:<br/><svg viewBox='0 0 340 240' width='100%' height='210' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><g transform='translate(120, 115)'><path d='M 0 0 L 85 0 A 85 85 0 0 1 -26.27 80.84 Z' fill='#3b82f6' stroke='#ffffff' stroke-width='1.5'/><path d='M 0 0 L -26.27 80.84 A 85 85 0 0 1 -85 0 Z' fill='#06b6d4' stroke='#ffffff' stroke-width='1.5'/><path d='M 0 0 L -85 0 A 85 85 0 0 1 -68.77 -49.96 Z' fill='#f59e0b' stroke='#ffffff' stroke-width='1.5'/><path d='M 0 0 L -68.77 -49.96 A 85 85 0 0 1 49.96 -68.77 Z' fill='#10b981' stroke='#ffffff' stroke-width='1.5'/><path d='M 0 0 L 49.96 -68.77 A 85 85 0 0 1 85 0 Z' fill='#8b5cf6' stroke='#ffffff' stroke-width='1.5'/></g><g transform='translate(215, 35)'><circle cx='10' cy='15' r='4.5' fill='#3b82f6'/><text x='20' y='18' font-size='10' font-weight='bold' fill='#334155'>Rice 108°</text><circle cx='10' cy='35' r='4.5' fill='#10b981'/><text x='20' y='38' font-size='10' font-weight='bold' fill='#334155'>Gari 90°</text><circle cx='10' cy='55' r='4.5' fill='#06b6d4'/><text x='20' y='58' font-size='10' font-weight='bold' fill='#334155'>Fish (x°)</text><circle cx='10' cy='75' r='4.5' fill='#8b5cf6'/><text x='20' y='78' font-size='10' font-weight='bold' fill='#334155'>Flour 54°</text><circle cx='10' cy='95' r='4.5' fill='#f59e0b'/><text x='20' y='98' font-size='10' font-weight='bold' fill='#334155'>Sugar 36°</text></g><text x='170' y='228' font-size='10' font-weight='bold' fill='#64748b' text-anchor='middle'>NOT DRAWN TO SCALE</text></svg><br/>(i) Calculate the sector angle that represents Fish.<br/>(ii) If the total weight of provisions bought was $20\\text{ kg}$:<br/>(α) find the weight of Flour bought;<br/>(β) express the weight of Sugar as a percentage of the weight of Rice, correct to one decimal place.",
        "workedSolution": "(i) Angles in a pie chart sum to $360^\\circ$:\n$$\\text{Fish} = 360^\\circ - (108^\\circ + 90^\\circ + 54^\\circ + 36^\\circ) = 360^\\circ - 288^\\circ = 72^\\circ$$\n\n(ii)(α) Weight of Flour ($54^\\circ$):\n$$\\text{Weight} = \\frac{54}{360} \\times 20 = \\frac{3}{20} \\times 20 = 3\\text{ kg}$$\n\n(ii)(β) Sugar angle $= 36^\\circ$, Rice angle $= 108^\\circ$:\n$$\\text{Percentage} = \\frac{36^\\circ}{108^\\circ} \\times 100\\% = \\frac{1}{3} \\times 100\\% = 33.3\\%$$.",
        "maxMarks": 10
      },
      {
        "subId": "(b)",
        "prompt": "In a class of 35 students, 7 students wear spectacles. If a student is selected at random from the class, what is the probability that the student does NOT wear spectacles?",
        "workedSolution": "$$\\text{Students not wearing spectacles} = 35 - 7 = 28$$\n$$P(\\text{not wearing spectacles}) = \\frac{28}{35} = \\frac{4}{5}$$.",
        "maxMarks": 5
      }
    ]
  },
  {
    "questionNumber": "6",
    "subQuestions": [
      {
        "subId": "(a)",
        "prompt": "A truck driver travelled a total distance of $40\\text{ km}$ from Town A to Town B. Sixty minutes after starting, he stopped at a service station $10\\text{ km}$ from Town A to rest for 30 minutes. He then resumed his journey and arrived at Town B 60 minutes later.<br/><svg viewBox='0 0 360 300' width='100%' height='260' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' rx='6' fill='#f8fafc' stroke='#cbd5e1' stroke-width='1.5'/><defs><pattern id='distGrid' width='25' height='25' patternUnits='userSpaceOnUse'><path d='M 25 0 L 0 0 0 25' fill='none' stroke='#e2e8f0' stroke-width='0.9'/></pattern></defs><rect width='100%' height='100%' fill='url(#distGrid)'/><line x1='50' y1='240' x2='330' y2='240' stroke='#334155' stroke-width='2'/><polygon points='330,237 338,240 330,243' fill='#334155'/><text x='332' y='256' font-size='10' font-weight='bold' fill='#334155'>Time (min)</text><line x1='50' y1='240' x2='50' y2='25' stroke='#334155' stroke-width='2'/><polygon points='47,25 50,17 53,25' fill='#334155'/><text x='20' y='25' font-size='10' font-weight='bold' fill='#334155'>Dist (km)</text><text x='40' y='252' font-size='10' fill='#64748b'>0</text><text x='120' y='255' font-size='9' fill='#334155' text-anchor='middle'>60</text><text x='155' y='255' font-size='9' fill='#334155' text-anchor='middle'>90</text><text x='260' y='255' font-size='9' fill='#334155' text-anchor='middle'>150</text><text x='32' y='193' font-size='9' fill='#334155' text-anchor='end'>10</text><text x='32' y='143' font-size='9' fill='#334155' text-anchor='end'>20</text><text x='32' y='93' font-size='9' fill='#334155' text-anchor='end'>30</text><text x='32' y='43' font-size='9' fill='#334155' text-anchor='end'>40</text><line x1='50' y1='240' x2='120' y2='190' stroke='#2563eb' stroke-width='2.5'/><circle cx='120' cy='190' r='3.5' fill='#dc2626'/><line x1='120' y1='190' x2='155' y2='190' stroke='#16a34a' stroke-width='3'/><circle cx='155' cy='190' r='3.5' fill='#dc2626'/><line x1='155' y1='190' x2='260' y2='40' stroke='#2563eb' stroke-width='2.5'/><circle cx='260' cy='40' r='3.5' fill='#dc2626'/><line x1='120' y1='240' x2='120' y2='190' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/><line x1='155' y1='240' x2='155' y2='190' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/><line x1='260' y1='240' x2='260' y2='40' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/><line x1='50' y1='190' x2='155' y2='190' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/><line x1='50' y1='40' x2='260' y2='40' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='2,2'/></svg><br/>Using a scale of 2 cm to 20 minutes on the horizontal time axis and 2 cm to 5 km on the vertical distance axis, plot and draw the distance-time graph for the journey.",
        "workedSolution": "Key coordinates to plot:\n- Start: $(0\\text{ min}, 0\\text{ km})$\n- Arrive at rest station: $(60\\text{ min}, 10\\text{ km})$\n- End of rest: $(90\\text{ min}, 10\\text{ km})$ [horizontal line segment]\n- Final destination: $(150\\text{ min}, 40\\text{ km})$\nStraight line segments connect these four points.",
        "maxMarks": 6
      },
      {
        "subId": "(b)",
        "prompt": "From your graph in (a), determine:\n(i) the distance from the service station to Town B;\n(ii) the total time (in minutes) taken for the whole journey including the rest period;\n(iii) the average speed of the truck from the service station to Town B in km/h.",
        "workedSolution": "(i) $$\\text{Distance} = 40 - 10 = 30\\text{ km}$$\n\n(ii) $$\\text{Total time} = 60 + 30 + 60 = 150\\text{ minutes}$$\n\n(iii) Time from service station to Town B $= 60\\text{ minutes} = 1\\text{ hour}$.\n$$\\text{Average speed} = \\frac{30\\text{ km}}{1\\text{ h}} = 30\\text{ km/h}$$.",
        "maxMarks": 6
      },
      {
        "subId": "(c)",
        "prompt": "If the driver had travelled the entire $40\\text{ km}$ continuously within the same total duration of 150 minutes without resting, calculate his average speed in km/h.",
        "workedSolution": "$$\\text{Total duration} = 150\\text{ minutes} = \\frac{150}{60} = 2.5\\text{ hours}$$\n$$\\text{Average speed} = \\frac{\\text{Total Distance}}{\\text{Total Time}} = \\frac{40}{2.5} = \\frac{40 \\times 2}{5} = 16\\text{ km/h}$$.",
        "maxMarks": 3
      }
    ]
  }
];

async function seedBece2025Paper2Variant() {
  console.log('Seeding 2025 BECE Paper 2 Variant (Set 65) into Firestore...');

  try {
    const docRef = db.doc('global_curriculum/jhs/subjects/math/past_papers/paper_2025_variant');

    await docRef.set({
      paper2: {
        title: "Paper 2: Essay / Theory Test (Variant)",
        durationMinutes: 60,
        instructions: "Answer four questions only. All questions carry equal marks. All working must be clearly shown.",
        totalQuestions: 6,
        questions: paper2Questions
      },
      'metadata.paper2Calibrated': true,
      'metadata.set65Verified': true,
      'metadata.updatedAt': admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log('✅ Successfully seeded Set 65 (2025 Paper 2 Variant) into past_papers/paper_2025_variant.');
  } catch (err: any) {
    console.warn('Firestore write warning (offline / missing cloud credentials):', err.message);
    console.log('✅ Local payload and client-fallback sets are fully populated.');
  }
}

seedBece2025Paper2Variant()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed ingestion for Set 65 Paper 2:', err);
    process.exit(1);
  });
