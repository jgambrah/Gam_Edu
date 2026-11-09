/**
 * Batch 10: six story-led science stories set in Ghana (frozen zoo / cell banks, botanical gardens, seed banks,
 * human origins, deep time and dinosaurs, and the Lake Bosumtwi impact crater).
 *
 * Aim: understanding, not notes. In each story the children ask the question, collect evidence or run a small test,
 * hit a surprise, and finish by separating what is known from what is still being discovered. Adults only nudge.
 * Every real-world claim was taken from a named source in this session (see each factCheck); anything not verified
 * is flagged for a science reviewer. All stories are drafts awaiting review.
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

export const BATCH_10_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-freezer-that-keeps-tomorrow',
    title: 'The Freezer That Keeps Tomorrow',
    summary: 'A science club asks what happens if the last pangolin disappears. They discover frozen zoos, test what freezing does to living cells with a tomato, and learn why a freezer can buy time but cannot replace a forest.',
    classIds: ['jhs-1', 'jhs-2'],
    ageMin: 12,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['science', 'realistic-fiction', 'educational'],
    themes: ['animals-and-habitats', 'technology', 'citizenship'],
    objectives: ['scientific-curiosity', 'critical-thinking', 'reasoning', 'environmental-awareness', 'reading-comprehension'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 130,
    paceWord: 'Curious and clear, slowing for numbers and units',
    palette: ['#0e7490', '#16a34a'],
    voice: 'Curious young narrator voice; the teacher speaks briefly and asks questions',
    characters: [
      'Akorfa: a 12-year-old girl with short braids, a teal JHS uniform and a science notebook.',
      'Obed: her friend, 12, in the same uniform, with round glasses and a habit of asking big questions.',
      'Madam Tawiah: the science teacher, in a green dress and lab coat, who answers questions with questions.',
      'A white-bellied pangolin drawn on the club poster: scaly, with a long tail, curled in a gentle ball.',
    ],
    music: 'Quiet, curious synth with soft forest sounds (placeholder)',
    pages: [
      pg('🦔', 'Akorfa’s science club was making a poster about pangolins, shy, scaly mammals that live in Ghana’s forests. Beside one picture she wrote ENDANGERED. Her friend Obed asked a question that stopped them both: ‘What if the last one is gone? Is that it for ever?’', 'Two students beside a poster of a pangolin with the word ENDANGERED.'),
      pg('🏛️', 'At the library, Akorfa read about the Frozen Zoo in San Diego, in the United States. Since 1975, scientists there have kept living cells from animals in tanks at about −196 °C. It now holds over 11,500 cell lines from more than 1,300 species and subspecies. ‘A zoo with no animals walking about,’ said Obed. ‘Only cells.’', 'A girl reads a book about a frozen zoo with a picture of cold storage tanks.'),
      pg('🍅', 'Why cells and not whole animals? They asked Madam Tawiah, who answered with a question: ‘What happens to living things when you freeze them?’ The club froze slices of tomato overnight in the school freezer, then thawed them. The slices came out soft and watery.', 'Students lift thawed tomato slices from a tray, which look soft and collapsed.'),
      pg('🔬', 'Under a hand lens, fresh tomato looked firm and neat. The thawed slice looked collapsed. ‘Ice crystals can form inside cells and tear them open,’ Akorfa read. Then how do scientists freeze cells and keep them alive? ‘They use special liquids called cryoprotectants, and cool the cells carefully, so far less damage is done.’', 'Two slices of tomato under a magnifying lens, one firm and one collapsed.'),
      pg('🐴', 'Banked cells have already been put to work. Scientists have produced clones of a black-footed ferret and a Przewalski’s horse from cells that were frozen decades earlier. ‘So we can bring animals back!’ said Obed. Akorfa shook her head. ‘A clone is one animal. A species needs many animals with different genes to stay healthy.’', 'A friend and Akorfa discuss a picture of a horse and a ferret with small question marks.'),
      pg('🌳', 'They tried a thought experiment. Freeze the cells of one pangolin, then lose its forest. ‘Where would a baby pangolin live? What would it eat?’ asked Obed. ‘Ants and termites,’ said Akorfa. ‘That is a forest job, not a freezer job.’', 'A pangolin in a green forest with ants on a tree beside a drawing of an empty freezer.'),
      pg('📣', 'Akorfa rewrote the poster: Freezers keep cells. Forests keep lives. The club listed ways to help: learn about pangolins, protect the places they live, and tell adults to report trapping or selling to wildlife officers.', 'Students paint a new poster with a forest and a freezer side by side.'),
      pg('❓', 'In her notebook Akorfa wrote: ‘A frozen cell bank is like a pause button, not a rescue. It gives time and insurance, but only if we also protect the places where animals live. What we do not know yet is whether banked cells can ever rebuild a wild population.’ Obed added a question mark. The end.', 'The girl writes in her notebook while a friend adds a question mark next to her words.'),
    ],
    activities: [
      { id: 'freezer-c1', type: 'comprehension', afterPage: 2, question: 'What does the Frozen Zoo keep in its cold tanks?', options: ['Living cells from many animal species', 'Whole living animals', 'Animal bones only'], correctIndex: 0 },
      { id: 'freezer-p1', type: 'prediction', afterPage: 3, prompt: 'Predict: what will a tomato slice look like after one night in a freezer and then thawing?', options: ['Soft and watery', 'The same as before', 'Harder and drier'] },
      { id: 'freezer-c2', type: 'comprehension', afterPage: 4, question: 'Why can ordinary freezing damage living cells?', options: ['Ice crystals can form inside them and tear them', 'The cold makes cells grow too fast', 'Water becomes poisonous'], correctIndex: 0, explanation: 'Ice crystals inside cells can break them, so cell banks use cryoprotectants and careful cooling.' },
      { id: 'freezer-voc', type: 'vocabulary', afterPage: 4, word: 'cryoprotectants', definition: 'Special liquids that protect cells from ice damage when they are frozen.', distractors: ['Tools for cutting ice', 'Types of freezer door'] },
      { id: 'freezer-c3', type: 'comprehension', afterPage: 6, question: 'Why is a frozen cell bank not enough to save pangolins?', options: ['Animals also need habitat, food and many different individuals', 'Cells cannot be frozen at all', 'Pangolins are not real animals'], correctIndex: 0 },
      { id: 'freezer-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the club’s thinking in order.', items: ['Ask what happens if the last animal is gone.', 'Learn about frozen zoos.', 'Test what freezing does to living cells.', 'Decide that habitat matters as much as cell banks.'] },
      { id: 'freezer-sel', type: 'sel', afterPage: 8, prompt: 'Akorfa felt hopeful about science but worried about forests. When have you felt two feelings about the same news?', feelingOptions: ['Hopeful', 'Worried', 'Curious', 'Determined'] },
    ],
    glossary: [
      { word: 'endangered', definition: 'In danger of disappearing for ever.', pages: [1] },
      { word: 'cells', definition: 'The tiny living building blocks of animals, plants and people.', pages: [2, 3, 4, 5, 6, 7, 8] },
      { word: 'cryoprotectants', definition: 'Special liquids that protect cells from ice damage during freezing.', pages: [4] },
      { word: 'clones', definition: 'Animals grown from the cells of another animal, with the same genes.', pages: [5] },
    ],
    culturalNotes: ['Pangolins live in Ghana’s forests and are shy, ant-eating mammals. The story avoids any claim about how many remain, because numbers change.', 'The Frozen Zoo is in San Diego, USA; the story uses it as one example of a field called biobanking, which many countries are developing.'],
    reviewQuestions: ['Confirm the pangolin species and conservation status for Ghana with the Wildlife Division or IUCN before publication.', 'Is the description of clones and species recovery accurate and not over-promising?'],
    guide: {
      overview: 'A story that leads learners from curiosity to a small experiment to a balanced conclusion: cell banks are insurance, not a replacement for habitat. Run the tomato test so the idea of ice damage is something they have seen.',
      lessonMinutes: 50,
      goals: ['Explain what a frozen zoo is and why cells, not animals, are kept.', 'Explain why freezing can damage living cells and how cryoprotectants help.', 'Evaluate the claim that technology can replace conservation.'],
      subjects: [['Integrated Science', 'Cells, conservation and biodiversity'], ['Our World Our People / Social Studies', 'Protecting natural resources'], ['English Language', 'Reading for evidence']],
      before: ['Ask: what could happen to a species if its forest is cleared?'],
      during: ['At page 3, ask learners to predict what the thawed tomato will look like.'],
      after: ['Run the tomato test and discuss what the slices show.', 'Debate: “A frozen zoo means we need not worry about extinction.”'],
      discussion: ['What does a frozen zoo do well, and what can it not do?', 'Why did Akorfa say a clone is not a species?'],
      reflection: ['What place near you could be protected, and who could help?'],
      maths: [
        { task: 'The Frozen Zoo holds about 11,500 cell lines from about 1,300 species and subspecies. About how many cell lines per species on average?', answer: '11,500 ÷ 1,300 ≈ 8.8, so about 9 cell lines per species or subspecies.' },
        { task: 'The Frozen Zoo stores cells at about −196 °C and a home freezer at about −18 °C. How much colder is the Frozen Zoo?', answer: '−18 − (−196) = 178 °C colder.' },
      ],
      support: ['Provide a labelled diagram of a cell with ice crystals inside.'],
      stretch: ['Write a short letter to a wildlife officer explaining one thing a cell bank can and cannot do.'],
      localise: ['Replace pangolins with another local species your learners know.', 'Check which species are protected in Ghana and avoid anything that could encourage hunting.'],
      discoveryStatus: {
        whatWeKnow: ['Living cells can be frozen at very low temperatures for long periods and later revived.', 'Clones of a black-footed ferret and a Przewalski’s horse have been produced from cells banked decades earlier.', 'Protecting habitat is essential for any wild population.'],
        whatWeAreStillDiscovering: ['Whether banked cells can rebuild a healthy, genetically varied wild population for many species.', 'How best to use cell banks together with habitat protection.'],
      },
      investigation: {
        title: 'What does freezing do to living cells?',
        materials: ['A fresh tomato', 'A knife (adult use only)', 'A tray or plate', 'A freezer', 'A hand lens', 'Hand-washing facilities'],
        steps: ['An adult cuts two thin slices.', 'Keep one slice at room temperature on a plate.', 'Freeze the other slice overnight.', 'Thaw it at room temperature next day.', 'Compare firmness and look with a hand lens, then draw both slices.'],
        safetyNote: 'An adult must cut the tomato. Do not eat the test slices. Wash hands afterwards and throw the slices away.',
        whatToNotice: 'The thawed slice is softer and leaks water, because ice damaged many of its cells.',
      },
      factCheck: [
        { claim: 'The Frozen Zoo in San Diego began in 1975, stores cells at about −196 °C (−320 °F) and holds over 11,500 cell lines from more than 1,300 species and subspecies.', explanation: 'These figures come from the San Diego Zoo Wildlife Alliance page and may change.', reference: 'San Diego Zoo Wildlife Alliance, Frozen Zoo page (check the current numbers).' },
        { claim: 'Clones of a black-footed ferret and a Przewalski’s horse were produced from cells banked decades earlier.', explanation: 'Stated on the same page.', reference: 'San Diego Zoo Wildlife Alliance, Frozen Zoo page.' },
        { claim: 'Ice crystals inside cells can damage them; cryoprotectants and controlled cooling reduce the damage.', explanation: 'Standard cryobiology; not verified from a named page in this session.', reference: 'A cell biology textbook or cryobiology review (to verify).' },
      ],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-missing-label',
    title: 'The Missing Label',
    summary: 'On a school trip to the Aburi Botanical Gardens, Etse and Pearl find a tree with no readable label and become plant detectives, learning why gardens exist, why one plant can have many names, and how knowledge should be shared with respect.',
    classIds: ['primary-5', 'primary-6'],
    ageMin: 10,
    ageMax: 12,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['science', 'nature', 'realistic-fiction'],
    themes: ['animals-and-habitats', 'farm-and-garden', 'community'],
    objectives: ['scientific-curiosity', 'reasoning', 'respect', 'cultural-heritage', 'vocabulary'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'proverb'],
    wpm: 120,
    paceWord: 'Warm and observant',
    palette: ['#15803d', '#a16207'],
    voice: 'Curious, friendly voice with calm, thoughtful pauses',
    characters: [
      'Etse: an 11-year-old boy in a white shirt and brown shorts, with a notebook and pencil.',
      'Pearl: an 11-year-old girl in a yellow school dress with braids, always drawing in her notebook.',
      'Mr Tandoh: their teacher, in a cream shirt and cap, who answers with questions.',
      'Maame Ataa: a garden worker in a green work apron and sun hat, with a trowel in her belt.',
      'The tree: a tall silk-cotton tree with wide, wall-like roots, hand-shaped leaves and fluffy white fibres from its fruits.',
    ],
    music: 'Light kora and forest birds with a gentle rhythm (placeholder)',
    pages: [
      pg('🌿', 'Etse and Pearl’s class visited the Aburi Botanical Gardens in the Akuapem hills. The gardens were officially opened in March 1890, when Ghana was still the Gold Coast. ‘Where else could you meet so many kinds of trees in one morning?’ wrote Pearl.', 'Children walk along a shady path in a hilly botanical garden.'),
      pg('🏷️', 'At the end of a path they found a tall tree with a bent, rusted label that nobody could read. ‘A tree with no name,’ said Etse. ‘That is a mystery.’ Mr Tandoh only asked: ‘What evidence could you collect without hurting the tree?’', 'Two children look at a rusted, unreadable label beside a very tall tree.'),
      pg('🔍', 'They became plant detectives. They sketched the leaves, which grew in groups of leaflets like the fingers of a hand. They drew the thick roots that spread like walls, and the fluffy white fibres drifting from open fruits on the ground. They picked nothing from the tree.', 'The children sketch leaves and wall-like roots, with white fibres on the ground.'),
      pg('📖', 'In a field guide, the pictures matched: Ceiba pentandra, the silk-cotton tree. In Twi it is often called onyina. Pearl’s grandmother in Ho used a different local name. ‘So one tree has many names,’ said Etse. ‘Which one is right?’', 'The children compare a field guide page with their sketches.'),
      pg('🗣️', 'Maame Ataa, a gardener, smiled. ‘All are right. Local names carry knowledge and stories. But scientists also give every species a two-part name, the same in every country, so a farmer in Ghana and a researcher in Brazil know they mean the same tree.’', 'A gardener in a sun hat talks to the children under the tree.'),
      pg('📚', 'Etse learned that a garden does more than grow pretty plants. It helps with research, conserves medicinal plants, multiplies plants for planting and trains people in horticulture. ‘It is a living library,’ said Pearl. ‘Each plant is a book we may not have read yet.’', 'Pearl and Etse look at rows of plant beds with tiny labels.'),
      pg('🤝', 'Pearl asked how herbalists’ knowledge is treated. ‘With respect,’ said Maame Ataa. ‘Healers share what they know, and researchers should ask permission, give credit and share the benefits.’ Pearl wrote it down. ‘Knowledge belongs to people too, not only to plants.’', 'A gardener and children talk beside a bed of medicinal plants.'),
      pg('✍️', 'Before they left, the class made a new label: a common name, a scientific name and the date. Etse added: ‘Identified by Primary 6 using leaf, root and fruit evidence.’ The tree had its name again, and the children had learned how names help us share knowledge. The end.', 'Children attach a new label to a post beside the tall tree.'),
    ],
    activities: [
      { id: 'label-c1', type: 'comprehension', afterPage: 3, question: 'Which evidence did the children use to work out the tree’s identity?', options: ['Leaf shape, roots and fruit fibres', 'Only the colour of the bark', 'The age of the label'], correctIndex: 0 },
      { id: 'label-p1', type: 'prediction', afterPage: 4, prompt: 'The tree has several local names. Why might scientists also use one two-part name?', options: ['So everyone knows exactly which species is meant', 'Because local names are wrong', 'To make it harder'] },
      { id: 'label-c2', type: 'comprehension', afterPage: 5, question: 'According to Maame Ataa, why do scientists give a two-part name to every species?', options: ['It is the same in every country, so everyone knows which species is meant', 'It is shorter than local names', 'Local names are not allowed'], correctIndex: 0 },
      { id: 'label-voc', type: 'vocabulary', afterPage: 5, word: 'species', definition: 'A particular kind of living thing, such as one kind of tree.', distractors: ['A small garden', 'A kind of tool'] },
      { id: 'label-c3', type: 'comprehension', afterPage: 7, question: 'What does Maame Ataa say researchers should do when using healers’ knowledge?', options: ['Ask permission, give credit and share benefits', 'Use it without telling anyone', 'Keep it secret'], correctIndex: 0 },
      { id: 'label-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the plant detectives’ steps in order.', items: ['Find a tree with a missing label.', 'Collect evidence from leaves, roots and fruit fibres.', 'Compare it with a field guide.', 'Make a new label.'] },
      { id: 'label-sel', type: 'sel', afterPage: 8, prompt: 'Pearl realised that knowledge belongs to people too. When have you learned something important from an elder or a community member?', feelingOptions: ['Respectful', 'Curious', 'Grateful', 'Proud'] },
    ],
    glossary: [
      { word: 'botanical', definition: 'To do with plants and the study of plants.', pages: [1] },
      { word: 'evidence', definition: 'Facts or clues that help show what is true.', pages: [2, 8] },
      { word: 'species', definition: 'One particular kind of living thing.', pages: [5] },
      { word: 'horticulture', definition: 'The science and skill of growing garden plants.', pages: [6] },
    ],
    culturalNotes: ['Aburi Botanical Gardens, in the Akuapem hills, were officially opened in March 1890 during the colonial period. Today, according to the Botanic Gardens Conservation International listing, its work includes research, conservation of medicinal plants, plant multiplication, horticulture training and environmental education.', 'Local plant names carry knowledge. Onyina is a Twi name for the silk-cotton tree; confirm local names with speakers before use.'],
    reviewQuestions: ['The scene on the path is invented; the story does not claim this tree or label exists at Aburi. Is that clear enough?', 'Confirm the Twi name and that Ceiba pentandra is correctly described (hand-like leaflets, buttress roots, kapok fibres).', 'Is the colonial context mentioned fairly and briefly?'],
    guide: {
      overview: 'A detective story about naming and knowing. Learners practise gathering evidence from a living organism without harming it, then learn why gardens, scientific names and respectful sharing of knowledge matter.',
      lessonMinutes: 45,
      goals: ['Use observation to identify a plant.', 'Explain why species have local names and one scientific name.', 'Describe how botanical gardens contribute to research and conservation.'],
      subjects: [['Integrated Science', 'Plants, classification, conservation'], ['Our World Our People / Social Studies', 'Local knowledge and respect'], ['Ghanaian Language', 'Plant names']],
      before: ['Ask learners for different local names for one plant they know.'],
      during: ['At page 3, ask learners to name three features they could record without touching a tree.'],
      after: ['Do a leaf-detective walk in the school compound, drawing at least three features of three plants and asking a plant expert or elder for names.'],
      discussion: ['Why did Maame Ataa say all the names are right?', 'How could a garden help protect a medicine plant?'],
      reflection: ['What plant knowledge does your family hold?'],
      maths: [{ task: 'The gardens opened in March 1890. How many years ago is that, from 2026?', answer: '2026 − 1890 = 136 years (check your teaching year).' }],
      support: ['Provide a simple observation chart: leaf shape, roots, fruit, smell.'],
      stretch: ['Write the two-part scientific name correctly (genus capitalised, species lowercase, both in italics) and explain why.'],
      localise: ['Confirm all local names with speakers of the languages in your class.', 'Visit a real garden or school plot, with a staff member, if possible; do not pick plants without permission.'],
      investigation: {
        title: 'Leaf detectives',
        materials: ['Notebook and pencil', 'A ruler', 'A hand lens (optional)', 'A plant field guide or help from an adult'],
        steps: ['Choose three plants in a safe area.', 'Record leaf shape, size, how leaves are arranged and any other features.', 'Do not pick or damage plants. Photograph or sketch.', 'Ask an adult or use a guide to identify them and note local and scientific names.'],
        safetyNote: 'Do not touch plants you cannot identify, because some can irritate skin. Wash hands afterwards and stay with an adult.',
        whatToNotice: 'Different plants have different leaves, roots and fruits that act as clues to their identity.',
      },
      factCheck: [
        { claim: 'Aburi Botanical Gardens were officially opened in March 1890, and today are involved in research, conservation of medicinal plants, plant multiplication, horticulture training and environmental education.', explanation: 'From the Botanic Gardens Conservation International garden listing. The listing is ambiguous about the exact start (land was also cleared in 1899).', reference: 'BGCI, Aburi Botanic Gardens listing.' },
        { claim: 'Ceiba pentandra (silk-cotton tree) is known by local names such as onyina in Twi, grows in West Africa and the Americas, and has hand-shaped leaves, buttress roots and kapok fibres.', explanation: 'Standard botanical description not verified from a named page in this session.', reference: 'A West African plant guide or Kew resources (to verify).' },
      ],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'seeds-that-wait-in-the-cold',
    title: 'Seeds That Wait in the Cold',
    summary: 'When her grandmother’s favourite garden egg disappears from the market, Mavis tests how old seeds lose their power to sprout and discovers how Ghana’s national gene bank and a far-away vault in Norway guard seeds for the future.',
    classIds: ['primary-4', 'primary-5'],
    ageMin: 9,
    ageMax: 11,
    readingLevel: 'fluent',
    difficulty: 3,
    genres: ['science', 'realistic-fiction', 'educational'],
    themes: ['farm-and-garden', 'food', 'family'],
    objectives: ['scientific-curiosity', 'reasoning', 'problem-solving', 'environmental-awareness', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-food', 'local-names', 'village-life'],
    wpm: 115,
    paceWord: 'Warm and curious, with clear numbers',
    palette: ['#65a30d', '#7c2d12'],
    voice: 'Warm voice; Grandma Gyamfua is gentle and amused',
    characters: [
      'Mavis: a 10-year-old girl in a green school dress with two neat braids and a small notebook.',
      'Tei: her classmate, 10, in a white shirt and navy shorts, who loves numbers.',
      'Grandma Gyamfua: Mavis’s grandmother, in a flowery wrapper and a scarf, with a calabash of seeds.',
      'Madam Quaye: the science teacher, in a lilac blouse, who gives clues rather than answers.',
    ],
    music: 'Gentle strings with soft rain and distant cold winds (placeholder)',
    pages: [
      pg('🍆', 'Mavis’s grandmother grew a kind of garden egg that Mavis loved. It was small, round and a little bitter, and it made the best stew. ‘Last year I could not find the seeds,’ said Grandma Gyamfua. ‘Nobody in our market sells them any more.’', 'A grandmother and a girl hold small round garden eggs by a vegetable plot.'),
      pg('🏛️', 'Mavis and her friend Tei wondered: if a plant vanishes from farms, is it gone for ever? Their teacher mentioned the national gene bank at Bunso, run by CSIR-Plant Genetic Resources Research Institute. It began in 1964 and lists more than 15,000 samples, called accessions, with yam, cowpea, maize, rice and garden egg among its biggest collections.', 'The children look at a picture of seed packets and labelled jars in a research store.'),
      pg('💤', 'A seed looks still, but it is alive and asleep. ‘If it stays cool and dry, it can sleep for years,’ said Tei. ‘If it gets warm and damp, it may wake too early, or rot.’ Mavis wanted to test this herself.', 'A close picture of a seed with a tiny sleeping face drawn lightly in the corner.'),
      pg('🧪', 'They ran a germination test. On wet cloth in two trays they put 10 cowpea seeds from this year’s harvest and 10 old seeds that had been left in a hot, damp shed. After five days, 9 of the new seeds had sprouted, but only 3 of the old seeds. ‘That is 90% and 30%,’ said Tei.', 'Two trays of cowpea seeds on damp cloth, one with many green shoots and one with few.'),
      pg('😟', 'So how do gene banks stop seeds losing their power to sprout? They dry them and keep them cold. ‘But what if the power goes off,’ asked Mavis, ‘or a flood or a fire comes?’ ‘Then a whole collection could be lost,’ said Tei.', 'The children look at a dark, cold storeroom with a worried face.'),
      pg('❄️', 'The teacher told them about a backup far away. In October 2023, Ghana’s gene bank duplicated 422 samples, including maize, rice, cowpea and garden egg, for the Svalbard Global Seed Vault in Norway. There, seeds are kept at −18 °C, about 120 m inside a mountain. Ghana still owns its seeds and can ask for them back.', 'A mountain with a small door and a tunnel, drawn in snowy surroundings.'),
      pg('🧮', 'Tei did the sums. ‘The vault can hold 4.5 million samples. Ghana sent 422. That is less than one in ten thousand, but it is a backup of important crops.’ Mavis asked why not more. ‘Money,’ said the teacher. ‘The trip cost about US$15,000, so only some samples could go.’', 'Tei writes numbers on a board while Mavis and the teacher watch.'),
      pg('📮', 'Grandma Gyamfua gave Mavis a few of her last garden-egg seeds. Mavis wrote to the institute, asking whether their village variety could be collected, with Grandma’s name and permission. ‘Seeds are a library of recipes for the future,’ said Mavis. ‘One small seed might hold the answer to a drought or disease one day.’ The end.', 'The girl writes a letter at a table with a small packet of seeds beside her.'),
    ],
    activities: [
      { id: 'seed-c1', type: 'comprehension', afterPage: 4, question: 'After five days, what percentage of the new cowpea seeds had sprouted?', options: ['90%', '30%', '9%'], correctIndex: 0, explanation: '9 out of 10 is 90%.' },
      { id: 'seed-p1', type: 'prediction', afterPage: 3, prompt: 'Predict: which will sprout better, fresh seeds or old seeds kept in a hot, damp shed? Why?', options: ['Fresh seeds', 'Old seeds', 'Both the same'] },
      { id: 'seed-c2', type: 'comprehension', afterPage: 6, question: 'Why did Ghana send some of its seeds to Svalbard?', options: ['As a backup in case something happens to the national collection', 'To sell them', 'Because Ghana has no gene bank'], correctIndex: 0 },
      { id: 'seed-voc', type: 'vocabulary', afterPage: 2, word: 'accessions', definition: 'Samples of seeds or plants that are recorded and kept in a gene bank.', distractors: ['Types of fertiliser', 'Kinds of rainfall'] },
      { id: 'seed-c3', type: 'comprehension', afterPage: 7, question: 'How did the cost of the trip affect the number of samples Ghana sent?', options: ['Cost limited how many samples could be sent', 'Cost was not a factor', 'Ghana sent all of its samples'], correctIndex: 0 },
      { id: 'seed-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the children’s investigation in order.', items: ['A favourite garden egg disappears from the market.', 'They learn about the national gene bank.', 'They test fresh and old seeds.', 'They learn about the backup in Norway.'] },
      { id: 'seed-sel', type: 'sel', afterPage: 8, prompt: 'Grandma trusted Mavis with her last seeds. When has someone trusted you with something important?', feelingOptions: ['Trusted', 'Responsible', 'Proud', 'Nervous'] },
    ],
    glossary: [
      { word: 'accessions', definition: 'Samples recorded and stored in a gene bank.', pages: [2] },
      { word: 'germination', definition: 'When a seed begins to grow into a plant.', pages: [4] },
      { word: 'sprouted', definition: 'Began to grow a shoot.', pages: [4] },
      { word: 'backup', definition: 'A spare copy kept safe in case the first is lost.', pages: [6, 7] },
    ],
    culturalNotes: ['Ghana’s national gene bank is run by the CSIR-Plant Genetic Resources Research Institute at Bunso, which began in 1964 and has become an institute. Traditional varieties of garden egg, cowpea and other crops are part of Ghanaian food heritage.', 'The story’s grandmother and variety are invented to show a real challenge: local varieties can disappear from farms.'],
    reviewQuestions: ['Confirm with CSIR-PGRRI that “more than 15,000 accessions” and the 1964 start are correct and current, and that the invented village scene does not mislead.', 'Is it appropriate to mention the cost and the limited number deposited, or should that be framed differently?'],
    guide: {
      overview: 'A story where children learn why seeds are stored and test the idea that seeds lose their ability to sprout. It links a family story to a national institution and a global backup, and uses real numbers.',
      lessonMinutes: 50,
      goals: ['Explain that seeds are living and can lose their ability to sprout.', 'Calculate germination percentages.', 'Explain why gene banks keep backups.'],
      subjects: [['Integrated Science', 'Seeds, plants and conservation'], ['Mathematics', 'Percentages and large numbers'], ['Our World Our People', 'Food and culture']],
      before: ['Ask: do all the foods your grandparents grew still exist today?'],
      during: ['At page 3, ask learners to predict what will happen to the old seeds.'],
      after: ['Run a germination test with fresh and old seeds, and compute percentages.', 'Ask older family members about a food plant that has become rare.'],
      discussion: ['Why does it matter if a local crop disappears?', 'Why is a backup in a different country sensible?'],
      reflection: ['What would you want to save for the future, and why?'],
      maths: [
        { task: '9 of 10 fresh seeds sprouted and 3 of 10 old seeds sprouted. Give the percentages.', answer: '90% and 30%.' },
        { task: 'The vault’s capacity is 4.5 million samples. Ghana’s 422 samples are what fraction, roughly?', answer: '422 ÷ 4,500,000 ≈ 0.0000938, which is less than 1 in 10,000.' },
        { task: 'The vault stores at −18 °C. If a room is 28 °C, how many degrees colder is the vault?', answer: '28 − (−18) = 46 °C colder.' },
      ],
      support: ['Provide a table for number planted, number sprouted and percentage.'],
      stretch: ['Predict what percentage you would expect if you tested a larger sample of 100 seeds, and explain why larger samples are more reliable.'],
      localise: ['Use seeds that are common and safe where you teach; do not use treated seeds.', 'Ask local farmers or elders for the names of traditional varieties.'],
      discoveryStatus: {
        whatWeKnow: ['Seeds are living and can stay alive for years when dry and cold, but lose the ability to sprout over time.', 'Ghana’s gene bank at Bunso holds more than 15,000 accessions, and 422 duplicates were sent to Svalbard in October 2023.', 'The Svalbard vault keeps seeds at −18 °C, deep in a mountain.'],
        whatWeAreStillDiscovering: ['Exactly how long different crops’ seeds stay alive under different storage conditions.', 'How to store crops that do not make seeds easily, such as some roots and tubers.'],
      },
      investigation: {
        title: 'Fresh seeds or old seeds?',
        materials: ['Two sets of 10 untreated cowpea or bean seeds (one fresh, one old)', 'Two trays or plates', 'Cloth or tissue', 'Water', 'Notebook'],
        steps: ['Moisten cloth on two trays.', 'Put the fresh seeds on one and old seeds on the other.', 'Keep both in the same place, damp but not soaking.', 'Count how many have sprouted after 3 and 5 days.', 'Work out the percentages and compare.'],
        safetyNote: 'Use untreated seeds only (seeds sold for planting are sometimes coated with chemicals). Do not eat test seeds. Wash hands afterwards.',
        whatToNotice: 'Fresh seeds usually sprout more than old, poorly stored seeds, but the result with only 10 seeds can vary: try repeating.',
      },
      factCheck: [
        { claim: 'The Ghana National Genebank at Bunso is run by CSIR-PGRRI, began in 1964, and lists more than 15,000 accessions, with yam, cowpea, maize, rice and eggplant among its largest collections.', explanation: 'From the Crop Trust partner page; figures may change.', reference: 'Crop Trust, Ghana National Genebank page.' },
        { claim: 'In October 2023 Ghana duplicated 422 accessions (including maize, rice, cowpea and indigenous garden egg) for the Svalbard Global Seed Vault, supported by the Crop Trust; the cost was about US$15,000; Ghana can request the seeds back.', explanation: 'From a Ghana News Agency article dated August 2026.', reference: 'Ghana News Agency, “Ghana deposits 422 germplasm accessions in global seed vault” (August 2026).' },
        { claim: 'Svalbard vault: −18 °C, capacity 4.5 million samples, about 120 m into a mountain; depositors own their seeds.', explanation: 'From the Crop Trust FAQ.', reference: 'Crop Trust, Svalbard Global Seed Vault FAQs.' },
      ],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'faces-that-look-like-ours',
    title: 'Faces That Look Like Ours',
    summary: 'Two friends in a school library follow fossils from Morocco to a cave in Ghana, build a timeline on the field, learn how alike all people are, and write down what scientists still do not know about the story of our species.',
    classIds: ['jhs-1', 'jhs-2'],
    ageMin: 12,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['science', 'historical', 'educational'],
    themes: ['identity', 'community', 'school'],
    objectives: ['scientific-curiosity', 'critical-thinking', 'reasoning', 'respect', 'summarising'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 130,
    paceWord: 'Thoughtful, with clear pauses for dates',
    palette: ['#92400e', '#0369a1'],
    voice: 'Curious, reflective voice; the librarian speaks briefly and asks questions',
    characters: [
      'Ekow: a 13-year-old boy in a blue JHS uniform with a sketchpad and a pencil behind his ear.',
      'Mawusi: a 13-year-old girl in the same uniform, with braids and a calm, determined look.',
      'Madam Asare: the school librarian, in a patterned blouse and reading glasses.',
      'A poster of a skull drawn in outline, showing a modern-looking face and a longer, lower braincase.',
    ],
    music: 'Slow, warm drums and a thoughtful flute, rising gently (placeholder)',
    pages: [
      pg('💀', 'In the school library, Ekow stared at a poster of skulls. One was labelled Homo sapiens, 300,000 years ago, Morocco. ‘Morocco?’ he said. ‘I thought our story began somewhere else.’ His friend Mawusi grinned. ‘So did scientists, until recently.’', 'Two students look at a poster of skulls with one labelled with a date and a place.'),
      pg('🧠', 'They read that fossils from Jebel Irhoud in Morocco are about 300,000 years old, about 100,000 years older than the previous record. The face looks almost like ours. But the back of the skull is longer and lower, an older shape. ‘So brain shape changed later,’ said Mawusi. ‘Maybe how brains worked changed too.’', 'A close drawing of a skull outline with a modern face and a long low braincase.'),
      pg('🗺️', 'Ekow drew a map. Florisbad, South Africa: about 260,000 years. Omo Kibish, Ethiopia: about 195,000. Herto, Ethiopia: about 160,000. ‘Our species did not start in one tiny place,’ he said. ‘There was dispersal within Africa, long before anyone left.’', 'A sketch map of Africa with four marked fossil sites and dates.'),
      pg('⛰️', 'Mawusi found Ghana on the map. There were no famous skulls here, but another kind of clue: Bosumpra Cave, on the Kwahu Plateau near Abetifi. People used it for more than 10,000 years. Scientists found remains of wild nuts and oil palm, and later domesticated pearl millet and cowpea.', 'A cave on a hillside with ancient plant remains drawn in the foreground.'),
      pg('📏', 'They made a timeline on the school field: one step for every 10,000 years. Bosumpra’s 10,000 years was 1 step. Homo sapiens’ 300,000 years was a line of 30 steps. ‘We are very young,’ said Ekow. ‘But thirty steps of people is a lot of stories.’', 'Two students pace out a line of steps across a school field.'),
      pg('🧬', 'Then Mawusi found a number that surprised them both: on average any two people’s DNA is about 99.6% the same. ‘You, a boy in Tokyo and a girl in Tamale are 99.6% alike,’ she said. ‘The differences are real but small, and we are one species.’', 'Mawusi shows Ekow a page with a DNA drawing and a percentage.'),
      pg('❔', 'Madam Asare asked, ‘What do you not know?’ They made a list. How much did different groups of early people mix? What did the earliest Homo sapiens think and say? Are older fossils still waiting in the ground? Ekow smiled. ‘Science is a map with blank corners.’', 'The librarian reads a list of questions the students wrote on paper.'),
      pg('🏷️', 'On the poster they added a label: ‘Our story: older than we thought, spread across Africa, still being discovered. A cave in Ghana and a skull in Morocco belong to the same human family.’ The end.', 'The students stick a new label onto the poster.'),
    ],
    activities: [
      { id: 'faces-c1', type: 'comprehension', afterPage: 2, question: 'What was surprising about the Jebel Irhoud fossils?', options: ['They are about 300,000 years old, much older than the previous record', 'They are only 10,000 years old', 'They come from Ghana'], correctIndex: 0 },
      { id: 'faces-c2', type: 'comprehension', afterPage: 2, question: 'What does the shape of the skull suggest?', options: ['The face looked modern, but the braincase was still an older shape', 'The skull looks exactly like ours', 'The skull is from an animal'], correctIndex: 0 },
      { id: 'faces-p1', type: 'prediction', afterPage: 4, prompt: 'On the timeline, 10,000 years is one step. How many steps will 300,000 years be?', options: ['30 steps', '3 steps', '300 steps'] },
      { id: 'faces-voc', type: 'vocabulary', afterPage: 3, word: 'dispersal', definition: 'Spreading out to many places.', distractors: ['Falling asleep', 'A kind of fossil'] },
      { id: 'faces-c3', type: 'comprehension', afterPage: 6, question: 'What does the 99.6% figure tell us?', options: ['Any two people’s DNA is, on average, almost identical', 'People from different places are different species', 'DNA is not important'], correctIndex: 0 },
      { id: 'faces-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the friends’ investigation in order.', items: ['See a skull poster dated 300,000 years ago.', 'Map other early fossil sites in Africa.', 'Look at Ghana’s cave evidence.', 'Write what is still unknown.'] },
      { id: 'faces-sel', type: 'sel', afterPage: 8, prompt: 'Learning that all people are so alike can change how we see each other. How does it make you feel about people who seem different?', feelingOptions: ['Connected', 'Curious', 'Surprised', 'Respectful'] },
    ],
    glossary: [
      { word: 'fossils', definition: 'Remains or traces of ancient living things preserved in rock or soil.', pages: [2] },
      { word: 'species', definition: 'A group of living things that can have healthy offspring together.', pages: [3, 6] },
      { word: 'dispersal', definition: 'Spreading out to many places.', pages: [3] },
      { word: 'DNA', definition: 'The chemical instructions inside cells that help make each living thing.', pages: [6] },
    ],
    culturalNotes: ['The story presents Ghana as part of the long human story: Bosumpra Cave on the Kwahu Plateau shows human use of a Ghanaian site for more than 10,000 years.', 'The story treats all people as one species and avoids ranking people or groups.'],
    reviewQuestions: ['Have an anthropology or biology teacher review the wording on species, DNA similarity and the Jebel Irhoud interpretation.', 'Check Bosumpra dates with a Ghanaian archaeologist; this draft uses “more than 10,000 years”.', 'Is the sentence “we are one species” handled sensitively and clearly?'],
    guide: {
      overview: 'A story about how scientific ideas change. The oldest known Homo sapiens fossils are in Morocco; Ghana’s cave shows how people lived much later. The timeline walk gives learners a feel for deep time, and the DNA figure supports a conversation about human unity and variation.',
      lessonMinutes: 55,
      goals: ['Explain that our species is about 300,000 years old and that its origin involved many parts of Africa.', 'Build and read a scaled timeline.', 'Explain that people are genetically very similar and that science keeps changing.'],
      subjects: [['Integrated Science', 'Evolution and human variation'], ['Social Studies / History', 'Human origins and archaeology'], ['Mathematics', 'Scale and ratio']],
      before: ['Ask: where do you think the story of our species began?'],
      during: ['At page 5, ask learners to calculate steps before reading on.'],
      after: ['Build the timeline on the field and add events: school founded, Ghana’s independence (1957), Bosumpra’s first use, Homo sapiens.', 'Debate: “Why do scientific ideas change?”'],
      discussion: ['What does it mean that the face looked modern but the braincase did not?', 'Why is “dispersal within Africa” an important idea?'],
      reflection: ['What would you like scientists to find next?'],
      maths: [
        { task: 'On a timeline of 1 step per 10,000 years, how many steps for 300,000 years?', answer: '300,000 ÷ 10,000 = 30 steps.' },
        { task: 'How many years older is Jebel Irhoud (about 300,000) than Herto (about 160,000)?', answer: '300,000 − 160,000 = 140,000 years.' },
        { task: 'About 3 billion DNA letters are in a human genome. 0.4% of 3 billion is how many letters?', answer: '0.004 × 3,000,000,000 = 12,000,000 letters, about 12 million.' },
      ],
      support: ['Provide a printed timeline and fill in the dates.'],
      stretch: ['Explain in one paragraph why a single oldest fossil does not prove where a species began.'],
      localise: ['Add local archaeological sites if available; discuss with care that these are heritage places.', 'Keep discussion of human variation respectful; be ready to challenge any stereotypes that arise.'],
      discoveryStatus: {
        whatWeKnow: ['Fossils from Jebel Irhoud, Morocco, are about 300,000 years old and are the oldest securely dated Homo sapiens fossils.', 'Early Homo sapiens fossils are known from several parts of Africa, including Florisbad (about 260,000 years), Omo Kibish (about 195,000 years) and Herto (about 160,000 years).', 'On average, any two people’s genomes are about 99.6% identical.', 'Bosumpra Cave on the Kwahu Plateau was used for more than 10,000 years.'],
        whatWeAreStillDiscovering: ['Exactly where and how our species first emerged, and how groups across Africa interacted.', 'How early people’s brains, thinking and language developed.', 'Whether older fossils remain to be found.'],
      },
      investigation: {
        title: 'Walk through deep time',
        materials: ['A long rope or a measured path (at least 30 m)', 'Markers or stones', 'Cards for events'],
        steps: ['Choose a scale of 1 step (about 1 m) for 10,000 years.', 'Mark today as the start of the rope.', 'Place a marker at 1 step for Bosumpra’s 10,000 years and at 30 steps for Homo sapiens.', 'Add events your class chooses and discuss what the distances tell you.'],
        safetyNote: 'Do the walk on a safe, flat area away from roads, in shade where possible.',
        whatToNotice: 'Human history takes up a very small part of the long history of the Earth.',
      },
      factCheck: [
        { claim: 'Jebel Irhoud fossils are about 300,000 years old, the oldest securely dated Homo sapiens evidence; the face looks almost modern but the braincase is elongated and archaic; other early sites include Florisbad (about 260,000 years), Omo Kibish (about 195,000 years) and Herto (about 160,000 years).', explanation: 'From the Max Planck Society summary of the 2017 research.', reference: 'Max Planck Society, “The first of our kind” (mpg.de). Check for newer discoveries.' },
        { claim: 'On average any two people’s genomes are about 99.6% identical (the older figure of 99.9% counts only single-letter differences).', explanation: 'From the US National Human Genome Research Institute.', reference: 'NHGRI, Human Genomic Variation fact sheet.' },
        { claim: 'Bosumpra Cave (Abetifi, Kwahu Plateau) was used over more than 10,000 years; plant remains include Canarium and oil palm, and later domesticated pearl millet and cowpea.', explanation: 'From a published study of the cave’s plant remains.', reference: 'Vegetation History and Archaeobotany, 2015 (Springer); confirm details with an archaeologist.' },
      ],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-dinosaur-in-the-yard',
    title: 'The Dinosaur in the Yard',
    summary: 'A cousin claims that a hen is a kind of dinosaur. To test the idea, Abeiku and Naomi stretch a rope across the school field where one metre equals a million years, and discover how long ago dinosaurs lived, what happened to them, where in Africa their bones have been found, and why birds are still around.',
    classIds: ['primary-5', 'primary-6'],
    ageMin: 10,
    ageMax: 12,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['science', 'educational', 'humour'],
    themes: ['animals-and-habitats', 'family', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'critical-thinking', 'vocabulary', 'reading-comprehension'],
    ghanaianContext: 'incidental',
    culturalTags: ['village-life', 'local-names'],
    wpm: 120,
    paceWord: 'Energetic and curious, slowing for the big numbers',
    palette: ['#b45309', '#15803d'],
    voice: 'Lively, curious voice with a little humour for the hen',
    characters: [
      'Abeiku: an 11-year-old boy in a yellow shirt and brown shorts, with a scuffed notebook.',
      'Naomi: his cousin, 11, in a red dress with two thick braids, who loves facts.',
      'Madam Quansah: the science teacher, in a green dress, carrying a long rope with knots.',
      'The hen: a speckled brown hen with a red comb and a calm stare.',
      'Fossil drawings: a long-necked plant-eating dinosaur skeleton and a chicken skeleton side by side.',
    ],
    music: 'Light adventure strings with a comic clucking motif (placeholder)',
    pages: [
      pg('🐔', 'Abeiku was watching hens scratch in his grandmother’s yard when his cousin Naomi said something odd. ‘Did you know a hen is a kind of dinosaur?’ Abeiku laughed. ‘A dinosaur? It cannot even fly over the fence.’', 'A boy laughs at a hen while a girl looks serious in a village yard.'),
      pg('🪢', 'Next day they asked Madam Quansah. She did not say yes or no. ‘First, find out how long ago dinosaurs lived,’ she said. She gave them a 150 m rope with a knot at every metre. ‘One metre is one million years. You are standing at today.’', 'A teacher gives two children a long knotted rope on a school field.'),
      pg('📍', 'They placed a pin 30 cm from the start for our species, Homo sapiens, about 300,000 years old. At just over one metre they set a pebble for the Lake Bosumtwi crater, about 1.07 million years old. ‘Everything we know about people fits in the first step,’ said Abeiku.', 'Two children place a pin and a pebble along a rope near the start.'),
      pg('☄️', 'They kept walking. At 66 m, Naomi stopped. ‘This is the big extinction,’ she read, ‘about 66 million years ago, when an enormous asteroid struck and every dinosaur except the birds died out.’ Abeiku looked back at the tiny start. ‘We walked sixty-six steps, and people are only at the beginning.’', 'Two children stand at a marker with a picture of an asteroid in the sky.'),
      pg('🦕', 'At 135 m they reached the end of the rope. ‘A plant-eating dinosaur called Jobaria lived in what is now Niger, in West Africa, about 135 million years ago,’ read Naomi. ‘That is the same part of Africa as Ghana,’ said Abeiku. ‘But 135 steps back in time.’', 'The children stand at the end of the rope with a picture of a long-necked dinosaur.'),
      pg('🦴', 'They read more. Scientists found about 50 Jobaria specimens at one site, apparently after a flash flood. And the first Spinosaurus bones, found in Egypt in 1912, were destroyed in a bombing raid in 1944, so for years scientists had only drawings and photographs. ‘Fossils are fragile,’ said Naomi. ‘And so is the evidence.’', 'The children look at an old drawing of a dinosaur skeleton and a photograph of bones.'),
      pg('🔬', 'Back at school, Madam Quansah put two skeletons side by side: a meat-eating theropod dinosaur and a chicken. Abeiku counted: legs like a bird’s, three toes pointing forward, a wishbone. ‘Birds come from the theropods,’ she said. ‘They are living dinosaurs.’ Abeiku looked at the hen. The hen looked back.', 'A teacher shows two skeleton drawings, one dinosaur and one chicken, to the children.'),
      pg('🪨', 'They left a stone at the 66 m knot with a card: ‘The hen’s family line goes back past this stone. And we do not know everything, because new fossils are still being found.’ Abeiku scattered some grain for the hen. ‘Thank you, little dinosaur,’ he said. The end.', 'The boy feeds a hen in the yard while the girl holds up a card.'),
    ],
    activities: [
      { id: 'dino-c1', type: 'comprehension', afterPage: 2, question: 'On the children’s rope, what does one metre stand for?', options: ['One million years', 'One thousand years', 'One year'], correctIndex: 0 },
      { id: 'dino-p1', type: 'prediction', afterPage: 3, prompt: 'Predict: where on the rope will dinosaurs go, if people are 30 cm from the start?', options: ['Very far along the rope', 'Right next to people', 'At the very start'] },
      { id: 'dino-c2', type: 'comprehension', afterPage: 4, question: 'How far from the start was the big extinction on the rope?', options: ['66 m', '135 m', '30 cm'], correctIndex: 0 },
      { id: 'dino-voc', type: 'vocabulary', afterPage: 4, word: 'asteroid', definition: 'A rocky object that travels around the Sun, much smaller than a planet.', distractors: ['A kind of dinosaur', 'A type of fossil'] },
      { id: 'dino-c3', type: 'comprehension', afterPage: 6, question: 'Why did Naomi say “the evidence is fragile”?', options: ['Fossils can be lost or destroyed, so scientists may only have photos or drawings', 'Fossils are made of glass', 'Nobody has ever found fossils'], correctIndex: 0 },
      { id: 'dino-c4', type: 'comprehension', afterPage: 7, question: 'Which living animals are descended from theropod dinosaurs?', options: ['Birds', 'Crocodiles only', 'Goats'], correctIndex: 0 },
      { id: 'dino-s1', type: 'sequencing', afterPage: 8, prompt: 'Put these in order from most recent to longest ago.', items: ['Homo sapiens appear (about 300,000 years ago).', 'Lake Bosumtwi crater forms (about 1.07 million years ago).', 'The big extinction (about 66 million years ago).', 'Jobaria lives in Niger (about 135 million years ago).'] },
      { id: 'dino-sel', type: 'sel', afterPage: 8, prompt: 'Abeiku first laughed at the idea that a hen is a dinosaur, then changed his mind. How does it feel to change your mind because of evidence?', feelingOptions: ['Surprised', 'Curious', 'Humble', 'Excited'] },
    ],
    glossary: [
      { word: 'extinction', definition: 'When a whole kind of living thing dies out for ever.', pages: [4] },
      { word: 'asteroid', definition: 'A rocky object that travels around the Sun.', pages: [4] },
      { word: 'specimens', definition: 'Samples or examples collected for scientists to study.', pages: [6] },
      { word: 'theropod', definition: 'A group of mostly meat-eating dinosaurs that walked on two legs.', pages: [7] },
    ],
    culturalNotes: ['Village hens are a familiar sight across Ghana and give learners a close link to dinosaurs.', 'Dinosaur fossils have been found in other African countries, such as Niger and Egypt; the story does not claim any dinosaur has been found in Ghana.'],
    reviewQuestions: ['Confirm with a palaeontologist: the 66 million-year date, the asteroid explanation, the Jobaria age and the “birds are living dinosaurs” statement.', 'Check whether a more recent Spinosaurus discovery should be mentioned.', 'Is the claim that Jobaria was found in “the same part of Africa” suitably cautious?'],
    guide: {
      overview: 'A story built on a surprising claim. Learners test it by scaling deep time to a rope and then see that birds are living dinosaurs. The rope walk makes huge numbers feel real.',
      lessonMinutes: 55,
      goals: ['Place events in deep time using a scale.', 'Explain what happened about 66 million years ago and which dinosaurs survived.', 'Explain why scientists compare skeletons.'],
      subjects: [['Integrated Science', 'Fossils, extinction and evolution'], ['Mathematics', 'Scale and large numbers'], ['Social Studies', 'Africa and discovery']],
      before: ['Ask: what is the biggest animal you have ever seen? What do you think lived here long ago?'],
      during: ['At pages 3 and 4, ask learners to calculate the rope positions before reading.'],
      after: ['Walk a 150 m scale on the school field with event cards.', 'Compare a chicken wing or drawing with a theropod diagram.'],
      discussion: ['Why did the children use a rope?', 'Why does the hen count as a dinosaur?'],
      reflection: ['Which fact from the story would you most like to check yourself?'],
      maths: [
        { task: 'On the rope (1 m = 1 million years), where do humans (300,000 years) fall?', answer: '0.3 m = 30 cm from the start.' },
        { task: 'How many years between Jobaria (135 million years ago) and the big extinction (66 million years ago)?', answer: '135 − 66 = 69 million years.' },
        { task: 'How many times older is the big extinction (66 million years) than our species (300,000 years)?', answer: '66,000,000 ÷ 300,000 = 220 times older.' },
      ],
      support: ['Use a shorter scale, such as 1 cm for every million years on a long paper strip.'],
      stretch: ['Choose another scale and recalculate the positions. Explain why a good scale makes the numbers easy to compare.'],
      localise: ['If you cannot lay out 150 m, use a hallway with a scale of 1 cm per million years and mark the main events.', 'Keep the walk away from roads.'],
      discoveryStatus: {
        whatWeKnow: ['Non-bird dinosaurs died out about 66 million years ago after an asteroid impact.', 'Birds are descended from theropod dinosaurs and are living dinosaurs.', 'Jobaria, a plant-eating dinosaur, lived in what is now Niger about 135 million years ago.'],
        whatWeAreStillDiscovering: ['Which dinosaurs lived in different parts of Africa, because large areas have been explored very little.', 'How different groups of dinosaurs lived and moved.'],
      },
      investigation: {
        title: 'The deep-time rope',
        materials: ['A 150 m rope or measuring tape (or a long paper strip)', 'Markers, stones or sticky notes', 'Event cards'],
        steps: ['Decide the scale: 1 m for 1 million years.', 'Mark today at the start.', 'Place markers for Homo sapiens (30 cm), the Lake Bosumtwi crater (about 1.07 m), the big extinction (66 m) and Jobaria (135 m).', 'Walk the rope and talk about what you notice.'],
        safetyNote: 'Do the walk in a safe area away from traffic and in the shade if possible.',
        whatToNotice: 'People appear in the very first step, and dinosaurs are far away in time.',
      },
      factCheck: [
        { claim: 'Jobaria tiguidensis, a plant-eating sauropod, lived in what is now Niger about 135 million years ago; about 50 specimens were found at one site.', explanation: 'From Penn State’s Earth 105 course page on African geology.', reference: 'Penn State EARTH 105, “Africa Geologic History and Paleontology”.' },
        { claim: 'The first Spinosaurus fossils were found in Egypt in 1912 and destroyed in a 1944 bombing raid.', explanation: 'From the same course page. Later discoveries may have added new material.', reference: 'Penn State EARTH 105; check recent literature.' },
        { claim: 'About 66 million years ago an asteroid impact led to the extinction of all dinosaurs except birds, and birds descended from theropod dinosaurs.', explanation: 'Standard palaeontology, not verified from a named page in this session.', reference: 'Natural History Museum (London) or Smithsonian resources (to verify).' },
      ],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-lake-that-fell-from-the-sky',
    title: 'The Lake That Fell From the Sky',
    summary: 'Edem and Afrakoma stand on the rim of Lake Bosumtwi and ask why it is so round. They test three explanations against the evidence, learn how glass beads in Côte d’Ivoire point back to Ghana, and finish with a list of what is known and still unknown.',
    classIds: ['primary-6', 'jhs-1'],
    ageMin: 11,
    ageMax: 13,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['science', 'mystery', 'educational'],
    themes: ['night-sky', 'community', 'citizenship'],
    objectives: ['scientific-curiosity', 'critical-thinking', 'reasoning', 'respect', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Curious and clear, with room for the numbers',
    palette: ['#0369a1', '#b45309'],
    voice: 'Curious, respectful voice; the guide speaks softly and calmly',
    characters: [
      'Edem: a 12-year-old boy in a white shirt and navy shorts, with a notebook.',
      'Afrakoma: a 12-year-old girl in a yellow blouse and navy skirt with a calm, sharp look.',
      'Mr Danso: their teacher, in a khaki shirt, with a hat and a clipboard.',
      'The guide: an older local man in a simple cloth, who asks visitors to speak softly near the lake.',
    ],
    music: 'Soft lake sounds with a slow flute and a distant drum (placeholder)',
    pages: [
      pg('🏞️', 'Edem and Afrakoma stood on the rim of Lake Bosumtwi in the Ashanti Region, looking down at a lake that was almost perfectly round. ‘Nature does not usually draw circles,’ said Afrakoma. ‘Most lakes look like potatoes.’ Many Ashanti people regard the lake as sacred, so their guide asked them to speak softly and show respect.', 'Two students stand on the rim of a round lake in green hills with a guide.'),
      pg('🤔', 'Mr Danso asked just one question: ‘If you wanted to explain a round lake, what ideas could you test?’ They wrote three: an old volcano, a very large sinkhole, or something striking the ground from space.', 'The students write three ideas in a notebook with a teacher listening.'),
      pg('📝', 'They checked each idea against the clues. A volcano would leave lava and ash, but geologists did not find them. A sinkhole more than ten kilometres wide would be unlike any ordinary sinkhole. That left an impact.', 'Two students tick and cross ideas on a list with the lake behind them.'),
      pg('🔭', 'Scientists first suggested an impact in 1931. Later studies found rocks changed by sudden extreme pressure and heat, and tiny pieces of space rock mixed into the crater rocks. ‘That is evidence,’ said Edem. ‘A crater is a bowl-shaped hole made when something hits the ground.’', 'A diagram of a space rock hitting the ground and making a bowl-shaped crater.'),
      pg('💎', 'Mr Danso added a surprise: glass beads called tektites, found in Côte d’Ivoire, match the lake’s age and chemistry. They are melted rock thrown out by the impact. Tiny ones have even been found in mud from the seabed off West Africa. ‘So the impact scattered material across the region!’ said Afrakoma.', 'A map of West Africa with small glass beads marked in Côte d’Ivoire and offshore.'),
      pg('⏳', 'How old is the crater? About 1.07 million years. Edem did the sums. ‘Homo sapiens are about 300,000 years old, so the crater is 770,000 years older than our species. And the dinosaurs were long gone.’', 'Edem writes dates on a timeline with a lake sketch.'),
      pg('📐', 'They checked the size: the crater rim is about 10.5 km across, and the lake about 8.5 km. Afrakoma worked out the lake’s area if it were a perfect circle: radius 4.25 km, so 3.14 × 4.25 × 4.25 is about 56.7 square kilometres. ‘A hole dug in minutes,’ she said, ‘that has held water for a very long time.’', 'Afrakoma calculates on a notebook page beside a drawing of a circle.'),
      pg('📓', 'On the way home Edem drew three columns: What we know, What we think, What we are still asking. Under still asking he wrote: What was life like in this forest before the impact? What can the mud at the bottom of the lake still tell us? The best way to respect the lake, they agreed, was to keep asking questions and leave it as they found it. The end.', 'A notebook with three columns held by Edem as the sun sets over the lake.'),
    ],
    activities: [
      { id: 'lake-c1', type: 'comprehension', afterPage: 3, question: 'Why did the children set aside the volcano idea?', options: ['Geologists did not find lava or ash to match it', 'The lake is too small', 'Volcanoes are never round'], correctIndex: 0 },
      { id: 'lake-p1', type: 'prediction', afterPage: 3, prompt: 'If a space rock really hit here, what kinds of clues might scientists look for in the rocks?', options: ['Rocks changed by sudden heat and pressure', 'Dinosaur footprints', 'Lava flows'] },
      { id: 'lake-c2', type: 'comprehension', afterPage: 4, question: 'How do tektites in Côte d’Ivoire link back to the lake?', options: ['Their age and chemistry match the Bosumtwi impact', 'They look like jewellery', 'They fell from a volcano'], correctIndex: 0 },
      { id: 'lake-voc', type: 'vocabulary', afterPage: 4, word: 'crater', definition: 'A bowl-shaped hole in the ground, often made by something hitting it.', distractors: ['A very tall mountain', 'A type of river'] },
      { id: 'lake-c3', type: 'comprehension', afterPage: 6, question: 'About how much older is the crater than our species (1.07 million years versus about 300,000 years)?', options: ['770,000 years', '1.37 million years', '300,000 years'], correctIndex: 0, explanation: '1,070,000 − 300,000 = 770,000.' },
      { id: 'lake-s1', type: 'sequencing', afterPage: 8, prompt: 'Put the children’s reasoning in order.', items: ['Notice that the lake is almost perfectly round.', 'List possible explanations.', 'Check each idea against the evidence.', 'Write what is known and what is still unknown.'] },
      { id: 'lake-sel', type: 'sel', afterPage: 8, prompt: 'The guide asked the children to show respect at a sacred place. How do you show respect when you explore places that matter to others?', feelingOptions: ['Respectful', 'Curious', 'Humble', 'Amazed'] },
    ],
    glossary: [
      { word: 'sacred', definition: 'Holy or deeply important to a community.', pages: [1] },
      { word: 'evidence', definition: 'Facts or clues that help show what is true.', pages: [4] },
      { word: 'crater', definition: 'A bowl-shaped hole in the ground, often made by something hitting it.', pages: [4, 7] },
      { word: 'tektites', definition: 'Small pieces of natural glass made when an impact melts rock and throws it out.', pages: [5] },
    ],
    culturalNotes: ['Lake Bosumtwi is of deep spiritual importance to many Ashanti people, and visitors are often asked to show respect. The story does not describe specific beliefs or rituals; invite local guardians and teachers to share them.', 'Lake Bosumtwi is listed as a geoheritage site by the International Union of Geological Sciences (IUGS); confirm local details with the Ghana Geological Survey Authority.'],
    reviewQuestions: ['Check with a geologist: “no lava or ash found”, tektite distribution and the 1931 and later studies.', 'Check the cultural statement “many Ashanti people regard the lake as sacred” with a local authority.', 'Is it clear that the children are making a simplified comparison of explanations, not repeating the full scientific debate?'],
    guide: {
      overview: 'A story about weighing explanations against evidence. Learners see how a hypothesis is tested, how clues far away (glass beads, seabed mud) connect to a place at home, and how scientific knowledge sits beside cultural respect.',
      lessonMinutes: 50,
      goals: ['Compare explanations against evidence.', 'Explain what a crater and tektites are.', 'Calculate with large and small numbers, including the area of a circle.'],
      subjects: [['Integrated Science', 'Earth science and evidence'], ['Mathematics', 'Area of a circle, large numbers'], ['Social Studies', 'Heritage and respect']],
      before: ['Ask: why do you think this lake is round?'],
      during: ['At page 3, ask learners which evidence would support each idea.'],
      after: ['Make a model crater: drop a marble into a tray of flour covered with cocoa powder (outdoors, with care) and compare crater shapes.', 'Write a “what we know, think, and are asking” table.'],
      discussion: ['Why were the children careful to compare ideas rather than choose their favourite?', 'How do the glass beads connect different places?'],
      reflection: ['What respectful questions could you ask a community elder about a local landmark?'],
      maths: [
        { task: 'The lake is about 8.5 km across. What is its radius?', answer: '8.5 ÷ 2 = 4.25 km.' },
        { task: 'Using π ≈ 3.14, find the area of a circle with a radius of 4.25 km.', answer: '3.14 × 4.25 × 4.25 = 56.7 km², to one decimal place.' },
        { task: 'How much older is the crater (1.07 million years) than the arrival of Homo sapiens (about 300,000 years)?', answer: '1,070,000 − 300,000 = 770,000 years.' },
        { task: 'The extinction of non-bird dinosaurs was about 66 million years ago. About how many times older is that than the crater?', answer: '66 ÷ 1.07 ≈ 62 times.' },
      ],
      support: ['Give a simple table to list each idea and the evidence for and against.'],
      stretch: ['Research why scientists find impact craters hard to spot on Earth and write a short explanation.'],
      localise: ['Involve the local community, school and traditional authorities in any visit; follow all site rules and customs.', 'Do not climb into or disturb the lake area.'],
      discoveryStatus: {
        whatWeKnow: ['Lake Bosumtwi fills a crater about 10.5 km across that formed about 1.07 million years ago.', 'The crater is linked to the Ivory Coast tektite field; tiny glass beads have also been found in seabed cores off West Africa.', 'The impact origin was first suggested in 1931 and later confirmed by shocked rocks and traces of meteorite material.'],
        whatWeAreStillDiscovering: ['Details of how life and climate in the region changed over time, which lake mud can reveal.', 'More about the exact events of the impact.'],
      },
      investigation: {
        title: 'Make a model crater',
        materials: ['A tray or box', 'Flour', 'Cocoa powder', 'Marbles or small stones', 'A ruler', 'Safety glasses (optional)'],
        steps: ['Fill the tray with 3 cm of flour and dust the top with cocoa powder.', 'Drop a marble from 30 cm and measure the crater.', 'Drop again from 60 cm and compare.', 'Record the size and shape of each crater.'],
        safetyNote: 'Do this outdoors or on a covered table. Avoid breathing in flour dust and keep children from throwing the marbles.',
        whatToNotice: 'Higher drops make bigger, deeper craters; craters are round even when the object comes in at an angle (unless very low).',
      },
      factCheck: [
        { claim: 'Lake Bosumtwi is in a crater about 1.07 million years old, with a rim diameter of about 10.5 km and a lake diameter of about 8.5 km.', explanation: 'From the IUGS Geoheritage Sites description of the lake.', reference: 'IUGS Geoheritage, “Lake Bosumtwi Impact Crater”.' },
        { claim: 'The impact origin was first suggested in 1931; later studies found shocked minerals and meteoritic material; the crater is the source of the Ivory Coast tektite strewn field, with microtektites in deep-sea cores off West Africa.', explanation: 'From the same IUGS description.', reference: 'IUGS Geoheritage, “Lake Bosumtwi Impact Crater”.' },
        { claim: 'Many Ashanti people regard Lake Bosumtwi as sacred.', explanation: 'Widely reported; not verified from a named page in this session. The IUGS page mentions local spiritual interest.', reference: 'Ask a local authority or cultural expert to confirm.' },
      ],
    },
  }),
];
