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
 * Batch 42 (8 stand-alone science articles): "Physics in Our World" series, set 3 (electricity and the atom), for JHS (Basic 7 to Basic 9).
 * Each article is tied to a BECE Integrated Science topic (see the first cultural note and the teacher guide).
 * These are science articles, not stories: there are no characters, so `characters` is empty and one narrator reads throughout.
 * Original text written for Ghanaian learners; facts updated to November 2026 (see each factCheck note).
 */

export const BATCH_42_STORIES: PilotStory[] = [
  // 1
  mk({
    key: 'the-fish-that-is-a-battery',
    title: 'The Fish That Is a Battery',
    summary:
      'Three torch batteries in a row and an electric eel work in the same way. This article explains cells, voltage, current, and circuits, and tells how a fish helped Alessandro Volta invent the battery.',
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
    paceWord: 'Lively, clear, and curious',
    palette: ['#ca8a04', '#0f766e'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Bouncy xylophone with a light river-like shaker (placeholder)',
    pages: [
      pg(
        '🔦',
        'Open the back of a torch and you will find the batteries lying end to end, the top of one touching the bottom of the next. Each one is an electric cell, and each gives a push of 1.5 volts. Lined up like this, three cells push together with 4.5 volts, enough to light the bulb brightly. Joining cells end to end is called connecting them in series. People worked out this trick about two hundred years ago. A fish in the rivers of South America has been using it for millions of years.',
        'An open torch showing three batteries lying end to end, with the bulb glowing.'
      ),
      pg(
        '⚡',
        'Two words describe electricity in a wire. Voltage is the push that drives electric charge along, and it is measured in volts (V). Current is the flow of that charge, and it is measured in amperes (A). Nothing flows unless there is a complete loop from one end of the cell, through the wire and the bulb, and back to the other end. That loop is called a circuit. Break it anywhere, as a switch does, and the current stops at once. Adding more cells in series adds their voltages together, so the push is bigger and the current is larger.',
        'A simple circuit drawn with one cell, a switch, and a bulb joined in a loop by wires.'
      ),
      pg(
        '🐟',
        'The electric eel can grow longer than a tall man. In spite of its name, it is not a true eel. It belongs to a group called knifefish. Most of its long body is filled with thousands of flat cells, stacked like coins in a roll. Each one produces only about 0.15 volts. But they are joined in series, and 5,000 of them firing together give about 750 volts. In 2019, scientists in Brazil measured one kind of electric eel giving 860 volts, the strongest shock recorded from any animal. The wall sockets in a Ghanaian home supply only 230 volts.',
        'A long grey-brown electric eel in dark river water, with a small diagram of flat cells stacked in a row along its body.'
      ),
      pg(
        '🎯',
        'The eel lives in muddy water and sees poorly, so it uses electricity in two ways. Weak pulses work like a torch in the dark: they help it to sense what is nearby and make hidden fish twitch. Then a burst of strong pulses stuns the prey so that the eel can swallow it. The water itself completes the circuit between the head and tail of the eel. Africa has a shocking fish too. The electric catfish lives in rivers across West Africa, including the Volta. Fishermen know it well and handle it with great care.',
        'A plump electric catfish with small eyes and whiskers resting on a sandy river bed.'
      ),
      pg(
        '🔋',
        'Electric fish puzzled scientists in Europe. In Italy, Luigi Galvani found that the legs of a dead frog kicked when metal touched them. Another Italian, Alessandro Volta, studied the electric organs of fish and saw how they were stacked. In 1800 he announced his own stack: discs of two different metals, separated by cloth soaked in salt water. It gave a steady electric current, and it was the first battery. The volt is named in his honour. Ghana’s River Volta is not. Its name comes from a Portuguese word meaning a turn or bend.',
        'A tall stack of metal discs separated by damp cloth pads, standing between glass rods on a wooden table.'
      ),
      pg(
        '💓',
        'Why does a shock make muscles jump? Because your own body runs on electricity. Nerves carry tiny electrical signals from the brain to the muscles, and these signals tell the heart when to beat. A strong current from outside swamps those signals. Muscles lock, breathing can stop, and the heart can lose its rhythm. That is how the eel stuns a fish, and it is why mains electricity can kill. Never touch a switch or a socket with wet hands. Never push metal into a socket. And never go near a wire that has fallen to the ground.',
        'A hand reaching for a wall switch, with a clear warning sign showing a water drop crossed out.'
      ),
    ],
    activities: [
      {
        id: 'fb-c1',
        type: 'comprehension',
        afterPage: 1,
        question: 'Three 1.5-volt cells are connected in series. What is the total voltage?',
        options: [
          '1.5 volts',
          '3 volts',
          '4.5 volts',
        ],
        correctIndex: 2,
      },
      {
        id: 'fb-c2',
        type: 'comprehension',
        afterPage: 2,
        question: 'What must be true before a current can flow?',
        options: [
          'There must be a complete circuit',
          'The wire must be very long',
          'The switch must be open',
        ],
        correctIndex: 0,
      },
      {
        id: 'fb-c3',
        type: 'comprehension',
        afterPage: 3,
        question: 'How does an electric eel produce such a high voltage?',
        options: [
          'It stores lightning from storms',
          'Thousands of small cells are joined in series, so their voltages add up',
          'One very large cell produces all of it',
        ],
        correctIndex: 1,
      },
      {
        id: 'fb-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A wire has fallen from a pole after a storm and lies across a path. What should you do?',
        options: [
          'Stay well away, warn other people, and tell an adult or the electricity company',
          'Move it off the path with a dry stick',
          'Step over it quickly',
        ],
        correctIndex: 0,
      },
      {
        id: 'fb-s1',
        type: 'sequencing',
        prompt: 'Put these in order, from the lowest voltage to the highest.',
        items: [
          'One flat cell inside an electric eel (about 0.15 V)',
          'One torch battery (1.5 V)',
          'Three torch batteries in series (4.5 V)',
          'A wall socket in Ghana (230 V)',
          'The strongest electric eel measured (860 V)',
        ],
      },
      {
        id: 'fb-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'circuit',
        definition: 'A complete loop that an electric current can flow around.',
        distractors: [
          'A round switch on a wall',
          'The push that drives an electric current',
        ],
      },
    ],
    glossary: [
      {
        word: 'cell',
        definition: 'A device that pushes electric charge around a circuit; several joined together make a battery.',
        pages: [1, 2],
      },
      {
        word: 'series',
        definition: 'Joined end to end, so that the voltages add together.',
        pages: [1, 2, 3],
      },
      {
        word: 'voltage',
        definition: 'The push that drives electric charge along, measured in volts.',
        pages: [2],
      },
      {
        word: 'current',
        definition: 'The flow of electric charge, measured in amperes.',
        pages: [2, 5, 6],
      },
      {
        word: 'circuit',
        definition: 'A complete loop that an electric current can flow around.',
        pages: [2, 4],
      },
      {
        word: 'battery',
        definition: 'Two or more cells joined together.',
        pages: [5],
      },
    ],
    culturalNotes: [
      'BECE link: electricity; electric cells and simple circuits; voltage and current; safe use of electricity.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: mains supply in Ghana is 230 volts. The electric catfish is found in West African rivers, including the Volta system. The River Volta was named by Portuguese traders and has no link to Alessandro Volta.',
    ],
    reviewQuestions: [
      'Check 3 × 1.5 = 4.5 and 5,000 × 0.15 = 750.',
      'Keep the three safety rules on Page 6 exactly as written.',
    ],
    guide: {
      overview:
        'Uses torch batteries and electric fish to teach cells in series, voltage, current, complete circuits, and electrical safety.',
      lessonMinutes: 45,
      goals: [
        'Explain what voltage and current are and name their units.',
        'State that a current needs a complete circuit.',
        'Calculate the total voltage of cells in series.',
        'Give three rules for staying safe near mains electricity.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: electricity and electronics: cells, circuits, voltage, and current; codes to verify)', 'Cells in series and simple circuits'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Multiplying decimals; division'],
      ],
      before: ['Open a torch in front of the class. Ask: why are the batteries placed end to end and not side by side?'],
      during: ['After Page 2, groups light a bulb with one cell, then two, then three, and describe the brightness.'],
      after: ['Learners draw a circuit with three cells, a switch, and a bulb, and mark the total voltage.'],
      discussion: ['Volta got his idea by studying a fish. What other inventions copy living things?'],
      reflection: ['Which of the safety rules is broken most often where you live?'],
      maths: [
        {
          task: 'How many 1.5-volt cells in series would you need to match the 860 volts of the strongest electric eel?',
          answer: '860 ÷ 1.5 ≈ 573, so about 574 cells.',
        },
        {
          task: 'An eel has 6,000 cells, each giving 0.15 volts. What is the greatest voltage it could produce?',
          answer: '6,000 × 0.15 = 900 volts.',
        },
      ],
      support: ['Let learners line up as “cells”, each holding a 1.5 card, and add the cards aloud.'],
      stretch: ['Find out the difference between cells joined in series and cells joined in parallel.'],
      localise: ['Ask a fisherman or fishmonger whether they know the electric catfish and what it is called in your language.'],
      factCheck: [
        {
          claim: '860-volt electric eel record (Brazil, 2019), ~0.15 V per electrocyte, West African electric catfish, Volta’s 1800 voltaic pile, and River Volta etymology.',
          explanation: 'The 860-volt record (Electrophorus voltai, measured in Brazil, reported 2019) checked in November 2026. Each cell (~0.15 V), Malapterurus electricus in the Volta system, Volta’s 1800 pile, and the Portuguese origin of River Volta are standard references.',
          reference: 'de Santana et al. (2019) Nature Communications / NaCCA Integrated Science curriculum (codes to verify)',
        },
      ],
    },
  }),

  // 2
  mk({
    key: 'a-spark-as-big-as-the-sky',
    title: 'A Spark as Big as the Sky',
    summary:
      'The crackle of a shirt pulled off in harmattan and a flash of lightning are the same thing at different sizes. This article explains static electricity, how storms make lightning, and how to stay safe.',
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
    paceWord: 'Dramatic but clear',
    palette: ['#4338ca', '#eab308'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Low rolling drums with sudden bright cymbal touches (placeholder)',
    pages: [
      pg(
        '👕',
        'In the dry days of harmattan, pull a nylon shirt over your head in a dark room. It crackles, and you may see tiny blue sparks. Run a plastic comb through dry hair, hold it over scraps of paper, and the scraps jump up to meet it. Nothing is plugged in. There is no battery. Yet electricity is at work. This kind is called static electricity, because the electric charge builds up and stays in one place until it suddenly escapes. That little spark on your shirt has a giant relative. You know it as lightning.',
        'A plastic comb held just above small scraps of paper that are jumping up towards it.'
      ),
      pg(
        '➕',
        'Everything is made of atoms, and atoms contain tiny particles called electrons, which carry a negative charge. Usually an object has no overall charge. When two different materials rub together, electrons can be scraped from one onto the other. The one that gains electrons becomes negatively charged. The one that loses them becomes positively charged. Then a simple rule takes over: opposite charges attract, and like charges repel. That is why the comb pulls on the paper. It is also why two balloons rubbed on the same cloth push each other apart.',
        'Two balloons hanging on threads and pushing apart, beside a comb and a scrap of paper pulling together.'
      ),
      pg(
        '⛈️',
        'Inside a tall storm cloud, strong winds toss ice crystals and small hailstones against each other millions of times a second. Each collision moves a little charge. Before long, the bottom of the cloud holds a huge negative charge. It repels electrons in the ground below, leaving the surface positive. Air is normally an insulator, but when the voltage grows large enough, the air breaks down and a giant spark leaps across. For an instant the air in its path is heated to about 30,000 °C, five times hotter than the surface of the Sun. The air expands with a bang. That is thunder.',
        'A dark storm cloud with minus signs along its base and plus signs on the ground below, joined by a jagged flash.'
      ),
      pg(
        '🪁',
        'In 1752, the American scientist Benjamin Franklin suspected that lightning was the same thing as the sparks in his laboratory. The story goes that he flew a kite towards a storm cloud with a metal key tied to the string. Charge ran down the wet string, and a spark jumped from the key to his knuckle. He was right, and he was lucky: others who tried similar experiments were killed. His idea led to the lightning conductor, a metal rod on top of a building joined by a thick wire to the ground. It gives lightning a safe path, away from the building.',
        'A tall building with a thin metal rod on its roof and a wire running down the wall into the ground.'
      ),
      pg(
        '🔬',
        'How big is the voltage in a storm cloud? Flying instruments into one is dangerous, so scientists at Ooty in southern India found a safer way. Their detectors count muons, tiny particles that rain down on Earth from space all the time. During a great storm in December 2014, the number of muons arriving changed, because the cloud’s electric field had changed their energy as they passed through. From this, the team worked out the voltage inside the cloud: about 1.3 billion volts. They measured the storm without touching or disturbing it.',
        'A wide field of flat particle detectors on a hilltop under a towering storm cloud.'
      ),
      pg(
        '🏃',
        'Every rainy season, lightning kills people in Ghana, often on farms, on football pitches, and under trees. Follow these rules. When you hear thunder, go indoors or into a vehicle with a metal roof, and stay there until 30 minutes after the last thunder. Never shelter under a lone tree, because lightning tends to strike the tallest thing around. Leave open fields, hilltops, rivers, and the sea. Indoors, keep away from taps and from anything plugged into a socket. If a person is struck, it is safe to touch them. Call for help and start first aid.',
        'Farmers walking quickly from an open field towards a house as dark clouds gather behind them.'
      ),
    ],
    activities: [
      {
        id: 'sk-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What happens when two different materials are rubbed together?',
        options: [
          'New electrons are created',
          'Electrons can move from one material to the other',
          'Both materials become magnets',
        ],
        correctIndex: 1,
      },
      {
        id: 'sk-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What causes thunder?',
        options: [
          'Two clouds knocking together',
          'Rain hitting the ground',
          'Air heated by the lightning expanding suddenly',
        ],
        correctIndex: 2,
      },
      {
        id: 'sk-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why was the method used at Ooty better than flying a kite into a storm?',
        options: [
          'It was safer and did not disturb the storm being studied',
          'It was cheaper than a kite',
          'It stopped the lightning',
        ],
        correctIndex: 0,
      },
      {
        id: 'sk-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: You are playing football on an open pitch when you hear thunder. A large mango tree stands nearby. What should you do?',
        options: [
          'Shelter under the mango tree',
          'Leave the pitch and go into a building, not under the tree',
          'Lie flat in the middle of the pitch and keep playing later',
        ],
        correctIndex: 1,
      },
      {
        id: 'sk-s1',
        type: 'sequencing',
        prompt: 'Put the steps that lead to a flash of lightning in order.',
        items: [
          'Ice crystals and hailstones collide inside the cloud',
          'A large negative charge gathers at the bottom of the cloud',
          'The ground below becomes positively charged',
          'The air breaks down and a giant spark jumps',
          'Heated air expands and makes thunder',
        ],
      },
      {
        id: 'sk-voc',
        type: 'vocabulary',
        afterPage: 1,
        word: 'static',
        definition: 'Static electricity: electric charge that builds up in one place until it suddenly escapes.',
        distractors: [
          'Electricity that flows steadily round a circuit',
          'Electricity made by a battery',
        ],
      },
    ],
    glossary: [
      {
        word: 'static',
        definition: 'Static electricity: electric charge that builds up in one place until it suddenly escapes.',
        pages: [1],
      },
      {
        word: 'charge',
        definition: 'A property of matter that can be positive or negative.',
        pages: [1, 2, 3],
      },
      {
        word: 'electrons',
        definition: 'Tiny particles in atoms that carry a negative charge.',
        pages: [2, 3],
      },
      {
        word: 'attract',
        definition: 'To pull towards.',
        pages: [2],
      },
      {
        word: 'repel',
        definition: 'To push away.',
        pages: [2],
      },
      {
        word: 'conductor',
        definition: 'Lightning conductor: a metal rod on a building, joined to the ground, that gives lightning a safe path.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'BECE link: electricity (static charges; conductors and insulators); weather hazards and personal safety.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: static sparks are easiest to see in the dry harmattan months. Lightning deaths are reported in Ghana in most rainy seasons, especially among farmers and footballers in open fields.',
    ],
    reviewQuestions: [
      'Ask the district office of the National Disaster Management Organisation or the Ghana Meteorological Agency to confirm the safety rules on Page 6.',
      'Do not let learners copy the kite experiment; say so plainly in class.',
    ],
    guide: {
      overview:
        'Builds from everyday static sparks to the physics of lightning, then gives clear safety rules for the rainy season.',
      lessonMinutes: 45,
      goals: [
        'Explain charging by rubbing in terms of electrons.',
        'State that like charges repel and opposite charges attract.',
        'Describe how a storm cloud produces lightning and thunder.',
        'List the rules for staying safe in a thunderstorm.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: electricity: static charges, conductors, and insulators; codes to verify)', 'Static electricity and lightning'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Speed, distance, and time; large numbers'],
      ],
      before: ['Rub a plastic pen on dry hair or cloth and pick up scraps of paper. Ask learners to explain what they see.'],
      during: ['After Page 3, learners draw a storm cloud and mark where the positive and negative charges are.'],
      after: ['Groups make a rainy-season safety poster for the school notice board.'],
      discussion: ['Franklin’s experiment could have killed him. Should scientists ever take such risks? Give reasons.'],
      reflection: ['Where would you go if a storm began on your way home from school?'],
      maths: [
        {
          task: 'You see lightning and hear thunder 6 seconds later. Sound travels at 340 m/s. How far away was the flash?',
          answer: '340 × 6 = 2,040 m, about 2 km.',
        },
        {
          task: 'Lightning heats air to 30,000 °C. The surface of the Sun is about 6,000 °C. How many times hotter is the lightning?',
          answer: '30,000 ÷ 6,000 = 5 times.',
        },
      ],
      support: ['Use plus and minus cards that learners hold and move to act out attraction and repulsion.'],
      stretch: ['Find out why you are safe inside a car during a thunderstorm even though the car is made of metal.'],
      localise: ['Find out whether your school, church, or mosque has a lightning conductor, and look for the wire running to the ground.'],
      factCheck: [
        {
          claim: '1 December 2014 Ooty thundercloud measurement (~1.3 billion volts), ~30,000 °C lightning channel temperature, and thunderstorm safety rules.',
          explanation: 'The GRAPES-3 muon measurement at Ooty (~1.3 GV, published 2019) and standard 30-minute thunderstorm safety guidance are established meteorology and physics.',
          reference: 'Hariharan et al. (2019) Physical Review Letters / Ghana Meteorological Agency safety guidance',
        },
      ],
    },
  }),

  // 3
  mk({
    key: 'from-a-switch-to-a-thinking-machine',
    title: 'From a Switch to a Thinking Machine',
    summary:
      'A wall switch and a mobile phone are built on the same idea: on and off. This article explains switches, transistors, and automatic circuits, and asks what artificial intelligence can and cannot do.',
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
    paceWord: 'Clear, modern, and thoughtful',
    palette: ['#2563eb', '#16a34a'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Light electronic pulse with soft hand drums (placeholder)',
    pages: [
      pg(
        '📱',
        'A trader at Makola sells a bag of rice and is paid by mobile money. She taps her phone a few times, and within seconds the money has moved. She does not stop to wonder how. Inside that phone are billions of tiny electric circuits, switching on and off faster than anyone can imagine. Yet every one of them follows the same rule as the light switch on a classroom wall. To understand a phone, a computer, or the machines people now call artificial intelligence, begin with the simplest part of any circuit: a switch.',
        'A market trader holding a mobile phone beside sacks of rice, with a customer’s phone held next to hers.'
      ),
      pg(
        '💡',
        'An electric current flows only round a complete circuit. A switch is a gap in the circuit that you can close or open. Close it, and the current flows and the lamp lights: that is ON. Open it, and the current stops: that is OFF. With several switches you can make simple decisions. Put two switches in series, one after the other, and the lamp lights only if the first AND the second are closed. Put them in parallel, side by side, and it lights if one OR the other is closed. Circuits that decide like this are called logic circuits.',
        'Two circuit drawings: one with two switches in a single line, and one with two switches on side-by-side branches.'
      ),
      pg(
        '🔘',
        'The first computers, built in the 1940s, used glass tubes called valves as their switches. Valves were as big as light bulbs, became very hot, and often burned out. One early computer had about 18,000 of them and filled a large room. Then, in 1947, scientists in America invented the transistor: a switch with no moving parts, made from a material called a semiconductor and worked by a small electric signal. Transistors could be made smaller and smaller. The chip in a modern phone is the size of a fingernail and holds more than ten billion of them.',
        'A large glass valve standing beside a tiny black chip resting on a fingertip.'
      ),
      pg(
        '🌙',
        'Add a sensor to a transistor and a circuit can act without a person. Many street lights have a part whose resistance changes when light falls on it. As darkness comes, the change switches a transistor, and the lamp comes on by itself. At dawn it goes off. The same idea closes a water pump when the tank is full, sounds an alarm when there is smoke, and opens a shop door as you walk up. This is automation: machines following fixed rules that people have built in. An automatic street light is useful, but nobody would say that it thinks.',
        'A street light switching on by itself at dusk above a quiet road.'
      ),
      pg(
        '🤖',
        'Artificial intelligence, or AI, goes a step further. Its rules are not all written in by hand. The program is shown a huge number of examples and adjusts itself until it finds the patterns in them. That is how a phone turns speech into text, and how programs now answer questions, write essays, and translate between languages, including Twi, Ewe, and Ga. Farmers use AI apps that recognise crop diseases from a photograph of a leaf. Driverless taxis already carry passengers in a few cities abroad. All of it still runs on transistors switching ON and OFF.',
        'A farmer holding a phone over a cassava leaf with pale patches, the leaf showing on the phone screen.'
      ),
      pg(
        '⚖️',
        'Is AI a friend or a danger? It can help doctors to read X-rays, teachers to explain, and small businesses to keep their accounts. It can also give wrong answers that sound confident, copy unfairness from the examples it learned from, produce false pictures and voices, and replace some jobs. Scientists disagree about whether machines will ever truly think, and about how risky stronger AI may become. So treat it as a tool. Check what it tells you against a trusted source. Do your own learning first. And remember that people built it, and people must decide how it is used.',
        'A student at a desk with a phone in one hand and an open textbook in the other, comparing the two.'
      ),
    ],
    activities: [
      {
        id: 'sw-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Two switches are connected in series with a lamp. When does the lamp light?',
        options: [
          'Only when both switches are closed',
          'When either switch is closed',
          'When both switches are open',
        ],
        correctIndex: 0,
      },
      {
        id: 'sw-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why did transistors replace valves?',
        options: [
          'Valves were too small to see',
          'Transistors are smaller, cooler, and more reliable',
          'Transistors need no electricity',
        ],
        correctIndex: 1,
      },
      {
        id: 'sw-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What makes an automatic street light come on at dusk?',
        options: [
          'A person in an office presses a switch',
          'A clock inside the lamp',
          'A sensor that responds to the fading light and switches a transistor',
        ],
        correctIndex: 2,
      },
      {
        id: 'sw-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: An AI program gives you an answer for your science homework. What is the wisest thing to do?',
        options: [
          'Copy it at once, because AI is always correct',
          'Check it against your textbook or ask your teacher before you use it',
          'Ignore it, because AI is always wrong',
        ],
        correctIndex: 1,
      },
      {
        id: 'sw-s1',
        type: 'sequencing',
        prompt: 'Put these steps in the history of computing in order.',
        items: [
          'Computers are built with glass valves and fill whole rooms',
          'The transistor is invented',
          'Billions of transistors are packed onto a chip the size of a fingernail',
          'Mobile phones carry a powerful computer in the pocket',
          'AI programs answer questions and translate languages',
        ],
      },
      {
        id: 'sw-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'transistor',
        definition: 'A tiny switch with no moving parts, worked by a small electric signal.',
        distractors: [
          'A glass tube that glows when it is hot',
          'A wire that carries current to a lamp',
        ],
      },
    ],
    glossary: [
      {
        word: 'circuit',
        definition: 'A complete loop that an electric current can flow around.',
        pages: [1, 2, 4],
      },
      {
        word: 'switch',
        definition: 'A part that opens or closes a gap in a circuit.',
        pages: [1, 2, 3],
      },
      {
        word: 'transistor',
        definition: 'A tiny switch with no moving parts, worked by a small electric signal.',
        pages: [3, 4],
      },
      {
        word: 'semiconductor',
        definition: 'A material, such as silicon, that can be made to conduct or to block electric current.',
        pages: [3],
      },
      {
        word: 'sensor',
        definition: 'A part that responds to light, heat, sound, or movement.',
        pages: [4],
      },
      {
        word: 'automation',
        definition: 'The use of machines that follow built-in rules without a person controlling each step.',
        pages: [4],
      },
      {
        word: 'intelligence',
        definition: 'Artificial intelligence: computer programs that learn patterns from many examples and use them to do tasks.',
        pages: [1, 5],
      },
    ],
    culturalNotes: [
      'BECE link: basic electronics (switches, transistors, and simple automatic circuits); science, technology, and society.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: mobile money is used daily in Ghanaian markets. Translation tools and crop-disease apps for Ghanaian languages and crops exist and are improving; name current local examples when teaching.',
    ],
    reviewQuestions: [
      'This topic changes quickly: review Pages 5 and 6 every year.',
      'Check the school’s own rules on using AI for homework and match Page 6 to them.',
    ],
    guide: {
      overview:
        'Follows one idea, the switch, from a classroom lamp to transistors, automatic circuits, and artificial intelligence, with a balanced look at benefits and risks.',
      lessonMinutes: 45,
      goals: [
        'Explain what a switch does in a circuit.',
        'Describe AND and OR arrangements of two switches.',
        'State what a transistor is and why it matters.',
        'Distinguish automation from artificial intelligence and discuss benefits and risks.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: electricity and electronics: switches, transistors, and simple electronic circuits; codes to verify)', 'Switching, logic, and automation'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Powers of two; very large numbers'],
      ],
      before: ['Ask: how many switches do you think are inside a mobile phone? Record the guesses, then read Page 3.'],
      during: ['After Page 2, build or draw the AND and OR circuits and fill in a table of ON and OFF.'],
      after: ['Hold a short debate: “AI will do more good than harm in Ghana.”'],
      discussion: ['The street light and the AI program both act without a person. What is the real difference between them?'],
      reflection: ['When is it fair to use AI in schoolwork, and when is it cheating?'],
      maths: [
        {
          task: 'One switch has 2 states (ON or OFF). Two switches together have 4. Three have 8. How many states do 5 switches have?',
          answer: '2 × 2 × 2 × 2 × 2 = 32.',
        },
        {
          task: 'An early computer had 18,000 valves. A phone chip has 18,000,000,000 transistors. How many times more switches does the chip have?',
          answer: '18,000,000,000 ÷ 18,000 = 1,000,000 times.',
        },
      ],
      support: ['Act out AND and OR with two learners as “switches” standing in a doorway.'],
      stretch: ['Find out how a computer writes numbers using only 1 and 0, and write the numbers 1 to 8 in that way.'],
      localise: ['List three ways AI is already used in your community, and one worry people have about it.'],
      factCheck: [
        {
          claim: '1940s valve computers (~18,000 tubes), 1947 invention of the transistor, >10 billion transistors in a modern phone chip, and 2026 AI capabilities.',
          explanation: 'ENIAC (~18,000 vacuum tubes), Bell Labs’ 1947 transistor, >10 billion transistors on modern smartphone SoCs, and current Ghanaian NLP / crop-diagnosis AI tools are accurate as of November 2026.',
          reference: 'Computer History Museum / NaCCA Integrated Science & Computing curriculum (codes to verify)',
        },
      ],
    },
  }),

  // 4
  mk({
    key: 'how-a-guitar-makes-electricity',
    title: 'How a Guitar Makes Electricity',
    summary:
      'An electric guitar is silent until its strings make a current. This article explains how a moving magnet produces electricity, why the strings must be steel, and how the same idea lights Ghana from Akosombo.',
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
    paceWord: 'Musical, warm, and clear',
    palette: ['#b91c1c', '#0369a1'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Bright highlife lead guitar over a soft bass line (placeholder)',
    pages: [
      pg(
        '🎸',
        'At a Saturday programme, a highlife band is setting up. The guitarist picks a string before the instrument is plugged in. You can hardly hear it. An electric guitar has a solid body with no hollow box to make its sound louder. Then a cable is pushed into the amplifier, the same string is picked, and a clear note rings across the whole park. The string is not louder. Something has turned its tiny movement into electricity, and the electricity has been turned back into sound. That something is a magnet wrapped in wire, and it never touches the string.',
        'A guitarist on a small outdoor stage plugging a cable into an electric guitar, with a speaker box beside him.'
      ),
      pg(
        '🧲',
        'The story begins in London in 1831. Michael Faraday pushed a magnet into a coil of wire and saw the needle of his meter flick. An electric current had flowed, although there was no battery. When he held the magnet still, nothing happened. When he pulled it out, the needle flicked the other way. Faraday had found a rule of nature: whenever the magnetic field through a coil changes, a voltage is produced in the coil. If the coil is part of a complete circuit, a current flows. This effect is called electromagnetic induction.',
        'A bar magnet being pushed into a coil of wire that is joined to a meter with a swinging needle.'
      ),
      pg(
        '🎼',
        'Look under the strings of an electric guitar and you will see a small bar called a pickup. Inside it are magnets with thousands of turns of fine copper wire wound round them. The strings are made of steel, a magnetic metal, so the part of each string above the pickup becomes a weak magnet itself. When the string vibrates, this little magnet moves to and fro above the coil. The magnetic field through the coil keeps changing, so a small current flows in the wire. The current rises and falls in exactly the same pattern as the string moves.',
        'A close view of steel guitar strings passing over a pickup bar with a row of round metal poles.'
      ),
      pg(
        '🔊',
        'That current is far too small to drive a speaker. It first goes to an amplifier, which uses transistors and mains electricity to make a much larger copy. The big current then flows through a coil fixed to the paper cone of a loudspeaker. The coil sits beside a magnet, and the changing current makes it push and pull against the magnet. The cone moves with it, shakes the air, and you hear the note. Follow the energy: movement of the string, to electrical energy, to movement of the cone, to sound. Nylon strings would not work, because nylon is not magnetic.',
        'A chain of pictures joined by arrows: a vibrating string, a pickup, an amplifier box, and a loudspeaker cone.'
      ),
      pg(
        '🌊',
        'Now make everything bigger. At Akosombo, water from Lake Volta rushes down wide pipes and spins a turbine, a wheel with curved blades. The turbine turns a shaft, and on the shaft are powerful magnets surrounded by huge coils of copper wire. As the magnets spin, the magnetic field through the coils keeps changing, and a large current flows. This machine is a generator. Akosombo has six of them. A guitar pickup and a power station follow the same rule that Faraday found. One is driven by a fingertip and the other by a river.',
        'A cut-away view of a dam with water flowing down a pipe to spin a turbine joined to a large generator.'
      ),
      pg(
        '🚲',
        'Once you know the rule, you will find it everywhere. A bicycle dynamo presses a small wheel against the tyre, and as you ride it spins a magnet inside a coil to light the lamp. A microphone has a coil that moves near a magnet when your voice shakes it. A petrol generator outside a shop spins its magnets with an engine. Wind turbines use the wind, and the stations at Aboadze use steam and hot gas. Almost all the electricity people use is made by moving magnets and coils past each other. Without Faraday’s discovery, the world would be very dark.',
        'A bicycle with a small dynamo pressed against its tyre and its front lamp shining on a dark road.'
      ),
    ],
    activities: [
      {
        id: 'gt-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What did Faraday discover in 1831?',
        options: [
          'A battery is needed to make any current',
          'A changing magnetic field through a coil produces a voltage',
          'Magnets lose their strength in coils',
        ],
        correctIndex: 1,
      },
      {
        id: 'gt-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why must the strings of an electric guitar be made of steel?',
        options: [
          'Steel is a magnetic metal, so the string becomes a small magnet',
          'Steel is lighter than nylon',
          'Steel strings never break',
        ],
        correctIndex: 0,
      },
      {
        id: 'gt-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'What does the turbine do in a hydroelectric power station?',
        options: [
          'It stores the water',
          'It cools the generator',
          'It is spun by water and turns the magnets of the generator',
        ],
        correctIndex: 2,
      },
      {
        id: 'gt-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A learner holds a strong magnet perfectly still inside a coil joined to a meter. What will the meter show, and why?',
        options: [
          'A large steady current, because the magnet is strong',
          'No current, because the magnetic field through the coil is not changing',
          'A current that grows slowly with time',
        ],
        correctIndex: 1,
      },
      {
        id: 'gt-s1',
        type: 'sequencing',
        prompt: 'Follow one note from finger to ear. Put the steps in order.',
        items: [
          'A finger picks the steel string and it vibrates',
          'The moving string changes the magnetic field through the pickup coil',
          'A small current flows in the coil',
          'The amplifier makes a larger copy of the current',
          'The loudspeaker cone moves and sends out sound',
        ],
      },
      {
        id: 'gt-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'induction',
        definition: 'Electromagnetic induction: the production of a voltage in a coil when the magnetic field through it changes.',
        distractors: [
          'The pulling of iron towards a magnet',
          'The heating of a wire by a current',
        ],
      },
    ],
    glossary: [
      {
        word: 'amplifier',
        definition: 'A device that makes a larger copy of a small electrical signal.',
        pages: [1, 4],
      },
      {
        word: 'magnetic',
        definition: 'Magnetic field: the region around a magnet where its force can be felt.',
        pages: [2, 3, 4, 5],
      },
      {
        word: 'coil',
        definition: 'Wire wound into many turns.',
        pages: [2, 3, 4, 6],
      },
      {
        word: 'induction',
        definition: 'Electromagnetic induction: the production of a voltage in a coil when the magnetic field through it changes.',
        pages: [2],
      },
      {
        word: 'pickup',
        definition: 'The part of an electric guitar, made of magnets and coils, that turns string movement into electric current.',
        pages: [3, 5],
      },
      {
        word: 'turbine',
        definition: 'A wheel with blades that is spun by moving water, steam, gas, or wind.',
        pages: [5],
      },
      {
        word: 'generator',
        definition: 'A machine that produces electricity by turning magnets and coils past each other.',
        pages: [5, 6],
      },
    ],
    culturalNotes: [
      'BECE link: magnetism and electricity; electromagnetism; forms of energy and energy conversion; generation of electricity.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: electric lead and bass guitars are central to highlife and church music. The Akosombo Dam on the Volta has six generating units; Aboadze, near Takoradi, has thermal power stations.',
    ],
    reviewQuestions: [
      'Check that the energy chain on Page 4 matches the sequencing activity.',
      'Confirm the description of the Akosombo generators with a science reviewer.',
    ],
    guide: {
      overview:
        'Explains electromagnetic induction through an electric guitar pickup, then scales the idea up to the generators that supply Ghana.',
      lessonMinutes: 45,
      goals: [
        'State that a changing magnetic field through a coil produces a voltage.',
        'Explain how a guitar pickup works and why steel strings are needed.',
        'Describe the energy changes from string to sound.',
        'Explain how a generator in a power station produces electricity.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: energy: electricity and magnetism; conversion and generation of energy; codes to verify)', 'Electromagnetic induction and generators'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Multiplication and division; rates'],
      ],
      before: ['Play a short clip of guitar highlife or ask a learner who plays to describe the instrument. Ask: where does the sound come from?'],
      during: ['After Page 2, move a magnet in and out of a coil joined to a meter or a small LED, if the school has them.'],
      after: ['Learners draw the energy chain for the guitar and another for Akosombo, and compare them.'],
      discussion: ['A pickup and a power station use the same rule. What does that tell you about how science works?'],
      reflection: ['Which machine near your home makes electricity by moving a magnet?'],
      maths: [
        {
          task: 'A guitar string vibrates 110 times each second. How many times does it vibrate in one minute?',
          answer: '110 × 60 = 6,600 times.',
        },
        {
          task: 'Akosombo can supply 1,020 megawatts from six equal generators. How much does each one supply?',
          answer: '1,020 ÷ 6 = 170 megawatts.',
        },
      ],
      support: ['Give learners four picture cards (string, pickup, amplifier, speaker) to put in order while listening.'],
      stretch: ['Find out why a generator needs the magnet or the coil to keep moving, and what would happen if both moved together.'],
      localise: ['Visit or ask about a church or band sound system. Identify the pickup or microphone, the amplifier, and the speakers.'],
      factCheck: [
        {
          claim: 'Faraday’s 1831 discovery of induction, guitar pickup and speaker mechanics, and Akosombo’s six generating units (1,020 MW installed capacity).',
          explanation: 'Faraday’s 1831 experiments, magnetic pickup physics, and Volta River Authority figures for Akosombo (6 × 170 MW = 1,020 MW) and Aboadze thermal plant are verified.',
          reference: 'Volta River Authority (VRA) / NaCCA Integrated Science curriculum (codes to verify)',
        },
      ],
    },
  }),

  // 5
  mk({
    key: 'electricity-that-makes-things-move',
    title: 'Electricity That Makes Things Move',
    summary:
      'The corn mill, the ceiling fan, and the vibrating phone all hide the same machine. This article explains how an electric motor turns current and magnetism into movement, and how motors serve homes, farms, and hospitals.',
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
    paceWord: 'Energetic, clear, and practical',
    palette: ['#ea580c', '#475569'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Steady, driving kpanlogo-style rhythm (placeholder)',
    pages: [
      pg(
        '🌽',
        'Early in the morning, people line up at the corn mill with bowls of soaked maize. The miller presses a button. With a rising hum, a heavy machine begins to spin and the grinding plates start to turn. Nobody is pushing them. No animal is pulling. Electricity flows in through a cable, and movement comes out. The machine that does this is an electric motor. There is one in every fan, fridge, blender, water pump, and sewing machine, and a tiny one makes your phone vibrate. How can electricity make something turn?',
        'A corn mill in a small shed, with customers holding bowls of maize waiting in a line.'
      ),
      pg(
        '🧭',
        'The first clue came by accident in 1820. A Danish teacher, Hans Christian Oersted, was showing his students an electric circuit. A compass happened to be lying near the wire. Each time he switched the current on, the compass needle swung away from north. When he switched off, it swung back. A compass needle moves only when a magnet is near, so the wire must have been acting as a magnet. Oersted had shown that an electric current produces a magnetic field around it. Electricity and magnetism, which everyone had thought were separate, were connected.',
        'A compass lying under a wire that is joined to a battery, with its needle turned away from north.'
      ),
      pg(
        '🔩',
        'You can use this at once. Wind insulated wire many times round an iron nail and join the ends to a battery. The nail picks up pins. Disconnect the battery and the pins fall. You have made an electromagnet: a magnet that can be switched on and off. More turns of wire or a larger current make it stronger. Scrap yards use giant electromagnets to lift old cars and drop them again. An electric bell uses a small one to pull its hammer. Every electric motor has electromagnets inside it.',
        'An iron nail wound with wire and joined to a battery, with pins hanging from its tip.'
      ),
      pg(
        '🔄',
        'Now put a coil of wire between the poles of a magnet and pass a current through it. The coil becomes an electromagnet, and the fixed magnet pushes one side of it up and the other side down, so the coil turns. Just as it is about to stop, a clever sliding contact reverses the current. The push changes direction and the coil keeps turning, round and round. Fix the coil to a shaft and the shaft will spin a fan blade, a pump, or a grinding plate. A motor turns electrical energy into kinetic energy, the energy of movement.',
        'A coil of wire on a shaft between the two poles of a magnet, with curved arrows showing it turning.'
      ),
      pg(
        '🏥',
        'Motors do far more than save effort. A motor-driven pump lifts clean water from a borehole. In hospitals, motors pump blood through dialysis machines for people whose kidneys have failed, and they drive the tools that surgeons control from a screen. Small motors inside modern artificial hands let a person who has lost a hand grip a cup or hold a pen. On the roads, electric motorcycles, tricycles, and cars are beginning to appear in Ghana’s cities. They are quiet, and they give out no exhaust smoke, because a motor burns no fuel.',
        'An artificial hand with jointed fingers gently holding a cup.'
      ),
      pg(
        '♻️',
        'A motor and a generator are the same machine run in opposite directions. Feed in electricity and you get movement: a motor. Turn the shaft by force and you get electricity: a generator. No motor is perfect. Some of the electrical energy is always wasted as heat and sound, which is why a motor feels warm after use. Look after motors and they last. Keep them clean and dry, do not overload them, and switch off when the work is done. Next time the mill begins to hum, you will know that a current and a magnet are doing the work.',
        'Two matching diagrams: one with electricity going in and a spinning shaft coming out, the other with a shaft being turned and electricity coming out.'
      ),
    ],
    activities: [
      {
        id: 'mt-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What did Oersted’s experiment show?',
        options: [
          'A compass always points north',
          'An electric current produces a magnetic field',
          'Magnets produce light',
        ],
        correctIndex: 1,
      },
      {
        id: 'mt-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'How can you make an electromagnet stronger?',
        options: [
          'Use more turns of wire or a larger current',
          'Use a wooden nail',
          'Remove the battery',
        ],
        correctIndex: 0,
      },
      {
        id: 'mt-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What energy change takes place in an electric motor?',
        options: [
          'Kinetic energy to electrical energy',
          'Heat energy to light energy',
          'Electrical energy to kinetic energy',
        ],
        correctIndex: 2,
      },
      {
        id: 'mt-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: After grinding for an hour, the casing of a mill motor feels warm. What is the best explanation?',
        options: [
          'The maize heats the motor',
          'Some of the electrical energy is wasted as heat',
          'The motor has stopped using electricity',
        ],
        correctIndex: 1,
      },
      {
        id: 'mt-s1',
        type: 'sequencing',
        prompt: 'Put these steps in order to explain how a motor turns.',
        items: [
          'A current is passed through the coil',
          'The coil becomes an electromagnet',
          'The fixed magnet pushes the two sides of the coil in opposite directions',
          'The coil turns',
          'The current is reversed so the coil keeps turning',
        ],
      },
      {
        id: 'mt-voc',
        type: 'vocabulary',
        afterPage: 3,
        word: 'electromagnet',
        definition: 'A magnet made by passing a current through a coil of wire; it can be switched on and off.',
        distractors: [
          'A magnet that never loses its strength',
          'A battery with a magnet inside it',
        ],
      },
    ],
    glossary: [
      {
        word: 'motor',
        definition: 'A machine that turns electrical energy into movement.',
        pages: [1, 3, 4, 5, 6],
      },
      {
        word: 'magnetic',
        definition: 'Magnetic field: the region around a magnet where its force can be felt.',
        pages: [2],
      },
      {
        word: 'electromagnet',
        definition: 'A magnet made by passing a current through a coil of wire.',
        pages: [3, 4],
      },
      {
        word: 'coil',
        definition: 'Wire wound into many turns.',
        pages: [4],
      },
      {
        word: 'kinetic',
        definition: 'Kinetic energy: the energy of movement.',
        pages: [4],
      },
      {
        word: 'generator',
        definition: 'A machine that produces electricity when its shaft is turned.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'BECE link: magnetism and electricity; electromagnets and their uses; conversion of energy.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: electric corn mills, borehole pumps, and sewing machines are familiar uses of motors. Electric motorcycles and tricycles are on sale in Ghana, though still few.',
    ],
    reviewQuestions: [
      'Supervise the electromagnet activity: use only torch batteries, never mains electricity.',
      'Check the direction of the energy change in Question 3 against Page 4.',
    ],
    guide: {
      overview:
        'Traces the electric motor from Oersted’s compass to the electromagnet and the spinning coil, with uses in Ghanaian homes, farms, and hospitals.',
      lessonMinutes: 45,
      goals: [
        'State that an electric current produces a magnetic field.',
        'Make and describe an electromagnet.',
        'Explain in simple terms why the coil of a motor turns.',
        'Give uses of motors and state the energy change they make.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: energy: electricity and magnetism; electromagnets; conversion of energy; codes to verify)', 'Electromagnets and the electric motor'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Percentages; energy and power calculations'],
      ],
      before: ['Ask learners to list every machine with moving parts that plugs into a socket. How many are there?'],
      during: ['After Page 3, groups make an electromagnet and count how many pins it lifts with 10, 20, and 30 turns.'],
      after: ['Learners draw a table: machine, what the motor moves, and what was used before motors.'],
      discussion: ['How was maize ground before electric mills? What has been gained, and has anything been lost?'],
      reflection: ['Which motor would you miss most if the power went off for a week?'],
      maths: [
        {
          task: 'A motor takes in 500 joules of electrical energy and gives out 400 joules of movement. How much is wasted, and what percentage is useful?',
          answer: '100 joules wasted; 400 ÷ 500 = 80 per cent useful.',
        },
        {
          task: 'A 60-watt fan runs for 5 hours. How much energy does it use in watt-hours?',
          answer: '60 × 5 = 300 watt-hours (0.3 kilowatt-hours).',
        },
      ],
      support: ['Let learners feel the push between two magnets before reading Page 4.'],
      stretch: ['Take apart a broken toy motor with a teacher and find the magnet, the coil, and the sliding contacts.'],
      localise: ['Interview a corn-mill operator or a fridge repairer about what goes wrong with motors and how they fix them.'],
      factCheck: [
        {
          claim: 'Oersted’s 1820 discovery, electromagnet and commutator motor physics, medical motors, and electric two-/three-wheelers in Ghana.',
          explanation: 'Oersted’s 1820 compass experiment and DC motor principles are standard physics; electric motorcycles and tricycles operate in Accra, Kumasi, and Tamale.',
          reference: 'Standard physics reference / NaCCA Integrated Science curriculum (codes to verify)',
        },
      ],
    },
  }),

  // 6
  mk({
    key: 'the-long-journey-of-electricity',
    title: 'The Long Journey of Electricity',
    summary:
      'Electricity made at a dam reaches a socket hundreds of kilometres away almost at once. This article follows it through transformers and high-voltage lines, explains why such high voltages are used, and gives rules for safety.',
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
    paceWord: 'Steady, clear, and serious about safety',
    palette: ['#0f766e', '#dc2626'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Calm, flowing melody with a firm low drum (placeholder)',
    pages: [
      pg(
        '🏠',
        'A student in Bolgatanga presses a switch and the room fills with light. The electricity doing that work may have been made a moment earlier at Akosombo, at Bui, or at Aboadze on the coast, hundreds of kilometres away. It crossed forests, rivers, and savanna on wires hung from tall steel towers, and it arrived almost at once. Along the way its voltage was raised to a level that would kill instantly and then lowered again to a level a home can use. Why go to all that trouble? The answer is about saving energy.',
        'A map of Ghana with power stations marked in the south and lines of pylons running north to Bolgatanga.'
      ),
      pg(
        '🏭',
        'The journey starts in a power station, where turbines spin generators. The generators produce electricity at several thousand volts. Before it leaves, it passes through a transformer, a device that changes voltage. A step-up transformer raises the voltage to 161,000 volts or even 330,000 volts. The electricity then travels along thick cables carried by steel towers called pylons. Together, the power stations, lines, and transformers that cover the country form the national grid. In Ghana, the high-voltage lines are run by a company called GRIDCo. Almost none of the electricity is stored on the way: it is used at the moment it is made.',
        'A power station beside a large transformer, with thick cables rising to the first of a line of pylons.'
      ),
      pg(
        '🔥',
        'Here is the reason for the high voltage. When a current flows through a wire, the wire becomes warm, and that heat is wasted energy. A larger current wastes much more. Now, electrical power is voltage multiplied by current. So the same power can be sent in two ways: a low voltage with a large current, or a high voltage with a small current. Raise the voltage 25 times and the current needed falls to one twenty-fifth. With so small a current, the long wires stay cool and very little energy is lost on the journey.',
        'Two wires side by side: one glowing warm and carrying thick arrows, the other cool and carrying thin arrows.'
      ),
      pg(
        '🔌',
        'Such voltages are far too dangerous for a town. So near the end of the journey the electricity enters a substation, where step-down transformers lower the voltage. Distribution companies such as ECG in the south and NEDCo in the north carry it along streets at 33,000 or 11,000 volts. Finally, a transformer on a pole or in a fenced yard near your home lowers it to 230 volts for your sockets. The hum you hear from that grey box is the transformer at work. Even 230 volts can kill, so sockets and wires must still be treated with respect.',
        'A grey transformer mounted on a pole at the corner of a street, with wires running to nearby houses.'
      ),
      pg(
        '🐦',
        'Why can a bird sit on a bare wire? Current flows only when there is a difference in voltage to drive it. Both of the bird’s feet are on the same wire, at the same voltage, so almost no current passes through its body. If the bird touched a second wire, or a wire and the pole together, it would complete a circuit and die. People are in far greater danger, because we stand on the ground. A person who touches a live wire offers the current a path to earth through the body.',
        'Three small birds sitting in a row on one overhead wire against an evening sky.'
      ),
      pg(
        '⚠️',
        'The signs showing a lightning flash mean what they say. Never climb a pylon or enter a substation. Never fly a kite, raise a ladder, or carry a long metal pole near overhead lines. Never build, sell, or play under high-voltage lines. Stay far from any wire that has fallen, and report it. Illegal connections kill people every year and start fires that destroy markets and homes. Pay for what you use and let trained workers do the wiring. Electricity is a good servant that has travelled a long way to reach you. Do not let it become a dangerous master.',
        'A yellow triangular warning sign with a lightning flash, fixed to the fence of a substation.'
      ),
    ],
    activities: [
      {
        id: 'pl-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What does a step-up transformer do?',
        options: [
          'It raises the voltage',
          'It lowers the voltage',
          'It stores electricity for the night',
        ],
        correctIndex: 0,
      },
      {
        id: 'pl-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'Why is electricity sent across the country at a very high voltage?',
        options: [
          'High voltage travels faster',
          'The current is smaller, so less energy is wasted as heat in the wires',
          'Pylons work only at high voltage',
        ],
        correctIndex: 1,
      },
      {
        id: 'pl-c3',
        type: 'comprehension',
        afterPage: 5,
        question: 'Why is a bird on a single wire not harmed?',
        options: [
          'Birds do not conduct electricity',
          'The wire is covered with thick rubber',
          'Both feet are at the same voltage, so almost no current flows through the bird',
        ],
        correctIndex: 2,
      },
      {
        id: 'pl-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A neighbour offers to connect your house to the pole himself to avoid paying. Using the article, what is the best response?',
        options: [
          'Accept, because 230 volts is safe',
          'Refuse: illegal connections cause deaths and fires; ask the power company',
          'Accept, but only in the dry season',
        ],
        correctIndex: 1,
      },
      {
        id: 'pl-s1',
        type: 'sequencing',
        prompt: 'Follow electricity from the dam to your room. Put the stages in order.',
        items: [
          'A generator in the power station produces electricity',
          'A step-up transformer raises the voltage',
          'High-voltage lines on pylons carry it across the country',
          'A substation lowers the voltage for the town',
          'A transformer near your home lowers it to 230 volts',
        ],
      },
      {
        id: 'pl-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'transformer',
        definition: 'A device that raises or lowers voltage.',
        distractors: [
          'A tall steel tower that carries cables',
          'A machine that produces electricity from moving water',
        ],
      },
    ],
    glossary: [
      {
        word: 'voltage',
        definition: 'The push that drives electric charge along, measured in volts.',
        pages: [1, 2, 3, 4, 5],
      },
      {
        word: 'transformer',
        definition: 'A device that raises or lowers voltage.',
        pages: [2, 4],
      },
      {
        word: 'pylons',
        definition: 'Tall steel towers that carry high-voltage cables.',
        pages: [2],
      },
      {
        word: 'grid',
        definition: 'National grid: the network of power stations, lines, and transformers that supplies a country.',
        pages: [2],
      },
      {
        word: 'current',
        definition: 'The flow of electric charge.',
        pages: [3, 5],
      },
      {
        word: 'power',
        definition: 'The rate at which energy is transferred, measured in watts.',
        pages: [2, 3],
      },
      {
        word: 'substation',
        definition: 'A place where transformers change the voltage of the supply.',
        pages: [4, 6],
      },
    ],
    culturalNotes: [
      'BECE link: electricity; generation and transmission of electrical energy; conversion of energy; safe use of electricity.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: GRIDCo operates Ghana’s transmission lines; ECG distributes power in the south and NEDCo in the north. Mains supply to homes is 230 volts. Markets and homes in Ghana have been lost to fires linked to faulty or illegal wiring.',
    ],
    reviewQuestions: [
      'Ask the local electricity office to confirm the distribution voltages on Page 4.',
      'Keep every safety rule on Page 6; do not shorten the list.',
    ],
    guide: {
      overview:
        'Follows electricity from generator to socket, explains why transmission uses very high voltage, and gives firm safety rules.',
      lessonMinutes: 45,
      goals: [
        'Describe the stages from power station to home.',
        'State what step-up and step-down transformers do.',
        'Explain why high voltage reduces energy loss.',
        'List safety rules for power lines, substations, and connections.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: energy: electricity generation, transmission, and safety; codes to verify)', 'The national grid and transformers'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Multiplication and division; using power = voltage × current'],
      ],
      before: ['Ask: where is the electricity in this room made? Trace learners’ ideas on the board.'],
      during: ['After Page 3, work the two “Work it out” sums together and compare the currents.'],
      after: ['Walk round the school compound (at a safe distance) and identify the pole transformer and the service wires.'],
      discussion: ['Why do people make illegal connections even though they know the danger? What would change this?'],
      reflection: ['Which safety rule will you explain to someone at home tonight?'],
      maths: [
        {
          task: 'A kettle is rated 2,300 watts and works on 230 volts. What current does it take? (power = voltage × current)',
          answer: '2,300 ÷ 230 = 10 amperes.',
        },
        {
          task: 'A power station must send 1,000,000 watts. What current is needed at 10,000 volts, and at 250,000 volts?',
          answer: '1,000,000 ÷ 10,000 = 100 amperes; 1,000,000 ÷ 250,000 = 4 amperes.',
        },
      ],
      support: ['Give learners five picture cards of the journey to arrange on a string “power line” across the room.'],
      stretch: ['Find out why transformers work with the kind of current supplied by the grid but not with the steady current from a battery.'],
      localise: ['Find out which company supplies your town and what number to call to report a fallen wire.'],
      factCheck: [
        {
          claim: 'GRIDCo transmission voltages (161 kV and 330 kV), ECG / NEDCo distribution voltages (33 kV, 11 kV), and 230 V domestic supply.',
          explanation: 'Transmission voltages (330,000 V and 161,000 V) checked against GRIDCo reports in November 2026; 33 kV / 11 kV primary distribution and 230 V single-phase supply are standard in Ghana.',
          reference: 'Ghana Grid Company (GRIDCo) / Energy Commission of Ghana / NaCCA curriculum (codes to verify)',
        },
      ],
    },
  }),

  // 7
  mk({
    key: 'the-discovery-inside-the-atom',
    title: 'The Discovery Inside the Atom',
    summary:
      'A speck of gold dust holds more atoms than anyone could count. This article explains what is inside an atom, how scientists learned to split it, and why that discovery brought both great danger and great benefit.',
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
    paceWord: 'Serious, clear, and reflective',
    palette: ['#a16207', '#1e3a8a'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Slow, thoughtful strings with a distant drum (placeholder)',
    pages: [
      pg(
        '✨',
        'Imagine one speck of gold dust from Obuasi on the tip of a pin. Cut it in half, then in half again, and keep going. Could you go on for ever? About 2,400 years ago, a Greek thinker named Democritus said no. He believed you would finally reach a piece too small to be cut, and he called it an atom. He had no way to test the idea. Today we know that atoms are real. That one speck of gold contains more atoms than there are grains of sand on all the beaches of Ghana.',
        'A single bright speck of gold on the tip of a pin, greatly enlarged.'
      ),
      pg(
        '⚛️',
        'An atom is not a solid ball. In 1911, Ernest Rutherford showed that it is mostly empty space. At the centre is a tiny, heavy nucleus, made of particles called protons and neutrons. Protons have a positive charge, and neutrons have none. Far outside the nucleus move the electrons, which are very light and negatively charged. If an atom were the size of the Baba Yara Stadium in Kumasi, the nucleus would be a small bead on the centre spot. Yet almost all of the mass of the atom is packed into that bead.',
        'A simple drawing of an atom with a small central nucleus of red and blue particles and electrons moving far around it.'
      ),
      pg(
        '💥',
        'In 1938, in Germany, Otto Hahn fired neutrons at uranium, the heaviest atom found in nature, and was puzzled to find a much lighter element among the products. He wrote to Lise Meitner, a physicist who had worked beside him for thirty years. She was Jewish and had fled from Germany to Sweden to escape the Nazis. Meitner worked out what had happened. The uranium nucleus had split in two, releasing a great deal of energy. The process was named nuclear fission. Hahn alone received a Nobel Prize for it. Many scientists think Meitner should have shared it.',
        'A large nucleus being struck by a small particle and splitting into two smaller pieces with a burst of light.'
      ),
      pg(
        '⛓️',
        'Each uranium nucleus that splits also throws out two or three neutrons. If these strike other nuclei, those split as well, and release more neutrons, and so on. This is a chain reaction. Controlled carefully, it gives steady heat. Let loose, it gives an explosion. The Second World War had begun, and scientists feared that Germany would build such a bomb first. The United States gathered thousands of scientists in a secret project to build one. Meitner was invited to join. She refused, saying she would have nothing to do with a bomb.',
        'One splitting nucleus sending out particles that split two more, which split four more, spreading like branches.'
      ),
      pg(
        '🕊️',
        'In August 1945, American aircraft dropped atomic bombs on two Japanese cities, Hiroshima and Nagasaki. Well over 100,000 people died, most of them ordinary families, and many survivors suffered for the rest of their lives. The war ended days later, but the world had changed. Other countries built their own bombs. By 1986 there were about 70,000 nuclear warheads. Treaties have since reduced the number: in January 2026 nine countries held about 12,200 between them. That is far fewer, but still enough to destroy civilisation, and the fall in numbers has almost stopped.',
        'A white dove flying above a quiet riverside memorial park with a ruined dome in the distance.'
      ),
      pg(
        '🌍',
        'The same knowledge also serves life. Controlled fission produces electricity in power stations, and materials made in reactors are used to find and treat cancer. Africa has made a clear choice. Under a treaty that came into force in 2009, the whole continent is a zone free of nuclear weapons, and Ghana is a member. Kwame Nkrumah set up the Ghana Atomic Energy Commission at Kwabenya in 1963 to use the atom for health, farming, and energy. Knowledge itself is neither good nor bad. What matters is what people decide to do with it. Soon, some of those decisions will be yours.',
        'A low research building among trees with a sign and the Ghana flag flying at the gate.'
      ),
    ],
    activities: [
      {
        id: 'at-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'Where is most of the mass of an atom found?',
        options: [
          'In the electrons',
          'Spread evenly through the atom',
          'In the nucleus',
        ],
        correctIndex: 2,
      },
      {
        id: 'at-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What is nuclear fission?',
        options: [
          'The splitting of a heavy nucleus into two smaller ones, releasing energy',
          'The joining of two atoms to make gold',
          'The movement of electrons round a circuit',
        ],
        correctIndex: 0,
      },
      {
        id: 'at-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'What keeps a chain reaction going?',
        options: [
          'Heat from the Sun',
          'Neutrons released by each splitting nucleus go on to split others',
          'Electrons jumping between atoms',
        ],
        correctIndex: 1,
      },
      {
        id: 'at-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A classmate says, “Nuclear science is evil and should never have been discovered.” Which reply is best supported by the article?',
        options: [
          'Agree, because it has only ever been used for bombs',
          'It also serves power and medicine; what matters is how people choose to use it',
          'Disagree, because the bombs harmed nobody',
        ],
        correctIndex: 1,
      },
      {
        id: 'at-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'Democritus suggests that matter is made of atoms',
          'Rutherford shows that the atom has a tiny nucleus',
          'Hahn and Meitner discover nuclear fission',
          'Atomic bombs are dropped on Hiroshima and Nagasaki',
          'Africa becomes a zone free of nuclear weapons',
        ],
      },
      {
        id: 'at-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'nucleus',
        definition: 'The tiny, heavy centre of an atom, made of protons and neutrons.',
        distractors: [
          'The empty space inside an atom',
          'A particle with a negative charge',
        ],
      },
    ],
    glossary: [
      {
        word: 'atom',
        definition: 'The smallest particle of an element.',
        pages: [1, 2, 3, 6],
      },
      {
        word: 'nucleus',
        definition: 'The tiny, heavy centre of an atom.',
        pages: [2, 3, 4],
      },
      {
        word: 'protons',
        definition: 'Positively charged particles in the nucleus.',
        pages: [2],
      },
      {
        word: 'neutrons',
        definition: 'Particles in the nucleus that have no charge.',
        pages: [2, 3, 4],
      },
      {
        word: 'electrons',
        definition: 'Very light, negatively charged particles that move around the nucleus.',
        pages: [2],
      },
      {
        word: 'fission',
        definition: 'Nuclear fission: the splitting of a heavy nucleus into two smaller ones, releasing energy.',
        pages: [3, 6],
      },
      {
        word: 'reaction',
        definition: 'Chain reaction: a process in which each splitting nucleus causes more nuclei to split.',
        pages: [4],
      },
    ],
    culturalNotes: [
      'BECE link: matter; the structure of the atom (protons, neutrons, and electrons); science, technology, and society.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: Obuasi is Ghana’s best-known gold-mining town; Baba Yara is the national sports stadium in Kumasi. The Ghana Atomic Energy Commission is at Kwabenya, Accra. Handle Page 5 with care: it describes the deaths of civilians.',
    ],
    reviewQuestions: [
      'Update the number of warheads on Page 5 each year from the latest published estimate.',
      'Confirm the treaty and commission dates on Page 6 with a history or science reviewer.',
    ],
    guide: {
      overview:
        'Teaches the structure of the atom and the idea of fission, then uses the history of the atomic bomb to discuss the responsibility of scientists and citizens.',
      lessonMinutes: 45,
      goals: [
        'Name the three particles in an atom and state where each is found.',
        'Describe the atom as mostly empty space with a tiny, heavy nucleus.',
        'Explain fission and a chain reaction in simple terms.',
        'Discuss the responsibility that comes with scientific knowledge.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: matter: atoms and their structure; codes to verify)', 'Protons, neutrons, electrons, and the nucleus'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Subtraction with large numbers; simple counting of particles'],
      ],
      before: ['Tear a sheet of paper in half again and again. Ask: if we had perfect tools, could we go on for ever?'],
      during: ['After Page 2, learners draw an atom of carbon with 6 protons, 6 neutrons, and 6 electrons.'],
      after: ['Class discussion using the two questions under “Discuss”, with every learner giving one reason.'],
      discussion: ['How far are scientists responsible for the way their discoveries are used? Was Meitner right to refuse?'],
      reflection: ['Name one piece of knowledge you have that could help or harm. How will you use it?'],
      maths: [
        {
          task: 'There were about 70,000 nuclear warheads in 1986 and about 12,200 in 2026. By how many has the number fallen?',
          answer: '70,000 − 12,200 = 57,800.',
        },
        {
          task: 'A carbon atom has 6 protons and 6 neutrons in its nucleus. How many particles are in the nucleus, and how many electrons balance the charge?',
          answer: '12 particles in the nucleus; 6 electrons.',
        },
      ],
      support: ['Build an atom on the floor: learners as protons and neutrons huddle in the centre while “electrons” walk round the edge of the room.'],
      stretch: ['Find out who discovered the neutron and why it was harder to find than the proton and the electron.'],
      localise: ['Find out one service the Ghana Atomic Energy Commission provides to hospitals, farmers, or industry.'],
      factCheck: [
        {
          claim: 'Global warhead inventory (~12,200 in January 2026 down from ~70,000 in 1986), 2009 Treaty of Pelindaba entry into force, and 1963 founding of GAEC at Kwabenya.',
          explanation: 'Warhead total (~12,187 in January 2026 across nine states) checked against FAS/SIPRI estimates in November 2026; Treaty of Pelindaba entered into force in 2009; GAEC was established in 1963.',
          reference: 'Federation of American Scientists (2026) / Ghana Atomic Energy Commission / NaCCA curriculum (codes to verify)',
        },
      ],
    },
  }),

  // 8
  mk({
    key: 'the-glow-that-was-not-safe',
    title: 'The Glow That Was Not Safe',
    summary:
      'A hundred years ago, people believed a glowing new element was good for them. This article explains radioactivity through the story of the factory women who painted watch dials with radium, and shows how radiation is used safely today.',
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
    paceWord: 'Quiet, clear, and respectful',
    palette: ['#15803d', '#374151'],
    voice: 'One clear, warm narrator throughout; no character voices',
    characters: [],
    music: 'Soft, slow piano with a faint ticking rhythm (placeholder)',
    pages: [
      pg(
        '⌚',
        'Some watches have hands and numbers that shine pale green in the dark, so you can read the time at night without a lamp. Today the paint that glows is harmless. It simply soaks up light and gives it out again slowly. A hundred years ago, the glow came from something very different: a newly discovered metal called radium, which shone by itself day and night for years on end. People thought it was a wonder. The story of the women who painted it onto watch faces changed the way the world protects its workers.',
        'A wristwatch in a dark room with its hands and numbers glowing pale green.'
      ),
      pg(
        '🧪',
        'In 1896, the French scientist Henri Becquerel found that a rock containing uranium darkened a photographic plate even when wrapped in black paper. Something invisible was coming out of it. Marie Curie named this effect radioactivity. In 1898, she and her husband Pierre discovered radium, which was far more active than uranium. We now know that some atoms have an unstable nucleus. Sooner or later it breaks down and shoots out radiation. This radiation carries enough energy to damage living cells. Nothing you do to the material, such as heating, cooling, or crushing it, can switch it off.',
        'A woman scientist in a long dark dress working at a bench crowded with glass flasks and a balance.'
      ),
      pg(
        '💄',
        'Doctors soon found that radium could shrink cancer tumours. From this, many people leapt to a false idea: that radium must be healthy for everybody. Companies sold radium water, radium toothpaste, and radium face creams that promised a youthful glow. Nobody had tested them. Meanwhile, the scientists who handled radium every day were becoming ill. Marie Curie herself died in 1934 of a blood disease caused by years of exposure. Her notebooks are still radioactive today and are kept in lead-lined boxes. The danger was real, but it took years to show.',
        'A shelf of old-fashioned jars and bottles with labels showing sun rays and sparkles.'
      ),
      pg(
        '🖌️',
        'From 1917, factories in the United States hired thousands of young women to paint watch and clock dials with glowing radium paint. The pay was good and the work was clean. To paint fine numbers, the women were told to bring the brush to a point between their lips, again and again, hundreds of times a day. Each time, they swallowed a little radium. They were told it was harmless. The body treats radium like calcium and stores it in the bones. There it stays, giving out radiation from the inside for the rest of a person’s life.',
        'A row of young women in a 1920s workshop painting small clock faces at a long table by the windows.'
      ),
      pg(
        '⚖️',
        'Within a few years, the women’s teeth fell out and their jaws and bones began to crumble. Many developed cancers, and some died. The factory owners denied that radium was to blame. Five sick women took one company to court and won a settlement in 1928. Another case went on until 1939. Their courage changed the law. Employers became responsible for illnesses caused by work, and safety limits for radiation were set. Ask who pays the price today when workers are not told the truth about dust, chemicals, or the mercury used in illegal gold mining.',
        'A wooden courtroom with a judge’s bench and a small group of women seated together at the front.'
      ),
      pg(
        '☢️',
        'Radiation is not only man-made. A little reaches us all the time from rocks, soil, food, and space. This is called background radiation, and our bodies cope with it. Used with care, stronger radiation does great good. Hospitals use it to find and treat disease. At Kwabenya, near Accra, a radiation facility sterilises medical supplies and helps to preserve food. Three rules keep workers safe: spend as little time near the source as possible, keep your distance, and put shielding such as lead or thick concrete in between. Radiation is safe when science, honesty, and the law work together.',
        'A worker in a white coat wearing a small badge on the chest, standing behind a thick window and operating controls.'
      ),
    ],
    activities: [
      {
        id: 'rg-c1',
        type: 'comprehension',
        afterPage: 2,
        question: 'What is radioactivity?',
        options: [
          'The giving out of radiation by unstable nuclei',
          'The glow of paint that has soaked up light',
          'Heat produced by rubbing two metals together',
        ],
        correctIndex: 0,
      },
      {
        id: 'rg-c2',
        type: 'comprehension',
        afterPage: 3,
        question: 'What mistake did people make about radium in the early 1900s?',
        options: [
          'They believed it was too rare to use',
          'They thought it could not glow',
          'They assumed that because it treated cancer it must be healthy for everyone',
        ],
        correctIndex: 2,
      },
      {
        id: 'rg-c3',
        type: 'comprehension',
        afterPage: 4,
        question: 'Why did swallowed radium do so much harm?',
        options: [
          'It dissolved the stomach at once',
          'The body stored it in the bones, where it gave out radiation for life',
          'It stopped the women from breathing',
        ],
        correctIndex: 1,
      },
      {
        id: 'rg-c4',
        type: 'comprehension',
        afterPage: 6,
        question: 'Apply it: A worker must check a radioactive source in a factory. Which plan follows the three safety rules?',
        options: [
          'Work quickly, use long-handled tools, and stand behind a lead screen',
          'Hold the source close to see it clearly and take plenty of time',
          'Carry the source in a shirt pocket',
        ],
        correctIndex: 0,
      },
      {
        id: 'rg-s1',
        type: 'sequencing',
        prompt: 'Put these events in order, from earliest to latest.',
        items: [
          'Becquerel notices invisible rays from uranium',
          'Marie and Pierre Curie discover radium',
          'Factories hire women to paint dials with radium paint',
          'Five sick workers win a settlement in court',
          'Marie Curie dies of an illness caused by radiation',
        ],
      },
      {
        id: 'rg-voc',
        type: 'vocabulary',
        afterPage: 2,
        word: 'radiation',
        definition: 'Energy sent out as rays or fast particles, for example from unstable nuclei.',
        distractors: [
          'A glow that comes from fresh paint',
          'A metal used to make watch cases',
        ],
      },
    ],
    glossary: [
      {
        word: 'radium',
        definition: 'A radioactive metal that glows faintly in the dark.',
        pages: [1, 2, 3, 4, 5],
      },
      {
        word: 'radioactivity',
        definition: 'The giving out of radiation by unstable nuclei.',
        pages: [2],
      },
      {
        word: 'nucleus',
        definition: 'The tiny, heavy centre of an atom.',
        pages: [2],
      },
      {
        word: 'radiation',
        definition: 'Energy sent out as rays or fast particles.',
        pages: [2, 4, 5, 6],
      },
      {
        word: 'background',
        definition: 'Background radiation: the low level of radiation that is always around us from natural sources.',
        pages: [6],
      },
      {
        word: 'shielding',
        definition: 'Material such as lead or concrete placed between a person and a source of radiation.',
        pages: [6],
      },
    ],
    culturalNotes: [
      'BECE link: matter and the atom (enrichment: radioactivity); health and safety at work; science, technology, and society.',
      'Original article written for Ghanaian JHS learners. It grows from a topic in a published textbook but copies none of its text, questions, or examples.',
      'Local accuracy: the Ghana Atomic Energy Commission operates a gamma irradiation facility at Kwabenya. Mercury is used in illegal small-scale gold mining (galamsey) and harms miners and communities; the comparison on Page 5 is deliberate.',
    ],
    reviewQuestions: [
      'Radioactivity may go beyond the JHS syllabus; use as enrichment and confirm with the science teacher.',
      'Handle Pages 4 and 5 with care: they describe serious illness and death.',
    ],
    guide: {
      overview:
        'Introduces radioactivity through the history of radium, the dial painters, and the safety laws that followed, ending with safe uses of radiation in Ghana.',
      lessonMinutes: 45,
      goals: [
        'State that some atoms have unstable nuclei that give out radiation.',
        'Explain why swallowed radium was so harmful.',
        'Describe how the dial painters’ case changed safety at work.',
        'State the three rules of protection: time, distance, and shielding.',
      ],
      subjects: [
        ['Integrated Science (NaCCA CCP: matter: atoms; science and society; codes to verify)', 'Radioactivity, its dangers, and its safe uses'],
        ['Mathematics (NaCCA CCP: number, ratio, and rates; codes to verify)', 'Halving; subtraction with dates'],
      ],
      before: ['Show or describe a watch that glows in the dark. Ask: where do you think the light comes from?'],
      during: ['After Page 3, ask: what should have been done before radium products were sold to the public?'],
      after: ['Learners write a short safety notice for a workplace of their choice, telling workers the truth about one hazard.'],
      discussion: ['Why did the factory owners tell the workers that the paint was harmless? Could the same thing happen today?'],
      reflection: ['What question would you ask before taking a job that uses a chemical you do not know?'],
      maths: [
        {
          task: 'Half of any amount of radium breaks down in 1,600 years. If you start with 80 grams, how much is left after 1,600 years, and after 3,200 years?',
          answer: '40 grams after 1,600 years; 20 grams after 3,200 years.',
        },
        {
          task: 'Radium was discovered in 1898, and the last court case ended in 1939. How many years passed between them?',
          answer: '1939 − 1898 = 41 years.',
        },
      ],
      support: ['Tell the story aloud with a simple five-picture timeline before learners read.'],
      stretch: ['Find out the names of the three main kinds of radiation and what material stops each one.'],
      localise: ['Find out what protective equipment workers near you are given: at a mine, a quarry, a spraying gang, or an X-ray room.'],
      factCheck: [
        {
          claim: 'Becquerel (1896), Curies (1898), Radium Girls settlements (1928, 1939), Marie Curie’s death (1934), Ra-226 half-life (~1,600 years), and GAEC Kwabenya irradiation facility.',
          explanation: 'Historical dates, Ra-226 half-life (~1,600 years), and GAEC’s Gamma Irradiation Facility (GIF) at Kwabenya for medical sterilisation and food preservation are verified.',
          reference: 'IAEA / Ghana Atomic Energy Commission / NaCCA Integrated Science curriculum (codes to verify)',
        },
      ],
    },
  }),
];

