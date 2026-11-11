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

export const BATCH_22_STORIES: PilotStory[] = [
/**
 * Batch 22: Community lives. Eight stories about young people growing up in different Ghanaian communities: a gated
 * estate, a zongo, a middle-income family at month-end, a head porter girl in a market, a settlement by a lagoon
 * (a football cup), the street-food road, a trotro journey that crosses communities, and a community day.
 *
 * Rules: as Batches 13 to 21. All communities, people, schools and assemblies are invented; no real settlement,
 * chief, politician or organisation is named or implied. Every community is shown with dignity, strengths and real
 * challenges; none is the villain. Each story has an English skill in BECE / NaCCA style (informal, semi-formal or
 * formal letter, narrative or descriptive writing, summary, concord) and teaches full words in exam writing.
 * Child-protection and law references are general and flagged for review. All stories are drafts awaiting review.
 */

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'behind-the-estate-gate',
    title: 'Behind the Estate Gate',
    summary: 'Juliet lives in a gated estate with a driver, a swimming pool and a phone with no credit worries. A school service visit shows her a different side of her own city, and she learns that having much is not a fault but a responsibility. A story about privilege, humility and respect, with a descriptive letter in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'school-life', 'drama'],
    themes: ['community', 'identity', 'helping-others'],
    objectives: ['respect', 'emotional-intelligence', 'citizenship', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Smooth and a little shy at the start, warmer and quicker at the visit',
    palette: ['#0f766e', '#f59e0b'],
    voice: 'Polished, thoughtful teen voice for Juliet; a warm, steady voice for Uncle Joel',
    characters: [
      'Juliet Sackitey: a 14-year-old girl in a neat uniform with a smartphone, seated in the back of a car.',
      'Uncle Joel: the family driver, in his fifties, in a clean shirt and cap, with a kind, patient face.',
      'Mrs Yirenkyi: the school service-club mistress, in a bright dress, with a clipboard.',
      'Richmond Dogbe: a 14-year-old boy at a community school, in a faded but clean uniform, a gifted reader.',
    ],
    music: 'Smooth, quiet pop with a gate-click; warmer, livelier highlife at the visit (placeholder)',
    pages: [
      pg('🏡', 'Juliet lived in Palm Crest Estate, behind a tall gate with a security guard. The roads were smooth, the lawns were trimmed and the swimming pool was never empty. Every morning, Uncle Joel drove her to school in a clean car. On the way, she scrolled through her phone. She had never walked to school, never counted her change and never waited for a trotro.', 'A girl in a car looks at her phone while a security gate closes behind the estate.'),
      pg('🚌', 'One Wednesday, Mrs Yirenkyi announced the service visit. The club would spend a morning at a community school across the city. “We are not going to rescue anyone,” she said. “We are going to listen, to share and to learn.” Juliet felt a little nervous. “What if I say the wrong thing?” she whispered. “Then you say sorry and try again,” said Mrs Yirenkyi.', 'A teacher speaks to a group of students holding folders, with a school bus behind them.'),
      pg('🏫', 'The community school had cracked walls but bright murals. A class of forty sat on benches with shared books. The teacher greeted them warmly. Richmond Dogbe stood to read a poem aloud, and his voice filled the room. Juliet realised she had not read aloud for pleasure in months. “That was wonderful,” she said. Richmond smiled. “Thank you,” he said. “I read at the library every Saturday.”', 'A boy reads aloud to a class under a mural while visiting students listen.'),
      pg('🍲', 'At break, Richmond shared his lunch of koko and bread with the visitors. Juliet hesitated, then accepted a piece. “It is delicious,” she said, and she meant it. He asked about her estate. She described the pool and the guard. Then she stopped. “I should not boast,” she thought. Richmond only nodded. “It must be quiet,” he said. “Here, we are never alone.”', 'Students sit together on a bench sharing food from a bowl at break time.'),
      pg('🚗', 'On the way home, Juliet sat very quietly. “Uncle Joel,” she asked, “where do you live?” He glanced in the mirror. “In a rented room, Miss Juliet, with my wife and three children. I have driven your father for twenty years.” Juliet’s ears grew warm. She had never asked. “Thank you for taking me to school every day,” she said. Uncle Joel smiled. “It is my job, and it is my pleasure,” he said.', 'A girl speaks to a driver who looks at her in the rear-view mirror.'),
      pg('🤲', 'Juliet thought hard that night. Having a lot was not wrong, she decided. What mattered was what she did about it. She asked her mother to help the club collect storybooks. She started to greet the guard by name. She began to read aloud at home. “Respect is not just manners,” she told herself. “It is noticing people.”', 'A girl packs storybooks into a box with her mother in a bright living room.'),
      pg('✉️', 'Juliet wrote to her cousin Yvette in London, putting her address and the date at the top. “House 14, Palm Crest Estate, Accra. 10th April, 2027. Dear Yvette, I hope you are well. Last week, I visited a community school across the city, and it changed the way I see my own. The walls were cracked, but the children were bright, kind and generous. I have learned to notice people. Please write soon. Yours ever, Juliet.”', 'A girl writes a letter at a desk with a box of storybooks beside her.'),
      pg('✅', 'Exam-safe tip: this letter gives the address and date, then an introduction, a body with a clear feeling and details, a friendly conclusion and a close. Notice the strong, full words: “bright, kind and generous”. A descriptive or narrative piece in an exam needs details that the reader can see and feel. The end.', 'A girl and her mother read a letter with a tick beside the descriptive words.'),
    ],
    activities: [
      { id: 'gate-c1', type: 'comprehension', afterPage: 3, question: 'What does Mrs Yirenkyi say the visit is for?', options: ['To listen, share and learn', 'To rescue people', 'To show off'], correctIndex: 0 },
      { id: 'gate-p1', type: 'prediction', afterPage: 5, prompt: 'Juliet asks Uncle Joel where he lives. What might she learn?', options: ['Something she had never asked about', 'Nothing new', 'That he dislikes her'] },
      { id: 'gate-c2', type: 'comprehension', afterPage: 7, question: 'What does Juliet mean by “Respect is noticing people”?', options: ['Seeing and valuing everyone around you', 'Being quiet always', 'Buying gifts'], correctIndex: 0 },
      { id: 'gate-voc', type: 'vocabulary', afterPage: 5, word: 'humility', definition: 'Not thinking you are better than others.', distractors: ['Being very rich', 'Being very loud'] },
      { id: 'gate-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Juliet rides to school in the estate car.', 'The club visits a community school.', 'Juliet speaks with Uncle Joel.', 'Juliet writes to her cousin about what she learned.'] },
      { id: 'gate-sel', type: 'sel', afterPage: 8, prompt: 'Seeing how others live can change us. How do you feel when you learn something new about your own city?', feelingOptions: ['Thoughtful', 'Humble', 'Curious', 'Grateful'] },
    ],
    glossary: [
      { word: 'estate', definition: 'A planned area of houses, often with its own gate and security.', pages: [1] },
      { word: 'service', definition: 'Work done to help other people.', pages: [2] },
      { word: 'murals', definition: 'Large pictures painted on walls.', pages: [3] },
      { word: 'boast', definition: 'To talk proudly about what you have.', pages: [4] },
      { word: 'generous', definition: 'Willing to share and give.', pages: [7] },
    ],
    culturalNotes: ['Palm Crest Estate, the school and all people are invented. The story shows a wealthy family without making them villains; privilege is treated as a chance to respect and to serve, not as a fault.', 'The driver and the family are shown with mutual respect; teachers can discuss fair pay and fair treatment of workers.', 'The letter on page 7 is an informal letter with address, date, “Dear” and a first name, and “Yours ever”.'],
    reviewQuestions: ['Check that the story avoids stereotypes about wealthy families and about poorer schools, and that it does not use charity as a way to look down on others.', 'Check the informal-letter format against the NaCCA lesson (address, date, salutation, introduction, body, conclusion, subscription).', 'Check that any mention of a rented room and low pay is handled respectfully and that teachers can discuss fair treatment of workers.'],
    guide: {
      overview: 'A story about privilege, humility and noticing others. It models a descriptive informal letter in exam-safe English.',
      lessonMinutes: 40,
      goals: ['Explain the difference between charity and respect.', 'Describe a place using details that a reader can see and feel.', 'Write an informal letter with address, date and a warm close.'],
      subjects: [['Social Studies', 'Community and inequality'], ['English Language', 'Descriptive writing and informal letters'], ['Religious and Moral Education', 'Respect and service']],
      before: ['Ask: what do you notice about people who work for your family or your school?'],
      during: ['At page 5, ask learners what they would say to Uncle Joel.'],
      after: ['Write a letter to a friend describing a place you visited.', 'Plan a respectful visit to another school: what will you bring and listen for?'],
      discussion: ['What is the difference between helping and looking down on someone?', 'What is one way the people in your community can respect workers?'],
      reflection: ['Who in your life do you notice least, and how could you notice them more?'],
      support: ['Provide a letter frame with address, date, Dear…, introduction, body, conclusion, Yours ever.'],
      stretch: ['Write a short descriptive essay: “A Place That Changed How I See My City”.'],
      localise: ['Use real service-club practice in your school; invite learners from a different community to share their own stories.'],
      factCheck: [
        { claim: 'An informal letter has the writer’s address, the date, a salutation (“Dear” plus the name), an introduction, a main body, a conclusion and a subscription such as “Yours ever”.', explanation: 'From the NaCCA informal-letter lesson.', reference: 'NaCCA English Language LM Year 1 Section 15 (curriculumresources.edu.gh).' },
      ],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'friday-in-the-zongo',
    title: 'Friday in the Zongo',
    summary: 'Halima lives in a zongo, a busy neighbourhood of traders, tailors, teachers and footballers. A day from dawn prayers to the evening football match shows the community’s strengths and struggles, including school fees, a stigma she meets at school and the pride she finds in belonging. A story about identity and dignity with a narrative paragraph in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'cultural', 'school-life'],
    themes: ['community', 'identity', 'family', 'festivals'],
    objectives: ['respect', 'citizenship', 'cultural-heritage', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-food', 'local-names', 'market'],
    wpm: 120,
    paceWord: 'Busy and warm like a morning market, steadier at the prayer',
    palette: ['#15803d', '#f59e0b'],
    voice: 'Warm, proud girl’s voice for Halima; gentle, wise voice for Mallam Kadiri',
    characters: [
      'Halima Abdulai: a 13-year-old girl in a headscarf and school uniform, carrying a bowl of koko and koose.',
      'Wahab: her 10-year-old brother, in a football jersey, always running.',
      'Mallam Kadiri: the community’s Arabic and Quranic teacher, in a white kaftan and cap, with a gentle smile.',
      'Mr Obeng: Halima’s school teacher, in a short-sleeved shirt, who is fair and curious.',
    ],
    music: 'Warm northern-style drum and flute with morning market sounds; a proud, joyful tune at the match (placeholder)',
    pages: [
      pg('🌅', 'Before the sun was up, the zongo was already awake. Traders opened their stalls, a tailor hummed over his sewing machine, and the call to prayer floated over the rooftops. Halima helped her mother fry koose and pour koko for early customers. “Fresh and hot!” she called. The whole street smelled of spice and bean cakes, and she loved it.', 'A girl serves hot food from a stall as the sun rises over rooftops and a mosque.'),
      pg('📖', 'After breakfast, Halima went to Mallam Kadiri’s class for an hour of Arabic and the Quran. She sat among children of all ages, all reciting together. “Learning is a treasure,” said Mallam Kadiri. “It cannot be stolen, and it grows when you share it.” Then Halima hurried home, changed into her school uniform and set off for the junior high school, a short walk away.', 'Children sit on mats reciting with a teacher in a white kaftan before school.'),
      pg('🏫', 'At school, Halima was the best in English. But during break, a boy from another class sneered, “You people from the zongo only trade and fight.” Halima’s throat tightened. Then she remembered her street: the tailor who made school uniforms for free, the traders who paid fees for orphans, the imam who settled quarrels. “That is not true,” she said calmly. “Come and see.”', 'A girl faces a boy on a school field, standing tall while others watch.'),
      pg('👨🏫', 'Mr Obeng had heard. After class, he asked Halima to tell the whole class about her community. She was nervous, but she began: “The word zongo is often said to come from a Hausa word for a place where travellers rest. Many of us come from different places, languages and traditions, but we share one street.” The class listened. Mr Obeng nodded. “Every community has strengths and struggles,” he said. “Judging by one is not fair.”', 'A girl stands at the front of a class speaking while a teacher listens approvingly.'),
      pg('💸', 'But life was not easy. That evening, Halima’s father sat quietly with a notebook of bills. School fees were due, and the stall had earned less that week. Halima offered to stop school. “Never,” said her father. “Your education is our greatest investment.” Her aunt Latifa joined the family. “The neighbourhood association will help with part of it,” she said. “That is what neighbours are for.”', 'A family sits around a lamp with a notebook of bills while an aunt offers help.'),
      pg('⚽', 'On Friday evening, after prayers, the whole zongo gathered at the field. Wahab and his friends played football against a team from another neighbourhood. Halima cheered from the edge. The match ended in a draw, and both teams shook hands and shared water. “That is the zongo,” said her aunt, smiling. “Hard work, faith and good sport.”', 'Boys in jerseys play football on a dusty field while neighbours cheer from the sides.'),
      pg('✍️', 'That night, Halima wrote a narrative paragraph for English homework. “It was a Friday evening in the zongo, and the setting sun painted the rooftops gold. Boys chased a battered ball across the dusty field while their families cheered. When the final whistle blew, the two teams shook hands and laughed together. I felt proud to belong to a place where kindness is never in short supply.”', 'A girl writes at a small desk by lamplight with a football beside her.'),
      pg('✅', 'Exam-safe tip: a narrative paragraph uses past tense throughout, strong verbs such as “chased” and “painted”, and a sense of time and place. Halima began with “It was a Friday evening” and ended with a feeling. Notice that she wrote “was” and “chased”, never “is” and “chase” in the same paragraph. Keep the tense steady. The end.', 'A girl and her teacher read a paragraph with a tick beside the past-tense verbs.'),
    ],
    activities: [
      { id: 'zon-c1', type: 'comprehension', afterPage: 3, question: 'How does Halima answer the boy who insults her community?', options: ['Calmly, inviting him to come and see', 'By shouting', 'By ignoring him'], correctIndex: 0 },
      { id: 'zon-p1', type: 'prediction', afterPage: 5, prompt: 'Halima’s father has too little money for fees. What might the neighbours do?', options: ['Help with part of the fees', 'Ignore it', 'Close the school'] },
      { id: 'zon-c2', type: 'comprehension', afterPage: 7, question: 'Which tense does a narrative paragraph use?', options: ['The past tense throughout', 'A mix of past and present', 'The future tense'], correctIndex: 0 },
      { id: 'zon-voc', type: 'vocabulary', afterPage: 4, word: 'stigma', definition: 'An unfair bad opinion that people have about a group.', distractors: ['A kind of food', 'A school prize'] },
      { id: 'zon-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The zongo wakes early and Halima helps at the stall.', 'A boy insults the zongo at school.', 'Halima talks to the class about her community.', 'The whole zongo cheers at the Friday match.'] },
      { id: 'zon-sel', type: 'sel', afterPage: 8, prompt: 'Belonging to a community can make us proud. How do you feel about where you belong?', feelingOptions: ['Proud', 'Thankful', 'Strong', 'Happy'] },
    ],
    glossary: [
      { word: 'zongo', definition: 'A neighbourhood in many Ghanaian towns that grew from traders and settlers from many places, often with a large Muslim population.', pages: [4] },
      { word: 'investment', definition: 'Money, time or effort put in for a future benefit.', pages: [5] },
      { word: 'neighbourhood', definition: 'The area around where you live, and its people.', pages: [5] },
      { word: 'stall', definition: 'A small table or shop in a market or street for selling.', pages: [5] },
      { word: 'imam', definition: 'A leader of prayers in a mosque.', pages: [3] },
    ],
    culturalNotes: ['The community, school and people are invented. “Zongo” is the name of many neighbourhoods in Ghanaian towns; they are diverse and no single story describes all of them. The story shows one invented zongo with its strengths and struggles.', 'The origin of the word “zongo” (often said to come from a Hausa word for a camp or resting place) should be checked with a local historian or community elder before use in class.', 'Religious details (dawn call to prayer, Arabic and Quranic classes, Friday prayers, imam) are described briefly and respectfully; they should be reviewed by a local imam or Muslim teacher.'],
    reviewQuestions: ['Have a zongo community member, an imam or a Muslim teacher review the story for accuracy, respect and tone, and the origin of the word “zongo”.', 'Check that the story shows the stigma as unfair and does not repeat stereotypes as truth.', 'Check that the narrative-paragraph tip is correct: steady past tense, strong verbs, a sense of time and place.'],
    guide: {
      overview: 'A story about identity, pride and fairness in a zongo. It teaches how to answer prejudice calmly and models a narrative paragraph in steady past tense.',
      lessonMinutes: 45,
      goals: ['Describe strengths and struggles of a community without stereotypes.', 'Respond calmly to an unfair remark.', 'Write a narrative paragraph in steady past tense.'],
      subjects: [['Social Studies', 'Communities and diversity'], ['English Language', 'Narrative writing and tenses'], ['Religious and Moral Education', 'Respect for all faiths']],
      before: ['Ask: what do people sometimes say about your neighbourhood that is not fair? What is true and good about it?'],
      during: ['At page 3, ask learners how they would answer the boy.'],
      after: ['Write a narrative paragraph about a happy evening in your community, in the past tense.', 'Invite a parent or elder to speak about the history of your neighbourhood.'],
      discussion: ['Why do stereotypes hurt?', 'How can neighbours support a family with school fees?'],
      reflection: ['What is something about your community that you are proud of?'],
      support: ['Give learners a table of present-to-past verbs: chase – chased, paint – painted, shake – shook.'],
      stretch: ['Write a descriptive essay: “Our Neighbourhood at Dawn”.'],
      localise: ['Use your own community’s real foods, festivals and language. Do not copy the zongo details if they do not match your own community; ask residents.'],
      factCheck: [
        { claim: 'The word zongo is often said to come from a Hausa word for a camp or place where travellers rest; zongos in Ghana have grown into diverse neighbourhoods of traders and settlers from many places.', explanation: 'A commonly given origin; the exact history differs between towns and should be confirmed locally.', reference: 'Confirm with a local historian or community elder; add a named source before use.' },
      ],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-month-end-squeeze',
    title: 'The Month-End Squeeze',
    summary: 'Theophilus’s parents are a teacher and a nurse. They dress well, pay private school fees and always seem fine, but at month-end the family is stretched thin. A story about the hidden pressure of a middle-income home, honest talk about money, dignity in asking for help, and a full formal letter to the head teacher that follows every feature of the BECE format.',
    classIds: ['jhs-2', 'jhs-3'],
    ageMin: 13,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['realistic-fiction', 'family', 'drama'],
    themes: ['family', 'money-and-enterprise', 'community', 'school'],
    objectives: ['financial-literacy', 'honesty', 'responsibility', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Steady and quietly tense, warmer at the family talk',
    palette: ['#1e40af', '#f59e0b'],
    voice: 'Thoughtful teen voice for Theophilus; calm, caring adult voices for his parents',
    characters: [
      'Theophilus Ansah: a 14-year-old boy in a private-school uniform, with a fee reminder slip in his pocket.',
      'Nurse Rosemond Ansah: his mother, in a nurse’s uniform, tired but smiling, with a handbag.',
      'Mr Gabriel Ansah: his father, a teacher, in a neat shirt, with a notebook of household accounts.',
      'Vida: his 9-year-old sister, with a school bag and a big, curious look.',
    ],
    music: 'Quiet, steady piano and a ticking clock; a hopeful, warm tune at the family talk (placeholder)',
    pages: [
      pg('🏠', 'The Ansah family lived in a modest three-bedroom house with a small gate and a mango tree. Mrs Ansah was a nurse, Mr Ansah was a senior teacher, and their children went to a private school. To the neighbours, they looked comfortable. Theophilus believed it too, until the last week of the month, when everything went quiet and nobody asked for ice cream.', 'A modest house with a mango tree at dusk and a family seen through the window.'),
      pg('📆', 'At month-end, Theophilus noticed things. His mother walked to work instead of taking a taxi. His father counted coins at the kitchen table. The data bundle ran out. A slip in his school bag reminded him that the second instalment of fees was due. “Do not worry,” his mother said, but her smile did not reach her eyes.', 'A boy watches his father count coins at a kitchen table with a fee slip beside him.'),
      pg('🤐', 'At school, Theophilus hid the slip. His friends talked about holidays abroad and new phones, and he laughed along, afraid to be different. He told Vida, “Do not tell anyone we are short.” “But why?” she asked. “Because they will think we are poor,” he whispered. Vida frowned. “Is being short of money the same as being poor?” she asked. Theophilus had no answer.', 'A boy whispers to his younger sister at school gates while other students chat nearby.'),
      pg('💬', 'That weekend, Theophilus heard his parents talking softly in the kitchen. His father said, “We must either delay the fees or borrow, and I do not like borrowing.” His mother said, “Then we write to the school and explain honestly.” Theophilus stepped in. “Maybe I can help,” he said. His parents were surprised. “You are old enough to know,” said his father gently.', 'A boy stands at a kitchen doorway while his parents look up from a table of papers.'),
      pg('📊', 'Mr Ansah opened his accounts book. “Income, expenses, savings,” he said. “We earn this much. Fees, rent, food, transport, data, medicine. We are not poor, but there is little left. Every cedi must have a job.” He showed Theophilus where they had trimmed spending: fewer takeaways, no new clothes. “We do this together,” he said. “And we talk about money without shame.”', 'A father shows a boy a notebook of income and expenses at a kitchen table.'),
      pg('✉️', 'Together they wrote a formal letter to the head teacher. At the top right, Mr Ansah put his address, House 7, Mango Close, Kumasi, and below it the date, 28th February, 2027. On the left: The Head Teacher, Ridgeview Preparatory School, Box 31, Kumasi. “Dear Madam,” the letter began, and the heading read: REQUEST TO PAY THE SECOND INSTALMENT OF SCHOOL FEES IN TWO PARTS. The body read: “I am writing to request that I be allowed to pay the second instalment of Theophilus’s fees in two parts, one on 5th March and the other on 20th March. Firstly, my family’s expenses this month have been higher than usual. Secondly, I have paid every previous instalment on time. I shall be grateful for your kind consideration.” He closed with “Yours faithfully,”, signed, and wrote his full name, Gabriel Ansah.', 'A father and son write a formal letter at a table, with an address and date at the top.'),
      pg('🤝', 'The head teacher replied within two days. She agreed, and she also told the family about a school hardship fund for any child in need. “You did the right thing by asking,” she said. “Asking early is a sign of responsibility.” Theophilus felt the knot in his stomach loosen. At school, he told his closest friend the truth. “My family does not have as much as you think,” he said. His friend only said, “Mine neither.”', 'A head teacher smiles as she hands a reply letter to a boy in her office.'),
      pg('✅', 'Exam-safe tip: this is a full formal letter. It has the writer’s address, the date, the recipient’s designation and full address, “Dear Madam”, a heading, “Yours faithfully”, a signature and the writer’s full name. The body is polite, clear and persuasive, with two reasons, and uses no contractions or slang. Check the eight features before you hand in a formal letter. The end.', 'A boy and his father read the letter with a tick beside each of eight features.'),
    ],
    activities: [
      { id: 'sq-c1', type: 'comprehension', afterPage: 3, question: 'Why does Theophilus hide the fee slip?', options: ['He is afraid his friends will think his family is poor', 'He lost it', 'He does not care'], correctIndex: 0 },
      { id: 'sq-p1', type: 'prediction', afterPage: 5, prompt: 'The family decides to write to the school honestly. What might happen?', options: ['The school may agree to help', 'The school may expel him', 'Nothing will change'] },
      { id: 'sq-c2', type: 'comprehension', afterPage: 8, question: 'Which closing does a formal letter beginning “Dear Madam” use?', options: ['Yours faithfully', 'Yours ever', 'Your loving son'], correctIndex: 0 },
      { id: 'sq-voc', type: 'vocabulary', afterPage: 5, word: 'instalment', definition: 'One of several payments that together pay a larger amount.', distractors: ['A kind of loan from a friend', 'A bill with no due date'] },
      { id: 'sq-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Theophilus hides the fee slip.', 'His parents explain the family accounts.', 'They write a formal letter to the head teacher.', 'The head teacher agrees and mentions a hardship fund.'] },
      { id: 'sq-sel', type: 'sel', afterPage: 8, prompt: 'Talking about money can feel embarrassing. How do you feel about speaking honestly?', feelingOptions: ['Relieved', 'Nervous', 'Brave', 'Respected'] },
    ],
    glossary: [
      { word: 'modest', definition: 'Not large or fancy; simple.', pages: [1] },
      { word: 'instalment', definition: 'One of several payments that together pay a larger amount.', pages: [2, 6] },
      { word: 'accounts', definition: 'Written records of money coming in and going out.', pages: [5] },
      { word: 'hardship', definition: 'A time of great difficulty, especially with money.', pages: [7] },
      { word: 'persuasive', definition: 'Good at making someone agree.', pages: [8] },
    ],
    culturalNotes: ['The family, school and addresses are invented. Many Ghanaian families are middle-income: they have steady work but little spare money, and many live month to month. The story shows this without shame.', 'The story does not name a real school or place. Fee extensions and hardship funds differ from school to school; teachers should adapt the story to their own school’s rules.', 'The letter on page 6 is a full formal letter with the eight features: writer’s address, date, recipient’s designation and address, salutation, heading, subscription, signature, full name.'],
    reviewQuestions: ['Check the formal-letter format on page 6 against the BECE marking scheme.', 'Check that the story is sensitive to learners who live with real hardship and does not suggest that asking for help is shameful.', 'Check that any suggestion about borrowing is balanced, and that the story does not recommend loans or financial products.'],
    guide: {
      overview: 'A story about hidden money pressure in a middle-income family, honest talk and asking for help. It models a full formal letter with all eight features.',
      lessonMinutes: 45,
      goals: ['Explain the difference between being short of money and being poor.', 'List the parts of a formal letter and use them.', 'Describe why talking honestly about money helps a family.'],
      subjects: [['Mathematics', 'Income, expenses and budgets'], ['English Language', 'Formal letters'], ['Social Studies', 'Family and community']],
      before: ['Ask: what is the difference between feeling comfortable and feeling secure?'],
      during: ['At page 6, ask learners to tick off each of the eight formal-letter features.'],
      after: ['Write a formal letter to a head teacher asking for permission for any reasonable request.', 'Make a simple family budget with the learner’s own numbers, kept private.'],
      discussion: ['Why do people hide money worries?', 'What is the difference between asking for help and begging?'],
      reflection: ['What would help you speak honestly about a difficulty?'],
      maths: [
        { task: 'Fees are GH¢1,200 for the term, paid in two instalments. The first instalment is GH¢700. What is the second?', answer: '1,200 − 700 = GH¢500.' },
        { task: 'A family earns GH¢4,000 a month and spends GH¢3,700. What fraction is left as savings, in simplest form?', answer: '300 ÷ 4,000 = 3/40.' },
      ],
      support: ['Give learners the formal-letter checklist with eight boxes to tick.'],
      stretch: ['Write a formal letter to a school asking for a school hardship fund application form.'],
      localise: ['Use real fee practices from your area. Be careful: never ask learners to share their own family’s finances.'],
      factCheck: [
        { claim: 'A formal letter has the writer’s address, the date, the recipient’s designation and full address, “Dear Sir/Madam”, a title or heading, “Yours faithfully/Yours sincerely”, the writer’s signature and full name; the language must be polite, clear and persuasive with no contractions or slang.', explanation: 'From the formal-letter criteria supplied by the project owner.', reference: 'Project-owner marking guidance (organisation, expression, mechanical accuracy); verify against the official marking scheme.' },
      ],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-girl-who-carries-the-market',
    title: 'The Girl Who Carries the Market',
    summary: 'Ramatu is thirteen and carries shoppers’ goods on her head in a city market, sleeping on a shed floor at night. She is brave, hard-working and still a child with a right to school and safety. A story of dignity, a market woman’s kindness, a volunteer teacher and a social welfare officer, with a letter home in exam-safe English.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 11,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'drama', 'moral'],
    themes: ['community', 'helping-others', 'new-beginnings', 'family'],
    objectives: ['kindness', 'citizenship', 'emotional-intelligence', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['market', 'local-names'],
    wpm: 118,
    paceWord: 'Gentle and respectful, with a quiet strength',
    palette: ['#b45309', '#0369a1'],
    voice: 'Soft, brave voice for Ramatu; warm, motherly voice for Auntie Memunatu; calm voice for Madam Nkansah',
    characters: [
      'Ramatu: a 13-year-old girl in a faded dress and headscarf, with a large metal pan on her head and a bright, determined face.',
      'Auntie Memunatu: a tomato seller in her forties, in a bright wrapper, with a kind, shrewd face.',
      'Mr Kporha: a volunteer teacher in his twenties, in a casual shirt, with a bag of exercise books.',
      'Madam Nkansah: a social welfare officer in a smart dress, with an identification badge and a folder.',
    ],
    music: 'Busy market rhythm that softens to a gentle flute; a hopeful tune at the end (placeholder)',
    pages: [
      pg('🏙️', 'Ramatu arrived in the city market at dawn, as she did every day. She carried a large metal pan, the tool of a kayayo, a young woman or girl who carries shoppers’ loads on her head. A woman called, “Girl, carry my tomatoes!” Ramatu lifted the heavy basket and followed her through the noisy crowd, her neck steady and her feet quick.', 'A girl carries a heavy basket on her head through a crowded market at dawn.'),
      pg('🌙', 'Ramatu had left her village in the north the year before, hoping to earn money for her family and for her own school things. In the city, she shared a wooden shed floor with other girls at night. Some days she earned enough for a meal, and some days she did not. She missed her mother’s cooking and her village school. “One day, I will go back to class,” she told herself.', 'A girl lies on a mat in a market shed at night with other girls sleeping nearby.'),
      pg('🍅', 'Auntie Memunatu, a tomato seller, noticed the girl. “How old are you?” she asked kindly. “Thirteen,” said Ramatu. “Thirteen,” said Auntie. “Carrying loads is hard on a growing body.” She gave Ramatu a plate of rice and a place to sit in her stall in the shade. “Eat first,” she said. “Then we talk.” Ramatu ate slowly, and for the first time in weeks she felt cared for.', 'A market woman offers a plate of rice to a girl beside a pile of tomatoes.'),
      pg('📚', 'On Saturdays, a volunteer teacher named Mr Kporha held a reading class under the market’s shade. Ramatu joined. She was behind, but she learned fast. She learned to read a price tag, then a sentence, then a short story. “You are clever,” said Mr Kporha. “Clever, and brave. Learning is your right, Ramatu.” Ramatu held her small exercise book to her chest like a treasure.', 'A volunteer teacher and a girl read from a notebook under a shaded roof in a market.'),
      pg('🤝', 'Auntie Memunatu and Mr Kporha took Ramatu to see Madam Nkansah, a social welfare officer. Madam Nkansah listened, wrote carefully and explained. “In Ghana, every child has the right to education and protection,” she said. “Children should not be doing heavy work that harms them or keeps them from school. We will work with your family and find a safe place, and a school, for you.” Ramatu’s eyes filled with tears of relief.', 'A social welfare officer speaks gently to a girl and two adults in a small office.'),
      pg('🏫', 'Within weeks, Ramatu moved into a safe home for girls and began to attend school in the afternoons, with an evening class to catch up. She was in a class with younger children at first, and some of them giggled, but she did not mind. On Sundays, she visited Auntie Memunatu and carried nothing heavier than a bag of oranges. “I am learning,” she said. “I am learning very fast.”', 'A girl in a new school uniform walks into a classroom with a bag and a smile.'),
      pg('✉️', 'Ramatu wrote home with Mr Kporha’s help. “c/o Girls’ Home, Central Market Road, Accra. 12th May, 2027. Dear Mother, I hope you are well. I want to tell you some good news. I am now living in a safe home, and I am going to school every day. I miss you very much and I will come to see you during the holidays. Please greet everyone in the village for me. Your loving daughter, Ramatu.”', 'A girl writes a letter at a table with a teacher beside her and a small village photo.'),
      pg('✅', 'Exam-safe tip: an informal letter still needs an address, even a temporary one such as “care of” a home. The date comes below it. Ramatu used full words and a clear order: news, feelings, a promise and greetings. Notice “Dear Mother” and “Your loving daughter”, a warm close for a parent. Every child has a story, and every story deserves to be written well. The end.', 'A girl and her teacher read the letter with a tick beside the address and date.'),
    ],
    activities: [
      { id: 'kay-c1', type: 'comprehension', afterPage: 3, question: 'What does Auntie Memunatu do for Ramatu?', options: ['Gives her food and a place to sit', 'Sends her away', 'Asks her to carry more'], correctIndex: 0 },
      { id: 'kay-p1', type: 'prediction', afterPage: 5, prompt: 'The social welfare officer says every child has a right to school and protection. What might she do?', options: ['Help find a safe place and a school', 'Ignore it', 'Send Ramatu home alone'] },
      { id: 'kay-c2', type: 'comprehension', afterPage: 8, question: 'Why does Ramatu’s letter start with “c/o”?', options: ['She uses a temporary address care of the home', 'She forgot her address', 'It is a nickname'], correctIndex: 0 },
      { id: 'kay-voc', type: 'vocabulary', afterPage: 5, word: 'kayayo', definition: 'A girl or woman who carries goods on her head for shoppers in a market.', distractors: ['A market guard', 'A kind of cloth'] },
      { id: 'kay-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Ramatu carries loads in the market.', 'Auntie Memunatu feeds and helps her.', 'The welfare officer finds a safe home and school.', 'Ramatu writes home with good news.'] },
      { id: 'kay-sel', type: 'sel', afterPage: 8, prompt: 'Many people showed Ramatu kindness. How do you feel when you see people helping a child?', feelingOptions: ['Hopeful', 'Moved', 'Grateful', 'Determined'] },
    ],
    glossary: [
      { word: 'kayayo', definition: 'A girl or woman who carries goods on her head for shoppers in a market.', pages: [1] },
      { word: 'volunteer', definition: 'A person who gives their time to help without pay.', pages: [4] },
      { word: 'welfare', definition: 'Help and care for people’s well-being.', pages: [5] },
      { word: 'protection', definition: 'Keeping someone safe from harm.', pages: [5] },
      { word: 'relief', definition: 'A feeling of comfort after worry.', pages: [5] },
    ],
    culturalNotes: ['Ramatu, the market and all people are invented. Kayayei (plural) are girls and young women, often from northern Ghana, who work as head porters in city markets; some are children. The story shows one child’s experience with dignity and without graphic detail.', 'The story names the right to education and protection in general terms. The Children’s Act, 1998 (Act 560), and the free compulsory basic education policy should be checked with a child-protection officer before quoting them to learners.', 'No place of danger or abuse is shown. Teachers should know the school’s reporting steps and the contact details of the local social welfare office in case a learner needs help.'],
    reviewQuestions: ['Have a child-protection professional, such as a social welfare officer, review the story for accuracy, tone and safety before classroom use.', 'Check the Children’s Act and free compulsory basic education references.', 'Check that the story does not present the girls as helpless, nor charity as the only solution; it shows dignity, agency and systems working together.'],
    guide: {
      overview: 'A story about a young head porter and the people who help her find school and safety. It teaches children’s rights, dignity and an informal letter using a temporary address.',
      lessonMinutes: 45,
      goals: ['Explain that every child has a right to education and protection.', 'Name ways adults and communities can help a child in difficulty.', 'Write an informal letter with a “care of” address.'],
      subjects: [['Social Studies', 'Children’s rights and community help'], ['English Language', 'Informal letters'], ['Guidance and Counselling', 'Safety and asking for help']],
      before: ['Ask: what do children need to grow well? Who is responsible for giving it?'],
      during: ['At page 5, ask learners what rights Madam Nkansah names.'],
      after: ['Write a letter from Ramatu to a friend in the village.', 'Invite a social welfare officer to speak to the class about children’s rights.'],
      discussion: ['Why might a child leave home to work?', 'How can a community support such a child without shaming her?'],
      reflection: ['Who are the adults you can ask for help if you or a friend are in difficulty?'],
      support: ['Give learners a letter frame: address, date, Dear…, news, feelings, greeting, Your loving…'],
      stretch: ['Write a short report for a school magazine on the work of a local social welfare office (with an interview).'],
      localise: ['Use the contact details of your local social welfare office and school reporting steps. Take care with learners who may have personal experience of such work.'],
      factCheck: [
        { claim: 'The Children’s Act, 1998 (Act 560), sets out Ghanaian children’s rights, including protection from harmful work and the right to education; free compulsory universal basic education is national policy.', explanation: 'A general summary that should be confirmed against the text of the Act and current education policy.', reference: 'Children’s Act, 1998 (Act 560); Ghana’s free compulsory universal basic education policy. Verify wording before quoting.' },
      ],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-lagoon-side-cup',
    title: 'The Lagoon Side Cup',
    summary: 'Awudu and his friends live in a crowded settlement by a lagoon that outsiders call “the Ghetto”. They have talent, pride and a battered ball. A football cup, an unfair offer, a flooded pitch and a teacher who believes in them show what young people in such a place really face and what they can achieve. Includes a model summary paragraph in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['realistic-fiction', 'drama', 'moral'],
    themes: ['community', 'friendship', 'fear-and-courage', 'leadership'],
    objectives: ['perseverance', 'teamwork', 'honesty', 'summarising'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'local-food'],
    wpm: 122,
    paceWord: 'Quick and rhythmic like a street match, steadier at the choice',
    palette: ['#0e7490', '#ea580c'],
    voice: 'Confident street-smart teen voices; a calm, firm voice for Coach Hubert; a clear voice for Madam Matilda',
    characters: [
      'Awudu: a 15-year-old boy, captain of the Lagoon Side team, in a faded jersey and worn boots, with a steady gaze.',
      'Caleb: a 12-year-old boy, the goalkeeper, small, with oversized gloves held with tape.',
      'Coach Hubert: a local welder in his thirties, in work overalls, with a whistle round his neck.',
      'Madam Matilda: a volunteer teacher from a nearby school, in a plain dress, with a clipboard and a bag of notebooks.',
    ],
    music: 'Street-corner percussion and a rolling bassline; a proud brass tune at the final whistle (placeholder)',
    pages: [
      pg('🌊', 'Lagoon Side was a crowded settlement of tin roofs and narrow lanes beside a lagoon. Outsiders called it “the Ghetto” and said it was dirty and dangerous. The people who lived there said something else. Mothers fried fish and plantain by the roadside. Fathers repaired motorbikes and mended nets. And in the evenings, the boys played football on a patch of bare ground that they swept clean themselves.', 'A crowded lagoon-side settlement with tin roofs and a patch of ground where boys play football.'),
      pg('🏆', 'Awudu, the captain, heard about the Cup: a tournament for community teams from all over the city. “We are going,” he told his friends. “Our boots are broken, and our ball is old, but we have skill and we have heart.” Coach Hubert, a welder who trained them after work, nodded. “Then we will train like champions,” he said. “And play like gentlemen.”', 'A boy captain and a coach talk to a group of boys holding a battered ball.'),
      pg('📚', 'Madam Matilda, a volunteer teacher, joined the team’s training every Saturday. “Football is wonderful,” she said, “but a good player also reads, writes and counts.” After practice she taught them letters and numbers in the shade of a mango tree. “You will be better footballers if you are also better thinkers,” she said. Caleb, the youngest, raised his hand first every time.', 'A teacher sits under a mango tree with boys holding notebooks beside a football.'),
      pg('😤', 'On the day of the match, a boy from another team shouted across the pitch, “Ghetto boys cannot play fair! They only know how to steal!” Awudu’s fists tightened. Coach Hubert put a hand on his shoulder. “Show them with your feet and your behaviour,” he said. Awudu took a breath, then nodded. “We will play,” he said. “And we will play fair.”', 'A boy clenches his fists as a coach rests a calm hand on his shoulder at a football pitch.'),
      pg('💰', 'At half-time, a stranger in a clean shirt called Awudu aside. “Lose the next half,” he whispered, “and I will give you five hundred cedis for your team.” Awudu’s heart pounded. Five hundred cedis could buy boots, a ball, a lamp for the pitch. “No,” he said. “We play to win or lose honestly.” The stranger shrugged and left. Awudu told Coach Hubert at once.', 'A boy shakes his head at a man in a clean shirt whispering near the edge of a pitch.'),
      pg('🌧️', 'In the second half, dark clouds gathered, and rain fell hard. The pitch turned to mud, and the match was stopped. Everyone ran for shelter, because the lagoon’s edge flooded easily. Coach Hubert counted every boy twice. “Nobody goes near the water,” he said. The game restarted the next morning. Lagoon Side lost, one goal to none. Caleb had saved four shots, but the last one slipped in.', 'Boys run through heavy rain away from a flooded edge of a lagoon while a coach counts them.'),
      pg('🥇', 'At the closing ceremony, the organisers announced the winners, and then a surprise: the Fair Play Award. “The team that showed the most honour,” said the chairman, “is Lagoon Side.” The boys erupted in cheers. A coach from a school team shook Caleb’s hand. “Come for a trial next term,” he said. Awudu looked at his teammates, tears of pride in his eyes. “We lost the cup,” he said. “But we kept our name.”', 'Boys in faded jerseys hold up a small trophy while a school coach shakes the goalkeeper’s hand.'),
      pg('📝', 'Madam Matilda asked the boys to write a summary of the day. Caleb wrote: “A settlement team entered a football cup and met insults and an unfair offer. The captain refused the offer, and the team played honestly through a stormy match. Although they lost by one goal, they won the Fair Play Award, and the goalkeeper was invited for a trial.” Madam Matilda smiled. “That is a good summary,” she said. “It uses your own words and keeps only the main points.”', 'A boy reads his written summary aloud to a teacher and teammates under a mango tree.'),
      pg('✅', 'Exam-safe tip: a summary is short, written in your own words, in complete sentences and in the same tense, and it contains only the main points. Caleb left out the weather details and the names. He did not copy sentences from the story. Notice also that he wrote “went” and “refused”, never a chat shortcut. Every community has stories worth summarising. The end.', 'A teacher and a boy circle the main points of a story on a page.'),
    ],
    activities: [
      { id: 'lag-c1', type: 'comprehension', afterPage: 3, question: 'What do the people of Lagoon Side do for a living?', options: ['Fry fish, repair motorbikes and mend nets', 'Run big factories', 'Sell cars'], correctIndex: 0 },
      { id: 'lag-p1', type: 'prediction', afterPage: 5, prompt: 'A stranger offers money to lose the half. What will Awudu do?', options: ['Refuse and tell his coach', 'Accept the money', 'Walk off'] },
      { id: 'lag-c2', type: 'comprehension', afterPage: 9, question: 'What makes Caleb’s summary a good one?', options: ['It is short, in his own words and keeps the main points', 'It copies the story', 'It includes every name'], correctIndex: 0 },
      { id: 'lag-voc', type: 'vocabulary', afterPage: 6, word: 'honour', definition: 'Fairness and truthfulness in how you behave.', distractors: ['A cup', 'A coach'] },
      { id: 'lag-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The team hears about the Cup.', 'A stranger offers money to lose.', 'Rain stops the match and the next day Lagoon Side loses by one goal.', 'The team wins the Fair Play Award.'] },
      { id: 'lag-sel', type: 'sel', afterPage: 9, prompt: 'Losing honestly is hard but proud. How do you feel when you choose honesty over a reward?', feelingOptions: ['Proud', 'Tempted', 'Honest', 'Strong'] },
    ],
    glossary: [
      { word: 'settlement', definition: 'A place where people live, often one that grew without planning.', pages: [1] },
      { word: 'tournament', definition: 'A series of matches between several teams.', pages: [2] },
      { word: 'volunteer', definition: 'A person who gives time to help without pay.', pages: [3] },
      { word: 'summary', definition: 'A short account of the main points.', pages: [8, 9] },
      { word: 'ceremony', definition: 'A formal event held to mark something special.', pages: [7] },
    ],
    culturalNotes: ['Lagoon Side, the team and all people are invented. The word “ghetto” is used by some Ghanaians for crowded low-income settlements; the story shows the term as an outsiders’ label and presents the community’s own strengths and struggles.', 'The story includes a match-fixing offer to teach honesty. It does not show gangs, drugs or violence. Teachers should be ready to discuss peer pressure and trusted adults.', 'The flood scene shows the safety rule that children keep away from flooded water, drains and the lagoon edge.'],
    reviewQuestions: ['Check that the word “ghetto” is handled respectfully and that the story does not repeat the insult as truth; consider a local resident review.', 'Check that the match-fixing and sponsorship scene is age-appropriate and that Awudu tells a trusted adult.', 'Check the summary tip against the BECE summary-writing guidelines: own words, main points only, complete sentences, steady tense.'],
    guide: {
      overview: 'A story about pride, honesty and teamwork in a crowded settlement. It models a summary in the learner’s own words and teaches fair play over reward.',
      lessonMinutes: 45,
      goals: ['Describe a settlement community’s strengths and struggles without stereotypes.', 'Explain why honesty matters even when rewards are tempting.', 'Write a summary using own words and main points only.'],
      subjects: [['Social Studies', 'Communities and inequality'], ['English Language', 'Summary writing'], ['Physical Education', 'Teamwork and fair play']],
      before: ['Ask: what do people say about places like Lagoon Side? What do the residents say?'],
      during: ['At page 5, ask learners what they would do at the half-time offer.'],
      after: ['Write a three-sentence summary of the story in your own words.', 'Role-play telling a trusted adult about an unfair offer.'],
      discussion: ['Why do labels hurt a community?', 'How can a team keep its name when it loses?'],
      reflection: ['What would you do if someone offered you a reward to cheat?'],
      maths: [
        { task: 'Caleb saved 4 of 5 shots. What percentage did he save?', answer: '4 ÷ 5 × 100 = 80 per cent.' },
        { task: 'A cup has 8 teams in a knockout. How many matches are played in total?', answer: '4 + 2 + 1 = 7 matches.' },
      ],
      support: ['Give learners a summary frame: Who? What happened? How did it end? Use three sentences.'],
      stretch: ['Summarise a news article in sixty words.'],
      localise: ['Use real local sports, local clubs and your community’s actual strengths. Involve learners from different neighbourhoods.'],
      factCheck: [
        { claim: 'A good summary is short, in the writer’s own words, in complete sentences and the same tense, and contains only the main points.', explanation: 'A standard summary-writing guideline in Ghanaian English teaching; check against the BECE marking scheme.', reference: 'NaCCA English Language syllabus and WAEC BECE English chief examiners’ reports; verify wording.' },
      ],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-food-sellers-road',
    title: 'The Food Sellers’ Road',
    summary: 'The road to Palmview Basic School is lined with food sellers who feed hundreds of people each day and support their families. But the gutters are choked and children are pushed into traffic. Jonathan writes to the Municipal Chief Executive with two adverse effects and one solution, in a model formal letter that follows every BECE feature.',
    classIds: ['jhs-2', 'jhs-3'],
    ageMin: 13,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['realistic-fiction', 'educational', 'drama'],
    themes: ['community', 'citizenship', 'food', 'money-and-enterprise'],
    objectives: ['citizenship', 'critical-thinking', 'problem-solving', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-food', 'market', 'local-names'],
    wpm: 120,
    paceWord: 'Lively and busy at the road, careful and persuasive at the letter',
    palette: ['#b91c1c', '#16a34a'],
    voice: 'Lively street voices; a warm, dignified voice for Madam Mills; a clear voice for Jonathan',
    characters: [
      'Jonathan: a 14-year-old SRC prefect in a school uniform, with a notebook and a pen.',
      'Rahinatu: his classmate, 14, with a camera phone and a worried look.',
      'Madam Mills: a waakye seller in her fifties, in an apron and headscarf, ladling food from a large pot.',
      'Mr Zormelo: a municipal environmental officer, in a reflective vest, with a clipboard.',
    ],
    music: 'Busy street sounds, sizzling and chatter; a clear, determined tune at the letter (placeholder)',
    pages: [
      pg('🍛', 'Every morning, the road to Palmview Basic School smelled of waakye, fried plantain, kenkey and fried fish. Food sellers lined both sides, and hundreds of workers, students and travellers bought their breakfast. Madam Mills, the waakye seller, had fed the road for twenty years. “This pot pays school fees for my three children,” she often said. Nobody on the road doubted that she worked hard.', 'A busy road lined with food sellers, steaming pots and customers at breakfast time.'),
      pg('🚧', 'But the road had a problem. After breakfast, the gutters beside it were clogged with leaves, plastic bags and greasy water. When it rained, the water spilled over onto the road and into the shops. Jonathan, the SRC prefect, and his classmate Rahinatu photographed it. “It smells,” said Rahinatu. “And the mosquitoes breed there.” Jonathan wrote in his notebook: Effect one, choked gutters.', 'Two students photograph a clogged gutter full of plastic bags and greasy water beside a food stall.'),
      pg('🚗', 'Then there was the traffic. Stalls spread onto the pavements, so students had to walk in the road. One afternoon, a motorbike skidded and nearly hit a girl in Class 1. “That could have been a tragedy,” said Rahinatu. Jonathan underlined: Effect two, crowded pavements and danger to pedestrians. “We must tell the Assembly,” he said. “But we must be fair to the sellers too.”', 'Students walk along the edge of a busy road as a motorbike swerves past a crowded stall.'),
      pg('🤝', 'Jonathan went to talk to Madam Mills. She listened carefully. “I do not want children hurt,” she said. “But where would we go? Without this road, there is no income for my family.” She showed him her bin, which she emptied every evening, and said that some sellers did the same. “Not everyone does,” she admitted. “The road needs a plan, not a ban.”', 'A boy and a food seller talk beside her pot while a bin stands beside her stall.'),
      pg('💡', 'Jonathan met Mr Zormelo, an environmental officer. “A proper food court near the school, with bins, running water, covered drains and a licence for each seller, would solve both problems,” said Mr Zormelo. “It must be built with the sellers, not against them.” Jonathan wrote: Solution, a designated food court. “Now,” he said, “I know exactly what to write in my letter.”', 'A boy listens to an officer in a reflective vest who points at a sketch of a food court.'),
      pg('✉️', 'Jonathan put his address at the top right, SRC Office, Palmview Basic School, Box 40, Kumasi, and below it the date, 14th June, 2027. On the left he wrote: The Municipal Chief Executive, Greater Okuapa Municipal Assembly, Box 1, Kumasi. “Dear Sir,” he began, and the heading read: THE EFFECTS OF STREET FOOD VENDING ON OUR COMMUNITY AND A SOLUTION. His first paragraph read: “I am writing on behalf of the pupils of Palmview Basic School to bring to your attention two problems caused by food selling along our road, and to propose a solution. We respect the sellers, who feed our community and support their families.”', 'A boy writes the first part of a formal letter with his address, the date and the receiver’s title at the top.'),
      pg('📄', 'He continued: “First, the gutters are choked with plastic and greasy water. As a result, rainwater floods the road, and mosquitoes breed in the standing water, which may spread malaria. Second, stalls cover the pavements, so pupils must walk in the road. Consequently, a pupil was nearly knocked down last week. To solve both problems, I suggest a designated food court near the school with bins, covered drains, running water and licences for all sellers, planned together with the sellers. This will protect health, keep the road safe and protect their income. I shall be grateful for your kind consideration. Yours faithfully, Jonathan Gyimah, SRC Prefect.” He signed above his full name.', 'A boy completes a formal letter with three paragraphs, a closing and a signature above his name.'),
      pg('✅', 'Exam-safe tip: this letter has the writer’s address, the date, the recipient’s designation and full address, “Dear Sir”, a heading, “Yours faithfully”, a signature and the writer’s full name. It has two effects and one solution, each in its own paragraph, linked with “First”, “Second”, “As a result” and “Consequently”. It is polite, clear and persuasive, with no contractions or slang. Jonathan was fair to the sellers, and fairness persuades. The end.', 'A boy and his teacher read the letter with a tick beside each of the eight features.'),
    ],
    activities: [
      { id: 'fsr-c1', type: 'comprehension', afterPage: 3, question: 'What two problems does Jonathan find?', options: ['Choked gutters and crowded pavements', 'Loud music and slow service', 'High prices and small portions'], correctIndex: 0 },
      { id: 'fsr-p1', type: 'prediction', afterPage: 5, prompt: 'Madam Mills says the road needs a plan, not a ban. What might Jonathan propose?', options: ['A planned food court with the sellers', 'Closing the road', 'Doing nothing'] },
      { id: 'fsr-c2', type: 'comprehension', afterPage: 8, question: 'Why does Jonathan end with “Yours faithfully”?', options: ['He began with “Dear Sir”', 'He knows the officer’s name', 'He is writing to a friend'], correctIndex: 0 },
      { id: 'fsr-voc', type: 'vocabulary', afterPage: 7, word: 'designated', definition: 'Officially chosen for a particular purpose.', distractors: ['Painted', 'Closed'] },
      { id: 'fsr-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Jonathan notices the choked gutters and crowded pavements.', 'He listens to Madam Mills.', 'He talks to the environmental officer.', 'He writes a formal letter with two effects and one solution.'] },
      { id: 'fsr-sel', type: 'sel', afterPage: 8, prompt: 'Speaking up for a safe road while respecting sellers takes balance. How do you feel about it?', feelingOptions: ['Responsible', 'Determined', 'Fair', 'Hopeful'] },
    ],
    glossary: [
      { word: 'gutters', definition: 'Channels beside a road that carry away rainwater.', pages: [2, 7] },
      { word: 'pavements', definition: 'The paths beside a road for people on foot.', pages: [3, 7] },
      { word: 'licences', definition: 'Official papers that give permission to do something.', pages: [7] },
      { word: 'consequently', definition: 'As a result.', pages: [7] },
      { word: 'tragedy', definition: 'A very sad and serious event.', pages: [3] },
    ],
    culturalNotes: ['The school, sellers, officer and Municipal Assembly are invented. Food sellers are shown with respect: they feed their communities and earn a living. The story treats the problem as one that needs a plan made with the sellers.', 'The two effects (choked gutters and blocked pavements) and one solution (a designated food court) are examples. A different community may have different effects; teachers should help learners find evidence in their own area.', 'The letter on pages 6 and 7 is a model formal letter with the eight features. “Dear Sir” is used because the Municipal Chief Executive’s name is not given.'],
    reviewQuestions: ['Check the formal-letter format on pages 6 and 7 against the BECE marking scheme: the eight features, the two effects and one solution, and the link words.', 'Check that the story is fair to sellers and does not suggest that they alone cause the problems; some residents also dump waste.', 'Check the malaria and flooding statements with a health or environmental officer, and the food-court solution with a local planning officer.'],
    guide: {
      overview: 'A story that matches a typical BECE/WASSCE letter task: two adverse effects of food sellers on a community and one solution. It models a formal letter that follows every feature and treats the sellers fairly.',
      lessonMinutes: 50,
      goals: ['Write a formal letter with all eight features.', 'Organise two effects and one solution in separate, linked paragraphs.', 'Use polite, persuasive language with no contractions.'],
      subjects: [['English Language', 'Formal letters and persuasive writing'], ['Social Studies', 'Local government and citizenship'], ['Integrated Science', 'Waste, drains and mosquitoes']],
      before: ['Ask: who benefits from the food sellers on your road? What problems can they cause?'],
      during: ['At pages 6 and 7, ask learners to tick the eight features in the letter.'],
      after: ['Write a formal letter to the Municipal Chief Executive about a problem in your own community, with two effects and one solution.', 'Interview a food seller about what they need.'],
      discussion: ['How can a solution help both sellers and neighbours?', 'Why is fairness persuasive?'],
      reflection: ['What is one thing you could do this week to keep your road clean and safe?'],
      support: ['Give learners a paragraph frame: First… As a result… Second… Consequently… To solve this I suggest…'],
      stretch: ['Write a reply from the Municipal Chief Executive, using formal language.'],
      localise: ['Use real local places and your own Assembly’s title. Talk to real sellers, with their permission.'],
      factCheck: [
        { claim: 'A formal letter has the writer’s address, the date, the recipient’s designation and full address, “Dear Sir/Madam”, a title or heading, “Yours faithfully/Yours sincerely”, the writer’s signature and full name; the language must be polite, clear and persuasive with no contractions or slang.', explanation: 'From the formal-letter and essay criteria supplied by the project owner, including the two-part task of two adverse effects and one solution.', reference: 'Project-owner marking guidance (organisation, expression, mechanical accuracy); verify against the official marking scheme.' },
      ],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'one-trotro-four-worlds',
    title: 'One Trotro, Four Worlds',
    summary: 'A flood jams the city and a trotro crawls for two hours. On board are an estate boy who has never ridden one, a girl from a zongo, a middle-income boy and a twelve-year-old hawker. A missing phone, a quick accusation and a calm search teach all four about prejudice, evidence and each other. Includes direct and reported speech in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['realistic-fiction', 'drama', 'humour'],
    themes: ['community', 'friendship', 'identity', 'citizenship'],
    objectives: ['respect', 'critical-thinking', 'reasoning', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'market'],
    wpm: 122,
    paceWord: 'Lively and funny in the jam, calm and careful at the search',
    palette: ['#ca8a04', '#2563eb'],
    voice: 'Distinct teen voices: polished (Patrick), warm (Halima), steady (Theophilus), quick and friendly (Samuel); a loud, cheerful mate',
    characters: [
      'Patrick Attipoe: a 14-year-old boy from an estate, in a smart uniform, with a phone and a worried face.',
      'Halima: a 13-year-old girl in a headscarf and uniform, sitting by the window with a book.',
      'Theophilus: a 14-year-old boy in a school uniform, holding a bus fare in his hand.',
      'Samuel: a 12-year-old boy in a faded T-shirt, with a bag of sachet water, selling to passengers; he attends school in the afternoon.',
    ],
    music: 'Honking traffic, rain on a tin roof and a bouncing highlife; a steady, relieved tune at the end (placeholder)',
    pages: [
      pg('🌧️', 'The rain came down like a drum roll, and the roads of the city turned to rivers. The trotro was packed with passengers on their way to the inter-school quiz. Patrick Attipoe, from Palm Crest Estate, sat stiffly near the door. His driver had fallen sick, and his father’s car was in the garage. “Is this normal?” he whispered, holding his bag on his knees. Halima, beside him, smiled. “Welcome to the city,” she said.', 'A packed trotro in heavy rain with passengers holding bags and a boy sitting stiffly near the door.'),
      pg('💬', 'The mate, the conductor who collected fares, leaned in. “Fare, fare!” he called. Patrick held out a big note. “I do not have change,” said the mate, “but your friends can help.” Theophilus, across the aisle, passed some coins. “Pay it forward,” he said. Patrick blushed and thanked him. “Please move in, please!” called the mate. A woman shifted to make room. Nobody complained, and Patrick learned something about patience.', 'A conductor leans through the door collecting fares as passengers pass coins along the rows.'),
      pg('💧', 'Samuel, a boy of twelve, squeezed in with his bag of sachet water. “Cold water, cold water!” he called, passing it hand to hand with a smile. He sold in the mornings and went to school in the afternoons, and today the rain had stopped him from going. Patrick had never spoken to a hawker. “How much?” he asked. “One cedi,” said Samuel. “For you, one cedi and a smile.” Patrick laughed and bought two.', 'A boy hands a sachet of water to a passenger as rain falls outside the window.'),
      pg('📱', 'After an hour, the trotro was still stuck. Patrick reached into his pocket, and his face fell. “My phone,” he said. “It is gone.” The woman next to him frowned. “That boy who passed around the water,” she said loudly, pointing at Samuel. “He was close to you.” The whole bus fell silent. Samuel’s face turned grey. “I did not take it,” he said quietly. “I swear.”', 'A boy checks his empty pocket while passengers turn and look at a young hawker.'),
      pg('🔍', 'Halima stood up. “Please, let us not accuse anyone without evidence,” she said calmly. “Patrick, when did you last use it?” “Just before the second bridge,” he said. Theophilus nodded. “Then let us look under the seats first.” Passengers moved their bags and feet. Samuel searched with the rest, his hands trembling. “We must be fair,” said Halima. “Looking comes before blaming.”', 'Passengers search under seats with a phone torch while a girl speaks calmly to the bus.'),
      pg('✨', 'Theophilus found it, face down in the gap between two seats, the screen glowing. “Here!” he cried. “It slipped out of your pocket when you moved over.” A sigh of relief passed through the bus. The woman’s face fell. “I am sorry, young man,” she said to Samuel. “I should not have said it.” Samuel nodded. “It is all right, Madam,” he said, “but it did hurt.” The woman pressed a few coins into his hand. “For your water,” she said.', 'A boy lifts a glowing phone from between two seats while a woman apologises to the hawker.'),
      pg('🤝', 'As the trotro finally rolled forward, Patrick turned to Samuel. “I am sorry too,” he said. “I did not say anything when she pointed at you. I should have.” Samuel shrugged. “You were scared,” he said. “But next time, speak.” Patrick nodded. “Next time,” he said. By the time they reached the quiz hall, the four had swapped names, numbers and plans to study together. They had crossed four worlds in a single bus.', 'Four students step off a trotro into the sunlight, talking and laughing together.'),
      pg('✍️', 'In English class the next day, Halima showed how to report what was said. “Direct speech uses quotation marks,” she said. “‘Please move in,’ said the mate. Reported speech changes the words: The mate asked the passengers to move in. We drop the quotation marks, change the pronouns and usually move the verb back in time. So ‘I did not take it,’ said Samuel becomes Samuel said that he had not taken it.” Patrick wrote it in his notebook.', 'A girl explains direct and reported speech on a board while classmates take notes.'),
      pg('✅', 'Exam-safe tip: in reported speech, check three things: the quotation marks, the pronouns and the tense. “I am sorry,” said Patrick becomes Patrick said that he was sorry. Always begin with a capital letter, and always use full words in the answer. And remember Samuel: the evidence comes before the accusation. The end.', 'A boy and a girl compare a sentence in direct and reported speech with arrows between them.'),
    ],
    activities: [
      { id: 'tro-c1', type: 'comprehension', afterPage: 4, question: 'Why does the woman point at Samuel?', options: ['He was sitting close to Patrick and she assumed he took the phone', 'She saw him take it', 'He confessed'], correctIndex: 0 },
      { id: 'tro-p1', type: 'prediction', afterPage: 5, prompt: 'Halima says to look before blaming. What might they find?', options: ['The phone had slipped out of the pocket', 'A thief', 'Nothing at all'] },
      { id: 'tro-c2', type: 'comprehension', afterPage: 9, question: 'What changes when direct speech becomes reported speech?', options: ['Quotation marks, pronouns and tense', 'Only the punctuation', 'The speaker'], correctIndex: 0 },
      { id: 'tro-voc', type: 'vocabulary', afterPage: 4, word: 'evidence', definition: 'Facts that show something is true.', distractors: ['A guess', 'A rumour'] },
      { id: 'tro-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The trotro gets stuck in flood traffic.', 'Patrick’s phone seems to be missing.', 'Passengers search and find the phone under a seat.', 'The students become friends.'] },
      { id: 'tro-sel', type: 'sel', afterPage: 9, prompt: 'Being accused unfairly hurts. How do you feel when you see it happen?', feelingOptions: ['Uncomfortable', 'Brave', 'Fair', 'Concerned'] },
    ],
    glossary: [
      { word: 'conductor', definition: 'The person on a bus who collects fares.', pages: [2] },
      { word: 'hawker', definition: 'A person who sells goods by carrying them around.', pages: [3] },
      { word: 'evidence', definition: 'Facts that show something is true.', pages: [5] },
      { word: 'accuse', definition: 'To say that someone has done something wrong.', pages: [5] },
      { word: 'pronouns', definition: 'Words such as he, she, it and they that replace nouns.', pages: [8] },
    ],
    culturalNotes: ['The trotro, passengers and quiz are invented. Trotros are shared minibuses in Ghanaian cities; the “mate” is the conductor who collects fares.', 'The story shows a child hawker who sells before or after school. Many Ghanaian children do some work; the story does not present it as ideal, and teachers can discuss school hours and child protection.', 'The false accusation is resolved by evidence, not by guesswork; it teaches learners to question stereotypes of street children.'],
    reviewQuestions: ['Check the direct and reported speech explanation against the NaCCA English syllabus (quotation marks, pronouns, tense shifts).', 'Check that the story does not suggest that street children are likely to steal, and that the accusation is shown as unfair.', 'Check that the child-hawker details are respectful and that no safety danger is shown (for example, hawking in dangerous traffic).'],
    guide: {
      overview: 'A story about prejudice, evidence and friendship across communities on a stuck trotro. It teaches direct and reported speech.',
      lessonMinutes: 45,
      goals: ['Explain why evidence comes before accusation.', 'Convert simple sentences from direct to reported speech.', 'Describe how people from different communities can learn from each other.'],
      subjects: [['English Language', 'Direct and reported speech'], ['Social Studies', 'Citizenship and fairness'], ['Guidance and Counselling', 'Bias and empathy']],
      before: ['Ask: have you ever been blamed for something you did not do? How did it feel?'],
      during: ['At page 5, ask learners what they would do if they were a passenger.'],
      after: ['Change ten direct-speech sentences from the story into reported speech.', 'Write a short dialogue between two students from different neighbourhoods.'],
      discussion: ['Why do we sometimes blame the person who seems different?', 'How can a group search for evidence fairly?'],
      reflection: ['What do you do when you see someone accused without proof?'],
      maths: [
        { task: 'A fare is GH¢3. Four students pay with a GH¢20 note between them. How much change?', answer: '20 − (4 × 3) = GH¢8.' },
        { task: 'Samuel sells 30 sachets at GH¢1 each and buys them at 70 pesewas each. What is his profit?', answer: '30 × 0.30 = GH¢9.' },
      ],
      support: ['Provide a table: Direct speech | Pronoun change | Tense change | Reported speech.'],
      stretch: ['Write a news report of the trotro incident using reported speech.'],
      localise: ['Use your town’s real transport words and routes. Never encourage learners to hawk in traffic.'],
      factCheck: [
        { claim: 'In reported speech, quotation marks are dropped, pronouns change to fit the reporter’s view, and the tense usually shifts back one step when the reporting verb is in the past.', explanation: 'A standard English grammar rule taught in Ghanaian schools.', reference: 'NaCCA English Language syllabus; standard English grammar references.' },
      ],
    },
  }),

  // 8 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'community-day-on-the-open-ground',
    title: 'Community Day on the Open Ground',
    summary: 'The estate, the zongo, the settlement by the lagoon, the middle-income streets and the market all meet for one day: a clean-up, a free health screening, a football friendly and a speech. A story about unity, rights and duties, in which the young people from the earlier stories take the stage, with a model speech in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['realistic-fiction', 'drama', 'educational'],
    themes: ['community', 'citizenship', 'leadership', 'helping-others'],
    objectives: ['citizenship', 'teamwork', 'respect', 'oral-language'],
    ghanaianContext: 'central',
    culturalTags: ['festival', 'local-food', 'local-names'],
    wpm: 120,
    paceWord: 'Festive and bright, formal and clear at the speech',
    palette: ['#16a34a', '#eab308'],
    voice: 'Many lively voices; a clear, confident voice for Halima’s speech; a warm voice for Madam Oduro',
    characters: [
      'Halima: a 13-year-old girl in a neat headscarf and uniform, standing at a microphone with note cards.',
      'Juliet, Theophilus, Awudu, Caleb, Samuel and Ramatu: six young people from different communities in work gloves and matching sashes.',
      'Madam Oduro: the Assembly member for the area, in a patterned dress, with a clipboard and a calm smile.',
      'Elders: the zongo chief, an imam, a pastor and a market queen mother sitting together on benches under a shade.',
    ],
    music: 'Festive drums and a brass band, with the sounds of a clean-up and a football match; a joyful finale (placeholder)',
    pages: [
      pg('📢', 'It began with a poster on a wall: COMMUNITY DAY, Saturday, on the Open Ground, everyone welcome. The Assembly member, Madam Oduro, had asked the young people of five neighbourhoods to plan it together. Halima, Juliet, Theophilus, Awudu and Caleb met under a mango tree. “We each know our own streets,” said Halima. “Now we must learn each other’s.”', 'Five young people from different neighbourhoods plan around a poster under a mango tree.'),
      pg('🧹', 'On Saturday morning, the Open Ground filled with people in gloves and sashes. Boys from the lagoon settlement cleared the drain beside the ground. Girls from the zongo swept the path. Students from the estate brought sacks and tools, and the middle-income families brought water and snacks. Ramatu and Samuel handed out gloves. “Wear them properly,” said Awudu. “And nobody goes into the drain or the water. That is the rule.”', 'People in gloves and sashes sweep, carry sacks and clear a drain beside an open ground.'),
      pg('🩺', 'Under a big canopy, nurses from the nearby clinic offered free screenings for blood pressure, eyesight and sugar levels. Theophilus’s mother was among them. A health officer explained the National Health Insurance Scheme and helped families to register or renew. “Every child has a right to health care,” she said, “and the scheme can cover many children’s medical costs.” A long queue formed, and nobody minded the wait.', 'Nurses test blood pressure under a canopy while families queue to register for health insurance.'),
      pg('📚', 'Juliet’s book corner was a hit. She had collected hundreds of storybooks from her estate and her school, and Samuel and Caleb were first in line. “Take as many as you can read,” she said, smiling. Richmond, the reader from the community school, read aloud to a circle of younger children. Samuel borrowed three. “I will return them,” he said, “and I will bring my friends.”', 'Children sit around storybooks on a mat while a boy reads aloud to a circle.'),
      pg('⚽', 'At noon came the football friendly: Lagoon Side against a team from the estate. The estate boys had new boots, and the Lagoon Side boys had old ones, but nobody mentioned it. Caleb saved a penalty. Awudu scored from a free kick. The match ended in a draw, and both teams took the Fair Play trophy together. “Football is a language,” said Coach Hubert. “And today everyone speaks it.”', 'Two football teams in different boots shake hands on an open ground after a draw.'),
      pg('🎤', 'Then came the speeches. Halima stood at the microphone, her note cards in her hand. “Nana, Reverend, Imam, Madam Assembly Member, distinguished ladies and gentlemen,” she began, and the crowd fell quiet. “We come from different streets, but we drink from the same tap, walk the same roads and breathe the same air. Rights belong to everyone, and so do duties. Let us build a community where no child is left behind.”', 'A girl speaks at a microphone with note cards while elders and neighbours listen under a shade.'),
      pg('🌅', 'When the sun began to sink, the Open Ground was clean, the drain was clear, and nobody wanted to leave. The elders sat together: the zongo chief, the imam, the pastor and the queen mother of the market. “This is what we need more of,” said the queen mother. Madam Oduro nodded. “Community Day will be held every term,” she announced. “And the young people will lead it.” A great cheer rose.', 'Elders of different faiths and roles sit together at sunset as the crowd cheers.'),
      pg('✅', 'Exam-safe tip: a speech begins with the correct address, such as “Mr Chairman, Reverend, Imam, distinguished ladies and gentlemen”. It states the topic, gives two or three clear points with examples, and ends with a call to action. It is written in polite, persuasive language, with no contractions or slang, and it is read aloud, so use short, strong sentences. Halima’s opening sentence names her audience and her purpose. The end.', 'A girl and her teacher look at a speech outline with an address, three points and a closing line.'),
    ],
    activities: [
      { id: 'cmd-c1', type: 'comprehension', afterPage: 3, question: 'What safety rule does Awudu give at the clean-up?', options: ['Nobody goes into the drain or the water', 'Everyone enters the drain', 'No gloves are needed'], correctIndex: 0 },
      { id: 'cmd-p1', type: 'prediction', afterPage: 5, prompt: 'The football friendly is between Lagoon Side and the estate. What might happen?', options: ['A fair match and shared respect', 'A fight', 'The match is cancelled'] },
      { id: 'cmd-c2', type: 'comprehension', afterPage: 8, question: 'What does a good speech begin with?', options: ['The correct address to the audience', 'A joke only', 'Thanks to nobody'], correctIndex: 0 },
      { id: 'cmd-voc', type: 'vocabulary', afterPage: 6, word: 'distinguished', definition: 'Respected and well known.', distractors: ['Very tall', 'Very young'] },
      { id: 'cmd-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The young people plan Community Day.', 'People clean up and register for health insurance.', 'The football friendly ends in a draw.', 'Halima gives her speech.'] },
      { id: 'cmd-sel', type: 'sel', afterPage: 8, prompt: 'A whole community working together is powerful. How does that feel?', feelingOptions: ['Proud', 'United', 'Hopeful', 'Inspired'] },
    ],
    glossary: [
      { word: 'canopy', definition: 'A cover that gives shade or shelter.', pages: [3] },
      { word: 'screenings', definition: 'Health checks to find problems early.', pages: [3] },
      { word: 'friendly', definition: 'A match played for fun rather than for a prize.', pages: [5] },
      { word: 'distinguished', definition: 'Respected and well known.', pages: [6] },
      { word: 'duties', definition: 'Things that people are expected to do.', pages: [6] },
    ],
    culturalNotes: ['The ground, neighbourhoods, people and the Assembly member are invented; no real politician, chief or organisation is named. The elders (a zongo chief, an imam, a pastor and a market queen mother) show that leadership is shared across faiths and roles.', 'The free health screenings and the National Health Insurance Scheme are mentioned in general terms; teachers should check current coverage and registration steps with the local NHIS office.', 'The speech on page 6 and the tip on page 8 use a common BECE/WASSCE speech pattern: address, topic, points, call to action; check against the marking scheme.'],
    reviewQuestions: ['Check the NHIS statement (that the scheme can cover many children’s medical costs) with the National Health Insurance Authority’s current guidance.', 'Check the speech format and address against the BECE marking scheme.', 'Check that the story does not portray any community as the helper and another as the helped; each one gives and receives.'],
    guide: {
      overview: 'A closing story that brings the communities from the batch together on a Community Day. It models a speech with the correct address and shows rights and duties in action.',
      lessonMinutes: 50,
      goals: ['Explain how different communities can work together.', 'Name rights and duties in a community.', 'Write a short speech with the correct address and a call to action.'],
      subjects: [['Social Studies', 'Citizenship, rights and duties'], ['English Language', 'Speech writing'], ['Integrated Science', 'Health and sanitation']],
      before: ['Ask: what could your community do together in one day?'],
      during: ['At page 6, ask learners to underline the address, the main points and the call to action.'],
      after: ['Write a two-minute speech for a community day in your own area.', 'Plan a class “Community Day” with five jobs.'],
      discussion: ['Why does each community have something to give?', 'What is the link between rights and duties?'],
      reflection: ['What is one duty you can take on in your community?'],
      support: ['Provide a speech frame: Address / Topic / Point 1 / Point 2 / Point 3 / Call to action.'],
      stretch: ['Write both a speech and a formal letter inviting the Assembly member to a community event.'],
      localise: ['Use your own neighbourhoods, leaders and local health office. Involve real elders, imams, pastors and market leaders, with their agreement.'],
      factCheck: [
        { claim: 'The National Health Insurance Scheme covers a range of medical costs for registered members, and children’s membership is supported.', explanation: 'A general statement that should be checked against the current NHIA benefits package.', reference: 'National Health Insurance Authority (nhia.gov.gh); verify the current wording.' },
      ],
    },
  }),
];

