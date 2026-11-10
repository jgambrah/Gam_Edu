/**
 * Batch 20: School life. Eight vibey but educative stories about everyday student life: punctuality and prefects,
 * the tuck shop and pocket money, inter-house sports, a science fair, mock exams, chat voice versus exam voice, a new
 * girl and bullying, and an informal-letter masterclass.
 *
 * Rules: as Batches 13 to 19. All characters and schools are invented. Every informal letter in the stories uses
 * full words, correct spelling and standard punctuation (exam-safe). Chat-style slang, text abbreviations, emoji
 * and pidgin appear only as labelled "chat-only" mistakes with the exam-safe fix beside them. Claims about WAEC and
 * marking are paraphrased from the sources in each fact-check and flagged for review against the current syllabus.
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

export const BATCH_20_STORIES: PilotStory[] = [
  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'late-again-bismark',
    title: 'Late Again, Bismark?',
    summary: 'Bismark is late to assembly for the fifth time and the prefect Linda is ready to write his name in the book. But the housemaster asks one question first: why? A lively story about punctuality, fairness, helping at home and turning over a new leaf, with an exam-safe friendly letter on the last pages.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'school-life', 'humour'],
    themes: ['school', 'friendship', 'community'],
    objectives: ['responsibility', 'emotional-intelligence', 'vocabulary', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Lively and quick, like a school corridor, slower at the letter',
    palette: ['#2563eb', '#f59e0b'],
    voice: 'Bright, cheeky student voices; a steady, fair voice for Mr Acquah',
    characters: [
      'Bismark: a 14-year-old boy in a slightly crumpled uniform, out of breath, with a school bag over one shoulder.',
      'Linda: a 15-year-old girl prefect in a sash and badge, holding a notebook and a whistle.',
      'Mr Acquah: the housemaster, in a checked shirt and tie, with a calm smile and a mug of tea.',
      'Bismark’s mother: a trader at a small roadside stall at dawn, tying up bunches of onions.',
    ],
    music: 'Upbeat highlife guitar with school-bell hits; a gentle, warm tune for the letter (placeholder)',
    pages: [
      pg('🔔', 'The assembly bell rang, and the whole school stood in neat lines. At the gate, Bismark sprinted in, tie flapping, shoes dusty, and skidded to a stop in front of Linda the prefect. “Fifth time this month!” she said, flipping open her notebook. “Name, please.” Bismark gasped for air. “You already know my name, Linda,” he said. A few students giggled.', 'A boy sprints through a school gate as a prefect with a notebook and whistle stands waiting, while students in lines look on.'),
      pg('🇬🇭', 'Linda marched Bismark to the line, and the school recited the national pledge and sang the anthem. Bismark sang it with his whole heart, still panting. When assembly ended, Mr Acquah the housemaster called him over. “Bismark, you have a reputation,” he said. “The early bird catches the worm, and you catch the bell. Before I write anything, tell me one thing. Why?”', 'A school assembly with students saluting the flag, and a housemaster calling a boy over afterwards.'),
      pg('🌄', 'Bismark looked at his shoes. “Sir, I get up at four,” he said. “My mother sells onions at the roadside stall, and I help her set up before school. Then I walk the five kilometres here. Sometimes the trotro does not come. I try my best.” Mr Acquah listened without interrupting. Linda, standing nearby, stopped writing. She had not known any of this.', 'A boy tying up bunches of onions at a roadside stall in the grey light of dawn.'),
      pg('🤝', '“You should have told us,” said Mr Acquah. “Rules matter, and so do reasons. Punctuality is a habit, but a good school looks for the cause before it hands out the cane of blame.” He turned to Linda. “A prefect’s job is to guide, not to catch people out.” Linda nodded slowly. “Sorry, Bismark,” she said. “I should have asked before I assumed.”', 'A housemaster speaks gently to two students while a prefect lowers her notebook.'),
      pg('🗓️', 'Together they made a plan. Bismark’s mother would let him leave the stall at five, because her neighbour’s niece offered to help. Bismark would set two alarms and pack his bag the night before. And Linda would meet him at the gate each morning for two weeks. “Think of it as turning over a new leaf,” said Mr Acquah. “Small changes, steady effort.”', 'Three people review a timetable on a notice board with a clock showing five o’clock.'),
      pg('📈', 'Two weeks later, Bismark arrived at 7:10, then 7:05, then 6:58. Linda cheered from the gate. By the third week he was early enough to help water the school garden. “Look at you,” said Linda. “Top of the class for punctuality!” Bismark grinned. “All thanks to you and the housemaster,” he said. “And two alarm clocks, and one very patient mother.”', 'A boy arrives at the school gate under a bright sun with a smiling prefect beside him.'),
      pg('✉️', 'That weekend, Bismark wrote a letter to his cousin Nana in Kumasi. “Dear Nana, I hope this letter finds you and everyone at home in good health. I have good news to share. After a rough start to the term, I am now one of the first students at school each morning. My mother and my housemaster helped me find a plan that works. How is your new school? Please write soon. Your loving cousin, Bismark.”', 'A boy writes a friendly letter at a small table by lamplight with a pen and lined paper.'),
      pg('✅', 'Exam-safe tip: in the letter, Bismark used full words, correct spelling and friendly phrases such as “I hope this letter finds you in good health” and “Please write soon.” That is the kind of informal English that fits a BECE letter to a cousin. Linda read the letter over his shoulder and smiled. “That is a lot better than a late mark,” she said. The end.', 'A prefect and a student read a letter together, with a tick drawn on the page.'),
    ],
    activities: [
      { id: 'late-c1', type: 'comprehension', afterPage: 3, question: 'Why was Bismark always late?', options: ['He helped his mother at her stall and walked far', 'He enjoyed missing assembly', 'He did not own a uniform'], correctIndex: 0 },
      { id: 'late-p1', type: 'prediction', afterPage: 4, prompt: 'Mr Acquah says rules matter and so do reasons. What might the prefect learn?', options: ['To ask why before punishing', 'To ignore the rules', 'To stop being a prefect'] },
      { id: 'late-c2', type: 'comprehension', afterPage: 7, question: 'Which phrase does Bismark use to open his letter?', options: ['I hope this letter finds you and everyone at home in good health', 'Hey, what is up', 'Yo, long time'], correctIndex: 0 },
      { id: 'late-voc', type: 'vocabulary', afterPage: 5, word: 'turn over a new leaf', definition: 'To start behaving in a better way.', distractors: ['To tear a page', 'To water a plant'] },
      { id: 'late-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Bismark arrives late to assembly.', 'Mr Acquah asks him why.', 'They make a plan together.', 'Bismark becomes one of the first at school.'] },
      { id: 'late-sel', type: 'sel', afterPage: 8, prompt: 'Sometimes we judge before we know the reason. When did someone listen to your side of a story?', feelingOptions: ['Understood', 'Relieved', 'Grateful', 'Respected'] },
    ],
    glossary: [
      { word: 'prefect', definition: 'A senior student who helps keep order in a school.', pages: [1] },
      { word: 'punctuality', definition: 'Arriving on time.', pages: [4] },
      { word: 'housemaster', definition: 'A teacher in charge of a school house or boarding group.', pages: [2] },
      { word: 'reputation', definition: 'What people generally think about you.', pages: [2] },
      { word: 'habit', definition: 'Something you do so often that it becomes automatic.', pages: [4] },
    ],
    culturalNotes: ['The students and staff are invented. The story shows a day school, an assembly with the national pledge and anthem, and a prefect system.', 'The letter on page 7 is written in exam-safe informal English: full words, correct spelling, friendly phrases and no slang.', 'Teachers should adapt the setting to their own school (prefect titles, assembly routines and transport).'],
    reviewQuestions: ['Check the letter format against the BECE English syllabus and marking scheme: sender’s address and date, “Dear …”, introduction, body, conclusion, and a friendly subscription such as “Yours lovingly” or “Your loving cousin”.', 'Check the idioms (early bird catches the worm; turn over a new leaf; top of the class) with an English teacher for use in informal letters.', 'Check that the story does not shame late students and that it does not suggest that work at home is wrong.'],
    guide: {
      overview: 'A story about punctuality, fairness and listening. It shows a prefect learning to ask why, and models an exam-safe informal letter at the end.',
      lessonMinutes: 40,
      goals: ['Explain why asking for reasons matters before judging.', 'Identify friendly, exam-safe phrases in the letter.', 'Write a short informal letter using full words and correct spelling.'],
      subjects: [['English Language', 'Informal letter writing'], ['Social Studies', 'Responsibility and fairness'], ['Mathematics', 'Time and distance']],
      before: ['Ask: have you ever been late for a good reason? How did others react?'],
      during: ['At page 7, ask learners to underline the phrases that make the letter friendly.'],
      after: ['Write a letter to a cousin telling about one habit you are improving.', 'Write the same letter once in chat style and once in exam style, then compare.'],
      discussion: ['Should a late student always be punished?', 'How can prefects be fair and firm?'],
      reflection: ['What is one habit you could change with a good plan?'],
      maths: [
        { task: 'Bismark leaves home at 5:30 and walks 5 km at 5 km/h. When does he arrive?', answer: '5 ÷ 5 = 1 hour, so he arrives at 6:30.' },
        { task: 'Assembly starts at 7:15. He arrives at 6:58. How many minutes early?', answer: '17 minutes early.' },
      ],
      support: ['Give a letter frame with blanks: Dear ___, I hope… I am writing to… Your loving ___, ___.'],
      stretch: ['Write a short speech a prefect might give at assembly about fairness.'],
      localise: ['Use your own school’s routines, names and terms; adapt titles such as housemaster or senior prefect.'],
      factCheck: [
        { claim: 'Informal letters use a sender’s address and date at the top, a “Dear…” salutation, an introduction, body, conclusion, and a friendly subscription such as “Yours ever” or “Your loving friend”; contractions such as “won’t” and “can’t” are acceptable in informal letters.', explanation: 'From a Ghana curriculum learning-material lesson on informal letters.', reference: 'Ghana curriculum resources, “English Language LM Year 1 Section 15” (curriculumresources.edu.gh).' },
      ],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-tuck-shop-economist',
    title: 'The Tuck Shop Economist',
    summary: 'Philomena gets five cedis a day for break and spends it all before second period. After a fun, funny week of experiments with her friend Elvis, she learns to budget, share, save and choose healthy snacks, and writes an exam-safe letter to her aunt about her new money habits.',
    classIds: ['primary-5', 'primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 10,
    ageMax: 14,
    readingLevel: 'fluent',
    difficulty: 3,
    genres: ['realistic-fiction', 'school-life', 'humour'],
    themes: ['money-and-enterprise', 'school', 'friendship'],
    objectives: ['financial-literacy', 'reasoning', 'vocabulary', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-food', 'market', 'local-names'],
    wpm: 125,
    paceWord: 'Quick and funny, like a break-time rush',
    palette: ['#16a34a', '#f59e0b'],
    voice: 'Playful student voices; a calm, kind voice for Madam Ocran',
    characters: [
      'Philomena: a 13-year-old girl in a school uniform, with a small purse and a determined look.',
      'Elvis: her best friend, 13, with a notebook, always counting everything.',
      'Madam Ocran: the tuck shop owner, in an apron, behind a counter of snacks and fruit.',
      'The tuck shop: a small wooden stall with biscuits, groundnuts, oranges, bread and cold sachet water, crowded at break time.',
    ],
    music: 'Quick, bouncy break-time beat with coin sounds; a calm saving tune near the end (placeholder)',
    pages: [
      pg('💰', 'Every morning, Philomena’s mother gave her five cedis for school. By the end of first break, it was gone. “Where does it all go?” she asked Elvis, as they stood at the tuck shop. Elvis opened his notebook. “Let us find out,” he said. “Today we write down every pesewa. I am the accountant, and you are the customer.”', 'A girl holds an empty purse while a boy with a notebook stands beside a busy tuck shop.'),
      pg('🛒', 'Madam Ocran’s stall was a wonderland: biscuits, groundnuts, bread, oranges, ice cream, fried yam and sachet water. Philomena bought a pack of biscuits, a juice, a bag of sweets and a plate of fried yam. “That was GH¢4.50 in ten minutes,” said Elvis, writing. “And then you shared nothing and had a tummy ache.” Philomena groaned. “It was delicious, though.”', 'A girl picks up several snacks at a busy counter while a shopkeeper adds up the cost.'),
      pg('📊', 'On Friday, Elvis showed her the week. “Monday, GH¢5. Tuesday, GH¢5. Wednesday, GH¢5. You spent GH¢25 on snacks, but only GH¢8 on food that fills you up. Ten per cent of your money went on sweets alone.” Philomena stared. “That is the price of not planning,” said Elvis. “A fool and his money are soon parted.” “Rude,” said Philomena, laughing.', 'A notebook with a table of daily spending and a small pie chart.'),
      pg('🧮', 'They made a plan. Out of GH¢5, Philomena would spend GH¢2 on a proper snack, GH¢1 on water or fruit, GH¢1 to save, and GH¢1 to share or keep for emergencies. “That is the 2-1-1-1 rule,” said Elvis. “It is not magic, but it works. If you save GH¢1 a day for a school week, that is GH¢5.” Philomena wrote it on her palm in pen.', 'A girl writes numbers on her palm while a boy draws four coloured boxes on a page.'),
      pg('🍊', 'On Monday, Philomena bought groundnuts and an orange. Madam Ocran smiled. “Good choice,” she said. “Groundnuts give you energy and protein, and the orange gives you vitamin C.” By Wednesday, Philomena was bargaining for an extra orange for her friend Elvis. By Friday, she had saved GH¢5. “I feel like a tycoon,” she said. “A small one,” said Elvis. “Do not break the bank.”', 'A girl pays for groundnuts and an orange at the tuck shop, smiling.'),
      pg('🎁', 'With her saved GH¢5, Philomena did something surprising. She bought a small notebook for Lydia, a girl in her class who often had no pencil. “It is not charity,” she said. “It is a friend looking out for a friend.” Lydia was lost for words. Elvis nodded. “Saving is not only for you,” he whispered. “It is for sharing.”', 'A girl hands a small notebook to a classmate while another watches, smiling.'),
      pg('✉️', 'That evening, Philomena wrote to her Aunt Ewuraba. “Dear Aunt Ewuraba, I hope this letter finds you in good health. I am writing to tell you how I have changed the way I use my pocket money. I now plan my spending, I save a little each day, and I choose healthy snacks. Thank you for the advice you gave me at Christmas. Please say hello to everyone at home. Your loving niece, Philomena.”', 'A girl writes a letter at a desk with a small savings box beside her.'),
      pg('✅', 'Exam-safe tip: in her letter, Philomena wrote full words, used a clear opening and kept every sentence complete. She did not write “tnx” for thank you or “pls” for please. She also gave details, which examiners like. Elvis read it and grinned. “You are not just a saver,” he said. “You are a writer.” The end.', 'A boy and girl look at a letter with a tick and a gold star drawn on the corner.'),
    ],
    activities: [
      { id: 'tuck-c1', type: 'comprehension', afterPage: 3, question: 'What does Elvis find out about Philomena’s spending?', options: ['She spent most of it on snacks that did not fill her up', 'She spent it all on books', 'She lost her money'], correctIndex: 0 },
      { id: 'tuck-p1', type: 'prediction', afterPage: 4, prompt: 'The 2-1-1-1 rule splits her money into four parts. What might one part be for?', options: ['Saving', 'Throwing away', 'Hiding'] },
      { id: 'tuck-c2', type: 'comprehension', afterPage: 7, question: 'What does Philomena do with her savings?', options: ['She buys a notebook for a classmate', 'She spends it on sweets', 'She loses it'], correctIndex: 0 },
      { id: 'tuck-voc', type: 'vocabulary', afterPage: 5, word: 'break the bank', definition: 'To spend too much money.', distractors: ['To visit a bank', 'To count coins'] },
      { id: 'tuck-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Philomena spends all her money before second period.', 'Elvis records her spending for a week.', 'They make a plan: spend, save, share.', 'Philomena writes to her aunt about her new habits.'] },
      { id: 'tuck-sel', type: 'sel', afterPage: 8, prompt: 'Saving and sharing both take self-control. How do you feel when you hold back and help someone?', feelingOptions: ['Proud', 'Generous', 'Calm', 'Happy'] },
    ],
    glossary: [
      { word: 'charity', definition: 'Help given freely to people in need.', pages: [6] },
      { word: 'pesewa', definition: 'A small unit of Ghanaian money; one hundred pesewas make one cedi.', pages: [1] },
      { word: 'accountant', definition: 'A person who keeps records of money.', pages: [1] },
      { word: 'protein', definition: 'A nutrient in food that helps the body grow and repair.', pages: [5] },
      { word: 'tycoon', definition: 'A very rich and powerful business person.', pages: [5] },
    ],
    culturalNotes: ['The students and Madam Ocran are invented. Prices are examples and vary by school and region.', 'The letter on page 7 is exam-safe: full words, correct spelling, friendly phrases and no chat-style abbreviations.', 'The story encourages healthy choices without shaming any food or any child’s pocket money.'],
    reviewQuestions: ['Check that the healthy-eating claims (groundnuts for energy and protein; oranges for vitamin C) are accurate and age-appropriate.', 'Check the idioms (a fool and his money are soon parted; break the bank; lost for words; look out for) with an English teacher for use in informal letters.', 'Check that prices and the 2-1-1-1 rule are presented as examples.'],
    guide: {
      overview: 'A story about budgeting and sharing in a school setting. It teaches a simple spending plan, healthy choices and an exam-safe letter about personal change.',
      lessonMinutes: 40,
      goals: ['Make a simple daily budget.', 'Calculate savings over a week.', 'Write an informal letter about a personal habit using full words.'],
      subjects: [['Mathematics', 'Money, percentages and tables'], ['Home Economics', 'Healthy food choices'], ['English Language', 'Informal letter writing']],
      before: ['Ask: where does your pocket money go in a week?'],
      during: ['At page 3, ask learners to find the percentage spent on sweets.'],
      after: ['Keep a spending diary for one week.', 'Write a letter to a relative about how you will spend and save.'],
      discussion: ['Is it better to save, spend or share? Why might we do all three?', 'Why do we avoid writing “tnx” or “pls” in an exam letter?'],
      reflection: ['What is one small money habit you could change this week?'],
      maths: [
        { task: 'Philomena spent GH¢4.50 in ten minutes out of GH¢5. How much was left?', answer: '5.00 − 4.50 = GH¢0.50.' },
        { task: 'If she saves GH¢1 a day for a five-day school week, how much does she save in four weeks?', answer: '5 × 4 = GH¢20.' },
      ],
      support: ['Give learners a table with columns: Day / Spent / Saved / Shared.'],
      stretch: ['Plan a class tuck shop that makes a small profit and keeps healthy choices.'],
      localise: ['Use real local prices and foods; follow your school’s rules about tuck shops and food safety.'],
      factCheck: [
        { claim: 'Informal letters use full, friendly language with a clear introduction, body and conclusion; common closings include “Yours ever” and “Your loving friend”.', explanation: 'From a Ghana curriculum learning-material lesson on informal letters.', reference: 'Ghana curriculum resources, “English Language LM Year 1 Section 15”.' },
        { claim: 'Texting abbreviations such as “b4”, “dat” and “@” for “at” have been reported to lose marks in WASSCE formal letters.', explanation: 'From a Junior Graphic article reporting on examiners (2015). The same issue was raised by WAEC again in September 2026.', reference: 'Junior Graphic, “Youngsters’ abbreviated words and exam results”; MyJoyOnline, “Social media language creeping into students’ examination scripts: WAEC” (7 September 2026).' },
      ],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'colours-day-at-red-house',
    title: 'Colours Day at Red House',
    summary: 'Red House has not won the inter-house sports in six years. Captain Derrick has a plan: train together, include everyone, and play fair. A lively story of cheering, losing, winning, sportsmanship and a friendly letter that tells the story in exam-safe English.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 11,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'school-life', 'humour'],
    themes: ['school', 'friendship', 'health-and-wellbeing'],
    objectives: ['teamwork', 'perseverance', 'respect', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Energetic and cheerful, with a bright, rising excitement at the races',
    palette: ['#dc2626', '#facc15'],
    voice: 'Lively students; an encouraging, loud-but-kind voice for Coach Bartels',
    characters: [
      'Derrick: a 14-year-old boy, captain of Red House, in a red vest and a whistle round his neck.',
      'Adjoa: a 13-year-old girl, a quiet runner in a red vest, with a stopwatch.',
      'Coach Bartels: the games teacher, a tall, cheerful man in a tracksuit with a clipboard.',
      'The houses: four teams in red, blue, green and yellow, cheering on the school field with flags and drums.',
    ],
    music: 'Brass band and drums with crowd cheers; a warm, proud tune at the end (placeholder)',
    pages: [
      pg('🏟️', 'Colours Day had arrived, and the school field was a riot of colour. Red House, Blue House, Green House and Yellow House stood in four blocks, waving flags and banging drums. Derrick, the captain of Red House, looked at the scoreboard from last year. Red was last. Again. “Six years without a trophy,” he groaned. “We need more than luck.”', 'A school field with four coloured house teams waving flags, and a boy captain looking at a scoreboard.'),
      pg('📋', 'Coach Bartels handed Derrick a clipboard. “A captain’s first job is not to run fastest,” he said. “It is to find where each person fits.” Derrick thought about that. He held a meeting after school. “Everyone has a place,” he said. “Runners, jumpers, throwers, cheerleaders, timekeepers, drummers, first-aiders. Even the person who carries the water bottles matters.”', 'A captain speaks to a team gathered around him, each person holding a different item.'),
      pg('🏃', 'Adjoa raised a shy hand. “I am not fast,” she said. “But I never get tired. My legs just keep going.” Coach Bartels clapped. “You are a long-distance runner,” he said. “That is a talent, and there are points for the fifteen hundred metres.” Adjoa smiled for the first time in weeks. For two weeks, the team trained before school, shared water and cheered each other on.', 'A girl with a stopwatch smiles as a coach points to a long-distance track marking.'),
      pg('🔔', 'On the day, Red House won the relay by a whisker, lost the high jump, and came second in the tug of war. In the final race, the fifteen hundred metres, Adjoa ran steadily at the back of the pack. At the last lap, she passed one runner, then another. The crowd roared. Adjoa crossed the line in second place, and Red House shrieked with joy.', 'A girl runner in a red vest overtakes others on the final lap of a track while a crowd cheers.'),
      pg('😢', 'Then came the shock. Blue House won overall by two points. Derrick’s heart sank. Some of the Red House students booed. “Stop,” said Derrick, raising his hand. “We came in second. That is the best we have done in six years. Congratulate Blue House.” He walked over and shook the Blue captain’s hand. “Well played,” he said. “See you next year.”', 'Two team captains shake hands on a field while other students look on.'),
      pg('🤝', 'Coach Bartels pulled Derrick aside. “That was real sportsmanship,” he said. “Anyone can be gracious when they win. A true captain is gracious when they lose.” Derrick nodded. “We trained together, we cheered each other, we played fair,” he said. “That matters more than the trophy.” Then he grinned. “But I still want the trophy next year.”', 'A coach pats a captain’s shoulder at sunset on the field.'),
      pg('✉️', 'That night, Derrick wrote to his friend Prosper, who had moved to another school. “Dear Prosper, I hope you are well. You will not believe what happened on Colours Day. Red House came second overall, and our newest runner, Adjoa, finished the fifteen hundred metres in second place. We did not win the trophy, but we have never been prouder. How was your sports day? Write back soon. Your friend, Derrick.”', 'A boy writes a letter at a desk beside a small medal and a red scarf.'),
      pg('✅', 'Exam-safe tip: Derrick described the event in complete sentences with specific details such as who, what and where. He did not write “OMG”, “lol” or “we were gonna win”. Instead, he wrote “you will not believe what happened” and “we have never been prouder”. Excited feelings can be shown with strong, full words. The end.', 'A boy reads his finished letter with a tick and a gold star beside it.'),
    ],
    activities: [
      { id: 'col-c1', type: 'comprehension', afterPage: 3, question: 'What talent does Adjoa have?', options: ['She can run long distances without tiring', 'She can jump the highest', 'She can throw the furthest'], correctIndex: 0 },
      { id: 'col-p1', type: 'prediction', afterPage: 4, prompt: 'Blue House wins by two points. What will Derrick do?', options: ['Congratulate them', 'Complain to the teacher', 'Refuse to shake hands'] },
      { id: 'col-c2', type: 'comprehension', afterPage: 7, question: 'How does Derrick show excitement in his letter?', options: ['With strong, full words', 'With emojis', 'With capital letters only'], correctIndex: 0 },
      { id: 'col-voc', type: 'vocabulary', afterPage: 6, word: 'sportsmanship', definition: 'Playing fairly and being polite whether you win or lose.', distractors: ['Running the fastest', 'Cheering the loudest'] },
      { id: 'col-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Red House is last on the scoreboard.', 'Derrick finds a place for everyone on the team.', 'Adjoa finishes second in the long race.', 'Derrick shakes the winning captain’s hand.'] },
      { id: 'col-sel', type: 'sel', afterPage: 8, prompt: 'Losing with grace is hard. How do you feel when your team does not win?', feelingOptions: ['Disappointed', 'Proud', 'Determined', 'Calm'] },
    ],
    glossary: [
      { word: 'captain', definition: 'The leader of a team.', pages: [1] },
      { word: 'relay', definition: 'A race in which team members take turns to run part of the distance.', pages: [4] },
      { word: 'sportsmanship', definition: 'Playing fairly and being polite whether you win or lose.', pages: [6] },
      { word: 'gracious', definition: 'Kind and polite, especially when it is difficult.', pages: [6] },
      { word: 'scoreboard', definition: 'A board that shows the points in a game.', pages: [1] },
    ],
    culturalNotes: ['The school, houses and students are invented. Many Ghanaian schools hold inter-house sports with coloured house teams.', 'The letter on page 7 is exam-safe: full words, correct spelling, specific details and no slang or abbreviations.', 'The story includes learners of different abilities. Teachers can adapt it for learners with disabilities by giving them roles such as timekeeper or scorer.'],
    reviewQuestions: ['Check the idioms (by a whisker; heart sank; lost for words; true captain) with an English teacher for use in informal letters.', 'Check that the track events (relay, high jump, tug of war, 1,500 metres) match what schools in the region actually use.', 'Check that the story does not suggest that only winning matters.'],
    guide: {
      overview: 'A story about teamwork, sportsmanship and perseverance in an inter-house sports day. It models describing an event in an exam-safe informal letter.',
      lessonMinutes: 40,
      goals: ['Explain what sportsmanship looks like in winning and losing.', 'Describe an event in an informal letter using specific details.', 'Replace excited chat-style words with strong, full words.'],
      subjects: [['Physical Education', 'Teamwork and fair play'], ['English Language', 'Describing an event in a letter'], ['Creative Arts', 'Designing house flags']],
      before: ['Ask: what is the difference between winning a trophy and being a good team member?'],
      during: ['At page 5, ask learners to predict what Derrick should do before reading on.'],
      after: ['Write a letter to a friend about a school event you enjoyed.', 'Create a list of ten strong, full words to show excitement.'],
      discussion: ['Why is it harder to be gracious when you lose?', 'Where does every person fit in a team?'],
      reflection: ['What is one way you could encourage a teammate this week?'],
      maths: [
        { task: 'Adjoa runs the 1,500 metres on a 400-metre track. How many full laps and how many metres left over?', answer: '1,500 ÷ 400 = 3 full laps with 300 metres left over.' },
        { task: 'Blue House scores 48 points and Red House scores 46. What is the difference?', answer: '48 − 46 = 2 points.' },
      ],
      support: ['Give learners a word bank of exam-safe feeling words: delighted, thrilled, disappointed, proud, relieved.'],
      stretch: ['Write a match report for the school magazine, then rewrite it as an informal letter. Compare the tone.'],
      localise: ['Use your school’s real house names, events and traditions. Include roles for learners with different abilities.'],
      factCheck: [
        { claim: 'Chat-style abbreviations and slang such as “OMG”, “lol” and “gonna” are not acceptable in exam writing; informal letters should still use full words and correct spelling.', explanation: 'WAEC’s statement in September 2026 warned against the use of social media language in examination scripts.', reference: 'MyJoyOnline, “Social media language creeping into students’ examination scripts: WAEC” (7 September 2026).' },
      ],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-science-fair-and-the-free-rider',
    title: 'The Science Fair and the Free Rider',
    summary: 'Group project season: Abigail’s team has a plan for a water-filter model, but one member only turns up for the photos. A funny, honest story about group work, fair credit, speaking up politely, and a pen-pal letter that describes the fair in clear, exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['realistic-fiction', 'school-life', 'humour'],
    themes: ['school', 'friendship', 'technology'],
    objectives: ['teamwork', 'honesty', 'problem-solving', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Brisk and funny, steady at the polite conversation',
    palette: ['#0891b2', '#f97316'],
    voice: 'Lively students; a calm, fair voice for Madam Tetteh-Quao',
    characters: [
      'Abigail: a 14-year-old girl in glasses and a lab coat, leader of the group.',
      'Jerome: a 14-year-old boy who is clever but always busy with his phone.',
      'Sandra and Sampson: two group members, 13 and 14, sticking card and testing water.',
      'Madam Tetteh-Quao: the science teacher, in a green cardigan, with a clipboard of marking sheets.',
    ],
    music: 'Quirky, bubbly science-lab music; a calm resolution tune near the end (placeholder)',
    pages: [
      pg('🔬', 'Science Fair Week had begun. In the laboratory, benches were covered with models of volcanoes, solar panels and plant experiments. Abigail’s group was building a model water filter from sand, gravel, charcoal and cloth. She had a plan, a timetable and a checklist. What she did not have was Jerome.', 'A school laboratory with experiments on tables and a girl with a checklist looking around.'),
      pg('📱', 'Jerome turned up late on Tuesday, took a photo of the model, posted it online with “my project” and left. Sandra and Sampson stayed until six to finish the filter. “Why does he always do this?” whispered Sandra. Sampson sighed. “Because nobody tells him.” Abigail looked at the checklist. Next to “Jerome”, every box was empty.', 'Three students work on a model filter at a bench while a fourth takes a photo and leaves.'),
      pg('💬', 'Abigail could have shouted. She could have complained to the teacher. Instead, she took a deep breath and asked Jerome to stay behind. “Jerome,” she said calmly, “I want to ask you something, not blame you. What part of the project do you want to own? We need help with the poster and the explanation.” Jerome blinked. “Nobody asked me,” he said.', 'A girl speaks calmly to a boy at the end of a day in the lab, the others watching.'),
      pg('🧩', 'It turned out Jerome was good at diagrams and poster design but shy about speaking in front of people. Abigail gave him the poster. Sandra took the experiment. Sampson took the measurements. Abigail would present. “Everyone has a name on the project because everyone has a job,” she said. “That is fair.” Jerome nodded slowly. “I will not let you down,” he said.', 'Four students divide tasks on a whiteboard with names beside each job.'),
      pg('🏆', 'On the day of the fair, Madam Tetteh-Quao walked around with her clipboard. She asked Sandra how the filter worked, and Sandra explained it clearly. She asked Jerome about the poster, and he spoke up bravely. “Excellent teamwork,” she said. “I can see every one of you has contributed.” The group won second place. Jerome beamed.', 'A teacher looks at a student’s poster of a filter while the group stands proudly beside it.'),
      pg('⚖️', 'Afterwards, Abigail told the teacher honestly, “At first Jerome did not help, but we talked and he did well.” Madam Tetteh-Quao smiled. “Honesty is a good skill in science,” she said. “You can tell me when something goes wrong, and you can say how you fixed it. That is how scientists learn.” Abigail felt a warm glow of pride.', 'A teacher and a student speak quietly beside the science fair trophy table.'),
      pg('✉️', 'Abigail wrote to her pen pal, Amelia, in another country. “Dear Amelia, I hope you are well. Last week, our school held a science fair, and my group made a model water filter. At first, one of my teammates did not take part, but we talked kindly and found a job that suited him. We won second place. What did your class do this term? I look forward to hearing from you. Yours sincerely, Abigail.”', 'A girl writes a letter beside her filter model and second-place certificate.'),
      pg('✅', 'Exam-safe tip: Abigail wrote “you” and “your”, not “u” and “ur”. She wrote “because”, not “cos”, and “thank you”, not “tnx”. She also asked a question at the end, which keeps a letter friendly and two-way. Short, clear paragraphs make marking easier. The end.', 'A girl and her teacher read a letter with a tick beside the full words.'),
    ],
    activities: [
      { id: 'sci-c1', type: 'comprehension', afterPage: 3, question: 'What does Abigail ask Jerome?', options: ['Which part of the project he wants to own', 'To leave the group', 'To pay for the materials'], correctIndex: 0 },
      { id: 'sci-p1', type: 'prediction', afterPage: 4, prompt: 'Abigail gives Jerome a job that suits him. What might happen?', options: ['He contributes and the group improves', 'He leaves again', 'The group breaks up'] },
      { id: 'sci-c2', type: 'comprehension', afterPage: 7, question: 'Which words does Abigail use instead of “u” and “tnx”?', options: ['You and thank you', 'Yu and thanks a lot', 'U and thank u'], correctIndex: 0 },
      { id: 'sci-voc', type: 'vocabulary', afterPage: 5, word: 'contribute', definition: 'To give your part to a shared task.', distractors: ['To take away', 'To copy'] },
      { id: 'sci-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Jerome does not help with the filter.', 'Abigail asks him what he would like to own.', 'The group divides the jobs fairly.', 'The group wins second place.'] },
      { id: 'sci-sel', type: 'sel', afterPage: 8, prompt: 'Speaking to a teammate kindly can be hard. How do you feel when you must do it?', feelingOptions: ['Nervous', 'Brave', 'Calm', 'Hopeful'] },
    ],
    glossary: [
      { word: 'laboratory', definition: 'A room used for science experiments.', pages: [1] },
      { word: 'charcoal', definition: 'A black material made from burnt wood, used in some filters.', pages: [1] },
      { word: 'checklist', definition: 'A list of tasks to tick off.', pages: [1] },
      { word: 'contributed', definition: 'Gave a share of the work or help.', pages: [5] },
      { word: 'honesty', definition: 'Telling the truth, even when it is hard.', pages: [6] },
    ],
    culturalNotes: ['The school, students and teacher are invented. The model filter is a classroom demonstration and does not make water safe to drink.', 'The letter on page 7 is exam-safe: full words, correct spelling and a closing question that invites a reply.', 'The story shows a group problem solved by conversation rather than blame. Teachers can discuss when it is also right to involve an adult.'],
    reviewQuestions: ['Check that the model filter is described as a demonstration only and that no one is encouraged to drink filtered water.', 'Check “Yours sincerely” against the marking scheme: informal letters usually end with a friendly closing such as “Yours ever” or “Your friend”; adjust if needed.', 'Check that the story does not shame the shy student and shows a fair way to handle group conflict.'],
    guide: {
      overview: 'A story about group work, fairness and honest speech in a science fair. It also models a pen-pal letter in exam-safe English.',
      lessonMinutes: 40,
      goals: ['Describe a kind way to speak to a teammate who is not helping.', 'Divide group tasks fairly.', 'Rewrite chat-style words in full, correct English.'],
      subjects: [['Integrated Science', 'Filtration and group investigations'], ['English Language', 'Informal letters and pen pals'], ['Information and Communication Technology', 'Responsible use of phones and posting']],
      before: ['Ask: have you ever worked in a group where one person did not help? What did you do?'],
      during: ['At page 3, ask learners to suggest other kind ways to start that conversation.'],
      after: ['Write a pen-pal letter describing a group project.', 'Make a task chart for a real class project.'],
      discussion: ['When should a teammate talk to a friend, and when should they talk to the teacher?', 'Why is credit for others’ work important?'],
      reflection: ['What job in a group suits you best, and why?'],
      maths: [
        { task: 'The group scored 18 marks for the model and 22 for the poster and presentation. The total is out of 50. What fraction is lost?', answer: '18 + 22 = 40, so 10 out of 50 or one fifth is lost.' },
        { task: 'The group worked 3 hours a day for 4 days. How many hours?', answer: '3 × 4 = 12 hours.' },
      ],
      support: ['Provide a letter frame with sentence starters and a list of exam-safe linking words: first, then, however, finally.'],
      stretch: ['Build the filter at school with an adult, test with muddy water and write a short lab report. Do not drink the water.'],
      localise: ['Use real science fair formats in your school and local water examples.', 'Never let learners drink water from a model.'],
      factCheck: [
        { claim: 'Text abbreviations such as “u” for “you”, “ur” for “your” and “tnx” for “thanks” are examples of the social media language WAEC has warned students not to use in exam scripts.', explanation: 'From WAEC’s statement in September 2026 and earlier reports of examiners’ concerns.', reference: 'MyJoyOnline, “Social media language creeping into students’ examination scripts: WAEC” (7 September 2026); Junior Graphic, “Youngsters’ abbreviated words and exam results” (2015).' },
      ],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'mock-week-survival-guide',
    title: 'Mock Week Survival Guide',
    summary: 'Mock exams start Monday, and Vivian has not opened her notes. With her study group, a timetable, a sleep rule and a plan for the night before, she learns that revision is a skill, not a panic. A funny, practical story with an exam-safe letter to a younger cousin about how to prepare.',
    classIds: ['jhs-2', 'jhs-3'],
    ageMin: 13,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'school-life', 'humour'],
    themes: ['school', 'friendship', 'health-and-wellbeing'],
    objectives: ['perseverance', 'problem-solving', 'responsibility', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Quick and funny at the panic, calm and steady at the plan',
    palette: ['#7c3aed', '#fbbf24'],
    voice: 'Lively students; a calm, practical voice for Mr Ampadu',
    characters: [
      'Vivian: a 15-year-old girl in a JHS 3 uniform, with a pile of untouched notes and a worried face.',
      'Reuben and Mercy: her study-group friends, 15, with flash cards and a flask of water.',
      'Mr Ampadu: the form master, in a grey shirt, writing a timetable on the board.',
      'The classroom: a JHS 3 room with a revision timetable and a countdown calendar on the wall.',
    ],
    music: 'Ticking clock and quick strings at the panic; a calm, steady tune at the plan (placeholder)',
    pages: [
      pg('⏰', 'The countdown on the classroom wall said six days to the mock exams. Vivian stared at it. Her notes were in a pile, her textbooks were still wrapped in her bag, and her plan was, well, to panic. “I will start tomorrow,” she told herself, for the fifth night in a row. Her friend Reuben raised an eyebrow. “Tomorrow is a very busy day,” he said. “It has not arrived yet.”', 'A girl stares at a wall calendar with a countdown while a pile of untouched notes sits on her desk.'),
      pg('📅', 'Mr Ampadu wrote a timetable on the board. “Revision is a skill, and skills can be learned,” he said. “First, list the subjects. Second, decide which are your weakest. Third, give each one a time slot. Fourth, take breaks.” He turned and smiled. “And please do not study all night. The brain needs sleep to remember what it has learned.”', 'A teacher writes a revision timetable on a board while students copy it down.'),
      pg('👥', 'Vivian, Reuben and Mercy formed a study group. They met after school for forty minutes each day. Reuben made flash cards for Integrated Science. Mercy drew mind maps for Social Studies. Vivian practised past questions in English. “We test each other,” said Mercy. “If you can explain it to a friend, you really understand it.”', 'Three students study together with flash cards, a mind map and a past question paper.'),
      pg('📱', 'On Wednesday, Vivian’s phone buzzed for the tenth time. A group chat was arguing about football. She switched it off and put it in her bag. “Phone away, notes out,” she told herself. Mercy nodded. “Our brains are like a muscle,” she said. “If we split our attention in ten pieces, none of them gets stronger.”', 'A girl switches off her phone and puts it in her bag beside an open notebook.'),
      pg('🛌', 'On Sunday night, the night before the mock, Vivian did not cram. She read her summary notes for an hour, packed her bag with pens, a ruler, a calculator and her examination number, and went to bed at nine. “Sleep is part of revision,” she said sleepily. “Mr Ampadu said so.”', 'A girl packs a school bag by lamplight with pens and a ruler before bed.'),
      pg('📝', 'On Monday, the English paper began. Vivian read each question twice, planned her essay in the margin, watched the clock and left five minutes at the end to check her spelling. When the bell rang, she put down her pen with a calm heart. “I did not know everything,” she told Reuben. “But I know I gave it my best.”', 'A girl sits at an exam desk, writing carefully with a clock on the wall.'),
      pg('✉️', 'That weekend, Vivian wrote to her young cousin Akos, who would take his own exams next year. “Dear Akos, I hope you are keeping well. I am writing to share some advice on preparing for exams. First, make a timetable and follow it. Second, study with friends who encourage you. Third, switch off your phone while you study. Finally, sleep well the night before. Good luck, and write soon. Your cousin, Vivian.”', 'A girl writes a letter to a younger cousin with a timetable pinned above her desk.'),
      pg('✅', 'Exam-safe tip: Vivian’s letter gave clear advice using linking words such as first, second and finally, which help a marker follow the order of ideas. She wrote “Good luck” and not “GL” or “gud luk”. Her advice came with reasons, because a letter is stronger when it explains why. The end.', 'A girl and her cousin read a letter with numbered advice and a tick beside it.'),
    ],
    activities: [
      { id: 'mock-c1', type: 'comprehension', afterPage: 3, question: 'Why does Mr Ampadu say students should not study all night?', options: ['The brain needs sleep to remember what it has learned', 'Teachers dislike late nights', 'Lights are expensive'], correctIndex: 0 },
      { id: 'mock-p1', type: 'prediction', afterPage: 4, prompt: 'Vivian switches off her phone while studying. What might happen?', options: ['She focuses better', 'She forgets everything', 'She fails'] },
      { id: 'mock-c2', type: 'comprehension', afterPage: 7, question: 'Which linking words does Vivian use to order her advice?', options: ['First, second, finally', 'Lol, btw, omg', 'Yes, no, maybe'], correctIndex: 0 },
      { id: 'mock-voc', type: 'vocabulary', afterPage: 5, word: 'cram', definition: 'To try to learn a lot of information in a very short time.', distractors: ['To sleep early', 'To pack a bag'] },
      { id: 'mock-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Vivian sees the countdown and panics.', 'Mr Ampadu teaches a timetable.', 'The study group meets after school.', 'Vivian sits the paper with a calm heart.'] },
      { id: 'mock-sel', type: 'sel', afterPage: 8, prompt: 'Exams can make us nervous. How do you feel when a test is coming?', feelingOptions: ['Nervous', 'Ready', 'Determined', 'Calm'] },
    ],
    glossary: [
      { word: 'revision', definition: 'Going over what you have learned to prepare for a test.', pages: [2] },
      { word: 'timetable', definition: 'A plan that shows what to do at what time.', pages: [2] },
      { word: 'cram', definition: 'To try to learn a lot in a very short time.', pages: [5] },
      { word: 'summary', definition: 'A short version of the main points.', pages: [5] },
      { word: 'mock', definition: 'A practice version of a real exam.', pages: [1, 5] },
    ],
    culturalNotes: ['The students, teacher and school are invented. Mock exams are a common practice before the BECE in Ghanaian schools.', 'The study methods (timetables, flash cards, mind maps, past questions, sleep) are widely recommended; teachers should adapt them to local needs.', 'The letter on page 7 is exam-safe: full words, correct spelling and linking words that organise ideas.'],
    reviewQuestions: ['Check the claim that sleep helps memory against a reliable education or health source before use in class.', 'Check that the study advice (forty-minute sessions, phone away) is presented as suggestions, not rules.', 'Check the letter format against the BECE marking scheme.'],
    guide: {
      overview: 'A story about preparing for mock exams with a plan, a study group, healthy habits and calm. It models an advice letter in exam-safe English.',
      lessonMinutes: 40,
      goals: ['Build a revision timetable.', 'Describe three useful study methods.', 'Write an advice letter using linking words.'],
      subjects: [['English Language', 'Informal letters of advice'], ['Guidance and Counselling', 'Study skills and well-being'], ['Mathematics', 'Planning time']],
      before: ['Ask: what is your biggest challenge when preparing for an exam?'],
      during: ['At page 2, ask learners to start their own timetable.'],
      after: ['Write a letter to a younger cousin with four pieces of study advice.', 'Create a personal revision timetable for one week.'],
      discussion: ['Why does studying with friends help?', 'What are the risks of cramming?'],
      reflection: ['Which study habit will you start this week?'],
      maths: [
        { task: 'A learner studies 40 minutes a day for 6 days. How many hours and minutes?', answer: '40 × 6 = 240 minutes = 4 hours.' },
        { task: 'An exam is 90 minutes long and has 6 questions. About how many minutes per question if 15 minutes are kept for checking?', answer: '(90 − 15) ÷ 6 = 12.5 minutes.' },
      ],
      support: ['Provide a timetable template with days, subjects and break times.'],
      stretch: ['Make a poster “Mock Week Survival Guide” with five tips and reasons.'],
      localise: ['Match the subjects and exam dates to your school’s calendar. Include learners with no home study space by offering school study time.'],
      factCheck: [
        { claim: 'Informal-letter sections: address and date, salutation, introduction, body, conclusion and a friendly close.', explanation: 'From a Ghana curriculum learning-material lesson.', reference: 'Ghana curriculum resources, “English Language LM Year 1 Section 15” (curriculumresources.edu.gh).' },
      ],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'typing-like-you-talk',
    title: 'Typing Like You Talk',
    summary: 'Ebenezer chats in slang all day and loses marks on his mock letter, because exam English is a different voice. With his teacher he learns about chat voice and exam voice, plays a swapping game, and writes an informal letter that is warm, funny and fully exam-safe.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'school-life', 'humour', 'educational'],
    themes: ['school', 'technology', 'identity'],
    objectives: ['vocabulary', 'critical-thinking', 'author-purpose', 'figurative-language'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Playful and clear, slower at the lists of words',
    palette: ['#2563eb', '#f43f5e'],
    voice: 'Playful teen voices; a warm, amused voice for Mr Quarcoo',
    characters: [
      'Ebenezer: a 14-year-old boy in a school uniform, thumbs on a phone, grinning.',
      'Mr Quarcoo: the English teacher, in a bow tie and glasses, holding a marked paper.',
      'Priscilla: Ebenezer’s classmate, 14, with a notebook, who loves words.',
      'The notice board: a class board with two headings, “Chat Voice” and “Exam Voice”, with word cards pinned under each.',
    ],
    music: 'Quick tapping rhythm of a keyboard; a warm, clear tune when the voices are sorted (placeholder)',
    pages: [
      pg('📱', 'Ebenezer could type faster than he could think. All day, his thumbs flew across the keys: short words, funny spellings, hundreds of messages. He felt like a champion at it. Then, on Monday, Mr Quarcoo handed back the mock English paper. Ebenezer’s informal letter had a big red circle at the top. “What is this?” he asked. “Read it,” said Mr Quarcoo, kindly.', 'A boy holds a marked exam paper with a red circle at the top while a teacher stands beside him.'),
      pg('😳', 'Ebenezer read his own letter. It was full of short, chatty spellings and little pictures. He had written the word “you” as one letter. He had written “before” with a number. He had written “going to” as “gonna”. He had even ended with a row of laughing faces. His cheeks grew warm. “It sounded fine in my head,” he said. “It sounds fine in a chat,” said Mr Quarcoo. “It does not sound fine in an exam.”', 'A boy reads his marked letter in dismay as a classmate peeks at it.'),
      pg('🎭', 'Mr Quarcoo pinned two headings on the board: Chat Voice and Exam Voice. “You already have both,” he said. “You speak differently to your friends than to your grandmother, and you dress differently for a party than for church. Language works the same way. Chat voice is for friends and phones. Exam voice is for markers, who cannot see your face or hear your tone. They only have your words.”', 'A teacher pins two headings on a notice board while students watch.'),
      pg('🔤', 'Priscilla wrote a list on the board. Chat only: “u”, “ur”, “b4”, “pls”, “tnx”, “gonna”, “wanna”, “lol”, “omg”, and the pictures. Exam safe: “you”, “your”, “before”, “please”, “thank you”, “going to”, “want to”, and strong full words such as “amused” and “astonished”. “If you are not sure,” said Priscilla, “use the longer, fuller form. It is always safe.”', 'A girl writes two columns of words on a board, one headed chat only and one headed exam safe.'),
      pg('🗣️', 'Ebenezer raised his hand. “What about the way we speak at home, sir? The mixed language, the pidgin?” Mr Quarcoo smiled. “That is a real and rich way of speaking, and it belongs to you. But in an English exam, write standard English. Think of it as a different outfit for a different occasion.” Ebenezer grinned. “Code-switching,” he said. “Exactly,” said Mr Quarcoo.', 'A boy and a teacher talk about different ways of speaking beside a poster with speech bubbles.'),
      pg('🎲', 'The class turned it into a game called Translate. One student read a chatty sentence, and the others had to rewrite it in exam voice. “See u b4 the party, lol” became “I will see you before the party, and I look forward to it.” By the end of the lesson, the whole class was laughing and, without noticing, had learned thirty new full words.', 'Students laugh as they rewrite short chat sentences on cards in a classroom game.'),
      pg('✉️', 'That evening, Ebenezer rewrote his letter. “Dear Teiko, I hope you are well. I am writing to invite you to my birthday party on Saturday at four o’clock. We will play football, eat jollof rice and listen to music. I would be delighted if you could come. Please reply as soon as you can. Your friend, Ebenezer.” Mr Quarcoo read it and nodded. “Warm, clear and complete,” he said. “Full marks for voice.”', 'A boy writes a neat letter at a desk with a phone switched off beside him.'),
      pg('✅', 'Exam-safe tip: standard contractions such as “won’t” and “can’t” appear in some school letters, but full forms such as “will not” and “cannot” are the safest choice if you are unsure. Keep chat spelling, number-and-letter words, the at-sign, laughing faces and pidgin for your friends. Ebenezer still types fast, but now he has two voices. The end.', 'A boy holds two speech bubbles, one for friends and one for exams.'),
    ],
    activities: [
      { id: 'typ-c1', type: 'comprehension', afterPage: 3, question: 'Why must exam English use a different voice from chat?', options: ['Markers cannot see your face or hear your tone, so they rely on words', 'Markers dislike friends', 'Phones are banned'], correctIndex: 0 },
      { id: 'typ-p1', type: 'prediction', afterPage: 5, prompt: 'The class plays Translate. What might they do?', options: ['Rewrite chat sentences in full exam English', 'Delete all their messages', 'Stop using phones'] },
      { id: 'typ-c2', type: 'comprehension', afterPage: 7, question: 'Which is the safest choice if you are unsure about a contraction?', options: ['Use the full form such as “will not”', 'Use a text abbreviation', 'Leave a gap'], correctIndex: 0 },
      { id: 'typ-voc', type: 'vocabulary', afterPage: 5, word: 'code-switching', definition: 'Changing the way you speak or write to suit the situation.', distractors: ['Sending secret messages', 'Typing very fast'] },
      { id: 'typ-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Ebenezer’s letter is marked down.', 'Mr Quarcoo explains chat voice and exam voice.', 'The class plays Translate.', 'Ebenezer writes a new letter in exam voice.'] },
      { id: 'typ-sel', type: 'sel', afterPage: 8, prompt: 'Getting a mark wrong can sting. How do you feel when you learn from a mistake?', feelingOptions: ['Embarrassed', 'Curious', 'Determined', 'Proud'] },
    ],
    glossary: [
      { word: 'standard', definition: 'The accepted, correct form of a language used in school and exams.', pages: [5, 8] },
      { word: 'markers', definition: 'The examiners who read and give marks to exam scripts.', pages: [3] },
      { word: 'tone', definition: 'The feeling in the way something is said or written.', pages: [3] },
      { word: 'informal', definition: 'Friendly and relaxed, not formal.', pages: [1] },
      { word: 'astonished', definition: 'Very surprised.', pages: [4] },
    ],
    culturalNotes: ['The students, teacher and school are invented. Ghanaian students use many languages and ways of speaking, including pidgin and mixed language, and these are valuable; the story only teaches choosing the right style for the exam.', 'Chat-style words appear only as labelled “chat only” mistakes with their exam-safe forms beside them. They should not be copied into exam answers.', 'The letter on page 7 is exam-safe: full words, correct spelling and standard punctuation.'],
    reviewQuestions: ['Check the claim about contractions against the current BECE English marking scheme and WAEC guidance: one source says standard contractions are acceptable in informal letters, while WAEC criticised contracted and WhatsApp/SMS-style expressions; the story recommends full forms as safest.', 'Check that the chat-only list is accurate and that the labels clearly mark them as mistakes in exams.', 'Check that the treatment of pidgin and home languages is respectful and not presented as “wrong”.'],
    guide: {
      overview: 'A story about the difference between chat voice and exam voice. It teaches students to recognise chat-style spellings as exam mistakes and gives a safe way to write informal letters.',
      lessonMinutes: 45,
      goals: ['Name five chat-only forms and their exam-safe versions.', 'Explain why exam writing needs standard English.', 'Write an informal letter in warm, exam-safe English.'],
      subjects: [['English Language', 'Register, tone and informal letters'], ['Information and Communication Technology', 'Responsible digital communication'], ['Ghanaian Language', 'Comparing registers across languages']],
      before: ['Ask: how do you write to a friend, and how do you write to a head teacher?'],
      during: ['At page 4, ask learners to add three more chat-only forms and their full forms.'],
      after: ['Play Translate with ten chat sentences and ask for exam versions.', 'Write an invitation letter to a friend in exam voice.'],
      discussion: ['Is chat language “wrong”? When is it right?', 'What other voices do you use, for example at home, in church or mosque, or in the market?'],
      reflection: ['What is one chat habit you will leave at the door when you enter the exam room?'],
      maths: [
        { task: 'A letter has 120 words and 15 of them are chat spellings. What percentage are chat spellings?', answer: '15 ÷ 120 × 100 = 12.5 per cent.' },
        { task: 'A learner fixes 3 chat words per minute. How many in 10 minutes?', answer: '3 × 10 = 30 words.' },
      ],
      support: ['Give learners a two-column card: Chat only | Exam safe, with six pairs to match.'],
      stretch: ['Write a short dialogue that shows the same news in chat voice and exam voice, then explain the differences.'],
      localise: ['Use the chat forms your learners really use. Do not shame home languages or pidgin; discuss them as a rich part of identity.'],
      factCheck: [
        { claim: 'WAEC warned in September 2026 that students were using social media language in examination scripts, and examiners’ reports have for years criticised abbreviations, numeral-letter spellings and SMS-style writing.', explanation: 'News report of the WAEC statement and a Junior Graphic article reporting on examiners.', reference: 'MyJoyOnline, “Social media language creeping into students’ examination scripts: WAEC” (7 September 2026); Junior Graphic, “Youngsters’ abbreviated words and exam results” (2015).' },
        { claim: 'Contractions such as “won’t” and “can’t” are acceptable in informal letters in some school materials, while full forms are the safest for exams.', explanation: 'From a Ghana curriculum learning-material lesson on informal letters; the safer advice reflects WAEC’s criticism of contracted, text-style expressions.', reference: 'Ghana curriculum resources, “English Language LM Year 1 Section 15”; WAEC chief examiners’ reports.' },
      ],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-new-girl-and-the-joke-that-stung',
    title: 'The New Girl and the Joke That Stung',
    summary: 'Rabiatu joins a new school mid-term and some classmates laugh at her accent and her lunch. Beatrice has to decide whether to laugh along, stay silent or speak up. A story about teasing, bullying, being a bystander, telling a trusted adult, and a letter home that says how you feel in clear, exam-safe words.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'school-life', 'moral'],
    themes: ['school', 'friendship', 'new-beginnings', 'fear-and-courage'],
    objectives: ['kindness', 'respect', 'emotional-intelligence', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'local-food'],
    wpm: 120,
    paceWord: 'Gentle and honest, slower where the joke lands',
    palette: ['#be185d', '#0ea5e9'],
    voice: 'Soft, thoughtful teen voices; a warm, steady voice for Madam Odoom the counsellor',
    characters: [
      'Rabiatu: a 13-year-old girl in a new school uniform, with a lunch tin and a nervous smile.',
      'Beatrice: a 13-year-old girl, quiet, with a notebook, sitting at the next desk.',
      'Delight: a 14-year-old boy, loud, surrounded by laughing classmates.',
      'Madam Odoom: the school counsellor, in a bright dress, with a small office with a plant and two chairs.',
    ],
    music: 'Soft, uncertain piano that warms into a hopeful guitar (placeholder)',
    pages: [
      pg('🏫', 'Rabiatu joined the class in the middle of the term. Her family had moved for her father’s work, and everything felt strange: the corridors, the uniform and the voices. At break, she opened her lunch tin and ate the rice and stew her mother had packed. “What is that smell?” called Delight, loudly. Several classmates laughed.', 'A new girl opens a lunch tin at a bench while a group of students laughs at the next table.'),
      pg('🗣️', 'When the teacher asked Rabiatu to read aloud, she read carefully, with the accent of her home town. Delight copied her voice and the class giggled. “Say it again,” he teased. Rabiatu’s face burned. She sat down and stared at her desk. Beatrice, at the next desk, felt her stomach twist. She did not laugh. But she did not say anything, either.', 'A girl reads aloud in class while a boy mimics her and others laugh; a classmate looks uncomfortable.'),
      pg('🧠', 'That night, Beatrice could not sleep. “It was only a joke,” she told herself. But she remembered Rabiatu’s face. She remembered the time she had been teased about her glasses and how it had made her feel small. “A joke is only funny when everyone is laughing,” she thought. “If one person is hurting, it is not a joke.”', 'A girl lies awake at night thinking, with glasses on a bedside table.'),
      pg('💪', 'The next morning, Beatrice sat beside Rabiatu at break. “Your stew smells wonderful,” she said. “My grandmother makes something like it.” Rabiatu looked up, surprised. Delight began to sneer, but Beatrice looked at him calmly. “That is not funny,” she said. “Please stop.” A few students shifted uncomfortably. Delight shrugged and walked away.', 'Two girls sit together at a bench sharing lunch while a boy walks away.'),
      pg('👩🏫', 'But the teasing did not stop at once. Beatrice and Rabiatu went together to Madam Odoom, the school counsellor. “Thank you for telling me,” said Madam Odoom. “Telling a trusted adult is not telling tales. It is how we keep each other safe.” She spoke to Delight privately and with the class teacher. She did not shame him in front of others. She asked him, “How would you feel?”', 'A counsellor listens kindly to two girls in a small office with a plant.'),
      pg('🌱', 'A few days later, Delight came to Rabiatu at break. His voice was low. “I am sorry,” he said. “I thought I was being funny, but I was being unkind.” Rabiatu was quiet. Then she said, “Thank you for saying so.” It was not a magic fix, and some hurt remained. But slowly, the class began to ask Rabiatu about her town, her food and her language. They found they liked the answers.', 'A boy apologises to a girl at a bench while classmates look on kindly.'),
      pg('✉️', 'Rabiatu wrote to her grandmother. “Dear Grandma, I hope you are well. I miss you very much. My first weeks at the new school were difficult because some students laughed at my accent. But a girl named Beatrice stood up for me, and I now have a new friend. Please do not worry. I am happy and learning a lot. Give my greetings to everyone. Your loving granddaughter, Rabiatu.”', 'A girl writes a letter to her grandmother with a photo of her old home town beside her.'),
      pg('✅', 'Exam-safe tip: Rabiatu shared a sad feeling in full, calm words such as “difficult” and “I miss you very much”. She did not use chat-style forms such as “idk” or “smh”, and she did not use capital letters for shouting. Feelings in a letter can be strong and honest without chat shortcuts. The end.', 'A girl and her friend read a letter with a heart and a tick drawn beside it.'),
    ],
    activities: [
      { id: 'new-c1', type: 'comprehension', afterPage: 3, question: 'Why did Beatrice feel uneasy about the joke?', options: ['She remembered how teasing had hurt her', 'She disliked Rabiatu', 'She wanted to laugh louder'], correctIndex: 0 },
      { id: 'new-p1', type: 'prediction', afterPage: 4, prompt: 'Beatrice speaks up calmly. What might Delight do?', options: ['Walk away and think about it', 'Hit her', 'Tell the teacher she is rude'] },
      { id: 'new-c2', type: 'comprehension', afterPage: 7, question: 'Why does Madam Odoom say that telling a trusted adult is not telling tales?', options: ['It keeps people safe', 'It gets someone punished', 'It makes teachers happy'], correctIndex: 0 },
      { id: 'new-voc', type: 'vocabulary', afterPage: 5, word: 'bystander', definition: 'A person who sees something unkind happen and chooses whether to act.', distractors: ['A person who runs away', 'A person who writes about it'] },
      { id: 'new-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Classmates laugh at Rabiatu’s lunch and accent.', 'Beatrice sits with Rabiatu and asks Delight to stop.', 'They tell the counsellor.', 'Delight apologises and the class learns about Rabiatu.'] },
      { id: 'new-sel', type: 'sel', afterPage: 8, prompt: 'Speaking up is hard. How do you feel when you see someone being teased?', feelingOptions: ['Uncomfortable', 'Brave', 'Worried', 'Determined'] },
    ],
    glossary: [
      { word: 'accent', definition: 'The way people from a place or group pronounce words.', pages: [2] },
      { word: 'teasing', definition: 'Making fun of someone in an unkind way.', pages: [5] },
      { word: 'counsellor', definition: 'A person trained to listen and help with problems.', pages: [5] },
      { word: 'unkind', definition: 'Not kind; hurtful.', pages: [6] },
      { word: 'sneer', definition: 'To show contempt with a smile or a voice.', pages: [4] },
    ],
    culturalNotes: ['The students, teachers and school are invented. The story does not name any region, language or ethnic group as better or worse, and the “accent” is not described in detail.', 'Rabiatu’s name is used in many communities across Ghana and beyond; no community is implied.', 'The story teaches a path: say something, tell a trusted adult, make amends. Teachers should say clearly that serious or repeated bullying, or any threat, must be reported to school leaders and parents.'],
    reviewQuestions: ['Have a school counsellor review the story, the language about teasing and bullying, and the reporting advice before classroom use.', 'Check that the story does not make the target responsible for ending the bullying and that it does not encourage children to confront dangerous bullies alone.', 'Check that the apology and forgiveness are not presented as always easy or required.'],
    guide: {
      overview: 'A story about teasing, bystanders and telling trusted adults. It helps students name feelings and respond kindly, and it models an exam-safe letter that shares feelings in full words.',
      lessonMinutes: 45,
      goals: ['Explain the difference between a joke and bullying.', 'Name three things a bystander can do safely.', 'Write about a feeling in an informal letter using full, calm words.'],
      subjects: [['Guidance and Counselling', 'Bullying, empathy and reporting'], ['English Language', 'Expressing feelings in a letter'], ['Religious and Moral Education', 'Kindness and respect']],
      before: ['Ask: what is the difference between a joke and an insult? Who decides?'],
      during: ['At page 3, pause and ask learners what Beatrice could do next.'],
      after: ['Write a letter from Rabiatu to a friend about her first week.', 'Make a poster: “Three safe things a bystander can do”.'],
      discussion: ['Why might someone laugh along even when they feel uneasy?', 'When is telling an adult the right thing to do?'],
      reflection: ['Has there been a time you wish you had spoken up? What could you do next time?'],
      support: ['Offer role-play cards with calm sentences to use: “That is not funny.” “Please stop.” “Come and sit with us.”'],
      stretch: ['Write a short script of the conversation between Delight and Madam Odoom, showing how a counsellor can ask questions without shaming.'],
      localise: ['Use your school’s real reporting steps and names of counsellors or trusted adults. Provide help lines or school contacts where they exist.', 'Handle with care if any learner in the class has been targeted.'],
      factCheck: [
        { claim: 'Telling a trusted adult about bullying is a safe and recommended step, and schools should have clear ways for learners to report it.', explanation: 'A general child-protection principle used by schools; the school’s own policy should be shown to learners.', reference: 'Review with the school counsellor and the school’s child-protection policy before use; add a named source.' },
      ],
    },
  }),

  // 8 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'dear-cousin-guess-what',
    title: 'Dear Cousin, Guess What!',
    summary: 'The Letter Club meets on Thursdays. Led by Madam Frimpomaa, members take apart a friendly letter piece by piece: address, date, greeting, opening, body, closing, sign-off. A fun, practical masterclass with a full sample letter, a marking checklist and a list of exam-safe phrases for the BECE.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['educational', 'school-life', 'humour'],
    themes: ['school', 'friendship', 'family'],
    objectives: ['author-purpose', 'vocabulary', 'reading-comprehension', 'critical-thinking'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Bright and clear, slower at the parts of the letter',
    palette: ['#059669', '#f59e0b'],
    voice: 'Cheerful, clear teacher voice for Madam Frimpomaa; lively student voices',
    characters: [
      'Madam Frimpomaa: the English teacher, in a yellow dress, with a stack of letters and a red pen.',
      'Kwasi Cobbinah and Hannah: two Letter Club members, 14, with notebooks and pens.',
      'Cousin Doreen: a girl of 14 in Cape Coast, far away, seen only in a photograph held by Kwasi.',
      'The Letter Club room: a corner classroom with a chart of a letter with its parts labelled in coloured boxes.',
    ],
    music: 'Light, cheerful marimba with a postal-bell chime; a satisfying finish (placeholder)',
    pages: [
      pg('📮', 'Every Thursday, the Letter Club met in the corner classroom. On the wall hung a big chart of a friendly letter, with each part in a different coloured box. “A letter,” said Madam Frimpomaa, “is a conversation on paper. Today we are going to build one together, part by part.” Kwasi Cobbinah picked up his pen. He was writing to his cousin Doreen in Cape Coast.', 'A teacher stands beside a chart of a letter with coloured boxes while students hold pens.'),
      pg('🏠', 'Part one: the address and date. “Top right-hand corner,” said Madam Frimpomaa. “Write your own address, not your friend’s. Under it, write the date.” Kwasi wrote: House 12, Palm Street, Koforidua. Beneath it: 14th May, 2027. “Notice there are no chat-style numbers or short forms,” said Hannah. “Full month, full year.”', 'A student writes an address and date in the top right-hand corner of a page.'),
      pg('👋', 'Part two: the greeting. “Dear Doreen,” wrote Kwasi. “A comma after the name,” said Madam Frimpomaa. “And a capital letter for every name.” Part three: the opening. “Begin warmly. Ask after health or say why you are writing.” Kwasi wrote: “I hope this letter finds you and everyone at home in good health. I am writing to tell you about our school Letter Club.”', 'A student writes a greeting and the first lines of a letter, with a teacher pointing to the comma.'),
      pg('📚', 'Part four: the body. “This is the heart,” said Madam Frimpomaa. “One paragraph for each main idea. Give details: who, what, where, when, how. Use linking words such as firstly, however, because and finally. And remember, you are talking to a cousin, so you may be warm and friendly, but you are still writing in full words and correct spelling.”', 'A teacher points to the body of the letter chart, with paragraph boxes and linking words listed beside it.'),
      pg('😂', 'Kwasi wrote about the Letter Club, about the day Hannah put a full stop in the middle of a sentence and about Madam Frimpomaa’s red pen. “You may be funny in a letter,” said Madam Frimpomaa, “but be funny in words, not in abbreviations. ‘I laughed until my sides ached’ is much better than ‘lol’. It paints a picture the marker can see.”', 'Students laugh in a classroom while a teacher waves a red pen playfully.'),
      pg('👋', 'Part five: the closing paragraph. “Wrap up and look ahead,” said Madam Frimpomaa. Kwasi wrote: “I must stop here because it is time for supper. Please write back and tell me about your new school.” Part six: the sign-off. “Yours ever, Kwasi.” “Or ‘Your loving cousin’, ‘Your friend’, ‘Yours lovingly’,” said Hannah. “For a friend or relative, any warm closing is fine.”', 'A student writes the closing lines and sign-off at the bottom of a page.'),
      pg('✅', 'Madam Frimpomaa gave the class a checklist. Did I write my address and the date? Did I use “Dear” and a comma? Did I open warmly? Did I write in paragraphs with details? Did I use full words and correct spelling? Did I close warmly and sign off? “Check your letter against this list,” she said, “and you will not lose silly marks.”', 'A checklist with six tick boxes pinned on a board beside the letter chart.'),
      pg('🎉', 'Kwasi posted his letter, and two weeks later Doreen wrote back. “Dear Kwasi, what a wonderful letter! You wrote so clearly that I could picture the Letter Club.” Kwasi grinned. “A good letter,” he told Hannah, “is a hug on paper. And a good exam letter,” said Hannah, “is a hug with a checklist.” The end.', 'A boy holds a letter from his cousin beside a postbox, smiling.'),
    ],
    activities: [
      { id: 'dear-c1', type: 'comprehension', afterPage: 3, question: 'Where does the sender write their own address in a friendly letter?', options: ['In the top right-hand corner', 'At the bottom', 'In the middle'], correctIndex: 0 },
      { id: 'dear-p1', type: 'prediction', afterPage: 5, prompt: 'Madam Frimpomaa says a funny letter should use words, not abbreviations. What might Kwasi write instead of “lol”?', options: ['I laughed until my sides ached', 'Haha', 'LOL!!!'] },
      { id: 'dear-c2', type: 'comprehension', afterPage: 7, question: 'What does the checklist help a student avoid?', options: ['Losing silly marks', 'Writing the address', 'Writing too many paragraphs'], correctIndex: 0 },
      { id: 'dear-voc', type: 'vocabulary', afterPage: 4, word: 'salutation', definition: 'The greeting at the start of a letter, such as “Dear Doreen,”.', distractors: ['The last line of a letter', 'The address on an envelope'] },
      { id: 'dear-s1', type: 'sequencing', prompt: 'Put the letter parts in order.', items: ['Address and date', 'Greeting', 'Opening paragraph', 'Body, closing and sign-off'] },
      { id: 'dear-sel', type: 'sel', afterPage: 8, prompt: 'A letter can make someone feel close. Who would you like to write to?', feelingOptions: ['Excited', 'Thoughtful', 'Warm', 'Curious'] },
    ],
    glossary: [
      { word: 'address', definition: 'The details of where a person lives.', pages: [2] },
      { word: 'greeting', definition: 'The opening words that say hello to the reader.', pages: [3] },
      { word: 'paragraph', definition: 'A block of sentences about one main idea.', pages: [4] },
      { word: 'abbreviations', definition: 'Shortened forms of words.', pages: [5] },
      { word: 'checklist', definition: 'A list of things to check or tick off.', pages: [7] },
    ],
    culturalNotes: ['The students, teacher and school are invented. The addresses are made up.', 'The story gives one widely taught pattern for an informal letter; teachers should check it against the current BECE syllabus and marking scheme and adapt it.', 'Closings such as “Yours ever”, “Your loving cousin” and “Your friend” are examples of warm, informal sign-offs.'],
    reviewQuestions: ['Check every part of the letter format, including address position, date style, punctuation after the greeting and the sign-off, against the current BECE English marking scheme and the NaCCA English syllabus.', 'Check that the advice about contractions, abbreviations and chat words matches current WAEC guidance.', 'Check that the sample letter is warm, correct and suitable as a model.'],
    guide: {
      overview: 'A masterclass story that walks through the parts of an informal letter and shows exam-safe habits. It ends with a checklist learners can use for marking each other’s letters.',
      lessonMinutes: 45,
      goals: ['Name and order the parts of an informal letter.', 'Write a letter with details, linking words and a warm close.', 'Use a checklist to mark a letter fairly.'],
      subjects: [['English Language', 'Informal letters'], ['Social Studies', 'Communication and family ties'], ['Creative Arts', 'Designing a letter frame']],
      before: ['Ask: when did you last receive a handwritten letter or card? How did it feel?'],
      during: ['At each page, ask learners to point to the matching part on a chart.'],
      after: ['Write a full letter to a cousin using all six parts.', 'Swap letters and mark them with the checklist.'],
      discussion: ['Why should a letter to a cousin still use full words?', 'What makes a letter feel warm?'],
      reflection: ['Which part of the letter is easiest for you, and which is hardest?'],
      support: ['Give learners a letter frame with labelled boxes and sentence starters.'],
      stretch: ['Write the same news twice: once in chat voice, once in exam voice, and explain the differences.'],
      localise: ['Use your learners’ real addresses, cousins and places. Check the format against your school’s English syllabus.'],
      factCheck: [
        { claim: 'Informal letters include the sender’s address and date, a salutation (“Dear …”), an opening, a body in paragraphs, a conclusion and a friendly subscription such as “Yours ever” or “Your loving friend”.', explanation: 'From a Ghana curriculum learning-material lesson on informal letters.', reference: 'Ghana curriculum resources, “English Language LM Year 1 Section 15” (curriculumresources.edu.gh).' },
        { claim: 'WAEC examiners have for years reported that candidates lose marks for text-style abbreviations and slang in letters; WAEC repeated the warning in September 2026.', explanation: 'News reports of WAEC’s statement and of examiners’ concerns.', reference: 'MyJoyOnline (7 September 2026); Junior Graphic (2015).' },
      ],
    },
  }),
];

