
import { ModuleType } from './types';

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
    type: 'LITERACY',
    title: 'Literacy Hub',
    icon: 'fa-book-open-reader',
    color: 'bg-[#FFADAD]',
    description: 'Alphabet, Words, Grammar, and Story adventures!'
  },
  {
    type: 'NUMERACY',
    title: 'Number World',
    icon: 'fa-arrow-1-9',
    color: 'bg-[#BDB2FF]',
    description: 'Count to 20, tens & units, time, and grouping fun!'
  },
  {
    type: 'SCIENCE',
    title: 'Science Lab',
    icon: 'fa-flask-vial',
    color: 'bg-[#CAFFBF]',
    description: 'Explore the body, healthy eating, and discovery!'
  },
  {
    type: 'ARTS',
    title: 'Arts Hub',
    icon: 'fa-palette',
    color: 'bg-[#FFD1DC]',
    description: 'Creative drawing, colors, shapes, and textures!'
  },
  {
    type: 'TUTOR',
    title: 'AI Buddy',
    icon: 'fa-robot',
    color: 'bg-[#FFD6A5]',
    description: 'Talk to your very own interactive tutor!'
  },
];

export const SEQUENCE_DATA = [
  { type: 'after', question: 'What comes AFTER 5?', sequence: [5, null], answer: 6, options: [4, 6, 7] },
  { type: 'before', question: 'What comes BEFORE 10?', sequence: [null, 10], answer: 9, options: [8, 9, 11] },
  { type: 'between', question: 'What is BETWEEN 12 and 14?', sequence: [12, null, 14], answer: 13, options: [11, 13, 15] },
];

export const NUM_COMPARISON_DATA = [
  { q: 'Which number is GREATER?', val1: 8, val2: 3, answer: 8, type: 'greater' },
  { q: 'Which number is LESS?', val1: 5, val2: 9, answer: 5, type: 'less' },
  { q: 'Are these EQUAL?', val1: 4, val2: 4, answer: 'yes', type: 'equal' },
];

export const COUNTING_TASK_DATA = [
  { count: 6, icon: 'fa-cat', theme: 'Kittens', prompt: 'Six cute orange kittens playing together, nursery style' },
  { count: 4, icon: 'fa-bus', theme: 'Buses', prompt: 'Four yellow school buses parked in a row, nursery style' },
];

export const NUMBER_BONDS_DATA = [
  { target: 10, part1: 7, part2: 3, theme: 'Apples', prompt: 'A basket with 10 slots, 7 slots filled with red apples and 3 empty slots, nursery style' },
  { target: 10, part1: 5, part2: 5, theme: 'Stars', prompt: 'A split screen showing 5 gold stars on one side and 5 empty star outlines on the other, nursery style' },
  { target: 5, part1: 2, part2: 3, theme: 'Cars', prompt: 'A toy garage for 5 cars, with 2 cars parked inside, nursery style' }
];

export const SPATIAL_DATA = [
  { target: 'cat', position: 'above', refObject: 'box', prompt: 'A cute cartoon cat sitting ABOVE a big brown cardboard box, nursery style, bright colors' },
  { target: 'ball', position: 'below', refObject: 'table', prompt: 'A colorful bouncy ball sitting BELOW a small wooden nursery table, bright colors' },
  { target: 'dog', position: 'beside', refObject: 'car', prompt: 'A friendly puppy sitting BESIDE a red toy car, nursery style' }
];

export const MONEY_DATA = [
  { amount: 3, coins: 3, label: '3 Coins', prompt: 'Three shiny gold coins in a row, nursery style' },
  { amount: 5, coins: 5, label: '5 Coins', prompt: 'Five silver coins in a little pile, nursery style' },
  { amount: 1, coins: 1, label: '1 Coin', prompt: 'One big golden coin in the center, nursery style' }
];

