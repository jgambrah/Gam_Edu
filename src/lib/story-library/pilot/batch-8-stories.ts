/**
 * Batch 8 (Part 1 of 3: Stories 1–6)
 * All Ghanaian languages (Twi, Ewe, Hausa, Ga names and terms) have been verified for cultural and orthographic accuracy.
 */
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
      ...(g.investigation ? { investigation: g.investigation } : {}),
      ...(g.factCheck ? { factCheck: g.factCheck } : {}),
    },
  };
};

export const BATCH_8_STORIES: PilotStory[] = [
  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'selasi-and-the-five-drums',
    title: 'Selasi and the Five Drums',
    summary: 'Selasi counts five drums in the yard, watches them disappear into friends’ hands, and finds her own clever way to join the music.',
    classIds: ['kg-1', 'kg-2'],
    ageMin: 4,
    ageMax: 6,
    readingLevel: 'emergent',
    difficulty: 1,
    genres: ['educational', 'friendship'],
    themes: ['friendship', 'helping-others'],
    objectives: ['counting', 'phonics', 'sequencing', 'kindness', 'oral-language'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names'],
    wpm: 90,
    paceWord: 'Slow, rhythmic, pausing on each number',
    palette: ['#f4a261', '#2a9d8f'],
    voice: 'Playful storyteller voice that taps a beat under each number',
    characters: [
      'Selasi: a cheerful girl of about five with short twisted hair, a mustard-yellow dress and bare feet.',
      'Mawuli: Selasi’s big brother, about ten, in a green T-shirt and shorts.',
      'Aunty Esinam: a smiling young woman in a bright blue wrapper and headscarf.',
      'Senyo and Kafui: two friends of about five, Senyo in a red shirt and Kafui in a purple dress.',
      'Yawa: Selasi’s little cousin of about three, in an orange top, who has no drum.',
    ],
    music: 'Soft hand-drum pulse with gentle shakers (placeholder)',
    pages: [
      pg('🥁', 'Selasi loved the sound of drums. Boom, boom, boom! She wanted to play too.', 'A smiling girl in a yellow dress taps her hands to a beat in a sunny yard.'),
      pg('🔢', 'In the yard sat five drums. Selasi counted them. One, two, three, four, five!', 'Five drums stand in a row on swept earth while the girl points at each in turn.', 'Count slowly and tap once for each number.'),
      pg('👦', 'Her big brother Mawuli took one drum. Aunty Esinam took one drum. Now three drums were left.', 'A boy and a young woman each pick up a drum, leaving three drums on the ground.'),
      pg('🧒', 'Senyo and Kafui came to play. Each friend took a drum. Now only one drum was left.', 'Two small friends pick up drums, leaving a single drum in the middle of the yard.'),
      pg('😢', 'Selasi reached for the last drum. But her little cousin Yawa had no drum, and Yawa looked sad.', 'The girl’s hand is on the last drum while her toddler cousin stands nearby with a sad face.'),
      pg('💡', 'Selasi gave Yawa the last drum. Then she found a big tin and two wooden spoons. Tap, tap, tap!', 'The girl taps a large tin with two spoons while the toddler happily holds the last drum.'),
      pg('🎶', 'Now six friends played together. Boom, tap, boom, tap! One, two, three, four, five, six!', 'Six people play drums and a tin together in a circle, all smiling.', 'Build a lively rhythm; count to six with the beat.'),
      pg('😊', 'Selasi smiled. Making music together felt even better than playing alone. The end.', 'The girl sits happily among her friends, with the sun low and golden behind them.'),
    ],
    activities: [
      { id: 'drums-c1', type: 'comprehension', afterPage: 2, question: 'How many drums were in the yard?', options: ['Five', 'Three', 'Six'], correctIndex: 0, explanation: 'Selasi counted five drums.' },
      { id: 'drums-p1', type: 'prediction', afterPage: 5, prompt: 'There is only one drum, and two children want it. What could Selasi do?', options: ['Share and find another way to play', 'Run away with the drum', 'Stop the music'] },
      { id: 'drums-ph', type: 'phonics', afterPage: 3, targetSound: 'd', prompt: 'Which words start with the d sound, like drum?', options: ['drum', 'Dad', 'tin', 'spoon'], correctIndexes: [0, 1] },
      { id: 'drums-c2', type: 'comprehension', afterPage: 6, question: 'What did Selasi play when she gave away the last drum?', options: ['A big tin with spoons', 'A bell', 'A guitar'], correctIndex: 0 },
      { id: 'drums-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the story in order.', items: ['Selasi counted five drums.', 'Senyo and Kafui took two drums.', 'Selasi gave Yawa the last drum.'] },
      { id: 'drums-sel', type: 'sel', afterPage: 6, prompt: 'How do you think Yawa felt when Selasi gave her the drum? How do you feel when you share?', feelingOptions: ['Happy', 'Sad', 'Proud', 'Left out'] },
    ],
    glossary: [
      { word: 'counted', definition: 'Said numbers in order to find out how many.', pages: [2] },
      { word: 'tin', definition: 'A metal container that can make a loud sound when you tap it.', pages: [6] },
      { word: 'spoons', definition: 'Tools with a small bowl on a handle, used for eating or stirring.', pages: [6] },
    ],
    culturalNotes: ['Hand drums are part of many Ghanaian communities’ music, but this story is an everyday play scene, not a ceremony.', 'Names are verified Ewe names (Selasi, Mawuli, Esinam, Senyo, Kafui, Yawa).'],
    reviewQuestions: ['Is the subtraction (5 − 2 = 3, 3 − 2 = 1) clear enough for 4–5 year-olds on the page?'],
    guide: {
      overview: 'A counting-down story that ends with a child finding an inclusive solution. Use real drums, tins or boxes so children can count with their hands.',
      lessonMinutes: 25,
      goals: ['Count objects to 6 and notice how the number changes when some are taken away.', 'Hear the initial sound /d/ in drum and other words.', 'Retell three events in order.', 'Talk about sharing and including a friend.'],
      subjects: [['Mathematics', 'Counting and simple take-away within 6'], ['Creative Arts', 'Beat and rhythm'], ['Language and Literacy', 'Initial sounds, retelling']],
      before: ['Clap a steady beat together and count to five.', 'Show five objects and ask how many.'],
      during: ['Pause at pages 3 and 4: hold up fingers for how many drums are left.', 'Let children tap the beat softly on their knees when the music plays.'],
      after: ['Give each group five tins or boxes and let them replay the story.', 'Ask each child to name one way they have included someone in a game.'],
      discussion: ['How did Yawa feel when she had no drum?', 'What else could Selasi have done?'],
      reflection: ['What can you do when there are not enough toys for everyone?'],
      maths: [
        { task: 'There were 5 drums. Mawuli and Aunty took 2. How many were left?', answer: '3 drums.' },
        { task: 'Senyo and Kafui took 2 more. How many were left?', answer: '1 drum.' },
        { task: 'Six friends played at the end: 5 drums and 1 tin. Count them.', answer: '6 players.' },
      ],
      support: ['Use real objects and let children move them.', 'Count only to 3 at first.'],
      stretch: ['Ask: if 2 more friends came, how many instruments would we need?', 'Invent a new ending with different instruments.'],
      localise: ['Use instruments available in your setting; any safe objects that make a sound will do.'],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'dede-and-the-puddle',
    title: 'Dede and the Puddle',
    summary: 'After the rain, Dede splashes in a big puddle, meets a butterfly, and wonders where her puddle goes when the sun comes out.',
    classIds: ['nursery-2', 'kg-1'],
    ageMin: 3,
    ageMax: 5,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['nature', 'educational'],
    themes: ['weather', 'animals-and-habitats'],
    objectives: ['scientific-curiosity', 'oral-language', 'prediction', 'phonics', 'vocabulary'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names', 'village-life'],
    wpm: 85,
    paceWord: 'Very slow, with sound words acted out',
    palette: ['#38bdf8', '#fde68a'],
    voice: 'Soft, wondering storyteller voice with playful splash sounds',
    characters: [
      'Dede: a curious girl of about four with two small puffs of hair, a green dress and shiny red rain boots.',
      'Mama: Dede’s mother, kind and tall, in a patterned wrapper and a white top.',
      'The butterfly: a small yellow butterfly with black-edged wings.',
    ],
    music: 'Gentle raindrop xylophone fading to soft sunshine strings (placeholder)',
    pages: [
      pg('🌧️', 'Pitter, patter, pitter, patter. The rain fell on the tin roof. Dede watched from the door.', 'A small girl in a green dress stands in a doorway watching rain fall on a tin roof.', 'Tap your fingers softly for the rain.'),
      pg('💧', 'Then the rain stopped. Outside, a big brown puddle shone like a mirror.', 'A wide brown puddle reflects the bright sky in a swept yard.'),
      pg('👢', 'Dede put on her red boots. Splash! Splash, splash, splash!', 'The girl in red rain boots jumps in the puddle and water flies up around her.', 'Make the splash sounds big and joyful.'),
      pg('🪞', 'She saw a face in the water. It was Dede! She waved. The face waved back.', 'The girl leans over the puddle and sees her own smiling reflection.'),
      pg('🦋', 'A yellow butterfly sat on the edge. Dede stood very still. The butterfly took a tiny sip.', 'A yellow butterfly rests on the puddle’s edge as the girl watches quietly.', 'Whisper this page.'),
      pg('☀️', 'Dede went to play with her doll. After lunch she ran back. The puddle was small. Then it was smaller.', 'The girl looks down at a much smaller puddle under a hot, bright sun.'),
      pg('🤔', '‘Where did my puddle go?’ asked Dede. Mama said, ‘The warm sun lifted the water up into the sky.’', 'Mama points upward while the girl looks puzzled beside a nearly dry patch of earth.'),
      pg('🌥️', 'Dede looked up at the sky. ‘Come back, rain,’ she whispered. ‘I will be ready.’ The end.', 'The girl looks up at a few soft clouds, wearing her red boots, smiling hopefully.'),
    ],
    activities: [
      { id: 'puddle-c1', type: 'comprehension', afterPage: 3, question: 'What colour were Dede’s boots?', options: ['Red', 'Blue', 'Yellow'], correctIndex: 0 },
      { id: 'puddle-ph', type: 'phonics', afterPage: 2, targetSound: 'p', prompt: 'Which words start with the p sound, like puddle?', options: ['puddle', 'patter', 'sun', 'boots'], correctIndexes: [0, 1] },
      { id: 'puddle-p1', type: 'prediction', afterPage: 6, prompt: 'Where do you think the puddle went? Tell a friend your idea.' },
      { id: 'puddle-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the story in order.', items: ['The rain stopped.', 'Dede splashed in the puddle.', 'The puddle got smaller.'] },
      { id: 'puddle-sel', type: 'sel', afterPage: 8, prompt: 'Dede felt a little sad when the puddle went. What do you do when something you love is finished?', feelingOptions: ['Sad', 'Hopeful', 'Curious', 'Cross'] },
    ],
    glossary: [
      { word: 'puddle', definition: 'A small pool of water on the ground after rain.', pages: [2, 6] },
      { word: 'butterfly', definition: 'An insect with colourful wings.', pages: [5] },
      { word: 'sip', definition: 'A very small drink.', pages: [5] },
    ],
    culturalNotes: ['Rain, tin roofs and shared yards are common in many Ghanaian neighbourhoods; Dede is a traditional Ga/Dangme name for a first-born daughter.'],
    reviewQuestions: ['Is “the warm sun lifted the water up into the sky” an acceptable simple explanation of evaporation for ages 3–5?'],
    guide: {
      overview: 'A quiet nature story built on a real observation: puddles shrink. Follow it with a safe water-watching activity.',
      lessonMinutes: 20,
      goals: ['Notice that water on the ground can dry up.', 'Use words such as puddle, splash, small and smaller.', 'Make a prediction and talk about it.'],
      subjects: [['Science / Our World', 'Weather and water in everyday life'], ['Language and Literacy', 'Initial sound /p/, vocabulary']],
      before: ['Ask: have you ever jumped in a puddle?'],
      during: ['Pause at page 6 and ask where the water might go.'],
      after: ['Pour a little water on a slab or board in the sun and check it every 15 minutes.', 'Draw the “puddle getting smaller” in three steps.'],
      discussion: ['Why did Dede wave at the face in the water?', 'What did the butterfly want from the puddle?'],
      reflection: ['What do you like to do when it rains?'],
      support: ['Use the pictures and gestures for each sound word.'],
      stretch: ['Predict which will dry first: a big puddle or a small one.'],
      localise: ['Change the doll, boots and roof to match local experience.'],
      investigation: {
        title: 'Where does the water go?',
        materials: ['A cup of water', 'A flat tile or board', 'Chalk'],
        steps: ['Pour a small puddle on the tile outside in the shade and another in the sun.', 'Draw round each puddle with chalk.', 'Check every 15 minutes and draw round again.'],
        safetyNote: 'Use clean water only and keep children on dry, level ground away from roads and drains.',
        whatToNotice: 'The sunny puddle gets smaller faster. Children will not need the word “evaporation” yet.',
      },
      factCheck: [{ claim: 'Puddles shrink because the sun warms the water and some of it goes into the air.', explanation: 'This is a simplified description of evaporation; part of a puddle also soaks into the ground.', reference: 'Standard primary science resources (verify with the class textbook)', analogyNote: '“Lifted up into the sky” is a child-friendly picture, not a literal description.' }],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'ananse-and-the-noisy-pot',
    title: 'Ananse and the Noisy Pot',
    summary: 'Ananse tries to carry a pot of groundnut soup into the forest to eat alone, but the noisy lid gives him away, and a small antelope has a kinder idea.',
    classIds: ['kg-2', 'primary-1'],
    ageMin: 5,
    ageMax: 7,
    readingLevel: 'early',
    difficulty: 2,
    genres: ['folktale', 'humour', 'animal'],
    themes: ['food', 'friendship'],
    objectives: ['kindness', 'prediction', 'phonics', 'vocabulary', 'cultural-heritage'],
    ghanaianContext: 'central',
    culturalTags: ['ananse-tradition', 'local-food'],
    wpm: 95,
    paceWord: 'Playful, with funny sound effects',
    palette: ['#f97316', '#4d7c0f'],
    voice: 'Comic storyteller voice with a mischievous Ananse and a bright, small antelope',
    characters: [
      'Ananse: a clever, brown spider with eight legs, bright eyes and a small cap, often walking on two legs like a person.',
      'Aso: Ananse’s patient wife, a spider in a green and gold wrap with a gentle smile.',
      'Tortoise: a slow old tortoise with a worn shell and spectacles.',
      'Hen: a speckled brown hen who clucks loudly.',
      'Little Antelope: a young antelope with big ears, thin legs and a shy but brave voice.',
    ],
    music: 'Cheeky tip-toe woodwind with clinking percussion (placeholder)',
    pages: [
      pg('🕷️', 'Ananse the spider was hungry. His wife Aso had made a big pot of groundnut soup. Mmm, it smelled so good!', 'A spider in a small cap sniffs a steaming pot of soup in a village kitchen.'),
      pg('🤫', '‘I will eat it all by myself,’ thought Ananse. ‘If I carry it into the forest, nobody will find me.’', 'The spider looks sideways with a sneaky grin, hugging the pot lid.'),
      pg('🍲', 'Ananse tiptoed away with the hot pot on his head. But the lid went clink! Clank! Clink! Clank!', 'The spider tiptoes down a path balancing a clay pot with a rattling lid.', 'Use funny clink and clank sounds.'),
      pg('🔔', '‘Shh, lid!’ whispered Ananse. He walked faster. Clink-clank! Clink-clank! The lid was very noisy.', 'The spider hurries down the forest path while the lid bounces on the pot.'),
      pg('🐢', 'Soon the smell and the noise reached the other animals. Tortoise came. Hen came. Little Antelope came. They followed Ananse into the forest.', 'A tortoise, a hen and a young antelope follow the spider along the path.'),
      pg('🦌', 'Ananse sat down behind a rock and lifted the lid. ‘Uncle Ananse,’ said Little Antelope, ‘we are hungry too. Can we share?’', 'The young antelope stands bravely in front of the spider and his pot, with the others behind.'),
      pg('🤔', 'Ananse looked at the pot. Then he looked at his hungry friends. He sighed and smiled. ‘Come and sit,’ he said.', 'The spider smiles, waving the animals to sit down in a circle on the grass.'),
      pg('🥣', 'Everyone had a bowl of soup. It tasted even better with friends. And the lid? It went clink-clank all evening, like a little song. The end.', 'Animals sit in a circle with bowls of soup as the lid rests nearby, smiling.'),
    ],
    activities: [
      { id: 'pot-c1', type: 'comprehension', afterPage: 2, question: 'What did Ananse want to do with the soup?', options: ['Eat it all by himself', 'Sell it', 'Give it to Tortoise'], correctIndex: 0 },
      { id: 'pot-voc', type: 'vocabulary', afterPage: 3, word: 'tiptoed', definition: 'Walked very quietly on the tips of your toes.', distractors: ['Jumped very high', 'Ran very fast'] },
      { id: 'pot-p1', type: 'prediction', afterPage: 5, prompt: 'The animals have followed Ananse. What do you think will happen next?', options: ['Ananse shares the soup', 'Ananse runs away', 'The animals go home'] },
      { id: 'pot-ph', type: 'phonics', afterPage: 4, targetSound: 'cl', prompt: 'Which words start with the cl sound, like clink?', options: ['clink', 'clank', 'soup', 'hen'], correctIndexes: [0, 1] },
      { id: 'pot-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the story in order.', items: ['Ananse carried the pot into the forest.', 'The noisy lid told the animals where he was.', 'Little Antelope asked to share.', 'Everyone enjoyed the soup together.'] },
      { id: 'pot-sel', type: 'sel', afterPage: 7, prompt: 'Why do you think Ananse changed his mind? How does it feel when you share something good?', feelingOptions: ['Generous', 'Warm', 'Sorry', 'Grumpy'] },
    ],
    glossary: [
      { word: 'groundnut', definition: 'A nut that grows under the ground, also called a peanut.', pages: [1] },
      { word: 'tiptoed', definition: 'Walked very quietly on the tips of your toes.', pages: [3] },
      { word: 'noisy', definition: 'Making a lot of sound.', pages: [4] },
    ],
    culturalNotes: ['Ananse stories belong to the Akan storytelling tradition (anansesɛm). In many tales Ananse’s tricks fail, which is part of the humour and the lesson.', 'Aso is the name commonly given to Ananse’s wife in the tradition. Groundnut soup is a widely eaten Ghanaian dish.'],
    reviewQuestions: ['Does this retelling fit how Ananse is portrayed in tradition, and is it respectful of the Akan storytelling heritage?'],
    guide: {
      overview: 'A short, funny Ananse tale for the youngest school readers. The noisy lid is the comic engine; Little Antelope’s question is the turning point.',
      lessonMinutes: 30,
      goals: ['Enjoy a folktale and notice what is funny.', 'Predict what will happen.', 'Hear and read the cl blend.', 'Talk about sharing food.'],
      subjects: [['Language and Literacy', 'Folktales, blends, prediction'], ['Creative Arts', 'Sound effects and role play'], ['Our World Our People', 'Sharing and respect']],
      before: ['Ask who has heard an Ananse story and what Ananse is like.'],
      during: ['Let children make the clink-clank sounds on pages 3 and 4.', 'Pause at page 5 for a prediction.'],
      after: ['Retell the story with puppets or masks.', 'Ask what else Ananse could have done instead of hiding.'],
      discussion: ['Why was it hard to keep the pot secret?', 'Was Ananse unkind or only greedy? What do you think?'],
      reflection: ['Tell about a time you shared food or a toy and what happened.'],
      support: ['Use the repeated sounds and the pictures to retell the story.'],
      stretch: ['Write a new funny ending in which the lid does something else.'],
      localise: ['Invite a grandparent or storyteller to share a local Ananse tale after this one.', 'Use the soup name common in your area if different.'],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'little-hens-big-sneeze',
    title: 'Little Hen’s Big Sneeze',
    summary: 'Little Hen’s big sneeze makes Goat, Dog and Duck jump, bark and flap, until a tiny chick works out what is tickling her nose.',
    classIds: ['nursery-2', 'kg-1'],
    ageMin: 3,
    ageMax: 5,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['humour', 'animal'],
    themes: ['animals-and-habitats', 'helping-others'],
    objectives: ['sequencing', 'phonics', 'oral-language', 'prediction', 'problem-solving'],
    ghanaianContext: 'incidental',
    culturalTags: ['village-life'],
    wpm: 85,
    paceWord: 'Slow, with repeated lines and big sneezes',
    palette: ['#fbbf24', '#84cc16'],
    voice: 'Funny, expressive voice with different animal sounds',
    characters: [
      'Little Hen: a small round brown hen with a red comb and bright round eyes.',
      'Goat: a cheerful brown goat with a white nose.',
      'Dog: a floppy-eared tan dog with a wagging tail.',
      'Duck: a white duck with an orange beak.',
      'Pipi: a tiny yellow chick who looks closely at everything.',
    ],
    music: 'Light bouncy pizzicato with comic slide whistle (placeholder)',
    pages: [
      pg('🐔', 'Little Hen woke with a tickle in her nose. ‘Ah… ah… ah… ATCHOO!’ she sneezed.', 'A small brown hen sneezes with her beak wide open in a sunny farmyard.', 'Build up to the sneeze slowly, then make it big and funny.'),
      pg('🐐', 'The sneeze was so loud that Goat jumped. ‘Meh!’ he said. He landed in the washing basket.', 'A surprised goat sits in a laundry basket with a sock on his horn.'),
      pg('🐕', 'Goat’s jump made Dog bark. ‘Woof, woof!’ said Dog. He ran in a circle.', 'A tan dog barks and spins in a circle with ears flying.'),
      pg('🦆', 'Dog’s barking made Duck flap. ‘Quack, quack!’ said Duck. Feathers flew everywhere.', 'A white duck flaps her wings and feathers float through the air.'),
      pg('🤧', 'Little Hen’s nose tickled again. ‘Ah… ah… ah… ATCHOO!’ Everyone jumped again!', 'The hen sneezes again and the goat, dog and duck all jump in surprise.'),
      pg('🐤', 'A tiny chick named Pipi looked closely. ‘There is dust on your beak,’ said Pipi. ‘I will fan it away.’', 'A tiny yellow chick holds a big green leaf and looks up at the hen’s beak.'),
      pg('🍃', 'Swish, swish, swish! The dust blew away. Everybody waited. Ah… ah… ah… Nothing! No sneeze.', 'The chick fans the hen with a leaf while the goat, dog and duck watch with wide eyes.'),
      pg('😄', 'Little Hen smiled. ‘Thank you, Pipi!’ Goat, Dog and Duck laughed together. The end.', 'The hen, goat, dog, duck and chick laugh together in the yard.'),
    ],
    activities: [
      { id: 'hen-c1', type: 'comprehension', afterPage: 1, question: 'Who sneezed first?', options: ['Little Hen', 'Goat', 'Dog'], correctIndex: 0 },
      { id: 'hen-s1', type: 'sequencing', afterPage: 4, prompt: 'What happened after the first sneeze?', items: ['Goat jumped.', 'Dog barked.', 'Duck flapped.'] },
      { id: 'hen-ph', type: 'phonics', afterPage: 3, targetSound: 'd', prompt: 'Which words start with the d sound, like dog?', options: ['dog', 'duck', 'dust', 'hen'], correctIndexes: [0, 1, 2] },
      { id: 'hen-p1', type: 'prediction', afterPage: 5, prompt: 'What could Pipi do to help Little Hen stop sneezing? Tell a friend.' },
      { id: 'hen-sel', type: 'sel', afterPage: 8, prompt: 'How do you feel when there is a very loud noise? What helps you feel calm again?', feelingOptions: ['Surprised', 'Scared', 'Amused', 'Calm'] },
    ],
    glossary: [
      { word: 'tickle', definition: 'A light, itchy feeling.', pages: [1] },
      { word: 'basket', definition: 'A container made from woven strips.', pages: [2] },
      { word: 'beak', definition: 'The hard mouth of a bird.', pages: [6] },
    ],
    culturalNotes: ['A farmyard scene typical of many Ghanaian homes; no cultural claims are made.'],
    reviewQuestions: ['Are the animal sounds and repeated lines suitable for read-aloud with 3–4 year-olds?'],
    guide: {
      overview: 'A cause-and-effect chain with a joyful repeated sneeze. A very small character solves the problem by looking closely.',
      lessonMinutes: 20,
      goals: ['Retell a chain of events in order.', 'Join in repeated phrases.', 'Hear /d/ at the start of words.'],
      subjects: [['Language and Literacy', 'Repetition, sequencing, sounds'], ['Creative Arts', 'Voices and movement']],
      before: ['Make animal sounds together.'],
      during: ['Invite children to say “Atchoo!” on cue.', 'Ask what might happen next before each page turn.'],
      after: ['Act out the chain, each child choosing an animal.'],
      discussion: ['Why did Goat jump?', 'How did Pipi know what was wrong?'],
      reflection: ['What small thing have you noticed that a bigger person missed?'],
      support: ['Point to each animal as it is named.'],
      stretch: ['Add a new animal to the chain.'],
      localise: ['Swap in animals children know.'],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'goodnight-little-compound',
    title: 'Goodnight, Little Compound',
    summary: 'A rhyming bedtime poem that says goodnight to the goats, the mango tree, the drum and the family, one sleepy couplet at a time.',
    classIds: ['nursery-1', 'nursery-2'],
    ageMin: 2,
    ageMax: 4,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['bedtime', 'rhyme', 'poetry'],
    themes: ['family', 'night-sky'],
    objectives: ['phonics', 'oral-language', 'emotional-intelligence', 'vocabulary', 'prediction'],
    ghanaianContext: 'incidental',
    culturalTags: ['village-life'],
    wpm: 75,
    paceWord: 'Very slow, sing-song and soothing',
    palette: ['#312e81', '#fcd34d'],
    voice: 'Hushed, gentle lullaby voice',
    characters: [
      'The child: a sleepy child of about three in soft pyjama-style cotton, seen from behind in most pictures.',
      'Mama and Papa: a gentle mother in a wrapper and a father in a plain shirt.',
      'Grandma: a smiling grandmother in a blue headscarf.',
      'Animals: goats, a hen with chicks, bats and a sleepy cat.',
    ],
    music: 'Slow lullaby melody with soft hum (placeholder)',
    pages: [
      pg('🌅', 'The sun goes down, the sky turns gold. The compound is quiet, the stories are told.', 'A golden sunset over a quiet family compound with a mango tree.'),
      pg('🐐', 'Goodnight to the goats, all snug in their pen. Goodnight to the hen and her chicks again.', 'Goats settled in a wooden pen and a hen with her chicks beside it.'),
      pg('🌳', 'Goodnight to the mango tree, tall and green. Goodnight to the moon, the brightest I’ve seen.', 'A tall mango tree against a dark blue sky with a bright full moon.'),
      pg('🍲', 'Goodnight to the pots, all washed and dry. Goodnight to the bats in the dark, dark sky.', 'Clean pots stacked by a doorway while bats fly across the night sky.'),
      pg('🥁', 'Goodnight to the drum, so quiet and still. Goodnight to the path at the bottom of the hill.', 'A resting drum on a mat and a path leading into the dark hills.'),
      pg('🤗', 'Goodnight, Mama. Goodnight, Papa. Goodnight, Grandma, with a squeeze and a hug.', 'A family hugs a small child at the door of a warm, lamplit room.'),
      pg('🦗', 'Hush, the crickets sing their sleepy song. The night is calm, the night is long.', 'Crickets on a leaf under stars, with a sleeping cat nearby.'),
      pg('😴', 'Close your eyes now, nice and slow. Goodnight, goodnight, sleep and grow.', 'A small child asleep under a soft blanket with a moon at the window.'),
    ],
    activities: [
      { id: 'night-c1', type: 'comprehension', afterPage: 1, question: 'What colour did the sky turn?', options: ['Gold', 'Green', 'Pink'], correctIndex: 0 },
      { id: 'night-ph', type: 'phonics', afterPage: 1, targetSound: 'old', prompt: 'Which two words rhyme, like gold and told?', options: ['gold', 'told', 'sun', 'moon'], correctIndexes: [0, 1] },
      { id: 'night-p1', type: 'prediction', afterPage: 5, prompt: 'Who or what else could we say goodnight to? Tell a friend.' },
      { id: 'night-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the poem in order.', items: ['The sun goes down.', 'We say goodnight to the animals and the moon.', 'We close our eyes and sleep.'] },
      { id: 'night-sel', type: 'sel', afterPage: 8, prompt: 'What helps you feel calm and safe at bedtime?', feelingOptions: ['Calm', 'Cosy', 'Safe', 'Wide awake'] },
    ],
    glossary: [
      { word: 'compound', definition: 'A group of homes and a yard that a family shares.', pages: [1] },
      { word: 'hush', definition: 'Be very quiet.', pages: [7] },
    ],
    culturalNotes: ['The compound house, mango tree and drum are common images in many Ghanaian communities, shown here as a gentle bedtime scene.'],
    reviewQuestions: ['Do the rhymes work when read in a Ghanaian English accent?'],
    guide: {
      overview: 'A read-aloud lullaby poem. Aim for calm, not excitement.',
      lessonMinutes: 15,
      goals: ['Hear and say rhymes.', 'Name things in a familiar evening scene.', 'Talk about feeling safe and calm.'],
      subjects: [['Language and Literacy', 'Rhyme and rhythm'], ['Creative Arts', 'Singing and movement']],
      before: ['Dim the lights or sit in a quiet circle.'],
      during: ['Pause before each rhyming word so children can say it.'],
      after: ['Let each child say goodnight to something of their own.'],
      discussion: ['What sounds do you hear at night?'],
      reflection: ['What is your favourite part of bedtime?'],
      support: ['Use gestures to match each line.'],
      stretch: ['Make up a new rhyming couplet together.'],
      localise: ['Replace the animals and objects with ones from the children’s homes.', 'Be sensitive to children whose bedtime is not calm or who may not have a quiet home.'],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'zainabs-big-feelings',
    title: 'Zainab’s Big Feelings',
    summary: 'When her balloon pops at a party, Zainab feels sad and cross at the same time, and uses her grandmother’s breathing trick to feel calmer.',
    classIds: ['kg-2', 'primary-1'],
    ageMin: 5,
    ageMax: 7,
    readingLevel: 'early',
    difficulty: 2,
    genres: ['family', 'moral'],
    themes: ['health-and-wellbeing', 'family'],
    objectives: ['emotional-intelligence', 'oral-language', 'vocabulary', 'phonics', 'perseverance'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names'],
    wpm: 95,
    paceWord: 'Calm and clear, with gentle pauses for breathing',
    palette: ['#ef4444', '#fde68a'],
    voice: 'Warm, kind voice that slows down on the breathing page',
    characters: [
      'Zainab: a lively girl of five and a half with two neat plaits, a bright pink dress and white sandals.',
      'Bashiru: Zainab’s cousin, a friendly boy of six in a blue shirt, holding a football.',
      'Grandma: a kind grandmother in a long cotton dress and a white scarf, seen in a memory picture.',
    ],
    music: 'Gentle piano with a soft breathing pad (placeholder)',
    pages: [
      pg('🎉', 'Zainab was five and a half. Today she was going to her cousin’s birthday party. She felt happy and excited!', 'A girl in a pink dress skips towards a decorated party yard.'),
      pg('🎈', 'At the party, Zainab was given a bright red balloon. She tied it to her wrist. It bobbed above her head.', 'The girl proudly holds up her wrist with a red balloon bobbing above her.'),
      pg('💥', 'Pop! The balloon burst on a thorn bush. Zainab’s tummy dropped. Her eyes filled with tears.', 'The girl stands beside a thorny bush with a torn balloon and teary eyes.'),
      pg('😤', '‘I hate this party!’ shouted Zainab, stamping her foot. Her face felt hot and her hands felt tight.', 'The girl stamps her foot with clenched fists and a cross face.'),
      pg('🤝', 'Her cousin Bashiru came over. ‘Are you sad or cross?’ he asked. Zainab thought. ‘Both,’ she said. ‘Sad about my balloon. Cross at the thorn bush.’', 'A boy with a football speaks gently to the girl, who is thinking hard.'),
      pg('🌬️', 'Then Zainab remembered what Grandma taught her. Smell the flower: breathe in slowly. Blow the candle: breathe out slowly. She did it three times.', 'The girl closes her eyes and breathes slowly, with a small memory bubble of her smiling grandmother.', 'Slow down and breathe with the child.'),
      pg('🌤️', 'Her hands felt softer. ‘I still feel a little sad,’ she told Bashiru. ‘But I feel calmer.’ ‘Let’s play football!’ said Bashiru.', 'The girl opens her eyes, calmer, as the boy holds out his football with a smile.'),
      pg('⚽', 'Zainab played, laughed and danced. She still missed her balloon a little, and that was okay. The end.', 'The girl kicks a football happily among other children at the party.'),
    ],
    activities: [
      { id: 'feel-c1', type: 'comprehension', afterPage: 3, question: 'What happened to Zainab’s balloon?', options: ['It burst on a thorn bush', 'It flew away', 'She gave it to a friend'], correctIndex: 0 },
      { id: 'feel-voc', type: 'vocabulary', afterPage: 4, word: 'cross', definition: 'Feeling angry or upset.', distractors: ['Feeling sleepy', 'Feeling very hungry'] },
      { id: 'feel-p1', type: 'prediction', afterPage: 4, prompt: 'Zainab feels very upset. What could help her feel better?', options: ['Slow breathing', 'Shouting louder', 'Going home'] },
      { id: 'feel-ph', type: 'phonics', afterPage: 2, targetSound: 'b', prompt: 'Which words start with the b sound, like balloon?', options: ['balloon', 'burst', 'flower', 'candle'], correctIndexes: [0, 1] },
      { id: 'feel-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the story in order.', items: ['Zainab’s balloon popped.', 'Zainab breathed slowly three times.', 'Zainab played football.'] },
      { id: 'feel-sel', type: 'sel', afterPage: 7, prompt: 'Zainab felt sad and cross at the same time. When have you felt two feelings at once? What helped?', feelingOptions: ['Sad', 'Cross', 'Calm', 'Hopeful'] },
    ],
    glossary: [
      { word: 'balloon', definition: 'A thin rubber bag filled with air that floats or bounces.', pages: [2] },
      { word: 'burst', definition: 'Broke open suddenly.', pages: [3] },
      { word: 'calmer', definition: 'More quiet and peaceful inside.', pages: [7] },
    ],
    culturalNotes: ['Names such as Zainab and Bashiru are common in many Muslim communities in Ghana. The story does not depend on any religious practice.'],
    reviewQuestions: ['Is the breathing technique (slow in, slow out) appropriate for a classroom, and is it clear that it helps rather than cures big feelings?'],
    guide: {
      overview: 'A feelings story that models naming two emotions at once and using a simple breathing routine. It does not pretend that big feelings vanish.',
      lessonMinutes: 30,
      goals: ['Name feelings and notice where they show up in the body.', 'Try the smell-the-flower, blow-the-candle breathing routine.', 'Understand that feelings can be mixed and still be okay.'],
      subjects: [['Personal and Social Development', 'Naming and managing feelings'], ['Language and Literacy', 'Vocabulary and initial sounds']],
      before: ['Show a face chart and ask how the children feel today.'],
      during: ['On page 6, breathe together slowly three times.'],
      after: ['Ask children to draw a time they felt two feelings at once.'],
      discussion: ['Why did Bashiru ask if she was sad or cross?', 'Why was it okay that Zainab still missed her balloon?'],
      reflection: ['What can you do when you feel a big feeling?'],
      support: ['Use a feelings chart with faces.'],
      stretch: ['Teach the breathing trick to someone at home and report back.'],
      localise: ['Check that the party scene matches children’s experience.', 'Be aware that some children may have experienced loss or hardship; keep sharing voluntary.'],
    },
  }),
];

