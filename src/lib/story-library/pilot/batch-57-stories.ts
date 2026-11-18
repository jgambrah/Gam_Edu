import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (
  motif: string,
  text: string,
  alt: string,
  narration = 'Warm, slow storyteller’s voice suited for Basic 4 to 6 learners; pause often and say new words clearly.'
): Page => ({
  motif,
  text,
  alt,
  brief: `Warm hand-painted gouache folk-tale scene, landscape 4:3, following the character notes exactly. ${alt} Keep a calm, uncluttered area for text.`,
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
      notes: [
        'Read stories with a distinct, natural voice for each character; read articles as one clear narrator.',
        'Pause for two seconds at each comprehension check so learners can reason first.',
        'Pronounce the names of characters and places clearly, with respect for the languages they come from.',
      ],
    },
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: [
      'Is the language right for the stated age band (Basic 4 to Basic 6) and the NaCCA primary reading level?',
      'Is the tale retold with respect for the people it comes from, and is its lesson clear?',
      ...s.reviewQuestions,
    ],
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

/**
 * Batch 57 (7 original Big Ideas stories and articles for Basic 4 to Basic 6, six short pages each, with activities).
 * Each article is linked to Social Studies, Career Technology, Science, or Computing (see the first cultural note and the teacher guide).
 * These are original stories and articles, each teaching one idea from a well-known book. Stories list their characters; articles have none.
 * Original text written for Ghanaian learners; each factCheck note names the book behind the idea and what to verify.
 */

export const BATCH_57_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'kid-the-sandal-sellers-question',
    title: 'The Sandal Seller’s Question',
    summary:
      'Yaw helps in his uncle’s sandal shop. A tired market woman walks by, and Yaw does something his uncle never does: he asks a question. A story about listening before selling.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'listening', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Warm, simple, and friendly',
    palette: ['#b45309', '#0f766e'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Yaw: a helpful boy in Basic 6 who works in the shop on Saturdays.',
      'Uncle Kojo: the shoemaker, who talks a lot about his sandals.',
      'Maame Esther: a fish seller whose feet hurt.',
    ],
    music: 'Light highlife guitar with a soft shaker (placeholder)',
    pages: [
      pg(
        '👡',
        'Uncle Kojo’s shop was full of sandals, red ones, blue ones, and shiny ones. When a customer came, he talked and talked. “Very strong! Very pretty! Very cheap!” But most people said, “Thank you,” and walked away. Yaw noticed that Uncle Kojo never asked the customers one question.',
        'A shop full of colourful sandals and a man talking while a customer walks away.'
      ),
      pg(
        '🐟',
        'One Saturday, Maame Esther, the fish seller, walked past with a sad face. She was limping a little. Uncle Kojo called, “Maame, buy these lovely red sandals!” She shook her head and kept walking. Yaw ran after her. “Maame, please, may I ask you something? Why are you limping?”',
        'A boy running after a limping fish seller who carries a tray.'
      ),
      pg(
        '❓',
        '“My feet hurt,” said Maame Esther. “I stand on the hard ground all day, from five in the morning. My old sandals are thin, like paper.” Yaw asked, “Do you walk far?” “Only to the market and home. But standing is the problem.” Yaw listened and said, “Thank you, Maame. Please wait here.”',
        'A boy listening carefully to a fish seller who points at her thin sandals.'
      ),
      pg(
        '✅',
        'Yaw told Uncle Kojo what he had learned. They looked for a sandal with a thick, soft sole. Uncle Kojo found one at the back, not pretty, but very comfortable. Yaw said honestly, “Maame, this one is not the prettiest. But it will help your feet when you stand.” She tried it and smiled for the first time all day.',
        'A fish seller trying on a plain sandal with a thick soft sole.'
      ),
      pg(
        '🌟',
        'Maame Esther bought two pairs and told her friends at the market. “That boy asked about my feet!” By the end of the month, many fish sellers came to the shop. Uncle Kojo watched Yaw and began to ask questions, too: “What do you need? How do you walk? What hurts?”',
        'Several market women lining up at a sandal shop while a boy helps.'
      ),
      pg(
        '💡',
        'Yaw told his uncle, “If a sandal is not right for the person, it is better to say so.” His uncle nodded. “Asking first is better than talking first.” Try it! Next time you want to help someone, ask a question first. What do they really need?',
        'A boy and his uncle smiling beside a row of sandals.'
      ),
    ],
    activities: [
      {
        id: 'qi-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did Uncle Kojo never do?',
        options: [
          'Ask the customers a question',
          'Sell sandals',
          'Talk to people',
        ],
        correctIndex: 0,
      },
      {
        id: 'qi-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What was Maame Esther’s problem?',
        options: [
          'Her feet hurt from standing on hard ground',
          'She lost her money',
          'She was late',
        ],
        correctIndex: 0,
      },
      {
        id: 'qi-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Yaw show honesty?',
        options: [
          'He said the sandal was not the prettiest but would help her feet',
          'He said it was the best in the world',
          'He hid the price',
        ],
        correctIndex: 0,
      },
      {
        id: 'qi-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: A friend says her bag hurts her shoulders. What should you do first?',
        options: [
          'Tell her to buy yours',
          'Ask what is in it and how she carries it',
          'Laugh',
        ],
        correctIndex: 1,
      },
      {
        id: 'qi-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'Uncle Kojo talks and nobody buys',
          'Yaw asks Maame Esther why she limps',
          'He finds a soft-soled sandal that suits her',
          'Fish sellers come and Uncle Kojo learns to ask',
        ],
      },
      {
        id: 'qi-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'comfortable',
        definition: 'Pleasant and easy to wear or use.',
        distractors: [
          'Very expensive',
          'Very bright',
        ],
      },
    ],
    glossary: [
      {
        word: 'customer',
        definition: 'A person who buys things.',
        pages: [1],
      },
      {
        word: 'limping',
        definition: 'Walking with difficulty because of pain.',
        pages: [2],
      },
      {
        word: 'sole',
        definition: 'The bottom part of a shoe or sandal.',
        pages: [4],
      },
      {
        word: 'comfortable',
        definition: 'Pleasant and easy to wear or use.',
        pages: [4],
      },
      {
        word: 'honestly',
        definition: 'In a truthful way.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'Big idea: Sell by understanding what a person really needs, and be honest about what your product can and cannot do. The idea is explored further in “Solution Selling” by Michael T. Bosworth (1994), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'The story is about honest helping. It should not be used to teach pressure selling.',
    ],
    reviewQuestions: [
      'Check that prices are sensible.',
      'Check that the fish seller is shown with respect.',
    ],
    guide: {
      overview:
        'A story about asking before selling and being honest about what suits a person.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Explain why Yaw asked a question first.',
        'Ask a helpful question.',
      ],
      subjects: [
        ['Our World Our People (NaCCA CCP primary: work and helping others; codes to verify)', 'Understanding needs'],
        ['English Language (NaCCA CCP primary: asking questions; codes to verify)', 'Asking and listening'],
      ],
      before: ['Ask: what do sellers say to make you buy?'],
      during: ['Stop after Page 2. Ask: what question could Yaw ask?'],
      after: ['Pupils play shop: one asks questions, one answers.'],
      discussion: ['Why did Maame Esther trust Yaw?'],
      reflection: ['When did someone really listen to you?'],
      maths: [
        {
          task: 'Maame Esther buys two pairs at GH¢12 a pair. How much does she pay?',
          answer: '12 × 2 = GH¢24.',
        },
      ],
      support: ['Practise three question starters.'],
      stretch: ['Make a list of questions a shop could ask its customers.'],
      localise: ['What do market women need for their long days?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge and should be confirmed.'],
    },
  }),

  // 2
  mk({
    key: 'kid-selina-tells-the-class',
    title: 'Selina Tells the Class',
    summary:
      'The class has saved money for new drums. Selina, the treasurer, loses some of it. She can hide it, or she can tell the truth. A story about honesty when things go wrong.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'honesty', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Quiet, honest, and hopeful',
    palette: ['#be185d', '#0369a1'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Selina: the class treasurer in Basic 6, careful and kind.',
      'Mr Tetteh: the class teacher, calm and fair.',
      'Kofi: a classmate who loves drumming.',
    ],
    music: 'Soft drum with a gentle flute (placeholder)',
    pages: [
      pg(
        '🥁',
        'Basic 6 wanted new drums for the school band. For three months, every pupil gave a few pesewas each week. Selina, the class treasurer, kept the money in a small tin and wrote every amount in her book. By Friday, they had fifty cedis. “Soon we can buy a drum!” said Kofi happily.',
        'A girl writing in a book beside a small money tin while classmates cheer.'
      ),
      pg(
        '😨',
        'On Monday morning, Selina opened her bag and her heart sank. The tin was open, and ten cedis were missing! She searched everywhere. It must have fallen on the way to school. Her hands shook. She thought, “If I say nothing, nobody will know. I can try to find the money first.” But she felt sick inside.',
        'A girl looking into an open bag with a frightened face.'
      ),
      pg(
        '🤔',
        'At break, Selina sat alone. She remembered what her grandmother said: “A small lie hides a big problem.” She thought about it for a long time. Then she stood up. “The class trusts me,” she said to herself. “It takes courage, but I must tell them the truth, even if it is hard.” She took her book and her tin to Mr Tetteh.',
        'A girl standing up bravely with a book and a tin in her hands.'
      ),
      pg(
        '📢',
        'Mr Tetteh listened. “Thank you for telling me,” he said. “It takes courage.” He asked Selina to tell the class. She stood in front of everyone with her knees shaking. “I lost ten cedis on the way to school,” she said. “I am so sorry. I did not hide it, because you trusted me.” The room was silent.',
        'A girl speaking to a quiet classroom while a teacher stands beside her.'
      ),
      pg(
        '🤝',
        'Then Kofi stood up. “Thank you for telling us, Selina,” he said. “That was brave.” One by one, the pupils said kind things. “We can walk the road you walked and look.” “We can each give two more pesewas.” By Friday, they had found two cedis on the path, and the class had made up the rest.',
        'Children searching a path together and putting coins in a tin.'
      ),
      pg(
        '💡',
        'The drum was bought a little later than planned. But the class trusted Selina more than before. “She told the truth when it was hard,” said Mr Tetteh. Try it! When something goes wrong, do not hide it. Tell someone you trust, say sorry, and ask for help.',
        'A class beating a new drum with Selina smiling.'
      ),
    ],
    activities: [
      {
        id: 'qj-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did Basic 6 want to buy?',
        options: [
          'Drums for the school band',
          'New books',
          'Balls',
        ],
        correctIndex: 0,
      },
      {
        id: 'qj-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What was wrong when Selina opened the tin?',
        options: [
          'Ten cedis were missing',
          'The tin was empty',
          'The tin was new',
        ],
        correctIndex: 0,
      },
      {
        id: 'qj-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What did Selina tell the class?',
        options: [
          'That she lost ten cedis and was sorry',
          'That someone stole it',
          'Nothing',
        ],
        correctIndex: 0,
      },
      {
        id: 'qj-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: You lose a friend’s ruler. What should you do?',
        options: [
          'Hide it',
          'Tell her the truth and say sorry',
          'Blame someone',
        ],
        correctIndex: 1,
      },
      {
        id: 'qj-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'The class saves money for drums',
          'Selina finds money missing',
          'She decides to tell the truth',
          'The class helps and trusts her more',
        ],
      },
      {
        id: 'qj-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'treasurer',
        definition: 'The person who looks after a group’s money.',
        distractors: [
          'A kind of drum',
          'A school prefect',
        ],
      },
    ],
    glossary: [
      {
        word: 'treasurer',
        definition: 'The person who looks after a group’s money.',
        pages: [1],
      },
      {
        word: 'tin',
        definition: 'A small metal box with a lid.',
        pages: [1],
      },
      {
        word: 'courage',
        definition: 'The strength to do something frightening.',
        pages: [3, 4],
      },
      {
        word: 'silent',
        definition: 'Without any sound.',
        pages: [4],
      },
      {
        word: 'trusted',
        definition: 'Believed to be honest.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: When things go wrong, tell the truth early, stay with the problem, and ask for help. The idea is explored further in “The Hard Thing About Hard Things” by Ben Horowitz (2014), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'The class responds with kindness. The story does not suggest that lying is always found out; it says that honesty builds trust.',
    ],
    reviewQuestions: [
      'Check that handling class money follows school rules.',
      'Check the sum: 50 - 10 + 2 = 42.',
    ],
    guide: {
      overview:
        'A story about telling the truth after losing money and how the class responds.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Explain why Selina told the truth.',
        'Say what to do when you make a mistake.',
      ],
      subjects: [
        ['Our World Our People (NaCCA CCP primary: honesty and responsibility; codes to verify)', 'Telling the truth'],
        ['Creative Arts (NaCCA CCP primary: music and drumming; codes to verify)', 'Making music together'],
      ],
      before: ['Ask: have you ever lost something that belonged to someone else?'],
      during: ['Stop after Page 2. Ask: what would you do?'],
      after: ['Pupils role-play telling the truth kindly.'],
      discussion: ['Why did the class trust Selina more at the end?'],
      reflection: ['What truth is hard for you to tell?'],
      maths: [
        {
          task: 'The class had 50 cedis, lost 10, and found 2. How much did they have before adding more?',
          answer: '50 - 10 + 2 = GH¢42.',
        },
      ],
      support: ['Act the class meeting in groups.'],
      stretch: ['Write what a good apology says.'],
      localise: ['What do elders say about honesty?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 3
  mk({
    key: 'kid-the-day-the-mill-came',
    title: 'The Day the Mill Came',
    summary:
      'A grinding mill arrives in the village. Some people are amazed and some are worried. A story about welcoming a new machine and asking good questions about it.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'technology', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Warm, curious, and balanced',
    palette: ['#92400e', '#475569'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Adwoa: a curious girl in Basic 5 who helps her mother.',
      'Maame Akos: her mother, who grinds cassava by hand every day.',
      'Mr Fosu: the man who brings the mill.',
      'Nana Efua: the oldest woman, wise and watchful.',
    ],
    music: 'Slow rhythmic drum with a soft hum (placeholder)',
    pages: [
      pg(
        '⚙️',
        'Every morning, Adwoa’s mother, Maame Akos, ground cassava with a stone for two hours. Her arms ached. One day a lorry arrived with a big metal machine. “A grinding mill!” said Mr Fosu. “It grinds a whole sack in ten minutes!” The villagers crowded round, whispering. Adwoa’s eyes grew wide with wonder.',
        'A village crowd looking at a new metal grinding mill beside a lorry.'
      ),
      pg(
        '😮',
        'Some people were delighted. “No more sore arms!” said Maame Akos. “I will have time to rest and to cook.” But others were worried. “What about the women who grind for money?” asked an old woman. “And is it safe for children?” The village was split between wonder and worry.',
        'Some villagers smiling and others frowning at the machine.'
      ),
      pg(
        '❓',
        'Nana Efua, the oldest woman, raised her hand. “A new machine is not good or bad,” she said. “It depends on how we use it. Let us ask three questions. Who gains? Who might lose? And how can we help those who lose?” The people nodded and began to talk.',
        'An old woman speaking to a quiet crowd with three fingers raised.'
      ),
      pg(
        '🤝',
        'The women who ground for money said, “We will lose our work.” So the village agreed that they could run the mill together and share the money. Mr Fosu agreed to teach them how to use it. Everyone agreed on safety rules: no children near the machine, and only trained adults to operate it.',
        'Women learning to use the mill with a teacher while children stand back.'
      ),
      pg(
        '⏰',
        'Soon the mill was running smoothly. Maame Akos now had two extra hours each morning. She began a small group where women made soap and sold it at the market. Adwoa helped. Her mother’s arms no longer ached. The village had more time, and more work that was not so heavy.',
        'Women making soap together while a mill hums in the background.'
      ),
      pg(
        '💡',
        'Adwoa wrote in her book: “A new machine brings wonder and worry. Both are fair. Let us ask: Who gains? Who loses? How can we help? And how can we stay safe?” Try it! What new machine or phone has come to your home? Ask the four questions.',
        'A girl writing four questions in a notebook beside the mill.'
      ),
    ],
    activities: [
      {
        id: 'qk-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did the mill do?',
        options: [
          'Ground a sack of cassava in ten minutes',
          'Made water',
          'Sewed clothes',
        ],
        correctIndex: 0,
      },
      {
        id: 'qk-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What three questions did Nana Efua ask?',
        options: [
          'Who gains? Who might lose? How can we help those who lose?',
          'Who is tallest? Who sings? Who dances?',
          'Who runs? Who jumps? Who shouts?',
        ],
        correctIndex: 0,
      },
      {
        id: 'qk-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did the village protect the women who ground for money?',
        options: [
          'They ran the mill together and shared the money',
          'They closed the mill',
          'They sent them away',
        ],
        correctIndex: 0,
      },
      {
        id: 'qk-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: Your school gets a computer. What could you ask?',
        options: [
          'Nothing',
          'Who gains, who might lose, how to stay safe',
          'Whether it is loud',
        ],
        correctIndex: 1,
      },
      {
        id: 'qk-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'A grinding mill arrives',
          'People feel wonder and worry',
          'Nana Efua asks three questions',
          'The women run the mill together',
          'There is more time for new work',
        ],
      },
      {
        id: 'qk-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'gain',
        definition: 'To get something good.',
        distractors: [
          'To lose something',
          'To break something',
        ],
      },
    ],
    glossary: [
      {
        word: 'mill',
        definition: 'A machine for grinding grain or roots.',
        pages: [1],
      },
      {
        word: 'wonder',
        definition: 'A feeling of surprise and delight.',
        pages: [1, 2],
      },
      {
        word: 'worry',
        definition: 'A feeling that something bad may happen.',
        pages: [2],
      },
      {
        word: 'gains',
        definition: 'Gets something good.',
        pages: [3],
      },
      {
        word: 'safety',
        definition: 'Being free from danger.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'Big idea: New machines bring both wonder and worry; ask who gains, who loses, and how to help those who lose. The idea is explored further in “Pandaemonium: 1660-1886” by Humphrey Jennings (published 1985), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'Safety: the story says that children must stay away from machines and only trained adults operate them.',
    ],
    reviewQuestions: [
      'Check the mill details and the safety rules with a local adult.',
      'Check the sum: 60 ÷ 10 = 6.',
    ],
    guide: {
      overview:
        'A story about welcoming a new machine fairly and safely.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Name the questions to ask about a new machine.',
        'Say why safety rules matter.',
      ],
      subjects: [
        ['Our World Our People (NaCCA CCP primary: technology and change in the community; codes to verify)', 'New tools'],
        ['Mathematics (NaCCA CCP primary: time and division; codes to verify)', 'Time saved'],
      ],
      before: ['Ask: what machine has changed how your family works?'],
      during: ['Stop after Page 3. Ask: who gains and who might lose?'],
      after: ['Pupils ask the four questions about a phone or a mill.'],
      discussion: ['Why were both wonder and worry fair?'],
      reflection: ['What new thing do you feel both excited and worried about?'],
      maths: [
        {
          task: 'The mill grinds a sack in 10 minutes. How many sacks can it grind in an hour?',
          answer: '60 ÷ 10 = 6 sacks.',
        },
      ],
      support: ['Make a two-column list: gains and worries.'],
      stretch: ['Find out how people ground cassava before and after mills.'],
      localise: ['What machines are used for food processing near you?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 4
  mk({
    key: 'kid-the-rain-notebook',
    title: 'The Rain Notebook',
    summary:
      'Kwabena believes the rain comes when a certain bird sings. He keeps a notebook to prove it, and the notebook says something else. A story about changing your mind when the facts disagree.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'evidence', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Curious, calm, and clear',
    palette: ['#1e40af', '#15803d'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Kwabena: a confident boy in Basic 5 who loves birds and weather.',
      'Auntie Mavis: his aunt, a farmer who watches the sky.',
      'Mr Danso: the science teacher, curious and kind.',
    ],
    music: 'Soft rain sounds with a gentle xylophone (placeholder)',
    pages: [
      pg(
        '🐦',
        'Kwabena loved the grey bird that sang near his house. “When it sings, the rain comes,” he told his friends proudly. “I know it is true!” Nobody argued, because Kwabena was so sure. But Mr Danso, the science teacher, asked a gentle question. “How do you know?” Kwabena frowned. “I just know.”',
        'A boy pointing at a grey bird on a branch while his friends listen.'
      ),
      pg(
        '📓',
        'Mr Danso gave him a notebook. “Write down each day whether the bird sings and whether it rains. After two weeks, look at your notes.” Kwabena grinned. “This will show everyone I am right!” Every day he wrote two things: Bird: yes or no. Rain: yes or no.',
        'A boy writing in a notebook with two columns labelled bird and rain.'
      ),
      pg(
        '📊',
        'After two weeks, Kwabena counted. The bird sang on eight days. On four of those days it rained, and on four it did not. On the six days when the bird was silent, it rained on three. The rain came about half the time, whether the bird sang or not. His heart sank. “The facts say the bird is not the reason,” he whispered.',
        'A boy looking at his notebook with surprise and a puzzled face.'
      ),
      pg(
        '🤔',
        'He felt a little sad and a little foolish. He had been so sure! But Mr Danso smiled. “That took courage,” he said. “Many people never test their own ideas. You looked at the facts and changed your mind. That is what a scientist does.” Kwabena felt better. “Then what does bring the rain?”',
        'A teacher and a boy talking beside a window with grey clouds.'
      ),
      pg(
        '☁️',
        'Auntie Mavis, the farmer, knew. “Look at the sky,” she said. “When dark, heavy clouds gather and a cool wind blows, rain is near.” Kwabena added a new column to his notebook: Clouds and wind. After a week, he saw that Auntie Mavis was right! Dark clouds and a cool wind came before almost every rain.',
        'A boy and his aunt looking up at dark clouds on a farm.'
      ),
      pg(
        '💡',
        'Kwabena still loved the grey bird. But he told his friends, “My first idea was wrong, and I am glad I tested it.” Try it! Think of something you believe. How could you test it? Write down what you see, and be ready to change your mind if the facts say so.',
        'A boy smiling with his notebook beside the grey bird.'
      ),
    ],
    activities: [
      {
        id: 'ql-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did Kwabena believe?',
        options: [
          'That rain comes when the bird sings',
          'That birds cause storms',
          'That rain is rare',
        ],
        correctIndex: 0,
      },
      {
        id: 'ql-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did his notebook show?',
        options: [
          'Rain came about half the time whether the bird sang or not',
          'The bird always brought rain',
          'It never rained',
        ],
        correctIndex: 0,
      },
      {
        id: 'ql-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What did Mr Danso say about Kwabena changing his mind?',
        options: [
          'It took courage and is what a scientist does',
          'It was silly',
          'He should have kept his idea',
        ],
        correctIndex: 0,
      },
      {
        id: 'ql-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: You think a lucky pencil helps you do well in tests. How could you test it?',
        options: [
          'Do not test',
          'Write down your marks with and without it and look at the facts',
          'Throw it away',
        ],
        correctIndex: 1,
      },
      {
        id: 'ql-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'Kwabena believes the bird brings rain',
          'He keeps a notebook for two weeks',
          'The notebook shows no link',
          'He learns that dark clouds and cool wind come before rain',
        ],
      },
      {
        id: 'ql-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'facts',
        definition: 'Things that are known to be true.',
        distractors: [
          'Wishes',
          'Stories',
        ],
      },
    ],
    glossary: [
      {
        word: 'proudly',
        definition: 'With a feeling of pleasure in what you have done or know.',
        pages: [1],
      },
      {
        word: 'notebook',
        definition: 'A small book for writing notes.',
        pages: [2],
      },
      {
        word: 'facts',
        definition: 'Things that are known to be true.',
        pages: [3, 4],
      },
      {
        word: 'courage',
        definition: 'The strength to do something difficult.',
        pages: [4],
      },
      {
        word: 'clouds',
        definition: 'White or grey shapes in the sky made of tiny drops of water.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Big idea: Test your favourite idea against the facts, and be ready to drop it if the evidence disagrees. The idea is explored further in “The Sleepwalkers” by Arthur Koestler (1959), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'The story respects the boy’s curiosity and the aunt’s farm knowledge.',
    ],
    reviewQuestions: [
      'Check that the cloud and wind description is correct for your area.',
      'Check the sum: 8 + 6 = 14.',
    ],
    guide: {
      overview:
        'A story about testing a belief and changing your mind when the facts disagree.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Explain how the notebook tested the idea.',
        'Say why changing your mind can be brave.',
      ],
      subjects: [
        ['Science (NaCCA CCP primary: observing and recording the weather; codes to verify)', 'Weather diary'],
        ['Mathematics (NaCCA CCP primary: counting and tables; codes to verify)', 'Recording data'],
      ],
      before: ['Ask: what do people in your area say about rain?'],
      during: ['Stop after Page 2. Ask: what will the notebook show?'],
      after: ['Pupils keep a weather notebook for two weeks.'],
      discussion: ['Why is it hard to give up an idea you love?'],
      reflection: ['What belief of yours could you test?'],
      maths: [
        {
          task: 'The bird sang on 8 days and was silent on 6. How many days was Kwabena’s notebook?',
          answer: '8 + 6 = 14 days.',
        },
      ],
      support: ['Provide a two-column table: bird and rain.'],
      stretch: ['Add a third column: wind. What do you see?'],
      localise: ['What signs do farmers near you use to tell rain is coming?'],
      factCheck: ['The story is fiction. The cloud and wind signs should be checked by a science teacher. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 5
  mk({
    key: 'kid-the-reading-corner',
    title: 'The Reading Corner',
    summary:
      'Thirty children want a reading corner and argue about everything. When four friends take charge with a clear aim, the corner is ready in three days. A story about small teams and clear aims.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'teamwork', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Lively, warm, and clear',
    palette: ['#0d9488', '#f59e0b'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Nii: a calm boy in Basic 5 who is good at planning.',
      'Gifty: a neat girl who writes labels.',
      'Issah: a boy who builds things.',
      'Mabel: a girl who loves stories.',
      'Madam Rose: the class teacher, kind and practical.',
    ],
    music: 'Upbeat drums with a light shaker (placeholder)',
    pages: [
      pg(
        '📚',
        'Madam Rose said, “Basic 5, you may make a reading corner!” Thirty children cheered. Then the arguing began. “Red paint!” “Blue paint!” “Chairs!” “Mats!” Everyone talked at once. They began to argue about paint. After two days, there was a lot of noise but no corner. The books were still in a box. Madam Rose looked at the clock with a small sigh.',
        'A noisy classroom with thirty children talking while a box of books sits unopened.'
      ),
      pg(
        '4️⃣',
        '“Let us try something different,” said Madam Rose. “Four of you will make the corner. You will have a clear aim: a cosy corner with a mat, a shelf, and twenty books, ready by Friday.” She chose Nii, Gifty, Issah, and Mabel. The other pupils would help by bringing books and mats.',
        'A teacher pointing to four children at the front of the class.'
      ),
      pg(
        '📝',
        'The four friends made three simple rules. One: write a short plan on one page. Two: each person takes a job. Nii plans, Gifty writes labels, Issah builds the shelf, and Mabel sorts the books. Three: meet for ten minutes every day to check. Nobody argued about paint, because Madam Rose said, “Blue, please.”',
        'Four children planning at a table with a one-page plan.'
      ),
      pg(
        '🔨',
        'On the first day, Issah built a shelf from old boxes and planks. Gifty painted neat labels for the books. Mabel sorted the books into animals, stories, and facts. Nii checked the plan every afternoon. When a plank broke, they fixed it quickly instead of arguing. The other pupils brought books and a colourful mat from home.',
        'Four children building a shelf and sorting books while others bring mats.'
      ),
      pg(
        '🎉',
        'On Friday morning, the reading corner was ready! The class stepped inside and gasped. There was a soft mat, a bright shelf, and twenty-five books. Everyone took a book and sat down. Madam Rose smiled. “Thirty ideas,” she said, “four builders, and one corner for everybody.”',
        'A class sitting on a mat in a bright reading corner.'
      ),
      pg(
        '💡',
        'Nii said, “A small team with a clear aim and simple rules can be fast. And everyone else helps by giving things and ideas.” Try it! If your class has a big job, how could a small team do it, and how can the others help?',
        'A boy and his teammates smiling in front of their reading corner.'
      ),
    ],
    activities: [
      {
        id: 'qm-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What was the problem on the first two days?',
        options: [
          'Everyone talked at once and nothing was built',
          'There were no books',
          'The class was closed',
        ],
        correctIndex: 0,
      },
      {
        id: 'qm-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What aim did Madam Rose give the team?',
        options: [
          'A cosy corner with a mat, a shelf, and twenty books by Friday',
          'The biggest corner in the school',
          'A noisy party',
        ],
        correctIndex: 0,
      },
      {
        id: 'qm-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did the other pupils help?',
        options: [
          'They brought books and a mat',
          'They stayed away',
          'They painted the walls red',
        ],
        correctIndex: 0,
      },
      {
        id: 'qm-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: Your class must prepare a short play. What is a good plan?',
        options: [
          'Let everyone talk at once',
          'Choose a small team with a clear aim and let the others help',
          'Cancel the play',
        ],
        correctIndex: 1,
      },
      {
        id: 'qm-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'Thirty children argue and nothing is built',
          'Madam Rose chooses four with a clear aim',
          'The four make simple rules',
          'The reading corner is ready on Friday',
        ],
      },
      {
        id: 'qm-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'aim',
        definition: 'What you are trying to do.',
        distractors: [
          'A kind of book',
          'A school bell',
        ],
      },
    ],
    glossary: [
      {
        word: 'argue',
        definition: 'To speak angrily about something you disagree on.',
        pages: [1],
      },
      {
        word: 'aim',
        definition: 'What you are trying to do.',
        pages: [2],
      },
      {
        word: 'plan',
        definition: 'A way of doing something that you think about first.',
        pages: [3],
      },
      {
        word: 'shelf',
        definition: 'A flat board fixed to a wall for holding things.',
        pages: [4],
      },
      {
        word: 'cosy',
        definition: 'Warm and comfortable.',
        pages: [2],
      },
    ],
    culturalNotes: [
      'Big idea: A small team with a clear aim and simple rules can often work faster than a large group, as long as others are given real ways to help. The idea is explored further in “Skunk Works” by Ben R. Rich and Leo Janos (1994), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'The story shows the rest of the class helping and sharing the corner.',
    ],
    reviewQuestions: [
      'Check that building with old boxes and planks is safe for children with adult help.',
      'Check the sum: 20 + 5 = 25.',
    ],
    guide: {
      overview:
        'A story about a small team with a clear aim making a reading corner.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Explain why a small team worked better.',
        'Make a plan for a small job.',
      ],
      subjects: [
        ['English Language (NaCCA CCP primary: reading and libraries; codes to verify)', 'A reading corner'],
        ['Creative Arts (NaCCA CCP primary: making and design; codes to verify)', 'Making a shelf and labels'],
      ],
      before: ['Ask: what happens when too many people talk at once?'],
      during: ['Stop after Page 2. Ask: how can the other pupils help?'],
      after: ['Pupils plan a small project with a team of four and a clear aim.'],
      discussion: ['Was it fair for only four to build it? What made it fair?'],
      reflection: ['When did too many voices slow your group down?'],
      maths: [
        {
          task: 'The corner has 20 books, and 5 more come from pupils. How many books are there?',
          answer: '20 + 5 = 25.',
        },
      ],
      support: ['Write the aim on a card for the team.'],
      stretch: ['Draw the reading corner and label each part.'],
      localise: ['What books do children in your community like?'],
      factCheck: ['The story is fiction. The book’s title, authors, and year are given from general knowledge.'],
    },
  }),

  // 6
  mk({
    key: 'kid-the-bead-game',
    title: 'The Bead Game',
    summary:
      'A class plays a game with big and small beads and a sieve. It helps them understand why mosquito medicine can stop working. A story that teaches how living things can change over many generations.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'science', 'health', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Clear, playful, and steady',
    palette: ['#15803d', '#a16207'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Mr Ansah: a cheerful science teacher in Basic 6.',
      'Efe: a curious girl who asks why.',
      'Kofi: a boy who likes to shake the sieve.',
    ],
    music: 'Gentle night sounds with soft marimba (placeholder)',
    pages: [
      pg(
        '🦟',
        'Mr Ansah told the class, “A health team sprayed medicine against mosquitoes. It worked well the first year. But a few years later, it did not work as well. Why?” Efe put up her hand. “Perhaps the mosquitoes got used to it?” Mr Ansah smiled. “Let us play a game to find out.”',
        'A teacher at the front of a class with a drawing of a mosquito on the board.'
      ),
      pg(
        '🔵',
        'He gave each group a bowl with fifty beads: forty-five big beads and five small beads. “The big beads are mosquitoes that the medicine can kill. The small beads are a few tougher mosquitoes that can survive it. Not all mosquitoes are exactly alike.” Efe looked closely. “Like children in a class, who are all a bit different.”',
        'A bowl of big and small beads on a desk while children look closely.'
      ),
      pg(
        '🫗',
        '“Now spray the medicine,” said Mr Ansah. “Use the sieve.” Kofi shook the beads through a sieve. The big beads were held back. These were the mosquitoes that died. Only the small beads fell through. Five survived. “Count them,” said Mr Ansah. “Five out of fifty.”',
        'A boy shaking beads through a sieve while the small ones fall into a bowl.'
      ),
      pg(
        '➕',
        '“Now the survivors have babies, a new generation,” said Mr Ansah. “Each survivor makes ten babies, and each baby is a small bead too, like its parent.” The class added forty-five new small beads to the bowl. Now there were fifty small beads! “Spray again!” Kofi shook the sieve, and almost all the beads fell through.',
        'A bowl full of small beads being shaken through a sieve.'
      ),
      pg(
        '💡',
        '“So what happened?” asked Mr Ansah. Efe answered, “The medicine killed the weak ones. The tougher ones lived and had babies. Next time, more of the mosquitoes were tough.” “Yes,” said Mr Ansah. “Nobody planned it. It is something that can happen in living things over many seasons, and we can see it in mosquitoes.”',
        'A girl explaining at the board while the teacher nods.'
      ),
      pg(
        '🛏️',
        '“So what should we do?” Mr Ansah asked. The class answered together: “Sleep under a net every night. Follow the health worker’s advice. Take medicine exactly as we are told, and finish it. Never share it.” Mr Ansah smiled. “And families may have different beliefs about where living things came from. This game only shows what we can see in a few seasons.”',
        'Children listing health rules on the board beside a bed net.'
      ),
    ],
    activities: [
      {
        id: 'qn-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What did the big beads stand for in the game?',
        options: [
          'Mosquitoes the medicine can kill',
          'Tougher mosquitoes',
          'Eggs',
        ],
        correctIndex: 0,
      },
      {
        id: 'qn-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did the sieve show?',
        options: [
          'Only the small beads fell through, so the tougher mosquitoes survived',
          'All beads fell through',
          'None fell through',
        ],
        correctIndex: 0,
      },
      {
        id: 'qn-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What happened to the mosquitoes over time?',
        options: [
          'More of them were tough to the medicine',
          'They disappeared',
          'They became bigger',
        ],
        correctIndex: 0,
      },
      {
        id: 'qn-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: What is a sensible health habit from the story?',
        options: [
          'Sleep under a net every night and follow health advice',
          'Share medicine',
          'Stop medicine early',
        ],
        correctIndex: 0,
      },
      {
        id: 'qn-s1',
        type: 'sequencing',
        prompt: 'Put the game in order.',
        items: [
          'The teacher asks why the medicine stopped working',
          'The class mixes big and small beads',
          'The sieve lets only the small beads through',
          'The survivors make babies and the next spray fails',
        ],
      },
      {
        id: 'qn-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'survive',
        definition: 'To stay alive.',
        distractors: [
          'To sleep',
          'To count',
        ],
      },
    ],
    glossary: [
      {
        word: 'medicine',
        definition: 'A substance used to treat or prevent illness.',
        pages: [1],
      },
      {
        word: 'mosquitoes',
        definition: 'Small flying insects that bite.',
        pages: [1],
      },
      {
        word: 'sieve',
        definition: 'A tool with small holes for separating things.',
        pages: [3],
      },
      {
        word: 'survive',
        definition: 'To stay alive.',
        pages: [2],
      },
      {
        word: 'generation',
        definition: 'All the young born at about the same time.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'Big idea: Living things differ a little, and when something kills the weaker ones, the tougher ones breed, so over many seasons more of them are tough. The idea is explored further in “The Beak of the Finch” by Jonathan Weiner (1994), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'Respect: families hold different beliefs about origins. The story says so and describes only what can be seen in a few seasons. The health advice must be confirmed by a health worker.',
    ],
    reviewQuestions: [
      'Ask a health worker to confirm the bed-net and medicine advice.',
      'Check that the game is simple enough to run in class.',
    ],
    guide: {
      overview:
        'A classroom game that shows how mosquitoes can become less affected by a medicine, with safe health habits.',
      lessonMinutes: 30,
      goals: [
        'Retell the game in order.',
        'Explain why the medicine stopped working so well.',
        'List safe health habits.',
      ],
      subjects: [
        ['Science (NaCCA CCP primary: living things and health; codes to verify)', 'Mosquitoes and health'],
        ['Mathematics (NaCCA CCP primary: fractions and percentages; codes to verify)', 'Counting beads'],
      ],
      before: ['Ask: how does your family protect itself from mosquitoes?'],
      during: ['Stop after Page 3. Ask: what will happen to the survivors?'],
      after: ['Pupils play the bead game in groups with a sieve.'],
      discussion: ['Why is it important to finish medicine as the health worker says?'],
      reflection: ['What health habit could your family improve?'],
      maths: [
        {
          task: 'In the game, 5 of 50 beads were small. What fraction and percentage is that?',
          answer: '5/50 = 1/10, or 10 per cent.',
        },
      ],
      support: ['Use two sizes of beads and a kitchen sieve.'],
      stretch: ['Find out how malaria spreads and how nets help.'],
      localise: ['How do health workers in your community teach about nets?'],
      factCheck: ['The mosquito description is simplified. Health advice must be confirmed by a health worker. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 7
  mk({
    key: 'kid-the-day-the-big-screen-went-dark',
    title: 'The Day the Big Screen Went Dark',
    summary:
      'A big screen in the village square shows cartoons all day. Nobody plays or listens to Grandma’s stories any more. Then the generator breaks. A story about too much comfort and distraction.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'balance', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Light, gentle, and thoughtful',
    palette: ['#7c3aed', '#16a34a'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Selina: a thoughtful girl in Basic 5 who loves Grandma’s stories.',
      'Grandma Esi: a gentle storyteller.',
      'Fiifi: Selina’s friend, who loves cartoons.',
      'The village chief: a kind man who wants everyone to be happy.',
    ],
    music: 'Cheerful cartoon-like tune fading into a calm drum and flute (placeholder)',
    pages: [
      pg(
        '📺',
        'A kind visitor gave the village a big screen for the square. It showed cartoons, songs, and games all day long. The children cheered. “We will never be bored again!” said Fiifi. Soon, everybody sat in the square, watching. Nobody played ball. Nobody skipped. Nobody went to Grandma Esi’s evening stories.',
        'Children sitting in a village square watching a big screen.'
      ),
      pg(
        '🌙',
        'Selina missed the games. She missed Grandma Esi, the best storyteller in the village, and her stories, too. One evening, she sat beside her grandmother, alone. “Nobody comes any more,” said Grandma Esi, smiling softly. Selina felt something heavy in her tummy. “The screen is fun,” she thought. “But it has taken something away.”',
        'A girl and her grandmother alone under a tree at dusk.'
      ),
      pg(
        '⚡',
        'Then one afternoon, the generator that powered the screen made a loud bang and went quiet. The big screen went dark. The children groaned. “What shall we do?” said Fiifi. For a while they sat and sulked. Nobody knew what to do without the screen. They felt restless and cross.',
        'Children sitting in front of a dark screen looking restless.'
      ),
      pg(
        '🪁',
        'Then Selina had an idea. “Let us make a game!” She picked up a stick and drew a big grid in the sand. Soon the children were playing a hopping game. Someone found a ball. Someone started to drum on a bucket. In an hour, the square was full of laughter, running, and singing.',
        'Children playing games, drumming, and running in the village square.'
      ),
      pg(
        '🔥',
        'That evening, the children went to Grandma Esi’s tree. She told them a story about a clever hare. “I forgot how much I love this,” said Fiifi. When the generator was fixed, the chief said, “Let the screen be on for one hour each evening. The rest of the time, we will play, work, and listen.”',
        'Children sitting in a circle around Grandma Esi under a tree at night.'
      ),
      pg(
        '💡',
        'Selina told her friends, “Comfort and fun are good. But when they fill every minute, we may lose things we love, like games, stories, and friends.” Try it! What screen or fun thing do you use a lot? What could you do instead for one hour this week?',
        'A girl smiling beside her grandmother with children playing in the background.'
      ),
    ],
    activities: [
      {
        id: 'qo-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did the visitor give the village?',
        options: [
          'A big screen for the square',
          'A new school',
          'A football pitch',
        ],
        correctIndex: 0,
      },
      {
        id: 'qo-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What happened to the generator?',
        options: [
          'It made a bang and went quiet',
          'It ran forever',
          'It was sold',
        ],
        correctIndex: 0,
      },
      {
        id: 'qo-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What did the children do when the screen went dark?',
        options: [
          'They made games, drummed, and played',
          'They cried all day',
          'They went to sleep',
        ],
        correctIndex: 0,
      },
      {
        id: 'qo-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: You spend every evening on a phone. What could you do?',
        options: [
          'Nothing',
          'Set a time limit and play, read, or talk with family too',
          'Throw the phone away',
        ],
        correctIndex: 1,
      },
      {
        id: 'qo-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'A big screen comes to the village',
          'Children stop playing and listening to stories',
          'The generator breaks and the screen goes dark',
          'The children make games and return to Grandma’s stories',
          'The village agrees on one hour of screen each evening',
        ],
      },
      {
        id: 'qo-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'restless',
        definition: 'Unable to stay still or calm.',
        distractors: [
          'Very sleepy',
          'Very happy',
        ],
      },
    ],
    glossary: [
      {
        word: 'square',
        definition: 'An open space in the middle of a village or town.',
        pages: [1],
      },
      {
        word: 'generator',
        definition: 'A machine that makes electricity.',
        pages: [3],
      },
      {
        word: 'restless',
        definition: 'Unable to stay still or calm.',
        pages: [3],
      },
      {
        word: 'comfort',
        definition: 'A state of being relaxed and free from worry.',
        pages: [6],
      },
      {
        word: 'storyteller',
        definition: 'A person who tells stories.',
        pages: [2],
      },
    ],
    culturalNotes: [
      'Big idea: When comfort and fun fill every moment, we can lose attention, play, and people; choose with open eyes. The idea is explored further in “Brave New World” by Aldous Huxley (1932), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'This is a fresh story set in Ghana. It does not retell the novel, and it does not say screens are bad; the village keeps the screen for one hour a day.',
    ],
    reviewQuestions: [
      'Check that the story balances the benefits of screens with its warning.',
      'Check that the village setting is not mistaken for a real place.',
    ],
    guide: {
      overview:
        'A story about a village that finds a balance between screen time and play, stories, and friends.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Explain what the village lost when the screen filled the day.',
        'Plan a balanced day.',
      ],
      subjects: [
        ['Computing (NaCCA CCP primary: using screens in a healthy way; codes to verify)', 'Balance with technology'],
        ['Our World Our People (NaCCA CCP primary: family and community life; codes to verify)', 'Stories and play'],
      ],
      before: ['Ask: how many hours do you think you spend on screens in a day?'],
      during: ['Stop after Page 2. Ask: what is the village losing?'],
      after: ['Pupils plan a day with screen time, play, chores, and rest.'],
      discussion: ['Why was the screen fun and also a problem?'],
      reflection: ['What would you do if the screen went dark for a day?'],
      maths: [
        {
          task: 'If the screen is on one hour each evening, how many hours is that in a week?',
          answer: '1 × 7 = 7 hours.',
        },
      ],
      support: ['Draw a day plan with four colours.'],
      stretch: ['Ask an elder what games they played as a child.'],
      localise: ['What games and stories are shared in your community?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge, and nothing from the novel is retold.'],
    },
  }),
];

export const BATCH_57_BIG_IDEAS_JUNIOR = BATCH_57_STORIES;
