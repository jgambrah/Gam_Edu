import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (motif: string, text: string, alt: string, narration = 'Clear, warm storyteller voice; a short pause at the end of the page.'): Page => ({
  motif,
  text,
  alt,
  brief: `Warm hand-painted gouache scene, landscape 4:3, following the character notes exactly. ${alt} Strictly no text, letters, numbers or written labels inside the artwork; keep a calm, uncluttered composition.`,
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
  factCheck?: string[] | NonNullable<PilotStory['teacherGuide']>['factCheck'];
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
  const normalizedFactCheck = g.factCheck?.map((fc) =>
    typeof fc === 'string'
      ? { claim: s.title, explanation: fc, reference: 'NaCCA Science Curriculum for Basic 1–3 (Ghana)' }
      : fc,
  );
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
      notes: ['Read dialogue with a different voice for each character.', 'Pause for two seconds at each question activity.', 'Never rush the last page: let the ending land.'],
    },
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: ['Is the language right for the stated age band and reading level?', 'Is anything here inaccurate, stereotyped or unsafe for children?', ...s.reviewQuestions],
    pages: s.pages,
    activities: s.activities,
    glossary: s.glossary,
    teacherGuide: {
      overview: g.overview,
      lessonMinutes: g.lessonMinutes,
      learningGoals: g.goals,
      subjectLinks: g.subjects.map(([subject, link]) => ({ subject, link, status: 'approved' as const })),
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
      ...(normalizedFactCheck ? { factCheck: normalizedFactCheck } : {}),
    },
  };
};

/**
 * Batch 33: Science and life skills mapped to the NaCCA Science curriculum for Basic 1 to 3 (primary 1 to 3). Nine
 * stories: living, non-living and never-alive things (B2.1.1.2); ice, water and states of matter (B2.1.2.2, B3.1.2.3);
 * separating mixtures and impure water (B2.1.2.3, B3.1.2.2, B2.2.1.4, B3.2.1.4); the dry and wet seasons (B2.2.1.1);
 * electricity sources and safety (B3.4.2.1, B2.4.2.1); handwashing with a Veronica bucket (B1.5.1.1, B2.5.1.1); simple
 * machines (B2.4.3.2, B3.4.3.2); how food spoils and is kept (B2.5.3.2, B3.5.3.2); and preventing skin infections such
 * as ringworm (B2.5.2.1, B3.5.2.1).
 */

