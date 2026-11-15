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

const tokensOf = (text: string) =>
  text.split(/\s+/).map((w) => w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''));

/** 1-based page numbers whose text contains the headword as a whole word. */
const glossaryPages = (word: string, pages: Page[]): number[] => {
  const w = word.toLowerCase();
  const found = pages.flatMap((p, i) => (tokensOf(p.text).includes(w) ? [i + 1] : []));
  if (!found.length) throw new Error(`Glossary word "${word}" does not appear on any page`);
  return found;
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
    ...(s.culturalTags ? { culturalTags: s.culturalTags } : {}),
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
        'Read as a storyteller by the fire, with a distinct, natural voice for each character.',
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
      ...(g.factCheck ? { factCheck: g.factCheck } : {}),
    },
  };
};

/**
 * Batch 45 (8 African folk tales retold as six-page stories with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to English Language (oral literature) and Social Studies (see the first cultural note and the teacher guide).
 * These are traditional tales retold in original words. Each has named characters, listed in `characters`.
 * Original text written for Ghanaian learners; folk tales exist in many versions; each factCheck note says where the tale is told.
 * To verify before seeding: classIds, readingLevel, themes, and ghanaianContext against ../classification.ts;
 * whether `maths` may be an empty array; and all NaCCA curriculum codes.
 */

