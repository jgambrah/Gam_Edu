import type { Classification } from '../classification';
import { CLASSIFICATION_VERSION } from '../classification';
import type { PilotStory } from './pilot-stories';

type Page = PilotStory['pages'][number];
type Acts = PilotStory['activities'];

const pg = (
  motif: string,
  text: string,
  alt: string,
  narration = 'Clear, steady science-narrator voice suited for JHS learners; pause briefly after each new term and each large number.'
): Page => ({
  motif,
  text,
  alt,
  brief: `Clear, accurate hand-painted gouache science illustration, landscape 4:3, with no people unless the description names them. ${alt} Keep a calm, uncluttered area for text.`,
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

const tokensOf = (text: string) =>
  text.split(/\s+/).map((w) => w.toLowerCase().replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''));

/** 1-based page numbers whose text contains the headword as a whole word. */
const glossaryPages = (word: string, pages: Page[]): number[] => {
  const w = word.toLowerCase();
  const found = pages.flatMap((p, i) => (tokensOf(p.text).includes(w) ? [i + 1] : []));
  if (!found.length) throw new Error(`Glossary word "${word}" does not appear on any page`);
  return found;
};

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
        'Read as a single narrator: this is a science article, not a story with characters.',
        'Pause for two seconds at each comprehension check so learners can reason first.',
        'Say numbers and units in full ("one hundred and fifty million kilometres", "astronomical units") and pronounce names clearly.',
      ],
    },
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: [
      'Is the language right for the stated JHS age band (Basic 7 to Basic 9) and BECE conceptual level?',
      'Are all facts, figures, and dates accurate and up to date at the time of publication?',
      ...s.reviewQuestions,
    ],
    pages: s.pages,
    activities: s.activities,
    glossary: s.glossary.map((gItem) => ({ ...gItem, pages: glossaryPages(gItem.word, s.pages) })),
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
 * Batch 41 (7 stand-alone science articles): "Physics in Our World" series, set 2, for JHS (Basic 7 to Basic 9).
 * Each article is tied to a BECE Integrated Science topic (see the first cultural note and the teacher guide).
 * These are science articles, not stories: there are no characters, so `characters` is empty and one narrator reads throughout.
 * Original text written for Ghanaian learners; facts updated to November 2026 (see each factCheck note).
 */

