
import { ModuleType, DictionaryWord } from './types';

export const COLORS = {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
  softBlue: '#A8DADC',
  softPurple: '#BDB2FF',
  softGreen: '#CAFFBF',
};

export const MODULES: { type: ModuleType; title: string; icon: string; color: string; description: string }[] = [
  {
    type: 'SINGING_DICTIONARY',
    title: 'Singing Dictionary',
    icon: 'fa-spell-check',
    color: 'bg-[#FFADAD]',
    description: 'A-Z words that come to life with pictures and AI-sung nursery rhymes!'
  },
  {
    type: 'PHONICS',
    title: 'Phonics & Sounds',
    icon: 'fa-ear-listen',
    color: 'bg-[#FFADAD]',
    description: 'Jolly Phonics, Blends, Rhymes, and sound matching games!'
  },
  {
    type: 'READING_WRITING',
    title: 'Read & Write',
    icon: 'fa-pen-nib',
    color: 'bg-[#FFC6FF]',
    description: 'Writing, Grammar, Reading, and Storytelling!'
  },
  {
    type: 'NUMERACY',
    title: 'Number World',
    icon: 'fa-arrow-1-9',
    color: 'bg-[#BDB2FF]',
    description: 'Count to 20, money, shapes, and grouping fun!'
  },
  {
    type: 'LIFE_SKILLS',
    title: 'Life Skills',
    icon: 'fa-hand-holding-heart',
    color: 'bg-[#8EECF5]',
    description: 'Feelings, community, and being a superstar kid!'
  },
  {
    type: 'SCIENCE',
    title: 'Science Lab',
    icon: 'fa-flask-vial',
    color: 'bg-[#CAFFBF]',
    description: 'Explore the body, Ghana Clean & Green, and nature!'
  },
  {
    type: 'CREATIVE_ARTS',
    title: 'Creative Arts',
    icon: 'fa-palette',
    color: 'bg-[#FFD1DC]',
    description: 'Painting, Sculpture, Music, Dance, and Magic Movies!'
  },
  {
    type: 'TUTOR',
    title: 'AI Buddy',
    icon: 'fa-robot',
    color: 'bg-[#FFD6A5]',
    description: 'Talk to your very own interactive tutor Mr. Bloom!'
  },
];

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const NUMBERS = '0123456789'.split('');

export const DICTIONARY_WORDS: DictionaryWord[] = [
  { word: 'Apple', category: 'Nature', imagePrompt: 'A shiny red apple with a happy face, nursery style' },
  { word: 'Ball', category: 'General', imagePrompt: 'A colorful bouncy ball with stripes, nursery style' },
  { word: 'Cat', category: 'Animals', imagePrompt: 'A fluffy orange kitten with big eyes, nursery style' },
  { word: 'Dog', category: 'Animals', imagePrompt: 'A friendly brown puppy wagging its tail, nursery style' },
  { word: 'Elephant', category: 'Animals', imagePrompt: 'A cute blue elephant with big ears, nursery style' },
  { word: 'Fish', category: 'Nature', imagePrompt: 'A happy orange goldfish swimming, nursery style' },
  { word: 'Giraffe', category: 'Animals', imagePrompt: 'A tall friendly giraffe with a long neck, nursery style' },
  { word: 'House', category: 'Home', imagePrompt: 'A cozy little house with flowers, nursery style' },
  { word: 'Igloo', category: 'Nature', imagePrompt: 'A white snowy igloo with a penguin nearby, nursery style' },
  { word: 'Jellyfish', category: 'Nature', imagePrompt: 'A glowing purple jellyfish under the sea, nursery style' },
  { word: 'Kite', category: 'General', imagePrompt: 'A colorful diamond kite flying in the sky, nursery style' },
  { word: 'Lion', category: 'Animals', imagePrompt: 'A brave little lion cub with a fluffy mane, nursery style' },
  { word: 'Moon', category: 'Nature', imagePrompt: 'A smiling crescent moon in the night sky, nursery style' },
];

export const VOCABULARY_DATA = DICTIONARY_WORDS;