export const BATCH_33_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'senam-and-the-grandfathers-stool',
    title: 'Senam and Grandfather’s Stool',
    summary: 'Senam asks whether her grandfather’s wooden stool is alive. Together they test a tree, a stone and a stool and learn the difference between living, never-alive and once-alive things.',
    classIds: ['primary-1', 'primary-2'], ageMin: 6, ageMax: 8, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'educational', 'family'], themes: ['family', 'animals-and-habitats', 'school'], objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'reading-comprehension'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'village-life'], wpm: 90, paceWord: 'Curious and clear, with a pause for each test', palette: ['#15803d', '#92400e'],
    voice: 'A curious girl’s voice for Senam; a calm, kind grandfather’s voice for Nana Dapaah',
    characters: [
      'Senam: a curious seven-year-old Ghanaian girl with neat braided hair and green hair beads, wearing a yellow-and-brown check school dress and brown sandals.',
      'Nana Dapaah: her warm elderly Ghanaian grandfather with short grey hair and beard, wearing an earth-toned cotton smock over dark trousers and holding a carved wooden walking stick.',
      'Madam Boateng (class teacher): a smiling Ghanaian woman wearing a leafy-green patterned dress.',
    ],
    music: 'A gentle flute with light bird sounds (placeholder)',
    pages: [
      pg('🪑', 'Senam sat on her grandfather’s wooden stool. “Nana, is this stool alive?” she asked. Nana Dapaah smiled. “Let us find out. Living things do special things. Let us look at a tree, a stone and the stool.”', 'In a sunlit Ghanaian compound courtyard, Senam sits on a carved wooden stool beside smiling Nana Dapaah near a leafy mango tree and a smooth grey stone.'),
      pg('🌳', 'First, they looked at the mango tree. It grew taller each year. It needed water and air. Its leaves moved towards the light. It also made seeds to grow new trees. “The tree is alive,” said Senam.', 'Senam touching the bark of a tall leafy mango tree hung with ripe mangoes while Nana Dapaah stands beside her pointing gently up at the sunlit leaves.'),
      pg('🪨', 'Next, they looked at a stone. It did not grow. It did not need food, water or air. It did not make babies. “The stone is not alive,” said Senam. “It was never alive,” said Nana Dapaah.', 'Senam crouching in the courtyard holding a smooth grey river stone in both hands while Nana Dapaah leans on his walking stick and nods kindly.'),
      pg('🔍', 'Then Senam studied the stool. It did not grow, eat or breathe. “It is not alive now,” said Nana. “But it was once part of a tree. So we say the stool is made from something that was once alive.”', 'Nana Dapaah kneeling beside the traditional carved wooden stool and pointing to the curved wood grain on its seat while Senam leans close to look.'),
      pg('📋', 'Nana Dapaah made three groups. “Living things grow, need food and air, and make young ones. Things that were never alive, like stones and sand, do none of these. Things that were once alive, like wood, paper and leather, used to be living things.”', 'On a woven courtyard mat, Nana Dapaah and Senam arrange three neat groups of objects: a potted green seedling, smooth stones, and the carved wooden stool with a woven basket.'),
      pg('🖊️', 'Senam drew the three groups on a picture chart and added three more items to each. At school the next day, she showed her teacher. “Now I can tell the difference,” she said. “And I will not break a branch from a living tree without a reason.”', 'In a bright Ghanaian classroom, Senam proudly holds up a colourful picture-only poster showing drawings of trees, stones and wooden stools to her smiling teacher.'),
    ],
    activities: [
      { id: 'sg-c1', type: 'comprehension', afterPage: 3, question: 'Why is the stone not alive?', options: ['It does not grow, eat or make young ones', 'It is too heavy', 'It is too small'], correctIndex: 0 },
      { id: 'sg-c2', type: 'comprehension', afterPage: 4, question: 'What do we say about the wooden stool?', options: ['It is made from something once alive', 'It is a living thing', 'It was never alive'], correctIndex: 0 },
      { id: 'sg-s1', type: 'sequencing', prompt: 'Put the tests in order.', items: ['Look at the tree.', 'Look at the stone.', 'Look at the stool.', 'Make three groups.'] },
      { id: 'sg-voc', type: 'vocabulary', afterPage: 5, word: 'living', definition: 'Alive: able to grow, need food and air, and make young ones.', distractors: ['Very old', 'Made of wood'] },
    ],
    glossary: [
      { word: 'living', definition: 'Alive: able to grow, need food and air, and make young ones.', pages: [1, 5, 6] },
      { word: 'stone', definition: 'A hard piece of rock.', pages: [1, 3] },
      { word: 'wood', definition: 'The hard material from the trunk and branches of trees.', pages: [5] },
    ],
    culturalNotes: ['The story follows the NaCCA Science content standards on living, non-living and once-living things (B1.1.1.2, B2.1.1.2). Stools, drums and mortars are often carved from wood in Ghana, so the example is familiar.', 'The story does not ask children to judge any belief about trees or spirits; it only describes what living things do.'],
    reviewQuestions: ['Check the three groups (living, never alive, once alive) against the NaCCA Science B2 content standard B2.1.1.2.', 'Check that the explanation (grows, needs food and air, makes young ones) is right for the age.'],
    guide: {
      overview: 'A grandfather and a child sort things into living, never-alive and once-alive groups. It follows the NaCCA Science standard on living and non-living things (B2.1.1.2) and teaches the features of living things.',
      lessonMinutes: 30, goals: ['Name three things that living things do.', 'Sort objects into living, never alive and once alive.', 'Give one example for each group.'],
      subjects: [['Science (NaCCA B2.1.1.2)', 'Living, non-living and never-alive things'], ['English Language', 'Reading and describing']],
      before: ['Ask: is a plant alive? Is a stone alive? Why?'], during: ['Pause on page 3 and ask children to say the test for “alive”.'],
      after: ['Do a school walk and sort ten things into three groups.', 'Draw a chart: living, never alive, once alive.'],
      discussion: ['Why is wood called “once alive”?', 'Why do we not harm living things without a reason?'], reflection: ['What living things do you see on the way to school?'],
      support: ['Use picture cards and sort them in pairs.'], stretch: ['Think of an object made from something once alive, such as paper, leather or cloth.'],
      localise: ['Use trees, stones and wooden objects familiar to children.', 'Do not argue with children’s beliefs; focus on what living things do.'],
      factCheck: ['Confirm with NaCCA Science B1 to B3 content standards B1.1.1.2 and B2.1.1.2.'],
    },
  }),

  // 2
  mk({
    key: 'alidu-and-the-melting-ice-block',
    title: 'Alidu and the Melting Ice Block',
    summary: 'Alidu and Mariam watch a frozen bag of water melt in the sun and learn that water can be a solid, a liquid or a gas, and that heating and cooling change it.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'developing', difficulty: 2,
    genres: ['science', 'educational', 'friendship'], themes: ['weather', 'community', 'food'], objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'sequencing'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'market'], wpm: 90, paceWord: 'Curious and lively, with a pause at each change', palette: ['#38bdf8', '#f59e0b'],
    voice: 'A curious boy’s voice for Alidu; a bright girl’s voice for Mariam; a friendly seller’s voice for Auntie Sherifa',
    characters: [
      'Alidu: an inquisitive eight-year-old Ghanaian boy with short neat hair, wearing a sky-blue collared school shirt and khaki shorts.',
      'Mariam: his bright eight-year-old Ghanaian friend wearing a neat white headscarf with a sky-blue-and-khaki school uniform dress.',
      'Auntie Sherifa: a cheerful Ghanaian roadside vendor wearing a colourful gold-and-teal wrapper cloth and headwrap beside a blue insulated cooler box.',
      'Their science teacher: a kind Ghanaian man wearing a crisp cream short-sleeved shirt and dark trousers.',
    ],
    music: 'A light, cool tune with a drip-drip sound (placeholder)',
    pages: [
      pg('🧊', 'On a hot afternoon, Alidu and Mariam bought an ice block from Auntie Sherifa. An ice block is a frozen bag of clean drinking water. The water inside was hard and cold, like a stone. “It is ice,” said Alidu. “Ice is water in a solid form.”', 'At a sunny Ghanaian roadside table, smiling Auntie Sherifa lifts a frosty clear frozen water bag from a blue cooler box for Alidu and Mariam.'),
      pg('🍽️', 'They put the frozen bag on a plate in the sun. After ten minutes, drops of water formed around it. After half an hour, the ice had gone soft and the plate was wet. “It is melting!” said Mariam.', 'On a sunlit wooden veranda table, Alidu and Mariam lean in curiously watching a half-melted clear bag of ice sitting in a puddle of water on an enamel plate.'),
      pg('💧', 'Soon, most of the ice had turned into water. “The warmth from the sun and the air made the ice melt,” said their teacher. “Ice is a solid. Melted ice is a liquid.”', 'In the bright classroom, their male teacher points to the enamel plate now holding mostly clear liquid water with a tiny sliver of ice while Alidu and Mariam watch.'),
      pg('☁️', 'Their teacher told them one more thing. “When water is heated more, it turns into a gas called water vapour. We cannot see it. So water can be a solid, a liquid or a gas.”', 'On a classroom demonstration table stand three items in a neat row—a bowl of solid ice blocks, a glass of clear water, and a warm cup with faint rising mist—as the teacher gestures.'),
      pg('📦', '“A solid keeps its shape,” said the teacher. “A liquid takes the shape of its container. A gas spreads out to fill the space.” Mariam poured water from a bottle into a bowl and watched it take the bowl’s shape.', 'Mariam carefully pouring clear water from a tall narrow bottle into a wide round bowl on the desk while Alidu and the teacher smile and observe.'),
      pg('🔁', 'Alidu asked, “Can melted ice become ice again?” “Yes,” said the teacher. “If the water is cooled enough, it freezes. Heating and cooling can change water from one state to another.” The children wrote this in their notebooks.', 'Alidu and Mariam sitting at their wooden classroom desk happily sketching ice blocks and water drops in their open exercise books with pencils.'),
    ],
    activities: [
      { id: 'am-c1', type: 'comprehension', afterPage: 3, question: 'What happened to the ice in the sun?', options: ['It melted into water', 'It grew bigger', 'It turned to stone'], correctIndex: 0 },
      { id: 'am-c2', type: 'comprehension', afterPage: 5, question: 'What does a liquid do?', options: ['It takes the shape of its container', 'It keeps its own shape', 'It cannot be poured'], correctIndex: 0 },
      { id: 'am-s1', type: 'sequencing', prompt: 'Put the changes in order.', items: ['Ice is a solid.', 'Warmth melts the ice.', 'Water is a liquid.', 'More heat makes vapour, a gas.'] },
      { id: 'am-voc', type: 'vocabulary', afterPage: 3, word: 'melt', definition: 'To change from a solid to a liquid when warmed.', distractors: ['To freeze', 'To break'] },
    ],
    glossary: [
      { word: 'melting', definition: 'Changing from a solid to a liquid because of heat.', pages: [2] },
      { word: 'solid', definition: 'Something that keeps its shape, such as ice or a stone.', pages: [1, 3, 4, 5] },
      { word: 'liquid', definition: 'Something that flows and takes the shape of its container, such as water.', pages: [3, 4, 5] },
    ],
    culturalNotes: ['Frozen bags of drinking water are common on hot days in many Ghanaian towns and make a good, real example of a solid that melts.', 'The story follows the NaCCA Science standards on the physical states of substances (B1.1.2.2, B2.1.2.2, B3.1.2.3).', 'Only drink water from a clean, safe source.'],
    reviewQuestions: ['Check that the explanation of solid, liquid and gas and the state changes match the NaCCA B2 and B3 standards.', 'Check that children are not told to drink water from unknown sources.'],
    guide: {
      overview: 'A frozen water bag that melts shows that water can be a solid, a liquid or a gas, and that heating and cooling change its state. Based on NaCCA Science content standards on physical states of substances.',
      lessonMinutes: 35, goals: ['Name the three states of matter.', 'Say what happens when ice is warmed.', 'Say how a solid, a liquid and a gas behave.'],
      subjects: [['Science (NaCCA B2.1.2.2, B3.1.2.3)', 'Physical states of matter'], ['English Language', 'Sequencing and describing']],
      before: ['Hold up a bag of ice and ask: what will happen if we leave it here?'], during: ['Record the time and the changes every ten minutes.'],
      after: ['Put an ice cube on a plate in the sun and one in the shade and compare how fast they melt.', 'Draw ice, water and vapour in a line.'],
      discussion: ['Why does ice melt in the sun?', 'Where does the water go if we leave it in the sun?'], reflection: ['What other things melt when they are warmed?'],
      support: ['Use a picture chain: ice, water, vapour.'], stretch: ['Predict how long a bigger block will take to melt and test it.'],
      localise: ['Use the frozen water bags or ice blocks that children know.', 'Never use hot water with children.'],
      factCheck: ['Confirm with NaCCA Science B1 to B3 standards B1.1.2.2, B2.1.2.2 and B3.1.2.3.'],
    },
  }),

  // 3
  mk({
    key: 'esenam-and-the-muddy-water',
    title: 'Esenam and the Muddy Water',
    summary: 'Esenam and Karim pick stones out of rice and then clear muddy water with a cloth. They learn how to separate mixtures, and that clear water is not always safe to drink.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'developing', difficulty: 2,
    genres: ['science', 'educational', 'family'], themes: ['family', 'food', 'health-and-wellbeing'], objectives: ['scientific-curiosity', 'reasoning', 'problem-solving', 'responsibility'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'local-food'], wpm: 90, paceWord: 'Practical and clear, with a firm safety ending', palette: ['#a16207', '#0ea5e9'],
    voice: 'A bright girl’s voice for Esenam; a calm boy’s voice for Karim; a clear teacher voice',
    characters: [
      'Esenam: an attentive eight-year-old Ghanaian girl with braided puff buns, wearing a coral T-shirt under a patterned kitchen apron.',
      'Karim: her nine-year-old Ghanaian cousin with short curly hair, wearing a green collared polo shirt and denim shorts.',
      'Esenam’s mother: a warm Ghanaian woman in an indigo-and-amber African-print dress.',
      'Their teacher: a kind Ghanaian woman wearing a teal blouse and patterned skirt.',
    ],
    music: 'A calm tune with a sieve-shaking rhythm (placeholder)',
    pages: [
      pg('🍚', 'Esenam helped her mother to sort rice. Mixed in the rice were small stones. “Rice and stones are a mixture,” said her mother. “A mixture is two or more things together that are not joined.” Esenam picked out the stones one by one.', 'On a shaded Ghanaian home veranda, Esenam sits beside her smiling mother picking tiny dark stones out of white rice spread on a wide metal tray.'),
      pg('🧺', 'Her cousin Karim brought a sieve. When he shook the rice in it, the small grains fell through and the bigger stones stayed in the sieve. “A sieve separates things of different sizes,” said Karim.', 'Karim holding a round mesh kitchen sieve over a clean enamel bowl as white grains fall into the bowl and larger pebbles remain on top while Esenam watches.'),
      pg('🌧️', 'After the rain, they filled a jar with muddy water from a puddle. “Can we drink it?” asked Karim. “No!” said Esenam. “It is dirty. It has soil in it.” The muddy water was a mixture of a solid in a liquid.', 'On an outdoor wooden table after rain, Karim sets down a clear glass jar filled with brown muddy puddle water while Esenam shakes her head firmly.'),
      pg('⏳', 'They left the jar still for an hour. The soil sank to the bottom, and the water on top looked clearer. Then they poured it slowly through a clean cloth into a bowl. The cloth held back the soil.', 'Esenam holding a clean white cotton cloth stretched over a bowl while Karim slowly pours the settled water from the glass jar, leaving dark mud on the cloth.'),
      pg('🛑', 'The water looked clear, but their teacher said, “Do not drink it. Germs and other harmful things are too small to see, and the cloth does not remove them. This water is still not safe. Safe drinking water comes from a clean source, or it is boiled or treated by an adult.”', 'At school, their female teacher holds up a gentle stop hand beside the bowl of cloth-filtered water on the table while Esenam and Karim listen attentively.'),
      pg('📝', 'Esenam wrote two lessons: “We can separate a mixture by picking, sieving, settling or filtering. And clear water is not always safe water.” Karim wrote, “Always wash your hands after touching dirty water.”', 'Esenam and Karim sitting side by side at a wooden desk drawing simple icons of a sieve, a jar and clean hands in their notebooks.'),
    ],
    activities: [
      { id: 'em-c1', type: 'comprehension', afterPage: 2, question: 'What does a sieve separate?', options: ['Things of different sizes', 'Things of different colours', 'Things of different tastes'], correctIndex: 0 },
      { id: 'em-c2', type: 'comprehension', afterPage: 5, question: 'Why must the children not drink the cloth-filtered water?', options: ['It may still hold harmful germs', 'It is too cold', 'It is too clean'], correctIndex: 0 },
      { id: 'em-s1', type: 'sequencing', prompt: 'Put the steps in order.', items: ['Fill a jar with muddy water.', 'Let the jar stand still.', 'Pour the water slowly through a cloth.', 'Remember that it is still not safe to drink.'] },
      { id: 'em-voc', type: 'vocabulary', afterPage: 4, word: 'mixture', definition: 'Two or more things together that are not joined.', distractors: ['A kind of cloth', 'A very hot liquid'] },
    ],
    glossary: [
      { word: 'mixture', definition: 'Two or more things together that are not joined.', pages: [1, 3, 6] },
      { word: 'sieve', definition: 'A tool with small holes that lets small things pass through.', pages: [2] },
      { word: 'germs', definition: 'Tiny living things that can make us ill.', pages: [5] },
    ],
    culturalNotes: ['Sorting stones from rice and sieving are everyday kitchen tasks in many Ghanaian homes. The story follows the NaCCA Science standards on mixtures and their separation (B2.1.2.3, B3.1.2.2) and on water as a natural resource (B2.2.1.4, B3.2.1.4).', 'The story is clear that cloth filtering does not make water safe to drink. Only an adult boils or treats water for drinking.'],
    reviewQuestions: ['Check that the safety ending is clear: filtering through cloth does not make unsafe water safe.', 'Check the separation methods (picking, sieving, settling, filtering) against the NaCCA standards.'],
    guide: {
      overview: 'Two kitchen examples show how to separate mixtures, first solids from solids, then a solid from a liquid. It ends with a safety lesson on drinking water. Based on NaCCA Science standards on mixtures and on water as a resource.',
      lessonMinutes: 40, goals: ['Name four ways to separate mixtures.', 'Say what a mixture is.', 'Say why clear water may not be safe.'],
      subjects: [['Science (NaCCA B2.1.2.3, B3.1.2.2, B3.2.1.4)', 'Mixtures and water'], ['Our World Our People', 'Health and safety']],
      before: ['Ask: what is mixed together in your home or school?'], during: ['Pause on page 5 and ask: why is the clear water still not safe?'],
      after: ['Make a mixture of sand and rice and separate it with a sieve.', 'Settle and filter muddy water, then label it “not safe to drink”.'],
      discussion: ['Which method would you use for sand and water?', 'How do we make water safe to drink?'], reflection: ['Where does your drinking water come from?'],
      support: ['Use pictures of each step and put them in order.'], stretch: ['Compare filtering through a cloth, paper and a sieve.'],
      localise: ['Use the rice, beans, gari or other foods that children know.', 'Remind children never to drink water that has not been made safe by an adult.'],
      factCheck: ['Confirm with NaCCA Science B2.1.2.3, B3.1.2.2, B2.2.1.4 and B3.2.1.4.'],
    },
  }),

  // 4
  mk({
    key: 'edinam-and-wunpini-two-seasons',
    title: 'Edinam and Wunpini: Two Seasons',
    summary: 'Cousins Edinam and Wunpini swap letters about the dry and wet seasons where they live. They see what changes for plants, farms, clothes and health, and why the months differ from place to place.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'developing', difficulty: 2,
    genres: ['science', 'educational', 'family'], themes: ['weather', 'family', 'farm-and-garden'], objectives: ['scientific-curiosity', 'reasoning', 'reading-comprehension', 'summarising'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'village-life'], wpm: 90, paceWord: 'Warm, like a letter being read aloud', palette: ['#ca8a04', '#2563eb'],
    voice: 'A cheerful boy’s voice for Edinam; a lively girl’s voice for Wunpini',
    characters: [
      'Edinam: a cheerful nine-year-old Ghanaian boy near the southern coast with short neat hair, wearing a yellow-and-brown check school shirt and khaki shorts.',
      'Wunpini: his lively nine-year-old Ghanaian cousin in northern Ghana, wearing a soft sky-blue headscarf and a matching school uniform dress.',
      'Their teacher: a warm Ghanaian woman in a bright royal-blue and gold African-print dress.',
    ],
    music: 'A light drum with the sound of dry wind and then rain (placeholder)',
    pages: [
      pg('✉️', 'Edinam wrote a letter to his cousin Wunpini. “It rained all night here. Our yard is wet, and the plants are green. What is the weather like where you live?” He posted the letter and waited.', 'Edinam sitting at a desk beside an open window looking out onto lush rain-washed green banana leaves and wet courtyard earth as he writes a letter.'),
      pg('🌾', 'Wunpini wrote back. “Here it is dry. The grass is dry and yellow, and the wind is dusty. But when the rains come, farmers plant their seeds, and the fields turn green.” She sent a picture of a dry field and a green field.', 'In northern Ghana, Wunpini sits at a wooden table holding two colourful crayon drawings side by side: one golden dry savanna field and one lush green farm.'),
      pg('🔄', 'Their teacher explained, “Many parts of Ghana have two main seasons: a wet season and a dry season. The seasons come again and again every year. We call this a recurring event.”', 'In a bright classroom, the teacher points to two large wordless paintings on the board—one showing rain clouds over green crops and one showing bright sun over golden grass.'),
      pg('📅', '“But the months are not the same everywhere,” said the teacher. “In some parts of the country, the rains come in two periods. In others, they come once. So we ask local elders and farmers, and we read the weather reports.”', 'The teacher standing beside a simple unlabelled silhouette map of Ghana showing green southern forest and golden northern savanna while pupils listen.'),
      pg('👕', 'Edinam and Wunpini made a list. In the wet season, plants grow fast, clothes dry slowly and children carry umbrellas. In the dry season, the air is dry, the dust rises, and we drink more water and look after our skin.', 'Split scene: on the left Edinam walks under a bright umbrella past lush green bushes; on the right Wunpini drinks water from a cup in sunny dry breeze.'),
      pg('🌍', 'At the end of the term, the cousins swapped drawings. “Seasons come and go,” wrote Wunpini. “Each one has a job,” wrote Edinam. “The wet one feeds the plants, and the dry one lets the harvest dry.” They looked forward to their next letters.', 'Split warm scene of Edinam and Wunpini each smiling joyfully while holding up the colourful season drawing received in an envelope from their cousin.'),
    ],
    activities: [
      { id: 'tw-c1', type: 'comprehension', afterPage: 3, question: 'What are the two main seasons in many parts of Ghana?', options: ['Wet and dry', 'Hot and cold', 'Snow and sun'], correctIndex: 0 },
      { id: 'tw-c2', type: 'comprehension', afterPage: 4, question: 'Why must we ask local people about the months?', options: ['The months differ in different places', 'No one knows the weather', 'It never rains'], correctIndex: 0 },
      { id: 'tw-s1', type: 'sequencing', prompt: 'Put the farm year in order.', items: ['The dry season.', 'The first rains come.', 'Farmers plant seeds.', 'The crops grow green.'] },
      { id: 'tw-voc', type: 'vocabulary', afterPage: 3, word: 'recurring', definition: 'Happening again and again.', distractors: ['Happening once', 'Very noisy'] },
    ],
    glossary: [
      { word: 'season', definition: 'A part of the year with its own kind of weather.', pages: [3, 5] },
      { word: 'recurring', definition: 'Happening again and again.', pages: [3] },
      { word: 'harvest', definition: 'The time when the crops are gathered.', pages: [6] },
    ],
    culturalNotes: ['The story follows the NaCCA Science content standard on recurring natural events and the dry and wet seasons (B1.2.1.1, B2.2.1.1). It deliberately gives no months because the rains differ by region; several parts of the south have two rainy periods and some parts of the north have one. Teachers should use the local weather calendar.', 'Letters between cousins in the south and the north are a realistic way to show that Ghana’s weather is not the same everywhere.', 'In many parts of Ghana the dry season brings the harmattan, a dry, dusty wind from the Sahara. Children may notice dry skin, cracked lips and a hazy sky. The story does not give months for it, because the harmattan is felt at different strengths and times in different places.'],
    reviewQuestions: ['Check the seasons statement against your region and a local weather source.', 'Check that the cousins’ places are described without stereotypes about the south or the north.'],
    guide: {
      overview: 'An exchange of letters between two cousins shows recurring seasons and how they affect plants, farms and daily life, and why the months differ by region. Based on NaCCA Science standards on recurring natural events and the dry and wet seasons.',
      lessonMinutes: 35, goals: ['Name the two main seasons.', 'Say what changes in each season.', 'Say why we ask local people about the months.'],
      subjects: [['Science (NaCCA B1.2.1.1, B2.2.1.1)', 'Recurring events and the seasons'], ['English Language', 'Reading and writing letters']],
      before: ['Ask: what is the weather like today? What was it a month ago?'], during: ['Pause on page 4 and ask children what their own season is called.'],
      after: ['Make a two-column chart: wet season and dry season, with five items each.', 'Write a short letter to a cousin or friend in another town about the weather.'],
      discussion: ['Why do farmers plant at the start of the rains?', 'How do you care for your skin and drink water in the dry season?'], reflection: ['Which season do you like best and why?'],
      support: ['Use two pictures to sort things into wet-season and dry-season groups.'], stretch: ['Keep a weather diary for a week and compare it with a friend elsewhere.'],
      localise: ['Use your local names for the seasons and the actual months in your area.', 'Mention the harmattan if it is part of your local dry season, and ask children what it feels like (dry skin, dust, a hazy sky).', 'Ask a farmer or elder to talk about the seasons.'],
      factCheck: ['Confirm with NaCCA Science B1.2.1.1 and B2.2.1.1 and the local weather office.'],
    },
  }),

  // 5
  mk({
    key: 'okaikoi-and-the-power-of-the-sun',
    title: 'Okaikoi and the Power of the Sun',
    summary: 'Okaikoi and Nafisa learn where electricity comes from, from a solar lamp and the Akosombo Dam, and how to stay safe around it.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'developing', difficulty: 2,
    genres: ['science', 'educational', 'family'], themes: ['technology', 'community', 'health-and-wellbeing'], objectives: ['scientific-curiosity', 'reasoning', 'responsibility', 'vocabulary'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Curious, with a firm tone on the safety page', palette: ['#facc15', '#2563eb'],
    voice: 'A curious boy’s voice for Okaikoi; a clear girl’s voice for Nafisa; a firm, kind teacher voice',
    characters: [
      'Okaikoi: a curious nine-year-old Ghanaian boy with short neat hair, wearing a yellow collared school shirt and brown shorts.',
      'Nafisa: his nine-year-old Ghanaian classmate wearing a soft cream headscarf and matching yellow-and-brown school uniform.',
      'Their teacher: a kind Ghanaian woman wearing a cobalt-blue patterned dress.',
      'Okaikoi’s little brother: a five-year-old Ghanaian boy in a red T-shirt and blue shorts.',
    ],
    music: 'A bright, rising tune with a soft electric hum (placeholder)',
    pages: [
      pg('💡', 'Okaikoi’s family had a small solar lamp. Each morning, he put it in the sun on the window sill. At night, it gave light for his homework. “How does the sun make our lamp shine at night?” he asked.', 'In golden morning sunlight, Okaikoi places a compact yellow solar lantern with a small dark solar panel on top onto a sunny wooden window sill.'),
      pg('☀️', 'His teacher said, “The lamp has a small panel. The panel takes in energy from the sun. It turns the energy into electricity. A battery keeps the electricity. At night, the battery gives light.”', 'In the classroom, the teacher points to the dark solar panel on top of Okaikoi’s yellow solar lamp on the desk while Okaikoi and Nafisa look closely.'),
      pg('🌊', 'Nafisa knew another source. “At Akosombo, a big dam holds back the Volta River. Water flows through machines and turns them. The machines make electricity.” “Water makes electricity, too!” said Okaikoi.', 'Nafisa holding up a vivid wordless painting of the wide concrete Akosombo Dam holding back blue Lake Volta with white water rushing below through green hills.'),
      pg('🔌', 'The teacher named more ways. “Gas can make electricity when it burns. Wind can make it, too. The sun, water and wind will not run out.” The children wrote a list.', 'On the classroom board hang four simple wordless picture cards showing a bright sun, a flowing river dam, a blue gas flame and a white wind turbine.'),
      pg('⚠️', 'Then the teacher spoke firmly. “Electricity helps us, but it can hurt us. Never touch bare wires or a fallen wire. Never put things into a socket. Never touch a switch with wet hands. Keep away from power poles, and never fly a kite near power lines.”', 'The teacher raising one finger seriously in class beside wordless safety picture icons showing a crossed-out wall socket and wet hands away from a switch.'),
      pg('🛡️', '“If you see a fallen wire or a broken socket, stay far away and tell a grown-up at once,” she said. Okaikoi nodded. At home, he told his little brother the rules. Then they set the lamp out in the warm sun.', 'At home, Okaikoi gently guides his younger brother back from a wall socket while pointing toward the yellow solar lamp resting safely on the sunny sill.'),
    ],
    activities: [
      { id: 'op-c1', type: 'comprehension', afterPage: 2, question: 'Where does the solar lamp get its energy?', options: ['The sun', 'The wind', 'The moon'], correctIndex: 0 },
      { id: 'op-c2', type: 'comprehension', afterPage: 5, question: 'What should you do if you see a fallen wire?', options: ['Stay far away and tell a grown-up', 'Pick it up', 'Touch it with a stick'], correctIndex: 0 },
      { id: 'op-s1', type: 'sequencing', prompt: 'Put the solar lamp in order.', items: ['Put the lamp in the sun.', 'The panel takes in sunlight.', 'The battery stores energy.', 'The lamp gives light at night.'] },
      { id: 'op-voc', type: 'vocabulary', afterPage: 2, word: 'battery', definition: 'A container that stores electrical energy.', distractors: ['A kind of lamp', 'A type of wire'] },
    ],
    glossary: [
      { word: 'electricity', definition: 'A kind of energy that makes lights and machines work.', pages: [2, 3, 4, 5] },
      { word: 'battery', definition: 'A container that stores electrical energy.', pages: [2] },
      { word: 'dam', definition: 'A strong wall built across a river to hold back water.', pages: [3] },
    ],
    culturalNotes: ['The story follows the NaCCA Science standards on the sources of electrical energy (B3.4.2.1) and electrical safety (B2.4.2.1). The Akosombo Dam on the Volta River makes electricity from flowing water. It is one of the main sources of electricity in Ghana. Teachers should use accurate local facts.', 'Solar lamps are used in many homes without a grid connection.', 'Safety is the heart of the story: do not touch bare or fallen wires, do not put things into sockets, and do not touch switches with wet hands.'],
    reviewQuestions: ['Check the safety rules with the electricity company or the school safety adviser.', 'Check the description of the Akosombo Dam (Volta River, flowing water makes electricity) with a reliable source before release.'],
    guide: {
      overview: 'The sun, flowing water and wind are sources of electrical energy, and electricity must be handled safely. Based on NaCCA Science standards on sources of electricity and electrical safety.',
      lessonMinutes: 35, goals: ['Name three sources of electricity.', 'Say what a battery does.', 'Name four electrical safety rules.'],
      subjects: [['Science (NaCCA B2.4.2.1, B3.4.2.1)', 'Electricity and electrical safety'], ['Our World Our People', 'Safety at home']],
      before: ['Ask: what at home uses electricity? Where does it come from?'], during: ['Pause on page 5 and ask children to say each safety rule.'],
      after: ['Make an electrical safety poster.', 'Sort pictures into “sources of electricity” and “things that use electricity”.'],
      discussion: ['Why is electricity dangerous?', 'Which sources will not run out?'], reflection: ['Which safety rule will you tell your family?'],
      support: ['Use pictures and match each rule to a danger sign.'], stretch: ['Research how your community gets its electricity.', 'Find out why the sun, water and wind are called renewable sources: they can be used again and again and will not run out.'],
      localise: ['Use the real sources of electricity in your community.', 'Teach children never to experiment with sockets or wires; use only diagrams and low-voltage battery kits with an adult.'],
      factCheck: ['Confirm electricity sources and safety with NaCCA B2.4.2.1 and B3.4.2.1 and with the electricity company.'],
    },
  }),

  // 6
  mk({
    key: 'dari-and-the-veronica-bucket',
    title: 'Dari and the Veronica Bucket',
    summary: 'Dari and Akuffo learn why water alone is not enough to clean hands. Their teacher shows the steps for washing hands with soap at the school’s Veronica bucket, and when to do it.',
    classIds: ['primary-1', 'primary-2'], ageMin: 6, ageMax: 8, readingLevel: 'early', difficulty: 1,
    genres: ['science', 'school-life', 'educational'], themes: ['school', 'health-and-wellbeing', 'community'], objectives: ['responsibility', 'scientific-curiosity', 'sequencing', 'vocabulary'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Clear and steady, with a count for the scrub', palette: ['#0ea5e9', '#22c55e'],
    voice: 'A lively girl’s voice for Dari; a cheerful boy’s voice for Akuffo; a kind, clear teacher voice for Madam Kumi',
    characters: [
      'Dari: a lively seven-year-old Ghanaian schoolgirl with neat braided plaits, wearing a sky-blue-and-navy school uniform dress.',
      'Akuffo: her cheerful seven-year-old Ghanaian classmate with short hair, wearing a sky-blue collared shirt and navy school shorts.',
      'Madam Kumi: their warm Ghanaian class teacher wearing a bright emerald-and-gold African-print dress.',
    ],
    music: 'A light, splashy tune with a counting beat (placeholder)',
    pages: [
      pg('🪣', 'Madam Kumi put a Veronica bucket outside the school toilets. It was a big bucket of clean water with a small tap near the bottom. Beside it, she put a bar of soap and a bowl to catch the water.', 'On a sunny Ghanaian school veranda, Madam Kumi sets up a blue plastic Veronica bucket with a bottom tap on a metal stand, a soap dish, and a catch-bowl below.'),
      pg('💧', 'After play, Akuffo ran to the bucket. He held his hands under the tap for one second. “Done!” he said. “Water is enough.” Madam Kumi smiled. “Water helps, but soap lifts the germs off. Let me show you.”', 'Akuffo quickly dipping his fingertips under the small tap of the blue Veronica bucket for a moment while Madam Kumi smiles gently beside him.'),
      pg('🧼', '“First, wet your hands,” said Madam Kumi. “Then rub on soap. Scrub the backs of your hands, between your fingers and under your nails. Scrub for as long as it takes to sing a short song twice.” Dari sang as she scrubbed.', 'Dari happily singing and rubbing rich white soapy lather between her fingers beside the Veronica bucket stand while Madam Kumi and Akuffo watch.'),
      pg('🚿', '“Now rinse your hands under the running water,” said Madam Kumi. “Dry them with a clean cloth or shake them in the air.” The dirty water ran into the bowl. Dari poured it into a drain and kept the area clean.', 'Dari rinsing clean soapy water off her hands under the Veronica bucket tap into the catch-basin below on the tidy school veranda.'),
      pg('⏰', '“When must we wash our hands?” asked Madam Kumi. Akuffo answered, “Before we eat, after we use the toilet, and after we play outside.” “Yes,” she said, “and after we cough or sneeze into our hands, or touch animals.”', 'In the classroom, Akuffo raises his hand eagerly as Madam Kumi points to wordless picture icons showing mealtime, outdoor play, and petting a goat.'),
      pg('🌟', 'From that day on, Dari and Akuffo washed their hands with soap at the Veronica bucket every time. “Clean hands keep us well,” said Dari. “And they keep our friends well, too,” said Akuffo. Madam Kumi gave them both a big smile.', 'Dari and Akuffo smiling brightly and holding up clean hands beside the blue Veronica bucket on the sunny school veranda as Madam Kumi beams.'),
    ],
    activities: [
      { id: 'dh-c1', type: 'comprehension', afterPage: 2, question: 'Why does Madam Kumi say that soap is needed?', options: ['Soap lifts the germs off', 'Soap makes water cold', 'Soap is pretty'], correctIndex: 0 },
      { id: 'dh-c2', type: 'comprehension', afterPage: 5, question: 'When should we wash our hands?', options: ['Before eating and after using the toilet', 'Only on Mondays', 'Only when we are dirty'], correctIndex: 0 },
      { id: 'dh-s1', type: 'sequencing', prompt: 'Put the handwashing steps in order.', items: ['Wet your hands.', 'Rub on soap and scrub.', 'Rinse under running water.', 'Dry with a clean cloth.'] },
      { id: 'dh-voc', type: 'vocabulary', afterPage: 3, word: 'scrub', definition: 'To rub hard to clean something.', distractors: ['To throw away', 'To make a sound'] },
    ],
    glossary: [
      { word: 'soap', definition: 'A cleaning bar or liquid that lifts dirt and germs off the skin.', pages: [1, 2, 3, 6] },
      { word: 'germs', definition: 'Tiny living things that can make us ill.', pages: [2] },
      { word: 'scrub', definition: 'To rub hard to clean something.', pages: [3] },
    ],
    culturalNotes: ['A Veronica bucket—invented in Ghana by biological scientist Veronica Bekoe—is a covered bucket with a tap near the bottom set on a stand over a catch-bowl so people can wash their hands under clean running water.', 'The story follows the NaCCA Science standards on personal hygiene (B1.5.1.1, B2.5.1.1) and on keeping the school and compound clean (B2.5.1.1.2).', 'Handwashing steps: wet, soap, scrub (about 20 seconds), rinse, dry. The story suggests singing a short song twice as a timer. Teachers should confirm with Ghana Health Service guidance.'],
    reviewQuestions: ['Check the handwashing steps and the times (before eating, after using the toilet, after playing outside, after coughing or sneezing into the hands, after touching animals) against Ghana Health Service guidance.', 'Check that the bucket and the tap are used safely and that the wastewater is not left standing where mosquitoes could breed.'],
    guide: {
      overview: 'A story about washing hands properly with soap at a Veronica bucket. It teaches why soap matters, the steps and the times for handwashing, and keeping the area clean. Based on the NaCCA Science standards on personal hygiene.',
      lessonMinutes: 30, goals: ['Say why we wash hands with soap.', 'Say the five handwashing steps in order.', 'Name four times when we wash our hands.'],
      subjects: [['Science (NaCCA B1.5.1.1, B2.5.1.1)', 'Personal hygiene and sanitation'], ['Our World Our People', 'Health habits']],
      before: ['Ask: when do you wash your hands? How do you do it?'], during: ['Pause on page 3 and have children mime each step.'],
      after: ['Set up a Veronica bucket or a tap, soap and a bowl, and practise the steps with a teacher watching.', 'Make a poster of the five steps and four times.'],
      discussion: ['Why is water alone not enough?', 'Why do we pour the bowl water into a drain?'], reflection: ['When will you wash your hands tonight?'],
      support: ['Use five picture cards for the steps and put them in order.'], stretch: ['Count how many times your class washes hands in one school day.'],
      localise: ['Use the water source, soap and hand-washing points that your school really has.', 'Do not let used water stand in puddles; pour it into a drain or onto plants.'],
      factCheck: ['Confirm the handwashing steps and times with Ghana Health Service guidance and NaCCA B1.5.1.1 and B2.5.1.1.'],
    },
  }),

  // 7
  mk({
    key: 'sosu-and-the-wheelbarrow',
    title: 'Sosu and the Wheelbarrow',
    summary: 'Sosu tries to lift a heavy load by hand. His uncle shows him how a wheelbarrow, a ramp and a pulley make work easier, and how to look after simple machines.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'developing', difficulty: 2,
    genres: ['science', 'educational', 'family'], themes: ['family', 'community', 'technology'], objectives: ['scientific-curiosity', 'problem-solving', 'reasoning', 'responsibility'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'village-life'], wpm: 90, paceWord: 'Practical and clear, with a grunt for each lift', palette: ['#b45309', '#475569'],
    voice: 'A keen boy’s voice for Sosu; a calm, practical voice for Uncle Amissah',
    characters: [
      'Sosu: an energetic nine-year-old Ghanaian boy with short hair, wearing an orange T-shirt, denim shorts and sturdy brown closed shoes.',
      'Uncle Amissah: his tall, practical Ghanaian uncle wearing a yellow work shirt, khaki trousers, work boots and a wide sun hat.',
    ],
    music: 'A steady work beat with a squeak and a clank (placeholder)',
    pages: [
      pg('🏗️', 'Sosu helped his Uncle Amissah on a building site. There was a heavy bag of sand on the ground. Sosu tried to lift it. He pulled and pulled, but the bag would not move. “It is too heavy,” he said.', 'In a tidy sunny Ghanaian yard beside stacked blocks, Sosu tugs hard with both hands on a heavy burlap sack of sand on the ground while Uncle Amissah watches kindly.'),
      pg('🛒', 'Uncle Amissah put the bag into a wheelbarrow. “Now try to push it,” he said. Sosu held the handles, lifted a little, and the wheelbarrow rolled easily. “It feels lighter!” said Sosu.', 'Sosu smiling with surprise as he easily pushes a green metal single-wheel wheelbarrow holding the sack of sand across the yard beside Uncle Amissah.'),
      pg('⚙️', '“A wheelbarrow is a simple machine,” said Uncle Amissah. “The wheel rolls, and the handles work like a lever. Together they carry part of the load and make the work easier. Simple machines help us push, pull or lift.”', 'Uncle Amissah crouching beside the green wheelbarrow, pointing clearly to its front rubber wheel and two long handles while Sosu looks closely.'),
      pg('↗️', 'Next, Uncle Amissah needed to load a drum onto a truck. He used a long, strong board as a ramp. He and two grown-up helpers rolled the drum up the slope. “A ramp is an inclined plane,” said Uncle. “It lets us raise a load with less effort.”', 'Uncle Amissah and two adult workers rolling a large blue barrel smoothly up a sturdy wooden plank ramp onto the back of a flatbed pickup truck as Sosu watches from a safe distance.'),
      pg('🪣', 'At the well, there was a rope over a grooved wheel at the top. When Sosu pulled the rope down, the bucket came up. “That is a pulley,” said Uncle. “It changes the direction of the pull.” Sosu held the rope with care and stood well back from the edge.', 'At a safe walled compound well with a overhead wooden frame and grooved pulley wheel, Sosu stands back pulling the rope downward as a bucket rises, supervised by Uncle Amissah.'),
      pg('🔧', 'Before they went home, Uncle checked the wheelbarrow. He oiled the wheel and cleaned off the sand. “Simple machines last longer when we look after them,” he said. “And we never lift loads that are too heavy for us. Always ask a grown-up to help.”', 'In golden late-afternoon light, Uncle Amissah puts a drop of oil on the wheelbarrow axle while Sosu brushes dry sand off its tray with a small hand brush.'),
    ],
    activities: [
      { id: 'sw-c1', type: 'comprehension', afterPage: 2, question: 'What made the heavy bag easier to move?', options: ['The wheelbarrow', 'A louder voice', 'A bigger hat'], correctIndex: 0 },
      { id: 'sw-c2', type: 'comprehension', afterPage: 4, question: 'What is a ramp?', options: ['A sloping board that helps to raise a load', 'A kind of rope', 'A heavy drum'], correctIndex: 0 },
      { id: 'sw-s1', type: 'sequencing', prompt: 'Put the machines in order.', items: ['The wheelbarrow carries sand.', 'The ramp raises a drum.', 'The pulley lifts a bucket.', 'Uncle oils the wheel.'] },
      { id: 'sw-voc', type: 'vocabulary', afterPage: 3, word: 'machine', definition: 'A tool that makes work easier.', distractors: ['A kind of food', 'A part of a plant'] },
    ],
    glossary: [
      { word: 'wheelbarrow', definition: 'A small cart with one wheel and two handles for carrying loads.', pages: [2, 3, 6] },
      { word: 'ramp', definition: 'A sloping surface that joins a lower level to a higher one.', pages: [4] },
      { word: 'pulley', definition: 'A wheel with a rope over it that helps to lift things.', pages: [5] },
    ],
    culturalNotes: ['Wheelbarrows, ramps and pulleys are used in Ghanaian farms, building sites and wells. The story follows the NaCCA Science standards on simple machines, their advantages and their care (B2.4.3.2, B3.4.3.2).', 'The story is clear that heavy loads are for adults and that children keep back from the edge of a well.'],
    reviewQuestions: ['Check that the three examples (wheelbarrow, ramp, pulley) match the NaCCA simple machines standards.', 'Check that the well safety line is clear (keep back from the edge; grown-ups supervise).'],
    guide: {
      overview: 'A boy discovers how simple machines make work easier. Wheelbarrow, ramp and pulley are everyday examples, and the story ends with care and safety. Based on NaCCA Science standards on simple machines.',
      lessonMinutes: 35, goals: ['Name three simple machines.', 'Say how each makes work easier.', 'Say how to look after a simple machine.'],
      subjects: [['Science (NaCCA B2.4.3.2, B3.4.3.2)', 'Simple machines'], ['Our World Our People', 'Safety']],
      before: ['Ask: how do people move a heavy load? What tools do they use?'], during: ['Pause on page 4 and ask: why is a ramp easier than lifting?'],
      after: ['Roll a toy car up a ramp and a flat board and compare.', 'Find five simple machines around the school and sort them by type.'],
      discussion: ['Why does a ramp help?', 'How do we care for tools?'], reflection: ['Which job at home is easier with a machine?'],
      support: ['Use pictures of each machine and match them to a job.'], stretch: ['Predict whether a steeper ramp is easier or harder and test it with a toy car.'],
      localise: ['Use the tools that farmers and builders in your area use.', 'Teach children that loads, wells and building sites are for adults and that they should keep away from them.'],
      factCheck: ['Confirm with NaCCA Science B2.4.3.2 and B3.4.3.2.'],
    },
  }),

  // 8
  mk({
    key: 'rahmatu-and-the-smoked-fish',
    title: 'Rahmatu and the Smoked Fish',
    summary: 'Rahmatu learns from her Auntie Husseina how food spoils and how drying, smoking, salting and cooling keep it longer, and how to tell when food is not safe to eat.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'developing', difficulty: 2,
    genres: ['science', 'educational', 'family'], themes: ['food', 'family', 'community'], objectives: ['scientific-curiosity', 'reasoning', 'responsibility', 'vocabulary'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'local-food', 'market'], wpm: 90, paceWord: 'Warm and practical, with a clear safety line', palette: ['#0ea5e9', '#92400e'],
    voice: 'A curious girl’s voice for Rahmatu; a warm, expert voice for Auntie Husseina',
    characters: [
      'Rahmatu: an attentive eight-year-old Ghanaian girl wearing a soft yellow headscarf, a sky-blue blouse and a clean striped apron.',
      'Auntie Husseina: her warm Ghanaian aunt and fishmonger wearing a rich terracotta-and-blue patterned wrapper cloth, matching headwrap and clean white apron.',
    ],
    music: 'A gentle market hum with the crackle of a fire (placeholder)',
    pages: [
      pg('🐟', 'At the market, Rahmatu helped her Auntie Husseina sell fish. “If we do not sell the fresh fish today,” said Auntie, “it will spoil. In warm weather, fresh fish can go bad within a day.” Rahmatu asked, “Why does food go bad?”', 'At a tidy Ghanaian market stall, Rahmatu stands beside Auntie Husseina, who arranges shiny fresh silver fish on crushed ice alongside baskets of golden smoked fish.'),
      pg('🦠', '“Tiny living things called germs grow on food, especially when it is warm and wet,” said Auntie. “They make the food smell bad, feel slimy or grow mould. Food that has spoiled can make you ill.”', 'Auntie Husseina explaining carefully to Rahmatu, comparing fresh bright fish kept cool in a bowl of ice with a separate old piece set aside for disposal.'),
      pg('☀️', '“Dry food keeps longer because germs need water to grow,” said Auntie. She laid clean fish out on raised racks in the bright sun to dry. “Drying takes the water out.”', 'In a clean sunlit courtyard, Auntie Husseina lays neat rows of small silver fish on a raised mesh drying table under the warm sun while Rahmatu watches.'),
      pg('🔥', 'Auntie also smoked fish on a wire rack over a clay smoking oven, watching the heat carefully herself. “Smoking dries the fish and helps keep it,” she said. “Salting works the same way. And cold keeps germs from growing quickly, which is why we keep fresh fish on ice or in a refrigerator.”', 'Auntie Husseina tending golden-brown fish on a raised wire tray atop a traditional Ghanaian clay Chorkor smoking oven with gentle smoke rising while Rahmatu stands safely back.'),
      pg('🚫', '“Even so, we must always check our food,” said Auntie. “If food smells bad, feels slimy or has mould, do not eat it. Tell a grown-up and throw it away. Keep dried and smoked fish in a dry, clean, covered basket, wash your hands before and after touching fish, and cook fish well before eating it.”', 'Rahmatu washing her hands with soap at a basin beside neatly covered woven baskets of golden smoked fish on a clean counter while Auntie Husseina nods.'),
      pg('📋', 'Rahmatu wrote a summary for her class: “Food goes bad because germs grow on it. We can dry, smoke, salt or cool food to keep it longer. Always check food before eating it, and keep it clean and covered.” Auntie Husseina smiled. “You will be a wonderful teacher.”', 'Rahmatu sitting at a small wooden table sketching simple drawings of sun-dried fish, an ice bowl and a covered basket in her notebook while Auntie Husseina smiles proudly.'),
    ],
    activities: [
      { id: 'rs-c1', type: 'comprehension', afterPage: 2, question: 'What makes food spoil?', options: ['Germs growing on it', 'Too much music', 'Too much salt'], correctIndex: 0 },
      { id: 'rs-c2', type: 'comprehension', afterPage: 5, question: 'What should you do with food that smells bad or has mould?', options: ['Not eat it and tell a grown-up', 'Eat it quickly', 'Give it to a friend'], correctIndex: 0 },
      { id: 'rs-s1', type: 'sequencing', prompt: 'Put the fish in order, from the market stall to the cooking pot.', items: ['Keep the fresh fish cool, on ice, at the stall.', 'Smoke or dry the fish while an adult watches the fire.', 'Store the dried fish in a dry, clean, covered place.', 'Wash your hands, check the smell, and cook the fish well.'] },
      { id: 'rs-voc', type: 'vocabulary', afterPage: 3, word: 'spoil', definition: 'To go bad so that you cannot eat it safely.', distractors: ['To taste sweet', 'To grow big'] },
    ],
    glossary: [
      { word: 'germs', definition: 'Tiny living things that can make us ill.', pages: [2, 3, 4, 6] },
      { word: 'mould', definition: 'A soft, fuzzy growth on old food.', pages: [2, 5] },
      { word: 'spoiled', definition: 'Gone bad so that it is not safe to eat.', pages: [2] },
    ],
    culturalNotes: ['Smoked and dried fish are important foods in Ghana and are sold in many markets. The story follows the NaCCA Science standards on how food spoils and how it is kept (B2.5.3.2, B3.5.3.2).', 'Children should not use a fire or a smoking rack alone. The story shows an adult doing it.', 'This story is about food safety. It does not say that fresh fish is bad, only that all food must be kept safely.'],
    reviewQuestions: ['Check the explanation that germs need water and warmth to grow and that drying, smoking, salting and cooling slow spoilage.', 'Check that the story does not suggest that children use fire or a smoking rack.'],
    guide: {
      overview: 'Auntie shows how food spoils and how to keep it. Drying, smoking, salting and cooling are everyday ways of preserving food, and children learn how to check for spoilage safely. Based on NaCCA Science standards on food processing and preservation.',
      lessonMinutes: 35, goals: ['Say why food spoils.', 'Name four ways to keep food longer.', 'Say what to do with food that has spoiled.'],
      subjects: [['Science (NaCCA B2.5.3.2, B3.5.3.2)', 'Food processing and spoilage'], ['Our World Our People', 'Food safety']],
      before: ['Ask: what foods do you see dried or smoked at the market?'], during: ['Pause on page 2 and ask: what do germs need to grow?'],
      after: ['Compare two slices of bread, one sealed in a bag and one left out, and note the changes over a week (adult handles any mould).', 'Make a poster of four ways to keep food.'],
      discussion: ['Why do we dry or smoke fish?', 'How do you know that food has spoiled?'], reflection: ['How does your family keep food?'],
      support: ['Use pictures to sort foods into fresh, dried, smoked and spoiled.'], stretch: ['Find out how a refrigerator keeps food from spoiling.'],
      localise: ['Use the foods and the methods of your community.', 'Children keep away from fires and smoking racks; an adult does that work.'],
      factCheck: ['Confirm with NaCCA Science B2.5.3.2 and B3.5.3.2.'],
    },
  }),

  // 9
  mk({
    key: 'odenkey-and-the-itchy-patch',
    title: 'Odenkey and the Itchy Patch',
    summary: 'Odenkey has a round, itchy patch on his arm. The school nurse tells him it is ringworm, a skin infection that spreads by sharing and touching. He gets help, and his class learns how to prevent it and how to be kind.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'developing', difficulty: 2,
    genres: ['science', 'school-life', 'educational'], themes: ['school', 'health-and-wellbeing', 'friendship'], objectives: ['scientific-curiosity', 'responsibility', 'kindness', 'emotional-intelligence'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Gentle and clear, with a reassuring ending', palette: ['#0ea5e9', '#16a34a'],
    voice: 'A worried boy’s voice for Odenkey; a kind, reassuring voice for Nurse Azumah; a warm teacher voice for Madam Kumi',
    characters: [
      'Odenkey: an eight-year-old Ghanaian schoolboy with short hair, wearing a yellow-and-brown check school uniform shirt and brown shorts.',
      'Zakaria: his friendly eight-year-old Ghanaian classmate in a matching yellow-and-brown school uniform.',
      'Nurse Azumah: a gentle Ghanaian school nurse wearing a crisp white clinical coat over a green dress, with hair neatly tied back.',
      'Madam Kumi: the kind Ghanaian class teacher wearing a bright emerald-and-gold African-print dress.',
    ],
    music: 'A gentle, reassuring tune (placeholder)',
    pages: [
      pg('😣', 'Odenkey had a round, red, itchy patch on his arm. He tried to hide it under his sleeve. He felt shy and worried. “What if the others laugh?” he thought. At last, he quietly told Madam Kumi.', 'Beside the classroom desk, shy Odenkey holds his forearm near his shirt sleeve as he speaks quietly to kind, attentive Madam Kumi.'),
      pg('🩺', 'Madam Kumi took him to Nurse Azumah. The nurse looked at the patch gently. “This is ringworm,” she said. “It is a skin infection caused by a tiny living thing called a fungus. It is not a worm, and it does not mean you are dirty. Many children get it.”', 'In a bright, welcoming school clinic room, smiling Nurse Azumah in a white coat gently looks at a small round mark on Odenkey’s forearm while Madam Kumi stands reassuringly nearby.'),
      pg('👐', '“Ringworm spreads when we touch the patch, or when we share combs, towels, caps and clothes with someone who has it,” said Nurse Azumah. “So we keep our own personal items, keep our skin clean and dry, and wash our hands.”', 'Nurse Azumah pointing to a wordless picture card showing a hair comb, a folded hand towel and a cap, explaining good hygiene habits to Odenkey.'),
      pg('💊', '“I will give you medicine to put on the patch,” said the nurse. “Use it every day with a grown-up’s help, for as long as I say, even after the patch looks better. Try not to scratch it, and wash your hands after touching it.” Odenkey nodded.', 'Nurse Azumah handing a small plain white ointment tube to Madam Kumi and smiling Odenkey beside a clean handwashing sink in the school clinic.'),
      pg('🎒', 'The next day, Madam Kumi spoke kindly to the class. “Skin infections can happen to anyone. We never tease. We do not share combs, towels or caps, and we tell a grown-up whenever we notice a rash or an itchy patch.” Zakaria held up his comb. “I will always use my own comb,” he said.', 'In the sunny classroom, Madam Kumi speaks warmly to the pupils while smiling Zakaria holds up his own small comb from his school bag beside Odenkey.'),
      pg('🌟', 'After a few weeks, the patch healed completely. Odenkey felt happy and confident again. “I am glad I told Madam Kumi,” he said. “It is always better to ask for help early.” His friends cheered as they ran out to play together.', 'In the bright schoolyard at break time, happy Odenkey with healthy clear arms laughs and runs out to play football with Zakaria and their classmates.'),
    ],
    activities: [
      { id: 'oi-c1', type: 'comprehension', afterPage: 3, question: 'How does ringworm spread?', options: ['By touching it and sharing combs or towels', 'By looking at it', 'By eating mangoes'], correctIndex: 0 },
      { id: 'oi-c2', type: 'comprehension', afterPage: 5, question: 'What did Madam Kumi say about teasing?', options: ['We do not tease', 'We may tease a little', 'Teasing is a game'], correctIndex: 0 },
      { id: 'oi-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Odenkey finds an itchy patch.', 'He tells Madam Kumi.', 'The nurse gives him medicine.', 'The patch heals.'] },
      { id: 'oi-voc', type: 'vocabulary', afterPage: 3, word: 'infection', definition: 'An illness caused by tiny living things getting into the body.', distractors: ['A kind of food', 'A school rule'] },
    ],
    glossary: [
      { word: 'ringworm', definition: 'A skin infection caused by a fungus that makes round, itchy patches.', pages: [2, 3] },
      { word: 'infection', definition: 'An illness caused by tiny living things getting into the body.', pages: [2] },
      { word: 'medicine', definition: 'Something that helps the body get better when you use it correctly.', pages: [4] },
    ],
    culturalNotes: ['The story follows the NaCCA Science standards on common diseases, including ringworm and skin diseases, and their prevention (B2.5.2.1, B3.5.2.1). Ringworm is a fungal skin infection. It spreads by touching and by sharing items such as combs and towels. It is treated by a health worker.', 'The story takes care that the child is not blamed. It does not say that dirt alone causes ringworm.', 'The story encourages children to tell a trusted adult and to get help from a nurse or health worker, and not to treat the skin on their own.'],
    reviewQuestions: ['Have a nurse or health worker read the story to check the ringworm facts (fungus, spreads by touch and shared items, treated with medicine from a health worker).', 'Check that the story is kind and avoids stigma.'],
    guide: {
      overview: 'A story about ringworm that stays calm and kind. It teaches what causes it, how it spreads, how to prevent it, and why we get help and do not tease. Based on NaCCA Science standards on common diseases and their prevention.',
      lessonMinutes: 30, goals: ['Say how ringworm spreads.', 'Name two ways to prevent it.', 'Say why we do not tease.'],
      subjects: [['Science (NaCCA B2.5.2.1, B3.5.2.1)', 'Common diseases and prevention'], ['Our World Our People', 'Health and kindness']],
      before: ['Ask: what should we do when we have a rash or an itchy patch?'], during: ['Pause on page 3 and ask: how can we stop it from spreading?'],
      after: ['Make a poster: do not share combs, towels and caps.', 'Role-play telling a teacher or nurse about a patch.'],
      discussion: ['Why did Odenkey feel shy?', 'How did Madam Kumi help the class?'], reflection: ['Who can you tell when something is wrong with your body?'],
      support: ['Use pictures of items we do not share.'], stretch: ['Write a short note encouraging a sick friend.'],
      localise: ['Use the words your community uses for the illness.', 'Remind children to go to a nurse or health worker, and not to use home treatments without advice.'],
      factCheck: ['Confirm ringworm facts with a health worker and NaCCA B2.5.2.1 and B3.5.2.1.'],
    },
  }),
];
