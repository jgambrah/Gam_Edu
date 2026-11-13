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
 * Batch 32: More science and life skills for young minds. Eight stories for kindergarten to primary 4: where a puddle
 * goes (evaporation), how a plant drinks, how a drum makes sound, why a metal spoon gets hot, turning peels into
 * compost, owning up to a mistake, asking when you do not understand, and waiting fairly in a queue at the borehole.
 * Each story has one clear idea, short past-tense sentences and one activity that is safe to try.
 */

export const BATCH_32_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'delanyo-and-the-vanishing-puddle',
    title: 'Delanyo and the Vanishing Puddle',
    summary: 'A puddle disappears on a sunny day. Delanyo and Tiwaa test it with two saucers of water and find out that the sun helps water turn into an invisible gas in the air.',
    classIds: ['primary-1', 'primary-2'], ageMin: 6, ageMax: 8, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'educational', 'friendship'], themes: ['weather', 'school', 'friendship'], objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'reading-comprehension'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Curious and clear, with a pause at each test', palette: ['#38bdf8', '#f59e0b'],
    voice: 'A curious boy’s voice for Delanyo; a bright girl’s voice for Tiwaa',
    characters: [
      'Delanyo: an inquisitive eight-year-old Ghanaian boy with short neat hair, wearing a sky-blue collared school shirt, khaki shorts, and brown sandals.',
      'Tiwaa: his bright eight-year-old Ghanaian female classmate with neat braided plaits and yellow hair beads, wearing a matching sky-blue-and-khaki school dress.',
      'Their teacher: a warm Ghanaian woman wearing an indigo-and-gold African-print dress.',
    ],
    music: 'A light, drippy xylophone that fades like mist (placeholder)',
    pages: [
      pg('🌧️', 'It rained in the night. In the morning, a big puddle lay in the schoolyard. At break time, Delanyo jumped right over it. After lunch, he went back to look, yet the puddle was gone.', 'In a sunny Ghanaian schoolyard at morning break, Delanyo leaps cheerfully over a wide rainwater puddle while Tiwaa watches with a smile.'),
      pg('❓', '“Where did the water go?” he asked. “Did it sink into the ground?” “Some of it did,” said Tiwaa, “yet the sun is hot today. Maybe the sun took some of it.” “Let us test it,” said Delanyo.', 'Delanyo and Tiwaa crouching curiously beside a warm, sun-dried patch of earth in the bright schoolyard where the puddle had been.'),
      pg('🥣', 'They poured the exact same amount of water into two matching white saucers. They placed one saucer in the bright sun and the other in the cool shade. With a pencil, they marked a neat line at the water rim on each saucer.', 'Tiwaa marking a thin pencil line inside one of two matching white saucers of clear water—one placed on a sunlit courtyard bench and one in the cool veranda shade.'),
      pg('🕑', 'After two hours, they checked both saucers. The water in the sunny saucer had gone down a lot, while the water in the shady saucer had gone down only a little. “The sun makes it go faster,” said Tiwaa.', 'Delanyo and Tiwaa comparing the two white saucers side by side: the sunny saucer holds very little water below its pencil line while the shady saucer remains nearly full.'),
      pg('💨', 'Their teacher explained kindly, “When the sun warms water, some of it turns into a gas called water vapour. We cannot see it as it rises into the air. This change is called evaporation.”', 'In the sunlit schoolyard beside the saucers, their teacher gestures gently upward toward the warm sky while Delanyo and Tiwaa look up thoughtfully.'),
      pg('☁️', '“Wet clothes dry on a line in the exact same way,” added their teacher. “The water rises into the air. Later, high up, the vapour cools to form clouds, and rain falls again.” Delanyo grinned. “So our puddle is up in the sky!”', 'Bright Ghanaian courtyard scene with colourful washed clothes drying on a sunny washing line beneath fluffy white clouds while Delanyo and Tiwaa grin happily.'),
    ],
    activities: [
      { id: 'dv-c1', type: 'comprehension', afterPage: 4, question: 'In which saucer did the water go down faster?', options: ['The one in the sun', 'The one in the shade', 'Both went down the same'], correctIndex: 0 },
      { id: 'dv-c2', type: 'comprehension', afterPage: 5, question: 'What is water vapour?', options: ['A gas that we cannot see', 'A kind of puddle', 'A big cloud'], correctIndex: 0 },
      { id: 'dv-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['A puddle forms after rain.', 'The sun warms the water.', 'The water turns into vapour.', 'Vapour cools and forms clouds.'] },
      { id: 'dv-voc', type: 'vocabulary', afterPage: 5, word: 'evaporation', definition: 'When liquid water turns into a gas and rises into the air.', distractors: ['When water freezes', 'When rain falls'] },
    ],
    glossary: [
      { word: 'puddle', definition: 'A small pool of rainwater on the ground.', pages: [1, 6] },
      { word: 'vapour', definition: 'Water in the form of an invisible gas in the air.', pages: [5, 6] },
      { word: 'evaporation', definition: 'When liquid water turns into a gas and goes into the air.', pages: [5] },
    ],
    culturalNotes: ['Puddles after the rains and wet clothes drying on a line are everyday sights across Ghana. The story links them with the water cycle that children meet in Integrated Science.', 'The story is accurate that some rainwater also sinks into the ground rather than claiming the sun took every drop.'],
    reviewQuestions: ['Check that the explanation of evaporation matches the Integrated Science syllabus and that water vapour is described accurately as an invisible gas.', 'Confirm that the two-saucer test works clearly within two hours on a sunny day.'],
    guide: {
      overview: 'A two-saucer investigation showing that water evaporates faster in the sun than in the shade. Learners keep the test fair (equal water and matching saucers) and connect evaporation to drying clothes, clouds, and rain.',
      lessonMinutes: 35, goals: ['Explain simply what evaporation is.', 'Carry out a fair two-saucer comparison.', 'Connect evaporation to drying clothes, clouds, and rain.'],
      subjects: [['Integrated Science', 'Water and weather'], ['English Language', 'Reading and describing an investigation']],
      before: ['Ask: where does the water in a schoolyard puddle go when the sun comes out?'], during: ['Pause on page 3 and ask: why must both saucers hold the exact same amount of water?'],
      after: ['Set up the two-saucer test, mark the starting water rim with a pencil, and compare after two hours.', 'Hang one damp cloth in the sun and an identical damp cloth in the shade and compare how fast they dry.'],
      discussion: ['Why did the water level drop faster in the sunny saucer?', 'Where does the invisible water vapour go?'], reflection: ['Where else at home or school have you noticed water drying up?'],
      support: ['Use two clear cups and draw the before-and-after water heights side by side.'], stretch: ['Predict what would happen on a cool, cloudy morning and test your prediction.'],
      localise: ['Connect the lesson to rainy-season puddles and household washing lines.', 'Use cool tap water only; never use hot water with young learners.'],
      factCheck: [{ claim: 'Sunlight warms liquid water so it evaporates faster into invisible water vapour in the air.', explanation: 'Solar warmth gives surface water molecules enough energy to escape as invisible water vapour gas; higher up, cooling vapour condenses into cloud droplets.', reference: 'NaCCA Ghana Primary Integrated Science Curriculum (Water Cycle and Evaporation)' }],
    },
  }),

  // 2
  mk({
    key: 'zulaiha-and-the-thirsty-stem',
    title: 'Zulaiha and the Thirsty Stem',
    summary: 'Zulaiha and Nsoh place a leafy white flower stem into coloured water and watch the colour climb, discovering how a plant drinks through tiny tubes in its stem.',
    classIds: ['primary-1', 'primary-2'], ageMin: 6, ageMax: 8, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'educational', 'school-life'], themes: ['farm-and-garden', 'school', 'friendship'], objectives: ['scientific-curiosity', 'reasoning', 'sequencing', 'vocabulary'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'village-life'], wpm: 90, paceWord: 'Patient, with a pause for waiting', palette: ['#16a34a', '#dc2626'],
    voice: 'A thoughtful girl’s voice for Zulaiha; a lively voice for Nsoh',
    characters: [
      'Zulaiha: a thoughtful eight-year-old Ghanaian girl wearing a neat green-and-yellow school uniform and a cream headscarf.',
      'Nsoh: her lively eight-year-old male classmate with short neat hair, wearing a matching yellow uniform shirt and green shorts.',
      'Their teacher: a kind Ghanaian woman wearing a warm coral-and-gold African-print dress.',
    ],
    music: 'A slow, rising flute, like something climbing (placeholder)',
    pages: [
      pg('🌿', 'Zulaiha and Nsoh watered the school garden every morning. “How does a plant drink?” asked Nsoh. “It has no mouth.” “Let us find out,” said Zulaiha.', 'In a lush Ghanaian school garden, Zulaiha and Nsoh water leafy green vegetable beds with a watering can under morning sunshine.'),
      pg('🧪', 'Their teacher helped them set up a test. They half-filled a clear glass jar with water and added a few drops of safe red food colouring. Next, they placed the freshly trimmed stem of a white flower into the red water.', 'On a wooden classroom table, Zulaiha and Nsoh watch as their teacher places a leafy white flower stem into a clear jar of bright red water.'),
      pg('⏳', 'They waited patiently. After one hour, nothing seemed different. After a few hours, however, the pale edges of the white petals turned soft pink. “It is working!” whispered Zulaiha.', 'Close view of the clear jar of red water on the sunny windowsill as the white flower petals show delicate pink edges while Zulaiha and Nsoh peer closely.'),
      pg('🔍', 'By the next morning, the petals were bright rosy red. Their teacher carefully cut across the bottom of the stem. “Look at the tiny red dots,” she said. “Those are narrow tubes inside the stem. The coloured water climbed right up through them.”', 'Their teacher holding the freshly cut green stem end to show tiny red dots inside while the rosy red flower rests beside Zulaiha and Nsoh.'),
      pg('🌱', '“In the soil, a plant’s roots take in water,” explained their teacher. “Then the stem carries that water all the way up to the leaves and flowers so the plant can live and grow.”', 'Out in the school garden, the teacher kneels beside a healthy flowering plant and traces her finger from the damp soil at its base up the green stem to the blossoms.'),
      pg('🚿', 'Zulaiha and Nsoh watered the garden with a clear new purpose. “Pour water near the roots, not high on the leaves,” said Nsoh. “And never waste a drop,” added Zulaiha. When they finished, both children washed their hands with soap.', 'Nsoh carefully pouring water right at the soil base of garden plants while Zulaiha washes her hands at a clean outdoor tap nearby.'),
    ],
    activities: [
      { id: 'zt-c1', type: 'comprehension', afterPage: 4, question: 'What carried the coloured water up to the petals?', options: ['Tiny tubes in the stem', 'The wind', 'A passing bee'], correctIndex: 0 },
      { id: 'zt-c2', type: 'comprehension', afterPage: 5, question: 'What is the job of a plant’s roots?', options: ['Take in water from the soil', 'Make flower petals', 'Scare away insects'], correctIndex: 0 },
      { id: 'zt-s1', type: 'sequencing', prompt: 'Put the plant’s drinking journey in order.', items: ['The roots take in water from the soil.', 'The stem carries the water upward.', 'The leaves and flowers receive water.', 'The plant lives and grows strong.'] },
      { id: 'zt-voc', type: 'vocabulary', afterPage: 5, word: 'roots', definition: 'The parts of a plant that grow under the soil and take in water.', distractors: ['The soft petals', 'The ripe seeds'] },
    ],
    glossary: [
      { word: 'stem', definition: 'The main stalk of a plant that carries water up from the roots.', pages: [2, 4, 5] },
      { word: 'roots', definition: 'The parts of a plant that grow under the soil and take in water.', pages: [5, 6] },
      { word: 'petals', definition: 'The soft coloured outer parts of a flower.', pages: [3, 4] },
    ],
    culturalNotes: ['School gardens are common across Ghanaian primary schools. Pale-petalled flowers, soft leafy stems, or celery stalks show coloured water transport clearly.', 'Use safe food colouring only, have the teacher handle any cutting tool, and wash hands afterwards.'],
    reviewQuestions: ['Check that locally available white flowers or pale leafy stems show colour uptake within several hours to overnight.', 'Confirm the explanation (roots absorb water; narrow tubes in the stem transport it upward) with the Integrated Science syllabus.'],
    guide: {
      overview: 'A hands-on observation showing coloured water travelling up a plant stem. Learners discover the roles of roots and stems, practise patient observation over time, and apply smart garden watering.',
      lessonMinutes: 30, goals: ['State what roots and stems do for a plant.', 'Predict and observe gradual change over several hours.', 'Explain why gardeners water the soil around the roots.'],
      subjects: [['Integrated Science', 'Parts of a plant and their functions'], ['English Language', 'Sequencing and observation notes']],
      before: ['Ask: how can a tall plant drink water when it has no mouth?'], during: ['Pause on page 3 and ask learners what they predict the flower will look like the next morning.'],
      after: ['Place a pale flower or leafy stalk into safe coloured water and draw it after one hour and again the next day.', 'Draw a simple plant and point to its roots, stem, leaves, and flower.'],
      discussion: ['Why should we pour water at the base of a plant instead of splashing the leaves?', 'How can we conserve water in the school garden?'], reflection: ['What did you observe carefully today by being patient?'],
      support: ['Compare two jars side by side—one with red water and one with plain clear water.'], stretch: ['Predict what happens when a teacher splits the lower stem lengthways into two cups of different food colours.'],
      localise: ['Use safe non-toxic plants and pale blossoms growing near the school.', 'Ensure only the teacher trims stems and all pupils wash hands with soap afterwards.'],
      factCheck: [{ claim: 'Plant roots absorb water from soil and tiny tubes (xylem vessels) inside the stem carry it up to leaves and petals.', explanation: 'Water moves upward through narrow transport tubes in the stem via transpiration pull and capillary action, which becomes visible when safe food dye tints pale petals.', reference: 'NaCCA Ghana Primary Integrated Science Curriculum (Parts of Plants and Water Transport)' }],
    },
  }),

  // 3
  mk({
    key: 'klenam-and-the-dancing-rice',
    title: 'Klenam and the Dancing Rice',
    summary: 'Klenam and Mame discover that sound is made by fast shaking, called vibration, when grains of rice jump and dance on a drumhead.',
    classIds: ['primary-1', 'primary-2'], ageMin: 6, ageMax: 8, readingLevel: 'early', difficulty: 2,
    genres: ['science', 'educational', 'cultural'], themes: ['school', 'community', 'festivals'], objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'cultural-heritage'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Lively, with a pause for every drum beat', palette: ['#b45309', '#7c3aed'],
    voice: 'A lively boy’s voice for Klenam; a clear girl’s voice for Mame',
    characters: [
      'Klenam: an energetic eight-year-old Ghanaian boy wearing a bright amber tunic with woven kente trim and brown shorts for Cultural Day, holding a wooden drumstick.',
      'Mame: his curious eight-year-old female classmate with neat braided puffs and colourful beads, wearing a matching kente-trimmed dress and holding a small calabash bowl of white rice.',
      'Their teacher: a warm Ghanaian woman in a rich purple-and-gold African-print dress standing beside a carved wooden drum.',
    ],
    music: 'A drum that gets quiet when the skin is touched (placeholder)',
    pages: [
      pg('🥁', 'On Cultural Day at school, Klenam played a tall wooden drum. Boom, boom, boom! “How does a drum make a sound?” asked Mame. “It is only stretched skin and carved wood.”', 'In a festive sunlit Ghanaian school courtyard, Klenam taps a tall carved wooden drum with a stick while Mame watches curiously.'),
      pg('✋', 'Their teacher smiled and said, “Place your fingers lightly near the edge of the drum skin while Klenam taps gently.” Mame felt a lively tickle under her fingertips. “It is shaking!” she cried. “That fast shaking is called vibration,” said the teacher.', 'Mame resting her fingertips lightly on the stretched drumhead with a delighted smile as Klenam taps gently and their teacher watches.'),
      pg('🍚', 'Next, Mame sprinkled a few uncooked grains of white rice onto the drum skin. Klenam tapped the drum again, and the tiny grains leaped and danced! “The drum skin is shaking so fast that the rice jumps!” said Klenam.', 'Close view of the stretched wooden drumhead as white rice grains bounce and hop in the air when Klenam taps the drum beside Mame.'),
      pg('🤚', 'Then their teacher laid her open palm flat across the drum skin to stop the shaking. At once, the sound stopped too, and the rice lay still. “No shaking means no sound,” she explained. “Every sound is made by something vibrating.”', 'Their teacher resting her flat palm gently on the drumhead so the white rice grains sit completely still while Klenam and Mame watch closely.'),
      pg('👂', '“The vibrating drum skin makes the air around it shake too,” continued the teacher. “That shaking air travels all the way to our ears, and that is how we hear.” Mame grinned. “So the drum talks to the air, and the air talks to us!”', 'Beside the carved wooden drum, the teacher cups one hand gently near her ear as Mame smiles brightly and Klenam listens.'),
      pg('🙉', 'Their teacher shared a helpful safety rule as well. “Very loud sounds can hurt our ears. We play instruments at a safe volume, and we step back whenever a noise is too loud.” Klenam tapped softly, and the rice danced a gentle dance.', 'Klenam tapping the wooden drum softly in the sunny courtyard while the white rice grains hop gently and Mame listens happily.'),
    ],
    activities: [
      { id: 'kd-c1', type: 'comprehension', afterPage: 3, question: 'Why did the grains of rice jump on the drum?', options: ['The drum skin was shaking fast', 'A strong wind blew them', 'Mame pushed each grain'], correctIndex: 0 },
      { id: 'kd-c2', type: 'comprehension', afterPage: 4, question: 'What happened as soon as the teacher rested her palm on the drum skin?', options: ['The shaking and the sound stopped', 'The drum grew much louder', 'The rice cooked'], correctIndex: 0 },
      { id: 'kd-s1', type: 'sequencing', prompt: 'Put how we hear the drum in order.', items: ['Klenam taps the drum.', 'The drum skin vibrates.', 'Shaking air carries the sound outward.', 'Our ears hear the sound.'] },
      { id: 'kd-voc', type: 'vocabulary', afterPage: 2, word: 'vibration', definition: 'A very fast shaking back and forth.', distractors: ['A slow quiet walk', 'A wooden stick'] },
    ],
    glossary: [
      { word: 'drum', definition: 'A musical instrument with a stretched skin that makes sound when struck.', pages: [1, 2, 3, 4, 5] },
      { word: 'vibration', definition: 'A fast shaking movement back and forth.', pages: [2] },
      { word: 'volume', definition: 'How loud or soft a sound is.', pages: [6] },
    ],
    culturalNotes: ['Carved wooden drums are treasured across Ghanaian festivals and school Cultural Days. The story celebrates inquiry with a school drum without imitating sacred ceremonial rhythms.', 'Indoor hearing safety is highlighted so learners play percussion considerately.'],
    reviewQuestions: ['Confirm that dry rice grains bounce visibly on a classroom drum or taut plastic bowl cover.', 'Confirm the age-appropriate explanation of sound vibrations travelling through air to the ear.'],
    guide: {
      overview: 'A lively percussion investigation showing that sound comes from vibration. Learners feel vibrations with their fingertips, see them with jumping rice grains, and practise safe listening habits.',
      lessonMinutes: 30, goals: ['State that sound is produced by vibrating objects.', 'Describe simply how sound travels through air to our ears.', 'Follow safe volume rules to protect hearing.'],
      subjects: [['Integrated Science', 'Sound and vibrations'], ['Creative Arts', 'Rhythm and percussion']],
      before: ['Have learners hum softly while touching two fingers gently against their throats: what do they feel?'], during: ['Let pairs tap a desk softly and touch the desktop lightly to feel the vibration.'],
      after: ['Sprinkle a pinch of rice onto a drumhead (or cling-film stretched tightly over a bowl) and tap gently nearby.', 'Pluck a stretched rubber band around an empty tissue box and watch it vibrate.'],
      discussion: ['Why did the sound stop immediately when the teacher’s palm stopped the skin from shaking?', 'How do we protect our ears around loudspeakers or heavy machinery?'], reflection: ['What is your favourite gentle everyday sound at home or in nature?'],
      support: ['Hold a plastic ruler firmly on the edge of a desk and flick the free end gently so learners see and hear the vibration.'], stretch: ['Predict how the rice will move with a soft tap versus a slightly firmer tap, then test carefully.'],
      localise: ['Use a school drum, rattle, or homemade container drum available locally.', 'Remind pupils never to shout or bang instruments close to someone’s ear.'],
      factCheck: [{ claim: 'Sound is produced by vibrating objects and travels through the air as vibrations to our ears; very loud sounds can harm hearing.', explanation: 'Striking a drumhead sets it vibrating rapidly, creating pressure waves in surrounding air that reach the eardrum; damping the membrane stops the vibration and sound.', reference: 'NaCCA Ghana Primary Integrated Science Curriculum (Sound Energy) & WHO Safe Listening Guidance' }],
    },
  }),

  // 4
  mk({
    key: 'habiba-and-the-hot-spoon',
    title: 'Habiba and the Hot Spoon',
    summary: 'Habiba notices that a metal spoon grows hot in the cooking pot while a wooden spoon stays cool. With Auntie Gyamea, she tests spoons safely in warm tap water to see which materials let heat pass through.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'developing', difficulty: 2,
    genres: ['science', 'family', 'educational'], themes: ['family', 'food', 'health-and-wellbeing'], objectives: ['scientific-curiosity', 'reasoning', 'responsibility', 'vocabulary'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'local-food'], wpm: 90, paceWord: 'Careful and clear, firm on the safety rule', palette: ['#ea580c', '#475569'],
    voice: 'A curious voice for Habiba; a warm, firm voice for Auntie Gyamea',
    characters: [
      'Habiba: a curious nine-year-old Ghanaian girl wearing a soft peach headscarf and a neat sky-blue cotton dress.',
      'Auntie Gyamea: her warm, attentive Ghanaian aunt wearing a rust-and-gold African-print wrapper cloth, matching headwrap, and plain cream kitchen apron.',
    ],
    music: 'A soft simmering sound with a gentle drum (placeholder)',
    pages: [
      pg('🍲', 'Auntie Gyamea was cooking morning porridge, stirring it steadily with a long wooden spoon. Habiba watched from the kitchen doorway, keeping well back from the hot stove just as Auntie had taught her.', 'From a safe kitchen doorway, Habiba watches Auntie Gyamea stir porridge in a pot on the stove with a long wooden spoon.'),
      pg('🥄', 'Auntie rested a metal spoon in the pot for a moment, and when she lifted it out she held a folded kitchen cloth around it. “Why did you use the cloth?” asked Habiba. “A metal handle quickly grows hot,” said Auntie, “whereas a wooden handle stays cool.”', 'Auntie Gyamea holding a shiny metal spoon safely with a thick folded cloth in one hand and a cool wooden spoon in the other as Habiba watches from the doorway.'),
      pg('🧪', '“Let us test that safely at the table using warm tap water, never hot water,” said Auntie. She poured warm tap water into a sturdy mug. Habiba placed one metal spoon and one wooden spoon into the water and waited five minutes.', 'At a wooden dining table well away from the stove, Habiba places a metal spoon and a wooden spoon side by side into a mug of warm water while Auntie Gyamea smiles.'),
      pg('🖐️', 'After five minutes, Habiba touched the top of each handle gently. The metal handle felt noticeably warm, while the wooden handle still felt cool. “The warmth travelled right up the metal,” she said, “yet it did not travel up the wood!”', 'Habiba gently touching the upper tips of the metal spoon handle and wooden spoon handle in the mug on the table, looking amazed.'),
      pg('📘', '“Exactly,” said Auntie Gyamea. “Metal lets heat pass through easily, whereas wood does not. That is why many cooking pots are made with wooden or heat-safe plastic handles, and why cooks love wooden stirring spoons.”', 'At the kitchen table, Auntie Gyamea points out the sturdy wooden side handles on an empty, cool cooking pot beside a wooden spoon.'),
      pg('🛑', '“And remember our home rule,” Auntie added firmly. “Children never touch a hot pot or go near a lit stove—grown-ups handle the cooking.” Habiba nodded, carried the test mug to the basin, and washed her hands.', 'Habiba washing her hands with soap at a clean washbasin while Auntie Gyamea looks on warmly beside the tidy table.'),
    ],
    activities: [
      { id: 'hh-c1', type: 'comprehension', afterPage: 4, question: 'Which spoon handle felt warm after five minutes in warm water?', options: ['The metal handle', 'The wooden handle', 'Neither handle'], correctIndex: 0 },
      { id: 'hh-c2', type: 'comprehension', afterPage: 6, question: 'What is the home safety rule about hot pots and lit stoves?', options: ['Children never touch them; grown-ups cook', 'Children carry hot pots alone', 'Anyone can play near the fire'], correctIndex: 0 },
      { id: 'hh-s1', type: 'sequencing', prompt: 'Put Habiba’s safe spoon test in order.', items: ['Auntie pours warm tap water into a mug.', 'Habiba puts a metal spoon and a wooden spoon inside.', 'They wait five minutes.', 'Habiba touches both handles gently to compare.'] },
      { id: 'hh-voc', type: 'vocabulary', afterPage: 5, word: 'heat', definition: 'Energy of warmth that moves from warmer things to cooler things.', distractors: ['A shiny grey metal', 'A wooden kitchen stool'] },
    ],
    glossary: [
      { word: 'porridge', definition: 'A smooth, warm breakfast dish cooked from grains such as maize or millet.', pages: [1] },
      { word: 'metal', definition: 'A hard, shiny material—such as steel or aluminium—that lets heat pass through easily.', pages: [2, 3, 4, 5] },
      { word: 'handle', definition: 'The part of a spoon, tool, or pot made to be held in the hand.', pages: [2, 4] },
    ],
    culturalNotes: ['Wooden stirring paddles and spoons (such as banku ta or wooden ladles) are everyday essentials in Ghanaian kitchens because wood stays comfortable to hold.', 'Child burn prevention comes first: children stay back from stoves and test heat conduction only with safe warm tap water.'],
    reviewQuestions: ['Verify that the classroom/home activity specifies safe warm tap water or sun-warmed water only—never boiling or hot stove water.', 'Check the science: metals are good thermal conductors, whereas wood and plastic are thermal insulators.'],
    guide: {
      overview: 'A safe household science story comparing thermal conductors (metal) and insulators (wood), linking everyday Ghanaian kitchen tools to material properties and strict stove safety.',
      lessonMinutes: 30, goals: ['Identify which material lets heat pass through easily and which blocks it.', 'Explain why cooking pots and spoons often have wooden or plastic handles.', 'State and follow kitchen burn-safety rules.'],
      subjects: [['Integrated Science', 'Heat conduction and everyday materials'], ['Our World Our People', 'Keeping safe at home']],
      before: ['Show a metal spoon and a wooden spoon and ask: which one stays cooler when stirring warm food, and why?'], during: ['Pause on page 4 so learners can explain where the warmth on the metal handle came from.'],
      after: ['Test a metal spoon, wooden spoon, and plastic spoon in a cup of safe sun-warmed or warm tap water for five minutes.', 'Sort classroom and kitchen objects by what material their handles are made of.'],
      discussion: ['Why are pot bodies made of metal while their handles are often wood or plastic?', 'Why must children stay away from lit coal pots and gas stoves?'], reflection: ['What is one thing you do at home to help keep younger siblings safe around the cooking area?'],
      support: ['Sort picture cards of spoons and pots under “warms up fast (metal)” and “stays cool (wood/plastic)”.'], stretch: ['Predict whether a plastic spoon handle will feel like the metal spoon or the wooden spoon, then test it in warm tap water.'],
      localise: ['Reference familiar wooden paddles and spoons used for porridge, soup, and banku.', 'Never bring boiling water into a pupil activity; use only safe warm tap or sun-warmed water.'],
      factCheck: [{ claim: 'Metals conduct heat rapidly along a spoon handle, whereas wood is a poor conductor (thermal insulator) that stays cool.', explanation: 'Metals transfer thermal energy quickly from warm water up the handle, while wood slows heat transfer, making wooden handles safer to hold.', reference: 'NaCCA Ghana Primary Integrated Science Curriculum (Heat Energy: Conductors and Insulators)' }],
    },
  }),

  // 5
  mk({
    key: 'awuku-and-the-peel-heap',
    title: 'Awuku and the Peel Heap',
    summary: 'Awuku and Jamila start a school compost heap for fruit and vegetable peels. They watch peels rot into rich soil food while plastic wrappers stay unchanged, learning to sort waste wisely.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'developing', difficulty: 2,
    genres: ['science', 'educational', 'school-life'], themes: ['school', 'farm-and-garden', 'citizenship'], objectives: ['environmental-awareness', 'scientific-curiosity', 'responsibility', 'teamwork'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'local-food'], wpm: 90, paceWord: 'Steady, with a bit of humour about the smell', palette: ['#65a30d', '#78350f'],
    voice: 'A cheerful voice for Awuku; a practical, bright voice for Jamila',
    characters: [
      'Awuku: a cheerful nine-year-old Ghanaian boy with short neat hair, wearing a green-and-khaki school uniform.',
      'Jamila: his practical nine-year-old female classmate wearing a matching green-and-khaki school dress and a tidy white headscarf.',
      'Their teacher: a supportive Ghanaian male teacher in a neat short-sleeved cream shirt and khaki trousers.',
    ],
    music: 'A light, bouncing tune with a shovel beat (placeholder)',
    pages: [
      pg('🍌', 'After lunch break at school, banana peels, orange peels, and yam peels lay scattered near the edge of the yard. “We can care for our compound better than this,” said Jamila. Awuku nodded. “Let us ask our teacher.”', 'In a Ghanaian schoolyard after lunch, Awuku and Jamila look thoughtfully at scattered banana and orange peels near a tree.'),
      pg('🪣', 'Their teacher showed them how to build a compost heap. In a quiet corner of the school garden, they dug a shallow pit and layered fruit peels, dry brown leaves, and a sprinkle of garden soil. They kept plastic, bones, and glass completely out.', 'Under their teacher’s guidance in the school garden, Jamila tips fruit peels from a bowl into a shallow earth pit while Awuku adds dry brown leaves.'),
      pg('🔄', 'Each week, Awuku turned the heap gently with a long wooden stick. “Whew, it smells a little!” he laughed. “It smells like damp earth,” smiled Jamila, “and that is a good sign.” Afterwards, they blanketed the heap with dry leaves to keep flies away.', 'Awuku turning the garden compost heap with a wooden stick while Jamila spreads a tidy layer of dry leaves over the top.'),
      pg('🪱', 'After several weeks, the peels had turned into dark, crumbly compost. “Tiny helpers in the soil—earthworms and microscopic living things—break plant waste down,” explained their teacher. “They turn old peels into rich food for the soil.”', 'Close view of rich, dark, crumbly garden compost in the pit with a healthy earthworm wriggling through the damp soil.'),
      pg('🥬', 'Awuku and Jamila mixed the finished compost into the vegetable beds. Soon the garden greens grew taller and brighter than ever. “Our lunch peels came back as food for the plants!” said Jamila proudly. “Nothing went to waste.”', 'Awuku and Jamila spreading dark compost around thriving, lush green leafy vegetables in the sunny school garden.'),
      pg('🚮', 'Meanwhile, old plastic wrappers collected by the fence had not rotted at all. “Plastic does not break down like plant peels,” said their teacher. “So plastic goes into the waste bin, and peels go into the compost.” Afterwards, everyone washed their hands with soap and clean water.', 'Beside two colour-coded unlabelled school bins—one holding plastic wrappers and one holding fruit peels—Awuku and Jamila wash their hands with soap at a Veronica bucket tap.'),
    ],
    activities: [
      { id: 'ap-c1', type: 'comprehension', afterPage: 4, question: 'What breaks plant peels down into rich compost?', options: ['Earthworms and tiny living things in the soil', 'Strong wind alone', 'Table salt'], correctIndex: 0 },
      { id: 'ap-c2', type: 'comprehension', afterPage: 6, question: 'Where should plastic wrappers be placed?', options: ['In the waste bin', 'In the compost pit', 'On the playground'], correctIndex: 0 },
      { id: 'ap-s1', type: 'sequencing', prompt: 'Put the school composting steps in order.', items: ['Dig a shallow garden pit.', 'Layer peels, dry leaves, and a little soil.', 'Turn the heap weekly and cover it with dry leaves.', 'Mix the dark crumbly compost into garden beds.'] },
      { id: 'ap-voc', type: 'vocabulary', afterPage: 4, word: 'compost', definition: 'Decayed plant matter that enriches soil and helps plants grow.', distractors: ['A shiny plastic wrapper', 'A metal watering can'] },
    ],
    glossary: [
      { word: 'compost', definition: 'Rotted plant waste that makes rich, dark food for garden soil.', pages: [2, 4, 5, 6] },
      { word: 'peels', definition: 'The outer skins removed from fruits and vegetables.', pages: [1, 2, 4, 5, 6] },
      { word: 'crumbly', definition: 'Soft and breaking easily into small, soil-like pieces.', pages: [4] },
    ],
    culturalNotes: ['Many Ghanaian farms and school gardens enrich soil with plant trimmings and peelings; separating plastic sachets and wrappers keeps soil healthy and drains clear.', 'Hygiene and safety rules: keep meat, bones, glass, and plastic out of school compost, site heaps away from water points, and wash hands with soap after gardening.'],
    reviewQuestions: ['Confirm that the compost recipe (plant peels, dry leaves, soil cover; no plastic, glass, or bones) matches safe school gardening practice.', 'Confirm the science of decomposition by earthworms and soil microorganisms for Primary 2–3.'],
    guide: {
      overview: 'A practical school-garden story demonstrating how biodegradable plant waste decomposes into nutrient-rich compost while plastic persists, motivating waste sorting and handwashing.',
      lessonMinutes: 35, goals: ['Explain simply what compost is and how soil organisms make it.', 'Sort common school waste into compostable plant matter vs. non-compostable waste.', 'Follow hygiene rules including covering the heap and washing hands with soap.'],
      subjects: [['Integrated Science', 'Soil fertility and decomposition'], ['Our World Our People', 'Sanitation and caring for the environment']],
      before: ['Ask: after break time, what happens to banana peels compared with plastic wrappers?'], during: ['Pause on page 4 and ask learners to name the soil helpers that break peels down.'],
      after: ['Sort ten safe classroom items (or picture cards) into “Compost Heap” and “Waste Bin”.', 'Observe a small covered compost bucket of leaves and fruit peels over four weeks.'],
      discussion: ['Why did the peels turn into dark soil food while plastic wrappers stayed unchanged?', 'Why did Awuku and Jamila cover the heap with dry leaves and wash their hands afterwards?'], reflection: ['What is one simple way you can help keep your school compound or home yard cleaner this week?'],
      support: ['Sort picture cards of banana peels, dry leaves, plastic bottles, and sweet wrappers onto two coloured mats.'], stretch: ['Measure the height of a leaf-and-peel jar each Friday for four weeks and record how it settles as it rots.'],
      localise: ['Use familiar local peelings such as plantain, banana, orange, mango, and cassava/yam skins (well covered).', 'Keep compost pits well away from boreholes or wells, and wash hands with soap and running water every time.'],
      factCheck: [{ claim: 'Earthworms and soil microorganisms decompose plant peels and dry leaves into nutrient-rich compost, whereas conventional plastics do not rot into soil.', explanation: 'Decomposers break down organic plant tissues into humus and mineral nutrients for plants, while synthetic plastic polymers resist natural biological breakdown.', reference: 'NaCCA Ghana Primary Integrated Science & OWOP Curricula (Soil Conservation and Waste Management)' }],
    },
  }),

  // 6
  mk({
    key: 'dzigbodi-and-the-broken-cup',
    title: 'Dzigbodi and the Broken Cup',
    summary: 'Dzigbodi accidentally breaks her mother’s cup while kicking a ball indoors. Hiding the mistake makes her feel worse until she tells the truth and helps put things right safely.',
    classIds: ['primary-1', 'primary-2'], ageMin: 6, ageMax: 8, readingLevel: 'early', difficulty: 2,
    genres: ['moral', 'family', 'realistic-fiction'], themes: ['family', 'fear-and-courage', 'identity'], objectives: ['emotional-intelligence', 'responsibility', 'reasoning', 'kindness'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Soft and slow at the hiding, brighter after the truth', palette: ['#0ea5e9', '#f59e0b'],
    voice: 'A small, worried voice for Dzigbodi; a calm, loving voice for Mama',
    characters: [
      'Dzigbodi: an expressive seven-year-old Ghanaian girl with neat cornrows and yellow hair ribbons, wearing a sunny coral-and-cream house dress.',
      'Mama: her calm, loving Ghanaian mother wearing a turquoise-and-gold African-print wrapper cloth and matching headscarf.',
    ],
    music: 'A tense, quiet tune that turns warm after the truth (placeholder)',
    pages: [
      pg('⚽', 'While Mama was at the market, Dzigbodi kicked her small ball inside the house, even though Mama had said, “Play ball outside only.” Suddenly, the ball struck the low table, and Mama’s blue cup tumbled down and broke.', 'Inside a tidy Ghanaian living room, startled Dzigbodi stands beside her small rubber ball while broken pieces of a blue ceramic cup lie on the floor by a wooden table.'),
      pg('😰', 'Dzigbodi’s heart beat fast. Remembering safety rules, she did not touch the sharp pieces. Instead, she quietly pulled the room door shut. “Maybe Mama will not notice right away,” she thought, yet her tummy began to ache with worry.', 'Outside the living room doorway, worried Dzigbodi pulls the wooden door shut with one hand while pressing her other hand against her tummy.'),
      pg('😟', 'All afternoon, Dzigbodi felt heavy and sad. When Mama returned from the market, she noticed at once. “Why are you so quiet today, Dzigbodi?” she asked gently. Dzigbodi nearly stayed silent—then she realised how awful hiding felt.', 'On the shaded veranda, downcast Dzigbodi twists the hem of her coral dress while Mama sets down her woven market basket and looks at her kindly.'),
      pg('🗣️', '“Mama,” she said in a small, trembling voice, “I broke your blue cup because I kicked my ball inside the house. I am truly sorry.” Tears welled in her eyes as she waited, afraid Mama might shout.', 'Dzigbodi standing with bowed head and clasped hands as she confesses honestly to Mama, who sits listening calmly on a carved stool.'),
      pg('🤗', 'Mama did not shout. She opened her arms and hugged Dzigbodi warmly. “Thank you for telling me the truth,” she said. “A cup can be bought again, whereas trust cannot. Stay back from the sharp pieces while I pick them up, and please fetch the broom.”', 'Mama kneeling to give Dzigbodi a warm, reassuring hug in the doorway, well clear of the broken blue cup pieces inside.'),
      pg('🌟', 'After Mama safely cleared the shards, Dzigbodi swept the floor clean and placed her ball outside in the yard where it belonged. At once, her tummy stopped hurting. “Telling the truth felt hard,” she told Mama, “yet it feels much better than hiding.” Mama smiled. “I agree.”', 'By the sunlit veranda steps, relieved Dzigbodi sets her small football outside in the courtyard while Mama smiles warmly holding a dustpan and broom.'),
    ],
    activities: [
      { id: 'db-c1', type: 'comprehension', afterPage: 3, question: 'How did Dzigbodi feel while she was hiding what had happened?', options: ['Heavy, worried, and sad', 'Proud and cheerful', 'Excited to play'], correctIndex: 0 },
      { id: 'db-c2', type: 'comprehension', afterPage: 5, question: 'What wise words did Mama share about trust?', options: ['A cup can be bought again, whereas trust cannot', 'Broken cups glue themselves', 'Hiding mistakes builds trust'], correctIndex: 0 },
      { id: 'db-s1', type: 'sequencing', prompt: 'Put Dzigbodi’s story in order.', items: ['The blue cup falls and breaks.', 'Dzigbodi shuts the door and feels worried.', 'She tells Mama the whole truth.', 'Mama clears the sharp pieces and they tidy up together.'] },
      { id: 'db-sel', type: 'sel', afterPage: 6, prompt: 'How does your heart feel after you tell the truth and help put a mistake right?', feelingOptions: ['Relieved', 'Brave', 'Lighter', 'Honest'] },
    ],
    glossary: [
      { word: 'broke', definition: 'Shattered or came apart into pieces after falling.', pages: [1, 4] },
      { word: 'truth', definition: 'What really happened, told honestly without hiding.', pages: [5, 6] },
      { word: 'trust', definition: 'Confidence that someone is honest and reliable.', pages: [5] },
    ],
    culturalNotes: ['Honesty and owning up promptly are deeply valued across Ghanaian homes and classrooms.', 'The story models calm, restorative parenting—pairing warmth with responsible repair—while emphasizing that adults, never young children, pick up sharp broken ceramic or glass.'],
    reviewQuestions: ['Confirm that broken-pottery safety (children step back and fetch an adult rather than touching shards) is unmistakable.', 'Confirm that the tone stays empathetic toward children who feel anxious when owning up.'],
    guide: {
      overview: 'A relatable character-education story about owning up to an indoor accident, contrasting the heavy feeling of secrecy with the relief of honesty, restorative action, and safety around broken crockery.',
      lessonMinutes: 25, goals: ['Describe how hiding a mistake feels compared with telling the truth.', 'Explain why honesty protects trust between people.', 'State the safety rule when glass or china breaks (never touch sharp pieces; tell an adult).'],
      subjects: [['Our World Our People', 'Honesty, trust, and responsibility'], ['English Language', 'Retelling character feelings and actions']],
      before: ['Ask: have you ever knocked something over by accident? How did your body feel in that first moment?'], during: ['Pause on page 3 and ask: what brave choice can Dzigbodi make right now?'],
      after: ['Practise a polite, honest apology in pairs: “I am sorry that I ___. How can I help put it right?”', 'Complete the sentence: “When something breaks, I stay safe by ___.”'],
      discussion: ['Why did Dzigbodi’s tummy ache while she hid the broken cup?', 'Why did Mama ask Dzigbodi to stand back while Mama picked up the sharp pieces?'], reflection: ['Who is a trusted grown-up you can go to whenever you make a mistake?'],
      support: ['Match four facial-expression cards (startled, worried, tearful, relieved) to pages 1, 2, 4, and 6.'], stretch: ['Write three sentences showing what Dzigbodi says to a younger cousin who wants to kick a ball indoors the next week.'],
      localise: ['Practise respectful expressions for apologizing in learners’ home languages as well as English.', 'Respond gently in class whenever pupils own up to honest accidents so honesty feels safe.'],
    },
  }),

  // 7
  mk({
    key: 'sumaila-and-the-question-at-the-back',
    title: 'Sumaila and the Question at the Back',
    summary: 'Sumaila does not understand a maths lesson on halves and worries classmates will laugh. When he bravely raises his hand, he discovers several others had the exact same question.',
    classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'developing', difficulty: 2,
    genres: ['school-life', 'realistic-fiction', 'educational'], themes: ['school', 'fear-and-courage', 'identity'], objectives: ['perseverance', 'emotional-intelligence', 'reasoning', 'counting'],
    ghanaianContext: 'central', culturalTags: ['local-names'], wpm: 90, paceWord: 'Hesitant at first, steady and brave after', palette: ['#2563eb', '#f59e0b'],
    voice: 'A quiet, nervous voice for Sumaila; a warm, clear teacher voice for Madam Adwubi',
    characters: [
      'Sumaila: a thoughtful nine-year-old Ghanaian boy with short neat hair, wearing a royal-blue-and-yellow primary school uniform.',
      'Madam Adwubi: his warm, encouraging Ghanaian class teacher wearing a sunflower-and-navy African-print dress.',
    ],
    music: 'A soft, nervous tune that grows warm and bright (placeholder)',
    pages: [
      pg('🏫', 'During Mathematics, Madam Adwubi taught a new lesson on halves. Sitting at the back of the classroom, Sumaila did not understand what “half” meant. Everyone around him was nodding, so he nodded quietly too.', 'At a wooden desk at the back of a bright Ghanaian classroom, Sumaila nods hesitantly with a puzzled brow while classmates ahead look toward Madam Adwubi.'),
      pg('😟', 'Sumaila wanted to ask a question, yet his heart pounded. “What if people laugh?” he worried. “What if they think I am slow?” So he stayed silent. When the bell rang, he still did not know what a half was.', 'Sumaila sitting quietly at his back desk staring down at his plain open exercise book with a worried expression as classmates pack their bags.'),
      pg('✋', 'The next morning, Madam Adwubi gave a short practice exercise. Sumaila stared at the first question and felt his ears grow warm. Taking a slow, steady breath, he raised his hand high. “Madam, please, I still do not understand halves,” he said.', 'At his desk in the classroom, Sumaila takes a brave breath and raises one hand high while Madam Adwubi turns toward him kindly.'),
      pg('🍎', 'Madam Adwubi did not laugh; she smiled warmly. “Thank you for asking, Sumaila,” she said. She drew eight red apples on the board and grouped them into two equal sets of four. “Half of eight is four. Whenever we share equally into two parts, each part is one half.”', 'Madam Adwubi smiling at the chalkboard as she points to a neat picture-only chalk drawing of eight red apples divided into two equal groups of four.'),
      pg('🙋', '“Oh! I was confused about that too!” whispered a girl at the next desk. Two more classmates nodded eagerly in relief. Sumaila blinked in surprise—many pupils had wondered the exact same thing, and his brave question had helped them all.', 'Several relieved classmates around Sumaila smiling and raising their hands in agreement as Sumaila beams with surprise and relief.'),
      pg('🌟', 'At break time, Sumaila shared eight roasted groundnuts equally with his friend—four for his friend and four for himself—and understood completely. “Asking questions is how we learn,” Madam Adwubi reminded the class. “One honest question helps everyone.”', 'On a sunny school bench at break time, cheerful Sumaila and his friend count eight groundnuts into two equal piles of four on a clean banana leaf.'),
    ],
    activities: [
      { id: 'sq-c1', type: 'comprehension', afterPage: 3, question: 'Why did Sumaila keep quiet on the first day?', options: ['He worried classmates might laugh at him', 'He already knew every answer', 'He had fallen asleep'], correctIndex: 0 },
      { id: 'sq-c2', type: 'comprehension', afterPage: 5, question: 'What surprised Sumaila right after Madam Adwubi explained halves?', options: ['Other classmates had the exact same question', 'Nobody in class was listening', 'The bell ended school early'], correctIndex: 0 },
      { id: 'sq-s1', type: 'sequencing', prompt: 'Put Sumaila’s learning journey in order.', items: ['Sumaila feels confused about halves yet stays silent.', 'He gets stuck on the first question the next morning.', 'He takes a breath, raises his hand, and asks.', 'Madam Adwubi explains with eight apples and everyone understands.'] },
      { id: 'sq-sel', type: 'sel', afterPage: 6, prompt: 'How do you feel when a teacher welcomes your honest question warmly?', feelingOptions: ['Brave', 'Relieved', 'Confident', 'Proud'] },
    ],
    glossary: [
      { word: 'halves', definition: 'Two equal parts that make up one whole.', pages: [1, 3] },
      { word: 'question', definition: 'Something we ask when we want to learn or understand clearly.', pages: [2, 3, 5, 6] },
      { word: 'equally', definition: 'Shared so every group receives the exact same amount.', pages: [4, 6] },
    ],
    culturalNotes: ['In busy classrooms everywhere, shy learners sometimes nod along rather than risk embarrassment; a warm teacher response transforms classroom culture.', 'Sharing roasted groundnuts in equal piles connects fraction concepts directly to everyday Ghanaian school life.'],
    reviewQuestions: ['Verify the numeracy: 8 shared equally into 2 groups gives 4 in each half.', 'Confirm that both pupil courage and warm, supportive teaching are portrayed positively.'],
    guide: {
      overview: 'An encouraging classroom story combining early fractions (finding half of an even set) with the confidence to speak up politely when something is unclear.',
      lessonMinutes: 30, goals: ['Find one half of an even group of objects by sharing equally into two.', 'Practise a polite classroom sentence for asking when unsure.', 'Explain how one learner’s brave question helps the whole class.'],
      subjects: [['Mathematics', 'Fractions: halves by equal sharing'], ['Our World Our People', 'Confidence, respect, and mutual support']],
      before: ['Ask: have you ever nodded in class even when a word or step still felt confusing?'], during: ['Pause on page 3 to praise Sumaila’s calm breath and polite hand-raising.'],
      after: ['Give pairs 8 bottle tops or pebbles to share equally into two groups and state: “Half of 8 is 4.”', 'Set up a welcoming “Curious Questions Box” where anyone can slip a question slip during the week.'],
      discussion: ['What made asking feel scary for Sumaila at first?', 'How did Madam Adwubi’s smile make the whole room braver?'], reflection: ['What polite words will you use the next time a lesson step feels unclear?'],
      maths: [{ task: 'Share 8 groundnuts equally between 2 friends. How many does each friend get?', answer: '4 groundnuts' }, { task: 'What is half of 10 oranges?', answer: '5 oranges' }],
      support: ['Fold a paper circle cleanly into two matching halves and share 6 counters onto the two sides (3 and 3).'], stretch: ['Find half of 12 and half of 20, and explain why 9 pebbles cannot be shared into two equal whole-pebble halves.'],
      localise: ['Use bottle tops, smooth pebbles, or paper cutouts for hands-on equal sharing.', 'Establish a class agreement: we never laugh at a classmate’s honest question.'],
    },
  }),

  // 8
  mk({
    key: 'safiatu-and-the-borehole-queue',
    title: 'Safiatu and the Borehole Queue',
    summary: 'Safiatu walks to the community borehole with her older brother Hammond. Impatient at first, she learns why waiting fairly in line, helping an elder, and saving every drop keep the community strong.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['realistic-fiction', 'educational', 'family'], themes: ['community', 'family', 'citizenship'], objectives: ['responsibility', 'kindness', 'environmental-awareness', 'perseverance'],
    ghanaianContext: 'central', culturalTags: ['local-names', 'village-life'], wpm: 90, paceWord: 'Restless at first, calmer as she learns to wait', palette: ['#0ea5e9', '#a16207'],
    voice: 'An impatient girl’s voice for Safiatu; a calm, older brother’s voice for Hammond; kind voices for the neighbours',
    characters: [
      'Safiatu: a lively eight-year-old Ghanaian girl wearing a bright sky-blue headscarf and a yellow-and-blue patterned dress, carrying a small yellow bucket.',
      'Hammond: her calm twelve-year-old older brother wearing a terracotta collared shirt and dark shorts, carrying a larger blue bucket.',
      'Community neighbours: friendly villagers waiting neatly with colourful buckets beside a concrete-apron hand-pump borehole, including a gentle elderly woman.',
    ],
    music: 'A rhythmic pumping sound with soft village chatter (placeholder)',
    pages: [
      pg('🪣', 'Early one morning, Safiatu walked to the community borehole with her older brother Hammond. A neat line of neighbours was already waiting with their buckets. Safiatu sighed. “We will be waiting here all day!”', 'In morning sunlight, Safiatu with her small yellow bucket and Hammond with his larger blue bucket arrive at the back of an orderly village borehole queue.'),
      pg('😤', '“Let us slip up to the front,” she whispered. Hammond shook his head gently. “Everyone ahead of us arrived earlier, and every family needs clean water. A fair queue respects everyone—we join at the back and wait our turn.”', 'Safiatu pointing eagerly toward the front of the borehole queue while calm Hammond shakes his head kindly beside their buckets.'),
      pg('🤝', 'Soon an elderly grandmother arrived carrying a heavy bucket, looking tired. Together, the neighbours at the front cheerfully invited her to fill hers first. “That is kindness,” said Hammond. “Everyone in line agreed together, so it stayed fair.”', 'Friendly neighbours at the front of the borehole queue smiling and making room so a grateful elderly woman in traditional cloth can fill her bucket first.'),
      pg('🔢', 'Safiatu looked along the row of buckets ahead of them and counted aloud: “Fourteen.” To pass the time cheerfully, she played a quiet finger-counting game with a little girl beside her. Before long, only three buckets remained ahead of them!', 'In the sunny queue, smiling Safiatu plays a cheerful finger-counting game with a happy toddler standing beside her mother.'),
      pg('💧', 'At last it was their turn. Hammond worked the pump handle steadily while Safiatu held her yellow bucket right beneath the spout. As soon as it reached the brim, they stopped the water at once so none spilled. “Every drop is precious,” said Safiatu.', 'At the concrete borehole pad, Hammond pumps the metal handle while Safiatu holds her yellow bucket carefully beneath the clear stream of water.'),
      pg('😊', 'Walking home together, Safiatu smiled at Hammond. “Waiting our turn was not bad after all.” “Patience gave us time to be kind and make a friend,” agreed Hammond. At home, they poured the clean water into a covered storage pot.', 'Inside their clean family courtyard, Safiatu and Hammond pour clear water carefully into a tidy lidded storage container.'),
    ],
    activities: [
      { id: 'sb-c1', type: 'comprehension', afterPage: 2, question: 'Why did Hammond say they must join the back of the queue?', options: ['Everyone ahead had already been waiting fairly', 'The borehole pump was locked', 'He wanted to spill the water'], correctIndex: 0 },
      { id: 'sb-c2', type: 'comprehension', afterPage: 5, question: 'What did Safiatu and Hammond do as soon as the bucket was full?', options: ['Stopped the water at once so none was wasted', 'Left the water spilling over', 'Tipped the bucket onto the ground'], correctIndex: 0 },
      { id: 'sb-s1', type: 'sequencing', prompt: 'Put Safiatu’s morning at the borehole in order.', items: ['Safiatu and Hammond join the back of the queue.', 'Neighbours agree to let an elderly woman go first.', 'Safiatu counts fourteen buckets ahead and plays a counting game.', 'They fill their buckets carefully and store the water covered at home.'] },
      { id: 'sb-sel', type: 'sel', afterPage: 6, prompt: 'How do you feel when everyone waits their turn fairly and kindly?', feelingOptions: ['Patient', 'Respected', 'Calm', 'Proud'] },
    ],
    glossary: [
      { word: 'borehole', definition: 'A deep, narrow well fitted with a pump that brings up clean underground water.', pages: [1] },
      { word: 'turn', definition: 'The right moment for you to act fairly after those ahead of you.', pages: [2, 5, 6] },
      { word: 'precious', definition: 'Very valuable and worthy of careful protection, never to be wasted.', pages: [5] },
    ],
    culturalNotes: ['Community boreholes and standpipes across Ghana rely on shared fairness, respect for elders and pregnant or frail neighbours, and keeping concrete aprons clean.', 'Covering stored drinking water at home protects it from dust and insects, and children visit water points in daylight alongside older family members.'],
    reviewQuestions: ['Confirm that the borehole hand-pump, orderly bucket line, and covered home water pot reflect everyday Ghanaian practice accurately.', 'Verify the subtraction story problem: 14 buckets ahead minus 3 still ahead equals 11 buckets filled.'],
    guide: {
      overview: 'A warm community-citizenship story about queue fairness, agreed kindness toward elders, conserving clean water at a borehole, and storing drinking water safely covered.',
      lessonMinutes: 25, goals: ['Explain why waiting fairly in a queue respects everyone.', 'Describe why communities agree to assist elderly or frail neighbours.', 'Name two good water habits: preventing spills at the tap/pump and covering stored drinking water.'],
      subjects: [['Our World Our People', 'Fairness, courtesy, and water conservation'], ['Mathematics', 'Counting and subtraction within 20']],
      before: ['Ask: where have you waited in a queue—at school, a tap, a borehole, or a shop? How does it feel when everyone is fair?'], during: ['Pause on page 3 and ask: why was letting the elderly grandmother go first both kind and fair?'],
      after: ['Practise lining up calmly and politely at the classroom handwashing station without pushing.', 'Solve simple bucket-queue counting stories using counters.'],
      discussion: ['How did Safiatu make waiting feel faster and happier on page 4?', 'Why did Safiatu and Hammond pour their water into a covered container at home?'], reflection: ['How can you show patience and kindness the next time you wait your turn?'],
      maths: [{ task: 'Safiatu counted 14 buckets ahead of her in the queue. Soon only 3 buckets were still ahead of her. How many buckets had been filled?', answer: '11 buckets' }, { task: 'Hammond filled 1 big bucket and Safiatu filled 1 small bucket. If they made 2 trips like that (suppose), how many buckets did they fill altogether?', answer: '4 buckets' }],
      support: ['Line up 14 counters, remove 11 one by one as buckets are filled, and count the 3 remaining ahead.'], stretch: ['Write three community rules for keeping a village borehole or school standpipe fair, clean, and waste-free.'],
      localise: ['Connect to the water sources learners know locally—pipe-borne standpipes, boreholes, or covered wells.', 'Remind pupils to visit water points with an older sibling or adult in daylight and always keep drinking water covered.'],
    },
  }),
];
