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
  modules: string[]; // module ids available for this tier
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
    subtitle: 'KG2 & Primary 1 / Class 1',
    recommendedGrade: 'Kindergarten / Class 1',
    color: 'from-indigo-500 to-purple-500',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    borderColor: 'border-indigo-400',
    iconEmoji: '🎓',
    objectives: [
      'Reading full sentences with proper pacing & fluency',
      'Breaking down longer words into syllables',
      'Putting story events in the correct order',
      'Finishing an incomplete sentence',
      'Reading a description and drawing what it says'
    ],
    modules: ['sentence_reader', 'syllables', 'story_sequencer', 'sentence_finisher', 'read_and_draw', 'stories', 'science', 'rewards']
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

// --- DATASETS FOR AGES 5+ ---
export const SENTENCE_PACING_READS = [
  {
    id: '1',
    sentence: 'The brave little dog ran across the sunny garden to catch the red ball.',
    syllablesBreakdown: ['The', 'brave', 'lit-tle', 'dog', 'ran', 'a-cross', 'the', 'sun-ny', 'gar-den', 'to', 'catch', 'the', 'red', 'ball.'],
    drawDescription: 'Draw a dog playing with a red ball in a sunny garden with green grass!'
  },
  {
    id: '2',
    sentence: 'A yellow star shines high in the night sky above the green trees.',
    syllablesBreakdown: ['A', 'yel-low', 'star', 'shines', 'high', 'in', 'the', 'night', 'sky', 'a-bove', 'the', 'green', 'trees.'],
    drawDescription: 'Draw night sky with a yellow star and green trees below!'
  }
];

export const STORY_SEQUENCING_DRILLS = [
  {
    title: 'Baking a Cake',
    events: [
      { order: 1, text: 'Mix the flour, eggs, and sugar in a bowl.' },
      { order: 2, text: 'Pour the cake batter into a baking pan.' },
      { order: 3, text: 'Bake the cake in the warm oven.' },
      { order: 4, text: 'Eat the delicious warm cake!' }
    ]
  },
  {
    title: 'Planting a Flower Seed',
    events: [
      { order: 1, text: 'Dig a tiny hole in the soft soil.' },
      { order: 2, text: 'Drop the flower seed into the hole.' },
      { order: 3, text: 'Water the seed with fresh clean water.' },
      { order: 4, text: 'Watch a beautiful green sprout grow!' }
    ]
  }
];

export const INCOMPLETE_SENTENCES = [
  {
    id: '1',
    prompt: 'The rabbit loves to eat crunchy ______.',
    answer: 'carrots',
    options: ['carrots', 'books', 'shoes', 'rocks']
  },
  {
    id: '2',
    prompt: 'We wear warm coats when the weather is ______.',
    answer: 'cold',
    options: ['cold', 'hot', 'sunny', 'purple']
  },
  {
    id: '3',
    prompt: 'A big bird flies high up in the ______.',
    answer: 'sky',
    options: ['sky', 'water', 'kitchen', 'pencil']
  }
];
