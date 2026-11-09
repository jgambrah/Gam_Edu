/**
 * Batch 12: five spooky, "horror-lite" stories set across Ghana (a power-cut night in a city, a baobab in the north,
 * a kente weaver's loft in Bonwire, a foggy night on Lake Volta, a harmattan dust-devil) mixing a little unexplained
 * magic with science and bravery.
 *
 * Rules: scary but never gory or cruel; the fear is always named and respected; the children are brave by thinking,
 * asking adults and following safety steps, never by wandering off alone; science explains the sounds and sights,
 * while a small piece of wonder is left unexplained; nobody is called a witch or evil, and no real religion, deity
 * or sacred rite is mocked or invented; folk characters (Ananse) are treated as the beloved storytelling tradition
 * they are. All stories are drafts awaiting review.
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

export const BATCH_12_STORIES: PilotStory[] = [

  // 1 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'ananse-and-the-midnight-thread',
    title: 'Ananse and the Midnight Thread',
    summary: 'The lights go out and Nutifafa is sure something is creeping in the dark. A tiny spider with a very big name, Ananse, spins a silver thread to guide him, and shows him that fear shrinks when you look closely.',
    classIds: ['primary-1', 'primary-2', 'primary-3'],
    ageMin: 6,
    ageMax: 9,
    readingLevel: 'developing',
    difficulty: 2,
    genres: ['folktale', 'fantasy', 'bedtime'],
    themes: ['fear-and-courage', 'family', 'animals-and-habitats'],
    objectives: ['emotional-intelligence', 'reasoning', 'vocabulary', 'perseverance'],
    ghanaianContext: 'incidental',
    culturalTags: ['ananse-tradition', 'local-names'],
    wpm: 100,
    paceWord: 'Hushed and playful, with a soft smile on the reveals',
    palette: ['#312e81', '#fbbf24'],
    voice: 'Soft bedtime voice; Ananse speaks in a tiny, clever, kind whisper',
    characters: [
      'Nutifafa: a 7-year-old boy in striped pyjamas, round face, big eyes, holding a small torch that does not work.',
      'Maame Ewurabena: his mother, in a wrapper and headscarf, with a candle in a saucer.',
      'Ananse: a tiny spider with eight legs, gently glowing silver, wearing a thin gold bead like a crown, with a kind face.',
      'The bedroom: a simple room in Accra with a window, a ceiling fan stopped, a wardrobe, and a moonlit street outside.',
    ],
    music: 'Soft night sounds, crickets and a gentle hand-drum lullaby (placeholder)',
    pages: [
      pg('🌙', 'One night in Accra, the lights went out. The fan stopped. The whole street went dark. Nutifafa sat up in bed. “Mama?” he whispered. Nobody answered.', 'A boy in pyjamas sits up in a dark bedroom with moonlight at the window.'),
      pg('👀', 'In the corner of the room stood a tall, lumpy shape with long arms. Nutifafa’s tummy went tight. “A monster,” he said. His torch clicked, but it did not work.', 'A boy stares at a tall shadowy shape in the corner of his room.'),
      pg('✨', 'Then a tiny silver light blinked on the wall. A very small voice said, “Good evening, Nutifafa. I am Ananse.” It was a spider, small as a bean, with eight little legs and a gold bead like a crown.', 'A tiny glowing spider with a gold bead crown stands on the wall.'),
      pg('🕸️', '“Everyone knows my stories,” said Ananse. “But tonight I have a different job. I help people be brave.” Ananse spun a silver thread across the room. It glowed softly, like a tiny road in the dark.', 'The spider spins a glowing silver thread across the room.'),
      pg('🚶', '“Hold the thread,” said Ananse, “and take one step at a time.” Nutifafa climbed out of bed. He held the glowing thread. One step. Two steps. Three steps. His feet were on the cool floor, and his heart was beating fast.', 'The boy holds a glowing thread and takes careful steps across the room.'),
      pg('🔍', '“Now look closely,” said Ananse. “A good detective looks, and then looks again.” Nutifafa leaned in. The tall lumpy shape was not a monster. It was his school coat on the wardrobe door, with his bag hanging from the hook.', 'The boy looks at a school coat and bag hanging on a wardrobe door.'),
      pg('😄', 'Nutifafa laughed a small laugh. “It is my coat!” “Yes,” said Ananse. “Spiders have eight eyes, and even so we look twice. Fear grows in the dark, but it shrinks when you look closely.” Outside, Mama’s candle glowed in the doorway. “Nutifafa? I am here.”', 'The boy laughs while his mother holds a candle in the doorway.'),
      pg('💤', 'Nutifafa hugged his mother. When he looked back, the spider and the thread were gone, but a tiny silver shine sat on the windowsill. The lights came back on with a hum. “Goodnight, Ananse,” whispered Nutifafa. And he slept. The end.', 'A boy hugs his mother while a faint silver shine glows on the windowsill.'),
    ],
    activities: [
      { id: 'ananse-c1', type: 'comprehension', afterPage: 2, question: 'What did Nutifafa think the tall shape in the corner was?', options: ['A monster', 'A tree', 'A teacher'], correctIndex: 0 },
      { id: 'ananse-c2', type: 'comprehension', afterPage: 6, question: 'What was the tall lumpy shape really?', options: ['His school coat and bag on the wardrobe', 'A ghost', 'A big dog'], correctIndex: 0 },
      { id: 'ananse-p1', type: 'prediction', afterPage: 4, prompt: 'Nutifafa holds the glowing thread and takes small steps. What do you think he will find when he looks closely?', options: ['Something ordinary', 'A real monster', 'A thunderstorm'] },
      { id: 'ananse-voc', type: 'vocabulary', afterPage: 3, word: 'detective', definition: 'A person who looks carefully for clues to find out the truth.', distractors: ['A kind of spider', 'A tool for sewing'] },
      { id: 'ananse-s1', type: 'sequencing', prompt: 'Put the story in order.', items: ['The lights went out.', 'Nutifafa saw a scary shape.', 'Ananse spun a thread.', 'Nutifafa looked closely and laughed.'] },
      { id: 'ananse-sel', type: 'sel', afterPage: 8, prompt: 'Nutifafa was scared of the dark, then felt brave. What helps you feel brave at night?', feelingOptions: ['Scared', 'Brave', 'Safe', 'Sleepy'] },
    ],
    glossary: [
      { word: 'detective', definition: 'A person who looks carefully for clues to find the truth.', pages: [6] },
      { word: 'thread', definition: 'A very thin line, like string or silk.', pages: [4] },
      { word: 'candle', definition: 'A stick of wax with a flame at the top that gives light.', pages: [7] },
    ],
    culturalNotes: ['Ananse the spider is the most famous trickster in Akan storytelling. This story uses him as a gentle helper, which is a fresh telling and not a traditional one.', 'Power cuts, often called “dumsor” in Ghana, are a real experience for many children, so the story makes a familiar worry less scary.'],
    reviewQuestions: ['Is the portrayal of Ananse respectful of Akan storytelling tradition (a new, gentle role)?', 'Is “detective” suitable as a vocabulary word for this level, with the glossary definition?'],
    guide: {
      overview: 'A gentle bedtime spooky story that teaches a calming habit: look closely, then look again. A touch of magic (the glowing thread) sits beside a real explanation (a coat on a wardrobe).',
      lessonMinutes: 25,
      goals: ['Name a common night-time fear and a way to face it.', 'Use “look again” to test a worry.', 'Retell the story in order.'],
      subjects: [['English Language', 'Story retelling and vocabulary'], ['Personal and Social Development', 'Managing fear'], ['Integrated Science', 'Light and shadows']],
      before: ['Ask: what is a shadow, and how is it made?'],
      during: ['At page 6, ask: what did Nutifafa see when he looked closely?'],
      after: ['Make shadow shapes with a torch and objects, then guess each shadow.', 'Draw the “monster” and then draw what it really was.'],
      discussion: ['Why did Nutifafa look twice?', 'Who can you tell when you are scared?'],
      reflection: ['What can you do the next time something looks scary?'],
      maths: [{ task: 'A spider has 8 legs. How many legs do 3 spiders have?', answer: '3 × 8 = 24 legs.' }, { task: 'Nutifafa took 3 steps, then 3 more. How many steps did he take?', answer: '6 steps.' }],
      support: ['Use picture cards to put the story in order.'],
      stretch: ['Write a short story about a shadow that turned out to be something ordinary.'],
      localise: ['Link to local stories of Ananse that children know.', 'Teach that a child who is frightened at night should call a trusted adult.'],
      factCheck: [{ claim: 'Spiders have eight legs and are not insects.', explanation: 'Standard biology.', reference: 'Any primary science textbook (to verify against the local curriculum).' }],
    },
  }),

  // 2 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-whisper-in-the-baobab',
    title: 'The Whisper in the Baobab',
    summary: 'In a village in northern Ghana, the old baobab tree whispers at night. Rabi and her brother Mumuni listen with their grandmother, test every explanation they can think of, and find that some parts of the whisper have a reason and one part still feels like magic.',
    classIds: ['primary-4', 'primary-5', 'primary-6'],
    ageMin: 9,
    ageMax: 12,
    readingLevel: 'fluent',
    difficulty: 3,
    genres: ['mystery', 'fantasy', 'cultural'],
    themes: ['community', 'fear-and-courage', 'family'],
    objectives: ['scientific-curiosity', 'reasoning', 'respect', 'critical-thinking', 'cultural-heritage'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 115,
    paceWord: 'Hushed and curious, slowing for the whispers',
    palette: ['#92400e', '#1e3a8a'],
    voice: 'Low, curious voice; Grandma Memuna is warm and slow; the tree’s whisper is soft and breathy',
    characters: [
      'Rabi: a 10-year-old girl in a blue dress and headscarf, curious, holding a small notebook.',
      'Mumuni: her brother, 8, in a white kaftan top and shorts, braver in words than in feet.',
      'Grandma Memuna: their grandmother, wearing a patterned wrapper and a headscarf, with a calm smile and a walking stick.',
      'The baobab: a huge, old, wide-trunked tree with thick bare branches like roots in the sky, and a dark hollow in the trunk.',
      'Fruit bats and a barn owl: seen in the evening sky.',
    ],
    music: 'Warm northern drum and a soft kora-like melody, dusk wind sounds (placeholder)',
    pages: [
      pg('🌳', 'At the edge of the village stood the baobab, so wide that ten children could not reach around it. People said it whispered at night. Rabi and her brother Mumuni wanted to know why. Their grandmother, Memuna, said, “Come at dusk. We will listen together, with respect.”', 'Two children and their grandmother approach a huge baobab tree in the northern savanna at dusk.'),
      pg('🌅', 'They sat at a safe distance, on a mat. As the sky turned orange, the first whisper came: a low, breathy shhhh from the hollow in the trunk. Mumuni grabbed his sister’s arm. “It is the tree,” he whispered. “Or something inside it.”', 'A boy grips his sister’s arm as the sun sets behind the baobab.'),
      pg('📝', 'Rabi opened her notebook. “Let us think like scientists,” she said. “Idea one: the wind.” She held up a strip of cloth. It fluttered gently. “The wind blows across the hollow, like blowing over a bottle top.” She blew over a bottle. It hummed. Mumuni’s eyes widened.', 'A girl holds a cloth strip and blows over a bottle while her brother watches.'),
      pg('🦇', 'Then dark shapes poured out of the branches into the sky: fruit bats, heading off to feed. “Idea two: animals,” said Rabi. “Bats, and maybe an owl.” A pale barn owl glided out of the hollow without a sound, making the whole tree seem to breathe.', 'Fruit bats and a pale owl fly from a baobab against an orange sky.'),
      pg('🌙', 'Grandma Memuna told them a story. “When I was a girl, the old people said this tree keeps the village’s memories. Elders met under it. We still do not cut it down or burn near it.” Mumuni sat up. “Is the whisper the memories?” “Perhaps,” she said. “A story can be true in a different way from a measurement.”', 'The grandmother tells the children a story under the tree in the dim light.'),
      pg('🔦', 'It grew dark. The whispers changed: now tiny taps, like fingers on a drum. Mumuni wanted to run. Rabi wanted to climb into the hollow. “No,” said Grandma Memuna gently. “Old trees can hide snakes and fall branches. We look from here. A brave person is also a careful person.”', 'The grandmother holds out an arm to stop the children from approaching the hollow.'),
      pg('🔬', 'Rabi pointed her torch at the ground. Seed pods the size of a hand were dropping from the branches and tapping on the dry earth. “Idea three: falling fruit,” she wrote. “So the wind, the bats, the owl and the fruit explain the whispers.” “All of them?” asked Mumuni.', 'A torch beam shows hard seed pods falling on dry ground.'),
      pg('✨', 'Then the wind stopped. The bats were gone. The pods stopped falling. But from deep in the hollow, one soft whisper came, so clear it sounded like words: “Rabi… Mumuni… well done.” The children stared at their grandmother. She only smiled. “Science answers many things,” she said. “And a good scientist can leave one question open.” The end.', 'The children and grandmother sit quietly while a faint glow shimmers inside the baobab hollow.'),
    ],
    activities: [
      { id: 'baobab-c1', type: 'comprehension', afterPage: 3, question: 'What was Rabi’s first idea about the whisper?', options: ['The wind blowing across the hollow', 'A ghost', 'Her brother'], correctIndex: 0 },
      { id: 'baobab-p1', type: 'prediction', afterPage: 4, prompt: 'Rabi has two ideas so far. What could she do to test the idea that falling fruit makes the tapping?', options: ['Look at the ground with a torch from a safe distance', 'Climb the tree', 'Ask the tree'] },
      { id: 'baobab-c2', type: 'comprehension', afterPage: 6, question: 'Why did Grandma Memuna say they should look from a distance?', options: ['Old trees can hide snakes and drop branches', 'The tree is angry', 'It was time to go home'], correctIndex: 0 },
      { id: 'baobab-voc', type: 'vocabulary', afterPage: 3, word: 'hypothesis', definition: 'A guess that can be tested to see if it is true.', distractors: ['A kind of tree', 'A type of drum'] },
      { id: 'baobab-s1', type: 'sequencing', prompt: 'Put Rabi’s investigation in order.', items: ['They listened at a safe distance.', 'Rabi tried the wind idea with a bottle.', 'She noticed the bats and the owl.', 'She saw the seed pods falling.'] },
      { id: 'baobab-sel', type: 'sel', afterPage: 8, prompt: 'Rabi learned that being brave also means being careful. When have you been brave and careful at the same time?', feelingOptions: ['Curious', 'Brave', 'Careful', 'Amazed'] },
    ],
    glossary: [
      { word: 'hollow', definition: 'An empty space inside something, like a tree trunk.', pages: [2] },
      { word: 'whisper', definition: 'A very soft, quiet sound made with the breath.', pages: [2] },
      { word: 'respect', definition: 'Treating someone or something with care and honour.', pages: [1] },
    ],
    culturalNotes: ['Baobab trees grow in the savanna of northern Ghana. Many communities hold them in high regard as places of gathering, shade and story. The village and its tree are invented.', 'Elders’ stories are treated as a different kind of truth from measurements, not as a mistake. The story leaves one moment unexplained on purpose.'],
    reviewQuestions: ['Check baobab facts: bats and other animals visit baobab flowers and trees, and old trunks can be hollow (confirm with a botanist or reliable source).', 'Is the treatment of elders’ stories and the unexplained ending balanced and respectful?'],
    guide: {
      overview: 'A mystery that models real inquiry: guess, test, observe, and still leave room for wonder. Science explains three of the four sounds; the fourth stays magical.',
      lessonMinutes: 45,
      goals: ['Use hypotheses and observations to explain sounds.', 'Explain why careful behaviour near old trees matters.', 'Discuss different kinds of knowing (measurement and story).'],
      subjects: [['Integrated Science', 'Sound, wind and habitats'], ['Social Studies', 'Local heritage'], ['English Language', 'Mystery and inference']],
      before: ['Blow over a bottle and ask: why does it hum?'],
      during: ['At page 7, pause: which whispers have been explained?'],
      after: ['Test the bottle-hum idea with different amounts of water.', 'Interview an elder about a special tree or place.'],
      discussion: ['Why did Grandma Memuna let the children test ideas?', 'What do you think the last whisper was?'],
      reflection: ['What do you still wonder about?'],
      maths: [{ task: 'Ten children cannot reach around the trunk. If each child’s outstretched arms measure 1.2 m, about how wide is the trunk’s circumference at least?', answer: 'About 10 × 1.2 = 12 m or more.' }, { task: 'Seven seed pods fell in the first minute and nine in the second. How many in all?', answer: '16 pods.' }],
      support: ['Provide a chart: sound, idea, test.'],
      stretch: ['Design a fair test for which bottle hums the lowest.'],
      localise: ['Use your local trees and stories; invite an elder.', 'Never encourage children to climb or enter old tree hollows; they can hide snakes, insects and falling branches.'],
      factCheck: [{ claim: 'Baobab flowers open at night and are visited by animals such as fruit bats; old baobab trunks can be hollow and very wide.', explanation: 'Widely reported; not verified from a single named page in this session.', reference: 'Royal Botanic Gardens Kew or a botanical garden’s baobab page (to verify).' }],
    },
  }),

  // 3 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-loom-that-clicked-at-midnight',
    title: 'The Loom That Clicked at Midnight',
    summary: 'In a kente-weaving town, an old loom clicks by itself at midnight. Ablah and her cousin Yoofi follow the sound, find a spark nobody expected, and use courage and quick thinking to protect the workshop and the whole street.',
    classIds: ['primary-5', 'primary-6', 'jhs-1'],
    ageMin: 10,
    ageMax: 13,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['mystery', 'fantasy', 'cultural'],
    themes: ['community', 'fear-and-courage', 'helping-others'],
    objectives: ['problem-solving', 'responsibility', 'cultural-heritage', 'reasoning', 'teamwork'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 120,
    paceWord: 'Tense and quiet, quickening during the emergency',
    palette: ['#b45309', '#7f1d1d'],
    voice: 'Hushed, tense voice that quickens in the emergency; Nana Frempong is calm and wise',
    characters: [
      'Ablah: an 11-year-old girl in a yellow dress and white headscarf, quick-thinking, with a small torch.',
      'Yoofi: her cousin, 12, in a blue shirt and shorts, nervous, always carrying a whistle.',
      'Nana Frempong: the master weaver, about 70, in a kente cloth draped over one shoulder, wise and calm.',
      'The workshop: an open-sided weaving shed in Bonwire with wooden looms, colourful silk and cotton threads, strips of kente hanging, and a single old loom in the corner.',
    ],
    music: 'Rhythmic wooden clicking over a slow, mysterious melody; faster in the emergency (placeholder)',
    pages: [
      pg('🧵', 'Ablah spent the holidays with her uncle in Bonwire, a town famous for kente cloth. By day, the workshop clicked and clacked with looms and bright threads. By night, it was silent. Or it was supposed to be.', 'A busy kente weaving workshop by day with colourful threads and wooden looms.'),
      pg('🌙', 'At midnight, Ablah woke to a sound: click… clack… click… clack. It came from the workshop. Her cousin Yoofi, awake too, whispered, “That is the old loom. Nobody has used it for years.” Ablah picked up her torch. “We must tell Nana Frempong.”', 'Two children in a dark bedroom listen to faint clicking from the weaving shed.'),
      pg('👴', 'They found the master weaver, Nana Frempong, already awake and sitting on his stool. “I heard it too,” he said calmly. “Stay behind me. We will look from the door.” They crept to the shed and peered in. Nobody was there, but the old loom’s shuttle was gliding back and forth by itself.', 'An old weaver and two children look into a dark workshop where a loom moves on its own.'),
      pg('🔍', 'Yoofi shivered. “A spirit?” Nana Frempong stepped closer, careful and slow. “This loom is old,” he said. “Some say the weavers before us still work here. But a weaver also checks the loom.” He sniffed the air. “Do you smell something?” Ablah sniffed. There was a faint smell of something hot.', 'The weaver sniffs the air near the loom while the children watch nervously.'),
      pg('⚡', 'Ablah shone her torch along the wall behind the loom. A wire had split. A tiny blue spark jumped from it, again and again, and a scrap of thread nearby was beginning to glow. “An electrical fault!” she gasped. “Sparks near thread, and thread burns!” The “clicking” was the spark making the old loom’s metal parts jump.', 'A torch lights a sparking wire near hanging threads.'),
      pg('🚨', 'Nana Frempong acted at once. “Out! Everyone out!” “Yoofi, blow your whistle! Ablah, wake the neighbours!” The weavers’ houses were close together, and cloth and thread burn quickly. Yoofi blew until his face was red. Ablah ran from door to door. Nobody stayed to fight a fire in a room full of thread.', 'A boy blows a whistle and a girl knocks on neighbours’ doors in the night.'),
      pg('☎️', 'Nana Frempong called the emergency number from the street. Within minutes, neighbours stood safely across the road. When the fire service arrived, they cut the power at the main switch and checked the shed. The scrap of thread was smoking, but the workshop was saved. “You acted fast and stayed safe,” said the officer.', 'Neighbours stand in the street as firefighters with a torch check the shed.'),
      pg('🌟', 'In the morning, Nana Frempong laid a small strip of kente on Ablah’s hands. “You are a weaver of brave choices,” he said. As the sun rose, Ablah noticed that the old loom’s newest thread, one nobody remembered placing, was gold and shone like a tiny sunrise. “Science found the spark,” she smiled. “But who put that thread there?” The end.', 'A girl holds a strip of kente cloth in the sunrise beside the old loom with one shining golden thread.'),
    ],
    activities: [
      { id: 'loom-c1', type: 'comprehension', afterPage: 4, question: 'What did Ablah find behind the loom?', options: ['A split wire making sparks', 'A sleeping cat', 'A ghost in a mask'], correctIndex: 0 },
      { id: 'loom-c2', type: 'comprehension', afterPage: 6, question: 'Why did everyone leave instead of trying to put out the fire themselves?', options: ['Cloth and thread burn quickly and it is not safe', 'They were tired', 'They wanted to watch'], correctIndex: 0 },
      { id: 'loom-p1', type: 'prediction', afterPage: 3, prompt: 'Nana Frempong sniffs the air and says a weaver also checks the loom. What do you think he might find?', options: ['A real, ordinary cause', 'Nothing at all', 'Another room'] },
      { id: 'loom-voc', type: 'vocabulary', afterPage: 5, word: 'fault', definition: 'A problem with a machine or wire that stops it working safely.', distractors: ['A kind of cloth', 'A weaving pattern'] },
      { id: 'loom-s1', type: 'sequencing', prompt: 'Put the emergency in order.', items: ['They found the sparking wire.', 'Everyone left the building.', 'Yoofi blew the whistle and Ablah woke the neighbours.', 'The fire service made the shed safe.'] },
      { id: 'loom-sel', type: 'sel', afterPage: 8, prompt: 'Ablah stayed calm and acted fast in an emergency. How do you think she felt afterwards?', feelingOptions: ['Proud', 'Relieved', 'Shaky', 'Brave'] },
    ],
    glossary: [
      { word: 'kente', definition: 'A colourful hand-woven cloth from Ghana, made from narrow strips sewn together.', pages: [1] },
      { word: 'shuttle', definition: 'The part of a loom that carries the thread across.', pages: [3] },
      { word: 'fault', definition: 'A problem with a wire or machine that makes it unsafe.', pages: [5] },
      { word: 'loom', definition: 'A machine used to weave thread into cloth.', pages: [2] },
    ],
    culturalNotes: ['Bonwire, in the Ashanti Region, is widely known for kente weaving on narrow handlooms. The workshop, family and master weaver are invented.', 'The golden thread is a small mystery: the story respects the idea that craft carries the presence of those who came before, without turning any real tradition into magic spells.'],
    reviewQuestions: ['Check the emergency steps (get out, raise the alarm, call the emergency number, do not fight a fire in a room full of thread) against the Ghana National Fire Service guidance, including the correct number to dial.', 'Is the master weaver portrayed respectfully, and is the single golden thread a fair, gentle magic?'],
    guide: {
      overview: 'A spooky mystery with a real-world fire-safety lesson: the “ghost” is an electrical fault, and bravery means raising the alarm and getting everyone out. A small unexplained gift keeps the wonder.',
      lessonMinutes: 45,
      goals: ['Explain what to do if there is a fire or sparking wire.', 'Describe how a loom works at a basic level.', 'Discuss courage as careful action.'],
      subjects: [['Integrated Science', 'Electricity and safety'], ['Creative Arts', 'Weaving and patterns'], ['Personal and Social Development', 'Emergency response']],
      before: ['Ask: what should you do if you see sparks or smell something burning?'],
      during: ['At page 6, ask learners to say what each character’s job was.'],
      after: ['Run a safe class fire-drill discussion, using the school’s own procedure.', 'Weave a paper strip pattern with two colours.'],
      discussion: ['Why was leaving the building the right choice?', 'What do you think the golden thread meant?'],
      reflection: ['Who would you wake first in an emergency, and what would you say?'],
      maths: [{ task: 'Strips of kente are sewn together. If each strip is 10 cm wide, how wide is a cloth made from 24 strips?', answer: '24 × 10 = 240 cm, which is 2.4 m.' }, { task: 'The fire service arrived 12 minutes after the call. The call was made at 12:20 a.m. What time did they arrive?', answer: '12:32 a.m.' }],
      support: ['Provide picture cards for GET OUT, SHOUT, CALL.'],
      stretch: ['Create a fire-safety poster for a workshop.'],
      localise: ['Use your local emergency number and your school’s plan.', 'Teach that children should never try to fight a fire; they should get out and tell an adult.', 'Check local safety rules for electrical wiring in workshops.'],
      factCheck: [{ claim: 'Bonwire, in the Ashanti Region, is a well-known kente-weaving town.', explanation: 'Widely stated; not verified from a named page in this session.', reference: 'Ghana Tourism Authority (to verify).' }, { claim: 'Ghana’s emergency numbers include 112 (general) and 192 (fire service).', explanation: 'From memory; must be checked before publication.', reference: 'Ghana National Fire Service or National Communications Authority (to verify).' }],
    },
  }),

  // 4 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-lantern-on-the-lake',
    title: 'The Lantern on the Lake',
    summary: 'Kofiga and his sister Enam are caught in thick fog on Lake Volta at dawn. A strange blue lantern seems to float ahead of their canoe. They use what they know about fog, the shore and safety to find their way, and decide for themselves whether to trust the light.',
    classIds: ['primary-6', 'jhs-1', 'jhs-2'],
    ageMin: 11,
    ageMax: 14,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['adventure', 'mystery', 'fantasy'],
    themes: ['fear-and-courage', 'family', 'weather'],
    objectives: ['problem-solving', 'reasoning', 'perseverance', 'responsibility', 'critical-thinking'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 125,
    paceWord: 'Slow, misty and tense, with steady relief',
    palette: ['#0e7490', '#1e293b'],
    voice: 'Hushed voice with a slow, misty feel; Uncle Nyameye is deep and calm',
    characters: [
      'Kofiga: a 13-year-old boy in a faded football shirt and shorts, wearing an orange life jacket, steady hands on the paddle.',
      'Enam: his sister, 11, in a yellow dress, wearing a small orange life jacket, holding a lamp and a whistle.',
      'Uncle Nyameye: their uncle, a fisherman in a wide hat, wearing a life jacket, seen on the shore at the end.',
      'The canoe: a narrow wooden canoe with a small outboard motor, paddles, a bailer and a rope.',
      'The lake: wide grey water, morning mist, a faint blue lantern-like glow, and a distant shoreline with dark trees and a row of small boats.',
    ],
    music: 'Slow, quiet water sounds with a distant, hopeful drum as the fog lifts (placeholder)',
    pages: [
      pg('🛶', 'Every dawn, Kofiga and his younger sister Enam crossed a quiet arm of Lake Volta to sell fish at the landing beach. They both wore life jackets, always. “The lake gives,” their uncle Nyameye said, “and the lake demands respect.”', 'Two children in orange life jackets paddle a canoe across calm water at dawn.'),
      pg('🌫️', 'That morning, a thick fog rolled in. In minutes, they could not see the shore. “Fog forms when cool air meets warmer water,” said Kofiga, remembering his science class. “It will lift when the sun warms the air.” “When?” asked Enam. He did not know.', 'The canoe sits in thick white fog with no shore in sight.'),
      pg('🔵', 'Then, a soft blue light appeared on the water ahead, floating, drifting, as if someone carried a lantern. Enam gasped. “Is it a boat?” “Or the lake spirit,” whispered Kofiga. Old fishermen told stories of a light that leads boats away, or home.', 'A faint blue lantern-like glow floats in the fog ahead of the canoe.'),
      pg('🧭', 'The light moved slowly, as if to say follow me. Kofiga stopped paddling. “Rule one,” he said. “We do not follow something we do not understand.” He turned the canoe against the light’s direction. “Rule two: we use what we know.”', 'A boy holds his paddle still and points the canoe away from the glowing light.'),
      pg('👂', 'They stopped the motor and listened. Faint sounds came from one direction: a rooster crowing, a dog barking, the clang of a bell. “Sounds travel over water,” said Kofiga. “The village is that way.” Enam tied the lamp to the bow and blew her whistle in short bursts.', 'The children listen in the fog while one blows a whistle and a lamp shines at the bow.'),
      pg('🔊', 'Slowly, they paddled towards the sounds, keeping low in the canoe. The blue light drifted beside them, never closer, never farther. Enam shivered. “It is not leading us,” said Kofiga. “It is only with us.” For the first time, the light did not feel scary. It felt like company.', 'The canoe moves slowly through fog with the blue light drifting beside it.'),
      pg('🏖️', 'Then a voice boomed across the water: “Kofiga! Enam!” Uncle Nyameye’s lamp swung back and forth on the shore. The sun broke through, and the fog lifted like a curtain. They landed safely on the beach. Their uncle hugged them both. “You waited, listened and used your heads,” he said.', 'The canoe reaches a beach where an uncle with a lamp waits and the fog is clearing.'),
      pg('🌅', 'Kofiga looked back at the lake. The blue light was still there, hovering above the water, brighter than before. Then it dipped, like a bow, and was gone. “Marsh gas?” guessed Enam. “Or a fisherman’s lamp, or a spirit.” “Or all three,” said Uncle Nyameye. “A good fisher respects the lake and never follows a light into fog.” The end.', 'The glowing light dips like a bow over the lake as the sun rises over a clear horizon.'),
    ],
    activities: [
      { id: 'lake-c1', type: 'comprehension', afterPage: 2, question: 'Why did Kofiga say fog forms on the lake?', options: ['Cool air meets warmer water', 'The sun is too hot', 'It rained'], correctIndex: 0 },
      { id: 'lake-c2', type: 'comprehension', afterPage: 4, question: 'What was Kofiga’s rule about the blue light?', options: ['Do not follow something you do not understand', 'Follow it quickly', 'Throw a stone at it'], correctIndex: 0 },
      { id: 'lake-p1', type: 'prediction', afterPage: 5, prompt: 'The children cannot see the shore but they can hear the village. What should they do?', options: ['Paddle slowly towards the sounds and keep whistling', 'Follow the light', 'Jump out of the canoe'] },
      { id: 'lake-voc', type: 'vocabulary', afterPage: 2, word: 'fog', definition: 'A thick cloud close to the ground or water that is hard to see through.', distractors: ['A kind of fish', 'A strong wind'] },
      { id: 'lake-s1', type: 'sequencing', prompt: 'Put the crossing in order.', items: ['Fog rolled in over the lake.', 'They listened for the village.', 'They paddled slowly towards the sounds.', 'Uncle Nyameye’s lamp guided them to the shore.'] },
      { id: 'lake-sel', type: 'sel', afterPage: 8, prompt: 'Kofiga was scared, but he followed his rules and stayed calm. What rules help you in a scary moment?', feelingOptions: ['Scared', 'Calm', 'Proud', 'Relieved'] },
    ],
    glossary: [
      { word: 'fog', definition: 'A thick cloud close to the ground or water.', pages: [2] },
      { word: 'respect', definition: 'Treating someone or something with care and honour.', pages: [1] },
      { word: 'bow', definition: 'The front of a boat.', pages: [5] },
      { word: 'landing', definition: 'A place where boats come ashore.', pages: [1] },
    ],
    culturalNotes: ['Lake Volta is one of the world’s largest man-made lakes by surface area, created after the Akosombo Dam. The family, canoe and crossing are invented. Many fishing communities live and work on its shores.', 'Old stories of lights on the water are treated with respect; the story offers several possible explanations and does not insist on one.'],
    reviewQuestions: ['Verify lake facts if added; check that safety messages (life jackets, waiting, listening, whistles) match fishing-safety guidance.', 'Is the “marsh gas” guess appropriate for a lake setting, or should a different example be used?', 'Does the ending leave room for wonder without encouraging children to follow lights?'],
    guide: {
      overview: 'A foggy-lake adventure in which a possibly magical light tests a child’s judgement. The lessons are practical: life jackets, staying calm, listening, and not following what you do not understand.',
      lessonMinutes: 45,
      goals: ['Explain how fog forms in simple terms.', 'Describe how sound can guide people in fog.', 'Discuss why children must not follow strange lights.'],
      subjects: [['Integrated Science', 'Weather and sound'], ['Personal and Social Development', 'Water safety and judgement'], ['English Language', 'Suspense and inference']],
      before: ['Ask: how can you find your way when you cannot see?'],
      during: ['At page 4, ask learners to explain Kofiga’s two rules.'],
      after: ['Make fog in a jar with warm water, ice and a match-free method your teacher approves.', 'Write a safety poster for people who travel on the water.'],
      discussion: ['Why did Kofiga refuse to follow the light?', 'How did sound help them?'],
      reflection: ['What safety rules do you follow near water?'],
      maths: [{ task: 'The crossing normally takes 20 minutes. The fog made it take 3 times as long. How long did it take?', answer: '60 minutes, which is 1 hour.' }, { task: 'Enam blew her whistle 4 times each minute for 15 minutes. How many blasts?', answer: '4 × 15 = 60 blasts.' }],
      support: ['Provide a sound-and-direction diagram.'],
      stretch: ['Design a safety kit for a small boat and explain each item.'],
      localise: ['Involve a local fisher, a swimming or water-safety instructor and the local boat-safety rules.', 'Always teach life jackets, adult supervision and never travelling in fog without adults.'],
      factCheck: [{ claim: 'Fog can form when cool air sits over warmer water or when air cools to its dew point near the surface.', explanation: 'General meteorology; the story states a simplified version.', reference: 'Ghana Meteorological Agency or a weather textbook (to verify).' }, { claim: 'Lake Volta was created by the Akosombo Dam and is one of the largest man-made lakes by surface area.', explanation: 'Widely stated; confirm the latest ranking.', reference: 'Volta River Authority (to verify).' }],
    },
  }),

  // 5 ----------------------------------------------------------------------------------------------------------------
  mk({
    key: 'the-dust-that-danced',
    title: 'The Dust That Danced',
    summary: 'During the harmattan, a pale figure seems to walk across the school field at dusk. Zubeida can hear the wind in a way nobody else can. She and her friend Fuseini test what the figure is, keep their classmates safe, and ask the wind for a favour.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'proficient',
    difficulty: 4,
    genres: ['mystery', 'fantasy', 'realistic-fiction'],
    themes: ['fear-and-courage', 'weather', 'school'],
    objectives: ['scientific-curiosity', 'critical-thinking', 'responsibility', 'reasoning', 'teamwork'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 130,
    paceWord: 'Dry, quiet and eerie, speeding up at the whirl',
    palette: ['#92400e', '#e7d5b3'],
    voice: 'Cool, calm narrator with a slight rasp; Zubeida’s humming is soft and wind-like',
    characters: [
      'Zubeida: a 13-year-old girl in a school uniform with a long scarf, humming softly, holding a cloth strip.',
      'Fuseini: her friend, 13, in a white shirt and brown shorts, carrying a thermometer from the science room.',
      'Mr Wumbei: the science teacher, a tall man in a checked shirt, with a clipboard.',
      'The harmattan: a pale, dusty haze, a dim orange sun, a dry field with scattered grass, and a whirling pale column of dust.',
    ],
    music: 'Dry wind, soft whistling tones and a low drum, tightening as the whirl grows (placeholder)',
    pages: [
      pg('🌫️', 'It was harmattan in Tamale. The wind blew dry and dusty from the Sahara, the sun looked like a pale orange coin, and every surface wore a thin layer of dust. At the boarding school, evening study was almost over when Fuseini gasped. “Look at the field.”', 'A dusty school field at dusk with a pale orange sun behind a haze.'),
      pg('👻', 'A pale figure stood in the middle of the field, tall and thin, swaying. It slowly turned. Students at the windows whispered. “A ghost,” said one. “The dust spirit,” said another. Zubeida, who could always hear the wind, felt it humming in her ears. “It is not angry,” she said. “It is… asking.”', 'Students at a window point at a pale swirling figure on the dusty field.'),
      pg('🌡️', 'Mr Wumbei, the science teacher, came out with a clipboard. “Let us be careful,” he said. “Not frightened, not foolish.” Fuseini brought a thermometer. Zubeida held up a strip of cloth. “First,” said Mr Wumbei, “observe from a distance, then test.”', 'A teacher and two students stand on the school steps with a thermometer and a cloth strip.'),
      pg('☀️', 'Fuseini read the thermometer: the bare ground was much hotter than the air above it. “Hot ground heats the air just above it,” he said. “The hot air rises quickly in a column.” The figure grew taller, and its base spun faster. “That could pull dust into a spinning column,” he said. “A dust devil.”', 'A student reads a thermometer near the baked ground while a dust column rises behind him.'),
      pg('⚡', 'Behind them, in the hostel, two students laughed and shook a nylon blanket in the dark. Blue sparks crackled along it. “Ghost lightning!” cried a girl. “It is static electricity,” said Fuseini. “Very dry air lets charge build up on cloth.” Mr Wumbei nodded. “Harmattan air is very dry, so it happens often.”', 'Students in a dark room shake a blanket that gives off tiny blue sparks.'),
      pg('🌪️', 'Out on the field, the dust devil lurched towards the school. “Back inside, everyone!” called Mr Wumbei. “Cover your eyes and mouth. Never walk into a dust devil.” Students hurried in and shut the windows. Zubeida stayed at the door, her hair whipping. “Wait,” she whispered to the wind. “Please.”', 'A swirling dust column moves across the field as students run inside and a girl stands at the door.'),
      pg('🎶', 'Zubeida began to hum a low, steady note. The whirl slowed. For a moment, the dust column seemed to turn its head, like a listener. Then it bent away from the school, drifted to the empty field edge, spread out, and sank into a gentle swirl of dust on the ground.', 'A girl hums at the doorway as the dust column bends away and settles on the far edge of the field.'),
      pg('🌙', 'Silence. The sun slipped away. “Did you do that?” asked Fuseini. “Or did it just fade?” Zubeida smiled. “Dust devils do die out, and the wind changes.” “But?” “But it listened,” she said. Mr Wumbei wrote in his notes: Observed. Explained. Safe. And one line more: Do not rule out wonder. The end.', 'A girl, a boy and a teacher stand together at dusk as the last dust settles on the field.'),
    ],
    activities: [
      { id: 'dust-c1', type: 'comprehension', afterPage: 4, question: 'What did Fuseini say causes a dust devil?', options: ['Hot ground heating air that rises in a spinning column', 'A ghost walking', 'A school bell'], correctIndex: 0 },
      { id: 'dust-c2', type: 'comprehension', afterPage: 5, question: 'What explains the sparks on the nylon blanket?', options: ['Static electricity in very dry air', 'A ghost', 'Moonlight'], correctIndex: 0 },
      { id: 'dust-p1', type: 'prediction', afterPage: 6, prompt: 'The dust devil is moving towards the school. What is the safest thing for the students to do?', options: ['Go inside, close windows and cover eyes and mouth', 'Run into the whirl', 'Stand in the doorway to watch'] },
      { id: 'dust-voc', type: 'vocabulary', afterPage: 1, word: 'harmattan', definition: 'A dry, dusty wind that blows from the Sahara over West Africa, mostly between about November and March.', distractors: ['A heavy rain', 'A type of drum'] },
      { id: 'dust-s1', type: 'sequencing', prompt: 'Put the investigation in order.', items: ['Students saw a pale figure on the field.', 'Fuseini measured the hot ground.', 'The dust devil moved towards the school.', 'Everyone went inside and the whirl faded away.'] },
      { id: 'dust-sel', type: 'sel', afterPage: 8, prompt: 'Zubeida felt something she could not explain, and still stayed careful. How do you feel about things science cannot yet explain?', feelingOptions: ['Curious', 'Uneasy', 'Amazed', 'Calm'] },
    ],
    glossary: [
      { word: 'harmattan', definition: 'A dry, dusty wind from the Sahara that blows across West Africa in the dry season.', pages: [1] },
      { word: 'static', definition: 'A build-up of electric charge on things that are rubbed together, often in dry air.', pages: [5] },
      { word: 'column', definition: 'A tall, thin shape like a pillar.', pages: [4] },
      { word: 'observe', definition: 'Look carefully and notice what is happening.', pages: [3] },
    ],
    culturalNotes: ['The harmattan is a dry, dusty wind that crosses West Africa in the dry season, typically from about late November to March. The school, characters and events are invented.', 'The story respects local ideas about spirits in the wind by letting the “dust spirit” idea sit beside the science without mocking it.'],
    reviewQuestions: ['Check the harmattan season dates and the science (dust devils form when hot ground heats air that rises; dry air makes static more likely) with a geography or physics teacher.', 'Check the safety advice on dust devils: stay indoors or move away, cover eyes and mouth, never walk into one.', 'Is Zubeida’s gift handled lightly enough to leave room for wonder without implying the wind obeys children?'],
    guide: {
      overview: 'A harmattan mystery that connects heat, rising air and static electricity to spooky experiences. A small gift (Zubeida’s humming) is deliberately left unexplained.',
      lessonMinutes: 50,
      goals: ['Explain how a dust devil forms in simple terms.', 'Explain static electricity in dry air.', 'Discuss how scientists balance explanation and open questions.'],
      subjects: [['Integrated Science', 'Weather, heat and static electricity'], ['Geography', 'Seasons and wind in West Africa'], ['English Language', 'Atmosphere and suspense']],
      before: ['Ask: what is harmattan, and how does it change life in your area?'],
      during: ['At page 4, ask learners to explain the “ghost” using the thermometer reading.'],
      after: ['Rub a balloon on hair and show static attraction to small paper bits.', 'Make a safety poster for dust and wind.'],
      discussion: ['What natural events looked like ghosts?', 'What do you think about Zubeida’s humming?'],
      reflection: ['What do you want science to explain next?'],
      maths: [{ task: 'The ground was 47 °C and the air 31 °C. What was the difference?', answer: '16 °C.' }, { task: 'A dust devil travels at 5 m per second. How far does it go in 40 seconds?', answer: '5 × 40 = 200 m.' }],
      support: ['Provide a diagram of hot ground and rising air.'],
      stretch: ['Plan a safe experiment to measure temperature at different heights above the ground.'],
      localise: ['Use local harmattan experience and elders’ sayings.', 'Teach that children should never run into or stand near a dust devil.', 'Check that static experiments are safe and do not involve mains electricity.'],
      factCheck: [{ claim: 'Dust devils form when strongly heated ground warms the air above it, causing it to rise in a spinning column.', explanation: 'General meteorology; story simplifies.', reference: 'A meteorology textbook or NOAA/UK Met Office page (to verify).' }, { claim: 'The harmattan is a dry, dusty wind blowing from the Sahara across West Africa, mainly late November to March.', explanation: 'Widely stated; verify exact dates for Ghana.', reference: 'Ghana Meteorological Agency (to verify).' }],
    },
  }),
];

