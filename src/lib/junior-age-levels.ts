export interface CurriculumExercise {
  id: string;
  title: string;
  category: 'sounds' | 'letters' | 'cvc' | 'sentences' | 'tracing' | 'patterns' | 'reading';
  description: string;
  instructions: string;
  data: any;
}

export interface AgeTierConfig {
  id: 'ages2-3' | 'ages3-4' | 'ages4-5' | 'ages5+';
  name: string;
  subtitle: string;
  recommendedGrade: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  iconEmoji: string;
  objectives: string[];
  modules: string[];
}

export const AGE_TIERS: Record<string, AgeTierConfig> = {
  'ages2-3': {
    id: 'ages2-3',
    name: 'Ages 2–3',
    subtitle: 'Toddler & Playgroup',
    recommendedGrade: 'Crèche / Playgroup',
    color: 'from-amber-400 to-orange-400',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    borderColor: 'border-amber-400',
    iconEmoji: '🧸',
    objectives: [
      'Identifying animal sounds',
      'Naming common household objects',
      '"Guess the Sound" game',
      'Tracing straight lines & pre-writing shapes',
      'Repeating simple words clearly after audio'
    ],
    modules: ['coach', 'sounds_toddler', 'objects_toddler', 'tracing_toddler', 'rewards']
  },
  'ages3-4': {
    id: 'ages3-4',
    name: 'Ages 3–4',
    subtitle: 'Nursery 1 & Preschool',
    recommendedGrade: 'Nursery 1',
    color: 'from-pink-400 to-rose-400',
    badgeBg: 'bg-pink-100 text-pink-800 border-pink-300',
    borderColor: 'border-pink-400',
    iconEmoji: '🎨',
    objectives: [
      'Tracing letters & stroke order',
      'Matching letters to correct animal/object',
      'Distinguishing between similar-looking letters (b vs d, p vs q)',
      'Identifying the first sound in spoken words',
      'Completing a simple visual pattern (A-B-A-B)'
    ],
    modules: ['abc', 'phonics', 'tracing_letters', 'letter_match', 'patterns', 'rewards']
  },
  'ages4-5': {
    id: 'ages4-5',
    name: 'Ages 4–5',
    subtitle: 'Nursery 2 & Pre-K',
    recommendedGrade: 'Nursery 2 / Pre-K',
    color: 'from-teal-400 to-emerald-400',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    borderColor: 'border-teal-400',
    iconEmoji: '🚀',
    objectives: [
      'Reading simple CVC words (cat, dog, mop)',
      'Visual recognition of high-frequency sight words (the, is, etc.)',
      'Identifying words that rhyme (cat, hat, mat)',
      'Arranging scrambled letters to form a word',
      'Speed-blending drills (m-o-p -> mop)',
      'Reading 2-3 word phrases fluently'
    ],
    modules: ['cvc_builder', 'sight_words', 'rhyme_matcher', 'word_scramble', 'speed_blend', 'rewards']
  },
  'ages5+': {
    id: 'ages5+',
    name: 'Ages 5+',
    subtitle: 'KG2 & Primary 1 / Class 1 (Advanced)',
    recommendedGrade: 'Kindergarten / Class 1',
    color: 'from-indigo-500 to-purple-600',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    borderColor: 'border-indigo-500',
    iconEmoji: '🎓',
    objectives: [
      'Reading multi-sentence passages with advanced vocabulary & pacing',
      'Multi-syllable word breakdown (e.g. ex-plo-ra-tion)',
      'Chronological story event sequencing (4-step logic)',
      'Context clue sentence finisher & grammar recognition',
      'Descriptive Read & Draw comprehension challenges',
      'Advanced 2-digit math, multiplication arrays & time reading'
    ],
    modules: ['sentence_reader', 'syllables', 'story_sequencer', 'sentence_finisher', 'read_and_draw', 'advanced_math', 'stories', 'science', 'rewards']
  }
};

// --- DATASETS FOR AGES 2-3 ---
export const ANIMAL_SOUNDS = [
  { id: '1', animal: 'Dog', sound: 'Woof Woof!', emoji: '🐶', audioText: 'Woof woof! I am a friendly dog!' },
  { id: '2', animal: 'Cat', sound: 'Meow Meow!', emoji: '🐱', audioText: 'Meow meow! I am a sweet cat!' },
  { id: '3', animal: 'Cow', sound: 'Moo Moo!', emoji: '🐮', audioText: 'Moo moo! I am a big cow!' },
  { id: '4', animal: 'Duck', sound: 'Quack Quack!', emoji: '🦆', audioText: 'Quack quack! I am a happy duck!' },
  { id: '5', animal: 'Lion', sound: 'Roar Roar!', emoji: '🦁', audioText: 'Roar roar! I am a brave lion!' },
  { id: '6', animal: 'Sheep', sound: 'Baa Baa!', emoji: '🐑', audioText: 'Baa baa! I am a fluffy sheep!' }
];

