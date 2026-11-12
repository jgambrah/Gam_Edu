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
 * Batch 29: Games and play. Eight original rhymes for nursery to primary 4: ampe, oware, skipping, hide and seek,
 * tug of war, kites, playing fair and a ball that rolls to the road. Verses are original. Game descriptions are kept
 * general because rules differ from place to place; reviewers should confirm them. Drafts awaiting review.
 */

export const BATCH_29_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'rhyme-clap-and-jump-ampe',
    title: 'Clap and Jump (an ampe-style game rhyme)',
    summary: 'A clapping and jumping game rhyme in the spirit of the children’s game ampe, with a count, a clap and a fair turn for everyone.',
    classIds: ['kg-1', 'kg-2'], ageMin: 4, ageMax: 6, readingLevel: 'pre-reader', difficulty: 1,
    genres: ['rhyme', 'poetry', 'cultural'], themes: ['friendship', 'community'], objectives: ['counting', 'phonics', 'teamwork', 'cultural-heritage'],
    ghanaianContext: 'central', wpm: 70, paceWord: 'Fast and rhythmic, then slower for the last verse', palette: ['#f97316', '#8b5cf6'],
    voice: 'Lively voice with clear clap beats', characters: ['Two girls and a boy in school uniforms clapping and jumping in a playground in turns.'],
    music: 'A clapping rhythm only, with no instruments (placeholder)',
    pages: [
      pg('👏', 'Clap, clap: one, two, three!\nJump up high and then jump free.', 'Children clapping and jumping.', 'Clap on each beat.'),
      pg('🦶', 'One foot out and one foot in.\nSmile and clap; now let us begin!', 'Two children facing each other with one foot forward.', 'Stamp one foot out, then bring it in.'),
      pg('🔄', 'Now it is your turn; now it is mine.\nWe take our turns, and that is fine.', 'Children taking turns in a circle.', 'Point to a friend, then to yourself.'),
      pg('🤗', 'Win or lose, we laugh and play.\nFriends are friends at the end of the day.', 'Children hugging and laughing after the game.', 'Smile and shake hands.'),
    ],
    activities: [
      { id: 'cj-c1', type: 'comprehension', afterPage: 3, question: 'What do the children do in the game?', options: ['Take turns', 'Fight', 'Sleep'], correctIndex: 0 },
      { id: 'cj-ph', type: 'phonics', afterPage: 1, targetSound: 'ee', prompt: 'Which word rhymes with three?', options: ['free', 'jump', 'clap'], correctIndexes: [0] },
      { id: 'cj-ph2', type: 'phonics', afterPage: 3, targetSound: 'ine', prompt: 'Which word rhymes with mine?', options: ['fine', 'turn', 'take'], correctIndexes: [0] },
      { id: 'cj-sel', type: 'sel', afterPage: 4, prompt: 'How do you feel when you play with friends?', feelingOptions: ['Happy', 'Excited', 'Friendly', 'Proud'] },
    ],
    glossary: [
      { word: 'jump', definition: 'To push yourself up off the ground.', pages: [1] },
      { word: 'turn', definition: 'Your chance to do something, one after another.', pages: [3] },
      { word: 'friends', definition: 'People we like and play with.', pages: [4] },
    ],
    culturalNotes: ['Ampe is a clapping and jumping game played by children in Ghana. Rules and chants differ from place to place. This rhyme is original and does not set out the rules of ampe.'],
    reviewQuestions: ['Ask a teacher or parent to confirm that the movements are close to the game as children play it where you are.'],
    guide: {
      overview: 'A clapping and jumping rhyme. Form: four couplets. Rhyming pairs: three/free, in/begin, mine/fine, play/day. It teaches counting, turn-taking and fair play.',
      lessonMinutes: 15, goals: ['Keep a clapping beat.', 'Take turns.', 'Be a good winner and loser.'],
      subjects: [['Creative Arts', 'Rhythm and movement'], ['English Language', 'Rhyme']],
      before: ['Ask children which clapping games they know.'], during: ['Clap on each beat. Take care that children have space.'],
      after: ['Play in pairs or small groups on a safe flat surface.'], discussion: ['How do we know whose turn it is?'], reflection: ['How do you feel when you lose a game?'],
      support: ['Clap together before adding the jump.'], stretch: ['Make up a new clapping chant.'],
      localise: ['Invite children to teach the real game and its chants as they know them.'],
    },
  }),

  // 2
  mk({
    key: 'rhyme-seeds-in-the-pits-oware',
    title: 'Seeds in the Pits (an oware-style counting rhyme)',
    summary: 'A counting rhyme about a seed game in the spirit of oware, where seeds are dropped one by one into pits.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['rhyme', 'poetry', 'cultural'], themes: ['friendship', 'community'], objectives: ['counting', 'problem-solving', 'phonics', 'cultural-heritage'],
    ghanaianContext: 'central', wpm: 75, paceWord: 'Steady, with counting beats', palette: ['#92400e', '#16a34a'],
    voice: 'Calm, thoughtful voice; counting is slow and clear', characters: ['Two children sitting on a mat with a wooden board with two rows of pits and a bowl of seeds.'],
    music: 'A soft tapping, one tap for each seed (placeholder)',
    pages: [
      pg('🪵', 'We set the pits in two long rows,\nwith seeds to count as the game goes.', 'A wooden board with two rows of pits and seeds.', 'Open your hands like a board.'),
      pg('🌰', 'Take the seeds from one small pit.\nDrop one in each, and count bit by bit.', 'A child dropping one seed at a time into pits.', 'Count out loud with each drop.'),
      pg('🧠', 'Think, think, think before you play:\nwhich pit will help you win today?', 'Two children thinking over the board.', 'Tap your head.'),
      pg('🤝', 'Win or lose, we share a smile.\nA good game lasts a long, long while.', 'Two children shaking hands over the board.', 'Smile and shake hands.'),
    ],
    activities: [
      { id: 'os-c1', type: 'comprehension', afterPage: 2, question: 'What do you drop into each pit?', options: ['One seed', 'A stone', 'A whole bowl'], correctIndex: 0 },
      { id: 'os-ph', type: 'phonics', afterPage: 2, targetSound: 'it', prompt: 'Which word rhymes with pit?', options: ['bit', 'seed', 'count'], correctIndexes: [0] },
      { id: 'os-ph2', type: 'phonics', afterPage: 4, targetSound: 'ile', prompt: 'Which word rhymes with smile?', options: ['while', 'game', 'share'], correctIndexes: [0] },
      { id: 'os-sel', type: 'sel', afterPage: 4, prompt: 'How do you feel when you think hard in a game?', feelingOptions: ['Curious', 'Focused', 'Excited', 'Calm'] },
    ],
    glossary: [
      { word: 'pit', definition: 'A small hollow for holding seeds.', pages: [2] },
      { word: 'seeds', definition: 'Small hard parts of a plant; here they are used as counters.', pages: [2] },
      { word: 'count', definition: 'To say numbers one after another.', pages: [2] },
    ],
    culturalNotes: ['Oware is a well-known seed game played in Ghana and across West Africa, and it belongs to the wider mancala family. This rhyme gives only the first idea (dropping seeds one by one) and does not explain the full rules, which differ by place.'],
    reviewQuestions: ['Confirm that the sowing description (one seed in each pit) is right for the version children know.', 'Do not suggest that the game is only played by boys or by one group.'],
    guide: {
      overview: 'A counting rhyme about a seed game. Form: four couplets. Rhyming pairs: rows/goes, pit/bit, play/today, smile/while. It builds counting one by one, planning and fair play.',
      lessonMinutes: 20, goals: ['Count seeds one by one.', 'Think before a move.', 'Play fairly.'],
      subjects: [['Mathematics', 'Counting and one-to-one matching'], ['English Language', 'Rhyme']],
      before: ['Show a board or an egg box with seeds as counters.'], during: ['Count aloud as each seed drops.'],
      after: ['Play with an egg-box board in pairs.', 'Ask: if I have 6 seeds and drop one in each pit, how many pits do I fill?'],
      discussion: ['Why is it good to think before you move?'], reflection: ['How do you act when you lose?'],
      maths: [{ task: '6 seeds are dropped one in each pit. How many pits are filled?', answer: '6' }],
      support: ['Use big counters and a small board with only a few pits.'], stretch: ['Count by twos with the seeds in each pit.'],
      localise: ['Invite a family member to teach the real game and the names used locally.'],
    },
  }),

  // 3
  mk({
    key: 'rhyme-skip-skip-skip',
    title: 'Skip, Skip, Skip (a skipping rhyme)',
    summary: 'A skipping rhyme with a count that gets faster, and a safe place to play.',
    classIds: ['kg-1', 'kg-2', 'primary-1'], ageMin: 4, ageMax: 7, readingLevel: 'pre-reader', difficulty: 1,
    genres: ['rhyme', 'poetry'], themes: ['health-and-wellbeing', 'friendship'], objectives: ['counting', 'phonics', 'perseverance'],
    ghanaianContext: 'central', wpm: 75, paceWord: 'Quick and rhythmic', palette: ['#14b8a6', '#f43f5e'],
    voice: 'Brisk voice that speeds up on the counting', characters: ['Children skipping with a rope on a flat, clear school yard while two turn the rope.'],
    music: 'A quick beat on a small drum, matching the rope (placeholder)',
    pages: [
      pg('🪢', 'Turn the rope; turn it round.\nJump when it touches the ground!', 'Two children turn a rope while a third waits to jump.', 'Make circles with your arms.'),
      pg('🔢', 'One, two, three, four, five—\nwe keep on jumping, bright and alive!', 'A child jumping as others count.', 'Count faster and faster.'),
      pg('😮', 'Oh no! The rope has caught my toe.\nThat is all right—I try, and off I go!', 'A child whose foot caught in the rope, smiling.', 'Shrug and smile.'),
      pg('🌳', 'We skip on the flat and grassy ground,\nwhere no cars come and no hard stones are found.', 'Children skipping in a safe, clear yard.', 'Slow down to a calm voice.'),
    ],
    activities: [
      { id: 'sk-c1', type: 'comprehension', afterPage: 3, question: 'What does the child do when the rope catches?', options: ['Tries again', 'Cries and quits', 'Hides'], correctIndex: 0 },
      { id: 'sk-ph', type: 'phonics', afterPage: 1, targetSound: 'ound', prompt: 'Which word rhymes with round?', options: ['ground', 'rope', 'jump'], correctIndexes: [0] },
      { id: 'sk-ph2', type: 'phonics', afterPage: 3, targetSound: 'o', prompt: 'Which word rhymes with toe?', options: ['go', 'rope', 'try'], correctIndexes: [0] },
      { id: 'sk-sel', type: 'sel', afterPage: 4, prompt: 'How do you feel when you try again?', feelingOptions: ['Proud', 'Brave', 'Happy', 'Tired'] },
    ],
    glossary: [
      { word: 'rope', definition: 'A thick, strong string.', pages: [1, 3] },
      { word: 'jump', definition: 'To push yourself up off the ground.', pages: [1] },
      { word: 'alive', definition: 'Full of life and energy.', pages: [2] },
    ],
    culturalNotes: ['Skipping with ropes or knotted strings is a common school-yard game in many Ghanaian schools. The rhyme is original.'],
    reviewQuestions: ['Check that a safe place to play is clear and that the rhyme encourages trying again.'],
    guide: {
      overview: 'A skipping rhyme. Form: four couplets. Rhyming pairs: round/ground, five/alive, toe/go, ground/found. It teaches counting and perseverance.',
      lessonMinutes: 15, goals: ['Count to five and beyond.', 'Try again after a mistake.', 'Choose a safe place to play.'],
      subjects: [['Physical Education', 'Skipping'], ['English Language', 'Rhyme']],
      before: ['Check the yard for stones, holes and traffic.'], during: ['Count the jumps together.'],
      after: ['Play in turns and count each child’s jumps.'], discussion: ['What is a safe place to skip?'], reflection: ['What did you try again today?'],
      support: ['Practise with a rope lying on the ground.'], stretch: ['Count how many jumps in one minute.'],
      localise: ['Use the skipping chants children already know.'],
    },
  }),

  // 4
  mk({
    key: 'rhyme-hide-and-seek-safely',
    title: 'Hide and Seek, Safe and Sound (a game rhyme)',
    summary: 'A hide-and-seek rhyme with counting to ten and a clear rule: only hide in safe places.',
    classIds: ['nursery-2', 'kg-1', 'kg-2'], ageMin: 3, ageMax: 6, readingLevel: 'pre-reader', difficulty: 1,
    genres: ['rhyme', 'poetry'], themes: ['friendship', 'fear-and-courage'], objectives: ['counting', 'phonics', 'responsibility'],
    ghanaianContext: 'central', wpm: 70, paceWord: 'Slow counting, then whispered and playful', palette: ['#65a30d', '#1d4ed8'],
    voice: 'Playful voice that drops to a whisper for hiding', characters: ['A child counting with eyes covered near a tree while others hide behind a bench, a classroom door and a bush, all in a safe school yard.'],
    music: 'A soft tapping count, then silence (placeholder)',
    pages: [
      pg('🙈', 'Close your eyes and count to ten.\nCount from one, then play again!', 'A child counting with eyes covered.', 'Cover your eyes and count slowly.'),
      pg('🤫', 'Stay far from wells and roads, as we learned before.\nHide behind a safe tree or a classroom door!', 'Children hiding behind a tree and a classroom door.', 'Put a finger to your lips.'),
      pg('🔍', 'Ready or not, here I come to see:\nwho is hiding behind the tree?', 'A child searching near a tree.', 'Peer around slowly.'),
      pg('🎉', 'Found you! Found you! Now it is up to you:\ncount to ten, and then we start anew.', 'Children laughing as a found child starts to count.', 'Cheer and clap.'),
    ],
    activities: [
      { id: 'hs-c1', type: 'comprehension', afterPage: 2, question: 'Where is it NOT safe to hide?', options: ['Near a well or a road', 'Behind a tree', 'Behind a door'], correctIndex: 0 },
      { id: 'hs-ph', type: 'phonics', afterPage: 3, targetSound: 'ee', prompt: 'Which word rhymes with see?', options: ['tree', 'door', 'hide'], correctIndexes: [0] },
      { id: 'hs-sel', type: 'sel', afterPage: 4, prompt: 'How do you feel when you hide?', feelingOptions: ['Excited', 'Quiet', 'Giggly', 'Nervous'] },
    ],
    glossary: [
      { word: 'hide', definition: 'To go where no one can see you.', pages: [2] },
      { word: 'count', definition: 'To say numbers one after another.', pages: [1] },
      { word: 'found', definition: 'Discovered after looking.', pages: [4] },
    ],
    culturalNotes: ['Hide and seek is played by children everywhere. The rhyme is original and adds a safety rule: never hide near wells, roads or open water.'],
    reviewQuestions: ['Check that the safety rule is clear for young children and that the teacher guide tells adults to choose the playing area.'],
    guide: {
      overview: 'A hide-and-seek rhyme. Form: four couplets. Rhyming pairs: ten/again, before/door, see/tree, you/anew. It teaches counting and safe play.',
      lessonMinutes: 15, goals: ['Count to ten.', 'Name safe and unsafe places to hide.', 'Take a turn as finder and hider.'],
      subjects: [['Mathematics', 'Counting to ten'], ['Our World Our People', 'Safety']],
      before: ['Walk the play area and mark the places where hiding is allowed.'], during: ['Count slowly. Adults stay close.'],
      after: ['Play with an adult watching, keeping children away from roads, wells and open water.'], discussion: ['Why must we hide only in safe places?'], reflection: ['Who will you tell if you feel scared while hiding?'],
      support: ['Hide only in the classroom with an adult.'], stretch: ['Count backwards from ten.'],
      localise: ['Use the safe hiding places in your own school and compound.'],
    },
  }),

  // 5
  mk({
    key: 'rhyme-pull-together',
    title: 'Pull Together (a tug-of-war chant)',
    summary: 'A chant about teams pulling a rope, teamwork, fair play and shaking hands whoever wins.',
    classIds: ['primary-1', 'primary-2', 'primary-3'], ageMin: 6, ageMax: 9, readingLevel: 'early', difficulty: 2,
    genres: ['rhyme', 'poetry', 'school-life'], themes: ['school', 'friendship', 'community'], objectives: ['teamwork', 'perseverance', 'phonics', 'kindness'],
    ghanaianContext: 'central', wpm: 75, paceWord: 'Strong and rhythmic, with a call-and-response beat', palette: ['#dc2626', '#2563eb'],
    voice: 'Strong, cheerful voice with a call on one line and a response on the next', characters: ['Two teams of children in school colours pulling a rope on a school field, with a teacher judging.'],
    music: 'A strong drum beat and clapping, with a call-and-response chant (placeholder)',
    pages: [
      pg('🪢', 'Heave, heave, pull the rope.\nPull together, and keep up hope!', 'Two teams pulling a rope.', 'Call the first line, then all answer.'),
      pg('💪', 'One for all and all for one!\nPull, pull, until we are done.', 'Children leaning back with all their strength.', 'Pull with arms, gently.'),
      pg('🎽', 'One team wins and one team does not.\nBoth teams cheer right there on the spot!', 'Children cheering after the game.', 'Wave to the other team.'),
      pg('🤝', 'Shake hands, friends, and say, “Well done!”\nThe best kind of game is the one full of fun.', 'Both teams shaking hands.', 'Shake hands with a neighbour.'),
    ],
    activities: [
      { id: 'pt-c1', type: 'comprehension', afterPage: 4, question: 'What do both teams do at the end?', options: ['Shake hands', 'Argue', 'Leave'], correctIndex: 0 },
      { id: 'pt-ph', type: 'phonics', afterPage: 2, targetSound: 'un', prompt: 'Which words rhyme with one?', options: ['done', 'fun', 'rope'], correctIndexes: [0, 1] },
      { id: 'pt-sel', type: 'sel', afterPage: 4, prompt: 'How do you feel when your team loses?', feelingOptions: ['Disappointed', 'Calm', 'Determined', 'Proud'] },
    ],
    glossary: [
      { word: 'heave', definition: 'To pull or lift with effort.', pages: [1] },
      { word: 'team', definition: 'A group that plays or works together.', pages: [3] },
      { word: 'rope', definition: 'A thick, strong string.', pages: [1] },
    ],
    culturalNotes: ['Tug of war is a common sports-day event in Ghanaian schools. The chant is original.'],
    reviewQuestions: ['Check the safety advice in the guide (flat grass, no wrapping the rope round hands) and that the pages do not say teams should always be equal in sex or size.'],
    guide: {
      overview: 'A tug-of-war chant. Form: four couplets. Rhyming pairs: rope/hope, one/done, not/spot, done/fun. It teaches teamwork and good sportsmanship.',
      lessonMinutes: 20, goals: ['Work as a team.', 'Lose and win well.', 'Spot rhymes.'],
      subjects: [['Physical Education', 'Team games'], ['English Language', 'Rhyme']],
      before: ['Talk about how a team works together.'], during: ['Use a call-and-response beat.'],
      after: ['Play with a thick rope on a flat grassy area, with adults supervising and teams of similar size.'], discussion: ['Why shake hands after a game?'], reflection: ['How can you help your team?'],
      support: ['Use clapping instead of pulling for children who need a quiet role.'], stretch: ['Write a chant for another team game.'],
      localise: ['Use the real sports-day rules of your school.', 'Never wrap the rope around hands or arms.'],
    },
  }),

  // 6
  mk({
    key: 'rhyme-the-kite-and-the-wires',
    title: 'The Kite on the Hill (a kite rhyme)',
    summary: 'A kite-flying rhyme with a safety rule: fly kites in open fields, far from roads and power lines.',
    classIds: ['primary-1', 'primary-2'], ageMin: 6, ageMax: 8, readingLevel: 'early', difficulty: 2,
    genres: ['rhyme', 'poetry', 'nature'], themes: ['weather', 'friendship', 'fear-and-courage'], objectives: ['phonics', 'responsibility', 'reasoning', 'vocabulary'],
    ghanaianContext: 'central', wpm: 75, paceWord: 'Light and floating, with a firm safety line', palette: ['#38bdf8', '#f97316'],
    voice: 'Light, floating voice; the safety couplet is slow and clear', characters: ['Children flying a paper kite on an open field with a long string, with power lines and a road far in the background.'],
    music: 'A light flute with a rising tune for the kite (placeholder)',
    pages: [
      pg('🪁', 'High in the morning sky so blue,\nup on the breeze my red kite flew!', 'A red kite in a blue sky.', 'Reach up with a hand.'),
      pg('🌬️', 'The wind is a friend that pulls the string.\nIt dances and tugs like a living thing.', 'A child holding a string while the kite pulls.', 'Pull gently.'),
      pg('⚠️', 'Keep it far from wires up high,\nand far from the road where cars go by.', 'A kite far from wires and a road.', 'Slow and serious.'),
      pg('🏞️', 'An open field is the place to play.\nWith a grown-up near, we fly all day!', 'Children flying kites in an open field.', 'Warm again, lifting the voice.'),
    ],
    activities: [
      { id: 'kw-c1', type: 'comprehension', afterPage: 3, question: 'Where should we NOT fly a kite?', options: ['Near wires and a road', 'In an open field', 'On a big flat hill'], correctIndex: 0 },
      { id: 'kw-ph', type: 'phonics', afterPage: 1, targetSound: 'oo', prompt: 'Which word rhymes with blue?', options: ['flew', 'kite', 'up'], correctIndexes: [0] },
      { id: 'kw-ph2', type: 'phonics', afterPage: 4, targetSound: 'ay', prompt: 'Which word rhymes with play?', options: ['day', 'kite', 'field'], correctIndexes: [0] },
      { id: 'kw-sel', type: 'sel', afterPage: 4, prompt: 'How do you feel when a kite flies high?', feelingOptions: ['Joyful', 'Proud', 'Calm', 'Free'] },
    ],
    glossary: [
      { word: 'kite', definition: 'A light toy that flies in the wind on a string.', pages: [1] },
      { word: 'wires', definition: 'Long metal cables that can carry electricity.', pages: [3] },
      { word: 'field', definition: 'A large open piece of land.', pages: [4] },
    ],
    culturalNotes: ['Kite flying is a popular harmattan pastime in many places. The safety message is general and is also taught by electricity companies.'],
    reviewQuestions: ['Confirm that the safety rule (stay away from power lines, roads and wet weather) matches advice from an electricity or safety authority.'],
    guide: {
      overview: 'A kite rhyme with a safety message. Form: four couplets. Rhyming pairs: blue/flew, string/thing, high/by, play/day. It teaches safe play and rhyme.',
      lessonMinutes: 20, goals: ['Name where it is safe to fly a kite.', 'Say why wires are dangerous.', 'Spot rhymes.'],
      subjects: [['Integrated Science', 'Wind and electricity safety'], ['English Language', 'Rhyme']],
      before: ['Ask: where have you seen wires? Why should we stay away?'], during: ['Slow down at the safety page.'],
      after: ['Make a kite from paper and sticks and fly it in an open field away from wires, with an adult, on a dry day.'], discussion: ['What should you do if a kite gets caught on a wire?'], reflection: ['Which safety rule will you remember?'],
      support: ['Use pictures of safe and unsafe places and sort them.'], stretch: ['Write a safety poster for kite flyers.'],
      localise: ['Use the local fields children know. If a kite gets caught on a wire, leave it and tell an adult. Never climb to get it.'],
      factCheck: [
        {
          claim: 'Kites should be flown in open fields on dry days, far from overhead power lines and roads, and never retrieved from wires.',
          explanation: 'Overhead electrical lines carry dangerous current; kite strings or climbing near wires can cause electric shock.',
          reference: 'Confirm wire-safety advice with the local electricity company (e.g. Electricity Company of Ghana public safety guidance).',
        },
      ],
    },
  }),

  // 7
  mk({
    key: 'rhyme-play-fair',
    title: 'Play Fair, Play Fair (a song)',
    summary: 'A song about taking turns, sharing the ball, telling the truth in a game and being kind when we lose.',
    classIds: ['kg-2', 'primary-1', 'primary-2'], ageMin: 5, ageMax: 8, readingLevel: 'early', difficulty: 2,
    genres: ['rhyme', 'moral', 'school-life'], themes: ['friendship', 'school', 'citizenship'], objectives: ['kindness', 'emotional-intelligence', 'phonics', 'teamwork'],
    ghanaianContext: 'central', wpm: 75, paceWord: 'Lively and clear', palette: ['#22c55e', '#eab308'],
    voice: 'Lively voice with a chorus children can join', characters: ['Children of different ages in school uniforms playing a ball game, taking turns, with one child helping another up.'],
    music: 'A catchy clapping chorus, “Play fair, play fair,” on two repeating notes (placeholder)',
    pages: [
      pg('⚽', 'Play fair, play fair, take your turn.\nShare the ball, and learn, learn, learn!', 'Children passing a ball in a circle.', 'Chorus: clap on Play fair.'),
      pg('🗣️', 'Tell the truth and do not lie.\nSay what you did and look friends in the eye.', 'A child telling the truth to a friend.', 'Hold a hand to your heart.'),
      pg('🤕', 'If a friend falls down, help them up;\nthen play again, and share the cup.', 'A child helping a friend up and giving a cup of water.', 'Reach out a hand.'),
      pg('🏆', 'Win with a smile; lose with grace.\nA happy game makes a happy place!', 'Children shaking hands after the game.', 'Smile and shake hands.'),
    ],
    activities: [
      { id: 'pf-c1', type: 'comprehension', afterPage: 2, question: 'What should you do in a game?', options: ['Tell the truth', 'Tell a lie', 'Run away'], correctIndex: 0 },
      { id: 'pf-ph', type: 'phonics', afterPage: 1, targetSound: 'urn', prompt: 'Which word rhymes with turn?', options: ['learn', 'ball', 'share'], correctIndexes: [0] },
      { id: 'pf-ph2', type: 'phonics', afterPage: 4, targetSound: 'ace', prompt: 'Which word rhymes with grace?', options: ['place', 'smile', 'game'], correctIndexes: [0] },
      { id: 'pf-sel', type: 'sel', afterPage: 4, prompt: 'How do you feel when someone plays fairly with you?', feelingOptions: ['Respected', 'Happy', 'Safe', 'Proud'] },
    ],
    glossary: [
      { word: 'fair', definition: 'Following the rules and treating everyone the same.', pages: [1] },
      { word: 'truth', definition: 'What really happened.', pages: [2] },
      { word: 'grace', definition: 'A kind and gentle way of behaving.', pages: [4] },
    ],
    culturalNotes: ['Fair play and respect are taught in Ghanaian schools and homes. The song is original.'],
    reviewQuestions: ['Check that the song treats boys and girls equally and that the language is simple enough for the age band.'],
    guide: {
      overview: 'A fair-play song. Form: four couplets. Rhyming pairs: turn/learn, lie/eye, up/cup, grace/place. It teaches honesty, helping and good sportsmanship.',
      lessonMinutes: 20, goals: ['Say three fair-play rules.', 'Tell the truth in a game.', 'Help a friend.'],
      subjects: [['Our World Our People', 'Fairness and respect'], ['Physical Education', 'Team games']],
      before: ['Ask: what makes a game fair?'], during: ['Join the chorus.'],
      after: ['Role-play a fair and an unfair game and discuss.'], discussion: ['Why is it hard to tell the truth sometimes?'], reflection: ['What will you do the next time you lose a game?'],
      support: ['Act out each rule with pictures.'], stretch: ['Write a new verse about teasing.'],
      localise: ['Add the local words children use for “fair” and “cheating”.'],
    },
  }),

  // 8
  mk({
    key: 'rhyme-the-ball-that-rolled',
    title: 'The Ball That Rolled Away (a safety rhyme)',
    summary: 'A short rhyme about a ball that rolls toward the road and a child who stops, does not chase it, and asks a grown-up.',
    classIds: ['nursery-2', 'kg-1', 'kg-2'], ageMin: 3, ageMax: 6, readingLevel: 'pre-reader', difficulty: 1,
    genres: ['rhyme', 'poetry', 'moral'], themes: ['fear-and-courage', 'community'], objectives: ['responsibility', 'reasoning', 'phonics'],
    ghanaianContext: 'central', wpm: 70, paceWord: 'Quick, then a firm stop', palette: ['#ef4444', '#22c55e'],
    voice: 'A bouncy voice that stops firmly on “Stop!”', characters: ['A child on a safe play area watching a ball roll toward a road, then calling an adult who fetches it.'],
    music: 'A bouncing beat that stops at the word Stop, then a calm tune (placeholder)',
    pages: [
      pg('⚽', 'Bounce, bounce, bounce! My ball is red.\nIt rolls away; it rolls ahead.', 'A red ball rolling out of a play area.', 'Bounce and then roll your hands.'),
      pg('🛑', 'Stop! I stop! I do not run.\nA road is not a place for fun.', 'A child holding up a hand, standing still.', 'Hold up your hand like a stop sign.'),
      pg('🙋', 'I call out loud, “Please come and see!”\nA grown-up comes to help me.', 'A child calling an adult.', 'Cup your hands around your mouth.'),
      pg('🙏', 'The grown-up fetches my ball, and I say, “Thank you!”\nNow we play safely the whole day through.', 'An adult handing the ball back to a child.', 'Say thank you with a smile.'),
    ],
    activities: [
      { id: 'br-c1', type: 'comprehension', afterPage: 2, question: 'What does the child do when the ball rolls toward the road?', options: ['Stops and does not run', 'Chases it', 'Closes her eyes'], correctIndex: 0 },
      { id: 'br-ph', type: 'phonics', afterPage: 2, targetSound: 'un', prompt: 'Which word rhymes with run?', options: ['fun', 'stop', 'red'], correctIndexes: [0] },
      { id: 'br-sel', type: 'sel', afterPage: 4, prompt: 'How do you feel when a grown-up helps you?', feelingOptions: ['Safe', 'Thankful', 'Happy', 'Relieved'] },
    ],
    glossary: [
      { word: 'road', definition: 'A path for cars, buses and bikes.', pages: [2] },
      { word: 'grown-up', definition: 'An older person, such as a parent or teacher.', pages: [3] },
      { word: 'fetches', definition: 'Goes and brings back.', pages: [4] },
    ],
    culturalNotes: ['Road safety matters for children in towns and villages across Ghana. The rhyme is original.'],
    reviewQuestions: ['Check that the rule (do not chase a ball into a road; ask an adult) is clear and that nothing here frightens children.'],
    guide: {
      overview: 'A short safety rhyme. Form: four couplets. Rhyming pairs: red/ahead, run/fun, see/me, you/through. It teaches road safety and asking for help.',
      lessonMinutes: 15, goals: ['Say what to do if a ball rolls toward a road.', 'Ask an adult for help.', 'Say thank you.'],
      subjects: [['Our World Our People', 'Road safety'], ['English Language', 'Rhyme']],
      before: ['Ask: where is a safe place to play ball?'], during: ['Stop sharply on the word Stop and let children freeze.'],
      after: ['Play a freeze game: bounce, then stop on a signal.'], discussion: ['Whom can you ask for help?'], reflection: ['Where is your safe play place?'],
      support: ['Act the story with a soft ball and a taped line.'], stretch: ['Draw a safe play area with a fence.'],
      localise: ['Name the real safe play places near the school. Make sure each child knows who the nearest adult is.'],
    },
  }),
];