export const PHONICS_DATA = [
  { upper: 'A', lower: 'a', word: 'Apple', imagePrompt: 'A shiny red cartoon apple with a happy face, nursery style, white background' },
  { upper: 'B', lower: 'b', word: 'Ball', imagePrompt: 'A colorful bouncy ball with stripes, cartoon style, nursery style, white background' },
  { upper: 'C', lower: 'c', word: 'Cat', imagePrompt: 'A fluffy orange cartoon kitten sitting, nursery style, white background' },
  { upper: 'D', lower: 'd', word: 'Dog', imagePrompt: 'A friendly spotted cartoon puppy, nursery style, white background' },
  { upper: 'E', lower: 'e', word: 'Elephant', imagePrompt: 'A cute blue cartoon elephant with big ears, nursery style, white background' },
  { upper: 'F', lower: 'f', word: 'Fish', imagePrompt: 'A happy orange goldfish swimming, cartoon style, nursery style, white background' },
  { upper: 'G', lower: 'g', word: 'Goat', imagePrompt: 'A funny little white cartoon goat, nursery style, white background' },
  { upper: 'H', lower: 'h', word: 'Hat', imagePrompt: 'A bright yellow sun hat with a ribbon, cartoon style, nursery style, white background' },
  { upper: 'I', lower: 'i', word: 'Igloo', imagePrompt: 'A cozy white cartoon igloo in the snow, soft lighting, nursery style, white background' },
  { upper: 'J', lower: 'j', word: 'Jam', imagePrompt: 'A glass jar of red strawberry jam, cartoon style, nursery style, white background' },
  { upper: 'K', lower: 'k', word: 'Kite', imagePrompt: 'A colorful diamond kite flying in the air, nursery style, white background' },
  { upper: 'L', lower: 'l', word: 'Lion', imagePrompt: 'A brave little cartoon lion with a big mane, nursery style, white background' },
  { upper: 'M', lower: 'm', word: 'Monkey', imagePrompt: 'A playful brown cartoon monkey, nursery style, white background' },
  { upper: 'N', lower: 'n', word: 'Nest', imagePrompt: 'A bird nest with three small blue eggs, cartoon style, nursery style, white background' },
  { upper: 'O', lower: 'o', word: 'Octopus', imagePrompt: 'A purple cartoon octopus with a smile, nursery style, white background' },
  { upper: 'P', lower: 'p', word: 'Panda', imagePrompt: 'A happy cartoon panda eating bamboo, nursery style, white background' },
  { upper: 'Q', lower: 'q', word: 'Queen', imagePrompt: 'A friendly cartoon queen with a gold crown, nursery style, white background' },
  { upper: 'R', lower: 'r', word: 'Rabbit', imagePrompt: 'A fluffy white cartoon rabbit with long ears, nursery style, white background' },
  { upper: 'S', lower: 's', word: 'Snake', imagePrompt: 'A friendly cartoon snake sliding in the grass, bright colors, nursery style, white background' },
  { upper: 'T', lower: 't', word: 'Tiger', imagePrompt: 'A cute smiling cartoon tiger cub, bright colors, nursery style, white background' },
  { upper: 'U', lower: 'u', word: 'Umbrella', imagePrompt: 'A colorful polka-dot umbrella, cartoon style, nursery style, white background' },
  { upper: 'V', lower: 'v', word: 'Van', imagePrompt: 'A bright red cartoon delivery van, nursery style, white background' },
  { upper: 'W', lower: 'w', word: 'Whale', imagePrompt: 'A big blue happy cartoon whale spouting water, nursery style, white background' },
  { upper: 'X', lower: 'x', word: 'Xylophone', imagePrompt: 'A colorful wooden xylophone with mallets, nursery style, white background' },
  { upper: 'Y', lower: 'y', word: 'Yo-yo', imagePrompt: 'A spinning red yo-yo, cartoon style, nursery style, white background' },
  { upper: 'Z', lower: 'z', word: 'Zebra', imagePrompt: 'A happy striped cartoon zebra, nursery style, white background' },
];

export const BLENDS_DATA = [
  { blend: 'sh', type: 'digraph', words: [{ word: 'Ship', prompt: 'A blue cartoon ship on water, nursery style' }, { word: 'Shell', prompt: 'A pink sea shell on sand, nursery style' }] },
  { blend: 'ch', type: 'digraph', words: [{ word: 'Chair', prompt: 'A small red wooden chair, nursery style' }, { word: 'Cherry', prompt: 'Two red cherries with a green stem, nursery style' }] },
  { blend: 'sl', type: 'blend-l', words: [{ word: 'Slip', prompt: 'A cartoon child slipping on a banana peel, funny, nursery style' }, { word: 'Sleep', prompt: 'A cute puppy sleeping on a pillow, nursery style' }] },
  { blend: 'fl', type: 'blend-l', words: [{ word: 'Flag', prompt: 'A bright colorful flag waving, nursery style' }, { word: 'Flower', prompt: 'A pretty yellow flower, nursery style' }] },
  { blend: 'tr', type: 'blend-r', words: [{ word: 'Tree', prompt: 'A big green tree with red apples, nursery style' }, { word: 'Train', prompt: 'A colorful toy train on tracks, nursery style' }] },
  { blend: 'st', type: 'blend-s', words: [{ word: 'Star', prompt: 'A smiling yellow star in the sky, nursery style' }, { word: 'Stop', prompt: 'A red octagon stop sign, cartoon style' }] },
];

export const RHYMES_DATA = [
  { ending: 'ug', words: [{ word: 'Bug', prompt: 'A tiny ladybug on a leaf, nursery style' }, { word: 'Hug', prompt: 'A bear hugging a cub, nursery style' }, { word: 'Mug', prompt: 'A hot cocoa mug, nursery style' }] },
  { ending: 'og', words: [{ word: 'Dog', prompt: 'A happy spotted dog, nursery style' }, { word: 'Frog', prompt: 'A green frog on a log, nursery style' }, { word: 'Log', prompt: 'A brown wooden log, nursery style' }] },
  { ending: 'en', words: [{ word: 'Hen', prompt: 'A brown hen with eggs, nursery style' }, { word: 'Pen', prompt: 'A bright blue pen, nursery style' }, { word: 'Ten', prompt: 'The number 10 in bubbles, nursery style' }] },
];

