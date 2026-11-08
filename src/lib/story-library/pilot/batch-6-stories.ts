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

export const BATCH_6_STORIES: PilotStory[] = [
  // ====================================================================================================================
  // 1. The Dream That Powered a Nation (Primary 6–JHS 2, 12 pages, Akosombo Dam, Hydroelectricity & Historical Trade-Offs)
  // ====================================================================================================================
  {
    key: 'the-dream-that-powered-a-nation',
    set: 'extension',
    title: 'The Dream That Powered a Nation',
    summary:
      'On a fictional school excursion to the Akosombo Dam in the Eastern Region, twelve-year-old Sena and her classmate Kwaku learn how the historic Volta River Project converts falling water into electricity, while also discovering the real human displacement, environmental changes and ethical responsibilities that come with nation-building infrastructure.',
    classification: base({
      classIds: ['primary-6', 'jhs-1', 'jhs-2'],
      ageMin: 11,
      ageMax: 14,
      readingLevel: 'proficient',
      difficulty: 4,
      genres: ['historical', 'science', 'educational'],
      themes: ['technology', 'community', 'citizenship', 'leadership'],
      objectives: ['scientific-curiosity', 'critical-thinking', 'citizenship', 'reading-comprehension', 'reasoning', 'environmental-awareness'],
      ghanaianContext: 'central',
      culturalTags: ['local-names', 'village-life'],
      estimatedDurationSec: 460,
    }),
    palette: ['#0369a1', '#f59e0b'],
    characters: [
      'Sena: a curious twelve-year-old Ghanaian girl in Primary 6, wearing a neat blue-and-white school uniform, yellow safety helmet for the tour, and carrying a science sketchbook.',
      'Kwaku: Sena’s twelve-year-old classmate, wearing a matching blue-and-white school uniform, glasses and a yellow safety helmet.',
      'Engr. Tetteh: a senior hydroelectric engineer at the Volta River Authority (VRA) in Akosombo, wearing a white hard hat, reflective vest and blue shirt.',
      'Grandma Akosua: Sena’s seventy-two-year-old grandmother, wearing a dignified indigo-and-gold cloth and headscarf, whose family was resettled when Lake Volta formed in the 1960s.',
    ],
    pages: [
      {
        text: 'As the school bus climbed the green hills above the Volta Gorge at Akosombo, twelve-year-old Sena pressed her forehead against the window. Below them stretched the vast blue waters of Lake Volta, held back by a massive wall of rock and clay wedged between two steep hills. ‘How can water in a river light up classrooms, hospitals and factories hundreds of kilometres away?’ Sena asked her classmate Kwaku.',
        alt: 'Sena and Kwaku look out a school bus window at the vast Akosombo Dam and Lake Volta framed by green hills.',
        motif: '🚌🌊',
        brief: 'Sunny panoramic view of the Akosombo Gorge in Ghana: Sena (12, blue-and-white uniform) and Kwaku (12, glasses, blue-and-white uniform) looking from a viewing terrace toward the massive rock-fill dam and deep blue reservoir between lush green hills (no text).',
        narration: 'Sense of awe and scale as the children see Akosombo Dam and Lake Volta for the first time.',
      },
      {
        text: 'At the observation platform, VRA engineer Mr Tetteh handed each student a yellow safety helmet. ‘Welcome to the Akosombo Hydroelectric Generating Station,’ he said. ‘Every story you hear on our fictional class tour today is built on real Ghanaian history and physics. After independence in 1957, Ghana’s leaders dreamed of transforming our country from an exporter of raw materials into a modern industrial nation, and that required abundant electrical power.’',
        alt: 'Engineer Tetteh in a white hard hat welcomes Sena, Kwaku and their classmates on the observation platform overlooking the dam.',
        motif: '👷🏿‍♂️⚡',
        brief: 'Observation balcony above Akosombo Dam: Engr. Tetteh (white hard hat, reflective vest) speaking warmly to Sena and Kwaku (wearing yellow safety helmets, holding notebooks) with the reservoir behind them.',
        narration: 'Clear, authoritative explanation distinguishing the fictional tour dialogue from real historical facts.',
      },
      {
        text: 'Mr Tetteh pointed to the giant embankment wall. ‘Between 1961 and 1965, thousands of Ghanaian and international workers built this rock-fill dam with a watertight clay core,’ he explained. ‘It rises 114 metres above the riverbed and stretches 671 metres across the gorge. When it was officially inaugurated in January 1966, the dam held back the White Volta, Black Volta and Oti rivers to form Lake Volta, one of the largest human-made reservoirs by surface area in the world, covering about 8,502 square kilometres.’',
        alt: 'Engineer Tetteh shows the students a cross-section model of the 114-metre-high rock-fill dam and a map of Lake Volta.',
        motif: '🗺️🏔️',
        brief: 'Visitors’ gallery inside the dam facility: Engr. Tetteh pointing to a 3D cutaway architectural model of a rock-and-clay dam wall and a relief map of Lake Volta stretching north across Ghana (no readable letters or numbers).',
        narration: 'Speak the historical dates (1961 to 1965, January 1966) and dimensions (114 metres, 8,502 square kilometres) clearly.',
      },
      {
        text: '‘Now let us trace the physics of hydroelectricity,’ Mr Tetteh said, leading them toward the giant steel intake pipes called penstocks. ‘Because the water in the reservoir sits high above the powerhouse, gravity gives it stored energy called gravitational potential energy. When the intake gates open, water rushes down the steep steel penstocks, converting that stored potential energy into fast-moving kinetic energy.’',
        alt: 'Sena and Kwaku look down at six enormous sloped steel penstock pipes carrying water down the face of the dam to the powerhouse.',
        motif: '管道💧',
        brief: 'Exterior walkway overlooking the six huge parallel silver-white steel penstock pipes descending down the slope into the powerhouse at the base of the dam; Sena sketching in her notebook.',
        narration: 'Emphasise "gravitational potential energy" and "kinetic energy" clearly.',
      },
      {
        text: 'Inside the turbine hall, the floor hummed beneath their shoes. ‘At the bottom of each penstock, the rushing water strikes the curved blades of a giant steel wheel called a turbine,’ Mr Tetteh explained. ‘The water’s kinetic energy spins the turbine shaft, turning fluid motion into mechanical energy. Nothing is burned here: the water flows right through the turbine and continues down the lower Volta River.’',
        alt: 'Inside the bright turbine hall, Engineer Tetteh shows Sena and Kwaku a cut-away model of water spinning curved metal turbine blades.',
        motif: '⚙️🌀',
        brief: 'Clean industrial turbine hall: Engr. Tetteh holding a shiny bronze-and-steel scale model of a Francis water turbine runner with curved blades while Sena and Kwaku inspect how water spins the central shaft.',
        narration: 'Steady, rhythmic delivery matching the hum of the turbines.',
      },
      {
        text: '‘How does a spinning metal shaft become electricity?’ Kwaku asked. Mr Tetteh smiled. ‘Each turbine shaft is connected directly to a generator above it. Inside the generator, giant electromagnets spin inside stationary coils of copper wire. By the law of electromagnetic induction discovered by Michael Faraday, a changing magnetic field inside a wire coil pushes electric charges along the wire, converting mechanical energy into electrical energy!’',
        alt: 'A glowing diagram model shows spinning magnets inside copper coils producing electric current inside a generator.',
        motif: '🧲💡',
        brief: 'Educational exhibit beside the generator floor: a transparent demonstration model showing a central rotor with magnets spinning inside copper wire stator coils, lighting up a row of LED bulbs as Kwaku turns a hand crank.',
        narration: 'Clear step-by-step science explanation of electromagnetic induction.',
      },
      {
        text: 'Sena counted the six huge round generator housings on the powerhouse floor. ‘How much power do they produce together?’ she asked. ‘After modern retrofits, each of the six generating units can produce 170 megawatts of electrical power,’ Mr Tetteh replied. Sena quickly multiplied in her notebook: ‘Six units times 170 megawatts equals 1,020 megawatts!’ Outside, step-up transformers raised the voltage so electricity could travel efficiently along high-voltage national grid lines.',
        alt: 'Sena calculates 6 times 170 megawatts in her notebook while looking across the six circular generator housings in the powerhouse.',
        motif: '🔢⚡',
        brief: 'Wide view of the powerhouse hall with six large circular generator caps in a row; Sena holding up her notebook in the foreground while Kwaku and Engr. Tetteh nod approvingly.',
        narration: 'Read the multiplication (6 times 170 equals 1,020 megawatts) clearly and enthusiastically.',
      },
      {
        text: 'Then Sena asked a deeper question: ‘Mr Tetteh, when Lake Volta filled up behind the dam, what happened to the towns, farms and forests that were already in the valley?’ Mr Tetteh’s expression grew serious and respectful. ‘That is the most important question an engineer or citizen can ask, Sena,’ he said. ‘Every mega-project brings both major benefits and serious human and environmental costs.’',
        alt: 'Sena asks a thoughtful question while Engineer Tetteh pauses seriously beside a historical photograph wall of old river villages.',
        motif: '🤔🏘️',
        brief: 'Quiet exhibition corridor inside the visitors’ centre: framed historical sepia-toned illustrations of traditional riverside compounds and cocoa farms on the wall; Engr. Tetteh listening earnestly to Sena.',
        narration: 'Shift to a thoughtful, empathetic tone.',
      },
      {
        text: '‘As the reservoir rose in the 1960s, it flooded more than 700 villages and displaced about 80,000 people across the Volta Basin,’ Mr Tetteh explained. ‘Families had to leave behind ancestral homes, fertile riverine farmlands and sacred groves to move into 52 government-built resettlement towns. Although resettlement houses were built, many families faced hardship adapting to unfamiliar soils and smaller plots.’',
        alt: 'An exhibit shows families in the 1960s loading canoes and lorries with their belongings to move to new resettlement towns.',
        motif: '🛶📦',
        brief: 'Respectful historical diorama and mural showing Ghanaian families in the 1960s carrying household baskets and bundles toward lorries and new core-houses on higher ground while water rises in the valley below.',
        narration: 'Gentle, dignified tone honouring the sacrifice of the 80,000 resettled citizens.',
      },
      {
        text: '‘The environment changed too,’ Mr Tetteh continued. ‘Above the dam, a thriving lake fishery and ferry route emerged, but submerged forests decayed and calm shallow weeds allowed water snails carrying schistosomiasis, also called bilharzia, to multiply. Downstream in the Lower Volta, stopping the natural seasonal floods changed soil fertility and clam fishing for riverside communities.’',
        alt: 'A split ecological display compares the upper lake fishing boats with downstream river ecosystems affected by altered water flow.',
        motif: '🐟🌿',
        brief: 'Science display showing two connected river habitats: Lake Volta fishing boats and aquatic plants on one side, and downstream riverbanks and clams on the other, examined closely by Kwaku and Sena.',
        narration: 'Balanced, objective scientific tone explaining ecological trade-offs.',
      },
      {
        text: 'That evening at home, Sena showed her sketches to Grandma Akosua, who was a young girl when her family moved to a resettlement town. ‘We gave up the valley our ancestors loved so Ghana could have light,’ Grandma Akosua said softly. ‘And today, because hydropower depends on rainfall, engineers are pairing dams with solar farms so we never rely on just one source, and consulting communities early before building.’',
        alt: 'On the family veranda at dusk, Grandma Akosua looks warmly at Sena’s sketchbook beside a glowing electric lamp and a small solar panel on the roof.',
        motif: '👵🏿☀️',
        brief: 'Warm evening veranda in Ghana: Grandma Akosua (72, indigo-and-gold cloth) sitting beside Sena and looking at her dam sketches under a bright electric bulb, with rooftop solar panels visible on the neighbouring school building.',
        narration: 'Warm, intergenerational connection linking past sacrifice to modern sustainable energy.',
      },
      {
        text: 'Sena wrote a title across the last page of her notebook: What Would You Build, Discover or Change? ‘When my generation builds power plants, bridges and factories,’ she told Kwaku the next morning, ‘we will combine clean engineering, hydro, solar and wind, with fair compensation, environmental protection and listening to every community affected.’ What about you, what clean energy solution or community improvement would you design for Ghana’s future?',
        alt: 'Sena and Kwaku present a model combining a hydroelectric dam, floating solar panels and a protected green riverbank to their class.',
        motif: '🌍🔋',
        brief: 'Bright Primary 6 classroom: Sena and Kwaku standing proudly beside a student cardboard-and-clay model showing a dam paired with solar panels and tree-lined village buffer zones while classmates applaud.',
        narration: 'Inspiring, forward-looking conclusion. Pause slightly before the final question to the listener.',
      },
    ],
    activities: [
      {
        id: 'akosombo-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'In what order is energy converted inside a hydroelectric power station?',
        options: [
          'Potential energy → kinetic water → mechanical turbine → electricity',
          'Chemical energy in coal → heat energy → solar energy → wind energy',
          'Electrical energy → gravity → sunlight → sound energy',
        ],
        correctIndex: 0,
        explanation: 'High stored water has gravitational potential energy, which turns into kinetic energy in the penstocks, spins the turbine (mechanical energy), and generates electricity in the generator.',
      },
      {
        id: 'akosombo-v1',
        type: 'vocabulary',
        afterPage: 6,
        word: 'turbine',
        definition: 'A machine with curved blades that is spun by moving water, steam, or air to produce mechanical power',
        distractors: [
          'A concrete wall built to block a road',
          'A wooden boat used to cross a shallow stream',
        ],
      },
      {
        id: 'akosombo-c2',
        type: 'comprehension',
        afterPage: 7,
        question: 'If each of the 6 generating units at Akosombo produces 170 megawatts (MW), what is their combined capacity?',
        options: [
          '1,020 megawatts (6 × 170 MW)',
          '176 megawatts (170 + 6 MW)',
          '600 megawatts',
        ],
        correctIndex: 0,
        explanation: '6 units × 170 MW per unit = 1,020 MW.',
      },
      {
        id: 'akosombo-c3',
        type: 'comprehension',
        afterPage: 10,
        question: 'Why must engineers and citizens study both the benefits and the trade-offs of large infrastructure projects like dams?',
        options: [
          'Big projects bring electricity but also affect people and ecosystems',
          'Because dams never produce any useful electricity for schools or factories',
          'Because rivers only flow uphill during the dry season',
        ],
        correctIndex: 0,
        explanation: 'Responsible engineering weighs national electricity benefits alongside fair treatment of resettled communities, health protection and downstream ecology.',
      },
      {
        id: 'akosombo-s1',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Place the stages of generating and delivering hydroelectricity in the correct order.',
        items: [
          'Water stored high in the reservoir rushes down steel penstocks.',
          'Moving water spins turbine blades and generator magnets in wire coils.',
          'Transformers step up voltage to send power across the national grid.',
        ],
      },
      {
        id: 'akosombo-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'How did Grandma Akosua’s story help Sena think about fairness when planning big projects?',
        feelingOptions: ['Grateful', 'Thoughtful', 'Responsible', 'Inspired'],
      },
    ],
    glossary: [
      { word: 'penstocks', definition: 'Large enclosed steel pipes that channel rushing water from a reservoir down to the hydroelectric turbines', pages: [4] },
      { word: 'turbine', definition: 'A rotary machine whose curved blades are spun by fast-flowing water, steam or wind', pages: [5, 6] },
      { word: 'generator', definition: 'A machine that converts mechanical rotation into electrical energy using magnets and wire coils', pages: [6, 7] },
      { word: 'megawatts', definition: 'Units of electrical power equal to one million watts, used to measure the output of power stations', pages: [7] },
      { word: 'resettlement', definition: 'The planned movement and rehousing of people whose homes and land are flooded or affected by a major project', pages: [9, 11] },
    ],
    teacherGuide: {
      overview:
        'A Primary 6 to JHS 2 history, physics and civic-engineering story set on a fictional school excursion to the Akosombo Dam. Learners trace energy transformations in hydroelectricity, calculate station output, and examine the real historical benefits, human resettlement (80,000 people across 700+ villages) and ecological impacts of the Volta River Project.',
      lessonMinutes: 45,
      learningGoals: [
        'Trace the four-stage energy conversion in a hydroelectric station: gravitational potential → kinetic → mechanical → electrical energy.',
        'Explain how spinning magnets inside copper coils induce an electric current (Faraday’s electromagnetic induction).',
        'Calculate total power output across multiple generating units (6 × 170 MW = 1,020 MW).',
        'Evaluate both the national industrial benefits and the human/environmental trade-offs (displacement of ~80,000 people, schistosomiasis, downstream flow changes) of the Volta River Project.',
      ],
      subjectLinks: [
        { subject: 'Science (Primary 6 / JHS)', link: 'Sources and conversion of energy; electricity, magnetism and renewable energy mix.', status: 'to-verify' },
        { subject: 'Social Studies / History', link: 'Post-independence national development, the Volta River Project (1961–1966), and environmental impact assessment.', status: 'to-verify' },
        { subject: 'Mathematics', link: 'Multiplication of multi-digit numbers and rate/power calculations.', status: 'to-verify' },
      ],
      beforeReading: [
        'Locate the Volta River, Lake Volta and Akosombo on a map of Ghana and ask learners where the electricity in their community comes from.',
        'Clarify that while Sena, Kwaku and Grandma Akosua are fictional characters, the dates, dimensions and historical facts about the Akosombo Dam are real.',
      ],
      whileReading: [
        'Pause at page 4 and page 6 to have learners draw arrows showing how potential energy becomes kinetic, mechanical and electrical energy.',
        'Pause at page 9 to discuss what families lose when ancestral farmlands and villages are flooded, even when new houses are built.',
      ],
      afterReading: [
        'Divide the class into four stakeholder groups (industrial planners, resettled farmers, public-health officers, downstream clam fishers) to propose how a modern project should protect everyone affected.',
      ],
      discussion: [
        'Why did Ghana’s post-independence leaders view abundant electricity as essential for industrialisation?',
        'Why is hydroelectricity considered a renewable energy source, and why does Ghana today combine hydropower with solar and thermal power?',
        'How does remembering the sacrifice of the 80,000 resettled citizens change the way we think about using electricity responsibly?',
      ],
      reflection: [
        'What Would You Build, Discover or Change? If you were designing a clean energy project for your district today, how would you generate power while protecting local families and nature?',
      ],
      mathsExtension: [
        {
          task: 'Akosombo has 6 generating units rated at 170 MW each. If 5 units are running at full capacity and 1 unit is shut down for scheduled maintenance, how many megawatts are being generated?',
          answer: '5 × 170 MW = 850 MW.',
        },
        {
          task: 'Construction of the Akosombo Dam began in 1961 and the dam was inaugurated in 1966. How many years passed between the start of construction and the inauguration?',
          answer: '1966 − 1961 = 5 years.',
        },
      ],
      differentiation: {
        support: ['Use the waterwheel investigation and focus on the three words: penstock (pipe), turbine (wheel) and generator (magnet + wire).'],
        stretch: ['Research how the Kpong Dam and Bui Dam complement Akosombo, including how Bui added floating and land-based solar panels to form a hydro-solar hybrid plant.'],
      },
      culturalNotes: [
        'Sena (Ewe), Tetteh (Ga-Dangme), and Kwaku / Akosua (Akan) reflect the diverse Ghanaian communities living around and served by the Volta Basin.',
        'Communities in the Volta Basin hold deep cultural and historical ties to ancestral lands, rivers and sacred groves, making the 1960s resettlement a profound historical sacrifice.',
      ],
      localiseThis: [
        'Connect to your region’s electricity supply (NEDCo or ECG) and any nearby solar mini-grids, dams or substations.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'The Akosombo Dam was constructed between 1961 and 1965 and officially inaugurated in January 1966, creating Lake Volta (~8,502 km² surface area).',
          'Hydroelectric stations convert gravitational potential energy of elevated water into kinetic energy, mechanical turbine rotation, and electrical energy via electromagnetic induction.',
          'Formation of Lake Volta required resettling approximately 80,000 people from over 700 villages into 52 resettlement towns and altered aquatic and downstream ecosystems.',
        ],
        whatWeAreStillDiscovering: [
          'Energy engineers are researching how floating solar photovoltaics (floatovoltaics) on reservoirs can generate extra power while reducing water evaporation during hot dry seasons.',
          'Ecologists and hydrologists continue studying how environmental flow releases from dams can best restore downstream river habitats and livelihoods.',
        ],
      },
      investigation: {
        title: 'Build a Simple Classroom Waterwheel Turbine',
        materials: [
          'A clean plastic bottle cap or small cardboard disc coated in tape',
          '6 small pieces of stiff plastic cut from a yoghurt cup (for blades)',
          'A wooden skewer or pencil (as the shaft)',
          'A plastic jug of water and a bucket to catch the water',
        ],
        steps: [
          'Slot or tape the 6 small plastic blades evenly around the rim of the bottle cap to form a miniature turbine wheel, and push the wooden skewer through the centre.',
          'Hold the skewer loosely with two fingers over an empty bucket and pour water steadily from the jug onto the side blades from 10 cm above.',
          'Now pour the water from 30 cm above the wheel and compare how fast the wheel spins.',
        ],
        whatToNotice:
          'Pouring water from a greater height gives the water more gravitational potential energy, which turns into faster kinetic motion and spins the turbine wheel faster, just like the high water level above the Akosombo penstocks!',
        safetyNote: 'Use blunt scissors under adult supervision and perform the pouring test over a bucket or outdoors so the floor stays dry.',
      },
      factCheck: [
        {
          claim: 'Akosombo Dam was built between 1961 and 1965 (inaugurated January 1966), stands 114 m above the riverbed, and has an installed capacity of 1,020 MW across 6 units.',
          explanation: 'Constructed by Impregilo under the Volta River Authority (established 1961), the rock-fill embankment dam is 114 m high and 671 m long; following the 1999–2006 retrofit, its 6 units are rated at 170 MW each (1,020 MW total).',
          reference: 'Volta River Authority (VRA) Official Technical Profile of the Akosombo Generating Station.',
        },
        {
          claim: 'Creating Lake Volta displaced approximately 80,000 people from more than 700 villages into 52 resettlement towns.',
          explanation: 'The VRA resettlement programme relocated roughly 80,000 residents from over 700 villages flooded by the 8,502 km² reservoir.',
          reference: 'Chambers, R. (ed.) The Volta Resettlement Experience; Volta River Authority Historical Archives.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Clear, engaging Ghanaian English narrator; knowledgeable and respectful tone for Engr. Tetteh and warm wisdom for Grandma Akosua.',
      pace: 'Measured JHS pace (~130 words per minute), pausing clearly on energy-conversion stages and numbers.',
      notes: ['Pronounce Akosombo as ah-koh-SOM-boh and Sena as SEH-nah.', 'Keep historical facts distinct from the fictional school tour dialogue.'],
    },
    music: 'Optional gentle piano underscore.',
    culturalNotes: [
      'Honours both the engineering achievement of the Volta River Project and the real lived experiences of the 80,000 Ghanaians resettled from the Volta Basin.',
    ],
    reviewQuestions: [
      'Are the four energy-conversion stages clear for Primary 6 and JHS learners?',
      'Does the story present both the industrial benefits and the human/environmental costs of the dam fairly?',
    ],
  },

  // ====================================================================================================================
  // 2. The Girl Who Taught a Drone to See (JHS 1–3, 12 pages, AI, Computer Vision, Training Bias, Privacy & AgTech)
  // ====================================================================================================================
  {
    key: 'the-girl-who-taught-a-drone-to-see',
    set: 'extension',
    title: 'The Girl Who Taught a Drone to See',
    summary:
      'Fourteen-year-old Mansa and her school coding club build an artificial-intelligence camera system to help maize farmers spot crop disease early, only to see their first model fail in real Ghanaian farm conditions until they learn about training-data bias, farmer privacy, field testing and human agricultural expertise.',
    classification: base({
      classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
      ageMin: 12,
      ageMax: 15,
      readingLevel: 'proficient',
      difficulty: 5,
      genres: ['realistic-fiction', 'science', 'educational'],
      themes: ['technology', 'farm-and-garden', 'money-and-enterprise', 'community'],
      objectives: ['scientific-curiosity', 'problem-solving', 'critical-thinking', 'perseverance', 'teamwork', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 460,
    }),
    palette: ['#047857', '#0284c7'],
    characters: [
      'Mansa: a fourteen-year-old Ghanaian girl in JHS 2 in Techiman, wearing a green-and-cream school uniform, braided hair with green beads, and carrying a tablet computer.',
      'Tariq: Mansa’s fourteen-year-old classmate and drone pilot in the school STEM club, wearing a green-and-cream uniform and spectacles.',
      'Madam Amina: an experienced District Agricultural Extension Officer in her thirties, wearing a khaki field jacket, wide-brimmed sun hat and carrying a hand lens.',
      'Uncle Kwabena: a hard-working smallholder maize farmer near Techiman in his fifties, wearing a straw hat and blue work shirt.',
    ],
    pages: [
      {
        text: 'On Saturdays near Techiman in the Bono East Region, fourteen-year-old Mansa walked with her Uncle Kwabena through his five-hectare maize farm. By the time Uncle Kwabena noticed yellow streaks and chewed leaves in the middle rows, pests and plant disease had already damaged a third of that section. ‘A farmer cannot inspect ten thousand maize plants leaf by leaf every single morning,’ Uncle Kwabena sighed.',
        alt: 'Fourteen-year-old Mansa and Uncle Kwabena inspect yellowing maize leaves in a large green maize field near Techiman.',
        motif: '🌽🔍',
        brief: 'Sunlit Ghanaian maize farm in Bono East: Mansa (14, green-and-cream uniform, braided hair with green beads) and Uncle Kwabena (straw hat, blue work shirt) examining a maize leaf with yellow streaks among tall green maize rows.',
        narration: 'Empathetic, observant opening establishing the real agricultural problem.',
      },
      {
        text: 'At Monday’s JHS coding and robotics club, Mansa shared an idea with her teammate Tariq. ‘What if we attach a small camera to the club’s quadcopter drone and train an artificial intelligence, an AI computer vision programme, to spot sick maize leaves from the air?’ Tariq’s eyes lit up. ‘Instead of following fixed rules written by hand, a machine-learning model learns patterns from hundreds of example images called training data!’',
        alt: 'In a JHS computer lab, Mansa and Tariq examine a small camera drone and a laptop screen showing healthy and diseased leaf photos.',
        motif: '🚁💻',
        brief: 'Bright Ghanaian JHS STEM lab: Mansa and Tariq (14, spectacles, green-and-cream uniform) gathered around a workbench with a small four-rotor camera drone and a laptop displaying a grid of green and yellow leaf icons (no text).',
        narration: 'Enthusiastic and clear introduction to machine learning and training data.',
      },
      {
        text: 'Eager to move fast, Mansa and Tariq downloaded 500 photographs of maize leaves from an online agricultural website, 250 labelled Healthy and 250 labelled Diseased. Every photo had been taken indoors against a plain white background under bright studio lamps. When they tested their model on 100 similar studio photos, it scored 90 correct out of 100, a 90 percent accuracy rate! They thought their invention was ready.',
        alt: 'Mansa and Tariq celebrate in the computer lab as their laptop screen shows a green progress bar for studio leaf photos.',
        motif: '📸✅',
        brief: 'Computer lab scene: Mansa and Tariq high-fiving beside a laptop showing neat, studio-lit single leaf pictures on white backgrounds and a green check mark icon (no words or numbers).',
        narration: 'Show their excitement, setting up the scientific lesson when studio data meets the real world.',
      },
      {
        text: 'On Saturday morning, District Agricultural Extension Officer Madam Amina joined them at Uncle Kwabena’s farm for their first real field trial. The sky was overcast, red Harmattan dust coated the lower maize leaves, and morning dew cast dark shadows across the rows. Tariq flew the small drone along 20 marked farm plots while Mansa’s tablet analysed the camera images.',
        alt: 'Under a cloudy morning sky at the maize farm, Tariq pilots the small drone over dusty maize rows while Madam Amina, Uncle Kwabena and Mansa watch.',
        motif: '☁️🚁',
        brief: 'Cloudy morning at the maize farm: Tariq holding a drone controller as a small quadcopter hovers safely over maize rows; Mansa holding a tablet while Madam Amina (khaki field jacket, sun hat, hand lens) and Uncle Kwabena observe.',
        narration: 'Build anticipation during the field test.',
      },
      {
        text: 'The field results were a shock! Out of 20 farm plots, the AI got only 9 right and misclassified 11, an accuracy of just 45 percent! Worse still, the app sounded a red alarm on 8 completely healthy plots coated in harmless red laterite dust, calling them severely diseased, while missing 3 shaded plots that actually had early leaf blight. ‘Why did a 90-percent model fail on a real farm?’ Mansa asked in dismay.',
        alt: 'Mansa looks dismayed at her tablet screen while Madam Amina uses a magnifying hand lens to show that a dusty maize leaf is actually healthy.',
        motif: '⚠️🌿',
        brief: 'Close view in the maize field: Madam Amina holding a magnifying lens over a healthy green maize leaf dusted with reddish-brown soil, while Mansa looks puzzled at warning icons on her tablet screen.',
        narration: 'Expressive surprise, clearly stating the numbers: 9 right and 11 wrong out of 20 plots (45 percent).',
      },
      {
        text: 'Madam Amina knelt beside a maize plant and wiped the red dust from a leaf. ‘Your model suffered from training-data bias,’ she explained kindly. ‘Because it only saw studio photos on white paper, it never learned what Ghanaian maize looks like in cloudy light, wind, weeds or red soil. It mistook red dust for leaf disease, a false positive, and missed real disease hiding in shadows, a false negative!’',
        alt: 'Madam Amina wipes red soil dust off a healthy green maize leaf to show Mansa and Tariq why the camera was confused.',
        motif: '🧑🏾‍🌾🔎',
        brief: 'Madam Amina demonstrating a half-wiped maize leaf (bright green on one half, dusty reddish-brown on the other) to Mansa and Tariq, who are taking notes in their field books.',
        narration: 'Warm, clear explanation of training-data bias, false positives and false negatives.',
      },
      {
        text: 'Before they took a single new photograph, Madam Amina taught them another essential rule of responsible technology: privacy and informed consent. ‘A drone camera flies high enough to see neighbouring compounds, workers and farm boundaries,’ she said. ‘Never fly over people’s homes, never record faces or private property without permission, and always explain to farmers how their farm data will be stored and used.’',
        alt: 'Madam Amina, Mansa and Tariq review a farm map with Uncle Kwabena and neighbouring farmers to agree on flight boundaries and consent.',
        motif: '🤝🗺️',
        brief: 'Under a shade tree at the farm edge: Mansa and Tariq showing a simple boundary map to Uncle Kwabena and two neighbouring farmers (a woman in wax-print cloth and a man in work clothes), everyone nodding in agreement.',
        narration: 'Serious, respectful emphasis on privacy, ethics and farmer consent.',
      },
      {
        text: 'Over the next six months, Mansa, Tariq and their club worked the scientific way. With written permission from twelve local farmers, they walked the fields alongside Madam Amina. For every photograph, Madam Amina inspected the real plant with her hand lens so the label was scientifically verified. Together they built a balanced Ghanaian dataset of 2,000 leaf images across sunny, cloudy, dusty and rainy conditions.',
        alt: 'Mansa photographs maize leaves with a camera while Madam Amina inspects the leaves with a hand lens to verify each label.',
        motif: '📷🌾',
        brief: 'Fieldwork montage scene: Mansa crouching to photograph a maize leaf in natural farm light while Madam Amina examines the leaf stem with her hand lens and Tariq records the plot condition on a clipboard.',
        narration: 'Show the patience, teamwork and scientific rigour required to build good training data.',
      },
      {
        text: 'Before testing the new model, Mansa split their 2,000 verified images carefully: 1,800 images were used as training data to teach the model, while 200 completely unseen images from different farm plots were locked away as a separate test set. ‘If you test an AI on the exact same pictures it studied,’ Tariq noted, ‘that is like giving a student the exam questions before the test!’',
        alt: 'In the school lab, Mansa and Tariq separate their dataset on screen into a large training group and a locked test group.',
        motif: '📊🔒',
        brief: 'School computer lab: Mansa pointing at a visual diagram on a monitor showing a large basket of leaf icons feeding into a brain-gear icon, and a separate locked box of leaf icons reserved for testing (no text).',
        narration: 'Use Tariq’s exam analogy to make training vs test sets crystal clear.',
      },
      {
        text: 'When they ran the retrained model on the 200 unseen Ghanaian field images, it classified 180 correctly, a true field accuracy of 90 percent! Even more importantly, Mansa redesigned the app so it never claimed to be infallible. Instead of telling farmers to spray chemicals immediately, the app created a map of flagged rows for the farmer and an agricultural extension officer to inspect in person.',
        alt: 'Uncle Kwabena and Madam Amina use Mansa’s tablet map to walk directly to a flagged row of maize plants for a close human check.',
        motif: '📱🌽',
        brief: 'Sunny maize field: Uncle Kwabena, Madam Amina and Mansa looking at a simple colour-coded grid map of farm rows on the tablet, walking directly to a specific maize plant for human inspection.',
        narration: 'Highlight the 180 out of 200 math (90 percent) and the human-in-the-loop design.',
      },
      {
        text: 'By the following harvest, Uncle Kwabena and his neighbours spotted early armyworm and leaf blight weeks sooner, saving crops and reducing unnecessary pesticide spraying. When Mansa’s team won the regional young innovators’ prize, she credited the farmers and Madam Amina. ‘AI is a powerful tool,’ Mansa said, ‘but it works only when paired with honest data, ethical rules and human wisdom.’',
        alt: 'At a regional science fair, Mansa and Tariq share the stage with Uncle Kwabena and Madam Amina beside their agricultural drone.',
        motif: '🏆🤝',
        brief: 'Regional STEM exhibition hall in Ghana: Mansa and Tariq holding a certificate beside their camera drone, gesturing gratefully to Uncle Kwabena and Madam Amina standing beside a basket of healthy golden maize cobs.',
        narration: 'Warm, humble pride celebrating collaboration between young technologists, farmers and experts.',
      },
      {
        text: 'Back in the coding club, Mansa wrote on the whiteboard: What Would You Build, Discover or Change? ‘One day we want to grow this into an African agritech company serving farmers across the continent,’ she told her teammates, ‘starting with careful experiments right here at home.’ What problem in your school, farm or town could technology and human teamwork help solve together?',
        alt: 'Mansa, Tariq and younger JHS students sketch new technology ideas on a whiteboard in their school STEM lab.',
        motif: '🌍🚀',
        brief: 'Sunlit STEM club room: Mansa and Tariq mentoring younger JHS students around a table with a drone, soil sensors and notebooks full of sketches (no readable text).',
        narration: 'Inspiring closing question inviting learners to imagine responsible innovations.',
      },
    ],
    activities: [
      {
        id: 'drone-c1',
        type: 'comprehension',
        afterPage: 6,
        question: 'Why did Mansa’s first AI model drop from 90% accuracy in the studio to 45% (9 out of 20) on Uncle Kwabena’s farm?',
        options: [
          'It trained only on studio photos, so red dust and shadows confused it',
          'The drone flew too high into outer space',
          'Maize plants change into cocoa trees on Saturdays',
        ],
        correctIndex: 0,
        explanation: 'Training-data bias occurred because the studio dataset did not represent real Ghanaian field conditions like red laterite dust, clouds and shadows.',
      },
      {
        id: 'drone-v1',
        type: 'vocabulary',
        afterPage: 6,
        word: 'bias',
        definition: 'A systematic error in a computer model caused by training data that does not fairly represent real-world conditions',
        distractors: [
          'The battery cable that connects a drone to a charger',
          'A type of fertiliser used on maize farms',
        ],
      },
      {
        id: 'drone-c2',
        type: 'comprehension',
        afterPage: 9,
        question: 'Why did Mansa keep 200 verified field images separate from the 1,800 training images?',
        options: [
          'To test honestly how well the AI performs on new, unseen farm images',
          'Because the laptop screen could only hold 1,800 pictures',
          'To delete all healthy maize plants from the farm',
        ],
        correctIndex: 0,
        explanation: 'Evaluating a model requires an independent test set of unseen examples; when it got 180 of 200 right, that proved 90% real-world accuracy.',
      },
      {
        id: 'drone-c3',
        type: 'comprehension',
        afterPage: 10,
        question: 'Why did Mansa design the app to flag suspicious rows for human inspection instead of ordering automatic chemical spraying?',
        options: [
          'AI can make mistakes, so farmers and experts must verify before acting',
          'Because drones are afraid of maize leaves',
          'Because farmers never need to look at their crops',
        ],
        correctIndex: 0,
        explanation: 'Human oversight ("human-in-the-loop") prevents false alarms from wasting money or spraying unnecessary pesticides.',
      },
      {
        id: 'drone-s1',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Order the steps of building a responsible agricultural AI system.',
        items: [
          'Obtain informed consent from farmers and respect privacy boundaries.',
          'Collect diverse real-world field data verified by agricultural experts.',
          'Test the model on unseen field images and keep human experts in the loop.',
        ],
      },
      {
        id: 'drone-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'How did Mansa and Tariq turn an embarrassing 45% field failure into a stronger invention?',
        feelingOptions: ['Curious', 'Humble', 'Persistent', 'Ethical'],
      },
    ],
    glossary: [
      { word: 'artificial', definition: 'Made by humans rather than occurring naturally; artificial intelligence is software that performs tasks requiring pattern recognition or learning', pages: [2] },
      { word: 'bias', definition: 'A distortion or unfair skew in data or results when training examples leave out real-world conditions', pages: [6] },
      { word: 'consent', definition: 'Permission given freely after a person has been clearly informed about what will happen and how their data will be used', pages: [7] },
      { word: 'dataset', definition: 'A structured collection of data, such as labelled photographs, used to train and test a computer model', pages: [8] },
    ],
    teacherGuide: {
      overview:
        'A JHS 1–3 artificial intelligence, computer vision and agricultural entrepreneurship story set in Techiman. Learners discover how machine-learning models learn from training data, why unrepresentative studio datasets fail in real Ghanaian farm conditions, why separate test sets and farmer privacy/consent matter, and why AI must support, never replace, human experts.',
      lessonMinutes: 45,
      learningGoals: [
        'Explain how a supervised machine-learning model learns patterns from labelled training data and is evaluated on unseen test data.',
        'Distinguish between a false positive (flagging a healthy dusty leaf as diseased) and a false negative (missing a truly diseased leaf in shadow).',
        'Calculate model accuracy rates from test counts (9/20 = 45% vs 180/200 = 90%).',
        'Explain why data privacy, informed consent and human-in-the-loop oversight are essential in AI engineering.',
      ],
      subjectLinks: [
        { subject: 'Computing / ICT (JHS)', link: 'Introduction to Artificial Intelligence, data collection, bias, privacy and ethical technology.', status: 'to-verify' },
        { subject: 'Science / Career Technology', link: 'Crop health, pests, agricultural extension and engineering design.', status: 'to-verify' },
        { subject: 'Mathematics', link: 'Fractions, ratios and percentages in evaluating test results.', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners: "How do you recognise the difference between a ripe mango and an unripe mango? How would you teach a computer that has never seen a mango to tell the difference?"',
      ],
      whileReading: [
        'Pause at page 5 and calculate the percentage: 9 correct out of 20 plots = (9 ÷ 20) × 100 = 45%.',
        'Pause at page 7 to discuss why flying a camera over farms requires clear privacy rules and neighbour consent.',
      ],
      afterReading: [
        'Run the classroom "Paper-Leaf Classifier" game so students experience how a limited training set leads to misclassification.',
      ],
      discussion: [
        'Why did a model with 90% accuracy on studio photos fail on Uncle Kwabena’s farm?',
        'What would happen if a farmer sprayed expensive pesticide every time an unverified AI app gave a false positive?',
        'Why did Tariq say testing a model on its own training images is like giving a student the exam questions before the test?',
      ],
      reflection: [
        'What Would You Build, Discover or Change? What real problem in your community could a sensor, app or tool help solve, and which human experts would you partner with?',
      ],
      mathsExtension: [
        {
          task: 'In the first field trial, Mansa’s model tested 20 plots and got 9 right. What percentage was correct, and what percentage was misclassified?',
          answer: 'Correct: (9 ÷ 20) × 100 = 45%. Misclassified: (11 ÷ 20) × 100 = 55%.',
        },
        {
          task: 'In the second trial, the retrained model was tested on 200 unseen field images and classified 180 correctly. What was its accuracy percentage, and how many images did it still misclassify?',
          answer: 'Accuracy: (180 ÷ 200) × 100 = 90%. Misclassified: 200 − 180 = 20 images (10%), showing why human verification is still needed.',
        },
      ],
      differentiation: {
        support: ['Focus on the everyday meaning of "training examples", "false alarm (false positive)" and "missed problem (false negative)".'],
        stretch: ['Design a simple confusion matrix (2×2 table of Actual Healthy / Actual Diseased vs Predicted Healthy / Predicted Diseased) using the 20 plots from Page 5 (9 correct, 8 false positives, 3 false negatives).'],
      },
      culturalNotes: [
        'Techiman in the Bono East Region is one of West Africa’s major agricultural market hubs, bringing together farmers and traders from across Ghana.',
      ],
      localiseThis: [
        'Substitute the main crop grown around your school (e.g., cassava mosaic disease, cocoa black pod, millet, or tomato blight).',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Supervised image-classification models learn statistical patterns from labelled training images and often fail ("domain shift" or dataset bias) when deployed in lighting, soil or weather conditions absent from their training set.',
          'Separating training data from an independent hold-out test set is required to measure how well a model generalises to unseen data.',
          'Agricultural AI tools work best as decision-support systems paired with human agronomists and farmers rather than autonomous chemical-spraying triggers.',
        ],
        whatWeAreStillDiscovering: [
          'Computer-vision researchers in Ghana and across Africa are developing lightweight edge-AI models that can run offline on low-cost smartphones without needing mobile internet in remote farms.',
        ],
      },
      investigation: {
        title: 'Spot Training-Data Bias with a Classroom Sorting Game',
        materials: [
          '10 index cards or slips of paper with drawings of leaves',
          'Coloured pencils (green, yellow and brown)',
        ],
        steps: [
          'Have Group A create 6 "Training Cards": draw 3 healthy green round leaves and 3 diseased yellow pointed leaves. Show ONLY these 6 cards to Group B and ask Group B to write down the rule for spotting a diseased leaf.',
          'Now hand Group B 4 "Real Farm Test Cards" that include a healthy pointed green leaf with a tiny brown soil speck and a round leaf with yellow disease spots.',
          'Check whether Group B’s rule misclassified the pointed healthy leaf or the round diseased leaf, and discuss how adding more varied training cards fixes the rule.',
        ],
        whatToNotice:
          'When the training cards only showed one leaf shape or lacked soil specks, the rule learned the wrong shortcut, just like Mansa’s first AI model!',
        safetyNote: 'Standard classroom paper activity; no special hazards.',
      },
      factCheck: [
        {
          claim: 'Machine-learning image classifiers trained on laboratory leaf images (such as PlantVillage studio photos) often drop sharply in accuracy when tested on real field images unless retrained on diverse field data.',
          explanation: 'Peer-reviewed agricultural computer-vision studies show models achieving >90% accuracy on uniform-background lab datasets frequently drop below 50% on real field photos due to background clutter, illumination variance and dust.',
          reference: 'Mohanty et al. (2016), Frontiers in Plant Science; Ferentinos (2018), Computers and Electronics in Agriculture.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Bright, curious Ghanaian English storyteller; warm and practical tone for Madam Amina and Uncle Kwabena.',
      pace: 'Clear JHS pace (~130 words per minute), pausing on the accuracy numbers so learners follow the math.',
      notes: ['Pronounce Mansa as MAHN-sah and Techiman as teh-CHEE-mahn.'],
    },
    music: 'Optional gentle piano underscore.',
    culturalNotes: [
      'Shows young Ghanaian girls leading in AI and robotics while respecting the deep practical wisdom of smallholder farmers and agricultural extension officers.',
    ],
    reviewQuestions: [
      'Are the concepts of training data, test sets, false positives and false negatives explained clearly?',
      'Does the story reinforce farmer privacy and human oversight?',
    ],
  },

  // ====================================================================================================================
  // 3. The Cocoa Bean That Travelled the World (Primary 4–6, 10 pages, Cocoa Value Chain, Processing & Value Addition)
  // ====================================================================================================================
  {
    key: 'the-cocoa-bean-that-travelled-the-world',
    set: 'extension',
    title: 'The Cocoa Bean That Travelled the World',
    summary:
      'Ten-year-old Adwoa follows cocoa pods from her family’s shaded farm in the Western North Region to a Ghanaian cocoa-processing and chocolate factory in Tema, discovering how fermentation, quality grading, roasting, manufacturing, packaging and branding add value along the global supply chain.',
    classification: base({
      classIds: ['primary-4', 'primary-5', 'primary-6'],
      ageMin: 9,
      ageMax: 12,
      readingLevel: 'fluent',
      difficulty: 3,
      genres: ['realistic-fiction', 'educational'],
      themes: ['farm-and-garden', 'money-and-enterprise', 'food', 'careers'],
      objectives: ['financial-literacy', 'critical-thinking', 'environmental-awareness', 'reading-comprehension', 'vocabulary', 'reasoning'],
      ghanaianContext: 'central',
      culturalTags: ['local-food', 'local-names'],
      estimatedDurationSec: 380,
    }),
    palette: ['#78350f', '#f59e0b'],
    characters: [
      'Adwoa: an inquisitive ten-year-old Ghanaian girl in Primary 5, wearing a neat yellow-and-brown school pinafore on school days and a bright orange dress on weekends, carrying a notebook.',
      'Papa Kofi: Adwoa’s father, a skilled cocoa farmer in Sefwi Wiawso in his forties, wearing rubber boots and a blue work shirt.',
      'Mama Efua: Adwoa’s mother, a treasurer of the local cocoa farmers’ cooperative, wearing a patterned green-and-gold cloth.',
      'Auntiebaaba / Auntie Baaba: a food scientist and chocolate maker at a Ghanaian chocolate factory in Tema, wearing a white lab coat and hairnet.',
    ],
    pages: [
      {
        text: 'Under the cool canopy of tall forest shade trees near Sefwi Wiawso, ten-year-old Adwoa walked with her parents after Saturday breakfast. Golden-yellow cocoa pods grew directly out of the trunks and thick branches of the cocoa trees, a botanical wonder called cauliflory. ‘Papa,’ Adwoa asked, ‘how does a wet white seed inside this pod become a smooth brown bar of chocolate in shops around the world?’',
        alt: 'Ten-year-old Adwoa walks with Papa Kofi and Mama Efua beneath tall shade trees where golden cocoa pods grow on the tree trunks.',
        motif: '🌳🍫',
        brief: 'Lush shaded Ghanaian cocoa farm in Western North: Adwoa (10, orange dress, notebook) looking up at golden-yellow ripe cocoa pods growing directly on the trunk of a cocoa tree while Papa Kofi (blue shirt, rubber boots) and Mama Efua (green-and-gold cloth) smile.',
        narration: 'Warm, sensory opening beneath the cocoa shade trees.',
      },
      {
        text: 'Papa Kofi pointed to the tall terminalia and plantain trees shading the cocoa grove. ‘Great chocolate starts with sustainable farming,’ he said. ‘Shade trees protect the soil, hold moisture and give birds a home. And on a responsible Ghanaian cocoa farm, children go to school and never use sharp cutlasses, spray chemicals or carry heavy loads. Grown-up workers harvest the ripe pods carefully so the tree bark cushions can flower again next season.’',
        alt: 'Adult farm workers carefully harvest golden cocoa pods while Adwoa sketches the shade trees and birds from a safe path.',
        motif: '🦜🌱',
        brief: 'Sustainable agroforestry cocoa farm: adult workers in protective boots harvesting yellow cocoa pods in the background while Adwoa stands safely on the footpath sketching a bird perched in a tall shade tree.',
        narration: 'Clear emphasis on sustainable shade-tree farming and child-safe labour standards.',
      },
      {
        text: 'At the farm fermentation spot, adult workers split the thick yellow pods with wooden mallets and scooped out the sweet, white, mucilage-covered cocoa beans. ‘Wait, they are white and taste fruity like soursop, not like chocolate at all!’ Adwoa exclaimed. Mama Efua laughed. ‘Raw cocoa beans have no chocolate flavour yet. We heap them on clean plantain leaves and cover them for six days of fermentation.’',
        alt: 'Adult workers heap white cocoa beans onto broad green plantain leaves while Adwoa observes the white pulp.',
        motif: '🍃⚪',
        brief: 'Clean farm courtyard: white cocoa beans scooped from yellow pods onto fresh green plantain leaves; Mama Efua explaining the process to Adwoa.',
        narration: 'Lively surprise on "white and taste fruity", then clear explanation of fermentation.',
      },
      {
        text: '‘During those six days,’ Mama Efua explained, ‘natural microscopic yeasts and bacteria feed on the sugary white pulp, warming the heap to nearly fifty degrees Celsius. Chemical reactions inside the bean reduce bitterness and create the rich flavour precursors of chocolate!’ Next, the brown fermented beans were spread on raised raffia mats in the sun and turned by hand for seven to ten days until their moisture dropped below eight percent.',
        alt: 'Adwoa watches her parents turn rich brown cocoa beans drying on raised bamboo and raffia mats in the sunshine.',
        motif: '☀️🤎',
        brief: 'Sunny village drying yard: raised waist-high raffia mats covered with rich brown cocoa beans; Papa Kofi and Mama Efua turning the beans with clean wooden rakes while Adwoa watches.',
        narration: 'Explain the science of fermentation and sun-drying clearly.',
      },
      {
        text: 'At the cooperative society shed, a licensed Quality Control officer cut open sample beans to check that they were thoroughly fermented, dry and free of mould or slate defects before sealing the jute sacks. ‘Ghanaian cocoa is famous worldwide for high quality,’ Papa Kofi said proudly. ‘Yet for decades, most of our beans were shipped overseas raw, while factories in other countries turned them into expensive chocolates.’',
        alt: 'In a tidy cocoa buying shed, a quality control officer inspects cut cocoa beans on a tray beside stacked jute sacks.',
        motif: '🔍📦',
        brief: 'Clean cooperative depot: a Quality Control officer in a khaki uniform inspecting cut brown cocoa beans on a slotted board beside neatly stacked brown jute sacks (no text markings) while Papa Kofi and Adwoa watch.',
        narration: 'Proud tone on Ghanaian quality, followed by the thoughtful question about raw exports.',
      },
      {
        text: 'During the school holidays, Adwoa’s cooperative visited a Ghanaian cocoa-processing and chocolate factory in Tema, where Auntie Baaba, a food scientist, welcomed them in a white coat and hairnet. ‘Here in Ghana, we add value to our own beans!’ Auntie Baaba said. First, giant machines cleaned and roasted the beans to deepen their aroma, then cracked and winnowed away the thin shells to leave crunchy roasted pieces called cocoa nibs.',
        alt: 'Inside a spotless Ghanaian chocolate factory in Tema, Auntie Baaba in a white lab coat shows Adwoa roasted cocoa beans and cocoa nibs.',
        motif: '🏭🔬',
        brief: 'Spotless modern food-processing facility in Tema: Auntie Baaba (white lab coat, hairnet) holding glass jars of whole roasted cocoa beans and crushed cocoa nibs for Adwoa (also wearing a visitor hairnet and coat).',
        narration: 'Energetic, proud tour of a modern Ghanaian factory.',
      },
      {
        text: 'Next, heavy rollers ground the warm cocoa nibs into a thick dark liquid called cocoa liquor, which contains zero alcohol, only natural cocoa solids and cocoa butter! Huge hydraulic presses squeezed part of the cocoa liquor into golden cocoa butter for chocolates and skin creams, and fine cocoa powder for drinks. In the chocolate hall, cocoa liquor, extra cocoa butter, sugar and milk were mixed, refined and stirred for hours in a warm machine called a conche.',
        alt: 'Adwoa looks through a glass window at stainless-steel conching machines stirring smooth, glossy liquid chocolate.',
        motif: '⚙️🍫',
        brief: 'Bright factory viewing corridor: through a large glass window, stainless-steel conching vats stir glossy dark-brown liquid chocolate while Auntie Baaba explains the stages to Adwoa and Mama Efua.',
        narration: 'Rich, descriptive storytelling making the food science of cocoa butter, powder and conching easy to picture.',
      },
      {
        text: '‘Why does a finished box of chocolates sell for much more than the raw beans inside it?’ Adwoa asked, opening her notebook. Auntie Baaba drew an illustrative classroom chart on the whiteboard. ‘Suppose, in a simple training example, a workshop buys 10 kilograms of dried cocoa beans for 300 cedis. After roasting, grinding, adding sugar, milk and foil wrappers, paying factory workers and electricity, and chilling the bars, the workshop produces 100 bars that sell for 12 cedis each, 1,200 cedis in total retail sales.’',
        alt: 'Auntie Baaba explains a visual value-chain chart showing raw beans, factory processing, packaging, cooling and retail bars.',
        motif: '📊💡',
        brief: 'Factory training room: Auntie Baaba pointing to a clean visual flowchart on a board showing cocoa beans -> factory machinery -> wrapped chocolate bars -> refrigerated van (no text or numbers on the board) as Adwoa writes in her notebook.',
        narration: 'Read the illustrative numbers clearly: 300 cedis for 10 kg of beans, 100 bars at 12 cedis = 1,200 cedis gross sales.',
      },
      {
        text: '‘Does the chocolate maker keep all 900 cedis of the difference as profit?’ Adwoa asked sharply. ‘Good catch!’ Auntie Baaba smiled. ‘No! In our illustrative example, if sugar, milk, food-grade packaging, FDA testing, cold storage, worker wages and transport cost 700 cedis, then total production cost is 300 plus 700 equals 1,000 cedis, leaving 200 cedis in net profit. Value addition is real work: quality, food safety, branding and reliable distribution all cost money and skill, and keep skilled jobs here in Ghana!’',
        alt: 'Adwoa checks the subtraction in her notebook while factory staff pack foil-wrapped Ghanaian chocolate bars into chilled boxes.',
        motif: '🧮❄️',
        brief: 'Clean packaging room: Ghanaian factory workers in white coats and hairnets packing gold-foil-wrapped chocolate bars into insulated cartons while Adwoa and Auntie Baaba review Adwoa’s notebook.',
        narration: 'Emphasise the distinction between gross retail price (1,200 cedis), total costs (1,000 cedis) and net profit (200 cedis).',
      },
      {
        text: 'On the bus ride home, Adwoa savoured a square of dark Ghanaian chocolate and wrote at the bottom of her page: What Would You Build, Discover or Change? ‘One day I want to help our cooperative process cocoa butter, natural soaps and export-quality chocolates right in our district,’ she told Papa Kofi and Mama Efua. Look around your town or region, what local crop or raw material could you process, package or improve to create more value in Ghana?',
        alt: 'Back at the shaded cocoa farm, Adwoa shares Ghanaian chocolate bars with her parents and shows her value-addition drawings.',
        motif: '🇬🇭🌟',
        brief: 'Warm afternoon at the family compound near the cocoa farm: Adwoa, Papa Kofi and Mama Efua smiling together over foil-wrapped dark chocolate bars and Adwoa’s open sketchbook.',
        narration: 'Warm, ambitious ending inviting young readers to think about value addition in their own communities.',
      },
    ],
    activities: [
      {
        id: 'cocoa-c1',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why do cocoa farmers ferment wet cocoa beans under plantain leaves for six days before drying them?',
        options: [
          'Microbes break down pulp and trigger reactions that build chocolate aroma',
          'To paint the beans bright blue',
          'To make the beans sprout into new trees inside the sack',
        ],
        correctIndex: 0,
        explanation: 'Fermentation by natural yeasts and bacteria heats the heap and forms the chemical flavour precursors needed for real chocolate aroma.',
      },
      {
        id: 'cocoa-v1',
        type: 'vocabulary',
        afterPage: 6,
        word: 'winnowed',
        definition: 'Separated the lighter cracked outer shells from the roasted cocoa nibs using air currents',
        distractors: [
          'Frozen inside a block of ice',
          'Planted deep beneath a river',
        ],
      },
      {
        id: 'cocoa-c2',
        type: 'comprehension',
        afterPage: 9,
        question: 'In Auntie Baaba’s illustrative workshop example (300 cedis beans + 700 cedis processing/packaging = 1,000 cedis total cost; 100 bars sold at 12 cedis = 1,200 cedis), what is the net profit?',
        options: [
          '200 cedis (1,200 cedis revenue minus 1,000 cedis total cost)',
          '1,200 cedis because processing and packaging are free',
          '900 cedis because workers and electricity cost nothing',
        ],
        correctIndex: 0,
        explanation: 'Total cost is 300 + 700 = 1,000 cedis. Subtracting 1,000 cedis from 1,200 cedis in revenue leaves 200 cedis net profit.',
      },
      {
        id: 'cocoa-s1',
        type: 'sequencing',
        afterPage: 10,
        prompt: 'Put the stages of the cocoa value chain in order from farm to finished bar.',
        items: [
          'Harvesting ripe pods, fermenting beans for 6 days and sun-drying on mats.',
          'Quality grading, roasting and winnowing beans into cocoa nibs.',
          'Grinding nibs into cocoa liquor, pressing cocoa butter and conching chocolate.',
        ],
      },
      {
        id: 'cocoa-sel',
        type: 'sel',
        afterPage: 10,
        prompt: 'How does processing raw crops into finished products in Ghana help both farmers and young graduates?',
        feelingOptions: ['Proud', 'Curious', 'Enterprising', 'Inspired'],
      },
    ],
    glossary: [
      { word: 'fermentation', definition: 'A natural biological process in which yeasts and bacteria break down sugars in cocoa pulp, generating heat and developing chocolate flavour precursors', pages: [3] },
      { word: 'winnowed', definition: 'Blew away the thin cracked husks after roasting so only pure cocoa nibs remained', pages: [6] },
      { word: 'nibs', definition: 'Crunchy pieces of roasted, shelled cocoa bean kernel that are ground to make cocoa liquor', pages: [6, 7] },
      { word: 'conche', definition: 'A heated mixing machine that stirs liquid chocolate for hours to make its texture silky-smooth and refine its flavour', pages: [7] },
    ],
    teacherGuide: {
      overview:
        'A Primary 4–6 agricultural science, trade and entrepreneurship story following a cocoa bean from a sustainable shaded farm in Sefwi Wiawso to a Ghanaian chocolate factory in Tema. Learners explore fermentation chemistry, post-harvest quality control, cocoa processing (nibs, liquor, butter, powder, conching), child-safe farming standards, and the economics of value addition.',
      lessonMinutes: 40,
      learningGoals: [
        'Describe the post-harvest science of cocoa on the farm: 6-day fermentation and 7–10-day sun-drying to under 8% moisture.',
        'Trace factory processing from roasted beans to cocoa nibs, cocoa liquor, cocoa butter, cocoa powder and conched chocolate.',
        'Distinguish gross retail revenue from net profit using an illustrative value-addition cost breakdown.',
        'Explain why sustainable shade-tree agroforestry and strict child-safe farm rules protect Ghana’s cocoa heritage.',
      ],
      subjectLinks: [
        { subject: 'Social Studies / Our World Our People', link: 'Agriculture, trade, industrialisation and value addition in Ghana.', status: 'to-verify' },
        { subject: 'Science (Upper Primary)', link: 'Plant life cycles, fermentation microbes, reversible/irreversible changes and food processing.', status: 'to-verify' },
        { subject: 'Mathematics', link: 'Cost, revenue and net profit calculations in Ghana cedis.', status: 'to-verify' },
      ],
      beforeReading: [
        'Show learners a picture of a cocoa pod and a bar of Ghanaian chocolate (or cocoa powder) and ask: "What steps happen between the tree and the tin?"',
        'Note that the financial numbers on pages 8–9 are illustrative classroom examples designed to teach cost vs profit arithmetic, as real market prices change over time.',
      ],
      whileReading: [
        'Pause after page 4 to ask why unfermented cocoa beans do not taste like chocolate even if you roast them.',
        'Pause after page 9 to work through the cost table on the board: 300 cedis (beans) + 700 cedis (other inputs, wages, energy, packaging) = 1,000 cedis total cost.',
      ],
      afterReading: [
        'Have learners pick another Ghanaian crop (cassava, shea nuts, mango, groundnuts, tiger nuts) and draw a 4-step "Raw to Value-Added Product" poster.',
      ],
      discussion: [
        'Why do shade trees help a cocoa farm stay healthy for many years?',
        'Why is it wrong to assume that the entire price difference between raw cocoa beans and a retail chocolate bar is pure profit?',
        'What new jobs are created in Ghana when cocoa is processed into butter, powder, cosmetics and chocolate bars locally?',
      ],
      reflection: [
        'What Would You Build, Discover or Change? Choose one crop grown in your region, what new snack, drink or household product could you make from it, and how would you package it cleanly?',
      ],
      mathsExtension: [
        {
          task: 'In the illustrative workshop example, 100 chocolate bars sell for 12 cedis each (1,200 cedis total revenue). Raw cocoa beans cost 300 cedis and processing, ingredients, wages and packaging cost 700 cedis. What is the net profit per bar?',
          answer: 'Total profit = 1,200 − (300 + 700) = 200 cedis. Profit per bar = 200 ÷ 100 = 2 cedis per bar.',
        },
        {
          task: 'If a cooperative dries 500 kg of wet fermented beans and loses 55% of the weight as water evaporates during sun-drying, how many kilograms of dry cocoa beans remain?',
          answer: 'Water lost = 55% of 500 = 275 kg. Dry beans remaining = 500 − 275 = 225 kg (45% of 500 kg).',
        },
      ],
      differentiation: {
        support: ['Create a simple 5-card picture sequence: Pod → White Beans → Brown Dried Beans → Cocoa Liquor/Butter → Chocolate Bar.'],
        stretch: ['Investigate how by-products of the cocoa pod (such as cocoa pod husks and mucilage sweatings) are used in Ghana to make potash black soap (alata samina) and fruit juice.'],
      },
      culturalNotes: [
        'Since Tetteh Quarshie introduced Amelonado cocoa pods to Akuapem Mampong in 1879, cocoa has been central to Ghanaian rural livelihoods and national pride.',
      ],
      localiseThis: [
        'In northern coastal or savannah zones where cocoa does not grow, compare the cocoa value chain with the shea butter (Vitellaria paradoxa) or cashew value chain.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Cocoa flowers and pods grow directly on the trunk and older branches (cauliflory) and are pollinated primarily by tiny biting midges (Forcipomyia) that thrive in moist shaded leaf litter.',
          'Microbial fermentation (yeasts, lactic acid bacteria and acetic acid bacteria) over ~6 days and sun-drying to ~7.5% moisture are essential to develop chocolate flavour precursors and prevent mould.',
          'Roasting, winnowing, grinding into cocoa liquor, hydraulic pressing into butter and cake, and conching are the core industrial steps of chocolate manufacturing.',
        ],
        whatWeAreStillDiscovering: [
          'Food scientists at the Cocoa Research Institute of Ghana (CRIG) continue researching new value-added products from cocoa pulp, husks and flavanol-rich extracts.',
        ],
      },
      investigation: {
        title: 'Observe How Fat (Cocoa Butter) and Solids Behave in Warm Water',
        materials: [
          '1 spoonful of unsweetened cocoa powder',
          '2 cups of warm water and 1 spoonful of cooking oil or shea/cocoa butter',
          'Two clear cups and a spoon',
        ],
        steps: [
          'In Cup A, stir a spoonful of cocoa powder into warm water and observe how the fine solid particles suspend in the liquid.',
          'In Cup B, add a small drop of oil or melted shea/cocoa butter to warm water and observe how pure plant fats separate unless mixed and emulsified.',
          'Discuss how pressing cocoa liquor separates the fat (cocoa butter) from the dry solids (cocoa powder).',
        ],
        whatToNotice:
          'Cocoa beans contain both natural fat (cocoa butter) and dry cocoa solids; separating or recombining them in precise ratios lets food scientists make either drinkable cocoa powder or smooth solid chocolate!',
        safetyNote: 'Use warm tap water (never boiling water) under teacher supervision.',
      },
      factCheck: [
        {
          claim: 'Ghanaian cocoa beans undergo ~6 days of heap or tray fermentation followed by sun-drying to ~7.5% moisture before quality grading.',
          explanation: 'Standard Ghana Cocoa Board (COCOBOD) and CRIG post-harvest protocols specify 6 days of fermentation with turning and 7–10 days of sun-drying to ~7.5% moisture content.',
          reference: 'Cocoa Research Institute of Ghana (CRIG) Farmers’ Handbook on Cocoa Production.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Warm, appreciative Ghanaian English storyteller; lively curiosity for Adwoa and proud expertise for Papa Kofi, Mama Efua and Auntie Baaba.',
      pace: 'Comfortable Primary 4–6 pace (~120 words per minute).',
      notes: ['Pronounce Adwoa as ah-JWAH and Sefwi Wiawso clearly.'],
    },
    music: 'Optional gentle piano underscore.',
    culturalNotes: [
      'Celebrates both Ghanaian cocoa farmers and Ghanaian food scientists adding value locally in Tema and across the country.',
    ],
    reviewQuestions: [
      'Does the story avoid quoting fixed real-world prices while clearly teaching cost vs profit in an illustrative example?',
      'Are child-safe farm rules clearly modelled?',
    ],
  },

  // ====================================================================================================================
  // 4. The Butterfly That Knew the Way (Primary 2–4, 9 pages, Pollination, Insect Senses, Navigation & Curiosity)
  // ====================================================================================================================
  {
    key: 'the-butterfly-that-knew-the-way',
    set: 'extension',
    title: 'The Butterfly That Knew the Way',
    summary:
      'During a school nature-club session near Aburi, eight-year-old Nhyira notices a swallowtail butterfly with a tiny chipped wing returning to the exact same hibiscus bush two mornings in a row, leading her class to discover how insects see ultraviolet flower guides, smell with their antennae, taste with their feet, and navigate their habitats.',
    classification: base({
      classIds: ['primary-2', 'primary-3', 'primary-4'],
      ageMin: 7,
      ageMax: 10,
      readingLevel: 'developing',
      difficulty: 3,
      genres: ['nature', 'science', 'educational'],
      themes: ['animals-and-habitats', 'farm-and-garden', 'school'],
      objectives: ['scientific-curiosity', 'environmental-awareness', 'counting', 'vocabulary', 'reading-comprehension', 'reasoning'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 320,
    }),
    palette: ['#fef08a', '#15803d'],
    characters: [
      'Nhyira: a gentle, observant eight-year-old Ghanaian girl in Primary 3 near Aburi, wearing a yellow-and-green school uniform, two neat Afro puffs with yellow ribbons, and holding a nature tally sheet.',
      'Kojo: Nhyira’s eight-year-old classmate and nature-club partner, wearing a matching yellow-and-green school shirt and khaki shorts, holding a pencil.',
      'Madam Serwaa: their Primary 3 teacher and nature-club leader, wearing a leafy-green dress and carrying a magnifying glass.',
      'The Chipped-Wing Swallowtail: a black-and-yellow citrus swallowtail butterfly (Papilio demodocus) with a tiny v-shaped notch on its left hindwing.',
    ],
    pages: [
      {
        text: 'Every Tuesday morning at their school near the misty hills of Aburi, eight-year-old Nhyira and her friend Kojo met in the school pollination garden with Madam Serwaa. Bright red hibiscus, orange lantana and purple verbena flowers bloomed along the path. ‘Remember our first nature-club rule,’ Madam Serwaa smiled. ‘Scientists observe living creatures gently with their eyes and notebooks, we never chase, grab or touch a butterfly’s delicate wings.’',
        alt: 'Eight-year-old Nhyira, Kojo and Madam Serwaa stand quietly beside blooming hibiscus and lantana flowers in a sunny Ghanaian school garden.',
        motif: '🦋🌺',
        brief: 'Sunlit Ghanaian school garden with misty green Aburi hills in the background: Nhyira (8, yellow-and-green uniform, two Afro puffs with yellow ribbons, clipboard), Kojo (8, yellow-and-green uniform) and Madam Serwaa (green dress) observing colourful flowers.',
        narration: 'Warm, gentle opening setting the safe and respectful observation rule.',
      },
      {
        text: 'As Nhyira watched a bright orange lantana cluster, a large black-and-yellow citrus swallowtail butterfly landed softly on a petal. Nhyira noticed a tiny triangle-shaped nick on the edge of its left back wing, probably from a bird’s beak. The butterfly uncoiled a long, curled tube under its head, its proboscis, and sipped sweet liquid nectar from the flower like a tiny drinking straw!',
        alt: 'Close view of a black-and-yellow swallowtail butterfly with a tiny notch on its left wing sipping nectar through its uncoiled proboscis.',
        motif: '🌼🔍',
        brief: 'Macro nature view: a black-and-yellow citrus swallowtail butterfly with a distinct tiny V-notch on its left hindwing perched on an orange lantana flower, uncoiling its spiral proboscis while Nhyira watches from a respectful distance.',
        narration: 'Slow, wondering tone describing the notched wing and the uncoiling proboscis.',
      },
      {
        text: 'When the school bell rang, the swallowtail fluttered high over the mango trees and disappeared. The next morning before assembly, Nhyira checked the exact same lantana bush, and gasped! Sitting on the same branch was the very same black-and-yellow butterfly with the tiny triangle notch on its left wing. ‘Madam Serwaa!’ Nhyira whispered. ‘How did a butterfly with a brain smaller than a grain of rice find its way back here?’',
        alt: 'The next morning, Nhyira points excitedly from a safe distance as the same notched-wing swallowtail lands on the lantana bush.',
        motif: '😮🌿',
        brief: 'Morning sunlight in the school garden: Nhyira and Kojo looking in amazement as the exact same black-and-yellow butterfly with the tiny left-wing notch lands on the orange lantana bush.',
        narration: 'Let Nhyira’s excitement and curiosity shine through.',
      },
      {
        text: 'Madam Serwaa opened a science picture card showing a butterfly’s head up close. ‘First, a butterfly senses the world very differently from us,’ she explained. ‘Its two rounded compound eyes are made of thousands of tiny lenses that can see wide around it, and can even see ultraviolet light patterns on flower petals that are completely invisible to human eyes! Those ultraviolet markings point straight to the nectar like airport runway lights.’',
        alt: 'Madam Serwaa shows Nhyira and Kojo an illustration of a butterfly’s compound eyes and ultraviolet bullseye patterns on a flower.',
        motif: '👁️✨',
        brief: 'Garden bench scene: Madam Serwaa holding up a large visual nature card showing a flower under human sight on one side and glowing purple-blue petal guide lines on the other side, while Nhyira and Kojo lean in curiously (no text on card).',
        narration: 'Clear, vivid analogy comparing ultraviolet petal guides to runway lights.',
      },
      {
        text: '‘What about its two feelers?’ asked Kojo. ‘Those are its antennae,’ said Madam Serwaa. ‘A butterfly smells with its antennae! Microscopic scent sensors on the antennae detect the sweet perfume of flowers and the exact leaf scent of the citrus or lime trees where a mother swallowtail lays her eggs. And when a butterfly lands on a leaf, taste sensors on its feet tell it immediately whether that plant is the right food for its caterpillars!’',
        alt: 'The swallowtail butterfly touches a green lemon leaf with its feet and waves its club-tipped antennae.',
        motif: '🌱🦶',
        brief: 'Close-up of the black-and-yellow swallowtail resting on a glossy green citrus leaf, its two club-tipped antennae raised and its six legs touching the leaf surface.',
        narration: 'Playful amazement on "smells with its antennae" and "taste sensors on its feet".',
      },
      {
        text: '‘As the butterfly sips nectar,’ Madam Serwaa continued, ‘yellow dust called pollen sticks to its body and gets carried to the next flower, helping plants make seeds and fruit!’ Then Kojo asked, ‘Do all butterflies in Ghana fly thousands of kilometres across the world like the famous monarch butterflies we saw in a library book?’ Madam Serwaa shook her head. ‘No, Kojo, that is a very important scientific distinction!’',
        alt: 'Yellow pollen grains cling to the butterfly as it flies between flowers while Madam Serwaa explains local vs migrating species.',
        motif: '🌸🐝',
        brief: 'Close view of golden pollen grains on a butterfly visiting a red hibiscus flower, with Nhyira, Kojo and Madam Serwaa observing from the garden path.',
        narration: 'Emphasise the scientific distinction that not all butterfly species migrate long distances.',
      },
      {
        text: '‘Only a few butterfly species in the world make giant cross-continent migrations,’ Madam Serwaa explained. ‘Ghana is home to more than 900 butterfly species! Some move seasonally with the rains, while many garden and forest butterflies, like our citrus swallowtail, live right in a local habitat. To find their way around their neighbourhood, they use the position of the Sun in the sky, polarized light, scent trails and familiar shapes of trees and bushes.’',
        alt: 'A wide view of the sunny school garden shows the swallowtail orienting by the morning sun, mango trees and flower beds.',
        motif: '☀️🌳',
        brief: 'Wide sunlit garden scene showing rays of morning sun above mango trees, flowering shrubs and the swallowtail gliding along the hedge path while Nhyira traces its path in the air with her finger.',
        narration: 'Clear, accurate explanation of local habitat navigation using the Sun, scents and landmarks.',
      },
      {
        text: '‘Do scientists know everything about how tiny insect brains do that?’ Nhyira asked. ‘Not yet!’ smiled Madam Serwaa. ‘We know butterflies combine sun-compass cues, ultraviolet sight and antennae smell, but neurobiologists are still discovering how such a tiny brain weaves all those clues into a mental map!’ For fifteen minutes, Nhyira and Kojo stood still and tallied every butterfly visit: 6 yellow grass butterflies, 4 black-and-yellow swallowtails and 5 white butterflies, 6 plus 4 plus 5 equals 15 visits in all!',
        alt: 'Nhyira and Kojo count tally marks on their clipboard as yellow, white and swallowtail butterflies visit the garden flowers.',
        motif: '📋🔢',
        brief: 'Nhyira and Kojo standing quietly by the flower bed holding a clipboard with tally marks (no readable words), watching yellow, white and black-and-yellow butterflies around the flowers.',
        narration: 'Count the tally clearly: 6 yellow plus 4 swallowtails plus 5 white equals 15 visits.',
      },
      {
        text: 'Before going inside, Nhyira watered a row of young lime and hibiscus seedlings and wrote in her nature book: What Would You Build, Discover or Change? ‘If we plant native nectar flowers and never spray harmful chemicals on our school garden,’ she said, ‘the butterflies will always have a safe home to return to.’ What living creature in your compound or schoolyard could you observe quietly and protect this week?',
        alt: 'Nhyira and Kojo water young flowering plants in the school garden as the notched-wing swallowtail flutters overhead.',
        motif: '🚿🌱',
        brief: 'Warm sunny finale in the school garden: Nhyira and Kojo watering potted hibiscus and lime seedlings with small watering cans while Madam Serwaa smiles and the swallowtail butterfly glides above.',
        narration: 'Gentle, inspiring ending inviting young readers to observe and protect nature.',
      },
    ],
    activities: [
      {
        id: 'butterfly-c1',
        type: 'comprehension',
        afterPage: 5,
        question: 'Which body parts does a butterfly use to smell flower scents and taste whether a leaf is the right host plant?',
        options: [
          'It smells with its antennae and tastes with sensors on its feet',
          'It smells with its wings and tastes with its ears',
          'It uses a glass magnifying lens',
        ],
        correctIndex: 0,
        explanation: 'Butterflies detect scents with receptors on their antennae and taste plant chemicals with contact chemoreceptors on their feet (tarsi).',
      },
      {
        id: 'butterfly-v1',
        type: 'vocabulary',
        afterPage: 6,
        word: 'pollen',
        definition: 'Fine yellow powder made by flowers that insects carry from blossom to blossom so plants can make seeds and fruit',
        distractors: [
          'Small pebbles at the bottom of a river',
          'Drops of rain falling from a dark cloud',
        ],
      },
      {
        id: 'butterfly-c2',
        type: 'comprehension',
        afterPage: 7,
        question: 'Do all butterflies in Ghana migrate thousands of kilometres across continents like the North American monarch butterfly?',
        options: [
          'No; most Ghanaian butterflies live and navigate within local habitats',
          'Yes, every single butterfly flies to the North Pole every night',
          'No, because butterflies cannot fly at all',
        ],
        correctIndex: 0,
        explanation: 'Different butterfly species have different behaviours; most local garden and forest butterflies navigate within a local habitat rather than migrating across continents.',
      },
      {
        id: 'butterfly-c3',
        type: 'comprehension',
        afterPage: 8,
        question: 'Nhyira and Kojo counted 6 yellow grass butterflies, 4 swallowtails and 5 white butterflies. How many butterfly visits did they tally in total?',
        options: [
          '15 butterfly visits (6 + 4 + 5 = 15)',
          '10 butterfly visits',
          '25 butterfly visits',
        ],
        correctIndex: 0,
        explanation: '6 + 4 = 10, and 10 + 5 = 15 butterfly visits.',
      },
      {
        id: 'butterfly-s1',
        type: 'sequencing',
        afterPage: 9,
        prompt: 'Put Nhyira’s scientific investigation in order.',
        items: [
          'Nhyira notices a swallowtail with a tiny wing notch sipping nectar.',
          'She sees the same butterfly return the next day and asks how it navigated.',
          'She and Kojo tally 15 butterfly visits and plant more nectar flowers.',
        ],
      },
      {
        id: 'butterfly-sel',
        type: 'sel',
        afterPage: 9,
        prompt: 'How does watching animals quietly without hurting them help you learn more about nature?',
        feelingOptions: ['Curious', 'Gentle', 'Patient', 'Amazed'],
      },
    ],
    glossary: [
      { word: 'proboscis', definition: 'A butterfly’s long, coiled feeding tube that unrolls like a straw to sip liquid nectar from flowers', pages: [2] },
      { word: 'compound', definition: 'Made of many smaller parts; an insect’s compound eye has thousands of tiny lenses working together', pages: [4] },
      { word: 'antennae', definition: 'The pair of sensitive feelers on an insect’s head used to detect smells, air movement and balance', pages: [5, 8] },
      { word: 'pollen', definition: 'Fine powder produced by flowers that is transferred by pollinators to fertilise other flowers', pages: [6] },
    ],
    teacherGuide: {
      overview:
        'A Primary 2–4 biodiversity, pollination and insect-navigation story set in a school garden near Aburi. Learners discover how butterflies use compound eyes (including ultraviolet vision), antennae and foot taste receptors, distinguish local habitat navigation from long-distance migration, and separate established biology from open neuroscience questions.',
      lessonMinutes: 35,
      learningGoals: [
        'Describe how a butterfly uses its compound eyes, antennae, proboscis and feet to find and feed on flowers.',
        'Explain how butterflies pollinate flowers while sipping nectar.',
        'Explain that not all butterfly species migrate long distances; many Ghanaian butterflies navigate locally using sun position, scents and landmarks.',
        'Distinguish what biologists already know about insect senses from what scientists are still discovering about tiny insect brains.',
      ],
      subjectLinks: [
        { subject: 'Science (Lower/Upper Primary)', link: 'Living things, plant pollination, animal senses and local habitats.', status: 'to-verify' },
        { subject: 'Mathematics', link: 'Tallying, addition of three single-digit numbers (6 + 4 + 5 = 15) and simple data tables.', status: 'to-verify' },
        { subject: 'Our World Our People', link: 'Caring for plants, pollinators and the school environment.', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners: "Have you ever seen a butterfly visit a flower? How do you think it knows which flower has sweet nectar?"',
        'Remind learners of the golden rule: we never catch, pinch or touch butterflies’ wings because the tiny scales rub off.',
      ],
      whileReading: [
        'Pause at page 5 and ask learners to point to their own noses and tongues, then compare where a butterfly smells (antennae) and tastes (feet).',
        'Pause at page 7 to emphasise why scientists do not assume every butterfly acts like one famous species in another country.',
      ],
      afterReading: [
        'Take the class outdoors for a 10-minute silent Pollinator Tally Walk around flowering bushes on the school compound.',
      ],
      discussion: [
        'How could Nhyira be sure it was the exact same swallowtail butterfly on the second morning?',
        'Why do flowers have bright colours, ultraviolet markings and sweet scents?',
        'What is one question about butterfly brains that scientists are still investigating?',
      ],
      reflection: [
        'What Would You Build, Discover or Change? How could your class create a small "Pollinator Corner" at school or home using local flowering plants?',
      ],
      mathsExtension: [
        {
          task: 'Nhyira and Kojo counted 6 yellow grass butterflies, 4 black-and-yellow swallowtails and 5 white butterflies in 15 minutes. How many butterflies did they count altogether, and how many more yellow grass butterflies than swallowtails did they see?',
          answer: 'Total = 6 + 4 + 5 = 15 butterflies. Difference = 6 − 4 = 2 more yellow grass butterflies than swallowtails.',
        },
      ],
      differentiation: {
        support: ['Act out the four butterfly parts with hand gestures: unrolling proboscis (curled finger), antennae (two fingers above head), compound eyes (hands around eyes) and tasting feet (tapping toes).'],
        stretch: ['Draw a simple bar chart comparing the 3 butterfly groups tallied on Page 8 (6 yellow, 4 swallowtail, 5 white).'],
      },
      culturalNotes: [
        'Aburi in the Akuapem South Municipality (Eastern Region) is home to the historic Aburi Botanical Gardens, famous for its rich plant and butterfly diversity.',
      ],
      localiseThis: [
        'Observe whatever pollinators visit flowers around your school, butterflies, honeybees, carpenter bees or sunbirds.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Butterflies see colour and ultraviolet light patterns with their compound eyes, detect airborne odours with their antennae, taste host-plant chemicals with receptors on their feet (tarsi), and sip liquid through a coiled proboscis.',
          'Ghana has over 900 recorded butterfly species; unlike the North American monarch’s multi-generational continental migration, most Ghanaian species navigate locally or shift seasonally within West African habitats.',
        ],
        whatWeAreStillDiscovering: [
          'Neurobiologists are still investigating the exact neural circuits in the insect central complex that combine sun-compass cues, visual landmarks and odour plumes into spatial memory.',
        ],
      },
      investigation: {
        title: '10-Minute Quiet Pollinator Tally in the Schoolyard',
        materials: [
          'A notebook or sheet of paper ruled into 3 columns (Butterfly / Bee / Other Insect)',
          'A pencil',
          'A flowering bush or garden patch on the school compound',
        ],
        steps: [
          'Stand two steps back from a sunny flowering bush so you do not cast a shadow over the flowers or disturb visiting insects.',
          'For 10 minutes, stay quiet and make one tally mark each time a butterfly, bee or other insect lands on a flower.',
          'Add up the tally marks in each column and compare which flower colour received the most visits.',
        ],
        whatToNotice:
          'Staying still and quiet lets pollinators behave naturally, and different insects often prefer different flower shapes and colours!',
        safetyNote: 'Never touch, swat at or trap bees, wasps or butterflies; learners with insect-sting allergies should observe from a safe paved walkway with the teacher.',
      },
      factCheck: [
        {
          claim: 'Ghana has over 900 butterfly species, and citrus swallowtails (Papilio demodocus) are common across Ghanaian gardens and farms.',
          explanation: 'Torben Larsen’s Butterflies of West Africa documents over 900 butterfly species in Ghana, with Papilio demodocus widespread wherever citrus and garden flowers grow.',
          reference: 'Larsen, T. B. (2005). Butterflies of West Africa; Ghana Wildlife Society.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Gentle, wonder-filled Ghanaian English storyteller for Primary 2–4.',
      pace: 'Unhurried developing-reader pace (~110 words per minute).',
      notes: ['Pronounce Nhyira as NYEE-rah and Serwaa as sehr-WAAH.'],
    },
    music: 'Optional gentle piano underscore.',
    culturalNotes: [
      'Encourages gentle scientific observation of Ghana’s rich biodiversity without harming insects.',
    ],
    reviewQuestions: [
      'Is the distinction between local butterfly navigation and continental migration clear and age-appropriate?',
      'Does the observation activity enforce strict no-touch safety around insects?',
    ],
  },

  // ====================================================================================================================
  // 5. The Money That Worked While Afia Slept (Primary 6–JHS 2, 11 pages, Compound Interest, Inflation, Risk & Fraud)
  // ====================================================================================================================
  {
    key: 'the-money-that-worked-while-afia-slept',
    set: 'extension',
    title: 'The Money That Worked While Afia Slept',
    summary:
      'When twelve-year-old Afia helps her older brother Yao decide what to do with 1,000 cedis earned from his carpentry apprentice work, their aunt at a licensed community bank teaches them how compound interest, inflation, investment risk, debt compounding and get-rich-quick Ponzi scams work.',
    classification: base({
      classIds: ['primary-6', 'jhs-1', 'jhs-2'],
      ageMin: 11,
      ageMax: 14,
      readingLevel: 'proficient',
      difficulty: 4,
      genres: ['realistic-fiction', 'educational'],
      themes: ['money-and-enterprise', 'family', 'community'],
      objectives: ['financial-literacy', 'critical-thinking', 'reasoning', 'problem-solving', 'reading-comprehension', 'responsibility'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 420,
    }),
    palette: ['#1e3a8a', '#10b981'],
    characters: [
      'Afia: a sharp, maths-loving twelve-year-old Ghanaian girl in JHS 1 in Ho, wearing a navy-and-white school uniform and carrying a grid-paper maths exercise book.',
      'Bra Yao: Afia’s nineteen-year-old older brother, a skilled junior carpenter wearing a neat khaki work shirt.',
      'Auntieba / Auntie Akua: their aunt, a licensed financial advisor at a regulated community bank in Ho, wearing a smart royal-blue blazer and glasses.',
    ],
    pages: [
      {
        text: 'Twelve-year-old Afia loved numbers the way musicians love rhythm. One Saturday afternoon in Ho, her nineteen-year-old brother Bra Yao counted out 1,000 Ghana cedis he had saved from building school desks and wardrobes. ‘I do not need to buy my big workshop saw for another three years,’ Bra Yao said. ‘I will just lock this 1,000 cedis inside my wooden cash box under the bed until then.’',
        alt: 'In their family living room in Ho, nineteen-year-old Bra Yao holds 1,000 cedis beside a wooden cash box while twelve-year-old Afia looks thoughtful.',
        motif: '💵🔐',
        brief: 'Sunny Ghanaian living room: Bra Yao (19, khaki work shirt) holding a neat stack of Ghana cedi notes beside a small wooden lockbox on a table while Afia (12, navy-and-white uniform, grid notebook) watches thoughtfully (no readable text on notes).',
        narration: 'Warm, relatable family opening.',
      },
      {
        text: 'Just then, Auntie Akua, who worked at a licensed bank in town, stopped by after market. ‘Yao, keeping emergency cash safe is wise,’ she said, ‘but if 1,000 cedis sleeps inside a wooden box for three years, it faces a silent thief called inflation.’ Afia raised her eyebrows. ‘How can money be stolen if the box stays locked?’ she asked.',
        alt: 'Auntie Akua in a blue blazer explains inflation to Afia and Bra Yao around the dining table.',
        motif: '🏦🛒',
        brief: 'Family dining table: Auntie Akua (royal-blue blazer, glasses) setting down her market basket and speaking to Afia and Bra Yao.',
        narration: 'Intriguing introduction of the concept of inflation.',
      },
      {
        text: '‘Inflation is the general rise in the prices of goods and services over time,’ Auntie Akua explained. ‘Suppose a carpentry toolset costs 1,000 cedis today, and general prices rise by 8 percent over the next year: that same toolset will cost 1,080 cedis next year! Your cash box still holds 1,000 cedis, so its purchasing power, what the money can actually buy, has shrunk. To protect and grow long-term savings, your money must work while you sleep!’',
        alt: 'Afia draws a balance scale in her notebook showing a 1,000-cedi note weighed against a toolset whose price rises over time.',
        motif: '⚖️🧰',
        brief: 'Close view of Afia’s open grid notebook where she sketches a simple balance scale with a carpenter’s saw on one side and coin stacks on the other while Auntie Akua points with a pen (no readable text).',
        narration: 'Explain inflation and purchasing power clearly with the 1,000 to 1,080 cedis example.',
      },
      {
        text: 'Auntie Akua drew two columns in Afia’s exercise book. ‘First, let us compare simple interest and compound interest using an easy illustrative rate of 10 percent per year on your 1,000 cedis of principal,’ she said. ‘At the end of Year 1, 10 percent of 1,000 cedis is 100 cedis of interest. So whether you use simple or compound interest, your balance after one year is 1,000 plus 100 equals 1,100 cedis.’',
        alt: 'Auntie Akua and Afia calculate Year 1 interest (1,000 + 100 = 1,100 cedis) on a pad of grid paper.',
        motif: '📓➕',
        brief: 'Bright study table: Afia and Auntie Akua working together with a pencil and ruler drawing bar columns of rising coin stacks for Year 1 as Bra Yao leans in attentively.',
        narration: 'Step-by-step clarity on Year 1: 10 percent of 1,000 is 100; total is 1,100 cedis.',
      },
      {
        text: '‘Look what happens in Year 2 if you leave that 100 cedis of interest inside the account to compound,’ Afia said, her pencil flying! ‘In Year 2, you earn 10 percent not just on the original 1,000 cedis, but on the whole 1,100 cedis! Ten percent of 1,100 is 110 cedis. So 1,100 plus 110 equals 1,210 cedis, 10 cedis more than simple interest, because your first year’s interest earned its own interest!’',
        alt: 'Afia points excitedly to the Year 2 bar showing an extra golden block of interest-on-interest on top of the stack.',
        motif: '🌱🪙',
        brief: 'Afia smiling brightly as she colours a small glowing gold coin block at the top of the second bar in her visual chart, showing how interest earns new interest.',
        narration: 'Delighted discovery as Afia calculates Year 2: 1,100 + 110 = 1,210 cedis.',
      },
      {
        text: '‘Now calculate Year 3!’ challenged Bra Yao. Afia multiplied carefully: ‘Ten percent of 1,210 cedis is 121 cedis. Adding 121 to 1,210 gives 1,331 cedis at the end of Year 3! With simple interest, three years of 100 cedis would only be 1,300 cedis, so compounding created an extra 31 cedis without you lifting a hammer while you slept!’',
        alt: 'Bra Yao grins in amazement as Afia shows the three-step staircase of compound growth from 1,000 to 1,100 to 1,210 to 1,331 cedis.',
        motif: '📈😊',
        brief: 'Close view of three rising 3D wooden blocks on the table arranged like stairs by Bra Yao and Afia to represent Year 1, Year 2 and Year 3 growth.',
        narration: 'Speak the Year 3 math clearly: 1,210 + 121 = 1,331 cedis (31 cedis extra from compounding).',
      },
      {
        text: 'Then Auntie Akua held up a warning finger. ‘Never forget that compound interest works in reverse when you borrow money!’ she cautioned. ‘If someone takes a high-interest loan and fails to pay on time, the unpaid interest is added to the debt, and next month they are charged interest on the unpaid interest too! Compounding is a wonderful servant for a saver, but a dangerous master for a careless borrower.’',
        alt: 'Auntie Akua illustrates how an unpaid high-interest debt snowballs larger and heavier down a hill.',
        motif: '⚠️🪨',
        brief: 'Auntie Akua gesturing earnestly as Afia sketches a small cartoon diagram of a green tree growing upward for savings versus a heavy grey boulder rolling downhill for unpaid high-interest debt (no text).',
        narration: 'Serious, memorable contrast between compounding on savings versus compounding on debt.',
      },
      {
        text: 'Suddenly Bra Yao pulled out his phone. ‘Wait, Auntie! A stranger in a group chat sent me a link called MegaFast Gold Doubler. It promises: Send 1,000 cedis today and receive 2,000 cedis guaranteed in just seven days, a 100 percent return in one week! Should I put my money there instead of a 10-percent annual bond or bank account?’',
        alt: 'Bra Yao holds up his smartphone showing a flashy message with gold coin icons while Auntie Akua and Afia look alarmed.',
        motif: '📱🚨',
        brief: 'Bra Yao holding out his mobile phone displaying a flashy purple-and-gold pop-up icon with a rocket and coin bags (no readable text); Auntie Akua raising her hand in a firm "stop" gesture.',
        narration: 'Urgent, realistic moment as Bra Yao shows the suspicious "double your money" phone offer.',
      },
      {
        text: '‘Stop right there, Yao, that is a classic financial scam!’ Auntie Akua said firmly. ‘In real finance, higher potential returns always come with higher risk, and no legitimate business or stock-market investment can ever guarantee 100 percent profit in a week! Schemes that pay early members using cash taken from newer members are fraudulent Ponzi schemes, and they always collapse. Before entrusting money to any institution, check that it is licensed by the Bank of Ghana or the Securities and Exchange Commission!’',
        alt: 'Auntie Akua shows Bra Yao and Afia how to verify licensed financial institutions and spot the red flags of a Ponzi pyramid.',
        motif: '🛡️🏛️',
        brief: 'Auntie Akua showing Bra Yao and Afia a house-of-cards pyramid diagram collapsing beside a shield icon representing official bank regulation (no text).',
        narration: 'Clear, protective consumer-safety lesson on risk, return and regulatory verification.',
      },
      {
        text: 'On Monday afternoon, after classes, Afia accompanied Bra Yao to the licensed community bank. Together they placed 200 cedis into an instant-access emergency savings account and 800 cedis into a regulated fixed-term treasury investment where it would earn steady compound interest for three years while Yao finished his apprenticeship.',
        alt: 'At a clean licensed community bank counter, Bra Yao and Afia receive an official deposit receipt from a bank teller.',
        motif: '🏦🤝',
        brief: 'Bright, welcoming Ghanaian community bank interior: Bra Yao and Afia smiling at the counter as a friendly bank officer hands Yao an official stamped passbook and folder (no readable text).',
        narration: 'Calm, practical resolution showing how emergency savings and longer-term investments work together.',
      },
      {
        text: 'That night, Afia wrote at the top of a fresh page: What Would You Build, Discover or Change? ‘Financial intelligence means earning honestly, saving consistently, letting compound interest work patiently over years, and never falling for greedy shortcuts,’ she told Bra Yao. What long-term goal would you save and plan for, and how can you help your family spot financial scams before anyone loses hard-earned money?',
        alt: 'By lamplight at home, Afia and Bra Yao review their three-year savings and workshop plan together.',
        motif: '🌙📊',
        brief: 'Cosy evening study scene: Afia and Bra Yao sitting at the table by a warm desk lamp, smiling over Afia’s neat 3-year savings chart and a sketch of Yao’s future carpentry workshop.',
        narration: 'Warm, empowering conclusion.',
      },
    ],
    activities: [
      {
        id: 'afia-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why does 1,000 cedis locked in a box under the bed lose purchasing power when inflation is 8% per year?',
        options: [
          'Prices rise over time while idle cash in the box earns 0% return',
          'Because wooden boxes eat paper banknotes at night',
          'Because inflation makes toolsets weigh less',
        ],
        correctIndex: 0,
        explanation: 'When general prices rise (inflation) and idle cash earns nothing, the same 1,000 cedis buys fewer goods next year.',
      },
      {
        id: 'afia-v1',
        type: 'vocabulary',
        afterPage: 5,
        word: 'compound',
        definition: 'Interest calculated on both the original principal and the accumulated interest from previous periods',
        distractors: [
          'Money hidden inside an unlabelled plastic bag',
          'A fee paid to join an unlicensed chat group',
        ],
      },
      {
        id: 'afia-c2',
        type: 'comprehension',
        afterPage: 6,
        question: 'If 1,000 cedis earns 10% compound interest per year, what is the balance after 2 years and after 3 years?',
        options: [
          '1,210 cedis after Year 2 and 1,331 cedis after Year 3',
          '1,200 cedis after Year 2 and 1,300 cedis after Year 3',
          '2,000 cedis after 7 days',
        ],
        correctIndex: 0,
        explanation: 'Year 1: 1,000 + 100 = 1,100. Year 2: 1,100 + 110 = 1,210. Year 3: 1,210 + 121 = 1,331 cedis.',
      },
      {
        id: 'afia-c3',
        type: 'comprehension',
        afterPage: 9,
        question: 'What is the biggest warning sign that an online investment offer like "Double your money, 100% guaranteed in 7 days" is a scam?',
        options: [
          'It promises huge "zero-risk" profit and lacks BoG or SEC licensing',
          'It encourages you to study mathematics in school',
          'It asks you to keep an emergency fund at a licensed bank',
        ],
        correctIndex: 0,
        explanation: 'In real finance, higher returns carry higher risk and are never guaranteed; "guaranteed fast doubling" is a classic Ponzi fraud indicator.',
      },
      {
        id: 'afia-s1',
        type: 'sequencing',
        afterPage: 11,
        prompt: 'Order the steps of wise financial decision-making that Bra Yao and Afia followed.',
        items: [
          'Learn how inflation and compound interest affect savings over time.',
          'Reject unlicensed "get-rich-quick" schemes promising guaranteed high returns.',
          'Divide savings between an emergency fund and a regulated long-term investment.',
        ],
      },
      {
        id: 'afia-sel',
        type: 'sel',
        afterPage: 11,
        prompt: 'Why does building real wealth require patience and discipline rather than chasing quick shortcuts?',
        feelingOptions: ['Patient', 'Disciplined', 'Wise', 'Confident'],
      },
    ],
    glossary: [
      { word: 'inflation', definition: 'The general increase in prices of goods and services over time, which reduces what each unit of currency can buy', pages: [2, 3] },
      { word: 'principal', definition: 'The original sum of money saved, invested, or borrowed before interest is added', pages: [4] },
      { word: 'compound', definition: 'Growing by earning returns on both the original principal and previously earned interest', pages: [4, 5, 7, 10, 11] },
      { word: 'Ponzi', definition: 'A fraudulent investment scam that pays early participants with money taken from new participants rather than real business profits', pages: [9] },
    ],
    teacherGuide: {
      overview:
        'A Primary 6 to JHS 2 financial-literacy and mathematics story set in Ho. Learners work through exact Ghana cedi calculations comparing simple and compound interest over 3 years (1,000 → 1,100 → 1,210 → 1,331 cedis), understand inflation and debt compounding, and learn how to spot unlicensed get-rich-quick Ponzi scams.',
      lessonMinutes: 45,
      learningGoals: [
        'Calculate multi-year simple interest and compound interest in Ghana cedis and explain why compounding grows faster over time.',
        'Explain how inflation reduces the purchasing power of idle cash.',
        'Explain that compounding also applies to unpaid debt, making high-interest loans grow rapidly.',
        'Identify warning signs of financial fraud (unusually high "guaranteed" returns, pressure to act fast, lack of Bank of Ghana or SEC Ghana licensing).',
      ],
      subjectLinks: [
        { subject: 'Mathematics (Primary 6 / JHS)', link: 'Percentages, simple and compound interest, and financial arithmetic.', status: 'to-verify' },
        { subject: 'Social Studies / Career Technology', link: 'Financial literacy, saving vs investing, consumer protection and enterprise planning.', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners: "If someone offered you 1,000 cedis plus 100 cedis every year (simple), or 1,000 cedis growing by 10% of the new total each year (compound), which would be bigger after 3 years?"',
      ],
      whileReading: [
        'Have every learner write down the Year 1 (1,100), Year 2 (1,210) and Year 3 (1,331) calculations in their own notebook alongside Afia on pages 4–6.',
        'Pause at page 8 to discuss why scammers use urgency ("today only!") and greed ("double in 7 days!") to trick people.',
      ],
      afterReading: [
        'Compare the 3-year table of Simple vs Compound interest on the chalkboard and compute Year 4 together (1,331 + 133.10 = 1,464.10 cedis).',
      ],
      discussion: [
        'Why is keeping all long-term savings in a box at home risky both physically and economically (inflation)?',
        'How does compound interest hurt a borrower who takes a high-interest loan and misses payments?',
        'What two Ghanaian regulatory bodies license banks and investment firms? (Bank of Ghana and the Securities and Exchange Commission, SEC Ghana.)',
      ],
      reflection: [
        'What Would You Build, Discover or Change? What is one educational or enterprise goal you want to save for over the next three years, and what rule will protect your family from financial scams?',
      ],
      mathsExtension: [
        {
          task: 'Calculate the difference after 3 years between 1,000 cedis at 10% simple interest per year and 1,000 cedis at 10% annual compound interest.',
          answer: 'Simple interest after 3 years: 1,000 + (3 × 100) = 1,300 cedis. Compound interest after 3 years: 1,331 cedis. Difference: 1,331 − 1,300 = 31 cedis.',
        },
        {
          task: 'Continue Afia’s 10% compound interest table for one more year (Year 4), starting from the Year 3 balance of 1,331 cedis.',
          answer: '10% of 1,331 = 133.10 cedis. Year 4 balance = 1,331 + 133.10 = 1,464.10 cedis.',
        },
      ],
      differentiation: {
        support: ['Use counters or paper strips of 100 cedis to model Year 1 (10 strips + 1 strip = 11 strips) and Year 2 (11 strips + 1.1 strips = 12.1 strips).'],
        stretch: ['Calculate what happens if someone borrows 1,000 cedis from an unlicensed lender charging 20% compound interest per month and makes no payments for 2 months (Month 1: 1,200 cedis; Month 2: 1,200 + 240 = 1,440 cedis).'],
      },
      culturalNotes: [
        'Ho is the capital of the Volta Region; Yao (Ewe for a boy born on Thursday) and Afia / Akua (Akan day names for Friday / Wednesday) reflect everyday Ghanaian family life.',
      ],
      localiseThis: [
        'Point out regulated rural and community banks, credit unions, and Bank of Ghana / SEC Ghana public advisories in your area.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Compound growth follows the mathematical formula A = P(1 + r)^n, where interest earned in each period is added to the principal for the next period.',
          'Inflation erodes the real purchasing power of uninvested cash whenever the inflation rate exceeds 0%.',
          'Under Ghanaian law, deposit-taking institutions are regulated by the Bank of Ghana (BoG) and capital-market investment schemes by the Securities and Exchange Commission (SEC) Ghana.',
        ],
        whatWeAreStillDiscovering: [
          'Behavioural economists continue researching how youth financial-literacy education and visual compounding tools improve long-term household savings habits.',
        ],
      },
      investigation: {
        title: 'Build a Visual Staircase of Simple vs Compound Growth',
        materials: [
          'A sheet of squared (grid) paper',
          'Two coloured pencils (blue for Simple Interest, green for Compound Interest)',
          'A ruler',
        ],
        steps: [
          'Let 1 grid square equal 10 cedis (so 1,000 cedis = 100 squares, or draw bars to scale where 1 cm = 100 cedis).',
          'Draw pairs of bars for Year 0 (1,000 vs 1,000), Year 1 (1,100 vs 1,100), Year 2 (1,200 vs 1,210), Year 3 (1,300 vs 1,331) and Year 4 (1,400 vs 1,464.10).',
          'Shade the extra "interest-on-interest" top section of each green Compound bar and notice how that shaded section grows wider every year.',
        ],
        whatToNotice:
          'In Year 1 the two bars are equal, but in every year after Year 1 the compound bar pulls further ahead because each year’s interest starts earning its own interest!',
        safetyNote: 'Standard classroom graphing activity; no special safety hazards.',
      },
      factCheck: [
        {
          claim: '1,000 cedis compounded annually at 10% grows to 1,100 cedis in Year 1, 1,210 cedis in Year 2, and 1,331 cedis in Year 3.',
          explanation: '1,000 × (1.10)^1 = 1,100; 1,000 × (1.10)^2 = 1,210; 1,000 × (1.10)^3 = 1,331.',
          reference: 'Standard compound-interest mathematics: A = P(1 + r)^n.',
        },
        {
          claim: 'Unusually high "guaranteed" short-term investment returns are a primary red flag of Ponzi and financial fraud schemes.',
          explanation: 'Both the Bank of Ghana and the Securities and Exchange Commission (SEC) Ghana warn citizens that legitimate investments carry risk and that schemes promising guaranteed rapid doubling of money are fraudulent.',
          reference: 'Bank of Ghana & SEC Ghana Public Investor Protection Advisories.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Warm, articulate Ghanaian English storyteller; lively enthusiasm for Afia and calm authority for Auntie Akua.',
      pace: 'Clear JHS pace (~125 words per minute), pausing slightly after each equation.',
      notes: ['Pronounce Afia as ah-FEE-ah, Akua as ah-KOO-ah, and Yao as YAHW.'],
    },
    music: 'Optional gentle piano underscore.',
    culturalNotes: [
      'Equips Ghanaian learners and families with practical mathematical tools to build long-term financial security and resist fraudulent money-doubling schemes.',
    ],
    reviewQuestions: [
      'Are all compound-interest numbers (1,000 → 1,100 → 1,210 → 1,331) verified across text, activities and teacher guide?',
      'Does the story clearly explain both debt compounding and investment risk?',
    ],
  },

  // ====================================================================================================================
  // 6. The Village That Refused to Give Up (Primary 5–JHS 1, 12 pages, Faith, Hydrogeology, Water Safety & Leadership)
  // ====================================================================================================================
  {
    key: 'the-village-that-refused-to-give-up',
    set: 'extension',
    title: 'The Village That Refused to Give Up',
    summary:
      'When the dry season shrinks the seasonal stream in the fictional village of Nsuom and the old hand-pump breaks down, eleven-year-old Kwame and his neighbours learn how faith in God inspires unity, scientific hydrogeology, laboratory water-quality testing, transparent budgeting and shared maintenance rather than passive waiting.',
    classification: base({
      classIds: ['primary-5', 'primary-6', 'jhs-1'],
      ageMin: 10,
      ageMax: 13,
      readingLevel: 'fluent',
      difficulty: 4,
      genres: ['realistic-fiction', 'science', 'educational'],
      themes: ['community', 'citizenship', 'helping-others', 'leadership'],
      objectives: ['responsibility', 'scientific-curiosity', 'citizenship', 'problem-solving', 'teamwork', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['village-life', 'local-names'],
      estimatedDurationSec: 450,
    }),
    palette: ['#0284c7', '#d97706'],
    characters: [
      'Kwame: a thoughtful eleven-year-old Ghanaian boy in Primary 6 in the fictional village of Nsuom, wearing a khaki school uniform and carrying a notebook.',
      'Esi: Kwame’s eleven-year-old classmate and friend, wearing a khaki dress uniform and braided hair with blue beads.',
      'Engr. Asante: a licensed hydrogeologist and water engineer with the Community Water and Sanitation Agency (CWSA), wearing a blue field shirt, hard hat and carrying geophysical survey instruments.',
      'Nana Ofori: the respected village chief and chair of the Nsuom Water and Sanitation Management Team, wearing a traditional kente-trimmed cloth.',
    ],
    pages: [
      {
        text: 'By February in the fictional farming village of Nsuom, the dry Harmattan wind had shrunk the nearby seasonal stream into shallow, muddy pools. Worse still, the village’s single old hand-pump had broken down six months earlier because nobody had kept a repair fund. Every morning before school, eleven-year-old Kwame and his classmate Esi saw adults queuing for hours to fetch water from a distant tanker.',
        alt: 'In the dry season in Nsuom, eleven-year-old Kwame and Esi watch adults queue with yellow jerrycans beside a broken hand-pump.',
        motif: '🚰☀️',
        brief: 'Sunny dry-season morning in a Ghanaian village: adults queuing patiently with yellow water containers near a padlocked broken hand-pump while Kwame (11, khaki uniform, notebook) and Esi (11, khaki uniform, blue beads) watch from the school path.',
        narration: 'Empathetic, realistic opening showing the community impact of a broken water system.',
      },
      {
        text: 'Under the big baobab tree that evening, Nana Ofori called a community durbar. Neighbours of different faiths, Christian, Muslim and traditional families, sat side by side. One frustrated resident sighed, ‘Perhaps our village is simply unlucky, or we should just wait and pray for early rain.’ Respected elders, the catechist and the imam all shook their heads gently in agreement with Nana Ofori.',
        alt: 'At a village durbar under a baobab tree, Nana Ofori and community elders of diverse faiths address the gathered residents.',
        motif: '🌳🤝',
        brief: 'Warm community gathering under a large baobab tree in Ghana: Nana Ofori in traditional cloth, seated alongside respected male and female elders from Christian, Muslim and traditional backgrounds, speaking calmly to attentive villagers.',
        narration: 'Respectful, inclusive tone showing unity across diverse faiths.',
      },
      {
        text: '‘Dry seasons and broken pumps are not a curse or a sign of weak faith,’ Nana Ofori said wisely. ‘Our faith in God teaches us gratitude, honesty, service to our neighbours, and stewardship of the minds and hands God gave us! Prayer gives us hope and unity, and true responsibility means pairing our prayers with sound science, qualified engineers and hard work.’ Everyone clapped in agreement.',
        alt: 'Villagers nod and applaud as Nana Ofori calls for combining faith-inspired unity with scientific engineering and shared action.',
        motif: '🙏🏿🛠️',
        brief: 'Close view at the durbar: villagers smiling and nodding in unity as Nana Ofori gestures toward a notebook and a map of the village held by the Water and Sanitation Management Team.',
        narration: 'Warm, dignified delivery affirming that faith inspires diligence, science and service.',
      },
      {
        text: 'The next day at school, Kwame and Esi’s science teacher demonstrated how a simple classroom filter made of gravel, clean sand and cloth could trap visible leaves and mud from a jar of dirty pond water. ‘Look, the water came out clearer!’ Kwame said. ‘Can people drink it now?’ ‘Never!’ said their teacher firmly. ‘That is a critical life-saving rule of science!’',
        alt: 'In the Primary 6 classroom, the teacher holds up a sand-and-cloth filter jar and warns students that clear-looking water is STILL not safe to drink.',
        motif: '🧪⚠️',
        brief: ' Ghanian Primary 6 science classroom: teacher holding a demonstration plastic bottle layered with pebbles, sand and cloth over a jar of water, holding up a warning hand while Kwame and Esi take notes.',
        narration: 'Emphasise strongly that a simple classroom sand/cloth filter does NOT make water safe to drink.',
      },
      {
        text: '‘A simple sand and cloth filter only traps large visible particles of dirt,’ the teacher explained. ‘It does NOT remove microscopic pathogens, invisible bacteria, viruses and parasites that cause typhoid, cholera and diarrhoea, and it cannot remove dissolved chemical contaminants! No one should ever drink water from an unverified filter or untreated stream. Safe drinking water requires professional engineering, disinfection and accredited laboratory testing.’',
        alt: 'A classroom wall chart compares large sand grains with microscopic bacteria and chemical molecules that pass right through a simple filter.',
        motif: '🔬🦠',
        brief: 'Science classroom chart (visual icons only, no text): large brown dirt particles trapped by sand grains at the top, while tiny glowing green microbe icons pass through into the bottom cup unless professionally treated and lab-tested.',
        narration: 'Crystal-clear scientific safety distinction between sediment filtration and pathogen/chemical removal.',
      },
      {
        text: 'That Friday, the Nsuom Water and Sanitation Management Team welcomed Engineer Asante, a licensed hydrogeologist from the Community Water and Sanitation Agency. Kwame and Esi watched from a safe distance as Engineer Asante used geophysical survey instruments to measure electrical resistance deep underground. ‘Beneath dry topsoil,’ Engineer Asante explained, ‘rainwater that soaked into the earth over many years sits in porous fractured rock layers called aquifers!’',
        alt: 'Engineer Asante uses geophysical survey cables and instruments on a grassy rise outside the village while Kwame, Esi and Nana Ofori observe.',
        motif: '📡🪨',
        brief: 'Grassy hillock outside the village: Engr. Asante (blue CWSA shirt, white hard hat) reading a portable digital geophysical resistivity meter connected to ground stakes, explaining an underground rock-layer diagram to Nana Ofori, Kwame and Esi.',
        narration: 'Exciting scientific discovery explaining aquifers and hydrogeology.',
      },
      {
        text: 'Engineer Asante chose a borehole site on high ground, far uphill from any household latrines, refuse pits or chemical storage so surface runoff could never seep into the well. ‘Good engineering prevents contamination before it starts,’ he told the students. Next, he presented the project budget to the community durbar: drilling the deep borehole, installing a solar-powered submersible pump, overhead storage tanks and four public standpipes would cost 100,000 Ghana cedis.',
        alt: 'Engineer Asante points to a site map showing the borehole on high ground far from latrines, alongside a solar-powered water tank design.',
        motif: '🗺️☀️',
        brief: 'Community meeting table: Engr. Asante pointing to a colour-coded site blueprint showing a solar borehole on a green hillock well separated from lower village buildings, with Kwame and Esi observing.',
        narration: 'Explain safe borehole siting and the 100,000-cedi project cost clearly.',
      },
      {
        text: 'The District Assembly and partner water agency approved a matching grant of 64,000 cedis, provided the community raised the remaining 36,000 cedis and proved how they would maintain the pump. Kwame and Esi helped the Water Committee treasurer check the arithmetic on the chalkboard: ‘Nsuom has 200 households. If each household contributes 15 cedis a month, 200 times 15 equals 3,000 cedis a month, and in 12 months, 3,000 times 12 equals 36,000 cedis!’',
        alt: 'At the community noticeboard, Kwame and Esi help the treasurer display the transparent contribution plan for 200 households.',
        motif: '🧮📋',
        brief: 'Village community centre veranda: the female treasurer, Nana Ofori, Kwame and Esi standing beside a large public ledger board with neat bar columns and receipt books (no readable text).',
        narration: 'Read the community budget math step by step: 200 × 15 = 3,000 cedis/month; × 12 = 36,000 cedis; + 64,000 grant = 100,000 cedis.',
      },
      {
        text: 'Every cedi was recorded in a public ledger book that any resident could inspect, and families who were elderly or facing hardship were supported by neighbours so no one was left out. When the drilling rig arrived, steel casings and a sanitary concrete apron sealed the top of the borehole so dirty surface water could never enter the deep aquifer.',
        alt: 'A professional drilling rig completes the sealed concrete apron and solar pump stand on the hill while villagers watch from behind a safety barrier.',
        motif: '🏗️🛡️',
        brief: 'Sunny hillside outside Nsuom: professional water technicians installing solar panels and a raised black water storage tank over a clean concrete-sealed borehole pad while villagers watch safely from a fenced path.',
        narration: 'Emphasise financial transparency, community compassion and sanitary engineering.',
      },
      {
        text: 'When clear groundwater pumped up from sixty metres below, nobody drank a drop yet! Engineer Asante collected sterile sample bottles and sent them to an accredited water-quality laboratory to test for bacteria such as E. coli, as well as pH, fluoride, iron and dissolved minerals. Only after the laboratory certificate confirmed the water met Ghana Standards Authority safe drinking-water standards, and the tank’s chlorination unit was set, did Engineer Asante declare the taps safe to open.',
        alt: 'Engineer Asante collects water in sterile laboratory sample bottles and later shows Nana Ofori the official laboratory safety certificate.',
        motif: '🧪✅',
        brief: 'At the new standpipe: Engr. Asante wearing nitrile gloves filling a sterile glass sample bottle from the tap, and holding a green-stamped laboratory certificate beside Nana Ofori (no readable text).',
        narration: 'Crucial safety lesson: clear groundwater must still pass accredited laboratory testing for microbes and chemicals before anyone drinks it.',
      },
      {
        text: 'To make sure the new system never broke down like the old hand-pump, the village set aside 500 cedis every month in a dedicated bank maintenance account and trained two local technicians to clean the solar panels and service the valves. On opening day, clean water flowed at four standpipes within walking distance of every compound, and children arrived at school on time every morning!',
        alt: 'Clean water flows from the new village standpipe as smiling adults and children fill clean containers and two local technicians inspect the solar panels.',
        motif: '💧🎉',
        brief: 'Joyful sunny scene in Nsuom: clear water pouring from a tiled four-tap standpipe into clean buckets while local technicians in tool belts check the solar array on the tank tower behind them and Kwame and Esi celebrate.',
        narration: 'Joyful celebration of sustainable maintenance and community success.',
      },
      {
        text: 'In his science notebook, Kwame wrote: What Would You Build, Discover or Change? ‘When we unite across our community, pray with thankful hearts, listen to qualified scientists and engineers, and manage public money honestly,’ Esi said, ‘no problem is too big to solve.’ What shared challenge in your school or neighbourhood could responsible teamwork, science and honest leadership help improve?',
        alt: 'Kwame and Esi wash their hands at the school standpipe and review their community water-stewardship notebook.',
        motif: '🌍🤲🏿',
        brief: 'Bright schoolyard morning: Kwame and Esi washing their hands with soap at a clean school tap fed by the village solar water tank, smiling warmly.',
        narration: 'Warm, inspiring closing reflection.',
      },
    ],
    activities: [
      {
        id: 'village-c1',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why is water that passes through a simple classroom sand-and-cloth filter STILL unsafe to drink?',
        options: [
          'Sand traps mud, but invisible bacteria, viruses and chemicals pass through',
          'Sand turns water into cooking oil',
          'Cloth filters make water too cold to swallow',
        ],
        correctIndex: 0,
        explanation: 'A simple sand/cloth filter only removes suspended sediment; safe drinking water requires professional treatment and accredited laboratory testing for pathogens and chemicals.',
      },
      {
        id: 'village-v1',
        type: 'vocabulary',
        afterPage: 6,
        word: 'aquifers',
        definition: 'Underground layers of water-bearing porous rock, sand or gravel from which groundwater can be pumped via a borehole',
        distractors: [
          'Clouds that float high above the ocean',
          'Plastic buckets used to carry rainwater',
        ],
      },
      {
        id: 'village-c2',
        type: 'comprehension',
        afterPage: 8,
        question: 'If 200 households contribute 15 cedis per month for 12 months, how much does the community raise toward the 100,000-cedi borehole project?',
        options: [
          '36,000 cedis (3,000 cedis/month × 12), matching the 64,000-cedi grant',
          '3,000 cedis in total',
          '150,000 cedis',
        ],
        correctIndex: 0,
        explanation: '200 × 15 = 3,000 cedis per month; 3,000 × 12 = 36,000 cedis, which combines with the 64,000-cedi grant to equal 100,000 cedis.',
      },
      {
        id: 'village-c3',
        type: 'comprehension',
        afterPage: 10,
        question: 'What did Engineer Asante do BEFORE allowing anyone to drink the clear groundwater from the new borehole?',
        options: [
          'He sent sterile samples to an accredited lab to test for microbes and safety',
          'He tasted the water himself with a wooden spoon',
          'He poured sand into the storage tank',
        ],
        correctIndex: 0,
        explanation: 'Even clear groundwater can contain invisible pathogens or excess minerals (like fluoride or iron), so accredited lab testing and disinfection are mandatory.',
      },
      {
        id: 'village-s1',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Order the steps Nsuom took to build a safe, lasting water supply.',
        items: [
          'Unite the village and consult a CWSA hydrogeologist to survey an aquifer.',
          'Raise transparent funds, drill a sealed borehole and pass lab water tests.',
          'Maintain a monthly repair fund and trained technicians so the pump lasts.',
        ],
      },
      {
        id: 'village-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'How did Nsuom show that faith, science and honest leadership work together rather than against each other?',
        feelingOptions: ['Proud', 'Inspired', 'Hopeful', 'Grateful'],
      },
    ],
    glossary: [
      { word: 'stewardship', definition: 'The responsible care, protection and honest management of resources entrusted to a person or community', pages: [3] },
      { word: 'pathogens', definition: 'Microscopic disease-causing organisms such as bacteria, viruses and parasites that cannot be seen with the naked eye', pages: [5] },
      { word: 'aquifers', definition: 'Underground layers of permeable rock or sediment that hold groundwater', pages: [6] },
      { word: 'accredited', definition: 'Officially certified as meeting strict scientific and quality standards for testing', pages: [5, 10] },
    ],
    teacherGuide: {
      overview:
        'A Primary 5 to JHS 1 science, civic-leadership and values story set in the fictional village of Nsuom. Learners see how faith in God inspires unity, diligence and service alongside scientific hydrogeology, strict water-safety rules (why classroom filters never make water drinkable), laboratory testing, transparent public budgeting and preventive maintenance.',
      lessonMinutes: 45,
      learningGoals: [
        'Explain why a simple sand-and-cloth filter only removes visible sediment and NEVER removes microscopic pathogens or dissolved chemicals.',
        'Describe how groundwater is stored in underground aquifers and why boreholes must be sited uphill from latrines, sealed and laboratory-tested.',
        'Calculate multi-step community project budgets (200 households × 15 cedis × 12 months = 36,000 cedis + 64,000 grant = 100,000 cedis).',
        'Explain how faith-inspired values, interfaith unity, scientific expertise and transparent public accounting work together to solve community problems.',
      ],
      subjectLinks: [
        { subject: 'Science (Upper Primary / JHS)', link: 'Water cycle, groundwater aquifers, filtration vs disinfection/purification, and waterborne diseases.', status: 'to-verify' },
        { subject: 'Social Studies / Our World Our People', link: 'Community development, religious tolerance, accountability and preventive maintenance.', status: 'to-verify' },
        { subject: 'Mathematics', link: 'Multi-step multiplication, addition and monthly reserve budgeting in Ghana cedis.', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners: "If a glass of water looks crystal clear, does that guarantee it is safe to drink? Why or why not?"',
        'Emphasise that in Ghana’s communities, people of different faiths live and work together in mutual respect.',
      ],
      whileReading: [
        'Pause at page 5 to stress the safety rule: NEVER drink water from a classroom sand filter or untreated stream.',
        'Pause at page 8 to verify the community contribution arithmetic on the board.',
      ],
      afterReading: [
        'Have learners design a simple "Preventive Maintenance Schedule" for a school asset (such as a Veronica bucket stand, school borehole, library books or classroom desks).',
      ],
      discussion: [
        'Why did Nana Ofori and the religious leaders say that waiting passively without planning or working is not true stewardship?',
        'Why did Engineer Asante refuse to let anyone drink the clear borehole water until the laboratory certificate arrived?',
        'Why did the old hand-pump stay broken for six months, and how did the new 500-cedi monthly maintenance fund prevent that mistake from happening again?',
      ],
      reflection: [
        'What Would You Build, Discover or Change? What shared facility in your school or neighbourhood needs better care or a maintenance plan, and how can students contribute safely?',
      ],
      mathsExtension: [
        {
          task: 'Nsuom puts 500 cedis per month into a bank maintenance account. After 24 months (2 years), how much has been saved, and if a replacement solar pump controller costs 4,200 cedis, how much remains in the maintenance fund after paying for the repair?',
          answer: 'Saved in 24 months: 500 × 24 = 12,000 cedis. Remaining after repair: 12,000 − 4,200 = 7,800 cedis.',
        },
        {
          task: 'In the 100,000-cedi borehole project, the grant covered 64,000 cedis and the community raised 36,000 cedis. What percentage of the total cost did the community raise?',
          answer: '(36,000 ÷ 100,000) × 100 = 36%.',
        },
      ],
      differentiation: {
        support: ['Draw the underground cross-section showing rain soaking into soil → porous rock aquifer → sealed borehole pipe → storage tank → tap.'],
        stretch: ['Research the roles of the Community Water and Sanitation Agency (CWSA) and the Ghana Standards Authority (GSA) in setting safe drinking-water standards (GS 175).'],
      },
      culturalNotes: [
        'In Ghanaian towns and villages, Water and Sanitation Management Teams (WSMTs) work with traditional authorities, Assembly Members and diverse religious communities to manage rural water systems.',
      ],
      localiseThis: [
        'Discuss where your school’s drinking and handwashing water comes from (GWCL pipe, CWSA borehole, sachet water, rainwater harvesting) and how it is kept safe.',
      ],
      discoveryStatus: {
        whatWeKnow: [
          'Simple mechanical filtration through gravel, sand and cloth removes suspended turbidity (sediment) but does NOT remove dissolved chemicals or microscopic pathogens (bacteria, viruses, protozoa).',
          'Safe rural drinking-water engineering requires hydrogeological siting, sanitary borehole sealing, accredited laboratory testing (microbiological and physicochemical under GSA GS 175 / WHO guidelines) and residual disinfection.',
          'Dedicated community maintenance funds and trained local technicians dramatically reduce rural borehole downtime.',
        ],
        whatWeAreStillDiscovering: [
          'Hydrogeologists in Ghana use satellite remote sensing and geophysical mapping to chart deep Basement Complex fracture aquifers resilient to multi-year droughts.',
        ],
      },
      investigation: {
        title: 'See Why Sediment Filtration Is Only Step One (Non-Drinkable Demo)',
        materials: [
          'A clear plastic bottle with the bottom cut off by the teacher',
          'Clean pebbles, coarse sand, fine sand and a piece of clean cotton cloth',
          'A jar of muddy water mixed with a drop of safe food colouring (to represent dissolved substances)',
        ],
        steps: [
          'Have the teacher secure the cloth over the bottle neck and layer pebbles, coarse sand and fine sand inside to model how soil layers trap large dirt particles.',
          'Pour the muddy coloured water through the sand layers into a clear cup below.',
          'Observe that while the brown mud particles are trapped by the sand, the food colouring (and any invisible microbes) passes right through into the cup!',
        ],
        whatToNotice:
          'The coloured water in the bottom cup proves that even when big mud particles are filtered out, dissolved substances and microscopic germs pass straight through, which is why classroom-filtered water must NEVER be drunk!',
        safetyNote: 'STRICT SAFETY RULE: Label the cup "DO NOT DRINK, SCIENCE DEMO ONLY" and pour the water on outdoor plants after the demonstration; wash hands with soap and safe running water.',
      },
      factCheck: [
        {
          claim: 'A simple sand-and-cloth filter removes suspended sediment but does not make water microbiologically or chemically safe to drink.',
          explanation: 'Pore spaces in simple sand and cloth filters (typically >10–50 micrometres) are far larger than bacteria (~0.5–5 micrometres), viruses (~0.02–0.3 micrometres) and dissolved ions (fluoride, arsenic, nitrates), requiring disinfection and laboratory verification.',
          reference: 'World Health Organization (WHO) Guidelines for Drinking-water Quality; Ghana Standards Authority GS 175.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Warm, respectful Ghanaian English storyteller; wise, unifying tone for Nana Ofori and clear scientific authority for Engr. Asante.',
      pace: 'Steady Upper Primary / JHS pace (~120 words per minute).',
      notes: ['Pronounce Kwame as KWAH-meh, Esi as EH-see, and Ofori as oh-FOH-ree.'],
    },
    music: 'Optional gentle piano underscore.',
    culturalNotes: [
      'Affirms faith in God as a source of unity, gratitude and service while respecting Ghana’s religious diversity and upholding strict scientific standards for safe water.',
    ],
    reviewQuestions: [
      'Does the story clearly warn that a classroom sand filter does NOT remove pathogens or chemicals?',
      'Are all community budget numbers (200 × 15 × 12 = 36,000 + 64,000 = 100,000 cedis) consistent throughout?',
    ],
  },
];
