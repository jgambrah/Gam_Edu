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
 * Batch 51 (4 original Big Ideas stories and articles, six pages each, with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to Social Studies, Career Technology, Science, or Computing (see the first cultural note and the teacher guide).
 * These are original stories and articles, each teaching one idea from a well-known book. Stories list their characters; articles have none.
 * Original text written for Ghanaian learners; each factCheck note names the book behind the idea and what to verify.
 */

export const BATCH_51_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'why-does-the-harmattan-come',
    title: 'Why Does the Harmattan Come?',
    summary:
      'Every year the dusty harmattan wind arrives, and people explain it in different ways. This article shows how to tell a good explanation from a weak one, using the harmattan itself.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'science', 'weather', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Clear, curious, and steady',
    palette: ['#b45309', '#475569'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Soft dry wind and a gentle flute (placeholder)',
    pages: [
      pg(
        '🌫️',
        'Every year, around December, the air in Ghana changes. A pale haze hangs over Tamale, Kumasi, and Accra. Morning air feels cool. Lips crack, skin turns dry, and a fine dust settles on desks and windowsills. Everybody knows the harmattan. But why does it come? Imagine one person says, “The Sun is cross with us, and the harmattan is its anger.” Another says, “It is a wind that blows from the desert.” Both are explanations. This article asks a more interesting question: how can we tell which kind of explanation is better?',
        'A hazy morning street with pale sun, a pupil with cracked lips looking at the dusty sky.'
      ),
      pg(
        '🔁',
        'Test the first explanation. Suppose the harmattan comes early. “The Sun is very cross this year.” Suppose it comes late. “The Sun is still deciding.” Suppose it is weak. “The Sun is nearly forgiving.” Suppose it does not come at all. “The Sun has forgiven us.” Notice that the explanation can be bent to fit anything. Whatever happens, it still works. That sounds strong, but it is actually weak. An explanation that fits every possible outcome tells us nothing, because it cannot warn us about what will happen next, or tell us what to do about it.',
        'Four small scenes of different weather outcomes connected by a flexible ribbon.'
      ),
      pg(
        '🏜️',
        'Now test the second explanation. In the months from late November to about March, air over the Sahara Desert is very dry. A steady north-east wind blows from the Sahara southward across West Africa. It carries fine dust, which makes the haze. Because the air is dry, lips crack and skin loses moisture. Because the sky is clear and dry at night, heat escapes quickly, so mornings can be cool. Notice how the parts fit together. Each part of the explanation does a job, and each one explains something we can see, smell, or feel.',
        'A painted map of West Africa with a sweeping wind path from the Sahara across Ghana.'
      ),
      pg(
        '🔧',
        'Here is a way to test whether an explanation is good. Try changing one of its details. Suppose the wind came from the sea instead. It would carry water, and the air would be damp, not dry, so no cracked lips. Suppose it blew from the south. We would expect rain, not dust. Change almost any part, and the explanation fails. We say it is hard to vary. That is a good sign. It also makes predictions. We can predict that northern Ghana will feel the harmattan first and most, that flights may be delayed by poor visibility, and that the rains will return when winds from the Atlantic return.',
        'A pupil comparing a dry desert wind sketch and a damp ocean wind sketch on a desk.'
      ),
      pg(
        '🛡️',
        'A good explanation helps us to act. Because we know the harmattan is dry, we can drink more water, use a moisturiser or shea butter on the skin, and protect the lips. Because we know it is dusty, we can cover food and drinking water, keep eyes clean, and take care if we have asthma or a chest condition. Because we know the grass is very dry, we must be extra careful with fire in the north, where bush fires spread quickly in this season. The weak explanation could do none of this. It could only make us wait and complain.',
        'A girl applying shea butter, a covered water pot, and a farmer putting out a small fire safely.'
      ),
      pg(
        '❓',
        'Next time you hear an explanation, ask three questions. Could the story be changed to fit anything? Does each part of it do a job? Does it tell me what to expect and what to do? None of this means that old stories are worthless. Stories of origin and tradition teach us who we are and how to treat one another, and they deserve respect. But when we want to know what will happen to the weather, a well, or a sick child, we need explanations that can be tested. Those are the ones that keep improving.',
        'A pupil holding three blank coloured cards in front of a warm harmattan sunset.'
      ),
    ],
    activities: [
      {
        id: 'zx-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why was the “cross Sun” explanation weak?',
        options: [
          'It could be bent to fit any weather, so it told us nothing',
          'It mentioned the Sun',
          'It was too long',
        ],
        correctIndex: 0,
      },
      {
        id: 'zx-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What causes the harmattan haze, according to the article?',
        options: [
          'Smoke from cooking fires',
          'Fine dust carried by a dry north-east wind from the Sahara',
          'Clouds from the sea',
        ],
        correctIndex: 1,
      },
      {
        id: 'zx-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What does it mean to say that an explanation is hard to vary?',
        options: [
          'It is hard to read',
          'Changing a detail makes it fail',
          'It has many parts',
        ],
        correctIndex: 1,
      },
      {
        id: 'zx-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A friend says your exam went badly “because of bad luck”. Using the article, what is the best response?',
        options: [
          'Agree, since luck explains everything',
          'Ask what can be tested, such as revision time, sleep, and missed topics',
          'Stop revising',
        ],
        correctIndex: 1,
      },
      {
        id: 'zx-s1',
        type: 'sequencing',
        prompt: 'Put the ideas in the order the article presents them.',
        items: [
          'Two explanations of the harmattan are offered',
          'The first can be bent to fit anything',
          'The second has parts that fit together',
          'Changing a detail of the second breaks it, and it gives predictions',
          'We use it to protect ourselves',
        ],
      },
      {
        id: 'zx-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'predictions',
        definition: 'Statements about what will happen in the future.',
        distractors: [
          'Old stories',
          'Types of wind',
        ],
      },
    ],
    glossary: [
      {
        word: 'haze',
        definition: 'A thin cloud of dust or smoke in the air.',
        pages: [1],
      },
      {
        word: 'explanation',
        definition: 'A statement that tells why something happens.',
        pages: [1, 2],
      },
      {
        word: 'dust',
        definition: 'Tiny dry particles of earth or sand.',
        pages: [3],
      },
      {
        word: 'visibility',
        definition: 'How far you can see.',
        pages: [4],
      },
      {
        word: 'predictions',
        definition: 'Statements about what will happen in the future.',
        pages: [4],
      },
      {
        word: 'asthma',
        definition: 'A condition that makes breathing difficult.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Big idea: A good explanation is hard to vary: each part does a job, so changing a detail breaks it, and it tells us what to expect. The idea is explored further in “The Beginning of Infinity” by David Deutsch (2011). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'Respect: the article treats traditional stories with respect and says they teach identity and values. It only argues that for predicting weather, tested explanations are more useful.',
    ],
    reviewQuestions: [
      'Ask a geography or science teacher to confirm the harmattan description (dry north-east trade wind from the Sahara, roughly late November to mid-March).',
      'Check the health advice with a health worker.',
      'Check that the “cross Sun” example is not offensive to any local belief.',
    ],
    guide: {
      overview:
        'An article that uses the harmattan to teach the difference between a flexible explanation and a hard-to-vary one.',
      lessonMinutes: 45,
      goals: [
        'Explain why a story that fits everything predicts nothing.',
        'Describe the cause of the harmattan.',
        'Use the “change one detail” test.',
        'Link a good explanation to a useful action.',
      ],
      subjects: [
        ['Science (NaCCA CCP: weather and climate; codes to verify)', 'Winds and seasons in West Africa'],
        ['Social Studies (NaCCA CCP: living with the environment; codes to verify)', 'Protecting health in the dry season'],
      ],
      before: ['Ask: why do you think the harmattan comes? Collect answers without correcting them.'],
      during: ['Stop after Page 2. Ask: could this explanation ever be shown wrong?'],
      after: ['Learners test an explanation of their own using the three questions on Page 6.'],
      discussion: ['Why can an old story be valuable even if it is not a testable explanation?'],
      reflection: ['Which explanation do you accept without ever testing it?'],
      maths: [
        {
          task: 'The harmattan season runs from about late November to mid-March. Roughly how many months is that?',
          answer: 'About 3 to 3.5 months.',
        },
        {
          task: 'If the dry season lasts 4 months and the rainy season 8 months in the south, what fraction of the year is dry?',
          answer: '4 ÷ 12 = 1/3.',
        },
      ],
      support: ['Draw the wind arrow from the Sahara on a map of West Africa.'],
      stretch: ['Find out what causes the rainy season in southern Ghana.'],
      localise: ['Ask three adults what they do to protect their skin and homes during the harmattan.'],
      factCheck: ['The harmattan description (dry north-east wind from the Sahara carrying dust, roughly late November to mid-March) is standard but its dates vary by place and year. Health advice should be confirmed by a health worker. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 2
  mk({
    key: 'the-two-week-fence',
    title: 'The Two-Week Fence',
    summary:
      'JHS 3 plans to fence the school garden in two weeks. Nothing goes as planned. A story about why we always think jobs will take less time than they do, and a better way to plan.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'planning', 'school-projects', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Humorous, brisk, and then thoughtful',
    palette: ['#15803d', '#b45309'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kwame: the JHS 3 class prefect, confident and cheerful.',
      'Abena: the class treasurer, who keeps careful records.',
      'Ms Owusu: the class teacher, calm and practical.',
      'Mr Dankwa: a local carpenter and old pupil of the school.',
      'Yaw: a joker who volunteers for everything.',
    ],
    music: 'Playful marimba with a steady drum (placeholder)',
    pages: [
      pg(
        '🌿',
        'The school garden grew good tomatoes and okro, but goats kept wandering in and eating them. “Let us build a fence,” said Kwame, the class prefect. “Open Day is in two weeks. We can finish before then.” Everyone agreed. Kwame wrote the plan on the board. Monday: buy posts. Tuesday: dig holes. Wednesday and Thursday: fix the posts. Friday: wire. “Done by next Wednesday, with time to spare!” The class cheered. Nobody thought of what might go wrong, because on the board it all looked so simple and so quick.',
        'A class cheering at a chalkboard schedule in front of the classroom, with a goat peeking at the garden outside.'
      ),
      pg(
        '🌧️',
        'Nothing happened as planned. On Monday, the supplier had no posts and promised them for Thursday. On Tuesday it rained, and the ground became too wet to dig. The borrowed shovels broke after an hour. Somebody remembered that the head teacher had not approved the fence, and he was away until Friday. By the end of the first week, the class had a stack of wire and no posts in the ground. “It is just bad luck,” said Yaw. “Next week will be perfect.” Abena frowned. She was not so sure.',
        'Pupils sitting in the rain beside a broken shovel and a roll of wire with no posts in the ground.'
      ),
      pg(
        '📒',
        'Ms Owusu called the class together. “Abena, you keep our records. How long did our last projects take, compared with what we planned?” Abena opened her book. The library shelf: planned one week, took four. The class poster: planned two days, took six. The sports-day banner: planned one day, took three. The room was quiet. “So we are not unlucky this time,” said Ms Owusu. “We are often too hopeful. People nearly always think a job will take less time than it does, because we picture it going perfectly and forget the delays.”',
        'A girl reading from a record book while classmates look surprised at Ms Owusu beside the chalkboard.'
      ),
      pg(
        '🔨',
        'Ms Owusu invited Mr Dankwa, a carpenter who had once been a pupil at the school. “How do you plan a job?” asked Kwame. Mr Dankwa smiled. “First, I do not trust my feelings. I look at my last five similar jobs and see how long they really took. Then I add extra time for the things I cannot predict, such as rain, late supplies, and broken tools. And I ask, ‘What could go wrong?’ before I start, not after.” He wrote three things on the board: look at past jobs, add a cushion, and ask what could go wrong.',
        'A friendly carpenter standing at the classroom board while pupils copy notes into their notebooks.'
      ),
      pg(
        '📅',
        'The class made a new plan. Using the records, they decided the fence would take about five weeks. They wrote down what could go wrong: late posts, rain, broken tools, no permission. They asked the head teacher for permission that very day, ordered the posts early, and borrowed two strong spades. They also asked the PTA to move Open Day’s garden display to the end of term. Each step had a little cushion. Some things still went wrong. But the plan had room for them. The posts arrived late, yet the schedule held.',
        'Pupils carrying wooden fence posts and two sturdy spades toward the school garden.'
      ),
      pg(
        '🏁',
        'Five weeks later, the fence stood, straight and strong, and the goats stayed out. Kwame wrote the lesson beside the old plan. “We were not lazy or unlucky. Our minds were hopeful. Next time, we check how long things really took, we add a cushion, and we ask what could go wrong.” The same trick works for homework, for a trip to the village, and for a revision timetable. Do not trust the first picture in your head. Look at what happened last time, and plan from that.',
        'A finished wooden and wire fence around a flourishing tomato and okro garden, with the class standing proudly in front.'
      ),
    ],
    activities: [
      {
        id: 'zy-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'How long did the class think the fence would take?',
        options: [
          'About a week',
          'About two weeks, finished by Wednesday of the second week',
          'About a month',
        ],
        correctIndex: 1,
      },
      {
        id: 'zy-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Abena’s records show?',
        options: [
          'The class always finished early',
          'Their past projects took much longer than planned',
          'Nothing useful',
        ],
        correctIndex: 1,
      },
      {
        id: 'zy-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What was Mr Dankwa’s first rule?',
        options: [
          'Trust your feelings',
          'Look at how long similar jobs really took',
          'Hurry up',
        ],
        correctIndex: 1,
      },
      {
        id: 'zy-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You plan to finish a project in 3 days. Your last two similar projects took 7 and 8 days. Using the story, what should you do?',
        options: [
          'Keep the 3-day plan',
          'Plan for about a week and ask what could go wrong',
          'Skip the project',
        ],
        correctIndex: 1,
      },
      {
        id: 'zy-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The class plans a two-week fence',
          'Rain, late posts, and broken tools delay the work',
          'Abena’s records show past projects took far longer than planned',
          'Mr Dankwa teaches the class how to plan',
          'The fence is finished after five weeks',
        ],
      },
      {
        id: 'zy-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'cushion',
        definition: 'Extra time or money kept in reserve in case of problems.',
        distractors: [
          'A soft seat',
          'A kind of fence post',
        ],
      },
    ],
    glossary: [
      {
        word: 'prefect',
        definition: 'A senior pupil chosen to help keep order.',
        pages: [1],
      },
      {
        word: 'records',
        definition: 'Written notes of what has happened.',
        pages: [3],
      },
      {
        word: 'hopeful',
        definition: 'Expecting good things to happen.',
        pages: [3],
      },
      {
        word: 'carpenter',
        definition: 'A person who makes and repairs things made of wood.',
        pages: [4],
      },
      {
        word: 'cushion',
        definition: 'Extra time or money kept in reserve in case of problems.',
        pages: [4, 5],
      },
      {
        word: 'schedule',
        definition: 'A plan that shows when things will be done.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Big idea: We usually underestimate how long things take because we picture everything going well; look at how similar jobs really went and plan from that. The idea is explored further in “Thinking, Fast and Slow” by Daniel Kahneman (2011). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The idea is called the planning fallacy. The story does not blame anyone, and it shows that records, a cushion, and a list of possible problems help.',
    ],
    reviewQuestions: [
      'Check that the carpenter is shown with respect.',
      'Check that the sums (4 times, 3 times, 30 days) match the numbers in the story.',
    ],
    guide: {
      overview:
        'A school-garden story that teaches why plans run late and a simple three-step way to plan better.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why the first plan failed.',
        'Use past records to plan.',
        'Write a realistic plan with a cushion.',
      ],
      subjects: [
        ['Career Technology (NaCCA CCP: project planning and management; codes to verify)', 'Planning with evidence'],
        ['Mathematics (NaCCA CCP: ratio and time; codes to verify)', 'Comparing planned and actual time'],
      ],
      before: ['Ask: when did a job take longer than you thought? What was the cause?'],
      during: ['Stop after Page 2. Ask: is it only bad luck, or is something else going on?'],
      after: ['Learners compare the planned and actual time of a recent task and make a new plan using the three rules.'],
      discussion: ['Why do we think we will finish quickly?'],
      reflection: ['What task could you plan better this week?'],
      maths: [
        {
          task: 'The library shelf was planned for 1 week and took 4. The poster was planned for 2 days and took 6. How many times longer than planned was each?',
          answer: 'Shelf: 4 times. Poster: 3 times.',
        },
        {
          task: 'A job is planned for 10 days. Using the class’s usual rule of three times longer, how long should you expect it to take?',
          answer: '10 × 3 = 30 days.',
        },
      ],
      support: ['Write the three planning rules on a card for each pupil.'],
      stretch: ['Make a Gantt-style chart for the fence with a cushion in each step.'],
      localise: ['Ask a builder, tailor, or farmer how they decide how long a job will take.'],
      factCheck: ['The story is fiction. The planning fallacy is well established in research, though the numbers here are invented. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 3
  mk({
    key: 'the-voice-note-newsletter',
    title: 'The Voice-Note Newsletter',
    summary:
      'The school newsletter costs money to print and few people read it. Efe’s team tries a cheap test with ten families, learns something surprising, and changes direction while keeping the same goal.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'learning-by-testing', 'communication', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Bright, brisk, and encouraging',
    palette: ['#0e7490', '#c026d3'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Efe: a JHS 3 girl who edits the school newsletter.',
      'Kojo: the class cartoonist and a good talker.',
      'Madam Naana: the English teacher who guides the club.',
      'Auntie Mavis: a parent who sells fruit and has little time.',
      'Nii: Efe’s younger cousin, who asks honest questions.',
    ],
    music: 'Cheerful guitar and light drums (placeholder)',
    pages: [
      pg(
        '📰',
        'The school press club printed a newsletter every month. It had news, jokes, and a cartoon by Kojo. Each issue cost money to photocopy, and the club had spent most of its savings. But when Efe, the editor, looked at the piles of leftover copies in the cupboard, she felt a pang. “We made three hundred copies,” she said. “How many did families actually read?” Nobody knew. The goal had been to keep families informed about the school. But were they? She had no way of telling, and that bothered her more than the money.',
        'A girl looking at a cupboard stacked with unread paper sheets while friends hold a comic drawing.'
      ),
      pg(
        '🔍',
        'Madam Naana, the English teacher who guided the club, gave advice. “Do not print more and hope. Do not give up either. First, find out what is really happening. Ask a few families.” So, the next day, Efe and Kojo asked ten parents and guardians whether they read the newsletter. Eight said they had not. Auntie Mavis, who sells fruit, said, “I am at the market from five in the morning until late. I do not have time to sit and read. But I listen to my phone all day.” Efe wrote down her words carefully.',
        'Two pupils interviewing a friendly fruit seller at her market stall with a notebook.'
      ),
      pg(
        '🎤',
        'That gave Efe an idea, but she did not rush to change everything. “Let us try a small test,” she said. For one week, instead of paper, she would record the news as a short voice note, in English and in Twi, and send it only to the ten families who had agreed. It cost nothing. The club decided how they would know if it worked: they would count how many families listened and ask whether they understood the news. They also asked each parent for permission first, and they sent no private details about any pupil.',
        'A girl recording a voice note on a phone in a quiet classroom corner, with her notebook open beside her.'
      ),
      pg(
        '📊',
        'The test ended on Friday. Nine of the ten families had listened. Auntie Mavis said it was the first time she had known what was happening at school. A grandfather said he liked hearing the Twi version, because it was easier than reading. Another family said it was too long. Efe wrote down the results, the good and the bad. “So the goal was right,” she said. “Our way of reaching families was wrong. We must change the method, but keep the goal.” That is called a pivot: a change of direction based on what you have learned.',
        'Efe and Kojo standing by a tally chart on the board showing nine out of ten marks.'
      ),
      pg(
        '🔄',
        'The press club made changes. The voice notes became two minutes long, no more. They kept the printed newsletter for a few copies for the notice board and for families without phones, because nobody should be left out. Kojo turned his cartoon into a short audio joke. Each month, the club asked families one question: what would you like to hear next? Costs fell. The cupboard was no longer full of unread paper. And Madam Naana made sure that every voice note was checked for accuracy and kindness before it was sent.',
        'Pupils recording and checking a short audio news item with Madam Naana listening carefully.'
      ),
      pg(
        '💡',
        'Efe wrote a note for next year’s club. “Do not fall in love with your first method. Fall in love with your goal. Test a small version quickly and cheaply, and measure what really happens. Then keep what works, and change what does not.” Many people fail not because their goal is wrong but because they refuse to learn from what happens. Efe’s club could have printed three hundred more copies and hoped. Instead, they asked, tested, learned, and changed course, and their families heard from them again.',
        'A girl writing in a notebook by a sunlit window, with a phone and a paper folder on the desk.'
      ),
    ],
    activities: [
      {
        id: 'zz-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What was the newsletter’s goal?',
        options: [
          'To make money',
          'To keep families informed about the school',
          'To win a prize',
        ],
        correctIndex: 1,
      },
      {
        id: 'zz-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What kind of test did Efe plan?',
        options: [
          'A big, costly one',
          'A small, free one with ten families who agreed',
          'No test at all',
        ],
        correctIndex: 1,
      },
      {
        id: 'zz-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What is a pivot?',
        options: [
          'Changing direction based on what you have learned, while keeping the goal',
          'Giving up',
          'Printing more copies',
        ],
        correctIndex: 0,
      },
      {
        id: 'zz-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Your class sells snacks, but few pupils buy them. Using the story, what is a good first step?',
        options: [
          'Make three times as many snacks',
          'Ask a few pupils what they would buy, then test a small change',
          'Close the stall',
        ],
        correctIndex: 1,
      },
      {
        id: 'zz-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The club sees many unread newsletters',
          'Efe and Kojo ask ten families',
          'The club tests voice notes with ten families',
          'Nine families listen and the club changes its method',
          'Printed copies are kept for those without phones',
        ],
      },
      {
        id: 'zz-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'pivot',
        definition: 'A change of direction based on what you have learned.',
        distractors: [
          'A kind of newsletter',
          'A phone setting',
        ],
      },
    ],
    glossary: [
      {
        word: 'newsletter',
        definition: 'A short report of news sent regularly to a group of people.',
        pages: [1],
      },
      {
        word: 'families',
        definition: 'Parents, guardians, and the relatives they live with.',
        pages: [2],
      },
      {
        word: 'permission',
        definition: 'Agreement that allows someone to do something.',
        pages: [3],
      },
      {
        word: 'test',
        definition: 'A try-out to see whether something works.',
        pages: [3],
      },
      {
        word: 'pivot',
        definition: 'A change of direction based on what you have learned.',
        pages: [4],
      },
      {
        word: 'accuracy',
        definition: 'Being correct and true.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Big idea: Test a small version of an idea quickly, measure what really happens, and be ready to change your method while keeping your goal. The idea is explored further in “The Lean Startup” by Eric Ries (2011). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'Safety: the story shows permission from families and no private details about pupils in the voice notes. Schools should follow their own rules on sharing pupils’ information.',
    ],
    reviewQuestions: [
      'Check the school’s own rules on sharing messages with families and pupil information.',
      'Check the sums: 90 ÷ 300 = 0.30; 9 ÷ 10 = 90 per cent.',
    ],
    guide: {
      overview:
        'A story about a press club that tests a cheap idea, learns from the result, and changes its method to reach families better.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why Efe tested a small version first.',
        'Explain what a pivot is.',
        'Design a small test for a school idea.',
      ],
      subjects: [
        ['Computing (NaCCA CCP: communication and digital tools; codes to verify)', 'Using digital tools responsibly'],
        ['Career Technology (NaCCA CCP: entrepreneurship and enquiry; codes to verify)', 'Testing an idea'],
      ],
      before: ['Ask: how do your parents or guardians usually get news about school?'],
      during: ['Stop after Page 3. Ask: how will the club know if the test worked?'],
      after: ['Learners design a one-week test for an idea at school and write how they will measure it.'],
      discussion: ['Why did Efe keep the goal but change the method?'],
      reflection: ['What idea of yours could you test cheaply?'],
      maths: [
        {
          task: 'Three hundred copies were printed and 8 of 10 families did not read them. If the club spent GH¢90 on printing, what was the cost per copy?',
          answer: '90 ÷ 300 = GH¢0.30 per copy.',
        },
        {
          task: 'Nine of ten families listened to the voice note. What percentage is that?',
          answer: '9 ÷ 10 = 90 per cent.',
        },
      ],
      support: ['Fill in a card: Idea, small test, who, how we will measure, what we will do next.'],
      stretch: ['Write a short, kind, accurate voice-note script for a class announcement.'],
      localise: ['Ask a parent how they prefer to hear school news.'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 4
  mk({
    key: 'the-washing-line-on-one-street',
    title: 'The Washing Line on One Street',
    summary:
      'Mariam dreams of washing clothes for the whole of Tamale. Her grandfather asks her to start with one street. A story about doing a small thing so well that a big thing grows from it.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'entrepreneurship', 'focus', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Warm, practical, and hopeful',
    palette: ['#7c2d12', '#0369a1'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Mariam: a determined young woman who has just finished SHS in Tamale.',
      'Alhaji Salifu: her grandfather, a retired trader who gives short, wise advice.',
      'Mr Abdul: a teacher who lives on the street with a houseful of boarders.',
      'The people of Sakasaka Street: busy families with little time.',
    ],
    music: 'Gentle drum with a warm guitar (placeholder)',
    pages: [
      pg(
        '🧺',
        'Mariam had finished SHS and wanted to start a laundry service. She had a plan so big that it made her heart race. “I will wash clothes for the whole of Tamale,” she told her grandfather, Alhaji Salifu. “Thousands of customers!” He smiled slowly. He had traded all his life. “That is a fine dream, my child,” he said. “But tell me. How will you reach the whole of Tamale on Monday morning, with two buckets and your own two hands?” Mariam opened her mouth, and then closed it.',
        'A young woman with two washing buckets looking at a town map, her grandfather smiling gently.'
      ),
      pg(
        '🏘️',
        '“Choose one street,” said Alhaji Salifu. “Not the whole town. One street. Pick the place where people need you most.” Mariam thought of Sakasaka Street, where she lived. It was full of busy people. Mr Abdul, a teacher, had six boarders in his house. Many families worked all day and had no time for washing. Mariam walked the street with her notebook. She counted forty houses. She noticed which ones had full washing lines on Sundays and which had none at all. Most had none, because nobody had time.',
        'A young woman with a notebook walking along a sunny street of houses, observing the yards.'
      ),
      pg(
        '🤝',
        'She knocked on every door and asked one question: “What is hardest about washing clothes in your house?” Some said time. Some said that school uniforms never came out white. Mr Abdul said that six boys meant a mountain of clothes every weekend. Mariam made a promise to the street: washed, dried, and returned within two days, with uniforms spotless, or no payment. She priced it fairly and wrote the prices on a card. Then she asked the first ten houses to try her for one month. Seven said yes.',
        'A young woman handing a small card to a mother at a doorway while children watch.'
      ),
      pg(
        '⭐',
        'For a month, Mariam did not think about the whole of Tamale. She thought about seven houses. She learned that Mr Abdul’s boys needed their shirts back by Sunday evening. She learned to remove ink from uniforms with lemon and sunlight. She kept a record of every order and every complaint, and fixed each complaint the same day. By the end of the month, all seven houses were delighted. “Mariam has never lost a sock,” said Mr Abdul to a neighbour, and the neighbour wrote down her number.',
        'A young woman hanging spotless white uniforms on a long washing line in the warm sun.'
      ),
      pg(
        '📈',
        'Word spread, not through adverts but through neighbours talking over the fence. By the third month, thirty of the forty houses on Sakasaka Street used her. By the sixth month, she had hired two friends and rented a small room with a proper washing area and a shaded drying yard. People from the next street came knocking. She did not run after them straight away. She first made sure Sakasaka Street was fully served. Then she took the next street, with a team ready, a method that worked, and a name that people trusted.',
        'A tidy laundry yard with two helpers folding clean clothes and neighbours smiling at the gate.'
      ),
      pg(
        '🌱',
        'Alhaji Salifu came to see the washing lines. “You did not shrink your dream,” he said. “You made it begin in a place where you could win.” Mariam wrote the lesson in her notebook. When we try to serve everybody at once, we serve nobody well. When we serve a small group completely, they tell others, and the circle widens by itself. Pick a small group, learn what they need, and do it so well that they cannot imagine going elsewhere. Then take the next step, and the next.',
        'A grandfather and granddaughter watching a laundry line full of clean clothes, with the town stretching behind.'
      ),
    ],
    activities: [
      {
        id: 'zp-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did Mariam first want to do?',
        options: [
          'Wash clothes for a single house',
          'Wash clothes for the whole of Tamale',
          'Sell washing powder',
        ],
        correctIndex: 1,
      },
      {
        id: 'zp-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What promise did Mariam make to the street?',
        options: [
          'Clothes washed within two days and spotless, or no payment',
          'The cheapest price in town',
          'Free washing for a month',
        ],
        correctIndex: 0,
      },
      {
        id: 'zp-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did most new customers hear about Mariam?',
        options: [
          'Through neighbours talking to one another',
          'Through radio adverts',
          'Through posters in town',
        ],
        correctIndex: 0,
      },
      {
        id: 'zp-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You want to start a tutoring service for all JHS pupils in town. Using the story, what is a wise first step?',
        options: [
          'Advertise to every school at once',
          'Start with one class or one street, serve them very well, then grow',
          'Give up',
        ],
        correctIndex: 1,
      },
      {
        id: 'zp-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Mariam dreams of washing for the whole town',
          'Her grandfather tells her to choose one street',
          'She asks the households what is hardest and makes a promise',
          'Seven houses try her for a month and are delighted',
          'Neighbours spread the word and she grows',
        ],
      },
      {
        id: 'zp-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'serve',
        definition: 'To provide what someone needs.',
        distractors: [
          'To spoil',
          'To count',
        ],
      },
    ],
    glossary: [
      {
        word: 'laundry',
        definition: 'Clothes that need washing, or a business that washes clothes.',
        pages: [1],
      },
      {
        word: 'boarders',
        definition: 'Pupils who live at a school or in a house away from home.',
        pages: [2],
      },
      {
        word: 'promise',
        definition: 'A firm statement that you will do something.',
        pages: [3],
      },
      {
        word: 'complaint',
        definition: 'A statement that something is wrong or unsatisfactory.',
        pages: [4],
      },
      {
        word: 'trusted',
        definition: 'Believed to be honest and reliable.',
        pages: [5],
      },
      {
        word: 'serve',
        definition: 'To provide what someone needs.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Start by serving a small group completely, rather than trying to serve everyone at once; success there creates a base to grow from. The idea is explored further in “Zero to One” by Peter Thiel with Blake Masters (2014). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is about starting small and serving well. It does not suggest crushing competitors, and Mariam does not harm other launderers.',
    ],
    reviewQuestions: [
      'Check that Tamale and the street name are acceptable as local settings, or replace with a name suited to your users.',
      'Check that the stain-removal advice (lemon and sunlight) is suitable and safe.',
    ],
    guide: {
      overview:
        'A story about a young woman who starts with one street, serves it excellently, and grows from there.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why starting with one street was wise.',
        'Describe how Mariam found what customers needed.',
        'Choose a small first group for a business idea.',
      ],
      subjects: [
        ['Career Technology (NaCCA CCP: entrepreneurship; codes to verify)', 'Starting small'],
        ['Social Studies (NaCCA CCP: socio-economic development; codes to verify)', 'Serving the community'],
      ],
      before: ['Ask: if you started a business tomorrow, who would be your first customers?'],
      during: ['Stop after Page 2. Ask: why did Mariam count the houses?'],
      after: ['Learners choose one small group and write what they need and what promise they could make.'],
      discussion: ['Is it ever a good idea to aim at everyone at once?'],
      reflection: ['Which small group around you could you serve really well?'],
      maths: [
        {
          task: 'Sakasaka Street has 40 houses. Thirty use Mariam’s service. What fraction and what percentage is that?',
          answer: '30/40 = 3/4, or 75 per cent.',
        },
        {
          task: 'Seven of the first ten houses tried her. What fraction said yes?',
          answer: '7/10.',
        },
      ],
      support: ['Draw a street with 40 houses and shade the ones served each month.'],
      stretch: ['Write a one-page plan for a service on a single street near you.'],
      localise: ['Ask a local business owner who their first customers were.'],
      factCheck: ['The story is fiction. Laundry practices and stain removal should be checked locally. The book’s title, authors, and year are given from general knowledge.'],
    },
  }),
];

export const BATCH_51_BIG_IDEAS = BATCH_51_STORIES;
