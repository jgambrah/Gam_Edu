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
 * Batch 59 (5 original Life Lessons stories, nine pages each, with activities), for JHS (Basic 7 to Basic 9).
 * Each article is linked to Social Studies, Career Technology, Science, or Computing (see the first cultural note and the teacher guide).
 * These are original stories and articles, each teaching one idea from a well-known book. Stories list their characters; articles have none.
 * Original text written for Ghanaian learners; each factCheck note names the book behind the idea and what to verify.
 */

export const BATCH_59_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'the-bicycle-lamp',
    title: 'The Bicycle Lamp',
    summary:
      'Akosua cannot study at night because the power keeps going off and the kerosene lamp makes her family cough. She learns how a bicycle dynamo works and builds a lamp from what she has. A story about learning first, then building small and improving.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'learning', 'invention', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Curious, then determined',
    palette: ['#ca8a04', '#1e3a8a'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Akosua: a JHS 2 girl who wants to study at night.',
      'Kojo: her little brother, who coughs from lamp smoke.',
      'Papa Yaw: her father, who repairs bicycles.',
      'Mr Dankwa: the science teacher, patient and careful about safety.',
    ],
    music: 'Warm guitar with a light bicycle-bell tick (placeholder)',
    pages: [
      pg(
        '🕯️',
        'Akosua studied every evening by a small kerosene lamp. The smoke made her eyes sting, and her little brother Kojo coughed in the corner. The electric power came only some nights, and it went off without warning. The BECE was only a few months away, and she needed to read. “If only I had a light that did not smoke and did not depend on the power cuts,” she sighed. She did not know yet that the answer was leaning against her father’s workshop wall.',
        'A girl studying by a smoky kerosene lamp while a small boy coughs beside her.'
      ),
      pg(
        '🚲',
        'Her father, Papa Yaw, repaired bicycles. One day, a customer left an old bicycle with a small lamp fixed to the front. A little round dynamo touched the tyre. When the wheel turned, the lamp glowed. When it stopped, the light went out. Akosua spun the wheel with her hand and watched it flicker. “Papa, why does the light shine only while the wheel turns?” Papa Yaw scratched his head. “I only know that it does. You should find out why.”',
        'A girl spinning a bicycle wheel to make a small lamp glow.'
      ),
      pg(
        '📚',
        'Next day Akosua asked Mr Dankwa, the science teacher. “Moving a magnet near a coil of wire pushes a small electric current through the wire,” he explained. “The dynamo has a magnet inside. The turning wheel spins it. That is why the light needs movement.” He lent her a science book from the school cupboard. Then he added a warning. “Work only with this small, low-power kind of electricity. Never touch the wires of the mains power, and never open sockets. Ask me first.”',
        'A teacher drawing a magnet and coil on the board while a girl listens.'
      ),
      pg(
        '🔧',
        'Akosua read the book twice. Then she made a plan. She would lift the back wheel of an old bicycle on a stand, so that someone could pedal without going anywhere. The dynamo would touch the tyre and light a lamp. On the first try, the lamp glowed weakly and flickered. The dynamo slipped on the smooth, dusty tyre. Akosua felt like giving up. “It does not work,” she said. But then she remembered how many times she had to practise a hard sum before it worked.',
        'A girl frowning at a dim flickering lamp on a bicycle held up on a stand.'
      ),
      pg(
        '🧩',
        'She wrote down what went wrong, as she did with maths mistakes. The dynamo slipped. The bulb was old. Papa Yaw helped her clean the tyre and press the dynamo firmly against its side. Mr Dankwa gave her a small LED bulb from a broken torch, which needs less power than an old bulb. The second try was much brighter! But there was still a problem. When Akosua stopped pedalling, the light went out at once. She could not read and pedal at the same time.',
        'A father and daughter adjusting a small dynamo against a bicycle tyre.'
      ),
      pg(
        '⏳',
        'Akosua asked Mr Dankwa how to keep the light on after she stopped. “You would need to store the electricity in a battery,” he said, “with the right parts so that it charges safely. That is not a job for today, and not without an expert. For now, build what you can do well.” Akosua smiled. Kojo, who was eight, said, “I can pedal!” So they took turns: Kojo pedalled for fifteen minutes while Akosua studied, then they swapped. The smoky lamp stayed in the cupboard.',
        'A small boy pedalling the raised bicycle while his sister reads under the lamp.'
      ),
      pg(
        '👥',
        'Soon the neighbours noticed the steady white light coming from Papa Yaw’s yard. Four of Akosua’s classmates came to study there each evening, and everyone took a turn to pedal. They quizzed each other, and Kojo kept count of the minutes. It cost nothing, made no smoke, and did not stop when the power went off. A neighbour whose child had a cough asked, “Could you show me how to make one?” Akosua said she would help, and that the first step was to learn, not to rush.',
        'Several students studying around a lamp in a yard while one pedals.'
      ),
      pg(
        '🏫',
        'Mr Dankwa invited Akosua to show her lamp at the school science fair. A visiting judge asked, “What would you improve?” Akosua answered honestly. “I do not yet know how to store the electricity safely. I need an expert to teach me.” The judge smiled. “Knowing what you do not know is how learning grows. Come to our workshop in the holidays.” Akosua walked home proud, not because the lamp was perfect, but because it was hers, and because it had taught her so much.',
        'A girl showing her lamp to a judge at a school science fair.'
      ),
      pg(
        '📝',
        'That night Akosua wrote three lines in her notebook. First: Ask why something works, then learn the answer from a book or a teacher. Second: Build a small version with what you have, and write down what goes wrong. Third: Improve one thing at a time, and ask experts when safety is involved. Try it! Think of one small problem in your home or school. What could you learn about it this week? What could you build or change with what is around you? Whom would you ask for help?',
        'A girl writing three lines in a notebook beside a glowing lamp.'
      ),
    ],
    activities: [
      {
        id: 'ya-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why does the dynamo lamp need the wheel to be moving?',
        options: [
          'The spinning wheel turns a magnet inside the dynamo, which makes the electricity',
          'The wheel heats the bulb',
          'The lamp needs wind',
        ],
        correctIndex: 0,
      },
      {
        id: 'ya-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Akosua do after her first attempt failed?',
        options: [
          'She wrote down what went wrong and fixed one thing at a time',
          'She threw the bicycle away',
          'She asked someone else to do it',
        ],
        correctIndex: 0,
      },
      {
        id: 'ya-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why did Mr Dankwa say not to work on the battery yet?',
        options: [
          'It needs the right parts and an expert to be safe',
          'Batteries do not exist',
          'It was too cheap',
        ],
        correctIndex: 0,
      },
      {
        id: 'ya-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A pupil wants a cleaner way to cook at home. Using the story, what is a good first step?',
        options: [
          'Build it quickly without help',
          'Learn how it works, try a small safe version, and ask an expert',
          'Wait for someone else',
        ],
        correctIndex: 1,
      },
      {
        id: 'ya-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Akosua wonders why the lamp needs a turning wheel',
          'Mr Dankwa explains the magnet and coil',
          'The first try is dim and flickers',
          'A cleaner tyre and an LED bulb make it brighter',
          'Friends take turns pedalling and studying',
        ],
      },
      {
        id: 'ya-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'dynamo',
        definition: 'A machine that makes electricity when it is turned.',
        distractors: [
          'A kind of bicycle bell',
          'A strong battery',
        ],
      },
    ],
    glossary: [
      {
        word: 'kerosene',
        definition: 'A fuel oil burned in some lamps.',
        pages: [1],
      },
      {
        word: 'dynamo',
        definition: 'A machine that makes electricity when it is turned.',
        pages: [2, 3],
      },
      {
        word: 'current',
        definition: 'A flow of electricity.',
        pages: [3],
      },
      {
        word: 'mains',
        definition: 'The main electricity supply to buildings, which is dangerous.',
        pages: [3],
      },
      {
        word: 'flicker',
        definition: 'To shine unsteadily, going on and off quickly.',
        pages: [2],
      },
      {
        word: 'expert',
        definition: 'A person with special knowledge of a subject.',
        pages: [6, 8],
      },
    ],
    culturalNotes: [
      'Big idea: Learn how a thing works, build a small version with what you have, and improve it step by step, asking experts when safety matters. The idea is explored further in “The Boy Who Harnessed the Wind” by William Kamkwamba and Bryan Mealer (2009). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is invented, with a made-up Ghanaian character. It uses only low-power electricity and says clearly that mains electricity and unsupervised batteries are not for children.',
    ],
    reviewQuestions: [
      'Check with a science teacher that the explanation of the dynamo and the LED is simple and correct.',
      'Check that no unsafe electrical work is encouraged. The story warns about mains electricity and storing power in a battery.',
      'Check the sums: 15 × 4 = 60 and 8 × 6 = 48.',
    ],
    guide: {
      overview:
        'A story about learning how something works, building a small safe version from what you have, and improving it.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain how a dynamo makes a light work.',
        'Name the three steps of learning, building small, and improving.',
        'Say why safety and asking experts matter.',
      ],
      subjects: [
        ['Science (NaCCA CCP: energy and electricity; codes to verify)', 'Magnets, motion, and electricity'],
        ['Career Technology (NaCCA CCP: making and design; codes to verify)', 'Building from simple parts'],
      ],
      before: ['Ask: what problem at home or school would you like to fix?'],
      during: ['Stop after Page 4. Ask: what should Akosua do now?'],
      after: ['Learners choose a small problem and write three steps: learn, build small, improve.'],
      discussion: ['Why did Akosua write down what went wrong?'],
      reflection: ['What do you want to learn how to make or fix?'],
      maths: [
        {
          task: 'Kojo pedals for 15 minutes, then Akosua studies, and they swap each time. How many minutes does Akosua study if they do this four times in a row?',
          answer: 'Kojo pedals for 15 minutes each of four times while she studies, so 15 × 4 = 60 minutes.',
        },
        {
          task: 'Kerosene costs GH¢8 a week. How much is that over 6 weeks?',
          answer: '8 × 6 = GH¢48.',
        },
      ],
      support: ['Give a three-step card: ask why, build small, improve one thing.'],
      stretch: ['Draw a diagram of the dynamo and label the magnet, coil, and wheel.'],
      localise: ['Who in your community mends or makes things, and what could they teach you?'],
      factCheck: ['The story is fiction. A bicycle dynamo makes electricity by moving a magnet near a coil, and an LED uses less power than an old filament bulb. A science teacher should confirm these. Storing electricity safely needs proper parts and an expert, as the story says. The book’s title and authors are given from general knowledge, and the real story of the book’s author is not retold.'],
    },
  }),

  // 2
  mk({
    key: 'the-stream-that-came-back',
    title: 'The Stream That Came Back',
    summary:
      'Kofi notices that the stream near his school dries up earlier every year. With a teacher, an elder, and a few friends, he starts planting local trees on the bank. A story about how one person’s small, patient action can grow into something the whole community shares.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'environment', 'community', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Quiet, then hopeful',
    palette: ['#15803d', '#0369a1'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Kofi: a JHS 2 boy who walks to school beside the stream.',
      'Nana Yeboah: the oldest man in the village, who remembers the stream when it was full.',
      'Mrs Appiah: Kofi’s class teacher.',
      'Adjoa: Kofi’s friend, who laughed at first and then helped.',
      'Mr Quarshie: a district agriculture officer.',
    ],
    music: 'Gentle flowing water with a soft flute (placeholder)',
    pages: [
      pg(
        '🏞️',
        'Every morning Kofi walked to school beside a small stream. When he was little, it ran all year. Women washed clothes there, and children caught tiny fish. But this year the stream dried up in February, much earlier than before. Now the women walked a long way to fetch water from a borehole, and Kofi’s mother came home tired. He stood at the dry bed for a long time and wondered, “Why is this happening? And can anyone do anything about it?”',
        'A boy standing beside a dry stream bed with cracked mud.'
      ),
      pg(
        '🌳',
        'Kofi looked closely at the banks. They were bare and crumbling. In the rains, red soil washed into the water in thick streams. He asked Nana Yeboah, the oldest man in the village. “When I was young, big trees stood all along this bank,” said Nana. “Their roots held the soil. Their shade kept the water cool. Then the trees were cut for firewood and for farms, one by one. Nobody planned to hurt the stream. It happened slowly, tree by tree.”',
        'An old man pointing to the bare bank while a boy listens.'
      ),
      pg(
        '🧑🏫',
        'Kofi told Mrs Appiah, who invited Mr Quarshie, the district agriculture officer, to speak to the class. “Trees with strong roots along a stream bank can hold the soil, give shade, and help keep water in the ground,” he said. “It does not work like magic, and rain matters too. But it helps. Use trees that grow naturally here, and ask the landowners and the chief for permission before you plant.” Kofi wrote it all in his notebook. He decided to begin with twenty seedlings.',
        'An agriculture officer showing tree seedlings to a class.'
      ),
      pg(
        '😅',
        'In class, some pupils laughed. “Twenty trees will not bring back a stream,” said Adjoa. Kofi felt embarrassed, but he answered, “Maybe not. But if we do nothing, the bank will still crumble.” Four friends agreed to help, and even Adjoa came along, saying, “I will just watch.” They filled old sachets with soil, planted seeds from trees growing nearby, and watered them every day behind the school. The tiny seedlings grew slowly, and the children checked them each morning before class. Nana Yeboah visited and told the children the names of the trees in Twi.',
        'A small group of children filling soil bags and planting seeds behind a school.'
      ),
      pg(
        '🌧️',
        'When the rains came, the pupils asked the chief for permission. He agreed and sent two men to help. The children planted the seedlings along the bank. But within a month, hungry goats ate several of them. In the dry spell that followed, ten more withered. Kofi stared at the small brown stems and felt his hopes sink. “Maybe the others were right,” he said quietly. Mrs Appiah put a hand on his shoulder. “Learning why it failed is part of the work,” she said.',
        'A boy looking sadly at wilted seedlings along a bank while goats graze nearby.'
      ),
      pg(
        '🔁',
        'The children did not give up. They built small fences from thorny branches to keep out goats. They kept a few seedlings in the nursery until the next rains. They asked the farmers beside the stream to leave a narrow strip of land unfarmed along the bank. Some agreed. Then the women who fetched water joined in. Each family chose one tree to look after. At the next planting, Nana Yeboah blessed the seedlings and told the story of the stream, and more than sixty people came.',
        'Villagers and children planting seedlings behind small thorn fences.'
      ),
      pg(
        '📏',
        'After two years, the trees were as tall as Kofi’s waist. The bank no longer crumbled in the rain. The water in the stream stayed a little longer each season, although everyone knew that rainfall changed things too. To be sure, Kofi tied a stick in the stream bed and marked the water level each week in his notebook. “We must not just hope,” he said. “We must measure.” The numbers showed that the stream held water for three more weeks than the year before it was planted.',
        'A boy marking a stick in a stream while writing in a notebook.'
      ),
      pg(
        '🤝',
        'A neighbouring village heard about the trees and sent two women to see. The school nursery gave them a hundred seedlings. Mr Quarshie visited again and was pleased. “You did not start with a big plan or much money,” he said. “You started with twenty seedlings, asked permission, and kept going when things failed. Now you have a whole village behind you, and another village too.” Adjoa grinned. “I said I would only watch,” she laughed. “Look at me now.”',
        'Villagers handing over seedlings to visitors from another village.'
      ),
      pg(
        '📝',
        'Kofi wrote in his notebook. “One: Notice a problem and ask why it happens. Two: Start small, and ask for permission and advice. Three: When things fail, find out why and try again. Four: Invite others, because change that people share lasts longer. Five: Measure, so you know what is working.” Try it! What small problem do you notice near your school or home? What small first step could you take this month? Whom would you ask to join you?',
        'A boy writing five lines in a notebook beside the green stream bank.'
      ),
    ],
    activities: [
      {
        id: 'yb-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Mr Quarshie say about the trees?',
        options: [
          'They can help hold soil and keep water in the ground, but rain matters too',
          'They will bring rain at once',
          'They are useless',
        ],
        correctIndex: 0,
      },
      {
        id: 'yb-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What happened to the first seedlings?',
        options: [
          'Goats ate some and a dry spell killed ten more',
          'All of them lived',
          'Nobody planted any',
        ],
        correctIndex: 0,
      },
      {
        id: 'yb-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'Why did Kofi mark a stick in the stream?',
        options: [
          'To measure the water instead of just hoping',
          'To catch fish',
          'To scare birds',
        ],
        correctIndex: 0,
      },
      {
        id: 'yb-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: You see rubbish piling up near your school. Using the story, what is a good first step?',
        options: [
          'Wait for someone else',
          'Start small, ask for permission and advice, and invite others',
          'Burn it',
        ],
        correctIndex: 1,
      },
      {
        id: 'yb-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Kofi sees the stream dry up early',
          'Nana Yeboah explains what happened to the trees',
          'The first seedlings are eaten or wither',
          'The children fence the trees and the village joins',
          'Another village asks for seedlings',
        ],
      },
      {
        id: 'yb-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'permission',
        definition: 'Agreement that you may do something.',
        distractors: [
          'A kind of tree',
          'A type of soil',
        ],
      },
    ],
    glossary: [
      {
        word: 'borehole',
        definition: 'A deep, narrow well drilled into the ground.',
        pages: [1],
      },
      {
        word: 'crumbling',
        definition: 'Breaking into small pieces and falling away.',
        pages: [2],
      },
      {
        word: 'permission',
        definition: 'Agreement that you may do something.',
        pages: [3, 5],
      },
      {
        word: 'seedlings',
        definition: 'Very young plants grown from seeds.',
        pages: [3, 4],
      },
      {
        word: 'withered',
        definition: 'Became dry and weak.',
        pages: [5],
      },
      {
        word: 'measure',
        definition: 'To find the size or amount of something.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: One person’s small, patient action, joined by others, can grow into lasting change for a whole community. The idea is explored further in “Unbowed” by Wangari Maathai (2006). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is invented, with made-up characters and a made-up village. It does not retell the author’s life or campaign. It says that tree planting helps but is not magic and that permission from landowners and chiefs is needed.',
    ],
    reviewQuestions: [
      'Check with an agriculture or forestry officer that planting local trees on a stream bank is sound advice in your region.',
      'Check that the story respects chiefs, landowners, and elders.',
      'Check the sums: 20 - 10 - 6 = 4.',
    ],
    guide: {
      overview:
        'A story about one boy’s small, patient action to restore a stream bank, and how a community joined in.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain how trees help a stream bank.',
        'Say why Kofi asked for permission and measured results.',
        'Plan a small first step for a local problem.',
      ],
      subjects: [
        ['Science (NaCCA CCP: environment and conservation; codes to verify)', 'Trees, soil, and water'],
        ['Social Studies (NaCCA CCP: civic responsibility; codes to verify)', 'Working with the community'],
      ],
      before: ['Ask: is there a stream, drain, or open space near you that has changed?'],
      during: ['Stop after Page 5. Ask: should Kofi try again? Why?'],
      after: ['Learners choose a local problem and list a first step, who to ask, and how to measure.'],
      discussion: ['Why did Kofi need the chief, the landowners, and the elders?'],
      reflection: ['What small action could you start and keep going?'],
      maths: [
        {
          task: 'Kofi planted 20 seedlings and 10 withered, then 6 more were eaten by goats. How many seedlings were left?',
          answer: '20 - 10 - 6 = 4.',
        },
        {
          task: 'The stream held water for 3 more weeks than before. If a year has 52 weeks, what fraction of the year is 3 weeks, in simplest form? (Leave as a fraction.)',
          answer: '3/52 (it cannot be simplified).',
        },
      ],
      support: ['Give a planning card: problem, first step, who to ask, how to measure.'],
      stretch: ['Find out which local trees are good for riverbanks, and why.'],
      localise: ['Which trees grow naturally in your area, and what do elders say about them?'],
      factCheck: ['The story is fiction. The advice (local trees help hold bank soil and give shade; ask permission; protect seedlings) should be confirmed by an agriculture or forestry officer. The book’s title and author are given from general knowledge, and the author’s real life and work are not retold.'],
    },
  }),

  // 3
  mk({
    key: 'the-captains-armband',
    title: 'The Captain’s Armband',
    summary:
      'Nii loses the captain’s armband because a teammate lies about him. When the truth comes out, Nii can punish him or lead with fairness and patience. A story about dignity, forgiveness, and fixing what went wrong.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'forgiveness', 'leadership', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Heated, then calm',
    palette: ['#b91c1c', '#1d4ed8'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Nii: a JHS 3 boy, captain of the school football team.',
      'Yaw: a talented player who wants to be captain.',
      'Coach Mensah: the games teacher, fair but busy.',
      'Mama Dede: Nii’s mother, who had been ill that month.',
    ],
    music: 'Steady drumbeat easing into a calm flute (placeholder)',
    pages: [
      pg(
        '⚽',
        'Nii loved football, and he loved wearing the captain’s armband. He was not the best player, but he arrived first at every practice, helped carry the balls, and encouraged the younger boys. Yaw was the most skilful player in school, and he secretly wanted the armband for himself. “Captains should be the best players,” he told his friends. Nii did not know it, but Yaw had begun to plan something unkind, and he was only waiting for the right moment to act on it.',
        'A boy in a football jersey with a captain’s armband beside a goalpost.'
      ),
      pg(
        '🤥',
        'The week before the big match, Nii missed two practices because his mother was ill and he stayed home to look after the little ones. He told Coach Mensah quietly, but the Coach was busy and forgot. Yaw was standing nearby and saw his chance. “Coach, Nii has been selling at the market instead of coming to practice,” he said. It was a lie. Coach Mensah frowned. “A captain must set an example,” he said, and gave the armband to Yaw.',
        'A boy handing a captain’s armband to another while a teacher looks stern.'
      ),
      pg(
        '🔥',
        'Nii was stunned. His face burned with shame and anger. All night he thought of ways to get even. He could trip Yaw in practice. He could tell the team about some of Yaw’s own mistakes. Mama Dede, still weak but listening, asked what was wrong. When he told her, she was quiet for a while. “You have every right to be angry,” she said. “But decide what you want, not what your anger wants. Do you want revenge, or do you want the truth to come out?”',
        'A boy sitting on a bed with his mother beside him at night.'
      ),
      pg(
        '🗣️',
        'Nii thought it over. In the morning, he went to Coach Mensah, politely, with no shouting. “Sir, I missed two practices because my mother was ill. I told you, but perhaps you forgot. I did not go to the market. You can ask my neighbours.” Coach Mensah listened with a serious face. “Thank you for telling me calmly,” he said. “I will find out. It may take a few days. Until then, Yaw will keep the armband.” Nii nodded and kept his dignity, though it was hard.',
        'A boy speaking politely to a teacher outside a classroom.'
      ),
      pg(
        '⏳',
        'For a week, Nii went to every practice, as before. He did not sulk, and he did not complain to the team. He ran just as hard, passed the ball to Yaw when Yaw was open, and encouraged the little boys. Some teammates noticed. “Why are you so calm?” asked one. “Because I told the truth,” said Nii, “and I can wait for it to be checked.” Waiting was the hardest part. But he found that he slept better than he had the night he planned revenge.',
        'A boy training hard with teammates while another boy watches.'
      ),
      pg(
        '🔎',
        'Coach Mensah spoke to neighbours and to Mama Dede. He learned the truth. He called both boys to his office. Yaw’s face went grey. “You lied,” said the Coach. “That is serious. A team cannot work if its members cannot trust each other.” He decided that Yaw would miss the next match, apologise to the team, and give back the armband. Then he turned to Nii. “I am sorry that I did not check first,” he said. “The armband is yours again.”',
        'A teacher speaking to two boys in an office, one looking down.'
      ),
      pg(
        '🤝',
        'Nii took the armband, but he did not gloat. In the corridor, Yaw looked at the floor. “I am sorry,” he said, but Nii could see that he was afraid. Nii thought about it. He did not pretend that nothing had happened, because it had hurt him. But he also did not want to spend his last year at school as Yaw’s enemy. “I hear you,” said Nii. “We have a big match coming. Come back and play, and let us see how you do.” He did not say all was forgotten. He said they could begin again.',
        'Two boys talking quietly in a school corridor.'
      ),
      pg(
        '🏆',
        'Yaw missed one match, as Coach had decided. Then he came back, worked hard in practice, and apologised to the whole team. At the next match, Nii asked Yaw to take the penalty kicks, because he was the best at them, and Yaw scored two. The team won. Afterwards, Nii proposed something to Coach Mensah. “Sir, when there is a complaint about a player, can we hear from both sides before deciding?” Coach agreed. They wrote the new rule on the notice board so that the next captain would not face what Nii had faced.',
        'A football team celebrating while a boy points to a rule on a notice board.'
      ),
      pg(
        '📝',
        'That evening, Nii wrote in his notebook. “One: Anger is real, but I choose what to do with it. Two: Tell the truth calmly and give people time to check. Three: To forgive does not mean pretending it did not happen. It means choosing not to carry the hurt forever, and still fixing what went wrong. Four: Lead for everyone, even those who treated me badly.” Try it! Think of a time someone treated you unfairly. What would calm, fair action look like? Is there something that needs fixing as well as forgiving?',
        'A boy writing in a notebook with his armband on the table.'
      ),
    ],
    activities: [
      {
        id: 'yc-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Mama Dede ask Nii to decide?',
        options: [
          'What he wanted, rather than what his anger wanted',
          'Whether to fight Yaw',
          'Whether to leave school',
        ],
        correctIndex: 0,
      },
      {
        id: 'yc-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'How did Nii behave while waiting for the truth to be checked?',
        options: [
          'He kept practising calmly and did not sulk or complain',
          'He stopped going to practice',
          'He told lies about Yaw',
        ],
        correctIndex: 0,
      },
      {
        id: 'yc-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Nii mean by “let us see how you do”?',
        options: [
          'He gave Yaw a chance to begin again without pretending nothing had happened',
          'He forgot everything',
          'He wanted revenge later',
        ],
        correctIndex: 0,
      },
      {
        id: 'yc-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A classmate spreads a rumour about you. Using the story, what is a good response?',
        options: [
          'Spread a rumour back',
          'Tell the truth calmly, wait for it to be checked, and fix what went wrong',
          'Say nothing for ever',
        ],
        correctIndex: 1,
      },
      {
        id: 'yc-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Yaw tells a lie and Nii loses the armband',
          'Nii talks to his mother and decides what he wants',
          'Nii tells Coach the truth calmly and waits',
          'The truth is found and the armband is returned',
          'Nii and Coach make a rule to hear both sides',
        ],
      },
      {
        id: 'yc-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'dignity',
        definition: 'A calm, respectful way of behaving that shows self-respect.',
        distractors: [
          'A type of football',
          'A loud shout',
        ],
      },
    ],
    glossary: [
      {
        word: 'skilful',
        definition: 'Very good at doing something.',
        pages: [1],
      },
      {
        word: 'stunned',
        definition: 'So shocked that you cannot speak or move.',
        pages: [3],
      },
      {
        word: 'dignity',
        definition: 'A calm, respectful way of behaving that shows self-respect.',
        pages: [4],
      },
      {
        word: 'gloat',
        definition: 'To show pleasure that someone else has failed.',
        pages: [7],
      },
      {
        word: 'apologise',
        definition: 'To say sorry.',
        pages: [6],
      },
      {
        word: 'forgive',
        definition: 'To stop being angry at someone who has wronged you.',
        pages: [9],
      },
    ],
    culturalNotes: [
      'Big idea: Meet an injustice with patience and dignity, forgive without pretending it did not happen, and work to fix what went wrong so that others are treated fairly. The idea is explored further in “Long Walk to Freedom” by Nelson Mandela (1994). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is invented, with made-up characters at a school. It does not retell the book. It shows forgiveness as a choice that comes with fairness and consequences, and it does not suggest that people must accept being mistreated.',
    ],
    reviewQuestions: [
      'Check that the consequences for Yaw (miss one match, apologise) are fair and acceptable to your school.',
      'Check that the story shows forgiveness as separate from pretending nothing happened.',
      'Check the sums: 2/3 and 3 - 1 = 2.',
    ],
    guide: {
      overview:
        'A story about handling a lie with patience and dignity, forgiving, and fixing the system.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain the difference between forgiving and forgetting.',
        'Say why Nii asked for a rule to hear both sides.',
        'Plan a calm response to an unfair situation.',
      ],
      subjects: [
        ['Social Studies (NaCCA CCP: leadership and fairness; codes to verify)', 'Leading with fairness'],
        ['Physical Education (NaCCA CCP: teamwork; codes to verify)', 'Sportsmanship'],
      ],
      before: ['Ask: what makes a good captain or leader?'],
      during: ['Stop after Page 3. Ask: what should Nii do with his anger?'],
      after: ['Learners role-play a calm conversation with a teacher about an unfair situation.'],
      discussion: ['Is forgiving the same as forgetting? Why or why not?'],
      reflection: ['When have you waited for the truth to come out? What helped?'],
      maths: [
        {
          task: 'Yaw scored 2 penalties out of 3 attempts. What fraction did he score?',
          answer: '2/3.',
        },
        {
          task: 'The team won 3-1. How many more goals did they score than their opponents?',
          answer: '3 - 1 = 2 goals.',
        },
      ],
      support: ['Give sentence starters for speaking calmly.'],
      stretch: ['Write a fair rule for how a school should handle complaints.'],
      localise: ['How do elders in your community settle a quarrel fairly?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge, and the author’s real life is not retold. Teachers should check the school’s own rules on discipline.'],
    },
  }),

  // 4
  mk({
    key: 'what-the-numbers-said',
    title: 'What the Numbers Said',
    summary:
      'A class guesses whether life in their district is getting better or worse, and then checks the numbers. A story about how the loud news can fool us and how to look for the facts.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'data', 'critical-thinking', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Lively and curious',
    palette: ['#0d9488', '#7c3aed'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Madam Efia: the JHS class teacher, who loves a good question.',
      'Selorm: a thoughtful boy who asks “compared with what?”',
      'Baba: a pupil who is sure that everything is getting worse.',
      'Abigail: a girl who likes tables and charts.',
    ],
    music: 'Light marimba with a quiet clock tick (placeholder)',
    pages: [
      pg(
        '❓',
        'Madam Efia began the lesson with a quiz. “In our district, are children today more likely, or less likely, to be fully vaccinated than children twenty years ago? Raise your hand for more, less, or the same.” Almost every hand went up for less. Baba said, “Everything is getting worse, Madam. Look at the news!” Madam Efia smiled. “Thank you for being honest. Hold on to your guess, and write it in your book. We will check it together later in the lesson.”',
        'A teacher at the board and pupils raising their hands.'
      ),
      pg(
        '📰',
        '“Why did so many of you say ‘less’?” asked Madam Efia. Abigail said, “Because we hear about sickness and floods and accidents all the time.” Madam Efia wrote on the board: News tells us what went wrong today. “It is not wrong to report bad events,” she said. “They are important. But sudden bad events are loud, and slow good changes are quiet. If we only listen to the loud ones, our picture of the world gets crooked, and then we make poor choices because of it.”',
        'A teacher writing on the board while pupils talk.'
      ),
      pg(
        '📊',
        'She handed out a table from the district health office. Madam Efia told the class that the numbers in their exercise were made up for the lesson, but the idea was real. In the first year of the table, fifty-five out of every hundred children were fully vaccinated. Twenty years later, the number was eighty-eight out of every hundred. The class went quiet. Nobody had expected that answer. Baba checked the table twice. “That is much better,” he said slowly. “I was wrong.”',
        'Pupils looking at a table of numbers with surprised faces.'
      ),
      pg(
        '⚖️',
        'Selorm raised his hand. “Madam, does that mean everything is fine now?” “Good question,” said Madam Efia. “No. Twelve out of every hundred children are still not fully vaccinated. That is twelve too many. Things can be better than before and still not good enough. Both are true at once. If we say only ‘it is terrible’, we miss the progress and we cannot learn what worked. If we say only ‘it is fine’, we stop trying. We must hold both ideas.”',
        'A boy raising his hand and a teacher answering.'
      ),
      pg(
        '🔍',
        'Madam Efia gave groups a task. “Find out from your family or elders how something has changed in our community over a long time. Ask about the walk to the nearest clinic, how many children finish primary school, or how long it takes to get water in the dry season. Write the numbers down. Ask too, ‘Compared with what?’” Selorm’s group chose the walk to the clinic. Abigail’s group chose water. Baba’s group, still a little embarrassed, chose how many of the elders’ own children had finished school.',
        'Groups of pupils sitting with notebooks and pens, planning questions.'
      ),
      pg(
        '📝',
        'A week later, the groups reported. The walk to the clinic used to take two hours on foot, but now it took forty minutes, because of a new road and a clinic closer to the village. Baba’s group found that many of the elders’ children had left school early, but most of their grandchildren were finishing JHS. Abigail’s group, however, found that water in the dry season was still hard to get. Some things were better, one was still difficult, and each group had the numbers to prove it.',
        'Pupils presenting results from notebooks to the class.'
      ),
      pg(
        '💬',
        'Baba stood up. “At the start I said everything was getting worse,” he said. “I did not check. I only remembered the bad news.” Selorm said, “It is easy to do. I do it too.” Madam Efia nodded. “That is why we ask, ‘Compared with what?’ A number on its own can scare us or comfort us. A number compared with the past, or with another place, tells us more. A good thinker is not an optimist or a pessimist. A good thinker checks.”',
        'A boy standing and speaking to the class while the teacher nods.'
      ),
      pg(
        '🧰',
        'Madam Efia wrote three habits on the board. First: Ask, ‘Compared with what?’ Second: Look for slow trends as well as sudden events. Third: Check the source and the date before you share a number. “If a message on your phone says something shocking, do not pass it on at once,” she added. “Check who said it, when, and where the numbers came from.” Abigail copied the three habits neatly into her book and drew a box around them. Selorm said he would stick them on the wall at home so that his whole family could see them.',
        'A teacher pointing to three habits written on the board.'
      ),
      pg(
        '📝',
        'Selorm wrote in his notebook that night. “Loud news can make the world look worse than it is. Slow changes are quiet. Both good and bad can be true at once. Before I believe a number, ask: compared with what, who says so, and how recent?” Try it! Think of a claim you have heard recently, perhaps about your school, your town, or your country. How could you check it? What numbers would you want to see? What would you say if the facts were better, or worse, than you expected?',
        'A boy writing three questions in a notebook beside a window.'
      ),
    ],
    activities: [
      {
        id: 'yd-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did the pupils guess “less” on the vaccination quiz?',
        options: [
          'Because bad news is loud and good slow changes are quiet',
          'Because the numbers were wrong',
          'Because they were not listening',
        ],
        correctIndex: 0,
      },
      {
        id: 'yd-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Madam Efia mean by “Both are true at once”?',
        options: [
          'Things can be better than before and still not good enough',
          'Everything is perfect',
          'Nothing has changed',
        ],
        correctIndex: 0,
      },
      {
        id: 'yd-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What question helps make a number useful?',
        options: [
          'Compared with what?',
          'How loud is it?',
          'Who is tallest?',
        ],
        correctIndex: 0,
      },
      {
        id: 'yd-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: A message says “Everything in our town is getting worse.” Using the story, what should you do?',
        options: [
          'Share it at once',
          'Ask for the numbers, compare with the past, and check the source and date',
          'Ignore all news',
        ],
        correctIndex: 1,
      },
      {
        id: 'yd-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'The class guesses that life is getting worse',
          'The teacher shows the table of numbers',
          'The class learns that things can be better but not good enough',
          'Groups collect their own numbers from elders',
          'The class writes three habits for checking claims',
        ],
      },
      {
        id: 'yd-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'progress',
        definition: 'Movement towards something better.',
        distractors: [
          'A kind of table',
          'A type of exam',
        ],
      },
    ],
    glossary: [
      {
        word: 'vaccinated',
        definition: 'Given medicine that protects the body against a disease.',
        pages: [1, 3],
      },
      {
        word: 'district',
        definition: 'A part of a region with its own local government.',
        pages: [1],
      },
      {
        word: 'crooked',
        definition: 'Not straight, or not true to how things are.',
        pages: [2],
      },
      {
        word: 'progress',
        definition: 'Movement towards something better.',
        pages: [4],
      },
      {
        word: 'source',
        definition: 'The place or person that information comes from.',
        pages: [8],
      },
      {
        word: 'optimist',
        definition: 'A person who expects good things to happen.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: Loud news can make the world look worse than it is; check the numbers, ask “compared with what?”, and hold the idea that things can be better and still not good enough. The idea is explored further in “Factfulness” by Hans Rosling, with Ola Rosling and Anna Rosling Rönnlund (2018). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'All numbers in the story are made up for teaching and are not real statistics. The story does not claim that real problems do not exist.',
    ],
    reviewQuestions: [
      'Make sure learners know that the numbers (55 and 88 out of 100, the clinic walk) are invented for the lesson.',
      'Check the sums: 88 - 55 = 33; 40/120 = 1/3.',
      'If you use real data, take it from the Ghana Statistical Service or the Ghana Health Service and give the year.',
    ],
    guide: {
      overview:
        'A story about checking numbers instead of trusting loud news, and holding both progress and problems in mind.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why loud news can mislead us.',
        'Say what “compared with what?” means.',
        'Use three habits to check a claim.',
      ],
      subjects: [
        ['Mathematics (NaCCA CCP: data handling and fractions; codes to verify)', 'Reading tables and comparing numbers'],
        ['Social Studies (NaCCA CCP: critical thinking; codes to verify)', 'Checking sources'],
      ],
      before: ['Ask: do you think life is getting better, worse, or the same? Why?'],
      during: ['Stop after Page 2. Ask: what might the numbers show?'],
      after: ['Learners choose a claim and list the numbers they would need to check it.'],
      discussion: ['Why can both “better” and “not good enough” be true?'],
      reflection: ['Which news or message have you believed without checking?'],
      maths: [
        {
          task: 'In the table, vaccinated children rose from 55 out of 100 to 88 out of 100. By how many in every 100 did it rise?',
          answer: '88 - 55 = 33 more in every 100.',
        },
        {
          task: 'The walk to the clinic fell from 2 hours (120 minutes) to 40 minutes. By what fraction of the old time is the new time? (Simplify.)',
          answer: '40/120 = 1/3, so the walk is now one third of what it was.',
        },
      ],
      support: ['Give a table with two columns: before and now.'],
      stretch: ['Find a real, dated figure from an official source and compare two years.'],
      localise: ['What has changed in your community in the last twenty years, and how could you measure it?'],
      factCheck: ['The story is fiction, and every number in it is invented for the lesson. The book’s title and authors are given from general knowledge. Any real statistics must come from official sources and be dated.'],
    },
  }),

  // 5
  mk({
    key: 'reading-it-again-is-not-learning-it',
    title: 'Reading It Again Is Not Learning It',
    summary:
      'Two cousins prepare for the same test in different ways. One rereads and highlights, and the other tests herself and spaces her studying. A story about study methods that really help us remember.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['life-lessons', 'learning', 'study-skills', 'ghanaian-setting'],
    wpm: 125,
    paceWord: 'Light, then practical',
    palette: ['#2563eb', '#f59e0b'],
    voice: 'A warm storyteller, with a distinct voice for each character',
    characters: [
      'Abena: a JHS 3 girl who rereads her notes many times.',
      'Kwame: her cousin, who tests himself with cards.',
      'Mr Addo: the teacher who explains how memory works.',
      'Mama Efua: Abena’s mother, who reminds her to sleep.',
    ],
    music: 'Cheerful highlife with a soft page-turning sound (placeholder)',
    pages: [
      pg(
        '📖',
        'Abena and her cousin Kwame had a mock exam in three weeks. Abena’s plan was simple. Each evening she would read her notes again, from the first page to the last, and highlight the important parts in yellow. By the end of the first week, her notes were bright with highlights, and every page looked familiar. “I am ready,” she told Mama Efua happily. “I have read it all four times.” She felt very sure of herself and did not think about whether she could truly answer questions without the page in front of her.',
        'A girl with a highlighter and a pile of yellow-marked notes.'
      ),
      pg(
        '🃏',
        'Kwame did something different. He wrote questions on small cards: ‘What is the cause of the harmattan?’ ‘What is the formula for the area of a circle?’ He shut his book, read a question, and tried to answer from memory before turning the card over. He often got it wrong, and it felt slow and frustrating. Abena teased him. “Why are you making it so hard? Just read your notes again, like me!” Kwame shrugged. “Mr Addo told me to try it.”',
        'A boy with small question cards covering his textbook.'
      ),
      pg(
        '🧠',
        'Abena asked Mr Addo about it. “Feeling that something looks familiar is not the same as knowing it,” he said. “When you reread, the page looks easy, and your mind tricks you into thinking you can remember it. But when you close the book and pull the answer out of your own memory, even if you struggle or get it wrong, you make that memory stronger. Studies on learning suggest that testing yourself is one of the best ways to remember.” Abena frowned. “So the hard way works better?”',
        'A teacher explaining to a girl with a book in his hand.'
      ),
      pg(
        '📅',
        '“Yes, often,” said Mr Addo. “Here is a second secret. If you study one topic for three hours in one night, you may remember it for a day. But if you study it for twenty minutes on three or four different days, you will remember it far longer. Your mind needs time to forget a little, and then work to remember again.” Abena realised that she had planned to cram most topics the night before the exam. She looked at Kwame’s calendar, which showed each topic coming back a few days apart.',
        'A calendar with the same topics repeated across several days.'
      ),
      pg(
        '🔀',
        'Mr Addo had a third idea. “In maths practice, do not do ten problems of the same kind, one after another. Mix them up. Do one on fractions, one on angles, one on percentages. It feels harder, because you must decide which method fits, but that is exactly what the exam asks of you.” Kwame had been doing this already. And he did something more. He explained each topic aloud to his little sister, using simple words. “If I can teach it, I know it,” he said.',
        'A boy explaining a maths problem aloud to a younger girl.'
      ),
      pg(
        '📝',
        'Two weeks later, Mr Addo gave a surprise quiz on the topics they had studied. Abena, who had reread her notes eight times, remembered less than she expected. She stared at some questions and thought, ‘I know I have seen this.’ But she could not say the answer. Kwame answered more of them correctly, although he too made mistakes. Abena felt hot and discouraged. “I worked so hard,” she said quietly. “I did not know my method was the problem.”',
        'A girl looking worried at a quiz paper in a classroom.'
      ),
      pg(
        '💪',
        'Mr Addo spoke kindly. “You worked hard, and that matters. You simply used the effort in a less helpful way. Study skills can be learned, like any other skill. Start again this week with a better method.” Kwame offered, “I will show you my cards.” Abena swallowed her pride. “Thank you,” she said. “I teased you, and you were right.” They sat together and made a new set of cards for her weakest topics. It felt strange and slow at first, but she began to notice that she was really learning.',
        'Two cousins writing question cards together at a table.'
      ),
      pg(
        '🗓️',
        'Together they made a plan for the last week. Test yourself on each topic using cards. Come back to each topic after two days and then after five. Mix different kinds of questions in one session. Explain what you know to another person. And sleep properly, because the brain stores what you learn while you rest. Mama Efua nodded as she heard that last point. “At last,” she smiled, “a plan that lets you sleep.” Abena laughed, and for the first time in days she turned off the lamp early.',
        'A weekly plan on a page with a sleeping moon drawn at the bottom.'
      ),
      pg(
        '💡',
        'On the day of the mock exam, Abena found that she could remember more than she had expected, and she knew where she was weak. She wrote in her notebook. “One: Close the book and test yourself. Two: Come back to topics over several days. Three: Mix problem types. Four: Explain it to someone else. Five: Sleep.” Try it! Choose a topic you are learning. Write three questions about it, put your notes away, and try to answer them. Try again in two days. What do you notice?',
        'A girl writing five study tips in a notebook beside her question cards.'
      ),
    ],
    activities: [
      {
        id: 'ye-c1',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why can rereading notes be misleading?',
        options: [
          'The page looks familiar, so we think we know it when we do not',
          'It makes us forget everything',
          'It uses too much paper',
        ],
        correctIndex: 0,
      },
      {
        id: 'ye-c2',
        type: 'comprehension',
        afterPage: 5,
        question: 'What did Mr Addo say about studying a topic over several days?',
        options: [
          'Short sessions on different days help us remember longer than one long session',
          'It is a waste of time',
          'Only one night is needed',
        ],
        correctIndex: 0,
      },
      {
        id: 'ye-c3',
        type: 'comprehension',
        afterPage: 7,
        question: 'What did Abena learn from the surprise quiz?',
        options: [
          'Hard work needs a good method to give good results',
          'Quizzes are unfair',
          'She should stop studying',
        ],
        correctIndex: 0,
      },
      {
        id: 'ye-c4',
        type: 'comprehension',
        afterPage: 9,
        question: 'Apply it: You have a science test next week. Using the story, what is a good plan?',
        options: [
          'Read the notes once on the last night',
          'Test yourself with questions, space topics over days, and sleep well',
          'Highlight everything',
        ],
        correctIndex: 1,
      },
      {
        id: 'ye-s1',
        type: 'sequencing',
        prompt: 'Put the events of the story in order.',
        items: [
          'Abena rereads and highlights while Kwame tests himself',
          'Mr Addo explains why testing yourself helps',
          'The surprise quiz shows who remembered more',
          'The cousins make a plan together',
          'Abena finds she remembers more on exam day',
        ],
      },
      {
        id: 'ye-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'familiar',
        definition: 'Well known because you have seen or heard it before.',
        distractors: [
          'Very difficult',
          'Very loud',
        ],
      },
    ],
    glossary: [
      {
        word: 'highlight',
        definition: 'To mark important words with a bright pen.',
        pages: [1],
      },
      {
        word: 'familiar',
        definition: 'Well known because you have seen or heard it before.',
        pages: [3],
      },
      {
        word: 'memory',
        definition: 'The ability to remember things.',
        pages: [3],
      },
      {
        word: 'cram',
        definition: 'To study a lot of material in a short time.',
        pages: [4],
      },
      {
        word: 'discouraged',
        definition: 'Having lost confidence or hope.',
        pages: [6],
      },
      {
        word: 'method',
        definition: 'A way of doing something.',
        pages: [7],
      },
    ],
    culturalNotes: [
      'Big idea: We remember best when we test ourselves, space our study over days, mix kinds of problems, and explain ideas to others, rather than just rereading. The idea is explored further in “Make It Stick: The Science of Successful Learning” by Peter C. Brown, Henry L. Roediger III, and Mark A. McDaniel (2014). This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian JHS learners. It teaches an idea discussed in a published book but copies none of the book’s text, examples, or structure.',
      'The story is invented. It describes study methods that research on learning supports in general, but individual learners differ. The story treats effort kindly and does not mock either cousin.',
    ],
    reviewQuestions: [
      'Check with a teacher that the study methods are described correctly and simply.',
      'Check the sums: 3 × 60 = 180; 20 × 4 = 80; 2 + 5 = 7.',
      'Check that the story does not suggest that effort alone is wasted.',
    ],
    guide: {
      overview:
        'A story about study methods that really help memory: self-testing, spacing, mixing, explaining, and sleep.',
      lessonMinutes: 45,
      goals: [
        'Retell the story in order.',
        'Explain why rereading can be misleading.',
        'Name four study methods from the story.',
        'Make a one-week study plan.',
      ],
      subjects: [
        ['English Language (NaCCA CCP: study skills; codes to verify)', 'Planning and self-testing'],
        ['Mathematics (NaCCA CCP: practice and time; codes to verify)', 'Spacing and mixing practice'],
      ],
      before: ['Ask: how do you usually study? Which way works best for you?'],
      during: ['Stop after Page 3. Ask: why might the hard way work better?'],
      after: ['Learners write three self-test questions, then try them with notes closed.'],
      discussion: ['Why does something feel easy when we have only read it?'],
      reflection: ['Which study habit will you change this week?'],
      maths: [
        {
          task: 'Abena planned to study a topic for 3 hours in one night. Kwame studied it for 20 minutes on each of 4 days. How many minutes did each spend?',
          answer: 'Abena: 3 × 60 = 180 minutes. Kwame: 20 × 4 = 80 minutes. Kwame studied less in total.',
        },
        {
          task: 'Kwame returns to a topic after 2 days and then after 5 days. How many days after the first study is the second return?',
          answer: '2 + 5 = 7 days if the 5 days are counted from the first return.',
        },
      ],
      support: ['Provide a template for question cards.'],
      stretch: ['Track your quiz scores for two weeks using two different study methods.'],
      localise: ['How do students at your school study together for BECE?'],
      factCheck: ['The story is fiction. The study methods (retrieval practice, spaced study, mixed practice, explaining, and sleep) are supported by research on learning, but results differ between learners. A teacher should confirm them. The book’s title and authors are given from general knowledge.'],
    },
  }),
];

export const BATCH_59_LIFE_LESSONS = BATCH_59_STORIES;