export const INITIAL_WORDS = [
  { word: 'at', sentence: 'The cat is at the mat.', imagePrompt: 'A tiny cartoon cat sitting on a colorful mat, nursery style' },
  { word: 'it', sentence: 'It is a ball.', imagePrompt: 'A single colorful bouncy ball in the center, nursery style' },
  { word: 'go', sentence: 'Go, go, go!', imagePrompt: 'A bright red toy car moving fast, cartoon speed lines, nursery style' },
  { word: 'cat', sentence: 'The cat is fat.', imagePrompt: 'A fluffy fat cartoon kitten, orange fur, nursery style' },
  { word: 'sun', sentence: 'The sun is hot.', imagePrompt: 'A bright smiling yellow sun with rays, nursery style' },
  { word: 'bus', sentence: 'The bus is yellow.', imagePrompt: 'A big yellow school bus, cartoon style, nursery style' },
  { word: 'frog', sentence: 'The frog can hop.', imagePrompt: 'A friendly green cartoon frog jumping, nursery style' },
  { word: 'star', sentence: 'The star is bright.', imagePrompt: 'A shiny gold cartoon star in the sky, nursery style' },
];

export const MISSING_LETTERS_DATA = [
  { word: 'CAT', missing: 'A', options: ['A', 'E', 'I'], prompt: 'A cute orange cat, nursery style' },
  { word: 'SUN', missing: 'U', options: ['A', 'U', 'O'], prompt: 'A bright yellow sun, nursery style' },
  { word: 'DOG', missing: 'O', options: ['E', 'I', 'O'], prompt: 'A friendly spotted dog, nursery style' },
  { word: 'PEN', missing: 'E', options: ['A', 'E', 'U'], prompt: 'A bright blue pen, nursery style' },
];

export const SENTENCE_DATA = [
  { text: "The cat sat.", pattern: 'CVC', imagePrompt: 'A cat sitting on a mat, nursery style' },
  { text: "A big red bug.", pattern: 'CVC', imagePrompt: 'A large red ladybug on a leaf, nursery style' },
  { text: "I can run.", pattern: 'CVC', imagePrompt: 'A child happily running in a field, nursery style' }
];

export const STORYTELLING_DATA = [
  {
    title: 'A Day at the Park',
    prompt: 'A busy cartoon park scene with kids sliding, a dog running after a ball, and a sunny sky, nursery style',
    questions: [
      'What is the dog doing?',
      'Who is on the slide?',
      'Can you see the sun?'
    ]
  },
  {
    title: 'The Busy Kitchen',
    prompt: 'A cozy cartoon kitchen where a cat is sleeping on a rug and a cake is on the table, nursery style',
    questions: [
      'Where is the cat sleeping?',
      'What is on the table?',
      'Is the kitten happy?'
    ]
  }
];

export const THEME_VOCAB_DATA = {
  seasons: [
    { name: 'Summer', prompt: 'A sunny beach scene with a bright sun and sandcastle, nursery style', words: ['Sun', 'Sand', 'Hot'] },
    { name: 'Autumn', prompt: 'Orange and red leaves falling from a tree in a park, nursery style', words: ['Leaf', 'Orange', 'Wind'] },
    { name: 'Winter', prompt: 'A snowy scene with a snowman and white clouds, nursery style', words: ['Snow', 'Cold', 'Ice'] },
    { name: 'Spring', prompt: 'Bright flowers blooming and a small butterfly, nursery style', words: ['Flower', 'Grow', 'Rain'] }
  ]
};

export const READING_DATA = [
  { 
    title: 'The Blue Whale', 
    text: 'A big whale is in the sea. It is blue and very happy. The whale loves to swim and play with fish.', 
    imagePrompt: 'A big happy blue whale swimming in the ocean with small fish, colorful nursery style animation art',
    activities: [
      { question: 'What color is the whale?', options: ['Blue', 'Red', 'Green'], correct: 0 },
      { question: 'Where is the whale?', options: ['Forest', 'Sea', 'Moon'], correct: 1 }
    ]
  },
  { 
    title: 'Little Red Car', 
    text: 'Look at the red car! It goes fast. Vroom vroom! The car has four black wheels.', 
    imagePrompt: 'A bright red toy car driving on a green hill, big wheels, smiling face, nursery style',
    activities: [
      { question: 'What color is the car?', options: ['Yellow', 'Red', 'Pink'], correct: 1 },
      { question: 'How many wheels?', options: ['Two', 'Four', 'Ten'], correct: 1 }
    ]
  }
];

