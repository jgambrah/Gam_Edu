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
 * Batch 28: More rhymes and songs for nursery to primary 4. Ten fingers, market colours, a tooth-brushing chant, a moon
 * lullaby, a feelings song, an ant parade, a clean-school chant and a poem about the Sun, Earth and Moon. All verses are
 * original. All children and animals are invented. Drafts awaiting review.
 */

export const BATCH_28_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'rhyme-ten-little-fingers',
    title: 'Ten Little Fingers (a counting rhyme)',
    summary: 'A counting rhyme from one to ten on fingers and toes, with clapping, waving and a kind final verse.',
    classIds: ['nursery-2', 'kg-1'], ageMin: 3, ageMax: 5, readingLevel: 'pre-reader', difficulty: 1,
    genres: ['rhyme', 'poetry'], themes: ['health-and-wellbeing', 'identity'], objectives: ['counting', 'phonics', 'oral-language'],
    ghanaianContext: 'central', wpm: 70, paceWord: 'Bouncy and slow enough to count on fingers', palette: ['#ec4899', '#facc15'],
    voice: 'Playful voice; numbers said a little louder', characters: ['A cheerful child in a school uniform showing fingers and toes, with a friend.'],
    music: 'A bouncy tune on a small drum, going up one note for each number (placeholder)',
    pages: [
      pg('☝️', 'One finger, two fingers, three, four, five,\nWiggle them, jiggle them, look alive!', 'A child wiggling five fingers.', 'Count on your fingers, then wiggle.'),
      pg('🖐️', 'Six fingers, seven, eight, nine, ten,\nClap them, tap them, and start again!', 'A child holding up ten fingers and clapping.', 'Count to ten, then clap.'),
      pg('🦶', 'Ten little toes in my shoes all day,\nThey wiggle at night when I stretch and play.', 'A child wiggling bare toes on a mat.', 'Wiggle your toes if you can.'),
      pg('👋', 'Wave to a friend with my hand held high,\nShake hands kindly and say hi.', 'Two children shaking hands and smiling.', 'Wave, then shake a friend’s hand gently.'),
      pg('🧼', 'Wash my fingers, one by one,\nScrub them clean until we are done.', 'A child washing hands with soap and water.', 'Pretend to wash each finger.'),
    ],
    activities: [
      { id: 'tf-c1', type: 'comprehension', afterPage: 3, question: 'How many toes does the child have in all?', options: ['Ten', 'Five', 'Twenty'], correctIndex: 0 },
      { id: 'tf-ph', type: 'phonics', afterPage: 1, targetSound: 'ive', prompt: 'Which word rhymes with five?', options: ['alive', 'ten', 'clap'], correctIndexes: [0] },
      { id: 'tf-ph2', type: 'phonics', afterPage: 5, targetSound: 'un', prompt: 'Which words rhyme with one?', options: ['done', 'wash', 'clean'], correctIndexes: [0] },
      { id: 'tf-sel', type: 'sel', afterPage: 5, prompt: 'How do you feel when you wave to a friend?', feelingOptions: ['Happy', 'Shy', 'Friendly', 'Proud'] },
    ],
    glossary: [
      { word: 'wiggle', definition: 'To move with small quick movements.', pages: [1] },
      { word: 'toes', definition: 'The five small parts at the end of each foot.', pages: [3] },
      { word: 'scrub', definition: 'To rub hard to make clean.', pages: [5] },
    ],
    culturalNotes: ['Counting rhymes on fingers are used in many languages. This one is original. Teachers can count in Twi, Ga, Ewe or the school’s language too.'],
    reviewQuestions: ['Check the counting and that the hand-washing line is clear.'],
    guide: {
      overview: 'A counting rhyme to ten. Form: five couplets. Rhyming pairs: five/alive, ten/again (slant), day/play, high/hi, one/done. It teaches counting, rhyme and hand-washing.',
      lessonMinutes: 15, goals: ['Count to ten.', 'Spot rhyming words.', 'Say when to wash hands.'],
      subjects: [['Mathematics', 'Counting to ten'], ['English Language', 'Rhyme']],
      before: ['Count the class fingers together.'], during: ['Hold up the right number of fingers.'],
      after: ['Count ten objects and put them in two groups of five.', 'Count to ten in a home language.'],
      discussion: ['When do we wash our hands?'], reflection: ['What do your hands help you do?'],
      maths: [{ task: 'Show 6 fingers. How many more to make 10?', answer: '4' }],
      support: ['Use counters or bottle tops.'], stretch: ['Count in twos to ten on fingers.'],
      localise: ['Add counting words from the children’s home languages.'],
    },
  }),

  // 2
  mk({
    key: 'rhyme-colours-at-the-market',
    title: 'Colours at the Market (a colour rhyme)',
    summary: 'A rhyme about the colours of food at a market: red tomatoes, yellow bananas, orange pawpaw, green leaves and brown yam.',
    classIds: ['nursery-2', 'kg-1'], ageMin: 3, ageMax: 5, readingLevel: 'pre-reader', difficulty: 1,
    genres: ['rhyme', 'poetry', 'cultural'], themes: ['food', 'community'], objectives: ['vocabulary', 'phonics', 'oral-language'],
    ghanaianContext: 'central', culturalTags: ['market', 'local-food'], wpm: 70, paceWord: 'Lively, like a market call', palette: ['#dc2626', '#16a34a'],
    voice: 'Lively market voice with a smile', characters: ['A child with a mother at a market stall, with heaps of tomatoes, bananas, pawpaw, green leaves and yams.'],
    music: 'A light shaker and a hand-drum with a market-call tune (placeholder)',
    pages: [
      pg('🍅', 'Red, red, red are the tomatoes in a heap,\nPile them up high, but not too steep.', 'A neat heap of red tomatoes at a stall.', 'Point to something red.'),
      pg('🍌', 'Yellow, yellow, bananas in a bunch,\nPeel one slowly for a tasty lunch.', 'A bunch of yellow bananas.', 'Point to something yellow.'),
      pg('🥭', 'Orange is the pawpaw, ripe and sweet,\nScoop it with a spoon, a juicy treat.', 'A sliced pawpaw with orange flesh.', 'Point to something orange.'),
      pg('🥬', 'Green, green, green are the leaves we buy,\nGood for our bodies, so wash them dry.', 'A basket of green leaves.', 'Point to something green.'),
      pg('🍠', 'Brown is the yam, strong and round,\nMama carries it home, safe and sound.', 'A brown yam in a basket.', 'Point to something brown.'),
    ],
    activities: [
      { id: 'cm-c1', type: 'comprehension', afterPage: 2, question: 'What colour are the bananas?', options: ['Yellow', 'Red', 'Blue'], correctIndex: 0 },
      { id: 'cm-ph', type: 'phonics', afterPage: 5, targetSound: 'ound', prompt: 'Which word rhymes with round?', options: ['sound', 'yam', 'home'], correctIndexes: [0] },
      { id: 'cm-ph2', type: 'phonics', afterPage: 2, targetSound: 'unch', prompt: 'Which word rhymes with bunch?', options: ['lunch', 'banana', 'peel'], correctIndexes: [0] },
      { id: 'cm-sel', type: 'sel', afterPage: 5, prompt: 'Which colour of food do you like best?', feelingOptions: ['Happy', 'Hungry', 'Curious', 'Playful'] },
    ],
    glossary: [
      { word: 'tomatoes', definition: 'Round red fruits that we cook in stew.', pages: [1] },
      { word: 'bunch', definition: 'Several things growing or tied together.', pages: [2] },
      { word: 'yam', definition: 'A big brown root that we boil, pound or fry.', pages: [5] },
    ],
    culturalNotes: ['Markets are busy centres of food and trade in Ghanaian towns. The foods named are common but not in every home; teachers should use what children know.'],
    reviewQuestions: ['Check the colours and the foods for local accuracy.'],
    guide: {
      overview: 'A colour rhyme set in a market. Form: five couplets. Rhyming pairs: heap/steep, bunch/lunch, sweet/treat, buy/dry, round/sound. It teaches colour words and healthy foods.',
      lessonMinutes: 15, goals: ['Name five colours.', 'Link colours to foods.', 'Spot rhymes.'],
      subjects: [['English Language', 'Colour words and rhyme'], ['Creative Arts', 'Colour']],
      before: ['Show real foods and ask children to name the colours.'], during: ['Hold up or point to something of each colour.'],
      after: ['Paint or colour a market scene.', 'Play I spy with colours.'],
      discussion: ['Which foods are good for our bodies?'], reflection: ['What colours are on your plate today?'],
      support: ['Use real fruit and cloth swatches.'], stretch: ['Add a verse for a purple or white food.'],
      localise: ['Use the foods sold at the nearest market.'],
    },
  }),

  // 3
  mk({
    key: 'rhyme-brush-brush-brush',
    title: 'Brush, Brush, Brush (a tooth-brushing chant)',
    summary: 'A chant about brushing teeth in the morning and at night, using a small brush, a little paste and a clean mouth.',
    classIds: ['nursery-2', 'kg-1', 'kg-2'], ageMin: 3, ageMax: 6, readingLevel: 'pre-reader', difficulty: 1,
    genres: ['rhyme', 'poetry'], themes: ['health-and-wellbeing', 'family'], objectives: ['phonics', 'oral-language', 'responsibility'],
    ghanaianContext: 'central', wpm: 70, paceWord: 'Brisk, matching the brushing beat', palette: ['#06b6d4', '#ffffff'],
    voice: 'Bright, brisk voice', characters: ['A child with a toothbrush and a cup of clean water at a basin, smiling with clean teeth.'],
    music: 'A quick two-beat rhythm, like brushing, on a shaker (placeholder)',
    pages: [
      pg('🪥', 'Brush, brush, brush in the morning light,\nUp and down, left and right.', 'A child brushing teeth in the morning.', 'Pretend to brush up and down, then side to side.'),
      pg('🦷', 'Little teeth, little teeth, all in a row,\nBrush them gently, nice and slow.', 'A child smiling to show clean teeth.', 'Smile and tap your teeth lightly.'),
      pg('🌙', 'Brush, brush, brush when the day is done,\nBefore we sleep, we brush each one.', 'A child brushing teeth at night.', 'Yawn, then pretend to brush.'),
      pg('💧', 'Spit it out and rinse with care,\nA clean fresh smile is ready to share.', 'A child rinsing with water from a cup.', 'Pretend to rinse and spit.'),
    ],
    activities: [
      { id: 'bs-c1', type: 'comprehension', afterPage: 3, question: 'When do we brush our teeth?', options: ['In the morning and at night', 'Only on Sundays', 'Never'], correctIndex: 0 },
      { id: 'bs-ph', type: 'phonics', afterPage: 1, targetSound: 'ight', prompt: 'Which word rhymes with light?', options: ['right', 'brush', 'down'], correctIndexes: [0] },
      { id: 'bs-ph2', type: 'phonics', afterPage: 2, targetSound: 'ow', prompt: 'Which words rhyme with row?', options: ['slow', 'teeth', 'gentle'], correctIndexes: [0] },
      { id: 'bs-sel', type: 'sel', afterPage: 4, prompt: 'How do you feel with a clean mouth?', feelingOptions: ['Fresh', 'Happy', 'Proud', 'Sleepy'] },
    ],
    glossary: [
      { word: 'brush', definition: 'To clean with a brush, such as teeth.', pages: [1, 3] },
      { word: 'rinse', definition: 'To wash with clean water.', pages: [4] },
      { word: 'smile', definition: 'A happy look on the face.', pages: [4] },
    ],
    culturalNotes: ['Many families also clean teeth with a chewing stick. This chant uses a toothbrush; teachers may add other safe cleaning methods that families use.'],
    reviewQuestions: ['Confirm with a dental or health source that brushing twice a day and rinsing is correct advice for young children, and that the advice about paste (a small amount, not swallowed) is added in the teacher notes.'],
    guide: {
      overview: 'A chant for the brushing habit. Form: four couplets. Rhyming pairs: light/right, row/slow, done/one, care/share. It teaches a daily habit and rhyme.',
      lessonMinutes: 15, goals: ['Say when to brush.', 'Show how to brush gently.', 'Spot rhymes.'],
      subjects: [['Our World Our People', 'Health habits'], ['English Language', 'Rhyme']],
      before: ['Ask: who has a toothbrush? When do you use it?'], during: ['Mime brushing as you chant.'],
      after: ['Draw a happy tooth and a sad tooth.', 'Practise brushing with a model or an adult.'],
      discussion: ['Why do we brush our teeth?', 'What sweet foods and drinks should we have less of?'],
      reflection: ['Which habit will you keep every day?'],
      support: ['Use a picture of the steps.'], stretch: ['Write two new lines about drinking water for healthy teeth.'],
      localise: ['Use the cleaning methods familiar to the children. Remind them to use only a pea-sized amount of paste and not swallow it. For children under three, a smear of paste (the size of a grain of rice) is enough, with an adult helping.'],
      factCheck: ['Confirm brushing twice a day, the pea-sized amount (ages 3 to 6) and the rice-grain smear (under three) with a health source.'],
    },
  }),

  // 4
  mk({
    key: 'rhyme-moon-and-stars-lullaby',
    title: 'Moon and Stars (a bedtime lullaby)',
    summary: 'A gentle lullaby about the moon, the stars, the quiet night and sleep, with a cuddle from family.',
    classIds: ['nursery-2', 'kg-1', 'kg-2'], ageMin: 3, ageMax: 6, readingLevel: 'pre-reader', difficulty: 1,
    genres: ['rhyme', 'bedtime', 'poetry'], themes: ['night-sky', 'family'], objectives: ['phonics', 'oral-language', 'emotional-intelligence'],
    ghanaianContext: 'central', wpm: 60, paceWord: 'Slow and soft, winding down', palette: ['#312e81', '#fde68a'],
    voice: 'Very soft, slow and gentle, almost a whisper at the end', characters: ['A child in bed by a window, with a parent sitting close, and a moon and stars outside.'],
    music: 'A slow, soft hum with a gentle shaker (placeholder)',
    pages: [
      pg('🌙', 'The moon is up, the day is through,\nThe night is calm and cool and blue.', 'A moon over a quiet village at night.', 'Slow and soft.'),
      pg('⭐', 'The stars are twinkling, one, two, three,\nThey shine up high for you and me.', 'Stars in a dark blue sky.', 'Count the stars softly.'),
      pg('🤗', 'A gentle hug and a kiss goodnight,\nThe room is cosy, the lamp is light.', 'A parent hugging a child in bed.', 'Very gentle.'),
      pg('😴', 'Close your eyes and breathe out slow,\nSleep well, little one. Dream you go.', 'A sleeping child under a blanket.', 'Whisper the last line.'),
    ],
    activities: [
      { id: 'ms-c1', type: 'comprehension', afterPage: 2, question: 'What is twinkling in the sky?', options: ['The stars', 'The sun', 'The kites'], correctIndex: 0 },
      { id: 'ms-ph', type: 'phonics', afterPage: 1, targetSound: 'oo', prompt: 'Which word rhymes with blue?', options: ['through', 'moon', 'calm'], correctIndexes: [0] },
      { id: 'ms-ph2', type: 'phonics', afterPage: 3, targetSound: 'ight', prompt: 'Which word rhymes with goodnight?', options: ['light', 'hug', 'kiss'], correctIndexes: [0] },
      { id: 'ms-sel', type: 'sel', afterPage: 4, prompt: 'How do you feel at bedtime?', feelingOptions: ['Sleepy', 'Calm', 'Safe', 'Loved'] },
    ],
    glossary: [
      { word: 'twinkling', definition: 'Shining with small, quick flashes of light.', pages: [2] },
      { word: 'cosy', definition: 'Warm, comfortable and safe.', pages: [3] },
      { word: 'breathe', definition: 'To take air into your body and let it out.', pages: [4] },
    ],
    culturalNotes: ['Lullabies are sung at bedtime in homes across Ghana in many languages. This one is original and does not copy any lullaby.'],
    reviewQuestions: ['Check that the tone is calm and that nothing is frightening.'],
    guide: {
      overview: 'A lullaby for winding down. Form: four couplets. Rhyming pairs: through/blue, three/me, goodnight/light, slow/go. It builds a calm bedtime routine.',
      lessonMinutes: 10, goals: ['Join in a calm song.', 'Spot rhymes.', 'Say what helps us feel calm at night.'],
      subjects: [['English Language', 'Rhyme'], ['Creative Arts', 'Quiet music']],
      before: ['Dim the lights and ask children to sit quietly.'], during: ['Read in a very soft voice and slow down at the end.'],
      after: ['Ask children to share their bedtime habits.', 'Draw the night sky.'],
      discussion: ['What can we see in the night sky?'], reflection: ['What helps you feel calm before sleep?'],
      support: ['Hum the tune instead of reading all the words.'], stretch: ['Make a new couplet about the stars.'],
      localise: ['Invite a family lullaby in a home language (with permission).'],
    },
  }),

  // 5
  mk({
    key: 'rhyme-feelings-song',
    title: 'The Feelings Song',
    summary: 'A song about feeling happy, sad, cross and scared, and a kind thing to do for each feeling.',
    classIds: ['kg-2', 'primary-1'], ageMin: 5, ageMax: 7, readingLevel: 'early', difficulty: 2,
    genres: ['rhyme', 'poetry'], themes: ['friendship', 'health-and-wellbeing'], objectives: ['emotional-intelligence', 'kindness', 'phonics', 'vocabulary'],
    ghanaianContext: 'central', wpm: 75, paceWord: 'Changing with each feeling', palette: ['#f59e0b', '#3b82f6'],
    voice: 'A different tone for each feeling: bright, soft, firm, shaky', characters: ['Four children showing happy, sad, cross and scared faces, with a teacher kneeling to talk with them.'],
    music: 'A tune that changes with each feeling: bright, slow, firm, then soft (placeholder)',
    pages: [
      pg('😀', 'When I am happy, I jump and sing,\nI share my smile with everything.', 'A child jumping with joy.', 'Bright and bouncy.'),
      pg('😢', 'When I am sad, I tell a friend,\nA hug and a talk can help me mend.', 'A child talking to a friend.', 'Soft and slow.'),
      pg('😠', 'When I am cross, I count to ten,\nThen I speak, and not shout, again.', 'A child counting on fingers.', 'Firm and steady.'),
      pg('😨', 'When I am scared, I do not hide,\nI ask a grown-up to stay by my side.', 'A child holding a teacher’s hand.', 'Soft and shaky, then calm.'),
      pg('🫶', 'All feelings are fine, they come and go,\nBe kind to yourself, and let them flow.', 'Children sitting in a circle with calm faces.', 'Warm and slow.'),
    ],
    activities: [
      { id: 'fs-c1', type: 'comprehension', afterPage: 3, question: 'What does the child do when cross?', options: ['Counts to ten', 'Shouts', 'Runs away'], correctIndex: 0 },
      { id: 'fs-ph', type: 'phonics', afterPage: 1, targetSound: 'ing', prompt: 'Which word rhymes with sing?', options: ['everything', 'happy', 'jump'], correctIndexes: [0] },
      { id: 'fs-ph2', type: 'phonics', afterPage: 3, targetSound: 'en', prompt: 'Which word rhymes with ten?', options: ['again', 'cross', 'count'], correctIndexes: [0] },
      { id: 'fs-sel', type: 'sel', afterPage: 5, prompt: 'How are you feeling right now?', feelingOptions: ['Happy', 'Sad', 'Cross', 'Scared'] },
    ],
    glossary: [
      { word: 'happy', definition: 'Feeling glad and pleased.', pages: [1] },
      { word: 'cross', definition: 'Feeling angry or annoyed.', pages: [3] },
      { word: 'scared', definition: 'Feeling afraid.', pages: [4] },
    ],
    culturalNotes: ['Children across Ghana feel the same feelings, and talking with a trusted adult helps. The song is original.'],
    reviewQuestions: ['Check that the advice is kind and that no feeling is shamed.'],
    guide: {
      overview: 'A song that names four feelings and one kind action for each. Form: five couplets. Rhyming pairs: sing/everything, friend/mend, ten/again, hide/side, go/flow. It builds feeling words and coping steps.',
      lessonMinutes: 20, goals: ['Name four feelings.', 'Choose a safe way to cope with each.', 'Ask a trusted adult for help.'],
      subjects: [['Our World Our People', 'Feelings and relationships'], ['English Language', 'Rhyme and feeling words']],
      before: ['Show four faces and ask children to name the feelings.'], during: ['Change your voice with each feeling.'],
      after: ['Role-play what to do when cross.', 'Make a feelings chart for the class.'],
      discussion: ['Who can you ask for help when scared?'], reflection: ['What helps you feel better when you are sad?'],
      support: ['Use face cards to point to a feeling.'], stretch: ['Write a verse for feeling proud or shy.'],
      localise: ['Add feeling words from the children’s home languages.', 'Remind children that a teacher or trusted adult is there if something big is making them sad or scared.'],
    },
  }),

  // 6
  mk({
    key: 'rhyme-the-ant-parade',
    title: 'The Ant Parade (a marching rhyme)',
    summary: 'A marching rhyme about ants that carry crumbs together, follow one another in a line and share a home.',
    classIds: ['kg-2', 'primary-1', 'primary-2'], ageMin: 5, ageMax: 8, readingLevel: 'early', difficulty: 2,
    genres: ['rhyme', 'animal', 'nature'], themes: ['animals-and-habitats', 'friendship'], objectives: ['teamwork', 'phonics', 'scientific-curiosity', 'vocabulary'],
    ghanaianContext: 'central', wpm: 75, paceWord: 'Marching, small steps', palette: ['#78350f', '#84cc16'],
    voice: 'Marching voice with small light taps', characters: ['A line of ants carrying crumbs along a path to a small ant hill, watched from a safe distance by two curious children.'],
    music: 'A light marching tap on a tin, small and steady (placeholder)',
    pages: [
      pg('🐜', 'Left, right, left, right, ants on a track,\nCarrying crumbs on each tiny back.', 'A line of ants on a path, each carrying a crumb.', 'Tap fingers like tiny feet.'),
      pg('🍞', 'A crumb is big when you are small,\nBut ants can carry it, one and all.', 'Several ants carrying a bread crumb.', 'Show a heavy load and smile.'),
      pg('🏔️', 'Down the path to their hill they go,\nA house of tunnels, deep below.', 'Ants entering an earth mound.', 'Lower your voice like going underground.'),
      pg('🤝', 'Together they work, and together they eat,\nNo ant is lonely, no ant is beat.', 'Ants sharing food in a nest.', 'Link arms.'),
      pg('👀', 'We watch them from far, we do not touch,\nThey are small, but they do very much.', 'Two children watching ants from a few steps away.', 'Stand back and look carefully.'),
    ],
    activities: [
      { id: 'ap-c1', type: 'comprehension', afterPage: 2, question: 'Why can the ants carry a crumb?', options: ['They work together', 'They use a basket', 'They fly'], correctIndex: 0 },
      { id: 'ap-ph', type: 'phonics', afterPage: 2, targetSound: 'all', prompt: 'Which word rhymes with small?', options: ['all', 'ant', 'crumb'], correctIndexes: [0] },
      { id: 'ap-ph2', type: 'phonics', afterPage: 1, targetSound: 'ine', prompt: 'Which word rhymes with line?', options: ['time', 'march', 'ant'], correctIndexes: [0] },
      { id: 'ap-sel', type: 'sel', afterPage: 5, prompt: 'When have you worked with a friend to do a big job?', feelingOptions: ['Proud', 'Happy', 'Tired', 'Strong'] },
    ],
    glossary: [
      { word: 'crumb', definition: 'A tiny piece of bread or food.', pages: [2] },
      { word: 'tunnels', definition: 'Long holes under the ground.', pages: [3] },
      { word: 'together', definition: 'With each other.', pages: [4] },
    ],
    culturalNotes: ['Ants are common everywhere in Ghana. Some bite or sting, so children are taught to watch from a distance. The rhyme is original.'],
    reviewQuestions: ['Check the ant facts: ants live in colonies, follow trails and carry food together, and no claim is made about every species.', 'Confirm that the safety line (watch from far, do not touch) is clear.'],
    guide: {
      overview: 'A marching rhyme about ant teamwork. Form: five couplets. Rhyming pairs: track/back, small/all, go/below, eat/beat, touch/much. It teaches teamwork and safe observation.',
      lessonMinutes: 20, goals: ['Say how ants work together.', 'Spot rhyming pairs.', 'Observe small animals safely.'],
      subjects: [['Integrated Science', 'Animals and their homes'], ['English Language', 'Rhyme']],
      before: ['Ask: where have you seen ants?'], during: ['Tap and march on the spot.'],
      after: ['Watch a line of ants from a distance (with the teacher) and count them.', 'Draw an ant line and its hill.'],
      discussion: ['How do ants help each other?', 'How can we work together in class?'],
      reflection: ['What big job can your team do together?'],
      support: ['Use a picture of an ant line to count with.'], stretch: ['Write a verse about another small animal and its home.'],
      localise: ['Use ant types the children know. Warn children that some ants bite, so no touching.'],
      factCheck: ['Confirm the ant colony facts with the Integrated Science syllabus.'],
    },
  }),

  // 7
  mk({
    key: 'rhyme-the-clean-school-chant',
    title: 'The Clean School Chant',
    summary: 'A chant for sweeping, picking up litter, using the bin and keeping toilets and water clean together as a class.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['rhyme', 'educational', 'school-life'], themes: ['school', 'citizenship', 'community'], objectives: ['responsibility', 'teamwork', 'environmental-awareness', 'phonics'],
    ghanaianContext: 'central', wpm: 75, paceWord: 'Firm, like a work chant', palette: ['#16a34a', '#0ea5e9'],
    voice: 'Strong, cheerful voice', characters: ['Children in school uniforms sweeping, putting litter in a bin and watering a flower bed, with a teacher helping.'],
    music: 'A work-chant beat with claps (placeholder)',
    pages: [
      pg('🧹', 'Sweep, sweep, sweep, the classroom floor,\nBrush the dust right out the door.', 'Children sweeping a classroom.', 'Sweep with strong arms.'),
      pg('🚮', 'Pick up the paper, pick up the peel,\nPut it in the bin, that is the deal.', 'Children picking up litter and using a bin.', 'Pretend to pick up and drop in a bin.'),
      pg('🌸', 'Water the flowers, give them a drink,\nA green school garden, what do you think?', 'Children watering a flower bed.', 'Pretend to water the plants.'),
      pg('🧼', 'Wash your hands with soap and clean water,\nGerms wash away from every son and daughter.', 'Children washing hands at a basin.', 'Rub your hands.'),
      pg('🤝', 'One hand cannot sweep it all,\nTogether we keep our school standing tall.', 'Children working together.', 'Join hands.'),
    ],
    activities: [
      { id: 'cs-c1', type: 'comprehension', afterPage: 2, question: 'Where does the litter go?', options: ['In the bin', 'On the floor', 'In the drain'], correctIndex: 0 },
      { id: 'cs-ph', type: 'phonics', afterPage: 1, targetSound: 'oor', prompt: 'Which word rhymes with floor?', options: ['door', 'sweep', 'dust'], correctIndexes: [0] },
      { id: 'cs-sel', type: 'sel', afterPage: 5, prompt: 'How do you feel when the school is clean?', feelingOptions: ['Proud', 'Happy', 'Healthy', 'Hopeful'] },
    ],
    glossary: [
      { word: 'peel', definition: 'The skin of a fruit, such as a banana or orange.', pages: [2] },
      { word: 'bin', definition: 'A container for rubbish.', pages: [2] },
      { word: 'together', definition: 'With each other.', pages: [5] },
    ],
    culturalNotes: ['School cleaning and weeding is a regular part of school life in Ghana. The chant treats it as a shared duty and not a punishment.'],
    reviewQuestions: ['Check that hand-washing with soap and clean water is shown correctly.'],
    guide: {
      overview: 'A work chant for a clean school. Form: five couplets. Rhyming pairs: floor/door, peel/deal, drink/think, water/daughter, all/tall. Note: water/daughter rhymes in some accents but not all; ask a local teacher to confirm it works in Ghanaian English, or swap the pair.',
      lessonMinutes: 20, goals: ['Name four jobs that keep a school clean.', 'Say why we work together.'],
      subjects: [['Our World Our People', 'Caring for our school'], ['English Language', 'Rhyme']],
      before: ['Look around the classroom and ask what could be cleaner.'], during: ['Act out each job.'],
      after: ['Make a class job chart.'], discussion: ['Why must everyone help?'], reflection: ['What job will you do?'],
      support: ['Use pictures for each job.'], stretch: ['Write a verse about keeping the school toilets clean.'],
      localise: ['Match jobs to what your school really does.'],
    },
  }),

  // 8
  mk({
    key: 'rhyme-sun-earth-and-moon',
    title: 'Sun, Earth and Moon (a poem)',
    summary: 'A poem about the Sun that gives light and warmth, the Earth that spins to make day and night, and the Moon that goes around us.',
    classIds: ['primary-2', 'primary-3', 'primary-4'], ageMin: 7, ageMax: 10, readingLevel: 'developing', difficulty: 2,
    genres: ['poetry', 'science', 'nature'], themes: ['night-sky', 'weather'], objectives: ['scientific-curiosity', 'reading-comprehension', 'vocabulary', 'phonics'],
    ghanaianContext: 'central', wpm: 80, paceWord: 'Calm and wondering', palette: ['#f59e0b', '#1e3a8a'],
    voice: 'Calm, wondering voice', characters: ['A child in a school uniform looking up at the daytime sky and at the Moon at night from a compound, with a teacher pointing at a model of the Earth.'],
    music: 'A slow, spinning flute tune and a soft drum (placeholder)',
    pages: [
      pg('☀️', 'The Sun is a star that is far, far away,\nIt gives us the light and the warmth of day.', 'A bright sun over a village.', 'Slow and wondering. Never look straight at the Sun.'),
      pg('🌍', 'The Earth is a ball that is turning round,\nOnce in a day, without a sound.', 'A globe with a small arrow showing it turns.', 'Turn slowly in a circle as you say it.'),
      pg('🌗', 'When our side turns away, it is night,\nThe sky grows dark and the stars shine bright.', 'A village at night with stars.', 'Lower your voice.'),
      pg('🌙', 'The Moon goes round us, slow and wide,\nWith the Sun’s light shining on its side.', 'The Moon above the Earth.', 'Move a hand in a circle around your head.'),
      pg('🔭', 'So look and wonder, and ask and learn,\nThe sky has secrets for each in turn.', 'A child looking up at the sky with a notebook.', 'Warm and curious.'),
    ],
    activities: [
      { id: 'se-c1', type: 'comprehension', afterPage: 2, question: 'What makes day and night?', options: ['The Earth turning', 'The Moon moving fast', 'The clouds'], correctIndex: 0 },
      { id: 'se-ph', type: 'phonics', afterPage: 1, targetSound: 'ay', prompt: 'Which words rhyme with day?', options: ['away', 'star', 'far'], correctIndexes: [0] },
      { id: 'se-s1', type: 'sequencing', prompt: 'Put the poem’s ideas in order.', items: ['The Sun gives light and warmth.', 'The Earth turns round.', 'Our side turns away and it is night.', 'The Moon goes round us.'] },
      { id: 'se-sel', type: 'sel', afterPage: 5, prompt: 'How does it feel to wonder about the sky?', feelingOptions: ['Curious', 'Amazed', 'Calm', 'Excited'] },
    ],
    glossary: [
      { word: 'star', definition: 'A huge ball of hot, glowing gas far away in space; the Sun is one.', pages: [1] },
      { word: 'turning', definition: 'Moving round and round.', pages: [2] },
      { word: 'Moon', definition: 'The big round rock that goes around the Earth.', pages: [4] },
    ],
    culturalNotes: ['Stories about the Sun and the Moon are told in many Ghanaian communities. This poem is only about the science and does not retell any story.'],
    reviewQuestions: ['Check the science: the Earth turns once in about a day, day and night come from that turning, the Moon goes round the Earth in about a month, and the Moon is lit by the Sun, which is why we see it.'],
    guide: {
      overview: 'A short poem about the Sun, Earth and Moon. Form: five couplets. Rhyming pairs: away/day, round/sound, night/bright, learn/turn, wide/side. It teaches day and night, the Moon’s orbit and a safe way to observe.',
      lessonMinutes: 25, goals: ['Explain day and night in a sentence.', 'Say that the Moon shines with the Sun’s light.', 'Spot rhymes.'],
      subjects: [['Integrated Science', 'The Sun, Earth and Moon'], ['English Language', 'Poetry']],
      before: ['Ask: why is it dark at night?'], during: ['Use a ball and a torch to show day and night.'],
      after: ['Draw the Moon on three different nights.', 'Make a model with a ball, a torch and a smaller ball.'],
      discussion: ['What happens when our side turns away from the Sun?'], reflection: ['What would you like to ask about the sky?'],
      support: ['Use the torch and ball model to show day and night.'], stretch: ['Write a verse about the planets.'],
      localise: ['Use stories about the Moon that local elders share, kept separate from the science.', 'Never look straight at the Sun.'],
      factCheck: ['Confirm the facts about the Earth, Moon and Sun with the Integrated Science syllabus.'],
    },
  }),
];
