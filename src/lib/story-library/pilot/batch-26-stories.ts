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
      subjectLinks: g.subjects.map(([subject, link]) => ({ subject, link, status: 'approved' as const })),
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
 * Batch 26: Little ones, safe and curious. Eight short, simple stories for nursery to primary 4 on safety and
 * health habits (sleeping under a net, crossing the road, brushing teeth, power cuts), starting school, sharing,
 * reusing plastic bottles, and asking "why" with a fair test.
 *
 * Rules: as Batches 13 to 25. All children, families and animals are invented. Facts are basic and widely taught;
 * reviewers should confirm each fact in the review questions. Safety first. All stories are drafts awaiting review.
 */

export const BATCH_26_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'zenabus-net-night',
    title: 'Zenabu’s Net Night',
    summary: 'Zenabu hears a mosquito at bedtime and wants to hide under her blanket. Mama hangs the net, tucks in the edges and explains that the net keeps biting mosquitoes out. A bedtime rhyme about sleeping under a mosquito net.',
    classIds: ['nursery-2', 'kg-1'],
    ageMin: 3,
    ageMax: 5,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['bedtime', 'educational', 'family'],
    themes: ['health-and-wellbeing', 'family', 'helping-others'],
    objectives: ['oral-language', 'sequencing', 'responsibility', 'vocabulary'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names'],
    wpm: 85,
    paceWord: 'Slow and sleepy, with a soft buzz on the mosquito lines',
    palette: ['#4f46e5', '#fde68a'],
    voice: 'A soft, sleepy storyteller voice, with a gentle, loving mother',
    characters: [
      'Zenabu: a girl of four with short plaits, a patterned nightdress and a teddy.',
      'Mama: Zenabu’s mother, in a wrapper, tying a white net above the bed.',
      'The mosquito: a tiny mosquito with long legs and thin wings, drawn small and not scary.',
    ],
    music: 'A soft lullaby with a tiny high buzz (placeholder)',
    pages: [
      pg('🌙', 'It was bedtime. The moon was out. Zenabu got into bed with her teddy.', 'A girl in a nightdress climbs into bed with a teddy.'),
      pg('🦟', 'Then she heard it. Zzzz, zzzz! A mosquito! ‘I will hide under my blanket,’ said Zenabu.', 'A girl peeks from under a blanket as a tiny mosquito flies near.'),
      pg('👩', '‘Wait,’ said Mama. ‘Mosquitoes bite at night. Some carry germs that make people ill with malaria. We have a better way.’', 'A mother holds up a folded white net in the bedroom.'),
      pg('🛏️', 'Mama hung the net over the bed. It was like a soft, white tent. ‘This is your mosquito net,’ she said.', 'A mother hangs a white net like a tent over a bed.'),
      pg('🤏', 'Mama tucked the edges under the mattress. ‘No gaps,’ she said. ‘No holes. Then the mosquito cannot get in.’', 'A mother tucks the edges of a net under a mattress.'),
      pg('😴', 'Zenabu looked up. The mosquito went zzzz, but it could not get through the net. ‘Goodnight, mosquito,’ she said.', 'A mosquito sits on the outside of the net while a girl lies safe inside.'),
      pg('🤧', '‘If you feel hot or ill, tell me,’ said Mama. ‘We will go to the clinic.’ Zenabu nodded and hugged her teddy.', 'A mother kisses her daughter’s forehead through the net.'),
      pg('⭐', 'Zenabu closed her eyes. Safe under the net, she slept all night. The end.', 'A girl sleeps peacefully under a white net, with the moon outside.'),
    ],
    activities: [
      { id: 'net-c1', type: 'comprehension', afterPage: 3, question: 'When do mosquitoes bite, says Mama?', options: ['At night', 'Only at lunch', 'Never'], correctIndex: 0 },
      { id: 'net-p1', type: 'prediction', afterPage: 5, prompt: 'Mama tucks the edges in. Why? Tell a friend.', options: ['So no mosquito can get in', 'To make the bed fancy'] },
      { id: 'net-ph', type: 'phonics', afterPage: 6, targetSound: 'n', prompt: 'Which words start with the n sound, like net?', options: ['net', 'night', 'bed', 'nod'], correctIndexes: [0, 1, 3] },
      { id: 'net-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Zenabu hears a mosquito.', 'Mama hangs the net.', 'Mama tucks in the edges.'] },
      { id: 'net-sel', type: 'sel', afterPage: 8, prompt: 'Zenabu felt safe under her net. How do you feel when you are safe at night?', feelingOptions: ['Safe', 'Sleepy', 'Happy', 'Loved'] },
    ],
    glossary: [
      { word: 'mosquito', definition: 'A tiny flying insect that bites.', pages: [2, 6] },
      { word: 'malaria', definition: 'An illness that some mosquitoes can spread when they bite.', pages: [3] },
      { word: 'net', definition: 'A thin cloth with small holes that hangs over a bed.', pages: [4, 6] },
    ],
    culturalNotes: ['Zenabu and Mama are invented. The story models sleeping under a mosquito net with the edges tucked in, and telling an adult if a child feels hot or ill.', 'Malaria is spread by the bite of some mosquitoes, mostly at night. The story names it once and does not give figures or describe symptoms. A sick child needs a health worker, and the story says so.'],
    reviewQuestions: ['Have a community health nurse check the statements about mosquitoes, malaria and tucking in the net, and the advice to tell an adult and go to the clinic.', 'Check that the story does not suggest that a net replaces treatment.'],
    guide: {
      overview: 'A bedtime story that teaches children to sleep under a net and to tell an adult when they feel ill.',
      lessonMinutes: 20,
      goals: ['Say why we sleep under a net.', 'Say what to do if you feel ill.', 'Say the story in order.'],
      subjects: [['Health Habits', 'Staying healthy'], ['Language and Literacy', 'Listening and sequencing']],
      before: ['Ask: where do you sleep? Do you have a net?'],
      during: ['Buzz very softly on the mosquito pages and whisper on the sleepy pages.'],
      after: ['Act out hanging and tucking in a net with a cloth and a chair.', 'Tell children to tell an adult if they feel hot or ill.'],
      discussion: ['Why did Mama tuck in the edges?', 'What should you do if you feel hot?'],
      reflection: ['Who helps you to stay safe at night?'],
      support: ['Use a cloth, a doll and a small bed to show the steps.'],
      stretch: ['Teach a friend the steps in the right order.'],
      localise: ['Use the local word for net. Remind children that adults should check nets for holes.'],
      factCheck: [{ claim: 'Some mosquitoes bite at night and can spread malaria; sleeping under a net with no gaps helps protect against bites.', explanation: 'Standard public-health guidance.', reference: 'World Health Organization or Ghana Health Service malaria prevention guidance (to verify).' }],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'stop-look-listen',
    title: 'Stop, Look, Listen!',
    summary: 'Odarkor sees an ice cream seller on the other side of the road and wants to run. His big sister Adjeley holds his hand and teaches him to stop, look both ways, listen, and cross only when the road is clear. A rhythm story about road safety.',
    classIds: ['nursery-2', 'kg-1'],
    ageMin: 3,
    ageMax: 5,
    readingLevel: 'pre-reader',
    difficulty: 1,
    genres: ['educational', 'rhyme', 'family'],
    themes: ['health-and-wellbeing', 'family', 'community'],
    objectives: ['oral-language', 'sequencing', 'responsibility', 'vocabulary'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names'],
    wpm: 85,
    paceWord: 'Rhythmic and clear, with a steady beat on “Stop, Look, Listen”',
    palette: ['#dc2626', '#16a34a'],
    voice: 'A cheerful big sister’s voice, with an excited little boy',
    characters: [
      'Odarkor: a boy of four with round cheeks, a red T-shirt and shorts, with a bobbing head of curls.',
      'Adjeley: his sister, aged ten, in a school uniform, holding his hand.',
      'The road: a busy road with a zebra crossing, a bus, a taxi and a motorbike, drawn with a pavement on each side.',
    ],
    music: 'A bouncy beat with hand claps and a bell on every “Stop” (placeholder)',
    pages: [
      pg('🍦', 'Odarkor and his sister Adjeley walked along the pavement. ‘Look!’ said Odarkor. ‘An ice cream seller!’ The seller was across the road.', 'Two children walk on a pavement and a boy points at an ice cream seller across the road.'),
      pg('🏃', 'Odarkor wanted to run. ‘Wait!’ said Adjeley. She held his hand tight. ‘Cars and buses are fast. We must be careful.’', 'A girl holds her little brother’s hand as a bus drives by.'),
      pg('🛑', '‘Stop!’ said Adjeley. They stood still at the edge of the road. Odarkor put his feet together. Stop, stop, stop!', 'Two children stand still at the kerb with their toes on the line.'),
      pg('👀', '‘Look!’ said Adjeley. They looked one way. Then the other way. A taxi went by. A motorbike went by. ‘Not yet,’ she said.', 'Two children turn their heads to look both ways as a taxi passes.'),
      pg('👂', '‘Listen!’ said Adjeley. They listened with their big ears. Honk! Honk! A bus was coming. ‘Wait,’ said Odarkor.', 'Two children cup their ears as a bus approaches.'),
      pg('🚶', 'The bus went past. The road was quiet. ‘Now we can go,’ said Adjeley. They walked, they did not run, and they kept holding hands.', 'Two children walk across a zebra crossing holding hands.'),
      pg('🎶', 'They got to the other side. ‘Stop, look, listen,’ sang Odarkor. ‘Stop, look, listen!’ Adjeley smiled. ‘Well done!’', 'Two children sing on the pavement on the far side of the road.'),
      pg('🍨', 'Odarkor got his ice cream. ‘I always hold a grown-up’s hand,’ he said. ‘And I stop, look and listen.’ The end.', 'A boy holds an ice cream cone and smiles beside his sister.'),
    ],
    activities: [
      { id: 'road-c1', type: 'comprehension', afterPage: 2, question: 'What did Adjeley hold tight?', options: ['Odarkor’s hand', 'A bag', 'A ball'], correctIndex: 0 },
      { id: 'road-p1', type: 'prediction', afterPage: 5, prompt: 'A bus is coming. What should the children do? Tell a friend.', options: ['Wait', 'Run'] },
      { id: 'road-ph', type: 'phonics', afterPage: 6, targetSound: 's', prompt: 'Which words start with the s sound, like stop?', options: ['stop', 'sister', 'taxi', 'sing'], correctIndexes: [0, 1, 3] },
      { id: 'road-s1', type: 'sequencing', prompt: 'Put the crossing in order.', items: ['Stop at the edge.', 'Look both ways.', 'Listen.', 'Walk across holding hands.'] },
      { id: 'road-sel', type: 'sel', afterPage: 8, prompt: 'Odarkor waited and stayed safe. How do you feel when you stay safe?', feelingOptions: ['Safe', 'Proud', 'Patient', 'Happy'] },
    ],
    glossary: [
      { word: 'pavement', definition: 'The path beside a road where people walk.', pages: [1] },
      { word: 'careful', definition: 'Thinking about danger and being safe.', pages: [2] },
      { word: 'listen', definition: 'To use your ears to hear.', pages: [5] },
    ],
    culturalNotes: ['Odarkor and Adjeley are invented. The story teaches a simple crossing routine: stop at the edge, look both ways, listen, wait until the road is clear, walk (do not run) and hold a grown-up’s hand.', 'The story does not say which way to look first, so that it is correct wherever children live. Teachers should practise the routine at a real, safe crossing with an adult and point out zebra crossings, pavements and lights where they exist.', 'The story does not show any child crossing alone.'],
    reviewQuestions: ['Have a road safety officer check that the routine (stop, look both ways, listen, wait, walk, hold a hand) is correct for Ghana and for this age group.', 'Check that a child of ten is shown as a helper and not as a replacement for an adult for young children.'],
    guide: {
      overview: 'A rhythm story that teaches a simple road-crossing routine. Children say and act out “Stop, look, listen”.',
      lessonMinutes: 20,
      goals: ['Say the three steps of crossing safely.', 'Say why we hold a grown-up’s hand.', 'Join in a short chorus.'],
      subjects: [['Health and Safety', 'Road safety'], ['Language and Literacy', 'Rhythm and sequencing']],
      before: ['Ask: how do you get to school? Do you cross a road?'],
      during: ['Stamp softly on “Stop”, turn heads on “Look” and cup ears on “Listen”.'],
      after: ['Practise with a floor road, with a “zebra crossing” made of tape, and a toy bus.', 'Walk to a real crossing with adults and practise the routine.'],
      discussion: ['Why did Adjeley say wait?', 'What should you do when you see a bus coming?'],
      reflection: ['Who holds your hand when you cross a road?'],
      support: ['Use picture cards for stop, look and listen.'],
      stretch: ['Draw a road with a safe crossing and label what the children do.'],
      localise: ['Use the crossing, bus or taxi children really see. Never let children practise on a real road without adults.'],
      factCheck: [{ claim: 'Children should stop at the edge of the road, look both ways, listen, wait until it is clear, walk across and hold an adult’s hand.', explanation: 'Standard road-safety guidance for young children.', reference: 'National Road Safety Authority or UNICEF road safety guidance (to verify).' }],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'abibas-first-day',
    title: 'Abiba’s First Day',
    summary: 'Abiba is nervous about her first day at school. She holds her mother’s hand tightly at the gate and sits alone in class. Then a boy called Kwartei shares a crayon, and by home time Abiba has a friend and a song to sing. A story about new beginnings and making friends.',
    classIds: ['kg-2', 'primary-1'],
    ageMin: 5,
    ageMax: 7,
    readingLevel: 'emergent',
    difficulty: 1,
    genres: ['school-life', 'friendship', 'educational'],
    themes: ['school', 'new-beginnings', 'friendship', 'family'],
    objectives: ['emotional-intelligence', 'kindness', 'oral-language', 'vocabulary'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 90,
    paceWord: 'Soft and shy at the start, brightening at the crayon and the song',
    palette: ['#ea580c', '#0ea5e9'],
    voice: 'A shy little girl’s voice for Abiba; a cheerful boy’s voice for Kwartei; a kind, calm teacher',
    characters: [
      'Abiba: a girl of five in a new school uniform and a headscarf, with a school bag that is too big.',
      'Mama: Abiba’s mother, in a long dress and headscarf, holding her daughter’s hand at the gate.',
      'Kwartei: a boy of five, in the same uniform, with a box of crayons.',
      'Madam Aduku: the class teacher, in a bright dress, smiling at the classroom door.',
    ],
    music: 'A gentle, hesitant tune that grows bright at the song (placeholder)',
    pages: [
      pg('🎒', 'It was Abiba’s first day at school. She had a new uniform and a new bag. Her tummy felt wobbly. She felt nervous. ‘What if nobody likes me?’ she whispered.', 'A girl in a new uniform holds her mother’s hand at a school gate.'),
      pg('👩', 'Mama knelt down. ‘Everyone feels a little scared on the first day,’ she said. ‘I will be back at home time.’ She gave Abiba a big hug.', 'A mother kneels and hugs her daughter at the gate.'),
      pg('🏫', 'Madam Aduku met Abiba at the door. ‘Good morning, Abiba,’ she said. ‘We are glad you are here.’ Abiba sat down at a little desk. She did not say a word.', 'A teacher welcomes a shy girl at a classroom door.'),
      pg('😟', 'Everyone else seemed to know somebody. Abiba looked at her hands. She felt very small and alone.', 'A girl sits alone at a desk looking at her hands.'),
      pg('🖍️', 'Then a boy sat down beside her. His name was Kwartei. He had a box of crayons. ‘Do you want to draw with me?’ he asked. ‘You can have the red one.’', 'A boy offers a red crayon to a girl at a shared desk.'),
      pg('🎨', 'Abiba took the red crayon. She drew a house. Kwartei drew a sun. They drew and drew. Abiba smiled a little smile.', 'Two children draw a house and a sun together.'),
      pg('🎵', 'After break, Madam Aduku taught them a song. Abiba sang it too, quietly at first, then louder. She knew all the words by the end.', 'A class sings together while a girl sings loudly and smiles.'),
      pg('🏡', 'At home time, Mama was waiting at the gate. ‘Mama!’ said Abiba. ‘I made a friend! His name is Kwartei. And I know a new song!’ The end.', 'A girl runs to her mother at the school gate with a drawing in her hand.'),
    ],
    activities: [
      { id: 'abiba-c1', type: 'comprehension', afterPage: 4, question: 'How did Abiba feel on her first day at school?', options: ['Nervous', 'Angry', 'Sleepy'], correctIndex: 0 },
      { id: 'abiba-c2', type: 'comprehension', afterPage: 5, question: 'What did Kwartei share with Abiba?', options: ['A red crayon', 'A sweet', 'A ball'], correctIndex: 0 },
      { id: 'abiba-ph', type: 'phonics', afterPage: 6, targetSound: 'sm', prompt: 'Which words start with the sm sound, like smile?', options: ['smile', 'small', 'sun', 'sat'], correctIndexes: [0, 1] },
      { id: 'abiba-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Abiba felt nervous at the gate.', 'Kwartei shared a crayon.', 'Abiba sang a new song.', 'Abiba told Mama about her friend.'] },
      { id: 'abiba-sel', type: 'sel', afterPage: 8, prompt: 'Abiba was nervous and then happy. How do you feel on a first day?', feelingOptions: ['Nervous', 'Excited', 'Shy', 'Brave'] },
    ],
    glossary: [
      { word: 'uniform', definition: 'Clothes that all pupils at a school wear.', pages: [1] },
      { word: 'nervous', definition: 'A little afraid or worried.', pages: [1] },
      { word: 'crayon', definition: 'A coloured stick used for drawing.', pages: [6] },
    ],
    culturalNotes: ['Abiba, Mama, Kwartei and Madam Aduku are invented. The story is set at a primary school gate and classroom and names no real school.', 'The story shows a shy child, a kind child and a welcoming teacher, and normalises feeling nervous. It ends with the child’s mother waiting at home time.'],
    reviewQuestions: ['Check that the story is welcoming to children who start school late or who do not have a parent at the gate, and add notes for teachers where needed.', 'Check that the phonics sound “sch” is acceptable for this level.'],
    guide: {
      overview: 'A gentle story about a first day at school. It helps children talk about feeling nervous and shows a simple act of kindness.',
      lessonMinutes: 25,
      goals: ['Say how Abiba felt and why.', 'Say one kind thing Kwartei did.', 'Retell the story in order.'],
      subjects: [['Language and Literacy', 'Oral language and sequencing'], ['Personal and Social', 'Feelings and friendship']],
      before: ['Ask: how did you feel on your first day at school?'],
      during: ['Use a quiet voice for Abiba on page 4 and a bright voice for Kwartei.'],
      after: ['Draw a picture to share with a new friend.', 'Invite children to say one kind thing they can do for a new child.'],
      discussion: ['How did Kwartei help Abiba?', 'What could you do if a new child came to your class?'],
      reflection: ['What helps you when you feel nervous?'],
      support: ['Use feelings faces to point to how Abiba felt at each page.'],
      stretch: ['Draw a welcome card for a new pupil.'],
      localise: ['Use your school’s real morning routine and song. Be sensitive to children who find school hard or who have no parent to drop them off.'],
      factCheck: [{ claim: 'Many children feel nervous on the first day of school, and a kind act from a classmate or teacher can help.', explanation: 'A common experience in early childhood education.', reference: 'Early childhood education guidance (to verify).' }],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'iddi-and-the-sugar-bugs',
    title: 'Iddi and the Sugar Bugs',
    summary: 'Iddi loves sweets and does not like brushing. When he gets a toothache, a school nurse tells him about the tiny germs in his mouth that love sugar. Iddi learns to brush in the morning and at night, to eat fewer sweets and to visit a dentist. A funny story about looking after your teeth.',
    classIds: ['kg-2', 'primary-1'],
    ageMin: 5,
    ageMax: 7,
    readingLevel: 'emergent',
    difficulty: 1,
    genres: ['educational', 'humour', 'family'],
    themes: ['health-and-wellbeing', 'food', 'school', 'family'],
    objectives: ['responsibility', 'scientific-curiosity', 'sequencing', 'vocabulary'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names'],
    wpm: 90,
    paceWord: 'Playful, with a wince at the toothache and a cheer at the end',
    palette: ['#e11d48', '#38bdf8'],
    voice: 'A cheeky boy’s voice for Iddi; a warm, no-nonsense school nurse’s voice',
    characters: [
      'Iddi: a boy of six with big eyes, a yellow T-shirt and a gap in his front teeth.',
      'Nurse Manu: the school nurse, in a white coat, holding a big toothbrush and a model of a mouth.',
      'The sugar bugs: tiny cartoon germs with silly faces, drawn as friendly and not scary, wearing little party hats.',
    ],
    music: 'A bouncy, comic tune with a drum roll at the toothache (placeholder)',
    pages: [
      pg('🍬', 'Iddi loved sweets. He ate sweets in the morning. He ate sweets after lunch. He ate sweets at night. Yum, yum, yum!', 'A boy happily eats a pile of sweets.'),
      pg('😬', 'But Iddi did not like brushing his teeth. ‘Too boring!’ he said. He ran away from his toothbrush every morning.', 'A boy runs away from a toothbrush held by his mother.'),
      pg('🦷', 'One day, Iddi got a toothache. Ouch! It hurt a lot. ‘Ow, ow, ow!’ he cried. His mother took him to see the nurse at school.', 'A boy holds his cheek and winces in pain.'),
      pg('👩⚕️', 'Nurse Manu looked in Iddi’s mouth. ‘You have a hole in your tooth,’ she said. ‘Tiny germs in your mouth love sugar. They make holes in teeth. Let me show you.’', 'A school nurse points at a model of a mouth with cartoon germs.'),
      pg('🎉', 'She drew little sugar bugs with party hats on the board. ‘They have a party every time you eat sweets,’ she said. ‘And they leave holes in your teeth!’ Iddi’s eyes went wide.', 'Cartoon sugar bugs with party hats dance on a board.'),
      pg('🪥', '‘So what must I do?’ asked Iddi. ‘Brush your teeth in the morning and at night,’ said Nurse Manu. ‘Use a little toothpaste. Brush for about two minutes.’', 'A nurse shows a boy how to brush with a toothbrush.'),
      pg('🍎', '‘And eat fewer sweets,’ she added. ‘Have fruit instead. And see a dentist to check your teeth.’ Iddi nodded. ‘No more party for the sugar bugs!’ he said.', 'A boy holds an apple and waves goodbye to the sugar bugs.'),
      pg('😁', 'Now Iddi brushes every morning and every night. His teeth are clean and shiny. He still likes sweets, but only a few. The end.', 'A boy grins with clean teeth in front of a mirror.'),
    ],
    activities: [
      { id: 'iddi-c1', type: 'comprehension', afterPage: 3, question: 'What happened to Iddi’s tooth?', options: ['It hurt', 'It fell off', 'It turned blue'], correctIndex: 0 },
      { id: 'iddi-c2', type: 'comprehension', afterPage: 6, question: 'When should Iddi brush his teeth?', options: ['Morning and night', 'Only on Sundays', 'Never'], correctIndex: 0 },
      { id: 'iddi-ph', type: 'phonics', afterPage: 6, targetSound: 'br', prompt: 'Which words start with the br sound, like brush?', options: ['brush', 'bug', 'bread', 'bright'], correctIndexes: [0, 2, 3] },
      { id: 'iddi-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Iddi ate lots of sweets.', 'Iddi got a toothache.', 'The nurse explained about sugar bugs.', 'Iddi began to brush every day.'] },
      { id: 'iddi-sel', type: 'sel', afterPage: 8, prompt: 'Iddi changed his habits to look after his teeth. How do you feel about looking after yourself?', feelingOptions: ['Proud', 'Healthy', 'Determined', 'Happy'] },
    ],
    glossary: [
      { word: 'toothache', definition: 'A pain in a tooth.', pages: [3] },
      { word: 'germs', definition: 'Tiny living things too small to see.', pages: [4] },
      { word: 'dentist', definition: 'A person who looks after teeth.', pages: [7] },
    ],
    culturalNotes: ['Iddi, Nurse Manu and the family are invented. The story teaches the habits of brushing in the morning and at night, using a little toothpaste, eating fewer sweets and visiting a dentist.', '“Sugar bugs” is a simple picture for the germs in the mouth that feed on sugar and make acid that damages teeth; the story says “tiny germs”. It does not suggest that sweets are bad in small amounts or that families who cannot afford a dentist are at fault; teachers should be sensitive to this.', 'Some families clean teeth in other ways; teachers should ask local health workers for advice and not criticise a family’s practices.'],
    reviewQuestions: ['Have a dentist or a school health nurse check the explanation of germs and sugar, the brushing advice (morning and night, a little toothpaste, about two minutes) and the sentence about fewer sweets.', 'Check that the story is sensitive to children who do not have easy access to a dentist or toothpaste.'],
    guide: {
      overview: 'A funny story that teaches simple tooth care. It uses cartoon “sugar bugs” to explain why sugar and brushing matter.',
      lessonMinutes: 25,
      goals: ['Say two things that help keep teeth healthy.', 'Say why too many sweets can hurt teeth.', 'Retell the story in order.'],
      subjects: [['Health Habits', 'Caring for the body'], ['Language and Literacy', 'Sequencing and new words']],
      before: ['Ask: what do you do to keep your teeth clean?'],
      during: ['Wince on page 3 and cheer on page 8.'],
      after: ['Practise brushing on a model mouth with a big toothbrush.', 'Make a chart of “fruit and water” snacks.'],
      discussion: ['Why did the nurse draw sugar bugs with party hats?', 'What can Iddi eat instead of sweets?'],
      reflection: ['What is one habit you want to keep every day?'],
      support: ['Use picture cards for brush, toothpaste, fruit and dentist.'],
      stretch: ['Draw a tooth-care poster for the classroom door.'],
      localise: ['Ask a local health worker how families in your area look after their teeth and what a visit to the dentist costs. Do not shame any child for the state of their teeth.'],
      factCheck: [{ claim: 'Germs in the mouth feed on sugar and make acid that damages teeth; brushing twice a day with fluoride toothpaste, eating less sugar and visiting a dentist help to protect teeth.', explanation: 'Standard dental health guidance.', reference: 'World Health Organization or Ghana Health Service oral health guidance (to verify).' }],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-bottle-garden',
    title: 'The Bottle Garden',
    summary: 'Shamsia and her brother Mubarak see empty plastic bottles lying by the roadside. With their uncle’s help, they collect clean bottles from home, turn them into hanging pots and plant seeds. A story about reusing plastic bottles and keeping the place clean.',
    classIds: ['primary-1', 'primary-2'],
    ageMin: 6,
    ageMax: 8,
    readingLevel: 'early',
    difficulty: 2,
    genres: ['educational', 'family', 'realistic-fiction'],
    themes: ['farm-and-garden', 'family', 'community', 'technology'],
    objectives: ['environmental-awareness', 'problem-solving', 'responsibility', 'counting'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'village-life'],
    wpm: 95,
    paceWord: 'Bright and busy, with a satisfied pause at the finished garden',
    palette: ['#0891b2', '#65a30d'],
    voice: 'A bright girl’s voice for Shamsia; a cheerful boy’s voice for Mubarak; a friendly uncle’s voice',
    characters: [
      'Shamsia: a girl of seven with a patterned dress and a headscarf, holding an empty bottle.',
      'Mubarak: her little brother, five, in a green T-shirt and shorts, with a bag of bottles.',
      'Uncle Acheampong: their uncle, in a cap and an apron, holding a pair of scissors and a roll of string.',
      'The bottle garden: five clean plastic bottles cut open and hanging by string from a fence, with small green plants growing from each.',
    ],
    music: 'A bright, playful tune with a clinking rhythm (placeholder)',
    pages: [
      pg('🍶', 'Shamsia and her brother Mubarak walked home from school. By the road, there were empty plastic bottles everywhere. ‘That is a lot of rubbish,’ said Shamsia.', 'Two children walk past a roadside with many plastic bottles lying about.'),
      pg('🤔', '‘Plastic does not rot away fast,’ she said. ‘It stays for a very long time. We should not throw it on the ground.’ ‘Can we use it again?’ asked Mubarak.', 'A girl and her brother look at a bottle in the grass.'),
      pg('👨', 'At home, Uncle Acheampong smiled. ‘Yes,’ he said. ‘We can reuse clean bottles. Let us make a bottle garden.’ He found five clean empty bottles from the house.', 'An uncle holds up five clean empty bottles in the yard.'),
      pg('✂️', 'Uncle Acheampong cut a long window in the side of each bottle. He made small holes in the bottom for water to drain. ‘Children must not use scissors alone,’ he said. ‘Ask a grown-up.’', 'An uncle cuts a bottle with scissors while the children watch from a safe distance.'),
      pg('🪴', 'Shamsia and Mubarak filled each bottle with soil. They pushed in seeds. ‘One, two, three, four, five bottles,’ counted Mubarak. They gave each seed a little water.', 'Children fill bottles with soil and plant seeds while counting.'),
      pg('🔗', 'Uncle Acheampong tied each bottle to the fence with string. Now the garden hung in the sun, a row of little green pots. ‘It looks like a green necklace!’ said Shamsia.', 'Five bottles tied to a fence by string, with small seedlings in each.'),
      pg('💧', 'Every day, they gave their bottle garden a drink. Soon, tiny green shoots peeped out. ‘We made a garden from rubbish!’ said Mubarak.', 'Two children water hanging bottles with tiny green shoots.'),
      pg('🌍', 'From then on, Shamsia put her empty bottles in the bin. ‘Reuse it or bin it,’ she said. ‘Never throw it on the ground.’ The end.', 'A girl drops a bottle into a bin beside the road.'),
    ],
    activities: [
      { id: 'bottle-c1', type: 'comprehension', afterPage: 3, question: 'Who cut the bottles?', options: ['Uncle Acheampong', 'Mubarak', 'Shamsia'], correctIndex: 0 },
      { id: 'bottle-c2', type: 'comprehension', afterPage: 5, question: 'How many bottles did they use?', options: ['Five', 'Ten', 'Two'], correctIndex: 0 },
      { id: 'bottle-ph', type: 'phonics', afterPage: 6, targetSound: 'b', prompt: 'Which words start with the b sound, like bottle?', options: ['bottle', 'bin', 'seed', 'brother'], correctIndexes: [0, 1, 3] },
      { id: 'bottle-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The children see bottles by the road.', 'Uncle Acheampong cuts the bottles.', 'The children plant seeds.', 'The bottle garden grows.'] },
      { id: 'bottle-sel', type: 'sel', afterPage: 8, prompt: 'The children turned rubbish into a garden. How do you feel about reusing things?', feelingOptions: ['Proud', 'Creative', 'Caring', 'Happy'] },
    ],
    glossary: [
      { word: 'plastic', definition: 'A light, strong material that is used to make bottles and bags.', pages: [1, 2] },
      { word: 'drain', definition: 'To let water flow out.', pages: [4] },
      { word: 'reuse', definition: 'To use something again instead of throwing it away.', pages: [3, 8] },
    ],
    culturalNotes: ['Shamsia, Mubarak and Uncle Acheampong are invented. The story shows a simple way to reuse a clean plastic bottle as a hanging planter. The children use bottles from home and do not pick up rubbish from the roadside, which can be unsafe.', 'Plastic takes a very long time to break down in nature. The story says this in one sentence and does not give a number of years.', 'Safety: an adult uses the scissors. Teachers should remind children not to touch broken glass, sharp objects or dirty rubbish and to wash hands after touching soil.'],
    reviewQuestions: ['Check that the bottle-planter method (a window cut in the side, holes for drainage, hung from a fence) is practical and safe, and suggest suitable local plants.', 'Check that the story does not encourage children to pick up rubbish from roads or dirty places.'],
    guide: {
      overview: 'A story about reusing plastic bottles to make a hanging garden. It teaches reuse, counting and safe habits.',
      lessonMinutes: 30,
      goals: ['Say why we should not throw plastic on the ground.', 'Describe how to make a bottle garden.', 'Count to five and retell the story in order.'],
      subjects: [['Science', 'Materials and plants'], ['Mathematics', 'Counting'], ['Environmental Studies', 'Reuse and reduce']],
      before: ['Ask: what do we do with empty bottles at home or at school?'],
      during: ['Count the bottles aloud on page 5.'],
      after: ['An adult cuts clean bottles and children plant seeds in them.', 'Make a class rule: reuse it or bin it.'],
      discussion: ['Why did the children use bottles from home?', 'What else could we reuse?'],
      reflection: ['What can you reuse at home?'],
      maths: [{ task: 'There are 5 bottles with 3 seeds in each. How many seeds are there?', answer: '5 × 3 = 15 seeds.' }, { task: 'Shamsia has 8 bottles and uses 5. How many are left?', answer: '8 − 5 = 3 bottles.' }],
      support: ['Use clean empty bottles and picture cards to sequence the steps.'],
      stretch: ['Design a poster that says “Reuse it or bin it”.'],
      localise: ['Use clean bottles from home only, and let an adult use scissors. Wash hands after handling soil.'],
      factCheck: [{ claim: 'Plastic takes a very long time to break down, and clean bottles can be reused as planters with drainage holes.', explanation: 'Common knowledge in environmental education and gardening.', reference: 'An environmental education or urban gardening resource (to verify).' }],
    },
  }),

  // 6 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'one-bread-two-friends',
    title: 'One Bread, Two Friends',
    summary: 'Ayeley forgets her lunch and her tummy rumbles in class. Her friend Kofitse sees and shares half of his bread and egg. The next day, Ayeley remembers her lunch and brings a little extra. A gentle story about sharing and kindness.',
    classIds: ['primary-1', 'primary-2'],
    ageMin: 6,
    ageMax: 8,
    readingLevel: 'early',
    difficulty: 2,
    genres: ['friendship', 'school-life', 'moral'],
    themes: ['friendship', 'food', 'school', 'helping-others'],
    objectives: ['kindness', 'emotional-intelligence', 'counting', 'vocabulary'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'local-food'],
    wpm: 95,
    paceWord: 'Warm and gentle, with a smile at the sharing',
    palette: ['#d97706', '#0d9488'],
    voice: 'A shy, hungry girl’s voice for Ayeley; a friendly boy’s voice for Kofitse',
    characters: [
      'Ayeley: a girl of six with a blue school dress, two plaits and a rumbling tummy.',
      'Kofitse: a boy of six in a school uniform, holding half a loaf of bread with an egg.',
      'Madam Aduku: the class teacher, in a bright dress, smiling at the pupils at break time.',
    ],
    music: 'A soft, warm tune with a little rumble on the drum (placeholder)',
    pages: [
      pg('🥣', 'It was break time. Ayeley put her hand in her bag. Her lunch box was not there! ‘Oh no,’ she said. ‘I forgot my lunch.’', 'A girl looks into an empty bag at a school desk.'),
      pg('😔', 'Her tummy rumbled. Grr, grr, grr! She did not tell anybody. She sat still and looked at her desk.', 'A girl sits quietly with her hands on her tummy while others eat.'),
      pg('👀', 'Kofitse sat beside her. He heard her tummy. ‘Are you hungry?’ he asked. Ayeley nodded a tiny nod. ‘I forgot my lunch,’ she whispered.', 'A boy turns to a girl whose tummy rumbles.'),
      pg('🥖', 'Kofitse had bread and an egg. He broke his bread in two. He gave her half. ‘Here,’ he said. ‘We can share.’', 'A boy breaks a piece of bread and gives half to a girl.'),
      pg('🥚', 'He cut the egg in two as well. Now they each had half a piece of bread and half an egg. ‘Thank you,’ said Ayeley. She smiled.', 'Two children eat bread and egg together at a desk.'),
      pg('👩', 'Madam Aduku saw them. ‘That was kind, Kofitse,’ she said. ‘When we share, everybody has something. And we should tell a grown-up when we are hungry.’', 'A teacher smiles at two children sharing lunch.'),
      pg('🎒', 'The next day, Ayeley put her lunch box in her bag. She checked it twice. At break time, she opened it. She had extra: two oranges.', 'A girl opens a lunch box with two oranges inside.'),
      pg('🍊', '‘One for you,’ said Ayeley, and she gave an orange to Kofitse. They peeled their oranges together. Sharing made them both feel good. The end.', 'Two children peel oranges together and smile.'),
    ],
    activities: [
      { id: 'bread-c1', type: 'comprehension', afterPage: 3, question: 'What did Ayeley forget?', options: ['Her lunch', 'Her book', 'Her shoes'], correctIndex: 0 },
      { id: 'bread-c2', type: 'comprehension', afterPage: 5, question: 'How did Kofitse share?', options: ['He broke his bread in two', 'He ate it all', 'He hid it'], correctIndex: 0 },
      { id: 'bread-ph', type: 'phonics', afterPage: 6, targetSound: 'sh', prompt: 'Which words have the sh sound, like share?', options: ['share', 'sat', 'she', 'sit'], correctIndexes: [0, 2] },
      { id: 'bread-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Ayeley forgot her lunch.', 'Kofitse shared his bread and egg.', 'Madam Aduku praised the sharing.', 'Ayeley shared an orange.'] },
      { id: 'bread-sel', type: 'sel', afterPage: 8, prompt: 'Sharing made both friends feel good. How do you feel when you share?', feelingOptions: ['Kind', 'Happy', 'Grateful', 'Proud'] },
    ],
    glossary: [
      { word: 'break', definition: 'A short rest time at school when pupils can eat and play.', pages: [1] },
      { word: 'rumbled', definition: 'Made a low, rolling sound.', pages: [2] },
      { word: 'share', definition: 'To give a part of what you have to someone else.', pages: [4, 6] },
    ],
    culturalNotes: ['Ayeley, Kofitse and Madam Aduku are invented. The story shows a child who forgets her lunch, a friend who shares and a teacher who reminds children to tell a grown-up when they are hungry.', 'Some children go without lunch for reasons other than forgetting. The story does not suggest that a hungry child is at fault. Teachers should be sensitive and arrange support for children who regularly go hungry, without drawing attention to them.', 'The story does not name a particular kind of bread or egg dish; the pictures can show what children know.'],
    reviewQuestions: ['Check that the story is sensitive to children who regularly go without food and that the teacher’s role is handled kindly.', 'Check that sharing food is safe where there are food allergies and add a note for teachers.'],
    guide: {
      overview: 'A short story about sharing and kindness at school. It shows a child who forgets lunch and a friend who shares, and a teacher who reminds children to tell a grown-up when they are hungry.',
      lessonMinutes: 25,
      goals: ['Say how Kofitse showed kindness.', 'Say what to do when you are hungry at school.', 'Retell the story in order.'],
      subjects: [['Personal and Social', 'Kindness and sharing'], ['Language and Literacy', 'Sequencing and new words']],
      before: ['Ask: what is a kind thing a friend did for you?'],
      during: ['Let children rumble their tummies softly on page 2.'],
      after: ['Role-play sharing a snack, with pretend food.', 'Make a kindness chart for the week.'],
      discussion: ['How did Ayeley feel when she forgot her lunch? How did she feel after Kofitse shared?', 'Why should we tell a grown-up when we are hungry?'],
      reflection: ['When can you share something with a friend?'],
      support: ['Use pictures to show the steps: forgot, hungry, share, thank you.'],
      stretch: ['Write two sentences about a time you shared.'],
      localise: ['Use the snacks children really eat. Check for allergies before children share food, and be sensitive to children who often go hungry.'],
      factCheck: [{ claim: 'Sharing and telling an adult when we are hungry are kind and healthy habits.', explanation: 'Basic social and emotional learning at primary level.', reference: 'Early childhood education guidance (to verify).' }],
    },
  }),

  // 7 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-night-the-lights-went-out',
    title: 'The Night the Lights Went Out',
    summary: 'The lights go out at Lartekor’s house, and he is scared of the dark. Auntie Efia switches on a torch, shows him shadow animals on the wall, and takes him outside to see more stars than he has ever seen. A story about being brave in the dark and staying safe without candles and matches.',
    classIds: ['primary-2', 'primary-3'],
    ageMin: 7,
    ageMax: 9,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['family', 'science', 'adventure'],
    themes: ['fear-and-courage', 'family', 'night-sky', 'technology'],
    objectives: ['emotional-intelligence', 'scientific-curiosity', 'reasoning', 'responsibility'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'village-life'],
    wpm: 100,
    paceWord: 'Hushed and wondering, with a gasp at the stars',
    palette: ['#1e1b4b', '#fbbf24'],
    voice: 'A nervous, then wondering boy’s voice for Lartekor; a calm, playful aunt’s voice for Auntie Efia',
    characters: [
      'Lartekor: a boy of eight in pyjamas, clutching a pillow.',
      'Auntie Efia: Lartekor’s aunt, in a wrapper and a headscarf, holding a small torch.',
      'The shadow animals: a dog, a bird and a rabbit made with hands on the wall in torchlight.',
      'The night sky: a dark sky filled with many stars above a quiet compound.',
    ],
    music: 'A hushed, mysterious tune that lifts into wonder at the stars (placeholder)',
    pages: [
      pg('🌑', 'One evening, the lights in Lartekor’s house went out. Click! The fridge stopped humming. The fan stopped turning. It was dark. ‘Auntie!’ he called. ‘I cannot see anything!’', 'A boy stands in a dark room clutching a pillow as the lights go out.'),
      pg('🔦', 'Auntie Efia found her torch. Click! A circle of yellow light shone on the floor. ‘Here I am,’ she said. ‘Do not be afraid. It is only a power cut.’', 'An aunt holds up a torch and a circle of light falls on the floor.'),
      pg('🐕', 'She held her hand in front of the light. On the wall, a shadow dog appeared. Then a bird. Then a rabbit. Lartekor giggled. ‘Do it again!’ he said.', 'Hand shadows of a dog, a bird and a rabbit appear on a wall in torchlight.'),
      pg('💡', '‘A shadow is made when something blocks the light,’ said Auntie Efia. ‘My hand blocks the torch, so there is a dark shape on the wall.’ Lartekor tried it with his own hand.', 'A boy makes a shadow on the wall with his own hand.'),
      pg('🕯️', '‘Should we light a candle?’ asked Lartekor. ‘No,’ said Auntie Efia. ‘Never play with matches or candles. Fire can hurt people and burn a house. A torch is safer. Always ask a grown-up.’', 'An aunt shakes her head and points to a torch rather than a candle.'),
      pg('🌌', 'Then Auntie Efia took his hand. They went outside, to the yard. ‘Look up,’ she said. Lartekor looked up and gasped. The sky was full of stars!', 'A boy and his aunt stand in the yard looking up at a sky full of stars.'),
      pg('✨', '‘Why can I see so many?’ he asked. ‘When the street lights and house lights are on, their glow hides the stars,’ said Auntie Efia. ‘Tonight there is less light, so we can see more.’', 'A boy and his aunt point at the stars with the town dark below.'),
      pg('😴', 'They sat and counted stars until the lights came back on. Click! The fan began to turn. ‘I was not scared after all,’ said Lartekor. The end.', 'A boy and his aunt sit on a mat counting stars as the house lights come back.'),
    ],
    activities: [
      { id: 'lights-c1', type: 'comprehension', afterPage: 4, question: 'What is a shadow, says Auntie Efia?', options: ['A dark shape made when something blocks light', 'A kind of torch', 'A kind of star'], correctIndex: 0 },
      { id: 'lights-c2', type: 'comprehension', afterPage: 5, question: 'What is safer in a power cut?', options: ['A torch', 'A candle', 'Matches'], correctIndex: 0 },
      { id: 'lights-ph', type: 'phonics', afterPage: 6, targetSound: 'st', prompt: 'Which words start with the st sound, like stars?', options: ['stars', 'sky', 'stopped', 'street'], correctIndexes: [0, 2, 3] },
      { id: 'lights-p1', type: 'prediction', afterPage: 6, prompt: 'The lights are off. Why might the stars look brighter? Tell a friend.', options: ['Less light hides them', 'The stars come closer'] },
      { id: 'lights-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The lights went out.', 'Auntie Efia made shadow animals.', 'They looked at the stars.', 'The lights came back on.'] },
      { id: 'lights-sel', type: 'sel', afterPage: 8, prompt: 'Lartekor was scared and then amazed. How do you feel in the dark?', feelingOptions: ['Scared', 'Curious', 'Calm', 'Amazed'] },
    ],
    glossary: [
      { word: 'torch', definition: 'A small light that you hold in your hand and that runs on batteries.', pages: [2, 5] },
      { word: 'shadow', definition: 'A dark shape made when something blocks light.', pages: [3, 4] },
      { word: 'stars', definition: 'Bright points of light in the night sky.', pages: [6, 7, 8] },
    ],
    culturalNotes: ['Lartekor and Auntie Efia are invented. The story is set during a power cut, which many families in Ghana have experienced. It does not blame anyone for power cuts and does not mention politics.', 'The facts in the story are simple: a shadow forms when something blocks light; lights in towns can make it harder to see stars; torches are safer than candles. The story tells children never to play with matches or candles and to ask a grown-up.', 'The story does not say that children should be outside alone at night. Lartekor goes into the yard with his aunt. Teachers can remind children to stay with an adult.'],
    reviewQuestions: ['Check that the explanations of shadows and of why stars are easier to see when there are fewer lights are correct and clear for this age.', 'Check that the fire safety advice is clear, and that the story does not suggest children go out alone at night.'],
    guide: {
      overview: 'A story about being afraid of the dark and finding wonder in it. It teaches shadows, why stars are easier to see away from bright lights, and a clear safety rule about fire.',
      lessonMinutes: 30,
      goals: ['Explain how a shadow is made.', 'Say why a torch is safer than a candle.', 'Retell the story in order.'],
      subjects: [['Science', 'Light and shadow'], ['Language and Literacy', 'Sequencing and new words'], ['Health and Safety', 'Fire safety']],
      before: ['Ask: how do you feel when the lights go out? What do you do?'],
      during: ['Lower the lights a little for page 1, and make hand shadows for page 3.'],
      after: ['Make hand shadows on a wall with a torch.', 'Draw a night sky with stars and label the moon and a star.'],
      discussion: ['Why did Auntie Efia not light a candle?', 'Why could Lartekor see more stars?'],
      reflection: ['What helps you feel brave when it is dark?'],
      support: ['Use a torch and a toy to show how a shadow forms.'],
      stretch: ['Write three sentences about what you saw in the dark.'],
      localise: ['Use the lighting at your school or home (torch, phone light, lantern). Tell children never to use matches or candles without an adult, and never to be outside alone at night.'],
      factCheck: [{ claim: 'A shadow forms when something blocks light; bright artificial lights make it harder to see stars; torches are safer than candles for children.', explanation: 'Basic science and safety guidance taught in primary school.', reference: 'A primary science textbook and a national fire service safety guide (to verify).' }],
    },
  }),

  // 8 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-girl-who-asked-why',
    title: 'The Girl Who Asked Why',
    summary: 'Ayeyi asks whether heavy things fall faster than light things. Instead of guessing, she and her teacher test it, dropping a stone and a pencil, then a flat paper and a crumpled one. The results surprise her, and she learns how to run a fair test and write down what she finds. A story about curiosity and testing ideas.',
    classIds: ['primary-2', 'primary-3'],
    ageMin: 7,
    ageMax: 9,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['science', 'educational', 'school-life'],
    themes: ['school', 'technology', 'identity'],
    objectives: ['scientific-curiosity', 'reasoning', 'problem-solving', 'perseverance'],
    ghanaianContext: 'incidental',
    culturalTags: ['local-names'],
    wpm: 100,
    paceWord: 'Curious and quick, with a pause before each result',
    palette: ['#7c3aed', '#f59e0b'],
    voice: 'A bright, curious girl’s voice for Ayeyi; a friendly, encouraging teacher’s voice for Mr Marfo',
    characters: [
      'Ayeyi: a girl of eight with two puffs of hair and a school uniform, holding a notebook and a pencil.',
      'Mr Marfo: the science teacher, in a shirt with rolled-up sleeves, holding two pieces of paper.',
      'The playground: a school yard with a soft patch of sand where objects are dropped.',
    ],
    music: 'A curious, bouncy tune with a drum tap for every drop (placeholder)',
    pages: [
      pg('❓', 'Ayeyi always asked why. Why is the sky blue? Why do birds fly? One day in class she asked, ‘Do heavy things fall faster than light things?’', 'A girl puts up her hand with a question mark above her head.'),
      pg('🤷', 'Some pupils said yes. Some said no. ‘I think a stone falls faster than a pencil,’ said Ayeyi. ‘Let us not guess,’ said Mr Marfo. ‘Let us test it.’', 'A teacher smiles and holds up a stone and a pencil in front of the class.'),
      pg('📏', '‘A fair test has rules,’ said Mr Marfo. ‘Drop both things from the same height. Drop them at the same time. Do it three times.’ He took them to the playground, to a soft patch of sand.', 'A teacher and a girl stand at the edge of a sand patch with a stone and a pencil.'),
      pg('🪨', 'Ayeyi held the stone in one hand and the pencil in the other. ‘One, two, three, drop!’ Thud! They landed at almost the same time. ‘They did not fall at different speeds!’ she said.', 'A girl drops a stone and a pencil at the same time onto sand.'),
      pg('📄', 'Next, Mr Marfo gave her two sheets of the same paper. He crumpled one into a ball. ‘Drop the flat one and the ball,’ he said. ‘Guess first.’ ‘The same?’ said Ayeyi.', 'A teacher crumples one sheet of paper while a girl holds a flat sheet.'),
      pg('🌬️', 'She dropped them. The crumpled ball landed first. The flat sheet floated down slowly. ‘Why?’ she asked. ‘Air pushes up on the flat paper more,’ said Mr Marfo. ‘It is the shape that matters, not only the weight.’', 'A crumpled ball of paper lands first while a flat sheet floats down.'),
      pg('📝', 'Ayeyi drew a table in her notebook. She wrote what she dropped, what she thought and what happened. ‘A scientist writes down the results,’ said Mr Marfo. ‘Then others can check them.’', 'A girl writes a table of results in her notebook.'),
      pg('🔭', '‘I thought I knew the answer,’ said Ayeyi. ‘But I did not.’ Mr Marfo smiled. ‘Now you know how to find out,’ he said. ‘That is the best kind of knowing.’ The end.', 'A girl and her teacher look at a notebook of results in the sunshine.'),
    ],
    activities: [
      { id: 'why-c1', type: 'comprehension', afterPage: 4, question: 'What happened when Ayeyi dropped the stone and the pencil?', options: ['They landed at almost the same time', 'The stone flew away', 'The pencil floated'], correctIndex: 0 },
      { id: 'why-c2', type: 'comprehension', afterPage: 6, question: 'What did Mr Marfo say makes the flat paper fall slowly?', options: ['Air pushes up on it', 'It is magic', 'It is heavier'], correctIndex: 0 },
      { id: 'why-ph', type: 'phonics', afterPage: 6, targetSound: 'wh', prompt: 'Which words start with the wh sound, like why?', options: ['why', 'what', 'drop', 'when'], correctIndexes: [0, 1, 3] },
      { id: 'why-p1', type: 'prediction', afterPage: 5, prompt: 'A flat paper and a crumpled ball are dropped. Which lands first? Tell a friend.', options: ['The crumpled ball', 'The flat paper'] },
      { id: 'why-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['Ayeyi asked her question.', 'Mr Marfo explained a fair test.', 'Ayeyi dropped the stone and the pencil.', 'Ayeyi wrote the results in a table.'] },
      { id: 'why-sel', type: 'sel', afterPage: 8, prompt: 'Ayeyi learned that testing is better than guessing. How do you feel when you find something out?', feelingOptions: ['Curious', 'Proud', 'Surprised', 'Excited'] },
    ],
    glossary: [
      { word: 'test', definition: 'A way to find out if something is true.', pages: [2, 3] },
      { word: 'crumpled', definition: 'Squeezed into a small, rough ball.', pages: [5, 6] },
      { word: 'results', definition: 'What you find out from a test.', pages: [7] },
    ],
    culturalNotes: ['Ayeyi and Mr Marfo are invented. The story models a simple fair test: the same height, the same time, repeated three times, with results written in a table.', 'The science in the story is simple and well known: a stone and a pencil dropped together land at almost the same time because the air pushes very little on both; a flat sheet of paper falls more slowly than a crumpled ball because air pushes up on it more. The story does not claim that all objects fall at the same speed in all cases, and it says that shape matters as well as weight.', 'Safety: the test is done on a soft patch of sand, with small objects, at a low height. Teachers should make sure children do not drop anything from a height or from windows.'],
    reviewQuestions: ['Have a science teacher check the statements about falling objects and air resistance and the description of a fair test for this age group.', 'Check that the safety advice is clear and the experiment is safe in a school yard.'],
    guide: {
      overview: 'A story about asking questions and testing ideas. It teaches a simple fair test and shows that results can surprise us.',
      lessonMinutes: 35,
      goals: ['Say what makes a test fair.', 'Say what happened in each of Ayeyi’s tests.', 'Record results in a simple table.'],
      subjects: [['Science', 'Forces and investigating'], ['Mathematics', 'Recording data'], ['Language and Literacy', 'Sequencing and new words']],
      before: ['Ask: do you think a heavy thing falls faster than a light thing? Why?'],
      during: ['Ask children to guess before each result, and then to say what happened.'],
      after: ['Repeat the stone and pencil test and the flat and crumpled paper test on a soft surface.', 'Draw a results table with the columns: what we dropped, what we thought, what happened.'],
      discussion: ['Why did Mr Marfo say to do the test three times?', 'Why did the flat paper fall slowly?'],
      reflection: ['What is a question you would like to test?'],
      support: ['Use a picture table with ticks and sad or happy faces for “what I thought” and “what happened”.'],
      stretch: ['Think of another fair test, such as which paper plane flies furthest, and list the rules for it.'],
      localise: ['Use stones, pencils and paper from your classroom. Do the test on a soft surface and at low height, with an adult present.'],
      factCheck: [{ claim: 'A stone and a pencil dropped together from a small height land at almost the same time; a flat sheet of paper falls more slowly than a crumpled ball because air resistance acts on it more.', explanation: 'Basic physics of falling objects and air resistance.', reference: 'A primary or lower secondary physics textbook (to verify).' }],
    },
  }),
];