export const GRAMMAR_DATA = {
  plurals: [
    { singular: 'Apple', plural: 'Apples', prompt: 'A single red apple next to a pile of red apples, nursery style' },
    { singular: 'Bird', plural: 'Birds', prompt: 'One blue bird on a branch next to three blue birds, nursery style' },
    { singular: 'Cup', plural: 'Cups', prompt: 'One small cup next to many colorful cups, nursery style' },
  ],
  articles: [
    { word: 'Apple', article: 'an', prompt: 'A shiny red apple, nursery style' },
    { word: 'Ball', article: 'a', prompt: 'A colorful bouncy ball, nursery style' }
  ],
  nouns: [
    { word: 'Boy', type: 'Person', prompt: 'A happy little boy smiling, nursery style' },
    { word: 'School', type: 'Place', prompt: 'A colorful nursery school building, nursery style' },
    { word: 'Lion', type: 'Animal', prompt: 'A brave cartoon lion, nursery style' }
  ],
  verbs: [
    { word: 'Run', action: 'Running fast', prompt: 'A cartoon child running in a park, motion lines, nursery style' },
    { word: 'Jump', action: 'Jumping high', prompt: 'A happy child jumping in the air, nursery style' },
    { word: 'Sleep', action: 'Sleeping ZZZ', prompt: 'A cute cartoon child sleeping in a cozy bed, nursery style' }
  ],
  pronouns: [
    { subject: 'He', example: 'He is a boy.', prompt: 'A happy little boy standing and waving, nursery style' },
    { subject: 'She', example: 'She is a girl.', prompt: 'A happy little girl with pigtails smiling, nursery style' },
    { subject: 'His', example: 'This is his ball.', prompt: 'A boy holding a bright colorful ball, nursery style' },
    { subject: 'Her', example: 'This is her doll.', prompt: 'A girl holding a cute toy doll, nursery style' }
  ],
  determiners: [
    { word: 'This', example: 'This is an apple.', prompt: 'A close up of an apple being held in a hand, nursery style' },
    { word: 'That', example: 'That is the sun.', prompt: 'A child pointing to a smiling sun high in the sky, nursery style' }
  ],
  prepositions: [
    { word: 'In', example: 'The cat is in the box.', prompt: 'A cute kitten sitting inside a brown cardboard box, nursery style' },
    { word: 'On', example: 'The book is on the table.', prompt: 'A colorful picture book resting on a small wooden table, nursery style' },
    { word: 'Under', example: 'The dog is under the bed.', prompt: 'A friendly puppy peeking out from under a bed, nursery style' },
    { word: 'In front of', example: 'The ball is in front of the car.', prompt: 'A red toy car with a bouncy ball sitting right in front of it, nursery style' }
  ]
};

export const HIDDEN_WORDS_DATA = [
  { target: 'SUN', options: ['RUN', 'FUN', 'SUN', 'SON'], imagePrompt: 'A vibrant outdoor scene with a smiling sun, but other objects representing the option words are hidden or subtly placed: a child running, friends having fun, a father and son together.' },
  { target: 'CAR', options: ['CAT', 'CAP', 'CAN', 'CAR'], imagePrompt: 'A busy street scene. A red toy car is prominent. A cat is peeking from a window, a boy is wearing a cap, and someone is holding a soda can.' },
];

export const OPPOSITES_DATA = [
  { word: 'Happy', opposite: 'Sad', imagePrompt: 'A split screen: left side a smiling cartoon child, right side a sad cartoon child, nursery style' },
  { word: 'Big', opposite: 'Small', imagePrompt: 'A split screen: left side a huge blue elephant, right side a tiny little mouse, nursery style' },
  { word: 'Hot', opposite: 'Cold', imagePrompt: 'A split screen: left side a bright yellow sun, right side a white snowflake, nursery style' },
  { word: 'Full', opposite: 'Empty', imagePrompt: 'A split screen: left side a jar full of cookies, right side an empty glass jar, nursery style' },
  { word: 'Tall', opposite: 'Short', imagePrompt: 'A split screen: left side a tall green tree, right side a tiny green sprout, nursery style' },
  { word: 'On', opposite: 'Off', imagePrompt: 'A split screen: left side a bright glowing lightbulb, right side a dark gray lightbulb, nursery style' }
];

export const ADDITION_DATA = [
  { val1: 2, val2: 1, icon: 'fa-apple-whole', theme: 'Apples', prompt: 'A simple addition scene with 2 apples and 1 apple' },
  { val1: 3, val2: 2, icon: 'fa-star', theme: 'Stars', prompt: 'A simple addition scene with 3 stars and 2 stars' },
  { val1: 1, val2: 1, icon: 'fa-car', theme: 'Cars', prompt: 'A simple addition scene with 1 car and 1 car' },
];

