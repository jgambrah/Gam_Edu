import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (motif: string, text: string, alt: string, narration = 'Clear, warm storyteller voice; a short pause at the end of the page.'): Page => ({
  motif,
  text,
  alt,
  brief: `Warm hand-painted gouache scene, landscape 4:3, following the character notes exactly. ${alt} Strictly no text, letters, numbers or written labels inside the artwork; keep a calm, uncluttered area for text.`,
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
 * Batch 35: More NaCCA-mapped science and life skills for Basic 1 to 3 (Primary 1 to 3). Eight stories: germination of
 * maize and beans (B1.2.2.1, B3.2.2.1.2); habitats (B3.3.3.1.1); air takes up space and has many uses (B2.2.1.4.2,
 * B3.2.1.4.2); sources of light and staying safe in a power cut (B2.2.1.2.1, B3.4.1.1.1); body parts working together
 * (B2.3.1.1.1, B3.3.1.1.1); illnesses spread by unsafe water (B2.5.2.1.2); burning rubbish and clean air (B2.5.4.1.1,
 * B3.5.4.1.1); and illnesses that spread through the air (B3.5.2.1.2).
 */

export const BATCH_35_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'bempong-and-the-sleeping-seed',
    title: 'Bempong and the Sleeping Seed',
    summary: 'Bempong and Fiati grow beans in a cup and watch a seed wake up. They see how a seed needs water, air and warmth to sprout, and compare a bean with maize.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'educational', 'friendship'], themes: ['farm-and-garden', 'school', 'friendship'], objectives: ['scientific-curiosity', 'sequencing', 'perseverance', 'vocabulary'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'village-life'], wpm: 90, paceWord: 'Patient, with a pause for each day', palette: ['#16a34a', '#a16207'],
    voice: 'A patient boy’s voice for Bempong; a bright girl’s voice for Fiati',
    characters: [
      'Bempong: an eight-year-old Ghanaian boy with short neat hair in a yellow shirt and khaki-brown shorts school uniform, holding a clear cup.',
      'Fiati: his eight-year-old Ghanaian girl classmate with neat braided hair in a yellow shirt and brown pinafore school uniform, holding a plain unlabelled sketchbook.',
      'Their teacher: a warm Ghanaian female teacher in a bright green-and-gold patterned dress beside a classroom window shelf.',
    ],
    music: 'A slow, soft tune with a light rising note for each day (placeholder)',
    pages: [
      pg('🫘', 'Bempong and Fiati held three dry bean seeds. “Are they alive?” asked Fiati. “They look like small stones.” Their teacher said, “A seed is alive, but it is asleep. Let us wake it up.”', 'Bempong and Fiati hold three dry brown bean seeds in their open palms while their smiling teacher stands beside them in a sunlit Ghanaian classroom.'),
      pg('🥤', 'They soaked the seeds overnight. The next day, the seeds were soft and bigger. They put the seeds on a wet cloth inside a clear cup and put the cup in a warm place. Each day, they kept the cloth wet.', 'Bempong and Fiati place plump, soaked bean seeds onto a folded wet white cloth inside a clear cup on a sunny wooden classroom windowsill.'),
      pg('🌱', 'After a few days, the skin of one seed split open. A small white root came out and grew downwards. “The root comes first,” said Bempong. “It will take in water.”', 'Close view of the clear cup as Bempong points to a bean seed whose brown coat has split open with a small white root growing downwards.'),
      pg('🌿', 'Soon, a green shoot grew upwards. It pushed up two small leaves. “The bean seed has two halves, and it opens into two seed leaves,” said the teacher. “A maize seed has one, so a maize plant starts as one green blade.”', 'Beside the teacher, two clear cups sit side by side: one showing a bean seedling with two rounded green leaves and one showing a maize seedling with a single upright green blade.'),
      pg('📏', 'The children drew the plant every two days in their notebooks. First: a soft seed. Next: a root. Next: a shoot. Last: green leaves. “A seed needs water, air and warmth to sprout,” said Fiati.', 'Fiati and Bempong sit at their wooden desk drawing four simple wordless pictures of a sprouting bean plant in an open sketchbook.'),
      pg('🪴', 'They planted the seedlings in soil in the school garden and watered them gently. “Now they need light, too,” said Bempong. Fiati smiled. “The sleeping seed is awake. And we waited for it.”', 'In the sunlit school garden, Bempong and Fiati kneel beside dark soil planting their young green bean seedlings and watering them gently.'),
    ],
    activities: [
      { id: 'gm-c1', type: 'comprehension', afterPage: 3, question: 'Which part of the seed grew out first?', options: ['The root', 'The leaf', 'The flower'], correctIndex: 0 },
      { id: 'gm-c2', type: 'comprehension', afterPage: 5, question: 'What does a seed need to sprout?', options: ['Water, air and warmth', 'Only sunlight', 'Only loud noise'], correctIndex: 0 },
      { id: 'gm-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the seed’s journey in order.', items: ['A dry seed is soaked.', 'The root grows out.', 'The shoot grows up.', 'Leaves open.'] },
      { id: 'gm-voc', type: 'vocabulary', afterPage: 3, word: 'sprout', definition: 'To start to grow from a seed.', distractors: ['To fall down', 'To dry up'] },
    ],
    glossary: [
      { word: 'seed', definition: 'The small part of a plant that can grow into a new plant.', pages: [1] },
      { word: 'root', definition: 'The part of a plant that grows down into the soil and takes in water.', pages: [3] },
      { word: 'shoot', definition: 'The young part of a plant that grows upwards from a seed.', pages: [4] },
    ],
    culturalNotes: ['Maize and beans are common crops across Ghana, and many children see farmers plant them at the start of the rains. The story follows the NaCCA Science standards on the life cycle of plants and the germination of maize and bean seeds (B1.2.2.1, B3.2.2.1.2).', 'A bean seed splits into two halves; a maize seed has one. The story states this simply and checks are listed for reviewers.'],
    reviewQuestions: ['Check the germination steps (water, air and warmth; the root first, then the shoot) against NaCCA B3.2.2.1.2.', 'Check that the story does not give a fixed number of days, because germination time depends on the seed and the weather.'],
    guide: {
      overview: 'A cup-and-cloth experiment shows a bean seed sprouting. Children learn what a seed needs, the order of root, shoot and leaves, and how a bean differs from maize. Based on NaCCA Science standards on the plant life cycle and germination.',
      lessonMinutes: 35, goals: ['Say what a seed needs to sprout.', 'Put the stages of germination in order.', 'Say how a bean and maize seed differ.'],
      subjects: [['Science (NaCCA B1.2.2.1, B3.2.2.1.2)', 'Life cycle of a plant and germination'], ['Mathematics', 'Measuring and recording']],
      before: ['Ask: what is inside a seed? What does it need?'], during: ['Look at the cup together each day and draw what you see.'],
      after: ['Compare seeds in two cups, one wet and one dry, and say what happened.', 'Plant a sprouted seed in the school garden.'],
      discussion: ['Why must we keep the cloth wet?', 'What will the plant need next?'], reflection: ['How did it feel to wait for the seed?'],
      support: ['Use pictures of four stages and put them in order.'], stretch: ['Compare how fast maize and beans sprout.'],
      localise: ['Use the beans, cowpea or maize seed your school can get.', 'Wash hands after touching soil and seeds. Never eat seeds that have been treated for planting.'],
      factCheck: ['Confirm germination needs and steps with NaCCA B1.2.2.1 and B3.2.2.1.2.'],
    },
  }),

  // 2
  mk({
    key: 'tuffour-and-the-bug-hunt',
    title: 'Tuffour and the Bug Hunt',
    summary: 'Tuffour and Atiah go on a careful minibeast hunt in the school garden. They find animals in places that give them food, water and shelter, and learn what a habitat is.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'animal', 'school-life'], themes: ['animals-and-habitats', 'school', 'friendship'], objectives: ['scientific-curiosity', 'environmental-awareness', 'reasoning', 'vocabulary'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Quiet and curious, like a careful search', palette: ['#65a30d', '#78350f'],
    voice: 'A curious boy’s voice for Tuffour; a thoughtful girl’s voice for Atiah',
    characters: [
      'Tuffour: an eight-year-old Ghanaian boy with short hair in a blue-and-khaki school uniform, holding a small magnifying glass.',
      'Atiah: his eight-year-old Ghanaian girl classmate with neat cornrow braids in a blue check school uniform dress, holding an unlabelled sketchbook.',
      'Their teacher: a kind Ghanaian female teacher in a warm terracotta-and-green fabric dress watching closely nearby.',
    ],
    music: 'A light, tiptoeing tune with small insect sounds (placeholder)',
    pages: [
      pg('🔍', 'Their teacher took the class to the school garden for a bug hunt. “Look, but do not touch,” she said. “We keep our hands away from animals we do not know. We look gently and put everything back.”', 'At the leafy edge of a Ghanaian school garden, Tuffour with a magnifying glass and Atiah with a sketchbook listen to their teacher.'),
      pg('🐛', 'Under a damp log, Tuffour saw a worm and some small insects. “It is cool and wet here,” said Atiah. “They like damp places.” They sketched it in their book. Then they put the log back as they found it.', 'Crouching at a safe distance beside a lifted damp wooden log, Tuffour and Atiah observe an earthworm and tiny beetles on dark moist soil.'),
      pg('🐸', 'Near the water tap, there was a small frog. It sat in a wet patch among the leaves. “Frogs need water,” said the teacher, “so they stay near wet places.”', 'Near a dripping outdoor school standpipe tap, a small green-brown frog sits calmly among wet green leaves while Tuffour, Atiah and their teacher watch quietly.'),
      pg('🐜', 'On the school wall, a line of ants marched to a small mound of soil. “That is their home,” said Atiah. “It keeps them safe.” At the top of the tree, a bird sat on a nest.', 'By the low school wall, a neat line of ants marches to a small soil mound while high in a leafy garden tree a yellow weaver bird sits on its woven nest.'),
      pg('🏠', '“Each of these animals has a habitat,” said the teacher. “A habitat is the place where a living thing finds food, water and shelter. A worm’s habitat is the damp soil. A bird’s habitat is a tree.”', 'Under the garden shade, the teacher holds up a picture board with four wordless drawings showing a worm in soil, a frog by water, ants at a mound and a bird in a tree.'),
      pg('🌍', 'Back in class, they drew pictures matching each animal to where they found it. “If we cut down the tree or take the log away for good,” said Tuffour, “the animals lose their home.” The class agreed to look after the garden, and washed their hands.', 'Outside the classroom, Tuffour and Atiah wash their hands with soap at a Veronica bucket while classmates place wordless animal-and-home drawings on a table.'),
    ],
    activities: [
      { id: 'hb-c1', type: 'comprehension', afterPage: 3, question: 'Why do frogs stay near wet places?', options: ['They need water', 'They like noise', 'They hate the sun'], correctIndex: 0 },
      { id: 'hb-c2', type: 'comprehension', afterPage: 5, question: 'What is a habitat?', options: ['The place where a living thing finds food, water and shelter', 'A kind of food', 'A type of insect'], correctIndex: 0 },
      { id: 'hb-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the bug hunt in order.', items: ['Look gently under a log.', 'Find a frog near the tap.', 'See ants and a bird’s nest.', 'Match each animal to its habitat.'] },
      { id: 'hb-voc', type: 'vocabulary', afterPage: 5, word: 'habitat', definition: 'The place where a living thing finds food, water and shelter.', distractors: ['A kind of insect', 'A garden tool'] },
    ],
    glossary: [
      { word: 'habitat', definition: 'The place where a living thing finds food, water and shelter.', pages: [5] },
      { word: 'shelter', definition: 'A place that keeps a living thing safe from weather and enemies.', pages: [5] },
      { word: 'damp', definition: 'A little wet.', pages: [2] },
    ],
    culturalNotes: ['School gardens in Ghana have many small animals. The story follows the NaCCA Science standard on organisms and why they live in particular habitats (B3.3.3.1.1).', 'The hunt follows a safety rule: look, do not touch, wash hands, and put everything back. Some insects bite or sting, and some are harmless.'],
    reviewQuestions: ['Check that the children are not told to touch or collect animals.', 'Check that the examples (worm in damp soil, frog near water, ants in a mound, bird in a tree) are right for the local area.'],
    guide: {
      overview: 'A careful bug hunt shows that animals live where they find food, water and shelter. It teaches the word habitat and respect for living things. Based on NaCCA Science standards on organisms and habitats.',
      lessonMinutes: 40, goals: ['Say what a habitat is.', 'Match an animal to its habitat.', 'Name two rules for watching animals safely.'],
      subjects: [['Science (NaCCA B3.3.3.1.1)', 'Organisms and habitats'], ['Our World Our People', 'Caring for the environment']],
      before: ['Ask: where do you think worms, frogs and birds live?'], during: ['Pause on page 2 and ask children what the log gives the animals.'],
      after: ['Do a habitat chart for the school garden.', 'Draw one animal and its habitat.'],
      discussion: ['What happens to animals when their habitat is destroyed?', 'How can we protect habitats?'], reflection: ['How will you treat animals in your garden?'],
      support: ['Match four animal picture cards to four habitat picture cards.'], stretch: ['Compare the habitat of a frog and a fish.'],
      localise: ['Use the animals found in your school area.', 'Keep hands off unknown animals; adults check the area first.'],
      factCheck: ['Confirm habitat explanations with NaCCA B3.3.3.1.1.'],
    },
  }),

  // 3
  mk({
    key: 'anum-and-the-invisible-helper',
    title: 'Anum and the Invisible Helper',
    summary: 'Anum blows up a balloon and finds that air takes up space. She feels air with a paper fan and finds the many ways air helps us.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'educational', 'family'], themes: ['family', 'community', 'weather'], objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'oral-language'],
    ghanaianContext: 'central', culturalTags: ['village-life', 'local-names'], wpm: 90, paceWord: 'Light and playful, with a breath before each trick', palette: ['#0ea5e9', '#f59e0b'],
    voice: 'A lively girl’s voice for Anum; a warm uncle’s voice for Uncle Ocloo',
    characters: [
      'Anum: a lively seven-year-old Ghanaian girl with two neat puff hairstyles with yellow beads, wearing a bright sky-blue patterned dress.',
      'Uncle Ocloo: her kind adult uncle with a warm smile in a rolled-sleeve indigo work shirt and brown trousers, who mends bicycles.',
      'Her little brother: a five-year-old Ghanaian boy in an orange T-shirt and shorts holding a colourful diamond paper kite.',
    ],
    music: 'A breezy tune with soft whooshing sounds (placeholder)',
    pages: [
      pg('🎈', 'Anum had a flat balloon. “Is there anything in it?” she asked. Uncle Ocloo said, “Blow into it and see.” Anum blew. The balloon grew round and big.', 'In a sunny Ghanaian family compound, Anum blows into a bright red balloon until it swells round and big while Uncle Ocloo watches warmly.'),
      pg('💨', '“What filled the balloon?” asked Uncle Ocloo. “Air,” said Anum. “I cannot see it, but it took up space.” She let go of the end. The balloon whizzed around and went flat again.', 'Anum laughs with delight as the released red balloon zooms through the air in swirls before fluttering down flat beside Uncle Ocloo.'),
      pg('📄', 'Anum made a paper fan. She waved it near her face and felt a soft wind. “Moving air makes wind,” said Uncle Ocloo. “It is all around us, even when we cannot see it.”', 'Sitting on a wooden bench on the veranda, Anum waves a folded colourful paper fan near her smiling face as ribbons in her hair lift gently in the breeze.'),
      pg('🚲', 'At his shop, Uncle Ocloo pumped air into a bicycle tyre. The tyre grew hard. “Air in a tyre makes the ride smooth,” he said. In the yard, her little brother’s kite lifted up in the wind.', 'Outside his small roadside bicycle repair shed, Uncle Ocloo pumps air into a bicycle tyre with a hand pump while Anum’s little brother flies a colourful kite in the yard.'),
      pg('🫁', '“We use air, too,” said Anum. She put her hand on her chest and breathed in and out. “Every person, animal and plant needs air to live,” said Uncle Ocloo. “And wet clothes dry faster in moving air.”', 'Anum stands with her hand on her chest breathing calmly beside Uncle Ocloo, while clean colourful laundry billows on a washing line in the breeze behind them.'),
      pg('🌬️', 'That evening, Anum drew a bright picture of her invisible helper showing five jobs for air: filling a balloon, making wind, pumping a tyre, lifting a kite and helping us breathe.', 'At a wooden table in warm evening light, Anum uses coloured pencils to draw five wordless little pictures showing a balloon, a paper fan, a bicycle, a kite and a smiling child.'),
    ],
    activities: [
      { id: 'ai-c1', type: 'comprehension', afterPage: 2, question: 'What filled the balloon?', options: ['Air', 'Water', 'Sand'], correctIndex: 0 },
      { id: 'ai-c2', type: 'comprehension', afterPage: 5, question: 'What do people, animals and plants need to live?', options: ['Air', 'A kite', 'A tyre'], correctIndex: 0 },
      { id: 'ai-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the balloon trick in order.', items: ['Anum blows into the balloon.', 'The balloon grows round and big.', 'She lets go of the end.', 'The balloon goes flat.'] },
      { id: 'ai-voc', type: 'vocabulary', afterPage: 3, word: 'wind', definition: 'Air that is moving.', distractors: ['A kind of water', 'A loud noise'] },
    ],
    glossary: [
      { word: 'air', definition: 'The mixture of gases all around us that we breathe.', pages: [2] },
      { word: 'space', definition: 'Room that a thing takes up.', pages: [2] },
      { word: 'wind', definition: 'Air that is moving.', pages: [3] },
    ],
    culturalNotes: ['Bicycle repair shops and kites are common sights in Ghanaian communities. The story follows the NaCCA Science standards on the properties and uses of air (B2.2.1.4.2, B3.2.1.4.2).', 'The balloon activity is safe with adult help. Children must not put a balloon in their mouth or chew it, and broken pieces are thrown away at once.'],
    reviewQuestions: ['Check the claim that air takes up space and has many uses against NaCCA B2.2.1.4.2 and B3.2.1.4.2.', 'Check the safety note on balloons (young children can choke on balloon pieces).'],
    guide: {
      overview: 'A balloon, a paper fan and a bicycle pump show that air is real even though we cannot see it. Children learn that air takes up space and has many uses. Based on NaCCA Science standards on air.',
      lessonMinutes: 35, goals: ['Say that air takes up space.', 'Give three uses of air.', 'Say that moving air is wind.'],
      subjects: [['Science (NaCCA B2.2.1.4.2, B3.2.1.4.2)', 'Air around us'], ['Our World Our People', 'Weather and wind']],
      before: ['Ask: can you see air? How do you know it is there?'], during: ['Let children wave a paper fan and say what they feel.'],
      after: ['Blow up a balloon with the teacher and talk about what filled it.', 'Make a poster of five uses of air.'],
      discussion: ['Why does a tyre go flat when air escapes?', 'What would happen if there were no air?'], reflection: ['Where did you feel air today?'],
      support: ['Use a paper fan and a feather to feel and see moving air.'], stretch: ['Test whether a kite flies better on a windy day or a still day.'],
      localise: ['Use a bicycle, motorbike or football pump from your own area.', 'Keep balloons away from small children’s mouths.'],
      factCheck: ['Confirm air properties with NaCCA B2.2.1.4.2 and B3.2.1.4.2.'],
    },
  }),

  // 4
  mk({
    key: 'bawa-and-the-night-the-lights-went-out',
    title: 'Bawa and the Night the Lights Went Out',
    summary: 'The lights go out at Bawa’s home. His sister Napari helps him find out which things give light, and they stay calm and safe until the power returns.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'family', 'educational'], themes: ['family', 'fear-and-courage', 'night-sky'], objectives: ['scientific-curiosity', 'emotional-intelligence', 'problem-solving', 'responsibility'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'village-life'], wpm: 90, paceWord: 'Hushed at first, then warm and calm', palette: ['#1e3a8a', '#fbbf24'],
    voice: 'A small, worried boy’s voice for Bawa; a calm older sister’s voice for Napari',
    characters: [
      'Bawa: a seven-year-old Ghanaian boy with short hair wearing a comfortable yellow-and-blue patterned cotton shirt and dark shorts.',
      'Napari: his calm ten-year-old sister with neat braided hair wearing a coral-orange dress, holding a small silver hand torch.',
      'Their mother: a warm Ghanaian woman in an indigo-and-gold wrapper cloth and headwrap sitting reassuringly with her children.',
    ],
    music: 'A quiet night tune with crickets, then a gentle lift when the lights return (placeholder)',
    pages: [
      pg('🌑', 'Suddenly, the lights went out. The room was dark. Bawa jumped. “I cannot see anything,” he said. “Stay where you are,” said his sister Napari. “It is only a power cut.”', 'In a cosy Ghanaian living room dimly lit only by soft blue moonlight through the window, young Bawa sits close beside his calm older sister Napari.'),
      pg('🔦', 'Napari switched on a small torch. A circle of light fell on the floor. “A torch gives light,” she said. “So does a light bulb when the power is on, and so does the sun in the day.”', 'Napari switches on a small hand torch, casting a warm golden circle of light onto the woven floor mat beside Bawa.'),
      pg('🧸', '“Why can I see my toy now?” asked Bawa. “Light from the torch hits your toy and bounces to your eyes,” said Napari. “We see things when light comes from them or bounces off them.”', 'Bawa smiles with curiosity as the warm beam from Napari’s torch shines directly onto his small wooden toy car on the floor.'),
      pg('⚠️', 'Their mother said, “In a power cut, stay calm and stay together. Use a torch, not a flame, and never play with matches or candles. If you see a wire on the ground, do not touch it. Tell a grown-up.”', 'Sitting together on the sofa in the gentle glow of the torch, their mother speaks calmly and reassuringly to Bawa and Napari.'),
      pg('🫶', 'Bawa breathed slowly. “The dark is just the place where there is no light,” he said. They sang a quiet song and told riddles until the fear went away.', 'Cuddled happily together on the sofa in warm torchlight, Bawa, Napari and their mother clap softly and sing with relaxed smiles.'),
      pg('💡', 'After a while, the lights came back. “Hooray!” said Bawa. The next day, he and Napari drew bright pictures of things that give light and ways to stay safe in the dark. Bawa smiled. “Now I am not afraid.”', 'In bright morning sunlight at a wooden table, Bawa and Napari colour cheerful wordless drawings of a shining sun, a glowing bulb and a hand torch.'),
    ],
    activities: [
      { id: 'bl-c1', type: 'comprehension', afterPage: 2, question: 'Which of these gives light?', options: ['A torch', 'A stone', 'A blanket'], correctIndex: 0 },
      { id: 'bl-c2', type: 'comprehension', afterPage: 4, question: 'What should you do if you see a wire on the ground?', options: ['Do not touch it, and tell a grown-up', 'Pick it up', 'Play with it'], correctIndex: 0 },
      { id: 'bl-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the night in order.', items: ['The lights went out.', 'Napari switched on a torch.', 'They sang and told riddles.', 'The lights came back.'] },
      { id: 'bl-sel', type: 'sel', afterPage: 1, prompt: 'How do you think Bawa felt when the lights went out?', feelingOptions: ['Scared', 'Excited', 'Sleepy', 'Angry'] },
    ],
    glossary: [
      { word: 'torch', definition: 'A small light you hold in your hand.', pages: [2] },
      { word: 'light', definition: 'What lets us see. It comes from the sun, a bulb and a torch.', pages: [2] },
      { word: 'power', definition: 'Electricity that makes lights and machines work.', pages: [1] },
    ],
    culturalNotes: ['Power cuts are common in many communities. The story follows the NaCCA Science standards on sources of light (B2.2.1.2.1) and on safety with electricity (B3.4.1.1.1).', 'The sister’s voice gives clear rules: stay calm, use a torch not a flame, never touch a fallen wire, tell a grown-up.'],
    reviewQuestions: ['Check the light facts: light from a source bounces off objects to our eyes.', 'Check the safety messages match local electricity-safety guidance.'],
    guide: {
      overview: 'A power cut shows children which things give light, how we see objects, and how to stay calm and safe. Based on NaCCA Science standards on sources of light and safety with electricity.',
      lessonMinutes: 35, goals: ['Name three sources of light.', 'Say how we see things.', 'Say two safety rules for a power cut.'],
      subjects: [['Science (NaCCA B2.2.1.2.1, B3.4.1.1.1)', 'Sources of light and safety with electricity'], ['Our World Our People', 'Staying safe at home']],
      before: ['Ask: what do you do when the lights go out at home?'], during: ['Dim the room and shine a torch on a toy to show how we see.'],
      after: ['Make a safety card: use a torch, stay calm, tell a grown-up.', 'Sort pictures into things that give light and things that do not.'],
      discussion: ['Why is a torch safer than a candle for children?', 'How can we help a younger child who is afraid of the dark?'], reflection: ['What helps you feel calm in the dark?'],
      support: ['Use picture cards: torch, bulb, sun, stone.'], stretch: ['Say why the moon looks bright even though it does not make its own light.'],
      localise: ['Use the light sources found in your area: torch, lantern, phone light.', 'Never let children play with matches, candles or fallen wires.'],
      factCheck: ['Confirm light sources with NaCCA B2.2.1.2.1 and safety with B3.4.1.1.1.'],
    },
  }),

  // 5
  mk({
    key: 'adu-and-the-catch-that-took-a-team',
    title: 'Adu and the Catch That Took a Team',
    summary: 'Adu catches a ball at break time and Dery asks how he did it. They find that eyes, brain, hands and legs all work together as a team.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'school-life', 'friendship'], themes: ['school', 'friendship', 'health-and-wellbeing'], objectives: ['scientific-curiosity', 'reasoning', 'teamwork', 'vocabulary'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Quick and bouncy during play, then slower', palette: ['#dc2626', '#2563eb'],
    voice: 'A cheerful boy’s voice for Adu; an inquisitive girl’s voice for Dery',
    characters: [
      'Adu: an eight-year-old Ghanaian boy with short neat hair in a red-and-khaki school sports kit, holding a classic black-and-white ball.',
      'Dery: his eight-year-old Ghanaian girl classmate with neat braids in a matching red-and-blue school sports shirt and skirt.',
      'Their teacher: an encouraging Ghanaian female teacher in a clean blue collared sports polo shirt and dark trousers.',
    ],
    music: 'A playground tune with a bouncing beat (placeholder)',
    pages: [
      pg('⚽', 'At break time, Dery threw a ball to Adu. Adu saw it coming, ran two steps and caught it. “Great catch!” said Dery. “How did you do that so fast?”', 'In a sunny Ghanaian schoolyard at break time, Adu leaps two steps forward and catches a ball cleanly in both hands while Dery cheers.'),
      pg('👀', 'Their teacher came over. “Let us slow it down,” she said. “First, your eyes saw the ball. Your eyes are sense organs. They tell you what is happening around you.”', 'Their smiling teacher kneels slightly in the schoolyard and gestures gently near her own eyes while Adu holds the ball and Dery listens.'),
      pg('🧠', '“Next, your brain,” said the teacher. “Your brain is in your head. It got the message from your eyes and decided what to do. Then it sent a message to your legs and hands.”', 'Under the shade of a school veranda, the teacher taps the side of her head gently to indicate thinking while Adu and Dery point thoughtfully to their heads, hands and legs.'),
      pg('🦵', '“Your legs moved you to the right place,” she said. “Your hands closed around the ball. Your bones and muscles helped you move. Your body parts work together like a team.”', 'Adu demonstrates running swiftly on strong legs with his hands curved ready to catch the ball while Dery and the teacher watch.'),
      pg('🫀', '“And your heart pumped blood to all those parts,” she added. “Your breath gave you air. That is why you feel warm and breathe fast after a game.” Dery put a hand on her chest. “I can feel it.”', 'Standing in the sunlit courtyard after playing, Dery places her hand gently over her chest to feel her heartbeat while Adu smiles beside her.'),
      pg('🤝', 'The children played again. This time, Dery caught the ball. “My team worked!” she laughed. “And when we eat well, drink water and rest, the team stays strong.”', 'Dery catches the ball joyfully in both hands in the sunny schoolyard while Adu claps and a clean water bottle sits on a bench nearby.'),
    ],
    activities: [
      { id: 'ac-c1', type: 'comprehension', afterPage: 3, question: 'Which body part sent a message to Adu’s legs and hands?', options: ['His brain', 'His hair', 'His shoes'], correctIndex: 0 },
      { id: 'ac-c2', type: 'comprehension', afterPage: 5, question: 'What helps the body team stay strong?', options: ['Eating well, drinking water and resting', 'Staying awake all night', 'Eating only sweets'], correctIndex: 0 },
      { id: 'ac-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the catch in order.', items: ['Eyes see the ball.', 'The brain decides what to do.', 'Legs and hands move.', 'Adu catches the ball.'] },
      { id: 'ac-voc', type: 'vocabulary', afterPage: 4, word: 'muscles', definition: 'Parts of the body that help bones move.', distractors: ['Parts of a ball', 'Kinds of food'] },
    ],
    glossary: [
      { word: 'brain', definition: 'The part of the body in the head that thinks and sends messages.', pages: [3] },
      { word: 'muscles', definition: 'Parts of the body that help bones move.', pages: [4] },
      { word: 'team', definition: 'A group that works together.', pages: [4] },
    ],
    culturalNotes: ['Ball games are a favourite at break time in Ghanaian schools. The story follows the NaCCA Science standards on parts of the body that work together (B2.3.1.1.1, B3.3.1.1.1).', 'The story keeps to simple ideas: senses tell the brain, the brain sends messages, muscles and bones move the body.'],
    reviewQuestions: ['Check the simple description of how senses, brain, muscles and bones work together against NaCCA B2.3.1.1.1 and B3.3.1.1.1.', 'Check the statement that the heart pumps blood and breath brings air.'],
    guide: {
      overview: 'Catching a ball shows how eyes, brain, legs, hands, heart and lungs work together. Children learn simple body parts and keeping the body healthy. Based on NaCCA Science standards on body systems.',
      lessonMinutes: 35, goals: ['Name body parts used in catching a ball.', 'Say what the brain does.', 'Name two ways to keep the body strong.'],
      subjects: [['Science (NaCCA B2.3.1.1.1, B3.3.1.1.1)', 'Body parts working together'], ['Physical Education', 'Moving and playing safely']],
      before: ['Ask: what body parts do we use to catch a ball?'], during: ['Pause on page 3 and trace the message from eyes to brain to hands.'],
      after: ['Play catch with a soft ball and name each body part used.', 'Draw the body team.'],
      discussion: ['What would happen if the eyes could not see?', 'How can we look after our bodies?'], reflection: ['Which part of your body team do you thank today?'],
      support: ['Use a body picture and arrows.'], stretch: ['Compare the body to a team on a football pitch.'],
      localise: ['Use the games your children play: ball, skipping, running.', 'Remind children that people with different abilities can all join in games.'],
      factCheck: ['Confirm body-system ideas with NaCCA B2.3.1.1.1 and B3.3.1.1.1.'],
    },
  }),

  // 6
  mk({
    key: 'ayamga-and-the-tummy-trouble',
    title: 'Ayamga and the Tummy Trouble',
    summary: 'Ayamga gets a bad tummy after drinking water from an uncovered pot. His mother helps him with oral rehydration salts and takes him to the clinic, and the family learns to keep water safe.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'family', 'educational'], themes: ['health-and-wellbeing', 'family', 'community'], objectives: ['scientific-curiosity', 'responsibility', 'problem-solving', 'environmental-awareness'],
    ghanaianContext: 'central', culturalTags: ['village-life', 'local-names'], wpm: 90, paceWord: 'Calm and caring, never frightening', palette: ['#0891b2', '#f97316'],
    voice: 'A tired boy’s voice for Ayamga; a calm mother’s voice for Mama Kuuire',
    characters: [
      'Ayamga: an eight-year-old Ghanaian boy with short hair wearing an orange T-shirt and navy shorts.',
      'Mama Kuuire: his calm, caring mother wearing a turquoise-and-gold patterned wrapper cloth and matching headwrap.',
      'The health worker: a friendly Ghanaian community nurse in a crisp clean teal-and-white clinic uniform.',
    ],
    music: 'A gentle, caring tune (placeholder)',
    pages: [
      pg('🥵', 'After football, Ayamga was very thirsty. He saw an open pot of water in the yard and scooped a cup with his hands. The pot had been left uncovered, and flies had been landing on it.', 'In a warm afternoon courtyard after football, sweaty Ayamga scoops water from an uncovered clay water pot while a couple of small flies hover near the rim.'),
      pg('🤢', 'That night, Ayamga’s tummy hurt. He ran to the washroom again and again. Mama Kuuire felt his forehead. “You have lost a lot of water from your body,” she said. “We must give it back.”', 'In a warm lamp-lit room, Ayamga sits on a wooden chair holding his tummy with a tired face while Mama Kuuire gently touches his forehead.'),
      pg('🥤', 'Mama Kuuire opened a packet of oral rehydration salts, called ORS, and mixed it with clean, safe water just as the health worker had taught her. “Take small sips,” she said. “This helps your body get back the water it lost.”', 'At a clean wooden table, Mama Kuuire stirs a clear glass of safe water and gently helps Ayamga take small sips from a clean cup.'),
      pg('🏥', 'In the morning, Mama Kuuire took Ayamga to the clinic. The health worker said, “You were right to come. Unsafe water can carry germs that cause a bad tummy. Keep giving ORS and come to us if it does not get better.”', 'Inside a bright, clean Ghanaian community clinic, a smiling nurse in a teal uniform speaks warmly with Mama Kuuire and Ayamga.'),
      pg('🚰', '“How do we stop this?” asked Mama Kuuire. “Use clean drinking water. Keep it in a covered container. Wash hands with soap before eating and after using the washroom,” said the health worker. “Always use a clean cup.”', 'The nurse points to a clean blue water container fitted with a tight lid and tap beside a bar of soap and a clean cup.'),
      pg('🌞', 'That evening, Ayamga felt better. At home, the family covered the pot, washed their hands with soap and used a clean cup. “I will not drink from an open pot again,” said Ayamga.', 'In golden evening light in their tidy compound, a smiling, healthy Ayamga and Mama Kuuire wash their hands with soap beside a neatly covered water pot.'),
    ],
    activities: [
      { id: 'at-c1', type: 'comprehension', afterPage: 3, question: 'What did Mama Kuuire mix with clean water?', options: ['Oral rehydration salts', 'Sugar and sand', 'Soap'], correctIndex: 0 },
      { id: 'at-c2', type: 'comprehension', afterPage: 5, question: 'How can we keep drinking water safe?', options: ['Keep it covered and use a clean cup', 'Leave the pot open', 'Share one dirty cup'], correctIndex: 0 },
      { id: 'at-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the story in order.', items: ['Ayamga drank from an open pot.', 'His tummy hurt.', 'His mother gave him ORS.', 'The family covered their water pot.'] },
      { id: 'at-voc', type: 'vocabulary', afterPage: 4, word: 'germs', definition: 'Tiny living things that can make us sick.', distractors: ['Small stones', 'Kinds of food'] },
    ],
    glossary: [
      { word: 'germs', definition: 'Tiny living things that can make us sick.', pages: [4] },
      { word: 'clinic', definition: 'A place where health workers care for sick people.', pages: [4] },
      { word: 'covered', definition: 'Having a lid or cloth on top.', pages: [5, 6] },
    ],
    culturalNotes: ['Water stored in open pots can pick up germs, and diarrhoea is a common illness in many places. The story follows the NaCCA Science standard on illnesses spread by water (B2.5.2.1.2).', 'The story says to mix ORS with clean safe water and to go to a clinic. It does not give doses. Health workers should review this page.'],
    reviewQuestions: ['Check with a health worker that the advice (ORS, small sips, clinic visit, safe water, handwashing with soap) matches Ghana Health Service guidance.', 'Check that the story is calm and does not frighten children.'],
    guide: {
      overview: 'A boy gets a bad tummy after drinking unsafe water. Children learn that germs spread through unsafe water, that ORS and a health worker help, and how to keep water safe. Based on NaCCA Science standards on illnesses spread by water.',
      lessonMinutes: 35, goals: ['Say how unsafe water can make people sick.', 'Name two ways to keep water safe.', 'Say what to do when someone has a bad tummy.'],
      subjects: [['Science (NaCCA B2.5.2.1.2)', 'Water-borne illnesses and prevention'], ['Our World Our People', 'Health at home and in the community']],
      before: ['Ask: where does your drinking water come from? How do you keep it?'], during: ['Pause on page 5 and list the safe-water rules.'],
      after: ['Make a poster: cover, clean cup, wash hands.', 'Practise handwashing with soap.'],
      discussion: ['Why is it important to tell an adult when your tummy hurts?', 'How can the whole community keep water safe?'], reflection: ['What will you do the next time you are very thirsty?'],
      support: ['Use pictures of a covered pot and an open pot.'], stretch: ['Say why ORS is mixed only with clean, safe water.'],
      localise: ['Use the water sources in your community. Children must never boil water or handle hot containers.', 'Follow local health guidance on water treatment.'],
      factCheck: ['Have a health worker confirm the ORS and clinic advice.', 'Confirm with NaCCA B2.5.2.1.2.'],
    },
  }),

  // 7
  mk({
    key: 'ofei-and-the-smoky-morning',
    title: 'Ofei and the Smoky Morning',
    summary: 'Smoke from burning rubbish makes Ofei and Gbeddy cough on the way to school. They find out why smoke makes air dirty and what the community can do instead.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'school-life', 'educational'], themes: ['community', 'school', 'citizenship'], objectives: ['environmental-awareness', 'problem-solving', 'responsibility', 'reasoning'],
    ghanaianContext: 'central', culturalTags: ['village-life', 'local-names'], wpm: 90, paceWord: 'Brisk walking pace, with a cough and a clearing', palette: ['#6b7280', '#16a34a'],
    voice: 'A coughing boy’s voice for Ofei; a clear-headed girl’s voice for Gbeddy',
    characters: [
      'Ofei: a nine-year-old Ghanaian boy with short neat hair in a yellow shirt and brown shorts school uniform, carrying a blue schoolbag.',
      'Gbeddy: his nine-year-old Ghanaian girl classmate with braided hair tied with green ribbons in a yellow shirt and brown pinafore school uniform.',
      'Their teacher: a calm Ghanaian female teacher in a leafy-green patterned dress.',
    ],
    music: 'A gentle walking tune that becomes clear and bright at the end (placeholder)',
    pages: [
      pg('🌫️', 'On the way to school, Ofei and Gbeddy saw smoke. A heap of rubbish was burning by the road. The smoke stung their eyes. “Cough, cough,” coughed Ofei. “My chest hurts.”', 'Walking along a red-earth town path toward school, Ofei and Gbeddy step back and cover their noses as grey smoke drifts from a smouldering roadside rubbish heap in the distance.'),
      pg('🏫', 'At school, they told their teacher. “Smoke from burning rubbish makes the air dirty,” she said. “It can make people cough, and hurt eyes and chests. Plastic smoke is the worst.”', 'Inside a bright Ghanaian classroom, Ofei and Gbeddy speak earnestly to their attentive teacher in a green patterned dress.'),
      pg('♻️', '“So what should we do with rubbish?” asked Gbeddy. “We can reuse some things and put the rest in a bin,” said the teacher. “Food waste can go into a compost heap. Never burn plastic.”', 'Outside by the school garden, the teacher points toward a tidy covered waste bin and a wooden-slatted garden compost heap.'),
      pg('🗑️', 'The class set up three colour-coded boxes: one for reuse, one for compost and one for the bin. Ofei put a clean bottle in the reuse box. Gbeddy put banana skins in the compost box. They agreed that children never light fires, and always tell a grown-up.', 'In the classroom, Ofei places a clean plastic bottle into an unlabelled blue box while Gbeddy drops banana peels into an unlabelled green box beside a yellow bin.'),
      pg('🤝', 'The class took a polite letter in a sealed envelope to the elders. “Please help us find a safe place for rubbish, and a way to collect it,” they asked. The elders listened and spoke to the town’s waste collectors.', 'Under a shady compound tree alongside their teacher, Ofei and Gbeddy respectfully hand a plain white envelope to a smiling elder wrapped in traditional cloth.'),
      pg('🌤️', 'A few weeks later, the heap by the road was gone. The air was clean. “We can breathe!” said Ofei. “Clean air is for everybody,” said Gbeddy. “We must look after it.”', 'Under a clear blue morning sky beside a clean grassy roadside with fresh green trees, Ofei and Gbeddy walk happily to school breathing fresh air.'),
    ],
    activities: [
      { id: 'os-c1', type: 'comprehension', afterPage: 2, question: 'What does smoke from burning rubbish do to the air?', options: ['It makes it dirty', 'It makes it sweet', 'It makes it cold'], correctIndex: 0 },
      { id: 'os-c2', type: 'comprehension', afterPage: 4, question: 'Which is a safer choice than burning rubbish?', options: ['Reuse, compost or use a bin', 'Burn it at night', 'Throw it in the river'], correctIndex: 0 },
      { id: 'os-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the story in order.', items: ['They saw smoke.', 'The teacher explained.', 'They sorted rubbish into three boxes.', 'The road became clean.'] },
      { id: 'os-voc', type: 'vocabulary', afterPage: 3, word: 'compost', definition: 'Old plant and food waste that rots into food for soil.', distractors: ['A kind of plastic', 'A type of smoke'] },
    ],
    glossary: [
      { word: 'smoke', definition: 'The grey cloud that comes from something burning.', pages: [1, 2] },
      { word: 'compost', definition: 'Old plant and food waste that rots into food for soil.', pages: [3, 4] },
      { word: 'rubbish', definition: 'Things we throw away.', pages: [1, 2, 3, 5] },
    ],
    culturalNotes: ['Burning rubbish is common in many places, and the smoke can harm health. The story follows the NaCCA Science standards on air pollution and caring for the environment (B2.5.4.1.1, B3.5.4.1.1).', 'The children go to the elders with a letter, which shows respect and a safe way to ask for change.'],
    reviewQuestions: ['Check the claim that burning rubbish, especially plastic, makes smoke that can harm health.', 'Check that the story does not tell children to light or tend fires.'],
    guide: {
      overview: 'Children see that burning rubbish pollutes the air and learn safer ways to deal with waste: reuse, compost and bins. They also see how a community can ask for change respectfully. Based on NaCCA Science standards on air pollution.',
      lessonMinutes: 35, goals: ['Say why burning rubbish is harmful.', 'Name three better ways to deal with waste.', 'Say one way children can help their community.'],
      subjects: [['Science (NaCCA B2.5.4.1.1, B3.5.4.1.1)', 'Air pollution and caring for the environment'], ['English', 'Writing a short formal letter']],
      before: ['Ask: what happens to rubbish in your community?'], during: ['Pause on page 4 and list the three boxes.'],
      after: ['Set up three boxes in class and sort clean, safe items.', 'Write a short, respectful letter to a community leader about rubbish.'],
      discussion: ['Why must children never light fires?', 'Who can help a community deal with rubbish?'], reflection: ['What is one thing you can reuse at home?'],
      support: ['Use picture cards for reuse, compost and bin.'], stretch: ['Say how clean air helps plants and animals too.'],
      localise: ['Use the rubbish systems in your own community.', 'Children must stay away from fires and smoke.'],
      factCheck: ['Confirm air-pollution ideas with NaCCA B2.5.4.1.1 and B3.5.4.1.1.'],
    },
  }),

  // 8
  mk({
    key: 'zumah-and-the-cough-catcher',
    title: 'Zumah and the Cough Catcher',
    summary: 'Zumah gets a cold and learns from her aunt how to cover a cough, wash her hands and rest. The class learns how colds spread through the air and how to protect others.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'school-life', 'friendship'], themes: ['health-and-wellbeing', 'school', 'helping-others'], objectives: ['scientific-curiosity', 'responsibility', 'kindness', 'problem-solving'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'village-life'], wpm: 90, paceWord: 'Warm and light, with a sniff and a giggle', palette: ['#7c3aed', '#14b8a6'],
    voice: 'A sniffly girl’s voice for Zumah; a caring aunt’s voice for Auntie Dzobo',
    characters: [
      'Zumah: a seven-year-old Ghanaian girl with neat braided puffs with purple hair ties, wearing a lilac home shirt at home and a yellow-and-brown school uniform at school, holding a clean folded cloth.',
      'Auntie Dzobo: her warm, caring aunt who is a community health volunteer wearing a teal-and-purple patterned dress.',
      'Zumah’s little brother and classmates: cheerful Ghanaian children who listen and practise healthy habits.',
    ],
    music: 'A cheerful, gentle tune with a soft sneeze sound (placeholder)',
    pages: [
      pg('🤧', 'Zumah woke up with a runny nose. She sneezed, “Achoo!” right into the air. Her little brother giggled. “Your sneeze went all over me!” he said. Auntie Dzobo came in. “Let us talk about that.”', 'In a sunny Ghanaian morning room, young Zumah in a lilac shirt sneezes into the air while her little brother leans back giggling and Auntie Dzobo steps in kindly.'),
      pg('🔬', '“When we cough or sneeze, tiny drops fly out of our nose and mouth,” said Auntie Dzobo. “They can carry germs. If someone breathes them in, they can catch a cold too.” Zumah’s eyes grew wide.', 'Sitting beside wide-eyed Zumah, Auntie Dzobo holds up a simple wordless picture card showing tiny blue droplets spraying through the air.'),
      pg('💪', '“Cough or sneeze into your elbow or into a clean cloth,” said Auntie Dzobo. “Then throw the cloth away or wash it. Wash your hands with soap after you cough, sneeze or blow your nose.” Zumah practised.', 'Zumah practises tucking her nose and mouth neatly into her bent elbow while Auntie Dzobo smiles approvingly beside a basin of water and soap.'),
      pg('🏠', '“If you feel sick, tell a grown-up and stay at home and rest,” said Auntie Dzobo. “Drink water. If you still feel bad, or if you have trouble breathing, go to the clinic.” Zumah rested for two days.', 'Resting comfortably under a light colourful cloth on a sofa at home, Zumah holds a clean cup of water while Auntie Dzobo sits beside her.'),
      pg('🏫', 'Back at school, Zumah showed her class what she had learned. “Cover your cough, wash your hands and stay home if you are sick,” she said. The class drew bright pictures of how to be a Cough Catcher, and everyone practised.', 'In her yellow-and-brown school uniform, healthy Zumah shows her smiling classmates how to cough into a bent elbow beside a wordless picture chart of elbow-coughing and soapy hands.'),
      pg('🤝', 'Soon, the class had fewer colds. “We keep each other well,” said Zumah. “A cough catcher cares about others.” She smiled, and washed her hands before lunch.', 'Outside the classroom before lunch, Zumah and her cheerful classmates wash their hands with white soap bubbles at a clean Veronica bucket.'),
    ],
    activities: [
      { id: 'zc-c1', type: 'comprehension', afterPage: 3, question: 'Where should you cough or sneeze?', options: ['Into your elbow or a clean cloth', 'Into the air', 'Onto a friend'], correctIndex: 0 },
      { id: 'zc-c2', type: 'comprehension', afterPage: 4, question: 'What should you do if you feel sick?', options: ['Tell a grown-up and rest at home', 'Hide it', 'Go to a crowded place'], correctIndex: 0 },
      { id: 'zc-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the cough-catcher steps in order.', items: ['Cough or sneeze into your elbow.', 'Throw away or wash the cloth.', 'Wash your hands with soap.', 'Rest if you feel sick.'] },
      { id: 'zc-sel', type: 'sel', afterPage: 6, prompt: 'How do you think Zumah felt when her class had fewer colds?', feelingOptions: ['Proud', 'Bored', 'Angry', 'Scared'] },
    ],
    glossary: [
      { word: 'sneeze', definition: 'To push air out of your nose and mouth suddenly.', pages: [1] },
      { word: 'germs', definition: 'Tiny living things that can make us sick.', pages: [2] },
      { word: 'elbow', definition: 'The bend in the middle of your arm.', pages: [3] },
    ],
    culturalNotes: ['Colds and coughs spread easily in classrooms and homes. The story follows the NaCCA Science standard on illnesses that spread through the air (B3.5.2.1.2).', 'Auntie Dzobo is a community health volunteer, showing that people in the community can share health knowledge.'],
    reviewQuestions: ['Check with a health worker that covering coughs, washing hands, resting and going to a clinic for breathing trouble match Ghana Health Service guidance.', 'Check that the story does not suggest a cure for any particular illness.'],
    guide: {
      overview: 'A girl with a cold learns how coughs and sneezes spread germs and how to protect others by covering coughs, washing hands and resting. Based on NaCCA Science standards on illnesses spread through the air.',
      lessonMinutes: 35, goals: ['Say how a cold can spread.', 'Show how to cover a cough or sneeze.', 'Say why we wash our hands.'],
      subjects: [['Science (NaCCA B3.5.2.1.2)', 'Illnesses that spread through the air'], ['Physical Education', 'Healthy habits']],
      before: ['Ask: what do we do when we cough or sneeze?'], during: ['Practise coughing into the elbow with the class.'],
      after: ['Make a Cough Catcher poster.', 'Practise handwashing with soap and clean water.'],
      discussion: ['Why should we stay home when we are sick?', 'How can we be kind to a sick friend?'], reflection: ['What will you do next time you sneeze?'],
      support: ['Use picture steps: elbow, cloth, soap.'], stretch: ['Say how the same habits help stop other illnesses.'],
      localise: ['Use the local clinic name and community health volunteer in your area.', 'Do not mock children who are sick.'],
      factCheck: ['Have a health worker confirm the advice.', 'Confirm with NaCCA B3.5.2.1.2.'],
    },
  }),
];
