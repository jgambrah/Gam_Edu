import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

const base = (
  c: Partial<Classification> &
    Pick<
      Classification,
      | 'classIds'
      | 'ageMin'
      | 'ageMax'
      | 'readingLevel'
      | 'difficulty'
      | 'genres'
      | 'themes'
      | 'objectives'
      | 'ghanaianContext'
      | 'estimatedDurationSec'
    >
): Classification => ({
  schemaVersion: CLASSIFICATION_VERSION,
  language: 'en',
  narrationLocale: 'en-GH',
  ...c,
});

export const BATCH_5_STORIES: PilotStory[] = [
  // ====================================================================================================================
  // 1. The Promise That Bought a Vote (JHS 2-3, 12 pages, Civic Education, Evidence, Budgets & Accountability)
  // ====================================================================================================================
  {
    key: 'the-promise-that-bought-a-vote',
    set: 'extension',
    title: 'The Promise That Bought a Vote',
    summary:
      'During a fictional local council election in the town of Asasekro, fourteen-year-old Kofi and his classmate Ama notice one candidate handing out gifts and making huge uncosted promises while another shares a written budget plan, prompting the students to investigate how public budgets, independent verification, secret ballots and civic accountability really work.',
    classification: base({
      classIds: ['jhs-2', 'jhs-3'],
      ageMin: 13,
      ageMax: 15,
      readingLevel: 'proficient',
      difficulty: 5,
      genres: ['realistic-fiction', 'educational'],
      themes: ['citizenship', 'community', 'leadership', 'peer-pressure'],
      objectives: ['critical-thinking', 'citizenship', 'reasoning', 'honesty', 'responsibility', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 460,
    }),
    palette: ['#1e293b', '#f59e0b'],
    characters: [
      'Kofi: a thoughtful fourteen-year-old Ghanaian boy in JHS 3 in the fictional town of Asasekro, wearing a neat cream-and-brown school uniform and carrying a reporter’s notebook for the school civic club.',
      'Ama: Kofi’s fourteen-year-old classmate and co-editor of the school civic club, wearing a cream-and-brown school uniform, natural braided hair with brown clips, and spectacles.',
      'Mrs Mensah: their JHS Social Studies teacher and civic-club patron, wearing a calm teal dress and glasses.',
      'Uncle Yaw: Kofi’s older cousin in his twenties, a young carpenter voting for the first time, wearing a grey work shirt.',
    ],
    pages: [
      {
        text: 'In the fictional market town of Asasekro, excitement filled the air as residents prepared to elect a community representative to the local council. Fourteen-year-old Kofi and his classmate Ama walked home from JHS with their civic-club notebooks. Yet right outside their school, they stepped carefully over a broken footbridge and passed a community clinic whose roof leaked every rainy season.',
        alt: 'Fourteen-year-old Kofi and Ama walk with their notebooks past a cracked wooden footbridge and a small clinic in the fictional town of Asasekro.',
        motif: '🗳️🌉',
        brief: 'Sunny afternoon in a fictional Ghanaian town: Kofi (14, cream-and-brown JHS uniform, notebook) and Ama (14, spectacles, braided hair, cream-and-brown uniform) looking thoughtfully at a worn wooden footbridge over a stream and a small clinic building in the background (no text or banners).',
        narration: 'Grounded, observant opening setting up the real community needs in Asasekro.',
      },
      {
        text: 'That afternoon at the town lorry park, a loud music van arrived for Candidate A’s rally. Assistants handed out free packets of food and fifty-cedi notes to cheering bystanders while Candidate A shouted into a microphone: ‘Vote for me on Saturday, and within three months I will build a giant glass shopping mall, a stadium, and pave every lane in Asasekro!’ Kofi’s older cousin, Uncle Yaw, pocketed a gift packet with a grin.',
        alt: 'At a crowded lorry park rally, assistants hand out small gift packets while a speaker on a platform gestures grandly.',
        motif: '📢🎁',
        brief: 'Lively town square gathering in Ghana (no real party colours, logos, or text banners; neutral purple-and-silver bunting): a speaker in a white tunic gesturing grandly with a microphone while helpers hand small gift boxes to bystanders; Kofi, Ama and cousin Yaw watching from the shade.',
        narration: 'Energetic rally scene. Keep Candidate A completely fictional and non-partisan.',
      },
      {
        text: 'An hour later under the community centre shade trees, Candidate B held a quieter town-hall meeting. Instead of handing out cash or gifts, she distributed a printed two-page sheet showing the local council’s real annual capital budget and answered tough questions from farmers, teachers and traders. Several people in the back yawned and walked away because there were no free handouts.',
        alt: 'Under shade trees at the community centre, a female candidate explains a budget chart to attentive townspeople while a few people walk away.',
        motif: '📋🌳',
        brief: 'Shaded community courtyard: a female candidate in a neat olive-green dress standing beside an easel with a simple bar chart and pie chart (no text or numbers), answering questions from elders, traders and Kofi and Ama.',
        narration: 'Contrast the quiet, evidence-based town hall with the flashy handout rally.',
      },
      {
        text: 'On the walk home, Uncle Yaw held up his gift packet. ‘Candidate A already gave me something today!’ he said. ‘Why shouldn’t I vote for the person who shares gifts right now?’ Ama stopped and opened her notebook. ‘Uncle Yaw, let us test that idea using maths and civic facts before you decide.’',
        alt: 'Uncle Yaw holds up his gift packet while Ama and Kofi open their notebooks on the family veranda.',
        motif: '🤔📓',
        brief: 'Family compound veranda: young carpenter Yaw (grey work shirt) holding a small gift packet while Ama and Kofi sit on a wooden bench with their notebooks open.',
        narration: 'Friendly, respectful dialogue between Kofi, Ama and their older cousin.',
      },
      {
        text: 'The next morning in Social Studies class, Mrs Mensah explained how public projects are actually funded. ‘No elected leader pays for roads, clinics or bridges out of their personal pocket,’ she said. ‘Public infrastructure is paid for by citizens’ taxes and statutory funds allocated through an approved public budget. To judge whether a campaign promise is credible, citizens must check the numbers!’',
        alt: 'In the JHS classroom, Mrs Mensah points to a diagram showing taxes flowing into a public budget for clinics, water and roads.',
        motif: '🏫📊',
        brief: 'Sunlit JHS classroom: Mrs Mensah (teal dress, glasses) pointing to a chalkboard diagram showing coins flowing into a central public chest and out to a clinic, water tap and bridge icon (no words or numbers).',
        narration: 'Clear, non-partisan civic explanation from Mrs Mensah.',
      },
      {
        text: 'With Mrs Mensah’s guidance, the civic club inspected the published District Assembly budget summary at the library. Asasekro’s entire annual capital budget for local works was five hundred thousand cedis. Candidate A’s promised stadium and glass mall would cost over five million cedis, ten times the entire budget, with zero explanation of where the money would come from!',
        alt: 'Kofi and Ama compare the official council budget binder with the cost of the promised projects using a calculator.',
        motif: '📚🧮',
        brief: 'School library table: Kofi and Ama looking at a large official budget binder and a calculator, comparing a small stack of five wooden blocks with a towering stack of fifty blocks (no text).',
        narration: 'Walk through the budget arithmetic clearly: 500,000 cedis available vs 5,000,000 cedis promised.',
      },
      {
        text: 'Next, they checked Candidate B’s written plan. Fixing the leaking clinic roof cost one hundred and twenty thousand cedis, repairing the school footbridge cost eighty thousand cedis, and drilling two solar boreholes cost one hundred thousand cedis, three hundred thousand cedis in total, leaving two hundred thousand cedis for maintenance and drainage. Every cedi was accounted for within the real budget!',
        alt: 'Ama traces the three costed items, clinic roof, footbridge and boreholes, totalling 300,000 cedis within the 500,000-cedi budget.',
        motif: '🏥🚰',
        brief: 'Close view of Ama’s notebook showing three neat visual sketches, a clinic roof, a sturdy bridge, and a water tap, fitting comfortably inside a drawn budget box (no text).',
        narration: 'Clear, verifiable arithmetic: 120,000 + 80,000 + 100,000 = 300,000 cedis out of the 500,000-cedi budget.',
      },
      {
        text: 'That evening, Kofi showed Uncle Yaw another calculation. ‘A council term lasts four years, about one thousand four hundred and sixty days,’ Kofi said. ‘If someone gives a voter fifty cedis to buy their vote for four years, that works out to less than four pesewas a day! Worse still, a politician who buys votes with private cash often treats office as a business to recover their money instead of serving the town.’',
        alt: 'Kofi shows Uncle Yaw on a calculator how 50 cedis divided across four years (1,460 days) is less than four pesewas a day.',
        motif: '⏳🪙',
        brief: 'Evening veranda light: Kofi holding a single small coin beside a thick four-year calendar flipbook while Uncle Yaw looks surprised and thoughtful.',
        narration: 'Let the math sink in: 50 cedis over 4 years (1,460 days) is less than 4 pesewas a day.',
      },
      {
        text: 'On Thursday evening, the Asasekro Youth and Elders Association hosted a non-partisan community debate. Citizens respectfully asked both candidates three factual questions: What is the exact cost of your top priority? Which budget line will fund it? And how will you report progress every six months? When pressed for evidence, uncosted slogans quickly stood apart from realistic plans.',
        alt: 'At a peaceful community forum, townspeople ask calm, evidence-based questions of the candidates seated on stage.',
        motif: '🎤🤝',
        brief: 'Peaceful community hall forum: townspeople, elders and youth seated orderly as Uncle Yaw stands at a floor microphone asking a polite question to two candidates seated at a table on stage (no text or partisan symbols).',
        narration: 'Model respectful, evidence-based public dialogue.',
      },
      {
        text: 'At the forum, Uncle Yaw’s friend whispered, ‘What if people get angry because we support different candidates?’ Mrs Mensah reminded the audience of a vital constitutional principle: ‘In a democracy, citizens can disagree on policies while remaining neighbours and friends. Even more importantly, the ballot is secret, nobody inside the voting booth can see whom you choose, so no gift or threat can force your hand.’',
        alt: 'Mrs Mensah points to a demonstration cardboard voting screen showing how every voter marks their ballot in complete privacy.',
        motif: '🛡️🗳️',
        brief: 'Civic education table at the community hall: Mrs Mensah demonstrating a private three-sided voting screen and a transparent ballot box (no text) while Uncle Yaw and his friends nod.',
        narration: 'Emphasise both tolerance for differing views and the protection of the secret ballot.',
      },
      {
        text: 'After the election, Kofi and Ama learned that citizenship does not end on voting day! Whether a candidate wins or loses, residents must attend town-hall budget hearings, inspect public project noticeboards, and track accountability, requiring leaders to explain how public funds are spent and whether promised milestones are met.',
        alt: 'Kofi, Ama, Uncle Yaw and townspeople inspect a public project progress board outside the newly repaired clinic roof.',
        motif: '🏗️📋',
        brief: 'Sunny morning outside the community clinic where carpenters are installing new roof sheets: Kofi, Ama, Uncle Yaw and elders checking a visual progress chart mounted on a wooden post (no readable text).',
        narration: 'Show that democracy is an ongoing partnership of active citizens and accountable institutions.',
      },
      {
        text: 'Walking across the newly repaired school footbridge a few months later, Kofi and Ama smiled. No single politician could magically fix every problem overnight, and good leaders deserved respect when they worked honestly, just as citizens deserved truth, clear budgets and real accountability. A strong Ghana, they realised, begins with minds that cannot be bought.',
        alt: 'Kofi, Ama and Uncle Yaw walk safely across the sturdy repaired footbridge on their way to school.',
        motif: '🌉🌟',
        brief: 'Warm morning light: Kofi and Ama walking across a sturdy, newly built wooden-and-concrete footbridge over the stream while Uncle Yaw waves his carpenter’s rule from the bank.',
        narration: 'Hopeful, balanced, civic-minded close.',
      },
    ],
    activities: [
      {
        id: 'vote-c1',
        type: 'comprehension',
        afterPage: 6,
        question: 'Why did Kofi and Ama conclude that Candidate A’s 5-million-cedi promise was not credible?',
        options: [
          'Asasekro’s entire annual capital budget was only 500,000 cedis',
          'The town had no space to plant a single tree',
          'Public projects are always paid from a teacher’s pocket',
        ],
        correctIndex: 0,
        explanation: 'A 5,000,000-cedi promise was ten times the town’s entire 500,000-cedi capital budget, with no funding source explained.',
      },
      {
        id: 'vote-v1',
        type: 'vocabulary',
        afterPage: 5,
        word: 'credible',
        definition: 'Believable and trustworthy because it is supported by evidence and realistic numbers',
        distractors: [
          'Loudly announced through a music van loudspeaker',
          'Kept secret from taxpayers and voters',
        ],
      },
      {
        id: 'vote-c2',
        type: 'comprehension',
        afterPage: 7,
        question: 'How much did Candidate B’s three priority projects (120,000 + 80,000 + 100,000 cedis) cost in total?',
        options: [
          '300,000 cedis, fitting within the 500,000-cedi capital budget',
          '5,000,000 cedis, ten times more than the budget',
          '50 cedis in total',
        ],
        correctIndex: 0,
        explanation: '120,000 (clinic roof) + 80,000 (footbridge) + 100,000 (two boreholes) = 300,000 cedis.',
      },
      {
        id: 'vote-c3',
        type: 'comprehension',
        afterPage: 10,
        question: 'How does the secret ballot protect voters during an election?',
        options: [
          'No one sees your vote in the booth, so gifts cannot force your choice',
          'Only two people in the town are allowed to know the election date',
          'Voters must whisper their choice to a loudspeaker',
        ],
        correctIndex: 0,
        explanation: 'Because the ballot is secret, each citizen votes privately according to their conscience and judgment.',
      },
      {
        id: 'vote-s1',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Order the steps of responsible civic decision-making shown in the story.',
        items: [
          'Identify real community needs like the clinic roof and footbridge.',
          'Compare campaign promises against the official published budget.',
          'Vote independently and follow up on public project accountability.',
        ],
      },
      {
        id: 'vote-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'Why is it important to stay respectful toward neighbours even when you disagree about candidates or policies?',
        feelingOptions: ['Respectful', 'Discerning', 'Fair-minded', 'Responsible'],
      },
    ],
    glossary: [
      { word: 'credible', definition: 'Convincing and trustworthy because it is backed by real evidence and workable numbers', pages: [5] },
      { word: 'budget', definition: 'An official financial plan showing expected public revenue and how money will be spent on services and projects', pages: [3, 5, 6, 7, 9, 11] },
      { word: 'ballot', definition: 'The slip or system used by a citizen to cast a secret vote in an election', pages: [10] },
      { word: 'accountability', definition: 'The duty of public officials to explain their actions, report how public money is used, and answer to citizens', pages: [11, 12] },
    ],
    teacherGuide: {
      overview:
        'A strictly non-partisan JHS 2–3 civic education story set in the fictional town of Asasekro. Learners practise evaluating public claims using budget arithmetic, understanding why vote-buying harms long-term service delivery, respecting differing political views, and following up on local government accountability after elections.',
      learningObjectives: [
        'Evaluate whether a public promise is credible by comparing its estimated cost against an official budget (300,000 cedis vs 5,000,000 cedis on a 500,000-cedi budget).',
        'Explain why vote-buying undermines public accountability over a four-year (1,460-day) term.',
        'Describe how the secret ballot and peaceful civic debate protect democratic rights.',
        'Explain how citizens and honest public officials work together through post-election budget tracking.',
      ],
      discussionPrompts: [
        'Why did Mrs Mensah remind the class that public projects are funded by taxpayers’ money rather than a politician’s personal pocket?',
        'How did comparing the 500,000-cedi District Assembly budget with each candidate’s promises help Uncle Yaw think differently?',
        'Why does Kofi divide a 50-cedi handout across 1,460 days (4 years), and what happens to public services when elections are treated like cash auctions?',
        'How can citizens ask firm accountability questions while still treating public servants and neighbours with respect?',
      ],
      classroomActivities: [
        'Community Budget Challenge: Give groups a fictional 500,000-cedi town budget and a menu of 7 costed community projects (clinic roof, boreholes, footbridge, library books, market drains, streetlights, sports pitch). Ask each group to select and justify a balanced plan that does not exceed 500,000 cedis.',
        'Evidence vs Slogan Sort: Read six fictional campaign statements and classify each as "Specific & Costed Evidence" or "Vague Uncosted Slogan".',
      ],
      crossCurricularLinks: ['Social Studies (JHS): Citizenship, Local Government (District Assemblies) & Elections', 'Mathematics: Large-Number Addition, Division & Budget Percentages', 'English Language: Critical Reading, Debate & Persuasive vs Evidentiary Claims'],
      discoveryStatus: {
        established: [
          'In Ghana’s local government system, Metropolitan, Municipal and District Assemblies (MMDAs) prepare composite budgets and Medium-Term Development Plans funded through Internally Generated Funds (IGF), the District Assemblies Common Fund (DACF) and other statutory transfers.',
          'Under Ghanaian electoral law, bribery, treating and undue influence to buy or coerce votes are electoral offences, and the secrecy of the ballot is guaranteed by the 1992 Constitution.',
        ],
        underInvestigation: [
          'Civic-technology researchers across Africa study how open-budget dashboards and community scorecards improve local project completion rates.',
        ],
      },
      investigation: {
        title: 'Cost-Per-Day Civic Maths Check',
        Materials: 'Exercise book, pencil, and a basic calculator.',
        steps: [
          'Write down the length of a four-year local term in days: 4 × 365 = 1,460 days.',
          'Divide a 50-cedi election handout by 1,460 days (50 ÷ 1,460 ≈ 0.034 cedis, or about 3.4 pesewas per day).',
          'Now compare that 3.4 pesewas per day with the value of clean borehole water and a dry clinic roof serving 5,000 residents every day for 1,460 days.',
        ],
        explanation:
          'Breaking a one-off handout down across the 1,460 days of a term shows mathematically why trading public services for a small gift is a poor bargain for any community.',
      },
      factCheck:
        'Strictly non-partisan: uses a fictional town (Asasekro) and neutral fictional candidates with no real political party names, colours, symbols or slogans. Verified arithmetic: 120,000 + 80,000 + 100,000 = 300,000 cedis out of 500,000 cedis; 50 cedis ÷ 1,460 days ≈ 3.4 pesewas/day.',
    },
    narrationPlan: {
      voice: 'Clear, balanced, non-partisan Ghanaian narrator (en-GH); curious and thoughtful for Kofi and Ama, warm and authoritative for Mrs Mensah.',
      pace: 'Medium (about 125 words per minute); pause clearly on the budget comparisons on pages 6–8.',
      notes: ['Pronounce Kofi ("KOH-fee"), Ama ("AH-mah") and Yaw ("YAHW") naturally.'],
    },
    music: 'Optional subtle acoustic guitar and soft shaker rhythm; off by default.',
    culturalNotes: [
      'Reflects Ghana’s tradition of community town-hall forums and District Assembly participatory budgeting while remaining 100% fictional and non-partisan.',
    ],
    reviewQuestions: [
      'Is the story completely free of partisan cues while teaching rigorous budget and civic literacy for JHS 2–3?',
    ],
  },

  // ====================================================================================================================
  // 2. The River That Lost Its Voice (Primary 6-JHS 2, 12 pages, Galamsey, Turbidity vs Lab Testing & Sustainable Livelihoods)
  // ====================================================================================================================
  {
    key: 'the-river-that-lost-its-voice',
    set: 'extension',
    title: 'The River That Lost Its Voice',
    summary:
      'Twelve-year-old Esi and her grandfather Nana Kwaku notice that the once-clear Subri stream near their farming town has turned thick and yellowish-brown from destructive illegal mining upstream, leading Esi’s class and certified environmental scientists to investigate sediment, water treatment, laboratory testing for heavy metals, and lawful, sustainable livelihoods.',
    classification: base({
      classIds: ['primary-6', 'jhs-1', 'jhs-2'],
      ageMin: 11,
      ageMax: 14,
      readingLevel: 'fluent',
      difficulty: 4,
      genres: ['science', 'realistic-fiction', 'educational'],
      themes: ['animals-and-habitats', 'community', 'citizenship', 'health-and-wellbeing'],
      objectives: ['environmental-awareness', 'scientific-curiosity', 'critical-thinking', 'citizenship', 'responsibility', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['village-life', 'local-names'],
      estimatedDurationSec: 450,
    }),
    palette: ['#0f766e', '#b45309'],
    characters: [
      'Esi: a twelve-year-old Ghanaian girl in JHS 1, keen young scientist, wearing a forest-green school pinafore over a white blouse and carrying a field notebook.',
      'Nana Kwaku: Esi’s sixty-year-old grandfather, a respected cocoa and vegetable farmer, wearing a neat blue work shirt and woven straw hat.',
      'Dr Adwoa Mensah: a certified water-quality scientist from the Environmental Protection Agency (EPA) and Water Resources Commission field team, wearing a white lab coat over field trousers, nitrile gloves and safety goggles.',
      'Kojo: a twenty-two-year-old youth from the town who previously worked at an illegal mining pit and later joins the licensed land-reclamation and agro-forestry cooperative.',
    ],
    pages: [
      {
        text: 'Years earlier, when twelve-year-old Esi was only in Primary 2, the river beside her town sang a clear, bubbling song over smooth grey pebbles. Silver tilapia darted beneath overhanging fern fronds, and Nana Kwaku’s riverside vegetable beds gleamed green. Now that she was in JHS 1, however, the river had lost its voice. Instead of sparkling over stones, it crept past like thick, yellowish-brown soup.',
        alt: 'Twelve-year-old Esi and her grandfather Nana Kwaku stand on the high bank looking down at a river that has turned thick and muddy yellowish-brown.',
        motif: '🏞️😟',
        brief: 'Lush Ghanaian riverbank split by contrast: Esi (12, forest-green school pinafore, white blouse, notebook) and Nana Kwaku (60, blue shirt, straw hat) standing safely on the high grassy bank looking down with concern at a thick, turbid yellowish-brown river.',
        narration: 'Poetic, evocative opening contrasting the clear singing stream of memory with the silent, muddy water today.',
      },
      {
        text: 'Esi took a step down the bank with an empty glass jar, hoping to scoop a sample for her school science club. ‘Stop right there, Esi!’ called Nana Kwaku firmly, holding her shoulder back on the dry path. ‘Never touch, wade into, or scoop polluted river water with your bare hands! Upstream, unregulated machines have been digging up the riverbed for gold, galamsey, and only trained scientists in protective gear should collect samples.’',
        alt: 'Nana Kwaku firmly keeps Esi back on the safe dry bank away from the muddy river water.',
        motif: '🛑🧤',
        brief: 'On the high dry path well above the water: Nana Kwaku placing a protective hand on Esi’s shoulder so she stays far back from the muddy river edge, while Esi nods and puts her empty jar back into her bag.',
        narration: 'Essential safety rule: children must never touch or sample polluted river water themselves.',
      },
      {
        text: 'At school the next day, Esi’s science teacher invited Dr Adwoa Mensah, a certified water-quality scientist working with the Environmental Protection Agency and the Water Resources Commission, to visit the town. Wearing thick protective gloves, boots and goggles, Dr Mensah used a long telescopic sampling pole from the bridge to collect river water into sealed laboratory bottles.',
        alt: 'Dr Adwoa Mensah, wearing protective gloves, boots and goggles, uses a long sampling pole from the bridge while Esi and her classmates watch from a safe distance.',
        motif: '👩‍🔬🧪',
        brief: 'From a sturdy concrete bridge with railings: Dr Adwoa Mensah (white lab coat over field trousers, blue nitrile gloves, safety goggles) lowering a long metal sampling rod into the brown river below, while Esi and classmates watch safely behind the bridge rail.',
        narration: 'Show proper professional sampling protocol and safety equipment.',
      },
      {
        text: 'Back at the school veranda, Dr Mensah held up one sealed transparent bottle of river water beside a bottle of clean tap water. ‘Look at the thick cloudiness in the river bottle,’ she said. ‘Scientists call this high turbidity, caused by suspended sediment, fine clay, silt and sand churned up when excavators strip away riverbank soil and wash gold-bearing gravel directly in the stream.’',
        alt: 'Dr Mensah holds up a sealed bottle of cloudy brown river water beside a sealed bottle of crystal-clear water.',
        motif: '🍼🔍',
        brief: 'School veranda demonstration table: Dr Mensah in gloves holding two tightly sealed glass bottles, one brown and opaque with suspended sediment, the other crystal clear, as Esi and classmates observe.',
        narration: 'Clear scientific explanation of turbidity and suspended sediment.',
      },
      {
        text: '‘How does suspended sediment harm the river’s living things, even before we talk about chemicals?’ asked Esi. ‘In three ways,’ explained Dr Mensah. ‘First, muddy water blocks sunlight from reaching underwater plants, stopping photosynthesis. Second, heavy silt clogs the delicate gills of fish and smothers fish eggs on the riverbed. Third, it fills up the deep channel, making floods worse during heavy rains!’',
        alt: 'Dr Mensah shows a diagram of how muddy water blocks sunlight from aquatic plants and clogs fish gills.',
        motif: '🐟🌿',
        brief: 'Dr Mensah pointing to a large visual flipchart showing two river cross-sections: a healthy blue stream with green plants and fish, and a brown stream where sunbeams cannot penetrate (no text).',
        narration: 'Explain the ecological chain: blocked sunlight → lost plants/oxygen → clogged gills and smothered eggs.',
      },
      {
        text: 'Then a classmate shouted, ‘I can see mercury in that brown bottle!’ Dr Mensah raised a finger carefully. ‘Let us think like real scientists. Can your eyes see dissolved mercury or heavy metals just by looking at muddy brown water? No! Brown colour proves there is suspended soil and sediment. Confirming whether toxic mercury or arsenic is present requires specialised laboratory instruments.’',
        alt: 'Dr Mensah explains the scientific difference between visible mud (turbidity) and invisible chemical contaminants that require laboratory testing.',
        motif: '🔬⚖️',
        brief: 'Close view of Dr Mensah pointing from the cloudy bottle to a photograph of a laboratory spectrometer machine (no text), while Esi writes carefully in her notebook.',
        narration: 'Crucial scientific rule: distinguish visible evidence of turbidity from laboratory-confirmed chemical contamination.',
      },
      {
        text: '‘Why do some illegal mining sites use mercury at all?’ asked Esi. ‘In poorly regulated operations,’ said Dr Mensah, ‘mercury is sometimes mixed with crushed ore to bind tiny gold specks into an amalgam, and then burned off. If mercury enters a river, bacteria convert it into methylmercury, which builds up in fish and can severely damage human nerves, kidneys and growing children’s brains.’',
        alt: 'A scientific diagram illustrates how chemical pollutants enter aquatic food chains and why laboratory monitoring protects public health.',
        motif: '⚠️🧬',
        brief: 'Visual science chart on the easel showing small aquatic organisms, larger fish, and a red warning shield over a dinner plate (no words or letters).',
        narration: 'Serious, accurate explanation of bioaccumulation and public health risk.',
      },
      {
        text: 'Next, the class visited the regional water-treatment plant intake with Dr Mensah. The station engineer showed them how extreme turbidity forced the plant to shut down its pumps for hours to protect the machinery, and tripled the amount of alum and treatment chemicals needed to make the water safe for homes and hospitals. Meanwhile, Nana Kwaku could no longer irrigate his vegetables from the stream, and cocoa farms had been dug into open pits.',
        alt: 'At a water-treatment plant, an engineer points to clogged intake screens while Dr Mensah, Esi and Nana Kwaku listen.',
        motif: '🏭🚰',
        brief: 'Clean municipal water-treatment facility walkway: a Ghanaian water engineer in a blue hard hat showing Dr Mensah, Nana Kwaku and Esi a settling tank where thick brown sludge is being filtered out.',
        narration: 'Connect environmental damage to economic costs: water-treatment shutdowns, chemical costs, and lost farm livelihoods.',
      },
      {
        text: 'At the town community meeting that Friday, twenty-two-year-old Kojo stood up honestly. ‘I worked at an unregulated pit for six months because I needed money after school,’ Kojo admitted quietly. ‘A middleman took most of the gold money, my friend injured his leg when a pit wall collapsed, and now the very stream my mother drinks from is spoiled. We young people want honest work that does not destroy our home!’',
        alt: 'At a town meeting, young Kojo speaks honestly to elders, farmers and Dr Mensah about why youth need safe, lawful livelihoods.',
        motif: '🗣️🤝',
        brief: 'Under the town palaver pavilion: Kojo (22, brown polo shirt) standing respectfully and speaking with heartfelt honesty as Nana Kwaku, Dr Mensah, the chief and townspeople listen with empathy.',
        narration: 'Empathetic, balanced portrayal: condemn the destructive practice while understanding the economic pressures on youth and pointing to lawful solutions.',
      },
      {
        text: 'One week later, Dr Mensah returned with the official certified laboratory report from Accra. The lab tests confirmed both dangerous turbidity and elevated mercury levels downstream of the illegal pits, providing verified legal evidence! The community elders, the District Assembly and the Water Resources Commission used that report to halt the illegal dredging and launch a licensed land-reclamation project.',
        alt: 'Dr Mensah presents the official laboratory report to the town elders and District Assembly officers.',
        motif: '📄✅',
        brief: 'At the community hall table: Dr Mensah presenting a sealed laboratory report folder with green-and-red graphs (no text) to Nana Kwaku, the traditional chief in kente cloth, and District Assembly officers.',
        narration: 'Show how verified laboratory evidence powers lawful institutional action.',
      },
      {
        text: 'Kojo and thirty young men and women joined a paid reclamation and agro-forestry cooperative. Trained by engineers and agronomists, they backfilled dangerous open pits with rock and subsoil, spread rich compost, and planted fast-growing bamboo, oil palm and native riverbank trees whose roots hold soil in place and filter runoff naturally.',
        alt: 'Kojo and young adult workers in safety boots refill old pits and plant bamboo and native trees along the riverbank buffer zone.',
        motif: '🌱🚜',
        brief: 'Sunny landscape restoration site: Kojo and young Ghanaian men and women in safety vests and boots planting green bamboo and tree saplings across graded, reclaimed land beside the river buffer zone.',
        narration: 'Hopeful, practical engineering and livelihood solution: land reclamation and riparian buffer planting.',
      },
      {
        text: 'Eighteen months later, Esi stood with Nana Kwaku and Dr Mensah on the bridge. The river was not completely healed overnight, restoring an ecosystem takes years of vigilance, but the water ran clearer, green reeds lined the banks, and tiny fingerlings darted in the shallows again. ‘A river cannot speak in court or parliament,’ Esi wrote in her notebook, ‘so science, law and caring citizens must be its voice.’',
        alt: 'Standing on the bridge eighteen months later, Esi, Nana Kwaku, Kojo and Dr Mensah look down at a much clearer stream lined with young green bamboo and trees.',
        motif: '🏞️💚',
        brief: 'Golden morning light on the bridge: Esi, Nana Kwaku, Kojo and Dr Mensah looking down happily as clearer blue-green water flows over pebbles between lush newly planted riverbank trees.',
        narration: 'Realistic, moving conclusion: healing takes years, and science + law + citizens give the river its voice.',
      },
    ],
    activities: [
      {
        id: 'river-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why did Nana Kwaku stop Esi from scooping the muddy river water with her own jar?',
        options: [
          'Polluted water is unsafe; only trained scientists in gear sample it',
          'Glass jars melt instantaneously when they touch river water',
          'Nana Kwaku wanted to drink the muddy water himself',
        ],
        correctIndex: 0,
        explanation: 'Children must never touch, wade into, or sample polluted water; certified scientists use protective equipment and sampling poles.',
      },
      {
        id: 'river-v1',
        type: 'vocabulary',
        afterPage: 4,
        word: 'turbidity',
        definition: 'Cloudiness in water caused by suspended particles of soil, silt and clay',
        distractors: [
          'The speed of wind blowing over a mountain',
          'A certificate given to cocoa farmers',
        ],
      },
      {
        id: 'river-c2',
        type: 'comprehension',
        afterPage: 6,
        question: 'Why could the students NOT prove mercury was in the bottle just by looking at the brown colour?',
        options: [
          'Brown shows mud; dissolved heavy metals require lab tests to confirm',
          'Mercury turns river water bright purple with yellow stars',
          'Mercury only exists on other planets',
        ],
        correctIndex: 0,
        explanation: 'Visual observation only shows turbidity (suspended sediment); identifying chemical contaminants like mercury requires certified laboratory analysis.',
      },
      {
        id: 'river-c3',
        type: 'comprehension',
        afterPage: 11,
        question: 'How did the town address both the environmental damage and the youth unemployment problem?',
        options: [
          'By stopping illegal mining and employing youth to reclaim the land',
          'By paving over the entire river with concrete',
          'By asking Primary 6 pupils to dig the pits by hand',
        ],
        correctIndex: 0,
        explanation: 'Lawful enforcement paired with paid land reclamation, bamboo buffer planting and agro-forestry created safe livelihoods while healing the land.',
      },
      {
        id: 'river-s1',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Order the steps that helped protect and begin healing the river.',
        items: [
          'Stay safely away from polluted water and alert certified scientists.',
          'Test water samples in a laboratory to confirm sediment and chemical levels.',
          'Enforce environmental laws and employ youth to reclaim land and plant buffers.',
        ],
      },
      {
        id: 'river-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'How did listening to both Dr Mensah’s scientific evidence and Kojo’s honest story help the community find a lasting solution?',
        feelingOptions: ['Protective', 'Empathetic', 'Scientific', 'Hopeful'],
      },
    ],
    glossary: [
      { word: 'turbidity', definition: 'The cloudiness or haziness of water caused by suspended soil, silt and clay particles', pages: [4, 8, 10] },
      { word: 'sediment', definition: 'Solid particles of soil, sand and silt carried in water or settled on a riverbed', pages: [4, 5] },
      { word: 'photosynthesis', definition: 'The process by which green plants use sunlight to make food and release oxygen', pages: [5] },
      { word: 'mercury', definition: 'A toxic heavy metal that can poison water, fish and human nervous systems if released during mining', pages: [6, 7, 10] },
      { word: 'reclamation', definition: 'Restoring damaged, mined land by refilling pits, rebuilding soil and planting vegetation', pages: [11] },
    ],
    teacherGuide: {
      overview:
        'An upper-primary and JHS environmental science and citizenship story examining the ecological, health and economic impacts of destructive illegal mining (galamsey) on Ghana’s rivers. It teaches the rigorous scientific distinction between visible turbidity and laboratory-verified chemical contamination, strict child safety around polluted water, and how law enforcement must be paired with sustainable youth livelihoods and land reclamation.',
      learningObjectives: [
        'Explain how high turbidity and suspended sediment harm aquatic ecosystems (blocking sunlight for photosynthesis, clogging fish gills, silting riverbeds) and raise water-treatment costs.',
        'Distinguish between visible evidence of sediment pollution and laboratory-confirmed identification of chemical contaminants such as mercury.',
        'Follow strict safety rules: never touch, wade into, or sample polluted water without professional adult supervision and protective equipment.',
        'Explain how environmental protection, lawful governance (EPA Ghana, Water Resources Commission) and sustainable youth employment work together.',
      ],
      discussionPrompts: [
        'Why did Nana Kwaku immediately stop Esi from stepping down the bank to scoop water from the muddy stream?',
        'When a classmate said "I can see mercury in that brown bottle!", how did Dr Mensah correct that statement using scientific reasoning?',
        'How does river pollution upstream affect people living in towns many kilometres downstream who rely on treated tap water and farm irrigation?',
        'Why was it important for the town to create lawful reclamation and agro-forestry jobs for young people like Kojo alongside stopping the illegal pits?',
      ],
      classroomActivities: [
        'Clean Classroom Settling Jar (Safe Soil Only): Mix one spoonful of clean garden soil into a jar of tap water and compare it with a jar of plain tap water. Shine a torch through both jars to observe how suspended soil blocks light (turbidity), then watch how sand settles first while fine clay stays suspended for hours.',
        'Riparian Buffer Sketch: Draw a cross-section of a river showing how a 50-metre green belt of bamboo and native trees holds soil with its roots and filters rainwater runoff.',
      ],
      crossCurricularLinks: ['Science: Water Quality, Mixtures/Suspensions, Food Chains & Bioaccumulation', 'Social Studies: Environmental Degradation, Water Resources Commission, EPA & Sustainable Livelihoods', 'Health Education: Safe Water & Chemical Hazard Awareness'],
      discoveryStatus: {
        established: [
          'High turbidity from alluvial mining strips riverbank topsoil, blocks light needed by aquatic primary producers, smothers benthic habitats, and severely increases coagulant (alum) demand and pump wear at Ghana Water Limited treatment plants.',
          'Dissolved or trace heavy metals (such as mercury or arsenic) cannot be identified by visual colour alone; confirmation requires certified analytical chemistry methods (such as atomic absorption spectroscopy).',
        ],
        underInvestigation: [
          'Ghanaian environmental scientists and soil engineers are researching phytoremediation (using specialised plants and biochar) to help rehabilitate degraded mining soils faster.',
        ],
      },
      investigation: {
        title: 'Safe Classroom Torch & Turbidity Test',
        Materials: 'Two clear plastic cups of clean tap water, one teaspoon of clean dry garden soil, a white card, and a small torch (never use polluted river water!).',
        steps: [
          'Leave Cup A filled with clear tap water. Stir one teaspoon of clean garden soil into Cup B to simulate suspended sediment.',
          'Hold the white card behind Cup A and shine the torch through the side, notice how bright the light is on the card.',
          'Shine the torch through Cup B, notice how the suspended soil scatters and blocks the light beam, just as turbid water blocks sunlight from underwater plants.',
        ],
        explanation:
          'Suspended particles scatter and absorb light waves (the Tyndall/turbidity effect), demonstrating why muddy rivers lose underwater plant life and dissolved oxygen.',
      },
      factCheck:
        'Explicitly enforces child safety (never touch or sample polluted water), distinguishes visible turbidity from laboratory-confirmed mercury contamination, and presents a constructive, non-demonizing view of youth livelihoods and environmental law.',
    },
    narrationPlan: {
      voice: 'Expressive, caring Ghanaian narrator (en-GH); firm and protective for Nana Kwaku, crisp and scientific for Dr Mensah, earnest for Esi and Kojo.',
      pace: 'Medium (about 120 words per minute).',
      notes: ['Pronounce Esi ("EH-see"), Kwaku ("KWAY-koo"), Adwoa ("ah-JOH-ah") and Kojo ("KOH-joh") clearly.'],
    },
    music: 'Optional gentle flowing water and acoustic guitar motif; off by default.',
    culturalNotes: [
      'Addresses one of Ghana’s most pressing environmental challenges (waterbody protection and galamsey) through science, safety and community restoration.',
    ],
    reviewQuestions: [
      'Is the distinction between visible sediment and lab-tested mercury clear, and is the safety warning against touching polluted water unmistakable?',
    ],
  },

  // ====================================================================================================================
  // 3. The Journey That Almost Took Everything (JHS 2-3, 12 pages, Migration, Misinformation, Legal Pathways & Local Opportunity)
  // ====================================================================================================================
  {
    key: 'the-journey-that-almost-took-everything',
    set: 'extension',
    title: 'The Journey That Almost Took Everything',
    summary:
      'Twenty-year-old Kwabena, frustrated after months of searching for steady work, is tempted by a flashy social-media agent promising an instant job abroad through an unverified overland route for 35,000 cedis, until his JHS sister Afia, his cousin Uncle Tetteh who returned from an unsafe journey, and a nurse cousin working legally abroad help him separate dangerous fraud from legal migration and real technical careers in Ghana.',
    classification: base({
      classIds: ['jhs-2', 'jhs-3'],
      ageMin: 13,
      ageMax: 15,
      readingLevel: 'proficient',
      difficulty: 5,
      genres: ['realistic-fiction', 'educational', 'family'],
      themes: ['careers', 'family', 'money-and-enterprise', 'peer-pressure'],
      objectives: ['critical-thinking', 'financial-literacy', 'problem-solving', 'emotional-intelligence', 'reasoning', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 460,
    }),
    palette: ['#1e3a8a', '#d97706'],
    characters: [
      'Kwabena: Afia’s twenty-year-old older brother, a hardworking senior-high graduate with a talent for fixing electrical appliances, wearing a neat blue collared shirt.',
      'Afia: Kwabena’s fourteen-year-old sister in JHS 3, observant and research-minded, wearing a yellow blouse and navy skirt.',
      'Uncle Tetteh: a thirty-year-old family friend and returnee who now runs a busy solar-and-electrical workshop in town, wearing a khaki work shirt.',
      'Sister Akua: their cousin working legally as a registered nurse abroad, seen on a family video call wearing hospital scrubs.',
    ],
    pages: [
      {
        text: 'For eighteen months after finishing senior high school, twenty-year-old Kwabena woke up at dawn to repair neighbours’ fans and irons on the veranda while applying for factory and office jobs. Some weeks he earned eighty cedis; other weeks, almost nothing. One rainy evening, his fourteen-year-old sister Afia saw him staring at a flashy phone video of a stranger posing beside a sports car in Europe.',
        alt: 'Twenty-year-old Kwabena sits on the veranda beside his small electrical repair toolkit, looking at a flashy video on his phone while fourteen-year-old Afia watches.',
        motif: '📱🧰',
        brief: 'Warm family veranda in a Ghanaian town: Kwabena (20, blue collared shirt, multimeter and small electric fan on a worktable) looking longingly at a smartphone screen while his sister Afia (14, yellow blouse, navy skirt) stands beside him with concern.',
        narration: 'Empathetic, dignified opening showing Kwabena’s genuine hard work and frustration.',
      },
      {
        text: '‘Look at this message, Afia,’ said Kwabena softly. ‘A man calling himself an international travel connection says that if our family sells Grandma’s cocoa plot and pays him thirty-five thousand cedis in cash by Friday, he will take me through an unverified route with no embassy interview and give me a hotel job paying twenty thousand cedis a month!’ Afia felt a chill of worry.',
        alt: 'Kwabena shows Afia a hurried text message demanding 35,000 cedis in cash with no official visa or contract.',
        motif: '💬⚠️',
        brief: 'Close view of Kwabena holding his phone while Afia points cautiously to a red warning icon on the screen (no readable text).',
        narration: 'Highlight the classic fraud red flags: selling family assets, cash payment to an unlicensed middleman, and claiming no embassy visa is needed.',
      },
      {
        text: 'When Kwabena told their parents at supper, Maame looked torn between worry and hope. ‘Many families sacrifice so a child can travel and help those at home,’ she said quietly. ‘Wanting a better life or travelling abroad is never shameful or unpatriotic. People migrate for education, work and family support all over the world. The question we must ask is whether this offer is truthful and safe!’',
        alt: 'Around the family supper table, Maame speaks calmly with Kwabena and Afia about making informed, safe choices.',
        motif: '🍲👨🏾‍👩🏾‍👧🏾‍👦🏾',
        brief: 'Warm Ghanaian family dining table in the evening: Maame and Papa listening earnestly to Kwabena and Afia, with a notebook placed beside the supper bowls.',
        narration: 'Crucial editorial balance: affirm the dignity of migrants and legitimate aspiration while insisting on truth and safety.',
      },
      {
        text: 'Afia opened her JHS Computing and Social Studies notebook. ‘Before anyone pays thirty-five thousand cedis, let us verify three facts,’ she said. ‘First, is this agent licensed by the Ghana Immigration Service or the Labour Department? Second, does the country he named allow work without an official embassy visa? Third, can we check the company name?’ When they searched the official registry, the agent’s company did not exist at all!',
        alt: 'Afia and Kwabena check the official government registry on a laptop and discover the agent’s company is not registered.',
        motif: '💻🔍',
        brief: 'At the table, Afia and Kwabena looking at a laptop displaying an official government shield and a red "not found" cross icon (no text), while Kwabena frowns in realisation.',
        narration: 'Practical verification steps every young person and family can use.',
      },
      {
        text: 'The next morning, Maame asked Kwabena and Afia to visit Uncle Tetteh at his busy electrical and solar workshop near the market. Five years earlier, Uncle Tetteh had believed a similar smuggler’s promise. Sitting beside his workbench, Uncle Tetteh spoke without shame or exaggeration, only quiet truth.',
        alt: 'In a bright solar-and-electrical workshop, Uncle Tetteh sits with Kwabena and Afia to share his real experience.',
        motif: '🛠️🗣️',
        brief: 'Well-organised Ghanaian electrical and solar workshop: Uncle Tetteh (30, khaki work shirt) sitting on a stool across from Kwabena and Afia, gesturing calmly and respectfully.',
        narration: 'Respectful, non-sensational tone as Uncle Tetteh shares his lived experience.',
      },
      {
        text: '‘The smuggler took my family’s thirty thousand cedis and promised a direct flight,’ Uncle Tetteh explained. ‘Instead, we were abandoned at a transit stop with fake papers, stranded without legal rights to work, and forced into unpaid labour until a humanitarian return programme helped us come home safely. Smugglers and traffickers profit from secrecy and false photos. They never show the debt, the danger, or the legal traps.’',
        alt: 'Uncle Tetteh points to a travel safety poster warning against fake visas, debt bondage and unlicensed smugglers.',
        motif: '🚫🛂',
        brief: 'Uncle Tetteh pointing to an educational migration-safety poster on his workshop wall showing a crossed-out fake passport and a shield protecting travellers (no text).',
        narration: 'Honest, non-graphic explanation of how smuggling and trafficking fraud exploit hopeful youth.',
      },
      {
        text: 'That evening, the family arranged a video call with their cousin Sister Akua, who worked legally as a registered nurse in the United Kingdom. ‘Travelling abroad legally is completely different from using a smuggler,’ Sister Akua told Kwabena warmly. ‘I completed my nursing qualification in Ghana, passed my official exams, signed a verified hospital contract, and obtained a work visa directly through the embassy.’',
        alt: 'On a tablet video call, cousin Akua in nursing scrubs explains how she migrated legally with verified qualifications and an official visa.',
        motif: '👩‍⚕️📹',
        brief: 'Family living room: Kwabena, Afia and Maame talking on a tablet video call with Sister Akua (wearing blue hospital scrubs with a stethoscope in a tidy apartment).',
        narration: 'Show what legitimate, safe, legal migration looks like.',
      },
      {
        text: '‘And let me be honest with you, Kwabena,’ Sister Akua added with a gentle smile. ‘Life abroad is not money growing on trees! I work long shifts, pay high rent, heating bills and taxes in winter, and budget carefully before sending remittances home. Whether you work abroad legally or build a career in Ghana, real success always requires certified skills, legal status and hard work.’',
        alt: 'Sister Akua holds up a monthly budget pie chart showing rent, taxes, bills and savings alongside her nursing study books.',
        motif: '📊❄️',
        brief: 'On the tablet screen, Sister Akua showing a simple pie chart of living costs (house icon, tax icon, savings icon, no text) with a snowy window behind her.',
        narration: 'Demystify life abroad with honesty and warmth: real work, real bills, and real skills.',
      },
      {
        text: 'Kwabena looked down at the thirty-five-thousand-cedi figure in Afia’s notebook. ‘If we do not give our family’s savings to a fraudster,’ he asked Uncle Tetteh the next day, ‘what can a young person actually build right here?’ Uncle Tetteh smiled and pointed to the solar inverters and cold-room panels queued up in his workshop. ‘We have a shortage of certified solar and industrial electrical technicians right here in our district!’',
        alt: 'Uncle Tetteh shows Kwabena a row of solar inverters and control panels waiting to be installed for local farms and clinics.',
        motif: '☀️⚡',
        brief: 'Inside Uncle Tetteh’s workshop: Uncle Tetteh showing Kwabena gleaming solar inverters, battery packs and testing meters on a clean workbench.',
        narration: 'Pivot from false desperation to tangible, high-demand technical opportunity in Ghana.',
      },
      {
        text: 'Together with his parents, Kwabena made a realistic, numbers-based plan. Instead of selling Grandma’s cocoa plot to pay thirty-five thousand cedis to a scammer, the family kept their land and invested four thousand five hundred cedis of saved capital: two thousand five hundred cedis for Kwabena’s accredited six-month solar-electrical certification at the technical institute, and two thousand cedis for professional diagnostic tools.',
        alt: 'Kwabena, Afia and their parents write a 4,500-cedi training-and-tools investment plan while keeping the family cocoa farm intact.',
        motif: '📓🎓',
        brief: 'At the family table: Kwabena and his parents smiling as Afia points to two neat stacks of coins beside a technical-institute brochure and a professional yellow multimeter (no text).',
        narration: 'Clear financial comparison: 4,500 cedis invested in accredited training + tools vs losing 35,000 cedis and family land to a scam.',
      },
      {
        text: 'Kwabena studied hard, earned his national technical certificate, and partnered with Uncle Tetteh to wire solar water pumps and backup power for clinics, poultry farms and cold stores across three districts. By his second year, Kwabena was earning a steady, dignified income of three thousand five hundred cedis a month, saving in a bank account, and training a younger apprentice of his own.',
        alt: 'Certified technician Kwabena installs solar panels on a rural clinic roof alongside Uncle Tetteh and a young apprentice.',
        motif: '🏥☀️',
        brief: 'Sunny Ghanaian clinic rooftop: Kwabena in a smart blue technician uniform, safety harness and hard hat installing solar panels with Uncle Tetteh, while Afia waves from the courtyard below.',
        narration: 'Realistic, earned progress over two years of accredited skill-building and hard work.',
      },
      {
        text: 'Two years later, Kwabena was invited to a short, fully funded solar-engineering workshop in Germany through an official embassy visa, and flew back home proudly to expand his Ghanaian workshop! ‘Whether a Ghanaian travels safely across the world or builds right here at home,’ Kwabena told Afia’s JHS class, ‘never gamble your life on a lie. Build real skills, verify the truth, and walk through legal doors with your head held high.’',
        alt: 'Kwabena holds his official passport and technical certificate as he speaks to Afia’s JHS class beside a solar model.',
        motif: '🌍🌟',
        brief: 'In Afia’s JHS classroom: Kwabena smiling confidently in his technician jacket, showing a small solar water-pump model and his official certificate folder to eager JHS students.',
        narration: 'Inspiring, balanced conclusion celebrating both safe global mobility and thriving local enterprise.',
      },
    ],
    activities: [
      {
        id: 'journey-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'What warning signs showed that the online travel agent’s offer was a dangerous scam?',
        options: [
          'He demanded 35,000 cedis cash, bypassed the embassy, and was unlicensed',
          'He asked Kwabena to study for an accredited electrical exam',
          'He advised the family to check the official government website first',
        ],
        correctIndex: 0,
        explanation: 'Demanding large cash payments, promising jobs without official embassy visas, and operating without a licence are major human-smuggling and fraud red flags.',
      },
      {
        id: 'journey-v1',
        type: 'vocabulary',
        afterPage: 4,
        word: 'verify',
        definition: 'To check whether a claim, licence or document is true and official using reliable sources',
        distractors: [
          'To believe a flashy video on social media without asking questions',
          'To sell family land in secret before Friday',
        ],
      },
      {
        id: 'journey-c2',
        type: 'comprehension',
        afterPage: 8,
        question: 'How did Cousin Akua’s legal work abroad differ from the smuggler’s false story?',
        options: [
          'She had verified nursing qualifications, an embassy visa and real bills',
          'She travelled without a passport and found money growing on trees',
          'She never had to study or work shifts at the hospital',
        ],
        correctIndex: 0,
        explanation: 'Legal migration relies on verified qualifications, contracts and embassy visas, and involves real hard work and living expenses.',
      },
      {
        id: 'journey-c3',
        type: 'comprehension',
        afterPage: 10,
        question: 'How much did Kwabena’s family invest in his accredited solar-electrical course (2,500 cedis) and diagnostic tools (2,000 cedis)?',
        options: [
          '4,500 cedis, saving their cocoa farm and avoiding the 35,000-cedi scam',
          '35,000 cedis in cash to an unregistered stranger',
          '100,000 cedis borrowed from a loan shark',
        ],
        correctIndex: 0,
        explanation: '2,500 cedis (training) + 2,000 cedis (tools) = 4,500 cedis, keeping the family land safe and building a real career.',
      },
      {
        id: 'journey-s1',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Order the steps that helped Kwabena make a safe, successful life decision.',
        items: [
          'Pause and verify the online agent’s claims with family and official registries.',
          'Listen to honest facts from returnees and legal professionals abroad.',
          'Invest 4,500 cedis in accredited solar training and build a trusted business.',
        ],
      },
      {
        id: 'journey-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'Why was it important that Maame and Uncle Tetteh treated Kwabena’s frustration with empathy and respect while still protecting him from a dangerous lie?',
        feelingOptions: ['Supported', 'Wise', 'Dignified', 'Hopeful'],
      },
    ],
    glossary: [
      { word: 'unpatriotic', definition: 'Not showing love or support for one’s country (the story explains that migrating safely for work or study is not unpatriotic)', pages: [3] },
      { word: 'verify', definition: 'To confirm that information or a licence is genuine by checking official authorities', pages: [4, 12] },
      { word: 'embassy', definition: 'The official diplomatic office of a foreign country that issues legal visas', pages: [2, 4, 7, 12] },
      { word: 'remittances', definition: 'Money sent home by a worker living abroad to support their family', pages: [8] },
      { word: 'accredited', definition: 'Officially recognised and certified as meeting national educational or professional standards', pages: [10] },
    ],
    teacherGuide: {
      overview:
        'A compassionate, realistic JHS 2–3 life-skills and civic story addressing youth unemployment, migration misinformation, human-trafficking/smuggling fraud, legal migration pathways, and technical/entrepreneurial opportunities in Ghana. It affirms the dignity of migrants while teaching young people how to verify visas, spot scams, and build marketable skills.',
      learningObjectives: [
        'Identify the warning signs of recruitment fraud, human smuggling and trafficking scams on social media.',
        'Distinguish between irregular/unsafe migration and safe, legal migration pathways (accredited skills, official contracts, embassy visas, Ghana Immigration Service / Labour Department verification).',
        'Compare the financial outcome of a 35,000-cedi scam versus a planned 4,500-cedi (2,500 + 2,000) investment in accredited technical skills and tools.',
        'Treat both migrants and local workers with dignity and respect.',
      ],
      discussionPrompts: [
        'Why did Maame say that wanting a better life or migrating legally for study or work is not shameful or unpatriotic?',
        'What three verification questions did fourteen-year-old Afia ask before the family parted with 35,000 cedis?',
        'How did Uncle Tetteh’s honest story and Sister Akua’s video call together give Kwabena the complete picture of migration?',
        'Why did Kwabena later get invited to a short training workshop in Germany legally after he built certified solar skills at home?',
      ],
      classroomActivities: [
        'Verify-Before-You-Trust Checklist: Create a 4-point classroom checklist for evaluating any job or scholarship offer (1. Official embassy/ministry verification; 2. Written contract; 3. No secret cash fees to unlicensed middlemen; 4. Consult trusted family and official agencies).',
        'Opportunity Mapping: Research three high-demand technical, agricultural or digital skills in your district and the accredited TVET/university institutes in Ghana that teach them.',
      ],
      crossCurricularLinks: ['Social Studies: Migration, Human Rights, Ghana Immigration Service & Youth Employment', 'Computing: Digital Literacy & Detecting Online Recruitment Fraud', 'Mathematics: Financial Comparison & Return on Skill Investment'],
      discoveryStatus: {
        established: [
          'In Ghana, the Ghana Immigration Service (GIS), the Ministry of Employment and Labour Relations (Labour Department), and the Ministry of Foreign Affairs advise citizens to verify recruitment agencies and obtain visas solely through official embassies and high commissions.',
          'Fraudulent recruitment agents frequently use staged social-media videos and urgency tactics ("pay by Friday") to extract large sums from families.',
        ],
        underInvestigation: [
          'Development economists study how combining TVET certification with small startup tool-grants increases youth employment and reduces vulnerability to irregular migration networks.',
        ],
      },
      investigation: {
        title: 'Skill-Investment vs Scam-Loss Maths Analysis',
        Materials: 'Notebook, pencil, and calculator.',
        steps: [
          'Calculate the remaining family savings if a family has 35,000 cedis in land/savings and invests 2,500 cedis in accredited training + 2,000 cedis in tools (35,000 − 4,500 = 30,500 cedis of family assets preserved).',
          'Calculate how many months it takes a certified technician earning 3,500 cedis/month (and saving 1,000 cedis/month) to recover the 4,500-cedi training and tool cost (4.5 months).',
          'Contrast this with losing all 35,000 cedis to an unlicensed smuggler with zero legal right to work.',
        ],
        explanation:
          'Comparing verified skill investments against high-risk unverified demands helps young people and families make calm, evidence-based life plans.',
      },
      factCheck:
        'Treats migrants with full dignity, avoids graphic scenes or operational border-crossing details, and verifies all cedi calculations (2,500 + 2,000 = 4,500 cedis invested vs 35,000 cedis demanded by the scammer).',
    },
    narrationPlan: {
      voice: 'Warm, empathetic Ghanaian narrator (en-GH); thoughtful and earnest for Kwabena and Uncle Tetteh, bright for Afia, clear and reassuring for Maame and Sister Akua.',
      pace: 'Medium (about 120 words per minute).',
      notes: ['Pronounce Kwabena ("kwah-BEH-nah"), Afia ("ah-FEE-ah"), Tetteh ("TEH-teh") and Akua ("ah-KOO-ah") clearly.'],
    },
    music: 'Optional warm acoustic guitar and gentle piano chords; off by default.',
    culturalNotes: [
      'Reflects real family decision-making in Ghana while promoting safe migration literacy and local TVET pride.',
    ],
    reviewQuestions: [
      'Does the story respect migrants’ dignity while clearly warning against unlicensed smugglers and celebrating local technical careers?',
    ],
  },

  // ====================================================================================================================
  // 4. Adwoa Refused to Be Limited (Primary 5-JHS 1, 11 pages, Girls in STEM, Shared Family Caregiving & Innovation)
  // ====================================================================================================================
  {
    key: 'adwoa-refused-to-be-limited',
    set: 'extension',
    title: 'Adwoa Refused to Be Limited',
    summary:
      'Eleven-year-old Adwoa loves gears, levers and building things, even when a neighbour claims engineering is only for boys. Encouraged by her parents, who share cooking, budgeting and workshop duties equally at home, her brother Kojo, and mechanical engineer Auntie Serwaa, Adwoa designs a pedal-powered groundnut sheller that shells thirty kilograms an hour instead of five.',
    classification: base({
      classIds: ['primary-5', 'primary-6', 'jhs-1'],
      ageMin: 10,
      ageMax: 13,
      readingLevel: 'fluent',
      difficulty: 3,
      genres: ['realistic-fiction', 'science', 'educational'],
      themes: ['technology', 'family', 'identity', 'leadership'],
      objectives: ['scientific-curiosity', 'problem-solving', 'respect', 'teamwork', 'perseverance', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-names', 'village-life'],
      estimatedDurationSec: 400,
    }),
    palette: ['#7c3aed', '#f59e0b'],
    characters: [
      'Adwoa: an eleven-year-old Ghanaian girl in Primary 6, bright eyes, natural hair tied in two neat puffs with purple ribbons, wearing a yellow polo shirt, denim overalls and carrying a small spanner and sketchbook.',
      'Kojo: Adwoa’s ten-year-old brother, supportive and cheerful, wearing a green t-shirt and khaki shorts.',
      'Papa Kwame: Adwoa and Kojo’s father, a warm carpenter and devoted dad in his thirties, wearing a blue shirt (and a clean patterned apron when cooking supper).',
      'Mama Esi: Adwoa and Kojo’s mother, an agricultural extension officer in her thirties, wearing a purple-and-gold wax-print top.',
      'Auntie Serwaa: a visiting mechanical engineer in her thirties, wearing a smartteal work shirt and safety glasses.',
    ],
    pages: [
      {
        text: 'Eleven-year-old Adwoa loved the way machines worked. Whenever a bicycle chain slipped or a doorknob rattled in their courtyard, Adwoa reached for her sketchbook and small spanner to study the gears and screws. One Saturday afternoon, while her grandmother’s farm cooperative shelled baskets of dried groundnuts by hand, Adwoa noticed how sore everyone’s thumbs became. Shelling just five kilograms of groundnuts by hand took a whole hour!',
        alt: 'Eleven-year-old Adwoa sketches in her notebook while watching women and men shell baskets of dried groundnuts by hand.',
        motif: '🥜⚙️',
        brief: 'Sunny Ghanaian courtyard: Adwoa (11, hair in two puffs with purple ribbons, yellow shirt, denim overalls, holding a sketchbook and small spanner) watching farm cooperative members shell bowls of dried groundnuts by hand.',
        narration: 'Warm, observant opening introducing Adwoa’s love for machines and the real-world problem she spots.',
      },
      {
        text: '‘What if I build a pedal-powered groundnut sheller for the school science and craft fair?’ Adwoa said excitedly. Passing by the gate, a neighbour chuckled and shook his head. ‘Adwoa, spanners, gears and welding are for boys! A girl should stick to sweeping and stirring the soup pot, while your brother Kojo learns technical work.’ Adwoa’s smile faded for a moment.',
        alt: 'An older neighbour shakes his head dismissively as Adwoa holds her spanner and sketchbook by the courtyard gate.',
        motif: '🔧🤨',
        brief: 'By the compound gate: Adwoa holding her small spanner and gear sketch looking momentarily hurt as a passing male neighbour gestures dismissively.',
        narration: 'Show the restrictive stereotype clearly without caricature.',
      },
      {
        text: 'Just then, Papa Kwame stepped out onto the veranda wearing his favourite kitchen apron and holding a wooden ladle, with the rich aroma of kontomire stew floating from the kitchen! Beside him, Mama Esi was reviewing farm-equipment drawings on her tablet, while ten-year-old Kojo hung clean laundry on the line. Papa Kwame smiled warmly at the neighbour and placed a gentle hand on Adwoa’s shoulder.',
        alt: 'Papa Kwame in a kitchen apron holds a ladle beside Mama Esi with her engineering tablet and Kojo hanging laundry.',
        motif: '🍲👨🏾‍🍳',
        brief: 'Warm family veranda scene: Papa Kwame (wearing a clean patterned apron over his blue shirt, holding a wooden ladle) smiling proudly with Mama Esi (holding a tablet) and brother Kojo (hanging clothes on a line).',
        narration: 'Warm, dignified scene showing shared household and caregiving responsibilities in action.',
      },
      {
        text: '‘In our home,’ Papa Kwame said kindly, ‘a spanner does not ask whether the hand holding it belongs to a girl or a boy, and neither does a cooking pot! When men and women, boys and girls share caregiving, cooking, budgeting and technical work with mutual respect, every person in the family grows stronger.’ Kojo grinned at his sister. ‘And Adwoa is the best machine builder in our class! Let us build that sheller together!’',
        alt: 'Papa Kwame, Mama Esi and Kojo encourage Adwoa at the veranda workbench.',
        motif: '🤝💜',
        brief: 'Around the veranda workbench: Papa Kwame and Mama Esi smiling encouragingly at Adwoa while brother Kojo hands her a bicycle sprocket.',
        narration: 'Heartfelt, positive affirmation of equal capability and shared family teamwork.',
      },
      {
        text: 'That afternoon, Mama Esi invited her friend Auntie Serwaa, a qualified Ghanaian mechanical engineer who designed farm machinery, to mentor Adwoa and Kojo. Auntie Serwaa examined Adwoa’s sketch carefully. ‘Your idea uses two simple machines working together,’ Auntie Serwaa explained. ‘The bicycle pedals and chain act as a wheel-and-axle system with a gear ratio, turning a wooden roller inside a curved wire mesh!’',
        alt: 'Mechanical engineer Auntie Serwaa studies Adwoa’s gear-and-roller drawing with Adwoa and Kojo.',
        motif: '📐👩🏾‍🔧',
        brief: 'At the workbench: Auntie Serwaa (teal work shirt, safety glasses on head) pointing to Adwoa’s drawing of a bicycle chain connected to a cylindrical drum and mesh sieve (no text).',
        narration: 'Clear, exciting STEM mentorship from Auntie Serwaa.',
      },
      {
        text: 'They gathered clean recycled parts: an old bicycle frame and pedals, a wooden cylinder carved with Papa Kwame’s supervision, and a curved wire screen. In Test 1, when Kojo pedalled fast, the wooden roller sat too close to the wire screen and crushed the groundnut kernels into paste! ‘Do not worry,’ said Auntie Serwaa. ‘Engineers adjust clearances by millimetres until the force is just right.’',
        alt: 'Adwoa, Kojo and Auntie Serwaa inspect crushed groundnuts after Test 1 and measure the gap with a ruler.',
        motif: '📏🥜',
        brief: 'Workshop table: Adwoa using a metal ruler to measure the narrow gap between a wooden roller and a wire mesh screen inside an open wooden hopper, while Kojo and Auntie Serwaa watch closely.',
        narration: 'Show real engineering problem-solving: measuring clearance and adjusting force.',
      },
      {
        text: 'Adwoa measured the average thickness of the groundnut pods and raised the roller bearings by eight millimetres. She also added a small paddle fan driven by a second belt. When the pods cracked open against the screen, the heavy groundnut kernels dropped straight into a clean bowl below, while the gentle wind from the fan blew the light dry shells out through a side chute, winnowing them automatically!',
        alt: 'Adwoa adjusts the roller height with her spanner and adds a small belt-driven fan to blow away the light shells.',
        motif: '💨⚙️',
        brief: 'Close view of the pedal-powered machine: Adwoa tightening a bolt with her spanner as clean red groundnut kernels drop into a steel bowl underneath and papery shells blow into a basket on the side.',
        narration: 'Step-by-step physics and mechanical design: friction cracks the shell, gravity drops the dense kernel, airflow separates the light husk.',
      },
      {
        text: 'Now it was time to measure the machine’s performance using maths! By hand, one person shelled five kilograms of groundnuts in one hour. When Adwoa and Kojo took turns pedalling their adjusted machine for ten minutes, it cleanly shelled five kilograms! ‘Ten minutes is one-sixth of an hour,’ calculated Adwoa. ‘Five kilograms times six equals thirty kilograms per hour, six times faster than shelling by hand!’',
        alt: 'Kojo times ten minutes on a stopwatch while Adwoa weighs five kilograms of cleanly shelled groundnuts on a scale.',
        motif: '⏱️⚖️',
        brief: 'In the courtyard: Kojo holding a stopwatch while Adwoa points to a mechanical dial scale holding a full bowl of clean groundnut kernels beside the pedal sheller (no numbers on the scale).',
        narration: 'Clear, verifiable arithmetic: 5 kg in 10 minutes × 6 = 30 kg per hour (6 times faster than 5 kg/hour by hand).',
      },
      {
        text: 'At the district STEM and Agricultural Fair on Friday, students, teachers and local farmers gathered around Adwoa and Kojo’s booth. Adwoa explained the gear ratio between the large front chainring and the smaller rear sprocket, while Kojo demonstrated how easily the pedals turned and how the fan separated shells from kernels without crushing the nuts.',
        alt: 'At the district STEM fair, Adwoa explains the gear mechanism while Kojo pedals and farmers watch clean groundnuts pour into the bowl.',
        motif: '🏆🚲',
        brief: 'Lively outdoor school science fair under a canopy (no text banners): Adwoa pointing confidently to the chainring and drum while Kojo pedals and a crowd of farmers, students and teachers watch in admiration.',
        narration: 'Proud, collaborative presentation by Adwoa and Kojo.',
      },
      {
        text: 'The very neighbour who had doubted Adwoa on Saturday stepped forward, examined the clean unbroken groundnut kernels in the bowl, and smiled sheepishly. ‘Adwoa, I was wrong,’ he said respectfully in front of the crowd. ‘Your mind and your hands have built something that will save our women and men hours of painful work every harvest. May our cooperative order two machines from your workshop?’',
        alt: 'The neighbour shakes Adwoa’s hand respectfully at the science fair while Papa Kwame, Mama Esi and Auntie Serwaa beam.',
        motif: '🙌🏾🌟',
        brief: 'At the fair table: the older male neighbour shaking Adwoa’s hand with genuine respect and warmth while Papa Kwame, Mama Esi, Auntie Serwaa and Kojo smile proudly.',
        narration: 'Gracious, restorative moment showing how excellence and respect change minds.',
      },
      {
        text: 'That evening, after Papa Kwame and Kojo washed the supper dishes and Mama Esi and Adwoa sketched improvements for a maize-shelling attachment, Adwoa wrote on the first page of her engineering notebook: Talent has no gender, and teamwork has no limits. When every girl and every boy is free to learn, build and care, the whole community rises together.',
        alt: 'At home in the evening, Adwoa and Mama Esi sketch a new machine design while Papa Kwame and Kojo dry dishes in the background.',
        motif: '📓🏡',
        brief: 'Warm family living room at night: Adwoa and Mama Esi sketching machine gears at the table while through the open kitchen doorway Papa Kwame and Kojo cheerfully dry plates together.',
        narration: 'Warm, inspiring conclusion celebrating equal opportunity and shared family partnership.',
      },
    ],
    activities: [
      {
        id: 'adwoa-stem-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Papa Kwame and Mama Esi respond to the idea that technical work is only for boys and housework is only for girls?',
        options: [
          'They showed that boys and girls can both build machines and share home duties',
          'They locked away Adwoa’s spanner and sketchbook',
          'They told Kojo he was never allowed to enter the kitchen',
        ],
        correctIndex: 0,
        explanation: 'Papa Kwame and Mama Esi modelled shared caregiving and domestic work while encouraging both Adwoa and Kojo in engineering.',
      },
      {
        id: 'adwoa-stem-v1',
        type: 'vocabulary',
        afterPage: 7,
        word: 'winnowing',
        definition: 'Using a current of air to blow away light chaff or shells from heavier grain or kernels',
        distractors: [
          'Boiling groundnuts in a pot of salted water',
          'Painting a bicycle frame purple and gold',
        ],
      },
      {
        id: 'adwoa-stem-c2',
        type: 'comprehension',
        afterPage: 6,
        question: 'When Test 1 crushed the groundnuts into paste, how did Adwoa fix the machine?',
        options: [
          'She measured the pods and raised the roller clearance by 8 millimetres',
          'She removed the pedals and threw the machine away',
          'She painted the wooden roller a brighter colour',
        ],
        correctIndex: 0,
        explanation: 'By measuring the pod size and increasing the gap between the roller and the wire mesh by 8 mm, the shells cracked without crushing the kernels.',
      },
      {
        id: 'adwoa-stem-c3',
        type: 'comprehension',
        afterPage: 8,
        question: 'If Adwoa’s machine shells 5 kg in 10 minutes, how many kilograms does it shell in 1 hour (60 minutes)?',
        options: [
          '30 kg per hour, six times faster than 5 kg per hour by hand',
          '10 kg per hour',
          '5 kg per hour',
        ],
        correctIndex: 0,
        explanation: 'There are six 10-minute periods in 60 minutes, so 5 kg × 6 = 30 kg per hour.',
      },
      {
        id: 'adwoa-stem-s1',
        type: 'sequencing',
        afterPage: 11,
        prompt: 'Order the steps of how Adwoa and her family built the groundnut sheller.',
        items: [
          'Spot the painful hand-shelling problem and sketch a pedal-powered design.',
          'Test the prototype, adjust the roller gap by 8 mm, and add a winnowing fan.',
          'Demonstrate the 30-kg-per-hour machine at the district STEM fair.',
        ],
      },
      {
        id: 'adwoa-stem-sel',
        type: 'sel',
        afterPage: 11,
        prompt: 'How did support from Papa Kwame, Mama Esi, Kojo and Auntie Serwaa help Adwoa stay confident when someone doubted her?',
        feelingOptions: ['Confident', 'Supported', 'Capable', 'Grateful'],
      },
    ],
    glossary: [
      { word: 'cooperative', definition: 'A group of farmers or workers who join together to share tools, processing and marketing', pages: [1, 10] },
      { word: 'clearances', definition: 'The carefully measured gaps between moving machine parts', pages: [6] },
      { word: 'winnowing', definition: 'Separating light husks or shells from heavier seeds using a stream of air', pages: [7] },
      { word: 'sprocket', definition: 'A toothed wheel that engages with a chain to transmit motion and force', pages: [9] },
    ],
    teacherGuide: {
      overview:
        'An uplifting Primary 5–JHS 1 story combining simple machines (wheel-and-axle, gear ratios, winnowing airflow) and rate arithmetic (5 kg per 10 minutes = 30 kg/hour) with a warm, constructive portrayal of gender equality in STEM and shared family caregiving.',
      learningObjectives: [
        'Explain how simple machines (pedals, chain-and-sprocket gears, rollers, winnowing fans) reduce human drudgery in agriculture.',
        'Calculate hourly production rates from 10-minute test data (5 kg × 6 = 30 kg/hour vs 5 kg/hour by hand).',
        'Recognise that engineering, leadership, cooking and caregiving abilities are not limited by gender.',
        'Practise respectful collaboration between girls and boys at school and at home.',
      ],
      discussionPrompts: [
        'Why did Papa Kwame say "a spanner does not ask whether the hand holding it belongs to a girl or a boy, and neither does a cooking pot"?',
        'How did Kojo and Adwoa work as true partners rather than competitors?',
        'What physical difference between groundnut kernels and dry shells allows the fan to separate them (winnowing)?',
        'How did the neighbour react when he saw the evidence of Adwoa’s working machine at the fair?',
      ],
      classroomActivities: [
        'Gear-Ratio Tooth Count: On a bicycle, count the teeth on the front chainring (e.g., 44 teeth) and the rear sprocket (e.g., 22 teeth) to see why one turn of the pedals turns the back wheel twice.',
        'Density & Winnowing Demo: Drop small pebbles and tiny torn bits of dry leaf in front of a hand fan to observe how airflow pushes light husks sideways while heavier seeds fall straight down.',
      ],
      crossCurricularLinks: ['Science & Career Technology: Simple Machines, Gears, Friction & Winnowing', 'Mathematics: Rates, Ratios & Multiplication (5 kg × 6 = 30 kg/hr)', 'Our World Our People / Social Studies: Gender Equality, Mutual Respect & Shared Family Responsibilities'],
      discoveryStatus: {
        established: [
          'Mechanical threshers and shellers use controlled shear clearance (slightly larger than the seed kernel, smaller than the outer pod) plus aerodynamic winnowing to separate grain from chaff.',
          'Educational research across Ghana and globally confirms that girls and boys have equal aptitude for mathematics, science and engineering when given equal encouragement and practice.',
        ],
        underInvestigation: [
          'Agricultural engineers in Ghana are designing solar- and pedal-powered multi-crop shellers with interchangeable screens for groundnuts, maize and cowpeas.',
        ],
      },
      investigation: {
        title: 'Airflow Winnowing Separation Test',
        Materials: 'A tray, 20 dried beans or small pebbles, 20 tiny pieces of dry paper or dry leaf husks, and a piece of stiff card to fan gently.',
        steps: [
          'Mix the 20 dried beans and 20 tiny paper husks together in a small cup.',
          'Pour the mixture slowly from a height of 20 cm onto the tray while a partner waves the stiff card gently from the side to create a light breeze.',
          'Observe where the heavy beans land compared with where the light paper husks blow!',
        ],
        explanation:
          'Because the heavy beans have greater mass relative to their surface area, gravity pulls them straight down into the bowl while air resistance carries the light husks away.',
      },
      factCheck:
        'Challenges restrictive gender stereotypes warmly without criticizing men or women as groups; shows supportive male and female role models (Papa Kwame, Kojo, Mama Esi, Auntie Serwaa); verifies the rate maths (5 kg in 10 min = 30 kg/hr vs 5 kg/hr by hand = 6× faster).',
    },
    narrationPlan: {
      voice: 'Warm, spirited Ghanaian storyteller (en-GH); bright and determined for Adwoa, cheerful for Kojo, warm and wise for Papa Kwame, Mama Esi and Auntie Serwaa.',
      pace: 'Medium (about 115 words per minute).',
      notes: ['Pronounce Adwoa ("ah-JOH-ah"), Kojo ("KOH-joh"), Kwame ("KWAH-meh"), Esi ("EH-see") and Serwaa ("sehr-WAAH") clearly.'],
    },
    music: 'Optional joyful highlife guitar and light percussion; off by default.',
    culturalNotes: [
      'Celebrates both Ghanaian women engineers and men who proudly share caregiving and cooking at home.',
    ],
    reviewQuestions: [
      'Does the story model mutual respect between girls and boys and shared family responsibility without blaming any group?',
    ],
  },

  // ====================================================================================================================
  // 5. The Town Where Everybody Waited (Primary 3-5, 10 pages, Safe Civic Action, Waste Sorting & Institutional Accountability)
  // ====================================================================================================================
  {
    key: 'the-town-where-everybody-waited',
    set: 'extension',
    title: 'The Town Where Everybody Waited',
    summary:
      'In a busy neighbourhood where everyone complains about litter and blocked roadside drains while waiting for "somebody else" to act, ten-year-old Yao and nine-year-old Akosua team up with their teacher Mr Mensah for a safe, adult-supervised school recycling drive and a community petition that brings the District Assembly sanitation crew and neighbours together.',
    classification: base({
      classIds: ['primary-3', 'primary-4', 'primary-5'],
      ageMin: 8,
      ageMax: 11,
      readingLevel: 'developing',
      difficulty: 3,
      genres: ['realistic-fiction', 'educational'],
      themes: ['citizenship', 'community', 'health-and-wellbeing', 'school'],
      objectives: ['citizenship', 'environmental-awareness', 'teamwork', 'responsibility', 'problem-solving', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 340,
    }),
    palette: ['#059669', '#f97316'],
    characters: [
      'Yao: a ten-year-old Ghanaian boy in Primary 4, energetic and observant, wearing a bright orange polo shirt and navy shorts.',
      'Akosua: Yao’s nine-year-old classmate and neighbour, neat braided hair with green beads, wearing a green-and-white checked dress.',
      'Mr Mensah: their Primary 4 teacher, wearing a collared cream shirt and carrying a clipboard.',
      'Honourable Tetteh: the local Assembly Member, wearing a neat blue northern smock and carrying an official work schedule.',
    ],
    pages: [
      {
        text: 'Every morning on Market Street, ten-year-old Yao and nine-year-old Akosua heard the same complaints. The bread seller sighed at plastic water sachets blowing past her stall. The trotro driver frowned at the overflowing skip container by the junction. The tailor shook his head at the roadside gutter choked with silt and bottles. Yet everyone ended with the exact same sentence: ‘Why hasn’t Somebody fixed this yet?’',
        alt: 'On a busy Ghanaian street, shopkeepers and drivers shrug at windblown plastic sachets and an overflowing bin while Yao and Akosua walk to school.',
        motif: '🗑️🤷🏾‍♂️',
        brief: 'Busy Ghanaian neighbourhood street: a bread seller, a driver and a tailor gesturing in frustration toward windblown plastic sachets and a full waste bin in the background, while Yao (10, orange polo shirt, navy shorts) and Akosua (9, green beads, green-and-white dress) observe thoughtfully.',
        narration: 'Lively, rhythmic opening capturing the everyday chorus of "Why hasn’t Somebody fixed this yet?".',
      },
      {
        text: 'At school, Akosua raised her hand in Mr Mensah’s class. ‘Sir, everyone in town is waiting for a person named Somebody! Can our class go and dig out the deep roadside gutter ourselves after school?’ Mr Mensah smiled warmly at her spirit, then raised his hand in a firm safety stop.',
        alt: 'In the Primary 4 classroom, Akosua raises her hand eagerly while Mr Mensah makes a calm safety stop gesture.',
        motif: '🏫✋🏾',
        brief: 'Bright Ghanaian primary classroom: Akosua raising her hand at her desk while Mr Mensah (cream collared shirt) smiles kindly and holds up a calm open palm to explain safety rules.',
        narration: 'Immediate, clear child-safety boundary from Mr Mensah.',
      },
      {
        text: '‘Your care for our town is wonderful, Akosua,’ said Mr Mensah, ‘but children must NEVER enter deep roadside gutters, touch sharp metal or broken glass, or handle medical or hazardous waste! Clearing heavy public drains and hauling municipal skips is the job of trained adult sanitation workers with boots, shovels and trucks. However, there are two powerful, safe things we CAN do!’',
        alt: 'Mr Mensah points to a safety chart showing adult sanitation workers with protective boots and trucks vs safe school recycling tasks.',
        motif: '🦺🚛',
        brief: 'Mr Mensah pointing to a two-part classroom illustration on the board: on one side adult municipal workers in high-visibility vests and boots operating a desilting truck; on the other side children sorting clean dry plastic bottles into colour-coded bins (no text).',
        narration: 'Crucial distinction: children never do hazardous cleanup or replace public sanitation services, but practice safe waste sorting and civic engagement.',
      },
      {
        text: '‘First,’ explained Mr Mensah, ‘we stop adding to the problem by sorting clean, dry recyclables right here in our school compound and homes. Second, we gather clear evidence and invite our local government representative, the Assembly Member, and our parents to do their part!’ That afternoon, with reusable gloves and Mr Mensah’s supervision, the class set up three painted barrels in the schoolyard: Green for clean plastic, Blue for paper and card, and Brown for fruit peels to make garden compost.',
        alt: 'Under Mr Mensah’s supervision in the schoolyard, Yao and Akosua place clean plastic bottles and paper into green, blue and brown sorting barrels.',
        motif: '♻️🛢️',
        brief: 'Clean sunny school courtyard: Mr Mensah supervising as Yao, Akosua and classmates wearing clean gardening gloves place dry plastic water bottles into a green barrel and scrap paper into a blue barrel (no text on barrels).',
        narration: 'Upbeat, safe, age-appropriate school waste segregation.',
      },
      {
        text: 'At the end of the week, a licensed plastic-recycling van visited the school gate to weigh their clean, dry collection. The class had collected forty kilograms of clean plastic bottles and sachets plus twenty kilograms of old paper and cardboard, sixty kilograms of waste kept out of the gutters! Even better, the recycler paid the school two cedis per kilogram of plastic, earning eighty cedis for new library storybooks!',
        alt: 'At the school gate, a recycling collector weighs the sacks of clean plastic bottles on a scale while Yao, Akosua and Mr Mensah celebrate.',
        motif: '⚖️📚',
        brief: 'By the school gate: a smiling recycling worker in a green vest weighing large net sacks of clean plastic bottles on a hanging scale beside a small pickup van, while Mr Mensah, Yao and Akosua cheer.',
        narration: 'Walk through the arithmetic clearly: 40 kg plastic + 20 kg paper = 60 kg; 40 kg × 2 cedis = 80 cedis for library books.',
      },
      {
        text: 'Next came Step Two: civic accountability! Walking safely along the dry pavement with Mr Mensah and two parents, Yao and Akosua conducted a Neighbourhood Sanitation Audit from a safe distance. Using a map and tally sheet, they recorded three places where public waste bins were missing and two junctions where the large municipal skip had not been emptied on schedule.',
        alt: 'Walking safely on the pavement with Mr Mensah and two parents, Yao and Akosua mark missing bin locations on a clipboard map.',
        motif: '🗺️📋',
        brief: 'Safe sidewalk view: Mr Mensah and two parents walking beside Yao and Akosua, who stand well back on the dry pavement marking coloured dots on a hand-drawn street map on a clipboard (no text).',
        narration: 'Show safe, adult-supervised civic observation and data collection.',
      },
      {
        text: 'With Mr Mensah’s help, the pupils and the Parent-Teacher Association wrote a polite, factual letter to Honourable Tetteh, the Assembly Member for their electoral area, attaching their map and sixty signatures from shopkeepers and parents. On Wednesday afternoon, Honourable Tetteh and an officer from the District Assembly Environmental Health Department arrived at the school hall to meet the community.',
        alt: 'In the school hall, Yao and Akosua present their colourful sanitation map to Honourable Tetteh, the environmental health officer and parents.',
        motif: '🏛️🤝',
        brief: 'School assembly hall meeting: Yao and Akosua standing beside Mr Mensah and parents, showing their colourful street map (with red and green pin icons, no text) to Honourable Tetteh (wearing a blue smock) and an environmental health officer.',
        narration: 'Model constructive, respectful engagement between citizens, schools and local government.',
      },
      {
        text: 'Honourable Tetteh studied the map and nodded seriously. ‘Thank you for bringing clear facts instead of just grumbling on the street,’ he said. ‘Our District Assembly collects market tolls and property rates to fund sanitation. I will make sure the Waste Management Department sets a fixed Tuesday and Friday truck schedule for the junction skip and installs four new lidded street bins this month!’',
        alt: 'Honourable Tetteh signs the new waste-collection schedule while the environmental health officer points to four new lidded bin locations on the map.',
        motif: '🚛✅',
        brief: 'Close view at the meeting table: Honourable Tetteh placing green checkmarks on the street map while shopkeepers, parents and Mr Mensah applaud.',
        narration: 'Explain clearly why local government is accountable: citizens pay tolls and rates, and the Assembly provides scheduled public services.',
      },
      {
        text: 'Then the environmental health officer turned to the shopkeepers, drivers and parents in the hall. ‘When the Assembly truck empties the skip and our adult crew clears the heavy drains on Saturday,’ she said, ‘every adult resident and trader must also keep a covered bin at their stall, stop sweeping plastic into the gutter, and report missed pickups promptly. Clean towns need both responsible citizens and working public services!’',
        alt: 'Adult municipal sanitation workers in boots and safety vests clear the roadside drain with long shovels while shopkeepers place covered bins beside their stalls.',
        motif: '👷🏾‍♂️🧹',
        brief: 'Sunny Saturday morning on Market Street: adult municipal sanitation workers in high-visibility vests, gloves and tall boots clearing the roadside drain into a dump truck, while adult shopkeepers sweep their dry verandas and place lidded bins by their stalls; Yao and Akosua watch happily from the school veranda with Mr Mensah.',
        narration: 'Show the proper division of labour: adult crews handle heavy drains and trucks, adult traders maintain covered bins, and children stay safe.',
      },
      {
        text: 'A month later, when the first heavy rains fell, rainwater flowed smoothly through the clear street drains without flooding a single shop! Market Street had new lidded bins, the skip truck arrived every Tuesday and Friday, and four more schools copied Primary 4’s recycling barrels. Yao and Akosua grinned at each other. Nobody was waiting for "Somebody" anymore, because citizens and local government were finally working together!',
        alt: 'On a clean, bright Market Street with lidded bins and clear drains, Yao, Akosua, Mr Mensah and Honourable Tetteh smile together.',
        motif: '🌈🏘️',
        brief: 'Clean, vibrant Ghanaian street after a light rain: clear drains, neat lidded bins along the pavement, smiling shopkeepers, and Yao, Akosua, Mr Mensah and Honourable Tetteh giving a thumbs-up.',
        narration: 'Cheerful, empowering conclusion.',
      },
    ],
    activities: [
      {
        id: 'town-wait-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did Mr Mensah tell the pupils they must NEVER enter deep roadside gutters or touch sharp/hazardous waste?',
        options: [
          'It is unsafe for children; heavy drains require trained adult crews',
          'Mr Mensah wanted the gutters to stay blocked forever',
          'Plastic bottles dissolve by themselves in two minutes',
        ],
        correctIndex: 0,
        explanation: 'Children’s safety comes first: heavy drains and hazardous waste require trained adult sanitation crews with protective equipment.',
      },
      {
        id: 'town-wait-v1',
        type: 'vocabulary',
        afterPage: 4,
        word: 'compost',
        definition: 'Decayed plant and fruit peels that turn into rich natural fertilizer for garden soil',
        distractors: [
          'Plastic water sachets thrown into a roadside gutter',
          'A metal truck used by the District Assembly',
        ],
      },
      {
        id: 'town-wait-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'When the school collected 40 kg of clean plastic and 20 kg of paper, what was the total weight and the 2-cedi/kg plastic earnings?',
        options: [
          '60 kg recycled in total, earning 80 cedis for library books',
          '20 kg recycled in total, earning 10 cedis',
          '100 kg recycled in total, earning 500 cedis',
        ],
        correctIndex: 0,
        explanation: '40 kg + 20 kg = 60 kg total; 40 kg of plastic × 2 cedis per kg = 80 cedis.',
      },
      {
        id: 'town-wait-c3',
        type: 'comprehension',
        afterPage: 9,
        question: 'How did the town solve the sanitation problem sustainably?',
        options: [
          'Citizens sorted waste while the Assembly sent bins, trucks and crews',
          'Primary 4 pupils replaced the municipal waste department permanently',
          'Everyone kept waiting for a stranger named Somebody',
        ],
        correctIndex: 0,
        explanation: 'Lasting sanitation requires both everyday citizen responsibility and accountable municipal public services.',
      },
      {
        id: 'town-wait-s1',
        type: 'sequencing',
        afterPage: 10,
        prompt: 'Put the steps of Primary 4’s safe citizenship project in order.',
        items: [
          'Sort clean plastic, paper and compost safely inside the schoolyard.',
          'Map missing street bins from the pavement and petition the Assembly.',
          'Pair adult drain crews and skip trucks with clean community habits.',
        ],
      },
      {
        id: 'town-wait-sel',
        type: 'sel',
        afterPage: 10,
        prompt: 'How did moving from complaining ("Why hasn’t Somebody fixed this?") to safe teamwork change how everyone felt about their town?',
        feelingOptions: ['Responsible', 'Cooperative', 'Proud', 'Empowered'],
      },
    ],
    glossary: [
      { word: 'hazardous', definition: 'Dangerous or harmful to health, such as sharp glass, chemicals or medical waste that children must never touch', pages: [3] },
      { word: 'sanitation', definition: 'Systems and practices that keep a community clean and protect public health through safe waste and drain management', pages: [3, 8] },
      { word: 'compost', definition: 'Natural soil food made from rotted fruit peels, leaves and plant matter', pages: [4] },
      { word: 'reusable', definition: 'Able to be washed and used again many times', pages: [4] },
    ],
    teacherGuide: {
      overview:
        'A Primary 3–5 citizenship and environmental health story that teaches learners how to move from passive complaining to safe, constructive action. It enforces strict child-safety rules (children never enter drains or touch hazardous waste), teaches waste segregation and numeracy (40 kg + 20 kg = 60 kg; 40 × 2 = 80 cedis), and shows how citizens partner with their Assembly Member and District Assembly Environmental Health Department.',
      learningObjectives: [
        'Explain why children must never enter roadside drains or handle sharp/hazardous waste, and identify safe environmental actions (sorting clean dry plastic/paper, using bins).',
        'Calculate total recycled weight (40 kg + 20 kg = 60 kg) and recycling income (40 kg × 2 cedis = 80 cedis).',
        'Describe the role of the Assembly Member and the District Assembly Environmental Health / Waste Management Department.',
        'Explain why clean communities require both responsible personal habits and accountable public services.',
      ],
      discussionPrompts: [
        'Why did everyone on Market Street keep asking "Why hasn’t Somebody fixed this yet?" while nobody took the first step?',
        'Why did Mr Mensah praise Akosua’s caring heart but firmly forbid the class from climbing into the roadside gutter?',
        'How did bringing a neat map and 60 signatures to Honourable Tetteh work better than shouting complaints on the street?',
        'Why shouldn’t children ever be expected to replace the District Assembly’s adult sanitation workers?',
      ],
      classroomActivities: [
        'Three-Barrel Classroom Sort: Label three boxes "Clean Plastic", "Clean Paper/Card", and "Organic Peels (Compost)". Call out 10 everyday school items and have pupils point to the correct box (plus a 4th "Adult Hazard Report Only" card for broken glass or batteries).',
        'Letter to Our Assembly Member: Draft a polite, factual class letter thanking local sanitation workers and suggesting one specific improvement (such as a lidded bin near the school gate).',
      ],
      crossCurricularLinks: ['Our World Our People / Social Studies: Local Government (Assembly Member, MMDAs) & Sanitation', 'Science: Waste Segregation, Recycling & Composting', 'Mathematics: Addition & Multiplication with Mass (kg) and Money (cedis)'],
      discoveryStatus: {
        established: [
          'Separating clean dry plastics and paper at source prevents contamination and makes recycling economically viable, while keeping solid waste out of storm drains prevents urban flash flooding and mosquito breeding.',
          'In Ghana, Metropolitan, Municipal and District Assemblies (MMDAs) are statutorily responsible for waste management and public environmental health.',
        ],
        underInvestigation: [
          'Ghanaian materials engineers are testing ways to blend shredded waste plastic with sand to mould durable pavement blocks and kerbstones.',
        ],
      },
      investigation: {
        title: 'Clean Dry Classroom Waste Tally (No Touching Litter!)',
        Materials: 'A notebook, pencil, and your own school bag or desk after break time.',
        steps: [
          'Without touching any ground litter, look at the clean wrappers or scrap paper from your own snack and exercise book today.',
          'Classify each item into one of three columns in your notebook: Column 1 (Paper/Card), Column 2 (Clean Plastic), Column 3 (Fruit Peel/Organic).',
          'Add the class totals on the chalkboard to see how many items a single classroom can keep out of the bin every week by sorting and using reusable water bottles!',
        ],
        explanation:
          'Auditing our own everyday items shows how source reduction (reusable bottles) and clean sorting stop waste before it ever reaches the street.',
      },
      factCheck:
        'Explicitly forbids children from entering drains or handling hazardous waste, emphasizes that children do not replace municipal sanitation workers, and verifies the recycling arithmetic (40 kg + 20 kg = 60 kg; 40 × 2 = 80 cedis).',
    },
    narrationPlan: {
      voice: 'Lively, warm Ghanaian storyteller (en-GH); enthusiastic for Yao and Akosua, caring and firm on safety for Mr Mensah, respectful for Honourable Tetteh.',
      pace: 'Medium-slow (about 110 words per minute) for Primary 3–5.',
      notes: ['Pronounce Akosua ("ah-koh-SWAH") and Tetteh ("TEH-teh") clearly.'],
    },
    music: 'Optional cheerful marimba and light shaker rhythm; off by default.',
    culturalNotes: [
      'Highlights the real civic role of the elected Assembly Member in Ghanaian local government.',
    ],
    reviewQuestions: [
      'Are the child-safety boundaries (no entering drains, no hazardous waste) and the balance between citizen habits and municipal accountability clear?',
    ],
  },

  // ====================================================================================================================
  // 6. We Built It Here in Ghana (JHS 1-3, 12 pages, Agro-Processing, FDA/GSA Standards, Setbacks & Sustainable Jobs)
  // ====================================================================================================================
  {
    key: 'we-built-it-here-in-ghana',
    set: 'extension',
    title: 'We Built It Here in Ghana',
    summary:
      'Following a fictional multi-year journey from an agricultural club in Sunyani to a certified agro-processing enterprise, cousin founders Mensah and Mansa turn surplus ripe plantains and cassava into shelf-stable snacks and flour, overcoming equipment breakdowns, high loan rates, and strict FDA Ghana and GSA quality standards to build a sustainable business supporting 18 factory staff and 45 smallholder farmers.',
    classification: base({
      classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
      ageMin: 12,
      ageMax: 15,
      readingLevel: 'proficient',
      difficulty: 5,
      genres: ['realistic-fiction', 'educational'],
      themes: ['money-and-enterprise', 'food', 'farm-and-garden', 'careers'],
      objectives: ['financial-literacy', 'problem-solving', 'perseverance', 'honesty', 'teamwork', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-food', 'market', 'local-names'],
      estimatedDurationSec: 460,
    }),
    palette: ['#15803d', '#eab308'],
    characters: [
      'Mansa: a determined Ghanaian girl introduced at age fourteen in JHS 2 in the Bono Region and later shown as a twenty-four-year-old food-science entrepreneur wearing a clean white hairnet, green polo shirt and lab coat.',
      'Mensah: Mansa’s cousin and co-founder, an operations and accounting mind wearing spectacles and a yellow-and-green collared shirt.',
      'Auntie Yaa: a hardworking plantain and cassava farmer in her forties, wearing a bright green wax-print cloth and head-wrap.',
      'Mr Ofori: an inspector and food-safety advisor from the Food and Drugs Authority (FDA Ghana), wearing a white inspection coat and carrying a moisture meter.',
    ],
    pages: [
      {
        text: 'During the bumper harvest season near Sunyani, fourteen-year-old Mansa and her cousin Mensah stood beside Auntie Yaa’s farm truck in frustration. Heaps of golden ripe plantains and fresh cassava tubers lay unsold at the roadside because every farmer had harvested at the exact same week! Meanwhile, inside town supermarkets, shoppers paid high prices for imported biscuits and crisps shipped from thousands of kilometres away.',
        alt: 'Fourteen-year-old Mansa and Mensah stand with Auntie Yaa beside unsold heaps of ripe plantains while a supermarket across the road displays imported snacks.',
        motif: '🍌🚛',
        brief: 'Sunny Bono Region roadside market: Mansa (14, green school uniform) and Mensah (14, spectacles) standing with farmer Auntie Yaa (green wax-print dress) beside baskets of ripe yellow plantains and cassava tubers.',
        narration: 'Set up the economic paradox clearly: post-harvest gluts on farms alongside expensive imported snacks in shops.',
      },
      {
        text: '‘Why do raw plantains and cassava spoil so fast after harvest?’ Mansa asked in her JHS Career Technology class. Her teacher explained that fresh tubers and ripe plantains contain high moisture, which allows moulds and enzymes to break them down within days. ‘Agro-processing,’ the teacher said, ‘uses food science, drying, slicing, roasting or milling, to remove moisture, extend shelf life for months, and add value right here in Ghana!’',
        alt: 'In the JHS Career Technology room, Mansa and Mensah compare fresh high-moisture plantains with shelf-stable dried plantain crisps and cassava flour.',
        motif: '🏫🔬',
        brief: 'JHS Career Technology classroom: the teacher showing Mansa and Mensah a fresh bunch of plantains beside sealed jars of golden plantain crisps and fine white cassava flour (no text labels).',
        narration: 'Clear food-science explanation of moisture removal, shelf life and value addition.',
      },
      {
        text: 'That school project planted a lifelong dream. Years later, after Mansa studied food science and Mensah studied accounting, the two cousins pooled their savings with four local farmers to start a small agro-processing workshop. Their goal was simple: turn Auntie Yaa’s surplus plantains and cassava into lightly salted baked plantain crisps and high-quality composite baking flour.',
        alt: 'Now young adults in their twenties, Mansa and Mensah set up a small clean food-processing room with stainless-steel tables.',
        motif: '👩🏾‍🔬🏭',
        brief: 'Clean starter food-processing room in Sunyani: Mansa (now 24, white hairnet, green polo, white food-coat) and Mensah (spectacles, notebook) inspecting a stainless-steel slicing table with Auntie Yaa.',
        narration: 'Show realistic preparation: years of study in food science and accounting before launching.',
      },
      {
        text: 'Building a real manufacturing business in Ghana was not easy! In their second month, they applied for a commercial bank loan to buy a bigger dehydrator, but the bank’s interest rate was twenty-eight percent a year, far too high for a young workshop with small sales. Instead of taking a reckless loan that could crush them, Mensah negotiated a phased equipment lease with an agricultural development fund and reinvested every cedi of early profit.',
        alt: 'Mensah and Mansa review loan interest calculations at a desk and choose an affordable phased equipment lease instead.',
        motif: '📊🏦',
        brief: 'Small office desk: Mensah pointing to a steep red interest chart vs a manageable green step-by-step lease plan on his laptop (no text) while Mansa nods in agreement.',
        narration: 'Realistic financial lesson: why high-interest debt can sink a young manufacturing business and how disciplined financing works.',
      },
      {
        text: 'Next came an engineering setback. Their first locally fabricated hot-air dryer heated unevenly: trays at the bottom scorched dark brown, while trays at the top stayed damp and chewy! Twenty batches were ruined. Mansa did not hide the mistake or sell burnt crisps. Working with a local metal fabricator, she installed a baffle plate and a thermostat fan that circulated warm air evenly across all twelve trays.',
        alt: 'Mansa and a local technician install an air-circulation fan and thermostat inside the stainless-steel drying cabinet.',
        motif: '🛠️🌡️',
        brief: 'Inside the processing workshop: Mansa in hairnet and gloves working beside a Ghanaian technician to fit a silver circulation fan and temperature dial onto a stainless-steel food dehydrator.',
        narration: 'Show technical persistence and refusal to sell substandard products.',
      },
      {
        text: 'Before they could sell to supermarkets, schools and hospitals, they had to meet strict national law. Mr Ofori from the Food and Drugs Authority, FDA Ghana, inspected their premises alongside standards guidelines from the Ghana Standards Authority, GSA. He checked handwashing stations, hairnets, pest screens, batch expiry dates, and tested the flour’s moisture content to ensure it was below twelve percent so mould could never grow.',
        alt: 'FDA inspector Mr Ofori checks the stainless-steel hygiene stations and tests flour moisture while Mansa and Mensah take notes.',
        motif: '📋✅',
        brief: 'Spotless food-processing room: Mr Ofori (white inspection coat, moisture meter) testing a bowl of fine flour while Mansa and Mensah in hairnets and aprons stand beside a stainless-steel handwashing sink.',
        narration: 'Highlight Ghana’s real regulatory standards: FDA Ghana food safety registration and GSA quality standards.',
      },
      {
        text: 'When a distributor tempted Mensah to skip the final laboratory test and print a fake registration number to get onto shelves two months early, Mensah refused flatly. ‘If one child gets sick from unverified food, our reputation and our conscience are ruined forever,’ he said. Three months later, after passing every lab test honestly, their packs proudly carried a genuine FDA registration number!',
        alt: 'Mensah firmly rejects a shortcut while Mansa holds up their official FDA food-safety certificate and sealed crisp pouches.',
        motif: '🛡️📦',
        brief: 'Mansa holding up a framed official certificate with a green seal (no text) beside rows of neatly sealed golden-and-green snack pouches on a stainless-steel counter.',
        narration: 'Strong business ethics: food safety and regulatory integrity are non-negotiable.',
      },
      {
        text: 'Mensah tracked the unit economics of every hundred-pack batch with precision. Buying fresh plantains directly from Auntie Yaa’s cooperative cost two hundred cedis. Washing, slicing, baking, solar-assisted drying, moisture-proof pouches and FDA-compliant labels cost one hundred and fifty cedis, making a total production cost of three hundred and fifty cedis for one hundred packs, or three cedis fifty pesewas per pack.',
        alt: 'Mensah writes the batch cost breakdown on a whiteboard: 200 cedis raw plantains + 150 cedis processing and packaging = 350 cedis for 100 packs.',
        motif: '🧮🍌',
        brief: 'At the workshop planning board: Mensah pointing to two visual cost stacks, two green coin stacks by a basket of plantains and one-and-a-half gold coin stacks by sealed pouches (no text or numbers).',
        narration: 'Walk through the exact cost arithmetic clearly: 200 + 150 = 350 cedis for 100 packs (3.50 cedis per pack).',
      },
      {
        text: 'They priced each pack wholesale at five cedis. Selling one hundred packs brought in five hundred cedis of revenue! Subtracting the three-hundred-and-fifty-cedi total cost left one hundred and fifty cedis of gross profit per batch, a healthy thirty percent margin that paid workers’ wages, factory rent, electricity and savings for a second production line.',
        alt: 'Mansa and Mensah stack 100 sealed packs into shipping cartons, earning 500 cedis in revenue and 150 cedis in gross profit.',
        motif: '📦📈',
        brief: 'Clean packing area: uniformed young workers packing sealed green-and-gold plantain crisp pouches into neat cardboard cartons while Mansa and Mensah check the inventory sheet.',
        narration: 'Clear profit and margin arithmetic: 100 × 5 = 500 cedis revenue; 500 − 350 = 150 cedis profit (30% of 500).',
      },
      {
        text: 'Even with a great product, market competition was fierce. At first, two big city supermarkets placed their Ghanaian packs on the bottom shelf behind imported brands. Mansa and Mensah responded with smart marketing: they offered free taste tests outside schools and offices, designed bright moisture-lock pouches that kept crisps crunchy for six months, and delivered on time every single Monday.',
        alt: 'At a clean supermarket tasting counter, shoppers happily sample the crunchy Ghanaian plantain crisps and pick up packs from a top display.',
        motif: '🛒😋',
        brief: 'Bright modern Ghanaian supermarket aisle: Mansa in a branded green apron offering sample cups of golden plantain crisps to smiling Ghanaian families beside a prominent display shelf (no readable text).',
        narration: 'Show how quality, packaging and reliability win customers fairly in a competitive market.',
      },
      {
        text: 'After four years of steady work, the impact reached across the district. The factory employed eighteen full-time workers, food technicians, machine operators, quality clerks and drivers, all enrolled in SSNIT pensions, and signed guaranteed purchase contracts with forty-five smallholder farmers led by Auntie Yaa. Post-harvest plantain losses in their cooperative dropped by more than half!',
        alt: 'Outside the expanded solar-roofed agro-processing facility, Mansa, Mensah and Auntie Yaa stand proudly with the 18 factory staff and visiting farmers.',
        motif: '🏭👩🏾‍🌾',
        brief: 'Sunny courtyard of a clean modern Ghanaian agro-processing plant with solar panels on the roof: Mansa, Mensah and Auntie Yaa smiling with eighteen uniformed factory staff and farmers beside a delivery van.',
        narration: 'Measurable, realistic 4-year impact: 18 factory jobs + 45 contracted smallholder farmers and reduced post-harvest loss.',
      },
      {
        text: 'When JHS students from Sunyani toured the plant on Career Day, Mansa handed each student a warm, crunchy sample pack. ‘We did not build this overnight, and nobody handed us easy millions,’ she told them with a proud smile. ‘We combined science, honest accounting, food-safety law and persistence. Ghana grows the finest harvests on Earth, and your generation can process, package and share them with the world!’',
        alt: 'Mansa and Mensah welcome JHS students in hairnets and visitor coats through the viewing window of the clean food-processing line.',
        motif: '🎓🇬🇭',
        brief: 'Through a large glass viewing corridor in the clean food plant: Mansa and Mensah showing JHS students in visitor coats how golden plantains are sliced, dried and sealed inside the gleaming workshop.',
        narration: 'Inspiring, grounded finale celebrating Ghanaian agro-industrial pride.',
      },
    ],
    activities: [
      {
        id: 'built-gh-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'How does agro-processing stop fresh cassava and ripe plantains from spoiling within a few days?',
        options: [
          'By removing moisture and sealing hygienically to extend shelf life and add value',
          'By leaving raw heaps of fruit in the hot roadside sun',
          'By painting raw plantains with blue ink',
        ],
        correctIndex: 0,
        explanation: 'High moisture causes rapid spoilage; drying, roasting, milling and hygienic packaging extend shelf life for months.',
      },
      {
        id: 'built-gh-v1',
        type: 'vocabulary',
        afterPage: 5,
        word: 'thermostat',
        definition: 'A device that automatically senses and regulates temperature inside a machine or oven',
        distractors: [
          'A wooden basket used to carry cassava from the farm',
          'A receipt given by a supermarket cashier',
        ],
      },
      {
        id: 'built-gh-c2',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why did Mensah refuse to print a fake registration number before passing the official FDA Ghana inspections?',
        options: [
          'Food safety, law and consumer trust come first; fake labels are illegal',
          'He forgot how to use a printer',
          'Supermarkets only buy food that has no label at all',
        ],
        correctIndex: 0,
        explanation: 'FDA Ghana registration protects public health and consumer trust; ethical businesses never fake safety approvals.',
      },
      {
        id: 'built-gh-c3',
        type: 'comprehension',
        afterPage: 9,
        question: 'When 100 packs cost 350 cedis (200 + 150) and sell for 500 cedis (100 × 5), what is the gross profit?',
        options: [
          '150 cedis gross profit (30% of the 500-cedi revenue)',
          '500 cedis gross profit',
          '350 cedis loss',
        ],
        correctIndex: 0,
        explanation: 'Revenue (100 × 5 = 500 cedis) − Total Cost (200 + 150 = 350 cedis) = 150 cedis gross profit (150 ÷ 500 = 30%).',
      },
      {
        id: 'built-gh-s1',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Order the milestones that built Mansa and Mensah’s agro-processing company.',
        items: [
          'Study food science and accounting after spotting farm post-harvest losses.',
          'Fix the uneven dryer and pass all FDA Ghana and GSA safety checks.',
          'Grow over four years to employ 18 factory staff and support 45 farmers.',
        ],
      },
      {
        id: 'built-gh-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'How did honesty, patience and teamwork help Mansa and Mensah overcome the 20 ruined dryer batches and tough supermarket competition?',
        feelingOptions: ['Persistent', 'Ethical', 'Resourceful', 'Proud'],
      },
    ],
    glossary: [
      { word: 'tubers', definition: 'Thick underground plant stems or roots that store nutrients, such as cassava and yam', pages: [1, 2] },
      { word: 'dehydrator', definition: 'A machine that removes moisture from food using controlled warm airflow', pages: [4] },
      { word: 'thermostat', definition: 'A sensor switch that keeps temperature steady inside an oven or dryer', pages: [5] },
      { word: 'wholesale', definition: 'Selling goods in larger quantities to shops and supermarkets at a unit price lower than retail', pages: [9] },
      { word: 'margin', definition: 'The percentage of revenue left as profit after paying production costs', pages: [9] },
    ],
    teacherGuide: {
      overview:
        'A rich JHS 1–3 entrepreneurship, food-science and career-technology story showing how Ghanaian agro-processing turns perishable farm gluts into shelf-stable products. It covers moisture control, financing challenges (avoiding predatory interest rates), engineering troubleshooting, compliance with the Food and Drugs Authority (FDA Ghana) and Ghana Standards Authority (GSA), unit-cost and profit-margin arithmetic, and multi-year job creation.',
      learningObjectives: [
        'Explain how agro-processing (moisture reduction, hygienic packaging) prevents post-harvest loss and adds economic value to Ghanaian crops.',
        'Describe the regulatory roles of the Food and Drugs Authority (FDA Ghana) and the Ghana Standards Authority (GSA) in protecting consumers.',
        'Calculate batch cost, revenue, gross profit and percentage margin (200 + 150 = 350 cedis cost; 100 × 5 = 500 cedis revenue; 500 − 350 = 150 cedis profit = 30% margin).',
        'Recognise that sustainable enterprises require skills, ethical compliance, financing discipline and years of persistence.',
      ],
      discussionPrompts: [
        'Why do raw cassava tubers and ripe plantains spoil rapidly if they are not processed or cooled?',
        'Why did Mensah turn down the 28% bank loan in their second month and choose a phased equipment lease instead?',
        'When 20 batches scorched in the uneven dryer, or when a distributor suggested printing a fake FDA number, what choices showed Mansa and Mensah’s integrity?',
        'How did the factory benefit both the 18 full-time workers in town and the 45 smallholder farmers in Auntie Yaa’s cooperative?',
      ],
      classroomActivities: [
        'Value-Addition Price Check: Compare the price per kilogram of raw cassava or plantain in the local market with the price per kilogram of packaged gari, plantain crisps or fufu flour, and list all the processing and packaging steps that account for the added value.',
        'Batch Margin Worksheet: Calculate unit cost, revenue, profit and margin for 200 packs of gari if raw cassava costs 300 cedis, roasting/packaging costs 200 cedis, and each pack sells for 4 cedis (Cost = 500; Revenue = 800; Profit = 300; Margin = 37.5%).',
      ],
      crossCurricularLinks: ['Career Technology & Home Economics: Food Preservation, Moisture Control & Packaging', 'Mathematics: Cost Accounting, Profit Margins & Percentages', 'Social Studies: Agro-Industrialisation, FDA Ghana, GSA & Employment'],
      discoveryStatus: {
        established: [
          'Reducing water activity (moisture content below ~12% in flours and dried crisps) inhibits microbial growth and enzymatic spoilage, extending shelf life from days to months.',
          'In Ghana, the Food and Drugs Authority (FDA, under the Public Health Act, 2012, Act 851) regulates food safety and product registration, while the Ghana Standards Authority (GSA) sets national quality and metrology standards.',
        ],
        underInvestigation: [
          'Ghanaian food scientists are developing vitamin-enriched composite flours blending local cassava, orange-fleshed sweet potato and soybean to reduce wheat imports and improve child nutrition.',
        ],
      },
      investigation: {
        title: 'Safe Sun-Drying Moisture Loss Observation',
        Materials: 'One fresh slice of plantain or apple, a small clean plate, a fine mesh cover (to keep flies away), and a kitchen scale (or ruler to measure thickness).',
        steps: [
          'Measure the starting mass (or thickness in millimetres) of a thin slice of fresh plantain on a clean plate covered with clean mesh.',
          'Place the covered plate in warm sunshine for 4 hours, then measure the mass (or thickness) again.',
          'Observe how the slice becomes lighter, firmer and drier as water evaporates, the exact principle behind food dehydration!',
        ],
        explanation:
          'Evaporating free water from plant cells removes the damp environment that moulds and bacteria need to multiply.',
      },
      factCheck:
        'Presents a realistic multi-year agro-processing journey, cites real Ghanaian regulatory institutions (FDA Ghana and GSA), and verifies all financial calculations (200 + 150 = 350 cedis cost for 100 packs = 3.50 cedis/pack; 100 × 5 = 500 cedis revenue; 500 − 350 = 150 cedis gross profit = 30% margin).',
    },
    narrationPlan: {
      voice: 'Warm, confident Ghanaian narrator (en-GH); articulate and determined for Mansa and Mensah, warm for Auntie Yaa, professional for Mr Ofori.',
      pace: 'Medium (about 125 words per minute); pause clearly around the batch cost and margin numbers on pages 8–9.',
      notes: ['Pronounce Mansa ("MAHN-sah"), Yaa ("YAAH") and Ofori ("oh-FOH-ree") clearly.'],
    },
    music: 'Optional upbeat acoustic guitar and light percussion; off by default.',
    culturalNotes: [
      'Highlights Bono Region agriculture (Sunyani) and the link between smallholder women farmers and youth-led agro-processing.',
    ],
    reviewQuestions: [
      'Are the unit economics (200 + 150 = 350 cost; 500 revenue; 150 profit = 30% margin) and FDA/GSA standards clear and accurate?',
    ],
  },
];