export const SUBTRACTION_DATA = [
  { val1: 3, val2: 1, icon: 'fa-cookie', theme: 'Cookies', prompt: 'A scene with 3 cookies and one taken away' },
  { val1: 5, val2: 2, icon: 'fa-balloon', theme: 'Balloons', prompt: 'A scene with 5 balloons and two popped' },
];

export const NUMBER_WORDS_DATA = [
  { digit: 1, word: 'One', icon: 'fa-sun', prompt: 'One happy yellow sun' },
  { digit: 2, word: 'Two', icon: 'fa-shoe-prints', prompt: 'Two small baby shoes' },
  { digit: 3, word: 'Three', icon: 'fa-cat', prompt: 'Three little fluffy kittens' },
  { digit: 4, word: 'Four', icon: 'fa-clover', prompt: 'Four green lucky clovers' },
  { digit: 5, word: 'Five', icon: 'fa-hand', prompt: 'Five happy fingers' },
  { digit: 6, word: 'Six', icon: 'fa-bug', prompt: 'Six tiny ladybugs' },
  { digit: 7, word: 'Seven', icon: 'fa-cloud-rainbow', prompt: 'Seven colors in a rainbow' },
  { digit: 8, word: 'Eight', icon: 'fa-spider', prompt: 'Eight spider legs' },
  { digit: 9, word: 'Nine', icon: 'fa-balloon', prompt: 'Nine colorful balloons' },
  { digit: 10, wordName: 'Ten', prompt: 'ten green building blocks' },
  { digit: 11, wordName: 'Eleven', prompt: 'eleven little blue birds on a branch' },
  { digit: 12, wordName: 'Twelve', prompt: 'twelve bright orange carrots' },
  { digit: 13, wordName: 'Thirteen', prompt: 'thirteen smiling suns' },
  { digit: 14, wordName: 'Fourteen', prompt: 'fourteen colorful butterflies' },
  { digit: 15, wordName: 'Fifteen', prompt: 'fifteen yummy strawberry cookies' },
  { digit: 16, wordName: 'Sixteen', prompt: 'sixteen shiny silver coins' },
  { digit: 17, wordName: 'Seventeen', prompt: 'seventeen red and white candy canes' },
  { digit: 18, wordName: 'Eighteen', prompt: 'eighteen tiny green frogs' },
  { digit: 19, wordName: 'Nineteen', prompt: 'nineteen colorful buttons' },
  { digit: 20, wordName: 'Twenty', prompt: 'twenty bright yellow stars' },
];

export const TENS_UNITS_DATA = [
  { number: 12, tens: 1, units: 2, theme: 'Crayons', prompt: 'A bundle of 10 crayons and 2 single crayons, nursery style' },
  { number: 15, tens: 1, units: 5, theme: 'Blocks', prompt: 'A stack of 10 blocks and 5 single blocks, nursery style' },
  { number: 18, tens: 1, units: 8, theme: 'Strawberries', prompt: 'A basket of 10 strawberries and 8 single strawberries, nursery style' },
];

export const GROUPING_DATA = [
  { groupSize: 2, totalItems: 6, theme: 'Puppies', prompt: 'Three pairs of friendly puppies playing together, nursery style' },
  { groupSize: 3, totalItems: 9, theme: 'Apples', prompt: 'Three sets of three red apples arranged neatly, nursery style' },
  { groupSize: 2, totalItems: 4, theme: 'Birds', prompt: 'Two pairs of blue birds on branches, nursery style' },
];

export const TIME_DATA = [
  { hour: 3, minute: 0, phrase: "3 O'clock", prompt: "A colorful analog wall clock showing 3 o'clock precisely" },
  { hour: 7, minute: 0, phrase: "7 O'clock", prompt: "A colorful analog wall clock showing 7 o'clock precisely" },
];

export const MEASUREMENT_DATA = {
  weight: [
    { q: "Which is HEAVIER?", items: [{ label: "Elephant", prompt: "A giant heavy blue elephant" }, { label: "Feather", prompt: "A tiny light white feather" }], correct: 0 },
  ],
  height: [
    { q: "Which is TALLER?", items: [{ label: "Giraffe", prompt: "A very tall friendly giraffe" }, { label: "Cat", prompt: "A small cute house cat" }], correct: 0 },
  ]
};


export const VOWELS_CONSONANTS = {
  vowels: ['A', 'E', 'I', 'O', 'U'],
  consonants: ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z']
};

