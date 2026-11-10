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

export const BATCH_21_STORIES: PilotStory[] = [
/**
 * Batch 21: School life, part two. Eight stories: boarding-house life and the chop box, the debate club, a quiz
 * contest, the SRC election, the temptation of exam malpractice, a class group chat that goes too far, formal letters
 * to a headmistress, and the last day before the BECE.
 *
 * Rules: as Batches 13 to 20. All characters and schools are invented. Every letter in the stories is exam-safe
 * (full words, correct spelling, standard punctuation). Chat slang appears only as labelled mistakes. Claims about
 * exam rules and sanctions are general and flagged for review against current WAEC rules. All stories are drafts.
 */

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'chop-box-night',
    title: 'Chop Box Night',
    summary: 'Patience is new at a boarding school and homesick. Her chop box is nearly empty, the dormitory is loud, and the lights go out at nine. With a kind senior and a shared night-time feast, she finds that a dormitory can become a family. Includes a letter home in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'school-life', 'humour'],
    themes: ['school', 'friendship', 'new-beginnings', 'food'],
    objectives: ['emotional-intelligence', 'kindness', 'vocabulary', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-food', 'local-names'],
    wpm: 120,
    paceWord: 'Warm and a little funny, soft at the homesick night',
    palette: ['#b45309', '#1d4ed8'],
    voice: 'Gentle girl voices; a firm, warm voice for the house mistress, Madam Dankyi',
    characters: [
      'Patience: a 12-year-old girl in a new boarding uniform, sitting on a metal bed beside a wooden chop box.',
      'Eunice: a 15-year-old senior girl in a house cardigan, with a torch and a tin of biscuits.',
      'Madam Dankyi: the house mistress, in a wrapper and blouse, with a bunch of keys.',
      'The dormitory: a long room with rows of bunk beds, mosquito nets, buckets and trunks.',
    ],
    music: 'Soft evening hum of voices and a gentle guitar; a lively shared-feast tune (placeholder)',
    pages: [
      pg('🧳', 'On her first night at boarding school, Patience sat on a metal bed in a long dormitory full of strangers. Beside her stood a wooden chop box her mother had packed: gari, sugar, tinned milk, a tin of sardines and a bag of groundnuts. The room was noisy. Girls shouted, buckets clanged, and a radio played somewhere. Patience swallowed hard. She missed her mother’s kitchen.', 'A girl sits on a bunk beside a wooden chop box in a busy dormitory.'),
      pg('🔔', 'The bell rang for prep, then for supper, then for lights out. Supper was a scoop of beans and a slice of bread. Patience ate half of it. At nine o’clock, Madam Dankyi, the house mistress, walked down the aisle with her keys. “Lights out, ladies,” she said. “Rest well. Tomorrow is a long day.” Then the dormitory went dark, and Patience’s eyes filled with tears.', 'A house mistress walks between rows of bunk beds as the lights go out.'),
      pg('🔦', 'A small torch clicked on above her. Eunice, a senior, leaned down from the next bunk. “First night?” she whispered. Patience nodded. “Everyone cries on the first night,” said Eunice. “I did. It does not mean you are weak. It means you love your home.” Patience let out a small laugh and wiped her face.', 'A senior girl leans from a top bunk with a small torch, speaking softly to a younger girl.'),
      pg('🍪', '“Do you have a chop box?” asked Eunice. Patience pointed. “Good,” said Eunice. “In this house, a chop box is a treasure, but it is also a gift to share. Tomorrow night, we will have a little feast, if you want.” She opened her tin of biscuits and passed one down. “Welcome to Red Wing,” she whispered. “You are not alone here.”', 'A girl shares a biscuit from a tin with a younger girl in the dim light.'),
      pg('🥣', 'The next evening, six girls sat in a circle on the dormitory floor with their chop boxes. Patience added gari, sugar and groundnuts to a big bowl. Another girl added milk. Another added sardines and pepper. They mixed it and ate with spoons, laughing quietly. “A feast!” said Eunice. “Everyone brings a little, and everyone has plenty.” Patience ate until her tummy was full.', 'Girls sit in a circle on the floor sharing food from a bowl in a dormitory.'),
      pg('📋', 'Madam Dankyi explained the dormitory rules the next day. “Keep your space tidy. Do not borrow without asking. Do not take food that is not yours. Be quiet after lights out. And look after each other.” She looked at Patience kindly. “If you are ever unwell, sad or frightened, tell me or a senior. That is what we are here for.” Patience felt safe.', 'A house mistress speaks to a group of girls beside a notice board of dormitory rules.'),
      pg('✉️', 'That weekend, Patience wrote home, with her address and the date at the top. “Red Wing, Hillcrest Girls’ Boarding School, Koforidua. 20th February, 2027. Dear Mother, I hope you are well. I miss you very much, but I am settling in. A kind senior called Eunice has helped me, and I have made new friends. Thank you for the chop box. We shared it, and it was delicious. Please greet Father and my brothers for me. I will write again next week. Your loving daughter, Patience.”', 'A girl writes a letter on her bunk with the empty chop box beside her.'),
      pg('✅', 'Exam-safe tip: Patience wrote that she misses her mother in full, honest words. She did not use a chat shortcut such as “mis u”. Short, warm sentences with clear details make a letter easy to read. Letters can show feelings, and exam letters should show them in complete words. The end.', 'A girl and her friend read a letter with a tick drawn beside the warm phrases.'),
    ],
    activities: [
      { id: 'chop-c1', type: 'comprehension', afterPage: 3, question: 'What does Eunice tell Patience about crying on the first night?', options: ['Everyone does and it shows love for home', 'Only weak students cry', 'It is against the rules'], correctIndex: 0 },
      { id: 'chop-p1', type: 'prediction', afterPage: 4, prompt: 'Eunice says a chop box is a treasure and a gift to share. What might happen next?', options: ['The girls share a feast', 'The box is locked away', 'Patience goes home'] },
      { id: 'chop-c2', type: 'comprehension', afterPage: 7, question: 'Which words show Patience’s feeling in her letter?', options: ['I miss you very much', 'mis u', 'I do not care'], correctIndex: 0 },
      { id: 'chop-voc', type: 'vocabulary', afterPage: 6, word: 'homesick', definition: 'Sad because you miss your home and family.', distractors: ['Sick at home', 'Tired of school'] },
      { id: 'chop-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Patience cries on her first night.', 'Eunice whispers a kind word.', 'The girls share a chop box feast.', 'Patience writes home.'] },
      { id: 'chop-sel', type: 'sel', afterPage: 8, prompt: 'New places can feel lonely. How do you feel when someone is kind to you?', feelingOptions: ['Relieved', 'Welcome', 'Grateful', 'Safe'] },
    ],
    glossary: [
      { word: 'dormitory', definition: 'A large room where many students sleep.', pages: [1] },
      { word: 'senior', definition: 'A student in a higher class.', pages: [3] },
      { word: 'prep', definition: 'Supervised study time in a boarding school.', pages: [2] },
      { word: 'treasure', definition: 'Something precious and valued.', pages: [4] },
      { word: 'settling', definition: 'Getting used to a new place.', pages: [7] },
    ],
    culturalNotes: ['The school, house and people are invented. Many Ghanaian boarding schools use a house or wing system with a house mistress or master, a chop box and “prep” (supervised evening study).', 'Foods in the chop box are examples. Families pack what they can afford; the story shows sharing without pressure.', 'The letter on page 7 is exam-safe: full words, correct spelling and warm, specific sentences.'],
    reviewQuestions: ['Check boarding terms (chop box, prep, house mistress, lights out) with a teacher from a boarding school.', 'Check that the story is sensitive to children whose chop box is small or empty and to homesickness that does not pass quickly.', 'Check that the story models a safe adult to tell when a child is unwell, sad or frightened.'],
    guide: {
      overview: 'A story about homesickness, kindness from seniors and sharing in a boarding school, with an exam-safe letter home.',
      lessonMinutes: 40,
      goals: ['Name ways to help a new student feel welcome.', 'Describe feelings in full words.', 'Write a letter home using clear details.'],
      subjects: [['Guidance and Counselling', 'Belonging and feelings'], ['English Language', 'Informal letters'], ['Home Economics', 'Shared meals and food safety']],
      before: ['Ask: what would help you most on your first night in a new place?'],
      during: ['At page 4, ask learners what they would bring to share.'],
      after: ['Write a letter home from a boarding student.', 'List ten welcoming sentences a senior could say.'],
      discussion: ['How can seniors use their power kindly?', 'What if some students have little in their chop box?'],
      reflection: ['Who made you feel welcome when you were new?'],
      support: ['Provide a letter frame with feelings words: homesick, grateful, settled, comfortable.'],
      stretch: ['Write a short dormitory code of conduct that protects new students.'],
      localise: ['Use your school’s real terms for houses, wings and rules. For day schools, adapt to a new-student buddy system.'],
      factCheck: [
        { claim: 'Informal letters use a warm opening, details in the body, a closing and a friendly sign-off, written in full words.', explanation: 'From a Ghana curriculum learning-material lesson on informal letters.', reference: 'Ghana curriculum resources, “English Language LM Year 1 Section 15” (curriculumresources.edu.gh).' },
      ],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-motion-before-the-house',
    title: 'The Motion Before the House',
    summary: 'Felicia Owusu is terrified of speaking in public, but the debate club needs a third speaker. With practice, research, respectful rebuttal and a fair judge, she learns how to disagree without being disagreeable. Includes a letter to a friend about the debate in exam-safe English.',
    classIds: ['jhs-2', 'jhs-3'],
    ageMin: 13,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['realistic-fiction', 'school-life', 'educational'],
    themes: ['school', 'citizenship', 'fear-and-courage'],
    objectives: ['critical-thinking', 'oral-language', 'respect', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Nervous at first, then strong and clear',
    palette: ['#1e3a8a', '#f59e0b'],
    voice: 'Nervous, then confident student voices; a fair, dry voice for Mr Baidoo the judge',
    characters: [
      'Felicia Owusu: a 14-year-old girl in a school uniform, holding index cards with shaking hands.',
      'Wilfred Ocansey: a 15-year-old boy, captain of the debate team, with a confident grin.',
      'Mr Baidoo: the debate master and judge, in a suit and tie, with a stopwatch and score sheets.',
      'The hall: a school hall with two rows of chairs, a lectern and a banner reading “Inter-School Debate”.',
    ],
    music: 'Light, thoughtful strings that build into a confident drumbeat (placeholder)',
    pages: [
      pg('🎤', 'The motion was “This house believes that students should be allowed to use phones in school.” Felicia Owusu’s palms were wet. The debate club had lost a speaker, and Wilfred, the captain, had asked her to fill in. “I cannot speak in front of people,” she whispered. “You do not have to be loud,” said Wilfred. “You just have to be clear.”', 'A girl holds index cards with shaking hands while a boy captain encourages her.'),
      pg('📚', 'Mr Baidoo, the debate master, explained how an argument works. “Make a claim. Give a reason. Give evidence. Explain how the evidence supports the claim.” He wrote on the board: Claim, Reason, Evidence, Link. “An opinion is not an argument,” he said. “‘I like phones’ is an opinion. ‘Phones help students look up answers, because they hold dictionaries and encyclopedias’ is the start of an argument.”', 'A teacher writes claim, reason, evidence and link on a board in a debate club room.'),
      pg('🔍', 'Felicia’s team was assigned the side against phones. She did not even like that side. “That is the point,” said Mr Baidoo. “A good debater can argue either side, because they understand both.” Felicia went to the library. She found a report about students’ attention and noted its title and year. She wrote three points on her cards and practised at home in front of a mirror.', 'A girl takes notes in a library with a stack of books and a mirror practice shown in a small panel.'),
      pg('🗣️', 'On the day of the debate, the hall was full. The other side’s first speaker spoke well, and Felicia’s knees shook. Then it was her turn. She stood at the lectern and took a breath. “Mr Chairman, honourable judges, ladies and gentlemen,” she began. Her voice trembled, then steadied. “We do not say phones are bad. We say that a classroom needs focus. Here are three reasons.”', 'A girl stands at a lectern in a school hall, speaking to an audience and judges.'),
      pg('🛡️', 'In the rebuttal round, the other team’s speaker said, “Those who oppose phones live in the past!” Wilfred leaned over and whispered, “Do not attack the person. Answer the point.” Felicia stood up. “My opponent says we live in the past,” she said calmly. “That is not an argument. The question is whether phones help students learn in class. Here is the evidence that they sometimes do not.”', 'A girl stands to answer an opponent while a boy whispers advice beside her.'),
      pg('🏅', 'The judges counted the points. “The winner,” announced Mr Baidoo, “is the proposition.” Felicia’s team had lost by two points. Felicia’s heart sank, and then she saw Mr Baidoo smiling. “Your speech was the best argued in the hall,” he said. “Winning matters, but learning to disagree respectfully matters more.” Felicia smiled. “I would do it again,” she said, and she meant it.', 'A judge announces results as the two teams shake hands on the stage.'),
      pg('✉️', 'That evening, Felicia wrote to her friend Yvonne, putting her address and the date at the top. “House 4, Church Street, Winneba. 9th May, 2027. Dear Yvonne, I hope you are well. Today I took part in my first school debate, and I was extremely nervous. Our team did not win, but I spoke clearly and learned how to build an argument. I would like to invite you to watch the next one. Please reply soon. Your friend, Felicia.”', 'A girl writes a letter at a desk with her debate cards and a small certificate.'),
      pg('✅', 'Exam-safe tip: Felicia used the same shape as a good argument in her letter, with a clear point, a reason and a conclusion. She also kept a polite, positive tone, even about losing. Notice that she wrote “extremely nervous” and not “super nervous lol”. Strong words and full sentences make a letter persuasive. The end.', 'A girl and her teacher read a letter with a tick beside the full sentences.'),
    ],
    activities: [
      { id: 'mot-c1', type: 'comprehension', afterPage: 3, question: 'What is the difference between an opinion and an argument?', options: ['An argument gives reasons and evidence', 'An opinion is longer', 'There is no difference'], correctIndex: 0 },
      { id: 'mot-p1', type: 'prediction', afterPage: 5, prompt: 'The opponent attacks the people on Felicia’s side. What should she do?', options: ['Answer the point, not the person', 'Shout back', 'Sit down'] },
      { id: 'mot-c2', type: 'comprehension', afterPage: 7, question: 'What does Felicia write instead of “super nervous lol”?', options: ['Extremely nervous', 'Nervous lol', 'So nervous omg'], correctIndex: 0 },
      { id: 'mot-voc', type: 'vocabulary', afterPage: 5, word: 'rebuttal', definition: 'A reply that shows why an opponent’s point is weak or wrong.', distractors: ['A first speech', 'A thank-you note'] },
      { id: 'mot-s1', type: 'sequencing', prompt: 'Put the argument parts in order.', items: ['Claim', 'Reason', 'Evidence', 'Link back to the claim'] },
      { id: 'mot-sel', type: 'sel', afterPage: 8, prompt: 'Speaking in front of others takes courage. How do you feel when you must do it?', feelingOptions: ['Nervous', 'Brave', 'Excited', 'Calm'] },
    ],
    glossary: [
      { word: 'motion', definition: 'The statement that a debate is about.', pages: [1] },
      { word: 'evidence', definition: 'Facts or examples that support a claim.', pages: [2, 5] },
      { word: 'argument', definition: 'A claim supported by reasons and evidence.', pages: [2] },
      { word: 'lectern', definition: 'A stand for a speaker’s notes.', pages: [4] },
      { word: 'proposition', definition: 'The team that supports the motion.', pages: [6] },
    ],
    culturalNotes: ['The school, debaters and judge are invented. Debate is a common club in Ghanaian schools and the story uses a general format; real contests may differ.', 'The report mentioned on page 3 is not named; learners should find and cite their own sources.', 'The story shows both sides of the phones debate without taking a side.'],
    reviewQuestions: ['Check that the debate format and terms (motion, proposition, opposition, rebuttal, chairman) match local schools.', 'Check that the story does not take a side on phones in schools and that school policy is respected.', 'Check the letter against the BECE marking scheme.'],
    guide: {
      overview: 'A story about building an argument, respectful rebuttal and courage in public speaking. It models a persuasive, polite informal letter.',
      lessonMinutes: 45,
      goals: ['Build an argument with claim, reason, evidence and link.', 'Answer a point without attacking a person.', 'Write a polite, positive informal letter about an experience.'],
      subjects: [['English Language', 'Speaking and persuasive writing'], ['Social Studies', 'Citizenship and respectful debate'], ['Information and Communication Technology', 'Sources and evidence']],
      before: ['Ask: can you disagree with someone and still respect them? How?'],
      during: ['At page 2, ask learners to turn an opinion into an argument.'],
      after: ['Hold a class debate on a safe motion, with timed speeches.', 'Write a letter to a friend about a time you spoke in public.'],
      discussion: ['Why can arguing the side you disagree with be useful?', 'What is the difference between attacking a point and attacking a person?'],
      reflection: ['What is one topic on which you would like to improve your argument?'],
      support: ['Give learners an argument card: Claim / Because / For example / So.'],
      stretch: ['Prepare both sides of a motion and present each in two minutes.'],
      localise: ['Use motions from your school’s debate club and local issues learners know. Pick motions that do not target any group.'],
      factCheck: [
        { claim: 'A well-formed argument has a claim, a reason, evidence and an explanation of how the evidence supports the claim.', explanation: 'A standard structure used in school debating and argument writing.', reference: 'Review with the school’s debate coach or English teacher; add a named source.' },
      ],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-last-question',
    title: 'The Last Question',
    summary: 'Three students from Okuapem Basic compete in a district quiz contest. They answer, argue, guess wrong and lose by one point. A story about preparation, working as a trio, handling nerves, learning from a wrong answer and being gracious, with an exam-safe thank-you letter to the quiz mistress.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'school-life', 'drama'],
    themes: ['school', 'friendship', 'fear-and-courage'],
    objectives: ['perseverance', 'teamwork', 'scientific-curiosity', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Fast and tense in the rounds, calm at the end',
    palette: ['#7c2d12', '#38bdf8'],
    voice: 'Quick, excited student voices; a crisp, kind voice for Madam Nortey, the quizmaster',
    characters: [
      'Godfred Adjei: a 14-year-old boy, strong in Mathematics, with a buzzer button under his hand.',
      'Lamisi: a 14-year-old girl, strong in Science, in a headscarf and school uniform.',
      'Raymond Laryea: a 13-year-old boy, strong in English and Social Studies, nervous but sharp.',
      'Madam Nortey: the quizmaster, in a bright dress, with question cards and a bell.',
    ],
    music: 'Tense quiz-show drums with a ticking clock; a warm, resolving tune at the end (placeholder)',
    pages: [
      pg('🔔', 'The district quiz contest began at ten o’clock. Three tables sat on the stage, each with a buzzer and a bell. Godfred, Lamisi and Raymond sat at the table for Okuapem Basic. Raymond’s knees knocked together. “Breathe,” said Lamisi. “We prepared. We trust each other. Let us just do our best.”', 'Three students sit at a quiz table on a stage with a buzzer and a bell.'),
      pg('➗', 'Madam Nortey, the quizmaster, read the first question. “What is the next prime number after 13?” Godfred’s hand shot to the buzzer. “Seventeen,” he said. “Correct,” said Madam Nortey. The audience clapped. In the next round, Lamisi answered a question about the water cycle and Raymond answered one about the Volta River. Okuapem Basic led by two points.', 'A boy presses a buzzer as the quizmaster reads from a card and the audience applauds.'),
      pg('😬', 'But the quiz was close. Another school caught up, then pulled ahead. In the third round, Godfred buzzed too fast and gave the wrong answer. “Minus two,” said Madam Nortey. Godfred’s face fell. Raymond whispered, “It is fine. We all make mistakes. Wait for the next question.” Godfred nodded and took a deep breath.', 'A boy covers his face after a wrong answer while his teammate whispers to him.'),
      pg('🤝', 'In the last round, the scores were tied. Madam Nortey held up the final card. “Which scientist is known for the theory of gravity?” Lamisi leaned in. “Newton,” she whispered. Raymond nodded. But Godfred wondered whether it was a trick question. The other school buzzed first and answered. “Isaac Newton,” they said. “Correct.” The hall roared.', 'Three students whisper at a table while another team’s hand presses a buzzer.'),
      pg('😔', 'Okuapem Basic lost by one point. Godfred felt his throat tighten. “I should have buzzed,” he said. “If I had trusted my first thought...” Lamisi put a hand on his shoulder. “We prepared,” she said. “We lost by one point, but we got many answers right. And you gave us the lead in the first round.” Raymond added, “We won as a team and we lost as a team.”', 'Three students comfort each other on the stage as the winners celebrate.'),
      pg('👏', 'They walked across the stage and shook hands with the winning team. “Well done,” said Godfred. “That last question was ours, but you were quicker.” The other captain smiled. “You were tough,” she said. “See you next year.” Madam Nortey came over with the certificates. “Participation is not a small thing,” she said. “You learned today, and learning is the real prize.”', 'Students shake hands across a stage while a quizmaster holds certificates.'),
      pg('✉️', 'That evening, Raymond wrote to Madam Nortey. Because she was an older person he knew, he wrote a semi-formal letter, with his address and the date at the top. “House 11, Cedar Road, Aburi. 12th June, 2027. Dear Madam Nortey, I hope you are well. I am writing to thank you for organising the district quiz. Although our team came second, we learned a great deal, and we are already revising for next year. Thank you for your kindness and patience. Yours sincerely, Raymond Laryea.”', 'A boy writes a thank-you letter at a desk beside a certificate.'),
      pg('✅', 'Exam-safe tip: Raymond wrote a short, polite letter with a clear reason for writing, in full words. He wrote “thank you” and not “tnx” or “ty”. Notice also that he did not say “we lost lol”. He wrote “we learned a great deal”. A positive tone helps even when the news is not winning. The end.', 'A boy and his teacher read a letter with a tick beside the polite phrases.'),
    ],
    activities: [
      { id: 'las-c1', type: 'comprehension', afterPage: 3, question: 'What happened when Godfred buzzed too fast?', options: ['He gave a wrong answer and lost two points', 'He won the round', 'The quiz stopped'], correctIndex: 0 },
      { id: 'las-p1', type: 'prediction', afterPage: 5, prompt: 'The team lost by one point. How might they respond?', options: ['Shake hands and learn from it', 'Argue with the judges', 'Leave the stage'] },
      { id: 'las-c2', type: 'comprehension', afterPage: 7, question: 'Why does Raymond write “we learned a great deal”?', options: ['It shows a positive tone in full words', 'It is short for something', 'It is a quiz answer'], correctIndex: 0 },
      { id: 'las-voc', type: 'vocabulary', afterPage: 6, word: 'gracious', definition: 'Polite and kind, especially when it is hard.', distractors: ['Very loud', 'Very quick'] },
      { id: 'las-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The quiz begins.', 'Godfred gives a wrong answer.', 'The last question decides the winner.', 'Raymond writes a thank-you letter.'] },
      { id: 'las-sel', type: 'sel', afterPage: 8, prompt: 'Losing by a small margin is hard. How do you feel when that happens?', feelingOptions: ['Disappointed', 'Proud', 'Determined', 'Calm'] },
    ],
    glossary: [
      { word: 'buzzer', definition: 'A button that makes a sound when pressed.', pages: [1, 2] },
      { word: 'prime', definition: 'A number greater than one that can only be divided by one and itself.', pages: [2] },
      { word: 'quizmaster', definition: 'The person who asks the questions in a quiz.', pages: [2] },
      { word: 'participation', definition: 'Taking part in something.', pages: [6] },
      { word: 'revising', definition: 'Going over work to learn it better.', pages: [7] },
    ],
    culturalNotes: ['The school, contest and people are invented. School quiz contests are common in Ghana; the story does not copy any named competition.', 'The quiz facts (next prime after 13 is 17; Newton and gravity) are standard school facts.', 'The letter on page 7 is exam-safe: full words and a positive, polite tone.'],
    reviewQuestions: ['Check the quiz facts: the next prime after 13 is 17; the theory of gravity is associated with Isaac Newton.', 'Check that the story does not suggest that second place is failure, and that it is inclusive of students who are not in the team.', 'Check the letter against the BECE marking scheme (this is a polite informal-to-semi-formal thank-you).'],
    guide: {
      overview: 'A story about trio teamwork, nerves and graceful losing in a quiz contest. It models a short thank-you letter in exam-safe English.',
      lessonMinutes: 40,
      goals: ['Describe how a team can support a member after a mistake.', 'Practise polite, positive wording in a letter.', 'Run a mini class quiz using fair rules.'],
      subjects: [['Mathematics', 'Prime numbers'], ['Integrated Science', 'Gravity and the water cycle'], ['English Language', 'Thank-you letters']],
      before: ['Ask: what should a team do when one member makes a mistake?'],
      during: ['At page 3, ask learners what they would whisper to Godfred.'],
      after: ['Run a class quiz with a buzzer rule and negative marking.', 'Write a thank-you letter to a teacher for an event.'],
      discussion: ['Is it better to buzz fast or to be sure? When?', 'How can a team be gracious after losing?'],
      reflection: ['What is a mistake you have learned from?'],
      maths: [
        { task: 'List the prime numbers between 10 and 30.', answer: '11, 13, 17, 19, 23, 29.' },
        { task: 'A team scores +2 for each correct answer and −2 for each wrong one. They answer 9 correctly and 2 wrongly. What is the total?', answer: '18 − 4 = 14 points.' },
      ],
      support: ['Provide a letter frame: Dear…, I am writing to thank you for…, Yours sincerely,'],
      stretch: ['Write ten quiz questions across subjects with answers and a marking rule.'],
      localise: ['Use real quiz formats your school knows. Include roles for learners who prefer not to be on the buzzer, such as scorekeeper.'],
      factCheck: [
        { claim: 'The next prime number after 13 is 17.', explanation: 'The numbers 14, 15 and 16 each have other factors.', reference: 'Standard mathematics.' },
        { claim: 'Isaac Newton is the scientist associated with the theory of gravity.', explanation: 'Newton published his law of universal gravitation in 1687.', reference: 'Standard science history.' },
      ],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'vote-for-nana-ama',
    title: 'Vote for Georgina',
    summary: 'Georgina runs for SRC president. Her rival promises free sweets and a longer break. She promises less. A story about elections, honest promises, listening, fair campaigning, losing gracefully and what a student leader really does, with a formal-style campaign letter and an exam-safe tip.',
    classIds: ['jhs-2', 'jhs-3'],
    ageMin: 13,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['realistic-fiction', 'school-life', 'drama'],
    themes: ['school', 'citizenship', 'leadership'],
    objectives: ['citizenship', 'honesty', 'critical-thinking', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Campaign-bright and persuasive, steady in the speeches',
    palette: ['#047857', '#f97316'],
    voice: 'Lively campaign voices; a calm, impartial voice for Mr Gbeku the electoral officer',
    characters: [
      'Georgina: a 14-year-old girl with a campaign poster and a notebook of student complaints.',
      'Sedem: a 14-year-old boy, her rival, with a bag of sweets and a loud, friendly voice.',
      'Mr Gbeku: the school’s electoral officer, a teacher with a ballot box and a voters’ register.',
      'The assembly ground: a school ground with posters, a ballot box and a long queue of students.',
    ],
    music: 'Upbeat campaign highlife with a rally drum; a thoughtful, steady tune at the result (placeholder)',
    pages: [
      pg('🗳️', 'Student Representative Council elections were coming. Two candidates stood for president: Georgina and Sedem. Sedem’s posters said, “Vote Sedem: Free Sweets and Longer Break!” He handed out sweets at the gate. Students cheered. Georgina’s poster was plainer: “Vote Georgina: Listening, Planning, Delivering.” Her friend Ishmael groaned. “You cannot beat sweets with listening.”', 'Two campaign posters side by side on a wall, one with sweets and one plain.'),
      pg('📓', 'But Georgina had a plan. She went from class to class with a notebook, asking, “What is your biggest problem at school?” Students told her: broken taps, a dirty toilet block, no library hours after break, bullying at the gate. She wrote it all down. “A leader’s first job,” she told Ishmael, “is to listen. Then to promise only what she can deliver.”', 'A girl with a notebook talks to students in a classroom and writes down their problems.'),
      pg('🎙️', 'At the campaign rally, Sedem promised longer breaks, free sweets and no homework on Fridays. The crowd cheered. Georgina’s turn came. “I cannot promise you free sweets,” she said. “The SRC does not own sweets, and it does not decide the timetable. But I can promise to take your list of problems to the head teacher every month and to report back to you.” Some students clapped, some looked unsure.', 'A girl speaks at a microphone to a crowd while a boy waits with a bag of sweets.'),
      pg('⚖️', 'Mr Gbeku, the electoral officer, reminded the students of the rules before polling day. “Every student votes once. No campaigning at the ballot box. No bribery, and sweets for votes count as bribery. The secret ballot means nobody has to tell anyone how they voted.” Sedem blushed and put away his bag. “I did not mean it as a bribe,” he muttered. “It is a lesson for all of us,” said Mr Gbeku.', 'An electoral officer addresses students beside a ballot box and a list of rules.'),
      pg('✅', 'Polling day came. Students queued, signed the register and dropped their folded papers into the box. The count was done in public. Georgina won by forty-two votes. She shook Sedem’s hand. “Thank you for a fair contest,” she said. “Will you chair the Sports Committee?” Sedem was surprised, then grinned. “I would be honoured,” she said.', 'Students watch as ballot papers are counted in public and two candidates shake hands.'),
      pg('🛠️', 'In her first month, Georgina took the broken-taps list to the head teacher, who arranged repairs. The SRC held a clean-up day. The library stayed open for twenty extra minutes after break. Not every promise was kept at once, and Georgina said so honestly at the next assembly. “We fixed three of the five problems,” she reported. “We will keep working on the rest.” Students listened, because she told the truth.', 'A girl reports progress at assembly beside a list with three ticks and two open items.'),
      pg('✉️', 'Georgina wrote to Madam Okyere, the head teacher, in full formal layout. In the top right corner she put her address, SRC Office, Hillview Basic School, Box 22, Koforidua, and beneath it the date, 3rd March, 2027. On the left she wrote the receiver’s designation and address: The Head Teacher, Hillview Basic School, Box 22, Koforidua. Next came the salutation, “Dear Madam,” and the heading, REQUEST FOR PERMISSION TO HOLD A CLEAN-UP DAY. Her body read: “I am writing on behalf of the Student Representative Council to request your permission to hold a clean-up day on Saturday, 13th March. Firstly, litter on the compound can attract pests and harm our health. Secondly, we have prepared a list of forty volunteers, and a local Assembly member has offered to lend us tools. We shall be grateful for your approval.” She ended with “Yours faithfully,”, her signature, and her full name, Georgina Amoah, SRC President.', 'A girl writes a formal letter at a desk beside the SRC badge.'),
      pg('✅', 'Exam-safe tip: a letter to a head teacher is formal, so it needs all eight features: the writer’s address, the date, the receiver’s designation and full address, “Dear Madam” or “Dear Sir”, a heading, “Yours faithfully”, a signature and the writer’s full name. The body should be polite, clear and persuasive, with reasons, and it must not use contractions, slang or chat words. In an exam, check who the reader is first. The end.', 'A girl and a teacher read a letter with a tick beside the formal opening and closing.'),
    ],
    activities: [
      { id: 'vote-c1', type: 'comprehension', afterPage: 3, question: 'What does Georgina promise?', options: ['Take their problems to the head teacher and report back', 'Free sweets', 'No homework'], correctIndex: 0 },
      { id: 'vote-p1', type: 'prediction', afterPage: 4, prompt: 'Mr Gbeku calls sweets for votes bribery. What may Sedem do?', options: ['Stop and learn from it', 'Give out more sweets', 'Leave the school'] },
      { id: 'vote-c2', type: 'comprehension', afterPage: 7, question: 'How does Georgina’s letter end?', options: ['Yours faithfully', 'See ya', 'Love, Nana'], correctIndex: 0 },
      { id: 'vote-voc', type: 'vocabulary', afterPage: 4, word: 'bribery', definition: 'Giving something to win someone’s vote or favour unfairly.', distractors: ['Sharing sweets at a party', 'Counting votes'] },
      { id: 'vote-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Georgina listens to student problems.', 'Candidates make promises at a rally.', 'Students vote and the count is public.', 'The new president reports honestly on progress.'] },
      { id: 'vote-sel', type: 'sel', afterPage: 8, prompt: 'Telling the truth can cost votes but earn trust. How does that feel?', feelingOptions: ['Proud', 'Nervous', 'Honest', 'Determined'] },
    ],
    glossary: [
      { word: 'candidates', definition: 'People who stand for election.', pages: [1] },
      { word: 'rally', definition: 'A large meeting to support a cause or a candidate.', pages: [3] },
      { word: 'register', definition: 'An official list of voters or names.', pages: [5] },
      { word: 'ballot', definition: 'A secret vote on paper.', pages: [4] },
      { word: 'electoral', definition: 'To do with elections.', pages: [4] },
    ],
    culturalNotes: ['The school, candidates and officers are invented. Many Ghanaian schools elect a Students’ Representative Council (SRC) and prefects; details differ.', 'The story does not name any real party or politician. Sedem’s sweets are shown as a lesson, not as a comment on real elections.', 'The letter on page 7 is formal, with “Dear Madam” and “Yours faithfully”, to show the difference from informal letters.'],
    reviewQuestions: ['Check the SRC rules and roles with the school’s SRC patron or head teacher.', 'Check that the story does not suggest that sweets or gifts are always bribes; discuss how to run a fair campaign.', 'Check the formal letter layout (addresses, date, subject line, “Yours faithfully”) against the BECE marking scheme.'],
    guide: {
      overview: 'A story about fair campaigning, honest promises and the real work of a student leader. It also contrasts a formal letter with the informal letters in earlier stories.',
      lessonMinutes: 45,
      goals: ['Explain the difference between an honest promise and an empty one.', 'Describe a fair, secret ballot.', 'Contrast a formal letter with an informal one.'],
      subjects: [['Social Studies', 'Elections and citizenship'], ['English Language', 'Formal letters'], ['Religious and Moral Education', 'Honesty and service']],
      before: ['Ask: what makes a good leader? A good promise?'],
      during: ['At page 3, ask learners which promise they trust, and why.'],
      after: ['Run a mock class election with a secret ballot and public count.', 'Write a formal letter to the head teacher requesting permission for an event.'],
      discussion: ['Why does a secret ballot matter?', 'Is it ever right to make a promise you are not sure you can keep?'],
      reflection: ['What is one thing you would do for your school if you were elected?'],
      maths: [
        { task: 'Georgina wins by 42 votes. Sedem gets 118 votes. How many does Georgina get?', answer: '118 + 42 = 160 votes.' },
        { task: 'How many votes in total, and what percentage did Georgina win?', answer: '160 + 118 = 278 votes; 160 ÷ 278 × 100 ≈ 57.6 per cent.' },
      ],
      support: ['Give learners a formal letter frame with boxes: sender’s address, date, receiver, Dear…, reason, request, Yours faithfully.'],
      stretch: ['Write a campaign speech with three promises that the SRC can actually keep.'],
      localise: ['Use your school’s real SRC rules. Do not use real party names; keep the exercise school-based.'],
      factCheck: [
        { claim: 'A formal letter has the writer’s address, the date, the recipient’s designation and full address, “Dear Sir/Madam”, a title or heading, “Yours faithfully/Yours sincerely”, the writer’s signature and full name; the language must be polite, clear and persuasive with no contractions, slang or colloquialism.', explanation: 'From the organisation, expression and mechanical-accuracy criteria for formal letters and essays supplied by the project owner; the informal-letter features come from the NaCCA lesson.', reference: 'Project-owner marking guidance (organisation, expression, mechanical accuracy); NaCCA English Language LM Year 1 Section 15 (curriculumresources.edu.gh). Verify against the current official marking scheme.' },
      ],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-answers-for-sale',
    title: 'The Answers for Sale',
    summary: 'A message arrives two nights before the exam: “Real questions and answers, only GH¢50.” Vincent is scared he will fail. A story about the temptation to cheat, the real risks of scams and malpractice, fairness, honesty, and the better plan he finds with his teacher and his mother, with an exam-safe letter to a younger brother.',
    classIds: ['jhs-2', 'jhs-3'],
    ageMin: 13,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['realistic-fiction', 'school-life', 'moral'],
    themes: ['school', 'family', 'fear-and-courage'],
    objectives: ['honesty', 'critical-thinking', 'responsibility', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Tense and honest, calmer at the choice',
    palette: ['#0f172a', '#22c55e'],
    voice: 'Worried, thoughtful teen voice for Vincent; calm, plain voices for his mother and Mr Kotey',
    characters: [
      'Vincent: a 15-year-old boy in a school uniform, with a phone in one hand and a pen in the other.',
      'Yaaba: his mother, a seamstress at a sewing machine, with a tape measure round her neck.',
      'Mr Kotey: the form master, in a short-sleeved shirt, with a stack of past question papers.',
      'The messenger: only a phone screen with a message; the sender is never shown.',
    ],
    music: 'Low, uneasy bass with a ticking clock; a steady, hopeful tune at the choice (placeholder)',
    pages: [
      pg('📱', 'Two nights before the exam, Vincent’s phone buzzed. A message from an unknown number read: “Real questions and answers for tomorrow’s paper. Only GH¢50. Pay now and get everything.” His heart thumped. He had not finished revising Mathematics, and the English comprehension still frightened him. He stared at the message. “Fifty cedis,” he whispered. “Nobody would know.”', 'A boy stares at a phone showing a message with a price, a lamp lighting his face.'),
      pg('🤔', 'He thought about it all night. What if the answers were real? What if he passed easily? Then he thought of other questions. How could a stranger have the real paper? What if the message was a trick to take his money? And what if the examiners found out? The next morning he told no one. He kept the message and did not reply, and the worry sat in his stomach like a stone.', 'A boy lies awake with a thought bubble full of question marks and a coin.'),
      pg('👩👦', 'At home, Vincent’s mother noticed that he was quiet. “What is it?” she asked, putting down her tape measure. He showed her the message. She read it, and she did not shout. “Thank you for telling me,” she said. “I understand the fear. But think. Who sells the answers to an exam? A person who either does not have them, or who has taken them dishonestly. Either way, you cannot trust them.”', 'A seamstress sits beside her son at a sewing machine, reading his phone.'),
      pg('⚖️', 'The next day, Vincent went to Mr Kotey. The form master listened carefully. “Many students get messages like this,” he said. “Some are scams that take your money and send nothing. If answers really do leak, examining bodies treat it as a serious offence. A student who is caught can have results cancelled, and the penalty can follow them. And even if nobody catches you, you have not learned the work.”', 'A teacher speaks seriously to a student at his desk with past papers stacked beside him.'),
      pg('🌍', '“There are other reasons too,” said Mr Kotey. “It is unfair to the student who studied for months. It teaches you to take shortcuts when life gets hard. And it hurts the reputation of every honest student in your school, because employers and universities start to doubt the results.” He paused. “Faith traditions and our national values all ask us to be honest. Notice that none of these reasons depends on being scared of a cane.”', 'A teacher gestures to a list of reasons on a board: fairness, honesty, trust, learning.'),
      pg('📝', 'Then Mr Kotey did something better than lecture. “Let us make a plan,” he said. “Past papers from the last five years, an hour of Mathematics tonight, an hour of English tomorrow, and sleep. You have forty-eight hours, and that is enough to improve.” He added, “And let us report that message to the school, so the head teacher can warn others.”', 'A teacher and student write a two-day revision plan beside a stack of past papers.'),
      pg('✉️', 'Vincent passed the exam with results he was proud of. He wrote to his younger brother, Felix, with his address and the date at the top. “House 2, Lagoon Road, Takoradi. 30th August, 2027. Dear Felix, I hope you are keeping well. Next year you will sit your exams, so I want to share some advice. Prepare early, practise past questions and ask your teachers for help. If anyone offers you answers, refuse and tell an adult. Honest results are worth more than stolen ones. Your loving brother, Vincent.”', 'A boy writes a letter to his younger brother with his exam results folded beside him.'),
      pg('✅', 'Exam-safe tip: Vincent’s advice letter gave clear steps and reasons in full sentences. Notice that he wrote “refuse and tell an adult” and not “no way lol”. Advice letters often use commands such as “prepare”, “practise” and “ask”. Polite, direct language is clear and kind. The end.', 'A boy and his brother read a letter with a tick beside the clear advice.'),
    ],
    activities: [
      { id: 'ans-c1', type: 'comprehension', afterPage: 3, question: 'Why does Vincent’s mother say he cannot trust the seller?', options: ['A seller of answers is either lying or dishonest', 'The seller is her friend', 'The price is too high'], correctIndex: 0 },
      { id: 'ans-p1', type: 'prediction', afterPage: 5, prompt: 'Mr Kotey offers a plan instead of a lecture. What might it include?', options: ['Past papers and rest', 'Staying up all night', 'Copying a classmate'] },
      { id: 'ans-c2', type: 'comprehension', afterPage: 7, question: 'What does Vincent advise his brother to do if someone offers answers?', options: ['Refuse and tell an adult', 'Buy them quickly', 'Share them with friends'], correctIndex: 0 },
      { id: 'ans-voc', type: 'vocabulary', afterPage: 4, word: 'malpractice', definition: 'Cheating or breaking the rules in an examination.', distractors: ['Extra practice', 'A medical visit'] },
      { id: 'ans-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['A message offers exam answers for money.', 'Vincent tells his mother.', 'Mr Kotey explains the risks and makes a plan.', 'Vincent writes advice to his brother.'] },
      { id: 'ans-sel', type: 'sel', afterPage: 8, prompt: 'Telling an adult about a temptation takes courage. How does that feel?', feelingOptions: ['Relieved', 'Nervous', 'Brave', 'Proud'] },
    ],
    glossary: [
      { word: 'scams', definition: 'Tricks that take people’s money dishonestly.', pages: [4] },
      { word: 'leak', definition: 'To let secret information get out.', pages: [4] },
      { word: 'cancelled', definition: 'Stopped or made invalid.', pages: [4] },
      { word: 'reputation', definition: 'What people generally think of someone or something.', pages: [5] },
      { word: 'offence', definition: 'A wrongdoing that breaks a rule or law.', pages: [4] },
    ],
    culturalNotes: ['The people and school are invented. Messages offering “leaked” exam answers are widely reported in West Africa; the story gives no instructions for finding or buying them.', 'The consequences described (cancelled results, trust in results) are general. Teachers should check the current WAEC rules on malpractice before quoting penalties.', 'The reasons for honesty are given from several angles: practical risk, fairness, character and faith or national values. Faith references are general and should be reviewed by local religious teachers.'],
    reviewQuestions: ['Check the description of penalties against current WAEC malpractice rules and wording before use.', 'Check that the story does not shame students who feel scared or encourage them to hide worries; it models telling a trusted adult.', 'Check that “reporting the message to the school” follows the school’s real reporting steps.'],
    guide: {
      overview: 'A story about the temptation to buy exam answers. It teaches practical, moral and fairness reasons for honesty without false threats, and models an advice letter in exam-safe English.',
      lessonMinutes: 45,
      goals: ['Give at least three honest reasons not to cheat.', 'Describe what to do if offered exam answers.', 'Write an advice letter using direct, polite commands.'],
      subjects: [['Religious and Moral Education', 'Honesty'], ['Social Studies', 'Fairness and rules'], ['English Language', 'Advice letters']],
      before: ['Ask: why do some students feel pressure to cheat? What helps?'],
      during: ['At page 5, ask learners to rank the reasons Mr Kotey gives.'],
      after: ['Write a letter of advice to a younger sibling about honest exam preparation.', 'Make a forty-eight-hour revision plan.'],
      discussion: ['Who is hurt when someone cheats?', 'Why is “you will be punished” not the only reason to be honest?'],
      reflection: ['Who is an adult you would tell if you felt tempted?'],
      support: ['Provide a letter frame: Dear…, I am writing to advise you… First… Also… Finally… Your loving…,'],
      stretch: ['Create a short poster: “Three honest reasons, one smart plan.”'],
      localise: ['Use your examining body’s real rules and your school’s reporting steps. Never share or ask for leaked papers.'],
      factCheck: [
        { claim: 'Examining bodies in West Africa treat exam malpractice as a serious offence, and results of candidates found involved can be cancelled or withheld.', explanation: 'WAEC publicly reports withheld and cancelled results for malpractice. Check the current rules before quoting specific penalties.', reference: 'WAEC public statements on examination malpractice (waecgh.org); verify the current wording.' },
      ],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'pause-before-you-post',
    title: 'Pause Before You Post',
    summary: 'A rumour about a classmate spreads in the class group chat, and Evelyn has her thumb over “forward”. A story about gossip, screenshots, kindness, digital footprints and the ten-second pause, with a sincere apology letter in exam-safe English.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'school-life', 'moral'],
    themes: ['school', 'friendship', 'technology'],
    objectives: ['responsibility', 'emotional-intelligence', 'critical-thinking', 'kindness'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Quick like a chat, slow at the pause',
    palette: ['#6d28d9', '#0ea5e9'],
    voice: 'Chatty, then thoughtful voices; a gentle, steady voice for Madam Torgbor',
    characters: [
      'Evelyn: a 14-year-old girl in a school uniform, holding a phone with her thumb over a button.',
      'Lordina: a 14-year-old girl, her friend, hurt and quiet at her desk.',
      'Madam Torgbor: the ICT teacher, in glasses, standing by a screen showing a blank message box.',
      'The group chat: a class chat shown as a phone screen with blank speech bubbles; no real messages or names are shown.',
    ],
    music: 'Quick tapping notification sounds that fade to a calm breath; a gentle closing tune (placeholder)',
    pages: [
      pg('💬', 'The class group chat was buzzing. Someone had posted a story about Lordina: that she had cheated in a test, that she had been sent out of class, that she cried in the toilet. None of it came with proof. Messages piled on messages. Evelyn read them on her phone at home, and her thumb hovered over the forward button. “Everyone is sharing it,” she thought.', 'A girl at home holds a phone with a glowing screen of speech bubbles, her thumb above a button.'),
      pg('⏸️', 'Madam Torgbor, the ICT teacher, had once taught the class a rule: “Before you post, pause for ten seconds and ask three questions. Is it true? Is it kind? Is it necessary?” Evelyn counted. Is it true? She had no idea. Is it kind? She almost laughed at that one. Is it necessary? Not at all. She lowered her phone.', 'A girl counts ten on her fingers beside a note with three questions pinned above her desk.'),
      pg('😢', 'The next day, Lordina sat alone at her desk and barely spoke. Her eyes were red. Evelyn’s stomach dropped. “She has seen it,” she thought. A classmate whispered, “Did you read the chat? It is so funny.” Evelyn shook her head. “It is not funny,” she said quietly. “It is not even true. Somebody made it up.”', 'A girl sits alone at a desk looking sad while two classmates whisper behind her.'),
      pg('🧠', 'Madam Torgbor had a lesson that day on the digital footprint. “Everything you post leaves a trace,” she said. “A screenshot can be saved by anyone, even if you delete the message. A rumour can follow a person for years. Hurtful posts can break school rules and, in serious cases, may break the law. And the person who forwards it is part of the harm, not just the person who started it.”', 'A teacher points to a diagram of a footprint with arrows showing how a message spreads.'),
      pg('🤝', 'After class, Evelyn walked to Lordina’s desk. “I saw the rumour,” she said. “I did not share it, and I do not believe it. I am sorry it happened.” Lordina’s eyes filled again. “Thank you,” she whispered. “I thought everyone hated me.” Evelyn sat beside her. “Not everyone,” she said. “Let us tell Madam Torgbor together.”', 'Two girls sit together at a desk, one comforting the other.'),
      pg('📣', 'Madam Torgbor listened and kept the girls’ names private. She asked the class to stop the chat and delete the rumour, and she met the head teacher and the parents. A few students who had joked in the chat apologised. “Rules about phones differ from school to school,” she said, “but kindness is the same everywhere.” Evelyn felt something heavy lift off her chest.', 'A teacher speaks gently to two girls in a quiet office while a phone lies face down.'),
      pg('✉️', 'Evelyn wrote to Lordina, with her address and the date at the top. “House 8, Mill Road, Kpando. 4th April, 2027. Dear Lordina, I hope you are feeling better. I am sorry that you were hurt by the messages in the class chat. I should have spoken up sooner, and I am sorry I did not. I admire how strong you have been. Please let me know if there is anything I can do to help. Your friend, Evelyn.”', 'A girl writes an apology letter with a phone switched off beside her.'),
      pg('✅', 'Exam-safe tip: an apology letter should be sincere, specific and written in full words. Evelyn named what had happened and what she would do differently. She did not write “sorry” on its own, and she did not use a chat shortcut such as “sry”. Real feelings need real words. The end.', 'Two girls read a letter together with a tick beside the full, kind words.'),
    ],
    activities: [
      { id: 'pau-c1', type: 'comprehension', afterPage: 3, question: 'What are the three questions to ask before posting?', options: ['Is it true, is it kind, is it necessary?', 'Is it funny, is it fast, is it free?', 'Is it popular, is it new, is it long?'], correctIndex: 0 },
      { id: 'pau-p1', type: 'prediction', afterPage: 5, prompt: 'Evelyn tells Lordina she does not believe the rumour. What might happen?', options: ['They go to the teacher together', 'They ignore it', 'They start a new rumour'] },
      { id: 'pau-c2', type: 'comprehension', afterPage: 7, question: 'What makes Evelyn’s apology sincere?', options: ['She names what happened and what she will do differently', 'She writes only “sorry”', 'She uses a chat shortcut'], correctIndex: 0 },
      { id: 'pau-voc', type: 'vocabulary', afterPage: 4, word: 'rumour', definition: 'A story passed around that may not be true.', distractors: ['A proven fact', 'A school rule'] },
      { id: 'pau-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['A rumour spreads in the chat.', 'Evelyn pauses and does not forward it.', 'Evelyn and Lordina tell the teacher.', 'Evelyn writes a sincere letter.'] },
      { id: 'pau-sel', type: 'sel', afterPage: 8, prompt: 'Doing the right thing when others do not is hard. How does that feel?', feelingOptions: ['Nervous', 'Brave', 'Relieved', 'Proud'] },
    ],
    glossary: [
      { word: 'rumour', definition: 'A story passed around that may not be true.', pages: [4] },
      { word: 'forward', definition: 'To send on a message you received to someone else.', pages: [1] },
      { word: 'footprint', definition: 'The trace you leave online by what you post.', pages: [4] },
      { word: 'screenshot', definition: 'A picture of what is on a screen.', pages: [4] },
      { word: 'sincere', definition: 'Honest and meant from the heart.', pages: [8] },
    ],
    culturalNotes: ['The school, students and teacher are invented. No real message, platform or person is shown.', 'Phone and chat rules differ from school to school and from family to family; the story keeps to the kindness principle.', 'The letter on page 7 is exam-safe: full words, a clear reason and specific actions.'],
    reviewQuestions: ['Check the digital-footprint and law statements against current Ghanaian guidance (for example the Cybersecurity Act and school child-protection policy) with a qualified person before quoting.', 'Check that the story does not blame the victim and that it points to trusted adults and school policy.', 'Check the apology letter against the BECE marking scheme.'],
    guide: {
      overview: 'A story about rumours, group chats and the pause before you post. It teaches kindness, the digital footprint and the value of a sincere apology, with an exam-safe letter.',
      lessonMinutes: 40,
      goals: ['Apply the three questions before posting.', 'Explain what a digital footprint is.', 'Write a sincere apology letter in full words.'],
      subjects: [['Information and Communication Technology', 'Digital citizenship'], ['Guidance and Counselling', 'Kindness and bullying'], ['English Language', 'Letters of apology']],
      before: ['Ask: have you ever seen a rumour spread? How did it feel?'],
      during: ['At page 2, pause the story and ask learners to answer the three questions about a sample message.'],
      after: ['Write an apology letter for an imaginary mistake.', 'Create a class “pause poster” with the three questions.'],
      discussion: ['Who is responsible when a rumour is forwarded?', 'How can you support someone who has been targeted?'],
      reflection: ['What will you do the next time you receive a hurtful message?'],
      support: ['Give learners a sentence bank for apologies: I am sorry that… I should have… In future I will…'],
      stretch: ['Draft a short class charter for respectful group chats.'],
      localise: ['Use your school’s real phone and chat rules. Provide the name of a trusted adult in your school for reporting.'],
      factCheck: [
        { claim: 'Messages and screenshots can be saved and shared by others even after deletion, and serious online harassment can break school rules and the law.', explanation: 'A general digital-safety principle; local legal wording must be confirmed.', reference: 'Review with the ICT teacher and the school’s child-protection policy; add a named Ghanaian source.' },
      ],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'dear-madam-not-dear-cousin',
    title: 'Dear Madam, Not Dear Cousin',
    summary: 'Class 3 wants a museum trip, and Regina offers to write to the headmistress. Her first draft sounds like a message to her cousin. With her teacher she learns the formal letter: addresses, date, heading, purpose, request, “Yours faithfully”. A funny, practical story about choosing the right voice for the right reader.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['educational', 'school-life', 'humour'],
    themes: ['school', 'community', 'citizenship'],
    objectives: ['author-purpose', 'vocabulary', 'critical-thinking', 'reading-comprehension'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Cheerful and precise, slower at the parts of the formal letter',
    palette: ['#1d4ed8', '#e11d48'],
    voice: 'Lively student voices; a patient, amused voice for Mr Allotey, the English teacher',
    characters: [
      'Regina: a 14-year-old girl in glasses, with a draft letter in her hand and a pencil behind her ear.',
      'Mr Allotey: the English teacher, in a patterned shirt, with a red pen and a chart of a formal letter.',
      'Madam Gyamera: the headmistress, in a smart dress, behind a large desk with a school stamp.',
      'The class: thirty students in uniform, holding a poster with “Museum Trip?” in bold letters.',
    ],
    music: 'Light, bright marimba with a brisk office-bell chime; a satisfied close (placeholder)',
    pages: [
      pg('🏛️', 'Class 3 wanted to visit the regional museum to see old drums, cloth and tools. “Somebody must write to the headmistress,” said the class prefect. Everyone turned to Regina, who was good at English. “Me?” she said. “Fine, I will.” That evening, she wrote a letter in the same friendly way she wrote to her cousin: “Hi Madam, we really want to go to the museum, please let us go, it will be so fun.”', 'A girl writes a casual letter at a desk while classmates hold a poster saying museum trip.'),
      pg('🖍️', 'Mr Allotey read her draft and raised an eyebrow. “It is warm and honest,” he said. “But this is a letter to the headmistress. It is a formal letter. The reader is important, and she does not know you well. Informal letters are for family and friends. Formal letters are for officials, offices and requests.” Regina looked at her draft. “So I have to start again?” she asked. “You have to dress it for the occasion,” said Mr Allotey.', 'A teacher holds a marked draft with red circles while a girl watches.'),
      pg('📍', 'He pinned a chart on the board. “First, your own address at the top right, then the date under it. Below that, on the left, the receiver’s designation and full address: The Headmistress, then the school name, box number and town. Then the salutation: ‘Dear Madam,’. Notice there is no first name. We use ‘Dear Madam’ or ‘Dear Sir’ for an office holder.”', 'A chart on a board showing a formal letter with the sender address, date and receiver address labelled.'),
      pg('📌', '“Next comes the subject heading,” said Mr Allotey. “It tells the reader the purpose before she starts. For example: REQUEST FOR PERMISSION TO VISIT THE REGIONAL MUSEUM. Write it in capital letters and underline it.” Regina wrote it down. “And the body?” she asked. “Three small paragraphs,” he said. “Why you are writing, the details with reasons, and what you are asking for. Your language must be polite, clear and persuasive, so that the reader wants to say yes. And no contractions: write ‘do not’, never ‘don’t’.”', 'A student writes a capitalised subject heading on a page with a ruler underline.'),
      pg('📄', 'Regina began again. “I am writing on behalf of Class 3 to request permission for a one-day educational visit to the regional museum. The visit will link to our Social Studies lessons on culture and history. The visit will help us to understand our heritage, and it will cost parents very little. We propose to travel on a Friday with two teachers, and parents will be informed in writing. We shall be grateful for your kind consideration.” Mr Allotey read it slowly and nodded.', 'A girl writes the body of a formal letter as a teacher reads over her shoulder.'),
      pg('🖊️', '“Now the closing,” said Mr Allotey. “If you started with ‘Dear Madam’, you end with ‘Yours faithfully’. If you had begun with a name, such as ‘Dear Madam Gyamera’, you would end with ‘Yours sincerely’. Then your signature, and below it your full name and class. No kisses, no ‘Your friend’, no nickname.” Regina giggled. “So it is the opposite of Dear Cousin,” she said. “Exactly,” said Mr Allotey.', 'A girl signs a formal letter with a full name and class below the closing.'),
      pg('✅', 'The headmistress, Madam Gyamera, read the letter and smiled. “A clear, polite request,” she said. “Permission granted, with two conditions: signed parent slips and a short report afterwards.” The class cheered. On the museum trip, Regina stood in front of a drum older than her grandmother. “Dear Cousin, wait until I tell you about this,” she whispered. Then she grinned. “That is the informal letter, for tonight.”', 'A headmistress hands a signed letter to a girl, and then the class stands in a museum before an old drum.'),
      pg('📝', 'Exam-safe tip: before you write any letter, ask who the reader is and what you want. A friend or relative gets an informal letter: your address, the date, “Dear” and a first name, an introduction, a body, a friendly conclusion and a close such as “Yours ever”. An official gets a formal letter with all eight features: your address, the date, the receiver’s designation and full address, “Dear Sir/Madam”, a heading, “Yours faithfully”, your signature and your full name. Some school materials allow contractions such as “won’t” in informal letters, but a formal letter never does. The end.', 'A girl and her teacher sit with two letters side by side, one informal and one formal.'),
    ],
    activities: [
      { id: 'dm-c1', type: 'comprehension', afterPage: 3, question: 'Why is Regina’s first draft not suitable for the headmistress?', options: ['It is informal and the reader is an official', 'It is too long', 'It has no date'], correctIndex: 0 },
      { id: 'dm-p1', type: 'prediction', afterPage: 5, prompt: 'The letter starts “Dear Madam”. How should it end?', options: ['Yours faithfully', 'Yours sincerely, with a first name', 'Love from'] },
      { id: 'dm-c2', type: 'comprehension', afterPage: 7, question: 'What two questions should you ask before writing a letter?', options: ['Who is the reader and what do I want?', 'How long and how fast?', 'Which pen and which paper?'], correctIndex: 0 },
      { id: 'dm-voc', type: 'vocabulary', afterPage: 4, word: 'formal', definition: 'Polite and careful in style, used with officials and strangers.', distractors: ['Relaxed and chatty', 'Very short'] },
      { id: 'dm-s1', type: 'sequencing', prompt: 'Put the formal letter parts in order.', items: ['Sender’s address and date', 'Receiver’s designation and address', 'Salutation and heading', 'Body, “Yours faithfully”, signature and full name'] },
      { id: 'dm-sel', type: 'sel', afterPage: 8, prompt: 'Asking an important person for something can feel scary. How do you feel?', feelingOptions: ['Nervous', 'Prepared', 'Confident', 'Curious'] },
    ],
    glossary: [
      { word: 'headmistress', definition: 'The woman in charge of a school.', pages: [1, 7] },
      { word: 'formal', definition: 'Polite and careful in style, used with officials.', pages: [2] },
      { word: 'permission', definition: 'Approval to do something.', pages: [4, 7] },
      { word: 'heading', definition: 'A title that tells the reader what a letter is about.', pages: [4] },
      { word: 'consideration', definition: 'Careful thought about a request.', pages: [5] },
    ],
    culturalNotes: ['The school, people and museum are invented. Many Ghanaian schools arrange educational visits with permission from the head and parents.', 'The formal-letter layout shown is a common pattern in Ghanaian English teaching. Check the exact layout (alignment, punctuation, subject heading) against the current BECE marking scheme and the NaCCA syllabus.', 'The informal “Dear Cousin” line on page 7 is spoken, not written; chat-style phrases appear only in Regina’s first draft as a labelled mistake.'],
    reviewQuestions: ['Check the whole formal-letter layout and the “Yours faithfully / Yours sincerely” rule against the current BECE marking scheme and NaCCA syllabus.', 'Check that the chat-style first draft (“Hi Madam”, “so fun”) is clearly labelled as an unsuitable style for a formal letter.', 'Check that the story works for learners in schools that cannot afford trips; adapt to a local walk or a virtual visit.'],
    guide: {
      overview: 'A story that contrasts an informal letter with a formal letter through a request to a headmistress. It teaches layout, tone and the question “Who is my reader?”',
      lessonMinutes: 45,
      goals: ['Name the parts of a formal letter and put them in order.', 'Match “Dear Sir/Madam” with “Yours faithfully”.', 'Choose formal or informal style for a reader.'],
      subjects: [['English Language', 'Formal letters'], ['Social Studies', 'Communication in the community'], ['Creative Arts', 'Designing a letterhead']],
      before: ['Ask: would you speak to a head teacher the same way as to a cousin? Why not?'],
      during: ['At page 3, ask learners to label each part on a letter template.'],
      after: ['Write a formal letter to the head teacher requesting permission for a school event.', 'Rewrite Regina’s first draft in formal style.'],
      discussion: ['What makes a request polite and clear?', 'Who else might you write a formal letter to, and why?'],
      reflection: ['What is one thing you would like to ask for by letter?'],
      support: ['Provide a labelled formal letter frame with boxes.'],
      stretch: ['Write an informal and a formal letter about the same event and compare the vocabulary.'],
      localise: ['Use real local places for trips and your school’s real approval steps. Include no-cost alternatives.'],
      factCheck: [
        { claim: 'A formal letter has the writer’s address, the date, the recipient’s designation and full address, “Dear Sir/Madam”, a title or heading, “Yours faithfully/Yours sincerely”, the writer’s signature and full name; the language must be polite, clear and persuasive with no contractions, slang or colloquialism.', explanation: 'From the organisation, expression and mechanical-accuracy criteria for formal letters and essays supplied by the project owner; the informal-letter features come from the NaCCA lesson.', reference: 'Project-owner marking guidance (organisation, expression, mechanical accuracy); NaCCA English Language LM Year 1 Section 15 (curriculumresources.edu.gh). Verify against the current official marking scheme.' },
      ],
    },
  }),

  // 8 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-last-bell-before-bece',
    title: 'The Last Bell Before BECE',
    summary: 'It is the last week of Form 3. Clement Duodu packs his pens, Harriet checks her index number twice, and everyone signs everyone’s shirts. A warm, funny story about nerves, exam-day habits, saying thank you and saying goodbye, with an exam-safe farewell letter to a favourite teacher.',
    classIds: ['jhs-3'],
    ageMin: 14,
    ageMax: 16,
    readingLevel: 'proficient',
    difficulty: 3,
    genres: ['realistic-fiction', 'school-life', 'drama'],
    themes: ['school', 'friendship', 'new-beginnings'],
    objectives: ['perseverance', 'emotional-intelligence', 'responsibility', 'author-purpose'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Warm and a little emotional, steady at the exam morning',
    palette: ['#be123c', '#fbbf24'],
    voice: 'Excited, nervous, then fond student voices; a kind, proud voice for Mr Anan',
    characters: [
      'Clement Duodu: a 15-year-old boy in a white shirt covered in felt-pen signatures, with a clear pencil case.',
      'Harriet Sarfo: a 15-year-old girl, his classmate, with an examination slip and a neat file.',
      'Mr Anan: the form master, in a short-sleeved shirt, wiping his glasses.',
      'The classroom: an empty JHS 3 room on the last afternoon, with a faded chart and a chalkboard that says “Good luck, Form 3”.',
    ],
    music: 'Gentle, nostalgic guitar with a distant school bell; an uplifting, hopeful tune at the end (placeholder)',
    pages: [
      pg('🔔', 'It was the last week of Form 3. The corridors felt different, quieter and louder at once. Teachers smiled more than usual. In a few days, the Basic Education Certificate Examination would begin. “It feels like the end of the world,” said Harriet. “It is the end of a chapter,” said Mr Anan, the form master, “not the end of the story.”', 'Students stand in a quiet corridor with posters on the wall and the form master smiling.'),
      pg('🎒', 'Mr Anan gave the class a checklist for exam day. “Check your index number the night before. Pack two blue or black pens, a pencil, an eraser, a ruler and a mathematical set. Sleep early. Eat breakfast. Arrive early. Switch off and hand in anything the rules say you may not carry. And breathe.” Clement wrote it all down. He wrote “breathe” in capitals.', 'A teacher lists exam-day items on a board while students copy into notebooks.'),
      pg('😰', 'The night before, Harriet checked her examination slip three times. Clement packed his bag, unpacked it and packed it again. His younger sister watched, amused. “You are nervous,” she said. “A little,” said Clement. “A lot.” She handed him a drink and a biscuit. “Do your best,” she said. “That is all anybody can ask.”', 'A boy repacks a school bag at night while his younger sister brings him a drink.'),
      pg('📝', 'On the first morning, Clement arrived early. The hall was quiet, the desks neat. He sat with his pen in hand as the invigilator read the instructions. “Read every question carefully,” said the invigilator. “Plan your time. Write your index number on every sheet. When time is called, stop writing.” Clement’s heart pounded. Then he opened the paper, took a breath and began.', 'A boy sits at an exam desk with a pen as an invigilator reads instructions at the front.'),
      pg('✍️', 'On the last day of the exams, the students poured out of the hall in a wave of laughter and relief. Someone pulled out a felt pen. Soon every white shirt was covered in messages: “Good luck!”, “Never forget us”, “Best of friends”. Mr Anan reminded them: “Write kind words only. A memory should make people smile.” Clement’s shirt filled with names, and his eyes grew misty.', 'Students in white shirts sign each other’s sleeves with felt pens in a school yard.'),
      pg('🎓', 'Clement and Harriet went back to the classroom to find Mr Anan. The chalkboard still read “Good luck, Form 3.” “Thank you, sir,” said Harriet. “You taught us more than lessons.” Mr Anan wiped his glasses. “You taught me too,” he said. “Whatever your results, remember this: you are more than a score.” Harriet smiled. “We will visit,” she said. “Please do,” he said.', 'A boy and a girl speak to a teacher in an empty classroom with a chalkboard behind them.'),
      pg('✉️', 'That evening, Clement wrote to Mr Anan. Because his teacher was an older person he knew, he wrote a semi-formal letter, with his address and the date at the top. “House 5, Forest Road, Techiman. 18th June, 2027. Dear Mr Anan, I hope you are well. I am writing to thank you for everything you have done for our class. You taught us to read, to reason and to believe in ourselves. I will always remember your kindness and your patience. I hope to visit the school when I begin senior high school. Yours sincerely, Clement Duodu.”', 'A boy writes a thank-you letter at a desk with his signed white shirt folded beside him.'),
      pg('✅', 'Exam-safe tip: a farewell letter can mix warm feeling with polite language. Clement used “Dear Mr Anan” and “Yours sincerely”, because he knew the name, and he gave a specific reason to thank his teacher. He wrote “thank you” and “I will always remember”, not “thx” or “miss u”. Good luck to every Form 3 learner. The end.', 'A boy and his teacher read a farewell letter with a tick beside the full, warm words.'),
    ],
    activities: [
      { id: 'bece-c1', type: 'comprehension', afterPage: 3, question: 'What does Mr Anan advise students to bring and do on exam day?', options: ['Check the index number, pack two pens and sleep early', 'Stay up all night', 'Bring a phone'], correctIndex: 0 },
      { id: 'bece-p1', type: 'prediction', afterPage: 5, prompt: 'After the last paper, students sign each other’s shirts. What does Mr Anan say?', options: ['Write kind words only', 'Write anything', 'Do not sign'] },
      { id: 'bece-c2', type: 'comprehension', afterPage: 7, question: 'Why does Clement end his letter with “Yours sincerely”?', options: ['He knows the teacher’s name', 'He does not know the teacher', 'He is writing to a cousin'], correctIndex: 0 },
      { id: 'bece-voc', type: 'vocabulary', afterPage: 4, word: 'invigilator', definition: 'A person who supervises students during an examination.', distractors: ['A student who copies', 'A cleaner'] },
      { id: 'bece-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Mr Anan gives an exam-day checklist.', 'Clement packs his bag the night before.', 'Clement sits the first paper.', 'Students sign shirts and Clement writes to Mr Anan.'] },
      { id: 'bece-sel', type: 'sel', afterPage: 8, prompt: 'Saying goodbye to a school is hard. How do you feel when a chapter ends?', feelingOptions: ['Sad', 'Grateful', 'Excited', 'Nervous'] },
    ],
    glossary: [
      { word: 'checklist', definition: 'A list of things to check or tick off.', pages: [2] },
      { word: 'invigilator', definition: 'A person who supervises an examination.', pages: [4] },
      { word: 'examination', definition: 'A formal test of what you have learned.', pages: [1, 3] },
      { word: 'relief', definition: 'A feeling of comfort after worry.', pages: [5] },
      { word: 'misty', definition: 'Filled with tears.', pages: [5] },
    ],
    culturalNotes: ['The students and teacher are invented. The story shows a general BECE-week mood; check the current exam rules (items allowed, timings and index-number procedures) with the school and examining body.', 'Signing school shirts at the end of exams is a common tradition; schools differ in how they allow it. The story encourages kind messages only.', 'The letter on page 7 is exam-safe: “Dear Mr Anan”, “Yours sincerely”, full words and a specific reason for thanks.'],
    reviewQuestions: ['Check the exam-day checklist (two pens, pencil, ruler, mathematical set, index number) against the current WAEC BECE instructions for candidates.', 'Check that the story does not encourage defacing school property and that school policy on shirt signing is respected.', 'Check the farewell letter against the BECE marking scheme; the letter is a semi-formal thank-you.'],
    guide: {
      overview: 'A story about the last week before the BECE: nerves, exam-day habits, thanks and goodbyes. It models a warm, exam-safe farewell letter to a teacher.',
      lessonMinutes: 40,
      goals: ['Make a personal exam-day checklist.', 'Describe ways to manage exam nerves.', 'Write a thank-you letter to a teacher with a specific reason.'],
      subjects: [['Guidance and Counselling', 'Exam readiness and feelings'], ['English Language', 'Thank-you and farewell letters'], ['Social Studies', 'Transition to senior high school']],
      before: ['Ask: what is one thing you would like to thank a teacher for?'],
      during: ['At page 2, ask learners to add items to the checklist from the current exam instructions.'],
      after: ['Write a farewell letter to a teacher or friend.', 'Make a poster with five calm exam-day habits.'],
      discussion: ['Why do we feel nervous before exams? What helps?', 'How can we say goodbye kindly?'],
      reflection: ['What would you like to be remembered for in this school?'],
      support: ['Provide a checklist template and a thank-you letter frame.'],
      stretch: ['Write a short farewell speech for your class.'],
      localise: ['Use your examining body’s real instructions and your school’s real traditions for the last day.'],
      factCheck: [
        { claim: 'Candidates should check the index number, bring the permitted stationery, arrive early and follow the invigilator’s instructions; the exact allowed items must be checked against the current WAEC BECE instructions.', explanation: 'General exam-day practice; specific rules change and should be confirmed before use.', reference: 'WAEC Ghana, BECE instructions to candidates (waecgh.org); verify the current wording.' },
      ],
    },
  }),
];
