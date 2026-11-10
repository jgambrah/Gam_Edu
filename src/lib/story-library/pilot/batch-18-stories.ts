/**
 * Batch 18: A cleaner Ghana. Eight stories on rubbish, drains, floods and the mindset change that Ghana needs:
 * how a blocked gutter floods a school, a respectful remembrance of 3 June 2015, an honest debate on who is to blame,
 * the true reasons (law, health, faith, neighbours, fairness) for keeping drains clear, the Singapore River clean-up,
 * Rwanda's umuganda, children as "drain detectives", and flood-day safety for younger learners.
 *
 * Rules: as Batches 13 to 17. All text is original. Facts are paraphrased from the sources named in each story's
 * fact-check list. Where sources disagree (death tolls, age ranges, dates) the story says so. The stories give
 * balanced causes: litter and silt, buildings on waterways, small drains, weak enforcement and heavier rain, and they
 * give children and leaders both a part to play. They do not use frightening untrue reasons. No real private
 * individual (including anyone filmed in online videos) is shown or named. Scripture and religious sayings are
 * paraphrased and flagged for review by faith leaders. Safety: children never enter or lean over drains or floodwater.
 * All stories are drafts awaiting review.
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

export const BATCH_18_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-gutter-that-drank-the-rain',
    title: 'The Gutter That Drank the Rain',
    summary: 'When rain floods their school corridor, Zakari and Korkor follow the water from the blocked gutter down to the lagoon with their teacher. They discover that sachets, bottles and silt together stop the water from leaving, and that fixing it takes both children and leaders.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'fluent',
    difficulty: 3,
    genres: ['educational', 'school-life', 'science'],
    themes: ['community', 'citizenship', 'weather'],
    objectives: ['environmental-awareness', 'responsibility', 'scientific-curiosity', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 115,
    paceWord: 'Lively and clear, quieter at the blocked drain',
    palette: ['#0369a1', '#a16207'],
    voice: 'Curious young voices for Zakari and Korkor; calm, encouraging voice for Madam Boadi',
    characters: [
      'Zakari: a 9-year-old boy in a school uniform and rubber sandals, always asking why.',
      'Korkor: his classmate, 10, in a school uniform with a yellow raincoat, brave and practical.',
      'Madam Boadi: their teacher, in a blue dress, carrying an umbrella and a notebook.',
      'The gutter: a concrete drain beside the school wall, choked with sachets, bottles and red mud (story picture).',
    ],
    music: 'Rain on a tin roof, a steady drip rhythm, then a bright, hopeful tune at the end (placeholder)',
    pages: [
      pg('🌧️', 'The rain came down so hard that the school yard turned brown. Zakari watched from the classroom door as water crept along the corridor and soaked his sandals. “Why is the water not going away?” he asked. Madam Boadi put on her raincoat. “Let us go and ask the water,” she said.', 'Heavy rain falls on a school yard while brown water spreads along a corridor and a boy stands in the doorway.'),
      pg('🔎', 'Zakari, Korkor and Madam Boadi followed the gutter beside the school wall. The water was not rushing along it. It was standing still, like a pond. At one place it bubbled up and spilled over the edge. “Here is the problem,” said Korkor. “The gutter is full, but of the wrong thing.”', 'A concrete gutter overflowing with brown water beside a school wall, children and a teacher looking down.'),
      pg('🥤', 'Madam Boadi poked the blockage with a long stick. Out came empty sachets, plastic bottles, a torn shoe and a thick layer of red mud. “Some of this is rubbish that people threw in,” she said. “And some is soil. When the ground is bare, rain washes the soil into the gutter. Mud blocks the flow first, and then the plastic gets caught in it.”', 'A teacher lifts sachets and a bottle on a long stick from a mud-filled gutter while children look on.'),
      pg('🦟', '“Does it matter if the water just sits there?” asked Zakari. “It matters a lot,” said Madam Boadi. “Still water is where mosquitoes lay their eggs, and mosquitoes can spread malaria. Water that cannot leave also floods yards, classrooms and homes. Gutters are meant to carry rain away, not to hold it.”', 'A close picture of still brown water with mosquito larvae wriggling near a plastic sachet.'),
      pg('🗺️', 'They walked on, past houses and shops, until the gutter joined a bigger drain. The big drain ran towards a lagoon in the distance. “Every gutter is a small road for water,” said Korkor. “If one small road is blocked, the water has nowhere to go.” Madam Boadi smiled. “And every drain in a town joins others, so one blocked place can flood a whole street.”', 'A map-like view of small gutters joining a big drain that flows toward a distant lagoon.'),
      pg('🧤', 'Back at school, the headteacher brought two workers with a pickup and shovels. The children were not allowed to climb into the gutter, because that is dangerous. Instead they carried buckets, sorted the rubbish into bags and kept the compound clean around it. Soon the water began to move, slowly at first, then with a happy gurgle.', 'Workers shovel mud into a pickup while children sort rubbish into sacks at a safe distance.'),
      pg('🤔', '“But the gutter will block again,” said Zakari. “Yes, if we do nothing,” said Madam Boadi. “We must stop throwing rubbish in it. But we also need leaders to desilt drains, make them wide enough, cover the open ones and plant grass on bare ground. Children can do their part, and children can also ask grown-ups to do theirs.”', 'Children write questions on a poster beside a clean gutter while a teacher points at a map.'),
      pg('✅', 'The next morning, the class made a poster: Bin it. Do not drain it. Korkor stuck it on the wall beside the gutter. Zakari counted the sachets in the school bin: forty-two before break time. “Last week they were in the gutter,” he said. “Today they are where they belong.” It was only a small change, but the water in the gutter ran clear. The end.', 'A colourful poster beside a clean gutter while a full bin stands next to it in the sunshine.'),
    ],
    activities: [
      { id: 'gut-c1', type: 'comprehension', afterPage: 3, question: 'What blocked the gutter first, according to Madam Boadi?', options: ['Mud and soil', 'Big stones', 'Tree roots'], correctIndex: 0 },
      { id: 'gut-p1', type: 'prediction', afterPage: 4, prompt: 'The water cannot leave the gutter. What problems might this cause?', options: ['Floods and mosquitoes', 'More sunshine', 'Taller trees'] },
      { id: 'gut-c2', type: 'comprehension', afterPage: 7, question: 'What does Madam Boadi say children can do?', options: ['Do their part and ask grown-ups to do theirs', 'Climb into the drains to clean them', 'Leave everything to others'], correctIndex: 0 },
      { id: 'gut-voc', type: 'vocabulary', afterPage: 3, word: 'blockage', definition: 'Something that stops the flow through a pipe, drain or road.', distractors: ['A kind of rain', 'A type of bottle'] },
      { id: 'gut-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Rain floods the school corridor.', 'The class follows the gutter and finds the blockage.', 'Workers clear the mud and plastic.', 'The class makes a poster and uses the bin.'] },
      { id: 'gut-sel', type: 'sel', afterPage: 8, prompt: 'Small actions can help a whole street. What small action could you do this week?', feelingOptions: ['Hopeful', 'Proud', 'Determined', 'Responsible'] },
    ],
    glossary: [
      { word: 'gutter', definition: 'A channel that carries rainwater away from buildings and roads.', pages: [2] },
      { word: 'blockage', definition: 'Something that stops water or air from flowing through.', pages: [3] },
      { word: 'mosquitoes', definition: 'Small flying insects that bite and can spread diseases like malaria.', pages: [4] },
      { word: 'lagoon', definition: 'A shallow body of water near the sea.', pages: [5] },
      { word: 'compound', definition: 'The yard and buildings of a school or home.', pages: [6] },
    ],
    culturalNotes: ['This story is set in an invented Ghanaian school. It teaches how drains work and why blocked gutters cause flooding.', 'Children should never enter drains. The story shows adults doing the dangerous work.', 'The story says both rubbish and soil block drains, because experts say silt often blocks drains first and then traps plastic.'],
    reviewQuestions: ['Check against named sources: silt blocks drains and traps plastic; stagnant water breeds mosquitoes; drains linked to larger drains and lagoons.', 'Check that the story does not blame children and that it shows leaders also have duties.', 'Check that the safety message (children do not enter drains) is clear.'],
    guide: {
      overview: 'A science and citizenship story about how drains work. It shows children following the cause of a flood and learning that rubbish, mud and poor maintenance work together.',
      lessonMinutes: 40,
      goals: ['Explain how a gutter carries rainwater and why blockages cause floods.', 'Name two things that block gutters.', 'Suggest one action children can do and one action leaders should do.'],
      subjects: [['Integrated Science', 'Water and drainage'], ['Social Studies / Environment', 'Waste and community'], ['English Language', 'Reading and discussion']],
      before: ['Ask: where does the water go when it rains at your school?'],
      during: ['At page 3, show learners a pictures of a blocked gutter and ask them to name what they see.'],
      after: ['Walk around the school with an adult and mark where water collects.', 'Make a poster that asks people to use the bin.'],
      discussion: ['Why does mud block a gutter before plastic does?', 'Which jobs belong to children and which to leaders?'],
      reflection: ['What is one thing you can do so that the rain finds its way?'],
      maths: [
        { task: 'The class counted 42 sachets in the bin before break. If there are 5 bins, and each has 42, how many sachets is that?', answer: '5 × 42 = 210 sachets.' },
        { task: 'A heavy rain gives 60 mm in two hours. How many millimetres per hour is that?', answer: '60 ÷ 2 = 30 mm per hour.' },
      ],
      support: ['Provide a labelled picture of a gutter, a drain and a lagoon.'],
      stretch: ['Draw how rainwater travels from your school to the nearest river or lagoon.'],
      localise: ['Use the real drain near your school; invite a local assembly staff member to explain how it is cleaned.', 'Never let learners enter or lean into drains.'],
      factCheck: [
        { claim: 'Silt blocks drains first, then traps plastic bottles and other debris; poorly planned urban growth, untarred roads and bare land wash soil into drains.', explanation: 'An environmental engineer explained this in a July 2026 television interview, saying litter is not the only cause of Accra’s floods.', reference: 'MyJoyOnline, “Accra floods driven more by poor drainage and silt than littering – Dr Ohemeng-Ntiamoah”.' },
        { claim: 'Stagnant water breeds mosquitoes, which contribute to malaria; children can fall into open drains hidden by floodwater.', explanation: 'From a Ghana News Agency feature on the effects of flooding on women and children.', reference: 'Ghana News Agency, “Ghana’s flooding: women and children suffer needlessly” (4 July 2026).' },
      ],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'june-the-third',
    title: 'June the Third',
    summary: 'On National Flood Disaster Day, Mr Adotey’s class learns what happened at Kwame Nkrumah Circle on 3 June 2015, why records differ on how many people died, and what the nation promised to learn. The pupils decide what they themselves will do, and what they will ask of leaders.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['historical', 'informational', 'school-life'],
    themes: ['community', 'citizenship', 'fear-and-courage'],
    objectives: ['environmental-awareness', 'responsibility', 'citizenship', 'critical-thinking'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 115,
    paceWord: 'Slow, quiet and respectful; no rushing',
    palette: ['#334155', '#b45309'],
    voice: 'Quiet, steady voice for Mr Adotey; thoughtful young voices for the pupils',
    characters: [
      'Mr Adotey: a history teacher, in a dark shirt and plain tie, speaking gently.',
      'Bernice: a 14-year-old girl in a school uniform, with a notebook and a serious face.',
      'Efo: a 14-year-old boy in a school uniform, who always asks for evidence.',
      'The school hall: a plain hall with benches and a banner for National Flood Disaster Day (story picture).',
    ],
    music: 'Very soft strings and distant rain; silence for the minute of remembrance (placeholder)',
    pages: [
      pg('🕯️', 'On the third of June, the whole school gathered in the hall. A banner read National Flood Disaster Day. Mr Adotey stood before them. “Today we remember a night in 2015 when a flood and a fire in Accra took the lives of many people,” he said. “We will speak plainly and with respect. Each number we say was a person.”', 'A school hall with pupils seated quietly beneath a banner and a single candle at the front.'),
      pg('🌧️', '“On 3 June 2015, very heavy rain fell on Accra,” said Mr Adotey. “Floodwater rose around Kwame Nkrumah Circle. Many people took shelter at a filling station. The water carried fuel, and the station caught fire. Some people died in the flood, and many more died in the fire.”', 'Dark clouds above a flooded junction with a distant glow, drawn without showing any people in harm.'),
      pg('❓', '“How many died?” asked Efo. “Records differ,” said Mr Adotey. “Many reports say about 150, and some estimates go beyond 250. Reports also differ on how many died in the flood and how many in the fire. When numbers disagree, we do not choose the one we like. We say that it was a very large loss, and that we do not know the exact figure.”', 'A notebook page with the numbers 150 and 250 and a question mark between them.'),
      pg('🔍', '“Why did it happen?” asked Bernice. “No single cause,” said Mr Adotey. “The rain was very heavy. Drains were blocked with silt and rubbish. Waterways had been built over. Many drains were made for a much smaller city and for lighter rain. Rules to protect waterways were not always enforced. A disaster usually has many causes joined together.”', 'A diagram with arrows from rain, blocked drains, buildings on waterways and weak plans to a flooded street.'),
      pg('📅', '“It did not end in 2015,” said Mr Adotey. “In May 2025, three hours of rain brought 132 millimetres, and reports say four or five people died and more than three thousand were forced from their homes. Accounts differ on the exact number. In early June 2026, rain flooded Kaneshie, Odawna, Adabraka and the Circle again.” The hall grew very quiet.', 'A timeline with 2015, 2025 and 2026 and small rain clouds above each date.'),
      pg('🤝', '“What do we do with this?” asked Efo. Mr Adotey answered slowly. “First, we do not throw waste into drains. That is our part. Second, we ask leaders to keep drains clear, to protect waterways and wetlands, and to explain what they are doing. That is their part. And third, we stay safe: never shelter near fuel, never walk through floodwater, and keep away from open drains.”', 'Pupils write three headings on a board: Our part, Their part, Staying safe.'),
      pg('✍️', 'Bernice wrote on her card: “I will tell my family to use the bin. I will write to my Assembly Member and ask what is being done about our drains.” Efo wrote: “I will count the blocked drains on our road and show the numbers.” Mr Adotey read the cards and nodded. “Remembering is not the end,” he said. “It is a beginning.”', 'Pupils write promise cards at their desks while the teacher reads one aloud.'),
      pg('🌅', 'At noon, the pupils stood for a minute of silence. Outside, a light rain began to fall. It was gentle, and it ran away down the clean school gutter. Bernice looked at the water and then at Efo. “That is how it should always be,” she said. “Rain that goes where it belongs.” The end.', 'Pupils stand in the school yard in gentle rain beside a clear gutter, with heads bowed.'),
    ],
    activities: [
      { id: 'jun-c1', type: 'comprehension', afterPage: 3, question: 'What does Mr Adotey say to do when the numbers disagree?', options: ['Say the figures differ and that we do not know the exact one', 'Choose the smallest number', 'Ignore the question'], correctIndex: 0 },
      { id: 'jun-p1', type: 'prediction', afterPage: 4, prompt: 'Mr Adotey says disasters have many causes. What might these be?', options: ['Heavy rain, blocked drains and building on waterways', 'Only the rain', 'Only one person'] },
      { id: 'jun-c2', type: 'comprehension', afterPage: 6, question: 'What are the three parts of Mr Adotey’s answer?', options: ['Our part, their part, staying safe', 'Fear, anger, silence', 'Rain, drains, fuel'], correctIndex: 0 },
      { id: 'jun-voc', type: 'vocabulary', afterPage: 2, word: 'estimate', definition: 'A careful guess about a number when the exact figure is not known.', distractors: ['A kind of promise', 'A type of drain'] },
      { id: 'jun-s1', type: 'sequencing', prompt: 'Put the events in order.', items: ['A flood and fire at Kwame Nkrumah Circle in 2015.', 'Heavy rain and deaths in Accra in May 2025.', 'Flooding in Accra again in early June 2026.', 'Pupils make promise cards on National Flood Disaster Day.'] },
      { id: 'jun-sel', type: 'sel', afterPage: 8, prompt: 'Remembering a hard day can bring many feelings. How do you feel after hearing it?', feelingOptions: ['Sad', 'Thoughtful', 'Determined', 'Calm'] },
    ],
    glossary: [
      { word: 'disaster', definition: 'An event that causes great harm or loss.', pages: [4] },
      { word: 'estimates', definition: 'Careful guesses about a number when the exact figure is not known.', pages: [3] },
      { word: 'waterways', definition: 'Rivers, streams and channels that carry water.', pages: [4, 6] },
      { word: 'wetlands', definition: 'Low, damp areas that soak up and hold water.', pages: [6] },
      { word: 'shelter', definition: 'A place that keeps people safe from danger or weather.', pages: [2] },
    ],
    culturalNotes: ['3 June is marked as National Flood Disaster Day. This story uses published accounts and an invented teacher and pupils. It names no victims and uses no graphic detail.', 'This is a painful subject. Teachers should be ready for strong feelings, and some learners may have lost family or friends in floods.', 'Numbers differ in sources and the story says so rather than choosing a figure.'],
    reviewQuestions: ['Check against named sources: date 3 June 2015; floodwater carrying fuel; the fire at the filling station; death toll estimates of about 150 to more than 250; the flood and fire split being uncertain; National Flood Disaster Day; May 2025 rainfall of 132.2 mm with four or five deaths (sources differ); early June 2026 floods in the named areas.', 'Ask the school counsellor, NADMO or a community leader to review the wording and the safety advice.', 'Confirm that the story does not blame victims and that it does not include any identifiable real person.'],
    guide: {
      overview: 'A remembrance story for older learners. It tells a national tragedy with care, shows how experts handle uncertain numbers, and turns grief into three clear steps: our part, their part and staying safe.',
      lessonMinutes: 50,
      goals: ['Describe what happened on 3 June 2015 in a careful, respectful way.', 'Explain why a disaster has several causes.', 'Write a promise that includes both a personal action and a request to leaders.'],
      subjects: [['Social Studies', 'Disasters and citizenship'], ['Integrated Science', 'Rain and drainage'], ['English Language', 'Writing a promise or letter']],
      before: ['Tell learners the story is about a real tragedy, that they may step out at any time and that a counsellor is available.'],
      during: ['At page 3, pause to discuss why we give a range and not a single number when records differ.'],
      after: ['Write a promise card and a short letter to an Assembly Member.', 'Make a safety poster about floodwater.'],
      discussion: ['Why is it better to say “we do not know the exact number” than to pick one?', 'What can children do, and what must leaders do?'],
      reflection: ['What would you want people to remember about a day like this?'],
      maths: [
        { task: 'If one estimate is 150 and another is 250, what is the difference?', answer: '250 − 150 = 100.' },
        { task: '132 mm fell in three hours. How many mm per hour on average?', answer: '132 ÷ 3 = 44 mm per hour.' },
      ],
      support: ['Provide sentence starters for the promise card: “I will… I ask leaders to…”.'],
      stretch: ['Compare the 2015 flood with another disaster in another country and how it was remembered.'],
      localise: ['Invite a local NADMO officer or Assembly Member to explain flood safety.', 'Hold a minute of silence only if it suits the school and learners.'],
      discoveryStatus: {
        whatWeKnow: ['A flood and fuel fire at Kwame Nkrumah Circle on 3 June 2015 caused a very large loss of life.', 'Flooding has recurred in Accra, including in 2025 and 2026.'],
        whatWeAreStillDiscovering: ['The exact number of people who died and how many died in the flood and how many in the fire.', 'The exact number who died in May 2025, which sources give as four or five.'],
      },
      factCheck: [
        { claim: 'On 3 June 2015 floodwaters carrying fuel reached a filling station at Kwame Nkrumah Circle where people had taken shelter, and the station exploded; estimates of the dead range from about 150 to more than 250; the split between flood and fire is uncertain; the day is now National Flood Disaster Day; flooding in 2025 and 2026 recurred.', explanation: 'From a JoyNews feature on Accra’s flooding history, which flags the uncertain figures and says 132.2 mm of rain in May 2025 killed four people.', reference: 'MyJoyOnline, “Accra under water again: inside Ghana’s 66-year flooding crisis that nobody has fixed”.' },
        { claim: 'A May 2025 rain of 132.2 mm killed five people and displaced more than 3,000; the 2015 fire killed over 150 people; June 3 is National Flood Disaster Day.', explanation: 'From an opinion article by an environmental policy lecturer, which differs from another source on the 2025 death toll (four or five).', reference: 'Graphic Online, “Accra is not drowning by accident: why Ghana’s flood crisis demands more than drains”.' },
        { claim: 'The Accra flooding killed more than ten people, including children, in a recent event; the disaster of 3 June 2015 claimed about 150 lives.', explanation: 'From a Ghana News Agency feature.', reference: 'Ghana News Agency, “Ghana’s flooding: women and children suffer needlessly” (4 July 2026).' },
      ],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'whose-drain-is-it',
    title: 'Whose Drain Is It?',
    summary: 'Sedinam’s class holds a debate: are Accra’s floods the fault of citizens or of leaders? Their teacher gives them evidence from engineers, studies and news reports, and the pupils discover that the honest answer is both, and that a child can hold both to account.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 11,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['educational', 'school-life', 'informational'],
    themes: ['citizenship', 'leadership', 'community'],
    objectives: ['critical-thinking', 'citizenship', 'responsibility', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Brisk and fair, like a good debate',
    palette: ['#1d4ed8', '#b91c1c'],
    voice: 'Brisk debate voices for the pupils; fair, steady voice for Mr Aryee',
    characters: [
      'Sedinam: a 13-year-old girl in a school uniform with a clipboard, leading the debate.',
      'Nii Armah: a 13-year-old boy in a school uniform, arguing that citizens must change first.',
      'Aku: a 13-year-old girl in a school uniform, arguing that leaders are failing.',
      'Mr Aryee: their social studies teacher, in a grey shirt, holding a folder of articles.',
    ],
    music: 'Light, quick percussion for the debate, then a calm, thoughtful melody (placeholder)',
    pages: [
      pg('🎤', 'It was debate day in Mr Aryee’s class. The motion was written on the board: “Accra floods because of the people, not the leaders.” Nii Armah and his team stood on the left. Aku and her team stood on the right. Sedinam held the clipboard and kept the time. “Begin,” she said.', 'A classroom debate with two teams on opposite sides and a motion written on the board.'),
      pg('🗑️', '“It is the people,” said Nii Armah. “Everyone has seen a sachet thrown into a gutter. Everyone has seen someone empty a bucket of rubbish into a drain. Drains carry water only if they are clear. If we keep blocking them, no leader can stop the floods.” His team clapped. “That is true,” said Sedinam quietly, “and we must remember it.”', 'A pupil points to a picture of a gutter full of plastic while his team nods.'),
      pg('🏗️', '“It is the leaders,” said Aku. “Many drains in Accra were built for a smaller city and a lighter rain. An engineer says many of the main drains were designed for a flood that comes about once in twenty-five years, and rain is now heavier. Homes and shops are allowed on waterways and wetlands. Rules exist, but they are not always enforced.” Her team clapped.', 'A pupil points to a drawing of houses built over a stream with a narrow drain running underneath.'),
      pg('📚', 'Mr Aryee raised his hand. “Let us look at the evidence,” he said. “One engineer says silt blocks drains first, and then plastic gets caught in it. A study says over half of the households in flood-prone areas name weak enforcement of land-use rules as the main cause. A news feature says two lagoons have lost over forty per cent of their size to building. And a Ghana Meteorological Agency record shows extreme rainfall events rose by twelve per cent between 2010 and 2025.”', 'A teacher pins four articles to the board, each with a short heading and a number.'),
      pg('⚖️', '“So who is right?” asked Nii Armah. “Both of you, and neither of you alone,” said Mr Aryee. “Litter is real, and it makes things worse. Silt is real. Buildings on waterways are real. Drains that are too small are real. And rain is heavier. When people say only one cause is true, they usually protect someone. We need the whole truth.”', 'Two pupils shake hands in front of a board that lists several causes joined by arrows.'),
      pg('🗣️', '“Then what do we do?” asked Aku. “Citizens must stop blocking drains and must demand that rules be enforced,” said Mr Aryee. “Leaders must keep drains clear, protect wetlands, and build for the rain we have now. Children can write, count, observe, vote one day, and ask questions. A question asked politely and often can move a mountain.”', 'Children list actions for citizens and leaders in two columns on a chart.'),
      pg('✉️', 'Sedinam’s team wrote a letter to the Assembly Member. “Dear Assembly Member,” it began. “We counted twelve blocked drains between our school and the main road. We have stopped throwing rubbish into them. We ask when they will be cleared and whether the big drain near the market will be made wider.” Nii Armah signed it. Aku signed it too.', 'Pupils write a letter together at a desk, with a sketch map of twelve marked drains.'),
      pg('✅', 'A week later, a reply came. It was short, and it promised a visit. Sedinam grinned. “It is only the first step,” she said. “But now we know that we can speak, and that they can answer.” Mr Aryee smiled. “Debate is good,” he said, “but a letter is better.” The end.', 'A reply letter pinned on the classroom wall beside the drain map while pupils cheer.'),
    ],
    activities: [
      { id: 'who-c1', type: 'comprehension', afterPage: 4, question: 'What does Mr Aryee ask the class to look at?', options: ['The evidence', 'Their favourite stories', 'The weather forecast only'], correctIndex: 0 },
      { id: 'who-p1', type: 'prediction', afterPage: 5, prompt: 'Both teams give reasons. What might Mr Aryee say about who is right?', options: ['Both are partly right', 'Neither has any truth', 'Only one team is right'] },
      { id: 'who-c2', type: 'comprehension', afterPage: 7, question: 'What do the pupils do with what they learn?', options: ['They write a polite, factual letter to the Assembly Member', 'They give up', 'They argue for ever'], correctIndex: 0 },
      { id: 'who-voc', type: 'vocabulary', afterPage: 4, word: 'enforced', definition: 'Made sure that a rule or law is obeyed.', distractors: ['Written in a book', 'Forgotten completely'] },
      { id: 'who-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The class debates who is to blame for floods.', 'Mr Aryee gives evidence from different sources.', 'The pupils agree there are several causes.', 'They write a letter to the Assembly Member.'] },
      { id: 'who-sel', type: 'sel', afterPage: 8, prompt: 'It can feel hard to accept that more than one person is responsible. How do you feel about that?', feelingOptions: ['Thoughtful', 'Challenged', 'Hopeful', 'Determined'] },
    ],
    glossary: [
      { word: 'evidence', definition: 'Facts or signs that help show whether something is true.', pages: [4] },
      { word: 'enforced', definition: 'Made sure that a rule is obeyed.', pages: [3] },
      { word: 'wetlands', definition: 'Low, damp areas that soak up and hold water.', pages: [3] },
      { word: 'silt', definition: 'Fine soil carried by water and left in drains and rivers.', pages: [4] },
      { word: 'motion', definition: 'The statement that a debate is about.', pages: [1] },
    ],
    culturalNotes: ['The pupils and teacher are invented. The facts come from engineers, studies and news features named in the fact-check.', 'This story is designed to teach balanced judgement: it neither blames only citizens nor only leaders.', 'Some of the cited sources are opinion pieces and should be shown to learners as opinions with evidence.'],
    reviewQuestions: ['Check against named sources: many main drains designed for a 25-year flood; silt blocks drains first; over 52% of surveyed households name weak enforcement of land-use rules; two lagoons (Sakumo, Kpeshie) lost over 40% of their size; extreme rainfall events up 12% between 2010 and 2025.', 'Confirm the lagoon figure (it comes from a news feature’s own checks) and the 12% figure with the Ghana Meteorological Agency before release.', 'Check that Assembly Member is the correct local official to address and that the letter format is realistic.'],
    guide: {
      overview: 'A debate story that teaches evidence and balanced judgement. It shows that floods have several causes and that citizens and leaders both have duties.',
      lessonMinutes: 50,
      goals: ['Present arguments for and against a motion using evidence.', 'Explain why the honest answer to a hard question may include several causes.', 'Write a polite, factual letter to a local leader.'],
      subjects: [['Social Studies', 'Citizenship and local government'], ['Integrated Science', 'Rainfall and drainage'], ['English Language', 'Debate and letter writing']],
      before: ['Hold a short mini-debate on a lighter motion to practise the rules.'],
      during: ['At page 5, ask learners to list all causes named and to sort them into “citizens” and “leaders” and “nature”.'],
      after: ['Write your own letter to the Assembly Member with a drain count.', 'Run your own debate and invite an adult to judge on evidence.'],
      discussion: ['Why do people sometimes blame only one cause?', 'How can a polite letter be stronger than a loud complaint?'],
      reflection: ['What is one thing you will do and one thing you will ask leaders to do?'],
      maths: [
        { task: 'A main drain is designed for a 1-in-25-year flood. In 100 years, how many such floods would be expected on average?', answer: '100 ÷ 25 = 4.' },
        { task: 'Extreme rainfall events rose by 12%. If there were 50 in 2010, about how many in 2025?', answer: '50 × 1.12 = 56.' },
      ],
      support: ['Give learners a table: Cause / Who can act.'],
      stretch: ['Find out how your local assembly decides which drains to clear.'],
      localise: ['Use real local examples and invite an Assembly Member or assembly staff member to answer questions.', 'Keep the tone respectful when writing to leaders.'],
      discoveryStatus: {
        whatWeKnow: ['Silt, waste, wetland loss, small drains and heavier rain all contribute to Accra’s floods.'],
        whatWeAreStillDiscovering: ['How much each cause contributes; experts differ on this.'],
      },
      factCheck: [
        { claim: 'Many of Accra’s main drains were designed for a 25-year flood event; silt blocks drains first and traps debris; weak enforcement of wetland laws; lack of retention ponds; she disputes that plastic is the main blockage.', explanation: 'An environmental engineer spoke on a television programme on 11 July 2026.', reference: 'MyJoyOnline, “Accra floods driven more by poor drainage and silt than littering – Dr Ohemeng-Ntiamoah”.' },
        { claim: 'Over 52% of surveyed households in flood-prone areas named weak enforcement of land-use regulations as the principal cause; wetlands and buffer zones have been encroached upon; drains are blocked by solid waste.', explanation: 'From an opinion article by an environmental policy lecturer who cites a 2025 study of Accra.', reference: 'Graphic Online, “Accra is not drowning by accident”.' },
        { claim: 'Sakumo and Kpeshie lagoons lost over 40% of their size to encroachment; extreme rainfall events increased by 12% between 2010 and 2025 according to the Ghana Meteorological Agency; heavy rain of 60 to 80 mm in two hours.', explanation: 'From a Ghana News Agency feature (figures as reported there).', reference: 'Ghana News Agency, “Ghana’s flooding: women and children suffer needlessly” (4 July 2026).' },
      ],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-true-reasons',
    title: 'The True Reasons',
    summary: 'Maku sees her uncle toss a sachet from his car. Her grandmother, who cannot read but sweeps her yard every day, says the old scary reasons were not true. Maku sets out to find the real reasons: law, health, faith, neighbours, fairness and money, so that no child is told a lie again.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 11,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['moral', 'family', 'educational'],
    themes: ['family', 'citizenship', 'health-and-wellbeing'],
    objectives: ['honesty', 'responsibility', 'respect', 'critical-thinking', 'citizenship'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 120,
    paceWord: 'Warm and thoughtful, with a smile for the grandmother',
    palette: ['#15803d', '#92400e'],
    voice: 'Warm, wry grandmother’s voice for Grandma Oforiwaa; thoughtful girl’s voice for Maku; a gentle, embarrassed uncle',
    characters: [
      'Maku: a 13-year-old girl in a school uniform, with a notebook and a thoughtful look.',
      'Grandma Oforiwaa: an elderly woman in a cloth and head tie, sweeping with a bundle of broom sticks; she did not go to school.',
      'Uncle Idris: Maku’s uncle, an engineer in a smart shirt and sunglasses, driving a car.',
      'Auntie Pamela: Maku’s aunt, a lawyer in a neat dress, with a folder of papers.',
    ],
    music: 'Warm, gentle highlife guitar with a slow steady beat; a quiet pause at the car window (placeholder)',
    pages: [
      pg('🚗', 'Maku was in the front seat when Uncle Idris finished his sachet of water. Without thinking, he tossed it out of the window. It landed in the gutter and floated away. “Uncle!” said Maku. “Oh, it is only one sachet,” he laughed. “It is not as if I flooded the city.” Maku did not laugh.', 'A car on a city road with a hand tossing an empty sachet from the window into a drain.'),
      pg('🧹', 'That evening, Maku sat with Grandma Oforiwaa in the compound. Grandma never went to school and could not read a word. But every morning she swept the yard and the street in front of the house, and she cleared the gutter with a hoe. “Why do you do that, Grandma?” asked Maku. “Because it is mine to keep clean,” said Grandma, “and so is the street.”', 'An elderly woman sweeping the yard with a broom of sticks at dawn, with a clean gutter beside her.'),
      pg('👻', '“When I was young,” said Grandma, “we were told that if you threw rubbish in the gutter, a spirit would catch you at night. We were scared, so we obeyed. But it was a story, not the truth, and when we stopped being afraid, some of us stopped obeying. A lie holds for a while, then it falls. Children deserve the true reasons.” Maku took out her notebook. “Then let us find them.”', 'A grandmother and a girl sit under a lamp with a notebook between them.'),
      pg('⚖️', 'Auntie Pamela, the lawyer, was visiting. “First reason: the law,” she said. “Ghana’s Public Health Act of 2012 makes dumping refuse in unauthorised places an offence. In 2017, twenty-one people in Lapaz were fined seven hundred and twenty cedis each, or six months in jail if they did not pay. The amounts may have changed since then, but the law is there. It is not only a story.”', 'A courthouse with a notice board listing the offence and a fine, drawn without any person shown.'),
      pg('🦠', '“Second reason: health,” said Auntie Pamela. “From June 2014 to February 2015, more than twenty thousand cases of cholera were recorded in Greater Accra, and 121 people died. A doctor said that a breakdown in waste management was behind it. Dirty water and rubbish can spread diseases that children get most.” Maku shivered. “Those were real people,” she said. “Yes,” said Auntie Pamela.', 'A chart with a line rising steeply and a small glass of clear water beside it.'),
      pg('🙏', '“Third reason: faith,” said Grandma. “Many of us are Christians, Muslims, or follow the old ways. The Bible says God put man in the garden to work it and take care of it. It also tells the old Israelites to bury their waste outside the camp. The Prophet Muhammad, peace be upon him, said cleanliness is half of faith. And the Qur’an warns against spreading corruption on the earth. We do not need a spirit in the gutter. We have the word.”', 'A grandmother with a Bible and a young girl with a prayer cap, both smiling over a clean yard.'),
      pg('🤝', '“Fourth reason: our neighbours,” said Uncle Idris, who had come in quietly. “The Bible tells us to love our neighbour as ourselves, and every religion has something like it. When my sachet blocks a drain, the water may rise in someone else’s home, and the one who loses the most is usually the poor family and the child with nowhere to go. That is not fair. And floods cost our country a great deal of money, which could pay for schools.”', 'An uncle looks guiltily at a flooded street scene drawn on a page while a girl watches.'),
      pg('✅', 'Uncle Idris stood up. “Maku, would you come with me?” They walked to the gutter, and he picked out his sachet from the day before. “I was wrong,” he said. “It was not about being caught. It was about the true reasons.” Grandma smiled and handed him a broom. “Educated or not,” she said, “rubbish does not read.” Maku wrote it in her notebook and underlined it twice. The end.', 'An uncle and a girl pick a sachet from a gutter while the grandmother hands over a broom.'),
    ],
    activities: [
      { id: 'tru-c1', type: 'comprehension', afterPage: 3, question: 'What does Grandma say about the old story of the spirit in the gutter?', options: ['It was a story, not the truth', 'It was always true', 'It was written in a law'], correctIndex: 0 },
      { id: 'tru-p1', type: 'prediction', afterPage: 5, prompt: 'Auntie Pamela gives a reason about health. What might it be about?', options: ['Dirty water and rubbish spread diseases', 'Rubbish makes people taller', 'Gutters give people vitamins'] },
      { id: 'tru-c2', type: 'comprehension', afterPage: 7, question: 'Why does Uncle Idris say dumping is unfair?', options: ['The poor and children suffer most when drains block', 'It makes streets too clean', 'It saves money'], correctIndex: 0 },
      { id: 'tru-voc', type: 'vocabulary', afterPage: 4, word: 'offence', definition: 'An act that breaks the law.', distractors: ['A kind of dance', 'A type of food'] },
      { id: 'tru-s1', type: 'sequencing', prompt: 'Put the reasons in the order Maku heard them.', items: ['The law.', 'Health.', 'Faith.', 'Our neighbours and fairness.'] },
      { id: 'tru-sel', type: 'sel', afterPage: 8, prompt: 'It can be hard to admit when we are wrong. How did Uncle Idris show courage?', feelingOptions: ['Proud', 'Respectful', 'Thoughtful', 'Hopeful'] },
    ],
    glossary: [
      { word: 'offence', definition: 'An act that breaks the law.', pages: [4] },
      { word: 'refuse', definition: 'Rubbish or waste that people throw away.', pages: [4] },
      { word: 'cholera', definition: 'A serious disease caused by dirty water that causes severe diarrhoea.', pages: [5] },
      { word: 'cleanliness', definition: 'The state of being clean.', pages: [6] },
      { word: 'neighbour', definition: 'A person who lives near you.', pages: [7] },
    ],
    culturalNotes: ['This story gives several honest reasons: law, health, faith, neighbours, fairness and money. It does not say that any religion or culture was wrong to teach children about cleanliness; it says children deserve true and complete reasons.', 'Scripture and sayings are paraphrased and should be checked by a pastor or imam. Families of all faiths and none should feel respected.', 'Grandma’s old story about a spirit in the gutter is an invented example of a frightening reason that is not true, not a claim about any real belief.'],
    reviewQuestions: ['Check against named sources: Public Health Act 2012 (Act 851) section 56 offence; the Lapaz case in 2017 (21 people fined GH¢720 each or six months in jail); cholera June 2014 to February 2015 (over 20,500 cases, 121 deaths; breakdown in waste management); World Bank flood-loss estimate (not used here).', 'Have a pastor, an imam and a traditional leader review the faith paragraph (Genesis 2:15; Deuteronomy 23:12 to 14; the saying that cleanliness is half of faith; Qur’an 7:56; Leviticus 19:18).', 'The fines mentioned are from 2017 and may have changed; the story says so. Check current rules with the Environmental Health service.'],
    guide: {
      overview: 'A story about giving children true, many-sided reasons for a good habit. It shows an educated person who litters and an unschooled elder who keeps her street clean, and it breaks the idea that care for the environment depends on certificates.',
      lessonMinutes: 50,
      goals: ['List at least four true reasons not to dump rubbish: law, health, faith, neighbours and fairness.', 'Explain why true reasons are better than scary stories.', 'Say how an adult can model good behaviour.'],
      subjects: [['Religious and Moral Education', 'Stewardship and respect'], ['Social Studies', 'Law and community'], ['Integrated Science', 'Health and sanitation']],
      before: ['Ask: have you ever been told a scary reason for a rule? Did it work for ever?'],
      during: ['At page 6, invite learners of different faiths to share, if they wish, a teaching on cleanliness from their tradition.'],
      after: ['Make a poster: “Seven true reasons”.', 'Interview a grandparent about how they kept their street clean.'],
      discussion: ['Why does the story say that rubbish does not read?', 'Why do true reasons last longer than scary stories?'],
      reflection: ['Which reason moves you most, and why?'],
      maths: [
        { task: '21 people were fined GH¢720 each. What was the total?', answer: '21 × 720 = GH¢15,120.' },
        { task: 'Cholera: over 20,500 cases and 121 deaths. About how many cases for each death? (Round to the nearest whole number.)', answer: '20,500 ÷ 121 ≈ 169 cases for each death.' },
      ],
      support: ['Give learners a chart with columns for Law, Health, Faith, Neighbours.'],
      stretch: ['Find one other country’s fine for littering and compare it with Ghana’s.'],
      localise: ['Invite faith leaders and traditional leaders to share their teachings, and let families speak for their own beliefs.'],
      factCheck: [
        { claim: 'Twenty-one people were each fined GH¢720 (or six months in jail if unpaid) at Abeka District Court under section 56(a) and (b) of the Public Health Act, 2012 (Act 851) for dumping refuse in unauthorised areas; officials called it a cholera risk.', explanation: 'From a Daily Graphic report published 23 July 2017.', reference: 'Daily Graphic, “Twenty-one Lapaz residents fined GH¢15,120 for indiscriminate dumping of refuse”.' },
        { claim: 'More than 20,500 cholera cases and 121 deaths were recorded in Greater Accra between June 2014 and February 2015; a doctor attributed the high case count to a breakdown in waste management.', explanation: 'From a Graphic Online report of 19 March 2015.', reference: 'Graphic Online, “Accra recorded 20,500 cholera cases between June 2014 and Feb 2015”.' },
        { claim: 'Genesis 2:15 (to work the garden and take care of it); Deuteronomy 23:12 to 14 (a place outside the camp for waste, to be covered); Leviticus 19:18 (love your neighbour as yourself); a saying attributed to the Prophet Muhammad that cleanliness is half of faith (Sahih Muslim); Qur’an 7:56 (do not spread corruption on the earth).', explanation: 'Standard religious texts. The story paraphrases them, and a faith leader should confirm the wording.', reference: 'The Bible; Sahih Muslim; the Qur’an. Review by a pastor and an imam recommended.' },
      ],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-river-that-learned-to-smile',
    title: 'The River That Learned to Smile',
    summary: 'Obaa and Samir read about the Singapore River, once an open sewer, cleaned in ten years. They compare it with the Odaw and the Korle Lagoon at home, and learn that clean water takes a deadline, fair treatment for people who must move, new drains and habits, and leaders who do not give up.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 5,
    genres: ['educational', 'informational', 'school-life'],
    themes: ['leadership', 'citizenship', 'technology'],
    objectives: ['critical-thinking', 'citizenship', 'environmental-awareness', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Clear and hopeful, slower at the comparison',
    palette: ['#0e7490', '#4d7c0f'],
    voice: 'Curious young voices for Obaa and Samir; clear, encouraging voice for Mr Tweneboah',
    characters: [
      'Obaa: a 13-year-old girl in a school uniform, with a laptop and a notebook.',
      'Samir: a 13-year-old boy in a school uniform, who loves maps.',
      'Mr Tweneboah: their geography teacher, in a short-sleeved shirt and glasses.',
      'The Singapore River: a story picture of a dirty river that becomes a clean river with walkways, drawn as before and after.',
    ],
    music: 'Slow, murky tune becoming bright and flowing, like water clearing (placeholder)',
    pages: [
      pg('🌊', 'Mr Tweneboah put two pictures on the board. The first showed a brown river full of boats, rubbish and crowded huts on the banks. The second showed a clear river with trees, bridges and people walking beside it. “Same river,” he said. “Taken about thirty years apart. It is the Singapore River.”', 'Two photographs side by side: a dirty, crowded river and the same river clean with a tree-lined walkway.'),
      pg('🗑️', '“By the 1960s and 1970s,” said Mr Tweneboah, “the river was an open sewer. Street hawkers, small factories, pig and duck farms, boats unloading cargo and thousands of homes without toilets all drained waste into the river and into the Kallang Basin. People said nothing could live in it.” Samir wrinkled his nose.', 'A drawing of a crowded riverbank with boats, stalls, farms and houses all draining into the water.'),
      pg('📅', '“In 1977 the government made a master plan,” said Mr Tweneboah. “The prime minister set a target: clean the river in ten years. The work was declared complete on 2 September 1987. A leading civil servant led the team, and the prime minister promised gold medals to the officers who did the job.” “Ten years,” said Obaa. “It was not magic. It was a deadline.”', 'A calendar showing 1977 and 1987 joined by a long arrow and a gold medal.'),
      pg('🏘️', '“It was not only about the river,” said Mr Tweneboah. “About forty-six thousand people living along the banks were moved. Around five thousand street hawkers were moved to new hawker centres near where they had worked. Hundreds of pig and duck farms were moved out. Sewers were built, drains covered, the riverbed dredged, and floating barriers trapped rubbish.” “So they were not simply thrown out,” said Obaa. “They were given places to go,” said Mr Tweneboah.', 'People walk from crowded huts into tidy new homes and a new market hall.'),
      pg('💰', '“The clean-up cost an estimated three hundred million Singapore dollars, not counting the money paid to people who moved,” said Mr Tweneboah. “It was serious money and serious work. The prime minister also wanted people to form new habits, because a clean river can be dirtied again in a week.” “And in a week,” said Samir, “someone can throw a sachet.”', 'A bag of coins beside a clean river and a sign that reads: new habits.'),
      pg('🇬🇭', '“Now compare our own waters,” said Mr Tweneboah. He put a photograph of a drain on the board. “One article says Accra signed a plan in 2012 to dredge the Odaw and restore the Korle Lagoon, with a price of around six hundred and sixty million US dollars. The writer says the promised change never came. Another report says only about a third of the money for a later flood project had been spent by mid-2025. These are claims to check, not final facts.”', 'A photograph of a drain choked with waste beside a map of the Odaw and the Korle Lagoon.'),
      pg('⚖️', '“Are we the same as Singapore?” asked Obaa. “No,” said Mr Tweneboah. “It is a small island city with a different history, size and budget, and its government was strong in ways some people dislike. We should not copy it blindly. But we can learn four things: a clear deadline, fair treatment for people who must move, real drains and sewers, and leaders who keep going until it is done.”', 'A chart with four ticks: deadline, fairness, drains and sewers, persistence.'),
      pg('✅', 'Obaa drew a picture of the Korle Lagoon with fish, trees and a children’s playground on its banks. Under it she wrote: “If a river could be cleaned in ten years, ours can be too. But it will take all of us.” Samir pinned it to the wall. Mr Tweneboah looked at it for a long time. “Then you have started,” he said. The end.', 'A child’s bright drawing of a clean lagoon with fish, trees and a playground, pinned to a classroom wall.'),
    ],
    activities: [
      { id: 'riv-c1', type: 'comprehension', afterPage: 3, question: 'How long did the Singapore River clean-up take?', options: ['About ten years', 'About one week', 'About one hundred years'], correctIndex: 0 },
      { id: 'riv-p1', type: 'prediction', afterPage: 4, prompt: 'Thousands of people lived on the banks. What do you think should happen to them?', options: ['They should be moved fairly with new places to live and work', 'They should be forgotten', 'They should stay in the dirty river'] },
      { id: 'riv-c2', type: 'comprehension', afterPage: 7, question: 'What does Mr Tweneboah say about copying Singapore?', options: ['Learn from it, but do not copy it blindly', 'Copy everything exactly', 'Ignore it completely'], correctIndex: 0 },
      { id: 'riv-voc', type: 'vocabulary', afterPage: 4, word: 'dredged', definition: 'Dug mud and rubbish from the bottom of a river or harbour.', distractors: ['Painted blue', 'Covered with a roof'] },
      { id: 'riv-s1', type: 'sequencing', prompt: 'Put the Singapore River story in order.', items: ['The river is badly polluted.', 'A master plan is made in 1977.', 'People and businesses are moved fairly, and sewers are built.', 'The clean-up is declared complete in 1987.'] },
      { id: 'riv-sel', type: 'sel', afterPage: 8, prompt: 'A dirty river can be made clean again, but it takes years. How do you feel about long, hard work?', feelingOptions: ['Hopeful', 'Determined', 'Patient', 'Inspired'] },
    ],
    glossary: [
      { word: 'sewer', definition: 'A large pipe or channel that carries waste water.', pages: [2] },
      { word: 'deadline', definition: 'A date by which something must be finished.', pages: [3] },
      { word: 'dredged', definition: 'Dug mud and rubbish from the bottom of a river.', pages: [4] },
      { word: 'habits', definition: 'Things we do regularly without thinking.', pages: [5] },
      { word: 'lagoon', definition: 'A shallow body of water near the sea.', pages: [6, 8] },
    ],
    culturalNotes: ['The Singapore River facts come from published histories. The pupils and teacher are invented.', 'The story compares places carefully and does not say that Ghana and Singapore are the same.', 'The claims about Ghana’s large drainage projects come from an opinion piece and a news report and are marked as claims to check.'],
    reviewQuestions: ['Check against named sources: master plan 1977; completion declared 2 September 1987; about 46,000 squatters resettled; about 5,000 hawkers moved to hawker centres; pig and duck farms moved; sewers and covered drains; float booms; about S$300 million excluding resettlement compensation.', 'Check that the story does not claim a public education campaign, which the source does not confirm.', 'Check the claims on the 2012 Odaw and Korle Lagoon project (about US$660 million) and the later flood project (about a third disbursed by mid-2025) with official sources before release.'],
    guide: {
      overview: 'A comparison story that shows a famous clean-up and asks what Ghana can learn from it. It teaches that a clean river takes a deadline, fair treatment, infrastructure, new habits and persistent leaders.',
      lessonMinutes: 50,
      goals: ['Describe how the Singapore River was cleaned.', 'Compare it with a local water body and say what is similar and different.', 'Explain why copying blindly is unwise.'],
      subjects: [['Geography', 'Rivers and cities'], ['Social Studies', 'Leadership and planning'], ['Mathematics', 'Timelines and percentages']],
      before: ['Show before and after pictures of a river, or ask learners to draw one.'],
      during: ['At page 7, ask learners to list the four lessons and add one of their own.'],
      after: ['Draw a “before and after” picture of a local drain, stream or lagoon.', 'Write a short plan for a ten-year clean-up with a deadline.'],
      discussion: ['Why was fairness to people who had to move so important?', 'Why might a clean river become dirty again?'],
      reflection: ['What would you want your river to look like in ten years?'],
      maths: [
        { task: 'From 1977 to 1987 is how many years?', answer: '10 years.' },
        { task: 'About 46,000 people were resettled. If 4,000 were along the Singapore River, how many were around Kallang Basin?', answer: '46,000 − 4,000 = 42,000.' },
      ],
      support: ['Give learners a before-and-after table to fill in.'],
      stretch: ['Compare the clean-up with another city’s river clean-up.'],
      localise: ['Use a local stream, drain or lagoon as the comparison; invite an assembly or environmental officer to speak.'],
      discoveryStatus: {
        whatWeKnow: ['The Singapore River was cleaned between 1977 and 1987 through planning, relocation, sewers and enforcement.'],
        whatWeAreStillDiscovering: ['How well the cost and results of Ghana’s own large drainage projects match what was promised.'],
      },
      factCheck: [
        { claim: 'The Singapore River clean-up ran about ten years (master plan 1977; declared complete 2 September 1987); about 46,000 squatters were resettled; about 5,000 hawkers moved to hawker centres; hundreds of pig and duck farms moved; about 800 lighters moved; sewers expanded; drains covered; float booms; cost about S$300 million excluding compensation; the source does not describe a public education campaign.', explanation: 'From the National Library Board Singapore’s encyclopedia entry.', reference: 'National Library Board Singapore, Infopedia, “Cleaning of the Singapore River” (eresources.nlb.gov.sg).' },
        { claim: 'A project signed in 2012 to dredge the Odaw and restore the Korle Lagoon, at around US$660 million, did not deliver what was promised; a World Bank project (GARID) approved in 2019 had spent about 36% by mid-2025.', explanation: 'From a JoyNews feature that argues the promised transformation did not come; figures are as reported and some are flagged as uncertain in that article.', reference: 'MyJoyOnline, “Accra under water again: inside Ghana’s 66-year flooding crisis that nobody has fixed”.' },
      ],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-last-saturday',
    title: 'The Last Saturday',
    summary: 'Joyce reads about Kigali, where everyone cleans the streets together on the last Saturday of the month, and where plastic bags were banned in 2008. The class debates whether Ghana should force people to clean up or help them choose to, and starts its own monthly clean-up club.',
    classIds: ['primary-5', 'primary-6', 'jhs-1'],
    ageMin: 10,
    ageMax: 13,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['educational', 'school-life', 'informational'],
    themes: ['community', 'citizenship', 'leadership'],
    objectives: ['teamwork', 'citizenship', 'environmental-awareness', 'critical-thinking'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Upbeat and brisk, with a smile in the debate',
    palette: ['#16a34a', '#2563eb'],
    voice: 'Cheerful voice for Joyce; wry voice for Pelpuo; warm voice for Madam Tagoe',
    characters: [
      'Joyce: an 11-year-old girl in a school uniform with a bright green cap, reading a magazine.',
      'Pelpuo: an 11-year-old boy in a school uniform, sceptical and funny.',
      'Madam Tagoe: their class teacher, in a yellow dress, with a clipboard and a broom.',
      'The street: a clean, tree-lined road with community members sweeping together on a Saturday morning (story picture).',
    ],
    music: 'Upbeat community drums and clapping; a cheerful sweeping rhythm (placeholder)',
    pages: [
      pg('📰', 'Joyce was reading a magazine when she shouted, “Listen! In Kigali, the capital of Rwanda, everyone cleans the streets together on the last Saturday of every month!” Pelpuo looked up from his lunch. “Everyone? Even the president?” “Even the president,” said Joyce. “It is called umuganda, and it means coming together.”', 'A girl holds up a magazine while a boy listens, with a picture of people sweeping a street.'),
      pg('🧹', 'Madam Tagoe came over. “Umuganda was made national in 1995,” she said. “On the last Saturday of the month, people take part in community work for about three hours, starting around eight o’clock. Cleaning is one job, but they also build roads, repair homes and plant gardens. The local people decide what to do.”', 'People of all ages sweep a road and plant a garden together on a bright morning.'),
      pg('🛍️', '“There is more,” said Madam Tagoe. “In 2008, Rwanda banned single-use plastic bags. Carrying one could bring a fine. Many households separate their waste, and private companies collect it for a fee. Together these things helped Kigali become known as one of the cleanest cities in Africa.”', 'A market stall wrapping goods in paper and cloth bags instead of plastic bags.'),
      pg('❓', '“Is it all perfect?” asked Pelpuo. “No,” said Madam Tagoe. “Some people call umuganda forced labour, because people who do not take part can be fined. Some shopkeepers lose business on those mornings. Two sources even disagree about who must take part: one says people from eighteen to sixty-five, another says sixteen to sixty-five. A fair student writes down all of that.”', 'A teacher writes pros and cons on the board under the heading Umuganda.'),
      pg('🇬🇭', '“What about us?” asked Joyce. “Ghana has had a monthly National Sanitation Day,” said Madam Tagoe. “A proposed law once suggested making it compulsory, and it was argued over. Some people said the law would help. Others said it was not fair to force people. What do you think?” Pelpuo grinned. “I think the broom is mightier than the bill.”', 'A broom leaning against a wall next to a poster for National Sanitation Day.'),
      pg('🗳️', 'The class held a vote. Some wanted a rule. Some wanted a choice. In the end, they agreed on a plan: a Last Saturday Club, open to everyone, voluntary, with a snack for those who came. Each month they would clean one gutter, one bus stop and one corner of the market, with adults doing the dangerous work.', 'Pupils raise their hands and a poster reads: Last Saturday Club.'),
      pg('🌤️', 'On the first Last Saturday, thirty-two people came. There were pupils, parents, a trader, a taxi driver, a pastor and an imam. They filled sixty-one bags with rubbish. Pelpuo counted the bags and the sachets in each. “Eighteen sachets in one bag,” he said. “Eighteen small blockers that did not end up in the gutter.”', 'A crowd of children and adults with brooms and sacks cleaning a road, smiling in the sun.'),
      pg('✅', 'At the end of the morning, Joyce stood on a crate. “Rwanda did it with rules and with community spirit,” she said. “We have our rules, but we also need our spirit. And we need leaders to do their part too.” Everyone clapped. Madam Tagoe wrote the next date on the board: the last Saturday of next month. The end.', 'A girl on a crate speaks to a crowd of cleaners, with a calendar on the wall in the background.'),
    ],
    activities: [
      { id: 'sat-c1', type: 'comprehension', afterPage: 3, question: 'What does umuganda mean?', options: ['Coming together', 'Plastic bag', 'Market day'], correctIndex: 0 },
      { id: 'sat-p1', type: 'prediction', afterPage: 4, prompt: 'Some people say umuganda is forced. What might others say in its favour?', options: ['It builds community spirit and keeps the city clean', 'It makes streets dirtier', 'It stops people talking'] },
      { id: 'sat-c2', type: 'comprehension', afterPage: 6, question: 'What kind of club does the class start?', options: ['A voluntary Last Saturday Club', 'A compulsory club with fines', 'A secret club'], correctIndex: 0 },
      { id: 'sat-voc', type: 'vocabulary', afterPage: 4, word: 'compulsory', definition: 'Something you must do because a rule or law says so.', distractors: ['A kind of snack', 'A type of broom'] },
      { id: 'sat-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Joyce reads about umuganda in Kigali.', 'The class debates a rule versus a choice.', 'They start the Last Saturday Club.', 'Thirty-two people fill sixty-one bags.'] },
      { id: 'sat-sel', type: 'sel', afterPage: 8, prompt: 'Cleaning up together can feel good. How do you feel when you help your community?', feelingOptions: ['Proud', 'Happy', 'Connected', 'Hopeful'] },
    ],
    glossary: [
      { word: 'umuganda', definition: 'A Rwandan word for communities coming together to do work.', pages: [1] },
      { word: 'compulsory', definition: 'Something you must do because a rule or law says so.', pages: [5] },
      { word: 'voluntary', definition: 'Done by choice, not because you are forced.', pages: [6] },
      { word: 'single-use', definition: 'Made to be used once and thrown away.', pages: [3] },
      { word: 'fine', definition: 'Money that must be paid as a punishment for breaking a rule.', pages: [3] },
    ],
    culturalNotes: ['The pupils and teacher are invented. Rwanda’s umuganda and bag ban facts come from published reports.', 'The story shows both the praise and the criticism of umuganda and lets pupils choose a voluntary approach.', 'Ghana’s National Sanitation Day is mentioned only as having existed and as a proposed compulsory measure in 2015. Check current practice locally.'],
    reviewQuestions: ['Check against named sources: umuganda institutionalised in 1995; last Saturday of every month; about three hours from about 8 a.m.; ages given as 16 to 65 (UNDP) or 18 to 65 (NPR); fines for non-participation (5,000 Rwandan francs per NPR); single-use plastic ban in 2008; criticism as forced labour; shopkeepers’ complaints.', 'Check the Ghana lines against a current source: monthly National Sanitation Day existed; a 2015 bill proposed making participation compulsory and penalties for littering.', 'Check that the story shows a voluntary, safe, adult-supervised club and that dangerous work is done by adults.'],
    guide: {
      overview: 'A story about community cleaning and civic choice. It teaches how another country built a habit of shared cleaning and invites learners to weigh rules against voluntary action.',
      lessonMinutes: 40,
      goals: ['Describe what umuganda is and what it achieves.', 'Compare rules and voluntary action and give reasons.', 'Plan a safe monthly clean-up.'],
      subjects: [['Social Studies', 'Citizenship and community service'], ['Mathematics', 'Counting and data'], ['Creative Arts', 'Making posters']],
      before: ['Ask: have you ever helped to clean your street or school with others? How did it feel?'],
      during: ['At page 4, ask learners to note down both sides of the umuganda argument.'],
      after: ['Plan a clean-up: date, place, jobs, safety, snacks, who does the dangerous work.', 'Write a short invitation to parents and neighbours.'],
      discussion: ['Is it fair to fine people who do not join? Why or why not?', 'What makes people want to join a clean-up?'],
      reflection: ['What would make you give up one Saturday morning each month?'],
      maths: [
        { task: 'The class filled 61 bags. If each bag had about 18 sachets, about how many sachets is that?', answer: '61 × 18 = 1,098 sachets.' },
        { task: 'Umuganda lasts three hours starting at 8 a.m. When does it end?', answer: '11 a.m.' },
      ],
      support: ['Give a planning chart with who, what, where and when.'],
      stretch: ['Find another country with a monthly clean-up tradition.'],
      localise: ['Use your local National Sanitation Day customs; invite assembly staff to explain; follow safety rules.'],
      factCheck: [
        { claim: 'Rwanda institutionalised umuganda in 1995; people take part on the last Saturday of each month (ages given as 16 to 65); a ban on single-use plastic bags and bottles was introduced in 2008; Kigali is regarded as the cleanest city in Africa; households separate waste and private companies collect it.', explanation: 'From a UNDP blog on Rwanda’s fight against plastic pollution.', reference: 'UNDP Rwanda, “Umuganda: Rwanda’s audacity of hope to end plastic pollution”.' },
        { claim: 'Umuganda is held on the last Saturday of each month for about three hours from about 8 a.m.; able-bodied people aged 18 to 65 are required to take part; non-participants can be fined 5,000 francs; critics call it forced labour; shopkeepers complain about lost business.', explanation: 'From a National Public Radio report (2018). It gives the age range as 18 to 65, which differs from UNDP’s 16 to 65.', reference: 'NPR, “How Rwanda tidied up its streets and the rest of the country too”.' },
        { claim: 'A bill proposed making littering a crime with possible imprisonment and making monthly National Sanitation Day participation compulsory; Cabinet was considering it in April 2015; critics urged Parliament to reject it.', explanation: 'From a MyJoyOnline report dated 20 April 2015. The report does not say whether the bill became law.', reference: 'MyJoyOnline, “Cabinet considers bill proposing prison sentence for littering”.' },
      ],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-drain-detectives',
    title: 'The Drain Detectives',
    summary: 'Ivy, Musah and their classmates become Drain Detectives. They count and map the blocked drains near their school from the safe side, show their evidence to the school and the Assembly, and learn that children can lead change if they are honest, polite and patient.',
    classIds: ['primary-5', 'primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 10,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['mystery', 'school-life', 'educational'],
    themes: ['leadership', 'citizenship', 'community'],
    objectives: ['problem-solving', 'teamwork', 'citizenship', 'perseverance', 'scientific-curiosity'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Brisk and curious, like a detective story',
    palette: ['#0d9488', '#ca8a04'],
    voice: 'Eager detective voices for Ivy and Musah; dry, kind voice for Maa Abla',
    characters: [
      'Ivy: a 12-year-old girl in a school uniform, with a clipboard and a magnifying glass.',
      'Musah: a 12-year-old boy in a school uniform, with a camera made from a phone and a tape measure.',
      'Maa Abla: their form mistress, in a patterned dress, wearing sensible shoes.',
      'The drain detectives: a team of children in yellow vests holding notebooks, standing on the pavement (story picture).',
    ],
    music: 'Light detective pizzicato with a steady march; a proud melody at the end (placeholder)',
    pages: [
      pg('🕵️', 'Ivy said, “Every mystery has clues. The mystery is: why does our road flood every time it rains? The clues are in the drains.” She drew a badge that said Drain Detectives. Musah drew a magnifying glass on it. Maa Abla read the badge and nodded. “Detectives must follow three rules,” she said. “Stay safe, be honest, and be kind.”', 'Children in yellow vests hold a hand-drawn badge reading Drain Detectives beside their teacher.'),
      pg('🦺', 'The first rule was the most important. “Nobody goes into a drain or leans over an open one,” said Maa Abla. “You look from the pavement, with an adult beside you. You wear shoes. You wash your hands afterwards.” The detectives agreed. Ivy wrote the rule at the top of the page and underlined it three times.', 'A teacher points to a safety poster showing children standing on the pavement and not touching an open drain.'),
      pg('🗒️', 'The detectives walked the road from the school gate to the main junction. They counted twenty drains. They marked each one on a map: clear, half-blocked or blocked. Musah took a photo of each blocked one, with the date. Ivy noted what was in it: sachets, bottles, mud, leaves, a broken bucket and, in one place, building sand.', 'Children with clipboards mark colours on a street map while one photographs a blocked drain from the pavement.'),
      pg('📊', 'Back at school, they counted the clues. Of the twenty drains, seven were clear, six were half-blocked and seven were blocked. “That is thirty-five per cent blocked,” said Ivy. “And six more are on the way,” said Musah. They made a bar chart in three colours. Maa Abla looked at it for a long time. “This is real evidence,” she said.', 'A bar chart with three coloured bars and a headline: 7 clear, 6 half-blocked, 7 blocked.'),
      pg('🔍', 'The detectives found more clues. Three of the worst drains were near a stall where people washed cloth and threw the water and soap packets into the gutter. Two were near a building site where sand had washed in. One was blocked by a drainpipe that had been pushed in too far. “Different causes need different answers,” said Ivy. “Not just shouting at people.”', 'A drawing of three causes: a stall, a building site and a broken pipe, each marked on the map.'),
      pg('🗣️', 'First, they spoke to people kindly. They gave the stallholder a bin and showed her the chart. She laughed and said, “Nobody ever showed me. I thought the gutter was where water goes.” Then they wrote to the Assembly Member with their map, photos and chart. They did not insult anyone. They asked for three things: clear the seven blocked drains, cover the open one by the school gate and talk to the building site about the sand.', 'Children hand a bin to a stallholder and show her a chart while she smiles.'),
      pg('⏳', 'Nothing happened for three weeks. Musah wanted to give up. “They never listen,” he said. Ivy shook her head. “Then we write again, and we invite them to see for themselves,” she said. They sent a second letter and put their map on the school gate. In the fourth week, workers arrived and cleared five drains. Then they stopped. “Five out of seven,” said Ivy. “It is a start. We are still counting.”', 'Workers clearing drains with shovels while children watch from the pavement and hold a counting board.'),
      pg('✅', 'The Drain Detectives did not fix everything. But the road flooded less, the stallholder used her bin, and the headteacher asked them to train the next class. Ivy added a line to the badge: Ask. Count. Share. Follow up. “Leaders are not enemies,” she told the new detectives. “They are people we need to help do their jobs. Evidence makes it easier.” The end.', 'New young detectives in yellow vests receive badges while Ivy and Musah show them the map.'),
    ],
    activities: [
      { id: 'drain-c1', type: 'comprehension', afterPage: 2, question: 'What is the most important rule for the detectives?', options: ['Nobody goes into a drain or leans over an open one', 'Take as many photos as possible', 'Wear matching badges'], correctIndex: 0 },
      { id: 'drain-p1', type: 'prediction', afterPage: 5, prompt: 'The detectives found different causes. What might be a good way to deal with each?', options: ['Different answers for each cause', 'The same shout for every cause', 'Ignore them all'] },
      { id: 'drain-c2', type: 'comprehension', afterPage: 7, question: 'What do the detectives do when nothing happens for three weeks?', options: ['They write again and invite leaders to see for themselves', 'They give up', 'They throw rubbish back'], correctIndex: 0 },
      { id: 'drain-voc', type: 'vocabulary', afterPage: 4, word: 'evidence', definition: 'Facts or signs that help show whether something is true.', distractors: ['A kind of badge', 'A type of drain'] },
      { id: 'drain-s1', type: 'sequencing', prompt: 'Put the detectives’ work in order.', items: ['Walk the road and count the drains.', 'Make a chart and a map.', 'Speak kindly to people and write to the Assembly Member.', 'Follow up when nothing happens.'] },
      { id: 'drain-sel', type: 'sel', afterPage: 8, prompt: 'Musah wanted to give up. What helps you keep going when things go slowly?', feelingOptions: ['Determined', 'Patient', 'Hopeful', 'Frustrated'] },
    ],
    glossary: [
      { word: 'evidence', definition: 'Facts or signs that help show whether something is true.', pages: [4] },
      { word: 'detectives', definition: 'People who look for clues to solve a mystery.', pages: [1, 2] },
      { word: 'pavement', definition: 'The paved path beside a road where people walk.', pages: [2] },
      { word: 'Assembly', definition: 'The local government that looks after a town or district.', pages: [6] },
      { word: 'mystery', definition: 'Something that is hard to explain until you find the clues.', pages: [1] },
    ],
    culturalNotes: ['The pupils and teacher are invented. This story gives a model for safe, evidence-based, polite civic action by children.', 'Children must never enter or lean over drains. The story shows counting from the pavement with an adult.', 'The way to address a local leader may differ by community; teachers should check the correct process with their local Metropolitan, Municipal or District Assembly.'],
    reviewQuestions: ['Check that the safety rules are clear and realistic for children and that adults supervise at every step.', 'Check the civic steps (writing to an Assembly Member, giving evidence, following up) against local practice; confirm that this is an appropriate route for children.', 'Check that the percentage and chart in the story are correct (7 of 20 blocked is 35 per cent).'],
    guide: {
      overview: 'A detective story that teaches data collection and civic action. It shows how to turn complaints into evidence and polite requests, and how to keep going when change is slow.',
      lessonMinutes: 50,
      goals: ['Plan a safe survey of drains, with adults present.', 'Represent data on a table and bar chart.', 'Write a polite, evidence-based letter and plan follow-up.'],
      subjects: [['Mathematics', 'Data handling and percentages'], ['Social Studies', 'Local government and civic action'], ['English Language', 'Letter writing']],
      before: ['Agree safety rules and adult supervision before any survey. Never let children enter drains.'],
      during: ['At page 4, ask learners to calculate percentages from the counts.'],
      after: ['Make a bar chart of your own survey.', 'Write a letter with one clear request and a date for follow-up.'],
      discussion: ['Why is it better to show evidence than only to complain?', 'What should we do when leaders are slow?'],
      reflection: ['What drain, street or place would you like to investigate?'],
      maths: [
        { task: '7 of 20 drains were blocked. What percentage is that?', answer: '7 ÷ 20 × 100 = 35%.' },
        { task: 'Workers cleared 5 of the 7 blocked drains. What fraction remains?', answer: '2/7 remain.' },
      ],
      support: ['Give learners a pre-drawn map and a table with three colours.'],
      stretch: ['Compare results across three roads and decide where to ask first.'],
      localise: ['Use your own streets. Ask your headteacher and a local assembly officer to supervise and explain the process.'],
      factCheck: [
        { claim: 'Silt, construction sand and plastic block drains; open drains can be dangerous for children; recommended actions include stopping dumping, desilting and covering open drains; civic education should be led by assemblies, schools and community groups.', explanation: 'From an environmental engineer’s interview, a news feature and an opinion article on Accra’s flooding.', reference: 'MyJoyOnline (Ohemeng-Ntiamoah interview); Ghana News Agency (4 July 2026); Graphic Online (Addaney).' },
      ],
    },
  }),

  // 8 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-water-under-the-water',
    title: 'The Water Under the Water',
    summary: 'On a flood day, Eli and Hamdia stay home from school. Hamdia’s mother teaches them what hides under brown floodwater, how to stay safe and keep drinking water clean, and why open drains should be covered. Then the children offer to help their neighbours.',
    classIds: ['primary-3', 'primary-4', 'primary-5'],
    ageMin: 8,
    ageMax: 11,
    readingLevel: 'developing',
    difficulty: 3,
    genres: ['educational', 'family', 'realistic-fiction'],
    themes: ['health-and-wellbeing', 'family', 'helping-others'],
    objectives: ['responsibility', 'kindness', 'environmental-awareness', 'reading-comprehension'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'local-food'],
    wpm: 110,
    paceWord: 'Calm and clear, with a steady, safe voice',
    palette: ['#475569', '#0891b2'],
    voice: 'Calm, caring voice for Hamdia’s mother; young voices for Eli and Hamdia',
    characters: [
      'Eli: an 8-year-old boy in a T-shirt and shorts, looking out of a window at the rain.',
      'Hamdia: his friend, 9, in a yellow dress and sandals, holding a plastic bucket.',
      'Hamdia’s mother: a woman in a patterned cloth, with a calm, firm voice, covering a water drum.',
      'The flooded street: a brown, rain-filled road with a hidden open drain, shown with a safe pole marking it (story picture).',
    ],
    music: 'Gentle rain and a soft pulse; a warm, helpful tune at the end (placeholder)',
    pages: [
      pg('🌧️', 'It rained all night, and in the morning the street was a brown river. Eli could not go to school. He stood at the window of Hamdia’s house and watched sandals, bottles and a plastic bucket float by. “Can we go out and play in it?” he asked. “No,” said Hamdia’s mother, and she said it very gently, but very firmly.', 'A boy looks from a window at a brown flooded street where bottles and a bucket float by.'),
      pg('🕳️', '“Come here,” said Hamdia’s mother. She pointed to the street. “Do you see where the water is smooth? Under it is an open drain. In floods, brown water hides open drains and holes. A child can fall in, even if they know the road.” Eli swallowed. “So the water has a secret.” “Yes,” she said. “Water under the water.”', 'A cut-away picture of a street with brown water on top and a hidden open drain beneath.'),
      pg('🚫', 'She told them the flood rules. “Do not wade or play in floodwater. Do not walk near fast water. Stay away from fuel, wires and anything that sparks. If someone is in danger, shout for an adult. Never go in yourself.” Hamdia wrote each rule in her notebook and drew a picture beside it.', 'A child’s notebook with a list of flood rules and small pictures of a no-entry sign and an adult.'),
      pg('🦠', '“Floodwater is dirty,” said Hamdia’s mother. “It carries rubbish, mud and germs from the street. Sometimes it gets into wells or drinking water. Then people can get very sick with diseases like cholera and diarrhoea. A doctor in Sunyani says that cholera spreads when floodwater gets into drinking water. Children under five are most at risk.” Eli looked at the water drum. “Is ours safe?”', 'A diagram showing dirty floodwater approaching a covered water drum and a cup of clean water.'),
      pg('🪣', '“It is safe because we keep it covered,” she said. “We use a clean cup with a handle. We wash our hands with soap before eating and after using the toilet. If the water looks cloudy, we boil it or treat it, and we keep the drum shut.” She showed them the lid. “These are small things, but small things protect big people.”', 'A covered water drum with a clean cup and a bar of soap beside a hand-washing station.'),
      pg('🦟', '“And when the flood goes,” she said, “it leaves pools. Still water is where mosquitoes lay eggs. We empty buckets and tyres, clear the gutter by the gate and cover our water. A clean yard helps stop malaria.” Hamdia nodded. “That is why our teacher says never to throw rubbish in the drain,” she said. “It keeps the water moving.”', 'A woman tips out a bucket of still water while children watch mosquitoes hovering above a puddle.'),
      pg('🗣️', '“Mama,” said Eli, “why do we not cover the open drain?” “That is a very good question,” said Hamdia’s mother. “It is not our drain to cover. It belongs to the Assembly. Families can ask, politely and together. Children can help by drawing, counting and writing down what they see.” Eli took a pencil. “I will draw the drain,” he said. “And we will write it down.”', 'Two children draw a map of the open drain and a note to the Assembly while Mama watches.'),
      pg('✅', 'When the rain stopped, the water went down slowly. Eli and Hamdia did not go out until an adult said it was safe. Then they helped their neighbours. They carried dry cloth, shared bread, and poured out puddles from buckets. “We are not strong,” said Eli, “but we can be careful.” Hamdia smiled. “And kind,” she said. The end.', 'Children carry blankets and bread to a neighbour’s door after the flood has gone down.'),
    ],
    activities: [
      { id: 'wat-c1', type: 'comprehension', afterPage: 2, question: 'What does floodwater hide?', options: ['Open drains and holes', 'Gold coins', 'Fish'], correctIndex: 0 },
      { id: 'wat-p1', type: 'prediction', afterPage: 4, prompt: 'Floodwater can get into drinking water. What should we do to keep our water safe?', options: ['Keep it covered and use a clean cup', 'Leave the lid off', 'Share one dirty cup'] },
      { id: 'wat-c2', type: 'comprehension', afterPage: 7, question: 'What can children do about an open drain?', options: ['Ask politely and help by drawing and counting', 'Climb into it', 'Hide it'], correctIndex: 0 },
      { id: 'wat-voc', type: 'vocabulary', afterPage: 3, word: 'germs', definition: 'Very tiny living things that can make people sick.', distractors: ['A type of seed', 'A kind of bird'] },
      { id: 'wat-s1', type: 'sequencing', prompt: 'Put the flood-day lessons in order.', items: ['Floodwater hides open drains.', 'Do not wade in floodwater.', 'Keep drinking water covered and clean.', 'After the flood, empty puddles and help neighbours.'] },
      { id: 'wat-sel', type: 'sel', afterPage: 8, prompt: 'Helping neighbours after a flood is kind. How do you feel when you help others?', feelingOptions: ['Kind', 'Proud', 'Warm', 'Happy'] },
    ],
    glossary: [
      { word: 'floodwater', definition: 'Water that spreads over land after heavy rain.', pages: [3, 4] },
      { word: 'drain', definition: 'A channel that carries away rainwater or waste water.', pages: [2] },
      { word: 'germs', definition: 'Tiny living things that can make people sick.', pages: [4] },
      { word: 'cholera', definition: 'A serious illness caused by dirty water.', pages: [4] },
      { word: 'mosquitoes', definition: 'Small flying insects that bite and can spread diseases like malaria.', pages: [6] },
    ],
    culturalNotes: ['The children and the mother are invented. The safety advice follows common flood-safety guidance and the health points come from published Ghanaian reports.', 'The story teaches children to stay safe, keep water clean and ask adults to help, and it does not suggest they should rescue anyone.', 'Check local advice from NADMO and the health service for your area.'],
    reviewQuestions: ['Check against named sources: children can fall into open drains hidden by floodwater; cholera spreads when floodwater contaminates drinking sources; stagnant water breeds mosquitoes; children under five and pregnant women are especially vulnerable.', 'Have a local health officer or NADMO officer check the safety rules and the water advice (covered storage, clean cup, soap, boiling or treating).', 'Check that no instruction could lead a child into danger.'],
    guide: {
      overview: 'A short safety and health story for younger learners. It teaches flood-day rules, safe water and hygiene, and shows children caring for neighbours and asking adults to cover open drains.',
      lessonMinutes: 35,
      goals: ['Name three flood safety rules.', 'Explain how to keep drinking water safe.', 'Say one way children can help after a flood.'],
      subjects: [['Integrated Science', 'Water and health'], ['Social Studies', 'Community safety'], ['English Language', 'Reading for information']],
      before: ['Ask: what do you do in your home when it floods?'],
      during: ['At page 3, ask learners to say each rule and act out a safe response.'],
      after: ['Draw a flood safety poster with the three rules.', 'Practise hand washing with soap and counting to twenty.'],
      discussion: ['Why is it dangerous to play in floodwater?', 'Who should cover open drains?'],
      reflection: ['What is one thing you will remember the next time it rains hard?'],
      maths: [
        { task: 'A water drum holds 200 litres. If each person uses 20 litres a day, how many days will it last for one person?', answer: '200 ÷ 20 = 10 days.' },
        { task: 'The family has 5 people. How many litres do they use in a day at 20 litres each?', answer: '5 × 20 = 100 litres.' },
      ],
      support: ['Provide a picture card for each rule.'],
      stretch: ['Make a simple flood plan for your home with an adult.'],
      localise: ['Use local advice about water treatment, shelters and emergency numbers; invite a health officer or NADMO officer to speak.'],
      factCheck: [
        { claim: 'Children can fall into open drains hidden by floodwater; cholera spreads when floodwater contaminates drinking sources, and children under five and pregnant women are especially vulnerable; stagnant water breeds mosquitoes; schools sometimes close for months when school compounds flood.', explanation: 'From a Ghana News Agency feature quoting a medical practitioner.', reference: 'Ghana News Agency, “Ghana’s flooding: women and children suffer needlessly” (4 July 2026).' },
        { claim: 'Over 20,500 cholera cases and 121 deaths were recorded in Greater Accra from June 2014 to February 2015.', explanation: 'From a Graphic Online report (context for why clean water matters).', reference: 'Graphic Online, “Accra recorded 20,500 cholera cases between June 2014 and Feb 2015”.' },
      ],
    },
  }),
];
