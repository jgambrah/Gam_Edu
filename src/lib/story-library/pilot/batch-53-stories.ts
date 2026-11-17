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
  brief: `Warm hand-painted gouache scene, landscape 4:3, following the character notes exactly. ${alt} Keep a calm, uncluttered area for text.`,
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
 * Batch 53 (5 original Life Lessons stories and articles, nine pages each, with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to Social Studies, Career Technology, Science, or Computing (see the first cultural note and the teacher guide).
 * These are original stories and articles, each teaching one idea from a well-known book. Stories list their characters; articles have none.
 * Original text written for Ghanaian learners; each factCheck note names the book behind the idea and what to verify.
 */

export const BATCH_53_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'the-emperors-private-notebook',
    title: 'The Emperor’s Private Notebook',
    summary:
      'The most powerful man in the Roman world wrote notes to himself on staying calm and doing right. This article shares five of his ideas and shows how a JHS pupil in Ghana can use them today.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'self-control', 'philosophy', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Calm, thoughtful, and steady',
    palette: ['#475569', '#b45309'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Slow, calm strings with a soft drum (placeholder)',
    pages: [
      pg(
        '📓',
        'About 1,900 years ago, a man who ruled much of the known world sat down at night and wrote in a private notebook. He was Marcus Aurelius, the emperor of Rome, who ruled from the year 161 to 180. He wrote in Greek, and he wrote only for himself. The pages are not boastful. They are reminders, the way you might write notes to yourself before a hard exam: stay calm, be fair, do not waste time. Nobody knows if he ever wanted others to read them. But the notebook survived, and today we call it Meditations.',
        'An old scroll and an oil lamp on a wooden table at night, with a reed pen beside them.'
      ),
      pg(
        '🏛️',
        'Marcus Aurelius had power, but his life was not easy. He led armies in long wars on the far borders of the empire. A terrible sickness swept through his lands and killed many. He also lost several of his own children, which is one of the deepest sorrows a person can know. He could not control wars, plagues, or death. What he could do was train his own mind. So his notebook is not about winning. It is about how to stay steady and decent when much of what happens is beyond our control.',
        'A tired but calm man in plain robes looking out over a wide camp landscape at dusk.'
      ),
      pg(
        '⭕',
        'His first idea is to separate what is up to you from what is not. What is up to you? Your thoughts, your choices, your effort, and how you treat other people. What is not? The weather, what others think of you, the result of a match, and the questions on an examination. Imagine you are about to write an exam. You cannot control the questions. You can control how well you revise and how calmly you answer. When you spend your energy only on the first group, you feel stronger and less afraid.',
        'A Ghanaian JHS pupil calmly studying at a wooden desk with an open notebook divided neatly into two sections.'
      ),
      pg(
        '🌅',
        'His second idea is to prepare in the morning. He reminded himself that during the day he would meet people who were rude, careless, or ungrateful, and that this should not shock him, because such people act out of ignorance. He did not want to become like them. This does not mean accepting harm. If someone bullies or threatens you, tell a teacher or another trusted adult. But in the ordinary pushing and shouting of a busy day, such as a loud queue or a grumpy shopkeeper, being ready helps you to stay calm and kind.',
        'A pupil at dawn writing quietly in a notebook before leaving home, with a sunlit Ghanaian street beyond.'
      ),
      pg(
        '🔥',
        'His third idea is that anger usually costs more than the thing that caused it. Suppose a classmate breaks your pencil. It is annoying, but a pencil costs very little. Yet you might stay angry all day, lose your concentration, and say hurtful things, which cost much more. Marcus noticed that the damage from anger is often worse than the trouble that began it. So when you feel it rising, pause. Breathe slowly. Ask yourself, “Will this matter next week?” Often it will not, and you will be glad you waited before you spoke.',
        'A pupil holding a broken pencil and taking a slow breath, with a calm, composed expression.'
      ),
      pg(
        '⛰️',
        'His fourth idea is to look at things from above. Imagine standing on the Akuapem hills and seeing the whole plain below, with its roads, houses, and fields. From up there, a quarrel over a seat seems very small. Marcus used this picture whenever his worries felt too large. He reminded himself that people have lived, worried, and passed away for thousands of years, and that time is vast. This does not make life meaningless. It reminds us to spend our short time on things that matter, such as kindness, learning, and honest work.',
        'A green hilltop view on the Akuapem ridge overlooking a wide plain with tiny roofs and winding roads below.'
      ),
      pg(
        '🤲',
        'His fifth idea is that we are made to work together. Marcus wrote that he should get up and do his work as a human being, useful to others, not stay in bed. In Ghana, farmers have a tradition called nnoboa, in which neighbours help one another on each other’s farms in turn. It is the same spirit. A person who does their duty and helps their community usually feels better than one who thinks only of comfort. A small job done for others, like cleaning the classroom or fetching water for an elder, is part of a good life.',
        'Ghanaian neighbours working together cheerfully on a green farm, passing young seedlings along a line.'
      ),
      pg(
        '💬',
        'Some people think this sort of thinking makes a person cold. It does not. Marcus felt grief and tiredness like anyone. The point is not to have no feelings, but not to be ruled by them. If you are sad, it is right to be sad, and to talk to someone about it. If a problem is too heavy, ask for help. He also kept a habit that you can copy: each evening, he looked back on the day. What did I do well? Where did I fall short? What will I do differently tomorrow? That small review is a form of honest self-care.',
        'A girl sitting with her grandmother on a veranda in the evening, talking quietly under a warm lamp.'
      ),
      pg(
        '📓',
        'Try making your own small notebook for one week. In the morning, write one line: “What is up to me today?” In the evening, write another: “What did I handle well, and what will I try next time?” Add a third line if you like: “Whom did I help?” You do not need to be an emperor. Marcus Aurelius was an ordinary person with a great deal on his shoulders, who tried to become a bit better each day. That is something every one of us can do, from JHS onwards.',
        'An open lined notebook with a pen resting beside a warm study lamp on a tidy wooden desk.'
      ),
    ],
    activities: [
      {
        id: 'xh-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Which of these is up to you, according to the article?',
        options: [
          'The weather',
          'Your effort and how you treat people',
          'The questions on an exam',
        ],
        correctIndex: 1,
      },
      {
        id: 'xh-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why does the article say anger often costs more than its cause?',
        options: [
          'Because anger is loud',
          'Because the damage we do while angry is often worse than the original trouble',
          'Because pencils are expensive',
        ],
        correctIndex: 1,
      },
      {
        id: 'xh-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What is nnoboa?',
        options: [
          'A kind of exam',
          'A farming tradition in which neighbours help each other in turn',
          'A type of notebook',
        ],
        correctIndex: 1,
      },
      {
        id: 'xh-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: Before your final exam, you feel very anxious about the questions. Using the article, what is a good step?',
        options: [
          'Worry about every possible question',
          'Focus on revision and calm answering, and ask for help if the worry is heavy',
          'Stay away from school',
        ],
        correctIndex: 1,
      },
      {
        id: 'xh-s1',
        type: 'sequencing',
        prompt: 'Put the five ideas in the order the article presents them.',
        items: [
          'Separate what is up to you from what is not',
          'Prepare in the morning for difficult people',
          'Anger often costs more than its cause',
          'Look at things from above',
          'We are made to work together',
        ],
      },
      {
        id: 'xh-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'concentration',
        definition: 'The ability to keep your mind on one thing.',
        distractors: [
          'A kind of pencil',
          'A loud noise',
        ],
      },
    ],
    glossary: [
      {
        word: 'emperor',
        definition: 'A ruler of a large empire.',
        pages: [1],
      },
      {
        word: 'plagues',
        definition: 'Serious diseases that spread quickly and kill many people.',
        pages: [2],
      },
      {
        word: 'effort',
        definition: 'Hard work towards a goal.',
        pages: [3],
      },
      {
        word: 'ignorance',
        definition: 'Lack of knowledge or understanding.',
        pages: [4],
      },
      {
        word: 'concentration',
        definition: 'The ability to keep your mind on one thing.',
        pages: [5],
      },
      {
        word: 'vast',
        definition: 'Extremely large.',
        pages: [6],
      },
      {
        word: 'duty',
        definition: 'Something you should do because it is right.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: Separate what is up to you from what is not, stay calm, do your duty, and look at things in perspective. The idea is explored further in “Meditations” by Marcus Aurelius (written in the second century, first printed in the sixteenth century). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The article treats this as practical advice, not a religion. It states that bullying and harm must be reported to trusted adults and that sadness should be shared.',
    ],
    reviewQuestions: [
      'Check the dates (161 to 180) and the fact that Marcus Aurelius wrote in Greek.',
      'Check the description of nnoboa with a local teacher or a farmer.',
      'Check that the mention of the loss of children is handled gently for the class.',
    ],
    guide: {
      overview:
        'An article presenting five practical ideas from a Roman emperor’s private notebook and showing how to apply them in Ghana today.',
      lessonMinutes: 45,
      goals: [
        'Name the five ideas.',
        'Sort things into “up to me” and “not up to me”.',
        'Explain how to pause when angry.',
        'Keep a three-line daily notebook for a week.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: personal development and responsible citizenship; codes to verify)', 'Self-control and service'],
        ['English Language (NaCCA CCP: reading and journal writing; codes to verify)', 'Writing a reflective notebook'],
      ],
      before: ['Ask: what makes you angry quickly? What do you do?'],
      during: ['Stop after Page 3. Learners list five things in each circle from their own week.'],
      after: ['Learners keep a three-line notebook for one week and share one entry with a partner.'],
      discussion: ['Is it always wise to stay calm? When might anger be right?'],
      reflection: ['What is up to you this week that you have been ignoring?'],
      maths: [
        {
          task: 'Marcus Aurelius ruled from 161 to 180. How many years was that?',
          answer: '180 - 161 = 19 years.',
        },
        {
          task: 'About how many years ago did he begin to rule, counting to 2026?',
          answer: '2026 - 161 = 1,865 years, so about 1,900 years.',
        },
      ],
      support: ['Provide a two-column template: up to me, not up to me.'],
      stretch: ['Find a proverb from your language that teaches patience or self-control and compare it with an idea in the article.'],
      localise: ['Ask an elder how they stay calm under pressure.'],
      factCheck: ['Marcus Aurelius ruled 161 to 180 and wrote in Greek. The plague and the loss of children are historically recorded. The description of nnoboa should be checked locally. The book’s title and author are given from general knowledge.'],
    },
  }),

  // 2
  mk({
    key: 'the-flooded-pitch',
    title: 'The Flooded Pitch',
    summary:
      'Heavy rain leaves the school pitch under water a week before the big match. The team can complain, or they can ask what the flood can teach them. A story about turning an obstacle into a step.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'resilience', 'sports', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Lively, then determined and warm',
    palette: ['#0369a1', '#15803d'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Naana: the JHS 3 football captain, determined and fair.',
      'Mr Yeboah: the sports master, calm and practical.',
      'Baba Kwabena: the school groundskeeper, who knows the compound well.',
      'Selorm: the goalkeeper, funny and easily discouraged.',
      'Esi: a substitute who always carries a notebook.',
    ],
    music: 'Rain on tin, then a rising drumbeat (placeholder)',
    pages: [
      pg(
        '🌧️',
        'It rained for three nights, and on Monday morning the school football pitch looked like a lake. Naana, the captain, stood at the edge with her boots in her hand. The inter-school match was in nine days, and the team had not yet practised once on grass. “It is finished,” said Selorm, the goalkeeper. “We cannot train. We will lose.” Others groaned. A few said that the weather was against them. Naana said nothing for a long time. She was disappointed too. But she was also thinking.',
        'A flooded school football pitch with the goalposts standing in water and a team looking on.'
      ),
      pg(
        '🔍',
        'Mr Yeboah, the sports master, came and stood beside her. “You can be angry,” he said, “or you can look carefully. Which will help?” Naana took a breath. “Look carefully, sir.” “Good. Why is the pitch flooded? It has rained before, and it did not look like this.” Naana looked at the low corner, where the water was deepest. The usual drain was just a patch of brown water. “Perhaps it is blocked,” she said. “Perhaps. Do not guess,” said Mr Yeboah. “Find out. And remember, you cannot change the rain. You can change what you do about it.”',
        'A teacher and a girl captain crouching at the edge of the water, pointing at the low corner.'
      ),
      pg(
        '🧤',
        'They asked Baba Kwabena, the groundskeeper, who had worked at the school for twenty years. He took them to the low corner and pointed with his stick. A culvert, a short concrete pipe under the path, was stuffed with leaves, plastic bags, and mud. “It has not been cleared since last year,” he said. The students wanted to jump in. Baba Kwabena raised a hand. “Not so fast. Gloves, boots, and an adult beside you. And we do not go into deep water.” That was good sense. He handed out gloves, and the team worked in a line.',
        'A groundskeeper handing out work gloves while pupils in rubber boots prepare to clear a blocked culvert beside the pitch.'
      ),
      pg(
        '⛏️',
        'By noon, the culvert was open, and the water began to drain with a gurgle. But the pitch stayed soft and boggy, and it would take days to dry. Naana called a meeting. “We cannot play on the pitch yet. So what can we do?” Esi, the substitute, opened her notebook. “We could dig a shallow channel along the low side to help the water run away. And we could practise on the concrete court behind the classrooms, where it is dry. It is small, but it is something.” Everyone agreed. They fetched spades, and Baba Kwabena marked where to dig.',
        'Pupils digging a shallow channel along the edge of the pitch while Baba Kwabena marks the line with a stick.'
      ),
      pg(
        '🏀',
        'The concrete court was narrow and hard. They could not run long passes or take big shots. So they practised short passes, quick turns, and keeping the ball close to their feet. At first it was frustrating, and the ball bounced oddly. But after three days, something strange happened. Their touch had improved. Selorm, who could not dive on concrete, worked on his footwork and his catching in the small space. “It is like practising in a phone booth,” he laughed. “Then the big pitch will feel like a palace.” The team was learning exactly what a flooded pitch could not take away.',
        'Pupils practising quick short passes and turns on a small concrete court behind classrooms under a bright sky.'
      ),
      pg(
        '😞',
        'Not everything went well. On Thursday, a heavy shower came again and the channel overflowed, and the pitch was soft once more. Selorm groaned. “All that work, for nothing!” Naana waited a moment and then said, “It is true. We cannot control the rain. But look at the drain.” The culvert was running clear, and the water was already draining faster than before. “Without the work, we would be under water for a week.” She smiled. “Some things we can fix. Some things we must accept. Wise people know the difference.”',
        'A girl captain pointing at a clear, running drain while rain falls lightly and teammates watch.'
      ),
      pg(
        '☀️',
        'By Saturday, the pitch was damp but playable. On the morning of the match, the sky was grey and the ground was wet. The other school complained loudly about the slippery grass. Naana’s team had expected this. They had trained for tight spaces, quick passes, and careful footing, and a wet pitch rewarded exactly those things. Selorm made two fine saves. In the second half, a neat short pass from Esi set up a goal. The final whistle blew with Naana’s team ahead by two goals to one, and the touchline erupted in cheers.',
        'A school football team celebrating joyfully on a damp green pitch under a grey sky.'
      ),
      pg(
        '🏆',
        'Afterwards, Mr Yeboah asked them what they had learned. Esi answered first. “That the problem showed us the way. If the pitch had not flooded, we would never have cleared the culvert, and we would never have practised short passes.” Selorm added, “And that it is no use complaining about the rain.” Naana nodded. “First, see clearly, without panic. Second, do the next small thing that you can do. Third, accept what you cannot change.” Mr Yeboah wrote the three steps on the board, and they stayed there all term.',
        'A happy school football team sitting together on the grass touchline listening attentively to their sports master.'
      ),
      pg(
        '💡',
        'That night, Naana wrote in her notebook. “The obstacle was not in the way. It was the way.” She did not mean that every problem is a gift, for some problems are painful and cannot be fixed by effort alone, and then we need help from others. She meant that many setbacks, if we meet them calmly and act, can make us stronger and teach us something we would not have learned otherwise. The next time something blocks your path, ask: What is really happening? What can I do today? And what must I accept? Then begin.',
        'A girl writing in her notebook by lamplight with a clean pair of football boots resting beside her.'
      ),
    ],
    activities: [
      {
        id: 'xi-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What had blocked the water on the pitch?',
        options: [
          'A broken tap',
          'A culvert stuffed with leaves, plastic, and mud',
          'A fallen tree',
        ],
        correctIndex: 1,
      },
      {
        id: 'xi-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did practising on the small concrete court help the team?',
        options: [
          'It improved their touch and quick passing',
          'It tired them out',
          'It made no difference',
        ],
        correctIndex: 0,
      },
      {
        id: 'xi-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why did the wet pitch suit Naana’s team on match day?',
        options: [
          'They were taller',
          'They had trained for short passes and careful footing',
          'The other team was absent',
        ],
        correctIndex: 1,
      },
      {
        id: 'xi-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: Your class vegetable bed is flooded by a blocked drain days before the school fair. Using the story, what is a good first step?',
        options: [
          'Complain about the rain',
          'Find the cause calmly, then do the next small safe thing with an adult’s help',
          'Cancel the fair',
        ],
        correctIndex: 1,
      },
      {
        id: 'xi-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Rain floods the pitch a week before the match',
          'The team finds and clears the blocked culvert',
          'They practise short passes on the concrete court',
          'A second shower tests the drain',
          'The team wins the match on the wet pitch',
        ],
      },
      {
        id: 'xi-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'culvert',
        definition: 'A pipe or channel that carries water under a road or path.',
        distractors: [
          'A kind of football boot',
          'A school gate',
        ],
      },
    ],
    glossary: [
      {
        word: 'captain',
        definition: 'The leader of a sports team.',
        pages: [1],
      },
      {
        word: 'culvert',
        definition: 'A pipe or channel that carries water under a road or path.',
        pages: [3],
      },
      {
        word: 'gloves',
        definition: 'Coverings for the hands that protect them.',
        pages: [3],
      },
      {
        word: 'channel',
        definition: 'A narrow ditch that carries water away.',
        pages: [4],
      },
      {
        word: 'frustrating',
        definition: 'Making you feel annoyed because you cannot do something.',
        pages: [5],
      },
      {
        word: 'accept',
        definition: 'To agree that something cannot be changed.',
        pages: [6, 8],
      },
      {
        word: 'setbacks',
        definition: 'Events that delay or block progress.',
        pages: [9],
      },
    ],
    culturalNotes: [
      'Big idea: Meet obstacles calmly, see them clearly, do the next thing that you can do, and accept what you cannot change; an obstacle can become a step. The idea is explored further in “The Obstacle Is the Way” by Ryan Holiday (2014). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'Safety: the story shows gloves, boots, and an adult supervising. Children must not enter deep or dirty water or open drains. It also says that some problems need help from others.',
    ],
    reviewQuestions: [
      'Check with a PE teacher or a school health officer that the drain-clearing scene models safe practice (gloves, boots, adult supervision, no deep water).',
      'Check that the story does not suggest every hardship is a blessing.',
    ],
    guide: {
      overview:
        'A sports story in which a flooded pitch becomes an unexpected training ground, and a captain teaches three steps for facing obstacles.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'State the three steps Naana learned.',
        'Explain why safe practice matters when clearing a drain.',
        'Apply the three steps to a problem of your own.',
      ],
      subjects: [
        ['Physical Education (NaCCA CCP: team games and teamwork; codes to verify)', 'Resilience in sport'],
        ['Science (NaCCA CCP: water, drainage and environmental care; codes to verify)', 'Why drains block and how to care for them'],
      ],
      before: ['Ask: what obstacle did you meet recently? What did you do first?'],
      during: ['Stop after Page 4. Ask: what is the next small thing the team can do?'],
      after: ['Learners apply the three steps to a real school problem and make a short plan.'],
      discussion: ['What is the difference between acceptance and giving up?'],
      reflection: ['Which obstacle in your life could be turned into a step?'],
      maths: [
        {
          task: 'The match was 9 days after the flood began. If the culvert took one morning to clear and practice started on day 2, how many days of practice were there before the match?',
          answer: '9 - 2 = 7 days.',
        },
        {
          task: 'The final score was 2 goals to 1. How many goals were scored in total, and by what margin did Naana’s team win?',
          answer: '2 + 1 = 3 goals; margin 2 - 1 = 1 goal.',
        },
      ],
      support: ['Write the three steps on a card: See clearly, do the next thing, accept the rest.'],
      stretch: ['Investigate why drains block in your community and suggest three ways to keep them clear.'],
      localise: ['Is there a drain near your school that blocks? Who is responsible for clearing it?'],
      factCheck: ['The story is fiction. The safety details (gloves, boots, adult supervision, no deep water) should be confirmed by a teacher. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 3
  mk({
    key: 'four-promises',
    title: 'Four Promises',
    summary:
      'A rumour, a rude remark, a wrong guess, and a very tiring day all test Akosua in one week. Her grandmother offers her four simple promises to keep. A story about honest speech, a calm heart, and doing your best.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'friendship', 'character', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Warm, gentle, and thoughtful',
    palette: ['#9333ea', '#ca8a04'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Akosua: a JHS 3 girl who cares a great deal about what people think.',
      'Dede: Akosua’s best friend, quiet and loyal.',
      'Nana Yaa: Akosua’s grandmother, a seamstress with a calm voice.',
      'Kojo: a classmate who teases others without thinking.',
      'Mr Frimpong: the English teacher, fair and observant.',
    ],
    music: 'Soft flute and gentle drum (placeholder)',
    pages: [
      pg(
        '🗣️',
        'On Monday, Akosua heard something at break. “Dede told the teacher that you copied your homework,” whispered a classmate. Akosua’s face went hot. Dede was her best friend. How could she? All day she felt her stomach twist. She told two other girls what she had heard, and they told others. By closing time, the rumour had spread and half of JHS 3 was whispering. When Akosua got home, she dropped her bag on the floor and said nothing at supper. Her grandmother, Nana Yaa, watched her over her glasses and asked no questions that night.',
        'A girl standing at the edge of a group of whispering classmates in a schoolyard, looking upset.'
      ),
      pg(
        '🧵',
        'In the morning, Nana Yaa, the best seamstress in the street, was at her sewing machine. “Come and sit,” she said. “Something is eating you.” Akosua told her everything. Nana Yaa kept stitching. “Did you hear Dede say this yourself?” “No. Someone told me.” “Did you ask Dede?” “No.” The needle stopped. “Then you have spread a story you do not know to be true. That is like handing out a torn cloth as if it were whole.” Akosua looked down. She had not thought of it that way. Nana Yaa put away her work. “I will teach you four promises. Keep them, and they will serve you well.”',
        'A grandmother at a hand-crank sewing machine turning kindly to her granddaughter, bright patterned cloth around them.'
      ),
      pg(
        '1️⃣',
        '“The first promise,” said Nana Yaa, “is to speak true and kind. Our words are like seeds. A seed of truth grows into trust, and a careless word can grow into a whole bush of trouble. Say what you know, say it gently, and keep silent about what you do not know. And do not use words to speak badly of others behind their backs, because they always travel.” Akosua thought about the whispers she had spread. “What should I do now?” she asked. “Go and put it right,” said Nana Yaa. “Ask Dede, face to face, and tell the others you were wrong to repeat it.”',
        'A grandmother holding out a few seeds in her open palm to her granddaughter.'
      ),
      pg(
        '🌿',
        'When Akosua found Dede at break and asked her, Dede looked hurt and then relieved. “I never said that,” she said. “The teacher asked the whole class who had finished the homework, and I said I had, and someone twisted it.” Akosua apologised, and she went to the girls she had told and corrected it. It was not easy, but it felt like putting down a heavy bag. Dede forgave her. “I am glad you asked me,” she said. “It is the second promise,” said Akosua, “though I have not told you yet.”',
        'Two friends talking quietly beside a shady tree at break, one touching the other’s arm warmly.'
      ),
      pg(
        '2️⃣',
        'That afternoon, Kojo, a classmate who teased everyone, laughed at Akosua’s drawing. “It looks like a cow!” he shouted. Akosua felt the old heat in her face. But she remembered the second promise that Nana Yaa had given her: do not carry other people’s words as if they were your own load. “Kojo says things like this to everybody,” she thought. “It tells me about Kojo, not about my drawing.” She smiled and said, “Maybe, but I like my cow.” Kojo, who had expected tears, blinked and wandered off. Akosua felt light and calm.',
        'A girl holding up a colourful drawing and smiling calmly while a boy walks away puzzled.'
      ),
      pg(
        '3️⃣',
        'On Wednesday, Akosua waved at Dede across the compound, and Dede did not wave back. “She is angry with me again,” Akosua thought, and her heart sank. She nearly walked away. Then she remembered the third promise: do not decide what someone means before you ask. So she walked over. Dede looked up, startled. “Oh, Akosua, I am sorry! I have a headache and the sun was in my eyes. I did not see you.” They both laughed. Akosua realised how much trouble she had made for herself by guessing. A short question had cleared everything.',
        'Two girls meeting in a sunny school compound, one shading her eyes and smiling warmly.'
      ),
      pg(
        '4️⃣',
        'On Friday, Akosua woke with a fever and a stuffy nose, but a class test was due. She went to school, wrote what she could, and felt dull and slow. When the marks came back, she had only twelve out of twenty, lower than usual. She nearly cried. But Nana Yaa had told her the fourth promise: do your best, and know that your best changes from day to day. “When you are well, your best is higher,” she had said. “When you are ill, it is lower. Do not blame yourself when you have done what you could.”',
        'A girl wearing a light shawl with a tired face writing calmly at her classroom desk.'
      ),
      pg(
        '🌙',
        'That evening, Nana Yaa took Akosua’s temperature, gave her warm water and rest, and sent a note to school. “You did your best on a hard day,” she said, “and that is all anyone can ask.” Akosua leaned against her. “Grandma, I have kept your four promises this week, though I broke the first one on Monday.” Nana Yaa laughed softly. “Everyone breaks a promise sometimes. The important thing is that you noticed, and put it right.” Akosua fell asleep that night feeling that her week, though hard, had taught her something valuable.',
        'A grandmother tucking her granddaughter into bed with a cup of warm water on the bedside table.'
      ),
      pg(
        '✨',
        'The next Monday, Akosua stuck a small card above her desk with four lines written on it. Speak true and kind. Do not carry what is not yours. Ask before you decide. Do your best. They were simple, but she found that most of the troubles of her week would have been prevented by those four lines. They are not magic, and they do not protect us from everything. If someone is truly unkind to you or threatens you, you must tell a trusted adult. But they can make friendships stronger and a heart lighter. Try them for one week, and see.',
        'A girl sitting happily at her tidy study desk beneath a colourful pinned bookmark.'
      ),
    ],
    activities: [
      {
        id: 'xj-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Nana Yaa say the first promise is?',
        options: [
          'Speak true and kind',
          'Always win',
          'Never speak',
        ],
        correctIndex: 0,
      },
      {
        id: 'xj-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did Akosua respond to Kojo’s teasing about her drawing?',
        options: [
          'She cried',
          'She knew the remark showed Kojo’s habit, not her art, and answered calmly',
          'She shouted back',
        ],
        correctIndex: 1,
      },
      {
        id: 'xj-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Akosua learn when she asked Dede why she did not wave?',
        options: [
          'Dede was angry',
          'Dede had a headache and the sun was in her eyes',
          'Dede was moving away',
        ],
        correctIndex: 1,
      },
      {
        id: 'xj-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A friend tells you that another classmate said something unkind about you. Using the story, what should you do?',
        options: [
          'Tell everyone at once',
          'Ask the classmate directly and calmly before deciding it is true',
          'Never speak to them again',
        ],
        correctIndex: 1,
      },
      {
        id: 'xj-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Akosua spreads a rumour she did not check',
          'She asks Dede and puts the rumour right',
          'She stays calm when Kojo teases her',
          'She asks before assuming Dede is angry',
          'She does her best on a day when she is ill',
        ],
      },
      {
        id: 'xj-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'tease',
        definition: 'To make fun of someone, often unkindly.',
        distractors: [
          'To teach carefully',
          'To draw neatly',
        ],
      },
    ],
    glossary: [
      {
        word: 'rumour',
        definition: 'A story passed around that may not be true.',
        pages: [1],
      },
      {
        word: 'seamstress',
        definition: 'A woman who sews clothes for a living.',
        pages: [2],
      },
      {
        word: 'trust',
        definition: 'The belief that someone is honest and reliable.',
        pages: [3],
      },
      {
        word: 'apologised',
        definition: 'Said sorry for something wrong.',
        pages: [4],
      },
      {
        word: 'teased',
        definition: 'Made fun of someone, often unkindly.',
        pages: [5],
      },
      {
        word: 'startled',
        definition: 'Surprised suddenly.',
        pages: [6],
      },
      {
        word: 'fever',
        definition: 'A body temperature higher than normal.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: Speak honestly and kindly, do not take others’ words personally, do not assume what others mean, and do your best, which changes from day to day. The idea is explored further in “The Four Agreements” by Don Miguel Ruiz (1997). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story takes only the four practical rules and drops the book’s spiritual framing. It says that real unkindness or threats must be reported to trusted adults.',
    ],
    reviewQuestions: [
      'Check that the story does not suggest ignoring real bullying.',
      'Check the sums: 16 - 12 = 4; 2 + 4 + 8 = 14.',
      'Check that the grandmother’s four promises are clearly presented as original to the story.',
    ],
    guide: {
      overview:
        'A story in which a girl learns four practical promises about honest speech, calm responses, asking before assuming, and doing her best.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Name the four promises.',
        'Explain how rumours spread.',
        'Choose one promise to practise for a week.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: responsible living and relationships; codes to verify)', 'Honesty and friendship'],
        ['English Language (NaCCA CCP: speaking and listening; codes to verify)', 'Asking and listening before judging'],
      ],
      before: ['Ask: have you ever believed something about a friend that was not true?'],
      during: ['Stop after Page 4. Ask: what could Akosua have done on Monday instead?'],
      after: ['Learners role-play asking a friend about a rumour, calmly and kindly.'],
      discussion: ['Why is it so easy to pass on a rumour?'],
      reflection: ['Which of the four promises is hardest for you?'],
      maths: [
        {
          task: 'Akosua scored 12 out of 20 when she was ill, instead of her usual 16. By how many marks was it lower, and what fraction of 20?',
          answer: '16 - 12 = 4 marks; 4 ÷ 20 = 1/5.',
        },
        {
          task: 'A rumour is told to 2 people, and each of them tells 2 more, and each of those tells 2 more. How many people have heard it after three rounds (not counting the first teller)?',
          answer: '2 + 4 + 8 = 14 people.',
        },
      ],
      support: ['Give a bookmark with the four promises.'],
      stretch: ['Write a short dialogue in which someone checks a rumour kindly.'],
      localise: ['What sayings in your language warn about careless words?'],
      factCheck: ['The story is fiction, and the four promises are written for the story. The book’s title, author, and year are given from general knowledge, and the book’s spiritual framing is not used.'],
    },
  }),

  // 4
  mk({
    key: 'six-ways-to-make-a-friend',
    title: 'Six Ways to Make a Friend',
    summary:
      'Making friends is a skill that can be learned. This article gives six simple habits for building trust and warmth with the people around you, and a warning about using them for the wrong reasons.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'friendship', 'communication', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Friendly, clear, and encouraging',
    palette: ['#db2777', '#0e7490'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Warm highlife guitar with light percussion (placeholder)',
    pages: [
      pg(
        '👋',
        'In Ghana, we greet before we ask for anything. A child who walks past an elder without greeting is thought to have missed something important. This is not just politeness. A greeting says, “I see you. You matter to me.” People who understand this often find it easy to make friends. But friendship is also a skill, and like football or drumming, it can be learned and improved. This article gives six simple habits for building warmth and trust with other people, such as classmates, neighbours, and relatives. None of them costs a pesewa.',
        'Two pupils greeting an elder politely on a sunlit Ghanaian village path.'
      ),
      pg(
        '📛',
        'The first habit is to learn and use people’s names. A person’s own name is the sweetest sound to them. If you have a new classmate, ask her name and say it back clearly. If you forget, ask again and say, “Sorry, please tell me your name once more.” That shows you care. Try repeating it in the conversation. A boy who greets the school cook as “Auntie Mercy” and not just “Auntie” makes her smile. A teacher who remembers every pupil’s name makes the class feel respected. Small as it is, this habit helps people feel seen.',
        'A boy greeting a school cook warmly as she serves food from a clean pot, both smiling.'
      ),
      pg(
        '👂',
        'The second habit is to listen properly. Most people talk much more than they listen. When someone is speaking, look at them, put away your phone, and let them finish. Ask a question about what they have said. “And what happened next?” “How did you feel?” People remember who listened to them. A friend who listens is a rare thing. Notice also what is not said, like a tired face or a quiet voice. You might ask, “Are you all right?” Many people carry worries they cannot tell anyone. A good listener is a gift in any school or home.',
        'Two friends sitting together on a wooden bench, one leaning forward attentively while the other speaks.'
      ),
      pg(
        '😊',
        'The third habit is to smile and be warm. A smile costs nothing and can change the mood of a whole room. You do not need to smile all the time, or pretend to be happy. But a friendly face invites people to come near, while a frown or a closed face keeps them away. Think of the market trader who greets every customer with a smile. People walk past other stalls to buy from her. It is not magic. People like to be where they feel welcome. Try it tomorrow: smile at three people you do not usually greet.',
        'A cheerful market trader smiling warmly as customers gather happily at her fruit stall.'
      ),
      pg(
        '🤔',
        'The fourth habit is to ask before you criticise. When someone does something wrong, our first instinct is to blame them. But it rarely works. People who are told off in front of others usually feel hurt and defensive. Instead, ask a question: “Can you help me understand what happened?” You may learn something that changes your view. If correction is truly needed, do it in private and kindly, focusing on the action, not the person. It takes more patience, but it often changes behaviour, and it keeps the friendship intact.',
        'A teacher and a pupil talking quietly along a calm school veranda, the teacher listening with a kind expression.'
      ),
      pg(
        '🙏',
        'The fifth habit is to admit your own mistakes quickly. If you forgot a promise, broke a borrowed pen, or spoke harshly, say so at once. “I am sorry. I was wrong.” Saying it early costs less than saying it late. And it surprises people, because they expect excuses. Someone who admits mistakes is easy to trust, since they do not hide things. If you have wronged someone, try to put it right, perhaps by replacing what you broke or doing a favour. A sincere apology, with a plan to do better, is one of the strongest tools for repairing a friendship.',
        'A boy handing a new replacement pen with a warm apologetic smile to a classmate.'
      ),
      pg(
        '🌟',
        'The sixth habit is to give honest appreciation. Notice something good about a person, and tell them. “Your handwriting is so neat.” “Thank you for waiting for me.” “You explained that very clearly.” But it must be true. Flattery, which is empty praise to get something, is easy to spot and breaks trust. Honest appreciation, which is a true thank-you or kind word, makes people feel valued and encourages them to continue. Look for something to appreciate in the people around you, including the cleaner, the driver, and the teacher. A kind word is often remembered for years.',
        'A girl thanking a school cleaner warmly in a spotless classroom while the cleaner beams.'
      ),
      pg(
        '⚠️',
        'A warning: these habits are for building real friendship, not for tricking people. If you remember someone’s name only to get a favour, or you smile only to win something, people will eventually feel it, and trust will break. Be kind because you respect people, not as a technique. Also, being friendly does not mean giving in to everything. A good friend can say no. If a friend asks you to do something wrong, such as cheating or hurting someone, you may be warm and still say no. True friendship rests on respect, not on pleasing others at any cost.',
        'A girl calmly raising her hand to decline a friend holding an open notebook, both remaining respectful.'
      ),
      pg(
        '📆',
        'Here is a challenge for one week. Each day, try one habit on purpose. On Monday, learn a new name. On Tuesday, listen without interrupting. On Wednesday, smile at three people. On Thursday, ask a question before criticising. On Friday, admit a small mistake. On Saturday, give honest appreciation. On Sunday, rest and think about what you noticed. By the end, you will probably find that people respond more warmly, and that you feel warmer as well. Friendship is not luck. It is mostly a set of small habits that anybody can practise.',
        'A cheerful pupil sitting at a desk marking checkmarks on a neat wall chart.'
      ),
    ],
    activities: [
      {
        id: 'xk-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What does the article say about listening?',
        options: [
          'It is not important',
          'People remember who listened to them',
          'You should interrupt often',
        ],
        correctIndex: 1,
      },
      {
        id: 'xk-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What should you do before criticising someone?',
        options: [
          'Shout',
          'Ask a question to understand what happened',
          'Tell everyone',
        ],
        correctIndex: 1,
      },
      {
        id: 'xk-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What is the difference between flattery and honest appreciation?',
        options: [
          'Flattery is empty praise to get something; appreciation is true',
          'They are the same',
          'Flattery is true',
        ],
        correctIndex: 0,
      },
      {
        id: 'xk-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A new pupil joins your class and sits alone. Using the article, what is a good first step?',
        options: [
          'Ignore her',
          'Greet her, ask and use her name, and listen to her',
          'Tease her',
        ],
        correctIndex: 1,
      },
      {
        id: 'xk-s1',
        type: 'sequencing',
        prompt: 'Put the habits in the order the article presents them.',
        items: [
          'Learn and use people’s names',
          'Listen properly',
          'Smile and be warm',
          'Ask before you criticise',
          'Admit mistakes and give honest appreciation',
        ],
      },
      {
        id: 'xk-voc',
        type: 'vocabulary',
        afterPage: 7,
        word: 'flattery',
        definition: 'Empty praise given to get something.',
        distractors: [
          'A kind of dance',
          'A school rule',
        ],
      },
    ],
    glossary: [
      {
        word: 'greet',
        definition: 'To say hello or welcome to someone.',
        pages: [1],
      },
      {
        word: 'respected',
        definition: 'Treated with honour and care.',
        pages: [2],
      },
      {
        word: 'listen',
        definition: 'To pay attention to what someone is saying.',
        pages: [3],
      },
      {
        word: 'welcome',
        definition: 'Received warmly and gladly.',
        pages: [4],
      },
      {
        word: 'criticise',
        definition: 'To point out faults in someone or something.',
        pages: [5],
      },
      {
        word: 'sincere',
        definition: 'Honest and genuine.',
        pages: [6],
      },
      {
        word: 'flattery',
        definition: 'Empty praise given to get something.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: People respond to being seen, listened to, and respected; simple habits such as using names, listening, smiling, asking before criticising, apologising, and honest appreciation build trust. The idea is explored further in “How to Win Friends and Influence People” by Dale Carnegie (1936). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The article warns that these habits must be sincere and that being friendly does not mean giving in to wrong requests. Some readers see the book as manipulative; the article avoids that by stressing sincerity.',
    ],
    reviewQuestions: [
      'Check that the greeting example fits the community of the learners.',
      'Check that the article is clear that friendliness never means doing something wrong.',
      'Check the sums: 3 × 5 = 15; 40 - 28 = 12.',
    ],
    guide: {
      overview:
        'An article describing six sincere habits for making friends, with a warning against using them to trick people.',
      lessonMinutes: 45,
      goals: [
        'Name the six habits.',
        'Practise using a name and listening properly.',
        'Explain the difference between flattery and honest appreciation.',
        'Complete a one-week friendship challenge.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: relationships and citizenship; codes to verify)', 'Building friendships'],
        ['English Language (NaCCA CCP: speaking and listening; codes to verify)', 'Courteous conversation'],
      ],
      before: ['Ask: what does a good friend do? List answers on the board.'],
      during: ['Stop after Page 4. Ask learners to practise greeting and asking a name in pairs.'],
      after: ['Learners complete the one-week challenge and report back with one example.'],
      discussion: ['Can you be friendly and still say no?'],
      reflection: ['Which habit would make the biggest difference to your friendships?'],
      maths: [
        {
          task: 'A pupil learns 3 new names a day for 5 school days. How many names is that?',
          answer: '3 × 5 = 15 names.',
        },
        {
          task: 'If a class has 40 pupils and you know 28 names, how many names remain, and what fraction do you know?',
          answer: '40 - 28 = 12 remain; 28/40 = 7/10.',
        },
      ],
      support: ['Provide a checklist with the six habits and a column for each day.'],
      stretch: ['Interview an adult who is known for being a good friend and ask what they do.'],
      localise: ['What greetings do you use in your language at different times of day?'],
      factCheck: ['The article is general advice. The greeting custom is common in Ghana but varies by community. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 5
  mk({
    key: 'the-basket-and-the-bus-ride',
    title: 'The Basket and the Bus Ride',
    summary:
      'Fatawu loves weaving baskets, but his father needs him on the farm. A story about following a calling with patience, learning from failures, and noticing the chances that appear on the way.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'calling', 'perseverance', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Warm, patient, and quietly hopeful',
    palette: ['#b45309', '#0f766e'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Fatawu: a 15-year-old JHS 3 boy from a farming family in the north.',
      'Baba Iddrisu: his father, a hardworking farmer who worries about the future.',
      'Auntie Azara: a master basket weaver who teaches Fatawu.',
      'Hajia Rabi: a shop owner who buys baskets for visitors.',
      'Mariam: Fatawu’s younger sister, who believes in him.',
    ],
    music: 'Gentle drum and flute with a warm shaker (placeholder)',
    pages: [
      pg(
        '🌾',
        'Fatawu lived in a farming village in the north. Every rainy season he helped his father, Baba Iddrisu, plant millet and groundnuts. He worked hard, but his heart was somewhere else. On market days he would stand for hours watching the women weave straw baskets, with their strong patient hands moving in and out. He loved the patterns, the smell of the dried straw, and the way a flat mat turned slowly into a bowl. At night, he sketched baskets in his school notebook. He had never told anyone. His father needed him on the farm.',
        'A boy watching women weave colourful straw baskets at a busy northern Ghanaian market.'
      ),
      pg(
        '💬',
        'One evening, Fatawu’s little sister Mariam found the notebook. “These are beautiful!” she said. “Do you make them?” Fatawu turned red. “No, I only draw them.” “Then why not learn?” Mariam asked. He did not know how to answer. That night he lay awake. He was afraid of two things. If he said it aloud, his father might be disappointed, because baskets are not what a farm family counts on. And he was afraid he would not be good at it. But the feeling would not go away. The next morning, he gathered his courage and spoke to his father.',
        'A young girl holding up her brother’s open sketchbook of basket drawings while he looks shy.'
      ),
      pg(
        '🤝',
        'Baba Iddrisu listened. He was quiet a long time. “The farm feeds us,” he said finally. “That does not change. But the rains are only for part of the year. In the dry season there is little work. If you can learn something useful then, I will not stand in your way. But you must do your farm work first.” Fatawu could hardly believe it. “I promise,” he said. His father added, “Go to Auntie Azara. She is the best weaver in the district, and she is strict.” So in the dry season, Fatawu walked, then rode a bus, to learn.',
        'A father and son talking calmly at dusk on the edge of a green millet field.'
      ),
      pg(
        '🧺',
        'Auntie Azara was small, quick, and not easily pleased. For the first two weeks, Fatawu only prepared straw, splitting, dyeing, and sorting. “You do not rush a good basket,” she said. When at last she let him weave, his first basket looked like a squashed bowl and fell apart when he lifted it. She shrugged and unpicked it. “Again.” His second was a little better. His third was better still, but crooked. It took thirty baskets before one held its shape. Fatawu wanted to quit many times. But each time, he remembered the market and Mariam’s voice, and he went back.',
        'A boy holding a crooked half-woven basket while an experienced woman weaver guides his hands with dyed straw.'
      ),
      pg(
        '😔',
        'When he had made a few good baskets, Fatawu took six to the market and set them out. He sold only one all day. The other stall holders had many more, and some were cheaper. He walked home with five baskets and a heavy heart. “Maybe I made a mistake,” he told Auntie Azara. “Maybe I should have stayed with the farm.” She looked at him. “Did you ask people what they wanted? Did you look at what sold?” “No,” said Fatawu. “Then you have not failed yet,” she said. “You have only learned that the market has its own ways. Go back and watch.”',
        'A boy sitting thoughtfully beside five unsold straw baskets on a woven mat at a quiet market corner.'
      ),
      pg(
        '👀',
        'The next market day, Fatawu did not sell. He watched. He saw that most buyers were local women who wanted big baskets for carrying produce, and his small, fine baskets were not what they needed. But then he noticed visitors, travellers from the south and from abroad, who walked by with phones in their hands and could not carry big baskets. They stopped at the small ones, turned them over, and walked away without buying, because they were too large to pack or too plain. Fatawu remembered his notebook. “They need something small and colourful,” he thought.',
        'A boy observing travellers pass by market stalls while holding a small bright woven basket in his hand.'
      ),
      pg(
        '🎨',
        'He worked with Auntie Azara to make small baskets in bright dyed patterns, the right size to fit in a bag. Hajia Rabi, who ran a shop for visitors, saw them and ordered twenty. “If they are as good as this one,” she said, “I will pay a fair price and order more.” Fatawu felt his heart leap. He was careful to do his farm work first, as promised, and to weave in the evenings and dry months. He did not become rich overnight. The first month he earned very little. But slowly, orders grew, and he had enough to buy new straw and dyes.',
        'A woman shop owner in colourful cloth admiring small patterned baskets and counting money into Fatawu’s hand.'
      ),
      pg(
        '🏡',
        'Baba Iddrisu came to the market one day, and stood quietly in front of Fatawu’s stall. He turned a small basket in his big farmer’s hands. “It is well made,” he said, and for a farmer it was high praise. “Now I understand why you stayed up so late.” Fatawu felt his eyes sting. He still helped on the farm each rainy season, and his father needed him less anxiously now. The two jobs fitted together, one in the rains and one in the dry months. Mariam, who now wove small baskets herself, grinned from the back of the stall.',
        'A proud farmer holding a finely woven small basket and nodding warmly at his son beside the stall.'
      ),
      pg(
        '🌅',
        'At the end of the year, Fatawu wrote in his notebook. “I did not find my calling by waiting. I found it by trying, failing, learning, and trying again. The failures taught me more than the successes. And the chance came while I was watching, not while I was complaining.” Not everyone can do exactly the work they love, and some dreams must wait while we meet our duties, as Fatawu did. But we can often make room for a calling if we are patient, honest with our families, and willing to begin small. What small step could you take?',
        'A boy writing in his notebook at sunset beside a finished colourful basket, with farm fields in the distance.'
      ),
    ],
    activities: [
      {
        id: 'xl-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What condition did Baba Iddrisu set for allowing Fatawu to learn weaving?',
        options: [
          'He must give up the farm',
          'He must do his farm work first and learn in the dry season',
          'He must pay for lessons',
        ],
        correctIndex: 1,
      },
      {
        id: 'xl-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Auntie Azara say when Fatawu sold only one basket?',
        options: [
          'That he had failed completely',
          'That he had only learned the market has its own ways, so he should watch',
          'That he should stop',
        ],
        correctIndex: 1,
      },
      {
        id: 'xl-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What chance did Fatawu notice by watching the market?',
        options: [
          'Visitors wanted small, colourful baskets they could pack',
          'Nobody wanted baskets',
          'Baskets were too cheap',
        ],
        correctIndex: 0,
      },
      {
        id: 'xl-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: You love drawing but your first posters are not noticed. Using the story, what is a good next step?',
        options: [
          'Stop drawing',
          'Look at what people like and ask for advice, then try again',
          'Wait for luck',
        ],
        correctIndex: 1,
      },
      {
        id: 'xl-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Fatawu secretly loves weaving but needs to work on the farm',
          'His father agrees if the farm work comes first',
          'He learns from Auntie Azara through many failed baskets',
          'He sells badly, then watches and notices visitors want small baskets',
          'Orders grow and his father praises his work',
        ],
      },
      {
        id: 'xl-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'calling',
        definition: 'Work or a path in life that you feel strongly drawn to.',
        distractors: [
          'A phone call',
          'A market stall',
        ],
      },
    ],
    glossary: [
      {
        word: 'millet',
        definition: 'A cereal grain grown in dry regions.',
        pages: [1],
      },
      {
        word: 'sketched',
        definition: 'Drew quickly without much detail.',
        pages: [1],
      },
      {
        word: 'disappointed',
        definition: 'Sad because something did not happen as hoped.',
        pages: [2],
      },
      {
        word: 'crooked',
        definition: 'Not straight.',
        pages: [4],
      },
      {
        word: 'calling',
        definition: 'Work or a path in life that you feel strongly drawn to.',
        pages: [9],
      },
      {
        word: 'visitors',
        definition: 'People who come to a place from elsewhere.',
        pages: [6],
      },
      {
        word: 'orders',
        definition: 'Requests to make or supply goods.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: Pursue the work you feel drawn to with patience, learn from failure, and watch for the chances that appear along the way. The idea is explored further in “The Alchemist” by Paulo Coelho (first published 1988). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'This is a fresh story set in northern Ghana. It does not retell the novel. It honours family duty, since Fatawu keeps his farm work and weaves in the dry season.',
    ],
    reviewQuestions: [
      'Check that the portrayal of northern Ghana, the farming year, and the basket-weaving trade is respectful and accurate, ideally with a person from the Upper East Region.',
      'Check the sums: 30 ÷ 5 = 6; 6 - 1 = 5.',
      'Check that the fictional names are acceptable.',
    ],
    guide: {
      overview:
        'A story about a boy who follows his love of weaving with patience, honesty to his family, and willingness to learn from failure.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain how Fatawu balanced duty and calling.',
        'Describe how failure led to a new idea.',
        'Name one small step towards something you love.',
      ],
      subjects: [
        ['Career Technology (NaCCA CCP: crafts, weaving and enterprise; codes to verify)', 'Learning a craft and finding customers'],
        ['Social Studies (NaCCA CCP: family responsibilities and careers; codes to verify)', 'Balancing duty and dreams'],
      ],
      before: ['Ask: what activity makes you lose track of time?'],
      during: ['Stop after Page 5. Ask: has Fatawu failed, or has he learned something?'],
      after: ['Learners write a small step they can take towards something they love, and one person they could ask.'],
      discussion: ['Is it right to put family duty first? How did Fatawu do both?'],
      reflection: ['What would you try if you were sure you could learn it slowly?'],
      maths: [
        {
          task: 'Fatawu made 30 baskets before one held its shape. If he made 5 baskets a week, how many weeks did that take?',
          answer: '30 ÷ 5 = 6 weeks.',
        },
        {
          task: 'He took 6 baskets to the market and sold 1. How many were left, and what fraction sold?',
          answer: '6 - 1 = 5 left; 1/6 sold.',
        },
      ],
      support: ['Give a sentence frame: “I love… A small step I can take is…”.'],
      stretch: ['Find out how straw baskets are traditionally woven in northern Ghana.'],
      localise: ['Is there a craft in your area? Who teaches it?'],
      factCheck: ['The story is fiction. Basket weaving and the farming calendar in northern Ghana should be checked with a local source. The book’s title, author, and year are given from general knowledge, and the novel is not retold.'],
    },
  }),
];

export const BATCH_53_LIFE_LESSONS = BATCH_53_STORIES;