export const NUMERACY_DATA = {
  numbers: [
    { value: 1, word: 'One', prompt: 'one friendly cartoon lion cub' },
    { value: 2, word: 'Two', prompt: 'two happy yellow rubber ducks' },
    { value: 3, word: 'Three', prompt: 'three juicy red apples' },
    { value: 4, word: 'Four', prompt: 'four colorful bouncy balls' },
    { value: 5, word: 'Five', prompt: 'five shiny gold stars' },
    { value: 6, word: 'Six', prompt: 'six buzzing honey bees' },
    { value: 7, word: 'Seven', prompt: 'seven pretty pink flowers' },
    { value: 8, word: 'Eight', prompt: 'eight purple balloons' },
    { value: 9, word: 'Nine', prompt: 'nine little brown cupcakes' },
    { value: 10, wordName: 'Ten', prompt: 'ten green building blocks' },
    { value: 11, wordName: 'Eleven', prompt: 'eleven little blue birds on a branch' },
    { value: 12, wordName: 'Twelve', prompt: 'twelve bright orange carrots' },
    { value: 13, wordName: 'Thirteen', prompt: 'thirteen smiling suns' },
    { value: 14, wordName: 'Fourteen', prompt: 'fourteen colorful butterflies' },
    { value: 15, wordName: 'Fifteen', prompt: 'fifteen yummy strawberry cookies' },
    { value: 16, wordName: 'Sixteen', prompt: 'sixteen shiny silver coins' },
    { value: 17, wordName: 'Seventeen', prompt: 'seventeen red and white candy canes' },
    { value: 18, wordName: 'Eighteen', prompt: 'eighteen tiny green frogs' },
    { value: 19, wordName: 'Nineteen', prompt: 'nineteen colorful buttons' },
    { value: 20, wordName: 'Twenty', prompt: 'twenty bright yellow stars' },
  ],
  shapes: [
    { name: 'Circle', type: '2D', prompt: 'A perfect round red circle, nursery style' },
    { name: 'Square', type: '2D', prompt: 'A blue square with four equal sides, nursery style' },
    { name: 'Triangle', type: '2D', prompt: 'A yellow triangle with three corners, nursery style' },
  ],
  comparisons: [
    { 
      q: "Which one is BIG?", 
      category: 'Size', 
      options: [
        { size: 'lg', label: 'Big Bear', prompt: 'a giant huge friendly cartoon teddy bear, nursery style' }, 
        { size: 'sm', label: 'Small Bear', prompt: 'a very tiny little cartoon teddy bear, nursery style' }
      ], 
      correct: 0 
    },
  ],
  patterns: [
    { sequence: ['circle', 'square', 'circle', 'square'], next: 'circle', options: ['circle', 'square'] }
  ],
  oneToOne: [
    { count: 3, character: 'fa-dog', item: 'fa-bone', name: 'dogs', itemName: 'bones' }
  ]
};

export const VOCABULARY_DATA = [
  { word: 'apple', category: 'Nature', imagePrompt: 'A shiny red cartoon apple with a happy face, nursery style, white background' },
  { word: 'bus', category: 'Transport', imagePrompt: 'A big yellow school bus, cartoon style, nursery style, white background' },
  { word: 'cat', category: 'Animals', imagePrompt: 'A fluffy orange cartoon kitten sitting, nursery style, white background' },
  { word: 'dog', category: 'Animals', imagePrompt: 'A friendly spotted cartoon puppy, nursery style, white background' },
  { word: 'egg', category: 'Nature', imagePrompt: 'A white cartoon egg with a cute face, nursery style, white background' },
  { word: 'fish', category: 'Animals', imagePrompt: 'A happy orange goldfish swimming, cartoon style, nursery style, white background' }
];

export const DICTION_DATA = [
  { word: 'APPLE', syllables: 'AP-PLE', instruction: 'Open your mouth wide for the AP and smile for the PLE!', prompt: 'A big red apple, nursery style' },
  { word: 'BANANA', syllables: 'BA-NA-NA', instruction: 'Make a small circle with your lips for BA and NA!', prompt: 'A long yellow banana on a table, nursery style' },
  { word: 'CAT', syllables: 'CAT', instruction: 'Start with a sharp C sound and end with a T!', prompt: 'A cute cat sitting, nursery style' },
];

