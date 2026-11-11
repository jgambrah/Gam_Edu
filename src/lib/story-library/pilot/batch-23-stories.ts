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

export const BATCH_23_STORIES: PilotStory[] = [
/**
 * Batch 23: Rivers, forests and the web of life. Eight stories: two clean-up recoveries from elsewhere (the Thames and
 * the Cheonggyecheon stream in Seoul), a country that grew its forest back (Costa Rica), a tree-planting movement
 * (Wangari Maathai), and four Ghana-centred biodiversity stories: the bacterium that makes insulin (why we keep
 * everything), the sacred monkeys of Boabeng-Fiema, the midge that pollinates cocoa, and the Atewa forest that feeds
 * rivers.
 *
 * Rules: as Batches 13 to 22. All students, teachers and families are invented. Real people appear only as widely
 * documented public figures (Wangari Maathai). Figures are taken from the cited sources; uncertain figures are shown
 * as ranges or as differing accounts. Contested policy (Atewa bauxite, causes of forest loss) is shown as competing
 * claims attributed by role, not as settled. Every story ends with something a young person can do and an English
 * skill in BECE / NaCCA style. All stories are drafts awaiting review.
 */

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-river-they-called-dead',
    title: 'The River They Called Dead',
    summary: 'In 1957 scientists in London said parts of the River Thames were “biologically dead”. Today seals swim in it. Afua’s cousin in London sends a message about the recovery, and Afua asks what Ghana can learn: that clean-up takes decades, never finishes, and starts with people who refuse to give up. A story of hope and honesty, with a comparing letter in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['informational', 'science', 'realistic-fiction'],
    themes: ['community', 'citizenship', 'new-beginnings'],
    objectives: ['environmental-awareness', 'perseverance', 'critical-thinking', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Curious and hopeful, steady at the facts',
    palette: ['#0369a1', '#16a34a'],
    voice: 'Curious teen voice for Afua; a warm, clear voice for Mr Fordjour; a bright voice for cousin Ruth',
    characters: [
      'Afua Quainoo: a 13-year-old girl in a school uniform, holding a phone with a photo of a river and a seal.',
      'Ruth: Afua’s cousin in London, 14, in a warm coat, standing beside a grey river with a notebook.',
      'Mr Fordjour: the science teacher, in a checked shirt, with a map and a model of a river.',
      'The two rivers: a brown, rubbish-filled stream near Afua’s school and a wide grey river with a seal at the water’s edge.',
    ],
    music: 'A slow, curious flute with water sounds; a bright, hopeful theme at the seals (placeholder)',
    pages: [
      pg('📱', 'On a hot afternoon, Afua’s phone buzzed with a photo from her cousin Ruth in London. It showed a wide, grey river, and in the water, a round, whiskered head. “A seal!” Ruth wrote. “In the middle of the city, in the River Thames.” Afua stared. Beside her school, the little stream was brown and choked with plastic. “Seals,” she whispered. “In a city river?”', 'A girl looks at a phone showing a seal in a river while a polluted stream flows behind her.'),
      pg('📜', 'Mr Fordjour, the science teacher, smiled when she told him. “That river has a hard history,” he said. “In 1957, scientists at the Natural History Museum in London said that large parts of the Thames were biologically dead. The sewage and waste of a growing city had used up the oxygen in the water, and almost nothing could live in it.” Afua’s mouth fell open. “Dead,” she said. “A whole river?”', 'A teacher points to a model river with a skull sign beside the dirtiest stretch.'),
      pg('🛠️', '“It took decades,” said Mr Fordjour. “The city built better sewage treatment, and industries were made to stop dumping waste. Slowly, oxygen returned, and so did the animals. Reports now record seals, eels and well over a hundred species of fish.” He paused. “But I want you to hear the full truth. The river is better, not perfect.”', 'A teacher explains a diagram of sewage treatment with fish returning to the river in the picture.'),
      pg('⚠️', 'He wrote three problems on the board. “Old sewers still overflow into the river when it rains hard. Nitrates, which come from waste and fertiliser, have increased. And the river is warming with the climate. A huge new tunnel was built to catch most of the overflow, but the work is not finished, and the number of fish species has slipped since the early 1990s, for reasons scientists do not fully know.” Afua wrote it all down.', 'A teacher writes three problems on a board beside a drawing of a sewer tunnel.'),
      pg('🤔', '“So what do we learn?” asked Mr Fordjour. A boy said, “It can be done.” A girl said, “It takes a long time.” Afua said, “It is never finished. You have to keep looking after it.” Mr Fordjour nodded. “Exactly. Clean-up is not a single event. It takes laws, money, science, patience and ordinary people who refuse to give up.”', 'Students sit in a circle answering their teacher’s question with notebooks open.'),
      pg('🌱', 'After school, Afua and her friends walked to the little stream. “It is only brown because of what we put in it,” she said. “If London could bring back a river, we can start with ours.” They agreed on small steps: a litter patrol, a weekly check of the drain and a letter to their Assembly about the dumping upstream. “We may not see the seals,” said Afua, “but someone will.”', 'Students pick up plastic along a brown stream with notebooks and bags.'),
      pg('✉️', 'Afua wrote to her cousin, with her address and the date at the top. “House 6, School Road, Cape Coast. 7th May, 2027. Dear Ruth, I hope you are well. Thank you for the photograph of the seal. It made me think about our own stream, which is dirty but not hopeless. I learned that your river took many years to recover, and that it still needs care. In the same way, we can start small. Please send me more news of the Thames. Yours ever, Afua.”', 'A girl writes a letter at a desk beside a photo of a seal and a small jar of clean water.'),
      pg('✅', 'Exam-safe tip: this informal letter compares two places. Afua used linking phrases such as “in the same way” and “but not hopeless”, and she gave a reason for her feeling. Notice the address, date, “Dear Ruth” and “Yours ever”. When you compare in writing, say what is similar, what is different and what you learned. The end.', 'A girl and her teacher read a letter with a tick beside the linking phrases.'),
    ],
    activities: [
      { id: 'thm-c1', type: 'comprehension', afterPage: 3, question: 'What did scientists say about the Thames in 1957?', options: ['That large parts were biologically dead', 'That it was the cleanest river', 'That it had dried up'], correctIndex: 0 },
      { id: 'thm-p1', type: 'prediction', afterPage: 5, prompt: 'Mr Fordjour says the river is better but not perfect. What might still be a problem?', options: ['Sewer overflows, nitrates and warming', 'Nothing', 'Too many fish'] },
      { id: 'thm-c2', type: 'comprehension', afterPage: 7, question: 'Which phrase does Afua use to compare the two rivers?', options: ['In the same way', 'By the way', 'No way'], correctIndex: 0 },
      { id: 'thm-voc', type: 'vocabulary', afterPage: 5, word: 'recovery', definition: 'Getting better after being damaged.', distractors: ['Getting worse', 'Going away'] },
      { id: 'thm-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Afua sees a photo of a seal in the Thames.', 'Mr Fordjour explains that the river was once called dead.', 'He lists the problems that remain.', 'Afua and her friends plan to help their own stream.'] },
      { id: 'thm-sel', type: 'sel', afterPage: 8, prompt: 'Knowing a damaged place can heal brings hope. How do you feel?', feelingOptions: ['Hopeful', 'Determined', 'Curious', 'Inspired'] },
    ],
    glossary: [
      { word: 'sewage', definition: 'Waste water and waste matter carried away from homes and toilets.', pages: [2, 3] },
      { word: 'oxygen', definition: 'A gas in air and water that living things need to breathe.', pages: [2, 3] },
      { word: 'nitrates', definition: 'Chemicals from waste and fertiliser that can harm water life when there is too much.', pages: [4] },
      { word: 'overflow', definition: 'To spill over the edge or limit.', pages: [4] },
      { word: 'patrol', definition: 'A group that walks around an area to watch over it.', pages: [6] },
    ],
    culturalNotes: ['The students and teacher are invented. The facts about the Thames come from published reports: in 1957 scientists at the Natural History Museum in London declared large parts of the tidal Thames biologically dead; sewage treatment and controls on industry helped it recover; seals and many fish species have returned; sewer overflows, nitrates and warming remain concerns.', 'The number of fish species (reported as 115) and the date of the Tideway Tunnel should be checked against the latest report before use.', 'The story shows recovery as slow and unfinished. It does not suggest that Ghana’s streams can be fixed by one project.'],
    reviewQuestions: ['Check the Thames facts (1957, number of fish species, sewer overflows, Tideway Tunnel) against a recent official report such as the Zoological Society of London’s State of the Thames.', 'Check that the story does not suggest the Thames is fully clean; the remaining problems are shown.', 'Check the letter against the NaCCA informal-letter lesson.'],
    guide: {
      overview: 'A story of a river that recovered from near-death, and of what a Ghanaian child can learn from it. It teaches that clean-up is long, shared and unfinished, and models a comparing letter.',
      lessonMinutes: 45,
      goals: ['Explain why oxygen matters for river life.', 'Describe three steps that helped the Thames recover and three problems that remain.', 'Compare two places in an informal letter using linking phrases.'],
      subjects: [['Integrated Science', 'Water pollution and living things'], ['Social Studies', 'Citizenship and environment'], ['English Language', 'Comparing and informal letters']],
      before: ['Ask: can a polluted river recover? What would it take?'],
      during: ['At page 4, ask learners to list the problems still facing the Thames.'],
      after: ['Write a letter comparing a river or stream near you with another place.', 'Plan a small, safe litter patrol (from the bank, with gloves and an adult).'],
      discussion: ['Why does it take decades to clean a river?', 'Who has to act: citizens, industries, government?'],
      reflection: ['What small step could you take for a drain or stream near you?'],
      support: ['Provide linking phrases: in the same way, however, whereas, in contrast, as a result.'],
      stretch: ['Write a short report on a local stream: where it starts, what enters it and what lives in it.'],
      localise: ['Use a real stream, drain or lagoon in your area; do not send learners into water; keep patrols on the bank with an adult.'],
      factCheck: [
        { claim: 'In 1957 scientists at the Natural History Museum in London declared large parts of the tidal Thames biologically dead; sewage treatment and industry controls have since allowed seals, eels and many fish species to return, but sewer overflows, rising nitrates and warming still threaten it.', explanation: 'From a 2021 report summary on the state of the Thames.', reference: 'Smithsonian Magazine, “Once Deemed ‘Biologically Dead,’ a New Report Shows London’s River Thames Recovering” (smithsonianmag.com).' },
      ],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-stream-under-the-road',
    title: 'The Stream Under the Road',
    summary: 'In Seoul, a stream was buried under concrete and then under a six-lane highway. Decades later, the city tore the road down and brought the stream back, despite the doubts of shopkeepers and drivers. Lawrence and his father talk about what it cost, what it gave and what Accra could do with a buried drain. A story about big decisions, with a descriptive paragraph in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['informational', 'realistic-fiction', 'educational'],
    themes: ['community', 'citizenship', 'technology'],
    objectives: ['environmental-awareness', 'critical-thinking', 'reasoning', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Thoughtful and clear, with a sense of surprise at the reveal',
    palette: ['#0f766e', '#a16207'],
    voice: 'Curious boy’s voice for Lawrence; a measured engineer’s voice for his father; a warm voice for Madam Fosu',
    characters: [
      'Lawrence Adomako: a 14-year-old boy in a school uniform, with a drawing pad and a pencil.',
      'Mr Cyril Adomako: his father, a civil engineer, in a hard hat, with rolled plans under his arm.',
      'Madam Fosu: the geography teacher, with a wall map and a projector.',
      'The stream: a long, narrow stream running between stone banks and trees through a busy city, with people walking beside it.',
    ],
    music: 'Urban traffic sounds that fade into trickling water and a gentle piano (placeholder)',
    pages: [
      pg('🚗', 'Lawrence sat in the back of his father’s car, stuck in traffic again. Beside the road, a concrete-lined drain ran black with rubbish. “Dad,” he said, “what if we could get rid of the drain and the traffic?” His father, an engineer, laughed. “You are not the first to dream of that,” he said. “In Seoul, in Korea, they actually did something like it.”', 'A boy looks from a car window at a black, rubbish-filled drain beside a jammed road.'),
      pg('🏙️', 'At school, Madam Fosu showed the class a map of Seoul. “Long ago,” she said, “a stream called the Cheonggyecheon ran through the city centre. As the city grew, people dumped waste into it, and it became dirty. In the late 1950s, the stream was covered with concrete, and in the years that followed, a six-lane elevated highway was built on top. By 1971 it was the main road of the city.”', 'A teacher shows a map and a drawing of a highway built over a buried stream.'),
      pg('💥', '“But decades later,” she continued, “the city made a bold decision. In 2003, the highway began to be demolished. Construction on the stream began in 2004, and the restored stream opened in October 2005. The new stream is about six kilometres long, with bridges and footpaths on both sides.” Lawrence leaned forward. “They destroyed the road?” he asked. “They did,” said Madam Fosu.', 'Workers use machines to break up a concrete highway as a city watches.'),
      pg('😟', '“It was not easy,” she said. “Many shopkeepers feared that they would lose customers, and drivers feared worse traffic. The project cost about US$380 million. And I must be honest: the water in the new stream is not all natural. It is brought in from the Han River and from groundwater collected at underground stations.” A girl raised her hand. “Then was it worth it?” she asked. “That is what you must decide,” said Madam Fosu.', 'A teacher stands by a board with a cost figure and a diagram of pipes bringing water to a stream.'),
      pg('🌿', '“Here are some reports,” she said. “The stream has become a popular green space, and visitors number in the tens of thousands each day. Studies report that the area is cooler than nearby streets, by as much as five degrees, and that air pollution has fallen. Dozens of plant, fish and bird species have been recorded. Many people say it has brought nature back into the heart of the city.” Lawrence began to draw.', 'A boy sketches a stream with willow trees and people walking beside it.'),
      pg('🇬🇭', 'That evening, Lawrence told his father about the lesson. “Accra has many buried drains,” said Mr Adomako. “But it is not as simple as lifting a lid. Every city has its own floods, its own traffic and its own money. Seoul had a plan, a budget, strong leaders and years of work.” He ruffled his son’s hair. “Maybe you will be the engineer who makes a plan like that for us.” Lawrence smiled. “Maybe,” he said.', 'A father and son look at a city map together with a stream drawn in blue ink.'),
      pg('✍️', 'For homework, Madam Fosu asked the class to write a descriptive paragraph about a place. Lawrence wrote: “The stream glided softly between stone banks, and the cool air carried the smell of wet leaves. Children’s laughter echoed from the bridges while willow branches brushed the water. Overhead, the traffic hummed like a distant beehive, but here, beside the water, the city felt calm.”', 'A boy writes a descriptive paragraph at a desk with his sketch of the stream beside him.'),
      pg('✅', 'Exam-safe tip: a descriptive paragraph uses the five senses: sight, sound, smell, touch and taste. Lawrence used sight (“stone banks”), smell (“wet leaves”) and sound (“laughter echoed”), and a comparison (“like a distant beehive”). He wrote in one tense, the past. Use strong, exact words, and never a chat shortcut. The end.', 'A boy and his teacher underline the sense words in a paragraph.'),
    ],
    activities: [
      { id: 'str-c1', type: 'comprehension', afterPage: 3, question: 'What happened to the Cheonggyecheon in the late 1950s?', options: ['It was covered with concrete and later a highway', 'It was dug wider', 'It dried up'], correctIndex: 0 },
      { id: 'str-p1', type: 'prediction', afterPage: 4, prompt: 'Madam Fosu says the project was not easy. What might have worried people?', options: ['Cost and traffic', 'Too many flowers', 'Too few bridges'] },
      { id: 'str-c2', type: 'comprehension', afterPage: 8, question: 'Which senses does Lawrence use in his paragraph?', options: ['Sight, smell and sound', 'Only taste', 'Only touch'], correctIndex: 0 },
      { id: 'str-voc', type: 'vocabulary', afterPage: 5, word: 'demolished', definition: 'Knocked down on purpose.', distractors: ['Built up', 'Painted'] },
      { id: 'str-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The stream is covered with concrete and a highway.', 'The highway is demolished.', 'The restored stream opens.', 'Lawrence writes a descriptive paragraph.'] },
      { id: 'str-sel', type: 'sel', afterPage: 8, prompt: 'Big changes can be exciting and scary. How do you feel about change that could help a city?', feelingOptions: ['Curious', 'Hopeful', 'Cautious', 'Excited'] },
    ],
    glossary: [
      { word: 'elevated', definition: 'Raised above the ground.', pages: [2] },
      { word: 'demolished', definition: 'Knocked down on purpose.', pages: [3] },
      { word: 'groundwater', definition: 'Water found underground in soil and rocks.', pages: [4] },
      { word: 'species', definition: 'A kind of living thing.', pages: [5] },
      { word: 'descriptive', definition: 'Giving details so a reader can picture something.', pages: [7] },
    ],
    culturalNotes: ['The students, teacher and father are invented. The facts come from published case studies: the Cheonggyecheon in Seoul was covered from the late 1950s, an elevated highway stood over it by 1971, demolition began in 2003 and the restored stream opened in October 2005. Reported costs, cooling and visitor numbers are from project summaries and should be treated as reported figures.', 'The story is honest that the restored stream is partly fed by pumped river and groundwater, and that businesses and drivers had real concerns.', 'The story does not say Accra should copy Seoul; it shows that big changes need plans, money, leaders and years.'],
    reviewQuestions: ['Check the dates, cost (about US$380 million), length and reported benefits against a recent academic or official summary.', 'Check that the story shows the criticisms and the pumped water fairly.', 'Check the descriptive-writing tip against the NaCCA English syllabus.'],
    guide: {
      overview: 'A story about a city that uncovered a buried stream, with honest costs and benefits. It teaches how to weigh a big decision and models a descriptive paragraph using the five senses.',
      lessonMinutes: 45,
      goals: ['Describe the costs and benefits of restoring a buried stream.', 'Explain why different people held different views.', 'Write a descriptive paragraph using at least three senses.'],
      subjects: [['Social Studies', 'Cities and planning'], ['Integrated Science', 'Water and ecosystems'], ['English Language', 'Descriptive writing']],
      before: ['Ask: what is buried or covered in your town that people once used?'],
      during: ['At page 4, ask learners which concerns were fair.'],
      after: ['Write a descriptive paragraph about a place you love, using three senses.', 'Debate: should a city remove a busy road to restore a stream?'],
      discussion: ['Who gains and who might lose from a big project like this?', 'Is a partly artificial stream still worth having?'],
      reflection: ['What would you want to change in your town if you had a plan, a budget and ten years?'],
      support: ['Provide a five-senses chart with sentence starters.'],
      stretch: ['Write a short letter to your Assembly proposing the clean-up of one drain, with two reasons and one solution.'],
      localise: ['Use real local drains and streams; do not send learners near water; involve drainage or planning officers.'],
      factCheck: [
        { claim: 'The Cheonggyecheon in Seoul was covered with concrete from the late 1950s, topped by an elevated highway by 1971; demolition began in 2003 and the restored stream opened in October 2005, at a reported cost of about US$380 million.', explanation: 'From an Asian Development Bank-supported case study; benefit figures are reported, not independently verified here.', reference: 'Development Asia, “Revitalizing a City by Reviving a Stream” (development.asia).' },
      ],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-country-that-grew-its-forest-back',
    title: 'The Country That Grew Its Forest Back',
    summary: 'Costa Rica cut down much of its forest, then changed course and now has more than half of its land under forest. Mabel and her uncle, a cocoa farmer who has kept a patch of old trees, ask how it was done, who paid, who lost, and whether Ghana could learn from it. A balanced story with an argumentative paragraph in exam-safe English.',
    classIds: ['jhs-2', 'jhs-3'],
    ageMin: 13,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['informational', 'realistic-fiction', 'educational'],
    themes: ['community', 'citizenship', 'farm-and-garden', 'money-and-enterprise'],
    objectives: ['environmental-awareness', 'critical-thinking', 'reasoning', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 120,
    paceWord: 'Thoughtful and balanced, like a good debate',
    palette: ['#166534', '#a16207'],
    voice: 'Curious girl’s voice for Mabel; a steady, honest farmer’s voice for Uncle Bernard',
    characters: [
      'Mabel Aboagye: a 14-year-old girl in a school uniform, with a notebook, visiting a cocoa farm.',
      'Uncle Bernard Obuobi: a cocoa farmer in his fifties, in a straw hat and rubber boots, standing beside a very tall old tree.',
      'The farm: a cocoa farm with shade trees, leaf litter on the ground and a patch of old forest at the back.',
      'The map: a drawing of a small Central American country with two shades of green showing forest long ago and today.',
    ],
    music: 'Warm, rustling forest sounds with a gentle guitar; a thoughtful tune at the debate (placeholder)',
    pages: [
      pg('🌳', 'Mabel spent the holiday on her uncle’s cocoa farm. At the back, behind the cocoa trees, stood a patch of old forest with one huge tree that three people could not circle with their arms. “Why did you never cut it, Uncle?” she asked. Uncle Bernard patted the trunk. “It gives shade, and it holds the soil. And my father told me never to cut the old ones.”', 'A girl stands beside a farmer and a huge old tree at the edge of a cocoa farm.'),
      pg('📖', 'That evening, Mabel read a story from her geography project: Costa Rica, a small country in Central America. “In the 1980s,” she read, “forest covered just over a fifth of the country, because so much had been cleared for farms and cattle. Today more than half of the country is forest.” She looked up. “Uncle, how can a country double its forest?”', 'A girl reads from a notebook by lamplight with a map of a small country beside her.'),
      pg('💵', 'Together they read on. Costa Rica passed a law in 1996 that banned turning forest land into farmland. It also started a scheme called payments for ecosystem services, which paid landowners to protect forest, because forests clean water, store carbon and shelter wildlife. “Nearly a million hectares have been in the scheme at some point,” Mabel read. Uncle Bernard whistled. “So the country paid people to keep trees standing,” he said. “That is a new idea to me.”', 'A farmer and a girl read about a payment scheme with a drawing of coins beside a tree.'),
      pg('⚖️', 'But Mabel’s article also gave the other side. “The payments have lost more than half their value over time because they were not raised with prices,” she read. “Some experts say the scheme works about as well as national parks, and others say it has not made a big difference. Large landowners can win contracts more easily than small ones, and the forest authority does not always have enough staff to stop illegal cutting.” Uncle Bernard nodded slowly. “Nothing is perfect,” he said.', 'A girl and a farmer study a page with a balance scale showing benefits and problems.'),
      pg('🤔', '“So what would work in Ghana?” asked Mabel. Uncle Bernard counted on his fingers. “We have a Forestry Commission and forest reserves already. But the reserves are being cut by illegal loggers, miners and fire. Reports differ on the main cause: some blame cocoa expansion, others say logging, mining and farming of other crops. The truth is probably all of them.” He smiled wryly. “And farmers like me need to earn something from keeping trees.”', 'A farmer counts reasons on his fingers beside a map of forest reserves with some marked in red.'),
      pg('🏫', 'Back at school, Mabel’s teacher asked each student to argue one side. Mabel chose to argue for paying farmers to keep forest. A classmate argued against, saying that the money should go to schools. “Both of you are making good points,” said the teacher. “A good argument gives a reason, supports it, admits the other side, and ends with a clear conclusion.” Mabel took a deep breath and began to write.', 'Two students stand at the front of a class holding notes while a teacher listens.'),
      pg('✍️', 'Mabel wrote: “Ghana should reward farmers who protect forest. Firstly, standing forest cleans our rivers and shelters animals that no money can replace. Secondly, Costa Rica shows that payments, together with strong laws, helped its forest to grow back. However, the payments must be fair to small farmers and must keep their value over time. Therefore, I believe the benefits outweigh the cost, provided that the scheme is honest and well managed.”', 'A girl writes an argument at her desk with a green tree sketched beside the page.'),
      pg('✅', 'Exam-safe tip: an argumentative paragraph states an opinion, gives reasons with linking words such as “firstly”, “secondly”, “however” and “therefore”, admits one fair objection and ends with a conclusion. Mabel used full words, no contractions and the same tense throughout. Notice that she did not claim Costa Rica’s system is perfect; honesty makes an argument stronger. The end.', 'A girl and her teacher underline the linking words in an argument.'),
    ],
    activities: [
      { id: 'cr-c1', type: 'comprehension', afterPage: 3, question: 'What two main things did Costa Rica do?', options: ['Banned turning forest into farmland and paid landowners to protect forest', 'Cut more forest and sold timber', 'Closed all farms'], correctIndex: 0 },
      { id: 'cr-p1', type: 'prediction', afterPage: 5, prompt: 'Uncle Bernard says nothing is perfect. What might be hard about paying farmers?', options: ['Making it fair to small farmers and keeping payments valuable', 'Finding trees', 'Counting leaves'] },
      { id: 'cr-c2', type: 'comprehension', afterPage: 8, question: 'Which linking words does Mabel use?', options: ['Firstly, secondly, however, therefore', 'Lol, btw, omg', 'Yes, no, maybe'], correctIndex: 0 },
      { id: 'cr-voc', type: 'vocabulary', afterPage: 3, word: 'ecosystem', definition: 'All the living things in a place and how they depend on each other and their surroundings.', distractors: ['A kind of farm', 'A type of tax'] },
      { id: 'cr-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Mabel asks why her uncle keeps an old tree.', 'She reads how Costa Rica grew its forest back.', 'She learns the problems with the scheme.', 'She writes an argument for paying farmers to protect forest.'] },
      { id: 'cr-sel', type: 'sel', afterPage: 8, prompt: 'Changing a whole country’s habits takes time. How do you feel about long, slow progress?', feelingOptions: ['Patient', 'Hopeful', 'Impatient', 'Determined'] },
    ],
    glossary: [
      { word: 'ecosystem', definition: 'All the living things in a place and how they depend on each other and their surroundings.', pages: [3] },
      { word: 'hectares', definition: 'Units of land area; one hectare is about the size of a football pitch and a half.', pages: [3] },
      { word: 'carbon', definition: 'An element stored in trees and soil; too much carbon dioxide in the air warms the planet.', pages: [3] },
      { word: 'reserves', definition: 'Areas of land set aside and protected by law.', pages: [5] },
      { word: 'scheme', definition: 'An organised plan or programme.', pages: [3] },
    ],
    culturalNotes: ['The students, uncle and farm are invented. The Costa Rica facts come from a published analysis: forest cover was just over 20 per cent in the 1980s and is now over 50 per cent (some sources say over 60 per cent); a 1996 law bans land-use change in forests; since 1997 nearly a million hectares have been enrolled at some point in a payments-for-ecosystem-services scheme; payments have lost over half their real value; effectiveness, fairness and enforcement are debated.', 'The Ghana details are given as differing accounts: reports differ on whether cocoa expansion, logging, mining or other farming is the main cause of forest loss.', 'The story uses the Ghanaian tradition of leaving old trees as a farmer’s own ethic; teachers can discuss local sayings and sacred trees.'],
    reviewQuestions: ['Check the Costa Rica figures and the PES scheme against a recent source (for example Costa Rica’s forest authority FONAFIFO and a peer-reviewed review), because forest-cover figures differ between sources.', 'Check that the story does not claim Ghana should copy Costa Rica but presents it as one example with strengths and weaknesses.', 'Check the argumentative-paragraph tip against the NaCCA English syllabus.'],
    guide: {
      overview: 'A story about a country that grew its forest back, told with its strengths and weaknesses, and about what a Ghanaian farmer’s family might learn. It models a balanced argumentative paragraph.',
      lessonMinutes: 45,
      goals: ['Describe two things Costa Rica did to restore its forest.', 'Explain at least two weaknesses of its scheme.', 'Write an argumentative paragraph with linking words and a conclusion.'],
      subjects: [['Social Studies', 'Resources and the environment'], ['Integrated Science', 'Ecosystems and carbon'], ['English Language', 'Argumentative writing']],
      before: ['Ask: why would a farmer keep a tree standing on his land?'],
      during: ['At page 4, ask learners to list the problems of the scheme.'],
      after: ['Hold a class debate: should farmers be paid to protect forest?', 'Write a paragraph for the opposite side.'],
      discussion: ['Who should pay for forests? Why?', 'How can small farmers be treated fairly?'],
      reflection: ['What would make you leave a forest standing if you owned the land?'],
      support: ['Provide an argument frame: I believe… Firstly… Secondly… However… Therefore…'],
      stretch: ['Write a letter to the District Forestry Manager proposing an approach for your area.'],
      localise: ['Use real local trees, forests and Forestry Commission practices; talk to a local farmer.'],
      factCheck: [
        { claim: 'Costa Rica’s forest cover fell to just over 20 per cent in the 1980s and has since risen to over 50 per cent; a 1996 law banned land-use change in forests and created payments for ecosystem services, which have enrolled nearly a million hectares since 1997 but have lost over half their real value; effectiveness, equity and enforcement are debated.', explanation: 'From a 2013 analysis of payments for ecosystem services in Costa Rica; other sources give a higher current forest cover (over 60 per cent).', reference: 'Eco-Business, “Payments for ecosystem services: Costa Rica’s recipe” (eco-business.com).' },
      ],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-woman-who-asked-for-trees',
    title: 'The Woman Who Asked for Trees',
    summary: 'Rita’s class studies Professor Wangari Maathai of Kenya, who earned a doctorate, listened to rural women who struggled to meet basic needs such as firewood and clean water, and started a tree-planting movement that won the Nobel Peace Prize in 2004. A story about how one idea, shared with others, can change a country, with a biography paragraph in exam-safe English.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 11,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['biography', 'informational', 'realistic-fiction'],
    themes: ['community', 'leadership', 'helping-others', 'farm-and-garden'],
    objectives: ['perseverance', 'environmental-awareness', 'citizenship', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 118,
    paceWord: 'Warm and inspiring, with steady pride',
    palette: ['#15803d', '#d97706'],
    voice: 'Eager girl’s voice for Rita; a warm, storytelling voice for Mr Ohene',
    characters: [
      'Rita Mansah: a 13-year-old girl in a school uniform, holding a small tree seedling in a polythene bag.',
      'Mr Ohene: the social studies teacher, in a patterned shirt, with a poster of a smiling woman among trees.',
      'Wangari Maathai: a Kenyan scientist and activist (1940–2011), shown in a poster in a bright headwrap, planting a tree with women.',
      'The school compound: a bare yard with red earth, a few seedlings in bags and students with watering cans.',
    ],
    music: 'Gentle East African-style lyre and drums; a rising, hopeful theme (placeholder)',
    pages: [
      pg('🌱', 'Mr Ohene held up a poster of a woman planting a tree surrounded by smiling women. “This,” he said, “is Professor Wangari Maathai of Kenya, who won the Nobel Peace Prize in 2004, not for fighting a war, but for planting trees.” Rita’s hand shot up. “Planting trees for a prize?” she asked. “Listen,” said Mr Ohene. “Her story begins with a girl from a village.”', 'A teacher holds up a poster of a woman planting a tree among women while a girl raises her hand.'),
      pg('📚', 'Wangari Maathai was born in 1940 in Nyeri, in Kenya. She studied biology in the United States, earned her master’s degree in 1966 and, in 1971, became the first woman in East and Central Africa to earn a doctorate, from the University of Nairobi. She later became head of a university department, again the first woman to do so. “She never stopped learning,” said Mr Ohene. “But the story does not stay in a laboratory.”', 'A woman in graduation robes stands in front of a university with books in her arms.'),
      pg('👂', '“In the 1970s,” Mr Ohene said, “Maathai travelled in rural Kenya and listened to women. They said that, unlike in the past, they could not meet their basic needs. Among the needs they named were firewood, clean drinking water, balanced diets, shelter and income. She linked these problems to damage to the environment. In her own Nobel lecture she remembered a childhood stream that has since dried up. So she suggested something simple: plant trees.” Rita frowned. “Just plant trees?” she asked. “Just plant trees, with the women’s own hands,” said Mr Ohene.', 'A woman scientist listens to a circle of rural women beside a dry stream bed.'),
      pg('🤝', 'The idea grew into the Green Belt Movement. Women’s groups raised seedlings in nurseries and planted them on farms, schools and church compounds. Nursery groups were given a small payment, reported to be less than ten United States cents, for each seedling that was planted and survived. “It gave women work and a voice,” said Mr Ohene. “And it spread. Other African countries began their own movements.”', 'Women water seedlings in a nursery with rows of small trees in tins and bags.'),
      pg('🔢', '“How many trees?” asked a boy. Mr Ohene smiled. “That depends on who is counting. The Nobel Prize biography says more than twenty million. Her Nobel lecture in 2004 says more than thirty million. The movement’s own 2011 report says more than fifty-one million. The count grew as the years passed, and every tree was planted by hand.” He looked at the class. “In her Nobel lecture, Maathai said that people who protect the environment, promote democracy and defend human rights ‘plant seeds of peace’. When you quote someone in an essay, copy the exact words.”', 'A teacher stands by a board with two different numbers for trees planted, circled in chalk.'),
      pg('🏅', 'In 2002 she was elected to Kenya’s parliament, and in 2004 she received the Nobel Peace Prize for her contribution to sustainable development, democracy and peace. She died on 25 September 2011. “She was not perfect, and nobody is,” said Mr Ohene. “But she showed that one idea, shared with others, can change a country.”', 'A woman stands on a stage receiving a medal from a smiling committee.'),
      pg('🌳', 'That afternoon, Rita and her classmates planted twelve seedlings along the school fence. They gave each one a label with a name, watered them and made a watering rota for the dry season. “We may be the generation that sees them grow,” said Rita. “And the next generation will sit under them.” She patted the soil. “Grow well,” she whispered.', 'Students plant seedlings along a school fence and label each with a small tag.'),
      pg('📝', 'Rita wrote a biography paragraph. “Wangari Maathai was born in Nyeri, Kenya, in 1940. She became a scientist and, in 1971, the first woman in East and Central Africa to earn a doctorate. After listening to rural women, she started a tree-planting movement that grew across Kenya. In 2004, she won the Nobel Peace Prize. She is remembered as a woman who proved that ordinary people can change the land.” The end.', 'A girl writes a short biography at her desk beside a seedling.'),
      pg('✅', 'Exam-safe tip: a biography paragraph is written in the third person and mostly in the past tense. It gives dates and facts in order, links them with words such as “after”, “later” and “in 2004”, and ends with a short judgement about the person. Rita did not use “I” in the paragraph. Check each date against your source before you write it. The end.', 'A girl and her teacher underline dates and past-tense verbs in a biography.'),
    ],
    activities: [
      { id: 'maa-c1', type: 'comprehension', afterPage: 3, question: 'What did rural women tell Wangari Maathai?', options: ['They could not meet basic needs such as firewood and clean water', 'They wanted more cars', 'They disliked trees'], correctIndex: 0 },
      { id: 'maa-p1', type: 'prediction', afterPage: 4, prompt: 'Maathai’s idea is to plant trees with women’s hands. What might it change?', options: ['Land, income and confidence', 'Nothing', 'The weather overnight'] },
      { id: 'maa-c2', type: 'comprehension', afterPage: 9, question: 'Why does Mr Ohene give two numbers for trees planted?', options: ['Sources differ, so he is honest about the uncertainty', 'He forgot', 'The numbers do not matter'], correctIndex: 0 },
      { id: 'maa-voc', type: 'vocabulary', afterPage: 5, word: 'movement', definition: 'A group of people working together for a cause.', distractors: ['A dance step', 'A kind of road'] },
      { id: 'maa-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Maathai earns a doctorate.', 'She listens to rural women.', 'The Green Belt Movement grows.', 'She wins the Nobel Peace Prize in 2004.'] },
      { id: 'maa-sel', type: 'sel', afterPage: 9, prompt: 'One idea can grow into something huge. How do you feel about starting small?', feelingOptions: ['Inspired', 'Determined', 'Hopeful', 'Curious'] },
    ],
    glossary: [
      { word: 'doctorate', definition: 'The highest university degree.', pages: [2] },
      { word: 'firewood', definition: 'Wood collected to burn for cooking or heat.', pages: [3] },
      { word: 'nurseries', definition: 'Places where young plants are grown.', pages: [4] },
      { word: 'sustainable', definition: 'Able to continue without using up or damaging resources.', pages: [6] },
      { word: 'rota', definition: 'A list of people taking turns to do a job.', pages: [7] },
    ],
    culturalNotes: ['Rita, Mr Ohene and the school are invented. Wangari Maathai (1940–2011) was a real public figure; the facts are from the Nobel Prize biography and other published sources: born in Nyeri, Kenya, in 1940; first woman in East and Central Africa to earn a doctorate (University of Nairobi, 1971); the Green Belt Movement planted trees with women’s groups; she won the Nobel Peace Prize in 2004 and died on 25 September 2011.', 'The small payment for each surviving seedling is from the Green Belt Movement’s own website (about US 10 cents, paid to nursery groups) and a YES! Magazine profile (a nominal amount, less than 10 US cents a tree); a figure of 4 Kenyan shillings was suggested in a review but not confirmed, so it is not used. Her Nobel lecture itself says only that the work creates employment.', 'The number of trees is shown as differing accounts (more than 20 million in the Nobel biography; more than 30 million in her 2004 Nobel lecture; more than 51 million in the Green Belt Movement’s 2011 annual report).', 'The quotation “plant seeds of peace” is checked against the text of her Nobel lecture (10 December 2004), where it describes people who protect the environment, promote democracy and defend human rights. The payment for surviving seedlings is also in the movement’s 2011 annual report (compensation for seedlings planted and surviving).'],
    reviewQuestions: ['Check every date and fact against the Nobel Prize biography and Nobel lecture (nobelprize.org), including what women told Maathai in the 1970s and the payment-per-tree detail.', 'Check the quotation on page 5 against the Nobel lecture.', 'Check the biography-paragraph tip against the NaCCA English syllabus.'],
    guide: {
      overview: 'A story about Wangari Maathai and the Green Belt Movement told through a Ghanaian class that plants its own trees. It models a biography paragraph in exam-safe English.',
      lessonMinutes: 45,
      goals: ['Describe how one idea became a movement.', 'Explain why numbers from different sources can differ.', 'Write a biography paragraph in the third person and past tense.'],
      subjects: [['Social Studies', 'Citizenship and leadership'], ['Integrated Science', 'Trees, soil and water'], ['English Language', 'Biography writing']],
      before: ['Ask: what small thing could you do that, repeated by many people, would matter?'],
      during: ['At page 5, ask learners how a writer should handle two different numbers.'],
      after: ['Plant and label a tree with an adult; write a watering rota.', 'Write a biography paragraph about a local hero.'],
      discussion: ['Why did Maathai start by listening?', 'Why did she pay the women for each surviving tree?'],
      reflection: ['What problem in your community might begin with listening?'],
      maths: [
        { task: 'A nursery plants 120 seedlings and 3 out of 4 survive. How many survive?', answer: '120 × 3/4 = 90.' },
        { task: 'Suppose a class waters each of its 12 seedlings with 2 litres of water a day, how many litres does it use a day?', answer: '12 × 2 = 24 litres.' },
      ],
      support: ['Provide a biography frame: Born… Studied… Later… Achieved… Remembered for…'],
      stretch: ['Write a biography of a Ghanaian environmental or community leader, using at least two sources.'],
      localise: ['Plant native trees chosen with a local forestry or agriculture officer; do not plant invasive species.'],
      factCheck: [
        { claim: 'Wangari Maathai was born in Nyeri, Kenya, in 1940; earned a doctorate from the University of Nairobi in 1971, the first woman in East and Central Africa to do so; led a tree-planting movement through women’s groups that planted more than 20 million trees (other sources say about 30 million); won the 2004 Nobel Peace Prize; and died on 25 September 2011.', explanation: 'From the Nobel Prize’s biographical note; the tree number is given as a range because sources differ.', reference: 'The Nobel Prize, “Wangari Maathai: Biographical” (nobelprize.org/prizes/peace/2004/maathai/biographical).' },
      ],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-bacterium-in-the-insulin-bottle',
    title: 'The Bacterium in the Insulin Bottle',
    summary: 'Grace’s grandfather injects insulin every day, and she learns that it is made by ordinary bacteria. From a hot-spring microbe that powers modern DNA tests to a wormwood plant that gave the world a malaria drug, she discovers why scientists say we should keep every species: nobody can know which one will matter. A story about precaution and wonder, with explanatory writing in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['science', 'informational', 'realistic-fiction'],
    themes: ['health-and-wellbeing', 'family', 'technology'],
    objectives: ['scientific-curiosity', 'environmental-awareness', 'critical-thinking', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 118,
    paceWord: 'Curious and gentle, slowing for the science',
    palette: ['#0e7490', '#be123c'],
    voice: 'Curious girl’s voice for Grace; a kind, patient voice for Papa Jacob; a clear voice for Mr Enchill',
    characters: [
      'Grace Sefa: a 14-year-old girl in a school uniform, holding a small glass bottle labelled “insulin”.',
      'Papa Jacob: her grandfather, in his seventies, in a cardigan, with a kind smile and a small injection kit.',
      'Mr Enchill: the science teacher, in a lab coat, with a diagram of a bacterium and a DNA loop.',
      'The bacterium: a tiny rod-shaped microbe drawn very large on a board with a small circle of DNA inside.',
    ],
    music: 'Quiet laboratory hum with a soft piano; a wondering, rising theme at the big idea (placeholder)',
    pages: [
      pg('💉', 'Every morning, Grace’s grandfather, Papa Jacob, injected a small dose of insulin. He had diabetes, which means that his body could not manage sugar in his blood without help. Insulin works like a key: it tells the body’s cells to take sugar out of the blood and use it. One day, Grace picked up the little bottle. “Papa,” she asked, “where does insulin come from?” Papa Jacob smiled. “From a laboratory,” he said. “But ask your science teacher about the bacteria.” Grace blinked. “Bacteria?”', 'A girl holds a small insulin bottle while her grandfather prepares an injection at a table.'),
      pg('🔬', 'Mr Enchill drew a bacterium on the board, with a tiny loop of DNA inside. “Long ago,” he said, “insulin for people with diabetes came from the pancreas of pigs and cows. It took an enormous amount of animal tissue. In 1923, about ten thousand pounds of pancreas were needed to make one pound of pure insulin. Supply was limited, and for some people the animal insulin caused reactions.”', 'A teacher draws a bacterium and a pig and cow on a board with arrows to a bottle.'),
      pg('🧬', '“Then scientists had an idea,” he continued. “In 1973, researchers showed they could cut open a loop of bacterial DNA, put in a gene from another living thing and close it again. A few years later, a team in the United States made the human insulin gene work inside bacteria. The bacteria multiplied in large tanks and produced insulin identical to the human kind. In 1982, the first such medicine was approved.” Grace’s mouth fell open. “Bacteria,” she said, “make my grandfather’s insulin.”', 'A teacher shows a diagram of a DNA loop with a gene inserted and bacteria in a tank.'),
      pg('♨️', '“And the story gets better,” said Mr Enchill. “In 1964, a scientist visited hot springs in Yellowstone Park in the United States and found bacteria living in water that would cook most living things. Years later, scientists isolated an enzyme from one of those bacteria that does not break down in heat. That enzyme became the heart of a method called PCR, which works like a molecular photocopier: using cycles of heating and cooling, it makes millions of copies of one chosen piece of DNA that already exists. PCR is used in disease testing and in forensic science, which identifies people from tiny samples.” Grace’s eyes shone. “From a hot spring,” she whispered.', 'A teacher points to a picture of a steaming hot spring with a tiny microbe drawn beside it.'),
      pg('🌿', '“One more,” said Mr Enchill. “A Chinese scientist, Tu Youyou, searched an ancient medical text about a plant called sweet wormwood. Her team isolated artemisinin from it, and in 2015 she shared the Nobel Prize for the discovery. The Nobel committee said that artemisinin-based treatments save more than a hundred thousand lives a year in Africa. As a separate example of a lucky discovery, in 1928 Alexander Fleming noticed that a mould had landed on a dish of bacteria and killed those near it. That mould led to penicillin.” He paused. “Every one of these came from living things that few people noticed.”', 'A teacher holds up a sprig of a plant beside a picture of a mould in a dish.'),
      pg('🇬🇭', '“Does Ghana have any?” asked Grace. “We have wonderful plants,” said Mr Enchill. “For example, the root of a plant called nibima, Cryptolepis sanguinolenta, has long been used by Ghanaian herbalists. Researchers at the Centre for Plant Medicine Research report promising laboratory results. But I must be honest: laboratory results are not proof of a medicine, and no one should replace proper malaria treatment with a plant. It shows only how much is still to be studied.”', 'A teacher shows a picture of a root plant beside a photo of a research centre with a caution sign.'),
      pg('⚖️', 'A boy asked, “So should we protect every species because it might give us medicine?” Mr Enchill thought. “That is one reason, and the strongest form of it is the precaution argument. We cannot tell in advance which species will matter, and once a species is gone, it is gone for ever. But I will be honest again: most species will not become medicines. We also protect them because forests and rivers depend on them, because they are part of our heritage, and because we have a duty not to destroy what we do not understand.”', 'A teacher stands before a board with three reasons written in a column: precaution, ecosystems, heritage.'),
      pg('✍️', 'For homework, the class wrote how human insulin is made. Grace wrote: “First, scientists identify the gene that carries the instructions for human insulin. Next, they insert the gene into a loop of bacterial DNA. Then the bacteria are grown in large tanks, where they multiply and produce insulin. After that, the insulin is separated and purified. Finally, it is tested and put into bottles for patients.”', 'A girl writes the steps of insulin production at a desk with a bottle beside her.'),
      pg('✅', 'Exam-safe tip: when you explain a process, use sequence words such as “first”, “next”, “then”, “after that” and “finally”, write in the present tense, and use full words. Grace’s paragraph can be followed step by step. She did not claim more than she knew, and she checked each fact. A good scientist is a careful, honest writer. The end.', 'A girl and her teacher circle the sequence words in a paragraph.'),
    ],
    activities: [
      { id: 'ins-c1', type: 'comprehension', afterPage: 3, question: 'Where did insulin come from before genetic engineering?', options: ['The pancreas of pigs and cows', 'Fruit', 'Rainwater'], correctIndex: 0 },
      { id: 'ins-p1', type: 'prediction', afterPage: 5, prompt: 'Mr Enchill says hot-spring bacteria gave science a useful enzyme. What might it be used for?', options: ['Copying DNA for tests', 'Making bricks', 'Cooking rice'] },
      { id: 'ins-c2', type: 'comprehension', afterPage: 9, question: 'Which words show the order of steps in Grace’s paragraph?', options: ['First, next, then, finally', 'Lol, btw, omg', 'Yes, no, maybe'], correctIndex: 0 },
      { id: 'ins-voc', type: 'vocabulary', afterPage: 4, word: 'enzyme', definition: 'A substance made by living things that speeds up a chemical change.', distractors: ['A kind of sugar', 'A type of medicine bottle'] },
      { id: 'ins-s1', type: 'sequencing', prompt: 'Put the steps of making insulin in order.', items: ['Identify the gene for human insulin.', 'Insert the gene into bacterial DNA.', 'Grow the bacteria in large tanks.', 'Purify and test the insulin.'] },
      { id: 'ins-sel', type: 'sel', afterPage: 9, prompt: 'Learning that tiny living things help people can bring wonder. How do you feel?', feelingOptions: ['Amazed', 'Curious', 'Respectful', 'Grateful'] },
    ],
    glossary: [
      { word: 'diabetes', definition: 'A condition in which the body cannot control the sugar in the blood properly.', pages: [1] },
      { word: 'pancreas', definition: 'An organ that makes insulin.', pages: [2] },
      { word: 'bacterium', definition: 'A tiny living thing made of one cell (plural: bacteria).', pages: [2] },
      { word: 'enzyme', definition: 'A substance made by living things that speeds up a chemical change.', pages: [4] },
      { word: 'precaution', definition: 'Care taken in advance to avoid a risk.', pages: [7] },
    ],
    culturalNotes: ['Grace, Papa Jacob and Mr Enchill are invented. The science facts are from published sources: before genetic engineering, insulin came from the pancreas of pigs and cows (about ten thousand pounds of pancreas for one pound of crystals in 1923); in 1973 researchers showed that genes can be moved between bacteria; the first human insulin made in bacteria was approved in 1982; a heat-stable enzyme from Yellowstone bacteria made PCR practical; artemisinin came from sweet wormwood and the 2015 Nobel committee estimated it saves over 100,000 lives a year in Africa.', 'The nibima (Cryptolepis sanguinolenta) lines report laboratory findings only; no human clinical trial result is claimed. The story warns that no one should replace proper malaria treatment with a plant.', 'The idea that “everything should be kept because we cannot know what will be useful” is shown as the precaution argument, with an honest note that most species will not become medicines and that there are other strong reasons to protect them.'],
    reviewQuestions: ['Have a biology teacher check the simplified description of how insulin is made with bacteria and how PCR works.', 'Check the separate penicillin example (Fleming, 1928; Penicillium mould killing nearby Staphylococcus bacteria) and the description of insulin as a key for cells with a reliable source.', 'Check that the diabetes details are accurate and respectful, that the story does not give medical advice, and that families affected by diabetes are not alarmed.'],
    guide: {
      overview: 'A story about insulin, bacteria and the precaution argument for protecting biodiversity. It models explanatory writing with sequence words.',
      lessonMinutes: 50,
      goals: ['Explain in order how human insulin is made using bacteria.', 'Give three examples of useful discoveries from wild living things.', 'Explain the precaution argument and why it is not the only reason to protect species.'],
      subjects: [['Integrated Science', 'Bacteria, enzymes and medicine'], ['Biology (preview)', 'Genes and biotechnology'], ['English Language', 'Explanatory writing']],
      before: ['Ask: which living things have you seen that might one day help people?'],
      during: ['At page 7, ask learners to rank the three reasons for protecting species.'],
      after: ['Write a process paragraph on how a seed grows, using sequence words.', 'Research one medicine that came from a plant, mould or microbe.'],
      discussion: ['Is “we may need it one day” a good reason to protect a species? What other reasons are there?', 'What does it mean that extinction is permanent?'],
      reflection: ['What is one living thing near you that you would like to protect and why?'],
      support: ['Provide a process frame: First… Next… Then… After that… Finally…'],
      stretch: ['Write a short article for the school magazine on why scientists study hot springs.'],
      localise: ['Use real local plants and the research of your regional university; never recommend a plant as medicine without professional advice.'],
      factCheck: [
        { claim: 'Human insulin made in bacteria was first achieved in 1978 by a Genentech and City of Hope team, and the first such medicine (Humulin) was approved in 1982; before that insulin came from the pancreas of pigs and cows.', explanation: 'From the US National Science Foundation’s account of recombinant insulin.', reference: 'NSF, “rDNA insulin” (nsf.gov/impacts/rdna-insulin).' },
        { claim: 'A heat-stable enzyme (Taq) from a Yellowstone hot-spring bacterium was isolated about a decade after the 1964 discovery of the bacterium, and became the basis of PCR.', explanation: 'From the US National Science Foundation’s account of PCR.', reference: 'NSF, “polymerase chain reaction” (nsf.gov/impacts/polymerase-chain-reaction).' },
        { claim: 'Artemisinin, from sweet wormwood, was discovered by Tu Youyou’s team after a search of ancient texts; she shared the 2015 Nobel Prize; the Nobel committee estimated over 100,000 lives saved each year in Africa; resistance has emerged in Southeast Asia.', explanation: 'From a PBS NewsHour report on the 2015 prize.', reference: 'PBS NewsHour, “Chinese herbal therapy for malaria wins part of Nobel Prize in medicine” (pbs.org/newshour).' },
      ],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-monkeys-of-boabeng-fiema',
    title: 'The Monkeys of Boabeng-Fiema',
    summary: 'In two Ghanaian villages, monkeys are treated as sacred, and for generations nobody has harmed them. Silas visits with his class and meets a guide who explains the taboo, the monkey funerals, the problems that feeding causes and what science adds to tradition. A story about how culture can protect nature, with a narrative using correctly punctuated dialogue in exam-safe English.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 11,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['cultural', 'nature', 'realistic-fiction'],
    themes: ['community', 'identity', 'farm-and-garden', 'new-beginnings'],
    objectives: ['cultural-heritage', 'environmental-awareness', 'respect', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 118,
    paceWord: 'Gentle and respectful, with rustling forest sounds',
    palette: ['#166534', '#b45309'],
    voice: 'Eager boy’s voice for Silas; a calm, proud guide voice for Mr Darkwah; a warm voice for Madam Blay',
    characters: [
      'Silas Baffoe: a 14-year-old boy in a school uniform, holding a notebook with a pencil, gazing up at a tree.',
      'Mr Darkwah: a community guide, in his fifties, in a straw hat, with a staff and a quiet smile.',
      'Madam Blay: the class teacher, in a headscarf, with a school bus behind her.',
      'The monkeys: mona monkeys and black-and-white colobus monkeys moving through the trees of a small forest beside a village.',
    ],
    music: 'Soft village drums with forest birdsong and leaf rustle; a quiet, respectful tune at the funeral scene (placeholder)',
    pages: [
      pg('🚌', 'The school bus rattled along a red road, and the class piled out in a village. “Welcome to Boabeng and Fiema,” said Mr Darkwah, the community guide. “Two villages beside one forest, and a forest beside two villages. Please walk gently, and do not offer food to the monkeys.” Silas looked up. In the trees above, black-and-white monkeys were leaping from branch to branch, calm as villagers on a market day.', 'Students step from a bus into a village while monkeys move through the trees overhead.'),
      pg('🙏', '“The villagers here,” said Mr Darkwah, “have long believed that the monkeys are sacred. For generations, nobody has been allowed to harm them, and the belief is passed from parents to children. When a monkey dies, it is buried in a small coffin, with respect and with rites, like a member of the community.” Silas wrote it down. “A funeral for a monkey,” he whispered.', 'A guide points to a small wooden coffin beside a grave marker under a tree.'),
      pg('🌳', '“The forest here is small, only about two square kilometres, a sanctuary of 192 hectares inside a larger sacred grove of about four and a half,” said Mr Darkwah, “but the animals have been safe in it because the community protects it. Estimates for the sanctuary run from about six hundred to over seven hundred monkeys, and counts change from year to year. The two main kinds are the white-thighed colobus, which some books call Geoffroy’s pied colobus, and Campbell’s mona monkey. The colobus is critically endangered, yet researchers say this may be the only growing population of its kind in West Africa. Counts for 2006 differ between studies, from about 241 to over 365, so nobody here can give a firm number today.” Silas wrote in his notebook: forest small, monkeys many, community the guard.', 'A guide points to a map of a small forest patch surrounded by farms and houses.'),
      pg('🔬', 'Madam Blay added, “This is called traditional conservation, which is protecting nature through custom and belief, rather than only through laws. Researchers have studied this sanctuary as an example. The belief protects the animals, and the animals, in turn, help the forest, because monkeys eat fruits and spread seeds as they travel.” Silas frowned. “Is the belief true, or is it just a story?” he asked.', 'A teacher stands beside a diagram of a monkey eating fruit and seeds falling to the forest floor.'),
      pg('🤝', 'Mr Darkwah did not mind the question. “Some beliefs are about the spirit, and those I leave to our elders,” he said. “But whatever one believes about spirits, the monkeys protected by this custom are alive today, and the forest is standing. A custom can be a strong conservation tool, and a scientist can count and study. The best protection is when both listen to each other.”', 'A guide and a boy talk while a monkey sits on a branch above them.'),
      pg('⚠️', 'But Mr Darkwah was honest about the problems. “When visitors or villagers feed the monkeys, they start to expect it, and that causes conflict over food. The roads are poor, so fewer visitors come, and the community earns less from tourism. And the forest is surrounded by farms, so it cannot grow.” He looked at the students. “The old way needs new help: better roads, fair tourism money and children who understand why this forest matters.”', 'A guide points to a poor road, a farm boundary and a monkey on a roof as examples of problems.'),
      pg('🐒', 'Silas did not feed a single monkey. When he stood under a tall tree, a young mona monkey dropped from a branch and watched him from a distance. “It is looking at me,” he whispered. “Only watch,” said Mr Darkwah, smiling. “That is how we say hello here.” Silas watched until the monkey leaped away, and he felt as though he had been introduced to the forest.', 'A boy stands still under a tree as a young monkey watches him from a low branch.'),
      pg('✍️', 'On the bus ride home, Silas wrote a narrative. “‘Please walk gently,’ said Mr Darkwah as we entered the forest. ‘The monkeys were here long before us.’ I nodded and kept my voice low. High above, a monkey leaped across the branches. ‘They look like they own the place,’ whispered my friend. ‘They do,’ said Mr Darkwah, smiling, ‘and we are only guests.’”', 'A boy writes in a notebook on a school bus with trees passing outside.'),
      pg('✅', 'Exam-safe tip: in direct speech, put the spoken words inside quotation marks, begin each speaker’s words with a capital letter, put the comma or full stop inside the closing quotation mark and start a new line for each new speaker. Silas wrote “said Mr Darkwah” after the words and kept the tense in the past. Check every quotation mark before you hand in your narrative. The end.', 'A boy and his teacher check the quotation marks and capital letters in a piece of dialogue.'),
    ],
    activities: [
      { id: 'boa-c1', type: 'comprehension', afterPage: 3, question: 'How are monkeys treated when they die in Boabeng-Fiema?', options: ['They are buried with respect, in small coffins', 'They are left in the forest', 'They are sold'], correctIndex: 0 },
      { id: 'boa-p1', type: 'prediction', afterPage: 6, prompt: 'Mr Darkwah says the old way needs new help. What might help?', options: ['Better roads, fair tourism money and educated children', 'Feeding the monkeys more', 'Cutting the forest'] },
      { id: 'boa-c2', type: 'comprehension', afterPage: 9, question: 'Where does the comma go in direct speech?', options: ['Inside the closing quotation mark', 'Outside every time', 'It is not needed'], correctIndex: 0 },
      { id: 'boa-voc', type: 'vocabulary', afterPage: 5, word: 'sanctuary', definition: 'A protected place where animals are kept safe.', distractors: ['A zoo shop', 'A farm'] },
      { id: 'boa-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The class arrives at the villages.', 'Mr Darkwah explains the custom and the funerals.', 'He explains the problems.', 'Silas writes a narrative on the bus.'] },
      { id: 'boa-sel', type: 'sel', afterPage: 9, prompt: 'Watching a wild animal quietly can feel special. How do you feel when you see one?', feelingOptions: ['Calm', 'Amazed', 'Respectful', 'Happy'] },
    ],
    glossary: [
      { word: 'sacred', definition: 'Treated as holy and to be respected.', pages: [2] },
      { word: 'sanctuary', definition: 'A protected place where animals are kept safe.', pages: [3] },
      { word: 'rites', definition: 'Formal ceremonies or customs.', pages: [2] },
      { word: 'conservation', definition: 'Protecting nature and wildlife.', pages: [4] },
      { word: 'tourism', definition: 'Visiting places for interest and leisure.', pages: [6] },
    ],
    culturalNotes: ['Silas, Mr Darkwah and Madam Blay are invented. The Boabeng-Fiema Monkey Sanctuary is a real community sanctuary in the Bono East Region of Ghana, where local custom has long protected monkeys. The details here (monkeys treated as sacred, burial with rites, about 700 monkeys, a small sanctuary of 192 hectares (about 1.9 square kilometres) inside a sacred grove of about 4.4 to 4.5 square kilometres, problems with feeding and poor roads) come from published descriptions and should be checked with the community.', 'Species names differ between sources (“Geoffroy’s pied colobus” and “white-thighed colobus”, Colobus vellerosus; Campbell’s mona monkey is also called Lowe’s mona monkey). Colobus counts for 2006 differ: about 241 (University of Ghana study, citing Wong and Sicotte 2006) and over 365 (Species Survival Commission page, citing the same authors), so the story gives no single figure; the split between colobus and mona monkeys is not confirmed, so the story gives only a total range. A Journal of Tropical Ecology census (1990 to 2020) reports colobus growth of about 252 per cent in the sanctuary itself; yearly totals such as 451 in 2020 are not in the abstract and are not used. Sanctuary area: a University of Ghana study (Attuquayefio and Gyampoh) describes a 192-hectare sanctuary within a 4.5 square kilometre sacred grove, which explains the 1.9 and 4.4 figures.', 'The story respects the belief and does not argue that it is only a story; it shows how custom and science can work together.'],
    reviewQuestions: ['Have the Boabeng-Fiema community, the sanctuary management or the Ghana Wildlife Division review the story for accuracy and respect, including the funeral rites and the numbers.', 'Check the species names and the population figure with a recent survey by the sanctuary or a university.', 'Check the dialogue-punctuation tip against the NaCCA English syllabus.'],
    guide: {
      overview: 'A story about a real Ghanaian example of traditional conservation, told with respect for belief, honest about problems and curious about science. It models correctly punctuated direct speech.',
      lessonMinutes: 45,
      goals: ['Explain how custom can protect wildlife.', 'Name two problems the sanctuary faces.', 'Punctuate direct speech correctly in a narrative.'],
      subjects: [['Social Studies', 'Culture and environment'], ['Integrated Science', 'Forests and seed dispersal'], ['English Language', 'Narrative writing and dialogue']],
      before: ['Ask: are there animals, trees or places that your community protects by custom? Why?'],
      during: ['At page 5, ask learners how to respect a belief while asking questions.'],
      after: ['Interview an elder about a custom that protects nature; write a narrative with dialogue.', 'Plan a respectful visit to a local sacred grove or reserve.'],
      discussion: ['Can belief and science both protect a forest?', 'How should tourism money be shared with the community?'],
      reflection: ['What custom in your family or village protects something valuable?'],
      support: ['Provide a dialogue frame with correct quotation marks and a checklist.'],
      stretch: ['Write a short report on a traditional protection of a forest, river or animal in your region, with a source.'],
      localise: ['Use your own region’s customs and species. Follow community rules on visiting; never feed wild animals.'],
      factCheck: [
        { claim: 'At Boabeng-Fiema in Ghana’s Bono East Region, monkeys have long been treated as sacred, are buried with rites when they die, and live in a 192-hectare sanctuary within a sacred grove of about 4.5 square kilometres, with an estimated 600 to 700 or more monkeys; feeding by people causes conflict and poor roads limit visitors.', explanation: 'From a published description of the sanctuary; the figures are approximate and species names differ between sources.', reference: 'Wikipedia, “Boabeng-Fiema Monkey Sanctuary”; Oryx, “Boabeng-Fiema Monkey Sanctuary: an example of traditional conservation in Ghana” (cambridge.org). Verify with the sanctuary.' },
      ],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-midge-that-makes-the-chocolate',
    title: 'The Midge That Makes the Chocolate',
    summary: 'Roland thinks bees pollinate cocoa. His agriculture teacher shows him the real workers: biting midges barely two millimetres long that need shade, damp leaf litter and rotting wood. A story about how a tiny insect connects a cocoa farm, a forest floor and a bar of chocolate, with a school-magazine article in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['science', 'informational', 'realistic-fiction'],
    themes: ['farm-and-garden', 'food', 'money-and-enterprise', 'community'],
    objectives: ['scientific-curiosity', 'environmental-awareness', 'reasoning', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-food', 'local-names'],
    wpm: 118,
    paceWord: 'Curious and quietly amazed, slowing for the tiny details',
    palette: ['#78350f', '#16a34a'],
    voice: 'Eager boy’s voice for Roland; a patient, curious voice for Mrs Amoo; a friendly voice for Marvin',
    characters: [
      'Roland Bampoe: a 14-year-old boy in a school uniform, holding a hand lens above a cocoa flower.',
      'Mrs Amoo: the agriculture teacher, in a work apron and straw hat, with a small pot of leaf litter.',
      'Marvin Coleman: Roland’s friend and school-magazine editor, with a notebook and a pen.',
      'The cocoa tree: a cocoa tree under taller shade trees, with tiny pink-white flowers growing straight from the trunk and large pods beside them.',
    ],
    music: 'Gentle, buzzing marimba with soft farm sounds; a warm, wondering tune at the discovery (placeholder)',
    pages: [
      pg('🍫', 'On his father’s cocoa farm, Roland loved the pods that hung from the trunks like bright lanterns. “Bees must make all this,” he said, and Marvin, his friend, wrote it down. At school, Mrs Amoo, the agriculture teacher, raised an eyebrow. “Bees?” she said. “Follow me. I will show you who really works for your chocolate.”', 'A boy and his friend look at a cocoa tree with pods hanging from the trunk.'),
      pg('🔍', 'Under a cocoa tree, Mrs Amoo handed Roland a hand lens. “Look at the flower,” she said. Roland saw a tiny five-petalled flower growing straight from the trunk. “It is small,” he said. “And it lasts only a day or two,” said Mrs Amoo. “The flower cannot pollinate itself. It needs an insect small enough to crawl into it. Bees are too big. The workers are biting midges, one to three millimetres long.”', 'A boy looks through a hand lens at a tiny cocoa flower on a trunk while a teacher watches.'),
      pg('🦟', '“Midges?” said Marvin, with a face. “Do they bite us?” “Some species do, but the ones that pollinate cocoa are tiny, only a few millimetres long,” said Mrs Amoo. “Cocoa flowers make no nectar, so the midges are not visiting for a meal. They are drawn to the flower and crawl inside, and pollen sticks to them by accident. Scientists are still studying what draws them in. And they are not very efficient. Only about one flower in four hundred to five hundred sets fruit, and only ten to thirty per cent of the pods that start growing reach maturity.” Roland whistled. “So every pod is a small miracle,” he said.', 'A boy and a friend look at a diagram showing tiny midges visiting a cocoa flower.'),
      pg('🍂', '“Now the surprising part,” said Mrs Amoo. She knelt and scooped up a handful of damp, rotting leaves. “The midge’s young, its larvae, live in damp places like this: composting leaf litter and rotting wood on the forest floor. Cocoa grows naturally under taller forest trees. If the shade trees are cut and the leaf litter is swept or burned away, the midges lose their home. Researchers say this may push pollination lower still.”', 'A teacher holds a handful of damp leaf litter beside a cocoa tree with taller trees above.'),
      pg('🤔', 'Roland thought of the day his father cleared some shade trees. “My father wanted more sun for the cocoa,” he said. “Farmers have many reasons,” said Mrs Amoo. “Some want faster growth, others need space or timber. I will not say that all clearing is wrong. But I can say what the midge article says: clearing shade trees harms midge habitat. And reports differ on how much of Ghana’s forest loss is due to cocoa, so we must not blame one cause.”', 'A boy stands thoughtfully between a cleared area and a shaded part of a cocoa farm.'),
      pg('🌳', 'Marvin raised his hand. “So what can farmers do?” Mrs Amoo smiled. “Leave some shade trees, and leave leaf litter on the ground, because that gives the midges a place to breed. These are simple steps that cost little. And ask your extension officer, because they know your soil and your trees.” Roland looked at his notes. “I will tell my father,” he said, “and I will not sweep the litter under the cocoa trees any more.”', 'A teacher points to a shade tree and a leaf-litter layer under cocoa trees while students take notes.'),
      pg('📰', 'Marvin printed Roland’s article in the school magazine. “THE TINY WORKERS BEHIND OUR CHOCOLATE. By Roland Bampoe. Many people think bees pollinate cocoa, but the real workers are biting midges only one to three millimetres long. These insects need shade, damp leaf litter and rotting wood in which to breed. Consequently, when farmers clear shade trees and sweep away the litter, they may reduce the number of midges. Farmers can help by keeping some shade trees and leaving the leaf litter. Every pod of cocoa depends on a creature smaller than a grain of rice.”', 'A school magazine page with a headline, byline and a drawing of a tiny midge on a cocoa flower.'),
      pg('✅', 'Exam-safe tip: a magazine article has a headline in capitals, a byline with the writer’s name, an opening that catches attention, a body with facts and a clear closing line. It uses formal, clear language with no contractions or slang, and facts that can be checked. Roland’s article uses “consequently” to link cause and effect. Remember to give only facts you are sure of. The end.', 'A boy and his friend look at a finished magazine article with the headline underlined.'),
    ],
    activities: [
      { id: 'mid-c1', type: 'comprehension', afterPage: 3, question: 'Why are bees not the main pollinators of cocoa?', options: ['The flowers are tiny and need insects small enough to crawl in', 'Bees dislike chocolate', 'Cocoa has no flowers'], correctIndex: 0 },
      { id: 'mid-p1', type: 'prediction', afterPage: 5, prompt: 'Midge larvae live in damp leaf litter and rotting wood. What may happen if farmers sweep it all away?', options: ['Fewer midges', 'More midges', 'No change'] },
      { id: 'mid-c2', type: 'comprehension', afterPage: 8, question: 'Which word does Roland use to link cause and effect in his article?', options: ['Consequently', 'By the way', 'Anyway'], correctIndex: 0 },
      { id: 'mid-voc', type: 'vocabulary', afterPage: 4, word: 'pollinate', definition: 'To carry pollen so that a flower can make fruit or seeds.', distractors: ['To eat flowers', 'To water a plant'] },
      { id: 'mid-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Roland thinks bees pollinate cocoa.', 'Mrs Amoo shows him the tiny flower and midges.', 'She explains what the midges need.', 'Roland writes a magazine article.'] },
      { id: 'mid-sel', type: 'sel', afterPage: 8, prompt: 'Learning that a tiny creature does big work can change how we see a farm. How do you feel?', feelingOptions: ['Amazed', 'Curious', 'Respectful', 'Inspired'] },
    ],
    glossary: [
      { word: 'pollinate', definition: 'To carry pollen so that a flower can make fruit or seeds.', pages: [2] },
      { word: 'larvae', definition: 'The young stage of some insects, before they become adults.', pages: [4] },
      { word: 'litter', definition: 'Fallen leaves and plant bits lying on the ground.', pages: [4, 6] },
      { word: 'extension', definition: 'Advice and training for farmers from agricultural officers.', pages: [6] },
      { word: 'consequently', definition: 'As a result.', pages: [7] },
    ],
    culturalNotes: ['Roland, Mrs Amoo, Marvin and the school are invented. The cocoa facts come from the Natural History Museum’s article on cocoa pollinators: biting midges (family Ceratopogonidae, genus Forcipomyia) are the main pollinators; they are about one to three millimetres long; cocoa flowers grow on the trunk, cannot self-pollinate and last one or two days; roughly one in 400 to 500 flowers sets fruit and 10 to 30 per cent of young pods mature; larvae live in damp rotting wood and leaf litter; clearing shade trees harms midge habitat.', 'The story does not say that all clearing is wrong. It also shows that reports differ on how much of Ghana’s forest loss is due to cocoa expansion and how much to logging, mining and other farming.', 'The story gives only simple steps (keep some shade trees, leave leaf litter) and tells readers to ask their agricultural extension officer; it does not give yield figures.'],
    reviewQuestions: ['Have an agricultural officer or a cocoa researcher check the pollination facts and the advice on shade and leaf litter against current practice and COCOBOD or CRIG guidance.', 'Check the statement that cocoa flowers make no nectar and that midges pollinate by accident (page 3) against a cocoa pollination source.', 'Check the article-writing tip against the NaCCA English syllabus.'],
    guide: {
      overview: 'A story about the tiny pollinators of cocoa and what they need. It links forests, farms and food and models a school-magazine article.',
      lessonMinutes: 45,
      goals: ['Explain what pollinates cocoa and what it needs to live.', 'Describe two steps a farmer can take to help.', 'Write a short article with a headline, byline and a clear closing line.'],
      subjects: [['Agricultural Science', 'Pollination and cocoa'], ['Integrated Science', 'Insects and ecosystems'], ['English Language', 'Article writing']],
      before: ['Ask: where does chocolate come from? What does a cocoa flower need to become a pod?'],
      during: ['At page 4, ask learners to name the three things midges need.'],
      after: ['Observe leaf litter with a hand lens (outdoors, with an adult) and sketch what you see.', 'Write a magazine article about a small animal that helps your family farm.'],
      discussion: ['Why might a farmer clear shade trees? What are other options?', 'How does a tiny insect connect a forest to a chocolate bar?'],
      reflection: ['Which small creature on your farm or compound do you rarely notice?'],
      maths: [
        { task: 'If one flower in 450 sets fruit, how many pods might 9,000 flowers produce?', answer: '9,000 ÷ 450 = 20 pods.' },
        { task: 'If 20 per cent of 50 young pods mature, how many mature?', answer: '0.20 × 50 = 10 pods.' },
      ],
      support: ['Provide an article frame: HEADLINE, byline, opening line, two facts, one cause and effect, closing line.'],
      stretch: ['Write a letter to the District Agricultural Officer asking for advice on shade trees for a cocoa farm.'],
      localise: ['Ask your local extension officer about shade-tree species and cocoa practice in your district; do not copy another region’s advice blindly.'],
      factCheck: [
        { claim: 'Cocoa is mainly pollinated by biting midges (genus Forcipomyia) one to three millimetres long; the flowers last one or two days, grow on the trunk and cannot self-pollinate; roughly one in 400 to 500 flowers sets fruit; larvae develop in damp rotting wood and leaf litter; clearing shade trees harms midge habitat.', explanation: 'From a Natural History Museum article on cocoa pollinators.', reference: 'Natural History Museum, “Flies are saving your chocolate cravings” (nhm.ac.uk).' },
      ],
    },
  }),

  // 8 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-forest-that-feeds-the-rivers',
    title: 'The Forest That Feeds the Rivers',
    summary: 'The Atewa range in Ghana’s Eastern Region is a forest at the headwaters of rivers, with thousands of plant species and hundreds of butterflies, and it has been argued over for years: bauxite mining for national revenue, or protection for water and wildlife. Nelson interviews a farmer, a conservationist, a young miner and an official and learns that honest people disagree. A balanced story with a discursive essay in exam-safe English.',
    classIds: ['jhs-2', 'jhs-3'],
    ageMin: 13,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['informational', 'realistic-fiction', 'drama'],
    themes: ['community', 'citizenship', 'leadership', 'money-and-enterprise'],
    objectives: ['critical-thinking', 'environmental-awareness', 'citizenship', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 118,
    paceWord: 'Careful and balanced, like a good interview',
    palette: ['#047857', '#b45309'],
    voice: 'Thoughtful boy’s voice for Nelson; distinct, respectful adult voices for each interviewee',
    characters: [
      'Nelson Forson: a 14-year-old school-magazine reporter, with a recorder and a notebook, in a school uniform.',
      'Madam Janet Sakyi: a conservationist from an environmental group, in field clothes, with a map of a forest and rivers.',
      'Victor Ennin: a 17-year-old young man who has worked in small-scale mining, in work clothes and boots, with a tired, honest face.',
      'Mr Oscar Awuah: a district official, in a shirt and tie, with a folder; and an elderly paramount chief, seen from a distance, in traditional cloth.',
    ],
    music: 'Soft forest sounds with a thoughtful guitar; a clear, steady tune at the conclusion (placeholder)',
    pages: [
      pg('🏞️', 'The Atewa range, in the Eastern Region of Ghana, is a green ridge of forest. According to conservation groups, it holds the headwaters of three rivers, the Ayensu, the Densu and the Birim, which supply water to more than five million people. The same groups report about three thousand plant species and more than five hundred and seventy kinds of butterfly there. Nelson, a school-magazine reporter, wanted to know why people were arguing about it.', 'A forested ridge with three streams flowing from it and a map beside it.'),
      pg('🌊', 'His first interview was with Madam Sakyi, a conservationist. “The forest acts like a sponge,” she said. “It soaks up rain and releases it slowly into streams. If the forest is stripped or polluted, the rivers may suffer, and millions of people depend on them. Mining, especially illegal mining, has already spread into parts of the reserve, according to our group’s recent statement. We want it made a national park.”', 'A conservationist holds a map showing a forest with three rivers and mining pits marked.'),
      pg('⛏️', 'Nelson’s second interview was with Mr Awuah, a district official. “Bauxite is used to make aluminium,” he said. “The government has argued that mining Atewa’s bauxite could bring national revenue and jobs, and that new technology can limit damage. I must say that the plans have been debated for years, and there are serious objections. People should check the latest position. Meanwhile, reports say illegal miners have entered the reserve, and the national anti-illegal mining team has launched an operation, called Operation Green Shield, with arrests reported.” Nelson wrote down: official view, revenue and jobs, damage limited by technology, claim not agreed.', 'An official speaks beside a folder and a chart showing aluminium cans and money.'),
      pg('😔', 'Next he met Victor, who had worked in small-scale mining. “I am not a villain,” Victor said. “I left school, and there are no jobs. Gold pays quickly.” He looked at the ground. “But the river near us is brown, and my little brother got sick. If someone gave us a safe job, I would take it.” Nelson was quiet. “Thank you for being honest,” he said.', 'A young man in work boots sits beside a brown stream speaking to a boy with a notebook.'),
      pg('🧓', 'Last, Nelson visited a village elder, who told him that the paramount chief of the area had said that he is committed to protecting the forest. “The forest is not only trees,” the elder said. “It is where our streams begin, our herbs grow and our ancestors rest.” Nelson wrote: chief’s position, protect the forest, as reported. He knew he must not put words in anybody’s mouth.', 'An elder sits under a tree speaking to a boy with a recorder and notebook.'),
      pg('🔢', 'Back at school, Nelson collected the claims on a board. Conservationists: a national park with eco-tourism and agroforestry could bring more than five million United States dollars a year and at least three thousand jobs. “That is their estimate,” he wrote. Government: mining could give revenue and jobs. “That is their claim.” Victor: no jobs and a dirty river. Elder: the forest is heritage and source. “Four voices,” said Nelson, “and none of them is a fool.”', 'A boy writes four columns of claims on a classroom board with the speakers’ roles at the top.'),
      pg('🌅', 'Mrs Ahiable, the English teacher, nodded. “A good writer does not pretend that a debate is simple,” she said. “Present the arguments for and against, give the facts you can check, admit what you do not know, and then give a reasoned conclusion.” Nelson sat and thought. “If the rivers are the source of water for millions,” he wrote, “then perhaps the forest is worth more standing than mined. But I will say that I am not an expert.”', 'A teacher guides a boy as he plans an essay with two columns, for and against.'),
      pg('📝', 'Nelson wrote: “The question of mining in a forest reserve has two sides. On the one hand, supporters argue that bauxite could bring revenue and jobs to a country that needs both. On the other hand, conservationists argue that the forest protects the headwaters of three rivers and shelters rare species. Both sides want a better Ghana. However, damage to a water source is hard to reverse. In conclusion, I believe that the forest should be protected while safe jobs are found for young people such as Victor.”', 'A boy writes a discursive essay at a desk with a map of the forest and rivers beside him.'),
      pg('✅', 'Exam-safe tip: a discursive essay looks at both sides before giving a conclusion. Use “on the one hand”, “on the other hand”, “however” and “in conclusion”, write in the present tense for opinions, and avoid contractions and slang. Nelson named each claim’s owner, such as “supporters” and “conservationists”, instead of presenting claims as facts. In your time, you may be one of the people who decides. Learn the facts first. The end.', 'A boy and his teacher circle the contrast words in a discursive essay.'),
    ],
    activities: [
      { id: 'ate-c1', type: 'comprehension', afterPage: 3, question: 'Why does Madam Sakyi call the forest a sponge?', options: ['It soaks up rain and releases it slowly into streams', 'It is soft', 'It cleans clothes'], correctIndex: 0 },
      { id: 'ate-p1', type: 'prediction', afterPage: 5, prompt: 'Victor says a safe job would make him leave mining. What might help?', options: ['Safe alternative jobs for young people', 'More illegal mining', 'Closing every school'] },
      { id: 'ate-c2', type: 'comprehension', afterPage: 9, question: 'Which words show two sides in a discursive essay?', options: ['On the one hand, on the other hand', 'Lol, but also lol', 'Yes, yes, yes'], correctIndex: 0 },
      { id: 'ate-voc', type: 'vocabulary', afterPage: 4, word: 'headwaters', definition: 'The streams near the source of a river.', distractors: ['The mouth of a river', 'A kind of boat'] },
      { id: 'ate-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Nelson interviews a conservationist and an official.', 'He interviews a young miner and an elder.', 'He lists each claim with its owner.', 'He writes a balanced essay.'] },
      { id: 'ate-sel', type: 'sel', afterPage: 9, prompt: 'Hard decisions have more than one side. How do you feel when people honestly disagree?', feelingOptions: ['Thoughtful', 'Uncertain', 'Respectful', 'Determined'] },
    ],
    glossary: [
      { word: 'headwaters', definition: 'The streams near the source of a river.', pages: [1] },
      { word: 'reserve', definition: 'An area of land protected by law.', pages: [2] },
      { word: 'bauxite', definition: 'A rock from which aluminium is made.', pages: [3] },
      { word: 'revenue', definition: 'Money that a government or business receives.', pages: [3] },
      { word: 'discursive', definition: 'Looking at several sides of a question.', pages: [9] },
    ],
    culturalNotes: ['Nelson, Madam Sakyi, Victor, Mr Awuah and Mrs Ahiable are invented. The Atewa Range Forest Reserve is real and the debate is real, so the story attributes each claim by role and does not name any politician or company. No claim in the story should be taught as settled fact.', 'Facts from published sources: conservation groups say Atewa holds the headwaters of the Ayensu, Densu and Birim rivers, which supply more than five million people; Global Wildlife Conservation reports about 3,000 plant species and over 570 butterfly species; in September 2026 environmental groups said illegal mining had spread into the reserve and called for a national park; they estimate eco-tourism and agroforestry could bring over US$5 million a year and at least 3,000 jobs; the paramount chief of the area has been reported to oppose bauxite mining; the government has argued that bauxite mining could bring revenue and that new technology could limit damage.', 'Formal commercial bauxite mining remains contested and, as far as the writer knows, the reserve has not been upgraded to a national park, while illegal mining is reported as an active threat; in September 2026 the Forestry Commission and the national anti-illegal mining team (NAIMOS, Operation Green Shield) were reported to have made arrests; the operation was announced on 22 October 2026 and some reports say three suspects were arrested at its launch. On 2 November 2026 Adom reported an armed clash during the operation in the reserve (one suspected miner killed, four arrested); this is deliberately kept out of the story. These details may have changed; teachers should check recent news before use.'],
    reviewQuestions: ['Check the current status of the Atewa bauxite plans and of illegal mining in the reserve with up-to-date news and official statements, and correct the story if it has changed.', 'Check every attributed claim, especially the five-million-people figure, the species counts and the tourism and jobs estimates, against the original reports.', 'Check that the story is balanced and that Victor is presented with dignity and not as a villain; ask a local youth-programme worker to review.'],
    guide: {
      overview: 'A story about a real, contested question: should a water-source forest be mined or protected? It teaches how to separate claims from facts, listen to every side and write a discursive essay.',
      lessonMinutes: 50,
      goals: ['Explain why a forest at a river’s headwaters matters.', 'List the claims of each side and say who made them.', 'Write a discursive essay with a reasoned conclusion.'],
      subjects: [['Social Studies', 'Resources, citizenship and decision-making'], ['Integrated Science', 'Forests, water and ecosystems'], ['English Language', 'Discursive essays']],
      before: ['Ask: what would make you change your mind on a hard question?'],
      during: ['At page 6, ask learners to sort the claims into “estimates”, “claims” and “facts that can be checked”.'],
      after: ['Write a discursive essay on a local land-use question, naming the owner of each claim.', 'Hold a role-play town meeting with the four voices, respectfully.'],
      discussion: ['Who should decide on mining in a forest reserve, and how?', 'How can young people like Victor find safe, fair work?'],
      reflection: ['What would you want to learn before deciding on a question like this when you are a leader?'],
      support: ['Provide an essay frame: On the one hand… On the other hand… However… In conclusion…'],
      stretch: ['Write a formal letter to a district official asking for the latest information on a forest near you, with two reasons.'],
      localise: ['Use a real local forest or water source; check the latest news; invite community members to speak.'],
      factCheck: [
        { claim: 'Conservation groups say Atewa holds the headwaters of three rivers (the Ayensu, Densu and Birim) that supply more than five million people; reports cite about 3,000 plant species and over 570 butterfly species; the paramount chief has been reported to oppose bauxite mining; the government has argued that bauxite mining could bring revenue and that new technology could limit damage.', explanation: 'These are attributed claims from advocacy groups, news reports and an environmental news site; the figures are not independently verified here and the status of the plans may have changed.', reference: 'GhanaWeb (14 September 2026) report on a joint statement by environmental groups; MyJoyOnline (2019) on conservation groups’ campaign; Afrik21 on Atewa and bauxite. Verify against current sources.' },
      ],
    },
  }),
];

