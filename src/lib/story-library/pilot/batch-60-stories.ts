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
 * Batch 60 (5 original Life Lessons stories, nine pages each, with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to Social Studies, Career Technology, Science, or Computing (see the first cultural note and the teacher guide).
 * These are original stories and articles, each teaching one idea from a well-known book. Stories list their characters; articles have none.
 * Original text written for Ghanaian learners; each factCheck note names the book behind the idea and what to verify.
 */

export const BATCH_60_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'esi-changes-her-mind',
    title: 'Esi Changes Her Mind',
    summary:
      'Esi is the best debater in JHS 3 and is sure that phones should be banned from school. While preparing, she finds facts that do not fit her view. A story about being willing to rethink, and why that makes us stronger, not weaker.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'thinking', 'open-mindedness', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Brisk, then thoughtful',
    palette: ['#7c3aed', '#0f766e'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Esi: a JHS 3 girl and captain of the debate team.',
      'Yaw: a calm debater from another school.',
      'Mrs Owusu: the debate coach.',
      'Selina: Esi’s friend, who asks honest questions.',
    ],
    music: 'Light percussion with a thoughtful flute (placeholder)',
    pages: [
      pg(
        '🎤',
        'Esi was the best debater in her school. She spoke clearly, argued fast, and almost never lost. For the regional contest, her team was given the topic: ‘Phones should be banned from schools.’ Esi was given the side in favour, and she was delighted, because she had always believed it. “Phones only distract children,” she told Selina. “I will win this easily.” She started writing her speech that night, sure of every word she wrote.',
        'A girl writing a debate speech at a desk with a confident smile.'
      ),
      pg(
        '📚',
        'Mrs Owusu, the coach, gave one rule. “Before you speak, read what the other side would say. A good debater must know the best case against her own view.” Esi sighed, but she obeyed. She read articles on both sides. To her surprise, some of the evidence on the other side was good. A rural girl used her phone to study at home when her school had no books. A pupil with a hearing difficulty used it to read captions. Esi frowned. These did not fit her speech.',
        'A girl reading articles at a library table, looking puzzled.'
      ),
      pg(
        '😬',
        'Esi felt uncomfortable. When we find facts that do not fit our beliefs, we can do two things. We can ignore them, or we can look at them honestly. At first she wanted to ignore them. “These are just exceptions,” she told herself. But a small voice asked, ‘Are they? How would I know?’ She noticed that she had enjoyed being right so much that she had stopped asking whether she was right. That was an uncomfortable thought for a champion debater.',
        'A girl sitting alone with a worried face and a notebook.'
      ),
      pg(
        '❓',
        'Selina asked her a question the next day. “What would change your mind?” Esi opened her mouth, and then closed it. She had never asked herself that. After thinking, she wrote it down: ‘If I saw that phones help many pupils learn, and that the problems can be managed, I might change my view.’ It felt strange to write, as though she were making her own side weaker. But she realised it was the opposite. A belief that cannot be tested is not a strong belief. It is just a habit.',
        'Two friends talking beside a school wall, one writing in a notebook.'
      ),
      pg(
        '🔍',
        'So Esi did what a scientist does. She tested her idea. She asked fifteen pupils and five teachers how they used phones, and she wrote down the answers. Some pupils admitted that phones distracted them in class. But others used them for dictionaries, for revision videos, and for emergency calls to their parents. One teacher said, “The problem is not the phone. The problem is when and how it is used.” Esi read her notes twice. Her idea was not entirely wrong, but it was not entirely right either.',
        'A girl interviewing pupils and a teacher and noting answers.'
      ),
      pg(
        '🔄',
        'On the evening before the contest, Esi told Mrs Owusu, “I have changed my view. I now think phones should not be banned, but they should be controlled during lessons.” She was afraid that the coach would be disappointed. Instead, Mrs Owusu smiled. “It takes courage to change your mind in public,” she said. “It takes more courage than to repeat what you already believe.” She added, “But you are assigned the side in favour of the ban. Can you argue it honestly and fairly?”',
        'A coach and a student talking in a quiet classroom at dusk.'
      ),
      pg(
        '⚖️',
        'Esi argued her assigned side, and she did it better than ever. She said what was true, which was that phones can distract and that rules matter. She did not twist facts, and she did not pretend that the other side had no good points. When Yaw spoke for the other team, she listened closely and took notes. When it was her turn to answer him, she said, “My opponent has made a fair point, and I will tell you where I agree.” The audience sat up. Many had never heard a debater say that.',
        'A girl speaking at a podium while an audience listens closely.'
      ),
      pg(
        '🏅',
        'Esi’s team did not win the cup. Yaw’s team did. But a judge spoke to her afterwards. “You were honest about the strengths of the other side,” she said, “and that made your own argument more believable. Keep that habit.” Esi shook Yaw’s hand and asked, “What is one thing you think I still have wrong?” Yaw laughed in surprise, and then gave her a careful answer. It was the best conversation she had had all year.',
        'Two debaters shaking hands in front of a trophy table.'
      ),
      pg(
        '📝',
        'That night, Esi wrote four lines in her notebook. “One: Ask, ‘What would change my mind?’ Two: Look for the best argument against what I believe. Three: Change my view when the facts change, and say so. Four: Ask people who disagree what I am missing.” Try it! Think of an opinion you hold strongly. What is the best case against it? What facts would make you rethink? Whom could you ask, politely, to tell you what you may be missing?',
        'A girl writing four lines in a notebook beside a small trophy.'
      ),
    ],
    activities: [
      {
        id: 'yf-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Esi notice about herself?',
        options: [
          'She enjoyed being right so much that she stopped asking if she was right',
          'She hated debating',
          'She forgot her speech',
        ],
        correctIndex: 0,
      },
      {
        id: 'yf-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did Esi test her idea?',
        options: [
          'She asked pupils and teachers how they used phones and wrote down the answers',
          'She guessed',
          'She copied an article',
        ],
        correctIndex: 0,
      },
      {
        id: 'yf-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why did the audience sit up when Esi spoke?',
        options: [
          'She said where she agreed with her opponent and did not twist facts',
          'She spoke very loudly',
          'She sang a song',
        ],
        correctIndex: 0,
      },
      {
        id: 'yf-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: You strongly believe something and a friend shows evidence against it. Using the story, what is a good first step?',
        options: [
          'Ignore the evidence',
          'Look at it honestly and ask what would change your mind',
          'End the friendship',
        ],
        correctIndex: 1,
      },
      {
        id: 'yf-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Esi is sure that phones should be banned',
          'She reads the best arguments against her view',
          'She asks pupils and teachers how they use phones',
          'She changes her own view but argues her assigned side honestly',
          'She asks her opponent what she may be missing',
        ],
      },
      {
        id: 'yf-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'belief',
        definition: 'Something that a person accepts as true.',
        distractors: [
          'A kind of debate',
          'A school rule',
        ],
      },
    ],
    glossary: [
      {
        word: 'debater',
        definition: 'A person who argues a case against another in a formal discussion.',
        pages: [1],
      },
      {
        word: 'evidence',
        definition: 'Facts that show whether something is true.',
        pages: [2],
      },
      {
        word: 'exceptions',
        definition: 'Cases that do not follow the general rule.',
        pages: [3],
      },
      {
        word: 'belief',
        definition: 'Something that a person accepts as true.',
        pages: [4],
      },
      {
        word: 'assigned',
        definition: 'Given as a task or role.',
        pages: [6, 7],
      },
      {
        word: 'opponent',
        definition: 'A person who argues or plays against you.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: Be willing to rethink: ask what would change your mind, seek the best case against your view, and change it when the facts change. The idea is explored further in “Think Again” by Adam Grant (2021). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is invented. The debate topic is for practice only and the story takes no side on phone policy; schools should follow their own rules.',
    ],
    reviewQuestions: [
      'Check that the story stays neutral on phone bans.',
      'Check the sums: 15 + 5 = 20 and 9/15 = 3/5.',
    ],
    guide: {
      overview:
        'A story about a debater who learns to rethink her own view and to argue fairly.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why Esi asked what would change her mind.',
        'Say why changing a view can show strength.',
        'Practise stating the best case against your own view.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: speaking and debate; codes to verify)', 'Argument and evidence'],
        ['Social Studies (NaCCA CCP: critical thinking; codes to verify)', 'Open-mindedness'],
      ],
      before: ['Ask: when did you last change your mind about something?'],
      during: ['Stop after Page 3. Ask: what should Esi do with these facts?'],
      after: ['Learners state their view on a topic, then write the best argument against it.'],
      discussion: ['Is changing your mind weak or strong? Why?'],
      reflection: ['What opinion of yours has never been tested?'],
      maths: [
        {
          task: 'Esi asked 15 pupils and 5 teachers. How many people did she ask in all?',
          answer: '15 + 5 = 20.',
        },
        {
          task: 'Of the 15 pupils, 9 said they used phones for study. What fraction is this, in simplest form?',
          answer: '9/15 = 3/5.',
        },
      ],
      support: ['Provide sentence starters: ‘A fair point on the other side is…’'],
      stretch: ['Hold a debate where each side must first state the other’s best point.'],
      localise: ['How do elders in your community listen to both sides before deciding?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge, and nothing from the book is retold.'],
    },
  }),

  // 2
  mk({
    key: 'four-oclock',
    title: 'Four O’Clock',
    summary:
      'Every day at four o’clock, Kojo sits on his bed and scrolls on his phone for hours. Instead of fighting it, he studies how the habit works and changes the middle part. A story about cues, routines, and rewards.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'habits', 'self-control', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Easy, then reflective',
    palette: ['#0369a1', '#d97706'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kojo: a JHS 2 boy who scrolls on his phone every afternoon.',
      'Auntie Pat: his aunt, a nurse who understands habits.',
      'Fiifi: his friend, who plays football after school.',
    ],
    music: 'Soft guitar with a gentle clock tick (placeholder)',
    pages: [
      pg(
        '📱',
        'Every day, Kojo came home from school at four o’clock. He dropped his bag, sat on his bed, and picked up his phone. He meant to look for five minutes. But the next time he looked at the clock, it was seven. His homework was undone, his dinner was cold, and his eyes were tired. He felt cross with himself. “Tomorrow I will not do it,” he said every evening. Every day at four o’clock, he did it again.',
        'A boy sitting on a bed scrolling on a phone with a clock showing evening.'
      ),
      pg(
        '😞',
        'Kojo tried to stop by using willpower. He put the phone in a drawer, but he took it out again. He told himself, ‘I am lazy.’ But that did not help. His aunt, Auntie Pat, a nurse who had helped patients with all kinds of habits, listened one Saturday. “Kojo,” she said, “you are not lazy. A habit is not a weakness. It is a pattern your brain has learned. We can understand it, and then we can change it.”',
        'A boy and his aunt sitting on a veranda, talking.'
      ),
      pg(
        '🔄',
        'Auntie Pat drew three boxes on paper. In the first, she wrote: Cue. In the second: Routine. In the third: Reward. “Every habit has these three parts,” she said. “The cue is the moment that starts it. The routine is what you do. The reward is the good feeling that makes your brain want to do it again.” She asked, “What is your cue?” Kojo thought. “Four o’clock, and sitting on my bed, and being tired from school.”',
        'A paper showing three boxes labelled cue, routine, and reward.'
      ),
      pg(
        '🕵️',
        '“And the reward?” asked Auntie Pat. Kojo took a while. Over the next three days he watched himself, like a detective, and wrote notes. At first he thought the reward was fun. But then he noticed that he was tired and a little stressed when he came home from school, and the phone helped him forget the day. “The reward is relief,” he wrote. “I want to switch off after school.” Auntie Pat nodded. “Good. Now you know what you are really after.”',
        'A boy writing detective-style notes in a notebook.'
      ),
      pg(
        '🧩',
        '“Here is the secret,” said Auntie Pat. “It is very hard to remove a habit. It is easier to keep the cue and the reward and change only the routine. You still need relief at four o’clock. So what else gives you relief?” Kojo smiled for the first time that week. “Football with Fiifi,” he said. “And talking to friends. That feels good after a long school day.” Auntie Pat added, “And it also uses your body, which helps your mind.”',
        'A woman pointing at the three boxes while a boy smiles.'
      ),
      pg(
        '⚽',
        'The next day, when Kojo got home at four, he did not sit on his bed. He dropped his bag, changed his shoes, and ran to the field. Fiifi was already there. They played football for forty minutes. Kojo felt tired in a good way, and the stress of school was gone. When he went home, he did his homework before supper. The cue was the same, and so was the reward of relief. Only the routine had changed.',
        'Two boys playing football on a school field in the afternoon.'
      ),
      pg(
        '💥',
        'The first week was not easy. On Wednesday it rained, and Kojo found himself on the bed with his phone. He nearly gave up. But Auntie Pat had warned him about this. “Do not say, ‘I have failed.’ Say, ‘The rain was a problem. What is my plan for rain?’” Kojo made a rainy-day routine. He called Fiifi on the family phone for ten minutes, then did stretching exercises indoors. It was not football, but it gave him relief, and it kept the habit going.',
        'A boy doing stretches in a room while rain falls outside the window.'
      ),
      pg(
        '🌟',
        'After a month, the new habit felt normal. Kojo noticed other changes. His homework was done by six, he slept better, and his marks in mathematics went up. Fiifi said, “You are in a better mood.” Kojo still used his phone, but he chose when. He did not fight the phone every day. He had changed the pattern that made him pick it up. Auntie Pat grinned. “You did not destroy your habit,” she said. “You gave it a better job.”',
        'A boy smiling with a school report beside his football.'
      ),
      pg(
        '📝',
        'That evening, Kojo wrote in his notebook. “One: Every habit has a cue, a routine, and a reward. Two: Watch yourself first, and find out what the reward really is. Three: Keep the cue and the reward, and change the routine. Four: Plan for the days that go wrong.” Try it! Choose one habit you would like to change. What is the cue? What is the reward you really want? What other routine could give you the same reward? Ask a parent, a teacher, or a counsellor for help if the habit is hard to change.',
        'A boy writing four lines in a notebook with a football beside him.'
      ),
    ],
    activities: [
      {
        id: 'yg-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What are the three parts of a habit in the story?',
        options: [
          'Cue, routine, and reward',
          'Morning, noon, and night',
          'Phone, bed, and bag',
        ],
        correctIndex: 0,
      },
      {
        id: 'yg-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Kojo find his real reward was?',
        options: [
          'Relief from the stress of school',
          'Winning a game',
          'Sleeping',
        ],
        correctIndex: 0,
      },
      {
        id: 'yg-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Auntie Pat say when Kojo slipped on the rainy day?',
        options: [
          'Make a plan for rainy days instead of saying you have failed',
          'Give up',
          'Throw the phone away',
        ],
        correctIndex: 0,
      },
      {
        id: 'yg-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: You eat sweets every time you sit to study. Using the story, what should you do first?',
        options: [
          'Stop studying',
          'Find the cue and real reward, then try a new routine for the same reward',
          'Buy more sweets',
        ],
        correctIndex: 1,
      },
      {
        id: 'yg-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Kojo scrolls on his phone every afternoon at four',
          'Auntie Pat draws cue, routine, and reward',
          'Kojo discovers the reward is relief',
          'He swaps the routine for football and a rainy-day plan',
          'His mood, sleep, and marks improve',
        ],
      },
      {
        id: 'yg-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'routine',
        definition: 'A usual set of actions that you do regularly.',
        distractors: [
          'A kind of reward',
          'A type of clock',
        ],
      },
    ],
    glossary: [
      {
        word: 'willpower',
        definition: 'The strength to control what you do.',
        pages: [2],
      },
      {
        word: 'habit',
        definition: 'Something you do regularly, often without thinking.',
        pages: [2],
      },
      {
        word: 'routine',
        definition: 'A usual set of actions that you do regularly.',
        pages: [3],
      },
      {
        word: 'reward',
        definition: 'Something good that you get for doing something.',
        pages: [3, 4],
      },
      {
        word: 'relief',
        definition: 'A feeling of comfort after worry or stress.',
        pages: [4],
      },
      {
        word: 'pattern',
        definition: 'A regular, repeated way that things happen.',
        pages: [8],
      },
    ],
    culturalNotes: [
      'Big idea: Every habit has a cue, a routine, and a reward; keep the cue and reward and change the routine, and plan for the days it goes wrong. The idea is explored further in “The Power of Habit” by Charles Duhigg (2012). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is about everyday habits. Learners who are worried about heavy phone, gaming, or other habits should talk to a trusted adult or counsellor; the story is not medical advice.',
    ],
    reviewQuestions: [
      'Check that the story does not claim that phones are bad.',
      'Check the sums: 7 - 4 = 3 and 4:40 to 6:00 = 80 minutes.',
      'Check that a counsellor or trusted-adult note is included for learners who struggle with habits.',
    ],
    guide: {
      overview:
        'A story about understanding the cue, routine, and reward of a habit and changing the routine.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Name the three parts of a habit.',
        'Explain why Kojo kept the cue and the reward.',
        'Analyse one habit of your own.',
      ],
      subjects: [
        ['Science (NaCCA CCP: health and wellbeing; codes to verify)', 'Habits and the body'],
        ['Computing (NaCCA CCP: healthy use of technology; codes to verify)', 'Using screens wisely'],
      ],
      before: ['Ask: what habit would you like to change?'],
      during: ['Stop after Page 4. Ask: what is Kojo’s real reward?'],
      after: ['Learners draw three boxes for one habit: cue, routine, reward.'],
      discussion: ['Why is it easier to change a routine than to remove a habit?'],
      reflection: ['What habit is helping you most right now?'],
      maths: [
        {
          task: 'Kojo used to scroll from 4:00 to 7:00. How many hours is that?',
          answer: '7 - 4 = 3 hours.',
        },
        {
          task: 'He now plays football for 40 minutes and finishes homework by 6:00. How many minutes is there between 4:40 and 6:00?',
          answer: '4:40 to 6:00 is 80 minutes.',
        },
      ],
      support: ['Provide a three-box template.'],
      stretch: ['Keep a habit diary for three days and find the cue and reward.'],
      localise: ['What healthy habits do elders in your community recommend?'],
      factCheck: ['The story is fiction. The cue, routine, and reward model is described in the book and is widely taught; learners differ. The book’s title, author, and year are given from general knowledge. The story is not medical advice.'],
    },
  }),

  // 3
  mk({
    key: 'the-gift-that-could-not-be-wrapped',
    title: 'The Gift That Could Not Be Wrapped',
    summary:
      'Fiifi wants to buy an expensive gift for his grandmother’s birthday, while his little sister Dede has no money at all. A story about what really matters, which is often something we cannot see in a shop.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'values', 'family', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Warm and gentle',
    palette: ['#be185d', '#ca8a04'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Fiifi: a JHS 1 boy who thinks gifts must be bought.',
      'Dede: his little sister, aged eight.',
      'Grandma Maame Afia: who lives with them.',
      'Mama: their mother.',
    ],
    music: 'Slow highlife with a soft guitar (placeholder)',
    pages: [
      pg(
        '🎂',
        'Grandma Maame Afia’s seventieth birthday was coming. Fiifi wanted to give her something grand. He had saved thirty cedis from errands and counted it every night. “A fine cloth,” he thought. “Or a shiny clock for her room.” At school, his friends boasted about the gifts they would buy. “The better the gift, the more you love her,” said one friend. Fiifi nodded. He did not stop to ask whether that was true.',
        'A boy counting coins on a bed while thinking of a gift.'
      ),
      pg(
        '🛍️',
        'On Saturday he went to the market. The cloth was forty-five cedis, and the clock was fifty. His thirty cedis could not buy either. Fiifi felt a heavy sadness. He walked home slowly, with a small bag containing one cheap handkerchief that he had bought out of embarrassment. “It is not good enough,” he told himself. “She will think I do not love her.” He did not notice that someone was watching him from the doorway.',
        'A boy walking home from a market with a small bag and a sad face.'
      ),
      pg(
        '✏️',
        'His little sister Dede was eight, and she had no money at all. But she had been busy. She had asked Mama for a clean sheet of paper and a pencil, and she sat on the floor every afternoon, drawing and writing. “What are you doing?” asked Fiifi. “It is a secret,” said Dede, covering the page. “Can I show you tomorrow?” Fiifi shrugged. He thought, ‘What can a drawing do? A grandmother needs a real gift.’',
        'A small girl drawing on the floor and covering her paper.'
      ),
      pg(
        '🙂',
        'The next day Dede showed him a small book she had made from folded paper. On each page she had drawn a memory. Grandma teaching her to pound fufu. Grandma braiding her hair. Grandma telling stories under the mango tree. Beside each picture, she had written one sentence in careful letters. Fiifi read it, and felt his throat grow tight. The drawings were a bit crooked, and the spelling was not perfect. But every page was full of something that no shop could sell.',
        'A girl showing her brother a small hand-made book of drawings.'
      ),
      pg(
        '🤔',
        'That night Fiifi lay awake. He had been so busy counting cedis that he had never asked himself what his grandmother truly wanted. When he was little, she had carried him to school on her back, and he still held that warm memory. She had stayed up with him when he had malaria. What did she need now? He realised that she did not need a clock. She had many clocks. What she wanted, he suspected, was time with her family, and to know that they remembered.',
        'A boy lying awake looking at the ceiling, thinking.'
      ),
      pg(
        '🪑',
        'In the morning, Fiifi went to Mama. “Mama, I do not have enough money for a big gift. Is there something else I can do?” Mama smiled. “Think about what she enjoys.” Fiifi remembered that Grandma loved to hear old highlife songs, and that her knees were too sore to walk to the far end of the compound, where she had once sat under the neem tree. “I could carry her chair to the shade,” he said, “and sing with her.” Mama’s eyes shone.',
        'A boy talking with his mother while holding a wooden chair.'
      ),
      pg(
        '🎶',
        'On the day of the birthday, the whole family gathered. Dede gave her paper book first. Grandma turned the pages slowly, and her eyes filled with tears. “You remember all of this?” she asked. “Everything,” said Dede. Then Fiifi carried Grandma’s chair to the shade of the neem tree. He sat beside her and sang an old highlife song, and Mama joined in. He also gave her the handkerchief, and said, “I wish I could give you more.” Grandma held his hand. “You already have.”',
        'A grandmother seated under a tree with her family singing around her.'
      ),
      pg(
        '🌅',
        'That evening, Grandma Maame Afia said something Fiifi never forgot. “I have received many gifts in seventy years. Cloth, plates, and money. I have given most of them away. But I remember the people who sat with me, and the ones who listened. The things we can wrap and carry are not always the things that last.” Fiifi nodded slowly. He did not think that gifts from shops were bad. He simply saw, for the first time, that they were not the only way to say ‘I love you’.',
        'A grandmother and grandson sitting together at sunset.'
      ),
      pg(
        '📝',
        'Fiifi wrote in his notebook. “One: Ask what the person really needs, not just what I can buy. Two: Time, attention, and memories are gifts too. Three: Do not measure love by how much money was spent. Four: Look for what matters most, which is often not on a shelf.” Try it! Think of someone you care about. What do they truly need or enjoy? What could you give them this week that costs no money, such as time, help, a message, or a song?',
        'A boy writing four lines in a notebook while his family laughs behind him.'
      ),
    ],
    activities: [
      {
        id: 'yh-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What had Dede made?',
        options: [
          'A small book of drawings of memories with Grandma',
          'A cake',
          'A cloth',
        ],
        correctIndex: 0,
      },
      {
        id: 'yh-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Fiifi realise about his grandmother?',
        options: [
          'She wanted time with her family and to know they remembered',
          'She wanted a clock',
          'She wanted money',
        ],
        correctIndex: 0,
      },
      {
        id: 'yh-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'How did Fiifi show his love in the end?',
        options: [
          'He carried her chair to the shade and sang with her',
          'He bought a clock',
          'He wrote a letter',
        ],
        correctIndex: 0,
      },
      {
        id: 'yh-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A friend’s birthday is near and you have no money. Using the story, what could you do?',
        options: [
          'Do nothing',
          'Think about what they enjoy and give time, help, or a handmade gift',
          'Borrow money',
        ],
        correctIndex: 1,
      },
      {
        id: 'yh-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Fiifi saves thirty cedis for a grand gift',
          'He finds he cannot afford the cloth or the clock',
          'Dede shows her book of drawings',
          'Fiifi asks what Grandma really needs',
          'He carries her chair to the shade and sings',
        ],
      },
      {
        id: 'yh-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'memory',
        definition: 'Something you remember from the past.',
        distractors: [
          'A kind of paper',
          'A shop',
        ],
      },
    ],
    glossary: [
      {
        word: 'grand',
        definition: 'Large and impressive.',
        pages: [1],
      },
      {
        word: 'embarrassment',
        definition: 'A feeling of shame in front of others.',
        pages: [2],
      },
      {
        word: 'crooked',
        definition: 'Not straight.',
        pages: [4],
      },
      {
        word: 'memory',
        definition: 'Something you remember from the past.',
        pages: [4, 5],
      },
      {
        word: 'compound',
        definition: 'An area of buildings and open ground shared by a family.',
        pages: [6],
      },
      {
        word: 'suspected',
        definition: 'Thought something was true without being sure.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Big idea: What matters most is often invisible and cannot be bought: care, time, and attention. The idea is explored further in “The Little Prince” by Antoine de Saint-Exupéry (1943). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is invented. It does not use the book’s characters, settings, or famous lines. It does not say that gifts bought in shops are bad; it says they are not the only way to show love.',
    ],
    reviewQuestions: [
      'Check that the story is kind to families who cannot afford gifts.',
      'Check the sums: 45 - 30 = 15 and 2026 - 1956 = 70.',
    ],
    guide: {
      overview:
        'A story about giving time and care instead of only things.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why Grandma valued the paper book.',
        'Say what Fiifi learned about gifts.',
        'Plan a gift of time or care.',
      ],
      subjects: [
        ['Our World Our People (NaCCA CCP: family and values; codes to verify)', 'Showing love and respect'],
        ['Creative Arts (NaCCA CCP: making and giving; codes to verify)', 'Handmade gifts'],
      ],
      before: ['Ask: what is the best gift you have ever received?'],
      during: ['Stop after Page 4. Ask: what is Fiifi beginning to learn?'],
      after: ['Learners make a handmade card or plan a gift of time for someone.'],
      discussion: ['What can money not buy?'],
      reflection: ['Who needs your time this week?'],
      maths: [
        {
          task: 'Fiifi has GH¢30 and the cloth costs GH¢45. How much more does he need?',
          answer: '45 - 30 = GH¢15.',
        },
        {
          task: 'Grandma is 70 years old. If she was born in the year 1956 and this is 2026, check: 2026 - 1956 = ?',
          answer: '2026 - 1956 = 70.',
        },
      ],
      support: ['Provide a card template.'],
      stretch: ['Write a letter to an elder describing a memory you share.'],
      localise: ['How do families in your community show love without spending money?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge, and no characters or lines from the book are used.'],
    },
  }),

  // 4
  mk({
    key: 'after-the-fire',
    title: 'After the Fire',
    summary:
      'A fire destroys Adwoa’s mother’s market stall. No one is hurt, but the family loses its income, and Adwoa feels hopeless. A gentle story about finding a reason to keep going when we cannot change what happened.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'resilience', 'purpose', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Quiet and gentle, with hope',
    palette: ['#b45309', '#0f766e'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Adwoa: a JHS 2 girl whose mother sells in a market.',
      'Maame Esi: her mother, a food seller.',
      'Mr Baah: a retired teacher who lives nearby.',
      'Little Kwesi: a neighbour’s child who cannot yet read.',
    ],
    music: 'Slow, warm strings with a soft drum (placeholder)',
    pages: [
      pg(
        '🔥',
        'Late one night, a fire swept through part of the market. Adwoa’s mother, Maame Esi, sold fried plantain and kenkey at a small stall there. By morning, the stall was ashes. Thankfully, no one in the market was hurt. But the cooking pots, the table, and the stock for the week were gone. Maame Esi stood looking at the black ground. Adwoa held her hand, and neither of them spoke. Adwoa had never seen her mother so quiet.',
        'A girl and her mother standing before a burnt market stall in the morning light.'
      ),
      pg(
        '🌧️',
        'The weeks that followed were hard. The family had no money coming in. Maame Esi looked for small jobs, and Adwoa’s school fees were late. Adwoa stopped doing her homework. She sat on the veranda and stared at the road. She felt hopeless. ‘What is the use?’ she thought. ‘Everything we worked for is gone.’ She felt heavy and tired, and she did not want to see her friends. She did not tell anyone how she felt, because she did not have the words.',
        'A girl sitting alone on a veranda staring at an empty road.'
      ),
      pg(
        '👴',
        'Mr Baah, a retired teacher who lived two doors away, noticed her. One evening he sat beside her on the step. He did not say, ‘Cheer up.’ He said, “I am sorry about the stall, Adwoa. That is a big loss.” Adwoa’s eyes filled with tears. It was the first time anyone had said so plainly. Mr Baah waited. After a while, he said, “I cannot change what happened. Neither can you. But we can still choose what we do next. Would you like to talk about it?”',
        'An old man and a girl sitting side by side on a step at dusk.'
      ),
      pg(
        '👦',
        'Mr Baah told her something. “Years ago I lost my own first school in a flood, with all its books. I felt as you do. What helped me was not forgetting it. It was finding something that mattered to someone else and doing it.” He added, “I am not saying it will take away the sadness. Only that a reason to get up in the morning can carry us through hard times.” Adwoa did not answer, but she listened.',
        'An old man speaking calmly to a girl who looks thoughtful.'
      ),
      pg(
        '📖',
        'The next day, little Kwesi, the neighbour’s five-year-old, came to the veranda with a torn picture book. “Can you read this?” he asked. His mother worked long hours and had no time. Adwoa opened her mouth to say no, but she looked at his hopeful face, and read the page aloud. Kwesi laughed at the animals. He asked for another page. For the first time in weeks, Adwoa felt something small and warm. It was not happiness. But it was not nothing.',
        'A girl reading a picture book to a small boy on a veranda.'
      ),
      pg(
        '🌳',
        'Soon, three more children joined Kwesi. Every afternoon, Adwoa read to them under the mango tree, and taught them letters in the sand. Mr Baah lent her books and helped her plan simple lessons. Adwoa did her own homework before the children arrived, so that she would not let them down. Nothing about the fire had changed. The stall was still gone, and money was still short. But Adwoa now had a purpose, a reason to get up, and the heaviness began to lift, a little at a time.',
        'A girl teaching children letters drawn in sand under a mango tree.'
      ),
      pg(
        '🤝',
        'The market traders gathered to rebuild. Maame Esi was invited to share a stall until she could afford her own. Neighbours lent a pot, a table, and a gas ring. One said, “We have all lost something, and we will help one another.” Maame Esi cried quietly, and then smiled. When she saw Adwoa teaching the children, she said, “I did not notice how you were helping others while you were hurting. I am proud of you.” Adwoa leaned on her mother’s shoulder.',
        'Market traders rebuilding a stall together while a mother watches her daughter.'
      ),
      pg(
        '💬',
        'Some days were still hard. Adwoa sometimes woke up sad, and she learned that this was normal. Mr Baah told her, “It is good to talk to someone you trust when the sadness is strong. If it stays for a long time, tell your mother, a teacher, or the school counsellor. There is no shame in asking for help.” Adwoa promised she would. She also kept her afternoon lessons, because they gave her days a shape and a reason.',
        'A girl and an old man talking while children play in the background.'
      ),
      pg(
        '📝',
        'Adwoa wrote in her notebook one evening. “One: Some things I cannot change. I can still choose how I meet them. Two: A reason to get up, like helping someone, can carry me through a hard time. Three: It is all right to feel sad, and to say so. Four: When the sadness is heavy, talk to someone I trust, such as a parent, a teacher, or a counsellor.” Try it! If you or someone you know is going through a hard time, whom can you talk to? What small, kind thing could you do for someone else this week?',
        'A girl writing in a notebook while children read behind her.'
      ),
    ],
    activities: [
      {
        id: 'yi-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Mr Baah say first to Adwoa?',
        options: [
          'That he was sorry about the stall and it was a big loss',
          'To cheer up',
          'To forget it',
        ],
        correctIndex: 0,
      },
      {
        id: 'yi-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What gave Adwoa a small, warm feeling again?',
        options: [
          'Reading to little Kwesi',
          'Watching television',
          'Selling plantain',
        ],
        correctIndex: 0,
      },
      {
        id: 'yi-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'How did the market traders help Maame Esi?',
        options: [
          'They shared a stall and lent her things',
          'They ignored her',
          'They moved away',
        ],
        correctIndex: 0,
      },
      {
        id: 'yi-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A classmate seems very sad after a loss. Using the story, what could you do?',
        options: [
          'Tell them to cheer up',
          'Say you are sorry, listen, and encourage them to talk to a trusted adult',
          'Avoid them',
        ],
        correctIndex: 1,
      },
      {
        id: 'yi-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'A fire destroys the market stall',
          'Adwoa feels hopeless and stops doing her homework',
          'Mr Baah listens and tells her she can choose what to do next',
          'Adwoa reads to the children under the mango tree',
          'The traders help the family rebuild',
        ],
      },
      {
        id: 'yi-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'hopeless',
        definition: 'Feeling that nothing good will happen.',
        distractors: [
          'Very happy',
          'Very busy',
        ],
      },
    ],
    glossary: [
      {
        word: 'stall',
        definition: 'A small open shop in a market.',
        pages: [1],
      },
      {
        word: 'hopeless',
        definition: 'Feeling that nothing good will happen.',
        pages: [2],
      },
      {
        word: 'retired',
        definition: 'No longer working because of age.',
        pages: [3],
      },
      {
        word: 'counsellor',
        definition: 'A person trained to listen and help with problems.',
        pages: [8],
      },
      {
        word: 'purpose',
        definition: 'A reason for doing something.',
        pages: [6],
      },
      {
        word: 'rebuild',
        definition: 'To build again.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: When we cannot change what has happened, we can choose how to meet it, and a reason to keep going, such as helping someone else, can carry us through a hard time. The idea is explored further in “Man’s Search for Meaning” by Viktor E. Frankl (1946). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'This story is about loss and sadness. It is invented and gentle, with no one hurt in the fire. It does not retell any part of the book. Teachers should read it first and be ready to point learners to the school counsellor or a trusted adult. It is not a substitute for professional help.',
    ],
    reviewQuestions: [
      'Read the story before using it. It deals with loss and sadness.',
      'Check that the school counsellor or a trusted adult is named for learners who need support.',
      'Check the sums: 200 × 6 = 1,200 and 1 + 3 = 4.',
    ],
    guide: {
      overview:
        'A gentle story about finding purpose and support after a loss.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why Adwoa felt better after reading to the children.',
        'Say whom to talk to when sadness is heavy.',
        'Plan a small kind act for someone else.',
      ],
      subjects: [
        ['Our World Our People (NaCCA CCP: community and wellbeing; codes to verify)', 'Coping with loss'],
        ['English Language (NaCCA CCP: reading aloud; codes to verify)', 'Reading to others'],
      ],
      before: ['Ask: how can a community help a family that has lost something?'],
      during: ['Stop after Page 4. Ask: what is Adwoa feeling, and what helps?'],
      after: ['Learners list trusted people they could talk to and one kind act they could do.'],
      discussion: ['Why did Mr Baah begin by saying he was sorry?'],
      reflection: ['Whom do you trust when you feel sad?'],
      maths: [
        {
          task: 'The family earned GH¢200 a week from the stall. How much did they lose in 6 weeks?',
          answer: '200 × 6 = GH¢1,200.',
        },
        {
          task: 'Kwesi’s group grew from 1 child to 4. How many children did Adwoa teach in all?',
          answer: '1 + 3 = 4 children.',
        },
      ],
      support: ['Provide a card listing trusted adults at school.'],
      stretch: ['Plan a reading hour for younger children.'],
      localise: ['How does your community help families after a fire or flood?'],
      factCheck: ['The story is fiction. The market fire is invented, and no one is hurt. The book’s title, author, and year are given from general knowledge; its content is not retold. Counsellor contact details for your school must be added by the teacher. The story is not mental health advice.'],
    },
  }),

  // 5
  mk({
    key: 'the-boy-who-greeted-in-three-languages',
    title: 'The Boy Who Greeted in Three Languages',
    summary:
      'Mawuli moves from the Volta Region to a school in the north, where he does not understand the language. He decides to learn greetings from his classmates, makes mistakes, and makes friends. A story about language as a bridge between people.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'language', 'friendship', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Lively and funny, then warm',
    palette: ['#0d9488', '#b45309'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Mawuli: a JHS 1 boy from the Volta Region who speaks Ewe and English.',
      'Abdul: a classmate who speaks Dagbani and English.',
      'Akosua: a classmate who speaks Twi and English.',
      'Madam Zenabu: the class teacher.',
    ],
    music: 'Mix of light drum and xylophone (placeholder)',
    pages: [
      pg(
        '🚌',
        'Mawuli’s father had been posted to work in the north, so the family moved. Mawuli sat on the bus for many hours, looking out of the window and feeling nervous. At home, he spoke Ewe with his friends and everyone understood him. In his new school, he knew only English and a little Twi. On his first morning, he listened to the other pupils chatting in Dagbani and Twi and felt as though he were behind a glass wall.',
        'A boy on a bus looking out of the window at a new landscape.'
      ),
      pg(
        '😶',
        'In class, he did not speak. When Madam Zenabu asked him to introduce himself, he said, “My name is Mawuli,” in a very small voice. Some pupils smiled kindly, and some looked curious. At break, he sat alone. He felt sad and a little cross. He thought, ‘They will never understand me.’ He did not notice that a boy named Abdul and a girl named Akosua had seen him sitting alone and were whispering together.',
        'A boy sitting alone at break while two classmates whisper nearby.'
      ),
      pg(
        '👋',
        'The next day, Abdul came up to him. “Dasiba,” he said, grinning. “That is good morning in Dagbani.” Mawuli copied him, but he said it too slowly. Abdul laughed, though not unkindly. “Dasiba! Try again.” Akosua joined them. “In Twi, we say Maakye.” Mawuli tried. “Maakye.” Then he had an idea. “In Ewe, we say Ndi,” he said. They tried to copy him. Within minutes, all three were laughing at one another’s accents.',
        'Three children trying greetings in different languages and laughing.'
      ),
      pg(
        '📓',
        'Mawuli decided to learn more. He carried a small notebook and asked his classmates for simple words: please, thank you, how are you, I am sorry. Each pupil taught him something and asked him to teach something back in Ewe. He made mistakes. Once he said something in Dagbani that made the whole group roar with laughter, because he had mixed up two similar words. Mawuli went red, but then he laughed too. “At least I am trying!” he said. Humour made the mistakes feel safe.',
        'A boy writing new words in a notebook while classmates laugh with him.'
      ),
      pg(
        '🌍',
        'Madam Zenabu noticed what was happening. “You are building a bridge,” she told Mawuli. “Language is more than words. When you use someone’s language, even badly, you tell them you respect them.” She asked the class to teach a greeting from their home languages every Monday. Soon, the morning assembly had Ewe, Twi, Dagbani, Ga, and English greetings. Pupils who had been shy about their home languages felt proud. The classroom began to sound like a small Ghana.',
        'A class of children greeting one another in many languages at assembly.'
      ),
      pg(
        '🛍️',
        'One Saturday, Mawuli went to the market with Abdul’s mother. A trader was trying to explain something to a customer, and they could not understand each other. Mawuli listened. He knew a few words in Dagbani and a few in Twi, and he could tell they were arguing over a price. He did not understand everything, but he said politely in Twi, “Please, she is asking for the price of the beans,” and Abdul’s mother turned that into Dagbani. The two women laughed, and the sale was made.',
        'A boy helping a trader and a customer understand each other in a market.'
      ),
      pg(
        '💭',
        'That evening, Mawuli thought about how he had felt on the first day. The glass wall had been real. But it had not been made of language alone. It had been made of fear, and of waiting for others to speak first. When he began to say a few words and laugh at his mistakes, the wall became thin. He realised that the first step belongs to the person who feels left out, and also to the people who see them. Abdul and Akosua had taken that step for him.',
        'A boy sitting on a veranda at evening, thinking quietly.'
      ),
      pg(
        '🤝',
        'Months later, a new girl joined the class from the far north. She spoke only Gurene, and she sat quietly at the back. Mawuli noticed. The next day, he went to her desk, smiled, and said the only greeting he could find, which was a few clumsy words. She laughed, then taught him the right words. Within a week, the whole class knew how to greet in Gurene. Madam Zenabu smiled at Mawuli across the room. He had made himself a bridge for someone else.',
        'A boy greeting a new girl at her desk while classmates smile.'
      ),
      pg(
        '📝',
        'Mawuli wrote in his notebook. “One: Learn a few words of someone’s language, even if I make mistakes. Two: Laugh at my own mistakes, but never at a person. Three: The one who feels left out can take a first step, and so can the one who sees them. Four: Languages are treasures, and every home language deserves respect.” Try it! What greetings do you know in languages other than your own? Whom could you greet in their language this week? Ask a speaker to check that you say the words correctly.',
        'A boy writing in a notebook with greetings from many languages around him.'
      ),
    ],
    activities: [
      {
        id: 'yj-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'How did Abdul and Akosua first help Mawuli?',
        options: [
          'They taught him greetings in their languages and learned his',
          'They ignored him',
          'They laughed at him unkindly',
        ],
        correctIndex: 0,
      },
      {
        id: 'yj-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Madam Zenabu say language is more than?',
        options: [
          'Words, because using someone’s language shows respect',
          'A subject at school',
          'A game',
        ],
        correctIndex: 0,
      },
      {
        id: 'yj-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Mawuli realise about the “glass wall”?',
        options: [
          'It was made of fear and waiting for others to speak first, not only language',
          'It was a real wall',
          'It was made of paper',
        ],
        correctIndex: 0,
      },
      {
        id: 'yj-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A new pupil from another region joins your class. Using the story, what could you do?',
        options: [
          'Ignore them',
          'Greet them, learn a word of their language, and teach them one of yours',
          'Laugh at their accent',
        ],
        correctIndex: 1,
      },
      {
        id: 'yj-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Mawuli moves north and feels behind a glass wall',
          'Abdul and Akosua teach him greetings',
          'Madam Zenabu starts Monday greetings for the class',
          'Mawuli helps two traders understand each other',
          'He welcomes a new girl in her language',
        ],
      },
      {
        id: 'yj-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'respect',
        definition: 'A feeling of admiration and care for someone.',
        distractors: [
          'A kind of word',
          'A type of market',
        ],
      },
    ],
    glossary: [
      {
        word: 'posted',
        definition: 'Sent to work in a particular place.',
        pages: [1],
      },
      {
        word: 'accents',
        definition: 'Ways of pronouncing words that show where people come from.',
        pages: [3],
      },
      {
        word: 'humour',
        definition: 'The quality of being funny.',
        pages: [4],
      },
      {
        word: 'respect',
        definition: 'A feeling of admiration and care for someone.',
        pages: [5],
      },
      {
        word: 'bridge',
        definition: 'Something that connects two sides.',
        pages: [5],
      },
      {
        word: 'clumsy',
        definition: 'Awkward or not skilful.',
        pages: [8],
      },
    ],
    culturalNotes: [
      'Big idea: Learning even a little of someone else’s language, and laughing kindly at our own mistakes, builds bridges between people. The idea is explored further in “Born a Crime” by Trevor Noah (2016). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is invented. It does not retell the book, which has mature themes and is written for adults; only the idea of language as a bridge is used. The greetings (Dasiba in Dagbani, Maakye in Twi, Ndi in Ewe) should be confirmed with speakers of those languages. Gurene is named only as a language, with no greeting given.',
    ],
    reviewQuestions: [
      'Ask speakers of Dagbani, Twi, and Ewe to confirm the greetings.',
      'Check that the story is respectful of all languages and regions.',
      'Check the sums: 5 × 12 = 60 and 4 × 5 = 20.',
    ],
    guide: {
      overview:
        'A story about using language to build friendships across regions.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain how Mawuli made friends.',
        'Say why home languages deserve respect.',
        'Learn a greeting in another language.',
      ],
      subjects: [
        ['Ghanaian Language (NaCCA CCP: greetings and respect; codes to verify)', 'Greetings across languages'],
        ['Our World Our People (NaCCA CCP: unity in diversity; codes to verify)', 'Welcoming others'],
      ],
      before: ['Ask: how many languages can you greet in?'],
      during: ['Stop after Page 3. Ask: what should Mawuli do next?'],
      after: ['Learners teach each other a greeting from their home language.'],
      discussion: ['Why can laughing together help, and when can laughing hurt?'],
      reflection: ['Who in your class might feel left out, and what could you say to them?'],
      maths: [
        {
          task: 'The class greets in five languages each Monday. How many greetings are in a school term of 12 Mondays, if each Monday has 5 greetings?',
          answer: '5 × 12 = 60 greetings.',
        },
        {
          task: 'Mawuli learns 4 new words a day for 5 days. How many words has he learned?',
          answer: '4 × 5 = 20 words.',
        },
      ],
      support: ['Provide a greeting card to fill in with languages.'],
      stretch: ['Make a class greeting wall with five languages.'],
      localise: ['Which languages are spoken in your community, and what greetings do they use?'],
      factCheck: ['The story is fiction. The greetings should be confirmed with speakers of each language. The book’s title, author, and year are given from general knowledge, and its adult content is not used.'],
    },
  }),
];

export const BATCH_60_LIFE_LESSONS = BATCH_60_STORIES;
