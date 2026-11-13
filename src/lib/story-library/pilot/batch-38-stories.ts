import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (
  motif: string,
  text: string,
  alt: string,
  narration = 'Measured, engaging voice suited for JHS learners; pause briefly after key mathematical, technical, and computing insights.'
): Page => ({
  motif,
  text,
  alt,
  brief: `Warm hand-painted gouache scene, landscape 4:3, following the character notes exactly. ${alt} Keep a calm, uncluttered area for text.`,
  narration,
});

interface Guide {
  overview: string;
  lessonMinutes: number;
  goals: string[];
  subjects: Array<[string, string]>;
  before: string[];
  during: string[];
  after: string[];
  discussion: string[];
  reflection: string[];
  maths?: Array<{ task: string; answer: string }>;
  support: string[];
  stretch: string[];
  localise: string[];
  discoveryStatus?: NonNullable<PilotStory['teacherGuide']>['discoveryStatus'];
  investigation?: NonNullable<PilotStory['teacherGuide']>['investigation'];
  factCheck?: NonNullable<PilotStory['teacherGuide']>['factCheck'];
}

interface Spec {
  key: string;
  title: string;
  summary: string;
  classIds: Classification['classIds'];
  ageMin: number;
  ageMax: number;
  readingLevel: Classification['readingLevel'];
  difficulty: number;
  genres: Classification['genres'];
  themes: Classification['themes'];
  objectives: Classification['objectives'];
  ghanaianContext: Classification['ghanaianContext'];
  culturalTags?: string[];
  wpm: number;
  paceWord: string;
  palette: [string, string];
  voice: string;
  characters: string[];
  music: string;
  pages: Page[];
  activities: Acts;
  glossary: PilotStory['glossary'];
  culturalNotes: string[];
  reviewQuestions: string[];
  guide: Guide;
}

const words = (pages: Page[]) => pages.reduce((n, p) => n + p.text.trim().split(/\s+/).length, 0);

const mk = (s: Spec): PilotStory => {
  const speakingSec = (words(s.pages) / s.wpm) * 60;
  const g = s.guide;
  const classification: Classification = {
    schemaVersion: CLASSIFICATION_VERSION,
    language: 'en',
    narrationLocale: 'en-GH',
    classIds: s.classIds,
    ageMin: s.ageMin,
    ageMax: s.ageMax,
    readingLevel: s.readingLevel,
    difficulty: s.difficulty,
    genres: s.genres,
    themes: s.themes,
    objectives: s.objectives,
    ghanaianContext: s.ghanaianContext,
    ...(s.culturalTags ? { culturalTags: s.culturalTags } : {}),
    estimatedDurationSec: Math.max(60, Math.round((speakingSec * 1.6) / 10) * 10),
  };
  return {
    key: s.key,
    set: 'extension',
    title: s.title,
    summary: s.summary,
    classification,
    palette: s.palette,
    characters: s.characters,
    narrationPlan: {
      voice: s.voice,
      pace: `${s.paceWord} (about ${s.wpm} words per minute)`,
      notes: [
        'Read dialogue with distinct, natural voices for each JHS student and teacher.',
        'Pause for two seconds at each comprehension check so learners can calculate or reason first.',
        'Pronounce spreadsheet formulas, geometric terms, and security acronyms clearly and unhurriedly.',
      ],
    },
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: [
      'Is the language right for the stated JHS age band (Basic 7 to Basic 9) and BECE conceptual level?',
      'Are all mathematical calculations, Career Technology safety rules, and Computing syntax 100% accurate?',
      ...s.reviewQuestions,
    ],
    pages: s.pages,
    activities: s.activities,
    glossary: s.glossary,
    teacherGuide: {
      overview: g.overview,
      lessonMinutes: g.lessonMinutes,
      learningGoals: g.goals,
      subjectLinks: g.subjects.map(([subject, link]) => ({ subject, link, status: 'to-verify' as const })),
      beforeReading: g.before,
      whileReading: g.during,
      afterReading: g.after,
      discussion: g.discussion,
      reflection: g.reflection,
      mathsExtension: g.maths ?? [],
      differentiation: { support: g.support, stretch: g.stretch },
      culturalNotes: s.culturalNotes,
      localiseThis: g.localise,
      ...(g.discoveryStatus ? { discoveryStatus: g.discoveryStatus } : {}),
      ...(g.investigation ? { investigation: g.investigation } : {}),
      ...(g.factCheck ? { factCheck: g.factCheck } : {}),
    },
  };
};

/**
 * Batch 38 (8 Integrated JHS STEM & Enterprise Stories):
 * NaCCA Common Core Programme (CCP) Basic 7 to Basic 9 (JHS 1 to 3) standards across:
 * - Computing (Spreadsheets B8.2.4, Ergonomics B8.1.3, Info Security B8.3.3, Robotics B8.4.3, LAN Topologies B8.3.1, AI Bias B8.4.4, Cloud B9.1.1, HTML B8.3.2)
 * - Career Technology (Food Hygiene B8.1.1, Workshop Safety B8.1.2, Resistant Materials B8.2.2, Simple Structures B8.4.1, PVC Conduit B8.3.3, Smart Materials B8.2.3, Business Plans B9.6.2)
 * - Mathematics (Percentages & Profit B8.1.3, Ratios B8.1.4, Linear Equations B8.2.3, Pythagoras B8.3.1, Cylinder Volume B8.3.2, Probability B8.4.2, Bearings & Vectors B8.3.1, Pie Charts B8.4.1, Prism Nets & TSA B8.3.2, Simple Interest B8.1.3).
 */
