import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (
  motif: string,
  text: string,
  alt: string,
  narration = 'Warm storyteller’s voice suited for JHS learners; pause briefly at each turn of the story and before the ending.'
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
      'Is the language right for the stated JHS age band (Basic 7 to Basic 9) and BECE conceptual level?',
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
 * Batch 52 (7 original Life Lessons stories and articles, six pages each, with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to Social Studies, Career Technology, Science, or Computing (see the first cultural note and the teacher guide).
 * These are original stories and articles, each teaching one idea from a well-known book. Stories list their characters; articles have none.
 * Original text written for Ghanaian learners; each factCheck note names the book behind the idea and what to verify.
 */

export const BATCH_52_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'it-is-not-my-fault',
    title: 'It Is Not My Fault',
    summary:
      'Kwesi has an excuse for everything: the trotro, the rain, the teacher. One lesson with two circles on the board changes how he sees his own power. A story about taking charge of what you can.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'responsibility', 'school-life', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Light, then thoughtful',
    palette: ['#0369a1', '#ca8a04'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kwesi: a JHS 2 boy, friendly and always ready with an excuse.',
      'Ama: his classmate, honest and kind.',
      'Mr Amoah: the class teacher, patient and fond of drawing on the board.',
      'Maame: Kwesi’s mother, a seamstress who gets up early.',
    ],
    music: 'Cheerful guitar with a steady beat (placeholder)',
    pages: [
      pg(
        '⏰',
        '“It is not my fault,” said Kwesi, arriving late for the third time that week. “The trotro was slow, the road was full, and my little sister took too long to dress.” The class laughed, because Kwesi’s excuses were famous. Yesterday it had been the rain. Last week it was a goat on the road. Kwesi was not a bad boy. He was cheerful and clever. But he believed that everything that went wrong happened to him from outside, like weather, and that nothing could be done about it.',
        'A boy running into a classroom as the bell rings, holding up his hands in excuse.'
      ),
      pg(
        '📝',
        'On Friday there was a mathematics quiz, and Kwesi scored four out of twenty. “The questions were unfair,” he told his friend Ama. “And Mr Amoah does not like me.” Ama put down her pencil. “Kwesi, can I ask you something? Did you revise?” He looked at his shoes. “A little.” “How much is a little?” He did not answer. Ama did not shout or laugh at him. She only said, “I am asking because I think you can do better, and I do not want you to keep blaming everybody else.”',
        'Two pupils on a bench, one holding a test paper while the other speaks gently.'
      ),
      pg(
        '⭕',
        'That afternoon Mr Amoah drew two circles on the board, one big and one small. In the big circle he wrote: rain, traffic, other people’s moods, the price of things. “These are things we cannot control,” he said. In the small circle he wrote: when I wake, what I pack, what I revise, how I answer when things go wrong. “These we can control.” He looked at Kwesi kindly. “Many people spend all their energy on the big circle, complaining and waiting. But the small circle is where your power is. And the more you use it, the larger it grows.”',
        'A teacher at the classroom board pointing to one large chalk circle and one small chalk circle.'
      ),
      pg(
        '🎒',
        'Kwesi decided to try it for one week. On Sunday night he packed his bag and ironed his uniform. He moved his alarm clock across the room so he had to get up to switch it off. He left home fifteen minutes earlier than before. On Tuesday it rained heavily and the trotro was stuck in traffic, just as usual. But Kwesi was already fifteen minutes ahead, and he walked into class on time. The rain was the same, the traffic was the same. The only thing that had changed was what Kwesi had done.',
        'A boy in a raincoat stepping off a trotro and walking into school with a smile as the bell begins.'
      ),
      pg(
        '📚',
        'Next, he turned to mathematics. Every evening, he spent twenty minutes on the topics he found hard. When he did not understand, he wrote down his question and asked Mr Amoah the next day. At the following quiz, he scored twelve out of twenty. It was not perfect, but it was three times better. Mr Amoah smiled. “The word responsibility,” he said, “can be broken into two parts: response and ability. It means having the ability to choose your response. Nobody can take that away from you.”',
        'A boy studying at a table by lamplight, a notebook open beside him.'
      ),
      pg(
        '🌟',
        'Kwesi also learned to put first things first. On school days, homework came before football, and football came afterwards, as a reward. He still enjoyed the game, and he enjoyed it more without the worry. Of course, some things truly are not our fault, such as being ill, or being treated unkindly by someone stronger. Then the right step is to tell a trusted adult and ask for help. But for the many things in our small circle, Kwesi stopped saying “It is not my fault,” and started asking, “What can I do about it?”',
        'A boy finishing homework at a table while his friends wait outside, football under his arm.'
      ),
    ],
    activities: [
      {
        id: 'xa-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did Kwesi believe about the things that went wrong?',
        options: [
          'They happened to him from outside and he could do nothing',
          'They were always his friends’ fault',
          'They never happened',
        ],
        correctIndex: 0,
      },
      {
        id: 'xa-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did the small circle on the board stand for?',
        options: [
          'Things we can control',
          'Things that are small',
          'Things we cannot do',
        ],
        correctIndex: 0,
      },
      {
        id: 'xa-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did Kwesi arrive on time on the rainy Tuesday?',
        options: [
          'The rain stopped',
          'He had left fifteen minutes earlier',
          'The bell rang late',
        ],
        correctIndex: 1,
      },
      {
        id: 'xa-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Your football team lost because the pitch was wet. Using the story, what is in your small circle?',
        options: [
          'The weather',
          'How you prepare, practise, and respond next time',
          'The other team',
        ],
        correctIndex: 1,
      },
      {
        id: 'xa-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Kwesi blames everything for being late',
          'He scores four out of twenty and blames the questions',
          'Mr Amoah draws two circles on the board',
          'Kwesi leaves home earlier and arrives on time in the rain',
          'He revises each evening and improves',
        ],
      },
      {
        id: 'xa-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'responsibility',
        definition: 'The ability to choose your own actions and answer for them.',
        distractors: [
          'A kind of homework',
          'A school bell',
        ],
      },
    ],
    glossary: [
      {
        word: 'excuses',
        definition: 'Reasons given to avoid blame.',
        pages: [1],
      },
      {
        word: 'revise',
        definition: 'To go over work again in order to learn it.',
        pages: [2],
      },
      {
        word: 'control',
        definition: 'To have power over what happens.',
        pages: [3],
      },
      {
        word: 'energy',
        definition: 'The strength and effort to do things.',
        pages: [3],
      },
      {
        word: 'responsibility',
        definition: 'The ability to choose your own actions and answer for them.',
        pages: [5],
      },
      {
        word: 'reward',
        definition: 'Something pleasant given or taken after effort.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Take charge of what you can control and choose your response instead of blaming outside things; put first things first. The idea is explored further in “The 7 Habits of Highly Effective People” by Stephen R. Covey (1989). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story also says that some problems are truly not a child’s fault and that a trusted adult should be told. It must never be read as “everything is your own fault”.',
    ],
    reviewQuestions: [
      'Check that the story does not blame pupils for things beyond their control, such as hardship or unkind treatment.',
      'Check the sums: 12 ÷ 4 = 3; 20 × 5 = 100 minutes.',
    ],
    guide: {
      overview:
        'A school story about moving from excuses to action by focusing on what is within our control.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain the two circles.',
        'Name three things in your own small circle.',
        'Say when it is right to ask an adult for help.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: responsible living and personal development; codes to verify)', 'Taking responsibility'],
        ['Career Technology (NaCCA CCP: work habits; codes to verify)', 'Planning and time management'],
      ],
      before: ['Ask: what is the best excuse you have heard? What was it hiding?'],
      during: ['Stop after Page 3. Ask learners to draw two circles and fill them from their own week.'],
      after: ['Learners choose one small-circle action to try for a week and report back.'],
      discussion: ['When is it right to say “this is not my fault”?'],
      reflection: ['What is in your small circle that you have been ignoring?'],
      maths: [
        {
          task: 'Kwesi scored 4 out of 20 and later 12 out of 20. How many times better was the second score?',
          answer: '12 ÷ 4 = 3 times.',
        },
        {
          task: 'He studies 20 minutes a night for 5 school nights. How many minutes is that, and how many hours and minutes?',
          answer: '20 × 5 = 100 minutes, or 1 hour 40 minutes.',
        },
      ],
      support: ['Provide a printed template with two empty circles.'],
      stretch: ['Interview an adult about a time they stopped blaming and started acting.'],
      localise: ['What delays happen on your way to school, and which parts can you plan for?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 2
  mk({
    key: 'how-small-things-add-up',
    title: 'How Small Things Add Up',
    summary:
      'Getting a little better each day does not look like much, but over a year it adds up to a great deal. This article shows how tiny habits, set up well, change what we do and who we become.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'habits', 'self-improvement', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Clear, encouraging, and steady',
    palette: ['#15803d', '#0369a1'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Soft steady rhythm with light percussion (placeholder)',
    pages: [
      pg(
        '📈',
        'Imagine you get one per cent better at something every day. That is a tiny gain, too small to notice. But it adds up, like interest. After a year of one per cent better each day, you would be about thirty-eight times better than when you started. Now imagine the opposite. If you get one per cent worse each day, after a year there is almost nothing left, less than three per cent of what you began with. Small changes, repeated every day, grow into something very large, in either direction. This is one of the most useful ideas about how people change.',
        'A painted path rising gently then climbing high up a green hill, beside a path sloping down.'
      ),
      pg(
        '🌱',
        'Why do we not see this? Because the early results are invisible. A seed in the soil shows nothing for days. A pupil who reads one page a night may not feel any cleverer after a week. A footballer who practises passing for ten minutes a day may see no change for a month. Many people stop at that point, believing it is not working. But the growth is happening underground. Then one day the shoot appears, and it seems sudden. Patience in the dull middle part is what separates people who change from those who only wish to.',
        'A seed under the soil with roots growing underground, and a small green shoot just breaking through.'
      ),
      pg(
        '🪜',
        'So how do we start? Make the habit tiny and easy. If you want to read more, begin with one page. If you want to exercise, begin with five press-ups. Then attach it to something you already do every day. “After I brush my teeth, I will read one page.” “After I wash my plate, I will review one new word.” The old habit reminds you of the new one. A tiny habit is hard to refuse, and once you have started, you often do more. What matters is that you do it every day.',
        'A girl brushing her teeth with a small storybook resting neatly on the shelf beside her.'
      ),
      pg(
        '👀',
        'Next, arrange your surroundings so that the good habit is easy and the bad habit is hard. Put your reading book on your pillow, not at the bottom of your bag. Leave your phone charging in another room while you do homework. Put your water bottle where you will see it. Keep a calendar and tick off each day you do your habit, because a chain of ticks is satisfying and you will not want to break it. We often think we need more willpower. But a well-arranged room can do most of the work for you.',
        'A tidy bedroom with a book placed neatly on a pillow, a water bottle on the desk, and a wall chart of checkmarks.'
      ),
      pg(
        '🪪',
        'There is a deeper layer too. Every time you do your tiny habit, you cast a small vote for the kind of person you are. “I am someone who reads.” “I am someone who keeps promises to myself.” A pupil who says “I want to pass” has a goal. A pupil who says “I am a person who studies a little every day” has an identity. Identity lasts longer than a goal, because it is not finished when an exam is over. Each small action is evidence for who you are becoming.',
        'A boy happily marking a wall chart with a pencil beside a stack of storybooks on his desk.'
      ),
      pg(
        '💪',
        'What if you miss a day? Do not punish yourself. Everyone does sometimes. The rule is to never miss twice. Get back on the very next day. Do not rely on feeling motivated, because motivation comes and goes like the weather. Rely on a simple system, a small habit that is attached to a daily moment and a good setting. Look at a drummer who practises each evening, or a trader who counts the day’s money before sleeping. They have not become great by one big effort, but by small things done again and again.',
        'A young drummer practising calmly at dusk in a compound courtyard.'
      ),
    ],
    activities: [
      {
        id: 'xb-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'After a year of getting one per cent better every day, about how much better would you be?',
        options: [
          'About twice',
          'About thirty-eight times',
          'The same',
        ],
        correctIndex: 1,
      },
      {
        id: 'xb-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why do many people stop forming good habits too early?',
        options: [
          'The early results cannot be seen yet',
          'Habits are always too hard',
          'Nobody cares',
        ],
        correctIndex: 0,
      },
      {
        id: 'xb-c3',
        type: 'comprehension',
        afterPage: 3,
        question: 'What is the idea behind “After I brush my teeth, I will read one page”?',
        options: [
          'Tying a new habit to an old one',
          'Reading is hard',
          'Teeth are important',
        ],
        correctIndex: 0,
      },
      {
        id: 'xb-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You want to practise English vocabulary daily. Using the article, what is the best plan?',
        options: [
          'Study for five hours on Sunday',
          'Learn one new word after supper every day and tick a calendar',
          'Wait until you feel motivated',
        ],
        correctIndex: 1,
      },
      {
        id: 'xb-s1',
        type: 'sequencing',
        prompt: 'Put the ideas in the order the article presents them.',
        items: [
          'Small daily gains add up over a year',
          'Early results are invisible, so patience is needed',
          'Make the habit tiny and attach it to an old habit',
          'Arrange your surroundings to help',
          'Never miss twice; rely on systems rather than motivation',
        ],
      },
      {
        id: 'xb-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'invisible',
        definition: 'Not able to be seen.',
        distractors: [
          'Very loud',
          'Very large',
        ],
      },
    ],
    glossary: [
      {
        word: 'interest',
        definition: 'Extra money earned on money that has been saved or invested.',
        pages: [1],
      },
      {
        word: 'invisible',
        definition: 'Not able to be seen.',
        pages: [2],
      },
      {
        word: 'habit',
        definition: 'Something you do so often that it becomes automatic.',
        pages: [3],
      },
      {
        word: 'surroundings',
        definition: 'The things and places around you.',
        pages: [4],
      },
      {
        word: 'identity',
        definition: 'Your sense of who you are.',
        pages: [5],
      },
      {
        word: 'motivation',
        definition: 'The feeling that makes you want to act.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Tiny habits repeated daily grow into large results; make them easy, attach them to existing routines, and think of them as votes for who you are becoming. The idea is explored further in “Atomic Habits” by James Clear (2018). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The “thirty-eight times” figure is the arithmetic of 1.01 raised to the power 365. It is an illustration of compounding, not a promise that people improve at a fixed rate.',
    ],
    reviewQuestions: [
      'Check that 1.01 to the power 365 is about 37.8 and 0.99 to the power 365 is about 0.026.',
      'Make clear to learners that real progress is uneven.',
    ],
    guide: {
      overview:
        'An article that explains how tiny daily habits compound, and four simple ways to build them.',
      lessonMinutes: 45,
      goals: [
        'Explain how small daily gains add up.',
        'Explain why patience matters at the start.',
        'Design a tiny habit attached to an old one.',
        'Describe the “never miss twice” rule.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: personal development and study habits; codes to verify)', 'Building good habits'],
        ['Mathematics (NaCCA CCP: percentages and growth; codes to verify)', 'Compounding change'],
      ],
      before: ['Ask: what small thing could you do every day that you do not do now?'],
      during: ['Stop after Page 2. Ask: why do we expect results too quickly?'],
      after: ['Each learner writes a habit using the form: “After I ___, I will ___.” and keeps a tick chart for a week.'],
      discussion: ['Is motivation or a system more dependable? Why?'],
      reflection: ['What tiny habit would make the biggest difference to you?'],
      maths: [
        {
          task: 'If you save GH¢2 every day, how much is that in a week, and in 30 days?',
          answer: '2 × 7 = GH¢14 in a week; 2 × 30 = GH¢60 in 30 days.',
        },
        {
          task: 'If you improve 1 per cent a day, you end the year about 38 times as good as you began. How much better than the start is that, as a plain gain?',
          answer: '38 - 1 = 37 times better, so 37 times more than the start.',
        },
      ],
      support: ['Provide a calendar template and a sentence frame.'],
      stretch: ['Calculate 1.01 to the power 30 on a calculator and compare it with 1.'],
      localise: ['What daily practices do drummers, farmers, or traders near you keep?'],
      factCheck: ['The figures 38 times and under three per cent come from 1.01 and 0.99 raised to the power 365 and should be checked with a calculator. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 3
  mk({
    key: 'the-long-jump-pit',
    title: 'The Long Jump Pit',
    summary:
      'Adwoa comes last at the district sports and wants to quit. A year of patient practice, a setback, and a coach’s steady words teach her what really takes a person far.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'perseverance', 'sports', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Steady and gradually triumphant',
    palette: ['#dc2626', '#ca8a04'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Adwoa: a JHS 2 girl who loves running and jumping.',
      'Coach Sandra: the school sports mistress, firm and encouraging.',
      'Maame Efua: Adwoa’s grandmother, who sells oranges.',
      'Kofi: Adwoa’s classmate who helps dig the pit.',
    ],
    music: 'Building drumbeat with a flute (placeholder)',
    pages: [
      pg(
        '🏃',
        'Adwoa had practised for two weeks for the district long jump. On the day, her feet slipped at the board, and she jumped a short, ugly distance. She came last of twelve. The crowd clapped politely for everyone, but Adwoa heard only the quiet. On the way home, she told Kofi, “I am not made for this. I will give it up and stick to football.” Kofi did not know what to say. At home, her grandmother, Maame Efua, only said, “Eat first. We will talk tomorrow.”',
        'A girl sitting alone on a wooden bench in a sports vest, with a sand pit behind her.'
      ),
      pg(
        '🗣️',
        'The next day, Coach Sandra found her. “I saw your jump,” she said. “What did you learn?” Adwoa shrugged. “That I am bad.” “No. You learned that your run-up is not steady, and your feet are not landing in the right place. Those are things we can fix.” Then she told Adwoa about a long-distance runner she once knew. “She was not the fastest girl. But she turned up to every practice for six years. In the end, she beat many with more natural talent.” Adwoa listened. “Talent is only the start,” said the coach. “What you do with it, day after day, matters more.”',
        'A coach crouching beside a girl and drawing lines in the sand.'
      ),
      pg(
        '⛏️',
        'Adwoa decided to try for one year. The school’s old jump pit had hard soil, so she and Kofi dug it deeper and filled it with soft sand. Three afternoons a week, she practised her run-up with a tape marked in pencil. She jumped, measured, and wrote the distance in a small book. Progress was slow. Some weeks she did not improve at all. Her friends asked why she bothered. “I like it,” said Adwoa. “And I want to see how far I can go.” She was surprised to find that this was true.',
        'A girl and a boy shovelling soft sand into a pit and laying down a measuring tape.'
      ),
      pg(
        '🦶',
        'In the third term, Adwoa sprained her ankle. She cried, because she thought all her work was lost. The school nurse told her to rest it, and sent her to the clinic to be checked. For four weeks she did no jumping. She followed the rest carefully and did gentle exercises that the nurse approved. She even went to practice to watch and to measure for others. Coach Sandra said, “Resting well is part of training.” When the ankle healed, Adwoa returned slowly, with short runs first. She lost a month, but she did not lose her purpose.',
        'A girl with a bandaged ankle watching a team practice and holding a rolled tape measure.'
      ),
      pg(
        '📏',
        'A year after the district disaster, Adwoa opened her little book and added up the numbers. Her first jump had been two metres and forty. Her best jump now was three metres twenty. It was eighty centimetres further. At the next district sports she did not come last. She came third, and she walked up to receive a small bronze medal. Her grandmother, who had walked a long way to be there, clapped louder than anyone. “You did not win,” said Maame Efua, smiling. “You grew.” And Adwoa knew she was right.',
        'A girl receiving a bronze medal while her grandmother claps proudly in the crowd.'
      ),
      pg(
        '💪',
        'Adwoa kept her little book. On the first page she wrote what she had learned. “Doing well takes two things. One is caring about something for a long time. The other is not stopping when it gets hard.” She had cared about jumping for a whole year, and she had returned after a fall. That combination of lasting interest and patient effort is sometimes called grit. It is not about being the best on the first day. It is about still being there on the thousandth, with your spikes in your hand and a smile on your face.',
        'A girl writing in her small notebook with the sand pit and warm sunset behind her.'
      ),
    ],
    activities: [
      {
        id: 'xc-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'How did Adwoa do in her first district long jump?',
        options: [
          'She won',
          'She came last of twelve',
          'She did not take part',
        ],
        correctIndex: 1,
      },
      {
        id: 'xc-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What did Coach Sandra say Adwoa had learned from the jump?',
        options: [
          'That she was bad',
          'That her run-up and landing needed fixing',
          'That jumping was not for girls',
        ],
        correctIndex: 1,
      },
      {
        id: 'xc-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Adwoa handle her sprained ankle?',
        options: [
          'She jumped anyway',
          'She rested, was checked, and returned slowly',
          'She quit',
        ],
        correctIndex: 1,
      },
      {
        id: 'xc-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You fail your first attempt at learning to play the recorder. Using the story, what is a good response?',
        options: [
          'Quit at once',
          'Find out what went wrong and practise a little regularly',
          'Wait for talent to appear',
        ],
        correctIndex: 1,
      },
      {
        id: 'xc-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Adwoa comes last at the district sports',
          'Coach Sandra tells her what to fix',
          'She practises regularly and records her jumps',
          'She sprains her ankle and rests properly',
          'A year later she comes third',
        ],
      },
      {
        id: 'xc-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'grit',
        definition: 'Lasting interest and patient effort towards a long goal.',
        distractors: [
          'A kind of sand',
          'A running shoe',
        ],
      },
    ],
    glossary: [
      {
        word: 'district',
        definition: 'An area of a region with its own local government.',
        pages: [1],
      },
      {
        word: 'run-up',
        definition: 'The run taken before a jump.',
        pages: [2],
      },
      {
        word: 'progress',
        definition: 'Improvement over time.',
        pages: [3],
      },
      {
        word: 'sprained',
        definition: 'Injured by a sudden twist of a joint.',
        pages: [4],
      },
      {
        word: 'bronze',
        definition: 'A brownish metal; a bronze medal is the third prize.',
        pages: [5],
      },
      {
        word: 'grit',
        definition: 'Lasting interest and patient effort towards a long goal.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Lasting interest plus patient effort over a long time often matters more for success than raw talent. The idea is explored further in “Grit” by Angela Duckworth (2016). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The injury section advises rest, a nurse, and a gradual return. It should not be read as encouraging learners to train through injury.',
    ],
    reviewQuestions: [
      'Ask a PE teacher to confirm the training and injury advice is safe.',
      'Check that the story is balanced and does not suggest that effort alone guarantees success.',
    ],
    guide: {
      overview:
        'A sports story about failing, practising patiently, resting wisely, and growing over a year.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain what Adwoa learned from her first failure.',
        'Describe the two parts of grit.',
        'Set a year-long small goal.',
      ],
      subjects: [
        ['Physical Education (NaCCA CCP: athletics and safety; codes to verify)', 'Training, rest, and recovery'],
        ['Social Studies (NaCCA CCP: perseverance and personal goals; codes to verify)', 'Keeping going'],
      ],
      before: ['Ask: what have you kept doing even when it was hard?'],
      during: ['Stop after Page 2. Ask: what is the difference between “I am bad” and “this needs fixing”?'],
      after: ['Learners choose a one-term goal, a tiny weekly routine, and a way to record progress.'],
      discussion: ['Is talent or effort more important? Can you have too much of either?'],
      reflection: ['What would you keep doing for a year if you knew you could improve?'],
      maths: [
        {
          task: 'Adwoa’s first jump was 2.40 m and her best was 3.20 m. How much further is that?',
          answer: '3.20 - 2.40 = 0.80 m, which is 80 cm.',
        },
        {
          task: 'She practises 3 afternoons a week for 40 weeks of the school year. How many practices is that?',
          answer: '3 × 40 = 120 practices.',
        },
      ],
      support: ['Provide a progress chart template with dates and distances.'],
      stretch: ['Interview an athlete or a musician about the longest time they practised without a sign of progress.'],
      localise: ['What sports facilities at your school could pupils improve themselves, as Adwoa and Kofi did?'],
      factCheck: ['The story is fiction. Injury advice must be confirmed by a PE teacher or the school nurse. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 4
  mk({
    key: 'the-mistake-notebook',
    title: 'The Mistake Notebook',
    summary:
      'Everyone makes mistakes. Some people hide them and repeat them, others study them and grow. This article shows a simple notebook and a few honest habits that turn mistakes into progress.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'honesty', 'learning', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Calm, honest, and practical',
    palette: ['#7c3aed', '#0f766e'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Quiet guitar with soft chimes (placeholder)',
    pages: [
      pg(
        '⚽',
        'A footballer misses a penalty in a school match. He can respond in two ways. One way is to say, “The goalkeeper was lucky, the grass was bad, the referee was unfair,” and to forget the whole thing. The other way is to ask, “Why did I miss?” and to find out. Maybe he kicked too hard. Maybe he looked at the goalkeeper instead of the corner. The second boy feels the same pain as the first, but he turns it into something useful. Over a season, he will get better, and the first boy will not.',
        'A boy in a football kit pausing thoughtfully by the goalpost on a school pitch.'
      ),
      pg(
        '📓',
        'A simple tool can help. Keep a mistake notebook, with three columns. In the first, write what happened. In the second, write why it happened, as honestly as you can. In the third, write what you will do differently next time. For example: “I lost marks in the science test.” “I did not read the questions fully.” “I will underline key words and read each question twice.” Reading your notebook a month later is a surprising experience. You see patterns in your own mistakes that you could never see in the moment.',
        'An open lined notebook divided neatly into three ruled sections with a pencil beside it.'
      ),
      pg(
        '🔍',
        'The hardest part is being honest about why. It is tempting to blame others, or to say you did not have time, when really you chose to do something else. Try to separate what you did from what you wish were true. Ask a person you trust, “What do you see that I do not?” It takes courage, because the answer may be uncomfortable. But another person can see what is invisible to you, as a mirror shows your back. If you get an honest answer, say thank you, and think about it before you answer back.',
        'A girl asking an older student a question while holding her notebook, listening carefully.'
      ),
      pg(
        '🤝',
        'When you give feedback to others, do it kindly and honestly. Be specific. Say, “In your essay, the opening was strong, but the middle jumped from one idea to another,” and not, “It is bad.” Talk about the work, not the person. Mention something good first if it is true, and then say what could be better. Say it in private, and with respect. In Ghana, we value respect for elders and for one another, and honesty does not have to be harsh. Truth that is delivered with care is far easier to hear, and far more likely to help.',
        'Two pupils sitting together with an exercise book, one pointing gently while the other nods.'
      ),
      pg(
        '📜',
        'Over time, you can turn your lessons into personal rules, which are sometimes called principles. “I will check my work twice before handing it in.” “I will ask a question the moment I am lost, not two weeks later.” “I will prepare the night before.” Write each rule in a short sentence that you can remember. Look at them every so often, remove the ones that do not help, and add new ones. Your rules grow out of your own experience, which makes them much stronger than rules you have just borrowed from someone else.',
        'A tidy study table with a small pinned card above it and neatly stacked exercise books.'
      ),
      pg(
        '🌅',
        'Mistakes will keep coming, because trying new things means getting some wrong. What matters is what we do next. Pain alone teaches little. But pain together with honest thought can lead to real progress. So tomorrow, if something goes wrong, take a deep breath and ask three questions. What happened? Why, really? What will I do next time? And remember that honesty should always come with kindness, towards others and towards yourself. A mistake is not a judgement on who you are. It is information that can help you grow.',
        'A pupil at sunrise opening a notebook with a calm smile.'
      ),
    ],
    activities: [
      {
        id: 'xd-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did the second footballer do after missing the penalty?',
        options: [
          'Blamed the referee',
          'Asked why he missed and looked for the cause',
          'Left the team',
        ],
        correctIndex: 1,
      },
      {
        id: 'xd-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What are the three columns of the mistake notebook?',
        options: [
          'Name, date, score',
          'What happened, why, and what to do next time',
          'Good, bad, and ugly',
        ],
        correctIndex: 1,
      },
      {
        id: 'xd-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What should feedback to others be like?',
        options: [
          'Specific, about the work, kind, and private',
          'Loud and public',
          'Vague and quick',
        ],
        correctIndex: 0,
      },
      {
        id: 'xd-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You forgot your homework again. Using the article, what should you write in the notebook?',
        options: [
          '“Not my fault”',
          'What happened, the honest reason, and a rule like packing the night before',
          'Nothing',
        ],
        correctIndex: 1,
      },
      {
        id: 'xd-s1',
        type: 'sequencing',
        prompt: 'Put the ideas in the order the article presents them.',
        items: [
          'Two ways to respond to a mistake',
          'The mistake notebook with three columns',
          'Being honest about why and asking someone you trust',
          'Giving feedback kindly and specifically',
          'Turning lessons into personal rules',
        ],
      },
      {
        id: 'xd-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'feedback',
        definition: 'Comments about how well someone has done something.',
        distractors: [
          'A kind of microphone',
          'A school bell',
        ],
      },
    ],
    glossary: [
      {
        word: 'penalty',
        definition: 'A free kick at goal as a punishment for a foul.',
        pages: [1],
      },
      {
        word: 'columns',
        definition: 'Vertical sections of a table or page.',
        pages: [2],
      },
      {
        word: 'honest',
        definition: 'Truthful; not cheating or hiding things.',
        pages: [3],
      },
      {
        word: 'feedback',
        definition: 'Comments about how well someone has done something.',
        pages: [4],
      },
      {
        word: 'principles',
        definition: 'Rules or beliefs that guide how you act.',
        pages: [5],
      },
      {
        word: 'progress',
        definition: 'Improvement over time.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Study your mistakes honestly, ask others for honest views, and turn lessons into rules; pain plus careful thought leads to progress. The idea is explored further in “Principles: Life and Work” by Ray Dalio (2017). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The article keeps honesty linked with respect and kindness, in line with Ghanaian values. It does not teach harsh criticism.',
    ],
    reviewQuestions: [
      'Check that the feedback advice is respectful of elders and teachers.',
      'Check the average: (12 + 14 + 17) ÷ 3 = 14.33.',
    ],
    guide: {
      overview:
        'An article that explains how to learn from mistakes with a simple notebook, honest questions, kind feedback, and personal rules.',
      lessonMinutes: 45,
      goals: [
        'Describe two ways to respond to a mistake.',
        'Use the three-column notebook.',
        'Give kind, specific feedback.',
        'Write two personal rules.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: personal development and values; codes to verify)', 'Honesty and learning'],
        ['English Language (NaCCA CCP: writing and speaking for purpose; codes to verify)', 'Giving feedback'],
      ],
      before: ['Ask: what mistake taught you the most?'],
      during: ['Stop after Page 2. Learners start a mistake notebook with one recent mistake.'],
      after: ['Pairs practise giving and receiving specific, kind feedback on a short piece of writing.'],
      discussion: ['Why is it hard to be honest about our own mistakes?'],
      reflection: ['Which of your mistakes is repeating? What is the rule that would stop it?'],
      maths: [
        {
          task: 'A pupil scored 12, 14, and 17 out of 20 in three tests. What is the average, and how much did the score rise from the first to the last?',
          answer: '(12 + 14 + 17) ÷ 3 = 14.33 (about 14); 17 - 12 = 5 marks.',
        },
        {
          task: 'In a notebook, 8 of 10 mistakes were “did not read the question”. What percentage is that?',
          answer: '8 ÷ 10 = 80 per cent.',
        },
      ],
      support: ['Provide a three-column template.'],
      stretch: ['Review a month of notebook entries and write three personal principles.'],
      localise: ['How do elders in your community give advice kindly?'],
      factCheck: ['The article is general advice. Check that the examples suit the school. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 5
  mk({
    key: 'not-yet',
    title: 'Not Yet',
    summary:
      'Efua says she is “just bad at maths”. Her teacher adds a single word to her sentence. A story about how believing you can grow changes how you face difficulty.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'growth-mindset', 'mathematics', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Gentle, warm, and hopeful',
    palette: ['#be185d', '#0e7490'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Efua: a JHS 2 girl who is good at drawing and shy about mathematics.',
      'Mr Boakye: her mathematics teacher, who is calm and encouraging.',
      'Selasi: Efua’s older brother, learning to play the drums.',
      'Akosua: Efua’s friend, who is good at maths and shares what she knows.',
    ],
    music: 'Warm marimba with a light drum (placeholder)',
    pages: [
      pg(
        '✏️',
        'Efua could draw anything. Her sketches of the school, the market, and her family’s goat were the best in JHS 2. But when it came to mathematics, she went quiet. “I am just bad at maths,” she told her friend Akosua. “Some people are born with it, and I was not.” When Mr Boakye returned the test, she did not even look at her mark. She had made up her mind years ago. For Efua, being good at something was like having a nose or ears, and you either had it or you did not.',
        'A girl holding a sketchbook while turning shyly away from a folded paper on her desk.'
      ),
      pg(
        '🥁',
        'At home, her brother Selasi was learning to play the drums, and he was terrible. The whole house heard it. He played the wrong beats, dropped his sticks, and groaned. But every evening he went back. “Why do you keep going?” asked Efua. “If you are not good at it?” Selasi laughed. “I am not good at it yet,” he said. “Last month I could not keep a beat at all. Today I kept it for ten bars.” Efua stared at him. He was not worried at all. He seemed to find the mistakes interesting, like clues.',
        'A boy at a traditional drum, laughing good-naturedly, while his sister watches from the doorway.'
      ),
      pg(
        '➕',
        'The next day, Mr Boakye handed back Efua’s paper. At the top, next to her sentence “I am bad at maths,” which she had written there herself, he added one small word: “yet.” She frowned. “Sir?” “You are not good at fractions yet,” he said. “That is different from never.” He sat beside her and looked at her mistakes. “These are not proof that you cannot do it. They show exactly where the next step is. Your brain grows when you struggle with something just beyond your reach. Let us find the first step.”',
        'A friendly teacher sitting beside a girl at her desk, pointing gently with a pen to her exercise sheet.'
      ),
      pg(
        '🔬',
        'They found that Efua understood fractions of a whole, but got lost when the numbers became large. Mr Boakye drew them as pictures, in the way Efua liked to draw. Slowly, the boxes and circles began to mean something. She practised for ten minutes every evening and asked Akosua for help whenever she was stuck. Some days she felt clever. Some days nothing made sense. On those days, she said to herself, “Not yet,” and tried a different way: a picture, a story, or a question. After a month she was surprised to find that she liked it.',
        'A girl drawing shaded fraction circles in a notebook with her friend explaining beside her.'
      ),
      pg(
        '📈',
        'Three weeks later came another test. Efua did not score the highest. But her mark had risen from six out of twenty to fifteen. She did not rush to hide her paper. She looked at the questions she had missed and wrote, “Next, I will study long division.” Akosua came over. Efua said, “Thank you for all your help.” Then Akosua said, “It is not the help. It is that you kept trying.” That made Efua feel better than the mark itself. The best part was that she was no longer afraid of the next test.',
        'Two friends smiling together over an exercise book at their classroom desk.'
      ),
      pg(
        '🌱',
        'From then on, Efua listened more carefully to how people spoke. She noticed that some said, “I am bad at this,” and stopped. Others said, “I have not learned this yet,” and kept going. She also noticed when people praised only talent, and she began to praise effort and good strategies: “You worked hard on that,” or “That was a clever way to do it.” Not everything can be learned by anyone with enough effort, and some tasks truly need help. But the belief that you can grow is the first step. Add the word “yet,” and see what happens.',
        'A girl and her friends sitting together in a sunny schoolyard at break time, smiling warmly.'
      ),
    ],
    activities: [
      {
        id: 'xe-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did Efua believe about being good at maths?',
        options: [
          'You can learn it step by step',
          'You are born with it or without it',
          'It is not important',
        ],
        correctIndex: 1,
      },
      {
        id: 'xe-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What word did Mr Boakye add to her sentence?',
        options: [
          'Never',
          'Maybe',
          'Yet',
        ],
        correctIndex: 2,
      },
      {
        id: 'xe-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Efua improve?',
        options: [
          'By practising a little each evening, using pictures, and asking for help',
          'By copying answers',
          'By avoiding fractions',
        ],
        correctIndex: 0,
      },
      {
        id: 'xe-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A friend says, “I can’t speak in public.” Using the story, what could you say?',
        options: [
          '“You are right, give up.”',
          '“You can’t do it yet. Let us practise with a small audience first.”',
          '“Just be born talented.”',
        ],
        correctIndex: 1,
      },
      {
        id: 'xe-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Efua says she is just bad at maths',
          'Selasi explains he is not good at drums yet',
          'Mr Boakye adds the word yet',
          'Efua practises with pictures and asks for help',
          'Her next mark rises and she plans her next step',
        ],
      },
      {
        id: 'xe-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'yet',
        definition: 'Up to now; used to show that something may still change.',
        distractors: [
          'A kind of paper',
          'A school subject',
        ],
      },
    ],
    glossary: [
      {
        word: 'mark',
        definition: 'A score given for work.',
        pages: [1, 5],
      },
      {
        word: 'fractions',
        definition: 'Numbers that show parts of a whole.',
        pages: [3],
      },
      {
        word: 'mistakes',
        definition: 'Things done wrongly.',
        pages: [2, 3],
      },
      {
        word: 'strategies',
        definition: 'Plans for achieving something.',
        pages: [6],
      },
      {
        word: 'struggle',
        definition: 'To try hard against difficulty.',
        pages: [3],
      },
      {
        word: 'effort',
        definition: 'Hard work towards a goal.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Believing that abilities can grow with effort and good strategies helps people face difficulty and keep learning. The idea is explored further in “Mindset: The New Psychology of Success” by Carol S. Dweck (2006). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story says that effort and good strategies matter and that some tasks need help. It does not claim that anyone can do anything.',
    ],
    reviewQuestions: [
      'Check that the story does not blame pupils who struggle for “not trying”.',
      'Check the sums: 15 - 6 = 9; 10 × 20 = 200 minutes.',
    ],
    guide: {
      overview:
        'A story about a girl who stops saying “I am bad at maths” and starts saying “not yet”.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain the difference between “bad at” and “not yet”.',
        'Describe how Efua improved.',
        'Use “not yet” in your own life.',
      ],
      subjects: [
        ['Mathematics (NaCCA CCP: fractions; codes to verify)', 'Understanding fractions with pictures'],
        ['Social Studies (NaCCA CCP: personal development; codes to verify)', 'Believing you can grow'],
      ],
      before: ['Ask: what do you say you are bad at? Is it always true?'],
      during: ['Stop after Page 3. Ask: why did one word matter so much?'],
      after: ['Learners rewrite three “I can’t” sentences with “yet” and a first step.'],
      discussion: ['Is it kind to tell a pupil to “just try harder”?'],
      reflection: ['What is one thing you could do that you cannot do yet?'],
      maths: [
        {
          task: 'Efua’s mark rose from 6 out of 20 to 15 out of 20. By how many marks did it rise?',
          answer: '15 - 6 = 9 marks.',
        },
        {
          task: 'She practises 10 minutes each evening for 20 evenings. How many minutes, and how many hours and minutes?',
          answer: '200 minutes, or 3 hours 20 minutes.',
        },
      ],
      support: ['Give a card with “I cannot … yet. My first step is …”.'],
      stretch: ['Interview an adult about something they learned late in life.'],
      localise: ['What skills do older people in your community say they learned slowly?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 6
  mk({
    key: 'what-is-enough',
    title: 'What Is Enough?',
    summary:
      'Two traders earn the same money, but one ends the year with savings and the other with nothing. This article shows why money depends more on behaviour, patience, and knowing what is enough than on cleverness.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'money', 'saving', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Clear, practical, and calm',
    palette: ['#15803d', '#a16207'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Calm highlife guitar with soft percussion (placeholder)',
    pages: [
      pg(
        '💰',
        'Two traders at the same market earn exactly the same amount each month. Kwabena spends on a flashy phone, new shoes, and a big meal each Saturday for his friends. Ama spends on what she needs, and puts a little aside each week. After a year, Kwabena has nothing left, and Ama has a small, growing sum. Both are hard workers, and both are clever. What was different was how they behaved with money. Money is often thought of as a matter of numbers. In truth, it is mostly a matter of behaviour.',
        'Two market traders side by side, one showing off new shoes with an empty purse, the other holding a wooden savings box.'
      ),
      pg(
        '⏳',
        'Behaviour includes waiting. Most people want things now, and it is hard to wait for something bigger. Behaviour also includes not panicking. When prices rise or something goes wrong, a calm person will keep their saving and look for a sensible way through, while a panicking person may do something they regret. You do not need to be a mathematician to manage money well. You need patience, calm, and a few simple habits. A person with an ordinary income who is patient can do better than a high earner who spends everything.',
        'A girl holding a coin calmly between a tray of sweet snacks and a wooden savings box.'
      ),
      pg(
        '🚗',
        'Showing off can fool us. A person who drives a fine car and wears fine clothes may look rich, but we cannot see what they owe. They may have spent all their money, or even borrowed to buy it. Wealth is what you do not spend. It is the money kept in a safe place, the savings that give you freedom. So when you admire what others have, remember that you only see what they bought, not what they kept. And do not spend money you do not have, just to impress people who do not think much about you anyway.',
        'A shiny car parked on a street while a modest trader walks calmly past holding a small savings passbook.'
      ),
      pg(
        '🌊',
        'Luck and risk also matter. Two farmers may work equally hard, but one season a flood destroys the crops of one and spares the other. Hard work is important, but it is not the only thing at work. So we should be humble when things go well, and kind when things go badly for others. It also means keeping a small emergency saving for surprises such as illness or a broken tool, so that one bad day does not become a disaster. And it means not judging someone by their situation alone, for you may not see the luck behind it.',
        'Two neighbouring farms, one on higher ground with healthy crops and one lower with floodwater across the field.'
      ),
      pg(
        '🛑',
        'How much is enough? Some people always want more and more, and never feel they have enough, so they take risks that could ruin them. Be careful of anyone who promises to double your money in a week or two. Such promises have cost many Ghanaians their savings. If something sounds too good to be true, it probably is. Ask a trusted adult, ask your bank, and never hurry. Knowing what is enough for you, and being content with it, is not laziness. It protects you from losing what you have already earned.',
        'A young person showing a colourful paper leaflet to a wise older woman at a table, who shakes her head kindly.'
      ),
      pg(
        '🌳',
        'Small amounts saved regularly over a long time grow slowly, like a tree. Ghana has a long tradition of saving together, in susu groups and in cooperative societies, where small contributions build something larger. You can begin with a savings box at home, and later a bank or a trusted savings scheme. Talk to your parents or guardians about it. Save a little each time you receive money, spend wisely on needs first, and be patient. You do not need to be clever with money. You need to be calm, patient, and honest with yourself.',
        'A young person dropping a coin into a wooden savings box next to a thriving green tree seedling.'
      ),
    ],
    activities: [
      {
        id: 'xf-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What was the main difference between Kwabena and Ama?',
        options: [
          'Their income',
          'How they behaved with money',
          'Their luck',
        ],
        correctIndex: 1,
      },
      {
        id: 'xf-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What does the article say wealth is?',
        options: [
          'What you spend',
          'What you do not spend, the money kept safe',
          'What you wear',
        ],
        correctIndex: 1,
      },
      {
        id: 'xf-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What should you do if someone promises to double your money in a week?',
        options: [
          'Hand over your money quickly',
          'Be careful and ask a trusted adult and your bank',
          'Tell all your friends',
        ],
        correctIndex: 1,
      },
      {
        id: 'xf-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You receive GH¢50 as a gift. Using the article, what is a sensible plan?',
        options: [
          'Spend it all at once on showing off',
          'Cover needs first, save part, and talk to a parent about where to keep it',
          'Lend it to a stranger',
        ],
        correctIndex: 1,
      },
      {
        id: 'xf-s1',
        type: 'sequencing',
        prompt: 'Put the ideas in the order the article presents them.',
        items: [
          'Same income, different behaviour',
          'Patience and staying calm',
          'Showing off versus real wealth',
          'Luck and risk, and an emergency saving',
          'Knowing what is enough, then saving little by little',
        ],
      },
      {
        id: 'xf-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'wealth',
        definition: 'Money and valuable things that a person has and keeps.',
        distractors: [
          'A kind of market',
          'A type of trader',
        ],
      },
    ],
    glossary: [
      {
        word: 'behaviour',
        definition: 'The way a person acts.',
        pages: [1, 2],
      },
      {
        word: 'patience',
        definition: 'The ability to wait calmly.',
        pages: [2],
      },
      {
        word: 'wealth',
        definition: 'Money and valuable things that a person has and keeps.',
        pages: [3],
      },
      {
        word: 'emergency',
        definition: 'A sudden serious event that needs quick action.',
        pages: [4],
      },
      {
        word: 'content',
        definition: 'Happy with what one has.',
        pages: [5],
      },
      {
        word: 'susu',
        definition: 'A traditional way of saving in which members contribute regularly and take turns to receive the pool.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Money depends mostly on behaviour: patience, calm, humility about luck, knowing what is enough, and saving small amounts for a long time. The idea is explored further in “The Psychology of Money” by Morgan Housel (2020). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'This is general education and not financial advice. It does not recommend any product, scheme, or investment. Learners should talk to parents, teachers, or a bank.',
    ],
    reviewQuestions: [
      'Check that no specific financial product is recommended.',
      'Check the sums: 10 × 52 = 520; 40 × 4 = 160.',
      'Check the description of susu with a local teacher or a financial literacy teacher.',
    ],
    guide: {
      overview:
        'An article that teaches money behaviour: patience, avoiding showing off, being humble about luck, and knowing what is enough.',
      lessonMinutes: 45,
      goals: [
        'Explain why behaviour matters more than cleverness.',
        'Describe real wealth.',
        'Recognise a get-rich-quick warning sign.',
        'Make a simple saving plan.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: financial literacy and responsible decision-making; codes to verify)', 'Saving and spending wisely'],
        ['Mathematics (NaCCA CCP: money and multiplication; codes to verify)', 'Saving over time'],
      ],
      before: ['Ask: what do you do when you receive money? Is it different for different amounts?'],
      during: ['Stop after Page 3. Ask: what is the difference between looking rich and being rich?'],
      after: ['Learners write a plan for a gift of GH¢50: needs, saving, and giving.'],
      discussion: ['Why do people believe promises of fast money?'],
      reflection: ['What is enough for you at this stage of your life?'],
      maths: [
        {
          task: 'Ama saves GH¢10 each week. How much has she saved after 52 weeks?',
          answer: '10 × 52 = GH¢520.',
        },
        {
          task: 'Kwabena spends GH¢40 each Saturday for his friends. How much is that in 4 weeks?',
          answer: '40 × 4 = GH¢160.',
        },
      ],
      support: ['Use a four-box chart: needs, wants, saving, giving.'],
      stretch: ['Find out how a susu group works and write its rules.'],
      localise: ['Ask an adult in your family what they learned about money from experience.'],
      factCheck: ['This is general guidance, not financial advice. The description of susu is a simplification. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 7
  mk({
    key: 'one-coin-in-ten',
    title: 'One Coin in Ten',
    summary:
      'Kofi earns money washing cars and spends every pesewa. An old trader gives him a simple rule that changes how he treats his earnings. A story about paying yourself first.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'saving', 'goals', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Warm, practical, and quietly hopeful',
    palette: ['#b45309', '#15803d'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kofi: a 15-year-old JHS 3 boy who washes cars on Saturdays.',
      'Mr Ntim: a retired market trader who sits under a neem tree.',
      'Fiifi: Kofi’s friend, who likes new trainers.',
      'A loan seller: a smooth-talking man who offers quick credit.',
    ],
    music: 'Gentle drum and guitar with a warm bell (placeholder)',
    pages: [
      pg(
        '🚗',
        'Kofi washed cars every Saturday near the lorry station. He earned thirty cedis a week, and by Sunday evening it was all gone. He spent it on snacks, airtime, and small treats for friends. “I want a bicycle,” he told his friend Fiifi. “A good second-hand one, so I do not have to walk so far to school.” “Then save,” said Fiifi. “But how?” said Kofi, sadly. “I never have anything left at the end of the week.” That was the strange thing. He earned a lot and still could not save.',
        'A boy washing a car with a bucket and sponge, a bicycle displayed at a shop in the distance.'
      ),
      pg(
        '🌳',
        'Under the neem tree sat Mr Ntim, a retired market trader who was known for his wisdom. Kofi told him his problem. Mr Ntim smiled. “You are waiting to save what is left after you spend,” he said. “But there is never anything left. Turn it around. When you are paid, before you buy anything, put aside one coin out of every ten. That is your share, and it is the first thing you pay, even before snacks.” “Only one in ten?” said Kofi. “It sounds too small.” “Small is easy,” said Mr Ntim. “And easy is what you will keep doing.”',
        'An old man under a neem tree speaking to a boy while setting one coin aside from a row of ten coins.'
      ),
      pg(
        '🥫',
        'That Saturday, Kofi was paid thirty cedis. Before he did anything else, he took three cedis and put them in a tin with a lid. He painted a bicycle on the lid, and wrote the price of a good second-hand one underneath. Then he spent the other twenty-seven cedis as usual, and found that it was enough. He had still bought his snacks and his airtime. He only bought a little less. Week after week, the tin grew heavier. He could shake it and hear the coins. It felt good, and he felt in control.',
        'A boy placing three coins into a metal tin painted with a small picture of a bicycle.'
      ),
      pg(
        '👟',
        'One day, Fiifi came with big news. “They are selling the new trainers! A man says I can take them now and pay later.” The loan seller, who stood nearby, smiled broadly. “Very small interest,” he said. “Pay next month.” Kofi asked to see the paper and counted what he would have to repay. It was far more than the trainers cost. He told Fiifi, “If you borrow to buy something you do not need, you will work for the lender, and not for yourself.” Fiifi frowned, but he did not sign. They walked on, a little wiser.',
        'A man holding a clipboard near a pair of trainers while two boys examine the sheet carefully and step back.'
      ),
      pg(
        '📅',
        'After thirty weeks, the tin held ninety cedis. Kofi was proud, but Mr Ntim made a suggestion. “A tin is safe, but it does not grow, and it can be spent in a weak moment. Ask your mother or an adult you trust to help you open a small savings account or to join a trusted savings group.” Kofi did so. He also decided not to lend his savings to friends who might not repay. Instead, he told them kindly, “I am saving for my bicycle, but I will help you think of a plan.”',
        'A boy and his mother standing together at a savings counter while he holds his metal tin.'
      ),
      pg(
        '🚲',
        'In the end, Kofi saved three cedis a week for fifty-two weeks. It came to one hundred and fifty-six cedis. Together with some extra he earned in the holidays, it bought a good second-hand bicycle, and he rode it to school with pride. “The secret,” he told Mr Ntim, “was to pay myself first.” The old trader nodded. “A part of all you earn is yours to keep,” he said. “It is a small habit, and it takes you a long way.” Kofi nodded, and then he started a new tin: one for his next goal.',
        'A boy riding a second-hand bicycle happily to school on a sunny morning.'
      ),
    ],
    activities: [
      {
        id: 'xg-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What was Kofi’s problem?',
        options: [
          'He earned nothing',
          'He earned money but spent it all before saving',
          'He lost his tin',
        ],
        correctIndex: 1,
      },
      {
        id: 'xg-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What was Mr Ntim’s rule?',
        options: [
          'Spend first and save what is left',
          'Put aside one coin out of every ten before spending',
          'Never spend',
        ],
        correctIndex: 1,
      },
      {
        id: 'xg-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did Kofi refuse to borrow for new trainers?',
        options: [
          'He did not like trainers',
          'The amount to repay was more than the trainers cost',
          'Fiifi told him to',
        ],
        correctIndex: 1,
      },
      {
        id: 'xg-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You get GH¢20 pocket money. Using the story, what is a good first step?',
        options: [
          'Spend it all on treats',
          'Set aside a part, such as GH¢2, before you spend',
          'Lend it to a stranger',
        ],
        correctIndex: 1,
      },
      {
        id: 'xg-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Kofi earns money but cannot save',
          'Mr Ntim teaches him to save one in ten first',
          'Kofi saves three cedis each week in a tin',
          'He refuses to borrow for trainers',
          'He buys a second-hand bicycle',
        ],
      },
      {
        id: 'xg-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'wisdom',
        definition: 'Good judgement based on experience.',
        distractors: [
          'A kind of tree',
          'A type of coin',
        ],
      },
    ],
    glossary: [
      {
        word: 'airtime',
        definition: 'Credit used to make phone calls.',
        pages: [1],
      },
      {
        word: 'wisdom',
        definition: 'Good judgement based on experience.',
        pages: [2],
      },
      {
        word: 'tin',
        definition: 'A metal container with a lid.',
        pages: [3],
      },
      {
        word: 'interest',
        definition: 'Extra money paid to a lender for borrowing money.',
        pages: [4],
      },
      {
        word: 'savings',
        definition: 'Money kept for later.',
        pages: [5],
      },
      {
        word: 'goal',
        definition: 'Something you are working to achieve.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Pay yourself first: set aside a part of everything you earn before spending, keep it safe, and avoid debts you do not need. The idea is explored further in “The Richest Man in Babylon” by George S. Clason (1926). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'This is general education and not financial advice. The story does not recommend any bank, product, or scheme. It advises involving a trusted adult.',
    ],
    reviewQuestions: [
      'Check that the story involves a trusted adult for any account.',
      'Check the sums: 30 ÷ 10 = 3; 3 × 52 = 156.',
      'Check that the loan seller is not shown as a stereotype of any group.',
    ],
    guide: {
      overview:
        'A story about a boy who learns to save a small part first, avoids a bad loan, and reaches his goal.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain “pay yourself first”.',
        'Explain why borrowing for wants can cost more.',
        'Make a savings plan for a goal.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: financial literacy and responsible decision-making; codes to verify)', 'Saving and avoiding debt'],
        ['Mathematics (NaCCA CCP: fractions and percentages; codes to verify)', 'One in ten as 10 per cent'],
      ],
      before: ['Ask: what would you like to buy that costs more than you have?'],
      during: ['Stop after Page 2. Ask: why is one in ten easier than saving what is left?'],
      after: ['Learners write a savings goal with a price and a weekly amount.'],
      discussion: ['Why do some people borrow for things they do not need?'],
      reflection: ['What is your first goal, and who could help you keep it?'],
      maths: [
        {
          task: 'Kofi earns GH¢30 a week and saves one in ten. How much does he save each week?',
          answer: '30 ÷ 10 = GH¢3.',
        },
        {
          task: 'How much does he save in 52 weeks?',
          answer: '3 × 52 = GH¢156.',
        },
      ],
      support: ['Provide a chart with 52 boxes to colour in weekly.'],
      stretch: ['Find out how a susu or a savings account works and compare it with a tin.'],
      localise: ['Ask an adult about the first big thing they saved for.'],
      factCheck: ['The story is fiction, and the prices are illustrative. This is not financial advice. The book’s title, author, and year are given from general knowledge.'],
    },
  }),
];

export const BATCH_52_LIFE_LESSONS = BATCH_52_STORIES;
