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
 * Batch 48 (8 more African folk tales and legends retold as six-page stories with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to English Language (oral literature) and Social Studies (see the first cultural note and the teacher guide).
 * These are traditional tales retold in original words. Each has named characters, listed in `characters`.
 * Original text written for Ghanaian learners; folk tales exist in many versions; each factCheck note says where the tale is told.
 */

export const BATCH_48_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'the-singing-tortoise',
    title: 'The Singing Tortoise',
    summary:
      'A hunter finds a tortoise that sings and promises to keep her secret. An Akan tale from Ghana about a broken promise and the trouble people bring on themselves.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'ghana', 'akan', 'promises'],
    wpm: 125,
    paceWord: 'Quiet and wondering, then tense',
    palette: ['#166534', '#a16207'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Ofori: a young hunter with a gun and a leather bag, good-natured but fond of attention.',
      'The tortoise: a small forest tortoise with a sweet singing voice, who plays a tiny stringed instrument.',
      'The chief: a stern chief seated under a state umbrella, who dislikes being made a fool of.',
      'The townspeople: a curious crowd.',
    ],
    music: 'Soft, plucked seperewa-style strings with a slow drum (placeholder)',
    pages: [
      pg(
        '🎵',
        'A hunter named Ofori went deep into the forest one day, further than he had ever gone. He had caught nothing, and he sat down under a tree to rest. Then he heard music. Someone was singing in a small, sweet voice and plucking the strings of an instrument. Ofori crept towards the sound. In a clearing sat a tortoise. She held a tiny harp between her feet, and she was singing: “It is man who brings trouble on himself. Trouble does not go looking for man.” Ofori had never seen or heard anything so wonderful.',
        'A hunter peering through leaves at a small tortoise playing a tiny harp in a forest clearing.'
      ),
      pg(
        '🤫',
        'He came back the next day, and the day after, to listen. At last he spoke. “Tortoise, the forest is no place for a singer like you. Come and live in my house. I will feed you and keep you safe.” The tortoise was silent for a while. “I will come,” she said, “on one condition. You must tell nobody that I can sing. I will sing for you alone, when the door is shut.” “I promise,” said Ofori. He carried her home in his bag, and every evening she sang for him.',
        'A hunter carrying a tortoise carefully in a leather bag along a forest path towards a town.'
      ),
      pg(
        '🗣️',
        'For some weeks, Ofori was happy. But a secret is a heavy load. He looked at his neighbours and thought, “If only they knew what I have in my house!” One evening, sitting with friends, he could bear it no longer. “I have a tortoise that sings and plays the harp,” he said. They laughed at him. “A singing tortoise! You have been too long in the sun.” Ofori grew angry. “It is true! I swear it!” The story ran through the town like fire through dry grass, and by morning it had reached the chief.',
        'A hunter boasting to a group of laughing friends outside a house in the evening.'
      ),
      pg(
        '👑',
        'The chief sent for Ofori. “I hear that you claim to own a tortoise that sings. Do you take us for fools?” “Nana, it is the truth,” said Ofori. “Then bring it before the whole town tomorrow,” said the chief. “If it sings, you shall have a rich reward. If it does not, you have lied to your chief, and you shall be beaten and driven from this town in disgrace.” Ofori was not afraid. He had heard the tortoise a hundred times. He ran home and told her everything. The tortoise said nothing at all.',
        'A hunter standing before a chief seated under a large umbrella, with elders on either side.'
      ),
      pg(
        '😰',
        'The next morning, the whole town gathered. Ofori set the tortoise on a stool in front of the chief and placed her little harp beside her. “Sing,” he said. The tortoise drew in her head. “Please sing,” said Ofori. The crowd waited. A child giggled. “Sing as you sing for me!” he begged. An hour passed. The tortoise sat as still as a stone. The chief rose. “You have wasted the time of your chief and your town,” he said. Ofori was beaten and driven out through the gate, and the people shouted after him.',
        'A tortoise with her head drawn into her shell sitting on a stool before a chief, while a hunter pleads with her.'
      ),
      pg(
        '🐢',
        'When he had gone, there was a silence. Then, from the stool, came a small, sweet voice: “It is man who brings trouble on himself. Trouble does not go looking for man.” The people stared. The chief sat down heavily. “The hunter spoke the truth,” he said. “Yes,” said the tortoise. “I was happy in the forest. He brought me here. He gave his word and broke it. He boasted, and he swore. All his trouble was of his own making.” Then she climbed down and walked slowly back to the forest. The elders tell this tale when someone cannot keep a promise.',
        'A tortoise singing on a stool as astonished townspeople and a chief look on.'
      ),
    ],
    activities: [
      {
        id: 'st-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'On what condition did the tortoise agree to live with Ofori?',
        options: [
          'He must feed her every day',
          'He must tell nobody that she could sing',
          'He must take her to the chief',
        ],
        correctIndex: 1,
      },
      {
        id: 'st-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did Ofori break his promise?',
        options: [
          'He wanted his neighbours to know what he had',
          'The chief forced him',
          'The tortoise asked him to',
        ],
        correctIndex: 0,
      },
      {
        id: 'st-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did the tortoise do in front of the chief and the town?',
        options: [
          'She sang beautifully',
          'She ran away',
          'She stayed completely silent',
        ],
        correctIndex: 2,
      },
      {
        id: 'st-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A friend tells you a secret and asks you not to share it. You are tempted to post it online to get attention. Using the tale, what is likely to happen if you do?',
        options: [
          'You will gain respect',
          'You will lose trust and bring trouble on yourself',
          'Nothing at all',
        ],
        correctIndex: 1,
      },
      {
        id: 'st-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Ofori hears a tortoise singing in the forest',
          'He promises to tell nobody',
          'He boasts to his friends and the chief hears of it',
          'The tortoise is silent before the town and Ofori is driven out',
          'The tortoise sings and returns to the forest',
        ],
      },
      {
        id: 'st-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'disgrace',
        definition: 'The loss of respect because of something one has done.',
        distractors: [
          'A rich reward',
          'A stringed instrument',
        ],
      },
    ],
    glossary: [
      {
        word: 'clearing',
        definition: 'An open space in a forest.',
        pages: [1],
      },
      {
        word: 'condition',
        definition: 'Something that must be agreed to before something else is allowed.',
        pages: [2],
      },
      {
        word: 'boasted',
        definition: 'Spoke too proudly about oneself or one’s things.',
        pages: [6],
      },
      {
        word: 'reward',
        definition: 'Something given in return for a good deed.',
        pages: [4],
      },
      {
        word: 'disgrace',
        definition: 'The loss of respect because of something one has done.',
        pages: [4],
      },
      {
        word: 'begged',
        definition: 'Asked very earnestly.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Where it is told: an Akan tale from Ghana. The tortoise’s song is a well-known Akan saying about people bringing trouble on themselves.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'In older tellings the hunter’s punishment is harsher. Here he is beaten and driven out, which is enough for discussion.',
    ],
    reviewQuestions: [
      'Ask a Twi-speaking reviewer to confirm the sense of the tortoise’s song.',
      'The name Ofori was chosen for this retelling; confirm it is suitable.',
    ],
    guide: {
      overview:
        'An Akan tale about a hunter who cannot keep a secret, teaching the cost of boasting and broken promises.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain the promise and how it was broken.',
        'Explain the meaning of the tortoise’s song.',
        'Apply the lesson to keeping confidences today.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading for theme; the role of a repeated saying'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Folk tales as part of national culture; honesty and trust'],
      ],
      before: ['Ask: why is it so hard to keep a secret?'],
      during: ['Stop after Page 4. Ask: will the tortoise sing? Why or why not?'],
      after: ['Learners write about a time when keeping, or breaking, a promise mattered.'],
      discussion: ['Was the tortoise fair to stay silent? Did the punishment fit what Ofori did?'],
      reflection: ['Which promise are you finding hard to keep?'],
      maths: [],
      support: ['Read the tortoise’s song together at the start and the end, so learners hear how its meaning changes.'],
      stretch: ['Write the story as the tortoise would tell it to other forest animals.'],
      localise: ['Find a proverb in your language about people who cause their own trouble.'],
      factCheck: ['An Akan tale from Ghana told in several versions. No dates or facts need checking, but confirm the wording of the saying with a Twi speaker. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 2
  mk({
    key: 'yennenga-the-princess-on-the-stallion',
    title: 'Yennenga, the Princess on the Stallion',
    summary:
      'A warrior princess of the north rides away from her father’s court and becomes the mother of a nation. A legend of the Mossi people of Burkina Faso, which begins in what is now northern Ghana.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['legend', 'burkina-faso', 'mossi', 'ghana-link'],
    wpm: 125,
    paceWord: 'Bold, sweeping, and proud',
    palette: ['#b91c1c', '#15803d'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Yennenga: a tall, strong princess in riding dress, with a spear and a white stallion.',
      'The king: her father, a powerful ruler who loves her and will not let her go.',
      'Riale: a quiet elephant hunter who lives alone in the forest.',
      'Ouedraogo: their son, a fearless boy named after his mother’s horse.',
    ],
    music: 'Galloping drum rhythm with a bright flute (placeholder)',
    pages: [
      pg(
        '🐎',
        'Many centuries ago, a great king ruled in the north, at Gambaga, in what is now Ghana. He had a daughter named Yennenga. She was beautiful, but that was the least of it. She could ride any horse in her father’s stables and throw a spear further than his captains. By the age of fourteen, she was riding to war beside him. Soon she led her own troop of horsemen. No enemy could stand before her. The king was proud. “My daughter is worth more to me than ten sons,” he said. And that was the beginning of the trouble.',
        'A young princess in riding dress on a white stallion, holding a spear, at the head of a troop of horsemen.'
      ),
      pg(
        '🌾',
        'The years passed. Yennenga’s friends married and had children. Suitors came for her from distant kingdoms, and the king sent every one of them away. “I need her for my wars,” he said. Yennenga asked him, and asked again, and he would not listen. So she found another way to speak. She planted a field of okra. When it was ripe, she did not harvest it. She let it wither and rot on the stalk. The king saw it and was angry. “Why have you let good food spoil?” “Father,” she said, “that is what you are doing to me.”',
        'A princess standing beside a field of withered okra plants, speaking to her frowning father.'
      ),
      pg(
        '🌙',
        'The king understood her very well. But he was a stubborn man, and instead of giving way, he had her shut in her rooms. One night, with the help of one of her father’s horsemen, Yennenga slipped out. She dressed as a man, mounted her white stallion, and rode north. She rode for many days. She crossed rivers and plains she had never seen. At last her horse, tired and frightened by a lion, bolted with her into a great forest. Lost and exhausted, she came to a small hut among the trees.',
        'A rider dressed as a man galloping north on a white stallion beneath a moonlit sky.'
      ),
      pg(
        '🏹',
        'In the hut lived a man named Riale. He was a hunter of elephants and lived alone. He gave the stranger water and food and asked no questions. For some days, Yennenga rested there and went hunting with him. Riale had never met such a rider or such a shot. Then, one day, her head-cloth slipped, and he saw that his guest was a woman. Yennenga told him who she was. In time, the two of them married. They had a son. Yennenga named him Ouedraogo, which means stallion, after the horse that had carried her to freedom.',
        'A hunter and a tall woman standing together outside a small forest hut, with a white stallion tethered nearby.'
      ),
      pg(
        '👦',
        'Ouedraogo grew up strong and fearless, his mother’s son. When he was about fifteen, Yennenga said, “It is time you met your grandfather.” She sent him south to Gambaga. The old king had long believed that his daughter was dead. When he learned that she lived and saw the boy who rode like her, he wept. He held a great feast. He begged Ouedraogo to stay, but the boy wished to return to his parents. So the king gave him gifts: horses, cattle, and a band of horsemen to go with him.',
        'A boy on horseback being embraced by an old king at the gate of a royal town, with riders and cattle behind.'
      ),
      pg(
        '🏰',
        'With those horsemen, Ouedraogo founded a kingdom of his own at Tenkodogo. His sons founded others, and together they became the Mossi kingdoms, which lasted for hundreds of years in the land that is now Burkina Faso. The Mossi honour Yennenga as the mother of their nation. Her horse is honoured too. Burkina Faso’s football team is called the Stallions, and the highest prize at Africa’s great film festival is a golden stallion named after her. Her story says that a daughter’s wishes matter as much as a son’s. It also joins two countries. The Mossi and the peoples of northern Ghana are cousins.',
        'A golden statue of a rearing stallion with a woman rider, set in a city square.'
      ),
    ],
    activities: [
      {
        id: 'yn-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What was unusual about Yennenga as a girl?',
        options: [
          'She refused to ride horses',
          'She was a skilled rider and warrior who led her own horsemen',
          'She lived alone in the forest',
        ],
        correctIndex: 1,
      },
      {
        id: 'yn-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What message did the rotting okra field carry?',
        options: [
          'That her father was wasting her life by not letting her marry',
          'That the rains had failed',
          'That she disliked farming',
        ],
        correctIndex: 0,
      },
      {
        id: 'yn-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What does the name Ouedraogo mean?',
        options: [
          'Hunter',
          'King',
          'Stallion',
        ],
        correctIndex: 2,
      },
      {
        id: 'yn-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A father will not let his clever daughter continue her schooling because she is useful at home. Using the legend, what should he consider?',
        options: [
          'That only sons’ plans matter',
          'That holding her back wastes her life, as the unharvested field was wasted',
          'That she should run away at once',
        ],
        correctIndex: 1,
      },
      {
        id: 'yn-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Yennenga leads her father’s horsemen in war',
          'She lets a field of okra rot as a message',
          'She escapes north on her stallion',
          'She marries Riale and their son Ouedraogo is born',
          'Ouedraogo founds a kingdom at Tenkodogo',
        ],
      },
      {
        id: 'yn-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'suitors',
        definition: 'Men who wish to marry a particular woman.',
        distractors: [
          'Soldiers who ride horses',
          'Farmers who grow okra',
        ],
      },
    ],
    glossary: [
      {
        word: 'troop',
        definition: 'A group of soldiers, especially on horseback.',
        pages: [1],
      },
      {
        word: 'suitors',
        definition: 'Men who wish to marry a particular woman.',
        pages: [2],
      },
      {
        word: 'wither',
        definition: 'To dry up and die.',
        pages: [2],
      },
      {
        word: 'stubborn',
        definition: 'Refusing to change one’s mind.',
        pages: [3],
      },
      {
        word: 'bolted',
        definition: 'Ran away suddenly, out of control.',
        pages: [3],
      },
      {
        word: 'founded',
        definition: 'Started or established.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: the founding legend of the Mossi people of Burkina Faso. In Ghana, the Mamprusi, Dagomba, and Nanumba tell of the same royal family, descended from Naa Gbewaa.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'The legend links to the Kingdoms of Ghana articles on Dagbon and Mamprugu. The king’s name and the details differ between Mossi and Ghanaian traditions.',
    ],
    reviewQuestions: [
      'Ask a reviewer who knows Mossi and Mamprusi traditions to confirm names (Yennenga, Riale, Ouedraogo) and the place of Gambaga.',
      'Check that the legend is not presented as exact history.',
    ],
    guide: {
      overview:
        'The Mossi founding legend of a warrior princess, used to discuss a daughter’s right to her own life and the shared roots of Ghana and Burkina Faso.',
      lessonMinutes: 45,
      goals: [
        'Retell the legend in order.',
        'Explain the message of the okra field.',
        'State how the Mossi kingdoms began, according to the legend.',
        'Explain the link between the Mossi and peoples of northern Ghana.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a legend; symbol and message'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Shared origins of West African peoples; gender and opportunity'],
      ],
      before: ['Ask: can a woman be a war leader? Name any you know from history.'],
      during: ['Stop after Page 2. Ask: why did Yennenga use a field and not words?'],
      after: ['Find Gambaga, Tenkodogo, and Ouagadougou on a map of West Africa.'],
      discussion: ['Was Yennenga right to leave without her father’s blessing? Was her father right to keep her?'],
      reflection: ['What would you most want the freedom to choose in your own life?'],
      maths: [],
      support: ['Tell the story with three objects: a toy horse, a dry leaf (the okra), and a small bow.'],
      stretch: ['Find out about Yaa Asantewaa and compare her with Yennenga.'],
      localise: ['Which women are remembered as leaders or founders in the history of your own people?'],
      factCheck: ['A founding legend; dates are uncertain and are often placed between the 1100s and 1400s. The football team’s name and the film festival’s golden stallion prize come from general knowledge and should be confirmed. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 3
  mk({
    key: 'why-the-sun-and-moon-live-in-the-sky',
    title: 'Why the Sun and Moon Live in the Sky',
    summary:
      'Long ago, the Sun and the Moon lived on earth, until they invited their friend Water to visit. A tale of the Efik people of Nigeria about hospitality and knowing your limits.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'nigeria', 'efik', 'why-tale'],
    wpm: 125,
    paceWord: 'Gentle, rising, and rounded',
    palette: ['#0369a1', '#f59e0b'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Sun: a broad, bright, generous figure in gold cloth, who loves to visit his friends.',
      'Moon: his wife, calm and silver, more cautious than her husband.',
      'Water: a tall, cool, blue-green figure with a deep voice, polite and very large.',
      'Water’s people: fish, crabs, turtles, and every creature of sea and river.',
    ],
    music: 'Flowing, rising melody with soft bells (placeholder)',
    pages: [
      pg(
        '🌞',
        'Many years ago, the Sun and the Moon lived on the earth, in a house like anyone else’s. The Sun’s best friend was Water. Almost every day, the Sun walked over to Water’s place to talk, and Water always made him welcome. But Water never came to visit the Sun in return. At last the Sun asked him why. “It is not that I do not wish to,” said Water. “Your house is too small. I do not travel alone, you see. My people go wherever I go, and there are a great many of them.”',
        'The Sun as a bright figure in gold cloth sitting and talking with Water, a tall blue-green figure, beside a river.'
      ),
      pg(
        '🏠',
        '“Then I shall build a bigger house,” said the Sun. “I should warn you,” said Water, “it would have to be very big indeed.” The Sun went home and told his wife, the Moon. She smiled, and the next day they began to build. They built a compound so wide that it took a morning to walk across it, with walls as high as the tallest palm tree. When it was finished, the Sun went to his friend. “My house is ready. There is room for you and all your people. Come tomorrow.”',
        'The Sun and the Moon building a very large compound with high walls.'
      ),
      pg(
        '🌊',
        'The next day, Water arrived at the gate. “Is it safe for me to come in?” he called. “Come in, my friend,” said the Sun. Water began to flow into the compound, and with him came the fish, the crabs, the turtles, and the water snakes. Soon the water was as deep as a man’s knee. “Is it still safe?” asked Water. “Yes, yes,” said the Sun. More came in. The water rose to the height of a man’s head. “Shall more of my people come?” “Let them all come,” said the Sun and the Moon together.',
        'Water flowing through a gateway into a compound, carrying fish, crabs, and turtles, as the Sun and Moon welcome him.'
      ),
      pg(
        '⬆️',
        'Water went on flowing. The Sun and the Moon had to climb onto the roof of their house to keep dry. “Do you still wish my people to come in?” asked Water. He was a polite guest, and he asked every time. The Sun did not like to say no to a friend he had invited. “Yes,” he said. The Moon looked at him, but she said nothing. More and more poured in: the great fish, the hippos, and the crocodiles. The water rose over the top of the roof.',
        'The Sun and the Moon sitting on the thatched roof of their house as water rises round it.'
      ),
      pg(
        '☁️',
        'There was nowhere left to stand. The Sun and the Moon were lifted off the roof. They rose higher and higher on the flood, up past the tops of the trees and up past the hills, until they reached the sky. There they found that they could stay. And there they have lived ever since. The Sun crosses the sky by day and the Moon by night. Water spread out over the low places of the earth and became the rivers, the lagoons, and the sea. He and the Sun are still friends.',
        'The Sun and the Moon rising into the sky above a flooded land, with rivers and sea spreading out below.'
      ),
      pg(
        '🌈',
        'The Efik people, who live beside the great rivers of south-eastern Nigeria, tell this tale to their children. They say it shows what true friendship looks like: the Sun built a new house for the sake of a visit, and Water asked at every step whether he was still welcome. But the old people add a quiet warning. Before you make a promise, find out how big it is. And when a friend asks, “Is it still safe?”, give him an honest answer. Kindness does not mean saying yes to everything.',
        'A wide river flowing to the sea at sunrise, with the Sun on the horizon and a pale Moon still in the sky.'
      ),
    ],
    activities: [
      {
        id: 'sm-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why did Water never visit the Sun?',
        options: [
          'He disliked the Moon',
          'The Sun’s house was too small for him and all his people',
          'He was too busy',
        ],
        correctIndex: 1,
      },
      {
        id: 'sm-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Water ask each time before bringing in more of his people?',
        options: [
          'Whether it was still safe to come in',
          'Whether there was food',
          'Whether the Moon was at home',
        ],
        correctIndex: 0,
      },
      {
        id: 'sm-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did the Sun keep saying yes?',
        options: [
          'He wanted more fish',
          'He did not hear the question',
          'He did not like to refuse a friend he had invited',
        ],
        correctIndex: 2,
      },
      {
        id: 'sm-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A friend asks whether twelve classmates can stay at your small house for a week. Your family cannot manage it. Using the tale, what is the kind and wise answer?',
        options: [
          'Say yes to avoid disappointing him',
          'Explain honestly what your family can manage',
          'Stop speaking to him',
        ],
        correctIndex: 1,
      },
      {
        id: 'sm-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The Sun visits Water, but Water never visits him',
          'The Sun and the Moon build a very large house',
          'Water and his people begin to flow in',
          'The Sun and the Moon climb onto the roof',
          'They are lifted into the sky, where they stay',
        ],
      },
      {
        id: 'sm-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'compound',
        definition: 'A group of buildings and yards enclosed by a wall.',
        distractors: [
          'A kind of large fish',
          'A promise made to a friend',
        ],
      },
    ],
    glossary: [
      {
        word: 'welcome',
        definition: 'Gladly received as a guest.',
        pages: [1, 6],
      },
      {
        word: 'compound',
        definition: 'A group of buildings and yards enclosed by a wall.',
        pages: [2, 3],
      },
      {
        word: 'polite',
        definition: 'Having good manners.',
        pages: [4],
      },
      {
        word: 'flood',
        definition: 'A great flow of water over land that is usually dry.',
        pages: [5],
      },
      {
        word: 'lagoons',
        definition: 'Stretches of shallow water separated from the sea by land.',
        pages: [5],
      },
      {
        word: 'honest',
        definition: 'Truthful.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale of the Efik and Ibibio peoples of south-eastern Nigeria, who live along the Cross River and the coast.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Science link: the tale is a story explanation. In science lessons, learners study why the Sun and Moon appear in the sky and how the sea and rivers are part of the water cycle.',
    ],
    reviewQuestions: [
      'Check that the lesson on Page 6 balances friendship with honest limits.',
      'Is the rising water clear and unfrightening when read aloud?',
    ],
    guide: {
      overview:
        'An Efik “why” tale explaining the place of the Sun and Moon, teaching hospitality, honesty with friends, and knowing the size of a promise.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain why the Sun built a new house.',
        'Explain why the Sun and Moon ended up in the sky.',
        'Discuss how to be kind and honest about one’s limits.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading an explanatory (“why”) tale'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Friendship, hospitality, and honest communication'],
      ],
      before: ['Ask: have you ever said yes when you should have said no? What happened?'],
      during: ['Each time Water asks “Is it still safe?”, let the class answer for the Sun.'],
      after: ['Fill a bowl with water and add objects one by one to see it overflow; link it to the story.'],
      discussion: ['Who was more at fault, the Sun or Water? Could either have acted differently?'],
      reflection: ['What promise have you made that is bigger than you first thought?'],
      maths: [],
      support: ['Act the story with learners as Water’s people entering a chalk-marked “house” until it is full.'],
      stretch: ['Write the conversation between the Sun and the Moon on the roof.'],
      localise: ['Ask an elder how your own people explain the Sun, the Moon, or the sea in their stories.'],
      factCheck: ['A traditional Efik and Ibibio tale from Nigeria, first written down in the early 1900s and told in several versions. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 4
  mk({
    key: 'the-fire-on-the-mountain',
    title: 'The Fire on the Mountain',
    summary:
      'A servant bets his rich master that he can stand all night on a freezing mountain top. A tale from Ethiopia about a clever friend and what justice really means.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'ethiopia', 'justice', 'friendship'],
    wpm: 125,
    paceWord: 'Measured, cold, then warm and witty',
    palette: ['#7c2d12', '#1e3a8a'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Desta: a young servant in a thin cotton wrap, proud, poor, and brave.',
      'Ato Girma: his rich master, a heavy man in fine robes who loves a wager.',
      'Old Kebede: a wise old man with a white beard, Desta’s friend.',
      'The judge: a town judge who is a friend of the rich man.',
    ],
    music: 'Slow, bare string melody that warms into a feast rhythm (placeholder)',
    pages: [
      pg(
        '🏔️',
        'In the highlands of Ethiopia, the nights are bitterly cold. A rich man named Ato Girma sat by his fire one evening, wrapped in a thick robe. “I wonder,” he said to his servant, Desta, “how much cold a man can bear. Could anyone stand on the peak of the mountain all night, without a blanket, without a fire, and without food, and live?” “I believe I could, master,” said Desta. Ato Girma laughed. “Then let us wager. Do it, and I will give you a house, ten cattle, and a field. Fail, and you get nothing.”',
        'A rich man in a thick robe by a fire talking to a thinly dressed servant, with a dark mountain peak through the window.'
      ),
      pg(
        '🤝',
        'Desta agreed. But as the day came nearer, he grew afraid. He went to see an old man named Kebede, who was known for his wisdom. Kebede listened. “I will help you,” he said. “Across the valley from the peak is a high rock. Tomorrow night, I shall build a fire on that rock. You will see it from where you stand. Keep your eyes on it all night. Think of its warmth, and think of me, your friend, sitting beside it for your sake. Do that, and you will live until morning.”',
        'A young man seated before a white-bearded old man who is pointing across a valley towards a distant rock.'
      ),
      pg(
        '🔥',
        'The next evening, Desta climbed the mountain with the master’s servants as witnesses. He took off his wrap and stood on the bare peak. The wind cut like a knife. His fingers went numb, and then his feet. But far across the valley, a small red light was shining. Desta fixed his eyes on it. He thought of the flames. He thought of old Kebede feeding them with sticks, hour after hour. The stars wheeled overhead. He did not sit, and he did not look away. When the sun rose, he was still standing.',
        'A young man standing on a bare, windy mountain peak at night, gazing at a tiny red fire far across a valley.'
      ),
      pg(
        '⚖️',
        'Desta went down to claim his prize. “How did you manage it?” asked Ato Girma. “I watched a fire on a rock across the valley,” said Desta. “A fire!” cried the master. “Then you have lost. The wager was: no fire.” “But it was far away. It gave me no warmth.” “You were saved by a fire. You get nothing.” Desta went to the judge. The judge was a friend of Ato Girma and had eaten at his table many times. He heard the case, stroked his beard, and ruled that the servant had lost.',
        'A rich man pointing accusingly at a servant before a judge seated on a bench.'
      ),
      pg(
        '🍲',
        'Desta went back to Kebede in despair. “Do not lose heart,” said the old man. A few days later, Kebede invited the whole town to a feast, and Ato Girma and the judge with it. The guests sat down. From the kitchen came the smell of roasting meat and spiced stew. They waited. An hour passed, and then another. No food came. The smell grew richer. At last Ato Girma called out, “Kebede, when are we to eat?” “Eat?” said Kebede. “But can you not smell the food? Surely that has filled you.”',
        'Hungry guests seated at an empty table, sniffing the air, while an old man smiles in the doorway.'
      ),
      pg(
        '💡',
        '“How can the smell of food fill a man’s stomach?” said the judge angrily. “In the same way,” said Kebede, “that the sight of a fire on a far-off rock can warm a man on a mountain top.” There was a silence. Then the guests began to laugh, and the judge went red. He stood up. “I gave a wrong judgement,” he said. “The servant won.” Ato Girma paid in full: the house, the cattle, and the field. Then Kebede clapped his hands, and the food was carried in. Ethiopians say: one clever friend is worth more than a rich master.',
        'An old man clapping his hands as dishes of food are carried in to laughing guests, and a judge rises to speak.'
      ),
    ],
    activities: [
      {
        id: 'fm-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What was the wager?',
        options: [
          'To carry a load up the mountain',
          'To stand all night on the cold peak without blanket, fire, or food',
          'To find a lost cow',
        ],
        correctIndex: 1,
      },
      {
        id: 'fm-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'How did Kebede help Desta on the mountain?',
        options: [
          'He lit a fire on a distant rock for Desta to watch',
          'He brought him a blanket',
          'He stood in his place',
        ],
        correctIndex: 0,
      },
      {
        id: 'fm-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did Kebede show that the judgement was wrong?',
        options: [
          'He paid the judge',
          'He shouted at the master',
          'He let the guests smell food without eating, as Desta had only seen a fire',
        ],
        correctIndex: 2,
      },
      {
        id: 'fm-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A worker completes a job as agreed, but the employer invents a reason not to pay. Using the tale, what can help the worker get justice?',
        options: [
          'Giving up quietly',
          'Friends and clear reasoning that show the unfairness publicly',
          'Damaging the employer’s property',
        ],
        correctIndex: 1,
      },
      {
        id: 'fm-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Ato Girma and Desta make a wager',
          'Kebede promises to light a fire across the valley',
          'Desta stands all night on the peak',
          'The judge rules against Desta',
          'Kebede’s feast shows the judge his mistake',
        ],
      },
      {
        id: 'fm-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'wager',
        definition: 'An agreement in which one side wins something if a thing happens.',
        distractors: [
          'A thick robe',
          'A mountain peak',
        ],
      },
    ],
    glossary: [
      {
        word: 'wager',
        definition: 'An agreement in which one side wins something if a thing happens.',
        pages: [1, 4],
      },
      {
        word: 'peak',
        definition: 'The pointed top of a mountain.',
        pages: [1, 3],
      },
      {
        word: 'witnesses',
        definition: 'People who see an event and can say what happened.',
        pages: [3],
      },
      {
        word: 'numb',
        definition: 'Unable to feel anything.',
        pages: [3],
      },
      {
        word: 'ruled',
        definition: 'Gave an official decision.',
        pages: [4],
      },
      {
        word: 'despair',
        definition: 'The feeling that there is no hope.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Where it is told: a well-loved tale of the Ethiopian highlands.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'The names Desta, Girma, and Kebede are Ethiopian names chosen for this retelling. “Ato” is a polite title, like “Mr”.',
    ],
    reviewQuestions: [
      'Check that the judge’s friendship with the rich man is clear, so learners can discuss bias.',
      'Safety: remind learners that the story’s cold-weather feat is not to be imitated.',
    ],
    guide: {
      overview:
        'An Ethiopian tale in which a wise friend wins justice for a servant through a witty demonstration.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain the master’s argument and why it was unfair.',
        'Explain how the feast proved the point.',
        'Discuss what makes a judgement fair.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading for argument; comparison and analogy'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Justice, fairness, and the rule of law'],
      ],
      before: ['Ask: can you be warmed by a fire you can only see? Can you be fed by a smell?'],
      during: ['Stop after Page 4. In pairs, think of a way to show that the judge is wrong.'],
      after: ['Write the judge’s new ruling in three sentences, giving reasons.'],
      discussion: ['Why did the judge rule for the rich man at first? How can a community guard against that?'],
      reflection: ['Who is your “Kebede”, the friend who would stay up all night for you?'],
      maths: [],
      support: ['Let learners smell an orange without eating it, then discuss Kebede’s point.'],
      stretch: ['Invent another demonstration that would have convinced the judge.'],
      localise: ['Tell of a time when clever reasoning settled a dispute in your family or community.'],
      factCheck: ['A traditional Ethiopian tale told in several versions; the names were chosen for this retelling. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 5
  mk({
    key: 'hare-baboon-and-the-two-dinners',
    title: 'Hare, Baboon, and the Two Dinners',
    summary:
      'Baboon invites Hare to a dinner he cannot reach, and Hare invites him back. A tale told by the Shona people of Zimbabwe about treating others as you wish to be treated.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'zimbabwe', 'shona', 'fairness'],
    wpm: 125,
    paceWord: 'Light, sly, and neatly balanced',
    palette: ['#4d7c0f', '#b45309'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Hare: a small, neat hare with long ears, polite on the surface and quick-witted beneath.',
      'Baboon: a large, loud baboon who enjoys a joke at someone else’s expense.',
    ],
    music: 'Bright mbira pattern with a light shaker (placeholder)',
    pages: [
      pg(
        '🐒',
        'Hare and Baboon were neighbours. They greeted each other every day, but they were not truly friends, for Baboon loved to make fun of Hare. One morning, Baboon called across the fields. “Neighbour! I have brewed millet beer and cooked a pot of pumpkin and groundnuts. Come and eat with me this evening.” Hare was surprised and pleased. He washed, combed his ears, and set off. But when he reached Baboon’s place, there was nobody on the ground. “Up here!” shouted Baboon. He was sitting at the very top of a tall tree, with the pots beside him.',
        'A baboon sitting at the top of a tall tree with pots of food, calling down to a small hare on the ground.'
      ),
      pg(
        '🌳',
        '“Come up, come up! The food is getting cold.” Hare looked at the smooth trunk. He jumped, scrabbled, and slid down. He tried again and fell on his back. Baboon laughed until the branch shook. “What, can you not climb? What a pity. I shall have to eat it all myself.” And he did, smacking his lips, while Hare sat below. “Thank you for a pleasant evening,” said Hare politely, when Baboon had finished. He went home hungry. He did not complain. But all night he lay awake, thinking. By morning he was smiling.',
        'A hare sliding down a smooth tree trunk while a baboon laughs and eats above.'
      ),
      pg(
        '🔥',
        'A week later, Hare called across the fields. “Neighbour! It is my turn. I have cooked a fine dinner. Come this evening.” Now, it was the end of the dry season, and that afternoon Hare did something that farmers do at that time of year. He burned the old grass all round his house. By evening, the ground was covered with black ash and soot for a long way on every side. In the middle stood Hare’s house, with a clean mat spread outside it and the food set out on fresh green leaves.',
        'A small house standing in the middle of a wide circle of blackened, burnt ground, with food set out on a mat.'
      ),
      pg(
        '🖐️',
        'Baboon arrived, licking his lips. “Welcome!” said Hare. “But, neighbour, look at your hands! They are black. In my house, nobody eats with dirty hands. The river is just over there. Go and wash.” Baboon looked. It was true. Baboons walk on all fours, and he had crossed the burnt ground. He ran to the river and washed. Then he came back across the ash, on all fours, and his hands were as black as before. “Still dirty,” said Hare. “I am sorry. Do go and wash them properly.” He said it very kindly.',
        'A baboon holding up two soot-blackened hands in dismay as a hare points politely towards a river.'
      ),
      pg(
        '🍽️',
        'Baboon ran to the river again. He scrubbed. He came back. Black. He tried walking on his hind legs and fell over into the soot. He went back a third time and a fourth. Each time he returned, the dishes on the mat were a little emptier, for Hare, being a polite host, did not let good food go cold. At last Baboon stood at the edge of the ash, panting, with wet arms and black palms. Hare was wiping his whiskers. “What a pity,” said Hare. “I shall have to finish it myself.”',
        'A baboon running back from the river across black ash as a hare eats calmly on a mat.'
      ),
      pg(
        '🤝',
        'Baboon stared at him. Then, slowly, he began to grin. “The tree,” he said. “The tree,” agreed Hare. Baboon sat down on the ash and laughed, and this time Hare laughed with him. “Neighbour,” said Baboon, “next time, we shall eat on the ground, where both of us can reach.” And they did. The Shona people say that a guest should never be mocked, because a meal offered with a trick is no meal at all. They also say: the way you set the table for others is the way it will be set for you.',
        'A hare and a baboon sitting side by side on the ground sharing a meal and laughing.'
      ),
    ],
    activities: [
      {
        id: 'hb-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What was wrong with Baboon’s invitation?',
        options: [
          'The food was spoiled',
          'He served the dinner at the top of a tree that Hare could not climb',
          'He forgot to cook',
        ],
        correctIndex: 1,
      },
      {
        id: 'hb-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Hare do before his own dinner?',
        options: [
          'He burned the grass round his house, leaving black ash',
          'He climbed a tree',
          'He hid the food',
        ],
        correctIndex: 0,
      },
      {
        id: 'hb-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why could Baboon never arrive with clean hands?',
        options: [
          'The river was dry',
          'Hare threw soot at him',
          'He walked on all fours across the ash each time he came back',
        ],
        correctIndex: 2,
      },
      {
        id: 'hb-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A classmate organises a game and makes a rule that leaves out pupils who cannot run fast. Using the tale, what is the fairest thing to do?',
        options: [
          'Laugh at those left out',
          'Change the game so that everyone can take part',
          'Leave him out of the next game for ever',
        ],
        correctIndex: 1,
      },
      {
        id: 'hb-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Baboon serves dinner at the top of a tree',
          'Hare goes home hungry',
          'Hare burns the grass round his house',
          'Baboon cannot keep his hands clean and misses the meal',
          'The two agree to eat together on the ground',
        ],
      },
      {
        id: 'hb-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'mocked',
        definition: 'Laughed at unkindly.',
        distractors: [
          'Invited to dinner',
          'Washed in a river',
        ],
      },
    ],
    glossary: [
      {
        word: 'neighbours',
        definition: 'People who live near one another.',
        pages: [1],
      },
      {
        word: 'scrabbled',
        definition: 'Scratched and struggled to hold on.',
        pages: [2],
      },
      {
        word: 'season',
        definition: 'One of the main parts of the year, such as the dry or rainy time.',
        pages: [3],
      },
      {
        word: 'soot',
        definition: 'The black powder left by burning.',
        pages: [3, 5],
      },
      {
        word: 'host',
        definition: 'A person who receives guests.',
        pages: [5],
      },
      {
        word: 'mocked',
        definition: 'Laughed at unkindly.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: tales of Hare (Tsuro) and Baboon (Gudo) are told by the Shona people of Zimbabwe, with similar stories in Zambia, Malawi, and Tanzania.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Fire safety: burning grass is mentioned as a farming practice in the story. Remind learners that bush fires are dangerous and are controlled by law in Ghana.',
    ],
    reviewQuestions: [
      'Check that the ending shows the two making peace, so the tale does not teach revenge alone.',
      'Keep the fire-safety note for teachers.',
    ],
    guide: {
      overview:
        'A Shona tale of two unfair dinners, teaching fairness to guests and that people are treated as they treat others.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain each trick and why it worked.',
        'State the lesson in your own words.',
        'Discuss the difference between teaching a lesson and taking revenge.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading for parallel structure and humour'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Fairness, inclusion, and settling differences'],
      ],
      before: ['Ask: how should a host treat a guest? What makes a guest feel unwelcome?'],
      during: ['Stop after Page 3. Ask: what is Hare planning?'],
      after: ['Learners write rules for a class party so that nobody is left out.'],
      discussion: ['Was Hare right to pay Baboon back in the same way? What else could he have done?'],
      reflection: ['Have you ever set a “table” that left someone out? How could you change it?'],
      maths: [],
      support: ['Dust chalk on the floor and let a learner try to cross it on hands and feet with clean palms.'],
      stretch: ['Write a third dinner, hosted by both, and say who is invited.'],
      localise: ['What are the customs for welcoming a guest in your community?'],
      factCheck: ['A traditional tale told in Zimbabwe and neighbouring countries in several versions. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 6
  mk({
    key: 'the-mother-who-went-into-the-elephant',
    title: 'The Mother Who Went into the Elephant',
    summary:
      'An elephant swallows two children, and their mother goes to fetch them back. A tale of the Zulu people of South Africa about a mother’s courage and doing something when others only wait.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'south-africa', 'zulu', 'courage'],
    wpm: 125,
    paceWord: 'Firm, brave, and steadily building',
    palette: ['#57534e', '#b91c1c'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Unanana: a tall, determined woman with a head-cloth, a cooking pot, and a large knife.',
      'Her two children: a boy and a girl, round-cheeked and much admired.',
      'The elephant: an enormous old elephant with a single tusk.',
      'The animals: a baboon, a gazelle, and a leopard who give directions.',
    ],
    music: 'Strong, marching drum with women’s voices (placeholder)',
    pages: [
      pg(
        '🏡',
        'There was once a woman named Unanana, who built her house beside the main road. People told her it was foolish to live where every traveller and wild beast passed by. Unanana was not afraid of anything, and she liked to see the world go past. She had two children, a boy and a girl, so fine and healthy that everyone who came along the road stopped to admire them. One morning, Unanana went to gather firewood. She left the children in the care of their young cousin and told them to stay near the house.',
        'A woman’s house beside a wide road, with two children playing outside and their mother walking away with an axe.'
      ),
      pg(
        '🐘',
        'While she was away, a baboon came by. “What fine children! Whose are they?” “Unanana’s,” said the cousin. The baboon went on. Then came a gazelle, and then a leopard. Each stopped, admired, and passed. But after them, the ground began to shake. Down the road came an enormous elephant with a single tusk. “Whose children are these?” “Unanana’s.” “They are very fine,” said the elephant. He opened his great mouth and swallowed them both, whole. Then he walked on. The cousin hid, trembling, until Unanana returned, and told her everything.',
        'A huge one-tusked elephant standing over two small children on a road while a frightened girl watches from behind a hut.'
      ),
      pg(
        '🔪',
        'Unanana did not scream or tear her clothes. She took down her largest knife and sharpened it. She filled a pot with beans and put it on her head. Then she set off down the road. She met the baboon. “Mother baboon, where is the elephant who swallowed my children?” “Go on,” said the baboon, “until you come to the place of tall trees and white stones.” She asked the gazelle and the leopard, and each gave the same answer. Unanana walked all day. At evening she came to the tall trees and the white stones.',
        'A woman walking along a road with a cooking pot on her head and a large knife in her hand, asking the way of a baboon.'
      ),
      pg(
        '😤',
        'There stood the elephant with one tusk. Unanana walked straight up to him. “Are you the one who ate my children?” “Go on further,” rumbled the elephant. “It was not I.” “It was you,” said Unanana. “Give them back.” The elephant was not used to being spoken to in this way. “Since you want them so badly, go and join them!” And he swallowed her, pot, knife, and all. That was exactly what Unanana had intended. Down she slid, into the dark, and landed on her feet. She still had her knife and her pot.',
        'A tall woman standing fearlessly in front of an enormous elephant among tall trees and white stones.'
      ),
      pg(
        '🌍',
        'Inside the elephant was a whole country. There were hills and forests and rivers. There were people, hundreds of them, and their cattle and dogs, all swallowed over the years. They sat about, thin and silent, waiting. Unanana’s children ran to her. “Mother, we are hungry!” “What have you eaten?” “Nothing. We have been waiting.” Unanana gave them the beans. Then she looked about her at all that meat. “You sit starving inside your own dinner,” she told the people. She lit a fire, cut a piece from the elephant’s side, and began to roast it.',
        'A woman cooking over a fire in a strange dark landscape of hills and trees, surrounded by thin, astonished people.'
      ),
      pg(
        '🎉',
        'The people stared. Then they took out their own knives. Soon there were cooking fires everywhere, and the elephant began to groan. “Ever since I swallowed that woman,” he told the other animals, “I have had a terrible pain.” He groaned louder, and then he fell down dead. Unanana cut a doorway through his side. Out came the people, the cattle, and the dogs, blinking in the sunlight. They gave her cows and goats in thanks. Unanana and her children went home rich. The Zulu say: do not sit waiting for someone to save you.',
        'People, cattle, and dogs walking out into sunlight through an opening, led by a woman holding her children’s hands.'
      ),
    ],
    activities: [
      {
        id: 'un-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What kind of person was Unanana?',
        options: [
          'Fearful and shy',
          'Bold and unafraid',
          'Lazy and careless',
        ],
        correctIndex: 1,
      },
      {
        id: 'un-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Unanana do when she heard that her children had been swallowed?',
        options: [
          'She sharpened her knife, packed food, and set off after the elephant',
          'She sat down and wept',
          'She asked the chief to send hunters',
        ],
        correctIndex: 0,
      },
      {
        id: 'un-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What were the people inside the elephant doing?',
        options: [
          'Cooking and feasting',
          'Digging a way out',
          'Sitting, hungry, and waiting',
        ],
        correctIndex: 2,
      },
      {
        id: 'un-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Your community’s gutter has been blocked for months, and everyone is waiting for the assembly to clear it. Using the tale, what could the community do?',
        options: [
          'Keep waiting and complaining',
          'Organise together and clear it, as Unanana acted while others waited',
          'Move away',
        ],
        correctIndex: 1,
      },
      {
        id: 'un-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The elephant swallows Unanana’s children',
          'Unanana sets off with a knife and a pot of beans',
          'The elephant swallows Unanana',
          'She feeds the children and roasts meat from inside the elephant',
          'She cuts a way out and everyone is freed',
        ],
      },
      {
        id: 'un-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'intended',
        definition: 'Planned; meant to happen.',
        distractors: [
          'Feared greatly',
          'Forgot completely',
        ],
      },
    ],
    glossary: [
      {
        word: 'admire',
        definition: 'To look at with pleasure and respect.',
        pages: [1],
      },
      {
        word: 'trembling',
        definition: 'Shaking with fear.',
        pages: [2],
      },
      {
        word: 'sharpened',
        definition: 'Made the edge of a blade keen.',
        pages: [3],
      },
      {
        word: 'rumbled',
        definition: 'Spoke in a deep, low voice.',
        pages: [4],
      },
      {
        word: 'intended',
        definition: 'Planned; meant to happen.',
        pages: [4],
      },
      {
        word: 'starving',
        definition: 'Suffering from great hunger.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale of the Zulu people of South Africa, written down in the 1860s and told in several versions. The heroine’s full name in the tradition is Unanana-bosele.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'This is a wonder tale. The swallowing and the world inside the elephant are not meant to be realistic. Its heroine is a woman who acts while others wait.',
    ],
    reviewQuestions: [
      'Ask a Zulu speaker to confirm the name and its respectful use.',
      'Check that the swallowing scenes are told plainly and without frightening detail.',
    ],
    guide: {
      overview:
        'A Zulu wonder tale of a fearless mother who rescues her children and a whole community from inside an elephant.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Describe how Unanana prepared and what she did.',
        'Contrast her with the people who were waiting.',
        'Apply the lesson to taking initiative in a community.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a wonder tale; character through action'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Courage, initiative, and the role of women'],
      ],
      before: ['Ask: what would you do if something precious were taken from you by someone much stronger?'],
      during: ['Stop after Page 4. Ask: did Unanana want to be swallowed? Why?'],
      after: ['Learners list problems in their community that everyone is “waiting” for someone else to solve.'],
      discussion: ['Why had nobody inside the elephant thought of doing what Unanana did?'],
      reflection: ['What are you waiting for someone else to fix that you could begin yourself?'],
      maths: [],
      support: ['Use a large box as the elephant and let learners act the escape.'],
      stretch: ['Write a news report: “Woman Frees Hundreds from Elephant”.'],
      localise: ['Tell of a woman in your family or community who acted when others hesitated.'],
      factCheck: ['A traditional Zulu tale. The statement that it was written down in the 1860s comes from general knowledge and should be confirmed. No other facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 7
  mk({
    key: 'who-broke-the-teachers-pot',
    title: 'Who Broke the Teacher’s Pot?',
    summary:
      'A falling calabash breaks the teacher’s water pot, and his pupils set out to find who is to blame. A chain tale from Zanzibar, on the Swahili coast of Tanzania, about passing blame and finding the real cause.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['folk-tale', 'tanzania', 'zanzibar', 'swahili'],
    wpm: 125,
    paceWord: 'Brisk, repeating, and playful',
    palette: ['#0e7490', '#b45309'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Mwalimu Goso: a kindly teacher in a white robe and cap, who teaches under a great tree.',
      'The pupils: a lively band of boys and girls carrying smooth wooden slates.',
      'The gazelle: a small, nervous gazelle that likes to nibble fruit in the branches.',
      'Wind, Wall, Rat, Cat, Rope, Knife, Fire, Water, and Ox: each accused in turn.',
    ],
    music: 'Quick, circling taarab-style tune with hand claps (placeholder)',
    pages: [
      pg(
        '🌳',
        'On the island of Zanzibar, there was once a teacher named Goso. He taught his pupils to read under a great calabash tree, with his clay water pot beside him. One hot afternoon, a gazelle climbed among the low branches to nibble the fruit. It knocked loose a heavy calabash. Down it fell, and it smashed the teacher’s water pot to pieces. The gazelle slipped away unseen. Goso sighed. “Children, before we blame anyone, we must find out who did this.” The pupils jumped up. “It was the south wind! The wind shook the tree.”',
        'A teacher in a white robe sitting under a large tree with pupils, as a calabash falls and breaks a clay pot.'
      ),
      pg(
        '💨',
        'They ran to find the south wind. “Wind! You threw down the calabash that broke our teacher’s pot.” “I?” said the wind. “If I were so strong, would I be stopped by a mud wall?” So they went to the mud wall. “Wall! You stop the wind that shook the tree that broke our teacher’s pot.” “I?” said the wall. “If I were so strong, would the rat bore holes through me?” So they went to the rat. “If I were so strong,” said the rat, “would I be eaten by the cat?”',
        'Pupils scolding a swirl of wind, then a mud wall with a hole in it, then a small rat.'
      ),
      pg(
        '🐈',
        'They went to the cat. “Cat! You eat the rat that bores the wall that stops the wind that broke our teacher’s pot.” “If I were so strong,” said the cat, “would I be tied up by a rope?” The rope said, “Would I be cut by a knife?” The knife said, “Would I be melted by fire?” The pupils were out of breath by now, but they went on. “Fire! You melt the knife that cuts the rope that ties the cat.” “If I were so strong,” said the fire, “would I be put out by water?”',
        'Pupils running in a line past a cat, a coil of rope, a knife, and a small fire.'
      ),
      pg(
        '🐂',
        'So they went to the water. “If I were so strong,” said the water, “would I be drunk up by the ox?” They found the ox in his field. “Ox! You drink the water that puts out the fire that melts the knife that cuts the rope that ties the cat that eats the rat that bores the wall that stops the wind that broke our teacher’s pot!” The ox chewed slowly. “If I were so strong,” he said, “would I be bothered all day by a fly? And the fly is eaten by the gazelle, when it nibbles the leaves.”',
        'Breathless pupils standing in front of a large ox in a field, with a fly buzzing at his ear.'
      ),
      pg(
        '🦌',
        'The pupils found the gazelle resting in the shade. “Gazelle! You eat the fly that bothers the ox that drinks the water that puts out the fire!” They went through the whole list, down to the wind and the pot. Everyone else had answered at once. The gazelle said nothing. It looked at the ground. It scraped the sand with one small hoof. “Why do you not answer?” asked the pupils. The gazelle remained silent, for it remembered very well climbing in the calabash tree that afternoon. “It was you!” cried the pupils.',
        'A small gazelle with lowered head scraping the sand as a circle of pupils looks at it.'
      ),
      pg(
        '🏺',
        'They brought the gazelle to the teacher. Goso looked at it kindly. “Did you knock down the calabash?” “Yes, Mwalimu,” whispered the gazelle. “I was afraid to say so.” “You have caused a great deal of running about,” said Goso. “Fetch me water each morning until I have a new pot.” The gazelle did so gladly. Then Goso turned to his pupils. “Remember today. Everyone you accused was quick to point at someone else. The one who had done it was silent. When something goes wrong, do not stop at the first name. Follow the matter to its end, and then be fair.”',
        'A teacher speaking gently to a gazelle carrying a small water gourd, with pupils seated round him.'
      ),
    ],
    activities: [
      {
        id: 'gs-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What broke the teacher’s water pot?',
        options: [
          'A stone thrown by a pupil',
          'A calabash knocked down by a gazelle',
          'The south wind',
        ],
        correctIndex: 1,
      },
      {
        id: 'gs-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'How did the wind answer the accusation?',
        options: [
          'By asking whether something so strong would be stopped by a mud wall',
          'By admitting it',
          'By blowing the pupils away',
        ],
        correctIndex: 0,
      },
      {
        id: 'gs-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did the pupils know that the gazelle was to blame?',
        options: [
          'A bird told them',
          'They saw it in the tree',
          'It was the only one that stayed silent and did not pass the blame on',
        ],
        correctIndex: 2,
      },
      {
        id: 'gs-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A window is broken at school, and each pupil says, “It was not me, it was him.” Using the tale, how should the teacher handle it?',
        options: [
          'Punish the first pupil named',
          'Follow the matter to its end calmly, and then be fair',
          'Punish the whole class at once',
        ],
        correctIndex: 1,
      },
      {
        id: 'gs-s1',
        type: 'sequencing',
        prompt: 'Put those who were accused in the order the pupils went to them.',
        items: [
          'The south wind',
          'The mud wall',
          'The cat',
          'The fire',
          'The gazelle',
        ],
      },
      {
        id: 'gs-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'accusation',
        definition: 'A statement that someone has done something wrong.',
        distractors: [
          'A heavy fruit',
          'A writing board',
        ],
      },
    ],
    glossary: [
      {
        word: 'calabash',
        definition: 'A large, hard-shelled fruit; also a container made from its shell.',
        pages: [1, 5, 6],
      },
      {
        word: 'blame',
        definition: 'To say that someone is responsible for something bad.',
        pages: [1],
      },
      {
        word: 'bore',
        definition: 'To make a hole through something.',
        pages: [2],
      },
      {
        word: 'accused',
        definition: 'Said to have done something wrong.',
        pages: [6],
      },
      {
        word: 'silent',
        definition: 'Saying nothing.',
        pages: [5, 6],
      },
      {
        word: 'fair',
        definition: 'Treating everyone justly.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: a chain tale from Zanzibar, on the Swahili coast of Tanzania, known as the story of Goso the teacher. Mwalimu is the Kiswahili word for teacher.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Softened ending: in the old telling, the calabash kills the teacher and the gazelle is put to death. Here a pot is broken and the gazelle makes amends, which suits the age group and keeps the lesson.',
    ],
    reviewQuestions: [
      'Ask a Kiswahili speaker to confirm the use of “Mwalimu Goso”.',
      'Tell teachers that the ending has been softened from the traditional version.',
    ],
    guide: {
      overview:
        'A Swahili chain tale in which blame is passed from one to another until the true cause is found, teaching careful inquiry and fairness.',
      lessonMinutes: 45,
      goals: [
        'Retell the chain in order.',
        'Explain how each one passed the blame.',
        'Explain how the true cause was recognised.',
        'Apply the lesson to settling disputes fairly.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a cumulative (chain) tale; memory and sequence'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Fairness and finding the truth before judging'],
      ],
      before: ['Ask: when something is broken in class, what do people usually say first?'],
      during: ['Let the class chant the growing chain together each time it is repeated.'],
      after: ['In groups, perform the chain from memory, each learner taking one character.'],
      discussion: ['Why is the first person blamed so often the wrong one? How can we find the real cause?'],
      reflection: ['Have you ever let someone else take the blame for something you did?'],
      maths: [],
      support: ['Give each learner a picture card of one character and line them up in order.'],
      stretch: ['Write your own chain tale with at least six links about a problem at school.'],
      localise: ['Is there a chain tale or chain song in your own language? Teach it to the class.'],
      factCheck: ['A traditional Zanzibar tale, first written down around 1900. The ending has been softened for this retelling, as stated in the notes. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),

  // 8
  mk({
    key: 'lwanda-magere-the-warrior-of-stone',
    title: 'Lwanda Magere, the Warrior of Stone',
    summary:
      'No spear could wound the great Luo warrior Lwanda Magere, until his secret was told. A legend of the Luo people of Kenya about strength, trust, and a carelessly shared secret.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'family'],
    themes: ['community', 'family'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['legend', 'kenya', 'luo', 'trust'],
    wpm: 125,
    paceWord: 'Heroic, steady, and solemn at the end',
    palette: ['#44403c', '#b45309'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Lwanda Magere: a huge, calm warrior with a shield and a heavy spear, admired by his people.',
      'His first wife: a loyal Luo woman who knows how to care for him.',
      'The second wife: a clever young woman sent by the enemy, torn between two peoples.',
      'The Luo elders: grey-haired men who give warnings.',
    ],
    music: 'Slow nyatiti-style lyre with a deep drum (placeholder)',
    pages: [
      pg(
        '🛡️',
        'On the plains beside Lake Victoria, in western Kenya, live the Luo people. Long ago, they were often at war with their neighbours over cattle and grazing land. In those days, the Luo had a champion named Lwanda Magere. He was as strong as an ox. But that was not why his enemies feared him. When spears struck Lwanda Magere, they bent. Arrows bounced off him and fell to the ground. His body, people said, was made of stone. When he walked onto a battlefield, the enemy turned and ran.',
        'A huge warrior with a shield standing on a grassy plain beside a great lake, with spears lying bent at his feet.'
      ),
      pg(
        '🤝',
        'The neighbouring people lost battle after battle. Their elders met in council. “We cannot defeat this man by force,” they said. “We must find out the secret of his strength.” They sent messengers to the Luo with words of peace. As a sign of friendship, they offered the most beautiful young woman of their people to be the wife of Lwanda Magere. The Luo elders were uneasy. “Do not accept,” they told him. “An enemy’s gift has a hook in it.” But Lwanda Magere was flattered, and he took her as his second wife.',
        'Messengers presenting a young woman in fine ornaments to a great warrior, while elders watch with worried faces.'
      ),
      pg(
        '🌿',
        'For a long time, the new wife learned nothing. Then, one day, Lwanda Magere fell ill with a fever. His first wife, who always nursed him, was away at her parents’ home. He called the second wife. “Bring the medicine,” he said. “Make a small cut and rub it in. But do not cut my body. Cut my shadow.” She thought the fever had confused him. But she took the knife and touched it to his shadow on the wall. The shadow bled. She understood then. His strength, and his life, lay in his shadow.',
        'A young woman holding a small knife, staring at the shadow of a sick man on the wall of a hut.'
      ),
      pg(
        '🌙',
        'The young woman lay awake for many nights. Lwanda Magere had treated her well. But her own father and brothers were the ones who fell before him in battle. At last, on a moonless night, she slipped out of the homestead and ran across the plain to her own people. She told the elders what she had seen. They listened in silence. Then they called their warriors together. “When you next meet Lwanda Magere,” they said, “do not waste your spears on his body. Aim at his shadow.” The young woman wept as she heard it.',
        'A young woman running across a dark plain at night towards distant fires.'
      ),
      pg(
        '☀️',
        'Before long, the two sides met again. It was a bright morning, and the sun threw long shadows across the grass. Lwanda Magere strode out in front of the Luo, as he always did. Spears flew at him and fell away. The enemy began to retreat. Then one warrior, running, turned and hurled his spear. He aimed at the ground, at the dark shape stretched out behind the champion. The spear struck the shadow. Lwanda Magere stopped. He swayed, and he fell. And where he fell, the people say, his body turned into a great rock.',
        'A warrior falling as a spear stands upright in his long shadow on the grass.'
      ),
      pg(
        '🪨',
        'The rock is still there, at a place called Sidho, on the plains of western Kenya. People visit it, and for generations hunters sharpened their spears on it for strength and luck. The Luo tell the story with pride and with sorrow. Their elders draw lessons from it. Listen when those who love you give a warning. Guard the thing your life depends on, and be careful to whom you tell it. And they add something else: no people is defeated for ever by strength alone, so it is better to make a peace that is real.',
        'A large grey rock standing alone on a grassy plain, with a small group of visitors beside it.'
      ),
    ],
    activities: [
      {
        id: 'lm-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why did Lwanda Magere’s enemies fear him?',
        options: [
          'He had a magic spear',
          'Weapons could not wound his body',
          'He commanded the largest army',
        ],
        correctIndex: 1,
      },
      {
        id: 'lm-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What warning did the Luo elders give?',
        options: [
          'Not to accept the enemy’s gift of a wife',
          'Not to go near the lake',
          'Not to fight in the morning',
        ],
        correctIndex: 0,
      },
      {
        id: 'lm-c3',
        type: 'comprehension',
        afterPage: 3,
        question: 'Where did his strength lie?',
        options: [
          'In his shield',
          'In his hair',
          'In his shadow',
        ],
        correctIndex: 2,
      },
      {
        id: 'lm-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Someone you have only just met asks for your mobile-money PIN “to help you”. Using the legend, what should you do?',
        options: [
          'Share it, to be friendly',
          'Keep it to yourself, because it is the thing your money depends on',
          'Write it down for them',
        ],
        correctIndex: 1,
      },
      {
        id: 'lm-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Lwanda Magere defeats his people’s enemies again and again',
          'The enemy offers him a wife as a sign of peace',
          'He tells her to cut his shadow, and it bleeds',
          'She carries the secret to her own people',
          'A spear strikes his shadow and he turns to stone',
        ],
      },
      {
        id: 'lm-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'flattered',
        definition: 'Pleased by praise or attention.',
        distractors: [
          'Wounded by a spear',
          'Warned by the elders',
        ],
      },
    ],
    glossary: [
      {
        word: 'champion',
        definition: 'The best fighter, who leads the others.',
        pages: [1, 5],
      },
      {
        word: 'council',
        definition: 'A meeting of people who come together to discuss and decide.',
        pages: [2],
      },
      {
        word: 'flattered',
        definition: 'Pleased by praise or attention.',
        pages: [2],
      },
      {
        word: 'homestead',
        definition: 'A home with its land and buildings.',
        pages: [4],
      },
      {
        word: 'retreat',
        definition: 'To move back from a fight.',
        pages: [5],
      },
      {
        word: 'generations',
        definition: 'The successive groups of people born over a long time.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: a legend of the Luo people of western Kenya. The rock said to be Lwanda Magere stands at Sidho in the Kano plains, near Lake Victoria. In Luo tradition, the enemy are the neighbouring Nandi people.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'The legend is told from the Luo side. The retelling does not name the neighbouring people in the story text and shows the young wife as torn, not wicked.',
    ],
    reviewQuestions: [
      'Ask a Dholuo speaker or a Kenyan reviewer to confirm names and the site at Sidho.',
      'The hero’s death is told in two sentences; check its tone for younger learners.',
    ],
    guide: {
      overview:
        'A Luo legend of an invulnerable warrior undone by a shared secret, teaching caution, respect for wise counsel, and the value of real peace.',
      lessonMinutes: 45,
      goals: [
        'Retell the legend in order.',
        'Explain how the secret was discovered and passed on.',
        'State the lessons the elders draw.',
        'Discuss the young wife’s choice from both sides.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a legend; point of view'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Conflict between neighbours; peace-making and trust'],
      ],
      before: ['Ask: is there anyone with no weakness at all? What might a strong person’s weakness be?'],
      during: ['Stop after Page 3. Ask: what should the young wife do with what she knows?'],
      after: ['Hold a short debate: “The second wife was a traitor” against “She was loyal to her own people”.'],
      discussion: ['Whose side are you on in this story? Would the neighbouring people tell it differently?'],
      reflection: ['What is your “shadow”, the thing you must guard carefully?'],
      maths: [],
      support: ['Use a torch and a figure to cast a shadow on the wall while reading Pages 3 and 5.'],
      stretch: ['Find out about the Luo people: where they live, their language, and one famous person of Luo descent.'],
      localise: ['Is there a rock, tree, or hill near you with a legend attached to it? Tell the story.'],
      factCheck: ['A Luo legend told in several versions. The rock at Sidho and the practice of sharpening spears on it come from general knowledge and should be confirmed by a Kenyan reviewer. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.'],
    },
  }),
];

export const BATCH_48_AFRICAN_FOLK_TALES = BATCH_48_STORIES;
