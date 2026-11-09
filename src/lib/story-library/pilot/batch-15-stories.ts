/**
 * Batch 15: five more mystery stories: the Kryptos sculpture (a coded message whose last part is still secret) and four
 * Ghana heritage mysteries (the Golden Stool, Larabanga Mosque, the Tafi Atome monkeys, Akan gold weights).
 *
 * Rules: as Batches 13 and 14. Dates that sources disagree on, or that rest on tradition, are shown as claims
 * ("people say", "one source says") and never as settled facts. Sacred subjects (the Golden Stool, a mosque, sacred
 * monkeys) are told with respect, from published accounts, and are flagged for review by the communities concerned.
 * Children are told never to touch, copy or photograph sacred objects without permission. All stories are drafts
 * awaiting review.
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

export const BATCH_15_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-sculpture-that-keeps-a-secret',
    title: 'The Sculpture That Keeps a Secret',
    summary: 'Hajara and Kelvin learn about Kryptos, a curved copper sculpture outside the CIA headquarters in the United States. Three of its four coded messages were solved. The last one, K4, held out for decades, and even now the public still cannot read it.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['mystery', 'informational', 'educational'],
    themes: ['technology', 'school', 'leadership'],
    objectives: ['critical-thinking', 'problem-solving', 'reasoning', 'perseverance'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 130,
    paceWord: 'Crisp and intriguing, slowing at the clues',
    palette: ['#334155', '#b45309'],
    voice: 'Crisp, intrigued storyteller voice; Mr Asiedu is precise and dry',
    characters: [
      'Hajara: a 14-year-old girl in a school uniform with a headscarf, holding a pencil and graph paper.',
      'Kelvin: her classmate, 14, in a white shirt, with a calculator.',
      'Mr Asiedu: their ICT and maths teacher, in a grey shirt, with a projector remote.',
      'Kryptos: a tall, curved sheet of copper covered with cut-out letters, standing in a courtyard with a pond, rocks and a small tree.',
      'Jim Sanborn: the artist, in a work coat, standing beside the sculpture (story picture).',
    ],
    music: 'Slow, precise piano with a ticking clock, rising when clues are revealed (placeholder)',
    pages: [
      pg('🪞', 'Mr Asiedu showed the class a photograph of a tall, curved sheet of copper covered in cut-out letters. “This sculpture is called Kryptos,” he said. “It stands in the grounds of the CIA headquarters in Virginia, in the United States. The letters look like nonsense. Almost all of them are a secret message.”', 'A teacher shows a photograph of a curved copper sculpture covered in letters.'),
      pg('🧑🎨', '“An artist named Jim Sanborn made it, and it was dedicated in 1990,” said Mr Asiedu. “He worked with a retired code expert called Edward Scheidt. The sculpture carries four coded messages, totalling 869 characters. Scientists call the four parts K1, K2, K3 and K4.” Kelvin did the sum on his calculator. “K4 has 97 letters. That is about 11 percent.”', 'A student calculates a fraction on a calculator beside a drawing of the four sections.'),
      pg('🔓', '“K1, K2 and K3 have been solved,” said Mr Asiedu. “A team at the National Security Agency in the early 1990s solved them, but that was kept secret for years. A CIA analyst solved them in 1998. And in 1999, a computer scientist named Jim Gillogly announced the first public solutions.” Hajara wrote: three solved, three different teams.', 'A timeline shows three solutions by different people over several years.'),
      pg('🧱', '“And K4?” asked Hajara. “K4 stayed unsolved for more than thirty years,” said Mr Asiedu. “Hundreds of thousands of people tried. It starts with the letters O-B-K-R and has only 97 letters. That is not much to work with. That is why some codes are harder: less text gives fewer patterns to spot.”', 'A row of 97 letters on a board, with the first four circled.'),
      pg('💡', '“Over the years, the artist released clues,” said Mr Asiedu. “Certain letters in K4 stand for the word BERLIN. Others stand for CLOCK, then NORTHEAST, then EAST. Each clue was a small window into the plaintext, the hidden message. But even with the clues, nobody could prove a full solution.”', 'Four clue words appear on cards: BERLIN, CLOCK, NORTHEAST, EAST.'),
      pg('📰', '“Then, in 2025, things changed,” said Mr Asiedu. “The artist announced he would auction his K4 solution. Two journalists, Jarett Kobek and Richard Byrne, looked through his papers in a public archive at the Smithsonian. They said they found scraps that revealed the hidden text, and they sent it to the artist, who confirmed it was accurate.”', 'Two people look through boxes in an archive while a letter is passed to an artist.'),
      pg('💰', '“The K4 solution was sold at auction for $962,500 to a buyer who has not been named,” said Mr Asiedu. “The journalists promised not to publish the text. So the public still cannot read K4, and some cryptographers say we still need to see the method, not only the answer. And there may be a fifth message to come.”', 'A gavel and an envelope marked Sold, with a locked box beside them.'),
      pg('✅', 'Kelvin thought for a moment. “So it is solved and not solved at the same time,” he said. “Solved by the artist, and perhaps by two journalists. Unsolved for everyone else.” “And proven?” asked Mr Asiedu. “Not independently,” said Hajara. “A good answer needs a method anyone can check.” “That,” said Mr Asiedu, “is the heart of cryptography.” The end.', 'Two students at the board with a column labelled Known and a column labelled Open.'),
    ],
    activities: [
      { id: 'kryp-c1', type: 'comprehension', afterPage: 3, question: 'How many of Kryptos’s four coded sections were solved by the 1990s?', options: ['Three (K1, K2 and K3)', 'All four', 'None'], correctIndex: 0 },
      { id: 'kryp-p1', type: 'prediction', afterPage: 5, prompt: 'The artist released clue words from K4. How could clues help a codebreaker?', options: ['They show part of the hidden message, so the method can be tested', 'They make the code impossible', 'They change the sculpture'] },
      { id: 'kryp-c2', type: 'comprehension', afterPage: 7, question: 'Why do some experts say the answer alone is not enough?', options: ['They want to see the method so anyone can check it', 'They dislike sculptures', 'They think the text is too long'], correctIndex: 0 },
      { id: 'kryp-voc', type: 'vocabulary', afterPage: 5, word: 'plaintext', definition: 'The ordinary, readable message before it is turned into a code.', distractors: ['A kind of metal', 'A type of key'] },
      { id: 'kryp-s1', type: 'sequencing', prompt: 'Put the Kryptos story in order.', items: ['Kryptos was dedicated in 1990.', 'K1 to K3 were solved by different people.', 'The artist released clues about K4.', 'K4’s hidden text was sold at auction in 2025.'] },
      { id: 'kryp-sel', type: 'sel', afterPage: 8, prompt: 'People worked on K4 for decades without success. What keeps you going when a problem is very hard?', feelingOptions: ['Determined', 'Frustrated', 'Curious', 'Patient'] },
    ],
    glossary: [
      { word: 'plaintext', definition: 'The readable message before it is turned into a code.', pages: [5] },
      { word: 'cryptography', definition: 'The study of making and breaking secret codes.', pages: [8] },
      { word: 'auction', definition: 'A sale where people bid, and the highest bidder buys the item.', pages: [6] },
      { word: 'archive', definition: 'A place that keeps important documents and records.', pages: [6] },
    ],
    culturalNotes: ['Kryptos is in the United States. The pupils and teacher are invented. Ghanaian pupils can connect it to local codes, such as drum language and symbols whose meaning is known to those who hold the key.', 'The story separates three things clearly: what is known, what is claimed, and what has been independently proven.'],
    reviewQuestions: ['Check against named sources: Kryptos dedicated 1990 at CIA headquarters; 869 characters; K4 has 97 letters; NSA team solved K1 to K3 by mid-1993; CIA analyst in 1998; Gillogly’s public solution in 1999; clue words BERLIN, CLOCK, NORTHEAST, EAST; 2025 auction; sale price $962,500.', 'Status could change: the K4 text may be published or independently verified after this story was written. Review before release.', 'The “more than thirty years” and “hundreds of thousands of people” are loose; confirm or soften.'],
    guide: {
      overview: 'A “solved but not shared” mystery that teaches the difference between a claimed solution, a confirmed answer and a verified method. It also shows how clues and partial solutions work in codebreaking.',
      lessonMinutes: 50,
      goals: ['Explain what plaintext and ciphertext are.', 'Compare “solved”, “claimed” and “verified”.', 'Calculate proportions from real numbers.'],
      subjects: [['Mathematics', 'Fractions, percentages and patterns'], ['ICT', 'Codes and security'], ['English Language', 'Reading for evidence']],
      before: ['Ask: how do you know someone has really solved a puzzle?'],
      during: ['At page 2, check the percentage calculation (97 ÷ 869).'],
      after: ['Write a short coded message with a key and challenge a partner to decode it.', 'Debate: should a solution be published if someone buys it?'],
      discussion: ['Why does a method matter as much as an answer?', 'Why can less text make a code harder?'],
      reflection: ['What would you want to keep secret, and for how long?'],
      maths: [
        { task: 'Kryptos has 869 characters and K4 has 97. What percentage is K4? (nearest whole number)', answer: '97 ÷ 869 ≈ 0.112, so about 11%.' },
        { task: 'The K4 solution sold for $962,500. If the presale estimate was $300,000 to $500,000, how much above the top estimate was the sale?', answer: '$962,500 − $500,000 = $462,500.' },
        { task: 'K1 to K3 total 869 − 97 characters. How many characters is that?', answer: '772 characters.' },
      ],
      support: ['Provide a simple substitution cipher to practise with.'],
      stretch: ['Research the difference between a substitution cipher and a transposition cipher and describe how each might hide a message.'],
      localise: ['Link to local ways of passing hidden or symbolic messages.', 'Use the story to talk about honesty: never claim to have solved something without showing your working.'],
      discoveryStatus: {
        whatWeKnow: ['K1, K2 and K3 have been solved and published.', 'The artist confirmed a K4 solution that two journalists say they found in archived papers; it was sold at auction in 2025.', 'Some letters of K4 were revealed as BERLIN, CLOCK, NORTHEAST and EAST.'],
        whatWeAreStillDiscovering: ['The full K4 text and the method, as far as the public is concerned.', 'Whether an independent solver can reproduce the answer without the archived papers.', 'What the promised fifth message says.'],
      },
      factCheck: [
        { claim: 'Kryptos is a copper sculpture by Jim Sanborn, installed in 1990 on the grounds of CIA headquarters in Virginia, with four encrypted messages totalling 869 characters; K4 has 97 letters.', explanation: 'From Scientific American.', reference: 'Scientific American, “A Solution to the CIA’s Kryptos Code Is Found after 35 Years.”' },
        { claim: 'K1 to K3 were solved by an NSA team (by June 1993), a CIA analyst (1998) and Jim Gillogly (public, 1999); K4 clues BERLIN, CLOCK, NORTHEAST and EAST were released between 2010 and 2020; in 2025 the K4 solution was sold at auction.', explanation: 'From Wikipedia’s Kryptos article.', reference: 'Wikipedia, “Kryptos”.' },
        { claim: 'The K4 archive, including the solution, sold for $962,500 to an anonymous bidder in November 2025; the journalists promised not to publish the text.', explanation: 'From Artnet News.', reference: 'Artnet News, “Secret Code to the CIA’s Enigmatic ‘Kryptos’ Sculpture Sells for Nearly $1 Million at Auction.”' },
      ],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-stool-from-the-sky',
    title: 'The Stool from the Sky',
    summary: 'In Kumasi, Kyeiwaa and Yeboah ask their teacher about the Golden Stool of the Asante. They learn what the Asante believe about it, what historians can record, and why some questions are not for outsiders to answer.',
    classIds: ['primary-5', 'primary-6', 'jhs-1'],
    ageMin: 10,
    ageMax: 13,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['cultural', 'historical', 'mystery'],
    themes: ['identity', 'citizenship', 'leadership'],
    objectives: ['cultural-heritage', 'respect', 'critical-thinking', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Respectful and slow, with weight on the sacred parts',
    palette: ['#a16207', '#7f1d1d'],
    voice: 'Respectful, measured storyteller voice; Madam Amponsah is warm and firm',
    characters: [
      'Kyeiwaa: a 12-year-old girl in a school uniform with braids, holding a notebook.',
      'Yeboah: her classmate, 12, in a white shirt and brown shorts.',
      'Madam Amponsah: their history teacher, in a kente-print blouse, holding a book.',
      'The Golden Stool: drawn only as a respectful illustration of a carved golden seat resting on its own cloth, never on the ground (story picture).',
      'Yaa Asantewaa: an Asante queen mother in royal cloth, standing tall with warriors behind her (story picture).',
    ],
    music: 'Slow, solemn drums with a soft horn, rising proudly for Yaa Asantewaa (placeholder)',
    pages: [
      pg('🪑', 'In their classroom in Kumasi, Madam Amponsah held up a book. “Today we talk about something sacred to the Asante,” she said. “We will speak with respect. This is the Golden Stool, Sika Dwa Kofi. I will tell you what the Asante believe, and what historians can record. Some questions belong to the Asante to answer.”', 'A teacher holds up a book at the front of a Kumasi classroom.'),
      pg('🛡️', '“The Asante believe the Stool holds the soul of the nation,” said Madam Amponsah. “Nobody sits on it. It never touches the ground; it rests on its own seat. When a new Asantehene, the Asante king, is installed, he is lowered and raised over it without touching it.” Kyeiwaa wrote: sacred, not a chair.', 'A student writes in her notebook while the teacher describes the stool’s meaning.'),
      pg('🌩️', '“Here is the story of its origin,” said Madam Amponsah. “Okomfo Anokye, a great priest and one of the founders of the Asante union, called the Stool down from the sky. It is said to have settled beside the first Asantehene, Osei Tutu. It is told as an oral tradition, a story passed down by the Asante.”', 'A priest raises his arms as a golden stool descends from a cloudy sky.'),
      pg('❓', '“So what is the mystery?” asked Yeboah. Madam Amponsah thought carefully. “A historian can study how the Stool is used, what people say about it and what has happened to it. A historian cannot test whether it came from the sky. That belongs to belief and tradition. We do not call it false because we cannot test it, and we do not call it a scientific fact either.”', 'A teacher stands between two boards labelled Tradition and Evidence.'),
      pg('⚔️', '“In 1900, the British governor, Sir Frederick Hodgson, demanded to sit on the Stool,” said Madam Amponsah. “To the Asante, that was a deep insult.” Kyeiwaa gasped. “What happened?” “A queen mother named Yaa Asantewaa called on the Asante leaders to defend it. A war followed, and she is remembered as a brave leader.”', 'A queen mother stands tall with warriors, in an illustration of a historical scene.'),
      pg('🤫', '“The Stool was hidden,” said Madam Amponsah, “and the British did not capture it. Later, they promised not to interfere with it, and it has remained in use for the installation of Asante kings.” Yeboah frowned. “Where is it now?” “That is not for us to know or to ask,” she said. “Sacred things are protected, and part of the protection is silence.”', 'A closed door with a golden light behind it, drawn respectfully.'),
      pg('🤔', 'Kyeiwaa raised her hand. “So some of the story is recorded history, and some is tradition?” “Yes,” said Madam Amponsah. “Recorded: the events of 1900, the leadership of Yaa Asantewaa and the Stool’s continuing role. Tradition: how it came to the Asante. Open for outsiders to ask: a few details, if the Asante choose to share them.”', 'A chart with Recorded, Tradition and Not ours to ask.'),
      pg('✅', 'At the end, Madam Amponsah wrote one rule: Some things are for learning about, not for copying. “Never imitate sacred ceremonies, touch sacred objects or take photographs without permission,” she said. Yeboah nodded. “We can honour it by understanding why it matters,” he said. Kyeiwaa smiled. “And by listening to the people who keep it.” The end.', 'A class listening as the teacher points to a respectful rule on the board.'),
    ],
    activities: [
      { id: 'stool-c1', type: 'comprehension', afterPage: 2, question: 'What do the Asante believe the Golden Stool holds?', options: ['The soul of the nation', 'Gold coins', 'The king’s lunch'], correctIndex: 0 },
      { id: 'stool-p1', type: 'prediction', afterPage: 4, prompt: 'The governor demanded to sit on the Stool. How do you think the Asante felt?', options: ['It was a deep insult', 'They were happy', 'They did not notice'] },
      { id: 'stool-c2', type: 'comprehension', afterPage: 6, question: 'What can a historian not test, according to Madam Amponsah?', options: ['Whether the Stool came from the sky', 'Whether there was a war in 1900', 'Whether Yaa Asantewaa led people'], correctIndex: 0 },
      { id: 'stool-voc', type: 'vocabulary', afterPage: 3, word: 'tradition', definition: 'A belief or story passed down from one generation to the next.', distractors: ['A kind of weapon', 'A type of cloth'] },
      { id: 'stool-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The Stool is said to have descended and settled by the first Asantehene.', 'The governor demanded to sit on the Stool.', 'Yaa Asantewaa called leaders to defend it.', 'The Stool stayed hidden and remained in use.'] },
      { id: 'stool-sel', type: 'sel', afterPage: 8, prompt: 'Some things are sacred and not for everyone to touch or ask about. How do you show respect for something that matters deeply to others?', feelingOptions: ['Respectful', 'Curious', 'Humble', 'Proud'] },
    ],
    glossary: [
      { word: 'Asantehene', definition: 'The king of the Asante people.', pages: [2] },
      { word: 'tradition', definition: 'A belief or story passed down over generations.', pages: [4] },
      { word: 'sacred', definition: 'Very special and holy, deserving great respect.', pages: [1] },
      { word: 'historian', definition: 'A person who studies the past.', pages: [4] },
    ],
    culturalNotes: ['The Golden Stool is sacred to the Asante. This story is told in the voice of a teacher who respects the Asante and uses only publicly available accounts. The pupils and teacher are invented.', 'The story shows that some questions are properly answered by the community that holds the tradition and not by outsiders.'],
    reviewQuestions: ['Before publishing, have this story reviewed by Asante cultural authorities or knowledgeable Asante educators, and follow their guidance on wording, spelling (including “Sika Dwa Kofi”), and what should not be said.', 'Check against named sources: the origin tradition (Okomfo Anokye, Osei Tutu), the 1900 events with Governor Hodgson and Yaa Asantewaa, the Stool being hidden and not captured by the British.', 'The story deliberately does not say where the Stool is kept; keep it that way.'],
    guide: {
      overview: 'A cultural mystery about the line between tradition and history. It teaches respect for sacred objects and shows how historians can record events without testing every belief.',
      lessonMinutes: 45,
      goals: ['Explain the difference between tradition and recorded history.', 'Describe why the Golden Stool matters to the Asante.', 'Explain how to show respect for sacred objects.'],
      subjects: [['Social Studies / History', 'Asante history and leadership'], ['Religious and Moral Education', 'Respect for sacred things'], ['English Language', 'Fact and tradition']],
      before: ['Ask: what object or place in your family or community is treated with special respect?'],
      during: ['At page 4, ask learners to list what historians can and cannot test.'],
      after: ['Invite an Asante elder or cultural officer to speak (with the school’s permission).', 'Research Yaa Asantewaa’s role in history.'],
      discussion: ['Why was sitting on the Stool such an insult?', 'Why is silence part of protecting sacred things?'],
      reflection: ['What would you want others to respect about your culture?'],
      maths: [{ task: 'From 1900 to 2026 is how many years?', answer: '126 years.' }],
      support: ['Provide a three-part chart: Recorded / Tradition / Not ours to ask.'],
      stretch: ['Write a short essay on why a nation’s symbols matter.'],
      localise: ['Use local symbols and sacred places; follow local protocols for speaking about them.', 'Never draw or model the Golden Stool as a toy or in a disrespectful way.'],
      discoveryStatus: {
        whatWeKnow: ['The Stool is central to Asante kingship.', 'The 1900 conflict was connected to British demands about the Stool.'],
        whatWeAreStillDiscovering: ['Matters the Asante keep as their own tradition, which historians cannot test.'],
      },
      factCheck: [{ claim: 'Asante tradition says Okomfo Anokye brought the Stool down from the sky to Osei Tutu; the Stool is believed to house the soul of the nation; it never touches the ground; in 1900 Governor Hodgson demanded to sit on it, leading to a rebellion led by Yaa Asantewaa; the Stool was hidden and not captured by the British.', explanation: 'From BlackPast’s entry on the Golden Stool, which itself reports casualty figures without citation, so those figures were not used.', reference: 'BlackPast, “The Golden Stool (17th c.-)”; check also scholarly histories of the Asante and Asante cultural authorities.' }],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-mosque-built-in-a-dream',
    title: 'The Mosque Built in a Dream',
    summary: 'Mariama and Abdul-Rahman visit Larabanga with their teacher. They hear the story of a trader whose dream is said to have led to a mosque, ask how old the building really is, and find out why cement nearly destroyed a mud masterpiece.',
    classIds: ['primary-5', 'primary-6', 'jhs-1'],
    ageMin: 10,
    ageMax: 13,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['mystery', 'historical', 'cultural'],
    themes: ['community', 'identity', 'technology'],
    objectives: ['cultural-heritage', 'critical-thinking', 'scientific-curiosity', 'respect'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 120,
    paceWord: 'Warm and clear, with a hush for the dream',
    palette: ['#a16207', '#fef3c7'],
    voice: 'Warm, clear storyteller voice; Alhaji Seidu is gentle and deep',
    characters: [
      'Mariama: a 12-year-old girl in a school uniform and headscarf, holding a notebook.',
      'Abdul-Rahman: her classmate, 12, in a white shirt and a white cap, with a small sketchbook.',
      'Mr Iddrisu: their teacher, in a long shirt, with a camera he keeps in his bag.',
      'Alhaji Seidu: an elder of Larabanga, about 70, in a white robe and cap, with prayer beads.',
      'Larabanga Mosque: a small whitewashed earth mosque with two pyramid-shaped towers and many buttresses, under a wide blue sky.',
    ],
    music: 'Soft northern strings and a gentle drum, with a hushed, reverent moment for the dream (placeholder)',
    pages: [
      pg('🕌', 'On a school trip to northern Ghana, Mariama and Abdul-Rahman stopped in the village of Larabanga, near Mole National Park. A small whitewashed mosque stood before them, with two pyramid-shaped towers and strong buttresses along its walls. “It looks like a sandcastle that grew up,” said Abdul-Rahman.', 'Two students and a teacher look at a small whitewashed mud mosque with two towers.'),
      pg('🧱', 'Mr Iddrisu explained. “It is built in the Sudanic style, of adobe, which is mud and clay, with wooden supports. It is about eight metres by eight metres, with twelve buttresses holding the walls. It is a place of worship, so we visit only as the community allows.” Alhaji Seidu greeted them with a smile.', 'An elder welcomes visitors outside the mud mosque.'),
      pg('💭', '“Let me tell you how the people of Larabanga tell it,” said Alhaji Seidu. “A trader named Ayuba was travelling and rested near a mystic stone. He dreamed that he must build a mosque there. When he woke, the foundations were already laid. And so he built.” Mariama listened without writing. “Thank you for trusting us with the story,” she said.', 'A trader sleeps near a stone as a faint glow marks foundations on the ground.'),
      pg('📅', '“When was this?” asked Abdul-Rahman. “People say about six hundred years ago, in the fifteenth century,” said Alhaji Seidu. Mr Iddrisu added, “One source gives the year 1421, but it ties the date to this tradition, not to a written record we could find. So a historian would ask: how could we check it?” Mariama wrote: written records, dating materials, other buildings.', 'A student writes three ways to check a date: written records, dating materials, other buildings.'),
      pg('📖', '“There is another story,” said Alhaji Seidu softly. “Local people believe that a Quran was sent from heaven to the imam of that time, in answer to his prayers. This is a matter of faith for us.” Mr Iddrisu nodded. “We record what the community says, with respect, and we do not need to prove or disprove it.”', 'A respectful picture of an old book resting on a cloth in a quiet room.'),
      pg('⚠️', '“Now, a different mystery, a science one,” said Mr Iddrisu. “In the 1970s, people covered the mud walls with sand and cement to protect them. It seemed a good idea. But cement is not breathable like mud, and it trapped moisture inside the walls. Termites then ate the wooden supports, and part of the mosque collapsed.”', 'A cross-section of a wall shows trapped moisture and termites in wooden beams.'),
      pg('⛈️', '“Then, in September 2002, a severe storm destroyed the mihrab, the niche that shows the direction of prayer, and the minaret, the tower,” said Mr Iddrisu. “The World Monuments Fund helped, and the Ghana Museums and Monuments Board led a restoration with advice from experts in earth building. They replaced the timber and re-plastered the walls the traditional way, with mud.”', 'Workers re-plaster a mosque wall with mud while a storm-damaged tower is rebuilt.'),
      pg('✅', 'Before leaving, Mariama wrote three lists. Told: the dream and the Quran, as the community tells them. Not confirmed in our source: the exact date. Learned: that a well-meant repair can harm a building if we do not understand its materials. “Tradition and science can sit together,” said Abdul-Rahman. “If we ask carefully.” Alhaji Seidu smiled. The end.', 'Two students show a notebook with three lists to an elder in front of the mosque.'),
    ],
    activities: [
      { id: 'lara-c1', type: 'comprehension', afterPage: 3, question: 'What is the Larabanga Mosque mostly built from?', options: ['Adobe, which is mud and clay, with wooden supports', 'Steel', 'Glass'], correctIndex: 0 },
      { id: 'lara-p1', type: 'prediction', afterPage: 5, prompt: 'The mud walls were covered with cement. What do you think could happen to moisture in the walls?', options: ['It could get trapped and damage the building', 'It would disappear', 'It would make the wall stronger'] },
      { id: 'lara-c2', type: 'comprehension', afterPage: 6, question: 'Why did part of the mosque collapse after the cement was added?', options: ['Trapped moisture and termites damaged the wooden supports', 'It was too tall', 'Nobody prayed there'], correctIndex: 0 },
      { id: 'lara-voc', type: 'vocabulary', afterPage: 2, word: 'adobe', definition: 'A building material made of mud and clay, often dried in the sun.', distractors: ['A type of stone', 'A kind of paint'] },
      { id: 'lara-s1', type: 'sequencing', prompt: 'Put the mosque’s story in order.', items: ['A trader dreams of building a mosque.', 'The mosque is built of mud and wood.', 'A cement coating traps moisture and the building is damaged.', 'The mosque is restored the traditional way.'] },
      { id: 'lara-sel', type: 'sel', afterPage: 8, prompt: 'A well-meant repair did harm. When have you tried to help and learned that you needed to understand more first?', feelingOptions: ['Thoughtful', 'Humble', 'Curious', 'Determined'] },
    ],
    glossary: [
      { word: 'adobe', definition: 'A building material made of mud and clay.', pages: [2] },
      { word: 'buttresses', definition: 'Supports built against a wall to make it stronger.', pages: [1] },
      { word: 'termites', definition: 'Small insects that eat wood.', pages: [6] },
      { word: 'minaret', definition: 'A tall tower attached to a mosque.', pages: [7] },
    ],
    culturalNotes: ['Larabanga Mosque is a real place of worship in the Savannah Region of Ghana. The children, teacher and Alhaji Seidu are invented. Visitors should follow the community’s guidance.', 'The story reports the community’s traditions with respect and shows that a date can rest on tradition even when no written record is available.'],
    reviewQuestions: ['Have the Larabanga community or the Ghana Museums and Monuments Board review the story, especially the account of Ayuba, the Quran tradition and how “about six hundred years ago” is phrased.', 'Check the facts against a named source: size about 8 m by 8 m, twelve buttresses, 1970s cement damage, September 2002 storm, restoration with expert advice and World Monuments Fund support.', 'The story avoids giving 1421 as fact; confirm if any scholarly source offers a different date.'],
    guide: {
      overview: 'A heritage mystery with two layers: a date known only through tradition, and a science puzzle about why cement damaged a mud building. It teaches respect and evidence together.',
      lessonMinutes: 45,
      goals: ['Describe how earthen buildings work and why materials matter.', 'Explain the difference between a tradition and a documented date.', 'Describe respectful behaviour at a place of worship.'],
      subjects: [['Integrated Science', 'Materials and moisture'], ['Social Studies / History', 'Heritage and evidence'], ['Religious and Moral Education', 'Respect for places of worship']],
      before: ['Ask: why do some old mud buildings last for centuries?'],
      during: ['At page 6, ask learners to explain why cement and mud do not mix well.'],
      after: ['Build two mud-brick samples, coat one with cement or plastic, and discuss which dries better (adult supervision).', 'Interview a community elder about a building they care about, with permission.'],
      discussion: ['What are different ways to check a date?', 'How should visitors behave at a mosque?'],
      reflection: ['What building in your community deserves care?'],
      maths: [{ task: 'The mosque measures about 8 m by 8 m. What is its floor area?', answer: '8 × 8 = 64 square metres.' }, { task: 'If a legend says a building is 600 years old, in what century was it built? (Use 2026.)', answer: '2026 − 600 = 1426, so about the 15th century.' }],
      support: ['Provide a labelled diagram of the mosque and its parts.'],
      stretch: ['Compare earth, cement and stone as building materials, listing pros and cons for a hot, dry climate.'],
      localise: ['Visit only with permission and follow local guidance on dress, shoes and photography.', 'Do not treat the building as a tourist toy; it is a living place of worship.'],
      discoveryStatus: {
        whatWeKnow: ['The mosque is built of adobe and timber in the Sudanic style.', 'A cement coating in the 1970s trapped moisture and the building was damaged; it was restored traditionally.'],
        whatWeAreStillDiscovering: ['The documented date of the first building, since the date we found rests on tradition.'],
      },
      factCheck: [{ claim: 'Larabanga Mosque is in West Gonja District, Savannah Region; it is Sudanic-style adobe about 8 m by 8 m with two pyramid-shaped towers and twelve buttresses; the founding story concerns the trader Ayuba’s dream; a date of 1421 appears but rests on tradition; a Quran is said by local belief to have been sent in 1650; 1970s cement coating trapped moisture; a storm in September 2002 destroyed the mihrab and minaret; the restoration was led by the Ghana Museums and Monuments Board with CRAterre’s advice and World Monuments Fund support.', explanation: 'From Wikipedia’s article on Larabanga Mosque; the dates 1421 and 1650 are treated as tradition.', reference: 'Wikipedia, “Larabanga Mosque”; confirm with the Ghana Museums and Monuments Board.' }],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-monkeys-who-followed-the-ancestors',
    title: 'The Monkeys Who Followed the Ancestors',
    summary: 'In the Volta Region, Mawuena and Kafu visit a forest where mona monkeys are treated as sacred. They hear how the villagers say the monkeys arrived, and learn how an old belief protected a forest, and how the whole village later worked to save it.',
    classIds: ['primary-3', 'primary-4', 'primary-5'],
    ageMin: 8,
    ageMax: 11,
    readingLevel: 'fluent',
    difficulty: 3,
    genres: ['cultural', 'nature', 'mystery'],
    themes: ['animals-and-habitats', 'community', 'citizenship'],
    objectives: ['cultural-heritage', 'respect', 'scientific-curiosity', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 115,
    paceWord: 'Warm and lively, hushed in the forest',
    palette: ['#15803d', '#92400e'],
    voice: 'Warm, lively storyteller voice; Mr Agbeko is cheerful and respectful',
    characters: [
      'Mawuena: a 10-year-old girl in a school uniform with a yellow ribbon, holding a notebook.',
      'Kafu: her brother, 9, in a blue T-shirt and shorts, holding a water bottle.',
      'Mr Agbeko: a village guide, in a green shirt and a cap, with a walking stick.',
      'Mona monkeys: medium-sized brown monkeys with pale throats and long tails, sitting calmly on branches.',
      'The sacred grove: a patch of thick green forest beside the village, with tall trees and winding paths.',
    ],
    music: 'Forest birdsong and a lively Ewe drum rhythm, gentle in the grove (placeholder)',
    pages: [
      pg('🌳', 'Mawuena and her brother Kafu followed their guide, Mr Agbeko, into a patch of forest beside the village of Tafi Atome in the Volta Region. “This is a sacred grove,” he said, “about twenty-eight hectares of forest. In it live our mona monkeys. Please stay on the path, and listen to my instructions.”', 'Two children and a guide enter a green forest grove on a path.'),
      pg('🐒', 'High in the trees, brown monkeys with pale throats swung and chattered. “Mona monkeys,” whispered Kafu. “Here, we treat them as sacred,” said Mr Agbeko. “We do not hunt them, and we do not harm them. Please do not touch them; wild monkeys can bite, and we want them to stay wild.”', 'Mona monkeys sit on branches above two children and a guide.'),
      pg('🧳', '“How did they come to be sacred?” asked Mawuena. Mr Agbeko smiled. “Our people say our ancestors came here about two hundred years ago from a place called Assini. They carried an idol, which they placed in the forest. Soon afterwards, villagers saw monkeys they believed had followed them. The monkeys became seen as representatives of the gods.”', 'Travellers carry a bundle through a forest while monkeys watch from the trees.'),
      pg('❓', '“So is it true that the monkeys followed them?” asked Kafu. “That is what the village tells,” said Mr Agbeko. “Nobody can check it with a written record. A scientist might ask other questions: how did the monkeys live here before, and how many came? But for the village, the story is part of who we are.”', 'A boy asks a question with a speech bubble that has a question mark.'),
      pg('🔍', 'Mawuena thought about it. “Whether or not we can prove how the monkeys arrived,” she said, “the belief did something real. It kept people from hunting them and cutting the forest.” “Exactly,” said Mr Agbeko. “A belief can protect nature.” Kafu wrote: belief + care = protection.', 'A girl writes a note with an arrow from belief to a healthy forest.'),
      pg('📉', '“But the protection began to weaken,” said Mr Agbeko. “In the 1980s, some people began to farm and cut trees in the grove. By 1995, the forest was found to be damaged.” Mawuena looked up at the canopy. “What did the village do?” “They talked,” said Mr Agbeko. “And they decided to act together.”', 'A map shows farms creeping towards the grove with some trees cut.'),
      pg('🤝', '“In 1996, the community began a project with a conservation group,” said Mr Agbeko. “They planted trees around the edge, built a welcome centre, and trained guides like me. Visitors pay, and the money goes to community needs, such as schools, and to the people who gave up farmland for the sanctuary.” Kafu counted his sandals. “So the forest earns its keep!”', 'Villagers plant young trees along the edge of the forest.'),
      pg('✅', 'At the end of the walk, Mawuena wrote: Told by the village: the monkeys followed the ancestors. Known: the grove shelters mona monkeys, and the village works to protect it. Open: where the monkeys really came from. “Some questions have more than one kind of answer,” said Mr Agbeko, “and one of them is care.” The end.', 'Two children and a guide look back at the sacred grove with monkeys in the trees.'),
    ],
    activities: [
      { id: 'tafi-c1', type: 'comprehension', afterPage: 3, question: 'How do the villagers say the monkeys came to Tafi Atome?', options: ['They followed the ancestors from Assini', 'They came from the sea', 'They were brought by a trader on a boat'], correctIndex: 0 },
      { id: 'tafi-p1', type: 'prediction', afterPage: 5, prompt: 'The grove started to be damaged. What could help save it?', options: ['The community working together to protect and replant it', 'Cutting more trees', 'Moving the monkeys away'] },
      { id: 'tafi-c2', type: 'comprehension', afterPage: 6, question: 'How does tourism help the village, according to Mr Agbeko?', options: ['The money goes to community needs and landowners who gave up farmland', 'It makes the monkeys leave', 'It pays for the guide to travel abroad'], correctIndex: 0 },
      { id: 'tafi-voc', type: 'vocabulary', afterPage: 1, word: 'sacred', definition: 'Very special and holy, deserving great respect.', distractors: ['Very noisy', 'Very small'] },
      { id: 'tafi-s1', type: 'sequencing', prompt: 'Put the story of the grove in order.', items: ['The ancestors came with an idol.', 'Monkeys were seen in the forest and treated as sacred.', 'The forest became damaged.', 'The community started to protect and replant it.'] },
      { id: 'tafi-sel', type: 'sel', afterPage: 8, prompt: 'A belief helped protect a forest. What traditions in your community help protect people or nature?', feelingOptions: ['Proud', 'Thankful', 'Curious', 'Caring'] },
    ],
    glossary: [
      { word: 'sacred', definition: 'Very special and holy, deserving great respect.', pages: [1] },
      { word: 'grove', definition: 'A small patch of forest or trees.', pages: [1] },
      { word: 'ancestors', definition: 'People in a family or community who lived long ago.', pages: [3] },
      { word: 'sanctuary', definition: 'A protected place where animals are kept safe.', pages: [7] },
    ],
    culturalNotes: ['Tafi Atome is a real village in the Hohoe District of the Volta Region; its mona monkeys are protected in a sacred grove. The children and Mr Agbeko are invented. The village’s own account of the monkeys’ arrival is presented as the village’s account.', 'The story shows how a belief and a community project together helped protect nature, without saying the belief is a scientific explanation.'],
    reviewQuestions: ['Have the Tafi Atome community, chief and guides review the account (Assini, the idol, the monkeys following) and the wording of “representatives of the gods”.', 'Check against a named source: about 28 hectares; mona monkeys (Cercopithecus mona mona); about 200 years since the ancestors arrived; forest degraded by 1995; community ecotourism from 1996.', 'The date of the decline of traditional protection is given as the 1980s in one source and is vague; consider softening to “in later years”.'],
    guide: {
      overview: 'A cultural-ecology story: an origin tradition that cannot be tested, a belief that really protected a forest, and a community project that renewed that protection.',
      lessonMinutes: 40,
      goals: ['Explain how monkeys depend on forests.', 'Describe how a belief can protect nature.', 'Describe why visitors must follow guides and not touch wild animals.'],
      subjects: [['Integrated Science', 'Habitats and conservation'], ['Social Studies', 'Community action'], ['Religious and Moral Education', 'Respect for sacred places']],
      before: ['Ask: what animals or trees are treated with special respect in your community, and why?'],
      during: ['At page 5, ask learners to explain how belief protected the forest.'],
      after: ['Plant a tree or start a small school garden with community permission.', 'Interview an elder about a protected place or animal in your area.'],
      discussion: ['How does a belief protect nature?', 'Why was community action needed?'],
      reflection: ['What would you protect in your community?'],
      maths: [{ task: 'The grove is about 28 hectares. If a school football pitch is about 1 hectare, how many pitches would fit?', answer: 'About 28 pitches.' }, { task: 'The ecotourism project began in 1996. How many years ago is that? (Use 2026.)', answer: '30 years.' }],
      support: ['Provide pictures of mona monkeys and a map of Volta Region.'],
      stretch: ['Compare how two communities protect forests: one through belief and one through law.'],
      localise: ['Follow the local guide’s rules; do not feed or touch wild monkeys; wash hands after any visit to animals.', 'Respect the grove as a sacred place.'],
      discoveryStatus: {
        whatWeKnow: ['The sacred grove shelters mona monkeys and is protected by the community.', 'A community ecotourism project began in 1996.'],
        whatWeAreStillDiscovering: ['How and when the monkeys first came to the grove, since the village’s account is oral and cannot be checked in writing.'],
      },
      factCheck: [{ claim: 'Tafi Atome (Hohoe District, Volta Region) has a sacred grove of about 28 hectares protecting mona monkeys; residents say their ancestors migrated about 200 years ago from Assini with an idol and that monkeys followed them; the forest was found degraded in 1995; a community ecotourism project began in 1996 with the Nature Conservation Research Centre.', explanation: 'From the Sacred Natural Sites Initiative page on Tafi Atome.', reference: 'Sacred Natural Sites Initiative, “Community-based ecotourism at Tafi Atome Monkey Sanctuary, Ghana.”' }],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-weights-that-whisper-proverbs',
    title: 'The Weights That Whisper Proverbs',
    summary: 'Kukua and Kwarteng visit a museum of tiny brass figures that the Akan used to weigh gold dust. Some figures are sets of lines and spirals nobody can fully read. Others may whisper proverbs. They ask what the weights were for, and what they might still be saying.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 11,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['mystery', 'historical', 'cultural'],
    themes: ['money-and-enterprise', 'identity', 'community'],
    objectives: ['cultural-heritage', 'critical-thinking', 'reasoning', 'vocabulary'],
    ghanaianContext: 'central',
    culturalTags: ['proverb', 'local-names'],
    wpm: 125,
    paceWord: 'Curious and measured, with a smile for the proverbs',
    palette: ['#a16207', '#1e3a8a'],
    voice: 'Curious, measured storyteller voice; Mrs Konadu is warm and playful',
    characters: [
      'Kukua: a 12-year-old girl in a school uniform with a yellow headband, holding a magnifying glass.',
      'Kwarteng: her classmate, 12, in a white shirt and blue shorts, with a small kitchen scale from home in his bag.',
      'Mrs Konadu: the museum curator, in a patterned dress and glasses, wearing white gloves.',
      'The weights: small brass objects shaped like birds, fish, stools, swords and spirals, laid on a velvet tray with a tiny balance.',
      'A goldsmith: an Akan trader in a cloth, pouring gold dust onto a balance (story picture).',
    ],
    music: 'Tinkling brass sounds with a playful flute and a steady drum (placeholder)',
    pages: [
      pg('⚖️', 'In a museum, Mrs Konadu laid a velvet tray in front of Kukua and Kwarteng. On it sat dozens of tiny brass figures: a bird, a fish, a stool, a crocodile, a spiral. “These are Akan goldweights,” she said. “People used them to weigh gold dust, which was long a main form of money in the region.”', 'A curator shows a tray of tiny brass figures to two students.'),
      pg('🔥', '“How were they made?” asked Kwarteng. “By the lost-wax method,” said Mrs Konadu. “A model is made from beeswax and covered in clay. The wax is melted out, leaving a hollow. Then molten brass is poured in. When it cools, the clay is broken away.” “So each one is unique,” said Kukua. “Yes. The wax model is destroyed every time.”', 'Four small pictures show wax modelling, clay covering, pouring brass and breaking the mould.'),
      pg('🔶', '“Brass is an alloy of copper and zinc,” said Mrs Konadu. “Museum records tell us there are two main kinds of weights. The oldest are geometric: spirals, lines and circles. They are dated to about the fifteenth century. Later came figurative weights, shaped like animals, people and objects, from about the year 1600.” Kukua wrote: abstract first, figures later.', 'Two trays: one with geometric patterns, one with animals and objects.'),
      pg('🧮', 'Kwarteng took out his small kitchen scale. “How did they weigh?” “With a balance and a set of weights,” said Mrs Konadu. “Some geometric weights follow the Arab unit called the mithqal, about 4.6 grams. Europeans later brought other units, like the ackie. People often added tiny pieces of lead to adjust a weight to the standard.” Kwarteng did a sum: “So three mithqal would weigh about 13.8 grams.”', 'A small balance with a weight on one side and gold dust on the other.'),
      pg('🗣️', '“Now here is where it gets interesting,” said Mrs Konadu. “Many of the figurative pieces may not have been weights at all. Some historians think they were objects that carried proverbs, rules and judgments. A crocodile with two heads and one stomach, for example, might remind people that we share one stomach, so we should work together.” Kukua grinned. “A proverb you can hold!”', 'A crocodile with two heads and one stomach on a velvet tray.'),
      pg('❓', '“And the geometric ones?” asked Kukua. “That is the mystery,” said Mrs Konadu. “Many of their patterns look like adinkra stamps and the decorations on shrines, and may link to proverbs. But the meaning of most of the geometric designs is unknown. Some may have marked specific weights. Perhaps some patterns were a kind of code.”', 'A row of geometric designs with question marks beside each.'),
      pg('🔍', 'Kukua studied a spiral through her magnifying glass. “How could we find out what the patterns mean?” “By comparing many weights, by collecting oral history from families who kept them, by studying records from traders, and by asking whether the same pattern always matches the same weight,” said Mrs Konadu. “Every new clue helps.”', 'A girl with a magnifying glass studies a spiral weight.'),
      pg('✅', 'At the end, Kwarteng and Kukua made a list. Known: the weights were cast in brass and used in trade. Debated: whether the figures were weights, proverbs or both. Unknown: what most geometric patterns mean. “So the weights are small,” said Kwarteng, “but the questions are big.” Mrs Konadu smiled. “That,” she said, “is why we keep them safe.” The end.', 'Two students and a curator stand by a display case with a list on a card.'),
    ],
    activities: [
      { id: 'weight-c1', type: 'comprehension', afterPage: 3, question: 'What were most Akan goldweights made of?', options: ['Brass', 'Wood', 'Gold'], correctIndex: 0 },
      { id: 'weight-p1', type: 'prediction', afterPage: 4, prompt: 'Why would people add tiny pieces of lead to a weight?', options: ['To adjust it to the right standard weight', 'To make it shinier', 'To make it float'] },
      { id: 'weight-c2', type: 'comprehension', afterPage: 6, question: 'What is still unknown about the geometric weights?', options: ['The meaning of most of their patterns', 'Whether they are made of brass', 'Whether they were used in trade'], correctIndex: 0 },
      { id: 'weight-voc', type: 'vocabulary', afterPage: 3, word: 'alloy', definition: 'A metal made by mixing two or more metals, such as brass.', distractors: ['A kind of gold dust', 'A type of balance'] },
      { id: 'weight-s1', type: 'sequencing', prompt: 'Put the lost-wax method in order.', items: ['Make a model from beeswax.', 'Cover the model with clay.', 'Melt out the wax.', 'Pour in molten brass.'] },
      { id: 'weight-sel', type: 'sel', afterPage: 8, prompt: 'Some of the patterns still have no known meaning. How do you feel about a secret that may never be solved?', feelingOptions: ['Curious', 'Patient', 'Excited', 'Wondering'] },
    ],
    glossary: [
      { word: 'goldweights', definition: 'Small brass objects the Akan used to weigh gold dust.', pages: [1] },
      { word: 'alloy', definition: 'A metal made by mixing two or more metals.', pages: [3] },
      { word: 'geometric', definition: 'Made of shapes such as lines, circles and spirals.', pages: [3] },
      { word: 'proverbs', definition: 'Short sayings that carry wisdom.', pages: [5] },
    ],
    culturalNotes: ['Akan goldweights are real objects found in museums around the world. The children, Mrs Konadu and the museum are invented. Adinkra symbols and proverbs are living Akan traditions; pupils should learn them from the communities who keep them.', 'The story presents museum scholarship and says plainly that much remains unknown, including whether the figurative pieces were mainly weights or reminders of proverbs.'],
    reviewQuestions: ['Check against a named source: almost all brass; lost-wax casting; geometric weights dated to the 1400s and figurative weights from around 1600; mithqal about 4.6 g; ackie introduced by Europeans; recent scholarship suggesting figurative pieces may not have been weights.', 'The “crocodile with two heads and one stomach” proverb is a well-known Akan image in general knowledge; confirm its wording and meaning with an Akan proverb scholar before publishing.', 'Dates are from a museum page and are given as “about”; the story does not treat them as exact.'],
    guide: {
      overview: 'A cultural-historical mystery about small objects: how they were made, how they were used, and what their patterns might mean. It links maths (weighing) with language (proverbs) and shows that meaning can be lost over time.',
      lessonMinutes: 45,
      goals: ['Explain the lost-wax method in simple steps.', 'Describe how a balance and weights work.', 'Discuss why some meanings are lost and how we might recover them.'],
      subjects: [['Mathematics', 'Mass and measurement'], ['Creative Arts', 'Casting and design'], ['Social Studies / History', 'Trade and culture']],
      before: ['Ask: how would you weigh something small without a modern scale?'],
      during: ['At page 4, ask learners to do the mithqal sum.'],
      after: ['Make wax or clay models of proverb figures and write the proverb on a label.', 'Invite an elder to explain a proverb or adinkra symbol.'],
      discussion: ['Why might a proverb be shaped as an object?', 'What could help us decode a pattern?'],
      reflection: ['What proverb would you shape into an object?'],
      maths: [{ task: 'One mithqal is about 4.6 g. How many grams are 3 mithqal?', answer: '3 × 4.6 = 13.8 g.' }, { task: 'A weight of 23 g is how many mithqal?', answer: '23 ÷ 4.6 = 5 mithqal.' }, { task: 'If a trader adds 0.4 g of lead to a 4.2 g weight, what is the new weight?', answer: '4.6 g.' }],
      support: ['Provide pictures of the weights and a simple balance to try.'],
      stretch: ['Choose an adinkra symbol or proverb and explain how you could turn it into a weight design.'],
      localise: ['Use local proverbs and invite elders to explain them.', 'Do not copy sacred shrine designs; learn about them from the communities who hold them.'],
      discoveryStatus: {
        whatWeKnow: ['The weights were cast in brass by the lost-wax method and used in trade, with gold dust as a major currency.', 'Geometric weights are older and figurative weights came later.'],
        whatWeAreStillDiscovering: ['What most geometric patterns mean.', 'How many figurative pieces were weights and how many were reminders of proverbs.'],
      },
      factCheck: [{ claim: 'Almost all Akan goldweights are brass, cast by the lost-wax method; geometric weights date to the 1400s and figurative weights appear around 1600; recent scholarship suggests geometric weights mainly weighed gold dust and that many figurative pieces may have embodied proverbs; some followed the Arab mithqal (about 4.6 g); the meaning of most geometric designs is unknown.', explanation: 'From The Metropolitan Museum of Art’s collection page on a stool gold weight.', reference: 'The Metropolitan Museum of Art, “Stool gold weight” (metmuseum.org/art/collection/search/317686).' }],
    },
  }),
];

