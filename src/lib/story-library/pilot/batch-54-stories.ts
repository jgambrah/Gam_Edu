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
 * Batch 54 (5 original Life Lessons stories and articles, nine pages each, with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to Social Studies, Career Technology, Science, or Computing (see the first cultural note and the teacher guide).
 * These are original stories and articles, each teaching one idea from a well-known book. Stories list their characters; articles have none.
 * Original text written for Ghanaian learners; each factCheck note names the book behind the idea and what to verify.
 */

export const BATCH_54_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'tuesdays-with-mr-ofori',
    title: 'Tuesdays with Mr Ofori',
    summary:
      'Yaw is told to visit an elderly retired teacher once a week and would rather be playing football. A story about what an old man’s company teaches a boy about what matters, forgiveness, and saying thank you in time.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'elders', 'forgiveness', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Quiet, tender, and gently humorous',
    palette: ['#92400e', '#0f766e'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Yaw: a 15-year-old JHS 3 boy who is polite, restless, and fond of football.',
      'Mr Ofori: a retired teacher of about eighty, ill for a long time, with a kind laugh and a sharp mind.',
      'Auntie Grace: Yaw’s mother, who works as a nurse’s aide and worries about her son.',
      'Kwame: Yaw’s friend, with whom he has quarrelled.',
      'Madam Serwa: Mr Ofori’s niece, who cares for him.',
    ],
    music: 'Soft old highlife guitar with a gentle drum (placeholder)',
    pages: [
      pg(
        '🏠',
        'The school had a new programme. Each pupil in JHS 3 would visit an older person in the neighbourhood once a week, to help and to listen. Yaw was given Mr Ofori, a retired teacher who lived near the church. Yaw groaned. Tuesday afternoons were for football. But he went, with a bag of oranges from his mother. Mr Ofori sat on his veranda in a wooden chair, thin and slow, wrapped in a faded cloth. His niece, Madam Serwa, explained quietly that he had been ill for a long time, and that doctors did not expect him to get well again.',
        'A boy holding a bag of oranges standing politely at the steps of a shaded veranda where an elderly man sits.'
      ),
      pg(
        '☕',
        'The first visit was awkward. Yaw did not know what to say, and Mr Ofori did not seem to mind the silence. Then he said, “Tell me, young man, what is troubling you?” Yaw was startled. “Nothing, sir.” Mr Ofori smiled. “Nothing? At fifteen? Then you are lucky or you are hiding.” Yaw laughed in spite of himself. Slowly, he admitted that he worried about his marks, about being left out, and about whether his friends liked him. Mr Ofori listened without hurrying. “These are good worries,” he said. “They show you care. Come again next Tuesday.”',
        'A boy and an elderly man sitting together on a calm veranda, the boy talking openly and the man listening kindly.'
      ),
      pg(
        '🏅',
        'Over the weeks, they talked about everything. Mr Ofori had never been a headmaster, or rich, or famous. He had taught in village schools for forty years. “Do you feel you missed something?” Yaw asked bluntly. The old man chuckled. “Every Christmas, my old pupils come to this veranda. A doctor, a driver, a market woman, a soldier. They bring food and noise and stories. That is my wealth.” He tapped his chest. “Titles and money are like the paint on a house. Pleasant, but it is the people inside who make it a home.” Yaw thought about how much time he spent worrying about looking important.',
        'An elderly retired teacher smiling on a veranda as former adult pupils arrive warmly with baskets of food.'
      ),
      pg(
        '🪨',
        'One Tuesday, Yaw arrived in a sour mood. He had quarrelled with his best friend, Kwame, over a football match, and they had not spoken for a week. “Carrying anger,” said Mr Ofori slowly, “is like carrying a heavy stone to throw at someone, and your own hand gets tired first.” He told Yaw about his own brother, with whom he had not spoken for fifteen years over a piece of family land. “We were both stubborn,” he said. “When we finally made peace, we were both old. I wasted fifteen good years.” His eyes were wet. “Do not wait as long as I did.”',
        'An elderly man speaking earnestly with quiet emotion on a veranda while a teenage boy listens closely.'
      ),
      pg(
        '📻',
        'As the weeks passed, Mr Ofori grew weaker. Some Tuesdays he slept through half of Yaw’s visit, and Yaw sat quietly, shelling groundnuts. On better days, he asked Yaw to read to him from an old book of proverbs, or they listened to highlife from a small radio. Yaw’s mother, Auntie Grace, noticed that her son was changing. “You used to complain about Tuesdays,” she said. Yaw smiled. “Now they are my favourite day.” She looked at him for a moment and then hugged him tightly, without a word.',
        'A boy reading aloud from a worn book while an elderly man rests peacefully with a smile beside a small radio.'
      ),
      pg(
        '🙏',
        'One afternoon, Mr Ofori asked, “If you could remember only three things from our talks, what would you like them to be?” Yaw thought carefully. “That people matter more than status. That I should forgive early. And that I should say thank you and sorry before it is too late.” The old man nodded slowly. “That is more than I managed at your age.” He added, “Ask yourself often, ‘What really matters?’ It is usually family, kindness, learning, and your community. It is rarely the thing you were worried about this morning.” Yaw wrote it all in his notebook that night.',
        'A boy writing thoughtfully in an open notebook by warm lamplight at night.'
      ),
      pg(
        '🤝',
        'The next day at school, Yaw walked up to Kwame, who was sitting alone. His heart pounded. “I am sorry about the match,” he said. “I was being stubborn. I miss talking to you.” Kwame looked surprised, and then relieved. “I am sorry too,” he said. “I did not know how to start.” They sat together at break, and Kwame told him about a new song. On the following Tuesday, Yaw reported the whole thing to Mr Ofori, who listened with shining eyes. “That,” he said softly, “is the best news I have heard all month.”',
        'Two teenage boys sitting side by side on a shady school bench sharing snacks and smiling warmly.'
      ),
      pg(
        '🕊️',
        'One Wednesday morning, Auntie Grace sat Yaw down gently. “Mr Ofori passed away in his sleep last night,” she said. “It was peaceful.” Yaw felt as though the ground had shifted. He cried for a long time, and his mother held him. At the funeral, the compound overflowed. Former pupils came from many towns, and they told stories until evening. A doctor spoke, and a market woman, and a soldier. Yaw stood among them and understood what Mr Ofori had meant. He was sad. But he was also grateful that he had said thank you while there was still time.',
        'A respectful Ghanaian gathering in a compound dressed in traditional dark and white cloth, with Yaw standing quietly beside his mother.'
      ),
      pg(
        '🌅',
        'The following Tuesday, Yaw did not play football. He sat on his own veranda with his notebook and wrote down what he had learned. Then he went to Madam Serwa and asked whether there was an elder in the neighbourhood who would like a visitor. The lessons stayed with him: people matter more than status, forgiveness is better early, and thanks and sorries should not wait. If you lose someone you love and the sadness feels too heavy, it is right to talk to a parent, a teacher, a pastor, an imam, or a school counsellor. Grief is not weakness. It is love with nowhere to go.',
        'A boy walking calmly along a sunlit morning path towards a neighbour’s veranda carrying his notebook.'
      ),
    ],
    activities: [
      {
        id: 'xm-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Mr Ofori say was his wealth?',
        options: [
          'A big house',
          'The visits of his former pupils',
          'A famous title',
        ],
        correctIndex: 1,
      },
      {
        id: 'xm-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What picture did Mr Ofori use to describe carrying anger?',
        options: [
          'A heavy stone that tires your own hand',
          'A bright lamp',
          'A cold wind',
        ],
        correctIndex: 0,
      },
      {
        id: 'xm-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Yaw do after talking with Mr Ofori about forgiveness?',
        options: [
          'He ignored Kwame',
          'He apologised to Kwame',
          'He changed schools',
        ],
        correctIndex: 1,
      },
      {
        id: 'xm-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: Your grandmother is unwell and you keep delaying a visit. Using the story, what should you do?',
        options: [
          'Wait until the weekend after next',
          'Visit soon and say what you want to say while there is time',
          'Send a message only',
        ],
        correctIndex: 1,
      },
      {
        id: 'xm-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Yaw begins visiting Mr Ofori reluctantly',
          'Mr Ofori tells him about people and titles',
          'Mr Ofori talks about forgiveness and his brother',
          'Yaw apologises to Kwame',
          'Yaw attends the funeral and keeps the lessons',
        ],
      },
      {
        id: 'xm-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'forgive',
        definition: 'To stop being angry with someone who has wronged you.',
        distractors: [
          'To forget a name',
          'To pay a debt',
        ],
      },
    ],
    glossary: [
      {
        word: 'programme',
        definition: 'A planned set of activities.',
        pages: [1],
      },
      {
        word: 'veranda',
        definition: 'A roofed open space along the side of a house.',
        pages: [1],
      },
      {
        word: 'wealth',
        definition: 'Valuable things, not only money, that a person has.',
        pages: [3],
      },
      {
        word: 'stubborn',
        definition: 'Unwilling to change your mind.',
        pages: [4],
      },
      {
        word: 'proverbs',
        definition: 'Short wise sayings handed down in a community.',
        pages: [5],
      },
      {
        word: 'funeral',
        definition: 'A ceremony held after someone dies.',
        pages: [8],
      },
      {
        word: 'grief',
        definition: 'Deep sadness after losing someone.',
        pages: [9],
      },
    ],
    culturalNotes: [
      'Big idea: Relationships and kindness matter more than status; forgive early; say thank you and sorry before it is too late. The idea is explored further in “Tuesdays with Morrie” by Mitch Albom (1997). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'Sensitive content: the story includes the death of an elderly man, shown gently and without distressing detail. Teachers should read it first and know the school’s counselling contacts. Learners who have lost someone may need support. The book itself is a true account, but this story is fictional and set in Ghana.',
    ],
    reviewQuestions: [
      'Teachers must read this piece first and decide whether the class is ready for a story about an elder’s death.',
      'Check that the funeral description is respectful of Ghanaian customs and religions.',
      'Check the sums: 30 × 40 = 1,200; 65 - 15 = 50.',
    ],
    guide: {
      overview:
        'A story about a boy visiting a dying elder who teaches him about what matters, forgiveness, and saying thanks in time.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'State three lessons Mr Ofori taught.',
        'Explain why forgiving early matters.',
        'Plan a visit or a message to an elder.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: family, elders and community values; codes to verify)', 'Respect and care for elders'],
        ['Religious and Moral Education (NaCCA CCP: forgiveness and relationships; codes to verify)', 'Forgiving and being thankful'],
      ],
      before: ['Ask: what has an elder taught you that you still remember?'],
      during: ['Stop after Page 4. Ask: why do you think Mr Ofori told Yaw about his brother?'],
      after: ['Learners write a short thank-you note to an elder and, if they wish, deliver it.'],
      discussion: ['Why is it hard to say sorry first?'],
      reflection: ['Who do you need to thank or forgive before it is too late?'],
      maths: [
        {
          task: 'Mr Ofori taught for 40 years. If he taught about 30 pupils a year in each of 40 years, about how many pupils did he teach?',
          answer: '30 × 40 = 1,200 pupils.',
        },
        {
          task: 'He did not speak to his brother for 15 years. If he is now 80, at what age did the quarrel begin if it ended when he was 65?',
          answer: '65 - 15 = 50 years old.',
        },
      ],
      support: ['Provide a note card: Dear ___, thank you for ___. I am sorry for ___.'],
      stretch: ['Interview an elder about the three things that matter most to them.'],
      localise: ['How does your community care for its elders? What could pupils do?'],
      factCheck: ['The story is fiction. The funeral and religious customs should be checked locally. The book’s title, author, and year are given from general knowledge, and the book’s content is not retold.'],
    },
  }),

  // 2
  mk({
    key: 'one-hall-two-classes',
    title: 'One Hall, Two Classes',
    summary:
      'JHS 3A and 3B both need the school hall on the same Saturday for Speech Day. Shouting gets them nowhere. A story about listening first and finding an answer in which both sides gain.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'cooperation', 'conflict-resolution', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Lively, then calm and clever',
    palette: ['#7c3aed', '#16a34a'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Abena: the JHS 3A drama captain, quick and proud.',
      'Kofi: the JHS 3B choir leader, calm and thoughtful.',
      'Mr Dzifa: the head teacher, who believes pupils can solve problems.',
      'Madam Pokua: the music teacher, practical and kind.',
      'Yaa: a stage manager in 3A who notices small details.',
    ],
    music: 'Playful drums with a warm choir hum (placeholder)',
    pages: [
      pg(
        '🎭',
        'Speech Day was three weeks away, and both JHS 3A and 3B had been asked to perform. 3A would present a short play, and 3B a choir piece. Each class needed the school hall to rehearse, but the hall was free only on Saturday mornings. “We are using it first,” announced Abena, the drama captain, planting herself in front of the door. “We have had this planned for a week.” Kofi, the choir leader, folded his arms. “So have we. And the hall has the best sound for singing.” Neither was willing to give way.',
        'Two groups of Ghanaian JHS pupils facing each other at a school hall door with arms folded.'
      ),
      pg(
        '📣',
        'The quarrel grew loud. 3A said choirs could rehearse anywhere, even under a tree. 3B said plays could be rehearsed in a classroom. Someone said something rude, and someone else replied in kind. Finally, both captains went to the head teacher, Mr Dzifa, each hoping he would rule in their favour. He listened to them both. Then he said, “I will not choose between you. I think you are clever enough to solve this yourselves. Come back on Monday with a plan that is good for both classes.” The captains stared at him. Neither had expected that.',
        'A calm Ghanaian head teacher seated at his office desk while two surprised JHS captains stand before him.'
      ),
      pg(
        '🤔',
        'On Saturday, the captains sat on the steps outside the hall. Both were cross, but the head teacher’s words nagged them. “We keep arguing about the hall,” said Kofi at last. “But what do we really need?” Abena blinked. Then, slowly, she said, “I need space to move. Actors have to walk around and practise their entrances. I do not need the hall itself, just a big floor.” Kofi nodded. “I need good sound. Voices carry well in the hall, and I need a keyboard, which is kept there. I do not mind when we rehearse, as long as it is regular.”',
        'A girl and a boy sitting thoughtfully on the concrete steps outside a school hall talking quietly.'
      ),
      pg(
        '👂',
        'They spoke more. Abena explained that her actors were fresh in the morning, but flat after lunch. Kofi explained that voices were warmer in the afternoon, and that his sopranos had Saturday morning chores. “So you want mornings and I want afternoons,” said Abena, laughing a little. “Why have we been fighting?” They both realised that they had each been guarding the same thing, the whole hall for the whole day, while their real needs were quite different. When they listened properly, the problem looked much smaller than it had on Friday.',
        'Two pupils laughing warmly together on the hall steps as they compare notes in their notebooks.'
      ),
      pg(
        '📝',
        'Yaa, the stage manager, who had been quietly listening, spoke up. “What if the hall is shared? Drama in the morning, choir in the afternoon, every Saturday? And on the days when the hall is taken, drama can use the classroom block and choir can use the church next door.” Madam Pokua, the music teacher, added, “The church has a good keyboard, and the pastor is always happy to lend it.” They wrote it all down as a shared timetable. It was a solid plan, but the captains felt there was still something missing. They wanted to find something that was not just fair, but better than what either had planned alone.',
        'Pupils and a kindly woman music teacher gathered cheerfully around a classroom desk planning together.'
      ),
      pg(
        '💡',
        'Then Kofi had an idea. “In your play, there is a village scene, is there not? A market crowd?” Abena nodded. “What if my choir sang as the crowd, from behind the stage? A song as the market wakes up?” Abena’s eyes grew wide. “That would make the scene so much richer! And your choir would be part of the play, and the audience would hear them twice.” They both laughed. What had started as a quarrel was turning into a partnership. Each side would gain something it could not have had alone, and nobody would have to lose.',
        'Two excited captains sketching a stage layout together on a sheet of paper.'
      ),
      pg(
        '📅',
        'On Monday, they stood before Mr Dzifa with a neat plan on a single page. Mornings for drama, afternoons for choir, a rota for sharing the keyboard, and a joint scene in which the choir would sing as the market crowd. Mr Dzifa read it twice. He did not smile at once. Then he said, “Is this agreed by both classes?” Both captains nodded. “Then it is approved.” He looked at the page again. “Do you know what you have done? You started with a fight about a door, and ended with a better play.” Abena and Kofi grinned at each other.',
        'A head teacher reading a neat sheet of paper at his desk while two smiling pupils stand side by side.'
      ),
      pg(
        '🎶',
        'Speech Day arrived. The hall was crowded with parents and guests. When the market scene began, the choir hummed softly behind the curtain, then burst into song as the stallholders called out their wares. The audience clapped so long that the actors had to wait before the next line. Afterwards, an elder came to tell Abena and Kofi that it was the best Speech Day he had seen. “Two classes, one performance,” he said. Abena and Kofi looked at each other and smiled. Neither of them felt that they had lost anything. Both felt they had won.',
        'A school choir and young drama actors taking a joyful bow together on a decorated stage before a clapping audience.'
      ),
      pg(
        '🌟',
        'Afterwards, Abena wrote in her notebook. “First, find out what each side truly needs, and not just what they say they want. Second, listen until you understand. Third, look for a plan that helps both. Sometimes it is just a fair share, and sometimes, if we are creative, it can be something better for everyone.” It will not work every time. Sometimes there is not enough to go round, and then we must be fair and kind. But many quarrels, in classrooms and families, look like contests when they are really puzzles, and puzzles can be solved together.',
        'A girl writing peacefully in her notebook while classmates laugh together in the school hall behind her.'
      ),
    ],
    activities: [
      {
        id: 'xn-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Abena really need from the hall?',
        options: [
          'The keyboard',
          'A big floor to practise moving and entrances',
          'The stage lights',
        ],
        correctIndex: 1,
      },
      {
        id: 'xn-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Yaa propose to solve the timing?',
        options: [
          'That 3A and 3B should give up',
          'A shared timetable: drama in the morning, choir in the afternoon',
          'That the head teacher pick one class',
        ],
        correctIndex: 1,
      },
      {
        id: 'xn-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Kofi suggest to make the plan better for both?',
        options: [
          'The choir should sing as the market crowd in the play',
          'The play should be cancelled',
          'Both classes should rehearse separately',
        ],
        correctIndex: 0,
      },
      {
        id: 'xn-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: Two groups in your class both want the same computer at break. Using the story, what should you do first?',
        options: [
          'Argue louder',
          'Ask each group what it really needs, then look for a plan that helps both',
          'Take the computer',
        ],
        correctIndex: 1,
      },
      {
        id: 'xn-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Both classes claim the hall',
          'The head teacher asks them to solve it themselves',
          'The captains discuss what each really needs',
          'They create a shared timetable and a joint scene',
          'The performance on Speech Day pleases everyone',
        ],
      },
      {
        id: 'xn-voc',
        type: 'vocabulary',
        afterPage: 7,
        word: 'rota',
        definition: 'A list that shows whose turn it is to do something.',
        distractors: [
          'A kind of drum',
          'A school uniform',
        ],
      },
    ],
    glossary: [
      {
        word: 'rehearse',
        definition: 'To practise a performance before showing it.',
        pages: [1],
      },
      {
        word: 'captain',
        definition: 'The leader of a team or group.',
        pages: [1],
      },
      {
        word: 'entrances',
        definition: 'The moments when actors come onto the stage.',
        pages: [3],
      },
      {
        word: 'sopranos',
        definition: 'Singers who sing the highest parts.',
        pages: [4],
      },
      {
        word: 'timetable',
        definition: 'A list showing when things will happen.',
        pages: [5],
      },
      {
        word: 'partnership',
        definition: 'A relationship in which people work together.',
        pages: [6],
      },
      {
        word: 'rota',
        definition: 'A list that shows whose turn it is to do something.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: Look for solutions where both sides gain: find what each side really needs and listen until you understand before you decide. The idea is explored further in “The 7 Habits of Highly Effective People” by Stephen R. Covey (1989). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story does not say that every conflict can be solved by sharing. It acknowledges that sometimes there is not enough, and then fairness and kindness must guide us.',
    ],
    reviewQuestions: [
      'Check that the head teacher’s role is shown respectfully.',
      'Check the sums: 8 to 12 is 4 hours; 4 × 3 = 12.',
    ],
    guide: {
      overview:
        'A school story about two classes who turn a dispute over the hall into a shared plan and a better performance.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain the difference between what people say they want and what they need.',
        'Describe how the captains found a win-win plan.',
        'Use the steps on a real disagreement.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: conflict prevention and management; codes to verify)', 'Solving disputes peacefully'],
        ['Creative Arts (NaCCA CCP: drama and music performance; codes to verify)', 'Working together in the arts'],
      ],
      before: ['Ask: when did you and someone else both want the same thing? What happened?'],
      during: ['Stop after Page 3. Ask learners what each captain needs, and what they might share.'],
      after: ['Pairs act out a disagreement and then act out a win-win solution.'],
      discussion: ['Is there always a win-win solution? What do we do when there is not?'],
      reflection: ['What conflict in your life might look different if you asked what each side really needs?'],
      maths: [
        {
          task: 'The hall is free on Saturdays from 8 a.m. to 4 p.m. If drama has the morning until 12 noon, how many hours does choir have in the afternoon?',
          answer: 'Drama: 4 hours (8 to 12). Choir: 4 hours (12 to 4).',
        },
        {
          task: 'There are 3 Saturdays before Speech Day. How many hours of rehearsal does each class get in total if each gets 4 hours a Saturday?',
          answer: '4 × 3 = 12 hours.',
        },
      ],
      support: ['Give a two-column sheet: What I want / What I need.'],
      stretch: ['Find a real school or community dispute that was solved well and describe how.'],
      localise: ['How do elders in your community settle disagreements between families?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 3
  mk({
    key: 'practise-the-hard-part',
    title: 'Practise the Hard Part',
    summary:
      'Some people practise for years and barely improve, while others improve quickly. This article explains the difference, which lies in how you practise, and gives a simple method for any skill.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'practice', 'skill', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Clear, practical, and energetic',
    palette: ['#b91c1c', '#0369a1'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Steady drum pattern with a lively flute (placeholder)',
    pages: [
      pg(
        '🥁',
        'Two boys in a village learn the talking drum. Both practise for an hour every evening, for a whole year. At the end of that time, one has improved a great deal, and the other has hardly changed. How can this be? They put in the same hours. The answer is that practice is not all the same. One boy plays the pieces he already knows well, which feels pleasant but teaches little. The other spends most of his hour on the one difficult rhythm he cannot yet do. It is uncomfortable, and it is what makes him grow.',
        'Two Ghanaian boys with traditional talking drums under a mango tree, one playing casually and the other concentrating carefully on a tricky beat.'
      ),
      pg(
        '🎯',
        'The first secret is to practise the hard part. It is natural to repeat what we do well, because it feels good. A footballer kicks with the strong foot again and again. A pupil redoes the sums she already understands. But we only improve when we work on what is just beyond our reach, neither too easy nor too hard. Pick the thing that you cannot yet do, and make that the centre of your practice. If a task feels slightly uncomfortable, and you cannot do it without thinking, you are probably in the right place.',
        'A young Ghanaian footballer carefully practising passes with his weaker left foot towards small cones on a grassy field.'
      ),
      pg(
        '🔬',
        'The second secret is to be specific. “I will study maths” is vague. “I will do five problems on fractions and check every answer” is clear. A drummer says, “I will play bars five to eight, slowly, ten times, and then a little faster.” A clear goal for each session tells you what to do and when you have finished. Break big skills into small parts, and take on one part at a time. It is like building a wall: you cannot build the whole thing in one move, but you can lay one block at a time and, soon, a wall appears.',
        'A pupil sitting at a desk writing neatly on a small index card beside an open mathematics workbook.'
      ),
      pg(
        '👀',
        'The third secret is full attention. Thirty minutes of real focus is worth more than three hours of half-listening with a phone buzzing beside you. Put distractions away, such as the phone, the radio, and the chattering friend. A short, focused session usually beats a long, tired one. Some people find ten to twenty minutes of deep focus is as much as they can manage in a hard task, and that is perfectly all right. Then rest. When you give your full attention, your brain makes stronger connections, and the skill really starts to stick.',
        'A pupil at a quiet study table with a switched-off radio set aside, deeply focused on her exercise book.'
      ),
      pg(
        '🪞',
        'The fourth secret is feedback. When you practise alone, you cannot always see your own mistakes. Ask a teacher, a coach, or a friend who knows the skill to watch you and tell you what to fix. Or record yourself, and watch or listen again. A student who rewrites a wrong answer and checks why it was wrong learns more than one who just sees the mark. Do not take feedback as an insult. It is a map showing exactly where to go next, and it saves you months of practising the wrong thing.',
        'An older master drummer gently adjusting a young boy’s hand position on a talking drum while the boy watches attentively.'
      ),
      pg(
        '🔁',
        'The fifth secret is repetition, with small changes. Do the hard part, check it, fix it, and do it again. Each time, aim for a slight improvement. At first, it may seem slow, and you may feel you are going nowhere. This is the dull middle of learning, when the progress is happening but cannot yet be seen. Be patient. Keep a notebook or a chart of what you did, so you can look back and see how far you have come. Many people stop in the middle, just before the gains arrive. Those who stay are the ones who improve.',
        'A cheerful pupil standing by a neat wall grid marking a checkmark with a pencil.'
      ),
      pg(
        '😴',
        'The sixth secret is rest. The body and brain need time to recover. A footballer who trains without rest gets injured, and a pupil who studies all night does worse in the exam. Sleep matters most, because during sleep the brain organises what you learned. Short breaks help too. After thirty minutes of hard work, stand up, drink water, and stretch. If you feel pain in the body, as opposed to the tiredness of effort, stop and tell an adult. Practising hard does not mean ignoring your health. A rested learner learns faster than a worn-out one.',
        'A pupil sleeping peacefully under a neat blanket at night with a closed book and a covered cup of water on the bedside table.'
      ),
      pg(
        '❤️',
        'Finally, remember why you are practising. It is easier to keep going when you care about the goal. Why do you want to play the drum, speak good English, or run faster? Perhaps to bring joy to the community, to help your family, or to prove something to yourself. Write your reason down and read it when you feel like quitting. People who have a strong reason, and who practise in the right way, can improve in ways that surprise them. Talent helps, but how you practise often matters just as much.',
        'A girl writing thoughtfully at the top of her practice notebook with a traditional drum resting beside her.'
      ),
      pg(
        '📋',
        'Here is a plan for next week. Choose one skill. Find its hardest part. Set a clear goal for each session. Practise with full focus for fifteen to thirty minutes. Ask someone to give you feedback. Rest well, and record what you did. After a week, compare how you feel with the start. You do not need to practise for hours. You need to practise wisely. A drummer, a footballer, a pupil of mathematics, and a young scientist all improve in the same way: they practise the hard part, patiently, and with care.',
        'A tidy wooden desk with a ruled index card, a pencil, a cup of water, and a talking drum resting nearby.'
      ),
    ],
    activities: [
      {
        id: 'xo-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What does the article say about the first secret of good practice?',
        options: [
          'Repeat what you do best',
          'Practise the part you cannot yet do',
          'Practise as long as possible',
        ],
        correctIndex: 1,
      },
      {
        id: 'xo-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why is feedback useful?',
        options: [
          'It is a map showing what to fix next',
          'It is a punishment',
          'It is not useful',
        ],
        correctIndex: 0,
      },
      {
        id: 'xo-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why does the article say rest matters?',
        options: [
          'Body and brain recover, and sleep helps organise what you learned',
          'Rest is a waste of time',
          'It is only for adults',
        ],
        correctIndex: 0,
      },
      {
        id: 'xo-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: You want to improve your English essays. Using the article, which plan is best?',
        options: [
          'Read the same essay ten times',
          'Pick a weak area, set a clear goal, practise with focus, and seek feedback',
          'Write for five hours without rest',
        ],
        correctIndex: 1,
      },
      {
        id: 'xo-s1',
        type: 'sequencing',
        prompt: 'Put the secrets in the order the article presents them.',
        items: [
          'Practise the hard part',
          'Be specific about each session',
          'Give full attention',
          'Get feedback, repeat, and rest',
          'Remember why you are practising',
        ],
      },
      {
        id: 'xo-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'specific',
        definition: 'Clear and exact, not vague.',
        distractors: [
          'Very loud',
          'Slightly late',
        ],
      },
    ],
    glossary: [
      {
        word: 'rhythm',
        definition: 'A repeated pattern of sounds or beats.',
        pages: [1],
      },
      {
        word: 'uncomfortable',
        definition: 'Not easy or pleasant.',
        pages: [1, 2],
      },
      {
        word: 'specific',
        definition: 'Clear and exact, not vague.',
        pages: [3],
      },
      {
        word: 'attention',
        definition: 'Careful focus of the mind.',
        pages: [4],
      },
      {
        word: 'feedback',
        definition: 'Comments on how well someone is doing.',
        pages: [5],
      },
      {
        word: 'repetition',
        definition: 'Doing something again and again.',
        pages: [6],
      },
      {
        word: 'recover',
        definition: 'To get back strength or health.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: Skill grows fastest through purposeful practice: work on the hard part, with clear goals, full attention, feedback, and rest. The idea is explored further in “Grit” by Angela Duckworth (2016). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The article uses the idea of deliberate practice discussed in research on skill. It does not claim that anyone can reach the top in anything.',
    ],
    reviewQuestions: [
      'Check that the health advice (rest, sleep, stop for pain) is sound with a PE or science teacher.',
      'Check the sums: 20 × 5 = 100; 5 - 2 = 3.',
    ],
    guide: {
      overview:
        'An article that explains six ways to practise well: the hard part, specific goals, focus, feedback, repetition, and rest.',
      lessonMinutes: 45,
      goals: [
        'Name the six ways to practise well.',
        'Choose the hard part of a skill.',
        'Write a specific practice goal.',
        'Plan a week of practice.',
      ],
      subjects: [
        ['Physical Education (NaCCA CCP: skill development; codes to verify)', 'Training smartly'],
        ['Creative Arts (NaCCA CCP: music and performance; codes to verify)', 'Practising an instrument'],
      ],
      before: ['Ask: what do you practise? How do you practise it?'],
      during: ['Stop after Page 4. Ask learners to name the hard part of one skill they use.'],
      after: ['Learners plan a one-week practice schedule using the six secrets.'],
      discussion: ['Why do people avoid the hard part?'],
      reflection: ['What is the hard part of something you want to improve?'],
      maths: [
        {
          task: 'A pupil practises 20 minutes a day for 5 days. How many minutes and how many hours and minutes?',
          answer: '20 × 5 = 100 minutes = 1 hour 40 minutes.',
        },
        {
          task: 'A pupil does 5 problems in 30 minutes with full focus, and 2 problems in 30 minutes while distracted. How many more problems does the focused session give?',
          answer: '5 - 2 = 3 more problems.',
        },
      ],
      support: ['Provide a practice-plan template with goal, focus time, feedback, and rest.'],
      stretch: ['Interview a musician or an athlete about how they practise.'],
      localise: ['How do traditional drummers or dancers in your community learn?'],
      factCheck: ['The ideas follow research on deliberate practice but are simplified. Health advice should be confirmed by a teacher. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 4
  mk({
    key: 'sharpen-the-cutlass',
    title: 'Sharpen the Cutlass',
    summary:
      'A farmer works all day with a blunt cutlass and gets very little done. Ten minutes of sharpening would have saved him hours. This article looks at four ways to keep ourselves sharp: body, mind, heart, and inner life.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'balance', 'wellbeing', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Calm, clear, and warm',
    palette: ['#15803d', '#a16207'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Gentle guitar with soft rain sounds (placeholder)',
    pages: [
      pg(
        '🔪',
        'A young farmer goes to clear a patch of bush, and he works from dawn until the afternoon with a cutlass that has become blunt and dull. He swings and swings, getting more and more tired, and clears only a small patch. A neighbour passes and says, “Why do you not sharpen it?” The farmer wipes his forehead. “I have no time. The work is too much.” The neighbour smiles. Ten minutes at the stone would have saved him hours of effort. This simple picture holds a very important lesson about how we look after ourselves.',
        'A tired young Ghanaian farmer swinging a dull cutlass at thick green bush while an older neighbour watches kindly.'
      ),
      pg(
        '🧠',
        'We are all a bit like that farmer. We are busy with exams, chores, work, and friends, and we tell ourselves, “I have no time to rest, to learn, to be quiet, or to make time for people.” But we are the cutlass. If we never sharpen ourselves, we become dull and tired and cross, and everything we do takes more effort and brings less result. The wise thing is to set aside a little time, regularly, to look after the tool that does all our work: ourselves. There are four parts of us that need this care: the body, the mind, the heart, and the inner life.',
        'A thoughtful pupil looking at a neat row of four well-kept farming and craft tools hanging cleanly on a wooden wall.'
      ),
      pg(
        '💪',
        'The first part is the body. A growing teenager needs good food, plenty of clean water, movement, and sleep. Most doctors say that young people your age need about eight to ten hours of sleep a night. Staying up late to study or to scroll on a phone often means that you learn less the next day, not more. Eating regular meals, with a mix of foods from your local market, such as vegetables, beans, fruit, and grains, gives energy for the day. And movement, such as football, dancing, walking to school, or helping at home, keeps the body strong and the mind clear.',
        'A cheerful pupil enjoying a balanced plate of local beans, plantain, and greens with a water bottle and football nearby.'
      ),
      pg(
        '📖',
        'The second part is the mind. Our minds grow when we learn something new, and they grow stale when we only repeat what we already know. Read a little each day, even for ten minutes. Learn a new word, solve a puzzle, ask a question and find the answer, or try a new skill, such as drawing, coding, or a craft. Do not wait for school to do this for you. A mind that is regularly stretched stays quick and curious, and it makes the harder tasks of the year, like revision and exams, much easier because it is already warm and strong.',
        'A pupil reading curiously under a shady tree with an open storybook and pencil in hand.'
      ),
      pg(
        '❤️',
        'The third part is the heart, which means our relationships. Friends and family are as important to our well-being as food and sleep. Spend time with people you care about, and let them know it. Say thank you, say sorry, and listen to one another. Help someone without being asked. Be kind to people who are lonely. People who feel connected to others are usually happier and healthier, and they cope better when life is difficult. A phone call to a grandparent, or an evening spent talking with the family, does a great deal for the heart. It costs nothing, and it is never wasted.',
        'A Ghanaian family sitting together on a veranda in the evening, talking and laughing warmly around a lantern.'
      ),
      pg(
        '🕊️',
        'The fourth part is the inner life. This means the quiet part of us, where we think about what matters, who we want to be, and what we are grateful for. For many Ghanaian families, this includes prayer, worship, or a time of reflection, and it can be a source of strength. For others it may be a quiet walk, a few minutes of silence, or writing in a notebook. The details are for you and your family. But making a little space each day to be still, away from noise and screens, helps you to know yourself and to stay steady.',
        'A girl sitting quietly at golden sunrise on a veranda step with a closed notebook in peaceful stillness.'
      ),
      pg(
        '⚖️',
        'These four parts work together. If you neglect one, the others suffer. A pupil who studies all night, with little sleep, damages both body and mind. A pupil who has many friends but never reads may feel lost. A person who looks after the body but ignores their heart may feel lonely. You do not need to do large things. A weekly plan with a little of each is enough: a walk, a good book, an evening with the family, and a quiet moment. Balance is not about doing everything equally. It is about not letting any part go blunt.',
        'A brass balance scale resting evenly on a wooden table beside fresh fruit, an open book, a flower, and a glowing lamp.'
      ),
      pg(
        '📅',
        'Try making a simple weekly plan. Choose one small thing for each part. For the body, perhaps a fifteen-minute walk after school and bed by nine-thirty. For the mind, ten minutes of reading before sleep. For the heart, one call or visit to someone you care about. For the inner life, five minutes of quiet each morning. Put it on a card where you can see it. If you miss a day, just carry on the next day, without blaming yourself. The point is not to be perfect. It is to treat yourself as someone worth looking after.',
        'A neat four-colour ribbon card pinned on the wall above a tidy wooden study table.'
      ),
      pg(
        '✨',
        'The farmer in the story learned his lesson. The next morning, he took ten minutes to sharpen his cutlass on a flat stone before starting work. By noon, he had cleared twice as much as the day before, and he went home with energy left over. Keep that picture in mind during exams, long days, and busy seasons. When you feel there is too much to do, that may be exactly the time to pause and sharpen. Looking after your body, mind, heart, and inner life is not selfish. It is how you stay able to do all the things you care about.',
        'A smiling young farmer sharpening his cutlass carefully on a flat whetstone at sunrise, with neatly cleared farmland behind him.'
      ),
    ],
    activities: [
      {
        id: 'xp-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'About how much sleep does the article say young people your age need?',
        options: [
          'Four to five hours',
          'Eight to ten hours',
          'Twelve to fourteen hours',
        ],
        correctIndex: 1,
      },
      {
        id: 'xp-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What does the article say about relationships?',
        options: [
          'They are less important than food',
          'They are as important to well-being as food and sleep',
          'They are a waste of time',
        ],
        correctIndex: 1,
      },
      {
        id: 'xp-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What does the article say about balance?',
        options: [
          'Do everything equally',
          'Do not let any part of yourself go blunt',
          'Ignore your body',
        ],
        correctIndex: 1,
      },
      {
        id: 'xp-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: Exams are near, and you plan to stay up every night. Using the article, what is a better plan?',
        options: [
          'Study all night every night',
          'Study in focused blocks, sleep well, eat well, rest, and talk to someone',
          'Stop studying',
        ],
        correctIndex: 1,
      },
      {
        id: 'xp-s1',
        type: 'sequencing',
        prompt: 'Put the four parts in the order the article presents them.',
        items: [
          'The story of the blunt cutlass',
          'The body',
          'The mind',
          'The heart',
          'The inner life and a weekly plan',
        ],
      },
      {
        id: 'xp-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'blunt',
        definition: 'Not sharp.',
        distractors: [
          'Very heavy',
          'Brightly coloured',
        ],
      },
    ],
    glossary: [
      {
        word: 'blunt',
        definition: 'Not sharp.',
        pages: [1],
      },
      {
        word: 'regularly',
        definition: 'Often and at similar intervals.',
        pages: [2],
      },
      {
        word: 'energy',
        definition: 'The strength and power to do things.',
        pages: [3],
      },
      {
        word: 'stale',
        definition: 'No longer fresh or interesting.',
        pages: [4],
      },
      {
        word: 'relationships',
        definition: 'Connections between people.',
        pages: [5],
      },
      {
        word: 'reflection',
        definition: 'Quiet thought about something.',
        pages: [6],
      },
      {
        word: 'balance',
        definition: 'A steady state in which no part is too big or too small.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: Regularly renew the body, mind, heart, and inner life, because a tool that is never sharpened works poorly. The idea is explored further in “The 7 Habits of Highly Effective People” by Stephen R. Covey (1989). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The inner-life section is written to respect all faiths and none. It does not recommend any particular religion or practice. It is general advice and not medical advice.',
    ],
    reviewQuestions: [
      'Check the sleep advice (about eight to ten hours for teenagers) with a health worker.',
      'Check that the inner-life section is acceptable to the school’s faith mix.',
      'Check the sums: 6:00 - 9:30 is 8 h 30 min; 10 × 7 = 70.',
    ],
    guide: {
      overview:
        'An article using a blunt cutlass to teach the value of regularly caring for body, mind, heart, and inner life.',
      lessonMinutes: 45,
      goals: [
        'Explain the cutlass picture.',
        'Name the four parts of well-being.',
        'Describe one habit for each part.',
        'Make a simple weekly balance plan.',
      ],
      subjects: [
        ['Physical Education (NaCCA CCP: health and well-being; codes to verify)', 'Looking after the body'],
        ['Social Studies (NaCCA CCP: personal development; codes to verify)', 'Balance and self-care'],
      ],
      before: ['Ask: when did you feel “blunt”, tired, cross, and unproductive?'],
      during: ['Stop after Page 2. Ask learners which part of themselves they neglect most.'],
      after: ['Learners make a weekly balance card with one habit for each of the four parts.'],
      discussion: ['Why do people think that resting or caring for themselves is lazy or selfish?'],
      reflection: ['Which part of you needs sharpening this week?'],
      maths: [
        {
          task: 'A pupil sleeps from 9:30 p.m. to 6:00 a.m. How many hours and minutes is that?',
          answer: '8 hours 30 minutes.',
        },
        {
          task: 'If you read for 10 minutes each night for 7 nights, how many minutes is that, and how many hours and minutes?',
          answer: '70 minutes = 1 hour 10 minutes.',
        },
      ],
      support: ['Provide a four-box card: body, mind, heart, inner life.'],
      stretch: ['Ask an elder how they stay well in body, mind, and spirit.'],
      localise: ['What traditional ways does your community use to keep people well and balanced?'],
      factCheck: ['Sleep advice follows common guidance for teenagers and should be confirmed by a health worker. The article is general advice and not medical advice. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 5
  mk({
    key: 'the-voice-in-your-head',
    title: 'The Voice in Your Head',
    summary:
      'Everybody has a quiet voice inside that comments on everything we do. This article shows how that voice can hold us back or help us grow, and how to change what it says.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'self-talk', 'mindset', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Gentle, clear, and encouraging',
    palette: ['#0e7490', '#c026d3'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Soft marimba with a warm pad (placeholder)',
    pages: [
      pg(
        '🗨️',
        'Right now, as you read, there may be a quiet voice inside your head. It says things like, “This is interesting,” or “I wonder how long this is.” That voice is yours. It speaks all day, and it is especially loud when we try something new or make a mistake. What it says matters more than we usually notice. A voice that says, “You are useless, you will never get it,” can make us give up. A voice that says, “This is hard, but I can learn,” can help us keep going. This article is about how to listen to that voice, and how to change it.',
        'A teenage Ghanaian JHS girl sitting calmly at her desk reading an open book with a thoughtful, attentive expression.'
      ),
      pg(
        '😟',
        'Some people have what we can call a fixed voice. It treats abilities as something you are born with. It says, “I am just not good at maths,” “I am not a creative person,” or “Some people are born clever, and I am not one of them.” When things go well, the fixed voice says, “You are a genius,” and when they go badly, it says, “You are a failure.” Both messages are harmful. The first makes us afraid to try anything we might fail at, in case we lose the label. The second makes mistakes feel like a verdict on who we are.',
        'A teenage boy sitting anxiously at his desk looking down at an unopened workbook, shoulders slumped.'
      ),
      pg(
        '🌱',
        'Others have what we can call a growth voice. It says, “I cannot do this yet,” “This is hard, so I will try a different way,” or “A mistake shows me what to fix.” When things go well, it says, “My practice paid off,” and when they go badly, “What can I learn?” This voice does not make the work easier, but it makes us braver and more willing to try. People with a growth voice often improve faster, not because they are cleverer, but because they keep trying and learning rather than avoiding what is hard.',
        'A teenage girl smiling hopefully at her desk beside a sunlit windowsill where a small green seedling grows in a pot.'
      ),
      pg(
        '🔄',
        'The good news is that you can change which voice you listen to. First, notice it. When you feel nervous or discouraged, stop and ask, “What is my voice saying right now?” Say it aloud or write it down. Second, question it. Is it really true that you can never learn this? What evidence do you have? Third, replace it with a fair and helpful sentence. Instead of “I am bad at English,” say “English essays are hard for me right now, and I am going to ask my teacher for help.” Notice, question, replace. It takes practice, like any skill.',
        'A pupil calmly writing in an open notebook divided into three neat sections on a sunlit wooden desk.'
      ),
      pg(
        '🗣️',
        'The voice we use with ourselves often comes from the way others speak to us. A teacher who says, “You are so clever,” may mean well, but it can teach a pupil to worry about losing that label. A teacher who says, “You worked hard on that, and your method was clever,” teaches a pupil that effort and strategy matter. When you praise your friends or younger siblings, try to praise what they did, such as their effort, their patience, or their good idea, and not just who they are. “You kept going even when it was hard” is a more helpful sentence than “You are the best.”',
        'A warm Ghanaian teacher praising a pupil’s careful working in an exercise book while the pupil smiles.'
      ),
      pg(
        '📉',
        'Mistakes are a special test. The fixed voice treats every mistake as shameful and wants to hide it. The growth voice treats a mistake as information. A footballer who misses a goal does not say, “I am no good.” He says, “My foot was too high. I will aim lower.” A pupil who gets a sum wrong does not say, “I am stupid,” but “Where did my method go wrong?” Mistakes are not pleasant, but they are one of the quickest ways to learn. Be as kind to yourself in these moments as you would be to a good friend who made the same mistake.',
        'A young footballer looking thoughtfully at the goalposts after a shot, calmly adjusting his stance to try again.'
      ),
      pg(
        '⚖️',
        'A warning, though: this is not about pretending that everything is easy or telling yourself that you can do anything just by thinking positive thoughts. Some things are really hard, and some need help from others. Some goals take years. A growth voice is honest. It says, “This is difficult, and I need a better plan, more practice, and some help.” It does not say, “It is easy,” and it does not blame you if you need support. Asking for help is part of a growth approach, not a failure of it.',
        'A pupil raising a hand to ask a kindly teacher for guidance on a difficult problem while the teacher leans in attentively.'
      ),
      pg(
        '🤝',
        'It also matters how we speak about other people. When we say, “She is not a maths person,” or “He is slow,” we may be teaching them and ourselves to believe that people cannot change. Try instead, “She finds fractions hard at the moment,” or “He is still learning that.” These small changes make a difference, especially to younger children, who believe what adults and older children say about them. We can all be a growth voice for someone else, and a kind word at the right time can change how a person sees themselves.',
        'An older JHS pupil sitting patiently on a veranda bench encouraging a younger sibling with a storybook.'
      ),
      pg(
        '📝',
        'Try this for a week. Each day, write down one sentence that your inner voice said when you struggled. Then write a fairer, more helpful sentence to replace it. For example: “I will never learn to swim” becomes “I cannot swim yet, and I can take lessons.” At the end of the week, look at your list. You may be surprised how often the voice was harsher than a friend would be. Speak to yourself as a wise, kind elder would speak to you. That voice, steady and fair, will help you through many difficult moments.',
        'An open lined notebook divided down the middle on a peaceful sunlit desk with a pen resting beside it.'
      ),
    ],
    activities: [
      {
        id: 'xq-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What does a growth voice say about a mistake?',
        options: [
          'I am a failure',
          'What can I learn from this?',
          'I should hide it',
        ],
        correctIndex: 1,
      },
      {
        id: 'xq-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What kind of praise does the article recommend?',
        options: [
          'Praise for effort, method, and good ideas',
          'Praise only for being clever',
          'No praise at all',
        ],
        correctIndex: 0,
      },
      {
        id: 'xq-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What does the article say about positive thinking?',
        options: [
          'It makes everything easy',
          'It is not about pretending; sometimes you need a better plan and help',
          'It is useless',
        ],
        correctIndex: 1,
      },
      {
        id: 'xq-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: Your inner voice says, “I will never be able to speak in public.” Using the article, what is a fair and helpful replacement?',
        options: [
          '“I am hopeless.”',
          '“I cannot do it yet. I can start with a small group and ask for feedback.”',
          '“It is easy.”',
        ],
        correctIndex: 1,
      },
      {
        id: 'xq-s1',
        type: 'sequencing',
        prompt: 'Put the ideas in the order the article presents them.',
        items: [
          'We all have an inner voice',
          'The fixed voice and the growth voice',
          'Notice, question, and replace',
          'How we praise ourselves and others',
          'Asking for help and keeping a one-week notebook',
        ],
      },
      {
        id: 'xq-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'replace',
        definition: 'To put something in the place of another.',
        distractors: [
          'To lose',
          'To hide',
        ],
      },
    ],
    glossary: [
      {
        word: 'abilities',
        definition: 'The skills and powers a person has.',
        pages: [2],
      },
      {
        word: 'verdict',
        definition: 'A final judgement.',
        pages: [2],
      },
      {
        word: 'evidence',
        definition: 'Facts that show whether something is true.',
        pages: [4],
      },
      {
        word: 'replace',
        definition: 'To put something in the place of another.',
        pages: [4],
      },
      {
        word: 'strategy',
        definition: 'A plan for achieving something.',
        pages: [5],
      },
      {
        word: 'mistakes',
        definition: 'Things done wrongly.',
        pages: [6],
      },
      {
        word: 'support',
        definition: 'Help or encouragement.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: How we talk to ourselves and about others shapes how we face difficulty; a growth voice treats effort and mistakes as part of learning. The idea is explored further in “Mindset: The New Psychology of Success” by Carol S. Dweck (2006). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The article warns that positive thinking alone does not make hard things easy and that asking for help is part of growth. It avoids blaming anyone who struggles.',
    ],
    reviewQuestions: [
      'Check that the article does not suggest that mental health difficulties can be solved by self-talk alone. A learner who feels very low for a long time should talk to a trusted adult or counsellor.',
      'Check the sums: 7 × 4 = 28; 6 - 4 = 2.',
    ],
    guide: {
      overview:
        'An article about the inner voice, the difference between a fixed voice and a growth voice, and how to change self-talk.',
      lessonMinutes: 45,
      goals: [
        'Explain the fixed voice and the growth voice.',
        'Use notice, question, replace.',
        'Give praise for effort and method.',
        'Write a fairer sentence to replace a harsh one.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: personal development and well-being; codes to verify)', 'Self-talk and resilience'],
        ['English Language (NaCCA CCP: writing and reflection; codes to verify)', 'Reflective writing'],
      ],
      before: ['Ask: what do you say to yourself when you make a mistake?'],
      during: ['Stop after Page 4. Learners write one harsh sentence and a fairer replacement.'],
      after: ['Learners keep a week-long notebook of harsh and fair sentences.'],
      discussion: ['Why do we speak to ourselves more harshly than to friends?'],
      reflection: ['Who spoke kindly to you when you struggled, and what did they say?'],
      maths: [
        {
          task: 'A pupil writes one fairer sentence each day for 7 days. How many sentences are in the notebook, and how many for 4 weeks?',
          answer: '7 sentences; 7 × 4 = 28 sentences.',
        },
        {
          task: 'If your inner voice is harsh 6 times a day, and you replace 4 of them with fair sentences, how many are left harsh?',
          answer: '6 - 4 = 2.',
        },
      ],
      support: ['Provide sentence starters: “I cannot do this yet, and I can…”.'],
      stretch: ['Write a letter to your younger self giving growth-voice advice.'],
      localise: ['What sayings in your language encourage people after a failure?'],
      factCheck: ['The article is general advice, simplified from research on mindset. It is not mental-health advice. The book’s title, author, and year are given from general knowledge.'],
    },
  }),
];

export const BATCH_54_LIFE_LESSONS = BATCH_54_STORIES;
