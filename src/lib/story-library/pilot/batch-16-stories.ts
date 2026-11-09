/**
 * Batch 16: eight ORIGINAL poems about Ghana, from nursery rhymes to a Shakespearean sonnet, written in the style
 * and with the literary devices that the BECE English literature paper tests (rhyme scheme, stanza, figures of speech,
 * imagery, tone, theme, free verse). The older poems echo the themes of the Beacon of Light anthology (education as a
 * light, national identity, Ghanaian settings and symbols) WITHOUT reproducing any prescribed text.
 *
 * Each poem is a story whose pages are its stanzas, with a read-aloud narration plan, rhyme and device activities and a
 * teacher guide that names the form, rhyme scheme and devices. All poems are drafts awaiting review.
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

export const BATCH_16_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'poem-kente-colours',
    title: 'Kente Colours (a rhyme)',
    summary: 'A bright counting-and-colour rhyme: red sun, gold stars, green leaves, blue sea, black night and white clouds, all woven together like kente.',
    classIds: ['nursery-2', 'kg-1'],
    ageMin: 3,
    ageMax: 5,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['rhyme', 'poetry', 'cultural'],
    themes: ['festivals', 'farm-and-garden', 'weather'],
    objectives: ['phonics', 'vocabulary', 'oral-language', 'cultural-heritage'],
    ghanaianContext: 'central',
    wpm: 70,
    paceWord: 'Bouncy and clear, with a clap on every rhyme',
    palette: ['#dc2626', '#facc15'],
    voice: 'Bright, sing-song voice, like a nursery teacher leading a class',
    characters: ['No characters: each page is a colour picture of something in Ghana (sun, stars, cocoa leaf, sea, night drums, white clouds and a kente cloth).'],
    music: 'Light marimba with a skipping rhythm (placeholder)',
    pages: [
      pg('🌞', 'Red is the sun when it wakes up high,\nGold is the shine of the stars in the sky.', 'A big red sun and a gold-starred sky over a Ghanaian village.', 'Sing it gently, clapping on high and sky.'),
      pg('🌿', 'Green is the leaf on the cocoa tree,\nBlue is the water that runs to the sea.', 'A green cocoa leaf and blue water running to the sea.', 'Sing it gently, clapping on tree and sea.'),
      pg('🥁', 'Black is the night when the drums go still,\nWhite is the cloud on top of the hill.', 'A dark night with a quiet drum and a white cloud above a hill.', 'Sing it gently, clapping on still and hill.'),
      pg('🧵', 'Weave them together, strip by strip,\nKente is colour from end to tip.', 'A weaver’s hands making a bright kente strip.', 'Slow down on the last line and smile.'),
    ],
    activities: [
      { id: 'kc-c1', type: 'comprehension', afterPage: 1, question: 'What colour is the sun in the rhyme?', options: ['Red', 'Blue', 'Black'], correctIndex: 0 },
      { id: 'kc-ph', type: 'phonics', afterPage: 2, targetSound: 'ee', prompt: 'Which word rhymes with tree?', options: ['sea', 'sun', 'hill'], correctIndexes: [0] },
      { id: 'kc-c2', type: 'comprehension', afterPage: 3, question: 'Which colour is the cloud?', options: ['White', 'Green', 'Red'], correctIndex: 0 },
      { id: 'kc-sel', type: 'sel', afterPage: 4, prompt: 'Which colour makes you feel happy today?', feelingOptions: ['Happy', 'Calm', 'Excited', 'Proud'] },
    ],
    glossary: [
      { word: 'kente', definition: 'A colourful woven cloth from Ghana.', pages: [4] },
      { word: 'weave', definition: 'To cross threads over and under each other to make cloth.', pages: [4] },
      { word: 'cocoa', definition: 'A tree whose seeds are used to make chocolate.', pages: [2] },
    ],
    culturalNotes: ['Kente is a hand-woven cloth from Ghana. The poem uses colours from nature and does not give the traditional meanings of kente colours, which vary and are best learned from weavers and elders.'],
    reviewQuestions: ['Check that every line is simple enough for ages 3 to 5 and that the rhymes (sky/high, tree/sea, still/hill, strip/tip) are clear in Ghanaian English.'],
    guide: {
      overview: 'A first rhyme. Children hear pairs of rhyming words, name colours and link them to things they see in Ghana. Form: four couplets (rhyme scheme AA BB CC DD).',
      lessonMinutes: 15,
      goals: ['Hear and say rhyming pairs.', 'Name six colours.', 'Say a short poem by heart.'],
      subjects: [['English Language', 'Rhyme and listening'], ['Creative Arts', 'Colour and weaving']],
      before: ['Show a piece of kente or a picture of one.'],
      during: ['Clap on each rhyming word.'],
      after: ['Weave paper strips of the six colours into a mat.', 'Find objects in the room for each colour.'],
      discussion: ['Which two words rhyme in each pair?'],
      reflection: ['Which colour is your favourite?'],
      maths: [{ task: 'The rhyme names six colours. Count them.', answer: 'Red, gold, green, blue, black and white make 6.' }],
      support: ['Say one line at a time and let children echo.'],
      stretch: ['Make a new couplet about a seventh colour.'],
      localise: ['Invite a weaver or elder to talk about kente.', 'Do not tell children what each colour “means” unless an elder or weaver has shared it.'],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'poem-drum-drum-come-and-play',
    title: 'Drum, Drum, Come and Play (a rhyme)',
    summary: 'A noisy rhythm rhyme with booms, taps, claps and stamps, for clapping and dancing along.',
    classIds: ['kg-1', 'kg-2'],
    ageMin: 4,
    ageMax: 6,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['rhyme', 'poetry', 'cultural'],
    themes: ['festivals', 'friendship', 'community'],
    objectives: ['phonics', 'oral-language', 'vocabulary', 'cultural-heritage'],
    ghanaianContext: 'central',
    wpm: 70,
    paceWord: 'Rhythmic and playful, with loud and soft changes',
    palette: ['#b45309', '#16a34a'],
    voice: 'Playful, rhythmic voice; the sound words are said loudly or softly as written',
    characters: ['Children of different ages in school uniforms, clapping and dancing around a big wooden drum and a small drum.'],
    music: 'A steady hand-drum beat under the voice (placeholder)',
    pages: [
      pg('🥁', 'Boom, boom, the big drum sings,\nTap, tap, the small drum rings.', 'A big drum and a small drum with children listening.', 'Say boom low and loud, tap high and light.'),
      pg('👏', 'Clap, clap, hands in the air,\nStamp, stamp, feet everywhere.', 'Children clap and stamp in a circle.', 'Clap and stamp together with the children.'),
      pg('🐢', 'Slow, slow, the drum goes low,\nQuick, quick, now off we go!', 'Children walk slowly and then run around the drum.', 'Slow down on the first line, speed up on the second.'),
      pg('🤫', 'Hush, hush, the drum is shy,\nBoom! it shouts, and we say, “Hi!”', 'A drum with a shy face and children waving.', 'Whisper the first line, shout the Boom, then wave.'),
    ],
    activities: [
      { id: 'dr-c1', type: 'comprehension', afterPage: 1, question: 'Which drum goes “boom”?', options: ['The big drum', 'The small drum', 'The shy drum'], correctIndex: 0 },
      { id: 'dr-ph', type: 'phonics', afterPage: 2, targetSound: 'air', prompt: 'Which word rhymes with air?', options: ['everywhere', 'drum', 'stamp'], correctIndexes: [0] },
      { id: 'dr-ph2', type: 'phonics', afterPage: 3, targetSound: 'ow', prompt: 'Which words rhyme with low?', options: ['go', 'quick', 'slow'], correctIndexes: [0, 2] },
      { id: 'dr-sel', type: 'sel', afterPage: 4, prompt: 'Do you feel loud or quiet today?', feelingOptions: ['Loud', 'Quiet', 'Happy', 'Shy'] },
    ],
    glossary: [
      { word: 'drum', definition: 'A musical instrument you hit to make a sound.', pages: [1] },
      { word: 'stamp', definition: 'To put your foot down hard.', pages: [2] },
      { word: 'hush', definition: 'A word we say to ask for quiet.', pages: [4] },
    ],
    culturalNotes: ['Drumming is part of many Ghanaian celebrations and school cultural days. The rhyme does not copy any traditional drum piece.'],
    reviewQuestions: ['Check that the sound words (boom, tap, clap, stamp) work in Ghanaian English and that no real drum rhythm is claimed.'],
    guide: {
      overview: 'A rhythm rhyme that teaches onomatopoeia (sound words), loud and soft, and rhyming pairs (sings/rings, air/everywhere, low/go, shy/hi). Form: four couplets.',
      lessonMinutes: 15,
      goals: ['Say sound words with the right volume.', 'Spot rhyming pairs.', 'Keep a steady beat.'],
      subjects: [['English Language', 'Rhyme and sound words'], ['Creative Arts', 'Music and movement']],
      before: ['Tap a simple rhythm on a desk and ask children to echo it.'],
      during: ['Clap and stamp as the poem says.'],
      after: ['Make home-made drums from tins and play a quiet and a loud pattern.', 'Invent a new line: Tick, tick, the clock goes quick.'],
      discussion: ['Which words are sounds?'],
      reflection: ['When is it good to be loud, and when quiet?'],
      support: ['Use movement to show slow, quick, loud and soft.'],
      stretch: ['Write two new rhyming lines with sound words.'],
      localise: ['Let children share a drum rhythm they know from home or school.'],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'poem-harmattan-morning',
    title: 'Harmattan Morning (a poem)',
    summary: 'A rhyming poem about the dry, dusty harmattan wind: the pale sky, cracked lips, shea butter, a shy sun and a kite flying on the hill.',
    classIds: ['primary-1', 'primary-2'],
    ageMin: 6,
    ageMax: 8,
    readingLevel: 'early',
    difficulty: 2,
    genres: ['rhyme', 'poetry', 'nature'],
    themes: ['weather', 'family', 'health-and-wellbeing'],
    objectives: ['phonics', 'vocabulary', 'reading-comprehension', 'environmental-awareness'],
    ghanaianContext: 'central',
    wpm: 75,
    paceWord: 'Soft and dry, then lifting for the kite',
    palette: ['#a16207', '#fde68a'],
    voice: 'Soft, warm voice; a little breathy for the wind',
    characters: ['A child in a school uniform with dusty feet, Mama with a small tin of shea butter, and a boy flying a kite on a hill.'],
    music: 'Gentle wind and a light flute (placeholder)',
    pages: [
      pg('🌫️', 'The harmattan wind blows soft and dry,\nIt paints a pale haze across the sky.', 'A pale dusty sky over a village at dawn.'),
      pg('👄', 'It tickles my nose and cracks my lips,\nIt steals the dew from the leaves’ green tips.', 'A child rubs her nose while dew-free leaves hang nearby.'),
      pg('🧴', 'Mama rubs shea butter on my knees,\nAnd wraps me up against the breeze.', 'A mother rubs shea butter on a child’s knees and wraps a cloth around her.'),
      pg('🟠', 'The sun is a coin of orange gold,\nA shy little thing, not big or bold.', 'A small orange sun behind a dusty haze.'),
      pg('🪁', 'We fly our kites on the Saturday hill,\nThe wind is a friend that is never still.', 'Children fly kites on a hill under a hazy sky.'),
    ],
    activities: [
      { id: 'hm-c1', type: 'comprehension', afterPage: 2, question: 'What does the wind do to the child’s lips?', options: ['Cracks them', 'Paints them blue', 'Makes them sing'], correctIndex: 0 },
      { id: 'hm-ph', type: 'phonics', afterPage: 3, targetSound: 'ees', prompt: 'Which word rhymes with knees?', options: ['breeze', 'butter', 'wind'], correctIndexes: [0] },
      { id: 'hm-c2', type: 'comprehension', afterPage: 4, question: 'What is the sun compared to?', options: ['A coin of orange gold', 'A red ball', 'A white plate'], correctIndex: 0, explanation: 'This is a metaphor: the poem says the sun is a coin.' },
      { id: 'hm-voc', type: 'vocabulary', afterPage: 1, word: 'haze', definition: 'A thin cloud of dust or smoke in the air that makes things look pale.', distractors: ['A kind of bird', 'A loud noise'] },
      { id: 'hm-s1', type: 'sequencing', prompt: 'Put the poem’s pictures in order.', items: ['The wind blows across the sky.', 'Mama rubs shea butter on my knees.', 'The shy orange sun peeps out.', 'We fly kites on the hill.'] },
      { id: 'hm-sel', type: 'sel', afterPage: 5, prompt: 'The poem says the wind is a friend. Do you like harmattan weather?', feelingOptions: ['Happy', 'Cold', 'Dusty', 'Playful'] },
    ],
    glossary: [
      { word: 'harmattan', definition: 'A dry, dusty wind from the Sahara that blows across West Africa in the dry season.', pages: [1] },
      { word: 'haze', definition: 'A thin cloud of dust that makes the sky look pale.', pages: [1] },
      { word: 'breeze', definition: 'A gentle wind.', pages: [3] },
      { word: 'kites', definition: 'Light toys with a string that fly in the wind.', pages: [5] },
    ],
    culturalNotes: ['Harmattan is a dry, dusty wind in the Ghanaian dry season, and shea butter is used for skin care, especially in the north. Kite flying is a popular harmattan pastime in many places.'],
    reviewQuestions: ['Confirm the harmattan details match children’s experience across Ghana (kites, shea butter, dry lips).', 'Check the rhyme pairs: dry/sky, lips/tips, knees/breeze, gold/bold, hill/still.'],
    guide: {
      overview: 'A poem that teaches rhyming couplets, a simple metaphor (the sun is a coin) and personification (the wind steals dew and is a friend). Form: five couplets (AA BB CC DD EE).',
      lessonMinutes: 25,
      goals: ['Find the rhyming pairs.', 'Say what a metaphor is in simple words.', 'Describe harmattan weather.'],
      subjects: [['English Language', 'Rhyme, metaphor and personification'], ['Integrated Science', 'Weather and seasons']],
      before: ['Ask: what is the weather like in harmattan?'],
      during: ['Ask learners to tap the table at each rhyme.'],
      after: ['Write two new rhyming lines about the harmattan.', 'Make a kite from paper and sticks (adult help).'],
      discussion: ['What does it mean when the poem says the wind is a friend?', 'Which words rhyme?'],
      reflection: ['How do you look after your skin in harmattan?'],
      support: ['Underline the rhyming words in two colours.'],
      stretch: ['Add a verse about harmattan nights.'],
      localise: ['Change details to match your area (for example, the harmattan is stronger in the north).', 'Teach kite safety: never fly kites near roads or power lines.'],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'poem-market-day-song',
    title: 'Market Day Song (a poem)',
    summary: 'A lively market poem full of colours, sounds and bargaining, with a chorus to chant together.',
    classIds: ['primary-2', 'primary-3'],
    ageMin: 7,
    ageMax: 9,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['rhyme', 'poetry', 'cultural'],
    themes: ['money-and-enterprise', 'community', 'food'],
    objectives: ['phonics', 'vocabulary', 'oral-language', 'cultural-heritage'],
    ghanaianContext: 'central',
    culturalTags: ['market'],
    wpm: 80,
    paceWord: 'Quick and cheerful, like a market chant',
    palette: ['#dc2626', '#16a34a'],
    voice: 'Cheerful call-and-response voice, with the chorus said by a group',
    characters: ['A market trader auntie in a bright cloth with a tray, a girl with a basket on her head, a boy with coins, a stall of tomatoes, plantain, yams and fish.'],
    music: 'Busy market ambience with a light highlife-style tune (placeholder)',
    pages: [
      pg('🍅', 'Tomatoes red, plantain ripe and gold,\nCome buy, come buy, before they are sold!', 'A stall of red tomatoes and golden plantain with a smiling trader.'),
      pg('🍍', 'Yams so big and fish so fresh,\nPineapples sweet in a basket of mesh.', 'Big yams, fresh fish and pineapples in a mesh basket.'),
      pg('🪙', 'Clink go the coins in the trader’s hand,\nChatter and laughter, a happy band.', 'A trader counts coins while customers laugh.'),
      pg('🗣️', '“Auntie, please, make it small!”\n“Madam, my price is fair for all!”', 'A customer and a trader bargain with friendly faces.'),
      pg('🧺', 'Baskets on heads, so balanced and straight,\nWalking in rhythm, never late.', 'Women and girls walk with baskets on their heads in a line.'),
      pg('🎶', 'Come, come, buy, buy, what will you take?\nFresh from the farm, for goodness’ sake!', 'The whole market sings together under bright awnings.'),
    ],
    activities: [
      { id: 'md-c1', type: 'comprehension', afterPage: 2, question: 'Which foods does the trader sell in the first two verses?', options: ['Tomatoes, plantain, yams, fish and pineapples', 'Shoes and hats', 'Books and pencils'], correctIndex: 0 },
      { id: 'md-ph', type: 'phonics', afterPage: 3, targetSound: 'and', prompt: 'Which words rhyme with hand?', options: ['band', 'coins', 'sand'], correctIndexes: [0, 2] },
      { id: 'md-c2', type: 'comprehension', afterPage: 4, question: 'What does “Clink” show?', options: ['The sound of coins', 'The colour of fish', 'The taste of yam'], correctIndex: 0, explanation: 'Clink is a sound word, called onomatopoeia.' },
      { id: 'md-voc', type: 'vocabulary', afterPage: 4, word: 'bargain', definition: 'To talk about a price to agree on one that is fair.', distractors: ['To carry a basket', 'To cook food'] },
      { id: 'md-s1', type: 'sequencing', prompt: 'Put the market day in order.', items: ['The traders show their goods.', 'Coins clink in the trader’s hand.', 'The customer bargains.', 'People carry baskets home.'] },
      { id: 'md-sel', type: 'sel', afterPage: 6, prompt: 'A market can be noisy and busy. How does it make you feel?', feelingOptions: ['Excited', 'Hungry', 'Happy', 'Overwhelmed'] },
    ],
    glossary: [
      { word: 'plantain', definition: 'A starchy fruit like a big banana that is cooked before eating.', pages: [1] },
      { word: 'price', definition: 'The amount of money you must pay for something.', pages: [4] },
      { word: 'chatter', definition: 'Fast, friendly talking.', pages: [3] },
      { word: 'balanced', definition: 'Steady and not falling over.', pages: [5] },
    ],
    culturalNotes: ['Markets are important places for food, trade and meeting people in Ghana. Bargaining is common and polite.', 'Using “Auntie” and “Madam” reflects everyday Ghanaian ways of showing respect to a trader.'],
    reviewQuestions: ['Check the rhyme pairs: gold/sold, fresh/mesh, hand/band, small/all, straight/late, take/sake.'],
    guide: {
      overview: 'A market poem that teaches rhyme, alliteration (“chatter and laughter”) and onomatopoeia (clink). Form: six couplets, the last a chorus.',
      lessonMinutes: 25,
      goals: ['Find rhyming pairs.', 'Identify a sound word.', 'Say the chorus together with rhythm.'],
      subjects: [['English Language', 'Rhyme and sound words'], ['Mathematics', 'Money and prices'], ['Social Studies', 'Markets']],
      before: ['Ask: what do you see, hear and smell in a market?'],
      during: ['Split the class into two groups: one reads the verse, the other the chorus.'],
      after: ['Set up a class market and practise polite bargaining with play money.', 'Write a verse about your own favourite stall.'],
      discussion: ['Why is bargaining polite?', 'Which words imitate sounds?'],
      reflection: ['What would you sell at a market?'],
      maths: [{ task: 'A pineapple costs GH₵ 4. How much do 3 cost?', answer: '3 × 4 = GH₵ 12.' }, { task: 'You pay GH₵ 20 for goods costing GH₵ 14. What is your change?', answer: 'GH₵ 6.' }],
      support: ['Provide picture cards for the foods.'],
      stretch: ['Write a verse with alliteration about your favourite market food.'],
      localise: ['Use your local market, foods and prices.', 'Keep price examples realistic for your area.'],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'poem-my-mother-tongue',
    title: 'My Mother Tongue (a poem)',
    summary: 'A four-stanza poem in alternating rhyme about the many languages of Ghana, with a river, a drum band and a seed in the soil.',
    classIds: ['primary-5', 'primary-6'],
    ageMin: 10,
    ageMax: 12,
    readingLevel: 'fluent',
    difficulty: 3,
    genres: ['poetry', 'cultural', 'rhyme'],
    themes: ['identity', 'family', 'citizenship'],
    objectives: ['vocabulary', 'reading-comprehension', 'cultural-heritage', 'inference'],
    ghanaianContext: 'central',
    wpm: 80,
    paceWord: 'Warm and steady, building pride towards the end',
    palette: ['#0f766e', '#facc15'],
    voice: 'Warm, proud voice with a steady rhythm, slowing on the last line of each stanza',
    characters: ['A grandmother and a grandchild talking in a kitchen, a river, a band of drummers of different ages, and a seed being planted.'],
    music: 'Gentle strings and soft hand percussion (placeholder)',
    pages: [
      pg('🌊', 'My mother tongue is a river, calm and wide,\nThat carries the proverbs my grandmothers knew;\nIt sings in the kitchen, it hums by my side,\nAnd whispers me home when the day is through.', 'A calm wide river flowing past a kitchen window where a grandmother speaks to a child.'),
      pg('🥁', 'Though Ghana has many tongues across the land,\nEach one is a drum with a beat of its own;\nTogether they play as a joyful band,\nA music no lonely voice has known.', 'Drummers of different ages play together in a village square.'),
      pg('🕊️', 'Let English and French lift me up from the ground,\nTo carry me over the sea and the skies;\nBut my mother tongue keeps my feet safe and sound,\nAnd tells me who I am when I rise.', 'A child with open wings of paper stands on the ground, looking at the sky.'),
      pg('🌱', 'So speak it with pride, like a drum, loud and true,\nAnd pass it to children like seed to the soil;\nFor a language that’s loved will keep growing anew,\nA gift that is guarded by love and by toil.', 'A grandmother and child plant a seed together in the soil.'),
    ],
    activities: [
      { id: 'mt-c1', type: 'comprehension', afterPage: 1, question: 'In the first stanza, what is the mother tongue compared to?', options: ['A river', 'A mountain', 'A road'], correctIndex: 0, explanation: 'The line “My mother tongue is a river” is a metaphor because it says one thing is another.' },
      { id: 'mt-c2', type: 'comprehension', afterPage: 2, question: 'What figure of speech is “each one is a drum”?', options: ['A metaphor', 'A simile', 'An onomatopoeia'], correctIndex: 0, explanation: 'It says each language is a drum without using “like” or “as”.' },
      { id: 'mt-c3', type: 'comprehension', afterPage: 4, question: 'Which line contains a simile?', options: ['So speak it with pride, like a drum, loud and true', 'My mother tongue is a river', 'Each one is a drum'], correctIndex: 0, explanation: 'A simile uses “like” or “as” to compare.' },
      { id: 'mt-ph', type: 'phonics', afterPage: 2, targetSound: 'and', prompt: 'Which words at the ends of lines 1 and 3 of stanza two rhyme?', options: ['land', 'band', 'own'], correctIndexes: [0, 1] },
      { id: 'mt-voc', type: 'vocabulary', afterPage: 1, word: 'proverbs', definition: 'Short sayings that carry old wisdom.', distractors: ['Long stories', 'Songs about rivers'] },
      { id: 'mt-sel', type: 'sel', afterPage: 4, prompt: 'The poem says language is a gift to pass on. Which words from your mother tongue do you treasure?', feelingOptions: ['Proud', 'Thankful', 'Warm', 'Curious'] },
    ],
    glossary: [
      { word: 'proverbs', definition: 'Short sayings that carry old wisdom.', pages: [1] },
      { word: 'tongues', definition: 'Languages.', pages: [2] },
      { word: 'guarded', definition: 'Kept safe and looked after.', pages: [4] },
      { word: 'toil', definition: 'Hard work.', pages: [4] },
    ],
    culturalNotes: ['Ghana has many languages. The poem does not name any one language so that every child can hear their own mother tongue in it. It mentions English and French because English is the official language and French is spoken in neighbouring countries.'],
    reviewQuestions: ['Check that the rhyme pairs in each stanza (wide/side, knew/through; land/band, own/known; ground/sound, skies/rise; true/anew, soil/toil) are accepted rhymes in Ghanaian English.', 'Check the metre is natural to read aloud.'],
    guide: {
      overview: 'A rhymed poem that practises the BECE vocabulary of form and figures of speech. Form: four quatrains (four-line stanzas) with rhyme scheme ABAB in each. Devices: metaphor (river, drum), simile (like a drum, like seed to the soil), imagery, alliteration (safe and sound), contrast (English and French versus mother tongue). Theme: pride in one’s mother tongue. Tone: warm and proud.',
      lessonMinutes: 40,
      goals: ['Identify the rhyme scheme ABAB.', 'Find a metaphor, a simile and alliteration.', 'State the theme and tone in a sentence.'],
      subjects: [['English Language / Literature', 'Poetry: form, devices and theme'], ['Ghanaian Language', 'Pride in the mother tongue']],
      before: ['Ask: which proverb do you know in your mother tongue?'],
      during: ['At each stanza, ask learners to underline the last word of every line and label A or B.'],
      after: ['Write a four-line stanza in ABAB about your mother tongue.', 'Make a chart: device, example, effect.'],
      discussion: ['Why does the poet compare a language to a river and a drum?', 'What is the poet’s attitude to English and French?'],
      reflection: ['What would be lost if a language disappeared?'],
      support: ['Provide a sheet with the poem and blanks for the rhyme letters.'],
      stretch: ['Compare this poem’s theme with another poem on identity.'],
      localise: ['Invite elders or older learners to say a proverb in your local language and translate it.', 'Do not rank languages; value every learner’s mother tongue.'],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'poem-black-star-rising',
    title: 'Black Star Rising (a poem)',
    summary: 'A ballad in six stanzas about Ghana’s independence and the symbols of its flag, ending with a call to young people to carry the light.',
    classIds: ['jhs-1', 'jhs-2'],
    ageMin: 12,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['poetry', 'historical', 'cultural'],
    themes: ['citizenship', 'identity', 'leadership'],
    objectives: ['critical-thinking', 'vocabulary', 'inference', 'cultural-heritage'],
    ghanaianContext: 'central',
    wpm: 85,
    paceWord: 'Steady and proud, like a march, lifting on the last stanza',
    palette: ['#b91c1c', '#166534'],
    voice: 'Proud, steady ballad voice; slow and clear on the last two stanzas',
    characters: ['A crowd in Accra in the morning, flags in red, gold and green with a black star, drums, palm trees, and a young person holding a lantern at the end.'],
    music: 'A stately drum march with a rising horn on the last stanza (placeholder)',
    pages: [
      pg('🌅', 'On the sixth of March, in fifty-seven,\nThe morning rose like gold;\nA people stood in the Accra heat\nAnd a new tale began to unfold.', 'A crowd gathers in Accra at sunrise under a golden sky.'),
      pg('🇬🇭', 'Red for the blood of those who fought,\nGold for the wealth in the ground,\nGreen for the forest and the farm,\nA Black Star for Africa, safe and sound.', 'A flag in red, gold and green with a black star flutters in the wind.'),
      pg('🥁', 'The drums spoke loud across the crowd,\nThe flags danced in the breeze,\nAnd hope rose up like morning mist\nAbove the tall palm trees.', 'Drummers play as flags wave above a crowd beneath palm trees.'),
      pg('🛤️', 'But freedom is not a finish line,\nIt is a road we walk;\nIt asks for hands that build and learn\nAnd honest words that talk.', 'A long road crossing a green landscape with people walking and building.'),
      pg('🛡️', 'So when you see the Black Star shine\nOn cloth, on arch, on field,\nRemember: light is something shared,\nAnd a nation is a shield.', 'A black star on a cloth, an arch and a football field, with a shield behind them.'),
      pg('🏮', 'Rise, young Ghana, read and dream,\nBe a lantern in the night;\nThe star above the gate is yours—\nNow carry on its light.', 'A young person holds a lantern at night beneath a large star over a gate.'),
    ],
    activities: [
      { id: 'bs-c1', type: 'comprehension', afterPage: 2, question: 'According to the poem, what does gold stand for?', options: ['The wealth in the ground', 'The sun', 'The forest'], correctIndex: 0 },
      { id: 'bs-c2', type: 'comprehension', afterPage: 3, question: 'Which figure of speech is “hope rose up like morning mist”?', options: ['A simile', 'A metaphor', 'Hyperbole'], correctIndex: 0, explanation: 'It uses “like” to compare hope to mist.' },
      { id: 'bs-c3', type: 'comprehension', afterPage: 4, question: 'What does “freedom is not a finish line, it is a road we walk” mean?', options: ['Freedom needs continued effort', 'Freedom is easy', 'Freedom ends'], correctIndex: 0, explanation: 'This is a metaphor: freedom is compared to a road, showing it is ongoing.' },
      { id: 'bs-ph', type: 'phonics', afterPage: 4, targetSound: 'alk', prompt: 'In the fourth stanza, which two words rhyme?', options: ['walk', 'talk', 'learn'], correctIndexes: [0, 1] },
      { id: 'bs-c4', type: 'comprehension', afterPage: 5, question: 'Which line is a metaphor?', options: ['A nation is a shield', 'Like morning mist', 'Red for the blood'], correctIndex: 0, explanation: 'It says a nation is a shield without using like or as.' },
      { id: 'bs-sel', type: 'sel', afterPage: 6, prompt: 'The last stanza asks young people to be lanterns. What can you do to be a light for your community?', feelingOptions: ['Inspired', 'Proud', 'Determined', 'Hopeful'] },
    ],
    glossary: [
      { word: 'unfold', definition: 'To open out slowly and be revealed.', pages: [1] },
      { word: 'wealth', definition: 'A large amount of valuable things.', pages: [2] },
      { word: 'shield', definition: 'Something that protects.', pages: [5] },
      { word: 'lantern', definition: 'A lamp with a handle that gives light.', pages: [6] },
    ],
    culturalNotes: ['Ghana became independent on 6 March 1957. The flag has red, gold and green bands with a black star, widely explained as: red for the blood of those who struggled, gold for mineral wealth, green for forests and farms, and the Black Star as the guiding star of African freedom. Accra’s Black Star Square and Independence Arch are national landmarks.', 'This poem is an original work. It is written to practise reading poems like those in the BECE anthology, not to copy them.'],
    reviewQuestions: ['Confirm the date (6 March 1957) and the commonly stated meanings of the flag’s colours and the Black Star against an official or scholarly source (for example the Ghana Government site or a national history).', 'Check rhyme pairs: gold/unfold, ground/sound, breeze/trees, walk/talk, field/shield, night/light.', 'Confirm the poem is clearly original and does not borrow lines from any prescribed text.'],
    guide: {
      overview: 'A ballad with a strong national theme, a good model of the form and devices that BECE poetry questions test. Form: six quatrains (four-line stanzas) with rhyme scheme ABCB (the second and fourth lines rhyme). Devices: simile (like morning mist), metaphor (freedom is a road, a nation is a shield), personification (the morning rose; the drums spoke), symbolism (red, gold, green, Black Star, lantern), imagery, alliteration (safe and sound), repetition (green/gold/red anaphora). Tone: proud and hopeful. Theme: freedom is a responsibility that each generation must carry on.',
      lessonMinutes: 45,
      goals: ['Identify the ballad form and ABCB rhyme scheme.', 'Name at least four figures of speech with examples.', 'Explain the theme and tone with evidence from the text.'],
      subjects: [['English Language / Literature', 'Poetry: form, devices, theme and tone'], ['Social Studies / History', 'Independence and national symbols']],
      before: ['Ask: what do the colours and star of the flag mean to you?'],
      during: ['At each stanza, ask learners to underline the rhyming words and label the rhyme scheme.'],
      after: ['Write a device table: device, quotation, effect.', 'Write one stanza of your own in ABCB about a Ghanaian symbol.'],
      discussion: ['Why does the poet say freedom is a road, not a finish line?', 'What is the effect of ending with the word light?'],
      reflection: ['What would you do to carry the light for your community?'],
      maths: [{ task: 'From 1957 to 2026 is how many years?', answer: '69 years.' }],
      support: ['Provide a labelled version of the first stanza as a model.'],
      stretch: ['Compare this poem with another poem about a national theme: how do the tones differ?'],
      localise: ['Invite a history teacher or elder to talk about independence day memories.', 'Check the meanings of the flag with the official sources your school uses.'],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'poem-the-lantern-at-the-schoolgate',
    title: 'The Lantern at the Schoolgate (a poem)',
    summary: 'A free-verse poem about a girl who studies by lantern light during a power cut, and what it means to be a beacon of light.',
    classIds: ['jhs-2', 'jhs-3'],
    ageMin: 13,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['poetry', 'realistic-fiction'],
    themes: ['school', 'fear-and-courage', 'identity'],
    objectives: ['inference', 'critical-thinking', 'vocabulary', 'perseverance'],
    ghanaianContext: 'central',
    wpm: 85,
    paceWord: 'Quiet and thoughtful, with space after each stanza',
    palette: ['#1e293b', '#f59e0b'],
    voice: 'Quiet, reflective voice; slows and brightens in the last two stanzas',
    characters: ['Aseye: a 13-year-old girl in a school uniform, studying by a small kerosene lantern at a wooden desk in a dark classroom.', 'The narrator: an adult remembering her, not shown.'],
    music: 'A single soft piano line with a distant night ambience (placeholder)',
    pages: [
      pg('🌑', 'At five in the evening the generator coughs\nand falls silent.\nThe classroom swallows the dark.', 'A classroom going dark at dusk as the lights switch off.'),
      pg('🏮', 'Aseye lights a lantern\nthe size of a fist,\nits small flame trembling\nlike a bird in its first storm.', 'A girl lights a small lantern at her desk.'),
      pg('✏️', 'Her pencil scratches like a hen on dry ground\nscratching for grain.\nEach sum is a seed, each sentence a sprout\nin the dust of the night.', 'A girl writes by lantern light while a hen is hinted in a thought bubble.'),
      pg('🌒', 'Outside, the road is a black river;\nthe moon is a cracked coin;\nand fear stands at the gate\nwith its arms folded.', 'A dark road, a cracked moon and a shadowy figure at the school gate.'),
      pg('📖', 'But the little flame leans forward\nand lights the page, the desk, her face\nuntil the dark\nbecomes a room she can read in.', 'The lantern’s glow grows to fill the page and her face.'),
      pg('🔦', 'I think of her when I hear the word beacon.\nA beacon need not be a tower on a cliff;\nsometimes it is a girl, a lantern, a page,\nand a stubborn light that will not go out.', 'A lighthouse on a cliff dissolves into a girl with a lantern at a desk.'),
    ],
    activities: [
      { id: 'lg-c1', type: 'comprehension', afterPage: 2, question: 'Which figure of speech is “like a bird in its first storm”?', options: ['A simile', 'A metaphor', 'Personification'], correctIndex: 0, explanation: 'It compares the flame to a bird using “like”.' },
      { id: 'lg-c2', type: 'comprehension', afterPage: 4, question: 'In “the road is a black river”, what is the poet doing?', options: ['Using a metaphor to show the darkness and danger of the road', 'Describing a real river', 'Using onomatopoeia'], correctIndex: 0, explanation: 'The road is not literally a river; the metaphor creates a picture of darkness.' },
      { id: 'lg-c3', type: 'comprehension', afterPage: 4, question: 'What does “fear stands at the gate with its arms folded” show?', options: ['Personification of fear', 'A simile about the gate', 'A rhyme scheme'], correctIndex: 0, explanation: 'Fear is given human actions: standing and folding arms.' },
      { id: 'lg-c4', type: 'comprehension', afterPage: 5, question: 'What type of verse is the poem written in?', options: ['Free verse with no regular rhyme scheme', 'A Shakespearean sonnet', 'A ballad with ABCB rhymes'], correctIndex: 0, explanation: 'The lines do not follow a fixed rhyme or metre.' },
      { id: 'lg-c5', type: 'comprehension', afterPage: 6, question: 'What is the theme of the poem?', options: ['Determination and learning can be a light in hard times', 'Electricity is expensive', 'Hens are useful'], correctIndex: 0 },
      { id: 'lg-voc', type: 'vocabulary', afterPage: 1, word: 'beacon', definition: 'A light or signal that guides or warns people.', distractors: ['A kind of lantern oil', 'A type of road'] },
      { id: 'lg-sel', type: 'sel', afterPage: 6, prompt: 'Aseye kept studying even though it was hard. When have you kept going when things were difficult?', feelingOptions: ['Determined', 'Inspired', 'Tired', 'Proud'] },
    ],
    glossary: [
      { word: 'generator', definition: 'A machine that makes electricity.', pages: [1] },
      { word: 'lantern', definition: 'A lamp with a handle that gives light.', pages: [2] },
      { word: 'beacon', definition: 'A light or signal that guides or warns people.', pages: [6] },
      { word: 'stubborn', definition: 'Determined and not willing to give up.', pages: [6] },
    ],
    culturalNotes: ['Power cuts and studying by lantern or phone light are familiar to many Ghanaian students. The poem is original and is about determination, not about blaming anyone.', 'The title word beacon links to the “Beacon of Light” idea of education as a guiding light, as in the BECE literature anthology.'],
    reviewQuestions: ['Check that the poem’s tone is hopeful and does not blame or stereotype any community.', 'Confirm that free verse, simile, metaphor, personification, imagery and symbolism are identified accurately in the guide.', 'Confirm the poem is clearly original and not close to any prescribed text.'],
    guide: {
      overview: 'A free-verse poem that demonstrates the devices BECE questions test. Form: free verse in six stanzas (a tercet followed by five quatrains; no end-rhyme). Devices: simile (like a bird, like a hen), metaphor (each sum is a seed; the road is a black river; the moon is a cracked coin), personification (the classroom swallows the dark; fear stands with arms folded), imagery (sight and sound), symbolism (lantern as hope and learning), contrast (dark and light), and a shift of voice in the last stanza. Tone: quiet, then hopeful. Theme: determination and education as a beacon.',
      lessonMinutes: 50,
      goals: ['Identify free verse and explain how it differs from rhymed verse.', 'Identify simile, metaphor and personification with quotations.', 'Explain the symbol of the lantern and the theme.'],
      subjects: [['English Language / Literature', 'Poetry: form, devices, imagery and theme'], ['Personal and Social Development', 'Perseverance']],
      before: ['Ask: what does the word beacon bring to mind?'],
      during: ['At each stanza, ask learners to find one device and say what it adds.'],
      after: ['Write a short paragraph: “How does the poet present determination?” using three quotations.', 'Write a free-verse stanza about a moment of determination in your own life.'],
      discussion: ['Why does the poet use animals and seeds to describe studying?', 'What is the effect of the last stanza changing to “I”?'],
      reflection: ['What is the “lantern” in your life?'],
      support: ['Provide a device table with the quotations already filled in.'],
      stretch: ['Compare how this poem and a rhymed poem present hope.'],
      localise: ['Link to learners’ own experiences with studying in hard conditions, without blaming anyone.', 'Do not encourage study by candle or open flame near anything flammable; use safe lights.'],
    },
  }),

  // 8 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'poem-cocoa-sonnet',
    title: 'Cocoa (a sonnet)',
    summary: 'A fourteen-line Shakespearean sonnet about a Ghanaian cocoa farmer, from the pod on the tree to a chocolate bar far away.',
    classIds: ['jhs-3'],
    ageMin: 14,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['poetry', 'cultural'],
    themes: ['farm-and-garden', 'money-and-enterprise', 'citizenship'],
    objectives: ['critical-thinking', 'inference', 'vocabulary', 'cultural-heritage'],
    ghanaianContext: 'central',
    wpm: 80,
    paceWord: 'Measured and thoughtful, with weight on the closing couplet',
    palette: ['#78350f', '#65a30d'],
    voice: 'Measured, thoughtful voice with a slight lift on the turn at line nine',
    characters: ['A cocoa farmer in a hat with a cutlass opening a pod, white beans on banana leaves, drying mats in the sun, and a chocolate bar in a shop far away.'],
    music: 'Warm acoustic guitar with a soft shaker rhythm (placeholder)',
    pages: [
      pg('🌳', 'In shade of tall trees, where the cocoa grows,\nThe pods hang heavy, gold and green and red;\nA farmer walks the rows as daylight glows,\nAnd dreams of school fees, books, and daily bread.', 'A farmer walks among cocoa trees with colourful pods on their trunks.'),
      pg('🫘', 'He splits a pod; the pale seeds glisten, wet,\nThen wraps them under leaves to warm and sleep,\nFor days of quiet change, and then they’re set\nTo dry in sun, where careful mats will keep.', 'A farmer opens a pod, covers beans with leaves, and spreads dried beans on mats.'),
      pg('🍫', 'Far off, a bar is wrapped in shining gold,\nAnd someone smiles, unknowing whose the toil;\nThe farmer’s price is small, the story old,\nYet pride is rooted deeper than the soil.', 'A chocolate bar in gold foil in a shop far away, beside a distant picture of the farm.'),
      pg('🤝', 'So taste with thanks, and when the sweetness ends,\nRemember Ghana’s farmers are your friends.', 'A child holds a piece of chocolate and looks thoughtfully at a picture of a farmer.'),
    ],
    activities: [
      { id: 'cs-c1', type: 'comprehension', afterPage: 1, question: 'What does the farmer dream of in the first quatrain?', options: ['School fees, books and daily bread', 'A new car', 'A holiday abroad'], correctIndex: 0 },
      { id: 'cs-c2', type: 'comprehension', afterPage: 2, question: 'What is the process described in the second quatrain?', options: ['Opening the pod, fermenting the beans under leaves and drying them in the sun', 'Planting seeds', 'Grinding cocoa'], correctIndex: 0, explanation: 'The beans are covered with leaves to ferment, then dried on mats.' },
      { id: 'cs-ph', type: 'phonics', afterPage: 3, targetSound: 'oil', prompt: 'Which words end lines 2 and 4 of the third quatrain and rhyme?', options: ['toil', 'soil', 'old'], correctIndexes: [0, 1] },
      { id: 'cs-c3', type: 'comprehension', afterPage: 3, question: 'What does the third quatrain suggest about the farmer’s reward?', options: ['The price he receives is small even though the work is hard', 'He is very rich', 'Chocolate is free'], correctIndex: 0 },
      { id: 'cs-c4', type: 'comprehension', afterPage: 4, question: 'What is the rhyme scheme of this Shakespearean sonnet?', options: ['ABAB CDCD EFEF GG', 'AABB CCDD EEFF GG', 'ABBA ABBA CDE CDE'], correctIndex: 0, explanation: 'A Shakespearean sonnet has three quatrains and a closing couplet.' },
      { id: 'cs-c5', type: 'comprehension', afterPage: 4, question: 'What is the purpose of the final couplet?', options: ['To give a message to the reader, a thank-you and a reminder', 'To describe the tree again', 'To introduce a new character'], correctIndex: 0, explanation: 'The couplet turns from description to a moral appeal.' },
      { id: 'cs-sel', type: 'sel', afterPage: 4, prompt: 'The poem asks us to remember the people behind the food we eat. How does that make you feel?', feelingOptions: ['Thankful', 'Thoughtful', 'Concerned', 'Respectful'] },
    ],
    glossary: [
      { word: 'glisten', definition: 'To shine with a wet or sparkling light.', pages: [2] },
      { word: 'toil', definition: 'Hard work.', pages: [3] },
      { word: 'unknowing', definition: 'Not aware or not knowing.', pages: [3] },
      { word: 'sweetness', definition: 'The sweet taste or quality of something.', pages: [4] },
    ],
    culturalNotes: ['Cocoa is one of Ghana’s main crops, grown by many small farmers. The poem is a general tribute and does not describe any one farm. The line “the farmer’s price is small” reflects a view commonly expressed about farmers’ share of chocolate prices and may be discussed with learners using current facts.', 'The poem is original and follows the Shakespearean sonnet form to give practice with a form BECE candidates are expected to recognise.'],
    reviewQuestions: ['Check the cocoa processing steps (pods split, beans fermented under leaves, dried in the sun on mats) with an agriculture teacher.', 'Check the claim that farmers earn a small share of the final price against a recent, named source before using it in class discussion.', 'Check the rhyme scheme: grows/glows, red/bread, wet/set, sleep/keep, gold/old, toil/soil, ends/friends; check the metre is roughly iambic pentameter.'],
    guide: {
      overview: 'A Shakespearean (English) sonnet on a Ghanaian subject. Form: 14 lines in three quatrains and a closing couplet, rhyme scheme ABAB CDCD EFEF GG, roughly ten syllables a line. Devices: imagery (colour and process), contrast (the farmer’s hard work and the distant chocolate bar), irony (someone smiles, unknowing whose the toil), metaphor (pride is rooted deeper than the soil), alliteration (days, daily, dreams), and a turn in the third quatrain. Tone: respectful and gently critical. Theme: appreciation of the people behind our food.',
      lessonMinutes: 50,
      goals: ['Recognise a Shakespearean sonnet and its rhyme scheme.', 'Identify imagery, irony and metaphor with quotations.', 'Explain the theme and the effect of the closing couplet.'],
      subjects: [['English Language / Literature', 'Poetry: sonnet form, devices and theme'], ['Social Studies / Economics', 'Farmers, trade and fair prices'], ['Agricultural Science', 'Cocoa processing']],
      before: ['Ask: where does chocolate come from?'],
      during: ['At each quatrain, ask learners to label the rhyme scheme letters.'],
      after: ['Write the rhyme scheme in the margin and label the three quatrains and the couplet.', 'Write a short paragraph: “How does the poet present the cocoa farmer?”'],
      discussion: ['Why does the poet shift from the farm to a faraway shop?', 'What does “pride is rooted deeper than the soil” mean?'],
      reflection: ['What can you do to appreciate the people who grow your food?'],
      maths: [{ task: 'A sonnet has 14 lines. If each line has about 10 syllables, how many syllables in all?', answer: '14 × 10 = 140 syllables.' }],
      support: ['Provide the sonnet with the line endings highlighted.'],
      stretch: ['Compare a sonnet with a ballad: how do form and tone differ?'],
      localise: ['Invite a local farmer or agriculture officer to speak.', 'Use current, sourced facts about prices when discussing fairness.'],
    },
  }),
];

