import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (motif: string, text: string, alt: string, narration = 'Clear, warm storyteller voice; a short pause at the end of the page.'): Page => ({
  motif,
  text,
  alt,
  brief: `Warm hand-painted gouache scene, landscape 4:3, following the character notes exactly. ${alt} Keep a calm, uncluttered area for text.`,
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
 * Batch 25: Little ones, big ideas. Eight short, simple stories for nursery to primary 4 on the same themes as Batches
 * 23 and 24 (living things, water, food, health, rivers, farming and fishing), told in very short sentences with a
 * Ghanaian setting.
 *
 * Rules: as Batches 13 to 24. All children, families and animals are invented. Facts are basic and checked against
 * widely taught science; reviewers should confirm each fact in the review questions. Safety first: children never go
 * near pits, deep water without an adult and a life jacket, or unknown animals. All stories are drafts awaiting review.
 */

export const BATCH_25_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'buzz-finds-a-flower',
    title: 'Buzz Finds a Flower',
    summary: 'A little bee called Buzz is hungry. She flies over a bare hill and a busy road, but there are no flowers. Then she finds one yellow flower, then more, and a girl called Afi plants a whole patch. A counting story that shows why bees need flowers.',
    classIds: ['nursery-2', 'kg-1'],
    ageMin: 3,
    ageMax: 5,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['animal', 'nature', 'educational'],
    themes: ['animals-and-habitats', 'farm-and-garden', 'helping-others'],
    objectives: ['counting', 'oral-language', 'vocabulary', 'environmental-awareness'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names'],
    wpm: 85,
    paceWord: 'Slow and buzzy, with a pause for each number',
    palette: ['#facc15', '#16a34a'],
    voice: 'Soft, buzzy storyteller voice, brightening with each new flower',
    characters: [
      'Buzz: a small, round bee with gold and black stripes and clear wings.',
      'Afi: a girl of five with two puffs of hair, a yellow dress and a small watering can.',
      'The flowers: bright yellow flowers with round middles, growing in a row.',
    ],
    music: 'A light, buzzing tune with soft taps for each number (placeholder)',
    pages: [
      pg('🐝', 'Buzz was a little bee. Zzz, zzz, zzz! She was hungry. She wanted something sweet.', 'A small striped bee flies in the morning sun.'),
      pg('⛰️', 'Buzz flew over a hill. The hill was brown and bare. There were no flowers. Zzz, zzz.', 'A bee flies over a bare brown hill.'),
      pg('🛣️', 'Buzz flew over a road. Honk, honk! A truck went by. There were no flowers here, too.', 'A bee flies over a road with a truck.'),
      pg('1️⃣', 'Then Buzz saw one yellow flower. One! She landed on it. It had sweet juice inside. It is called nectar.', 'A bee lands on one yellow flower.'),
      pg('🌼', 'Yellow dust stuck to her legs. It is called pollen. Buzz flew to the next flower. Two! The pollen fell off. That helps flowers make seeds.', 'A bee with yellow dust on her legs lands on a second flower.'),
      pg('👧', 'A girl named Afi saw Buzz. ‘Bees like flowers,’ she said. ‘I will plant more!’ She put seeds in the soil.', 'A girl plants seeds in soil beside a bee.'),
      pg('💧', 'Afi gave the seeds water. Soon there were three, four, five flowers! Buzz went from flower to flower.', 'A girl waters a row of five flowers while a bee hovers.'),
      pg('🌞', 'Buzz was not hungry any more. Zzz, zzz, zzz! She hummed a happy song. The end.', 'A happy bee rests on a flower in the sun.'),
    ],
    activities: [
      { id: 'buzz-c1', type: 'comprehension', afterPage: 1, question: 'What was the bee called?', options: ['Buzz', 'Afi', 'Honk'], correctIndex: 0 },
      { id: 'buzz-p1', type: 'prediction', afterPage: 3, prompt: 'Buzz is hungry. What does she want to find? Tell a friend.', options: ['Flowers', 'A truck'] },
      { id: 'buzz-ph', type: 'phonics', afterPage: 6, targetSound: 'b', prompt: 'Which words start with the b sound, like Buzz?', options: ['bee', 'flower', 'bare', 'sun'], correctIndexes: [0, 2] },
      { id: 'buzz-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Buzz was hungry.', 'Buzz found one flower.', 'Afi planted more flowers.'] },
      { id: 'buzz-sel', type: 'sel', afterPage: 8, prompt: 'Afi planted flowers to help the bee. How do you feel when you help?', feelingOptions: ['Kind', 'Happy', 'Proud', 'Sleepy'] },
    ],
    glossary: [
      { word: 'nectar', definition: 'The sweet juice inside a flower.', pages: [4] },
      { word: 'pollen', definition: 'Yellow dust inside a flower that helps it make seeds.', pages: [5] },
      { word: 'hungry', definition: 'Wanting to eat.', pages: [1] },
    ],
    culturalNotes: ['Buzz and Afi are invented. The story is a simple picture book about bees and flowers, linked to the older stories on trees and beekeeping in Batches 23 and 24.', 'Bees visit flowers for nectar and pollen and, as they move from flower to flower, carry pollen that helps plants make seeds and fruit. The story keeps this to one simple sentence.'],
    reviewQuestions: ['Confirm that the explanations of nectar, pollen and how bees help flowers make seeds are correct and clear for this age group.', 'Check that the story does not encourage children to touch bees.'],
    guide: {
      overview: 'A first counting story about why bees need flowers. Children count from one to five and meet two new words, nectar and pollen.',
      lessonMinutes: 20,
      goals: ['Count from one to five.', 'Say what bees look for in flowers.', 'Learn one way people can help bees.'],
      subjects: [['Language and Literacy', 'Listening and new words'], ['Mathematics', 'Counting to five'], ['Our World', 'Living things']],
      before: ['Ask: have you seen a bee? Where was it? What was it doing?'],
      during: ['Hold up fingers for each number and buzz softly on the “zzz” parts.'],
      after: ['Plant bean seeds or flower seeds in a pot and water them.', 'Tell children to watch bees from far away and never touch them.'],
      discussion: ['Why was Buzz hungry?', 'How did Afi help?'],
      reflection: ['What can you plant to help bees?'],
      support: ['Use five paper flowers to count with.'],
      stretch: ['Draw five flowers and a bee and count them aloud.'],
      localise: ['Use the names of local flowers children know. Remind children that some bees sting and they should watch from far away.'],
      factCheck: [{ claim: 'Bees collect nectar and pollen from flowers and carry pollen between flowers, which helps plants make seeds and fruit.', explanation: 'Basic science taught in primary and lower secondary schools.', reference: 'A primary science textbook or the Ghana News Agency feature on beekeeping (gna.org.gh) for the Ghanaian link.' }],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'wash-wash-wash',
    title: 'Wash, Wash, Wash!',
    summary: 'Baako plays in the sand and then wants to eat with dirty hands. His mother sings a washing song and shows him how: wet, soap, rub, rinse, dry. A rhythm story about washing hands with soap and water before eating and after the toilet.',
    classIds: ['nursery-2', 'kg-1'],
    ageMin: 3,
    ageMax: 5,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['educational', 'rhyme', 'family'],
    themes: ['health-and-wellbeing', 'family', 'helping-others'],
    objectives: ['oral-language', 'sequencing', 'responsibility', 'vocabulary'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names', 'local-food'],
    wpm: 85,
    paceWord: 'Rhythmic and cheerful, with a chorus the children can join',
    palette: ['#0ea5e9', '#f97316'],
    voice: 'A warm, singing mother’s voice, and a cheerful little boy’s voice',
    characters: [
      'Baako: a boy of four with a round face, a red T-shirt and sandy knees.',
      'Mama: Baako’s mother, in a bright wrapper and a headscarf, holding a bar of soap.',
      'The bucket tap: a plastic bucket with a tap on a stand, with a bowl underneath and a bar of soap beside it.',
    ],
    music: 'A bouncy hand-clap rhythm with a simple, sing-along tune (placeholder)',
    pages: [
      pg('🏖️', 'Baako played in the sand. He dug a hole. He made a hill. His hands were very dirty!', 'A boy plays with sand, with dirty hands.'),
      pg('🍲', 'Mama called, ‘Time to eat!’ Baako ran to the table. ‘Stop!’ said Mama. ‘Wash, wash, wash!’', 'A mother holds out a hand to stop her son at the table, with a pot of soup.'),
      pg('🪣', 'They went to the bucket with the tap. Baako turned the tap. Drip, drip, drip! He got his hands wet.', 'A boy turns a tap on a bucket and wets his hands.'),
      pg('🧼', 'Mama gave him soap. ‘Rub, rub, rub,’ she sang. ‘Rub the front, rub the back, rub between your fingers.’', 'A boy rubs soap into his hands as his mother watches.'),
      pg('🎵', 'They sang a song and rubbed and rubbed. Bubbles, bubbles, bubbles! Baako giggled. ‘The dirt is going away.’', 'A boy and his mother rub their hands, with bubbles all around.'),
      pg('💦', 'Baako rinsed his hands with clean water. Splash, splash, splash! The soap and the dirt went down the bowl.', 'A boy rinses his soapy hands over a bowl.'),
      pg('🧻', 'He dried his hands on a clean cloth. ‘Now my hands are clean,’ he said. ‘Tiny germs are too small to see, but soap sends them away.’', 'A boy dries his hands on a clean cloth and smiles.'),
      pg('😋', 'Baako ate his rice and stew. Yum, yum, yum! ‘I wash before I eat, and after the toilet,’ he said. The end.', 'A boy eats rice and stew with a happy face.'),
    ],
    activities: [
      { id: 'wash-c1', type: 'comprehension', afterPage: 2, question: 'What did Mama say Baako must do?', options: ['Wash his hands', 'Play again', 'Go to sleep'], correctIndex: 0 },
      { id: 'wash-p1', type: 'prediction', afterPage: 3, prompt: 'Baako has wet hands. What comes next? Tell a friend.', options: ['Soap', 'Dirt', 'A nap'] },
      { id: 'wash-ph', type: 'phonics', afterPage: 6, targetSound: 's', prompt: 'Which words start with the s sound, like soap?', options: ['soap', 'sand', 'tap', 'splash'], correctIndexes: [0, 1, 3] },
      { id: 'wash-s1', type: 'sequencing', prompt: 'Put the washing in order.', items: ['Wet your hands.', 'Rub them with soap.', 'Rinse them.', 'Dry them.'] },
      { id: 'wash-sel', type: 'sel', afterPage: 8, prompt: 'Baako felt clean and ready to eat. How do you feel when you wash your hands?', feelingOptions: ['Clean', 'Happy', 'Proud', 'Hungry'] },
    ],
    glossary: [
      { word: 'soap', definition: 'Something we rub on wet hands to wash them clean.', pages: [4] },
      { word: 'rinsed', definition: 'Washed off with clean water.', pages: [6] },
      { word: 'germs', definition: 'Tiny things too small to see that can make us ill.', pages: [7] },
    ],
    culturalNotes: ['Baako and Mama are invented. The story models the steps of handwashing with soap and clean water: wet, soap, rub the front, back and between the fingers, rinse and dry.', 'Many homes and schools use a bucket with a tap and a bowl, as in the story; where this is not available, teachers can show a jug and a basin with a helper.', 'The story names two moments for handwashing: before eating and after using the toilet. Teachers can add others, such as after playing outside and after touching animals.'],
    reviewQuestions: ['Have a public health nurse or community health worker check the handwashing steps and the sentence about germs.', 'Check that the story does not suggest that soap is a replacement for clean drinking water or medical care.'],
    guide: {
      overview: 'A rhythm story that teaches the steps of handwashing. Children can act out each step and join the washing song.',
      lessonMinutes: 20,
      goals: ['Say the steps of washing hands in order.', 'Say when to wash hands.', 'Join in a short chorus.'],
      subjects: [['Health Habits', 'Washing hands'], ['Language and Literacy', 'Rhythm and sequencing']],
      before: ['Show a bar of soap and a bowl. Ask: when do we wash our hands?'],
      during: ['Clap or tap for the rhythm and let children say “Wash, wash, wash!” together.'],
      after: ['Practise the steps with real soap and water in small groups with an adult.', 'Make a picture chart of the steps for the handwashing place.'],
      discussion: ['Why does Mama say to wash before we eat?', 'When else can we wash our hands?'],
      reflection: ['Who helps you to wash your hands at home?'],
      support: ['Use picture cards for the steps.'],
      stretch: ['Teach the song to a younger child or to someone at home.'],
      localise: ['Use the handwashing station your school or home really has and the local word for soap.', 'Make sure the water is safe for hand washing and that there is soap.'],
      factCheck: [{ claim: 'Washing hands with soap and clean water, including rubbing the fronts and backs of the hands and between the fingers for about 20 seconds, helps remove germs and prevent illness.', explanation: 'Standard public-health guidance.', reference: 'World Health Organization or Ghana Health Service handwashing guidance (to verify).' }],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-seed-that-waited',
    title: 'The Seed That Waited',
    summary: 'Frema plants a bean seed in a tin and waits. Nothing happens for days, and she wants to give up. Grandmother shows her that seeds need water, light and time, and one morning a tiny green shoot appears. A story about patience and how a seed grows.',
    classIds: ['kg-2', 'primary-1'],
    ageMin: 5,
    ageMax: 7,
    readingLevel: 'emergent',
    difficulty: 1,
    genres: ['educational', 'family', 'nature'],
    themes: ['farm-and-garden', 'family', 'new-beginnings'],
    objectives: ['perseverance', 'sequencing', 'scientific-curiosity', 'vocabulary'],
    ghanaianContext: 'incidental',
    culturalTags: ['village-life', 'local-names'],
    wpm: 90,
    paceWord: 'Slow and patient, with a hopeful lift at the shoot',
    palette: ['#65a30d', '#a16207'],
    voice: 'A gentle girl’s voice for Frema; a warm, calm grandmother’s voice',
    characters: [
      'Frema: a girl of six with short twists, a blue dress and muddy fingers.',
      'Grandmother: Frema’s grandmother, in a wrapper and headscarf, sitting on a low stool.',
      'The tin: an old tomato tin with small holes in the bottom, filled with soil, on a sunny windowsill.',
    ],
    music: 'A slow, gentle tune on a kalimba, getting brighter at the shoot (placeholder)',
    pages: [
      pg('🫘', 'Frema had one bean seed. She put it in an old tin full of soil. ‘Grow, little seed,’ she said.', 'A girl presses a bean seed into soil in a tin.'),
      pg('💧', 'She gave it water. She put the tin in the sun. Then she waited. One day went by. Nothing happened.', 'A girl waters a tin on a sunny windowsill.'),
      pg('😟', 'Two days went by. Three days. Nothing! ‘My seed is not growing,’ said Frema. ‘I want to dig it up.’', 'A girl frowns at a tin of soil with nothing growing.'),
      pg('👵', 'Grandmother smiled. ‘Wait, my child,’ she said. ‘The seed is growing under the soil, where you cannot see.’', 'A grandmother speaks gently to her granddaughter beside the tin.'),
      pg('🌱', '‘A seed needs water, light and time,’ said Grandmother. ‘First it grows a root, down into the soil. Then it grows a shoot, up to the sun.’', 'A drawing shows a seed with a root going down and a shoot going up.'),
      pg('⏳', 'So Frema watered the seed every morning. She waited and waited. Four days. Five days. She did not dig it up.', 'A girl waters a tin each morning with a calendar on the wall.'),
      pg('✨', 'One morning, Frema looked in the tin. A tiny green shoot was pushing up out of the soil! ‘It grew!’ she shouted.', 'A girl sees a tiny green shoot in a tin and jumps for joy.'),
      pg('🌿', 'Frema smiled at Grandmother. ‘I learned to wait,’ she said. Soon the shoot grew big green leaves. The end.', 'A girl and her grandmother smile at a bean plant with green leaves.'),
    ],
    activities: [
      { id: 'seed-c1', type: 'comprehension', afterPage: 3, question: 'What did Frema want to do when nothing happened?', options: ['Dig up the seed', 'Eat the seed', 'Sing to the seed'], correctIndex: 0 },
      { id: 'seed-c2', type: 'comprehension', afterPage: 5, question: 'What does a seed need to grow?', options: ['Water, light and time', 'Only sugar', 'Only noise'], correctIndex: 0 },
      { id: 'seed-ph', type: 'phonics', afterPage: 7, targetSound: 'sh', prompt: 'Which words have the sh sound, like shoot?', options: ['shoot', 'seed', 'shouted', 'soil'], correctIndexes: [0, 2] },
      { id: 'seed-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Frema planted a seed.', 'Grandmother told her to wait.', 'A green shoot grew.'] },
      { id: 'seed-sel', type: 'sel', afterPage: 8, prompt: 'Frema learned to wait. How do you feel when you have to wait?', feelingOptions: ['Patient', 'Impatient', 'Hopeful', 'Proud'] },
    ],
    glossary: [
      { word: 'seed', definition: 'A small thing that a new plant can grow from.', pages: [1, 3] },
      { word: 'root', definition: 'The part of a plant that grows down into the soil.', pages: [5] },
      { word: 'shoot', definition: 'The first small green part of a plant that grows up out of the soil.', pages: [5, 7, 8] },
    ],
    culturalNotes: ['Frema and Grandmother are invented. The story shows how a bean seed grows in a tin, with a root first and a shoot after. The number of days is not fixed, because the time a seed takes to sprout depends on the seed, the soil and the weather.', 'Using an old tin with small holes for drainage is a common way to start seeds at home or at school.'],
    reviewQuestions: ['Check that the order of growth (root first, then shoot) and the needs of a seed (water, warmth and air, with light needed by the young plant rather than the buried seed) are described correctly for this age.', 'Check that the story does not suggest an exact number of days for sprouting.'],
    guide: {
      overview: 'A story about patience and about how a seed grows. Children can plant their own bean seeds and watch.',
      lessonMinutes: 25,
      goals: ['Retell how a seed grows in order.', 'Say what a seed needs.', 'Talk about why waiting can be hard and worth it.'],
      subjects: [['Science / Our World', 'Plants'], ['Language and Literacy', 'Sequencing and new words'], ['Values', 'Patience']],
      before: ['Show a bean seed. Ask: what do you think is inside?'],
      during: ['Pause on page 3 and ask: what should Frema do?'],
      after: ['Plant bean seeds in cups with holes in the bottom and keep a class chart of what you see each day.', 'Wash hands after touching soil.'],
      discussion: ['Why did Frema want to dig up the seed?', 'What did Grandmother say?'],
      reflection: ['What is something you had to wait for?'],
      support: ['Use pictures of the seed, root, shoot and leaves to put in order.'],
      stretch: ['Draw the seed each day for a week and write one word under each drawing.'],
      localise: ['Use seeds children know, such as beans or maize, and the local names for them.', 'Do not let children eat seeds that have been treated or are not meant for eating.'],
      factCheck: [{ claim: 'A seed needs water and warmth to begin to grow; the root grows first and the shoot grows up towards light.', explanation: 'Basic plant science taught in primary school.', reference: 'A primary science textbook (to verify).' }],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'drip-the-raindrop',
    title: 'Drip the Raindrop',
    summary: 'Drip is a tiny drop of water in the sea. The sun warms her, and she floats up into the sky, joins a cloud, falls as rain on a farm, runs down a river and comes back to the sea. A journey that shows the water cycle in simple steps.',
    classIds: ['primary-1', 'primary-2'],
    ageMin: 6,
    ageMax: 8,
    readingLevel: 'early',
    difficulty: 2,
    genres: ['educational', 'adventure', 'nature'],
    themes: ['weather', 'animals-and-habitats', 'farm-and-garden'],
    objectives: ['scientific-curiosity', 'sequencing', 'vocabulary', 'environmental-awareness'],
    ghanaianContext: 'incidental',
    culturalTags: ['village-life', 'local-names'],
    wpm: 95,
    paceWord: 'Light and flowing, with a splash at the rain',
    palette: ['#0284c7', '#cbd5e1'],
    voice: 'A bright, bubbly voice for Drip; a calm narrator',
    characters: [
      'Drip: a round blue raindrop with big eyes and a happy smile.',
      'The farmer: a woman in a wide hat with a hoe, standing in a green field.',
      'The cloud: a grey-white cloud with a gentle face.',
    ],
    music: 'A flowing, playful tune with xylophone drops and a rumble of drums for the rain (placeholder)',
    pages: [
      pg('🌊', 'Drip was a tiny drop of water. She lived in the big blue sea with millions of other drops. ‘It is warm today,’ said Drip.', 'A small blue drop with a happy face floats in the sea.'),
      pg('☀️', 'The sun shone down on the sea. Drip felt very warm. She turned into a tiny, invisible puff and floated up, up, up into the sky.', 'A drop rises from the sea in sunlight as an invisible puff.'),
      pg('☁️', 'High in the sky, it was cold. Drip met other puffs. They all turned back into tiny drops and held hands. Together they made a cloud.', 'Many tiny drops gather to make a cloud high in the sky.'),
      pg('🌧️', 'The cloud grew heavy. Rumble, rumble! Drip and her friends fell down as rain. ‘Splash!’ cried Drip.', 'Raindrops fall from a dark cloud onto green hills.'),
      pg('🌽', 'Drip landed on a farm. The farmer smiled. The rain gave water to the maize and the beans. ‘Thank you, rain!’ said the farmer.', 'A farmer smiles as rain falls on a field of maize and beans.'),
      pg('🏞️', 'Some water ran into a stream, and the stream ran into a river. Drip rode along the river. She passed fish, reeds and a village.', 'A raindrop rides along a river past reeds and a village.'),
      pg('🌅', 'The river went on and on until it reached the big blue sea. ‘I am home!’ said Drip. She was ready to go again.', 'A raindrop reaches the sea at the river’s mouth in the evening.'),
      pg('♻️', 'The sun shone, and Drip floated up again. Water goes round and round. We call it the water cycle. The end.', 'A drawing of the water cycle shows the sea, the sun, a cloud, rain and a river.'),
    ],
    activities: [
      { id: 'drip-c1', type: 'comprehension', afterPage: 2, question: 'What warmed Drip and made her float up?', options: ['The sun', 'The moon', 'The wind'], correctIndex: 0 },
      { id: 'drip-c2', type: 'comprehension', afterPage: 5, question: 'Where did the rain give water to the maize and beans?', options: ['On a farm', 'In a shop', 'On a road'], correctIndex: 0 },
      { id: 'drip-ph', type: 'phonics', afterPage: 6, targetSound: 'r', prompt: 'Which words start with the r sound, like rain?', options: ['rain', 'river', 'sun', 'rumble'], correctIndexes: [0, 1, 3] },
      { id: 'drip-s1', type: 'sequencing', prompt: 'Put Drip’s journey in order.', items: ['Drip floated up from the sea.', 'Drip joined a cloud.', 'Drip fell as rain.', 'Drip ran down the river to the sea.'] },
      { id: 'drip-sel', type: 'sel', afterPage: 8, prompt: 'Drip went on a long journey and came home. How do you feel at the end of a journey?', feelingOptions: ['Tired', 'Happy', 'Proud', 'Curious'] },
    ],
    glossary: [
      { word: 'invisible', definition: 'Too small or clear to be seen.', pages: [2] },
      { word: 'cloud', definition: 'A large white or grey mass of tiny water drops in the sky.', pages: [3, 4] },
      { word: 'river', definition: 'A large stream of water that flows to the sea.', pages: [6, 7] },
      { word: 'cycle', definition: 'Something that goes round and round in the same order.', pages: [8] },
    ],
    culturalNotes: ['Drip and the farmer are invented. The story follows the steps of the water cycle: the sun warms water from the sea, it rises as invisible water vapour, cools and forms clouds, falls as rain, runs into streams and rivers and returns to the sea. The word “vapour” is not used; “invisible puff” keeps it simple.', 'The story does not name a real river. Teachers can use a local river or stream as an example. It does not say that river water is safe to drink; teachers should say that river water can carry mud and germs and should not be drunk unless an adult has made it safe.'],
    reviewQuestions: ['Check that the water-cycle steps are correct and that “invisible puff” and the line about cold air are acceptable for this age.', 'Check that the story does not suggest that river water is safe to drink.'],
    guide: {
      overview: 'A raindrop’s journey that teaches the water cycle in six steps. Children can act out the story and draw the cycle.',
      lessonMinutes: 25,
      goals: ['Retell the water cycle in order.', 'Name the sea, cloud, rain and river.', 'Say why rain matters to farms.'],
      subjects: [['Science', 'Water and weather'], ['Language and Literacy', 'Sequencing and new words'], ['Our World', 'Farming']],
      before: ['Ask: where does rain come from? Where does it go?'],
      during: ['Let children act each step with their bodies: float up, gather, fall, flow.'],
      after: ['Draw the water cycle on paper plates and label the sea, cloud, rain and river.', 'Remind children that river water is not safe to drink unless an adult has made it safe.'],
      discussion: ['Where did Drip start and end?', 'Why does a farmer like rain?'],
      reflection: ['How do you use water at home?'],
      support: ['Use picture cards for the steps.'],
      stretch: ['Write one sentence for each step of Drip’s journey.'],
      localise: ['Use the local river, lagoon or stream and the local word for rain.', 'Keep children away from fast or deep water.'],
      factCheck: [{ claim: 'The sun warms water, which rises as invisible vapour, cools into clouds, falls as rain, runs into rivers and returns to the sea.', explanation: 'The basic water cycle taught in primary science.', reference: 'A primary science textbook (to verify).' }],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'kakra-and-the-little-fish',
    title: 'Kakra and the Little Fish',
    summary: 'Kakra waits on the beach as his grandfather’s canoe comes in with the morning catch. He is surprised when Grandfather puts the small fish back into the sea. Grandfather explains that little fish need time to grow, so there will be fish tomorrow. A story about taking only what we need.',
    classIds: ['primary-1', 'primary-2'],
    ageMin: 6,
    ageMax: 8,
    readingLevel: 'early',
    difficulty: 2,
    genres: ['educational', 'family', 'nature'],
    themes: ['family', 'food', 'community', 'animals-and-habitats'],
    objectives: ['environmental-awareness', 'responsibility', 'counting', 'vocabulary'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'local-food'],
    wpm: 95,
    paceWord: 'Calm and rhythmic like the waves, with a lift when the fish go back',
    palette: ['#0369a1', '#f59e0b'],
    voice: 'A curious boy’s voice for Kakra; a slow, kind grandfather’s voice',
    characters: [
      'Kakra: a boy of seven with a round face, a yellow T-shirt and shorts, standing on the beach.',
      'Grandfather: Kakra’s grandfather, a fisherman in a faded shirt and a cap, with a life jacket beside him.',
      'Mama: Kakra’s mother, in a wrapper and an apron, with a big basin for sorting fish.',
      'The canoe: a long wooden canoe with painted patterns, pulled up on the sand, with a net inside.',
    ],
    music: 'Gentle waves with a soft drum, brightening when the little fish swim off (placeholder)',
    pages: [
      pg('🌅', 'Early in the morning, Kakra stood on the beach with his mother. The sky was pink. The sea was calm. ‘Here comes Grandfather!’ he said.', 'A boy and his mother wait on the beach as a canoe comes in at sunrise.'),
      pg('🛶', 'The canoe slid up onto the sand. Grandfather wore his life jacket. He always did. He lifted the net out of the canoe.', 'A fisherman in a life jacket lifts a net out of a canoe on the sand.'),
      pg('🐟', 'The net was full of fish! Kakra counted the big ones. ‘One, two, three, four, five, six!’ Mama put them in her big basin.', 'A boy counts big fish while his mother puts them in a basin.'),
      pg('🐠', 'Then Kakra saw some tiny fish, as small as his finger. ‘Grandfather, why not take these too?’ he asked.', 'A boy points at a few tiny fish in the net.'),
      pg('🤲', 'Grandfather gently picked up the little fish. He walked to the water and put them back in. Splash! They swam away.', 'A fisherman gently puts small fish back into the sea.'),
      pg('💭', '‘Little fish need time to grow big,’ said Grandfather. ‘When they are big, they have babies. If we take all the little ones, one day there will be no fish for you to catch.’', 'A grandfather talks to his grandson at the water’s edge.'),
      pg('🕸️', '‘That is why my net has big holes,’ said Grandfather. ‘The small fish can swim out. We keep the big ones.’ Kakra looked at the net and nodded.', 'A boy looks at the big holes in a net while small fish swim away.'),
      pg('🌟', 'Kakra helped Mama carry the basin. ‘I want to be a fisherman like Grandfather,’ he said. ‘I will take only what we need, and leave the little ones.’ The end.', 'A boy and his mother carry a basin of fish along the beach as the sun rises.'),
    ],
    activities: [
      { id: 'kakra-c1', type: 'comprehension', afterPage: 3, question: 'How many big fish did Kakra count?', options: ['Six', 'Ten', 'Two'], correctIndex: 0 },
      { id: 'kakra-c2', type: 'comprehension', afterPage: 6, question: 'Why did Grandfather put the little fish back?', options: ['They need time to grow', 'They were ugly', 'They were too noisy'], correctIndex: 0 },
      { id: 'kakra-ph', type: 'phonics', afterPage: 5, targetSound: 'f', prompt: 'Which words start with the f sound, like fish?', options: ['fish', 'big', 'finger', 'net'], correctIndexes: [0, 2] },
      { id: 'kakra-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The canoe came in with the net.', 'Kakra counted the big fish.', 'Grandfather put the little fish back.', 'Kakra said he would take only what was needed.'] },
      { id: 'kakra-sel', type: 'sel', afterPage: 8, prompt: 'Kakra learned to look after the sea. How do you feel about looking after nature?', feelingOptions: ['Proud', 'Caring', 'Curious', 'Thoughtful'] },
    ],
    glossary: [
      { word: 'canoe', definition: 'A long, narrow boat that is moved by paddles or a motor.', pages: [2] },
      { word: 'net', definition: 'A web of string or rope used to catch fish.', pages: [2, 3, 7] },
      { word: 'basin', definition: 'A wide, round bowl.', pages: [3] },
    ],
    culturalNotes: ['Kakra, Grandfather and Mama are invented. The story is set in a coastal fishing community but names no real place. Many families in coastal Ghana depend on fishing, and women often handle, smoke and sell the catch.', 'The idea that letting small fish go gives them time to grow and breed is a basic principle of looking after fish stocks. The detail about a net with larger holes letting small fish escape is simple and general; the story does not give a mesh size.', 'Safety: the story shows Grandfather in a life jacket and Kakra on the beach, not in the canoe. Teachers should reinforce that children should never go near the sea or a boat without an adult.'],
    reviewQuestions: ['Have a fisheries officer or a coastal fishing community member check that the description of nets, small fish and growing and breeding is accurate and respectful, and that the family details are appropriate.', 'Check that the story does not suggest that all fishing practices in Ghana are sustainable; add local rules such as closed seasons when appropriate.'],
    guide: {
      overview: 'A short story about a boy who learns why a fisherman lets small fish go. It introduces the idea of taking only what we need.',
      lessonMinutes: 25,
      goals: ['Retell the story in order.', 'Explain why small fish are put back.', 'Count to ten and use the words net, canoe and basin.'],
      subjects: [['Science / Our World', 'Animals and habitats'], ['Mathematics', 'Counting'], ['Values', 'Caring for nature']],
      before: ['Ask: where does the fish we eat come from?'],
      during: ['Count the fish aloud on page 3.'],
      after: ['Draw the sea with big and small fish and show which ones Grandfather kept.', 'Remind children never to go near the sea or a boat without an adult.'],
      discussion: ['Why did Grandfather put the little fish back?', 'What will happen if people catch all the little fish?'],
      reflection: ['What do you take only a little of so that there is enough for everyone?'],
      support: ['Use paper fish in two sizes to sort.'],
      stretch: ['Write two sentences about what Kakra learned.'],
      localise: ['Invite a local fisher (with an adult) to talk about the fish in your area and the rules for fishing. Use the local names of fish.', 'Do not let children go near the water unsupervised.'],
      factCheck: [{ claim: 'Small fish need time to grow and breed, so catching too many young fish reduces future catches; larger-mesh nets let small fish escape.', explanation: 'A basic principle of fisheries management.', reference: 'Ghana Fisheries Commission or FAO guidance on responsible fishing (to verify).' }],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-frogs-who-sang-too-loud',
    title: 'The Frogs Who Sang Too Loud',
    summary: 'Atsu cannot sleep because the frogs in the pond behind the house sing so loudly. He plans to chase them away, but Grandmother tells him to wait. Then the pond is spoiled with rubbish, the frogs go quiet, and the mosquitoes come. Atsu learns what the loud frogs were telling him, and helps clean the pond. A funny story about frogs, clean water and mosquitoes.',
    classIds: ['primary-2', 'primary-3'],
    ageMin: 7,
    ageMax: 9,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['humour', 'educational', 'nature'],
    themes: ['animals-and-habitats', 'family', 'health-and-wellbeing', 'community'],
    objectives: ['scientific-curiosity', 'environmental-awareness', 'reasoning', 'responsibility'],
    ghanaianContext: 'incidental',
    culturalTags: ['village-life', 'local-names'],
    wpm: 100,
    paceWord: 'Playful and croaky, with a hush at the silent night',
    palette: ['#16a34a', '#0f766e'],
    voice: 'A cheeky boy’s voice for Atsu; a calm, humorous grandmother’s voice; a deep “ribbit” for the frogs',
    characters: [
      'Atsu: a boy of eight with a round face, a striped T-shirt and shorts, with cotton in his ears.',
      'Grandma Korkoi: Atsu’s grandmother, in a wrapper and headscarf, sitting on a stool with a smile.',
      'The frogs: green frogs with big eyes, sitting on lily pads and singing.',
      'The pond: a small pond with reeds behind the house, a few plastic bags caught at the edge.',
    ],
    music: 'A rhythmic frog chorus and a playful drum, then silence at the quiet night (placeholder)',
    pages: [
      pg('🐸', 'It was the rainy season. Behind Atsu’s house, there was a pond, and in the pond lived a hundred frogs. Every night they sang, ‘Ribbit! Ribbit! Ribbit!’ Atsu could not sleep.', 'A boy lies in bed with a pillow over his head while frogs sing outside.'),
      pg('👂', 'Atsu put cotton in his ears. It did not help. ‘Those frogs sing too loud!’ he groaned. ‘Tomorrow, I will chase them all away.’', 'A boy with cotton in his ears frowns at the window.'),
      pg('👵', 'In the morning, Grandma Korkoi laughed. ‘Do not chase them,’ she said. ‘The boy frogs are singing to call the girl frogs. And a loud pond is a healthy pond.’ ‘Healthy?’ said Atsu.', 'A grandmother smiles at her grandson on the porch.'),
      pg('🦟', '‘Frogs eat insects, including mosquitoes,’ said Grandma. ‘And a frog has thin, soft skin that takes in water and air. So it needs clean water to live. When the water is spoiled, frogs go away.’', 'A frog catches a mosquito with its tongue beside a clean pond.'),
      pg('🗑️', 'A few weeks later, some people threw plastic bags and old bottles near the pond. Mud and rubbish drifted in. The water turned dull and smelly.', 'Plastic bags and bottles lie at the edge of a muddy pond.'),
      pg('🤫', 'That night, there was no ribbit. No song at all. The house was very quiet. But Atsu still could not sleep. Instead, he heard, ‘Zzzzz!’ Mosquitoes!', 'A boy lies awake in a quiet room, with a mosquito buzzing near his ear.'),
      pg('🧤', '‘I miss the frogs,’ said Atsu. ‘So let us help them,’ said Grandma. With gloves and a sack, and with two grown-ups watching, Atsu and his cousins picked up the rubbish from the edge. They did not go into the water.', 'Children in gloves put rubbish into a sack at the edge of a pond while adults watch.'),
      pg('🌧️', 'Months later, the rains came back, and the pond filled with clean water. One night, Atsu heard it again: ‘Ribbit! Ribbit!’ He smiled and slept like a log. The end.', 'A boy sleeps happily while frogs sing in a clean pond outside.'),
    ],
    activities: [
      { id: 'frog-c1', type: 'comprehension', afterPage: 3, question: 'Why do the boy frogs sing?', options: ['To call the girl frogs', 'To scare Atsu', 'To ask for food'], correctIndex: 0 },
      { id: 'frog-c2', type: 'comprehension', afterPage: 4, question: 'Why do frogs need clean water?', options: ['Their thin skin takes in water and air', 'They like bubbles', 'They dislike mud only'], correctIndex: 0 },
      { id: 'frog-ph', type: 'phonics', afterPage: 6, targetSound: 'fr', prompt: 'Which words start with the fr sound, like frog?', options: ['frog', 'fish', 'from', 'pond'], correctIndexes: [0, 2] },
      { id: 'frog-p1', type: 'prediction', afterPage: 7, prompt: 'Atsu and the grown-ups clean the rubbish. What might the frogs do? Tell a friend.', options: ['Come back when the water is clean', 'Never come back'] },
      { id: 'frog-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Atsu wants the frogs to be quiet.', 'Grandma tells him about frogs and clean water.', 'The pond is spoiled and the frogs go quiet.', 'Atsu helps clean the edge and the frogs return.'] },
      { id: 'frog-sel', type: 'sel', afterPage: 8, prompt: 'Atsu missed the frogs when they were gone. How do you feel when something you took for granted goes away?', feelingOptions: ['Sad', 'Thoughtful', 'Thankful', 'Determined'] },
    ],
    glossary: [
      { word: 'pond', definition: 'A small area of still water.', pages: [1, 5] },
      { word: 'mosquitoes', definition: 'Small flying insects that bite and can spread illness.', pages: [4, 6] },
      { word: 'healthy', definition: 'Well and strong, not ill.', pages: [3] },
      { word: 'rubbish', definition: 'Things that people throw away.', pages: [5, 7] },
    ],
    culturalNotes: ['Atsu, Grandma Korkoi and the cousins are invented. The story is set near a small pond in a village or town and names no real place.', 'The facts in the story are simple: male frogs call to attract females; frogs eat insects, including mosquitoes; frog skin is thin and takes in water and air, which makes frogs sensitive to pollution. The story says that a loud pond is “healthy”, which is a simplification: many frogs are a sign of a living pond, but not proof that it is perfectly clean.', 'Safety: the children clean the edge with gloves and adults watching, and do not go into the water. Teachers should remind children that pond water and rubbish can carry germs and that they should wash their hands afterwards. They should not touch unknown animals.'],
    reviewQuestions: ['Have a biologist or a science teacher check the statements about frog calls, diet and skin, and the simplification that a loud pond is a healthy one.', 'Check that the story does not suggest that mosquitoes are controlled by frogs alone, and add that covering water containers and using nets are also important.'],
    guide: {
      overview: 'A funny story that teaches why frogs sing, what they eat and why they need clean water. It shows how rubbish in a pond can change a whole community of living things.',
      lessonMinutes: 30,
      goals: ['Explain why frogs need clean water.', 'Describe what happens when a pond is spoiled.', 'Say one thing children can do to keep a place clean.'],
      subjects: [['Science', 'Living things and their habitats'], ['Language and Literacy', 'Vocabulary and sequencing'], ['Values', 'Responsibility']],
      before: ['Ask: have you heard frogs at night? What do they sound like?'],
      during: ['Let children croak softly on the frog pages and go silent on page 6.'],
      after: ['Draw a clean pond and a spoiled pond and label what lives in each.', 'Plan a litter pick in the school yard, with gloves and an adult.'],
      discussion: ['What did Atsu think about frogs at the start? What did he think at the end?', 'Why were there mosquitoes when the frogs went quiet?'],
      reflection: ['What small place near your home could you help to keep clean?'],
      support: ['Use a picture of a frog with arrows to its skin, eyes and tongue to talk about what the story says.'],
      stretch: ['Write a short letter from Atsu to the people who threw the rubbish, asking them to keep the pond clean.'],
      localise: ['Use the local name for frogs and the pond or stream near your school. Never let children go into ponds or touch unknown animals, and wash hands after clean-up.'],
      factCheck: [{ claim: 'Male frogs call to attract females; frogs eat insects including mosquitoes; frogs have thin skin that takes in water and air, which makes them sensitive to pollution.', explanation: 'Basic biology of frogs taught in primary and lower secondary science.', reference: 'A primary science textbook or a natural history resource (to verify).' }],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'okais-sack-garden',
    title: 'Okai’s Sack Garden',
    summary: 'Okai loves plants, but his family’s yard is tiny and covered in concrete. Uncle Doku shows him how to grow vegetables in an old sack filled with soil and compost. Okai waters, waits, picks, shares, and saves a few coins for more seeds. A story about growing food in a small space.',
    classIds: ['primary-2', 'primary-3'],
    ageMin: 7,
    ageMax: 9,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'family', 'realistic-fiction'],
    themes: ['farm-and-garden', 'family', 'food', 'money-and-enterprise'],
    objectives: ['perseverance', 'problem-solving', 'financial-literacy', 'scientific-curiosity'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names', 'local-food'],
    wpm: 100,
    paceWord: 'Warm and busy, with a proud lift at the first picking',
    palette: ['#15803d', '#b45309'],
    voice: 'An eager boy’s voice for Okai; a friendly, cheerful uncle’s voice',
    characters: [
      'Okai: a boy of eight with short hair, a green T-shirt and shorts, with soil on his hands.',
      'Uncle Doku: Okai’s uncle, a cheerful man in a cap and an old shirt, holding a spade.',
      'The sack garden: a large old sack standing upright in a sunny corner of a concrete yard, with young green plants growing from the top and holes in the sides.',
    ],
    music: 'A light, hopeful guitar tune with soft clapping (placeholder)',
    pages: [
      pg('🏠', 'Okai loved plants. But his family’s yard was tiny, and it was covered in concrete. ‘There is no place to plant,’ he sighed. ‘Where there is a will, there is a way,’ said Uncle Doku.', 'A boy stands in a small concrete yard looking up at his uncle.'),
      pg('👜', 'Uncle Doku found an old sack. ‘We can grow food in this,’ he said. He filled it with soil, mixed in some compost and put it in a sunny corner.', 'A man and a boy fill an old sack with soil in a sunny corner of a yard.'),
      pg('♻️', '‘What is compost?’ asked Okai. ‘It is old peelings and leaves that have rotted,’ said Uncle Doku. ‘It gives food to the soil, so the plants grow strong.’', 'A boy holds a handful of dark compost while his uncle points to a pile of peelings.'),
      pg('🌱', 'Okai made holes and planted tiny seeds. He pushed each seed into the soil with his finger. ‘Now we wait,’ said Uncle Doku. ‘And we water.’', 'A boy pushes seeds into the soil of a sack with his finger.'),
      pg('💧', 'Every morning, Okai gave the sack a little water. Plants need sun, water and soil. He checked each day for green shoots. On day six, there were tiny green leaves.', 'A boy waters a sack with a can while tiny shoots show in the soil.'),
      pg('🥬', 'After some weeks, the plants were big. Okai picked some leaves. Mama cooked them in a stew. ‘Delicious!’ said Papa. Okai washed the leaves well before cooking, just as Uncle Doku had taught him.', 'A boy picks green leaves from a sack garden while his mother holds a bowl.'),
      pg('🤝', 'There were many leaves. Okai shared some with the neighbour. She gave him a few coins as a thank-you. Okai put them in a tin. ‘For more seeds,’ he said.', 'A boy hands leaves to a neighbour and puts coins in a small tin.'),
      pg('🌿', 'Okai looked at his sack garden. It was small, but it was alive. ‘You do not need a big space to grow something good,’ he said. The end.', 'A boy sits beside his sack garden with a tin of coins in the evening sun.'),
    ],
    activities: [
      { id: 'sack-c1', type: 'comprehension', afterPage: 3, question: 'What is compost?', options: ['Rotted peelings and leaves that feed the soil', 'A kind of sack', 'A type of seed'], correctIndex: 0 },
      { id: 'sack-c2', type: 'comprehension', afterPage: 5, question: 'What do plants need to grow?', options: ['Sun, water and soil', 'Only noise', 'Only plastic'], correctIndex: 0 },
      { id: 'sack-ph', type: 'phonics', afterPage: 5, targetSound: 'sh', prompt: 'Which words have the sh sound, like shoots?', options: ['shoots', 'sack', 'shared', 'soil'], correctIndexes: [0, 2] },
      { id: 'sack-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Uncle Doku filled a sack with soil.', 'Okai planted the seeds.', 'Okai picked the leaves.', 'Okai put coins in a tin for more seeds.'] },
      { id: 'sack-sel', type: 'sel', afterPage: 8, prompt: 'Okai made a garden in a small space. How do you feel when you make something grow?', feelingOptions: ['Proud', 'Happy', 'Patient', 'Curious'] },
    ],
    glossary: [
      { word: 'compost', definition: 'Rotted peelings and leaves that feed the soil.', pages: [2, 3] },
      { word: 'sack', definition: 'A big bag made of strong cloth or plastic.', pages: [2] },
      { word: 'shoots', definition: 'The first small green parts of a plant that grow up out of the soil.', pages: [5] },
      { word: 'neighbour', definition: 'A person who lives near you.', pages: [7] },
    ],
    culturalNotes: ['Okai, Uncle Doku and the family are invented. Growing food in sacks, buckets or old containers is a common way for families with little land to grow vegetables. The story shows small steps: soil mixed with compost, seeds, daily water and a sunny spot.', 'The story does not name a particular vegetable, so that children can use what is grown locally. It does not give a number of days for sprouting beyond “day six” for these seeds; it does not promise that every seed will grow.', 'The story shows a little money coming from sharing, but it does not promise income. It reminds children to wash vegetables before cooking. Teachers should remind children to wash hands after touching soil and not to use sacks that have held chemicals.'],
    reviewQuestions: ['Have an agricultural extension officer check the sack-garden steps (soil with compost, a sunny corner, daily watering, holes for planting) and suggest suitable local plants and any cautions, such as drainage.', 'Check the safety advice about not using sacks that held chemicals and washing hands and vegetables.'],
    guide: {
      overview: 'A story about growing food in a small space with simple things. It shows planting, watering, patience, sharing and saving.',
      lessonMinutes: 30,
      goals: ['Say what plants need to grow.', 'Describe how to start a small garden in a container.', 'Say why Okai shared and saved.'],
      subjects: [['Science', 'Plants and growing'], ['Mathematics', 'Counting and money'], ['Career Technology', 'Gardening'], ['Language and Literacy', 'Sequencing']],
      before: ['Ask: what could you grow if you had only a small space?'],
      during: ['Let children mime each step: fill, mix, plant, water, pick.'],
      after: ['Plant seeds in a cup or old container with holes and water each day.', 'Record growth on a chart.'],
      discussion: ['Why did Uncle Doku put the sack in a sunny corner?', 'What did Okai do with the extra leaves?'],
      reflection: ['What could your family grow in a small space?'],
      maths: [{ task: 'Okai got 3 coins for his leaves and then 2 more. How many coins does he have?', answer: '3 + 2 = 5 coins.' }, { task: 'He plants 4 seeds on each side of a sack with 2 sides. How many seeds is that?', answer: '4 + 4 = 8 seeds.' }],
      support: ['Use picture cards for the steps.'],
      stretch: ['Write a list of what you need to start a container garden and what each item is for.'],
      localise: ['Use a vegetable common in your area. Check drainage and do not use sacks that held chemicals or fertiliser. Wash hands and vegetables.'],
      factCheck: [{ claim: 'Vegetables can be grown in sacks or containers filled with soil and compost, in a sunny spot with regular water.', explanation: 'A common small-space growing method used in many countries.', reference: 'A national agricultural extension leaflet or a gardening resource for urban farming (to verify).' }],
    },
  }),

  // 8 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'when-the-river-turned-brown',
    title: 'When the River Turned Brown',
    summary: 'Pomaa’s grandfather remembers a river so clear that he could count the stones. Now it is brown like cocoa. Her teacher explains that digging beside rivers sends mud into the water, that pits are dangerous, and that people dig for gold because they need money. Pomaa’s class plants trees on the river bank with adults. A gentle, honest story about a river and what children can do.',
    classIds: ['primary-3', 'primary-4'],
    ageMin: 8,
    ageMax: 10,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['realistic-fiction', 'educational', 'family'],
    themes: ['family', 'community', 'animals-and-habitats', 'citizenship'],
    objectives: ['environmental-awareness', 'responsibility', 'reasoning', 'kindness'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 105,
    paceWord: 'Quiet and thoughtful, with hope at the tree planting',
    palette: ['#92400e', '#16a34a'],
    voice: 'A thoughtful girl’s voice for Pomaa; a slow, warm grandfather’s voice; a clear, kind teacher’s voice',
    characters: [
      'Pomaa: a girl of nine with two plaits, a school uniform and a notebook.',
      'Grandfather: Pomaa’s grandfather, an elderly man in a plain cloth and a cap, sitting on a stool.',
      'Madam Nuku: the class teacher, in a bright dress, holding a picture of a river.',
      'The river: a wide river, brown and cloudy, with green trees on the far bank.',
    ],
    music: 'A slow, gentle flute tune that grows brighter at the tree planting (placeholder)',
    pages: [
      pg('🏞️', 'Pomaa sat by the river with her grandfather. The water was brown like cocoa. ‘When I was a boy,’ said Grandfather, ‘this water was so clear, I could count the stones at the bottom.’', 'A girl and her grandfather sit by a brown river at evening.'),
      pg('❓', '‘Why is it brown now?’ asked Pomaa. At school the next day, she asked Madam Nuku. ‘Good question,’ said the teacher. ‘Let us find out together.’', 'A girl raises her hand in class while a teacher holds a picture of a river.'),
      pg('⛏️', '‘Far up the river, some people dig for gold,’ said Madam Nuku. ‘When it rains, mud from the digging washes into the river. Mud makes the water cloudy. Plants get less light, and fish find it hard to live.’', 'A teacher draws mud washing from a dug area into a river on the board.'),
      pg('🤔', '‘Are the diggers bad people?’ asked Pomaa. ‘Many dig because they need money for food and school fees,’ said Madam Nuku. ‘Their need is real. But digging beside rivers hurts the river, and that hurts everyone who uses it.’', 'A teacher speaks gently to a class while a girl listens.'),
      pg('⚠️', '‘Listen carefully,’ said Madam Nuku. ‘Digging pits are dangerous, because the ground can fall. Never go near one. Never play or swim in brown water. Never drink river water, even if it looks clear. If you see a danger, tell a grown-up.’ Pomaa wrote it in her notebook.', 'A teacher points to a sign with a pit and a big cross while pupils write.'),
      pg('🌳', '‘What can children do?’ asked Pomaa. Madam Nuku smiled. ‘Trees can help. Their roots hold the soil like fingers holding sand, so rain washes less mud into the river. We can plant trees on the bank, with grown-ups.’', 'A teacher draws a tree with roots holding soil beside a river.'),
      pg('🌱', 'The next Saturday, Pomaa’s class planted young trees along a safe part of the river bank. Grown-ups dug the holes, and the children watered each tree. Grandfather watched and clapped. ‘I wish I had done this when I was young,’ he said.', 'Children and adults plant young trees on a river bank while a grandfather watches.'),
      pg('🌟', 'The river was still brown. The trees were tiny, and it would take years. ‘But grown-ups are also making rules and helping people find other jobs,’ said Madam Nuku. ‘Each little tree is a start.’ Pomaa smiled and patted the soil. The end.', 'A girl pats the soil around a young tree beside a brown river.'),
    ],
    activities: [
      { id: 'brown-c1', type: 'comprehension', afterPage: 3, question: 'What makes the river brown, according to Madam Nuku?', options: ['Mud from digging washed in by rain', 'Cocoa powder', 'Paint'], correctIndex: 0 },
      { id: 'brown-c2', type: 'comprehension', afterPage: 5, question: 'What should a child do if they see a danger near the river?', options: ['Tell a grown-up', 'Go closer to look', 'Swim in the water'], correctIndex: 0 },
      { id: 'brown-ph', type: 'phonics', afterPage: 6, targetSound: 'br', prompt: 'Which words start with the br sound, like brown?', options: ['brown', 'bank', 'bring', 'bright'], correctIndexes: [0, 2, 3] },
      { id: 'brown-p1', type: 'prediction', afterPage: 6, prompt: 'The class will plant trees by the river. How might trees help? Tell a friend.', options: ['Their roots hold the soil', 'They make the river wider'] },
      { id: 'brown-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Pomaa saw the brown river with her grandfather.', 'Madam Nuku explained why it was brown.', 'The teacher taught safety rules.', 'The class planted trees on the bank.'] },
      { id: 'brown-sel', type: 'sel', afterPage: 8, prompt: 'Pomaa felt that even a little tree is a start. How do you feel about helping a river?', feelingOptions: ['Hopeful', 'Caring', 'Sad', 'Determined'] },
    ],
    glossary: [
      { word: 'river', definition: 'A large stream of water that flows to the sea.', pages: [1, 3, 6] },
      { word: 'mud', definition: 'Wet soft earth.', pages: [3, 6] },
      { word: 'pits', definition: 'Deep holes dug in the ground.', pages: [5] },
      { word: 'roots', definition: 'The parts of a plant that grow down into the soil.', pages: [6] },
    ],
    culturalNotes: ['Pomaa, Grandfather and Madam Nuku are invented, and the river is not named. This is a gentle version for younger children of the story of a river changed by digging for gold. It does not blame the people who dig and it does not give details of how mining is done.', 'The facts in the story are simple: digging near rivers washes soil into the water; mud makes water cloudy, which reduces the light that plants get and can harm fish; tree roots hold soil; pits can collapse. Safety rules are stated clearly: never go near pits, never play or swim in brown water, never drink river water, tell a grown-up about dangers.', 'The last page says that grown-ups are making rules and helping people find other jobs. This reflects the older stories in Batches 21 to 24 but does not claim that the problem is solved; the story tells children that it will take years.'],
    reviewQuestions: ['Have a water or environmental specialist check the statements about mud, light, fish and tree roots, and the simplification that digging near rivers is the cause of this river’s colour.', 'Check that the safety rules and the tone toward people who dig are appropriate, and that children in mining communities will not feel blamed.'],
    guide: {
      overview: 'A gentle story for younger children about a river changed by mud. It teaches simple causes, firm safety rules and one small thing children can do with adults.',
      lessonMinutes: 30,
      goals: ['Say why a river can turn brown.', 'Repeat three safety rules about rivers and pits.', 'Say how trees can help a river bank.'],
      subjects: [['Science', 'Water and living things'], ['Social Studies', 'Community and environment'], ['Language and Literacy', 'Sequencing and new words']],
      before: ['Ask: have you seen a river or stream? What colour was it?'],
      during: ['Pause on page 5 and say the three safety rules together.'],
      after: ['Draw a river bank with trees and label the roots, soil and water.', 'Plan a tree-planting day with adults on a safe part of the school grounds.'],
      discussion: ['Why do some people dig for gold?', 'How can trees help a river?'],
      reflection: ['What will you do if you see a danger near water?'],
      support: ['Use a sand tray and cups of water to show how rain washes soil, and how roots (sticks or string) hold it, with an adult supervising.'],
      stretch: ['Write three sentences telling a friend how to stay safe near a river.'],
      localise: ['Use your local river or stream. If your community is affected by digging, speak sensitively, because some children’s families may work in it. Never take children near pits, deep water or fast-moving streams.'],
      factCheck: [{ claim: 'Digging near rivers can wash soil into the water, which makes it cloudy and can harm plants and fish; tree roots help to hold soil in place.', explanation: 'Basic environmental science and widely reported effects of mining near rivers.', reference: 'A primary science textbook or a Ghana Water Resources Commission or EPA resource (to verify).' }],
    },
  }),
];