export const INITIAL_WORDS = [
  { word: 'AT', sentence: 'The cat is AT the mat.', imagePrompt: 'A tiny cartoon cat sitting on a colorful mat, nursery style' },
  { word: 'CAT', sentence: 'The CAT is fat.', imagePrompt: 'A fluffy fat cartoon kitten, orange fur, nursery style' },
  { word: 'DOG', sentence: 'The DOG says woof!', imagePrompt: 'A friendly brown cartoon dog wagging its tail, nursery style' },
  { word: 'SUN', sentence: 'The SUN is hot.', imagePrompt: 'A smiling yellow sun with bright rays, nursery style' },
];

export const DICTION_DATA = [
  { word: 'APPLE', syllables: 'AP-PLE', instruction: 'Open your mouth wide like a lion for the "AP"!', prompt: 'A big red apple, nursery style' },
  { word: 'BANANA', syllables: 'BA-NA-NA', instruction: 'Three happy bounces! BA... NA... NA!', prompt: 'A happy yellow banana, nursery style' },
];

export const JOLLY_PHONICS_DATA = [
  { letter: 'S', sound: 'sss', action: 'Weave your hand like a snake and say sss.', story: 'Sammy the Snake lives in the sun. He slides through the grass and says sss!', imagePrompt: 'A friendly cartoon snake in a sunny garden, bright colors, nursery style' },
  { letter: 'A', sound: 'a-a-a', action: 'Wiggle your fingers on your arm like ants and say a-a-a.', story: 'Annie the Ant found a big red apple. She invited her friends for a snack!', imagePrompt: 'A happy ant carrying a huge shiny red apple, nursery style' },
];

export const PICTURE_READING_DATA = [
  { sound: 'S', target: 'Snake', options: [{ name: 'Snake', prompt: 'A friendly cartoon snake' }, { name: 'Apple', prompt: 'A red apple' }, { name: 'Ball', prompt: 'A bouncy ball' }], correctIdx: 0 },
];

export const SYLLABLES_DATA = [
  { word: 'APPLE', syllables: ['AP', 'PLE'], prompt: 'A shiny red apple, nursery style' },
  { word: 'BANANA', syllables: ['BA', 'NA', 'NA'], prompt: 'A happy yellow banana, nursery style' },
];

export const ALLITERATION_DATA = [
  { sound: 'B', target: 'Bear', options: [{ word: 'Balloon', match: true }, { word: 'Cat', match: false }], prompt: 'A friendly brown bear, nursery style' },
];

export const SOUND_MATCHING_DATA = [
  { sound: 'M', items: [{ word: 'Moon', prompt: 'A glowing crescent moon' }, { word: 'Mouse', prompt: 'A tiny grey mouse' }, { word: 'Fish', prompt: 'A goldfish' }] },
];

export const PHONICS_DATA = [
  { upper: 'S', lower: 's', word: 'Snake', imagePrompt: 'A friendly cartoon snake sliding in the grass, bright colors, nursery style, white background' },
  { upper: 'A', lower: 'a', word: 'Apple', imagePrompt: 'A shiny red cartoon apple with a happy face, nursery style, white background' },
];

export const BLENDS_DATA = [
  { blend: 'sh', type: 'digraph', words: [{ word: 'Ship', prompt: 'A blue cartoon ship on water, nursery style' }, { word: 'Shell', prompt: 'A pink sea shell on sand, nursery style' }] },
];

export const RHYMES_DATA = [
  { ending: 'ug', words: [{ word: 'Bug', prompt: 'A tiny ladybug on a leaf, nursery style' }, { word: 'Hug', prompt: 'A bear hugging a cub, nursery style' }, { word: 'Mug', prompt: 'A hot cocoa mug, nursery style' }] },
];

export const SIGHT_WORDS_DATA = [
  { word: 'he', type: 'tricky', prompt: 'A boy pointing to himself, high contrast text "he", nursery style' },
  { word: 'me', type: 'tricky', prompt: 'A happy girl pointing to her chest, high contrast text "me", nursery style' },
];

export const ENVIRONMENTAL_PRINT_DATA = [
  { text: 'EXIT', context: 'Door', prompt: 'A bright green EXIT sign above a door in a friendly nursery school hallway' },
];

export const BOOK_HANDLING_DATA = [
  { title: 'How to Hold a Book', pages: [{ text: 'This is the FRONT of the book.', prompt: 'A close up of a colorful nursery book cover with a happy sun' }, { text: 'We turn the page from RIGHT to LEFT.', prompt: 'A hand flipping a page in a colorful picture book' }] }
];

