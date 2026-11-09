/**
 * The five pilot stories (plus one clearly-labelled extension sample for older learners).
 *
 * ALL TEXT HERE IS ORIGINAL, written for GAM EDU for this pilot. Folk-tale motifs are retold in new words.
 * NOTHING HERE IS REVIEWED YET: text, cultural fit, vocabulary level and every activity need human review before any
 * publication (see readiness.ts: the human reviews are what make a story premium-ready).
 *
 * Illustrations: only BRIEFS exist. The preview draws a labelled placeholder from `motif`/`palette`; no image has been
 * generated, so no story here can pass the "illustrated" readiness step. Narration: the preview uses free, locally
 * generated placeholder voice (espeak-ng) built by scripts/library/build-preview.py; recorded production narration is
 * a separate, approved step.
 */
import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { Activity, GlossaryEntry } from '../premium';
import type { IllustrationPlan } from '../illustration/plan';
import { EFUA_ACTIVITIES, EFUA_GLOSSARY, EFUA_ILLUSTRATION_PLAN, EFUA_PAGES, EFUA_TEACHER_GUIDE } from './efua-premium';
import { KOFI_MARKET, YAA_DRAIN } from './editorial-samples';
import { BATCH_1_STORIES } from './batch-1-stories';
import { BATCH_2_STORIES } from './batch-2-stories';
import { BATCH_3_STORIES } from './batch-3-stories';
import { BATCH_4_STORIES } from './batch-4-stories';
import { BATCH_5_STORIES } from './batch-5-stories';
import { BATCH_6_STORIES } from './batch-6-stories';
import { BATCH_7_STORIES } from './batch-7-stories';
import { BATCH_8_STORIES } from './batch-8-stories';
import { BATCH_10_STORIES } from './batch-10-stories';
import { BATCH_11_STORIES } from './batch-11-stories';
import { BATCH_12_STORIES } from './batch-12-stories';
import { BATCH_13_STORIES } from './batch-13-stories';
import { normalizeTeacherGuide, type TeacherGuide } from './teacher-guide';

export interface PilotPage {
  text: string;
  /** Alt text for the (future) illustration. Written now so it is reviewed with the text. */
  alt: string;
  /** Emoji used ONLY by the preview placeholder art. */
  motif: string;
  /** Brief for the illustrator or approved image generation. */
  brief: string;
  /** Narration direction for this page (emotion, pace, pauses). */
  narration: string;
}

export interface PilotStory {
  key: string;
  /** 'pilot' = the five stories you named; 'benchmark' = the first fully developed premium story (Efua); 'sample' = additional stories prepared for editorial review. */
  set: 'pilot' | 'benchmark' | 'extension' | 'sample';
  title: string;
  summary: string;
  classification: Classification;
  palette: [string, string];
  pages: PilotPage[];
  activities: Activity[];
  glossary: GlossaryEntry[];
  characters: string[];
  teacherGuide?: TeacherGuide;
  illustrationPlan?: IllustrationPlan;
  narrationPlan: { voice: string; pace: string; notes: string[] };
  music: string;
  culturalNotes: string[];
  reviewQuestions: string[];
}

const base = (c: Partial<Classification> & Pick<Classification, 'classIds' | 'ageMin' | 'ageMax' | 'readingLevel' | 'difficulty' | 'genres' | 'themes' | 'objectives' | 'ghanaianContext' | 'estimatedDurationSec'>): Classification => ({
  schemaVersion: CLASSIFICATION_VERSION, language: 'en', narrationLocale: 'en-GH', ...c,
});

export const STYLE_GUIDE = {
  look: 'Warm hand-painted gouache look on soft textured paper. Rich natural palette: terracotta, leaf green, indigo, sunflower yellow, warm browns.',
  rules: [
    'One consistent character design per character (see each story\'s character notes); same clothes, same proportions on every page.',
    'Landscape 4:3, key subject in the centre two-thirds, quiet area kept clear so text can sit over the image on small screens.',
    'People of varied skin tones shown with dignity; no caricature. Everyday Ghanaian settings shown respectfully and accurately.',
    'No words or letters inside illustrations (the app supplies all text).',
    'Gentle, safe scenes. Nothing frightening for the youngest listeners.',
  ],
  deliver: 'WebP, 1600x1200, under 150 KB each, plus alt text (provided per page).',
};

