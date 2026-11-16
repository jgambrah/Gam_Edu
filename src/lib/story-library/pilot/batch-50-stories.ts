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

type FactCheckItem = NonNullable<NonNullable<PilotStory['teacherGuide']>['factCheck']>[number];

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
  factCheck?: Array<string | FactCheckItem>;
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

const tokensOf = (text: string) =>
  text.split(/\s+/).map((w) => w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''));

/** 1-based page numbers whose text contains the headword as a whole word. */
const glossaryPages = (word: string, pages: Page[]): number[] => {
  const w = word.toLowerCase();
  const found = pages.flatMap((p, i) => (tokensOf(p.text).includes(w) ? [i + 1] : []));
  if (!found.length) throw new Error(`Glossary word "${word}" does not appear on any page`);
  return found;
};

const normalizeFactCheck = (items?: Array<string | FactCheckItem>): FactCheckItem[] | undefined => {
  if (!items || items.length === 0) return undefined;
  return items.map((item) =>
    typeof item === 'string'
      ? {
          claim: 'Big-idea source and curriculum verification',
          explanation: item,
          reference: 'NaCCA JHS Curriculum (Science, Social Studies, Career Technology & Computing)',
        }
      : item
  );
};

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
  const normalizedFc = normalizeFactCheck(g.factCheck);
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
    glossary: s.glossary.map((gItem) => ({ ...gItem, pages: glossaryPages(gItem.word, s.pages) })),
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
      ...(normalizedFc ? { factCheck: normalizedFc } : {}),
    },
  };
};

/**
 * Batch 50 (7 original Big Ideas stories and articles, six pages each, with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to Social Studies, Career Technology, Science, or Computing (see the first cultural note and the teacher guide).
 * These are original stories and articles, each teaching one idea from a well-known book. Stories list their characters; articles have none.
 * Original text written for Ghanaian learners; each factCheck note names the book behind the idea and what to verify.
 */