export const MISSING_LETTERS_DATA = [
  { word: 'CAT', missing: 'A', options: ['A', 'E', 'I'], prompt: 'A cute orange cat, nursery style' },
];

export const STORYTELLING_DATA = [
  { 
    title: 'The Boy and His Cat', 
    prompt: 'A boy pouring milk for his cat',
    sequence: [
      { id: 1, text: 'A small boy sees his thirsty cat.', prompt: 'A 3D nursery scene of a boy looking at his orange cat.' }, 
      { id: 2, text: 'He is pouring milk into a small blue bowl.', prompt: 'A boy pouring fresh white milk into a small blue bowl.' }, 
      { id: 3, text: 'The boy and cat are happy.', prompt: 'A happy cat drinking milk and the boy patting its back.' }
    ] 
  }
];

export const THEME_VOCAB_DATA = {
  seasons: [
    { name: 'Summer', prompt: 'A sunny beach scene, nursery style', words: ['Sun', 'Sand', 'Hot'] }, 
  ],
  family: [
    { name: 'My Family', prompt: 'A diverse friendly family group smiling, nursery style', words: ['Mom', 'Dad', 'Baby', 'Love'] }
  ]
};

export const READING_DATA = [
  { title: 'The Blue Whale', text: 'A big whale is in the sea. It is blue and very happy. The whale loves to swim and play with fish.', imagePrompt: 'A big happy blue whale swimming in the ocean with small fish, colorful nursery style animation art', activities: [{ question: 'WHAT color is the whale?', options: ['Blue', 'Red', 'Green'], correct: 0 }, { question: 'WHERE is the whale?', options: ['Forest', 'Sea', 'Moon'], correct: 1 }] }
];

export const GRAMMAR_DATA = {
  plurals: [{ singular: 'Apple', plural: 'Apples', prompt: 'A single red apple next to a pointer of red apples, nursery style' }],
  articles: [{ word: 'Apple', article: 'an', prompt: 'A shiny red apple, nursery style' }],
  nouns: [{ word: 'Boy', type: 'Person', prompt: 'A happy little boy smiling, nursery style' }],
  verbs: [{ word: 'Run', action: 'Running fast', prompt: 'A cartoon child running in a park, motion lines, nursery style' }],
  adjectives: [{ word: 'Big', prompt: 'A very big grey elephant, nursery style' }],
  pronouns: [{ word: 'He', prompt: 'A happy boy pointing at himself, nursery style' }],
  adverbs: [{ word: 'Quickly', prompt: 'A cheetah running very fast with wind lines, nursery style' }],
  prepositions: [{ word: 'Under', prompt: 'A tiny cat hiding under a wooden chair, nursery style' }],
  conjunctions: [{ word: 'And', prompt: 'An apple and a banana sitting together on a plate, nursery style' }],
  interjections: [{ word: 'Wow!', prompt: 'A child looking at magical glowing sparkles with big eyes, nursery style' }],
};

export const OPPOSITES_DATA = [
  { word: 'Happy', opposite: 'Sad', imagePrompt: 'A split screen: left side a smiling cartoon child, right side a sad cartoon child, nursery style' },
];

export const SENTENCE_DATA = [
  { text: 'I see a red cat.', imagePrompt: 'A cute red cartoon kitten sitting on a floor, nursery style', pattern: 'I see a...' },
];

export const HIDDEN_WORDS_DATA = [
  { target: 'CAT', options: ['CAT', 'BAT', 'CAR', 'CAN'], imagePrompt: 'A group of nursery items, a cat, a bat, a car, and a can, bright colors' },
];