export const PILOT_STORIES: PilotStory[] = [
  // --------------------------------------------------------------------------------------------------------------------
  {
    key: 'ama-lost-little-goat', set: 'pilot', title: 'Ama and the Lost Little Goat',
    summary: 'Ama’s little goat Pepe goes missing. She asks her neighbours, listens carefully, and finds him.',
    classification: base({
      classIds: ['nursery-2', 'kg-1'], ageMin: 3, ageMax: 5, readingLevel: 'emergent', difficulty: 1,
      genres: ['animal', 'moral'], themes: ['lost-and-found', 'helping-others'], objectives: ['vocabulary', 'sequencing', 'prediction', 'kindness', 'oral-language'],
      ghanaianContext: 'central', culturalTags: ['local-names', 'village-life'], estimatedDurationSec: 150,
    }),
    palette: ['#fde7b0', '#7fb069'],
    characters: ['Ama: a girl of about five, braided hair with yellow ribbons, a blue dress, bare feet or simple sandals.', 'Pepe: a small brown goat with one white spot on his nose.', 'Grandpa Yaw: a kind elderly man with a white beard and a walking stick.', 'The hen: a speckled hen with four chicks.'],
    pages: [
      { text: 'Ama lived in a small village with her family. She had a little goat named Pepe. Pepe had a white spot on his nose.', alt: 'A smiling girl with yellow ribbons hugs a small brown goat with a white spot on its nose, in front of a mud-brick house.', motif: '👧🐐', brief: 'Warm morning light. Ama hugging Pepe in front of a family compound. The white spot on Pepe’s nose clearly visible.', narration: 'Warm and gentle. Slight smile on "Pepe". Pause after "village".' },
      { text: 'Every morning Ama gave Pepe fresh water and green leaves. Pepe said, ‘Meh-eh-eh!’ Ama laughed.', alt: 'Ama holds out green leaves to the goat, who stretches his neck to eat them.', motif: '🌿💧', brief: 'Ama kneeling with a bowl of water and leaves, Pepe eating. Sunlit yard, hens in the background.', narration: 'Playful. Perform "Meh-eh-eh!" as a goat bleat, short and funny.' },
      { text: 'One sunny day, Ama went to fetch water. When she came back, Pepe was gone! ‘Pepe! Pepe!’ called Ama.', alt: 'Ama stands holding a bucket, looking at an empty post where the goat was tied. She looks worried.', motif: '🪣😮', brief: 'Empty rope on the post, Ama with bucket and worried face. Keep it gentle, not scary.', narration: 'Surprise on "gone!", then worried calling. Slow down on "Pepe! Pepe!".' },
      { text: 'Ama looked by the mango tree. A hen sat there with her chicks. ‘Have you seen Pepe?’ asked Ama. ‘Cluck, cluck, not here,’ said the hen. ‘Try near the well.’', alt: 'Under a mango tree a speckled hen and four chicks talk to Ama.', motif: '🥭🐔', brief: 'Big mango tree, hen with four chicks, Ama crouching to ask. Speech is implied by posture only.', narration: 'Hen voice is clucky and kind. Pause before "Try near the well".' },
      { text: 'At the well, Ama met old Grandpa Yaw. ‘Have you seen my goat?’ she asked. Grandpa Yaw smiled. ‘I heard a small voice by the big rock.’', alt: 'Ama speaks to a smiling elderly man with a white beard beside a village well.', motif: '👴⛲', brief: 'Village well with stone rim, Grandpa Yaw leaning on his stick, pointing gently toward a big rock in the distance.', narration: 'Grandpa Yaw: slow, warm, a little slower than the narrator.' },
      { text: 'Ama ran to the big rock. She stopped and listened. ‘Meh-eh-eh!’ It was Pepe! His rope was caught on a branch.', alt: 'Behind a large rock, the little goat stands with its rope caught on a low branch, and Ama runs toward him.', motif: '🪨🐐', brief: 'Large grey rock, Pepe tangled gently in a rope on a low branch, Ama running toward him with joy and relief.', narration: 'Build excitement. Short silence after "listened", then the bleat, then joy on "It was Pepe!".' },
      { text: 'Ama gently freed the rope. Pepe licked her hand. ‘Thank you for helping me,’ Ama told Grandpa Yaw and the hen.', alt: 'Ama unties the rope while the goat nuzzles her hand; the old man and the hen look on, smiling.', motif: '🤝❤️', brief: 'Ama untangling the rope, Pepe nuzzling, Grandpa Yaw and the hen watching warmly from the edge.', narration: 'Tender and relieved. Smile on "licked her hand".' },
      { text: 'That evening Ama tied Pepe’s rope to a strong post. ‘Stay close, little one,’ she whispered. Pepe closed his eyes and went to sleep. The end.', alt: 'At sunset Ama strokes the sleeping goat beside a sturdy post.', motif: '🌅😴', brief: 'Golden sunset, Pepe curled up asleep by a strong post, Ama whispering to him.', narration: 'Slow, soft, sleepy. Whisper "Stay close, little one". Long pause before "The end".' },
    ],
    activities: [
      { id: 'ama-c1', type: 'comprehension', afterPage: 3, question: 'Who did Ama lose?', options: ['Her little goat', 'Her hen', 'Her water bucket'], correctIndex: 0, explanation: 'Ama lost her little goat, Pepe.' },
      { id: 'ama-p1', type: 'prediction', afterPage: 3, prompt: 'Where do you think Pepe went? Tell a friend your idea.' },
      { id: 'ama-ph', type: 'phonics', afterPage: 4, targetSound: 'g', prompt: 'Which words start with the g sound, like goat?', options: ['goat', 'green', 'water', 'mango'], correctIndexes: [0, 1] },
      { id: 'ama-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the story in order.', items: ['Ama looked by the mango tree.', 'Ama asked Grandpa Yaw at the well.', 'Ama found Pepe by the big rock.'] },
      { id: 'ama-c2', type: 'comprehension', afterPage: 6, question: 'Where was Pepe?', options: ['By the big rock', 'In the market', 'Up the mango tree'], correctIndex: 0 },
      { id: 'ama-sel', type: 'sel', afterPage: 8, prompt: 'How did Ama feel when Pepe was gone? How did she feel when she found him?', feelingOptions: ['Worried', 'Happy', 'Sleepy', 'Relieved'] },
    ],
    glossary: [
      { word: 'village', definition: 'A small place in the countryside where families live close together.', pages: [1] },
      { word: 'well', definition: 'A deep hole in the ground where people get water.', pages: [5] },
      { word: 'rope', definition: 'A thick string used to tie things.', pages: [6, 7, 8] },
      { word: 'branch', definition: 'A part of a tree that grows out from the trunk.', pages: [6] },
    ],
    narrationPlan: { voice: 'Warm female storyteller, Ghanaian English (en-GH), unhurried.', pace: 'Slow (about 100 words per minute) for the youngest listeners.', notes: ['Distinct but gentle voices for the hen and Grandpa Yaw.', 'Leave about 0.6 s of silence between pages.', 'Goat bleats performed by the narrator, not sound-effect files, so timing stays exact.'] },
    music: 'Optional soft village morning ambience (kalimba and light percussion). Not created; needs a verified licence before use.',
    culturalNotes: ['Ama and Yaw are Akan day names (born on Saturday / Thursday). A Ghanaian reviewer should confirm they are used naturally.', 'Free-roaming goats tied with rope near a family compound are common in villages.'],
    reviewQuestions: ['Is "Grandpa Yaw" a natural form of address for this setting?', 'Is the level right for Nursery 2 to KG 1 listeners (sentence length, vocabulary)?'],
  },
  // --------------------------------------------------------------------------------------------------------------------
  {
    key: 'kofis-colourful-garden', set: 'pilot', title: 'Kofi’s Colourful Garden',
    summary: 'Kofi plants seeds, waits patiently and discovers a garden full of colours, with counting along the way.',
    classification: base({
      classIds: ['kg-1', 'kg-2'], ageMin: 4, ageMax: 6, readingLevel: 'emergent', difficulty: 2,
      genres: ['educational', 'nature'], themes: ['farm-and-garden', 'family'], objectives: ['vocabulary', 'counting', 'environmental-awareness', 'perseverance'],
      ghanaianContext: 'incidental', culturalTags: ['local-food', 'local-names'], estimatedDurationSec: 180,
    }),
    palette: ['#d8f3dc', '#f4a261'],
    characters: ['Kofi: a boy of about six in a green T-shirt and shorts, round glasses optional, always smiling.', 'Maame (Kofi’s mother): a kind woman in a patterned wrapper cloth and headscarf.'],
    pages: [
      { text: 'Kofi had a little patch of soil behind his house. ‘I will make a garden,’ he said. Maame gave him some seeds.', alt: 'A boy looks at a small patch of brown soil behind a house while his mother hands him a paper packet of seeds.', motif: '🌱👦', brief: 'Behind-the-house yard, bare soil patch, Kofi receiving small seed packets from Maame. Morning light.', narration: 'Bright and curious. Slight lift on "garden".' },
      { text: 'Kofi dug little holes. He put one seed in each hole and covered it with soil. Then he gave the soil a drink of water.', alt: 'Kofi kneels and drops a seed into a small hole, with a watering can beside him.', motif: '🕳️💧', brief: 'Close view of Kofi’s hands placing a seed, watering can, neat row of little holes.', narration: 'Slow and careful, matching the actions.' },
      { text: 'One day passed. Two days passed. Three days passed. Nothing came up. ‘Maybe the seeds are sleeping,’ said Kofi.', alt: 'Kofi looks closely at flat soil with his chin on his hands.', motif: '⏳😴', brief: 'Three small sun or moon marks in the sky to show days passing, Kofi peering at empty soil.', narration: 'Count the days slowly. Soft puzzled tone on "sleeping".' },
      { text: 'Kofi did not give up. Every morning he watered the soil and sang a little song. Then, one morning, he saw something small and green!', alt: 'Kofi sings while watering; a tiny green sprout pushes through the soil.', motif: '🎵🌱', brief: 'Kofi singing with watering can, one tiny green sprout glowing slightly in the foreground.', narration: 'Hum a few notes for the song. Gasp of delight before "something small and green".' },
      { text: 'Soon the garden grew tall. There were three red tomatoes. There were two green okra pods. ‘So many colours!’ said Kofi.', alt: 'A garden with three bright red tomatoes and two green okra pods on their plants.', motif: '🍅🌿', brief: 'Garden bed with three clearly separate red tomatoes and two green okra pods, easy to count.', narration: 'Pause after each number so a child can count along.' },
      { text: 'There were four yellow corn cobs. There were five orange carrots poking out of the soil. Kofi counted them all, one, two, three, four, five.', alt: 'Four yellow corn cobs on tall stalks and five orange carrot tops showing in the soil.', motif: '🌽🥕', brief: 'Four corn cobs and five carrot tops, clearly separated for counting. Kofi pointing as he counts.', narration: 'Slow counting, one beat per number.' },
      { text: 'Kofi picked a basket of vegetables for Maame. ‘Look, Maame, my garden has red, green, yellow and orange!’', alt: 'Kofi proudly holds up a basket of colourful vegetables to his smiling mother.', motif: '🧺🌈', brief: 'Kofi holding up a full basket, Maame smiling, rainbow of vegetables in the basket.', narration: 'Proud and joyful. Name each colour clearly.' },
      { text: 'That night they cooked a big pot of soup with the vegetables. Kofi smiled. ‘Waiting was hard, but it was worth it.’ The end.', alt: 'Kofi and his mother share a bowl of soup at a table by candlelight.', motif: '🍲😊', brief: 'Cosy evening kitchen, steaming pot, Kofi and Maame at the table.', narration: 'Warm, satisfied. Gentle pause before "The end".' },
    ],
    activities: [
      { id: 'kofi-c1', type: 'comprehension', afterPage: 4, question: 'What did Kofi do when nothing came up?', options: ['He kept watering', 'He threw the seeds away', 'He went to sleep'], correctIndex: 0, explanation: 'Kofi did not give up. He watered the soil every morning.' },
      { id: 'kofi-v1', type: 'vocabulary', afterPage: 8, word: 'patience', definition: 'Waiting calmly without giving up.', distractors: ['Running very fast', 'Being very loud'] },
      { id: 'kofi-seq', type: 'sequencing', afterPage: 8, prompt: 'What happened first, next and last?', items: ['Kofi planted the seeds.', 'A small green sprout came up.', 'Kofi picked a basket of vegetables.'] },
      { id: 'kofi-c2', type: 'comprehension', afterPage: 6, question: 'How many carrots were there?', options: ['Three', 'Four', 'Five'], correctIndex: 2 },
      { id: 'kofi-ph', type: 'phonics', afterPage: 6, targetSound: 'c', prompt: 'Which words start with the c sound?', options: ['corn', 'carrots', 'garden', 'okra'], correctIndexes: [0, 1] },
      { id: 'kofi-sel', type: 'sel', afterPage: 8, prompt: 'Is there something you waited for that was hard to wait for? How did you feel?', feelingOptions: ['Excited', 'Impatient', 'Proud', 'Calm'] },
    ],
    glossary: [
      { word: 'soil', definition: 'The brown earth where plants grow.', pages: [1, 2] },
      { word: 'seeds', definition: 'Tiny parts of a plant that grow into new plants.', pages: [1] },
      { word: 'okra', definition: 'A long green vegetable used in soups and stews.', pages: [5] },
      { word: 'basket', definition: 'A container woven from dry grass or reeds.', pages: [7] },
    ],
    narrationPlan: { voice: 'Friendly storyteller, Ghanaian English, bright and encouraging.', pace: 'Slow to medium; slower still on counting passages.', notes: ['Leave a beat after each number on pages 5 and 6 so children can count aloud.', 'Sing or hum the garden song briefly on page 4 (not a copyrighted tune).'] },
    music: 'Optional light, cheerful ambience (birdsong and soft marimba). Not created; needs a verified licence.',
    culturalNotes: ['Maame means "mother" in Akan. Okra, corn, tomatoes and carrots are common household garden crops.'],
    reviewQuestions: ['Are carrots a realistic crop for the intended audience, or should garden eggs or peppers replace them?', 'Counting range 1-5 suits KG 1-2; confirm.'],
  },
  // --------------------------------------------------------------------------------------------------------------------
  {
    key: 'clever-tortoise-and-the-rain', set: 'pilot', title: 'The Clever Tortoise and the Rain',
    summary: 'In a long dry season, a tortoise who watches carefully works out that rain is coming and gets everyone working together.',
    classification: base({
      classIds: ['primary-2', 'primary-3'], ageMin: 7, ageMax: 9, readingLevel: 'developing', difficulty: 3,
      genres: ['folktale', 'moral'], themes: ['community', 'helping-others'], objectives: ['reading-comprehension', 'inference', 'vocabulary', 'reasoning', 'teamwork', 'problem-solving'],
      ghanaianContext: 'central', culturalTags: ['village-life', 'proverb'], estimatedDurationSec: 330,
    }),
    palette: ['#ffe8d6', '#6b9080'],
    characters: ['Tortoise (Ɔkoto-style storyteller tortoise): old, slow, bright-eyed, with a patterned shell.', 'Hare: quick, quick to laugh, long ears.', 'Heron: tall, grey-white, calm.', 'Ants: a line of small ants carrying white eggs.'],
    pages: [
      { text: 'It had not rained for many weeks. The grass turned yellow and the river dried into a thin brown stream. All the animals were thirsty.', alt: 'A dry riverbed with a thin muddy stream, yellow grass and a few thirsty animals in the distance.', motif: '☀️🏜️', brief: 'Wide dry landscape, nearly dry river, yellow grass, heat haze. Animals small in the distance, drooping.', narration: 'Slow and heavy. Let the heat be felt in the pace.' },
      { text: 'Old Tortoise did not complain. Every day he walked slowly along the riverbank, and he watched everything. ‘If you look carefully,’ he liked to say, ‘the world will tell you its secrets.’', alt: 'An old tortoise with a patterned shell walks slowly along a dry riverbank, looking all around.', motif: '🐢👀', brief: 'Close portrait of Tortoise on the bank, wise eyes. Include small details: ants, birds, clouds far away.', narration: 'Tortoise’s saying slowly and warmly, like a grandparent.' },
      { text: 'One morning he saw a long line of ants hurrying uphill. Each ant carried a tiny white egg. ‘Why are the ants moving to high ground?’ he wondered.', alt: 'A line of ants each carrying a small white egg climbs a slope while the tortoise watches.', motif: '🐜🥚', brief: 'Macro view of ants carrying eggs up a slope, Tortoise’s curious face in the corner.', narration: 'Curious, wondering tone on the question.' },
      { text: 'Then he saw the swallows flying low over the ground, and he smelled something sweet and damp in the wind. ‘Rain is coming,’ said Tortoise. ‘I am sure of it.’', alt: 'Swallows skim low over the grass as the tortoise lifts his head to smell the wind.', motif: '🐦💨', brief: 'Swallows low over the grass, a darker line of cloud on the horizon, Tortoise sniffing the air.', narration: 'Quiet certainty. Slow down on "I am sure of it".' },
      { text: 'He told the others. Hare laughed so hard he rolled in the dust. ‘The sky is empty!’ said Hare. ‘Tortoise is too slow to know anything!’ Only Heron listened quietly.', alt: 'A hare rolls on the ground laughing while a tall heron listens quietly to the tortoise.', motif: '🐇😂', brief: 'Hare in comic laughter, Heron attentive, Tortoise calm. Keep the laughter friendly, not cruel.', narration: 'Hare’s voice quick and teasing. Heron’s voice calm and low.' },
      { text: '‘When the rain comes, it will run away down the hill,’ said Tortoise, ‘unless we dig a big hole to catch it. Then we will have water for many weeks.’ Heron nodded. ‘I will help.’', alt: 'The tortoise draws a plan in the dust with his foot while the heron nods.', motif: '🕳️🤝', brief: 'Tortoise drawing a circle in the dirt with a claw, Heron nodding, a hillside behind them.', narration: 'Thoughtful, explaining. Heron’s “I will help” is simple and firm.' },
      { text: 'Together they dug all afternoon. Slowly, other animals came to help, even the ants and the little birds. Hare watched for a while. Then, with a sigh, he picked up a stick and began to dig.', alt: 'Many animals dig a wide round hole together in the dry ground; the hare joins in with a stick.', motif: '⛏️🦜', brief: 'A busy dig site with animals of every size working together, Hare joining at the edge.', narration: 'Rhythm of work. Gentle humour on Hare’s sigh.' },
      { text: 'That night the sky grew dark. Thunder rolled across the hills, and the rain came down hard. It ran down the slope and poured into the big hole. By morning, the hole was full of fresh, clear water.', alt: 'At night, rain falls hard on a hillside and water runs into a wide round pond-hole.', motif: '⛈️💧', brief: 'Dramatic but safe night rain, lightning far away, water streaming into the dug hole. Comforting, not frightening.', narration: 'Build with the storm, then calm to wonder on the last sentence.' },
      { text: 'Every animal drank as much as they needed. Hare came to Tortoise with his ears drooping. ‘I am sorry I laughed,’ he said. ‘You looked carefully, and I did not.’', alt: 'Hare apologises to the tortoise beside the full pond while other animals drink.', motif: '🐇🙏', brief: 'Pond full of clear water, Hare bowing his head to Tortoise, other animals drinking in the background.', narration: 'Sincere and a little shy for Hare.' },
      { text: 'Tortoise smiled. ‘Slow is not the same as wrong,’ he said. ‘And a hole dug by many hands holds more water than one dug alone.’ From then on, the animals always listened when Tortoise spoke. The end.', alt: 'The tortoise smiles at the hare while the animals sit together by the pond at sunset.', motif: '🌅🐢', brief: 'Golden-hour scene, animals resting around the pond, Tortoise and Hare side by side.', narration: 'Warm and wise. Slow the final line. Pause before "The end".' },
    ],
    activities: [
      { id: 'tort-c1', type: 'comprehension', afterPage: 4, question: 'What clues told Tortoise that rain was coming?', options: ['Ants moving to high ground and low-flying swallows', 'A loud drum', 'A message from Hare'], correctIndex: 0, explanation: 'He noticed the ants carrying eggs uphill, the swallows flying low and the damp smell on the wind.' },
      { id: 'tort-inf', type: 'comprehension', afterPage: 7, question: 'Why did Hare begin to dig?', options: ['He saw that the others were working and wanted to help', 'He was told to by the king', 'He wanted to find gold'], correctIndex: 0, explanation: 'The text does not say it directly: we work it out from Hare watching and then sighing before he digs.' },
      { id: 'tort-v1', type: 'vocabulary', afterPage: 3, word: 'carefully', definition: 'Slowly, paying attention to details.', distractors: ['Loudly', 'Without thinking'] },
      { id: 'tort-seq', type: 'sequencing', afterPage: 10, prompt: 'Put these events in order.', items: ['Tortoise notices the ants and swallows.', 'The animals dig a big hole together.', 'The rain fills the hole with water.', 'Hare says sorry.'] },
      { id: 'tort-pred', type: 'prediction', afterPage: 5, prompt: 'Hare does not believe Tortoise. What do you think will happen next?', options: ['It will rain', 'Hare will be right', 'Nothing will happen'] },
      { id: 'tort-sel', type: 'sel', afterPage: 9, prompt: 'Hare said sorry. Think of a time you said sorry. How did it feel?', feelingOptions: ['Brave', 'Embarrassed', 'Relieved', 'Proud'] },
    ],
    glossary: [
      { word: 'riverbank', definition: 'The land along the side of a river.', pages: [2] },
      { word: 'thirsty', definition: 'Needing something to drink.', pages: [1] },
      { word: 'swallows', definition: 'Small birds that fly fast and often swoop low before rain.', pages: [4] },
      { word: 'slope', definition: 'Ground that goes up or down at an angle.', pages: [8] },
    ],
    narrationPlan: { voice: 'Experienced storyteller, Ghanaian English, with distinct (not cartoonish) voices for Tortoise, Hare and Heron.', pace: 'Medium (about 120 words per minute); slower for Tortoise.', notes: ['Folktale cadence with light call-and-response feel.', 'Storm passage can build in volume but must stay comfortable at classroom speaker levels.', 'Verify pronunciation of "swallows" and "riverbank" with the narrator.'] },
    music: 'Optional gentle drums and shaker underscore for the dig and the storm (ducked under narration). Not created; needs a verified licence.',
    culturalNotes: ['Trickster and wise-animal tales are widespread in Ghanaian oral tradition. This is an original retelling that borrows the tradition’s spirit, not a copy of any specific recorded tale.', 'A cultural reviewer should check that the portrayal of elders and community work feels authentic.'],
    reviewQuestions: ['Is the ending proverb natural? Consider whether a known Akan proverb would fit better.', 'Reading level: some sentences are long for Primary 2; consider simplifying pages 2 and 8.'],
  },
  // --------------------------------------------------------------------------------------------------------------------
  {
    key: 'aminas-first-day-at-school', set: 'pilot', title: 'Amina’s First Day at School',
    summary: 'Amina is nervous on her first day at school, but a kind teacher and a new friend help her feel brave.',
    classification: base({
      classIds: ['kg-2', 'primary-1'], ageMin: 5, ageMax: 7, readingLevel: 'early', difficulty: 2,
      genres: ['school-life', 'family'], themes: ['school', 'new-beginnings', 'friendship', 'fear-and-courage'], objectives: ['emotional-intelligence', 'vocabulary', 'sequencing', 'teamwork', 'oral-language'],
      ghanaianContext: 'incidental', culturalTags: ['local-names'], estimatedDurationSec: 210,
    }),
    palette: ['#e0f2fe', '#f6bd60'],
    characters: ['Amina: a girl of six with a bright smile, school uniform (blue and white), small red backpack.', 'Madam Abena: a friendly young teacher with a warm smile and a lanyard.', 'Salifu: a boy of six, cheerful, a little taller than Amina, same uniform.', 'Mama: Amina’s mother, in a bright headscarf.'],
    pages: [
      { text: 'Today was Amina’s first day at school. She put on her new blue and white uniform. Her tummy felt funny, like butterflies were dancing inside.', alt: 'A girl in a new school uniform stands by a mirror holding her tummy, looking nervous but smiling a little.', motif: '👧🦋', brief: 'Amina at home in her uniform, hand on her tummy, a few playful butterfly shapes around her tummy area (a drawing device, not real insects).', narration: 'Gentle and relatable. Smile on "butterflies were dancing".' },
      { text: 'Mama held her hand all the way to school. ‘It is okay to feel nervous,’ said Mama. ‘Everybody feels that way on a first day.’', alt: 'Amina walks to school holding her mother’s hand along a sunny road.', motif: '👩‍👧🏫', brief: 'Mother and daughter walking, school gate in the distance, morning sun.', narration: 'Mama’s voice is calm and reassuring.' },
      { text: 'At the gate, a bell went ding-dong! Children ran in from every side. Amina’s feet did not want to move. ‘I do not want to go in,’ she whispered.', alt: 'A busy school gate with children running in; Amina stands still holding her backpack straps.', motif: '🔔🏃', brief: 'Busy school gate, blurred running children, Amina still and small in the centre.', narration: 'Perform the bell. Slow and small on the whisper.' },
      { text: 'A smiling teacher came to the gate. ‘Good morning, Amina. I am Madam Abena. We have been waiting for you.’ She knelt down so that they were eye to eye.', alt: 'A friendly teacher kneels at the school gate to speak to Amina at her height.', motif: '👩‍🏫😊', brief: 'Madam Abena kneeling, eye to eye with Amina, warm expression.', narration: 'Madam Abena: bright and kind, never rushed.' },
      { text: 'In the classroom, Amina sat down next to a boy named Salifu. ‘Do you like crayons?’ he asked. ‘I have a red one, a blue one and a yellow one.’', alt: 'Two children sit at a shared desk; the boy holds out three crayons.', motif: '🖍️👦', brief: 'Shared desk, Salifu offering three crayons, Amina listening shyly.', narration: 'Salifu cheerful and friendly. Name the colours clearly.' },
      { text: 'Amina took the yellow crayon and drew a big sun. Salifu drew a tree. Soon the butterflies in her tummy were quiet.', alt: 'The two children draw a sun and a tree together on one sheet of paper.', motif: '☀️🌳', brief: 'Close view of a shared drawing: big yellow sun and green tree, both children smiling.', narration: 'Calm, easing. Slow on "quiet".' },
      { text: 'At break time, Amina and Salifu played a clapping game with the other children. Amina laughed so much that she forgot she had been nervous.', alt: 'A group of children play a clapping game in the school yard, Amina laughing.', motif: '👏🎉', brief: 'Playground circle, children clapping in pairs, Amina laughing with Salifu.', narration: 'Lively, with a bouncy clapping rhythm.' },
      { text: 'When school ended, Mama was waiting at the gate. ‘How was your first day?’ she asked. Amina smiled. ‘I made a friend, and I will go again tomorrow!’ The end.', alt: 'Amina runs to her mother at the gate, smiling and waving a drawing.', motif: '🤗🏠', brief: 'Afternoon light, Amina running to Mama waving her drawing.', narration: 'Joyful. Pause before "The end".' },
    ],
    activities: [
      { id: 'amina-c1', type: 'comprehension', afterPage: 3, question: 'How did Amina feel at the school gate?', options: ['Nervous', 'Angry', 'Sleepy'], correctIndex: 0, explanation: 'Her feet did not want to move and she whispered that she did not want to go in.' },
      { id: 'amina-c2', type: 'comprehension', afterPage: 6, question: 'What helped Amina feel better?', options: ['Drawing and talking with Salifu', 'Going home', 'Hiding under the desk'], correctIndex: 0 },
      { id: 'amina-seq', type: 'sequencing', afterPage: 8, prompt: 'Put Amina’s day in order.', items: ['Amina put on her uniform.', 'Madam Abena met Amina at the gate.', 'Amina and Salifu drew a picture.', 'Mama met Amina after school.'] },
      { id: 'amina-v', type: 'vocabulary', afterPage: 4, word: 'nervous', definition: 'Feeling a little worried or scared about something new.', distractors: ['Feeling very hungry', 'Feeling very strong'] },
      { id: 'amina-ph', type: 'phonics', afterPage: 5, targetSound: 'cr', prompt: 'Which word starts with cr, like crayon?', options: ['crayon', 'sun', 'tree', 'clapping'], correctIndexes: [0] },
      { id: 'amina-sel', type: 'sel', afterPage: 8, prompt: 'What can you do to help a new child feel welcome at your school?', feelingOptions: ['Kind', 'Brave', 'Friendly', 'Caring'] },
    ],
    glossary: [
      { word: 'uniform', definition: 'Special clothes that children wear to school.', pages: [1] },
      { word: 'nervous', definition: 'Feeling a little worried about something new.', pages: [2] },
      { word: 'crayons', definition: 'Coloured sticks of wax used for drawing.', pages: [5] },
      { word: 'classroom', definition: 'A room in a school where children learn.', pages: [5] },
    ],
    narrationPlan: { voice: 'Warm, reassuring storyteller, Ghanaian English. Different gentle voices for Mama, Madam Abena and Salifu.', pace: 'Slow to medium (about 110 words per minute).', notes: ['The bell is performed vocally ("ding-dong") on page 3.', 'Amina’s whisper must stay audible on classroom speakers.'] },
    music: 'Optional light school-morning ambience (distant children, soft guitar). Not created; needs a verified licence.',
    culturalNotes: ['Amina and Salifu are common Muslim names in northern Ghana; Madam Abena is an Akan day name. Names are chosen to reflect Ghana’s diversity and need reviewer confirmation.', 'Uniform colours are illustrative; a reviewer should confirm they feel typical.'],
    reviewQuestions: ['Should the school setting be made more specific (town or region) or kept general?', 'Is the word "nervous" appropriate for KG 2 or should it be "worried"?'],
  },
  // --------------------------------------------------------------------------------------------------------------------
  {
    key: 'little-star-that-loved-to-shine', set: 'pilot', title: 'The Little Star That Loved to Shine',
    summary: 'A very small star thinks she is too tiny to matter, until her light guides a traveller home.',
    classification: base({
      classIds: ['nursery-1', 'nursery-2', 'kg-1'], ageMin: 2, ageMax: 5, readingLevel: 'pre-reader', difficulty: 1,
      genres: ['bedtime', 'fantasy'], themes: ['night-sky', 'helping-others', 'new-beginnings'], objectives: ['oral-language', 'emotional-intelligence', 'perseverance', 'kindness', 'vocabulary'],
      ghanaianContext: 'none', estimatedDurationSec: 150,
    }),
    palette: ['#1b2a49', '#f9c74f'],
    characters: ['Little Star: a very small, round, glowing star with a gentle smiling face.', 'Big Star and Moon: large, kind and calm.', 'Traveller: a woman carrying a bundle on her head, walking home along a path at night.'],
    pages: [
      { text: 'High in the night sky lived a little star. She was very, very small. But she loved to shine.', alt: 'A tiny glowing star with a smiling face high in a dark blue sky among bigger stars.', motif: '⭐🌙', brief: 'Deep indigo sky, many stars, one small golden star with a face in the centre.', narration: 'Slow, hushed, lullaby-like. Elongate "very, very small".' },
      { text: 'Shine, shine, shine, went the little star. But the big stars were so bright, and nobody noticed her.', alt: 'The little star glows beside much bigger, brighter stars.', motif: '✨🌟', brief: 'Little star glowing next to huge bright stars that look almost like suns.', narration: 'A gentle chant on "shine, shine, shine".' },
      { text: '‘I am too small,’ sighed the little star. ‘Nobody needs a tiny light like mine.’ And she felt a little sad.', alt: 'The little star looks down, her glow dimmer, looking sad.', motif: '😔⭐', brief: 'Little star with downcast expression, softer glow.', narration: 'Soft and sad, but not heavy.' },
      { text: 'The Moon heard her sigh. ‘Little star,’ said the Moon, ‘keep shining. Every light has a job to do.’', alt: 'A big kind moon speaks to the little star in the night sky.', motif: '🌙💬', brief: 'Gentle crescent moon with a kind face, little star looking up to it.', narration: 'Moon: deep, slow and comforting.' },
      { text: 'Far below, a traveller was walking home. The path was dark, and the big stars were hiding behind a cloud.', alt: 'A woman carrying a bundle walks along a dark path under a cloud-covered sky.', motif: '🚶‍♀️☁️', brief: 'Dark path through gentle hills, a woman with a bundle on her head walking, cloud covering most stars.', narration: 'Quiet, a little tense but safe. Slow, whispering.' },
      { text: '‘Oh dear,’ said the traveller. ‘I cannot see the path.’ Then she saw a tiny light peeping through a gap in the cloud.', alt: 'The traveller looks up as one small star shines through a gap in the clouds.', motif: '🌌👀', brief: 'A single gap in the clouds with the little star shining, the traveller looking up in hope.', narration: 'Pause before "Then she saw". Wonder.' },
      { text: 'Shine, shine, shine, went the little star, as bright as she could. The traveller followed the tiny light, one step, two steps, three steps.', alt: 'The traveller follows a faint path of starlight along the ground.', motif: '🌠👣', brief: 'A soft pool of starlight on the path, footsteps leading along it.', narration: 'Count steps slowly. The "shine" chant returns, more confident.' },
      { text: 'Soon the traveller was safe at home. ‘Thank you, little star,’ she whispered. The little star smiled. Now she knew that even a small light can help. Goodnight, little star. The end.', alt: 'The traveller waves at the sky from her doorway as the little star twinkles above.', motif: '🏠💤', brief: 'Warm lit doorway, the traveller waving at the sky, little star glowing happily.', narration: 'Whisper. Slow right down, like falling asleep. Long pause before "The end".' },
    ],
    activities: [
      { id: 'star-c1', type: 'comprehension', afterPage: 4, question: 'How did the little star feel at first?', options: ['Sad because she was small', 'Angry at the Moon', 'Hungry'], correctIndex: 0 },
      { id: 'star-c2', type: 'comprehension', afterPage: 8, question: 'Who did the little star help?', options: ['The traveller', 'The Moon', 'A big star'], correctIndex: 0 },
      { id: 'star-pred', type: 'prediction', afterPage: 5, prompt: 'The path is dark and the big stars are hiding. What do you think will happen?' },
      { id: 'star-seq', type: 'sequencing', afterPage: 8, prompt: 'What happened first, next and last?', items: ['The little star felt too small.', 'The traveller could not see the path.', 'The star’s light showed her the way home.'] },
      { id: 'star-sel', type: 'sel', afterPage: 8, prompt: 'Have you ever felt small? What can you do that is special?', feelingOptions: ['Small', 'Proud', 'Happy', 'Brave'] },
    ],
    glossary: [
      { word: 'traveller', definition: 'A person who is going on a journey.', pages: [5, 6] },
      { word: 'path', definition: 'A narrow track for walking.', pages: [5, 6] },
      { word: 'cloud', definition: 'A white or grey shape in the sky made of tiny drops of water.', pages: [5, 6] },
    ],
    narrationPlan: { voice: 'Soft, soothing lullaby-style storyteller (en-GH or en-GB). Slightly deeper voice for the Moon.', pace: 'Very slow (about 90 words per minute); designed to be a bedtime read.', notes: ['The "Shine, shine, shine" chant is a repeated refrain: keep the rhythm identical each time.', 'Final page should fade into a whisper.'] },
    music: 'Optional gentle music-box lullaby (original composition or properly licensed). Ducks under narration. Not created.',
    culturalNotes: ['The story is universal and sets no specific culture. A Ghanaian version (traveller, setting, names) could be offered later as a localised variant.'],
    reviewQuestions: ['Should the traveller and path be made explicitly Ghanaian (a village path)?', 'Is "peeping" a known word for this age or should it be "shining"?'],
  },
  // --------------------------------------------------------------------------------------------------------------------
  {
    key: 'efuas-honest-business', set: 'benchmark', title: 'Efua’s Honest Business',
    summary: 'Efua starts a small after-school business selling groundnut cakes and must decide how far to go to win more customers.',
    classification: base({
      classIds: ['primary-6', 'jhs-1', 'jhs-2'], ageMin: 11, ageMax: 14, readingLevel: 'proficient', difficulty: 4,
      genres: ['realistic-fiction', 'school-life'], themes: ['money-and-enterprise', 'peer-pressure', 'community'], objectives: ['inference', 'critical-thinking', 'financial-literacy', 'honesty', 'reasoning'],
      ghanaianContext: 'central', culturalTags: ['local-food', 'market', 'local-names'], estimatedDurationSec: 330,
    }),
    palette: ['#f1faee', '#e76f51'],
    characters: ['Efua: a girl of thirteen, JHS uniform, practical and thoughtful.', 'Nana Ama: her grandmother, patient and wise.', 'Kwabena: her classmate, confident and always looking for shortcuts.', 'Auntie Dede: a market trader who gives Efua advice.'],
    pages: EFUA_PAGES,
    activities: EFUA_ACTIVITIES,
    glossary: EFUA_GLOSSARY,
    teacherGuide: EFUA_TEACHER_GUIDE,
    illustrationPlan: EFUA_ILLUSTRATION_PLAN,
    narrationPlan: { voice: 'Natural, mature storyteller, Ghanaian English. Subtle character differences, no caricature.', pace: 'Medium (about 140 words per minute).', notes: ['Numbers must be spoken clearly and consistently with the text (check twelve, eight, forty, twenty, twenty-five, eleven, nine, thirteen).', 'Names go through the pronunciation dictionary; all entries are still awaiting native-speaker review.'] },
    music: 'No background music: text-first reading experience for older learners. Optional soft ambience toggle only.',
    culturalNotes: ['Groundnut cakes (nkate cake and similar sweets) are a familiar local treat; a reviewer should confirm the recipe description and the realism of prices in cedis for the intended year.', 'The names are Akan day names (Efua, Kwabena, Ama); Dede’s origin must be confirmed.'],
    reviewQuestions: ['Are the prices realistic for the intended region and year? (Amounts are illustrative.)', 'Does the dilemma suit JHS and avoid moralising?', 'Is the groundnut-cake recipe description (roasted groundnuts and sugar) right for what learners know as groundnut cakes?', 'Is the cost-per-pack arithmetic (65 pesewas, 13 cedis for twenty) consistent everywhere?'],
  },
  {
    key: 'yaa-and-the-blocked-drain', set: 'sample', title: 'Yaa and the Blocked Drain',
    summary: YAA_DRAIN.summary,
    classification: base({ classIds: ['primary-4'], ageMin: 9, ageMax: 10, readingLevel: 'developing', difficulty: 3, genres: ['realistic-fiction', 'science', 'educational'], themes: ['community', 'citizenship', 'weather'], objectives: ['environmental-awareness', 'scientific-curiosity', 'problem-solving', 'responsibility'], ghanaianContext: 'central', culturalTags: ['local-names', 'village-life'], estimatedDurationSec: 330 }),
    palette: ['#e0f2fe', '#2a9d8f'],
    characters: YAA_DRAIN.characters,
    pages: YAA_DRAIN.pages,
    activities: YAA_DRAIN.activities,
    glossary: YAA_DRAIN.glossary,
    teacherGuide: YAA_DRAIN.teacherGuide,
    narrationPlan: { voice: 'Clear, lively storyteller (en-GH or en-GB); a curious, determined girl’s voice for Yaa without imitating a child.', pace: 'Medium (about 120 words per minute).', notes: ['Say forty-two and six clearly.', 'Names go through the pronunciation dictionary (unverified).'] },
    music: 'Optional gentle rain ambience on the first pages; off by default. Not created.',
    culturalNotes: YAA_DRAIN.culturalNotes,
    reviewQuestions: YAA_DRAIN.reviewQuestions,
  },
  {
    key: 'kofi-counts-the-market', set: 'sample', title: 'Kofi Counts the Market',
    summary: KOFI_MARKET.summary,
    classification: base({ classIds: ['kg-2'], ageMin: 5, ageMax: 6, readingLevel: 'emergent', difficulty: 1, genres: ['educational', 'family'], themes: ['food', 'family'], objectives: ['counting', 'phonics', 'oral-language', 'vocabulary'], ghanaianContext: 'central', culturalTags: ['market', 'local-names'], estimatedDurationSec: 240 }),
    palette: ['#fff3c4', '#f4a261'],
    characters: KOFI_MARKET.characters,
    pages: KOFI_MARKET.pages,
    activities: KOFI_MARKET.activities,
    glossary: KOFI_MARKET.glossary,
    teacherGuide: KOFI_MARKET.teacherGuide,
    narrationPlan: { voice: 'Warm, playful storyteller for young children (en-GH or en-GB).', pace: 'Slow (about 90 words per minute); count with a gentle beat.', notes: ['Counting must match the objects on the page exactly.', 'Names go through the pronunciation dictionary (unverified).'] },
    music: 'Optional light marimba-style counting jingle (original, not created).',
    culturalNotes: KOFI_MARKET.culturalNotes,
    reviewQuestions: KOFI_MARKET.reviewQuestions,
  },
  ...BATCH_1_STORIES,
  ...BATCH_2_STORIES,
  ...BATCH_3_STORIES,
  ...BATCH_4_STORIES.map((s) => ({ ...s, teacherGuide: normalizeTeacherGuide(s.teacherGuide, s.culturalNotes) })),
  ...BATCH_5_STORIES.map((s) => ({ ...s, teacherGuide: normalizeTeacherGuide(s.teacherGuide, s.culturalNotes) })),
  ...BATCH_6_STORIES.map((s) => ({ ...s, teacherGuide: normalizeTeacherGuide(s.teacherGuide, s.culturalNotes) })),
  ...BATCH_7_STORIES.map((s) => ({ ...s, teacherGuide: normalizeTeacherGuide(s.teacherGuide, s.culturalNotes) })),
  ...BATCH_8_STORIES.map((s) => ({ ...s, teacherGuide: normalizeTeacherGuide(s.teacherGuide, s.culturalNotes) })),
  ...BATCH_10_STORIES.map((s) => ({ ...s, teacherGuide: normalizeTeacherGuide(s.teacherGuide, s.culturalNotes) })),
  ...BATCH_11_STORIES.map((s) => ({ ...s, teacherGuide: normalizeTeacherGuide(s.teacherGuide, s.culturalNotes) })),
  ...BATCH_12_STORIES.map((s) => ({ ...s, teacherGuide: normalizeTeacherGuide(s.teacherGuide, s.culturalNotes) })),
  ...BATCH_13_STORIES.map((s) => ({ ...s, teacherGuide: normalizeTeacherGuide(s.teacherGuide, s.culturalNotes) })),
];

export const pilotStory = (key: string) => PILOT_STORIES.find((s) => s.key === key);