export const BATCH_50_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'what-mama-rose-really-needed',
    title: 'What Mama Rose Really Needed',
    summary:
      'Uncle Kweku reads out every feature of his gas cookers, yet nobody buys. Ama tries something different: she asks questions. A story about selling by solving a real problem, honestly.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'selling', 'listening', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Brisk, friendly, and practical',
    palette: ['#c2410c', '#0f766e'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Ama: a 14-year-old JHS 3 girl who helps in her uncle’s shop on Saturdays and notices things.',
      'Uncle Kweku: the shop owner, a kind man who talks very fast when he is nervous.',
      'Mama Rose: a kenkey seller with a loud laugh and a cough she tries to hide.',
      'Mr Ankrah: a retired teacher who often passes the shop.',
    ],
    music: 'Light highlife guitar with a bright shaker (placeholder)',
    pages: [
      pg(
        '🍳',
        'Uncle Kweku sold gas cookers, and he knew everything about them. When Mama Rose stopped at his shop one Saturday, he began at once. “Two burners! Stainless steel top! Automatic ignition! Five-year guarantee!” He listed all its features and spoke so fast that Mama Rose could only nod. “It is very nice,” she said politely, and walked on. It was the third customer that morning who had said “very nice” and left. Ama, who was sweeping the floor, noticed something. In all that talking, Uncle Kweku had not asked one single question.',
        'A shop owner proudly pointing at a shiny gas cooker while a kenkey seller nods politely and edges away.'
      ),
      pg(
        '❓',
        'Ama remembered her science teacher saying that a good doctor asks questions before giving medicine. The next morning she saw Mama Rose again and said, “Maame, how do you cook your kenkey?” Mama Rose laughed. “On wood, my child. For four hours, from three in the morning.” “Is it hard?” “The smoke makes my eyes red and my chest tight. And when it rains, I cannot cook at all, so I lose the day.” Ama took out her exercise book and wrote it all down. “And the firewood?” “About twenty cedis every day I cook.”',
        'A girl with an exercise book listening to a kenkey seller stirring a pot over a smoky wood fire.'
      ),
      pg(
        '🧮',
        '“Maame, what would you do if you could finish in half the time?” Mama Rose’s eyes lit up. “I would sell to the workers at five o’clock, before the trotros fill. I could sell twice as much.” Ama went home and did sums at the table. Twenty cedis a day for six days was one hundred and twenty cedis a week for wood. Gas for the same cooking, she and her uncle worked out, would come to roughly seventy cedis. That was about fifty cedis saved each week, with no smoke, and cooking on rainy days too. For the first time that week, Ama felt excited.',
        'A girl at a table filling her exercise book with sums, with a small gas cooker sketched in the margin.'
      ),
      pg(
        '🤝',
        'On Monday Ama sat with Mama Rose and showed her the page. “This is what you spend now. This is what you would spend.” Mama Rose studied it for a long time. “But how will I pay for the cooker?” Uncle Kweku, listening, spoke gently this time. “In small weekly payments, Maame.” Then Ama did something that surprised even her. “But a gas cooker is not for everybody, Maame. If you cooked only on Sundays, wood would be cheaper. I only say it is right for you because you cook six days a week.” Mama Rose looked at her. “You are honest, child. That is why I believe you.”',
        'A girl, an uncle, and a kenkey seller sitting together over a page of figures in the shop.'
      ),
      pg(
        '🔥',
        'Mama Rose bought the smaller cooker, the one that suited her, not the biggest one in the shop. Uncle Kweku was astonished. Before she left, he showed her how to connect the cylinder and how to test for leaks with soapy water. “Keep the cylinder outside the room, in the open air,” he said, “and switch it off at the cylinder every night.” Mr Ankrah, the old teacher, had watched the whole thing. “In all my years,” he said, “I have never seen someone sell a cooker by talking about firewood.”',
        'An uncle showing a kenkey seller how to test a gas connection with soapy water, a cylinder standing in the open air.'
      ),
      pg(
        '💡',
        'That week Uncle Kweku changed. Instead of reading from the box, he began asking, “What do you cook? How often? What worries you about it?” His sales grew, and so did the number of customers who came back and brought their friends. Ama wrote one sentence at the top of her book: “People do not buy things. They buy a solution to a problem they feel.” Remember it. Whether you are selling kenkey, asking a teacher for help, or offering to mend a friend’s phone, begin by asking and listening. Then show, truthfully, how your offer fits the need. And if it does not fit, say so.',
        'A girl writing a sentence at the top of a page, with a busy shop and smiling customers behind her.'
      ),
    ],
    activities: [
      {
        id: 'zq-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why did customers say “very nice” and walk away?',
        options: [
          'The cookers were too cheap',
          'Uncle Kweku listed features without asking what they needed',
          'The shop was closed',
        ],
        correctIndex: 1,
      },
      {
        id: 'zq-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Ama work out from Mama Rose’s answers?',
        options: [
          'She would save about fifty cedis a week and could cook on rainy days',
          'Wood was cheaper',
          'Mama Rose should stop selling kenkey',
        ],
        correctIndex: 0,
      },
      {
        id: 'zq-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did Mama Rose trust Ama?',
        options: [
          'Ama gave her a gift',
          'Ama said a gas cooker is not for everyone and showed why it suited her',
          'Ama was her relative',
        ],
        correctIndex: 1,
      },
      {
        id: 'zq-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You want to sell mobile-phone covers to classmates. Using the story, what is the best first step?',
        options: [
          'Tell everyone your covers are the best',
          'Ask what problems classmates have with their phones, then see if a cover helps',
          'Lower the price every day',
        ],
        correctIndex: 1,
      },
      {
        id: 'zq-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Uncle Kweku lists features and the customer leaves',
          'Ama asks Mama Rose about her cooking',
          'Ama works out the weekly saving',
          'Ama honestly says when a cooker would not be right',
          'Mama Rose buys the cooker that suits her',
        ],
      },
      {
        id: 'zq-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'solution',
        definition: 'An answer to a problem.',
        distractors: [
          'A kind of gas',
          'A price list',
        ],
      },
    ],
    glossary: [
      {
        word: 'features',
        definition: 'Special parts or qualities of a product.',
        pages: [1],
      },
      {
        word: 'guarantee',
        definition: 'A promise to repair or replace a product if it fails.',
        pages: [1],
      },
      {
        word: 'customer',
        definition: 'A person who buys goods or services.',
        pages: [1, 6],
      },
      {
        word: 'cylinder',
        definition: 'The metal container that holds cooking gas.',
        pages: [5],
      },
      {
        word: 'honest',
        definition: 'Truthful; not cheating or hiding things.',
        pages: [4],
      },
      {
        word: 'solution',
        definition: 'An answer to a problem.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Sell by understanding the customer’s real problem and showing how your offer solves it, rather than by listing what you have. The idea is explored further in “Solution Selling” by Michael T. Bosworth (1994). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is about honest selling. Ama tells Mama Rose when the product would not suit her. Do not use it to teach pressure selling.',
    ],
    reviewQuestions: [
      'Check that gas safety advice (cylinder outdoors, leak test with soapy water, switch off at the cylinder) matches current Ghana Gas or NPA safety advice.',
      'The prices are illustrative; adjust them to current local prices.',
    ],
    guide: {
      overview:
        'A story in which a girl learns to sell by asking questions, listening, and solving a real problem honestly.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why asking questions worked better than listing features.',
        'Calculate a weekly saving.',
        'Plan how to find out what a customer really needs.',
      ],
      subjects: [
        ['Career Technology (NaCCA CCP: entrepreneurship and customer service; codes to verify)', 'Understanding customer needs'],
        ['Mathematics (NaCCA CCP: money and rates; codes to verify)', 'Weekly cost and savings'],
      ],
      before: ['Ask: when did a seller talk and talk, and you still did not buy? Why?'],
      during: ['Stop after Page 1. What question could Uncle Kweku have asked Mama Rose?'],
      after: ['In pairs, one pupil is the seller who only asks questions and the other is the customer. Swap roles.'],
      discussion: ['Why did Ama’s honesty make Mama Rose trust her more?'],
      reflection: ['When have you tried to persuade someone without listening to them first?'],
      maths: [
        {
          task: 'Mama Rose spends GH¢20 on firewood on each of 6 cooking days. How much is that a week, and how much is saved each week if gas costs GH¢70?',
          answer: '20 × 6 = GH¢120. 120 - 70 = GH¢50 saved.',
        },
        {
          task: 'At a saving of GH¢50 a week, how many weeks would it take to save GH¢600 (the cost of a small cooker in this story)?',
          answer: '600 ÷ 50 = 12 weeks.',
        },
      ],
      support: ['Write three question starters on the board: What do you…? How often…? What worries you…?'],
      stretch: ['Make a one-page “problem sheet” you could use to interview a customer for a small business idea.'],
      localise: ['Ask a shopkeeper or a trader which question they find most useful to ask a customer.'],
      factCheck: ['The story is fiction, and the prices are illustrative. Gas safety steps should be confirmed with a gas safety source. The book’s title, author, and year are given from general knowledge and should be confirmed before it is credited.'],
    },
  }),

  // 2
  mk({
    key: 'the-truth-at-dedes-bakery',
    title: 'The Truth at Dede’s Bakery',
    summary:
      'Flour has become much more expensive, and the big oven has cracked. Akua watches her mother try to hide it from the workers. A story about telling the truth, and doing the hard thing when there is no perfect answer.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'leadership', 'honesty', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Quiet, serious, and slowly hopeful',
    palette: ['#92400e', '#1d4ed8'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Akua: a 14-year-old JHS 3 girl who helps in her mother’s bakery before school.',
      'Maame Dede: Akua’s mother, the owner of a small bakery in Techiman, tired but proud.',
      'Mr Boateng: the oldest baker, who has worked there for twenty years.',
      'Efua: a young apprentice baker, quick and worried.',
      'Kojo: the delivery man, who rides a cargo tricycle.',
    ],
    music: 'Soft drum and slow guitar, warming at the end (placeholder)',
    pages: [
      pg(
        '🍞',
        'At four o’clock every morning the smell of fresh bread filled the street in Techiman. Akua helped her mother, Maame Dede, before going to school. But this season was different. Flour had become much more expensive, and the price of bread could not rise by much because customers could not afford it. Then, one night, the great oven cracked. Akua found her mother sitting alone in the dark bakery with a pile of bills. When the workers arrived, Maame Dede smiled, said “Good morning,” and said nothing at all.',
        'A woman sitting alone in a dim bakery with a pile of papers, a cracked oven behind her.'
      ),
      pg(
        '🤫',
        'A neighbour had given her advice. “Do not tell your workers,” she said. “They will panic and leave.” So Maame Dede stayed silent. But silence does not stop people from noticing. Mr Boateng saw that the flour sacks were fewer. Efua, the young apprentice, saw the cracked oven. By the end of the week, rumours were flying. “She is selling the bakery.” “She will close at month end.” “She will send us away.” Efua started asking around for other work. The bread became a little less careful. Akua heard the whispering and lay awake wondering what to do.',
        'Bakers whispering together near a cracked oven while a young woman watches from the doorway.'
      ),
      pg(
        '📢',
        'On Monday, before the ovens were lit, Maame Dede asked everyone to come together. Her voice shook. “I owe you the truth. Flour costs far more now. The big oven is broken. If nothing changes, I can pay everyone for only three more months. I do not have a perfect plan. I do not know if we will succeed. But I would rather face this with you than hide it from you.” Nobody spoke. Then old Mr Boateng stood slowly. “Maame,” he said, “I was afraid when I did not know. Now at least we are fighting the same thing.”',
        'A woman addressing a circle of listening bakers in the early morning, one old man standing.'
      ),
      pg(
        '💬',
        'That day the bakery felt different. Kojo suggested selling bread to schools and offices in the early morning. Efua proposed making a smaller loaf, clearly labelled, for those who could not afford the usual one. Mr Boateng knew an old baker in Nkoranza with a spare oven and offered to ask if they could share it on certain nights. Three bakeries nearby agreed to buy flour together for a better price. And Maame Dede said that she would take no wages for two months, so that no one else would lose theirs. Everyone’s job was safe for now.',
        'Workers around a table with notes and a map, a tricycle and a loaf of bread among them.'
      ),
      pg(
        '📋',
        'It was not easy. The school order fell through. One week, the bakery earned nothing at all. Maame Dede did not pretend. She hung a board in the bakery and wrote the figures on it each Friday: what came in, what went out, what was left. Some weeks the numbers were bad, and she wrote them just the same. Akua saw that her mother slept badly and still got up at four. The shared oven worked, the early deliveries grew, and slowly, over many weeks, the bad numbers on the board became smaller and then turned around.',
        'A board on a bakery wall with figures chalked up, a tired woman writing on it at dawn.'
      ),
      pg(
        '💡',
        'Months later, the new oven stood in the corner. Akua wrote in her notebook. “Mama did not have a secret trick. Nobody could tell her exactly what to do. The hard part was not knowing the answer. The hard part was telling the truth when it was frightening, staying when it would have been easier to run, and carrying on while it hurt.” That is true of many hard things in life, from a failing business to a family trouble. There is often no formula. What helps is honesty, courage, asking others for ideas, and taking the next step.',
        'A girl writing in a notebook while a new oven glows warmly behind her and bread cools on racks.'
      ),
    ],
    activities: [
      {
        id: 'zr-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What two problems did the bakery face?',
        options: [
          'Too many customers and too many workers',
          'Expensive flour and a cracked oven',
          'A new rival bakery and a lost licence',
        ],
        correctIndex: 1,
      },
      {
        id: 'zr-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What happened when Maame Dede kept silent?',
        options: [
          'The workers felt calm',
          'Rumours spread and the workers became worried',
          'The bread became cheaper',
        ],
        correctIndex: 1,
      },
      {
        id: 'zr-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Maame Dede help to protect her workers’ jobs?',
        options: [
          'She took no wages for two months',
          'She closed the bakery',
          'She sold the bakery',
        ],
        correctIndex: 0,
      },
      {
        id: 'zr-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A class group project is going badly, and you are the leader. Using the story, what is the best first step?',
        options: [
          'Hide the problem and hope it goes away',
          'Tell the group honestly where things stand and ask for ideas',
          'Blame the quietest member',
        ],
        correctIndex: 1,
      },
      {
        id: 'zr-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The oven cracks and Maame Dede keeps silent',
          'Rumours spread among the workers',
          'Maame Dede tells everyone the truth',
          'The team shares ideas and she takes no wages for two months',
          'The figures slowly improve',
        ],
      },
      {
        id: 'zr-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'rumours',
        definition: 'Stories passed around that may not be true.',
        distractors: [
          'Official letters',
          'Songs sung at work',
        ],
      },
    ],
    glossary: [
      {
        word: 'rumours',
        definition: 'Stories passed around that may not be true.',
        pages: [2],
      },
      {
        word: 'wages',
        definition: 'Money paid to workers for their work.',
        pages: [4],
      },
      {
        word: 'apprentice',
        definition: 'A young person learning a trade by working with an expert.',
        pages: [2],
      },
      {
        word: 'figures',
        definition: 'Numbers, especially about money.',
        pages: [5],
      },
      {
        word: 'formula',
        definition: 'A fixed set of steps that always gives the right answer.',
        pages: [6],
      },
      {
        word: 'courage',
        definition: 'The strength to do something frightening.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: The hard part of hard problems is not knowing the answer but doing what is difficult: telling the truth, staying in the struggle, and carrying on. The idea is explored further in “The Hard Thing About Hard Things” by Ben Horowitz (2014). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story shows a leader who is honest and shares the burden. It does not suggest that every business can be saved, or that workers should be kept at any cost.',
    ],
    reviewQuestions: [
      'Check that the portrayal of the workers is respectful and that the owner’s decision is not presented as the only right one.',
      'The prices are illustrative.',
    ],
    guide: {
      overview:
        'A story about a bakery in trouble that shows why honesty and courage matter most when there is no easy answer.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why silence made things worse.',
        'Describe how honesty led to shared ideas.',
        'Name a hard thing in your own life and one honest step towards it.',
      ],
      subjects: [
        ['Career Technology (NaCCA CCP: entrepreneurship and leadership; codes to verify)', 'Honest leadership in difficult times'],
        ['Social Studies (NaCCA CCP: responsible citizenship and honesty; codes to verify)', 'Honesty and trust'],
      ],
      before: ['Ask: when have you hidden bad news from someone? What happened?'],
      during: ['Stop after Page 2. What should Maame Dede do now?'],
      after: ['Learners write a short honest message that a group leader could give to a team in trouble.'],
      discussion: ['Was the neighbour’s advice to stay silent unreasonable? What are its good and bad sides?'],
      reflection: ['What hard thing are you avoiding, and who could you tell?'],
      maths: [
        {
          task: 'Flour used to cost GH¢240 a bag and now costs GH¢300. By how much, and by what fraction of the old price, has it risen?',
          answer: 'GH¢60, which is 60 ÷ 240 = 1/4, or 25 per cent.',
        },
        {
          task: 'Three bakeries buy flour together and save GH¢15 a bag each. If each buys 40 bags a month, how much does each bakery save?',
          answer: '15 × 40 = GH¢600 a month.',
        },
      ],
      support: ['Role-play the Monday meeting in groups of four.'],
      stretch: ['Interview an adult about a time they had to deliver bad news and how it went.'],
      localise: ['What do small businesses in your town do when prices rise?'],
      factCheck: ['The story is fiction, and the prices are illustrative. Techiman and Nkoranza are towns in the Bono East Region of Ghana. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 3
  mk({
    key: 'when-the-machines-came',
    title: 'When the Machines Came',
    summary:
      'Every age has met a new machine with wonder and fear, from steam engines in England to trains and mobile money in Ghana. This article asks what we can learn from them.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'technology', 'history', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Steady, curious, and thoughtful',
    palette: ['#475569', '#b45309'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Slow rhythmic percussion, like an engine starting up (placeholder)',
    pages: [
      pg(
        '🚂',
        'In 1903, a steam train reached Kumasi. People crowded to see it. The railway had begun at Sekondi in the west, and by 1901 it had reached Tarkwa, a gold mining town. It was a wonder. Before the railway, heavy goods in this part of the world were carried on people’s heads along bush paths, or rolled in barrels. A journey of many days could now be done in a few hours. Some watched in awe. Some were afraid of the noise and the smoke. Some wondered whether the headloaders would lose their livelihood. All of them were seeing something new.',
        'Crowds on a platform watching a steam train arrive in a Kumasi station, with headloaders in the background.'
      ),
      pg(
        '📖',
        'The same thing happened in England, a century earlier. Steam engines began to drive pumps, mills, and later trains. A writer named Humphrey Jennings collected what people of that time wrote about the coming of the machine, in letters, poems, and diaries. He gathered them in a book with the dramatic name Pandaemonium, which comes from an old poem about a place full of noise and demons. The title shows how many people felt. But the book also shows others who thought machines were marvellous. People of that time felt both wonder and dread, sometimes in the same person.',
        'An old English letter and pen beside a drawing of a steam engine and a mill with tall chimneys.'
      ),
      pg(
        '🧵',
        'There were good reasons for both feelings. Machines made cloth far cheaper and faster than hand weavers could. But many weavers lost their work. Factories could be dangerous, hours were long, and children were sent to work in them. Around 1811, some workers in England broke machines in anger. The government made machine-breaking a serious crime and sent soldiers to stop it. The weavers had a real grievance, but breaking machines did not bring back their work. Both the gains and the pain of the machines were real, and the pain fell on the people least able to bear it.',
        'A weaver at a hand loom looking at a large noisy mill machine through a window.'
      ),
      pg(
        '⚖️',
        'In time, people found better ways to respond. They demanded laws to protect children, limit working hours, and make factories safer. They built schools so that young people could learn skills for the new jobs. These changes did not come at once. They took decades of speaking up and organising. The lesson is that a machine is neither good nor bad by itself. What it does to a society depends on the choices that people make about how it is used, who shares in the gains, and who is helped when the old ways of work disappear.',
        'A group of workers and children walking from a factory gate towards a school building.'
      ),
      pg(
        '📱',
        'Ghana has its own recent example. When mobile phones spread, trading changed. Then, in 2009, mobile money began, and today millions of Ghanaians send and receive money by phone without travelling to a bank. Market women can be paid at once. Families can send money home in seconds. But the same technology also brought scams, and a person who could not read well or did not know the rules could lose money. So here too there are gains, there are risks, and there are choices about training and protection. Today the same questions are being asked about artificial intelligence.',
        'A market woman using a mobile phone to receive money, with a customer smiling beside her stall.'
      ),
      pg(
        '❓',
        'So when a new machine arrives, you can ask some good questions. Who gains from it, and who might lose? How can those who lose be helped to learn new skills or find new work? What new dangers does it bring, and what rules or habits will protect people? What must I learn in order to use it well? And what must we keep, such as honesty, care for one another, and time to talk, that no machine should replace? Wonder and worry are both sensible. The people who handle new machines best are those who feel both, and then ask questions and act.',
        'A student at a desk with a list of questions beside a phone and a laptop, thinking.'
      ),
    ],
    activities: [
      {
        id: 'zs-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Where did the railway begin that reached Kumasi in 1903?',
        options: [
          'Accra',
          'Sekondi',
          'Tamale',
        ],
        correctIndex: 1,
      },
      {
        id: 'zs-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What was true about the weavers’ complaint?',
        options: [
          'They had a real grievance, but breaking machines did not bring back their work',
          'They had no reason to complain',
          'The machines never made cloth cheaper',
        ],
        correctIndex: 0,
      },
      {
        id: 'zs-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What does the article say a machine’s effect depends on?',
        options: [
          'Only how fast it is',
          'The choices people make about how it is used and who shares the gains',
          'Whether it makes a noise',
        ],
        correctIndex: 1,
      },
      {
        id: 'zs-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Your town gets a machine that sorts and weighs cocoa quickly, and the porters who used to do it worry about their work. Using the article, what is a good response?',
        options: [
          'Ban the machine at once',
          'Ask who gains and loses, and plan training or new work for those who lose',
          'Ignore the porters',
        ],
        correctIndex: 1,
      },
      {
        id: 'zs-s1',
        type: 'sequencing',
        prompt: 'Put the ideas in the order the article presents them.',
        items: [
          'A train reaches Kumasi and people react with wonder and fear',
          'Writers in England recorded both feelings about machines',
          'Machines helped some and hurt others, and some workers broke machines',
          'People won laws and schools that made the change fairer',
          'Mobile money shows the same pattern in Ghana today',
        ],
      },
      {
        id: 'zs-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'grievance',
        definition: 'A real cause for complaint.',
        distractors: [
          'A kind of machine',
          'A holiday',
        ],
      },
    ],
    glossary: [
      {
        word: 'livelihood',
        definition: 'The work that a person earns a living from.',
        pages: [1],
      },
      {
        word: 'dread',
        definition: 'Great fear about something that may happen.',
        pages: [2],
      },
      {
        word: 'grievance',
        definition: 'A real cause for complaint.',
        pages: [3],
      },
      {
        word: 'decades',
        definition: 'Periods of ten years.',
        pages: [4],
      },
      {
        word: 'scams',
        definition: 'Dishonest tricks used to cheat people of money.',
        pages: [5],
      },
      {
        word: 'artificial',
        definition: 'Made by human skill rather than occurring naturally; artificial intelligence (AI) is computer software that learns from examples.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Big idea: New machines bring wonder and fear, gains and losses together, and a society’s choices decide how fair the change is. The idea is explored further in “Pandaemonium: 1660-1886” by Humphrey Jennings (published 1985). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The article treats both fear and wonder as reasonable. It does not tell learners that technology is always good or always bad.',
    ],
    reviewQuestions: [
      'Check the railway dates (Sekondi to Tarkwa by 1901; Kumasi 1903) against Ghana Railway Company or a history source.',
      'Check that mobile money began in Ghana in 2009.',
      'The England details (machine-breaking from about 1811) are general history; check them with a history teacher.',
    ],
    guide: {
      overview:
        'An article tracing how people reacted to new machines in England and Ghana, and how to ask fair questions about new technology.',
      lessonMinutes: 45,
      goals: [
        'Describe how people reacted to new machines.',
        'Explain why both wonder and fear were reasonable.',
        'Describe how societies made the change fairer.',
        'Ask five good questions about a new technology.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: science, technology and society; history of transport; codes to verify)', 'Technology and change'],
        ['Computing (NaCCA CCP: emerging technologies; codes to verify)', 'Responsible use of technology'],
      ],
      before: ['Ask learners which machine or phone feature would have amazed their grandparents.'],
      during: ['Stop after Page 3. Was the weavers’ response sensible? What else could they have done?'],
      after: ['Learners write five questions to ask about any new technology and test them on mobile money.'],
      discussion: ['Who should help people whose work is replaced by a machine: the government, companies, or families?'],
      reflection: ['Which new technology do you feel both excited and worried about?'],
      maths: [
        {
          task: 'The railway reached Tarkwa by 1901 and Kumasi in 1903. How many years later was that?',
          answer: '1903 - 1901 = 2 years.',
        },
        {
          task: 'Mobile money began in 2009. How many years is that before 2026?',
          answer: '2026 - 2009 = 17 years.',
        },
      ],
      support: ['Make a two-column table on the board: gains and worries for the railway.'],
      stretch: ['Find out how cocoa was moved to the coast before and after the railway.'],
      localise: ['Ask an older person what they remember about the first time they saw a phone or a television.'],
      factCheck: ['Railway dates (Sekondi-Tarkwa by 1901; Kumasi reached in 1903) and the 2009 start of mobile money in Ghana should be confirmed. The early nineteenth-century machine-breaking in England is accurate in outline. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 4
  mk({
    key: 'the-man-who-dropped-his-favourite-idea',
    title: 'The Man Who Dropped His Favourite Idea',
    summary:
      'Johannes Kepler had a beautiful theory about the planets, and a tiny gap of eight minutes of arc stood in its way. This article tells how he let go of it, and what that teaches us about finding the truth.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'astronomy', 'science-history', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Calm, curious, and building',
    palette: ['#1e3a8a', '#d97706'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Soft strings with quiet chimes, like stars appearing (placeholder)',
    pages: [
      pg(
        '🌍',
        'For thousands of years, many people believed that the Earth stood still in the middle of everything, and the Sun, Moon, and stars moved around it. It matched what they saw each day. Then, in 1543, a Polish scholar named Nicolaus Copernicus published a book arguing that the Sun is at the centre and the Earth is one of several planets circling it. It was a bold idea. But Copernicus kept one old belief. He thought that planets must travel in perfect circles, because the circle seemed the most beautiful and perfect shape.',
        'A diagram of the Sun at the centre with six planets on circular paths.'
      ),
      pg(
        '🔭',
        'Several decades later, a young German named Johannes Kepler took up the puzzle. He was clever with numbers and sure that the universe followed a beautiful pattern. He worked with the records of Tycho Brahe, a Danish nobleman who had spent years measuring the positions of planets with great care, long before telescopes. Tycho’s measurements were the best in the world. When Tycho died in 1601, Kepler inherited his notebooks. He turned to the planet that was giving the most trouble, the red planet Mars. However he tried, it never quite fitted a circle.',
        'A young scholar surrounded by notebooks of star positions and a wooden instrument for measuring angles.'
      ),
      pg(
        '📐',
        'For years, Kepler tried circle after circle, and filled pages with calculations. At last he found a circle that matched Tycho’s data almost exactly. It was off by only eight minutes of arc. That is a tiny angle, about a quarter of the width of the full Moon. Many people would have said, “Close enough!” But Kepler knew that Tycho’s measurements were never wrong by so much. “Either my idea is mistaken,” he reasoned, “or Tycho’s careful records are.” He chose to trust the evidence over the idea he loved.',
        'A scholar comparing a drawn circle with a row of measured dots, with a tiny gap marked between them.'
      ),
      pg(
        '🥚',
        'It was painful to give up the perfect circle, but he did. He tried a different shape: the oval, or ellipse. And suddenly everything fitted. In 1609 he published his discovery that each planet moves in an ellipse with the Sun at a special point inside it. He had thrown away a beautiful idea because the facts did not support it, and in doing so he found a law that is still taught today. A gap that most people would have ignored led to a new understanding of how the planets move.',
        'An ellipse drawn with a string and two pins, with the Sun at one marked point and a planet on the curve.'
      ),
      pg(
        '🚶',
        'A writer named Arthur Koestler told this story, and others like it, in a book called The Sleepwalkers. His idea was that the history of science is not a straight road. Even great discoverers often wander, make mistakes, and hold strange beliefs, yet somehow they stumble towards the truth. Kepler himself held many ideas that we now know to be wrong. In 1610 the Italian scientist Galileo used a new telescope and saw moons moving around Jupiter, which showed that not everything circles the Earth. Finding the truth is usually a crooked path rather than a straight line.',
        'A winding path across a landscape with a few figures walking towards a distant light, a telescope on a hill.'
      ),
      pg(
        '🌠',
        'What can you take from this? When your answer is off by only a little, do not hide the gap. It may be pointing you to something new. Be willing to drop your favourite idea when good evidence says it is wrong, as a farmer does who tests a new seed and finds the old one gives more. Ghana has its own tradition of looking up. Farmers have long watched the sky and seasons to decide when to plant. At Kuntunse near Accra, a former satellite dish has been turned into a radio telescope. The next person to find something new could be a Ghanaian pupil.',
        'A Ghanaian pupil looking through a telescope at dusk with a large radio dish in the distance.'
      ),
    ],
    activities: [
      {
        id: 'zt-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What belief about planets did Copernicus keep?',
        options: [
          'They move in perfect circles',
          'The Earth is the centre',
          'They are fixed in place',
        ],
        correctIndex: 0,
      },
      {
        id: 'zt-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did Kepler not accept the circle that was off by only eight minutes of arc?',
        options: [
          'He disliked circles',
          'He trusted that Tycho’s careful measurements were more accurate than that',
          'He ran out of paper',
        ],
        correctIndex: 1,
      },
      {
        id: 'zt-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What shape did Kepler find fitted the planets’ paths?',
        options: [
          'A square',
          'An ellipse, or oval',
          'A straight line',
        ],
        correctIndex: 1,
      },
      {
        id: 'zt-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You test two seeds on separate plots, and the seed you like produces less than the other. Using the article, what should you do?',
        options: [
          'Ignore the result because you like your seed',
          'Accept the evidence and consider changing seeds, while testing again',
          'Stop farming',
        ],
        correctIndex: 1,
      },
      {
        id: 'zt-s1',
        type: 'sequencing',
        prompt: 'Put the events in the order the article describes them.',
        items: [
          'Copernicus puts the Sun at the centre but keeps perfect circles',
          'Kepler inherits Tycho’s notebooks on Mars',
          'He finds a circle that is wrong by eight minutes of arc',
          'He drops the circle and tries an ellipse',
          'He publishes his discovery in 1609',
        ],
      },
      {
        id: 'zt-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'evidence',
        definition: 'Facts or observations that show whether something is true.',
        distractors: [
          'A strong opinion',
          'A type of telescope',
        ],
      },
    ],
    glossary: [
      {
        word: 'centre',
        definition: 'The middle point of something.',
        pages: [1],
      },
      {
        word: 'inherited',
        definition: 'Received from someone who has died.',
        pages: [2],
      },
      {
        word: 'evidence',
        definition: 'Facts or observations that show whether something is true.',
        pages: [3],
      },
      {
        word: 'ellipse',
        definition: 'An oval shape, like a stretched circle.',
        pages: [4],
      },
      {
        word: 'discoverers',
        definition: 'People who find out something new.',
        pages: [5],
      },
      {
        word: 'telescope',
        definition: 'An instrument that makes distant objects look nearer.',
        pages: [5, 6],
      },
    ],
    culturalNotes: [
      'Big idea: Truth is found by a crooked path, and discoverers must be ready to drop even a beautiful idea when evidence disagrees. The idea is explored further in “The Sleepwalkers” by Arthur Koestler (1959). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The article describes Kepler’s work in simple terms. It does not claim that Europeans alone have studied the sky. Many peoples have watched the sky, and the article mentions Ghanaian farmers and the Kuntunse telescope.',
    ],
    reviewQuestions: [
      'Check the dates: Copernicus 1543, Tycho died 1601, Kepler’s ellipse law 1609, Galileo’s Jupiter moons 1610.',
      'Check that eight minutes of arc is about a quarter of the Moon’s width (the Moon is about 30 minutes of arc across).',
      'Confirm the Kuntunse radio telescope description with the Ghana Space Science and Technology Institute or a news source.',
    ],
    guide: {
      overview:
        'An article about Kepler’s decision to drop his favourite idea because of a small gap in the evidence, and what this teaches about finding the truth.',
      lessonMinutes: 45,
      goals: [
        'Describe what Copernicus and Kepler contributed.',
        'Explain why Kepler rejected a circle that nearly fitted.',
        'Explain how a small gap in the evidence can lead to a new discovery.',
        'Describe a time when you should change your mind because of evidence.',
      ],
      subjects: [
        ['Science (NaCCA CCP: the solar system and scientific enquiry; codes to verify)', 'How scientific ideas change'],
        ['Mathematics (NaCCA CCP: angles and measurement; codes to verify)', 'Small angles and measurement'],
      ],
      before: ['Ask: have you ever been sure of something and then found that you were wrong?'],
      during: ['Stop after Page 3. What would you have done about the eight-minute gap?'],
      after: ['Draw an ellipse with a loop of string and two pins, and compare it with a circle.'],
      discussion: ['Why is it hard to drop an idea that we love, and why is it sometimes necessary?'],
      reflection: ['Which of your own ideas would you be most reluctant to change?'],
      maths: [
        {
          task: 'The full Moon is about 30 minutes of arc wide. Eight minutes of arc is about what fraction of that?',
          answer: '8 ÷ 30 ≈ 4/15, a little over a quarter.',
        },
        {
          task: 'There are 60 minutes of arc in one degree. How many degrees are 8 minutes of arc?',
          answer: '8 ÷ 60 = 2/15 of a degree, about 0.13 degrees.',
        },
      ],
      support: ['Use two pins and a loop of string to show how an ellipse is drawn.'],
      stretch: ['Find out what Kepler’s second and third laws say.'],
      localise: ['Ask an older farmer how they decide when to plant, and what signs they watch.'],
      factCheck: ['Dates and names (Copernicus 1543; Tycho Brahe died 1601; Kepler’s first two laws 1609; Galileo’s telescope observations 1610) are standard. The eight-minute detail and “about a quarter of the Moon’s width” should be checked. The Kuntunse radio telescope should be confirmed with a current source. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 5
  mk({
    key: 'the-team-of-five',
    title: 'The Team of Five',
    summary:
      'Forty pupils must build a solar tomato dryer for the district science fair, and after a week nothing is built. A small team with a clear aim and simple rules makes the difference. A story about small teams that move fast.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'teamwork', 'science-project', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Lively, practical, and encouraging',
    palette: ['#0d9488', '#f59e0b'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Nii Lante: a JHS 3 boy who is calm and good at planning.',
      'Gifty: a neat, careful pupil who keeps the notebook.',
      'Issah: a pupil who loves building with wood and tin.',
      'Mrs Mensah: the science teacher, patient and clear.',
      'Mr Asare: the head teacher, who listens and trusts.',
      'Maame Adwoa: a tomato seller who tastes the results.',
    ],
    music: 'Upbeat drums with a light shaker (placeholder)',
    pages: [
      pg(
        '🍅',
        'Mrs Mensah had a challenge for JHS 3. At the district science fair, the class would show a solar dryer that could keep tomatoes from rotting. Tomatoes are cheap in the season and spoil quickly. Everyone in the class of forty wanted to help, and the first week was a mess. Every decision needed a vote. Should the box be painted black or silver? Should the frame be wood or metal? Every hand went up. By Friday, they had held four meetings and built nothing. The fair was only three weeks away.',
        'A crowded classroom of pupils all talking and raising hands, with a blank drawing on the board.'
      ),
      pg(
        '🧭',
        'Mrs Mensah went to the head teacher, Mr Asare. “They all care,” she said, “but forty people cannot build a box.” Mr Asare thought about it. “Choose a small team,” he said, “with a clear aim, and let them get on with it. I will back you.” But Mrs Mensah did not want the other pupils to feel left out. So the whole class kept a job: they would collect old tin and wood, and test the tomatoes later. The five pupils chosen were Nii Lante, Gifty, Issah, Mabel, and Kwaku. The aim was simple: tomatoes dried in two days, clean and safe.',
        'A teacher and head teacher talking in an office, with a short list of five names and a clear aim on the desk.'
      ),
      pg(
        '📝',
        'The team agreed on simple rules. They would write a one-page plan. For small decisions, any of them could decide without asking the others. They would meet for ten minutes each afternoon, no longer. They would test early, even if the first model looked ugly. And every result, good or bad, went up on a board by the classroom door. “We do not hide failed tests,” said Nii Lante, “because failing early is cheaper than failing at the fair.” Issah built the first dryer within three days. The class cheered as the five carried it out into the sun.',
        'Five pupils at a table with a one-page plan, a rough wooden box with a plastic top ready in the yard.'
      ),
      pg(
        '🌧️',
        'The first dryer failed. After two days the tomatoes had gone mouldy. The board by the door said so plainly, with a note from Gifty: “Wet air trapped inside.” They did not argue about whose fault it was. In the next afternoon meeting, Issah suggested air holes at the top and bottom, with fine net to keep out flies. They fixed it that evening. The second try dried the slices better, but too slowly. They raised the slope of the glass so it caught more sunshine. Each fix took a day. Because each was small, the team never lost heart.',
        'A boy fitting fine net over air holes in a wooden dryer box while a girl writes on a notice board.'
      ),
      pg(
        '☀️',
        'The third dryer worked. Tomato slices were dry and firm in two days, while those left on a mat outdoors were still damp and had dust and flies on them. Maame Adwoa, a tomato seller from the market, was invited to taste. She chewed a slice slowly. “Clean,” she said, “and it keeps its colour. If I could dry my tomatoes like this in the glut season, I would not throw so many away.” The five pupils grinned. They also thanked the rest of the class, who had collected the tin, the wood, and the net, and written the poster.',
        'A market woman tasting a slice of dried tomato beside a glass-topped dryer, with pupils smiling.'
      ),
      pg(
        '🏆',
        'At the district fair, the whole class stood behind the table as the five explained their dryer. They won a prize, and Nii Lante pointed at the notice board photograph. “Forty of us had ideas,” he said. “Five of us built it. All of us made it possible.” Mrs Mensah kept the lesson for later classes. A small team with a clear aim, the freedom to decide, and simple rules can often move faster than a big group where everything needs agreement. But the rest of the people still matter. Give them real jobs, and make sure everyone shares the credit.',
        'Five pupils presenting a solar dryer at a fair table with the whole class cheering behind them.'
      ),
    ],
    activities: [
      {
        id: 'zu-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why had nothing been built after the first week?',
        options: [
          'Nobody cared',
          'Every decision needed a vote from forty pupils',
          'The tomatoes were out of season',
        ],
        correctIndex: 1,
      },
      {
        id: 'zu-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What aim was given to the team of five?',
        options: [
          'Dried tomatoes in two days, clean and safe',
          'The prettiest dryer in the district',
          'A dryer that cost nothing',
        ],
        correctIndex: 0,
      },
      {
        id: 'zu-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did the team handle the failed first dryer?',
        options: [
          'They hid the result',
          'They recorded it on the board, found the cause, and fixed it in small steps',
          'They gave up',
        ],
        correctIndex: 1,
      },
      {
        id: 'zu-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Your class of 40 must prepare a stage play in two weeks, and meetings are not getting anywhere. Using the story, what is a good plan?',
        options: [
          'Cancel the play',
          'Pick a small team with a clear aim and simple rules, and give others real jobs',
          'Hold a vote on every line',
        ],
        correctIndex: 1,
      },
      {
        id: 'zu-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The whole class meets and nothing gets built',
          'A small team of five is chosen with a clear aim',
          'The team agrees on simple rules',
          'The first dryers fail and are fixed in small steps',
          'The third dryer works and the class shares the credit',
        ],
      },
      {
        id: 'zu-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'aim',
        definition: 'What you are trying to achieve.',
        distractors: [
          'A kind of timber',
          'A written test',
        ],
      },
    ],
    glossary: [
      {
        word: 'solar',
        definition: 'Using the heat or light of the Sun.',
        pages: [1],
      },
      {
        word: 'aim',
        definition: 'What you are trying to achieve.',
        pages: [2],
      },
      {
        word: 'decisions',
        definition: 'Choices about what to do.',
        pages: [3],
      },
      {
        word: 'mouldy',
        definition: 'Covered with a furry growth that appears on food that has gone bad.',
        pages: [4],
      },
      {
        word: 'glut',
        definition: 'A time when there is much more than people can use.',
        pages: [5],
      },
      {
        word: 'credit',
        definition: 'Praise or thanks for something achieved.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: A small, focused team with a clear aim, trust, and few rules can often get difficult work done faster than a large group. The idea is explored further in “Skunk Works” by Ben R. Rich and Leo Janos (1994). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story does not say large groups are bad or that most pupils should be left out. It insists that the rest of the class has real jobs and shares the credit.',
    ],
    reviewQuestions: [
      'Check that a small solar dryer with ventilation and netting is a realistic school project.',
      'Check food safety advice with a teacher or health officer before pupils eat anything they dry.',
    ],
    guide: {
      overview:
        'A story about a class that builds a solar tomato dryer by using a small team, a clear aim, and simple rules.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why the big group was slow.',
        'List the team’s simple rules.',
        'Plan a small team for a class project.',
      ],
      subjects: [
        ['Science (NaCCA CCP: energy from the Sun and food preservation; codes to verify)', 'Solar drying'],
        ['Career Technology (NaCCA CCP: design and technology; teamwork; codes to verify)', 'Designing, testing, and improving'],
      ],
      before: ['Ask: which works better for a job: a big group or a small one? When?'],
      during: ['Stop after Page 2. What jobs could the other thirty-five pupils do?'],
      after: ['Learners pick a class task and write five simple rules for a small team that would do it.'],
      discussion: ['Was it fair for only five pupils to build the dryer? What made it fair?'],
      reflection: ['When have you been in a group where too many voices slowed things down?'],
      maths: [
        {
          task: 'The team dried tomatoes in 2 days instead of the 4 days it takes by the roadside. By what fraction was the time cut?',
          answer: '2 ÷ 4 = half.',
        },
        {
          task: 'The class has 40 pupils and the team has 5. What fraction of the class is in the team, and how many others are helping?',
          answer: '5/40 = 1/8; 35 others.',
        },
      ],
      support: ['Role-play the first meeting and the second meeting to show the difference.'],
      stretch: ['Draw a design for a solar dryer for fish or cassava, and list how you would test it.'],
      localise: ['Ask a farmer or trader how they keep tomatoes, fish, or cassava from spoiling in the glut season.'],
      factCheck: ['The story is fiction. A ventilated solar dryer with net is a recognised low-cost way to dry produce, but its details should be checked by a science or agriculture teacher. The book’s title, authors, and year are given from general knowledge.'],
    },
  }),

  // 6
  mk({
    key: 'why-the-spray-stopped-working',
    title: 'Why the Spray Stopped Working',
    summary:
      'The first year, the mosquito spray worked well. A few years later, it worked much less. This article uses mosquitoes, and the finches of a small island, to show how living things change over generations.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'science', 'health', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Clear, steady, and curious',
    palette: ['#15803d', '#a16207'],
    voice: 'One clear, friendly narrator throughout; no character voices',
    characters: [],
    music: 'Gentle night sounds with soft marimba (placeholder)',
    pages: [
      pg(
        '🦟',
        'A health team sprayed the houses of a village against mosquitoes, which carry malaria. In the first year, there were far fewer mosquitoes, and fewer children fell ill. The villagers were delighted. A few years later, the team sprayed again with the same chemical. This time many mosquitoes simply flew away unharmed. The spray still worked, but not nearly as well. Nothing had been wrong with the spray. So what had changed? The answer lies in something that scientists have studied in birds, flowers, and insects: how living things change from one generation to the next.',
        'A health worker spraying the wall of a house while mosquitoes hover and a child watches from the doorway.'
      ),
      pg(
        '🧬',
        'Mosquitoes of one kind are not all exactly the same, just as children in one class are not all the same height. Small differences are passed on from parents to young ones. Most of the differences do not matter. But one tiny difference in the body of a mosquito could help it survive the spray. A mosquito with that difference would be very rare, so rare that nobody would notice it. In the first spraying, the rare mosquito was hidden among thousands of others. Nobody noticed it, and the mosquito did not know it was special.',
        'Rows of mosquitoes that look almost the same, with one slightly different one highlighted.'
      ),
      pg(
        '♻️',
        'Then came the spray. Nearly all the mosquitoes died, but the rare ones lived. They laid eggs, and their young inherited the same difference. After the next spray, again most died, and again those with the difference survived and bred. Each time, the share of mosquitoes that could survive the spray grew. Nobody planned this and the mosquitoes did not choose it. Scientists call it natural selection. It is like a sieve: the spray removes those who cannot survive it, and leaves those who can. After enough rounds, most of the mosquitoes that remain are the ones the spray cannot easily kill.',
        'A sieve letting through a few mosquitoes marked with a ring as the rest fall away, with new generations below.'
      ),
      pg(
        '🐦',
        'Scientists have watched the same thing in birds. On a small island in the Galápagos, called Daphne Major, Peter and Rosemary Grant spent many years measuring finches and their beaks. In 1977 there was a drought. Soft seeds ran out and only big, hard seeds remained. Birds with deeper, stronger beaks could crack them and survived. Those with smaller beaks starved. The next season, the young birds had deeper beaks on average. Within just a few years, a small change was seen. A writer named Jonathan Weiner told this story in a book called The Beak of the Finch.',
        'Two finches on a rocky island, one with a slim beak and one with a deep beak cracking a hard seed.'
      ),
      pg(
        '🛡️',
        'Studies in many parts of Africa, including Ghana, have found mosquitoes that can survive the chemicals once used on bed nets. This does not mean that nets are useless. A net is still a physical barrier, and health workers now use different chemicals, new kinds of nets, and other measures together. So the first lesson is to keep sleeping under a net every night, and to follow the advice of your local health worker. The same idea applies to medicines for germs. Take medicine exactly as the health worker says, finish the course, and never share it. That helps to stop germs from becoming hard to kill.',
        'A child sleeping safely under a bed net while a nurse explains medicine to a mother nearby.'
      ),
      pg(
        '🌱',
        'Some people, including many families in Ghana, hold different beliefs about where living things came from. This article does not ask you to change what you believe. It describes only what scientists have observed within a few years: living populations can change quickly when conditions favour some members over others. We can use this knowledge to protect health, by using chemicals wisely and combining them, by keeping nets in good repair, and by following health advice. A good scientist asks, “What can I observe?” and a good citizen asks, “How can I use what I know to keep people safe?”',
        'A pupil and a health worker looking at a chart of mosquito numbers over several years.'
      ),
    ],
    activities: [
      {
        id: 'zv-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What was strange about the spray after a few years?',
        options: [
          'It had become poisonous to people',
          'It worked much less well, although nothing was wrong with it',
          'It was no longer made',
        ],
        correctIndex: 1,
      },
      {
        id: 'zv-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What does the sieve picture explain?',
        options: [
          'Why mosquitoes fly at night',
          'How spray removes those that cannot survive it and leaves those that can',
          'How nets are made',
        ],
        correctIndex: 1,
      },
      {
        id: 'zv-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What happened to the finches of Daphne Major after the drought?',
        options: [
          'The young birds had deeper beaks on average',
          'They all left the island',
          'Their beaks became smaller',
        ],
        correctIndex: 0,
      },
      {
        id: 'zv-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A neighbour stops taking her prescribed medicine after three days because she feels better. Using the article, what should she do?',
        options: [
          'Keep the rest for next time',
          'Ask the health worker, and take the full course as advised',
          'Share it with a friend',
        ],
        correctIndex: 1,
      },
      {
        id: 'zv-s1',
        type: 'sequencing',
        prompt: 'Put the ideas in the order the article presents them.',
        items: [
          'Spraying works well at first and then works less well',
          'Mosquitoes differ slightly, and a rare difference helps some survive',
          'Survivors breed and their young inherit the difference',
          'Finches on Daphne Major show the same process after a drought',
          'We use this knowledge to protect health, with nets and medicines used properly',
        ],
      },
      {
        id: 'zv-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'selection',
        definition: 'In biology, natural selection is the process by which individuals that survive and breed pass on their features.',
        distractors: [
          'A kind of spray',
          'A school subject',
        ],
      },
    ],
    glossary: [
      {
        word: 'malaria',
        definition: 'A serious disease spread by the bite of some mosquitoes.',
        pages: [1],
      },
      {
        word: 'generation',
        definition: 'All the individuals born around the same time.',
        pages: [1],
      },
      {
        word: 'inherited',
        definition: 'Received from parents through their bodies.',
        pages: [3],
      },
      {
        word: 'selection',
        definition: 'In biology, natural selection is the process by which individuals that survive and breed pass on their features.',
        pages: [3],
      },
      {
        word: 'drought',
        definition: 'A long period without enough rain.',
        pages: [4],
      },
      {
        word: 'barrier',
        definition: 'Something that blocks the way.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Big idea: Living populations change over generations when some individuals survive and breed more than others; we can see this in a few years in mosquitoes and birds. The idea is explored further in “The Beak of the Finch” by Jonathan Weiner (1994). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'Respect: many Ghanaian families hold religious beliefs about origins. The article says so and describes only what has been observed in a few years, such as resistance in mosquitoes. It does not discuss human origins.',
    ],
    reviewQuestions: [
      'Confirm with the Ghana Health Service or a malaria researcher the statement that insecticide resistance in mosquitoes has been found in Ghana and the advice about nets.',
      'Check the Daphne Major drought (1977) and the researchers’ names.',
      'Ask a health worker to confirm the medicine advice on Page 5.',
    ],
    guide: {
      overview:
        'An article that explains natural selection through mosquito resistance and Galápagos finches, and links it to bed nets and medicines.',
      lessonMinutes: 45,
      goals: [
        'Explain why a spray can stop working.',
        'Describe natural selection in simple words.',
        'Describe what happened to the finches after the drought.',
        'List safe habits for bed nets and medicines.',
      ],
      subjects: [
        ['Science (NaCCA CCP: living things and health; diseases and prevention; codes to verify)', 'How populations change over generations'],
        ['Social Studies (NaCCA CCP: health and community well-being; codes to verify)', 'Using nets and medicines wisely'],
      ],
      before: ['Ask: do you know anyone who sleeps under a net every night? Why?'],
      during: ['Stop after Page 3. Ask: why does the spray get less effective each time?'],
      after: ['Learners act the sieve with a net and beads of two sizes.'],
      discussion: ['Why is it unwise to stop taking medicine early?'],
      reflection: ['What health habit in your home could you improve this week?'],
      maths: [
        {
          task: 'A spray kills 99 of every 100 mosquitoes. If 5 000 mosquitoes are sprayed, how many survive?',
          answer: '5 000 ÷ 100 = 50 survive.',
        },
        {
          task: 'Those 50 survivors each leave 100 young. How many young are there, and why is this a problem for the next spray?',
          answer: '50 × 100 = 5 000 young, many of whom inherit the ability to survive the spray.',
        },
      ],
      support: ['Use two kinds of beads and a sieve to show how survivors get left behind.'],
      stretch: ['Find out how malaria spreads and which drugs and nets are recommended in Ghana today.'],
      localise: ['Ask a health worker how your community checks that bed nets are used and mended.'],
      factCheck: ['The 1977 drought on Daphne Major and the work of the Grants are well documented. The statement that mosquitoes in Ghana show resistance to bed-net insecticides should be checked with a current Ghana Health Service or research source. The health advice (use nets, finish medicine as advised, never share it) must be confirmed by a health worker. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 7
  mk({
    key: 'the-free-data-term',
    title: 'The Free Data Term',
    summary:
      'A kind donor gives every pupil in Abomosu a tablet with free data for a term. Everyone is thrilled, but Selina begins to notice what is quietly disappearing. A story about comfort, distraction, and choosing wisely.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'technology', 'wellbeing', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Light at first, then thoughtful and warm',
    palette: ['#7c3aed', '#16a34a'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Selina: a 13-year-old JHS 2 girl who loves her grandmother’s stories.',
      'Nana Esi: her grandmother, a gentle storyteller with a sharp mind.',
      'Fiifi: Selina’s friend, funny and always first to try anything new.',
      'Mr Quartey: the class teacher, thoughtful and open to ideas.',
      'Bright: a quiet boy who is good at drumming.',
    ],
    music: 'Cheerful electronic pop fading into a calm drum and flute (placeholder)',
    pages: [
      pg(
        '📱',
        'The news came on a Monday. A kind businessman who had grown up in Abomosu wanted to help his old school. Every pupil would receive a tablet, and the data would be free for a whole term. The pupils cheered until the roof rang. By the end of the week, every desk had a tablet on it. There were videos, games, music, and every kind of question answered in seconds. “This is the best term of my life,” said Fiifi, his eyes shining. Selina agreed. She had never owned anything so clever.',
        'Pupils receiving tablets in a classroom, cheering, with a donor smiling at the front.'
      ),
      pg(
        '🎮',
        'In the first weeks, nobody was ever bored. At break, the football pitch lay empty because everyone sat in the shade with a screen. The library shelves stayed untouched. On the way home, nobody chatted, for heads were bowed over screens. Evenings were quiet too. Nobody queued to fetch water together, and nobody sat to hear Nana Esi tell stories under the mango tree. Marks in class were slipping, but nobody minded. The next video was always one tap away, and each one was a little more exciting than the last.',
        'An empty football pitch with pupils sitting in shade, all looking at tablets, while a ball rests unused.'
      ),
      pg(
        '🌙',
        'One evening, Selina sat beside her grandmother, who was alone with her stories. “Nobody comes any more,” said Nana Esi, with a small smile. “It is all right, my child.” The next day Selina asked Fiifi how his favourite folk tale ended. He frowned. “I do not remember. I only hear it when I need to.” Then Selina noticed something else: when the data ran out for an hour, her friends grew restless and cross, as if something had been taken from them. She had felt it too. Five minutes of quiet felt strange, even a little frightening.',
        'A girl and her grandmother alone under a mango tree at dusk, a lamp between them.'
      ),
      pg(
        '🤔',
        'Selina went to Mr Quartey. “Sir, are we happier now?” she asked. He thought about it. “Why do you ask?” She told him what she had noticed. He listened and then said, “Would you like to test it?” They agreed on a Saturday morning, and the class decided to try. Tablets would be switched off from eight o’clock until noon. The first hour was awful. People grumbled and sighed and checked their empty hands. Then Bright began tapping a rhythm on a bucket. Someone joined in with a song. Within an hour, the whole class was playing, and nobody had mentioned the tablets.',
        'Pupils in a school yard clapping and drumming on a bucket while tablets lie in a basket.'
      ),
      pg(
        '🪁',
        'By noon, they had made two kites from sticks and old plastic, played ampe until their feet hurt, and begun planning a play. Some of the pupils had even gone to Nana Esi, and she had told a story with sixty ears around her. “I had forgotten how much I like being tired from doing things,” said Fiifi. The school did not throw the tablets away. They decided together that tablets were for homework and learning, and for fun in moderation, and that break time, evenings, and weekends would be for friends, games, family, and quiet. They also made a rule: no screens at meals.',
        'Children flying a homemade kite while an elderly woman tells a story to a circle of listeners.'
      ),
      pg(
        '💡',
        'Nana Esi had a saying of her own. “A river that never meets a stone never learns to sing.” Selina wrote it on the first page of her exercise book. Comfort and entertainment are good things. But if every moment is filled with ease and distraction, we may stop noticing what we are missing: time with people, the effort that builds strength, and the quiet in which we think. When something is always offered for free, it is wise to ask, “What am I giving up in exchange?” Then choose for yourself, with open eyes.',
        'A girl writing a saying in an exercise book beside a river with stones, her grandmother nearby.'
      ),
    ],
    activities: [
      {
        id: 'zw-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did the donor give the pupils?',
        options: [
          'New football boots',
          'A tablet with free data for a term',
          'A new school building',
        ],
        correctIndex: 1,
      },
      {
        id: 'zw-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What happened to break time and evenings after the tablets arrived?',
        options: [
          'They became busier and noisier',
          'The pitch and the storytelling tree emptied as everyone looked at screens',
          'Nothing changed',
        ],
        correctIndex: 1,
      },
      {
        id: 'zw-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did the school decide in the end?',
        options: [
          'To throw away all tablets',
          'Use tablets for learning and some fun, while keeping time for people and play',
          'To use tablets all day',
        ],
        correctIndex: 1,
      },
      {
        id: 'zw-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You notice you check your phone every few minutes and have stopped reading. Using the story, what is a sensible step?',
        options: [
          'Throw the phone away',
          'Set times and places for the phone and keep some time free for people and books',
          'Do nothing, since it is all fun',
        ],
        correctIndex: 1,
      },
      {
        id: 'zw-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Every pupil receives a tablet with free data',
          'The pitch and the storytelling tree empty',
          'Selina notices what has been lost',
          'The class tries a screen-free Saturday morning',
          'The school agrees on fair rules for tablets',
        ],
      },
      {
        id: 'zw-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'distraction',
        definition: 'Something that draws your attention away from what matters.',
        distractors: [
          'A school rule',
          'A large crowd',
        ],
      },
    ],
    glossary: [
      {
        word: 'businessman',
        definition: 'A man who earns his living in trade or business.',
        pages: [1],
      },
      {
        word: 'data',
        definition: 'The internet allowance on a phone or tablet.',
        pages: [1],
      },
      {
        word: 'restless',
        definition: 'Unable to stay still or calm.',
        pages: [3],
      },
      {
        word: 'moderation',
        definition: 'Using something in sensible amounts, not too much.',
        pages: [5],
      },
      {
        word: 'entertainment',
        definition: 'Things that amuse or interest people.',
        pages: [6],
      },
      {
        word: 'distraction',
        definition: 'Something that draws your attention away from what matters.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: When comfort and entertainment fill every moment, people may lose attention, effort, and one another; choose with open eyes. The idea is explored further in “Brave New World” by Aldous Huxley (1932). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'This is a fresh story set in Ghana. It does not retell the novel. It does not say technology is bad; the school keeps the tablets and sets sensible rules. Nana Esi’s saying about the river is invented for the story and is not a traditional proverb.',
    ],
    reviewQuestions: [
      'Check that the story balances the real benefits of tablets with its warning.',
      'Make sure the screen-free morning is presented as a class experiment, not a punishment.',
      'Confirm that Abomosu, a fictional name, is not mistaken for a real school or donor.',
    ],
    guide: {
      overview:
        'A story about a school that has free tablets and data and learns, with help from a thoughtful girl, to keep time for friends, play, and quiet.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain what changed after the tablets arrived.',
        'Describe what the class discovered on the screen-free morning.',
        'Write a fair personal plan for screen time.',
      ],
      subjects: [
        ['Computing (NaCCA CCP: responsible use of digital devices; codes to verify)', 'Healthy use of technology'],
        ['Social Studies (NaCCA CCP: responsible living and family life; codes to verify)', 'Making wise choices'],
      ],
      before: ['Ask: how many hours a day do you think you use a screen? What would you miss without it?'],
      during: ['Stop after Page 2. What is happening that nobody is mentioning?'],
      after: ['Learners draw a daily timetable showing screen time, study, play, family, chores, and rest.'],
      discussion: ['Why did the pupils not mind when their marks began to slip?'],
      reflection: ['What is one thing you do better when your phone is out of reach?'],
      maths: [
        {
          task: 'The pupils had a screen-free morning from 8:00 a.m. to noon. How many hours was that?',
          answer: '12 - 8 = 4 hours.',
        },
        {
          task: 'If a pupil spends 3 hours a day on a tablet outside school, how many hours is that in a week?',
          answer: '3 × 7 = 21 hours.',
        },
      ],
      support: ['Use a simple three-column list: Screen, People, Quiet.'],
      stretch: ['Ask three adults what they did for fun when they were your age.'],
      localise: ['Does your family or school have rules about phones? Are they fair?'],
      factCheck: ['The story is fiction, and Abomosu and the donor are fictional. Nana Esi’s saying is invented. The book’s title, author, and year are given from general knowledge, and no part of the novel is retold.'],
    },
  }),
];

export const BATCH_50_BIG_IDEAS: PilotStory[] = BATCH_50_STORIES;