export const NUMERACY_DATA = {
  numbers: [
    { value: 1, word: 'One', prompt: 'one friendly lion' },
    { value: 2, word: 'Two', prompt: 'two happy monkeys' },
  ],
  shapes: [
    { name: 'Circle', type: '2D', prompt: 'A round red circle' },
    { name: 'Square', type: '2D', prompt: 'A blue square with four equal sides' },
  ],
  comparisons: [
    { 
      q: "Which is BIG?", 
      category: 'Size', 
      options: [
        { size: 'lg', label: 'Big Bear', prompt: 'A very large friendly brown bear' }, 
        { size: 'sm', label: 'Small Bear', prompt: 'A tiny cute brown bear cub' }
      ], 
      correct: 0 
    }
  ],
  patterns: [
    { sequence: ['apple-whole', 'carrot', 'apple-whole'], next: 'carrot', options: ['apple-whole', 'carrot'] },
  ],
  oneToOne: [
    { count: 3, name: 'Rabbit', itemName: 'Carrot', character: 'fa-rabbit', item: 'fa-carrot' },
  ]
};

export const ADDITION_DATA = [
  { val1: 2, val2: 3, icon: 'fa-apple-whole', theme: 'Apples', prompt: 'Two apples and three apples on a table, nursery style' },
];

export const SUBTRACTION_DATA = [
  { val1: 5, val2: 2, icon: 'fa-cookie', theme: 'Cookies', prompt: 'Five cookies with two eaten, nursery style' },
];

export const NUMBER_WORDS_DATA = [
  { digit: 1, word: 'ONE', prompt: 'The number one made of colorful blocks' },
];

export const TIME_DATA = [
  { hour: 3, minute: 0, phrase: 'Three o\'clock', prompt: 'A round clock showing 3:00, nursery style' },
];

export const MEASUREMENT_DATA = {
  weight: [
    { q: 'Which is HEAVIER?', correct: 0, items: [{ label: 'Elephant', prompt: 'A big blue elephant' }, { label: 'Feather', prompt: 'A light pink feather' }] }
  ],
  height: [
    { q: 'Which is TALLER?', correct: 0, items: [{ label: 'Giraffe', prompt: 'A tall friendly giraffe' }, { label: 'Mouse', prompt: 'A tiny grey mouse' }] }
  ]
};

export const TENS_UNITS_DATA = [
  { number: 12, tens: 1, units: 2, prompt: 'One bundle of ten sticks and two single sticks, nursery style' },
];

export const GROUPING_DATA = [
  { groupSize: 2, totalItems: 6, theme: 'Birds', prompt: 'Six birds grouped into pairs of two, nursery style' },
];

export const SEQUENCE_DATA = [
  { type: 'after', question: 'What comes after 2?', sequence: [1, 2, null], answer: 3, options: [3, 4, 5] },
];

export const NUM_COMPARISON_DATA = [
  { q: 'Which is GREATER?', val1: 5, val2: 3, answer: 5, type: 'greater' },
];

export const COUNTING_TASK_DATA = [
  { count: 4, icon: 'fa-star', theme: 'Stars', prompt: 'Four bright yellow stars in a blue sky, nursery style' },
];

export const NUMBER_BONDS_DATA = [
  { target: 10, part1: 7, part2: 3, theme: 'Balloons', prompt: 'Seven red balloons and three blue balloons, nursery style' },
];

export const SPATIAL_DATA = [
  { target: 'Ball', position: 'above', refObject: 'Box', prompt: 'A red ball hovering above a colorful toy box, nursery style' },
];

export const MONEY_DATA = [
  { amount: 5, coins: 5, label: 'Gold Coins', prompt: 'Five shiny gold coins on a table, nursery style' },
];

