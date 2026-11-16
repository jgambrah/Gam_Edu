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
          claim: 'Folk-tale origin and curriculum verification',
          explanation: item,
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
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
      ...(normalizedFc ? { factCheck: normalizedFc } : {}),
    },
  };
};

/**
 * Batch 47 (8 more African folk tales retold as six-page stories with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to English Language (oral literature) and Social Studies (see the first cultural note and the teacher guide).
 * These are traditional tales retold in original words. Each has named characters, listed in `characters`.
 * Original text written for Ghanaian learners; folk tales exist in many versions; each factCheck note says where the tale is told.
 */

export const BATCH_47_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'the-proud-girl-and-the-handsome-stranger',
    title: 'The Proud Girl and the Handsome Stranger',
    summary:
      'Abena refuses every suitor in her town and follows a handsome stranger into the forest. A tale told in Ghana and across West Africa about judging by looks, and about a brother she had despised.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'ghana', 'west-africa', 'family'],
    wpm: 125,
    paceWord: 'Lively, then tense, then warm',
    palette: ['#be123c', '#166534'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Abena: a beautiful, proud young woman in fine cloth and beads, quick to laugh at others.',
      'Kofi: her younger brother, a small, thin boy with a bamboo flute, patient and watchful.',
      'The stranger: a tall, handsome young man in rich cloth, with smooth manners and cold eyes.',
      'The mother: a sensible woman who asks careful questions.',
    ],
    music: 'Bright market rhythm that slows into a low forest drum (placeholder)',
    pages: [
      pg(
        '💃',
        'In a town at the edge of the forest lived a young woman named Abena. She was the most beautiful girl in the district, and she knew it. Many young men came to ask for her hand. One was a hard-working farmer. “His hands are rough,” said Abena. One was a skilled weaver. “He is too short.” One was a kind teacher. “His nose is too big.” Her mother sighed. “My daughter, a husband is not a cloth to be chosen for its pattern.” But Abena only laughed. “I shall marry the most handsome man in the world, or nobody.”',
        'A beautiful young woman in beads turning away from a line of hopeful young men outside her family’s house.'
      ),
      pg(
        '🎉',
        'On the day of the great festival, a stranger appeared in the town. He was tall, and his skin shone like polished wood. He wore cloth finer than the chief’s. When he danced, everyone stopped to watch. Abena’s heart leapt. “That is the one,” she said. Her mother asked the stranger, “Where is your town? Who are your people?” “Far away, beyond the river,” he said, and smiled. He would say no more. “We know nothing about him,” said her mother. “I know that he is handsome,” said Abena. “That is enough.”',
        'A tall, handsome stranger in rich cloth dancing at a festival while a crowd watches and a young woman gazes at him.'
      ),
      pg(
        '🌲',
        'The next morning, she left with him. Her little brother, Kofi, begged to go with her. Abena had always been ashamed of Kofi, for he was small and thin and often ill. “Go home,” she snapped. “I do not want you trailing behind me.” But Kofi loved his sister. He took his bamboo flute and followed at a distance, keeping to the shadows. The path led deep into the forest. The stranger walked in front and did not speak. The trees grew thick and the light grew dim. Abena began to wish that he would turn and smile.',
        'A handsome man and a young woman walking along a narrow forest path, with a small boy following far behind among the trees.'
      ),
      pg(
        '🐍',
        'At last they came to a dark pool beside a rock. “This is my home,” said the stranger. And as Abena watched, his fine cloth fell away. His arms sank into his sides. His body stretched and thickened, and his skin became scales. Where the handsome man had stood, a great python lay coiled on the rock. “You wished for the most beautiful husband,” it hissed. “You did not ask what was inside.” Abena screamed and tried to run. But the python threw a coil across the path, and she could not pass.',
        'A huge python coiled on a rock beside a dark forest pool, with a terrified young woman backing against a tree.'
      ),
      pg(
        '🎵',
        'From behind a tree came a thin, sweet sound. It was Kofi’s flute. He played the slow tune that their mother used to sing them to sleep. The python turned its head. It swayed. Kofi played on, softer and softer. The great coils loosened, and the yellow eyes began to close. Kofi did not stop playing. With his free hand, he beckoned. Abena stepped over the heavy tail, one foot and then the other. Then the two of them walked backwards, slowly, until the trees hid the pool, and then they ran.',
        'A small boy playing a bamboo flute beside a tree while a huge python sways with half-closed eyes and a girl tiptoes past.'
      ),
      pg(
        '🏡',
        'They reached home at dawn. Abena fell at her mother’s feet and wept. Then she turned to Kofi and held him tightly. “I was ashamed of you,” she said, “and you were the only one who came for me.” She was never proud again. In time she married the farmer with the rough hands, and they were happy. The old people end the story like this: a fine cloth may cover a snake. Before you give your trust, ask where a person comes from and how he treats others. And do not despise the small one in your own house.',
        'A young woman embracing her small brother at the door of their home as their mother looks on at sunrise.'
      ),
    ],
    activities: [
      {
        id: 'ps-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why did Abena refuse the men of her town?',
        options: [
          'They were unkind to her',
          'She found a small fault in the looks of each one',
          'Her mother disliked them',
        ],
        correctIndex: 1,
      },
      {
        id: 'ps-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What did the stranger say when asked about his town and his people?',
        options: [
          'Only that it was far away, beyond the river',
          'That he was a chief’s son',
          'That he was a python',
        ],
        correctIndex: 0,
      },
      {
        id: 'ps-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did Kofi save his sister?',
        options: [
          'He fought the python with a cutlass',
          'He called the hunters',
          'He played a soft tune on his flute until the python grew sleepy',
        ],
        correctIndex: 2,
      },
      {
        id: 'ps-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Someone you met online has an attractive photo and says kind things, but will not say where he lives or who his family is. Using the tale, what should you do?',
        options: [
          'Trust him, because he looks good',
          'Be careful, ask questions, and tell a trusted adult',
          'Meet him alone to find out',
        ],
        correctIndex: 1,
      },
      {
        id: 'ps-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Abena refuses every suitor',
          'A handsome stranger dances at the festival',
          'Abena follows him into the forest, and Kofi follows her',
          'The stranger turns into a python',
          'Kofi’s flute puts the python to sleep and they escape',
        ],
      },
      {
        id: 'ps-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'despise',
        definition: 'To look down on someone as worthless.',
        distractors: [
          'To follow someone at a distance',
          'To dance at a festival',
        ],
      },
    ],
    glossary: [
      {
        word: 'district',
        definition: 'An area of a country with its own towns and villages.',
        pages: [1],
      },
      {
        word: 'festival',
        definition: 'A special day or time of celebration.',
        pages: [2],
      },
      {
        word: 'ashamed',
        definition: 'Feeling embarrassed or bad about something or someone.',
        pages: [3, 6],
      },
      {
        word: 'coiled',
        definition: 'Wound round and round in loops.',
        pages: [4],
      },
      {
        word: 'beckoned',
        definition: 'Made a sign with the hand to call someone closer.',
        pages: [5],
      },
      {
        word: 'despise',
        definition: 'To look down on someone as worthless.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: versions of this tale are told by the Akan, the Ewe, and other peoples of Ghana, and across West Africa. In some, the stranger is a python; in others, a spirit who has borrowed his fine body.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'The tale warns against judging by appearance. It is not a rule that a young woman must accept whomever her family chooses: Abena’s mistake was to ask nothing about a stranger.',
    ],
    reviewQuestions: [
      'Check that the python scene is tense but not frightening for younger learners.',
      'Check that the lesson is about judging character, not about obedience alone.',
    ],
    guide: {
      overview:
        'A widely told Ghanaian tale about pride, judging by looks, and the worth of a family member who was looked down on.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain what Abena failed to ask.',
        'Describe how Kofi saved her and what that showed.',
        'Apply the lesson to judging people today.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading for character and theme'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Folk tales as part of national culture; family life'],
      ],
      before: ['Ask: what can you tell about a person from the way he looks? What can you not tell?'],
      during: ['Stop after Page 2. Ask: what questions should Abena ask the stranger?'],
      after: ['Learners list five questions worth asking before trusting a new person.'],
      discussion: ['Was Abena foolish, or only young? What should her mother have done differently?'],
      reflection: ['Is there someone at home or at school whom you look down on? What might you be missing?'],
      maths: [],
      support: ['Play a slow tune or hum one while reading Page 5.'],
      stretch: ['Rewrite the story so that the stranger is honest. How does the ending change?'],
      localise: ['Ask an elder for the version of this tale told in your own language.'],
      factCheck: ['A traditional tale told in Ghana and across West Africa in many versions. The names Abena and Kofi were chosen for this retelling. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 2
  mk({
    key: 'the-lions-share',
    title: 'The Lion’s Share',
    summary:
      'Lion, Hyena, and Jackal hunt together, and Lion asks the others to divide the meat. A tale from Somalia about power, fear, and learning from another’s mistake.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'somalia', 'horn-of-africa', 'power'],
    wpm: 125,
    paceWord: 'Dry, spare, and sharp',
    palette: ['#a16207', '#57534e'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Lion: a huge, heavy-maned lion, used to being obeyed.',
      'Hyena: a strong, thick-necked hyena, honest and not very clever.',
      'Jackal: a small, slender jackal with large ears and watchful eyes.',
    ],
    music: 'Slow hand drum with a thin, windy flute (placeholder)',
    pages: [
      pg(
        '🏜️',
        'In the dry country of Somalia, where the thorn trees stand far apart and the wind blows dust across the plain, a long drought had come. The wells were low. The herds had moved away. Lion, the strongest of the animals, was hungry. So was Hyena. So was little Jackal. One evening the three of them met at a dry river bed. “Alone, none of us can catch anything,” said Lion. “Let us hunt together and share what we kill.” Hyena agreed at once. Jackal looked at Lion’s teeth, thought for a moment, and agreed as well.',
        'A lion, a hyena, and a small jackal meeting at a dry river bed among scattered thorn trees.'
      ),
      pg(
        '🐪',
        'They hunted all night. Hyena, who could run for hours without tiring, found the trail of a lost camel and drove it towards the rocks. Jackal, who was quick and light, ran ahead and turned it back each time it tried to escape. Lion waited in the shadow of a rock, and when the camel came close, he sprang. By sunrise, the camel lay on the sand. It was more meat than the three had seen in a month. They stood round it, panting, with their tongues hanging out. Each was thinking of his share.',
        'A hyena and a jackal driving a camel across moonlit sand towards rocks where a lion is waiting.'
      ),
      pg(
        '⚖️',
        'Lion lay down and licked his paws. “Hyena,” he said, “you are a fair-minded fellow. Divide the meat among us.” Hyena was pleased to be asked. He looked at the camel, and he looked at the three hunters. “We all worked,” he said. “I found it. Jackal turned it. You killed it. So we shall divide it into three equal parts. One for you, one for me, and one for Jackal.” He began to mark the shares in the sand with his paw. He did not see the look in Lion’s eyes.',
        'A hyena marking three equal shares in the sand beside a camel while a lion watches with narrowed eyes.'
      ),
      pg(
        '💢',
        'Lion rose without a word. With one blow of his great paw, he struck Hyena on the side of the head and sent him rolling across the sand. Hyena lay still for a moment. Then he got up and limped away, howling, with one ear torn and hanging. He did not come back for his share. Lion sat down again and licked his paw. “Jackal,” he said, quite calmly, “it seems that Hyena does not know how to divide. You are a clever fellow. Divide the meat between us.” Jackal had watched everything.',
        'A hyena limping away across the sand with a torn ear, while a lion sits calmly beside the camel.'
      ),
      pg(
        '🦊',
        'Jackal bowed low. “Great Lion,” he said, “the division is simple. The four legs are for your breakfast. The body is for your dinner. The neck and the hump will do for your supper. And the head,” he added, “you may wish to keep in case you are hungry in the night.” Lion was delighted. “Excellent! That is true justice. And is there nothing for yourself?” “If any small bones are left when you have finished,” said Jackal, “I shall be grateful for them.” Lion laughed. “Tell me, little one. Who taught you to divide so wisely?”',
        'A small jackal bowing low before a pleased lion, pointing with one paw at the parts of a camel.'
      ),
      pg(
        '👂',
        '“Hyena’s torn ear taught me,” said Jackal. Lion ate until he could eat no more and then slept. Jackal crept in and took what he could carry. The Somali people tell this story when a strong man takes more than his due, and they call such a portion the lion’s share. They draw two lessons from it. A wise person learns from the mistakes of others, and need not be struck himself. But they also ask a question. Hyena was honest and fair, and he was punished for it. What kind of country is it where only the lion is satisfied?',
        'A lion asleep with a full belly beside the remains of a camel, as a jackal quietly carries off a bone.'
      ),
    ],
    activities: [
      {
        id: 'ls-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why did the three animals agree to hunt together?',
        options: [
          'They were old friends',
          'A drought had made food scarce, and none could catch anything alone',
          'Lion ordered them to',
        ],
        correctIndex: 1,
      },
      {
        id: 'ls-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'How did Hyena propose to divide the camel?',
        options: [
          'Into three equal parts, one for each hunter',
          'All for Lion',
          'Half for himself',
        ],
        correctIndex: 0,
      },
      {
        id: 'ls-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did Jackal divide the camel?',
        options: [
          'Into three equal parts',
          'Half for Lion and half for himself',
          'He gave every part to Lion and asked only for leftover bones',
        ],
        correctIndex: 2,
      },
      {
        id: 'ls-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A group leader takes all the prize money from a team competition, and nobody objects because they are afraid. What does the tale invite us to think about?',
        options: [
          'That leaders should always take everything',
          'Whether a group is fair when the strongest takes all and others stay silent',
          'That prizes should not be given',
        ],
        correctIndex: 1,
      },
      {
        id: 'ls-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Lion, Hyena, and Jackal agree to hunt together',
          'They catch a camel',
          'Hyena divides the meat into three equal parts',
          'Lion strikes Hyena',
          'Jackal gives every part to Lion',
        ],
      },
      {
        id: 'ls-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'drought',
        definition: 'A long period with little or no rain.',
        distractors: [
          'A share of meat',
          'A dry river bed',
        ],
      },
    ],
    glossary: [
      {
        word: 'drought',
        definition: 'A long period with little or no rain.',
        pages: [1],
      },
      {
        word: 'fair-minded',
        definition: 'Wanting to treat everyone equally.',
        pages: [3],
      },
      {
        word: 'divide',
        definition: 'To separate into parts or shares.',
        pages: [3, 4, 5],
      },
      {
        word: 'limped',
        definition: 'Walked unevenly because of an injury.',
        pages: [4],
      },
      {
        word: 'justice',
        definition: 'Fair treatment according to what is right.',
        pages: [5],
      },
      {
        word: 'portion',
        definition: 'A part or share of something.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: a well-known tale of the Somali people of the Horn of Africa. Similar stories are told in Ethiopia, Sudan, and the Arab world. The English phrase “the lion’s share” comes from tales of this kind.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'The tale can be read in two ways: as praise for Jackal’s cleverness, and as criticism of rule by fear. Both readings should be discussed.',
    ],
    reviewQuestions: [
      'Check that the blow to Hyena is told briefly and without cruelty.',
      'Make sure discussion covers the second reading: that the tale criticises the lion.',
    ],
    guide: {
      overview:
        'A short Somali tale about dividing a kill, used to discuss fairness, fear, and learning from the experience of others.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Compare Hyena’s division with Jackal’s.',
        'Explain what Jackal learned and how.',
        'Discuss whether the tale approves of Lion.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading for irony and theme'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Fairness, power, and good leadership'],
      ],
      before: ['Ask: what does “the lion’s share” mean? Have you seen someone take it?'],
      during: ['Stop after Page 4. Ask: what would you say if you were Jackal?'],
      after: ['In groups, divide a pretend prize among three team members and justify the shares.'],
      discussion: ['Who was right, Hyena or Jackal? Is it wise to be honest when honesty is punished?'],
      reflection: ['When have you kept silent about something unfair because you were afraid?'],
      maths: [],
      support: ['Use counters to show Hyena’s division and Jackal’s division side by side.'],
      stretch: ['Write a new ending in which the other animals of the plain hear what Lion did.'],
      localise: ['What proverb in your language warns about powerful people who take too much?'],
      factCheck: ['A traditional Somali tale told in several versions; in some, the third animal is a fox. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 3
  mk({
    key: 'sebgugugu-who-wanted-more',
    title: 'Sebgugugu Who Wanted More',
    summary:
      'A poor man is given one gift after another, and each time he is told one thing he must not do. A tale from Rwanda about greed and impatience.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'rwanda', 'great-lakes', 'greed'],
    wpm: 125,
    paceWord: 'Patient, repeating, and rueful',
    palette: ['#15803d', '#78350f'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Sebgugugu: a thin, restless man in a worn cloth, never content with what he has.',
      'His wife: a sensible woman with a baby on her back, who gives good advice.',
      'Imana: the Creator, heard as a calm voice and never seen.',
      'The white crow: a large, pale crow that herds cattle as a man would.',
    ],
    music: 'Gentle inanga-style strings with a steady drum (placeholder)',
    pages: [
      pg(
        '🐄',
        'In the green hills of Rwanda lived a poor man named Sebgugugu. He owned one white cow and her calf, and the milk fed his wife and children. One day, as he sat outside his hut, a small bird sang from the fence. To Sebgugugu, the song seemed to say: “Kill the white cow, and you shall have a hundred.” His wife shook her head. “It is only a bird. The cow is all we have.” But Sebgugugu could think of nothing except a hundred cows. He killed the white cow. No cattle came. Then he killed the calf. Still none came.',
        'A thin man sitting outside a round hut on a green hillside beside a white cow and her calf, listening to a small bird.'
      ),
      pg(
        '🍃',
        'Now the family had nothing. They left their home and wandered, hungry, through the hills. At last Sebgugugu cried out to Imana, the Creator. Imana took pity on the children. “Go on along this path,” said a voice. “You will find a vine growing over a rock. It bears gourds, beans, and fruit, all on the one plant. Eat from it every day. Only do not cut it or trim it.” They found the vine, and it was as the voice had said. Each morning it was heavy with food. For many weeks, the family ate well.',
        'A family gathering gourds and fruit from a great vine growing over a rock.'
      ),
      pg(
        '✂️',
        'But Sebgugugu grew restless. “This vine is untidy,” he said. “If I cut away the old branches, it will bear twice as much.” “We were told not to cut it,” said his wife. “What is one small trim?” He took his knife and cut the branches back. By evening, the leaves were drooping. By morning, the whole vine was dry and dead. Again the family wandered, and again Sebgugugu cried to Imana. “Go on,” said the voice. “You will come to a rock with small cracks in it. From them flow milk, honey, and grain. Do not make the cracks wider.”',
        'A man with a knife standing beside a withered vine while his wife and children look on in dismay.'
      ),
      pg(
        '🪨',
        'They found the rock. Milk trickled from one crack, honey from another, and grain from a third. They set bowls beneath and had all they needed. But the bowls filled slowly, and Sebgugugu hated to wait. “If the cracks were bigger, we could fill a pot in a moment,” he said. His wife begged him to leave them alone. That night, while she slept, he took a hardwood stake and hammered it into each crack to force it open. The rock groaned and closed. In the morning, not a drop came from it.',
        'A man hammering a wooden stake into a crack in a rock at night, with bowls of milk and honey at his feet.'
      ),
      pg(
        '🐦',
        'Once more Imana had pity, for the sake of the children. “In the next valley you will find a great herd of cattle,” said the voice. “They are yours. A white crow herds them. He takes them to pasture and brings them home. Never insult him and never drive him away.” It was so. The family had milk and butter in plenty, and the white crow watched the herd as well as any man. Sebgugugu’s wife was content. “Now let us be thankful,” she said, “and change nothing.” And for a time, Sebgugugu held his peace.',
        'A large white crow perched on the back of a cow, guiding a herd along a valley towards a family’s hut.'
      ),
      pg(
        '💨',
        'Then his sons grew tall. “Why should a bird herd my cattle,” said Sebgugugu, “when I have sons? People will laugh at us.” He picked up a stone and flung it at the white crow, shouting at it to be gone. The crow rose into the air, circled once, and flew away. And as it flew, every cow, every calf, and every bull followed it over the hill and vanished. Sebgugugu stood in the empty valley. There was no voice this time. The people of Rwanda say: the one who is never satisfied ends with empty hands.',
        'A man standing alone in an empty valley as a white crow flies away and the last of a herd disappears over a hill.'
      ),
    ],
    activities: [
      {
        id: 'sg-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why did Sebgugugu kill his white cow?',
        options: [
          'His family needed the meat',
          'He believed a bird’s song promised him a hundred cows',
          'The cow was sick',
        ],
        correctIndex: 1,
      },
      {
        id: 'sg-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What was the one thing he was told not to do to the vine?',
        options: [
          'Cut or trim it',
          'Eat from it',
          'Water it',
        ],
        correctIndex: 0,
      },
      {
        id: 'sg-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did he force the cracks in the rock wider?',
        options: [
          'To hide the food from thieves',
          'To let his neighbours share',
          'He could not bear to wait for the bowls to fill',
        ],
        correctIndex: 2,
      },
      {
        id: 'sg-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A family’s small shop earns a steady income. One member wants to borrow heavily to triple it at once, against advice. Which lesson of the tale applies?',
        options: [
          'Never run a shop',
          'Impatience and greed can destroy something that is already working',
          'Always do what is fastest',
        ],
        correctIndex: 1,
      },
      {
        id: 'sg-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Sebgugugu kills his cow and calf',
          'He cuts the vine and it dies',
          'He forces the cracks in the rock and it closes',
          'He is given a herd looked after by a white crow',
          'He drives the crow away and loses everything',
        ],
      },
      {
        id: 'sg-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'content',
        definition: 'Satisfied with what one has.',
        distractors: [
          'Angry about a loss',
          'Hungry after a journey',
        ],
      },
    ],
    glossary: [
      {
        word: 'vine',
        definition: 'A climbing plant with long stems.',
        pages: [2, 3],
      },
      {
        word: 'pity',
        definition: 'Sorrow for someone who is suffering.',
        pages: [2, 5],
      },
      {
        word: 'restless',
        definition: 'Unable to stay still or be satisfied.',
        pages: [3],
      },
      {
        word: 'stake',
        definition: 'A strong, pointed stick.',
        pages: [4],
      },
      {
        word: 'pasture',
        definition: 'Grassland where cattle feed.',
        pages: [5],
      },
      {
        word: 'content',
        definition: 'Satisfied with what one has.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale of the Banyarwanda people of Rwanda, where cattle are greatly valued. Imana is the name of God in Kinyarwanda.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Each gift comes with one rule, and each time the wife gives the right advice. Learners can discuss why Sebgugugu never listens.',
    ],
    reviewQuestions: [
      'Ask a Kinyarwanda speaker to confirm the name Sebgugugu and the respectful mention of Imana.',
      'The killing of the cow is told in one sentence; check its tone.',
    ],
    guide: {
      overview:
        'A Rwandan tale built on repetition, in which a man loses four gifts through greed, impatience, and pride.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Name the four gifts and the rule attached to each.',
        'Explain what caused each loss.',
        'Apply the lesson to patience and contentment.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a repetitive (pattern) tale; cause and effect'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Values: contentment, patience, and listening to advice'],
      ],
      before: ['Ask: is it wrong to want more? When does wanting more become a problem?'],
      during: ['After each gift, ask learners to predict how Sebgugugu will spoil it.'],
      after: ['Draw a four-box chart: the gift, the rule, what he did, what happened.'],
      discussion: ['The wife was right every time. Why do people ignore good advice from those closest to them?'],
      reflection: ['What do you have now that you might lose by wanting too much, too fast?'],
      maths: [],
      support: ['Act the story with four objects (a toy cow, a plant, a stone, a paper bird) removed one by one.'],
      stretch: ['Write a fifth gift and the one rule that comes with it. Does Sebgugugu keep it?'],
      localise: ['Tell a tale or proverb from your own people about someone who was never satisfied.'],
      factCheck: ['A traditional Rwandan tale told in several versions; the gifts and their order vary. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 4
  mk({
    key: 'how-the-maasai-got-their-cattle',
    title: 'How the Maasai Got Their Cattle',
    summary:
      'In the beginning, the Maasai say, cattle came down from the sky. A story of the Maasai people of Kenya and Tanzania about a great gift and the care it demands.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'kenya-tanzania', 'maasai', 'origin-story'],
    wpm: 125,
    paceWord: 'Slow, wide, and dignified',
    palette: ['#b91c1c', '#ca8a04'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Maasinta: the first Maasai, a tall, lean man in a red cloth, carrying a long staff.',
      'Enkai: the Creator, who speaks from the sky and is not seen.',
      'The Dorobo man: a hunter with a bow, who shares Maasinta’s homestead.',
    ],
    music: 'Low chanting voices with a slow, steady beat (placeholder)',
    pages: [
      pg(
        '🌄',
        'The Maasai people live on the wide grasslands of Kenya and Tanzania, beneath the snows of Kilimanjaro. They are herders, and to them cattle are more than wealth. Cattle are life. The Maasai tell a story of how this came to be. In the beginning, they say, the sky and the earth were close together, and Enkai, the Creator, lived between them. Enkai owned all the cattle in the world. On the earth below lived a man named Maasinta, the first of the Maasai. He had no cattle at all. He had only the grass and the wind.',
        'A tall man in a red cloth standing with a staff on wide grassland beneath a snow-capped mountain.'
      ),
      pg(
        '🏗️',
        'One day, Enkai spoke to Maasinta. “I wish to give you something called cattle. Build a large enclosure with a strong fence of thorn branches. When it is ready, go into your house and wait. Whatever you see or hear, you must stay calm and say nothing.” Maasinta did not know what cattle were. But he trusted Enkai. He cut thorn bushes for many days and built a fence in a great circle. A hunter of the Dorobo people lived with him in the same homestead. The Dorobo man watched the work and wondered what it was for.',
        'A man building a large circular fence of thorn branches while a hunter with a bow watches.'
      ),
      pg(
        '🐂',
        'Early the next morning, there was a sound like distant thunder. Maasinta looked out. A long strip of hide was hanging down from the sky to the earth, and along it came cattle. They came in an endless line: bulls with wide horns, cows of every colour, and calves trotting beside their mothers. The ground shook under their hooves. The house trembled. The enclosure began to fill. Maasinta was amazed, but he remembered what he had been told. He stood still and did not make a sound. He only watched, and his heart was full.',
        'Cattle of many colours walking down a long strip of hide from the clouds into a thorn enclosure.'
      ),
      pg(
        '😲',
        'The Dorobo man had been asleep. The shaking woke him. He ran outside and saw the sky open and the great herd pouring down. He had never seen such a thing. He was astonished and afraid, and he cried out at the top of his voice. At that cry, the cattle stopped. The strip of hide was drawn back up into the sky, and the opening closed. No more cattle came. Enkai spoke to Maasinta. “These are all the cattle you will receive. I had meant to give you more. Love these as I have loved you.”',
        'A hunter crying out with his arms raised as the strip of hide is drawn back into the sky.'
      ),
      pg(
        '❤️',
        'And so it has been. The Maasai have loved their cattle ever since. A Maasai herder knows each animal by its colour, its horns, and its voice. He sings to his cattle and gives them names. Children learn to herd as soon as they can walk. The cattle give milk, and their hides make beds and sandals. A family’s standing is counted in cattle, and a greeting between Maasai includes the words: I hope your cattle are well. As for the Dorobo, the story says that they remained hunters, living by the bow.',
        'A young herder singing as he walks among his cattle at sunset, touching one gently on the neck.'
      ),
      pg(
        '🌍',
        'The Maasai once said that because cattle were Enkai’s gift to them, all cattle everywhere were theirs. That belief led to raiding and to wars with their neighbours, and few hold it now. But the heart of the story remains true for anyone. A gift comes with a duty. The cattle were given once, and there would be no more, so every animal had to be cared for. Today, when drought and shrinking grasslands threaten the herds, the Maasai still say: look after what you have been given, for it will not be given twice.',
        'Herders leading cattle to a water hole on dry grassland, with a child carrying a newborn calf.'
      ),
    ],
    activities: [
      {
        id: 'mc-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What did Enkai tell Maasinta to do?',
        options: [
          'Hunt with a bow',
          'Build a large enclosure, then wait calmly and say nothing',
          'Climb up to the sky',
        ],
        correctIndex: 1,
      },
      {
        id: 'mc-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'How did the cattle come down?',
        options: [
          'Along a strip of hide hanging from the sky',
          'They rose out of the ground',
          'They swam across a river',
        ],
        correctIndex: 0,
      },
      {
        id: 'mc-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did the cattle stop coming?',
        options: [
          'The enclosure was full',
          'Maasinta asked for no more',
          'The Dorobo man cried out in astonishment',
        ],
        correctIndex: 2,
      },
      {
        id: 'mc-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A school is given twenty new computers and told there will be no more. Using the tale, how should the school treat them?',
        options: [
          'Use them carelessly, since they were free',
          'Look after each one, because the gift will not be repeated',
          'Lock them away unused',
        ],
        correctIndex: 1,
      },
      {
        id: 'mc-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Enkai owns all the cattle',
          'Maasinta builds a thorn enclosure',
          'Cattle come down from the sky',
          'The Dorobo man cries out and the cattle stop',
          'The Maasai care for their cattle from then on',
        ],
      },
      {
        id: 'mc-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'enclosure',
        definition: 'A piece of land with a fence round it.',
        distractors: [
          'A strip of animal hide',
          'A song sung to cattle',
        ],
      },
    ],
    glossary: [
      {
        word: 'herders',
        definition: 'People who look after cattle, sheep, or goats.',
        pages: [1],
      },
      {
        word: 'enclosure',
        definition: 'A piece of land with a fence round it.',
        pages: [2, 3],
      },
      {
        word: 'homestead',
        definition: 'A home with its land and buildings.',
        pages: [2],
      },
      {
        word: 'hide',
        definition: 'The skin of a large animal.',
        pages: [3, 4],
      },
      {
        word: 'astonished',
        definition: 'Very surprised.',
        pages: [4],
      },
      {
        word: 'raiding',
        definition: 'Attacking a place suddenly to seize cattle or goods.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: an origin story of the Maasai people of Kenya and Tanzania. Enkai (also written Engai) is the Maasai name for God. The Dorobo are neighbouring peoples who traditionally lived by hunting.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'The tale places the Dorobo below the Maasai. Teach it as one people’s account of itself, and note that the Dorobo have their own stories.',
    ],
    reviewQuestions: [
      'Ask a Maa speaker or a Kenyan or Tanzanian reviewer to confirm names and the respectful tone.',
      'Page 6 mentions cattle raiding; keep the wording that few hold the old belief now.',
    ],
    guide: {
      overview:
        'The Maasai account of how they received cattle, used to discuss gifts, duty, and stewardship of resources.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why cattle matter so much to the Maasai.',
        'Explain why the gift stopped.',
        'Discuss the duty that comes with a gift, and the harm in claiming everything as one’s own.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading an origin story'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'How peoples explain their beginnings; care of resources'],
      ],
      before: ['Ask: what is the most valuable thing your family or community owns? How is it cared for?'],
      during: ['Stop after Page 3. Ask: could you stay silent if you saw this?'],
      after: ['Learners write a short list of “gifts” their community has received only once (a forest, a river, a building).'],
      discussion: ['The old belief that “all cattle are ours” led to raiding. How can a story that gives pride also cause harm?'],
      reflection: ['What have you been given that will not be given twice?'],
      maths: [],
      support: ['Let learners stand silent and still while the teacher makes “thunder” on a desk.'],
      stretch: ['Find out how Maasai herders are coping with drought and loss of grazing land today.'],
      localise: ['Which animal or crop is most valued by your own people, and what stories are told about it?'],
      factCheck: ['A traditional Maasai origin story told in several versions; in some, a different event stops the cattle. The remarks about past raiding and present pressures on herders come from general knowledge and should be confirmed by a reviewer. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 5
  mk({
    key: 'kalulu-and-the-well',
    title: 'Kalulu and the Well',
    summary:
      'In a great drought, the animals dig a well together, and Kalulu the hare refuses to help. A tale told in Zambia and Malawi about shared work, and about how a trickster was finally caught.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'zambia-malawi', 'kalulu-the-hare', 'cooperation'],
    wpm: 125,
    paceWord: 'Quick, cheeky, with a satisfying ending',
    palette: ['#0369a1', '#a16207'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kalulu: a slim, long-eared hare with a sweet tongue and no liking for work.',
      'Lion: the chief of the animals, fair but short-tempered.',
      'Hyena and Baboon: two guards, strong and easily tempted.',
      'Tortoise: a slow, quiet tortoise who thinks before he speaks.',
    ],
    music: 'Light, skipping drum with a playful thumb-piano (placeholder)',
    pages: [
      pg(
        '☀️',
        'There was once a drought so long that the rivers of the country turned to sand. The animals grew thin with thirst. Lion, their chief, called a meeting. “We must dig a well,” he said. “Every one of us shall take a turn, the great and the small.” Elephant dug with his tusks. Warthog dug with his snout. Even the little mice carried away the soil in their mouths. Only Kalulu the hare did not come. “Digging spoils my paws,” he said. “Besides, I get all the water I need from the dew on the grass.”',
        'Animals of many kinds digging a well in dry ground while a hare lounges in the shade of a bush.'
      ),
      pg(
        '💧',
        'After many days, the animals struck water, cool and clear. They drank and were glad. “Kalulu did not dig,” said Lion, “so Kalulu shall not drink. We shall set a guard.” The first night, Hyena kept watch. At midnight Kalulu came strolling up with a gourd. “Good evening, Uncle,” he said. “I have something here that is sweeter than water.” He let Hyena taste a drop of honey. “More!” said Hyena. “Ah,” said Kalulu, “it is so sweet that you must be tied up first, or you will faint and fall.”',
        'A hare holding out a gourd of honey to a hyena beside a well at night.'
      ),
      pg(
        '🪢',
        'Hyena let himself be tied to a tree. Kalulu drank his fill from the well, bathed in it, and went home laughing. In the morning, the animals found the water muddy and Hyena in ropes. The next night, Baboon kept watch. “I am not a fool like Hyena,” he said. But when Kalulu held the honey under his nose, his mouth watered, and soon he too was tied to the tree. It went on like this, night after night. Each guard was sure that he was cleverer than the last, and each was found in the morning in ropes.',
        'A baboon tied to a tree beside a muddy well at sunrise, with other animals staring at him.'
      ),
      pg(
        '🐢',
        'Lion was roaring with anger when a slow voice spoke. “Let me try,” said Tortoise. The animals laughed. “You cannot even run after him!” “I do not intend to run,” said Tortoise. He asked the bees for wax and the trees for sticky gum, and he covered his whole shell with it. Then he walked down the steps into the well and sat in the shallow water at the edge, as still as a stone. The night was dark. Nobody was guarding the well at all, as far as anyone could see.',
        'A tortoise smearing sticky gum over his shell beside a well while other animals look on doubtfully.'
      ),
      pg(
        '🦶',
        'At midnight, Kalulu came. “No guard?” he said. “They have given up at last.” He skipped down the steps and put one foot on a round, flat stone in the water. The foot stuck. “Let go, stone!” he said, and he kicked it with the other foot. That stuck as well. He pushed with his front paws, and they stuck. He butted it with his head, and his ears stuck. Then the stone began to move. Slowly, steadily, it carried him up the steps and out into the moonlight. Kalulu had never been so surprised.',
        'A hare stuck by all four feet to the back of a tortoise that is walking slowly up the steps of a well.'
      ),
      pg(
        '⚖️',
        'In the morning, the animals found Kalulu stuck fast to Tortoise’s back. Lion judged the case. “You would not dig, yet you drank,” he said. “You spoiled the water for all. Now you shall clean the well, and you shall carry water for the old and the sick until the rains come.” Kalulu did, though he grumbled. Tortoise was given the first drink every morning. In Zambia and Malawi, they tell this tale when someone wants a share of what he did not help to make. And they add: the quiet one who thinks may catch what the strong ones cannot.',
        'A hare carrying a gourd of water to an old antelope while a tortoise drinks first at the well.'
      ),
    ],
    activities: [
      {
        id: 'kl-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why did Kalulu refuse to help dig the well?',
        options: [
          'He was ill',
          'He said digging would spoil his paws and that he did not need the water',
          'He did not know about it',
        ],
        correctIndex: 1,
      },
      {
        id: 'kl-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'How did Kalulu get past the guards?',
        options: [
          'He tempted them with honey and persuaded them to be tied up',
          'He fought them',
          'He dug a tunnel',
        ],
        correctIndex: 0,
      },
      {
        id: 'kl-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What was Tortoise’s plan?',
        options: [
          'To run faster than Kalulu',
          'To ask Lion for help',
          'To cover his shell with sticky gum and sit still in the well',
        ],
        correctIndex: 2,
      },
      {
        id: 'kl-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A community builds a borehole with everyone’s labour. One family that refused to help now wants to use it. Using the tale, what is a fair solution?',
        options: [
          'Let them use it and say nothing',
          'Ask them to contribute in another way, such as helping to maintain it',
          'Destroy the borehole',
        ],
        correctIndex: 1,
      },
      {
        id: 'kl-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The animals dig a well and Kalulu refuses to help',
          'Kalulu tricks Hyena with honey',
          'Guard after guard is found tied up',
          'Tortoise covers his shell with gum and waits',
          'Kalulu is caught and made to carry water',
        ],
      },
      {
        id: 'kl-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'grumbled',
        definition: 'Complained in a low, unhappy voice.',
        distractors: [
          'Laughed loudly',
          'Ran very fast',
        ],
      },
    ],
    glossary: [
      {
        word: 'drought',
        definition: 'A long period with little or no rain.',
        pages: [1],
      },
      {
        word: 'gourd',
        definition: 'The dried shell of a fruit, used as a container.',
        pages: [2],
      },
      {
        word: 'guard',
        definition: 'Someone who watches over a place to protect it.',
        pages: [2, 3, 4],
      },
      {
        word: 'gum',
        definition: 'A sticky substance from trees.',
        pages: [4],
      },
      {
        word: 'butted',
        definition: 'Hit with the head.',
        pages: [5],
      },
      {
        word: 'grumbled',
        definition: 'Complained in a low, unhappy voice.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: Kalulu the hare is the trickster of the Bemba, Chewa, Tonga, and other peoples of Zambia and Malawi. Tales of a trickster caught by a sticky figure are told across Africa and in the Americas.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Compare Kalulu with Hare in “Hare and the Great Tug-of-War” and with Ananse in Ghana: in some tales the trickster wins, and in others he is caught.',
    ],
    reviewQuestions: [
      'Check that the punishment is seen as fair and useful, not cruel.',
      'Is the sticking scene on Page 5 clear when read aloud?',
    ],
    guide: {
      overview:
        'A trickster tale from south-central Africa about a hare who will not share the work, teaching cooperation and fair contribution.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain how Kalulu tricked the guards.',
        'Explain how Tortoise succeeded.',
        'Discuss what is fair when someone has not contributed.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a trickster tale; problem and solution'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Community work and fair contribution'],
      ],
      before: ['Ask: should someone who did not help with communal labour share the result?'],
      during: ['Stop after Page 3. Ask: why does each guard fail in the same way?'],
      after: ['Learners write rules for sharing a resource that a whole community built.'],
      discussion: ['Was Lion’s judgement fair? What would you have decided?'],
      reflection: ['When have you enjoyed something without doing your share of the work?'],
      maths: [],
      support: ['Use sticky tape on a ball to show how each paw gets stuck in turn.'],
      stretch: ['Write the story from Kalulu’s point of view. Does he think he was treated fairly?'],
      localise: ['How is communal labour organised in your community, and what happens to those who stay away?'],
      factCheck: ['A traditional tale told in Zambia, Malawi, and neighbouring countries in many versions. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 6
  mk({
    key: 'how-mantis-brought-fire',
    title: 'How Mantis Brought Fire',
    summary:
      'Long ago, only Ostrich had fire, and he kept it hidden under his wing. A tale of the San people of southern Africa about how fire was won for everyone.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'botswana-namibia-south-africa', 'san', 'why-tale'],
    wpm: 125,
    paceWord: 'Quiet, watchful, then quick',
    palette: ['#c2410c', '#44403c'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Mantis: a small green praying mantis with large eyes, curious and clever.',
      'Ostrich: a tall ostrich with broad wings held tight against his body, secretive and proud.',
      'The people: a small band of hunters and gatherers who live in the dry country.',
    ],
    music: 'Soft clapping and a single bow-string note (placeholder)',
    pages: [
      pg(
        '🌙',
        'The San are the oldest people of southern Africa. For thousands of years they have lived as hunters and gatherers in the dry lands of Botswana, Namibia, and South Africa, and they painted their stories on the walls of caves. Many of those stories are about Mantis. He is small, but he is the one who makes things happen. Long ago, say the San, there was no fire in the world. People ate their food raw. They shivered through the cold desert nights. And when darkness came, they sat close together and were afraid.',
        'A small band of people sitting close together in the dark beneath a starry desert sky.'
      ),
      pg(
        '👃',
        'One evening, Mantis noticed something strange. A delicious smell was drifting on the wind. He followed it across the sand and came upon Ostrich, alone behind a bush. Mantis hid and watched. Ostrich lifted one great wing. From beneath it he took something bright that glowed red and gold. He laid it on the ground and held a piece of meat over it. The smell grew stronger. When Ostrich had eaten, he picked up the bright thing with care, tucked it back under his wing, and pressed the wing tight against his side.',
        'An ostrich behind a bush lifting his wing to reveal a small glowing fire, watched by a mantis hidden in the grass.'
      ),
      pg(
        '🤔',
        '“So that is the secret,” thought Mantis. “He has something that makes food taste good and gives light and warmth, and he keeps it all for himself.” Mantis knew that he could not take it by force. Ostrich was a hundred times his size and could kill with one kick. Mantis would need a plan. He went away and thought about it all night. In the morning he went to Ostrich with a friendly face. “Good morning, friend! I have found a tree covered with the sweetest yellow plums. Come, I will show you.”',
        'A small green mantis greeting a tall ostrich in the early morning light.'
      ),
      pg(
        '🌳',
        'Ostrich loved plums. He followed Mantis to the tree and began to eat the fruit from the lower branches. “Those are small and sour,” said Mantis. “The best ones are at the top. Look how big and ripe they are!” Ostrich stretched his long neck. “Higher,” said Mantis. Ostrich stood on the tips of his toes. “Just a little higher! The very best is right above you.” Ostrich stretched as far as he could. He began to wobble. To keep his balance, he did what any bird would do. He spread his wings wide.',
        'An ostrich on tiptoe stretching his neck towards the top of a plum tree, his wings beginning to open.'
      ),
      pg(
        '🔥',
        'In that instant, Mantis darted in. He snatched the fire from beneath the open wing and ran. Ostrich gave a great cry and chased him, but Mantis was already far across the plain. He carried the fire to the people. He showed them how to feed it with dry grass and sticks so that it would not die. That night, for the first time, the people cooked their meat. They sat round the flames, warm and unafraid, and they told stories until morning. They have told stories round the fire ever since.',
        'A mantis running across a plain carrying a glowing ember, with an ostrich chasing far behind.'
      ),
      pg(
        '🪶',
        'And Ostrich? The San say that he still has a little fire left under his wing, and he is terrified of losing it. That is why, to this day, the ostrich never flies. He keeps his wings pressed close to his sides and runs on the ground. The San tell this story to their children with a smile. Fire, they say, is like knowledge. It is of little use hidden under one wing. It does the most good when it is carried to everyone. But remember, too, that it must be fed and watched, or it will go out.',
        'A family seated round a fire at night telling stories, with an ostrich running on the far horizon.'
      ),
    ],
    activities: [
      {
        id: 'mf-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What was life like before people had fire?',
        options: [
          'They ate raw food and were cold and afraid at night',
          'They lived in stone houses',
          'They had lamps but no cooking pots',
        ],
        correctIndex: 0,
      },
      {
        id: 'mf-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'Where did Ostrich keep the fire?',
        options: [
          'In a cave',
          'In a clay pot',
          'Under his wing',
        ],
        correctIndex: 2,
      },
      {
        id: 'mf-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Mantis make Ostrich open his wings?',
        options: [
          'He frightened him with a snake',
          'He made him stretch for high plums until he spread his wings to keep balance',
          'He asked him politely',
        ],
        correctIndex: 1,
      },
      {
        id: 'mf-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A pupil is the only one who understands a hard topic and refuses to explain it to classmates. Using the tale, what would be better?',
        options: [
          'Keeping the knowledge to herself',
          'Sharing it, because knowledge does the most good when everyone has it',
          'Pretending not to understand',
        ],
        correctIndex: 1,
      },
      {
        id: 'mf-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'People live without fire',
          'Mantis sees Ostrich take fire from under his wing',
          'Mantis leads Ostrich to the plum tree',
          'Ostrich spreads his wings and Mantis snatches the fire',
          'The people cook, keep warm, and tell stories',
        ],
      },
      {
        id: 'mf-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'snatched',
        definition: 'Took quickly and suddenly.',
        distractors: [
          'Cooked slowly over a fire',
          'Hid under a wing',
        ],
      },
    ],
    glossary: [
      {
        word: 'gatherers',
        definition: 'People who collect wild plants, fruits, and roots for food.',
        pages: [1],
      },
      {
        word: 'drifting',
        definition: 'Moving slowly through the air.',
        pages: [2],
      },
      {
        word: 'tucked',
        definition: 'Put into a small, safe place.',
        pages: [2],
      },
      {
        word: 'wobble',
        definition: 'To move unsteadily from side to side.',
        pages: [4],
      },
      {
        word: 'snatched',
        definition: 'Took quickly and suddenly.',
        pages: [5],
      },
      {
        word: 'terrified',
        definition: 'Extremely frightened.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale of the San (Bushman) peoples of southern Africa, among the oldest storytelling traditions on Earth. Mantis is the central figure of many San stories.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Science link: ostriches are real flightless birds; they are too heavy to fly and use their wings for balance when running. The tale gives a story reason for a real fact.',
    ],
    reviewQuestions: [
      'Use the name “San”, which is widely preferred; older books use other names.',
      'Check that Mantis’s trick is discussed: he took by deception what was being hoarded.',
    ],
    guide: {
      overview:
        'A San “why” tale about the winning of fire, used to discuss sharing knowledge and the responsibility of keeping it alive.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Describe how Mantis planned and carried out the trick.',
        'Explain the San comparison between fire and knowledge.',
        'Discuss whether Mantis was right to take the fire.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading an explanatory (“why”) tale'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Africa’s oldest cultures; sharing knowledge'],
      ],
      before: ['Ask: what would life be like without fire? List everything that would change.'],
      during: ['Stop after Page 3. Ask: how can something so small defeat something so large?'],
      after: ['Learners finish the sentence five ways: “Knowledge is like fire because…”.'],
      discussion: ['Ostrich was selfish, but the fire was his. Was Mantis right to take it by a trick?'],
      reflection: ['What do you know that you could teach to someone else this week?'],
      maths: [],
      support: ['Use a torch hidden under an arm to act out Ostrich’s secret.'],
      stretch: ['Find out about San rock paintings: where they are found and how old some are.'],
      localise: ['How did your grandparents make fire and keep it alive before matches were common?'],
      factCheck: ['A traditional San tale told in several versions. Statements about the San as the oldest inhabitants of southern Africa and about their rock art come from general knowledge and should be confirmed by a reviewer. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 7
  mk({
    key: 'tselane-and-the-giant',
    title: 'Tselane and the Giant',
    summary:
      'A girl stays alone in her house and opens the door only to her mother’s song, until a giant learns to copy it. A tale from Lesotho about caution, a recognised voice, and helpful neighbours.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'lesotho', 'basotho', 'caution'],
    wpm: 125,
    paceWord: 'Sing-song, then tense, then triumphant',
    palette: ['#7c2d12', '#0e7490'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Tselane: a girl of about twelve in a wool blanket, brave and a little stubborn.',
      'Her mother: a hard-working woman who climbs the hill each day with food.',
      'The giant: a huge, shaggy giant with a rough, growling voice and a large sack.',
      'The village girls: three sharp-eared girls drawing water at a spring.',
    ],
    music: 'A simple repeated song with a soft drum, darkening and then brightening (placeholder)',
    pages: [
      pg(
        '🏔️',
        'High in the mountains of Lesotho, a family decided to move to a new village in the valley. But the daughter, Tselane, loved the old house on the hill. “Let me stay,” she begged. “I am not afraid.” Her mother did not like it. “There are giants in these hills.” At last she agreed, on one condition. “Keep the door barred. I shall bring your food each day, and I shall sing, so that you know it is I. Open to nobody else.” Then she sang: “Tselane, my child, come out and eat your bread.”',
        'A girl in a blanket at the door of a stone house on a mountainside, waving to her family going down to the valley.'
      ),
      pg(
        '🎶',
        'Every day, the mother climbed the hill with a pot of food. Every day she stood at the door and sang in her clear, high voice, and Tselane sang back: “I hear you, my mother. Your voice is like a little bird.” Then she unbarred the door. But a giant lived in a cave nearby. He saw the woman come and go, and he heard the song. “A child, alone,” he said, and licked his lips. The next day, when the mother had gone, he crept to the door and sang: “Tselane, my child, come out and eat your bread.”',
        'A huge shaggy giant hiding behind a rock, watching a woman sing at the door of a small house.'
      ),
      pg(
        '🚪',
        'His voice was like stones rolling down a mountain. Tselane laughed behind the door. “Go away, giant! My mother’s voice is like a little bird. Yours is like an old bull.” The giant went off, growling. He thought about it for a long time. Then he made a fire, heated a smooth stone until it glowed, and swallowed it to burn the roughness out of his throat. He practised the song until it came out high and sweet. Two days later, he stood at the door again and sang. It sounded exactly like her mother.',
        'A giant crouched over a fire heating a stone, holding his throat and practising a song.'
      ),
      pg(
        '🧺',
        'Tselane unbarred the door. The giant seized her, pushed her into his sack, and tied the top. He slung the sack over his shoulder and set off for his cave. The day was hot and the sack was heavy. He came to a village and stopped by a spring where three girls were drawing water. “Watch my sack,” he ordered. “I am going to drink beer at the chief’s house. Do not touch it.” Inside the sack, Tselane heard their voices. Softly, she began to sing: “I hear you, my mother. Your voice is like a little bird.”',
        'A giant setting down a large sack beside a spring where three girls are filling water pots.'
      ),
      pg(
        '🐝',
        'The girls stared at the sack. “That is Tselane’s song! Her aunt lives in this very village.” They ran for the aunt. Quickly, the women untied the sack and lifted Tselane out. Then they went to a hollow tree and filled the sack with a swarm of angry bees, and with a few thorn branches for weight. They tied it exactly as it had been. When the giant came back, full of beer, the three girls were drawing water as before. He threw the sack over his shoulder and went on his way.',
        'Women lifting a girl out of a sack beside a spring while others carry a buzzing bundle from a hollow tree.'
      ),
      pg(
        '🏃',
        'In his cave, the giant shut the door and opened the sack. Out poured the bees. They stung his nose, his ears, and his eyes. He roared and burst out of the cave and ran down the mountain, and he ran so far that he was never seen in those hills again. Tselane went down to the valley and lived with her family. The Basotho tell this tale to teach three things. A voice can be copied, so be careful whom you open to. Keep singing when you are in trouble, so that friends can find you. And a village that listens can save a child.',
        'A giant running down a mountain chased by a cloud of bees, with a village safe in the valley below.'
      ),
    ],
    activities: [
      {
        id: 'ts-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What was the mother’s condition for letting Tselane stay?',
        options: [
          'She must cook her own food',
          'She must keep the door barred and open only to her mother’s song',
          'She must come down every evening',
        ],
        correctIndex: 1,
      },
      {
        id: 'ts-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'How did the giant change his voice?',
        options: [
          'He swallowed a hot stone to burn away the roughness, and practised',
          'He drank honey',
          'He asked a bird to sing for him',
        ],
        correctIndex: 0,
      },
      {
        id: 'ts-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did the village girls discover who was in the sack?',
        options: [
          'They opened it out of curiosity',
          'The giant told them',
          'They recognised Tselane’s song coming from inside',
        ],
        correctIndex: 2,
      },
      {
        id: 'ts-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You receive a phone message that seems to come from a relative, asking you to send mobile money urgently. Using the tale, what should you do first?',
        options: [
          'Send it at once',
          'Check in another way that it is really that person, as voices can be copied',
          'Share your PIN to be helpful',
        ],
        correctIndex: 1,
      },
      {
        id: 'ts-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Tselane stays alone and opens only to her mother’s song',
          'The giant’s rough voice is recognised',
          'The giant softens his voice and captures her',
          'The village girls hear her song from the sack',
          'The giant opens the sack and is stung by bees',
        ],
      },
      {
        id: 'ts-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'condition',
        definition: 'Something that must be agreed to before something else is allowed.',
        distractors: [
          'A sack for carrying things',
          'A song sung at a door',
        ],
      },
    ],
    glossary: [
      {
        word: 'condition',
        definition: 'Something that must be agreed to before something else is allowed.',
        pages: [1],
      },
      {
        word: 'barred',
        definition: 'Fastened shut with a bar.',
        pages: [1],
      },
      {
        word: 'practised',
        definition: 'Did something again and again to get better at it.',
        pages: [3],
      },
      {
        word: 'seized',
        definition: 'Took hold of suddenly and by force.',
        pages: [4],
      },
      {
        word: 'spring',
        definition: 'A place where water comes up out of the ground.',
        pages: [4],
      },
      {
        word: 'swarm',
        definition: 'A large group of bees flying together.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale of the Basotho people of Lesotho. Stories of an ogre who copies a mother’s song are told by many peoples of southern and eastern Africa.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Safety link: the “Apply it” question connects the copied voice to mobile-money and phone scams, which are common in Ghana.',
    ],
    reviewQuestions: [
      'Ask a Sesotho speaker to confirm the name Tselane.',
      'The capture on Page 4 is told in one sentence; check its tone for younger learners.',
    ],
    guide: {
      overview:
        'A Basotho tale about a girl, a giant who copies her mother’s voice, and the neighbours who rescue her, linked to modern safety against impersonation.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain how the giant deceived Tselane.',
        'Explain how she was rescued.',
        'Apply the lesson to phone and online impersonation.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading for plot and suspense; song in story'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Personal safety; community responsibility for children'],
      ],
      before: ['Ask: how do you know that a caller or a message is really from the person it claims to be?'],
      during: ['Stop after Page 3. Ask: what else could Tselane and her mother have agreed, to be safer?'],
      after: ['Learners invent a family “safety question” that only real family members could answer.'],
      discussion: ['Should Tselane’s mother have let her stay alone? Who was responsible for what happened?'],
      reflection: ['Who in your neighbourhood would notice and help if you were in trouble?'],
      maths: [],
      support: ['Teach the two lines of the song and let the class sing the mother’s part and Tselane’s reply.'],
      stretch: ['Write a modern version in which the “giant” is a scammer on the phone.'],
      localise: ['Tell a tale from your own area in which a monster or stranger tricks a child.'],
      factCheck: ['A traditional Basotho tale told in several versions; what the villagers put in the sack varies. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 8
  mk({
    key: 'goha-his-son-and-the-donkey',
    title: 'Goha, His Son, and the Donkey',
    summary:
      'Goha sets out for market with his son and one donkey, and everyone they pass has advice. A tale told in Egypt, Sudan, and across North Africa about trying to please everybody.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'egypt-sudan', 'north-africa', 'goha'],
    wpm: 125,
    paceWord: 'Light, comic, and wry',
    palette: ['#ca8a04', '#0f766e'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Goha: a cheerful, round-faced man in a long robe and turban, eager to do the right thing.',
      'His son: a boy of about ten in a small cap, who notices everything.',
      'The donkey: a small, patient grey donkey.',
      'The passers-by: farmers, old men, women at a well, and travellers, each with an opinion.',
    ],
    music: 'Jaunty reed flute with a clip-clop drum rhythm (placeholder)',
    pages: [
      pg(
        '🫏',
        'In the towns and villages of Egypt and Sudan, people love to tell stories about a man named Goha. Sometimes Goha is foolish and sometimes he is wise, and often it is hard to say which. One morning, Goha decided to go to market. He took his young son and his small grey donkey. It was a fine day, so the two of them walked along the road beside the river, leading the donkey behind them. They passed some farmers working in a field. The farmers pointed and laughed. Goha wondered what was so funny.',
        'A round-faced man in a turban and a small boy walking beside a river, leading a grey donkey.'
      ),
      pg(
        '😄',
        '“Look at those two fools!” the farmers called. “They have a perfectly good donkey, and they are walking!” Goha stopped. “They are right,” he said. He lifted his son onto the donkey’s back and walked beside it. Soon they passed a group of old men sitting in the shade. The old men shook their heads. “See how the young behave today,” said one. “That healthy boy rides like a prince while his poor father walks in the dust. Has he no respect?” The boy went red. “They are right,” said Goha.',
        'A boy riding a donkey while his father walks alongside, as old men in the shade shake their heads.'
      ),
      pg(
        '😟',
        'So the boy climbed down, and Goha climbed up. On they went. Before long, they came to a well where women were filling their jars. The women clicked their tongues. “What a hard-hearted man! He sits at his ease on the donkey and makes that little child trot behind him in the heat. Shame on him!” Goha felt his face grow hot. “They are right,” he said. He reached down and pulled his son up in front of him. Now both of them were riding. “There,” said Goha. “Nobody can complain of that.”',
        'A man riding a donkey with his small son trotting behind, as women at a well click their tongues.'
      ),
      pg(
        '😠',
        'A little further on, they met some travellers. The travellers stopped and stared. “Do you see that? Two of them on one small donkey! The poor beast’s legs are bending. Have these people no pity for a dumb animal?” Goha and his son got down at once. They stood in the road and looked at the donkey. The donkey looked at them. “We have walked beside it,” said Goha. “You have ridden. I have ridden. We have both ridden. Everybody was displeased. There is only one thing that we have not tried.”',
        'A father and son both riding a small donkey whose legs bend under the weight, while travellers point.'
      ),
      pg(
        '🤣',
        'They found a strong pole and some rope. They tied the donkey’s legs, slung it from the pole, and lifted the pole onto their shoulders. Then they staggered on towards the market, carrying the donkey between them. By the time they reached the bridge into town, a crowd was following, and the whole crowd was roaring with laughter. Children ran alongside. The donkey, upside down and frightened by the noise, began to kick. The rope slipped. The donkey tumbled off the pole, scrambled to its feet, and galloped away across the fields.',
        'A man and a boy carrying a donkey slung from a pole across a bridge, followed by a laughing crowd.'
      ),
      pg(
        '🧠',
        'Goha and his son sat down by the roadside. They had no donkey and nothing to sell, and half the town was laughing at them. After a while, the boy spoke. “Father, we listened to everyone, and everyone said something different.” Goha nodded slowly. “My son, today I have learned something that is worth more than a donkey. If you try to please everybody, you will please nobody, and you may lose your donkey as well. Listen to advice. Then think for yourself, decide what is right, and do it.” And that, people say, was one of Goha’s wise days.',
        'A father and son sitting side by side at the roadside, the father speaking thoughtfully with one finger raised.'
      ),
    ],
    activities: [
      {
        id: 'gd-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why did the old men disapprove?',
        options: [
          'The donkey was too small',
          'The boy was riding while his father walked',
          'Goha was walking too slowly',
        ],
        correctIndex: 1,
      },
      {
        id: 'gd-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'What did the travellers complain about?',
        options: [
          'Both father and son were riding one small donkey',
          'Nobody was riding the donkey',
          'The donkey was too noisy',
        ],
        correctIndex: 0,
      },
      {
        id: 'gd-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What happened when they carried the donkey?',
        options: [
          'Everyone praised them',
          'They sold it for a good price',
          'The crowd laughed, the donkey kicked free and ran away',
        ],
        correctIndex: 2,
      },
      {
        id: 'gd-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You are choosing which subjects to study. Friends, relatives, and neighbours all give different advice. Using the tale, what is the wisest course?',
        options: [
          'Follow whoever spoke last',
          'Listen to advice, think about your own abilities and goals, and then decide',
          'Refuse to listen to anyone',
        ],
        correctIndex: 1,
      },
      {
        id: 'gd-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Goha and his son walk beside the donkey',
          'The son rides and Goha walks',
          'Goha rides and the son walks',
          'Both ride the donkey',
          'They carry the donkey and it runs away',
        ],
      },
      {
        id: 'gd-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'displeased',
        definition: 'Not happy or satisfied.',
        distractors: [
          'Very tired',
          'Riding quickly',
        ],
      },
    ],
    glossary: [
      {
        word: 'market',
        definition: 'A place where people buy and sell goods.',
        pages: [1, 5],
      },
      {
        word: 'respect',
        definition: 'Polite behaviour towards someone, especially an elder.',
        pages: [2],
      },
      {
        word: 'hard-hearted',
        definition: 'Showing no kindness or pity.',
        pages: [3],
      },
      {
        word: 'pity',
        definition: 'Sorrow for the suffering of a person or animal.',
        pages: [4],
      },
      {
        word: 'displeased',
        definition: 'Not happy or satisfied.',
        pages: [4],
      },
      {
        word: 'staggered',
        definition: 'Walked unsteadily, as if about to fall.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Where it is told: Goha (also called Juha or Joha) is the best-loved comic character of Egypt, Sudan, Libya, Tunisia, and the wider Arabic-speaking world. The same tale is told of other characters in many countries.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Goha is both a fool and a sage. Learners can decide which he is in this story.',
    ],
    reviewQuestions: [
      'Check that the humour reads well aloud and that nobody in the tale is mocked cruelly.',
      'Is the final lesson balanced: listen to advice, but decide for yourself?',
    ],
    guide: {
      overview:
        'A comic North African tale about a father and son who try to follow everyone’s advice, teaching independent judgement.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'List the four arrangements and who objected to each.',
        'State Goha’s lesson in your own words.',
        'Apply it to a decision in your own life.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a humorous tale; sequence and repetition'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Decision-making; handling peer and public pressure'],
      ],
      before: ['Ask: can you ever please everyone? Give an example.'],
      during: ['After each meeting, ask: what will the next group say?'],
      after: ['Act the story with a “donkey” (a chair) and four groups of critics.'],
      discussion: ['Is Goha saying that we should ignore advice? When is other people’s opinion worth following?'],
      reflection: ['What decision are you facing where you are trying too hard to please others?'],
      maths: [],
      support: ['Draw the four arrangements as stick figures on the board as the story is read.'],
      stretch: ['Write a modern version set on social media, where every post draws a different complaint.'],
      localise: ['Who is the comic character in the tales of your own people, and is he wise or foolish?'],
      factCheck: ['A traditional tale told across North Africa and beyond in many versions. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),
];

export const BATCH_47_AFRICAN_FOLK_TALES: PilotStory[] = BATCH_47_STORIES;
