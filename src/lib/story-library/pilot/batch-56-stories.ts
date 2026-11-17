import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (
  motif: string,
  text: string,
  alt: string,
  narration = 'Warm, slow storyteller’s voice suited for Basic 4 to 6 learners; pause often and say new words clearly.'
): Page => ({
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
      notes: [
        'Read stories with a distinct, natural voice for each character; read articles as one clear narrator.',
        'Pause for two seconds at each comprehension check so learners can reason first.',
        'Pronounce the names of characters and places clearly, with respect for the languages they come from.',
      ],
    },
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: [
      'Is the language right for the stated age band (Basic 4 to Basic 6) and the NaCCA primary reading level?',
      'Is the tale retold with respect for the people it comes from, and is its lesson clear?',
      ...s.reviewQuestions,
    ],
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
 * Batch 56 (8 original Big Ideas stories and articles for Basic 4 to Basic 6, six short pages each, with activities).
 * Each article is linked to Social Studies, Career Technology, Science, or Computing (see the first cultural note and the teacher guide).
 * These are original stories and articles, each teaching one idea from a well-known book. Stories list their characters; articles have none.
 * Original text written for Ghanaian learners; each factCheck note names the book behind the idea and what to verify.
 */

export const BATCH_56_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'kid-the-missing-mangoes',
    title: 'The Case of the Missing Mangoes',
    summary:
      'Every morning, the ripe mangoes on the school tree are gone. Everyone has a different guess. Two children test their guesses and find the real answer.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'problem-solving', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Curious, playful, and clear',
    palette: ['#ca8a04', '#15803d'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Abena: a careful girl in Basic 5 who loves puzzles.',
      'Kojo: her friend in Basic 5, who is brave and funny.',
      'Mr Sarpong: the school gardener, who is gentle and wise.',
    ],
    music: 'Light xylophone with a playful drum (placeholder)',
    pages: [
      pg(
        '🥭',
        'The big mango tree at school was full of ripe fruit. But every morning, the best mangoes were gone! “It is a thief,” said one pupil. “It is a monkey,” said another. “It is a ghost!” said a third. Abena and Kojo looked up at the tree. “Everyone has a guess,” said Abena. “Let us test our guesses and find out.”',
        'Children under a large leafy mango tree pointing up at the branches.'
      ),
      pg(
        '🌾',
        '“If a person comes, there will be footprints,” said Kojo. Mr Sarpong, the gardener, gave them a bag of flour. That evening they sprinkled it under the tree like a white carpet. “If a thief walks here, we will see his feet,” said Abena. They went home. They were too excited to sleep.',
        'Two children and a kindly gardener sprinkling white flour on the ground under a mango tree at dusk.'
      ),
      pg(
        '👣',
        'In the morning, they ran to the tree. The mangoes were gone again. But the flour had no footprints at all! “So it was not a person,” said Kojo. “And not a monkey, or a goat,” said Abena. “Their feet would show.” They found one more clue: bits of chewed mango, and a few small dark drops on the ground.',
        'Children kneeling beside smooth untouched white flour and bits of chewed mango.'
      ),
      pg(
        '🦇',
        'Mr Sarpong looked at the clues and smiled. “Chewed fruit and small drops, with no footprints? Something comes through the air.” That night the children hid and watched with a torch. Soon, soft wings flapped around the tree. Big fruit bats! They ate the ripe mangoes, then flew away. “It was bats,” whispered Abena. “Not a thief or a ghost.”',
        'Fruit bats fluttering around a mango tree at night while two children and the gardener watch from a safe distance with a torch.'
      ),
      pg(
        '🧺',
        'Now they knew the cause, they could fix the problem. They picked the mangoes a little early, when they were almost ripe, and let them ripen in a basket indoors. Every pupil had a fruit at break time. The bats still enjoyed the leftovers. Nobody had to chase anything away, and nobody had to blame anybody.',
        'A woven basket of ripe yellow mangoes shared among smiling school children.'
      ),
      pg(
        '💡',
        'Abena wrote in her book: “When something strange happens, do not just guess. Make a test, look for clues, and find the real cause.” Try it! Is there a small mystery at home or at school? Think of a guess, make a small test, and look carefully at what you find. Then tell a friend what you learned.',
        'A girl writing happily in her plain notebook next to a ripe mango on a desk.'
      ),
    ],
    activities: [
      {
        id: 'qa-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why did the children sprinkle flour under the tree?',
        options: [
          'To see footprints',
          'To feed the birds',
          'To make bread',
        ],
        correctIndex: 0,
      },
      {
        id: 'qa-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did the flour with no footprints tell them?',
        options: [
          'It was not a person or a monkey',
          'The tree was sick',
          'Nothing',
        ],
        correctIndex: 0,
      },
      {
        id: 'qa-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Who was taking the mangoes?',
        options: [
          'Fruit bats',
          'A thief',
          'A ghost',
        ],
        correctIndex: 0,
      },
      {
        id: 'qa-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: Your pencils keep going missing at school. What should you do first?',
        options: [
          'Blame a friend',
          'Make a small test and look for clues',
          'Stop using pencils',
        ],
        correctIndex: 1,
      },
      {
        id: 'qa-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'Mangoes keep disappearing and everyone guesses',
          'The children sprinkle flour to test',
          'There are no footprints',
          'They watch at night and see fruit bats',
        ],
      },
      {
        id: 'qa-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'footprints',
        definition: 'Marks left by feet.',
        distractors: [
          'A kind of flour',
          'A kind of fruit',
        ],
      },
    ],
    glossary: [
      {
        word: 'ripe',
        definition: 'Ready to eat.',
        pages: [1],
      },
      {
        word: 'footprints',
        definition: 'Marks left by feet.',
        pages: [2, 3],
      },
      {
        word: 'clue',
        definition: 'A small sign that helps you find the answer.',
        pages: [3],
      },
      {
        word: 'bats',
        definition: 'Small animals that fly at night.',
        pages: [4],
      },
      {
        word: 'cause',
        definition: 'The reason why something happens.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Problems have causes we can discover by guessing boldly, testing the guess, and looking for clues. The idea is explored further in “The Beginning of Infinity” by David Deutsch (2011), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'Safety: children watch with an adult nearby, and nobody climbs the tree or touches the bats. Fruit bats should not be handled.',
    ],
    reviewQuestions: [
      'Check that fruit bats eating ripe mangoes at night is realistic in the learners’ area.',
      'Make sure the adult supervision is clear.',
    ],
    guide: {
      overview:
        'A mystery story that shows how to test guesses and find the real cause.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Explain how the flour test worked.',
        'Make a small test of your own.',
      ],
      subjects: [
        ['Science (NaCCA CCP primary: asking questions and testing ideas; codes to verify)', 'Finding causes'],
        ['Our World Our People (NaCCA CCP primary: plants and animals around us; codes to verify)', 'Animals that live near us'],
      ],
      before: ['Ask: what small mystery have you seen at home or school?'],
      during: ['Stop after Page 2. Ask: what will the flour show?'],
      after: ['Pupils sprinkle flour on a tray near the classroom door at night and look in the morning, with their teacher.'],
      discussion: ['Why was it better to test than to blame?'],
      reflection: ['What guess of yours could you test?'],
      maths: [],
      support: ['Act out the mystery in groups.'],
      stretch: ['Find out what fruit bats eat and where they live.'],
      localise: ['Which animals visit trees or gardens near you at night?'],
      factCheck: ['Fruit bats eat ripe fruit at night, but the details should be confirmed with a science teacher. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 2
  mk({
    key: 'kid-counting-the-change',
    title: 'Counting the Change',
    summary:
      'A seller at the kiosk is in a hurry and says, “Quick, quick, others are waiting!” Ato’s quick mind says yes. His slow mind says wait. A story about when to slow down.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'thinking-skills', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Light, clear, and kind',
    palette: ['#7c3aed', '#ea580c'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Ato: a quick boy in Basic 6 who loves to be first.',
      'Auntie Maud: a busy kiosk seller who is kind and honest.',
      'Grandpa Nii: Ato’s grandfather, who teaches him to pause.',
    ],
    music: 'Playful marimba with a soft ticking beat (placeholder)',
    pages: [
      pg(
        '⚡',
        'Ato was the fastest boy in his class. He ran first, spoke first, and answered first. His grandfather, Grandpa Nii, sometimes laughed. “Your quick mind is a good friend, Ato,” he said. “But even a good friend can make a mistake if he is in a hurry.” Ato did not quite understand. Not yet.',
        'A cheerful boy running ahead of his smiling grandfather on a sunlit village path.'
      ),
      pg(
        '🛒',
        'One afternoon, Ato went to Auntie Maud’s kiosk to buy a notebook and a pencil. The kiosk was full of people. “Quick, quick, others are waiting!” said Auntie Maud. She gave Ato his things and some change in a hurry. “Thank you!” said Ato, and he turned to go. His quick mind said, “Done! Run along!”',
        'A busy wooden kiosk with waiting customers as the seller hands coins to Ato.'
      ),
      pg(
        '🐢',
        'But then he remembered his grandfather’s words. He stopped by the side of the road and counted his change. His slow mind asked, “Is it right?” The notebook cost three cedis, and the pencil one cedi. He had given a ten cedi note. He should have six cedis back. He counted: five cedis and fifty pesewas. It was short by fifty pesewas!',
        'A boy standing calmly beside the road counting coins carefully in his open palm.'
      ),
      pg(
        '🙏',
        'Ato went back politely. “Auntie Maud, please, may I count my change again with you?” She counted slowly, looked puzzled, and laughed. “Oh, my son! I made a mistake in the rush. Thank you for coming back.” She gave him the fifty pesewas. “Most people do not check,” she said. “It was an honest mistake, but I am glad you were careful.”',
        'A boy and a friendly woman kiosk seller counting coins together with warm smiles.'
      ),
      pg(
        '📋',
        'Grandpa Nii was proud. “When must you slow down, Ato?” Ato counted on his fingers. “When money is involved. When someone is rushing me. When I am angry. And when the answer feels too easy.” His grandfather nodded. “And what do you do?” “Stop. Breathe. Count. Check.” “Good,” said Grandpa Nii.',
        'A grandfather and a boy sitting on a veranda bench counting four things on their fingers.'
      ),
      pg(
        '💡',
        'Ato is still quick, and he loves running. But now he also knows how to be slow, when it matters. He uses both his quick mind and his slow mind. Try it! Next time you get your change, or your marks, or a message with a big promise, stop and check it once more.',
        'A boy smiling and holding his coins carefully in his palm beside a sunlit path.'
      ),
    ],
    activities: [
      {
        id: 'qb-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What did Auntie Maud say?',
        options: [
          'Quick, quick, others are waiting!',
          'Please take your time',
          'Come back tomorrow',
        ],
        correctIndex: 0,
      },
      {
        id: 'qb-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What was wrong with Ato’s change?',
        options: [
          'It was short by fifty pesewas',
          'It was too much',
          'It was in the wrong coins',
        ],
        correctIndex: 0,
      },
      {
        id: 'qb-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Auntie Maud react?',
        options: [
          'She was honest and thanked him for being careful',
          'She was angry',
          'She ran away',
        ],
        correctIndex: 0,
      },
      {
        id: 'qb-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: A shop assistant gives you change quickly. What should you do?',
        options: [
          'Run off',
          'Stop and count the change',
          'Throw it away',
        ],
        correctIndex: 1,
      },
      {
        id: 'qb-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'Ato buys a notebook and pencil in a hurry',
          'He remembers his grandfather’s words',
          'He counts and finds his change is short',
          'He asks politely and gets the right change',
        ],
      },
      {
        id: 'qb-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'change',
        definition: 'Money given back after you pay more than the price.',
        distractors: [
          'A new idea',
          'A coin collection',
        ],
      },
    ],
    glossary: [
      {
        word: 'kiosk',
        definition: 'A very small shop or stall.',
        pages: [2],
      },
      {
        word: 'change',
        definition: 'Money given back after you pay more than the price.',
        pages: [2, 3],
      },
      {
        word: 'puzzled',
        definition: 'Confused because something is not clear.',
        pages: [4],
      },
      {
        word: 'honest',
        definition: 'Truthful and fair.',
        pages: [4],
      },
      {
        word: 'careful',
        definition: 'Taking time to avoid mistakes.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'Big idea: Our minds have a quick way and a slow way of thinking, and we need the slow, careful way when we are hurried or when money is involved. The idea is explored further in “Thinking, Fast and Slow” by Daniel Kahneman (2011), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'The seller is shown as honest and kind. The story does not suggest sellers cheat.',
    ],
    reviewQuestions: [
      'Check the prices and sum: 3 + 1 = 4; 10 - 4 = 6.',
      'Check that the seller is shown respectfully.',
    ],
    guide: {
      overview:
        'A story about pausing to check when someone is rushing us.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Name the times to slow down.',
        'Practise checking change.',
      ],
      subjects: [
        ['Mathematics (NaCCA CCP primary: money and subtraction; codes to verify)', 'Counting change'],
        ['Our World Our People (NaCCA CCP primary: making good choices; codes to verify)', 'Pausing to check'],
      ],
      before: ['Ask: have you ever made a mistake because you were in a hurry?'],
      during: ['Stop after Page 2. Ask: what should Ato do now?'],
      after: ['Pupils play shop and practise counting change slowly.'],
      discussion: ['Why is it kind to check, even when a seller is honest?'],
      reflection: ['When do you need to slow down most?'],
      maths: [
        {
          task: 'Ato pays GH¢10 for a notebook at GH¢3 and a pencil at GH¢1. How much change should he get?',
          answer: '10 - (3 + 1) = GH¢6.',
        },
      ],
      support: ['Use play money to practise.'],
      stretch: ['Make up three shopping sums with change.'],
      localise: ['What do people near you do to make sure their change is right?'],
      factCheck: ['The story is fiction. The sum is 10 - (3 + 1) = 6. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 3
  mk({
    key: 'kid-the-shade-seller',
    title: 'The Shade Seller',
    summary:
      'In the forest market, six animals sell the very same yams. Nana Tortoise looks around and notices something nobody is selling. A fable about finding what is missing.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'enterprise', 'fable', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Warm, funny, and simple',
    palette: ['#15803d', '#ca8a04'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Nana Tortoise: a slow, wise tortoise who notices things.',
      'Kwaku Goat: a loud goat who sells yams.',
      'Afia Hen: a busy hen who sells yams too.',
      'Old Elephant: a tired elephant who visits the market each noon.',
    ],
    music: 'Gentle forest drums with a soft flute (placeholder)',
    pages: [
      pg(
        '🌴',
        'In the forest market, six animals sold yams. Kwaku Goat sold yams. Afia Hen sold yams. The monkey, the duck, the deer, and the rat all sold yams too, all at the same price. When one lowered the price, so did the others. They all grumbled, “Nobody buys from me!”',
        'A busy forest market clearing with six animal sellers behind identical heaps of yams.'
      ),
      pg(
        '🐢',
        'Nana Tortoise wanted to sell something too. “Shall I sell yams?” she thought. Then she laughed. “That would be the seventh! Better to look around first.” She sat in the middle of the market all day and watched. She was slow, but she noticed a great deal. She saw who came, what they bought, and how they looked when the sun was high.',
        'A wise tortoise sitting quietly on a small stone in the middle of the forest market, watching.'
      ),
      pg(
        '☀️',
        'Around noon, the sun was very hot. Old Elephant came to the market, panting. He looked for a place to rest, but the market had no shade. The monkey fanned himself. The hen was breathless. “If only there was somewhere cool to sit,” everyone sighed. Nana Tortoise’s eyes twinkled.',
        'A bright hot market at noon with tired animals fanning themselves under the blazing sun.'
      ),
      pg(
        '🍃',
        'Next morning, Nana Tortoise collected huge banana leaves. She made a small shade stall with benches and a big leaf roof. She painted a sign: “Cool Corner: sit for one pesewa.” She worked slowly and carefully, as tortoises do, and by noon it was ready. Old Elephant was the first to arrive. “Ahh!” he sighed. “What a clever tortoise!”',
        'A wise tortoise building a cool shady stall roofed with big green banana leaves over wooden benches.'
      ),
      pg(
        '🌟',
        'Soon all the animals came to rest in the Cool Corner, and they bought yams afterwards, since they felt better. The other sellers were pleased too! Nana Tortoise did not need to lower her price, because nobody else sold shade. The six yam sellers asked her to teach them how she thought of it.',
        'Animals resting happily on benches under the leafy shade stall while yam sellers wave from nearby.'
      ),
      pg(
        '💡',
        '“I did not do what everyone does,” said Nana Tortoise, with a slow smile. “I looked for what was missing, and I found it.” Try it! Look around your class, your street, or your market. What do people need that nobody gives them? Think of one small idea, and tell a friend or a grown-up about it.',
        'Nana Tortoise smiling warmly inside her leafy shade stall.'
      ),
    ],
    activities: [
      {
        id: 'qc-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'How many animals sold yams?',
        options: [
          'Six',
          'Two',
          'One',
        ],
        correctIndex: 0,
      },
      {
        id: 'qc-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did the market not have at noon?',
        options: [
          'Shade',
          'Yams',
          'Water',
        ],
        correctIndex: 0,
      },
      {
        id: 'qc-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What did Nana Tortoise sell?',
        options: [
          'Shade and a place to rest',
          'Yams',
          'Hats',
        ],
        correctIndex: 0,
      },
      {
        id: 'qc-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: Many children at school sell sweets. What could you do first?',
        options: [
          'Sell the same sweets cheaper',
          'Look for something people need that nobody gives',
          'Wait',
        ],
        correctIndex: 1,
      },
      {
        id: 'qc-s1',
        type: 'sequencing',
        prompt: 'Put the fable in order.',
        items: [
          'Six animals sell the same yams',
          'Nana Tortoise watches the market all day',
          'She notices there is no shade',
          'She opens the Cool Corner',
        ],
      },
      {
        id: 'qc-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'notice',
        definition: 'To see or become aware of something.',
        distractors: [
          'To sell something',
          'To fall asleep',
        ],
      },
    ],
    glossary: [
      {
        word: 'market',
        definition: 'A place where people buy and sell.',
        pages: [1],
      },
      {
        word: 'noticed',
        definition: 'Saw or became aware of something.',
        pages: [2],
      },
      {
        word: 'shade',
        definition: 'A cool place out of the sun.',
        pages: [3],
      },
      {
        word: 'panting',
        definition: 'Breathing quickly because of heat or effort.',
        pages: [3],
      },
      {
        word: 'sign',
        definition: 'A board with words to tell people something.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'Big idea: Instead of copying what everyone does, look for what people need that is missing. The idea is explored further in “Zero to One” by Peter Thiel with Blake Masters (2014), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'This is an animal fable in a Ghanaian forest setting, written for the story. It is not a traditional tale.',
    ],
    reviewQuestions: [
      'Check that the animal characters suit your learners.',
      'Check that it is clear this is an invented fable.',
    ],
    guide: {
      overview:
        'An animal fable about noticing what is missing.',
      lessonMinutes: 30,
      goals: [
        'Retell the fable in order.',
        'Explain why Nana Tortoise did not sell yams.',
        'Find a need around you.',
      ],
      subjects: [
        ['Our World Our People (NaCCA CCP primary: work and meeting needs; codes to verify)', 'Noticing needs'],
        ['Creative Arts (NaCCA CCP primary: drama and storytelling; codes to verify)', 'Acting a fable'],
      ],
      before: ['Ask: why do many people sell the same things?'],
      during: ['Stop after Page 2. Ask: what do you think Nana Tortoise will notice?'],
      after: ['Pupils act out the fable with leaf hats.'],
      discussion: ['Why was the Cool Corner helpful to the yam sellers too?'],
      reflection: ['What do people need that nobody gives them?'],
      maths: [],
      support: ['Draw the market with six stalls and one shade stall.'],
      stretch: ['Invent a new fable in which a clever animal finds a missing need.'],
      localise: ['What shaded places do people use near you, and who makes them?'],
      factCheck: ['This is an invented fable. The book’s title, authors, and year are given from general knowledge.'],
    },
  }),

  // 4
  mk({
    key: 'kid-the-three-kites',
    title: 'The Three Kites',
    summary:
      'Selasi wants to make a hundred kites for the harvest festival. His sister asks him to make three first. A story about trying small and learning fast.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'trying-small', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Cheerful, bright, and simple',
    palette: ['#0369a1', '#c026d3'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Selasi: a creative boy in Basic 5 who loves kites.',
      'Efua: his older sister, who is careful and kind.',
      'Grandma Adwoa: their grandmother, who sells at the festival.',
    ],
    music: 'Light guitar with a bright flute (placeholder)',
    pages: [
      pg(
        '🪁',
        'The harvest festival was one month away. Selasi had a big idea. “I will make a hundred kites and sell them all!” he told his sister Efua. His eyes shone. “I will buy a lot of paper and sticks today.” Efua looked at him kindly. “A hundred is a lot. What if something goes wrong?”',
        'A boy spreading his arms wide with excitement while his older sister listens kindly.'
      ),
      pg(
        '3️⃣',
        '“Why not make only three first?” said Efua. “Fly them. See what happens. Then decide.” Selasi did not want to wait. But he thought about it. “If I make a hundred and they are bad, I lose all my pocket money. If I make three and they are bad, I lose a little.” He nodded. “Three it is.”',
        'A boy and his sister sitting on a mat with three small handmade kites.'
      ),
      pg(
        '🌬️',
        'They flew the three kites on the hill. The first one flew well, but the paper tore in the wind. The second would not go up at all because it was too heavy. The third flew beautifully, high and steady. Selasi laughed and groaned at once. “I am glad I did not make a hundred paper ones!”',
        'On a breezy green hill: one kite with a torn wing, one heavy kite on the grass, and one kite flying high in the sky.'
      ),
      pg(
        '✏️',
        'That night Selasi wrote in his book: “Paper tears. Heavy sticks do not fly. Light sticks fly well.” He asked Grandma Adwoa, “What is strong and light?” She brought thin plastic from old bags. He made three more kites with plastic and light sticks. This time, all three flew high, and the wind could not tear them.',
        'A boy making colourful kites from thin plastic and light bamboo sticks beside his grandmother.'
      ),
      pg(
        '🎉',
        'Now Selasi was ready. He made ten kites with plastic and light sticks. At the festival, Grandma Adwoa put them on her table. Nine were sold by noon! Every child who bought one ran to the field. Selasi earned enough to buy paper and sticks for a bigger batch, and to put some aside.',
        'A table of bright colourful kites with happy children buying them at a sunny village festival.'
      ),
      pg(
        '💡',
        '“If I had made a hundred paper kites,” Selasi told Efua, “I would have lost everything.” She smiled. “A small try is a good teacher.” Try it! If you have a big idea, what is the smallest way to try it? Try it, write down what you learned, and then decide what to do next.',
        'A boy and his sister flying a bright kite together high above a green hill.'
      ),
    ],
    activities: [
      {
        id: 'qd-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'How many kites did Selasi first plan to make?',
        options: [
          'A hundred',
          'Ten',
          'Three',
        ],
        correctIndex: 0,
      },
      {
        id: 'qd-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why did Efua suggest making three first?',
        options: [
          'So that Selasi would lose little if they were bad',
          'Because three is lucky',
          'She did not like kites',
        ],
        correctIndex: 0,
      },
      {
        id: 'qd-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What did Selasi learn about paper kites?',
        options: [
          'Paper tears and heavy sticks do not fly',
          'They always fly well',
          'They cost too much',
        ],
        correctIndex: 0,
      },
      {
        id: 'qd-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: You want to bake a lot of buns to sell. What is a good first step?',
        options: [
          'Bake a hundred at once',
          'Bake a few and see how they taste and sell',
          'Wait a year',
        ],
        correctIndex: 1,
      },
      {
        id: 'qd-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'Selasi plans a hundred kites',
          'Efua suggests making three first',
          'The three kites teach him what works',
          'He makes better kites and sells ten',
        ],
      },
      {
        id: 'qd-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'try',
        definition: 'To test something to see how it works.',
        distractors: [
          'To tear paper',
          'To fly high',
        ],
      },
    ],
    glossary: [
      {
        word: 'festival',
        definition: 'A special celebration, often with food and music.',
        pages: [1],
      },
      {
        word: 'pocket',
        definition: 'A small pouch in clothes; pocket money is a child’s spending money.',
        pages: [2],
      },
      {
        word: 'plastic',
        definition: 'A light material used to make bags and bottles.',
        pages: [4],
      },
      {
        word: 'batch',
        definition: 'A group of things made at the same time.',
        pages: [5],
      },
      {
        word: 'learned',
        definition: 'Gained knowledge or skill.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Try a small, cheap test first, notice what happens, learn from it, and then do more. The idea is explored further in “The Lean Startup” by Eric Ries (2011), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'Safety: kites should be flown away from roads, electric lines, and water, and never in thunderstorms.',
    ],
    reviewQuestions: [
      'Check kite safety guidance (open space, away from power lines and roads).',
      'Check that reusing plastic bags is suitable.',
    ],
    guide: {
      overview:
        'A simple story about making a small test first and learning from it.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Explain why three kites were wiser than a hundred.',
        'Plan a small test.',
      ],
      subjects: [
        ['Creative Arts (NaCCA CCP primary: making and designing; codes to verify)', 'Making a kite'],
        ['Science (NaCCA CCP primary: forces and flying; codes to verify)', 'Wind and flight'],
      ],
      before: ['Ask: have you ever made something that did not work the first time?'],
      during: ['Stop after Page 2. Ask: what could go wrong with a hundred?'],
      after: ['Pupils make three small paper planes and test which one flies best.'],
      discussion: ['Why is a small mistake a good teacher?'],
      reflection: ['What small test could you try this week?'],
      maths: [
        {
          task: 'Selasi made 10 kites and sold 9. How many were left?',
          answer: '10 - 9 = 1.',
        },
      ],
      support: ['Make and test paper planes.'],
      stretch: ['Draw a plan for a better kite and list what to test.'],
      localise: ['What festivals or games near you use kites or toys that children make?'],
      factCheck: ['The story is fiction. Kite safety advice should be given by the teacher. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 5
  mk({
    key: 'kid-the-lantern-maker',
    title: 'The Lantern Maker and the Little Light',
    summary:
      'Mr Ofosu makes the best lanterns in town. When a girl shows him a small solar lamp, he laughs. A story about listening to new ideas, even small ones.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'change', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Calm, warm, and clear',
    palette: ['#b45309', '#1d4ed8'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Mr Ofosu: a proud lantern maker who has worked for forty years.',
      'Dede: a bright girl in Basic 6 who fixes small lamps.',
      'Maame Rita: a customer who works late at her stall.',
    ],
    music: 'Warm guitar with a soft drum (placeholder)',
    pages: [
      pg(
        '🏮',
        'Mr Ofosu was the best lantern maker in the town. His lanterns were strong, bright, and beautiful. People came from far to buy them. “Nobody makes lanterns like mine,” he said proudly. For forty years he had made the same fine lanterns, a little better each year. He knew every nail and every handle, and he was happy with his work.',
        'A proud older craftsman hanging shining metal-and-glass lanterns in his workshop.'
      ),
      pg(
        '💡',
        'One day, Dede, a girl from Basic 6, came with a small lamp. “It has a little panel that takes the sun’s light,” she said. “At night, it shines without oil.” Mr Ofosu laughed kindly. “That tiny thing? It is a toy. It is not as bright as my lanterns.” Dede smiled and left it on his counter.',
        'A young girl placing a small solar lamp on a wooden counter while an older craftsman laughs kindly.'
      ),
      pg(
        '👀',
        'Soon more people carried small lamps. Maame Rita, who sold at the market until late, bought one. “My eyes sting from the smoke of the old lantern,” she said. “This little lamp is clean, and I do not need to buy oil.” Mr Ofosu noticed that fewer people came to his shop. He felt worried, but he did not know why.',
        'A market woman using a clean glowing small solar lamp at her evening stall.'
      ),
      pg(
        '👂',
        'At last, Mr Ofosu went to Maame Rita’s stall and asked, “Why do you like the small lamp?” She told him: it was clean, it was cheap to use, and it could be moved easily. He listened. Then he asked Dede, “Will you show me how it works?” Dede was glad to teach him.',
        'An older craftsman listening attentively to a market woman and a young girl at her stall.'
      ),
      pg(
        '🔧',
        'Mr Ofosu was a clever maker. He used his skill to make strong, beautiful solar lanterns with his lovely handles and glass. People loved them! His shop was busy again, and Dede helped him to fix lamps when they stopped working. Together they made the best solar lanterns in town.',
        'An older craftsman and a young girl assembling a sturdy solar lantern together at a workbench.'
      ),
      pg(
        '💡',
        'Mr Ofosu told his friends, “I almost missed it because I only listened to what I already knew. I am glad I asked.” Try it! If someone shows you a new, small idea, do not laugh. Ask, “How does it work? Why do you like it?” You might learn something big.',
        'An older craftsman and a young girl smiling proudly beside a shelf of glowing solar lanterns.'
      ),
    ],
    activities: [
      {
        id: 'qe-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What was special about Dede’s small lamp?',
        options: [
          'It took light from the sun and needed no oil',
          'It was very big',
          'It was made of gold',
        ],
        correctIndex: 0,
      },
      {
        id: 'qe-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did Maame Rita like it?',
        options: [
          'It was clean, cheap to use, and easy to move',
          'It was heavy',
          'It was loud',
        ],
        correctIndex: 0,
      },
      {
        id: 'qe-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What did Mr Ofosu do that was wise?',
        options: [
          'He asked questions and listened',
          'He closed his shop',
          'He ignored everyone',
        ],
        correctIndex: 0,
      },
      {
        id: 'qe-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: A younger child shows you a new game you do not know. What should you do?',
        options: [
          'Laugh at it',
          'Ask how it works and listen',
          'Walk away',
        ],
        correctIndex: 1,
      },
      {
        id: 'qe-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'Mr Ofosu is proud of his lanterns',
          'Dede shows him a small solar lamp and he laughs',
          'Fewer people come to his shop',
          'He asks questions and learns to make solar lanterns',
        ],
      },
      {
        id: 'qe-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'listen',
        definition: 'To pay attention to what someone says.',
        distractors: [
          'To make a lamp',
          'To sell oil',
        ],
      },
    ],
    glossary: [
      {
        word: 'lantern',
        definition: 'A lamp with a handle that you can carry.',
        pages: [1],
      },
      {
        word: 'panel',
        definition: 'A flat part that takes light from the sun.',
        pages: [2],
      },
      {
        word: 'smoke',
        definition: 'The grey cloud that comes from burning something.',
        pages: [3],
      },
      {
        word: 'listened',
        definition: 'Paid attention to what someone said.',
        pages: [4],
      },
      {
        word: 'solar',
        definition: 'Using the sun’s light or heat.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'Big idea: Successful people and places can miss simple new ideas if they only listen to what they already know; they must also listen to new voices. The idea is explored further in “The Innovator’s Dilemma” by Clayton M. Christensen (1997), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'The story respects the lantern maker’s skill. He succeeds by combining it with the new idea.',
    ],
    reviewQuestions: [
      'Check that the description of solar lamps is realistic.',
      'Check that the old lantern maker is shown with respect.',
    ],
    guide: {
      overview:
        'A story about listening to new ideas and combining them with old skills.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Explain why Mr Ofosu laughed at first.',
        'Say how to listen to new ideas.',
      ],
      subjects: [
        ['Science (NaCCA CCP primary: energy from the sun; codes to verify)', 'Solar lamps'],
        ['Our World Our People (NaCCA CCP primary: work and change in the community; codes to verify)', 'Old skills and new ideas'],
      ],
      before: ['Ask: what new thing has changed how your family does something?'],
      during: ['Stop after Page 3. Ask: why are fewer people coming to the shop?'],
      after: ['Pupils ask one grown-up about a new tool that changed their work.'],
      discussion: ['What did Mr Ofosu do well in the end?'],
      reflection: ['Which new idea have you laughed at too soon?'],
      maths: [],
      support: ['Draw the old lantern and the new solar lantern side by side.'],
      stretch: ['Find out how a solar panel works.'],
      localise: ['Who near you uses solar lamps or panels?'],
      factCheck: ['The story is fiction. The solar lamp description should be checked by a science teacher. The book’s title, author, and year are given from general knowledge.'],
    },
  }),

  // 6
  mk({
    key: 'kid-ama-and-the-neem-tree',
    title: 'Ama and the Little Neem Tree',
    summary:
      'A long dry spell makes the village tired and sad. Ama chooses one small job each day: watering a little neem tree. A gentle story about finding a reason to keep going.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'purpose', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Quiet, gentle, and slowly brightening',
    palette: ['#15803d', '#78350f'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Ama: a patient girl in Basic 5 who loves growing things.',
      'Nana Yaa: her grandmother, who is tired but kind.',
      'The neighbours: tired families who slowly join in.',
    ],
    music: 'Soft flute with a calm drum (placeholder)',
    pages: [
      pg(
        '☀️',
        'The rains were late that year. Every day was hot and dry. The ground cracked, and the leaves hung low. The people of the village were tired and quiet. “Why bother?” they said. “It will not rain.” Even Nana Yaa sat on her stool all day, sighing. Ama felt a heavy feeling in her chest.',
        'A dry village compound with cracked earth and tired villagers sitting quietly in the shade.'
      ),
      pg(
        '🌱',
        'One morning, Ama found a tiny neem seedling growing by the path, no taller than her hand. It was dry and drooping. “Poor little tree,” she said. “Nobody is caring for you.” She had an idea. “I cannot make it rain. But I can give this little tree one cup of water every day.”',
        'A young girl kneeling gently beside a tiny drooping neem seedling by a dry footpath.'
      ),
      pg(
        '🥣',
        'Every morning, Ama woke up and thought, “My tree is waiting!” She saved a little water from her washing, and she poured it carefully around the roots. She pulled a weed. She put a few stones to keep off the goats. The work was small. But when she did it, her heavy feeling grew lighter.',
        'A young girl pouring a small cup of water around a tiny seedling ringed with protective stones.'
      ),
      pg(
        '🌿',
        'After two weeks, the seedling stood up straight, and a new green leaf opened. Ama ran to show Nana Yaa. “Look, Grandma!” Nana Yaa smiled for the first time in days. “A new leaf,” she whispered. “You have a reason to get up each morning, my child. That is a good thing.”',
        'A grandmother and her granddaughter smiling warmly at a fresh green leaf on the young seedling.'
      ),
      pg(
        '🤝',
        'The neighbours saw Ama with her little tree. A boy brought a cup of water. A woman put up a small fence. Soon more people were caring for the seedlings that grew along the path. They talked and laughed as they worked. When at last the rain came, the whole village danced, and the little neem trees drank deeply.',
        'Neighbours caring for young trees along a village path and rejoicing as gentle rain begins to fall.'
      ),
      pg(
        '💡',
        'Ama learned that when times are hard, a small job that matters can help us keep going. You do not have to do something big. A little task each day can give you a reason to smile. If you ever feel sad for a long time, tell a grown-up you trust. Try it! What small job could you do each day this week?',
        'Ama and her grandmother smiling beside a healthy, growing young neem tree.'
      ),
    ],
    activities: [
      {
        id: 'qf-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What was the problem in the village?',
        options: [
          'The rains were late and it was dry',
          'There was too much rain',
          'The school was closed',
        ],
        correctIndex: 0,
      },
      {
        id: 'qf-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What small job did Ama do each day?',
        options: [
          'She watered a little neem tree',
          'She sold water',
          'She dug a well',
        ],
        correctIndex: 0,
      },
      {
        id: 'qf-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What did Nana Yaa say about Ama’s job?',
        options: [
          'It gave her a reason to get up each morning',
          'It was useless',
          'It was too hard',
        ],
        correctIndex: 0,
      },
      {
        id: 'qf-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: A friend is feeling low. What small job could you invite them to do?',
        options: [
          'Nothing',
          'Help you water a plant or draw a picture',
          'Stay home',
        ],
        correctIndex: 1,
      },
      {
        id: 'qf-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'The rains are late and the village is sad',
          'Ama finds a small seedling',
          'She waters it every day',
          'Neighbours join in and the rain comes',
        ],
      },
      {
        id: 'qf-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'seedling',
        definition: 'A very young plant.',
        distractors: [
          'A kind of stone',
          'A watering can',
        ],
      },
    ],
    glossary: [
      {
        word: 'dry',
        definition: 'Without water or rain.',
        pages: [1],
      },
      {
        word: 'seedling',
        definition: 'A very young plant.',
        pages: [2],
      },
      {
        word: 'roots',
        definition: 'The parts of a plant that grow in the soil.',
        pages: [3],
      },
      {
        word: 'neighbours',
        definition: 'People who live near you.',
        pages: [5],
      },
      {
        word: 'reason',
        definition: 'A cause or purpose for doing something.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'Big idea: Having a small, meaningful job and a reason to get up can help people carry on through hard times. The idea is explored further in “Man’s Search for Meaning” by Viktor E. Frankl (1946), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'Sensitive: the book was written about very painful events. This story uses only a small, safe idea of purpose and has no frightening events. Children who feel sad for a long time should talk to a trusted adult.',
    ],
    reviewQuestions: [
      'Check that the water use is realistic and that a child is not shown wasting scarce water.',
      'Make sure the school has counselling contacts available.',
    ],
    guide: {
      overview:
        'A gentle story about a small daily job that gives a reason to keep going.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Explain how the tree helped Ama.',
        'Choose a small job of your own.',
      ],
      subjects: [
        ['Our World Our People (NaCCA CCP primary: caring for the environment and others; codes to verify)', 'Caring for plants and each other'],
        ['Science (NaCCA CCP primary: plants and growth; codes to verify)', 'What plants need'],
      ],
      before: ['Ask: what do you do when you feel sad or tired?'],
      during: ['Stop after Page 2. Ask: what small thing can Ama do?'],
      after: ['Pupils plant a seed and care for it for a week.'],
      discussion: ['Why did a small job help Ama and the village?'],
      reflection: ['What small job gives you a reason to smile?'],
      maths: [],
      support: ['Plant beans in a cup and watch them grow.'],
      stretch: ['Find out why neem trees are useful.'],
      localise: ['What trees are planted near your school or homes?'],
      factCheck: ['The story is fiction. The book’s title, author, and year are given from general knowledge; the book’s content is not retold.'],
    },
  }),

  // 7
  mk({
    key: 'kid-the-neatest-class',
    title: 'The Neatest Class',
    summary:
      'Basic 5 wants to win the Neatest Class prize. Their teacher does not talk about the prize. She gives them three small daily habits. A story about doing small things well.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'habits', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Brisk, warm, and encouraging',
    palette: ['#15803d', '#ca8a04'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Mrs Opoku: the Basic 5 class teacher, calm and fair.',
      'Kofi: the class prefect, who wants the prize badly.',
      'Nana: the quietest girl in the class, who loves to sweep.',
    ],
    music: 'Lively drums with a bright bell (placeholder)',
    pages: [
      pg(
        '🏆',
        'At school, there was a prize for the Neatest Class of the term. Basic 5 wanted it badly. Kofi, the prefect, made posters. “We must win!” he said. The class shouted and cheered. But their classroom was still dusty, their books were untidy, and nobody remembered whose turn it was to sweep.',
        'Children cheering and waving colourful drawings in an untidy classroom with scattered books.'
      ),
      pg(
        '🧹',
        'Mrs Opoku listened to the shouting. “Is anyone thinking about the prize more than the floor?” she asked gently. Kofi looked down. “Today,” she said, “we will not talk about winning. We will talk about three small things we can do every day.” She wrote on the board: Sweep. Wipe. Tidy.',
        'A friendly woman teacher standing at the classroom board speaking calmly while children listen.'
      ),
      pg(
        '📅',
        'Every day, two pupils swept before school. Two wiped the board and desks. Everyone tidied their own books at the end of the day. Nana, the quietest girl, swept very well. Nobody clapped or shouted. It was boring at first. But after a week, the classroom smelled fresh and looked bright.',
        'Children sweeping the floor, wiping desks, and stacking books neatly in a bright classroom.'
      ),
      pg(
        '🤝',
        'A few weeks later, Kofi noticed something. “We have not made a poster for ages,” he said, surprised. “And I have not worried about the prize.” The class felt calm and proud. Visitors said, “What a pleasant classroom!” Mrs Opoku smiled. “Small things done every day change a class more than loud wishes.”',
        'A visiting teacher smiling warmly at the neat classroom while children read quietly at their desks.'
      ),
      pg(
        '🌟',
        'At the end of the term, Basic 5 was named the Neatest Class. They clapped and smiled. But Kofi said, “The prize is nice, but the best part is how our classroom feels every day.” Mrs Opoku nodded. “You cannot make the prize come. But you can do the small things, and the prize often follows.”',
        'A happy class smiling together in a spotless, sunlit classroom with Mrs Opoku holding a golden ribbon.'
      ),
      pg(
        '💡',
        'Try it! What three small things could you do every day at home or at school? Write them down, put the list where you can see it, and try them for one week. Do not wait for a prize. Just notice how you feel at the end of the week, and tell a friend.',
        'A child sitting at a tidy desk writing neatly in a plain notebook.'
      ),
    ],
    activities: [
      {
        id: 'qg-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did Basic 5 want?',
        options: [
          'The Neatest Class prize',
          'A holiday',
          'New desks',
        ],
        correctIndex: 0,
      },
      {
        id: 'qg-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What three words did Mrs Opoku write on the board?',
        options: [
          'Sweep, wipe, tidy',
          'Run, jump, shout',
          'Read, write, draw',
        ],
        correctIndex: 0,
      },
      {
        id: 'qg-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What did Kofi notice after some weeks?',
        options: [
          'They had stopped worrying about the prize',
          'The prize was gone',
          'The class was untidy',
        ],
        correctIndex: 0,
      },
      {
        id: 'qg-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: You want to do well in reading. What small daily habit could help?',
        options: [
          'Read for ten minutes each day',
          'Read once a year',
          'Wait for a prize',
        ],
        correctIndex: 0,
      },
      {
        id: 'qg-s1',
        type: 'sequencing',
        prompt: 'Put the story in order.',
        items: [
          'Basic 5 wants the prize and shouts about it',
          'Mrs Opoku writes three small habits',
          'The class does them every day',
          'They are named the Neatest Class',
        ],
      },
      {
        id: 'qg-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'habit',
        definition: 'Something you do again and again.',
        distractors: [
          'A prize',
          'A poster',
        ],
      },
    ],
    glossary: [
      {
        word: 'prize',
        definition: 'A reward for doing well.',
        pages: [1],
      },
      {
        word: 'prefect',
        definition: 'A pupil chosen to help keep order.',
        pages: [1],
      },
      {
        word: 'tidy',
        definition: 'Neat and in order.',
        pages: [2],
      },
      {
        word: 'visitors',
        definition: 'People who come to see a place.',
        pages: [4],
      },
      {
        word: 'pleasant',
        definition: 'Nice and enjoyable.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'Big idea: Focus on doing small things well every day, and good results will often follow; we cannot control the prize, only our habits. The idea is explored further in “The Score Takes Care of Itself” by Bill Walsh with Steve Jamison and Craig Walsh (2009), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'The teacher is firm but kind. The story does not suggest that pupils should clean without breaks or in unsafe ways.',
    ],
    reviewQuestions: [
      'Check that cleaning duties are shared fairly and that pupils are not made to do unsafe tasks.',
      'Check the sum: 2 × 5 = 10.',
    ],
    guide: {
      overview:
        'A class story about doing small things well each day instead of chasing a prize.',
      lessonMinutes: 30,
      goals: [
        'Retell the story in order.',
        'Name the three habits.',
        'Choose three habits for yourself.',
      ],
      subjects: [
        ['Our World Our People (NaCCA CCP primary: caring for our school and environment; codes to verify)', 'Keeping the classroom clean'],
        ['Mathematics (NaCCA CCP primary: multiplication; codes to verify)', 'Counting turns and days'],
      ],
      before: ['Ask: what makes a classroom a good place to learn?'],
      during: ['Stop after Page 2. Ask: why did Mrs Opoku not talk about the prize?'],
      after: ['Pupils make a rota for sharing the classroom jobs.'],
      discussion: ['Why was Nana’s quiet work important?'],
      reflection: ['Which three small habits would help you most?'],
      maths: [
        {
          task: 'Two pupils sweep each day for 5 school days. How many sweeping turns is that in total?',
          answer: '2 × 5 = 10 turns.',
        },
      ],
      support: ['Make a poster with Sweep, Wipe, Tidy and a rota.'],
      stretch: ['Find a small daily habit that helps your family and try it for a week.'],
      localise: ['What daily habits keep your school or community clean?'],
      factCheck: ['The story is fiction. The book’s title, authors, and year are given from general knowledge.'],
    },
  }),

  // 8
  mk({
    key: 'kid-the-wishing-calabash',
    title: 'The Wishing Calabash',
    summary:
      'Kwesi finds a calabash that gives exactly what he says, not what he means. A funny fable about saying clearly what you want, and checking the result.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['educational', 'school-life'],
    themes: ['community', 'school'],
    objectives: ['reasoning', 'kindness', 'responsibility', 'emotional-intelligence'],
    ghanaianContext: 'central',
    culturalTags: ['big-ideas', 'junior', 'clear-words', 'fable', 'ghanaian-setting'],
    wpm: 100,
    paceWord: 'Playful, funny, and clear',
    palette: ['#7c2d12', '#0f766e'],
    voice: 'A warm, slow storyteller, with a different voice for each character',
    characters: [
      'Kwesi: a cheerful boy in Basic 4 with a big sweet tooth.',
      'Nana Aba: his wise grandmother, who sees what happens.',
      'The ants: a long line of small visitors who love sweet things.',
    ],
    music: 'Playful drum with a bright flute (placeholder)',
    pages: [
      pg(
        '🥣',
        'Kwesi found a round calabash behind the house. “Make a wish!” said a small voice inside. Kwesi laughed. “I wish for all the sweets in the village!” The calabash gave a hum. In a moment, the room was full. Sweets, sweets, and more sweets, in heaps up to the ceiling. Kwesi could hardly move.',
        'A boy in a room piled high with colourful wrapped sweets around a carved calabash bowl, looking surprised.'
      ),
      pg(
        '🐜',
        'At first Kwesi was delighted. But soon the ants arrived in a long line. Then the flies came. The sweets began to melt in the heat and stick to everything. The shopkeepers came, crying, “Where are our sweets?” The village children had none left. Kwesi’s tummy ached. “Oh no,” he said. “This is a mess!”',
        'A long line of ants marching toward piles of melting sweets while villagers peer through the doorway.'
      ),
      pg(
        '👵',
        'Nana Aba came and looked around. “The calabash did exactly what you said,” she told him. “You wished for all the sweets. You did not say, ‘Only a few,’ or ‘Not belonging to others.’ A wish needs to say clearly what you want, and what you do not want.” Kwesi nodded sadly. “How do I fix it?”',
        'A wise grandmother speaking gently to a boy surrounded by heaps of colourful sweets.'
      ),
      pg(
        '🗣️',
        '“Ask again, more carefully,” said Nana Aba. Kwesi took a deep breath. “Please, calabash, give all the sweets back to the shopkeepers, and leave me five sweets to share with my friends. Please do not harm anybody.” The calabash hummed. Whoosh! The sweets flew out of the window back to their shops. Five were left on the table.',
        'A boy speaking politely to the round calabash on a table as colourful sweets swirl out through the open window.'
      ),
      pg(
        '🍬',
        'Kwesi shared his five sweets with his friends and thanked the ants for leaving. He felt a little foolish, but also wiser. “Next time I want something,” he said, “I will say clearly what I want, what I do not want, and I will check what happens.” Nana Aba smiled. “That is good advice for people and machines.”',
        'Five happy children sharing five colourful sweets on a clean veranda while Nana Aba smiles.'
      ),
      pg(
        '💡',
        'Today, machines like computers and phones can follow instructions, just like the calabash. They do exactly what we say, and sometimes not what we mean. So ask clearly, check the answer, and ask a grown-up if you are not sure. Try it! Write a clear wish for the calabash. What must it do? What must it never do?',
        'A boy sitting at a wooden table writing carefully in his plain notebook beside the empty calabash.'
      ),
    ],
    activities: [
      {
        id: 'qh-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What did Kwesi wish for?',
        options: [
          'All the sweets in the village',
          'A new bicycle',
          'A hundred pencils',
        ],
        correctIndex: 0,
      },
      {
        id: 'qh-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What did Nana Aba say a wish needs?',
        options: [
          'To say clearly what you want and do not want',
          'To be loud',
          'To be short',
        ],
        correctIndex: 0,
      },
      {
        id: 'qh-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How did Kwesi fix the mess?',
        options: [
          'He asked again, carefully and politely',
          'He ate them all',
          'He ran away',
        ],
        correctIndex: 0,
      },
      {
        id: 'qh-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Try it: You ask a computer helper to “make my story shorter” and it deletes the end. What could you do next time?',
        options: [
          'Say what must be kept and check the result',
          'Stop writing',
          'Ask nothing',
        ],
        correctIndex: 0,
      },
      {
        id: 'qh-s1',
        type: 'sequencing',
        prompt: 'Put the fable in order.',
        items: [
          'Kwesi wishes for all the sweets',
          'The room fills and ants arrive',
          'Nana Aba explains what went wrong',
          'Kwesi makes a clear, careful wish',
        ],
      },
      {
        id: 'qh-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'clearly',
        definition: 'In a way that is easy to understand.',
        distractors: [
          'In a loud voice',
          'In a hurry',
        ],
      },
    ],
    glossary: [
      {
        word: 'calabash',
        definition: 'A large dry gourd used as a bowl or container.',
        pages: [1],
      },
      {
        word: 'delighted',
        definition: 'Very happy.',
        pages: [2],
      },
      {
        word: 'clearly',
        definition: 'In a way that is easy to understand.',
        pages: [3],
      },
      {
        word: 'carefully',
        definition: 'Taking time to avoid mistakes.',
        pages: [4],
      },
      {
        word: 'instructions',
        definition: 'Words that tell you what to do.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'Big idea: Machines and wishes follow the words we give them, so we must say clearly what we want and what we do not want, and check the result. The idea is explored further in “Superintelligence” by Nick Bostrom (2014), a book for adults. This piece is original and does not quote or summarise the book.',
      'Original piece written for Ghanaian Basic 4 to 6 learners. It teaches an idea discussed in a published book for adults but copies none of the book’s text, examples, or structure, and it is a different story from the version for older learners.',
      'This is an invented fable about wishes and clear words. It is not a traditional tale, and it does not describe frightening machines.',
    ],
    reviewQuestions: [
      'Check that the fable is clearly marked as invented.',
      'Check that the closing note on machines fits the school’s rules for technology.',
    ],
    guide: {
      overview:
        'A funny fable about clear instructions and checking the results, with a short link to computers.',
      lessonMinutes: 30,
      goals: [
        'Retell the fable in order.',
        'Explain what went wrong with the first wish.',
        'Write a clear instruction.',
      ],
      subjects: [
        ['English Language (NaCCA CCP primary: speaking and writing clearly; codes to verify)', 'Giving clear instructions'],
        ['Computing (NaCCA CCP primary: safe use of technology; codes to verify)', 'Machines follow words'],
      ],
      before: ['Ask: what happens if you give an unclear instruction?'],
      during: ['Stop after Page 2. Ask: what should Kwesi have said?'],
      after: ['Pupils write and test clear instructions for a partner who acts like a robot.'],
      discussion: ['Why did the calabash give such a mess?'],
      reflection: ['When did unclear words cause trouble for you?'],
      maths: [],
      support: ['Play the robot game with a partner.'],
      stretch: ['Write a new fable about a careless wish.'],
      localise: ['What wish stories are told in your language?'],
      factCheck: ['This is an invented fable. Statements about computers are simple and will date. The book’s title, author, and year are given from general knowledge.'],
    },
  }),
];

export const BATCH_56_BIG_IDEAS_JUNIOR = BATCH_56_STORIES;
