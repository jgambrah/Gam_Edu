/**
 * Batch 13: seven "unsolved mystery" stories told through Ghanaian pupils who ask WHY each thing is a mystery:
 * the yeti ("snow giant"), the giant squid ("kraken") washed up on Spain's coast, the Oak Island "Money Pit",
 * Stonehenge, the Great Pyramid, Nzulezo (Ghana's village on stilts) and the lost capital of the ancient Ghana Empire.
 *
 * Rules: every story separates what we KNOW from what we DON'T and says plainly which parts are solved, partly solved
 * or open; legends are respected as stories, not mocked; no one is told a mystery is "magic" or "aliens"; children are
 * shown asking for evidence and saying "we don't know yet" without shame; safety notes where a story could inspire
 * risky copying (digging near the sea, climbing monuments, touching washed-up animals). Facts come from the sources
 * in each factCheck. All stories are drafts awaiting review.
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

export const BATCH_13_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-snow-giant-of-the-himalayas',
    title: 'The Snow Giant of the Himalayas',
    summary: 'Selinam and Rashid hear about the yeti, the “snow giant” of the Himalayan mountains. With Madam Lomotey, they look at what scientists tested, what turned out to be bears, and why the story is still told.',
    classIds: ['primary-3', 'primary-4', 'primary-5'],
    ageMin: 8,
    ageMax: 11,
    readingLevel: 'fluent',
    difficulty: 3,
    genres: ['mystery', 'informational', 'educational'],
    themes: ['animals-and-habitats', 'school', 'friendship'],
    objectives: ['critical-thinking', 'scientific-curiosity', 'reasoning', 'vocabulary'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 115,
    paceWord: 'Curious and lively, with a hush for the legend',
    palette: ['#1e3a8a', '#e0f2fe'],
    voice: 'Lively storyteller voice; Madam Lomotey is warm and clear',
    characters: [
      'Selinam: a 10-year-old girl in a school uniform with two puffs of hair, holding a notebook.',
      'Rashid: her friend, 10, in a white shirt and brown shorts, who loves big animals.',
      'Madam Lomotey: their teacher, in a green dress, holding a world map.',
      'The yeti legend: a tall, shaggy, ape-like figure in snow far away, drawn as a story picture.',
      'A Himalayan brown bear: a big shaggy brown bear in snow.',
    ],
    music: 'Cold wind, soft flute, a playful beat when the class investigates (placeholder)',
    pages: [
      pg('🏔️', 'In Madam Lomotey’s classroom, the world map showed a long wrinkle of white on the far side of the world: the Himalayas, the tallest mountains on Earth. “Today’s mystery,” she said, “is a creature that people there have talked about for a long time. They call it the yeti, or snow giant.”', 'A teacher points to the Himalayas on a world map in a Ghanaian classroom.'),
      pg('👣', '“Tall, hairy, walks on two legs,” said Rashid, reading a card. “Some people say they have seen huge footprints in the snow. Some say they have seen a giant shape far away.” Selinam raised her hand. “But has anyone caught one?” “No,” said Madam Lomotey. “That is why it is a mystery.”', 'Children read a card about the yeti while one raises her hand.'),
      pg('❓', '“A mystery needs more than a story,” said Madam Lomotey. “It needs a question we can test.” Selinam wrote three questions: What did people see? What evidence is there, like hair, bones or footprints? And what could the evidence be?', 'A girl writes three questions on the board.'),
      pg('🧪', '“Scientists did test the evidence,” said Madam. “In 2017, a team led by Dr Charlotte Lindqvist studied hair, teeth, bone and other samples from the Himalayas that people said were from yetis. Nine of them came from museums and private collections.” “And?” asked Rashid. “And,” said Madam, “they used DNA, a code inside every living thing.”', 'A scientist looks at a hair sample under a microscope.'),
      pg('🐻', '“What was the result?” “Nearly all the samples came from bears: Himalayan brown bears, Tibetan brown bears and one Asian black bear. One sample came from a dog.” Rashid’s eyes went wide. “So the snow giant was a bear?” “Those samples were,” said Madam. “That is a real answer.”', 'A shaggy brown bear stands in snow beside a scientist’s chart.'),
      pg('🧠', '“But does it solve everything?” asked Selinam. “Think like a scientist,” said Madam. “The study tested those samples. It did not search every mountain for ever. And it can explain why people may have mistaken bears for giants: bears can stand on two legs and leave big prints. But it cannot tell us what every person saw.”', 'Children think with thought bubbles showing a bear standing and big footprints.'),
      pg('📖', '“So why do people still tell the story?” asked Rashid. Madam smiled. “Stories are about more than evidence. In the high mountains, people have told yeti stories for generations, and for some they carry feelings about the mountains: huge, wild and not fully known. A good scientist respects a story and still asks for proof.”', 'Elders and children sit around a fire while a teacher listens.'),
      pg('✅', 'At the end, the class made two lists. Solved: the tested samples came from bears. Not solved: what some people saw, and whether any unknown animal lives there. “We do not have to pretend,” said Selinam. “We can write: we do not know yet.” Madam Lomotey nodded. “That,” she said, “is the best answer a scientist can give.” The end.', 'A classroom board with two columns, Solved and Not solved, and a drawing of a bear.'),
    ],
    activities: [
      { id: 'yeti-c1', type: 'comprehension', afterPage: 5, question: 'What did the DNA study find about the tested “yeti” samples?', options: ['Nearly all came from bears', 'They came from a giant ape', 'They came from a mountain goat'], correctIndex: 0 },
      { id: 'yeti-p1', type: 'prediction', afterPage: 4, prompt: 'Scientists have hair, teeth and bone samples. What could DNA tell them about the animal?', options: ['Which kind of animal each sample came from', 'The animal’s name in a local language', 'How tall the animal stood'] },
      { id: 'yeti-c2', type: 'comprehension', afterPage: 6, question: 'Why does the DNA result not solve every part of the mystery?', options: ['It tested only some samples and cannot explain what every person saw', 'The scientists lost the samples', 'Bears do not live in the Himalayas'], correctIndex: 0 },
      { id: 'yeti-voc', type: 'vocabulary', afterPage: 4, word: 'evidence', definition: 'Facts or objects that help show whether something is true.', distractors: ['A kind of mountain', 'A type of footprint'] },
      { id: 'yeti-s1', type: 'sequencing', prompt: 'Put the investigation in order.', items: ['People told stories of a snow giant.', 'Scientists collected hair and other samples.', 'DNA tests showed nearly all were from bears.', 'The class listed what was solved and not solved.'] },
      { id: 'yeti-sel', type: 'sel', afterPage: 8, prompt: 'Selinam said “we do not know yet.” How does it feel to say that when you are not sure?', feelingOptions: ['Curious', 'Unsure', 'Honest', 'Proud'] },
    ],
    glossary: [
      { word: 'yeti', definition: 'A tall, hairy creature in stories from the Himalayan mountains.', pages: [1] },
      { word: 'DNA', definition: 'A code inside living things that tells what kind of living thing they are.', pages: [4] },
      { word: 'evidence', definition: 'Facts or objects that help show what is true.', pages: [3] },
      { word: 'mystery', definition: 'Something that is not yet explained.', pages: [2] },
    ],
    culturalNotes: ['The Himalayas are on the other side of the world from Ghana. The pupils, school and teacher are invented. People in the Himalayas hold the yeti stories as part of their own culture, and the story treats them with respect.', 'Ghana has its own stories of forest creatures. Pupils may share them to compare how communities explain the unknown.'],
    reviewQuestions: ['Check the DNA-study figures against the paper: Lindqvist et al., Proceedings of the Royal Society B, 2017 (nine “yeti” samples among 24 in total; mostly bears; one dog tooth).', 'Is the explanation of why bears might be mistaken for a yeti stated carefully as a possibility and not a certainty?'],
    guide: {
      overview: 'A “partly solved” mystery. It shows that science can answer one part of a story (what the tested samples were) while leaving other parts open.',
      lessonMinutes: 40,
      goals: ['Explain what evidence and DNA are in simple terms.', 'Separate what is solved from what is still unknown.', 'Show respect for stories and ask for proof.'],
      subjects: [['Integrated Science', 'Animals and evidence'], ['Social Studies / Geography', 'Mountains of the world'], ['English Language', 'Fact and legend']],
      before: ['Locate the Himalayas on a map. Ask: what stories do you know about forest creatures?'],
      during: ['At page 5, ask: does this solve everything?'],
      after: ['Make two lists, Solved and Not solved, for another legend.', 'Compare a yeti story with a Ghanaian forest story.'],
      discussion: ['Why is it important to test samples?', 'Why do people keep telling the story?'],
      reflection: ['What is a mystery you would like to solve?'],
      maths: [{ task: 'In the study, 9 samples were labelled “yeti”. If 8 were bears and 1 was a dog, what fraction were bears?', answer: '8 out of 9, or 8/9.' }],
      support: ['Provide a Solved / Not solved table with pictures.'],
      stretch: ['Write a short report: “What the DNA can and cannot tell us.”'],
      localise: ['Invite elders to share local forest stories and discuss how people explain things they cannot see.', 'Keep the tone respectful of every culture’s stories.'],
      discoveryStatus: {
        whatWeKnow: ['Nearly all the samples tested in the 2017 study came from bears, with one from a dog.', 'Bears can stand on two legs and leave large footprints.'],
        whatWeAreStillDiscovering: ['What every person who reported a yeti actually saw.', 'Whether any unknown large animal lives in the high mountains (there is no evidence so far).'],
      },
      factCheck: [{ claim: 'A 2017 study by Charlotte Lindqvist’s team tested samples said to be yeti; they came from Himalayan and Tibetan brown bears and an Asian black bear, with one dog sample; the study linked legends to real bears.', explanation: 'From National Geographic’s report. Sample counts differ in the article: nine “yeti” samples, 24 in all.', reference: 'National Geographic, “Yeti legends: real animals, DNA, bears, Himalaya, science” (2017); original paper in Proceedings of the Royal Society B.' }],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-kraken-of-the-spanish-coast',
    title: 'The Kraken of the Spanish Coast',
    summary: 'Ekuba and Nsiah study a real giant squid that washed up on a beach in Spain, centuries after sailors’ tales of the kraken. They learn why such a huge animal stayed hidden for so long and what is still unknown about it.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'fluent',
    difficulty: 3,
    genres: ['mystery', 'science', 'informational'],
    themes: ['animals-and-habitats', 'technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'critical-thinking', 'vocabulary'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Wide-eyed and curious, slowing at the deep sea',
    palette: ['#075985', '#0f172a'],
    voice: 'Excited, curious storyteller voice; Mr Okine is calm and clear',
    characters: [
      'Ekuba: a 11-year-old girl with braids, a school uniform, holding a tape measure.',
      'Nsiah: her classmate, 11, with a cap and a drawing pad, who loves the sea.',
      'Mr Okine: their teacher, in a checked shirt, holding a photo of a beach.',
      'The giant squid: a huge pale-pink squid with two long tentacles, eight arms and a very large eye.',
      'A Spanish beach: a pale beach with grey cliffs and a washed-up giant squid.',
    ],
    music: 'Deep ocean hum with a curious marimba theme (placeholder)',
    pages: [
      pg('🦑', 'Mr Okine showed his class a photo of a beach in Spain with an enormous, pale, soft shape lying on the sand. “What do you think this is?” “A sea monster!” said Nsiah. “Close,” said Mr Okine. “Sailors used to tell stories of a monster called the kraken. This is a real animal: a giant squid.”', 'A teacher shows a photograph of a giant squid on a beach to a class.'),
      pg('📏', 'On the beach in Cantabria, in northern Spain, the squid was about 9 metres long and weighed about 180 kilograms. Ekuba laid her tape measure along the classroom floor. “That is longer than this classroom!” “Nearly,” said Mr Okine. “And that is only one animal.”', 'A girl measures the classroom floor to compare it with a giant squid.'),
      pg('❓', '“So why is it a mystery?” asked Ekuba. “Because for most of history,” said Mr Okine, “nobody had seen one alive in its home. They live deep in the ocean, where it is dark and cold. Most of what we knew came from dead animals washed ashore or caught in nets.”', 'A diagram shows the deep ocean far below a ship, dark and cold.'),
      pg('📹', '“In 2012, a team led by a zoologist named Tsunemi Kubodera filmed a giant squid in its natural home for the first time. It was near some islands in Japan. They followed it down to about 900 metres.” “Only in 2012?” said Nsiah. “Yes. Very recently,” said Mr Okine.', 'A camera on a small submersible films a squid in the deep ocean.'),
      pg('👁️', 'Ekuba listed what scientists know: a giant squid has eight arms and two longer feeding tentacles, a hard beak, and the biggest eyes of any animal. Nsiah drew it. “Why such big eyes?” “Probably to see faint light in the deep,” said Mr Okine. “That is a scientific guess, not a proven fact.”', 'A student draws a giant squid with huge eyes while another writes a list.'),
      pg('🧭', '“What do we still not know?” asked Ekuba. “Many things,” said Mr Okine. “Where they live and travel, how many there are, how long they live, how they find each other, and what they do for most of their lives. Remember: not seen does not mean not real. And seen once does not mean we know everything.”', 'A board lists questions: where, how many, how long, how.'),
      pg('📖', '“What about the kraken?” asked Nsiah. “Old stories may have grown from real sightings of giant squid,” said Mr Okine, “but we cannot prove it. Stories often start from something real and then grow.” Nsiah wrote: Kraken stories: maybe a real squid. Big stories get bigger.', 'A drawing of an old sailing ship with a giant tentacle rising from the sea.'),
      pg('✅', 'At the end, Ekuba stood up. “The mystery of whether giant squid are real is solved,” she said. “The mystery of how they live is still open.” Mr Okine smiled. “That is how most science works,” he said. “One answer, and then ten better questions.” The end.', 'A girl presents two columns on the board, Solved and Open.'),
    ],
    activities: [
      { id: 'squid-c1', type: 'comprehension', afterPage: 3, question: 'Why had scientists not seen a giant squid alive in its home for so long?', options: ['They live deep in the dark ocean', 'They hide inside shells', 'They only live in rivers'], correctIndex: 0 },
      { id: 'squid-p1', type: 'prediction', afterPage: 4, prompt: 'A team follows a giant squid down to about 900 metres. What do you think the camera lights will show?', options: ['A squid in dark water', 'A bright blue sky', 'A sandy beach'] },
      { id: 'squid-c2', type: 'comprehension', afterPage: 5, question: 'Which of these is something scientists still do not know?', options: ['How long giant squid live and how many there are', 'Whether the sea is salty', 'How many arms squid have'], correctIndex: 0 },
      { id: 'squid-voc', type: 'vocabulary', afterPage: 3, word: 'tentacle', definition: 'A long, flexible arm-like limb of some sea animals.', distractors: ['A kind of fin', 'A type of shell'] },
      { id: 'squid-s1', type: 'sequencing', prompt: 'Put the story of the giant squid in order.', items: ['Sailors told tales of a kraken.', 'Dead giant squid washed ashore.', 'In 2012, scientists filmed one alive in the deep ocean.', 'Scientists keep asking how they live.'] },
      { id: 'squid-sel', type: 'sel', afterPage: 8, prompt: 'The class found that one answer led to ten new questions. How do you feel about questions that have no answer yet?', feelingOptions: ['Curious', 'Excited', 'Patient', 'Impatient'] },
    ],
    glossary: [
      { word: 'kraken', definition: 'A giant sea monster in old sailors’ stories.', pages: [1] },
      { word: 'tape', definition: 'A flexible ruler used to measure length.', pages: [2] },
      { word: 'tentacles', definition: 'Long, flexible arm-like limbs of some sea animals.', pages: [5] },
      { word: 'zoologist', definition: 'A scientist who studies animals.', pages: [4] },
    ],
    culturalNotes: ['Ghana’s coast, fishing communities and sea stories give pupils their own ways to talk about the ocean’s unknowns. The pupils and teacher here are invented.', 'The story treats the kraken as a legend and the giant squid as a real animal; it does not claim the legend was proven to start with squid.'],
    reviewQuestions: ['The request said “the creature in the sea of Spain.” This story assumes the giant squid washed up on a Spanish beach. If the request meant a different creature (for example a Mediterranean “sea monster” story), say so and this story can be replaced.', 'Check the beach details (La Arena, Cantabria; about 9 m; about 180 kg) and the first-live-footage details (Kubodera, 2012, near the Ogasawara Islands, about 900 m).'],
    guide: {
      overview: 'A partly solved mystery: giant squid are real, but how they live is still largely unknown. The story links an old sailors’ legend to a modern deep-sea discovery.',
      lessonMinutes: 40,
      goals: ['Explain why deep-sea animals are hard to study.', 'Distinguish a legend from a recorded animal.', 'List what is known and what is still unknown.'],
      subjects: [['Integrated Science', 'Ocean animals'], ['Mathematics', 'Measuring length'], ['English Language', 'Fact and legend']],
      before: ['Ask: how do we study animals that live where we cannot go?'],
      during: ['At page 2, measure 9 metres along a corridor or the school yard.'],
      after: ['Design a robot camera for the deep sea.', 'Write a kraken legend, then a fact sheet about the real squid.'],
      discussion: ['Why can something be real and still unseen?', 'How could a real animal grow into a monster story?'],
      reflection: ['What deep-sea question would you like answered?'],
      maths: [{ task: 'A squid is 9 m long. A classroom is 7 m long. How much longer is the squid?', answer: '2 m longer.' }, { task: 'The squid weighed about 180 kg. How many 60 kg adults would that equal?', answer: '180 ÷ 60 = 3 adults.' }],
      support: ['Provide a labelled picture of a squid.'],
      stretch: ['Research another animal that was a legend before scientists confirmed it.'],
      localise: ['Link to Ghana’s fishing communities and local sea stories.', 'Never touch or approach strange animals washed up on a beach; tell an adult.'],
      discoveryStatus: {
        whatWeKnow: ['Giant squid are real animals and one was washed ashore in northern Spain.', 'One was first filmed alive in its natural home in 2012.'],
        whatWeAreStillDiscovering: ['How many there are, where they travel, how long they live and how they behave.'],
      },
      factCheck: [{ claim: 'A giant squid about 9 m long and about 180 kg washed ashore on La Arena beach in Cantabria, Spain.', explanation: 'From an NBC News report.', reference: 'NBC News, “Elusive giant squid washes up on Spanish beach.”' }, { claim: 'In 2012 a team led by Tsunemi Kubodera recorded the first footage of a giant squid in its natural habitat near the Ogasawara Islands, following one to about 900 m.', explanation: 'From the same NBC News report.', reference: 'NBC News, as above (confirm with the original scientific publication).' }],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-money-pit-of-oak-island',
    title: 'The Money Pit of Oak Island',
    summary: 'Emefa and Baba read about a deep hole on a small island in Canada where treasure hunters have dug for more than two hundred years. They ask what the evidence really shows and why the digging never ends.',
    classIds: ['primary-5', 'primary-6', 'jhs-1'],
    ageMin: 10,
    ageMax: 13,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['mystery', 'historical', 'informational'],
    themes: ['money-and-enterprise', 'school', 'peer-pressure'],
    objectives: ['critical-thinking', 'reasoning', 'responsibility', 'vocabulary'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Tense and curious, with a questioning tone',
    palette: ['#78350f', '#164e63'],
    voice: 'Curious storyteller voice with a raised eyebrow when the evidence is thin; Mr Dankwa is dry and kind',
    characters: [
      'Emefa: a 12-year-old girl in a school uniform, with glasses and a notebook.',
      'Baba: her classmate, 12, in a cap, holding a toy spade.',
      'Mr Dankwa: their teacher, with a short beard and a clipboard.',
      'Oak Island: a small, tree-covered island in a bay with a muddy pit in the middle and old wooden posts.',
      'Daniel McGinnis: a 16-year-old boy from 1795 with a shovel, in old-fashioned clothes.',
    ],
    music: 'Slow, curious strings with a rolling drum, a question mark at the end (placeholder)',
    pages: [
      pg('🏝️', 'Mr Dankwa wrote on the board: 1795. “In that year, in Canada, a sixteen-year-old boy named Daniel McGinnis walked on a small island called Oak Island. He found a dip in the ground near a big oak tree. What would you do?” “Dig!” shouted Baba.', 'A teacher points to a date on the board while a class looks at a map of an island.'),
      pg('⛏️', 'Daniel and two friends did. They found a filled-in shaft and kept digging. At about 9 metres, they stopped. Later, in 1804, a team reached around 30 metres. Then salt water flooded the shaft. “Where did the water come from?” asked Emefa. “Good question,” said Mr Dankwa.', 'Boys dig a deep shaft in 1795 while water begins to seep in.'),
      pg('🌊', '“Later diggers found tunnels that seemed to link the pit to the sea,” said Mr Dankwa. “Some say they were built to flood the pit and protect treasure. Others say nature could have made the tunnels, or the pit may be a sinkhole.” Emefa wrote both ideas down.', 'A diagram shows a pit connected by tunnels to the sea.'),
      pg('💰', '“What treasure?” asked Baba. “Stories say pirates like Captain Kidd, or even Inca refugees, buried it,” said Mr Dankwa. “But notice: those are stories. Over more than two hundred years, with a great deal of money spent, nobody has found treasure.”', 'Pirate and treasure-chest drawings are crossed out with a question mark.'),
      pg('📹', '“In 1971, a camera was lowered about 60 metres down,” said Mr Dankwa. “Some people think the blurry pictures show chests. Others are not sure. Blurry is not proof.” Emefa underlined the word proof.', 'A grainy underwater camera image on a screen with a question mark.'),
      pg('⚠️', '“Digging there has also been dangerous,” said Mr Dankwa. “Four treasure hunters died in a single accident in 1965. The island is covered in holes.” “So why do they keep going?” asked Baba. “Hope is powerful,” said Mr Dankwa. “And a mystery that is never answered is hard to stop wondering about.”', 'A hole-pocked island with warning signs.'),
      pg('🔍', 'Emefa made a chart. Known: the pit is real, and digging flooded it. Not known: who made the pit, how, and whether any treasure was ever there. “A good detective,” she said, “asks: what evidence would change my mind?” Baba grinned. “A chest of gold,” he said.', 'A student makes a chart of Known and Not known for the pit.'),
      pg('✅', 'At the end, Mr Dankwa wrote one rule: Never dig deep holes, especially near the sea. “It is dangerous,” he said. “A real mystery must be investigated safely, by trained people.” Emefa closed her notebook. “So it is a mystery because we have a hole and a story,” she said, “but no proof of the treasure.” “Exactly,” he said. The end.', 'A class with a board that reads: Never dig deep holes near the sea.'),
    ],
    activities: [
      { id: 'oak-c1', type: 'comprehension', afterPage: 4, question: 'What stopped the diggers going deeper in 1804?', options: ['Salt water flooded the shaft', 'They ran out of food', 'They found the treasure'], correctIndex: 0 },
      { id: 'oak-p1', type: 'prediction', afterPage: 6, prompt: 'After more than 200 years of digging, what do you think the evidence shows about the treasure?', options: ['No treasure has been found', 'Plenty has been found', 'It was all found in 1795'] },
      { id: 'oak-c2', type: 'comprehension', afterPage: 7, question: 'Why did Mr Dankwa say “blurry is not proof”?', options: ['A blurry picture cannot show for sure what is down there', 'Cameras do not work underwater', 'The teacher disliked photographs'], correctIndex: 0 },
      { id: 'oak-voc', type: 'vocabulary', afterPage: 4, word: 'shaft', definition: 'A deep, narrow hole dug into the ground.', distractors: ['A kind of boat', 'A treasure chest'] },
      { id: 'oak-s1', type: 'sequencing', prompt: 'Put the story of the pit in order.', items: ['In 1795, Daniel McGinnis found a dip in the ground.', 'Diggers reached about 9 metres and later about 30 metres.', 'Salt water flooded the shaft.', 'Nobody has found treasure.'] },
      { id: 'oak-sel', type: 'sel', afterPage: 8, prompt: 'People kept digging because of hope. When is hope helpful, and when can it lead us to take risks?', feelingOptions: ['Hopeful', 'Cautious', 'Curious', 'Wise'] },
    ],
    glossary: [
      { word: 'shaft', definition: 'A deep, narrow hole dug into the ground.', pages: [2] },
      { word: 'sinkhole', definition: 'A hole that forms when the ground collapses.', pages: [3] },
      { word: 'proof', definition: 'Evidence that shows something is true.', pages: [5] },
      { word: 'treasure', definition: 'A store of valuable things such as gold or jewels.', pages: [4] },
    ],
    culturalNotes: ['Oak Island is in Mahone Bay off Nova Scotia, Canada. Pupils may compare it with Ghanaian stories of hidden gold and the gold-weights and royal treasures of the Asante, which are real cultural heritage, not buried-pit legends.', 'The story presents the pit as a legend without proof and encourages critical thinking about “get rich quick” treasure stories.'],
    reviewQuestions: ['Check figures against The Canadian Encyclopedia (1795, McGinnis; about 9 m then about 30 m in 1804; no treasure found; four deaths in 1965).', 'The story says “Captain Kidd, or even Inca refugees” as stories; confirm the wording is clearly labelled as legend.', 'Is the safety message (never dig deep holes near the sea) clear without sounding like a joke?'],
    guide: {
      overview: 'An “open, and probably empty” mystery that teaches evidence-checking: a real hole and a famous story, but no proof of treasure. It also sends a strong safety message.',
      lessonMinutes: 40,
      goals: ['Explain the difference between evidence and legend.', 'Say why blurry images are not proof.', 'Describe the dangers of digging deep holes.'],
      subjects: [['Social Studies', 'Legends and evidence'], ['Mathematics', 'Depth and time'], ['Personal and Social Development', 'Safety and decisions']],
      before: ['Ask: have you heard a story about buried treasure? How could we check it?'],
      during: ['At page 5, ask: what would count as real proof?'],
      after: ['Make a Known / Not known chart for another local legend.', 'Discuss safe ways to explore history, such as museums and archaeology.'],
      discussion: ['Why did people keep digging?', 'What evidence would change your mind?'],
      reflection: ['What can we learn from a mystery with no answer?'],
      maths: [{ task: '1795 to 2026: how many years since the pit was found?', answer: '2026 − 1795 = 231 years.' }, { task: 'The shaft reached 30 m. A classroom door is 2 m high. How many doors high is that?', answer: '30 ÷ 2 = 15 doors.' }],
      support: ['Provide a timeline with the key dates.'],
      stretch: ['Compare evidence for Oak Island treasure with the evidence for a real archaeological find.'],
      localise: ['Link to Ghana’s real treasures: Asante gold-weights, regalia and museum collections.', 'Never encourage digging deep holes; stress that real investigations are done by trained teams with permission.'],
      discoveryStatus: {
        whatWeKnow: ['The pit is real and has been dug since 1795; salt water floods it; no treasure has been found.'],
        whatWeAreStillDiscovering: ['Who made the pit, why, and whether any treasure was ever there.'],
      },
      factCheck: [{ claim: 'Oak Island is in Mahone Bay, Nova Scotia; Daniel McGinnis found the depression in 1795; diggers reached about 9 m, then about 30 m in 1804 when salt water flooded the shaft; no treasure has been found; four treasure hunters died in a 1965 accident; a 1971 camera produced faint images.', explanation: 'From The Canadian Encyclopedia.', reference: 'The Canadian Encyclopedia, “Oak Island.”' }],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-stones-of-stonehenge',
    title: 'The Stones of Stonehenge',
    summary: 'Antwi and Nyarko ask how people nearly five thousand years ago moved giant stones across Britain. They learn what scientists have discovered, including a stone from Scotland, and why nobody knows exactly what Stonehenge was for.',
    classIds: ['primary-5', 'primary-6', 'jhs-1'],
    ageMin: 10,
    ageMax: 13,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['mystery', 'historical', 'informational'],
    themes: ['community', 'technology', 'school'],
    objectives: ['critical-thinking', 'reasoning', 'teamwork', 'scientific-curiosity'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Steady and thoughtful, with awe at the stones',
    palette: ['#4b5563', '#16a34a'],
    voice: 'Thoughtful storyteller voice; Madam Sowah is patient and wry',
    characters: [
      'Antwi: a 12-year-old boy in a white shirt and brown shorts, holding a ruler.',
      'Nyarko: his friend, 12, in a cap, with a notebook of numbers.',
      'Madam Sowah: their teacher, in a floral dress, with a pointer.',
      'Stonehenge: a ring of huge standing grey stones with flat stones across the tops, on green grassland.',
      'Ancient builders: people in simple clothes and furs pulling a huge stone on logs with ropes.',
    ],
    music: 'Slow drums and low strings with a hopeful theme, like footsteps pulling together (placeholder)',
    pages: [
      pg('🪨', 'Madam Sowah held up a photo of giant grey stones standing in a ring on a grassy plain in England. “This is Stonehenge. It was started about five thousand years ago, long before there were cars, cranes or even iron tools. Today’s mystery: how and why?”', 'A teacher shows a photograph of Stonehenge on the board.'),
      pg('🧱', 'Antwi measured on his ruler. “If the biggest stones weigh many tonnes, how did people move them?” “Good question,” said Madam Sowah. “Some of the stones are called sarsens. Scientists found their likely source: a place about 25 kilometres away.” “Walking distance,” said Nyarko, “but with a rock?”', 'Children measure a stone photo while a map shows a short route.'),
      pg('🛤️', '“Nobody wrote down how it was done,” said Madam Sowah. “So scientists suggest ideas, such as pulling the stones on wooden sledges over logs with ropes and teams of people. We do not have a complete, proven answer. It would have taken hundreds of people working together.”', 'People pull a huge stone on a wooden sledge over logs.'),
      pg('🗺️', '“Now the surprise,” said Madam Sowah. “Smaller stones, called bluestones, came from hills in Wales, a long way off. And one big stone in the middle, the Altar Stone, was long thought to be from Wales too.” She paused. “In 2024, scientists said it likely came from northeast Scotland, at least 700 kilometres away. It weighs about six tonnes.”', 'A map of Britain with arrows from Wales and Scotland to Stonehenge.'),
      pg('😮', '“700 kilometres!” cried Nyarko. “More than the distance from Accra to Tamale!” Antwi checked. Accra to Tamale is a little over 600 kilometres by road. “It is,” he said, “a little more than that.” “That is the longest known journey for a stone in a monument of that age,” said Madam Sowah. “How? By land? By sea? We do not know yet.”', 'Two boys compare a long road with a map of a stone’s journey.'),
      pg('❓', '“And why?” asked Antwi. “A calendar? A place for ceremonies? A meeting place? A burial place? Scientists have good ideas, and many are debated,” said Madam Sowah. “For example, some suggest it was built to bring people from different places together, because stones came from across Britain. Nobody can prove the full purpose.”', 'A board with four question marks: calendar, ceremony, meeting place, burial.'),
      pg('🤝', 'Antwi thought about it. “If hundreds of people pulled one stone, they must have worked as a team,” he said. Madam nodded. “That is what we can say with confidence,” she said. “People worked together on something that mattered to them. Think of Ghanaian villages building a school or a market together.”', 'Villagers in Ghana build a school together, drawn next to the stone-pulling picture.'),
      pg('✅', 'Madam Sowah asked them to write one thing Stonehenge has taught them. Nyarko wrote: Mysteries can have a few answers and many questions. Antwi wrote: People long ago were clever and worked together. “Exactly,” said Madam Sowah. “And scientists keep learning. Who knows what we will find next?” The end.', 'Two boys hold up notebooks while the teacher smiles in front of the Stonehenge picture.'),
    ],
    activities: [
      { id: 'stone-c1', type: 'comprehension', afterPage: 4, question: 'Where does the Altar Stone likely come from, according to the 2024 study?', options: ['Northeast Scotland', 'Egypt', 'Ghana'], correctIndex: 0 },
      { id: 'stone-p1', type: 'prediction', afterPage: 3, prompt: 'There were no cranes or modern tools. How do you think the builders moved heavy stones?', options: ['With ropes, wooden sledges and many people working together', 'By magic', 'By a single strong person'] },
      { id: 'stone-c2', type: 'comprehension', afterPage: 6, question: 'What can we say with confidence about the builders?', options: ['They worked together as a team', 'They used steel cranes', 'They wrote a manual'], correctIndex: 0 },
      { id: 'stone-voc', type: 'vocabulary', afterPage: 2, word: 'sledge', definition: 'A flat frame without wheels that is pulled over the ground to carry heavy things.', distractors: ['A kind of stone', 'A type of boat'] },
      { id: 'stone-s1', type: 'sequencing', prompt: 'Put the mystery in order.', items: ['People began building Stonehenge about 5,000 years ago.', 'Stones were moved from far away.', 'In 2024, scientists traced the Altar Stone to Scotland.', 'The reason for Stonehenge is still debated.'] },
      { id: 'stone-sel', type: 'sel', afterPage: 8, prompt: 'Hundreds of people worked together on Stonehenge. When have you worked with others on something big?', feelingOptions: ['Proud', 'Tired', 'Together', 'Inspired'] },
    ],
    glossary: [
      { word: 'sarsens', definition: 'The large, hard sandstone blocks of Stonehenge.', pages: [2] },
      { word: 'bluestones', definition: 'The smaller stones of Stonehenge that came from hills in Wales.', pages: [4] },
      { word: 'sledges', definition: 'Flat frames without wheels, pulled over the ground to carry heavy loads.', pages: [3] },
      { word: 'monument', definition: 'A structure built to remember or honour something.', pages: [5] },
    ],
    culturalNotes: ['Stonehenge is in England. Ghana has its own ancient and heritage sites, such as the Asante traditional buildings, the Larabanga Mosque and the forts and castles of the coast; pupils can compare them.', 'Teamwork and community building, such as “nnoboa” (working together on farms), are Ghanaian values; the story links them without claiming the builders had the same traditions.'],
    reviewQuestions: ['Check the Altar Stone facts (likely northeast Scotland, at least 700 km, about six tonnes, 2024 study) against the UCL or Aberystwyth press release; the “Accra to Tamale” comparison needs a distance check.', 'The sarsen source (about 25 km away) and the sledge-and-log theory are drawn from general knowledge and need a named source before publication.', 'Confirm “nnoboa” is spelt and described correctly.'],
    guide: {
      overview: 'A partly solved mystery. Scientists have traced where stones came from, but nobody knows exactly how they were moved or what Stonehenge was for.',
      lessonMinutes: 45,
      goals: ['Describe how scientists trace the origin of a stone.', 'Explain what is known and unknown about Stonehenge.', 'Connect teamwork then and now.'],
      subjects: [['Social Studies / History', 'Ancient monuments'], ['Mathematics', 'Distances and time'], ['Integrated Science', 'Rocks']],
      before: ['Ask: how do people move something very heavy without machines?'],
      during: ['At page 5, check the Accra-to-Tamale comparison on a map.'],
      after: ['Try moving a heavy box with logs (rollers) and a rope, safely, as a team.', 'Compare Stonehenge with a Ghanaian heritage site.'],
      discussion: ['What teamwork would it take to move a six-tonne stone?', 'Why might people build something so big?'],
      reflection: ['What would you build with your community?'],
      maths: [{ task: 'If the Altar Stone travelled 700 km and a walking team covers 10 km a day, how many days would that take?', answer: '700 ÷ 10 = 70 days (a simple estimate).' }, { task: 'Stonehenge began about 5,000 years ago. If it is now 2026, about which year was that?', answer: '2026 − 5000 ≈ 2974 BC (about 3000 BC).' }],
      support: ['Provide a map with the sources of the stones.'],
      stretch: ['Plan how a team of 200 people might pull a stone and what each group would do.'],
      localise: ['Visit or discuss a local heritage site.', 'Do not climb or damage monuments; explain why heritage sites need protection.'],
      discoveryStatus: {
        whatWeKnow: ['Stonehenge was begun about 5,000 years ago.', 'The Altar Stone likely came from northeast Scotland, at least 700 km away.'],
        whatWeAreStillDiscovering: ['Exactly how the stones were moved.', 'The full purpose of Stonehenge.'],
      },
      factCheck: [{ claim: 'The Altar Stone likely came from northeast Scotland (the Orcadian Basin), at least 700 km away; it weighs about six tonnes; Stonehenge construction began about 5,000 years ago.', explanation: 'From an Aberystwyth University news release on the 2024 study.', reference: 'Aberystwyth University, “Stonehenge Altar Stone came from Scotland, not Wales” (Aug 2024); the UCL page could not be opened in this session.' }, { claim: 'Sarsen stones came from about 25 km away; sledge-and-roller transport is a theory; purposes such as ceremony, calendar, burial or unity are debated.', explanation: 'From memory and search headlines; not verified from a fetched page in this session.', reference: 'English Heritage, Stonehenge pages (to verify).' }],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-secrets-of-the-great-pyramid',
    title: 'The Secrets of the Great Pyramid',
    summary: 'Fatawu and Naana ask how workers more than four thousand years ago built the Great Pyramid. A workers’ logbook and a lost branch of the Nile have answered part of the puzzle, and a hidden space has opened a new one.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 11,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['mystery', 'historical', 'informational'],
    themes: ['community', 'technology', 'careers'],
    objectives: ['critical-thinking', 'reasoning', 'teamwork', 'scientific-curiosity'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Clear and amazed, with an expert tone',
    palette: ['#b45309', '#fde68a'],
    voice: 'Clear, amazed storyteller voice; Mr Bonsu is energetic and precise',
    characters: [
      'Fatawu: a 12-year-old boy in a white shirt and brown shorts, with a calculator.',
      'Naana: his classmate, 12, in a yellow dress, with a notebook and ruler.',
      'Mr Bonsu: their teacher, in a blue shirt, holding a model pyramid.',
      'The Great Pyramid: a huge stone pyramid of pale blocks in the desert, with workers pulling blocks on sledges.',
      'Merer: an ancient Egyptian work-crew leader in a white kilt, holding a papyrus roll.',
    ],
    music: 'Warm desert strings and a steady drum, rising for the discoveries (placeholder)',
    pages: [
      pg('🔺', 'Mr Bonsu placed a model pyramid on his desk. “The Great Pyramid of Giza in Egypt was built more than 4,000 years ago. It was about 147 metres tall, as high as a 45-storey building. It contains about 2.3 million blocks, each weighing between 2.5 and 15 tonnes.” Fatawu whistled. “Why is it a mystery?”', 'A teacher places a model pyramid on his desk in front of the class.'),
      pg('🧮', 'Naana worked it out. “If they built it in about twenty years, that is more than 100,000 blocks a year, and about 300 every day.” “That is about 12 or 13 blocks every hour, day and night,” said Fatawu. “It must have been very organised.” “Exactly,” said Mr Bonsu. “So who organised it, and how?”', 'Students do sums on the board about blocks per year, day and hour.'),
      pg('📜', '“A discovery gave us a clue,” said Mr Bonsu. “Between 2011 and 2013, a team led by archaeologist Pierre Tallet found papyrus logbooks at a place called Wadi al-Jarf, near the Red Sea. A crew leader named Merer wrote about hauling limestone blocks to the pyramid.” “A diary from 4,500 years ago!” said Naana.', 'Archaeologists unroll an ancient papyrus logbook in a desert cave.'),
      pg('🚤', '“Merer’s crew carried the stone on boats,” said Mr Bonsu. “And in 2024, scientists using satellite radar found an old branch of the Nile, about 64 kilometres long, running beside around thirty pyramids. It may have helped workers float stone and supplies close to the building sites.” “So the river was a highway,” said Fatawu.', 'A map shows an ancient branch of the river beside several pyramids, with boats carrying stone.'),
      pg('⛰️', '“But how did they lift the blocks up the pyramid?” asked Naana. “That,” said Mr Bonsu, “is still debated. Ramps, levers, ropes and sledges are part of the likely answer. The exact method, and how steep the ramps were, are not settled.” Fatawu sketched four ideas.', 'A student sketches ramps and sledges in different designs.'),
      pg('🕳️', '“And here is a new puzzle,” said Mr Bonsu. “Scientists have found a large cavity above a long passage inside the pyramid called the Grand Gallery. We do not yet know what it is for, or what is in it.” Naana’s eyes widened. “A secret room?” “We do not know,” said Mr Bonsu.', 'A cutaway drawing of a pyramid with a hollow space above a long gallery.'),
      pg('👷', 'Fatawu tapped the logbook picture. “So it was not magic and not aliens,” he said. “It was people: organised, skilled and working together.” “Why does that matter?” asked Mr Bonsu. “Because it gives credit to the workers,” said Naana. “Real people did this. They had plans, boats, ropes and teams.”', 'Ancient workers with ropes and boats around the pyramid.'),
      pg('✅', 'At the end, the class wrote: Solved (mostly): who built it and that boats and a river helped. Debated: how the blocks were lifted. Unknown: what the hidden space is. “The most amazing mystery,” said Fatawu, “is that people long ago did something we still admire.” Mr Bonsu nodded. The end.', 'A board with three columns: Solved, Debated, Unknown.'),
    ],
    activities: [
      { id: 'pyr-c1', type: 'comprehension', afterPage: 3, question: 'What did Merer’s papyrus logbook describe?', options: ['Hauling stone blocks for the pyramid', 'A trip to Ghana', 'A recipe for bread'], correctIndex: 0 },
      { id: 'pyr-p1', type: 'prediction', afterPage: 4, prompt: 'Scientists found an old branch of the Nile beside many pyramids. What could it have been used for?', options: ['Moving stone and supplies by boat', 'Growing mountains', 'Cooling the desert'] },
      { id: 'pyr-c2', type: 'comprehension', afterPage: 6, question: 'Which part of the Great Pyramid mystery is still debated?', options: ['Exactly how the blocks were lifted', 'Who the pyramid was built for', 'Whether people built it'], correctIndex: 0 },
      { id: 'pyr-voc', type: 'vocabulary', afterPage: 3, word: 'papyrus', definition: 'A material made from a reed plant, used long ago in Egypt for writing.', distractors: ['A kind of stone', 'A type of boat'] },
      { id: 'pyr-s1', type: 'sequencing', prompt: 'Put the discoveries in order.', items: ['Workers built the Great Pyramid.', 'Papyrus logbooks were found between 2011 and 2013.', 'Scientists found an old branch of the Nile.', 'A hidden space was found above the Grand Gallery.'] },
      { id: 'pyr-sel', type: 'sel', afterPage: 8, prompt: 'Fatawu admired the workers. Whose hard work do you admire when you see something amazing?', feelingOptions: ['Admiring', 'Curious', 'Proud', 'Amazed'] },
    ],
    glossary: [
      { word: 'pyramid', definition: 'A huge stone structure with triangle-shaped sides that meet at a point.', pages: [1] },
      { word: 'papyrus', definition: 'A paper-like material made from a reed plant, used for writing long ago.', pages: [3] },
      { word: 'cavity', definition: 'An empty space inside something solid.', pages: [6] },
      { word: 'archaeologist', definition: 'A scientist who studies the past by digging up and examining old objects and buildings.', pages: [3] },
    ],
    culturalNotes: ['The Great Pyramid is in Egypt, in Africa, so pupils can connect it with their own continent’s history. The pupils and teacher here are invented.', 'The story stresses that people built the pyramid and does not suggest that it was made by magic or visitors from space.'],
    reviewQuestions: ['Check the facts against a named source: height 147 m (original), about 2.3 million blocks of 2.5 to 15 tonnes, built over roughly 20 years, Wadi al-Jarf papyri found 2011 to 2013 by Pierre Tallet’s team, a 64 km Nile branch (Eman Ghoneim’s radar study) beside about 31 pyramids, and a cavity above the Grand Gallery.', 'The crew leader’s name Merer comes from general knowledge; the Science Focus page used did not name him. Verify.', 'Check the maths: 2.3 million blocks over 20 years is 115,000 a year, about 315 a day, about 13 an hour for 24 hours.'],
    guide: {
      overview: 'A mostly solved mystery that shows how new tools (a logbook, satellite radar) answer old questions. Some parts, such as how blocks were lifted, remain debated, and a hidden space is still unknown.',
      lessonMinutes: 45,
      goals: ['Explain what archaeologists use as evidence.', 'Separate solved, debated and unknown parts of the story.', 'Use rates and division to understand a large project.'],
      subjects: [['Social Studies / History', 'Ancient Egypt'], ['Mathematics', 'Rates and large numbers'], ['Integrated Science', 'Satellites and mapping']],
      before: ['Ask: how many blocks would you need to build a tower the size of our classroom?'],
      during: ['At page 2, ask learners to check the maths on blocks per day.'],
      after: ['Build a model pyramid from paper or blocks.', 'Debate: which part of the mystery is most interesting?'],
      discussion: ['Why does the logbook matter?', 'Why is “who built it” different from “how was it lifted”?'],
      reflection: ['What would you want to ask Merer?'],
      maths: [{ task: '2.3 million blocks in 20 years: about how many blocks a year?', answer: '2,300,000 ÷ 20 = 115,000 blocks a year.' }, { task: 'About how many blocks a day (365 days)?', answer: '115,000 ÷ 365 ≈ 315 blocks a day.' }, { task: 'About how many blocks an hour, if work went on 24 hours a day?', answer: '315 ÷ 24 ≈ 13 blocks an hour.' }],
      support: ['Provide a calculator and a table: year, day, hour.'],
      stretch: ['Investigate how a team of workers might be organised into crews.'],
      localise: ['Connect Egypt to Africa on a map and to Ghana’s own history of large building projects.', 'Do not suggest or accept “aliens built it”; emphasise evidence for human builders.'],
      discoveryStatus: {
        whatWeKnow: ['The Great Pyramid was built more than 4,000 years ago by organised crews.', 'A logbook and a lost branch of the Nile show that boats helped move stone.'],
        whatWeAreStillDiscovering: ['The exact methods used to lift the blocks.', 'What the cavity above the Grand Gallery is for.', 'How construction was organised in detail.'],
      },
      factCheck: [{ claim: 'The Great Pyramid was originally 147 m tall and has about 2.3 million blocks of 2.5 to 15 tonnes; Pierre Tallet’s team found logbook papyri at Wadi al-Jarf (2011 to 2013); Eman Ghoneim’s team found a 64 km ancient branch of the Nile beside 31 pyramids; the lifting method is debated; the purpose of a cavity above the Grand Gallery is unclear.', explanation: 'From a Science Focus article.', reference: 'BBC Science Focus, “We might finally know how the pyramids were built.”' }],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-village-on-the-water',
    title: 'The Village on the Water',
    summary: 'Aseda and Eku live near Lake Tadane, where the village of Nzulezo stands on stilts above the water. They listen to Opanin Eshun’s story of a snail that led his ancestors there and ask how people can know about the past when no one wrote it down.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'fluent',
    difficulty: 3,
    genres: ['mystery', 'cultural', 'historical'],
    themes: ['community', 'family', 'identity'],
    objectives: ['cultural-heritage', 'respect', 'critical-thinking', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 115,
    paceWord: 'Warm and flowing, like a story told on the water',
    palette: ['#0f766e', '#a16207'],
    voice: 'Warm, flowing storyteller voice; Opanin Eshun is slow, rich and dignified',
    characters: [
      'Aseda: a 10-year-old girl in a bright wrapper-print dress, with beaded bracelets.',
      'Eku: her cousin, 11, in a white T-shirt and shorts, with a small paddle.',
      'Opanin Eshun: an elder, about 75, with a white beard and cloth over one shoulder, sitting on a stool.',
      'Nzulezo: a village of wooden houses on tall stilts above calm lake water, with canoes and a long wooden walkway.',
      'A snail: a large, gentle snail leading ancient travellers across the water in a story picture.',
    ],
    music: 'Gentle paddle sounds with a warm, flowing Nzema-inspired melody (placeholder)',
    pages: [
      pg('🛶', 'Aseda and her cousin Eku paddled across Lake Tadane in the Western Region. Ahead stood Nzulezo, a whole village built on stilts above the water. Its name, in the Nzema language, means “surface of water.” “It looks as though the houses are floating,” said Aseda.', 'Two children paddle a canoe toward a village on stilts over a lake.'),
      pg('🏠', 'In Nzulezo, everyday life happens on the lake: cooking, school, worship and visiting neighbours by canoe or along wooden walkways. Opanin Eshun, an elder, welcomed them. “We are glad you came with respect,” he said. “Please ask before taking photographs.”', 'An elder greets the children on a wooden walkway between stilt houses.'),
      pg('🐌', '“Tell us how our village began,” said Eku. Opanin Eshun smiled. “Our people say our ancestors came long ago from a city called Walata, in the old Ghana empire. They were seeking a safe home. A snail led them across the land to this lake. They settled where the snail stopped, and so a snail is part of our story.”', 'A big snail leads a line of travellers toward a lake.'),
      pg('📅', '“How long ago?” asked Aseda. “About four hundred years, we say.” “Is that written down?” asked Eku. “Our story is carried by people, from grandparents to grandchildren,” said Opanin Eshun. “We call that oral history. It is a valuable record.” Aseda wrote: Oral history = history told from person to person.', 'A grandfather tells a story to children sitting around him.'),
      pg('🔍', '“So is there a mystery?” asked Eku. “A historian might ask: how can we check an oral story?” said Opanin Eshun. “Written records, archaeology, languages and other communities’ stories can help. A story that fits many kinds of evidence becomes stronger. A story that we cannot yet check is not false. It is open.”', 'A historian compares an old map, a pot and a tale.'),
      pg('🌅', '“And why live on the water?” asked Aseda. “Our elders say it kept us safe, and the water brings fish and trade,” said Opanin Eshun. “It also taught us to care for the lake. We keep some days quiet. On Thursday, we avoid heavy work on the lake, as our ancestors taught us.” Eku nodded. “Respect again,” he said.', 'Villagers rest on a quiet day with canoes tied to the walkway.'),
      pg('🌟', 'Aseda thought about the mystery. “So we know the village is real,” she said. “We know the people tell a clear story. But historians still want more evidence about where exactly the ancestors came from and when.” “Yes,” said Opanin Eshun. “A good historian listens to elders and also looks for other clues.”', 'The children and the elder talk on the walkway as the sun sets.'),
      pg('✅', 'Back home, Aseda and Eku made a poster: Nzulezo: What we know and what we honour. Known: a village on stilts, a lake, a living community. Told: the snail story. Open: how historians can check it. “Some mysteries,” said Aseda, “are not for solving. They are for learning from.” The end.', 'A school poster with a drawing of Nzulezo and the headings Known, Told, Open.'),
    ],
    activities: [
      { id: 'nzu-c1', type: 'comprehension', afterPage: 3, question: 'What does Nzulezo mean in the Nzema language?', options: ['Surface of water', 'Village of snails', 'House on a hill'], correctIndex: 0 },
      { id: 'nzu-p1', type: 'prediction', afterPage: 4, prompt: 'Opanin Eshun says the story is passed from grandparents to grandchildren. How could a historian check it?', options: ['Compare it with written records and other evidence', 'Ignore it', 'Change it'] },
      { id: 'nzu-c2', type: 'comprehension', afterPage: 5, question: 'What is oral history?', options: ['History told from person to person', 'History written on stone', 'History learned only from books'], correctIndex: 0 },
      { id: 'nzu-voc', type: 'vocabulary', afterPage: 4, word: 'ancestors', definition: 'People in your family who lived long before you.', distractors: ['Your neighbours', 'Your classmates'] },
      { id: 'nzu-s1', type: 'sequencing', prompt: 'Put the story of Nzulezo in order.', items: ['The ancestors left Walata to find a safe home.', 'A snail led them to the lake.', 'They built a village on stilts.', 'Children today learn the story from elders.'] },
      { id: 'nzu-sel', type: 'sel', afterPage: 8, prompt: 'Some stories are for learning from, not only for proving. Which story from your family or community do you treasure?', feelingOptions: ['Proud', 'Thankful', 'Respectful', 'Curious'] },
    ],
    glossary: [
      { word: 'stilts', definition: 'Tall posts that hold a building above the ground or water.', pages: [1] },
      { word: 'ancestors', definition: 'People in a family who lived long ago.', pages: [3] },
      { word: 'elder', definition: 'An older, respected person in a community.', pages: [2] },
      { word: 'historian', definition: 'A person who studies the past.', pages: [5] },
    ],
    culturalNotes: ['Nzulezo is a real stilt village in Ghana’s Western Region on Lake Tadane. The children, their families and Opanin Eshun are invented; the story is told with respect and in line with the village’s own account.', 'Visitors should follow the village’s rules and customs (for example, quiet on Thursdays, no visiting after 3:00 pm); the story models asking permission and showing respect.'],
    reviewQuestions: ['Check with the Ghana Museums and Monuments Board and, if possible, community members that the account of the snail, Walata and “about 400 years” matches how the village tells it; correct anything they wish changed.', 'The Walata claim is the village’s tradition; the Ghana Museums and Monuments Board page says the people are said to have come from Walata of the ancient Ghana Empire. Keep as “our people say.”', 'Confirm Thursday practice and the 3:00 pm visiting rule before they are used.'],
    guide: {
      overview: 'A heritage mystery about an unwritten past. It shows how oral history is a real kind of record and how historians check stories using several kinds of evidence, with respect for the community that keeps them.',
      lessonMinutes: 40,
      goals: ['Explain oral history and why it matters.', 'Describe how a story might be checked using other evidence.', 'Show respect when learning about a community.'],
      subjects: [['Social Studies / History', 'Oral history and heritage'], ['Creative Arts', 'Storytelling'], ['Integrated Science', 'Lakes and stilt buildings']],
      before: ['Ask: how do we know what happened long ago, if nobody wrote it down?'],
      during: ['At page 5, ask learners to name two ways to check an oral story.'],
      after: ['Interview an elder about a story of your community (with permission).', 'Make a Known / Told / Open poster for a local story.'],
      discussion: ['Why is oral history valuable?', 'How should visitors behave in a community?'],
      reflection: ['Which story of your family would you want to keep?'],
      maths: [{ task: 'About 400 years ago from 2026: about which year?', answer: '2026 − 400 = 1626.' }, { task: 'If a house stands 3 m above the water on stilts and the water rises 1 m, how high is it then?', answer: '2 m above the water.' }],
      support: ['Provide sentence starters: “Our elders say …”, “We can check this by …”.'],
      stretch: ['Compare Nzulezo’s story with another community’s origin story and list common features.'],
      localise: ['Use your own community’s history; invite an elder.', 'Always ask permission before visiting a community, taking photographs or retelling sacred stories.'],
      discoveryStatus: {
        whatWeKnow: ['Nzulezo is a real stilt village on Lake Tadane in Ghana’s Western Region.', 'The people tell a story of coming from Walata and being led by a snail.'],
        whatWeAreStillDiscovering: ['How historians and archaeologists can add other evidence to the community’s own account.'],
      },
      factCheck: [{ claim: 'Nzulezo is a stilt village on Lake Tadane in the Western Region; its name means “surface of water” in Nzema; inhabitants are said to have migrated from Walata of the ancient Ghana Empire, led by a snail; the settlement is about 400 years old; Thursday is sacred on the lake; visitors are not allowed after 3:00 pm.', explanation: 'From the Ghana Museums and Monuments Board page.', reference: 'Ghana Museums and Monuments Board, “Nzulezu Stilt Settlement” (gmmb.gov.gh).' }],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-lost-capital-of-old-ghana',
    title: 'The Lost Capital of Old Ghana',
    summary: 'Bintu and Gideon learn that the Ghana Empire of long ago was not where modern Ghana is, and that nobody is sure exactly where its royal city stood. Following clues in old travellers’ writing, sand and soil, they see how historians argue, and why their country chose that name in 1957.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['mystery', 'historical', 'informational'],
    themes: ['identity', 'citizenship', 'school'],
    objectives: ['critical-thinking', 'cultural-heritage', 'reasoning', 'scientific-curiosity'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 130,
    paceWord: 'Measured and curious, with a quiet pride at the end',
    palette: ['#92400e', '#166534'],
    voice: 'Measured storyteller voice; Mr Larbi is warm, sharp and careful with facts',
    characters: [
      'Bintu: a 14-year-old girl in a JHS uniform, with a scarf, holding an atlas.',
      'Gideon: her classmate, 14, in a white shirt and navy trousers, with a tablet.',
      'Mr Larbi: their history teacher, in a grey suit with a red tie, holding a map of West Africa.',
      'The old Ghana Empire: a map of the Sahel, gold, salt caravans and a walled royal town in sand.',
      'Koumbi Saleh: sandy ruins of stone buildings at the edge of the desert.',
    ],
    music: 'Slow drum, a Sahel string melody and a proud, rising theme (placeholder)',
    pages: [
      pg('🗺️', 'On the first day of history class, Mr Larbi unrolled a map of West Africa and pointed far to the north-west, away from the Gulf of Guinea. “In the year 300, a powerful kingdom called Wagadu was growing here,” he said. “Traders and writers called it Ghana. That name was the title of its ruler, and it is where our country’s name comes from.”', 'A teacher points to the Sahel on a map of West Africa.'),
      pg('🤔', '“But we are not there,” said Bintu, tracing the map. “Our Ghana is far to the south.” “Exactly,” said Mr Larbi. “The old Ghana Empire was in what is now south-east Mauritania and western Mali. In 1957, our country, then the Gold Coast, took the name Ghana at independence. Today’s mystery is simple: where, exactly, was its capital?”', 'Students look from a map of the Sahel to a map of modern Ghana.'),
      pg('📜', '“We know of the old empire mostly from writers who visited or asked traders,” said Mr Larbi. “One was al-Bakri, who wrote about two towns about ten kilometres apart that were joined by houses. Another, al-Idrisi, put the royal city on a riverbank.” Gideon frowned. “Different writers, different places?”', 'Old manuscripts with Arabic writing and a map beside them.'),
      pg('🏜️', '“Most historians say the capital was probably Koumbi Saleh,” said Mr Larbi. “Its ruins lie on the edge of the Sahara. But, and this is the mystery, scholars increasingly disagree. The remains of the royal town described have not been found. Some historians suggest the capital moved over time.”', 'Ruins of stone buildings in sand under a bright sky.'),
      pg('🧩', 'Bintu made a chart. Evidence one: writers’ descriptions, which do not always agree. Evidence two: archaeology at Koumbi Saleh, which is real, but may not be the royal town. Evidence three: oral traditions of the Soninke people, who are linked to the old empire. “So it is a puzzle with three kinds of clues,” she said. “And none is complete.”', 'A student’s chart lists three kinds of evidence and their limits.'),
      pg('🧠', '“How could we solve it?” asked Gideon. “More digging, in more places,” said Mr Larbi, “better dating of finds, and careful comparison of the old writings with the land. Historians sometimes disagree for decades. That is not failure. It is how knowledge grows.” Bintu wrote: Disagreement + evidence = progress.', 'Archaeologists dig carefully at a desert site with sieves and measuring tapes.'),
      pg('🇬🇭', '“Why did our country choose the name Ghana?” asked Bintu. Mr Larbi replied carefully. “In 1957 the leaders of the Gold Coast took the name of an old West African empire as their country’s name, which is why you find ‘Ghana’ on our flag, coins and certificates. I will not guess every reason. You should read what the leaders themselves said.”', 'A Ghana flag and a school certificate with the name Ghana.'),
      pg('✅', 'At the end, Gideon wrote a note for the class wall: The old Ghana Empire was real. Its capital is probably Koumbi Saleh, but historians still argue. Bintu added: We carry the name of a mystery. Mr Larbi nodded. “And you are the new generation who might help solve it,” he said. The end.', 'A classroom wall note and a girl and boy smiling in front of the map.'),
    ],
    activities: [
      { id: 'cap-c1', type: 'comprehension', afterPage: 2, question: 'Where was the old Ghana Empire located?', options: ['South-east Mauritania and western Mali', 'Where modern Ghana is', 'In Egypt'], correctIndex: 0 },
      { id: 'cap-p1', type: 'prediction', afterPage: 4, prompt: 'Historians disagree about where the capital stood. What kind of evidence could help most?', options: ['More digging and better dating of finds', 'Guessing', 'Asking a friend'] },
      { id: 'cap-c2', type: 'comprehension', afterPage: 5, question: 'What is the main reason the capital’s location is still debated?', options: ['The writings do not agree and the royal town’s remains have not been found', 'Nobody has heard of the empire', 'The empire never existed'], correctIndex: 0 },
      { id: 'cap-voc', type: 'vocabulary', afterPage: 3, word: 'archaeology', definition: 'The study of the past by digging up and examining old objects and buildings.', distractors: ['The study of rocks', 'The study of weather'] },
      { id: 'cap-s1', type: 'sequencing', prompt: 'Put these in order.', items: ['The old Ghana Empire grew in the Sahel.', 'Travellers wrote descriptions of its towns.', 'Koumbi Saleh was abandoned in the 15th century.', 'In 1957, the Gold Coast took the name Ghana.'] },
      { id: 'cap-sel', type: 'sel', afterPage: 8, prompt: 'Our country carries the name of an old empire. How does that make you feel about your history?', feelingOptions: ['Proud', 'Curious', 'Inspired', 'Thoughtful'] },
    ],
    glossary: [
      { word: 'empire', definition: 'A large area of land and people ruled by one powerful ruler or government.', pages: [2] },
      { word: 'capital', definition: 'The most important city of a country or kingdom, where its rulers live.', pages: [2] },
      { word: 'archaeology', definition: 'The study of the past by digging up and examining old objects and buildings.', pages: [5] },
      { word: 'independence', definition: 'Freedom from rule by another country.', pages: [2] },
    ],
    culturalNotes: ['The Ghana Empire (Wagadu) was in what is now south-east Mauritania and western Mali, not in modern Ghana. The Gold Coast took the name Ghana at independence in 1957. The pupils and teacher are invented.', 'The story does not claim to know why the name was chosen; it asks pupils to read the leaders’ own words and sources.'],
    reviewQuestions: ['Check dates and claims against a named scholarly source: Wagadu c. 300 CE; capital often identified as Koumbi Saleh but disputed; al-Bakri’s two towns about 10 km apart; al-Idrisi’s riverbank and palace; abandonment in the 15th century.', 'The mention of Soninke oral traditions is from general knowledge and needs a source.', 'The 1957 naming: the story says only that the name was taken; confirm any reasons from primary sources before adding them.'],
    guide: {
      overview: 'An open historical mystery that connects Ghana’s name to an older West African empire. It models how historians weigh writings, archaeology and oral tradition, and how they disagree.',
      lessonMinutes: 50,
      goals: ['Locate the old Ghana Empire and modern Ghana on a map.', 'Explain three kinds of historical evidence and their limits.', 'Discuss why historians disagree.'],
      subjects: [['Social Studies / History', 'Ancient West African empires'], ['Geography', 'Sahel and map skills'], ['English Language', 'Argument and evidence']],
      before: ['Ask: why is our country called Ghana?'],
      during: ['At page 4, ask learners to list the three kinds of evidence.'],
      after: ['Trace the Sahel and the Gulf of Guinea on a map and measure the distance between them.', 'Research primary sources on the 1957 choice of name.'],
      discussion: ['Why can two experts disagree?', 'What would make you change your mind?'],
      reflection: ['What would you like to find out about the old empire?'],
      maths: [{ task: 'From about 300 CE to the 15th century (about 1400 CE), about how many years did Wagadu and its capital exist?', answer: 'About 1,100 years.' }, { task: '1957 to 2026: how many years since independence?', answer: '69 years.' }],
      support: ['Provide a map and a chart with Writings / Archaeology / Oral tradition.'],
      stretch: ['Write a short essay: “Is Koumbi Saleh the capital?” using at least two kinds of evidence.'],
      localise: ['Link to local histories and oral traditions.', 'Treat all communities’ origin stories with respect.'],
      discoveryStatus: {
        whatWeKnow: ['The Ghana Empire was real and lay in south-east Mauritania and western Mali.', 'Koumbi Saleh is the most common identification of its capital.', 'The modern country took the name Ghana in 1957.'],
        whatWeAreStillDiscovering: ['Exactly where the royal city stood and whether the capital moved.', 'Which sources best explain its history.'],
      },
      factCheck: [{ claim: 'The Ghana Empire was in south-east Mauritania and western Mali; Koumbi Saleh is the most common identification of the capital but this is disputed; al-Bakri described two towns about 10 km apart; al-Idrisi placed the royal city on a riverbank; the royal town’s remains have not been found; Koumbi Saleh was abandoned in the 15th century; the Gold Coast took the name Ghana in 1957.', explanation: 'From Wikipedia’s “Ghana Empire” article, which is a summary and not a primary source.', reference: 'Wikipedia, “Ghana Empire”; confirm with a scholarly history of West Africa.' }],
    },
  }),
];

