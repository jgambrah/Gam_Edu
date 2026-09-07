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
  internationalTier: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  iconEmoji: string;
  objectives: string[];
  modules: string[];
}

export interface SSPSoundCard {
  id: string;
  grapheme: string;
  upperGrapheme: string;
  phoneme: string;
  speechPhonic: string;
  exampleWord: string;
  exampleEmoji: string;
  phase: 'Phase 2' | 'Phase 3' | 'Phase 4' | 'Phase 5';
  set: string;
  category: 'Single Letters' | 'Consonant Digraphs' | 'Vowel Digraphs' | 'Trigraphs';
  formationCue?: string;
  audioUrl?: string;
  isCustom?: boolean;
}

export interface SSPPhaseGroup {
  id: string;
  phase: string;
  setName: string;
  description: string;
  color: string;
  badgeBg: string;
  sounds: SSPSoundCard[];
}

// Systematic Synthetic Phonics (SSP) Phase 2 & 3 Standard Sequence
export const SSP_PHONICS_PRESET: SSPPhaseGroup[] = [
  {
    id: 'p2-set1',
    phase: 'Phase 2',
    setName: 'Set 1: s, a, t, p',
    description: 'Foundational consonants and short vowel for initial 2-letter and 3-letter blending (at, sat, pat, tap).',
    color: 'border-rose-300 bg-rose-50/40 text-rose-800',
    badgeBg: 'bg-rose-100 text-rose-700 border-rose-200',
    sounds: [
      { id: 'ssp-s', grapheme: 's', upperGrapheme: 'S', phoneme: '/s/', speechPhonic: 's', exampleWord: 'sun', exampleEmoji: '☀️', phase: 'Phase 2', set: 'Set 1', category: 'Single Letters', formationCue: 'Slither down the snake' },
      { id: 'ssp-a', grapheme: 'a', upperGrapheme: 'A', phoneme: '/æ/', speechPhonic: 'ah', exampleWord: 'apple', exampleEmoji: '🍎', phase: 'Phase 2', set: 'Set 1', category: 'Single Letters', formationCue: 'Around the apple and down the leaf' },
      { id: 'ssp-t', grapheme: 't', upperGrapheme: 'T', phoneme: '/t/', speechPhonic: 't', exampleWord: 'tap', exampleEmoji: '🚰', phase: 'Phase 2', set: 'Set 1', category: 'Single Letters', formationCue: 'Down the tower, across the tower' },
      { id: 'ssp-p', grapheme: 'p', upperGrapheme: 'P', phoneme: '/p/', speechPhonic: 'p', exampleWord: 'pan', exampleEmoji: '🍳', phase: 'Phase 2', set: 'Set 1', category: 'Single Letters', formationCue: 'Down the pirate plait and around his face' }
    ]
  },
  {
    id: 'p2-set2',
    phase: 'Phase 2',
    setName: 'Set 2: i, n, m, d',
    description: 'Expanding CVC decodable inventory (pin, tin, man, mat, sad, dim).',
    color: 'border-emerald-300 bg-emerald-50/40 text-emerald-800',
    badgeBg: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    sounds: [
      { id: 'ssp-i', grapheme: 'i', upperGrapheme: 'I', phoneme: '/ɪ/', speechPhonic: 'ih', exampleWord: 'insect', exampleEmoji: '🐜', phase: 'Phase 2', set: 'Set 2', category: 'Single Letters', formationCue: 'Down the insect body and dot for his head' },
      { id: 'ssp-n', grapheme: 'n', upperGrapheme: 'N', phoneme: '/n/', speechPhonic: 'nnn', exampleWord: 'net', exampleEmoji: '🥅', phase: 'Phase 2', set: 'Set 2', category: 'Single Letters', formationCue: 'Down Nobby and over his net' },
      { id: 'ssp-m', grapheme: 'm', upperGrapheme: 'M', phoneme: '/m/', speechPhonic: 'mmm', exampleWord: 'moon', exampleEmoji: '🌙', phase: 'Phase 2', set: 'Set 2', category: 'Single Letters', formationCue: 'Maisie, mountain, mountain' },
      { id: 'ssp-d', grapheme: 'd', upperGrapheme: 'D', phoneme: '/d/', speechPhonic: 'd as in duck', exampleWord: 'duck', exampleEmoji: '🦆', phase: 'Phase 2', set: 'Set 2', category: 'Single Letters', formationCue: 'Round the dinosaur bottom, up his tall neck, down to his feet' }
    ]
  },
  {
    id: 'p2-set3',
    phase: 'Phase 2',
    setName: 'Set 3: g, o, c, k',
    description: 'Introducing velar stops and short rounded vowel for words like dog, pot, cup, kid.',
    color: 'border-teal-300 bg-teal-50/40 text-teal-800',
    badgeBg: 'bg-teal-100 text-teal-700 border-teal-200',
    sounds: [
      { id: 'ssp-g', grapheme: 'g', upperGrapheme: 'G', phoneme: '/ɡ/', speechPhonic: 'guh', exampleWord: 'girl', exampleEmoji: '👧', phase: 'Phase 2', set: 'Set 3', category: 'Single Letters', formationCue: 'Round her face, down her braid, and give her a curl' },
      { id: 'ssp-o', grapheme: 'o', upperGrapheme: 'O', phoneme: '/ɒ/', speechPhonic: 'ah', exampleWord: 'octopus', exampleEmoji: '🐙', phase: 'Phase 2', set: 'Set 3', category: 'Single Letters', formationCue: 'All the way round the orange' },
      { id: 'ssp-c', grapheme: 'c', upperGrapheme: 'C', phoneme: '/k/', speechPhonic: 'k', exampleWord: 'cat', exampleEmoji: '🐱', phase: 'Phase 2', set: 'Set 3', category: 'Single Letters', formationCue: 'Curl around the caterpillar' },
      { id: 'ssp-k', grapheme: 'k', upperGrapheme: 'K', phoneme: '/k/', speechPhonic: 'k', exampleWord: 'kite', exampleEmoji: '🪁', phase: 'Phase 2', set: 'Set 3', category: 'Single Letters', formationCue: 'Down the kangaroo body, tail, and leg' }
    ]
  },
  {
    id: 'p2-set4',
    phase: 'Phase 2',
    setName: 'Set 4: ck, e, u, r',
    description: 'Introducing first consonant digraph ck and remaining short vowels.',
    color: 'border-amber-300 bg-amber-50/40 text-amber-800',
    badgeBg: 'bg-amber-100 text-amber-700 border-amber-200',
    sounds: [
      { id: 'ssp-ck', grapheme: 'ck', upperGrapheme: 'CK', phoneme: '/k/', speechPhonic: 'k', exampleWord: 'duck', exampleEmoji: '🦆', phase: 'Phase 2', set: 'Set 4', category: 'Consonant Digraphs', formationCue: 'Two letters making one sound: c and k together' },
      { id: 'ssp-e', grapheme: 'e', upperGrapheme: 'E', phoneme: '/ɛ/', speechPhonic: 'eh', exampleWord: 'egg', exampleEmoji: '🥚', phase: 'Phase 2', set: 'Set 4', category: 'Single Letters', formationCue: 'Lift off top and scoop out the egg' },
      { id: 'ssp-u', grapheme: 'u', upperGrapheme: 'U', phoneme: '/ʌ/', speechPhonic: 'uh', exampleWord: 'umbrella', exampleEmoji: '☂️', phase: 'Phase 2', set: 'Set 4', category: 'Single Letters', formationCue: 'Down and under the umbrella, up to top, and down to puddle' },
      { id: 'ssp-r', grapheme: 'r', upperGrapheme: 'R', phoneme: '/r/', speechPhonic: 'rrr', exampleWord: 'robot', exampleEmoji: '🤖', phase: 'Phase 2', set: 'Set 4', category: 'Single Letters', formationCue: 'Down his back and curl over his arm' }
    ]
  },
  {
    id: 'p2-set5',
    phase: 'Phase 2',
    setName: 'Set 5: h, b, f, l',
    description: 'Consolidating simple consonants and double-letter representations (ff, ll, ss).',
    color: 'border-indigo-300 bg-indigo-50/40 text-indigo-800',
    badgeBg: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    sounds: [
      { id: 'ssp-h', grapheme: 'h', upperGrapheme: 'H', phoneme: '/h/', speechPhonic: 'huh', exampleWord: 'hat', exampleEmoji: '🎩', phase: 'Phase 2', set: 'Set 5', category: 'Single Letters', formationCue: 'Down the horse head to hooves and over his back' },
      { id: 'ssp-b', grapheme: 'b', upperGrapheme: 'B', phoneme: '/b/', speechPhonic: 'b', exampleWord: 'ball', exampleEmoji: '⚽', phase: 'Phase 2', set: 'Set 5', category: 'Single Letters', formationCue: 'Down the boot, up and around the toe' },
      { id: 'ssp-f', grapheme: 'f', upperGrapheme: 'F', phoneme: '/f/', speechPhonic: 'fff', exampleWord: 'fish', exampleEmoji: '🐟', phase: 'Phase 2', set: 'Set 5', category: 'Single Letters', formationCue: 'Down the flower stem and draw the leaves' },
      { id: 'ssp-l', grapheme: 'l', upperGrapheme: 'L', phoneme: '/l/', speechPhonic: 'lll', exampleWord: 'lollipop', exampleEmoji: '🍭', phase: 'Phase 2', set: 'Set 5', category: 'Single Letters', formationCue: 'Down the long leg straight to bottom' }
    ]
  },
  {
    id: 'p3-digraphs',
    phase: 'Phase 3',
    setName: 'Phase 3: Consonant Digraphs',
    description: 'Essential two-letter combinations representing unique single phonemes (ch, sh, th, ng).',
    color: 'border-purple-300 bg-purple-50/40 text-purple-800',
    badgeBg: 'bg-purple-100 text-purple-700 border-purple-200',
    sounds: [
      { id: 'ssp-ch', grapheme: 'ch', upperGrapheme: 'CH', phoneme: '/tʃ/', speechPhonic: 'ch', exampleWord: 'chip', exampleEmoji: '🍟', phase: 'Phase 3', set: 'Digraphs', category: 'Consonant Digraphs', formationCue: 'c and h together making the train sound ch-ch-ch' },
      { id: 'ssp-sh', grapheme: 'sh', upperGrapheme: 'SH', phoneme: '/ʃ/', speechPhonic: 'shh', exampleWord: 'ship', exampleEmoji: '🚢', phase: 'Phase 3', set: 'Digraphs', category: 'Consonant Digraphs', formationCue: 's and h together making the quiet shh sound' },
      { id: 'ssp-th', grapheme: 'th', upperGrapheme: 'TH', phoneme: '/θ/', speechPhonic: 'th', exampleWord: 'thumb', exampleEmoji: '👍', phase: 'Phase 3', set: 'Digraphs', category: 'Consonant Digraphs', formationCue: 't and h together: tongue between your teeth' },
      { id: 'ssp-ng', grapheme: 'ng', upperGrapheme: 'NG', phoneme: '/ŋ/', speechPhonic: 'ng', exampleWord: 'ring', exampleEmoji: '💍', phase: 'Phase 3', set: 'Digraphs', category: 'Consonant Digraphs', formationCue: 'n and g together: a strong ring sound' }
    ]
  },
  {
    id: 'p3-vowels',
    phase: 'Phase 3',
    setName: 'Phase 3: Vowel Digraphs',
    description: 'Long vowel sounds made of two vowel letters (ai, ee, igh, oa, oo).',
    color: 'border-cyan-300 bg-cyan-50/40 text-cyan-800',
    badgeBg: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    sounds: [
      { id: 'ssp-ai', grapheme: 'ai', upperGrapheme: 'AI', phoneme: '/eɪ/', speechPhonic: 'ay', exampleWord: 'rain', exampleEmoji: '🌧️', phase: 'Phase 3', set: 'Vowels', category: 'Vowel Digraphs', formationCue: 'a and i making the long A sound in rain' },
      { id: 'ssp-ee', grapheme: 'ee', upperGrapheme: 'EE', phoneme: '/iː/', speechPhonic: 'ee', exampleWord: 'tree', exampleEmoji: '🌳', phase: 'Phase 3', set: 'Vowels', category: 'Vowel Digraphs', formationCue: 'Double e making the smiling ee sound' },
      { id: 'ssp-igh', grapheme: 'igh', upperGrapheme: 'IGH', phoneme: '/aɪ/', speechPhonic: 'eye', exampleWord: 'light', exampleEmoji: '💡', phase: 'Phase 3', set: 'Vowels', category: 'Trigraphs', formationCue: 'Three letters, one bright sound: igh in night' },
      { id: 'ssp-oa', grapheme: 'oa', upperGrapheme: 'OA', phoneme: '/əʊ/', speechPhonic: 'oh', exampleWord: 'boat', exampleEmoji: '⛵', phase: 'Phase 3', set: 'Vowels', category: 'Vowel Digraphs', formationCue: 'o and a making the round oh sound in boat' },
      { id: 'ssp-oo', grapheme: 'oo', upperGrapheme: 'OO', phoneme: '/uː/', speechPhonic: 'oo', exampleWord: 'moon', exampleEmoji: '🌕', phase: 'Phase 3', set: 'Vowels', category: 'Vowel Digraphs', formationCue: 'Two little eyes peeking out: oo in zoom' }
    ]
  }
];