export const BATCH_41_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'the-giant-magnet-under-your-feet',
    title: 'The Giant Magnet Under Your Feet',
    summary:
      'A home-made compass points the same way anywhere in Ghana. This article explains Earth’s magnetic field, how the continents drifted apart, and how magnetised rock on the sea floor proved it.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Steady, clear, and curious',
    palette: ['#b45309', '#1d4ed8'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Slow, deep drum pulse with soft xylophone (placeholder)',
    pages: [
      pg(
        '🧭',
        'Rub a sewing needle along a magnet about thirty times, always in the same direction. Rest the needle on a small piece of leaf floating in a bowl of water. The leaf turns slowly, then stops. Push it round and it swings back to the same line: one end pointing north, the other south. You have made a compass. Whether you try this in Axim, Accra, or Bolgatanga, the needle lines up the same way. Something is pulling on it that no one can see. That something is Earth’s magnetic field, and it comes from deep beneath your feet.',
        'A sewing needle resting on a small green leaf floating in a bowl of water, with an arrow showing north.'
      ),
      pg(
        '🌍',
        'Earth behaves like a giant magnet. About 2,900 kilometres below the surface lies the outer core, a layer of liquid iron and nickel hotter than 4,000 °C. As the planet spins, this liquid metal flows, and the moving metal produces a magnetic field that reaches far out into space. A magnetic field is the region around a magnet where its force can be felt. Earth’s field does more than guide a compass. It turns aside most of the harmful particles that stream from the Sun. Sea turtles, like those that nest on the beaches near Ada, can sense the field and use it to find their way.',
        'A cut-away view of Earth showing the crust, the mantle, the liquid outer core, and the inner core, with curved field lines around the planet.'
      ),
      pg(
        '🧩',
        'Now look at a map of the Atlantic Ocean. The coast of West Africa, from Ghana round to Nigeria and Cameroon, looks as if it would fit neatly against the bulge of Brazil, like two pieces of a jigsaw puzzle. In 1912, a German scientist named Alfred Wegener said this was no accident. He pointed out that matching rocks, and fossils of the same ancient animals, are found on both sides of the ocean. He proposed that the continents were once joined in one huge landmass, later named Pangaea, and had slowly drifted apart. Most scientists laughed. How could a continent move?',
        'A map of the Atlantic with Africa and South America drawn close together so that the coast of West Africa fits against Brazil.'
      ),
      pg(
        '🌋',
        'The answer came from the sea floor in the 1950s and 1960s. Earth’s outer shell is broken into huge slabs called tectonic plates, which move a few centimetres each year, about as fast as your fingernails grow. Down the middle of the Atlantic runs a long chain of undersea mountains. There, two plates pull apart and hot liquid rock, called magma, rises to fill the gap. It cools into new sea floor. So the ocean grows wider, and Africa and South America, which began to separate about 130 million years ago, move a little further apart every year.',
        'A cross-section of the sea floor showing two plates moving apart at an undersea ridge, with magma rising between them.'
      ),
      pg(
        '🧲',
        'Here the two stories meet. Magma contains tiny grains of iron-rich minerals. While the rock is liquid, the grains turn to line up with Earth’s magnetic field, like millions of compass needles. When the rock hardens, they are locked in place. Ships towing instruments across the Atlantic found something strange: stripes of rock magnetised towards the north, next to stripes magnetised towards the south. The pattern was the same on both sides of the ridge. It showed that new sea floor keeps spreading outwards, and that Earth’s field has swapped direction many times. Each swap is called a magnetic reversal.',
        'Bands of sea-floor rock in two alternating colours, arranged as a mirror image on each side of an undersea ridge.'
      ),
      pg(
        '⏳',
        'The last full reversal happened about 780,000 years ago. Since the 1800s, the field has weakened by roughly a tenth, and some reports claim that a flip is about to happen. Most scientists disagree. The field has grown weaker and stronger many times without reversing, a reversal takes thousands of years, and no past reversal has been linked to a disaster for living things. Moving plates matter more to daily life. Ghana lies far from a plate edge, yet old cracks in the rock near Accra still slip. In 1939, an earthquake there killed 17 people. The ground beneath us is never completely still.',
        'A timeline arrow running from the distant past to today, ending at a view of the Accra coastline.'
      ),
    ],
    activities: [
      {
        id: 'gm-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What produces Earth’s magnetic field?',
        options: [
          'A giant bar of solid iron buried at the North Pole',
          'Liquid iron and nickel flowing in the outer core',
          'Magnetic rocks lying on the sea floor',
        ],
        correctIndex: 1,
      },
      {
        id: 'gm-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Which evidence did Wegener use to argue that the continents were once joined?',
        options: [
          'Matching rocks and fossils on both sides of the Atlantic',
          'Photographs taken from space',
          'Stripes of magnetised rock on the sea floor',
        ],
        correctIndex: 0,
      },
      {
        id: 'gm-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What do the magnetic stripes on the floor of the Atlantic show?',
        options: [
          'That the ocean is shrinking',
          'That a compass does not work at sea',
          'New sea floor spreads from the ridge and Earth’s field has reversed many times',
        ],
        correctIndex: 2,
      },
      {
        id: 'gm-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A website claims that Earth’s magnetic field will flip next year and wipe out life. Using the article, what is the best reply?',
        options: [
          'It is true, because the field has weakened',
          'Reversals take thousands of years and are not linked to disasters for life',
          'It cannot be true, because the field has never reversed',
        ],
        correctIndex: 1,
      },
      {
        id: 'gm-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'Africa and South America begin to separate',
          'The last full magnetic reversal takes place',
          'Wegener proposes that the continents drift',
          'An earthquake strikes Accra',
          'Ships map magnetic stripes on the Atlantic floor',
        ],
      },
      {
        id: 'gm-voc',
        type: 'vocabulary',
        afterPage: 4,
        word: 'tectonic plate',
        definition: 'A huge slab of Earth’s outer shell that moves very slowly.',
        distractors: [
          'A flat stone used for grinding pepper',
          'A layer of liquid metal in Earth’s core',
        ],
      },
    ],
    glossary: [
      {
        word: 'magnetic',
        definition: 'Magnetic field: the region around a magnet where its force can be felt.',
        pages: [1, 2, 5],
      },
      {
        word: 'compass',
        definition: 'An instrument with a magnetised needle that lines up north to south.',
        pages: [1, 2, 5],
      },
      {
        word: 'core',
        definition: 'Outer core: the layer of liquid iron and nickel deep inside Earth.',
        pages: [2],
      },
      {
        word: 'tectonic',
        definition: 'Tectonic plate: a huge slab of Earth’s outer shell that moves very slowly.',
        pages: [4],
      },
      {
        word: 'magma',
        definition: 'Hot liquid rock from inside Earth.',
        pages: [4, 5],
      },
      {
        word: 'reversal',
        definition: 'Magnetic reversal: a change in which Earth’s magnetic north and south swap places.',
        pages: [5, 6],
      },
    ],
    culturalNotes: [
      'BECE link: magnetism (magnetic fields and the compass); the structure of the Earth.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: the 1939 Accra earthquake (22 June 1939) is the most damaging in Ghana’s recorded history. Sea turtles nest on beaches around Ada in the Greater Accra Region.',
    ],
    reviewQuestions: [
      'Confirm the depth and temperature of the outer core and the 130-million-year figure with a science reviewer.',
      'Check the needle-compass activity works with the magnets available in school.',
    ],
    guide: {
      overview:
        'Links magnetism to the structure of the Earth: a needle compass, the liquid outer core, drifting continents, and the magnetic stripes that proved the sea floor spreads.',
      lessonMinutes: 45,
      goals: [
        'Describe Earth’s magnetic field and say what produces it.',
        'Explain how a compass works.',
        'Describe the evidence that the continents have moved.',
        'Judge a claim about magnetic reversal using evidence.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: magnetism; the Earth and its structure; codes to verify)', 'Magnetic fields, the compass, and moving plates'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Multiplying and dividing large numbers; changing units'],
      ],
      before: ['Make the floating-needle compass in groups. Ask: why do all the needles in the room point the same way?'],
      during: ['After Page 3, let learners cut Africa and South America from a printed map and try to fit them together.'],
      after: ['Learners draw the sea-floor stripes and label the ridge, the magma, and the direction each plate moves.'],
      discussion: ['Wegener was right, but nobody believed him for fifty years. What does that teach us about evidence in science?'],
      reflection: ['What would you check before sharing a frightening science story you saw online?'],
      maths: [
        {
          task: 'A plate moves 3 cm each year. How far does it move in 1,000,000 years? Give your answer in kilometres.',
          answer: '3,000,000 cm = 30,000 m = 30 km.',
        },
        {
          task: 'The Atlantic is about 5,000 km wide. If it has widened by about 4 cm each year, roughly how long did it take to open?',
          answer: '5,000 km = 500,000,000 cm; 500,000,000 ÷ 4 = 125,000,000 years, close to the 130 million years in the article.',
        },
      ],
      support: ['Give learners a labelled diagram of the layers of the Earth to keep beside them while reading.'],
      stretch: ['Find out where the magnetic north pole is today and how far it has moved in the last hundred years.'],
      localise: ['Ask older relatives or search for accounts of earth tremors felt in Accra, Weija, or Ho.'],
      factCheck: [
        {
          claim: 'Last reversal (~780,000 years ago), outer core depth (~2,900 km), Atlantic opening (~130 million years ago), and 1939 Accra earthquake.',
          explanation: 'Last reversal, weakening of the field, and the view that a reversal is not close checked in November 2026. Core depth and temperature, date of the Atlantic opening, and the 1939 earthquake toll should be confirmed by a science reviewer.',
          reference: 'USGS / British Geological Survey / NaCCA Integrated Science curriculum (codes to verify)',
        },
      ],
    },
  }),

  // 2
  mk({
    key: 'keeping-warm-keeping-cool',
    title: 'Keeping Warm, Keeping Cool',
    summary:
      'An ice chest keeps waakye hot, a reindeer breathes air at minus 40 °C, and an elephant cools itself with its ears. This article uses them to explain conduction, convection, radiation, and insulation.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Warm, clear, and lively',
    palette: ['#dc2626', '#0ea5e9'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Gentle highlife guitar with light percussion (placeholder)',
    pages: [
      pg(
        '🍲',
        'At a roadside stall, a waakye seller lifts the lid of a big ice chest. Steam rises. The rice inside was cooked before sunrise, yet it is still hot at noon. An ice chest is made to keep things cold, so how does it keep food hot? The answer is that the chest does not make heat or cold. It only slows down the movement of thermal energy. Thermal energy always flows from a hotter place to a colder place, and it travels in three ways: conduction, convection, and radiation. Control those three, and you control temperature.',
        'A food seller at a roadside stall lifting the lid of a large ice chest, with steam rising from the rice inside.'
      ),
      pg(
        '🥄',
        'Conduction is the transfer of thermal energy through a material, from particle to particle. Leave a metal spoon in hot soup and the handle soon burns your fingers. Metals are good conductors. Wood, plastic, cloth, and air are poor conductors, so we call them insulators. That is why a cooking pot has plastic handles, and why the walls of an ice chest are filled with foam full of trapped air. Convection happens in liquids and gases. Heated water or air expands, becomes lighter, and rises, while cooler water or air sinks to take its place. This circling movement is called a convection current.',
        'A pot of soup on a coal pot with a metal spoon standing in it, and curved arrows showing hot liquid rising and cooler liquid sinking.'
      ),
      pg(
        '☀️',
        'Radiation is different, because it needs no material at all. Thermal energy from the Sun crosses empty space as infrared rays and warms your skin. Stand beside a coal pot and you feel the same thing. Dark, dull surfaces take in and give out radiation well. Shiny, light surfaces reflect it. Compare two houses at midday. A bare metal roof conducts the Sun’s heat straight into the room below. A thick thatch roof is full of trapped air, so the room stays cooler. A clay water pot cools in another way: water seeps through the clay and evaporates, carrying thermal energy away.',
        'Two houses side by side under a bright sun, one with a bare metal roof and one with a thick thatch roof, and a clay water pot in the shade.'
      ),
      pg(
        '🦌',
        'Now travel to the far north of Europe, where reindeer live through winters of minus 40 °C. Breathing such air should chill the animal’s lungs, and every warm breath out should waste heat. The reindeer’s nose prevents both. Inside it are thin, curled bones covered with skin that is rich in blood. Cold air flowing in over this large warm surface is heated before it reaches the lungs. On the way out, the warm breath passes over the same surface, which is now cool, and gives back much of its heat and water. A thick coat of hollow hairs traps air around the body.',
        'A reindeer standing in deep snow, with a small diagram of the curled passages inside its nose.'
      ),
      pg(
        '🐘',
        'In northern Ghana, animals have the opposite problem. An elephant in Mole National Park has a huge body that makes a lot of heat, and the air around it is hot. Its ears are the answer. They are large and thin and packed with blood vessels. Warm blood flowing through them loses thermal energy to the air, and flapping the ears moves fresh air across them. Elephants also bathe and spray themselves with mud. People cool down by sweating: as sweat evaporates, it takes thermal energy from the skin. That is why a breeze feels so good on a hot afternoon.',
        'An elephant at a waterhole in Mole National Park with its large ears spread wide.'
      ),
      pg(
        '🏠',
        'People copy these ideas. A food flask has a double wall with almost no air between the layers, which stops conduction and convection, and a shiny lining that reflects radiation. A fridge has insulation in its walls and door. Builders can keep rooms cool with a ceiling under the roof, light-coloured paint, shade trees, and windows placed so that air flows through. Every one of these saves electricity that would be spent on fans and air conditioners. So the reindeer, the elephant, and the waakye seller all teach one lesson: to manage temperature, manage the transfer of thermal energy.',
        'A cut-away drawing of a food flask showing its double wall and shiny lining, beside a house shaded by trees.'
      ),
    ],
    activities: [
      {
        id: 'kw-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'In which direction does thermal energy flow?',
        options: [
          'From a colder place to a hotter place',
          'Only upwards',
          'From a hotter place to a colder place',
        ],
        correctIndex: 2,
      },
      {
        id: 'kw-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why are the walls of an ice chest filled with foam?',
        options: [
          'Foam contains trapped air, which is a poor conductor',
          'Foam produces cold',
          'Foam is heavier than metal',
        ],
        correctIndex: 0,
      },
      {
        id: 'kw-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'How does a reindeer’s nose save heat?',
        options: [
          'It closes completely in cold weather',
          'Warm breath going out gives heat back to the cool surface inside the nose',
          'It heats the air by burning fat',
        ],
        correctIndex: 1,
      },
      {
        id: 'kw-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A family wants its room under a metal roof to be cooler without using electricity. Which change uses the science in this article?',
        options: [
          'Paint the roof black',
          'Fit a ceiling under the roof and paint the roof a light colour',
          'Keep every window closed at midday',
        ],
        correctIndex: 1,
      },
      {
        id: 'kw-s1',
        type: 'sequencing',
        prompt: 'Follow one breath through a reindeer’s nose. Put the steps in order.',
        items: [
          'Very cold air enters the nose',
          'The air is warmed as it passes over warm, blood-rich skin',
          'Warm air reaches the lungs',
          'Warm breath flows back out over the cooled surface',
          'Heat and water are given back to the nose before the breath leaves',
        ],
      },
      {
        id: 'kw-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'insulator',
        definition: 'A material that does not let thermal energy pass through it easily.',
        distractors: [
          'A material that produces heat when it is switched on',
          'A metal that carries heat quickly',
        ],
      },
    ],
    glossary: [
      {
        word: 'thermal',
        definition: 'Thermal energy: the energy a substance has because of the movement of its particles; we feel its transfer as heat.',
        pages: [1, 2, 3, 5, 6],
      },
      {
        word: 'conduction',
        definition: 'The transfer of thermal energy through a material, from particle to particle.',
        pages: [1, 2, 6],
      },
      {
        word: 'convection',
        definition: 'The transfer of thermal energy by the movement of a heated liquid or gas.',
        pages: [1, 2, 6],
      },
      {
        word: 'radiation',
        definition: 'The transfer of thermal energy by rays that can cross empty space.',
        pages: [1, 3, 6],
      },
      {
        word: 'insulators',
        definition: 'Materials that do not let thermal energy pass through them easily.',
        pages: [2],
      },
      {
        word: 'evaporates',
        definition: 'Changes from a liquid into a gas, carrying thermal energy away.',
        pages: [3, 5],
      },
    ],
    culturalNotes: [
      'BECE link: heat energy; transfer of heat by conduction, convection, and radiation; conductors and insulators.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: food sellers commonly use ice chests to keep cooked food hot. Mole National Park in the Savannah Region is Ghana’s largest protected area and is known for its elephants.',
    ],
    reviewQuestions: [
      'Confirm the description of the reindeer’s nose with a biology reviewer.',
      'Check that each method of heat transfer has one clear Ghanaian example.',
    ],
    guide: {
      overview:
        'Teaches the three methods of heat transfer and insulation through an ice chest, a reindeer, an elephant, and house design.',
      lessonMinutes: 45,
      goals: [
        'State that thermal energy flows from hotter to colder places.',
        'Describe conduction, convection, and radiation with examples.',
        'Explain how insulators reduce the transfer of thermal energy.',
        'Apply the ideas to keeping food hot and rooms cool.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: energy: heat transfer; conductors and insulators; codes to verify)', 'Conduction, convection, radiation, and insulation'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Subtraction with negative numbers; simple rates'],
      ],
      before: ['Ask: how does the food seller keep rice hot for six hours without fire? List every idea.'],
      during: ['After Page 3, learners sort ten everyday items into good conductors and insulators.'],
      after: ['Wrap one cup of hot water in cloth and leave another bare. Compare them by touch after fifteen minutes.'],
      discussion: ['Which is easier in your town: keeping things hot or keeping things cold? Why?'],
      reflection: ['Name one change at home or school that would keep a room cooler without electricity.'],
      maths: [
        {
          task: 'Soup in a flask is at 90 °C and cools by 4 °C every hour. What is its temperature after 5 hours?',
          answer: '90 − (4 × 5) = 70 °C.',
        },
        {
          task: 'Air enters a reindeer’s nose at −40 °C and is warmed to 38 °C. By how many degrees has its temperature risen?',
          answer: '38 − (−40) = 78 °C.',
        },
      ],
      support: ['Use three picture cards (spoon in soup, boiling water, the Sun) as reminders of the three methods.'],
      stretch: ['Design a box that keeps a sachet of water cold for as long as possible, using only waste materials. Test it.'],
      localise: ['Visit or describe a local building that stays cool. Which features in the article does it have?'],
      factCheck: [
        {
          claim: 'Conduction, convection, radiation, reindeer nasal heat exchange, and elephant ear cooling.',
          explanation: 'Physics content is standard. The account of the reindeer’s nose, hollow hairs, and elephant ears comes from general knowledge and should be confirmed by a science reviewer.',
          reference: 'Standard thermal physics and comparative physiology / NaCCA Integrated Science curriculum (codes to verify)',
        },
      ],
    },
  }),

  // 3
  mk({
    key: 'ripples-in-water-ripples-in-space',
    title: 'Ripples in Water, Ripples in Space',
    summary:
      'A stone dropped in a pond shows what a wave is. This article explains wavelength, frequency, and amplitude, then follows the same ideas to gravitational waves, the faint ripples in space first detected in 2015.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Calm, clear, and full of wonder',
    palette: ['#0e7490', '#7c3aed'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Soft flowing kora-style melody (placeholder)',
    pages: [
      pg(
        '🪨',
        'Drop a stone into a still pond. Circles spread outwards across the water until they touch the bank. Now watch a leaf floating on the surface. As each ripple passes, the leaf bobs up and down, but it does not travel to the bank with the circles. This simple sight holds a big idea. The water itself is not moving outwards. Only the disturbance is. A wave is a disturbance that carries energy from one place to another without carrying matter along with it. Sound, light, radio signals, and earthquakes all travel as waves.',
        'Circles spreading across a still pond from the spot where a stone fell, with a leaf floating on the surface.'
      ),
      pg(
        '📏',
        'Every wave can be measured. The highest point is the crest, and the lowest point is the trough. The wavelength is the distance from one crest to the next. The amplitude is the height of a crest above the rest position: a bigger amplitude means the wave carries more energy. The frequency is the number of waves that pass a point each second, and it is measured in hertz (Hz). These measurements are tied together by one equation: wave speed = frequency × wavelength. If 2 waves pass each second and each is 3 metres long, the wave travels at 6 metres per second.',
        'A side view of a wave with the crest, trough, wavelength, and amplitude labelled.'
      ),
      pg(
        '〰️',
        'Waves come in two kinds. Shake one end of a skipping rope up and down and humps run along it. The rope moves up and down while the wave moves forward. This is a transverse wave, and water ripples and light are of this kind. Now push and pull the end of a long spring. Squeezed and stretched sections travel along it, in the same line as your push. This is a longitudinal wave, and sound is of this kind. Most waves need something to travel through, such as water, rope, or air. Light is special: it can cross empty space.',
        'A skipping rope being shaken into humps, above a long spring with squeezed and stretched sections.'
      ),
      pg(
        '🌌',
        'In 1916, Albert Einstein predicted a far stranger wave. He had worked out that space is not just emptiness. It can be stretched and squeezed, a little like the surface of a pond. When very heavy objects, such as two black holes, circle each other and crash together, they should send ripples through space itself. These are gravitational waves. They travel at the speed of light. But Einstein doubted that anyone would ever detect them. By the time a gravitational wave reaches Earth, it stretches and squeezes everything by an amount far smaller than a single atom.',
        'Two dark spheres circling each other in space, with ripples spreading outwards from them.'
      ),
      pg(
        '🔦',
        'Scientists built a machine to try. It is called LIGO, and it has two stations in the United States, about 3,000 kilometres apart. Each is shaped like a giant letter L, with two arms 4 kilometres long. A laser beam is split in two and sent along both arms to mirrors and back. If a gravitational wave passes, one arm becomes very slightly longer while the other becomes shorter, and the returning beams no longer match. On 14 September 2015, both stations recorded the same tiny wobble. It came from two black holes that had collided about 1.3 billion years earlier.',
        'A view from above of a detector with two long straight arms meeting at a right angle in open country.'
      ),
      pg(
        '🔭',
        'The discovery won the Nobel Prize in Physics in 2017. Since then, detectors in Italy and Japan have joined the search, and using several stations together helps to show where in the sky a wave came from. By May 2026, the teams had recorded 390 gravitational wave signals, most of them from pairs of black holes. Until 2015, almost everything we knew about the universe came from light and other rays. Black holes give out no light, so they were hidden. Gravitational waves let us study them for the first time. From a pond ripple to a ripple in space, the same ideas apply.',
        'A world map marking detector stations in the United States, Italy, and Japan, under a starry sky.'
      ),
    ],
    activities: [
      {
        id: 'rp-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What does a wave carry from place to place?',
        options: [
          'Energy',
          'Water',
          'Leaves and other floating matter',
        ],
        correctIndex: 0,
      },
      {
        id: 'rp-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'A wave has a frequency of 5 Hz and a wavelength of 2 m. What is its speed?',
        options: [
          '2.5 m/s',
          '7 m/s',
          '10 m/s',
        ],
        correctIndex: 2,
      },
      {
        id: 'rp-c3',
        type: 'comprehension',
        afterPage: 3,
        question: 'Which statement about sound waves is correct?',
        options: [
          'They are transverse and can cross empty space',
          'They are longitudinal and need something to travel through',
          'They are the same as water ripples',
        ],
        correctIndex: 1,
      },
      {
        id: 'rp-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: Why are gravitational waves so useful for studying black holes?',
        options: [
          'Black holes give out no light, but their collisions send out gravitational waves',
          'Gravitational waves are easier to see with the eye than light',
          'Black holes are close to Earth',
        ],
        correctIndex: 0,
      },
      {
        id: 'rp-s1',
        type: 'sequencing',
        prompt: 'Put the story of gravitational waves in order.',
        items: [
          'Two black holes collide far away in space',
          'Einstein predicts gravitational waves',
          'LIGO records its first signal',
          'The discovery wins a Nobel Prize',
          'The number of recorded signals reaches 390',
        ],
      },
      {
        id: 'rp-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'frequency',
        definition: 'The number of waves that pass a point each second.',
        distractors: [
          'The height of a wave above its rest position',
          'The distance from one crest to the next',
        ],
      },
    ],
    glossary: [
      {
        word: 'wave',
        definition: 'A disturbance that carries energy from place to place without carrying matter.',
        pages: [1, 2, 3, 5, 6],
      },
      {
        word: 'wavelength',
        definition: 'The distance from one crest to the next.',
        pages: [2],
      },
      {
        word: 'amplitude',
        definition: 'The height of a crest above the rest position.',
        pages: [2],
      },
      {
        word: 'frequency',
        definition: 'The number of waves that pass a point each second, measured in hertz.',
        pages: [2],
      },
      {
        word: 'transverse',
        definition: 'Transverse wave: a wave in which the movement is at right angles to the direction the wave travels.',
        pages: [3],
      },
      {
        word: 'longitudinal',
        definition: 'Longitudinal wave: a wave in which the movement is along the direction the wave travels.',
        pages: [3],
      },
      {
        word: 'gravitational',
        definition: 'Gravitational wave: a ripple in space made when very heavy objects move or collide.',
        pages: [4, 5, 6],
      },
    ],
    culturalNotes: [
      'BECE link: energy; waves and their properties (the terms are used again in sound and light).',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: the pond can be any still water learners know, such as a dam, a fish pond, or a bucket.',
    ],
    reviewQuestions: [
      'Recheck the number of recorded signals before each school year; it rises with every new list.',
      'Check 5 × 2 = 10 and 2 × 3 = 6 in the text and questions.',
    ],
    guide: {
      overview:
        'Builds the idea of a wave from a pond ripple, introduces the wave equation, and applies it to the detection of gravitational waves.',
      lessonMinutes: 45,
      goals: [
        'Explain that waves carry energy, not matter.',
        'Label crest, trough, wavelength, and amplitude.',
        'Use wave speed = frequency × wavelength.',
        'Describe how gravitational waves were detected and why they matter.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: energy: waves, sound, and light; codes to verify)', 'Properties of waves and the wave equation'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Multiplication and division; using a formula'],
      ],
      before: ['Drop a pebble in a basin of water with a scrap of paper floating on it. Ask: does the paper move outwards?'],
      during: ['After Page 3, pairs make transverse waves with a rope and describe how the rope moves.'],
      after: ['Learners draw and label a wave, then write the wave equation with one worked example.'],
      discussion: ['Einstein thought gravitational waves would never be detected. Why do scientists still test ideas that seem impossible?'],
      reflection: ['Which wave do you depend on most in a normal day?'],
      maths: [
        {
          task: 'Sea waves have a frequency of 0.5 Hz and a wavelength of 8 m. What is their speed?',
          answer: '0.5 × 8 = 4 m/s.',
        },
        {
          task: 'The latest list added 161 signals to reach a total of 390. How many had been recorded before it?',
          answer: '390 − 161 = 229.',
        },
      ],
      support: ['Let learners trace a printed wave with a finger while naming each part aloud.'],
      stretch: ['Find out why detectors in three countries locate a wave better than one detector alone.'],
      localise: ['Watch waves at a river, dam, or beach. Count how many crests pass a fixed point in 30 seconds and work out the frequency.'],
      factCheck: [
        {
          claim: 'LIGO first gravitational wave detection (14 September 2015), 2017 Nobel Prize, and 390 recorded signals by May 2026.',
          explanation: 'Total of 390 signals (list released 26 May 2026, adding 161) and detectors in the United States, Italy, and Japan checked in November 2026. First detection date, distance, arm length, and the 2017 Nobel Prize should be confirmed by a science reviewer.',
          reference: 'LIGO-Virgo-KAGRA Collaboration / Nobel Prize 2017 / NaCCA Integrated Science curriculum (codes to verify)',
        },
      ],
    },
  }),

  // 4
  mk({
    key: 'a-lens-made-of-water',
    title: 'A Lens Made of Water',
    summary:
      'A raindrop on a cocoyam leaf works as a magnifying glass. This article explains reflection, refraction, lenses, and the eye, and shows how timing a pulse of light or sound can measure the Moon’s distance and the depth of the sea.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Bright, clear, and curious',
    palette: ['#15803d', '#0284c7'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Light, sparkling xylophone pattern (placeholder)',
    pages: [
      pg(
        '💧',
        'After a morning shower, raindrops sit like glass beads on a broad cocoyam leaf. Bend close to one and look through it. The thin veins of the leaf beneath the drop appear larger and clearer than the veins beside it. The drop is working as a magnifying glass. No one shaped or polished it, yet it bends light just as the lenses in spectacles, cameras, and microscopes do. To understand how, we need to follow what light does when it meets water. Along the way we shall measure the distance to the Moon and the depth of the sea.',
        'Round raindrops on a broad green cocoyam leaf, with the leaf veins looking larger under one drop.'
      ),
      pg(
        '🪞',
        'Light travels in straight lines called rays. That is why shadows have sharp edges. When rays hit a smooth, shiny surface, such as a mirror or calm water, they bounce off. This is reflection. When rays pass from one clear material into another, such as from air into water, something else happens. Light travels more slowly in water than in air, and the change of speed makes the ray change direction. This bending is called refraction. It explains why a straight stick standing in a bucket of water looks broken at the surface, and why a stream looks shallower than it really is.',
        'A straight stick standing in a clear bucket of water and appearing bent at the surface.'
      ),
      pg(
        '🔍',
        'A raindrop has a curved surface. Rays passing through different parts of the curve are bent by different amounts, and all are bent inwards, towards one another. Any clear object that is thicker in the middle than at the edges does this. It is called a convex lens. The point where the rays meet is the focus. Hold a convex lens close to a small object and the object looks bigger. Your own eye contains a convex lens. It bends the light entering the eye so that a sharp picture forms on the retina, the sensitive layer at the back.',
        'Parallel rays of light passing through a convex lens and meeting at one point, beside a simple diagram of the eye.'
      ),
      pg(
        '👓',
        'In some eyes, the picture forms a little in front of the retina or behind it, and the world looks blurred. Spectacles add an extra lens that bends the rays just enough to correct the fault. Lenses also extend our sight. A microscope uses them to show the malaria parasite inside a drop of blood. A telescope uses them to show the moons of Jupiter. One warning: a convex lens can bring sunlight to a focus hot enough to burn paper. Never look at the Sun through a lens, and never leave one lying in dry grass.',
        'A pair of spectacles, a school microscope, and a small telescope arranged on a table.'
      ),
      pg(
        '🌕',
        'How fast is light? In empty space it covers about 300,000 kilometres every second, fast enough to circle Earth more than seven times in one second. Scientists use this speed as a measuring tape. Astronauts who landed on the Moon between 1969 and 1972 left special reflectors on its surface. Today, observatories fire short pulses of laser light at them and time the return. The round trip takes about 2.56 seconds. Half of that time, multiplied by the speed of light, gives the distance: about 384,000 kilometres. The measurements are so exact that they show the Moon moving away by nearly 4 centimetres a year.',
        'A thin green laser beam rising from an observatory dome towards a full Moon.'
      ),
      pg(
        '🚢',
        'The same trick works with sound in places where light cannot go. Sea water soon swallows light, but sound travels through it well, at about 1,500 metres per second. A ship sends a pulse of sound downwards and times the echo from the sea bed. If the echo returns after 2 seconds, the sound took 1 second to go down, so the water is 1,500 metres deep. Fishing boats use echo sounders to find shoals of fish, and survey ships use them to map the sea floor off Ghana’s coast. Send a pulse, time its return, and you can measure what you cannot reach.',
        'A ship on the sea sending curved sound pulses down to the sea bed, with the echoes returning.'
      ),
    ],
    activities: [
      {
        id: 'lw-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why does light bend when it passes from air into water?',
        options: [
          'Water is colder than air',
          'Its speed changes',
          'Water reflects all of the light',
        ],
        correctIndex: 1,
      },
      {
        id: 'lw-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Which shape describes a convex lens?',
        options: [
          'Thicker in the middle than at the edges',
          'Thinner in the middle than at the edges',
          'Flat on both sides',
        ],
        correctIndex: 0,
      },
      {
        id: 'lw-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'A laser pulse takes about 2.56 seconds to reach the Moon and come back. Why do scientists use half of this time to find the distance?',
        options: [
          'Light slows down on the way back',
          'The Moon is moving away',
          'The pulse travels the distance twice: there and back',
        ],
        correctIndex: 2,
      },
      {
        id: 'lw-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A ship’s echo returns 4 seconds after the pulse is sent. Sound travels at 1,500 m/s in sea water. How deep is the sea?',
        options: [
          '6,000 m',
          '3,000 m',
          '1,500 m',
        ],
        correctIndex: 1,
      },
      {
        id: 'lw-s1',
        type: 'sequencing',
        prompt: 'Put the steps of measuring the distance to the Moon in order.',
        items: [
          'An observatory fires a pulse of laser light',
          'The pulse crosses space to the Moon',
          'A reflector on the Moon sends the pulse back',
          'The observatory records the time for the round trip',
          'Half the time is multiplied by the speed of light',
        ],
      },
      {
        id: 'lw-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'refraction',
        definition: 'The bending of light when it passes from one clear material into another.',
        distractors: [
          'The bouncing of light off a shiny surface',
          'The blocking of light to make a shadow',
        ],
      },
    ],
    glossary: [
      {
        word: 'rays',
        definition: 'The straight lines along which light travels.',
        pages: [2, 3, 4],
      },
      {
        word: 'reflection',
        definition: 'The bouncing of light off a surface.',
        pages: [2],
      },
      {
        word: 'refraction',
        definition: 'The bending of light when it passes from one clear material into another.',
        pages: [2],
      },
      {
        word: 'convex',
        definition: 'Convex lens: a lens that is thicker in the middle than at the edges and bends rays inwards.',
        pages: [3, 4],
      },
      {
        word: 'focus',
        definition: 'The point where rays of light meet after passing through a lens.',
        pages: [3, 4],
      },
      {
        word: 'retina',
        definition: 'The light-sensitive layer at the back of the eye.',
        pages: [3, 4],
      },
      {
        word: 'echo',
        definition: 'A sound heard again after it bounces off a surface.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'BECE link: light energy; reflection and refraction; lenses and the human eye.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: cocoyam (kontomire) leaves shed water in round drops, so they show the lens effect well. Safety: learners must never look at the Sun through any lens.',
    ],
    reviewQuestions: [
      'Check 1.28 × 300,000 = 384,000 and 300,000 ÷ 40,000 = 7.5.',
      'Keep the Sun-safety warning on Page 4 exactly as written.',
    ],
    guide: {
      overview:
        'Uses a raindrop to teach reflection, refraction, and lenses, then shows how timing light and sound pulses measures distance.',
      lessonMinutes: 45,
      goals: [
        'State that light travels in straight lines.',
        'Distinguish reflection from refraction.',
        'Describe what a convex lens does and how the eye forms a picture.',
        'Calculate a distance from a timed pulse and its echo.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: energy: light; reflection, refraction, and lenses; codes to verify)', 'Behaviour of light and uses of lenses'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Speed, distance, and time; halving'],
      ],
      before: ['Put a drop of water on clear plastic over printed text. Ask learners to describe what they see.'],
      during: ['After Page 2, stand a pencil in a glass of water and view it from the side.'],
      after: ['Learners draw rays passing through a convex lens to a focus and label the diagram.'],
      discussion: ['Why is half the time used in every echo calculation? Explain it to a partner.'],
      reflection: ['Whose work in your community depends on lenses?'],
      maths: [
        {
          task: 'Sunlight travels 150,000,000 km to Earth at 300,000 km/s. How long does it take?',
          answer: '150,000,000 ÷ 300,000 = 500 seconds, or 8 minutes 20 seconds.',
        },
        {
          task: 'An echo sounder hears the echo from a shoal of fish 0.6 seconds after sending the pulse. How deep is the shoal? (Sound: 1,500 m/s.)',
          answer: '0.3 × 1,500 = 450 m.',
        },
      ],
      support: ['Provide a ray diagram with the lens already drawn so learners add only the rays.'],
      stretch: ['Find out the difference between short sight and long sight and which lens corrects each.'],
      localise: ['Ask a fisherman, optician, or laboratory technician how lenses or echo sounders are used in their work.'],
      factCheck: [
        {
          claim: 'Speed of light (~300,000 km/s), Moon laser round-trip (~2.56 s for ~384,000 km), and speed of sound in sea water (~1,500 m/s).',
          explanation: 'Speed of light, Moon distance, and speed of sound in sea water are standard values. The laser round-trip time and the Moon’s drift of about 3.8 cm a year should be confirmed by a science reviewer.',
          reference: 'NASA Lunar Laser Ranging / NaCCA Integrated Science curriculum (codes to verify)',
        },
      ],
    },
  }),

  // 5
  mk({
    key: 'the-rays-we-cannot-see',
    title: 'The Rays We Cannot See',
    summary:
      'Light is one small part of a large family of rays. This article tours the electromagnetic spectrum from radio waves to gamma rays, with their uses, their dangers, and the radio telescope at Kuntunse.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Clear, steady, and thoughtful',
    palette: ['#7e22ce', '#f59e0b'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Quiet, shimmering synth pad with soft shaker (placeholder)',
    pages: [
      pg(
        '🌞',
        'Stand in an open market at midday. Your eyes see bright light. Your skin feels warmth. A few hours later, your skin may be sore, although you felt nothing strike it. Three different things reached you from the Sun at once: light that you can see, infrared rays that you can feel as heat, and ultraviolet rays that you can neither see nor feel. They all belong to one family, called the electromagnetic spectrum. Most of the family is invisible. Its members cook food, carry phone calls, show broken bones, and treat cancer. Some can also harm us.',
        'A busy open-air market under a strong midday sun, with traders sitting beneath large umbrellas.'
      ),
      pg(
        '🌈',
        'All electromagnetic waves can cross empty space, and there they all travel at the speed of light. What differs is the wavelength. Radio waves are the longest: some are longer than a football pitch. Then, in order, come microwaves, infrared, visible light, ultraviolet, X-rays, and gamma rays, whose wavelengths are smaller than an atom. As the wavelength gets shorter, the frequency gets higher, and each wave carries more energy. Our eyes detect only the narrow band in the middle. The colours of a rainbow, from red to violet, are simply the different wavelengths of visible light.',
        'A long band showing the electromagnetic spectrum from radio waves to gamma rays, with a narrow rainbow strip in the middle.'
      ),
      pg(
        '📻',
        'The long, low-energy waves are our messengers. Radio waves carry radio and television programmes across the country. Microwaves carry mobile phone calls and Wi-Fi, and inside a microwave oven they make the water in food vibrate and heat up. Infrared rays leave every warm object. A television remote control sends its signals by infrared, and some thermometers read your temperature from the infrared your forehead gives out. None of these waves has enough energy to break apart the atoms in your body. If they are strong, their main effect is gentle heating.',
        'A radio mast, a mobile phone, a microwave oven, and a television remote control.'
      ),
      pg(
        '🧴',
        'Ultraviolet rays carry more energy. A little is useful: it helps the skin to make vitamin D, and ultraviolet lamps kill germs in water and on hospital tools. Too much burns the skin, damages the eyes, and, over many years, can lead to skin cancer. Dark skin contains more melanin, a natural substance that absorbs ultraviolet, but it does not give complete protection. People with albinism have very little melanin and must take special care. Shade, long sleeves, a wide hat, and sunglasses all help. High in the atmosphere, a layer of ozone gas absorbs most of the Sun’s ultraviolet before it reaches us.',
        'A wide-brimmed hat, sunglasses, and a long-sleeved shirt laid out beside a shady tree.'
      ),
      pg(
        '🩻',
        'X-rays and gamma rays carry the most energy of all. X-rays pass through flesh but are stopped by bone, so they make shadow pictures of a broken arm or a damaged chest. Gamma rays come from radioactive materials. These rays can damage living cells, which makes them dangerous, but the same power is used in radiotherapy, where carefully aimed beams destroy cancer cells. Ghana’s large teaching hospitals, such as Korle Bu in Accra and Komfo Anokye in Kumasi, offer this treatment. The person who takes your X-ray stands behind a screen, because a small dose for you would become a large dose for someone exposed all day.',
        'An X-ray picture of a forearm on a lit viewing screen in a hospital room.'
      ),
      pg(
        '📡',
        'Invisible rays also bring news from space. At Kuntunse, near Accra, stands a dish 32 metres wide. It was built to carry telephone signals by satellite, and in 2017 it began a new life as a radio telescope, the first of its kind in West Africa. It collects radio waves from far-off objects such as pulsars. A pulsar is the tiny, heavy remains of an exploded star. It spins many times a second and sweeps a beam of radio waves past Earth like a lighthouse. So are these rays friends or enemies? Neither. Each must be understood, used wisely, and respected.',
        'A very large white dish antenna pointing at the evening sky, with low hills behind it.'
      ),
    ],
    activities: [
      {
        id: 'rs-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What do all electromagnetic waves have in common?',
        options: [
          'They can all be seen',
          'They all travel at the same speed in empty space',
          'They all have the same wavelength',
        ],
        correctIndex: 1,
      },
      {
        id: 'rs-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Which waves carry mobile phone calls?',
        options: [
          'Gamma rays',
          'Ultraviolet rays',
          'Microwaves',
        ],
        correctIndex: 2,
      },
      {
        id: 'rs-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why does a hospital worker stand behind a screen while taking an X-ray?',
        options: [
          'Small doses repeated all day would add up to a harmful amount',
          'X-rays are very loud',
          'The screen makes the picture clearer',
        ],
        correctIndex: 0,
      },
      {
        id: 'rs-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A classmate with albinism is going on a school trip to the beach. Which advice is best supported by the article?',
        options: [
          'Wear long sleeves, a wide hat, and sunglasses, and rest in the shade',
          'Stay in the sea, because water blocks all ultraviolet',
          'Do nothing special, because ultraviolet cannot be felt',
        ],
        correctIndex: 0,
      },
      {
        id: 'rs-s1',
        type: 'sequencing',
        prompt: 'Arrange these from the longest wavelength to the shortest.',
        items: [
          'Radio waves',
          'Microwaves',
          'Infrared',
          'Ultraviolet',
          'Gamma rays',
        ],
      },
      {
        id: 'rs-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'electromagnetic spectrum',
        definition: 'The whole family of waves, from radio waves to gamma rays, that travel at the speed of light.',
        distractors: [
          'The colours painted on a television screen',
          'The layer of gas that protects Earth from the Sun',
        ],
      },
    ],
    glossary: [
      {
        word: 'spectrum',
        definition: 'Electromagnetic spectrum: the whole family of waves, from radio waves to gamma rays, that travel at the speed of light.',
        pages: [1],
      },
      {
        word: 'wavelength',
        definition: 'The distance from one wave crest to the next.',
        pages: [2],
      },
      {
        word: 'infrared',
        definition: 'Invisible rays given out by warm objects; we feel them as heat.',
        pages: [1, 2, 3],
      },
      {
        word: 'ultraviolet',
        definition: 'Invisible rays from the Sun that can burn the skin.',
        pages: [1, 2, 4],
      },
      {
        word: 'melanin',
        definition: 'A natural substance in skin that absorbs ultraviolet rays.',
        pages: [4],
      },
      {
        word: 'radiotherapy',
        definition: 'The treatment of cancer with carefully aimed high-energy rays.',
        pages: [5],
      },
      {
        word: 'pulsar',
        definition: 'The spinning remains of an exploded star, which sends out a sweeping beam of radio waves.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'BECE link: forms of energy; light and the wider electromagnetic spectrum; uses and dangers of radiation.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: the Ghana Radio Astronomy Observatory is at Kuntunse, north-west of Accra. Sun protection for people with albinism is a real health need in Ghana and should be discussed with respect.',
    ],
    reviewQuestions: [
      'Confirm with a health professional that the sun-safety advice on Page 4 is suitable for learners.',
      'Check the order of the spectrum on Page 2 against the sequencing activity.',
    ],
    guide: {
      overview:
        'Introduces the electromagnetic spectrum in order of wavelength, weighing the uses of each part against its risks.',
      lessonMinutes: 45,
      goals: [
        'Name the parts of the electromagnetic spectrum in order.',
        'State that all electromagnetic waves travel at the speed of light in empty space.',
        'Give one use and one danger of ultraviolet, X-rays, and gamma rays.',
        'Explain simple ways to reduce exposure to harmful rays.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: energy: light and other radiations; codes to verify)', 'The electromagnetic spectrum, its uses and dangers'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Division and multiplication with large numbers'],
      ],
      before: ['Ask: name something that reaches you from the Sun that you cannot see. Record the answers.'],
      during: ['After Page 2, learners line up holding cards for the seven parts of the spectrum in the right order.'],
      after: ['Learners make a two-column table: use and danger, for four parts of the spectrum.'],
      discussion: ['Is it fair to call any kind of ray simply good or bad? Use two examples from the article.'],
      reflection: ['What will you do differently on the next very sunny day?'],
      maths: [
        {
          task: 'A communications satellite is 36,000 km above Earth. How long does a radio signal take to reach it at 300,000 km/s?',
          answer: '36,000 ÷ 300,000 = 0.12 seconds.',
        },
        {
          task: 'A pulsar spins 30 times each second. How many times does it spin in one minute?',
          answer: '30 × 60 = 1,800 times.',
        },
      ],
      support: ['Give learners a printed spectrum strip to colour and label as they read.'],
      stretch: ['Find out who first detected a pulsar, in which year, and why the signal puzzled astronomers.'],
      localise: ['List every device at home or school that uses radio waves, microwaves, or infrared.'],
      factCheck: [
        {
          claim: '32-metre dish at Kuntunse launched as a radio telescope in 2017, radiotherapy at Korle Bu and Komfo Anokye, and UV/melanin protection.',
          explanation: 'The 32-metre dish at Kuntunse and its launch as a radio telescope in 2017, the “first in West Africa” description, and radiotherapy services at Korle Bu and Komfo Anokye should be confirmed. Health statements about ultraviolet and melanin should be checked by a health professional.',
          reference: 'Ghana Space Science and Technology Institute (GSSTI) / NaCCA Integrated Science curriculum (codes to verify)',
        },
      ],
    },
  }),

  // 6
  mk({
    key: 'why-ice-floats',
    title: 'Why Ice Floats',
    summary:
      'Almost everything shrinks as it freezes, but water expands. This article explains expansion, contraction, and density, and shows why the odd behaviour of water matters to living things.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Cool, clear, and steady',
    palette: ['#0891b2', '#64748b'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Clear, bell-like tones over a slow rhythm (placeholder)',
    pages: [
      pg(
        '🧊',
        'Put a full bottle of water in a freezer overnight. In the morning the bottle is swollen, and if it was glass it may have cracked. A sachet of water frozen solid is tight and round like a small pillow. Drop a lump of that ice into a cup of sobolo and it floats. We see these things so often that we forget to ask why. Yet they are strange. Almost every other substance shrinks when it freezes, and its solid form sinks in its liquid. Water breaks the rule, and life on Earth depends on it.',
        'A swollen frozen plastic bottle and a tight frozen water sachet beside a cup of dark red drink with ice floating in it.'
      ),
      pg(
        '🌡️',
        'Start with the rule. All matter is made of tiny particles that are always moving. Heat a substance and its particles move faster and push further apart, so it takes up more space. This is expansion. Cool it and the particles slow down and draw closer, so it shrinks. This is contraction. You can see both around you. Electricity wires hang lower on a hot afternoon than at dawn. Builders leave small gaps between the sections of a bridge, so that the sections can expand in the heat without cracking. A metal roof creaks as it warms in the morning and cools in the evening.',
        'Electricity wires sagging between poles in the afternoon sun, and a narrow gap between two sections of a bridge.'
      ),
      pg(
        '⚖️',
        'When a substance contracts, the same mass is packed into less space. We say that its density has increased. Density tells us how much mass is in each unit of volume: density = mass ÷ volume. Water has a density of 1 gram per cubic centimetre. An object that is less dense than a liquid floats in it, and one that is denser sinks. Palm oil floats on water. A stone sinks. Since most substances contract as they cool and freeze, their solids are denser than their liquids. Drop a piece of solid candle wax into melted wax and it goes to the bottom.',
        'A clear glass holding water with a layer of red palm oil floating on top and a small stone resting at the bottom.'
      ),
      pg(
        '❄️',
        'Water follows the rule until it is cooled to 4 °C. At that temperature it is at its densest. Cool it further and it does something unexpected: it begins to expand. At 0 °C it freezes, and its particles lock together in an open pattern with more empty space between them than in the liquid. Ice therefore takes up about 9 per cent more room than the water it was made from, and its density is only about 0.92 grams per cubic centimetre. That is why the bottle swells, why the sachet tightens, and why ice floats with only a small part of it above the surface.',
        'Two diagrams side by side: particles of liquid water close together, and particles of ice joined in an open six-sided pattern.'
      ),
      pg(
        '🐟',
        'This odd behaviour protects life in cold countries. In winter, the water at the surface of a lake cools, becomes denser, and sinks, until the whole lake is at 4 °C. After that, colder water is lighter, so it stays on top and freezes there. The sheet of ice floats and acts as a blanket, keeping the water below it liquid. Fish and other living things survive under it until spring. If ice were denser than water, it would sink. Lakes would freeze from the bottom up into solid blocks, and little could live in them.',
        'A cross-section of a frozen lake with a layer of ice on top and fish swimming in the liquid water beneath.'
      ),
      pg(
        '🏔️',
        'Expanding ice is also a powerful tool. Water seeps into cracks in rock, freezes, expands, and forces the cracks wider. Over many years this breaks mountains into soil. In cold countries, it bursts water pipes and breaks up roads. At sea, huge icebergs float with about nine-tenths of their ice hidden under the water, a danger to ships. Ghana has no frozen lakes, but the same science is in every kitchen. Leave space at the top of a bottle before you freeze it. And never put a sealed glass bottle in the freezer: the water will expand, and glass cannot stretch.',
        'An iceberg at sea drawn to show the small part above the water and the much larger part below.'
      ),
    ],
    activities: [
      {
        id: 'if-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why do electricity wires hang lower on a hot afternoon?',
        options: [
          'The metal expands as it gets hotter',
          'The poles move closer together',
          'Electricity makes the wires heavier',
        ],
        correctIndex: 0,
      },
      {
        id: 'if-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'A block has a mass of 60 g and a volume of 20 cm³. What is its density?',
        options: [
          '1,200 g/cm³',
          '80 g/cm³',
          '3 g/cm³',
        ],
        correctIndex: 2,
      },
      {
        id: 'if-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'At what temperature is water at its densest?',
        options: [
          '0 °C',
          '4 °C',
          '100 °C',
        ],
        correctIndex: 1,
      },
      {
        id: 'if-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A trader wants to freeze bottles of water to sell. What should she do, and why?',
        options: [
          'Fill each bottle to the very top, because ice shrinks',
          'Leave some space in each bottle, because water expands as it freezes',
          'Use sealed glass bottles, because glass stretches',
        ],
        correctIndex: 1,
      },
      {
        id: 'if-s1',
        type: 'sequencing',
        prompt: 'Put the steps in order to show how a lake freezes in a cold country.',
        items: [
          'Cold air cools the water at the surface',
          'The cooled water becomes denser and sinks',
          'The whole lake reaches 4 °C',
          'Water colder than 4 °C stays on top and freezes',
          'A floating sheet of ice keeps the water below liquid',
        ],
      },
      {
        id: 'if-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'density',
        definition: 'The mass in each unit of volume of a substance.',
        distractors: [
          'The weight of an object on the Moon',
          'The temperature at which a liquid freezes',
        ],
      },
    ],
    glossary: [
      {
        word: 'particles',
        definition: 'The tiny moving pieces that all matter is made of.',
        pages: [2, 4],
      },
      {
        word: 'expansion',
        definition: 'An increase in size when a substance is heated.',
        pages: [2],
      },
      {
        word: 'contraction',
        definition: 'A decrease in size when a substance is cooled.',
        pages: [2],
      },
      {
        word: 'density',
        definition: 'The mass in each unit of volume of a substance.',
        pages: [3, 4],
      },
      {
        word: 'mass',
        definition: 'The amount of matter in an object, measured in grams or kilograms.',
        pages: [3],
      },
      {
        word: 'volume',
        definition: 'The amount of space an object takes up.',
        pages: [3],
      },
    ],
    culturalNotes: [
      'BECE link: matter; density; expansion and contraction of solids and liquids; changes of state.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: frozen sachet and bottled water, ice blocks, and chilled sobolo are everyday sights. Safety: sealed glass bottles can shatter in a freezer.',
    ],
    reviewQuestions: [
      'Check 60 ÷ 20 = 3 and the two Work it out answers.',
      'Confirm that learners meet “per cent” in mathematics before this article is used.',
    ],
    guide: {
      overview:
        'Teaches expansion, contraction, and density, then explains why water is unusual and why that matters for living things and for everyday safety.',
      lessonMinutes: 45,
      goals: [
        'Explain expansion and contraction using particles.',
        'Use density = mass ÷ volume.',
        'State that water is densest at 4 °C and expands when it freezes.',
        'Explain why ice floats and why lakes freeze from the top.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: matter: density, expansion, and changes of state; codes to verify)', 'Density and the unusual expansion of water'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Division; percentages'],
      ],
      before: ['Show ice floating in a glass of water. Ask: is this what you would expect a solid to do in its own liquid?'],
      during: ['After Page 3, learners predict whether five objects float or sink, then test them in a basin.'],
      after: ['Mark the water level on a plastic bottle, freeze it overnight, and compare the level next day.'],
      discussion: ['What would happen to fish in cold countries if ice sank? Explain step by step.'],
      reflection: ['Where have you seen expansion or contraction this week?'],
      maths: [
        {
          task: '500 cm³ of water freezes and expands by 9 per cent. What is the volume of the ice?',
          answer: '9% of 500 = 45; 500 + 45 = 545 cm³.',
        },
        {
          task: 'A block of ice has a mass of 460 g and a volume of 500 cm³. What is its density?',
          answer: '460 ÷ 500 = 0.92 g/cm³.',
        },
      ],
      support: ['Use a float-or-sink picture chart and let learners say “denser” or “less dense” for each object.'],
      stretch: ['Find out why sea water freezes at a lower temperature than fresh water.'],
      localise: ['Ask a person who sells iced water how they stop bottles and sachets from bursting in the freezer.'],
      factCheck: [
        {
          claim: 'Water maximum density at 4 °C, ~9% expansion on freezing, and ice density ~0.92 g/cm³.',
          explanation: 'Water’s greatest density at 4 °C, expansion of about 9 per cent on freezing, and ice density of about 0.92 g/cm³ are standard values; a science reviewer should confirm them and the iceberg fraction.',
          reference: 'Standard physical properties of water / NaCCA Integrated Science curriculum (codes to verify)',
        },
      ],
    },
  }),

  // 7
  mk({
    key: 'sound-noise-and-silence',
    title: 'Sound, Noise, and Silence',
    summary:
      'Every sound starts with a vibration. This article explains how sound travels, what pitch and loudness are, what Ghana’s noise limits say, how loud sound harms hearing, and how deaf people experience vibration.',
    classIds: ['jhs-1', 'jhs-2', 'jhs-3'],
    ageMin: 12,
    ageMax: 15,
    readingLevel: 'fluent',
    difficulty: 4,
    genres: ['science', 'educational'],
    themes: ['technology', 'school'],
    objectives: ['scientific-curiosity', 'reasoning', 'vocabulary', 'problem-solving'],
    ghanaianContext: 'central',
    wpm: 125,
    paceWord: 'Rhythmic, clear, and respectful',
    palette: ['#be123c', '#4338ca'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Atumpan-style drum phrases, soft and spaced (placeholder)',
    pages: [
      pg(
        '🥁',
        'At a durbar, a drummer strikes the two great atumpan drums. Far across the park, people feel each beat in their chests before they have thought about hearing it. Rest a fingertip lightly on a drum skin as it is played and you will feel it trembling. Every sound begins this way. Something vibrates: a drum skin, a guitar string, the air inside a flute, or the vocal cords in your throat. A vibration is a quick, repeated movement to and fro. Stop the vibration by pressing your palm on the drum, and the sound stops at once.',
        'A pair of tall atumpan drums on a stand at a durbar ground, with curved drumsticks resting on them.'
      ),
      pg(
        '🔊',
        'A vibrating drum skin pushes on the air particles next to it. They push on their neighbours, which push on theirs, and so a sound wave travels outwards. The particles themselves only shake to and fro. Sound therefore needs a material to carry it. That material is called a medium, and it may be a gas, a liquid, or a solid. Sound travels at about 340 metres per second in air, about 1,500 in water, and about 5,000 in steel. Where there are no particles, as in the vacuum of space, sound cannot travel at all. Space is completely silent.',
        'A drum skin sending bands of closely and loosely packed air particles outwards towards an ear.'
      ),
      pg(
        '🎵',
        'Two measurements describe a sound. Frequency is the number of vibrations each second, measured in hertz (Hz). It sets the pitch. A short, tight string vibrates quickly and gives a high note. A long, slack one gives a low note. Young people can hear from about 20 Hz to about 20,000 Hz. Amplitude is the size of the vibration, and it sets the loudness. Hit a drum harder and the skin moves further, so the sound is louder. The atumpan is a pair, one low-pitched and one high-pitched. By mixing them, a skilled drummer copies the rise and fall of spoken Twi and sends messages.',
        'Two wave traces, one with waves close together and one with waves far apart, beside a guitar.'
      ),
      pg(
        '📢',
        'Loudness is measured in decibels (dB). A whisper is about 30 dB, ordinary talk about 60 dB, and heavy traffic about 85 dB. Speakers at a street party can pass 100 dB. Sound that is unwanted or harmful is called noise. Ghana has rules about it. In areas where people live, the limit is 55 dB in the daytime and 48 dB at night, from ten o’clock in the evening to six in the morning. Churches, mosques, and places of entertainment are allowed 65 dB by day and 60 dB at night. Many loudspeakers break these limits every week.',
        'A tall stack of loudspeakers at a street corner at night, with a hand holding a sound-level meter.'
      ),
      pg(
        '👂',
        'Why do the limits matter? Deep inside each ear is a coiled tube lined with thousands of tiny hair cells. They turn vibrations into signals for the brain. Very loud sound, or loud sound that goes on for hours, flattens and kills these cells, and they never grow back. The hearing loss is permanent. Too much noise also steals sleep, raises stress, and makes it hard to learn. Protect your ears. Keep earphones at a moderate volume, stand well away from big speakers, and give your ears quiet time. Workers at mills and in mechanics’ yards should wear ear protection.',
        'A diagram of the ear showing the outer ear, the eardrum, and the coiled tube of the inner ear.'
      ),
      pg(
        '🤟',
        'Is silence the absence of all sound? Not quite. People who are deaf do not live outside the world of vibration. Many enjoy music by feeling its beat through the floor, a balloon held in the hands, or the body of a drum. Deaf dancers follow rhythms in this way. Deaf people in Ghana also share a full language of their own, Ghanaian Sign Language, which uses the hands, face, and body in place of the voice. Sound is one way of sensing vibration, and there are others. So look after your hearing, and learn a few signs. Communication is far bigger than sound.',
        'Two students facing each other and talking in sign language, with a drum on the ground between them.'
      ),
    ],
    activities: [
      {
        id: 'sn-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'What must happen for any sound to be made?',
        options: [
          'Something must vibrate',
          'Something must be hot',
          'The air must be still',
        ],
        correctIndex: 0,
      },
      {
        id: 'sn-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'Why is there no sound in space?',
        options: [
          'Space is too cold',
          'Space is too far away',
          'There are no particles to carry the vibrations',
        ],
        correctIndex: 2,
      },
      {
        id: 'sn-c3',
        type: 'comprehension',
        afterPage: 3,
        question: 'A drummer hits the same drum harder. What changes?',
        options: [
          'The pitch becomes higher',
          'The amplitude and the loudness increase',
          'The frequency doubles',
        ],
        correctIndex: 1,
      },
      {
        id: 'sn-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A drinking spot in an area where people live plays music measured at 80 dB at eleven o’clock at night. What does the article tell you?',
        options: [
          'It is within the limit, because 80 dB is less than 85 dB',
          'It is far above the night limit of 48 dB for areas where people live',
          'There is no limit at night',
        ],
        correctIndex: 1,
      },
      {
        id: 'sn-s1',
        type: 'sequencing',
        prompt: 'Arrange these sounds from quietest to loudest.',
        items: [
          'A whisper (about 30 dB)',
          'The night limit where people live (48 dB)',
          'Ordinary talk (about 60 dB)',
          'Heavy traffic (about 85 dB)',
          'Speakers at a street party (over 100 dB)',
        ],
      },
      {
        id: 'sn-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'medium',
        definition: 'A material, such as air, water, or steel, that a sound wave travels through.',
        distractors: [
          'A sound that is neither loud nor quiet',
          'The empty space between the stars',
        ],
      },
    ],
    glossary: [
      {
        word: 'vibration',
        definition: 'A quick, repeated movement to and fro.',
        pages: [1, 3, 6],
      },
      {
        word: 'medium',
        definition: 'A material that a sound wave travels through.',
        pages: [2],
      },
      {
        word: 'vacuum',
        definition: 'A space with no particles in it.',
        pages: [2],
      },
      {
        word: 'pitch',
        definition: 'How high or low a sound is; it depends on frequency.',
        pages: [3],
      },
      {
        word: 'amplitude',
        definition: 'The size of a vibration; it sets the loudness.',
        pages: [3],
      },
      {
        word: 'decibels',
        definition: 'The unit used to measure loudness (dB).',
        pages: [4],
      },
      {
        word: 'noise',
        definition: 'Sound that is unwanted or harmful.',
        pages: [4, 5],
      },
    ],
    culturalNotes: [
      'BECE link: sound energy; how sound is produced and travels; pitch and loudness; noise pollution and its effects.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: noise limits are those in Ghana Standard GS 1222:2018, enforced by the Environmental Protection Agency. The atumpan is the Akan talking drum. Ghanaian Sign Language is the language of the Deaf community in Ghana; speak of deaf people with respect and avoid pity.',
    ],
    reviewQuestions: [
      'Recheck the noise limits against the current Ghana Standard before each school year.',
      'Invite a teacher from a school for the deaf, or a Deaf adult, to review Page 6.',
    ],
    guide: {
      overview:
        'Teaches how sound is made and carried, pitch and loudness, Ghana’s noise limits, hearing protection, and respect for Deaf experience.',
      lessonMinutes: 45,
      goals: [
        'State that sound is produced by vibration and needs a medium.',
        'Relate pitch to frequency and loudness to amplitude.',
        'Quote the noise limits for areas where people live.',
        'Describe how loud sound damages hearing and how to prevent it.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: energy: sound; noise pollution; codes to verify)', 'Production, transmission, pitch, and loudness of sound'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Speed, distance, and time; comparing quantities'],
      ],
      before: ['Learners place fingers on their throats and hum. Ask: what do you feel, and what does it tell you about sound?'],
      during: ['After Page 3, stretch a rubber band over a box and pluck it tight, then slack. Compare the pitch.'],
      after: ['In groups, write a polite notice asking a noisy neighbour to keep within the legal limit, quoting the figures.'],
      discussion: ['Who should act when a loudspeaker breaks the night limit: neighbours, the assembly, or the owner? Give reasons.'],
      reflection: ['How loud is your own day? Name the loudest moment and what you could do about it.'],
      maths: [
        {
          task: 'You see lightning and hear the thunder 3 seconds later. Sound travels at 340 m/s. How far away was the lightning?',
          answer: '340 × 3 = 1,020 m, about 1 km.',
        },
        {
          task: 'You clap in front of a tall wall and hear the echo 2 seconds later. How far away is the wall?',
          answer: 'The sound travels there and back: 340 × 2 ÷ 2 = 340 m.',
        },
      ],
      support: ['Let learners feel vibrations on a drum, a ruler twanged on a desk, and a phone on vibrate before reading.'],
      stretch: ['Find out how a hearing aid works and how it differs from a cochlear implant.'],
      localise: ['Learn five signs in Ghanaian Sign Language, or record the noisiest times of day around your school.'],
      factCheck: [
        {
          claim: 'Ghana Standard GS 1222:2018 noise limits (55 dB day / 48 dB night residential; 65 dB day / 60 dB night entertainment) and speeds of sound.',
          explanation: 'Noise limits (55 dB day and 48 dB night where people live; 65 dB and 60 dB for churches, mosques, and places of entertainment; night is 10 pm to 6 am) checked in November 2026. Speeds of sound, typical decibel values, and the account of hair cells should be confirmed by a science reviewer.',
          reference: 'Ghana Standards Authority GS 1222:2018 / EPA Ghana / NaCCA Integrated Science curriculum (codes to verify)',
        },
      ],
    },
  }),
];

