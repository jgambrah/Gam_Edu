
// This is a placeholder file for constants used in the Early Years modules.

export const PHONICS_DATA = [
    { upper: 'A', lower: 'a', word: 'Apple', imagePrompt: 'A red apple' },
    { upper: 'B', lower: 'b', word: 'Ball', imagePrompt: 'A colorful ball' },
];

export const INITIAL_WORDS = [
    { word: 'cat', sentence: 'The cat is sleeping.', imagePrompt: 'A sleeping cat' },
    { word: 'sun', sentence: 'The sun is bright.', imagePrompt: 'A bright sun in the sky' },
];

export const VOWELS_CONSONANTS = {
    vowels: 'aeiou',
    consonants: 'bcdfghjklmnpqrstvwxyz'
};

export const DICTION_DATA = [
    { word: 'ELEPHANT', syllables: 'El-e-phant', instruction: 'Open your mouth wide for the EL sound!', prompt: 'An elephant' }
];

export const READING_DATA = [
    { title: 'My Pet Dog', text: 'I have a pet dog. His name is Spot. Spot likes to play ball.', imagePrompt: 'A boy playing with his dog', activities: [{ question: 'What is the dog\'s name?', options: ['Max', 'Spot', 'Buddy'], correct: 1 }] }
];

export const SENTENCE_DATA = [
    { text: 'The red car is fast.', pattern: 'Article-Adjective-Noun-Verb-Adjective', imagePrompt: 'A fast red car' }
];

export const HIDDEN_WORDS_DATA = [
    { target: 'SUN', options: ['fun', 'run', 'sun', 'bun'], imagePrompt: 'A sun in the sky with clouds' }
];

export const GRAMMAR_DATA = {
    nouns: [{ word: 'Dog', type: 'Animal', prompt: 'A friendly dog' }],
    verbs: [{ word: 'Run', action: 'Running', prompt: 'A person running' }],
    plurals: [{ singular: 'Cat', plural: 'Cats', prompt: 'Two cats playing' }],
    articles: [{ word: 'Apple', article: 'an', prompt: 'An apple' }],
    pronouns: [{ subject: 'He', example: 'He is playing.', prompt: 'A boy playing' }],
    determiners: [{ word: 'This', example: 'This is a ball.', prompt: 'A hand pointing to a ball' }],
    prepositions: [{ word: 'On', example: 'The cat is on the box.', prompt: 'A cat sitting on a box' }],
};

export const OPPOSITES_DATA = [
    { word: 'BIG', opposite: 'small', imagePrompt: 'A big elephant and a small mouse' }
];

export const BLENDS_DATA = [
    { blend: 'bl', type: 'blend-l', words: [{ word: 'blue', prompt: 'A blue block' }] }
];

export const RHYMES_DATA = [
    { ending: 'at', words: [{ word: 'cat', prompt: 'A cat' }, { word: 'hat', prompt: 'A hat' }] }
];

export const MISSING_LETTERS_DATA = [
    { word: 'CAT', missing: 'A', options: ['A', 'E', 'I'], prompt: 'A sitting cat' }
];

export const STORYTELLING_DATA = [
    { title: 'A Trip to the Beach', prompt: 'A sunny beach with children building a sandcastle', questions: ['What are the children doing?', 'What is in the sky?', 'How do you think they feel?'] }
];

export const THEME_VOCAB_DATA = {
    seasons: [
        { name: 'Summer', prompt: 'A sunny beach scene', words: ['Sun', 'Beach', 'Hot'] }
    ]
};

    