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
 * Batch 58 (4 original Big Ideas stories and articles for Basic 4 to Basic 6, six short pages each, with activities).
 * Each article is linked to Social Studies, Career Technology, Science, or Computing (see the first cultural note and the teacher guide).
 * These are original stories and articles, each teaching one idea from a well-known book. Stories list their characters; articles have none.
 * Original text written for Ghanaian learners; each factCheck note names the book behind the idea and what to verify.
 */

export const BATCH_58_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'kid-the-boy-who-asked-why-the-pot-boils',
    title: 'Why Does the Hot Pot Rattle?',
    summary:
      'Kojo’s grandmother says a spirit makes the pot lid rattle. Kojo tests her idea and one of his own, and learns what makes a good explanation. A gentle story about asking “how do you know?”',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'science', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Curious, warm, and clear',
    palette: ['#b45309', '#0369a1'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Kojo: a curious boy in Basic 5.',
      'Grandma Akua: a loving cook who tells old tales.',
      'Mrs Boateng: the science teacher.',
    ],
    music: 'Soft kitchen sounds with a gentle flute (placeholder)',
    pages: [
      pg(
        '🍲',
        'Grandma Akua was cooking soup. The lid on the pot began to rattle, rattle, rattle! “That is a little spirit shaking the lid,” she said with a smile. Kojo watched. “Grandma, why does it only rattle when the soup is hot?” Grandma laughed. “Spirits like warm places.” Kojo was not sure. He wanted a better explanation.',
        'A boy watching a rattling pot lid on a fire while his grandmother smiles.'
      ),
      pg(
        '🔬',
        'At school, Kojo told Mrs Boateng. “Let us test it,” she said. “A good explanation must tell us what to expect. If the spirit likes warm places, what should happen when the pot is cold, or when it is very hot?” Kojo thought. “The spirit explanation does not say. It would fit anything.”',
        'A teacher and a boy beside a table with a small pot and a lid.'
      ),
      pg(
        '♨️',
        'Mrs Boateng gave a new idea. “When water gets hot, it turns into steam, and steam needs more room. Steam pushes up against the lid. The lid lifts a little, steam escapes, and the lid drops again. It happens again and again. That is the rattle.” Kojo nodded. “So more heat means more steam, and more rattling!”',
        'A drawing of steam pushing a pot lid up and down.'
      ),
      pg(
        '🧪',
        'They tested it with a small pot on a safe stove, with Mrs Boateng at the stove. With a little heat, the lid rattled slowly. With more heat, it rattled fast. With the flame off, it stopped. When they put a heavy stone on the lid, the rattling was weak. “Every part of the explanation does a job,” said Mrs Boateng. “And it told us what to expect.”',
        'A teacher and children watching a small pot rattle on a stove.'
      ),
      pg(
        '🏠',
        'Kojo told his grandmother, “The steam pushes the lid, Grandma.” She listened closely. “That is clever,” she said. “But I still like my spirit story. It is part of how we tell our children about the kitchen.” Kojo smiled. “It is a lovely story, Grandma. And now I also know how the pot works.”',
        'A boy sharing his idea with his grandmother in a warm kitchen.'
      ),
      pg(
        '💡',
        'Kojo wrote: “A good explanation says what to expect, and each part has a job.” Try it! Think of something you wonder about, like why the harmattan is dry. What explanation could you test? Always ask an adult to help with fire or hot water.',
        'A boy writing in a notebook beside a pot, with an adult nearby.'
      ),
    ],
    activities: [
      {
        id: 'qp-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did Grandma Akua say made the lid rattle?',
        options: [
          'A little spirit',
          'The wind',
          'A mouse',
        ],
        correctIndex: 0,
      },
      {
        id: 'qp-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What does hot water turn into?',
        options: [
          'Steam',
          'Ice',
          'Sand',
        ],
        correctIndex: 0,
      },
      {
        id: 'qp-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What happened when they turned the flame off?',
        options: [
          'The rattling stopped',
          'The rattling got louder',
          'The pot broke',
        ],
        correctIndex: 0,
      },
      {
        id: 'qp-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: Why is a good explanation helpful?',
        options: [
          'It tells us what to expect and can be tested',
          'It is long',
          'It is loud',
        ],
        correctIndex: 0,
      },
      {
        id: 'qp-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'The lid rattles and Grandma tells a spirit tale',
          'Kojo asks Mrs Boateng',
          'She explains steam pushing the lid',
          'They test it safely',
          'Kojo shares it kindly with Grandma',
        ],
      },
      {
        id: 'qp-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'steam',
        definition: 'Hot water in the form of a gas.',
        distractors: [
          'Cold ice',
          'Dry dust',
        ],
      },
    ],
    glossary: [
      {
        word: 'rattle',
        definition: 'To make quick, short knocking sounds.',
        pages: [1],
      },
      {
        word: 'explanation',
        definition: 'A reason that tells why something happens.',
        pages: [2],
      },
      {
        word: 'steam',
        definition: 'Hot water in the form of a gas.',
        pages: [3],
      },
      {
        word: 'expect',
        definition: 'To think something will happen.',
        pages: [4],
      },
      {
        word: 'test',
        definition: 'To try something to see how it works.',
        pages: [2, 6],
      },
    ],
    culturalNotes: [
      'Big idea: A good explanation is hard to change: each part does a job, and it tells us what to expect. The idea is explored further in “The Beginning of Infinity” by David Deutsch (2011), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'The story treats Grandma’s tale with respect as a family story while teaching a testable explanation. Fire and hot water need adult supervision.',
    ],
    reviewQuestions: [
      'Check the steam explanation is simple and correct.',
      'Check that an adult is at the stove in the test.',
    ],
    guide: {
      overview:
        'A story about testing a good explanation for a rattling pot lid.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Say what makes an explanation good.',
        'Show respect for family stories.',
      ],
      subjects: [
        ['Science (NaCCA CCP primary: heat and states of matter; codes to verify)', 'Water and steam'],
        ['Our World Our People (NaCCA CCP primary: family traditions; codes to verify)', 'Respecting family stories'],
      ],
      before: ['Ask: have you heard a tale that explains something?'],
      during: ['Stop after Page 2. Ask: how could we test it?'],
      after: ['A teacher shows a covered pot on a stove while pupils watch from a distance.'],
      discussion: ['Why did Kojo still enjoy Grandma’s story?'],
      reflection: ['What is something you wonder about?'],
      maths: [
        {
          task: 'The pot rattled 12 times in a minute. How many times in 5 minutes if it stays the same?',
          answer: '12 × 5 = 60.',
        },
      ],
      support: ['Draw the steam pushing the lid.'],
      stretch: ['Write what to expect if the pot is heavier.'],
      localise: ['Which stories do elders tell about weather or fire?'],
      factCheck: ['The steam explanation is simplified. Heat tests must be done by a teacher. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 2
  mk({
    key: 'kid-the-shelf-in-three-days',
    title: 'The Shelf in Three Days',
    summary:
      'Efua says she can finish a bookshelf in three days. It takes ten. A story about why we guess too short, and how to plan better.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'planning', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Light, honest, and encouraging',
    palette: ['#0f766e', '#d97706'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Efua: a cheerful girl in Basic 6 who loves making things.',
      'Papa Kweku: her father, a carpenter.',
      'Nana: her older cousin who plans well.',
    ],
    music: 'Light highlife with a hammer tap beat (placeholder)',
    pages: [
      pg(
        '🪚',
        'Efua wanted to make a bookshelf for her room. “I will finish it in three days!” she told her father. Papa Kweku, a carpenter, smiled. “Three days? Let us see.” Efua pictured it all going well: cutting the wood, nailing it, painting it. “It is easy,” she said proudly.',
        'A girl proudly showing a drawing of a bookshelf to her father.'
      ),
      pg(
        '🐢',
        'But on the first day, she could not find the right nails. On the second day, a plank was too short and she had to buy another. Then it rained, and the paint could not dry. On the third day, the shelf had no sides. Efua felt shy and a little sad. “I thought it would take three days,” she said.',
        'A girl looking sadly at an unfinished shelf in the rain.'
      ),
      pg(
        '📋',
        'Her cousin Nana visited. “I did the same thing with my wardrobe,” she laughed. “Here is a trick. Think of jobs like this that other people did. How long did they really take?” Papa Kweku said, “My shelves usually take a week.” Nana added, “And add a few extra days for rain and surprises.”',
        'Two cousins and a father talking beside a workbench.'
      ),
      pg(
        '📅',
        'Efua made a new plan. She wrote each step: buy wood, cut, nail, sand, paint, dry. She gave each step more time than she thought, and she added three spare days. “Ten days,” she wrote. Papa Kweku smiled. “That is a plan I trust.” Each day she did one step and ticked it in her notebook.',
        'A girl writing a plan with ticks in a notebook.'
      ),
      pg(
        '🎉',
        'On the tenth day, the shelf was finished! It was a little crooked, but it was Efua’s own. She filled it with her books. There was no hurry, no worry, and no sad face. “It took longer,” she said, “but this time I knew it would.” Papa Kweku hugged her.',
        'A girl placing books on a finished wooden shelf.'
      ),
      pg(
        '💡',
        'Efua wrote: “We often guess too short because we picture everything going well. Look at how long similar jobs really took, and add spare time.” Try it! Think of a job you must do, like homework. How long did it take last time? Plan for that, and add a little more.',
        'A girl and her father smiling beside the finished shelf.'
      ),
    ],
    activities: [
      {
        id: 'qq-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'How long did Efua say the shelf would take?',
        options: [
          'Three days',
          'One day',
          'A month',
        ],
        correctIndex: 0,
      },
      {
        id: 'qq-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What went wrong on the first two days?',
        options: [
          'No nails, a short plank, and rain',
          'Nothing',
          'The shelf fell',
        ],
        correctIndex: 0,
      },
      {
        id: 'qq-c3',
        type: 'comprehension',
        afterPage: 3,
        question: 'What trick did Nana share?',
        options: [
          'Look at how long similar jobs really took',
          'Work faster',
          'Never plan',
        ],
        correctIndex: 0,
      },
      {
        id: 'qq-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: You think your project takes one hour. Last time it took two. What should you plan?',
        options: [
          'One hour',
          'About two hours, plus a little extra',
          'Ten minutes',
        ],
        correctIndex: 1,
      },
      {
        id: 'qq-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'Efua says three days',
          'Problems make it take longer',
          'Nana shares the trick',
          'Efua makes a better plan',
          'The shelf is finished on day ten',
        ],
      },
      {
        id: 'qq-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'spare',
        definition: 'Extra, kept in case it is needed.',
        distractors: [
          'Broken',
          'Heavy',
        ],
      },
    ],
    glossary: [
      {
        word: 'carpenter',
        definition: 'A person who makes things from wood.',
        pages: [1],
      },
      {
        word: 'plank',
        definition: 'A long flat piece of wood.',
        pages: [2],
      },
      {
        word: 'plan',
        definition: 'A list of steps for doing something.',
        pages: [4],
      },
      {
        word: 'spare',
        definition: 'Extra, kept in case it is needed.',
        pages: [4],
      },
      {
        word: 'crooked',
        definition: 'Not straight.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Big idea: We often guess too little time because we picture everything going well; use how long similar jobs took and add spare time. The idea is explored further in “Thinking, Fast and Slow” by Daniel Kahneman (2011), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'Safety: tools such as saws and hammers should be used with an adult. The story shows the father nearby.',
    ],
    reviewQuestions: [
      'Check that tool use is shown with an adult.',
      'Check the sum: 7 + 3 = 10.',
    ],
    guide: {
      overview:
        'A story about planning jobs with realistic time.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Explain why Efua guessed too short.',
        'Make a realistic plan.',
      ],
      subjects: [
        ['Mathematics (NaCCA CCP primary: time and days; codes to verify)', 'Planning time'],
        ['Creative Arts (NaCCA CCP primary: making things; codes to verify)', 'Making a shelf'],
      ],
      before: ['Ask: have you ever said a job would be quick and it was not?'],
      during: ['Stop after Page 2. Ask: why did it take longer?'],
      after: ['Pupils plan a small job with steps and spare time.'],
      discussion: ['Why is it good to add spare time?'],
      reflection: ['What job takes you longer than you guess?'],
      maths: [
        {
          task: 'Efua planned 7 working days plus 3 spare days. How many days in all?',
          answer: '7 + 3 = 10.',
        },
      ],
      support: ['Provide a step list with blanks for time.'],
      stretch: ['Plan a school event with spare time.'],
      localise: ['What do carpenters near you say about making furniture?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 3
  mk({
    key: 'kid-the-radio-for-the-street',
    title: 'The Little Radio Show',
    summary:
      'Yaa wants to start a radio show for the whole town. Her teacher says to start small. She tests a tiny show for her street, listens to feedback, and changes her plan.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'enterprise', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Bright, clear, and encouraging',
    palette: ['#6d28d9', '#0d9488'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Yaa: a creative girl in Basic 6.',
      'Mr Quaye: her teacher.',
      'Auntie Dede: a neighbour who gives honest feedback.',
    ],
    music: 'Upbeat highlife with a soft radio tuning sound (placeholder)',
    pages: [
      pg(
        '📻',
        'Yaa dreamed of a radio show for the whole town. “I will talk about news, music, and stories,” she said. Mr Quaye listened. “That is a big dream. But a big plan can fail in a big way. Why not start small? Try a tiny show for your own street, and see what people say.”',
        'A girl and her teacher talking beside an old radio.'
      ),
      pg(
        '🎙️',
        'Yaa made a small show with her mother’s phone. It was five minutes: one song, one story, and one tip. She played it from a speaker on the veranda for her street. Ten neighbours came. When it finished, Yaa asked them, “Please give me your feedback. What did you like? What did you not like?”',
        'A girl with a phone and speaker on a veranda while neighbours listen.'
      ),
      pg(
        '📝',
        'Auntie Dede gave her feedback. “I liked the story, but I did not hear the tip. The speaker was too soft.” An old man said, “Please speak slowly.” Yaa wrote down everything. She had thought people wanted news, but most of them said, “More stories, please!” She was surprised, and a little sad.',
        'A girl writing in a notebook while neighbours give advice.'
      ),
      pg(
        '🔄',
        'Yaa changed her plan. She kept her goal, which was to share useful things with her community, but she changed her method. She made the speaker louder, spoke more slowly, and made the show all about stories. The next week, twenty neighbours came. By the third week, there were thirty.',
        'A girl speaking into a phone while thirty neighbours listen.'
      ),
      pg(
        '🌟',
        'Now Yaa had proof that people liked her stories. She asked the next street to join. She started small, learned fast, and changed what did not work. Mr Quaye smiled. “That is how good ideas grow, step by step.” Yaa did not need a big radio yet.',
        'A growing crowd of neighbours listening to a girl’s story.'
      ),
      pg(
        '💡',
        'Yaa wrote: “Try a small version first, listen to what happens, and be ready to change how you do it while keeping your goal.” Try it! Think of an idea you have. What small version could you try this week? Who could give honest feedback?',
        'A girl holding her notebook with a smile.'
      ),
    ],
    activities: [
      {
        id: 'qr-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did Mr Quaye suggest?',
        options: [
          'Start with a tiny show for her street',
          'Start with a big radio',
          'Give up',
        ],
        correctIndex: 0,
      },
      {
        id: 'qr-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did most neighbours say they wanted?',
        options: [
          'More stories',
          'More news',
          'Less talking',
        ],
        correctIndex: 0,
      },
      {
        id: 'qr-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What did Yaa change?',
        options: [
          'Her method, not her goal',
          'Her goal, not her method',
          'Nothing',
        ],
        correctIndex: 0,
      },
      {
        id: 'qr-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: You want to sell snacks at school. What small first step could you take?',
        options: [
          'Make a hundred snacks',
          'Make a few, sell them, and ask what people think',
          'Do nothing',
        ],
        correctIndex: 1,
      },
      {
        id: 'qr-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'Yaa dreams of a town radio show',
          'She tries a tiny show for her street',
          'Neighbours give honest feedback',
          'She changes her method and more people come',
        ],
      },
      {
        id: 'qr-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'feedback',
        definition: 'What people say about something to help you improve it.',
        distractors: [
          'A kind of radio',
          'A school prize',
        ],
      },
    ],
    glossary: [
      {
        word: 'dream',
        definition: 'A big wish or hope for the future.',
        pages: [1],
      },
      {
        word: 'veranda',
        definition: 'A covered area along the front of a house.',
        pages: [2],
      },
      {
        word: 'feedback',
        definition: 'What people say to help you improve something.',
        pages: [2, 3],
      },
      {
        word: 'method',
        definition: 'A way of doing something.',
        pages: [4],
      },
      {
        word: 'proof',
        definition: 'Something that shows a thing is true.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Big idea: Try a small version of an idea, learn from what really happens, and change your method while keeping your goal. The idea is explored further in “The Lean Startup” by Eric Ries (2011), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'Safety: the story keeps the show on the family’s own veranda with parents’ knowledge. Remind pupils not to share personal details online.',
    ],
    reviewQuestions: [
      'Check that the family’s phone use is shown as supervised.',
      'Check the sum: 10 + 20 + 30 = 60.',
    ],
    guide: {
      overview:
        'A story about testing a small idea, listening to feedback, and changing the method.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Explain why starting small helps.',
        'Plan a small test of an idea.',
      ],
      subjects: [
        ['English Language (NaCCA CCP primary: speaking and listening; codes to verify)', 'Speaking to an audience'],
        ['Our World Our People (NaCCA CCP primary: enterprise; codes to verify)', 'Starting small'],
      ],
      before: ['Ask: what idea would you like to try?'],
      during: ['Stop after Page 3. Ask: what would you change?'],
      after: ['Pupils plan a small test with three feedback questions.'],
      discussion: ['Why did Yaa keep her goal but change her method?'],
      reflection: ['What small step can you try this week?'],
      maths: [
        {
          task: 'Ten neighbours came on week one, twenty on week two, and thirty on week three. How many came in total?',
          answer: '10 + 20 + 30 = 60.',
        },
      ],
      support: ['Give three feedback questions to copy.'],
      stretch: ['Design a feedback form with three questions.'],
      localise: ['What local radio shows do you enjoy?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 4
  mk({
    key: 'kid-the-bread-on-one-lane',
    title: 'The Bread on One Lane',
    summary:
      'Maame Ruth wants to sell bread to the whole town. Her son suggests starting with one lane and serving it perfectly. A story about starting small and growing step by step.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'enterprise', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Warm, calm, and encouraging',
    palette: ['#b45309', '#15803d'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Maame Ruth: a baker with a small oven.',
      'Fiifi: her son in Basic 6, good with numbers.',
      'Auntie Mercy: a neighbour who loves fresh bread.',
    ],
    music: 'Warm marimba with a morning market feel (placeholder)',
    pages: [
      pg(
        '🍞',
        'Maame Ruth baked bread in a small oven behind her house. “One day, I will sell bread to the whole town,” she said. She carried forty loaves to the main road, but people there already had their favourite bakers. By the evening, she sold only eight. She came home tired and sad.',
        'A tired woman carrying bread in a basket along a busy road.'
      ),
      pg(
        '💭',
        'Her son Fiifi had an idea. “Mama, what if we start with just one lane, our own lane? There are twenty houses. Everyone knows you. We can serve them all, and serve them very well.” Maame Ruth thought. “One small lane is not much.” Fiifi smiled. “But it is a start.”',
        'A boy sketching a map of a lane with twenty houses.'
      ),
      pg(
        '🚪',
        'Fiifi made a list of the twenty houses and asked each family, “Do you want bread in the morning? How many loaves?” Fifteen families said yes. Every morning at six, Maame Ruth baked and Fiifi delivered, on foot, before school. The bread was always fresh and warm. They remembered each family’s favourite size.',
        'A boy delivering warm bread to a doorstep at sunrise.'
      ),
      pg(
        '😊',
        'Soon every house in the lane bought bread from them. Auntie Mercy told her cousin on the next lane. “The best bread, and it comes to your door!” Maame Ruth’s sales grew because she did not try to please everyone at once. She pleased one lane completely, and the lane told others.',
        'A neighbour telling another woman about the bread.'
      ),
      pg(
        '📈',
        'After three months, two more lanes asked for bread. Maame Ruth hired a helper and bought a bigger oven with her savings. She did not rush. She added one lane at a time and kept every customer happy. Soon, many lanes in the town were buying her bread, and it all began with twenty houses.',
        'A bakery with a bigger oven and a helper delivering bread to several lanes.'
      ),
      pg(
        '💡',
        'Fiifi wrote: “Do not try to serve everybody at once. Serve a small group very well. Then you have a strong start to grow from.” Try it! What could you offer to a small group, like your own class or lane, and do very well?',
        'A boy and his mother smiling beside the bread basket.'
      ),
    ],
    activities: [
      {
        id: 'qs-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'How many loaves did Maame Ruth sell on the main road?',
        options: [
          'Eight',
          'Forty',
          'None',
        ],
        correctIndex: 0,
      },
      {
        id: 'qs-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What did Fiifi suggest?',
        options: [
          'Start with just one lane',
          'Sell to the whole town',
          'Stop baking',
        ],
        correctIndex: 0,
      },
      {
        id: 'qs-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did the bread sales grow?',
        options: [
          'One lane was pleased and told others',
          'Bread was free',
          'She sold less',
        ],
        correctIndex: 0,
      },
      {
        id: 'qs-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: You want to offer homework help. What is a good start?',
        options: [
          'Help the whole school',
          'Help a few classmates very well first',
          'Wait a year',
        ],
        correctIndex: 1,
      },
      {
        id: 'qs-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'Maame Ruth sells only eight loaves on the road',
          'Fiifi suggests one lane',
          'Families in the lane buy every morning',
          'Others hear about the bread',
          'More lanes join',
        ],
      },
      {
        id: 'qs-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'lane',
        definition: 'A narrow road or path between houses.',
        distractors: [
          'A kind of oven',
          'A type of bread',
        ],
      },
    ],
    glossary: [
      {
        word: 'oven',
        definition: 'A closed box for baking food.',
        pages: [1],
      },
      {
        word: 'lane',
        definition: 'A narrow road or path between houses.',
        pages: [2],
      },
      {
        word: 'delivered',
        definition: 'Brought something to someone.',
        pages: [3],
      },
      {
        word: 'favourite',
        definition: 'Liked best.',
        pages: [3],
      },
      {
        word: 'savings',
        definition: 'Money kept to use later.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Big idea: Start by serving a small group completely, then grow from that base. The idea is explored further in “Zero to One” by Peter Thiel with Blake Masters (2014), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'Safety: the story has Fiifi deliver only on their own lane in daylight and near home.',
    ],
    reviewQuestions: [
      'Check that delivery by a child is on the home lane only.',
      'Check the sum: 15 × 2 = 30.',
    ],
    guide: {
      overview:
        'A story about starting with one lane and growing step by step.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Explain why one lane was a good start.',
        'Plan a small start for an idea.',
      ],
      subjects: [
        ['Our World Our People (NaCCA CCP primary: work and enterprise; codes to verify)', 'Starting small'],
        ['Mathematics (NaCCA CCP primary: multiplication; codes to verify)', 'Counting loaves'],
      ],
      before: ['Ask: who sells things near your home?'],
      during: ['Stop after Page 2. Ask: why might one lane be easier?'],
      after: ['Pupils plan a small start for a class business idea.'],
      discussion: ['Why did people tell others about the bread?'],
      reflection: ['What could you do really well for a small group?'],
      maths: [
        {
          task: 'Fifteen families buy two loaves each morning. How many loaves is that?',
          answer: '15 × 2 = 30.',
        },
      ],
      support: ['Draw the lane and mark the twenty houses.'],
      stretch: ['Work out the loaves for 20 families.'],
      localise: ['Who bakes or sells food in your lane?'],
      factCheck: ['The story is fiction. The book’s title, authors, and year are given from general knowledge.'],
    },
  }),
];

export const BATCH_58_BIG_IDEAS_JUNIOR = BATCH_58_STORIES;
