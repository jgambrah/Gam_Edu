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
 * Batch 43 (8 stand-alone history articles): "Kingdoms of Ghana" series, set 1, for JHS (Basic 7 to Basic 9).
 * Each article is tied to a JHS Social Studies strand (History is not a separate JHS subject) (see the first cultural note and the teacher guide).
 * These are history articles, not stories: there are no characters, so `characters` is empty and one narrator reads throughout.
 * Original text written for Ghanaian learners; oral traditions and dates differ between sources (see each factCheck note).
 */

export const BATCH_43_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'bono-gold-at-the-edge-of-the-forest',
    title: 'Bono: Gold at the Edge of the Forest',
    summary:
      'Long before Asante rose, the Bono kingdom grew rich where the forest meets the savanna. This article tells how gold, trade, and careful measurement built one of the earliest Akan states.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Warm, steady, and curious',
    palette: ['#a16207', '#166534'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Gentle seperewa-style strings with soft bells (placeholder)',
    pages: [
      pg(
        '🧺',
        'Go to Techiman on a market day. Lorries stand in long lines, loaded with yams, maize, tomatoes, and cashew. Traders have come from Kumasi and Tamale, and also from Burkina Faso, Mali, and Niger. You will hear Twi, Hausa, Dagbani, French, and more. Techiman is one of the busiest food markets in West Africa, because it sits where the forest meets the savanna and the roads from north and south cross. This is not new. Six hundred years ago, traders met in the same country. But they had not come for yams. They had come for gold.',
        'A crowded open market with heaps of yams and lines of loaded lorries under a bright sky.'
      ),
      pg(
        '👑',
        'A short way north of Techiman lay Bono Manso, the capital of the Bono kingdom. Many historians count Bono as one of the earliest Akan states, growing strong from about the 1300s or 1400s. Its own tradition says that the first Bono people came out of a hole in the ground at a place called Amowi. Stories like this are a people’s way of saying: we have always belonged here. The king was called the Bonohene. His land had two great gifts. It had gold in its streams and soil, and it stood on the road between two different worlds.',
        'A wide town of thatched houses and courtyards among tall trees at the forest edge, seen from a low hill.'
      ),
      pg(
        '🐪',
        'To the north lay the great markets of the River Niger, such as Jenne and Timbuktu. Camel caravans carried goods from there across the Sahara desert to North Africa. Those markets wanted gold. Muslim traders known as the Wangara came south with donkeys loaded with salt, cloth, and brass. The Bono had gold and also kola nuts from the forest. A trading town named Begho grew up in Bono country, with separate quarters for local people, for visiting merchants, and for craftsmen. Archaeologists who dug there found brass, beads, and broken pots from far away.',
        'A line of donkeys carrying loads along a path from open grassland towards tall forest trees.'
      ),
      pg(
        '⚖️',
        'How do you buy and sell with gold dust? You must weigh it. Bono traders used small scales and sets of brass weights, and they agreed on fixed units so that nobody was cheated. The weights were small works of art, cast in the shapes of fish, birds, drums, and symbols that stood for proverbs. A trader’s bag of weights showed both wealth and learning. Using them needed quick arithmetic with fractions. The skill of working gold and brass spread from Bono to other Akan peoples. The goldsmiths of later kingdoms learned from this tradition.',
        'A small pair of brass scales with a pile of gold dust on one pan and tiny cast brass weights shaped like a fish and a bird beside it.'
      ),
      pg(
        '⚔️',
        'Wealth draws envy. By the early 1700s, a new power had risen in the forest to the south: Asante. Around 1722 to 1723, the Asante army under King Opoku Ware marched north and captured Bono Manso. The Bono king was taken to Kumasi, and the old capital was never rebuilt. Asante gained more than treasure. Bono goldsmiths, weavers, and officials carried their knowledge to the Asante court. The Bono people gathered again around Techiman, which became their new centre. A kingdom can lose a war and still pass on its skills.',
        'An empty hilltop with grass growing over low mounds where houses once stood.'
      ),
      pg(
        '🎉',
        'The name lives on. In 2019, two of Ghana’s new regions were called Bono and Bono East. Each year, in Techiman and Wenchi, people celebrate the Apoo festival. For several days, anyone may sing openly about wrongs done in the past year, even wrongs done by chiefs, and no one may punish them for it. It is an old way of clearing the air and keeping leaders honest. The lesson of Bono is plain. A people who stand at a crossroads, trade fairly, and measure honestly can grow rich without conquering anyone.',
        'A festival procession with people singing and dancing along a town street, some carrying branches.'
      ),
    ],
    activities: [
      {
        id: 'bo-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why was the Bono kingdom so well placed for trade?',
        options: [
          'It was on the sea coast',
          'It lay between the forest and the savanna, on the road linking north and south',
          'It was hidden deep in the forest where no one could reach it',
        ],
        correctIndex: 1,
      },
      {
        id: 'bo-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did the Wangara traders bring south to exchange for gold and kola?',
        options: [
          'Salt, cloth, and brass',
          'Cocoa and rubber',
          'Guns and gunpowder',
        ],
        correctIndex: 0,
      },
      {
        id: 'bo-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did traders need brass weights?',
        options: [
          'To decorate their houses',
          'To throw at thieves',
          'To weigh gold dust fairly using agreed units',
        ],
        correctIndex: 2,
      },
      {
        id: 'bo-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: During Apoo, people may criticise their leaders without punishment. Which modern idea is closest to this?',
        options: [
          'Freedom of speech and holding leaders to account',
          'Paying school fees',
          'Closing the market on holidays',
        ],
        correctIndex: 0,
      },
      {
        id: 'bo-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'The Bono kingdom grows strong at Bono Manso',
          'Wangara traders come south and Begho becomes a busy trading town',
          'Asante captures Bono Manso',
          'The Bono people gather again around Techiman',
          'Two regions of Ghana are named Bono and Bono East',
        ],
      },
      {
        id: 'bo-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'caravans',
        definition: 'Groups of traders travelling together with loaded animals.',
        distractors: [
          'Small boats used on rivers',
          'Houses built for a king',
        ],
      },
    ],
    glossary: [
      {
        word: 'savanna',
        definition: 'Open grassland with scattered trees.',
        pages: [1],
      },
      {
        word: 'capital',
        definition: 'The chief town of a kingdom or country.',
        pages: [2, 5],
      },
      {
        word: 'tradition',
        definition: 'Beliefs, stories, and customs passed down from older people to younger ones.',
        pages: [2, 4],
      },
      {
        word: 'caravans',
        definition: 'Groups of traders travelling together with loaded animals.',
        pages: [3],
      },
      {
        word: 'archaeologists',
        definition: 'People who study the past by digging up and examining what earlier people left behind.',
        pages: [3],
      },
      {
        word: 'proverbs',
        definition: 'Short, wise sayings.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.3.3.1.1, Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity (Assess the significance of symbols, music and ceremonies in promoting national identity). Primary History foundation: B4.2.1.1.1.',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: Bono Manso lies north of Techiman in the Bono East Region. Dates for early Bono are estimates and scholars disagree. The Amowi origin story is oral tradition and should be taught as tradition.',
    ],
    reviewQuestions: [
      'Ask a Bono traditional authority or a historian to confirm the account of Bono Manso and the Apoo festival.',
      'Check that the article does not present the origin story as proven fact.',
    ],
    guide: {
      overview:
        'Introduces Bono as an early Akan state built on gold and long-distance trade, and shows how its skills passed to later kingdoms.',
      lessonMinutes: 45,
      goals: [
        'Locate Bono Manso and Techiman and explain why the area suited trade.',
        'Describe the trade between Bono and the Niger markets.',
        'Explain how gold was weighed and why fair measures mattered.',
        'Describe what happened to Bono after 1723 and what survives today.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'The Bono kingdom and the gold trade'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years; simple fractions'],
      ],
      before: ['Show a map of West Africa. Ask: why would a town between forest and grassland become a market?'],
      during: ['After Page 3, learners trace the route Bono Manso to Jenne to Timbuktu on a map.'],
      after: ['Learners design their own “gold weight” on paper and write the proverb it stands for.'],
      discussion: ['Bono lost its capital but its skills lived on. Which matters more to a people: land or knowledge?'],
      reflection: ['What does your own town trade in, and where do its customers come from?'],
      maths: [
        {
          task: 'Asante captured Bono Manso in about 1723. The Bono and Bono East regions were named in 2019. How many years lie between?',
          answer: '2019 − 1723 = 296 years.',
        },
        {
          task: 'A trader has a weight for 1 unit of gold, a half unit, and a quarter unit. What is the total if he uses all three?',
          answer: '1 + ½ + ¼ = 1¾ units.',
        },
      ],
      support: ['Tell the story with three objects: a lump of “gold” (a yellow stone), salt, and a strip of cloth.'],
      stretch: ['Find out what kola nuts are used for and why they were so valuable in the savanna.'],
      localise: ['Ask elders what your town was known for trading in the past.'],
      factCheck: [
        {
          claim: 'Bono Manso dates, Begho excavations, Asante conquest (1722–1723), and naming of Bono and Bono East regions (2019).',
          explanation:
            'All dates are approximate and come from general historical knowledge; scholars give different dates for the rise of Bono (from the 1200s to the 1400s) and for its fall (1722 to 1723). The Begho excavations and the naming of the Bono regions in 2019 should be confirmed. Have a historian review before seeding.',
          reference: 'NaCCA CCP Social Studies curriculum (NaCCA, 2021) B9.3.3.1.1; Primary History B4.2.1.1.1.',
        },
      ],
    },
  }),

  // 2
  mk({
    key: 'asante-the-kingdom-of-the-golden-stool',
    title: 'Asante: The Kingdom of the Golden Stool',
    summary:
      'A group of small forest states became one of the strongest kingdoms in West Africa. This article tells how Osei Tutu and Okomfo Anokye united Asante around the Golden Stool, and how Yaa Asantewaa defended it.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Stately, clear, and proud',
    palette: ['#b45309', '#14532d'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Slow fontomfrom-style drums with horn calls (placeholder)',
    pages: [
      pg(
        '🪙',
        'On an Akwasidae Sunday at Manhyia Palace in Kumasi, the great drums sound and a sea of umbrellas moves across the courtyard. Chiefs in rich kente take their seats. Then a stool covered in gold is carried out and set on its own chair, beside the king. Nobody sits on it, not even the Asantehene. This is the Golden Stool, and to the Asante it holds the soul of the whole nation. To understand why a stool matters more than a throne, go back more than three hundred years, to a time when there was no Asante kingdom at all.',
        'A palace courtyard filled with large colourful umbrellas, with a golden stool resting on its own chair.'
      ),
      pg(
        '🌳',
        'In the late 1600s, the forest around Kumasi was home to several small Akan states, such as Kwaman, Mampong, Bekwai, Juaben, and Nsuta. Each had its own chief. All of them paid tribute to a powerful southern neighbour, Denkyira, which was rich in gold. The chief of Kwaman was a young man named Osei Tutu. He had spent years at the courts of Denkyira and Akwamu and had seen how strong states were run. His closest adviser was a priest, Okomfo Anokye. Together they planned to turn a group of small states into one nation.',
        'Several small forest towns linked by footpaths, with one larger town in the centre.'
      ),
      pg(
        '✨',
        'Tradition tells what happened next. On a Friday, Okomfo Anokye called the chiefs together at Kumasi. Before them all, a golden stool came down from the sky and settled gently on the knees of Osei Tutu. Anokye declared that it held the spirit of all their people: the living, the dead, and those not yet born. Whatever a historian makes of the story, its meaning was plain to the chiefs. They no longer belonged only to their own towns. They were one people with one king, the Asantehene. Around 1701, their united army defeated Denkyira at Feyiase. Asante was free.',
        'A gathering of chiefs seated in a circle beneath tall trees, looking up towards a bright light.'
      ),
      pg(
        '🛣️',
        'Over the next century, Asante grew into one of the strongest states in West Africa. Under Opoku Ware and later kings, its power reached north to Gonja and Dagbon and south towards the coast. Great roads ran out from Kumasi in every direction, and officials travelled them to collect taxes and carry messages. Gold and kola nuts went north to the savanna markets. Laws were made in a council of chiefs, and the queen mother had a strong voice in choosing each king. Weavers at Bonwire made kente, and craftsmen at Ntonso stamped adinkra cloth.',
        'A broad road leading out of a large town, with porters, a messenger, and a weaver working at a loom by the roadside.'
      ),
      pg(
        '🛡️',
        'Asante’s growth brought it into conflict with Britain, which was taking control of the coast. They fought several wars in the 1800s. In 1824, Asante won a famous victory. In 1874, a British army burned Kumasi. In 1896, the British seized the Asantehene, Prempeh I, and sent him far away to the Seychelles islands. Then, in 1900, the British governor demanded the Golden Stool to sit on. The chiefs hesitated. Yaa Asantewaa, queen mother of Ejisu, did not. She led the army in a last war. Asante was defeated, but the stool had been hidden, and it was never captured.',
        'An elderly queen mother in dark cloth standing firmly before a group of seated chiefs.'
      ),
      pg(
        '🇬🇭',
        'Prempeh I came home in 1924, and in 1935 the Asante union was restored. Today Ghana is a republic with an elected president, yet the Asantehene still sits at Manhyia, settles disputes, and supports schools and health care. The Golden Stool is still brought out on great days. What does the story teach? A nation is more than land and soldiers. It needs something that all its members agree to honour: a shared idea. For Asante, that idea took the shape of a stool. For Ghana today, it is a flag, an anthem, and a constitution.',
        'The Ghana flag flying beside the gate of a palace, with schoolchildren walking past.'
      ),
    ],
    activities: [
      {
        id: 'as-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Before Asante was united, what did the small states around Kumasi have in common?',
        options: [
          'They all paid tribute to Denkyira',
          'They were all ruled from the coast',
          'They had no chiefs',
        ],
        correctIndex: 0,
      },
      {
        id: 'as-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did the Golden Stool mean to the chiefs?',
        options: [
          'It was a gift for the king of Denkyira',
          'It showed that they were now one people with one king',
          'It was a seat for the Asantehene to sit on',
        ],
        correctIndex: 1,
      },
      {
        id: 'as-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why did war break out in 1900?',
        options: [
          'Asante attacked the coast',
          'Prempeh I returned from exile',
          'The British governor demanded the Golden Stool',
        ],
        correctIndex: 2,
      },
      {
        id: 'as-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: The article says a nation needs a shared idea that all its members honour. Which of these plays that part for Ghana today?',
        options: [
          'The national flag, anthem, and constitution',
          'The price of cocoa',
          'The tallest building in Accra',
        ],
        correctIndex: 0,
      },
      {
        id: 'as-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'Osei Tutu becomes chief of Kwaman',
          'The united Asante army defeats Denkyira at Feyiase',
          'A British army burns Kumasi',
          'Yaa Asantewaa leads the war to defend the Golden Stool',
          'Prempeh I returns from the Seychelles',
        ],
      },
      {
        id: 'as-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'tribute',
        definition: 'Payment that a weaker state must give to a stronger one.',
        distractors: [
          'A song sung in praise of a chief',
          'A market where gold is sold',
        ],
      },
    ],
    glossary: [
      {
        word: 'Asantehene',
        definition: 'The king of Asante.',
        pages: [1, 3, 5, 6],
      },
      {
        word: 'tribute',
        definition: 'Payment that a weaker state must give to a stronger one.',
        pages: [2],
      },
      {
        word: 'tradition',
        definition: 'Beliefs, stories, and customs passed down from older people to younger ones.',
        pages: [3],
      },
      {
        word: 'queen',
        definition: 'Queen mother: the senior woman of a royal family, who advises the chief and helps to choose him.',
        pages: [4, 5],
      },
      {
        word: 'council',
        definition: 'A group of people who meet to make decisions.',
        pages: [4],
      },
      {
        word: 'republic',
        definition: 'A country whose head of state is elected, not a king or queen.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.3.3.1.1, Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity (Assess the significance of symbols, music and ceremonies in promoting national identity). Primary History foundation: B4.2.5.1.1.',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: the Golden Stool (Sika Dwa Kofi) is sacred; no one sits on it. Akwasidae falls every sixth Sunday. Manhyia Palace in Kumasi is the seat of the Asantehene. Teach the descent of the stool as tradition.',
    ],
    reviewQuestions: [
      'Ask a historian or the Manhyia Palace Museum to confirm dates and names.',
      'Check that the Golden Stool is described with respect and that no picture shows anyone sitting on it.',
    ],
    guide: {
      overview:
        'Tells how Asante was united around the Golden Stool, how it governed and traded, and how it resisted British rule.',
      lessonMinutes: 45,
      goals: [
        'Name the founders of the Asante kingdom and explain the role of the Golden Stool.',
        'Describe how Asante was governed and what it traded.',
        'Outline the conflict with Britain from 1824 to 1900.',
        'Explain what a shared symbol does for a nation.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Rise, government, and resistance of Asante'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years; timelines'],
      ],
      before: ['Ask: what objects or symbols make you feel that you belong to Ghana? List them.'],
      during: ['After Page 3, discuss: why was a story more powerful than an order from Osei Tutu would have been?'],
      after: ['Learners draw a timeline from 1701 to 1935 and mark five events.'],
      discussion: ['Yaa Asantewaa spoke when the chiefs were silent. What made her able to do so?'],
      reflection: ['Is there something you would defend even if others around you hesitated?'],
      maths: [
        {
          task: 'Prempeh I was sent away in 1896 and returned in 1924. How many years was he in exile?',
          answer: '1924 − 1896 = 28 years.',
        },
        {
          task: 'Akwasidae comes every 42 days. About how many times does it fall in a year of 365 days?',
          answer: '365 ÷ 42 ≈ 8.7, so 8 or 9 times.',
        },
      ],
      support: ['Give learners five picture cards (stool, battle, burning town, queen mother, returning king) to order as they listen.'],
      stretch: ['Find out the meanings of three adinkra symbols and when each is used.'],
      localise: ['Find out which stool, skin, or other symbol stands for the people of your own area.'],
      factCheck: [
        {
          claim: 'Battle of Feyiase (c. 1701), Anglo-Asante wars (1824, 1874, 1900), exile of Prempeh I (1896–1924), and restoration of the Asante union (1935).',
          explanation:
            'Dates used (Feyiase about 1701; wars of 1824 and 1874; exile 1896; war of 1900; return 1924; restoration 1935) come from general historical knowledge and should be confirmed by a historian. The descent of the Golden Stool is oral tradition.',
          reference: 'NaCCA CCP Social Studies curriculum (NaCCA, 2021) B9.3.3.1.1; Primary History B4.2.5.1.1.',
        },
      ],
    },
  }),

  // 3
  mk({
    key: 'akwamu-the-kingdom-that-kept-the-castle-keys',
    title: 'Akwamu: The Kingdom That Kept the Castle Keys',
    summary:
      'Akwamu once ruled the coast from Winneba to beyond the Volta. This article tells how it rose, how one of its traders captured a European castle by a trick, and what its story teaches about power.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Brisk, clear, and a little daring',
    palette: ['#7c2d12', '#0369a1'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Quick hand drums with a bright bell pattern (placeholder)',
    pages: [
      pg(
        '🗝️',
        'Cross the Adomi Bridge over the River Volta and turn towards the quiet town of Akwamufie. In the palace there, the chiefs keep a bunch of heavy iron keys. They do not open any door in the town. They are the keys of Christiansborg Castle at Osu in Accra, about a hundred kilometres away by road, a castle built by Europeans and later used as the seat of Ghana’s government. How did the keys of a castle by the sea come to rest in a small town beside the Volta? The answer is one of the boldest stories in our history.',
        'A bunch of large old iron keys lying on a carved wooden stool.'
      ),
      pg(
        '🏞️',
        'Akwamu was an Akan state. In the early 1600s its capital, Nyanoase, stood in the hills near present-day Nsawam. The position was well chosen. The paths that carried gold from the forest down to the forts on the coast passed through Akwamu country, and the kingdom grew rich by taxing the traders who used them. With that wealth, its kings bought guns and built an army that fought in organised wings: front, left, right, and rear. Other Akan states later copied this plan, and it shaped the way chiefs are ranked to this day.',
        'A hill town overlooking a forest path, with traders carrying loads past a guarded gate.'
      ),
      pg(
        '🌊',
        'Under King Ansa Sasraku, Akwamu turned towards the sea. Between 1677 and 1681, its army conquered the Ga kingdom and took control of Accra and its trade. More victories followed. By the early 1700s, Akwamu ruled a strip of coast about 400 kilometres long, from near Winneba in the west, across the Volta, to Ouidah in present-day Benin. A young prince from the forest spent part of his youth at the Akwamu court and watched how the state was run. His name was Osei Tutu, and he would go on to found the Asante kingdom.',
        'A map of the coast from Winneba to Ouidah, shaded to show one kingdom ruling the whole strip.'
      ),
      pg(
        '🏰',
        'In 1693, an Akwamu trader named Asameni carried out a daring plan. He was well known to the Danes in Christiansborg Castle, because he often did business with them. One day he arrived with about eighty men, saying that they wished to buy guns. The Danes let them in. The visitors had hidden powder and shot in their clothes. They loaded the guns they were shown, turned them on the soldiers, and took the castle. Asameni raised his own flag, called himself governor, and traded with passing ships for a whole year.',
        'A white castle with thick walls and cannons beside the sea, with a line of men walking in through its gate.'
      ),
      pg(
        '💰',
        'In 1694, the Danes paid a large sum in gold to get their castle back. Akwamu returned the building, but the keys were kept, and they have stayed with the Akwamu ever since. Power, however, makes enemies. Akwamu’s rule was harsh, and its neighbours suffered from its raids. In 1730, the Akyem and their allies joined forces and broke the kingdom. The royal family and many of the people crossed the Volta and built a new capital at Akwamufie, where their descendants live today. The empire had lasted about fifty years.',
        'People crossing a wide river in canoes with their belongings, heading for the far bank.'
      ),
      pg(
        '📚',
        'Akwamu was small, yet it left large marks. Its way of arranging an army was adopted by Asante. It showed that an African state could bargain with Europeans as an equal, and even outwit them. Its fall carries a warning as well: a state that rules by fear alone will find that its neighbours unite against it. The keys at Akwamufie are a reminder of all this. Kings, castles, and governments come and go. What lasts is how a people is remembered, and whether its neighbours speak of it with respect or with relief.',
        'A calm view of the River Volta with hills behind and a small town on the bank.'
      ),
    ],
    activities: [
      {
        id: 'ak-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'How did Akwamu first become rich?',
        options: [
          'By taxing traders on the paths between the forest and the coast',
          'By fishing in the sea',
          'By growing cocoa',
        ],
        correctIndex: 0,
      },
      {
        id: 'ak-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Asameni and his men capture Christiansborg Castle?',
        options: [
          'They attacked it from ships',
          'They dug a tunnel under the walls',
          'They entered as customers and turned the guns on the soldiers',
        ],
        correctIndex: 2,
      },
      {
        id: 'ak-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why did Akwamu fall in 1730?',
        options: [
          'An earthquake destroyed its capital',
          'Its neighbours, who had suffered under its rule, united against it',
          'The Danes conquered it',
        ],
        correctIndex: 1,
      },
      {
        id: 'ak-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A class prefect gets his way only by threatening others. Using the lesson of Akwamu, what is likely to happen in time?',
        options: [
          'Everyone will always obey him',
          'The others will join together against him',
          'He will be made head teacher',
        ],
        correctIndex: 1,
      },
      {
        id: 'ak-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'Akwamu grows rich at Nyanoase by taxing trade',
          'Akwamu conquers the Ga kingdom and controls Accra',
          'Asameni captures Christiansborg Castle',
          'The Danes buy the castle back, but the keys are kept',
          'Akyem and its allies defeat Akwamu, and the people move to Akwamufie',
        ],
      },
      {
        id: 'ak-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'allies',
        definition: 'People or states that join together to help one another.',
        distractors: [
          'Soldiers who guard a castle',
          'Traders who sell gold',
        ],
      },
    ],
    glossary: [
      {
        word: 'capital',
        definition: 'The chief town of a kingdom or country.',
        pages: [2, 5],
      },
      {
        word: 'taxing',
        definition: 'Making people pay money to the state.',
        pages: [2],
      },
      {
        word: 'conquered',
        definition: 'Defeated and taken over by force.',
        pages: [3],
      },
      {
        word: 'governor',
        definition: 'A person who rules a place on behalf of a government.',
        pages: [4],
      },
      {
        word: 'allies',
        definition: 'People or states that join together to help one another.',
        pages: [5],
      },
      {
        word: 'descendants',
        definition: 'The children, grandchildren, and later family of a person or people.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B8.4.2.1.1, Strand 4: Law and Order, Sub-Strand 2: Conflict Prevention and Management (Examine ways of preventing and managing conflict in the community). Primary History foundation: B4.2.1.1.1.',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: Akwamufie is in the Asuogyaman District of the Eastern Region, near Atimpoku and the Adomi Bridge. Christiansborg (Osu) Castle was built by Denmark and later served as the seat of government.',
    ],
    reviewQuestions: [
      'Ask the Akwamu Traditional Council or a historian to confirm the account of Asameni and the keys.',
      'Check dates for the conquest of the Ga state, which sources give as 1677, 1680, or 1681.',
    ],
    guide: {
      overview:
        'Tells the rise and fall of the Akwamu empire through the story of the castle keys, with lessons about trade, organisation, and the limits of power.',
      lessonMinutes: 45,
      goals: [
        'Explain how control of trade routes made Akwamu rich.',
        'Describe the extent of the Akwamu empire at its height.',
        'Retell how Christiansborg Castle was captured and returned.',
        'Explain why Akwamu fell and what its story teaches.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B8.4.2.1.1: Strand 4: Law and Order, Sub-Strand 2: Conflict Prevention and Management)', 'The Akwamu empire'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years; distance'],
      ],
      before: ['Ask: can a small country be powerful? What would it need?'],
      during: ['After Page 4, learners retell the capture of the castle in their own words to a partner.'],
      after: ['Learners mark Nsawam, Accra, Winneba, Akwamufie, and Ouidah on an outline map.'],
      discussion: ['Was Asameni a hero, a clever trader, or a trickster? Give reasons for your view.'],
      reflection: ['How would you like your own community to be remembered by its neighbours?'],
      maths: [
        {
          task: 'Asameni took the castle in 1693 and the Danes bought it back in 1694. Akwamu fell in 1730. How many years after the return of the castle did the kingdom fall?',
          answer: '1730 − 1694 = 36 years.',
        },
        {
          task: 'The Akwamu coast was about 400 km long. Walking 25 km a day, how many days would a messenger need to cross it?',
          answer: '400 ÷ 25 = 16 days.',
        },
      ],
      support: ['Act out the capture of the castle with learners as traders and soldiers, using no weapons, only the dialogue.'],
      stretch: ['Find out which European countries built forts on the coast of Ghana and how many still stand.'],
      localise: ['Is there a fort, castle, or old trading post near you? Find out who built it and who controlled it.'],
      factCheck: [
        {
          claim: 'Capture of Christiansborg Castle by Asameni (1693–1694), keys kept at Akwamufie, conquest of Ga (1677–1681), and fall of Akwamu (1730).',
          explanation:
            'The capture of Christiansborg Castle by Asameni in 1693, its return in 1694, the keys kept at Akwamufie, the conquest of the Ga state (1677 to 1681), the reach to Ouidah, and the fall in 1730 come from general historical knowledge and should be confirmed by a historian.',
          reference: 'NaCCA CCP Social Studies curriculum (NaCCA, 2021) B8.4.2.1.1; Primary History B4.2.1.1.1.',
        },
      ],
    },
  }),

  // 4
  mk({
    key: 'the-fante-states-and-their-constitution',
    title: 'The Fante States and Their Constitution',
    summary:
      'The Fante never had a single king. This article tells how their states grew around Mankessim, how the asafo companies defended them, and how in 1871 they wrote one of the first constitutions in West Africa.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Lively, clear, and thoughtful',
    palette: ['#1d4ed8', '#b91c1c'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Brisk asafo-style drums and bells (placeholder)',
    pages: [
      pg(
        '🚩',
        'Walk through Anomabo, Elmina, or Saltpond and you will meet strange and wonderful buildings. They are made of concrete, painted in bright colours, and crowded with statues: lions, ships, whales, clocks, soldiers, and aeroplanes. These are posuban, the shrines of the asafo companies. Beside them, on festival days, fly flags sewn with pictures and proverbs. The asafo were the fighting men of each Fante town. Their shrines and flags tell you something important about the Fante. Here, power did not belong only to chiefs. Ordinary people were organised, and they expected to be heard.',
        'A brightly painted concrete shrine with statues of a lion and a ship, and a colourful flag flying beside it.'
      ),
      pg(
        '🐘',
        'Fante tradition says that the people came south from the Techiman area long ago. They were led by three great men: Oburumankoma, Odapagyan, and Oson, whose names mean the whale, the eagle, and the elephant. They settled at Mankessim, which means the great town, a short way inland from the sea. Near the town was a sacred grove where the leaders were buried and where the priests gave advice on important matters. As the population grew, groups moved out and founded new states, among them Abura, Anomabo, Ekumfi, Nkusukum, and Gomoa.',
        'Three carved figures of a whale, an eagle, and an elephant standing together at the centre of a town.'
      ),
      pg(
        '⚓',
        'The Fante never joined under one king. Each state kept its own chief, but they met in council at Mankessim when danger threatened. The coast gave them another kind of strength. From the late 1400s, European ships came to buy gold, and forts rose at Elmina, Cape Coast, and Anomabo. Fante traders became the go-betweens, carrying goods between the ships and the peoples of the forest. Many grew wealthy. Some sent their children to the schools in the forts. In time, the Fante coast had more people who could read and write than anywhere else in the country.',
        'Canoes carrying goods between a sailing ship at anchor and a beach below a white fort.'
      ),
      pg(
        '🤝',
        'To the north, Asante wanted a direct road to the coast and its trade. The Fante stood in the way, and from 1806 Asante armies invaded several times. The Fante turned to the British for help, and the British used the chance to increase their own power. By the 1860s, the Fante faced two worries: Asante in the north, and European governments that swapped forts and territories among themselves without asking the people who lived there. The chiefs and the educated men decided that the Fante must unite and govern themselves.',
        'Chiefs under umbrellas and men in coats and hats sitting together in discussion under a large tree.'
      ),
      pg(
        '📜',
        'In 1868, they formed the Fante Confederation. In 1871, at Mankessim, they wrote down a constitution. It set up an assembly in which chiefs and educated men sat together, a king-president, and a court. It planned taxes to pay for roads and for schools, including schools for girls. This was one of the first written constitutions in West Africa, made by Africans for themselves. The British governor did not welcome it. He had several of the leaders arrested. They were soon released, but the Confederation was weakened, and by 1873 it had come to an end.',
        'A long handwritten document with a wax seal lying on a table beside a pen and an inkpot.'
      ),
      pg(
        '🗳️',
        'The idea did not die. In 1897, a new generation met at Cape Coast and formed a society to protect the people’s rights to their land. They sent a team to London, argued their case, and won. Later leaders of the independence movement learned from them. When you see the asafo flags flying at the Aboakyer festival in Winneba or the Fetu Afahye in Cape Coast, remember what stands behind the colour and the drumming. The Fante showed that many small states could agree on written rules and govern themselves. Ghana’s own constitution rests on the same belief.',
        'A festival procession along a coastal street with company flags held high.'
      ),
    ],
    activities: [
      {
        id: 'fa-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'According to tradition, where did the Fante first settle near the coast?',
        options: [
          'Kumasi',
          'Mankessim',
          'Accra',
        ],
        correctIndex: 1,
      },
      {
        id: 'fa-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'How did many Fante traders become wealthy?',
        options: [
          'By mining gold in the forest',
          'By conquering Asante',
          'By acting as go-betweens for European ships and inland peoples',
        ],
        correctIndex: 2,
      },
      {
        id: 'fa-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What was special about the 1871 Mankessim constitution?',
        options: [
          'It was a written plan for self-government, made by Africans',
          'It was written by the British governor',
          'It made one chief the ruler of all Ghana',
        ],
        correctIndex: 0,
      },
      {
        id: 'fa-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Several small community groups want to build a borehole together. Which lesson from the Fante Confederation would help them most?',
        options: [
          'Let the richest group decide everything',
          'Agree on written rules, share the cost, and decide together',
          'Wait for someone from outside to do it',
        ],
        correctIndex: 1,
      },
      {
        id: 'fa-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'The Fante settle at Mankessim',
          'European ships begin trading on the coast',
          'Asante armies first invade the Fante states',
          'The Fante Confederation writes its constitution',
          'A society is formed at Cape Coast to protect land rights',
        ],
      },
      {
        id: 'fa-voc',
        type: 'vocabulary',
        afterPage: 5,
        word: 'constitution',
        definition: 'The written rules that say how a state or group is to be governed.',
        distractors: [
          'A tax paid to a chief',
          'A flag carried in a festival',
        ],
      },
    ],
    glossary: [
      {
        word: 'proverbs',
        definition: 'Short, wise sayings.',
        pages: [1],
      },
      {
        word: 'tradition',
        definition: 'Beliefs, stories, and customs passed down from older people to younger ones.',
        pages: [2],
      },
      {
        word: 'council',
        definition: 'A group of people who meet to make decisions.',
        pages: [3],
      },
      {
        word: 'unite',
        definition: 'To join together as one.',
        pages: [4],
      },
      {
        word: 'constitution',
        definition: 'The written rules that say how a state or group is to be governed.',
        pages: [5, 6],
      },
      {
        word: 'assembly',
        definition: 'A group of people chosen to meet and make laws or decisions.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.4.3.1.1, Strand 4: Law and Order, Sub-Strand 3: The 1992 Constitution (Examine the 1992 Constitution and its significance to national development). Primary History foundation: B4.2.1.1.1.',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: posuban shrines and asafo flags are living traditions in Fante towns. Aboakyer is celebrated by the Effutu of Winneba; Fetu Afahye by the people of Cape Coast (Oguaa).',
    ],
    reviewQuestions: [
      'Ask a historian to confirm the terms of the 1871 constitution, especially the provision for schools.',
      'Check the spelling of the three founders’ names with a Fante-speaking reviewer.',
    ],
    guide: {
      overview:
        'Introduces the Fante states, their asafo companies, their place in coastal trade, and the Fante Confederation as an early step towards self-government.',
      lessonMinutes: 45,
      goals: [
        'Retell the tradition of the founding of Mankessim.',
        'Explain why the Fante coast became wealthy and well educated.',
        'Describe the Fante Confederation and its constitution.',
        'Link the Confederation to later movements and to Ghana’s constitution.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.4.3.1.1: Strand 4: Law and Order, Sub-Strand 3: The 1992 Constitution)', 'The Fante states and Confederation'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years'],
      ],
      before: ['Ask: who makes the rules in our class, and are they written down? Why might that matter?'],
      during: ['After Page 5, list on the board what the constitution planned to provide.'],
      after: ['In groups, write five rules for a class “confederation”, and vote on them.'],
      discussion: ['Why might the British governor have feared a constitution written by the Fante themselves?'],
      reflection: ['Which written rule in your school or community do you think is most important?'],
      maths: [
        {
          task: 'The Confederation was formed in 1868 and ended in 1873. How long did it last?',
          answer: '1873 − 1868 = 5 years.',
        },
        {
          task: 'The Mankessim constitution was written in 1871. Ghana became independent in 1957. How many years lay between?',
          answer: '1957 − 1871 = 86 years.',
        },
      ],
      support: ['Show pictures of asafo flags and let learners say what each picture might mean.'],
      stretch: ['Find out who John Mensah Sarbah and J. E. Casely Hayford were and what each did.'],
      localise: ['Find out whether your town has asafo companies or similar groups, and what they do today.'],
      factCheck: [
        {
          claim: 'Founding of Mankessim, Asante invasions from 1806, Fante Confederation (1868–1873), 1871 Mankessim Constitution, and 1897 Aborigines’ Rights Protection Society.',
          explanation:
            'The founding tradition, the Asante invasions from 1806, the Confederation (1868 to 1873), the 1871 constitution, and the 1897 society at Cape Coast come from general historical knowledge and should be confirmed by a historian.',
          reference: 'NaCCA CCP Social Studies curriculum (NaCCA, 2021) B9.4.3.1.1; Primary History B4.2.1.1.1.',
        },
      ],
    },
  }),

  // 5
  mk({
    key: 'the-ga-state-from-the-hill-to-the-sea',
    title: 'The Ga State: From the Hill to the Sea',
    summary:
      'Accra began as a Ga kingdom on a hill inland. This article tells how the Ga built their state, why they moved to the coast, and how the Homowo festival remembers a great hunger.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Warm, clear, and rhythmic',
    palette: ['#0e7490', '#ca8a04'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Kpanlogo-style drums with a light bell (placeholder)',
    pages: [
      pg(
        '🤫',
        'For about a month each year, usually in May and June, a hush falls over the old quarters of Accra. Drumming and loud music are forbidden. Then, in August, the silence breaks. Families cook kpokpoi, a dish of steamed maize served with palm-nut soup and fish. Chiefs walk through the streets sprinkling it on the ground for the ancestors, and people cheer. This is Homowo. The word means hooting at hunger. It is the great festival of the Ga people, who founded Accra, and behind it lies the story of a long journey and a hard beginning.',
        'A chief in white cloth sprinkling food from a bowl onto the street while a crowd watches.'
      ),
      pg(
        '⛰️',
        'Ga tradition says that their ancestors came from the east, some by land and some by canoe along the coast. By the 1500s, they had built a kingdom with its capital at Ayawaso, on a hill a few kilometres inland from the sea. Visitors called it Great Accra. In the earliest days, the Ga were led by priests called wulomei, who still play an important part in Ga life. Later, a king, the Ga Mantse, led the people in war and government. The hill gave a clear view of the plains and of anyone coming near.',
        'A town on a low hill with a view across open plains to the distant sea.'
      ),
      pg(
        '🏗️',
        'The Ga chose their place wisely. Gold came down from the forest states, and ships waited at the coast. Ayawaso stood between them. The Ga kings would not let inland traders go to the ships directly, and so all the trade had to pass through Ga hands. European companies asked the Ga for land on the shore. The Dutch built a fort in 1649, the Danes began Christiansborg in 1661, and the English built James Fort in 1673. For a time, the Ga state was one of the richest on the coast.',
        'Three small forts standing along a shoreline with canoes drawn up on the beach.'
      ),
      pg(
        '🔥',
        'Wealth attracted a strong neighbour. Akwamu, in the hills to the north, wanted the coast trade for itself. In 1677, its army attacked Ayawaso. The Ga king, Okaikoi, was killed, and the capital was destroyed. Over the next few years, the Ga left the hill and moved down to the shore, settling beside the forts. There, six towns grew up side by side: Ga Mashie, Osu, La, Teshie, Nungua, and Tema. Each had its own chief and its own priests. Together they formed the Ga state as it is known today.',
        'Families walking down from a hill towards the coast, carrying their belongings.'
      ),
      pg(
        '🐟',
        'By the sea, the Ga became expert fishermen and traders. Their long canoes, carved from single tree trunks and painted with sayings, still line the beaches at Jamestown and Teshie. The towns welcomed strangers. Freed people who returned from Brazil in the 1800s settled among the Ga and are remembered as the Tabom. In 1877, the British moved the capital of their Gold Coast colony from Cape Coast to Accra. The Ga towns slowly grew together into one city. In 1957, Accra became the capital of independent Ghana. The six towns had become the heart of a nation.',
        'Long painted fishing canoes on a beach with fishermen mending nets.'
      ),
      pg(
        '🌽',
        'And the hunger? Tradition says that when the Ga first settled, the rains failed and a terrible famine followed. The people did not give up. They planted again and waited. When at last the rain came, the harvest was so large that they feasted and jeered at the hunger that had tried to destroy them. Every Homowo repeats that moment. The quiet weeks before it allow the young crops to grow in peace. So the festival carries a message for everyone who lives in Accra today, whatever their language: do not give up in hard times, and remember who made this place a home.',
        'A field of tall maize ready for harvest under a clearing sky.'
      ),
    ],
    activities: [
      {
        id: 'ga-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Who led the Ga in the earliest days?',
        options: [
          'European governors',
          'Priests called wulomei',
          'Asante generals',
        ],
        correctIndex: 1,
      },
      {
        id: 'ga-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'How did the Ga kings at Ayawaso grow rich?',
        options: [
          'They made all trade between inland states and the ships pass through Ga hands',
          'They mined gold on the hill',
          'They built the forts themselves',
        ],
        correctIndex: 0,
      },
      {
        id: 'ga-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did the Ga leave Ayawaso for the coast?',
        options: [
          'The hill became too small',
          'The British ordered them to move',
          'Akwamu attacked and destroyed the capital',
        ],
        correctIndex: 2,
      },
      {
        id: 'ga-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Why might a ban on noise before Homowo be linked to farming?',
        options: [
          'The quiet period marks a time for young crops to grow before the harvest feast',
          'Noise makes the sea rough',
          'Drums were too expensive',
        ],
        correctIndex: 0,
      },
      {
        id: 'ga-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'The Ga build their capital at Ayawaso',
          'European companies build forts on the Accra shore',
          'Akwamu destroys Ayawaso',
          'The British move their capital to Accra',
          'Accra becomes the capital of independent Ghana',
        ],
      },
      {
        id: 'ga-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'famine',
        definition: 'A time when there is very little food and many people go hungry.',
        distractors: [
          'A feast held after a good harvest',
          'A fort built beside the sea',
        ],
      },
    ],
    glossary: [
      {
        word: 'ancestors',
        definition: 'Family members who lived long ago.',
        pages: [1, 2],
      },
      {
        word: 'tradition',
        definition: 'Beliefs, stories, and customs passed down from older people to younger ones.',
        pages: [2, 6],
      },
      {
        word: 'capital',
        definition: 'The chief town of a kingdom or country.',
        pages: [2, 4, 5],
      },
      {
        word: 'fort',
        definition: 'A strong building made for defence and trade.',
        pages: [3],
      },
      {
        word: 'colony',
        definition: 'A land ruled by another country.',
        pages: [5],
      },
      {
        word: 'famine',
        definition: 'A time when there is very little food and many people go hungry.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.3.3.1.1, Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity (Assess the significance of symbols, music and ceremonies in promoting national identity). Primary History foundation: B4.2.1.1.1.',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: the ban on drumming and noise-making comes before Homowo each year; dates are announced by the Ga Traditional Council. Ayawaso lay inland in the area of present-day Accra. The Tabom are descendants of returnees from Brazil.',
    ],
    reviewQuestions: [
      'Ask the Ga Traditional Council or a Ga historian to confirm the list of towns and the account of Ayawaso.',
      'Check the dates of the forts (1649, 1661, 1673).',
    ],
    guide: {
      overview:
        'Follows the Ga from their inland capital to the coast, explains their place in trade, and reads the Homowo festival as a memory of famine overcome.',
      lessonMinutes: 45,
      goals: [
        'Describe the Ga kingdom at Ayawaso and how it was led.',
        'Explain how the Ga controlled trade between inland states and the coast.',
        'Say why and when the Ga moved to the shore, and name the six towns.',
        'Explain the meaning of Homowo.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'The Ga state and the growth of Accra'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Subtracting years'],
      ],
      before: ['Ask: what does the name “Homowo” mean? What festival does your own people celebrate, and why?'],
      during: ['After Page 4, learners name the six Ga towns and find them on a map of Accra.'],
      after: ['Learners write a short paragraph: “What Homowo teaches about hard times.”'],
      discussion: ['Accra belongs to all Ghanaians, yet it began as a Ga state. How can a city honour both truths?'],
      reflection: ['Describe a hard time that you or your family came through. What helped?'],
      maths: [
        {
          task: 'Akwamu destroyed Ayawaso in 1677. Accra became the capital of the Gold Coast in 1877. How many years lay between?',
          answer: '1877 − 1677 = 200 years.',
        },
        {
          task: 'Accra became the colonial capital in 1877 and the capital of independent Ghana in 1957. How many years was it a colonial capital?',
          answer: '1957 − 1877 = 80 years.',
        },
      ],
      support: ['Bring or describe kpokpoi and let learners name its ingredients before reading.'],
      stretch: ['Find out about the Tabom people: where they came from and what skills they brought.'],
      localise: ['Find out what the oldest part of your own town is called and who first settled there.'],
      factCheck: [
        {
          claim: 'Attack on Ayawaso (1677), King Okaikoi, European forts (1649, 1661, 1673), six Ga towns, move of capital (1877), and the Tabom.',
          explanation:
            'The attack on Ayawaso (1677), King Okaikoi, the dates of the forts, the six towns, the move of the capital in 1877, and the Tabom come from general historical knowledge and should be confirmed by a historian. The famine story is oral tradition.',
          reference: 'NaCCA CCP Social Studies curriculum (NaCCA, 2021) B9.3.3.1.1; Primary History B4.2.1.1.1.',
        },
      ],
    },
  }),

  // 6
  mk({
    key: 'anlo-the-people-who-walked-backwards',
    title: 'Anlo: The People Who Walked Backwards',
    summary:
      'The Anlo Ewe remember an escape from a walled city under a harsh king. This article tells that story, how the Anlo state was built between the lagoon and the sea, and what the Hogbetsotso festival means.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Gentle, clear, and rhythmic',
    palette: ['#0f766e', '#9333ea'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Agbadza-style drums with rattles, soft and steady (placeholder)',
    pages: [
      pg(
        '👣',
        'On the first Saturday of November, thousands of people fill the durbar ground at Anloga in the Volta Region. Chiefs arrive under umbrellas. Drummers play agbadza, and the dancers bend and sweep their arms like birds. Then comes a moment that puzzles visitors. A group of people act out a journey, and they walk backwards. This is Hogbetsotso, the festival of the Anlo people. Its name means the festival of leaving Hogbe, their old home. The backward steps tell of one night, about four hundred years ago, when a whole people slipped away from a cruel king.',
        'A durbar ground with chiefs under umbrellas and a group of dancers with their arms spread wide.'
      ),
      pg(
        '🧱',
        'Ewe tradition says that their ancestors travelled west in stages from a town called Ketu, in what is now the Republic of Benin. They settled for a long time at Notsie, in present-day Togo. Notsie was a large town surrounded by a thick wall of earth. At first the people lived there in peace. Then came a king named Agorkoli. The stories say that he was harsh. He gave the people cruel and impossible tasks, such as making rope out of clay. The elders decided, in secret, that it was time to leave.',
        'A large town of round houses enclosed by a high, thick earth wall.'
      ),
      pg(
        '💧',
        'The wall was the problem. It was too high to climb and too strong to break, and the gates were guarded. So the women were told to throw all their washing water against one spot on the wall, every day. Slowly, the earth became soft. One night there was loud drumming and dancing to cover any noise. The wall was pushed through, and the people passed out: women and children first, then the elders, then the young men. The last to leave walked backwards, so that their footprints seemed to lead into the town and not away from it.',
        'A line of people slipping at night through a gap in an earth wall, with drummers playing in the background.'
      ),
      pg(
        '🏝️',
        'The groups went different ways, and they became the many Ewe peoples of Ghana and Togo. One group, led by an elder named Wenya and his nephew Sri, travelled south to the coast. They reached a narrow strip of sand between the sea and a great lagoon. Wenya, old and tired, is said to have told them that he had curled up and could go no further. From his words came the name Anlo. Their capital was built at Anloga. Sri became the first king, the Awoamefia, a ruler who was honoured as sacred and lived apart from public view.',
        'A narrow strip of sandy land with palm trees, the sea on one side and a wide lagoon on the other.'
      ),
      pg(
        '🧂',
        'It was a hard land to live in. The soil was sandy and the sea was rough. The Anlo learned to use what they had. From the Keta Lagoon they collected salt and traded it far inland. They became famous sea fishermen, and their crews still work beaches all along the coast of West Africa. At Anloga, farmers found a way to grow shallots in sand. Weavers at Agbozume made fine cloth. A war leader, the Awadada, commanded the army. Today the sea itself is the enemy at Keta. It has washed away whole streets, and a sea wall now protects the town.',
        'Fishermen hauling a long net onto a beach, with heaps of white salt drying beside a lagoon behind them.'
      ),
      pg(
        '🕊️',
        'Before Hogbetsotso begins, there is a time for making peace. Families and neighbours must settle their quarrels, and the towns are swept clean. Only then can the celebration start. So the festival does three things. It keeps a people’s history alive without a single written page. It reminds leaders that people will leave a ruler who treats them badly. And it teaches that a new beginning needs clean hearts as well as clean streets. Each time the dancers step backwards at Anloga, they are telling their children where they came from, and why.',
        'Neighbours sweeping a sandy street together in front of their houses.'
      ),
    ],
    activities: [
      {
        id: 'an-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why did the elders at Notsie decide to leave?',
        options: [
          'The town was too small',
          'King Agorkoli treated the people harshly',
          'They wanted to live nearer the sea',
        ],
        correctIndex: 1,
      },
      {
        id: 'an-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'How was the wall at Notsie weakened?',
        options: [
          'It was burned with fire',
          'It was knocked down by elephants',
          'The women threw water on one spot until the earth became soft',
        ],
        correctIndex: 2,
      },
      {
        id: 'an-c3',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did the last people to leave walk backwards?',
        options: [
          'So that their footprints would seem to lead into the town',
          'Because the path was narrow',
          'To watch the drummers',
        ],
        correctIndex: 0,
      },
      {
        id: 'an-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Before Hogbetsotso, people must settle their quarrels. Which school practice is most like this?',
        options: [
          'Punishing the whole class',
          'Solving a disagreement between classmates before starting a group project',
          'Cancelling break time',
        ],
        correctIndex: 1,
      },
      {
        id: 'an-s1',
        type: 'sequencing',
        prompt: 'Put the steps of the escape and settlement in order.',
        items: [
          'The Ewe settle inside the walls of Notsie',
          'King Agorkoli gives the people cruel tasks',
          'The women soften the wall with water',
          'The people leave at night, the last walking backwards',
          'Wenya and Sri lead one group to the coast and found Anlo',
        ],
      },
      {
        id: 'an-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'lagoon',
        definition: 'A stretch of shallow water separated from the sea by a strip of land.',
        distractors: [
          'A deep well dug for drinking water',
          'A wall built to keep out the sea',
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
        word: 'tradition',
        definition: 'Beliefs, stories, and customs passed down from older people to younger ones.',
        pages: [2],
      },
      {
        word: 'ancestors',
        definition: 'Family members who lived long ago.',
        pages: [2],
      },
      {
        word: 'elders',
        definition: 'Older, respected members of a community.',
        pages: [2, 3],
      },
      {
        word: 'lagoon',
        definition: 'A stretch of shallow water separated from the sea by a strip of land.',
        pages: [4, 5],
      },
      {
        word: 'capital',
        definition: 'The chief town of a kingdom or country.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B8.4.2.1.1, Strand 4: Law and Order, Sub-Strand 2: Conflict Prevention and Management (Examine ways of preventing and managing conflict in the community). Primary History foundation: B4.2.5.1.1.',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: Hogbetsotso is held at Anloga on the first Saturday of November. Notsie is in Togo; Ketu is in Benin. The Keta Lagoon is the largest in Ghana, and sea erosion at Keta is a present-day problem. Teach the escape as oral tradition.',
    ],
    reviewQuestions: [
      'Ask the Anlo Traditional Council or an Ewe historian to confirm names and spellings (Notsie, Agorkoli, Wenya, Sri, Awoamefia, Awadada).',
      'Check that King Agorkoli is described as the tradition describes him, without adding detail.',
    ],
    guide: {
      overview:
        'Retells the Ewe migration from Notsie and the founding of Anlo, shows how the people adapted to a difficult coast, and explains Hogbetsotso.',
      lessonMinutes: 45,
      goals: [
        'Retell the tradition of the escape from Notsie.',
        'Explain how Anlo was founded and how it was led.',
        'Describe how the Anlo made a living between lagoon and sea.',
        'Explain three things the Hogbetsotso festival does.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B8.4.2.1.1: Strand 4: Law and Order, Sub-Strand 2: Conflict Prevention and Management)', 'The Anlo Ewe and Hogbetsotso'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Counting weeks and days; subtraction'],
      ],
      before: ['Ask: how can a people remember its history if nothing was written down?'],
      during: ['After Page 3, discuss why the women’s part in the plan was so important.'],
      after: ['Learners draw the escape as a four-picture strip with captions.'],
      discussion: ['The story says that people will leave a ruler who treats them badly. Is that still true today? How?'],
      reflection: ['Is there a quarrel you could settle this week to make a fresh start?'],
      maths: [
        {
          task: 'If the women threw water on the wall every day for 6 weeks, for how many days did they do it?',
          answer: '6 × 7 = 42 days.',
        },
        {
          task: 'A fishing crew lands 240 kg of fish and shares it equally among 12 members. How much does each receive?',
          answer: '240 ÷ 12 = 20 kg.',
        },
      ],
      support: ['Act out the escape in the classroom, with the last learners walking backwards to the door.'],
      stretch: ['Find out the names of three other Ewe groups that left Notsie and where they settled.'],
      localise: ['Ask an elder for the migration story of your own people. Where did they come from, and why did they move?'],
      factCheck: [
        {
          claim: 'Migration from Ketu to Notsie, King Agorkoli, escape by softening the wall and walking backwards, Wenya and Sri founding Anlo, and Hogbetsotso at Anloga.',
          explanation:
            'The migration from Ketu to Notsie, King Agorkoli, the softened wall, the backward walk, Wenya and Sri, and the origin of the name Anlo are oral tradition and should be taught as such. The festival date, the lagoon, shallot farming at Anloga, and the Keta sea defence come from general knowledge and should be confirmed.',
          reference: 'NaCCA CCP Social Studies curriculum (NaCCA, 2021) B8.4.2.1.1; Primary History B4.2.5.1.1.',
        },
      ],
    },
  }),

  // 7
  mk({
    key: 'dagbon-the-kingdom-of-the-drum-historians',
    title: 'Dagbon: The Kingdom of the Drum Historians',
    summary:
      'In Dagbon, history is kept by drummers. This article tells how the kingdom began with the children of Naa Gbewaa, how it grew around Yendi, and how the lunsi have carried its story for centuries.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Rhythmic, clear, and dignified',
    palette: ['#92400e', '#1e40af'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Lunga and gungon drums in a steady Damba rhythm (placeholder)',
    pages: [
      pg(
        '🥁',
        'It is evening in front of the palace at Yendi. A drummer steps forward with a drum shaped like an hourglass, held under his arm. As he squeezes its strings, the drum’s voice rises and falls like a person speaking. He begins to chant. He names a king who ruled five hundred years ago, then that king’s son, then the next, and on through the night. He holds no book. In Dagbon, the drummers are the historians. They are called lunsi, and what they carry in memory is the story of one of the oldest kingdoms in Ghana.',
        'A drummer in a smock playing an hourglass-shaped drum under his arm before a round palace building at dusk.'
      ),
      pg(
        '🏹',
        'The lunsi begin with a hunter. Tradition says that long ago a brave man called Tohazie, the red hunter, came from the east. His grandson, Naa Gbewaa, settled at Pusiga, near Bawku in the far north-east of Ghana, and ruled there. After Gbewaa died, his children quarrelled and went different ways. One son founded Mamprugu, with its king, the Nayiri, at Nalerigu. Another, Sitobu, founded Dagbon. A third founded Nanung, around Bimbilla. To this day, the three kingdoms call one another brothers, and Mamprugu is honoured as the eldest.',
        'A map of northern Ghana marking Pusiga, Nalerigu, Yendi, and Bimbilla, joined by arrows from Pusiga.'
      ),
      pg(
        '🐎',
        'Sitobu’s son, Naa Nyagse, made Dagbon large. Riding with horsemen, he brought town after town under his rule, in about the 1400s, and placed his sons and relatives over them as chiefs. The king took the title Ya-Na. The first capital stood in the west of the kingdom. In the 1600s, after wars with the neighbouring kingdom of Gonja, the capital was moved east to the place now called Yendi. In the north, a chief does not sit on a stool. He sits on the skins of animals, and so a new chief is said to be enskinned.',
        'Horsemen in flowing robes riding across open grassland towards a town of round houses.'
      ),
      pg(
        '📿',
        'Around 1700, a king named Naa Zanjina came to the skin. He is remembered as the Ya-Na who welcomed Islam, invited Muslim teachers and traders, and encouraged weaving and trade. Dagbon lay on the road between the forest and the markets of Hausaland, far to the north-east. Kola nuts, salt, cloth, and cattle passed through its towns. Later in the 1700s, Asante became the stronger power, and for many years Dagbon had to send tribute to Kumasi. Yet the kingdom kept its own king, its own laws, and its own drummers.',
        'A weaver at a narrow loom making strips of striped cloth, with a small mud-built mosque behind him.'
      ),
      pg(
        '🎊',
        'You can see Dagbon’s history in its festivals. At Damba, chiefs in great smocks ride decorated horses, and the people dance to the lunsi. At the Fire Festival, crowds carry burning torches of grass through the night. You can wear that history too. The smock, sewn from strips of hand-woven cotton, is now national dress, worn across Ghana. Dagbon has known trouble as well, including a long and painful dispute over who should be king. In 2019, with the help of other chiefs, a new Ya-Na was enskinned in peace.',
        'Chiefs in wide embroidered smocks riding decorated horses past a cheering crowd.'
      ),
      pg(
        '🧠',
        'Think again about the drummer at Yendi. A boy born into a family of lunsi starts to learn as a small child. He must remember hundreds of names, praises, and stories exactly, and he will teach them to the children after him. In this way, a history has travelled across five centuries without paper. Written records are not the only records. When an old drummer or storyteller dies with his knowledge unrecorded, a library is lost. Ghana needs its books, and it needs people who will listen, learn, and write down what the elders know.',
        'An old drummer teaching a young boy who holds a small drum, both seated under a tree.'
      ),
    ],
    activities: [
      {
        id: 'da-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Who keeps the history of Dagbon?',
        options: [
          'Drummers called lunsi',
          'Foreign visitors',
          'Market traders',
        ],
        correctIndex: 0,
      },
      {
        id: 'da-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'According to tradition, how are Mamprugu, Dagbon, and Nanung related?',
        options: [
          'They were always enemies',
          'They were founded by Europeans',
          'They were founded by sons of Naa Gbewaa and call one another brothers',
        ],
        correctIndex: 2,
      },
      {
        id: 'da-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What is Naa Zanjina remembered for?',
        options: [
          'Moving the capital to the coast',
          'Welcoming Islam and encouraging trade and weaving',
          'Defeating Asante',
        ],
        correctIndex: 1,
      },
      {
        id: 'da-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Your grandmother knows the history of your family, but nothing is written down. Using the article, what is the best thing to do?',
        options: [
          'Wait until you are older',
          'Listen carefully, ask questions, and write or record what she tells you',
          'Assume someone else will remember',
        ],
        correctIndex: 1,
      },
      {
        id: 'da-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'Naa Gbewaa rules at Pusiga',
          'Sitobu founds Dagbon',
          'Naa Nyagse brings many towns under Dagbon',
          'The capital is moved east to Yendi',
          'Naa Zanjina welcomes Islam',
        ],
      },
      {
        id: 'da-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'enskinned',
        definition: 'Made a chief in northern Ghana, where a chief sits on animal skins.',
        distractors: [
          'Dressed in a new smock',
          'Sent away from the kingdom',
        ],
      },
    ],
    glossary: [
      {
        word: 'lunsi',
        definition: 'The drummers of Dagbon, who keep and recite its history.',
        pages: [1, 2, 5, 6],
      },
      {
        word: 'tradition',
        definition: 'Beliefs, stories, and customs passed down from older people to younger ones.',
        pages: [2],
      },
      {
        word: 'capital',
        definition: 'The chief town of a kingdom or country.',
        pages: [3],
      },
      {
        word: 'enskinned',
        definition: 'Made a chief in northern Ghana, where a chief sits on animal skins.',
        pages: [3, 5],
      },
      {
        word: 'tribute',
        definition: 'Payment that a weaker state must give to a stronger one.',
        pages: [4],
      },
      {
        word: 'smock',
        definition: 'A loose garment sewn from strips of hand-woven cotton.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.4.4.1.1, Strand 4: Law and Order, Sub-Strand 4: Peace and Security in Our Nation (Examine the relevance of peace and security in our community). Primary History foundation: B4.2.5.1.1.',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: the Ya-Na’s palace is at Yendi in the Northern Region. Mamprugu is regarded as the senior of the kingdoms founded by Gbewaa’s children. The chieftaincy dispute is a sensitive subject; the article mentions it once, briefly and neutrally.',
    ],
    reviewQuestions: [
      'Ask a Dagbani-speaking historian or the Dagbon Traditional Council to confirm names, spellings, and the order of the early kings.',
      'Read Page 5 with care and keep the neutral wording about the dispute.',
    ],
    guide: {
      overview:
        'Introduces Dagbon through its drum historians: its origin with Naa Gbewaa’s children, its growth, its links with Islam and trade, and the value of oral history.',
      lessonMinutes: 45,
      goals: [
        'Explain who the lunsi are and what they do.',
        'Retell the tradition linking Mamprugu, Dagbon, and Nanung.',
        'Describe how Dagbon grew and what Naa Zanjina is remembered for.',
        'Explain why oral history is a real source of knowledge.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.4.4.1.1: Strand 4: Law and Order, Sub-Strand 4: Peace and Security in Our Nation)', 'Dagbon and oral tradition'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Counting generations; subtraction'],
      ],
      before: ['Ask: could you name your great-grandparents? How do families remember names without writing?'],
      during: ['After Page 2, draw the family tree of Naa Gbewaa’s children and the kingdoms they founded.'],
      after: ['Each learner records one short family or community story from an elder and shares it.'],
      discussion: ['Is history kept by drummers less true than history kept in books? What are the strengths of each?'],
      reflection: ['What knowledge in your family could be lost if nobody writes it down?'],
      maths: [
        {
          task: 'If each king rules for about 20 years on average, about how many kings would rule in 500 years?',
          answer: '500 ÷ 20 = 25 kings.',
        },
        {
          task: 'A young drummer learns 5 new praise names every week. How many does he know after 40 weeks?',
          answer: '5 × 40 = 200 praise names.',
        },
      ],
      support: ['Play or imitate a talking-drum phrase and let learners copy the rise and fall with their voices.'],
      stretch: ['Find out about Yennenga, said to be a daughter of the same family, and the kingdom her descendants founded in Burkina Faso.'],
      localise: ['Who keeps the history of your own community: drummers, linguists, praise singers, or elders? Find out how they learn it.'],
      factCheck: [
        {
          claim: 'Lineage from Tohazie (via Kpogonumbo) to his grandson Naa Gbewaa, founding of Mamprugu, Dagbon, and Nanung, shift to Yendi, Naa Zanjina, and 2019 enskinment.',
          explanation:
            'The line from Tohazie to his grandson Naa Gbewaa and the founding of Mamprugu, Dagbon, and Nanung are oral tradition; early dates are estimates and differ between sources. The move of the capital, Naa Zanjina, tribute to Asante, and the peaceful enskinment of 2019 come from general historical knowledge and should be confirmed by a historian.',
          reference: 'NaCCA CCP Social Studies curriculum (NaCCA, 2021) B9.4.4.1.1; Primary History B4.2.5.1.1.',
        },
      ],
    },
  }),

  // 8
  mk({
    key: 'gonja-the-kingdom-of-the-horsemen',
    title: 'Gonja: The Kingdom of the Horsemen',
    summary:
      'Horsemen from the lands of old Mali founded a kingdom across the savanna of northern Ghana. This article tells of Ndewura Jakpa, the rotating kingship of Gonja, its written chronicle, and the market of Salaga.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'historical'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'vocabulary', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Open, steady, and clear',
    palette: ['#78350f', '#0f766e'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Slow savanna flute over soft calabash drums (placeholder)',
    pages: [
      pg(
        '🕌',
        'In the village of Larabanga, near Mole National Park, stands a small mosque unlike any modern building. Its walls are made of mud, painted white, and held up by thick buttresses. Dark wooden poles stick out from the towers like the quills of a porcupine. The same style can be seen far away in Mali, along the River Niger. Nobody is sure of the mosque’s age, but it is among the oldest in Ghana. It is a sign that people, ideas, and faith once travelled here from the north-west. Those travellers built the kingdom of Gonja.',
        'A small white mud-built mosque with pointed towers and wooden poles sticking out of its walls, beside a large tree.'
      ),
      pg(
        '🐴',
        'About five hundred years ago, the great empire of Mali controlled much of the gold trade of West Africa. Tradition says that a party of Mande horsemen rode south-east from Mali towards the lands where the gold came from. With them came Muslim scholars and traders. They did not go home. They settled among the peoples north of the Black Volta. They married local women and in time spoke the local language. From this meeting of newcomers and older inhabitants, a new ruling group arose. They were known as the Ngbanya, and their state was Gonja.',
        'A group of horsemen in robes and turbans riding through tall grass beside a broad river.'
      ),
      pg(
        '🗡️',
        'The hero of Gonja history is Ndewura Jakpa, who lived in the 1600s. His name is said to mean the lord who conquers with the spear. Riding at the head of his horsemen, Jakpa pushed the borders of Gonja east and south until the kingdom stretched across much of the savanna of what is now northern Ghana. He is said to have had Muslim advisers who prayed for his victories. When he grew old, he divided the land among his sons. Each became chief of a division, such as Bole, Wasipe, Kpembe, Tuluwe, and Kusawgu.',
        'A king on horseback holding a long spear, with riders behind him on a wide grassy plain.'
      ),
      pg(
        '🔁',
        'This sharing shaped the way Gonja is governed. The king of all Gonja is called the Yagbonwura. He does not come from one royal house only. The kingship rotates: it passes in turn among the leading divisions founded by Jakpa’s sons. So every division knows that its turn will come, and none is shut out for ever. The Yagbonwura’s seat is at Damongo. Gonja has another treasure. In the 1700s, its Muslim scholars wrote down the history of the kingdom in Arabic. This chronicle is one of the oldest written histories made in Ghana.',
        'A circle of five chiefs’ seats with an arrow passing from one to the next around the ring.'
      ),
      pg(
        '🌰',
        'Gonja’s wealth came from standing in the middle. In the forest to the south grew kola nuts, which do not grow in the dry north. Asante traders carried kola to the Gonja town of Salaga. There they met caravans from Hausaland, Mossi country, and beyond, bringing cloth, leather, salt, horses, and cattle. For a time, Salaga was one of the busiest markets in West Africa. It had a dark side as well. Captives were sold there as slaves, and the old wells and market ground are kept today as a place of memory. In the 1700s, Asante made Gonja pay tribute.',
        'A busy savanna market with baskets of kola nuts, tethered donkeys, and traders in long robes.'
      ),
      pg(
        '🧵',
        'What does Gonja leave us? First, it shows that Ghana’s history has never stopped at its borders. Horsemen from Mali, scholars writing Arabic, and caravans from Hausaland all helped to make a Ghanaian kingdom. Second, it shows one way of sharing power, by letting it rotate so that every division has a turn. Third, at Salaga, it teaches us to remember the painful parts of the past as honestly as the proud ones. Each year, the people of Damongo and other Gonja towns celebrate the Damba festival, and the drums praise Jakpa’s name once more.',
        'A festival scene with drummers, dancers in smocks, and a chief seated under a large umbrella.'
      ),
    ],
    activities: [
      {
        id: 'go-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'According to tradition, where did the founders of Gonja come from?',
        options: [
          'From the coast of Ghana',
          'From the empire of Mali',
          'From across the sea',
        ],
        correctIndex: 1,
      },
      {
        id: 'go-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'How is the Yagbonwura chosen?',
        options: [
          'The kingship rotates among the leading divisions',
          'By an election of all citizens',
          'He is always the eldest son of the last king',
        ],
        correctIndex: 0,
      },
      {
        id: 'go-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why did Salaga become a great market?',
        options: [
          'It was a seaport',
          'Gold was mined there',
          'Kola from the forest met caravans from the north there',
        ],
        correctIndex: 2,
      },
      {
        id: 'go-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Three houses in a school each want their own member to be sports captain every year. Which Gonja idea could solve the quarrel?',
        options: [
          'Let the biggest house always win',
          'Rotate the position so that each house has its turn',
          'Have no captain at all',
        ],
        correctIndex: 1,
      },
      {
        id: 'go-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'Mande horsemen ride south-east from Mali',
          'The newcomers settle and the Gonja state begins',
          'Ndewura Jakpa enlarges the kingdom',
          'Jakpa divides the land among his sons',
          'Scholars write the history of Gonja in Arabic',
        ],
      },
      {
        id: 'go-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'rotates',
        definition: 'Passes from one to the next in turn.',
        distractors: [
          'Stays in one family for ever',
          'Is decided by a battle',
        ],
      },
    ],
    glossary: [
      {
        word: 'empire',
        definition: 'A large state that rules over many peoples and lands.',
        pages: [2],
      },
      {
        word: 'tradition',
        definition: 'Beliefs, stories, and customs passed down from older people to younger ones.',
        pages: [2],
      },
      {
        word: 'scholars',
        definition: 'People who have studied deeply and can read and write well.',
        pages: [2, 4, 6],
      },
      {
        word: 'division',
        definition: 'One of the parts into which a kingdom is split, each with its own chief.',
        pages: [3, 4, 6],
      },
      {
        word: 'rotates',
        definition: 'Passes from one to the next in turn.',
        pages: [4],
      },
      {
        word: 'chronicle',
        definition: 'A written record of events in the order they happened.',
        pages: [4],
      },
      {
        word: 'caravans',
        definition: 'Groups of traders travelling together with loaded animals.',
        pages: [5, 6],
      },
    ],
    culturalNotes: [
      'Curriculum link: JHS Social Studies B9.4.5.3.1, Strand 4: Law and Order, Sub-Strand 5: Promoting Democracy and Political Stability (Assess the significance of political stability in national development). Primary History foundation: B4.2.5.1.1.',
      'Original article written for Ghanaian JHS learners from widely known history and oral tradition. It is not copied from any book.',
      'Local accuracy: Larabanga and Damongo are in the Savannah Region. Salaga, in East Gonja, keeps its slave wells and market site as a memorial. The age of the Larabanga mosque is disputed. The mention of slavery on Page 5 should be taught with care.',
    ],
    reviewQuestions: [
      'Ask the Gonja Traditional Council or a historian to confirm the list of divisions and how the kingship rotates.',
      'Confirm the month of the Damba festival, which follows the Islamic calendar and moves through the year.',
    ],
    guide: {
      overview:
        'Introduces Gonja: its Mande founders, Ndewura Jakpa, its rotating kingship, its Arabic chronicle, and the market of Salaga.',
      lessonMinutes: 45,
      goals: [
        'Explain the tradition of how Gonja was founded.',
        'Describe what Ndewura Jakpa is remembered for.',
        'Explain how the kingship rotates and why this reduces conflict.',
        'Describe the trade of Salaga, including its part in the slave trade.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP B9.4.5.3.1: Strand 4: Law and Order, Sub-Strand 5: Promoting Democracy and Political Stability)', 'Gonja and the Salaga market'],
        ['Mathematics (NaCCA CCP: number and time; codes to verify)', 'Rotation and cycles; multiplication'],
      ],
      before: ['Ask: if several families all have a right to lead, how can the choice be made fairly?'],
      during: ['After Page 4, act out a rotation with five “divisions” to see how long each waits for its turn.'],
      after: ['Learners write three sentences on why a people should remember painful history as well as proud history.'],
      discussion: ['What are the strengths and weaknesses of rotating leadership compared with electing a leader?'],
      reflection: ['Which part of your own community’s past is difficult to talk about? Why might it still matter?'],
      maths: [
        {
          task: 'Five divisions take turns to provide the king. If each king rules for about 12 years, how long does a division wait from the end of one turn to the start of its next?',
          answer: '4 × 12 = 48 years.',
        },
        {
          task: 'A trader takes 30 baskets of kola to Salaga and sells each for 8 pieces of cloth. How many pieces of cloth does he receive?',
          answer: '30 × 8 = 240 pieces of cloth.',
        },
      ],
      support: ['Show photographs of the Larabanga mosque and a mosque in Mali and let learners find what is alike.'],
      stretch: ['Find out about the empire of Mali and its most famous ruler, Mansa Musa.'],
      localise: ['Find out how the chief of your own town is chosen. Does the position rotate between families or “gates”?'],
      factCheck: [
        {
          claim: 'Mande origin, Ndewura Jakpa (1600s), rotating kingship among divisions, 1700s Kitab Ghanja Arabic chronicle, and Salaga kola/caravan market.',
          explanation:
            'The Mande origin, Ndewura Jakpa (1600s), the division of the kingdom, the rotating kingship, the Arabic chronicle of the 1700s, Salaga’s trade, and tribute to Asante come from general historical knowledge and oral tradition; dates are approximate. Damba follows the Islamic calendar, so its date moves from year to year.',
          reference: 'NaCCA CCP Social Studies curriculum (NaCCA, 2021) B9.4.5.3.1; Primary History B4.2.5.1.1.',
        },
      ],
    },
  }),
];

export const BATCH_42_KINGDOMS_ARTICLES = BATCH_43_STORIES;