export const SCIENCE_DATA = {
  bodyParts: [
    { name: 'Eyes', icon: 'fa-eye', action: 'I use my eyes to see the world!' },
    { name: 'Ears', icon: 'fa-ear-listen', action: 'I use my ears to hear sounds!' },
  ],
  innerOrgans: [
    { name: 'Heart', icon: 'fa-heart-pulse', action: 'My heart pumps blood to my whole body!', prompt: 'A red cartoon heart beating' },
  ],
  growth: [
    { stage: 'Baby', action: 'I was a tiny baby who could crawl!' },
    { stage: 'Toddler', action: 'I became a toddler and learned to walk!' },
    { stage: 'Child', action: 'Now I am a child who can run and jump!' }
  ],
  senses: [
    { sense: 'Sight', icon: 'fa-eye', action: 'I see a beautiful rainbow!', prompt: 'A child looking at a bright rainbow' },
  ],
  diet: [
    { name: 'Apple', group: 'Healthy', type: 'Fruit', prompt: 'A shiny red apple, nursery style' },
  ],
  water: [
    { source: 'Rain', use: 'Watering plants', icon: 'fa-cloud-showers-heavy' },
  ],
  floatSink: [
    { name: 'Rubber Duck', result: 'Float', reason: 'It is light and filled with air!' },
  ],
  livingNeeds: [
    { name: 'Plant', need: 'Sunlight', instruction: 'Put plants near the window to see the sun!' },
  ],
  living: [
    { name: 'Tree' },
    { name: 'Butterfly' },
  ],
  nonLiving: [
    { name: 'Car' },
    { name: 'Ball' },
  ],
  weather: [
    { type: 'Sunny' },
    { type: 'Rainy' },
  ],
  animals: [
    { name: 'Lion', sound: 'ROAR', fact: 'Lions have big fluffy manes!', prompt: 'A brave lion with a big golden mane' },
  ],
  transport: [
    { name: 'Aeroplane', icon: 'fa-plane', type: 'Air' },
    { name: 'Car', icon: 'fa-car', type: 'Road' },
  ],
  properties: {
    colors: [
      { name: 'Red', prompt: 'A big red apple', explanation: 'Red is the color of apples and hearts!' },
    ],
    shapes: [
      { name: 'Circle', prompt: 'A round yellow sun', explanation: 'A circle is perfectly round like a ball!', type: '2D' }
    ],
    sizes: [
      { pair: 'Big and Small', items: [{ prompt: 'A giant elephant', label: 'Big' }, { prompt: 'A tiny mouse', label: 'Small' }], explanation: 'The elephant is big and the mouse is small!' }
    ]
  },
  skills: {
    observation: [
      { name: 'Ladybird', task: 'Counting spots' }
    ],
    curiosity: [
      { q: 'Why is the grass green?', a: 'Grass is green because it has magic called chlorophyll!' }
    ],
    care: [
      { task: 'Feeding pets' }
    ]
  },
  environment: {
    surroundings: [
        { name: 'My Home', icon: 'fa-house', prompt: 'A cozy colorful cottage with a garden and a white fence, nursery style', fact: 'My home is where I sleep and eat with my family.' },
        { name: 'My School', icon: 'fa-school', prompt: 'A bright school building with a playground and slides, nursery style', fact: 'My school is where I play and learn with my friends!' },
    ],
    greenHabits: [
        { name: 'Recycling', icon: 'fa-recycle', prompt: 'A friendly blue recycling bin with happy paper and bottles, nursery style', fact: 'We recycle to keep our Earth clean and happy!' },
    ],
    cleanWorld: [
        { name: 'Clear Gutters', icon: 'fa-water', prompt: 'A clean paved gutter with clear blue water flowing freely, no trash inside, nursery style', fact: 'Gutters are for rain water! Never throw trash in the gutter so the water can flow away.' },
        { name: 'Gutter Hero', icon: 'fa-broom', prompt: 'A group of children and adults cleaning a gutter, removing plastic bottles, nursery style', fact: 'We are Gutter Heroes! We keep our drains clear so the rain does not flood our homes.' },
        { name: 'Ghana Clean & Green', icon: 'fa-flag', prompt: 'A beautiful clean Ghanaian street with green trees and the national flag waving, nursery style', fact: 'Let us keep Ghana clean and green! A clean Ghana is a healthy Ghana.' }
    ]
  }
};

export const ARTS_DATA = {
  drawingPrompts: [
    { title: 'A Happy Sun', prompt: 'A simple bold sun for a child to draw', difficulty: 'Easy' },
  ],
  colorNature: [
    { name: 'Red Rose', color: 'Red', prompt: 'A bright red rose in a garden' },
  ],
  shapeChallenges: [
    { name: 'Round Wheel', parts: ['Circle'], description: 'Draw a big circle for a wheel!' }
  ],
  visual: {
    sculptures: [
      { name: 'Red Apple Clay', prompt: 'A high-quality 3D clay sculpture of a shiny red apple, ceramic style', fact: 'Sculptures are art you can touch!' },
    ],
    paintings: [
      { name: 'Magic Rainbow', prompt: 'A vibrant child-like oil painting of a rainbow over a green field', type: 'Oil Painting' },
    ]
  },
  performing: {
    instruments: [
      { name: 'Magic Guitar', icon: 'fa-guitar', soundPrompt: 'Say: STRUM STRUM STRUM!' },
    ],
    dancePrompts: [
      { character: 'Happy Robot', style: 'Disco', prompt: '3D animation of a friendly robot doing disco moves, nursery style' },
    ]
  },
  drama: {
    prompts: [
      { situation: 'You are a tiny mouse eating cheese!', action: 'Squeak and nibble!' },
    ]
  },
  literature: {
    poets: [
      { topic: 'Little Star', rhyme: 'Twinkle twinkle little star, \nhow I wonder what you are! \nUp above the world so high, \nlike a diamond in the sky.' }
    ]
  }
};