export const BATCH_38_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'formula-in-cell-d6',
    title: 'The Formula in Cell D6',
    summary:
      'Preparing meat pies and chilled sobolo for their JHS Career Technology enterprise day, Serwaa, Nii, and Latifa catch two costly mistakes: plain numbers typed where spreadsheet formulas belong, and percentage profit worked out on the selling price, and fix both when flour prices rise at the market.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'school-life', 'science'],
    themes: ['food', 'school', 'technology'],
    objectives: ['reasoning', 'problem-solving', 'responsibility', 'vocabulary'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'local-food', 'entrepreneurship'],
    wpm: 125,
    paceWord: 'Clear, methodical, and enterprising',
    palette: ['#be123c', '#0f766e'],
    voice:
      'Focused teen voices for Serwaa, Nii, and Latifa; encouraging, precise voice for Career Technology teacher Madam Osei',
    characters: [
      'Serwaa: a fourteen-year-old JHS 2 student in a clean white food-laboratory apron and hairnet, checking kitchen scales.',
      'Nii: her thirteen-year-old classmate at the ICT lab computer, keen on spreadsheets, formulas, and charts.',
      'Latifa: their fourteen-year-old group treasurer holding a neat enterprise ledger and calculator.',
      'Madam Osei: the JHS Career Technology teacher in a crisp white coat inspecting portion weights.',
    ],
    music: 'Light, upbeat acoustic guitar with crisp marimba notes suggesting teamwork and precision (placeholder)',
    pages: [
      pg(
        '🥧',
        'Friday was the Career Technology Enterprise Fair, and Group B planned to sell eighty meat pies and eighty cups of chilled sobolo. In the food laboratory, Serwaa put hygiene first. Hair went under clean caps. Fingernails were short. Hands were washed with soap. Raw minced beef stayed on its own board, away from the washed vegetables, to prevent cross-contamination. Then she turned to the recipe. Their test batch had made twenty pies, so for eighty she needed four times as much: a ratio of 1 : 4. She multiplied every gram of flour, margarine, and beef by four, so that each pie would be the same.',
        'Inside a spotless Ghanaian JHS food laboratory, Serwaa and Latifa in white aprons and hairnets weigh flour on digital scales while keeping raw meat on a separate chopping board.'
      ),
      pg(
        '💻',
        'Next door in the ICT laboratory, Nii opened a spreadsheet for the budget. Flour went in row 2, margarine in row 3, minced beef in row 4, and charcoal and packaging in row 5. Column B held the quantity, column C the unit price, and column D the subtotal. Nii worked out 5 × 12 in his head and typed 60 into cell D2. Then the price of flour rose from GH¢ 12 to GH¢ 14 a kilogram. He changed C2, but his totals did not move. Latifa saw why. “You typed a plain number. A formula must begin with an equals sign and use cell references. Type =B2*C2 in D2, and =SUM(D2:D5) in D6. Then the sheet recalculates whenever a price changes.”',
        'Close-up gouache view of a computer monitor showing a neat spreadsheet grid (Columns A to D, Rows 1 to 6) with =B2*C2 highlighted in D2 and =SUM(D2:D5) in cell D6.'
      ),
      pg(
        '📐',
        'With the new prices, cell D6 showed a total cost price of GH¢ 320.00 for the eighty pies. (The sobolo had its own budget.) So each pie cost GH¢ 4.00 to make. “Let us sell at GH¢ 5.00,” said Nii. “Eighty pies bring in GH¢ 400. That is GH¢ 80 profit. And 80 divided by 400 is 20% profit!” Latifa opened her Mathematics notebook. “Careful, Nii. That is a common BECE mistake. Percentage profit is worked out on the cost price. Divide the GH¢ 80 profit by the GH¢ 320 cost price and multiply by 100. You get 25%. Dividing by the GH¢ 400 selling price gives something different: a 20% margin on sales.”',
        'Latifa points to a whiteboard comparison showing Percentage Profit = (Profit / Cost Price) x 100% = (80 / 320) x 100% = 25%, crossing out division by Selling Price.'
      ),
      pg(
        '📈',
        'Madam Osei praised the correction. Then she asked a harder question. “Suppose rain keeps customers away. How many pies must you sell at GH¢ 5.00 just to get your GH¢ 320.00 back?” Serwaa wrote a linear equation on the board. Let x be the number of pies sold. Then 5x = 320, so x = 320 ÷ 5 = 64. “Sixty-four pies is our break-even point,” she explained. “At that point our sales equal the cost price of all eighty pies, so there is no profit and no loss. Real profit starts with pie number sixty-five.”',
        'Serwaa writing the linear equation 5x = 320 -> x = 64 pies on the classroom board beside a colourful spreadsheet column chart comparing Cost Price and Revenue.'
      ),
      pg(
        '🧮',
        'Before printing price tags, Nii wanted the sheet to work out the selling price by itself: the cost price plus 25%, shared among eighty pies. He typed =D6+D6*0.25/80 into cell E6. The answer was 321. “GH¢ 321 for one pie?” Serwaa laughed. Nii frowned, then remembered operator precedence. A spreadsheet multiplies and divides before it adds, unless brackets say otherwise. He typed =(D6+D6*0.25)/80, and E6 showed 5.00. He also made a bar chart of the costs. It showed that minced beef took 45% of the budget, while charcoal and packaging took only 10%.',
        'Nii and Serwaa reviewing a printed cost-breakdown bar chart and neat price tags produced in the JHS computer lab.'
      ),
      pg(
        '🌟',
        'On Friday afternoon, customers queued at Group B’s covered glass showcase. The pies were all the same size. The sobolo was chilled on clean ice. Every sale was recorded against the spreadsheet budget. By 2:00 p.m., all eighty pies were gone. Latifa counted GH¢ 400.00 from the pies. The group set aside GH¢ 320.00 to replace what the pies had cost. That left GH¢ 80.00 profit for the club’s next project. Clean food, a spreadsheet that recalculated by itself, and careful mathematics had turned a classroom recipe into a real business.',
        'Cheerful JHS Enterprise Fair courtyard showing Serwaa, Nii, and Latifa in clean aprons serving golden meat pies from a covered glass case and recording sales neatly.'
      ),
    ],
    activities: [
      {
        id: 'fd-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why is typing =B2*C2 in cell D2 better than typing =5*12 or 60?',
        options: [
          'Spreadsheets refuse to display numbers unless letters are typed in every cell',
          'Subtotals and SUM update automatically when quantity or price changes',
          'Typing 120 deletes all rows above row 2 permanently',
        ],
        correctIndex: 1,
      },
      {
        id: 'fd-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'A student group spends GH¢ 320.00 (Cost Price) making snacks and sells them all for GH¢ 400.00 (Selling Price). What is their exact percentage profit?',
        options: [
          '80%, because GH¢ 400 minus GH¢ 320 equals 80',
          '20%, because Profit (GH¢ 80) is divided by Selling Price (GH¢ 400)',
          '25%, because Profit (GH¢ 80) is divided by Cost Price (GH¢ 320)',
        ],
        correctIndex: 2,
      },
      {
        id: 'fd-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Using standard spreadsheet operator precedence, what value will the formula =10+6*2 display in a cell?',
        options: [
          '22, because multiplication (6 * 2 = 12) is performed before addition (10 + 12)',
          '32, because calculation is evaluated strictly left to right',
          '18, because addition cancels multiplication',
        ],
        correctIndex: 0,
      },
      {
        id: 'fd-s1',
        type: 'sequencing',
        prompt: 'Put the steps of the enterprise project in the correct order.',
        items: [
          'Wash hands, wear caps, and scale the 20-pie recipe up in ratio 1 : 4.',
          'Enter ingredient quantities and prices into a spreadsheet with =B2*C2 and =SUM.',
          'Find cost per pie, solve break-even 5x = 320, and check 25% profit.',
          'Sell the covered pies, set aside the GH¢ 320 cost, and record the GH¢ 80 profit.',
        ],
      },
      {
        id: 'fd-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'break-even',
        definition: 'The sales volume where total revenue equals total cost, leaving neither profit nor loss.',
        distractors: [
          'The moment when baking dough rises over the edge of a mixing bowl',
          'A spreadsheet error caused by dividing a cell value by zero',
        ],
      },
    ],
    glossary: [
      {
        word: 'cross-contamination',
        definition: 'The transfer of harmful germs from raw foods to ready-to-eat foods via hands or boards.',
        pages: [1],
      },
      {
        word: 'spreadsheet',
        definition: 'An interactive grid program using rows, columns, and formulas for dynamic calculation.',
        pages: [2, 6],
      },
      {
        word: 'profit',
        definition: 'The financial gain when total selling price exceeds total cost price.',
        pages: [3, 4, 6],
      },
      {
        word: 'break-even',
        definition: 'The point where total revenue equals total cost, resulting in neither profit nor loss.',
        pages: [4],
      },
      {
        word: 'precedence',
        definition: 'The mathematical order of operations determining which calculations evaluate first.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Proposed NaCCA CCP curriculum links: Computing (B7.2.4.1 / B8.2.4.1 / B9.2.4.1 Spreadsheets), Career Technology (B8.1.1.1 Food Hygiene, B8.6.2.1 Small Business), and Mathematics (B8.1.3.1 Percentages & Profit/Loss, B8.2.3.1 Linear Equations).',
      'Budget behind the story: Flour 5 kg × GH¢ 14 = 70; Margarine 2 kg × GH¢ 37 = 74; Minced beef 1.8 kg × GH¢ 80 = 144 (45%); Charcoal and packaging = 32 (10%); total in D6 = GH¢ 320.',
      'BECE High-Frequency Error Guardrail: Directly prevents omitting the leading equals sign (=) in formulas and dividing profit by selling price instead of cost price.',
    ],
    reviewQuestions: [
      'Confirm all spreadsheet syntax (=B2*C2, =SUM(D2:D5)) and percentage profit arithmetic ((80 ÷ 320) × 100% = 25%).',
      'Check that food-hygiene steps reflect NaCCA Career Technology Strand 1 standards.',
    ],
    guide: {
      overview:
        'Unites Career Technology food production and costing with Computing spreadsheet modelling and BECE commercial arithmetic (ratios, linear break-even equations, and profit percentage on cost price).',
      lessonMinutes: 45,
      goals: [
        'Write dynamic spreadsheet formulas using =, cell references, and functions.',
        'Scale ingredient quantities accurately using ratios and enforce cross-contamination rules.',
        'Calculate percentage profit on cost and solve linear equations to find break-even sales.',
      ],
      subjects: [
        ['Computing (NaCCA CCP B7.2.4.1 / B8.2.4.1)', 'Electronic Spreadsheets: Cell references, formulas, functions, and charts'],
        ['Career Technology (NaCCA CCP B8.1.1.1, B8.6.2.1)', 'Food hygiene, portion control, costing, and small business management'],
        ['Mathematics (NaCCA CCP B8.1.3.1, B8.1.4.1, B8.2.3.1)', 'Percentages (profit/loss), ratios, and linear equations'],
      ],
      before: ['Write =4+3*2 and =(4+3)*2 on the board: ask learners what a spreadsheet will display in each cell and why.'],
      during: ['Pause on Page 3 and emphasise why GH¢ 80 profit on GH¢ 320 cost is 25%, NOT 20%.'],
      after: ['Build the exact 6-row meat-pie budget in Microsoft Excel, LibreOffice Calc, or Google Sheets and test changing flour prices.'],
      discussion: ['Why do many small food businesses run out of cash when owners spend total sales revenue without separating initial Cost Price capital?'],
      reflection: ['How can accurate weighing and spreadsheet tracking prevent waste in a family or school enterprise?'],
      maths: [
        {
          task: 'A recipe for 20 meat pies requires 1,250 g of flour and 500 g of margarine. How many kilograms of flour and margarine are required to bake 100 meat pies?',
          answer: 'Scale factor = 100 ÷ 20 = 5. Flour = 1,250 g × 5 = 6,250 g = 6.25 kg. Margarine = 500 g × 5 = 2,500 g = 2.5 kg.',
        },
      ],
      support: ['Provide a paper 4×6 spreadsheet grid labelled Columns A to D and Rows 1 to 6 so learners trace cell coordinates visually before typing.'],
      stretch: ['With total sales entered in cell D8, add the logical formula =IF(D8>D6, "PROFIT", "LOSS") to display enterprise status automatically.'],
      localise: ['Substitute local snacks familiar to your school (e.g., bofrot, baked chips, kulikuli, or fresh zomkom/sobolo).'],
      factCheck: ['To be checked against official NaCCA CCP Computing B8.2.4, Career Technology B8.1.1 & B8.6.2, and Mathematics B8.1.3 to B8.2.3.'],
    },
  }),

  // 2
  mk({
    key: 'triangles-under-the-canteen-roof',
    title: 'Triangles Under the Workshop Roof',
    summary:
      'When donated computer benches wobble dangerously in the JHS ICT room, Kwabena, Efua, and Asana combine Career Technology triangulation and seasoned timber with Pythagoras’ theorem, a 1 : 10 scale drawing, and Computing ergonomics to make the furniture steady and comfortable.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'science', 'school-life'],
    themes: ['technology', 'school', 'health-and-wellbeing'],
    objectives: ['reasoning', 'problem-solving', 'scientific-curiosity', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'woodwork-design', 'digital-health'],
    wpm: 125,
    paceWord: 'Practical, hands-on, and precise',
    palette: ['#92400e', '#1d4ed8'],
    voice:
      'Keen, practical teen voices for Kwabena, Efua, and Asana; steady master-craftsman voice for Mr Mensah-Bonsu',
    characters: [
      'Kwabena: a fourteen-year-old JHS 3 student wearing safety goggles and a workshop apron, holding a steel rule and try-square.',
      'Efua: his classmate holding a 1 : 10 orthographic scale drawing on graph paper with a compass and ruler.',
      'Asana: their classmate testing computer-desk posture and screen height in the ICT lab.',
      'Mr Mensah-Bonsu: the Career Technology woodwork and technical-drawing teacher.',
    ],
    music: 'Rhythmic woodblock and acoustic guitar pulse suggesting craftsmanship and geometric precision (placeholder)',
    pages: [
      pg(
        '🪑',
        'Two wooden computer benches had been donated to the JHS ICT room. Now they swayed sideways whenever students sat down to type. Taller learners also complained of aching wrists and stiff necks after double periods. In the Career Technology workshop, Kwabena, Efua, and Asana put on safety goggles, closed shoes, and aprons, and inspected the loose joints with Mr Mensah-Bonsu. “There are two faults,” the teacher said. “First, this timber was used green, before seasoning. As it dried, it shrank and warped. Second, look at the frame. It is a plain rectangle with nothing across it. Push it sideways and it leans over into a parallelogram.”',
        'Inside a well-ordered JHS Career Technology workshop, students in goggles and aprons examine a leaning rectangular wooden bench frame that is tilting sideways under pressure.'
      ),
      pg(
        '🔺',
        'Mr Mensah-Bonsu pinned four cardboard strips into a rectangle. One push, and it folded flat. Then he pinned three strips into a triangle. However hard the students pushed, it kept its shape. “A triangle cannot change shape unless one of its sides changes length,” he explained. “So we add a diagonal strut to a rectangular frame and turn it into two triangles. That is called triangulation. You will see it in roof trusses and bridges. And we use timber only after proper seasoning, so that it will not shrink later and split the joints.”',
        'Mr Mensah-Bonsu demonstrating a floppy four-strip cardboard rectangle collapsing beside a rigid three-strip triangle and a timber roof-truss model.'
      ),
      pg(
        '📏',
        'Before anyone touched a saw, Efua made a scale drawing. Her scale was 1 : 10, so one centimetre on paper stood for ten centimetres of real timber. The space between the bench legs was a rectangle, 60 cm wide and 80 cm high. Kwabena needed the length of the diagonal strut. Efua opened her Mathematics jotter. “The strut is the longest side of a right-angled triangle, so we use Pythagoras’ theorem,” she said. “c² = a² + b² = 60² + 80² = 3,600 + 6,400 = 10,000. The square root of 10,000 is 100. The strut is 100 cm long.” On her drawing, she ruled it exactly 10 cm.',
        'Close-up gouache view of Efua’s graph-paper technical drawing at scale 1:10 showing a 60 cm by 80 cm right-angled bench frame with the 100 cm diagonal brace calculated via a² + b² = c².'
      ),
      pg(
        '🖥️',
        'Meanwhile, Asana studied the health and safety notes from Computing. “Bad posture at a computer can lead to backache, eye strain, and Repetitive Strain Injury, or RSI,” she reported. “Fitting the workplace to the body is called ergonomics.” She measured volunteer classmates at a desk and listed the rules. Feet flat on the floor. Knees and elbows bent at about 90 degrees. Wrists straight, not bent up against the desk edge. The top of the monitor at eye level or slightly below, about an arm’s length away. And the screen turned away from window glare.',
        'Clear ergonomic diagram in the ICT room showing Asana seated upright with 90-degree elbow and knee angles, flat feet, and horizontal eye line meeting the top of the monitor.'
      ),
      pg(
        '🪚',
        'Now came the workshop rule: measure twice, cut once. Kwabena measured the strut along a length of seasoned timber with a steel rule. He checked the right angles with a try-square and marked the ends to fit the joints. He clamped the wood firmly in the bench vice, kept his fingers clear of the blade, and sawed on the waste side of the line. The group fixed each strut with wood glue and screws. Efua then worked out the area of the tabletop, 1.5 m × 0.6 m = 0.9 m², so that they could buy enough varnish and waste none.',
        'Kwabena in safety goggles clamping seasoned timber securely in a bench vice, checking a 90-degree corner with a steel try-square before sawing cleanly.'
      ),
      pg(
        '🌟',
        'Asana used Desktop Publishing software to design a poster, “Healthy Posture and Good Workshop Craft”, and hung it beside the repaired benches. On Monday morning, three students sat down together. Thanks to triangulation, nothing swayed. New monitor stands lifted every screen to a comfortable height. The benches were braced, sanded smooth, and varnished. Geometry, good materials, and ergonomics had done the job together.',
        'Bright JHS computer laboratory showing three students typing comfortably with upright posture at rock-solid diagonally braced wooden desks beside Asana’s illustrated ergonomics wall poster.'
      ),
    ],
    activities: [
      {
        id: 'tr-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why do carpenters add a diagonal brace (triangulation) to a rectangular frame?',
        options: [
          'Adding diagonal braces removes all gravitational weight from a desk',
          'Triangles make green unseasoned timber dry out instantly without shrinking',
          'A triangle cannot change shape unless a side changes length, stopping sway',
        ],
        correctIndex: 2,
      },
      {
        id: 'tr-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'A rectangular frame is 90 cm wide by 120 cm high. Using Pythagoras’ theorem (a² + b² = c²), how long is its diagonal brace?',
        options: [
          '150 cm (since 90² + 120² = 22,500, and √22,500 = 150)',
          '210 cm (by adding 90 cm + 120 cm directly)',
          '30 cm (by subtracting 90 cm from 120 cm)',
        ],
        correctIndex: 0,
      },
      {
        id: 'tr-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Which workstation setup follows good ergonomics and helps prevent RSI and back strain?',
        options: [
          'Monitor placed high with bright sunlight shining directly off screen',
          'Elbows/knees at 90°, feet flat, wrists straight, screen at eye level',
          'Sitting hunched with wrists bent sharply against a sharp table edge',
        ],
        correctIndex: 1,
      },
      {
        id: 'tr-s1',
        type: 'sequencing',
        prompt: 'Put the design-and-make steps in the correct workshop order.',
        items: [
          'Investigate structural problem and select seasoned timber.',
          'Draw 1 : 10 scale plan and calculate diagonal brace using Pythagoras.',
          'Measure with steel rule, check 90° with try-square, and clamp in vice.',
          'Cut, assemble triangulated joints, and apply protective varnish.',
        ],
      },
      {
        id: 'tr-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'ergonomics',
        definition: 'Designing workstations and equipment to fit the human body comfortably and efficiently.',
        distractors: [
          'The chemical seasoning of freshly felled timber inside a kiln',
          'The wireless transmission of files between two network servers',
        ],
      },
    ],
    glossary: [
      {
        word: 'triangulation',
        definition: 'Strengthening a frame by dividing it into rigid triangles using diagonal struts.',
        pages: [2, 6],
      },
      {
        word: 'seasoning',
        definition: 'Controlled drying of timber to reduce moisture and prevent warping or splitting.',
        pages: [1, 2],
      },
      {
        word: 'strut',
        definition: 'A structural piece designed to resist pressure in the direction of its length.',
        pages: [2, 3, 5],
      },
      {
        word: 'try-square',
        definition: 'An L-shaped measuring tool used in woodwork to test and mark accurate 90° right angles.',
        pages: [5],
      },
      {
        word: 'ergonomics',
        definition: 'Designing workstations to prevent musculoskeletal strain and injury.',
        pages: [4, 6],
      },
    ],
    culturalNotes: [
      'Proposed NaCCA CCP curriculum links: Career Technology (B8.1.2.1 Workshop Safety, B8.2.2.1 Timber Seasoning, B8.3.1.1 Measuring, B8.4.1.1 Triangulation, B8.5.1.1 Drawing), Mathematics (B8.1.4.1 Scale Ratios, B8.3.1.2 Pythagoras’ Theorem), and Computing (B7.1.3.1 Ergonomics).',
      'Workshop Safety Guardrail: Learners wear eye protection and closed footwear, clamp workpieces in a bench vice, and work under teacher supervision.',
    ],
    reviewQuestions: [
      'Verify the 60-80-100 cm and 90-120-150 cm Pythagorean triples and the 1 : 10 scale conversion (100 cm real = 10 cm drawn).',
      'Confirm try-square vs steel rule tool functions match NaCCA Career Technology Strand 3.',
    ],
    guide: {
      overview:
        'Connects abstract BECE geometry (Pythagoras’ theorem, scale ratios, surface area) directly to Career Technology structural triangulation, timber seasoning, precision marking-out tools, and Computing workstation ergonomics.',
      lessonMinutes: 45,
      goals: [
        'Explain why triangulated frames resist deformation and why timber is seasoned.',
        'Use Pythagoras’ theorem (a² + b² = c²) and 1 : 10 scale ratios to calculate structural braces.',
        'Select correct workshop marking-out tools and demonstrate healthy ICT workstation ergonomics.',
      ],
      subjects: [
        ['Career Technology (NaCCA CCP B8.2.2, B8.3.1, B8.4.1)', 'Seasoned timber, marking-out tools, and structural triangulation'],
        ['Mathematics (NaCCA CCP B8.1.4.1, B8.3.1.2)', 'Scale ratios, Pythagoras’ theorem, and surface area'],
        ['Computing (NaCCA CCP B8.1.3.1, B8.2.3.1)', 'ICT health/ergonomics (RSI prevention) and Desktop Publishing'],
      ],
      before: ['Build a quick 4-stick pin-jointed square and a 3-stick triangle using paper strips and split pins; let students push both!'],
      during: ['Pause on Page 3 to verify why 60² + 80² = 10,000 gives a 100 cm brace, and why adding 60 + 80 = 140 cm would never fit.'],
      after: ['Audit your school ICT chairs/desks for ergonomic angles and draw a 1 : 10 scale elevation of one desk bay with a diagonal brace.'],
      discussion: ['Where can you spot triangulation right now in pylon towers, Adomi Bridge trusses, bicycle frames, or market roof rafters?'],
      reflection: ['How does "measure twice, cut once" save money, timber, and time in engineering?'],
      maths: [
        {
          task: 'On a 1 : 20 technical drawing, a wooden workbench top measures 9 cm long by 3.5 cm wide. Find its actual length and width in metres, and calculate its real top surface area in m².',
          answer: 'Actual length = 9 cm × 20 = 180 cm = 1.8 m. Actual width = 3.5 cm × 20 = 70 cm = 0.7 m. Area = 1.8 m × 0.7 m = 1.26 m².',
        },
      ],
      support: ['Provide pre-cut 3-4-5 right-angled triangle card templates so learners verify a² + b² = c² visually by counting grid squares.'],
      stretch: ['Distinguish between struts (members resisting compression) and ties (members resisting tension) inside a loaded roof truss.'],
      localise: ['Reference familiar Ghanaian timbers (Odum, Mahogany, Wawa, Teak) and inspect roof trusses in your school assembly hall.'],
      factCheck: ['To be checked against official NaCCA CCP Career Technology B8.2.2 to B8.5.1, Mathematics B8.3.1, and Computing B8.1.3.'],
    },
  }),

  // 3
  mk({
    key: 'the-sensor-in-the-seedbed',
    title: 'The Sensor in the Seedbed',
    summary:
      'To stop the school’s pepper seedlings wilting over long weekends without wasting water, JHS 3 innovators Dzifa, Sugri, and Kweku design a flowchart algorithm, wire a safe low-voltage soil-moisture kit, work out the volume of a cylindrical drum with V = πr²h, and use the median to ignore a faulty sensor reading.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['science', 'educational', 'school-life'],
    themes: ['technology', 'farm-and-garden', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'problem-solving', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'robotics-and-coding', 'smart-agriculture'],
    wpm: 125,
    paceWord: 'Inventive, logical, and crystal-clear',
    palette: ['#059669', '#4338ca'],
    voice:
      'Enthusiastic, analytical teen voices for Dzifa, Sugri, and Kweku; supportive Computing mentor voice for Sir Acheampong',
    characters: [
      'Dzifa: a fourteen-year-old JHS 3 coder sketching neat flowchart symbols in her Computing jotter.',
      'Sugri: her classmate assembling a 5-volt microcontroller, soil-moisture sensor, and LED indicator circuit.',
      'Kweku: their classmate measuring the radius and height of a blue cylindrical water-storage drum with a tape measure.',
      'Sir Acheampong: the JHS Computing and Robotics club patron.',
    ],
    music: 'Playful marimba ostinato layered with crisp electronic synth plucks evoking smart African innovation (placeholder)',
    pages: [
      pg(
        '🌶️',
        'Every Monday in the dry season, the pepper seedlings in the JHS nursery drooped in dry soil. But when someone left a tap trickling all weekend, the bed flooded and water was wasted. At Friday’s Computing and Career Technology club, Dzifa had an idea. “We have a 5-volt robotics kit. Let us build a waterer that thinks.” She explained the three parts. “A sensor is the input: it measures how wet the soil is. The microcontroller is the brain: it runs our program. And a small pump is the actuator: it does the physical work.”',
        'Beside a school nursery bed of pepper plants, Dzifa, Sugri, and Kweku inspect a 5-volt robotics kit showing a two-prong soil-moisture sensor, a microcontroller board, and mini tubing.'
      ),
      pg(
        '🔀',
        'Sir Acheampong would not let them write any code yet. “First, the algorithm,” he said. “Draw it as a flowchart.” Dzifa used the standard symbols: an oval for Start and Stop, a parallelogram for input and output, a rectangle for a process, and a diamond for a yes-or-no decision. Her flowchart read: Start. Read moisturePercent. Decision: is moisturePercent less than 35? If yes, switch the pump on for 10 seconds. If no, keep it off. Wait 10 minutes, then read again. “One more thing,” Dzifa added. “We need a daily limit, and the pump must stop if the tank is empty. Otherwise one fault could flood the bed.”',
        'Close-up view of Dzifa’s whiteboard flowchart using standard shapes: Oval (START), Parallelogram (INPUT moisture), Diamond (moisture < 35?), and Rectangles (Pump ON / OFF).'
      ),
      pg(
        '🔌',
        'Sugri built the circuit on the battery-powered 5-volt kit, with Sir Acheampong watching. He connected the small pump through a driver circuit, because the microcontroller cannot power a pump directly. Then he added a green light-emitting diode (LED) to show when the pump was running. He put a 220-ohm resistor in series with it, so that too much current would not burn it out. The longer leg of the LED, the positive one, went towards the positive supply. Last, he laid thin tubing along the bed, with a small outlet beside each pepper plant. The water would drip straight to the roots.',
        'Sugri at a Career Technology workbench connecting a green LED in series with a colour-banded resistor on a breadboard alongside neat perforated white PVC drip pipes.'
      ),
      pg(
        '🛢️',
        'Would the drum hold enough water for a three-day weekend? The team estimated 12 litres a day, so they needed 36 litres. Kweku measured inside the drum. The radius was 20 cm, and the water stood 70 cm high. A drum is a cylinder, so he used the formula V = πr²h, taking π as 22/7. V = 22/7 × 20 × 20 × 70 = 88,000 cm³. Since 1,000 cm³ make 1 litre, the drum held 88 litres. That was more than twice what they needed.',
        'Kweku measuring a blue cylindrical water tank on a sturdy stand while writing V = (22/7) x 20² x 70 = 88,000 cm³ = 88 Litres cleanly in his Mathematics notebook.'
      ),
      pg(
        '📊',
        'During testing, Sugri took five quick moisture readings: 31, 32, 32, 33, and 97. The 97 was a glitch. A loose wire had touched wet metal for a moment. “Look what it does to the mean,” said Dzifa. “31 + 32 + 32 + 33 + 97 = 225, and 225 ÷ 5 = 45. The controller would think the dry soil was wet and refuse to water it.” The 97 was an outlier, a value far from all the others. “Use the median instead,” she said. “Put the readings in order and take the middle one: 32. One bad reading cannot move it.” They fixed the wire and programmed the controller to use the median of five readings.',
        'Notebook page comparing five sensor readings [31, 32, 32, 33, 97]: showing Mean = 45% (skewed by outlier 97) versus Median = 32% (accurate middle value triggering irrigation at < 35%).'
      ),
      pg(
        '🌿',
        'On Tuesday morning, after a long holiday weekend, the three friends ran to the nursery. The mark on the drum showed about 52 litres left, so close to 36 litres had been used, just as they had estimated. The log showed short bursts of watering whenever the median reading fell below 35%. Every pepper seedling stood firm and dark green. Sir Acheampong beamed. “The algorithm gave it logic. Career Technology built it safely. And Mathematics sized the tank and caught the faulty reading.”',
        'Vibrant Tuesday morning scene at the JHS pepper nursery showing healthy, glossy green pepper seedlings watered by neat PVC drip tubes beside the cylindrical tank as the students celebrate.'
      ),
    ],
    activities: [
      {
        id: 'ss-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'In a standard Computing flowchart, which geometric symbol represents a conditional Decision such as "Is moisturePercent < 35?"',
        options: [
          'A diamond shape with branches for Yes (True) and No (False)',
          'A rounded oval used only at Start and Stop',
          'A plain straight arrow without any text',
        ],
        correctIndex: 0,
      },
      {
        id: 'ss-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did Sugri connect a 220-ohm resistor in series with the light-emitting diode (LED) on the 5-volt circuit?',
        options: [
          'To convert plastic PVC pipes into copper wires',
          'To limit electric current flowing through the LED so it does not burn out',
          'To increase the voltage from 5 V up to 230 V mains',
        ],
        correctIndex: 1,
      },
      {
        id: 'ss-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'A cylindrical bucket has internal radius r = 14 cm and height h = 50 cm (take π = 22/7, 1,000 cm³ = 1 L). What is its volume in litres?',
        options: [
          '4.4 litres',
          '3,080 litres',
          '30.8 litres (since V = 22/7 × 14 × 14 × 50 = 30,800 cm³ = 30.8 L)',
        ],
        correctIndex: 2,
      },
      {
        id: 'ss-s1',
        type: 'sequencing',
        prompt: 'Put the steps of the smart watering cycle in the correct order.',
        items: [
          'Sensor probes detect five moisture readings from the root zone.',
          'Microcontroller sorts readings and picks median, ignoring outliers.',
          'Conditional rule evaluates whether median moisture is below 35%.',
          'When True, controller switches on indicator LED and mini DC pump.',
        ],
      },
      {
        id: 'ss-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'outlier',
        definition: 'A value that lies far away from the other values in a dataset and can distort the mean.',
        distractors: [
          'The most frequently occurring value (mode) in a set of identical numbers',
          'The vertical height of a right circular cylinder measured in centimetres',
        ],
      },
    ],
    glossary: [
      {
        word: 'algorithm',
        definition: 'A finite, logical step-by-step set of instructions to solve a problem.',
        pages: [2, 6],
      },
      {
        word: 'actuator',
        definition: 'A mechanical output component in a robot that carries out physical action.',
        pages: [1],
      },
      {
        word: 'resistor',
        definition: 'An electrical component that limits current flow in a circuit.',
        pages: [3],
      },
      {
        word: 'median',
        definition: 'The middle value when a dataset is arranged in order, resisting extreme outliers.',
        pages: [5, 6],
      },
      {
        word: 'outlier',
        definition: 'An extreme data point that pulls the arithmetic mean away from typical values.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Proposed NaCCA CCP curriculum links: Computing (B8.4.1.1 Programming, B8.4.2.1 Algorithms & Flowcharts, B8.4.3.1 Robotics), Career Technology (B8.4.1.2 Electronics, B8.3.3.1 PVC Pipes), and Mathematics (B8.3.2.2 Cylinder Volume, B8.4.1.1 Median & Outliers).',
      'BECE Exam Precision: Reinforces standard flowchart geometry, LED series resistors, converting cm³ to litres (÷ 1,000), and choosing median when outliers are present.',
    ],
    reviewQuestions: [
      'Verify cylinder calculation: (22/7) × 20² × 70 = 88,000 cm³ = 88 L, and remaining water 88 − 36 = 52 L.',
      'Check mean ((31+32+32+33+97)/5 = 225/5 = 45) vs median (32) accuracy.',
    ],
    guide: {
      overview:
        'Brings NaCCA Computational Thinking and Robotics alive in a Ghanaian school garden, combining flowchart logic, 5 V LED/sensor electronics, cylinder volume geometry, and statistical outlier handling.',
      lessonMinutes: 45,
      goals: [
        'Draw standard flowchart symbols (oval, parallelogram, rectangle, diamond) for selection loops.',
        'Identify roles of sensors (input), microcontroller (brain), LED + resistor, and actuators (output).',
        'Calculate cylindrical volume in cm³ and convert to litres (1,000 cm³ = 1 L).',
      ],
      subjects: [
        ['Computing (NaCCA CCP B8.4.1.1, B8.4.2.1, B8.4.3.1)', 'Variables, flowcharts, algorithms, and robotics sensors/actuators'],
        ['Career Technology (NaCCA CCP B8.4.1.2, B8.3.3.1)', 'Simple electronic circuits (LED + resistor) and pipe assembly'],
        ['Mathematics (NaCCA CCP B8.3.2.2, B8.4.1.1)', 'Volume of cylinders and choosing mean vs median with outliers'],
      ],
      before: ['Give learners five test scores: 50, 52, 52, 56, and 0 (absent). Ask them to compare mean (42) and median (52).'],
      during: ['Pause on Page 2 and ask learners to sketch the four flowchart shapes and label each meaning.'],
      after: ['Measure any cylindrical tin, cup, or Veronica bucket on campus and compute capacity in litres using V = πr²h.'],
      discussion: ['Even without a physical robotics kit, how does flowchart thinking help us automate routines?'],
      reflection: ['Why is drip irrigation directly to plant roots far wiser during Ghana’s dry season than spraying water across hot bare soil?'],
      maths: [
        {
          task: 'After watering 36 litres out of the 88-litre cylindrical tank (radius r = 20 cm, π = 22/7), 52 litres (52,000 cm³) remain. Find the new height h of water in the drum to 1 decimal place.',
          answer: '52,000 = (22/7) × 400 × h → 52,000 = (8,800/7)h → h = (52,000 × 7) ÷ 8,800 = 364,000 ÷ 8,800 ≈ 41.4 cm.',
        },
      ],
      support: ['Provide cut-out paper flowchart shapes (oval, parallelogram, diamond, rectangle) for groups to arrange on desks before drawing.'],
      stretch: ['Write pseudocode using IF...THEN...ELSE and a WHILE loop matching Dzifa’s flowchart.'],
      localise: ['Use safe 3 V to 6 V battery holders or offline unplugged role-play if microcontrollers are not yet in the lab.'],
      factCheck: ['To be checked against official NaCCA CCP Computing Strand 4 (B8.4.1 to B8.4.3), Career Tech B8.4.1, and Mathematics B8.3.2 & B8.4.1.'],
    },
  }),

  // 4
  mk({
    key: 'never-read-out-the-six-digits',
    title: 'Never Read Out the Six Digits',
    summary:
      'Running a JHS Career Technology sewing and beadwork mini-enterprise with a QR-code catalogue and Mobile Money payments, Pokuaa, Seyram, and Abdul-Aziz stop an OTP scam call and a phishing link, using Information Security principles and probability.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'school-life', 'science'],
    themes: ['technology', 'community', 'school'],
    objectives: ['reasoning', 'problem-solving', 'responsibility', 'vocabulary'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'cybersecurity', 'textiles-and-craft'],
    wpm: 125,
    paceWord: 'Alert, sharp, and practical',
    palette: ['#7c3aed', '#d97706'],
    voice:
      'Confident, alert teen voices for Pokuaa, Seyram, and Abdul-Aziz; smooth, deceptive caller voice contrasted with calm Computing teacher Miss Tetteh',
    characters: [
      'Pokuaa: a fourteen-year-old JHS 3 sewing-group leader wearing a tape measure around her neck, precise and level-headed.',
      'Seyram: her classmate designing a QR-code digital product catalogue on a school tablet.',
      'Abdul-Aziz: their classmate and enterprise bookkeeper, quick with probability and percentages.',
      'Miss Tetteh: the JHS Computing teacher supervising the school’s digital enterprise club.',
    ],
    music: 'Crisp kora-style acoustic plucking with subtle modern digital pulse resolving cleanly (placeholder)',
    pages: [
      pg(
        '🧵',
        'For their Basic 9 Career Technology project, Pokuaa, Seyram, and Abdul-Aziz sewed African-print laptop sleeves and made keyholders from recycled-glass beads. Pokuaa measured each fabric panel with her tape measure and added a seam allowance of 1.5 cm all round. She cut with pinking shears, whose zigzag edge stops cotton from fraying, and pressed every seam flat. For PTA day, Seyram made a QR code. Any parent who scanned it with a phone would see the group’s price list, which could be read but not changed.',
        'In the Career Technology sewing room, Pokuaa measures colourful African-print fabric with a 1.5 cm seam allowance while Seyram tests scanning a printed QR code poster with a school tablet.'
      ),
      pg(
        '📱',
        'Parents ordered twelve laptop sleeves at GH¢ 50.00 each, GH¢ 600.00 in all. They paid into the club’s Mobile Money wallet, which Miss Tetteh supervised. Then the project phone rang. “This is Mobile Money head office!” a man said, speaking very fast. “A wrong reversal of GH¢ 600 is pending on your wallet. A six-digit code has just come to you by SMS. Read it to me now, or tap the link in our message. You have two minutes before your account is blocked!” Seyram froze. On the screen, a six-digit One-Time Password, an OTP, was flashing.',
        'Close-up dramatic gouache scene of the club’s phone displaying an incoming call from an unknown ordinary number alongside an SMS warning: NEVER SHARE YOUR 6-DIGIT OTP WITH ANYONE.'
      ),
      pg(
        '🔐',
        'Pokuaa reached over and ended the call. Not one digit had been read out. “Well done,” said Miss Tetteh. She pointed to the Information Security chart on the wall. “Security rests on three things. Confidentiality: secrets stay secret. Integrity: records are not altered. Availability: systems work when you need them. That caller was attacking confidentiality. An OTP is a key, and he wanted you to hand it over. And the message with the link? That is phishing: a fake message made to trick you into giving up a secret. Do not trust a link just because it begins with https. Scammers use that too. No real provider will ever ask for your PIN or OTP.”',
        'Miss Tetteh points to an Information Security poster showing the CIA Triad (Confidentiality, Integrity, Availability) and the four data threats on a classroom wall.'
      ),
      pg(
        '🎲',
        'Abdul-Aziz had spotted another weakness. Seyram wanted to set the tablet’s four-digit PIN to 2012, the year they were born. He opened his Mathematics exercise book. “Think about probability,” he said. “A thief who knows our ages will try birth years first. If there are four likely years, the first guess has a 1 in 4 chance. But a random four-digit PIN can be anything from 0000 to 9999. That is 10,000 possibilities, so one guess has a 1 in 10,000 chance. A six-digit code has a million possibilities. That is exactly why a scammer cannot guess an OTP. He has to trick you into telling him.”',
        'Abdul-Aziz writing clean probability fractions on the board comparing a predictable birth-year PIN (1/4) vs a random 4-digit PIN (1/10,000) vs a 6-digit OTP (1/1,000,000).'
      ),
      pg(
        '🧾',
        'The group checked the wallet in the official app. No money had left. Then they balanced their records. One parent had bought four sleeves and earned a 5% bulk discount. Four sleeves at GH¢ 50 came to GH¢ 200, and 5% of GH¢ 200 is GH¢ 10, so she paid GH¢ 190. Total collections were therefore GH¢ 590, not GH¢ 600. The service charge was 1% of GH¢ 590, which is GH¢ 5.90. Abdul-Aziz checked every pesewa until the ledger matched the wallet. “That is integrity,” said Miss Tetteh. “Records you can trust.”',
        'Pokuaa, Seyram, and Abdul-Aziz checking off fabric receipts, calculating a 5% bulk discount and 1% service charge cleanly in their enterprise cashbook.'
      ),
      pg(
        '🛡️',
        'Before closing, the group added a bright safety box beside the QR code on their banner. It read: “Never share your PIN or OTP with any caller or in any message. Do not open payment links you were not expecting. Check your balance only in the official app or with the official short code. Report suspicious calls to a trusted adult or to your provider.” Parents bought the last bead keyholders. Many also photographed the safety box to show their families. Good craft had earned the money. Clear thinking kept it safe.',
        'Busy PTA exhibition stand displaying neat African-print laptop sleeves, beaded keyholders, a QR-code standee, and parents reading the students’ Mobile Money Cybersecurity Poster.'
      ),
    ],
    activities: [
      {
        id: 'nr-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'In Information Security, what are the three parts of the CIA triad?',
        options: [
          'Calculators, Internet, and Algorithms',
          'Confidentiality, Integrity, and Availability',
          'Copying, Intercepting, and Altering',
        ],
        correctIndex: 1,
      },
      {
        id: 'nr-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'The caller wanted Seyram to read out the OTP. Which part of the CIA triad was he attacking?',
        options: [
          'Confidentiality, because an OTP is a secret only its owner should know',
          'Availability, because the tablet battery was low',
          'Integrity, because the price list could not be edited',
        ],
        correctIndex: 0,
      },
      {
        id: 'nr-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Every digit of a random 4-digit PIN is 0 to 9 (10,000 combinations). What is the chance of guessing it in one attempt?',
        options: [
          '4 / 10 (or 0.40)',
          '1 / 4 (or 0.25)',
          '1 / 10,000 (or 0.0001)',
        ],
        correctIndex: 2,
      },
      {
        id: 'nr-s1',
        type: 'sequencing',
        prompt: 'Put the safe verification steps in order when you receive a suspicious payment-reversal call or SMS.',
        items: [
          'Pause: do NOT panic, click links, or read out any PIN or 6-digit OTP.',
          'Hang up the suspicious call and inspect sender number carefully.',
          'Check wallet balance independently using official shortcode or app.',
          'Report and block fraudulent number through telecom fraud helpline.',
        ],
      },
      {
        id: 'nr-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'phishing',
        definition: 'A cyberattack using disguised messages to trick victims into revealing confidential passwords or PINs.',
        distractors: [
          'Cutting fabric edges with pinking shears to prevent fraying',
          'Generating a barcode to display read-only library titles',
        ],
      },
    ],
    glossary: [
      {
        word: 'seam',
        definition: 'The stitched line joining two pieces of fabric together.',
        pages: [1],
      },
      {
        word: 'confidentiality',
        definition: 'Ensuring sensitive data is accessed only by authorised persons.',
        pages: [3],
      },
      {
        word: 'phishing',
        definition: 'Fraudulent attempts via fake links or calls to steal credentials or money.',
        pages: [3],
      },
      {
        word: 'probability',
        definition: 'A numerical measure from 0 to 1 expressing the likelihood that an event will occur.',
        pages: [4],
      },
      {
        word: 'pesewa',
        definition: 'The Ghanaian currency coin unit (100 pesewas equal 1 Ghana Cedi).',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Proposed NaCCA CCP curriculum links: Computing (B8.1.1.1 QR Codes, B8.3.3.1 Information Security (CIA Triad), Career Technology (B8.2.1 Textiles, B8.6.2 Enterprise), and Mathematics (B8.4.2.1 Probability, B8.1.3.1 Percentages & Discounts).',
      'Ghana Cyber Security Authority (CSA) Relevance: Directly addresses Mobile Money social-engineering OTP scams and fake reversal messages targeting youth enterprises.',
    ],
    reviewQuestions: [
      'Verify exact NaCCA Information Security terminology: Confidentiality, Integrity, Availability.',
      'Check discount and fee arithmetic: 5% of GH¢ 200 = GH¢ 10 (net GH¢ 190); 1% of GH¢ 590 = GH¢ 5.90; probability = 1/10,000.',
    ],
    guide: {
      overview:
        'Links Career Technology textile craft and enterprise bookkeeping with NaCCA Computing Information Security (CIA triad, QR codes, phishing defence) and BECE Probability & Commercial Percentages.',
      lessonMinutes: 45,
      goals: [
        'Explain the CIA Triad (Confidentiality, Integrity, Availability) and recognise phishing traps.',
        'Protect PINs and 6-digit OTPs from social-engineering attacks.',
        'Calculate simple probabilities for PIN guessing and compute trade discounts and fees.',
      ],
      subjects: [
        ['Computing (NaCCA CCP B7.3.3.1, B8.3.3.1, B8.1.1.1)', 'Information Security (CIA triad, phishing) & QR codes'],
        ['Career Technology (NaCCA CCP B8.2.1.1, B8.3.3.1, B8.6.2.1)', 'Compliant textile fabrication, seam allowance, and enterprise sales'],
        ['Mathematics (NaCCA CCP B8.4.2.1, B8.1.3.1)', 'Probability of code combinations, percentage discounts, and fees'],
      ],
      before: ['Write two URLs on the board: https://example.com and http://example.invalid/free-bonus, and ask students to spot warning signs.'],
      during: ['Pause on Page 3 to match real examples to CIA Triad pillars.'],
      after: ['Calculate how much fabric is needed to sew a laptop sleeve when seam allowance is added to every side.'],
      discussion: ['Why do scammers always try to create panic ("within two minutes!") during phone attacks?'],
      reflection: ['Without revealing your real PIN, check silently: is any password you use based on a birthday or 1234?'],
      maths: [
        {
          task: 'A padlock uses 3 dials, each numbered 0 to 9. How many total combinations exist, and what is the probability of opening it on one random guess?',
          answer: '10 × 10 × 10 = 1,000 combinations; P = 1/1,000.',
        },
      ],
      support: ['Use a physical 3-column chart matching CIA Triad pillars to everyday school scenarios.'],
      stretch: ['Explain how Two-Factor Authentication (2FA) combines something you know with something you have.'],
      localise: ['Reference the Ghana Cyber Security Authority’s current official advisories.'],
      factCheck: ['To be checked against official NaCCA CCP Computing B7.3.3/B8.3.3, Career Technology B8.2.1/B8.6.2, and Mathematics B8.4.2.'],
    },
  }),

  // 5
  mk({
    key: 'star-hub-on-bearing-053',
    title: 'The Star Switch on Bearing 053°',
    summary:
      'When a chewed single backbone cable knocks out every computer in the old JHS block, Kobby, Sena, and Hamdia redesign the school Local Area Network from a fragile Bus topology to a central Star topology, using column vectors, three-figure bearings, and weatherproof PVC conduit trunking to link the library cleanly.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'science', 'school-life'],
    themes: ['technology', 'school', 'community'],
    objectives: ['reasoning', 'problem-solving', 'scientific-curiosity', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'networking', 'technical-craft'],
    wpm: 125,
    paceWord: 'Crisp, spatial, and methodical',
    palette: ['#1e40af', '#ca8a04'],
    voice:
      'Focused, analytical teen voices for Kobby, Sena, and Hamdia; clear technical voice for ICT technician Uncle Fiifi',
    characters: [
      'Kobby: a fourteen-year-old JHS 3 student holding a magnetic compass, protractor, and campus grid map.',
      'Sena: his classmate crimping low-voltage RJ45 Ethernet plugs beside an 8-port network switch.',
      'Hamdia: their classmate in Career Technology goggles measuring rigid grey PVC conduit pipes and saddle clips.',
      'Uncle Fiifi: the district education office ICT network technician.',
    ],
    music: 'Steady marimba pulse with clean acoustic guitar harmonics suggesting precision mapping and connection (placeholder)',
    pages: [
      pg(
        '🖧',
        'Ten minutes before Basic 8’s mock digital quiz, every desktop in the ICT room lost connection to the local offline learning server at once! Tracing the dusty skirting board with Uncle Fiifi, Sena found where a mouse had chewed through one shared cable near Door 1. “This old setup used a Bus topology, where all nodes share a single central backbone cable,” Uncle Fiifi explained. “Its biggest weakness is that a single break in the main bus brings the entire Local Area Network (LAN) down! Upgrading to a Star topology gives every computer, as well as the library block, its own dedicated twisted-pair cable running into a central network switch.”',
        'Inside a Ghanaian JHS computer lab, Uncle Fiifi holds up a chewed grey backbone cable while Sena points to a chalkboard diagram contrasting Bus Topology with Star Topology.'
      ),
      pg(
        '🧭',
        'To link the library reading corner to the ICT room’s new central switch, Kobby plotted both buildings on a campus coordinate grid scaled in metres where the Y-axis pointed due North. From the ICT switch at origin I(0, 0), the library terminal L lay 24 metres East and 18 metres North, giving displacement vector IL = (24, 18), which can be written as a column vector with 24 above 18! Using vector magnitude (Pythagoras’ theorem), Kobby found the straight-line distance: |IL| = √(24² + 18²) = √(576 + 324) = √900 = 30 metres. Calculating clockwise from North, Kobby used tan⁻¹(24 ÷ 18) ≈ 53.1°, which rounds to 53°, written as a three-figure bearing: 053°!',
        'Close-up view of campus coordinate grid showing North at 000°, ICT Room at (0,0), Library at (24 m East, 18 m North), straight path 30 m, and clockwise angle marked 053°.'
      ),
      pg(
        '🔄',
        'Hamdia tested Kobby’s BECE geometry with a sharp follow-up question: “If the bearing of the Library from the ICT switch is 053°, what is the back-bearing of the ICT switch from the Library when we sight back along the straight line between the buildings?” Drawing a second North arrow at point L and using alternate interior angles, Kobby added 180° to 053°: “180° + 53° = 233°! Whenever a forward bearing is less than 180°, you add 180° to find the reverse bearing, and you always measure clockwise from North, never from East or South.”',
        'Clear geometric diagram on graph paper showing two parallel North arrows at points I and L, illustrating forward bearing 053° and clockwise back-bearing 233°.'
      ),
      pg(
        '🛠️',
        'Rather than stringing bare Cat6 cable across the sunny courtyard where footsteps, rainwater, and rodents would ruin it, and without digging straight through a flowerbed, the team followed the paved L-shaped walkway (24 m East + 18 m North = 42 m along the walls, plus 6 m of vertical cable allowances = 48 m of cable). The wall-mounted conduit covered the 42 m walkway route, while the remaining 6 m allowed for cable drops inside the buildings. Using Career Technology skills, Hamdia planned rigid UV-resistant PVC conduit in 3-metre lengths (42 ÷ 3 = 14 straight pipe lengths, with suitable bends and fittings counted separately), cut square ends cleanly with a fine-toothed junior hacksaw, smoothed burrs with abrasive paper so sharp plastic edges would not scrape cable insulation, and installed suitable inspection bends following the manufacturer’s instructions.',
        'Along a shaded school veranda wall, Hamdia in safety goggles fits neat grey PVC conduit pipes with saddle clips and smooth 90-degree inspection elbows using a spirit level.'
      ),
      pg(
        '🔌',
        'Back inside, Uncle Fiifi explained why their Star LAN used a network switch rather than an old hub or a wide-area router alone. “A switch learns the hardware MAC addresses of each computer and learns connected devices’ MAC addresses and normally forwards Ethernet frames to the appropriate port, reducing unnecessary traffic compared with a hub,” he noted. “Later, when the school connects this LAN to the wider internet, known as a Wide Area Network (WAN), a router and firewall will sit at the gateway between our switch and the outside world.” Under Uncle Fiifi’s supervision, Sena terminated the low-voltage Ethernet connectors correctly and checked them with a cable tester and clicked each cable into the switch.',
        'Close-up detailed scene of Sena clicking colour-coded Cat6 RJ45 plugs into an 8-port Ethernet switch with green blinking link LEDs inside a ventilated wall cabinet.'
      ),
      pg(
        '🌟',
        'After the technician checked the installation and powered up the central switch, crisp green link lights blinked across all ports from Lab PC 1 right out to the Library terminal on bearing 053°. Even when Uncle Fiifi unplugged PC 2’s patch cord as a fault test, every other computer and the library catalogue stayed online without a flicker! Labelling each conduit run neatly on their campus network map, the trio saw how Star topology, vector geometry, and protective Career Tech trunking build infrastructure that lasts.',
        'Students in both the ICT lab and the bright school library accessing the offline digital textbook server simultaneously while Kobby pins the signed Campus LAN & Bearing Map on the wall.'
      ),
    ],
    activities: [
      {
        id: 'sh-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why did upgrading the computer lab to a Star topology make the network more reliable against cable damage?',
        options: [
          'Each node has its own cable to the switch, isolating cable breaks',
          'A Star topology uses zero cables and requires no switch or electricity',
          'A Bus topology continues working faster whenever its main cable is cut',
        ],
        correctIndex: 0,
      },
      {
        id: 'sh-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'The bearing of Library (L) from ICT (I) is 053°. What is the three-figure back-bearing of I from L?',
        options: [
          '233° (found by adding 180° to 053°, measured clockwise from North at L)',
          '53° (written with two digits and measured anti-clockwise from South)',
          '127° (found by subtracting 53° from 180°)',
        ],
        correctIndex: 0,
      },
      {
        id: 'sh-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What is the key advantage of a network switch over a simple hub inside a Star LAN?',
        options: [
          'A switch forwards frames to destination ports rather than repeating to all',
          'A switch converts alternating current into plastic conduit pipes',
          'A hub blocks all local computers from communicating with a file server',
        ],
        correctIndex: 0,
      },
      {
        id: 'sh-s1',
        type: 'sequencing',
        prompt: 'Put the campus LAN installation workflow in the correct engineering order.',
        items: [
          'Map building coordinates, compute displacement vector, bearings, and length.',
          'Measure, cut, deburr, and mount protective PVC conduit trunking along walls.',
          'Draw Cat6 data cable through conduit; terminate and test connectors.',
          'Connect node cables into the central switch and test fault isolation.',
        ],
      },
      {
        id: 'sh-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'switch',
        definition: 'A central network device that connects multiple computers and forwards data frames using MAC addresses.',
        distractors: [
          'A magnetic needle that points toward geographic North',
          'A fine-toothed junior hacksaw used for cutting plastic pipe',
        ],
      },
    ],
    glossary: [
      {
        word: 'topology',
        definition: 'The layout showing how computers and network devices are interconnected.',
        pages: [1, 6],
      },
      {
        word: 'switch',
        definition: 'A central LAN device that connects nodes and forwards frames using MAC addresses.',
        pages: [1, 5, 6],
      },
      {
        word: 'bearing',
        definition: 'A direction angle measured clockwise from North, written with three digits.',
        pages: [2, 3, 6],
      },
      {
        word: 'vector',
        definition: 'A quantity having both magnitude and direction, represented on a coordinate plane.',
        pages: [2, 6],
      },
      {
        word: 'conduit',
        definition: 'Protective tubing installed along walls to shield cables from moisture and damage.',
        pages: [4, 6],
      },
    ],
    culturalNotes: [
      'Proposed CCP curriculum links: Computing (B8.3.1.1 Networks: LAN/WAN, Star/Bus, switch, router), Mathematics (B8.3.1.3 Bearings and Vectors), and Career Technology (B8.3.2/B8.3.3 Cutting, Joining PVC Conduit).',
      'BECE Geometry Guardrail: Reinforces writing angles under 100° with a leading zero (053°) and measuring clockwise from North.',
      'Safety Note: Students handle low-voltage data cables; mains 230 V wiring remains under certified electrician supervision.',
    ],
    reviewQuestions: [
      'Verify vector magnitude √(24² + 18²) = √900 = 30 m, and back-bearing 053° + 180° = 233°.',
      'Confirm accurate distinction between Star single-cable fault tolerance vs central-switch dependency.',
    ],
    guide: {
      overview:
        'Unites NaCCA Computing network topologies and hardware (LAN vs WAN, Bus vs Star, Switch vs Router) with BECE three-figure bearings, column vectors, and Career Technology PVC conduit installation.',
      lessonMinutes: 45,
      goals: [
        'Compare Bus and Star topologies, identifying advantages and failure points.',
        'Express displacements as column vectors and find forward and reverse three-figure bearings.',
        'Calculate required lengths of PVC conduit trunking and explain deburring.',
      ],
      subjects: [
        ['Computing (NaCCA CCP B8.3.1.1 / B9.3.1.1)', 'Computer Networks: LAN/WAN, Star vs Bus topologies, switches, and routers'],
        ['Mathematics (NaCCA CCP B8.3.1.3 / B9.3.3.1)', 'Three-figure bearings, back-bearings, column vectors, and magnitude'],
        ['Career Technology (NaCCA CCP B8.3.2.1, B8.3.3.1)', 'Measuring, cutting, deburring, and fixing PVC protective conduit'],
      ],
      before: ['Have five students hold one long string in a line (Bus) versus five strings meeting at one central student (Star).'],
      during: ['Pause on Page 2: Ask why 53° loses marks in BECE bearings unless written 053°.'],
      after: ['Use a compass and tape measure in the school compound to record the bearing to the library.'],
      discussion: ['Why was routing 48 m of conduit neatly under veranda eaves smarter engineering than stringing a bare wire across the open sun?'],
      reflection: ['How do offline school LAN servers help Ghanaian schools share digital textbooks even without expensive internet?'],
      maths: [
        {
          task: 'If forward bearing of Town B from Town A is 215°, calculate back-bearing of Town A from Town B.',
          answer: 'Since 215° > 180°, subtract 180°: 215° − 180° = 035° (with leading zero).',
        },
      ],
      support: ['Provide transparent 360° protractors with 000° N highlighted in red at top.'],
      stretch: ['Add two consecutive vectors AB = (24, 18) and BC = (−9, 12) to find resultant AC = (15, 30).'],
      localise: ['Map actual blocks on your own JHS compound.'],
      factCheck: ['Provisional mapping; verify against current official NaCCA CCP Computing B8.3.1, Mathematics B8.3.1, and Career Technology.'],
    },
  }),

  // 6
  mk({
    key: 'the-crop-app-that-missed-cassava',
    title: 'The Crop App That Missed Cassava',
    summary:
      'Testing a free smartphone Artificial Intelligence leaf-scanner at their town’s cassava-gari cooperative, JHS 3 students Afia, Bature, and Mawuli discover why foreign training data caused the AI to misdiagnose Ghanaian cassava mosaic, using stratified data collection and 360° pie charts to retrain a fair local model.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['science', 'educational', 'school-life'],
    themes: ['technology', 'farm-and-garden', 'food'],
    objectives: ['scientific-curiosity', 'reasoning', 'problem-solving', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'artificial-intelligence', 'agro-processing'],
    wpm: 125,
    paceWord: 'Curious, investigative, and clear',
    palette: ['#15803d', '#7c2d12'],
    voice:
      'Inquisitive teen voices for Afia, Bature, and Mawuli; warm, insightful Computing teacher voice for Madam Adomako',
    characters: [
      'Afia: a fourteen-year-old JHS 3 student holding a school tablet, sharp on data ethics and statistics.',
      'Bature: her classmate holding a protractor, compass, and tally sheet beside cassava leaves.',
      'Mawuli: their classmate wearing a clean agro-processing apron beside stainless-steel gari-roasting equipment.',
      'Madam Adomako: the JHS Computing and Artificial Intelligence club mentor.',
    ],
    music: 'Warm acoustic highlife guitar blended with gentle kalimba pulses evoking curiosity and discovery (placeholder)',
    pages: [
      pg(
        '🌿',
        'At a women’s gari-processing cooperative near Assin Foso, Mawuli’s aunties knew that good gari starts with sound cassava roots and careful processing: hygienic peeling, washing, grating, controlled fermentation and pressing to help reduce naturally occurring cyanogenic compounds, sieving, and thorough roasting. Fortification, if used, requires a separately approved and measured ingredient process. When Afia tested a downloaded “Smart Farm AI” leaf-camera app on mottled yellow-and-green cassava leaves showing symptoms consistent with cassava mosaic disease, the app confidently flashed: “96% Match: Maple Leaf Frostbite: Apply Winter Mulch!” Bature burst out laughing: “Snow frostbite in Ghana? Why did a smart computer say something so foolish?”',
        'Beside a Ghanaian cassava farm, Afia holds a tablet showing a mottled leaf mislabelled as Maple Frostbite while Bature and Mawuli look on amazed.'
      ),
      pg(
        '🤖',
        'In Computing class, Madam Adomako turned that funny mistake into a vital lesson on Artificial Intelligence (AI) and Machine Learning (ML). “AI does not ‘think’ like a human elder,” she explained. “In supervised Machine Learning, an algorithm learns patterns solely from thousands of labelled examples called training data. The app’s sample documentation showed mostly temperate crops and very few examples of tropical cassava, plantain, or cocoyam. We cannot know its complete training data without the developer’s records. This is an example of how unrepresentative training data can contribute to algorithmic bias or unreliable predictions; a high confidence score does not prove a diagnosis.”',
        'Madam Adomako points to a diagram of Machine Learning: Diverse Training Photos -> Model -> Output, contrasted with Biased Data -> Wrong Output.'
      ),
      pg(
        '📋',
        'With farmers’ permission and an Agricultural Extension Officer checking the disease labels, the JHS club collected a deliberately varied teaching dataset of 180 cassava leaf photographs across different farms and lighting conditions. This improved coverage but did not guarantee a representative sample! Bature recorded the verified tally cleanly in a frequency table: Healthy Leaves = 90; Suspected Cassava Mosaic Disease = 45; Green Mite Damage = 27; and Suspected Bacterial Blight = 18 (Total = 180 photographed leaves).',
        'Afia, Bature, and Mawuli photographing cassava leaves in varied lighting with an extension officer, recording tallies totaling 180 verified samples.'
      ),
      pg(
        '🥧',
        'To present the dataset distribution to the cooperative, Bature constructed an accurate pie chart in his Mathematics book, avoiding the common mistake of plotting raw numbers or percentages directly as degrees! “A full circle measures 360°,” Bature reminded Mawuli. “Each sector angle equals (Category Frequency ÷ Total Frequency) × 360°.” Calculating carefully: Healthy = (90 ÷ 180) × 360° = 180°; Mosaic Disease = (45 ÷ 180) × 360° = 90°; Green Mite = (27 ÷ 180) × 360° = 54°; and Bacterial Blight = (18 ÷ 180) × 360° = 36°. Checking the sum, 180° + 90° + 54° + 36° = 360°, every degree was accounted for!',
        'Close-up view of Bature’s notebook showing a compass circle divided with a protractor into four sectors: 180°, 90°, 54°, and 36°.'
      ),
      pg(
        '🧠',
        'Using a classroom image classifier in the ICT lab, Afia grouped photographs by source plant before splitting them, to reduce the chance that near-identical photos appeared in both sets. The group trained on 144 photos and reserved 36 unseen photos for a small demonstration test. On that test, their model classified 33 of 36 correctly (91.7%, about 92%). They had not run a comparable test of the downloaded app, so they did not claim a proven improvement over it! Even then, Madam Adomako taught a crucial ethical rule: “Three of these 36 test images were misclassified, and performance on other farms or in different light remains unknown. Responsible AI keeps a ‘human-in-the-loop’, where farmers and extension officers verify high-stakes decisions rather than obeying software blindly, and farmer farm-location privacy must always be respected.”',
        'In the ICT lab, Afia tests unseen cassava leaf images showing 92% accuracy beside a reminder banner: AI Assists Experts: Always Verify!'
      ),
      pg(
        '🥣',
        'At Friday’s cooperative meeting, the students presented their colour-coded pie chart alongside a laminated visual leaf guide and their locally trained offline classifier, helping farmers recognise possible disease symptoms and consult extension officers about removing affected plants and choosing healthy, recommended planting material. Months later, harvesting sound tubers for Mawuli’s aunties to roast into golden soya-fortified gari in hygienic stainless-steel pans, the trio saw how African data, honest statistics, and food technology make Artificial Intelligence truly serve local communities.',
        'Warm cooperative scene showing women roasting golden gari in stainless pans under a chimney while farmers consult the students’ Pie Chart and tablet.'
      ),
    ],
    activities: [
      {
        id: 'ca-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why did the downloaded "Smart Farm AI" app misclassify Cassava Mosaic as "Maple Frostbite"?',
        options: [
          'Model suffered training bias because tropical crops were missing',
          'Snow falls nightly across Central Region cassava farms in July',
          'Smartphone cameras cannot photograph green chlorophyll near the Equator',
        ],
        correctIndex: 0,
      },
      {
        id: 'ca-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'In a survey of 180 cassava plants, 45 plants had Mosaic Virus. What sector angle represents this on a pie chart?',
        options: [
          '90°, calculated as (45 ÷ 180) × 360°',
          '45°, because frequency is plotted directly as degrees',
          '25°, because 45 out of 180 equals 25%',
        ],
        correctIndex: 0,
      },
      {
        id: 'ca-c3',
        type: 'comprehension',
        afterPage: 1,
        question: 'In Career Technology, why must grated cassava mash undergo fermentation, pressing, and roasting during gari making?',
        options: [
          'To break down toxic cyanogenic compounds safely and reduce moisture',
          'To add wet mud and increase bacterial spoilage inside storage bags',
          'To turn fibrous cassava peelings into raw unseasoned timber',
        ],
        correctIndex: 0,
      },
      {
        id: 'ca-s1',
        type: 'sequencing',
        prompt: 'Put the ethical Machine Learning and statistical workflow in the correct scientific order.',
        items: [
          'Collect diverse, expert-verified leaf images across varied lighting.',
          'Tabulate frequencies and calculate exact 360° pie-chart sector angles.',
          'Train classifier on training split while holding back separate test set.',
          'Evaluate accuracy on unseen leaves with human-in-the-loop check.',
        ],
      },
      {
        id: 'ca-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'bias',
        definition: 'Systematic errors in an AI system’s outputs caused by unrepresentative training data.',
        distractors: [
          'The 360-degree angle at the centre of a compass-drawn circle',
          'A stainless-steel sieve used to remove coarse fibres from cassava mash',
        ],
      },
    ],
    glossary: [
      {
        word: 'fermentation',
        definition: 'A biochemical food-processing step essential in cassava processing to improve safety and flavour.',
        pages: [1],
      },
      {
        word: 'algorithm',
        definition: 'A set of rules followed by a computer to learn patterns and solve problems.',
        pages: [2],
      },
      {
        word: 'bias',
        definition: 'Systematic errors in AI predictions caused by incomplete or unrepresentative training data.',
        pages: [2],
      },
      {
        word: 'sector',
        definition: 'A slice of a pie chart, bounded by two radii and an arc, representing a data category.',
        pages: [4],
      },
      {
        word: 'gari',
        definition: 'A fine, roasted granular food product made from fermented, pressed cassava mash.',
        pages: [1, 6],
      },
    ],
    culturalNotes: [
      'Proposed CCP curriculum links: Computing (B8.4.4.1 / B9.4.4.1 AI & Machine Learning bias), Mathematics (B7.4.1.1 / B8.4.1.1 Frequency Tables & Pie Charts), and Career Technology (B8.2.4.1 Food Commodities: cassava to gari value chain).',
      'BECE Maths Guardrail: Explicitly contrasts Percentage (25%) with Pie-Chart Sector Angle (90°).',
    ],
    reviewQuestions: [
      'Check all four pie-chart angles: (90/180)×360=180°, (45/180)×360=90°, (27/180)×360=54°, (18/180)×360=36°; sum = 360°.',
      'Confirm cassava processing steps accurately note detoxification of natural cyanogenic glucosides via grating, fermentation, pressing, and roasting.',
    ],
    guide: {
      overview:
        'Demystifies Artificial Intelligence for Ghanaian JHS students, connecting Machine Learning training bias, BECE pie-chart construction, unbiased sampling, and hygienic local cassava-to-gari agro-processing.',
      lessonMinutes: 45,
      goals: [
        'Explain how Machine Learning models learn from training data and why bias occurs.',
        'Construct a frequency table and calculate exact pie-chart sector angles summing to 360°.',
        'Describe the food-processing stages that make cassava safe as fortified gari.',
      ],
      subjects: [
        ['Computing (NaCCA CCP B8.4.4.1 / B9.4.4.1)', 'Artificial Intelligence: Machine Learning, training data, and algorithmic bias'],
        ['Mathematics (NaCCA CCP B7.4.1.1 / B8.4.1.1)', 'Data sampling, frequency tables, and constructing 360° pie charts'],
        ['Career Technology (NaCCA CCP B8.2.4.1)', 'Food processing, fermentation safety, and value addition (cassava/gari)'],
      ],
      before: ['Ask: If a voice assistant is trained only on British accents, why might it struggle with Ghanaian town names?'],
      during: ['Pause on Page 4: Have every learner verify 27/180 × 360° = 54° without a calculator.'],
      after: ['Survey classmates on favourite Ghanaian staples and construct an accurate pie chart.'],
      discussion: ['Why should farmers treat AI predictions as a helpful second opinion rather than unquestionable truth?'],
      reflection: ['Why is it vital for young Ghanaians to become creators and trainers of AI technologies?'],
      maths: [
        {
          task: 'On 36 held-out test photos, the AI classified 33 correctly. Express test accuracy as a percentage to 1 decimal place.',
          answer: 'Accuracy = (33 ÷ 36) × 100% ≈ 91.7%.',
        },
      ],
      support: ['Teach unit degree shortcut: when Total = 180, 1 item = 360° ÷ 180 = 2°.'],
      stretch: ['Explore image classification using classroom objects and note changes with lighting.'],
      localise: ['Adapt crop examples to local produce: cocoa black pod, maize fall armyworm, mango anthracnose.'],
      factCheck: ['Provisional mapping; verify against official NaCCA CCP Computing B8.4.4, Mathematics B8.4.1, and Career Technology.'],
    },
  }),

  // 7
  mk({
    key: 'no-gaps-in-the-solar-dryer',
    title: 'No Gaps in the Solar Dryer',
    summary:
      'To stop roadside dust and blowflies from contaminating sliced mangoes and pepper, JHS 3 makers Adoley, Torgbui, and Fuseini construct a hygienic triangular-prism solar cabinet dryer, combining 2D geometric nets and total surface area with aluminium sheet metalwork, UV polycarbonate thermoplastics, a smart thermochromic heat strip, and cloud temperature logging.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['science', 'educational', 'school-life'],
    themes: ['technology', 'food', 'school'],
    objectives: ['reasoning', 'problem-solving', 'scientific-curiosity', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'smart-materials', 'agro-innovation'],
    wpm: 125,
    paceWord: 'Hands-on, exact, and inventive',
    palette: ['#d97706', '#0284c7'],
    voice:
      'Clear, practical teen voices for Adoley, Torgbui, and Fuseini; encouraging Career Tech workshop voice for Madam Kwakye',
    characters: [
      'Adoley: a fifteen-year-old JHS 3 technical designer unfolding a cardboard triangular-prism net, sharp with mensuration.',
      'Torgbui: her classmate in heavy leather gloves and goggles using tin snips on food-grade aluminium sheet.',
      'Fuseini: their classmate testing a colour-changing thermochromic indicator strip and cloud CSV sensor log.',
      'Madam Kwakye: the JHS Career Technology metalwork and modern-materials teacher.',
    ],
    music: 'Crisp metallic kalimba notes with warm acoustic guitar chords conveying clean design and craftsmanship (placeholder)',
    pages: [
      pg(
        '🥭',
        'Walking past the lorry park, Adoley, Torgbui, and Fuseini noticed red chilli peppers and mango slices spread on tarpaulins right beside exhaust smoke, Harmattan dust, and settling flies. In Career Technology, Madam Kwakye challenged Basic 9 to engineer an enclosed hygienic solar dryer shaped as a right-angled triangular prism: 100 cm long, with a horizontal base 30 cm wide and a vertical back wall 40 cm high so its clear slanted top face tilted cleanly toward the sun.',
        'JHS 3 students in the design room sketching an enclosed triangular-prism solar food dryer to replace roadside drying.'
      ),
      pg(
        '📐',
        'Before ordering a single sheet of material, Adoley unfolded the 3D triangular prism into its flat 2D net of five faces: two congruent right-angled triangular ends plus three rectangles! First, she found the slanted roof edge using Pythagoras’ theorem: c = √(30² + 40²) = √(900 + 1,600) = √2,500 = 50 cm. She warned Torgbui never to confuse the triangle’s 40 cm perpendicular height with its 50 cm slant hypotenuse! Next, she calculated the Total Surface Area (TSA): two triangular ends = 2 × (½ × 30 × 40) = 1,200 cm²; rectangular base = 30 × 100 = 3,000 cm²; vertical back = 40 × 100 = 4,000 cm²; and slanted clear top = 50 × 100 = 5,000 cm². This gave an exact TSA of 13,200 cm² (1.32 m²)!',
        'Unfolded 2D net of right-angled triangular prism labelled with dimensions (30 cm, 40 cm, 50 cm slant, 100 cm length) and total area 13,200 cm².'
      ),
      pg(
        '🔩',
        'Selecting materials carefully from the NaCCA Career Technology syllabus, Torgbui chose non-rusting aluminium sheet painted matte black with food-safe exterior coating for an external heat-absorbing collector surface kept separate from food contact, stainless-steel mesh for the removable drying tray, and UV-stabilised clear polycarbonate, a tough thermoplastic that softens only at high factory moulding temperatures rather than shattering like glass, for the 50 cm × 100 cm slanted glazing! Wearing leather gloves and goggles, he scribed fold allowances, cut straight edges with tin snips, filed away every sharp metal burr, and assembled the frame with appropriate fasteners and screened, adjustable ventilation. The teacher checked all food-contact surfaces and edges before use.',
        'Torgbui in leather gloves and safety goggles filing smooth edges on an aluminium collector tray and assembling clear polycarbonate glazing.'
      ),
      pg(
        '🌡️',
        'Madam Kwakye then introduced a modern Smart Material from the Basic 9 curriculum to give the operator a visible temperature warning: a self-adhesive thermochromic strip stuck inside the viewing edge! “Smart materials change their properties reversibly in response to an external stimulus such as heat, light, or moisture,” she explained. “A suitable commercially specified indicator could change colour at a chosen threshold. We must calibrate it against a thermometer; one ordinary strip does not automatically show green throughout 45°C to 60°C and red above 65°C. Drying temperatures and times depend on the fruit, slice thickness, airflow, and hygiene guidance.”',
        'View through slanted lid showing golden mango slices on mesh beside a temperature-indicator strip and digital thermometer reading 55°C.'
      ),
      pg(
        '☁️',
        'To prove the dryer’s performance scientifically for their project portfolio, Fuseini placed a tiny battery data-logger probe inside the chamber for six hours, exported its half-hourly temperature and relative-humidity CSV file onto the lab laptop, and backed the shared project folder up to cloud storage with view-only teacher permissions. Plotting a clean line graph in Computing, Fuseini presented an example in which outdoor air at 32°C and 68% relative humidity while the dryer measured 54°C and 24%. These readings alone could not establish that drying was twice as fast or that every batch was free of contamination; the team planned repeated measurements, protected vents, and food-safety checks.',
        'Fuseini at ICT computer displaying a dual-line graph (Chamber 54°C vs Outdoor 32°C) synced safely to a shared cloud project folder.'
      ),
      pg(
        '🌟',
        'Calculating the prism’s internal volume (Cross-sectional Area × Length = (½ × 30 × 40) × 100 = 600 × 100 = 60,000 cm³ = 60 litres of warm circulating air), the team handed two supervised demonstration dryer prototypes to the women’s fruit-processing group for further safety and performance testing at PTA exhibition day. Tasting clean, sweet, golden dried mango rings sealed in labelled pouches, parents saw how exact 3D mensuration, materials selection, and careful data collection could help address post-harvest challenges.',
        'Sunny courtyard showing triangular-prism solar dryer in action while parents admire sealed pouches of clean dried mango slices.'
      ),
    ],
    activities: [
      {
        id: 'ng-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'A right-angled triangular prism has triangular ends of 30 cm by 40 cm (slant 50 cm) and length 100 cm. What is its Total Surface Area?',
        options: [
          '13,200 cm² (1,200 cm² for two triangles + 3,000 cm² + 4,000 cm² + 5,000 cm²)',
          '60,000 cm² (which is the volume in cm³, not surface area)',
          '12,000 cm² (forgetting to include the two triangular end faces)',
        ],
        correctIndex: 0,
      },
      {
        id: 'ng-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why is a thermochromic strip classified as a "smart material" in Career Technology?',
        options: [
          'It changes a physical property (colour) reversibly in response to heat',
          'It connects wirelessly to satellites using HTML tags',
          'It permanently melts into liquid whenever sunlight touches it once',
        ],
        correctIndex: 0,
      },
      {
        id: 'ng-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What is a major advantage of backing up CSV sensor logs to cloud storage?',
        options: [
          'Authorised users access data safely from different devices and work is preserved',
          'Cloud storage physically cools down mango slices inside a wooden workshop',
          'Uploading a CSV file works without any network connection anywhere',
        ],
        correctIndex: 0,
      },
      {
        id: 'ng-s1',
        type: 'sequencing',
        prompt: 'Put the engineering design and testing stages of the solar dryer in chronological order.',
        items: [
          'Draw unfolded 5-face 2D net and calculate Total Surface Area.',
          'Cut, deburr, and rivet aluminium sheet, mesh vents, and clear polycarbonate.',
          'Attach thermochromic indicator strip and log temperature/humidity to CSV.',
          'Back up test data to cloud storage and plot performance line graphs.',
        ],
      },
      {
        id: 'ng-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'thermoplastic',
        definition: 'A polymer plastic that can be softened repeatedly by heating and reshaped upon cooling.',
        distractors: [
          'A ferrous metal alloy containing iron and carbon that rusts rapidly in moist air',
          'A two-dimensional net made exclusively of equilateral triangles',
        ],
      },
    ],
    glossary: [
      {
        word: 'net',
        definition: 'A flat two-dimensional pattern of polygons showing every face of a 3D prism.',
        pages: [2],
      },
      {
        word: 'thermoplastic',
        definition: 'A plastic polymer that softens when heated and hardens when cooled, allowing reshaping.',
        pages: [3],
      },
      {
        word: 'burr',
        definition: 'A rough edge or ridge remaining on metal or plastic after cutting or punching.',
        pages: [3],
      },
      {
        word: 'cloud',
        definition: 'Remote internet-connected servers used to back up, synchronise, and share files safely.',
        pages: [5],
      },
      {
        word: 'volume',
        definition: 'The amount of three-dimensional space enclosed inside a closed solid or container.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Proposed CCP curriculum links: Career Technology (B8.2.2 Resistant Materials, B8.2.3 / B9.2.3 Smart Materials, B8.3.2 Sheet Metalwork), Mathematics (B8.3.2.1 Nets, Total Surface Area, and Volume of Prisms), and Computing (B9.1.1.2 Cloud Storage, B8.2.4 Line Charts).',
      'BECE Mensuration Guardrail: Separates Total Surface Area in cm² (13,200 cm² = 1.32 m²) from Volume in cm³ (60,000 cm³ = 60 litres).',
    ],
    reviewQuestions: [
      'Verify every face area: 2 × (½ × 30 × 40) = 1,200; + 3,000 + 4,000 + 5,000 = 13,200 cm² = 1.32 m² (1 m² = 10,000 cm²).',
      'Verify m² conversion factor: 1 m = 100 cm, so 1 m² = 10,000 cm².',
    ],
    guide: {
      overview:
        'Connects 3D prism nets, Total Surface Area, and Volume directly to building a hygienic agricultural solar dryer using non-ferrous metals, thermoplastics, NaCCA smart materials, and Computing cloud data analysis.',
      lessonMinutes: 45,
      goals: [
        'Sketch the 5-face 2D net of a triangular prism and calculate Total Surface Area and Volume.',
        'Distinguish between aluminium, thermoplastics vs thermosets, and smart materials.',
        'Explain safe sheet-metal deburring practices and how cloud storage supports collaboration.',
      ],
      subjects: [
        ['Career Technology (NaCCA CCP B8.2.2, B9.2.3, B9.3.3)', 'Non-ferrous metals, thermoplastics, smart materials, and sheet assembly'],
        ['Mathematics (NaCCA CCP B8.3.2.1 / B9.3.2.1)', '2D nets, Total Surface Area, and Volume of triangular prisms'],
        ['Computing (NaCCA CCP B9.1.1.2, B8.2.4.1)', 'Cloud storage permissions, CSV sensor logs, and line graphs'],
      ],
      before: ['Hold up a triangular chocolate box and cut along edges so students count 2 triangles + 3 rectangles live!'],
      during: ['Pause on Page 2 to highlight: (1) using 50 cm slant for top rectangle, and (2) 1 m² = 10,000 cm².'],
      after: ['Construct a 1 : 5 scale card model of the solar dryer net.'],
      discussion: ['Why did Torgbui choose non-ferrous aluminium instead of mild steel inside a fruit dryer?'],
      reflection: ['Where else could thermochromic smart materials improve safety in Ghanaian clinics or baby bottles?'],
      maths: [
        {
          task: 'Why does 13,200 cm² equal 1.32 m² rather than 132 m²? Show the exact conversion factor.',
          answer: '1 m = 100 cm, so 1 m² = 10,000 cm². Therefore, 13,200 cm² ÷ 10,000 = 1.32 m².',
        },
      ],
      support: ['Colour-code each of the 5 faces on the 2D net differently so learners calculate all 5 areas.'],
      stretch: ['Contrast thermoplastics with thermosetting plastics (Bakelite, melamine).'],
      localise: ['Adapt dried produce to local crops: pepper, okra (nkruma), cassava Kokonte chips, pineapple.'],
      factCheck: ['Provisional mapping; verify against official NaCCA CCP Career Technology B8.2.2, Mathematics B8.3.2, and Computing B9.1.1.'],
    },
  }),

  // 8
  mk({
    key: 'closing-tags-and-honest-interest',
    title: 'Closing Tags and Honest Interest',
    summary:
      'Pitching their JHS 3 bamboo-and-leather craft cooperative to expand tool equipment, Eyram, Kwaku, and Zuwera fix broken unclosed HTML tags on their showcase webpage, build a concise multimedia slide deck, and expose how a "4% per month" informal loan actually charges 48% annual interest compared with an 18% per annum credit-union loan.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'school-life', 'family'],
    themes: ['technology', 'community', 'school'],
    objectives: ['reasoning', 'problem-solving', 'responsibility', 'vocabulary'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'web-development', 'financial-literacy'],
    wpm: 125,
    paceWord: 'Confident, articulate, and financially sharp',
    palette: ['#0f766e', '#b45309'],
    voice:
      'Articulate teen voices for Eyram, Kwaku, and Zuwera; encouraging business-mentor voice for Credit Union Manager Mr Mensah',
    characters: [
      'Eyram: a fifteen-year-old JHS 3 web designer debugging HTML code in a text editor.',
      'Kwaku: her classmate crafting smooth bamboo desk organisers and leather bookmarks.',
      'Zuwera: their classmate and finance lead comparing Simple Interest formulas and VAT invoices.',
      'Mr Mensah: a community cooperative credit-union manager visiting Career Technology Pitch Day.',
    ],
    music: 'Upbeat acoustic guitar and soft shaker rhythm expressing creativity, clarity, and smart enterprise (placeholder)',
    pages: [
      pg(
        '🎍',
        'For Basic 9 Career Technology Business Pitch Day, Kwaku, Eyram, and Zuwera formed “Subin Bamboo Craft”, sanding cured local bamboo stems and offcut leather into sleek pen holders and study bookstands. Following the NaCCA entrepreneurial syllabus, they drafted a clear four-part Business Plan: Executive Summary, Product & Workshop Operations, Marketing Plan, and Financial Projections. For a supervised classroom financing comparison, the group estimated GH¢ 2,000.00 in equipment capital over nine months; no student would sign a loan agreement.',
        'In the Career Technology room, Kwaku arranges smooth varnished bamboo desk organisers and leather bookmarks beside a bound Business Plan folder.'
      ),
      pg(
        '💻',
        'To showcase their catalogue offline on the school intranet, Eyram coded a clean webpage in HyperText Markup Language (HTML). At first, the product paragraph appeared with unintended heading styling in the browser they tested! Inspecting her code, Eyram spotted why: she had opened `<h1>Subin Bamboo Craft` without typing the closing tag `</h1>`! Fixing the structure inside `<!DOCTYPE html>`, `<html>`, `<head>`, and `<body>`, she closed `<h1>...</h1>` properly, listed features inside `<ul><li>...</li></ul>`, and added descriptive `alt` text inside `<img src="stand.jpg" alt="Polished bamboo bookstand">` so visually impaired users with screen readers could understand every product.',
        'Close-up view of split-screen: clean HTML tags on left and crisp well-formatted Bamboo Craft webpage on right.'
      ),
      pg(
        '📽️',
        'Next, Kwaku prepared their five-slide Multimedia Presentation for the judges. Remembering Computing presentation design principles, he replaced cramped walls of tiny yellow text on a bright background with high-contrast dark navy headings on soft cream slides, concise five-point bullet summaries, consistent font sizes, and genuine photos of their bamboo curing process, avoiding dizzying sound effects on every line so the judges focused on the engineering and numbers.',
        'Kwaku and Eyram rehearsing beside a projected slide showing clean high-contrast bullet points, product photos, and zero cluttered text.'
      ),
      pg(
        '🏦',
        'Then came the critical financial test. An informal roadside lender had flyers offering “Easy 4% Monthly Flat Interest!”, whereas Mr Mensah’s Teachers & Community Credit Union offered an illustrative, adult-supervised enterprise loan quote at “18% per annum Simple Interest”. Kwaku nearly picked 4% because 4 looked smaller than 18! Zuwera stopped him immediately at the board: “Compare like with like, Kwaku! Four percent of the original principal each month totals 4% × 12 = 48% of that principal over twelve months under this flat-rate assumption! Let us calculate both over 9 months (T = 9/12 = 0.75 years) using the Simple Interest formula: I = (P × R × T) ÷ 100.”',
        'Zuwera writing a bold warning comparison on whiteboard: 4% per month = 48% per year vs Credit Union 18% per annum, setting up I = (P x R x T) / 100.'
      ),
      pg(
        '🧮',
        'Zuwera worked both options step by step on Principal P = GH¢ 2,000 for Time T = 9/12 years. Under the Credit Union’s 18% per annum rate: I = (2,000 × 18 × 9) ÷ (100 × 12) = 324,000 ÷ 1,200 = GH¢ 270.00 interest, giving Total Amount A = P + I = GH¢ 2,270.00! Under the informal lender’s 4% monthly flat rate for 9 months: I = 2,000 × (4 ÷ 100) × 9 = GH¢ 720.00 interest, giving a Total Amount of GH¢ 2,720.00, which cost GH¢ 450.00 more! She also checked the registered tool-shop invoice for a GH¢ 1,600 bench drill plus an assumed 15% VAT for this classroom example: 0.15 × 1,600 = GH¢ 240, giving GH¢ 1,840 and leaving GH¢ 160 for sanding belts. Zuwera warned that real Ghanaian invoices must use the applicable tax rules and levies on the transaction date.',
        'Calculation table comparing Credit Union Repayment (GH¢ 2,270) vs Informal Lender (GH¢ 2,720), alongside illustrative invoice showing GH¢ 1,600 + GH¢ 240 VAT.'
      ),
      pg(
        '🏆',
        'At Friday’s Pitch Day, Mr Mensah and the panel applauded the team’s accessible HTML catalogue, crisp slides, carefully checked illustrative supplier invoice, and razor-sharp Simple Interest comparison, and offered to review the club’s proposal for a supervised school micro-grant after the required approvals! Watching juniors test their bamboo bookstands in the library, the trio proved that clean code, clear communication, and mathematical vigilance protect young entrepreneurs from debt traps before business even begins.',
        'JHS Pitch Day finale showing Eyram, Kwaku, and Zuwera presenting their bamboo artefacts and financial table to smiling judges and parents.'
      ),
    ],
    activities: [
      {
        id: 'ct-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'In HTML, what happens when a heading tag like `<h1>` is unclosed, and why is `alt` important in `<img>`?',
        options: [
          'Unclosed <h1> causes bad styling; alt provides text for screen readers',
          'HTML requires closing tags to start with ?h1, and alt deletes images',
          'Only <img /> tags wrap around entire websites in place of <html>',
        ],
        correctIndex: 0,
      },
      {
        id: 'ct-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'Calculate Simple Interest on GH¢ 2,000 at 18% per annum for 9 months using I = (P × R × T) ÷ 100.',
        options: [
          'GH¢ 270.00, because T in years is 9/12, giving (2,000 × 18 × 0.75) ÷ 100',
          'GH¢ 3,240.00, by substituting T = 9 years instead of 9/12 of a year',
          'GH¢ 360.00, by ignoring the 9-month period completely',
        ],
        correctIndex: 0,
      },
      {
        id: 'ct-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why was the informal lender’s "4% per month" rate far more expensive than the credit union’s "18% per annum"?',
        options: [
          '4% monthly totals 48% over 12 months, versus 18% simple annual interest',
          '4% per month equals 0.4% per year',
          'Annual interest rates are charged once every day at midnight',
        ],
        correctIndex: 0,
      },
      {
        id: 'ct-s1',
        type: 'sequencing',
        prompt: 'Put the responsible JHS enterprise planning and financial-verification workflow in order.',
        items: [
          'Prototype bamboo-and-leather artefacts and draft a Business Plan.',
          'Build valid accessible HTML product page and high-contrast pitch slides.',
          'Convert loan periods to years (T = m/12) and compare Simple Interest rates.',
          'Compare full terms, seek adult supervision, and request valid receipts.',
        ],
      },
      {
        id: 'ct-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'interest',
        definition: 'Money paid regularly at a particular rate for the use of borrowed money or for delaying the repayment of a debt.',
        distractors: [
          'Charged once every week regardless of the principal borrowed',
          'An HTML tag used to insert bulleted lists inside a webpage body',
        ],
      },
    ],
    glossary: [
      {
        word: 'HTML',
        definition: 'HyperText Markup Language, the standard language using tags to structure content on webpages.',
        pages: [2, 6],
      },
      {
        word: 'multimedia',
        definition: 'Using more than one medium of expression or communication, such as text, images, and slides.',
        pages: [3],
      },
      {
        word: 'interest',
        definition: 'The fee charged by a lender to a borrower for the use of borrowed money over time.',
        pages: [4, 5, 6],
      },
      {
        word: 'principal',
        definition: 'The initial sum of money borrowed or invested, before any interest is added.',
        pages: [4, 5],
      },
      {
        word: 'invoice',
        definition: 'A commercial document issued by a seller listing goods provided and the amount payable.',
        pages: [5, 6],
      },
    ],
    culturalNotes: [
      'Proposed CCP curriculum links: Computing (B8.2.2 Presentation Software, B8.3.2 / B9.3.2 HTML), Career Technology (B8.2.1 Bamboo/Leather, B9.6.2 Business Plan), and Mathematics (B8.1.3 Simple Interest & VAT).',
      'BECE & Real-Life Financial Guardrail: Immunises teenagers against predatory monthly loan apps and eliminates dividing months by 12 errors.',
      'Ghana Tax Note: 15% rate is a simplified classroom assumption, not current tax advice.',
    ],
    reviewQuestions: [
      'Check Simple Interest arithmetic: (2,000 × 18 × 9) / (100 × 12) = GH¢ 270; Amount = GH¢ 2,270; 4%/month × 9 months = GH¢ 720; difference = GH¢ 450.',
      'Confirm HTML tags are syntactically accurate.',
    ],
    guide: {
      overview:
        'Brings Basic 9 readiness full circle, uniting HTML web structure and presentation design with sustainable bamboo Career Technology craft, Business Plan writing, VAT compliance, and predatory-loan defence using Simple Interest.',
      lessonMinutes: 45,
      goals: [
        'Write well-formed HTML tags and design high-contrast presentation slides.',
        'Outline core sections of a small-enterprise Business Plan using sustainable materials.',
        'Calculate Simple Interest I = (PRT)/100 accurately when time is in months (T = m/12).',
      ],
      subjects: [
        ['Computing (NaCCA CCP B8.2.2.1, B9.3.2.1)', 'Multimedia presentation design principles and HTML webpage markup'],
        ['Career Technology (NaCCA CCP B8.2.2, B9.6.2.1)', 'Sustainable bamboo/leather craft and writing a simple Business Plan'],
        ['Mathematics (NaCCA CCP B8.1.3.2 / B9.1.3.1)', 'Simple Interest (months vs years), Total Amount, and VAT calculations'],
      ],
      before: ['Ask: Which loan charges more interest over a year: 3% per month or 20% per annum?'],
      during: ['Pause on Page 2 to spot paired container tags vs void tags, and on Page 5 to underline 9 ÷ 12.'],
      after: ['Save a 12-line index.html file in Notepad showcasing craft items and open in a browser.'],
      discussion: ['Why should a business request a valid supplier invoice instead of trusting a handwritten total?'],
      reflection: ['How can checking interest math for five minutes protect a family trader from losing months of hard work?'],
      maths: [
        {
          task: 'A cooperative invests GH¢ 4,500.00 at 16% Simple Interest per annum for 15 months. Calculate interest earned.',
          answer: 'T = 15/12 = 1.25 years. I = (4,500 × 16 × 1.25) ÷ 100 = GH¢ 900.00.',
        },
      ],
      support: ['Highlight Months Rule in red: Rate in % p.a. and Time in months -> write Months / 12.'],
      stretch: ['Add basic inline CSS styling and an HTML table displaying product prices.'],
      localise: ['Substitute regional craft commodities: Bolgatanga straw baskets, Kente strip accessories.'],
      factCheck: ['Provisional mapping; verify against official NaCCA CCP Computing B8.2.2, Career Technology B9.6.2, and Mathematics B8.1.3.'],
    },
  }),
];
