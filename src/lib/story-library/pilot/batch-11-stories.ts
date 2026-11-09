/**
 * Batch 11: seven adventure stories across all ages: a turtle hatchling’s night crawl, a backyard safari, a treasure
 * map, a lost-in-the-forest survival story, an abandoned old village, a deep-ocean robot dive, and a student crew
 * in space planning to survive.
 *
 * Rules: the children make the decisions and use thinking, not luck; real danger is handled by safe, taught behaviour
 * (stay put, tell adults, never enter abandoned buildings); fears are named and respected; every survival number in
 * the space story is a labelled exercise, checked by script; facts come from sources in each factCheck.
 * All stories are drafts awaiting review.
 */
import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (motif: string, text: string, alt: string, narration = 'Clear, warm storyteller voice; a short pause at the end of the page.'): Page => ({
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
      notes: ['Read dialogue with a different voice for each character.', 'Pause for two seconds at each question activity.', 'Never rush the last page: let the ending land.'],
    },
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: ['Is the language right for the stated age band and reading level?', 'Is anything here inaccurate, stereotyped or unsafe for children?', ...s.reviewQuestions],
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

export const BATCH_11_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'little-turtles-big-swim',
    title: 'Little Turtle’s Big Swim',
    summary: 'A tiny turtle hatches on a dark Ghanaian beach and crawls towards the shining sea, while a little girl helps by keeping the lights off.',
    classIds: ['nursery-2', 'kg-1'],
    ageMin: 3,
    ageMax: 5,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['adventure', 'animal', 'nature'],
    themes: ['animals-and-habitats', 'night-sky', 'helping-others'],
    objectives: ['oral-language', 'sequencing', 'kindness', 'prediction', 'environmental-awareness'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names'],
    wpm: 85,
    paceWord: 'Very slow and hushed, building a little excitement at the waves',
    palette: ['#0e7490', '#fcd34d'],
    voice: 'Soft, hushed storyteller voice, brightening when the sea appears',
    characters: [
      'Nunu: a tiny olive-green sea turtle hatchling with a heart-shaped shell and dark, shiny eyes.',
      'Akpene: a girl of five with short twists, a yellow T-shirt and shorts, who whispers.',
      'Grandfather: Akpene’s grandfather, in a plain shirt and a cap, sitting quietly on a mat.',
      'A ghost crab: a small pale crab on the sand.',
    ],
    music: 'Soft waves and a gentle, rising lullaby (placeholder)',
    pages: [
      pg('🥚', 'On a warm night, deep in the sand, an egg went crack. A tiny turtle pushed out her head. Her name was Nunu.', 'A tiny turtle hatchling pushes her head out of a cracked egg in the sand.'),
      pg('⛏️', 'Nunu climbed up through the sand. All around her, brothers and sisters were climbing too. Scratch, scratch, scratch!', 'Many tiny turtles climb out of the sand at night under a moon.'),
      pg('🌊', 'The beach was big and dark. Far away, the sea was shining softly. ‘That way,’ whispered Nunu.', 'A small turtle looks across a dark beach towards a softly shining sea.'),
      pg('🦀', 'She crawled and crawled. A crab clicked its claws. Click, click! Nunu kept going.', 'The turtle crawls past a small pale crab on the sand.'),
      pg('💡', 'A bright light shone from the road. Some turtles turned the wrong way. ‘Follow me,’ called Nunu. ‘The sea is shining!’', 'Some turtles turn towards a bright street light while Nunu leads others towards the sea.'),
      pg('🌊', 'Splash! The first wave tickled Nunu’s nose. She paddled. Flap, flap, flap!', 'A wave washes over the little turtle as she paddles into the sea.'),
      pg('🤫', 'Up on the beach, a girl named Akpene sat quietly beside her grandfather. She had asked the neighbours to turn off their lights, and they kept their dog away.', 'A girl and her grandfather sit quietly on a mat, with the lights off and a sleeping dog.'),
      pg('🌙', 'Nunu swam away into the big blue sea. One day, many years later, she might come back to this very beach. The end.', 'A turtle swims away under the moonlit sea.'),
    ],
    activities: [
      { id: 'turtle-c1', type: 'comprehension', afterPage: 1, question: 'What was the tiny turtle’s name?', options: ['Nunu', 'Akpene', 'Crab'], correctIndex: 0 },
      { id: 'turtle-p1', type: 'prediction', afterPage: 3, prompt: 'The beach is dark and the sea is shining. Which way will Nunu go? Tell a friend.', options: ['Towards the sea', 'Away from the sea'] },
      { id: 'turtle-ph', type: 'phonics', afterPage: 6, targetSound: 's', prompt: 'Which words start with the s sound, like sea?', options: ['sea', 'sand', 'turtle', 'wave'], correctIndexes: [0, 1] },
      { id: 'turtle-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the story in order.', items: ['Nunu hatched in the sand.', 'Nunu crawled across the beach.', 'Nunu reached the sea.'] },
      { id: 'turtle-sel', type: 'sel', afterPage: 8, prompt: 'Akpene stayed quiet to help the turtles. How do you feel when you help animals?', feelingOptions: ['Kind', 'Proud', 'Curious', 'Sleepy'] },
    ],
    glossary: [
      { word: 'crawled', definition: 'Moved slowly along the ground.', pages: [4] },
      { word: 'crab', definition: 'A small sea animal with a hard shell and claws.', pages: [4] },
      { word: 'paddled', definition: 'Moved through water using flippers or hands.', pages: [6] },
    ],
    culturalNotes: ['Three kinds of sea turtle nest on Ghana’s beaches: olive ridley, leatherback and green turtles. Nesting runs from about August to March, according to a University of Ghana study.', 'The story is a gentle picture book. Lights near nesting beaches can confuse hatchlings; community action like switching off lights helps.'],
    reviewQuestions: ['Confirm with a Ghanaian turtle conservation group that the story’s behaviour (hatchlings head to the brightest horizon; lights can mislead them) is accurate and that advice for children is safe.'],
    guide: {
      overview: 'A gentle night adventure. The turtle is brave, but the real helper is the child who protects the dark. Use it to start talk about animals and nighttime.',
      lessonMinutes: 20,
      goals: ['Retell a short journey in order.', 'Predict which way the hatchling will go.', 'Learn one way people can help baby turtles.'],
      subjects: [['Science / Our World', 'Animals and habitats'], ['Language and Literacy', 'Sequencing and sounds']],
      before: ['Ask: have you ever been to the beach? What can you see there?'],
      during: ['Whisper the dark pages; get louder for “Splash!”.'],
      after: ['Make a paper-plate turtle and a path to the “sea”.', 'Tell children that adults and children should not touch or disturb hatchlings, and should watch quietly from far away.'],
      discussion: ['Why did some turtles turn the wrong way?', 'What did Akpene do?'],
      reflection: ['What can you do to help animals near your home?'],
      support: ['Use a floor mat as a “beach” and let children crawl like turtles.'],
      stretch: ['Draw the turtle’s journey and label the start and end.'],
      localise: ['If your school is near a coast, invite a local turtle-conservation volunteer, and follow local rules for beach visits.', 'Never encourage children to handle wild animals.'],
      factCheck: [{ claim: 'Olive ridley, leatherback and green turtles nest on Ghana’s beaches, from about August to March; olive ridleys peak around October and take about 52 days for hatchlings to emerge.', explanation: 'From a University of Ghana study of nesting sea turtles.', reference: 'University of Ghana, “Distribution and Ecology of Nesting Sea Turtles in Ghana” (ugspace.ug.edu.gh).' }, { claim: 'Hatchlings head to the brightest horizon and bright artificial lights can mislead them.', explanation: 'Widely reported in turtle conservation guidance; not verified from a named page in this session.', reference: 'A sea turtle conservation organisation or the Ghana Wildlife Division (to verify).' }],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-backyard-safari',
    title: 'The Backyard Safari',
    summary: 'Dela turns her yard into a safari with tube binoculars and a notebook, and discovers that insects have six legs, spiders have eight, and a very small adventure can be full of surprises.',
    classIds: ['kg-2', 'primary-1'],
    ageMin: 5,
    ageMax: 7,
    readingLevel: 'early',
    difficulty: 2,
    genres: ['adventure', 'nature', 'educational'],
    themes: ['animals-and-habitats', 'family'],
    objectives: ['scientific-curiosity', 'counting', 'reasoning', 'vocabulary', 'phonics'],
    ghanaianContext: 'incidental',
    culturalTags: ['village-life', 'local-names'],
    wpm: 95,
    paceWord: 'Excited whispers, with a pause at each discovery',
    palette: ['#84cc16', '#f59e0b'],
    voice: 'Bright, whispering explorer voice, with a calm mum',
    characters: [
      'Dela: a curious girl of six with two braids, a green T-shirt and shorts, with paper-tube binoculars round her neck.',
      'Edo: her little brother, four, in a blue T-shirt, who follows with a bucket.',
      'Mama: Dela’s mother, in a wrapper and a headscarf, who watches from a stool.',
      'Minibeasts: an ant, a beetle, a snail and a spider, each drawn clearly with the right number of legs.',
    ],
    music: 'Light jungle-style percussion with playful whistles (placeholder)',
    pages: [
      pg('🔭', 'Dela had two empty paper tubes, some string and a notebook. ‘Today we are going on safari,’ she told her little brother Edo. ‘We will see wild animals!’', 'A girl holds up paper-tube binoculars in a sunny yard while her brother holds a bucket.'),
      pg('🐜', 'First they crouched by the garden wall. Dela peered through her tubes. ‘I see an ant!’ She counted its legs. One, two, three, four, five, six. ‘An ant has six legs.’', 'The children crouch over a line of ants near a wall; the girl counts on her fingers.'),
      pg('🪲', 'Next, under a leaf, they found a shiny beetle. Dela counted. Six legs again. ‘So the ant and the beetle are both insects,’ she wrote. ‘Insects have six legs.’', 'The girl lifts a leaf to reveal a shiny beetle and writes in her notebook.'),
      pg('🐌', 'On the water pot, a snail slid along slowly. ‘It has no legs at all!’ said Edo. ‘Just one big foot.’ Dela giggled. ‘A snail is not an insect.’', 'A snail travels slowly on a clay pot while the boy points and laughs.'),
      pg('🕷️', 'Then Edo found a spider spinning a web between two sticks. Dela counted. ‘One, two, three, four, five, six, seven, eight! A spider has eight legs.’ ‘So a spider is not an insect either,’ said Edo.', 'A spider hangs in the centre of a web between two sticks as the children watch.'),
      pg('✋', 'Edo reached for the spider. ‘No,’ said Dela. ‘On safari, we look and do not touch. We do not know which small animals might bite, and we must not hurt them.’ Edo put his hand behind his back.', 'The girl gently holds her brother’s hand away from a spider.'),
      pg('✏️', 'They drew a chart in the notebook. Ant: 6 legs, beetle: 6 legs, snail: 0 legs, spider: 8 legs. Mama came over and smiled. ‘Which animal has the most legs?’ ‘The spider!’ said Edo.', 'A chart with four animals and numbers of legs is drawn in a notebook.'),
      pg('🌟', 'That night Dela wrote on the last page: ‘The best safari was in our own yard. There is more to see when we look carefully.’ The end.', 'The girl writes in her notebook by lamplight with her tube binoculars beside her.'),
    ],
    activities: [
      { id: 'safari-c1', type: 'comprehension', afterPage: 2, question: 'How many legs does an ant have?', options: ['Six', 'Eight', 'Four'], correctIndex: 0 },
      { id: 'safari-c2', type: 'comprehension', afterPage: 5, question: 'How many legs does a spider have?', options: ['Eight', 'Six', 'Ten'], correctIndex: 0 },
      { id: 'safari-voc', type: 'vocabulary', afterPage: 3, word: 'insects', definition: 'Small animals with six legs and three body parts.', distractors: ['Animals with eight legs', 'Animals with no legs'] },
      { id: 'safari-ph', type: 'phonics', afterPage: 5, targetSound: 'sn', prompt: 'Which words start with the sn sound, like snail?', options: ['snail', 'slid', 'spider', 'sticks'], correctIndexes: [0] },
      { id: 'safari-p1', type: 'prediction', afterPage: 6, prompt: 'Edo wants to touch the spider. What should Dela say? Tell a friend.', options: ['Look and do not touch', 'Go ahead', 'Pick it up'] },
      { id: 'safari-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the safari in order.', items: ['They saw an ant.', 'They found a snail.', 'They saw a spider.', 'They made a chart.'] },
      { id: 'safari-sel', type: 'sel', afterPage: 8, prompt: 'Dela felt curious and careful. How do you feel when you explore somewhere new?', feelingOptions: ['Curious', 'Careful', 'Excited', 'Nervous'] },
    ],
    glossary: [
      { word: 'safari', definition: 'A journey to look at wild animals.', pages: [1, 8] },
      { word: 'insects', definition: 'Small animals with six legs.', pages: [3] },
      { word: 'spider', definition: 'A small animal with eight legs that often makes a web.', pages: [5] },
    ],
    culturalNotes: ['Looking closely at everyday nature is a good first science habit. Local names for minibeasts vary by language; teachers can add them.'],
    reviewQuestions: ['Confirm the explanation that insects have six legs, spiders eight, and snails none (a snail has one muscular foot) is clear and correct for this age.'],
    guide: {
      overview: 'A safe adventure for the youngest scientists: count, compare and observe without touching. It models “look, count, record”.',
      lessonMinutes: 35,
      goals: ['Count legs and compare animals.', 'Learn that insects have six legs and spiders have eight.', 'Practise careful observation and safe behaviour outdoors.'],
      subjects: [['Science', 'Living things'], ['Mathematics', 'Counting and comparing'], ['Language and Literacy', 'Vocabulary']],
      before: ['Make paper-tube binoculars together.'],
      during: ['Let children count legs aloud on pages 2 to 5.'],
      after: ['Take a safe safari in the school yard; remind children to look but not touch.', 'Make a chart of what you saw.'],
      discussion: ['How is an insect different from a spider?', 'Why did Dela say not to touch?'],
      reflection: ['What small thing would you like to look at closely?'],
      maths: [{ task: 'An ant and a beetle together: how many legs?', answer: '6 + 6 = 12 legs.' }, { task: 'Two spiders: how many legs altogether?', answer: '8 + 8 = 16 legs.' }, { task: 'How many more legs does a spider have than an ant?', answer: '8 − 6 = 2 more legs.' }],
      support: ['Use pictures to count legs and match.'],
      stretch: ['Find another animal with a different number of legs and add it to the chart.'],
      localise: ['Check your yard for hazards such as stinging insects, snakes, sharp objects and unsafe water first. An adult must supervise.', 'Never touch unknown animals.'],
      factCheck: [{ claim: 'Insects have six legs; spiders have eight and are not insects; snails have no legs and move on one muscular foot.', explanation: 'Basic biology taught in primary science.', reference: 'A primary science textbook or Natural History Museum resources (to verify).' }],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-treasure-under-the-mango-tree',
    title: 'The Treasure Under the Mango Tree',
    summary: 'Grandfather’s hand-drawn map says “ten steps north, five steps east”, but the children’s steps are shorter than his. Yayra and Kojovi measure, calculate, and find the treasure together.',
    classIds: ['primary-1', 'primary-2'],
    ageMin: 6,
    ageMax: 8,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['adventure', 'mystery', 'family'],
    themes: ['family', 'community', 'school'],
    objectives: ['problem-solving', 'reasoning', 'teamwork', 'vocabulary', 'prediction'],
    ghanaianContext: 'incidental',
    culturalTags: ['village-life', 'local-names'],
    wpm: 100,
    paceWord: 'Brisk and excited, with steady counting',
    palette: ['#b45309', '#16a34a'],
    voice: 'Excited explorer voices; Grandfather speaks slowly and warmly',
    characters: [
      'Yayra: a sharp-eyed girl of seven with short twists, a red dress and sandals, holding the map.',
      'Kojovi: her cousin, eight, in a blue shirt and shorts, carrying a metre stick.',
      'Grandpa Dzah: an elderly man with a white beard and long, slow steps, wearing a cap and a checked shirt.',
      'A big mango tree with a swing, a well, and a small tin box.',
    ],
    music: 'Playful adventure marimba with a steady march rhythm (placeholder)',
    pages: [
      pg('🗺️', 'On Saturday, Grandpa Dzah gave Yayra a hand-drawn map. ‘Start at the well,’ he said. ‘Ten steps north, then five steps east. There is a surprise waiting.’ ‘A treasure!’ cried Yayra.', 'An old man hands a girl a hand-drawn map beside a well.'),
      pg('🧭', 'Yayra and her cousin Kojovi stood at the well. ‘Which way is north?’ asked Kojovi. Yayra pointed to the compass on her school bag. ‘The sun rises in the east,’ she said, ‘so north is on our left.’', 'Two children stand at a well, one pointing at a small compass.'),
      pg('👣', 'They walked ten steps north. They stopped. Then five steps east. They stopped again. Nothing. Only dust and a few ants. ‘The map must be wrong,’ sighed Kojovi.', 'The children stand in an empty patch of ground looking disappointed.'),
      pg('🤔', 'Yayra thought. ‘Wait. Grandpa’s legs are very long. Maybe his steps are longer than ours.’ They measured one of Grandpa’s steps with the metre stick. It was about 80 cm. Then they measured their own steps. About 50 cm.', 'The children measure steps with a metre stick on the ground, with Grandpa watching.'),
      pg('➗', '‘Grandpa’s ten steps are 10 × 80 cm, which is 800 cm, or 8 metres,’ said Kojovi. ‘One of our steps is 50 cm, so we need 800 ÷ 50 = 16 steps.’ ‘And his five steps east are 400 cm,’ said Yayra, ‘so we need 8 of ours.’', 'The children write sums on the ground with a stick.'),
      pg('🚶', 'They went back to the well and walked sixteen small steps north. Then eight small steps east. Right in front of them stood the old mango tree, with a swing hanging from its branch.', 'The children count steps along a path to a large mango tree with a swing.'),
      pg('📦', 'Grandpa Dzah knelt by the roots. He gently moved the loose soil with a trowel, and lifted out a small tin box. Inside were three marbles, a faded photograph and a letter written long ago.', 'An old man shows the children a small tin box with marbles and a photograph.'),
      pg('💛', '‘I buried this when I was a boy,’ said Grandpa. ‘These are my marbles. The letter is to the child who finds it.’ Yayra read it aloud: ‘Be curious, be kind, and always measure twice.’ The end.', 'The girl reads a letter aloud while her cousin and grandfather listen.'),
    ],
    activities: [
      { id: 'map-c1', type: 'comprehension', afterPage: 2, question: 'What did the map say to do first?', options: ['Walk ten steps north from the well', 'Climb the mango tree', 'Dig by the school'], correctIndex: 0 },
      { id: 'map-p1', type: 'prediction', afterPage: 3, prompt: 'There is nothing at the spot. Why do you think the children did not find the treasure?', options: ['Their steps are shorter than Grandpa’s', 'The treasure is not real', 'The ants took it'] },
      { id: 'map-c2', type: 'comprehension', afterPage: 5, question: 'Grandpa’s 10 steps are about 800 cm. How many 50 cm steps do the children need?', options: ['16', '8', '20'], correctIndex: 0, explanation: '800 ÷ 50 = 16.' },
      { id: 'map-voc', type: 'vocabulary', afterPage: 2, word: 'compass', definition: 'A tool with a needle that shows which way is north.', distractors: ['A kind of map', 'A type of measuring tape'] },
      { id: 'map-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the adventure in order.', items: ['Grandpa gave Yayra a map.', 'The children found nothing at the first spot.', 'They measured the steps and did the sums.', 'They found the box under the tree.'] },
      { id: 'map-sel', type: 'sel', afterPage: 8, prompt: 'Kojovi felt disappointed, then excited. How do you feel when a plan does not work at first?', feelingOptions: ['Disappointed', 'Determined', 'Excited', 'Proud'] },
    ],
    glossary: [
      { word: 'compass', definition: 'A tool that shows which way is north.', pages: [2] },
      { word: 'measured', definition: 'Found out how long or big something is.', pages: [4] },
      { word: 'treasure', definition: 'Something special and valuable that is hidden.', pages: [1] },
    ],
    culturalNotes: ['Older generations often measure by steps, hands and arm spans. The story honours that knowledge and shows why we need standard units.', 'The “treasure” is a keepsake, not money: family memories are valuable.'],
    reviewQuestions: ['Check the sums: 10 × 80 = 800 cm = 8 m; 800 ÷ 50 = 16; 5 × 80 = 400; 400 ÷ 50 = 8.', 'The compass explanation uses sunrise in the east; is that clear and correct for the time of day?'],
    guide: {
      overview: 'A treasure hunt that turns on units: different people’s steps are different lengths. It builds measuring, division and the idea of standard units.',
      lessonMinutes: 40,
      goals: ['Use north, south, east and west.', 'Measure with a metre stick.', 'Convert between two step lengths using multiplication and division.'],
      subjects: [['Mathematics', 'Measurement and division'], ['Our World Our People', 'Directions and maps'], ['Language and Literacy', 'Vocabulary and sequencing']],
      before: ['Ask: how could you describe a way to a place without words?'],
      during: ['At page 4, ask learners how they would fix the problem.'],
      after: ['Hide a small object in the school grounds and write directions in adult steps and child steps.', 'Draw a map of the classroom with a compass rose.'],
      discussion: ['Why were Grandpa’s steps different from the children’s?', 'What is the benefit of metres and centimetres?'],
      reflection: ['What would you put in your own treasure box for a future child?'],
      maths: [
        { task: 'Grandpa’s step is 80 cm. How far are 10 of his steps in cm and in metres?', answer: '10 × 80 = 800 cm = 8 metres.' },
        { task: 'A child’s step is 50 cm. How many child steps make 800 cm?', answer: '800 ÷ 50 = 16 steps.' },
        { task: 'Five of Grandpa’s steps are how many child steps?', answer: '5 × 80 = 400 cm; 400 ÷ 50 = 8 steps.' },
      ],
      support: ['Use a rope marked every 50 cm and let children count.'],
      stretch: ['Measure your own step and convert 10 m into your steps.'],
      localise: ['Use a safe outdoor area. Do not let children dig near wells or in unsafe ground.', 'Check how learners are taught to find north.'],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'lost-in-the-green-cathedral',
    title: 'Lost in the Green Cathedral',
    summary: 'On a school visit to a rainforest reserve, Selina and Ebo stray from the path and realise they are lost. Instead of running, they stop, think, make themselves easy to find, and stay calm until help arrives.',
    classIds: ['primary-4', 'primary-5'],
    ageMin: 9,
    ageMax: 11,
    readingLevel: 'fluent',
    difficulty: 3,
    genres: ['adventure', 'realistic-fiction', 'nature'],
    themes: ['fear-and-courage', 'animals-and-habitats', 'school'],
    objectives: ['problem-solving', 'perseverance', 'responsibility', 'teamwork', 'emotional-intelligence'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names'],
    wpm: 115,
    paceWord: 'Tense but steady, slowing for the calm decisions',
    palette: ['#166534', '#f97316'],
    voice: 'Hushed, tense narrator voice that grows calmer as the children make their plan',
    characters: [
      'Selina: an 11-year-old girl with neat braids, a school polo shirt and shorts, a bright orange raincoat in her bag.',
      'Ebo: her partner, 11, in a blue T-shirt and cap, with a small camera and a whistle on his bag.',
      'Mr Ntim: the forest guide, in a khaki uniform and boots, with a torch and a calm voice.',
      'The forest: very tall trees with buttress roots, hanging vines, and a roof of leaves high above.',
    ],
    music: 'Deep forest ambience with soft insect sounds and a slow, hopeful flute (placeholder)',
    pages: [
      pg('🌳', 'Selina’s class was visiting a rainforest reserve in southern Ghana. The trees were taller than the school. Mr Ntim, the guide, gave three rules: stay on the path, stay with your partner, and if you are ever lost, stop and stay where you are.', 'A school group stands at the edge of a path in a tall rainforest with a guide.'),
      pg('🦋', 'Selina’s partner Ebo loved photography. When a blue butterfly landed beside the path, he tiptoed after it. Then another. ‘Ebo, wait!’ Selina followed him. When she looked up, the path had vanished.', 'A boy with a camera follows a butterfly into thick forest while a girl follows.'),
      pg('🌿', 'The forest looked the same in every direction: trunks, vines, leaves. The thick leaves high above, called the canopy, blocked most of the sun. ‘Which way did we come from?’ asked Ebo. ‘I do not know,’ said Selina. Her heart began to pound.', 'The children stand in dim green light among identical tree trunks, looking worried.'),
      pg('✋', 'Ebo wanted to run. ‘Wait,’ said Selina. She remembered Mr Ntim’s rule, and a word to remember: STOP. Stop moving. Think. Observe. Plan. ‘If we wander, we get more lost,’ she said, ‘and the group will search along the path.’', 'The girl holds up her hand to stop the boy from running.'),
      pg('🧢', 'They counted what they had: one bottle of water, two biscuits, a whistle on Ebo’s bag and Selina’s bright orange raincoat. Selina tied the coat to a low branch. ‘Now we are easier to see,’ she said. ‘The plan: three short whistle blasts, then listen.’', 'The girl ties an orange raincoat to a branch while the boy counts supplies.'),
      pg('📢', 'Pheep, pheep, pheep! They listened. Insects hummed. Far above, branches crashed as monkeys moved. Nothing else. They waited a few minutes and blew again. They sat close together on a log, took small sips of water and breathed slowly to stay calm.', 'The children sit on a log; one blows a whistle while the other listens.'),
      pg('🔦', 'On the fourth try, they heard a faint answer: three whistles, far away. Then a voice: ‘Selina! Ebo!’ ‘Here!’ they shouted, and blew again. Mr Ntim’s torch beam found the orange raincoat first. ‘Good raincoat,’ he said.', 'A guide with a torch appears between the trees, lighting the orange raincoat.'),
      pg('🌟', 'On the path, Mr Ntim said, ‘You did the right things: you stopped, stayed put, made yourselves easy to find and stayed calm.’ Ebo apologised. ‘Next time, photos from the path,’ he said. Selina looked up at the huge trees. ‘The forest is not our enemy,’ she said. ‘It is just very big, and we must respect it.’ The end.', 'The children walk back to the group on the path with the guide behind them.'),
    ],
    activities: [
      { id: 'forest-c1', type: 'comprehension', afterPage: 1, question: 'What was Mr Ntim’s rule about being lost?', options: ['Stop and stay where you are', 'Run to find the path', 'Climb a tree'], correctIndex: 0 },
      { id: 'forest-p1', type: 'prediction', afterPage: 4, prompt: 'Ebo wants to run, but Selina says to stop. What do you think will happen if they wander?', options: ['They could get more lost', 'They will find the path quickly', 'Nothing will change'] },
      { id: 'forest-c2', type: 'comprehension', afterPage: 5, question: 'Why did Selina tie her orange raincoat to a branch?', options: ['To make them easier to see', 'To keep dry', 'To mark a path to the road'], correctIndex: 0 },
      { id: 'forest-voc', type: 'vocabulary', afterPage: 3, word: 'canopy', definition: 'The roof of leaves and branches high up in a forest.', distractors: ['The floor of the forest', 'A river in the forest'] },
      { id: 'forest-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the children’s survival steps in order.', items: ['Stop moving.', 'Count what they have.', 'Make themselves easy to find.', 'Whistle in threes and listen.'] },
      { id: 'forest-sel', type: 'sel', afterPage: 8, prompt: 'Selina’s heart pounded, but she stayed calm. What helps you stay calm when you feel afraid?', feelingOptions: ['Scared', 'Calm', 'Brave', 'Relieved'] },
    ],
    glossary: [
      { word: 'canopy', definition: 'The roof of leaves and branches high above a forest floor.', pages: [3] },
      { word: 'whistle', definition: 'A small tool that makes a loud, high sound when you blow it.', pages: [5] },
      { word: 'observe', definition: 'Look carefully and notice what is around you.', pages: [4] },
    ],
    culturalNotes: ['Ghana’s forest reserves and national parks, such as Kakum in the Central Region, protect rainforest wildlife, including forest elephants, leopards and bongo according to the Ghana tourism listing. The story’s reserve is invented.', 'The story respects traditional awe for the forest: it is a place to honour and to be careful in.'],
    reviewQuestions: ['Have an outdoor-safety or forestry professional confirm the advice (stop, stay put, signals in threes, make yourself visible, conserve water).', 'Is the guide’s role appropriate (he is the rescuer, but the children make the decisions)?'],
    guide: {
      overview: 'A survival adventure built on a real safety habit: when lost, stay put and make yourself easy to find. The children use thinking, not luck.',
      lessonMinutes: 40,
      goals: ['Explain what to do if lost outdoors.', 'Name the layers and features of a rainforest.', 'Talk about fear and staying calm.'],
      subjects: [['Integrated Science', 'Forests and habitats'], ['Personal and Social Development', 'Safety and calm decision-making'], ['English Language', 'Narrative and inference']],
      before: ['Ask: what would you do if you were separated from your group in a big place?'],
      during: ['At page 4, ask learners to say what STOP stands for.'],
      after: ['Role-play the story in groups with the “STOP” plan.', 'Practise three whistle blasts as a safety signal in the school yard (not near other classes).'],
      discussion: ['Why was staying put smart?', 'What helped Selina stay calm?'],
      reflection: ['What simple safety rule do you always follow on a trip?'],
      maths: [{ task: 'They blow the whistle every 3 minutes. How many blasts in 15 minutes?', answer: '15 ÷ 3 = 5 sets of blasts (3 short blasts each).' }, { task: 'A bottle holds 500 ml and they share it equally between two children. How much each?', answer: '250 ml each.' }],
      support: ['Provide picture cards for each step of STOP.'],
      stretch: ['Write a trip safety checklist for your class, with at least six points.'],
      localise: ['Match the safety advice to your local context and school policy.', 'Always teach that trips need adults and clear groups; the story is not encouragement to wander.'],
      factCheck: [{ claim: 'The advice to stop, stay in one place, make yourself visible, signal in threes and conserve water is standard wilderness safety guidance.', explanation: 'Not verified from a named page in this session; wording may differ by country.', reference: 'A local forestry or national park safety guide, or a recognised outdoor safety organisation (to verify).' }, { claim: 'Kakum National Park protects rainforest in Ghana’s Central Region with a canopy walkway; exact walkway length and height vary between sources.', explanation: 'Sources disagree on figures, so the story does not quote them.', reference: 'Ghana Wildlife Division or Ghana Tourism Authority (check current details).' }],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-ghosts-of-old-akokoaso',
    title: 'The Ghosts of Old Akokoaso',
    summary: 'Children say that the abandoned old village is haunted. Yakubu and Adoma ask the elders for permission and study the “ghosts” like detectives, learning why the village was left and why its story matters.',
    classIds: ['primary-5', 'primary-6'],
    ageMin: 10,
    ageMax: 12,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['mystery', 'adventure', 'cultural'],
    themes: ['community', 'fear-and-courage', 'school'],
    objectives: ['critical-thinking', 'reasoning', 'respect', 'cultural-heritage', 'scientific-curiosity'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 120,
    paceWord: 'Atmospheric and measured, with a calm turn at dusk',
    palette: ['#78350f', '#a16207'],
    voice: 'Atmospheric voice at the start, warm and curious as the mystery is explained',
    characters: [
      'Yakubu: an 11-year-old boy in a white shirt and shorts, with a notebook and a small torch.',
      'Adoma: an 11-year-old girl with short braids, a yellow blouse and navy skirt, holding a strip of paper.',
      'Opanin Boakye: a retired teacher, about 70, in a long cloth over one shoulder, with a walking stick.',
      'Madam Gyan: their teacher, in a lilac dress, with a clipboard.',
      'Old Akokoaso: low mud walls, a tilted house with a rusty tin roof, an old grinding stone, and a bat roost in a broken wall.',
    ],
    music: 'Low drum and a slow flute, lightening to a warm theme at the end (placeholder)',
    pages: [
      pg('🏚️', 'Half a kilometre past the new school, a dirt track led to Old Akokoaso, where Yakubu’s great-grandparents once lived. Nobody lived there now; it was abandoned. Children whispered that it was haunted: lights flickered, footsteps clicked, and a cold breath came from the doorways.', 'A dirt track leads towards ruined mud houses under a darkening sky.'),
      pg('🤝', 'Yakubu and Adoma wanted the truth. Madam Gyan said, ‘First, we ask permission. The old village belongs to the community.’ The chief and elders agreed, with three rules: go with adults, enter no buildings, touch and take nothing.', 'Two children and a teacher speak respectfully to a chief and elders.'),
      pg('🧓', 'Opanin Boakye, a retired teacher, walked them to the edge of the old village. They saw low mud walls, a tilted house with a rusty tin roof and a grinding stone. ‘When the new road was built on the other side of the hill,’ he said, ‘the shops, school and clinic moved there, and people followed. These were our families’ homes.’', 'An elder points out ruined mud walls and an old grinding stone to the children.'),
      pg('📝', 'The detectives listed the ghost clues and guessed natural causes. Lights: fireflies, or moonlight on broken glass. Footsteps: animals, or the tin roof. Cold breath: moving air. ‘A hypothesis is a guess we can test,’ said Adoma.', 'The children write three columns in a notebook: clue, guess, test.'),
      pg('🌇', 'At dusk, they sat on a log at a safe distance with Opanin Boakye. As the sun went down, the old tin roof began to tick and click, as if someone was walking on it. ‘Metal shrinks a little as it cools,’ said Yakubu. He wrote the time: 6:20 p.m.', 'The children sit on a log at dusk looking at a tin roof with the sun going down.'),
      pg('🦇', 'Then hundreds of small shapes poured from a gap in the wall against the orange sky. ‘Bats,’ whispered Adoma. ‘They sleep in the ruins by day and fly out at dusk.’ Over the grass, little lights blinked on and off: fireflies. ‘Ghost lights,’ whispered Yakubu, and grinned.', 'Bats stream out of a broken wall while fireflies glow over the grass.'),
      pg('🍃', 'A breeze moved through an empty doorway and made a low whoosh, like breathing. Adoma held up a strip of paper. It fluttered. ‘Moving air,’ she said. They did not laugh at the old stories. ‘Stories can be a way of saying: this place matters, be careful,’ said Opanin Boakye. ‘And old walls can fall. That is a real reason to keep out.’', 'A strip of paper flutters in the wind as an elder speaks to the children.'),
      pg('📜', 'Back at school, the class made a poster: What we saw, What we think, What we still ask. They thanked the elders, and with the chief’s permission, the community planned to clear the path and put up a sign telling the village’s story. The ghosts were gone, but the story of Old Akokoaso was louder than ever. The end.', 'A classroom poster with three columns and a drawing of the old village.'),
    ],
    activities: [
      { id: 'ghost-c1', type: 'comprehension', afterPage: 2, question: 'What did the children do before visiting Old Akokoaso?', options: ['They asked the chief and elders for permission', 'They went at night alone', 'They sent a letter to the newspaper'], correctIndex: 0 },
      { id: 'ghost-p1', type: 'prediction', afterPage: 4, prompt: 'The children have guessed natural causes for the “ghost” clues. How could they test the guess about the footsteps?', options: ['Listen near the tin roof at dusk', 'Go inside the house', 'Ask the ghost'] },
      { id: 'ghost-c2', type: 'comprehension', afterPage: 5, question: 'What natural thing explained the ticking of the tin roof?', options: ['Metal shrinks slightly as it cools', 'A person walking on it', 'A radio inside'], correctIndex: 0 },
      { id: 'ghost-voc', type: 'vocabulary', afterPage: 4, word: 'hypothesis', definition: 'A guess that can be tested to see if it is true.', distractors: ['A kind of ghost', 'A type of map'] },
      { id: 'ghost-c3', type: 'comprehension', afterPage: 7, question: 'Why did Opanin Boakye say it was a real reason to keep out of the old buildings?', options: ['Old walls can fall', 'Ghosts live there', 'The buildings are locked'], correctIndex: 0 },
      { id: 'ghost-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the investigation in order.', items: ['Ask the chief and elders for permission.', 'List the ghost clues and guess causes.', 'Observe at dusk from a safe distance.', 'Make a poster of what they found.'] },
      { id: 'ghost-sel', type: 'sel', afterPage: 8, prompt: 'The children felt nervous, then curious, and still respected the old stories. How can you be curious and respectful at the same time?', feelingOptions: ['Nervous', 'Curious', 'Respectful', 'Proud'] },
    ],
    glossary: [
      { word: 'abandoned', definition: 'Left behind, with nobody living or working there.', pages: [1] },
      { word: 'hypothesis', definition: 'A guess that can be tested.', pages: [4] },
      { word: 'permission', definition: 'Agreement from someone in charge that you may do something.', pages: [2] },
      { word: 'fireflies', definition: 'Small beetles that make flashes of light at night.', pages: [6] },
    ],
    culturalNotes: ['Many Ghanaian communities have old settlements that people left when roads, schools or farms moved. These places can hold family memories and community history, and may have spiritual significance. The story’s village is invented.', 'Ghost stories can carry community meanings; the story does not mock belief, and the elders’ view is part of the learning.'],
    reviewQuestions: ['Is the treatment of local belief respectful (the investigation explains natural causes without ridiculing the stories)?', 'Is it clear that children must never enter abandoned buildings, handle bats or go at night without adults?'],
    guide: {
      overview: 'A mystery in which children get permission, observe, test and still respect their community’s stories. It balances scientific explanation with heritage and safety.',
      lessonMinutes: 45,
      goals: ['Use a hypothesis and observation to explain strange events.', 'Explain why permission and respect matter at heritage places.', 'Identify real safety hazards in old buildings.'],
      subjects: [['Integrated Science', 'Observation and hypotheses'], ['Social Studies / History', 'Local history and heritage'], ['Personal and Social Development', 'Respect and safety']],
      before: ['Ask: what strange story have you heard about a place near you?'],
      during: ['At page 4, ask learners to propose a test for each clue.'],
      after: ['Interview an elder (with permission) about a place in your community that people left or changed.', 'Make a “What we saw, what we think, what we still ask” poster.'],
      discussion: ['Why did the children ask permission first?', 'What do stories about a place do for a community?'],
      reflection: ['What place in your community deserves to be remembered?'],
      maths: [{ task: 'The track is half a kilometre long. How many metres is that?', answer: '500 metres.' }, { task: 'The detectives arrived at 5:45 p.m. and noted the first click at 6:20 p.m. How many minutes did they wait?', answer: '35 minutes.' }],
      support: ['Provide a three-column chart: clue, guess, test.'],
      stretch: ['Choose a ghost story from your area and design two safe, respectful ways to test the natural explanations.'],
      localise: ['Check local customs and permissions; some places are sacred. Never encourage children to visit abandoned places without adults.', 'Do not handle bats or enter old buildings.'],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'down-where-the-light-ends',
    title: 'Down Where the Light Ends',
    summary: 'Aba flies a robot submarine down through the sunlight, twilight and midnight zones of the Gulf of Guinea. When the cable snags, she must stay calm and think before she acts, and then she records a creature nobody can name.',
    classIds: ['primary-6', 'jhs-1'],
    ageMin: 11,
    ageMax: 13,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['adventure', 'science', 'realistic-fiction'],
    themes: ['animals-and-habitats', 'technology', 'fear-and-courage'],
    objectives: ['scientific-curiosity', 'problem-solving', 'reasoning', 'perseverance', 'vocabulary'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Smooth and awed, with tension at the snag',
    palette: ['#075985', '#0f172a'],
    voice: 'Calm, awed voice; Dr Sekyi is quiet and steady',
    characters: [
      'Aba: a 12-year-old girl with short natural hair, a navy polo shirt with a ship’s badge, wearing a headset.',
      'Pius: her classmate, 12, in a similar polo shirt, with a clipboard and the depth chart.',
      'Dr Sekyi: the chief scientist, a woman in a white lab shirt and a life jacket over it.',
      'The ROV: a small yellow robot submarine with bright lamps, a camera, a claw and thrusters, attached to a long thin cable.',
    ],
    music: 'Deep, calm synths with slow bubbles, darkening as the dive goes deeper (placeholder)',
    pages: [
      pg('🚢', 'Aba and her classmate Pius had won a school science prize: a day aboard a research ship in the Gulf of Guinea, helping to run a robot submarine called an ROV. Dr Sekyi, the chief scientist, gave Aba the controls. ‘The ship is our lifeline,’ she said. ‘The ROV is our eyes.’', 'Two students in life jackets stand in front of a control screen on a ship with a scientist.'),
      pg('🔵', 'The ROV slid below the waves. On the screen, the sea was bright blue. At 10 m, the ROV’s red paint turned grey. ‘Red light does not travel far in water,’ said Pius. ‘Blue goes deepest.’', 'A small yellow robot descends in deep blue water with its red markings looking grey.'),
      pg('🌅', 'At 200 m, the blue faded. This is the bottom of the sunlight zone. ‘Now the twilight zone,’ read Aba from the chart. ‘From 200 m to 1,000 m, the light is very faint.’ Silvery fish with huge eyes drifted past the lamps.', 'A robot lamp lights silvery fish with large eyes in dim blue water.'),
      pg('⬛', 'At 1,000 m, the screen went black except for the ROV’s lamps. ‘This is the midnight zone, and the water presses on the ROV with about 100 atmospheres more than at the surface,’ said Pius. ‘Pressure rises by about one atmosphere for every 10 m, and 1,000 ÷ 10 is 100.’', 'The screen is black except for the circle of the robot’s lamps; a depth gauge shows 1,000 m.'),
      pg('✨', 'Suddenly tiny blue lights flashed across the screen like fireworks. ‘Bioluminescence!’ said Aba. ‘Animals making their own light.’ A jellyfish rippled past, glowing. In the midnight zone, the only light is the light that animals make.', 'Tiny blue lights flash around a glowing jellyfish in the dark water.'),
      pg('⚠️', 'Then the picture shook. A current had pushed the ROV sideways and its tether, the cable to the ship, had snagged on a rock. Alarms beeped. ‘Do not pull hard,’ said Dr Sekyi quietly. Aba’s hands were sweating. ‘Think,’ she told herself. She stopped the thrusters, then reversed very gently and waited.', 'The screen shakes with a red warning light as the robot’s cable catches on a rock.'),
      pg('✅', 'The cable slipped free. The picture steadied. Everyone breathed out. ‘Good flying, and a good decision,’ said Dr Sekyi. ‘You did not panic and you did not push harder.’ Aba checked the clock. ‘We have used our planned time and the current is getting stronger. We should bring it up. A good explorer knows when to stop.’', 'The students and scientist watch the screen steady with relief.'),
      pg('🪼', 'As the ROV rose, the camera caught one more thing: a see-through, bell-shaped animal pulsing with soft red and blue light. Nobody on board could name it. ‘It might be known, or it might be new,’ said Dr Sekyi. ‘You recorded it well. Now we check.’ Aba wrote in her log: Most of the deep seafloor has still not been mapped in detail. The end.', 'A glowing see-through bell-shaped animal is shown on the control screen.'),
    ],
    activities: [
      { id: 'ocean-c1', type: 'comprehension', afterPage: 2, question: 'Why did the ROV’s red paint look grey at 10 m?', options: ['Red light does not travel far in water', 'The paint washed off', 'The camera was broken'], correctIndex: 0 },
      { id: 'ocean-p1', type: 'prediction', afterPage: 3, prompt: 'The ROV is passing 200 m. What do you expect the light to be like at 1,000 m?', options: ['Almost none', 'Brighter than at the surface', 'The same as at 100 m'] },
      { id: 'ocean-c2', type: 'comprehension', afterPage: 4, question: 'In the midnight zone, where does light come from?', options: ['Animals that make their own light', 'The Sun', 'The Moon'], correctIndex: 0 },
      { id: 'ocean-voc', type: 'vocabulary', afterPage: 5, word: 'bioluminescence', definition: 'Light made by living things.', distractors: ['A kind of ocean current', 'A type of sonar'] },
      { id: 'ocean-c3', type: 'comprehension', afterPage: 7, question: 'Why did Aba decide to bring the ROV up?', options: ['The planned time was used up and the current was getting stronger', 'It ran out of battery', 'She was bored'], correctIndex: 0 },
      { id: 'ocean-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the ocean zones in order, from the surface downwards.', items: ['Sunlight zone', 'Twilight zone', 'Midnight zone'] },
      { id: 'ocean-sel', type: 'sel', afterPage: 8, prompt: 'Aba’s hands were sweating, but she stayed calm and thought. When have you had to stay calm and think under pressure?', feelingOptions: ['Nervous', 'Calm', 'Proud', 'Amazed'] },
    ],
    glossary: [
      { word: 'ROV', definition: 'A remotely operated vehicle: a robot submarine controlled from a ship.', pages: [1] },
      { word: 'tether', definition: 'A cable that connects a robot to its ship.', pages: [6] },
      { word: 'bioluminescence', definition: 'Light made by living things.', pages: [5] },
      { word: 'thrusters', definition: 'Small propellers that push a robot through water.', pages: [6] },
    ],
    culturalNotes: ['Ghana’s coastline faces the Gulf of Guinea. The ship, crew and prize in this story are invented; the zones and measurements are real. Fishing communities hold deep knowledge of the sea; invite a fisher or elder to share.', 'The story shows a girl taking a technical role and practising calm decision-making.'],
    reviewQuestions: ['Check ocean-zone depths and the pressure rule of thumb (about 1 atmosphere per 10 m) with a marine science teacher.', 'Check the “most of the deep seafloor has not been mapped in detail” statement against the latest figure from the Seabed 2030 project or the IHO before publication.'],
    guide: {
      overview: 'An adventure that teaches the ocean zones by making the reader descend through them, with a calm problem-solving moment at the snag.',
      lessonMinutes: 50,
      goals: ['Name the ocean zones and depths.', 'Explain why colours and light change with depth.', 'Describe how to respond calmly to a technical problem.'],
      subjects: [['Integrated Science', 'Oceans, light and pressure'], ['Mathematics', 'Division and scale'], ['ICT / Technology', 'Remote vehicles']],
      before: ['Ask: how deep do you think the ocean goes, and what lives there?'],
      during: ['At page 4, ask learners to explain the pressure calculation.'],
      after: ['Make a depth chart on the school wall: 1 cm = 100 m of depth.', 'Discuss: what decisions would you make as ROV pilot?'],
      discussion: ['Why did Aba reverse slowly?', 'How did the team know when to stop?'],
      reflection: ['What would you like to ask a marine scientist?'],
      maths: [
        { task: 'The twilight zone is from 200 m to 1,000 m. How thick is it?', answer: '1,000 − 200 = 800 m.' },
        { task: 'Pressure rises by about 1 atmosphere per 10 m. How much extra pressure at 1,000 m?', answer: '1,000 ÷ 10 = 100 atmospheres more than at the surface.' },
        { task: 'The deepest point in the Mariana Trench is about 10,994 m. How many times deeper than 1,000 m is that, to the nearest whole number?', answer: '10,994 ÷ 1,000 ≈ 11 times.' },
      ],
      support: ['Provide a depth chart with the zones already coloured.'],
      stretch: ['Design a deep-sea creature that could live at 1,000 m, and explain how it makes light or finds food.'],
      localise: ['Invite a local fisher or marine scientist.', 'Never encourage children to swim or dive into deep water; the story is about a robot.'],
      factCheck: [
        { claim: 'Ocean zones: sunlight zone surface to 200 m; twilight zone 200 m to 1,000 m; midnight zone 1,000 m to 4,000 m with constant darkness except animal bioluminescence; the Mariana Trench’s bottom is about 10,994 m.', explanation: 'From the NOAA JetStream “Layers of the Ocean” page.', reference: 'NOAA, “Layers of the Ocean” (noaa.gov/jetstream/ocean/layers-of-ocean).' },
        { claim: 'Pressure rises by about one atmosphere for every 10 metres of depth.', explanation: 'Consistent with NOAA’s figure of more than 5,850 psi at 4,000 m, but not stated in this form on the page.', reference: 'Physics textbook or NOAA Ocean Exploration (to verify).' },
        { claim: 'Red light is absorbed quickly in water and blue light travels deepest.', explanation: 'Standard optics; not verified from a named page in this session.', reference: 'NOAA Ocean Exploration or a physics textbook (to verify).' },
      ],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'ninety-two-minutes',
    title: 'Ninety-Two Minutes',
    summary: 'In a fictional future, four Ghanaian student cadets are left alone on a small orbital station after a power fault and a delayed shuttle. They count their water, oxygen and food, plan for the worst, share the work and send a message home, every ninety-two minutes.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 13,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['science-fiction', 'adventure', 'science'],
    themes: ['technology', 'leadership', 'fear-and-courage'],
    objectives: ['problem-solving', 'reasoning', 'teamwork', 'critical-thinking', 'perseverance', 'honesty'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names', 'proverb'],
    wpm: 130,
    paceWord: 'Tense and precise, slowing down for the calculations',
    palette: ['#1e1b4b', '#fbbf24'],
    voice: 'Calm, steady narrator voice; the cadets speak quietly and clearly',
    characters: [
      'Kwamena: a 15-year-old boy, crew leader, in a navy flight suit with a Ghana flag patch, calm and thoughtful.',
      'Salma: a 15-year-old girl, engineer, in a navy flight suit, with a hijab tucked under a soft cap and a tool belt.',
      'Mina: a 15-year-old girl, medic, in a navy flight suit with a first-aid pouch and short braids.',
      'Atta: a 15-year-old boy, navigator, in a navy flight suit, always with a notebook of numbers.',
      'Commander Danquah and Pilot Ofosu: two experienced astronauts, seen only in the opening and closing scenes.',
      'Sankofa Station: a small orbital laboratory with a bright cabin, a window showing Earth, and a panel of dials.',
    ],
    music: 'Slow electronic pulse with soft orchestral swells, quiet and tense (placeholder)',
    pages: [
      pg('🛰️', 'This is a story set in a possible future. In 2064, four Ghanaian students aged fifteen were on a week-long training flight aboard Sankofa Station, a small laboratory about 400 km above Earth. Kwamena was crew leader, Salma the engineer, Mina the medic, and Atta the navigator. Commander Danquah and Pilot Ofosu had taken a shuttle for a short repair job and would be back in ninety minutes.', 'Four teenage cadets in flight suits float in a small station with Earth in the window.'),
      pg('⚡', 'Ninety minutes passed. A message crackled: ‘Shuttle damaged… docking delayed… up to seven days… conserve power…’ Then silence. At the same moment, half the lights went out. ‘Solar array fault,’ said Salma, reading a panel. ‘Half our power is gone.’ Mina’s hands shook. Kwamena took a breath. ‘First, we stay calm. Second, we make a plan, with numbers.’', 'The cabin lights dim and four cadets look at a flickering panel.'),
      pg('📋', 'Atta found the supply log. Water: 60 kg. Emergency oxygen: 26 kg. Food: 24 kg. Mina read from her notes: ‘Each person needs up to about 1 kg of oxygen, about 3 kg of drinking water and about 0.8 kg of food a day.’ For four people that is 4 kg of oxygen, 12 kg of water and 3.2 kg of food every day.', 'A cadet reads numbers from a supply log while another writes them on a board.'),
      pg('🧮', 'Salma did the sums. Oxygen: 26 ÷ 4 = 6.5 days. Water: 60 ÷ 12 = 5 days. Food: 24 ÷ 3.2 = 7.5 days. ‘Water is our limit,’ said Atta. ‘Five days. But help may take seven.’ Mina spoke. ‘A person needs at least a little over 2 kg of drinking water a day. If we cut washing water to almost nothing and each drink 2.5 kg, we use 10 kg a day, and 60 ÷ 10 = 6 days.’ ‘Still one day short,’ said Atta.', 'The cadets write three sums on a whiteboard and circle the smallest answer.'),
      pg('💧', 'Salma had an idea. ‘The cabin air carries water from our breath and sweat. The air dryer can still run on the battery. If it recovers about 4 kg of water a day, we only need to supply 10 − 4 = 6 kg.’ She worked it out. ‘60 ÷ 6 = 10 days. That is more than seven, and we would have three days to spare.’ Nobody cheered, but everyone breathed more easily.', 'A cadet shows a diagram of the air dryer collecting water droplets.'),
      pg('🔌', 'Power was the next problem. With half the solar panels gone, they had to choose what to switch off. They kept the air fans, the carbon dioxide scrubber, the air dryer and the radio. They switched off the extra lights, the games screen and the heater to the empty lab. They also rested more, because resting uses less oxygen. ‘Every choice has a cost,’ said Mina. ‘We write each one down.’', 'The cadets switch off non-essential panels, leaving four green lights.'),
      pg('📡', 'Every 92 minutes, the station completed one orbit of Earth, so they saw about sixteen sunrises a day. Atta worked out when they passed over Africa and could be heard by the ground station. They sent the same short message each time: Four crew safe. Water: ten days. Air: good. Power: half. Atta thought of GhanaSat-1, a tiny cube satellite built by engineers at All Nations University and released from the space station in 2017. ‘If a small team could do that,’ he said, ‘we can send a message.’', 'Atta types a message at a radio panel with Earth glowing in the window behind him.'),
      pg('🏠', 'On the sixth day the radio crackled: ‘Sankofa Station, this is Commander Danquah. We heard you. We are two hours from docking.’ The cadets cheered quietly, to save energy. When the shuttle docked, the Commander checked the log: every sum and every decision. ‘You did what trained crews do,’ he said. ‘You stayed calm, counted, shared the work and told the truth about the numbers.’ Kwamena smiled. ‘And we only argued twice,’ he said. The end.', 'The shuttle docks as four cadets float together smiling by the window.'),
    ],
    activities: [
      { id: 'space-c1', type: 'comprehension', afterPage: 4, question: 'Which resource was the cadets’ limit at first?', options: ['Water, lasting 5 days', 'Oxygen, lasting 6.5 days', 'Food, lasting 7.5 days'], correctIndex: 0, explanation: '60 ÷ 12 = 5 days, which is less than oxygen (6.5) or food (7.5).' },
      { id: 'space-c2', type: 'comprehension', afterPage: 5, question: 'How did recovering water from the cabin air change the plan?', options: ['The supply lasted 10 days instead of 6', 'It made no difference', 'It used more oxygen'], correctIndex: 0, explanation: '60 ÷ (10 − 4) = 10 days.' },
      { id: 'space-p1', type: 'prediction', afterPage: 6, prompt: 'Power is limited. What should the cadets keep switched on, and what could they switch off?', options: ['Keep air fans, scrubber, dryer, radio; switch off extra lights and games', 'Keep the games screen and switch off the scrubber', 'Switch everything off'] },
      { id: 'space-voc', type: 'vocabulary', afterPage: 6, word: 'scrubber', definition: 'A device that removes carbon dioxide from the air.', distractors: ['A cleaning brush', 'A type of antenna'] },
      { id: 'space-c3', type: 'comprehension', afterPage: 7, question: 'About how many sunrises do astronauts on the space station see each day?', options: ['About sixteen', 'One', 'About four'], correctIndex: 0, explanation: 'Each orbit takes about 92 minutes, so there are around 16 sunrises a day.' },
      { id: 'space-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the cadets’ plan in order.', items: ['Stay calm and decide to plan with numbers.', 'Calculate how long each supply lasts.', 'Find ways to stretch the limiting supply.', 'Decide what power to keep and what to switch off.', 'Send a message every orbit.'] },
      { id: 'space-sel', type: 'sel', afterPage: 8, prompt: 'Mina’s hands shook at first, but she helped the team. What helps you do your best when you feel afraid?', feelingOptions: ['Afraid', 'Calm', 'Determined', 'Hopeful'] },
    ],
    glossary: [
      { word: 'scrubber', definition: 'A device that removes carbon dioxide from the air.', pages: [6] },
      { word: 'orbit', definition: 'The curved path of an object going around a planet.', pages: [7] },
      { word: 'array', definition: 'A set of solar panels working together.', pages: [2] },
      { word: 'cadets', definition: 'Young people training for a career such as flying.', pages: [8] },
    ],
    culturalNotes: ['This is science fiction: Sankofa Station, the 2064 setting, the cadets and the supply numbers are invented. The astronaut needs, orbit time and number of sunrises are based on real sources.', 'GhanaSat-1, built by engineers at All Nations University in Ghana, was launched to the International Space Station in June 2017 and released into orbit in July 2017.', '“Sankofa” is an Akan idea about learning from the past; the station’s name nods to it.'],
    reviewQuestions: ['Confirm with an aerospace engineer that the story’s numbers are clearly labelled as simplified and that nothing could be mistaken for real safety guidance.', 'Check the life-support figures: oxygen up to about 1 kg, drinking water about 2.3 to 3.6 kg, food about 0.5 to 0.9 kg per person per day (National Academies, citing Eckart, 1996).', 'Is “a possible future” a clear enough label for readers who might think this is real?'],
    guide: {
      overview: 'A science-fiction adventure where the main action is arithmetic and calm teamwork. Learners can recalculate each plan and test what would change if a supply, power level or rescue time changed.',
      lessonMinutes: 55,
      goals: ['Calculate how long supplies last for several people.', 'Find the limiting resource and plan ways to extend it.', 'Discuss leadership, honesty and calm decisions under pressure.'],
      subjects: [['Mathematics', 'Rates, division and multi-step problems'], ['Integrated Science', 'Life support and orbits'], ['Personal and Social Development', 'Leadership and teamwork']],
      before: ['Ask: what do humans need every day to stay alive?'],
      during: ['At pages 3 to 5, ask learners to do each calculation before the text does.'],
      after: ['Change one number (for example, the water becomes 48 kg) and recalculate the plan.', 'Debate: which two roles on the crew mattered most, and why?'],
      discussion: ['Why was it important to write down every decision?', 'What was the most important thing the crew did before they started calculating?'],
      reflection: ['What would you want to be responsible for if you were on the crew?'],
      maths: [
        { task: 'For 4 people, oxygen use is 1 kg per person per day. How many days does 26 kg last?', answer: '26 ÷ 4 = 6.5 days.' },
        { task: 'Water use is 3 kg per person per day for 4 people. How many days does 60 kg last?', answer: '60 ÷ 12 = 5 days.' },
        { task: 'Food use is 0.8 kg per person per day for 4 people. How many days does 24 kg last?', answer: '24 ÷ 3.2 = 7.5 days.' },
        { task: 'If each person uses 2.5 kg of water a day, and the air dryer returns 4 kg a day, how many days does 60 kg last?', answer: '4 × 2.5 = 10 kg a day; 10 − 4 = 6 kg net; 60 ÷ 6 = 10 days.' },
        { task: 'An orbit takes 92 minutes. About how many orbits are there in 24 hours?', answer: '24 × 60 = 1,440 minutes; 1,440 ÷ 92 ≈ 15.7, so about 16 orbits.' },
      ],
      support: ['Provide a table with Supply, Amount, Daily use and Days, ready to fill in.'],
      stretch: ['Add a fifth crew member to the problem and rebuild the plan. Which resource becomes the limit now?'],
      localise: ['Label this clearly as fiction. Do not present the numbers as real mission data.', 'Invite a local science or engineering role model, and connect to Ghana’s own space and satellite work.'],
      discoveryStatus: {
        whatWeKnow: ['A person needs oxygen, water and food every day, and the amounts can be estimated.', 'The International Space Station orbits at about 400 km and takes about 92 minutes to go around Earth.', 'GhanaSat-1 was built by engineers at All Nations University and launched in 2017.'],
        whatWeAreStillDiscovering: ['How to recycle air and water for very long missions with even greater efficiency.', 'How best to support people’s mental health on long space missions.'],
      },
      factCheck: [
        { claim: 'Each person needs roughly 0.64 to 1 kg of oxygen, 2.3 to 3.6 kg of drinking water and 0.5 to 0.9 kg of food per day.', explanation: 'From a National Academies table (citing Eckart, 1996). The story rounds up to simple numbers.', reference: 'National Academies, “Advanced Technology for Human Support in Space” (1997), Table 2-1.' },
        { claim: 'The ISS orbits at about 400 km, takes about 92 minutes per orbit and crews see 16 sunrises and sunsets a day.', explanation: 'From the European Space Agency.', reference: 'ESA, “Where is the International Space Station?”' },
        { claim: 'GhanaSat-1 was built by All Nations University engineers, launched 3 June 2017 to the ISS, and released on 7 July 2017; it is a 1U CubeSat about 10 cm on each side and about 1 kg.', explanation: 'From a Wikipedia summary of the project.', reference: 'Wikipedia, “GhanaSat-1” (confirm with All Nations University).' },
      ],
    },
  }),
];
