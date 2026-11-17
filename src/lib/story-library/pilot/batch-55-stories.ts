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
 * Batch 55 (5 original Life Lessons stories and articles, nine pages each, with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to Social Studies, Career Technology, Science, or Computing (see the first cultural note and the teacher guide).
 * These are original stories and articles, each teaching one idea from a well-known book. Stories list their characters; articles have none.
 * Original text written for Ghanaian learners; each factCheck note names the book behind the idea and what to verify.
 */

export const BATCH_55_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'three-advisers',
    title: 'Three Advisers',
    summary:
      'Kwabena wants to start a school garden business and is given three different pieces of advice by three confident people. A story about whose advice to trust, and why the best advisers are the ones who have earned it.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'decision-making', 'advice', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Lively, then thoughtful',
    palette: ['#15803d', '#b45309'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kwabena: a JHS 3 boy who wants to grow vegetables to sell.',
      'Uncle Poku: a loud, cheerful relative who owns a shop and has strong opinions.',
      'Maame Serwaa: a farmer of twenty-five years with calm hands and many scars.',
      'Mr Adu: the school’s agriculture teacher, careful and precise.',
      'Esi: Kwabena’s sister, who asks good questions.',
    ],
    music: 'Cheerful guitar with a light drum (placeholder)',
    pages: [
      pg(
        '🌱',
        'Kwabena had a plan. Behind his grandmother’s house was a patch of land that lay empty. He would grow vegetables there and sell them to neighbours. He had saved forty cedis for seeds and tools. But before starting, he did something wise: he asked for advice. The trouble was that he got three different answers, from three different people, and each was sure that he was right. Kwabena sat on the step with his notebook, feeling confused. “Who should I believe?” he asked his sister Esi. “That,” she said, “is the best question you have asked all week.”',
        'A boy sitting thoughtfully on a doorstep with a notebook, an empty patch of garden land behind him.'
      ),
      pg(
        '📣',
        'The first adviser was Uncle Poku, who owned a shop and loved to give opinions. “Plant maize,” he boomed. “It is easy. Everyone eats maize. Plant the whole plot, and by harvest you will be rich!” He spoke so confidently that Kwabena almost wrote it down. Then Esi asked, “Uncle, how many seasons have you grown maize?” Uncle Poku laughed. “Me? None! But I have seen it grow. How hard can it be?” Kwabena looked at his notebook. He wrote: “Uncle Poku, very sure, never farmed.” It did not seem like enough evidence for forty cedis.',
        'A cheerful, loud man in a provision shop doorway gesturing broadly while Kwabena writes in his notebook and Esi listens.'
      ),
      pg(
        '🌾',
        'The second adviser was Maame Serwaa, an old farmer who lived at the edge of the village. She did not say much. She walked over to the plot, knelt, and took a handful of soil. She let it run through her fingers. “This soil is tired,” she said. “Sandy, and short of goodness. If you plant maize first, you will feed it hungry and get little. Begin with cowpeas. They give something back to the earth. Then maize next season.” Kwabena asked, “Have you grown this kind of crop in such soil?” She smiled slightly. “For twenty-five years. And I have failed more often than you have tried.”',
        'An experienced older woman farmer kneeling on the plot, letting sandy soil run through her fingers while Kwabena watches closely.'
      ),
      pg(
        '🔬',
        'The third adviser was Mr Adu, the school’s agriculture teacher. He did not give a simple answer. “Let me test the soil with you,” he said. He showed Kwabena how to squeeze damp soil in the hand, to dig a small hole and see the layers, and to check how fast water drained. “Sandy,” he agreed, “low in nutrients. Cowpeas first is sensible, because they add nitrogen to the soil. But I am not a farmer in this village, so I would ask someone who has worked this land.” Kwabena noticed that Mr Adu told him what he did not know. That, he thought, was a good sign.',
        'An agriculture teacher crouching beside Kwabena to squeeze damp soil and examine a small test hole in the garden.'
      ),
      pg(
        '🤔',
        'That evening, Kwabena sat with Esi and made a list. “Uncle Poku has no experience, but he is very certain. Maame Serwaa has years of experience on soil like ours, and she has made mistakes and learned from them. Mr Adu has knowledge, but he says himself that he is not a local farmer. Two of them, with different kinds of experience, agree on cowpeas.” Esi nodded. “So you should weigh each person by how much they actually know about this exact question, not by how loud they are.” Kwabena wrote it down. “How confident someone sounds is not the same as how right they are.”',
        'Kwabena and his sister Esi sitting at a wooden table by lamplight comparing notes in an open notebook.'
      ),
      pg(
        '🧭',
        'But Kwabena did not simply throw Uncle Poku’s advice away. He went back to him with a polite question. “Uncle, I am going to try cowpeas first, on advice from Maame Serwaa and Mr Adu. But I need to know how to sell the harvest. You know the market better than anyone I know. What do customers want, and when?” Uncle Poku beamed. On selling, he knew a great deal. He told Kwabena which vegetables sold fastest in the dry season, what price to ask, and how to keep a customer happy. “So the same person,” Kwabena realised, “can be a poor adviser on one thing and a very good one on another.”',
        'Kwabena and Uncle Poku chatting warmly beside a busy market stall stacked with baskets of produce.'
      ),
      pg(
        '🌿',
        'Kwabena planted cowpeas, as Maame Serwaa and Mr Adu advised. He watered them, weeded them, and wrote down everything in his notebook. The plants grew healthy and green. When the season ended, he sold the beans to neighbours at the price that Uncle Poku had suggested, and made enough to pay back the forty cedis and a little more. At the next planting he turned the plants into the soil, as Maame Serwaa had shown him, and planted maize. It grew tall and strong, the best crop the patch had ever given. Kwabena was proud, and the soil was happy.',
        'Kwabena standing proudly beside lush rows of green cowpea plants, holding a woven basket of harvested beans.'
      ),
      pg(
        '🪞',
        'Maame Serwaa came to look at the field. “You listened,” she said. “Not only to me. You asked, you tested, and you compared. And you kept notes, so that you could see what worked.” Kwabena grinned. “I also listened to people who disagreed with each other. At first I wanted to pick the one I liked most. But then I asked what each one had actually done, and why they thought so.” She nodded. “That is rare. Many people only listen to those who agree with them. The ones who disagree are often the ones who teach us the most.”',
        'Maame Serwaa and Kwabena walking together along tall, healthy rows of green maize in warm sunlight.'
      ),
      pg(
        '📝',
        'That night, Kwabena wrote down three questions in his notebook. First: What has this person actually done, and how often have they been right? Second: Can they explain why they think so, not just that they do? Third: What does someone who disagrees with them say? He added a line at the bottom: “Be willing to be wrong. Write down what happens, and learn from it.” Next time you face a big choice, whether it is about school, work, or money, try those three questions before you decide. The loudest voice is not always the wisest, and the quiet person with scars on her hands may know the most.',
        'An open lined notebook and pencil resting on a wooden desk beside a small bowl of dried cowpeas.'
      ),
    ],
    activities: [
      {
        id: 'xr-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did Kwabena give Maame Serwaa’s advice more weight than Uncle Poku’s on the soil?',
        options: [
          'She was older',
          'She had grown crops on such soil for years and learned from failure',
          'She spoke more loudly',
        ],
        correctIndex: 1,
      },
      {
        id: 'xr-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Esi say about how to weigh advice?',
        options: [
          'Weigh it by how loud the person is',
          'Weigh it by how much they really know about the exact question',
          'Choose the first advice you hear',
        ],
        correctIndex: 1,
      },
      {
        id: 'xr-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Kwabena learn about Uncle Poku?',
        options: [
          'He was useless',
          'He was a poor adviser on farming but a good one on selling',
          'He was always right',
        ],
        correctIndex: 1,
      },
      {
        id: 'xr-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: Three people give you different advice on which senior high school to choose. Using the story, what should you do?',
        options: [
          'Pick the one who speaks the most confidently',
          'Ask what each knows, how they know it, and what others say, then decide',
          'Ask nobody',
        ],
        correctIndex: 1,
      },
      {
        id: 'xr-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Kwabena gets three different pieces of advice',
          'He notices who has real experience on this soil',
          'He tests the soil with Mr Adu',
          'He plants cowpeas and then maize',
          'He writes three questions for choosing advisers',
        ],
      },
      {
        id: 'xr-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'evidence',
        definition: 'Facts that show whether something is true.',
        distractors: [
          'A type of soil',
          'A market price',
        ],
      },
    ],
    glossary: [
      {
        word: 'advice',
        definition: 'A suggestion about what someone should do.',
        pages: [1],
      },
      {
        word: 'confidently',
        definition: 'In a way that shows you feel sure.',
        pages: [2],
      },
      {
        word: 'nutrients',
        definition: 'Substances in soil that plants need to grow.',
        pages: [4],
      },
      {
        word: 'experience',
        definition: 'Knowledge gained from doing something over time.',
        pages: [5],
      },
      {
        word: 'evidence',
        definition: 'Facts that show whether something is true.',
        pages: [2],
      },
      {
        word: 'harvest',
        definition: 'The gathering of a crop when it is ready.',
        pages: [2],
      },
      {
        word: 'disagreed',
        definition: 'Had a different opinion.',
        pages: [8],
      },
    ],
    culturalNotes: [
      'Big idea: Weigh advice by each person’s real track record on the exact question, ask them to explain why, and listen to those who disagree. The idea is explored further in “Principles: Life and Work” by Ray Dalio (2017). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story shows respect for the elder’s experience and for the teacher’s knowledge, and it does not mock Uncle Poku, whose knowledge of selling is real.',
    ],
    reviewQuestions: [
      'Check with an agriculture teacher that planting cowpeas first on poor sandy soil, and then maize, is sound advice for the learners’ region.',
      'Check the sums: 40 + 25 = 65.',
    ],
    guide: {
      overview:
        'A story about weighing advice by real experience and learning from people who disagree.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why Kwabena weighed the advisers differently.',
        'Name the three questions for choosing advice.',
        'Use the questions on a real decision.',
      ],
      subjects: [
        ['Career Technology (NaCCA CCP: agriculture and enterprise; codes to verify)', 'Growing crops and choosing methods'],
        ['Social Studies (NaCCA CCP: decision-making; codes to verify)', 'Choosing whom to trust'],
      ],
      before: ['Ask: when you need advice, whom do you ask? Why?'],
      during: ['Stop after Page 4. Ask: whom would you trust most, and why?'],
      after: ['Learners choose a real decision and use the three questions on two advisers.'],
      discussion: ['Can a person be a good adviser on one thing and a poor one on another?'],
      reflection: ['Whose advice do you follow without asking how they know?'],
      maths: [
        {
          task: 'Kwabena saved GH¢40 for seeds. After the season he repaid it and earned GH¢25 more. How much did he have in total?',
          answer: '40 + 25 = GH¢65.',
        },
        {
          task: 'Maame Serwaa has farmed for 25 years, and Kwabena is 15. For how many years had she been farming before Kwabena was born, if she has farmed continuously?',
          answer: '25 - 15 = 10 years.',
        },
      ],
      support: ['Give a three-question card to use when advice is offered.'],
      stretch: ['Interview someone with 20 years of experience about the mistakes that taught them most.'],
      localise: ['Who in your community is known for good advice, and why do people trust them?'],
      factCheck: ['The story is fiction. The farming advice (cowpeas before maize on poor sandy soil) should be confirmed by an agriculture teacher. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 2
  mk({
    key: 'the-margin',
    title: 'The Margin',
    summary:
      'Bridges, farmers, and wise travellers all leave a margin for things going wrong. This article explains why a little extra room is one of the cheapest and most powerful habits a person can have.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'planning', 'safety', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Calm, clear, and practical',
    palette: ['#0369a1', '#a16207'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Steady, reassuring guitar with a soft drum (placeholder)',
    pages: [
      pg(
        '🌉',
        'When engineers design a bridge, they do not make it just strong enough for the heaviest lorry they expect. They make it much stronger, often many times stronger. A bridge that must carry ten tonnes might be built to hold thirty or forty. Why spend so much more? Because they cannot predict everything. A lorry may be overloaded, a flood may weaken the supports, or the ground may shift. The extra strength is called a margin of safety. It costs a little more to build, but it can save lives. This idea is useful far beyond bridges.',
        'A sturdy concrete-and-steel bridge spanning a wide Ghanaian river as a loaded cargo lorry crosses safely.'
      ),
      pg(
        '⏰',
        'Think of a pupil who must reach school by seven-thirty for an examination. The walk takes thirty minutes, so she plans to leave at seven. That sounds exact. But what if a shoe strap breaks, a vehicle blocks the road, or it rains? A pupil with no margin arrives late and flustered. A pupil who leaves at six-thirty, with an extra half hour, arrives calm, perhaps with time to read a page. The extra thirty minutes cost her a little sleep. They bought her peace of mind and perhaps her whole exam.',
        'Two Ghanaian JHS pupils along a morning road: one walking calmly in the foreground and another rushing anxiously behind.'
      ),
      pg(
        '🌾',
        'Farmers in northern Ghana know the lean season, the months before harvest when the last food runs low. Wise families do not eat all the grain after harvest. They store some in granaries, keeping a margin for the months when the fields give nothing. They also keep some seed for next year, even when hungry. This is not greed. It is a way of making sure that a bad year does not become a disaster. Keeping a margin means accepting a little less comfort now to protect against a larger trouble later.',
        'A northern Ghanaian farmer storing harvested grain into a traditional round mud-walled granary while his child helps.'
      ),
      pg(
        '💰',
        'Money works the same way. A pupil or a trader who spends every pesewa as soon as it arrives has no margin. If a school fee rises, a phone breaks, or a family member falls ill, there is nothing to fall back on. Someone with a small emergency saving, even a few weeks’ worth of basic costs, can handle a shock without borrowing, and borrowing at high interest can turn one problem into many. This does not mean never enjoying your money. It means that before you spend all of it, you leave some room for the surprises that life always brings.',
        'A calm market woman placing a small wooden savings box safely inside her stall bag as dark rain clouds gather overhead.'
      ),
      pg(
        '📉',
        'Margins also protect us from our own mistakes. We often assume that a plan will work, that a job will take as long as we expect, or that we will always feel strong. But we are hopeful. Things usually take longer, cost more, and go wrong more often than we imagine. A margin for error lets us be wrong without being ruined. A pupil who starts revising three weeks before an exam can afford to fall ill for a few days. A pupil who starts the night before cannot. The plan did not change. The room for error did.',
        'A tidy study desk with a neat wall grid of colourful checkmarks and an open revision book.'
      ),
      pg(
        '🚫',
        'Sometimes the margin means not doing something. Borrowing to the very limit of what you are allowed is dangerous. So is promising to do every job that you are asked. So is trusting a plan that works only if nothing goes wrong. Ask yourself, “What is the worst that could reasonably happen here, and could I survive it?” If the answer is no, you are taking too great a risk. This is especially true of anything that cannot be undone, such as damage to your health or reputation or a debt you cannot repay. Some risks are simply not worth running.',
        'A thoughtful teenager pausing safely back from the steep edge of a rocky hillside path to choose a wider, safer footpath.'
      ),
      pg(
        '🩺',
        'A margin matters for health too. A pupil who sleeps six hours when he needs eight may feel fine for a few days, but there is no room left when exams or illness come. One who gets enough sleep, food, and rest has reserves to draw on. Teams do the same: a football squad keeps substitutes because players tire or get hurt. A family keeps a first-aid box and a few spare medicines at home, as advised by a health worker. Having some room to spare is how people keep going through difficult times without breaking.',
        'A school football team with fresh substitutes sitting ready on a shaded touchline bench beside a clean white first-aid box.'
      ),
      pg(
        '⚖️',
        'Is there a cost? Yes. A margin always costs something: a little extra time, a little less spending, a little more effort in advance. You might leave early and arrive with time to wait. You might save and not buy the new thing you wanted. People sometimes feel foolish when the margin turns out not to be needed. But that is the nature of insurance: when it works, nothing seems to happen. The days when nothing goes wrong are the days when the margin did its job, quietly. It is a small price for a calm mind and a stronger future.',
        'A calm young traveller sitting peacefully on a lorry-station bench reading a book while late passengers hurry towards a bus.'
      ),
      pg(
        '✅',
        'Try three small margins this week. First, leave home ten minutes earlier than you need to. Second, when you receive money, set aside a small part before you spend the rest. Third, start one assignment a day earlier than you planned. At the end of the week, notice what happened. Did the margin save you from stress? Over time, you may find that leaving room becomes a habit, and that calm is easier to keep. Engineers build bridges with margins so that people can cross safely. You can build your own life the same way.',
        'A cheerful pupil placing a few coins into a small savings tin beside a neatly packed schoolbag ready by the door.'
      ),
    ],
    activities: [
      {
        id: 'xs-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What is the lean season?',
        options: [
          'A season of heavy rain',
          'The months before harvest when food runs low',
          'A time of festivals',
        ],
        correctIndex: 1,
      },
      {
        id: 'xs-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What does a margin for error let us do?',
        options: [
          'Be wrong without being ruined',
          'Avoid all planning',
          'Never make mistakes',
        ],
        correctIndex: 0,
      },
      {
        id: 'xs-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What is the cost of a margin?',
        options: [
          'None at all',
          'A little extra time, money, or effort in advance',
          'A great deal of money',
        ],
        correctIndex: 1,
      },
      {
        id: 'xs-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: You are planning to travel to a family event with a fixed start time. Using the article, what is a sensible plan?',
        options: [
          'Leave at the last possible moment',
          'Leave with extra time and a small spare amount of money',
          'Do not go',
        ],
        correctIndex: 1,
      },
      {
        id: 'xs-s1',
        type: 'sequencing',
        prompt: 'Put the ideas in the order the article presents them.',
        items: [
          'A bridge is built stronger than needed',
          'A pupil leaves early for an exam',
          'Farmers store grain for the lean season',
          'A small emergency saving protects against shocks',
          'A margin costs a little and saves a lot',
        ],
      },
      {
        id: 'xs-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'margin',
        definition: 'Extra room or allowance left for things going wrong.',
        distractors: [
          'A type of bridge',
          'A road sign',
        ],
      },
    ],
    glossary: [
      {
        word: 'margin',
        definition: 'Extra room or allowance left for things going wrong.',
        pages: [1],
      },
      {
        word: 'flustered',
        definition: 'Nervous and confused because of hurry.',
        pages: [2],
      },
      {
        word: 'granaries',
        definition: 'Buildings or containers for storing grain.',
        pages: [3],
      },
      {
        word: 'emergency',
        definition: 'A sudden serious event that needs quick action.',
        pages: [4],
      },
      {
        word: 'reserves',
        definition: 'Extra supplies kept for later.',
        pages: [7],
      },
      {
        word: 'insurance',
        definition: 'Protection against loss or harm.',
        pages: [8],
      },
      {
        word: 'habit',
        definition: 'Something you do so often that it becomes automatic.',
        pages: [9],
      },
    ],
    culturalNotes: [
      'Big idea: Leave room for things going wrong: a margin of safety protects us from our own mistakes and from surprises we cannot predict. The idea is explored further in “The Psychology of Money” by Morgan Housel (2020). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'This is general education and not financial advice. It does not recommend any product or scheme.',
    ],
    reviewQuestions: [
      'Check the claim that bridges are built with large safety margins with an engineering teacher.',
      'Check the lean-season description with a local agriculture teacher.',
      'Check the sums: 35 ÷ 10 = 3.5; 30 minutes = half an hour.',
    ],
    guide: {
      overview:
        'An article that explains the margin of safety through bridges, travel, farming, money, and health.',
      lessonMinutes: 45,
      goals: [
        'Explain a margin of safety.',
        'Give three everyday examples.',
        'Describe the cost of a margin.',
        'Plan three small margins for the week.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: financial literacy and risk; codes to verify)', 'Planning for surprises'],
        ['Science (NaCCA CCP: safety and engineering; codes to verify)', 'Safety factors in design'],
      ],
      before: ['Ask: what do you do to be sure you are on time when it really matters?'],
      during: ['Stop after Page 4. Ask learners to name one place in their life with no margin.'],
      after: ['Learners choose three small margins and try them for a week.'],
      discussion: ['When is it sensible to take a risk, and when is it not?'],
      reflection: ['Where in your life are you running with no room to spare?'],
      maths: [
        {
          task: 'A bridge must carry 10 tonnes and is built to hold 35 tonnes. How many times its expected load can it hold?',
          answer: '35 ÷ 10 = 3.5 times.',
        },
        {
          task: 'A pupil’s walk takes 30 minutes and she leaves 30 minutes early. If she arrives with time to spare, how many minutes is her margin, and how many hours is that?',
          answer: '30 minutes = half an hour.',
        },
      ],
      support: ['Provide a card: Leave early, set aside a part, start a day sooner.'],
      stretch: ['Find out how engineers decide how strong a bridge must be.'],
      localise: ['How do farmers or traders near you prepare for the lean or slow season?'],
      factCheck: ['The article is general education and not financial advice. Safety margins in engineering and the lean-season description should be confirmed by a teacher. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 3
  mk({
    key: 'two-ways-to-see-a-mark',
    title: 'Two Ways to See a Mark',
    summary:
      'Kojo and Adwoa each score nine out of twenty on the same test. One sees a disaster and the other sees information. A story about how the way we see a setback changes what we do next.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'perspective', 'school-life', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Gentle, clear, and hopeful',
    palette: ['#0e7490', '#be185d'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kojo: a JHS 3 boy who worries a great deal and imagines the worst.',
      'Adwoa: his classmate, steady and curious.',
      'Mr Tagoe: the science teacher, patient and observant.',
      'Kojo’s father: a taxi mechanic, firm but kind.',
      'Mama Efe: Adwoa’s mother, who sells vegetables.',
    ],
    music: 'Soft marimba with a calm flute (placeholder)',
    pages: [
      pg(
        '📄',
        'Mr Tagoe handed back the science tests on Monday morning. Kojo looked at his paper and went pale. Nine out of twenty. His hands began to shake. Two rows behind him, Adwoa looked at hers. Nine out of twenty, too. The same mark, on the same test, from the same teacher. But as the class bell rang for break, the two pupils walked out in very different ways. Kojo walked with his head down and his shoulders tight. Adwoa walked with her paper in her hand, studying it carefully. Mr Tagoe, who was watching from the door, noticed.',
        'Two Ghanaian JHS pupils holding returned science papers, Kojo looking downcast and Adwoa studying hers calmly.'
      ),
      pg(
        '😰',
        'Inside Kojo’s head, a storm was raging. “I am stupid. I will fail the whole year. My father will be furious. Everyone will laugh. I will never be a doctor.” Each thought was bigger than the last, and by the time he reached the corridor, he could hardly breathe. He sat alone behind the classroom block and hid his paper under his shirt. He did not eat his snack. He did not go back for the next lesson on time. A single number on a page had turned into a disaster, a story about his whole life, and that story was frightening.',
        'A worried boy sitting alone on a low wall behind a classroom block, tucking a folded paper under his shirt.'
      ),
      pg(
        '🔍',
        'Adwoa, meanwhile, went to a quiet bench. She was disappointed too, because she had hoped for more. But she took out a pencil and began to look at the paper. “Where did I lose the marks?” She saw that she had lost four on the questions about electricity, three on a diagram she had rushed, and the rest on two careless mistakes in arithmetic. “So,” she thought, “it is not that I cannot do science. It is that I did not understand electricity circuits, and I hurried.” That gave her something to work with. She wrote a short list of what to do.',
        'Adwoa sitting calmly on a shady wooden bench reviewing her paper with a pencil and jotting notes in a small notebook.'
      ),
      pg(
        '🤝',
        'Mr Tagoe found Kojo behind the classroom block. “Kojo, I would like to ask you something. When you saw the mark, what did you tell yourself?” Kojo looked away. Then, slowly, he whispered the whole storm. The teacher listened without interrupting. At the end, he said, “That is a great many things for one test to mean. Let us separate what is a fact from what is a story.” He took a piece of paper and drew two columns. In the first he wrote: “Facts.” In the second: “Stories I am telling myself.”',
        'A patient science teacher and Kojo sitting side by side on a bench looking calmly at a ruled sheet divided down the middle.'
      ),
      pg(
        '📋',
        'Together, they filled the columns. Facts: I scored nine out of twenty on one test. I lost most marks on electricity. The next test is in three weeks. Stories: I am stupid. I will fail the year. My father will be furious. Everyone will laugh. Mr Tagoe pointed at the second column. “Which of these do you actually know to be true?” Kojo looked for a long time. “None of them. I only feel them.” Mr Tagoe nodded. “Feelings are real, and they matter. But they are not the same as facts. A feeling can make a small thing look large.”',
        'Close view of a teacher’s pen pointing gently to one side of a neatly ruled two-column page while Kojo listens thoughtfully.'
      ),
      pg(
        '🪟',
        '“Here is another way to see it,” said Mr Tagoe. “The test cannot judge you. It is only a record of what you knew on one day, on one set of questions. It is information, like a map that shows you where the road is rough. Adwoa has just done what a good traveller does. She looked at the map and made a plan. You can too.” Kojo felt something loosen in his chest. “Is it really just information?” “It is,” said Mr Tagoe. “What matters most now is what you choose to do next. That part is yours.” Kojo took a long breath.',
        'Kojo taking a calm, relieved breath beside Mr Tagoe under the shade of a school veranda.'
      ),
      pg(
        '📣',
        'That evening, Kojo told his father, who was working on a taxi engine in the yard. He braced himself. His father wiped his hands slowly. “Nine out of twenty,” he said. “That is not good. But what did you lose on?” Kojo told him. “Then that is where we begin,” said his father. “When an engine fails, I do not say, ‘This engine is hopeless.’ I look for the fault and fix it.” Kojo stared. All day, he had feared his father’s anger. What he got was a question and a plan. Sometimes, the worst thing is not what happens, but what we imagine will.',
        'Kojo and his mechanic father standing beside an open taxi bonnet in a home yard, the father wiping his hands and listening calmly.'
      ),
      pg(
        '📈',
        'Kojo and Adwoa began to study together after school, going over electricity circuits with batteries and bulbs borrowed from the lab. They made mistakes and corrected them. When the next test came, Adwoa scored sixteen and Kojo scored fourteen. It was not perfect, but it was almost double his first mark. Kojo noticed something else. He had been calmer. He had not stopped feeling nervous, but he had learned to ask, “What is true? What can I do?” before the storm took hold. That small pause made a big difference.',
        'Kojo and Adwoa sitting at a laboratory table connecting a small battery, wires, and a glowing little bulb.'
      ),
      pg(
        '💡',
        'At the end of term, Kojo wrote in his notebook. “The mark was the same for both of us. What was different was what we told ourselves about it. Facts are one thing, and the stories we add are another. I can choose to look at the facts, ask what I can do, and take the next step.” This does not mean that setbacks do not hurt, because they do. And if your worries ever feel too heavy to manage alone, or last for a long time, please talk to a trusted adult, a teacher, or a counsellor. You do not have to carry them by yourself.',
        'Kojo writing peacefully in his notebook on a bench at warm sunset while Adwoa smiles nearby.'
      ),
    ],
    activities: [
      {
        id: 'xt-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Adwoa do with her test paper?',
        options: [
          'Hid it',
          'Looked at where she lost marks and made a list',
          'Tore it up',
        ],
        correctIndex: 1,
      },
      {
        id: 'xt-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What were the two columns Mr Tagoe drew?',
        options: [
          'Easy and hard',
          'Facts and the stories we tell ourselves',
          'Marks and names',
        ],
        correctIndex: 1,
      },
      {
        id: 'xt-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'How did Kojo’s father respond to the mark?',
        options: [
          'He was furious',
          'He asked where he lost marks and suggested starting there',
          'He ignored it',
        ],
        correctIndex: 1,
      },
      {
        id: 'xt-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: You get a poor mark and think, “I am hopeless.” Using the story, what should you do first?',
        options: [
          'Believe the thought',
          'Separate facts from stories, see where you lost marks, and make a plan',
          'Hide the paper',
        ],
        correctIndex: 1,
      },
      {
        id: 'xt-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Kojo and Adwoa each score nine out of twenty',
          'Kojo imagines the worst while Adwoa studies her paper',
          'Mr Tagoe helps Kojo separate facts from stories',
          'Kojo talks to his father and makes a plan',
          'Both pupils improve on the next test',
        ],
      },
      {
        id: 'xt-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'fact',
        definition: 'Something that is known to be true.',
        distractors: [
          'A kind of feeling',
          'A school bell',
        ],
      },
    ],
    glossary: [
      {
        word: 'disaster',
        definition: 'A sudden event that causes great harm or trouble.',
        pages: [2],
      },
      {
        word: 'disappointed',
        definition: 'Sad because something did not happen as hoped.',
        pages: [3],
      },
      {
        word: 'arithmetic',
        definition: 'Working with numbers, such as adding and subtracting.',
        pages: [3],
      },
      {
        word: 'fact',
        definition: 'Something that is known to be true.',
        pages: [4],
      },
      {
        word: 'information',
        definition: 'Knowledge or news about something.',
        pages: [6],
      },
      {
        word: 'counsellor',
        definition: 'A person trained to give advice and support.',
        pages: [9],
      },
      {
        word: 'fault',
        definition: 'A part that is wrong or broken.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: We can choose how to see a setback: separate facts from the stories we add, and ask what we can do next. The idea is explored further in “The Obstacle Is the Way” by Ryan Holiday (2014). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story shows a pupil with strong worry and says that persistent worry should be shared with a trusted adult or counsellor. It should not replace professional help.',
    ],
    reviewQuestions: [
      'Check that the story treats worry kindly and does not suggest that worry is silly.',
      'Check the sums: 4 + 3 + 4 = 11 and 20 - 11 = 9; 14 - 9 = 5.',
      'Make sure the school has counselling contacts available.',
    ],
    guide: {
      overview:
        'A story in which two pupils get the same mark and see it in different ways, showing how perspective shapes what we do next.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Separate facts from stories.',
        'Describe how a mark can be information.',
        'Say when to ask for help.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: personal development and well-being; codes to verify)', 'Managing worry and setbacks'],
        ['Science (NaCCA CCP: electricity and circuits; codes to verify)', 'Learning from errors in a test'],
      ],
      before: ['Ask: how do you feel when you get a poor mark? What do you say to yourself?'],
      during: ['Stop after Page 4. Ask learners to fill a facts and stories chart for a recent setback.'],
      after: ['Learners choose a setback and make a three-step plan: facts, stories, next step.'],
      discussion: ['Why do our minds jump to the worst?'],
      reflection: ['What story are you telling yourself right now that you do not know to be true?'],
      maths: [
        {
          task: 'Adwoa lost 4 marks on electricity, 3 on a diagram, and 4 on arithmetic. How many marks did she lose in total, and how does that fit with a score of 9 out of 20?',
          answer: '4 + 3 + 4 = 11 marks lost; 20 - 11 = 9.',
        },
        {
          task: 'Kojo moved from 9 to 14 out of 20. By how many marks did he improve?',
          answer: '14 - 9 = 5 marks.',
        },
      ],
      support: ['Provide a two-column chart: facts and stories.'],
      stretch: ['Interview an adult about a setback that looked terrible at first and turned out to be useful.'],
      localise: ['What do elders say to comfort someone who has failed an examination?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge. The pastoral guidance should be checked against the school’s own counselling policy.'],
    },
  }),

  // 4
  mk({
    key: 'the-apprentice-who-studied-the-diagram',
    title: 'The Apprentice Who Studied the Diagram',
    summary:
      'During the long holidays Selasi works for a master electrician. Two apprentices learn the same job, but one reads, asks, and practises while the other only watches. A story about growing your skill, seeking good advice, and keeping what you earn.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'skills', 'work', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Practical, warm, and steady',
    palette: ['#ca8a04', '#1d4ed8'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Selasi: a 15-year-old JHS 3 boy who spends his holidays with a master electrician.',
      'Mr Ayitey: a licensed electrician of thirty years, strict about safety.',
      'Fiifi: another holiday apprentice, cheerful and careless.',
      'Mrs Quartey: a customer whose house needs rewiring.',
      'Maame Adjoa: Selasi’s mother, who keeps his money safe with him.',
    ],
    music: 'Upbeat guitar with a steady drum (placeholder)',
    pages: [
      pg(
        '⚡',
        'During the long holidays, Selasi’s mother arranged for him to help a master electrician, Mr Ayitey, who had worked with wires and switches for thirty years. “You will carry tools and watch,” said Mr Ayitey. “You will not touch any wire that is connected to power. Electricity does not forgive mistakes.” Selasi nodded. Another boy his age, Fiifi, had started the same week. Both would be paid a small amount each day, as apprentices, for carrying tools and cleaning up. Both were curious. But they were about to take very different paths.',
        'A licensed Ghanaian master electrician in work overalls giving clear safety instructions to two teenage boys beside a toolbox.'
      ),
      pg(
        '📖',
        'Fiifi spent his breaks chatting and looking at his phone. Selasi spent his breaks looking at the wiring diagrams that Mr Ayitey carried in a folder. At first, they looked like a tangle of lines. But each evening, Selasi asked questions. “What does this symbol mean?” “Why is the wire this colour?” “Why do we use this kind of switch here?” Mr Ayitey was surprised. Few apprentices asked so much. Slowly, Selasi began to read the diagrams as easily as a story, and to understand why each part was there.',
        'Selasi leaning attentively over a geometric circuit drawing in a folder while Mr Ayitey points kindly with a pencil.'
      ),
      pg(
        '🧰',
        'Mr Ayitey saw that Selasi was learning, and he let him do more, always with supervision and always with the power switched off and locked. Selasi learned to measure cable, strip wire, fit sockets, and test for safety with a proper tester. Each time he made a mistake, he did not hide it. “I put the wrong cable in this one,” he would say. Mr Ayitey would nod and show him how to correct it. Fiifi, who only watched, was not asked to do anything more. He was still just carrying the tools at the end of the second week.',
        'Selasi carefully fitting an unpowered wall socket with a screwdriver while Mr Ayitey supervises closely beside him.'
      ),
      pg(
        '📚',
        'One evening, Selasi asked, “How can I learn more, sir?” Mr Ayitey pulled out a worn book of electrical safety rules. “Read this, and read it again. And ask the people who have done this job for many years, not those who have only heard about it.” He told Selasi about the Energy Commission, which licenses electricians and sets safety standards in Ghana. “A good electrician never stops learning. New materials, new rules, and new dangers come each year. The more you know, the more careful and valuable you become.” Selasi wrote down the name of the book.',
        'Mr Ayitey showing a thick manual on a wooden workbench to Selasi, who takes notes in his small notebook.'
      ),
      pg(
        '💵',
        'At the end of the holiday, Mr Ayitey paid each boy. Fiifi received the daily amount for carrying tools. Selasi received a little more, because he had done real, careful work. “You will earn more each year,” said Mr Ayitey, “if you keep learning. A person who can do a skilled job well can ask for a good price. A person who can only carry things will always be paid for carrying.” Selasi thought about that for a long time. The difference was not luck. It was that he had used his holiday not just to earn, but to grow.',
        'Mr Ayitey handing holiday wages to Selasi and Fiifi beside a neat workbench and red metal toolbox.'
      ),
      pg(
        '🏦',
        'Selasi’s mother, Maame Adjoa, helped him with another matter. “From each payment, put aside a part before you spend any,” she said. “The first part is yours to keep.” Selasi set aside a tenth, and put it in a savings box. He used some of the rest to buy a small tester and a proper screwdriver set, which were tools that would help him to do better work. He did not lend any money to friends who might not return it. “Spend on what builds your skill, keep a part safe, and be careful with the rest,” she told him.',
        'Selasi placing cedi coins into a wooden savings box at home while holding a new insulated screwdriver set, his mother smiling nearby.'
      ),
      pg(
        '⚠️',
        'The next holiday, Mr Ayitey called Selasi and Fiifi to a job at Mrs Quartey’s house, which needed rewiring. A neighbour came by and said, “I can do this cheaper. I do not need all those rules.” Mrs Quartey hesitated. Mr Ayitey stayed calm. “Madam, a cheap job that causes a fire is the most expensive job of all,” he said. “We follow the safety rules because wires hide danger.” Mrs Quartey agreed to use a licensed electrician. Selasi saw how knowledge and care were worth more than a low price, and how a good reputation was built one careful job at a time.',
        'On a house veranda, Mrs Quartey listening respectfully as Mr Ayitey explains safe wiring while Selasi holds the toolbox.'
      ),
      pg(
        '🔌',
        'Years passed. Selasi finished senior high school and continued to study electrical work properly, with training and a licence. He did not forget Mr Ayitey’s lesson. He read, asked questions, kept learning, and never took risks with safety. He charged a fair price and did honest work, and customers recommended him to others. Fiifi, who had gone on to other things, sometimes met him and said, “You always seemed lucky.” Selasi smiled. “I was not lucky,” he said. “I used the same holiday you did. I just used it to learn.”',
        'A confident young adult Selasi in neat blue technician overalls inspecting a wall distribution box with a voltage tester and notebook.'
      ),
      pg(
        '💡',
        'The idea in this story is simple. The more you know and the better you can do something useful, the more you can earn and the more valuable you are to others. It starts with small steps: read, ask those who know, practise carefully, and keep learning. Keep part of what you earn safe, and spend some of it on improving your skills. And never take shortcuts with safety. This story is about electricity, but it applies to any trade or profession, from farming to tailoring to teaching. What skill could you begin to build this holiday?',
        'A confident young apprentice standing at golden sunrise along a sunlit path carrying a neat toolkit and notebook.'
      ),
    ],
    activities: [
      {
        id: 'xu-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'How did Selasi handle his mistakes?',
        options: [
          'He hid them',
          'He admitted them and learned how to correct them',
          'He blamed Fiifi',
        ],
        correctIndex: 1,
      },
      {
        id: 'xu-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Mr Ayitey say about earning more?',
        options: [
          'It depends on luck',
          'The more skilled you become, the more you can ask for good work',
          'It depends on how loud you are',
        ],
        correctIndex: 1,
      },
      {
        id: 'xu-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why did Mr Ayitey insist on following safety rules at Mrs Quartey’s house?',
        options: [
          'He liked rules',
          'A cheap job that causes a fire costs the most of all',
          'The law does not matter',
        ],
        correctIndex: 1,
      },
      {
        id: 'xu-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: You want to become a good tailor. Using the story, what should you do?',
        options: [
          'Watch only',
          'Ask questions, practise safely with supervision, learn, and save part',
          'Take shortcuts to be quick',
        ],
        correctIndex: 1,
      },
      {
        id: 'xu-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Two boys start as holiday apprentices',
          'Selasi studies the diagrams and asks questions',
          'He is trusted with more careful work',
          'He saves a part of his pay and buys tools',
          'He insists on safety and builds a good name',
        ],
      },
      {
        id: 'xu-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'diagram',
        definition: 'A simple drawing that shows how something works.',
        distractors: [
          'A type of wire',
          'A kind of switch',
        ],
      },
    ],
    glossary: [
      {
        word: 'apprentices',
        definition: 'Young people learning a trade by working with an expert.',
        pages: [1],
      },
      {
        word: 'diagrams',
        definition: 'Simple drawings that show how something works.',
        pages: [2],
      },
      {
        word: 'supervision',
        definition: 'Being watched and guided by someone experienced.',
        pages: [3],
      },
      {
        word: 'licenses',
        definition: 'Gives official permission to do a job.',
        pages: [4],
      },
      {
        word: 'valuable',
        definition: 'Worth a lot; very useful.',
        pages: [4],
      },
      {
        word: 'reputation',
        definition: 'What people generally think of your character and work.',
        pages: [7],
      },
      {
        word: 'shortcuts',
        definition: 'Quicker ways of doing something that may be less safe or good.',
        pages: [9],
      },
    ],
    culturalNotes: [
      'Big idea: Increase your skill and your ability to earn by learning from experienced people, keep part of what you earn, and guard it with care. The idea is explored further in “The Richest Man in Babylon” by George S. Clason (1926). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'Safety: the story stresses that apprentices work under supervision with the power off, and that electricity is dangerous. Learners should never touch wiring or sockets. This is general education and not financial advice.',
    ],
    reviewQuestions: [
      'Ask a licensed electrician to confirm that the work shown is safe and realistic, with the power off and an adult supervising.',
      'Check the role of the Energy Commission in licensing electricians in Ghana.',
      'Check the sums: 20 × 20 = 400; 400 ÷ 10 = 40; 15 × 20 = 300; 400 - 300 = 100.',
    ],
    guide: {
      overview:
        'A story about two holiday apprentices that shows how learning, asking, and saving shape what a person can earn.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain how Selasi built his skill.',
        'Explain why safety matters.',
        'Plan a skill to learn this holiday.',
      ],
      subjects: [
        ['Career Technology (NaCCA CCP: skills for work and electrical safety; codes to verify)', 'Learning a trade safely'],
        ['Social Studies (NaCCA CCP: work, earning, and saving; codes to verify)', 'Skills and income'],
      ],
      before: ['Ask: what skill would you like to learn? Who could teach you?'],
      during: ['Stop after Page 3. Ask: what is the difference between watching and learning?'],
      after: ['Learners choose a skill, name a teacher, and set a first small step.'],
      discussion: ['Is a cheaper job always a better deal? When is it not?'],
      reflection: ['What skill could you start building this holiday?'],
      maths: [
        {
          task: 'Selasi earns GH¢20 a day for 20 days. How much is that, and how much does he put aside if he saves one in ten?',
          answer: '20 × 20 = GH¢400; 400 ÷ 10 = GH¢40.',
        },
        {
          task: 'Fiifi earns GH¢15 a day for 20 days. How much more does Selasi earn?',
          answer: '15 × 20 = GH¢300; 400 - 300 = GH¢100 more.',
        },
      ],
      support: ['Provide a plan card: Skill, teacher, first step, what I will save.'],
      stretch: ['Find out what training and licence an electrician needs in Ghana.'],
      localise: ['Who in your area does skilled work well, and how did they learn?'],
      factCheck: ['The story is fiction. The role of the Energy Commission in licensing electricians and the safety details should be confirmed with a licensed electrician or the Commission. This is not financial advice. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 5
  mk({
    key: 'how-many-saturdays',
    title: 'How Many Saturdays?',
    summary:
      'If you count the Saturdays in a lifetime, the number is large but not endless. This article shows how counting can help us spend our time on what matters, without fear.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'time', 'gratitude', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Calm, thoughtful, and warm',
    palette: ['#0f766e', '#ca8a04'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Soft flute and gentle strings (placeholder)',
    pages: [
      pg(
        '📅',
        'How many Saturdays do you think you have left? It sounds an odd question, but it is worth a moment’s thought. A year has fifty-two weeks, so a year has fifty-two Saturdays. Suppose you are fourteen. You have already had about seven hundred Saturdays. Nobody knows how long they will live, but let us use eighty as a round number for counting. That would leave you about three thousand four hundred Saturdays. It is a big number, and also not an infinite one. This article is about what to do with it.',
        'A colourful wall grid of neat squares with bright hand-drawn circles highlighting one vertical column.'
      ),
      pg(
        '🧮',
        'Let us do the sums together. Fifty-two Saturdays in a year, times eighty years, makes four thousand one hundred and sixty. At fourteen, you have lived fourteen times fifty-two, which is seven hundred and twenty-eight. Subtract, and you get three thousand four hundred and thirty-two. For a grandparent of seventy, the number left is much smaller, perhaps a few hundred. Counting like this does not have to be sad. It is a way of noticing that time is a gift, and that each Saturday is something we are given, not something we are owed. We are free to spend it well.',
        'A Ghanaian JHS pupil working carefully in an open notebook beside a smiling elderly grandparent on a sunny veranda.'
      ),
      pg(
        '📱',
        'How do we usually spend our Saturdays? Many of us drift. We wake late, scroll through a phone, watch screens, and wonder in the evening where the day went. There is nothing wrong with rest, and everyone needs it. But a Saturday that disappears without us noticing is a small loss, and if it happens often, it is a larger one. Counting reminds us to ask, “Did I choose how to spend this day?” The question is not meant to make us feel guilty. It is meant to wake us up, like a bell, so that the day does not slip by unseen.',
        'A teenager lying idly on a woven mat staring at a glowing phone screen while bright afternoon sunlight passes outside the window.'
      ),
      pg(
        '👪',
        'What matters most to spend time on? Ask older people, and they often give the same answers. People come first: family, friends, neighbours, and elders. A visit to a grandparent, a game with a younger brother, or a shared meal with a friend is rarely regretted. Next comes learning, because a skill or a book gives us something we keep. Then comes helping others, through a small act of kindness or a community task. And rest also matters, since a tired person cannot love well or learn well. These four things fill a life with meaning.',
        'A warm Ghanaian family and friends gathered joyfully around a table sharing a Saturday afternoon meal.'
      ),
      pg(
        '🤲',
        'In many Ghanaian communities, Saturday is a day for funerals, weddings, naming ceremonies, and communal work. These gatherings can be tiring, and they take up much of the day. But they are also how people show that they care, and how families and neighbours stay close. When you attend a neighbour’s funeral or help to clean the community, you are spending a Saturday on others. These are among the Saturdays that people remember. They often mean more to those we attend than we know, and they make us part of something larger than ourselves.',
        'Neighbours in a Ghanaian community working cheerfully together on a Saturday morning sweeping and tidying a shared courtyard.'
      ),
      pg(
        '🌙',
        'An old Roman emperor named Marcus Aurelius wrote in his private notebook that we should not act as though we have ten thousand years to live. He did not mean this to frighten himself. He meant it to help him do the right thing now, and not to put off kindness and honest work. Ghanaians have long sayings about not delaying a good deed. The idea is common across the world and across history: time is limited, so use it with care. Used well, this thought makes us calmer and more grateful, not more anxious.',
        'An ancient rolled parchment scroll and clay oil lamp beside a modern Ghanaian student notebook on a wooden desk.'
      ),
      pg(
        '✍️',
        'Here is a simple practice. Each Friday evening, take a minute to choose one thing that matters for tomorrow. Perhaps visit a relative, finish a book, help with the cooking, learn a new song, or play football with a younger cousin. Write it on a small card. On Saturday evening, look at it and ask: Did I do it? How did it feel? It need not be grand. A small, chosen thing is better than a large plan that never starts. After a few weeks, you will notice that your Saturdays have more shape, and your days feel richer.',
        'A teenage boy sitting at his table on Friday evening writing calmly on a small plain card beside a warm lamp.'
      ),
      pg(
        '🙏',
        'Another practice is gratitude. At the end of a Saturday, think of three things you are thankful for. It might be a good meal, a kind word, or a game won. Gratitude turns attention to what we have, not what we lack. People who practise it regularly tend to sleep better and feel happier. It also helps us to notice the good people around us while they are still here to be thanked. If you are sad about someone you have lost, it is natural to feel that way, and talking with a trusted person can help.',
        'A teenage girl sitting peacefully at dusk writing in her plain notebook with a gentle, grateful smile.'
      ),
      pg(
        '🌅',
        'So, how many Saturdays? No one knows the exact number, and that is part of the point. We cannot control how many we are given, but we can choose how to spend the one in front of us. Think of the next Saturday as a gift to be opened carefully. Spend part of it with someone you care about, part of it learning, part of it helping, and part of it resting. If at the end you can say, “That was a good day,” then you have used it well. And then Sunday comes, and another week begins.',
        'A pupil opening wooden shutters at golden sunrise to welcome a bright, fresh Saturday morning.'
      ),
    ],
    activities: [
      {
        id: 'xv-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What does the article say counting Saturdays is meant to do?',
        options: [
          'Make us feel guilty',
          'Wake us up to choose how we spend our time',
          'Make us anxious',
        ],
        correctIndex: 1,
      },
      {
        id: 'xv-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What four things does the article say fill a life with meaning?',
        options: [
          'People, learning, helping others, and rest',
          'Money, fame, speed, and power',
          'Phones, games, sleep, and snacks',
        ],
        correctIndex: 0,
      },
      {
        id: 'xv-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What is the simple Friday practice?',
        options: [
          'Choose one thing that matters for tomorrow and write it on a card',
          'Stay up late',
          'Make a long plan for the year',
        ],
        correctIndex: 0,
      },
      {
        id: 'xv-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: You have a free Saturday. Using the article, what is a good way to plan it?',
        options: [
          'Spend all of it on screens',
          'Choose a mix: time with people, learning, helping, and rest',
          'Do nothing and feel guilty',
        ],
        correctIndex: 1,
      },
      {
        id: 'xv-s1',
        type: 'sequencing',
        prompt: 'Put the ideas in the order the article presents them.',
        items: [
          'Counting the Saturdays in a life',
          'Noticing how we often drift through the day',
          'What matters: people, learning, helping, and rest',
          'A Friday practice of choosing one thing',
          'Gratitude at the end of the day',
        ],
      },
      {
        id: 'xv-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'drift',
        definition: 'To move along without direction or choice.',
        distractors: [
          'To swim fast',
          'To count carefully',
        ],
      },
    ],
    glossary: [
      {
        word: 'infinite',
        definition: 'Without end.',
        pages: [1],
      },
      {
        word: 'subtract',
        definition: 'To take one number away from another.',
        pages: [2],
      },
      {
        word: 'drift',
        definition: 'To move along without direction or choice.',
        pages: [3],
      },
      {
        word: 'regretted',
        definition: 'Wished that it had not happened.',
        pages: [4],
      },
      {
        word: 'communal',
        definition: 'Shared by a group or community.',
        pages: [5],
      },
      {
        word: 'anxious',
        definition: 'Worried and uneasy.',
        pages: [6],
      },
      {
        word: 'gratitude',
        definition: 'The feeling of being thankful.',
        pages: [8],
      },
    ],
    culturalNotes: [
      'Big idea: Time is limited, so choose how to spend it, putting people, learning, kindness, and rest first, and living with gratitude rather than fear. The idea is explored further in “Meditations” by Marcus Aurelius (written in the second century). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'Tone: the article avoids fear and treats the counting as a gift. Teachers should be alert to learners who have lost someone and may find the topic painful. Eighty is used only as a round number for counting.',
    ],
    reviewQuestions: [
      'Check the sums: 52 × 80 = 4,160; 14 × 52 = 728; 4,160 - 728 = 3,432.',
      'Check that the community-gathering description fits the local setting.',
      'Make sure the school has counselling contacts available for sensitive topics.',
    ],
    guide: {
      overview:
        'An article that uses the count of Saturdays in a life to encourage choosing what matters and practising gratitude.',
      lessonMinutes: 45,
      goals: [
        'Calculate the Saturdays in a lifetime.',
        'Name four things that give life meaning.',
        'Plan a Saturday with a mix of activities.',
        'Keep a short gratitude list.',
      ],
      subjects: [
        ['Mathematics (NaCCA CCP: multiplication and subtraction; codes to verify)', 'Counting weeks and years'],
        ['Social Studies (NaCCA CCP: personal development and community life; codes to verify)', 'Using time well'],
      ],
      before: ['Ask: what is the best Saturday you remember? What made it good?'],
      during: ['Stop after Page 2. Learners do the Saturday sums for their own age.'],
      after: ['Learners plan a Saturday using the four elements and report back the next Monday.'],
      discussion: ['Why do people drift through days? What helps them to choose?'],
      reflection: ['What would you like to do with your next five Saturdays?'],
      maths: [
        {
          task: 'There are 52 Saturdays in a year. How many Saturdays are in 80 years?',
          answer: '52 × 80 = 4,160.',
        },
        {
          task: 'A pupil is 14. How many Saturdays has she had, and how many remain if we count to 80?',
          answer: '14 × 52 = 728; 4,160 - 728 = 3,432.',
        },
      ],
      support: ['Provide a four-box chart: people, learning, helping, rest.'],
      stretch: ['Ask an elder what they would do with more Saturdays.'],
      localise: ['What Saturday activities matter most in your community?'],
      factCheck: ['The sums use 80 years as a round number only. Marcus Aurelius is paraphrased from general knowledge. The book’s title and author are given from general knowledge.'],
    },
  }),
];

export const BATCH_55_LIFE_LESSONS = BATCH_55_STORIES;
