import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (
  motif: string,
  text: string,
  alt: string,
  narration = 'Clear, warm storyteller voice; a short pause at the end of the page.',
): Page => ({
  motif,
  text,
  alt,
  brief: `Warm hand-painted gouache scene, landscape 4:3, following the character notes exactly. ${alt} Strictly no text, letters, numbers or written labels anywhere inside the artwork. Keep a calm, uncluttered area for text.`,
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
  culturalTags?: Classification['culturalTags'];
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
      notes: [
        'Read dialogue with a different voice for each character.',
        'Pause for two seconds at each question activity.',
        'Never rush the last page: let the ending land.',
      ],
    },
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: [
      'Is the language right for the stated age band and reading level?',
      'Is anything here inaccurate, stereotyped or unsafe for children?',
      ...s.reviewQuestions,
    ],
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
 * Batch 36: NaCCA Basic 4 Science (Primary 4). Eight stories: classifying animals and their life processes
 * (B4.1.1.1.1, B4.1.1.1.2); parts of a plant and their jobs (B4.2.2.1.1); making water safe for use (B4.2.1.5.1);
 * the digestive system (B4.3.1.1.1); the Sun at the centre of the solar system (B4.3.2.1.1); conserving electricity
 * (B4.4.2.1.2); measles (B4.5.2.1.1); and the ecosystem (B4.3.3.1.1). Standards aligned with the NaCCA Science Upper
 * Primary B4–B6 curriculum.
 */

export const BATCH_36_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'oppong-and-the-animal-walk',
    title: 'Oppong and the Animal Walk',
    summary: 'Oppong and Naab walk around the school compound and sort the animals they see into insects, birds, mammals, and reptiles. They learn what makes each group special and how all animals move, feed, and reproduce.',
    classIds: ['primary-4'],
    ageMin: 9,
    ageMax: 11,
    readingLevel: 'developing',
    difficulty: 3,
    genres: ['science', 'animal', 'school-life'],
    themes: ['animals-and-habitats', 'school', 'friendship'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'summarising'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 100,
    paceWord: 'Steady, like a careful walk',
    palette: ['#16a34a', '#f59e0b'],
    voice: 'A curious boy’s voice for Oppong; a quick-thinking girl’s voice for Naab',
    characters: [
      'Oppong: a nine-year-old Ghanaian boy with short neat hair in a yellow shirt and khaki-brown school shorts, holding a plain unlabelled notebook.',
      'Naab: his ten-year-old Ghanaian classmate with neat braided puffs tied with yellow ribbons, wearing a yellow shirt and brown school pinafore, holding a wooden pencil.',
      'Their teacher: a warm Ghanaian female Primary 4 teacher with braided hair in a bun, wearing a leafy green African-print dress.',
    ],
    music: 'A light walking tune with small animal sounds (placeholder)',
    pages: [
      pg(
        '📓',
        'Their teacher took the class on an animal walk around the school compound. “Look, listen, and write,” she said. “Do not touch any animal. We only watch.” Oppong and Naab drew a neat table with four headings: insects, birds, mammals, and reptiles.',
        'Oppong, Naab, and their Ghanaian teacher in a green patterned dress walk carefully around a sunlit school compound holding plain open notebooks.',
      ),
      pg(
        '🐜',
        'On a green leaf, Naab spotted a grasshopper. “It has six legs, and its body has three parts,” she said. “Those are signs of an insect.” Nearby, ants carried crumbs and a butterfly landed on a flower. They wrote all three under insects.',
        'Oppong and Naab crouch safely beside a bush watching a green grasshopper on a leaf, trailing ants, and a colourful butterfly on a flower.',
      ),
      pg(
        '🐔',
        'A speckled hen scratched in the dust, and a small weaver bird sat on the classroom roof. “Birds have feathers, wings, a beak, and two legs,” said Oppong. “And they lay eggs.” They wrote hen and bird under birds.',
        'A speckled brown hen scratches in the dusty schoolyard while a yellow weaver bird perches on the classroom roof as Oppong and Naab watch.',
      ),
      pg(
        '🐐',
        'By the wooden fence stood a brown goat, and a dog slept in the shade. “Mammals have hair or fur,” said the teacher. “A mother mammal feeds her babies with milk.” Naab giggled. “People are mammals, too!”',
        'A brown goat stands near a wooden school fence beside a sleeping dog in the shade while the teacher talks warmly with Oppong and Naab.',
      ),
      pg(
        '🦎',
        'On a warm wall, an agama lizard lay still in the sun. “Reptiles have dry skin covered with scales,” said Oppong. “Many lay eggs on land, and they warm up in the sun.” A green frog hopped past on the damp grass. “Its skin is wet and smooth,” said Naab. “It does not belong to any of our four groups.”',
        'An agama lizard basks on a sunny compound wall while a smooth green frog hops across damp grass nearby as Oppong and Naab observe.',
      ),
      pg(
        '📊',
        'Back in class, the teacher smiled. “The frog belongs to another group called amphibians, which we will study later,” she said. “Every animal moves, feeds, and reproduces to have young. Which of these life processes did you see today?” The class named them proudly and cheered.',
        'Inside the bright Ghanaian classroom, the teacher stands beside a wordless four-column picture chart of animal drawings while Oppong, Naab, and classmates cheer.',
      ),
    ],
    activities: [
      { id: 'cl-c1', type: 'comprehension', afterPage: 2, question: 'How many legs does an insect have?', options: ['Six', 'Four', 'Eight'], correctIndex: 0 },
      { id: 'cl-c2', type: 'comprehension', afterPage: 4, question: 'Which animals feed their babies with milk?', options: ['Mammals', 'Insects', 'Reptiles'], correctIndex: 0 },
      { id: 'cl-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the walk in order.', items: ['They looked at insects.', 'They looked at birds.', 'They looked at mammals.', 'They looked at a reptile.'] },
      { id: 'cl-voc', type: 'vocabulary', afterPage: 5, word: 'reptile', definition: 'An animal with dry skin covered in scales.', distractors: ['An animal with feathers', 'An animal with six legs'] },
    ],
    glossary: [
      { word: 'insect', definition: 'A small animal with six legs and a body in three parts.', pages: [2] },
      { word: 'mammals', definition: 'Animals with hair or fur whose mothers feed their babies milk.', pages: [4] },
      { word: 'scales', definition: 'Small, hard, thin plates that cover the skin of reptiles.', pages: [5] },
    ],
    culturalNotes: [
      'Hens, goats, agama lizards, and grasshoppers are seen in many Ghanaian school compounds. The story follows NaCCA Basic 4 Science standards on classifying animals and their life processes (B4.1.1.1.1, B4.1.1.1.2).',
      'The frog is not forced into one of the four groups. It is named accurately as an amphibian to be studied later.',
    ],
    reviewQuestions: [
      'Check the features given for each group against NaCCA B4.1.1.1.1.',
      'Check that the story treats the frog honestly as an amphibian outside the four groups.',
    ],
    guide: {
      overview: 'An animal walk shows how to sort animals into insects, birds, mammals, and reptiles by their observable body features. Children also learn that all animals move, feed, and reproduce. Based on NaCCA Basic 4 Science.',
      lessonMinutes: 40,
      goals: [
        'Sort animals into four groups using observable body features.',
        'Give at least one defining feature of each group.',
        'Explain that all animals move, feed, and reproduce.',
      ],
      subjects: [
        ['Science (NaCCA B4.1.1.1.1, B4.1.1.1.2)', 'Classifying animals and life processes'],
        ['English', 'Making and reading a classification table'],
      ],
      before: ['Ask: how can we tell a bird from a lizard just by looking closely?'],
      during: ['Pause at each page and let learners name the body feature that decides the animal group.'],
      after: ['Sort picture cards into four groups and give reasons.', 'Act out how different animals move and feed.'],
      discussion: ['Why does the frog not fit our four groups?', 'Why is it important for animals to feed and reproduce?'],
      reflection: ['Which animal group surprised you most today?'],
      support: ['Use picture cards with a key feature prompt on each.'],
      stretch: ['Investigate an animal that surprises people—such as a bat—and explain why it is a mammal rather than a bird.'],
      localise: ['Observe the animals found safely around your school compound.', 'Look, do not touch: some animals bite or sting. Wash hands with soap after the walk.'],
      factCheck: [
        {
          claim: 'Insects have six legs and three body parts, birds have feathers and beaks, mammals have hair or fur and nurse young with milk, reptiles have dry scaly skin, and frogs are smooth-skinned amphibians.',
          explanation: 'Matches standard vertebrate and invertebrate morphological classification taught in upper primary science.',
          reference: 'NaCCA Science Curriculum for Basic 4 (B4.1.1.1.1 & B4.1.1.1.2).',
        },
      ],
    },
  }),

  // 2
  mk({
    key: 'yiadom-and-the-plant-with-a-secret',
    title: 'Yiadom and the Plant with a Secret',
    summary: 'Yiadom and Lobnibe study a young plant and discover the jobs of its roots, stem, leaves, and flower. A coloured-water experiment shows how a stem carries water upward.',
    classIds: ['primary-4'],
    ageMin: 9,
    ageMax: 11,
    readingLevel: 'developing',
    difficulty: 3,
    genres: ['science', 'educational', 'school-life'],
    themes: ['farm-and-garden', 'school', 'friendship'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'summarising'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 100,
    paceWord: 'Careful and curious, like a close look',
    palette: ['#22c55e', '#a16207'],
    voice: 'A thoughtful boy’s voice for Yiadom; a bright girl’s voice for Lobnibe',
    characters: [
      'Yiadom: a nine-year-old Ghanaian boy with short-cropped hair in a yellow shirt and khaki-brown school shorts.',
      'Lobnibe: his nine-year-old Ghanaian female classmate with neat cornrows and green hair beads, wearing a yellow shirt and brown school pinafore, holding a small magnifying hand lens.',
      'Their teacher: a friendly Ghanaian female Primary 4 teacher in a warm ochre-and-green African-print dress.',
    ],
    music: 'A soft garden tune with a gentle lift (placeholder)',
    pages: [
      pg(
        '🌱',
        'In the school garden, the teacher knelt beside a patch of young weeds. “Wash your hands with soap after touching soil, and never taste any part of a plant,” she reminded the class. First, Yiadom tugged a small plant gently, and it held fast in the ground. Then the teacher loosened the damp soil carefully so Yiadom and Lobnibe could lift it out whole.',
        'In a Ghanaian school garden, a teacher in a patterned dress shows Yiadom and Lobnibe how to loosen damp soil and lift a small green plant whole.',
      ),
      pg(
        '🪢',
        'At the bottom of the lifted plant spread thin white threads. “Those are the roots,” said Lobnibe, looking closely. “That is why the plant held so firmly when you tugged it! Roots hold the plant in the soil and take in water.”',
        'Yiadom holds up the small uprooted plant showing its clean white branching roots while Lobnibe inspects them closely.',
      ),
      pg(
        '🌿',
        'Back in class, the teacher placed the stem of a white flower into a glass jar of pink-coloured water. By the next morning, the tips of the white petals had turned pink! “The stem carries water up from the roots to the other parts,” she said. “It also holds the plant upright.”',
        'On a wooden classroom table, Yiadom, Lobnibe, and their teacher lean in to admire a white flower in a glass jar of pink water with pink-tipped petals.',
      ),
      pg(
        '🍃',
        '“What do the leaves do?” asked Lobnibe, holding up her hand lens. The teacher smiled. “Leaves make food for the plant using sunlight, air, and water. You can think of a green leaf as the plant’s kitchen.” Yiadom smiled at the broad green leaves.',
        'Lobnibe peers through a magnifying hand lens at the broad green leaves of the plant while Yiadom and their teacher watch beside a sunny window.',
      ),
      pg(
        '🌼',
        'At the top of the plant grew a small yellow flower. “The flower makes seeds,” said the teacher. “Later, those seeds can grow into new plants.” Outside the window, Lobnibe spotted a bee visiting a blossom. “Bees help carry pollen from flower to flower,” she said.',
        'Outside the open classroom window, a golden honeybee hovers beside a small yellow garden flower while Yiadom and Lobnibe watch eagerly.',
      ),
      pg(
        '📝',
        'The two friends painted the plant and pointed to every part in order. Then they shared their discovery: “Roots grow below because water is in the soil, and leaves spread up high where the sun shines.” “The place of each part fits its job!” said Yiadom.',
        'Yiadom and Lobnibe proudly hold up a colourful wordless painting of a plant showing white roots, a green stem, broad leaves, and a yellow flower.',
      ),
    ],
    activities: [
      { id: 'pp-c1', type: 'comprehension', afterPage: 2, question: 'What do roots do?', options: ['Hold the plant firmly and take in water', 'Make seeds for new plants', 'Turn the flower petals pink'], correctIndex: 0 },
      { id: 'pp-c2', type: 'comprehension', afterPage: 5, question: 'What does the flower make?', options: ['Seeds', 'Soil', 'Water'], correctIndex: 0 },
      { id: 'pp-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the parts in order, from the bottom of the plant upward.', items: ['Roots', 'Stem', 'Leaves', 'Flower'] },
      { id: 'pp-voc', type: 'vocabulary', afterPage: 3, word: 'stem', definition: 'The part of a plant that holds it upright and carries water.', distractors: ['The part that makes seeds', 'The part under the soil'] },
    ],
    glossary: [
      { word: 'roots', definition: 'The parts of a plant that hold it in the soil and take in water.', pages: [2] },
      { word: 'stem', definition: 'The part of a plant that holds it upright and carries water.', pages: [3] },
      { word: 'leaves', definition: 'The flat green parts of a plant that make food using sunlight, air, and water.', pages: [4] },
      { word: 'flower', definition: 'The part of a plant that makes seeds for new plants.', pages: [5] },
    ],
    culturalNotes: [
      'Children across Ghana observe weeds and crops in school gardens and family farms. The story follows the NaCCA Basic 4 Science standard on the parts of a plant and their functions (B4.2.2.1.1).',
      'The coloured-water experiment uses safe food colouring under teacher supervision; learners wash hands after handling soil and never taste unknown plants.',
    ],
    reviewQuestions: [
      'Check the jobs given for roots, stem, leaves, and flower against NaCCA B4.2.2.1.1.',
      'Check that the story relates each part’s job to its position on the plant.',
    ],
    guide: {
      overview: 'Children examine a young plant to learn what its roots, stem, leaves, and flower do, and observe a coloured-water transpiration test that makes stem transport visible. Based on NaCCA Basic 4 Science.',
      lessonMinutes: 40,
      goals: [
        'Name the four main parts of a flowering plant.',
        'State the main function of roots, stem, leaves, and flowers.',
        'Explain how each part’s position suits its function.',
      ],
      subjects: [
        ['Science (NaCCA B4.2.2.1.1)', 'Parts of a plant and their functions'],
        ['Creative Arts', 'Observational plant drawing'],
      ],
      before: ['Ask: why do you think roots grow underground while leaves spread out in the air?'],
      during: ['Let learners inspect a safe uprooted weed with a hand lens.'],
      after: ['Draw a flowering plant and explain one job of each part.', 'Set up the food-colouring and white-flower stem test overnight.'],
      discussion: ['What would happen to a plant if it lost its roots?', 'Why do leaves grow where sunlight can reach them?'],
      reflection: ['Which part of a plant do you think works hardest, and why?'],
      support: ['Provide a plant diagram and match each part to its function card.'],
      stretch: ['Investigate how insects like bees help flowers form fruits and seeds.'],
      localise: ['Use safe, non-irritating weeds from your school compound and food colouring for the water jar.', 'Wash hands thoroughly after touching soil and plants; never taste unknown plants.'],
      factCheck: [
        {
          claim: 'Roots anchor the plant and absorb water, stems support the plant and transport water upward, green leaves make food using sunlight, air, and water, and flowers produce seeds.',
          explanation: 'Core upper-primary plant structure and function concepts, with coloured-water uptake demonstrating xylem transport through the stem.',
          reference: 'NaCCA Science Curriculum for Basic 4 (B4.2.2.1.1).',
        },
      ],
    },
  }),

  // 3
  mk({
    key: 'brobbey-and-the-cloudy-water',
    title: 'Brobbey and the Cloudy Water',
    summary: 'Brobbey and Amegashie compare water samples and learn safe ways to make water fit for use: filtering, boiling, and using approved chlorine or water-treatment tablets. They discover why clear water is not always safe to drink.',
    classIds: ['primary-4'],
    ageMin: 9,
    ageMax: 11,
    readingLevel: 'developing',
    difficulty: 3,
    genres: ['science', 'educational', 'school-life'],
    themes: ['health-and-wellbeing', 'school', 'community'],
    objectives: ['scientific-curiosity', 'problem-solving', 'responsibility', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 100,
    paceWord: 'Clear and steady, like water settling',
    palette: ['#0284c7', '#a16207'],
    voice: 'An eager boy’s voice for Brobbey; a careful girl’s voice for Amegashie',
    characters: [
      'Brobbey: a nine-year-old Ghanaian boy with short neat hair in a yellow shirt and khaki-brown school shorts.',
      'Amegashie: his ten-year-old Ghanaian female classmate with neat braided hair tied with blue ribbons, wearing a yellow shirt and brown school pinafore.',
      'Their teacher: a composed Ghanaian male Primary 4 teacher in a crisp light-blue collared shirt and dark trousers.',
    ],
    music: 'A calm tune with soft water sounds (placeholder)',
    pages: [
      pg(
        '🫙',
        'On the teacher’s table stood three glass jars. One held muddy water from a pond, one held water from a borehole, and one held water from a tap. “Look and smell carefully, but never taste any of these samples,” said the teacher. “Good drinking water is clear, has no bad smell, and has no germs.”',
        'In a Ghanaian classroom, Brobbey and Amegashie inspect three unlabelled glass jars of muddy, borehole, and tap water on their teacher’s table.',
      ),
      pg(
        '🧴',
        'Together, the class built a simple filter. Earlier, the teacher had safely cut a plastic bottle and turned the top half upside down like a funnel, layering clean cloth, sand, and small washed stones inside. When Brobbey poured in the muddy water, the water that dripped out below was much clearer.',
        'Brobbey pours muddy water into an inverted plastic bottle filter layered with cloth, sand, and small pebbles as clearer water drips into a jar below.',
      ),
      pg(
        '🤔',
        '“Is it safe to drink now?” asked Amegashie thoughtfully. “No,” said the teacher. “Clear water can still hold germs, and germs are far too small for our eyes to see. Filtering only takes out dirt. We must also kill the germs.”',
        'Amegashie looks thoughtfully at the jar of clearer filtered water while her teacher holds up a gentle warning finger.',
      ),
      pg(
        '🔥',
        '“One sure way is boiling,” said the teacher. “Boiling water for a few minutes and letting it cool in a clean, covered container kills germs and makes it safe to drink. Remember, children must never boil water alone or touch hot pots—a grown-up must do it.”',
        'The teacher points to a wordless classroom picture showing an adult safely boiling water in a covered pot on a stove as Brobbey and Amegashie listen.',
      ),
      pg(
        '💧',
        '“Another way is to use safe chlorine drops or a water-treatment tablet,” he explained. “An adult must follow the health worker’s instructions for the exact amount. Alum helps mud settle to the bottom, but alum alone does not kill germs.”',
        'The teacher holds up a plain unlabelled blister strip of water-treatment tablets beside a covered clay water pot while Brobbey and Amegashie watch.',
      ),
      pg(
        '📋',
        'The class drew a five-step picture chart: filter, boil, treat, cover, and store cleanly. Then they discussed the dangers of unsafe water. “Unclean water can cause serious stomach illnesses,” said Brobbey. “So we must make drinking water safe and always keep it covered!”',
        'Brobbey, Amegashie, and classmates proudly hold up a wordless five-panel picture poster showing filtering, boiling, water drops, and a covered pot.',
      ),
    ],
    activities: [
      { id: 'wt-c1', type: 'comprehension', afterPage: 3, question: 'Why is clear water not always safe to drink?', options: ['It can still hold germs too small to see', 'It is always too cold', 'It has too much air'], correctIndex: 0 },
      { id: 'wt-c2', type: 'comprehension', afterPage: 4, question: 'Who should boil water or handle water-treatment chemicals?', options: ['A grown-up', 'Any young child alone', 'Nobody'], correctIndex: 0 },
      { id: 'wt-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the steps for making muddy water safe in order.', items: ['Filter out the mud and dirt.', 'A grown-up boils the clear water.', 'Let the boiled water cool.', 'Store it in a clean, covered container.'] },
      { id: 'wt-voc', type: 'vocabulary', afterPage: 2, word: 'filter', definition: 'A tool that traps dirt and solid bits as water passes through.', distractors: ['A pot that heats water on a stove', 'A spoon that stirs sugar into tea'] },
    ],
    glossary: [
      { word: 'filter', definition: 'A tool that traps dirt as water passes through.', pages: [2, 6] },
      { word: 'germs', definition: 'Tiny living things too small to see that can cause illness.', pages: [1, 3, 4, 5] },
      { word: 'boiling', definition: 'Heating water until bubbles rise briskly, which kills germs.', pages: [4] },
      { word: 'chlorine', definition: 'A safe water-treatment chemical that kills germs when used in the right amount.', pages: [5] },
    ],
    culturalNotes: [
      'Many Ghanaian communities use boreholes, taps, rivers, and rainwater. The story follows the NaCCA Basic 4 Science standard on making water safe for use (B4.2.1.5.1).',
      'Follows the curriculum’s explicit safety rule: learners must never taste classroom water samples, and boiling or chemical treatment is performed by adults.',
    ],
    reviewQuestions: [
      'Confirm the water-safety steps match Ghana Health Service and Community Water and Sanitation Agency guidance.',
      'Check that filtering and alum settling are clearly distinguished from germ disinfection (boiling or chlorine).',
    ],
    guide: {
      overview: 'Learners compare water samples, build a simple sand-and-cloth filter, and learn why disinfection by boiling or approved chlorine treatment—plus clean covered storage—is essential for safe drinking water. Based on NaCCA Basic 4 Science.',
      lessonMinutes: 40,
      goals: [
        'Describe three stages used to make cloudy water safe (filtering, boiling or chlorinating, and clean covered storage).',
        'Explain why clear-looking water can still contain invisible germs.',
        'Follow strict safety rules around water samples, heat, and treatment tablets.',
      ],
      subjects: [
        ['Science (NaCCA B4.2.1.5.1)', 'Making water safe for use'],
        ['Our World Our People', 'Clean water and community health'],
      ],
      before: ['Ask: where does your household get drinking water, and how do you keep it clean?'],
      during: ['Build a demonstration bottle filter together; the teacher prepares the cut bottle beforehand.'],
      after: ['Create a picture poster showing safe water steps.', 'Discuss why drinking cups should have handles or clean ladles rather than dipping hands into pots.'],
      discussion: ['Why must stored drinking water always stay covered?', 'Why is alum or cloth filtering alone not enough to stop waterborne diseases?'],
      reflection: ['What safe-water habit will you share with your family today?'],
      support: ['Use picture cards for filter, boil, treat, and cover.'],
      stretch: ['Find out how Ghana Water Limited treats river water for towns and cities.'],
      localise: ['Discuss the water sources common in your district.', 'Children must never taste classroom water samples, boil water unsupervised, or handle chemicals.'],
      factCheck: [
        {
          claim: 'Cloth/sand filtration and alum coagulation clarify water by removing suspended dirt, whereas boiling or proper chlorination is required to kill disease-causing microbes.',
          explanation: 'Microorganisms pass through sand/cloth pores and survive alum flocculation; thermal disinfection (rolling boil) or measured chlorine treatment inactivates waterborne pathogens.',
          reference: 'NaCCA Science Curriculum for Basic 4 (B4.2.1.5.1) & WHO Household Water Treatment Guidelines.',
        },
      ],
    },
  }),

  // 4
  mk({
    key: 'ayivor-and-the-journey-of-the-kenkey',
    title: 'Ayivor and the Journey of the Kenkey',
    summary: 'Ayivor eats kenkey and fish at break, and Mettle asks where the food goes next. Their class traces the meal through the mouth, food pipe, stomach, small intestine, and large intestine.',
    classIds: ['primary-4'],
    ageMin: 9,
    ageMax: 11,
    readingLevel: 'developing',
    difficulty: 3,
    genres: ['science', 'humour', 'school-life'],
    themes: ['food', 'health-and-wellbeing', 'school'],
    objectives: ['scientific-curiosity', 'sequencing', 'vocabulary', 'reasoning'],
    ghanaianContext: 'central',
    culturalTags: ['local-food', 'local-names'],
    wpm: 100,
    paceWord: 'Playful, with a small pause at each stop',
    palette: ['#ea580c', '#0d9488'],
    voice: 'A cheerful boy’s voice for Ayivor; a curious girl’s voice for Mettle',
    characters: [
      'Ayivor: a cheerful nine-year-old Ghanaian boy with short hair in a yellow shirt and khaki-brown school shorts.',
      'Mettle: his observant nine-year-old Ghanaian female classmate with two neat braided puffs tied with teal ribbons, wearing a yellow shirt and brown school pinafore.',
      'Their teacher: a smiling Ghanaian female Primary 4 teacher in a coral-and-teal patterned dress.',
    ],
    music: 'A bouncy tune that moves along like a journey (placeholder)',
    pages: [
      pg(
        '🍽️',
        'At break time, Ayivor ate warm kenkey with fried fish and pepper. Mettle watched him curiously. “Where does the food go after you swallow it?” she asked. Ayivor shrugged. “I do not know!” Their teacher heard them and smiled. “Let us follow its journey in class.”',
        'Under a shady school veranda at break time, Ayivor eats kenkey from corn husks with fried fish while Mettle watches curiously and their teacher smiles.',
      ),
      pg(
        '👄',
        '“The journey starts in the mouth,” said the teacher. “Your teeth cut and crush the food into small bits. Saliva, the clear wet liquid in your mouth, softens the food and begins breaking it down. Then your tongue pushes it back so you can swallow.”',
        'In class, the teacher points to a colourful wordless chalkboard drawing of an open mouth with white teeth and a tongue while Ayivor and Mettle listen.',
      ),
      pg(
        '🔽',
        '“Next, the food travels down a muscular tube called the food pipe,” she said. “Its muscles gently squeeze and push the food downward into the stomach, a stretchy bag. The stomach churns the food with digestive juices until it becomes like thick soup.”',
        'The teacher points to a wordless colour diagram showing the food pipe leading into a pink J-shaped stomach as Ayivor touches his tummy and grins.',
      ),
      pg(
        '🌀',
        '“From the stomach, the food moves into the small intestine, a long, coiled tube,” said the teacher. “Here the food is broken down even further, and the good parts—called nutrients—pass into the blood. The blood carries nutrients to every part of your body.”',
        'Mettle and Ayivor lean forward at their desks looking at a bright wordless diagram of the coiled small intestine surrounded by glowing droplets.',
      ),
      pg(
        '🚽',
        '“Whatever the body cannot use moves into the large intestine,” she continued. “It takes back water for the body, and the solid waste that remains leaves when we go to the toilet. Always wash your hands with soap and clean water afterwards.”',
        'Beside a wordless diagram of the large intestine, the teacher gestures toward a clean classroom handwashing basin with soap and running water.',
      ),
      pg(
        '🎭',
        'The class used colourful cardboard cutouts to line up the whole digestive system in order: mouth, food pipe, stomach, small intestine, and large intestine. “To keep it healthy, chew your food well, drink clean water, eat fruits and vegetables, and wash your hands,” said the teacher. Ayivor grinned. “My kenkey took a long trip!”',
        'Ayivor, Mettle, and three classmates stand in a cheerful row holding unlabelled colourful cardboard shapes of a mouth, tube, stomach, and coiled intestines.',
      ),
    ],
    activities: [
      { id: 'dg-c1', type: 'comprehension', afterPage: 2, question: 'What does saliva do in the mouth?', options: ['It softens food and starts breaking it down', 'It freezes food solid', 'It turns food bright red'], correctIndex: 0 },
      { id: 'dg-c2', type: 'comprehension', afterPage: 4, question: 'Where do nutrients pass into the blood?', options: ['The small intestine', 'The teeth', 'The food pipe'], correctIndex: 0 },
      { id: 'dg-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the journey of the food in order.', items: ['Mouth', 'Food pipe', 'Stomach', 'Small intestine'] },
      { id: 'dg-voc', type: 'vocabulary', afterPage: 4, word: 'nutrients', definition: 'The good parts of food that the body uses to grow and stay healthy.', distractors: ['Solid waste that leaves the body', 'Hard enamel covering the teeth'] },
    ],
    glossary: [
      { word: 'saliva', definition: 'The clear liquid in the mouth that softens food and starts breaking it down.', pages: [2] },
      { word: 'stomach', definition: 'A stretchy muscular bag where swallowed food is churned with digestive juices.', pages: [3, 4, 6] },
      { word: 'intestine', definition: 'A long tube below the stomach where nutrients and water are absorbed and waste forms.', pages: [4, 5, 6] },
      { word: 'nutrients', definition: 'The useful parts of food that pass into the blood to nourish the body.', pages: [4] },
    ],
    culturalNotes: [
      'Kenkey with fried fish and pepper is a beloved meal across Ghana. The story follows the NaCCA Basic 4 Science standard on the organs of the human digestive system and their functions (B4.3.1.1.1).',
      'Presents the digestive pathway in accurate chronological order using age-appropriate Upper Primary terminology.',
    ],
    reviewQuestions: [
      'Check the sequence of digestive organs and their functions against NaCCA B4.3.1.1.1.',
      'Check that hygiene and healthy-eating habits are integrated naturally.',
    ],
    guide: {
      overview: 'Learners trace a familiar Ghanaian meal through the mouth, food pipe (oesophagus), stomach, small intestine, and large intestine, acting out each organ’s job. Based on NaCCA Basic 4 Science.',
      lessonMinutes: 40,
      goals: [
        'Name the main organs of the digestive system in sequence.',
        'Describe the basic role of the mouth, food pipe, stomach, small intestine, and large intestine.',
        'State practical habits that keep the digestive system healthy.',
      ],
      subjects: [
        ['Science (NaCCA B4.3.1.1.1)', 'Organs and functions of the digestive system'],
        ['Physical Education', 'Sequencing role-play'],
      ],
      before: ['Ask: what happens inside your mouth when you chew a piece of kenkey or bread slowly?'],
      during: ['Arrange organ cutouts in sequence as each page is read aloud.'],
      after: ['Act out the journey of food in groups of five.', 'Draw the digestive pathway and explain each organ’s job to a partner.'],
      discussion: ['Why does chewing food thoroughly help your stomach?', 'Why is washing hands with soap after using the toilet so important?'],
      reflection: ['Which healthy habit will you practise at mealtime today?'],
      support: ['Provide five picture cards of the digestive organs to place in order.'],
      stretch: ['Find out the scientific name for the food pipe (oesophagus) and how fibre in vegetables helps digestion.'],
      localise: ['Connect the lesson to wholesome local meals such as kenkey, banku, tuo zaafi, rice and beans, or kontomire stew.', 'Discuss digestion and toilet hygiene respectfully so every learner feels comfortable.'],
      factCheck: [
        {
          claim: 'Digestion proceeds sequentially through the mouth (chewing and saliva), oesophagus/food pipe (peristalsis), stomach (churning with gastric juices), small intestine (nutrient absorption into blood), and large intestine (water absorption and waste formation).',
          explanation: 'Accurately summarises human alimentary canal anatomy and physiology at Basic 4 level.',
          reference: 'NaCCA Science Curriculum for Basic 4 (B4.3.1.1.1).',
        },
      ],
    },
  }),

  // 5
  mk({
    key: 'tanko-and-the-suns-family',
    title: 'Tanko and the Sun’s Family',
    summary: 'Tanko plays the Sun in a class role-play of the solar system while Nikoi plays Earth. They learn that the Sun sits at the centre and how the planets and the Moon move in orbits.',
    classIds: ['primary-4'],
    ageMin: 9,
    ageMax: 11,
    readingLevel: 'developing',
    difficulty: 3,
    genres: ['science', 'school-life', 'educational'],
    themes: ['night-sky', 'school', 'friendship'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'teamwork'],
    ghanaianContext: 'central',
    culturalTags: ['local-names'],
    wpm: 100,
    paceWord: 'Slow and wide, like a walk in orbit',
    palette: ['#f59e0b', '#1e3a8a'],
    voice: 'A proud boy’s voice for Tanko; a cheerful girl’s voice for Nikoi',
    characters: [
      'Tanko: a nine-year-old Ghanaian boy with short hair in a yellow shirt and khaki-brown school shorts, wearing a simple wordless yellow paper sun crown during the role-play.',
      'Nikoi: his nine-year-old Ghanaian female classmate with braided hair tied with blue ribbons, wearing a yellow shirt and brown school pinafore, holding a small blue-and-green clay ball.',
      'Their teacher: an enthusiastic Ghanaian female Primary 4 teacher in an indigo-and-gold patterned dress.',
    ],
    music: 'A slow, spacious tune with a soft hum (placeholder)',
    pages: [
      pg(
        '☀️',
        'Out in the schoolyard, the teacher drew a big yellow chalk circle on the ground surrounded by wider rings. “This centre circle is the Sun,” she said. “Tanko, you will play the Sun today. And remember, everyone: never look straight at the real Sun in the sky, because it can harm your eyes.”',
        'In a sunlit Ghanaian schoolyard, Tanko wearing a yellow paper sun crown stands in a central chalk circle while his teacher and classmates gather.',
      ),
      pg(
        '🪐',
        '“There are eight planets in our solar system,” said the teacher. “Each one moves around the Sun along a curved path called an orbit.” Nikoi played Earth and walked slowly around Tanko, while other children walked in bigger circles further out.',
        'Nikoi holds a blue-and-green clay ball as she walks along a chalk ring around Tanko while classmates holding clay planets walk on wider outer rings.',
      ),
      pg(
        '🌍',
        '“Earth is the planet where we live,” said Nikoi. “It has air and liquid water.” Another classmate walked in a small circle right around Nikoi, holding a grey clay ball. “I am the Moon!” she said. The teacher explained, “A satellite is a body that goes around a planet. The Moon is Earth’s natural satellite.”',
        'A smiling girl holding a grey clay Moon walks in a small circle around Nikoi holding the blue-and-green clay Earth while Tanko watches from the centre.',
      ),
      pg(
        '⭐',
        '“The Sun is a star,” said the teacher. “It is a giant ball of hot glowing gas, much bigger than all the planets put together. Its strong pull keeps the planets moving around it. That is why the Sun is at the centre of the solar system.” Tanko stood very tall. “I hold the whole family together!” he grinned, and the class laughed.',
        'Tanko stands tall and smiling in the central chalk circle as his laughing classmates walk along concentric chalk orbits around him.',
      ),
      pg(
        '🌞',
        '“What benefits does the Sun give us on Earth?” asked the teacher. “Light and heat!” answered the class. “Sunlight helps green plants make food and dries our washed clothes,” added Nikoi. “And it warms water on Earth so vapour rises to form rain clouds.”',
        'In the bright schoolyard, Nikoi gestures toward green garden leaves, colourful cloths drying on a line, and white clouds under the warm sky.',
      ),
      pg(
        '🎨',
        'Back in class, the children painted the solar system and moulded clay planets around a yellow clay Sun at the centre. “A planet is not a star,” said Tanko. “Planets shine because they reflect the Sun’s light, not their own.” Nikoi nodded. “Every orbit keeps the solar system moving smoothly.”',
        'At a wooden classroom table, Tanko and Nikoi arrange eight colourful clay planets on painted rings around a large yellow clay Sun.',
      ),
    ],
    activities: [
      { id: 'ss-c1', type: 'comprehension', afterPage: 4, question: 'What sits at the centre of our solar system?', options: ['The Sun', 'The Moon', 'Earth'], correctIndex: 0 },
      { id: 'ss-c2', type: 'comprehension', afterPage: 3, question: 'What is the Moon to planet Earth?', options: ['Earth’s natural satellite', 'A burning star', 'The largest planet'], correctIndex: 0 },
      { id: 'ss-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the solar-system lesson in order.', items: ['Tanko stands in the middle as the Sun.', 'Nikoi walks around Tanko as Earth.', 'A classmate circles Nikoi as the Moon.', 'The class moulds clay planets indoors.'] },
      { id: 'ss-voc', type: 'vocabulary', afterPage: 2, word: 'orbit', definition: 'The curved path a planet takes as it travels around the Sun.', distractors: ['A hot ball of glowing gas', 'A cloud of rain in the sky'] },
    ],
    glossary: [
      { word: 'planets', definition: 'Large round bodies in space that move in orbits around a star such as the Sun.', pages: [2, 4, 6] },
      { word: 'orbit', definition: 'The curved path a planet or moon follows around a larger body in space.', pages: [2, 6] },
      { word: 'satellite', definition: 'A body in space that travels around a planet; the Moon is Earth’s natural satellite.', pages: [3] },
      { word: 'star', definition: 'A huge ball of hot glowing gas in space that produces its own light and heat.', pages: [4, 6] },
    ],
    culturalNotes: [
      'Learners across Ghana observe the Sun’s warmth by day and the Moon and stars by night. The story follows the NaCCA Basic 4 Science standard demonstrating that the Sun is at the centre of the solar system (B4.3.2.1.1).',
      'Uses the curriculum’s outdoor concentric-circle role-play exemplar and states the essential eye-safety rule: never look directly at the Sun.',
    ],
    reviewQuestions: [
      'Check the astronomy statements (Sun as central star, eight planets in orbits, Moon as Earth’s natural satellite, planets shining by reflected sunlight) against NaCCA B4.3.2.1.1.',
      'Confirm the eye-safety warning is clear and prominent.',
    ],
    guide: {
      overview: 'An outdoor chalk-circle role-play demonstrates the Sun at the centre of the solar system, the eight planets moving in orbits, and the Moon orbiting Earth as a natural satellite, followed by clay modelling. Based on NaCCA Basic 4 Science.',
      lessonMinutes: 40,
      goals: [
        'Explain that the Sun is a star at the centre of the solar system.',
        'Define orbit and natural satellite accurately.',
        'Give at least three ways the Sun supports life and daily activities on Earth.',
      ],
      subjects: [
        ['Science (NaCCA B4.3.2.1.1)', 'The solar system and benefits of the Sun'],
        ['Creative Arts', 'Clay modelling and painting'],
      ],
      before: ['Ask: why do we have bright daylight in the morning and darkness at night?'],
      during: ['Step outside to chalk concentric circles and act out the Sun, Earth, Moon, and neighbour planets.'],
      after: ['Mould a clay model of the solar system on cardboard.', 'List ways your family uses sunlight every day (drying crops/laundry, growing food, solar lamps).'],
      discussion: ['How is a star like the Sun different from a planet like Earth?', 'What would happen on Earth without the Sun’s light and heat?'],
      reflection: ['What surprised you most about Earth’s movement in space?'],
      support: ['Focus first on three bodies—Sun, Earth, and Moon—before adding the remaining planets.'],
      stretch: ['Learn the names of all eight planets in order from the Sun outward.'],
      localise: ['Invite learners to share names for the Sun, Moon, and stars in Akan, Ewe, Ga, Dagbani, Dagaare, or Hausa.', 'Remind learners never to look directly at the Sun.'],
      factCheck: [
        {
          claim: 'The Sun is a star whose gravity holds eight planets in orbit around it, while the Moon orbits Earth as its natural satellite and planets shine by reflected sunlight.',
          explanation: 'Standard heliocentric solar-system model aligned with International Astronomical Union definitions and NaCCA Upper Primary Science.',
          reference: 'NaCCA Science Curriculum for Basic 4 (B4.3.2.1.1).',
        },
      ],
    },
  }),

  // 6
  mk({
    key: 'adamu-and-the-lights-left-on',
    title: 'Adamu and the Lights Left On',
    summary: 'Adamu’s family runs low on prepaid electricity units early. Adamu and Gadzekpo spot where power is wasted at home, practise safe ways to conserve electricity, and track weekly meter readings to see the savings.',
    classIds: ['primary-4'],
    ageMin: 9,
    ageMax: 11,
    readingLevel: 'developing',
    difficulty: 3,
    genres: ['science', 'family', 'realistic-fiction'],
    themes: ['family', 'technology', 'citizenship'],
    objectives: ['problem-solving', 'financial-literacy', 'responsibility', 'environmental-awareness'],
    ghanaianContext: 'central',
    culturalTags: ['local-names', 'village-life'],
    wpm: 100,
    paceWord: 'Practical and clear, like a checklist',
    palette: ['#facc15', '#475569'],
    voice: 'A thoughtful boy’s voice for Adamu; a practical girl’s voice for Gadzekpo',
    characters: [
      'Adamu: a thoughtful ten-year-old Ghanaian boy in a neat teal polo shirt and dark blue shorts, holding a plain unlabelled notebook.',
      'Gadzekpo: his ten-year-old Ghanaian female neighbour and friend with braided pigtails and yellow hair beads, wearing a coral top and denim skirt.',
      'Adamu’s mother: a warm Ghanaian woman in a yellow-and-slate patterned kabah and slit.',
    ],
    music: 'A light, ticking tune like a meter (placeholder)',
    pages: [
      pg(
        '📱',
        'One evening, an alert came on Adamu’s mother’s phone: their prepaid electricity units were almost finished. “Already?” Mama sighed. “We bought units only two weeks ago.” Adamu frowned thoughtfully. “Let us find out why.” His friend Gadzekpo agreed to help.',
        'On a warm Ghanaian evening veranda, Adamu’s mother looks surprised at her glowing mobile phone while Adamu and Gadzekpo look on with a plain notebook.',
      ),
      pg(
        '🏠',
        'Next afternoon, they walked around the house checking each room. A bulb shone in an empty bedroom, a fan spun with nobody inside, and the television played to an empty sofa. On a table sat an iron left plugged in! “Do not touch it,” warned Gadzekpo wisely. “Tell Mama right away—it could start a fire.”',
        'Inside a tidy Ghanaian living room, Adamu and Gadzekpo stand safely back and point toward a lit bulb, a spinning fan, an unwatched television, and a plugged-in iron.',
      ),
      pg(
        '📝',
        'After Mama safely unplugged the iron, the children made a plan: switch off lights and fans when leaving a room, open curtains to use daylight, unplug televisions and chargers when not in use, and iron many clothes at once rather than one by one. “And use energy-saving LED bulbs!” added Adamu.',
        'At a sunlit wooden table, Adamu and Gadzekpo draw neat wordless picture icons of a light bulb, fan, sunbeam, and clothes iron in a plain sketchbook.',
      ),
      pg(
        '⚠️',
        '“Safety comes first,” said Adamu’s mother. “Always dry your hands before touching a light switch. Never poke anything into a socket, never touch a loose wire, and let grown-ups handle plugs and irons.” Both children promised carefully.',
        'Adamu’s mother dries her hands on a clean towel beside a wall switch while demonstrating electrical safety to attentive Adamu and Gadzekpo.',
      ),
      pg(
        '📊',
        'Each Sunday, Adamu stood with Mama to read the prepaid meter and record the electricity units used. In week one, the household used 18 units. After practising their new habits, they used only 13 units in week two! “We saved five units in just one week!” cheered Adamu.',
        'Beside a grey household meter box on the veranda wall, Mama points up while Adamu records tally marks in his plain notebook and Gadzekpo smiles.',
      ),
      pg(
        '🌍',
        '“Conserving electricity saves our family money,” said Gadzekpo. “It also helps the environment and shares power fairly across our community.” Mama smiled proudly. “You have taught the whole house.” Together they taped their picture checklist beside the front door.',
        'Mama tapes the children’s wordless picture chart of light-bulb and sunbeam icons beside the front door while Adamu and Gadzekpo beam with pride.',
      ),
    ],
    activities: [
      { id: 'ec-c1', type: 'comprehension', afterPage: 3, question: 'Which habit helps conserve electricity at home?', options: ['Switching off lights and fans in empty rooms', 'Leaving the clothes iron plugged in', 'Running the television with nobody watching'], correctIndex: 0 },
      { id: 'ec-c2', type: 'comprehension', afterPage: 4, question: 'Who should handle wall plugs and hot clothes irons?', options: ['Grown-ups', 'Young children with wet hands', 'Nobody at all'], correctIndex: 0 },
      { id: 'ec-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the family’s electricity-saving investigation in order.', items: ['The prepaid electricity units nearly ran out.', 'Adamu and Gadzekpo spotted wasted power around the house.', 'They made a safe plan to conserve electricity.', 'Weekly meter readings showed fewer units used.'] },
      { id: 'ec-voc', type: 'vocabulary', afterPage: 5, word: 'meter', definition: 'A device that measures how much electricity a building uses.', distractors: ['A glass bulb that shines on the ceiling', 'A cloth used to dry wet hands'] },
    ],
    glossary: [
      { word: 'electricity', definition: 'A form of energy carried through wires that powers lights, fans, and appliances.', pages: [1, 5, 6] },
      { word: 'meter', definition: 'A device installed in a home or school that measures how much electricity is used.', pages: [5] },
      { word: 'units', definition: 'Measured amounts of electricity recorded on a meter and paid for by households.', pages: [1, 5] },
    ],
    culturalNotes: [
      'Prepaid electricity meters and mobile top-up alerts are familiar across Ghanaian towns and villages. The story follows the NaCCA Basic 4 Science standard on conserving electricity (B4.4.2.1.2).',
      'The weekly meter-reading comparison models the curriculum’s household inquiry project (the figures 18 and 13 units are illustrative story examples).',
    ],
    reviewQuestions: [
      'Check the electricity-conservation strategies against NaCCA B4.4.2.1.2.',
      'Check that electrical safety rules (dry hands, no poking sockets, no loose wires, adults handle plugs and irons) are crystal clear.',
    ],
    guide: {
      overview: 'When a household’s prepaid electricity units run low early, two children audit wasted power, practise safe conservation habits, and compare weekly meter readings. Based on NaCCA Basic 4 Science.',
      lessonMinutes: 40,
      goals: [
        'Identify at least four practical ways to conserve electricity at home and school.',
        'State key electrical safety rules for children.',
        'Compare weekly electricity use from simple recorded numbers.',
      ],
      subjects: [
        ['Science (NaCCA B4.4.2.1.2)', 'Conserving electricity safely'],
        ['Mathematics', 'Subtracting and comparing weekly quantities'],
      ],
      maths: [
        { task: 'Adamu’s family used 18 units in week one and 13 units in week two. How many units did they save in week two?', answer: '5 units (18 − 13 = 5 units).' },
        { task: 'If the family saves 5 units every week for 4 weeks, how many electricity units do they save altogether?', answer: '20 units (5 × 4 = 20 units).' },
      ],
      before: ['Ask: which electrical appliances in a home use the most power when left on unnecessarily?'],
      during: ['Pause on page 5 and ask learners to calculate how many units the family saved.'],
      after: ['Conduct a supervised classroom walk to spot lights or fans left on in empty rooms.', 'Design a visual door reminder for switching off lights.'],
      discussion: ['Why is ironing clothes in one batch more efficient than heating the iron many separate times?', 'Why must you never touch a switch with wet hands?'],
      reflection: ['What is one habit you will start at home today to help save electricity?'],
      support: ['Sort appliance picture cards into “In Use” versus “Wasting Power”.'],
      stretch: ['Compare incandescent bulbs and LED bulbs to explain why LEDs use fewer units for the same brightness.'],
      localise: ['Adapt examples to your community’s power supply (prepaid ECG/NEDCo meters, postpaid bills, or solar home systems).', 'Children must never touch sockets, plugs, hot irons, or loose wires; meter reading is done purely visually with an adult.'],
      factCheck: [
        {
          claim: 'Switching off unused lights and fans, using daylight, batching high-heat tasks like ironing, unplugging idle electronics, and using LED bulbs reduce household electricity consumption.',
          explanation: 'Heating elements (irons) and continuous motors/lighting draw steady electrical power (wattage over time = kilowatt-hours/units); reducing runtime and wattage directly lowers kWh consumed.',
          reference: 'NaCCA Science Curriculum for Basic 4 (B4.4.2.1.2) & Energy Commission of Ghana Energy Efficiency Guidelines.',
        },
      ],
    },
  }),

  // 7
  mk({
    key: 'ashitey-and-the-red-spots',
    title: 'Ashitey and the Red Spots',
    summary: 'Ashitey’s young cousin Quaicoe falls ill with measles. A clinic nurse explains what causes measles, how to recognise its signs early, and how routine vaccination and clean habits protect children.',
    classIds: ['primary-4'],
    ageMin: 9,
    ageMax: 11,
    readingLevel: 'developing',
    difficulty: 3,
    genres: ['science', 'family', 'educational'],
    themes: ['health-and-wellbeing', 'family', 'community'],
    objectives: ['scientific-curiosity', 'responsibility', 'summarising', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 100,
    paceWord: 'Calm and caring, never frightening',
    palette: ['#dc2626', '#0d9488'],
    voice: 'A caring boy’s voice for Ashitey; a calm, reassuring woman’s voice for the clinic nurse',
    characters: [
      'Ashitey: a caring ten-year-old Ghanaian boy with short neat hair, wearing a light-blue polo shirt at home and a yellow-and-brown Primary 4 uniform at school.',
      'Quaicoe: his three-year-old cousin, a small Ghanaian toddler in a soft green cotton t-shirt.',
      'Quaicoe’s mother: a gentle Ghanaian aunt in a warm terracotta-and-gold patterned wrap skirt and top.',
      'The clinic nurse: a kind Ghanaian community health nurse with neat braided hair, wearing a clean teal scrub uniform.',
    ],
    music: 'A gentle, caring tune (placeholder)',
    pages: [
      pg(
        '🤒',
        'Ashitey’s three-year-old cousin, Quaicoe, came to visit with his mother. Little Quaicoe felt hot and tired. His eyes were red and watery, his nose was running, and he coughed often. “He does not want to play today,” said Ashitey gently. “Mama, I think Quaicoe is sick.”',
        'Inside a calm Ghanaian family room, little three-year-old Quaicoe rests tiredly on his mother’s lap beside a colourful ball while ten-year-old Ashitey looks on kindly.',
      ),
      pg(
        '🔴',
        'Two days later, a red rash of tiny spots appeared on Quaicoe’s face and spread down his body. “We must take him straight to the clinic,” said his mother. Ashitey stayed safely at home with his own mother, keeping space from Quaicoe so the illness would not spread.',
        'Quaicoe’s mother gently carries little Quaicoe, who has tiny red spots on his cheeks, toward the courtyard gate while Ashitey waves kindly from the veranda.',
      ),
      pg(
        '🏥',
        'At the clinic, the nurse examined Quaicoe gently. “This illness is measles,” she explained. “It is caused by a tiny germ called a virus. Measles spreads through the air when a sick person coughs or sneezes, so it is very easy to catch—and it is never caused by anything a child did wrong.”',
        'In a clean, bright Ghanaian clinic room, a kind female nurse in a teal uniform gently examines little Quaicoe sitting on his mother’s lap.',
      ),
      pg(
        '📋',
        '“Whenever someone near you has a high fever and a rash, tell a grown-up straight away so they can visit the clinic,” said the nurse. “A child with measles needs rest, plenty of clean fluids, and care at home away from others until the health worker says it is safe. Adults should also check everyone’s child health card.”',
        'The kind nurse speaks reassuringly with Quaicoe’s mother across a tidy clinic desk beside a cup of water and a plain yellow child health booklet.',
      ),
      pg(
        '💉',
        '“The best protection is the measles vaccine given at the clinic,” she added warmly. “It is free in Ghana’s child health programme and teaches the body to fight off the measles virus. Covering coughs with your elbow and washing hands with soap also help keep everyone well.”',
        'The smiling nurse holds up a plain yellow child health booklet and a tiny vaccine vial beside a wordless wall picture of a healthy smiling toddler.',
      ),
      pg(
        '🗺️',
        'Once Quaicoe recovered, Ashitey and his Primary 4 class drew a picture map about measles: its viral cause, its signs of fever, cough, runny nose, red eyes, and rash, and its prevention by vaccine and clean habits. That evening, Ashitey smiled as his mother showed him the vaccine ticks in his own health card.',
        'In class, Ashitey and classmates point to a wordless poster diagram connecting picture icons of a germ, thermometer, red spots, soap, and a protective shield.',
      ),
    ],
    activities: [
      { id: 'mz-c1', type: 'comprehension', afterPage: 3, question: 'What causes measles?', options: ['A tiny germ called a virus', 'Eating sweet fruit', 'Running in the afternoon sun'], correctIndex: 0 },
      { id: 'mz-c2', type: 'comprehension', afterPage: 5, question: 'What is the strongest way to protect a child from measles?', options: ['Getting the measles vaccine at the clinic', 'Staying awake late at night', 'Sharing cups with everyone'], correctIndex: 0 },
      { id: 'mz-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the events of the story in order.', items: ['Quaicoe had a fever, cough, and red watery eyes.', 'A red rash of spots appeared, and his mother took him to the clinic.', 'The nurse explained that a virus causes measles and vaccines prevent it.', 'Ashitey’s class drew a picture map about measles.'] },
      { id: 'mz-voc', type: 'vocabulary', afterPage: 5, word: 'vaccine', definition: 'A medicine given at a clinic that teaches the body to protect itself against a disease.', distractors: ['A cloth bandage wrapped around a cut', 'A sweet drink made from oranges'] },
    ],
    glossary: [
      { word: 'rash', definition: 'Many small red spots or patches appearing on the skin.', pages: [2, 4, 6] },
      { word: 'measles', definition: 'A contagious viral illness causing fever, cough, runny nose, red eyes, and a skin rash.', pages: [3, 4, 5, 6] },
      { word: 'virus', definition: 'An extremely tiny germ that can cause illnesses such as measles or colds.', pages: [3, 5] },
      { word: 'vaccine', definition: 'A protective medicine that prepares the body to fight off a specific disease.', pages: [5, 6] },
    ],
    culturalNotes: [
      'Follows the NaCCA Basic 4 Science standard on the causes, symptoms, and prevention of measles (B4.5.2.1.1) and Ghana Health Service Expanded Programme on Immunisation (EPI) guidance (measles-rubella vaccination recorded in the Child Health Record booklet).',
      'Reassures learners without fear or stigma: measles is caused by an airborne virus, requires prompt clinic care rather than unverified home remedies, and is preventable through routine vaccination.',
    ],
    reviewQuestions: [
      'Confirm symptoms (fever, cough, runny nose, red watery eyes, rash spreading from the face downward) and prevention guidance against Ghana Health Service / EPI materials.',
      'Check that the tone remains calm, non-stigmatising, and supportive.',
    ],
    guide: {
      overview: 'Through a caring family story, learners discover that measles is caused by an airborne virus, learn its early signs, and understand how clinic care, temporary isolation while contagious, and routine measles vaccination protect communities. Based on NaCCA Basic 4 Science.',
      lessonMinutes: 40,
      goals: [
        'State that measles is caused by a virus spread through coughs and sneezes.',
        'Identify four key signs of measles (fever, cough/runny nose, red watery eyes, and rash).',
        'Explain how vaccination, prompt clinic visits, and respiratory hygiene prevent measles.',
      ],
      subjects: [
        ['Science (NaCCA B4.5.2.1.1)', 'Causes, symptoms, and prevention of measles'],
        ['Our World Our People', 'Community health and immunisation'],
      ],
      before: ['Ask: why do babies and young children visit child-welfare clinics (“weighing”) even when they look healthy?'],
      during: ['Pause on page 3 to reinforce how respiratory droplets travel and why blame has no place in illness.'],
      after: ['Draw a three-branch visual map showing Measles: Cause, Signs, and Prevention.', 'Invite the school SHEP coordinator or a community health nurse to speak with the class.'],
      discussion: ['Why should a child with measles rest at home away from school until the nurse says they have recovered?', 'How does vaccination protect younger babies in the neighbourhood too?'],
      reflection: ['What should you do right away if a younger sibling or friend develops a high fever and a rash?'],
      support: ['Match simple icon cards into two groups: “Signs of Measles” and “Ways to Prevent Measles”.'],
      stretch: ['Learn how Ghana’s Child Health Record booklet tracks two doses of the measles-rubella vaccine in early childhood.'],
      localise: ['Refer to your local CHPS compound, health centre, or polyclinic.', 'Handle illness discussions sensitively, never singling out any learner’s personal medical history.'],
      factCheck: [
        {
          claim: 'Measles is a highly contagious airborne viral disease characterised by high fever, cough, coryza (runny nose), conjunctivitis (red watery eyes), and a maculopapular rash starting on the face, and is effectively prevented by routine measles vaccination.',
          explanation: 'Matches WHO and Ghana Health Service clinical case definitions and Expanded Programme on Immunisation (EPI) schedules.',
          reference: 'NaCCA Science Curriculum for Basic 4 (B4.5.2.1.1), Ghana Health Service EPI, & WHO Measles Fact Sheet.',
        },
      ],
    },
  }),

  // 8
  mk({
    key: 'mohammed-and-the-pond-that-went-quiet',
    title: 'Mohammed and the Pond That Went Quiet',
    summary: 'Mohammed and Baah clear the water plants from the school pond to make it look neat, and the pond soon falls silent. With their teacher’s help, they restore the plants and learn how living and non-living things in an ecosystem depend on one another.',
    classIds: ['primary-4'],
    ageMin: 9,
    ageMax: 11,
    readingLevel: 'developing',
    difficulty: 3,
    genres: ['science', 'school-life', 'moral'],
    themes: ['animals-and-habitats', 'school', 'citizenship'],
    objectives: ['environmental-awareness', 'reasoning', 'responsibility', 'problem-solving'],
    ghanaianContext: 'central',
    culturalTags: ['village-life', 'local-names'],
    wpm: 100,
    paceWord: 'Lively at first, then hushed, then bright',
    palette: ['#0891b2', '#16a34a'],
    voice: 'An eager boy’s voice for Mohammed; a thoughtful boy’s voice for Baah',
    characters: [
      'Mohammed: an energetic ten-year-old Ghanaian boy with short hair in a yellow shirt and khaki-brown school shorts.',
      'Baah: his thoughtful ten-year-old Ghanaian male friend with short hair, slightly rounder cheeks, in a matching yellow shirt and khaki-brown school shorts.',
      'Their teacher: a wise Ghanaian female Primary 4 teacher in a turquoise-and-leaf-green patterned dress, wearing rubber boots when working by the pond margin.',
    ],
    music: 'A pond tune of frogs and crickets that fades, then returns (placeholder)',
    pages: [
      pg(
        '🐸',
        'Behind the school garden lay a small shallow pond ringed with stones. Frogs croaked, tiny fish flashed in the water, and insects buzzed over green reeds and lily pads. “This pond is an ecosystem,” said the teacher. “It is a community of living things and the non-living things around them—such as water, air, sunlight, and soil. They all depend on one another.”',
        'Mohammed, Baah, and their teacher stand safely behind a stone border watching green frogs, tiny fish, reeds, and dragonflies in a lively school pond.',
      ),
      pg(
        '🧹',
        'One Saturday after compound cleanup, Mohammed and Baah walked past the pond. “Those water weeds look messy,” said Mohammed. Standing on the dry bank with long wooden rakes, they pulled out the water plants to make the pond look tidy, not knowing the plants gave shade, food, and hiding places.',
        'Standing back on the dry grass bank, Mohammed and Baah use long wooden rakes to pull green reeds and floating plants from the pond edge.',
      ),
      pg(
        '🔇',
        'Two weeks later, the pond had fallen quiet. Without shade, the water turned warm and murky. Fewer frogs called, the dragonflies disappeared, and the little fish had nowhere to shelter. “Where is all the croaking?” asked Baah worriedly. “Something is wrong. Let us tell Madam.”',
        'Mohammed and Baah stand anxiously behind the stone border looking at a bare, silent pond with murky green water and empty banks.',
      ),
      pg(
        '⚖️',
        'Their teacher listened kindly at the pondside. “Every member of an ecosystem has an important job,” she explained. “Plants give food, oxygen, cool shade, and shelter, while frogs and fish eat insects. Removing one member upsets the natural balance, so others suffer.” Mohammed looked down. “We caused this by mistake.”',
        'Beside the bare pond, the teacher explains gently to remorseful Mohammed and thoughtful Baah, holding out her two hands like a steady balance.',
      ),
      pg(
        '🌿',
        '“How can we help fix it?” asked Baah. “We can replant native water plants together,” said the teacher. Wearing rubber boots while the class stayed safely back on firm ground, she guided them in replanting reeds and water lilies. Everyone promised to ask a teacher before changing any habitat again.',
        'Supervised by their teacher in rubber boots at the shallow margin, Mohammed, Baah, and classmates pass green water plants from firm dry ground.',
      ),
      pg(
        '🎶',
        'After several weeks, the pond came alive once more. Frogs croaked in the cool green shade, fish darted safely among the stems, and dragonflies hummed above the leaves. “Every part matters,” said Mohammed happily. “Even the plants that look wild!” Together the class painted a nature mural celebrating their school habitat.',
        'Beside the thriving pond full of frogs, reeds, and dragonflies, Mohammed, Baah, and classmates smile next to a wordless wall mural of hands cradling a leaf and frog.',
      ),
    ],
    activities: [
      { id: 'eq-c1', type: 'comprehension', afterPage: 4, question: 'Why did the school pond fall quiet after the water plants were removed?', options: ['Pond animals lost their cool shade, food, and hiding places', 'All the water froze into solid ice', 'The frogs went on holiday to town'], correctIndex: 0 },
      { id: 'eq-c2', type: 'comprehension', afterPage: 1, question: 'What makes up an ecosystem?', options: ['Living things and the non-living things around them', 'Only large wild animals', 'Only rocks and dry sand'], correctIndex: 0 },
      { id: 'eq-s1', type: 'sequencing', afterPage: 6, prompt: 'Put the pond ecosystem story in order.', items: ['Mohammed and Baah raked out the pond plants.', 'The pond grew warm, bare, and quiet.', 'With their teacher, the class replanted native water plants.', 'Frogs, fish, and insects returned as balance was restored.'] },
      { id: 'eq-voc', type: 'vocabulary', afterPage: 4, word: 'balance', definition: 'A healthy, steady state in nature where living and non-living parts support one another.', distractors: ['A long wooden rake for clearing leaves', 'A stone wall around a garden'] },
    ],
    glossary: [
      { word: 'ecosystem', definition: 'A community of living things interacting with non-living things such as water, air, sunlight, and soil.', pages: [1, 4] },
      { word: 'depend', definition: 'To rely on or need something else in order to survive and thrive.', pages: [1] },
      { word: 'balance', definition: 'A healthy, steady state in which each part of an ecosystem supports the others.', pages: [4] },
    ],
    culturalNotes: [
      'Ponds, streams, wetlands, and sacred groves across Ghana sustain rich biodiversity. The story follows the NaCCA Basic 4 Science standard on ecosystems and interdependence (B4.3.3.1.1).',
      'Highlights both ecological stewardship (wild-looking native plants provide vital habitat) and water safety (children never step into ponds or streams and only work on dry ground under adult supervision).',
    ],
    reviewQuestions: [
      'Check that ecological interdependence (shade, shelter, food, oxygen, and non-living factors) aligns with NaCCA B4.3.3.1.1.',
      'Confirm water-margin safety is clearly modelled in both text and illustrations.',
    ],
    guide: {
      overview: 'When two well-meaning pupils clear native plants from a school pond to make it look neat, they witness how habitat loss disrupts an ecosystem—and work with their teacher to restore its balance. Based on NaCCA Basic 4 Science.',
      lessonMinutes: 40,
      goals: [
        'Define an ecosystem as living things interacting with non-living surroundings.',
        'Identify living components (plants, frogs, fish, insects) and non-living components (water, sunlight, air, soil).',
        'Predict what happens when one component of an ecosystem is removed.',
      ],
      subjects: [
        ['Science (NaCCA B4.3.3.1.1)', 'Ecosystems and interdependence'],
        ['Our World Our People', 'Protecting local habitats and biodiversity'],
      ],
      before: ['Ask: what living and non-living things can we spot in a school garden or under a shady tree?'],
      during: ['Pause on page 3 and let learners predict why the frogs and dragonflies disappeared.'],
      after: ['Play a “web of life” yarn game where each learner represents sun, water, soil, reed, insect, frog, or fish—then gently drop one strand to feel how others are affected.', 'Draw a local habitat and group its parts into Living and Non-Living.'],
      discussion: ['Why can a natural habitat that looks “messy” to humans actually be healthy for wildlife?', 'Why should we always consult teachers or elders before altering a natural area?'],
      reflection: ['Name one small habitat around your school or home that you can help protect.'],
      support: ['Sort picture cards of a pond into two columns: Living Things and Non-Living Things.'],
      stretch: ['Draw a four-step food chain for the pond starting with sunlight and green water plants.'],
      localise: ['Adapt the habitat example to a local garden, cocoa farm, grassland, lagoon, or forest edge.', 'Strict water safety: learners must never approach ponds, streams, or drains without adult supervision.'],
      factCheck: [
        {
          claim: 'Aquatic plants regulate water temperature through shading, oxygenate water via photosynthesis, and provide food and shelter for invertebrates, fish, and amphibians within a pond ecosystem.',
          explanation: 'Removing macrophytes increases solar heating, reduces dissolved oxygen refuge and cover, and disrupts pond trophic webs.',
          reference: 'NaCCA Science Curriculum for Basic 4 (B4.3.3.1.1).',
        },
      ],
    },
  }),
];