export const CREATIVE_ARTS_DATA = ARTS_DATA;

export const LIFE_SKILLS_DATA = {
  health: [
    { title: 'Brushing Teeth', action: 'Brush up and down, twice a day!', icon: 'fa-tooth', prompt: 'A child happily brushing their teeth, with sparkles on their teeth' },
    { title: 'Being Healthy', action: 'Eat healthy food and play every day to feel full of energy!', icon: 'fa-heart-pulse', prompt: 'A group of children playing outside with a colorful salad on a nearby picnic blanket' }
  ],
  music: [
    { title: 'Brushing Teeth Song', theme: 'brushing teeth every morning', icon: 'fa-tooth' },
  ],
  practicalLife: {
    pretendPlay: [
      { title: 'The Chef', scenario: 'Pretend to cook a yummy soup!', modeling: 'Stir the pot carefully so it does not spill.', action: 'Stir Soup', prompt: 'A child wearing a chef hat stirring a big pot, nursery style' },
    ],
    dressing: [
      { item: 'Coat', need: 'it is cold outside', icon: 'fa-vest', prompt: 'A child putting on a warm winter coat, nursery style', clothing: 'winter coat' },
    ],
    schedules: [
      { name: 'Morning Routine', sequence: ['Wake up', 'Eat breakfast', 'Go to school'], icons: ['fa-sun', 'fa-utensils', 'fa-school'], prompt: 'A simple morning routine sequence illustration' }
    ]
  },
  emotions: [
    { name: 'Happy', color: 'bg-yellow-400', icon: 'fa-face-smile', prompt: 'A very happy smiling child face, nursery style', technique: 'Smile big and show your teeth!' },
  ],
  communication: {
    pictureTalk: [
      { title: 'In the Park', prompt: 'A busy park with kids playing, a dog, and a slide, nursery style', description: 'I see kids playing on the slide and a brown dog!' }
    ],
    instructions: [
      { task: 'Touch your nose', icon: 'fa-hand-pointer', spoken: 'Can you touch your nose with one finger?' }
    ],
    circleTime: [
      { q: 'What is your favorite color?', icon: 'fa-palette', followUp: 'Tell us why you like it!' }
    ]
  },
  social: [
    { scenario: 'Sharing Toys', q: 'Your friend wants the ball. What do you do?', options: ['Give it to them', 'Keep it', 'Hide it'], correct: 0, prompt: 'Two kids looking at a colorful ball, nursery style' },
  ],
  community: [
    { role: 'The Teacher', icon: 'fa-chalkboard-user', fact: 'Teachers help us learn new things and be kind to others.', prompt: 'A kind teacher reading a story to a group of happy children' },
  ],
  cognitive: {
    scenarios: [
      { q: 'The floor is messy with toys. How do we fix it?', options: ['fa-broom', 'fa-tv', 'fa-bed'], labels: ['Tidy Up', 'Watch TV', 'Go to Bed'], correct: 0, prompt: 'A room with many toys on the floor, nursery style' }
    ],
    patterns: [
      { sequence: ['fa-apple-whole', 'fa-carrot', 'fa-apple-whole'], next: 'fa-carrot', options: ['fa-apple-whole', 'fa-carrot'], prompt: 'A simple pattern of fruit and vegetables' }
    ],
    whatIf: [
      { q: 'What if we could fly like birds?', a: 'We would see the whole world from high in the sky!', prompt: 'A child with bird wings flying over a colorful town' }
    ]
  },
  tidying: [
    { title: 'Blocks', icon: 'fa-cube', prompt: 'Colorful toy blocks scattered on a rug' }
  ]
};