export const AGE_TIERS: Record<string, AgeTierConfig> = {
  'ages2-3': {
    id: 'ages2-3',
    name: 'Ages 2–3',
    subtitle: 'Toddler & Playgroup',
    recommendedGrade: 'Crèche / Playgroup',
    internationalTier: 'EYFS Nursery / Toddler',
    color: 'from-amber-400 to-orange-400',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    borderColor: 'border-amber-400',
    iconEmoji: '🧸',
    objectives: [
      'Phonological awareness: environmental & animal sounds',
      'Early oral sound imitation & vocabulary building',
      '"Guess the Sound" auditory discrimination games',
      'Pre-writing sensory strokes & linear motor tracing',
      'Repeating pure phonetic sounds clearly without schwa'
    ],
    modules: ['coach', 'sounds_toddler', 'objects_toddler', 'tracing_toddler', 'rewards']
  },
  'ages3-4': {
    id: 'ages3-4',
    name: 'Ages 3–4',
    subtitle: 'Nursery 1 & Preschool',
    recommendedGrade: 'Nursery 1',
    internationalTier: 'Pre-K 1 / Preschool',
    color: 'from-pink-400 to-rose-400',
    badgeBg: 'bg-pink-100 text-pink-800 border-pink-300',
    borderColor: 'border-pink-400',
    iconEmoji: '🎨',
    objectives: [
      'Systematic Synthetic Phonics: Phase 2 grapheme-phoneme recognition',
      'Guided stroke-order letter formation & sensory tracing',
      'Auditory alliteration: isolating initial sounds in words',
      'Visual discrimination of confusable letters (b vs d, p vs q)',
      'Continuous oral blending for simple 2-letter VC words (in, at, on)'
    ],
    modules: ['abc', 'phonics', 'tracing_letters', 'letter_match', 'patterns', 'rewards']
  },
  'ages4-5': {
    id: 'ages4-5',
    name: 'Ages 4–5',
    subtitle: 'Nursery 2 & Pre-K',
    recommendedGrade: 'Nursery 2 / Pre-K',
    internationalTier: 'Pre-K 2 / Reception',
    color: 'from-teal-400 to-emerald-400',
    badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
    borderColor: 'border-teal-400',
    iconEmoji: '🚀',
    objectives: [
      'Decodable CVC segmenting & phonemic manipulation',
      'Continuous speed-blending drills (c-a-t -> cat, m-o-p -> mop)',
      'Consonant & vowel digraph mastery (ch, sh, th, ng, ee, oa)',
      'Orthographic sight-word recognition (Phase 2 & 3 high-frequency words)',
      'Phoneme substitution across rhyming families (-at, -ig, -op, -un)',
      'Reading emergent decodable sentences with fluency'
    ],
    modules: ['cvc_builder', 'sight_words', 'rhyme_matcher', 'word_scramble', 'speed_blend', 'rewards']
  },
  'ages5+': {
    id: 'ages5+',
    name: 'Ages 5+',
    subtitle: 'KG2 & Primary 1 / Class 1 (Advanced)',
    recommendedGrade: 'Kindergarten / Class 1',
    internationalTier: 'Year 1 / Grade 1',
    color: 'from-indigo-500 to-purple-600',
    badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    borderColor: 'border-indigo-500',
    iconEmoji: '🎓',
    objectives: [
      'Polysyllabic decodable segmenting & complex phonemic manipulation',
      'Advanced alternative spellings & Phase 5 vowel graphemes',
      'Chronological story sequencing, inference & narrative logic',
      'Context clue sentence completion & syntactic awareness',
      'Descriptive Read & Draw comprehension challenges',
      'Quantitative math mastery: 2-digit operations, arrays & clock reading'
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

export interface IncompleteSentenceItem {
  id: string;
  prompt: string;
  answer: string;
  options: string[];
  category?: string;
  explanation?: string;
  createdBy?: string;
  isTeacherAdded?: boolean;
}

export const INCOMPLETE_SENTENCES: IncompleteSentenceItem[] = [
  {
    id: '1',
    prompt: 'Astronauts float weightlessly in space because there is very little ______.',
    answer: 'gravity',
    options: ['gravity', 'chocolate', 'noise', 'curtains'],
    category: 'Space & Tech',
    explanation: 'Gravity is the invisible force pulling objects together. In deep space, gravity is very weak, causing astronauts to float!'
  },
  {
    id: '2',
    prompt: 'Botanists study green plants to learn how they convert sunlight into ______.',
    answer: 'energy',
    options: ['energy', 'pencils', 'ice cream', 'sand'],
    category: 'Science & Nature',
    explanation: 'Green leaves absorb sunlight and water to produce food energy through photosynthesis.'
  },
  {
    id: '3',
    prompt: 'A magnet attracts objects that are made of ______.',
    answer: 'iron',
    options: ['iron', 'paper', 'wood', 'cotton'],
    category: 'Science & Nature',
    explanation: 'Iron and steel are magnetic metals that get pulled toward a magnet.'
  },
  {
    id: '4',
    prompt: 'Submarines dive deep underwater using strong steel hulls to withstand high ______.',
    answer: 'pressure',
    options: ['pressure', 'sugar', 'feathers', 'sunlight'],
    category: 'Space & Tech',
    explanation: 'As you go deeper into the ocean, the weight of the water above creates intense pressure.'
  },
  {
    id: '5',
    prompt: 'A caterpillar transforms into a beautiful butterfly through the process of ______.',
    answer: 'metamorphosis',
    options: ['metamorphosis', 'evaporation', 'multiplication', 'freezing'],
    category: 'Science & Nature',
    explanation: 'Metamorphosis is the remarkable life process where a caterpillar builds a chrysalis and emerges as a butterfly!'
  },
  {
    id: '6',
    prompt: 'When clouds get too heavy with condensed water droplets, water falls to Earth as ______.',
    answer: 'precipitation',
    options: ['precipitation', 'lightning', 'steam', 'smoke'],
    category: 'Science & Nature',
    explanation: 'Precipitation is any water that falls from clouds to the ground, such as rain, snow, or hail.'
  },
  {
    id: '7',
    prompt: 'The human heart is a strong muscular organ that continually pumps ______ throughout our body.',
    answer: 'blood',
    options: ['blood', 'air', 'juice', 'steam'],
    category: 'Science & Nature',
    explanation: 'The heart beats continuously to circulate oxygenated blood to all cells in your body.'
  },
  {
    id: '8',
    prompt: 'To measure how hot or cold liquid is, scientists use an instrument called a ______.',
    answer: 'thermometer',
    options: ['thermometer', 'microscope', 'telescope', 'calculator'],
    category: 'Science & Nature',
    explanation: 'Thermometers gauge temperature in units of degrees Celsius or Fahrenheit.'
  },
  {
    id: '9',
    prompt: 'The central star at the middle of our solar system that provides light and heat is the ______.',
    answer: 'Sun',
    options: ['Sun', 'Moon', 'Mars', 'Jupiter'],
    category: 'Space & Tech',
    explanation: 'The Sun is a massive star whose gravity holds all planets in orbit around it.'
  },
  {
    id: '10',
    prompt: 'Astronomers peer through a high-powered ______ to observe distant stars and nebulae.',
    answer: 'telescope',
    options: ['telescope', 'microscope', 'magnifier', 'camera'],
    category: 'Space & Tech',
    explanation: 'Telescopes gather light from deep space to magnify far-off planets and stars.'
  },
  {
    id: '11',
    prompt: 'Names of specific people, places, and holidays must always start with a ______ letter.',
    answer: 'capital',
    options: ['capital', 'lowercase', 'tiny', 'vowel'],
    category: 'Grammar & Words',
    explanation: 'Proper nouns like Kofi, Accra, and Independence Day always begin with an uppercase capital letter!'
  },
  {
    id: '12',
    prompt: 'Yesterday afternoon, Sarah ______ her bicycle all around the sunny neighborhood park.',
    answer: 'rode',
    options: ['rode', 'ride', 'riding', 'will ride'],
    category: 'Grammar & Words',
    explanation: 'Since the event happened in the past (yesterday), we use the past tense verb "rode".'
  },
  {
    id: '13',
    prompt: 'Words that share the exact same or very similar meaning, such as "small" and "tiny", are called ______.',
    answer: 'synonyms',
    options: ['synonyms', 'antonyms', 'homophones', 'rhymes'],
    category: 'Grammar & Words',
    explanation: 'Synonyms are words that express equivalent concepts, like happy and joyful.'
  },
  {
    id: '14',
    prompt: 'The direct opposite of a word, such as "hot" compared to "cold", is called an ______.',
    answer: 'antonym',
    options: ['antonym', 'synonym', 'adjective', 'noun'],
    category: 'Grammar & Words',
    explanation: 'Antonyms are word pairs with contrasting meanings, like fast and slow.'
  },
  {
    id: '15',
    prompt: 'To find the total distance around the outer boundary of a rectangular garden, calculate its ______.',
    answer: 'perimeter',
    options: ['perimeter', 'volume', 'height', 'weight'],
    category: 'Math & Logic',
    explanation: 'Perimeter is found by adding up all the lengths of the outer sides of a 2D shape.'
  },
  {
    id: '16',
    prompt: 'If you divide a whole pizza into 4 equal slices and eat 1 slice, you consumed one ______ of the pizza.',
    answer: 'quarter',
    options: ['quarter', 'half', 'third', 'whole'],
    category: 'Math & Logic',
    explanation: 'One equal slice out of four total slices is a quarter or 1/4 fraction.'
  },
  {
    id: '17',
    prompt: 'Living plants and animals interacting with non-living soil and climate form a balanced ______.',
    answer: 'ecosystem',
    options: ['ecosystem', 'scaffold', 'generator', 'pyramid'],
    category: 'Science & Nature',
    explanation: 'An ecosystem is a biological community where living organisms coexist with physical surroundings.'
  },
  {
    id: '18',
    prompt: 'When molten rock breaks through the Earth crust during an eruption, it bursts from a ______.',
    answer: 'volcano',
    options: ['volcano', 'glacier', 'canyon', 'desert'],
    category: 'Science & Nature',
    explanation: 'Volcanoes erupt hot magma (lava), ash, and gases from beneath the Earth crust.'
  },
  {
    id: '19',
    prompt: 'Always telling the truth and taking responsibility for your choices demonstrates strong ______.',
    answer: 'integrity',
    options: ['integrity', 'jealousy', 'carelessness', 'friction'],
    category: 'Logic & Life',
    explanation: 'Integrity means acting honestly and adhering to moral principles even when no one is watching.'
  },
  {
    id: '20',
    prompt: 'When pupils combine their efforts and listen to each other to solve a complex puzzle, they show ______.',
    answer: 'teamwork',
    options: ['teamwork', 'solitude', 'hesitation', 'noise'],
    category: 'Logic & Life',
    explanation: 'Teamwork brings people together to pool ideas, support each other, and achieve a common goal!'
  }
];

export const ADVANCED_VOICE_WORDS_AGE5 = [
  { word: "Exploration", emoji: "🧭", sentence: "The brave team went on an exciting space exploration!", phonetic: "/ˌek.spləˈreɪ.ʃən/" },
  { word: "Glistening", emoji: "✨", sentence: "The morning dew was glistening on the green grass.", phonetic: "/ˈɡlɪs.n̩.ɪŋ/" },
  { word: "Constellation", emoji: "🌌", sentence: "Look up at the night sky to spot the Orion constellation!", phonetic: "/ˌkɒn.stəˈleɪ.ʃən/" },
  { word: "Metamorphosis", emoji: "🦋", sentence: "The caterpillar underwent metamorphosis to become a butterfly.", phonetic: "/ˌmet.əˈmɔː.fə.sɪs/" },
  { word: "Photosynthesis", emoji: "🌿", sentence: "Green leaves use sunlight for photosynthesis.", phonetic: "/ˌfəʊ.təʊˈsɪn.θə.sɪs/" }
];