export const HOUSEHOLD_OBJECTS = [
  { id: '1', name: 'Ball', emoji: '⚽', desc: 'Roll the round ball!' },
  { id: '2', name: 'Cup', emoji: '🥤', desc: 'Drink yummy water from the cup!' },
  { id: '3', name: 'Bed', emoji: '🛌', desc: 'Sleep cosy in the bed!' },
  { id: '4', name: 'Book', emoji: '📚', desc: 'Read stories in the book!' },
  { id: '5', name: 'Spoon', emoji: '🥄', desc: 'Eat cereal with the spoon!' },
  { id: '6', name: 'Chair', emoji: '🪑', desc: 'Sit down comfortably on the chair!' }
];

// --- DATASETS FOR AGES 3-4 ---
export const LETTER_DISTINCTION = [
  { id: '1', pair: ['b', 'd'], target: 'b', prompt: 'Which letter is "b"?', options: ['b', 'd', 'p', 'q'] },
  { id: '2', pair: ['p', 'q'], target: 'p', prompt: 'Which letter is "p"?', options: ['p', 'q', 'b', 'd'] },
  { id: '3', pair: ['m', 'w'], target: 'm', prompt: 'Which letter is "m"?', options: ['m', 'w', 'n', 'u'] },
  { id: '4', pair: ['n', 'u'], target: 'u', prompt: 'Which letter is "u"?', options: ['u', 'n', 'v', 'w'] }
];

export const PATTERN_DRILLS = [
  { id: '1', sequence: ['🔴', '🔵', '🔴', '❓'], answer: '🔵', options: ['🔴', '🔵', '🟡', '🟢'] },
  { id: '2', sequence: ['🐶', '🐱', '🐶', '❓'], answer: '🐱', options: ['🐶', '🐱', '🐭', '🐰'] },
  { id: '3', sequence: ['⭐', '🌙', '⭐', '❓'], answer: '🌙', options: ['☀️', '🌙', '⭐', '☁️'] },
  { id: '4', sequence: ['🍎', '🍌', '🍎', '❓'], answer: '🍌', options: ['🍎', '🍌', '🍊', '🍇'] }
];

// --- DATASETS FOR AGES 4-5 ---
export const CVC_WORDS = [
  { word: 'cat', C: 'c', V: 'a', C2: 't', emoji: '🐱', sentence: 'The cat sat on the mat.' },
  { word: 'dog', C: 'd', V: 'o', C2: 'g', emoji: '🐶', sentence: 'The dog ran in the fog.' },
  { word: 'mop', C: 'm', V: 'o', C2: 'p', emoji: '🧹', sentence: 'Mop the wet floor.' },
  { word: 'sun', C: 's', V: 'u', C2: 'n', emoji: '☀️', sentence: 'The sun is bright and warm.' },
  { word: 'bed', C: 'b', V: 'e', C2: 'd', emoji: '🛏️', sentence: 'Go to sleep in your bed.' },
  { word: 'pin', C: 'p', V: 'i', C2: 'n', emoji: '📌', sentence: 'A sharp little pin.' }
];

export const SIGHT_WORDS = [
  { word: 'the', example: 'The sun is shining.' },
  { word: 'is', example: 'This is my happy puppy.' },
  { word: 'and', example: 'Apples and bananas are yummy.' },
  { word: 'in', example: 'The toy is in the box.' },
  { word: 'at', example: 'Look at the pretty butterfly.' },
  { word: 'on', example: 'The cat is on the soft rug.' }
];

export const RHYME_MATCHES = [
  { word: 'cat', rhymesWith: ['hat', 'mat', 'bat'], distractor: 'dog', emoji: '🎩' },
  { word: 'pan', rhymesWith: ['man', 'fan', 'can'], distractor: 'box', emoji: '🍳' },
  { word: 'pin', rhymesWith: ['fin', 'win', 'bin'], distractor: 'sun', emoji: '🐟' },
  { word: 'hop', rhymesWith: ['top', 'mop', 'pop'], distractor: 'bed', emoji: '🥏' }
];

