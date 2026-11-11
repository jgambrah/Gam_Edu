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
  factCheck?: NonNullable<PilotStory['teacherGuide']>['factCheck'] | string[];
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
      subjectLinks: g.subjects.map(([subject, link]) => ({ subject, link, status: 'approved' as const })),
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
      ...(g.factCheck ? { factCheck: g.factCheck.map((fc) => (typeof fc === 'string' ? { claim: s.title, explanation: fc, reference: 'NaCCA Primary Curriculum' } : fc)) } : {}),
    },
  };
};

/**
 * Batch 27: Rhymes and songs. Eight original rhymes for nursery to primary 4: counting down mangoes, my busy body,
 * the days of the week, a rain song, animal sounds, greetings (with Twi greetings), water care and a poem in which the
 * trees speak. All verses are original and do not copy any existing nursery rhyme, song or poem. Each has actions,
 * rhyming-word activities and a simple music note (placeholder).
 *
 * Rules: as Batches 13 to 26. All children and animals are invented. Facts are basic; reviewers should confirm the
 * Twi greetings and the facts about water and trees. All pieces are drafts awaiting review.
 */

export const BATCH_27_STORIES: PilotStory[] = [
  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'rhyme-five-ripe-mangoes',
    title: 'Five Ripe Mangoes (a counting rhyme)',
    summary: 'A counting-down rhyme from five ripe mangoes to none, with sharing, hand-washing and a seed that becomes a new tree.',
    classIds: ['nursery-2', 'kg-1'],
    ageMin: 3,
    ageMax: 5,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['rhyme', 'poetry'],
    themes: ['food', 'friendship', 'farm-and-garden'],
    objectives: ['counting', 'phonics', 'oral-language', 'kindness'],
    ghanaianContext: 'central',
    wpm: 70,
    paceWord: 'Bouncy and slow enough to count on fingers',
    palette: ['#f59e0b', '#16a34a'],
    voice: 'Playful, bouncy voice; the numbers are said a little louder',
    characters: ['Two children in school uniforms under a mango tree, sharing mangoes with a friend, a grandmother and a teacher.'],
    music: 'A light, bouncy tune on a xylophone, going down one note for each number (placeholder)',
    pages: [
      pg('🥭', 'Five ripe mangoes hang up high,\nOne drops down. Oh my, oh my!', 'Five mangoes on a tree and one falling down.', 'Hold up five fingers, then fold one down.'),
      pg('🤝', 'Four ripe mangoes, round and sweet,\nOne is shared with a friend to eat.', 'A child gives half a mango to a friend.', 'Hold up four fingers.'),
      pg('👵', 'Three ripe mangoes, gold and bright,\nOne is for Grandma, a sweet delight.', 'A grandmother smiling and holding a mango.', 'Hold up three fingers.'),
      pg('🍎', 'Two ripe mangoes, just a few,\nOne for Teacher, one for you.', 'A teacher receives a mango from a child.', 'Hold up two fingers and point to a friend.'),
      pg('🧼', 'One ripe mango, the last one there,\nWe wash it well and we share with care.', 'Children wash a mango in a bowl of clean water.', 'Hold up one finger and rub your hands as if washing.'),
      pg('🌱', 'No more mangoes, but look, a seed!\nWe plant it, and water it. That is all we need.', 'Children plant a mango seed in the soil and pour water.', 'Show an empty hand, then pretend to plant a seed.'),
    ],
    activities: [
      { id: 'fm-c1', type: 'comprehension', afterPage: 3, question: 'Who is the third mango for?', options: ['Grandma', 'The goat', 'The tree'], correctIndex: 0 },
      { id: 'fm-ph', type: 'phonics', afterPage: 2, targetSound: 'eet', prompt: 'Which word rhymes with sweet?', options: ['eat', 'mango', 'friend'], correctIndexes: [0] },
      { id: 'fm-ph2', type: 'phonics', afterPage: 6, targetSound: 'eed', prompt: 'Which words rhyme with seed?', options: ['need', 'water', 'plant'], correctIndexes: [0] },
      { id: 'fm-s1', type: 'sequencing', prompt: 'Put the mango rhyme in order.', items: ['Five mangoes hang on the tree.', 'One is shared with a friend.', 'One is for Grandma.', 'We plant the seed.'] },
      { id: 'fm-sel', type: 'sel', afterPage: 6, prompt: 'How do you feel when you share?', feelingOptions: ['Happy', 'Kind', 'Proud', 'Hungry'] },
    ],
    glossary: [
      { word: 'ripe', definition: 'Ready to eat, soft and sweet.', pages: [1, 2] },
      { word: 'share', definition: 'To give some of what you have to another person.', pages: [5] },
      { word: 'seed', definition: 'The small part of a fruit that can grow into a new plant.', pages: [6] },
    ],
    culturalNotes: ['Mango trees are common in many Ghanaian compounds and schools, and sharing fruit is an everyday kindness. The rhyme is original and is not a copy of any existing counting song.'],
    reviewQuestions: ['Check that the counting goes down correctly from five to none.', 'Confirm that washing fruit before eating is shown as a normal habit and that the line is clear for three-year-olds.'],
    guide: {
      overview: 'A counting-down rhyme from five to none. Form: six couplets. Rhyming pairs: high/my, sweet/eat, bright/delight, few/you, there/care, seed/need. It teaches counting backwards, sharing and washing fruit.',
      lessonMinutes: 15,
      goals: ['Count down from five to zero.', 'Spot rhyming pairs.', 'Link sharing with kindness.'],
      subjects: [['Mathematics', 'Counting backwards from five'], ['English Language', 'Rhyme and rhythm']],
      before: ['Show five real or pretend mangoes (or stones) and ask children to count them.'],
      during: ['Fold down one finger for each page. Let children say the numbers.'],
      after: ['Count down with other objects: five pencils, five bottle tops.', 'Plant a bean or seed in a cup and watch it grow.'],
      discussion: ['Who did we share with?', 'Why do we wash fruit?'],
      reflection: ['Who do you share with at home?'],
      maths: [{ task: 'Start with 5 mangoes. Two are eaten. How many are left?', answer: '3' }, { task: 'The rhyme ends with zero mangoes. What does zero mean?', answer: 'None; nothing is left.' }],
      support: ['Use real objects to count and take away one at a time.'],
      stretch: ['Make a new verse for a different fruit and count down from four.'],
      localise: ['Use a fruit the children know, such as oranges or pawpaw, in place of mango.'],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'rhyme-my-busy-body',
    title: 'My Busy Body (an action rhyme)',
    summary: 'An action rhyme about eyes, ears, hands, legs, mouth, nose and heart, ending with caring for the body.',
    classIds: ['nursery-2', 'kg-1'],
    ageMin: 3,
    ageMax: 5,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['rhyme', 'poetry'],
    themes: ['health-and-wellbeing', 'identity'],
    objectives: ['counting', 'phonics', 'oral-language', 'vocabulary'],
    ghanaianContext: 'central',
    wpm: 70,
    paceWord: 'Steady, with a pause for each action',
    palette: ['#0ea5e9', '#f97316'],
    voice: 'Bright, playful voice; children point as they hear each body part',
    characters: ['A cheerful child in a school uniform, pointing to eyes, ears, hands, legs, mouth, nose and chest in turn.'],
    music: 'A bright clapping beat with a simple tune of four notes (placeholder)',
    pages: [
      pg('👀', 'Two little eyes can look and see,\nTwo little ears can hear for me.', 'A child points to her eyes and ears.', 'Point to your eyes, then your ears.'),
      pg('👏', 'Two little hands can clap, clap, clap,\nTwo little legs can tap, tap, tap.', 'A child claps and taps her feet.', 'Clap three times, then tap your feet three times.'),
      pg('😀', 'One little mouth can smile and say,\n“Good morning!” to the bright new day.', 'A child smiles and waves at the sunrise.', 'Smile and wave.'),
      pg('👃', 'One little nose can sniff and smell,\nOne big heart can beat so well.', 'A child sniffs a flower and places a hand on her chest.', 'Sniff, then put your hand on your heart.'),
      pg('🛌', 'Wash it, feed it, rest it right,\nMy busy body sleeps at night.', 'A child washes her hands, eats a meal and sleeps in bed.', 'Rub your hands, pretend to eat, then rest your head on your hands.'),
    ],
    activities: [
      { id: 'bb-c1', type: 'comprehension', afterPage: 1, question: 'What can two little ears do?', options: ['Hear', 'Smell', 'Clap'], correctIndex: 0 },
      { id: 'bb-ph', type: 'phonics', afterPage: 2, targetSound: 'ap', prompt: 'Which word rhymes with clap?', options: ['tap', 'hand', 'leg'], correctIndexes: [0] },
      { id: 'bb-ph2', type: 'phonics', afterPage: 4, targetSound: 'ell', prompt: 'Which word rhymes with smell?', options: ['well', 'nose', 'sniff'], correctIndexes: [0] },
      { id: 'bb-sel', type: 'sel', afterPage: 5, prompt: 'Which part of your body do you like to use most?', feelingOptions: ['Happy', 'Strong', 'Playful', 'Sleepy'] },
    ],
    glossary: [
      { word: 'ears', definition: 'The parts of the body that you hear with.', pages: [1] },
      { word: 'sniff', definition: 'To breathe in through your nose to smell something.', pages: [4] },
      { word: 'heart', definition: 'The part inside your chest that pumps blood around your body.', pages: [4] },
    ],
    culturalNotes: ['Body-part action rhymes are common in nurseries everywhere. This one is original. Teachers can add the Twi, Ga, Ewe or other home-language words for body parts.'],
    reviewQuestions: ['Check that every body part is named correctly and that the heart line is simple and true.'],
    guide: {
      overview: 'An action rhyme for naming body parts, counting one and two, and learning to care for the body. Form: five couplets. Rhyming pairs: see/me, clap/tap, say/day, smell/well, right/night.',
      lessonMinutes: 15,
      goals: ['Name seven body parts.', 'Count one and two.', 'Name three ways to care for the body.'],
      subjects: [['English Language', 'Rhyme and body vocabulary'], ['Creative Arts', 'Movement'], ['Our World Our People', 'Taking care of the body']],
      before: ['Play a game: touch your nose, touch your ears, touch your knees.'],
      during: ['Point to each part as it is named. Slow down so everyone can follow.'],
      after: ['Ask: which body parts do we wash every day?', 'Draw a body and label two parts.'],
      discussion: ['What can your hands do?', 'How do we look after our eyes and ears?'],
      reflection: ['What is one way you looked after your body today?'],
      maths: [{ task: 'How many eyes and ears do you have together?', answer: '4' }],
      support: ['Say one line at a time and let children echo and point.'],
      stretch: ['Add a verse about two feet, ten toes and one tongue.'],
      localise: ['Invite children to say the body words in their home language.'],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'rhyme-seven-days-song',
    title: 'Seven Days, Seven Ways (a song)',
    summary: 'A song of the seven days of the week, with a simple job, lesson or joy for each day, ending with rest and a new week.',
    classIds: ['kg-2', 'primary-1'],
    ageMin: 5,
    ageMax: 7,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['rhyme', 'poetry'],
    themes: ['school', 'family', 'community'],
    objectives: ['sequencing', 'phonics', 'oral-language', 'vocabulary'],
    ghanaianContext: 'central',
    wpm: 75,
    paceWord: 'Lively, like a marching song',
    palette: ['#7c3aed', '#facc15'],
    voice: 'Lively, rhythmic voice; the days are said clearly and slowly',
    characters: ['A group of children sweeping, counting, drawing, singing, reading, playing and resting with their families through a week.'],
    music: 'A marching drum beat with a simple tune that goes up through the week and rests on Sunday (placeholder)',
    pages: [
      pg('🧹', 'On Monday we sweep and tidy the floor,\nOn Tuesday we count and count some more.', 'Children sweep a classroom and count pebbles.', 'March on the spot to the beat.'),
      pg('🎨', 'On Wednesday we draw with a crayon or two,\nOn Thursday we sing a song for you.', 'Children draw pictures and sing in a circle.', 'Move your hand like a crayon, then sing.'),
      pg('📖', 'On Friday we read a story with a friend,\nOn Saturday we play until day’s end.', 'Two children read a book and then play outdoors.', 'Open your hands like a book, then run on the spot.'),
      pg('🏡', 'On Sunday we rest with family near,\nThen Monday comes and a new week is here.', 'A family sitting together under a tree.', 'Slow down, then clap to start the week again.'),
      pg('7️⃣', 'Seven days, seven days, count them with me,\nOne, two, three, four, five, six, seven. Whee!', 'Seven small circles in a row, one for each day.', 'Count on your fingers, then shout Whee!'),
    ],
    activities: [
      { id: 'sd-c1', type: 'comprehension', afterPage: 1, question: 'What do we do on Tuesday?', options: ['Count', 'Sweep', 'Sing'], correctIndex: 0 },
      { id: 'sd-ph', type: 'phonics', afterPage: 1, targetSound: 'oor', prompt: 'Which word rhymes with floor?', options: ['more', 'sweep', 'count'], correctIndexes: [0] },
      { id: 'sd-s1', type: 'sequencing', prompt: 'Put the days in order.', items: ['Monday', 'Wednesday', 'Friday', 'Sunday'] },
      { id: 'sd-voc', type: 'vocabulary', afterPage: 4, word: 'week', definition: 'Seven days, from one Monday to the next.', distractors: ['A very long road', 'A kind of song'] },
      { id: 'sd-sel', type: 'sel', afterPage: 5, prompt: 'Which day is your favourite?', feelingOptions: ['Happy', 'Excited', 'Calm', 'Playful'] },
    ],
    glossary: [
      { word: 'Monday', definition: 'The first school day of the week.', pages: [1] },
      { word: 'story', definition: 'A tale that tells what happened.', pages: [3] },
      { word: 'week', definition: 'Seven days in a row.', pages: [4] },
    ],
    culturalNotes: ['Many Ghanaian children also know the Akan day-names (such as Kwasi for a boy and Akosua for a girl born on Sunday) given by birth day. This song does not use them, but teachers may add the home-language names for the days.'],
    reviewQuestions: ['Check that the song fits a Ghanaian school week and does not favour any religion on Sunday or Friday.', 'Confirm the order of the days from Monday to Sunday.'],
    guide: {
      overview: 'A song for learning the seven days in order. Form: four couplets and a counting chorus. Rhyming pairs: floor/more, two/you, friend/end, near/here, me/Whee. It practises sequencing and rhyme.',
      lessonMinutes: 20,
      goals: ['Say the days of the week in order.', 'Find rhyming pairs.', 'Link each day to a real activity.'],
      subjects: [['English Language', 'Rhyme and days of the week'], ['Mathematics', 'Counting to seven and ordering'], ['Our World Our People', 'Routines']],
      before: ['Ask: what day is it today? What day was yesterday?'],
      during: ['March in place. Stop and point to the day on a wall chart at each page.'],
      after: ['Make a seven-box chart and draw what you did each day.', 'Sing the song again, changing the activities.'],
      discussion: ['What do you do on school days?', 'What do you like to do on Saturday?'],
      reflection: ['Which day of the week do you help at home?'],
      maths: [{ task: 'If today is Wednesday, what day is it in two days?', answer: 'Friday' }, { task: 'How many days are in two weeks?', answer: '14' }],
      support: ['Use a picture calendar and point to each day as it is sung.'],
      stretch: ['Write a new couplet for a day of your choice.'],
      localise: ['Let children bring the names of the days in their home languages.', 'Match the activities to the real school timetable.'],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'rhyme-where-does-the-rain-go',
    title: 'Where Does the Rain Come From? (a rain song)',
    summary: 'A rhyming song that follows a drop of water from the warm river up into a cloud, down as rain and back to the river again.',
    classIds: ['primary-1', 'primary-2'],
    ageMin: 6,
    ageMax: 8,
    readingLevel: 'early',
    difficulty: 2,
    genres: ['rhyme', 'science', 'nature'],
    themes: ['weather', 'animals-and-habitats', 'farm-and-garden'],
    objectives: ['scientific-curiosity', 'sequencing', 'phonics', 'vocabulary'],
    ghanaianContext: 'central',
    wpm: 75,
    paceWord: 'Dreamy going up, then quick and splashy coming down',
    palette: ['#38bdf8', '#64748b'],
    voice: 'Soft going up with the water, loud and quick for the rain',
    characters: ['A child in a school uniform watching a river, a cloud, rain on a tin roof and a maize farm from a doorway.'],
    music: 'Slow rising notes on a flute, then a quick patter on a small drum for the rain (placeholder)',
    pages: [
      pg('☀️', 'The warm sun shines on the water below,\nIt lifts up tiny drops, high and slow.', 'Sunlight on a river with mist rising.', 'Lift your hands slowly like rising mist.'),
      pg('☁️', 'Up in the sky the drops cool and meet,\nThey make a cloud, soft and neat.', 'A small white cloud forming over a river.', 'Make a cloud shape with your arms.'),
      pg('🌧️', 'The cloud grows heavy and cannot hold,\nSo down comes the rain, silver and cold.', 'A dark cloud with rain falling.', 'Tap your fingers on the desk, faster and faster.'),
      pg('🌽', 'Pitter, patter on the roof it goes,\nIt waters the farm where the maize grows.', 'Rain on a tin roof and on a field of young maize.', 'Tap your knees to make rain on a roof.'),
      pg('🏞️', 'It runs to the river and on to the sea,\nThen up it goes again. Wait and see!', 'A stream flowing to a river and a sunny sky.', 'Draw a big circle in the air with your finger.'),
    ],
    activities: [
      { id: 'rn-c1', type: 'comprehension', afterPage: 1, question: 'What lifts the water up into the sky?', options: ['The warm sun', 'The moon', 'A bird'], correctIndex: 0 },
      { id: 'rn-ph', type: 'phonics', afterPage: 3, targetSound: 'old', prompt: 'Which word rhymes with cold?', options: ['hold', 'rain', 'cloud'], correctIndexes: [0] },
      { id: 'rn-s1', type: 'sequencing', prompt: 'Put the water journey in order.', items: ['The sun warms the river.', 'Drops rise and make a cloud.', 'Rain falls from the cloud.', 'Water runs back to the river.'] },
      { id: 'rn-voc', type: 'vocabulary', afterPage: 2, word: 'cloud', definition: 'A mass of tiny water drops floating in the sky.', distractors: ['A hill of sand', 'A kind of rain boot'] },
      { id: 'rn-sel', type: 'sel', afterPage: 5, prompt: 'How do you feel when the rain comes?', feelingOptions: ['Happy', 'Cool', 'Excited', 'Sleepy'] },
    ],
    glossary: [
      { word: 'cloud', definition: 'Tiny drops of water floating together in the sky.', pages: [2, 3] },
      { word: 'maize', definition: 'A tall crop with yellow grains, also called corn.', pages: [4] },
      { word: 'river', definition: 'A large stream of water flowing to the sea.', pages: [5] },
    ],
    culturalNotes: ['Rain matters to farmers across Ghana, and the rainy season brings relief after the dry months. The poem shows the water cycle in simple words and is an original text.'],
    reviewQuestions: ['Check the water-cycle science: heat lifts water as vapour, vapour cools into drops, the cloud rains, and water flows back.', 'Confirm that “tiny drops” rising is acceptable for young learners (the drops that rise are actually invisible vapour).'],
    guide: {
      overview: 'A rain song that teaches the water cycle in five couplets: sun lifts water, cloud forms, rain falls, rain feeds the farm, and water runs back to the river. Rhyming pairs: below/slow, meet/neat, hold/cold, goes/grows, sea/see.',
      lessonMinutes: 25,
      goals: ['Say the water journey in order.', 'Find rhyming pairs.', 'Say why rain matters to farmers.'],
      subjects: [['Integrated Science', 'The water cycle'], ['English Language', 'Rhyme and sequencing']],
      before: ['Ask: where does rain come from? Collect ideas without correcting them yet.'],
      during: ['Use hand motions for rising, forming and falling.'],
      after: ['Draw the water journey as a circle with four pictures.', 'Place a cup of water in the sun and look again after a day.'],
      discussion: ['Why do farmers wait for the rain?', 'Where does the rain go after it falls?'],
      reflection: ['How can we collect and use rainwater safely?'],
      support: ['Use four pictures on cards and put them in order together.'],
      stretch: ['Write a new couplet about what happens when the rain stops.'],
      localise: ['Use a river, stream or lagoon the children know.', 'In a thunderstorm, stay indoors and do not shelter under trees.'],
      factCheck: ['Confirm the water cycle details with the Integrated Science syllabus.'],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'rhyme-who-says-what',
    title: 'Who Says What? (an animal sounds rhyme)',
    summary: 'A call-and-answer rhyme about the sounds that the hen, duck, goat, dog, cat, cow, rooster, bee and frog make.',
    classIds: ['nursery-2', 'kg-1'],
    ageMin: 3,
    ageMax: 5,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['rhyme', 'animal'],
    themes: ['animals-and-habitats', 'farm-and-garden'],
    objectives: ['phonics', 'oral-language', 'vocabulary'],
    ghanaianContext: 'central',
    wpm: 70,
    paceWord: 'Playful, with a pause so children can make the sounds',
    palette: ['#84cc16', '#f59e0b'],
    voice: 'Playful voice; each animal sound is made with its own voice',
    characters: ['A hen, a duck, a goat, a dog, a cat, a cow, a rooster, a bee and a frog around a village compound, drawn kindly and safely, with a child watching from the veranda.'],
    music: 'A sing-song tune with a pause after each animal for children to answer (placeholder)',
    pages: [
      pg('🐔', 'The hen says cluck and the duck says quack,\nThe goat says meh and she runs right back.', 'A hen, a duck and a goat in a compound.', 'Pause so children can make each sound.'),
      pg('🐶', 'The dog says woof and the cat says mew,\nThe cow says moo. And what do you do?', 'A dog, a cat and a cow near a fence.', 'Make each sound, then point to the children.'),
      pg('🐓', 'The rooster calls at the break of day,\nCock-a-doodle-doo! Time to play.', 'A rooster crowing at sunrise.', 'Stretch out the crow.'),
      pg('🐝', 'The bee goes buzz and the bird goes tweet,\nThe frog goes croak by my two feet.', 'A bee, a small bird and a frog near a child’s feet.', 'Buzz softly, tweet lightly, croak low.'),
    ],
    activities: [
      { id: 'ws-c1', type: 'comprehension', afterPage: 1, question: 'Which animal says quack?', options: ['The duck', 'The goat', 'The hen'], correctIndex: 0 },
      { id: 'ws-ph', type: 'phonics', afterPage: 1, targetSound: 'ack', prompt: 'Which word rhymes with quack?', options: ['back', 'hen', 'goat'], correctIndexes: [0] },
      { id: 'ws-ph2', type: 'phonics', afterPage: 3, targetSound: 'ay', prompt: 'Which words rhyme with day?', options: ['play', 'buzz', 'crow'], correctIndexes: [0] },
      { id: 'ws-sel', type: 'sel', afterPage: 4, prompt: 'Which animal sound do you like best?', feelingOptions: ['Happy', 'Silly', 'Loud', 'Gentle'] },
    ],
    glossary: [
      { word: 'rooster', definition: 'A male chicken.', pages: [3] },
      { word: 'buzz', definition: 'The humming sound a bee makes.', pages: [4] },
      { word: 'croak', definition: 'The deep sound a frog makes.', pages: [4] },
    ],
    culturalNotes: ['Farm and compound animals are familiar to many Ghanaian children. Animal sounds are written differently in different languages; teachers can add the sounds children use at home.'],
    reviewQuestions: ['Check that the animal sounds are right for Ghanaian English and that the page does not suggest children should touch unfamiliar animals.'],
    guide: {
      overview: 'A call-and-answer rhyme for animal sounds. Form: four couplets. Rhyming pairs: quack/back, mew/do, day/play, tweet/feet. Sound words help phonics and speaking.',
      lessonMinutes: 15,
      goals: ['Match animals to their sounds.', 'Spot rhyming words.', 'Take turns in a call-and-answer game.'],
      subjects: [['English Language', 'Sound words and rhyme'], ['Our World Our People', 'Animals around us']],
      before: ['Show pictures of the animals. Ask children what sound each makes.'],
      during: ['Pause before each sound so children answer. Do not rush.'],
      after: ['Play a guessing game: make a sound and let children name the animal.', 'Add a new couplet for a sheep or a donkey.'],
      discussion: ['Which animals live at your home or near it?', 'How should we behave around animals?'],
      reflection: ['How can we be kind to animals?'],
      support: ['Use pictures and let children point to the animal.'],
      stretch: ['Invent a funny animal and say what sound it makes.'],
      localise: ['Add the animal sounds children know in their home language.', 'Teach safety: never touch a strange animal, and wash your hands after touching any animal.'],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'rhyme-maakye-maaha-maadwo',
    title: 'Maakye, Maaha, Maadwo (a greetings song)',
    summary: 'A greetings song for morning, afternoon and evening, using English and the Twi greetings Maakye, Maaha and Maadwo, with Akwaaba for welcome.',
    classIds: ['kg-1', 'kg-2'],
    ageMin: 4,
    ageMax: 6,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['rhyme', 'cultural'],
    themes: ['community', 'identity', 'friendship'],
    objectives: ['cultural-heritage', 'oral-language', 'kindness', 'vocabulary'],
    ghanaianContext: 'central',
    wpm: 70,
    paceWord: 'Warm and clear, with a pause for the greeting words',
    palette: ['#f97316', '#0d9488'],
    voice: 'Warm voice; the Twi greetings are said slowly and clearly, with the children repeating',
    characters: ['Children in school uniforms greeting a teacher, an elder and a neighbour at sunrise, midday and sunset.'],
    music: 'A cheerful clapping song with three short tunes, one for each part of the day (placeholder)',
    pages: [
      pg('🌅', 'Maakye, maakye! The morning is here,\nSay good morning to the people near.', 'Children greet a neighbour at sunrise.', 'Wave and say Maakye, then Good morning.'),
      pg('🌞', 'Maaha, maaha! The sun is high,\nGood afternoon, as the clouds go by.', 'Children greet a teacher in the noon sun.', 'Wave and say Maaha, then Good afternoon.'),
      pg('🌇', 'Maadwo, maadwo! The sky turns red,\nGood evening, before we go to bed.', 'Children greet an elder at sunset.', 'Wave and say Maadwo, then Good evening.'),
      pg('🤗', 'Akwaaba! Come in, come in,\nA warm welcome and a happy grin.', 'A child at a door welcoming a visitor with a smile.', 'Open your arms wide and smile.'),
      pg('🙏', 'We greet our elders with care and grace,\nA smile and a greeting on every face.', 'Children greet elders with a gentle bow and a smile.', 'Place a hand on your heart.'),
    ],
    activities: [
      { id: 'mg-c1', type: 'comprehension', afterPage: 3, question: 'When do we say Maadwo?', options: ['In the evening', 'At sunrise', 'At noon'], correctIndex: 0 },
      { id: 'mg-ph', type: 'phonics', afterPage: 2, targetSound: 'igh', prompt: 'Which word rhymes with high?', options: ['by', 'sun', 'cloud'], correctIndexes: [0] },
      { id: 'mg-ph2', type: 'phonics', afterPage: 5, targetSound: 'ace', prompt: 'Which words rhyme with grace?', options: ['face', 'greet', 'smile'], correctIndexes: [0] },
      { id: 'mg-sel', type: 'sel', afterPage: 4, prompt: 'How do you feel when someone says Akwaaba to you?', feelingOptions: ['Welcome', 'Happy', 'Shy', 'Proud'] },
    ],
    glossary: [
      { word: 'Maakye', definition: 'Good morning in Twi.', pages: [1] },
      { word: 'Maaha', definition: 'Good afternoon in Twi.', pages: [2] },
      { word: 'Akwaaba', definition: 'Welcome in Twi.', pages: [4] },
    ],
    culturalNotes: ['Greetings matter in Ghanaian life, and children are taught to greet elders. Maakye, Maaha, Maadwo and Akwaaba are Twi (Akan). Other languages, such as Ga, Ewe, Dagbani and Fante, have their own greetings and teachers should invite children to share these.'],
    reviewQuestions: ['Have a Twi speaker confirm Maakye (good morning), Maaha (good afternoon), Maadwo (good evening) and Akwaaba (welcome), and their spelling.', 'Check that the song does not suggest that Twi is the only language of Ghana.'],
    guide: {
      overview: 'A greetings song that pairs English and Twi greetings with the time of day. Form: five couplets. Rhyming pairs: here/near, high/by, red/bed, in/grin, grace/face. It builds manners, home-language pride and respect.',
      lessonMinutes: 20,
      goals: ['Say the greetings for morning, afternoon and evening.', 'Greet an elder politely.', 'Respect the home languages in the room.'],
      subjects: [['English Language', 'Greetings and rhyme'], ['Ghanaian Language', 'Everyday greetings'], ['Our World Our People', 'Manners and respect']],
      before: ['Ask: how do you greet people at home? What do you say?'],
      during: ['Teach the Twi greetings slowly and have children echo them.'],
      after: ['Role-play greeting a teacher, an elder and a visitor.', 'Make a greetings chart with the children’s home languages.'],
      discussion: ['Why do we greet people?', 'What do we say when we meet someone in the morning?'],
      reflection: ['Who will you greet kindly today?'],
      support: ['Use pictures of a sunrise, a noon sun and a sunset to link the greeting to the time.'],
      stretch: ['Teach the class a greeting from another Ghanaian language and add a verse.'],
      localise: ['Replace the Twi words with greetings in the local language of your school, if different.', 'Invite a parent or elder to teach their greeting.'],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'rhyme-every-drop-counts',
    title: 'Every Drop Counts (a water song)',
    summary: 'A rhyming song of six simple habits for caring for water: tap off, covered pots, clean streams, safe drinking water and sharing.',
    classIds: ['primary-1', 'primary-2', 'primary-3'],
    ageMin: 6,
    ageMax: 9,
    readingLevel: 'early',
    difficulty: 2,
    genres: ['rhyme', 'educational'],
    themes: ['health-and-wellbeing', 'community', 'citizenship'],
    objectives: ['environmental-awareness', 'responsibility', 'phonics', 'vocabulary'],
    ghanaianContext: 'central',
    wpm: 75,
    paceWord: 'Steady, like a marching chant',
    palette: ['#0ea5e9', '#22c55e'],
    voice: 'Clear, encouraging voice; each habit is said with a firm, friendly beat',
    characters: ['Children in school uniforms using a tap, a covered bucket, a clean drain and a pot of boiled water with an adult nearby.'],
    music: 'A steady marching beat with a chorus that repeats “Every drop counts” (placeholder)',
    pages: [
      pg('💧', 'Water is life for the plant and the bird,\nFor you and for me, and for every herd.', 'A child, a bird, a plant and a herd of cattle near a stream.', 'Cup your hands as if holding water.'),
      pg('🚰', 'Turn off the tap when you brush your teeth,\nA running tap wastes the drops beneath.', 'A child brushing her teeth with the tap closed.', 'Pretend to turn off a tap.'),
      pg('🪣', 'Cover the pot and the bucket too,\nSo dust and insects cannot get through.', 'A covered water bucket and a pot with lids.', 'Place a pretend lid on a bucket.'),
      pg('🚮', 'Keep rubbish out of the stream and the drain,\nSo water can flow when it starts to rain.', 'Children put litter in a bin beside a clean drain.', 'Pretend to put rubbish in a bin.'),
      pg('🫖', 'Ask a grown-up to boil what we drink,\nClean water keeps us healthy. Think!', 'An adult boils water in a pot while a child watches from a safe distance.', 'Tap your head on the word Think.'),
      pg('🤝', 'Every drop we save is a drop to share,\nFor the farm, the family and the animals there.', 'Children and animals sharing water at a village well.', 'Open your hands to share.'),
    ],
    activities: [
      { id: 'dc-c1', type: 'comprehension', afterPage: 2, question: 'What should we do with the tap while we brush our teeth?', options: ['Turn it off', 'Leave it running', 'Break it'], correctIndex: 0 },
      { id: 'dc-c2', type: 'comprehension', afterPage: 3, question: 'Why do we cover the pot and the bucket?', options: ['To keep dust and insects out', 'To make the water hot', 'To make the water sing'], correctIndex: 0 },
      { id: 'dc-ph', type: 'phonics', afterPage: 4, targetSound: 'ain', prompt: 'Which word rhymes with drain?', options: ['rain', 'drop', 'stream'], correctIndexes: [0] },
      { id: 'dc-s1', type: 'sequencing', prompt: 'Put the song’s habits in order.', items: ['Turn off the tap.', 'Cover the pot.', 'Keep rubbish out of the drain.', 'Boil the drinking water.'] },
      { id: 'dc-sel', type: 'sel', afterPage: 6, prompt: 'Which water habit can you start at home?', feelingOptions: ['Proud', 'Ready', 'Helpful', 'Hopeful'] },
    ],
    glossary: [
      { word: 'rubbish', definition: 'Things we throw away, such as paper and plastic.', pages: [4] },
      { word: 'drain', definition: 'A channel that carries water away.', pages: [4] },
      { word: 'boil', definition: 'To heat water until it bubbles.', pages: [5] },
    ],
    culturalNotes: ['Water matters for every home, farm and school in Ghana, and many families fetch water from taps, wells, boreholes or streams. This song uses simple habits that any child can start.'],
    reviewQuestions: ['Check that the habits (closing the tap, covering stored water, keeping drains clear, boiling or filtering drinking water) are accurate and safe.', 'Confirm that children are not asked to handle boiling water; an adult does it.'],
    guide: {
      overview: 'A water-care song with six habits. Form: six couplets. Rhyming pairs: bird/herd, teeth/beneath, too/through, drain/rain, drink/think, share/there. It builds responsibility and links water with health.',
      lessonMinutes: 25,
      goals: ['Name four ways to look after water.', 'Say why clean water matters for health.', 'Spot rhyming pairs.'],
      subjects: [['Integrated Science', 'Water and health'], ['English Language', 'Rhyme'], ['Our World Our People', 'Caring for the environment']],
      before: ['Ask: where does your water come from at home?'],
      during: ['Use a pretend tap, lid and bin to act each habit.'],
      after: ['Make a poster of one water habit.', 'Check the school taps and report any that drip, to an adult.'],
      discussion: ['Why must drinking water be clean?', 'What happens if rubbish blocks a drain?'],
      reflection: ['Which habit will you try this week?'],
      maths: [{ task: 'A tap drips one cup of water every hour. How many cups drip in a school day of 6 hours?', answer: '6 cups (suppose this rate)' }],
      support: ['Act the song with simple props and let children choose one habit to show.'],
      stretch: ['Write a new couplet about one more way to save water.'],
      localise: ['Use the local water sources (tap, well, borehole or stream) that children know.', 'Keep children away from boiling water and open wells and streams.'],
      factCheck: ['Confirm the safe-water advice with the local health or water authority.'],
    },
  }),

  // 8 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'rhyme-the-trees-say-thank-you',
    title: 'The Trees Say Thank You (a poem)',
    summary: 'A poem in which the trees speak: they hold the soil, give shade, clean the air, shelter birds and bees, and thank children who plant seeds.',
    classIds: ['primary-2', 'primary-3', 'primary-4'],
    ageMin: 7,
    ageMax: 10,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['poetry', 'nature', 'educational'],
    themes: ['animals-and-habitats', 'citizenship', 'farm-and-garden'],
    objectives: ['environmental-awareness', 'reading-comprehension', 'vocabulary', 'responsibility'],
    ghanaianContext: 'central',
    wpm: 80,
    paceWord: 'Calm and warm, like an old tree speaking',
    palette: ['#15803d', '#a16207'],
    voice: 'Deep, calm and kind voice, as if the tree itself is speaking; lighter for the children’s part',
    characters: ['A tall shady tree in a school compound with birds in its branches, bees at its flowers and children planting a seedling at its foot.'],
    music: 'A soft flute with a slow, steady drum like a heartbeat (placeholder)',
    pages: [
      pg('🌳', 'I am a tree with roots down deep,\nThey hold the soil that rain would sweep.', 'A big tree with roots holding soil on a slope.', 'Slow and deep, like a tree speaking.'),
      pg('☀️', 'My leaves give shade at the hottest noon,\nSit under me. You will be cool soon.', 'Children resting in the shade of a tree at noon.', 'Warm and welcoming.'),
      pg('🍃', 'I take in the air that people breathe out,\nAnd I give back the air that you need, no doubt.', 'A tree with arrows showing air moving in and out.', 'Say this clearly and slowly.'),
      pg('🐦', 'Birds make nests in my branches high,\nBees visit my flowers as they fly by.', 'Birds in a nest and bees at tree flowers.', 'Light and cheerful.'),
      pg('🪴', 'If a tree must fall, plant a new one near,\nSo shade and birds and fruit stay here.', 'Children plant a young tree beside an old stump.', 'Gentle and serious.'),
      pg('💚', 'Thank you, children, for every seed you sow,\nWe will grow with you. Watch us grow!', 'Children watering a seedling with a can.', 'Bright and hopeful, lifting on the last line.'),
    ],
    activities: [
      { id: 'tt-c1', type: 'comprehension', afterPage: 1, question: 'What do the tree’s roots do?', options: ['Hold the soil', 'Make rain', 'Chase the birds'], correctIndex: 0 },
      { id: 'tt-c2', type: 'comprehension', afterPage: 5, question: 'What does the tree ask people to do if a tree must fall?', options: ['Plant a new one', 'Leave the stump alone', 'Do nothing'], correctIndex: 0 },
      { id: 'tt-ph', type: 'phonics', afterPage: 2, targetSound: 'oon', prompt: 'Which word rhymes with noon?', options: ['soon', 'shade', 'leaf'], correctIndexes: [0] },
      { id: 'tt-voc', type: 'vocabulary', afterPage: 1, word: 'roots', definition: 'The parts of a plant that grow under the soil and take in water.', distractors: ['The flowers of a tree', 'The top branches'] },
      { id: 'tt-sel', type: 'sel', afterPage: 6, prompt: 'The trees say thank you for planting seeds. How does that make you feel?', feelingOptions: ['Proud', 'Hopeful', 'Happy', 'Caring'] },
    ],
    glossary: [
      { word: 'roots', definition: 'The parts of a plant under the soil that hold it and take in water.', pages: [1] },
      { word: 'shade', definition: 'A cool place out of the sun.', pages: [2] },
      { word: 'nests', definition: 'Homes that birds build for their eggs and chicks.', pages: [4] },
    ],
    culturalNotes: ['Trees matter in many Ghanaian communities for shade, fruit, medicine and meeting places, and some groves are held sacred. The poem is original and does not describe any sacred practice.'],
    reviewQuestions: ['Check the science: trees take in carbon dioxide and give out oxygen (page 3 is simplified for children), and roots help hold soil against erosion.', 'Confirm that the line about planting a new tree is balanced and does not suggest that cutting trees is always wrong.'],
    guide: {
      overview: 'A poem in the voice of a tree. Form: six couplets. Rhyming pairs: deep/sweep, noon/soon, out/doubt, high/by, near/here, sow/grow. It teaches personification, the work trees do and a call to plant.',
      lessonMinutes: 30,
      goals: ['Say four things that trees do for us.', 'Say what personification is in simple words.', 'Plan how to plant and care for a tree.'],
      subjects: [['Integrated Science', 'Plants and their uses'], ['English Language', 'Poetry, rhyme and personification'], ['Our World Our People', 'Caring for the environment']],
      before: ['Ask: what is your favourite tree and why?'],
      during: ['Ask different children to read the tree’s part and the children’s part.'],
      after: ['Plant a seedling in a safe spot and agree who will water it.', 'Write a new couplet in the voice of a tree you know.'],
      discussion: ['Why does the poem say the tree is speaking?', 'What happens when trees are cut and nothing is planted?'],
      reflection: ['What can you do this term to help a tree grow?'],
      support: ['Match four pictures (soil, shade, air, birds) to the pages.'],
      stretch: ['Write a six-line poem in the voice of a river, a hill or a farm.'],
      localise: ['Use a tree from your school or town, and ask an elder about it.', 'Check with the school or local forestry staff before planting.'],
      factCheck: ['Confirm the air and soil statements with the Integrated Science syllabus.'],
    },
  }),
];
