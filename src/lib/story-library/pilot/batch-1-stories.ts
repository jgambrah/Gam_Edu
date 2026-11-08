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

export const BATCH_1_STORIES: PilotStory[] = [
  // ====================================================================================================================
  // 1. Abena and the Beginning of Everything (JHS 1-2, 12 pages, Astronomy & Cosmology)
  // ====================================================================================================================
  {
    key: 'abena-and-the-beginning-of-everything',
    set: 'extension',
    title: 'Abena and the Beginning of Everything',
    summary:
      'Visiting the Ghana Radio Astronomy Observatory at Kuntunse, Abena explores how space itself expands, what evidence supports the Big Bang, and which cosmic questions scientists are still working to answer.',
    classification: base({
      classIds: ['jhs-1', 'jhs-2'],
      ageMin: 12,
      ageMax: 14,
      readingLevel: 'proficient',
      difficulty: 4,
      genres: ['science', 'realistic-fiction', 'educational'],
      themes: ['night-sky', 'technology', 'school'],
      objectives: ['scientific-curiosity', 'critical-thinking', 'inference', 'reading-comprehension', 'vocabulary'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 420,
    }),
    palette: ['#0f172a', '#f59e0b'],
    characters: [
      'Abena: a thirteen-year-old Ghanaian JHS girl with neat cornrows tied with a blue band, bright curious eyes, wearing a navy-and-white school science club polo shirt and carrying a yellow notebook.',
      'Dr Mensah: a warm Ghanaian astrophysicist in his forties with short salt-and-pepper hair, rectangular glasses, and a teal collared shirt with an observatory lanyard.',
      'Kwame: Abena’s twelve-year-old classmate, enthusiastic and quick to ask questions, wearing the same navy-and-white science club polo shirt.',
    ],
    pages: [
      {
        text: 'As dusk settled over the green hills of Kuntunse near Accra, thirteen-year-old Abena tilted her head back. Above her stood the giant white dish of the Ghana Radio Astronomy Observatory, thirty-two metres wide, pointing silently toward the first bright stars.',
        alt: 'Abena and Kwame stand with Dr Mensah at dusk before the giant white thirty-two-metre radio telescope dish at Kuntunse.',
        motif: '📡🌌',
        brief: 'Dusk at Kuntunse observatory. Abena (13, cornrows with blue band, navy science club shirt, yellow notebook) and Kwame looking up at the giant 32-metre white radio telescope dish with Dr Mensah beside them.',
        narration: 'Warm, wondering, unhurried. Let the scale of the thirty-two-metre dish feel awe-inspiring.',
      },
      {
        text: '‘Dr Mensah,’ Abena asked, opening her yellow notebook, ‘our textbook says the universe began with the Big Bang. When I hear those words, I picture a giant bomb exploding in the middle of an empty dark room. Is that what happened?’',
        alt: 'Abena holds open her yellow notebook and asks Dr Mensah a question while Kwame listens.',
        motif: '📓🤔',
        brief: 'Close medium shot of Abena holding her open yellow notebook and pencil, asking Dr Mensah a question under the warm porch light of the observatory visitor room.',
        narration: 'Curious and thoughtful for Abena. Pause slightly before her question.',
      },
      {
        text: 'Dr Mensah smiled and shook his head gently. ‘That is the most common misunderstanding in astronomy, Abena. The Big Bang was not an explosion from one point into empty space that was already sitting there. Before it, there was no empty room waiting outside. Instead, space itself began to expand everywhere at once.’',
        alt: 'Dr Mensah gestures with both hands to explain that space itself expands everywhere, while Abena and Kwame listen intently.',
        motif: '🙌✨',
        brief: 'Dr Mensah smiling warmly, gesturing outward with both hands as he explains expansion to Abena and Kwame inside the observatory room with star charts on the wall (no text).',
        narration: 'Clear, calm, and emphatic on "not an explosion from one point into empty space" and "space itself began to expand".',
      },
      {
        text: 'He picked up a loaf of uncut raisin bread from the snack table. ‘Imagine unbaked dough with raisins mixed all through it,’ he said. ‘As the dough rises, every raisin moves farther from every other raisin, not because the raisins are flying through the dough, but because the dough between them is stretching.’',
        alt: 'Dr Mensah holds a loaf of raisin bread at a table, pointing out how raisins sit inside the dough.',
        motif: '🍞🍇',
        brief: 'Dr Mensah holding a warm golden loaf of raisin bread at the table, pointing to raisins spaced inside the bread while Abena and Kwame lean in closely.',
        narration: 'Playful and clear. Emphasise "because the dough between them is stretching".',
      },
      {
        text: '‘In our universe,’ Dr Mensah continued, ‘the raisins are like galaxies, vast islands of billions of stars, gas and dust held together by gravity. Our own home galaxy, the Milky Way, is one of them. Gravity keeps each galaxy together so it does not stretch, while the space between distant galaxies keeps expanding.’',
        alt: 'A glowing visual model on a screen shows spiral galaxies in deep space moving apart as the grid of space stretches between them.',
        motif: '🌀🌌',
        brief: 'Dr Mensah pointing to a large glowing display screen showing spiral galaxies in deep indigo space while Abena sketches in her yellow notebook.',
        narration: 'Steady and clear. Pause briefly after "vast islands of billions of stars".',
      },
      {
        text: 'Kwame raised his hand. ‘How do scientists know space is really stretching? Nobody was there billions of years ago to watch!’ Dr Mensah nodded. ‘Science relies on evidence we can measure today. First, when we study light from distant galaxies, we see that the light waves have been stretched toward the red end of the spectrum.’',
        alt: 'Kwame raises his hand beside Abena while Dr Mensah shows a colourful rainbow prism spectrum and stretched light waves.',
        motif: '🌈🔭',
        brief: 'Kwame raising his hand eagerly; Dr Mensah holding a glass prism casting a rainbow band onto a white card to illustrate light waves.',
        narration: 'Lively for Kwame, then measured and explanatory for Dr Mensah.',
      },
      {
        text: '‘We call this redshift,’ said Dr Mensah. ‘In the nineteen-twenties, astronomers discovered that the farther away a galaxy is, the more its light is stretched and the faster it recedes from us. If galaxies are moving apart today, then running the cosmic film backward tells us they were much closer together in the past.’',
        alt: 'Abena draws wavy lines in her yellow notebook showing short blue waves stretching into longer red waves.',
        motif: '〰️🔴',
        brief: 'Over-the-shoulder view of Abena’s hand drawing simple blue and red wavy lines in her yellow notebook (no words or letters), with Dr Mensah smiling beside her.',
        narration: 'Thoughtful, building the logical chain step by step.',
      },
      {
        text: '‘Is redshift the only clue?’ asked Abena. ‘No,’ said Dr Mensah, pointing up at the Kuntunse dish. ‘In the early universe, about thirteen point eight billion years ago, everything was an extremely hot, dense sea of particles and light. As space expanded, that sea cooled down.’',
        alt: 'Through the window, the giant white Kuntunse radio telescope dish gleams against a deep indigo sky filled with stars.',
        motif: '🌡️🌠',
        brief: 'Dr Mensah, Abena and Kwame standing on the observatory balcony; Dr Mensah points toward the giant white dish under a starry indigo night sky.',
        narration: 'Slow and clear on "thirteen point eight billion years ago".',
      },
      {
        text: '‘After about three hundred and eighty thousand years,’ Dr Mensah explained, ‘the universe cooled enough for atoms of hydrogen and helium to form. Light could finally travel freely through space. Today, radio telescopes still detect that ancient, cooled afterglow coming from every direction in the sky. We call it the Cosmic Microwave Background.’',
        alt: 'An all-sky oval map of soft golden and blue speckles glows on a monitor as Abena and Kwame study it in wonder.',
        motif: '🗺️✨',
        brief: 'Observatory control room: a monitor displays a speckled oval all-sky map in soft gold, teal and blue (no text), while Abena and Kwame look at it with wonder.',
        narration: 'Expressive wonder on "ancient, cooled afterglow" and clear pronunciation of "Cosmic Microwave Background".',
      },
      {
        text: '‘Over hundreds of millions of years, gravity pulled clouds of that hydrogen and helium together to ignite the first stars,’ said Dr Mensah. ‘Inside their fiery cores, stars forged heavier elements like carbon, oxygen and iron. Every atom of iron in your blood was once forged inside an ancient star.’',
        alt: 'Abena looks down at her own hand in amazement while a glowing star nursery nebula shines on the screen behind her.',
        motif: '⭐🖐️',
        brief: 'Abena looking at her own hand with quiet amazement, backlit by a warm golden-and-amber stellar nebula image on the observatory wall screen.',
        narration: 'Gentle awe. Pause after "Every atom of iron in your blood was once forged inside an ancient star."',
      },
      {
        text: '‘Can our telescopes see the whole universe?’ Kwame asked. ‘Only the observable universe,’ Dr Mensah replied. ‘Because light takes time to travel, we can only see regions whose light has had time to reach Earth since the Big Bang. And as for the very first instant, what sparked the expansion, or what dark matter and dark energy truly are, those remain open questions.’',
        alt: 'Dr Mensah, Abena and Kwame look through a small optical telescope on the terrace under a vast starry sky.',
        motif: '🔭❓',
        brief: 'On the outdoor terrace at night, Abena peers through a small optical telescope while Kwame and Dr Mensah stand beside her under a rich band of Milky Way stars.',
        narration: 'Honest, humble scientific tone. Emphasise "observable universe" and "remain open questions".',
      },
      {
        text: 'Abena closed her yellow notebook and looked up at the Milky Way arching over Kuntunse. Science was not a book of finished answers; it was a growing map built from careful evidence. ‘Good,’ she said with a smile. ‘That means there is still plenty left for us to discover.’ The end.',
        alt: 'Abena smiles up at the glowing Milky Way above the Kuntunse radio telescope dish, holding her yellow notebook to her chest.',
        motif: '🌌😊',
        brief: 'Wide cinematic night shot: Abena smiling up at the glowing band of the Milky Way above the Kuntunse radio telescope dish, holding her yellow notebook, Kwame and Dr Mensah beside her.',
        narration: 'Warm, confident, inspiring conclusion. Pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'abena-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why is picturing the Big Bang as a bomb exploding in an empty room inaccurate?',
        options: [
          'Space itself expanded everywhere rather than matter exploding into empty space',
          'The explosion happened inside a single giant star',
          'The universe has always stayed the exact same size',
        ],
        correctIndex: 0,
        explanation: 'The Big Bang was the rapid expansion of space itself everywhere, not an explosion into pre-existing empty space.',
      },
      {
        id: 'abena-v1',
        type: 'vocabulary',
        afterPage: 5,
        word: 'galaxies',
        definition: 'Vast systems of billions of stars, gas and dust held together by gravity.',
        distractors: ['Small rocks that burn up in Earth’s atmosphere', 'Instruments used to measure air temperature'],
      },
      {
        id: 'abena-c2',
        type: 'comprehension',
        afterPage: 7,
        question: 'What does the redshift of light from distant galaxies show scientists?',
        options: [
          'Light waves stretch as space expands, showing distant galaxies are moving apart',
          'Distant galaxies are painted red by interstellar dust',
          'All galaxies are rushing toward the Milky Way',
        ],
        correctIndex: 0,
        explanation: 'As space expands, light waves travelling across it are stretched toward the red end of the spectrum.',
      },
      {
        id: 'abena-c3',
        type: 'comprehension',
        afterPage: 9,
        question: 'What is the Cosmic Microwave Background that radio telescopes detect?',
        options: [
          'The cooled afterglow light from the early hot universe',
          'Signals sent by microwave ovens on Earth',
          'Light reflected from the surface of the Moon',
        ],
        correctIndex: 0,
        explanation: 'It is the cooled remnant radiation from when the early universe first became transparent to light.',
      },
      {
        id: 'abena-c4',
        type: 'comprehension',
        afterPage: 11,
        question: 'Which of these is still an unresolved question in cosmology today?',
        options: [
          'What happened at the very earliest instant and what dark energy truly is',
          'Whether light takes time to travel through space',
          'Whether the Milky Way is a galaxy',
        ],
        correctIndex: 0,
        explanation: 'While expansion from an early hot, dense state is strongly supported, the very first instant and dark energy remain open research questions.',
      },
      {
        id: 'abena-pred',
        type: 'prediction',
        afterPage: 11,
        prompt: 'Why is it important for scientists to separate well-tested evidence from questions that are not yet solved?',
      },
      {
        id: 'abena-seq',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Put these cosmic events in order from earliest to latest.',
        items: [
          'The early universe expands from an extremely hot, dense state.',
          'The universe cools enough for hydrogen and helium atoms to form.',
          'Gravity pulls gas clouds together to ignite the first stars.',
          'Stars forge heavier elements like carbon, oxygen and iron.',
        ],
      },
      {
        id: 'abena-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'How does learning about the size and history of the universe make you feel about asking big questions?',
        feelingOptions: ['Curious', 'Inspired', 'Thoughtful', 'Amazed'],
      },
    ],
    glossary: [
      { word: 'observatory', definition: 'A place with special telescopes used to study the sky and space.', pages: [1] },
      { word: 'expand', definition: 'To grow larger or stretch out over a wider space.', pages: [3] },
      { word: 'galaxies', definition: 'Vast islands of billions of stars, gas and dust held together by gravity.', pages: [5, 6, 7] },
      { word: 'gravity', definition: 'The natural force of attraction that pulls objects with mass toward one another.', pages: [5, 10] },
      { word: 'redshift', definition: 'The stretching of light waves toward the red end of the spectrum as space expands.', pages: [7, 8] },
      { word: 'elements', definition: 'Basic building-block substances of matter, such as hydrogen, carbon and iron.', pages: [10] },
      { word: 'observable', definition: 'Able to be seen or detected; the observable universe is the part whose light has reached us.', pages: [11] },
    ],
    teacherGuide: {
      overview:
        'Set at the real Ghana Radio Astronomy Observatory at Kuntunse, this story introduces JHS learners to modern cosmology: the expansion of space, galaxies, stellar nucleosynthesis, the observable universe, the three pillars of Big Bang evidence, and the boundary between established evidence and open scientific questions.',
      lessonMinutes: 45,
      learningGoals: [
        'Explain why the Big Bang is an expansion of space itself everywhere rather than an explosion from one point into empty space.',
        'Describe key scientific evidence for cosmic expansion: redshift of distant galaxies, the Cosmic Microwave Background, and primordial hydrogen and helium.',
        'Distinguish between the observable universe and the entire universe.',
        'Distinguish well-supported scientific findings from unresolved questions at the frontier of physics.',
      ],
      subjectLinks: [
        { subject: 'Science (JHS)', link: 'Solar system, stars, galaxies and the universe; nature of scientific evidence.', status: 'to-verify' },
        { subject: 'English Language (JHS)', link: 'Informational and narrative comprehension, scientific vocabulary, critical discussion.', status: 'to-verify' },
        { subject: 'Social Studies / Career Technology', link: 'Science and technology infrastructure in Ghana (Kuntunse Observatory).', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners: "When you look at the night sky, how long do you think starlight takes to reach your eyes?"',
        'Locate Kuntunse (near Accra) on a map of Ghana and introduce the 32-metre Ghana Radio Astronomy Observatory.',
      ],
      whileReading: [
        'Pause after page 4 to examine the raisin-bread analogy: ask what the dough represents (space) and what the raisins represent (galaxies).',
        'Pause after page 9 to connect redshift and the Cosmic Microwave Background as two independent lines of evidence.',
      ],
      afterReading: [
        'Have learners draw a timeline of the four cosmic stages from the sequencing activity.',
        'Discuss why saying "we do not know yet" is a strength, not a weakness, in science.',
      ],
      discussion: [
        'Where does the raisin-bread analogy work well, and where does it break down? (Unlike a loaf of bread, the universe has no outer crust or kitchen outside it.)',
        'Why do galaxies like the Milky Way not get stretched apart as space expands? (Local gravity binds a galaxy together.)',
        'Why can we only see the observable universe and not beyond it?',
      ],
      reflection: [
        'What is one question about space or nature that you would love to investigate as a scientist or engineer?',
        'How does checking evidence help us avoid misunderstandings in everyday life as well as in science?',
      ],
      mathsExtension: [
        {
          task: 'Light travels about 300,000 km per second. How far does light travel in 10 seconds?',
          answer: '300,000 × 10 = 3,000,000 km (three million kilometres).',
        },
        {
          task: 'The Kuntunse radio dish has a diameter of 32 metres. What is its radius?',
          answer: '32 ÷ 2 = 16 metres.',
        },
      ],
      differentiation: {
        support: [
          'Use a lightly inflated balloon with paper stickers (representing galaxies) so learners see the stickers move apart without the stickers themselves growing.',
        ],
        stretch: [
          'Write a short paragraph explaining how a scientist uses both optical telescopes and radio telescopes to study the universe.',
        ],
      },
      culturalNotes: [
        'Abena (girl born on Tuesday) and Kwame (boy born on Saturday) are Akan day names; Mensah is a common Ghanaian surname.',
        'The Ghana Radio Astronomy Observatory at Kuntunse was converted from a former satellite telecommunications dish and inaugurated in 2017 as part of the African Very Long Baseline Interferometry Network (AVN) and Square Kilometre Array (SKA) partnership.',
      ],
      localiseThis: [
        'Connect night-sky observation to clear dry-season evenings in your community and discuss how street lighting affects how many stars we see.',
      ],
      factCheck: [
        {
          claim: 'The Big Bang was an expansion of space everywhere from an extremely hot, dense state ~13.8 billion years ago, not an explosion from a single point into pre-existing empty space.',
          explanation: 'General relativity and cosmological observations (Planck collaboration, 2018) show metric expansion of space itself with an age of 13.787 ± 0.020 billion years.',
          analogyNote: 'The rising raisin-bread analogy illustrates uniform expansion between unbound galaxy clusters, but teachers should note that galaxies themselves stay bound by gravity and real space has no external "oven" or boundary.',
          reference: 'NASA Wilkinson Microwave Anisotropy Probe (WMAP) & ESA Planck Mission Cosmology Overview; IAU Office of Astronomy for Education.',
        },
        {
          claim: 'Redshift of distant galaxies, the Cosmic Microwave Background (released ~380,000 years after the Big Bang), and light-element abundances are the primary observational pillars of Big Bang cosmology.',
          explanation: 'Cosmological redshift stretches photon wavelengths as the scale factor increases; recombination at ~380,000 years released the CMB now observed at 2.725 K.',
          reference: 'Peebles, P. J. E. (2020), Principles of Physical Cosmology; NASA Goddard Space Flight Center CMB Education Resources.',
        },
        {
          claim: 'What happened at t = 0 (the Planck epoch) and the exact nature of dark matter and dark energy remain unresolved scientific questions.',
          explanation: 'Current physics requires a unified theory of quantum gravity to describe t = 0, and dark matter/dark energy remain active areas of empirical investigation.',
          reference: 'National Academy of Sciences, Science, Evolution, and Creationism / Cosmology FAQ.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Mature, engaging Ghanaian English storyteller (Kore). Clear, unhurried scientific phrasing.',
      pace: 'Medium (about 130 words per minute).',
      notes: [
        'Emphasise the contrast between an explosion in space and the expansion of space itself.',
        'Pronounce Kuntunse, Abena, Kwame and Mensah naturally.',
      ],
    },
    music: 'Optional low-key soft piano ambience (user-togglable in reader header; off by default).',
    culturalNotes: [
      'Features the real Ghana Radio Astronomy Observatory at Kuntunse to show Ghanaian participation in world-class space science.',
    ],
    reviewQuestions: [
      'Confirm that the raisin-bread analogy and its limitations are clear for JHS 1–2 learners.',
      'Verify NaCCA JHS Science strand wording with a curriculum specialist.',
    ],
  },

  // ====================================================================================================================
  // 2. Kojo and the Forest of a Thousand Lives (Primary 3-4, 10 pages, Biodiversity & Ecology)
  // ====================================================================================================================
  {
    key: 'kojo-and-the-forest-of-a-thousand-lives',
    set: 'extension',
    title: 'Kojo and the Forest of a Thousand Lives',
    summary:
      'Walking through Kakum National Park with his aunt, Ranger Akosua, Kojo discovers how giant trees, cocoa midges, fruit bats, monkeys and tiny decomposers depend on one another in a living food web.',
    classification: base({
      classIds: ['primary-3', 'primary-4'],
      ageMin: 8,
      ageMax: 10,
      readingLevel: 'developing',
      difficulty: 3,
      genres: ['science', 'nature', 'educational'],
      themes: ['animals-and-habitats', 'farm-and-garden', 'community'],
      objectives: ['environmental-awareness', 'scientific-curiosity', 'vocabulary', 'reading-comprehension', 'reasoning'],
      ghanaianContext: 'central',
      culturalTags: ['local-names', 'village-life'],
      estimatedDurationSec: 300,
    }),
    palette: ['#dcfce7', '#15803d'],
    characters: [
      'Kojo: a nine-year-old Ghanaian boy with short curly hair, bright observant eyes, wearing a yellow t-shirt, khaki shorts, sturdy walking shoes, and a small green field notebook.',
      'Ranger Akosua: Kojo’s aunt, a wildlife ranger in her thirties wearing a neat olive-green ranger shirt, bush hat, and binoculars around her neck.',
      'Papa Kwesi: a friendly neighbouring cocoa farmer in a checked work shirt who greets them at the forest edge.',
    ],
    pages: [
      {
        text: 'Early morning mist curled through the tall trees of Kakum National Park in Ghana’s Central Region. Nine-year-old Kojo walked beside his aunt, Ranger Akosua, clutching his green notebook. ‘Auntie Akosua,’ he asked, ‘why do we protect all these wild bushes and insects when only the big trees give us shade?’',
        alt: 'Kojo walks along a misty rainforest trail in Kakum National Park beside Ranger Akosua.',
        motif: '🌳🥾',
        brief: 'Morning mist in Kakum rainforest. Kojo (9, yellow t-shirt, khaki shorts, green notebook) walking on a forest path beside Ranger Akosua (olive-green ranger uniform, bush hat, binoculars).',
        narration: 'Fresh morning energy. Curious tone for Kojo’s question.',
      },
      {
        text: 'Ranger Akosua paused beside a giant odum tree whose trunk rose like a pillar toward the sky. ‘A forest is not just a collection of big trees, Kojo,’ she said. ‘It is a community of habitats, the natural homes where thousands of living things shelter, feed and help one another survive.’',
        alt: 'Ranger Akosua touches the buttress roots of a giant odum tree while Kojo looks up at its high canopy.',
        motif: '🌲👀',
        brief: 'Ranger Akosua touching the massive buttress roots of a tall odum rainforest tree while Kojo gazes up into the sunlit green canopy.',
        narration: 'Warm and steady. Emphasise "habitats".',
      },
      {
        text: 'At the edge of the park, they passed Papa Kwesi’s shady cocoa farm. Tiny pale flowers grew right on the trunk of a cocoa tree. ‘Look closely,’ whispered Ranger Akosua. ‘Tiny flies called midges visit those flowers. As they drink nectar, they carry pollen from flower to flower. Without pollination by those tiny insects, no cocoa pods would grow!’',
        alt: 'Kojo and Ranger Akosua look closely at tiny white cocoa flowers on a cocoa tree trunk near Papa Kwesi.',
        motif: '🍫🌸',
        brief: 'Close view of a cocoa tree trunk with small pale flowers and golden cocoa pods; Ranger Akosua and Kojo peering closely while Papa Kwesi smiles nearby.',
        narration: 'Quiet amazement. Slow and clear on "pollination".',
      },
      {
        text: 'Higher up on the canopy walkway, sunlight sparkled on millions of green leaves. ‘Every food web in the forest starts here,’ said Ranger Akosua. ‘Green plants are producers. They use sunlight, water and air to make their own food, and they release the oxygen we breathe.’',
        alt: 'Kojo and Ranger Akosua stand safely on the Kakum canopy rope walkway among sunlit green treetops.',
        motif: '☀️🍃',
        brief: 'On the Kakum canopy walkway high in the sunlit treetops, Ranger Akosua points to glowing green leaves while Kojo holds the safety rail and smiles.',
        narration: 'Bright and uplifting. Clear emphasis on "producers".',
      },
      {
        text: 'Suddenly, the branches rustled! A troop of Diana monkeys with white throat fur leaped across the boughs, munching wild figs, while a yellow-casqued hornbill glided past. ‘And at dusk,’ said Ranger Akosua, ‘straw-coloured fruit bats fly out to eat fruit and drop seeds far and wide, planting new forest trees.’',
        alt: 'Diana monkeys eat figs in the canopy branches while a hornbill flies pastKojo and Ranger Akosua.',
        motif: '🐒🦇',
        brief: 'In the lush rainforest canopy, two Diana monkeys with distinctive white chest/beard fur eat wild figs on a branch while a large hornbill bird glides across the background.',
        narration: 'Lively and vivid. Pause briefly after "Suddenly, the branches rustled!"',
      },
      {
        text: '‘What about predators?’ asked Kojo. Ranger Akosua pointed to a green tree frog resting on a broad leaf and a crowned eagle circling high above. ‘Frogs eat beetles and flies, snakes and birds hunt frogs, and eagles hunt in the treetops. All these overlapping food chains join together into a food web.’',
        alt: 'A green rainforest frog sits on a wide leaf in the foreground while a crowned eagle circles high above the canopy.',
        motif: '🐸🦅',
        brief: 'Split-focus rainforest scene: a bright green tree frog on a glossy leaf in the foreground, with Kojo and Ranger Akosua looking up toward a crowned eagle soaring above the treetops.',
        narration: 'Clear explanation, showing how each creature connects in the food web.',
      },
      {
        text: 'Back down on the cool, shaded forest floor, Kojo stepped over a fallen wawa log covered in bracket fungi, millipedes and busy termites. ‘Why doesn’t the forest floor pile up to the sky with dead leaves and old branches?’ he wondered aloud.',
        alt: 'On the shaded forest floor, Kojo kneels beside a mossy fallen log covered with cream bracket mushrooms and a millipede.',
        motif: '🍄🪵',
        brief: 'On the damp shaded forest floor, Kojo kneels with his notebook beside a fallen log covered in cream-and-orange bracket fungi, moss, and a brown millipede.',
        narration: 'Curious and observant.',
      },
      {
        text: '‘Because of the decomposers!’ said Ranger Akosua, kneeling beside the log. ‘Fungi, termites, millipedes and tiny bacteria break down dead leaves and wood. Decomposition turns dead matter back into rich nutrients in the soil, feeding the roots of young saplings.’',
        alt: 'Ranger Akosua points to tiny green seedlings sprouting from rich dark soil beside the decomposing log.',
        motif: '🌱🔄',
        brief: 'Close view of Ranger Akosua and Kojo pointing at tiny green tree seedlings sprouting from dark rich humus soil right beside the mushroom-covered log.',
        narration: 'Warm and appreciative of the tiny recyclers. Clear on "decomposers" and "decomposition".',
      },
      {
        text: 'By a clear forest stream, Ranger Akosua showed Kojo deep, round footprints in the mud made by a forest elephant. ‘When people cut down too many trees or pollute streams, the balance breaks,’ she said softly. ‘Animals lose their habitats, soil washes away, and even the cocoa farms lose their pollinators and rain.’',
        alt: 'Beside a clear forest stream, Kojo and Ranger Akosua examine large round elephant footprints in the soft mud.',
        motif: '🐘💧',
        brief: 'Beside a clear sunlit rainforest stream, Ranger Akosua and Kojo crouch to look at large round forest elephant footprints in the damp bank.',
        narration: 'Gentle, serious, caring tone.',
      },
      {
        text: 'Kojo drew a circle in his green notebook: sunlight to leaves, insects to flowers, bats to seeds, and fungi back to the soil. ‘Nothing in the forest lives alone,’ he said. ‘Protecting the big trees means protecting the smallest midges and mushrooms too.’ Ranger Akosua smiled. ‘Now you think like a ranger.’ The end.',
        alt: 'Kojo shows Ranger Akosua his notebook drawing of the connected forest cycle at the park entrance.',
        motif: '📗🌿',
        brief: 'At the sunlit forest edge, Kojo proudly holds up his open green notebook showing a simple circle of nature drawings (sun, leaf, flower, mushroom, no text) to a beaming Ranger Akosua.',
        narration: 'Proud, warm, and satisfying conclusion. Pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'kojo-v1',
        type: 'vocabulary',
        afterPage: 2,
        word: 'habitats',
        definition: 'Natural homes where plants and animals find shelter, food and water.',
        distractors: ['wooden bridges built across roads', 'baskets used to carry cocoa beans'],
      },
      {
        id: 'kojo-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'How do tiny midges help Papa Kwesi’s cocoa trees?',
        options: [
          'They carry pollen between cocoa flowers so cocoa pods can grow',
          'They eat the tough shells of ripe cocoa pods',
          'They chop down dead branches in the night',
        ],
        correctIndex: 0,
        explanation: 'Midges pollinate the small cocoa flowers; without pollination, the trees cannot produce cocoa pods.',
      },
      {
        id: 'kojo-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why are green plants called producers in a food web?',
        options: [
          'They use sunlight, water and air to make their own food',
          'They hunt insects in the dark',
          'They only grow on top of rocks',
        ],
        correctIndex: 0,
        explanation: 'Green plants produce food using energy from sunlight through photosynthesis.',
      },
      {
        id: 'kojo-c3',
        type: 'comprehension',
        afterPage: 8,
        question: 'What job do decomposers like fungi, termites and bacteria do on the forest floor?',
        options: [
          'They break down dead leaves and wood into rich nutrients for the soil',
          'They block sunlight from reaching the canopy',
          'They scare away forest elephants',
        ],
        correctIndex: 0,
        explanation: 'Decomposers recycle dead plant and animal material back into soil nutrients that feed new plants.',
      },
      {
        id: 'kojo-pred',
        type: 'prediction',
        afterPage: 9,
        prompt: 'What would happen to farms and streams near a forest if all the trees and insects disappeared?',
      },
      {
        id: 'kojo-seq',
        type: 'sequencing',
        afterPage: 10,
        prompt: 'Put these steps of the forest nutrient cycle in order.',
        items: [
          'Green leaves use sunlight to grow high in the canopy.',
          'Animals eat fruits and drop seeds across the forest.',
          'Old leaves and branches fall to the forest floor.',
          'Fungi and termites break down the dead wood into rich soil for new saplings.',
        ],
      },
      {
        id: 'kojo-sel',
        type: 'sel',
        afterPage: 10,
        prompt: 'What is one living thing near your school or home that you can help protect?',
        feelingOptions: ['Caring', 'Curious', 'Responsible', 'Thankful'],
      },
    ],
    glossary: [
      { word: 'habitats', definition: 'The natural homes where plants and animals live and grow.', pages: [2, 9] },
      { word: 'pollination', definition: 'Moving pollen from one flower to another so seeds and fruit can form.', pages: [3] },
      { word: 'producers', definition: 'Green plants that make their own food using sunlight, water and air.', pages: [4] },
      { word: 'predators', definition: 'Animals that hunt and eat other animals for food.', pages: [6] },
      { word: 'decomposers', definition: 'Living things like fungi, termites and bacteria that break down dead matter.', pages: [8] },
      { word: 'nutrients', definition: 'Nourishing substances in soil or food that help living things grow.', pages: [8] },
    ],
    teacherGuide: {
      overview:
        'Set in and around Kakum National Park in Ghana’s Central Region, this story introduces Primary 3–4 learners to habitats, producers, pollination (cocoa midges), seed dispersal (straw-coloured fruit bats and Diana monkeys), food webs, decomposition, and forest conservation.',
      lessonMinutes: 40,
      learningGoals: [
        'Identify different forest habitats (canopy, forest floor, stream) and the Ghanaian organisms that live in them.',
        'Explain how producers, pollinators, seed dispersers, predators and decomposers depend on one another in a food web.',
        'Describe how protecting forests supports nearby farms, clean streams and soil health.',
      ],
      subjectLinks: [
        { subject: 'Science (Primary 3–4)', link: 'Living things, habitats, food chains/webs and caring for the environment.', status: 'to-verify' },
        { subject: 'Our World Our People (Primary 3–4)', link: 'Protecting forests, water bodies and agricultural livelihoods in Ghana.', status: 'to-verify' },
        { subject: 'English Language (Primary 3–4)', link: 'Reading comprehension, nature vocabulary and oral discussion.', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask: "Have you ever seen a mushroom growing on an old log or insects visiting flowers? What were they doing?"',
        'Show where Kakum National Park is in Ghana’s Central Region.',
      ],
      whileReading: [
        'After page 3, ask learners why cocoa farmers need tiny insects in the leaf litter near their trees.',
        'After page 8, ask how fungi and termites act as the forest’s cleaning and recycling team.',
      ],
      afterReading: [
        'Take a 10-minute walk around the school compound to spot one producer (plant), one pollinator (insect/bird), and one decomposer (ant/millipede/fungus, look, do not touch).',
      ],
      discussion: [
        'Why did Kojo at first think only the big trees mattered?',
        'What would happen to young tree saplings if there were no fungi, termites or bacteria on the forest floor?',
        'How does a healthy forest help farmers like Papa Kwesi who live near the park?',
      ],
      reflection: [
        'Why do even the smallest creatures in a community deserve care and respect?',
        'What can our class do to keep trees and soil healthy around our school?',
      ],
      mathsExtension: [
        {
          task: 'Kojo counted 8 Diana monkeys in one odum tree and 6 in a wawa tree. How many monkeys did he see in all?',
          answer: '8 + 6 = 14 Diana monkeys.',
        },
        {
          task: 'A cocoa tree had 24 pods. Papa Kwesi harvested 15 ripe pods. How many pods were left on the tree?',
          answer: '24 − 15 = 9 pods.',
        },
      ],
      differentiation: {
        support: ['Draw a simple 3-step chain (Sunlight → Fig Tree → Diana Monkey) before adding decomposers.'],
        stretch: ['Draw a 6-organism Kakum food web with arrows showing how energy and nutrients move.'],
      },
      culturalNotes: [
        'Kojo (boy born on Monday) and Akosua (girl born on Sunday) are Akan day names; Kwesi is a boy born on Sunday.',
        'Kakum National Park in the Central Region is famous for its moist evergreen rainforest and canopy walkway.',
      ],
      localiseThis: [
        'Supplement Kakum rainforest examples with local savannah, coastal wetland or farm species from your school’s district.',
      ],
      factCheck: [
        {
          claim: 'Cocoa flowers (Theobroma cacao) are primarily pollinated by tiny biting midges (family Ceratopogonidae, especially Forcipomyia species) that breed in moist leaf litter.',
          explanation: 'Unlike large bees, tiny Ceratopogonid midges are small enough to enter the intricate hood of cocoa flowers and transfer pollen.',
          reference: 'Cocoa Research Institute of Ghana (CRIG) & FAO Pollination Services for Sustainable Agriculture.',
        },
        {
          claim: 'Kakum National Park provides habitat for African forest elephants (Loxodonta cyclotis), Diana monkeys (Cercopithecus diana), yellow-casqued hornbills (Ceratogymna elata), and trees such as odum (Milicia excelsa) and wawa (Triplochiton scleroxylon).',
          explanation: 'All named species are documented native inhabitants of Ghana’s Upper Guinean moist evergreen forest zone at Kakum.',
          reference: 'Forestry Commission of Ghana (Wildlife Division) Kakum National Park Biodiversity Records; IUCN Red List.',
        },
        {
          claim: 'Straw-coloured fruit bats (Eidolon helvum) disperse seeds across West African forests and savannahs, and fungi, termites, millipedes and bacteria decompose dead wood into soil nutrients.',
          explanation: 'Eidolon helvum is a keystone seed disperser for reforestation in Ghana; saprotrophic fungi and detritivores mineralise organic matter.',
          reference: 'University of Ghana Department of Animal Biology and Conservation Science; UNESCO MAB Biosphere Reserve Studies.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Warm, lively Ghanaian English storyteller (Kore).',
      pace: 'Medium-slow (about 115 words per minute) for Primary 3–4 learners.',
      notes: ['Bring gentle wonder to the canopy and forest-floor discoveries.', 'Pronounce Kojo, Akosua, Kwesi, Kakum, odum and wawa clearly.'],
    },
    music: 'Optional low-key soft piano ambience (user-togglable in reader header; off by default).',
    culturalNotes: ['Highlights Kakum National Park and Ghana’s cocoa agro-ecology accurately.'],
    reviewQuestions: ['Confirm species names and reading level for Primary 3–4 with a Ghanaian science educator.'],
  },

  // ====================================================================================================================
  // 3. Yaa and the Mystery of Changing Life (Primary 6-JHS 1, 12 pages, Evolution & Natural Selection)
  // ====================================================================================================================
  {
    key: 'yaa-and-the-mystery-of-changing-life',
    set: 'extension',
    title: 'Yaa and the Mystery of Changing Life',
    summary:
      'At a natural history exhibition in Accra, Yaa and Kwame investigate fossils, beetle camouflage and family trees to understand how populations evolve by natural selection over generations.',
    classification: base({
      classIds: ['primary-6', 'jhs-1'],
      ageMin: 11,
      ageMax: 13,
      readingLevel: 'proficient',
      difficulty: 4,
      genres: ['science', 'realistic-fiction', 'educational'],
      themes: ['animals-and-habitats', 'school', 'identity'],
      objectives: ['scientific-curiosity', 'critical-thinking', 'reasoning', 'reading-comprehension', 'vocabulary'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 400,
    }),
    palette: ['#fef3c7', '#0f766e'],
    characters: [
      'Yaa: a twelve-year-old Ghanaian girl with braided hair in a neat bun, wearing a teal-and-cream school uniform and carrying a sketchpad.',
      'Madam Abena: a warm, knowledgeable Ghanaian science teacher in her thirties wearing a mustard-gold dress and round spectacles.',
      'Kwame: Yaa’s twelve-year-old classmate, curious and outspoken, wearing a teal-and-cream school shirt and trousers.',
    ],
    pages: [
      {
        text: 'Inside the science museum in Accra, twelve-year-old Yaa leaned over a glass case containing dark stone slabs. Pressed into the rock were the outlines of ancient fish and fern leaves that looked different from any living species she had ever seen. ‘Madam Abena,’ Yaa asked, ‘why do these fossils look partly familiar and partly strange?’',
        alt: 'Yaa and Kwame examine stone fossils of ancient fish and ferns in a glass museum case with Madam Abena.',
        motif: '🦴🏛️',
        brief: 'Inside a bright science museum in Accra: Yaa (12, braided bun, teal-and-cream uniform, sketchpad) and Kwame looking into a glass display case of stone fish and fern fossils with Madam Abena (mustard-gold dress, spectacles).',
        narration: 'Curious and engaging. Pause slightly before Yaa’s question.',
      },
      {
        text: 'Madam Abena adjusted her spectacles and smiled. ‘Because life on Earth has not stayed frozen in time, Yaa. Those fossils are preserved remains and traces left in rock layers over millions of years. Deeper rock layers hold older fossils, and higher layers hold younger ones, giving us a timeline of how living things have changed.’',
        alt: 'Madam Abena points to a colourful wall diagram of layered rock cliffs with older fossils at the bottom and newer fossils near the top.',
        motif: '🪨⏳',
        brief: 'Madam Abena pointing to an illustrated cross-section wall display of sedimentary rock layers showing trilobites and fish at the bottom and mammals near the top (no text).',
        narration: 'Clear, steady teacher voice. Emphasise "fossils" and "timeline".',
      },
      {
        text: 'At the next table, Yaa looked at a tray of mounted savannah grass beetles collected decades apart. Even within a single family of beetles, no two were identical: some had slightly darker brown shells, and others had paler tan shells. ‘This is inherited variation,’ said Madam Abena. ‘Offspring inherit traits from their parents through DNA, with natural differences from one individual to another.’',
        alt: 'Yaa looks through a magnifying glass at a museum tray of brown and tan beetles of slightly different shades.',
        motif: '🪲🔍',
        brief: 'Close view of Yaa holding a magnifying glass over a wooden display tray containing brown and pale-tan beetles, while Kwame and Madam Abena watch.',
        narration: 'Measured and clear. Emphasise "inherited variation".',
      },
      {
        text: 'Kwame frowned thoughtfully. ‘So if the dry bush turns dark brown after a bushfire, do the pale beetles decide to turn dark brown so birds cannot spot them?’',
        alt: 'Kwame points at the pale tan beetles with a puzzled expression as he asks his question.',
        motif: '🤔🪲',
        brief: 'Kwame pointing at the beetle display tray with a puzzled, questioning expression while Yaa and Madam Abena listen.',
        narration: 'Natural, questioning tone for Kwame.',
      },
      {
        text: '‘No, Kwame, and that is a crucial point,’ said Madam Abena. ‘An individual organism cannot evolve or change its inherited colour simply because it needs or wishes to. A pale beetle stays pale its whole life. Just as wishing for wings will not make you grow feathers, an animal cannot will its own DNA to change.’',
        alt: 'Madam Abena holds up one pale beetle model and shakes her head kindly to explain that an individual beetle cannot change its own shell colour.',
        motif: '🚫✨',
        brief: 'Madam Abena holding a large educational model of a pale tan beetle, explaining warmly to Kwame and Yaa why an individual beetle cannot change its colour by wishing.',
        narration: 'Emphatic and crystal clear on "An individual organism cannot evolve or change its inherited colour simply because it needs or wishes to."',
      },
      {
        text: '‘Then how does the group change?’ asked Yaa. Madam Abena pointed to a diorama of hungry shrikes perched above dark soil. ‘On dark soil, birds easily spot the pale beetles and eat more of them. The beetles that happened to be born with darker shells blend in better. More of them survive long enough to lay eggs and pass their dark-shell genes to their offspring.’',
        alt: 'A museum diorama shows a bird spotting pale beetles on dark soil while darker brown beetles remain hidden.',
        motif: '🐦🪲',
        brief: 'Museum nature diorama: a bird perched on a branch looking down at dark brown soil where pale tan beetles stand out clearly and dark brown beetles blend in.',
        narration: 'Step-by-step storytelling pace so the mechanism of survival and reproduction is easy to follow.',
      },
      {
        text: '‘Over many generations,’ Madam Abena continued, ‘most beetles in the population have dark shells. We call a helpful inherited trait like that camouflage an adaptation, and the process that shifts the population over generations is called natural selection.’',
        alt: 'Yaa sketches two generations of beetles in her pad, showing dark-shelled beetles becoming more common over time.',
        motif: '📒📈',
        brief: 'Close view over Yaa’s shoulder as she sketches two rows of beetles in her sketchpad, mixed beetles at the top and mostly dark brown beetles at the bottom (no text).',
        narration: 'Clear emphasis on "adaptation" and "natural selection".',
      },
      {
        text: '‘We even see natural selection happening rapidly today,’ said Madam Abena. ‘When a person takes antibiotic medicine, most bacteria die, but a few bacteria with a rare inherited resistance trait may survive and multiply. That is why doctors tell us to finish our prescribed medicine properly.’',
        alt: 'A backlit science panel shows microscopic bacteria where a few resistant cells survive and multiply.',
        motif: '🔬💊',
        brief: 'Madam Abena, Yaa and Kwame looking at a glowing circular microscope display showing rod-shaped bacteria cells.',
        narration: 'Practical and relatable connection to everyday health.',
      },
      {
        text: 'They walked to a large branching tree diagram showing vertebrates, fish, amphibians, reptiles, birds and mammals. Kwame pointed to the primate branch. ‘Madam Abena, some people say evolution claims humans came from the monkeys we see in trees today. Is that true?’',
        alt: 'Kwame points to a large illuminated branching tree of life on the museum wall.',
        motif: '🌳🐒',
        brief: 'In front of a large glowing branching tree-of-life mural on the museum wall (purely pictorial animal silhouettes, no text), Kwame points toward the mammal branches.',
        narration: 'Direct, curious tone for Kwame’s common question.',
      },
      {
        text: '‘Not at all,’ said Madam Abena. ‘Humans did not descend from today’s monkeys or modern apes. Think of your own family: you did not descend from your cousin! Instead, you and your cousin share grandparents. In a similar way, humans and modern apes are evolutionary cousins who share distant common ancestors that lived in Africa millions of years ago.’',
        alt: 'Madam Abena traces two separate branches splitting from a lower trunk on the tree-of-life mural, showing cousins sharing an ancestor.',
        motif: '🌿🤝',
        brief: 'Madam Abena tracing her finger from a lower shared branch split into two separate upper branches on the mural, while Yaa and Kwame nod with understanding.',
        narration: 'Warm, clear analogy. Emphasise "you did not descend from your cousin" and "share distant common ancestors".',
      },
      {
        text: '‘Why do scientists call it the theory of evolution if there is so much evidence?’ Yaa asked. ‘In everyday speech,’ said Madam Abena, ‘people use the word theory to mean a guess. But in science, a theory is the opposite of a guess. It is a comprehensive, well-tested explanation supported by many independent lines of evidence, from fossils and anatomy to DNA.’',
        alt: 'A display case shows three matching lines of evidence side by side: a fossil bone, comparative limb bones, and a double-helix DNA model.',
        motif: '🧬🦴',
        brief: 'A bright museum display showing a 3D double-helix DNA model alongside comparative forelimb bones and a fossil cast, with Yaa taking notes.',
        narration: 'Firm, clear distinction between an everyday guess and a scientific theory.',
      },
      {
        text: 'Outside in the afternoon sunshine, Yaa looked at a weaver bird building its nest in a neem tree. Every feather, every leaf and every living creature carried a story written across millions of generations. ‘Life is always changing across generations,’ Yaa said, smiling at Kwame, ‘and evidence is how we read its history.’ The end.',
        alt: 'Outside the museum in the sunshine, Yaa, Kwame and Madam Abena watch yellow weaver birds building nests in a green neem tree.',
        motif: '🐦🌳',
        brief: 'Sunny museum courtyard in Accra: Yaa, Kwame and Madam Abena smiling up at bright yellow village weaver birds weaving round grass nests in a leafy neem tree.',
        narration: 'Warm, reflective, and uplifting close. Pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'yaa-evo-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What do fossils in deeper and higher rock layers show scientists?',
        options: [
          'A timeline of how living things have changed over millions of years',
          'That every species alive today existed at the exact same time',
          'That rocks grow like living plants',
        ],
        correctIndex: 0,
        explanation: 'Deeper rock layers preserve older organisms and higher layers preserve younger ones, recording change over geological time.',
      },
      {
        id: 'yaa-evo-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'Can an individual pale beetle change its shell colour to dark brown just because it needs to hide?',
        options: [
          'No; individuals do not evolve by wishing, populations shift over generations',
          'Yes; any beetle can change its DNA whenever it feels scared',
          'Yes; all insects change species every dry season',
        ],
        correctIndex: 0,
        explanation: 'Individual organisms cannot alter their inherited traits at will; natural selection acts on existing inherited variation across generations.',
      },
      {
        id: 'yaa-evo-v1',
        type: 'vocabulary',
        afterPage: 7,
        word: 'adaptation',
        definition: 'An inherited trait that helps an organism survive and reproduce in its environment.',
        distractors: ['A rock layer found at the bottom of the sea', 'A guess made without checking any evidence'],
      },
      {
        id: 'yaa-evo-c3',
        type: 'comprehension',
        afterPage: 10,
        question: 'How does evolutionary science explain the relationship between humans and modern apes?',
        options: [
          'Humans and modern apes share distant common ancestors, like cousins',
          'Humans descended from the monkeys living in zoos today',
          'Humans and other mammals have no shared traits or DNA at all',
        ],
        correctIndex: 0,
        explanation: 'Humans did not descend from living monkeys or modern apes; rather, both lineages branched from common ancestors millions of years ago.',
      },
      {
        id: 'yaa-evo-c4',
        type: 'comprehension',
        afterPage: 11,
        question: 'What does the word "theory" mean in science?',
        options: [
          'A well-tested explanation supported by many independent lines of evidence',
          'A random guess that has never been tested',
          'A rule that can never be checked with observations',
        ],
        correctIndex: 0,
        explanation: 'In science, a theory (like germ theory, atomic theory, or evolutionary theory) is a rigorously tested explanation backed by converging evidence.',
      },
      {
        id: 'yaa-evo-seq',
        type: 'sequencing',
        afterPage: 12,
        prompt: 'Put the steps of natural selection in the beetle population in order.',
        items: [
          'Beetles in a population are born with inherited variation in shell colour.',
          'Birds spot and eat more of the pale beetles on dark soil.',
          'More dark-shelled beetles survive and lay eggs.',
          'Over many generations, dark-shelled beetles become much more common.',
        ],
      },
      {
        id: 'yaa-evo-sel',
        type: 'sel',
        afterPage: 12,
        prompt: 'When you hear a common myth about science, how can you respond respectfully using evidence?',
        feelingOptions: ['Curious', 'Patient', 'Respectful', 'Confident'],
      },
    ],
    glossary: [
      { word: 'fossils', definition: 'Preserved remains or traces of ancient living things found in rock.', pages: [1, 2, 11] },
      { word: 'variation', definition: 'Natural differences in traits among individuals of the same species.', pages: [3] },
      { word: 'offspring', definition: 'The young or children produced by living things.', pages: [3, 6] },
      { word: 'adaptation', definition: 'An inherited trait that helps a living thing survive and reproduce in its environment.', pages: [7] },
      { word: 'ancestors', definition: 'Earlier generations from which later living things descended.', pages: [10] },
      { word: 'theory', definition: 'In science, a well-tested explanation supported by many lines of evidence.', pages: [11] },
    ],
    teacherGuide: {
      overview:
        'Set at a science museum in Accra, this story helps Primary 6 and JHS 1 learners understand inherited variation, fossils, adaptation, and natural selection, while addressing three widespread misconceptions: teleological individual change ("changing because you need to"), the "humans came from today’s monkeys" myth, and the everyday vs scientific meaning of "theory".',
      lessonMinutes: 45,
      learningGoals: [
        'Explain how natural selection acts on inherited variation over many generations.',
        'Clarify why individual organisms do not evolve in their own lifetime simply by wishing or needing to change.',
        'Explain that humans and modern apes share common ancestors rather than humans descending from living monkeys.',
        'Distinguish the scientific meaning of "theory" (well-supported explanation) from the everyday meaning ("mere guess").',
      ],
      subjectLinks: [
        { subject: 'Science (Primary 6 – JHS 1)', link: 'Diversity of life, heredity, adaptation, fossils and scientific inquiry.', status: 'to-verify' },
        { subject: 'English Language', link: 'Scientific reading comprehension, precise vocabulary and evidence-based reasoning.', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask learners to notice small inherited differences in the classroom (such as earlobe attachment or thumb bend) to introduce natural variation.',
        'Ask what the word "theory" means in everyday conversation versus in science class.',
      ],
      whileReading: [
        'Pause after page 5 to reinforce why an individual pale beetle cannot turn dark brown by trying.',
        'Pause after page 10 to draw a simple family tree showing grandparents → two parents (siblings) → two cousins.',
      ],
      afterReading: [
        'Classroom simulation: scatter 20 green paper dots and 20 yellow paper dots on a green cloth; give a "bird" 10 seconds to pick dots, then double the survivors to model natural selection over 3 generations.',
      ],
      discussion: [
        'Why is inherited variation necessary before natural selection can happen?',
        'How does the cousin analogy help explain what "common ancestor" means?',
        'Why do doctors warn against stopping antibiotic medicine halfway through a course?',
      ],
      reflection: [
        'What is one misconception you used to have that became clearer when you looked at the evidence?',
      ],
      mathsExtension: [
        {
          task: 'In Generation 1, a beetle population has 50 dark beetles and 50 pale beetles (100 total). What percentage is dark?',
          answer: '50 out of 100 = 50%.',
        },
        {
          task: 'By Generation 10, 85 out of 100 beetles are dark. By how many percentage points did the dark beetles increase?',
          answer: '85% − 50% = 35 percentage points.',
        },
      ],
      differentiation: {
        support: ['Use the 4-step sequencing cards to trace Variation → Survival → Reproduction → Generation Shift.'],
        stretch: ['Research one fossil discovery in Africa and explain what it reveals about ancient environments.'],
      },
      culturalNotes: [
        'Yaa (girl born on Thursday), Abena (girl born on Tuesday), and Kwame (boy born on Saturday) are Akan day names.',
        'Set in Accra’s Museum of Science and Technology context.',
      ],
      localiseThis: [
        'Use local examples of camouflage in Ghana (such as praying mantises, grasshoppers, or nightjars) during outdoor observation.',
      ],
      factCheck: [
        {
          claim: 'Natural selection acts on heritable variation across generations; individual organisms do not evolve in their own lifetimes out of need or desire.',
          explanation: 'Mutations and genetic recombination occur prior to selection; differential reproductive success changes allele frequencies in a population over generations.',
          reference: 'UC Museum of Paleontology, Understanding Evolution (evolution.berkeley.edu); National Academy of Sciences (1998), Teaching About Evolution and the Nature of Science.',
        },
        {
          claim: 'Humans did not evolve from living monkeys or modern apes; humans and modern apes share distant common ancestors.',
          explanation: 'Extant primates occupy contemporary tips of the phylogenetic tree; hominins diverged from the common ancestor shared with Pan (chimpanzees/bonobos) in Africa ~6–8 million years ago.',
          analogyNote: 'The cousin/grandparent analogy accurately illustrates branching descent (cladogenesis) vs linear ladder misconceptions.',
          reference: 'Smithsonian Institution National Museum of Natural History, What Does It Mean to Be Human? (humanorigins.si.edu).',
        },
        {
          claim: 'In science, a theory is a comprehensive, well-substantiated explanation of nature supported by independent lines of evidence, not a mere guess.',
          explanation: 'Scientific theories integrate laws, facts, and tested hypotheses across paleontology, comparative anatomy, biogeography, and molecular genetics.',
          reference: 'American Association for the Advancement of Science (AAAS) & National Academy of Sciences, Science, Evolution, and Creationism.',
        },
      ],
    },
    narrationPlan: {
      voice: 'Clear, engaging Ghanaian English storyteller (Kore).',
      pace: 'Medium (about 125 words per minute).',
      notes: ['Clearly distinguish Kwame’s questions from Madam Abena’s calm explanations.'],
    },
    music: 'Optional low-key soft piano ambience (user-togglable in reader header; off by default).',
    culturalNotes: ['Presents evolutionary biology accurately and respectfully in a Ghanaian school/museum setting.'],
    reviewQuestions: ['Verify alignment with NaCCA Upper Primary / JHS Science curriculum descriptors.'],
  },

  // ====================================================================================================================
  // 4. Adwoa and the Missing Market Change (Primary 2-3, 9 pages, Mathematics, Honesty & Problem-Solving)
  // ====================================================================================================================
  {
    key: 'adwoa-and-the-missing-market-change',
    set: 'extension',
    title: 'Adwoa and the Missing Market Change',
    summary:
      'Sent to the market with a twenty-cedi note, Adwoa uses careful mental addition and subtraction to spot an extra four cedis in her change and chooses to return it honestly.',
    classification: base({
      classIds: ['primary-2', 'primary-3'],
      ageMin: 7,
      ageMax: 9,
      readingLevel: 'developing',
      difficulty: 2,
      genres: ['realistic-fiction', 'educational', 'moral'],
      themes: ['money-and-enterprise', 'family', 'community'],
      objectives: ['counting', 'problem-solving', 'honesty', 'financial-literacy', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['market', 'local-food', 'local-names'],
      estimatedDurationSec: 240,
    }),
    palette: ['#fef9c3', '#ea580c'],
    characters: [
      'Adwoa: an eight-year-old Ghanaian girl with neat braided puffs and red hair beads, wearing a bright coral-orange dress and brown sandals, carrying a woven market basket.',
      'Mama: Adwoa’s warm mother wearing a blue-and-yellow wax-print wrapper and headscarf.',
      'Auntie Dede: a busy, friendly market vegetable seller wearing a red-and-gold head-tie and cloth apron.',
    ],
    pages: [
      {
        text: 'On Saturday morning, Mama handed eight-year-old Adwoa a crisp twenty-cedi note and a woven basket. ‘Please go to Auntie Dede’s stall,’ said Mama. ‘Buy three bunches of kontomire, one bowl of tomatoes, and one pack of salt. Count the prices and your change carefully.’',
        alt: 'Mama hands Adwoa a crisp twenty-cedi note and a woven basket in their sunny courtyard.',
        motif: '💵🧺',
        brief: 'Sunny Ghanaian home courtyard: Mama (blue-and-yellow wax-print dress) handing a twenty-cedi note and woven basket to eight-year-old Adwoa (braided puffs with red beads, coral-orange dress).',
        narration: 'Warm and encouraging. Emphasise "twenty-cedi note" and "Count the prices and your change carefully".',
      },
      {
        text: 'At the market, Adwoa went straight to Auntie Dede’s stall. First, she picked three fresh green bunches of kontomire leaves. Each bunch cost two cedis. Adwoa counted in twos on her fingers: ‘Two, four, six. Three bunches cost six cedis.’',
        alt: 'At the market stall, Adwoa holds three bunches of green kontomire leaves and counts on her fingers.',
        motif: '🥬🖐️',
        brief: 'At Auntie Dede’s colourful vegetable stall, Adwoa holds three fresh green bunches of kontomire leaves and counts on her fingers while Auntie Dede smiles.',
        narration: 'Clear, rhythmic counting: "Two, four, six. Three bunches cost six cedis."',
      },
      {
        text: 'Next, Auntie Dede measured one bowl of shiny red tomatoes for five cedis. Adwoa added the numbers in her head: ‘Six cedis for the kontomire plus five cedis for the tomatoes makes eleven cedis.’',
        alt: 'Auntie Dede pours shiny red tomatoes from a metal bowl into Adwoa’s basket.',
        motif: '🍅🧮',
        brief: 'Auntie Dede pouring shiny red tomatoes from a small measure bowl into Adwoa’s woven basket; Adwoa thinking carefully.',
        narration: 'Slow and clear on the addition: "Six cedis... plus five cedis... makes eleven cedis."',
      },
      {
        text: 'Last of all, Adwoa picked up one small pack of salt for three cedis. She added three cedis to eleven cedis: ‘Twelve, thirteen, fourteen! Everything in my basket costs fourteen cedis in all.’',
        alt: 'Adwoa places a small white pack of salt into her basket beside the tomatoes and kontomire.',
        motif: '🧂🧺',
        brief: 'Close view of Adwoa placing a neat white packet of salt (no text) into her woven basket beside the green kontomire leaves and red tomatoes.',
        narration: 'Count up clearly: "Twelve, thirteen, fourteen!"',
      },
      {
        text: 'Adwoa worked out her change before handing over the twenty-cedi note. ‘Twenty cedis minus fourteen cedis leaves six cedis,’ she whispered. ‘So I should get six cedis change.’',
        alt: 'Adwoa holds out her twenty-cedi note to Auntie Dede while several customers crowd around the stall.',
        motif: '💭💵',
        brief: 'Adwoa holding out her twenty-cedi note at the busy stall while two other market shoppers wait beside Auntie Dede.',
        narration: 'Quiet and confident as Adwoa works out the subtraction.',
      },
      {
        text: 'Three noisy customers were asking Auntie Dede for onions at the same time. In the rush, Auntie Dede took Adwoa’s twenty-cedi note and quickly pressed two five-cedi notes into Adwoa’s hand. ‘Thank you, little one!’ called Auntie Dede.',
        alt: 'In a busy rush with other shoppers, Auntie Dede hands two five-cedi notes to Adwoa.',
        motif: '🏃‍♀️💴',
        brief: 'Busy market scene: Auntie Dede turning toward waiting shoppers while pressing two banknotes into Adwoa’s hand.',
        narration: 'Brisk, busy market pace.',
      },
      {
        text: 'Under the shade of a neem tree, Adwoa stopped and looked at her hand. Five cedis plus five cedis was ten cedis! ‘Wait,’ said Adwoa. ‘My change should be six cedis, not ten cedis. Ten minus six is four. Auntie Dede gave me four cedis too much!’',
        alt: 'Under a shady tree, Adwoa looks at the two five-cedi notes in her palm with wide, thoughtful eyes.',
        motif: '🌳😮',
        brief: 'Under the dappled shade of a neem tree at the market edge, Adwoa stops with her basket and looks closely at the two banknotes in her open palm.',
        narration: 'Surprised discovery, then slow, clear arithmetic: "Five cedis plus five cedis was ten cedis... Ten minus six is four."',
      },
      {
        text: 'For a moment, Adwoa saw a seller with sweet yellow mangoes nearby. Four extra cedis could buy two juicy mangoes! Then she thought of how hard Auntie Dede worked in the sun every day. Adwoa turned right around and walked back to the stall.',
        alt: 'Adwoa glances past a tray of yellow mangoes and walks determinedly back toward Auntie Dede’s stall.',
        motif: '🥭↩️',
        brief: 'Adwoa walking past a mango stall with a determined, honest expression, heading straight back toward Auntie Dede’s vegetable stall.',
        narration: 'Brief pause on the temptation of the mangoes, then warm resolve.',
      },
      {
        text: '‘Auntie Dede,’ said Adwoa, ‘my items cost fourteen cedis, so my change from twenty cedis is six cedis. You gave me ten cedis by mistake.’ Auntie Dede counted again, clapped her hands in gratitude, and exchanged one five-cedi note for a one-cedi coin. ‘Six cedis exact!’ she beamed. ‘You are a sharp mathematician and an honest child.’ The end.',
        alt: 'Auntie Dede smiles warmly and gives Adwoa her exact six cedis change as Adwoa beams with pride.',
        motif: '🤝🌟',
        brief: 'At the vegetable stall, Auntie Dede smiles gratefully with her hand on her heart, handing Adwoa one banknote and one coin while Adwoa beams proudly.',
        narration: 'Warm, joyful, and proud. Slow down on the final sentence and pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'adwoa-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'One bunch of kontomire costs 2 cedis. How much did 3 bunches cost?',
        options: ['Six cedis', 'Five cedis', 'Three cedis'],
        correctIndex: 0,
        explanation: '2 cedis + 2 cedis + 2 cedis (3 × 2) = 6 cedis.',
      },
      {
        id: 'adwoa-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'What was the total cost of 6 cedis of kontomire, 5 cedis of tomatoes and 3 cedis of salt?',
        options: ['Fourteen cedis', 'Eleven cedis', 'Sixteen cedis'],
        correctIndex: 0,
        explanation: '6 + 5 = 11 cedis, and 11 + 3 = 14 cedis in all.',
      },
      {
        id: 'adwoa-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Adwoa paid with a 20-cedi note for 14 cedis of items. How much change should she get?',
        options: ['Six cedis', 'Ten cedis', 'Four cedis'],
        correctIndex: 0,
        explanation: '20 cedis − 14 cedis = 6 cedis change.',
      },
      {
        id: 'adwoa-c4',
        type: 'comprehension',
        afterPage: 7,
        question: 'Auntie Dede gave Adwoa 10 cedis instead of 6 cedis. How much extra money was that?',
        options: ['Four cedis too much', 'Two cedis too much', 'Six cedis too much'],
        correctIndex: 0,
        explanation: '10 cedis − 6 cedis = 4 cedis extra.',
      },
      {
        id: 'adwoa-v1',
        type: 'vocabulary',
        afterPage: 9,
        word: 'change',
        definition: 'The money returned to you when you pay more than the price of what you buy.',
        distractors: ['The basket used to carry vegetables', 'The name of a green leafy vegetable'],
      },
      {
        id: 'adwoa-seq',
        type: 'sequencing',
        afterPage: 9,
        prompt: 'Put Adwoa’s market trip in order.',
        items: [
          'Mama gives Adwoa a twenty-cedi note and a shopping list.',
          'Adwoa adds up the kontomire, tomatoes and salt to get fourteen cedis.',
          'Adwoa notices Auntie Dede gave her ten cedis change instead of six.',
          'Adwoa returns the extra four cedis to Auntie Dede.',
        ],
      },
      {
        id: 'adwoa-sel',
        type: 'sel',
        afterPage: 9,
        prompt: 'If someone gives you too much change by mistake, how does returning it help both of you?',
        feelingOptions: ['Honest', 'Proud', 'Trusted', 'Kind'],
      },
    ],
    glossary: [
      { word: 'change', definition: 'The money you get back when you pay with more money than the items cost.', pages: [1, 5, 7, 9] },
      { word: 'stall', definition: 'A table or small open shop in a market where goods are sold.', pages: [1, 2, 8] },
      { word: 'mistake', definition: 'Something done wrong by accident, without meaning to.', pages: [9] },
      { word: 'honest', definition: 'Truthful and fair; not keeping what belongs to someone else.', pages: [9] },
    ],
    teacherGuide: {
      overview:
        'A Primary 2–3 mathematics and character story set in a Ghanaian market. Learners practise multiplication by 2, multi-step addition within 20, subtraction to find change from 20 cedis, and the value of honesty when an error occurs.',
      lessonMinutes: 35,
      learningGoals: [
        'Calculate the total cost of multiple items using skip-counting and addition within 20 cedis.',
        'Find the correct change from a 20-cedi note by subtracting or counting up.',
        'Identify a calculation discrepancy (10 − 6 = 4 cedis) and explain why returning extra change is honest.',
      ],
      subjectLinks: [
        { subject: 'Mathematics (Primary 2–3)', link: 'Addition and subtraction of whole numbers within 20; Ghana cedi money problems.', status: 'to-verify' },
        { subject: 'Religious and Moral Education / Our World Our People', link: 'Honesty, trustworthiness and responsibility in the community.', status: 'to-verify' },
        { subject: 'English Language', link: 'Story comprehension, sequencing and oral retelling.', status: 'to-verify' },
      ],
      beforeReading: [
        'Show learners paper play-money (1, 2, 5, 10 and 20 cedi notes/coins) and practise making 6 cedis and 14 cedis.',
      ],
      whileReading: [
        'Pause after page 4 and let every child check Adwoa’s total: 6 + 5 + 3 = 14 cedis.',
        'Pause after page 7 and ask how Adwoa knew she had 4 cedis too much.',
      ],
      afterReading: [
        'Set up a classroom market corner where pairs take turns being the buyer (with 20 cedis) and the shopkeeper checking the change together.',
      ],
      discussion: [
        'How did doing the maths in her head before paying help Adwoa notice the mistake?',
        'Why was it tempting to keep the four cedis, and what helped Adwoa choose honesty?',
      ],
      reflection: [
        'Have you ever found something or received extra change that was not yours? What did you do?',
      ],
      mathsExtension: [
        { task: '3 bunches of kontomire at 2 cedis each = ?', answer: '3 × 2 = 6 cedis.' },
        { task: '6 cedis + 5 cedis + 3 cedis = ?', answer: '14 cedis.' },
        { task: 'Change from 20 cedis when spending 14 cedis = ?', answer: '20 − 14 = 6 cedis.' },
        { task: 'Difference between 10 cedis received and 6 cedis correct change = ?', answer: '10 − 6 = 4 cedis.' },
      ],
      differentiation: {
        support: ['Use 20 counters on a ten-frame mat to remove 6, 5, and 3 counters physically and count the 6 left.'],
        stretch: ['What if Adwoa also bought 2 onions at 1 cedi each? Recalculate the total (16 cedis) and change from 20 cedis (4 cedis).'],
      },
      culturalNotes: [
        'Adwoa is an Akan day name for a girl born on Monday.',
        'Kontomire (cocoyam leaves) is a staple leafy green used across Ghana for stews and palava sauce.',
      ],
      localiseThis: ['Adjust market item names to the everyday greens and vegetables sold in your town.'],
    },
    narrationPlan: {
      voice: 'Warm, clear Ghanaian English storyteller (Kore).',
      pace: 'Slow-medium (about 105 words per minute) so children can do the mental sums along with Adwoa.',
      notes: ['Pause briefly after each sum so young listeners can calculate along.'],
    },
    music: 'Optional low-key soft piano ambience (user-togglable in reader header; off by default).',
    culturalNotes: ['Uses authentic Ghanaian currency (cedis) and market items (kontomire, tomatoes, salt).'],
    reviewQuestions: ['All arithmetic verified: 3×2=6; 6+5+3=14; 20−14=6; 5+5=10; 10−6=4; 5+1=6.'],
  },

  // ====================================================================================================================
  // 5. Kwaku's Little Savings Box (Primary 4-5, 10 pages, Financial Literacy & Character Development)
  // ====================================================================================================================
  {
    key: 'kwakus-little-savings-box',
    set: 'extension',
    title: 'Kwaku’s Little Savings Box',
    summary:
      'With a small wooden susu box built from his father’s carpentry offcuts, ten-year-old Kwaku learns to separate needs from wants, budget his weekly five cedis, and help his family and himself.',
    classification: base({
      classIds: ['primary-4', 'primary-5'],
      ageMin: 9,
      ageMax: 11,
      readingLevel: 'fluent',
      difficulty: 3,
      genres: ['realistic-fiction', 'family', 'educational'],
      themes: ['money-and-enterprise', 'family', 'community'],
      objectives: ['financial-literacy', 'problem-solving', 'responsibility', 'perseverance', 'reading-comprehension'],
      ghanaianContext: 'central',
      culturalTags: ['local-names'],
      estimatedDurationSec: 320,
    }),
    palette: ['#ffedd5', '#9a3412'],
    characters: [
      'Kwaku: a ten-year-old Ghanaian boy with a neat haircut, warm brown eyes, wearing a green-and-yellow striped polo shirt and jeans, holding a small smooth wooden susu savings box.',
      'Papa: Kwaku’s father, a skilled, hard-working carpenter in hislate thirties wearing a denim work apron and holding a carpenter’s pencil.',
      'Maame: Kwaku’s mother, a kind, practical seamstress and homemaker wearing a patterned indigo-and-cream dress.',
      'Ama: Kwaku’s six-year-old little sister with yellow hair ribbons.',
    ],
    pages: [
      {
        text: 'After school in Kumasi, ten-year-old Kwaku loved watching Papa plane smooth odum wood in his carpentry workshop. One Friday, Papa glued four small offcut boards together, cut a narrow slot in the top, and handed the little wooden box to Kwaku. ‘This is your own susu box,’ said Papa.',
        alt: 'In a sunny Kumasi carpentry workshop, Papa hands Kwaku a small smooth wooden susu box with a coin slot on top.',
        motif: '🪚📦',
        brief: 'Warm sunlit carpentry workshop in Kumasi: Papa (denim carpenter apron, kind smile) handing a small polished wooden susu savings box with a slot on top to ten-year-old Kwaku (green-and-yellow striped shirt).',
        narration: 'Warm, affectionate father-and-son moment. Clear pronunciation of "Kumasi" and "susu".',
      },
      {
        text: 'Every Saturday morning, Kwaku helped his Uncle Kofi arrange books at his stationery kiosk and earned five cedis. ‘Five cedis feels small when it is alone,’ said Maame that evening, ‘but when you make a budget, a plan for every cedi before you spend it, small amounts grow strong.’',
        alt: 'At the family table, Maame shows Kwaku how to divide five one-cedi coins into three small piles.',
        motif: '🪙📋',
        brief: 'At the home table, Maame (indigo-and-cream dress) and Kwaku look at five silver-and-gold one-cedi coins arranged in neat groups beside a notebook.',
        narration: 'Encouraging and practical. Emphasise "budget".',
      },
      {
        text: 'Maame taught Kwaku to ask one question before buying anything: ‘Is this a need or a want?’ She explained, ‘A need is something essential for health, safety or learning, like food, clean water, medicine, or the fifteen-cedi geometry set you will need next term. A want is something fun to have, like a plastic spinning top or fizzy drink, that can wait.’',
        alt: 'Kwaku draws two columns in his notebook showing a geometry set on one side and a spinning top on the other.',
        motif: '📐🪀',
        brief: 'Close view of Kwaku’s notebook showing simple drawings (no words): a ruler and protractor geometry set on the left side, and a colourful toy top and soda bottle on the right.',
        narration: 'Clear contrast between "need" and "want".',
      },
      {
        text: 'Together they made Kwaku’s weekly five-cedi budget. Every Saturday, three cedis went straight through the slot of his wooden susu box for his geometry set. One cedi was for a small Saturday treat now, and one cedi went into a small envelope to share a gift for little sister Ama’s birthday.',
        alt: 'Kwaku drops three one-cedi coins into his wooden susu box while setting aside two coins on the table.',
        motif: '📥🪙',
        brief: 'Kwaku smiling as he drops three coins into the slot of his wooden susu box, with one coin beside a small envelope and one coin in his hand.',
        narration: 'Steady, rhythmic counting of the three parts of the budget: three cedis, one cedi, one cedi.',
      },
      {
        text: 'On Tuesday after school, Kwaku’s friends crowded around a street seller spinning glowing plastic tops for four cedis each. ‘Buy one, Kwaku!’ called his friend. Kwaku touched the coin in his pocket and remembered his susu box at home. ‘It looks fun,’ he said, ‘but I am saving for my geometry set first.’',
        alt: 'Outside school, classmates watch a glowing spinning top while Kwaku smiles politely and keeps his hand on his pocket.',
        motif: '✨✋',
        brief: 'Sunny afternoon near school: two boys watch a bright plastic spinning top on the ground while Kwaku smiles calmly and steps back without buying.',
        narration: 'Lively for the friends, then calm and steady for Kwaku’s choice.',
      },
      {
        text: 'The next week, heavy rains washed out the road from the timber mill. Because no wood lorries could get through, Papa’s workshop had to wait for timber, and the price of rice and cooking oil at the market rose. That evening, Maame and Papa sat down calmly with their household notebook.',
        alt: 'While rain falls outside the window, Maame and Papa calmly review their household budget notebook together.',
        motif: '🌧️📒',
        brief: 'Cosy evening at home with rain outside the window: Maame and Papa sitting together calmly over their household notebook under a warm lamp while Kwaku watches.',
        narration: 'Gentle, respectful tone.',
      },
      {
        text: 'Kwaku looked worried. ‘Papa, did we do something wrong because money is tight this week?’ Papa put a warm hand on Kwaku’s shoulder. ‘Never think that, Kwaku. Many families work hard every single day and still face tight weeks when rains stop deliveries, prices rise, or someone falls ill. Having less money is never a sign of bad character.’',
        alt: 'Papa places a reassuring hand on Kwaku’s shoulder while Maame smiles warmly beside them.',
        motif: '🤝❤️',
        brief: 'Medium close shot: Papa placing a warm, reassuring hand on Kwaku’s shoulder, looking him in the eye with dignity and kindness while Maame smiles supportively.',
        narration: 'Warm, dignified, and deeply reassuring. Slow down on "Having less money is never a sign of bad character."',
      },
      {
        text: '‘What matters,’ said Maame, ‘is how a family plans together and cares for one another until the road opens again.’ By the sixth Saturday, the sun was shining, the timber lorry arrived at Papa’s workshop, and Kwaku had saved three cedis a week for six weeks.',
        alt: 'Sunlight shines on Papa’s workshop as Kwaku counts six weeks of tally marks beside his wooden susu box.',
        motif: '☀️🪵',
        brief: 'Sunny Saturday morning: Kwaku sitting at the table with his wooden susu box and six neat groups of तीन tally marks in his notebook.',
        narration: 'Hopeful and bright as the sun returns and the six weeks are completed.',
      },
      {
        text: 'With Papa’s help, Kwaku opened the base of his susu box and counted his savings: ‘Three, six, nine, twelve, fifteen, eighteen cedis!’ And in his sharing envelope, he had six cedis from the six weeks, enough to buy sweet roasted plantain and groundnuts for Ama’s birthday.',
        alt: 'Kwaku counts eighteen one-cedi coins on the table while little sister Ama claps happily.',
        motif: '🎉🪙',
        brief: 'Kwaku arranging eighteen coins in six neat stacks of three on the wooden table while six-year-old Ama (yellow hair ribbons) claps with delight.',
        narration: 'Joyful skip-counting by threes: "Three, six, nine, twelve, fifteen, eighteen cedis!"',
      },
      {
        text: 'At Uncle Kofi’s shop, Kwaku paid fifteen cedis for his brand-new geometry set. Eighteen cedis minus fifteen cedis left three cedis! That night, Kwaku dropped the three remaining cedis back into his susu box to start his next goal. ‘Little by little,’ he smiled, ‘a good plan builds big things.’ The end.',
        alt: 'Kwaku holds his new geometry set proudly and drops three remaining coins back into his wooden susu box.',
        motif: '📐😊',
        brief: 'Kwaku at his desk holding his new clear plastic geometry set (ruler, compass, protractor) in one hand and dropping three coins back into his wooden susu box with the other.',
        narration: 'Proud, warm conclusion. Pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'kwaku-v1',
        type: 'vocabulary',
        afterPage: 2,
        word: 'budget',
        definition: 'A plan for how you will save, spend and share your money before you use it.',
        distractors: ['A heavy tool used for cutting timber', 'A game played at break time'],
      },
      {
        id: 'kwaku-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Which of these is a NEED rather than a want?',
        options: [
          'Medicine, food and a required school geometry set',
          'A glowing plastic spinning top',
          'Extra fizzy drinks after school',
        ],
        correctIndex: 0,
        explanation: 'Needs are essentials required for health, safety and schooling; wants are nice to have but can wait.',
      },
      {
        id: 'kwaku-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Kwaku divide his 5 cedis each Saturday?',
        options: [
          '3 cedis to save, 1 cedi to spend, and 1 cedi to share',
          '5 cedis to spend on spinning tops',
          '4 cedis to spend and 1 cedi to save',
        ],
        correctIndex: 0,
        explanation: '3 cedis + 1 cedi + 1 cedi = 5 cedis.',
      },
      {
        id: 'kwaku-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why did Papa’s workshop have a tight week when the rains came?',
        options: [
          'Heavy rain blocked the timber road and prices rose, not laziness',
          'Papa forgot how to make furniture',
          'Kwaku lost his susu box',
        ],
        correctIndex: 0,
        explanation: 'External events like weather, road closures and rising prices affect hard-working families; tight money is never a sign of bad character.',
      },
      {
        id: 'kwaku-c4',
        type: 'comprehension',
        afterPage: 10,
        question: 'Kwaku saved 3 cedis a week for 6 weeks (18 cedis) and bought a 15-cedi geometry set. How much was left?',
        options: ['Three cedis', 'Five cedis', 'Eighteen cedis'],
        correctIndex: 0,
        explanation: '6 × 3 = 18 cedis saved; 18 − 15 = 3 cedis remaining.',
      },
      {
        id: 'kwaku-seq',
        type: 'sequencing',
        afterPage: 10,
        prompt: 'Put Kwaku’s savings journey in order.',
        items: [
          'Papa builds Kwaku a wooden susu box from offcut wood.',
          'Kwaku and Maame make a weekly five-cedi budget.',
          'Kwaku passes up the spinning top to stick to his goal.',
          'After six weeks, Kwaku buys his geometry set with three cedis left.',
        ],
      },
      {
        id: 'kwaku-sel',
        type: 'sel',
        afterPage: 10,
        prompt: 'Why is it important to treat every classmate with respect, no matter how much money their family has?',
        feelingOptions: ['Respectful', 'Kind', 'Fair', 'Thoughtful'],
      },
    ],
    glossary: [
      { word: 'offcut', definition: 'A small piece of wood left over after larger boards have been cut.', pages: [1] },
      { word: 'budget', definition: 'A plan for how to save, spend and share money.', pages: [2, 4] },
      { word: 'essential', definition: 'Completely necessary; something you cannot do without.', pages: [3] },
      { word: 'character', definition: 'A person’s inner qualities, such as honesty, kindness and hard work.', pages: [7] },
      { word: 'savings', definition: 'Money that you have put aside over time for a future need or goal.', pages: [9] },
    ],
    teacherGuide: {
      overview:
        'A Primary 4–5 financial literacy and character story set in Kumasi. Teaches needs vs wants, a simple Save-Spend-Share budget, multiplication/subtraction with Ghana cedis, and explicitly affirms the dignity of hard-working families facing external economic challenges.',
      lessonMinutes: 40,
      learningGoals: [
        'Distinguish between essential needs and optional wants.',
        'Create a simple Save-Spend-Share budget and calculate savings over multiple weeks.',
        'Explain why financial hardship is caused by real-world circumstances (such as weather, transport or prices) and never measures a person’s worth or character.',
      ],
      subjectLinks: [
        { subject: 'Mathematics (Primary 4–5)', link: 'Multiplication, subtraction and budgeting with Ghana cedis.', status: 'to-verify' },
        { subject: 'Our World Our People / Citizenship', link: 'Responsible decision-making, saving (susu), and empathy for others.', status: 'to-verify' },
        { subject: 'English Language', link: 'Fluent reading comprehension, vocabulary and discussion.', status: 'to-verify' },
      ],
      beforeReading: [
        'Ask: "What is a susu box, and why does having a slot on top help someone save?"',
        'Discuss the difference between something we need for school and something we want for fun.',
      ],
      whileReading: [
        'After page 4, verify that Kwaku’s budget adds up to 5 cedis (3 + 1 + 1 = 5).',
        'After page 7, discuss Papa’s words about dignity, hard work, and why we never judge people by their money.',
      ],
      afterReading: [
        'Have learners design a pretend 10-cedi weekly budget divided into Save, Spend and Share.',
      ],
      discussion: [
        'What helped Kwaku say no to the four-cedi spinning top on Tuesday?',
        'Why was Papa’s message on page 7 so important for Kwaku to hear?',
        'How did keeping 3 cedis in the box after buying the geometry set help Kwaku’s next goal?',
      ],
      reflection: [
        'What is one non-money way you can support your family or a friend when times are busy or difficult?',
      ],
      mathsExtension: [
        { task: 'Kwaku saves 3 cedis a week for 6 weeks. How much does he save?', answer: '3 × 6 = 18 cedis.' },
        { task: 'He also puts 1 cedi a week into his sharing envelope for 6 weeks. How much is in the envelope?', answer: '1 × 6 = 6 cedis.' },
        { task: 'Total earned over 6 weeks at 5 cedis per week = ?', answer: '5 × 6 = 30 cedis (18 saved + 6 spent + 6 shared = 30 cedis).' },
      ],
      differentiation: {
        support: ['Count in threes on a number line up to 18 (3, 6, 9, 12, 15, 18).'],
        stretch: ['If Kwaku wants to save 27 cedis for a dictionary at 3 cedis per week, how many weeks will it take? (9 weeks, or 8 weeks if he starts with his 3 leftover cedis!)'],
      },
      culturalNotes: [
        'Kwaku (boy born on Wednesday), Kofi (Friday) and Ama (Saturday) are Akan day names; Maame is the Akan address for mother.',
        'Susu boxes (wooden or metal boxes) are a well-known household savings tradition across Ghana.',
      ],
      localiseThis: ['Check the local price of a school mathematical/geometry set and adjust extension questions if desired.'],
    },
    narrationPlan: {
      voice: 'Warm, steady Ghanaian English storyteller (Kore).',
      pace: 'Medium (about 120 words per minute).',
      notes: ['Give Papa’s words on page 7 extra warmth and dignity.'],
    },
    music: 'Optional low-key soft piano ambience (user-togglable in reader header; off by default).',
    culturalNotes: ['Honours the Ghanaian susu tradition and models empathy without stigmatising low income.'],
    reviewQuestions: ['All arithmetic verified: 3+1+1=5; 3×6=18; 1×6=6; 18−15=3.'],
  },

  // ====================================================================================================================
  // 6. Kwame and the Talking Drum (KG 2-Primary 1, 8 pages, Ghanaian Culture, Rhythm & Listening)
  // ====================================================================================================================
  {
    key: 'kwame-and-the-talking-drum',
    set: 'extension',
    title: 'Kwame and the Talking Drum',
    summary:
      'Six-year-old Kwame learns from his grandfather Nana Yaw that before you can play the Akan atumpan talking drums, or any of Ghana’s diverse drums, you must first listen with your ears and your heart.',
    classification: base({
      classIds: ['kg-2', 'primary-1'],
      ageMin: 5,
      ageMax: 7,
      readingLevel: 'early',
      difficulty: 2,
      genres: ['cultural', 'family', 'educational'],
      themes: ['festivals', 'family', 'community'],
      objectives: ['cultural-heritage', 'oral-language', 'respect', 'sequencing', 'vocabulary'],
      ghanaianContext: 'central',
      culturalTags: ['local-names', 'festival'],
      estimatedDurationSec: 180,
    }),
    palette: ['#fef3c7', '#b45309'],
    characters: [
      'Kwame: a cheerful six-year-old Ghanaian boy with short cropped hair and a bright yellow-and-green traditional tunic shirt and brown sandals.',
      'Nana Yaw: Kwame’s kind grandfather with a short white beard, wearing a rich blue-and-gold cloth wrapped over his shoulder.',
      'Esi: Kwame’s seven-year-old cousin from the Volta Region, wearing a red patterned dress.',
    ],
    pages: [
      {
        text: 'Under the shade of the courtyard tree, Nana Yaw stood beside two tall wooden drums. ‘These are the atumpan,’ said Nana Yaw. ‘They are the talking drums of the Akan people.’ Kwame’s eyes grew wide. ‘Can a drum really talk, Nana?’',
        alt: 'Six-year-old Kwame looks up in wonder at two tall carved wooden atumpan drums beside his grandfather Nana Yaw.',
        motif: '🥁👴',
        brief: 'Sunny Ghanaian family courtyard: six-year-old Kwame (yellow-and-green tunic) looking in wonder at a pair of angled tall carved wooden atumpan drums beside Nana Yaw (white beard, blue-and-gold cloth).',
        narration: 'Warm and rhythmic. Gentle wonder on "Can a drum really talk, Nana?"',
      },
      {
        text: 'Nana Yaw held up two curved wooden sticks shaped like the letter L. ‘One drum has a low voice, kon-kon,’ he said. ‘The other drum has a high voice, ka-la. Together, their low and high tones sound like spoken words.’',
        alt: 'Nana Yaw holds two curved L-shaped drumsticks above the pair of atumpan drums.',
        motif: '🥢🎶',
        brief: 'Close view of Nana Yaw’s hands holding two L-shaped curved wooden drumsticks over the two leather drumheads of the atumpan pair, while Kwame watches closely.',
        narration: 'Perform "kon-kon" in a slightly lower tone and "ka-la" in a slightly higher tone.',
      },
      {
        text: 'Kwame was so excited that he took the sticks and tapped as fast as he could. Bam-bam-bam! The sound was loud and messy. Cousin Esi covered her ears and giggled. ‘Slow down, Kwame!’ she laughed.',
        alt: 'Kwame taps the drums too fast with a big grin while Cousin Esi covers her ears and giggles.',
        motif: '💥🤭',
        brief: 'Kwame eagerly tapping the drums too fast while seven-year-old Cousin Esi (red patterned dress) covers her ears and giggles playfully.',
        narration: 'Playful and fast on "Bam-bam-bam!", then light laughter.',
      },
      {
        text: 'Nana Yaw gently placed his hand over Kwame’s hands. ‘A good drummer is first a good listener,’ said Nana Yaw. ‘Listen with your ears. Listen with your heart. Then let your hands answer.’',
        alt: 'Nana Yaw gently rests his warm hands over Kwame’s hands on the drumsticks.',
        motif: '👂❤️',
        brief: 'Tender close two-shot: Nana Yaw resting his hands gently over Kwame’s small hands holding the curved drumsticks, both smiling calmly.',
        narration: 'Slow, calm, and rhythmic on "Listen with your ears. Listen with your heart."',
      },
      {
        text: '‘Does everyone in Ghana play the same drum?’ asked Esi. ‘No,’ smiled Nana Yaw. ‘Ghana has many wonderful traditions. Here in Ashanti we play the atumpan. In northern Ghana, drummers tuck the lunna hourglass drum under one arm and squeeze its cords to talk. And in your home in the Volta Region, Esi, Ewe master drummers play the tall atsimevu with a stick and bare hand.’',
        alt: 'Nana Yaw shows Kwame and Esi a carved wooden lunna hourglass drum and a tall Ewe drum on the veranda.',
        motif: '🌍🥁',
        brief: 'On the courtyard veranda, Nana Yaw points to a smaller hourglass-shaped lunna drum with leather tension cords and a tall painted cylindrical drum while Kwame and Esi admire them.',
        narration: 'Warm and appreciative of Ghana’s diverse cultures.',
      },
      {
        text: 'Now Kwame stood still and closed his eyes to listen. Nana Yaw tapped a slow welcome greeting on the two drums: ‘Kon-kon, ka-la! Kon-kon, ka-la! Akwaaba, welcome all!’',
        alt: 'Kwame closes his eyes and listens carefully while Nana Yaw taps the two atumpan drums.',
        motif: '😌🎵',
        brief: 'Nana Yaw playing the two atumpan drums with the curved sticks while Kwame stands still with his eyes closed, listening carefully to the beat.',
        narration: 'Clear, steady drum rhythm: "Kon-kon, ka-la! Kon-kon, ka-la!"',
      },
      {
        text: 'Kwame opened his eyes and breathed in slowly. He lifted the curved sticks and echoed the rhythm carefully: ‘Kon-kon, ka-la! Kon-kon, ka-la!’ This time the low drum and the high drum spoke clearly together.',
        alt: 'Kwame plays the two atumpan drums carefully with the curved sticks while Nana Yaw nods proudly.',
        motif: '🥁🌟',
        brief: 'Kwame holding the two curved L-shaped sticks with focus and joy, tapping the atumpan drums cleanly while Nana Yaw and Esi clap in rhythm.',
        narration: 'Confident, steady beat matching Nana Yaw’s rhythm.',
      },
      {
        text: 'Neighbours gathered in the courtyard and smiled as they heard the welcome call. Esi clapped in time with the beat, and Nana Yaw beamed. Kwame had learned the secret of the talking drum: when you listen first, your music speaks to everyone. The end.',
        alt: 'Neighbours gather smiling in the sunny courtyard as Kwame and Nana Yaw play the welcome rhythm together.',
        motif: '👏🎉',
        brief: 'Joyful courtyard gathering in golden afternoon sunlight: neighbours smiling and clapping as Kwame and Nana Yaw stand together by the atumpan drums.',
        narration: 'Warm, celebratory, and gentle at the close. Pause before "The end".',
      },
    ],
    activities: [
      {
        id: 'kwame-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'How do the two atumpan drums imitate spoken words?',
        options: [
          'One drum plays a low tone and the other plays a high tone',
          'A small radio is hidden inside the wood',
          'They only make one loud sound',
        ],
        correctIndex: 0,
        explanation: 'Akan is a tonal language, so the low-toned and high-toned drums mimic the tones of spoken phrases.',
      },
      {
        id: 'kwame-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'What did Nana Yaw say a good drummer must be first?',
        options: ['A good listener', 'The loudest person in the yard', 'The fastest runner'],
        correctIndex: 0,
        explanation: 'Nana Yaw taught Kwame that a good drummer is first a good listener.',
      },
      {
        id: 'kwame-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Do all communities across Ghana play the exact same drums?',
        options: [
          'No; each region has its own drums, like atumpan, lunna and atsimevu',
          'Yes; every town in Ghana only has one kind of drum',
          'No; drums are only played in schools',
        ],
        correctIndex: 0,
        explanation: 'Ghana’s cultural traditions are diverse, with distinct instruments and styles across Akan, Dagomba, Ewe and other communities.',
      },
      {
        id: 'kwame-ph',
        type: 'phonics',
        afterPage: 6,
        targetSound: 'dr',
        prompt: 'Which word starts with the dr sound, like drum?',
        options: ['drum', 'drummer', 'stick', 'tree'],
        correctIndexes: [0, 1],
      },
      {
        id: 'kwame-seq',
        type: 'sequencing',
        afterPage: 8,
        prompt: 'Put Kwame’s drumming lesson in order.',
        items: [
          'Nana Yaw shows Kwame the two atumpan drums and curved sticks.',
          'Kwame beats the drums too fast without listening.',
          'Nana Yaw teaches Kwame to stop and listen to the rhythm first.',
          'Kwame echoes the welcome rhythm clearly for the neighbours.',
        ],
      },
      {
        id: 'kwame-sel',
        type: 'sel',
        afterPage: 8,
        prompt: 'When someone is speaking or teaching you something new, how does listening carefully help?',
        feelingOptions: ['Calm', 'Attentive', 'Proud', 'Happy'],
      },
    ],
    glossary: [
      { word: 'courtyard', definition: 'An open space surrounded by walls or rooms inside a family home.', pages: [1, 8] },
      { word: 'tones', definition: 'High or low musical and spoken sounds.', pages: [2] },
      { word: 'listener', definition: 'Someone who pays close attention to what they hear.', pages: [4] },
      { word: 'traditions', definition: 'Customs, music and ways of life passed down from older generations.', pages: [5] },
      { word: 'rhythm', definition: 'A regular, repeated pattern of beats or sounds.', pages: [7] },
    ],
    teacherGuide: {
      overview:
        'An early-years and lower-primary story introducing the Akan atumpan talking drums while highlighting Ghana’s broader musical diversity (including the Dagomba lunna and Ewe atsimevu) and the social-emotional skill of attentive listening.',
      lessonMinutes: 30,
      learningGoals: [
        'Listen to and echo a simple low-high rhythmic pattern (kon-kon, ka-la).',
        'Explain that the Akan atumpan uses two drums (low and high tones) played with curved sticks.',
        'Recognise that Ghana has many distinct cultural and drumming traditions across different regions.',
      ],
      subjectLinks: [
        { subject: 'Creative Arts (KG 2 – Primary 1)', link: 'Rhythm, listening, echo-clapping and Ghanaian musical instruments.', status: 'to-verify' },
        { subject: 'Our World Our People / History', link: 'Appreciating diverse cultural traditions across Ghana.', status: 'to-verify' },
        { subject: 'Language and Literacy', link: 'Oral language, initial consonant blends (dr), and story sequencing.', status: 'to-verify' },
      ],
      beforeReading: [
        'Play a quick "Listen and Echo" clapping game: clap a 4-beat pattern and ask learners to wait until you finish before echoing.',
      ],
      whileReading: [
        'Invite learners to tap their knees gently for the low "kon-kon" and clap their hands for the high "ka-la" on pages 2, 6 and 7.',
      ],
      afterReading: [
        'Ask learners to share the name of a drum, song or dance from their own family or community.',
      ],
      discussion: [
        'Why did Kwame’s first try sound messy?',
        'How can a drum "talk" without using a mouth? (By matching the high and low tones of a tonal language.)',
        'What three drums from different parts of Ghana did Nana Yaw mention?',
      ],
      reflection: [
        'What does "Listen with your ears, listen with your heart" mean in our classroom?',
      ],
      mathsExtension: [
        { task: 'The rhythm "Kon-kon, ka-la" has 2 low beats and 2 high beats. How many beats is that in one call?', answer: '2 + 2 = 4 beats.' },
        { task: 'If Kwame plays the 4-beat call 2 times, how many beats does he play in all?', answer: '4 + 4 = 8 beats.' },
      ],
      differentiation: {
        support: ['Clap the rhythm slowly together as a whole class before answering the comprehension questions.'],
        stretch: ['Create your own 4-beat greeting pattern using low knee-taps and high hand-claps and teach it to a partner.'],
      },
      culturalNotes: [
        'Kwame (Saturday) and Yaw (Thursday) are Akan day names; Esi is a Fante/Akan day name for a girl born on Sunday; Akwaaba is the Akan word for welcome.',
        'The atumpan is played in pairs (male low-toned drum and female high-toned drum) with two L-shaped sticks; the lunna (dondo) is an hourglass tension drum famous in Dagbon/northern Ghana; the atsimevu is the master drum in Ewe ensembles.',
      ],
      localiseThis: ['Invite a local musician or cultural teacher to demonstrate an instrument from your school’s community.'],
    },
    narrationPlan: {
      voice: 'Warm, rhythmic Ghanaian English storyteller (Kore).',
      pace: 'Slow (about 100 words per minute) for KG 2 and Primary 1 listeners.',
      notes: ['Perform "Kon-kon, ka-la!" with a clear rhythmic beat and a warm smile.'],
    },
    music: 'Optional low-key soft piano ambience (user-togglable in reader header; off by default).',
    culturalNotes: ['Explicitly celebrates regional diversity across Ghana (Ashanti/Akan, Northern/Dagomba, Volta/Ewe) rather than treating all Ghanaian traditions as identical.'],
    reviewQuestions: ['Confirm spelling and descriptions of atumpan, lunna and atsimevu with a Ghanaian cultural music specialist.'],
  },
];