export const BATCH_45_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'kwaku-ananse-and-the-pot-of-wisdom',
    title: 'Ananse and the Pot of Wisdom',
    summary:
      'Kwaku Ananse the spider gathers all the wisdom in the world into one pot and tries to hide it at the top of a tree. An Akan tale from Ghana about why no one person knows everything.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Playful, sly, and warm',
    palette: ['#b45309', '#166534'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kwaku Ananse: a thin, quick spider with bright, clever eyes, wearing a small strip of kente round his waist.',
      'Ntikuma: his young son, a small spider with a round, open face and a thoughtful look.',
      'Aso: his wife, a calm spider with a head-tie, seen at the doorway of their hut.',
    ],
    music: 'Light, teasing xylophone and hand drum (placeholder)',
    pages: [
      pg(
        '🕷️',
        'Long ago, when the world was new, Kwaku Ananse the spider had an idea. “People are always coming to me for advice,” he said. “Imagine if I owned all the wisdom in the world. Then everyone would have to come to me, and they would have to pay.” So Ananse took a large clay pot and set off. He went from village to village, from forest to river. Wherever he found a piece of wisdom, he dropped it into the pot. At last the pot was full, and Ananse was sure that there was no wisdom left anywhere but there.',
        'A thin spider in a strip of kente carrying a large clay pot along a forest path past a village.'
      ),
      pg(
        '🏺',
        'Ananse carried the pot home and shut the door. He did not tell his wife, Aso, what was in it. He did not tell his son, Ntikuma. But a new worry kept him awake. “What if somebody steals it?” he thought. “I must hide it where nobody can reach.” Behind the village stood a silk-cotton tree, the tallest tree in the forest, with a trunk as straight as a spear. “I will tie the pot to the very top,” said Ananse. “Then all the wisdom in the world will be mine alone, for ever.”',
        'A spider lying awake beside a clay pot inside a hut, with a very tall straight tree visible through the window.'
      ),
      pg(
        '🌳',
        'Before sunrise, Ananse crept out with the pot. He tied it round his neck with a rope so that it hung in front of his belly. Then he began to climb. But the pot was in the way. It bumped against the trunk and pushed him off. His eight legs could not reach round it. He climbed a little and slid down. He climbed again and slid down again. The sun rose higher. Ananse was sweating and muttering, and he had not climbed the height of a man. A bird in the branches laughed at him.',
        'A spider struggling to climb a huge tree trunk with a clay pot hanging in front of his belly.'
      ),
      pg(
        '👦',
        'Ananse did not know that he was being watched. Little Ntikuma had woken, missed his father, and followed him. For a long time the boy stood quietly at the foot of the tree. At last he could keep silent no longer. “Father,” he called, “why do you carry the pot in front of you? Tie it on your back. Then your legs will be free to hold the tree.” Ananse looked down. He was annoyed. But he was also tired, so he moved the pot round to his back. Up he went, as easily as walking.',
        'A small spider at the foot of a tall tree calling up to a larger spider who is looking down in surprise.'
      ),
      pg(
        '💥',
        'Halfway up, Ananse stopped. A thought had struck him like a stone. “I have all the wisdom in the world in this pot,” he said, “and yet my own small son had a piece of wisdom that I did not have. Then the pot is not full after all. And if a child can be wiser than I am, what use is the pot?” He was so angry and ashamed that he tore the pot from his back and flung it down. It struck a root and smashed into a hundred pieces.',
        'A clay pot shattering on the roots of a great tree while a spider clings to the trunk above.'
      ),
      pg(
        '🌬️',
        'Just then, a great wind blew through the forest. It caught up all the wisdom from the broken pot and carried it over the whole world. A little fell on every village and every house. Men, women, and children each picked up some. Nobody got all of it, and nobody was left with none. That is why, to this day, no one person knows everything, and why even a small child may know what an elder does not. The Akan say that one head does not hold a council. As for Ananse, he went home and listened to his son.',
        'A swirling wind carrying small sparkling lights across villages and forests towards the horizon.'
      ),
    ],
    activities: [
      {
        id: 'aw-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why did Ananse want to collect all the wisdom in the world?',
        options: [
          'To share it fairly with everyone',
          'So that everyone would have to come to him and pay',
          'To give it to his son',
        ],
        correctIndex: 1,
      },
      {
        id: 'aw-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why could Ananse not climb the tree at first?',
        options: [
          'The pot hung in front of him and got in the way',
          'The tree was covered in thorns',
          'He was afraid of heights',
        ],
        correctIndex: 0,
      },
      {
        id: 'aw-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why did Ananse throw the pot down?',
        options: [
          'It was too heavy to carry',
          'Ntikuma asked him to',
          'He realised his child had wisdom he lacked, so the pot could not hold it all',
        ],
        correctIndex: 2,
      },
      {
        id: 'aw-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: In a group project, the group leader refuses to listen to the youngest member’s idea. Using the tale, what would you tell the leader?',
        options: [
          'Leaders always know best',
          'Good ideas can come from anyone, so listen to everyone',
          'The youngest should keep quiet',
        ],
        correctIndex: 1,
      },
      {
        id: 'aw-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Ananse collects wisdom in a clay pot',
          'He decides to hide the pot at the top of the silk-cotton tree',
          'He fails to climb with the pot in front of him',
          'Ntikuma tells him to tie the pot on his back',
          'Ananse throws the pot down and the wind scatters the wisdom',
        ],
      },
      {
        id: 'aw-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'council',
        definition: 'A meeting of people who come together to discuss and decide.',
        distractors: [
          'A pot for storing water',
          'A rope for climbing trees',
        ],
      },
    ],
    glossary: [
      {
        word: 'wisdom',
        definition: 'Good sense and understanding that come from knowledge and experience.',
        pages: [1, 2, 5, 6],
      },
      {
        word: 'advice',
        definition: 'An opinion about what someone should do.',
        pages: [1],
      },
      {
        word: 'silk-cotton',
        definition: 'Silk-cotton tree: a very tall forest tree with a straight trunk.',
        pages: [2],
      },
      {
        word: 'muttering',
        definition: 'Speaking in a low, complaining voice.',
        pages: [3],
      },
      {
        word: 'ashamed',
        definition: 'Feeling bad because of something one has done.',
        pages: [5],
      },
      {
        word: 'council',
        definition: 'A meeting of people who come together to discuss and decide.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: an Akan tale from Ghana, one of the best-known Ananse stories (Anansesem). Versions are also told in the Caribbean, carried there by enslaved Africans.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'The closing proverb is Akan: one head does not go into council (wisdom is shared).',
    ],
    reviewQuestions: [
      'Ask a Twi-speaking reviewer to confirm the names Ntikuma and Aso and the wording of the proverb.',
      'Is Ananse shown as clever and foolish at once, as in the tradition?',
    ],
    guide: {
      overview:
        'A classic Ananse tale that explains why wisdom is shared among all people, and teaches humility and listening.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in the right order.',
        'Explain why Ananse’s plan failed.',
        'State the lesson of the tale in one sentence.',
        'Connect the lesson to working with others.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Listening to and retelling a folk tale'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Folk tales as part of national culture'],
      ],
      before: ['Ask: is there anyone who knows everything? Who is the wisest person you know?'],
      during: ['Stop after Page 3. Ask learners how they would solve Ananse’s problem.'],
      after: ['Learners retell the story in a circle, each adding one sentence.'],
      discussion: ['Was Ananse wise, foolish, or both? Find a line in the story to support your answer.'],
      reflection: ['When did someone younger than you teach you something?'],
      maths: [
      ],
      support: ['Act out the climb with a bag held in front and then on the back.'],
      stretch: ['Write a new Ananse story in which he tries to keep something else for himself.'],
      localise: ['Ask an elder to tell an Ananse story in your own language and write down its lesson.'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'An Akan tale from Ghana. Many versions exist; in some, the sky god Nyame gives Ananse the pot. No dates or facts need checking, but confirm names and the proverb with a Twi speaker. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 2
  mk({
    key: 'how-tortoise-cracked-his-shell',
    title: 'How Tortoise Cracked His Shell',
    summary:
      'In a time of hunger, greedy Tortoise tricks the birds at a feast in the sky and pays for it on the way down. A tale told in Nigeria about greed and its price.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Lively and humorous, then sharp',
    palette: ['#65a30d', '#0369a1'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Tortoise: a smooth-shelled tortoise with small, cunning eyes and a sweet, persuasive voice.',
      'Parrot: a grey parrot with a red tail, sharp-witted and slow to forgive.',
      'The birds: a flock of many kinds, including a hornbill, a weaver, and a dove.',
      'The sky people: tall hosts in flowing robes who welcome guests to their feast.',
    ],
    music: 'Bouncy drum pattern with a flute like birdsong (placeholder)',
    pages: [
      pg(
        '🍂',
        'Once there was a famine. The rains had failed, the yams were small, and every creature was thin. Tortoise was the thinnest of all. In those days his shell was as smooth as a calabash. One morning he noticed that the birds were unusually cheerful. He listened, and he heard the reason. The people of the sky had invited all the birds to a great feast. Tortoise’s mouth watered. “My dear friends,” he said in his sweetest voice, “take me with you. I have changed. I am no longer the greedy fellow you remember.”',
        'A thin tortoise with a smooth shell listening to a group of cheerful birds perched on a dry branch.'
      ),
      pg(
        '🪶',
        'The birds knew Tortoise well. But he could talk the bark off a tree, and in the end they agreed. Each bird pulled out one feather and gave it to him. Tortoise stuck them along his arms and made two fine wings. As they flew up, he said, “There is a custom you may not know. At a great feast, each guest takes a new name. What will yours be?” The birds had never heard of this, but they chose names. “And yours?” asked Parrot. Tortoise smiled. “My name is All of You.”',
        'A tortoise with wings made of many different feathers flying upwards among a flock of birds.'
      ),
      pg(
        '🍲',
        'The sky people welcomed their guests and set out the food. There was pounded yam, soup with meat and fish, yam pottage, and pots of palm wine. Tortoise stepped forward. “For whom have you prepared this feast?” he asked politely. “For all of you,” said the sky people. Tortoise turned to the birds. “You heard them. It is for All of You, and that is my name. The custom is that I eat first. You may have what is left.” The birds stared. Tortoise began to eat. He did not look up once.',
        'Tall hosts in robes setting out many bowls of food on mats, as a tortoise steps forward ahead of the birds.'
      ),
      pg(
        '😠',
        'He ate the best of the meat and most of the yam. He drank two pots of palm wine. When at last he sat back, round as a drum, only bones and scraps remained. The birds pecked at them in silence. They were too angry to speak. Nobody thanked the hosts more loudly than Tortoise. Then, one by one, each bird went up to Tortoise and took back its feather. Soon he stood there with no wings at all, full of food and very far from home. The birds rose into the air to leave.',
        'A very fat tortoise sitting among empty bowls while birds pluck feathers from his arms.'
      ),
      pg(
        '🦜',
        '“Wait!” cried Tortoise. “Take a message to my wife. Tell her to bring out all the soft things in the house, the mats and the cloths and the cushions, and pile them in the yard, so that I can jump down safely.” The birds flew on. Only Parrot turned back. “I will tell her,” he said. He flew to Tortoise’s house and said to his wife, “Your husband says: bring out all the hard things in the house. The hoes, the cutlasses, the grinding stone, and the iron pot. Pile them in the yard.”',
        'A grey parrot with a red tail speaking to a tortoise wife at the door of a small house.'
      ),
      pg(
        '💔',
        'From the sky, Tortoise saw his wife carrying things into the yard. He was too high up to see what they were. He took a breath and jumped. Down he fell, and landed with a crash on the hoes and stones. His smooth shell broke into many pieces. A healer in the village collected the pieces and stuck them together, but the lines never went away. Look at any tortoise today and you will see them. The elders say: the one who eats alone will find himself alone when trouble comes.',
        'A tortoise with a newly patterned, cracked shell being mended by an old healer in a village yard.'
      ),
    ],
    activities: [
      {
        id: 'tb-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What new name did Tortoise choose for himself?',
        options: [
          'King of the Sky',
          'All of You',
          'Friend of Birds',
        ],
        correctIndex: 1,
      },
      {
        id: 'tb-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'How did Tortoise use his new name?',
        options: [
          'When the hosts said the food was “for all of you”, he claimed it was all for him',
          'He used it to hide from the sky people',
          'He used it to frighten the birds',
        ],
        correctIndex: 0,
      },
      {
        id: 'tb-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What message did Parrot give to Tortoise’s wife?',
        options: [
          'Bring out all the soft things',
          'Come up to the sky',
          'Bring out all the hard things',
        ],
        correctIndex: 2,
      },
      {
        id: 'tb-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A classmate takes all the credit and the reward for work that the whole group did. According to the tale, what is likely to happen later?',
        options: [
          'The group will trust him more',
          'The others will not help him when he needs them',
          'Nothing will change',
        ],
        correctIndex: 1,
      },
      {
        id: 'tb-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The birds give Tortoise feathers to make wings',
          'Tortoise takes the name All of You',
          'Tortoise eats the best of the feast',
          'The birds take back their feathers',
          'Tortoise jumps and breaks his shell',
        ],
      },
      {
        id: 'tb-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'famine',
        definition: 'A time when there is very little food and many go hungry.',
        distractors: [
          'A feast held in the sky',
          'A wing made of feathers',
        ],
      },
    ],
    glossary: [
      {
        word: 'famine',
        definition: 'A time when there is very little food and many go hungry.',
        pages: [1],
      },
      {
        word: 'feast',
        definition: 'A large, special meal for many people.',
        pages: [1, 2, 3],
      },
      {
        word: 'custom',
        definition: 'The accepted way of doing things in a community.',
        pages: [2, 3],
      },
      {
        word: 'scraps',
        definition: 'Small pieces of food left over.',
        pages: [4],
      },
      {
        word: 'healer',
        definition: 'A person who treats the sick or injured.',
        pages: [6],
      },
      {
        word: 'greedy',
        definition: 'Wanting more than one’s fair share.',
        pages: [1],
      },
    ],
    culturalNotes: [
      'Where it is told: a well-known tale in Nigeria, especially among the Igbo, with similar tortoise stories among the Yoruba and other West African peoples.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Tortoise is the trickster of many Nigerian tales, as Ananse is in Ghana. Learners may compare the two.',
    ],
    reviewQuestions: [
      'Check that the humour does not hide the lesson about greed.',
      'Is the fall described without frightening detail?',
    ],
    guide: {
      overview:
        'A trickster tale explaining the pattern on a tortoise’s shell and warning against greed and broken trust.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain the trick behind the name “All of You”.',
        'Explain why Parrot changed the message.',
        'State what the tale teaches about greed and trust.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a trickster tale; play on words'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Folk tales of our West African neighbours'],
      ],
      before: ['Look at a picture of a tortoise shell. Ask: how do you think it got those lines?'],
      during: ['Stop after Page 2. Ask learners to predict how Tortoise will use his new name.'],
      after: ['In pairs, act out the scene at the feast.'],
      discussion: ['Was Parrot right to change the message? Is it ever right to punish a trick with a trick?'],
      reflection: ['Have you ever kept something for yourself that was meant to be shared? What happened?'],
      maths: [
      ],
      support: ['Use name cards: when the teacher says “all of you”, the learner with that card stands up.'],
      stretch: ['Write the story again from Parrot’s point of view.'],
      localise: ['Which animal is the trickster in the tales of your own people? Tell one such tale.'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'A traditional Nigerian tale told in many versions. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 3
  mk({
    key: 'the-lions-whisker',
    title: 'The Lion’s Whisker',
    summary:
      'A stepmother longs for her stepson’s love and is told to fetch a whisker from a living lion. A tale from Ethiopia about patience and trust.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Gentle, patient, and tender',
    palette: ['#a16207', '#7c2d12'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Almaz: a kind young woman in a white cotton dress and shawl, newly married, with an anxious, hopeful face.',
      'Dawit: her stepson, a boy of about seven with sad eyes, who keeps his distance.',
      'The old healer: a white-bearded man with a staff, seated outside a round stone hut.',
      'The lion: a large, black-maned lion living by a river in the hills.',
    ],
    music: 'Soft, slow masenqo-style string with a quiet drum (placeholder)',
    pages: [
      pg(
        '🏔️',
        'In the high hills of Ethiopia, there lived a woman named Almaz. She married a man whose first wife had died and who had a small son called Dawit. Almaz had always wanted a child, and she was ready to love the boy with her whole heart. She cooked his favourite food. She sewed him a new shirt. She tried to hold his hand. But Dawit would not eat, would not wear the shirt, and pulled his hand away. “You are not my mother,” he said, and ran out to sit alone among the goats.',
        'A woman in a white dress holding out a bowl of food to a small boy who is turning away, on a hillside with goats.'
      ),
      pg(
        '🧙',
        'Weeks passed, and nothing changed. Almaz wept at night. At last she walked over the hill to the hut of an old healer who was known for his wisdom. “Please,” she said, “make me a medicine that will make my stepson love me.” The old man was silent for a while. “I can make it,” he said. “But I need one thing: a whisker from the chin of a living lion. Bring me that, and you shall have what you ask.” Almaz stared at him. “A lion will kill me!” The healer shrugged. “That is what the medicine needs.”',
        'A woman kneeling before a white-bearded old man seated outside a round stone hut.'
      ),
      pg(
        '🦁',
        'Almaz knew of a lion that came each evening to drink at the river. The next day, she took a piece of meat and went there. When the lion appeared, she was so afraid that her legs shook. She put the meat on the ground a long way off and ran. The next evening she came again and put the meat a little nearer. The lion looked at her, ate, and went away. Day after day she came. Each time she stood a few steps closer, and each time she stayed a little longer.',
        'A woman placing a piece of meat on the ground far from a large lion drinking at a river at dusk.'
      ),
      pg(
        '🌅',
        'Months went by. The rains came and passed. Now the lion waited for Almaz each evening and watched for her on the path. She no longer ran. She sat on a rock while he ate, and she spoke to him softly. One evening he lay down near her feet and purred like a great cat. Very slowly, Almaz put out her hand and touched his mane. He did not move. With her heart beating hard, she took hold of one long whisker on his chin and gently pulled it out. The lion only blinked.',
        'A woman sitting calmly on a rock beside a resting lion, reaching towards his chin.'
      ),
      pg(
        '🔥',
        'Almaz ran all the way to the healer’s hut. “I have it!” she cried, holding out the whisker. The old man took it, looked at it closely, and smiled. Then he dropped it into the fire. Almaz cried out. “What have you done? I risked my life for that!” “Tell me,” said the healer, “how did you get it?” She told him: how she had gone every day, how she had kept her distance, how she had waited and never hurried, until the lion trusted her. The old man nodded at every word.',
        'An old man dropping a single whisker into a small fire while a woman reaches out in dismay.'
      ),
      pg(
        '💛',
        '“Then you need no medicine,” said the old man. “Is a boy who has lost his mother more dangerous than a lion? Go to him as you went to the lion. Be near him every day. Ask for nothing. Do not hurry. Let him come to you.” Almaz went home and did as he said. She was there each day, kind and patient, and she did not press the boy. Slowly, Dawit began to sit beside her. One evening he took her hand of his own accord. And after that, he called her Mother.',
        'A woman and a small boy sitting side by side at a doorway at evening, the boy’s hand in hers.'
      ),
    ],
    activities: [
      {
        id: 'lw-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why was Almaz unhappy?',
        options: [
          'Her husband had left her',
          'Her stepson would not accept her love',
          'She had lost her goats',
        ],
        correctIndex: 1,
      },
      {
        id: 'lw-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'How did Almaz get close to the lion?',
        options: [
          'She came every day, a little nearer each time, and never hurried',
          'She trapped him in a net',
          'She gave him medicine to make him sleep',
        ],
        correctIndex: 0,
      },
      {
        id: 'lw-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why did the healer throw the whisker into the fire?',
        options: [
          'He was angry with Almaz',
          'The whisker was the wrong kind',
          'The medicine was never needed; the lesson was in how she won the lion’s trust',
        ],
        correctIndex: 2,
      },
      {
        id: 'lw-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A new pupil joins your class and will not speak to anyone. Using the tale, what is the best thing to do?',
        options: [
          'Demand that she join your game at once',
          'Be friendly each day without pressing her, and give her time',
          'Ignore her completely',
        ],
        correctIndex: 1,
      },
      {
        id: 'lw-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Dawit pushes Almaz away',
          'The healer asks for a whisker from a living lion',
          'Almaz feeds the lion day after day',
          'She gently pulls out a whisker',
          'She wins Dawit’s trust in the same patient way',
        ],
      },
      {
        id: 'lw-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'patient',
        definition: 'Able to wait calmly without becoming angry or giving up.',
        distractors: [
          'Quick to take what one wants',
          'Afraid of wild animals',
        ],
      },
    ],
    glossary: [
      {
        word: 'stepson',
        definition: 'The son of one’s husband or wife from an earlier marriage.',
        pages: [2],
      },
      {
        word: 'healer',
        definition: 'A person who treats the sick and gives advice.',
        pages: [2, 5],
      },
      {
        word: 'whisker',
        definition: 'One of the long, stiff hairs on an animal’s face.',
        pages: [2, 4, 5],
      },
      {
        word: 'mane',
        definition: 'The long hair round a lion’s head and neck.',
        pages: [4],
      },
      {
        word: 'trusted',
        definition: 'Believed that someone would do no harm.',
        pages: [5],
      },
      {
        word: 'patient',
        definition: 'Able to wait calmly without becoming angry or giving up.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale from Ethiopia, told among the Amhara people and others in the highlands. In some versions it is a wife and her husband; in others, a stepmother and child.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Safety: this is a story. Wild animals are dangerous, and no one should approach them.',
    ],
    reviewQuestions: [
      'Keep the safety note with the story.',
      'Check that the stepmother and the boy are both treated with sympathy.',
    ],
    guide: {
      overview:
        'A gentle tale in which a seemingly impossible task teaches that love and trust are won by patience.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain why the healer set the task.',
        'State the lesson in one sentence.',
        'Apply the lesson to a friendship or family situation.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading for theme and character'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Family life; building peaceful relationships'],
      ],
      before: ['Ask: can you make someone like you? How?'],
      during: ['Stop after Page 2. Ask: why might the healer ask for something so dangerous?'],
      after: ['Learners write five lines beginning “Trust grows when…”.'],
      discussion: ['Was the healer wise or unkind to send Almaz to the lion? Give reasons.'],
      reflection: ['Who was patient with you when you were difficult? How did it change you?'],
      maths: [
      ],
      support: ['Mark six steps on the floor; a learner takes one step closer on each “day” of the story.'],
      stretch: ['Write Dawit’s diary for three days: one early, one in the middle, one at the end.'],
      localise: ['Ask at home for a proverb in your language about patience, and explain it to the class.'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'A traditional Ethiopian tale told in several versions. The names Almaz and Dawit were chosen for this retelling. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 4
  mk({
    key: 'why-the-cheetah-has-tear-marks',
    title: 'Why the Cheetah Has Tear Marks',
    summary:
      'A lazy hunter steals a cheetah’s cubs so that they will hunt for him. A tale from the Zulu people of South Africa about honest effort and the dark lines on a cheetah’s face.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Calm, sad, then firm',
    palette: ['#ca8a04', '#44403c'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'The mother cheetah: a slender, spotted cheetah with a small head and long legs.',
      'The lazy hunter: a strong young man with a spear he seldom uses, often lying in the shade.',
      'The old man: a white-haired elder with a walking stick, respected in the village.',
      'The cubs: three small, fluffy cheetah cubs with grey backs.',
    ],
    music: 'Slow, open savanna melody with a soft rattle (placeholder)',
    pages: [
      pg(
        '☀️',
        'One hot day, a hunter sat under a tree at the edge of the plain. He was a strong young man, but he was lazy. He did not like tracking animals through thorns or crouching for hours in the long grass. Below him, a herd of springbok was grazing. “Too far,” he said, and yawned. Then something moved in the grass. It was a mother cheetah, flat to the ground and creeping forward. The hunter sat up to watch. She chose one springbok at the edge of the herd and waited, perfectly still.',
        'A young man lounging under a tree with a spear beside him, watching a cheetah creeping through tall grass towards antelope.'
      ),
      pg(
        '💨',
        'Suddenly she was running. The hunter had never seen anything so fast. In a few heartbeats she had caught the springbok and brought it down. She dragged it into the shade of some bushes. There, three small cubs tumbled out to meet her. The hunter watched them eat, and an idea came to him. “If I had a cheetah that hunted for me,” he thought, “I would never need to hunt again. A grown one cannot be tamed. But a cub can be taught. I will take those cubs and train them.”',
        'A cheetah at full speed with dust rising behind her, and three cubs waiting under a bush.'
      ),
      pg(
        '🌙',
        'He waited until evening, when the mother cheetah went down to the water hole to drink. Then he crept to the bushes. The cubs were too young to run or to fight. He could not decide which one to take, so he picked up all three and carried them back to his hut. When the mother returned, the place was empty. She searched under every bush. She called and called. No answer came. All that night and all the next day she cried, until her tears had worn dark lines down her face.',
        'A mother cheetah standing by empty bushes at dusk with her head raised, calling.'
      ),
      pg(
        '👴',
        'An old man from the village was walking home when he heard the sound. He knew the ways of animals, and he knew that this was grief. He found the cheetah and understood what had happened. The old man was angry. Among his people, a hunter was expected to win his food by his own strength and skill. Taking helpless young from their mother to do his work for him was a shameful thing. He went straight to the village and told the elders what the lazy hunter had done.',
        'A white-haired old man with a stick standing at a respectful distance from a grieving cheetah on the plain.'
      ),
      pg(
        '⚖️',
        'The elders called the hunter before them. He could not deny it, for the cubs were in his hut. “You have broken the custom of the hunters,” they said. “You wanted the reward without the work, and you caused great pain to get it.” They drove him out of the village and told him never to return. The old man carried the three cubs back across the plain. When the mother cheetah saw them, she ran to them and licked them all over. Then she led them away into the grass.',
        'Village elders seated in a row facing a young man who hangs his head, with three cheetah cubs in a basket nearby.'
      ),
      pg(
        '🐆',
        'But the long crying had left its mark. The dark lines that the tears had made on her face never faded. Her cubs had them too, and so did their cubs after them. Every cheetah carries them still: two black lines running from the corner of each eye down to the mouth. The Zulu people say that the marks are there to remind hunters of an old rule. Feed yourself by your own effort. And never build your comfort on the suffering of another. Whoever sees a cheetah’s face should remember a mother’s tears.',
        'A close view of a cheetah’s face showing the two dark lines running from her eyes to her mouth.'
      ),
    ],
    activities: [
      {
        id: 'ch-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What kind of person was the hunter?',
        options: [
          'Strong but lazy',
          'Weak but hard-working',
          'Old and wise',
        ],
        correctIndex: 0,
      },
      {
        id: 'ch-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why did the hunter decide to take the cubs?',
        options: [
          'He wanted to protect them',
          'He wanted to sell their skins',
          'He wanted to train them to hunt for him',
        ],
        correctIndex: 2,
      },
      {
        id: 'ch-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why was the old man angry?',
        options: [
          'The cheetah had killed a goat',
          'The hunter had taken helpless young to avoid doing his own work',
          'The hunter had refused to share his meat',
        ],
        correctIndex: 1,
      },
      {
        id: 'ch-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A pupil copies a friend’s homework every day and gets good marks. Which rule from the tale has been broken?',
        options: [
          'Never go out at night',
          'Feed yourself by your own effort',
          'Always obey the elders',
        ],
        correctIndex: 1,
      },
      {
        id: 'ch-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The hunter watches the cheetah catch a springbok',
          'He steals the three cubs',
          'The mother cries until tears mark her face',
          'The old man tells the elders',
          'The cubs are returned and the hunter is driven out',
        ],
      },
      {
        id: 'ch-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'grief',
        definition: 'Deep sadness, especially after a loss.',
        distractors: [
          'Great speed when running',
          'A plan to trick someone',
        ],
      },
    ],
    glossary: [
      {
        word: 'tracking',
        definition: 'Following the marks left by an animal.',
        pages: [1],
      },
      {
        word: 'springbok',
        definition: 'A small, fast antelope of southern Africa.',
        pages: [1, 2],
      },
      {
        word: 'tamed',
        definition: 'Made gentle and used to living with people.',
        pages: [2],
      },
      {
        word: 'grief',
        definition: 'Deep sadness, especially after a loss.',
        pages: [4],
      },
      {
        word: 'shameful',
        definition: 'Deserving blame; bringing dishonour.',
        pages: [4],
      },
      {
        word: 'custom',
        definition: 'The accepted way of doing things in a community.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale of the Zulu people of South Africa. Similar stories about the cheetah’s “tear marks” are told elsewhere in southern and eastern Africa.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Science link: the dark lines on a cheetah’s face are real. Scientists think they may reduce the glare of the sun. Wildlife note: taking wild animals from their mothers is illegal in most countries.',
    ],
    reviewQuestions: [
      'Check that the mother’s grief is told with feeling but without distressing detail.',
      'Keep the wildlife note for teachers.',
    ],
    guide: {
      overview:
        'A “why” tale from southern Africa that explains the cheetah’s facial marks and teaches honest effort and compassion for animals.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain what the hunter did wrong and why it was against custom.',
        'State the two rules given at the end.',
        'Apply the idea of honest effort to school life.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading an explanatory (“why”) tale'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Values: hard work and respect for nature'],
      ],
      before: ['Show a picture of a cheetah’s face. Ask: what do the black lines look like?'],
      during: ['Stop after Page 3. Ask: how do you think the story should end to be fair?'],
      after: ['Learners invent and tell a “why” tale about a local animal.'],
      discussion: ['Was driving the hunter out a fair punishment? What else could the elders have done?'],
      reflection: ['Is there anything you get without effort that someone else has paid for?'],
      maths: [
      ],
      support: ['Let learners draw the tear marks on a cheetah outline while listening.'],
      stretch: ['Find out three facts about cheetahs, including how fast they run and where they live.'],
      localise: ['What is the custom in your community about hunting or fishing fairly?'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'A traditional Zulu tale told in several versions. The scientific explanation of the marks in the teacher’s note is a common suggestion, not a settled fact. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 5
  mk({
    key: 'hare-and-the-great-tug-of-war',
    title: 'Hare and the Great Tug-of-War',
    summary:
      'Tired of being pushed about, little Hare challenges both Elephant and Hippopotamus to a tug-of-war. A tale told in many parts of Africa about brains and strength.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Quick, cheeky, and full of fun',
    palette: ['#15803d', '#1e40af'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Hare: a small brown hare with long ears and a bold, quick manner.',
      'Elephant: a huge grey elephant with great tusks, proud of his strength.',
      'Hippopotamus: a vast, round hippo who rules the river and dislikes being disturbed.',
    ],
    music: 'Fast, playful drums with a comic low horn (placeholder)',
    pages: [
      pg(
        '🐇',
        'Hare was small, and he was tired of it. Every morning, on his way to the river, Elephant came crashing through the forest. “Out of my way, little one!” he would rumble, and Hare had to jump into the bushes. Every evening, when Hare went down to drink, Hippopotamus rose out of the water. “This is my river,” she would snort. “Drink somewhere else.” One night, Hare sat in his burrow, thinking. “They are big,” he said to himself. “But being big is not the same as being clever.” By morning, he had a plan.',
        'A small hare leaping aside as a huge elephant strides along a forest path.'
      ),
      pg(
        '🐘',
        'First he found a very long, very strong rope made of forest vines. Then he went to Elephant. “Good morning, Uncle,” he said. “I have come to tell you that I am tired of jumping out of your way. I am as strong as you are.” Elephant laughed so hard that leaves fell from the trees. “Then prove it,” said Hare. “Hold this end of my rope. I shall go down the hill and take the other end. When you feel a tug, pull. If I pull you over, you must treat me with respect.”',
        'A hare holding out the end of a thick vine rope to a laughing elephant.'
      ),
      pg(
        '🦛',
        'Hare ran down the hill with the other end, through the thick bush, to the river bank. “Good morning, Auntie,” he called to Hippopotamus. “I am tired of being chased from the water. I am as strong as you are.” She yawned, showing her great teeth. “Then prove it,” said Hare. “Hold this rope. I shall go up into the bush and pull. When you feel a tug, pull back. If I drag you out of the river, you must let me drink in peace.” Hippopotamus took the rope in her mouth.',
        'A hare on a river bank offering the other end of the rope to a hippopotamus in the water.'
      ),
      pg(
        '🪢',
        'Hare ran to the middle, where neither of them could see him. He took hold of the rope and gave it a sharp tug. At once, Elephant pulled from the top of the hill and Hippopotamus pulled from the river. The rope went as tight as a drum skin. “What strength that little fellow has!” grunted Elephant, digging in his feet. “What strength that little fellow has!” groaned Hippopotamus, sinking into the mud. They pulled all morning. They pulled all through the heat of the afternoon. Neither could move the other by so much as a step.',
        'A long rope stretched tight through thick bush, with an elephant pulling at one end on a hill and a hippo at the other in a river, and a hare hiding in the middle.'
      ),
      pg(
        '😮💨',
        'Hare lay in the shade, eating wild berries. When the sun was low and both giants were trembling with tiredness, he took a sharp stone and cut the rope. Elephant fell over backwards and rolled halfway down the hill. Hippopotamus fell backwards into the river with a splash that soaked the trees. Hare ran up the hill. “Well, Uncle?” he asked. Elephant got up slowly. “I did not know you were so strong,” he said. “I will not push you off the path again.” Then Hare ran down to the river.',
        'An elephant tumbling backwards on a hillside and a hippo splashing into a river, with a cut rope between them.'
      ),
      pg(
        '🌟',
        '“Well, Auntie?” asked Hare. Hippopotamus blew water from her nose. “I did not know you were so strong,” she said. “You may drink whenever you like.” From that day, Hare walked the forest path and drank at the river without fear. Elephant and Hippopotamus never found out what had happened, and Hare never told them. The old people say: do not look down on someone because he is small, for a wise head is worth more than a strong arm. But they also say that Hare was lucky they did not compare notes.',
        'A hare drinking peacefully at a river at sunset, with an elephant and a hippo watching respectfully from a distance.'
      ),
    ],
    activities: [
      {
        id: 'tg-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What was Hare’s problem at the start of the story?',
        options: [
          'He had lost his burrow',
          'The two big animals pushed him about because he was small',
          'He could not find food',
        ],
        correctIndex: 1,
      },
      {
        id: 'tg-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'Who was really pulling against Elephant?',
        options: [
          'Hippopotamus',
          'Hare',
          'Nobody',
        ],
        correctIndex: 0,
      },
      {
        id: 'tg-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did Hare end the contest?',
        options: [
          'He pulled harder than both',
          'He asked them to stop',
          'He cut the rope when both were exhausted',
        ],
        correctIndex: 2,
      },
      {
        id: 'tg-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A small school is to play a much bigger school at football. Using the tale, what should its players rely on?',
        options: [
          'Size and strength',
          'Clever planning, teamwork, and skill',
          'Hoping the other team does not come',
        ],
        correctIndex: 1,
      },
      {
        id: 'tg-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Hare is pushed about by Elephant and Hippopotamus',
          'He gives one end of a rope to Elephant',
          'He gives the other end to Hippopotamus',
          'The two giants pull against each other all day',
          'Hare cuts the rope and both agree to respect him',
        ],
      },
      {
        id: 'tg-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'respect',
        definition: 'Treating someone as important and deserving of good treatment.',
        distractors: [
          'A long rope made of vines',
          'A loud laugh',
        ],
      },
    ],
    glossary: [
      {
        word: 'burrow',
        definition: 'A hole in the ground where an animal lives.',
        pages: [1],
      },
      {
        word: 'vines',
        definition: 'Long, climbing plants with tough stems.',
        pages: [2],
      },
      {
        word: 'respect',
        definition: 'Treating someone as important and deserving of good treatment.',
        pages: [2],
      },
      {
        word: 'tug',
        definition: 'A sudden, hard pull.',
        pages: [2, 3, 4],
      },
      {
        word: 'trembling',
        definition: 'Shaking, from tiredness or fear.',
        pages: [5],
      },
      {
        word: 'giants',
        definition: 'Very large and powerful creatures.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Where it is told: this tale is found in many parts of Africa, from Cameroon and the Congo to East and southern Africa. In some places the trickster is Hare, in others Tortoise.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Hare is the trickster of much of eastern, central, and southern Africa. Enslaved Africans carried his stories to the Americas.',
    ],
    reviewQuestions: [
      'Check that Hare’s trick is shown as clever but also as a deception worth discussing.',
      'Is the humour clear when read aloud?',
    ],
    guide: {
      overview:
        'A widely told trickster tale in which a small animal wins respect from two giants by using his wits.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain how the trick worked.',
        'State the proverb at the end in your own words.',
        'Discuss whether winning by a trick is fair.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a trickster tale; humour and dialogue'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Folk tales shared across African peoples'],
      ],
      before: ['Ask: who would win a tug-of-war, an elephant or a hare? Could the hare ever win?'],
      during: ['Stop after Page 3. Ask learners to work out Hare’s plan.'],
      after: ['Hold a real tug-of-war with a hidden “Hare” in the middle, then talk about it.'],
      discussion: ['Hare gained respect by deceiving the others. Was that fair? What might happen if they found out?'],
      reflection: ['When have you solved a problem by thinking and not by force?'],
      maths: [
      ],
      support: ['Draw the hill, the bush, and the river on the board and move three markers as the story is read.'],
      stretch: ['Write a sequel: Elephant and Hippopotamus meet and compare notes.'],
      localise: ['Tell a tale from your own area in which a small creature beats a big one.'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'A traditional tale told across much of Africa in many versions. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 6
  mk({
    key: 'the-cow-tail-switch',
    title: 'The Cow-Tail Switch',
    summary:
      'A hunter fails to come home, and his sons do not ask about him until the youngest speaks. A tale from Liberia about what it means to remember.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Quiet, wondering, and thoughtful',
    palette: ['#7c2d12', '#166534'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Flomo: a strong hunter of the forest, with a spear and a leather bag, father of many sons.',
      'The older sons: six young men, each with a special skill.',
      'Saye: the youngest son, a small boy born after his father went away.',
      'The mother: a hard-working woman who keeps the family together.',
    ],
    music: 'Slow forest drums with a soft thumb-piano (placeholder)',
    pages: [
      pg(
        '🌴',
        'At the edge of the great forest, near a river, stood a village of rice farmers. In it lived a hunter named Flomo, with his wife and his sons. One morning, Flomo took his spear and went into the forest to hunt. Evening came, and he did not return. The next day came and went, and the next. At first the family watched the path. Then weeks passed, and months. The sons worked on the farm, and life went on. After a time, nobody spoke of Flomo any more. It was as if he had never lived.',
        'A hunter with a spear walking into tall forest, watched from a village doorway by his wife and sons.'
      ),
      pg(
        '👶',
        'Some months after Flomo left, his wife gave birth to another son. They named him Saye. He grew, and he learned to crawl, and to walk, and then to talk. One evening, as the family sat eating rice, the child looked round at his brothers and at his mother. Then he said his first full sentence. “Where is my father?” Everyone stopped eating. The brothers looked at one another. “Yes,” said the eldest slowly. “Where is our father? He went to hunt, and he never came back. We should go and look for him.”',
        'A small child seated among his older brothers at an evening meal, looking up and asking a question.'
      ),
      pg(
        '🦴',
        'The next morning, the sons set off. The forest was thick, but the first son had the gift of finding a trail, however old. He led them for many days, until they came to a clearing. There on the ground lay their father’s spear, and beside it a scatter of bones. A leopard had killed him long ago. Grass had grown through the shaft of the spear. The brothers stood in silence. Then the second son said, “I know how to put bones together.” He knelt and laid every bone in its right place.',
        'Young men standing in a forest clearing looking down at a rusted spear lying in the grass.'
      ),
      pg(
        '✨',
        '“I know how to cover bones with muscle and skin,” said the third son, and he did so. “I know how to put blood into the body,” said the fourth, and he did so. “I can give it breath,” said the fifth, and the chest began to rise and fall. “I can give it the power to move and speak,” said the sixth. Flomo opened his eyes. He sat up and looked at his sons. “Where is my spear?” he asked. They gave it to him, and together they walked home to the village.',
        'Six young men kneeling in a circle in a clearing as their father sits up and opens his eyes.'
      ),
      pg(
        '🎉',
        'There was great joy. Flomo rested for some days. Then he killed a cow for a feast and invited the whole village. From the cow’s tail he made a switch, a kind of fly-whisk, and decorated it with beads and cowrie shells. It was the most beautiful that anyone had seen. At the feast he stood up. “I shall give this switch to the son who did the most to bring me home,” he said. At once the brothers began to argue. “I found the trail!” “I joined the bones!” “I gave him breath!”',
        'A father holding up a beaded cow-tail switch before a feasting crowd while his sons argue.'
      ),
      pg(
        '💬',
        'Flomo listened until they were quiet. Then he walked past all of them and bent down to his youngest child. He put the cow-tail switch into Saye’s small hands. “Each of you has a great gift,” he said to the others, “and I thank you. But for a long time you had those gifts and did nothing, because you had forgotten me. This child asked, Where is my father? Without that question, I would be bones in the forest still.” The people nodded. For they have a saying: a person is not truly dead until he is forgotten.',
        'A father bending to place a decorated switch in the hands of a small boy, with the village looking on.'
      ),
    ],
    activities: [
      {
        id: 'cs-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What happened after Flomo failed to return?',
        options: [
          'His sons searched for him at once',
          'After a time, nobody spoke of him any more',
          'The village moved away',
        ],
        correctIndex: 1,
      },
      {
        id: 'cs-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What were Saye’s first words?',
        options: [
          '“Where is my father?”',
          '“I am hungry.”',
          '“Give me the spear.”',
        ],
        correctIndex: 0,
      },
      {
        id: 'cs-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Flomo promise to do with the cow-tail switch?',
        options: [
          'Sell it at the market',
          'Keep it for himself',
          'Give it to the son who had done the most to bring him home',
        ],
        correctIndex: 2,
      },
      {
        id: 'cs-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A community group has skilled members, but nothing gets done until one person asks, “Why has the borehole been broken for a year?” According to the tale, what was that person’s contribution?',
        options: [
          'None, because she repaired nothing',
          'The most important one, because her question started the work',
          'A small one, because talking is easy',
        ],
        correctIndex: 1,
      },
      {
        id: 'cs-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Flomo goes hunting and does not return',
          'Saye asks, “Where is my father?”',
          'The first son finds the trail to the clearing',
          'The brothers bring their father back to life',
          'Flomo gives the cow-tail switch to Saye',
        ],
      },
      {
        id: 'cs-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'switch',
        definition: 'A fly-whisk made from an animal’s tail, carried as a sign of honour.',
        distractors: [
          'A button that turns on a light',
          'A path through the forest',
        ],
      },
    ],
    glossary: [
      {
        word: 'trail',
        definition: 'The marks left by someone who has passed.',
        pages: [3],
      },
      {
        word: 'clearing',
        definition: 'An open space in a forest.',
        pages: [3],
      },
      {
        word: 'feast',
        definition: 'A large, special meal for many people.',
        pages: [5],
      },
      {
        word: 'switch',
        definition: 'A fly-whisk made from an animal’s tail, carried as a sign of honour.',
        pages: [5, 6],
      },
      {
        word: 'cowrie',
        definition: 'Cowrie shells: small, shiny sea shells once used as money and decoration.',
        pages: [5],
      },
      {
        word: 'forgotten',
        definition: 'No longer remembered.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale from Liberia, told among the peoples of the forest region near the border with Guinea.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Word note: in this story “switch” means a fly-whisk made from a cow’s tail, a sign of honour carried by elders and chiefs in many parts of West Africa, including Ghana.',
    ],
    reviewQuestions: [
      'The names Flomo and Saye are Liberian names chosen for this retelling; confirm they are suitable.',
      'The finding of the bones should be read calmly; check the tone for younger learners.',
    ],
    guide: {
      overview:
        'A dilemma tale in which listeners must decide who deserves a reward, teaching that remembering and asking come before doing.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Name the gift of each son.',
        'Explain why the father chose the youngest.',
        'Discuss the saying about being forgotten.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a dilemma tale; giving reasons for an opinion'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Family life and remembering our elders'],
      ],
      before: ['Ask: what is worth more, a skill or a question?'],
      during: ['Stop after Page 5 and take a class vote: which son should get the switch? Then read the ending.'],
      after: ['Each learner names someone who has died or moved away and says one thing they remember about that person.'],
      discussion: ['Do you agree with the father’s choice? Argue for a different son if you can.'],
      reflection: ['Whom should you ask about, visit, or remember this week?'],
      maths: [
      ],
      support: ['Give six learners cards with the six gifts and let them act out the scene in the clearing.'],
      stretch: ['Write a paragraph on how your family or community remembers those who have died.'],
      localise: ['What object is a sign of honour among your people, and who may carry it?'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'A traditional Liberian dilemma tale. The names were chosen for this retelling and differ from those in published versions. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 7
  mk({
    key: 'the-monkey-and-the-shark',
    title: 'The Monkey and the Shark',
    summary:
      'A monkey and a shark become friends, until the shark invites the monkey home for a terrible reason. A tale from the Swahili coast of East Africa about friendship and quick thinking.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Easy and friendly, then tense and quick',
    palette: ['#0369a1', '#15803d'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kima: a lively brown monkey with a long tail, who lives in a great fig tree by the sea.',
      'Papa: a large grey shark with a smooth voice, who swims below the tree.',
      'The Sultan of the sharks: an old, sick shark in a coral palace, spoken of but not seen.',
    ],
    music: 'Gentle coastal taarab-style melody with soft waves (placeholder)',
    pages: [
      pg(
        '🌊',
        'On the coast of East Africa, where the Indian Ocean washes against the shore, a great fig tree grew on a cliff. Half of its branches hung over the land and half hung over the deep water. In this tree lived a monkey named Kima. Every day he sat on a branch above the sea and ate the sweet figs. One morning he saw a shark looking up at him from the water. “Friend,” called the shark, “throw me some of that fruit. I am tired of fish.” Kima threw down a fig, and then another.',
        'A monkey on a branch of a large fig tree overhanging blue sea, tossing fruit to a shark below.'
      ),
      pg(
        '🤝',
        'The shark’s name was Papa. He came back the next day, and the day after. Each morning Kima threw down figs, and the two of them talked. Papa told of coral gardens, sunken ships, and the great whales. Kima told of the forest, the villages, and the ways of people. Months passed in this pleasant fashion. “You have been so generous to me,” Papa said one day. “Let me repay you. Come to my home under the sea. Sit on my back and I will carry you. You will not even get wet.”',
        'A monkey and a shark talking happily, the monkey leaning down from a low branch.'
      ),
      pg(
        '🏊',
        'Kima was curious, and he trusted his friend. He climbed down and sat on the shark’s broad back, holding the tall fin. Away they went, out over the deep blue water. The shore grew small behind them. When they were halfway, Papa spoke. “There is something I must tell you. Our Sultan is very ill. The doctors say that only one medicine can cure him: the heart of a monkey. That is why I am taking you home.” Kima’s own heart almost stopped. All around him was nothing but sea.',
        'A monkey riding on the back of a shark far out at sea, the shore a thin line behind them.'
      ),
      pg(
        '💡',
        'Kima could not swim, and he could not fight a shark. He had only his wits. He made his voice calm. “My friend,” he said, “why did you not tell me before we left? I would gladly help your Sultan. But surely you know that we monkeys do not carry our hearts about with us. When we go on a journey, we hang them in the tree for safety. Mine is in the fig tree at this moment. Take me back, and I shall fetch it.” Papa believed him, and turned round.',
        'A monkey speaking calmly into the ear of a shark, with one hand raised as if explaining.'
      ),
      pg(
        '🌴',
        'The shark swam back as fast as he could. The moment they reached the cliff, Kima leapt onto a branch and climbed to the very top of the tree. There he sat. Papa waited below. “Hurry, friend!” he called. “Bring your heart!” Kima looked down and laughed. “Do you take me for a fool? My heart is in my chest, where it has always been. And it is broken, because the friend I fed every day was willing to kill me. Go home, Papa. You will get no more figs from this tree.”',
        'A monkey safe at the very top of a fig tree, looking down at a shark waiting in the water below.'
      ),
      pg(
        '🍃',
        'The shark swam away, and he did not come back. Kima still lives in the fig tree by the sea. He still eats the sweet fruit. But he no longer throws any into the water. The people of the coast tell this story to their children with two lessons. The first is that a clear head can save you when strength cannot. The second is harder. Choose your friends with care, they say, and find out why a person is being kind to you. For it is easy to lose a friend, and hard to win back trust.',
        'A monkey sitting alone on a branch above an empty sea at sunset.'
      ),
    ],
    activities: [
      {
        id: 'ms-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'How did the friendship between Kima and Papa grow?',
        options: [
          'They fought and then made peace',
          'Kima shared figs every day and they talked',
          'Papa saved Kima from drowning',
        ],
        correctIndex: 1,
      },
      {
        id: 'ms-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why was Papa really taking Kima to his home?',
        options: [
          'The Sultan of the sharks needed a monkey’s heart as medicine',
          'To show him the coral gardens',
          'To give him a gift',
        ],
        correctIndex: 0,
      },
      {
        id: 'ms-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Kima save himself?',
        options: [
          'He swam to the shore',
          'He called the whales for help',
          'He said his heart was in the tree and must be fetched',
        ],
        correctIndex: 2,
      },
      {
        id: 'ms-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A stranger online is very friendly and offers you gifts if you will meet him alone. Using the tale, what should you do?',
        options: [
          'Go, because he has been kind',
          'Ask why he is being kind, refuse, and tell a trusted adult',
          'Keep it secret',
        ],
        correctIndex: 1,
      },
      {
        id: 'ms-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Kima throws figs to the shark',
          'Papa invites Kima to his home',
          'Papa reveals that the Sultan needs a monkey’s heart',
          'Kima says his heart is in the tree',
          'Kima escapes up the tree and ends the friendship',
        ],
      },
      {
        id: 'ms-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'wits',
        definition: 'The ability to think quickly and cleverly.',
        distractors: [
          'Strong arms for swimming',
          'Sweet fruit from a tree',
        ],
      },
    ],
    glossary: [
      {
        word: 'coast',
        definition: 'The land beside the sea.',
        pages: [1, 6],
      },
      {
        word: 'generous',
        definition: 'Willing to give and share.',
        pages: [2],
      },
      {
        word: 'Sultan',
        definition: 'A ruler.',
        pages: [3],
      },
      {
        word: 'wits',
        definition: 'The ability to think quickly and cleverly.',
        pages: [4],
      },
      {
        word: 'journey',
        definition: 'A trip from one place to another.',
        pages: [4],
      },
      {
        word: 'trust',
        definition: 'The belief that someone will not harm or cheat you.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale of the Swahili-speaking coast of East Africa (Kenya, Tanzania, and Zanzibar). Kima means monkey and Papa means shark in Kiswahili.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Safety link: Page 6 and the “Apply it” question can open a talk about online safety and adults who offer gifts.',
    ],
    reviewQuestions: [
      'Ask a Kiswahili speaker to confirm the names Kima and Papa.',
      'Check that the online-safety question suits the school’s guidance on the topic.',
    ],
    guide: {
      overview:
        'A tale from the East African coast about a false friend and a quick-witted escape, with a lesson on choosing friends wisely.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain how Kima’s trick worked.',
        'State the two lessons at the end.',
        'Apply the tale to staying safe with strangers.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading for plot and character; dialogue'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Friendship, trust, and personal safety'],
      ],
      before: ['Ask: how do you know whether someone is a true friend?'],
      during: ['Stop after Page 3. In pairs, decide what Kima could say or do.'],
      after: ['Learners write a list: “Five signs of a true friend”.'],
      discussion: ['Was Papa ever a real friend? Could he have refused his Sultan?'],
      reflection: ['Has someone been kind to you for a hidden reason? How did you find out?'],
      maths: [
      ],
      support: ['Use a toy or drawing of a tree, a monkey, and a shark to move through the story.'],
      stretch: ['Write the conversation between Papa and the Sultan when he returns without the heart.'],
      localise: ['Tell a tale from your own area about a false friend.'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'A traditional Swahili tale told in many versions; in the fullest version the monkey goes on to tell a second story. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 8
  mk({
    key: 'hedgehog-jackal-and-the-harvest',
    title: 'Hedgehog, Jackal, and the Harvest',
    summary:
      'Lazy Jackal insists on the first choice of every harvest, and clever Hedgehog lets him have it. A tale of the Amazigh people of North Africa about work and fair shares.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Dry, witty, and steady',
    palette: ['#a16207', '#4d7c0f'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Hedgehog: a small, patient hedgehog with bright black eyes, always carrying a little hoe.',
      'Jackal: a thin, sharp-faced jackal who likes sleeping in the shade and giving orders.',
    ],
    music: 'Light desert flute with a steady frame drum (placeholder)',
    pages: [
      pg(
        '⛰️',
        'At the foot of the Atlas Mountains in North Africa, where the green fields meet the dry lands, lived a hedgehog and a jackal. They were neighbours. One spring, Jackal came to Hedgehog’s door. “Friend,” he said, “you have seed but only a small field. I have a large field but no seed. Let us farm together and share the harvest.” Hedgehog thought it over. He knew that Jackal was lazy and that he liked to get the better of others. But the field was good. “Agreed,” said Hedgehog. “We shall share half and half.”',
        'A small hedgehog with a hoe and a thin jackal shaking paws in front of a field below high mountains.'
      ),
      pg(
        '🌾',
        'All through the spring, Hedgehog worked. He dug the soil, sowed the seed, pulled the weeds, and chased away the birds. Jackal lay under a fig tree. “My back hurts,” he said. “I shall do my share later.” When the crop was ready, Jackal came strolling down. “Before we divide it,” he said, “I, as owner of the field, shall choose first. This year I will take everything that grows under the ground. That is where treasure lies.” Hedgehog bowed. The crop was wheat. Hedgehog took the golden grain, and Jackal was left with a heap of roots.',
        'A hedgehog standing beside sacks of golden wheat while a jackal stares at a pile of dry roots.'
      ),
      pg(
        '😤',
        'Jackal was hungry all that winter. When spring came, he was at Hedgehog’s door again. “You cheated me,” he growled. “This year I shall take everything that grows above the ground, and you may keep the roots.” “As you wish,” said Hedgehog. Once again he dug and sowed and weeded, and once again Jackal slept under the fig tree. He never came to see what had been planted. At harvest time he arrived with a large sack. The crop was onions. Jackal got a heap of green leaves, and Hedgehog filled his store with fat, round onions.',
        'A jackal holding a bunch of limp green leaves while a hedgehog piles up round onions.'
      ),
      pg(
        '🏃',
        'Now Jackal was furious. “I will not be tricked a third time,” he said. “We shall race for the whole harvest. From this stone to that far tree. The winner takes everything.” Hedgehog looked at his own short legs and at Jackal’s long ones. “Very well,” he said. “Tomorrow at sunrise.” That night, Hedgehog went to see his brother, who looked exactly like him. “Hide in the grass beside the far tree,” he said. “When you hear Jackal coming, step out and say: I am here already.” His brother laughed and agreed.',
        'Two identical hedgehogs whispering together at night beside a tree at the end of a field.'
      ),
      pg(
        '🏁',
        'At sunrise, the two stood by the stone. “Go!” cried Jackal, and he shot away like an arrow. Hedgehog took three steps and sat down. Jackal ran with all his strength. As he reached the tree, panting, a hedgehog stepped out of the grass. “I am here already,” it said. Jackal could not believe it. “Again!” he shouted. “Back to the stone!” He turned and ran. At the stone, a hedgehog was waiting. “I am here already.” Jackal ran up and down the field until he fell flat on the ground.',
        'A panting jackal skidding to a stop before a calm hedgehog standing beside a tree.'
      ),
      pg(
        '🤲',
        'When Jackal could speak, he said, “Take it all. You have beaten me.” Hedgehog sat down beside him. “I do not want it all,” he said. “I want a partner. You lost twice because you never came to the field. If you had worked beside me, you would have known what we planted. Come at sowing time, and we shall share the grain and the roots alike.” Jackal was ashamed. The next spring he came with a hoe. The Amazigh people say: the one who does not sow should not be first to choose the harvest.',
        'A hedgehog and a jackal working side by side with hoes in a field at sowing time.'
      ),
    ],
    activities: [
      {
        id: 'hj-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why did Jackal get only roots in the first year?',
        options: [
          'Hedgehog stole his share',
          'He chose what grew under the ground, and the crop was wheat',
          'The birds ate the grain',
        ],
        correctIndex: 1,
      },
      {
        id: 'hj-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did Jackal not know that onions had been planted?',
        options: [
          'He never came to the field to work or look',
          'Hedgehog planted them at night',
          'He had never seen an onion',
        ],
        correctIndex: 0,
      },
      {
        id: 'hj-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Hedgehog plan to win the race?',
        options: [
          'By running very fast',
          'By tripping Jackal',
          'By placing his brother, who looked like him, at the far tree',
        ],
        correctIndex: 2,
      },
      {
        id: 'hj-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: In a group project, one member does no work but wants to choose the best part of the reward. What does the tale suggest is fair?',
        options: [
          'He should choose first because he asked first',
          'Those who share the work should share the reward; he should join in',
          'The group should give him everything',
        ],
        correctIndex: 1,
      },
      {
        id: 'hj-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Jackal and Hedgehog agree to farm together',
          'Jackal chooses what grows under the ground and gets wheat roots',
          'Jackal chooses what grows above the ground and gets onion leaves',
          'Jackal loses the race to the two hedgehogs',
          'Jackal comes to work with a hoe the next spring',
        ],
      },
      {
        id: 'hj-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'harvest',
        definition: 'The gathering of crops when they are ripe; also the crops gathered.',
        distractors: [
          'The digging of a new field',
          'A race between two animals',
        ],
      },
    ],
    glossary: [
      {
        word: 'harvest',
        definition: 'The gathering of crops when they are ripe; also the crops gathered.',
        pages: [1, 3, 4, 6],
      },
      {
        word: 'sowed',
        definition: 'Put seed in the ground to grow.',
        pages: [2, 3],
      },
      {
        word: 'strolling',
        definition: 'Walking slowly and lazily.',
        pages: [2],
      },
      {
        word: 'furious',
        definition: 'Extremely angry.',
        pages: [4],
      },
      {
        word: 'panting',
        definition: 'Breathing fast after running.',
        pages: [5],
      },
      {
        word: 'partner',
        definition: 'Someone who shares work and its rewards with another.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale of the Amazigh (Berber) peoples of Morocco and Algeria, where Hedgehog is the clever one and Jackal the greedy one. Similar “tops and bottoms” tales are told in many countries.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Science link: we eat the seeds of wheat, which grow above the ground, and the bulbs of onions, which grow below it. Learners can sort other crops in the same way.',
    ],
    reviewQuestions: [
      'Check that Hedgehog’s final offer of partnership is clear, so the tale does not end only in trickery.',
      'Confirm that the crops named suit North Africa (wheat and onions do).',
    ],
    guide: {
      overview:
        'A North African trickster tale about a lazy partner and a patient one, ending with an offer of fair partnership.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain why Jackal lost each time.',
        'Sort crops into those eaten from above and below the ground.',
        'Discuss what makes a fair share.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a trickster tale; cause and effect'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Work, fairness, and cooperation'],
      ],
      before: ['Ask: which part of a wheat plant do we eat? Which part of an onion?'],
      during: ['Stop after Page 2. Ask learners to predict what Hedgehog will plant next.'],
      after: ['Sort ten crops (yam, maize, cassava, rice, groundnut, tomato, carrot, millet, onion, plantain) into “above” and “below”.'],
      discussion: ['Hedgehog kept the agreement each time, yet Jackal felt cheated. Who was really at fault?'],
      reflection: ['When have you wanted the reward without doing your share of the work?'],
      maths: [
      ],
      support: ['Bring a real onion and a head of wheat, maize, or rice to show which part is eaten.'],
      stretch: ['Write a fourth year for the story: what do the two partners plant, and how do they share it?'],
      localise: ['Ask a farmer how partners or family members share a harvest in your area.'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'A traditional Amazigh tale told in several versions; the race with the look-alike relative is a separate episode often joined to it. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

];
export const BATCH_45_AFRICAN_FOLK_TALES: PilotStory[] = BATCH_45_STORIES;
