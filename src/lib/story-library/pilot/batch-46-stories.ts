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
 * Batch 46 (8 more African folk tales and legends retold as six-page stories with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to English Language (oral literature) and Social Studies (see the first cultural note and the teacher guide).
 * These are traditional tales retold in original words. Each has named characters, listed in `characters`.
 * Original text written for Ghanaian learners; folk tales exist in many versions; each factCheck note says where the tale is told.
 * To verify before seeding: classIds, readingLevel, themes, and ghanaianContext against ../classification.ts;
 * whether `maths` may be an empty array; and all NaCCA curriculum codes.
 */

export const BATCH_46_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'the-leopards-drum',
    title: 'The Leopard’s Drum',
    summary:
      'Osebo the leopard owns the finest drum in the forest and will share it with no one, not even the Sky. An Asante tale from Ghana about boasting, and about how small Tortoise won a hard shell.',
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
    paceWord: 'Bold, rhythmic, and humorous',
    palette: ['#ca8a04', '#14532d'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Osebo: a large, proud leopard with a golden spotted coat, always beside his huge drum.',
      'Nyame: the Sky, a great calm face among the clouds.',
      'Tortoise: a very small tortoise with a soft, thin shell and a quiet, polite voice.',
      'Python, Elephant, and Monkey: three forest animals who each try to fetch the drum.',
    ],
    music: 'Deep, rolling drum with a light bell (placeholder)',
    pages: [
      pg(
        '🥁',
        'Osebo the leopard had a drum. It was the largest and finest drum in the whole forest, carved from a single great tree, with a voice like thunder. Every evening Osebo beat it, and the sound rolled over the hills. All the animals longed to try it. “May I play your drum?” asked Monkey. “No,” said Osebo. “May I only touch it?” asked Antelope. “No,” said Osebo. “It is mine. Nobody plays it, nobody touches it, and nobody comes near it.” And he showed his teeth, so that they ran away.',
        'A large spotted leopard beating a huge carved drum while smaller animals watch from behind trees.'
      ),
      pg(
        '☁️',
        'High above, Nyame, the Sky, heard the drum and wished to have it. “Osebo,” he called, “let me have your drum.” Osebo did not even answer. So Nyame spoke to all the animals. “Whoever brings me the drum of Osebo shall have a great reward.” Python went first. He was long and strong. But when Osebo snarled, Python slid away. Elephant went next. Osebo sprang at his trunk, and Elephant fled. Monkey crept up through the branches, saw the leopard’s claws, and went home. Nobody else dared to try. The drum went on booming every evening.',
        'An elephant backing away and a python sliding off as a snarling leopard guards a great drum.'
      ),
      pg(
        '🐢',
        'Then a small voice said, “I will fetch the drum.” The animals looked down. It was Tortoise. In those days, Tortoise had no hard shell. His back was soft and thin, and anyone could step on him. The animals laughed until they cried. “You?” said Elephant. “You cannot even fetch your own dinner without being trodden on.” Tortoise did not argue. He only blinked his small eyes. Then he set off, very slowly, along the path to Osebo’s clearing. It took him the whole of that day and half of the next.',
        'A tiny soft-backed tortoise walking slowly along a forest path while larger animals laugh behind him.'
      ),
      pg(
        '🗣️',
        'Osebo was polishing his drum. “Good morning, great Osebo,” said Tortoise. “I have come to look at your drum. I hear it is nearly as big as the drum of Nyame.” Osebo’s ears went flat. “Nearly?” “Oh, yes,” said Tortoise. “They say the drum of Nyame is so big that he can climb right inside it, and nobody can see him.” “My drum is bigger than any drum!” roared Osebo. “I can climb inside mine too!” Tortoise looked doubtful. “I am sure you are right. But I cannot quite believe it without seeing.”',
        'A tiny tortoise looking up at a proud leopard who stands with one paw on his enormous drum.'
      ),
      pg(
        '🫙',
        '“Then watch!” said Osebo. He pushed his head into the open end of the drum. He squeezed in his shoulders. He wriggled in his back legs. “Can you see me now?” he called, in a muffled voice. “I can still see the tip of your tail,” said Tortoise. Osebo pulled in his tail. At once, Tortoise rolled a big iron cooking pot against the opening and wedged it tight with a stone. Osebo roared and scratched, but he could not turn round. Tortoise tied a vine to the drum and began, very slowly, to drag it.',
        'A leopard’s tail disappearing into a huge drum as a small tortoise pushes an iron pot towards the opening.'
      ),
      pg(
        '🛡️',
        'The animals stared as Tortoise came along the path, pulling the great drum with the leopard growling inside it. He brought it before Nyame. Nyame let Osebo out, and the leopard ran into the forest, too ashamed to look at anyone. “Tortoise,” said Nyame, “you have done what the strong could not. What reward would you like?” Tortoise looked round at all the big feet. “Something to keep me safe,” he said. So Nyame gave him a hard shell to carry on his back. Tortoise has worn it ever since. And Osebo has never boasted about his drum again.',
        'A small tortoise with a new hard, patterned shell standing proudly before the sky, with a great drum beside him.'
      ),
    ],
    activities: [
      {
        id: 'ld-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'How did Osebo treat the other animals who admired his drum?',
        options: [
          'He let them play it in turn',
          'He refused to let anyone play it or even touch it',
          'He gave it to Monkey',
        ],
        correctIndex: 1,
      },
      {
        id: 'ld-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did the animals laugh at Tortoise?',
        options: [
          'He was small and soft-backed, and the strong animals had already failed',
          'He had told a joke',
          'He had fallen into the river',
        ],
        correctIndex: 0,
      },
      {
        id: 'ld-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did Tortoise get Osebo inside the drum?',
        options: [
          'He pushed him in',
          'He promised him food inside it',
          'He made him want to prove that his drum was big enough to climb into',
        ],
        correctIndex: 2,
      },
      {
        id: 'ld-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A classmate is always boasting that he is the best at everything. Using the tale, what weakness does boasting create?',
        options: [
          'None at all',
          'A boaster can be led into foolish acts to prove himself',
          'It makes him stronger',
        ],
        correctIndex: 1,
      },
      {
        id: 'ld-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Osebo refuses to share his drum',
          'Nyame offers a reward for the drum',
          'Python, Elephant, and Monkey fail',
          'Tortoise tricks Osebo into climbing inside the drum',
          'Nyame gives Tortoise a hard shell',
        ],
      },
      {
        id: 'ld-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'boasted',
        definition: 'Spoke too proudly about oneself or one’s things.',
        distractors: [
          'Hid from danger',
          'Shared with others',
        ],
      },
    ],
    glossary: [
      {
        word: 'longed',
        definition: 'Wanted very much.',
        pages: [1],
      },
      {
        word: 'reward',
        definition: 'Something given in return for a good deed.',
        pages: [2, 6],
      },
      {
        word: 'snarled',
        definition: 'Growled angrily, showing the teeth.',
        pages: [2],
      },
      {
        word: 'doubtful',
        definition: 'Not sure that something is true.',
        pages: [4],
      },
      {
        word: 'muffled',
        definition: 'Made quieter and less clear.',
        pages: [5],
      },
      {
        word: 'boasted',
        definition: 'Spoke too proudly about oneself or one’s things.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: an Asante (Akan) tale from Ghana. Osebo is the Twi word for leopard, and Nyame is the Sky God.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Compare with “How Tortoise Cracked His Shell” from Nigeria: two peoples explain the same shell in two different ways.',
    ],
    reviewQuestions: [
      'Ask a Twi-speaking reviewer to confirm the names and the respectful portrayal of Nyame.',
      'Is it clear that Tortoise wins by wit, not by cruelty?',
    ],
    guide: {
      overview:
        'An Asante tale in which a small, patient creature succeeds where the strong fail, explaining the tortoise’s shell and warning against boasting.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain how Tortoise used Osebo’s pride against him.',
        'State the lesson about boasting and about sharing.',
        'Compare this tale with another tortoise tale.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a trickster tale; character and motive'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Folk tales as part of national culture'],
      ],
      before: ['Ask: can a small, weak creature beat a strong one? How?'],
      during: ['Stop after Page 3. Ask learners to plan how Tortoise might succeed.'],
      after: ['Act out the conversation on Page 4 in pairs.'],
      discussion: ['Osebo lost his drum because he would not share and could not bear to be second. Which fault was worse?'],
      reflection: ['What do you boast about? What do you find hard to share?'],
      maths: [
      ],
      support: ['Use a large box as the drum and act out Page 5.'],
      stretch: ['Write the tale as a short play with five speaking parts.'],
      localise: ['What drums are played in your area, and who is allowed to play them?'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'An Asante tale from Ghana, told in several versions. No dates or facts need checking, but confirm names with a Twi speaker. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 2
  mk({
    key: 'why-hen-scratches-the-ground',
    title: 'Why Hen Scratches the Ground',
    summary:
      'Hen borrows her friend Hawk’s only needle and loses it. A tale told in Ghana and across Africa about looking after what you borrow.',
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
    paceWord: 'Homely, gentle, then anxious',
    palette: ['#b45309', '#0369a1'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Hen: a plump brown hen with a red comb, cheerful and a little careless.',
      'Hawk: a sharp-eyed hawk with broad wings, proud of her one precious needle.',
      'The chicks: six yellow chicks who follow Hen everywhere.',
    ],
    music: 'Light, pecking rhythm on a small drum (placeholder)',
    pages: [
      pg(
        '🐔',
        'Long ago, Hen and Hawk were the best of friends. Hen lived in the village among the people, and Hawk lived in a tall tree at the edge of the forest. Whenever Hawk flew over the village, she came down to greet Hen, and the two of them talked in the shade. Hawk owned something that no other bird had: a fine, sharp needle. With it she sewed the neatest clothes in the forest. She kept it tucked in her feathers and never let it out of her sight. It was her greatest treasure.',
        'A hen and a hawk sitting side by side in the shade of a hut, talking like friends.'
      ),
      pg(
        '🪡',
        'One day a festival was announced. Hen wanted new clothes for her six chicks. “My friend,” she said to Hawk, “lend me your needle for a few days.” Hawk hesitated. “It is the only one I have, and it came to me from my mother. I have never lent it to anyone.” “I will guard it with my life,” said Hen. Hawk looked at her friend. “Very well. But promise me that you will bring it back the moment you have finished.” “I promise,” said Hen, and she tucked the needle under her wing.',
        'A hawk carefully handing a shining needle to a hen while six chicks look on.'
      ),
      pg(
        '👗',
        'Hen sewed all that day and the next. The clothes were lovely, and the chicks danced about in them. Hen was so pleased that she put the needle down on the ground beside her while she tied the last knot. Just then, a neighbour called to her about the festival. Hen ran to talk. The chicks ran after her. They talked for a long time. When Hen came back, she swept the yard, as she did every evening, and threw the sweepings onto the rubbish heap. Then she went to bed.',
        'A hen chatting with a neighbour while a small needle lies forgotten on the ground behind her.'
      ),
      pg(
        '😨',
        'In the morning, Hawk arrived. “I have come for my needle.” Hen’s heart jumped. She looked under her wing. She looked in the hut. She looked on the ground where she had been sewing. The needle was gone. “I put it down just here,” she said in a small voice. “Only for a moment.” She ran to the rubbish heap and began to scratch. She scratched through ash and peelings and dust. Her chicks scratched beside her. They searched until noon. They did not find the needle. Hawk watched in silence from the fence.',
        'A worried hen and her chicks scratching through a rubbish heap while a hawk watches sternly from a fence.'
      ),
      pg(
        '🦅',
        'Hawk’s eyes were cold. “I trusted you with the one thing I valued most,” she said. “You gave me your promise.” “I will find it,” cried Hen. “Give me time.” “You shall have time,” said Hawk. “But listen. Until my needle is back in my hand, I shall take one of your chicks whenever I am able. That is the price.” She spread her wings and rose into the sky. From that day, the friendship was over. And from that day, Hawk has circled above the village, watching. She has a long memory.',
        'A hawk rising into the sky above a village while a hen gathers her chicks under her wings.'
      ),
      pg(
        '🌍',
        'That is why, wherever you go in Africa, you will see a hen scratching the ground. She scratches in the yard, on the path, and on the rubbish heap. She teaches her chicks to scratch as soon as they can walk. She is still looking for Hawk’s needle. And that is why she gives a sharp cry when a shadow passes over, and calls her chicks to hide beneath her wings. The elders say: guard a borrowed thing more carefully than your own, and remember that a promise is a debt.',
        'A hen scratching the ground with her chicks beside her, glancing up at the shadow of a hawk.'
      ),
    ],
    activities: [
      {
        id: 'hh-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why did Hawk hesitate to lend the needle?',
        options: [
          'Hen had lost things before',
          'It was her only one and came from her mother',
          'She did not like Hen',
        ],
        correctIndex: 1,
      },
      {
        id: 'hh-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'How was the needle lost?',
        options: [
          'Hen put it on the ground, went to talk, and swept it away with the rubbish',
          'A chick swallowed it',
          'Hawk took it back secretly',
        ],
        correctIndex: 0,
      },
      {
        id: 'hh-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What price did Hawk set until the needle was returned?',
        options: [
          'Hen must sew her a new dress',
          'Hen must leave the village',
          'She would take one of Hen’s chicks whenever she could',
        ],
        correctIndex: 2,
      },
      {
        id: 'hh-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You borrow a friend’s only calculator for a test. According to the tale, how should you treat it?',
        options: [
          'Like any of your own things',
          'With even more care than your own, and return it straight away',
          'Lend it to someone else afterwards',
        ],
        correctIndex: 1,
      },
      {
        id: 'hh-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Hen and Hawk are close friends',
          'Hen borrows Hawk’s needle and promises to return it',
          'Hen puts the needle down and sweeps it away',
          'Hawk demands the needle and it cannot be found',
          'Hen scratches the ground, still searching',
        ],
      },
      {
        id: 'hh-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'debt',
        definition: 'Something that is owed to another person.',
        distractors: [
          'A sharp tool for sewing',
          'A heap of rubbish',
        ],
      },
    ],
    glossary: [
      {
        word: 'festival',
        definition: 'A special day or time of celebration.',
        pages: [2, 3],
      },
      {
        word: 'hesitated',
        definition: 'Paused before deciding, because of doubt.',
        pages: [2],
      },
      {
        word: 'sweepings',
        definition: 'Dust and rubbish collected with a broom.',
        pages: [3],
      },
      {
        word: 'valued',
        definition: 'Thought of as important or precious.',
        pages: [5],
      },
      {
        word: 'circled',
        definition: 'Moved round and round in the air.',
        pages: [5],
      },
      {
        word: 'debt',
        definition: 'Something that is owed to another person.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: this tale is told in Ghana and in many other African countries, from West Africa to Kenya and southern Africa. In some versions the lost object is a razor or a ring.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Science link: hens scratch the ground to uncover seeds and insects, and they call their chicks when a hawk flies over. The tale gives a story reason for real behaviour.',
    ],
    reviewQuestions: [
      'Check that Hawk’s threat is told plainly but without frightening detail.',
      'Is the lesson about borrowing clear at the end?',
    ],
    guide: {
      overview:
        'A widely told “why” tale explaining a hen’s scratching, teaching care for borrowed things and the weight of a promise.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain how carelessness cost a friendship.',
        'State the two sayings at the end in your own words.',
        'Apply the lesson to borrowing at school.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading an explanatory (“why”) tale'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Values: honesty, responsibility, and keeping promises'],
      ],
      before: ['Ask: why do hens scratch the ground? Why do they cry out when a hawk passes?'],
      during: ['Stop after Page 3. Ask: what mistake has Hen made, and what should she do now?'],
      after: ['Learners write class rules for borrowing and lending.'],
      discussion: ['Was Hawk’s price fair? What would have been a fairer way to settle the loss?'],
      reflection: ['Have you lost or damaged something you borrowed? How did you put it right?'],
      maths: [
      ],
      support: ['Hide a paper “needle” in a tray of sand and let learners search for it.'],
      stretch: ['Write a new ending in which Hen finds the needle. What happens to the friendship?'],
      localise: ['Ask an elder for a tale that explains the behaviour of an animal you see every day.'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'A traditional tale told across Africa in many versions. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 3
  mk({
    key: 'the-hunter-and-the-crocodile',
    title: 'The Hunter and the Crocodile',
    summary:
      'A hunter saves a crocodile’s life and is nearly eaten for it. A tale from the Sahel lands of Senegal, Mali, and Burkina Faso about gratitude and good sense.',
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
    paceWord: 'Dry, thoughtful, with a sly ending',
    palette: ['#a16207', '#0e7490'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Demba: a young hunter in a loose tunic, kind-hearted and trusting, carrying a large sack.',
      'The crocodile: a big, old crocodile, weak with thirst at first and sly afterwards.',
      'The old horse and the old cow: two thin, tired animals who come to the river to drink.',
      'Hare: a small hare with long ears and a careful way of asking questions.',
    ],
    music: 'Slow kora-style melody with a soft calabash beat (placeholder)',
    pages: [
      pg(
        '🏜️',
        'It was the height of the dry season. The pools had shrunk to cracked mud, and the great river was a long walk away across the plain. A young hunter named Demba was crossing that plain when he heard a groan. In the dust lay a crocodile. His pool had dried up, and he was too weak to reach the river. “Hunter,” he whispered, “have pity. Carry me to the water, or I shall die here.” Demba hesitated. “You are a crocodile. You will eat me.” “How could I harm the one who saves my life?” said the crocodile.',
        'A young hunter with a sack standing over a weak crocodile lying on cracked, dry mud.'
      ),
      pg(
        '🎒',
        'Demba had a kind heart. He opened his big sack, helped the crocodile to crawl inside, and tied the mouth with a cord. He lifted the sack onto his head and walked all through the heat of the day. At last he reached the river. He untied the cord and let the crocodile slide out at the edge. “The water is too shallow here,” said the crocodile. “Take me a little further in.” Demba waded in up to his knees. “A little further.” Demba waded in up to his waist. Then the crocodile’s jaws closed on his arm.',
        'A hunter wading waist-deep in a river, lowering a crocodile from a sack into the water.'
      ),
      pg(
        '😧',
        '“What are you doing?” cried Demba. “I am hungry,” said the crocodile. “I have not eaten for weeks.” “But I saved your life! Is a good deed repaid with a bad one?” “That is the way of the world,” said the crocodile. “Everyone knows it.” “It is not!” said Demba. “Let us ask the first three who come to drink. If they agree with you, eat me.” The crocodile thought about it. He was sure of the answer. “Very well,” he said. But he did not let go of the arm.',
        'A crocodile holding a hunter’s arm in his jaws in the river, the two of them arguing.'
      ),
      pg(
        '🐴',
        'An old horse came down to the bank, so thin that his ribs showed. Demba called out his question. The horse lifted his head. “For twenty years I carried my master to war and to market,” he said. “When I grew old, he drove me out to feed myself. Yes. A good deed is repaid with a bad one.” He drank and went away. Next came an old cow. “I gave my master milk and calves all my life,” she said. “Now that I am dry, he is waiting to sell me to the butcher. Yes. That is the way of the world.”',
        'A thin old horse and a thin old cow standing on a river bank, speaking to the hunter in the water.'
      ),
      pg(
        '🐇',
        '“You have heard two,” said the crocodile. “Here comes the third.” It was Hare. Demba told the whole story. Hare scratched one long ear. “I am only a small creature and not very clever,” he said. “You say that this great crocodile was carried in that little sack? I cannot believe it.” “It is true,” said the crocodile. “I cannot judge what I cannot picture,” said Hare. “Show me.” The crocodile was annoyed. He let go of Demba’s arm, crawled up the bank, and squeezed back into the sack. “Like this,” he said.',
        'A hare on a river bank pointing at an empty sack while a crocodile crawls out of the water towards it.'
      ),
      pg(
        '🪢',
        '“And the cord was tied?” asked Hare. “It was,” said the crocodile. “Hunter, tie it as it was.” Demba tied the cord tightly. “Now I can picture it,” said Hare. “And now, hunter, you may decide for yourself how this good deed should be repaid.” Demba carried the sack all the way back to the dry pool and left the crocodile there to wait for the rains. Then he thanked Hare. The storytellers end with two pieces of advice. Be kind, but do not be foolish. And treat well those who have served you, so that the horse and the cow may give a better answer.',
        'A hunter tying the mouth of a sack with a crocodile inside it, while a hare looks on calmly.'
      ),
    ],
    activities: [
      {
        id: 'hc-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why did the crocodile need help?',
        options: [
          'He was caught in a trap',
          'His pool had dried up and he was too weak to reach the river',
          'He had lost his way at night',
        ],
        correctIndex: 1,
      },
      {
        id: 'hc-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did the old horse say that good is repaid with bad?',
        options: [
          'His master drove him out when he grew old, after years of service',
          'The crocodile had bitten him',
          'He had never done a good deed',
        ],
        correctIndex: 0,
      },
      {
        id: 'hc-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did Hare get the crocodile to release Demba?',
        options: [
          'He fought him',
          'He offered him food',
          'He said he must see the crocodile climb back into the sack to believe the story',
        ],
        correctIndex: 2,
      },
      {
        id: 'hc-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A stranger asks you to carry his heavy bag into a quiet, empty street. Using the tale, what is the wisest response?',
        options: [
          'Refuse to help anyone ever again',
          'Offer help in a safe way, such as in a public place or by calling an adult',
          'Follow him wherever he asks',
        ],
        correctIndex: 1,
      },
      {
        id: 'hc-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Demba finds the crocodile dying on the dry plain',
          'He carries the crocodile to the river in a sack',
          'The crocodile seizes his arm',
          'The old horse and the old cow give their answers',
          'Hare tricks the crocodile back into the sack',
        ],
      },
      {
        id: 'hc-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'repaid',
        definition: 'Given something in return for what was done.',
        distractors: [
          'Carried in a sack',
          'Left without water',
        ],
      },
    ],
    glossary: [
      {
        word: 'season',
        definition: 'Dry season: the part of the year when little or no rain falls.',
        pages: [1],
      },
      {
        word: 'pity',
        definition: 'Sorrow for someone who is suffering.',
        pages: [1],
      },
      {
        word: 'waded',
        definition: 'Walked through water.',
        pages: [2],
      },
      {
        word: 'repaid',
        definition: 'Given something in return for what was done.',
        pages: [3, 4, 6],
      },
      {
        word: 'judge',
        definition: 'To decide what is right in a disagreement.',
        pages: [5],
      },
      {
        word: 'advice',
        definition: 'An opinion about what someone should do.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale of the Sahel, told by the Wolof of Senegal, the Bambara and Fulani of Mali, and peoples of Burkina Faso and northern Ghana. In some versions the rescuer is a child.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'The answers of the horse and the cow are a criticism of people who discard those who have served them. Draw this out in discussion.',
    ],
    reviewQuestions: [
      'The name Demba was chosen for this retelling; confirm it is suitable.',
      'Check that the ending teaches caution without teaching learners to refuse all kindness.',
    ],
    guide: {
      overview:
        'A Sahelian tale that asks whether good is repaid with good, and answers with a lesson in both caution and gratitude.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain the answers of the horse and the cow.',
        'Explain how Hare’s question worked.',
        'Discuss how to be kind and careful at once.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a dilemma tale; argument and evidence'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Values: gratitude and care for those who serve us'],
      ],
      before: ['Ask: is a good deed always repaid with good? Give an example.'],
      during: ['Stop after Page 3. Take a vote: what will the animals say?'],
      after: ['Learners write a short thank-you note to someone who has served them and is seldom thanked.'],
      discussion: ['The horse and the cow agreed with the crocodile. Were they right about the world? Whose fault is that?'],
      reflection: ['Who has done good to you without being repaid? What could you do this week?'],
      maths: [
      ],
      support: ['Act the three “witnesses” with three learners giving their answers in turn.'],
      stretch: ['Rewrite the ending with a child as the rescuer and a grandmother as the judge.'],
      localise: ['How are old animals and old people treated in your community? What do our proverbs say about gratitude?'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'A traditional West African tale told in many versions. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 4
  mk({
    key: 'kintu-and-nambi',
    title: 'Kintu and Nambi',
    summary:
      'Kintu, the first man, must pass impossible tests to marry Nambi, daughter of the Sky. A story of beginnings from the Baganda people of Uganda.',
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
    paceWord: 'Grand, calm, and steady',
    palette: ['#166534', '#7c3aed'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kintu: a tall, quiet man in a bark-cloth robe, who lives alone with one cow.',
      'Nambi: a kind and determined young woman, daughter of the Sky.',
      'Gulu: her father, ruler of the Sky, stern and watchful.',
      'Walumbe: Nambi’s restless brother, whose name means sickness and death.',
    ],
    music: 'Stately drums with a clear flute (placeholder)',
    pages: [
      pg(
        '🐄',
        'The Baganda people of Uganda say that, in the beginning, there was only one man in their land. His name was Kintu. He had no family and no neighbours. He had one cow, and he lived on her milk. One day, the children of Gulu, the ruler of the Sky, came down to see the earth. Among them was a daughter named Nambi. She saw Kintu and spoke with him, and she found him gentle and honest. “I should like to marry this man,” she told her brothers. They laughed. “He has nothing but a cow!”',
        'A tall man in a bark-cloth robe standing beside a single cow on a green hill, greeting visitors from the sky.'
      ),
      pg(
        '🔥',
        'Nambi went home and asked her father. Gulu frowned. “First we shall see what kind of man he is.” He had Kintu’s cow stolen, so that Kintu had to live on leaves and bark. Then Kintu was brought up to the Sky and shut in a house with enough food for a hundred men. “Eat it all,” said Gulu’s servants, “or you are no fit husband.” Kintu ate what he could. Then he found a deep pit in the floor, poured the rest into it, and covered it over. When the servants came, the baskets were empty.',
        'A man sitting in a hut surrounded by dozens of baskets of food, looking at a pit in the floor.'
      ),
      pg(
        '🪨',
        'Gulu set a second test. He gave Kintu a copper axe. “I do not burn wood,” he said. “Cut me firewood from the rock.” Kintu went to the rock and found a crack in it. He struck there, and pieces fell away. He carried them to Gulu. Then came a third test. “Fill this great pot with water,” said Gulu, “but only with dew.” Kintu set the pot in a field and sat down in despair. In the morning, he lifted the lid. The pot was full to the brim.',
        'A man with a copper axe breaking pieces from a great rock, with a large clay pot standing in a misty field beyond.'
      ),
      pg(
        '🐝',
        '“One last test,” said Gulu. “Your cow is among my herds. Pick her out, and you may marry my daughter.” There were thousands of cattle, and many looked exactly like Kintu’s cow. As he stood wondering, a bee buzzed at his ear. “Watch me,” it said. “I shall settle on the horn of the one that is yours.” The first herd passed, and the bee did not move. The second passed. In the third herd, the bee flew out and settled on a horn. “That one is mine,” said Kintu. Gulu laughed. “Truly, nobody can cheat this man.”',
        'A man standing before a huge herd of cattle while a bee flies towards the horn of one cow.'
      ),
      pg(
        '⚠️',
        'So Kintu and Nambi were married. Gulu gave them cows, goats, a hen, and plants to grow: the banana, the yam, and millet. Then he gave a warning. “Leave early in the morning, and do not come back for anything you forget. Your brother Walumbe is away. If he sees you going, he will want to go with you, and he will bring you sorrow.” They set off. Halfway down, Nambi stopped. “The millet for my hen! I left it behind.” Kintu begged her not to return. But she went. And when she came back, Walumbe was walking beside her.',
        'A couple descending from the sky with cows, goats, and a hen, the woman turning to look back.'
      ),
      pg(
        '🌱',
        'For a time, they lived happily, and children were born. Then Walumbe began to take the children, one after another, for he was Death. Gulu sent another son to catch Walumbe and bring him home, but Walumbe hid deep in the ground and could not be caught. At last Kintu said, “Let him be. He may take some of my children. But he shall never take them all. The children of Kintu will always be more than he can finish.” And so it has been. The Baganda call themselves the children of Kintu to this day.',
        'A family with many children working in a banana garden, with green hills stretching into the distance.'
      ),
    ],
    activities: [
      {
        id: 'kn-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why did Nambi wish to marry Kintu?',
        options: [
          'He was the richest man on earth',
          'She found him gentle and honest',
          'Her father ordered her to',
        ],
        correctIndex: 1,
      },
      {
        id: 'kn-c2',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Kintu find his own cow among thousands?',
        options: [
          'A bee settled on her horn',
          'He called her name',
          'She was the only white one',
        ],
        correctIndex: 0,
      },
      {
        id: 'kn-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What warning did Gulu give?',
        options: [
          'Do not eat the millet',
          'Do not speak to strangers',
          'Do not come back for anything you forget',
        ],
        correctIndex: 2,
      },
      {
        id: 'kn-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Kintu said that Death would never finish his children. Which attitude does this show when a community faces a great loss?',
        options: [
          'Giving up',
          'Hope and determination to carry on',
          'Blaming one another',
        ],
        correctIndex: 1,
      },
      {
        id: 'kn-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Nambi meets Kintu and wishes to marry him',
          'Kintu eats, or hides, a meal for a hundred men',
          'A bee helps him find his cow',
          'Nambi goes back for the millet',
          'Walumbe comes to live on earth',
        ],
      },
      {
        id: 'kn-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'despair',
        definition: 'The feeling that there is no hope.',
        distractors: [
          'Great joy at a wedding',
          'A tool for cutting wood',
        ],
      },
    ],
    glossary: [
      {
        word: 'honest',
        definition: 'Truthful and fair.',
        pages: [1],
      },
      {
        word: 'fit',
        definition: 'Suitable; good enough.',
        pages: [2],
      },
      {
        word: 'dew',
        definition: 'Small drops of water that form on the ground in the night.',
        pages: [3],
      },
      {
        word: 'despair',
        definition: 'The feeling that there is no hope.',
        pages: [3],
      },
      {
        word: 'herds',
        definition: 'Large groups of cattle.',
        pages: [4],
      },
      {
        word: 'sorrow',
        definition: 'Deep sadness.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Where it is told: the founding story of the Baganda people of Uganda, whose first king is said to be Kintu. It is an origin story, held in respect.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'The story explains, in the way of many peoples, how death came into the world. It should be read with the same respect given to any people’s account of beginnings.',
    ],
    reviewQuestions: [
      'Ask a Luganda speaker or a Ugandan reviewer to confirm names (Kintu, Nambi, Gulu, Walumbe) and the respectful tone.',
      'Page 6 speaks of the death of children; check its tone for younger learners.',
    ],
    guide: {
      overview:
        'The Baganda story of the first man and his marriage to a daughter of the Sky, explaining beginnings and expressing hope in the face of loss.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Describe the tests and how Kintu passed each.',
        'Explain the warning and what followed when it was not kept.',
        'Discuss Kintu’s final words.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading an origin story; sequence and theme'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'How peoples explain their beginnings; respect for other cultures'],
      ],
      before: ['Ask: what stories do our own peoples tell about how they began?'],
      during: ['Stop after Page 5. Ask: should Nambi go back for the millet? Why might she?'],
      after: ['Compare this story with one origin story from Ghana (for example, the Asante, the Ga, or the Ewe).'],
      discussion: ['Was Nambi wrong to go back? She was caring for her hen. Can a small, kind act have a large cost?'],
      reflection: ['What helps your family or community to carry on after a loss?'],
      maths: [
      ],
      support: ['Use four picture cards for the four tests and let learners match each to its solution.'],
      stretch: ['Find out where Buganda is, who the Kabaka is, and one other fact about the kingdom.'],
      localise: ['Ask an elder how your own people explain where they came from.'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'The origin story of the Baganda, told in several versions; the number and order of the tests vary. No dates need checking. Confirm names and tone with a Ugandan reviewer. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 5
  mk({
    key: 'the-honeyguides-revenge',
    title: 'The Honeyguide’s Revenge',
    summary:
      'A small bird leads a hunter to honey and expects a share. A tale told by the Ndebele and Zulu peoples of southern Africa about thanking those who help you.',
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
    paceWord: 'Bright and easy, then sharp',
    palette: ['#ca8a04', '#365314'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Ngede: a small brown-and-white honeyguide bird with a loud, chattering call.',
      'Gingile: a strong young hunter with a spear and a bag, greedy and sure of himself.',
      'The leopard: a large leopard asleep on the branch of a tree.',
    ],
    music: 'Quick, chattering flute over a light drum (placeholder)',
    pages: [
      pg(
        '🐦',
        'A young hunter named Gingile was walking through the bush one morning when he heard a call. Chitik-chitik-chitik! He looked up. On a branch sat a small brown bird, fluttering its wings. Gingile smiled. Every hunter knew that bird. It was Ngede, the honeyguide. The honeyguide knows where the wild bees keep their honey, but it is too small to break into the nest. So it finds a person, calls until it is noticed, and leads the way. Gingile licked his lips. “Lead on, little friend,” he said. “I am right behind you.”',
        'A small brown bird calling from a branch while a young hunter with a spear looks up, smiling.'
      ),
      pg(
        '🌳',
        'Ngede flew from tree to tree, calling all the time and waiting for the man to catch up. At last the bird stopped in a great fig tree and fell silent. Gingile looked up and saw bees going in and out of a hole in the trunk. He put down his spear. He gathered dry grass, lit it, and climbed with the smoking bundle between his teeth. He pushed the smoke into the hole, and the bees, made sleepy, flew off. Then he reached in and pulled out the comb, heavy and golden with honey.',
        'A hunter climbing a fig tree with a bundle of smoking grass, bees streaming from a hole in the trunk.'
      ),
      pg(
        '🍯',
        'Gingile slid down the tree with his bag full. Ngede hopped along a low branch, chattering. The bird was waiting for its share, for that is the custom. Since the days of the first ancestors, whoever takes honey with the help of a honeyguide leaves a good piece of the comb on the ground as thanks. But Gingile looked at the bird and laughed. “Why should I share with you? I climbed the tree. I was stung. You only showed the way.” He ate until he was full and carried the rest home.',
        'A hunter walking away with a bulging bag, eating honeycomb, while a small bird hops angrily on a branch.'
      ),
      pg(
        '😠',
        'Ngede sat on the branch for a long time. Not a crumb of comb had been left. The little bird was angry, but it said nothing more that day. Weeks went by. The honey was finished, and Gingile began to think about it again. One morning he heard the call. Chitik-chitik-chitik! There was Ngede, fluttering as before. “Ah,” said Gingile, “my foolish little friend has forgotten.” He took his bag and followed. The bird led him a long way, to a tall umbrella thorn tree, and settled in its branches.',
        'A hunter following a small bird across open bush towards a wide, flat-topped thorn tree.'
      ),
      pg(
        '🐆',
        'Gingile could not see any bees, but he trusted the bird. He lit his grass, put it between his teeth, and climbed. Higher and higher he went, peering through the smoke for the nest. He reached the branch where Ngede was sitting. Something lay along it. It was not a bees’ nest. It was a leopard, fast asleep in the heat of the day. The smoke drifted into her nose. She opened her yellow eyes, and with one paw she struck at the thing that had woken her. Ngede flew away without a sound.',
        'A hunter high in a thorn tree, face to face with a leopard waking on a branch.'
      ),
      pg(
        '🩹',
        'Gingile fell from the tree, crashing through the branches, and landed hard. He was lucky that the leopard was too sleepy to follow. He crawled home with a broken leg and deep scratches, and he walked with a limp for the rest of his life. He never followed a honeyguide again. But he told the story to his children, and they told it to theirs. And so, to this day, when people in southern Africa take honey with the help of the little bird, they leave the best piece of the comb for Ngede.',
        'A man with a walking stick placing a piece of honeycomb on a flat stone as a small bird watches.'
      ),
    ],
    activities: [
      {
        id: 'hg-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Why does the honeyguide lead people to bees’ nests?',
        options: [
          'It knows where the honey is but is too small to break into the nest',
          'It is afraid of people',
          'It wants to be caught',
        ],
        correctIndex: 0,
      },
      {
        id: 'hg-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What is the custom when a honeyguide has helped?',
        options: [
          'Catch the bird and keep it',
          'Burn the tree',
          'Leave a good piece of the comb for the bird',
        ],
        correctIndex: 2,
      },
      {
        id: 'hg-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Ngede lead Gingile to the second time?',
        options: [
          'A bigger bees’ nest',
          'A sleeping leopard',
          'His own village',
        ],
        correctIndex: 1,
      },
      {
        id: 'hg-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A classmate helps you to revise, and you pass the test. According to the tale, what should you do?',
        options: [
          'Say that you did it alone',
          'Thank the classmate and help in return when you can',
          'Ask for more help without a word of thanks',
        ],
        correctIndex: 1,
      },
      {
        id: 'hg-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Ngede calls to Gingile and leads him to a fig tree',
          'Gingile smokes out the bees and takes the honey',
          'He refuses to leave any comb for the bird',
          'Ngede leads him to a thorn tree',
          'Gingile meets the leopard and falls',
        ],
      },
      {
        id: 'hg-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'custom',
        definition: 'The accepted way of doing things in a community.',
        distractors: [
          'A tree where bees live',
          'A bag for carrying honey',
        ],
      },
    ],
    glossary: [
      {
        word: 'honeyguide',
        definition: 'A small African bird that leads people to wild bees’ nests.',
        pages: [1, 6],
      },
      {
        word: 'comb',
        definition: 'The wax structure in which bees store honey.',
        pages: [2, 3, 4, 6],
      },
      {
        word: 'custom',
        definition: 'The accepted way of doing things in a community.',
        pages: [3],
      },
      {
        word: 'ancestors',
        definition: 'Family members who lived long ago.',
        pages: [3],
      },
      {
        word: 'peering',
        definition: 'Looking closely or with difficulty.',
        pages: [5],
      },
      {
        word: 'limp',
        definition: 'An uneven way of walking because of an injured leg.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale of the Ndebele people of Zimbabwe and the Zulu people of South Africa. Similar stories are told wherever honeyguides and honey hunters work together.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Science link: the greater honeyguide is a real bird that leads people to bees’ nests in several African countries and feeds on the wax left behind. It is one of the few wild animals known to work with people in this way.',
    ],
    reviewQuestions: [
      'The names Ngede and Gingile follow the traditional telling; confirm spelling with a Zulu or Ndebele speaker.',
      'Check that the fall is told without frightening detail.',
    ],
    guide: {
      overview:
        'A southern African tale about a honey hunter who cheats his guide, teaching gratitude and respect for custom, with a link to real animal behaviour.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain the partnership between the bird and the hunter.',
        'Explain why Gingile was punished.',
        'Apply the lesson to thanking those who help us.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading for cause and effect'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Values: gratitude and respect for custom and nature'],
      ],
      before: ['Ask: do you know of any wild animal that helps people? Tell learners there is a bird that does.'],
      during: ['Stop after Page 4. Ask: why has the bird come back?'],
      after: ['Learners list three people who help them and how each can be thanked.'],
      discussion: ['Gingile said, “I climbed the tree. You only showed the way.” How much is showing the way worth?'],
      reflection: ['Who has shown you the way to something good? Have you thanked them?'],
      maths: [
      ],
      support: ['Play “follow the bird”: one learner calls and leads another to a hidden “honey” card.'],
      stretch: ['Find out how honeyguides and people call to each other in Mozambique or Tanzania.'],
      localise: ['How is wild honey collected in your area, and is anything left behind for the bees or for others?'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'A traditional southern African tale. The description of honeyguide behaviour in the teacher’s note is well established, but confirm the details with a science reviewer. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 6
  mk({
    key: 'the-peasant-who-spoke-well',
    title: 'The Peasant Who Spoke Well',
    summary:
      'A poor trader is robbed by a rich man’s servant and has only his words to fight with. A story written down in Egypt about four thousand years ago, about justice and the power of speech.',
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
    paceWord: 'Dignified, clear, and stirring',
    palette: ['#b45309', '#1e3a8a'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Khun-Anup: a thin, sunburnt peasant in a plain linen kilt, leading loaded donkeys.',
      'Nemtynakht: a greedy, well-fed man with a stick, who works for a great official.',
      'Rensi: the High Steward, a fair-minded official in a fine white robe and wide collar.',
      'The King: the ruler of Egypt, seated in his palace, who loves fine speech.',
    ],
    music: 'Slow harp-like strings with a soft reed flute (placeholder)',
    pages: [
      pg(
        '🫏',
        'Four thousand years ago, in the land of Egypt, there lived a poor man named Khun-Anup. His home was an oasis in the desert, west of the River Nile. One day his family’s grain was almost finished. He loaded his donkeys with the goods of the oasis: salt, reeds, herbs, and the skins of wild animals. “I am going down to the city to trade these for grain,” he told his wife. He walked for many days. At last he came to a narrow path between the river and a field of barley.',
        'A thin peasant in a linen kilt leading loaded donkeys along a path beside the Nile.'
      ),
      pg(
        '🧺',
        'The land there was farmed by a man named Nemtynakht. He saw the loaded donkeys, and he wanted them. So he spread a sheet of cloth across the path, with one edge in the water and the other in the barley. “Take care, peasant,” he called. “Do not tread on my cloth.” Khun-Anup could not go through the river. He led his donkeys along the edge of the field. One donkey bit off a mouthful of barley. “Thief!” shouted Nemtynakht. “Your donkey has eaten my grain. I shall take them all.” And he beat the peasant with his stick.',
        'A cloth stretched across a narrow path between a river and a barley field, with a stout man blocking the way.'
      ),
      pg(
        '⚖️',
        'Khun-Anup wept for his donkeys, but nobody came to help. For ten days he begged Nemtynakht, who only laughed. Then the peasant walked to the city and found the High Steward, Rensi, who was Nemtynakht’s master and a judge. Khun-Anup had no money and no friends. He had only his tongue. He bowed and began to speak. “High Steward, you are the father of the orphan and the husband of the widow. You are the steering oar of the whole land. Do justice, for justice lasts for ever.” Rensi had never heard a poor man speak so well.',
        'A peasant bowing and speaking with one hand raised before a high official seated on a chair.'
      ),
      pg(
        '📜',
        'Rensi went to the King. “My lord, I have found a peasant who speaks most beautifully. He has been robbed.” The King loved fine words. “Do not answer him yet,” he said. “Let him keep speaking, and have every word written down and brought to me. But see that his wife and children are sent food each day, and feed him too, without his knowing who sends it.” So Rensi said nothing. Khun-Anup came back the next day and spoke again. And the next. Scribes sat behind a screen and wrote down every word.',
        'A scribe seated cross-legged behind a screen, writing on a long scroll, while a peasant speaks beyond it.'
      ),
      pg(
        '🗣️',
        'Nine times Khun-Anup came. At first he praised the High Steward. When no answer came, he grew bolder. “You were set here to stop the robber, and you have become his shelter. The scales must not tilt. The one who should punish wrong is doing wrong himself.” Rensi’s guards beat him for his boldness, and still he spoke. After the ninth speech, he had no hope left. “I have begged, and you have not heard,” he said. “Now I shall go and complain of you to the god of the dead.” He turned to leave.',
        'A peasant standing straight and speaking boldly while guards with sticks stand at either side.'
      ),
      pg(
        '🏆',
        '“Stay,” said Rensi. He had the scrolls brought out and read aloud, all nine speeches. Khun-Anup listened in wonder. Then the scrolls were sent to the King, who was more pleased with them than with anything in his kingdom. “Judge the case yourself,” he told Rensi. Rensi did. Nemtynakht was brought in, and everything he owned, his house, his fields, and his cattle, was given to the peasant. The donkeys were given back as well. The story was copied by Egyptian scribes for centuries. It is one of the oldest stories in the world about a poor person who spoke up and won.',
        'A peasant receiving his donkeys back as a high official hands him a scroll, with scribes looking on.'
      ),
    ],
    activities: [
      {
        id: 'ep-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'How did Nemtynakht trap the peasant?',
        options: [
          'He dug a pit in the path',
          'He spread a cloth across the path so the donkeys had to walk beside his barley',
          'He hid the peasant’s donkeys at night',
        ],
        correctIndex: 1,
      },
      {
        id: 'ep-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What was the only thing Khun-Anup had to fight with?',
        options: [
          'His skill with words',
          'A sword',
          'Rich friends in the city',
        ],
        correctIndex: 0,
      },
      {
        id: 'ep-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did the King order that the peasant should not be answered at once?',
        options: [
          'He did not believe him',
          'He wanted to punish him',
          'He wanted to hear more of his fine speeches and have them written down',
        ],
        correctIndex: 2,
      },
      {
        id: 'ep-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A market woman is cheated by a powerful person and has no money for a lawyer. Using the tale, what can she still do?',
        options: [
          'Nothing at all',
          'Speak up clearly and persistently to those who can give justice',
          'Cheat someone else in return',
        ],
        correctIndex: 1,
      },
      {
        id: 'ep-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Khun-Anup sets out with his donkeys to buy grain',
          'Nemtynakht takes the donkeys and beats him',
          'Khun-Anup speaks before the High Steward',
          'The King has his speeches written down',
          'Nemtynakht’s property is given to the peasant',
        ],
      },
      {
        id: 'ep-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'justice',
        definition: 'Fair treatment according to what is right.',
        distractors: [
          'A sheet of cloth',
          'A kind of grain',
        ],
      },
    ],
    glossary: [
      {
        word: 'oasis',
        definition: 'A place in the desert where there is water and plants grow.',
        pages: [1],
      },
      {
        word: 'barley',
        definition: 'A grain crop grown for food.',
        pages: [1, 2],
      },
      {
        word: 'justice',
        definition: 'Fair treatment according to what is right.',
        pages: [3],
      },
      {
        word: 'scribes',
        definition: 'People whose work was to write and keep records.',
        pages: [4, 6],
      },
      {
        word: 'scales',
        definition: 'An instrument for weighing; a sign of fair judgement.',
        pages: [5],
      },
      {
        word: 'scrolls',
        definition: 'Long rolls of writing material.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: this is not a folk tale collected from storytellers but a story written on papyrus in ancient Egypt, about four thousand years ago. It is known as the Tale of the Eloquent Peasant.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'It is among the oldest written stories from Africa. The speeches in this retelling give the sense of the original in new words; they are not translations.',
    ],
    reviewQuestions: [
      'Ask a history reviewer to confirm that the outline follows the ancient story.',
      'Discuss honestly that the peasant was kept waiting, and beaten, for the King’s pleasure.',
    ],
    guide: {
      overview:
        'A retelling of a four-thousand-year-old Egyptian story in which a poor man wins justice by speaking well and not giving up.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain how the peasant was robbed.',
        'Describe how he argued his case.',
        'Discuss justice, persistence, and the fairness of the King’s delay.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading an ancient story; persuasive speaking'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Justice, rights, and speaking up'],
      ],
      before: ['Ask: what can a person with no money and no power do when wronged?'],
      during: ['Stop after Page 4. Ask: is the King being fair to the peasant?'],
      after: ['Learners write and deliver a one-minute speech asking for justice in a case of their choice.'],
      discussion: ['The peasant got justice in the end, but he was made to suffer first. Was the King right to delay?'],
      reflection: ['When did you speak up about something unfair? What happened?'],
      maths: [
      ],
      support: ['Give sentence starters for a speech: “You are…”, “I ask you to…”, “Because…”.'],
      stretch: ['Find out what papyrus is, how Egyptians wrote on it, and why their stories have survived.'],
      localise: ['Where can a person in your community go to seek justice without money? Find out.'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'Based on the ancient Egyptian “Tale of the Eloquent Peasant”, written about 2000 to 1800 years before the Common Era. The names Khun-Anup, Nemtynakht, and Rensi come from the ancient text. Confirm the outline with a history reviewer. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 7
  mk({
    key: 'the-frog-who-went-to-the-sky',
    title: 'The Frog Who Went to the Sky',
    summary:
      'A young man wishes to marry the daughter of the Sun and the Moon, and only Frog knows how to carry his letter. A tale of the Mbundu people of Angola about a small helper with a clever plan.',
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
    paceWord: 'Light, patient, and quietly funny',
    palette: ['#15803d', '#ea580c'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kimana: a serious young man in a woven cloth, who has set his heart on an impossible marriage.',
      'Frog: a small green frog with a wide mouth and a calm, businesslike manner.',
      'The Sun and the Moon: the lord and lady of the sky, seated in a bright house above the clouds.',
      'The water carriers: young women of the sky who come down each day to fetch water.',
    ],
    music: 'Soft marimba pattern with water sounds (placeholder)',
    pages: [
      pg(
        '☀️',
        'In the land of Angola, there lived a young man named Kimana. When it was time for him to marry, his father named many fine young women. Kimana shook his head at each. “I shall marry the daughter of the Sun and the Moon,” he said, “or I shall marry no one.” His father stared. “How will you even ask? Who can go up to the sky?” Kimana wrote a letter asking for the daughter’s hand. Then he went looking for someone to carry it. He asked Antelope. “I cannot go to the sky,” said Antelope.',
        'A young man holding a folded letter, looking up at the sun, with his father shaking his head beside him.'
      ),
      pg(
        '🦅',
        'He asked Hawk. “I can fly high,” said Hawk, “but not as high as that.” He asked Vulture, who flies highest of all. “I can go halfway,” said Vulture, “and no further.” Kimana put the letter away. He was walking sadly by the well when a small voice spoke from the mud. “Give me the letter. I will take it.” It was Frog. Kimana almost laughed. “Those with wings have failed. How can you, who can only hop?” “That is my affair,” said Frog. “Only give it to me.” Kimana had nothing to lose, so he handed over the letter.',
        'A hawk and a vulture looking down from a tree as a small frog speaks from the edge of a well.'
      ),
      pg(
        '💧',
        'Now Frog knew something that the others did not. Every day, the water carriers of the Sun and the Moon came down from the sky on a thread spun by Spider. They filled their jugs at this very well and went up again. Frog put the letter in his mouth, slipped into the well, and waited. Down came the young women. One dipped her jug into the water, and Frog swam inside it. She lifted the jug onto her head, climbed the thread, and set it down in the house of the Sun.',
        'Young women climbing down a shining thread from the sky towards a well, where a frog waits in the water.'
      ),
      pg(
        '✉️',
        'When the room was empty, Frog hopped out, placed the letter on a table, and hid in a corner. The Sun came in and found it. He read: “I, Kimana, a man of the earth, wish to marry your daughter.” The Sun was amazed. “Who brought this?” he asked the water carriers. They did not know. He wrote a reply: “Come yourself, with a proper gift, and we shall see.” He left it on the table. Frog took it in his mouth, climbed into an empty jug, and rode down to the well the next morning.',
        'A frog placing a letter on a table in a bright room, with the Sun’s glowing figure entering at the door.'
      ),
      pg(
        '🎁',
        'Kimana could hardly believe it when Frog put the answer in his hand. He sent back a gift of money. Frog carried it up in the jug. The Sun and the Moon were pleased, and they asked for the full marriage gift. Frog carried that as well, a little at a time. Each time, the people of the sky found the gifts on the table and never saw who had brought them. At last the Sun wrote: “We agree. Let the bridegroom send for his bride.” Now came the hardest part. How could the bride come down?',
        'A frog carrying a small bag in his mouth, sitting inside a water jug balanced on a young woman’s head.'
      ),
      pg(
        '💍',
        'Frog thought it over. Then he went up once more. He spoke to the Sun and the Moon himself, for the first time. “I am the messenger of Kimana,” he said. “I have come to bring the bride home.” They were astonished to see who their visitor had been. But they kept their word. The bride came down the spider’s thread with the water carriers, and Frog led her from the well to Kimana’s door. There was a great wedding. And the people of Angola still say: do not despise a small helper, for he may know a road that the great ones cannot find.',
        'A bride in bright cloth descending a shining thread to a well, where a frog waits to lead her to a village.'
      ),
    ],
    activities: [
      {
        id: 'fs-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why did Kimana almost laugh at Frog’s offer?',
        options: [
          'Frog had told a joke',
          'Even the birds with wings had failed, and Frog could only hop',
          'Frog asked for too much money',
        ],
        correctIndex: 1,
      },
      {
        id: 'fs-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Frog know that the others did not?',
        options: [
          'The sky’s water carriers came down to that well every day',
          'The Sun was asleep',
          'The letter was false',
        ],
        correctIndex: 0,
      },
      {
        id: 'fs-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Frog deliver the letter?',
        options: [
          'He threw it into the air',
          'He gave it to Vulture',
          'He rode up inside a water jug and left it on a table',
        ],
        correctIndex: 2,
      },
      {
        id: 'fs-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A big problem at school defeats the strongest pupils. A quiet classmate says she has an idea. Using the tale, what should the others do?',
        options: [
          'Ignore her because she is quiet',
          'Listen, because she may know a way that others have missed',
          'Tell her to try harder at sports',
        ],
        correctIndex: 1,
      },
      {
        id: 'fs-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Kimana decides to marry the daughter of the Sun and the Moon',
          'Antelope, Hawk, and Vulture cannot carry the letter',
          'Frog rides up to the sky in a water jug',
          'Frog carries the reply and the marriage gifts',
          'The bride comes down and the wedding is held',
        ],
      },
      {
        id: 'fs-voc',
        type: 'vocabulary',
        afterPage: 6,
        word: 'despise',
        definition: 'To look down on someone as worthless.',
        distractors: [
          'To carry a heavy load',
          'To write a letter',
        ],
      },
    ],
    glossary: [
      {
        word: 'affair',
        definition: 'A matter that concerns a particular person.',
        pages: [2],
      },
      {
        word: 'jugs',
        definition: 'Containers for carrying water.',
        pages: [3],
      },
      {
        word: 'reply',
        definition: 'An answer.',
        pages: [4],
      },
      {
        word: 'bridegroom',
        definition: 'A man who is about to be married.',
        pages: [5],
      },
      {
        word: 'astonished',
        definition: 'Very surprised.',
        pages: [6],
      },
      {
        word: 'despise',
        definition: 'To look down on someone as worthless.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: a tale of the Mbundu (Ambundu) people of Angola, among the first Angolan tales to be written down, in the 1890s.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'The marriage gift in the tale reflects the custom, found across Africa including Ghana, in which the bridegroom’s family presents gifts to the bride’s family.',
    ],
    reviewQuestions: [
      'The name Kimana follows the traditional telling; confirm with a reviewer who knows Angolan tales.',
      'Check that the marriage custom is described neutrally.',
    ],
    guide: {
      overview:
        'An Angolan tale in which a small, overlooked creature succeeds through knowledge and patience where stronger ones fail.',
      lessonMinutes: 45,
      goals: [
        'Retell the tale in order.',
        'Explain what Frog knew and how he used it.',
        'State the saying at the end in your own words.',
        'Discuss the value of quiet, careful people.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading for plot; problem and solution'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Marriage customs; respect for every person’s gifts'],
      ],
      before: ['Ask: who could carry a message to the sky? List ideas.'],
      during: ['Stop after Page 2. Ask: how might a frog reach the sky?'],
      after: ['Learners draw Frog’s route as a diagram: well, jug, thread, sky, and back.'],
      discussion: ['Frog kept his method secret until the end. Was that wise? Why?'],
      reflection: ['What do you know, or can you do, that others around you tend to overlook?'],
      maths: [
      ],
      support: ['Use a cup and a paper frog to act out the journey up and down.'],
      stretch: ['Write the letter that Kimana sent and the reply from the Sun.'],
      localise: ['How does a family in your community ask for a bride? Who carries the messages?'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'A traditional Mbundu tale from Angola, told in several versions. No dates or facts need checking. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

  // 8
  mk({
    key: 'sunjata-the-boy-who-could-not-walk',
    title: 'Sunjata: The Boy Who Could Not Walk',
    summary:
      'A prince of old Mali cannot walk until the day his mother is insulted. A legend told by the griots of Mali and Guinea about the founder of a great empire.',
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
    paceWord: 'Grand, measured, and stirring',
    palette: ['#92400e', '#166534'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Sunjata: a broad-shouldered boy of seven with strong arms, who moves about on his hands and knees.',
      'Sogolon: his mother, a woman with a bent back and a brave, loving face.',
      'Sassouma: the king’s first wife, proud and sharp-tongued.',
      'The blacksmith: an old master smith with a leather apron, keeper of a great iron rod.',
    ],
    music: 'Kora and balafon in a slow, noble rhythm (placeholder)',
    pages: [
      pg(
        '🎶',
        'In Mali and Guinea, there are families of musicians called griots. A griot plays the kora, a harp with twenty-one strings, and carries in memory the history of kings. The greatest story they tell is eight hundred years old. It begins in the small kingdom of the Mande people, on the upper River Niger. The king had a wife named Sogolon. People mocked her, because she was not beautiful and her back was bent. But hunters who could read the future had told the king: marry this woman, and her son will be the greatest ruler the land has known.',
        'A griot seated with a kora, playing before a small audience under a tree.'
      ),
      pg(
        '👶',
        'Sogolon had a son and named him Sunjata. He was a strong, healthy baby. But as he grew, something was wrong. At three years old, he could not stand. At five, he still crawled on his hands and knees. At seven, he had the arms of a wrestler and legs that would not hold him. The king’s first wife, Sassouma, laughed loudly. “Is this the great ruler we were promised? My son was walking before he was one.” Sogolon said nothing. She cared for her son, and she waited. Sunjata heard every word, and he waited too.',
        'A boy with strong arms crawling in a palace courtyard while a richly dressed woman laughs from a doorway.'
      ),
      pg(
        '🌿',
        'The old king died, and Sassouma’s son was made king in his place. Sogolon and her children were pushed into a small hut at the back of the palace. One day, Sogolon needed baobab leaves for her sauce. She had none, so she went to Sassouma to ask for some. Sassouma held out a basket with a cruel smile. “Take them. My son picked these for me when he was seven. Yours cannot even stand. What use is such a child to his mother?” Sogolon went home weeping, and she told Sunjata what had been said.',
        'A woman with a bent back walking away in tears with a small basket of leaves.'
      ),
      pg(
        '⚒️',
        'Sunjata was silent for a moment. Then he said, “Mother, dry your tears. Today I am going to walk. Send to the blacksmith, and ask for the heaviest iron rod he has. And you shall have baobab leaves: I will bring you the whole tree.” The master smith had been keeping such a rod for years, though he did not know why. Six men carried it to the hut and laid it down. A crowd gathered. Sassouma came to watch and laugh. Sunjata crawled to the rod and took hold of it with both hands.',
        'Six men carrying a huge iron rod towards a small hut, with a crowd gathering behind them.'
      ),
      pg(
        '🏹',
        'He set one end on the ground and began to pull himself up. His arms shook. Sweat ran down his face. His knees left the earth. Slowly, slowly, he rose, and as he rose, the great iron rod bent under his weight, until it was curved like a bow. Then Sunjata let go, and he was standing. The crowd was silent. He took one step, and another. The griot at his side cried out a song that is still sung today. And Sassouma covered her mouth with her hand and went indoors.',
        'A boy standing upright for the first time, gripping an iron rod that has bent into the shape of a bow.'
      ),
      pg(
        '🌳',
        'Sunjata walked out of the town to a young baobab tree. He put his arms round its trunk, pulled it up by the roots, and carried it on his shoulder to his mother’s door. “Here are your leaves, Mother,” he said. From that day, his strength was known everywhere. He grew up to be a great hunter and leader. Around the year 1235, he defeated a cruel king and founded the empire of Mali, one of the richest that Africa has known. The griots end the story with a warning: never laugh at a child who is slow to rise.',
        'A boy carrying an uprooted baobab tree on his shoulder to the door of a small hut where his mother waits.'
      ),
    ],
    activities: [
      {
        id: 'sj-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Who are the griots?',
        options: [
          'Blacksmiths who make iron rods',
          'Musicians who keep and tell the history of kings',
          'Hunters who read the future',
        ],
        correctIndex: 1,
      },
      {
        id: 'sj-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What made Sogolon weep?',
        options: [
          'Sassouma mocked her because her son could not walk',
          'The king had died',
          'She had lost her basket',
        ],
        correctIndex: 0,
      },
      {
        id: 'sj-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What happened to the iron rod as Sunjata stood up?',
        options: [
          'It broke in two',
          'It sank into the ground',
          'It bent into the shape of a bow',
        ],
        correctIndex: 2,
      },
      {
        id: 'sj-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A classmate is far behind the others in reading, and some pupils laugh at her. Using the legend, what should they remember?',
        options: [
          'Slow learners never succeed',
          'A slow start does not decide how far a person will go',
          'Laughing helps people to improve',
        ],
        correctIndex: 1,
      },
      {
        id: 'sj-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Hunters foretell that Sogolon’s son will be a great ruler',
          'Sunjata reaches the age of seven without walking',
          'Sassouma insults Sogolon over the baobab leaves',
          'Sunjata stands up with the iron rod',
          'He brings the baobab tree to his mother',
        ],
      },
      {
        id: 'sj-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'griot',
        definition: 'A West African musician and storyteller who keeps the history of a people.',
        distractors: [
          'A kind of iron rod',
          'A tree with large leaves',
        ],
      },
    ],
    glossary: [
      {
        word: 'griot',
        definition: 'A West African musician and storyteller who keeps the history of a people.',
        pages: [1, 5],
      },
      {
        word: 'mocked',
        definition: 'Laughed at unkindly.',
        pages: [1],
      },
      {
        word: 'wrestler',
        definition: 'A person who fights by gripping and throwing an opponent.',
        pages: [2],
      },
      {
        word: 'baobab',
        definition: 'A large African tree with a very thick trunk; its leaves are used in cooking.',
        pages: [3, 4, 6],
      },
      {
        word: 'blacksmith',
        definition: 'A person who makes things from iron.',
        pages: [4],
      },
      {
        word: 'empire',
        definition: 'A large state that rules over many peoples and lands.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Where it is told: the Sunjata (Sundiata) epic is told by the griots of Mali, Guinea, the Gambia, and Senegal. Sunjata Keita was a real ruler who founded the Mali empire in the 1200s; the story of his childhood is legend.',
      'A traditional tale retold in original words for Ghanaian JHS learners. It is not copied from any published version.',
      'Link to Ghana: the horsemen who founded the Gonja kingdom are said to have come from the lands of old Mali. Baobab leaves are used in soups in northern Ghana too.',
    ],
    reviewQuestions: [
      'Ask a reviewer who knows the Mande tradition to confirm names (Sunjata, Sogolon, Sassouma) and that the retelling is respectful.',
      'Check that Sunjata’s early inability to walk is described without mockery from the narrator.',
    ],
    guide: {
      overview:
        'The childhood legend of the founder of the Mali empire, teaching patience, respect for a mother, and that a slow start is not a final verdict.',
      lessonMinutes: 45,
      goals: [
        'Retell the legend in order.',
        'Explain who the griots are and what they do.',
        'Describe how Sunjata came to stand and walk.',
        'Distinguish what is history from what is legend in the story.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: reading, listening, and oral literature; codes to verify)', 'Reading a legend; distinguishing legend from history'],
        ['Social Studies (NaCCA CCP B9.3.3.1.1: Strand 3: Sense of Purpose, Sub-Strand 3: Culture and National Identity)', 'Great African empires; oral tradition as a source of history'],
      ],
      before: ['Ask: have you ever been laughed at for being slow at something? How did it feel?'],
      during: ['Stop after Page 4. Ask: what do you think the iron rod is for?'],
      after: ['Make two lists: what in the story is history, and what is legend.'],
      discussion: ['Why do you think Sunjata stood up on that day and not before?'],
      reflection: ['What are you slow at now that you intend to master?'],
      maths: [
      ],
      support: ['Let learners feel the weight of a heavy object lifted with two hands, then imagine a rod six men must carry.'],
      stretch: ['Find out about the Mali empire: its gold, the city of Timbuktu, and Mansa Musa.'],
      localise: ['Who are the keepers of history in your own community: drummers, linguists, or praise singers?'],
      factCheck: [
        {
          claim: 'Folk-tale origin and curriculum verification',
          explanation: 'Sunjata Keita founded the Mali empire in the 1200s; the battle that brought him to power is usually dated about 1235. The childhood story is legend and is told in many versions. Confirm names and dates with a history reviewer. The Social Studies code B9.3.3.1.1 was checked against the NaCCA CCP Social Studies curriculum document (NaCCA, 2021); the English Language link has no code yet.',
          reference: 'NaCCA JHS Social Studies & English Language (Oral Literature) Curriculum',
        },
      ],
    },
  }),

];
export const BATCH_46_AFRICAN_FOLK_TALES: PilotStory[] = BATCH_46_STORIES;