export const SCIENCE_DATA = {
  living: [
    { name: 'Puppy', prompt: 'A cute little puppy playing, nursery style' },
    { name: 'Tree', prompt: 'A big green tree with leaves, nursery style' },
    { name: 'Bird', prompt: 'A small blue bird flying, nursery style' },
    { name: 'Flower', prompt: 'A bright pink flower blooming, nursery style' }
  ],
  nonLiving: [
    { name: 'Rock', prompt: 'A smooth grey river rock, nursery style' },
    { name: 'Toy Car', prompt: 'A bright red toy car, nursery style' },
    { name: 'Ball', prompt: 'A colorful bouncy ball, nursery style' },
    { name: 'Cloud', prompt: 'A soft white fluffy cloud, nursery style' }
  ],
  livingNeeds: [
    { name: 'Plant', need: 'Water', before: 'A dry wilting brown plant, nursery style', after: 'A green happy growing plant in a pot, nursery style', instruction: 'Plants need water to grow tall and green!' },
    { name: 'Cat', need: 'Food', before: 'A sad skinny little cat looking at a bowl, nursery style', after: 'A happy fat cat sitting next to a full bowl, nursery style', instruction: 'Animals need food to have energy to play!' }
  ],
  water: [
    { source: 'Rain', use: 'Growing Plants', prompt: 'Raindrops falling on small green sprouts, nursery style', icon: 'fa-cloud-showers-heavy' },
    { source: 'Tap', use: 'Washing Hands', prompt: 'A child washing hands with bubbles from a tap, nursery style', icon: 'fa-faucet' },
    { source: 'Sea', use: 'Home for Fish', prompt: 'A big blue whale swimming in the ocean, nursery style', icon: 'fa-water' }
  ],
  floatSink: [
    { name: 'Rubber Duck', result: 'Float', prompt: 'A yellow rubber duck on top of blue water, nursery style', reason: 'Ducks stay on top!' },
    { name: 'Heavy Rock', result: 'Sink', prompt: 'A grey stone at the bottom of a glass of water, nursery style', reason: 'Rocks are heavy!' },
    { name: 'Paper Boat', result: 'Float', prompt: 'A white paper boat on a pond, nursery style', reason: 'Paper is light!' },
    { name: 'Metal Spoon', result: 'Sink', prompt: 'A silver spoon at the bottom of a tub, nursery style', reason: 'Metal is heavy!' }
  ],
  weather: [
    { type: 'Sunny', prompt: 'A bright smiling yellow sun with rays, nursery style' },
    { type: 'Rainy', prompt: 'Blue raindrops falling from a soft grey cloud, nursery style' },
    { type: 'Windy', prompt: 'A tree with leaves blowing in the wind, nursery style' },
    { type: 'Cloudy', prompt: 'Many soft white clouds in the blue sky, nursery style' }
  ],
  bodyParts: [
    { name: 'Eyes', action: 'I use my eyes to see the world!', icon: 'fa-eye' },
    { name: 'Hands', action: 'I use my hands to clap and play!', icon: 'fa-hand' },
    { name: 'Feet', action: 'I use my feet to jump and run!', icon: 'fa-shoe-prints' },
    { name: 'Ears', action: 'I use my ears to listen to music!', icon: 'fa-ear-listen' }
  ],
  innerOrgans: [
    { name: 'Heart', action: 'My heart goes thump-thump to pump my blood!', icon: 'fa-heart-pulse', prompt: 'A friendly cartoon red heart with a happy face, nursery style' },
    { name: 'Brain', action: 'My brain helps me think and learn!', icon: 'fa-brain', prompt: 'A colorful cartoon brain with lightbulbs around it, nursery style' },
    { name: 'Stomach', action: 'My stomach helps me digest my yummy food!', icon: 'fa-stomach', prompt: 'A happy cartoon stomach with a fork and spoon, nursery style' },
  ],
  growth: [
    { stage: 'Baby', action: 'Babies crawl and drink milk!', prompt: 'A cute cartoon baby crawling, nursery style' },
    { stage: 'Child', action: 'Children run and play at school!', prompt: 'A happy cartoon child with a backpack, nursery style' },
    { stage: 'Adult', action: 'Adults work and take care of us!', prompt: 'A friendly cartoon adult waving, nursery style' },
  ],
  senses: [
    { sense: 'Sight', organ: 'Eyes', action: 'I see a beautiful rainbow!', icon: 'fa-eye', prompt: 'A child looking through a magnifying glass at a rainbow, nursery style' },
    { sense: 'Hearing', organ: 'Ears', action: 'I hear the birds singing!', icon: 'fa-ear-listen', prompt: 'A child with hand to ear listening to a bird, nursery style' },
    { sense: 'Smell', organ: 'Nose', action: 'I smell a pretty flower!', icon: 'fa-nose-bubble', prompt: 'A child sniffing a bright pink flower, nursery style' },
  ],
  diet: [
    { name: 'Apple', group: 'Healthy', type: 'Fruit', prompt: 'A shiny red apple, nursery style' },
    { name: 'Carrot', group: 'Healthy', type: 'Vegetable', prompt: 'A bright orange carrot, nursery style' },
    { name: 'Candy', group: 'Treat', type: 'Sweet', prompt: 'A colorful swirl lollipop, nursery style' },
  ],
  dentist: [
    { task: 'Brushing', instruction: 'Brush up and down to keep teeth clean!', icon: 'fa-tooth', prompt: 'A friendly toothbrush and toothpaste tube, nursery style' },
    { task: 'Checkup', instruction: 'The dentist counts our shiny teeth!', icon: 'fa-user-md', prompt: 'A friendly dentist in a white coat smiling, nursery style' },
  ],
  health: [
    { state: 'Sick', feeling: 'I have a warm head and feel tired.', care: 'Rest and drink lots of water.', prompt: 'A child in bed with a thermometer, looking sleepy, nursery style' },
    { state: 'Healthy', feeling: 'I feel strong and full of energy!', care: 'Eat fruits and play outside.', prompt: 'A child jumping high with a big smile, nursery style' },
  ],
  transport: [
    { name: 'Red Car', type: 'Road', prompt: 'A bright red toy car on a road, nursery style', icon: 'fa-car' },
    { name: 'Airplane', type: 'Air', prompt: 'A blue airplane flying in the sky, nursery style', icon: 'fa-plane' },
    { name: 'Big Boat', type: 'Water', prompt: 'A large ship on the ocean, nursery style', icon: 'fa-ship' }
  ],
  properties: {
    colors: [
      { name: 'Red', prompt: 'A red apple', hex: '#FF0000', explanation: 'Red is the color of love and shiny apples!' },
      { name: 'Blue', prompt: 'A blue sky', hex: '#0000FF', explanation: 'Blue is the color of the big wide ocean!' },
      { name: 'Yellow', prompt: 'A yellow sun', hex: '#FFFF00', explanation: 'Yellow is the color of the bright smiling sun!' }
    ],
    shapes: [
      { name: 'Circle', prompt: 'A round ball', icon: 'fa-circle', explanation: 'A circle is perfectly round like a ball!' },
      { name: 'Square', prompt: 'A toy block', icon: 'fa-square', explanation: 'A square has four sides that are all the same!' }
    ],
    sizes: [
      { pair: 'Big and Small', items: [{ label: 'Big Bear', prompt: 'a giant huge friendly cartoon teddy bear, nursery style' }, { label: 'Small Bear', prompt: 'a very tiny little cartoon teddy bear, nursery style' }], explanation: 'Look! One bear is big and one bear is small!' },
      { pair: 'Long and Short', items: [{ label: 'Long Snake', prompt: 'A very long snake', key: 'long' }, { label: 'Short Snake', prompt: 'A very short snake', key: 'short' }], explanation: 'One snake is very long and the other is short!' }
    ],
    feelings: [
      { name: 'Happy', prompt: 'A smiling child', sound: 'Hooray!', explanation: 'I feel happy when I play with my friends!' },
      { name: 'Sleepy', prompt: 'A child yawning', sound: 'Yawn...', explanation: 'I feel sleepy when it is time for bed.' }
    ]
  },
  skills: {
    observation: [
      { name: 'Orange', macro: 'Macro photo of orange skin texture', full: 'A juicy orange fruit' },
      { name: 'Feather', macro: 'Macro photo of soft feather detail', full: 'A soft white feather' }
    ],
    curiosity: [
      { q: 'Why is the grass green?', a: 'Grass has something special that helps it turn sunlight into food!' },
      { q: 'How do birds fly?', a: 'Birds use their strong wings to push the air and go up!' }
    ],
    care: [
      { task: 'Feed the Puppy', action: 'Feeding', icon: 'fa-dog', before: 'A hungry looking puppy', after: 'A happy full puppy' },
      { task: 'Water the Plant', action: 'Watering', icon: 'fa-seedling', before: 'A thirsty drooping plant', after: 'A happy growing plant' }
    ]
  }
};

