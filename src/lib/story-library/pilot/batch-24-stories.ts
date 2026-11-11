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
 * Batch 24: Another way to earn. Eight stories on livelihoods for young people and families caught up in illegal mining
 * and low-income work: how small-scale miners can pool resources and apply for a licence as a group (Ghana's rules and
 * the cooperative programme), what Peru, Tanzania and Ecuador show about formalisation, post-harvest storage (hermetic
 * bags, cool chambers), a solar cold room in a Nigerian market, youth and modern farming, the farm-to-market chain
 * (with Rwanda's coffee cooperatives), the Anand milk cooperative in India, and low-capital businesses (beekeeping and
 * village savings groups).
 *
 * Rules: as Batches 13 to 23. All students, teachers and families are invented. Figures come from the cited sources
 * with their years; uncertain or self-reported figures are labelled and hypothetical numbers are marked "suppose".
 * Success stories are shown with their limits. No story presents a business as a guaranteed income. Every story ends
 * with something a young person can do and an English skill in BECE / NaCCA style. All stories are drafts awaiting
 * review.
 */

export const BATCH_24_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-six-who-pooled',
    title: 'Six Men and One Licence',
    summary: 'Doris’s Uncle Opare and five friends dig small pits alone, afraid of every officer who passes. Her social studies teacher explains how small-scale miners can apply for a licence as a group, what the cooperative programme promises, and why gold must be sold to licensed buyers. Doris helps write a full formal letter asking the Minerals Commission for guidance. A story about turning fear into a plan, with a formal letter in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'educational', 'drama'],
    themes: ['community', 'money-and-enterprise', 'citizenship', 'family'],
    objectives: ['citizenship', 'responsibility', 'teamwork', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 118,
    paceWord: 'Steady and hopeful, slowing for the legal steps and the letter',
    palette: ['#92400e', '#0f766e'],
    voice: 'Thoughtful girl’s voice for Doris; a tired but hopeful voice for Uncle Opare; a clear teacher’s voice for Mr Nunoo',
    characters: [
      'Doris Dwomoh: a 14-year-old girl in a school uniform, carrying an exercise book.',
      'Uncle Opare: a lean man in his forties in a faded shirt and rubber boots, hands rough from digging.',
      'Mr Nunoo: the social studies teacher, in a shirt and tie, holding a printed copy of a law.',
      'Five miners: five men of different ages sitting on a bench outside a house, with a notebook between them.',
    ],
    music: 'Slow, warm highlife guitar with a steady drum; a lifting tune at the group meeting (placeholder)',
    pages: [
      pg('⛏️', 'Doris’s Uncle Opare lived in a mining town and dug for gold with five friends. Each of them worked his own small pit. When a vehicle came down the road, they scattered. “We are not thieves,” Uncle Opare told her at the house one evening. “We are hungry men with no papers.” Doris looked at his rough hands. “Uncle, why do you not work as one group?” she asked. He laughed sadly. “Because the paper is too hard,” he said.', 'A girl and her uncle sit outside a house at dusk, with rubber boots by the door.'),
      pg('📜', 'The next day, Doris asked her social studies teacher, Mr Nunoo, about the paper. “Good question,” he said. “Under the Minerals and Mining Act, 2006, a person needs a small-scale mining licence. The land is limited to twenty-five acres. According to a legal guide, the applicant must be a Ghanaian citizen of at least eighteen years, registered with the Minerals Commission’s district office. Licences may also go to cooperatives. A cooperative is a group that owns a business together.”', 'A teacher holds up a printed law beside a map with a small square marked on it.'),
      pg('📋', '“How does it work?” she asked. Mr Nunoo counted on his fingers. “The applicant goes to the district office of the Minerals Commission. The application is sent on and published in the gazette, the official government notice. Chiefs and traditional authorities are told and can give their views. The Minister decides. A first licence lasts up to five years. But fees, forms and rules change, and the guide does not list every document, so always ask the district office. It will also tell you about other approvals, such as environmental ones.”', 'A teacher shows a flow chart of steps from a district office to a government notice board.'),
      pg('🤝', '“Is there help for groups?” asked Doris. “In August 2025,” said Mr Nunoo, “Cabinet approved a programme called rCOMSDEP, the Responsible Cooperative Mining and Skills Development Programme. According to the Ministry of Lands and Natural Resources, it promotes locally owned mining cooperatives, with legal concessions, training and shared processing centres with modern gold recovery and water treatment. It also plans to phase out mercury and restore land. But the published pages do not say how to join, so ask.”', 'A teacher points to a poster of a shared processing centre with clean water tanks.'),
      pg('⚖️', '“And the gold?” asked Doris. “Selling is also governed by law,” said Mr Nunoo. “Under the Gold Board Act, 2025, buying, selling or exporting gold needs a licence from the Ghana Gold Board, and doing so without one is an offence. The Board buys gold from miners who are not large-scale. So a group should sell only to licensed buyers or to the Board itself. It is safer, and it leaves a record that a bank may one day ask to see.”', 'A teacher writes the words licensed buyer on the board beside a scale and a receipt book.'),
      pg('✉️', 'That evening, Doris helped her uncle write a formal letter. At the top right she wrote his address, House 12, Dunkwa Road, Akim Oda, and below it the date, 14th March, 2027. On the left: The District Officer, Minerals Commission, District Office, Akim Oda. “Dear Sir,” it began, and the heading read: REQUEST FOR GUIDANCE ON APPLYING FOR A SMALL-SCALE MINING LICENCE AS A GROUP. The body read: “I am writing on behalf of six small-scale miners who wish to work lawfully as one group. Firstly, we would like to know the documents and steps required. Secondly, we would like to know whether a cooperative programme is open to us. We shall be grateful for your kind guidance.” He ended with “Yours faithfully,” signed, and wrote his full name, Kwabena Opare.', 'A girl and her uncle write a formal letter at a table, with an address and date at the top.'),
      pg('👥', 'The six men met on the bench outside the house and wrote rules in a notebook. One would be treasurer and keep every pesewa in a record. One would be safety officer. They would put some money together for helmets, boots and a water pump. They would never use children in the pits, and they would find out how to stop using mercury. “It may take months,” Uncle Opare warned. “And we may be refused.” Doris nodded. “But now you are one group with a plan, Uncle, not six men hiding,” she said.', 'Six men sit on a bench around a notebook while a girl points to a list of rules.'),
      pg('✅', 'Exam-safe tip: this is a full formal letter. It has the writer’s address, the date, the recipient’s designation and full address, “Dear Sir”, a heading, “Yours faithfully”, a signature and the writer’s full name. The body is polite and clear, gives two reasons and uses no contractions or slang. Remember that the law and the fees may change, so a real application should follow the district office’s current instructions. Check the eight features before you hand in a formal letter. The end.', 'A girl and her uncle read the letter with a tick beside each of eight features.'),
    ],
    activities: [
      { id: 'six-c1', type: 'comprehension', afterPage: 3, question: 'How long can a first small-scale mining licence last, according to the guide?', options: ['Up to five years', 'One week', 'For life'], correctIndex: 0 },
      { id: 'six-p1', type: 'prediction', afterPage: 5, prompt: 'Why should a mining group sell gold only to licensed buyers?', options: ['It is lawful and leaves a record', 'It is always faster', 'It avoids all rules'] },
      { id: 'six-c2', type: 'comprehension', afterPage: 8, question: 'Which closing words go with “Dear Sir” in a formal letter?', options: ['Yours faithfully', 'Yours ever', 'Bye for now'], correctIndex: 0 },
      { id: 'six-voc', type: 'vocabulary', afterPage: 4, word: 'cooperative', definition: 'A group of people who own and run a business together.', distractors: ['A kind of tax', 'A type of machine'] },
      { id: 'six-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Doris asks why the miners do not work as one group.', 'Mr Nunoo explains the licence and the cooperative programme.', 'Doris and her uncle write a formal letter.', 'The six men write rules for their group.'] },
      { id: 'six-sel', type: 'sel', afterPage: 8, prompt: 'Fear can turn into a plan when people work together. How do you feel?', feelingOptions: ['Hopeful', 'Determined', 'Careful', 'Proud'] },
    ],
    glossary: [
      { word: 'licence', definition: 'Official permission to do something that the law controls.', pages: [2, 3] },
      { word: 'cooperative', definition: 'A group of people who own and run a business together.', pages: [2, 4] },
      { word: 'gazette', definition: 'The official government notice in which new rules and applications are published.', pages: [3] },
      { word: 'mercury', definition: 'A poisonous liquid metal sometimes used to catch gold.', pages: [4, 7] },
      { word: 'treasurer', definition: 'The person who keeps a group’s money and records.', pages: [7] },
    ],
    culturalNotes: ['Doris, Uncle Opare, Mr Nunoo and the five miners are invented, and the town and letter address are invented. The story does not say or suggest that miners are bad people; many take risks because there are few other jobs, and the story treats Uncle Opare with dignity. Children are never shown in or near a pit.', 'Facts from published sources: a legal guide to small-scale licences says the applicant must be a Ghanaian citizen of at least 18 and registered with the Minerals Commission district office, that licences may go to cooperatives and companies, that the application is published in the gazette and chiefs are notified, and that the first term is up to five years; the Minerals Commission’s guide says small-scale operations cover up to 25 acres under section 82 of Act 703; the Gold Board Act, 2025 (Act 1140) makes gold trading without a licence an offence and sets the Gold Board as buyer from miners who are not large-scale; Cabinet approved rCOMSDEP in August 2025 to promote cooperatives with concessions, training and shared processing centres.', 'The published pages do not say how cooperatives are formed or who qualifies, so the story tells readers to ask. Rules and fees change; the story is not legal advice.'],
    reviewQuestions: ['Have an officer of the Minerals Commission or a mining lawyer check the licence steps, the 25-acre and five-year figures and the eligibility statement against Act 703 and its amendments, because the legal guide was a summary.', 'Check whether the Gold Board Act’s provisions on sales by small-scale miners and its penalties are described correctly, and whether regulations have been issued.', 'Check that the formal letter meets the eight-feature rubric and that the story does not encourage anyone to start mining without a licence.'],
    guide: {
      overview: 'A story about small-scale miners who decide to work as one group within the law. It explains the licence steps, the cooperative programme and the sale of gold in plain language and models a full formal letter.',
      lessonMinutes: 50,
      goals: ['Describe the main steps for a group to apply for a small-scale mining licence.', 'Explain why a record of money and sales matters.', 'Write a formal letter with all eight features.'],
      subjects: [['Social Studies', 'Law, citizenship and mining'], ['Integrated Science', 'Mercury and health'], ['English Language', 'Formal letter writing']],
      before: ['Ask: why might a person work in a risky job without permission? What would help them change?'],
      during: ['At page 3, ask learners to say the steps in order without looking.', 'At page 6, count the eight letter features aloud.'],
      after: ['Write a formal letter to a district office asking for information about a service in your area.', 'Draw a flow chart of the licence steps.'],
      discussion: ['Why might six miners find a group stronger than six separate pits?', 'What risks remain even after forming a group?'],
      reflection: ['Is there a problem in your family or class that a group could solve better than one person?'],
      maths: [
        { task: 'Suppose six members each give GH¢50 to buy shared safety equipment. How much is the pool?', answer: '6 × 50 = GH¢300.' },
        { task: 'A treasurer records that the group spent GH¢120 of the GH¢300. What fraction is left?', answer: '180 out of 300 = 3/5.' },
      ],
      support: ['Give a letter frame with eight labelled boxes: writer’s address, date, recipient’s designation and address, salutation, heading, body, subscription, signature and full name.'],
      stretch: ['Write a second letter, from a district officer replying to the group, using the same eight features.'],
      localise: ['Invite an officer from the Minerals Commission district office or a licensed mining cooperative member (with a teacher present) to explain the current steps; do not teach the steps as final without checking.'],
      factCheck: [
        { claim: 'A small-scale mining licence in Ghana requires the applicant to be a Ghanaian citizen of at least 18 years registered with the Minerals Commission district office; licences may go to cooperatives and companies; the application is published in the gazette and chiefs are notified; the first term is up to five years.', explanation: 'From a legal guide to acquiring a small-scale mining licence; fees and documents were not listed.', reference: 'Mondaq, “How to acquire a small scale mining licence in Ghana” (mondaq.com). Verify with the Minerals Commission.' },
        { claim: 'Small-scale operations cover land up to 25 acres and require a licence under section 82 of the Minerals and Mining Act, 2006 (Act 703).', explanation: 'From the Minerals Commission’s guide to mineral rights.', reference: 'Minerals Commission, “Types of Mineral Rights and Acquisition Procedure” (mincom.gov.gh).' },
        { claim: 'The Gold Board Act, 2025 makes the Ghana Gold Board the sole authority to buy, sell, weigh, grade, assay, value and export gold, requires others in gold trading to hold a licence, and makes unlicensed gold business an offence; the Board buys gold from miners who are not large-scale.', explanation: 'From a legal summary of Act 1140; implementing regulations may have been issued since.', reference: 'Mondaq, “Ghana enacts the Gold Board Act 2025 (Act 1140)” (mondaq.com).' },
        { claim: 'Cabinet approved the Responsible Cooperative Mining and Skills Development Programme (rCOMSDEP) in August 2025, giving cooperatives legal concessions, training and access to centralised processing facilities, with a plan to phase out mercury and restore degraded land; the pages give no figures and do not say how cooperatives qualify.', explanation: 'From a news report based on a Ministry press release and from the ministry’s page for the programme.', reference: 'Class FM, “Cabinet approves novel cooperative mining and skills programme” (4 August 2025); Ministry of Lands and Natural Resources, rCOMSDEP page (mlnr.gov.gh).' },
      ],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'a-map-of-lessons',
    title: 'A Map of Lessons',
    summary: 'Selikem asks whether any country has solved illegal small-scale mining. His teacher hangs a world map and shows what Peru, Tanzania, Ecuador and Mongolia tried, with what worked and what failed. Selikem learns that nobody has a perfect answer, writes a balanced argument about whether Ghana should make licences cheaper and quicker, and learns to borrow lessons, not copy them. A story with an argumentative paragraph in exam-safe English.',
    classIds: ['jhs-2', 'jhs-3'],
    ageMin: 13,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['educational', 'informational', 'realistic-fiction'],
    themes: ['citizenship', 'community', 'school', 'money-and-enterprise'],
    objectives: ['critical-thinking', 'reasoning', 'author-purpose', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 118,
    paceWord: 'Clear and measured, with a little drama at each country on the map',
    palette: ['#1e3a8a', '#b45309'],
    voice: 'Curious boy’s voice for Selikem; a calm, fair-minded voice for Mr Tsikata',
    characters: [
      'Selikem Adzaho: a 14-year-old boy in a school uniform, with a notebook and a pencil behind his ear.',
      'Mr Tsikata: the geography teacher, in a shirt with rolled sleeves, pointing at a large world map.',
      'The world map: a classroom wall map with four countries marked by coloured pins.',
    ],
    music: 'Light, inquisitive kora with soft percussion; a thoughtful tune at the final paragraph (placeholder)',
    pages: [
      pg('🗺️', 'Selikem’s cousin worked in a small-scale gold mine and had been chased from a pit twice. “Sir,” Selikem asked his geography teacher, Mr Tsikata, “has any country fixed this problem?” Mr Tsikata unrolled a world map and pinned four countries. “No country has fixed it completely,” he said. “But some have tried sensible things, and some have stumbled. Let us learn from both.”', 'A boy asks a question in class while a teacher pins four countries on a world map.'),
      pg('🇵🇪', '“Peru, in South America,” said Mr Tsikata. “In 2002, Peru passed a law for small and artisanal miners. It gave clear groups, lower fees, simpler environmental permits and a path to become legal. A 2012 study called the best cases the most successful it had seen. But the study also found problems. The government never gave the support it promised. Small miners had to dig a minimum amount each year. And they were not allowed to hire each other.”', 'A teacher points to Peru on a map beside a sketch of a law book and a gold scale.'),
      pg('🏅', '“There was a bright spot,” Mr Tsikata continued. “A Peruvian miners’ cooperative called SOTRAMI won a Fairmined label. Fairmined means the gold was mined responsibly, and buyers pay extra. The study listed benefits such as legal status, social security and ten to fifteen per cent more money. But the study is from 2012, so the figures may be different today.” Selikem wrote: good example, old date, check.', 'A teacher holds up a gold-coloured label beside a cooperative sign.'),
      pg('🇹🇿', '“Tanzania, in East Africa,” said Mr Tsikata. “The study says that licences were hard to get and the licence lasted seven years, with no promise of renewal. Some sites were too small. But there was practical help. A university gave twenty miners a retort, a closed container that catches mercury vapour so it can be used again. Eighteen miners used it for five months and saved about ten kilograms of mercury.”', 'A teacher points to Tanzania on a map beside a drawing of a small closed metal retort.'),
      pg('🇪🇨', '“Ecuador,” said Mr Tsikata, “passed a law in 1992 that made lawful the mines already working. That helped many miners to become legal. But permits could not be passed on, banks did not lend, and the training did not last. In Mongolia, mercury was banned in 2008, but the study says some people still use it in secret.” Selikem frowned. “So a law alone does not do the job,” he said. “Exactly,” said Mr Tsikata.', 'A teacher points to Ecuador and Mongolia on a map with pins and small notes beside them.'),
      pg('📝', 'Together, the class made two lists on the board. What helped: clear categories, simple permits, legal recognition, groups and cooperatives, certification with a premium, practical training with tools. What fell short: weak government support, costs that differ by region, rules that blocked cooperation, no credit for formal miners, and bans without enforcement or alternatives. “These are lessons, not recipes,” said Mr Tsikata. “Ghana has its own laws and its own forests. Borrow ideas, do not copy blindly.”', 'A board with two columns headed what helped and what fell short, with chalk lists.'),
      pg('⚖️', 'Mr Tsikata set a question: should Ghana make licences cheaper and quicker for small groups? Selikem wrote: “Some people argue that cheaper and quicker licences would bring more miners into the law, where they can be trained and checked. However, others argue that if checking is weak, more licences could mean more damage to forests and water. The Peruvian example shows that guidance without force is often ignored. Therefore, in my view, licences should be quicker only if training, inspection and land restoration are properly supported.”', 'A boy writes an argument in his exercise book under a world map.'),
      pg('✅', 'Exam-safe tip: an argumentative paragraph states the question, gives one side with evidence, gives the other side, and then gives a reasoned conclusion. Selikem used “some people argue”, “however” and “therefore”, named his evidence instead of presenting it as unquestionable fact, and avoided contractions and slang. Check that your evidence is attributed and dated. The end.', 'A boy and his teacher look at the finished paragraph with the linking words underlined.'),
    ],
    activities: [
      { id: 'map-c1', type: 'comprehension', afterPage: 4, question: 'What is a retort in the story?', options: ['A closed container that catches mercury vapour so it can be reused', 'A kind of licence', 'A type of gold buyer'], correctIndex: 0 },
      { id: 'map-p1', type: 'prediction', afterPage: 6, prompt: 'What might happen if a law is passed but there is no enforcement or support?', options: ['The problem may continue', 'It is solved at once', 'Nothing can be learned'] },
      { id: 'map-c2', type: 'comprehension', afterPage: 8, question: 'Which word shows a reasoned conclusion?', options: ['Therefore', 'Maybe', 'Anyway'], correctIndex: 0 },
      { id: 'map-voc', type: 'vocabulary', afterPage: 3, word: 'cooperative', definition: 'A group of people who own and run a business together.', distractors: ['A kind of tax', 'A type of mine'] },
      { id: 'map-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Selikem asks whether any country has fixed the problem.', 'Mr Tsikata explains four country examples.', 'The class lists what helped and what fell short.', 'Selikem writes an argumentative paragraph.'] },
      { id: 'map-sel', type: 'sel', afterPage: 8, prompt: 'Hard problems rarely have one perfect answer. How do you feel about that?', feelingOptions: ['Thoughtful', 'Curious', 'Patient', 'Determined'] },
    ],
    glossary: [
      { word: 'artisanal', definition: 'Done by hand or with simple tools, usually by small groups.', pages: [2] },
      { word: 'cooperative', definition: 'A group of people who own and run a business together.', pages: [3] },
      { word: 'retort', definition: 'A closed container that catches mercury vapour so that it can be reused.', pages: [4] },
      { word: 'enforcement', definition: 'Making sure that a rule is followed.', pages: [6] },
      { word: 'evidence', definition: 'Facts or information that show that something is true.', pages: [8] },
    ],
    culturalNotes: ['Selikem, Mr Tsikata and the school are invented. The country facts come from a 2012 analysis of formalisation approaches in Ecuador, Mongolia, Peru, Tanzania and Uganda; it is more than a decade old, so the story labels the date and tells learners not to assume the same figures today.', 'The story shows both what helped and what failed and says no country has fixed the problem completely. It does not name any politician, company or community.', 'The story does not tell Ghana what to do. It ends with a conditional argument and a reminder that lessons are not recipes.'],
    reviewQuestions: ['Have a mining policy researcher check the summaries of the Peru, Tanzania, Ecuador and Mongolia examples against the full analysis, because only part of the document was read for this batch.', 'Check whether the Peruvian and Tanzanian rules have changed since 2012 and update or label the examples.', 'Check the argumentative paragraph against the NaCCA English syllabus.'],
    guide: {
      overview: 'A story about learning from other countries’ attempts to bring small-scale gold miners into the law. It shows successes and failures side by side and models an argumentative paragraph.',
      lessonMinutes: 45,
      goals: ['Describe one thing that helped and one thing that failed in another country.', 'Explain why a law alone does not solve a problem.', 'Write an argumentative paragraph with evidence and a reasoned conclusion.'],
      subjects: [['Social Studies', 'Citizenship and economic activities'], ['Geography', 'Countries and resources'], ['English Language', 'Argumentative writing']],
      before: ['Ask: what is the difference between borrowing an idea and copying a plan?'],
      during: ['At page 6, ask learners to sort each example into helped or fell short.'],
      after: ['Write an argumentative paragraph on a question such as: should a school have a compulsory tree-planting day?', 'Find one of the four countries on a map and note its continent.'],
      discussion: ['Why might a rule that bans miners from cooperating cause problems?', 'What support do you think small miners need besides a licence?'],
      reflection: ['When have you changed your mind after hearing both sides of a question?'],
      support: ['Give an argument frame: Some people argue… However, others argue… Therefore, in my view…'],
      stretch: ['Compare two of the four countries in a short report with a heading, an introduction, findings and a recommendation.'],
      localise: ['Ask a Ghanaian mining officer or researcher what the country has adopted or avoided from other countries’ experience.'],
      factCheck: [
        { claim: 'A 2012 analysis found that Peru’s 2002 law set clear categories, lower fees and simpler environmental permits for small and artisanal miners, but the promotion policy never fully materialised, a minimum annual production applied and artisanal miners could not contract with each other; the cooperative SOTRAMI was Fairmined certified with a premium of 10 to 15 per cent.', explanation: 'From a 2012 analysis of formalisation in five countries; dated.', reference: 'Hinton, J. (2012), “Analysis of formalization approaches in the artisanal and small-scale gold mining sector based on experiences in Ecuador, Mongolia, Peru, Tanzania and Uganda” (delvedatabase.org).' },
        { claim: 'In Tanzania, miners found licences hard to obtain and the licence term was seven years without guaranteed renewal, and a university trial gave retorts to 20 miners, 18 of whom used them for five months and recycled about 10 kilograms of mercury; in Ecuador a 1992 law legalised existing operations but credit did not develop; mercury was banned in Mongolia in 2008 but clandestine use continues.', explanation: 'From the same 2012 analysis; conditions may have changed.', reference: 'Hinton, J. (2012), as above.' },
      ],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-bag-that-keeps-the-weevils-out',
    title: 'The Bag That Keeps the Weevils Out',
    summary: 'Hawawu’s grandmother harvests good maize every year and loses much of its value to weevils, mould and quick, cheap sales. Her agriculture teacher reads from a research paper about airtight storage bags and a cool chamber made of bricks and damp sand, with real trial figures and their limits. Hawawu persuades her grandmother to try one bag and writes a short report. A story about saving food after harvest, with a report in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['educational', 'science', 'realistic-fiction'],
    themes: ['farm-and-garden', 'food', 'family', 'money-and-enterprise'],
    objectives: ['scientific-curiosity', 'problem-solving', 'financial-literacy', 'reading-comprehension'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-food'],
    wpm: 118,
    paceWord: 'Clear and practical, slowing for the figures',
    palette: ['#a16207', '#4d7c0f'],
    voice: 'Determined girl’s voice for Hawawu; a warm, firm grandmother’s voice for Hajia Asana; a patient teacher’s voice for Mr Tia',
    characters: [
      'Hawawu Shaibu: a 14-year-old girl in a school uniform and a headscarf, holding a notebook.',
      'Hajia Asana: Hawawu’s grandmother, a farmer in a wrapper and headscarf, standing by sacks of maize.',
      'Mr Tia: the agriculture teacher, in a work shirt, holding a printed research paper.',
      'The storeroom: a dim room with sacks of maize on the floor and a few weevils crawling on a sack.',
    ],
    music: 'Warm northern drum and a steady flute; a bright tune when the clean grain is opened (placeholder)',
    pages: [
      pg('🌽', 'Every harvest, Hawawu’s grandmother, Hajia Asana, filled sacks with golden maize. By the time the rains returned, the sacks held holes, dust and tiny beetles. “Weevils again,” she sighed, throwing away a bowl of spoiled grain. She had also sold many sacks cheaply right after harvest, because the family needed money. Hawawu watched quietly. “Maame,” she said, “there must be a better way.”', 'A girl and her grandmother stand beside sacks of maize with small beetles on them.'),
      pg('📄', 'At school, Mr Tia read from a research paper by two researchers, published in 2018. “Losses come from insects such as the maize weevil and the larger grain borer, and from mould, including aflatoxin, which can harm health,” he said. “They also come from harvesting too early or late and from grain that is not dry enough. And one study cited in the paper linked selling straight after harvest to a loss equal to 29.3 per cent of the value of grain sales, because prices rise later.”', 'A teacher reads from a paper while students look at a chart of grain losses.'),
      pg('👜', '“Now to a solution,” said Mr Tia. He held up a thick bag. “This is a triple-layer hermetic bag, called a PICS bag. Hermetic means airtight. Insects inside soon use up the oxygen and cannot survive. The paper says maize in these bags lost, on average, less than half of one per cent of its dry weight over six months. In ordinary storage, other studies report losses of ten to thirty per cent over six months, though not only in Ghana.”', 'A teacher holds up a thick, sealed storage bag beside a sack with holes.'),
      pg('💰', '“What does a bag cost?” asked Hawawu. “The paper gave about nine cedis, or two United States dollars, for a bag that holds fifty to one hundred kilograms,” said Mr Tia. “That was in 2018, so prices today will differ. The paper also found that storing for eight months in Tamale gave better returns with these bags than other options. But bags only work well on dry grain, and they do not change the price. Ask your extension officer how to check that grain is dry.”', 'A teacher writes a price and a weight on the board beside a picture of a bag and a coin.'),
      pg('🥬', '“Not all food is grain,” said Mr Tia. “The paper says that cabbage in Ghana typically loses about sixty per cent after harvest, mostly from heat and dryness. A trial used a zero energy cool chamber, which is a double-walled brick room packed with damp sand that stays cool without electricity. It raised the share of cabbage still saleable after six days from forty to sixty-two per cent. The chamber cost about one thousand and forty dollars and paid for itself after eighteen uses.”', 'A teacher draws a brick chamber with damp sand between two walls and cabbages inside.'),
      pg('🔢', 'Hawawu worked out a sum. “Suppose a family has one hundred kilograms of maize worth three hundred cedis,” she wrote. “If insects destroy twenty per cent, that is a loss of sixty cedis. If a bag saves most of it, the family keeps nearly all of those sixty cedis.” She paused. “But these are imaginary numbers. I must check the real price of maize and of bags.” Mr Tia smiled. “That is exactly what a careful farmer does,” he said.', 'A girl works out a sum on a page with a drawing of a bag and a small pile of coins.'),
      pg('🤝', 'At home, Hawawu showed her grandmother the sums. Hajia Asana folded her arms. “One bag only,” she said. “Let us see.” Hawawu also suggested that the women of their street save together and buy bags in bulk, and keep the grain dry before sealing it. At the next planting season, Hajia Asana opened the bag and ran the grain through her fingers. It was clean and whole. “We shall buy more,” she said. “But we shall also keep the grain dry. The bag is only part of the work.”', 'A grandmother opens a thick bag of clean maize while her granddaughter smiles beside her.'),
      pg('✅', 'Exam-safe tip: Hawawu wrote a short report for the school agriculture club. A report has a heading, an introduction that states its purpose, findings, a recommendation and a name and date. Hers read: “REPORT ON STORING MAIZE. Introduction: This report describes a way of reducing losses after harvest. Findings: Researchers found that hermetic bags reduced weight loss to less than half of one per cent. Recommendation: Farmers should dry grain well and test one bag first.” Use facts you can name and a formal tone. The end.', 'A girl hands a short written report to her teacher beside a sealed bag of maize.'),
    ],
    activities: [
      { id: 'bag-c1', type: 'comprehension', afterPage: 3, question: 'What does hermetic mean?', options: ['Airtight', 'Very heavy', 'Made of metal'], correctIndex: 0 },
      { id: 'bag-p1', type: 'prediction', afterPage: 6, prompt: 'What must a farmer do to grain before sealing it in a hermetic bag?', options: ['Make sure it is dry', 'Soak it in water', 'Add more insects'] },
      { id: 'bag-c2', type: 'comprehension', afterPage: 8, question: 'Which part of a report states what the farmer should do?', options: ['The recommendation', 'The heading', 'The date'], correctIndex: 0 },
      { id: 'bag-voc', type: 'vocabulary', afterPage: 3, word: 'hermetic', definition: 'Airtight; sealed so that no air can get in or out.', distractors: ['Very old', 'Very cheap'] },
      { id: 'bag-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Hajia Asana loses grain to weevils.', 'Mr Tia explains the research on bags and chambers.', 'Hawawu works out an imaginary sum.', 'Hajia Asana tries one bag.'] },
      { id: 'bag-sel', type: 'sel', afterPage: 8, prompt: 'Saving food that has already been grown can matter as much as growing it. How do you feel?', feelingOptions: ['Practical', 'Hopeful', 'Curious', 'Determined'] },
    ],
    glossary: [
      { word: 'weevils', definition: 'Small beetles that eat stored grain.', pages: [1] },
      { word: 'aflatoxin', definition: 'A poison made by some moulds on stored grain and nuts.', pages: [2] },
      { word: 'hermetic', definition: 'Airtight; sealed so that no air can get in or out.', pages: [3] },
      { word: 'extension', definition: 'Advice and training for farmers from agricultural officers.', pages: [4] },
      { word: 'recommendation', definition: 'Advice about what should be done.', pages: [8] },
    ],
    culturalNotes: ['Hawawu, Hajia Asana and Mr Tia are invented. The research facts come from a 2018 IFPRI working paper on the cost-effectiveness of post-harvest technologies in Ghana: causes of loss (insects, mould, early or late harvest, grain not dry enough, selling at harvest); hermetic bags kept maize dry-weight loss below an average of 0.5 per cent over six months, cost about GH¢9 (US$2) in 2018 and gave better returns in Tamale over eight months; typical cabbage losses of about 60 per cent in Ghana; a zero energy cool chamber trial raised the saleable share after six days from 40 to 62 per cent, cost about US$1,040 and paid back after 18 uses.', 'The paper’s figures for maize losses of 10 to 30 per cent in ordinary storage are not Ghana-specific, and the story says so. Prices are from 2018 and the story tells learners to check current prices. Sums in the story use invented numbers, labelled as imaginary.', 'The story does not claim that a bag solves price problems or replaces drying; it shows an elder who tests one bag first and keeps the grain dry. It gives no medical advice about aflatoxin beyond naming it.'],
    reviewQuestions: ['Have an agricultural officer or post-harvest researcher check the descriptions of hermetic bags and the cool chamber, the 2018 figures and the dryness advice against current guidance.', 'Check the explanation of how a zero energy cool chamber keeps produce cool, because the paper’s summary gave results, not the mechanism.', 'Check the report-writing tip against the NaCCA English syllabus.'],
    guide: {
      overview: 'A story about reducing losses after harvest. It uses real trial figures with their dates and limits and models a short report.',
      lessonMinutes: 45,
      goals: ['Name two causes of post-harvest loss.', 'Explain how a hermetic bag protects grain and what the farmer must still do.', 'Write a short report with a heading, introduction, findings and recommendation.'],
      subjects: [['Agricultural Science', 'Post-harvest handling'], ['Integrated Science', 'Insects, moulds and oxygen'], ['Mathematics', 'Percentages and cost'], ['English Language', 'Report writing']],
      before: ['Ask: where does food go between the farm and the plate? When can it be lost?'],
      during: ['At page 6, ask learners to say why the numbers are marked as imaginary.'],
      after: ['Write a report on how your family or school stores a food item.', 'Visit a market (with an adult) and ask how sellers keep vegetables fresh.'],
      discussion: ['Why might a family sell grain cheaply right after harvest? What might help?', 'What might stop a family from buying a bag?'],
      reflection: ['What food is wasted at home or at school, and how could it be saved?'],
      maths: [
        { task: 'Suppose 100 kg of maize is worth GH¢300 and 20 per cent is lost. How much value is lost?', answer: '0.20 × 300 = GH¢60.' },
        { task: 'Suppose 0.5 per cent is lost instead. What is the loss in value?', answer: '0.005 × 300 = GH¢1.50.' },
        { task: 'A bag costs GH¢9 (2018 figure). How many bags can GH¢90 buy?', answer: '90 ÷ 9 = 10 bags.' },
      ],
      support: ['Provide a report frame: HEADING, Introduction (one sentence), Findings (two facts), Recommendation (one sentence), name and date.'],
      stretch: ['Compare the cost and benefits of a bag and a metal silo using the paper’s figures (a 0.5-ton silo cost about US$200 in 2018) and write a recommendation with a reason.'],
      localise: ['Ask your district agricultural officer which storage methods suit the crops and climate in your area and where hermetic bags are sold; do not rely on 2018 prices.'],
      factCheck: [
        { claim: 'Hermetic PICS bags kept maize dry-weight loss below an average of 0.5 per cent over six months, cost about GH¢9 (US$2) for a 50 to 100 kg bag in 2018 and gave better returns than other options over eight months in Tamale; typical cabbage losses in Ghana are about 60 per cent; a zero energy cool chamber trial raised the saleable share after six days from 40 to 62 per cent, cost about US$1,040 and paid back after 18 uses.', explanation: 'From a 2018 IFPRI working paper; trial results and prices from that period.', reference: 'Baral, S. and Hoffmann, V. (2018), “Tackling Post Harvest Loss in Ghana: Cost-Effectiveness of Technologies”, IFPRI Working Paper (cgspace.cgiar.org).' },
        { claim: 'Causes of post-harvest loss include insects (maize weevil, larger grain borer), mould and aflatoxin, harvesting too early or late, grain not dry enough, and selling immediately after harvest, which one study linked to a loss equal to 29.3 per cent of grain sales value.', explanation: 'From the same paper; the last figure is from a study the paper cites.', reference: 'Baral and Hoffmann (2018), as above.' },
      ],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'two-women-and-a-cold-room',
    title: 'Two Women and a Cold Room',
    summary: 'Enyonam’s Auntie Comfort throws away baskets of soft tomatoes every week in the market heat. Her teacher shares a report about solar-powered cold rooms in Nigerian markets, run by two women each and paid for by the crate. The class asks honest questions about whether such a room could work in Ghana, and Enyonam writes a short speech for the market association. A story about keeping food fresh and creating jobs, with a speech in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['educational', 'realistic-fiction', 'informational'],
    themes: ['community', 'money-and-enterprise', 'food', 'technology'],
    objectives: ['problem-solving', 'critical-thinking', 'oral-language', 'financial-literacy'],
    ghanaianContext: 'central',
    culturalTags: ['market', 'local-food', 'local-names'],
    wpm: 118,
    paceWord: 'Lively and clear, slowing for the speech',
    palette: ['#be123c', '#0e7490'],
    voice: 'Bright girl’s voice for Enyonam; a brisk, loving voice for Auntie Comfort; a thoughtful voice for Mr Gbeve',
    characters: [
      'Enyonam Kpodo: a 14-year-old girl in a school uniform, with a notebook.',
      'Auntie Comfort: Enyonam’s aunt, a tomato seller in a wrapper and apron, sitting behind baskets of tomatoes.',
      'Mr Gbeve: the agriculture teacher, in a shirt and tie, holding a printed article.',
      'The market association chairman: a middle-aged man in a smock, seated at a table with a gavel.',
    ],
    music: 'Lively market highlife with a soft hum of a fan; a calm, clear tune at the speech (placeholder)',
    pages: [
      pg('🍅', 'On Saturdays, Enyonam helped Auntie Comfort sell tomatoes in the market. By afternoon the heat had made the top baskets soft and spotted. Auntie Comfort sorted them with a tight mouth. “Half a basket gone again,” she said, throwing the worst into a bucket. “If I sell cheap, I lose money. If I keep them, they rot.” Enyonam frowned. “There must be a way to keep tomatoes fresh,” she said.', 'A girl and her aunt sort tomatoes behind market baskets, with spoiled ones in a bucket.'),
      pg('📰', 'At school, Mr Gbeve read from an article from 2018 about a company in Nigeria called ColdHubs. “Its founder says it builds solar-powered cold rooms in markets and on farms,” he said. “Each is run by two women. Traders pay about fifty United States cents per crate for each day of storage. The company says produce lasts up to twenty-one days instead of two. Its figures are reported by the founder, and I have not seen an independent check, so we must be careful.”', 'A teacher reads an article beside a drawing of a cold room with solar panels on its roof.'),
      pg('☀️', '“How does it work?” asked Enyonam. “Solar panels collect sunlight and make electricity,” said Mr Gbeve. “The electricity runs a cooling machine, so the room stays cold even when there is no mains power. Cold slows the changes that make vegetables soft and rotten. The article says that in two years, five hubs saved nearly five thousand eight hundred tons of produce and that more than three hundred traders, wholesalers and farmers nearly doubled their monthly income. Again, that is the founder’s report.”', 'A teacher draws a roof of solar panels, a cooling machine and crates of vegetables in a cold room.'),
      pg('🤔', 'The class made a list of honest questions. Would the idea work at their market? How much would solar panels and a cold room cost? Who would own it, and who would pay for repairs? Would traders trust it? Would it be safe and clean? “Good questions,” said Mr Gbeve. “A good idea in one country must be tested before it is copied. And a cold room is only one part. Roads, packaging and buyers also matter.”', 'Students write questions on the board under the heading would it work here.'),
      pg('💼', '“It also creates work,” said Mr Gbeve. “According to the article, two women run each hub, and the traders pay for what they use, a crate at a time. That means a market woman does not need to buy a cold room. She needs only to pay for the space she uses.” Enyonam wrote: shared cost, shared benefit. “A cooperative or the market association could think about the same idea,” she said. “If it makes financial sense.”', 'A teacher points to a drawing of two women at a counter beside a row of crates.'),
      pg('🔢', 'Enyonam did a sum. “Suppose Auntie Comfort stores twenty crates for one day,” she wrote. “If the price were fifty cents a crate, that would be ten dollars. But I must change that into cedis and check whether the saved tomatoes are worth more than the fee.” She stopped. “Suppose she saves two crates that would have rotted. If each is worth eighty cedis, that is one hundred and sixty cedis.” She wrote: all numbers imaginary, so I must find real prices first.', 'A girl works out a sum with crates, coins and a calculator on a market table.'),
      pg('🎤', 'The market association invited Enyonam to speak at its monthly meeting. She stood and began: “Mr Chairman, executive members, traders, ladies and gentlemen. Good afternoon. Today I speak on keeping our food fresh. Every week, many of us throw away tomatoes that the heat has spoiled. Reports from another country show that shared solar cold rooms may help traders keep produce longer. We do not yet know whether this would work here. Therefore, I appeal to this association to study the idea, ask for quotations, and visit an existing cold room. Thank you for listening.”', 'A girl stands to speak at a market association meeting, with traders seated in rows.'),
      pg('✅', 'Exam-safe tip: a speech opens with a greeting to the audience, states the topic, gives two or three clear points, makes an appeal or recommendation, and ends with “Thank you”. Enyonam said what she did not know, as well as what she did. Use a polite, spoken tone, no slang and no invented facts. Reading aloud before an exam helps. The end.', 'A girl bows after her speech while traders clap in the market hall.'),
    ],
    activities: [
      { id: 'cold-c1', type: 'comprehension', afterPage: 3, question: 'What powers the cooling machine in the cold rooms?', options: ['Solar panels', 'Firewood', 'Water only'], correctIndex: 0 },
      { id: 'cold-p1', type: 'prediction', afterPage: 5, prompt: 'Why should the class ask questions before copying the idea?', options: ['A good idea must be tested in a new place', 'All ideas work everywhere', 'Questions waste time'] },
      { id: 'cold-c2', type: 'comprehension', afterPage: 8, question: 'How does a speech usually end?', options: ['With thanks to the audience', 'With a joke', 'With a drawing'], correctIndex: 0 },
      { id: 'cold-voc', type: 'vocabulary', afterPage: 3, word: 'solar', definition: 'Powered by the sun’s light and heat.', distractors: ['Powered by wind', 'Made of glass'] },
      { id: 'cold-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Auntie Comfort loses tomatoes to heat.', 'Mr Gbeve shares an article on solar cold rooms.', 'The class lists honest questions.', 'Enyonam gives a speech to the market association.'] },
      { id: 'cold-sel', type: 'sel', afterPage: 8, prompt: 'A good idea needs honest questions before it grows. How do you feel?', feelingOptions: ['Curious', 'Careful', 'Hopeful', 'Proud'] },
    ],
    glossary: [
      { word: 'solar', definition: 'Powered by the sun’s light and heat.', pages: [3] },
      { word: 'hubs', definition: 'Central places where something is gathered or shared.', pages: [3] },
      { word: 'cooperative', definition: 'A group of people who own and run a business together.', pages: [5] },
      { word: 'quotations', definition: 'Written prices that a seller gives for goods or services.', pages: [7] },
      { word: 'appeal', definition: 'To ask seriously and politely for something to be done.', pages: [7] },
    ],
    culturalNotes: ['Enyonam, Auntie Comfort, Mr Gbeve and the market association are invented. The cold-room facts are from an IFPRI blog post (2018) quoting the founder of ColdHubs in Nigeria: solar-powered walk-in cold rooms in markets and on farms, run by two women each, about US$0.50 per crate per day, produce lasting up to 21 days instead of 2, five hubs saving nearly 5,800 tons of produce in two years, and more than 300 farmers, retailers and wholesalers nearly doubling monthly incomes. The article describes these as the founder’s reports; the story repeats that they are not independently checked.', 'The story does not claim that the same model works in Ghana. It lists the questions a Ghanaian market would need to answer (cost, ownership, repairs, trust, hygiene, roads, packaging, buyers). It names no real Ghanaian market, association or trader.', 'The sum in the story uses invented prices, labelled as imaginary.'],
    reviewQuestions: ['Have a food-systems or agricultural engineering specialist check the simple explanation of solar cooling and how cold slows spoilage.', 'Check the ColdHubs figures against more recent independent sources and update them or label them as dated.', 'Check the speech-writing tip against the NaCCA English syllabus.'],
    guide: {
      overview: 'A story about shared solar cold rooms for market traders, shown with its reported benefits and its limits. It encourages honest questions before copying a good idea and models a short speech.',
      lessonMinutes: 45,
      goals: ['Explain how cold storage can reduce food loss.', 'List questions to ask before copying an idea from another country.', 'Write and deliver a short speech with a greeting, points, an appeal and a closing.'],
      subjects: [['Agricultural Science', 'Post-harvest handling'], ['Integrated Science', 'Energy from the sun'], ['English Language', 'Speech writing']],
      before: ['Ask: how do you keep food fresh at home without a fridge? Why does heat spoil tomatoes?'],
      during: ['At page 4, ask learners to add one more honest question to the list.'],
      after: ['Write a two-minute speech to your class on how to waste less food.', 'Practise speaking it aloud to a partner.'],
      discussion: ['Why might shared storage be easier for traders than owning their own cold room?', 'What might go wrong with a new technology in a market?'],
      reflection: ['What would you want to know before trusting a new machine with your family’s food?'],
      maths: [
        { task: 'Suppose a trader stores 20 crates for 3 days at US$0.50 per crate per day. What is the fee in dollars?', answer: '20 × 3 × 0.50 = US$30.' },
        { task: 'Suppose two crates worth GH¢80 each are saved. What is their total value?', answer: '2 × 80 = GH¢160.' },
      ],
      support: ['Give a speech frame: greeting; topic; point one; point two; appeal; thank you.'],
      stretch: ['Write a letter to a market association asking it to study a shared cold room, using the eight formal-letter features.'],
      localise: ['Interview a market seller (with an adult) about how much produce spoils and how they store it; use real, local figures instead of the imaginary sum.'],
      factCheck: [
        { claim: 'ColdHubs runs solar-powered cold rooms in markets and on farms in Nigeria, each run by two women, charging about US$0.50 per crate per day and extending produce life from about 2 to up to 21 days; five hubs reportedly saved nearly 5,800 tons of produce in two years and over 300 farmers, retailers and wholesalers reportedly nearly doubled their monthly incomes.', explanation: 'From a 2018 IFPRI blog post quoting the founder; the figures are the company’s own and were not independently verified there.', reference: 'IFPRI, “ColdHubs: addressing a crucial problem, food loss in Nigeria, with solar-powered refrigeration” (ifpri.org, 2018).' },
      ],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'farming-is-not-for-failures',
    title: 'Farming Is Not for Failures',
    summary: 'Kwao believes that farming is what people do when they fail at school. His cousin Elinam, a young vegetable farmer, shows him price and weather apps, a cooperative that supplies supermarkets and a municipal project that reportedly turned former illegal miners into oil palm farmers. She also admits the risks. Kwao learns that modern farming is a business built on information, quality and presentation, and writes a descriptive paragraph. A story with descriptive writing in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'educational', 'school-life'],
    themes: ['farm-and-garden', 'technology', 'money-and-enterprise', 'identity'],
    objectives: ['critical-thinking', 'financial-literacy', 'figurative-language', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 118,
    paceWord: 'Lively and warm, slowing for the honest page about risk',
    palette: ['#15803d', '#ca8a04'],
    voice: 'A proud, slightly scornful boy’s voice for Kwao, softening as the story goes on; a calm, humorous young woman’s voice for Elinam',
    characters: [
      'Kwao Boadum: a 14-year-old boy in a school uniform, arms folded.',
      'Elinam Akoto: Kwao’s cousin, a young woman in jeans, a shirt and a sun hat, holding a smartphone in a vegetable field.',
      'The vegetable field: neat rows of green vegetables, a water tank and a small drip-pipe line, with a clean packing shed beside it.',
    ],
    music: 'Bright, rhythmic afro-pop guitar with a light synth; a warm, hopeful tune at the descriptive paragraph (placeholder)',
    pages: [
      pg('🙄', 'On careers day, Kwao’s class listed jobs they wanted: doctor, engineer, pilot. Then someone asked Kwao’s cousin Elinam, who had come to speak, what she did. “I farm vegetables,” she said. Kwao snorted. “Farming is for people who failed school,” he muttered. The room went quiet. Elinam only smiled. “Come to my farm on Saturday,” she said. “Then tell me what you think.”', 'A boy with folded arms sits in a classroom while a young woman in a sun hat speaks.'),
      pg('📱', 'On Saturday, Elinam met him in a green field and handed him her phone. “This tells me the weather for the week,” she said, “so I know when to plant and when to cover the beds.” She showed him an app with market prices. According to an article from 2026, platforms such as AgroCenta and Farmerline give farmers prices, weather forecasts and advice, and some help them sell directly to buyers. “Features and fees differ,” Elinam added. “I check before I trust any of them.”', 'A young woman shows a boy a phone with a weather forecast and prices in a vegetable field.'),
      pg('🧑🌾', 'Elinam told him what the same article reports. In the north, young maize and soybean farmers use phone apps to plan planting around the rain forecast. In the south, some young cocoa farmers use digital monitoring to spot pests early. In the Ashanti Region, a cooperative of young vegetable farmers sells pesticide-free produce to supermarkets in Accra, using cold-chain transport. In the Volta Region, young poultry farmers use feed calculations to cut costs. “The article does not give proof for each one,” she said, “so I treat them as reports.”', 'A young woman points to a map of Ghana with small icons for maize, cocoa, vegetables and poultry.'),
      pg('🌴', 'Kwao’s eyebrows lifted. “And the old miners?” he asked, because his uncle had mined. Elinam nodded. “In 2023, a municipal agriculture director in the Eastern Region told the Minerals Commission board that about three thousand former small-scale illegal miners had become oil palm farmers, with more than four hundred thousand seedlings given out since 2020. But the seedlings went only to people who had farmland, one beneficiary asked for a palm-processing factory, and it is too early to know the long-term result.”', 'A young woman holds a palm seedling beside rows of young oil palm trees in a field.'),
      pg('✨', '“And the style?” Kwao asked, looking at her neat shed. “Farming is a business,” said Elinam. “I grade my vegetables, pack them in clean crates, put a label with my name and phone number on each one, and keep records. Some young people are even learning to fly drones over farms, according to news reports. People pay for good quality and for trust.” Kwao looked at the shed. “It does not look like what I imagined,” he admitted. “Most people imagine a cutlass and a tired back,” Elinam said. “There is some of that too.”', 'A shed with labelled crates of clean vegetables and a drone on a table beside a notebook.'),
      pg('⚠️', 'She grew serious. “I will not lie to you,” said Elinam. “One year, heavy rain washed away a whole bed of peppers. Prices drop when many farmers harvest at once. Land is hard to get, and so is money. Many young people give up in the first two years.” Kwao swallowed. “So how do you stay?” he asked. “I started small, I learnt from older farmers, I joined a group, and I keep trying new things,” she said. “It is not magic. It is work, with brains.”', 'A young woman kneels beside a flooded bed of ruined peppers and looks up at a boy.'),
      pg('🖋️', 'On Monday, Mrs Boampong, the English teacher, set a descriptive task: describe a place you know. Kwao wrote: “At six o’clock the field glowed green under the golden sun. The air smelt of wet soil and fresh leaves, and a gentle wind rustled the neat rows like whispering paper. Cousin Elinam’s hands, rough but steady, laid crisp lettuce in a clean crate. The cool water pipe ticked softly as it dripped. I tasted a sweet tomato, and it burst on my tongue like a tiny sunrise.”', 'A boy writes a descriptive paragraph at his desk with a green field drawn in the margin.'),
      pg('✅', 'Exam-safe tip: a descriptive paragraph uses the five senses (sight, sound, smell, taste and touch), strong adjectives, and comparisons such as similes and metaphors. Kwao wrote in the past tense and avoided slang and contractions. He also showed rather than told: he did not say “it was beautiful”, he described what made it so. Change your first opinion if the facts change, as Kwao did. The end.', 'A boy and his teacher read the descriptive paragraph with the senses underlined in colour.'),
    ],
    activities: [
      { id: 'fail-c1', type: 'comprehension', afterPage: 3, question: 'Why does Elinam call the reports in the article “reports”?', options: ['The article gives no proof for each one', 'She dislikes reading', 'They are all jokes'], correctIndex: 0 },
      { id: 'fail-p1', type: 'prediction', afterPage: 6, prompt: 'Elinam says it is “work, with brains”. What might help a young farmer last beyond two years?', options: ['Starting small and learning from others', 'Giving up quickly', 'Never keeping records'] },
      { id: 'fail-c2', type: 'comprehension', afterPage: 8, question: 'Which of these is one of the five senses a writer can use?', options: ['Smell', 'Spelling', 'Subtraction'], correctIndex: 0 },
      { id: 'fail-voc', type: 'vocabulary', afterPage: 3, word: 'cooperative', definition: 'A group of people who own and run a business together.', distractors: ['A kind of seed', 'A type of tax'] },
      { id: 'fail-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Kwao says farming is for people who failed.', 'Elinam shows him apps and reports.', 'She tells him honestly about the risks.', 'Kwao writes a descriptive paragraph.'] },
      { id: 'fail-sel', type: 'sel', afterPage: 8, prompt: 'Changing your mind after learning more takes courage. How do you feel?', feelingOptions: ['Curious', 'Humble', 'Open-minded', 'Inspired'] },
    ],
    glossary: [
      { word: 'platforms', definition: 'Websites or apps that connect people, such as farmers and buyers.', pages: [2] },
      { word: 'cooperative', definition: 'A group of people who own and run a business together.', pages: [3] },
      { word: 'seedlings', definition: 'Very young plants grown from seeds.', pages: [4] },
      { word: 'drones', definition: 'Small flying machines that are controlled from the ground.', pages: [5] },
      { word: 'descriptive', definition: 'Describing something so that the reader can picture it.', pages: [7, 8] },
    ],
    culturalNotes: ['Kwao, Elinam, Mrs Boampong and the school are invented. The examples of youth agriculture come from a March 2026 MyJoyOnline article: platforms such as AgroCenta and Farmerline give prices, weather and advice and help farmers sell directly; young farmers in the north use apps to plan planting; some young cocoa farmers use digital monitoring; a youth vegetable cooperative in the Ashanti Region supplies Accra supermarkets with cold-chain transport; young poultry farmers in the Volta Region use feed calculations. The article gives no proof for each example, so the story calls them reports. An 18 per cent rise in youth engagement quoted in the article could not be checked and is not used.', 'The oil palm figures come from a February 2023 news report of a municipal official’s briefing in the Birim Central Municipality: about 3,000 former small-scale illegal miners became oil palm farmers and 438,000 seedlings have been given out since 2020; the report notes that only people with farmland received seedlings, a beneficiary asked for a palm-processing factory, and long-term results are not yet known. The figures are not independently verified.', 'The mention of young people flying farm drones is based on news headlines about drone-pilot training for youth; details were not checked and the story gives no figures. The story shows farming as hard and uncertain, and does not suggest that a phone app guarantees profit.'],
    reviewQuestions: ['Have an agricultural extension officer check the examples of youth farming and the claim that platform features and fees differ, and replace any example that cannot be verified with a documented one.', 'Check the oil palm figures against the Minerals Commission or the municipal agriculture department, and check whether the project’s results have been assessed since 2023.', 'Check the descriptive-writing tip against the NaCCA English syllabus.'],
    guide: {
      overview: 'A story that challenges the idea that farming is for people who failed. It shows modern farming as a business of information, quality and teamwork, with real risks, and models a descriptive paragraph.',
      lessonMinutes: 45,
      goals: ['Describe two ways technology or organisation is used in farming.', 'Explain two risks a young farmer faces.', 'Write a descriptive paragraph that uses the five senses.'],
      subjects: [['Agricultural Science', 'Farming as a business'], ['Career Technology', 'Work and enterprise'], ['English Language', 'Descriptive writing']],
      before: ['Ask: what do you think a farmer looks like? What do you think a farmer does all day?'],
      during: ['At page 6, ask learners to name two risks and one way to reduce each.'],
      after: ['Write a descriptive paragraph about a farm or garden you have seen.', 'Interview a farmer (with an adult) about their best and worst year.'],
      discussion: ['Why might young people think farming is for people who failed? What could change that idea?', 'What do the reports in the story have in common?'],
      reflection: ['What job do you look down on without knowing much about it?'],
      support: ['Provide a five-senses grid with headings: sight, sound, smell, taste, touch, and two sentence starters for each.'],
      stretch: ['Write a balanced paragraph on whether young people should be encouraged to take up farming, using one report from the story and one risk, with attribution.'],
      localise: ['Invite a young local farmer or agricultural officer to talk about what really works in your area; use local crops and prices instead of the reports in the story.'],
      factCheck: [
        { claim: 'Platforms such as AgroCenta and Farmerline give farmers prices, weather and advice; young farmers in the north use apps to plan planting; some young cocoa farmers use digital monitoring; a youth vegetable cooperative in the Ashanti Region supplies Accra supermarkets with cold-chain logistics; young poultry farmers in the Volta Region use feed models.', explanation: 'From a March 2026 article that gives no proof for each example; treated in the story as reports.', reference: 'MyJoyOnline, “From farm to table: Ghana’s youth are transforming agriculture” (18 March 2026).' },
        { claim: 'About 3,000 former small-scale illegal miners in the Birim Central Municipality became oil palm farmers and 438,000 seedlings have been distributed since 2020; seedlings went only to people with arable land.', explanation: 'From a 2023 news report of a municipal official’s briefing; the figures are not independently verified and the report notes the long-term results are not yet established.', reference: 'MyJoyOnline, “Alternative livelihoods project: 3,000 former illegal miners gain employment” (1 February 2023).' },
      ],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-chain-from-seed-to-shelf',
    title: 'The Chain From Seed to Shelf',
    summary: 'Madam Yartey turns her class into a human chain, with each pupil playing a link between a cassava farm and a shop shelf. The class learns where food is lost and where value is added, and hears how Rwandan coffee farmers raised their quality and prices through shared washing stations in cooperatives. The pupils then choose one link in a Ghanaian chain to improve, and learn to write a summary. A story about agriculture as a chain of businesses, with a summary in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['educational', 'school-life', 'informational'],
    themes: ['farm-and-garden', 'money-and-enterprise', 'community', 'school'],
    objectives: ['summarising', 'reasoning', 'teamwork', 'financial-literacy'],
    ghanaianContext: 'central',
    culturalTags: ['local-food', 'local-names'],
    wpm: 118,
    paceWord: 'Brisk and playful in the game, slower for the Rwanda page and the summary',
    palette: ['#b45309', '#1d4ed8'],
    voice: 'A lively, organised voice for Madam Yartey; bright, varied voices for the pupils',
    characters: [
      'Madam Yartey: the agricultural science teacher, in a bright dress, holding a set of role cards.',
      'Sumaiya Aidoo: a 13-year-old girl playing the farmer, holding a bunch of cassava.',
      'Wumpini Amankwa: a 14-year-old boy playing the processor, with a bowl of gari.',
      'The class: twelve pupils standing in a line with role cards hung round their necks.',
    ],
    music: 'Quick, playful drum and flute for the game; a calm, steady tune for the summary (placeholder)',
    pages: [
      pg('🃏', 'Madam Yartey gave each pupil a card on a string. “Today we play the chain from farm to table,” she said. Sumaiya’s card said farmer. Wumpini’s said processor. Others said input dealer, transporter, packer, shopkeeper and customer. Three more cards said extension officer, savings group and cooperative. “Every link has costs and risks,” said Madam Yartey. “Nobody in the chain is a villain, and nobody works for free.”', 'A teacher hands out role cards on strings to pupils in a line at the front of a classroom.'),
      pg('🥔', 'The chain began with cassava. Sumaiya grew it and sold a bag to Wumpini. “Suppose I sell it for one hundred cedis,” she said. Wumpini peeled, grated, pressed and roasted it into gari. He packed it in clean bags, and the shopkeeper sold the bags. “Suppose the shop sells the gari from that cassava for two hundred and fifty cedis,” said Madam Yartey. “These are imaginary numbers. The difference pays for work, fuel, transport, packaging, rent and risk. It is not all profit.”', 'A girl hands cassava to a boy at a table with a grater, a press and bowls of gari.'),
      pg('📈', '“Where is value added?” asked Madam Yartey. The pupils named steps: grading, drying, processing, packaging, storing and transporting. “Value addition,” she said, “means making a product worth more by improving it. Storing can also add value. The grain study we read found that selling straight after harvest was linked to a loss of about twenty-nine per cent of sales value, because prices rise later. But storing needs a good bag or store, and money to wait.”', 'A teacher points to a flow chart of steps from cassava in a field to packed gari in a shop.'),
      pg('☕', '“Now a story from Rwanda,” said Madam Yartey. “Coffee farmers there once sold their coffee cherries to traders. In 2000, aid-funded projects helped build coffee washing stations and organise farmers into cooperatives. Farmers and tasters were trained in quality. According to a trade article, about twenty-seven per cent of Rwanda’s coffee exports are now specialty coffee, up from almost none in 2000, and it sells for fifteen to twenty-five per cent above market prices. One cooperative manager says his income is about five times what it was before 2001. That is his own account.”', 'A teacher points to Rwanda on a map beside a drawing of coffee cherries and a washing station.'),
      pg('🏭', '“What made it work?” asked Madam Yartey. Sumaiya answered: “Shared washing stations, quality rules, training and cooperatives.” “One farmer cannot afford a washing station,” said the teacher, “but a cooperative can. It also had traceability, which means buyers can see where the coffee came from. But the project started with aid money, and success in one country does not guarantee it in another. Also, the article is not new, so the figures may have changed.”', 'A teacher draws a washing station shared by many small farms with a label saying traceable.'),
      pg('🇬🇭', 'The class turned to Ghana. “Choose one crop in our district,” said Madam Yartey. They picked tomatoes. They drew the chain, marked where tomatoes spoil, and asked: who could add value? Sumaiya suggested grading and clean crates. Wumpini suggested drying or making paste, if a market and clean water could be found. Another pupil suggested a shared cold room or a group selling arrangement. “Choose only one small step,” said Madam Yartey, “and find out what it needs: power, roads, buyers, money and rules.”', 'Pupils draw a tomato chain on a large sheet with sticky notes for each link and each idea.'),
      pg('✍️', 'Madam Yartey asked for a summary of forty-five words or fewer. Sumaiya wrote: “A farm-to-market chain has many links, each with costs and risks. Value grows through grading, drying, processing and packaging. Rwanda’s coffee farmers raised quality and earnings by sharing washing stations in cooperatives. Ghanaian farmers could start by choosing one link to improve together.” Wumpini counted the words aloud. “Forty-three,” he said. “Within the limit.”', 'A girl writes a short summary in an exercise book while a boy counts the words with a pencil.'),
      pg('✅', 'Exam-safe tip: to write a summary, read the passage twice, underline the main points, leave out examples and figures that are not needed, use your own words, join the points in one paragraph, and count your words. Sumaiya used linking ideas and no contractions or slang. A summary must be accurate: it should never add a fact that the passage does not give. The end.', 'A girl and her teacher read the summary with the main points underlined in colour.'),
    ],
    activities: [
      { id: 'chain-c1', type: 'comprehension', afterPage: 3, question: 'What does value addition mean?', options: ['Making a product worth more by improving it', 'Adding more water', 'Paying less tax'], correctIndex: 0 },
      { id: 'chain-p1', type: 'prediction', afterPage: 5, prompt: 'Why might a cooperative afford a washing station when one farmer cannot?', options: ['Many farmers share the cost', 'Washing stations are free', 'Farmers do not need them'] },
      { id: 'chain-c2', type: 'comprehension', afterPage: 8, question: 'What should a summary leave out?', options: ['Examples and figures that are not needed', 'The main points', 'The topic'], correctIndex: 0 },
      { id: 'chain-voc', type: 'vocabulary', afterPage: 5, word: 'traceability', definition: 'Being able to find out where a product came from.', distractors: ['Being very cheap', 'Being very old'] },
      { id: 'chain-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The class plays the chain from farm to table.', 'Madam Yartey tells the Rwanda coffee story.', 'The class picks one small step for a Ghanaian crop.', 'Sumaiya writes a summary.'] },
      { id: 'chain-sel', type: 'sel', afterPage: 8, prompt: 'Every link in a chain matters. How do you feel about being one link?', feelingOptions: ['Important', 'Curious', 'Hopeful', 'Responsible'] },
    ],
    glossary: [
      { word: 'processor', definition: 'A person or business that changes a crop into another product.', pages: [1] },
      { word: 'cassava', definition: 'A starchy root crop that is used to make gari and other foods.', pages: [2] },
      { word: 'cooperatives', definition: 'Groups of people who own and run a business together.', pages: [4] },
      { word: 'traceability', definition: 'Being able to find out where a product came from.', pages: [5] },
      { word: 'summary', definition: 'A short account of the main points of a longer text.', pages: [7, 8] },
    ],
    culturalNotes: ['Madam Yartey, Sumaiya, Wumpini and the class are invented. The prices in the cassava example are imaginary and labelled so. The statement that selling at harvest was linked to a loss of about 29 per cent of grain sales value comes from a study cited in a 2018 IFPRI paper on post-harvest loss.', 'The Rwanda facts come from a trade article that is not recent: aid-funded projects built washing stations and organised cooperatives from 2000; specialty coffee is fully washed, scores above 85 points and is traceable; about 27 per cent of exported coffee is specialty, up from almost none in 2000; it sells for 15 to 25 per cent above market prices; one cooperative manager says his income is about five times what it was before 2001. The manager’s figure is his own account, and the story says so.', 'The story does not say middlemen are villains: it shows that each link has costs and risks, and it asks the class to find the one small step a crop in their own district needs.'],
    reviewQuestions: ['Have an agribusiness specialist check the cassava chain description and the idea of value addition, and replace the imaginary prices with real local ones in class.', 'Check the Rwanda figures against a more recent source, and check the date of the trade article, then update or label the figures as dated.', 'Check the summary-writing tip and the word count (43 words) against the NaCCA English syllabus.'],
    guide: {
      overview: 'A story that turns a classroom into a farm-to-table chain, with a Rwandan example of cooperatives and shared processing. It models a summary of 45 words or fewer.',
      lessonMinutes: 50,
      goals: ['Name six links in a farm-to-market chain and say one cost or risk for each.', 'Explain value addition with an example.', 'Write a summary of 45 words or fewer that keeps the main points.'],
      subjects: [['Agricultural Science', 'Agricultural marketing and value addition'], ['Career Technology', 'Enterprise'], ['English Language', 'Summary writing']],
      before: ['Ask: who has handled the food on your plate before it reached you?'],
      during: ['At page 2, let learners act the chain with real or paper props.'],
      after: ['Draw the chain for a food your family eats and mark one place where it could be improved.', 'Write a 45-word summary of the lesson.'],
      discussion: ['Why might the farmer and the shopkeeper see the prices differently?', 'What did the Rwandan example need besides cooperatives?'],
      reflection: ['If you were a link in a food chain, which would you choose and why?'],
      maths: [
        { task: 'Suppose cassava sells at GH¢100 and the gari made from it sells at GH¢250. What is the difference, and what percentage of the selling price is it?', answer: '250 − 100 = GH¢150; 150 ÷ 250 × 100 = 60 per cent.' },
        { task: 'A summary must be 45 words or fewer. A pupil writes 43 words. How many words are left?', answer: '45 − 43 = 2 words.' },
      ],
      support: ['Give a summary frame: one sentence on the chain, one on value addition, one on the Rwanda example, one on what Ghana could do.'],
      stretch: ['Write a report recommending one small step for a crop in your district, with a heading, an introduction, findings and a recommendation.'],
      localise: ['Visit or interview a local processor (with an adult) such as a gari or oil processor and use real costs and prices.'],
      factCheck: [
        { claim: 'Rwanda’s specialty coffee grew from almost none in 2000 to about 27 per cent of coffee exports after aid-funded projects built washing stations and organised farmers into cooperatives; it sells for 15 to 25 per cent above market prices; one cooperative manager says his income is about five times what it was before 2001.', explanation: 'From a trade article that is not recent; the manager’s figure is his own account.', reference: 'How we made it in Africa, “How Rwanda is making a name for itself in ‘specialty’ coffee” (howwemadeitinafrica.com).' },
        { claim: 'One study cited in a 2018 paper linked selling grain straight after harvest to a loss equal to 29.3 per cent of grain sales value because of seasonal price swings.', explanation: 'A figure from a study cited in the paper, not from the paper’s own data.', reference: 'Baral, S. and Hoffmann, V. (2018), IFPRI Working Paper on post-harvest loss in Ghana (cgspace.cgiar.org).' },
      ],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'milk-middlemen-and-a-cooperative',
    title: 'Milk, Middlemen and a Cooperative',
    summary: 'Eyram’s village has one buyer who sets the price for everyone’s vegetables. Her teacher tells the story of Anand in India, where small milk farmers in 1946 formed a cooperative with village societies, district unions and a state federation, and slowly built one of the world’s largest dairy businesses. The class asks what Ghanaian farmers could borrow, hears how cooperatives can fail, and practises reported speech. A story about farmers working together, with reported speech in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['educational', 'historical', 'school-life'],
    themes: ['farm-and-garden', 'community', 'leadership', 'money-and-enterprise'],
    objectives: ['teamwork', 'citizenship', 'critical-thinking', 'reading-comprehension'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 118,
    paceWord: 'Clear and story-like, slowing for the grammar rules on the last pages',
    palette: ['#be185d', '#0f766e'],
    voice: 'A strong, fair-minded girl’s voice for Eyram; a warm storyteller’s voice for Mr Dadzie',
    characters: [
      'Eyram Hormeku: a 14-year-old girl in a school uniform, with a notebook, standing with a basket of vegetables.',
      'Mr Dadzie: the agriculture teacher, in a plain shirt, with a map of India and a drawing of milk cans.',
      'Yaw Agyemang: a 13-year-old boy in a school uniform, with his hand raised.',
      'The village buyer: a man in a cap with a notebook, standing beside a pickup truck full of crates.',
    ],
    music: 'Warm, steady drums with a gentle flute; a lifting chorus at the mock meeting (placeholder)',
    pages: [
      pg('🥕', 'Eyram’s village grew good vegetables, but only one buyer came to collect them. He set the price for everyone, and nobody could argue. “Take it or leave it,” he would say, and the vegetables would soften in the sun. Eyram told her agriculture teacher, Mr Dadzie, at the Young Farmers Club. “Sir, why must one man decide the price for the whole village?” she asked. Mr Dadzie smiled. “Let me tell you about Anand,” he said.', 'A girl with a basket of vegetables stands in front of a buyer’s pickup truck.'),
      pg('🥛', '“Anand is a town in Gujarat, in India,” said Mr Dadzie. “In the 1940s, small milk farmers in the Kaira area sold milk to agents. According to an encyclopaedia account, a private company had an effective monopoly, meaning it was the only buyer, on collecting milk from Kaira and supplying it to Mumbai. Prices were set arbitrarily. In 1946, the farmers formed a cooperative so that they could sell directly. It was registered on 14 December 1946 as the Kaira District Co-operative Milk Producers’ Union.”', 'A teacher points to a map of India with a drawing of milk cans and a small town marked.'),
      pg('🏘️', '“How did it work?” asked Yaw. Mr Dadzie drew three boxes. “In every village, the milk producers form a village society and elect the members who manage it. The village societies together form a district union, which collects, processes and transports the milk. The district unions together run a state federation that markets the products, led by elected representatives who hire professional managers. This three-level structure is called the Anand pattern. Its brand is called Amul.”', 'A teacher draws three boxes labelled village, district and state, linked by arrows.'),
      pg('📊', '“Today, the same account reports 3.6 million milk producers,” said Mr Dadzie. “It also says that, under its leader, the farmer received the largest share of what the customer paid, but it gives no percentage, so I will not give one. And remember, it took decades. Anand did not become big in one year.” Eyram wrote: farmers own it, farmers elect leaders, professionals manage it, farmers get the biggest share. She added a question mark. “How do they keep it honest?” she asked.', 'A teacher points to a bar chart of producers growing over many years beside a milk can.'),
      pg('⚠️', '“Good question,” said Mr Dadzie. “Cooperatives can fail. They fail when records are poor, when leaders are not honest, when members do not attend meetings, or when the group cannot sell what it makes. So rules, records and regular accounts matter as much as the idea. And Anand is not Ghana. Our crops, our laws and our markets are different. We borrow the lesson, which is that farmers can own the link that pays them, but we do not copy the whole plan.”', 'A teacher writes honest records and regular meetings on the board beside a locked cash box.'),
      pg('🗳️', 'The Young Farmers Club held a pretend meeting. Eyram was elected chairperson, Yaw secretary and another pupil treasurer. They wrote rules: every member would have one vote, all money would be recorded, accounts would be read aloud every month, and nobody would sell secretly outside the agreed price. Mr Dadzie reminded them to ask the district office responsible for cooperatives how a real society is registered, because he had not checked the current rules.', 'Pupils sit in a circle at a mock meeting while a girl in front writes rules on a flip chart.'),
      pg('🗣️', 'Mr Dadzie then set a reported-speech task. “‘The farmers formed a cooperative in 1946,’ said Mr Dadzie,” he wrote, and the class changed it: Mr Dadzie said that the farmers had formed a cooperative in 1946. “‘We will elect our leaders,’ said Eyram.” Eyram said that they would elect their leaders. “‘Do you want to join?’ asked Yaw.” Yaw asked me whether I wanted to join. “‘I am attending the meeting tomorrow,’ said Eyram.” Eyram said that she was attending the meeting the next day.', 'A teacher writes three direct sentences and three reported ones on the board in two colours.'),
      pg('✅', 'Exam-safe tip: in reported speech, remove the quotation marks, add “that” (or “if” or “whether” for yes-or-no questions), and move the verb one step back in time: “will” becomes “would”, “am” or “is” becomes “was”, and the simple past becomes the past perfect. Change pronouns and time words too: “tomorrow” becomes “the next day”, and “today” becomes “that day”. Check each sentence for sense before you hand in your work. The end.', 'A girl and her teacher compare direct and reported sentences, with the changed words underlined.'),
    ],
    activities: [
      { id: 'milk-c1', type: 'comprehension', afterPage: 4, question: 'In the Anand pattern, who elects the managers at the village level?', options: ['The milk producers', 'A private company', 'Government inspectors'], correctIndex: 0 },
      { id: 'milk-p1', type: 'prediction', afterPage: 5, prompt: 'What might make a farmers’ cooperative fail?', options: ['Poor records and dishonest leaders', 'Good records and regular meetings', 'Honest accounts read aloud'] },
      { id: 'milk-c2', type: 'comprehension', afterPage: 8, question: 'Which word replaces “will” in reported speech?', options: ['Would', 'Shall', 'Was'], correctIndex: 0 },
      { id: 'milk-voc', type: 'vocabulary', afterPage: 3, word: 'monopoly', definition: 'When only one buyer or seller controls a market.', distractors: ['A kind of cooperative', 'A type of milk'] },
      { id: 'milk-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Eyram complains that one buyer sets the price.', 'Mr Dadzie tells the story of Anand.', 'The club holds a mock meeting.', 'The class practises reported speech.'] },
      { id: 'milk-sel', type: 'sel', afterPage: 8, prompt: 'Farmers who work together can change who sets the price. How do you feel?', feelingOptions: ['Hopeful', 'Curious', 'Cautious', 'Determined'] },
    ],
    glossary: [
      { word: 'cooperative', definition: 'A group of people who own and run a business together.', pages: [2] },
      { word: 'monopoly', definition: 'When only one buyer or seller controls a market.', pages: [2] },
      { word: 'federation', definition: 'A large group made up of smaller groups that work together.', pages: [3] },
      { word: 'treasurer', definition: 'The person who keeps a group’s money and records.', pages: [6] },
      { word: 'reported', definition: 'Told to someone else in different words.', pages: [8] },
    ],
    culturalNotes: ['Eyram, Mr Dadzie, Yaw and the village buyer are invented. The buyer is not presented as a villain; he is shown as one person in a village that has no choice of buyers. The Anand facts come from an encyclopaedia account of Amul: founded in 1946 as the Kaira District Co-operative Milk Producers’ Union; a private company had an effective monopoly on collecting milk from Kaira and supplying it to Mumbai; prices were set arbitrarily; a three-tier structure of village societies, district unions and a state federation; 3.6 million milk producers; the account says that under its long-time leader the primary producer received the largest share of the consumer’s rupee, without a percentage.', 'The story says that Amul took decades to grow and that cooperatives can fail through poor records, dishonest leaders and weak sales. It does not claim that the Anand pattern can be copied in Ghana. It does not state how cooperatives are registered in Ghana; it tells readers to ask.', 'The reported-speech examples follow standard rules: backshift of tenses, changed pronouns and time words, and “whether” for a yes-or-no question.'],
    reviewQuestions: ['Check the Anand facts (the 1946 date, the three-tier structure, the 3.6 million producers) against a more authoritative source such as Amul’s own account or a dairy-development source, and update or label the figures as dated.', 'Check how farmer cooperatives are registered and supervised in Ghana (for example with the department responsible for cooperatives) and add the current office to the guide.', 'Check the reported-speech examples and rules against the NaCCA English syllabus.'],
    guide: {
      overview: 'A story about how small farmers can own the link that pays them, told through the Anand dairy cooperative in India. It shows the risks of cooperatives as well as the benefits and models reported speech.',
      lessonMinutes: 45,
      goals: ['Describe the three levels of the Anand cooperative.', 'Give two reasons a cooperative can fail.', 'Change direct speech to reported speech with correct tense, pronouns and time words.'],
      subjects: [['Social Studies', 'Cooperation and economic organisation'], ['Agricultural Science', 'Farmers’ organisations'], ['English Language', 'Reported speech']],
      before: ['Ask: who decides the price of what your family sells or buys? What happens if there is only one buyer?'],
      during: ['At page 3, ask learners to draw the three boxes before looking at the page.'],
      after: ['Hold a mock cooperative meeting with a chair, secretary and treasurer, and write three rules.', 'Write six sentences in direct speech and change them to reported speech.'],
      discussion: ['Why might a farmers’ group have more power than one farmer?', 'What could members do to keep leaders honest?'],
      reflection: ['What would you want from a group before you trusted it with your money or your crop?'],
      maths: [
        { task: 'Suppose a cooperative has 4 villages with 25 members each. How many members are there?', answer: '4 × 25 = 100 members.' },
        { task: 'If each member pays a joining fee of GH¢10 (an imaginary figure), how much do they collect?', answer: '100 × 10 = GH¢1,000.' },
      ],
      support: ['Give a reported-speech chart with direct, reported, and the changes: tense, pronoun, time word.'],
      stretch: ['Write a formal letter to a district office asking how a farmers’ group can be registered as a cooperative, with the eight formal-letter features.'],
      localise: ['Ask your district agriculture office or the department responsible for cooperatives how a group is registered and what support exists; use local crops and groups instead of the Indian example.'],
      factCheck: [
        { claim: 'Amul began in 1946 when small dairy farmers in the Kaira district formed a cooperative so that they could sell milk directly instead of through a company with an effective monopoly on collecting milk and supplying Mumbai; it has a three-tier structure of village societies, district unions and a state federation; it is reported to have 3.6 million milk producers.', explanation: 'From an encyclopaedia account; the producer figure is its present-tense report and the account gives no percentage for the farmer’s share.', reference: 'Wikipedia, “Amul” (en.wikipedia.org). Verify with Amul or a dairy-development source.' },
      ],
    },
  }),

  // 8 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-small-plan-that-can-grow',
    title: 'The Small Plan That Can Grow',
    summary: 'A youth club, some of whose families have worked in small-scale mining, has a little money and many big ideas. Their leader helps them weigh beekeeping, which needs low capital but patient learning and living trees, and a village savings group, which can build discipline and small loans but, according to a Ghana study, did not by itself transform incomes. They agree to learn first, start tiny and keep records. Raphael writes an informal letter to his cousin. A story about small, honest businesses, with an informal letter in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'educational', 'moral'],
    themes: ['money-and-enterprise', 'community', 'farm-and-garden', 'new-beginnings'],
    objectives: ['financial-literacy', 'perseverance', 'responsibility', 'environmental-awareness'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 118,
    paceWord: 'Warm and encouraging, slowing for the honest cautions and the letter',
    palette: ['#ca8a04', '#166534'],
    voice: 'A thoughtful boy’s voice for Raphael; a bright, practical voice for Fati; a calm, fatherly voice for Mr Kyeremeh',
    characters: [
      'Raphael Safo: a 15-year-old boy in a T-shirt and shorts, holding a notebook and a pencil.',
      'Fati Ahenkorah: a 14-year-old girl in a school uniform, holding a small cash book.',
      'Mr Kyeremeh: the youth club leader, in a polo shirt, with a clipboard.',
      'A bee frame: a wooden frame with honeycomb, shown only in a drawing on the board, with a beekeeper’s veil beside it.',
    ],
    music: 'Gentle, bright guitar with soft hand drums; a quiet, hopeful tune at the letter (placeholder)',
    pages: [
      pg('💡', 'The youth club had GH¢500 from a fundraising day, and everybody had an idea. “A shop!” said one. “Fish farming!” said another. Raphael, whose father had dug for gold, wanted something that could help families like his. Fati held the cash book. “Ideas are free,” she said. “Money is not. Let us ask Mr Kyeremeh how to choose.” Mr Kyeremeh, the club leader, smiled. “First rule,” he said. “Start small and learn before you spend.”', 'A group of young people sit in a circle with a small cash box and a board full of ideas.'),
      pg('🐝', 'Mr Kyeremeh read from a Ghana News Agency feature from August 2026 about beekeeping. “Quoted beekeepers say it needs relatively low start-up money, has no feed costs and can use land that is not good for crops. They say a modest set-up of twenty to fifty hives can bring a reliable profit each quarter, but the article cites unnamed industry data and gives no figures, so I treat that as a claim. Products include honey, beeswax and propolis. The beekeepers also say bush burning and tree felling destroy the flowers that bees need.”', 'A leader reads from a printed article beside a drawing of a hive, honey jars and candles.'),
      pg('🌳', '“Notice something,” said Mr Kyeremeh. “Bees need trees and flowers. If the forest is burnt, the bee business suffers. A bee business is a reason to protect trees, not to cut them.” Fati added: “And bees also pollinate crops.” “But,” said Mr Kyeremeh, “nobody should go near a hive without training and a protective veil. Stings can be dangerous, especially for people who are allergic. So our first step is not to buy hives. It is to visit a trained beekeeper and learn.”', 'A leader points to a drawing of bees visiting flowers on a tree beside a beekeeper’s veil.'),
      pg('🏦', '“Now money habits,” said Mr Kyeremeh. “A research summary describes village savings and loan associations in northern Ghana. Members met weekly and saved in a locked box. The group set the interest on loans. Most groups had an emergency fund. They averaged about twenty-four members and were supported by an NGO for nineteen to thirty months. The study found that more women had savings and loans, with half of members getting a group loan at about ten per cent interest, typically for a month.”', 'A leader points to a drawing of a locked box with a key, a ledger and a group of women at a table.'),
      pg('⚖️', '“But here is the honest part,” said Mr Kyeremeh. “The same study found no clear effects on average household spending, livelihoods or small businesses. The researchers suggested that the savings were too small, often under one dollar a week. So a savings group helps with discipline and small loans, but it is not magic. It works best alongside a real plan.” Raphael nodded slowly. “So we use it as a tool, not a miracle,” he said.', 'A leader writes tool, not a miracle on the board beside a small piggy bank.'),
      pg('✉️', 'That night, Raphael wrote to his cousin Hudu in the city. At the top right, he wrote: House 3, Church Street, Akim Oda, and the date, 5th April, 2027. “Dear Hudu, I hope you are well. Guess what? Our club has GH¢500 and big ideas, but Mr Kyeremeh says we must start small. We will visit a trained beekeeper first, and we are starting a savings group. I know it will not make us rich overnight, but I’m excited! Please send me any tips about keeping records. Say hello to Auntie. Write soon. Yours ever, Raphael.”', 'A boy writes a letter by lamplight, with an address and date at the top right of the page.'),
      pg('📒', 'Weeks later, the club’s savings group met every Friday. Each member put in a small amount, and Fati recorded every pesewa in the cash book and read it aloud. They also arranged to visit a trained beekeeper, and agreed that nobody would handle a hive until they had been taught. They had no promise of profit. They had a plan, a record and a habit. “That is how big things begin,” said Mr Kyeremeh. “Small, careful and honest.”', 'Young people sit in a circle at a Friday meeting while a girl reads from a cash book.'),
      pg('✅', 'Exam-safe tip: an informal letter has the sender’s address at the top, the date, “Dear” and the first name, an introduction, a body, a conclusion and a friendly closing such as “Yours ever” or “Your loving friend”. Contractions are allowed in informal letters, as Raphael used “I’m”, but remember that formal letters allow none. Keep to one topic in each paragraph and use clear, polite language. The end.', 'A boy and his leader read the informal letter with its parts labelled in the margin.'),
    ],
    activities: [
      { id: 'plan-c1', type: 'comprehension', afterPage: 3, question: 'What do bees need that links them to the forest?', options: ['Trees and flowers', 'Sugar from a shop', 'Plastic hives only'], correctIndex: 0 },
      { id: 'plan-p1', type: 'prediction', afterPage: 5, prompt: 'The study found no clear effect on average household spending. What does that suggest about savings groups?', options: ['They are a tool, not a miracle', 'They never help', 'They make everyone rich'] },
      { id: 'plan-c2', type: 'comprehension', afterPage: 8, question: 'How does an informal letter often end?', options: ['Yours ever', 'Yours faithfully', 'Yours sincerely, Sir'], correctIndex: 0 },
      { id: 'plan-voc', type: 'vocabulary', afterPage: 3, word: 'pollinate', definition: 'To carry pollen so that a flower can make fruit or seeds.', distractors: ['To eat flowers', 'To water a plant'] },
      { id: 'plan-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The club has GH¢500 and many ideas.', 'Mr Kyeremeh explains beekeeping and savings groups.', 'Raphael writes an informal letter to his cousin.', 'The club starts a savings group and plans to visit a beekeeper.'] },
      { id: 'plan-sel', type: 'sel', afterPage: 8, prompt: 'Starting small can feel slow. How do you feel about it?', feelingOptions: ['Patient', 'Hopeful', 'Realistic', 'Determined'] },
    ],
    glossary: [
      { word: 'beekeeping', definition: 'Keeping bees in hives to make honey and beeswax.', pages: [2] },
      { word: 'propolis', definition: 'A sticky substance that bees make from tree resin.', pages: [2] },
      { word: 'pollinate', definition: 'To carry pollen so that a flower can make fruit or seeds.', pages: [3] },
      { word: 'interest', definition: 'Extra money paid for borrowing money, or earned for saving it.', pages: [4] },
      { word: 'discipline', definition: 'The habit of doing what you planned to do.', pages: [5] },
    ],
    culturalNotes: ['Raphael, Fati, Mr Kyeremeh, Hudu and the club are invented, and the address in the letter is invented. Some members come from mining families; the story treats them with dignity and does not suggest that any of them is to blame.', 'The beekeeping facts come from a Ghana News Agency feature (3 August 2026) quoting beekeepers in the Volta Region: low start-up capital, no feed costs, use of marginal land, products (honey, beeswax, propolis, honeycomb), bush burning and tree felling as threats, and a lack of processing machinery and logistics. The claim about 20 to 50 hives giving reliable quarterly profit cites unnamed industry data and no figures, so the story calls it a claim.', 'The savings-group facts come from a randomised study summary in northern Ghana: weekly meetings, a locked box, interest on loans, an emergency fund, an average of about 24 members; 36 per cent of households in programme villages had a member compared with 8 per cent; half of members got a group loan at about 10 per cent interest, typically for a month; better access to credit and savings for women; no detected effects on average consumption, livelihoods or microenterprise outcomes. The story shares both the benefits and the limit.', 'The story does not give prices for hives, training or equipment because none were verified. The GH¢500 is an imaginary starting sum. The story says that nobody should handle a hive without training and protective clothing.'],
    reviewQuestions: ['Have a trained beekeeper or an agricultural extension officer check the beekeeping details, the safety advice and the claim about trees and flowers, and add real local start-up costs in class.', 'Check the savings-group summary against the full study and consider whether groups run by other organisations in Ghana give different results.', 'Check the informal-letter tip and the use of a contraction against the NaCCA English syllabus.'],
    guide: {
      overview: 'A story about choosing a small, careful first business. It weighs beekeeping and a savings group, shows their limits and models an informal letter.',
      lessonMinutes: 45,
      goals: ['Explain why a first business should start small and with learning.', 'Describe how a village savings group works and what a study found about its effects.', 'Write an informal letter with all the expected parts.'],
      subjects: [['Career Technology', 'Enterprise'], ['Agricultural Science', 'Beekeeping and pollination'], ['Mathematics', 'Saving and simple profit'], ['English Language', 'Informal letter writing']],
      before: ['Ask: what small business could you start with a very small amount of money? What would you need to learn first?'],
      during: ['At page 5, ask learners to say what a tool is and what a miracle is, and why the difference matters.'],
      after: ['Write an informal letter to a friend or cousin about a plan you have.', 'Draw a simple cash book with the columns date, money in, money out, balance.'],
      discussion: ['Why might a savings group help with discipline even if it does not make people rich?', 'How can a business help to protect trees?'],
      reflection: ['What is one habit you could start this month that would make a big plan possible later?'],
      maths: [
        { task: 'Suppose a club of 12 members each saves GH¢5 a week. How much does the group save in one week and in 10 weeks?', answer: '12 × 5 = GH¢60 a week; 60 × 10 = GH¢600.' },
        { task: 'Suppose a loan of GH¢100 carries 10 per cent interest for one month. How much is repaid?', answer: '10 per cent of 100 = 10, so the repayment is GH¢110.' },
        { task: 'Suppose a cash book shows money in GH¢90 and money out GH¢35. What is the balance?', answer: '90 − 35 = GH¢55.' },
      ],
      support: ['Provide an informal-letter frame with labelled parts: address, date, Dear…, introduction, body, conclusion, closing, name.'],
      stretch: ['Write a business plan summary for a small club project, with a purpose, steps, a record-keeping plan and a risk, in a heading and four short paragraphs.'],
      localise: ['Invite a trained local beekeeper or a member of a village savings group to answer learners’ questions (with a teacher present); use real local prices and rules instead of imaginary sums.'],
      factCheck: [
        { claim: 'Beekeepers quoted in a 2026 Ghana News Agency feature say beekeeping needs relatively low start-up capital, has no feed costs and can use marginal land, with products including honey, beeswax and propolis, and that bush burning and tree felling destroy nectar and pollen sources.', explanation: 'The feature presents these as the views of the quoted beekeepers; its claim about 20 to 50 hives giving reliable profit cites unnamed industry data and gives no figures.', reference: 'Ghana News Agency, “Can apiculture curb Ghana’s unemployment, fuel local growth?” (3 August 2026, gna.org.gh).' },
        { claim: 'In a randomised study in northern Ghana, 36 per cent of households in programme villages had a savings-group member compared with 8 per cent elsewhere; groups averaged about 24 members; half of members got a group loan at an average of about 10 per cent interest; the study found better access to credit and savings for women but no detected effects on average consumption, livelihoods or microenterprise outcomes.', explanation: 'From a research summary of the evaluation; the authors suggest savings were too small to have a transformative effect.', reference: 'Abdul Latif Jameel Poverty Action Lab, “Improving Financial Inclusion and Welfare Outcomes among Women through Savings Groups in Ghana” (povertyactionlab.org).' },
      ],
    },
  }),
];
