import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (
  motif: string,
  text: string,
  alt: string,
  narration = 'Clear, steady science-narrator voice suited for JHS learners; pause briefly after each new term and each large number.'
): Page => ({
  motif,
  text,
  alt,
  brief: `Clear, accurate hand-painted gouache science illustration, landscape 4:3, with no people unless the description names them. ${alt} Keep a calm, uncluttered area for text.`,
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
        'Read as a single narrator: this is a science article, not a story with characters.',
        'Pause for two seconds at each comprehension check so learners can reason first.',
        'Say numbers and units in full ("one hundred and fifty million kilometres", "astronomical units") and pronounce names clearly.',
      ],
    },
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: [
      'Is the language right for the stated JHS age band (Basic 7 to Basic 9) and BECE conceptual level?',
      'Are all facts, figures, and dates accurate and up to date at the time of publication?',
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
 * Batch 43 (10 stand-alone history articles): "Kingdoms of Ghana" series, set 2, for JHS (Basic 7 to Basic 9).
 * Each article is tied to a JHS Social Studies strand (History is not a separate JHS subject) (see the first cultural note and the teacher guide).
 * These are history articles, not stories: there are no characters, so `characters` is empty and one narrator reads throughout.
 * Original text written for Ghanaian learners; oral traditions and dates differ between sources (see each factCheck note).
 * To verify before seeding: classIds, readingLevel, themes, and ghanaianContext against ../classification.ts;
 * whether the schema accepts an empty `characters` array; and all NaCCA curriculum codes.
 */

export const BATCH_44_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'mamprugu-the-elder-brother-of-the-north',
    title: 'Mamprugu: The Elder Brother of the North',
    summary:
      'Mamprugu is honoured as the senior of the kingdoms founded by the children of Naa Gbewaa. This article tells how it grew on the Gambaga escarpment, why its king is called the Nayiri, and what seniority means.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Calm, steady, and dignified',
    palette: ['#854d0e', '#1d4ed8'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Slow gungon drum with a single flute (placeholder)',
    pages: [
      pg(
        '⛰️',
        'Drive north from Tamale and, after Walewale, the flat land ends at a long wall of rock. This is the Gambaga escarpment, a line of cliffs that runs for many kilometres across the north-east of Ghana. On top of it, the air is a little cooler, and the view stretches south across the plains. Two old towns stand close together up here: Gambaga and Nalerigu. In Nalerigu is a palace where chiefs from far away come to be given their authority. The king who sits there is the Nayiri, the ruler of Mamprugu, the kingdom that others call their elder brother.',
        'A long line of rocky cliffs rising above a wide plain of grass and scattered trees.'
      ),
      pg(
        '👨👦',
        'Mamprugu shares its beginning with Dagbon and Nanung. Tradition says that the great chief Naa Gbewaa ruled at Pusiga, near Bawku. When he died, his children quarrelled over who should follow him, and they separated. An elder son, Tohagu, travelled south-west and founded Mamprugu. A younger son, Sitobu, founded Dagbon, and another founded Nanung around Bimbilla. A daughter of the family is remembered in Burkina Faso as the mother of the Mossi kings. Because Tohagu was the senior, his kingdom is honoured as the eldest of the family to this day.',
        'A simple family tree with one figure at the top and four branches leading to four small crowns.'
      ),
      pg(
        '🏰',
        'For many years the kings of Mamprugu lived at Gambaga. Around 1700, a king named Naa Atabia moved the royal court a few kilometres east to Nalerigu, and there it has stayed. Gambaga remained a busy town of traders and Muslim teachers, on the road that carried kola nuts north and salt and cloth south. Near Nalerigu you can still see the remains of a great wall of mud and stone, said to have been built by an early king to protect people and travellers from raiders. Only a part of it stands today.',
        'The remains of an old, thick mud-and-stone wall among trees, with a path running beside it.'
      ),
      pg(
        '🪶',
        'The word Nayiri means the house of the king, and the title is used for the king himself. A new Nayiri is not simply the son of the last one. He is chosen from among the royal families by a group of elders called kingmakers, who are not princes and cannot become king. As in Dagbon, a chief here sits on skins, and so he is said to be enskinned. Under the Nayiri are chiefs of towns and villages. He also has the right to enskin the chiefs of some neighbouring peoples, a sign of Mamprugu’s long standing in the north-east.',
        'A group of elders seated in a half-circle before a round palace entrance.'
      ),
      pg(
        '🤲',
        'Mamprugu was never the largest or richest kingdom of the north. Its strength was respect. When the related kingdoms quarrelled, the Nayiri could be asked to give advice, as an elder brother would. During the colonial period, the British made Gambaga their first headquarters for the north, before they moved to Tamale in 1907. The people lived mainly by farming millet, guinea corn, and yams, by keeping cattle, and by trade. Life followed the rains. Like their neighbours, they celebrate the Damba festival with drumming, dancing, and riders on decorated horses.',
        'Farmers harvesting tall millet in a field, with cattle grazing nearby.'
      ),
      pg(
        '🧭',
        'In 2019, the North East Region was created, and Nalerigu became a regional capital. The old royal town now has a new task. What can Mamprugu teach? In many Ghanaian families, the eldest child is given respect but is also expected to keep the peace, to share, and to speak last and calmly. Being senior is a duty as well as an honour. A kingdom, a class prefect, and an elder sister all face the same test: people keep respecting you only for as long as you use your position to bring others together.',
        'An older sister helping two younger children settle a disagreement in a family compound.'
      ),
    ],
    activities: [
      {
        id: 'ma-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why is Mamprugu called the elder brother among the kingdoms of the north?',
        options: [
          'It has the largest army',
          'Tradition says it was founded by the senior son of Naa Gbewaa',
          'It is nearest to the sea',
        ],
        correctIndex: 1,
      },
      {
        id: 'ma-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Naa Atabia do around 1700?',
        options: [
          'He moved the royal court to Nalerigu',
          'He built the port of Tema',
          'He conquered Asante',
        ],
        correctIndex: 0,
      },
      {
        id: 'ma-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Who chooses a new Nayiri?',
        options: [
          'The British governor',
          'All the traders of Gambaga',
          'Elders called kingmakers, who cannot become king themselves',
        ],
        correctIndex: 2,
      },
      {
        id: 'ma-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Two younger pupils are quarrelling, and a senior pupil is asked to help. Following the lesson of Mamprugu, what should the senior do?',
        options: [
          'Take one side at once',
          'Listen to both, stay calm, and help them reach peace',
          'Punish both without listening',
        ],
        correctIndex: 1,
      },
      {
        id: 'ma-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'Naa Gbewaa rules at Pusiga',
          'Tohagu founds Mamprugu',
          'Naa Atabia moves the court to Nalerigu',
          'The British move their northern headquarters from Gambaga to Tamale',
          'Nalerigu becomes the capital of the North East Region',
        ],
      },
      {
        id: 'ma-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'kingmakers',
        definition: 'Elders who have the right to choose a new king.',
        distractors: [
          'Craftsmen who make crowns',
          'Soldiers who guard the palace',
        ],
      },
    ],
    glossary: [
      {
        word: 'escarpment',
        definition: 'A long, steep slope or line of cliffs.',
        pages: [1],
      },
      {
        word: 'tradition',
        definition: 'Beliefs, stories, and customs passed down from older people to younger ones.',
        pages: [2],
      },
      {
        word: 'court',
        definition: 'The household and officials of a king.',
        pages: [3],
      },
      {
        word: 'kingmakers',
        definition: 'Elders who have the right to choose a new king.',
        pages: [4],
      },
      {
        word: 'enskinned',
        definition: 'Made a chief in northern Ghana, where a chief sits on animal skins.',
        pages: [4],
      },
      {
        word: 'headquarters',
        definition: 'The main office from which a government or organisation works.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B8.4.2.1.1, Strand 4: Law and Order, Sub-Strand 2: Conflict Prevention and Management (Examine ways of preventing and managing conflict in the community).',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: Nalerigu and Gambaga are in the North East Region, on the Gambaga escarpment. The Nalerigu defence wall survives in part. Mamprugu, Dagbon, and Nanung regard one another as related kingdoms.',
    ],
    reviewQuestions: [
      'Ask the Mamprugu Traditional Council or a historian to confirm the founder’s name, the move to Nalerigu, and the account of the wall.',
      'Check the wording on the Nayiri’s right to enskin neighbouring chiefs, which is a sensitive matter in some areas.',
    ],
    guide: {
      overview:
        'Introduces Mamprugu as the senior Mole-Dagbani kingdom and uses it to discuss seniority as responsibility.',
      lessonMinutes: 45,
      goals: [
        'Retell how Mamprugu, Dagbon, and Nanung are related.',
        'Locate Gambaga and Nalerigu and describe the escarpment.',
        'Explain how a Nayiri is chosen.',
        'Discuss what it means to be senior.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B8.4.2.1.1: Strand 4: Law and Order, Sub-Strand 2: Conflict Prevention and Management)', 'Mamprugu and the meaning of seniority'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years'],
      ],
      before: ['Ask: what is expected of the eldest child in a family? Is it fair?'],
      during: ['After Page 2, add Mamprugu to the family tree drawn for the Dagbon article.'],
      after: ['Learners write five lines on “A time when an older person helped to make peace”.'],
      discussion: ['Should respect be given because of age or position, or must it be earned?'],
      reflection: ['Where are you the senior one, and how do you use that position?'],
      maths: [
        {
          task: 'The court moved to Nalerigu in about 1700. Nalerigu became a regional capital in 2019. How many years lay between?',
          answer: '2019 − 1700 = 319 years.',
        },
        {
          task: 'The British stayed at Gambaga from 1897 to 1907. For how many years was it their headquarters?',
          answer: '1907 − 1897 = 10 years.',
        },
      ],
      support: ['Use four learners as the children of Naa Gbewaa walking to four corners of the room.'],
      stretch: ['Find out about Yennenga and the Mossi kingdoms of Burkina Faso.'],
      localise: ['Find out which is the oldest town in your district and what it is respected for.'],
      factCheck: [
        {
          claim: 'Historical and curriculum verification',
          explanation: 'The founding by Tohagu, the move to Nalerigu under Naa Atabia (about 1700), the defence wall, the British headquarters at Gambaga (1897 to 1907), and the creation of the North East Region (2019) come from general historical knowledge and oral tradition and should be confirmed by a historian. The Social Studies code was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the choice of strand for this article is the writer’s judgement.',
          reference: 'NaCCA JHS Social Studies Curriculum (B7–B9) & Historical Record',
        },
      ],
    },
  }),

  // 2
  mk({
    key: 'wala-three-groups-one-kingdom',
    title: 'Wala: Three Groups, One Kingdom',
    summary:
      'At Wa, princes, Muslim scholars, and the first owners of the land learned to share one kingdom. This article tells how the Wala state was formed, what each group contributed, and how it faced the raiders of the 1890s.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Clear, warm, and measured',
    palette: ['#a16207', '#0f766e'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Soft xylophone (gyil) pattern with light drum (placeholder)',
    pages: [
      pg(
        '🏯',
        'In the middle of Wa, the capital of the Upper West Region, stands a white palace that looks like a fortress made of sand. Its walls are thick mud, smoothed and painted, with tall buttresses that end in points. This is the palace of the Wa Naa, the king of the Wala people. Every year, at the Dumba festival, crowds gather in front of it to watch the king perform one act. A cow is tied on the ground, and the Wa Naa must step over it. If he does so cleanly, the people cheer, for the year ahead will be good.',
        'A white mud palace with pointed buttresses along its front wall, standing in an open square.'
      ),
      pg(
        '🌾',
        'Long before there was a king, there were farmers. The first people of the Wa area lived in scattered family settlements. They had no chief over them all. Their leaders were earth priests, who looked after the land and its shrines and decided who could farm where. Their descendants are still called the Tendaamba, the owners of the land. Then, perhaps four hundred years ago, strangers arrived. From the east came mounted princes of the royal families of Mamprugu and Dagbon. From the north-west came Muslim traders and teachers whose ancestors had lived in old Mali.',
        'A farming settlement of flat-roofed mud houses with an elder pouring water at the foot of a large tree.'
      ),
      pg(
        '🤝',
        'Each group had something that the others lacked. The princes had horses and skill in war and government. The Muslims could read and write, and they traded with distant markets. The Tendaamba knew the land and had the right to bless it. In time, the three made one kingdom. The princes provided the king, the Wa Naa, and the chiefs. The Muslims provided teachers, advisers, and the imam who prayed for the king. The Tendaamba kept charge of the land, and no Wa Naa could be properly installed without their part in the ceremony.',
        'Three men standing together: a horseman in a smock, a scholar holding a writing board, and an elder holding a hoe.'
      ),
      pg(
        '📖',
        'Wa became known for learning. Children studied in Qur’anic schools, writing their lessons on wooden boards with ink made from soot. Scholars copied books by hand and wrote down the history of the town in Arabic. Small mud mosques with wooden poles in their walls were built in Wa and in nearby villages such as Nakore, and some still stand. Caravans passing between the forest and the River Niger stopped here. The kingship did not stay in one family. It passed in turn among several royal houses, called gates, so that each had hope of its turn.',
        'Children seated on mats, writing on wooden boards in front of a teacher beside a small mud mosque.'
      ),
      pg(
        '⚔️',
        'The 1890s brought danger. Armed bands on horseback were raiding the north for captives. One force was led by Babatu. Another, stronger one belonged to Samori Toure, a ruler from the west who was fighting the French. At the same time, Britain and France were racing to claim land. In 1894, a Fante surveyor named George Ekem Ferguson came to Wa and signed a treaty for the British. He returned in 1897 with a small force. Samori’s army attacked. Ferguson was wounded and killed near Wa. The next year, the British took control.',
        'Riders with guns approaching a walled town across dry grassland as people hurry inside.'
      ),
      pg(
        '🧩',
        'Wa is now a busy regional capital with a university, yet the three old groups are still recognised: the royals, the Muslim community, and the owners of the land. Their story offers a lesson. A country is made of people who arrived at different times and who believe different things. It holds together when each group is given a real part to play and none is told that it does not belong. The Wala worked this out centuries ago. Ghana, with its many peoples, languages, and faiths, depends on the same understanding.',
        'A modern street in Wa with motorbikes and shops, and the white palace visible in the background.'
      ),
    ],
    activities: [
      {
        id: 'wa-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Who were the Tendaamba?',
        options: [
          'Horsemen from Mamprugu',
          'The first settlers, whose earth priests looked after the land',
          'Traders from the coast',
        ],
        correctIndex: 1,
      },
      {
        id: 'wa-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did the Muslim community contribute to the Wala kingdom?',
        options: [
          'Horses and soldiers',
          'Fishing canoes',
          'Teachers, advisers, trade links, and the imam',
        ],
        correctIndex: 2,
      },
      {
        id: 'wa-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How was the kingship of Wa passed on?',
        options: [
          'It rotated among several royal houses called gates',
          'It always went to the eldest son',
          'The British chose each king',
        ],
        correctIndex: 0,
      },
      {
        id: 'wa-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A new school has pupils from three different towns. Using the lesson of Wa, what would help them become one school?',
        options: [
          'Let the pupils of one town make all the decisions',
          'Give each group a real part to play in running the school',
          'Keep the groups in separate classrooms',
        ],
        correctIndex: 1,
      },
      {
        id: 'wa-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'Farmers led by earth priests settle the Wa area',
          'Princes and Muslim scholars arrive',
          'The three groups form the Wala kingdom',
          'Ferguson signs a treaty at Wa for the British',
          'Samori’s army attacks and Ferguson is killed',
        ],
      },
      {
        id: 'wa-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'treaty',
        definition: 'A written agreement between states or peoples.',
        distractors: [
          'A wall built round a town',
          'A tax paid in cattle',
        ],
      },
    ],
    glossary: [
      {
        word: 'buttresses',
        definition: 'Thick supports built against a wall to hold it up.',
        pages: [1],
      },
      {
        word: 'priests',
        definition: 'Earth priests: leaders who look after the land and its shrines.',
        pages: [2],
      },
      {
        word: 'descendants',
        definition: 'The children, grandchildren, and later family of a person or people.',
        pages: [2],
      },
      {
        word: 'imam',
        definition: 'A leader of prayers in a Muslim community.',
        pages: [3],
      },
      {
        word: 'gates',
        definition: 'Royal houses that take turns to provide the king.',
        pages: [4],
      },
      {
        word: 'treaty',
        definition: 'A written agreement between states or peoples.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.4.5.3.1, Strand 4: Law and Order, Sub-Strand 5: Promoting Democracy and Political Stability (Assess the significance of political stability in national development).',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: the Wa Naa’s palace stands in central Wa; the Nakore mosque is a few kilometres away. The three estates of Wala society are the princes (Nabihi), the Muslims (Yerihi), and the landowners (Tendaamba). Chieftaincy succession in Wa has been disputed; the article keeps to the general principle.',
    ],
    reviewQuestions: [
      'Ask the Wala Traditional Council or a historian to confirm the origin of the princes, which traditions give as Mamprugu or Dagbon.',
      'Confirm the account of the Dumba ceremony with a Wala reviewer.',
    ],
    guide: {
      overview:
        'Shows how three groups with different origins formed one kingdom at Wa, and draws a lesson about unity in diversity.',
      lessonMinutes: 45,
      goals: [
        'Name the three groups of Wala society and what each contributed.',
        'Describe Wa as a centre of Islamic learning.',
        'Outline the events of the 1890s at Wa.',
        'Explain how sharing roles holds a diverse community together.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.4.5.3.1: Strand 4: Law and Order, Sub-Strand 5: Promoting Democracy and Political Stability)', 'The Wala kingdom and unity in diversity'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years; sharing equally'],
      ],
      before: ['Ask: can people of different origins and beliefs build one community? What makes it work?'],
      during: ['After Page 3, learners fill a three-column table: group, where they came from, what they gave.'],
      after: ['Learners design a badge for a club that shows three different groups working together.'],
      discussion: ['Which was most important to the kingdom: the horse, the book, or the land? Can one work without the others?'],
      reflection: ['Which different groups make up your own town, and what does each bring?'],
      maths: [
        {
          task: 'Ferguson signed the treaty in 1894 and was killed in 1897. How many years later was that?',
          answer: '1897 − 1894 = 3 years.',
        },
        {
          task: 'If four gates take turns to provide the king and each reign lasts 15 years, how long is one full round?',
          answer: '4 × 15 = 60 years.',
        },
      ],
      support: ['Give three learners a toy horse, a book, and a hoe, and let the class say what each stands for.'],
      stretch: ['Find out who Samori Toure was and why he fought the French.'],
      localise: ['Find out who are regarded as the first settlers of your town, and what role their descendants have today.'],
      factCheck: [
        {
          claim: 'Historical and curriculum verification',
          explanation: 'The three estates of Wala society, the arrival of princes and Muslim scholars (dates uncertain), the rotating gates, Ferguson’s treaty (1894) and death (1897), and British control from 1898 come from general historical knowledge and should be confirmed by a historian. The Social Studies code was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the choice of strand for this article is the writer’s judgement.',
          reference: 'NaCCA JHS Social Studies Curriculum (B7–B9) & Historical Record',
        },
      ],
    },
  }),

  // 3
  mk({
    key: 'the-builsa-who-stopped-the-raiders',
    title: 'The Builsa: The People Who Stopped the Raiders',
    summary:
      'In the 1890s, slave raiders on horseback spread fear across the far north. This article tells how the Builsa villages united at Sandema to defeat them, and how the Feok festival keeps the victory alive.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Urgent, then proud and steady',
    palette: ['#9a3412', '#365314'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'War-dance drums and whistles, firm and regular (placeholder)',
    pages: [
      pg(
        '🏹',
        'Each December, in the town of Sandema in the Upper East Region, men march into the durbar ground dressed for war. They wear smocks covered with charms and helmets fitted with the horns of bulls and antelopes. They carry bows, quivers of arrows, axes, and spears. To the beat of drums and the scream of whistles, they stamp, crouch, and charge at an enemy nobody can see. This is the Feok festival of the Builsa people. The enemy they are fighting again is one their great-grandfathers faced in real life: a slave raider named Babatu.',
        'War dancers in horned helmets and smocks, carrying bows, stamping in a line across a dusty festival ground.'
      ),
      pg(
        '🌍',
        'The Builsa lived in farming villages spread across the savanna. They grew millet and guinea corn, kept cattle, and built flat-roofed houses of mud, joined into large compounds. For most of their history they had no king over all of them. Each village looked after its own affairs under its elders and its earth priest. This suited a peaceful life. It was a weakness when danger came, because a village standing alone could be attacked and destroyed before its neighbours even heard the news. There was no army to send and no one to call for help.',
        'A large compound of flat-roofed mud houses with painted walls, surrounded by millet fields.'
      ),
      pg(
        '🐎',
        'Danger came in the second half of the 1800s. Bands of horsemen known as the Zabarima rode in from the lands that are now Niger. First they came as traders and hired soldiers. Then they turned to raiding. Under their leader Babatu, they attacked village after village across the north, among the Sissala, the Kasena, and the Builsa. They burned houses and seized grain and cattle. Worst of all, they carried off men, women, and children to be sold as slaves in distant markets. Whole districts were emptied as people fled.',
        'Horsemen with guns riding hard towards a village as smoke rises from its granaries.'
      ),
      pg(
        '🧱',
        'People defended themselves in different ways. At Gwollu, the Sissala built two rings of high mud wall around their town and its farms. Parts of that wall can still be seen. Others hid in caves or among rocks. The Builsa chose to unite. Messages went from village to village. Fighters gathered at Sandema, armed with bows and poisoned arrows, and prepared for the raiders. Tradition says that the women played their part by carrying water, food, and arrows to the men. When Babatu’s horsemen came, in about 1896, the Builsa were ready.',
        'The remains of a high mud wall curving round a village, with a baobab tree beside it.'
      ),
      pg(
        '🛡️',
        'The battle went against the raiders. Horses are of little use among rocks, thick bush, and walls, and guns of that time were slow to reload. The Builsa archers shot from cover and drove the horsemen back with heavy losses. Babatu retreated. He never returned to Builsa country. Soon afterwards, British and French forces, who were then taking control of the region, broke what was left of his army. The raids ended. For the Builsa, the lesson was clear, and the chief of Sandema came to be recognised as the leader of all the Builsa.',
        'Archers hidden among rocks and trees, drawing their bows as horsemen turn away.'
      ),
      pg(
        '🌾',
        'Feok means plenty of food. The festival gives thanks for the harvest, and it remembers the victory at the same time. That is fitting. A people who are free to stay on their land can plant and harvest in peace. Slave raiding in the north is part of the same terrible history as the slave trade on the coast, and both deserve to be remembered. The Builsa story adds something hopeful to that history. Ordinary farmers, without a king or an army, protected their families by standing together. No village could have done it alone.',
        'Baskets of harvested millet and guinea corn set out in a compound, with children helping to carry them.'
      ),
    ],
    activities: [
      {
        id: 'bu-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why were the Builsa villages easy to attack at first?',
        options: [
          'They had no weapons',
          'Each village stood alone, with no ruler over all of them',
          'They lived on an island',
        ],
        correctIndex: 1,
      },
      {
        id: 'bu-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What made the Zabarima raids so terrible?',
        options: [
          'They carried people off to be sold as slaves',
          'They bought all the cattle at high prices',
          'They built walls round the villages',
        ],
        correctIndex: 0,
      },
      {
        id: 'bu-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why did the horsemen lose at Sandema?',
        options: [
          'The Builsa had more horses',
          'It rained for a week',
          'Archers shot from cover, where horses and slow guns were of little use',
        ],
        correctIndex: 2,
      },
      {
        id: 'bu-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Thieves keep stealing from farms in a community, one farm at a time. Which lesson from the Builsa is most useful?',
        options: [
          'Each farmer should guard only his own farm',
          'The farmers should organise together and warn one another',
          'Everyone should leave the area',
        ],
        correctIndex: 1,
      },
      {
        id: 'bu-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'The Builsa live in separate farming villages',
          'Zabarima horsemen arrive as traders and hired soldiers',
          'Babatu’s raiders attack villages across the north',
          'The Builsa unite and defeat the raiders at Sandema',
          'The chief of Sandema is recognised as leader of all the Builsa',
        ],
      },
      {
        id: 'bu-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'raiding',
        definition: 'Attacking a place suddenly to seize people or goods.',
        distractors: [
          'Trading peacefully in a market',
          'Planting crops in rows',
        ],
      },
    ],
    glossary: [
      {
        word: 'durbar',
        definition: 'A grand public gathering of chiefs and people.',
        pages: [1],
      },
      {
        word: 'compounds',
        definition: 'Groups of houses joined together round shared yards.',
        pages: [2],
      },
      {
        word: 'priest',
        definition: 'Earth priest: a leader who looks after the land and its shrines.',
        pages: [2],
      },
      {
        word: 'raiding',
        definition: 'Attacking a place suddenly to seize people or goods.',
        pages: [3],
      },
      {
        word: 'unite',
        definition: 'To join together as one.',
        pages: [4],
      },
      {
        word: 'retreated',
        definition: 'Moved back after losing a fight.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.4.4.1.1, Strand 4: Law and Order, Sub-Strand 4: Peace and Security in Our Nation (Examine the relevance of peace and security in our community).',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: Sandema is the capital of the Builsa North Municipality in the Upper East Region; Feok is held there in December. The Gwollu defence wall is in the Sissala West District of the Upper West Region. Teach the slave raids with care.',
    ],
    reviewQuestions: [
      'Ask the Sandema Traditional Council or a historian to confirm the date of the battle, which sources give as 1896 or 1897.',
      'Confirm the account of the women’s part with a Builsa reviewer.',
    ],
    guide: {
      overview:
        'Tells how the Builsa united to defeat the slave raider Babatu, linking the Feok festival to the history of slave raiding in the north.',
      lessonMinutes: 45,
      goals: [
        'Describe how the Builsa lived and were organised before the raids.',
        'Explain who the Zabarima raiders were and what they did.',
        'Retell how the raiders were defeated at Sandema.',
        'Explain what the Feok festival remembers and celebrates.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.4.4.1.1: Strand 4: Law and Order, Sub-Strand 4: Peace and Security in Our Nation)', 'Resistance to slave raiding in the north'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Multiplication; subtraction'],
      ],
      before: ['Ask: what can a small community do when it faces a danger too big for any one family?'],
      during: ['After Page 4, compare three ways of defence: a wall, hiding, and uniting. Which has what risks?'],
      after: ['Learners draw a war dancer’s helmet and write what each part was for.'],
      discussion: ['The Builsa had no king, yet they won. What does that say about where strength comes from?'],
      reflection: ['When has working with others helped you to do what you could not do alone?'],
      maths: [
        {
          task: 'If 12 villages each send 50 fighters to Sandema, how many fighters gather?',
          answer: '12 × 50 = 600 fighters.',
        },
        {
          task: 'The battle was fought in about 1896. How many years ago was that in 2026?',
          answer: '2026 − 1896 = 130 years.',
        },
      ],
      support: ['Act out the message passing from village to village as a relay round the classroom.'],
      stretch: ['Find out about the Pikworo slave camp at Paga and what visitors can see there.'],
      localise: ['Is there a wall, cave, rock, or tree near you where people once hid from raiders? Ask the elders.'],
      factCheck: [
        {
          claim: 'Historical and curriculum verification',
          explanation: 'The Zabarima raids under Babatu, the Gwollu defence wall, the Builsa victory at Sandema (about 1896), and the meaning of Feok come from general historical knowledge and oral tradition and should be confirmed by a historian. The part played by women is tradition. The Social Studies code was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the choice of strand for this article is the writer’s judgement.',
          reference: 'NaCCA JHS Social Studies Curriculum (B7–B9) & Historical Record',
        },
      ],
    },
  }),

  // 4
  mk({
    key: 'denkyira-the-kingdom-of-gold-and-pride',
    title: 'Denkyira: The Kingdom of Gold and Pride',
    summary:
      'Before Asante, Denkyira was the richest power in the forest. This article tells how it grew wealthy on gold, how a young king asked for too much, and what its fall at Feyiase teaches about power.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Rich, steady, and cautionary',
    palette: ['#a16207', '#7f1d1d'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Deep drums with soft bells, slow and heavy (placeholder)',
    pages: [
      pg(
        '⛏️',
        'Stand on the bridge at Dunkwa and look down at the River Offin. For as long as anyone can remember, people have washed gold from its sands and dug it from the land around. Today the river often runs brown with mud from illegal mining. Three hundred and fifty years ago, the gold of this same valley belonged to one kingdom. Its name was Denkyira. Its king had so much gold that, people said, he never used the same ornaments twice. For a time it ruled most of the forest country. Then, in a single afternoon, it lost everything.',
        'A wide brown river under a bridge, with forested banks and a town beyond.'
      ),
      pg(
        '👑',
        'Denkyira was an Akan state. Its capital, Abankeseso, lay in the forest near the Offin. In the 1600s, its kings defeated their neighbours one by one, beginning with the old state of Adansi. They took control of the richest gold fields and of the trade paths that led to the European forts on the coast, where gold was exchanged for guns and cloth. With guns, they won more wars. The greatest of these kings was Boa Amponsem. Under him, almost every state in the central forest paid tribute to Denkyira.',
        'A forest town with a large royal courtyard, with porters arriving carrying loads on their heads.'
      ),
      pg(
        '📦',
        'Tribute was the price of defeat. Each year, the weaker states had to send gold, food, and people to Abankeseso. They also had to send young royals to live at the court of Denkyira. This was meant to keep their families obedient. One of these young men came from Kwaman, a small state in the north. He served at court and watched closely how a powerful kingdom was governed and how its army was organised. His name was Osei Tutu. Denkyira had taken him in to keep his people weak. In fact, it was training its own conqueror.',
        'A young man in simple cloth standing among attendants in a royal courtyard, watching the king’s officials at work.'
      ),
      pg(
        '💢',
        'When Boa Amponsem died, a young king named Ntim Gyakari came to the stool. The stories say that he was proud and hasty. He demanded far more from the tribute states than before. Tradition tells that he sent a great brass basin to the Asante chiefs and ordered them to fill it with gold dust, and to send their favourite wives and children as well. By then the Asante states had united around the Golden Stool. They refused. One chief is said to have filled the basin with stones. It was an insult, and it meant war.',
        'A large brass basin set down before a circle of chiefs, one of whom is rising angrily to his feet.'
      ),
      pg(
        '⚔️',
        'The armies met at Feyiase, near Kumasi, around 1701. Denkyira was richer and had more guns. But many of its subject states had been waiting for this moment and went over to the Asante side. The Denkyira army was broken. Tradition says that Ntim Gyakari was found sitting in his camp, wearing golden ornaments and playing a board game, certain that he could not lose. He was killed there. The richest king in the forest had fallen in a day. Asante took Denkyira’s gold, its trade paths, and its place as the leading power of the forest.',
        'A fallen royal umbrella lying on a battlefield beside an overturned game board.'
      ),
      pg(
        '🧠',
        'Denkyira did not disappear. Its people later moved south, and their king has his seats at Dunkwa-on-Offin and at Jukwa, near Cape Coast. But the kingdom never ruled the forest again. Its story is told all over Ghana as a warning. Wealth and weapons made Denkyira strong, and pride made it careless. It pressed its neighbours so hard that they united against it. The gold is still in the Offin valley, and so is the lesson: riches taken without care for others, or for the land, can ruin those who take them.',
        'A calm stretch of clear river running through green forest, with a child looking at the water.'
      ),
    ],
    activities: [
      {
        id: 'de-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What made Denkyira so powerful in the 1600s?',
        options: [
          'It controlled rich gold fields and the trade paths to the coast',
          'It had the largest fishing fleet',
          'It was protected by the British',
        ],
        correctIndex: 0,
      },
      {
        id: 'de-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did Denkyira keep young royals from other states at its court?',
        options: [
          'To teach them to read',
          'To give them gold',
          'To keep their families obedient',
        ],
        correctIndex: 2,
      },
      {
        id: 'de-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why did Denkyira lose at Feyiase even though it was richer?',
        options: [
          'Its guns were stolen',
          'Many of its subject states joined the Asante side',
          'Its king was away at the coast',
        ],
        correctIndex: 1,
      },
      {
        id: 'de-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A company makes large profits by polluting the river that a town depends on. Which lesson from Denkyira applies?',
        options: [
          'Wealth gained without care for others can bring ruin',
          'Rich people never lose',
          'Gold should be left in the ground for ever',
        ],
        correctIndex: 0,
      },
      {
        id: 'de-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'Denkyira defeats Adansi and takes the gold fields',
          'Boa Amponsem rules and most forest states pay tribute',
          'Osei Tutu serves at the court of Denkyira',
          'Ntim Gyakari demands a basin of gold',
          'Asante defeats Denkyira at Feyiase',
        ],
      },
      {
        id: 'de-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'tribute',
        definition: 'Payment that a weaker state must give to a stronger one.',
        distractors: [
          'A gift exchanged between friends',
          'A path used by traders',
        ],
      },
    ],
    glossary: [
      {
        word: 'capital',
        definition: 'The chief town of a kingdom or country.',
        pages: [2],
      },
      {
        word: 'tribute',
        definition: 'Payment that a weaker state must give to a stronger one.',
        pages: [2, 3, 4],
      },
      {
        word: 'court',
        definition: 'The household and officials of a king.',
        pages: [3],
      },
      {
        word: 'conqueror',
        definition: 'A person who defeats and takes over a state.',
        pages: [3],
      },
      {
        word: 'tradition',
        definition: 'Beliefs, stories, and customs passed down from older people to younger ones.',
        pages: [4, 5],
      },
      {
        word: 'insult',
        definition: 'An act or word that shows deep disrespect.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B8.4.2.1.1, Strand 4: Law and Order, Sub-Strand 2: Conflict Prevention and Management (Examine ways of preventing and managing conflict in the community).',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: Dunkwa-on-Offin is in the Upper Denkyira East Municipality of the Central Region; Jukwa is in the Twifo-Hemang-Lower Denkyira District. Illegal mining (galamsey) has polluted the Offin; the comparison is deliberate. The stories of the basin and the board game are tradition.',
    ],
    reviewQuestions: [
      'Ask the Denkyira Traditional Council or a historian to confirm the account of Ntim Gyakari, which is told mainly from the Asante side.',
      'Check that the article is respectful of present-day Denkyira.',
    ],
    guide: {
      overview:
        'Tells the rise and fall of Denkyira as a study in wealth, tribute, and the danger of pride, linked to present-day care for land and rivers.',
      lessonMinutes: 45,
      goals: [
        'Explain how gold and trade made Denkyira powerful.',
        'Describe the tribute system and its effects.',
        'Retell the events leading to Feyiase.',
        'Draw a lesson about power and responsibility.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B8.4.2.1.1: Strand 4: Law and Order, Sub-Strand 2: Conflict Prevention and Management)', 'Denkyira and the causes of conflict'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years; simple fractions'],
      ],
      before: ['Ask: can a person or a country be too rich or too strong for its own good? How?'],
      during: ['After Page 3, discuss: was it wise for Denkyira to bring Osei Tutu to its court?'],
      after: ['Learners write the story of the brass basin from the point of view of one Asante chief.'],
      discussion: ['History is often written by the winners. How might a Denkyira elder tell this story differently?'],
      reflection: ['When have you asked for too much and lost what you already had?'],
      maths: [
        {
          task: 'Feyiase was fought in about 1701. How many years ago was that in 2026?',
          answer: '2026 − 1701 = 325 years.',
        },
        {
          task: 'A state must send one-tenth of its 250 ounces of gold as tribute. How much does it send?',
          answer: '250 ÷ 10 = 25 ounces.',
        },
      ],
      support: ['Use a bowl and stones to act out the filling of the basin.'],
      stretch: ['Find out about the old state of Adansi and why Akan tradition calls it a place of beginnings.'],
      localise: ['Is any river near you affected by mining or pollution? Who depends on it?'],
      factCheck: [
        {
          claim: 'Historical and curriculum verification',
          explanation: 'The rise of Denkyira after defeating Adansi, Boa Amponsem, Osei Tutu’s service at court, Ntim Gyakari, the battle of Feyiase (about 1701), and the later move south come from general historical knowledge; the basin and the board game are oral tradition. Confirm with a historian. The Social Studies code was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the choice of strand for this article is the writer’s judgement.',
          reference: 'NaCCA JHS Social Studies Curriculum (B7–B9) & Historical Record',
        },
      ],
    },
  }),

  // 5
  mk({
    key: 'akyem-abuakwa-the-kingdom-of-forest-and-rivers',
    title: 'Akyem Abuakwa: The Kingdom of Forest and Rivers',
    summary:
      'From their capital at Kyebi, the Akyem defended a land of forests, gold, and rivers. This article tells how they faced stronger neighbours, how a modern king built schools, and why their forest gives water to millions.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Fresh, clear, and thoughtful',
    palette: ['#166534', '#0369a1'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Light forest-like flute over soft drums (placeholder)',
    pages: [
      pg(
        '💧',
        'Turn on a tap in Accra and fill a cup. Some of that water began its journey as rain on a range of forested hills about ninety kilometres to the north, near the town of Kyebi. Three rivers rise in those hills: the Densu, the Ayensu, and the Birim. Together they supply water to millions of people. The hills are called the Atewa Range, and they lie in the heart of an old kingdom, Akyem Abuakwa. Its king is the Okyenhene. The story of this kingdom is a story about holding on to a precious land.',
        'Forest-covered hills in morning mist, with a clear stream running down between the trees.'
      ),
      pg(
        '🌲',
        'The Akyem are an Akan people. They formed three related states: Abuakwa, Kotoku, and Bosome. Abuakwa, the largest, built its capital at Kyebi, and its royal stool is named after an early king, Ofori Panin. The land was rich. Gold lay in the gravel of the Birim, and thick forest gave timber, game, and good soil. Cocoa later grew well here. But Akyem had powerful neighbours on both sides: Akwamu to the south-east, and later Asante to the north-west. To survive between them, the Akyem became known as stubborn and skilful fighters.',
        'A royal stool on a platform inside a palace hall, with a state sword leaning beside it.'
      ),
      pg(
        '🛡️',
        'For years Akwamu raided and bullied its neighbours. In 1730, the Akyem led an alliance that defeated Akwamu and drove its rulers across the Volta. Akyem Abuakwa gained wide new lands. The other struggle was harder. Asante wished to control the routes to the coast. Asante tradition says that in 1717 its first great king, Osei Tutu, was shot dead while crossing the River Pra during a war against the Akyem. Asante returned in 1742 and defeated them. The Akyem had to pay tribute for many years, but they never stopped resisting.',
        'Warriors with guns watching from a forested river bank as canoes cross the water.'
      ),
      pg(
        '🏫',
        'In 1912, a new kind of king came to the stool. Nana Ofori Atta I had been to school and had worked as a clerk. He believed that the future of his people lay in education. During his reign of more than thirty years he opened schools, including a secondary school at Kyebi. He sat on the council that advised the British governor and argued there for the rights of chiefs and people. His brother, J. B. Danquah, became a lawyer and scholar. It was Danquah who helped to found the first political party of the independence movement, in 1947.',
        'A king in cloth and sandals standing with pupils in front of a school building.'
      ),
      pg(
        '💎',
        'The riches under the soil have been a blessing and a danger. Diamonds were found in the Birim valley in the 1920s, and gold is still mined. In recent years, illegal mining has torn up farms and turned stretches of the Birim brown. The forest on the Atewa hills is threatened as well, because the hills hold bauxite, the ore from which aluminium is made. Scientists have found plants and animals there that live nowhere else in the world. The people of Akyem face a hard question: how to gain from what lies under the land without destroying it.',
        'A river that runs clear on one side and muddy brown on the other, with dug-up earth along the bank.'
      ),
      pg(
        '🌱',
        'The Akyem have long said that the land belongs to the dead, the living, and the countless numbers not yet born. A chief does not own it. He looks after it for all three. That old idea fits exactly with what scientists now call sustainability: using resources in a way that leaves enough for those who come after us. Each year, at the Ohum festival, the people give thanks for the land and its rivers. When you next drink a cup of water, think of the hills where it started, and of who is looking after them.',
        'Children planting tree seedlings on a hillside, with forest behind them.'
      ),
    ],
    activities: [
      {
        id: 'ay-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why does the Atewa Range matter to people far from Kyebi?',
        options: [
          'Three rivers that supply water to millions rise there',
          'It is the highest mountain in Africa',
          'It is where cocoa was first grown',
        ],
        correctIndex: 0,
      },
      {
        id: 'ay-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What happened in 1730?',
        options: [
          'Asante conquered Akyem',
          'The British built a fort at Kyebi',
          'An alliance led by the Akyem defeated Akwamu',
        ],
        correctIndex: 2,
      },
      {
        id: 'ay-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What is Nana Ofori Atta I best remembered for?',
        options: [
          'Discovering diamonds',
          'Promoting education and speaking for his people',
          'Moving the capital to Accra',
        ],
        correctIndex: 1,
      },
      {
        id: 'ay-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A community is offered money to let its forest be cleared. Using the Akyem idea about land, what question should it ask first?',
        options: [
          'How quickly can the trees be cut?',
          'What will be left for those not yet born?',
          'Who will get the largest share today?',
        ],
        correctIndex: 1,
      },
      {
        id: 'ay-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'The Akyem build their capital at Kyebi',
          'Osei Tutu is killed at the River Pra, according to tradition',
          'The Akyem and their allies defeat Akwamu',
          'Asante defeats the Akyem',
          'Nana Ofori Atta I becomes king',
        ],
      },
      {
        id: 'ay-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'sustainability',
        definition: 'Using resources in a way that leaves enough for people in the future.',
        distractors: [
          'Selling resources as fast as possible',
          'Keeping all land for the chief',
        ],
      },
    ],
    glossary: [
      {
        word: 'capital',
        definition: 'The chief town of a kingdom or country.',
        pages: [2],
      },
      {
        word: 'alliance',
        definition: 'An agreement between states or groups to help one another.',
        pages: [3],
      },
      {
        word: 'tribute',
        definition: 'Payment that a weaker state must give to a stronger one.',
        pages: [3],
      },
      {
        word: 'reign',
        definition: 'The period during which a king or queen rules.',
        pages: [4],
      },
      {
        word: 'bauxite',
        definition: 'The ore from which aluminium is made.',
        pages: [5],
      },
      {
        word: 'sustainability',
        definition: 'Using resources in a way that leaves enough for people in the future.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.3.3.1.1, Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity (Assess the significance of symbols, music and ceremonies in promoting national identity).',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: Kyebi (Kibi) is the capital of the East Akim Municipality in the Eastern Region. The Atewa Range Forest Reserve is the source of the Densu, Ayensu, and Birim. Mining in and around Atewa is a live public debate; the article describes the question without taking a political side.',
    ],
    reviewQuestions: [
      'Ask the Okyeman Traditional Council or a historian to confirm the dates and the account of Osei Tutu’s death, which traditions tell differently.',
      'Check that Page 5 stays factual and balanced on mining.',
    ],
    guide: {
      overview:
        'Presents Akyem Abuakwa as a kingdom that defended a rich land, valued education, and now faces questions of sustainability.',
      lessonMinutes: 45,
      goals: [
        'Locate Kyebi and the Atewa Range and explain their importance for water.',
        'Describe Akyem’s struggles with Akwamu and Asante.',
        'Explain the contribution of Nana Ofori Atta I.',
        'Apply the idea of stewardship of land to present-day choices.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Akyem Abuakwa: heritage and stewardship of the land'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years'],
      ],
      before: ['Ask: where does the water in our taps or wells come from? Who looks after that place?'],
      during: ['After Page 5, list the benefits and the costs of mining on the board.'],
      after: ['Learners write a short letter to a future child, promising one thing they will protect.'],
      discussion: ['Can a country use its minerals and keep its forests and rivers? What would have to be done?'],
      reflection: ['What do you use every day that someone before you protected for you?'],
      maths: [
        {
          task: 'Nana Ofori Atta I ruled from 1912 to 1943. How long was his reign?',
          answer: '1943 − 1912 = 31 years.',
        },
        {
          task: 'Akwamu was defeated in 1730 and the Akyem were defeated by Asante in 1742. How many years lay between?',
          answer: '1742 − 1730 = 12 years.',
        },
      ],
      support: ['Trace the three rivers on a map of southern Ghana from the hills to the sea.'],
      stretch: ['Find out what bauxite is used for and where else in Ghana it is found.'],
      localise: ['Find the source of the stream or river nearest to your school. Is it protected?'],
      factCheck: [
        {
          claim: 'Historical and curriculum verification',
          explanation: 'The defeat of Akwamu (1730), the tradition of Osei Tutu’s death at the Pra (1717), the Asante victory of 1742, the reign of Nana Ofori Atta I (1912 to 1943), J. B. Danquah’s part in founding a political party in 1947, the diamond finds of the 1920s, and the rivers rising in Atewa come from general knowledge and should be confirmed by a historian. The Social Studies code was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the choice of strand for this article is the writer’s judgement.',
          reference: 'NaCCA JHS Social Studies Curriculum (B7–B9) & Historical Record',
        },
      ],
    },
  }),

  // 6
  mk({
    key: 'nzema-kings-water-villages-and-a-philosopher',
    title: 'Nzema: Kings, a Village on Water, and a Philosopher',
    summary:
      'In the far south-west, the Nzema built a kingdom beside lagoons and the sea. This article tells of King Kaku Aka, the stilt village of Nzulezo, the Kundum festival, and two famous sons of Nzema.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Light, clear, and full of wonder',
    palette: ['#0e7490', '#15803d'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Gentle paddling rhythm with soft bells (placeholder)',
    pages: [
      pg(
        '🛶',
        'From the village of Beyin, a canoe takes you inland along a narrow channel through reeds and raffia palms. After nearly an hour, the channel opens into a wide, dark lake. Ahead, a whole village stands on the water. Houses, a school, a church, and a single main street all rest on wooden stilts. Children paddle to class. This is Nzulezo, whose name means on the surface of the water. It is one of the wonders of Nzemaland, the home of the Nzema people in the south-western corner of Ghana.',
        'A village of wooden houses on stilts above dark lake water, with canoes tied beside a raised walkway.'
      ),
      pg(
        '🐌',
        'How did a village come to be built on a lake? Tradition says that the ancestors of Nzulezo fled from enemies in a land far to the north. They were guided by a snail, which led them from place to place until they reached this lake, where no attacker could come near without being seen. The rest of the Nzema lived along the coast and beside the lagoons. They fished and farmed coconuts and oil palms. They also traded with European ships. In the 1700s, the British built a small fort at Beyin and named it Apollonia.',
        'A white fort with a courtyard standing just behind a beach lined with coconut palms.'
      ),
      pg(
        '👑',
        'The Nzema kingdom reached its height in the 1830s and 1840s under a king named Kaku Aka. He was a strong and feared ruler who controlled trade along his coast and would not take orders from the British at Cape Coast. The British accused him of cruelty and of breaking agreements. In 1848, they sent an armed force against him. Kaku Aka was captured and taken to Cape Coast Castle, where he died a prisoner. After his fall, the kingdom was divided into eastern and western Nzema, each with its own chiefs.',
        'A king in rich cloth seated under an umbrella on a beach, with trading ships anchored offshore.'
      ),
      pg(
        '🥁',
        'Each year, the Nzema and their Ahanta neighbours celebrate the Kundum festival. It moves along the coast from town to town over several weeks. Tradition says that a hunter once saw forest spirits dancing in a circle and brought the dance home. Kundum gives thanks for the harvest and drives out evil from the town. For some days, people may sing songs that mock those who have done wrong, including chiefs. Drummers play through the night, and families who have quarrelled are expected to make peace before the feast. It is a time of joy and of judgement.',
        'Dancers in raffia skirts moving in a circle round drummers at night, lit by firelight.'
      ),
      pg(
        '🎓',
        'Nzemaland has given the world two remarkable men. Around 1703, a boy was born near Axim and taken to Europe as a small child. He was given the name Anton Wilhelm Amo. He studied law and philosophy, and he became a lecturer at universities in Germany. He was the first African known to have done so. He later returned home. Two centuries after him, in 1909, a boy was born at Nkroful to a goldsmith and a trader. His name was Kwame Nkrumah. In 1957, he led the Gold Coast to independence as Ghana.',
        'A statue of a man in eighteenth-century dress holding a book, beside a modern memorial with a tall figure pointing forward.'
      ),
      pg(
        '🌿',
        'Today the fort at Beyin is a museum of Nzema history, and the wetland around Nzulezo is protected for its birds, monkeys, and turtles. Visitors pay to see the village, and the money helps the community. Oil and gas are now produced off the Nzema coast, which brings both jobs and new worries for fishermen. The Nzema story is a reminder that a small people in a far corner of the country can shape the whole nation. It is also a reminder to look after the places that make such a people who they are.',
        'A boardwalk through a green wetland, with a kingfisher perched on a post and a canoe passing below.'
      ),
    ],
    activities: [
      {
        id: 'nz-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What does the name Nzulezo mean?',
        options: [
          'The town of the king',
          'On the surface of the water',
          'The place of gold',
        ],
        correctIndex: 1,
      },
      {
        id: 'nz-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What happened to King Kaku Aka in 1848?',
        options: [
          'He was captured by a British force and died a prisoner',
          'He conquered Cape Coast',
          'He moved his capital to Axim',
        ],
        correctIndex: 0,
      },
      {
        id: 'nz-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Who was Anton Wilhelm Amo?',
        options: [
          'The builder of Fort Apollonia',
          'A king of Nzema',
          'A man born near Axim who became a university lecturer in Germany',
        ],
        correctIndex: 2,
      },
      {
        id: 'nz-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Tourists pay to visit Nzulezo. What is the best way to make sure this helps the village for many years?',
        options: [
          'Allow as many visitors as possible and clear the wetland for hotels',
          'Use the money for the community and protect the lake and wetland',
          'Stop all visits',
        ],
        correctIndex: 1,
      },
      {
        id: 'nz-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'Anton Wilhelm Amo is born near Axim',
          'The British build a fort at Beyin',
          'King Kaku Aka is captured',
          'Kwame Nkrumah is born at Nkroful',
          'Ghana becomes independent',
        ],
      },
      {
        id: 'nz-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'wetland',
        definition: 'Land that is covered with shallow water for much of the year.',
        distractors: [
          'A field cleared for farming',
          'A dry, rocky hill',
        ],
      },
    ],
    glossary: [
      {
        word: 'stilts',
        definition: 'Tall posts that hold a building above water or ground.',
        pages: [1],
      },
      {
        word: 'tradition',
        definition: 'Beliefs, stories, and customs passed down from older people to younger ones.',
        pages: [2, 4],
      },
      {
        word: 'ancestors',
        definition: 'Family members who lived long ago.',
        pages: [2],
      },
      {
        word: 'lagoons',
        definition: 'Stretches of shallow water separated from the sea by land.',
        pages: [2],
      },
      {
        word: 'philosophy',
        definition: 'The study of deep questions about knowledge, truth, and how to live.',
        pages: [5],
      },
      {
        word: 'wetland',
        definition: 'Land that is covered with shallow water for much of the year.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.3.3.1.1, Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity (Assess the significance of symbols, music and ceremonies in promoting national identity).',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: Beyin, Nzulezo, and Nkroful are in the Western Region (Jomoro and Ellembelle). Fort Apollonia at Beyin houses a museum of Nzema culture. Nzulezo stands on Lake Amansuri (Tadane). The snail story is oral tradition.',
    ],
    reviewQuestions: [
      'Ask the Nzema traditional councils or a historian to confirm the account of Kaku Aka, which British and Nzema sources tell differently.',
      'Confirm Amo’s birthplace and dates, which are approximate.',
    ],
    guide: {
      overview:
        'Introduces Nzemaland through Nzulezo, King Kaku Aka, the Kundum festival, and two notable sons, with a note on protecting heritage.',
      lessonMinutes: 45,
      goals: [
        'Describe Nzulezo and retell the tradition of its founding.',
        'Outline the rise and fall of King Kaku Aka.',
        'Explain what the Kundum festival is for.',
        'Name two famous people from Nzemaland and what each achieved.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Nzema history, festival, and identity'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years'],
      ],
      before: ['Ask: could people live their whole lives on water? What would be easy and what would be hard?'],
      during: ['After Page 2, list the advantages and problems of a village on stilts.'],
      after: ['Learners write a postcard from Nzulezo describing a school day there.'],
      discussion: ['Was Kaku Aka a tyrant, as the British said, or a king defending his independence? Can both be partly true?'],
      reflection: ['What place makes your people who they are? How is it being looked after?'],
      maths: [
        {
          task: 'Amo was born in about 1703 and Nkrumah in 1909. How many years separate their births?',
          answer: '1909 − 1703 = 206 years.',
        },
        {
          task: 'A canoe carries 8 visitors. How many canoes are needed for a class of 44 pupils and 4 teachers?',
          answer: '48 ÷ 8 = 6 canoes.',
        },
      ],
      support: ['Show a photograph of Nzulezo and let learners point out the school, the street, and the canoes.'],
      stretch: ['Find out what subjects Anton Wilhelm Amo wrote about and why he is honoured in Germany today.'],
      localise: ['Which famous person came from your district? Find out where they were born and what they did.'],
      factCheck: [
        {
          claim: 'Historical and curriculum verification',
          explanation: 'The founding tradition of Nzulezo, Fort Apollonia (built by the British in the late 1760s), Kaku Aka’s capture in 1848, the Kundum festival, Amo’s birth near Axim about 1703 and his career in Germany, and Nkrumah’s birth at Nkroful in 1909 come from general knowledge and should be confirmed by a historian. The Social Studies code was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the choice of strand for this article is the writer’s judgement.',
          reference: 'NaCCA JHS Social Studies Curriculum (B7–B9) & Historical Record',
        },
      ],
    },
  }),

  // 7
  mk({
    key: 'ahanta-the-king-who-came-home',
    title: 'Ahanta: The King Who Came Home',
    summary:
      'An Ahanta king who fought the Dutch in 1837 was executed, and his head was taken to Europe. This article tells the story of Badu Bonsu II, the old treaty behind the quarrel, and his return 170 years later.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Quiet, serious, and respectful',
    palette: ['#1e3a8a', '#b45309'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Slow, solemn drums with a single horn (placeholder)',
    pages: [
      pg(
        '✈️',
        'In July 2009, an aeroplane from the Netherlands landed in Accra carrying an unusual passenger. A group of chiefs from the Western Region, dressed in the dark red and black cloth of mourning, had travelled to Europe to bring him home. He was their king, Badu Bonsu II of Ahanta, and he had been dead for more than 170 years. For all that time, his head had been kept in a glass jar in a Dutch university. How it came to be there, and how it came back, is a story every Ghanaian should know.',
        'Chiefs in dark mourning cloth walking down the steps of an aeroplane, one carrying a covered box.'
      ),
      pg(
        '🏝️',
        'The Ahanta live along the beautiful coast between Sekondi-Takoradi and Axim. Their old capital was Busua. Cape Three Points, the most southerly tip of Ghana, lies in their land. In 1656, the Ahanta chiefs signed a treaty with the Dutch at the town of Butre. In it, they placed themselves under Dutch protection, and the Dutch built a fort on the hill there. For nearly two hundred years, the treaty was kept. The Ahanta governed themselves, and the Dutch traded. Few agreements between Africans and Europeans lasted so long. It is remembered as the Treaty of Butre.',
        'A small stone fort on a green hill above a curved bay with fishing canoes on the sand.'
      ),
      pg(
        '⚡',
        'By the 1830s, things had changed. The Dutch were behaving less like partners and more like masters. In 1837, they quarrelled with King Badu Bonsu II. Dutch officials tried to call him to account and marched to his town. The king refused to be ordered about in his own land. There was fighting, and two Dutch officials were killed. To the Ahanta, the king was defending his people’s rights. To the Dutch, he was a rebel who had to be made an example of. They sent for soldiers and warships.',
        'A king seated under an umbrella with his elders, facing a small group of uniformed officials.'
      ),
      pg(
        '⚓',
        'In 1838, a Dutch force landed. The Ahanta fought, but they were defeated. Badu Bonsu II was captured, put on trial by the Dutch, and hanged. His body was then treated with great disrespect. A doctor removed the head and sent it to the Netherlands, where scientists of that time collected human remains from other parts of the world to study them. The Dutch also ended the Ahanta kingship and ruled the area more directly. Many Ahanta were sent away as prisoners. The people were left without a king and without his body to bury.',
        'Warships anchored off a palm-lined shore under a dark sky.'
      ),
      pg(
        '🔎',
        'The jar stayed on a shelf in a medical collection in the Dutch city of Leiden. For many years, nobody outside knew of it. Then a Dutch writer who was researching a book about Ghana learned that it was there. The news reached Ghana, and in 2008 the government asked for the king’s return. The Dutch government agreed and expressed its regret. In 2009, Ahanta chiefs went to the Netherlands. They held a ceremony, poured libation, and received the head of their king. The promise of protection made at Butre had been broken long before. Now, at least, one wrong was put right.',
        'Elders pouring libation from a small glass in a formal hall while officials stand respectfully.'
      ),
      pg(
        '🕯️',
        'Why does this matter today? In our traditions, a person who has not been properly buried is not at rest, and neither are his people. All over the world, museums and universities are now being asked to return human remains and sacred objects that were taken in colonial times. Each return allows people to tell their own history and to mourn in their own way. The Ahanta waited patiently and asked firmly, and they were heard. Dignity can be delayed for a very long time, but it should never be given up.',
        'A quiet palace courtyard with a draped stool and a lit lamp beside it.'
      ),
    ],
    activities: [
      {
        id: 'ah-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What did the Treaty of Butre do in 1656?',
        options: [
          'It placed the Ahanta under Dutch protection',
          'It sold Ahanta land to the British',
          'It ended the slave trade',
        ],
        correctIndex: 0,
      },
      {
        id: 'ah-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did the quarrel of 1837 begin?',
        options: [
          'The Ahanta attacked a Dutch ship',
          'There was a famine',
          'The Dutch were acting as masters, and the king refused to be ordered about',
        ],
        correctIndex: 2,
      },
      {
        id: 'ah-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did Ghana learn where the king’s head was?',
        options: [
          'It was shown on Dutch television every year',
          'A Dutch writer researching a book found out and the news reached Ghana',
          'The Ahanta chiefs had always known',
        ],
        correctIndex: 1,
      },
      {
        id: 'ah-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A museum abroad holds a sacred stool taken from a Ghanaian town in colonial times. Following the Ahanta example, what should the town do?',
        options: [
          'Forget about it',
          'Ask firmly and respectfully, through the proper channels, for its return',
          'Take something from the museum in exchange',
        ],
        correctIndex: 1,
      },
      {
        id: 'ah-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'The Ahanta and the Dutch sign a treaty at Butre',
          'King Badu Bonsu II quarrels with Dutch officials',
          'The king is captured and executed',
          'Ghana asks the Netherlands to return the king’s head',
          'Ahanta chiefs bring their king home',
        ],
      },
      {
        id: 'ah-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'treaty',
        definition: 'A written agreement between states or peoples.',
        distractors: [
          'A fort built on a hill',
          'A journey by sea',
        ],
      },
    ],
    glossary: [
      {
        word: 'mourning',
        definition: 'Showing sorrow for someone who has died.',
        pages: [1],
      },
      {
        word: 'treaty',
        definition: 'A written agreement between states or peoples.',
        pages: [2],
      },
      {
        word: 'protection',
        definition: 'Keeping someone safe from harm.',
        pages: [2, 5],
      },
      {
        word: 'rebel',
        definition: 'A person who fights against those in power.',
        pages: [3],
      },
      {
        word: 'libation',
        definition: 'A drink poured out while calling on God and the ancestors.',
        pages: [5],
      },
      {
        word: 'dignity',
        definition: 'The respect that every person deserves.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.3.3.1.1, Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity (Assess the significance of symbols, music and ceremonies in promoting national identity).',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: Busua, Butre, and Cape Three Points are in the Ahanta West Municipality of the Western Region. Fort Batenstein stands at Butre. This article deals with an execution and the treatment of human remains; it is written plainly and without graphic detail, and should be taught with respect.',
    ],
    reviewQuestions: [
      'Ask the Ahanta Traditional Council or a historian to confirm the events of 1837 and 1838, which Dutch and Ahanta accounts tell differently.',
      'Decide with the school whether this article suits the youngest JHS learners.',
    ],
    guide: {
      overview:
        'Tells the story of King Badu Bonsu II, from the Treaty of Butre to his execution and the return of his head in 2009, as a study in dignity and the repair of historical wrongs.',
      lessonMinutes: 45,
      goals: [
        'Describe the Treaty of Butre and why it mattered.',
        'Explain the quarrel of 1837 from both points of view.',
        'Retell how the king’s head was found and returned.',
        'Discuss why the return of remains and sacred objects matters.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Ahanta, colonial rule, and the return of heritage'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years'],
      ],
      before: ['Ask: why is a proper burial so important in our communities?'],
      during: ['After Page 3, write two headlines for the events of 1837: one Ahanta, one Dutch.'],
      after: ['Learners write a short speech that a chief might have given on the king’s return.'],
      discussion: ['Can a wrong done long ago ever be put right? What would be needed?'],
      reflection: ['What does dignity mean to you? When have you seen it respected or denied?'],
      maths: [
        {
          task: 'The Treaty of Butre was signed in 1656. The quarrel broke out in 1837. For how many years had the treaty been kept?',
          answer: '1837 − 1656 = 181 years.',
        },
        {
          task: 'The king was executed in 1838 and returned in 2009. How many years was he away?',
          answer: '2009 − 1838 = 171 years.',
        },
      ],
      support: ['Tell the story with a simple four-point timeline: treaty, quarrel, loss, return.'],
      stretch: ['Find out about another object or person returned to Ghana from a museum abroad.'],
      localise: ['Is there anything from your area that is kept in a museum elsewhere? How could you find out?'],
      factCheck: [
        {
          claim: 'Historical and curriculum verification',
          explanation: 'The Treaty of Butre (1656), the conflict of 1837 and the king’s execution in 1838, the keeping of his head in a medical collection at Leiden, Ghana’s request in 2008, and the return in July 2009 come from general knowledge and should be confirmed by a historian. Details of the quarrel differ between Dutch and Ahanta accounts. The Social Studies code was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the choice of strand for this article is the writer’s judgement.',
          reference: 'NaCCA JHS Social Studies Curriculum (B7–B9) & Historical Record',
        },
      ],
    },
  }),

  // 8
  mk({
    key: 'the-krobo-the-people-of-the-mountain',
    title: 'The Krobo: The People of the Mountain',
    summary:
      'For centuries, the Krobo lived in stone towns on top of a steep mountain. This article tells how the mountain protected them, how they spread across the land without war, how they stood up to an unfair fine, and why they return each year.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Steady, proud, and clear',
    palette: ['#b45309', '#1e40af'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Klama-style drums and rattles, even and warm (placeholder)',
    pages: [
      pg(
        '🏔️',
        'On the road from Tema to Akosombo, just before Akuse junction, a single mountain rises steeply from the flat Accra plains. Its sides are almost cliffs. Baboons live among its rocks. On most days nobody is there. But each year, in October and November, thousands of people in fine cloth and strings of glass beads climb its paths. They visit the stone remains of houses, pour libation, and tell their children: this is where we come from. They are the Krobo, and for about five hundred years this mountain was their home.',
        'A steep, lone mountain rising from flat grassland, with a line of people climbing a path up its side.'
      ),
      pg(
        '🧱',
        'The Krobo are a Dangme people, related to the Ga. Tradition says that their ancestors came from the east and, looking for a safe place, chose the mountain. They called it Klowem. On its top they built towns of stone houses with narrow lanes between them. The steep slopes made a natural fortress, and the few paths were easy to defend. Asante and Akwamu armies tried to take the mountain and failed. The people were led at first by priests. Later, chiefs called konors ruled two divisions: Manya Krobo and Yilo Krobo.',
        'Stone houses with thatched roofs crowded along a narrow lane on a mountain top.'
      ),
      pg(
        '🌴',
        'A mountain top has little farmland, so the Krobo farmed the plains below and returned home to the mountain. As their numbers grew, they needed more land. They did not go to war for it. Groups of families put their money together and bought long strips of forest land from their Akan neighbours. They cleared it, planted it, and then bought the next strip. This system was called huza. In this way the Krobo spread north and west and became great producers of palm oil, which factories in Europe wanted for soap and for oiling machines.',
        'Long, narrow strips of farmland side by side, planted with oil palms, running back from a road.'
      ),
      pg(
        '✊',
        'By the 1850s, the British controlled the coast and wished to tax the people. The Krobo refused to pay, and soldiers were sent. The British then fined the Krobo a huge sum, and told them to pay it in palm oil, sold to chosen merchants at a low price. The Krobo answered in a way their rulers did not expect. They stopped selling palm oil altogether. For several years they sent their oil by other routes or kept it at home. The merchants lost money, and in the end the government had to give up the scheme.',
        'Rows of large clay pots of palm oil standing unsold in a village yard.'
      ),
      pg(
        '📣',
        'The mountain towns worried the colonial government. It could not easily watch what went on there, and missionaries disliked the old religious rites. In 1892, the governor gave an order: everyone must leave the mountain within three days. Soldiers then destroyed the houses. It was a bitter day. The Krobo carried what they could down to their farm villages on the plain. These grew into the towns of Odumase and Somanya. They had lost their home, but they had not lost their land, their language, or their skills, and they prospered.',
        'Families carrying loads down a steep mountain path towards the plain below.'
      ),
      pg(
        '📿',
        'Today the Krobo are famous for glass beads. Bead makers crush old bottles, fill clay moulds with the powder, and fire them in ovens to make beads of every colour. The beads are worn at festivals and at the ceremonies that mark a girl’s passage into womanhood. And every year the people climb Klowem again: Manya Krobo for the Ngmayem festival and Yilo Krobo for Kloyosikplem. Their history shows three ways to be strong without an army: choose your ground wisely, pool your money and buy, and when treated unfairly, refuse together.',
        'Strings of brightly coloured glass beads laid out on a market table beside clay moulds.'
      ),
    ],
    activities: [
      {
        id: 'kr-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why did the Krobo choose to live on the mountain?',
        options: [
          'The soil on top was the best for farming',
          'Its steep sides made it easy to defend',
          'It was close to the sea',
        ],
        correctIndex: 1,
      },
      {
        id: 'kr-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'How did the Krobo gain more farmland?',
        options: [
          'Groups of families pooled their money and bought land strip by strip',
          'They conquered their neighbours',
          'The British gave it to them',
        ],
        correctIndex: 0,
      },
      {
        id: 'kr-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did the Krobo respond to the unfair fine?',
        options: [
          'They paid it at once',
          'They attacked the coast forts',
          'They refused to sell palm oil until the scheme was dropped',
        ],
        correctIndex: 2,
      },
      {
        id: 'kr-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Ten farmers each have too little money to buy a tractor. Which Krobo idea could help them?',
        options: [
          'Each should wait until he is rich',
          'Pool their money, buy one together, and share its use',
          'Borrow a tractor without asking',
        ],
        correctIndex: 1,
      },
      {
        id: 'kr-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'The Krobo settle on the mountain',
          'Asante and Akwamu fail to capture it',
          'Krobo families buy farmland strip by strip',
          'The Krobo refuse to sell palm oil',
          'The governor orders everyone off the mountain',
        ],
      },
      {
        id: 'kr-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'huza',
        definition: 'The Krobo system in which families join together to buy and farm land in strips.',
        distractors: [
          'A festival held on the mountain',
          'A tax paid in palm oil',
        ],
      },
    ],
    glossary: [
      {
        word: 'libation',
        definition: 'A drink poured out while calling on God and the ancestors.',
        pages: [1],
      },
      {
        word: 'tradition',
        definition: 'Beliefs, stories, and customs passed down from older people to younger ones.',
        pages: [2],
      },
      {
        word: 'fortress',
        definition: 'A place that is strongly protected against attack.',
        pages: [2],
      },
      {
        word: 'huza',
        definition: 'The Krobo system in which families join together to buy and farm land in strips.',
        pages: [3],
      },
      {
        word: 'fined',
        definition: 'Ordered to pay money as a punishment.',
        pages: [4],
      },
      {
        word: 'rites',
        definition: 'Ceremonies carried out in a fixed, traditional way.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.3.3.1.1, Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity (Assess the significance of symbols, music and ceremonies in promoting national identity).',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: Krobo Mountain (Klowem) stands near Akuse junction in the Eastern Region. Odumase is the seat of Manya Krobo and Somanya of Yilo Krobo. Ngmayem and Kloyosikplem include the yearly climb. The initiation rite for girls is mentioned once, without detail.',
    ],
    reviewQuestions: [
      'Ask the Manya Krobo and Yilo Krobo traditional councils or a historian to confirm dates, especially the palm-oil boycott (late 1850s to 1860s) and the 1892 eviction.',
      'Confirm the spelling of Klowem, Ngmayem, and Kloyosikplem with a Dangme speaker.',
    ],
    guide: {
      overview:
        'Presents the Krobo as a people who protected themselves by geography, expanded by cooperative purchase, and resisted by economic boycott.',
      lessonMinutes: 45,
      goals: [
        'Explain why the Krobo lived on the mountain and how it protected them.',
        'Describe the huza system.',
        'Retell the palm-oil boycott and the eviction of 1892.',
        'Identify three peaceful sources of strength in Krobo history.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Krobo heritage, cooperation, and identity'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Multiplication and division; sharing costs'],
      ],
      before: ['Ask: how can a people be strong without a big army?'],
      during: ['After Page 3, draw a huza: a road with long strips of land running back from it.'],
      after: ['Learners plan a class “huza”: something the class could buy together and how costs would be shared.'],
      discussion: ['Was refusing to sell palm oil a better answer than fighting? What made it work?'],
      reflection: ['What place would you take your own children to and say, “This is where we come from”?'],
      maths: [
        {
          task: 'Twelve families each pay 250 cedis towards a strip of land. What is the price of the land?',
          answer: '12 × 250 = 3,000 cedis.',
        },
        {
          task: 'A strip of land 60 metres wide is shared equally among 12 families. How wide is each family’s share?',
          answer: '60 ÷ 12 = 5 metres.',
        },
      ],
      support: ['Bring glass beads and let learners sort them by colour and size while listening.'],
      stretch: ['Find out how recycled-glass beads are made, step by step, and draw the process.'],
      localise: ['Is there a hill, rock, or grove that your people regard as their first home? Find out its story.'],
      factCheck: [
        {
          claim: 'Historical and curriculum verification',
          explanation: 'The settlement on Krobo Mountain, the failed attacks by Akwamu and Asante, the huza system, the palm-oil boycott (about 1858 to 1866), and the eviction ordered by the governor in 1892 come from general historical knowledge and should be confirmed by a historian. Early dates are estimates. The Social Studies code was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the choice of strand for this article is the writer’s judgement.',
          reference: 'NaCCA JHS Social Studies Curriculum (B7–B9) & Historical Record',
        },
      ],
    },
  }),

  // 9
  mk({
    key: 'the-inland-ewe-states-many-towns-one-voice',
    title: 'The Inland Ewe States: Many Towns, One Voice',
    summary:
      'In the hills east of the Volta, the Ewe lived in many small states. This article tells how they united to win their freedom, how their language came to be written, and how a vote in 1956 joined their land to Ghana.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Even, clear, and thoughtful',
    palette: ['#15803d', '#7c3aed'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Borborbor-style drums and bugle, gentle and bright (placeholder)',
    pages: [
      pg(
        '🗳️',
        'On the ninth of May 1956, people lined up in towns and villages across the hills east of the River Volta. Each voter was given a paper and two choices. One was to join their land to the Gold Coast, which was about to become independent. The other was to stay apart for the time being, under the United Nations. Farmers, teachers, traders, and chiefs all voted. The result changed the map of West Africa and made this land a part of Ghana. To see why such a vote was needed, we must follow the story of the inland Ewe.',
        'A queue of men and women outside a small polling station in a hill town, each holding a slip of paper.'
      ),
      pg(
        '🏘️',
        'When the Ewe left Notsie, some went to the coast and founded Anlo. Others settled in the forested hills and valleys further north. They did not form one kingdom. Each group built its own small state, with its own chief and elders: Peki, Ho, Kpando, Hohoe, and many more. A chief could not simply give orders. He had to listen to his elders and to the people, and a chief who ruled badly could be removed. The states were independent of one another, but they shared a language, a faith, and the memory of Notsie.',
        'Several small towns among green hills, each with a meeting shed and a large shade tree at its centre.'
      ),
      pg(
        '⛓️',
        'Small states are easy to bully. After 1730, the kingdom of Akwamu settled on the eastern bank of the Volta and forced the inland Ewe to pay tribute. This lasted for about a hundred years. Then the states found a leader in Kwadzo Dei, the chief of Peki. In 1833, he brought many of them together in an alliance. Their combined army defeated Akwamu, and the tribute ended. Later, in 1869, an Asante army invaded and did great damage. Again the states had to stand together, and after some years the invaders withdrew.',
        'Chiefs from several towns clasping hands in a circle, with their people gathered behind them.'
      ),
      pg(
        '✏️',
        'In 1847, a German missionary arrived at Peki at the invitation of its chief and opened a school. More followed. The missionaries learned Ewe, worked out a way of writing it, and printed books in it. Ewe teachers and pastors were trained, and schools spread through the hills. By the early 1900s, the whole Bible had been translated. A written language did more than spread a religion. It allowed people in different towns to read the same words. It gave the Ewe a new sense of being one people, even though they had many chiefs.',
        'A teacher writing Ewe words on a blackboard for pupils seated on benches in an open-sided school.'
      ),
      pg(
        '🗺️',
        'Then came lines on a map. In 1884, Germany claimed the land east of the Volta hills and called it Togoland. The western Ewe were under Britain. After the First World War, Togoland was itself divided between Britain and France. So the Ewe were split by borders that they had not drawn, and families found themselves in different countries. Many wanted all Ewe lands to be joined together. Others thought it wiser to join the Gold Coast. In the vote of 1956, the majority in British Togoland chose union. In the Ewe south, most voted against it.',
        'A map of the Volta area with two dotted border lines drawn through a region shaded in one colour.'
      ),
      pg(
        '🤲',
        'British Togoland became part of Ghana at independence in 1957. It is now the Volta and Oti Regions, with parts of others. The borders remain, but so do the ties across them. People still cross to trade, to marry, and to attend funerals. Each year, the Asogli people of Ho celebrate a yam festival that brings together relatives from Ghana, Togo, and Benin. The inland Ewe showed that people do not need a single king to act as one. They need a shared language, the habit of talking things through, and respect for a fair vote.',
        'A festival procession carrying yams and wearing woven cloth through the streets of a hill town.'
      ),
    ],
    activities: [
      {
        id: 'ew-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'How were the inland Ewe governed?',
        options: [
          'By one powerful king',
          'By many small states, each with a chief who had to listen to elders and people',
          'By governors sent from Anlo',
        ],
        correctIndex: 1,
      },
      {
        id: 'ew-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Kwadzo Dei of Peki achieve in 1833?',
        options: [
          'He united many states and defeated Akwamu',
          'He translated the Bible',
          'He signed a treaty with Germany',
        ],
        correctIndex: 0,
      },
      {
        id: 'ew-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did writing the Ewe language matter so much?',
        options: [
          'It made the chiefs richer',
          'It ended all wars',
          'People in different towns could read the same words and feel united as one',
        ],
        correctIndex: 2,
      },
      {
        id: 'ew-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: In a class vote on where to go for an excursion, your choice loses. Following the lesson of the article, what should you do?',
        options: [
          'Refuse to go',
          'Accept the result of a fair vote, and take part',
          'Demand a new vote every day',
        ],
        correctIndex: 1,
      },
      {
        id: 'ew-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'The inland Ewe found many small states',
          'Akwamu forces them to pay tribute',
          'Kwadzo Dei leads the alliance that defeats Akwamu',
          'Germany claims Togoland',
          'The people of British Togoland vote to join the Gold Coast',
        ],
      },
      {
        id: 'ew-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'alliance',
        definition: 'An agreement between states or groups to help one another.',
        distractors: [
          'A border between two countries',
          'A school opened by missionaries',
        ],
      },
    ],
    glossary: [
      {
        word: 'independent',
        definition: 'Free to govern itself.',
        pages: [1, 2],
      },
      {
        word: 'elders',
        definition: 'Older, respected members of a community.',
        pages: [2],
      },
      {
        word: 'tribute',
        definition: 'Payment that a weaker state must give to a stronger one.',
        pages: [3],
      },
      {
        word: 'alliance',
        definition: 'An agreement between states or groups to help one another.',
        pages: [3],
      },
      {
        word: 'missionary',
        definition: 'A person sent to another land to teach a religion.',
        pages: [4],
      },
      {
        word: 'majority',
        definition: 'More than half of those who vote.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.4.5.3.1, Strand 4: Law and Order, Sub-Strand 5: Promoting Democracy and Political Stability (Assess the significance of political stability in national development).',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: Peki, Ho, Kpando, and Hohoe are in the Volta Region. The Asogli Yam Festival (Te Za) is held at Ho. The 1956 vote and its result are still discussed with feeling; the article reports the outcome neutrally, including that most voters in the Ewe south opposed union.',
    ],
    reviewQuestions: [
      'Ask an Ewe historian to confirm the account of Kwadzo Dei and the dates of the Asante invasion.',
      'Read Pages 5 and 6 with care and keep the neutral wording about the vote.',
    ],
    guide: {
      overview:
        'Follows the inland Ewe from many independent states through alliance, literacy, colonial partition, and the 1956 vote that joined British Togoland to Ghana.',
      lessonMinutes: 45,
      goals: [
        'Describe how the inland Ewe states were governed.',
        'Explain how alliance ended Akwamu rule.',
        'Explain the importance of a written Ewe language.',
        'Outline how colonial borders divided the Ewe and what was decided in 1956.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.4.5.3.1: Strand 4: Law and Order, Sub-Strand 5: Promoting Democracy and Political Stability)', 'The inland Ewe: alliance, borders, and a peaceful vote'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years; percentages'],
      ],
      before: ['Ask: what makes people feel that they are one people: a king, a language, a land, or something else?'],
      during: ['After Page 5, draw the two colonial borders on an outline map and shade where the Ewe live.'],
      after: ['Hold a class vote on a real question, count it openly, and discuss how the losing side should respond.'],
      discussion: ['Borders in Africa were drawn by outsiders. Should they be changed, or should people find ways to live across them?'],
      reflection: ['Have you ever had to accept a decision you voted against? How did you handle it?'],
      maths: [
        {
          task: 'Akwamu began to rule the inland Ewe after 1730 and was defeated in 1833. About how long did its rule last?',
          answer: '1833 − 1730 = 103 years.',
        },
        {
          task: 'In a village, 200 people vote. If 116 choose union, what percentage is that?',
          answer: '116 ÷ 200 = 58 per cent.',
        },
      ],
      support: ['Use two colours of chalk to show the two borders, and let learners stand on a floor map as families divided by them.'],
      stretch: ['Find out what a United Nations trust territory was and why Togoland was one.'],
      localise: ['Does your own language group live on both sides of a national or regional border? How do people keep in touch?'],
      factCheck: [
        {
          claim: 'Historical and curriculum verification',
          explanation: 'Akwamu overrule after 1730, the alliance under Kwadzo Dei and the victory of 1833, the Asante invasion of 1869, the mission school at Peki in 1847, the German claim of 1884, the division of Togoland, and the vote of 9 May 1956 come from general historical knowledge and should be confirmed by a historian. The Social Studies code was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the choice of strand for this article is the writer’s judgement.',
          reference: 'NaCCA JHS Social Studies Curriculum (B7–B9) & Historical Record',
        },
      ],
    },
  }),

  // 10
  mk({
    key: 'gyaman-the-kingdom-cut-in-two',
    title: 'Gyaman: The Kingdom Cut in Two',
    summary:
      'Gyaman was an Akan kingdom in the north-west whose king shares his name with adinkra cloth. This article tells of its war with Asante, the debate about where adinkra comes from, and how a colonial border divided the kingdom.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'] as unknown as Classification['classIds'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent' as unknown as Classification['readingLevel'],
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Thoughtful, clear, and even',
    palette: ['#111827', '#b45309'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Soft drums with a repeating bell, reflective (placeholder)',
    pages: [
      pg(
        '🖤',
        'At a funeral in almost any town in southern Ghana, you will see cloth stamped with small black signs. One looks like a heart. One is a ladder. One, a pattern of curves, is known everywhere as Gye Nyame, meaning except God. The signs are printed on school crests, church walls, taxis, and even the seats in Parliament. They are called adinkra symbols. Ask where the name comes from, and many people will tell you a story about a king, a war, and a kingdom that most Ghanaians have never heard of. Its name was Gyaman.',
        'A length of cloth stamped with rows of black symbols, hanging to dry beside carved calabash stamps.'
      ),
      pg(
        '🌄',
        'Gyaman lay in the north-west of the Akan world, where the forest thins into savanna. It was founded in the late 1600s by an Akan group who moved west from the area of present-day Dormaa. They settled among peoples who were already living there, and they ruled together with them. The capital stood near the old trading town of Bonduku. Muslim merchants lived there, weavers produced fine cloth, and caravans passed through on their way between the forest and the River Niger. Gyaman grew rich on gold, cloth, and trade.',
        'A trading town of flat-roofed houses and a mud mosque, with weavers working at looms in the street.'
      ),
      pg(
        '⚔️',
        'Riches drew the attention of Asante. In 1740, an Asante army defeated Gyaman and made it pay tribute. Gyaman rose against this rule several times. In the early 1800s, its king was Kwadwo Adinkra. Tradition says that he had a golden stool made for himself, like the Golden Stool of Asante. The Asantehene took this as a great insult. In 1818, he led a large army north-west. After hard fighting, Gyaman was defeated and King Adinkra was killed. It was one of the last great victories of the Asante kingdom.',
        'Two armies facing each other across open grassland, each with a royal umbrella at its centre.'
      ),
      pg(
        '🧐',
        'Now for the cloth. One tradition says that King Adinkra wore robes stamped with symbols, and that Gyaman craftsmen captured in the war taught the art to the Asante, who named it after him. Other people give a different explanation. In Twi, the words di nkra mean to say goodbye, and the cloth was made to be worn when saying farewell to the dead. Which is true? Historians are not certain. Stamped cloth may be older than the war. Perhaps both stories hold part of the truth. Good history means saying honestly when the evidence does not settle a question.',
        'A craftsman pressing a carved stamp dipped in black dye onto plain cloth stretched over a board.'
      ),
      pg(
        '✂️',
        'Gyaman survived its defeat, but a greater blow came later, and without a battle. In the 1880s and 1890s, Britain and France were dividing West Africa between them. Their officials drew a border on a map. It ran straight through Gyaman. The capital and the western half fell to France and are now in Côte d’Ivoire. The eastern half fell to Britain and is now in Ghana, around the towns of Sampa and Drobo. Nobody asked the people. A family could wake to find that its farm lay in another country.',
        'A hand drawing a straight line with a ruler across a map, cutting through a shaded kingdom.'
      ),
      pg(
        '🌉',
        'Today the people on both sides still speak the same language and honour the same ancestors. They cross the border to trade cashew nuts and cloth, to marry, and to attend one another’s festivals and funerals. Two things are worth remembering from their story. Africa’s borders were drawn by outsiders, and living peacefully with them takes patience and friendship between neighbouring countries. And a kingdom that lost its wars and was cut in two still left its name on a cloth worn by millions. Culture can last longer than power.',
        'Traders with sacks of cashew nuts passing through a border post, greeting one another.'
      ),
    ],
    activities: [
      {
        id: 'gy-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What made Gyaman rich?',
        options: [
          'Fishing and salt',
          'Gold, cloth, and trade through Bonduku',
          'Cocoa and timber',
        ],
        correctIndex: 1,
      },
      {
        id: 'gy-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'According to tradition, why did the Asantehene go to war in 1818?',
        options: [
          'King Adinkra had a golden stool made for himself',
          'Gyaman attacked Kumasi',
          'The British asked him to',
        ],
        correctIndex: 0,
      },
      {
        id: 'gy-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What does the article say about the origin of the name adinkra?',
        options: [
          'It certainly comes from the king',
          'It certainly means goodbye',
          'There are two explanations, and historians are not certain which is right',
        ],
        correctIndex: 2,
      },
      {
        id: 'gy-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You read two different accounts of an event in your town’s history. What is the best way to handle them?',
        options: [
          'Choose the one you like more',
          'Report both, look for evidence, and say honestly what is not known',
          'Ignore both',
        ],
        correctIndex: 1,
      },
      {
        id: 'gy-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'An Akan group moves west and founds Gyaman',
          'Asante first defeats Gyaman',
          'King Kwadwo Adinkra is killed in war with Asante',
          'Britain and France draw a border through Gyaman',
          'People on both sides still cross the border to trade and visit',
        ],
      },
      {
        id: 'gy-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'evidence',
        definition: 'Facts or objects that help to show whether something is true.',
        distractors: [
          'A story told for fun',
          'A rule made by a king',
        ],
      },
    ],
    glossary: [
      {
        word: 'symbols',
        definition: 'Signs that stand for ideas.',
        pages: [1, 4],
      },
      {
        word: 'savanna',
        definition: 'Open grassland with scattered trees.',
        pages: [2],
      },
      {
        word: 'caravans',
        definition: 'Groups of traders travelling together with loaded animals.',
        pages: [2],
      },
      {
        word: 'tribute',
        definition: 'Payment that a weaker state must give to a stronger one.',
        pages: [3],
      },
      {
        word: 'evidence',
        definition: 'Facts or objects that help to show whether something is true.',
        pages: [4],
      },
      {
        word: 'border',
        definition: 'The line that divides one country from another.',
        pages: [5, 6],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.3.3.1.1, Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity (Assess the significance of symbols, music and ceremonies in promoting national identity).',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: the Ghanaian part of old Gyaman lies in the Jaman North and Jaman South districts of the Bono Region (Sampa and Drobo). Bonduku (Bondoukou) is in Côte d’Ivoire. The origin of the word adinkra is disputed; the article presents both explanations.',
    ],
    reviewQuestions: [
      'Ask a historian to confirm the dates 1740 and 1818 and the account of the founding of Gyaman.',
      'Ask a Twi-speaking reviewer to confirm the wording of the two explanations of “adinkra”.',
    ],
    guide: {
      overview:
        'Uses adinkra cloth to introduce Gyaman, its war with Asante, the uncertainty of historical evidence, and the effects of colonial borders.',
      lessonMinutes: 45,
      goals: [
        'Locate Gyaman and explain what made it wealthy.',
        'Retell the war of 1818 and its cause according to tradition.',
        'Compare two explanations for the name adinkra and weigh them.',
        'Explain how a colonial border divided Gyaman and how people live with it.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Gyaman, adinkra symbols, and national identity'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years'],
      ],
      before: ['Draw Gye Nyame on the board. Ask: where have you seen this, and where do you think such signs come from?'],
      during: ['After Page 4, make two columns, “the king” and “goodbye”, and list what supports each explanation.'],
      after: ['Learners design a new symbol for a value they care about and explain its meaning.'],
      discussion: ['Gyaman lost its wars but its name lives on. What lasts longer: power or culture? Why?'],
      reflection: ['Which symbol, adinkra or otherwise, best stands for something you believe?'],
      maths: [
        {
          task: 'Asante first defeated Gyaman in 1740 and again in 1818. How many years lay between?',
          answer: '1818 − 1740 = 78 years.',
        },
        {
          task: 'A cloth has 12 rows of symbols with 9 symbols in each row. How many symbols are stamped on it?',
          answer: '12 × 9 = 108 symbols.',
        },
      ],
      support: ['Give learners cut potato or cardboard stamps and let them print a simple pattern before reading.'],
      stretch: ['Find out the names and meanings of five adinkra symbols and where each is commonly used.'],
      localise: ['Find an adinkra or other traditional symbol on a building, vehicle, or cloth near you and learn its meaning.'],
      factCheck: [
        {
          claim: 'Historical and curriculum verification',
          explanation: 'The founding of Gyaman in the late 1600s, the Asante victories of 1740 and 1818, King Kwadwo Adinkra and the story of his stool, and the colonial border of the 1880s and 1890s come from general historical knowledge and should be confirmed by a historian. The origin of the word adinkra is not settled. The Social Studies code was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the choice of strand for this article is the writer’s judgement.',
          reference: 'NaCCA JHS Social Studies Curriculum (B7–B9) & Historical Record',
        },
      ],
    },
  }),

];
export const BATCH_43_KINGDOMS_ARTICLES: PilotStory[] = BATCH_44_STORIES;