export const ARTS_DATA = {
  drawingPrompts: [
    { title: 'A Happy Sun', prompt: 'A bright smiling yellow sun with rays, nursery style', difficulty: 'Easy' },
    { title: 'A Colorful Rainbow', prompt: 'A beautiful rainbow with seven colors, nursery style', difficulty: 'Easy' },
    { title: 'A Fluffy Cat', prompt: 'A soft orange fluffy cat sitting down, nursery style', difficulty: 'Easy' }
  ],
  colorNature: [
    { name: 'Leaf', color: 'Green', prompt: 'A bright green leaf on a branch, nursery style' },
    { name: 'Sky', color: 'Blue', prompt: 'A clear blue sky with a few clouds, nursery style' },
    { name: 'Banana', color: 'Yellow', prompt: 'A yellow banana on a table, nursery style' }
  ],
  shapeChallenges: [
    { name: 'A Little House', description: 'Draw a square for the house and a triangle for the roof!', parts: ['Square', 'Triangle'] },
    { name: 'A Snowman', description: 'Draw three circles on top of each other to make a snowman!', parts: ['Circle', 'Circle', 'Circle'] },
    { name: 'A Shiny Star', description: 'Draw a star with five points in the night sky!', parts: ['Star'] }
  ],
  textureBin: [
    { name: 'Fluffy Cloud', prompt: 'Extreme close up, macro shot of soft white cotton ball texture, nursery style', description: "Wow, it's so soft and fluffy, like a cloud!"},
    { name: 'Bumpy Log', prompt: 'Macro photo of tree bark texture, nursery style', description: "This feels bumpy and rough, like a tree!"},
    { name: 'Smooth Stone', prompt: 'A smooth grey river stone, glossy', description: 'It\'s so smooth and cool to touch!' }
  ]
};