/**
 * Batch 14: five more mystery stories: Atlantis (Plato's island swallowed by the sea), the Beale ciphers (a coded
 * treasure people have chased for generations), two Ghana heritage mysteries (Begho, the vanished trading town, and
 * the Kintampo clay animals) and a light detective story for young readers (the missing kenkey).
 *
 * Rules: same as Batch 13 (know / debated / unknown; legends respected; no "aliens", no "magic" explanations);
 * Atlantis is presented as Plato's story whose truth is debated, not as a known place; the Beale story says plainly that
 * skeptics think it is a hoax and tells children never to dig or trespass; Ghana stories name what is oral tradition and
 * what is excavation. All stories are drafts awaiting review.
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

export const BATCH_14_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-island-that-sank-in-a-night',
    title: 'The Island That Sank in a Night',
    summary: 'Seyram and Yaro read about Atlantis, the great island that the Greek thinker Plato said was swallowed by the sea in a day and a night. They ask what Plato really wrote, whether it could be true, and why no one has found it.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 11,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['mystery', 'historical', 'informational'],
    themes: ['community', 'school', 'leadership'],
    objectives: ['critical-thinking', 'reasoning', 'scientific-curiosity', 'vocabulary'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Dreamy and curious, with a firm tone for the evidence',
    palette: ['#0c4a6e', '#d4a017'],
    voice: 'Dreamy storyteller voice for the legend; Mr Ayitey is calm and exact for the facts',
    characters: [
      'Seyram: a 13-year-old girl in a school uniform, with braids, holding a library book.',
      'Yaro: her classmate, 13, in a white shirt, drawing maps.',
      'Mr Ayitey: their history teacher, in a brown jacket, with a globe.',
      'Plato: an ancient Greek thinker in a white robe, writing on a scroll (story picture).',
      'Atlantis: a shining island city with round harbours, golden walls and a big temple, sinking into dark waves.',
    ],
    music: 'Gentle waves and a dreamy harp, darkening at the sinking, then clear and thoughtful (placeholder)',
    pages: [
      pg('📚', 'In the school library, Seyram found a book with a glowing island on its cover. “Atlantis,” she read. “A great island city that sank beneath the sea.” Her classmate Yaro laughed. “Is it real?” “Let us ask Mr Ayitey,” she said.', 'Two students hold a book with an island on its cover in a school library.'),
      pg('🏛️', 'Mr Ayitey placed a globe on the desk. “The first writer to tell us about Atlantis was a Greek thinker named Plato, more than 2,300 years ago. He wrote about it in two books, Timaeus and Critias. We know of it from Plato, so the first question is: what did he actually say?”', 'A teacher stands by a globe with an old Greek scroll drawing beside it.'),
      pg('🌊', '“Plato said the island lay beyond the Pillars of Hercules, which means the Strait of Gibraltar,” said Mr Ayitey. “He wrote that it was huge, larger than Libya and Asia put together. Its rulers grew powerful and tried to conquer lands around the Mediterranean, but Athens stopped them.”', 'A map shows the Strait of Gibraltar with a large island drawn beyond it.'),
      pg('🌑', '“Then,” said Mr Ayitey, “Plato wrote that earthquakes and floods came. In a single unbearable day and night, the island sank beneath the sea.” Yaro’s eyes went wide. “A whole city, gone in a night?” “That is what Plato wrote,” said Mr Ayitey. “Notice the words: what Plato wrote.”', 'A shining island city sinks into dark waves as lightning flashes.'),
      pg('❓', '“So why is it a mystery?” asked Seyram. “Because nobody has found it,” said Mr Ayitey. “There is no archaeological evidence of Atlantis. And scholars disagree about what Plato meant. Some think he invented the story as a lesson about greed and power. Others think it may echo a real disaster.”', 'A teacher lists two ideas on the board: invented story, memory of real event.'),
      pg('🌋', '“Which real disaster?” asked Yaro. “One idea is the great volcanic eruption on the island of Thera, today called Santorini, around 3,500 years ago. It devastated cultures in the Aegean Sea. But Thera does not match Plato’s island in size or place, so many experts remain unconvinced.” Yaro wrote: not a perfect match.', 'A volcano erupting over a small Mediterranean island, with a question mark.'),
      pg('🔍', '“What would count as proof?” asked Seyram. “Ruins, with datable remains, in the right place, matching Plato’s description,” said Mr Ayitey. “Lots of people have claimed to find Atlantis in many places. So far none of those claims has convinced the experts.” Yaro smiled. “So the evidence is… still missing.”', 'Students examine maps with many different Xs marked for Atlantis and all crossed out.'),
      pg('✅', 'At the end, Seyram wrote: Atlantis is Plato’s story. We do not know if it was real, invented or a memory of a disaster. “And that,” said Mr Ayitey, “is an honest answer. Real cities have vanished beneath the sea or into the sand, but Atlantis, as Plato described it, has never been found.” The end.', 'A girl writes a sentence in her notebook while the teacher smiles by the globe.'),
    ],
    activities: [
      { id: 'atl-c1', type: 'comprehension', afterPage: 2, question: 'Who first wrote about Atlantis?', options: ['The Greek thinker Plato', 'A modern diver', 'An Egyptian priest'], correctIndex: 0 },
      { id: 'atl-p1', type: 'prediction', afterPage: 5, prompt: 'Some experts think the story was invented as a lesson. What could Plato have wanted to teach?', options: ['That greed and power can lead to ruin', 'How to build boats', 'How to grow millet'] },
      { id: 'atl-c2', type: 'comprehension', afterPage: 6, question: 'Why do many experts doubt that Thera (Santorini) was Atlantis?', options: ['It does not match the island’s size and place', 'It is not a volcano', 'Nobody lived near it'], correctIndex: 0 },
      { id: 'atl-voc', type: 'vocabulary', afterPage: 5, word: 'archaeological', definition: 'About evidence from the past, such as ruins and old objects, found by digging.', distractors: ['About weather', 'About ships'] },
      { id: 'atl-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Plato wrote about Atlantis.', 'Atlantis grew powerful and attacked other lands.', 'Earthquakes and floods struck.', 'The island sank in a day and night.'] },
      { id: 'atl-sel', type: 'sel', afterPage: 8, prompt: 'Saying “we do not know” can feel hard. How do you feel when you cannot find a clear answer?', feelingOptions: ['Curious', 'Impatient', 'Honest', 'Calm'] },
    ],
    glossary: [
      { word: 'Atlantis', definition: 'A legendary island that Plato said sank beneath the sea.', pages: [1] },
      { word: 'strait', definition: 'A narrow strip of water linking two larger seas.', pages: [3] },
      { word: 'archaeological', definition: 'Having to do with evidence from the past found by digging.', pages: [5] },
      { word: 'eruption', definition: 'When a volcano throws out hot rock, ash and gas.', pages: [6] },
    ],
    culturalNotes: ['Atlantis is a Greek story, not a Ghanaian one. The pupils and teacher are invented. Ghanaian pupils can compare it with stories in their own communities about places that vanished, such as drowned towns or lost cities.', 'The story uses Atlantis to show how historians separate what a source says from what evidence supports.'],
    reviewQuestions: ['Check the description of Plato’s text against a named source: Timaeus and Critias (4th century BCE); beyond the Pillars of Hercules; “larger than Libya and Asia together”; sank in “a day and a night”.', 'Check the Thera/Santorini dating (the source says about 1650–1550 BCE, so “about 3,500 years ago” is a rounded figure).', 'The wording “more than 2,300 years ago” is rounded from Plato’s dates (c. 429–347 BCE).'],
    guide: {
      overview: 'A mystery about a story: what the source says, what evidence exists, and why scholars disagree. It teaches the habit of separating “what is written” from “what is proven”.',
      lessonMinutes: 45,
      goals: ['Explain that Atlantis comes from a single writer, Plato.', 'Compare two explanations (invention and real event).', 'State what evidence would convince experts.'],
      subjects: [['Social Studies / History', 'Sources and evidence'], ['Geography', 'The Mediterranean and the Strait of Gibraltar'], ['English Language', 'Fact, legend and argument']],
      before: ['Ask: do you know stories of places that vanished? Where did they come from?'],
      during: ['At page 4, ask learners to underline “Plato wrote”.'],
      after: ['Mark the Strait of Gibraltar and Santorini on a map.', 'Write two columns: What the source says / What the evidence shows.'],
      discussion: ['Why can a story be useful even if it did not happen?', 'What would make you believe a claim that Atlantis has been found?'],
      reflection: ['Which part of history do you wish we had better evidence for?'],
      maths: [{ task: 'Plato lived around 429 to 347 BCE. About how many years did he live?', answer: '429 − 347 = 82 years.' }, { task: 'From 347 BCE to 2026 CE, about how many years is that? (There is no year 0.)', answer: 'About 2,372 years (347 + 2026 − 1 = 2,372 if counting precisely).' }],
      support: ['Provide a two-column chart: Plato said / Evidence shows.'],
      stretch: ['Research one real sunken settlement and compare the evidence with Atlantis.'],
      localise: ['Invite elders to share local stories of drowned or vanished places and discuss what evidence could test them.', 'Treat every community’s stories with respect.'],
      discoveryStatus: {
        whatWeKnow: ['The earliest known account of Atlantis is by Plato in Timaeus and Critias.', 'There is no archaeological evidence for Atlantis as Plato described it.', 'The eruption at Thera (Santorini) was real but does not match Plato’s description.'],
        whatWeAreStillDiscovering: ['Whether Plato invented the story or based it on older memories.'],
      },
      factCheck: [{ claim: 'Plato described Atlantis in Timaeus and Critias: an island beyond the Pillars of Hercules, larger than Libya and Asia, defeated by Athens, then sunk by earthquakes and floods in an unbearable day and a night; no archaeological evidence exists; scholars see it as invention or a memory of a real event such as the Thera eruption (c. 1650–1550 BCE), which does not match in size or place.', explanation: 'From the World History Encyclopedia article “Atlantis”.', reference: 'World History Encyclopedia, “Atlantis” (worldhistory.org).' }],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-code-in-the-iron-box',
    title: 'The Code in the Iron Box',
    summary: 'Dziedzom and Nathaniel study the Beale ciphers, three sheets of numbers that are said to lead to buried treasure in Virginia. One sheet was decoded with a book as a key; two never have been. They learn how book ciphers work and ask whether the treasure is real.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['mystery', 'historical', 'educational'],
    themes: ['technology', 'money-and-enterprise', 'school'],
    objectives: ['critical-thinking', 'problem-solving', 'reasoning', 'perseverance'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 130,
    paceWord: 'Brisk and intriguing, with a clear explanation of the code',
    palette: ['#1f2937', '#ca8a04'],
    voice: 'Brisk, intrigued storyteller voice; Miss Tackie is crisp and encouraging',
    characters: [
      'Dziedzom: a 14-year-old girl with short natural hair, in a school uniform, with a pencil behind her ear.',
      'Nathaniel: her classmate, 14, in a white shirt, with a notebook of numbers.',
      'Miss Tackie: their ICT and mathematics teacher, in a patterned blouse, with a projector remote.',
      'The Beale papers: three yellowed sheets covered in rows of numbers.',
      'An iron box: a locked old iron box in a Virginia inn, in a story picture.',
    ],
    music: 'Tense pizzicato strings with a steady tick, brightening when a code is cracked (placeholder)',
    pages: [
      pg('🔢', 'Miss Tackie wrote a row of numbers on the board: 12, 5, 31, 8, 22. “What does this say?” “Nothing,” said Nathaniel. “It is only numbers.” “Exactly,” said Miss Tackie. “Today’s mystery is a set of numbers that some people have spent their lives trying to read.”', 'A teacher writes a row of numbers on a whiteboard in front of a class.'),
      pg('📦', '“The story goes like this,” said Miss Tackie. “A man named Thomas Beale buried gold, silver and jewels in Virginia, in the United States, around 1820. In 1822, he left a locked iron box with an innkeeper, Robert Morriss. Years later, the box was opened. Inside were three papers covered in numbers.”', 'An innkeeper opens an old iron box and finds three sheets of paper.'),
      pg('📜', '“A pamphlet published in 1885 by James B. Ward told the story,” she went on. “Paper One said where the treasure was buried. Paper Two described what it contained. Paper Three listed the owners and their families. All three were written in code.” Dziedzom counted on her fingers. “Three papers, three secrets.”', 'Three pages labelled One, Two and Three lie side by side.'),
      pg('🔑', '“Only Paper Two has ever been decoded,” said Miss Tackie. “It was a book cipher. Each number points to a word in a secret text, and you take the first letter of that word.” She wrote a short key on the board: Cats often seem tired. “What does 1 2 3 4 spell?” Nathaniel counted: Cats, often, seem, tired. “C, O, S, T,” he said. “Cost!”', 'A student points to the key sentence and decodes four numbers into the word COST.'),
      pg('📖', '“For Paper Two, the key was the United States Declaration of Independence,” said Miss Tackie. “Number 115 meant the 115th word, and so on. It described a huge treasure: gold, silver and jewels. People say it weighed about three tons.” “Then the other two papers must use other keys,” said Dziedzom. “That is what many have tried,” said Miss Tackie. “Nobody has succeeded.”', 'A decoded page lists gold, silver and jewels next to a copy of an old document.'),
      pg('🤔', '“So is the treasure real?” asked Nathaniel. “That is the second mystery,” said Miss Tackie. “Many experts doubt it. They point out problems: some words in the decoded paper were not used yet in the 1820s, we can find no clear records of Thomas Beale, and style analysis suggests the pamphlet’s author may have written it all.” Dziedzom frowned. “So it might be a hoax.” “It might,” she said. “But nobody can prove that, either.”', 'A board lists doubts: words too modern, no records, one writer.'),
      pg('⚠️', '“People have dug for the treasure, even in the twentieth century,” said Miss Tackie. “A dig in the late 1980s found only Civil War objects. Please remember: never dig on land that is not yours, and never trespass for a treasure hunt. Real discoveries are made with permission, by teams.” Nathaniel nodded. “Solving it on paper is safer.”', 'A warning sign reads: Private land. A student marks a map with a question mark.'),
      pg('✅', 'At the end, Dziedzom wrote: Solved: Paper Two’s code. Unsolved: Papers One and Three. Open: is the treasure real? “And look,” said Miss Tackie, “what you have just learned: a code needs a key, and the key can be a book. Secret messages are a puzzle, but the best puzzles teach us how to think.” The end.', 'Students make their own book-cipher messages on paper.'),
    ],
    activities: [
      { id: 'beale-c1', type: 'comprehension', afterPage: 3, question: 'How many Beale papers have been decoded?', options: ['One (Paper Two)', 'All three', 'None'], correctIndex: 0 },
      { id: 'beale-p1', type: 'prediction', afterPage: 5, prompt: 'Paper Two used a famous document as a key. What might the other two papers need?', options: ['Different keys that nobody has found', 'No key at all', 'A computer from the 1820s'] },
      { id: 'beale-c2', type: 'comprehension', afterPage: 6, question: 'Why do many experts doubt the treasure story?', options: ['Some words were too modern, and there are no clear records of Beale', 'The treasure was found already', 'The pamphlet was lost'], correctIndex: 0 },
      { id: 'beale-voc', type: 'vocabulary', afterPage: 5, word: 'cipher', definition: 'A secret code that changes letters or words into other symbols or numbers.', distractors: ['A kind of treasure box', 'A type of key to a door'] },
      { id: 'beale-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Beale buried treasure in Virginia.', 'An iron box with three papers was left with an innkeeper.', 'A pamphlet about the papers was published in 1885.', 'Paper Two was decoded using a famous document.'] },
      { id: 'beale-sel', type: 'sel', afterPage: 8, prompt: 'Some people have spent years trying to crack the code. When is persistence a good thing, and when should we stop?', feelingOptions: ['Determined', 'Curious', 'Realistic', 'Patient'] },
    ],
    glossary: [
      { word: 'cipher', definition: 'A secret code that turns words or letters into other symbols or numbers.', pages: [4] },
      { word: 'pamphlet', definition: 'A short, thin booklet.', pages: [3] },
      { word: 'hoax', definition: 'A trick that makes people believe something false.', pages: [6] },
      { word: 'decoded', definition: 'Turned a secret code back into ordinary words.', pages: [4] },
    ],
    culturalNotes: ['The Beale ciphers come from Virginia in the United States. The pupils and teacher are invented. Pupils in Ghana can connect the story to their own traditions of messages, such as drum language and the meanings of Adinkra symbols, which carry meaning for people who know the key.', 'The story is cautious: it does not say the treasure exists, and it says many experts think the tale may be a hoax.'],
    reviewQuestions: ['Check against a named source: 1885 pamphlet by James B. Ward; Beale c. 1820; box with Morriss in 1822; three papers; Paper Two solved with the Declaration of Independence; claimed weight about three tons; 1980s dig found only Civil War artifacts; skeptics’ arguments (anachronistic words, no clear records, authorship analysis).', 'The number row on the board (12, 5, 31, 8, 22) is invented and is not part of the real ciphers.', 'Is the “never dig or trespass” message strong enough?'],
    guide: {
      overview: 'A code-and-evidence mystery. Learners decode a tiny book cipher themselves and see why unbroken codes and unverified legends are different kinds of “unsolved”.',
      lessonMinutes: 50,
      goals: ['Explain how a book cipher works.', 'Decode a short message with a given key.', 'Weigh evidence for and against a treasure legend.'],
      subjects: [['Mathematics', 'Patterns and logic'], ['ICT', 'Codes and encryption'], ['Social Studies / History', 'Sources and evidence']],
      before: ['Ask: what is a code, and why do people use them?'],
      during: ['At page 4, let learners decode 1 2 3 4 using the key sentence.'],
      after: ['Make your own book cipher with a short key sentence and swap messages with a partner.', 'Discuss: when is a code secure?'],
      discussion: ['Why does a code need a key?', 'Why is it hard to prove a treasure never existed?'],
      reflection: ['What message would you like to send in code, and to whom?'],
      maths: [
        { task: 'Using the key “Cats often seem tired”, decode 1 2 3 4.', answer: 'C, O, S, T: the word COST.' },
        { task: 'Using the same key, which number gives the letter O?', answer: '2, because “often” is the second word and starts with O.' },
        { task: 'A key of 1,300 words is used. If each number in a cipher stands for one word, what is the largest number you could use?', answer: '1,300.' },
      ],
      support: ['Provide a numbered key sentence and a blank decoding grid.'],
      stretch: ['Design a better key and explain why a longer, less obvious text makes a code harder to break.'],
      localise: ['Link to local ways of sending secret or symbolic messages, such as talking drums and Adinkra symbols.', 'Never trespass or dig for treasure; discuss legal and safe ways to explore history.'],
      discoveryStatus: {
        whatWeKnow: ['The story comes from an 1885 pamphlet.', 'Paper Two was decoded with the Declaration of Independence as a key.', 'The treasure has never been found.'],
        whatWeAreStillDiscovering: ['Whether Papers One and Three can be read at all, or were never real codes.', 'Whether the whole story is true or a hoax.'],
      },
      factCheck: [{ claim: 'The Beale Papers pamphlet was published in 1885 by James B. Ward; Beale reportedly buried treasure in Bedford County, Virginia around 1820; three ciphertexts, with only Paper Two solved, using the Declaration of Independence as a book-cipher key; skeptics cite anachronistic words, lack of records and stylometric analysis; the treasure has never been found and a late-1980s dig found only Civil War artifacts.', explanation: 'From Wikipedia’s “Beale ciphers” article, which is a summary, not a primary source.', reference: 'Wikipedia, “Beale ciphers” (no scholarly source was opened in this session; the article names analyses such as Joe Nickell’s stylometric study, which should be checked directly if a scholarly reference is wanted).' }],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-town-that-vanished-from-the-map',
    title: 'The Town That Vanished from the Map',
    summary: 'Ayisha and Kwabla visit the quiet fields near Hani in the Bono region, where long ago the busy trading town of Begho stood. They learn what archaeologists dug up, what elders say happened, and why historians still cannot agree on how it ended.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 11,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['mystery', 'historical', 'cultural'],
    themes: ['community', 'money-and-enterprise', 'identity'],
    objectives: ['cultural-heritage', 'critical-thinking', 'reasoning', 'respect'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'village-life'],
    wpm: 125,
    paceWord: 'Steady and curious, with weight on the two accounts',
    palette: ['#7c2d12', '#15803d'],
    voice: 'Warm, curious storyteller voice; Nana Afriyie is deep, patient and proud',
    characters: [
      'Ayisha: a 12-year-old girl in a school uniform, with braids, carrying a small notebook.',
      'Kwabla: her cousin, 13, in a blue shirt, carrying a water bottle and a camera.',
      'Nana Afriyie: an elder from the area, about 70, in a cloth draped over one shoulder, with a walking stick.',
      'Dr Mensima: a university archaeologist, in a hat and field vest, holding a trowel.',
      'Begho: a busy trading town with many mud-brick houses, traders with gold and kola, weavers and brass workers (story picture); today, quiet grassy mounds.',
    ],
    music: 'Warm bush sounds and a slow drum, with a bright market rhythm for the old town (placeholder)',
    pages: [
      pg('🌾', 'Ayisha and her cousin Kwabla walked along a path near Hani, in the Bono region of Ghana. All around were farms, trees and low grassy mounds. “Nothing here,” said Kwabla. Nana Afriyie, an elder, smiled. “Under your feet,” he said, “stood a busy town called Begho.”', 'Two children and an elder stand on grassy mounds in a quiet farming landscape.'),
      pg('🛍️', '“Begho was a trading town,” said Nana Afriyie. “Gold, kola nuts, cloth and brass passed through it. Akan-speaking Bono people lived here, and merchants who came from the north.” “How old is it?” asked Ayisha. “People say it is very old,” said Nana Afriyie. “Sources do not fully agree on when it began. Some give around the eleventh century, but we will see that the evidence is not simple.”', 'A bustling market of traders with kola nuts, gold and cloth, drawn as a story picture.'),
      pg('⛏️', 'Dr Mensima, an archaeologist, was sorting broken pottery at a table. “In the twentieth century, teams from the University of Ghana dug here, and later worked with colleagues from the United States,” she said. “We found at least five quarters, or neighbourhoods, and between a thousand and fifteen hundred house mounds. We estimate that at its busiest, maybe seven to ten thousand people lived in Begho. Those are estimates, not exact counts.”', 'An archaeologist shows pottery pieces and a site plan to the children.'),
      pg('🧱', '“How can you tell?” asked Kwabla. “From clues,” said Dr Mensima. “Pottery scattered over a huge area, house floors, tools, brass, and charcoal we can date with radiocarbon tests. Some of those dates are earlier than the date people usually give for the start of the town. So when Begho began is still a question.” Ayisha wrote: clues = pottery, floors, tools, charcoal. Start date: not settled.', 'Close view of pottery, tools and charcoal laid out and labelled.'),
      pg('📜', '“So what happened to Begho?” asked Ayisha. Nana Afriyie spoke slowly. “Our oral history says the Asante army destroyed the town and its people scattered. The tellings place this around the middle of the 1700s. People in towns like Bondoukou and Kong trace their families to refugees from Begho.”', 'An elder speaks while children listen, with a faint picture of people leaving a town.'),
      pg('❓', '“But the digging tells a more complicated story,” said Dr Mensima. “Some evidence suggests people lived here, in smaller numbers, into the early 1800s. So two accounts give two different times for the end. Perhaps the town was attacked and then slowly emptied. Perhaps the dates are not exact. We do not know yet, and we have excavated only certain parts, so we do not have the full picture.”', 'A chart compares two timelines: destroyed in the 1700s, and slowly shrinking into the 1800s.'),
      pg('🤝', '“Is one of you wrong?” asked Kwabla. “Not necessarily,” said Dr Mensima. “Oral history and archaeology are different kinds of evidence. Elders remember how the story was carried through families. Archaeologists read what the ground kept. Where they agree, we trust the story more. Where they differ, we ask more questions.”', 'An elder and an archaeologist stand side by side, looking at the same mound.'),
      pg('✅', 'Before leaving, the children wrote on a card: Begho was real and large. It was a trading town of gold and kola. How it ended: not settled. “Please,” said Nana Afriyie, “do not take pottery or dig here. The ground is a book, and a book torn apart cannot be read.” Ayisha nodded. “We will learn from it, and leave it.” The end.', 'Two children and an elder on the mounds as the sun sets, holding a card with notes.'),
    ],
    activities: [
      { id: 'bego-c1', type: 'comprehension', afterPage: 3, question: 'What was Begho known for?', options: ['Trade in gold, kola, cloth and brass', 'Growing only rice', 'Building ships'], correctIndex: 0 },
      { id: 'bego-p1', type: 'prediction', afterPage: 5, prompt: 'The elders say Begho was destroyed in the mid-1700s. The digs suggest people stayed longer. What might explain both?', options: ['The town may have been attacked and then slowly emptied', 'Nobody ever lived there', 'The digs were wrong'] },
      { id: 'bego-c2', type: 'comprehension', afterPage: 7, question: 'Why did Dr Mensima say oral history and archaeology are different kinds of evidence?', options: ['One comes from remembered stories and the other from what the ground kept', 'One is true and the other is false', 'Neither is useful'], correctIndex: 0 },
      { id: 'bego-voc', type: 'vocabulary', afterPage: 4, word: 'archaeologist', definition: 'A scientist who studies the past by digging up and examining old objects and buildings.', distractors: ['A kind of trader', 'A person who builds houses'] },
      { id: 'bego-s1', type: 'sequencing', prompt: 'Put the story of Begho in order.', items: ['Begho grew as a trading town.', 'Archaeologists dug at the site in the twentieth century.', 'Oral history says the town was destroyed and people scattered.', 'Historians still debate exactly how it ended.'] },
      { id: 'bego-sel', type: 'sel', afterPage: 8, prompt: 'Nana Afriyie said the ground is like a book. How do you feel about protecting places where history is buried?', feelingOptions: ['Respectful', 'Curious', 'Protective', 'Proud'] },
    ],
    glossary: [
      { word: 'archaeologist', definition: 'A scientist who studies the past by digging up old objects and buildings.', pages: [3] },
      { word: 'mounds', definition: 'Low heaps of earth, often covering the remains of old buildings.', pages: [1] },
      { word: 'radiocarbon', definition: 'A test that uses carbon to estimate the age of old charcoal, wood or bone.', pages: [4] },
      { word: 'excavated', definition: 'Dug up carefully to study what lies buried.', pages: [6] },
    ],
    culturalNotes: ['Begho is a real archaeological site in the Bono region, near Hani. The children, Nana Afriyie and Dr Mensima are invented. Descendants of its people live in several communities, and their accounts deserve respect.', 'The story presents oral tradition as real evidence that historians weigh alongside archaeology, and it does not decide between them.'],
    reviewQuestions: ['Check the numbers (pottery scatter, five quarters, 1,000 to 1,500 house mounds, 7,000 to 10,000 people) against Posnansky’s publications; the story gives them as estimates and avoids exact dates because the sources disagree.', 'The beginning date (11th century or earlier) and the end (mid-1700s in oral tradition, early 1800s in some archaeological evidence) are shown as conflicting accounts on purpose; have a Ghanaian archaeologist confirm the wording.', 'Sources list people among the goods traded at Begho. The story does not mention this; the teacher’s guide asks teachers to decide how to raise it with older learners. Confirm the approach with the Bono community and heritage authorities.'],
    guide: {
      overview: 'A heritage mystery where two kinds of evidence, oral history and archaeology, give partly different answers. Learners practise weighing them rather than choosing a side.',
      lessonMinutes: 45,
      goals: ['Explain how archaeologists find clues about a vanished town.', 'Compare oral history with archaeological evidence.', 'Describe why heritage sites should not be dug up or looted.'],
      subjects: [['Social Studies / History', 'Trade and towns in pre-colonial Ghana'], ['Geography', 'Trade routes'], ['Mathematics', 'Estimates and timelines']],
      before: ['Ask: how can we learn about a town nobody lives in any more?'],
      during: ['At page 6, ask learners to draw the two timelines.'],
      after: ['Draw two timelines for the end of Begho (oral history and archaeology) and mark where they differ.', 'Interview an elder about the history of your own town, with permission.'],
      discussion: ['What does each kind of evidence do best?', 'Why should heritage sites be protected?', 'Teacher note: some sources list people among the goods traded through Begho. For older learners, you may discuss this carefully, linking to your syllabus and to local memory.'],
      reflection: ['What would you like a future archaeologist to know about your town?'],
      maths: [{ task: 'If between 7,000 and 10,000 people lived in Begho, what is the difference between the highest and lowest estimates?', answer: '3,000 people.' }, { task: 'Oral history places the destruction around 1750; some evidence suggests people stayed into the early 1800s (say 1810). About how many years apart are those two accounts?', answer: 'About 60 years. The gap shows why the accounts conflict and why more evidence is needed.' }],
      support: ['Provide a two-column chart: Oral history / Archaeology.'],
      stretch: ['Write a short paragraph arguing which evidence best explains the end of Begho, and what new evidence would help.'],
      localise: ['Use your local heritage sites and invite a museum or heritage officer.', 'Never dig at or remove objects from heritage sites; explain the laws that protect them.'],
      discoveryStatus: {
        whatWeKnow: ['Begho was a large trading town near Hani, with thousands of people.', 'It was excavated by archaeologists in the twentieth century.', 'People today trace their families to refugees from Begho.'],
        whatWeAreStillDiscovering: ['Exactly when the town began and when and how it ended, since the accounts do not agree.', 'The full layout of the town, since only parts have been excavated.'],
      },
      factCheck: [{ claim: 'Begho (near Hani, Bono) was a large trading town; sources give its start as around the 11th century or earlier; its pottery scatter was large; at least five quarters and 1,000 to 1,500 house mounds were found; peak population is estimated at 7,000 to 10,000; oral tradition says the Asante destroyed it, placed around the mid-18th century, while some archaeological evidence suggests a reduced town into the early 19th century.', explanation: 'From Wikipedia’s “Begho” article, which cites scholarly works; the page does not resolve the conflict between accounts. The story gives dates as conflicting claims, not facts.', reference: 'Wikipedia, “Begho” (reference list includes Merrick Posnansky, “Begho: Life and Times,” Journal of West African History 1(2): 95–118, 2015, and Ivor Wilks, “The Northern Factor in Ashanti History: Begho and the Mande,” Journal of African History 2(1): 25–34, 1961; these were not opened in this session and should be checked directly).' }],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-clay-dog-of-kintampo',
    title: 'The Clay Dog of Kintampo',
    summary: 'Delasi and Nyamekye hold a tiny clay animal made by people who lived near Kintampo more than three thousand years ago. Nobody knows exactly why they made it. They follow the clues in pottery, seeds and bones to imagine a world of the first farmers.',
    classIds: ['primary-5', 'primary-6', 'jhs-1'],
    ageMin: 10,
    ageMax: 13,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['mystery', 'historical', 'science'],
    themes: ['community', 'farm-and-garden', 'animals-and-habitats'],
    objectives: ['cultural-heritage', 'critical-thinking', 'reasoning', 'scientific-curiosity'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Wondering and careful, slow when holding the clay animal',
    palette: ['#92400e', '#65a30d'],
    voice: 'Wondering storyteller voice; Mr Gyamfi is gentle and curious',
    characters: [
      'Delasi: an 11-year-old girl in a school uniform, with braids, wearing white gloves for handling objects.',
      'Nyamekye: her classmate, 11, in a white shirt, with a notebook.',
      'Mr Gyamfi: a museum guide, in a green shirt and badge, holding a tray of small objects.',
      'The clay animal: a tiny, rough clay figure of a dog, only a few centimetres long.',
      'The Kintampo people: farmers and herders in a village of rectangular mud houses with goats, a fire, millet in a basket and pottery drying (story picture).',
    ],
    music: 'Soft clay-pot percussion and a gentle flute, curious and slow (placeholder)',
    pages: [
      pg('🏺', 'On a school trip to a museum, Delasi put on white gloves. Mr Gyamfi, the guide, placed a tiny object in her palm. It was a clay animal no longer than her thumb. “A dog,” said Nyamekye. “Maybe,” said Mr Gyamfi. “It was made by people who lived near Kintampo more than three thousand years ago.”', 'A girl in gloves holds a tiny clay animal while a guide watches.'),
      pg('🗺️', '“We call them the Kintampo people, or the Kintampo complex,” said Mr Gyamfi. “Their sites are mostly in the Bono East region of Ghana, around towns like Nkoranza and Techiman, and some are found in nearby countries.” “How old are they?” asked Nyamekye. “Ah,” said Mr Gyamfi, with a twinkle. “That is a puzzle of its own. Wait for page four.”', 'A map of Ghana with a cluster of dots near Nkoranza and Techiman.'),
      pg('🌾', '“How do we know what they ate?” asked Delasi. “From burnt seeds and bones,” said Mr Gyamfi. “Archaeologists found charred pearl millet, and signs of oil palm, yams and cowpea. They found bones of goats, sheep, cattle and dogs, and also wild animals such as antelope and guineafowl. Traces show rectangular houses made of wattle and daub.” Delasi wrote: farmers, herders and hunters.', 'A tray shows burnt seeds, bones and potsherds with labels.'),
      pg('📅', '“Now the date puzzle,” said Mr Gyamfi. “One source says the Kintampo complex lasted from about 2500 to 1400 BCE. A review by an archaeologist named D. J. Watson says the tradition appeared about 3,600 to 3,200 years ago. Those are not the same.” Nyamekye did the sum: 3,600 years ago is about 1600 BCE. “So they overlap, but they do not match,” he said.', 'A timeline with two overlapping bars that start and end at different points.'),
      pg('🐕', 'Mr Gyamfi turned back to the clay dog. “Clay animals like this one have been found at places such as Boyase Hill and Ntereso, shaped like dogs, lizards and cows. And here is the mystery: nobody knows exactly why they were made.” “A toy?” guessed Nyamekye. “A gift? A story?” said Delasi. “All possible,” said Mr Gyamfi, “but we cannot prove any of them.”', 'A row of tiny clay animals: a dog, a lizard and a cow.'),
      pg('❓', '“And where did the people come from?” asked Delasi. “That is another question,” said Mr Gyamfi. “Some archaeologists think the Kintampo people came from further north, from the Sahel or Sahara, and brought new ways of living. Others think local people changed their lifestyle. Both ideas are still debated. And remember the dates: nobody agrees yet, so scientists keep asking. Maybe different sites give different ages. Maybe scientists count the start and the end in different ways. Maybe the dating methods are corrected in different ways. Those are guesses, not answers.”', 'A map with arrows from the north and a question mark.'),
      pg('🤔', '“So what do we really know?” asked Nyamekye. Delasi made a list. Known: pottery, tools, seeds and bones show people farmed, herded and hunted here. Debated: where they came from. Unknown: the meaning of the clay animals. “Clues,” she said, “and then honest guesses.”', 'A girl writes a three-part list: Known, Debated, Unknown.'),
      pg('✅', 'Before leaving, Delasi held the clay dog one more time. “Someone shaped this with their fingers,” she said. “They did not know us, but they left a message.” Mr Gyamfi smiled. “That is why we protect these places,” he said, “and why we ask people never to take objects from ancient sites.” The end.', 'A girl in gloves gently returns the clay animal to the guide.'),
    ],
    activities: [
      { id: 'kint-c1', type: 'comprehension', afterPage: 3, question: 'What do charred seeds and bones tell archaeologists?', options: ['What people ate and kept', 'The names of the people', 'The colour of their clothes'], correctIndex: 0 },
      { id: 'kint-p1', type: 'prediction', afterPage: 5, prompt: 'Nobody knows why the clay animals were made. What clues could help archaeologists guess?', options: ['Where they were found and what was found with them', 'Their colour only', 'Nothing could help'] },
      { id: 'kint-c2', type: 'comprehension', afterPage: 6, question: 'Which question about the Kintampo people is still debated?', options: ['Where they came from', 'Whether they ate food', 'Whether they used pots'], correctIndex: 0 },
      { id: 'kint-voc', type: 'vocabulary', afterPage: 3, word: 'charred', definition: 'Burnt black, but not completely destroyed.', distractors: ['Polished smooth', 'Painted bright'] },
      { id: 'kint-s1', type: 'sequencing', prompt: 'Put the Kintampo investigation in order.', items: ['Archaeologists found pottery and tools.', 'They found burnt seeds and bones.', 'They worked out how people lived.', 'They still debate what the clay animals meant.'] },
      { id: 'kint-sel', type: 'sel', afterPage: 8, prompt: 'Someone made this clay animal long ago. How does it feel to touch something so old (with permission)?', feelingOptions: ['Amazed', 'Respectful', 'Curious', 'Quiet'] },
    ],
    glossary: [
      { word: 'archaeologists', definition: 'Scientists who study the past by digging up and examining old objects and buildings.', pages: [3, 6] },
      { word: 'charred', definition: 'Burnt black.', pages: [3] },
      { word: 'tradition', definition: 'A way of life and a set of objects shared by a group of people over a long time.', pages: [4] },
      { word: 'herders', definition: 'People who look after groups of animals such as cattle and goats.', pages: [3] },
    ],
    culturalNotes: ['The Kintampo complex is a real archaeological tradition in Ghana. The pupils and guide are invented. The clay animals found at Boyase Hill and Ntereso are real kinds of finds.', 'The story is clear that nobody knows why the animals were made, and does not give them a religious meaning.'],
    reviewQuestions: ['The story shows two conflicting date ranges on purpose (about 2500 to 1400 BCE, and about 3,600 to 3,200 years ago from Watson’s review). Ask a Ghanaian archaeologist whether the possible reasons given (different sites, different ways of counting start and end, different dating corrections) are fair, and whether they would add or change any.', 'Check the finds (pearl millet, oil palm, yams, cowpea, goats, sheep, cattle, dogs; clay animals at Boyase Hill and Ntereso whose meaning is poorly understood) against Watson (2010).', 'Confirm “white gloves” and “with permission” reflect real museum handling practice.'],
    guide: {
      overview: 'A mystery about meaning: archaeologists can tell what people ate and used, but not why they shaped small clay animals. The story separates known, debated and unknown.',
      lessonMinutes: 40,
      goals: ['Explain what charred seeds, bones and pottery can show.', 'Distinguish what is known from what is only guessed.', 'Explain why ancient sites and objects must be protected.'],
      subjects: [['Social Studies / History', 'Early farming in Ghana'], ['Integrated Science', 'Plants, animals and evidence'], ['Creative Arts', 'Clay modelling']],
      before: ['Ask: if someone found your pencil case in 3,000 years, what could they guess about you?'],
      during: ['At page 5, invite guesses for why the clay animals were made.'],
      after: ['Make a small clay animal and write a museum label saying what is known and not known.', 'Plan a class “museum” with clear rules for handling objects.'],
      discussion: ['Why can we know what people ate but not why they made a toy or figure?', 'Why should we leave ancient objects where they are?'],
      reflection: ['What would you want to leave for people in the future?'],
      maths: [{ task: 'One source says 2500 to 1400 BCE. How long is that span?', answer: '1,100 years.' }, { task: 'Watson says the tradition appeared about 3,600 to 3,200 years ago. How long is that span?', answer: '400 years. The two sources describe spans of very different lengths, which is part of the puzzle.' }, { task: 'About what year BCE was 3,600 years ago? (Use 2026 and ignore the missing year 0.)', answer: 'About 1,600 BCE (3,600 − 2,026 ≈ 1,574, so roughly 1600 BCE).' }],
      support: ['Provide a Known / Debated / Unknown chart with pictures.'],
      stretch: ['Compare the Kintampo evidence with the evidence from Begho and decide which gives a fuller picture.'],
      localise: ['Visit a local museum or invite a curator.', 'Never collect or dig up ancient objects; report finds to local heritage authorities.'],
      discoveryStatus: {
        whatWeKnow: ['People of the Kintampo complex lived in Ghana more than 3,000 years ago, farming, herding and hunting.', 'They made pottery, polished stone tools and small clay animals.'],
        whatWeAreStillDiscovering: ['When exactly the tradition began and ended, since sources give different ranges.', 'Where the people came from.', 'Why they made the clay animals and what the animals meant.'],
      },
      factCheck: [{ claim: 'The Kintampo tradition is found near Nkoranza and Techiman; evidence includes pearl millet, oil palm, yams, cowpea, goats, sheep, cattle and dogs; clay animal figures at Boyase Hill and Ntereso have unknown meaning; origins are debated; dates are given as about 2500 to 1400 BCE in one source and about 3,600 to 3,200 years ago (BP) by Watson.', explanation: 'Watson’s review (a scholarly article, verified by its abstract on the University of Ghana repository) gives c. 3600 to 3200 BP. The 2500 to 1400 BCE range comes from Wikipedia’s “Kintampo Complex” article, a summary. The story shows both and lets readers question the difference.', reference: 'D. J. Watson, “Within savanna and forest: A review of the Late Stone Age Kintampo Tradition, Ghana,” Azania: Archaeological Research in Africa 45(2): 141–174 (2010), doi:10.1080/0067270X.2010.491361; and Wikipedia, “Kintampo Complex”.' }],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-case-of-the-missing-kenkey',
    title: 'The Case of the Missing Kenkey',
    summary: 'Detective Sitsofe and her little brother Selase find that a ball of kenkey has vanished from the kitchen. They follow the clues, such as crumbs, footprints and a mysterious smell, and discover who really took it, and why.',
    classIds: ['primary-1', 'primary-2', 'primary-3'],
    ageMin: 6,
    ageMax: 9,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['mystery', 'humour', 'family'],
    themes: ['family', 'food', 'friendship'],
    objectives: ['reasoning', 'honesty', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['local-food', 'local-names'],
    wpm: 100,
    paceWord: 'Playful and quick, with a whisper for the clues',
    palette: ['#b45309', '#16a34a'],
    voice: 'Playful, whispering detective voice; Auntie Ekua is kind and laughing',
    characters: [
      'Sitsofe: a 9-year-old girl with short braids, in a yellow dress, wearing a toy detective hat and holding a magnifying glass.',
      'Selase: her little brother, 5, in red shorts, carrying a toy torch.',
      'Auntie Ekua: their aunt, in a bright wrapper, laughing, with a plate in her hands.',
      'Biscuit: a small brown puppy with floppy ears and a few crumbs on his nose.',
      'The kitchen: a bright kitchen with a table, a covered bowl, a stool and a back door.',
    ],
    music: 'Light, sneaky pizzicato with a cheerful drum, ending in a happy fanfare (placeholder)',
    pages: [
      pg('🔍', 'Detective Sitsofe put on her detective hat. Her little brother Selase held his torch. “Case number one,” said Sitsofe. “Someone has taken the kenkey from the kitchen!” “It was on the table,” said Selase. “And now it is gone!”', 'A girl in a detective hat and her little brother with a torch look at an empty table.'),
      pg('👣', '“First, we look for clues,” said Sitsofe. She looked at the floor. “Footprints!” They were small and round, with four toes. “They are not our feet,” said Selase. “Four toes on each print,” said Sitsofe. “Hmm. Who has four toes?”', 'A girl with a magnifying glass looks at small round footprints on the floor.'),
      pg('🍞', 'Next, Sitsofe found a crumb on the stool. Then another crumb on the floor. A trail of crumbs led towards the back door. “The thief walked this way,” she said. Selase tiptoed along the crumbs, shining his torch.', 'A trail of crumbs leads across the kitchen floor to the back door.'),
      pg('👃', 'At the back door, Sitsofe sniffed. “I can smell kenkey,” she said. “And something else… something furry.” Selase giggled. “Maybe it is a giant rat!” “Or a cat,” said Sitsofe. “We need to look more closely.”', 'A girl and boy sniff near the back door of a kitchen.'),
      pg('🐶', 'They opened the back door. Under the bush sat a small brown puppy with floppy ears. Biscuit had crumbs on his nose and a very full tummy. He wagged his tail. “Woof!” “Biscuit!” gasped Selase. “The thief!”', 'A puppy with crumbs on its nose sits under a bush.'),
      pg('🤔', '“But wait,” said Sitsofe. “A puppy cannot climb on a table. Biscuit is too small. Someone must have helped him.” Selase went quiet. He twisted his toes. “Selase?” said Sitsofe. “Did you put the kenkey on the floor for Biscuit?”', 'A small boy looks down at his feet while his sister watches.'),
      pg('😢', 'Selase nodded. “He looked so hungry,” he said in a small voice. “I am sorry. I should have asked first.” Sitsofe hugged him. “Thank you for telling the truth,” she said. “That is what a good detective does, even when the clue points at yourself.”', 'A girl hugs her little brother in the kitchen doorway.'),
      pg('😄', 'Just then, Auntie Ekua came in with a plate. “I heard everything,” she laughed. “Next time, ask first. And Biscuit has his own dinner.” She gave Biscuit a bowl of puppy food and Sitsofe and Selase a fresh piece of kenkey to share. “Case closed,” said Sitsofe. The end.', 'An aunt serves kenkey and puppy food to two children and a puppy.'),
    ],
    activities: [
      { id: 'kenk-c1', type: 'comprehension', afterPage: 3, question: 'What clues did Sitsofe find?', options: ['Footprints and crumbs', 'A letter', 'A broken plate'], correctIndex: 0 },
      { id: 'kenk-p1', type: 'prediction', afterPage: 4, prompt: 'The crumbs lead to the back door. Who do you think took the kenkey?', options: ['A small animal', 'A giant', 'The wind'] },
      { id: 'kenk-c2', type: 'comprehension', afterPage: 6, question: 'Who really put the kenkey on the floor?', options: ['Selase', 'Auntie Ekua', 'The puppy alone'], correctIndex: 0 },
      { id: 'kenk-voc', type: 'vocabulary', afterPage: 1, word: 'clue', definition: 'A small piece of information that helps solve a puzzle or mystery.', distractors: ['A kind of food', 'A type of shoe'] },
      { id: 'kenk-s1', type: 'sequencing', prompt: 'Put the case in order.', items: ['Sitsofe and Selase saw the kenkey was missing.', 'They found footprints and crumbs.', 'They found Biscuit the puppy.', 'Selase told the truth.'] },
      { id: 'kenk-sel', type: 'sel', afterPage: 8, prompt: 'Selase felt sorry and told the truth. How do you feel when you tell the truth, even when it is hard?', feelingOptions: ['Brave', 'Relieved', 'Sorry', 'Proud'] },
    ],
    glossary: [
      { word: 'kenkey', definition: 'A Ghanaian food made from fermented corn dough, wrapped and cooked.', pages: [1] },
      { word: 'clues', definition: 'Small pieces of information that help solve a mystery.', pages: [2] },
      { word: 'detective', definition: 'A person who looks for clues to find out the truth.', pages: [7] },
      { word: 'crumbs', definition: 'Tiny pieces that fall off food.', pages: [3] },
    ],
    culturalNotes: ['Kenkey is a popular food in southern Ghana. The family and puppy are invented.', 'The mystery is gentle and shows honesty as the “best clue” of all.'],
    reviewQuestions: ['Is the animal-track clue (four toes) correct for a puppy? Dogs and cats usually show four toes on each paw print; confirm and keep the wording simple.'],
    guide: {
      overview: 'A light mystery that teaches clue-hunting and honesty. A small mystery can be solved by looking, reasoning and telling the truth.',
      lessonMinutes: 25,
      goals: ['Use clues to work out who did something.', 'Retell a story in order.', 'Talk about honesty and saying sorry.'],
      subjects: [['English Language', 'Story retelling and vocabulary'], ['Personal and Social Development', 'Honesty'], ['Integrated Science', 'Animal tracks']],
      before: ['Ask: what is a clue?'],
      during: ['At page 3, ask children to predict who took the kenkey.'],
      after: ['Make footprint clues with paint or clay and have a partner guess the animal.', 'Role-play telling the truth when you have made a mistake.'],
      discussion: ['Why was it hard for Selase to tell the truth?', 'How did Sitsofe respond?'],
      reflection: ['When did you tell the truth even though it was hard?'],
      maths: [{ task: 'A puppy has 4 paws and 4 toes on each paw print. How many toes are on 3 paw prints?', answer: '3 × 4 = 12 toes.' }, { task: 'Sitsofe and Selase share 1 kenkey ball cut into 4 equal pieces, and each takes 2. How many pieces are left?', answer: '4 − 4 = 0 pieces left.' }],
      support: ['Use picture cards for each clue.'],
      stretch: ['Write your own short mystery with three clues and a surprise ending.'],
      localise: ['Use a local food and animals from your area.', 'Link to families’ stories of honesty and forgiveness.'],
    },
  }),
];

