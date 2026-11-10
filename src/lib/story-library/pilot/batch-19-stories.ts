/**
 * Batch 19: Galamsey. Eight stories on illegal small-scale gold mining and what it does to rivers, health,
 * children, farms, forests and the future: the muddy river and turbidity, mercury and bioaccumulation, a child who
 * leaves school for the pit, a cocoa farmer's offer, a chief's long night, a mock Parliament on the law,
 * journalists, scientists and civil society, and a closing story that imagines two futures.
 *
 * Rules: as Batches 13 to 18. All text is original and every character, chief, town and organisation in the
 * fiction is invented. Facts are paraphrased from the sources named in each fact-check list; figures that differ
 * between sources are shown as differing. Claims about corruption or weak enforcement are shown as allegations or
 * opinion, never as proven facts about a named person or group. No politician, party, chief or private person is named
 * or implied. Stories give every role (government, Assembly, chiefs, farmers, miners, teachers, doctors,
 * journalists, civil society, children) a duty and none is made the only villain. Mercury and mining processes
 * are described for understanding only. Children are never shown in danger. All stories are drafts awaiting review.
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

export const BATCH_19_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-river-that-changed-colour',
    title: 'The River That Changed Colour',
    summary: 'Ntow and Mamle remember the river as clear. Now it runs brown. With their teacher they test muddy water, learn what turbidity means, see why the town’s water plant struggles, and find out who is trying to heal the river.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'fluent',
    difficulty: 3,
    genres: ['educational', 'science', 'nature'],
    themes: ['community', 'weather', 'health-and-wellbeing'],
    objectives: ['environmental-awareness', 'scientific-curiosity', 'reasoning', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 115,
    paceWord: 'Curious and clear, slower at the muddy water',
    palette: ['#b45309', '#0e7490'],
    voice: 'Curious young voices for Ntow and Mamle; calm, encouraging voice for Mr Appiah',
    characters: [
      'Ntow: a 10-year-old boy in a school uniform, with a plastic bottle and a pencil.',
      'Mamle: his classmate, 10, in a school uniform, who remembers swimming in the river.',
      'Mr Appiah: their science teacher, in a blue shirt, holding two clear jars.',
      'The river: a wide river that is clear in one picture and thick brown in the next, with a water plant on the bank (story picture).',
    ],
    music: 'Gentle flowing water becoming heavy and slow; a hopeful tune at the end (placeholder)',
    pages: [
      pg('🏞️', 'Mamle used to swim in the river when she was small. The water was clear enough to see her toes. Today, on the way to school, she stopped on the bridge and stared. The river was thick and brown, like cocoa drink. “Mr Appiah,” she said in class, “what happened to our river?”', 'A girl stands on a bridge looking down at a thick brown river; a faded picture shows the same river clear.'),
      pg('🫙', 'Mr Appiah brought two jars. One held clean water. In the other he stirred a spoon of soil. “This is how cloudy water looks,” he said. “Scientists measure it with a word: turbidity. The more tiny bits of soil and clay in the water, the higher the turbidity.” Ntow held the jars up to the window and tried to see through each one.', 'A teacher holds two jars to the light, one clear and one muddy, while children look through them.'),
      pg('⛏️', '“Why is our river so muddy?” asked Ntow. “One big reason is illegal mining, which people call galamsey,” said Mr Appiah. “Diggers dig in or beside the river and wash soil and gravel in the water. The mud runs downstream. Farming, timber cutting and sand winning can also add soil. But galamsey is named again and again for rivers like the Pra, the Ankobra, the Birim and the Offin.”', 'Diggers wash soil beside a river while brown water spreads downstream, drawn without showing any faces.'),
      pg('🔢', '“How muddy is it?” asked Mamle. “Scientists use a unit called NTU,” said Mr Appiah. “A minister said that the normal range is 0 to 500, and that some rivers have been measured at 5,000 to 12,000. Another writer says above 10,000. Numbers differ between reports and places, but all agree that it is far too high.”', 'A measuring scale showing 0 to 500 in green and a tall brown bar far above it.'),
      pg('🚰', '“What does it do to our water supply?” asked Ntow. “Our water plant takes water from the river and cleans it,” said Mr Appiah. “When the river is very muddy, the filters clog, the plant needs more chemicals and the cost goes up. The Ghana Water Company has had to shut plants, such as at Daboase and Kyebi, when the water was too muddy to treat. Then taps run dry.”', 'A water treatment plant with a clogged filter and a tap that gives only a drip.'),
      pg('🐟', '“And the fish?” asked Mamle. “Mud clouds the water so that plants cannot get sunlight and fish struggle to breathe and to find food,” said Mr Appiah. “Some miners also use chemicals like mercury, which we will study next term. A scientist says more than sixty per cent of Ghana’s water bodies are polluted by illegal mining. That is a claim we should check, but it shows the size of the problem.”', 'A river with few fish and muddy banks, next to a picture of a clear river full of fish.'),
      pg('🧪', 'Mr Appiah let the children make a filter with sand, gravel, cloth and a cut bottle. They poured the muddy jar through it. The water came out clearer, but not clean. “A filter like this takes out some mud,” he said. “It cannot take out mercury or germs. That is why prevention is better than cure: keep the river from being muddied in the first place.”', 'Children pour muddy water through a homemade bottle filter into a jar while others watch.'),
      pg('✅', 'The children wrote on a poster: A healthy river needs healthy banks. Ntow drew trees along the water. Mamle drew a clear river with children swimming. “Scientists think it could take ten to twenty years of steady work to heal our rivers,” said Mr Appiah. “That is longer than you have been alive. So you can be the grown-ups who finish it.” The end.', 'A child’s poster showing trees along a clear river with children swimming.'),
    ],
    activities: [
      { id: 'riv1-c1', type: 'comprehension', afterPage: 3, question: 'What does turbidity measure?', options: ['How cloudy the water is', 'How warm the water is', 'How fast the river runs'], correctIndex: 0 },
      { id: 'riv1-p1', type: 'prediction', afterPage: 5, prompt: 'When the river is very muddy, what might happen at the water plant?', options: ['It uses more chemicals and may shut down', 'It makes more clean water', 'Nothing changes'] },
      { id: 'riv1-c2', type: 'comprehension', afterPage: 7, question: 'Why can a home filter not make river water safe?', options: ['It cannot take out mercury or germs', 'It is too big', 'Sand is dirty'], correctIndex: 0 },
      { id: 'riv1-voc', type: 'vocabulary', afterPage: 2, word: 'turbidity', definition: 'How cloudy water is because of tiny bits of soil and clay.', distractors: ['How cold water is', 'How deep a river is'] },
      { id: 'riv1-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The river turns brown.', 'Mr Appiah shows turbidity with two jars.', 'The class learns how mud harms the water plant and fish.', 'The class makes a poster to protect the river banks.'] },
      { id: 'riv1-sel', type: 'sel', afterPage: 8, prompt: 'Rivers can take years to heal. How do you feel about being part of that work?', feelingOptions: ['Hopeful', 'Determined', 'Worried', 'Curious'] },
    ],
    glossary: [
      { word: 'turbidity', definition: 'How cloudy water is because of tiny bits of soil and clay.', pages: [2] },
      { word: 'galamsey', definition: 'The Ghanaian word for illegal small-scale gold mining.', pages: [3] },
      { word: 'downstream', definition: 'In the direction that a river flows, away from its source.', pages: [3] },
      { word: 'filters', definition: 'Layers that catch dirt as water passes through.', pages: [5] },
      { word: 'prevention', definition: 'Stopping something bad from happening.', pages: [7] },
    ],
    culturalNotes: ['This is a science story set in an invented school beside an invented river. The facts come from published reports named in the fact-check.', 'Not all mud in rivers comes from galamsey; the story names other causes too.', 'The numbers about turbidity differ between sources and the story says so.'],
    reviewQuestions: ['Check against named sources: turbidity of 5,000 to 12,000 NTU against a normal 0 to 500 (a minister, February 2025) versus above 10,000 NTU (a commentary); GWCL plant shutdowns including Daboase and Kyebi; a CSIR researcher’s claim that over 60 per cent of water bodies are polluted; rivers named (Pra, Ankobra, Birim, Offin); recovery estimate of 10 to 20 years (an editorial).', 'Confirm the safe NTU range with the Ghana Water Company or the Water Resources Commission before release.', 'Check that the home-filter activity is described as a demonstration only, not as a way to make river water safe to drink.'],
    guide: {
      overview: 'A science story that introduces turbidity, links galamsey to muddy rivers and water supply, and shows that prevention beats cure. It teaches careful reading of figures that differ.',
      lessonMinutes: 40,
      goals: ['Explain turbidity and how it is measured.', 'Describe how muddy rivers affect water plants, fish and people.', 'Explain why a home filter does not make river water safe.'],
      subjects: [['Integrated Science', 'Water and filtration'], ['Social Studies', 'Environment and community'], ['Mathematics', 'Reading scales and comparing numbers']],
      before: ['Fill two jars, one with clean water and one with muddy water, and ask learners which is safe to drink and why.'],
      during: ['At page 4, ask learners to compare 500 with 5,000 and 12,000.'],
      after: ['Make a bottle filter as a demonstration. Do not drink the water.', 'Draw a river with healthy banks.'],
      discussion: ['Why do figures sometimes differ between reports?', 'What can a community do to protect its river banks?'],
      reflection: ['What would you like your river to look like in twenty years?'],
      maths: [
        { task: 'Normal water is up to 500 NTU. A river has 5,000 NTU. How many times higher is it?', answer: '5,000 ÷ 500 = 10 times higher.' },
        { task: 'A river has 12,000 NTU. How many times higher than 500?', answer: '12,000 ÷ 500 = 24 times higher.' },
      ],
      support: ['Provide a picture scale with green, yellow and red zones.'],
      stretch: ['Design a way to measure how muddy a stream is using a clear tube and a marked disc.'],
      localise: ['Use your nearest river or stream; invite a water company or environmental officer.', 'Never let learners enter rivers; do the activity at school with an adult.'],
      discoveryStatus: {
        whatWeKnow: ['Illegal mining has made several rivers very muddy.', 'Water plants have shut down when water was too muddy to treat.'],
        whatWeAreStillDiscovering: ['The exact share of polluted water bodies.', 'How long it will take rivers to recover.'],
      },
      factCheck: [
        { claim: 'Water turbidity of 5,000 to 12,000 NTU against a normal range of 0 to 500; 44 of 288 forest reserves face serious threats from illegal mining.', explanation: 'Reported from a minister’s statement at a conference.', reference: 'Ghana News Agency, “Ghana’s cocoa farms under siege” (27 February 2025).' },
        { claim: 'More than 60 per cent of Ghana’s water bodies are polluted by illegal mining (a researcher’s statement); rivers affected include the Pra, Ankobra, Birim, Offin and Densu; the Ghana Water Company has repeatedly shut plants including at Daboase and Kyebi; recovery may take 10 to 20 years (an estimate).', explanation: 'From a Daily Graphic editorial of 12 August 2026, which is opinion.', reference: 'Graphic Online, “Can Ghana heal her water?”.' },
        { claim: 'Turbidity at some intakes above 10,000 NTU, about five times the treatable level; plants reduced output or shut; higher treatment costs.', explanation: 'From an opinion column that cites reports without providing them.', reference: 'GhanaWeb (Opinions), “Ghana’s rivers under siege” (2 December 2025).' },
      ],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'what-is-hiding-in-the-gold',
    title: 'What Is Hiding in the Gold?',
    summary: 'In the school laboratory, Selom and Nabila learn how mercury is used to catch gold, why it does not disappear when it is burned or washed away, how it travels from rivers to fish to people, and why children and unborn babies are most at risk. They also learn what is proven, what is warned, and the safer ways to get gold.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['educational', 'science', 'informational'],
    themes: ['health-and-wellbeing', 'community', 'technology'],
    objectives: ['scientific-curiosity', 'critical-thinking', 'environmental-awareness', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Clear and careful, slower at the health warnings',
    palette: ['#475569', '#b45309'],
    voice: 'Precise, kind voice for Madam Ayim; curious voices for Selom and Nabila',
    characters: [
      'Selom: a 14-year-old boy in a school uniform and safety goggles.',
      'Nabila: a 14-year-old girl in a school uniform and a lab coat, taking notes.',
      'Madam Ayim: their science teacher, in a white lab coat, with a gentle but serious manner.',
      'The laboratory: a school lab with a safe demonstration of a shiny coin and a clear glass tank (story picture; no real mercury shown).',
    ],
    music: 'Quiet, thoughtful synth tones with a slow pulse; silence at the health warnings (placeholder)',
    pages: [
      pg('🔬', 'Madam Ayim put on her lab coat and held up a photograph of a small gold bead. “Gold is beautiful,” she said, “and it is one of Ghana’s great resources. But the way some people get it can harm us for years. Today we study what is hiding in the gold. Please do not copy any of this at home. This is science for understanding, not instructions.”', 'A teacher holds up a photograph of a small gold bead in front of a class wearing goggles.'),
      pg('⚗️', '“In small-scale mining, some miners mix crushed ore with mercury,” said Madam Ayim. “Mercury is a liquid metal that sticks to tiny gold flecks and forms a lump called an amalgam. Then the amalgam is heated, the mercury turns to vapour, and the gold is left behind. Human Rights Watch reported in 2014 that mercury was sold openly in shops in Ghana.”', 'A diagram: ore, a liquid metal, a lump called amalgam and a heated dish releasing vapour.'),
      pg('💨', '“Where does the mercury go?” asked Nabila. “That is the problem,” said Madam Ayim. “When it is heated, the vapour can be breathed in by the miner, and sometimes by family members if the burning is done at home. When it is washed away, it settles in rivers and soil. Mercury is an element, so it cannot be destroyed. It only moves.”', 'Arrows showing vapour drifting from a burning dish and liquid flowing from a washing pit to a river.'),
      pg('🐟', '“In the river,” said Madam Ayim, “bacteria can change mercury into a form that living things absorb easily. Small animals take it in. Small fish eat them. Bigger fish eat the small fish. At each step the mercury builds up. We call this bioaccumulation. People who eat the fish take it in too.” Selom drew the food chain on the board with arrows.', 'A food chain drawing: bacteria, small animals, small fish, big fish, a person, with the mercury level rising at each step.'),
      pg('🧠', '“What does mercury do to us?” asked Selom. “It can damage the nervous system, including the brain, and the kidneys and heart. Children are especially at risk, because their bodies are still growing. For pregnant women, it can put the unborn baby at risk,” said Madam Ayim. “Doctors in Ghana have also warned about other metals, such as lead, cadmium and arsenic, in mining areas.”', 'A simple body outline highlighting the brain, kidneys and heart, with a small child and a pregnant woman nearby.'),
      pg('🧾', '“Let us be careful about what we know,” said Madam Ayim. “A team of Ghanaian scientists found heavy metals in placentas from mothers in galamsey areas. But doctors also say it is only logical to suspect kidney harm in children, because adult studies show it. Warnings are not the same as proof. We need more studies, and we should act carefully while we wait.”', 'A chart with two columns: What studies show / What doctors warn, with a question mark between them.'),
      pg('♻️', '“Is there a safer way?” asked Nabila. “Yes,” said Madam Ayim. “Gold can be separated by methods that do not use mercury, such as gravity separation. Researchers at a Ghanaian university have also developed a device called the Lantern Retort, which traps mercury vapour so that less of it escapes. Better still is mercury-free processing, and strict control of mercury sales.”', 'A diagram of gravity separation in a sloping channel and a closed retort device.'),
      pg('✅', 'The pupils wrote questions for a visiting doctor: “How can families get tested? What should a mother do if she lives near a mining site?” Madam Ayim smiled. “Science asks questions,” she said, “and then it asks what we should do. Gold can shine without poisoning the people who live around it.” The end.', 'Pupils write questions on cards at their lab benches, with a doctor’s coat hanging on a hook.'),
    ],
    activities: [
      { id: 'gold-c1', type: 'comprehension', afterPage: 3, question: 'Why does mercury not just disappear when it is heated or washed away?', options: ['It is an element that cannot be destroyed, only moved', 'It turns into gold', 'It becomes water'], correctIndex: 0 },
      { id: 'gold-p1', type: 'prediction', afterPage: 4, prompt: 'Mercury builds up as it moves up the food chain. Who might have the most?', options: ['Big fish and people who eat them', 'Small plants', 'Soil'] },
      { id: 'gold-c2', type: 'comprehension', afterPage: 6, question: 'What does Madam Ayim say about warnings and proof?', options: ['Warnings are not the same as proof, so we need more studies and care', 'Warnings can be ignored', 'Proof is not needed'], correctIndex: 0 },
      { id: 'gold-voc', type: 'vocabulary', afterPage: 4, word: 'bioaccumulation', definition: 'The build-up of a harmful substance in living things as it moves up the food chain.', distractors: ['The growing of crops', 'The flow of a river'] },
      { id: 'gold-s1', type: 'sequencing', prompt: 'Put the mercury journey in order.', items: ['Mercury is used to catch gold.', 'Mercury enters the river or the air.', 'Small animals and fish absorb it.', 'People who eat contaminated fish take it in.'] },
      { id: 'gold-sel', type: 'sel', afterPage: 8, prompt: 'Learning about hidden dangers can be worrying. What helps you stay calm and act wisely?', feelingOptions: ['Calm', 'Curious', 'Concerned', 'Determined'] },
    ],
    glossary: [
      { word: 'mercury', definition: 'A heavy, silvery liquid metal that is poisonous to people.', pages: [2, 3] },
      { word: 'amalgam', definition: 'A mixture of mercury with another metal, such as gold.', pages: [2] },
      { word: 'vapour', definition: 'A gas formed when a liquid or solid is heated.', pages: [3] },
      { word: 'bioaccumulation', definition: 'The build-up of a harmful substance in living things.', pages: [4] },
      { word: 'retort', definition: 'A closed container that heats a substance and traps the gas it gives off.', pages: [7] },
    ],
    culturalNotes: ['This is a science story with an invented teacher and pupils. It is about understanding, not instructions.', 'The story separates what studies show from what doctors warn about, and says so.', 'It does not blame small-scale miners as people; it describes a process and its risks and says safer methods exist.'],
    reviewQuestions: ['Check against named sources: Human Rights Watch 2014 on mercury use, amalgam, vapour, burning at home, sale in shops, hand tremors; risks to the nervous system, kidneys and heart; children and pregnant women at greater risk; Prof Sampene’s team finding heavy metals in placentas; the paediatricians’ warnings (kidney harm is suspected, not proven in children); the Lantern Retort developed at UMaT.', 'Have a chemist, a toxicologist or a doctor review the science for accuracy and age-appropriateness.', 'Confirm the current legal status of mercury sales and Ghana’s Minamata Convention position before any update.'],
    guide: {
      overview: 'A science story about mercury and how it moves. It teaches bioaccumulation and the difference between evidence, warnings and speculation, and it shows safer alternatives.',
      lessonMinutes: 50,
      goals: ['Describe how mercury is used to catch gold and where it goes.', 'Explain bioaccumulation with a food chain.', 'Separate what is shown by studies from what is warned.'],
      subjects: [['Integrated Science', 'Elements, food chains and health'], ['Social Studies', 'Mining and community'], ['English Language', 'Reading for evidence']],
      before: ['Tell learners the lesson is for understanding and that no one should handle or test mercury.'],
      during: ['At page 6, ask learners to sort statements into Shown / Warned / Not known.'],
      after: ['Draw a food chain showing how a metal builds up.', 'List three questions to ask a health worker.'],
      discussion: ['Why can we not clean up a poison simply by washing it away?', 'How should we act when evidence is incomplete but a risk is serious?'],
      reflection: ['What would make gold mining safer for the people who live near it?'],
      maths: [
        { task: 'In a food chain, a substance doubles at each of four steps. If it starts at 1 unit, how much is there at the end?', answer: '1 × 2 × 2 × 2 × 2 = 16 units.' },
        { task: 'The placenta study covered 75 mother-infant pairs from 2021 to 2024. How many years is that, counting both?', answer: '2021, 2022, 2023, 2024 = 4 years.' },
      ],
      support: ['Provide a picture food chain with blanks for learners to fill.'],
      stretch: ['Research the Minamata disaster and write a short report on what Japan learned.'],
      localise: ['Invite a local health worker or environmental officer to answer questions.', 'Never bring mercury or any chemical into class.'],
      discoveryStatus: {
        whatWeKnow: ['Mercury is toxic and builds up in food chains.', 'Heavy metals have been found in placentas from mothers in galamsey areas.'],
        whatWeAreStillDiscovering: ['How much harm has already occurred in children living near mining sites.', 'Whether kidney damage in children matches what adult studies show.'],
      },
      factCheck: [
        { claim: 'Miners mix mercury with ore to form an amalgam and burn off the mercury; mercury damages the nervous system, kidneys and heart; children are especially vulnerable; vapour is inhaled, including at home; mercury was legal and sold openly in shops (2014); contaminated wastewater pollutes rivers and fish.', explanation: 'From a Human Rights Watch dispatch of October 2014. Laws and practice may have changed since.', reference: 'Human Rights Watch, “Mercury: Ghana’s poisonous problem” (10 October 2014).' },
        { claim: 'Heavy metals (lead, cadmium, mercury, arsenic) consistently found in placentas from mothers in galamsey areas; a birth-outcomes analysis of 75 deceased mother-infant pairs (2021 to 2024) across five regions; kidney harm in children is suspected from adult data, not proven; DNA effects are a warning.', explanation: 'From a report of a Paediatric Society workshop. The article separates reported findings from warnings.', reference: 'MyJoyOnline, “Exposure to galamsey-linked pollution could trigger acute kidney disease: Pediatric Society” (9 February 2026).' },
        { claim: 'Safer gold processing such as the Lantern Retort developed at UMaT is recommended.', explanation: 'From a forum report in which NGOs and officials recommended it.', reference: 'Ghanaian Times, “Poisoned playgrounds: National NGO forum demands urgent action to end child labour in galamsey” (1 August 2025).' },
      ],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'poku-leaves-the-classroom',
    title: 'Poku Leaves the Classroom',
    summary: 'Poku, 13, stops coming to school because he can earn money at a mining pit. His classmate Rashida and a social welfare officer try to understand why, learn what the law says about child labour, and help Poku and his family find a safer way back to school.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 11,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['realistic-fiction', 'school-life', 'educational'],
    themes: ['family', 'money-and-enterprise', 'helping-others'],
    objectives: ['kindness', 'responsibility', 'citizenship', 'emotional-intelligence', 'critical-thinking'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 115,
    paceWord: 'Gentle and unhurried, with respect for Poku',
    palette: ['#78350f', '#0f766e'],
    voice: 'Warm, concerned voice for Rashida; quiet, tired voice for Poku; calm, firm voice for Mrs Osafo',
    characters: [
      'Poku: a 13-year-old boy in worn clothes, thin and tired, with mud on his boots.',
      'Rashida: his classmate, 13, in a school uniform and a headscarf, holding his exercise book.',
      'Mrs Osafo: a social welfare officer in a plain dress, with a notebook and a gentle manner.',
      'Poku’s mother: a trader in a patterned cloth, working at a small table of tomatoes.',
    ],
    music: 'Quiet, slow guitar, with a small hopeful rise at the end (placeholder)',
    pages: [
      pg('📓', 'Poku’s seat was empty again. Rashida picked up his exercise book from his desk and looked at the last page he had written. It was only half finished. “Where is he?” she asked the class. Nobody knew. After school, she carried his book to his house at the edge of town, where the road turned brown and the trees ended.', 'A girl carries a boy’s exercise book along a road that changes from green to brown and bare.'),
      pg('🛠️', 'She found Poku near the river, with a shovel and a bucket, beside men digging in a pit. His boots were caked in mud. “I am not coming back,” he said. “A day here pays more than my mother makes in a week. My little sister needs medicine and our rent is due.” His voice was not proud. It was tired. Rashida said nothing for a moment.', 'A boy with a shovel stands at the edge of a mining pit, seen from a distance, with no faces shown.'),
      pg('📞', 'Rashida told her class teacher, who called Mrs Osafo, the social welfare officer. Mrs Osafo did not scold. “Poku is not a bad boy,” she said. “He is a boy with a hard problem. Let us find out the facts, and see what we can do for him, and for his mother.” She visited Poku’s mother, sat on a low stool, and listened.', 'A welfare officer sits with Poku’s mother at her small stall and listens with her notebook closed.'),
      pg('⚖️', '“Here is what the law says,” said Mrs Osafo to Rashida and her teacher. “The Children’s Act, the Labour Act and the Human Trafficking Act protect children from dangerous work and from being taken to work in places like pits. International rules treat mining work for children as one of the worst forms of child labour. A child may not be made to do work that harms their health or stops their schooling.”', 'A page of law titles, the Children’s Act, the Labour Act and the Human Trafficking Act, with a child’s drawing beside it.'),
      pg('📊', '“How many children are doing this?” asked Rashida. “Nobody knows exactly,” said Mrs Osafo. “A report from UNICEF in 2022 estimated that between twenty and thirty thousand children in Ghana take part in mining-related work. The Minerals Commission counted more than five thousand six hundred directly involved, and NGOs say that is probably too low. Many are between twelve and seventeen, and some are as young as five.”', 'A chart with two bars, 20,000 to 30,000 and 5,600, and a question mark between them.'),
      pg('⚠️', '“Why is it dangerous?” asked Rashida. “Pits can collapse, tools can injure, and children may handle mercury or cyanide without protection. They breathe dust and fumes, and they can lose years of school. Girls face extra risks, including being trafficked to mining sites under false promises. Our hearts go out to them, but our law must also protect them.” Rashida held Poku’s book tighter.', 'A pit with a warning sign and a school bag left at its edge, with no people in danger shown.'),
      pg('🤝', 'Mrs Osafo did three things. She helped Poku’s mother apply for a small support grant and a loan for her stall. She spoke to the headteacher about school feeding and a place for Poku in the afternoon class. And she asked a local group to give Poku a weekend job at a vegetable farm, safe and lawful. “It will not fix everything,” she told the family. “But it is a path back.”', 'A welfare officer, a headteacher and a mother stand together by the school gate, with a vegetable garden behind them.'),
      pg('✅', 'A month later, Poku walked through the gate in his uniform. He looked thinner than before, but he was smiling. Rashida handed him his exercise book. “You still owe us half a page,” she said. Poku laughed. “I will finish it,” he said. That evening he wrote in the margin: “School is not a place I escape. It is a place that gives me back my future.” The end.', 'A boy in school uniform walks through a school gate while a girl holds out his exercise book.'),
    ],
    activities: [
      { id: 'atta-c1', type: 'comprehension', afterPage: 2, question: 'Why did Poku stop coming to school?', options: ['He could earn money at the pit to help his family', 'He did not like his teacher', 'He moved to another town'], correctIndex: 0 },
      { id: 'atta-p1', type: 'prediction', afterPage: 4, prompt: 'Mrs Osafo listens before she acts. Why is that a good approach?', options: ['She learns the real problem and can find a fair answer', 'It wastes time', 'It makes Poku angry'] },
      { id: 'atta-c2', type: 'comprehension', afterPage: 7, question: 'What did Mrs Osafo do to help?', options: ['Support for the mother, a school place and safe weekend work', 'Nothing', 'Closed the school'], correctIndex: 0 },
      { id: 'atta-voc', type: 'vocabulary', afterPage: 4, word: 'trafficking', definition: 'Taking people, often children, to work or live somewhere by force, lies or threats.', distractors: ['Selling vegetables', 'Driving cars'] },
      { id: 'atta-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Poku stops coming to school.', 'Rashida finds him and tells her teacher.', 'Mrs Osafo listens and explains the law.', 'Poku returns to school with support.'] },
      { id: 'atta-sel', type: 'sel', afterPage: 8, prompt: 'Poku felt he had no choice. How can we show kindness to someone in a hard situation?', feelingOptions: ['Compassionate', 'Hopeful', 'Respectful', 'Concerned'] },
    ],
    glossary: [
      { word: 'pit', definition: 'A deep hole dug in the ground.', pages: [2] },
      { word: 'trafficking', definition: 'Taking people to work or live somewhere by force, lies or threats.', pages: [4] },
      { word: 'estimated', definition: 'Gave a careful guess about a number when the exact figure is not known.', pages: [5] },
      { word: 'grant', definition: 'Money given to help someone, which does not have to be paid back.', pages: [7] },
      { word: 'headteacher', definition: 'The teacher who leads a school.', pages: [7] },
    ],
    culturalNotes: ['Poku, Rashida and Mrs Osafo are invented. The story treats child labour with care, avoids graphic detail and does not blame children or poor families.', 'The numbers about children come from a forum report that cites UNICEF and the Minerals Commission; they are estimates and differ.', 'The grant, loan, school feeding and job in the story are examples of support; availability differs by district. Check local services.'],
    reviewQuestions: ['Check against named sources: UNICEF 2022 estimate of 20,000 to 30,000 children in mining-related activities; Minerals Commission count of more than 5,600 directly involved; ages 12 to 17 and some as young as five; hazards (pits, mercury, cyanide); girls’ risks including trafficking; Children’s Act (Act 560), Labour Act (Act 651), Human Trafficking Act (Act 694); ILO Convention 182.', 'Have a social welfare officer or child protection specialist review the story for realism and sensitivity.', 'Check that no sentence could make a learner feel blamed for working or for having a family that needs money.'],
    guide: {
      overview: 'A story about a child pulled from school by poverty and mining. It teaches the law on child labour, the real dangers, and how families, teachers and officers can work together.',
      lessonMinutes: 50,
      goals: ['Explain why a child might leave school for mining.', 'Name the laws that protect children from dangerous work.', 'Describe ways schools and communities can help children return.'],
      subjects: [['Social Studies', 'Child rights and the law'], ['Religious and Moral Education', 'Compassion and responsibility'], ['English Language', 'Reading and discussion']],
      before: ['Tell learners the story is about a hard topic and that some may know children like Poku. Remind them to speak kindly.'],
      during: ['At page 5, ask why numbers differ and why an undercount is possible.'],
      after: ['Role-play a kind conversation between a friend and a classmate who has left school.', 'List who can help a child in danger, and how to contact them locally.'],
      discussion: ['Why is it not enough to tell a child to go back to school?', 'What can friends do?'],
      reflection: ['What would you want a friend to do if you were in Poku’s position?'],
      maths: [
        { task: 'A day at the pit pays GH¢100 and a mother earns GH¢60 in a week. How many times more does the pit pay for one day than the mother earns in a week? (Numbers are invented for practice.)', answer: '100 ÷ 60 ≈ 1.7 times.' },
        { task: 'If 5,600 children are counted and the real number is 20,000, how many are missing from the count?', answer: '20,000 − 5,600 = 14,400.' },
      ],
      support: ['Provide a chart of people who can help: teacher, welfare officer, elder, health worker.'],
      stretch: ['Research how a community in another country reduced child labour.'],
      localise: ['Invite a social welfare officer or a child protection volunteer; learn the local reporting number.'],
      discoveryStatus: {
        whatWeKnow: ['Thousands of Ghanaian children are involved in mining-related work, and laws protect them.'],
        whatWeAreStillDiscovering: ['The exact number of children involved, which official and NGO counts give differently.'],
      },
      factCheck: [
        { claim: 'A 2022 UNICEF report estimates 20,000 to 30,000 children in mining-related activities; the Minerals Commission counts more than 5,600 directly involved (the forum said likely an undercount); many are 12 to 17, some as young as five; hazards include mercury and cyanide; girls face dropout, early pregnancy, sexual violence and trafficking; laws include Children’s Act (560), Labour Act (651), Human Trafficking Act (694) and ILO Convention 182; enforcement is weak.', explanation: 'From a report of a National NGO Forum, with figures as reported there.', reference: 'Ghanaian Times, “Poisoned playgrounds: National NGO forum demands urgent action to end child labour in galamsey” (1 August 2025).' },
      ],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-cocoa-farm-and-the-offer',
    title: 'The Cocoa Farm and the Offer',
    summary: 'Opanin Badu’s cocoa farm has fed his family for forty years. A stranger offers him a large sum to let diggers into the farm. His grandson Tsatsu helps him count the cost, and the family learns what a cocoa tree is worth, what happens to a farm that becomes a pit, and what choices farmers really have.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 11,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['realistic-fiction', 'family', 'educational'],
    themes: ['family', 'money-and-enterprise', 'farm-and-garden'],
    objectives: ['financial-literacy', 'critical-thinking', 'responsibility', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 120,
    paceWord: 'Warm and reflective, slower at the decision',
    palette: ['#78350f', '#166534'],
    voice: 'Warm, measured voice for Opanin Badu; bright, practical voice for Tsatsu',
    characters: [
      'Opanin Badu: an elderly cocoa farmer in a straw hat and an old shirt, with a cutlass at his side.',
      'Tsatsu: his grandson, 13, in a school uniform, with a notebook and calculator.',
      'The stranger: a man in a clean shirt and sunglasses, with a folder, smiling too much (story picture).',
      'The cocoa farm: rows of tall cocoa trees with yellow and red pods, and a mining pit at the far fence (story picture).',
    ],
    music: 'Warm, slow highlife guitar with soft drums; a quiet, tense pause at the offer (placeholder)',
    pages: [
      pg('🌳', 'Opanin Badu’s cocoa farm had fed his family for forty years. Tsatsu loved to walk its rows with his grandfather, looking up at the yellow and red pods. “Every tree is a promise,” said Opanin Badu. “We plant it, we wait, and one day it feeds us.” That Saturday, a stranger in a clean shirt stood at the edge of the farm with a folder.', 'A grandfather and grandson walk between tall cocoa trees while a man in sunglasses waits by the fence.'),
      pg('💰', '“I want to rent part of your land,” said the stranger. “Two machines and a few diggers, and in six months you will have more money than ten seasons of cocoa. Nobody will know.” He opened his folder and showed a roll of notes. Opanin Badu did not speak. He looked at the cedis, then at the trees. Tsatsu’s heart beat hard.', 'A stranger holds up a folder with notes while an old farmer looks at the trees.'),
      pg('🧮', '“Grandpa, let us count it,” said Tsatsu that evening. He got out his notebook. “If the offer is for one acre, how many cocoa trees are on an acre?” “About four hundred, if they are well spaced,” said Opanin Badu. “And how long do they bear pods?” “Thirty years or more,” said the old man. Tsatsu wrote: 400 trees, 30 years. “That is twelve thousand tree-years of cocoa,” he said.', 'A notebook with sums, four hundred trees, thirty years, beside a candle and an old farmer’s hands.'),
      pg('📉', '“Now the other side,” said Tsatsu. “Radio said that cocoa’s chief executive reported thirty thousand hectares of cocoa farms destroyed by illegal mining and other causes by December 2024, and fifty thousand more at risk. Other reports give lower figures, such as nineteen thousand. The numbers differ, but the farms are real.” “And when the diggers leave?” asked Opanin Badu. “A pit,” said Tsatsu, “and poisoned soil.”', 'Two pictures: a green cocoa farm and the same land as a muddy pit with a lonely tree stump.'),
      pg('🌍', '“There is more,” said Tsatsu. “They say Japan and the European Union will test our cocoa for heavy metals. If our beans fail, buyers may refuse them, and every farmer in the area suffers. Cocoa supports about two million direct jobs, they say, and five million more indirectly. It is not just our farm. It is our road, our school, our market.” The old man closed his eyes.', 'A port with sacks of cocoa and a laboratory test tube, with a warning sign on one sack.'),
      pg('🤔', '“But Grandpa, I know why people say yes,” said Tsatsu. “Cocoa prices go up and down. A tree takes years to bear, and a single bad year can break a family. Some farmers have debts, sickness or school fees. Nobody is stupid for being tempted.” Opanin Badu nodded slowly. “Then the question is not only ‘should I?’,” he said. “It is also ‘what else can I do?’”', 'A farmer’s family sits around a table with bills and a calendar, looking worried but together.'),
      pg('🗳️', 'The next day they visited the cocoa farmers’ co-operative and the chief’s palace. Opanin Badu asked for help with replanting, for the buyers’ price to be fair and for the Assembly to stop the diggers at the fence. He told his neighbours about the offer. Three of them said, “He asked me too.” Together they decided to report the stranger, and to ask the elders to protect the farms.', 'Farmers and elders talk together under a tree, with a large map of farm boundaries on the ground.'),
      pg('✅', 'Opanin Badu gave the stranger a polite but firm answer. “My farm is not for rent,” he said. “It is for my grandson, and for his grandson.” That evening, Tsatsu planted a new cocoa seedling in a gap between two old trees. “How long will this one take?” he asked. “Three to five years to bear,” said Opanin Badu. “Then you will be a man.” They both laughed. The end.', 'A boy plants a cocoa seedling between two old trees while his grandfather watches, smiling.'),
    ],
    activities: [
      { id: 'coc-c1', type: 'comprehension', afterPage: 3, question: 'How long do cocoa trees bear pods, according to Opanin Badu?', options: ['Thirty years or more', 'One season', 'Two months'], correctIndex: 0 },
      { id: 'coc-p1', type: 'prediction', afterPage: 5, prompt: 'Tsatsu says people are not stupid for being tempted. Why might a farmer say yes?', options: ['Debts, sickness, school fees and low prices', 'They love pits', 'They hate cocoa'] },
      { id: 'coc-c2', type: 'comprehension', afterPage: 7, question: 'What do the farmers do together?', options: ['Report the stranger and ask the elders to protect the farms', 'Sell all their farms', 'Ignore the offers'], correctIndex: 0 },
      { id: 'coc-voc', type: 'vocabulary', afterPage: 4, word: 'heavy metals', definition: 'Metals such as mercury, lead and arsenic that can poison people in small amounts.', distractors: ['Strong music', 'Shiny coins'] },
      { id: 'coc-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['A stranger offers money to rent the farm.', 'Tsatsu counts the long-term value of the trees.', 'The family learns the cost of mining on farms.', 'Opanin Badu refuses and plants a new seedling.'] },
      { id: 'coc-sel', type: 'sel', afterPage: 8, prompt: 'It can be hard to say no to a big offer. What helps people choose what lasts?', feelingOptions: ['Brave', 'Thoughtful', 'Proud', 'Determined'] },
    ],
    glossary: [
      { word: 'cocoa', definition: 'The beans from which chocolate and cocoa drink are made.', pages: [1] },
      { word: 'acre', definition: 'A measure of land, a little less than half a hectare.', pages: [3] },
      { word: 'hectares', definition: 'Units of land area; one hectare is 10,000 square metres.', pages: [4] },
      { word: 'seedling', definition: 'A young plant that has just grown from a seed.', pages: [8] },
      { word: 'co-operative', definition: 'A group of farmers who work together and share the benefits.', pages: [7] },
    ],
    culturalNotes: ['The farmer, grandson and stranger are invented. The facts come from published reports named in the fact-check.', 'The story does not shame farmers who are tempted; it shows the pressures and the other choices.', 'The numbers on destroyed farmland differ between reports and the story says so.'],
    reviewQuestions: ['Check against named sources: 30,000 hectares of cocoa farms destroyed as of December 2024 and another 50,000 at risk (COCOBOD chief executive); other reports give about 19,000 hectares; Japan and the EU heavy-metal testing; cocoa supports about two million direct and five million indirect jobs (as claimed).', 'Check the per-acre tree number and bearing age with COCOBOD or an agricultural extension officer; the figures in the story are typical examples.', 'Ask a cocoa farmers’ association to read the story for realism.'],
    guide: {
      overview: 'A story about a farmer facing a tempting offer. It teaches long-term value, how to compare short-term gain with lasting loss, and how farmers can act together.',
      lessonMinutes: 45,
      goals: ['Compare the short-term and long-term value of a farm.', 'Explain how mining harms farms and exports.', 'List choices farmers have besides selling or renting to miners.'],
      subjects: [['Social Studies / Economics', 'Farming and income'], ['Mathematics', 'Multiplication and comparing values'], ['Religious and Moral Education', 'Integrity and responsibility']],
      before: ['Ask: what is something your family owns that lasts for generations?'],
      during: ['At page 3, ask learners to explain why Tsatsu counts tree-years.'],
      after: ['Make a “then and now” poster: farm in a good year, farm after a pit.', 'List three questions to ask a cooperative.'],
      discussion: ['Why might a farmer say yes? What could change that?', 'Who should protect farm boundaries?'],
      reflection: ['What are you willing to protect even when the price is high?'],
      maths: [
        { task: '400 trees bear for 30 years. How many tree-years is that?', answer: '400 × 30 = 12,000 tree-years.' },
        { task: 'If 30,000 hectares were destroyed and 50,000 more are at risk, what is the total?', answer: '30,000 + 50,000 = 80,000 hectares.' },
      ],
      support: ['Give learners a table to compare the offer and the farm.'],
      stretch: ['Find out what other crops or businesses can supplement a cocoa farm.'],
      localise: ['Invite a cocoa extension officer or farmers’ co-operative member.', 'Use local farm sizes and crop timelines.'],
      discoveryStatus: {
        whatWeKnow: ['Illegal mining has destroyed thousands of hectares of cocoa farmland.'],
        whatWeAreStillDiscovering: ['The exact area lost, which reports give as about 19,000 or 30,000 hectares.'],
      },
      factCheck: [
        { claim: 'About 30,000 hectares of cocoa farms were destroyed nationwide as of December 2024 and another 50,000 were at risk (COCOBOD chief executive, with no independent survey cited); Japan and the EU will test for heavy metals; cocoa supports about two million direct and five million indirect jobs; the minister said 44 of 288 forest reserves face serious threats.', explanation: 'From a Ghana News Agency report of a conference; the article notes no independent data source and a different report gives about 19,000 hectares.', reference: 'Ghana News Agency, “Ghana’s cocoa farms under siege; 30,000 hectares of cocoa farms destroyed by galamseyers” (27 February 2025).' },
        { claim: 'Roughly 19,000 hectares of cocoa farms lost.', explanation: 'Cited in an opinion piece and in other reports of COCOBOD statements; the figures differ.', reference: 'MyJoyOnline, “Why Ghana cannot defeat galamsey” (opinion); Graphic Online business news on 19,000 ha.' },
      ],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-chiefs-long-night',
    title: 'The Chief’s Long Night',
    summary: 'In an invented town, a young chief is offered large payments to let diggers work on stool land and by the river. Through one long night he listens to his elders, the queen mother, a farmer, a young man who needs work and a schoolgirl, and learns what a custodian of the land owes to those not yet born.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['realistic-fiction', 'cultural', 'educational'],
    themes: ['leadership', 'community', 'citizenship'],
    objectives: ['critical-thinking', 'responsibility', 'cultural-heritage', 'citizenship', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 115,
    paceWord: 'Slow and weighty, like a night of thinking',
    palette: ['#7c2d12', '#1e3a5f'],
    voice: 'Deep, thoughtful voice for the chief; wise, steady voice for the queen mother; clear young voice for Naa Dorcas',
    characters: [
      'Nana Adom Kyei II: a young chief of an invented town, in a simple cloth, seated alone with a lantern.',
      'Nana Ohemaa: the queen mother, in dark kente and gold beads, calm and sharp.',
      'Naa Dorcas: a 14-year-old schoolgirl in a uniform, with a notebook, brave and polite.',
      'Kwaw: a young man in a worn T-shirt who wants work, unsure and honest.',
    ],
    music: 'Slow drums and a low flute, with silences like a night of thinking (placeholder)',
    pages: [
      pg('🪔', 'The young chief of Dadease Nkwanta, an invented town, sat alone with a lantern. On the table lay a letter and a roll of money. The letter offered a large payment for permission to bring machines onto the stool land and along the river. “Chiefs are custodians of the land,” his father had said. Tonight the word felt very heavy.', 'A young chief sits at a table by lantern light with a letter and a roll of money before him.'),
      pg('👴', 'The elders came first. One said, “The money could build a school block and a clinic. Other towns are doing it.” Another shook his head. “Money that comes this fast leaves just as fast, and takes the river with it.” The chief listened to both. “The National House of Chiefs says chiefs have opposed galamsey,” he said, “but also says that the present approach is not working and chiefs must be involved.”', 'Elders sit in a circle under a lantern, some leaning forward, some with arms folded.'),
      pg('👑', 'Then the queen mother, Nana Ohemaa, spoke. “Who owns the river, Nana?” she asked. “The town,” said the chief. “Is the town only the people alive today?” she said. “Our ancestors gave us this land. Our grandchildren will need it. A custodian does not own. A custodian keeps. If we sell the river, we sell what was lent to us.” The chief lowered his eyes.', 'A queen mother in gold beads speaks calmly to the chief while the lantern flickers between them.'),
      pg('🧑🌾', 'A farmer was next. “My cassava is yellow,” he said. “The stream I use is brown. Doctors say crops and fish in galamsey areas can carry chemicals. We eat what we grow, Nana.” Then a young man named Kwaw spoke quietly. “I have no job. The diggers pay. If you say no, what do you offer me instead?” The room was silent. It was the best question of the night.', 'A farmer holds a yellowing cassava plant while a young man stands apart, hands open.'),
      pg('📚', 'Last, Naa Dorcas stepped forward with her notebook. “Nana,” she said, “our class has been reading about this. In December 2025 the law was changed so that mining in forest reserves is banned and breaking it can bring fifteen to twenty-five years in prison. The law also says that people who help or hide illegal miners can be punished too. If you say yes, you could be breaking the law as well as harming the river.”', 'A schoolgirl with a notebook speaks to the chief as elders listen.'),
      pg('🗣️', '“Some reports say that a few chiefs have taken money from machine owners,” Naa Dorcas went on, “and that is a serious claim. But reports also say that many chiefs and traditional councils want to be part of the solution. Which kind of chief will you be, Nana?” The chief smiled sadly. “You are a brave child,” he said. “And you have given me a problem I cannot send away.”', 'A chief looks at a schoolgirl and then at the river through the window, thoughtful.'),
      pg('📢', 'Before dawn, the chief made up his mind. He called a durbar. He said no to the letter and the money. “But my no is not enough,” he said. “We will make a bylaw to protect the river and the farms. We will plant trees along the banks. We will ask the Assembly and the Minerals Commission for help to open a legal route for those who want to mine safely and with licences. And we will find work for our young people in farming, crafts and tree planting.”', 'A durbar under a big tree with the chief addressing the crowd and a banner reading Protect Our River.'),
      pg('✅', 'Kwaw was the first to join the tree-planting team. “It pays less,” he said, “but it will still be here when my children are grown.” Naa Dorcas drew a picture of the river with trees on its banks and pinned it to the school wall. The chief looked at it for a long time. “Custodian,” he said softly. “Now I understand the word.” The end.', 'A young man plants a tree on a riverbank while a girl pins a drawing to a school wall, with the chief watching.'),
    ],
    activities: [
      { id: 'chief-c1', type: 'comprehension', afterPage: 3, question: 'What does the queen mother say a custodian does?', options: ['Keeps the land for those who come after', 'Sells the land for profit', 'Ignores the land'], correctIndex: 0 },
      { id: 'chief-p1', type: 'prediction', afterPage: 5, prompt: 'Kwaw asks what he can do instead of mining. How might the chief answer?', options: ['By offering other work and a lawful route', 'By ignoring him', 'By telling him to leave'] },
      { id: 'chief-c2', type: 'comprehension', afterPage: 7, question: 'What does the chief do in the end?', options: ['Refuses the money and makes a bylaw to protect the river', 'Accepts the money', 'Leaves the town'], correctIndex: 0 },
      { id: 'chief-voc', type: 'vocabulary', afterPage: 3, word: 'custodian', definition: 'A person who looks after something that belongs to everyone, or to the future.', distractors: ['A kind of drum', 'A type of cloth'] },
      { id: 'chief-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The chief receives an offer.', 'Elders, the queen mother, a farmer and a young man speak.', 'Naa Dorcas explains the law.', 'The chief calls a durbar and announces a bylaw.'] },
      { id: 'chief-sel', type: 'sel', afterPage: 8, prompt: 'Leaders sometimes have to choose what is right over what is easy. How does that feel?', feelingOptions: ['Brave', 'Thoughtful', 'Anxious', 'Proud'] },
    ],
    glossary: [
      { word: 'custodian', definition: 'A person who looks after something for others and for the future.', pages: [3] },
      { word: 'durbar', definition: 'A public gathering where chiefs and the people meet.', pages: [7] },
      { word: 'bylaw', definition: 'A local rule made by a community or council.', pages: [7] },
      { word: 'ancestors', definition: 'Family members who lived long ago.', pages: [3] },
      { word: 'licences', definition: 'Official permissions to do something.', pages: [7] },
    ],
    culturalNotes: ['The chief, queen mother, town and characters are invented. The story does not accuse any real chief or town.', 'The National House of Chiefs’ statement and the law described are from published reports. The idea that some chiefs profit is described as a reported claim, not a fact about any named chief.', 'Chieftaincy customs differ by area; adapt the setting and titles with local advice.'],
    reviewQuestions: ['Check against named sources: the National House of Chiefs’ statement of 18 December 2025 (chiefs opposed galamsey, approach not achieving results, call to involve traditional authorities, chiefs as custodians); crops and fish affected by mining chemicals (medical warnings); the December 2025 law (mining in forest reserves prohibited; 15 to 25 years; aiding and abetting punished).', 'Have a traditional leader or a queen mother review the story for respect and accuracy of customs and titles.', 'Confirm that the claim that some chiefs profit is presented only as a reported allegation and that no real chief is implied.'],
    guide: {
      overview: 'A story about moral leadership and the idea of custodianship. It shows how one decision involves many voices and how law, tradition and young people’s evidence can support a leader’s choice.',
      lessonMinutes: 50,
      goals: ['Explain the idea of custodianship of land and water.', 'Weigh arguments for and against accepting payments from illegal miners.', 'Describe legal and community ways to protect a river.'],
      subjects: [['Social Studies', 'Chieftaincy, land and law'], ['Religious and Moral Education', 'Integrity and stewardship'], ['English Language', 'Drama and role-play']],
      before: ['Ask: what does it mean to look after something that does not belong only to you?'],
      during: ['At page 5, ask learners which argument they find strongest and why.'],
      after: ['Role-play the night with each character’s views.', 'Draft a bylaw to protect a river.'],
      discussion: ['Why is Kwaw’s question important?', 'How can a community give young people another route to income?'],
      reflection: ['What would you do if offered a lot of money to harm something that lasts?'],
      maths: [
        { task: 'The law punishes mining in forest reserves with 15 to 25 years in prison. What is the range?', answer: '25 − 15 = 10 years.' },
        { task: 'If a bylaw plants 50 trees a week for 12 weeks, how many trees is that?', answer: '50 × 12 = 600 trees.' },
      ],
      support: ['Provide role cards with each character’s main argument.'],
      stretch: ['Research how other communities have protected sacred groves or rivers.'],
      localise: ['Use local titles, customs and a local river; invite a traditional leader or assembly staff member.'],
      discoveryStatus: {
        whatWeKnow: ['The National House of Chiefs says chiefs oppose galamsey and should be involved.', 'Mining in forest reserves is now banned by law.'],
        whatWeAreStillDiscovering: ['How widely traditional leaders are involved in illegal mining, which reports describe differently.'],
      },
      factCheck: [
        { claim: 'The National House of Chiefs’ president said chiefs have consistently opposed galamsey but the current approach has not achieved the desired results; called for involving traditional authorities; chiefs are custodians of the land; polluted rivers and contaminated soils affect drinking water and food security; medical professionals warned that staple crops are affected by chemicals.', explanation: 'From a Ghana News Agency report of 18 December 2025.', reference: 'Ghana News Agency, “National House of Chiefs calls for stronger role of traditional authorities in galamsey fight”.' },
        { claim: 'Mining in forest reserves is prohibited; penalties of 15 to 25 years’ imprisonment; aiding and abetting carries the same range; the revocation instrument became law on 10 December 2025.', explanation: 'From a MyJoyOnline report of 18 December 2025.', reference: 'MyJoyOnline, “Govt bans mining in forest reserves; violators face up to 25 years in prison”.' },
        { claim: 'Some chiefs earn more from informal deals with machine owners than from formal royalties (an opinion claim); complicity by chiefs, assembly members and security officers is cited as a cause in an editorial.', explanation: 'These are claims from opinion pieces and are not proven about any named person.', reference: 'MyJoyOnline, “Why Ghana cannot defeat galamsey” (opinion); Graphic Online, “Can Ghana heal her water?” (editorial).' },
      ],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-mock-parliament-of-form-three',
    title: 'The Mock Parliament of Form Three',
    summary: 'JHS 3 holds a mock Parliament to debate a bill on galamsey. Playing ministers, Assembly Members, a miner, a lawyer and a journalist, they study the real laws, the 2025 revocation of L.I. 2462, why prosecutions can be hard, and how licences, enforcement and honest politics fit together.',
    classIds: ['jhs-2', 'jhs-3'],
    ageMin: 13,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['drama', 'educational', 'school-life'],
    themes: ['leadership', 'citizenship', 'community'],
    objectives: ['citizenship', 'critical-thinking', 'reasoning', 'responsibility', 'oral-language'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Brisk and formal, like a parliamentary debate',
    palette: ['#1e3a8a', '#b91c1c'],
    voice: 'Formal, lively debate voices; a firm Speaker voice for Yeboa',
    characters: [
      'Yeboa: a 14-year-old boy in a school uniform and a sash, playing the Speaker with a wooden gavel.',
      'Yaa Pokua: a 14-year-old girl in a blazer, playing the Minister of Lands, with a folder of laws.',
      'Mr Sackey: their civics teacher, in a grey suit, observing from the back with a pen.',
      'Ms Nartey: a visiting lawyer, in a black robe and a neat dress, who answers questions at the end.',
    ],
    music: 'Formal, brisk drums and brass for the sessions; a calm, thoughtful tune for the conclusion (placeholder)',
    pages: [
      pg('🏛️', 'On the day of the mock Parliament, the school hall became a chamber. Yeboa banged his gavel from the Speaker’s chair. “Order! Order!” he said. “Today the House debates the Galamsey Control Bill.” Pupils in blazers and sashes rose to their seats. Mr Sackey sat at the back and smiled. The Speaker’s voice shook, but only for a moment.', 'A school hall arranged like a parliament chamber, a boy with a gavel in the Speaker’s chair.'),
      pg('📜', 'The Minister of Lands, played by Yaa Pokua, rose first. “Mr Speaker, the law already says a lot,” she said. “In 2019, Act 995 amended the mining law. In December 2025, an instrument called L.I. 2462, which had let the President allow mining in forest reserves, was revoked. Now mining in forest reserves is banned, and breaking the ban can bring fifteen to twenty-five years in prison.”', 'A pupil Minister holds up a folder labelled Act 995 and L.I. 2462 while the House listens.'),
      pg('🌍', '“What about outsiders?” asked an Assembly Member, played by a boy named Kyei. “The same law says foreigners involved in illegal mining face twenty to twenty-five years, and heavy fines,” said Yaa Pokua. “And those who aid and abet, who help or hide illegal mining, can face the same penalties as the miners.” A few pupils nodded. “So the law is strong on paper,” said Kyei. “Then why do the rivers still run brown?”', 'A pupil Assembly Member stands and asks a question while others lean forward.'),
      pg('⚖️', 'A visiting lawyer, Ms Nartey, was invited to speak. “Laws do not enforce themselves,” she said. “Writers and experts say that arrests can far outnumber convictions, that cases sometimes stall, and that there are allegations of tip-offs and of seized equipment going missing. Those are claims that need evidence, and they are serious. If they are true, the problem is not the law. It is the follow-through.”', 'A lawyer in a robe speaks to a class, with a chart of arrests and convictions on the wall.'),
      pg('🗂️', 'A pupil playing a small-scale miner, named Musa, stood up. “Mr Speaker, I want to be legal,” he said. “But I am told the licence process is slow and costly, and the land is not always mapped. If it is hard to be legal, some people will choose to be illegal.” Mr Sackey wrote this down. “Good point,” he whispered. “A fair law must be possible to follow.”', 'A pupil dressed as a small-scale miner holds a form and a stack of papers, looking frustrated.'),
      pg('📰', 'A pupil journalist named Naa Ayorkor raised her hand. “Mr Speaker, the public needs information,” she said. “Publish the rivers’ turbidity and metal readings each month. Publish the names of licence holders and the court cases. Show who is arrested, who is convicted, and where seized machines go.” The Speaker nodded. “The House notes the point,” he said. “Sunlight is the best cleaner.”', 'A pupil journalist holds a notebook and microphone while the House listens.'),
      pg('🗳️', 'After a long debate, the House voted on four proposals: clear, fast and fair licensing on mapped land; open public data on rivers and licences; independent prosecutions that reach financiers and officials, not only diggers; and real alternative livelihoods for young people. All four passed. Yaa Pokua smiled. “A law is only as good as the people who keep it,” she said. “And as the people who watch them.”', 'Pupils raise their hands to vote while the Speaker counts, with four proposals written on the board.'),
      pg('✅', 'After the session, Mr Sackey spoke to the class. “You did well,” he said. “Notice what you did. You read the law. You asked who is hurt. You asked what happens when the rule is hard to follow. You did not blame one group. That is how citizens become leaders.” Yeboa put down his gavel and grinned. “Next time,” he said, “I want to be the Minister.” The end.', 'A teacher speaks to the class in the school hall as pupils gather their papers, smiling.'),
    ],
    activities: [
      { id: 'par-c1', type: 'comprehension', afterPage: 3, question: 'What does the law now say about mining in forest reserves?', options: ['It is banned, with 15 to 25 years in prison for breaking the ban', 'It is allowed for everyone', 'It is allowed for tourists only'], correctIndex: 0 },
      { id: 'par-p1', type: 'prediction', afterPage: 4, prompt: 'The lawyer says the problem may be follow-through. What might that mean?', options: ['Laws exist, but enforcement is weak', 'The law is too short', 'Nobody has read the law'] },
      { id: 'par-c2', type: 'comprehension', afterPage: 7, question: 'Which proposal did the House pass?', options: ['Open public data and fair licensing', 'Closing all schools', 'Banning rain'], correctIndex: 0 },
      { id: 'par-voc', type: 'vocabulary', afterPage: 4, word: 'enforcement', definition: 'Making sure that people obey a law.', distractors: ['Writing a law', 'Reading a law aloud'] },
      { id: 'par-s1', type: 'sequencing', prompt: 'Put the debate in order.', items: ['The Minister explains the law.', 'A lawyer explains the challenge of enforcement.', 'A miner and a journalist make proposals.', 'The House votes on four proposals.'] },
      { id: 'par-sel', type: 'sel', afterPage: 8, prompt: 'Debating together can build trust. How do you feel when you work with others to solve a problem?', feelingOptions: ['Proud', 'Engaged', 'Hopeful', 'Determined'] },
    ],
    glossary: [
      { word: 'bill', definition: 'A proposed law that is debated before it is passed.', pages: [1] },
      { word: 'revoked', definition: 'Officially cancelled.', pages: [2] },
      { word: 'convictions', definition: 'Findings by a court that someone is guilty.', pages: [4] },
      { word: 'licence', definition: 'Official permission to do something.', pages: [5] },
      { word: 'financiers', definition: 'People who provide the money for an activity.', pages: [7] },
    ],
    culturalNotes: ['The pupils, the lawyer and the teacher are invented. The laws are described from published reports; teachers should check current legislation.', 'Claims about weak enforcement, tip-offs and missing equipment are described as allegations that need evidence, not as proven facts about any person.', 'This story is for classroom role-play and does not take a political party’s side.'],
    reviewQuestions: ['Check against named sources: Minerals and Mining (Amendment) Act 2019 (Act 995); L.I. 2462 revoked, with the revocation instrument becoming law on 10 December 2025; penalties of 15 to 25 years for mining in forest reserves; 20 to 25 years for foreigners; aiding and abetting punished.', 'Have a lawyer or a parliamentary clerk confirm the legal summary and the licensing description before release.', 'Check that every claim about enforcement is labelled as an allegation or opinion, and that no party or person is named.'],
    guide: {
      overview: 'A role-play story that teaches how a law is made, read and tested. It shows the gap between a law on paper and a law in practice, and how licensing, data and prosecutions fit together.',
      lessonMinutes: 60,
      goals: ['Summarise the main provisions of the law on mining in forest reserves.', 'Explain why enforcement and licensing matter as much as the text of a law.', 'Take part in a respectful mock debate.'],
      subjects: [['Social Studies / Citizenship', 'Law-making and government'], ['English Language', 'Debate and speeches'], ['Mathematics', 'Data and percentages']],
      before: ['Assign roles: Speaker, Minister, Assembly Members, miner, lawyer, journalist, farmer, chief. Give each a short card with facts.'],
      during: ['At page 4, ask learners to list what is a fact, what is an allegation and what is an opinion.'],
      after: ['Write a short speech for your role.', 'Make a chart: Law / Who enforces / What may go wrong / What would help.'],
      discussion: ['Why can a strong law fail to protect rivers?', 'Why might a slow licence process push people to mine illegally?'],
      reflection: ['What would a fair, workable law on small-scale mining look like?'],
      maths: [
        { task: 'The penalty range for mining in forest reserves is 15 to 25 years. What is the middle of the range?', answer: '(15 + 25) ÷ 2 = 20 years.' },
        { task: 'Of 288 forest reserves, 44 face serious threats. What percentage is that, to one decimal place?', answer: '44 ÷ 288 × 100 ≈ 15.3%.' },
      ],
      support: ['Provide role cards with key facts and sentence starters.'],
      stretch: ['Compare Ghana’s mining laws with another country’s and discuss differences.'],
      localise: ['Invite an Assembly Member, a lawyer or a clerk to judge the debate.', 'Check current laws before using the facts.'],
      discoveryStatus: {
        whatWeKnow: ['Mining in forest reserves has been banned by law since December 2025, with heavy penalties.'],
        whatWeAreStillDiscovering: ['How well the law is enforced and whether prosecutions reach financiers and officials.'],
      },
      factCheck: [
        { claim: 'Mining in forest reserves is prohibited; 15 to 25 years’ imprisonment and 10,000 to 15,000 penalty units; foreigners 20 to 25 years and 100,000 to 300,000 penalty units; aiding and abetting 15 to 25 years; the Minerals and Mining (Amendment) Act 2019 (Act 995) applies; L.I. 2462 revoked, the instrument becoming law on 10 December 2025.', explanation: 'From a MyJoyOnline report of 18 December 2025.', reference: 'MyJoyOnline, “Govt bans mining in forest reserves; violators face up to 25 years in prison”.' },
        { claim: 'Arrests outnumber convictions, cases stall, equipment disappears (allegations); licensing is slow and costly; recommended fast, decentralised licensing, mercury-free processing, prosecutions that reach financiers and officials, and alternative livelihoods.', explanation: 'From an opinion piece by a researcher; some quotes in it are composites. It is opinion, not proof.', reference: 'MyJoyOnline, “Why Ghana cannot defeat galamsey” (opinion, Dr Ebo Botchway).' },
        { claim: 'Recommendations include publishing monthly turbidity and heavy metal levels for major rivers and enforcing the law against financiers.', explanation: 'From a Daily Graphic editorial.', reference: 'Graphic Online, “Can Ghana heal her water?” (12 August 2026).' },
      ],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'voices-along-the-river',
    title: 'Voices Along the River',
    summary: 'The school radio club makes a programme about galamsey. They interview a reporter, a university scientist, a church member who joined a prayer walk, and a protester, and learn how to check facts, protect sources, stay safe, tell fact from opinion, and why peaceful voices matter.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['realistic-fiction', 'school-life', 'educational'],
    themes: ['citizenship', 'technology', 'community'],
    objectives: ['critical-thinking', 'citizenship', 'honesty', 'oral-language', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Brisk and clear, like a radio programme',
    palette: ['#7c3aed', '#0f766e'],
    voice: 'Bright radio-host voices for the pupils; calm, precise voices for each interviewee',
    characters: [
      'Kyei: a 14-year-old boy with headphones and a recorder, the radio club’s host.',
      'Naa Shika: a 14-year-old girl with a notebook, the club’s fact-checker.',
      'Aunty Gloria: a radio journalist in a bright dress, with a press badge and a microphone.',
      'Dr Nketia: a university scientist in a lab coat, with a river sample in a bottle (story picture; invented).',
    ],
    music: 'Light radio jingle with a steady beat; a calm, serious tune for the interviews (placeholder)',
    pages: [
      pg('🎙️', 'The school radio club had a new programme to make: “Voices Along the River”. Kyei held the recorder. Naa Shika held the notebook. “Rule one,” she said. “We check every fact and we say where it came from.” Kyei pressed record. “Rule two,” he said. “We are kind, even when we disagree.” Their first interview was with a real reporter.', 'Two pupils with a recorder and a notebook sit in a small radio room with a microphone.'),
      pg('📰', 'Aunty Gloria, a radio journalist, shook their hands. “A good report has three parts,” she said. “What happened. Who says so. And how we know. If we do not know, we say that. I report on galamsey, and I stay safe by working in a team, telling my editor where I am, and never going to a site alone. Protecting sources is also part of my job.” Naa Shika wrote it all down.', 'A journalist with a press badge speaks to two pupils while a recorder runs.'),
      pg('🔬', 'Next, they met Dr Nketia, an invented scientist from a university. “Science is like a river,” he said. “It flows slowly and carries many findings. One research team found heavy metals in placentas from mothers in galamsey areas. Paediatricians warn that children may be affected in other ways, but they also say we need more studies. It is important not to say more than the evidence says.”', 'A scientist in a lab coat holds up a sample bottle while pupils look at a chart.'),
      pg('⛪', 'Kyei’s aunt was a member of a church that had joined an Environmental Prayer Walk in Accra on 11 October 2024. “Thousands of people walked quietly, and the bishops presented a petition,” she said. “They asked for stronger protection of water bodies and an end to galamsey. A priest said that the fight belongs to everyone. It was peaceful, and many groups joined.”', 'A crowd of people in a peaceful walk carrying banners and a petition, drawn from behind.'),
      pg('✊', 'Naa Shika’s cousin had joined a protest in September 2024. “It did not go smoothly,” she said. “A court order stopped the planned protest site. On one day, some protesters blocked roads, and the police made arrests. Reports say about fifty-four people were arrested, thirty-nine were taken to court and remanded for twelve days. Lawyers said some had no access to food or family, and the police denied that. People gave different accounts.”', 'A group of young people hold banners on a road while a police line stands at a distance, drawn calmly and without violence.'),
      pg('⚖️', '“Why are you telling us both?” asked Kyei. “Because it is true that people disagree,” said Naa Shika’s cousin. “Peaceful protest is a right, and so is the duty to obey the law. Media rights groups said everyone’s rights must be respected, and they asked for an independent inquiry into what happened. A good citizen can hold both ideas: protest peacefully, and ask for fair treatment.”', 'Two speakers stand beside a scale balanced with two small flags, one for rights and one for duties.'),
      pg('🧐', 'Back in the radio room, Naa Shika sorted her notes into three columns: Facts, Claims and Opinions. “Heavy metals found in placentas” went under Facts. “Some say officials are involved” went under Claims. “Galamsey must end now” went under Opinions. “We say which is which,” she told Kyei. “Otherwise, listeners might think that every sentence has the same weight.”', 'A notebook with three columns labelled Facts, Claims and Opinions and sticky notes sorted beneath them.'),
      pg('✅', 'The programme aired on Friday. It ended with a message from Kyei: “Your voice matters. Ask questions. Check facts. Protect the river. And be kind to those who disagree with you.” The next morning, the headteacher announced that the club would visit a district assembly meeting. Naa Shika grinned. “Next, we ask the leaders,” she said. The end.', 'Pupils celebrate in the radio room as the on-air light turns off, with a poster on the wall.'),
    ],
    activities: [
      { id: 'voi-c1', type: 'comprehension', afterPage: 3, question: 'What are the three parts of a good report, according to Aunty Gloria?', options: ['What happened, who says so, how we know', 'Who, what, and why not', 'Jokes, songs and stories'], correctIndex: 0 },
      { id: 'voi-p1', type: 'prediction', afterPage: 5, prompt: 'People gave different accounts of the protest. How should a good reporter handle this?', options: ['Report all accounts and say what is not known', 'Pick the one they like', 'Say nothing'] },
      { id: 'voi-c2', type: 'comprehension', afterPage: 7, question: 'What does Naa Shika sort her notes into?', options: ['Facts, claims and opinions', 'Songs, poems and stories', 'Maps, charts and cards'], correctIndex: 0 },
      { id: 'voi-voc', type: 'vocabulary', afterPage: 5, word: 'remanded', definition: 'Kept in custody by a court while a case continues.', distractors: ['Sent on holiday', 'Given a prize'] },
      { id: 'voi-s1', type: 'sequencing', prompt: 'Put the interviews in order.', items: ['A reporter explains good reporting.', 'A scientist explains what the evidence shows.', 'A church member describes a prayer walk.', 'A protester describes a protest and different accounts.'] },
      { id: 'voi-sel', type: 'sel', afterPage: 8, prompt: 'Speaking up needs both courage and kindness. How do you feel when you share your voice?', feelingOptions: ['Brave', 'Nervous', 'Proud', 'Hopeful'] },
    ],
    glossary: [
      { word: 'journalist', definition: 'A person who gathers and reports the news.', pages: [2] },
      { word: 'evidence', definition: 'Facts or signs that help show whether something is true.', pages: [3] },
      { word: 'petition', definition: 'A written request signed by many people and given to those in power.', pages: [4] },
      { word: 'remanded', definition: 'Kept in custody by a court while a case continues.', pages: [5] },
      { word: 'opinions', definition: 'What people think or feel, which may not be proven.', pages: [7] },
    ],
    culturalNotes: ['The pupils, the reporter and the scientist are invented. The prayer walk and protest are described from published reports. No party, politician or protester is named.', 'The story shows both the right to protest peacefully and the duty to obey the law, and says that accounts of the September 2024 events differ.', 'Journalists and protesters can face danger; the story recommends working in a team, telling an editor, and not going alone to sites.'],
    reviewQuestions: ['Check against named sources: the Environmental Prayer Walk in Accra on 11 October 2024 (thousands of Catholic parishioners; petition to the presidency; other groups joined; a priest said it is the fight of all of us); the September 2024 protest (court injunction; about 54 arrested; 39 arraigned and remanded for 12 days; allegations of denial of food and visits, denied by police; calls from media-rights groups for respect for rights and an inquiry).', 'Check the wording about the protest with the Media Foundation for West Africa report and a second independent source.', 'Ask a journalist, a university scientist and a church leader to review their lines.'],
    guide: {
      overview: 'A media-literacy story that shows how a radio club reports a contested issue fairly. It teaches the difference between facts, claims and opinions, how to protect sources and stay safe, and how civil society uses its voice peacefully.',
      lessonMinutes: 50,
      goals: ['Sort statements into facts, claims and opinions.', 'Explain the role of journalists, scientists and civil society in a public debate.', 'Plan a short fair report on a local issue.'],
      subjects: [['English Language', 'Media literacy and interviewing'], ['Social Studies / Citizenship', 'Rights and duties'], ['Integrated Science', 'Evidence']],
      before: ['Ask: where do you get news? How do you know if it is true?'],
      during: ['At page 7, ask learners to sort ten sentences from the story into three columns.'],
      after: ['Record a two-minute report on a local issue, with one fact, one claim and one opinion, clearly labelled.', 'Write three safe interview questions.'],
      discussion: ['Why do reporters tell more than one side of a story?', 'How can we disagree and still be kind?'],
      reflection: ['What is one question you would ask a leader in your community?'],
      maths: [
        { task: 'About 54 people were arrested and 39 were taken to court. How many were not taken to court?', answer: '54 − 39 = 15.' },
        { task: 'Remanded for 12 days: if the court date is the 3rd, which date does the remand end?', answer: '3 + 12 = the 15th.' },
      ],
      support: ['Give learners sentence cards to place into Facts, Claims and Opinions.'],
      stretch: ['Compare how two news outlets report the same event and note differences.'],
      localise: ['Invite a local journalist or radio presenter; use a local issue for the report.'],
      discoveryStatus: {
        whatWeKnow: ['A prayer walk and protests against galamsey took place in 2024, with different accounts of some events.'],
        whatWeAreStillDiscovering: ['The full facts of the September 2024 arrests, which reports describe differently.'],
      },
      factCheck: [
        { claim: 'On 11 October 2024, the Bishops of the Accra Archdiocese and thousands of parishioners held an Environmental Prayer Walk; a petition went to the presidency; FixTheCountry and Democracy Hub joined; a priest said the fight belongs to everyone.', explanation: 'From an Africanews report of 12 October 2024.', reference: 'Africanews, “Ghana: Catholic Church takes stand against illegal mining, also known as galamsey”.' },
        { claim: 'A #StopGalamseyNow protest planned for 21 to 23 September 2024 was blocked by a High Court injunction; about 54 people were arrested; 39 were arraigned and remanded for 12 days; lawyers and relatives alleged denial of food, counsel and visits, which police denied; the Ghana Journalists Association and MFWA called for rights to be respected.', explanation: 'From the Media Foundation for West Africa’s account of 3 October 2024. Accounts differ.', reference: 'MFWA, “#StopGalamseyNow: 53 anti-illegal mining protesters arrested”.' },
        { claim: 'Heavy metals found in placentas from mothers in galamsey areas; kidney harm in children is suspected from adult data and not proven.', explanation: 'From a Paediatric Society workshop report.', reference: 'MyJoyOnline (9 February 2026).' },
      ],
    },
  }),

  // 8 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-river-in-twenty-years',
    title: 'The River in Twenty Years',
    summary: 'Benewaa and Dakurah walk to the river on a school trip and imagine two futures: one where nothing changes and one where everyone does their part. Then they ask each person in the story, a minister, an Assembly Member, a chief, a farmer, a miner, a teacher and a child, to make a promise they can keep.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 11,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['realistic-fiction', 'educational', 'science-fiction'],
    themes: ['leadership', 'community', 'new-beginnings'],
    objectives: ['responsibility', 'citizenship', 'teamwork', 'perseverance', 'environmental-awareness'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Reflective and hopeful, slower at the two futures',
    palette: ['#0e7490', '#4d7c0f'],
    voice: 'Reflective voices for Benewaa and Dakurah; warm, steady voice for Madam Asamoah',
    characters: [
      'Benewaa: a 13-year-old girl in a school uniform and a sun hat, with a sketchbook.',
      'Dakurah: a 13-year-old boy in a school uniform, with a camera and a water bottle.',
      'Madam Asamoah: their teacher, in a green dress, carrying a clipboard and a seedling.',
      'The river: a wide river seen in two imagined futures, one brown and empty, one clear with trees and fish (story picture).',
    ],
    music: 'A slow, sad tune for the dry future, brightening into a flowing, hopeful melody for the clear river (placeholder)',
    pages: [
      pg('🚌', 'The school bus stopped beside the river. Madam Asamoah stepped out with a seedling in a pot. “Today,” she said, “we imagine the same river twenty years from now. Benewaa, you are thirteen. In twenty years you will be thirty-three. What kind of river will you have?” Benewaa looked at the brown water. “That depends,” she said, “on what we do.”', 'A school bus beside a muddy river with a teacher holding a small seedling in a pot.'),
      pg('🏜️', '“Let us look at the first future,” said Madam Asamoah. “Imagine nothing changes. The river stays brown. Water plants shut down more often and families buy water from tankers. Farms become pits. The fish are gone. Children grow up on poisoned water. Young men dig in dangerous pits and some do not come out. A few people grow rich. Most do not.”', 'A grey picture of a dry brown river, empty fishing boats, and a long queue at a water tanker.'),
      pg('🌅', '“Now the second future,” she went on. “Imagine that people do their part. Mining happens only on licensed land, with safe methods and rules that are kept. The banks are replanted. The fish return. The treatment plants run smoothly. Farms are green. Young people have jobs in farming, crafts, tree planting and clean mining. Scientists estimate that healing rivers could take ten to twenty years of steady work.”', 'A bright picture of a clear river with fish, green banks, children playing and a working water plant.'),
      pg('🇩🇪', '“Is that possible?” asked Dakurah. “It has happened elsewhere,” said Madam Asamoah. “One editorial notes that the Rhine in Europe was called biologically dead in the 1970s and now supports life again, after money, laws and years of enforcement. The Singapore River was cleaned in ten years. Neither is the same as ours, but each shows that rivers can recover when people decide to heal them.”', 'Side-by-side pictures of a dirty and a clean river in Europe and Asia, with a question mark pointing to a Ghanaian river.'),
      pg('📝', '“So who has to do what?” asked Benewaa. Madam Asamoah handed out cards. “Let us write promises,” she said. “Not slogans. Promises that someone can keep. Let us start with those who lead.” Benewaa wrote for the Minister: “I will publish monthly river readings and prosecute financiers as well as diggers.” For the Assembly Member: “I will clear drains, protect banks and tell the town what I have done.”', 'A pupil writes promise cards for leaders, with a chart of the river’s monthly readings beside her.'),
      pg('👥', 'Dakurah wrote for the chief: “I will protect the river and the farms and pass a bylaw.” For the farmer: “I will refuse to rent my land to illegal miners and plant a tree for every tree lost.” For the miner: “I will seek a licence, use safe methods and never use child labour.” For the journalist: “I will report fairly and check my facts.” For the doctor: “I will test and treat children and tell the truth about what we find.”', 'A pupil writes more promise cards at a table, each one pinned beneath a drawing of a different villager.'),
      pg('🧒', 'Last, they wrote their own promises. Benewaa wrote: “I will never throw rubbish in a drain or river. I will ask questions and check facts.” Dakurah wrote: “I will plant a tree each year and tell my family the truth about water.” Madam Asamoah wrote: “I will teach, and I will never stop asking leaders for answers.” She added: “And I will remember that no single person can fix this, but everyone can do something.”', 'A teacher and two pupils pin their promise cards to a banner beside the river.'),
      pg('✅', 'They planted the seedling together on the bank, in a spot far from the water’s edge. Madam Asamoah took a photo. “In twenty years,” she said, “let us come back and take the same photo.” Dakurah grinned. “I will be thirty-three. I will bring my own children.” Benewaa looked at the brown river, then at the tiny tree. “And we will tell them,” she said, “that we started today.” The end.', 'A teacher and two pupils plant a seedling on a riverbank under a bright sky while a camera flashes.'),
    ],
    activities: [
      { id: 'tw-c1', type: 'comprehension', afterPage: 3, question: 'How long might it take rivers to recover, according to the story?', options: ['Ten to twenty years of steady work', 'One week', 'One hundred years'], correctIndex: 0 },
      { id: 'tw-p1', type: 'prediction', afterPage: 5, prompt: 'Madam Asamoah asks for promises that can be kept. Why not slogans?', options: ['A promise can be checked, a slogan cannot', 'Slogans are too long', 'Promises are cheaper'] },
      { id: 'tw-c2', type: 'comprehension', afterPage: 7, question: 'What do Benewaa and Dakurah promise to do?', options: ['Not litter, ask questions, plant a tree and tell the truth', 'Leave the river alone', 'Avoid the news'], correctIndex: 0 },
      { id: 'tw-voc', type: 'vocabulary', afterPage: 4, word: 'biologically', definition: 'In terms of living things such as plants, fish and animals.', distractors: ['In terms of money', 'In terms of music'] },
      { id: 'tw-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The class imagines a future where nothing changes.', 'They imagine a future where everyone does their part.', 'They write promises for each person.', 'They plant a seedling and plan to return.'] },
      { id: 'tw-sel', type: 'sel', afterPage: 8, prompt: 'A promise is a gift to the future. What promise will you make?', feelingOptions: ['Hopeful', 'Determined', 'Responsible', 'Proud'] },
    ],
    glossary: [
      { word: 'seedling', definition: 'A young plant that has just grown from a seed.', pages: [1, 8] },
      { word: 'licensed', definition: 'Having official permission to do something.', pages: [3] },
      { word: 'editorial', definition: 'A newspaper article that gives the paper’s own opinion.', pages: [4] },
      { word: 'enforcement', definition: 'Making sure that people obey a law.', pages: [4] },
      { word: 'bylaw', definition: 'A local rule made by a community or council.', pages: [6] },
    ],
    culturalNotes: ['The pupils and teacher are invented. The two futures are imagined by the characters and are not predictions.', 'The Rhine and Singapore River are used as examples that rivers can recover, not as models to copy exactly.', 'Every role in the story has a promise, so that no group is made the only villain or the only hero.'],
    reviewQuestions: ['Check against named sources: recovery estimate of 10 to 20 years (a Daily Graphic editorial); the Rhine described as biologically dead in the 1970s and now supporting life (the same editorial; confirm with a river-science source); Singapore River cleaned in ten years (NLB Singapore).', 'Check that each promise is realistic and lawful and that none names a real person.', 'Check that the story does not suggest that children alone can fix the problem.'],
    guide: {
      overview: 'A closing story that imagines two futures for a river and asks every role to make a promise. It teaches that change needs a shared effort, that promises must be specific, and that children can lead by example.',
      lessonMinutes: 45,
      goals: ['Describe two possible futures for a river and what makes each one happen.', 'Write specific promises for different roles.', 'Make and share a personal promise.'],
      subjects: [['Social Studies / Citizenship', 'Community responsibility'], ['Integrated Science', 'Rivers and restoration'], ['English Language', 'Persuasive and reflective writing']],
      before: ['Ask: if you could see your river in twenty years, what would you hope to see?'],
      during: ['At page 5, ask learners to write one promise for a leader and one for themselves.'],
      after: ['Make a “promise wall” in class and revisit it each term.', 'Plant a tree and photograph it each year.'],
      discussion: ['Why are specific promises better than slogans?', 'How can we keep each other to our promises?'],
      reflection: ['What is one promise you will keep this month?'],
      maths: [
        { task: 'Benewaa is 13. How old will she be in 20 years?', answer: '13 + 20 = 33.' },
        { task: 'A class plants one tree each year for 20 years. How many trees is that?', answer: '20 trees.' },
      ],
      support: ['Give sentence starters: “I will… by…”.'],
      stretch: ['Choose a local river or stream and write a ten-year restoration plan.'],
      localise: ['Use your own river and local leaders; invite a leader to read the promises and respond.'],
      discoveryStatus: {
        whatWeKnow: ['Rivers can recover when people decide to heal them, but it takes years.'],
        whatWeAreStillDiscovering: ['How long it will take Ghana’s rivers, and which actions matter most.'],
      },
      factCheck: [
        { claim: 'Recovery may take 10 to 20 years of consistent work (an estimate); the Rhine was declared biologically dead in the 1970s and now supports life after investment and enforcement; recommended a Water Restoration Fund, river-by-river restoration plans, monthly public data and enforcement against financiers.', explanation: 'From a Daily Graphic editorial, which is opinion; the Rhine claim should be confirmed with a river-science source.', reference: 'Graphic Online, “Can Ghana heal her water?” (12 August 2026).' },
        { claim: 'The Singapore River clean-up took about ten years (1977 to 1987).', explanation: 'From the National Library Board Singapore’s encyclopedia entry.', reference: 'NLB Singapore, Infopedia, “Cleaning of the Singapore River”.' },
      ],
    },
  }),
];

