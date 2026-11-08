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

export const BATCH_4_STORIES: PilotStory[] = [
  // ====================================================================================================================
  // 1. From Kumasi to the World: The Girl Who Built a Billion-Dollar Idea (JHS 1-3, 12 pages, Tech & Entrepreneurship)
  // ====================================================================================================================
  {
    key: 'from-kumasi-to-the-world-the-girl-who-built-a-billion-dollar-idea',
    set: 'extension',
    title: 'From Kumasi to the World: The Girl Who Built a Billion-Dollar Idea',
    summary:
      'In a fictional journey spanning from a JHS science club in Kumasi to a pan-African engineering enterprise, Serwaa develops a low-cost solar-powered cold-storage system to prevent post-harvest farm losses, discovering how prototypes, setbacks, equity investors and company valuation work in the real world.',
    classification: base({
      classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
      ageMin: 12,
      ageMax: 15,
      readingLevel: 'proficient',
      difficulty: 5,
      genres: ['realistic-fiction', 'science', 'educational'],
      themes: ['technology', 'money-and-enterprise', 'careers', 'leadership'],
      objectives: ['financial-literacy', 'problem-solving', 'perseverance', 'scientific-curiosity', 'critical-thinking', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['market', 'local-names'],
      estimatedDurationSec: 460,
    }),
    palette: ['#0f766e', '#f59e0b'],
    characters: [
      'Serwaa: a bright, determined Ghanaian girl introduced at age fourteen in JHS 2 in Kumasi (wearing a neat teal-and-khaki school uniform, glasses and natural braided hair) and later shown as a young mechanical engineer in her twenties wearing a teal work shirt and safety goggles.',
      'Auntie Afia: Serwaa’s aunt, a hard-working tomato trader in Kumasi in her forties, wearing a warm gold-and-green wax-print cloth and head-tie.',
      'Kojo: Serwaa’s classmate and later co-founder, an electronics enthusiast wearing spectacles and a navy polo shirt.',
      'Mr Ofori: their JHS science and design teacher, wearing a cream short-sleeved shirt.',
    ],
    pages: [
      {
        text: 'Every Friday after school in Kumasi, fourteen-year-old Serwaa helped her Auntie Afia unload crates of fresh red tomatoes from farming towns in the Bono East and Ashanti regions. By Sunday afternoon, the fierce afternoon heat had softened nearly a third of the unsold crates into spoiled pulp. ‘All that hard work in the sun,’ Auntie Afia sighed, ‘and so much food and money is lost before Monday morning.’',
        alt: 'Fourteen-year-old Serwaa and Auntie Afia inspect crates of tomatoes in a warm Kumasi market stall where several crates have spoiled in the heat.',
        motif: '🍅☀️',
        brief: 'Warm Kumasi market stall at late afternoon: Serwaa (14, glasses, braided hair, teal-and-khaki uniform) and Auntie Afia (gold-and-green wax-print dress and head-tie) looking thoughtfully at wooden crates of fresh red tomatoes beside a basket of bruised, overripe tomatoes.',
        narration: 'Empathetic, grounded opening. Let Auntie Afia’s sigh carry real weight.',
      },
      {
        text: 'On Monday in the JHS science room, Serwaa asked Mr Ofori a question that would not leave her mind. ‘Why don’t market traders and smallholder farmers use cold rooms?’ Mr Ofori explained that conventional refrigerated rooms cost a fortune, needed constant grid electricity, and broke down when power fluctuated. ‘Great businesses do not start with a wish to get rich, Serwaa,’ he said. ‘They start by solving a painful problem that affects thousands of people.’',
        alt: 'In a JHS science classroom, Serwaa raises her hand while Mr Ofori stands beside a chalkboard drawing of a farm-to-market supply chain.',
        motif: '🏫💡',
        brief: 'Sunlit Ghanaian JHS science classroom: Serwaa raising her hand at her desk while Mr Ofori (cream shirt) gestures toward a simple diagram of crates and a sun icon on a chalkboard (no readable text).',
        narration: 'Thoughtful and inspiring tone from Mr Ofori.',
      },
      {
        text: 'With her classmate Kojo, Serwaa built their first prototype, an early working model crafted to test an idea. They lined a wooden crate with local coconut-husk insulation, fitted a small twelve-volt cooling fan powered by a borrowed solar panel, and placed a dish of water and a thermometer inside. Everyone at the school science club clapped, until they checked the crates after forty-eight hours.',
        alt: 'Serwaa and Kojo assemble a small wooden box lined with coconut fibre and connected to a small solar panel on a school workbench.',
        motif: '🛠️🔋',
        brief: 'School workshop table: Serwaa and Kojo (spectacles, navy polo shirt) fitting brown coconut-husk fibre and a small cooling fan into a wooden crate wired to a small solar panel outside the window, with a thermometer inside.',
        narration: 'Energetic curiosity, building to a suspenseful pause at the end.',
      },
      {
        text: 'The first prototype failed! Moisture condensed on the inside walls, soaked the coconut fibre, and made the tomatoes mouldy even faster. Kojo wanted to give up, but Serwaa opened her engineering notebook and wrote: Test 1 failed, humidity trapped inside. ‘Failure is not the end of an invention,’ she told Kojo. ‘It is data telling us what to fix next.’',
        alt: 'Serwaa writes notes in her engineering notebook while inspecting water droplets inside the prototype box as Kojo looks discouraged.',
        motif: '📓💧',
        brief: 'Close view at the workbench: water droplets visible inside the open wooden crate; Kojo looking disappointed with his chin in his hand while Serwaa calmly writes in a notebook (no readable text) and points at the condensation.',
        narration: 'Honest disappointment followed by calm scientific determination.',
      },
      {
        text: 'Years of study and experimentation followed. While studying mechanical engineering at university in Kumasi, Serwaa and Kojo tested thirteen versions of their cooler. They sealed the insulation in recycled aluminium panels, added a phase-change thermal battery that stored cold energy during sunny hours to keep produce cool all night, and included a simple sensor that alerted farmers on basic mobile phones if a door was left open.',
        alt: 'Now university engineering students in their twenties, Serwaa and Kojo test a sleek metal-lined solar cold box in a workshop.',
        motif: '⚙️❄️',
        brief: 'University engineering lab in Kumasi: Serwaa (now 21, glasses, teal work shirt, safety goggles on forehead) and Kojo testing a neat walk-in modular silver-and-teal solar cold-storage unit with solar panels and a digital temperature gauge.',
        narration: 'Steady, mature progression showing years of disciplined study and engineering.',
      },
      {
        text: 'Their first real pilot unit stood beside Auntie Afia’s stall and two neighbouring farm cooperatives. Instead of spoiling in two days, tomatoes, garden eggs and green peppers stayed crisp for two full weeks! Farmers paid a small daily fee of five cedis per crate, far less than the thirty cedis they used to lose when produce rotted. The unit paid for its own maintenance through real value.',
        alt: 'Auntie Afia and local farmers smilingly load crates of crisp tomatoes and green peppers into a walk-in solar cold room.',
        motif: '🥬📈',
        brief: 'Rural farm cooperative yard: Auntie Afia and two smiling Ghanaian farmers loading bright red tomatoes and green peppers into a clean white-and-teal solar-powered walk-in cold room topped with solar panels.',
        narration: 'Warm triumph as the engineering solves the real-world market problem.',
      },
      {
        text: 'Soon, forty farming communities across Ghana asked for units, but Serwaa and Kojo had a new problem: building forty industrial solar cold rooms cost millions of cedis they did not have. To scale, growing a business so it can serve many more customers, they needed outside capital. They registered their company formally and prepared to meet investors.',
        alt: 'Serwaa and Kojo study a map of Ghana dotted with pins while reviewing blueprints and cost spreadsheets in their small office.',
        motif: '🗺️🏗️',
        brief: 'Modest startup office in Kumasi: Serwaa and Kojo looking at a wall map of Ghana marked with colourful pins and engineering blueprints rolled out on a wooden table.',
        narration: 'Clear transition from engineering a product to scaling a company.',
      },
      {
        text: 'In Accra, they pitched to a climate-technology investment fund. The investors offered capital in exchange for equity, a share of ownership in the company. Before signing a single page, Serwaa and Kojo worked with a qualified Ghanaian corporate lawyer and an accountant. They made sure the agreement was fair, kept strong founder ownership, and committed every cedi of investment to building factories and farmer hubs.',
        alt: 'Serwaa and Kojo sit across a conference table with investors and a corporate lawyer, carefully reviewing a contract and financial model.',
        motif: '🤝⚖️',
        brief: 'Modern Accra meeting room: Serwaa and Kojo seated with a female Ghanaian lawyer in a dark suit and two investors, reviewing architectural drawings of a solar cold-storage hub (no text on documents).',
        narration: 'Serious, professional tone emphasising legal care and responsible ownership.',
      },
      {
        text: 'Scaling across West and East Africa was hard work. In their third year, a shipping delay held up solar compressors for two months, and the team had to redesign the cooling unit so seventy percent of its parts could be manufactured right in Ghana. By training local technicians in Tamale, Sunyani, Takoradi and Ho, they turned a supply crisis into hundreds of skilled Ghanaian engineering and maintenance jobs.',
        alt: 'Inside a bright Ghanaian assembly plant, young male and female technicians in safety gear assemble solar cooling units alongside Serwaa.',
        motif: '🏭👷🏾‍♀️',
        brief: 'Clean modern assembly workshop in Ghana: Serwaa in safety goggles walking beside young Ghanaian male and female technicians assembling teal-and-silver solar cold-storage panels.',
        narration: 'Dynamic, resilient tone highlighting local manufacturing and job creation.',
      },
      {
        text: 'Ten years after that first mouldy crate in JHS, international business news announced that Serwaa and Kojo’s company had reached a valuation of one billion cedis, and was expanding globally. Back at her old school in Kumasi, a JHS student gasped, ‘Sister Serwaa, do you have a billion cedis sitting in your bedroom?’ Serwaa laughed warmly and stepped to the chalkboard to explain the truth.',
        alt: 'Serwaa laughs warmly in her old JHS classroom in Kumasi as curious students gather around her beside the chalkboard.',
        motif: '🎓💬',
        brief: 'Back in the Kumasi JHS classroom: adult Serwaa smiling warmly at a group of eager JHS students in uniform, holding a piece of chalk beside the board.',
        narration: 'Playful question from the student, warm and grounded response from Serwaa.',
      },
      {
        text: '‘No!’ explained Serwaa. ‘A company’s valuation is not cash in a founder’s pocket. Our company is divided into ten million shares, and investors currently value each share at one hundred cedis, making ten million times one hundred equal one billion cedis on paper. Almost all that value lives in our factories, solar hubs, trucks and research labs. Even more importantly, billion-dollar companies are rare exceptions, never a guaranteed reward.’',
        alt: 'Serwaa points to a visual diagram showing factories, solar cold rooms, delivery vans and workers rather than a pile of cash.',
        motif: '📊🏭',
        brief: 'Serwaa illustrating on the chalkboard with simple icons (a factory, solar panels, a delivery truck, and smiling workers, no words or numbers) while JHS students nod in understanding.',
        narration: 'Crucial educational clarity: distinguish paper valuation and productive assets from personal cash, and note that such outcomes are rare.',
      },
      {
        text: '‘Whether a business grows to serve one neighbourhood in Kumasi or forty countries across the world,’ Serwaa told the students, ‘true success is measured by the problems you solve, the honest jobs you create, and the lives your work improves. Start by noticing a real need right where you are, learn your science and maths well, and never be afraid to build!’',
        alt: 'Outside the school workshop, Serwaa, Kojo, Mr Ofori and Auntie Afia watch JHS students test their own small solar science projects.',
        motif: '🌍🌟',
        brief: 'Sunny school courtyard in Kumasi: Serwaa, Kojo, Mr Ofori and Auntie Afia smiling proudly as JHS students test small solar-powered models on a table.',
        narration: 'Inspiring, honest and empowering conclusion.',
      },
    ],
    activities: [
      {
        id: 'kumasi-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'What happened to Serwaa and Kojo’s very first wooden prototype?',
        options: [
          'Trapped moisture condensed inside and made the tomatoes mouldy',
          'It froze the tomatoes into solid ice overnight',
          'Investors immediately bought it for a million cedis',
        ],
        correctIndex: 0,
        explanation: 'Their first prototype trapped humidity inside, soaking the coconut fibre, teaching them what to improve next.',
      },
      {
        id: 'kumasi-v1',
        type: 'vocabulary',
        afterPage: 8,
        word: 'equity',
        definition: 'A share of ownership in a company',
        distractors: [
          'A type of solar battery used in cold rooms',
          'A fine paid when a prototype fails',
        ],
      },
      {
        id: 'kumasi-c2',
        type: 'comprehension',
        afterPage: 11,
        question: 'Why does a 1-billion-cedi company valuation NOT mean Serwaa has 1 billion cedis in cash?',
        options: [
          'Valuation is share price times total shares, tied up in company assets',
          'The government takes ninety-nine percent of all company shares',
          'Investors keep all the money locked in a glass box',
        ],
        correctIndex: 0,
        explanation: '10,000,000 shares × 100 cedis = 1,000,000,000 cedis in paper valuation, represented by factories, hubs and equipment rather than personal cash.',
      },
      {
        id: 'kumasi-s1',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Order the stages of Serwaa and Kojo’s entrepreneurial journey.',
        items: [
          'Observing tomato spoilage in Kumasi and testing early prototypes.',
          'Refining the engineering design at university and running farm pilots.',
          'Raising equity investment to build local factories and create jobs.',
        ],
      },
      {
        id: 'kumasi-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'How did Serwaa respond when Test 1 failed, and why does she value solving problems over chasing fame?',
        feelingOptions: ['Resilient', 'Curious', 'Responsible', 'Inspired'],
      },
    ],
    glossary: [
      { word: 'prototype', definition: 'An early working model built to test a design concept and learn what needs improvement', pages: [3, 4] },
      { word: 'insulation', definition: 'Material that slows the transfer of heat so a cool space stays cool longer', pages: [3, 5] },
      { word: 'scale', definition: 'To grow a business system so it can serve many more customers reliably', pages: [7] },
      { word: 'capital', definition: 'Money or financial resources invested to build equipment, factories and operations', pages: [7, 8] },
      { word: 'equity', definition: 'Ownership shares in a company', pages: [8] },
      { word: 'valuation', definition: 'The estimated total economic worth of a company (total shares multiplied by share price), not cash in a founder’s pocket', pages: [10, 11] },
    ],
    teacherGuide: {
      overview:
        'A realistic JHS entrepreneurship and engineering story showing how a Ghanaian student team moves from observing post-harvest food loss in Kumasi to building prototypes, studying engineering, raising equity investment, creating local manufacturing jobs, and understanding the difference between paper valuation and cash.',
      learningObjectives: [
        'Explain how iterative prototyping and engineering data turn early failures into working solutions.',
        'Define prototype, scale, capital, equity and company valuation accurately.',
        'Calculate company valuation from share count and share price (10,000,000 × 100 = 1,000,000,000 cedis) and distinguish it from personal cash.',
        'Recognise that billion-dollar outcomes are rare exceptions, while businesses of every size succeed by creating value and decent jobs.',
      ],
      discussionPrompts: [
        'Why did Mr Ofori say great businesses start by solving a painful problem rather than simply wishing to become rich?',
        'When the first coconut-husk prototype failed, what did Serwaa do differently from giving up?',
        'Why did Serwaa and Kojo consult a corporate lawyer and an accountant before accepting investor money for equity?',
        'If a company has 10 million shares valued at 100 cedis each, where does that 1 billion cedis of value actually sit?',
      ],
      classroomActivities: [
        'Problem-Spotter Walk: In pairs, list three everyday problems in your school or community (e.g., food spoilage, water waste, broken desks) and sketch a simple prototype that could help.',
        'Valuation vs Cash Maths: Calculate the valuation of a fictional company with 50,000 shares priced at 20 cedis per share (1,000,000 cedis). If the founder owns 40% of the shares (20,000 shares), what is the paper value of their shares (400,000 cedis), and why can they not spend all of it at once without selling part of the company?',
      ],
      crossCurricularLinks: ['Career Technology & Design: Prototyping & Thermal Insulation', 'Mathematics: Large Numbers, Multiplication & Percentages', 'Social Studies: Agriculture, Post-Harvest Loss & Industrialisation'],
      discoveryStatus: {
        established: [
          'Post-harvest loss is a major challenge for perishable crops in warm climates, and solar-powered cold storage with thermal energy storage is a proven engineering solution.',
          'A company’s market valuation equals its total issued shares multiplied by the current price per share, representing enterprise ownership value rather than liquid cash in a founder’s personal bank account.',
          'Equity financing exchanges partial ownership of a company for growth capital.',
        ],
        underInvestigation: [
          'Engineers across Africa are actively researching cheaper, locally sourced phase-change materials and natural refrigerants to cut the cost of off-grid cold rooms even further.',
        ],
      },
      investigation: {
        title: 'Hands-On Insulation Challenge: Keeping Ice Cool',
        Materials: 'Two identical small plastic cups, two ice cubes of equal size, dry coconut fibre or folded newspaper, a cloth wrap, and a watch or timer.',
        steps: [
          'Wrap Cup A snugly in dry coconut fibre or thick folded paper and cloth (your insulated prototype), and leave Cup B unwrapped in the shade.',
          'Place one ice cube of the same size into each cup and cover both cups with a small card lid.',
          'After 30 minutes, pour the melted water from each cup into a measuring spoon to see which cup slowed heat transfer better.',
        ],
        explanation:
          'Air pockets trapped inside fibrous insulation slow down heat conduction from the warm room into the cup, demonstrating the same physical principle used in cold-storage walls.',
      },
      factCheck:
        'Distinguishes clearly between fictional narrative inspiration and economic reality: company valuation (shares × share price) is illiquid ownership value tied to business assets, and billion-dollar companies are explicitly presented as rare exceptions rather than guaranteed outcomes of hard work.',
    },
    narrationPlan: {
      voice: 'Confident, inspiring Ghanaian narrator (en-GH); earnest and analytical for Serwaa, warm for Auntie Afia and Mr Ofori.',
      pace: 'Medium (about 125 words per minute); clear articulation of the valuation arithmetic on page 11.',
      notes: ['Pronounce Kumasi ("koo-MAH-see"), Serwaa ("sehr-WAAH") and Afia ("ah-FEE-ah") naturally.'],
    },
    music: 'Optional subtle acoustic guitar and light marimba pulse; off by default.',
    culturalNotes: [
      'Post-harvest tomato spoilage between farming hubs and Kumasi markets is a well-known agricultural challenge in Ghana.',
      'Celebrates young Ghanaian women in STEM and engineering leadership.',
    ],
    reviewQuestions: [
      'Is the distinction between company valuation on paper and liquid cash clear to JHS learners?',
      'Does the story clearly state that billion-dollar enterprises are rare exceptions while honouring businesses of all sizes?',
    ],
  },

  // ====================================================================================================================
  // 2. Kofi's One-Cedi Business (Primary 2-3, 9 pages, Customer Needs, Startup Capital, Cost, Price & Profit)
  // ====================================================================================================================
  {
    key: 'kofis-one-cedi-business',
    set: 'extension',
    title: 'Kofi’s One-Cedi Business',
    summary:
      'Eight-year-old Kofi starts with a single one-cedi coin and a big question: can you really start a business with one cedi? With help from his sister Ama and cousin Yaw, he learns how pooling small capital, solving a real customer problem, and subtracting cost from revenue create honest profit.',
    classification: base({
      classIds: ['primary-2', 'primary-3'],
      ageMin: 7,
      ageMax: 9,
      readingLevel: 'early',
      difficulty: 2,
      genres: ['realistic-fiction', 'educational', 'family'],
      themes: ['money-and-enterprise', 'family', 'school'],
      objectives: ['financial-literacy', 'counting', 'problem-solving', 'teamwork', 'honesty', 'vocabulary'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 320,
    }),
    palette: ['#fef3c7', '#d97706'],
    characters: [
      'Kofi: an eight-year-old Ghanaian boy in Primary 3, short cropped black hair, wearing a bright yellow polo shirt and blue shorts.',
      'Ama: Kofi’s ten-year-old sister, neat braided hair with red beads, wearing a green dress.',
      'Yaw: Kofi’s nine-year-old cousin, wearing a striped orange-and-white t-shirt and khaki shorts.',
      'Maame: Kofi and Ama’s mother, a kind seamstress and stationer in her thirties, wearing a blue-and-gold wax-print dress.',
    ],
    pages: [
      {
        text: 'On Saturday morning, eight-year-old Kofi held up a shiny one-cedi coin he had saved from helping sweep the compound. ‘Maame!’ he called excitedly. ‘I want to start a business today with my one cedi!’ Maame smiled over her sewing table. ‘One cedi is a wonderful seed, Kofi, but let us check what materials actually cost before you begin.’',
        alt: 'Eight-year-old Kofi holds up a shiny one-cedi coin beside his mother Maame at her neat sewing and craft table.',
        motif: '🪙👦🏾',
        brief: 'Sunny Ghanaian family veranda: Kofi (8, yellow polo shirt, blue shorts) holding up one shiny coin while Maame (blue-and-gold wax-print dress) smiles beside a table with colourful card offcuts and sewing tools.',
        narration: 'Cheerful, eager voice for Kofi; warm, practical guidance from Maame.',
      },
      {
        text: 'First, Maame taught Kofi the most important rule of enterprise: look for a real problem people want solved. At the Saturday reading club, Kofi noticed that children kept losing their page in their storybooks and folding down the corners of the paper! ‘If we make strong, colourful corner bookmarks that slip right over the page,’ said his sister Ama, ‘readers will never lose their place!’',
        alt: 'At a neighbourhood reading table, Kofi and Ama notice classmates losing their page and bending book corners.',
        motif: '📖💡',
        brief: 'Shaded courtyard reading club: Ghanaian children reading storybooks at a wooden table; Kofi and Ama (10, braided hair with red beads, green dress) pointing thoughtfully at a book where a child is trying to find their page.',
        narration: 'Curious observation leading to Ama’s bright idea.',
      },
      {
        text: 'They checked the cost of supplies at the stationery kiosk. A pack of stiff coloured manila cards and a small tube of paper glue cost five cedis in total, enough to make ten neat bookmarks. Kofi looked at his single coin. ‘You cannot start most businesses with just one cedi alone,’ he realised. ‘One cedi is not enough for the card and glue!’',
        alt: 'At a small stationery kiosk, Kofi looks at his single coin while Ama and Yaw inspect packs of coloured manila card and glue.',
        motif: '🏪🧮',
        brief: 'Friendly neighbourhood stationery counter: Kofi looking down at one coin in his palm while Ama and cousin Yaw (9, striped orange-and-white t-shirt) look at colourful manila card sheets and a glue bottle on the counter (no text or price tags).',
        narration: 'Honest realisation on "You cannot start most businesses with just one cedi alone".',
      },
      {
        text: '‘What if we pool our savings as partners?’ suggested Ama. Kofi put in his one cedi, Ama added two cedis from her savings box, and their cousin Yaw added two cedis. One cedi plus two cedis plus two cedis equalled five cedis of startup capital! Together, the three partners bought the coloured card and glue.',
        alt: 'Kofi, Ama and Yaw place their coins together on the table to make five cedis of startup capital.',
        motif: '🤝🪙',
        brief: 'Close view around a wooden table: Kofi, Ama and Yaw smiling as they bring their coins together into a neat row of five coins beside the coloured card sheets and glue.',
        narration: 'Upbeat teamwork on the addition: "One cedi plus two cedis plus two cedis equalled five cedis".',
      },
      {
        text: 'On the veranda table, the three partners set up a tidy production line. Yaw measured and folded the stiff card into neat triangular pockets, Ama trimmed the edges smoothly, and Kofi decorated each bookmark with cheerful geometric patterns and animal faces. By afternoon, ten sturdy bookmarks stood in a bright row.',
        alt: 'Yaw folds card triangles, Ama trims them neatly, and Kofi draws cheerful animal faces to make ten colourful corner bookmarks.',
        motif: '✂️🎨',
        brief: 'Sunny veranda table: Yaw folding card triangles with a wooden ruler, Ama trimming with safety scissors, and Kofi drawing cute animal faces (a tortoise, a goat, a bird, no letters) on ten bright corner bookmarks.',
        narration: 'Rhythmic, industrious energy as the three children work together.',
      },
      {
        text: 'Now came a big decision: how much should one bookmark cost? Since they spent five cedis to make ten bookmarks, each bookmark cost fifty pesewas in materials. ‘If we sell each bookmark for one cedi,’ said Kofi, ‘it is affordable for our friends, and it covers our fifty-pesewa cost plus fifty pesewas for our hard work!’ They named it Kofi’s One-Cedi Bookmark Business.',
        alt: 'Kofi shows a bookmark slipped neatly onto the corner of a storybook page while Ama and Yaw count out ten bookmarks.',
        motif: '🔖⚖️',
        brief: 'Kofi demonstrating how a colourful tortoise corner bookmark slips snugly onto the top corner of an open picture book, while Ama and Yaw line up the remaining nine bookmarks on a clean cloth.',
        narration: 'Clear, step-by-step explanation of cost per unit (50 pesewas) and fair selling price (1 cedi).',
      },
      {
        text: 'After reading club, children and parents gathered around their small table. One bookmark slipped onto a textbook corner without falling out! One by one, ten customers each paid one cedi for a bookmark. When the last bookmark was sold, Kofi counted the coins in their cash dish: ten times one cedi equalled ten cedis of total sales, called revenue!',
        alt: 'Happy children and a parent buy the colourful corner bookmarks at the reading club while Kofi counts ten one-cedi coins.',
        motif: '🛒😊',
        brief: 'Courtyard reading club table: smiling children holding books with colourful corner bookmarks attached, while Kofi, Ama and Yaw count ten shiny coins in a small wooden bowl.',
        narration: 'Lively market-table excitement, emphasizing "revenue" clearly.',
      },
      {
        text: '‘We have ten cedis! Are we ten cedis richer?’ asked Yaw excitedly. ‘Wait!’ said Maame, opening a small notebook. ‘First you must subtract the five cedis of capital you spent on materials. Ten cedis of revenue minus five cedis of cost leaves five cedis of profit! Profit is what remains after every cost is paid.’',
        alt: 'Maame helps Kofi, Ama and Yaw separate the ten coins into two equal piles of five coins: five cedis to replace their capital and five cedis of profit.',
        motif: '📓➗',
        brief: 'Around the veranda table: Maame pointing gently as Kofi, Ama and Yaw divide the ten coins into two neat groups of five coins on a woven mat.',
        narration: 'Crucial numeracy moment: 10 cedis revenue minus 5 cedis cost equals 5 cedis profit.',
      },
      {
        text: 'The three partners returned their original five cedis to their capital pouch so they could buy fresh card for next Saturday, and shared the five cedis of profit fairly according to what each partner contributed and worked on. Kofi smiled at his coin. One cedi alone could not buy everything, but with planning, teamwork and honest value, it had sparked a real business!',
        alt: 'Kofi, Ama and Yaw smile proudly beside their capital pouch and a fresh stack of coloured card for next week.',
        motif: '🌟🧺',
        brief: 'Warm golden-hour scene on the veranda: Kofi, Ama and Yaw smiling proudly together with their cloth coin pouch and a fresh pack of coloured card, with Maame clapping behind them.',
        narration: 'Warm, proud finish celebrating honesty, teamwork and smart arithmetic.',
      },
    ],
    activities: [
      {
        id: 'kofi-biz-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did Kofi team up with Ama and Yaw before buying the materials?',
        options: [
          'Materials cost 5 cedis, so they pooled 1 + 2 + 2 cedis of capital',
          'The stationery shop only sold card to three children at once',
          'Kofi lost his one-cedi coin on the way to the kiosk',
        ],
        correctIndex: 0,
        explanation: 'One cedi alone was not enough for the 5-cedi materials, so pooling 1 + 2 + 2 = 5 cedis gave them the startup capital they needed.',
      },
      {
        id: 'kofi-biz-v1',
        type: 'vocabulary',
        afterPage: 7,
        word: 'revenue',
        definition: 'The total money received from selling goods or services',
        distractors: [
          'The glue used to stick paper corners together',
          'The money left over after subtracting costs',
        ],
      },
      {
        id: 'kofi-biz-c2',
        type: 'comprehension',
        afterPage: 8,
        question: 'When the children collected 10 cedis in revenue after spending 5 cedis on materials, what was their profit?',
        options: [
          '5 cedis (10 cedis revenue minus 5 cedis cost)',
          '10 cedis (all the coins in the bowl)',
          '15 cedis (10 cedis plus 5 cedis)',
        ],
        correctIndex: 0,
        explanation: 'Profit = Revenue (10 cedis) − Cost (5 cedis) = 5 cedis.',
      },
      {
        id: 'kofi-biz-s1',
        type: 'sequencing',
        afterPage: 9,
        prompt: 'Put the steps of Kofi’s business in the right order.',
        items: [
          'Notice that readers need bookmarks and pool 5 cedis of startup capital.',
          'Make 10 sturdy bookmarks and sell them for 1 cedi each (10 cedis revenue).',
          'Subtract the 5-cedi material cost from 10 cedis to find the 5-cedi profit.',
        ],
      },
      {
        id: 'kofi-biz-sel',
        type: 'sel',
        afterPage: 9,
        prompt: 'How did working fairly with Ama and Yaw help Kofi turn a tiny idea into something real?',
        feelingOptions: ['Cooperative', 'Fair', 'Proud', 'Resourceful'],
      },
    ],
    glossary: [
      { word: 'capital', definition: 'Money saved or pooled together to buy the materials needed to start a business', pages: [4, 8, 9] },
      { word: 'partners', definition: 'People who join their money, skills and work together to run a business and share the results fairly', pages: [4, 5, 9] },
      { word: 'revenue', definition: 'The total money a business brings in from selling its goods or services before subtracting any costs', pages: [7, 8] },
      { word: 'profit', definition: 'The money left over after subtracting all business costs from total revenue', pages: [8, 9] },
    ],
    teacherGuide: {
      overview:
        'An engaging Primary 2–3 enterprise and numeracy story that demystifies how a small business works: identifying a customer problem, realising that 1 cedi alone cannot buy 5 cedis of materials, pooling startup capital (1 + 2 + 2 = 5 cedis), pricing fairly (1 cedi per bookmark), and distinguishing total revenue (10 cedis) from profit (10 − 5 = 5 cedis).',
      learningObjectives: [
        'Explain why businesses exist to solve real problems for customers.',
        'Add startup capital contributions (1 + 2 + 2 = 5 cedis) and calculate unit cost (5 cedis ÷ 10 bookmarks = 50 pesewas each).',
        'Distinguish between total sales (revenue = 10 cedis) and actual gain (profit = 10 − 5 = 5 cedis).',
        'Practise fair teamwork and honest record-keeping.',
      ],
      discussionPrompts: [
        'Why could Kofi not buy the manila card and glue with only his single one-cedi coin?',
        'What problem at the reading club made people happy to pay 1 cedi for a corner bookmark?',
        'Why did Maame remind Yaw that having 10 cedis in the bowl did not mean they had made 10 cedis of profit?',
        'Why did the partners put 5 cedis back into their capital pouch before sharing the profit?',
      ],
      classroomActivities: [
        'Fold-a-Corner Bookmark Craft: Using scrap paper squares, fold triangular corner bookmarks in class and test them on a reader.',
        'Shopkeeper Maths Role-Play: Act out buying materials for 5 cedis, selling 10 items at 1 cedi each, separating the 10 coins into 5 cedis (cost recovery) and 5 cedis (profit).',
      ],
      crossCurricularLinks: ['Mathematics: Addition, Subtraction & Money in Cedis and Pesewas', 'Our World Our People: Work, Honesty & Cooperation', 'Creative Arts: Paper Folding & Pattern Design'],
      discoveryStatus: {
        established: [
          'In economics and accounting, Profit = Total Revenue − Total Costs.',
          'Reinvesting working capital allows a business to restock materials and continue operating.',
        ],
        underInvestigation: [
          'Economists and educators study how early financial literacy games help primary pupils develop stronger numeracy and saving habits.',
        ],
      },
      investigation: {
        title: 'Revenue vs Profit Coin Sorting',
        Materials: 'Ten paper circles or bottle tops labelled "1 cedi" and two small bowls labelled "Cost of Materials (5 cedis)" and "Profit".',
        steps: [
          'Place all 10 bottle-top "cedis" on the desk to represent the 10 cedis of revenue from selling 10 bookmarks.',
          'Count out 5 bottle tops and place them into the "Cost of Materials" bowl to pay back what the card and glue cost.',
          'Count the remaining bottle tops and place them into the "Profit" bowl (10 − 5 = 5 cedis).',
        ],
        explanation:
          'Separating revenue physically into cost recovery and profit prevents the common mistake of spending working capital as if it were all profit.',
      },
      factCheck:
        'Explicitly clarifies on page 3 and page 9 that you cannot start most real businesses with literally 1 cedi alone, Kofi’s 1 cedi is pooled with Ama’s 2 cedis and Yaw’s 2 cedis (5 cedis total capital) to make 10 one-cedi bookmarks.',
    },
    narrationPlan: {
      voice: 'Warm, lively Ghanaian storyteller (en-GH); bright and clear on all coin counts.',
      pace: 'Medium-slow (about 105 words per minute) so Primary 2–3 listeners can follow the arithmetic easily.',
      notes: ['Emphasise the difference between revenue (ten cedis) and profit (five cedis) on page 8.'],
    },
    music: 'Optional cheerful acoustic highlife guitar pluck; off by default.',
    culturalNotes: [
      'Uses Ghana cedis and pesewas accurately (100 pesewas = 1 cedi; 5 cedis ÷ 10 items = 50 pesewas per item).',
    ],
    reviewQuestions: [
      'Is the arithmetic (1 + 2 + 2 = 5 cedis capital; 10 × 1 = 10 cedis revenue; 10 − 5 = 5 cedis profit) crystal clear for Primary 2–3?',
    ],
  },

  // ====================================================================================================================
  // 3. Abena Buys a Piece of a Company (JHS 1-3, 12 pages, Stocks, Bonds, Diversification, GSE & SEC Ghana)
  // ====================================================================================================================
  {
    key: 'abena-buys-a-piece-of-a-company',
    set: 'extension',
    title: 'Abena Buys a Piece of a Company',
    summary:
      'Thirteen-year-old Abena visits her Auntie Esi in Accra and discovers how the Ghana Stock Exchange (GSE), regulated by the Securities and Exchange Commission (SEC Ghana), allows ordinary citizens to buy shares of companies or lend money through bonds, and why diversification, patience and avoiding "get-rich-quick" scams protect long-term wealth.',
    classification: base({
      classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
      ageMin: 12,
      ageMax: 15,
      readingLevel: 'fluent',
      difficulty: 4,
      genres: ['realistic-fiction', 'educational'],
      themes: ['money-and-enterprise', 'family', 'citizenship'],
      objectives: ['financial-literacy', 'critical-thinking', 'reasoning', 'problem-solving', 'vocabulary', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 450,
    }),
    palette: ['#1e3a8a', '#10b981'],
    characters: [
      'Abena: a curious thirteen-year-old Ghanaian girl in JHS 2, neat cornrow braids, wearing a bright yellow blouse and denim skirt.',
      'Auntie Esi: Abena’s aunt in her thirties, a licensed investment advisor in Accra, wearing a tailored royal-blue blazer over a kente-print skirt and glasses.',
      'Kwaku: Abena’s fourteen-year-old cousin, wearing a green polo shirt and carrying a calculator.',
    ],
    pages: [
      {
        text: 'During the school holidays in Accra, thirteen-year-old Abena and her cousin Kwaku walked with Auntie Esi past a busy fruit-processing factory and a major bank on Independence Avenue. ‘Auntie Esi,’ asked Abena, ‘who owns giant companies like these? Does one rich person own the whole building?’ Auntie Esi smiled. ‘Actually, Abena, thousands of ordinary Ghanaians, including teachers, nurses and my own family, own small pieces of public companies!’',
        alt: 'Abena and Kwaku walk with Auntie Esi along a clean Accra avenue past modern commercial buildings.',
        motif: '🏢👩🏾‍💼',
        brief: 'Sunny Accra boulevard with modern glass-and-concrete buildings and tropical trees: Abena (13, cornrows, yellow blouse, denim skirt) and Kwaku (14, green polo shirt) looking up in curiosity as Auntie Esi (royal-blue blazer, glasses) gestures toward a commercial building.',
        narration: 'Curious and engaging opening. Warm, knowledgeable tone from Auntie Esi.',
      },
      {
        text: 'At her office, Auntie Esi drew a giant circle divided into equal slices like a pie. ‘When a large company needs capital to build new factories or branches, it can list on the Ghana Stock Exchange, the GSE,’ she explained. ‘The company’s ownership is divided into thousands or millions of equal units called shares, or stocks. When you buy a share through a licensed broker, you become a part-owner, or shareholder, of that real business.’',
        alt: 'Auntie Esi draws a pie chart divided into small slices on a whiteboard while Abena and Kwaku watch attentively.',
        motif: '🥧📊',
        brief: 'Bright Accra advisory office: Auntie Esi at a whiteboard showing a colourful circular pie chart with one slice highlighted (no words or letters on the board), while Abena and Kwaku lean forward at the table.',
        narration: 'Clear, vivid analogy of the pie divided into shares.',
      },
      {
        text: '‘How does a shareholder earn money from a stock?’ asked Kwaku. ‘In two possible ways,’ said Auntie Esi. ‘First, if the company makes a strong profit, its board may share part of that profit with shareholders as a cash payment called a dividend. Second, if the business grows more valuable over time, the price of your share can rise above what you paid, a capital gain. Remember, though: neither dividends nor price increases are guaranteed!’',
        alt: 'Auntie Esi holds up two coloured cards illustrating a dividend coin pouch and a rising share chart alongside a warning sign for risk.',
        motif: '🪙📈',
        brief: 'Close view at the office desk: Auntie Esi pointing to two visual diagram cards, one showing a factory sharing coins into a hand, the other showing a line chart going both up and down (no text).',
        narration: 'Emphasise both ways stocks can earn returns AND the honest warning that neither is guaranteed.',
      },
      {
        text: '‘Wait, can a share price go down too?’ asked Abena carefully. ‘Yes,’ said Auntie Esi seriously. ‘If a company faces high costs, poor management or tough economic times, its share price can fall below what you paid, causing a capital loss if you sell. That is why investing in stocks carries market risk, and why you should never invest money you will need next week for school fees or food.’',
        alt: 'Abena studies a chart where one company’s line dips downward while Auntie Esi explains market risk.',
        motif: '📉⚠️',
        brief: 'Abena looking thoughtfully at a tablet screen showing a red line dipping downward and a blue line rising steadily (no text), while Auntie Esi speaks seriously beside her.',
        narration: 'Measured, honest tone explaining capital loss and why short-term money must stay safe.',
      },
      {
        text: '‘Is there another way to invest besides buying shares?’ asked Abena. ‘Yes, bonds!’ said Auntie Esi. ‘When you buy a bond from the government or a company, you are not buying ownership. Instead, you are lending money for a fixed period, and the borrower promises to pay you regular interest and return your original principal at maturity. Bonds are generally steadier than stocks, though they still carry risks such as inflation or borrower difficulties.’',
        alt: 'Auntie Esi contrasts a stock ownership certificate icon with a bond loan-and-interest calendar icon.',
        motif: '📜🗓️',
        brief: 'On the desk, two clear visual props side by side: a miniature factory building model (representing stock ownership) and a golden clock with coins beside a calendar (representing a fixed-term bond loan, no text).',
        narration: 'Clear contrast: Stock = part-ownership; Bond = lending money for interest.',
      },
      {
        text: '‘Why not just leave all our money in a wooden box under the bed for ten years so it never drops?’ asked Kwaku. ‘Because of inflation,’ explained Auntie Esi. ‘Inflation is the general rise in prices over time. If a textbook costs fifty cedis today and inflation makes it cost eighty cedis in a few years, fifty cedis sitting idle in a box loses purchasing power! Thoughtful investing helps savings grow faster than inflation over the long term.’',
        alt: 'Kwaku compares a single basket of goods today with a smaller basket in the future to see how inflation reduces purchasing power.',
        motif: '🧺💸',
        brief: 'Thought bubble / tabletop visual comparison: Kwaku holding a coin pouch while looking at two market baskets, one full of books and fruit, the other only half full, illustrating how inflation shrinks what idle cash can buy.',
        narration: 'Clear, relatable explanation of inflation and purchasing power.',
      },
      {
        text: 'To test what they had learned, Auntie Esi gave Abena and Kwaku a fictional one-thousand-cedi classroom portfolio challenge. ‘Never put all your eggs in one basket!’ she reminded them. ‘Spreading money across different investments is called diversification. Let us split our one thousand cedis across three choices: four hundred cedis in Company A stock, two hundred cedis in Company B stock, and four hundred cedis in a one-year bond paying fifteen percent interest.’',
        alt: 'Abena and Kwaku arrange ten paper hundred-cedi tokens into three separate baskets on the desk to diversify their portfolio.',
        motif: '🧺🔢',
        brief: 'Abena and Kwaku placing colourful wooden tokens into three separate small woven baskets on the desk: four tokens in Basket 1, two tokens in Basket 2, and four tokens in Basket 3 (no text labels).',
        narration: 'Interactive, step-by-step setup of the 1,000-cedi diversified portfolio (400 + 200 + 400).',
      },
      {
        text: 'They tracked a full year of real-world economic scenarios. Company A, a well-run food processor, grew its share value from four hundred cedis to four hundred and thirty cedis and paid a twenty-cedi dividend, totalling four hundred and fifty cedis! Meanwhile, Company B faced shipping delays, and its shares dropped from two hundred cedis down to one hundred and eighty cedis, a twenty-cedi loss.',
        alt: 'Abena and Kwaku use a calculator to record Company A growing to 450 cedis while Company B drops to 180 cedis.',
        motif: '🧮📊',
        brief: 'Kwaku pressing keys on a desktop calculator while Abena moves tokens: Basket 1 gains extra gold tokens, while Basket 2 loses a token.',
        narration: 'Realistic simulation showing one stock gaining (+50) and one stock losing (-20).',
      },
      {
        text: 'Then they checked Basket 3: the four-hundred-cedi bond at fifteen percent interest earned sixty cedis, growing to four hundred and sixty cedis! Kwaku added all three baskets together: four hundred and fifty cedis plus one hundred and eighty cedis plus four hundred and sixty cedis equalled one thousand and ninety cedis, a net gain of ninety cedis, or nine percent! ‘Even though Company B fell,’ Abena beamed, ‘diversification protected our portfolio!’',
        alt: 'Abena and Kwaku high-five as their three diversified baskets total 1,090 cedis on the calculator.',
        motif: '🙌🏾📈',
        brief: 'Abena and Kwaku high-fiving across the desk as Auntie Esi points to the three baskets, two fuller than before, balancing out the smaller middle basket.',
        narration: 'Walk through the arithmetic clearly: 450 + 180 + 460 = 1,090 cedis (+90 cedis / 9% return).',
      },
      {
        text: 'Just then, Kwaku showed Auntie Esi a flashy message on a phone promising: ‘Send 200 cedis today and double your money to 400 cedis in 48 hours, guaranteed!’ Auntie Esi’s expression turned firm. ‘Delete that immediately, Kwaku! In Ghana, legitimate investment firms and the Ghana Stock Exchange are regulated by the Securities and Exchange Commission, SEC Ghana. Anyone promising huge, instant, risk-free returns is running a Ponzi scam or fraud!’',
        alt: 'Auntie Esi warns Kwaku and Abena to reject a suspicious "double your money in 48 hours" phone message.',
        motif: '📱🚫',
        brief: 'Close view: Kwaku holding up a smartphone showing a flashy warning icon (no text) while Auntie Esi raises a firm hand in a "stop" gesture and Abena shakes her head wisely.',
        narration: 'Urgent, protective warning against Ponzi schemes and fraudulent "double your money" scams.',
      },
      {
        text: '‘How does a young person start safely when they are still under eighteen?’ asked Abena. ‘First,’ said Auntie Esi, ‘your family keeps an emergency fund in a safe bank or susu account for sudden needs. Second, because minors under eighteen cannot open a brokerage account alone, a parent or guardian can open a regulated trust or junior investment account with a licensed broker until you reach adulthood.’',
        alt: 'Auntie Esi shows Abena and her parents how a regulated junior investment account works alongside a family emergency savings jar.',
        motif: '🏦👨🏾‍👩🏾‍👧🏾',
        brief: 'Warm family living room in Accra: Auntie Esi sitting with Abena, Kwaku and Abena’s parents, showing a clear glass emergency-savings jar beside an official folder with a gold seal (no text).',
        narration: 'Practical, age-appropriate guidance on emergency funds first and parent/guardian accounts for minors.',
      },
      {
        text: 'On the bus ride home, Abena looked out at the busy shops, farms and factories of Ghana with brand-new eyes. She did not just see places to buy snacks anymore, she saw enterprises she could study, build, and one day help own through patient, disciplined investing.',
        alt: 'Looking out the bus window at golden hour, Abena smiles at the bustling businesses and factories of Accra.',
        motif: '🚌🌅',
        brief: 'Golden-hour view by a bus window: Abena smiling thoughtfully out at a vibrant Ghanaian cityscape with shops, solar rooftops and busy streets.',
        narration: 'Thoughtful, empowering close.',
      },
    ],
    activities: [
      {
        id: 'abena-inv-c1',
        type: 'comprehension',
        afterPage: 5,
        question: 'What is the main difference between buying a stock (share) and buying a bond?',
        options: [
          'A stock makes you a part-owner; a bond is lending money for interest',
          'A stock is only for banks; a bond is only for primary school pupils',
          'A stock never changes price; a bond makes you the company president',
        ],
        correctIndex: 0,
        explanation: 'Shares (stocks) represent part-ownership in a company, whereas bonds are loans that pay interest over a set period.',
      },
      {
        id: 'abena-inv-v1',
        type: 'vocabulary',
        afterPage: 7,
        word: 'diversification',
        definition: 'Spreading money across different investments to reduce overall risk',
        distractors: [
          'Putting every cedi you own into a single company stock',
          'Spending all your savings before prices rise',
        ],
      },
      {
        id: 'abena-inv-c2',
        type: 'comprehension',
        afterPage: 9,
        question: 'In the 1,000-cedi portfolio (Stock A → 450, Stock B → 180, Bond → 460), what was the final total?',
        options: [
          '1,090 cedis (a net gain of 90 cedis, or 9%)',
          '980 cedis (a net loss of 20 cedis)',
          '2,000 cedis (doubled in 48 hours)',
        ],
        correctIndex: 0,
        explanation: '450 + 180 + 460 = 1,090 cedis, which is 90 cedis (9%) more than the starting 1,000 cedis despite Stock B falling.',
      },
      {
        id: 'abena-inv-c3',
        type: 'comprehension',
        afterPage: 10,
        question: 'Why did Auntie Esi tell Kwaku to delete the message promising to double 200 cedis in 48 hours?',
        options: [
          'Huge, instant, "guaranteed" returns are a warning sign of a scam',
          'Real investments only work on Sundays',
          'Two hundred cedis is too much money to invest',
        ],
        correctIndex: 0,
        explanation: 'Legitimate investments carry risk and grow over time under SEC Ghana regulation; "double your money in 48 hours" is a classic Ponzi/fraud red flag.',
      },
      {
        id: 'abena-inv-s1',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Order the smart steps of responsible investing from the story.',
        items: [
          'Build an emergency savings fund first for short-term and urgent needs.',
          'Learn how stocks, bonds, risk and diversification work.',
          'Invest patiently through SEC-regulated accounts and avoid quick-money scams.',
        ],
      },
      {
        id: 'abena-inv-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'Why does patient investing require self-control and critical thinking when someone promises "easy fast money"?',
        feelingOptions: ['Discerning', 'Patient', 'Cautious', 'Confident'],
      },
    ],
    glossary: [
      { word: 'shares', definition: 'Equal units of ownership in a company (also called stocks)', pages: [2, 5, 8] },
      { word: 'dividend', definition: 'A portion of a company’s profit paid out to its shareholders', pages: [3] },
      { word: 'bond', definition: 'An investment in which you lend money to a government or company for a set period in exchange for interest payments', pages: [5, 7, 9] },
      { word: 'inflation', definition: 'The general rise in prices over time, which reduces what idle cash can buy', pages: [5, 6] },
      { word: 'diversification', definition: 'Spreading money across different types of investments so one loss does not ruin the whole portfolio', pages: [7, 9] },
      { word: 'portfolio', definition: 'The combined collection of investments held by a person or institution', pages: [7, 9] },
    ],
    teacherGuide: {
      overview:
        'A rigorous, age-appropriate JHS financial literacy story introducing the Ghana Stock Exchange (GSE), the Securities and Exchange Commission (SEC Ghana), stocks vs bonds, dividends, capital gains and losses, inflation, portfolio diversification, and anti-fraud vigilance.',
      learningObjectives: [
        'Distinguish between stocks (equity ownership) and bonds (fixed-income lending).',
        'Explain how dividends, capital gains, capital losses and inflation affect an investor’s purchasing power.',
        'Calculate the total value and percentage return of a diversified portfolio (450 + 180 + 460 = 1,090 cedis on a 1,000-cedi initial investment = +9%).',
        'Identify red flags of investment scams and explain the regulatory role of SEC Ghana and the need for adult/guardian accounts for minors.',
      ],
      discussionPrompts: [
        'If you buy shares in a company listed on the Ghana Stock Exchange, what does that make you, and what are the two ways you might earn a return?',
        'Why did Auntie Esi include a losing stock (Company B dropping from 200 to 180 cedis) in the classroom simulation?',
        'How does inflation quietly shrink money kept idle in a box over many years?',
        'What three warning signs show that an online "investment" offer is actually a scam or Ponzi scheme?',
      ],
      classroomActivities: [
        'Three-Basket Portfolio Maths: Give groups 10 paper "100-cedi" notes to allocate across three baskets (Stock A, Stock B, Bond) and compute the end-of-year value under different sunny and rainy economic cards.',
        'Scam Detector Poster: Design a JHS poster listing SEC Ghana safety checks ("Is the firm licensed by SEC Ghana?", "Does it promise guaranteed instant doubling?", "Do I understand how the business makes money?").',
      ],
      crossCurricularLinks: ['Mathematics: Percentages, Profit/Loss & Portfolio Arithmetic', 'Social Studies: Financial Institutions & Consumer Protection in Ghana', 'Computing & Digital Literacy: Spotting Online Financial Scams'],
      discoveryStatus: {
        established: [
          'In Ghana, the Ghana Stock Exchange (GSE) provides the regulated marketplace for listed equities and corporate/government debt securities, while the Securities and Exchange Commission (SEC Ghana) regulates and licenses capital-market operators.',
          'Diversification across uncorrelated assets reduces portfolio volatility compared with holding a single stock.',
        ],
        underInvestigation: [
          'Financial economists study how mobile-based regulated micro-investing platforms can safely expand capital-market participation in West Africa while screening out unlicensed schemes.',
        ],
      },
      investigation: {
        title: 'One Basket vs Three Baskets Simulation',
        Materials: 'Ten counters (representing 100 cedis each = 1,000 cedis), three cups labelled Stock A, Stock B, and Bond, and a coin to flip.',
        steps: [
          'Scenario 1 (Undiversified): Put all 10 counters (1,000 cedis) into Stock B alone. When Stock B drops by 10%, calculate your ending total (900 cedis, a 100-cedi loss).',
          'Scenario 2 (Diversified): Place 4 counters in Stock A (+12.5% → 450 cedis), 2 counters in Stock B (-10% → 180 cedis), and 4 counters in Bond (+15% → 460 cedis).',
          'Add the three cups in Scenario 2 (450 + 180 + 460 = 1,090 cedis) and compare with Scenario 1.',
        ],
        explanation:
          'When all capital sits in a single company, a downturn in that company hits 100% of your money; spreading capital across multiple assets cushions individual setbacks.',
      },
      factCheck:
        'All portfolio arithmetic is verified (400 + 200 + 400 = 1,000 cedis; 450 + 180 + 460 = 1,090 cedis, net gain +90 cedis = 9%). Explicitly notes that investments can lose value, requires emergency savings first, warns against Ponzi/get-rich-quick schemes, and clarifies that minors under 18 invest only through parent/guardian-managed regulated accounts.',
    },
    narrationPlan: {
      voice: 'Clear, articulate Ghanaian narrator (en-GH); warm and authoritative for Auntie Esi, inquisitive for Abena and Kwaku.',
      pace: 'Medium (about 120 words per minute); pause briefly around the portfolio calculations on pages 7–9.',
      notes: ['Pronounce Abena ("ah-BEH-nah"), Esi ("EH-see"), Kwaku ("KWAY-koo") and Accra ("uh-KRAH") clearly.'],
    },
    music: 'Optional subtle upright bass and soft Rhodes piano chords; off by default.',
    culturalNotes: [
      'References real Ghanaian capital-market institutions: the Ghana Stock Exchange (GSE) and the Securities and Exchange Commission (SEC Ghana).',
    ],
    reviewQuestions: [
      'Are the distinctions between stocks, bonds, emergency savings, and Ponzi scams clear and age-appropriate for JHS 1–3?',
    ],
  },

  // ====================================================================================================================
  // 4. The Umbrella Before the Rain (Primary 5-JHS 1, 10 pages, Insurance, Risk Pooling, NHIS & NIC Ghana)
  // ====================================================================================================================
  {
    key: 'the-umbrella-before-the-rain',
    set: 'extension',
    title: 'The Umbrella Before the Rain',
    summary:
      'When a sudden midnight storm blows the roof off a neighbour’s provision store while Auntie Akosua’s insured tailoring shop recovers quickly, eleven-year-old Yaw learns how insurance, risk pooling, premiums, claims, deductibles, NHIS health protection and the National Insurance Commission (NIC) protect families from sudden financial shocks.',
    classification: base({
      classIds: ['primary-5', 'primary-6', 'jhs-1'],
      ageMin: 10,
      ageMax: 13,
      readingLevel: 'fluent',
      difficulty: 3,
      genres: ['realistic-fiction', 'educational', 'family'],
      themes: ['money-and-enterprise', 'community', 'weather', 'health-and-wellbeing'],
      objectives: ['financial-literacy', 'reasoning', 'problem-solving', 'responsibility', 'vocabulary', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['market', 'local-names'],
      estimatedDurationSec: 360,
    }),
    palette: ['#0284c7', '#facc15'],
    characters: [
      'Yaw: an eleven-year-old Ghanaian boy in Primary 6, observant and caring, wearing a sky-blue polo shirt and khaki shorts, carrying a bright yellow umbrella.',
      'Auntie Akosua: Yaw’s mother, a wise seamstress in her thirties, wearing a neat blue-and-yellow wax-print dress.',
      'Uncle Tetteh: a friendly neighbourhood provision shopkeeper in his forties, wearing a brown collared shirt.',
      'Mrs Mensah: a licensed insurance officer in her thirties, wearing a smart navy jacket and carrying an inspection clipboard.',
    ],
    pages: [
      {
        text: 'Dark storm clouds rolled across the afternoon sky as eleven-year-old Yaw walked to his mother’s tailoring shop carrying a sturdy yellow umbrella. Next door, Uncle Tetteh laughed from behind his provision counter. ‘Yaw, the sun was shining ten minutes ago! Why carry an umbrella before the rain starts?’ His mother, Auntie Akosua, smiled from her sewing machine. ‘Because once the storm is pouring, Uncle Tetteh, it is too late to go shopping for an umbrella!’',
        alt: 'Eleven-year-old Yaw carries a bright yellow umbrella outside Auntie Akosua’s tailoring shop while dark rain clouds gather overhead.',
        motif: '☂️🌩️',
        brief: 'Lively Ghanaian neighbourhood street as dark blue storm clouds gather: Yaw (11, sky-blue polo shirt, khaki shorts) holding a closed yellow umbrella outside Auntie Akosua’s tailoring shop while Uncle Tetteh waves cheerfully from the shop next door.',
        narration: 'Warm, memorable opening metaphor: you prepare the umbrella before the rain begins.',
      },
      {
        text: 'That night, a fierce rainstorm roared through the town. Wind rattled the shutters and heavy rain hammered the metal roofs. In the morning, Yaw and Auntie Akosua stepped outside and gasped. A fallen mango branch had cracked the corner of Auntie Akosua’s shop roof and also smashed the roof of Uncle Tetteh’s provision store next door, soaking sacks of rice and cartons of soap.',
        alt: 'On the morning after the storm, a fallen tree branch rests across the damaged roofs of Auntie Akosua’s and Uncle Tetteh’s adjacent shops.',
        motif: '🌧️🏚️',
        brief: 'Morning light after a storm: a large broken tree branch resting across the corner roofs of two neighbouring shops; puddles on the ground as Yaw, Auntie Akosua and Uncle Tetteh inspect the damage with concern.',
        narration: 'Dramatic storm night followed by sympathetic morning discovery.',
      },
      {
        text: 'Uncle Tetteh sat on a wooden crate with his head in his hands. ‘Fixing my roof and replacing the damaged goods will cost two thousand cedis,’ he whispered. ‘I only have four hundred cedis in my emergency savings, and I never signed up for shop insurance.’ Beside him, Auntie Akosua was also worried about her damaged roof, but she calmly opened a dry metal tin and took out her shop insurance policy document.',
        alt: 'Uncle Tetteh looks distressed beside his soaked cartons while Auntie Akosua opens a dry metal folder containing her insurance policy.',
        motif: '📄😟',
        brief: 'Outside the two shops: Uncle Tetteh sitting sadly on a crate beside damp cardboard boxes, while Auntie Akosua holds a clean official document folder from a waterproof tin as Yaw watches closely.',
        narration: 'Contrast Uncle Tetteh’s distress with Auntie Akosua’s calm preparation.',
      },
      {
        text: '‘Mama, what is insurance, and how can a piece of paper fix a roof?’ asked Yaw. Auntie Akosua drew a big bowl on a piece of card. ‘Insurance works through risk pooling,’ she explained. ‘Imagine one hundred shopkeepers each pay a small regular amount, called a premium, of one hundred cedis a year into one shared protection pool. One hundred times one hundred cedis puts ten thousand cedis into the pool!’',
        alt: 'Auntie Akosua draws a diagram showing 100 shopkeepers each placing 100 cedis into a 10,000-cedi shared protection pool.',
        motif: '🥣🪙',
        brief: 'Auntie Akosua sitting with Yaw and Uncle Tetteh on a dry bench, sketching a visual diagram of many small hands placing coins into a giant central pot under a big yellow umbrella (no text or numbers).',
        narration: 'Clear, step-by-step arithmetic of risk pooling: 100 shopkeepers × 100 cedis = 10,000 cedis in the shared pool.',
      },
      {
        text: '‘In any single year,’ Auntie Akosua continued, ‘most of those one hundred shopkeepers will not have a tree fall on their roof. Suppose only two shops suffer heavy storm damage costing three thousand cedis each, six thousand cedis in total. Because all one hundred shopkeepers shared the risk in advance, the ten-thousand-cedi pool easily pays to repair both damaged shops, so no single family is ruined!’',
        alt: 'The diagram shows the shared pool rebuilding two storm-damaged roofs while the other ninety-eight shops stay safe.',
        motif: '🛡️🏪',
        brief: 'Close view of the visual diagram: golden coins flowing from the central umbrella pot to repair two little shop roofs, while rows of other little shops stand safe in the sunshine (no text).',
        narration: 'Make the logic of risk pooling click clearly for upper-primary and JHS listeners.',
      },
      {
        text: 'That afternoon, Mrs Mensah, a licensed inspector from Auntie Akosua’s insurance company, arrived with her camera and clipboard. Auntie Akosua submitted a formal claim, a request asking the insurer to pay for a covered loss, along with photos of the fallen branch and the carpenter’s repair estimate of two thousand cedis. Mrs Mensah checked the policy rules carefully.',
        alt: 'Mrs Mensah inspects the damaged shop roof with a clipboard and camera while Auntie Akosua and Yaw show the carpenter’s estimate.',
        motif: '📋📸',
        brief: 'Outside Auntie Akosua’s shop: Mrs Mensah (navy jacket, clipboard) photographing the broken roof eave while Auntie Akosua and Yaw stand beside a local carpenter holding a wooden measuring rule.',
        narration: 'Professional, reassuring process of filing and verifying an honest claim.',
      },
      {
        text: '‘Your policy covers sudden storm damage,’ Mrs Mensah explained to Yaw, ‘and it has a two-hundred-cedi deductible, the small first portion of the repair cost that the policyholder pays from their own pocket. Since the carpenter’s repair costs two thousand cedis, you pay your two-hundred-cedi deductible from your emergency savings, and the insurance company pays the remaining one thousand eight hundred cedis!’',
        alt: 'Mrs Mensah explains how the 2,000-cedi repair is split between the 200-cedi deductible and the 1,800-cedi insurance payout.',
        motif: '🧮🤝',
        brief: 'At Auntie Akosua’s worktable: Mrs Mensah placing two small coin stacks on one side and eighteen coin stacks on the other side to show how the repair bill is shared (no text).',
        narration: 'Walk clearly through the deductible maths: 2,000 repair minus 200 deductible equals 1,800 payout.',
      },
      {
        text: '‘Does insurance pay for every single problem?’ asked Yaw. ‘No,’ said Mrs Mensah honestly. ‘Every policy has conditions and exclusions. It covers sudden, unexpected events listed in the contract, like storm or fire damage, not slow everyday wear and tear from rust, and never dishonest or fake claims! Also, in Ghana, always verify that an insurer is licensed by the National Insurance Commission, the NIC, so you know your claims will be honoured fairly.’',
        alt: 'Mrs Mensah points to the official NIC licence seal and explains why honest claims and routine maintenance both matter.',
        motif: '🏛️✅',
        brief: 'Mrs Mensah holding up an official certificate card with a gold shield emblem (no text) while Yaw and Uncle Tetteh listen attentively.',
        narration: 'Important consumer education: policy conditions, exclusions (wear and tear vs sudden loss), honesty, and NIC Ghana regulation.',
      },
      {
        text: '‘Wait!’ said Yaw, remembering his family’s clinic cards. ‘Is the National Health Insurance Scheme, NHIS, also risk pooling?’ ‘Exactly!’ smiled Mrs Mensah. ‘Millions of Ghanaians contribute to the NHIS through taxes and membership renewals so that when anyone falls sick with malaria or needs covered hospital care, the shared pool helps pay the medical bills. Insurance works best alongside an emergency savings fund for deductibles and small daily needs.’',
        alt: 'Yaw holds up his family’s health insurance card with understanding as Auntie Akosua and Mrs Mensah smile.',
        motif: '🏥💳',
        brief: 'Inside the tailoring shop, already being repaired by the carpenter in the background: Yaw holding up a blue-and-gold health card (no text) with a bright smile as Auntie Akosua and Mrs Mensah nod.',
        narration: 'Connect property insurance to everyday Ghanaian life through the NHIS and emergency savings.',
      },
      {
        text: 'By Friday, Auntie Akosua’s roof was gleaming and dry, and her sewing machines were humming again. Together with neighbours, she helped Uncle Tetteh repair his roof, and on Monday morning, Uncle Tetteh walked straight to an NIC-licensed office to register his shop and top up his emergency savings. He grinned at Yaw’s yellow umbrella. ‘From now on, Yaw, I buy my umbrella before the rain!’',
        alt: 'Under a repaired roof in bright sunshine, Uncle Tetteh and Auntie Akosua wave to Yaw and his yellow umbrella.',
        motif: '☀️☂️',
        brief: 'Sunny neighbourhood street outside both newly repaired shops: Uncle Tetteh holding a new policy folder and smiling warmly at Yaw and Auntie Akosua.',
        narration: 'Warm, community-minded ending.',
      },
    ],
    activities: [
      {
        id: 'umbrella-c1',
        type: 'comprehension',
        afterPage: 5,
        question: 'If 100 shopkeepers each pay a 100-cedi premium into a shared pool, how much is in the pool to cover two 3,000-cedi storm losses?',
        options: [
          '10,000 cedis in the pool, which easily covers the 6,000 cedis in losses',
          '1,000 cedis in the pool, which is not enough for one roof',
          '100 cedis in total for the whole town',
        ],
        correctIndex: 0,
        explanation: '100 × 100 cedis = 10,000 cedis in the shared pool, enough to pay 2 × 3,000 = 6,000 cedis of storm repairs.',
      },
      {
        id: 'umbrella-v1',
        type: 'vocabulary',
        afterPage: 6,
        word: 'premium',
        definition: 'The regular payment made to keep an insurance policy active',
        distractors: [
          'A broken tree branch that falls during a thunderstorm',
          'A prize given to people who never carry umbrellas',
        ],
      },
      {
        id: 'umbrella-c2',
        type: 'comprehension',
        afterPage: 7,
        question: 'Auntie Akosua’s covered roof repair cost 2,000 cedis and her policy had a 200-cedi deductible. How much did the insurer pay?',
        options: [
          '1,800 cedis (2,000 repair minus 200 deductible)',
          '2,000 cedis plus an extra 200-cedi bonus',
          '200 cedis only',
        ],
        correctIndex: 0,
        explanation: 'Auntie Akosua paid her 200-cedi deductible from emergency savings, and the insurer paid 2,000 − 200 = 1,800 cedis.',
      },
      {
        id: 'umbrella-c3',
        type: 'comprehension',
        afterPage: 8,
        question: 'Which public body regulates and licenses insurance companies in Ghana?',
        options: [
          'The National Insurance Commission (NIC)',
          'The local carpentry workshop',
          'The weather forecasting station',
        ],
        correctIndex: 0,
        explanation: 'The National Insurance Commission (NIC) licenses and regulates insurers in Ghana to protect policyholders.',
      },
      {
        id: 'umbrella-s1',
        type: 'sequencing',
        afterPage: 10,
        prompt: 'Put the steps of how insurance protected Auntie Akosua’s shop in order.',
        items: [
          'Pay regular premiums into an NIC-licensed pool before any storm.',
          'Submit an honest claim with photos and estimates after storm damage.',
          'Pay the 200-cedi deductible while the pool pays 1,800 cedis.',
        ],
      },
      {
        id: 'umbrella-sel',
        type: 'sel',
        afterPage: 10,
        prompt: 'How did combining personal responsibility (insurance + emergency savings) with neighbourly kindness help the whole street recover?',
        feelingOptions: ['Prepared', 'Relieved', 'Supportive', 'Wise'],
      },
    ],
    glossary: [
      { word: 'insurance', definition: 'An arrangement in which many people contribute to a regulated pool that pays for specified sudden losses', pages: [3, 4, 6, 7, 9] },
      { word: 'premium', definition: 'The regular amount paid by a policyholder to maintain insurance protection', pages: [4] },
      { word: 'claim', definition: 'A formal request asking an insurance company to pay for a loss covered by the policy', pages: [6] },
      { word: 'deductible', definition: 'The small initial portion of a covered repair cost that the policyholder pays before the insurer pays the rest', pages: [7] },
      { word: 'exclusions', definition: 'Specific situations or types of wear and tear that an insurance policy does not pay for', pages: [8] },
    ],
    teacherGuide: {
      overview:
        'An upper-primary and JHS 1 financial literacy story that uses the vivid metaphor of "buying an umbrella before the rain" to explain risk pooling, premiums, claims, deductibles, policy conditions/exclusions, Ghana’s National Health Insurance Scheme (NHIS), regulation by the National Insurance Commission (NIC), and why families need both emergency savings and insurance.',
      learningObjectives: [
        'Explain how risk pooling spreads the cost of rare, expensive disasters across many contributors (100 × 100 = 10,000 cedis pool).',
        'Define premium, policy, claim, deductible and exclusions accurately.',
        'Calculate an insurance payout after subtracting a deductible (2,000 − 200 = 1,800 cedis).',
        'Identify the National Health Insurance Scheme (NHIS) and the National Insurance Commission (NIC) in Ghana.',
      ],
      discussionPrompts: [
        'Why did Auntie Akosua say "once the storm is pouring, it is too late to go shopping for an umbrella"?',
        'How can an insurance company afford to pay 1,800 cedis to repair Auntie Akosua’s roof when her annual premium was much smaller?',
        'Why does an insurance policy cover a sudden storm branch falling on a roof, but NOT a roof that slowly rusted over fifteen years without maintenance?',
        'Why did Auntie Akosua still need a small emergency savings fund even though she had shop insurance?',
      ],
      classroomActivities: [
        'Classroom Risk-Pool Game: 20 pupils each place 1 paper token into a "Class Pencil-Replacement Pool". Draw 2 random names of pupils who suffered a "sudden broken ruler/pencil storm" and award 5 tokens each from the pool to replace their tools.',
        'Deductible Maths Practice: Solve three repair problems with different deductibles (e.g., 1,500-cedi repair with a 150-cedi deductible → 1,350-cedi payout).',
      ],
      crossCurricularLinks: ['Mathematics: Multiplication, Subtraction & Financial Word Problems', 'Social Studies: NHIS, NIC & Community Resilience', 'English Language: Metaphor ("The Umbrella Before the Rain")'],
      discoveryStatus: {
        established: [
          'Risk pooling relies on the Law of Large Numbers: while an individual cannot predict whether a storm will hit their shop this year, a large pool of policyholders experiences a predictable average rate of losses.',
          'In Ghana, the National Insurance Commission (NIC) regulates insurance companies and intermediaries, and the National Health Insurance Scheme (NHIS) pools health risks across the population.',
        ],
        underInvestigation: [
          'Actuaries and agricultural scientists in Ghana are developing satellite-based weather-index micro-insurance to help smallholder farmers recover from severe droughts or floods.',
        ],
      },
      investigation: {
        title: 'Risk-Pooling Dice Simulation',
        Materials: 'Six groups of pupils, one 6-sided die, and 60 counters (10 counters per group).',
        steps: [
          'Round 1 (No Insurance Pool): Each group keeps its 10 counters. Roll the die, whichever group number is rolled suffers a "storm loss" of 12 counters (more than they have!).',
          'Round 2 (Risk Pool): Each of the 6 groups contributes 3 counters (premium) into a central Umbrella Pool (6 × 3 = 18 counters in the pool, leaving 7 counters per group).',
          'Roll the die for the storm loss of 12 counters: the Umbrella Pool pays 11 counters and the affected group pays a 1-counter deductible, every group stays afloat!',
        ],
        explanation:
          'Pooling small premiums turns a catastrophic 12-counter shock that would bankrupt one group into a manageable shared cost.',
      },
      factCheck:
        'Accurately explains risk pooling (100 × 100 = 10,000 cedis covering 2 × 3,000 = 6,000 cedis), deductibles (2,000 − 200 = 1,800 cedis), policy exclusions (sudden covered loss vs wear and tear), the requirement for honest claims, NIC regulation, NHIS health coverage, and the complementary role of emergency savings.',
    },
    narrationPlan: {
      voice: 'Warm, expressive Ghanaian storyteller (en-GH); wise and steady for Auntie Akosua and Mrs Mensah.',
      pace: 'Medium (about 115 words per minute); clear pauses for the risk-pooling and deductible arithmetic.',
      notes: ['Pronounce Akosua ("ah-koh-SWAH") and Tetteh ("TEH-teh") clearly.'],
    },
    music: 'Optional gentle rain sound effect on page 2 giving way to bright acoustic guitar; off by default.',
    culturalNotes: [
      'Connects insurance literacy to Ghana’s familiar National Health Insurance Scheme (NHIS) and the National Insurance Commission (NIC).',
    ],
    reviewQuestions: [
      'Are the concepts of risk pooling, deductibles and exclusions clear for Primary 5–JHS 1 learners?',
    ],
  },

  // ====================================================================================================================
  // 5. Grandpa Mensah's Secret to a Peaceful Retirement (Primary 6-JHS 2, 11 pages, Pensions, Compounding & Ghana's 3-Tier System)
  // ====================================================================================================================
  {
    key: 'grandpa-mensahs-secret-to-a-peaceful-retirement',
    set: 'extension',
    title: 'Grandpa Mensah’s Secret to a Peaceful Retirement',
    summary:
      'Twelve-year-old Efua and her brother Kojo wonder how retired headmaster Grandpa Mensah and retired market trader Grandma Mansa still receive dependable monthly income without working every day, discovering how pensions, compound growth, inflation protection and Ghana’s Three-Tier Pension System (SSNIT, Tier 2 and Tier 3 under NPRA) turn decades of steady contributions into a peaceful retirement.',
    classification: base({
      classIds: ['primary-6', 'jhs-1', 'jhs-2'],
      ageMin: 11,
      ageMax: 14,
      readingLevel: 'fluent',
      difficulty: 4,
      genres: ['realistic-fiction', 'educational', 'family'],
      themes: ['money-and-enterprise', 'family', 'careers'],
      objectives: ['financial-literacy', 'reasoning', 'problem-solving', 'responsibility', 'vocabulary', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-names', 'proverb'],
      estimatedDurationSec: 410,
    }),
    palette: ['#065f46', '#f59e0b'],
    characters: [
      'Grandpa Mensah: a cheerful, dignified sixty-five-year-old retired Ghanaian school headmaster with silver hair, spectacles and a green-and-gold cloth shirt, tending cocoa and mango saplings in his courtyard.',
      'Grandma Mansa: Grandpa Mensah’s warm sixty-two-year-old wife, a retired textile and foodstuff trader, wearing an amber wax-print dress and head-wrap.',
      'Efua: their twelve-year-old granddaughter in JHS 1, curious and observant, wearing a yellow top and blue skirt.',
      'Kojo: Efua’s thirteen-year-old brother in JHS 2, carrying a notebook and pen, wearing a green collared shirt.',
    ],
    pages: [
      {
        text: 'On the first Tuesday of the month, twelve-year-old Efua and her brother Kojo sat on the veranda helping Grandpa Mensah prune young mango saplings in pots. Grandpa Mensah’s mobile phone chimed softly. He smiled at the screen and said to Grandma Mansa, ‘Our monthly pension has arrived, let us pay the electricity bill and buy Efua and Kojo’s new maths sets.’',
        alt: 'On a sunny garden veranda, retired Grandpa Mensah smiles at a notification on his phone while Grandma Mansa, Efua and Kojo tend potted mango saplings.',
        motif: '🌱📱',
        brief: 'Warm Ghanaian courtyard veranda filled with potted mango saplings: Grandpa Mensah (65, silver hair, spectacles, green-and-gold shirt) smiling at his phone while Grandma Mansa (amber wax-print dress) and grandchildren Efua (12, yellow top) and Kojo (13, green shirt) look on.',
        narration: 'Peaceful, warm family atmosphere.',
      },
      {
        text: 'Kojo looked puzzled. ‘Grandpa, you retired from teaching five years ago, and Grandma Mansa handed over her market stall last year. Who is still paying you every month when you no longer go to work?’ Grandpa Mensah chuckled and tapped a tall, fruiting mango tree in the middle of the yard. ‘Thirty-five years ago, Kojo, our younger selves planted the seeds that are feeding us today!’',
        alt: 'Grandpa Mensah points to a tall, fruit-laden mango tree in the courtyard while Kojo and Efua listen in curiosity.',
        motif: '🥭🌳',
        brief: 'Grandpa Mensah standing beside a mature, shady mango tree heavy with ripe golden mangoes, gesturing from a tiny sapling pot to the giant tree as Efua and Kojo listen.',
        narration: 'Wise, affectionate proverb-like metaphor linking tree planting to retirement planning.',
      },
      {
        text: '‘A pension,’ explained Grandpa Mensah, ‘is a long-term retirement fund built during your working years so you have steady income when you are older and can no longer work full-time. Every month when I taught in the classroom, a small fraction of my salary, together with a statutory contribution from my employer, went straight into my pension fund before I could spend it.’',
        alt: 'Grandpa Mensah shows his old teacher’s payslip binder alongside a diagram of monthly contributions flowing into a retirement pot.',
        motif: '📂🪙',
        brief: 'At the veranda table: Grandpa Mensah opening a neat folder of old documents and drawing a simple flow of small monthly coins entering a strong vault icon (no text).',
        narration: 'Clear definition of a pension and automatic monthly payroll contributions.',
      },
      {
        text: '‘Did your pension money just sit still in a box for thirty-five years?’ asked Efua. ‘Not at all!’ said Grandpa Mensah. ‘The pension fund invested our contributions carefully so they grew through compounding, earning returns not only on our original savings, but also on the previous years’ returns! Let us do a quick calculation in your notebook, Kojo.’',
        alt: 'Efua and Kojo open their notebooks as Grandpa Mensah prepares to demonstrate compound growth.',
        motif: '📓📈',
        brief: 'Close view at the veranda table: Efua and Kojo leaning over an open notebook with a pencil as Grandpa Mensah arranges mango seeds into groups to demonstrate compounding (no text).',
        narration: 'Enthusiastic invitation to test the maths of compounding.',
      },
      {
        text: '‘Suppose you place one thousand cedis into a fund that earns ten percent a year,’ said Grandpa Mensah. ‘In Year 1, ten percent of one thousand cedis is one hundred cedis, so your balance grows to one thousand one hundred cedis. In Year 2, you earn ten percent on the full one thousand one hundred cedis, which is one hundred and ten cedis! One thousand one hundred plus one hundred and ten equals one thousand two hundred and ten cedis.’',
        alt: 'Kojo writes the Year 1 (1,100 cedis) and Year 2 (1,210 cedis) compounding numbers while Grandpa Mensah points to the extra 10 cedis earned on Year 1’s return.',
        motif: '🧮✨',
        brief: 'Grandpa Mensah pointing to three neat rows of mango seeds on a board: row one has ten seeds, row two adds one seed, and row three adds one seed plus an extra golden seed, while Kojo smiles in understanding.',
        narration: 'Walk through the exact numbers slowly and clearly: 1,000 → 1,100 in Year 1; 10% of 1,100 = 110 → 1,210 in Year 2.',
      },
      {
        text: '‘That extra ten cedis in Year 2 looks small at first,’ said Efua, ‘but what happens over thirty or forty years of working and adding new contributions every single month?’ ‘It snowballs!’ said Grandpa Mensah. ‘When you start early in your twenties instead of waiting until your fifties, compounding has decades to work for you.’',
        alt: 'A visual chart compares a steep rising curve from starting early at age 22 with a much smaller curve from starting late at age 50.',
        motif: '⏳📊',
        brief: 'Grandpa Mensah holding up a sketch card showing two staircases of coins, one long green staircase starting early and rising high, and a short yellow staircase starting late (no text).',
        narration: 'Emphasise the power of time and starting early.',
      },
      {
        text: 'Then Kojo turned to Grandma Mansa. ‘Grandma, Grandpa was a government school headmaster, so his employer sent his contributions automatically. What about you? You worked for yourself in the market!’ Grandma Mansa smiled proudly. ‘That is the beauty of Ghana’s Three-Tier Pension System, regulated by the National Pensions Regulatory Authority, the NPRA!’',
        alt: 'Grandma Mansa holds up three stacked woven baskets representing Ghana’s Three-Tier Pension System.',
        motif: '🧺🏛️',
        brief: 'Grandma Mansa smiling warmly as she places three neatly stacked colourful woven baskets on the veranda table to illustrate the Three-Tier Pension System for Efua and Kojo.',
        narration: 'Warm pride from Grandma Mansa introducing the NPRA and Ghana’s Three-Tier Pension System.',
      },
      {
        text: 'Grandma Mansa tapped the bottom basket first. ‘Tier 1 is the mandatory basic national social security scheme managed by SSNIT, the Social Security and National Insurance Trust. It pays retired workers like Grandpa a steady monthly pension for life. The middle basket, Tier 2, is a mandatory occupational scheme managed by licensed private trustees that pays a lump sum when you retire.’',
        alt: 'Grandma Mansa points to the first two baskets representing Tier 1 (SSNIT monthly pension) and Tier 2 (lump-sum occupational benefit).',
        motif: '1️⃣2️⃣',
        brief: 'Close view of the first two stacked baskets: beside the bottom basket sits a calendar with monthly coins (Tier 1 monthly pension); beside the second basket sits a larger tied cloth pouch (Tier 2 lump sum, no text).',
        narration: 'Clear distinction between Tier 1 (SSNIT monthly pension) and Tier 2 (occupational lump-sum benefit).',
      },
      {
        text: 'Then Grandma Mansa lifted the top basket. ‘And Tier 3 includes voluntary provident funds and personal pension schemes! Because I was a self-employed market trader in the informal sector, I joined an NPRA-licensed Tier 3 personal pension scheme and contributed faithfully every week from my market profits. Now I receive my own retirement income too, without anyone having to beg or borrow!’',
        alt: 'Grandma Mansa lifts the third basket proudly, showing how informal-sector traders and self-employed workers save through Tier 3 pensions.',
        motif: '3️⃣👩🏾‍🌾',
        brief: 'Grandma Mansa holding the bright top basket while a visual flashback scene behind her shows her younger self at a colourful textile stall placing weekly coins into a pension passbook (no text).',
        narration: 'Empowering message for informal-sector and self-employed workers in Ghana.',
      },
      {
        text: '‘Does inflation affect pensions too?’ asked Efua, remembering how prices rise over decades. ‘Very good question, Efua!’ said Grandpa Mensah. ‘Because prices rise over twenty or thirty years, pension funds invest in assets that aim to grow faster than inflation, and wise workers also make extra voluntary Tier 3 contributions so their retirement income keeps its purchasing power.’',
        alt: 'Efua asks about inflation while Grandpa Mensah shows how Tier 3 voluntary top-ups strengthen retirement security.',
        motif: '🛡️📈',
        brief: 'Efua raising her finger thoughtfully while Grandpa Mensah places an extra small coin pouch atop the three stacked baskets to show protection against rising prices.',
        narration: 'Connects pensions back to inflation and proactive voluntary saving.',
      },
      {
        text: 'Grandpa Mensah handed Efua and Kojo each a small potted mango sapling to plant near the school fence. ‘Supporting elderly relatives is a cherished Ghanaian value,’ he told them gently, ‘and preparing your own pension early is one of the greatest gifts you can give your future self and your children. Plant early, contribute steadily, and let time help your tree grow!’',
        alt: 'Efua and Kojo each hold a young mango sapling beside Grandpa Mensah and Grandma Mansa under the shade of the tall mango tree.',
        motif: '🌱🌳',
        brief: 'Golden sunlight in the courtyard: Efua and Kojo holding young mango saplings in pots while Grandpa Mensah and Grandma Mansa stand smiling beneath the big fruiting mango tree.',
        narration: 'Warm, dignified conclusion blending Ghanaian family respect with lifelong financial independence.',
      },
    ],
    activities: [
      {
        id: 'pension-c1',
        type: 'comprehension',
        afterPage: 5,
        question: 'If 1,000 cedis earns 10% per year, why does it grow to 1,210 cedis after 2 years instead of 1,200 cedis?',
        options: [
          'In Year 2 you earn 10% on 1,100 cedis (110 cedis), compounding the growth',
          'The bank made a counting mistake of 10 cedis',
          'Ten percent of 1,000 cedis is 105 cedis each year',
        ],
        correctIndex: 0,
        explanation: 'Year 1: 1,000 + 100 = 1,100 cedis. Year 2: 10% of 1,100 = 110 cedis, so 1,100 + 110 = 1,210 cedis.',
      },
      {
        id: 'pension-v1',
        type: 'vocabulary',
        afterPage: 4,
        word: 'compounding',
        definition: 'Earning returns on both your original savings and past returns',
        distractors: [
          'Spending all your savings at the end of every month',
          'Keeping coins inside an unsealed clay pot',
        ],
      },
      {
        id: 'pension-c2',
        type: 'comprehension',
        afterPage: 9,
        question: 'How did Grandma Mansa, a self-employed market trader, build a formal pension in Ghana?',
        options: [
          'By contributing regularly to an NPRA-regulated Tier 3 personal pension',
          'By waiting for a surprise lottery prize at age sixty',
          'Only government teachers are allowed to save for retirement',
        ],
        correctIndex: 0,
        explanation: 'Ghana’s Tier 3 personal pension schemes allow self-employed and informal-sector workers to build regulated retirement savings.',
      },
      {
        id: 'pension-c3',
        type: 'comprehension',
        afterPage: 8,
        question: 'In Ghana’s Three-Tier Pension System, what do Tier 1 (SSNIT) and Tier 2 provide at retirement?',
        options: [
          'Tier 1 pays a monthly pension; Tier 2 pays a lump sum',
          'Both tiers only pay in mango saplings',
          'Tier 1 is only for children; Tier 2 is only for tourists',
        ],
        correctIndex: 0,
        explanation: 'Tier 1 (SSNIT) provides a monthly pension for life, while Tier 2 provides a lump-sum occupational payout.',
      },
      {
        id: 'pension-s1',
        type: 'sequencing',
        afterPage: 11,
        prompt: 'Order the stages of building a peaceful retirement.',
        items: [
          'Start contributing a slice of income early in your working life.',
          'Let contributions grow over decades through compounding in Tiers 1–3.',
          'Receive steady monthly pension and lump-sum benefits in retirement.',
        ],
      },
      {
        id: 'pension-sel',
        type: 'sel',
        afterPage: 11,
        prompt: 'Why did Grandpa Mensah compare saving for retirement to planting a mango sapling decades before you need the shade and fruit?',
        feelingOptions: ['Farsighted', 'Grateful', 'Disciplined', 'Peaceful'],
      },
    ],
    glossary: [
      { word: 'pension', definition: 'A long-term fund built during a person’s working years to provide regular income during retirement', pages: [1, 3, 4, 8, 9, 10, 11] },
      { word: 'retired', definition: 'Having stepped back from full-time employment in older age after years of work', pages: [2, 8] },
      { word: 'compounding', definition: 'The process by which investment returns themselves earn additional returns over time', pages: [4, 6] },
      { word: 'mandatory', definition: 'Required by law for eligible workers and employers', pages: [8] },
      { word: 'voluntary', definition: 'Chosen freely, such as extra personal pension contributions in Tier 3', pages: [9, 10] },
    ],
    teacherGuide: {
      overview:
        'An upper-primary and JHS story explaining pensions, compound growth (1,000 → 1,100 → 1,210 cedis at 10% per year), inflation awareness, and Ghana’s Three-Tier Pension System (National Pensions Act, Act 766, regulated by the NPRA: Tier 1 SSNIT monthly pension, Tier 2 mandatory lump-sum scheme, and Tier 3 voluntary personal/provident schemes including informal-sector workers).',
      learningObjectives: [
        'Explain why workers contribute regularly to a pension during their active earning years.',
        'Calculate two-year compound growth (1,000 cedis at 10% → 1,100 cedis in Year 1 → 1,210 cedis in Year 2) and contrast it with simple interest (1,200 cedis).',
        'Describe the three tiers of Ghana’s pension system (Tier 1 SSNIT, Tier 2 occupational lump sum, Tier 3 voluntary/informal sector) and the role of the NPRA.',
        'Explain why starting early and accounting for inflation matter for long-term financial security.',
      ],
      discussionPrompts: [
        'Why did Grandpa Mensah point to the mature mango tree when Kojo asked who was paying him in retirement?',
        'In Year 2 of the 1,000-cedi compounding example, where did the extra 10 cedis (1,210 vs 1,200) come from?',
        'How does Tier 3 make sure self-employed market traders, artisans, farmers and drivers in Ghana are not left out of retirement planning?',
        'How do family care for elders and personal pension planning work together in modern Ghana?',
      ],
      classroomActivities: [
        'Simple vs Compound Growth Table: Calculate Year 1, Year 2 and Year 3 balances for 1,000 cedis at 10% under simple interest (1,100; 1,200; 1,300) versus compound growth (1,100; 1,210; 1,331).',
        'Three-Tier Sorting Cards: Match worker profiles (a schoolteacher, a hospital nurse, a self-employed Kumasi cloth trader, a software freelancer) to how they use Tier 1, Tier 2 and Tier 3.',
      ],
      crossCurricularLinks: ['Mathematics: Percentages & Compound Interest', 'Social Studies: Social Security, SSNIT, NPRA & Ageing with Dignity in Ghana', 'Career Technology: Formal & Informal Sector Livelihoods'],
      discoveryStatus: {
        established: [
          'Under Ghana’s National Pensions Act, 2008 (Act 766), the National Pensions Regulatory Authority (NPRA) regulates a Three-Tier system: Tier 1 (SSNIT mandatory basic national social security), Tier 2 (mandatory privately managed occupational scheme), and Tier 3 (voluntary provident fund and personal pension schemes designed to include informal-sector workers).',
          'Compound growth follows the formula A = P(1 + r)^t, meaning time in the market exponentially increases the effect of reinvested returns.',
        ],
        underInvestigation: [
          'Pension researchers in Ghana are studying how mobile-money micro-contributions and automated reminders can boost Tier 3 participation among informal-sector youth.',
        ],
      },
      investigation: {
        title: 'Year-by-Year Compounding Seed Lab',
        Materials: '100 dried beans or maize kernels and 3 small bowls labelled "Start (Year 0)", "End of Year 1", and "End of Year 2".',
        steps: [
          'Count 100 beans into the Year 0 bowl (representing 1,000 cedis, where 1 bean = 10 cedis).',
          'For Year 1 at 10% growth, add 10% of 100 beans (10 beans) to get 110 beans (1,100 cedis).',
          'For Year 2 at 10% growth, calculate 10% of the 110 beans (11 beans) and add them to get 121 beans (1,210 cedis). Point out the 11th bean that came from Year 1’s growth!',
        ],
        explanation:
          'Seeing the 11th bean physically shows why compound growth accelerates over time compared with adding a flat 10 beans each year.',
      },
      factCheck:
        'Accurately presents Ghana’s Three-Tier Pension System under NPRA (Tier 1 SSNIT monthly pension, Tier 2 occupational lump sum, Tier 3 voluntary/informal sector personal pension) and verifies the compounding calculation (1,000 × 1.10 = 1,100; 1,100 × 1.10 = 1,210).',
    },
    narrationPlan: {
      voice: 'Warm, unhurried Ghanaian storyteller (en-GH); gentle, wise cadence for Grandpa Mensah and proud clarity for Grandma Mansa.',
      pace: 'Medium (about 115 words per minute); pause clearly on the Year 1 and Year 2 compounding numbers on page 5.',
      notes: ['Pronounce Efua ("eh-FOO-ah"), Kojo ("KOH-joh") and Mansa ("MAHN-sah") naturally.'],
    },
    music: 'Optional gentle acoustic guitar fingerpicking reminiscent of palm-wine highlife; off by default.',
    culturalNotes: [
      'Balances traditional Ghanaian respect for caring for elders with modern formal and informal-sector pension planning (SSNIT, Tier 2, Tier 3).',
    ],
    reviewQuestions: [
      'Is the Three-Tier Pension System explanation clear and accurate for Primary 6–JHS 2 learners?',
    ],
  },

  // ====================================================================================================================
  // 6. The App That Created a Hundred Jobs (JHS 1-3, 12 pages, Software, Customer Discovery, Privacy & Job Creation)
  // ====================================================================================================================
  {
    key: 'the-app-that-created-a-hundred-jobs',
    set: 'extension',
    title: 'The App That Created a Hundred Jobs',
    summary:
      'In a fictional multi-year story beginning at a JHS coding club in Accra, Kwame and Adwoa learn why building an app without talking to users fails, and how customer discovery, low-bandwidth engineering, data privacy under Ghana’s Data Protection Act (Act 843), fair commission splits and years of perseverance grow a trusted repair-services platform that supports a hundred decent jobs.',
    classification: base({
      classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
      ageMin: 12,
      ageMax: 15,
      readingLevel: 'proficient',
      difficulty: 5,
      genres: ['realistic-fiction', 'educational'],
      themes: ['technology', 'money-and-enterprise', 'careers', 'community'],
      objectives: ['financial-literacy', 'problem-solving', 'perseverance', 'teamwork', 'responsibility', 'critical-thinking'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 460,
    }),
    palette: ['#312e81', '#06b6d4'],
    characters: [
      'Kwame: a Ghanaian boy introduced at age fourteen in a JHS coding club in Accra (wearing a navy polo shirt) and later shown as a young software developer in his twenties.',
      'Adwoa: Kwame’s classmate and co-founder, a sharp problem-solver with natural puffs and a cyan blouse, who leads operations, user research and technician training.',
      'Master Ibrahim: a skilled vocational-school electrical and plumbing instructor in his forties, wearing a neat grey work jacket and carrying a multimeter.',
      'Madam Akua: a busy bakery owner in Accra in her thirties, wearing a white apron over a colourful wax-print dress.',
    ],
    pages: [
      {
        text: 'At their JHS coding club in Accra, fourteen-year-old Kwame and Adwoa loved writing code on the school computers. One afternoon, Bakery owner Madam Akua rushed past the school gate looking stressed: her dough mixer had stopped working, and she did not know which neighbourhood electrician she could trust to fix it quickly and fairly. Meanwhile, right across the road at the vocational training centre, skilled young graduates sat waiting all week for customers to find them.',
        alt: 'Outside the school gate in Accra, Madam Akua worries over her bakery while skilled young technicians wait with their toolboxes across the street.',
        motif: '🥖🧰',
        brief: 'Split street view in Accra: on one side Madam Akua (white apron over wax-print dress) looking worried outside her bakery; on the other side young vocational graduates sitting with neat toolboxes beside Master Ibrahim (grey work jacket); Kwame (14, navy polo) and Adwoa (14, natural puffs, cyan blouse) observing both.',
        narration: 'Set up the two-sided marketplace problem clearly: households/shops needing trusted repairs, and trained youth needing steady work.',
      },
      {
        text: '‘We can solve this in one weekend with an app!’ declared Kwame excitedly. Without interviewing a single electrician or shopkeeper, Kwame and Adwoa stayed indoors for two weeks building Version 1. They packed it with heavy animations, five pages of English registration forms, and high-resolution video uploads. Proudly, they launched it to the neighbourhood.',
        alt: 'Kwame and Adwoa excitedly code a complicated, graphic-heavy app on a laptop without talking to any customers first.',
        motif: '💻🚀',
        brief: 'School computer lab: Kwame and Adwoa typing eagerly at a laptop whose screen shows a complex, crowded layout of icons and video boxes (no readable text).',
        narration: 'Show the classic beginner mistake: rushing to write code without customer discovery.',
      },
      {
        text: 'Version 1 was a complete flop! In the first week, only three people opened it, and zero repairs were booked. Why? The heavy animations ate up expensive mobile data, failed to load when the network signal dropped to 2G or 3G, and required customers to type long technical descriptions they did not understand. Kwame stared at the empty dashboard in dismay.',
        alt: 'A technician’s phone shows a spinning loading circle as Kwame and Adwoa look at their empty booking dashboard in disappointment.',
        motif: '📱📉',
        brief: 'Outdoors by a workshop: a young technician holding a basic smartphone with a spinning loading wheel icon while Kwame and Adwoa look deflated beside their laptop.',
        narration: 'Honest, relatable setback: why technology fails when it ignores real user constraints.',
      },
      {
        text: '‘We built for our own laptop screen instead of listening to real people,’ said Adwoa. They closed their laptops, picked up paper notebooks, and spent a month doing customer discovery, interviewing thirty shopkeepers, parents and vocational technicians with Master Ibrahim. They learned three critical truths: users needed tiny data usage, clear upfront pricing, and a way to know every technician was genuinely qualified and safe.',
        alt: 'Adwoa and Kwame interview Madam Akua and Master Ibrahim with paper notebooks, listening carefully to what they actually need.',
        motif: '📓👂🏾',
        brief: 'Inside Master Ibrahim’s vocational workshop: Adwoa and Kwame taking notes in paper notebooks as Master Ibrahim and Madam Akua point to a simple checklist and a multimeter.',
        narration: 'Turning point: humility, listening and structured customer discovery.',
      },
      {
        text: 'Years of learning and disciplined iteration followed. As they progressed through senior high and university computer science and business courses, Kwame and Adwoa rebuilt the platform from the ground up. Version 2 used ultra-light screens that loaded in two seconds on slow connections, worked via a simple USSD short-code for phones without internet data, and let customers pick common repairs with three taps.',
        alt: 'Now young adults, Kwame and Adwoa test a fast, lightweight version of the platform that works on both smartphones and basic feature phones.',
        motif: '⚡📲',
        brief: 'University innovation hub: Kwame and Adwoa (now in their early twenties) testing a clean, minimal interface on a budget smartphone alongside a basic keypad phone (no readable text).',
        narration: 'Show realistic multi-year skill growth and smart low-bandwidth engineering.',
      },
      {
        text: 'Because the app handled customers’ home addresses, phone numbers and mobile-money payments, Kwame and Adwoa made cybersecurity and privacy a top priority. Following Ghana’s Data Protection Act, 2012 (Act 843), they collected only necessary information, encrypted every user record, never sold customer data to strangers, and masked phone numbers after a job was completed.',
        alt: 'Kwame implements encryption and privacy shields on the server while Adwoa reviews their Data Protection Commission compliance checklist.',
        motif: '🔒🛡️',
        brief: 'Clean office desk: Kwame working on a computer displaying a glowing padlock and shield icon over database blocks (no text), while Adwoa reviews a compliance binder.',
        narration: 'Emphasise responsible software engineering and compliance with Ghana’s Data Protection Act (Act 843).',
      },
      {
        text: 'Next, they solved the hardest problem of all: human trust. An app is only as good as the people behind it! Partnering with Master Ibrahim’s technical institute, Adwoa set up a rigorous verification and training programme. Every plumber, electrician, solar installer and appliance technician passed a practical skills test, an ID and background check, and customer-service training before receiving a verified badge and uniform.',
        alt: 'Master Ibrahim and Adwoa test and certify young female and male technicians in a hands-on electrical and plumbing lab.',
        motif: '👷🏾‍♀️✅',
        brief: 'Bright technical training workshop: Master Ibrahim and Adwoa watching a young female electrician and a young male plumber complete a neat wiring and pipe test bench, wearing smart cyan-and-navy technician shirts.',
        narration: 'Show that real tech businesses combine software with offline quality, training and safety.',
      },
      {
        text: 'How did the business sustain itself financially? Kwame and Adwoa designed a transparent revenue model. When Madam Akua booked an electrical repair for one hundred cedis, ninety cedis, ninety percent, went directly to the certified technician for their skilled work and transport, while the platform kept a ten-cedi, ten percent, service fee to pay for servers, customer support, insurance and training.',
        alt: 'A visual diagram shows a 100-cedi repair payment splitting cleanly into 90 cedis for the technician and 10 cedis for the platform’s operating costs.',
        motif: '🪙⚖️',
        brief: 'Madam Akua smiling as she pays via mobile phone after her bakery mixer is fixed by a young female technician; a clean visual inset shows nine gold coins going to the technician and one coin going to the platform hub (no text).',
        narration: 'Walk through the unit economics clearly: 100-cedi job = 90 cedis (90%) to the technician + 10 cedis (10%) platform fee.',
      },
      {
        text: 'Growth was steady, not overnight magic. In Year 1, only twelve technicians used the platform. In Year 2, a server crash during a rainy weekend taught Kwame to build automated backups, and a dispute over a spare part taught Adwoa to add digital receipts and a thirty-day workmanship guarantee. Step by step, word of mouth spread across Accra, Kumasi, Cape Coast and Takoradi.',
        alt: 'A timeline montage shows the team fixing a server bug, issuing digital receipts and expanding steadily over five years.',
        motif: '🛠️📈',
        brief: 'Bustling operations room: Kwame monitoring green server health lights while Adwoa and customer-support staff in headsets assist technicians and customers on a map of southern and middle Ghana.',
        narration: 'Realistic multi-year operational grit: backups, receipts, guarantees and gradual trust.',
      },
      {
        text: 'Five years after launching Version 2, Kwame and Adwoa celebrated a milestone that meant more to them than any trophy. Their company employed twenty-five full-time salaried staff, software engineers, customer-support agents, quality inspectors and accountants, and provided steady, dignified daily income for seventy-five certified independent technicians across Ghana. Twenty-five plus seventy-five equalled one hundred decent jobs!',
        alt: 'Kwame, Adwoa and Master Ibrahim stand proudly with twenty-five office staff and seventy-five certified technicians in a sunny courtyard.',
        motif: '💯👷🏾‍♂️',
        brief: 'Wide celebratory courtyard photo in Accra: Kwame, Adwoa and Master Ibrahim surrounded by a joyful group of office staff (with laptops and headsets) and uniformed male and female technicians holding their toolkits.',
        narration: 'Clear, celebratory arithmetic: 25 full-time staff + 75 certified technicians = 100 decent jobs created over 5 years.',
      },
      {
        text: 'One of those seventy-five technicians was twenty-two-year-old Esi, who used her steady ninety-percent earnings to rent her own workshop, enroll in a Tier 3 personal pension, and train two younger apprentices from her neighbourhood. When one business creates honest work, the ripple reaches whole families and communities.',
        alt: 'Certified electrician Esi teaches two younger apprentices in her own tidy neighbourhood workshop.',
        motif: '⚡👩🏾‍🔧',
        brief: 'Bright neighbourhood electrical workshop: Esi (22, cyan-and-navy technician shirt, safety glasses) showing two eager teenage apprentices how to test a solar inverter with a multimeter.',
        narration: 'Show the multiplier effect of decent job creation and link back to Tier 3 pension habits.',
      },
      {
        text: 'When Kwame and Adwoa visited their old JHS coding club to mentor the newest class of fourteen-year-olds, Adwoa wrote one sentence on the board: Code is a tool; solving human problems with fairness and trust is the business. The students opened their notebooks, ready to listen first, learn deeply, and build for Ghana’s future.',
        alt: 'Kwame and Adwoa mentor JHS coding club students who have both laptops and customer-interview notebooks open on their desks.',
        motif: '🏫🌟',
        brief: 'Back in the JHS computer room: Kwame and Adwoa smiling warmly as JHS students work in pairs with both laptops and paper interview notebooks open on their desks.',
        narration: 'Inspiring closing message grounding technology in human empathy, ethics and job creation.',
      },
    ],
    activities: [
      {
        id: 'app-jobs-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did Kwame and Adwoa’s first version of the app fail?',
        options: [
          'They coded without talking to users, making it data-heavy and confusing',
          'Nobody in Accra ever needed a plumber or electrician',
          'Their school computer had no keyboard',
        ],
        correctIndex: 0,
        explanation: 'Version 1 was built without customer discovery, so it wasted mobile data, failed on slow networks, and did not fit real users’ needs.',
      },
      {
        id: 'app-jobs-v1',
        type: 'vocabulary',
        afterPage: 6,
        word: 'encrypted',
        definition: 'Protected in secret code so unauthorized people cannot read private data',
        distractors: [
          'Made to use extra mobile data on every click',
          'Printed on street posters for strangers to read',
        ],
      },
      {
        id: 'app-jobs-c2',
        type: 'comprehension',
        afterPage: 8,
        question: 'On a 100-cedi repair job, how was the payment split between the certified technician and the platform?',
        options: [
          '90 cedis (90%) to the technician and 10 cedis (10%) platform fee',
          '100 cedis to the app founders and 0 cedis to the technician',
          '50 cedis to the customer and 50 cedis to the internet company',
        ],
        correctIndex: 0,
        explanation: 'The technician earned 90 cedis (90%) for their skilled work, while the 10-cedi (10%) fee covered servers, support, training and insurance.',
      },
      {
        id: 'app-jobs-c3',
        type: 'comprehension',
        afterPage: 10,
        question: 'How did the platform reach 100 decent jobs after five years of steady work?',
        options: [
          '25 full-time staff plus 75 certified technicians earning steady income',
          '100 people downloading the app in the first five minutes',
          'Hiring 100 actors to stand outside the bakery',
        ],
        correctIndex: 0,
        explanation: '25 full-time employees (engineers, support, inspectors, accountants) + 75 certified technicians = 100 jobs.',
      },
      {
        id: 'app-jobs-s1',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Order the steps that turned Kwame and Adwoa’s failed prototype into a job-creating enterprise.',
        items: [
          'Interview real customers and technicians after Version 1 fails.',
          'Build a low-data, private platform with certified technicians.',
          'Grow over five years to support 25 staff and 75 technicians.',
        ],
      },
      {
        id: 'app-jobs-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'Why did Adwoa tell the coding club that listening to people and building trust matter just as much as writing code?',
        feelingOptions: ['Empathetic', 'Persistent', 'Ethical', 'Motivated'],
      },
    ],
    glossary: [
      { word: 'encrypted', definition: 'Protected with mathematical code so private data cannot be read by unauthorized people', pages: [6] },
      { word: 'verification', definition: 'Checking and testing a person’s identity, skills and safety before certifying them', pages: [7] },
      { word: 'milestone', definition: 'An important stage or achievement reached after sustained effort', pages: [10] },
      { word: 'apprentices', definition: 'Young learners training under a skilled craftsperson or technician to master a trade', pages: [11] },
    ],
    teacherGuide: {
      overview:
        'A realistic JHS technology and entrepreneurship story showing how a software platform creates real economic value only when combined with customer discovery, inclusive low-bandwidth design (including USSD), data privacy under Ghana’s Data Protection Act, 2012 (Act 843), vocational skills verification, fair commission splits (90/10), and multi-year operational persistence.',
      learningObjectives: [
        'Explain why customer discovery (interviewing users before coding) prevents wasted effort and failed products.',
        'Describe how low-bandwidth design and USSD make digital services accessible across Ghana.',
        'Explain why software builders must protect personal data under Ghana’s Data Protection Act, 2012 (Act 843).',
        'Calculate marketplace revenue splits (90 cedis technician earnings + 10 cedis platform fee = 100 cedis) and total job creation (25 staff + 75 technicians = 100 jobs).',
      ],
      discussionPrompts: [
        'Why did Version 1 of Kwame and Adwoa’s app get zero bookings even though they spent two weeks coding animations?',
        'What three changes in Version 2 came directly from listening to Madam Akua and Master Ibrahim?',
        'Why is it fair and sustainable for the technician to keep 90 cedis of a 100-cedi repair while the platform keeps 10 cedis?',
        'How do digital platforms and hands-on TVET (Technical and Vocational Education and Training) skills depend on each other?',
      ],
      classroomActivities: [
        'User-Interview Role-Play: Before sketching an app idea for your school or community, interview three classmates about a daily problem using open questions ("What is hardest about...?", "How do you currently solve...?").',
        'Low-Data Screen Sketch: Design a 3-step repair booking flow on paper that works both as a simple smartphone screen and as a 3-choice USSD menu (*123#).',
      ],
      crossCurricularLinks: ['Computing: User-Centred Design, Low-Bandwidth Software & Data Privacy (Act 843)', 'Career Technology (TVET): Skilled Trades, Quality Assurance & Safety', 'Mathematics: Percentages, Commission Splits & Addition'],
      discoveryStatus: {
        established: [
          'In software engineering, user-centred design and early customer discovery significantly reduce product failure rates.',
          'In Ghana, the Data Protection Act, 2012 (Act 843) and the Data Protection Commission require organisations that process personal data to safeguard privacy, collect only necessary data, and keep records secure.',
        ],
        underInvestigation: [
          'Computer scientists in West Africa are developing offline-first mobile architectures and voice-assisted interfaces in local languages so artisans and customers can transact reliably regardless of network quality.',
        ],
      },
      investigation: {
        title: 'Paper-Prototype Usability Test',
        Materials: 'Two sheets of paper, a pencil, and a classmate who has not seen your drawing.',
        steps: [
          'On Sheet A, draw a cluttered "Version 1" phone screen with 12 tiny buttons and long paragraphs. On Sheet B, draw a clean "Version 2" screen with 3 clear choices.',
          'Show Sheet A to your partner for 5 seconds and ask them how they would book an electrician. Time how long it takes them to find the right button.',
          'Repeat with Sheet B and compare which design was faster, clearer, and needed less explanation.',
        ],
        explanation:
          'Testing paper prototypes with real users in minutes reveals confusing layouts before a single line of code is written.',
      },
      factCheck:
        'Presents a fictional, realistic 5-year entrepreneurial trajectory (not overnight riches), cites Ghana’s real Data Protection Act, 2012 (Act 843), and verifies all arithmetic (90 + 10 = 100 cedis; 25 full-time staff + 75 certified technicians = 100 jobs).',
    },
    narrationPlan: {
      voice: 'Engaging, contemporary Ghanaian narrator (en-GH); energetic for Kwame, thoughtful and clear for Adwoa and Master Ibrahim.',
      pace: 'Medium (about 125 words per minute).',
      notes: ['Pronounce Kwame ("KWAH-meh"), Adwoa ("ah-JOH-ah"), Akua ("ah-KOO-ah") and Esi ("EH-see") clearly.'],
    },
    music: 'Optional subtle marimba and modern lo-fi synth pulse; off by default.',
    culturalNotes: [
      'Highlights the partnership between digital software entrepreneurship and Ghana’s vital Technical and Vocational Education and Training (TVET) artisans.',
    ],
    reviewQuestions: [
      'Does the story realistically portray the multi-year effort required to build a trusted tech-enabled business and create 100 jobs?',
    ],
  },
];