// --- ADVANCED DATASETS FOR AGES 5+ (KG2 / CLASS 1) ---
export const SENTENCE_PACING_READS = [
  {
    id: '1',
    title: 'The Brave Space Explorer 🚀',
    sentence: 'Commander Leo put on his shiny helmet and launched his rocket into the starry blue universe.',
    syllablesBreakdown: ['Com-man-der', 'Le-o', 'put', 'on', 'his', 'shi-ny', 'hel-met', 'and', 'launched', 'his', 'roc-ket', 'in-to', 'the', 'star-ry', 'blue', 'u-ni-verse.'],
    vocabFocus: ['Commander', 'Shiny', 'Universe', 'Launched'],
    drawDescription: 'Draw Commander Leo in a space suit standing next to a rocket ship surrounded by stars and planets!'
  },
  {
    id: '2',
    title: 'The Secret Coral Reef 🐠',
    sentence: 'A glowing golden fish swam gracefully through the colourful sea anemones to explore the ocean floor.',
    syllablesBreakdown: ['A', 'glow-ing', 'gol-den', 'fish', 'swam', 'grace-ful-ly', 'through', 'the', 'co-lour-ful', 'sea', 'a-nem-o-nes', 'to', 'ex-plore', 'the', 'o-cean', 'floor.'],
    vocabFocus: ['Gracefully', 'Colourful', 'Anemones', 'Explore'],
    drawDescription: 'Draw a ocean floor with colourful corals, sea anemones, and a golden swimming fish!'
  },
  {
    id: '3',
    title: 'The Ancient Forest Adventure 🌲',
    sentence: 'The curious woodland animals gathered around the giant oak tree to listen to the wise old owl.',
    syllablesBreakdown: ['The', 'cu-ri-ous', 'wood-land', 'an-i-mals', 'gath-ered', 'a-round', 'the', 'gi-ant', 'oak', 'tree', 'to', 'lis-ten', 'to', 'the', 'wise', 'old', 'owl.'],
    vocabFocus: ['Curious', 'Gathered', 'Giant', 'Wisdom'],
    drawDescription: 'Draw a big oak tree in a forest with an owl perched on a branch and forest animals listening below!'
  }
];

export const STORY_SEQUENCING_DRILLS = [
  {
    title: 'Launching a Satellite into Orbit 🚀',
    events: [
      { order: 1, text: 'Engineers build and test the satellite in the laboratory cleanroom.' },
      { order: 2, text: 'The rocket booster countdown reaches zero and ignites at launchpad.' },
      { order: 3, text: 'The rocket ascends into space and detaches the satellite in orbit.' },
      { order: 4, text: 'Solar panels unfold and send communication signals back to Earth.' }
    ]
  },
  {
    title: 'The Journey of Water (The Water Cycle) 🌧️',
    events: [
      { order: 1, text: 'The warm sun heats water in oceans and rivers to evaporate into steam.' },
      { order: 2, text: 'Water vapor cools down and condenses into fluffy clouds in the sky.' },
      { order: 3, text: 'Heavy clouds release rainwater or snow back down to the ground.' },
      { order: 4, text: 'Rainwater flows back into streams, rivers, and oceans.' }
    ]
  },
  {
    title: 'Baking a Birthday Cake 🎂',
    events: [
      { order: 1, text: 'Measure flour, sugar, butter, and crack fresh eggs into a bowl.' },
      { order: 2, text: 'Mix the ingredients thoroughly and pour batter into a round cake pan.' },
      { order: 3, text: 'Bake in the warm oven for 30 minutes until golden and fluffy.' },
      { order: 4, text: 'Decorate with sweet frosting, sprinkles, and candles.' }
    ]
  }
];

export const INCOMPLETE_SENTENCES = [
  {
    id: '1',
    prompt: 'Astronauts float weightlessly in space because there is very little ______.',
    answer: 'gravity',
    options: ['gravity', 'chocolate', 'noise', 'curtains']
  },
  {
    id: '2',
    prompt: 'Botanists study green plants to learn how they convert sunlight into ______.',
    answer: 'energy',
    options: ['energy', 'pencils', 'ice cream', 'sand']
  },
  {
    id: '3',
    prompt: 'A magnet attracts objects that are made of ______.',
    answer: 'iron',
    options: ['iron', 'paper', 'wood', 'cotton']
  },
  {
    id: '4',
    prompt: 'Submarines dive deep underwater using strong steel hulls to withstand high ______.',
    answer: 'pressure',
    options: ['pressure', 'sugar', 'feathers', 'sunlight']
  }
];

export const ADVANCED_VOICE_WORDS_AGE5 = [
  { word: "Exploration", emoji: "🧭", sentence: "The brave team went on an exciting space exploration!", phonetic: "/ˌek.spləˈreɪ.ʃən/" },
  { word: "Glistening", emoji: "✨", sentence: "The morning dew was glistening on the green grass.", phonetic: "/ˈɡlɪs.n̩.ɪŋ/" },
  { word: "Constellation", emoji: "🌌", sentence: "Look up at the night sky to spot the Orion constellation!", phonetic: "/ˌkɒn.stəˈleɪ.ʃən/" },
  { word: "Metamorphosis", emoji: "🦋", sentence: "The caterpillar underwent metamorphosis to become a butterfly.", phonetic: "/ˌmet.əˈmɔː.fə.sɪs/" },
  { word: "Photosynthesis", emoji: "🌿", sentence: "Green leaves use sunlight for photosynthesis.", phonetic: "/ˌfəʊ.təʊˈsɪn.θə.sɪs/" }
];
